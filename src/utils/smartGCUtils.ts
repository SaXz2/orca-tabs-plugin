/**
 * 智能垃圾回收管理器
 * 
 * 提供智能的内存管理和垃圾回收功能
 * 自动清理不再使用的资源，防止内存泄漏
 */

/**
 * 垃圾回收策略
 */
interface GCStrategy {
  name: string;
  priority: number;
  condition: (context: GCContext) => boolean;
  action: (context: GCContext) => void;
}

/**
 * 垃圾回收上下文
 */
interface GCContext {
  memoryUsage: number;
  memoryLimit: number;
  elementCount: number;
  cacheSize: number;
  lastGC: number;
  timeSinceLastGC: number;
}

/**
 * 资源引用
 */
interface ResourceReference {
  id: string;
  type: 'element' | 'cache' | 'listener' | 'timer' | 'data';
  element?: HTMLElement;
  data?: any;
  lastAccessed: number;
  accessCount: number;
  size: number;
}

/**
 * 垃圾回收统计
 */
interface GCStats {
  totalCollected: number;
  memoryFreed: number;
  lastGCTime: number;
  gcCount: number;
  averageGCTime: number;
  strategiesUsed: string[];
}

/**
 * 智能垃圾回收管理器
 */
export class SmartGarbageCollector {
  private strategies: GCStrategy[] = [];
  private resourceReferences = new Map<string, ResourceReference>();
  private gcStats: GCStats = {
    totalCollected: 0,
    memoryFreed: 0,
    lastGCTime: 0,
    gcCount: 0,
    averageGCTime: 0,
    strategiesUsed: []
  };
  private isRunning = false;
  private gcInterval: number | null = null;
  private memoryThreshold = 0.8; // 80%内存使用率触发GC
  private maxResourceAge = 5 * 60 * 1000; // 5分钟
  
  constructor() {
    this.initializeGCStrategies();
    this.startGCMonitoring();
  }
  
  /**
   * 初始化垃圾回收策略
   */
  private initializeGCStrategies(): void {
    this.strategies = [
      {
        name: 'unused_elements',
        priority: 90,
        condition: (context) => context.elementCount > 100,
        action: (context) => this.collectUnusedElements()
      },
      {
        name: 'expired_cache',
        priority: 85,
        condition: (context) => context.cacheSize > 50,
        action: (context) => this.collectExpiredCache()
      },
      {
        name: 'memory_pressure',
        priority: 95,
        condition: (context) => context.memoryUsage / context.memoryLimit > this.memoryThreshold,
        action: (context) => this.collectMemoryPressure()
      },
      {
        name: 'old_resources',
        priority: 70,
        condition: (context) => context.timeSinceLastGC > 30000, // 30秒
        action: (context) => this.collectOldResources()
      },
      {
        name: 'event_listeners',
        priority: 80,
        condition: (context) => this.getEventListenerCount() > 200,
        action: (context) => this.collectUnusedEventListeners()
      }
    ];
  }
  
  /**
   * 开始垃圾回收监控
   */
  private startGCMonitoring(): void {
    // 定期检查内存使用情况
    this.gcInterval = window.setInterval(() => {
      this.checkMemoryUsage();
    }, 10000); // 每10秒检查一次
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.performGC('page_hidden');
      }
    });
    
    // 监听内存警告
    if ('memory' in performance) {
      this.monitorMemoryWarnings();
    }
  }
  
  /**
   * 注册资源引用
   */
  registerResource(id: string, type: ResourceReference['type'], element?: HTMLElement, data?: any): void {
    const size = this.calculateResourceSize(element, data);
    
    this.resourceReferences.set(id, {
      id,
      type,
      element,
      data,
      lastAccessed: Date.now(),
      accessCount: 1,
      size
    });
  }
  
  /**
   * 更新资源访问
   */
  updateResourceAccess(id: string): void {
    const resource = this.resourceReferences.get(id);
    if (resource) {
      resource.lastAccessed = Date.now();
      resource.accessCount++;
    }
  }
  
  /**
   * 注销资源引用
   */
  unregisterResource(id: string): void {
    this.resourceReferences.delete(id);
  }
  
  /**
   * 检查内存使用情况
   */
  private checkMemoryUsage(): void {
    const context = this.buildGCContext();
    
    // 检查是否需要垃圾回收
    const needsGC = this.strategies.some(strategy => strategy.condition(context));
    
    if (needsGC) {
      this.performGC('memory_check');
    }
  }
  
  /**
   * 构建垃圾回收上下文
   */
  private buildGCContext(): GCContext {
    const now = Date.now();
    const memoryInfo = this.getMemoryInfo();
    
    return {
      memoryUsage: memoryInfo.used,
      memoryLimit: memoryInfo.limit,
      elementCount: this.getElementCount(),
      cacheSize: this.resourceReferences.size,
      lastGC: this.gcStats.lastGCTime,
      timeSinceLastGC: now - this.gcStats.lastGCTime
    };
  }
  
  /**
   * 执行垃圾回收
   */
  private performGC(reason: string): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    const startTime = performance.now();
    
    try {
      const context = this.buildGCContext();
      const strategiesUsed: string[] = [];
      
      // 按优先级排序策略
      const sortedStrategies = [...this.strategies].sort((a, b) => b.priority - a.priority);
      
      // 执行符合条件的策略
      sortedStrategies.forEach(strategy => {
        if (strategy.condition(context)) {
          try {
            strategy.action(context);
            strategiesUsed.push(strategy.name);
          } catch (error) {
            console.error(`垃圾回收策略 ${strategy.name} 执行失败:`, error);
          }
        }
      });
      
      // 更新统计信息
      const duration = performance.now() - startTime;
      this.updateGCStats(strategiesUsed, duration);
      
      console.log(`🧹 垃圾回收完成 (${reason}):`, {
        strategies: strategiesUsed,
        duration: `${duration.toFixed(2)}ms`,
        memoryFreed: this.gcStats.memoryFreed
      });
      
    } finally {
      this.isRunning = false;
    }
  }
  
  /**
   * 收集未使用的元素
   */
  private collectUnusedElements(): void {
    const now = Date.now();
    const elementsToRemove: string[] = [];
    
    this.resourceReferences.forEach((resource, id) => {
      if (resource.type === 'element' && resource.element) {
        // 检查元素是否还在DOM中
        if (!document.contains(resource.element)) {
          elementsToRemove.push(id);
        }
        // 检查元素是否长时间未访问
        else if (now - resource.lastAccessed > this.maxResourceAge) {
          elementsToRemove.push(id);
        }
      }
    });
    
    // 移除未使用的元素引用
    elementsToRemove.forEach(id => {
      const resource = this.resourceReferences.get(id);
      if (resource) {
        this.gcStats.memoryFreed += resource.size;
        this.resourceReferences.delete(id);
      }
    });
    
    this.gcStats.totalCollected += elementsToRemove.length;
  }
  
  /**
   * 收集过期缓存
   */
  private collectExpiredCache(): void {
    const now = Date.now();
    const cacheToRemove: string[] = [];
    
    this.resourceReferences.forEach((resource, id) => {
      if (resource.type === 'cache') {
        // 检查缓存是否过期
        if (now - resource.lastAccessed > this.maxResourceAge) {
          cacheToRemove.push(id);
        }
        // 检查缓存访问频率
        else if (resource.accessCount < 2 && now - resource.lastAccessed > 60000) { // 1分钟
          cacheToRemove.push(id);
        }
      }
    });
    
    // 移除过期缓存
    cacheToRemove.forEach(id => {
      const resource = this.resourceReferences.get(id);
      if (resource) {
        this.gcStats.memoryFreed += resource.size;
        this.resourceReferences.delete(id);
      }
    });
    
    this.gcStats.totalCollected += cacheToRemove.length;
  }
  
  /**
   * 收集内存压力
   */
  private collectMemoryPressure(): void {
    // 强制清理所有长时间未访问的资源
    const now = Date.now();
    const resourcesToRemove: string[] = [];
    
    this.resourceReferences.forEach((resource, id) => {
      if (now - resource.lastAccessed > 30000) { // 30秒
        resourcesToRemove.push(id);
      }
    });
    
    // 移除资源
    resourcesToRemove.forEach(id => {
      const resource = this.resourceReferences.get(id);
      if (resource) {
        this.gcStats.memoryFreed += resource.size;
        this.resourceReferences.delete(id);
      }
    });
    
    this.gcStats.totalCollected += resourcesToRemove.length;
  }
  
  /**
   * 收集旧资源
   */
  private collectOldResources(): void {
    const now = Date.now();
    const oldResources: string[] = [];
    
    this.resourceReferences.forEach((resource, id) => {
      if (now - resource.lastAccessed > this.maxResourceAge) {
        oldResources.push(id);
      }
    });
    
    // 移除旧资源
    oldResources.forEach(id => {
      const resource = this.resourceReferences.get(id);
      if (resource) {
        this.gcStats.memoryFreed += resource.size;
        this.resourceReferences.delete(id);
      }
    });
    
    this.gcStats.totalCollected += oldResources.length;
  }
  
  /**
   * 收集未使用的事件监听器
   */
  private collectUnusedEventListeners(): void {
    // 这里可以实现事件监听器的清理逻辑
    // 由于JavaScript没有直接的方法来枚举事件监听器，
    // 我们只能清理已知的监听器引用
    
    const listenerResources: string[] = [];
    
    this.resourceReferences.forEach((resource, id) => {
      if (resource.type === 'listener' && resource.lastAccessed < Date.now() - 60000) {
        listenerResources.push(id);
      }
    });
    
    // 移除未使用的监听器引用
    listenerResources.forEach(id => {
      const resource = this.resourceReferences.get(id);
      if (resource) {
        this.gcStats.memoryFreed += resource.size;
        this.resourceReferences.delete(id);
      }
    });
    
    this.gcStats.totalCollected += listenerResources.length;
  }
  
  /**
   * 计算资源大小
   */
  private calculateResourceSize(element?: HTMLElement, data?: any): number {
    let size = 0;
    
    if (element) {
      // 估算DOM元素大小
      size += element.innerHTML.length * 2; // 字符串长度
      size += element.attributes.length * 50; // 属性估算
    }
    
    if (data) {
      // 估算数据大小
      try {
        size += JSON.stringify(data).length * 2;
      } catch (error) {
        size += 100; // 默认大小
      }
    }
    
    return size;
  }
  
  /**
   * 获取内存信息
   */
  private getMemoryInfo(): { used: number; limit: number } {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        limit: memory.jsHeapSizeLimit
      };
    }
    
    // 回退到估算
    return {
      used: this.resourceReferences.size * 1000, // 估算
      limit: 100 * 1024 * 1024 // 100MB
    };
  }
  
  /**
   * 获取元素数量
   */
  private getElementCount(): number {
    return document.querySelectorAll('*').length;
  }
  
  /**
   * 获取事件监听器数量
   */
  private getEventListenerCount(): number {
    // 这是一个估算，实际数量可能不同
    return this.resourceReferences.size;
  }
  
  /**
   * 监控内存警告
   */
  private monitorMemoryWarnings(): void {
    // 监听内存警告事件（如果支持）
    if ('addEventListener' in window) {
      window.addEventListener('memorywarning', () => {
        this.performGC('memory_warning');
      });
    }
  }
  
  /**
   * 更新垃圾回收统计
   */
  private updateGCStats(strategiesUsed: string[], duration: number): void {
    this.gcStats.gcCount++;
    this.gcStats.lastGCTime = Date.now();
    this.gcStats.strategiesUsed = strategiesUsed;
    
    // 计算平均GC时间
    this.gcStats.averageGCTime = (this.gcStats.averageGCTime + duration) / 2;
  }
  
  /**
   * 手动触发垃圾回收
   */
  forceGC(): void {
    this.performGC('manual');
  }
  
  /**
   * 获取垃圾回收统计
   */
  getGCStats(): GCStats {
    return { ...this.gcStats };
  }
  
  /**
   * 获取资源引用统计
   */
  getResourceStats(): {
    totalResources: number;
    byType: Record<string, number>;
    totalSize: number;
    oldestResource: number;
  } {
    const byType: Record<string, number> = {};
    let totalSize = 0;
    let oldestResource = Date.now();
    
    this.resourceReferences.forEach(resource => {
      byType[resource.type] = (byType[resource.type] || 0) + 1;
      totalSize += resource.size;
      oldestResource = Math.min(oldestResource, resource.lastAccessed);
    });
    
    return {
      totalResources: this.resourceReferences.size,
      byType,
      totalSize,
      oldestResource
    };
  }
  
  /**
   * 设置内存阈值
   */
  setMemoryThreshold(threshold: number): void {
    this.memoryThreshold = Math.max(0, Math.min(1, threshold));
  }
  
  /**
   * 设置最大资源年龄
   */
  setMaxResourceAge(age: number): void {
    this.maxResourceAge = age;
  }
  
  /**
   * 清理所有资源
   */
  clearAllResources(): void {
    this.resourceReferences.clear();
    this.gcStats.totalCollected = 0;
    this.gcStats.memoryFreed = 0;
  }
  
  /**
   * 销毁垃圾回收器
   */
  destroy(): void {
    if (this.gcInterval) {
      clearInterval(this.gcInterval);
      this.gcInterval = null;
    }
    
    this.clearAllResources();
    this.strategies = [];
    this.isRunning = false;
  }
}

