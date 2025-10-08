/**
 * MutationObserver优化工具
 * 
 * 提供高效的DOM变化监听机制，减少不必要的性能开销。
 * 包含智能观察模式、变化的批量处理和内存泄漏防护。
 */

import { simpleVerbose } from './logUtils';

export interface MutationObserverConfig {
  /** 是否启用批量处理 */
  enableBatch: boolean;
  /** 批量处理的最大延迟时间（毫秒） */
  batchDelay: number;
  /** 每次批处理的最大变化数量 */
  maxBatchSize: number;
  /** 是否启用智能过滤 */
  enableSmartFilter: boolean;
  /** 高频变化的冷却时间（毫秒） */
  coolingPeriod: number;
}

export interface MutationObserverCallbacks {
  onBatchMutations?: (mutations: MutationRecord[]) => void;
  onHotMutation?: (mutation: MutationRecord) => void;
  onThrottledMutation?: (mutations: MutationRecord[]) => void;
}

export class OptimizedMutationObserver {
  private observer: MutationObserver | null = null;
  private config: MutationObserverConfig;
  private callbacks: MutationObserverCallbacks;
  private mutationQueue: MutationRecord[] = [];
  private batchTimer: number | null = null;
  private lastBatchTime = 0;
  private isObserving = false;
  private targetElement: Node;
  
  constructor(
    config: Partial<MutationObserverConfig> = {},
    callbacks: MutationObserverCallbacks = {}
  ) {
    this.config = {
      enableBatch: true,
      batchDelay: 16, // 一帧的时间
      maxBatchSize: 50,
      enableSmartFilter: true,
      coolingPeriod: 100,
      ...config
    };
    this.callbacks = callbacks;
    this.targetElement = document.body; // 默认监听整个body
  }
  
  /**
   * 开始观察
   */
  observe(
    target: Node,
    options: MutationObserverInit = {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    }
  ): void {
    if (this.isObserving) {
      this.disconnect();
    }
    
    this.targetElement = target;
    this.observer = new MutationObserver(this.handleMutations.bind(this));
    this.observer.observe(target, options);
    this.isObserving = true;
  }
  
  /**
   * 停止观察
   */
  disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    this.mutationQueue = [];
    this.isObserving = false;
  }
  
  /**
   * 是否正在观察
   */
  get observing(): boolean {
    return this.isObserving;
  }
  
  /**
   * 处理突变记录
   */
  private handleMutations(mutations: MutationRecord[]): void {
    const now = Date.now();
    
    // 智能过滤相关变化
    const filteredMutations = this.config.enableSmartFilter 
      ? this.filterRelevantMutations(mutations)
      : mutations;
    
    if (filteredMutations.length === 0) {
      return;
    }
    
    // 检测高频变化
    if (now - this.lastBatchTime < this.config.coolingPeriod) {
      this.log('🚨 检测到高频变化，启用冷却期');
      // 处理单个热点变化
      filteredMutations.forEach(mutation => {
        this.handleHotMutation(mutation);
      });
      return;
    }
    
    if (this.config.enableBatch) {
      this.handleBatchMutations(filteredMutations, now);
    } else {
      // 直接处理每个变化
      filteredMutations.forEach(mutation => {
        this.callbacks.onHotMutation?.(mutation);
      });
    }
  }
  
  /**
   * 处理批量变化
   */
  private handleBatchMutations(mutations: MutationRecord[], now: number): void {
    // 添加到队列
    this.mutationQueue.push(...mutations);
    
    // 如果队列过大，立即处理部分
    if (this.mutationQueue.length > this.config.maxBatchSize * 2) {
      this.flushBatch();
      return;
    }
    
    // 清除之前的计时器
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    
    // 设置新的批量处理计时器
    this.batchTimer = window.setTimeout(() => {
      this.flushBatch();
    }, this.config.batchDelay);
  }
  
  /**
   * 立即处理队列中的所有变化
   */
  private flushBatch(): void {
    if (this.mutationQueue.length === 0) {
      return;
    }
    
    const mutations = [...this.mutationQueue];
    this.mutationQueue = [];
    this.batchTimer = null;
    this.lastBatchTime = Date.now();
    
    // 对变化进行去重和合并
    const deduplicatedMutations = this.deduplicateMutations(mutations);
    
    this.callbacks.onBatchMutations?.(deduplicatedMutations);
  }
  
  /**
   * 处理热点变化（高频变化）
   */
  private handleHotMutation(mutation: MutationRecord): void {
    // 对于重要变化，立即处理
    const target = mutation.target as Element;
    
    if (this.isCriticalChange(mutation, target)) {
      this.callbacks.onHotMutation?.(mutation);
    } else {
      // 通过节流处理非关键变化
      this.throttleMutation(mutation);
    }
  }
  
  /**
   * 检测是否为关键变化
   */
  private isCriticalChange(mutation: MutationRecord, target: Element): boolean {
    // 检查面板激活状态变化
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      if (target.classList.contains('orca-panel') && 
          target.classList.contains('active')) {
        return true;
      }
      
      if (target.classList.contains('orca-hideable') && 
          !target.classList.contains('orca-hideable-hidden')) {
        return true;
      }
    }
    
    // 检查关键元素的添加
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      const panelElement = target.closest('.orca-panel, .orca-panels-row');
      if (panelElement) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * 节流处理变化
   */
  private throttleMutation(mutation: MutationRecord): void {
    // 使用 requestAnimationFrame 进行节流
    requestAnimationFrame(() => {
      this.callbacks.onThrottledMutation?.([mutation]);
    });
  }
  
  /**
   * 过滤相关的变化
   */
  private filterRelevantMutations(mutations: MutationRecord[]): MutationRecord[] {
    return mutations.filter(mutation => {
      const target = mutation.target as Element;
      
      // 跳过不相关的元素
      if (target.nodeType !== Node.ELEMENT_NODE) {
        return false;
      }
      
      // 关注特定类别的元素
      const relevantClasses = [
        'orca-panel',
        'orca-hideable',
        'orca-block-editor',
        'orca-panels-row',
        'orca-tab'
      ];
      
      const hasRelevantClass = relevantClasses.some(cls => 
        target.classList.contains(cls) || target.closest(`.${cls}`)
      );
      
      return hasRelevantClass;
    });
  }
  
  /**
   * 对变化进行去重和合并
   */
  private deduplicateMutations(mutations: MutationRecord[]): MutationRecord[] {
    const seenTargets = new Set<Element>();
    const result: MutationRecord[] = [];
    
    // 按时间倒序处理，保留最新的变化
    mutations.reverse().forEach(mutation => {
      const target = mutation.target as Element;
      
      // 对于同一元素的属性变化，只保留第一个（最新的）
      if (mutation.type === 'attributes') {
        if (!seenTargets.has(target)) {
          seenTargets.add(target);
          result.push(mutation);
        }
      } else {
        // 对于子元素变化，检查重复
        const key = `${mutation.type}-${Array.from(mutation.addedNodes).map(n => n.textContent?.substring(0, 50) || 'empty').join(',')}`;
        
        if (!seenTargets.has(target)) {
          seenTargets.add(target);
          result.push(mutation);
        }
      }
    });
    
    return result.reverse(); // 恢复原始顺序
  }
  
  /**
   * 获取性能统计
   */
  getPerformanceStats(): {
    isObserving: boolean;
    queueSize: number;
    hasBatchTimer: boolean;
  } {
    return {
      isObserving: this.isObserving,
      queueSize: this.mutationQueue.length,
      hasBatchTimer: this.batchTimer !== null
    };
  }
  
  /**
   * 强制立即处理所有队列中的变化
   */
  forceFlush(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.flushBatch();
  }
  
  /**
   * 设置观察目标
   */
  setTarget(element: Node): void {
    if (this.isObserving && this.observer) {
      this.observer.disconnect();
      this.observer.observe(element, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
      this.targetElement = element;
    }
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<MutationObserverConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 如果正在观察且配置发生变化，可能需要重启
    if (this.isObserving && (newConfig.enableBatch !== undefined || newConfig.batchDelay !== undefined)) {
      this.log('🔄 配置变化，重新初始化观察器');
      const currentTarget = this.targetElement;
      this.disconnect();
      setTimeout(() => {
        this.observe(currentTarget);
      }, 0);
    }
  }
  
  private log(message: string): void {
    simpleVerbose(`[OptimizedMutationObserver] ${message}`);
  }
  
  /**
   * 销毁观察器
   */
  destroy(): void {
    this.disconnect();
    this.callbacks = {};
    this.config = {} as MutationObserverConfig;
  }
}
