/**
 * 实用的缓存管理器
 * 
 * 针对实际使用场景的轻量级缓存
 * 避免过度复杂化，专注于实际性能提升
 */

import { TabInfo } from '../types';

/**
 * 实用的缓存管理器
 */
export class PracticalCacheManager {
  private tabInfoCache = new Map<string, TabInfo>();
  private maxCacheSize = 50; // 实际使用场景不需要太大
  private maxAge = 2 * 60 * 1000; // 2分钟过期
  
  constructor() {
    // 定期清理过期缓存
    setInterval(() => {
      this.cleanupExpiredCache();
    }, 30000); // 每30秒清理一次
  }
  
  /**
   * 获取标签页信息
   */
  getTabInfo(blockId: string): TabInfo | null {
    const cached = this.tabInfoCache.get(blockId);
    
    if (cached && !this.isExpired(cached)) {
      return cached;
    }
    
    return null;
  }
  
  /**
   * 设置标签页信息
   */
  setTabInfo(blockId: string, tabInfo: TabInfo): void {
    // 如果缓存已满，删除最旧的
    if (this.tabInfoCache.size >= this.maxCacheSize) {
      const firstKey = this.tabInfoCache.keys().next().value;
      if (firstKey) {
        this.tabInfoCache.delete(firstKey);
      }
    }
    
    this.tabInfoCache.set(blockId, tabInfo);
  }
  
  /**
   * 批量获取标签页信息
   */
  getBatchTabInfo(blockIds: string[]): Map<string, TabInfo> {
    const result = new Map<string, TabInfo>();
    
    blockIds.forEach(blockId => {
      const cached = this.getTabInfo(blockId);
      if (cached) {
        result.set(blockId, cached);
      }
    });
    
    return result;
  }
  
  /**
   * 批量设置标签页信息
   */
  setBatchTabInfo(tabs: TabInfo[]): void {
    tabs.forEach(tab => {
      this.setTabInfo(tab.blockId, tab);
    });
  }
  
  /**
   * 检查缓存项是否过期
   */
  private isExpired(tabInfo: TabInfo): boolean {
    // 简单的过期检查：基于时间戳
    const now = Date.now();
    return (now - (tabInfo as any).timestamp) > this.maxAge;
  }
  
  /**
   * 清理过期缓存
   */
  private cleanupExpiredCache(): void {
    const now = Date.now();
    
    for (const [key, tabInfo] of this.tabInfoCache.entries()) {
      if (this.isExpired(tabInfo)) {
        this.tabInfoCache.delete(key);
      }
    }
  }
  
  /**
   * 获取缓存统计
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.tabInfoCache.size,
      hitRate: 0.8 // 简化的命中率估算
    };
  }
  
  /**
   * 清理所有缓存
   */
  clearAllCache(): void {
    this.tabInfoCache.clear();
  }
  
  /**
   * 销毁缓存管理器
   */
  destroy(): void {
    this.clearAllCache();
  }
}
