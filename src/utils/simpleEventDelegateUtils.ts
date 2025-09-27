/**
 * 简化的事件委托管理器
 * 
 * 针对实际使用场景的简化事件处理
 * 专注于核心交互，避免过度复杂化
 */

/**
 * 简化的事件委托管理器
 */
export class SimpleEventDelegate {
  private container: HTMLElement;
  private eventHandlers = new Map<string, Function>();
  
  constructor(container: HTMLElement) {
    this.container = container;
    this.setupEventDelegation();
  }
  
  /**
   * 设置事件委托
   */
  private setupEventDelegation(): void {
    // 点击事件
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tabElement = target.closest('.tab-element');
      
      if (!tabElement) return;
      
      const tabId = tabElement.getAttribute('data-tab-id');
      if (!tabId) return;
      
      // 根据点击位置决定行为
      if (target.classList.contains('close-button')) {
        this.executeHandler('close', tabId, event);
      } else if (target.classList.contains('pin-button')) {
        this.executeHandler('pin', tabId, event);
      } else {
        this.executeHandler('click', tabId, event);
      }
    });
    
    // 右键菜单
    this.container.addEventListener('contextmenu', (event) => {
      const target = event.target as HTMLElement;
      const tabElement = target.closest('.tab-element');
      
      if (!tabElement) return;
      
      const tabId = tabElement.getAttribute('data-tab-id');
      if (!tabId) return;
      
      event.preventDefault();
      this.executeHandler('contextmenu', tabId, event);
    });
    
    // 拖拽事件
    this.container.addEventListener('dragstart', (event) => {
      const target = event.target as HTMLElement;
      const tabElement = target.closest('.tab-element');
      
      if (!tabElement) return;
      
      const tabId = tabElement.getAttribute('data-tab-id');
      if (!tabId) return;
      
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', tabId);
      }
      
      tabElement.classList.add('dragging');
      this.executeHandler('dragstart', tabId, event);
    });
    
    this.container.addEventListener('dragover', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const tabElement = target.closest('.tab-element');
      
      if (tabElement) {
        tabElement.classList.add('drag-over');
        const tabId = tabElement.getAttribute('data-tab-id');
        if (tabId) {
          this.executeHandler('dragover', tabId, event);
        }
      }
    });
    
    this.container.addEventListener('drop', (event) => {
      event.preventDefault();
      const target = event.target as HTMLElement;
      const tabElement = target.closest('.tab-element');
      
      if (tabElement) {
        const tabId = tabElement.getAttribute('data-tab-id');
        if (tabId) {
          this.executeHandler('drop', tabId, event);
        }
      }
    });
    
    this.container.addEventListener('dragend', (event) => {
      const target = event.target as HTMLElement;
      const tabElement = target.closest('.tab-element');
      
      if (tabElement) {
        tabElement.classList.remove('dragging');
        const tabId = tabElement.getAttribute('data-tab-id');
        if (tabId) {
          this.executeHandler('dragend', tabId, event);
        }
      }
      
      // 移除所有悬停样式
      this.container.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
      });
    });
  }
  
  /**
   * 注册事件处理器
   */
  registerHandler(eventType: string, handler: Function): void {
    this.eventHandlers.set(eventType, handler);
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
    this.eventHandlers.clear();
  }
}
