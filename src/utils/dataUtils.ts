/**
 * 数据管理相关的工具函数
 */

import { TabInfo, TabPosition } from '../types';
import { areTabsEqual } from './tabOperationsUtils';

/**
 * 查找最后一个非固定标签的索引
 */
export function findLastNonPinnedTabIndex(tabs: TabInfo[]): number {
  for (let i = tabs.length - 1; i >= 0; i--) {
    if (!tabs[i].isPinned) {
      return i;
    }
  }
  return -1;
}

/**
 * 按固定状态排序标签
 */
export function sortTabsByPinStatus(tabs: TabInfo[]): TabInfo[] {
  return [...tabs].sort((a, b) => {
    // 固定标签排在前面
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // 相同固定状态的标签保持原有顺序
    return 0;
  });
}

/**
 * 检查标签是否已存在
 */
export function findExistingTab(tabs: TabInfo[], blockId: string): TabInfo | null {
  return tabs.find(tab => tab.blockId === blockId) || null;
}

/**
 * 计算智能插入位置
 */
export function calculateSmartInsertPosition(
  tabs: TabInfo[],
  focusedTab: TabInfo | null,
  insertMode: 'replace' | 'after' | 'end'
): { index: number; shouldReplace: boolean } {
  let insertIndex = tabs.length; // 默认插入到末尾
  let shouldReplace = false;

  if (insertMode === 'replace' && focusedTab) {
    const focusedIndex = tabs.findIndex(tab => tab.blockId === focusedTab.blockId);
    if (focusedIndex !== -1) {
      if (focusedTab.isPinned) {
        // 如果是固定标签，在其后面插入
        insertIndex = focusedIndex + 1;
        shouldReplace = false;
      } else {
        // 如果不是固定标签，可以替换
        insertIndex = focusedIndex;
        shouldReplace = true;
      }
    }
  } else if (insertMode === 'after' && focusedTab) {
    const focusedIndex = tabs.findIndex(tab => tab.blockId === focusedTab.blockId);
    if (focusedIndex !== -1) {
      insertIndex = focusedIndex + 1;
    }
  }

  return { index: insertIndex, shouldReplace };
}

/**
 * 处理标签数量限制
 */
export function handleTabLimit(
  tabs: TabInfo[],
  newTab: TabInfo,
  insertIndex: number,
  shouldReplace: boolean,
  maxTabs: number
): TabInfo[] {
  const result = [...tabs];

  if (result.length >= maxTabs) {
    if (shouldReplace && insertIndex < result.length) {
      // 直接替换
      result[insertIndex] = newTab;
    } else {
      // 插入新标签，然后删除最后一个非固定标签
      result.splice(insertIndex, 0, newTab);
      const lastNonPinnedIndex = findLastNonPinnedTabIndex(result);
      if (lastNonPinnedIndex !== -1) {
        result.splice(lastNonPinnedIndex, 1);
      } else {
        // 如果所有标签都是固定的，删除刚插入的新标签
        const newTabIndex = result.findIndex(tab => tab.blockId === newTab.blockId);
        if (newTabIndex !== -1) {
          result.splice(newTabIndex, 1);
        }
      }
    }
  } else {
    if (shouldReplace && insertIndex < result.length) {
      result[insertIndex] = newTab;
    } else {
      result.splice(insertIndex, 0, newTab);
    }
  }

  return result;
}

/**
 * 获取相邻标签
 */
export function getAdjacentTab(tabs: TabInfo[], currentTab: TabInfo): TabInfo | null {
  const currentIndex = tabs.findIndex(tab => tab.blockId === currentTab.blockId);
  if (currentIndex === -1 || tabs.length <= 1) return null;

  // 如果当前标签在中间位置，优先选择右边的标签
  if (currentIndex < tabs.length - 1) {
    return tabs[currentIndex + 1];
  }

  // 如果当前标签在最右边，选择左边的标签
  if (currentIndex > 0) {
    return tabs[currentIndex - 1];
  }

  // 如果当前标签在最左边且只有一个其他标签，选择右边的标签
  if (currentIndex === 0 && tabs.length > 1) {
    return tabs[1];
  }

  return null;
}

/**
 * 过滤标签
 */
export function filterTabs(
  tabs: TabInfo[],
  predicate: (tab: TabInfo) => boolean
): { filtered: TabInfo[]; removed: TabInfo[] } {
  const filtered: TabInfo[] = [];
  const removed: TabInfo[] = [];

  tabs.forEach(tab => {
    if (predicate(tab)) {
      filtered.push(tab);
    } else {
      removed.push(tab);
    }
  });

  return { filtered, removed };
}

/**
 * 更新标签属性
 */
export function updateTabProperty<T extends keyof TabInfo>(
  tabs: TabInfo[],
  blockId: string,
  property: T,
  value: TabInfo[T]
): TabInfo[] {
  return tabs.map(tab => 
    tab.blockId === blockId 
      ? { ...tab, [property]: value }
      : tab
  );
}

/**
 * 批量更新标签属性
 */
export function batchUpdateTabProperties(
  tabs: TabInfo[],
  updates: Array<{ blockId: string; properties: Partial<TabInfo> }>
): TabInfo[] {
  const updateMap = new Map(updates.map(update => [update.blockId, update.properties]));
  
  return tabs.map(tab => {
    const properties = updateMap.get(tab.blockId);
    return properties ? { ...tab, ...properties } : tab;
  });
}

/**
 * 验证标签数据
 */
export function validateTabData(tab: Partial<TabInfo>): tab is TabInfo {
  return !!(
    tab.blockId &&
    tab.panelId &&
    tab.title &&
    typeof tab.isPinned === 'boolean' &&
    typeof tab.order === 'number'
  );
}

/**
 * 清理无效标签
 */
export function cleanInvalidTabs(tabs: TabInfo[]): TabInfo[] {
  return tabs.filter(tab => validateTabData(tab));
}

// 注意：generateTabId, areTabsEqual, findTabIndex 函数已移动到 tabOperationsUtils.ts 中，避免重复定义

/**
 * 移动标签位置
 */
export function moveTab(tabs: TabInfo[], fromIndex: number, toIndex: number): TabInfo[] {
  const result = [...tabs];
  const [movedTab] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, movedTab);
  return result;
}

/**
 * 交换标签位置
 */
export function swapTabs(tabs: TabInfo[], index1: number, index2: number): TabInfo[] {
  const result = [...tabs];
  [result[index1], result[index2]] = [result[index2], result[index1]];
  return result;
}

/**
 * 检查位置是否有效
 */
export function isValidPosition(position: TabPosition, isVerticalMode: boolean, verticalWidth: number): boolean {
  if (isVerticalMode) {
    return position.x >= 0 && 
           position.y >= 0 && 
           position.x + verticalWidth <= window.innerWidth && 
           position.y <= window.innerHeight;
  } else {
    return position.x >= 0 && 
           position.y >= 0 && 
           position.x <= window.innerWidth && 
           position.y <= window.innerHeight;
  }
}

/**
 * 限制位置在窗口范围内
 */
export function constrainPosition(
  position: TabPosition, 
  isVerticalMode: boolean, 
  verticalWidth: number
): TabPosition {
  const minX = 5;
  const minY = 5;
  const maxX = isVerticalMode 
    ? window.innerWidth - verticalWidth - 5
    : window.innerWidth - 5;
  const maxY = window.innerHeight - 5;

  return {
    x: Math.max(minX, Math.min(maxX, position.x)),
    y: Math.max(minY, Math.min(maxY, position.y))
  };
}

/**
 * 计算标签容器尺寸
 */
export function calculateContainerSize(
  isVerticalMode: boolean,
  tabCount: number,
  verticalWidth: number
): { width: number; height: number } {
  if (isVerticalMode) {
    return {
      width: verticalWidth,
      height: Math.min(tabCount * 28 + 8, window.innerHeight * 0.8)
    };
  } else {
    return {
      width: Math.min(tabCount * 120, window.innerWidth * 0.8),
      height: 28
    };
  }
}

/**
 * 检查是否需要更新UI
 */
export function shouldUpdateUI(
  oldTabs: TabInfo[],
  newTabs: TabInfo[],
  oldPosition: TabPosition,
  newPosition: TabPosition,
  oldVerticalMode: boolean,
  newVerticalMode: boolean
): boolean {
  // 标签数量或内容变化
  if (oldTabs.length !== newTabs.length) return true;
  
  // 标签内容变化
  for (let i = 0; i < oldTabs.length; i++) {
    if (!areTabsEqual(oldTabs[i], newTabs[i]) || 
        oldTabs[i].title !== newTabs[i].title ||
        oldTabs[i].isPinned !== newTabs[i].isPinned) {
      return true;
    }
  }
  
  // 位置变化
  if (oldPosition.x !== newPosition.x || oldPosition.y !== newPosition.y) return true;
  
  // 布局模式变化
  if (oldVerticalMode !== newVerticalMode) return true;
  
  return false;
}

/**
 * 生成标签统计信息
 */
export function generateTabStats(tabs: TabInfo[]): {
  total: number;
  pinned: number;
  unpinned: number;
  byType: Record<string, number>;
} {
  const stats = {
    total: tabs.length,
    pinned: 0,
    unpinned: 0,
    byType: {} as Record<string, number>
  };

  tabs.forEach(tab => {
    if (tab.isPinned) {
      stats.pinned++;
    } else {
      stats.unpinned++;
    }
    
    const type = tab.blockType || 'unknown';
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  });

  return stats;
}
