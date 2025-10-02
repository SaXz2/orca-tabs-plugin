/**
 * 高级防抖优化工具
 * 
 * 提供分层防抖、优先级调度和智能冷却机制，
 * 避免高性能操作阻塞和内存泄漏。
 */

export interface DebounceLayer {
  /** 层级名称 */
  name: string;
  /** 防抖延迟时间 */
  delay: number;
  /** 优先级 0-10，数字越大优先级越高 */
  priority: number;
  /** 最大等待时间 */
  maxWait?: number;
  /** 是否允许中断 */
  cancelable: boolean;
}

export interface DebounceTask<T = any> {
  /** 任务ID */
  id: string;
  /** 任务函数 */
  fn: (...args: any[]) => T | Promise<T>;
  /** 任务参数 */
  args: any[];
  /** 任务层级 */
  layer: DebounceLayer;
  /** 创建时间 */
  createdAt: number;
  /** 任务优先级 */
  priority?: number;
  /** 是否强制执行 */
  forceExecute?: boolean;
}

export interface PerformanceMetrics {
  totalTasks: number;
  cancelledTasks: number;
  executedTasks: number;
  averageDelay: number;
  peakQueueSize: number;
  memoryUsage: number;
}

export class AdvancedDebounceOptimizer {
  private layers: Map<string, DebounceLayer> = new Map();
  private taskQueue: Map<string, DebounceTask> = new Map();
  private activeTimers: Map<string, number> = new Map();
  private performanceMetrics: PerformanceMetrics;
  private taskIdCounter = 0;
  private isEnabled = true;
  
  constructor() {
    this.performanceMetrics = {
      totalTasks: 0,
      cancelledTasks: 0,
      executedTasks: 0,
      averageDelay: 0,
      peakQueueSize: 0,
      memoryUsage: this.getMemoryUsage()
    };
    
    // 初始化默认层级
    this.addLayer('immediate', { name: 'immediate', delay: 0, priority: 10, cancelable: false });
    this.addLayer('high', { name: 'high', delay: 8, priority: 8, cancelable: true, maxWait: 100 });
    this.addLayer('normal', { name: 'normal', delay: 16, priority: 5, cancelable: true, maxWait: 200 });
    this.addLayer('low', { name: 'low', delay: 32, priority: 3, cancelable: true, maxWait: 500 });
    this.addLayer('idle', { name: 'idle', delay: 100, priority: 1, cancelable: true, maxWait: 1000 });
  }
  
  /**
   * 添加防抖层级
   */
  addLayer(id: string, layer: DebounceLayer): void {
    this.layers.set(id, {
      ...layer,
      maxWait: layer.maxWait || layer.delay * 2
    });
  }
  
  /**
   * 移除防抖层级
   */
  removeLayer(id: string): void {
    this.layers.delete(id);
  }
  
  /**
   * 执行任务
   */
  execute<T = any>(
    fn: (...args: any[]) => T | Promise<T>,
    args: any[] = [],
    layerId: string = 'normal',
    options: { 
      priority?: number;
      id?: string;
      forceExecute?: boolean 
    } = {}
  ): Promise<T> | T {
    const layer = this.layers.get(layerId);
    if (!layer) {
      console.warn(`Unknown layer: ${layerId}`);
      return fn(...args);
    }
    
    const taskId = options.id || `task_${++this.taskIdCounter}`;
    
    // 对于立即执行层，直接执行
    if (layer.delay === 0) {
      this.updateMetrics('executed');
      return fn(...args);
    }
    
    // 检查是否已存在相同任务
    const existingTask = this.taskQueue.get(taskId);
    if (existingTask && !layer.cancelable && !options.forceExecute) {
      this.updateMetrics('cancelled');
      return Promise.resolve() as Promise<T>;
    }
    
    // 创建新任务
    const task: DebounceTask<T> = {
      id: taskId,
      fn,
      args,
      layer,
      createdAt: Date.now(),
      priority: options.priority || layer.priority,
      forceExecute: options.forceExecute || false
    };
    
    this.taskQueue.set(taskId, task);
    this.scheduleExecution(task);
    this.updateMetrics('queued');
    
    // 返回Promise以便链式调用
    return new Promise<T>((resolve, reject) => {
      this.waitForTaskResolution<T>(taskId, resolve, reject);
    });
  }
  
  /**
   * 取消任务
   */
  cancel(taskId: string): boolean {
    const task = this.taskQueue.get(taskId);
    if (!task) {
      return false;
    }
    
    const timer = this.activeTimers.get(taskId);
    if (timer) {
      clearTimeout(timer);
      this.activeTimers.delete(taskId);
    }
    
    this.taskQueue.delete(taskId);
    this.updateMetrics('cancelled');
    
    return true;
  }
  
  /**
   * 批量执行任务
   */
  batchExecute<T = any>(
    tasks: Array<{
      fn: (...args: any[]) => T | Promise<T>;
      args?: any[];
      layer?: string;
      priority?: number;
    }>,
    options: {
      concurrent?: boolean;
      maxConcurrency?: number;
    } = {}
  ): Promise<T[]> {
    const { concurrent = false, maxConcurrency = 3 } = options;
    
    if (concurrent) {
      return this.executeConcurrent(tasks, maxConcurrency);
    } else {
      return this.executeSequential(tasks);
    }
  }
  
  /**
   * 执行队列中的所有任务
   */
  flushAll(): void {
    const tasks = Array.from(this.taskQueue.values());
    
    // 清理所有计时器
    this.activeTimers.forEach(timer => clearTimeout(timer));
    this.activeTimers.clear();
    
    // 按优先级排序
    tasks.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    // 执行所有任务
    tasks.forEach(task => {
      try {
        task.fn(...task.args);
        this.updateMetrics('executed');
      } catch (error) {
        console.error(`Task ${task.id} execution failed:`, error);
      }
    });
    
    this.taskQueue.clear();
  }
  
  /**
   * 暂停调度器
   */
  pause(): void {
    this.isEnabled = false;
  }
  
  /**
   * 恢复调度器
   */
  resume(): void {
    this.isEnabled = true;
    
    // 重新调度所有等待的任务
    this.taskQueue.forEach((task, taskId) => {
      if (!this.activeTimers.has(taskId)) {
        this.scheduleExecution(task);
      }
    });
  }
  
  /**
   * 获取性能指标
   */
  getMetrics(): PerformanceMetrics {
    return {
      ...this.performanceMetrics,
      memoryUsage: this.getMemoryUsage()
    };
  }
  
  /**
   * 重置性能指标
   */
  resetMetrics(): void {
    this.performanceMetrics = {
      totalTasks: 0,
      cancelledTasks: 0,
      executedTasks: 0,
      averageDelay: 0,
      peakQueueSize: 0,
      memoryUsage: this.getMemoryUsage()
    };
  }
  
  /**
   * 检查是否存在指定任务
   */
  hasTask(taskId: string): boolean {
    return this.taskQueue.has(taskId);
  }
  
  /**
   * 获取队列状态
   */
  getQueueStatus(): {
    totalTasks: number;
    tasksByLayer: Map<string, number>;
    pendingTasks: number;
    activeTimers: number;
  } {
    const tasksByLayer = <Map<string, number>>new Map();
    
    this.taskQueue.forEach(task => {
      const layerName = task.layer.name;
      tasksByLayer.set(layerName, (tasksByLayer.get(layerName) || 0) + 1);
    });
    
    return {
      totalTasks: this.taskQueue.size,
      tasksByLayer,
      pendingTasks: this.taskQueue.size,
      activeTimers: this.activeTimers.size
    };
  }
  
  /**
   * 调度任务执行
   */
  private scheduleExecution(task: DebounceTask): void {
    if (!this.isEnabled) {
      return;
    }
    
    const timer = setTimeout(() => {
      this.executeTask(task);
    }, task.layer.delay);
    
    this.activeTimers.set(task.id, timer);
    
    // 设置最大等待时间
    if (task.layer.maxWait && task.layer.maxWait > task.layer.delay) {
      setTimeout(() => {
        this.forceExecuteTask(task);
      }, task.layer.maxWait);
    }
  }
  
  /**
   * 执行单个任务
   */
  private executeTask(task: DebounceTask): void {
    try {
      task.fn(...task.args);
      this.updateMetrics('executed');
    } catch (error) {
      console.error(`Task ${task.id} execution failed:`, error);
    } finally {
      this.taskQueue.delete(task.id);
      this.activeTimers.delete(task.id);
    }
  }
  
  /**
   * 强制执行任务
   */
  private forceExecuteTask(task: DebounceTask): void {
    if (!this.taskQueue.has(task.id)) {
      return;
    }
    
    // 清除延迟计时器
    const timer = this.activeTimers.get(task.id);
    if (timer) {
      clearTimeout(timer);
      this.activeTimers.delete(task.id);
    }
    
    this.executeTask(task);
  }
  
  /**
   * 并发执行任务
   */
  private async executeConcurrent<T>(
    tasks: Array<{
      fn: (...args: any[]) => T | Promise<T>;
      args?: any[];
      layer?: string;
      priority?: number;
    }>,
    maxConcurrency: number
  ): Promise<T[]> {
    const results: T[] = new Array(tasks.length);
    const executing: Promise<void>[] = [];
    
    let index = 0;
    
    const executeTask = async (taskIndex: number, task: typeof tasks[0]) => {
      try {
        const result = await this.execute(
          task.fn,
          task.args || [],
          task.layer || 'normal',
          { priority: task.priority || 0 }
        );
        results[taskIndex] = result;
      } catch (error) {
        // 任务失败，不抛出错误
        console.error(`Task ${taskIndex} failed:`, error);
      }
    };
    
    while (index < tasks.length) {
      // 启动新任务直到达到并发限制
      while (executing.length < maxConcurrency && index < tasks.length) {
        const task = tasks[index];
        const promise = executeTask(index, task);
        executing.push(promise);
        index++;
      }
      
      // 等待至少一个任务完成
      if (executing.length > 0) {
        await Promise.race(executing);
        // 简单的移除策略：移除第一个
        executing.shift();
      }
    }
    
    // 等待所有剩余任务完成
    await Promise.all(executing);
    
    return results;
  }
  
  /**
   * 顺序执行任务
   */
  private async executeSequential<T>(
    tasks: Array<{
      fn: (...args: any[]) => T | Promise<T>;
      args?: any[];
      layer?: string;
      priority?: number;
    }>
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (const task of tasks) {
      const result = await this.execute(
        task.fn,
        task.args || [],
        task.layer || 'normal',
        { priority: task.priority || 0 }
      );
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * 等待任务解析
   */
  private waitForTaskResolution<T>(
    taskId: string,
    resolve: (value: T) => void,
    reject: (reason?: any) => void
  ): void {
    const checkInterval = setInterval(() => {
      if (!this.taskQueue.has(taskId)) {
        clearInterval(checkInterval);
        // 任务已完成
        resolve(Promise.resolve() as T);
      }
    }, 10);
    
    // 超时保护
    setTimeout(() => {
      clearInterval(checkInterval);
      this.taskQueue.delete(taskId);
      reject(new Error(`Task ${taskId} timeout`));
    }, 30000); // 30秒超时
  }
  
  /**
   * 更新性能指标
   */
  private updateMetrics(type: 'queued' | 'executed' | 'cancelled'): void {
    this.performanceMetrics.totalTasks++;
    
    if (type === 'executed') {
      this.performanceMetrics.executedTasks++;
    } else if (type === 'cancelled') {
      this.performanceMetrics.cancelledTasks++;
    }
    
    const currentQueueSize = this.taskQueue.size;
    if (currentQueueSize > this.performanceMetrics.peakQueueSize) {
      this.performanceMetrics.peakQueueSize = currentQueueSize;
    }
    
    // 计算平均延迟
    if (this.performanceMetrics.totalTasks > 0) {
      const totalDelay = Array.from(this.activeTimers.values()).reduce((a, b) => a + b, 0);
      this.performanceMetrics.averageDelay = totalDelay / this.activeTimers.size;
    }
  }
  
  /**
   * 获取内存使用情况
   */
  private getMemoryUsage(): number {
    return (performance as any)?.memory?.usedJSHeapSize || 0;
  }
  
  /**
   * 销毁优化器
   */
  destroy(): void {
    // 清理所有计时器
    this.activeTimers.forEach(timer => clearTimeout(timer));
    this.activeTimers.clear();
    
    // 清理任务队列
    this.taskQueue.clear();
    
    // 清理层级配置
    this.layers.clear();
    
    this.isEnabled = false;
  }
}
