/**
 * Web Workers 管理器
 * 
 * 使用Web Workers处理大量标签页数据的计算
 * 避免阻塞主线程，提升用户体验
 */

/**
 * Worker消息类型
 */
interface WorkerMessage {
  type: 'PROCESS_TABS' | 'CALCULATE_STATS' | 'FILTER_TABS' | 'SORT_TABS';
  data: any;
  id: string;
}

/**
 * Worker响应类型
 */
interface WorkerResponse {
  type: 'SUCCESS' | 'ERROR';
  data: any;
  id: string;
  error?: string;
}

/**
 * 标签页处理任务
 */
interface TabProcessingTask {
  tabs: any[];
  operation: 'process' | 'stats' | 'filter' | 'sort';
  options?: any;
}

/**
 * Web Workers 管理器
 */
export class WebWorkerManager {
  private worker: Worker | null = null;
  private messageHandlers = new Map<string, (data: any) => void>();
  private isSupported = false;
  private taskQueue: Array<{ task: TabProcessingTask; resolve: (data: any) => void; reject: (error: Error) => void }> = [];
  private isProcessing = false;
  
  constructor() {
    this.initializeWorker();
  }
  
  /**
   * 初始化Worker
   */
  private initializeWorker(): void {
    try {
      // 创建内联Worker
      const workerCode = this.getWorkerCode();
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
      
      // 监听Worker消息
      this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        this.handleWorkerMessage(event.data);
      };
      
      // 监听Worker错误
      this.worker.onerror = (error) => {
        console.error('Worker错误:', error);
        this.handleWorkerError(error);
      };
      
      this.isSupported = true;
      console.log('🚀 Web Worker 已初始化');
    } catch (error) {
      console.warn('Web Worker 不支持，将使用主线程处理:', error);
      this.isSupported = false;
    }
  }
  
  /**
   * 处理标签页数据
   */
  async processTabs(tabs: any[], options: any = {}): Promise<any[]> {
    if (!this.isSupported || tabs.length < 50) {
      // 数据量小或Worker不支持时使用主线程
      return this.processTabsOnMainThread(tabs, options);
    }
    
    return this.executeWorkerTask({
      tabs,
      operation: 'process',
      options
    });
  }
  
  /**
   * 计算标签页统计信息
   */
  async calculateTabStats(tabs: any[]): Promise<any> {
    if (!this.isSupported || tabs.length < 100) {
      return this.calculateStatsOnMainThread(tabs);
    }
    
    return this.executeWorkerTask({
      tabs,
      operation: 'stats'
    });
  }
  
  /**
   * 过滤标签页
   */
  async filterTabs(tabs: any[], filterOptions: any): Promise<any[]> {
    if (!this.isSupported || tabs.length < 50) {
      return this.filterTabsOnMainThread(tabs, filterOptions);
    }
    
    return this.executeWorkerTask({
      tabs,
      operation: 'filter',
      options: filterOptions
    });
  }
  
  /**
   * 排序标签页
   */
  async sortTabs(tabs: any[], sortOptions: any): Promise<any[]> {
    if (!this.isSupported || tabs.length < 50) {
      return this.sortTabsOnMainThread(tabs, sortOptions);
    }
    
    return this.executeWorkerTask({
      tabs,
      operation: 'sort',
      options: sortOptions
    });
  }
  
  /**
   * 执行Worker任务
   */
  private async executeWorkerTask(task: TabProcessingTask): Promise<any> {
    return new Promise((resolve, reject) => {
      const taskId = this.generateTaskId();
      
      // 注册消息处理器
      this.messageHandlers.set(taskId, (data: any) => {
        this.messageHandlers.delete(taskId);
        resolve(data);
      });
      
      // 添加到任务队列
      this.taskQueue.push({ task, resolve, reject });
      
      // 处理任务队列
      this.processTaskQueue();
    });
  }
  
  /**
   * 处理任务队列
   */
  private async processTaskQueue(): Promise<void> {
    if (this.isProcessing || this.taskQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.taskQueue.length > 0) {
      const { task, resolve, reject } = this.taskQueue.shift()!;
      
      try {
        const result = await this.sendWorkerMessage(task);
        resolve(result);
        } catch (error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      
      // 让出主线程
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    this.isProcessing = false;
  }
  
  /**
   * 发送Worker消息
   */
  private async sendWorkerMessage(task: TabProcessingTask): Promise<any> {
    if (!this.worker) throw new Error('Worker未初始化');
    
    const messageId = this.generateTaskId();
    const message: WorkerMessage = {
      type: this.getWorkerMessageType(task.operation),
      data: task,
      id: messageId
    };
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Worker任务超时'));
      }, 10000); // 10秒超时
      
      this.messageHandlers.set(messageId, (data: any) => {
        clearTimeout(timeout);
        resolve(data);
      });
      
      this.worker!.postMessage(message);
    });
  }
  
  /**
   * 处理Worker消息
   */
  private handleWorkerMessage(response: WorkerResponse): void {
    const handler = this.messageHandlers.get(response.id);
    if (handler) {
      if (response.type === 'SUCCESS') {
        handler(response.data);
      } else {
        console.error('Worker任务失败:', response.error);
      }
    }
  }
  
  /**
   * 处理Worker错误
   */
  private handleWorkerError(error: ErrorEvent): void {
    // 清理所有待处理的任务
    this.taskQueue.forEach(({ reject }) => {
      reject(new Error('Worker错误: ' + error.message));
    });
    this.taskQueue = [];
    this.messageHandlers.clear();
  }
  
  /**
   * 主线程处理标签页数据
   */
  private processTabsOnMainThread(tabs: any[], options: any): any[] {
    // 模拟处理逻辑
    return tabs.map(tab => ({
      ...tab,
      processed: true,
      timestamp: Date.now()
    }));
  }
  
  /**
   * 主线程计算统计信息
   */
  private calculateStatsOnMainThread(tabs: any[]): any {
    const stats = {
      total: tabs.length,
      pinned: tabs.filter(tab => tab.isPinned).length,
      unpinned: tabs.filter(tab => !tab.isPinned).length,
      byType: {} as Record<string, number>,
      averageTitleLength: 0
    };
    
    let totalTitleLength = 0;
    tabs.forEach(tab => {
      const type = tab.blockType || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      totalTitleLength += tab.title?.length || 0;
    });
    
    stats.averageTitleLength = tabs.length > 0 ? totalTitleLength / tabs.length : 0;
    
    return stats;
  }
  
  /**
   * 主线程过滤标签页
   */
  private filterTabsOnMainThread(tabs: any[], filterOptions: any): any[] {
    return tabs.filter(tab => {
      if (filterOptions.pinned !== undefined && tab.isPinned !== filterOptions.pinned) {
        return false;
      }
      if (filterOptions.type && tab.blockType !== filterOptions.type) {
        return false;
      }
      if (filterOptions.search && !tab.title.toLowerCase().includes(filterOptions.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }
  
  /**
   * 主线程排序标签页
   */
  private sortTabsOnMainThread(tabs: any[], sortOptions: any): any[] {
    const sortedTabs = [...tabs];
    
    sortedTabs.sort((a, b) => {
      switch (sortOptions.field) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'order':
          return a.order - b.order;
        case 'pinned':
          return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
        default:
          return 0;
      }
    });
    
    return sortedTabs;
  }
  
  /**
   * 获取Worker消息类型
   */
  private getWorkerMessageType(operation: string): WorkerMessage['type'] {
    switch (operation) {
      case 'process': return 'PROCESS_TABS';
      case 'stats': return 'CALCULATE_STATS';
      case 'filter': return 'FILTER_TABS';
      case 'sort': return 'SORT_TABS';
      default: return 'PROCESS_TABS';
    }
  }
  
  /**
   * 生成任务ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * 获取Worker代码
   */
  private getWorkerCode(): string {
    return `
      // Web Worker 代码
      self.onmessage = function(event) {
        const { type, data, id } = event.data;
        
        try {
          let result;
          
          switch (type) {
            case 'PROCESS_TABS':
              result = processTabs(data.tabs, data.options);
              break;
            case 'CALCULATE_STATS':
              result = calculateStats(data.tabs);
              break;
            case 'FILTER_TABS':
              result = filterTabs(data.tabs, data.options);
              break;
            case 'SORT_TABS':
              result = sortTabs(data.tabs, data.options);
              break;
            default:
              throw new Error('未知的任务类型: ' + type);
          }
          
          self.postMessage({
            type: 'SUCCESS',
            data: result,
            id: id
          });
        } catch (error) {
          self.postMessage({
            type: 'ERROR',
            data: null,
            id: id,
            error: error.message
          });
        }
      };
      
      function processTabs(tabs, options) {
        return tabs.map(tab => ({
          ...tab,
          processed: true,
          timestamp: Date.now(),
          workerProcessed: true
        }));
      }
      
      function calculateStats(tabs) {
        const stats = {
          total: tabs.length,
          pinned: tabs.filter(tab => tab.isPinned).length,
          unpinned: tabs.filter(tab => !tab.isPinned).length,
          byType: {},
          averageTitleLength: 0,
          workerCalculated: true
        };
        
        let totalTitleLength = 0;
        tabs.forEach(tab => {
          const type = tab.blockType || 'unknown';
          stats.byType[type] = (stats.byType[type] || 0) + 1;
          totalTitleLength += tab.title?.length || 0;
        });
        
        stats.averageTitleLength = tabs.length > 0 ? totalTitleLength / tabs.length : 0;
        
        return stats;
      }
      
      function filterTabs(tabs, options) {
        return tabs.filter(tab => {
          if (options.pinned !== undefined && tab.isPinned !== options.pinned) {
            return false;
          }
          if (options.type && tab.blockType !== options.type) {
            return false;
          }
          if (options.search && !tab.title.toLowerCase().includes(options.search.toLowerCase())) {
            return false;
          }
          return true;
        });
      }
      
      function sortTabs(tabs, options) {
        const sortedTabs = [...tabs];
        
        sortedTabs.sort((a, b) => {
          switch (options.field) {
            case 'title':
              return a.title.localeCompare(b.title);
            case 'order':
              return a.order - b.order;
            case 'pinned':
              return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
            default:
              return 0;
          }
        });
        
        return sortedTabs;
      }
    `;
  }
  
  /**
   * 获取Worker状态
   */
  getWorkerStatus(): {
    isSupported: boolean;
    isActive: boolean;
    queueLength: number;
    isProcessing: boolean;
  } {
    return {
      isSupported: this.isSupported,
      isActive: this.worker !== null,
      queueLength: this.taskQueue.length,
      isProcessing: this.isProcessing
    };
  }
  
  /**
   * 销毁Worker
   */
  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    this.messageHandlers.clear();
    this.taskQueue = [];
    this.isProcessing = false;
  }
}

