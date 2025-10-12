/**
 * 性能优化管理器
 * 
 * 统一管理和协调所有性能优化工具，
 * 提供一站式性能优化解决方案。
 */

import { OptimizedMutationObserver, MutationObserverConfig } from './mutationObserverOptimizer';
import { AdvancedDebounceOptimizer, DebounceLayer } from './advancedDebounceOptimizer';
import { MemoryLeakProtector, MemoryStats } from './memoryLeakProtector';
import { LazyLoadingOptimizer, LoadingConfig } from './lazyLoadingOptimizer';
import { BatchProcessorOptimizer, BatchConfig } from './batchProcessorOptimizer';
// 性能监控已禁用
// import { PerformanceMonitorOptimizer, PerformanceReport } from './performanceMonitorOptimizer';
import { simpleVerbose } from './logUtils';

export interface GlobalOptimizationConfig {
  /** MutationObserver配置 */
  mutationObserver: Partial<MutationObserverConfig>;
  /** 防抖配置 */
  debounce: Array<DebounceLayer>;
  /** 内存保护配置 */
  memoryLeak: {
    autoCleanupInterval: number;
    enableAutoCleanup: boolean;
  };
  /** 懒加载配置 */
  lazyLoading: Partial<LoadingConfig>;
  /** 批量处理配置 */
  batchProcessing: Partial<BatchConfig>;
  /** 性能监控配置 */
  performanceMonitoring: {
    enableMonitoring: boolean;
    enableAutoOptimization: boolean;
    reportInterval: number;
  };
}

export interface OptimizationStatus {
  /** 是否启用 */
  enabled: boolean;
  /** 各组件状态 */
  components: {
    mutationObserver: boolean;
    debounceOptimizer: boolean;
    memoryLeakProtection: boolean;
    lazyLoading: boolean;
    batchProcessing: boolean;
    performanceMonitoring: boolean;
  };
  /** 整体健康状态 */
  health: 'excellent' | 'good' | 'warning' | 'critical';
  /** 性能建议 */
  suggestions: string[];
}

/**
 * 性能优化管理器主类
 */
export class PerformanceOptimizerManager {
  private static instance: PerformanceOptimizerManager;
  
  private mutationObserver: OptimizedMutationObserver | null = null;
  private debounceOptimizer: AdvancedDebounceOptimizer | null = null;
  private memoryLeakProtector: MemoryLeakProtector | null = null;
  private lazyLoadingOptimizer: LazyLoadingOptimizer | null = null;
  private batchProcessor: BatchProcessorOptimizer | null = null;
  // 性能监控已禁用
  // private performanceMonitor: PerformanceMonitorOptimizer | null = null;
  
  private config: GlobalOptimizationConfig;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  
  private constructor() {
    this.config = this.getDefaultConfig();
  }
  
  /**
   * 获取单例实例
   */
  static getInstance(): PerformanceOptimizerManager {
    if (!PerformanceOptimizerManager.instance) {
      PerformanceOptimizerManager.instance = new PerformanceOptimizerManager();
    }
    return PerformanceOptimizerManager.instance;
  }
  
  /**
   * 初始化性能优化器
   */
  async initialize(config?: Partial<GlobalOptimizationConfig>): Promise<void> {
    if (this.isInitialized) {
      return;
    }
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this.performInitialization(config);
    await this.initializationPromise;
  }
  
  /**
   * 执行初始化
   */
  private async performInitialization(config?: Partial<GlobalOptimizationConfig>): Promise<void> {
    try {
      // 应用配置
      if (config) {
        this.applyConfig(config);
      }
      
      // 初始化MutationObserver优化器
      if (this.config.mutationObserver) {
        this.mutationObserver = new OptimizedMutationObserver(
          this.config.mutationObserver,
          {
            onBatchMutations: (mutations) => {
              this.log('MutationObserver: Processing batch of', mutations.length, 'mutations');
            },
            onHotMutation: (mutation) => {
              this.log('MutationObserver: Hot mutation detected', mutation);
            },
            onThrottledMutation: (mutations) => {
              this.log('MutationObserver: Throttled', mutations.length, 'mutations');
            }
          }
        );
      }
      
      // 初始化防抖优化器
      if (this.config.debounce.length > 0) {
        this.debounceOptimizer = new AdvancedDebounceOptimizer();
        this.config.debounce.forEach(layer => {
          this.debounceOptimizer!.addLayer(layer.name, layer);
        });
      }
      
      // 初始化内存泄漏保护器
      if (this.config.memoryLeak.enableAutoCleanup) {
        this.memoryLeakProtector = MemoryLeakProtector.getInstance();
        this.memoryLeakProtector.setAutoCleanup(true, this.config.memoryLeak.autoCleanupInterval);
      }
      
      // 初始化懒加载优化器
      if (this.config.lazyLoading) {
        this.lazyLoadingOptimizer = new LazyLoadingOptimizer(this.config.lazyLoading);
      }
      
      // 初始化批量处理器
      if (this.config.batchProcessing) {
        this.batchProcessor = new BatchProcessorOptimizer(this.config.batchProcessing);
      }
      
      // 性能监控已禁用
      // if (this.config.performanceMonitoring.enableMonitoring) {
      //   this.performanceMonitor = PerformanceMonitorOptimizer.getInstance();
      //   this.performanceMonitor.updateConfig({
      //     reportInterval: this.config.performanceMonitoring.reportInterval,
      //     enableAutoOptimization: this.config.performanceMonitoring.enableAutoOptimization
      //   });
      //   this.performanceMonitor.startMonitoring();
      //   
      //   // 监听性能报告
      //   this.performanceMonitor.onReportChange((report) => {
      //     this.handlePerformanceReport(report);
      //   });
      // }
      
      // 设置全局清理
      this.setupGlobalCleanup();
      
      this.isInitialized = true;
      this.log('所有性能优化器初始化完成');
      
    } catch (error) {
      this.log('性能优化器初始化失败:', error);
      throw error;
    }
  }
  
  /**
   * 开始DOM变化观察
   */
  startDOMObservation(
    target: Node,
    options?: MutationObserverInit
  ): OptimizedMutationObserver | null {
    if (!this.mutationObserver) {
      this.log('MutationObserver未初始化');
      return null;
    }
    
    this.mutationObserver.observe(target, options);
    this.log('开始DOM变化观察');
    return this.mutationObserver;
  }
  
  /**
   * 停止DOM变化观察
   */
  stopDOMObservation(): void {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.log('停止DOM变化观察');
    }
  }
  
  /**
   * 执行优化任务
   */
  async executeTask<T>(
    fn: (...args: any[]) => T | Promise<T>,
    args: any[] = [],
    layerId: string = 'normal'
  ): Promise<T> {
    if (this.debounceOptimizer) {
      return this.debounceOptimizer.execute(fn, args, layerId);
    } else {
      return fn(...args);
    }
  }
  
  /**
   * 跟踪资源
   */
  trackEventListener(
    target: EventTarget,
    event: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): string | null {
    if (this.memoryLeakProtector) {
      return this.memoryLeakProtector.trackEventListener(target, event, listener, options);
    }
    
    target.addEventListener(event, listener, options);
    return null;
  }
  
  /**
   * 跟踪定时器
   */
  trackTimer(
    timerId: number,
    type: 'timeout' | 'interval' = 'timeout'
  ): string | null {
    if (this.memoryLeakProtector) {
      return this.memoryLeakProtector.trackTimer(timerId, type);
    }
    return null;
  }
  
  /**
   * 跟踪观察者
   */
  trackObserver(
    observer: MutationObserver | IntersectionObserver | ResizeObserver,
    type: 'mutation' | 'intersection' | 'resize' = 'mutation'
  ): string | null {
    if (this.memoryLeakProtector) {
      return this.memoryLeakProtector.trackObserver(observer, type);
    }
    return null;
  }
  
  /**
   * 注册懒加载模块
   */
  registerLazyModule<T>(
    id: string,
    loader: () => Promise<T>,
    options?: {
      dependencies?: string[];
      priority?: number;
      autoLoad?: boolean;
    }
  ): void {
    if (this.lazyLoadingOptimizer) {
      this.lazyLoadingOptimizer.registerModule(id, loader, options);
    }
  }
  
  /**
   * 添加批量操作
   */
  addBatchOperation(
    type: string,
    data: any,
    options?: { priority?: number; callback?: (result: any) => void }
  ): string | null {
    if (this.batchProcessor) {
      return this.batchProcessor.addOperation(type, data, options);
    }
    return null;
  }
  
  /**
   * 记录性能指标（已禁用）
   */
  recordMetric(
    name: string,
    value: number,
    unit?: string,
    type?: 'duration' | 'count' | 'size' | 'rate' | 'custom'
  ): void {
    // 性能监控已禁用
    return;
  }
  
  /**
   * 开始性能测量（已禁用）
   */
  startPerformanceMeasurement(name: string): (() => number) | null {
    // 性能监控已禁用
    return null;
  }
  
  /**
   * 清理资源
   */
  cleanupResource(id: string): boolean {
    if (this.memoryLeakProtector) {
      return this.memoryLeakProtector.cleanupResource(id);
    }
    return false;
  }
  
  /**
   * 清理所有资源
   */
  cleanupAllResources(): MemoryStats | null {
    if (this.memoryLeakProtector) {
      return this.memoryLeakProtector.cleanupAllResources();
    }
    return null;
  }
  
  /**
   * 获取优化状态
   */
  getOptimizationStatus(): OptimizationStatus {
    const components = {
      mutationObserver: this.mutationObserver !== null,
      debounceOptimizer: this.debounceOptimizer !== null,
      memoryLeakProtection: this.memoryLeakProtector !== null,
      lazyLoading: this.lazyLoadingOptimizer !== null,
      batchProcessing: this.batchProcessor !== null,
      performanceMonitoring: false // 已禁用
    };
    
    const enabled = Object.values(components).some(enabled => enabled);
    const health = this.determineHealthStatus();
    const suggestions = this.generateOptimizationSuggestions();
    
    return {
      enabled,
      components,
      health,
      suggestions
    };
  }
  
  /**
   * 获取性能报告（已禁用）
   */
  getPerformanceReport(): null {
    // 性能监控已禁用
    return null;
  }
  
  /**
   * 获取内存统计
   */
  getMemoryStats(): MemoryStats | null {
    if (this.memoryLeakProtector) {
      return this.memoryLeakProtector.getMemoryStats();
    }
    return null;
  }
  
  /**
   * 触发优化
   */
  triggerOptimization(): void {
    // 性能监控已禁用
    // if (this.performanceMonitor) {
    //   this.performanceMonitor.triggerOptimization();
    // }
    
    // 清理内存
    if (this.memoryLeakProtector) {
      const leaks = this.memoryLeakProtector.detectMemoryLeaks();
      if (leaks.length > 0) {
        this.log('检测到内存泄漏，开始清理:', leaks);
        this.memoryLeakProtector.cleanupAllResources();
      }
    }
    
    // 刷新批量处理队列
    if (this.batchProcessor) {
      this.batchProcessor.flush();
    }
  }
  
  /**
   * 生成优化报告
   */
  generateOptimizationReport(): string {
    const status = this.getOptimizationStatus();
    const memoryStats = this.getMemoryStats();
    
    let report = `
=== 性能优化报告 ===

整体状态: ${status.enabled ? '启用' : '禁用'}
健康程度: ${status.health}
组件状态:
  - MutationObserver: ${status.components.mutationObserver ? '激活' : '未激活'}
  - 防抖优化器: ${status.components.debounceOptimizer ? '激活' : '未激活'}
  - 内存保护: ${status.components.memoryLeakProtection ? '激活' : '未激活'}
  - 懒加载: ${status.components.lazyLoading ? '激活' : '未激活'}
  - 批量处理: ${status.components.batchProcessing ? '激活' : '未激活'}
  - 性能监控: ${status.components.performanceMonitoring ? '激活' : '未激活'}

优化建议:
${status.suggestions.map(s => `  - ${s}`).join('\n')}
`;
    
    if (memoryStats) {
      report += `
内存统计:
  跟踪资源: ${memoryStats.totalResources}
  内存使用: ${Math.round(memoryStats.memoryUsage / 1024 / 1024 * 100) / 100} MB
`;
    }
    
    return report;
  }
  
  /**
   * 销毁优化器
   */
  destroy(): void {
    this.stopDOMObservation();
    
    if (this.debounceOptimizer) {
      this.debounceOptimizer.destroy();
    }
    
    if (this.memoryLeakProtector) {
      this.memoryLeakProtector.destroy();
    }
    
    if (this.lazyLoadingOptimizer) {
      this.lazyLoadingOptimizer.cleanup();
    }
    
    if (this.batchProcessor) {
      this.batchProcessor.destroy();
    }
    
    // 性能监控已禁用
    // if (this.performanceMonitor) {
    //   this.performanceMonitor.destroy();
    // }
    
    this.isInitialized = false;
    this.initializationPromise = null;
    
    this.log('所有性能优化器已销毁');
  }
  
  /**
   * 应用配置
   */
  private applyConfig(config: Partial<GlobalOptimizationConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * 处理性能报告（已禁用）
   */
  private handlePerformanceReport(report: any): void {
    // 性能监控已禁用
    return;
  }
  
  /**
   * 确定健康状态
   */
  private determineHealthStatus(): OptimizationStatus['health'] {
    const enabledComponents = Object.values(this.getOptimizationStatus().components)
      .filter(enabled => enabled).length;
    
    // 性能监控已禁用，基于组件数量判断
    if (enabledComponents >= 4) {
      return 'excellent';
    } else if (enabledComponents >= 3) {
      return 'good';
    } else if (enabledComponents >= 2) {
      return 'warning';
    } else {
      return 'critical';
    }
  }
  
  /**
   * 生成优化建议
   */
  private generateOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    const status = this.getOptimizationStatus();
    // 性能监控已禁用
    // const performanceReport = this.getPerformanceReport();
    
    if (!status.components.mutationObserver) {
      suggestions.push('启用MutationObserver优化以减少DOM监听开销');
    }
    
    if (!status.components.debounceOptimizer) {
      suggestions.push('启用防抖优化器以处理高频操作');
    }
    
    if (!status.components.memoryLeakProtection) {
      suggestions.push('启用内存泄漏保护以防止内存泄露');
    }
    
    if (!status.components.lazyLoading) {
      suggestions.push('启用懒加载以延迟非关键功能');
    }
    
    if (!status.components.batchProcessing) {
      suggestions.push('启用批量处理以优化DOM操作');
    }
    
    if (!status.components.performanceMonitoring) {
      suggestions.push('启用性能监控以实时追踪性能指标');
    }
    
    // 性能监控已禁用
    // if (performanceReport) {
    //   performanceReport.recommendations.forEach(rec => {
    //     suggestions.push(`[${rec.priority}] ${rec.description}`);
    //   });
    // }
    
    return suggestions;
  }
  
  /**
   * 设置全局清理
   */
  private setupGlobalCleanup(): void {
    window.addEventListener('beforeunload', () => {
      this.cleanupAllResources();
    });
    
    // 定期清理检查
    setInterval(() => {
      const memoryStats = this.getMemoryStats();
      if (memoryStats && memoryStats.totalResources > 1000) {
        this.log('资源过多，触发清理');
        this.triggerOptimization();
      }
    }, 60000); // 每分钟检查一次
  }
  
  /**
   * 获取默认配置
   */
  private getDefaultConfig(): GlobalOptimizationConfig {
    return {
      mutationObserver: {
        enableBatch: true,
        batchDelay: 16,
        maxBatchSize: 50,
        enableSmartFilter: true,
        coolingPeriod: 100
      },
      debounce: [
        { name: 'immediate', delay: 0, priority: 10, cancelable: false },
        { name: 'high', delay: 8, priority: 8, cancelable: true, maxWait: 100 },
        { name: 'normal', delay: 16, priority: 5, cancelable: true, maxWait: 200 },
        { name: 'low', delay: 32, priority: 3, cancelable: true, maxWait: 500 },
        { name: 'idle', delay: 100, priority: 1, cancelable: true, maxWait: 1000 }
      ],
      memoryLeak: {
        autoCleanupInterval: 30000,
        enableAutoCleanup: true
      },
      lazyLoading: {
        enableCache: true,
        maxConcurrency: 3,
        preloadStrategy: 'idle'
      },
      batchProcessing: {
        maxBatchSize: 50,
        maxWaitTime: 16,
        enableVirtualization: true
      },
      performanceMonitoring: {
        enableMonitoring: true,
        enableAutoOptimization: true,
        reportInterval: 30000
      }
    };
  }
  
  private log(message: string, ...args: any[]): void {
    simpleVerbose(`[PerformanceOptimizerManager] ${message}`, ...args);
  }
}
