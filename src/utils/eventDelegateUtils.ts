/**
 * 事件委托管理器
 * 
 * 使用事件委托模式优化事件处理，减少事件监听器数量
 * 提升大量标签页时的性能表现
 */

import { TabInfo } from '../types';

/**
 * 事件处理器类型
 */
export type EventHandler = (tabId: string, event: Event) => void;

/**
 * 事件委托管理器
 */
export class EventDelegateManager {
  private container: HTMLElement;
  private eventHandlers = new Map<string, EventHandler>();
  private isInitialized = false;
  
  constructor(container: HTMLElement) {
    this.container = container;
  }
  
  /**
   * 初始化事件委托
   */
  initialize(): void {
    if (this.isInitialized) return;
    
    this.setupEventDelegation();
    this.isInitialized = true;
  }
  
  /**
   * 设置事件委托
   */
  private setupEventDelegation(): void {
    // 点击事件委托
    this.container.addEventListener('click', this.handleClick.bind(this), { passive: false });
    
    // 右键菜单事件委托
    this.container.addEventListener('contextmenu', this.handleContextMenu.bind(this), { passive: false });
    
    // 拖拽事件委托
    this.container.addEventListener('dragstart', this.handleDragStart.bind(this), { passive: false });
    this.container.addEventListener('dragover', this.handleDragOver.bind(this), { passive: false });
    this.container.addEventListener('drop', this.handleDrop.bind(this), { passive: false });
    this.container.addEventListener('dragend', this.handleDragEnd.bind(this), { passive: false });
    
    // 键盘事件委托
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this), { passive: false });
    
    // 鼠标悬停事件委托
    this.container.addEventListener('mouseenter', this.handleMouseEnter.bind(this), { passive: true });
    this.container.addEventListener('mouseleave', this.handleMouseLeave.bind(this), { passive: true });
  }
  
  /**
   * 注册事件处理器
   */
  registerHandler(eventType: string, handler: EventHandler): void {
    this.eventHandlers.set(eventType, handler);
  }
  
  /**
   * 统一点击事件处理
   */
  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (!tabId) return;
    
    // 阻止默认行为
    event.preventDefault();
    event.stopPropagation();
    
    // 根据点击位置决定行为
    if (target.classList.contains('close-button')) {
      this.executeHandler('close', tabId, event);
    } else if (target.classList.contains('pin-button')) {
      this.executeHandler('pin', tabId, event);
    } else if (target.classList.contains('tab-title')) {
      this.executeHandler('rename', tabId, event);
    } else {
      this.executeHandler('click', tabId, event);
    }
  }
  
  /**
   * 处理右键菜单事件
   */
  private handleContextMenu(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (!tabId) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    this.executeHandler('contextmenu', tabId, event);
  }
  
  /**
   * 处理拖拽开始事件
   */
  private handleDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (!tabId) return;
    
    // 设置拖拽数据
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', tabId);
      event.dataTransfer.effectAllowed = 'move';
    }
    
    // 添加拖拽样式
    tabElement.classList.add('dragging');
    
    this.executeHandler('dragstart', tabId, event);
  }
  
  /**
   * 处理拖拽悬停事件
   */
  private handleDragOver(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    
    // 添加悬停样式
    tabElement.classList.add('drag-over');
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (tabId) {
      this.executeHandler('dragover', tabId, event);
    }
  }
  
  /**
   * 处理拖拽放置事件
   */
  private handleDrop(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    event.preventDefault();
    event.stopPropagation();
    
    const tabId = tabElement.getAttribute('data-tab-id');
    const draggedTabId = event.dataTransfer?.getData('text/plain');
    
    if (tabId && draggedTabId && tabId !== draggedTabId) {
      this.executeHandler('drop', tabId, event);
    }
  }
  
  /**
   * 处理拖拽结束事件
   */
  private handleDragEnd(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    // 移除拖拽样式
    tabElement.classList.remove('dragging');
    
    // 移除所有悬停样式
    this.container.querySelectorAll('.drag-over').forEach(el => {
      el.classList.remove('drag-over');
    });
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (tabId) {
      this.executeHandler('dragend', tabId, event);
    }
  }
  
  /**
   * 处理键盘事件
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (!tabId) return;
    
    // 处理快捷键
    if (event.key === 'F2') {
      event.preventDefault();
      this.executeHandler('rename', tabId, event);
    } else if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      this.executeHandler('pin', tabId, event);
    } else if (event.ctrlKey && event.key === 'w') {
      event.preventDefault();
      this.executeHandler('close', tabId, event);
    }
  }
  
  /**
   * 处理鼠标进入事件
   */
  private handleMouseEnter(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (tabId) {
      this.executeHandler('mouseenter', tabId, event);
    }
  }
  
  /**
   * 处理鼠标离开事件
   */
  private handleMouseLeave(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const tabElement = this.findTabElement(target);
    
    if (!tabElement) return;
    
    const tabId = tabElement.getAttribute('data-tab-id');
    if (tabId) {
      this.executeHandler('mouseleave', tabId, event);
    }
  }
  
  /**
   * 查找标签页元素
   */
  private findTabElement(target: HTMLElement): HTMLElement | null {
    return target.closest('.tab-element') as HTMLElement;
  }
  
  /**
   * 执行事件处理器
   */
  private executeHandler(eventType: string, tabId: string, event: Event): void {
    const handler = this.eventHandlers.get(eventType);
    if (handler) {
      try {
        handler(tabId, event);
      } catch (error) {
        console.error(`事件处理器执行失败 (${eventType}):`, error);
      }
    }
  }
  
  /**
   * 清理事件监听器
   */
  cleanup(): void {
    if (!this.isInitialized) return;
    
    this.container.removeEventListener('click', this.handleClick.bind(this));
    this.container.removeEventListener('contextmenu', this.handleContextMenu.bind(this));
    this.container.removeEventListener('dragstart', this.handleDragStart.bind(this));
    this.container.removeEventListener('dragover', this.handleDragOver.bind(this));
    this.container.removeEventListener('drop', this.handleDrop.bind(this));
    this.container.removeEventListener('dragend', this.handleDragEnd.bind(this));
    this.container.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.container.removeEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.container.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    this.eventHandlers.clear();
    this.isInitialized = false;
  }
  
  /**
   * 获取事件统计
   */
  getEventStats(): { handlerCount: number; isInitialized: boolean } {
    return {
      handlerCount: this.eventHandlers.size,
      isInitialized: this.isInitialized
    };
  }
}
