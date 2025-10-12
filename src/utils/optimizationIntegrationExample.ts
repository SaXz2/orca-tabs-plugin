/**
 * 性能优化集成示例
 * 
 * 展示如何在main.ts中集成和使用所有性能优化工具
 */

import { PerformanceOptimizerManager } from './performanceOptimizerManager';
import { OptimizedMutationObserver } from './mutationObserverOptimizer';
import { AdvancedDebounceOptimizer } from './advancedDebounceOptimizer';
import { MemoryLeakProtector } from './memoryLeakProtector';
import { LazyLoadingOptimizer } from './lazyLoadingOptimizer';
import { BatchProcessorOptimizer } from './batchProcessorOptimizer';
// 性能监控已禁用
// import { PerformanceMonitorOptimizer } from './performanceMonitorOptimizer';
import { simpleLog, simpleError, simpleVerbose } from './logUtils';

/**
 * 优化集成示例类
 */
export class OptimizationIntegrationExample {
  private optimizerManager: PerformanceOptimizerManager;
  private mutationObserverId: string | null = null;
  private debounceLayer: string = 'normal';
  
  constructor() {
    this.optimizerManager = PerformanceOptimizerManager.getInstance();
  }
  
  /**
   * 初始化优化系统
   */
  async initializeOptimizations(): Promise<void> {
    try {
      // 初始化性能优化管理器
      await this.optimizerManager.initialize({
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
          { name: 'low', delay: 32, priority: 3, cancelable: true, maxWait: 500 }
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
      });
      
      simpleLog('✅ 性能优化系统初始化完成');
      
    } catch (error) {
      simpleError('❌ 性能优化系统初始化失败:', error);
      throw error;
    }
  }
  
  /**
   * 设置MutationObserver观察
   * 
   * 替换原有的 observeChanges() 方法中的 MutationObserver
   */
  setupOptimizedMutationObserver(
    target: Node = document.body,
    options: MutationObserverInit = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    }
  ): OptimizedMutationObserver | null {
    const observer = this.optimizerManager.startDOMObservation(target, options);
    
   if (observer) {
      // 注意: OptimizedMutationObserver的callbacks在构造时设置
      // 这里只是说明如何在构造函数中设置回调
      this.setupMutationObserverCallbacks();
      
      this.log('🔍 优化后的MutationObserver已启动');
      return observer;
    }
    
    return null;
  }
  
  /**
   * 使用防抖优化执行任务
   * 
   * 替换原有的 debouncedUpdateTabsUI() 等方法
   */
  async executeDebouncedTabUpdate(
    updateFunction: () => Promise<void> | void,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<void> {
    try {
      const layerMap = {
        high: 'high',
       normal: 'normal',
        low: 'low'
      };
      
      await this.optimizerManager.executeTask(
        updateFunction,
        [],
        layerMap[priority]
      );
      
      this.log(`⚡ 使用${priority}优先级执行标签页更新`);
      
    } catch (error) {
      simpleError('防抖执行失败:', error);
    }
  }
  
  /**
   * 跟踪事件监听器
   * 
   * 替换手动添加的事件监听器
   */
  trackEventListener<T extends EventTarget>(
    target: T,
    event: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
    description?: string
  ): string | null {
    const id = this.optimizerManager.trackEventListener(target, event, listener, options);
    
    if (id) {
      this.log(`👂 跟踪事件监听器: ${description || event}`);
    }
    
    return id;
  }
  
  /**
   * 跟踪定时器
   * 
   * 替换 setTimeout 和 setInterval
   */
  optimizeTimers(): void {
    // 示例：将原有的定时器替换为优化的版本
    const timeoutId = setTimeout(() => {
      // 定期清理
      this.manualCleanup();
    }, 5000) as any as number;
    
    const trackedTimeoutId = this.optimizerManager.trackTimer(timeoutId, 'timeout');
    this.log(`⏰ 跟踪定时器: ${trackedTimeoutId}`);
  }
  
  /**
   * 注册懒加载模块
   * 
   * 为非关键功能模块实现懒加载
   */
  async registerAndLoadModule<T>(
    moduleId: string,
    loader: () => Promise<T>,
    trigger: 'immediate' | 'idle' | 'visible' | 'user_interaction' = 'idle'
  ): Promise<T> {
    // 注册模块
    this.optimizerManager.registerLazyModule(moduleId, loader, {
      priority: trigger === 'immediate' ? 8 : trigger === 'visible' ? 6 : 4,
      autoLoad: trigger === 'immediate'
    });
    
    this.log(`🔄 注册懒加载模块: ${moduleId}`);
    
    // 如果是立即加载，直接返回
    if (trigger === 'immediate') {
      return await loader();
    }
    
    // 否则返回懒加载的结果（这只是一个示例，实际需要更复杂的实现）
    return Promise.resolve() as Promise<T>;
  }
  
  /**
   * 批量DOM操作
   * 
   * 使用批量处理器优化DOM操作
   */
  batchDOMOperations(operations: Array<{
    type: 'dom';
    data: { type: 'appendChild' | 'removeChild' | 'setAttribute' | 'setStyle'; element?: HTMLElement; [key: string]: any };
  }>): void {
    operations.forEach((operation, index) => {
      const operationId = this.optimizerManager.addBatchOperation(
        operation.type,
        operation.data,
        {
          priority: 5 - index, // 优先级递减
          callback: (result) => {
            if (result) {
              this.log(`📁 批量DOM操作完成: 操作${index + 1}`);
            }
          }
        }
      );
      
      this.log(`📦 添加批量DOM操作: ${operationId}`);
    });
  }
  
  /**
   * 性能监控和报告
   * 
   * 集成性能监控系统
   */
  async setupPerformanceMonitoring(): Promise<void> {
    // 性能监控已禁用
    this.log('📊 性能监控已禁用');
    return;
  }
  
  /**
   * 手动清理资源
   * 
   * 在插件卸载时调用
   */
  manualCleanup(): void {
    this.log('🧹 开始手动清理...');
    
    // 清理所有跟踪的资源
    const cleanupResult = this.optimizerManager.cleanupAllResources();
    
    if (cleanupResult) {
      this.log(`✅ 清理完成: ${cleanupResult.cleanupCount} 个资源`);
      this.log(`📊 内存统计: ${Math.round(cleanupResult.memoryUsage / 1024 / 1024 * 100) / 100} MB`);
    }
    
    // 获取优化状态报告
    const status = this.optimizerManager.getOptimizationStatus();
    this.log('📋 优化状态:', status.enabled ? '启用' : '禁用');
    this.log('🏥 健康状态:', status.health);
  }
  
  /**
   * 获取性能报告
   */
  getPerformanceReport(): string {
    const report = this.optimizerManager.generateOptimizationReport();
    simpleLog('📊 性能优化报告:\n', report);
    return report;
  }
  
  /**
   * 设置MutationObserver回调
   */
  private setupMutationObserverCallbacks(): void {
    // 在实际实现中，需要在OptimizedMutationObserver的构造函数中传递这些callback
    // 这里只是为了示例说明
    simpleVerbose('MutationObserver callbacks会通过构造函数设置');
  }

  /**
   * 处理批量变化（来源于原有的MutationObserver逻辑）
   */
  private handleBatchMutations(mutations: MutationRecord[]): void {
    this.log(`📊 处理批量变化: ${mutations.length} 个变动`);
    
    let shouldCheckNewBlocks = false;
    let shouldCheckNewPanels = false;
    
    // 原有的变化检测逻辑
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const target = mutation.target as Element;
        
        // 检查是否有新的面板添加
        if (target.classList.contains('orca-panels-row') || 
         target.closest('.orca-panels-row')) {
          shouldCheckNewPanels = true;
        }
        
        // 其他检测逻辑...
      }
    });
    
    // 使用优化的防抖执行更新
    if (shouldCheckNewBlocks) {
      this.executeDebouncedTabUpdate(() => {
        // 原有的 checkCurrentPanelBlocks 逻辑
        return Promise.resolve();
      }, 'normal');
    }
    
    if (shouldCheckNewPanels) {
      this.executeDebouncedTabUpdate(() => {
        // 原有的检查新面板逻辑
        return Promise.resolve();
      }, 'low');
    }
  }
  
  /**
   * 处理热点变化
   */
  private handleHotMutation(mutation: MutationRecord): void {
    this.log('🔥 处理热点变化:', mutation);
    
    // 立即处理重要的变化
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      const target = mutation.target as Element;
      
      if (target.classList.contains('orca-panel') && 
       target.classList.contains('active')) {
        // 立即执行面板切换更新
        this.executeDebouncedTabUpdate(() => {
          // 面板切换逻辑
          return Promise.resolve();
        }, 'high');
      }
    }
  }
  
  /**
   * 处理节流变化
   */
  private handleThrottledMutations(mutations: MutationRecord[]): void {
    this.log(`⏱️ 处理节流变化: ${mutations.length} 个变动`);
    
    // 在下一帧执行，避免阻塞UI
    requestAnimationFrame(() => {
      mutations.forEach(mutation => {
        // 处理非紧急的变化
        this.handleNonCriticalChanges(mutation);
      });
    });
  }
  
  /**
   * 处理非关键变化
   */
  private handleNonCriticalChanges(mutation: MutationRecord): void {
    // 处理非关键的变化，使用低优先级
    this.executeDebouncedTabUpdate(() => {
      // 非关键更新逻辑
      return Promise.resolve();
    }, 'low');
  }
  
  /**
   * 处理性能报告
   */
  private handlePerformanceReport(report: any): void {
    this.log('📈 收到性能报告:', {
      healthScore: report.healthScore,
      issues: report.issues.length,
      recommendations: report.recommendations.length
    });
    
    if (report.healthScore < 50) {
      this.log('⚠️ 性能警告: 健康分数过低，可能需要优化');
    }
  }
  
  /**
   * 销毁优化系统
   */
  destroy(): void {
    this.log('🗑️ 销毁性能优化系统...');
    this.optimizerManager.destroy();
    this.log('✅ 性能优化系统已销毁'); 
  }
  
  private log(message: string, ...args: any[]): void {
    simpleVerbose(`[OptimizationExample] ${message}`, ...args);
  }
}

/**
 * 在主类中的集成示例
 * 
 * 在 OrcaTabsPlugin 类中添加以下代码：
 * 
 * 1. 导入优化工具
 * import { OptimizationIntegrationExample } from './utils/optimizationIntegrationExample';
 * 
 * 2. 在构造函数中初始化
 * private optimizationExample: OptimizationIntegrationExample;
 * constructor() {
 *   this.optimizationExample = new OptimizationIntegrationExample();
 *   this.optimizationExample.initializeOptimizations();
 * }
 * 
 * 3. 替换原有的 observeChanges 方法
 * async init() {
 *   await this.optimizationExample.initializeOptimizations();
 *   this.optimizationExample.setupOptimizedMutationObserver(
 *     document.body,
 *     { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }
 *   );
 * }
 * 
 * 4. 在 destroy 方法中清理
 * destroy() {
 *   this.optimizationExample.destroy();
 * }
 */
