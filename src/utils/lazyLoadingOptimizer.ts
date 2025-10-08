/**
 * 懒加载优化工具
 * 
 * 为非关键功能提供按需加载和延迟初始化机制，
 * 减少初始加载时间和内存占用。
 */

import { simpleError } from './logUtils';

export interface LazyModule<T = any> {
  /** 模块ID */
  id: string;
  /** 模块加载函数 */
  loader: () => Promise<T>;
  /** 是否已加载 */
  loaded: boolean;
  /** 是否正在加载 */
  loading: boolean;
  /** 加载失败的次数 */
  failureCount: number;
  /** 最后加载时间 */
  lastLoadTime?: number;
  /** 模块实例 */
  instance?: T;
  /** 依赖的其他模块 */
  dependencies: string[];
  /** 优先级 */
  priority: number;
  /** 加载超时时间 */
  timeout: number;
}

export interface LoadingConfig {
  /** 最大并发加载数 */
  maxConcurrency: number;
  /** 重试次数 */
  maxRetries: number;
  /** 默认超时时间 */
  defaultTimeout: number;
  /** 预加载策略 */
  preloadStrategy: 'none' | 'idle' | 'visible' | 'aggressive';
  /** 是否启用缓存 */
  enableCache: boolean;
  /** 是否启用压缩 */
  enableCompression: boolean;
}

export interface LoadingProgress {
  /** 总数 */
  total: number;
  /** 已加载 */
  loaded: number;
  /** 加载中 */
  loading: number;
  /** 失败 */
  failed: number;
  /** 进度百分比 */
  progress: number;
}

export class LazyLoadingOptimizer {
  private modules: Map<string, LazyModule> = new Map();
  private config: LoadingConfig;
  private loadingQueue: Array<() => Promise<any>> = [];
  private activeLoaders: number = 0;
  private observers: Map<string, IntersectionObserver> = new Map();
  private idleCallbackId: number | null = null;
  
  constructor(config: Partial<LoadingConfig> = {}) {
    this.config = {
      maxConcurrency: 3,
      maxRetries: 3,
      defaultTimeout: 10000,
      preloadStrategy: 'idle',
      enableCache: true,
      enableCompression: false,
      ...config
    };
    
    this.setupPreloadStrategy();
  }
  
  /**
   * 注册懒加载模块
   */
  registerModule<T>(
    id: string,
    loader: () => Promise<T>,
    options: {
      dependencies?: string[];
      priority?: number;
      timeout?: number;
      autoLoad?: boolean;
    } = {}
  ): void {
    const module: LazyModule<T> = {
      id,
      loader,
      loaded: false,
      loading: false,
      failureCount: 0,
      dependencies: options.dependencies || [],
      priority: options.priority || 0,
      timeout: options.timeout || this.config.defaultTimeout,
      lastLoadTime: undefined,
      instance: undefined
    };
    
    this.modules.set(id, module);
    
    // 自动加载高优先级模块
    if (options.autoLoad !== false && module.priority >= 8) {
      this.loadModule(id).catch(error => {
        simpleError(`Auto-loading module ${id} failed:`, error);
      });
    }
  }
  
  /**
   * 加载模块
   */
  async loadModule<T>(id: string): Promise<T> {
    const module = this.modules.get(id);
    if (!module) {
      throw new Error(`Module ${id} not found`);
    }
    
    // 已加载
    if (module.loaded && module.instance) {
      return module.instance;
    }
    
    // 正在加载
    if (module.loading) {
      return new Promise<T>((resolve, reject) => {
        const checkLoading = () => {
          if (module.loaded && module.instance) {
            resolve(module.instance);
          } else if (!module.loading && module.failureCount > this.config.maxRetries) {
            reject(new Error(`Module ${id} failed to load after ${this.config.maxRetries} retries`));
          } else {
            setTimeout(checkLoading, 100);
          }
        };
        checkLoading();
      });
    }
    
    // 检查依赖
    for (const depId of module.dependencies) {
      await this.loadModule(depId);
    }
    
    return this.executeLoad<T>(module);
  }
  
  /**
   * 异步加载模块（延迟加载）
   */
  async lazyLoadModule<T>(
    id: string,
    trigger: 'immediate' | 'idle' | 'visible' | 'user_interaction' = 'idle'
  ): Promise<T> {
    switch (trigger) {
    
      case 'immediate':
        return this.loadModule<T>(id);
      
      case 'idle':
        return this.loadOnIdle<T>(id);
      
      case 'visible':
        return this.loadOnVisible<T>(id);
      
      case 'user_interaction':
        return this.loadOnInteraction<T>(id);
      
      default:
        return this.loadModule<T>(id);
    }
  }
  
  /**
   * 批量加载模块
   */
  async loadModules(ids: string[]): Promise<any[]> {
    const toLoad = ids.filter(id => {
      const module = this.modules.get(id);
      return module && !module.loaded;
    });
    
    if (toLoad.length === 0) {
      return [];
    }
    
    // 按优先级排序
    toLoad.sort((a, b) => {
      const moduleA = this.modules.get(a)!;
      const moduleB = this.modules.get(b)!;
      return moduleB.priority - moduleA.priority;
    });
    
    const results: any[] = [];
    const promises: Promise<any>[] = [];
    
    for (const id of toLoad) {
      if (promises.length >= this.config.maxConcurrency) {
        await Promise.race(promises);
      }
      
      const promise = this.loadModule(id);
      promises.push(promise);
      results.push(promise);
    }
    
    return Promise.all(results);
  }
  
  /**
   * 预加载模块
   */
  async preloadModules(ids: string[]): Promise<void> {
    const toPreload = ids.filter(id => {
      const module = this.modules.get(id);
      return module && !module.loaded && !module.loading;
    });
    
    if (toPreload.length === 0) {
      return;
    }
    
    // 使用低优先级异步加载
    for (const id of toPreload) {
      this.loadModule(id).catch(() => {
        // 预加载失败不算错误
      });
    }
  }
  
  /**
   * 获取模块状态
   */
  getModuleStatus(id: string): 'not_found' | 'loaded' | 'loading' | 'failed' {
    const module = this.modules.get(id);
    if (!module) return 'not_found';
    if (module.loaded) return 'loaded';
    if (module.loading) return 'loading';
    if (module.failureCount > this.config.maxRetries) return 'failed';
    return 'not_found';
  }
  
  /**
   * 获取所有模块状态
   */
  getAllModuleStatus(): Record<string, string> {
    const status: Record<string, string> = {};
    this.modules.forEach((module, id) => {
      status[id] = this.getModuleStatus(id);
    });
    return status;
  }
  
  /**
   * 获取加载进度
   */
  getLoadingProgress(): LoadingProgress {
    const modules = Array.from(this.modules.values());
    const total = modules.length;
    const loaded = modules.filter(m => m.loaded).length;
    const loading = modules.filter(m => m.loading).length;
    const failed = modules.filter(m => m.failureCount > this.config.maxRetries).length;
    
    return {
      total,
      loaded,
      loading,
      failed,
      progress: total > 0 ? Math.round((loaded / total) * 100) : 100
    };
  }
  
  /**
   * 卸载模块
   */
  unloadModule(id: string): boolean {
    const module = this.modules.get(id);
    if (!module || !module.loaded) {
      return false;
    }
    
    module.loaded = false;
    module.instance = undefined;
    module.lastLoadTime = undefined;
    
    return true;
  }
  
  /**
   * 清理所有模块
   */
  cleanup(): void {
    // 停止所有观察者
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    // 取消空闲回调
    if (this.idleCallbackId) {
      cancelIdleCallback(this.idleCallbackId);
      this.idleCallbackId = null;
    }
    
    // 清理模块缓存
    this.modules.clear();
    this.loadingQueue = [];
  }
  
  /**
   * 检查是否有未加载的依赖
   */
  async checkDependencies(id: string): Promise<boolean> {
    const module = this.modules.get(id);
    if (!module) return false;
    
    for (const depId of module.dependencies) {
      const depStatus = this.getModuleStatus(depId);
      if (!['loaded'].includes(depStatus)) {
        await this.loadModule(depId);
      }
    }
    
    return true;
  }
  
  /**
   * 监听加载进度变化
   */
  onProgressChange(callback: (progress: LoadingProgress) => void): () => void {
    const interval = setInterval(() => {
      callback(this.getLoadingProgress());
    }, 1000);
    
    return () => clearInterval(interval);
  }
  
  /**
   * 配置更新
   */
  updateConfig(newConfig: Partial<LoadingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setupPreloadStrategy();
  }
  
  private async loadOnIdle<T>(id: string): Promise<T> {
    return new Promise<T>((resolve) => {
      const scheduleIdle = (deadline: IdleDeadline) => {
        if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
          this.loadModule<T>(id).then(resolve);
        } else {
          requestIdleCallback(scheduleIdle);
        }
      };
      
      requestIdleCallback(scheduleIdle);
    });
  }
  
  private async loadOnVisible<T>(id: string): Promise<T> {
    return new Promise<T>((resolve) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.disconnect();
              this.loadModule<T>(id).then(resolve);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      // 监听页面可见性
      observer.observe(document.body);
      
      // 30秒后强制加载
      setTimeout(() => {
        observer.disconnect();
        this.loadModule<T>(id).then(resolve);
      }, 30000);
    });
  }
  
  private async loadOnInteraction<T>(id: string): Promise<T> {
    return new Promise<T>((resolve) => {
      const handleInteraction = () => {
        removeEventListener('click', handleInteraction);
        removeEventListener('keydown', handleInteraction);
        removeEventListener('scroll', handleInteraction);
        removeEventListener('mousemove', handleInteraction);
        removeEventListener('touchstart', handleInteraction);
        
        this.loadModule<T>(id).then(resolve);
      };
      
      addEventListener('click', handleInteraction);
      addEventListener('keydown', handleInteraction);
      addEventListener('scroll', handleInteraction);
      addEventListener('mousemove', handleInteraction);
      addEventListener('touchstart', handleInteraction);
      
      // 30秒后自动加载
      setTimeout(() => {
        handleInteraction();
      }, 30000);
    });
  }
  
  private async executeLoad<T>(module: LazyModule<T>): Promise<T> {
    module.loading = true;
    module.failureCount++;
    
    try {
      const result = await Promise.race([
        module.loader(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`Module ${module.id} timeout`)), module.timeout)
        )
      ]);
      
      module.loaded = true;
      module.loading = false;
      module.instance = result;
      module.lastLoadTime = Date.now();
      module.failureCount = 0; // 重置失败计数
      
      return result;
    } catch (error) {
      module.loading = false;
      
      if (module.failureCount <= this.config.maxRetries) {
        // 重试
        const delay = Math.min(1000 * Math.pow(2, module.failureCount - 1), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeLoad(module);
      } else {
        module.failureCount = this.config.maxRetries + 1;
        throw new Error(`Module ${module.id} failed to load: ${error}`);
      }
    }
  }
  
  private setupPreloadStrategy(): void {
    switch (this.config.preloadStrategy) {
      case 'idle':
        this.scheduleIdlePreload();
        break;
      case 'visible':
        this.scheduleVisiblePreload();
        break;
      case 'aggressive':
        this.scheduleAggressivePreload();
        break;
      default:
        break;
    }
  }
  
  private scheduleIdlePreload(): void {
    if (this.idleCallbackId) {
      cancelIdleCallback(this.idleCallbackId);
    }
    
    this.idleCallbackId = requestIdleCallback(() => {
      const highPriorityModules = Array.from(this.modules.values())
        .filter(m => m.priority >= 7 && !m.loaded && !m.loading)
        .map(m => m.id);
      
      if (highPriorityModules.length > 0) {
        this.preloadModules(highPriorityModules);
      }
      
      this.idleCallbackId = null;
    });
  }
  
  private scheduleVisiblePreload(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const moduleIds = Array.from(this.modules.keys())
              .filter(id => {
                const module = this.modules.get(id)!;
                return !module.loaded && !module.loading && module.priority >= 5;
              });
            
            if (moduleIds.length > 0) {
              this.preloadModules(moduleIds.slice(0, 3)); // 最多预加载3个
            }
          }
        });
      },
      { rootMargin: '100px' }
    );
    
    observer.observe(document.body);
    this.observers.set('visible_preload', observer);
  }
  
  private scheduleAggressivePreload(): void {
    // 立即预加载所有高优先级模块
    const highPriorityModules = Array.from(this.modules.entries())
      .filter(([, module]) => module.priority >= 8 && !module.loaded && !module.loading)
      .map(([id]) => id);
    
    if (highPriorityModules.length > 0) {
      this.loadModules(highPriorityModules);
    }
  }
  
  private removeEventListener(event: string, handler: EventListener): void {
    document.removeEventListener(event, handler, { capture: true } as any);
  }
}
