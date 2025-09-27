/**
 * 批量操作优化工具
 * 
 * 提供高效的批量操作功能，减少DOM操作和提升性能
 * 支持批量创建、更新、删除标签页等操作
 */

import { TabInfo } from '../types';

/**
 * 批量操作类型
 */
type BatchOperationType = 'create' | 'update' | 'delete' | 'move' | 'pin' | 'unpin';

/**
 * 批量操作项
 */
interface BatchOperationItem {
  type: BatchOperationType;
  tabId: string;
  data?: any;
  priority: number;
  timestamp: number;
}

/**
 * 批量操作配置
 */
interface BatchOperationConfig {
  maxBatchSize: number;
  batchDelay: number;
  enablePriority: boolean;
  enableDebounce: boolean;
  debounceDelay: number;
}

/**
 * 批量操作结果
 */
interface BatchOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: string[];
  duration: number;
}

/**
 * 批量操作优化工具
 */
export class BatchOperationOptimizer {
  private config: BatchOperationConfig;
  private operationQueue: BatchOperationItem[] = [];
  private isProcessing = false;
  private processingTimer: number | null = null;
  private debounceTimer: number | null = null;
  private operationHandlers = new Map<BatchOperationType, (items: BatchOperationItem[]) => Promise<void>>();
  
  constructor(config: Partial<BatchOperationConfig> = {}) {
    this.config = {
      maxBatchSize: 10,
      batchDelay: 16, // 60fps
      enablePriority: true,
      enableDebounce: true,
      debounceDelay: 100,
      ...config
    };
    
    this.initializeOperationHandlers();
  }
  
  /**
   * 初始化操作处理器
   */
  private initializeOperationHandlers(): void {
    this.operationHandlers.set('create', this.handleBatchCreate.bind(this));
    this.operationHandlers.set('update', this.handleBatchUpdate.bind(this));
    this.operationHandlers.set('delete', this.handleBatchDelete.bind(this));
    this.operationHandlers.set('move', this.handleBatchMove.bind(this));
    this.operationHandlers.set('pin', this.handleBatchPin.bind(this));
    this.operationHandlers.set('unpin', this.handleBatchUnpin.bind(this));
  }
  
  /**
   * 添加批量操作
   */
  addOperation(type: BatchOperationType, tabId: string, data?: any, priority: number = 50): void {
    const operation: BatchOperationItem = {
      type,
      tabId,
      data,
      priority,
      timestamp: Date.now()
    };
    
    this.operationQueue.push(operation);
    
    // 触发处理
    this.triggerProcessing();
  }
  
  /**
   * 批量创建标签页
   */
  batchCreateTabs(tabs: TabInfo[]): Promise<BatchOperationResult> {
    return this.executeBatchOperation('create', tabs.map(tab => ({
      tabId: tab.blockId,
      data: tab,
      priority: 80
    })));
  }
  
  /**
   * 批量更新标签页
   */
  batchUpdateTabs(updates: Array<{ tabId: string; data: Partial<TabInfo> }>): Promise<BatchOperationResult> {
    return this.executeBatchOperation('update', updates.map(update => ({
      tabId: update.tabId,
      data: update.data,
      priority: 70
    })));
  }
  
  /**
   * 批量删除标签页
   */
  batchDeleteTabs(tabIds: string[]): Promise<BatchOperationResult> {
    return this.executeBatchOperation('delete', tabIds.map(tabId => ({
      tabId,
      priority: 90
    })));
  }
  
  /**
   * 批量移动标签页
   */
  batchMoveTabs(moves: Array<{ tabId: string; newIndex: number }>): Promise<BatchOperationResult> {
    return this.executeBatchOperation('move', moves.map(move => ({
      tabId: move.tabId,
      data: { newIndex: move.newIndex },
      priority: 60
    })));
  }
  
  /**
   * 批量固定标签页
   */
  batchPinTabs(tabIds: string[]): Promise<BatchOperationResult> {
    return this.executeBatchOperation('pin', tabIds.map(tabId => ({
      tabId,
      priority: 75
    })));
  }
  
  /**
   * 批量取消固定标签页
   */
  batchUnpinTabs(tabIds: string[]): Promise<BatchOperationResult> {
    return this.executeBatchOperation('unpin', tabIds.map(tabId => ({
      tabId,
      priority: 75
    })));
  }
  
  /**
   * 执行批量操作
   */
  private async executeBatchOperation(type: BatchOperationType, operations: Array<{ tabId: string; data?: any; priority: number }>): Promise<BatchOperationResult> {
    const startTime = performance.now();
    let processed = 0;
    let failed = 0;
    const errors: string[] = [];
    
    try {
      // 按优先级排序
      if (this.config.enablePriority) {
        operations.sort((a, b) => b.priority - a.priority);
      }
      
      // 分批处理
      const batches = this.createBatches(operations, this.config.maxBatchSize);
      
      for (const batch of batches) {
        try {
          const batchOperations = batch.map(op => ({
            type,
            tabId: op.tabId,
            data: op.data,
            priority: op.priority,
            timestamp: Date.now()
          }));
          
          await this.processBatch(batchOperations);
          processed += batch.length;
        } catch (error) {
          failed += batch.length;
          errors.push(`批次处理失败: ${error}`);
        }
        
        // 让出主线程
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      
      const duration = performance.now() - startTime;
      
      return {
        success: failed === 0,
        processed,
        failed,
        errors,
        duration
      };
    } catch (error) {
      return {
        success: false,
        processed,
        failed: operations.length - processed,
        errors: [`批量操作失败: ${error}`],
        duration: performance.now() - startTime
      };
    }
  }
  
  /**
   * 创建批次
   */
  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    
    return batches;
  }
  
  /**
   * 触发处理
   */
  private triggerProcessing(): void {
    if (this.isProcessing) return;
    
    if (this.config.enableDebounce) {
      // 防抖处理
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      this.debounceTimer = window.setTimeout(() => {
        this.processQueue();
      }, this.config.debounceDelay);
    } else {
      // 立即处理
      this.processQueue();
    }
  }
  
  /**
   * 处理队列
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.operationQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      // 按类型分组操作
      const groupedOperations = this.groupOperationsByType();
      
      // 按优先级排序
      if (this.config.enablePriority) {
        Object.keys(groupedOperations).forEach(type => {
          const operationType = type as BatchOperationType;
          groupedOperations[operationType].sort((a: BatchOperationItem, b: BatchOperationItem) => b.priority - a.priority);
        });
      }
      
      // 处理每种类型的操作
      for (const [type, operations] of Object.entries(groupedOperations)) {
        if (operations.length > 0) {
          await this.processBatch(operations);
        }
      }
      
      // 清空队列
      this.operationQueue = [];
    } finally {
      this.isProcessing = false;
    }
  }
  
  /**
   * 按类型分组操作
   */
  private groupOperationsByType(): Record<BatchOperationType, BatchOperationItem[]> {
    const grouped: Record<BatchOperationType, BatchOperationItem[]> = {
      create: [],
      update: [],
      delete: [],
      move: [],
      pin: [],
      unpin: []
    };
    
    this.operationQueue.forEach(operation => {
      grouped[operation.type].push(operation);
    });
    
    return grouped;
  }
  
  /**
   * 处理批次
   */
  private async processBatch(operations: BatchOperationItem[]): Promise<void> {
    if (operations.length === 0) return;
    
    const type = operations[0].type;
    const handler = this.operationHandlers.get(type);
    
    if (handler) {
      await handler(operations);
    } else {
      throw new Error(`未知的操作类型: ${type}`);
    }
  }
  
  /**
   * 处理批量创建
   */
  private async handleBatchCreate(operations: BatchOperationItem[]): Promise<void> {
    console.log(`🔄 批量创建 ${operations.length} 个标签页`);
    
    // 使用DocumentFragment批量创建
    const fragment = document.createDocumentFragment();
    
    operations.forEach(operation => {
      const element = this.createTabElement(operation.data);
      fragment.appendChild(element);
    });
    
    // 一次性添加到DOM
    const container = document.querySelector('.tab-container');
    if (container) {
      container.appendChild(fragment);
    }
  }
  
  /**
   * 处理批量更新
   */
  private async handleBatchUpdate(operations: BatchOperationItem[]): Promise<void> {
    console.log(`🔄 批量更新 ${operations.length} 个标签页`);
    
    // 批量更新样式
    const styleUpdates: Array<{ element: HTMLElement; styles: Record<string, string> }> = [];
    
    operations.forEach(operation => {
      const element = document.querySelector(`[data-tab-id="${operation.tabId}"]`) as HTMLElement;
      if (element) {
        styleUpdates.push({
          element,
          styles: this.generateUpdateStyles(operation.data)
        });
      }
    });
    
    // 批量应用样式
    this.batchApplyStyles(styleUpdates);
  }
  
  /**
   * 处理批量删除
   */
  private async handleBatchDelete(operations: BatchOperationItem[]): Promise<void> {
    console.log(`🔄 批量删除 ${operations.length} 个标签页`);
    
    // 批量移除DOM元素
    const elementsToRemove: HTMLElement[] = [];
    
    operations.forEach(operation => {
      const element = document.querySelector(`[data-tab-id="${operation.tabId}"]`) as HTMLElement;
      if (element) {
        elementsToRemove.push(element);
      }
    });
    
    // 批量移除
    elementsToRemove.forEach(element => {
      element.remove();
    });
  }
  
  /**
   * 处理批量移动
   */
  private async handleBatchMove(operations: BatchOperationItem[]): Promise<void> {
    console.log(`🔄 批量移动 ${operations.length} 个标签页`);
    
    // 批量重新排序
    const container = document.querySelector('.tab-container');
    if (!container) return;
    
    const elements = Array.from(container.children) as HTMLElement[];
    const sortedElements = elements.sort((a, b) => {
      const aIndex = operations.findIndex(op => op.tabId === a.getAttribute('data-tab-id'));
      const bIndex = operations.findIndex(op => op.tabId === b.getAttribute('data-tab-id'));
      
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });
    
    // 重新排列
    sortedElements.forEach(element => {
      container.appendChild(element);
    });
  }
  
  /**
   * 处理批量固定
   */
  private async handleBatchPin(operations: BatchOperationItem[]): Promise<void> {
    console.log(`🔄 批量固定 ${operations.length} 个标签页`);
    
    operations.forEach(operation => {
      const element = document.querySelector(`[data-tab-id="${operation.tabId}"]`) as HTMLElement;
      if (element) {
        element.classList.add('pinned');
        element.style.borderLeft = '3px solid var(--orca-color-accent)';
        element.style.fontWeight = '600';
      }
    });
  }
  
  /**
   * 处理批量取消固定
   */
  private async handleBatchUnpin(operations: BatchOperationItem[]): Promise<void> {
    console.log(`🔄 批量取消固定 ${operations.length} 个标签页`);
    
    operations.forEach(operation => {
      const element = document.querySelector(`[data-tab-id="${operation.tabId}"]`) as HTMLElement;
      if (element) {
        element.classList.remove('pinned');
        element.style.borderLeft = '';
        element.style.fontWeight = '';
      }
    });
  }
  
  /**
   * 创建标签页元素
   */
  private createTabElement(tabData: TabInfo): HTMLElement {
    const element = document.createElement('div');
    element.className = 'tab-element';
    element.setAttribute('data-tab-id', tabData.blockId);
    
    element.innerHTML = `
      <div class="tab-content">
        <span class="tab-icon">${tabData.icon || '📄'}</span>
        <span class="tab-title">${tabData.title}</span>
        ${tabData.isPinned ? '<span class="pin-icon">📌</span>' : ''}
        <button class="close-button" data-tab-id="${tabData.blockId}">×</button>
      </div>
    `;
    
    // 应用样式
    this.applyTabStyles(element, tabData);
    
    return element;
  }
  
  /**
   * 应用标签页样式
   */
  private applyTabStyles(element: HTMLElement, tabData: TabInfo): void {
    const baseStyle = `
      display: flex;
      align-items: center;
      padding: 4px 8px;
      margin: 2px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: ${tabData.color || 'var(--orca-tab-bg)'};
      color: var(--orca-color-text-1);
      font-size: 12px;
      max-width: 200px;
      min-width: 80px;
    `;
    
    element.style.cssText = baseStyle;
    
    if (tabData.isPinned) {
      element.style.borderLeft = '3px solid var(--orca-color-accent)';
      element.style.fontWeight = '600';
    }
  }
  
  /**
   * 生成更新样式
   */
  private generateUpdateStyles(data: Partial<TabInfo>): Record<string, string> {
    const styles: Record<string, string> = {};
    
    if (data.color) {
      styles.background = data.color;
    }
    
    if (data.title) {
      // 更新标题文本
      const titleElement = document.querySelector(`[data-tab-id="${data.blockId}"] .tab-title`);
      if (titleElement) {
        titleElement.textContent = data.title;
      }
    }
    
    if (data.isPinned !== undefined) {
      if (data.isPinned) {
        styles.borderLeft = '3px solid var(--orca-color-accent)';
        styles.fontWeight = '600';
      } else {
        styles.borderLeft = '';
        styles.fontWeight = '';
      }
    }
    
    return styles;
  }
  
  /**
   * 批量应用样式
   */
  private batchApplyStyles(styleUpdates: Array<{ element: HTMLElement; styles: Record<string, string> }>): void {
    // 使用DocumentFragment批量更新
    const fragment = document.createDocumentFragment();
    
    styleUpdates.forEach(({ element, styles }) => {
      Object.assign(element.style, styles);
      fragment.appendChild(element);
    });
    
    // 一次性更新DOM
    const container = styleUpdates[0]?.element.parentElement;
    if (container) {
      container.appendChild(fragment);
    }
  }
  
  /**
   * 获取队列状态
   */
  getQueueStatus(): {
    queueLength: number;
    isProcessing: boolean;
    operationTypes: Record<BatchOperationType, number>;
  } {
    const operationTypes: Record<BatchOperationType, number> = {
      create: 0,
      update: 0,
      delete: 0,
      move: 0,
      pin: 0,
      unpin: 0
    };
    
    this.operationQueue.forEach(operation => {
      operationTypes[operation.type]++;
    });
    
    return {
      queueLength: this.operationQueue.length,
      isProcessing: this.isProcessing,
      operationTypes
    };
  }
  
  /**
   * 清空队列
   */
  clearQueue(): void {
    this.operationQueue = [];
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<BatchOperationConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * 销毁优化器
   */
  destroy(): void {
    this.clearQueue();
    this.operationHandlers.clear();
    this.isProcessing = false;
  }
}

