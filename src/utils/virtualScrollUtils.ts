/**
 * 虚拟滚动管理器
 * 
 * 当标签页数量过多时，只渲染可见区域的标签页
 * 显著提升大量标签页时的性能表现
 */

import { TabInfo } from '../types';

/**
 * 虚拟滚动配置
 */
interface VirtualScrollConfig {
  containerHeight: number;
  itemHeight: number;
  overscan: number; // 预渲染的额外项目数量
  threshold: number; // 启用虚拟滚动的标签页数量阈值
}

/**
 * 可见项目信息
 */
interface VisibleItem {
  tab: TabInfo;
  index: number;
  top: number;
  height: number;
}

/**
 * 虚拟滚动管理器
 */
export class VirtualScrollManager {
  private config: VirtualScrollConfig;
  private container: HTMLElement;
  private scrollTop = 0;
  private allTabs: TabInfo[] = [];
  private visibleItems: VisibleItem[] = [];
  private itemElements = new Map<string, HTMLElement>();
  private isEnabled = false;
  private scrollHandler: ((event: Event) => void) | null = null;
  
  constructor(container: HTMLElement, config: Partial<VirtualScrollConfig> = {}) {
    this.container = container;
    this.config = {
      containerHeight: config.containerHeight || 200,
      itemHeight: config.itemHeight || 28,
      overscan: config.overscan || 5,
      threshold: config.threshold || 20
    };
  }
  
  /**
   * 更新标签页数据
   */
  updateTabs(tabs: TabInfo[]): void {
    this.allTabs = [...tabs];
    
    // 根据标签页数量决定是否启用虚拟滚动
    const shouldEnable = tabs.length >= this.config.threshold;
    
    if (shouldEnable && !this.isEnabled) {
      this.enableVirtualScroll();
    } else if (!shouldEnable && this.isEnabled) {
      this.disableVirtualScroll();
    }
    
    if (this.isEnabled) {
      this.updateVisibleItems();
      this.renderVisibleItems();
    }
  }
  
  /**
   * 启用虚拟滚动
   */
  private enableVirtualScroll(): void {
    this.isEnabled = true;
    
    // 设置容器样式
    this.container.style.height = `${this.config.containerHeight}px`;
    this.container.style.overflowY = 'auto';
    this.container.style.position = 'relative';
    
    // 添加滚动监听
    this.scrollHandler = (event: Event) => {
      const target = event.target as HTMLElement;
      this.scrollTop = target.scrollTop;
      this.updateVisibleItems();
      this.renderVisibleItems();
    };
    
    this.container.addEventListener('scroll', this.scrollHandler, { passive: true });
    
    console.log('🚀 虚拟滚动已启用');
  }
  
  /**
   * 禁用虚拟滚动
   */
  private disableVirtualScroll(): void {
    this.isEnabled = false;
    
    // 恢复容器样式
    this.container.style.height = '';
    this.container.style.overflowY = '';
    this.container.style.position = '';
    
    // 移除滚动监听
    if (this.scrollHandler) {
      this.container.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
    
    // 清理虚拟滚动元素
    this.clearVirtualElements();
    
    console.log('📋 虚拟滚动已禁用');
  }
  
  /**
   * 更新可见项目
   */
  private updateVisibleItems(): void {
    const { itemHeight, overscan } = this.config;
    
    // 计算可见范围
    const startIndex = Math.max(0, Math.floor(this.scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      this.allTabs.length,
      Math.ceil((this.scrollTop + this.config.containerHeight) / itemHeight) + overscan
    );
    
    // 生成可见项目
    this.visibleItems = [];
    for (let i = startIndex; i < endIndex; i++) {
      if (this.allTabs[i]) {
        this.visibleItems.push({
          tab: this.allTabs[i],
          index: i,
          top: i * itemHeight,
          height: itemHeight
        });
      }
    }
  }
  
  /**
   * 渲染可见项目
   */
  private renderVisibleItems(): void {
    // 创建文档片段
    const fragment = document.createDocumentFragment();
    
    // 创建占位容器（用于保持滚动条正确）
    const placeholder = document.createElement('div');
    placeholder.style.height = `${this.allTabs.length * this.config.itemHeight}px`;
    placeholder.style.position = 'absolute';
    placeholder.style.top = '0';
    placeholder.style.left = '0';
    placeholder.style.right = '0';
    placeholder.style.pointerEvents = 'none';
    
    // 创建可见项目容器
    const itemsContainer = document.createElement('div');
    itemsContainer.style.position = 'absolute';
    itemsContainer.style.top = '0';
    itemsContainer.style.left = '0';
    itemsContainer.style.right = '0';
    itemsContainer.style.pointerEvents = 'auto';
    
    // 渲染可见项目
    this.visibleItems.forEach(item => {
      const element = this.getItemElement(item.tab, item.index);
      element.style.position = 'absolute';
      element.style.top = `${item.top}px`;
      element.style.left = '0';
      element.style.right = '0';
      element.style.height = `${item.height}px`;
      
      itemsContainer.appendChild(element);
    });
    
    // 清理现有内容
    this.container.innerHTML = '';
    
    // 添加占位符和项目容器
    fragment.appendChild(placeholder);
    fragment.appendChild(itemsContainer);
    this.container.appendChild(fragment);
  }
  
  /**
   * 获取或创建项目元素
   */
  private getItemElement(tab: TabInfo, index: number): HTMLElement {
    const key = `${tab.blockId}-${index}`;
    
    if (this.itemElements.has(key)) {
      return this.itemElements.get(key)!;
    }
    
    const element = this.createTabElement(tab);
    this.itemElements.set(key, element);
    
    return element;
  }
  
  /**
   * 创建标签页元素
   */
  private createTabElement(tab: TabInfo): HTMLElement {
    const element = document.createElement('div');
    element.className = 'virtual-tab-element';
    element.setAttribute('data-tab-id', tab.blockId);
    element.setAttribute('data-tab-index', tab.order.toString());
    
    // 设置内容
    element.innerHTML = `
      <div class="tab-content">
        <span class="tab-icon">${tab.icon || '📄'}</span>
        <span class="tab-title">${tab.title}</span>
        ${tab.isPinned ? '<span class="pin-icon">📌</span>' : ''}
        <button class="close-button" data-tab-id="${tab.blockId}">×</button>
      </div>
    `;
    
    // 设置样式
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
      width: 100%;
      box-sizing: border-box;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
    `;
    
    element.style.cssText = baseStyle;
    
    // 添加固定标签的特殊样式
    if (tab.isPinned) {
      element.style.borderLeft = '3px solid var(--orca-color-accent)';
      element.style.fontWeight = '600';
    }
  }
  
  /**
   * 清理虚拟滚动元素
   */
  private clearVirtualElements(): void {
    this.itemElements.clear();
    this.visibleItems = [];
  }
  
  /**
   * 滚动到指定索引
   */
  scrollToIndex(index: number): void {
    if (!this.isEnabled) return;
    
    const targetScrollTop = index * this.config.itemHeight;
    this.container.scrollTop = targetScrollTop;
  }
  
  /**
   * 滚动到顶部
   */
  scrollToTop(): void {
    if (!this.isEnabled) return;
    this.container.scrollTop = 0;
  }
  
  /**
   * 滚动到底部
   */
  scrollToBottom(): void {
    if (!this.isEnabled) return;
    this.container.scrollTop = this.allTabs.length * this.config.itemHeight;
  }
  
  /**
   * 获取可见项目
   */
  getVisibleItems(): VisibleItem[] {
    return [...this.visibleItems];
  }
  
  /**
   * 获取虚拟滚动状态
   */
  getVirtualScrollStatus(): {
    isEnabled: boolean;
    totalItems: number;
    visibleItems: number;
    scrollTop: number;
    scrollPercentage: number;
  } {
    const totalHeight = this.allTabs.length * this.config.itemHeight;
    const scrollPercentage = totalHeight > 0 ? (this.scrollTop / totalHeight) * 100 : 0;
    
    return {
      isEnabled: this.isEnabled,
      totalItems: this.allTabs.length,
      visibleItems: this.visibleItems.length,
      scrollTop: this.scrollTop,
      scrollPercentage
    };
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<VirtualScrollConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.isEnabled) {
      this.updateVisibleItems();
      this.renderVisibleItems();
    }
  }
  
  /**
   * 销毁虚拟滚动管理器
   */
  destroy(): void {
    this.disableVirtualScroll();
    this.allTabs = [];
    this.visibleItems = [];
  }
}
