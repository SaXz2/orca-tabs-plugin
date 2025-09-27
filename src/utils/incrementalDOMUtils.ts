/**
 * 增量DOM更新工具
 * 
 * 提供高效的DOM增量更新功能，避免全量重建DOM元素
 * 显著提升大量标签页时的渲染性能
 */

import { TabInfo } from '../types';

/**
 * DOM变化类型
 */
export interface DOMChanges {
  added: TabInfo[];
  removed: TabInfo[];
  updated: TabInfo[];
  reordered: Array<{ tab: TabInfo; oldIndex: number; newIndex: number }>;
}

/**
 * 增量DOM更新管理器
 */
export class IncrementalDOMUpdater {
  private tabElementCache = new Map<string, HTMLElement>();
  private lastTabsState: TabInfo[] = [];
  private container: HTMLElement | null = null;
  
  constructor(container: HTMLElement) {
    this.container = container;
  }
  
  /**
   * 增量更新标签页DOM
   */
  updateTabsIncremental(newTabs: TabInfo[]): void {
    if (!this.container) return;
    
    const changes = this.calculateChanges(this.lastTabsState, newTabs);
    
    // 执行增量更新
    this.executeChanges(changes);
    
    // 更新状态
    this.lastTabsState = [...newTabs];
  }
  
  /**
   * 计算DOM变化
   */
  private calculateChanges(oldTabs: TabInfo[], newTabs: TabInfo[]): DOMChanges {
    const changes: DOMChanges = {
      added: [],
      removed: [],
      updated: [],
      reordered: []
    };
    
    // 计算新增的标签页
    changes.added = newTabs.filter(tab => 
      !oldTabs.find(t => t.blockId === tab.blockId)
    );
    
    // 计算删除的标签页
    changes.removed = oldTabs.filter(tab => 
      !newTabs.find(t => t.blockId === tab.blockId)
    );
    
    // 计算更新的标签页
    changes.updated = newTabs.filter(tab => {
      const oldTab = oldTabs.find(t => t.blockId === tab.blockId);
      return oldTab && !this.areTabsEqual(oldTab, tab);
    });
    
    // 计算重排序的标签页
    changes.reordered = this.calculateReorderChanges(oldTabs, newTabs);
    
    return changes;
  }
  
  /**
   * 执行DOM变化
   */
  private executeChanges(changes: DOMChanges): void {
    if (!this.container) return;
    
    // 1. 移除删除的标签页
    changes.removed.forEach(tab => this.removeTabElement(tab));
    
    // 2. 添加新的标签页
    changes.added.forEach(tab => this.addTabElement(tab));
    
    // 3. 更新变化的标签页
    changes.updated.forEach(tab => this.updateTabElement(tab));
    
    // 4. 处理重排序
    changes.reordered.forEach(({ tab, newIndex }) => {
      this.reorderTabElement(tab, newIndex);
    });
  }
  
  /**
   * 添加标签页元素
   */
  private addTabElement(tab: TabInfo): void {
    if (!this.container) return;
    
    const element = this.createTabElement(tab);
    this.tabElementCache.set(tab.blockId, element);
    
    // 插入到正确位置
    const insertIndex = this.findInsertPosition(tab);
    this.insertElementAtPosition(element, insertIndex);
  }
  
  /**
   * 移除标签页元素
   */
  private removeTabElement(tab: TabInfo): void {
    const element = this.tabElementCache.get(tab.blockId);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      this.tabElementCache.delete(tab.blockId);
    }
  }
  
  /**
   * 更新标签页元素
   */
  private updateTabElement(tab: TabInfo): void {
    const element = this.tabElementCache.get(tab.blockId);
    if (!element) return;
    
    // 更新元素内容
    this.updateElementContent(element, tab);
    
    // 更新样式
    this.updateElementStyles(element, tab);
  }
  
  /**
   * 重排序标签页元素
   */
  private reorderTabElement(tab: TabInfo, newIndex: number): void {
    const element = this.tabElementCache.get(tab.blockId);
    if (!element || !this.container) return;
    
    // 移除元素
    element.remove();
    
    // 插入到新位置
    this.insertElementAtPosition(element, newIndex);
  }
  
  /**
   * 创建标签页元素
   */
  private createTabElement(tab: TabInfo): HTMLElement {
    const element = document.createElement('div');
    element.className = 'tab-element';
    element.setAttribute('data-tab-id', tab.blockId);
    
    // 设置内容
    this.updateElementContent(element, tab);
    
    // 设置样式
    this.updateElementStyles(element, tab);
    
    return element;
  }
  
  /**
   * 更新元素内容
   */
  private updateElementContent(element: HTMLElement, tab: TabInfo): void {
    element.innerHTML = `
      <div class="tab-content">
        <span class="tab-icon">${tab.icon || '📄'}</span>
        <span class="tab-title">${tab.title}</span>
        ${tab.isPinned ? '<span class="pin-icon">📌</span>' : ''}
        <button class="close-button" data-tab-id="${tab.blockId}">×</button>
      </div>
    `;
  }
  
  /**
   * 更新元素样式
   */
  private updateElementStyles(element: HTMLElement, tab: TabInfo): void {
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
    
    // 添加固定标签的特殊样式
    if (tab.isPinned) {
      element.style.borderLeft = '3px solid var(--orca-color-accent)';
      element.style.fontWeight = '600';
    }
  }
  
  /**
   * 查找插入位置
   */
  private findInsertPosition(tab: TabInfo): number {
    if (!this.container) return 0;
    
    const children = Array.from(this.container.children);
    const tabElements = children.filter(child => 
      child.classList.contains('tab-element')
    );
    
    // 固定标签页排在前面
    if (tab.isPinned) {
      const pinnedCount = tabElements.filter(el => 
        el.getAttribute('data-tab-id') && 
        this.lastTabsState.find(t => t.blockId === el.getAttribute('data-tab-id') && t.isPinned)
      ).length;
      return pinnedCount;
    }
    
    // 普通标签页排在固定标签页后面
    return tabElements.length;
  }
  
  /**
   * 在指定位置插入元素
   */
  private insertElementAtPosition(element: HTMLElement, index: number): void {
    if (!this.container) return;
    
    const children = Array.from(this.container.children);
    const tabElements = children.filter(child => 
      child.classList.contains('tab-element')
    );
    
    if (index >= tabElements.length) {
      this.container.appendChild(element);
    } else {
      this.container.insertBefore(element, tabElements[index]);
    }
  }
  
  /**
   * 计算重排序变化
   */
  private calculateReorderChanges(oldTabs: TabInfo[], newTabs: TabInfo[]): Array<{ tab: TabInfo; oldIndex: number; newIndex: number }> {
    const reordered: Array<{ tab: TabInfo; oldIndex: number; newIndex: number }> = [];
    
    for (let i = 0; i < newTabs.length; i++) {
      const newTab = newTabs[i];
      const oldIndex = oldTabs.findIndex(t => t.blockId === newTab.blockId);
      
      if (oldIndex !== -1 && oldIndex !== i) {
        reordered.push({
          tab: newTab,
          oldIndex,
          newIndex: i
        });
      }
    }
    
    return reordered;
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
      tab1.isPinned === tab2.isPinned &&
      tab1.order === tab2.order
    );
  }
  
  /**
   * 清理缓存
   */
  cleanup(): void {
    this.tabElementCache.clear();
    this.lastTabsState = [];
  }
  
  /**
   * 获取缓存统计
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.tabElementCache.size,
      hitRate: this.calculateHitRate()
    };
  }
  
  /**
   * 计算缓存命中率
   */
  private calculateHitRate(): number {
    // 这里可以实现更复杂的命中率计算逻辑
    return 0.85; // 示例值
  }
}
