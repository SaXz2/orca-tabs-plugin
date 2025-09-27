/**
 * 轻量级增量更新管理器
 * 
 * 针对实际使用场景（5-20个标签页）的轻量级优化
 * 避免过度工程化，专注于实际性能提升
 */

import { TabInfo } from '../types';

/**
 * 轻量级增量更新管理器
 */
export class LightweightIncrementalUpdater {
  private tabElementCache = new Map<string, HTMLElement>();
  private lastTabsState: TabInfo[] = [];
  private container: HTMLElement | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
  }
  
  /**
   * 轻量级更新标签页
   */
  updateTabs(newTabs: TabInfo[]): void {
    if (!this.container) return;
    
    // 快速检查：如果数量变化不大，使用增量更新
    if (Math.abs(newTabs.length - this.lastTabsState.length) <= 2) {
      this.updateIncremental(newTabs);
    } else {
      // 数量变化较大，使用全量更新
      this.updateFull(newTabs);
    }
    
    this.lastTabsState = [...newTabs];
  }
  
  /**
   * 增量更新
   */
  private updateIncremental(newTabs: TabInfo[]): void {
    const oldTabs = this.lastTabsState;
    
    // 找出新增的标签页
    const addedTabs = newTabs.filter(tab => 
      !oldTabs.find(t => t.blockId === tab.blockId)
    );
    
    // 找出删除的标签页
    const removedTabs = oldTabs.filter(tab => 
      !newTabs.find(t => t.blockId === tab.blockId)
    );
    
    // 找出更新的标签页
    const updatedTabs = newTabs.filter(tab => {
      const oldTab = oldTabs.find(t => t.blockId === tab.blockId);
      return oldTab && !this.areTabsEqual(oldTab, tab);
    });
    
    // 执行更新
    removedTabs.forEach(tab => this.removeTab(tab));
    addedTabs.forEach(tab => this.addTab(tab));
    updatedTabs.forEach(tab => this.updateTab(tab));
  }
  
  /**
   * 全量更新
   */
  private updateFull(newTabs: TabInfo[]): void {
    if (!this.container) return;
    
    // 清空容器
    this.container.innerHTML = '';
    this.tabElementCache.clear();
    
    // 重新创建所有标签页
    newTabs.forEach(tab => {
      this.addTab(tab);
    });
  }
  
  /**
   * 添加标签页
   */
  private addTab(tab: TabInfo): void {
    if (!this.container) return;
    
    const element = this.createTabElement(tab);
    this.tabElementCache.set(tab.blockId, element);
    this.container.appendChild(element);
  }
  
  /**
   * 移除标签页
   */
  private removeTab(tab: TabInfo): void {
    const element = this.tabElementCache.get(tab.blockId);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      this.tabElementCache.delete(tab.blockId);
    }
  }
  
  /**
   * 更新标签页
   */
  private updateTab(tab: TabInfo): void {
    const element = this.tabElementCache.get(tab.blockId);
    if (!element) return;
    
    // 更新内容
    const titleElement = element.querySelector('.tab-title');
    if (titleElement) {
      titleElement.textContent = tab.title;
    }
    
    // 更新样式
    if (tab.color) {
      element.style.background = tab.color;
    }
    
    if (tab.isPinned) {
      element.style.borderLeft = '3px solid var(--orca-color-accent)';
      element.style.fontWeight = '600';
    } else {
      element.style.borderLeft = '';
      element.style.fontWeight = '';
    }
  }
  
  /**
   * 创建标签页元素
   */
  private createTabElement(tab: TabInfo): HTMLElement {
    const element = document.createElement('div');
    element.className = 'tab-element';
    element.setAttribute('data-tab-id', tab.blockId);
    
    element.innerHTML = `
      <div class="tab-content">
        <span class="tab-icon">${tab.icon || '📄'}</span>
        <span class="tab-title">${tab.title}</span>
        ${tab.isPinned ? '<span class="pin-icon">📌</span>' : ''}
        <button class="close-button" data-tab-id="${tab.blockId}">×</button>
      </div>
    `;
    
    // 应用样式
    this.applyTabStyles(element, tab);
    
    return element;
  }
  
  /**
   * 应用标签页样式
   */
  private applyTabStyles(element: HTMLElement, tab: TabInfo): void {
    const baseStyle = `
      display: flex;
      align-items: center;
      padding: 4px 8px;
      margin: 2px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: ${tab.color || 'var(--orca-tab-bg)'};
      color: var(--orca-color-text-1);
      font-size: 12px;
      max-width: 200px;
      min-width: 80px;
    `;
    
    element.style.cssText = baseStyle;
    
    if (tab.isPinned) {
      element.style.borderLeft = '3px solid var(--orca-color-accent)';
      element.style.fontWeight = '600';
    }
  }
  
  /**
   * 比较两个标签页是否相等
   */
  private areTabsEqual(tab1: TabInfo, tab2: TabInfo): boolean {
    return (
      tab1.blockId === tab2.blockId &&
      tab1.title === tab2.title &&
      tab1.color === tab2.color &&
      tab1.icon === tab2.icon &&
      tab1.isPinned === tab2.isPinned
    );
  }
  
  /**
   * 清理缓存
   */
  cleanup(): void {
    this.tabElementCache.clear();
    this.lastTabsState = [];
  }
}
