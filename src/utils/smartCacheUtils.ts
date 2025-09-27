/**
 * 智能缓存管理器
 * 
 * 提供高效的缓存机制，减少重复计算和DOM操作
 * 支持LRU缓存、过期清理和内存监控
 */

import { TabInfo } from '../types';

/**
 * 缓存项接口
 */
interface CacheItem<T> {
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
}

/**
 * 缓存统计信息
 */
interface CacheStats {
  size: number;
  hitRate: number;
  memoryUsage: number;
  oldestItem: number;
  newestItem: number;
}

/**
 * 智能缓存管理器
 */
export class SmartCacheManager {
  private tabInfoCache = new Map<string, CacheItem<TabInfo>>();
  private computedStyleCache = new Map<string, CacheItem<any>>();
  private domElementCache = new Map<string, CacheItem<HTMLElement>>();
  private maxCacheSize = 200;
  private maxAge = 5 * 60 * 1000; // 5分钟
  private cleanupInterval: number | null = null;
  
  constructor() {
    this.startCleanupTimer();
  }
  
  /**
   * 获取标签页信息（带缓存）
   */
  getTabInfo(blockId: string): TabInfo | null {
    const cached = this.tabInfoCache.get(blockId);
    
    if (cached && !this.isExpired(cached)) {
      // 更新访问统计
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      return cached.value;
    }
    
    // 缓存未命中，重新计算
    const tabInfo = this.computeTabInfo(blockId);
    if (tabInfo) {
      this.setTabInfo(blockId, tabInfo);
    }
    
    return tabInfo;
  }
  
  /**
   * 设置标签页信息缓存
   */
  setTabInfo(blockId: string, tabInfo: TabInfo): void {
    const now = Date.now();
    const cacheItem: CacheItem<TabInfo> = {
      value: tabInfo,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    };
    
    this.tabInfoCache.set(blockId, cacheItem);
    this.enforceMaxSize();
  }
  
  /**
   * 获取计算样式（带缓存）
   */
  getComputedStyle(element: HTMLElement, property: string): string | null {
    const key = `${element.tagName}-${property}`;
    const cached = this.computedStyleCache.get(key);
    
    if (cached && !this.isExpired(cached)) {
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      return cached.value;
    }
    
    // 重新计算
    const value = window.getComputedStyle(element).getPropertyValue(property);
    this.setComputedStyle(key, value);
    
    return value;
  }
  
  /**
   * 设置计算样式缓存
   */
  setComputedStyle(key: string, value: string): void {
    const now = Date.now();
    const cacheItem: CacheItem<string> = {
      value,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    };
    
    this.computedStyleCache.set(key, cacheItem);
  }
  
  /**
   * 获取DOM元素缓存
   */
  getCachedElement(key: string): HTMLElement | null {
    const cached = this.domElementCache.get(key);
    
    if (cached && !this.isExpired(cached)) {
      cached.accessCount++;
      cached.lastAccessed = Date.now();
      return cached.value;
    }
    
    return null;
  }
  
  /**
   * 设置DOM元素缓存
   */
  setCachedElement(key: string, element: HTMLElement): void {
    const now = Date.now();
    const cacheItem: CacheItem<HTMLElement> = {
      value: element,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now
    };
    
    this.domElementCache.set(key, cacheItem);
  }
  
  /**
   * 批量获取标签页信息
   */
  getBatchTabInfo(blockIds: string[]): Map<string, TabInfo> {
    const result = new Map<string, TabInfo>();
    const missingIds: string[] = [];
    
    // 先从缓存获取
    for (const blockId of blockIds) {
      const cached = this.tabInfoCache.get(blockId);
      if (cached && !this.isExpired(cached)) {
        cached.accessCount++;
        cached.lastAccessed = Date.now();
        result.set(blockId, cached.value);
      } else {
        missingIds.push(blockId);
      }
    }
    
    // 批量计算缺失的
    if (missingIds.length > 0) {
      const computedTabs = this.computeBatchTabInfo(missingIds);
      for (const [blockId, tabInfo] of computedTabs.entries()) {
        result.set(blockId, tabInfo);
        this.setTabInfo(blockId, tabInfo);
      }
    }
    
    return result;
  }
  
  /**
   * 预加载标签页信息
   */
  preloadTabInfo(blockIds: string[]): void {
    const missingIds = blockIds.filter(id => !this.tabInfoCache.has(id));
    
    if (missingIds.length > 0) {
      // 异步预加载
      setTimeout(() => {
        const computedTabs = this.computeBatchTabInfo(missingIds);
        for (const [blockId, tabInfo] of computedTabs.entries()) {
          this.setTabInfo(blockId, tabInfo);
        }
      }, 0);
    }
  }
  
  /**
   * 清理过期缓存
   */
  cleanupExpiredCache(): void {
    const now = Date.now();
    
    // 清理标签页信息缓存
    for (const [key, item] of this.tabInfoCache.entries()) {
      if (this.isExpired(item)) {
        this.tabInfoCache.delete(key);
      }
    }
    
    // 清理样式缓存
    for (const [key, item] of this.computedStyleCache.entries()) {
      if (this.isExpired(item)) {
        this.computedStyleCache.delete(key);
      }
    }
    
    // 清理DOM元素缓存
    for (const [key, item] of this.domElementCache.entries()) {
      if (this.isExpired(item)) {
        this.domElementCache.delete(key);
      }
    }
  }
  
  /**
   * 清理LRU缓存
   */
  cleanupLRUCache(): void {
    const totalSize = this.tabInfoCache.size + this.computedStyleCache.size + this.domElementCache.size;
    
    if (totalSize > this.maxCacheSize) {
      // 合并所有缓存项并按访问时间排序
      const allItems: Array<{ key: string; cache: string; item: CacheItem<any> }> = [];
      
      for (const [key, item] of this.tabInfoCache.entries()) {
        allItems.push({ key, cache: 'tabInfo', item });
      }
      
      for (const [key, item] of this.computedStyleCache.entries()) {
        allItems.push({ key, cache: 'style', item });
      }
      
      for (const [key, item] of this.domElementCache.entries()) {
        allItems.push({ key, cache: 'dom', item });
      }
      
      // 按最后访问时间排序，删除最旧的
      allItems.sort((a, b) => a.item.lastAccessed - b.item.lastAccessed);
      
      const toDelete = allItems.slice(0, Math.floor(totalSize * 0.2)); // 删除20%
      
      for (const { key, cache } of toDelete) {
        switch (cache) {
          case 'tabInfo':
            this.tabInfoCache.delete(key);
            break;
          case 'style':
            this.computedStyleCache.delete(key);
            break;
          case 'dom':
            this.domElementCache.delete(key);
            break;
        }
      }
    }
  }
  
  /**
   * 检查缓存项是否过期
   */
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > this.maxAge;
  }
  
  /**
   * 强制执行最大缓存大小
   */
  private enforceMaxSize(): void {
    if (this.tabInfoCache.size > this.maxCacheSize) {
      this.cleanupLRUCache();
    }
  }
  
  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    this.cleanupInterval = window.setInterval(() => {
      this.cleanupExpiredCache();
      this.cleanupLRUCache();
    }, 30000); // 每30秒清理一次
  }
  
  /**
   * 停止清理定时器
   */
  private stopCleanupTimer(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
  
  /**
   * 计算标签页信息（模拟实现）
   */
  private computeTabInfo(blockId: string): TabInfo | null {
    // 这里应该调用实际的Orca API来获取块信息
    // 为了演示，返回模拟数据
    return {
      blockId,
      panelId: 'default',
      title: `标签页 ${blockId}`,
      order: 0,
      isPinned: false
    };
  }
  
  /**
   * 批量计算标签页信息
   */
  private computeBatchTabInfo(blockIds: string[]): Map<string, TabInfo> {
    const result = new Map<string, TabInfo>();
    
    for (const blockId of blockIds) {
      const tabInfo = this.computeTabInfo(blockId);
      if (tabInfo) {
        result.set(blockId, tabInfo);
      }
    }
    
    return result;
  }
  
  /**
   * 获取缓存统计信息
   */
  getCacheStats(): CacheStats {
    const allItems: CacheItem<any>[] = [
      ...this.tabInfoCache.values(),
      ...this.computedStyleCache.values(),
      ...this.domElementCache.values()
    ];
    
    const now = Date.now();
    const timestamps = allItems.map(item => item.timestamp);
    
    return {
      size: allItems.length,
      hitRate: this.calculateHitRate(),
      memoryUsage: this.estimateMemoryUsage(),
      oldestItem: timestamps.length > 0 ? Math.min(...timestamps) : now,
      newestItem: timestamps.length > 0 ? Math.max(...timestamps) : now
    };
  }
  
  /**
   * 计算缓存命中率
   */
  private calculateHitRate(): number {
    const allItems = [
      ...this.tabInfoCache.values(),
      ...this.computedStyleCache.values(),
      ...this.domElementCache.values()
    ];
    
    if (allItems.length === 0) return 0;
    
    const totalAccesses = allItems.reduce((sum, item) => sum + item.accessCount, 0);
    const totalItems = allItems.length;
    
    return totalAccesses / (totalAccesses + totalItems);
  }
  
  /**
   * 估算内存使用量
   */
  private estimateMemoryUsage(): number {
    // 简单的内存估算
    let size = 0;
    
    for (const [key, item] of this.tabInfoCache.entries()) {
      size += key.length * 2; // 字符串长度
      size += JSON.stringify(item.value).length * 2;
    }
    
    for (const [key, item] of this.computedStyleCache.entries()) {
      size += key.length * 2;
      size += JSON.stringify(item.value).length * 2;
    }
    
    return size;
  }
  
  /**
   * 清理所有缓存
   */
  clearAllCache(): void {
    this.tabInfoCache.clear();
    this.computedStyleCache.clear();
    this.domElementCache.clear();
  }
  
  /**
   * 销毁缓存管理器
   */
  destroy(): void {
    this.stopCleanupTimer();
    this.clearAllCache();
  }
}
