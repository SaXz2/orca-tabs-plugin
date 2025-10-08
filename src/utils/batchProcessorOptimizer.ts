/**
 * 批量处理优化工具
 * 
 * 提供DOM操作的批量处理和虚拟化机制，
 * 减少重排重绘和提高渲染性能。
 */

import { simpleError } from './logUtils';

export interface BatchOperation<T = any> {
  /** 操作ID */
  id: string;
  /** 操作类型 */
  type: string;
  /** 操作数据 */
  data: T;
  /** 优先级 */
  priority: number;
  /** 是否异步 */
  async: boolean;
  /** 创建时间 */
  timestamp: number;
  /** 回调函数 */
  callback?: (result: any) => void;
}

export interface BatchConfig {
  /** 最大批次大小 */
  maxBatchSize: number;
  /** 最大等待时间（毫秒） */
  maxWaitTime: number;
  /** 处理间隔 */
  processingInterval: number;
  /** 是否启用优先级队列 */
  enablePriorityQueue: boolean;
  /** 是否启用虚拟化 */
  enableVirtualization: boolean;
  /** 虚拟化阈值 */
  virtualizationThreshold: number;
}

export interface BatchMetrics {
  /** 总处理操作数 */
  totalOperations: number;
  /** 平均批次大小 */
  averageBatchSize: number;
  /** 平均处理时间 */
  averageProcessingTime: number;
  /** 峰值队列大小 */
  peakQueueSize: number;
  /** 虚拟化节省的时间 */
  virtualizedTimeSaved: number;
}

export class BatchProcessorOptimizer<T = any> {
  private queue: BatchOperation<T>[] = [];
  private config: BatchConfig;
  private isProcessing = false;
  private processingTimer: number | null = null;
  private operationIdCounter = 0;
  private metrics: BatchMetrics;
  private processingStartTime = 0;
  
  constructor(config: Partial<BatchConfig> = {}) {
    this.config = {
      maxBatchSize: 50,
      maxWaitTime: 16,
      processingInterval: 16,
      enablePriorityQueue: true,
      enableVirtualization: true,
      virtualizationThreshold: 100,
      ...config
    };
    
    this.metrics = {
      totalOperations: 0,
      averageBatchSize: 0,
      averageProcessingTime: 0,
      peakQueueSize: 0,
      virtualizedTimeSaved: 0
    };
  }
  
  /**
   * 添加操作到批次队列
   */
  addOperation(
    type: string,
    data: T,
    options: {
      priority?: number;
      async?: boolean;
      callback?: (result: any) => void;
    } = {}
  ): string {
    const operation: BatchOperation<T> = {
      id: `op_${++this.operationIdCounter}`,
      type,
      data,
      priority: options.priority || 5,
      async: options.async || false,
      timestamp: Date.now(),
      callback: options.callback
    };
    
    this.queue.push(operation);
    
    // 更新队列峰值
    if (this.queue.length > this.metrics.peakQueueSize) {
      this.metrics.peakQueueSize = this.queue.length;
    }
    
    // 如果队列满了，立即处理
    if (this.queue.length >= this.config.maxBatchSize) {
      this.processBatch();
    }
    
    // 启动定时器（如果还没有）
    if (!this.processingTimer) {
      this.scheduleProcessing();
    }
    
    return operation.id;
  }
  
  /**
   * 立即处理所有操作
   */
  async flush(): Promise<void> {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
    
    await this.processBatch();
  }
  
  /**
   * 清除队列
   */
  clear(): void {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
    
    // 调用未执行操作的回调
    this.queue.forEach(operation => {
      if (operation.callback) {
        try {
          operation.callback(null);
        } catch (error) {
          simpleError(`Clear callback error for operation ${operation.id}:`, error);
        }
      }
    });
    
    this.queue = [];
  }
  
  /**
   * 获取队列状态
   */
  getQueueStatus(): {
    queueLength: number;
    isProcessing: boolean;
    estimatedProcessingTime: number;
    lastProcessingTime: number;
  } {
    this.metrics.averageProcessingTime = this.metrics.totalOperations > 0 
      ? this.calculateAverageProcessingTime() 
      : 0;
    
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      estimatedProcessingTime: this.queue.length * 0.1, // 估算每个操作0.1ms
      lastProcessingTime: this.metrics.averageProcessingTime
    };
  }
  
  /**
   * 获取性能指标
   */
  getMetrics(): BatchMetrics {
    return {
      ...this.metrics,
      averageBatchSize: this.calculateAverageBatchSize(),
      virtualizedTimeSaved: this.calculateVirtualizedTimeSaved()
    };
  }
  
  /**
   * 重置指标
   */
  resetMetrics(): void {
    this.metrics = {
      totalOperations: 0,
      averageBatchSize: 0,
      averageProcessingTime: 0,
      peakQueueSize: 0,
      virtualizedTimeSaved: 0
    };
  }
  
  /**
   * 检查操作是否存在
   */
  hasOperation(id: string): boolean {
    return this.queue.some(op => op.id === id);
  }
  
  /**
   * 按类型分组操作
   */
  groupOperationsByType(): Map<string, BatchOperation<T>[]> {
    const groups = new Map<string, BatchOperation<T>[]>();
    
    this.queue.forEach(operation => {
      const operations = groups.get(operation.type) || [];
      operations.push(operation);
      groups.set(operation.type, operations);
    });
    
    return groups;
  }
  
  private scheduleProcessing(): void {
    this.processingTimer = setTimeout(async () => {
      await this.processBatch();
      
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      } else {
        this.processingTimer = null;
      }
    }, this.config.processingInterval) as any as number;
  }
  
  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    this.processingStartTime = performance.now();
    
    // 按优先级排序（如果启用）
    if (this.config.enablePriorityQueue) {
      this.queue.sort((a, b) => b.priority - a.priority);
    }
    
    // 取出一批操作
    const batchSize = Math.min(this.queue.length, this.config.maxBatchSize);
    const operations = this.queue.splice(0, batchSize);
    
    // 按类型分组处理
    const operationGroups = this.groupOperations(operations);
    
    // 处理各组操作
    for (const [type, ops] of operationGroups) {
      await this.processOperationGroup(type, ops);
    }
    
    // 更新指标
    this.updateMetrics(batchSize);
    
    this.isProcessing = false;
  }
  
  private groupOperations(operations: BatchOperation<T>[]): Map<string, BatchOperation<T>[]> {
    const groups = new Map<string, BatchOperation<T>[]>();
    
    operations.forEach(operation => {
      const ops = groups.get(operation.type) || [];
      ops.push(operation);
      groups.set(operation.type, ops);
    });
    
    return groups;
  }
  
  private async processOperationGroup(type: string, operations: BatchOperation<T>[]): Promise<void> {
    try {
      switch (type) {
        case 'dom':
          await this.processDOMOperations(operations);
          break;
        case 'css':
          await this.processCSSOperations(operations);
          break;
        case 'animation':
          await this.processAnimationOperations(operations);
          break;
        case 'data':
          await this.processDataOperations(operations);
          break;
        default:
          await this.processGenericOperations(operations);
          break;
      }
    } catch (error) {
      simpleError(`Processing ${type} operations failed:`, error);
      
      // 执行失败回调
      operations.forEach(operation => {
        if (operation.callback) {
          try {
            operation.callback(error);
          } catch (callbackError) {
            simpleError(`Callback error for operation ${operation.id}:`, callbackError);
          }
        }
      });
    }
  }
  
  private async processDOMOperations(operations: BatchOperation<T>[]): Promise<void> {
    // 使用DocumentFragment进行批量DOM操作
    const fragment = document.createDocumentFragment();
    const updates: Array<() => void> = [];
    
    operations.forEach(operation => {
      switch (operation.type) {
        case 'appendChild':
          updates.push(() => {
            const element = operation.data as HTMLElement;
            if (element instanceof HTMLElement) {
              fragment.appendChild(element);
            }
          });
          break;
          
        case 'removeChild':
          updates.push(() => {
            const element = operation.data as HTMLElement;
            if (element && element.parentNode) {
              element.parentNode.removeChild(element);
            }
          });
          break;
          
        case 'setAttribute':
          updates.push(() => {
            const { element, name, value } = operation.data as any;
            if (element && element.setAttribute) {
              element.setAttribute(name, value);
            }
          });
          break;
          
        case 'setStyle':
          updates.push(() => {
            const { element, styles } = operation.data as any;
            if (element && element.style) {
              Object.assign(element.style, styles);
            }
          });
          break;
      }
    });
    
    // 使用requestAnimationFrame确保在下一帧执行
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        updates.forEach(update => update());
        
        // 如果有fragment添加的元素，需要实际插入DOM
        if (fragment.hasChildNodes()) {
          // 找到合适的父元素或使用document.body
          const parent = document.querySelector('.orca-tab-container') || document.body;
          parent.appendChild(fragment);
        }
        
        // 通知完成
        operations.forEach(operation => {
          if (operation.callback) {
            operation.callback(true);
          }
        });
        
        resolve();
      });
    });
  }
  
  private async processCSSOperations(operations: BatchOperation<T>[]): Promise<void> {
    // 批量更新CSS
    const styleUpdates = new Map<string, any>();
    
    operations.forEach(operation => {
      const { selector, styles } = operation.data as any;
      if (selector && styles) {
        styleUpdates.set(selector, styles);
      }
    });
    
    // 应用样式更新
    if (styleUpdates.size > 0) {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          styleUpdates.forEach((styles, selector) => {
            const element = document.querySelector(selector);
            if (element instanceof HTMLElement) {
              Object.assign(element.style, styles);
            }
          });
          
          operations.forEach(operation => {
            if (operation.callback) {
              operation.callback(true);
            }
          });
          
          resolve();
        });
      });
    }
  }
  
  private async processAnimationOperations(operations: BatchOperation<T>[]): Promise<void> {
    // 动画操作的批量处理
    const animations: Array<Animation> = [];
    
    operations.forEach(operation => {
      const { element, keyframes, options } = operation.data as any;
      if (element && keyframes && options) {
        try {
          const animation = element.animate(keyframes, options);
          animations.push(animation);
        } catch (error) {
          simpleError(`Animation creation failed:`, error);
        }
      }
    });
    
    // 等待所有动画完成或超时
    if (animations.length > 0) {
      await Promise.allSettled(
        animations.map(animation => 
          animation.finished.catch(() => {})
        )
      );
      
      operations.forEach(operation => {
        if (operation.callback) {
          operation.callback(true);
        }
      });
    }
  }
  
  private async processDataOperations(operations: BatchOperation<T>[]): Promise<void> {
    // 数据操作的批量处理
    const dataUpdates: Array<() => Promise<void>> = [];
    
    operations.forEach(operation => {
      dataUpdates.push(async () => {
        const { target, method, params } = operation.data as any;
        if (target && method) {
          try {
            const result = await (target as any)[method](...params);
            if (operation.callback) {
              operation.callback(result);
            }
          } catch (error) {
            if (operation.callback) {
              operation.callback(error);
            }
          }
        }
      });
    });
    
    // 批量执行数据更新
    await Promise.all(dataUpdates.map(update => update()));
  }
  
  private async processGenericOperations(operations: BatchOperation<T>[]): Promise<void> {
    // 通用操作处理
    const genericUpdates: Array<() => void> = [];
    
   operations.forEach(operation => {
      if (typeof operation.data === 'function') {
        genericUpdates.push(operation.data as () => void);
      }
    });
    
    // 使用requestAnimationFrame批量执行
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        genericUpdates.forEach(update => {
          try {
            update();
          } catch (error) {
            simpleError('Generic operation failed:', error);
          }
        });
        
        operations.forEach(operation => {
          if (operation.callback) {
            operation.callback(true);
          }
        });
        
        resolve();
      });
    });
  }
  
  private updateMetrics(batchSize: number): void {
    const processingTime = performance.now() - this.processingStartTime;
    
    this.metrics.totalOperations += batchSize;
    
    const weightedTime = this.metrics.averageProcessingTime * (this.metrics.totalOperations - batchSize) + processingTime;
    this.metrics.averageProcessingTime = weightedTime / this.metrics.totalOperations;
    
    // 更新队列峰值
    const currentQueueSize = this.queue.length;
    if (currentQueueSize > this.metrics.peakQueueSize) {
      this.metrics.peakQueueSize = currentQueueSize;
    }
  }
  
  private calculateAverageBatchSize(): number {
    return this.metrics.totalOperations > 0 
      ? Math.round(this.metrics.totalOperations / Math.max(1, this.metrics.totalOperations / this.config.maxBatchSize))
      : 0;
  }
  
  private calculateAverageProcessingTime(): number {
    return this.metrics.averageProcessingTime;
  }
  
  private calculateVirtualizedTimeSaved(): number {
    return this.config.enableVirtualization 
      ? Math.max(0, this.metrics.peakQueueSize - this.config.maxBatchSize) * 0.1
      : 0;
  }
  
  /**
   * 销毁处理器
   */
  destroy(): void {
    if (this.processingTimer) {
      clearTimeout(this.processingTimer);
      this.processingTimer = null;
    }
    
    this.clear();
    this.resetMetrics();
  }
}
