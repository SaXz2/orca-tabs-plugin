/**
 * 标签操作相关的工具函数
 */

import { TabInfo } from '../types';

/**
 * 标签操作结果接口
 */
export interface TabOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * 标签切换选项接口
 */
export interface TabSwitchOptions {
  recordScrollPosition?: boolean;
  updateLastActive?: boolean;
  navigateToBlock?: boolean;
}

/**
 * 标签固定选项接口
 */
export interface TabPinOptions {
  updateOrder?: boolean;
  saveData?: boolean;
  updateUI?: boolean;
}

/**
 * 标签删除选项接口
 */
export interface TabDeleteOptions {
  updateUI?: boolean;
  saveData?: boolean;
  findAdjacent?: boolean;
  switchToAdjacent?: boolean;
}

/**
 * 标签创建选项接口
 */
export interface TabCreateOptions {
  insertAtEnd?: boolean;
  insertAfterActive?: boolean;
  updateUI?: boolean;
  saveData?: boolean;
  navigateToBlock?: boolean;
}

/**
 * 标签更新选项接口
 */
export interface TabUpdateOptions {
  updateUI?: boolean;
  saveData?: boolean;
  validateData?: boolean;
}

/**
 * 切换到指定标签
 */
export function switchToTab(
  tab: TabInfo, 
  tabs: TabInfo[], 
  options: TabSwitchOptions = {}
): TabOperationResult {
  try {
    const {
      recordScrollPosition = true,
      updateLastActive = true,
      navigateToBlock = true
    } = options;

    // 验证标签是否存在
    const tabIndex = tabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex === -1) {
      return {
        success: false,
        message: `标签不存在: ${tab.title}`
      };
    }

    // 记录当前激活标签的滚动位置
    if (recordScrollPosition) {
      const currentActiveTab = getCurrentActiveTab(tabs);
      if (currentActiveTab && currentActiveTab.blockId !== tab.blockId) {
        recordScrollPositionForTab(currentActiveTab);
      }
    }

    // 更新最后激活的标签ID
    if (updateLastActive) {
      updateLastActiveTabId(tab.blockId);
    }

    return {
      success: true,
      message: `成功切换到标签: ${tab.title}`,
      data: { tab, tabIndex }
    };
  } catch (error) {
    return {
      success: false,
      message: `切换标签失败: ${error}`
    };
  }
}

/**
 * 执行标签导航
 */
export async function performNavigation(
  tab: TabInfo,
  targetPanelId: string,
  isJournal: boolean = false
): Promise<TabOperationResult> {
  try {
    if (isJournal) {
      // 日期块导航 - 使用统一的逻辑
      const targetDate = extractDateFromTitle(tab.title);
      
      if (targetDate) {
        // 优先使用相对日期命令（如果适用）
        if (tab.title.includes('今天') || tab.title.includes('Today')) {
          try {
            await orca.commands.invokeCommand('core.goToday');
            return {
              success: true,
              message: '成功导航到今天'
            };
          } catch (e) {
            // 如果命令失败，回退到日期导航
          }
        } else if (tab.title.includes('昨天') || tab.title.includes('Yesterday')) {
          try {
            await orca.commands.invokeCommand('core.goYesterday');
            return {
              success: true,
              message: '成功导航到昨天'
            };
          } catch (e) {
            // 如果命令失败，回退到日期导航
          }
        } else if (tab.title.includes('明天') || tab.title.includes('Tomorrow')) {
          try {
            await orca.commands.invokeCommand('core.goTomorrow');
            return {
              success: true,
              message: '成功导航到明天'
            };
          } catch (e) {
            // 如果命令失败，回退到日期导航
          }
        }

        // 使用日期导航
        try {
          await orca.nav.goTo("journal", { date: targetDate }, targetPanelId);
          return {
            success: true,
            message: `成功导航到日期: ${targetDate.toISOString().split('T')[0]}`
          };
        } catch (e) {
          // 如果简单格式失败，尝试 Orca 格式
          try {
            const journalDate = {
              t: 2, // 2 for full/absolute date
              v: targetDate.getTime() // 使用时间戳
            };
            await orca.nav.goTo("journal", { date: journalDate }, targetPanelId);
            return {
              success: true,
              message: `成功导航到日期: ${targetDate.toISOString().split('T')[0]}`
            };
          } catch (e2) {
            throw e2;
          }
        }
      } else {
        // 如果无法提取日期，回退到块导航
        await orca.nav.goTo("block", { blockId: parseInt(tab.blockId) }, targetPanelId);
        return {
          success: true,
          message: `成功导航到块: ${tab.blockId}`
        };
      }
    } else {
      // 普通块导航
      await orca.nav.goTo("block", { blockId: parseInt(tab.blockId) }, targetPanelId);
      return {
        success: true,
        message: `成功导航到块: ${tab.blockId}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `导航失败: ${error}`
    };
  }
}

/**
 * 导航到日期块
 */
export async function navigateToJournalBlock(
  tab: TabInfo,
  targetPanelId: string
): Promise<TabOperationResult> {
  return performNavigation(tab, targetPanelId, true);
}

/**
 * 导航到普通块
 */
export async function navigateToRegularBlock(
  tab: TabInfo,
  targetPanelId: string
): Promise<TabOperationResult> {
  return performNavigation(tab, targetPanelId, false);
}

/**
 * 切换标签固定状态
 */
export function toggleTabPinStatus(
  tab: TabInfo,
  tabs: TabInfo[],
  options: TabPinOptions = {}
): TabOperationResult {
  try {
    const {
      updateOrder = true,
      saveData = true,
      updateUI = true
    } = options;

    const tabIndex = tabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex === -1) {
      return {
        success: false,
        message: `标签不存在: ${tab.title}`
      };
    }

    // 切换固定状态
    tabs[tabIndex].isPinned = !tabs[tabIndex].isPinned;
    const isPinned = tabs[tabIndex].isPinned;

    // 重新排序
    if (updateOrder) {
      sortTabsByPinStatus(tabs);
    }

    // 排序后重新查找标签索引
    const newTabIndex = tabs.findIndex(t => t.blockId === tab.blockId);
    
    const status = isPinned ? '固定' : '取消固定';
    return {
      success: true,
      message: `标签 "${tab.title}" 已${status}`,
      data: { tab: tabs[newTabIndex], tabIndex: newTabIndex }
    };
  } catch (error) {
    return {
      success: false,
      message: `切换固定状态失败: ${error}`
    };
  }
}

/**
 * 固定标签
 */
export function pinTab(
  tab: TabInfo,
  tabs: TabInfo[],
  options: TabPinOptions = {}
): TabOperationResult {
  if (tab.isPinned) {
    return {
      success: true,
      message: `标签 "${tab.title}" 已经固定`
    };
  }

  return toggleTabPinStatus(tab, tabs, options);
}

/**
 * 取消固定标签
 */
export function unpinTab(
  tab: TabInfo,
  tabs: TabInfo[],
  options: TabPinOptions = {}
): TabOperationResult {
  if (!tab.isPinned) {
    return {
      success: true,
      message: `标签 "${tab.title}" 已经取消固定`
    };
  }

  return toggleTabPinStatus(tab, tabs, options);
}

/**
 * 删除标签
 */
export function deleteTab(
  tab: TabInfo,
  tabs: TabInfo[],
  options: TabDeleteOptions = {}
): TabOperationResult {
  try {
    const {
      updateUI = true,
      saveData = true,
      findAdjacent = true,
      switchToAdjacent = true
    } = options;

    const tabIndex = tabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex === -1) {
      return {
        success: false,
        message: `标签不存在: ${tab.title}`
      };
    }

    // 查找相邻标签
    let adjacentTab: TabInfo | null = null;
    if (findAdjacent) {
      adjacentTab = findAdjacentTab(tab, tabs);
    }

    // 删除标签
    tabs.splice(tabIndex, 1);

    // 更新order属性
    tabs.forEach((t, index) => {
      t.order = index;
    });

    return {
      success: true,
      message: `标签 "${tab.title}" 已删除`,
      data: { 
        deletedTab: tab, 
        adjacentTab,
        shouldSwitchToAdjacent: switchToAdjacent && adjacentTab !== null
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `删除标签失败: ${error}`
    };
  }
}

/**
 * 创建新标签
 */
export function createTab(
  blockId: string,
  title: string,
  tabs: TabInfo[],
  options: TabCreateOptions = {}
): TabOperationResult {
  try {
    const {
      insertAtEnd = false,
      insertAfterActive = true,
      updateUI = true,
      saveData = true,
      navigateToBlock = true
    } = options;

    // 检查标签是否已存在
    const existingTab = findExistingTab(blockId, tabs);
    if (existingTab) {
      return {
        success: false,
        message: `标签已存在: ${existingTab.title}`
      };
    }

    // 创建新标签
    const newTab: TabInfo = {
      blockId,
      title,
      panelId: '', // 将在后续设置
      order: tabs.length,
      isPinned: false,
      isJournal: isDateString(title)
    };

    // 确定插入位置
    let insertIndex = tabs.length;
    if (insertAfterActive && !insertAtEnd) {
      const lastActiveTabId = getLastActiveTabId();
      if (lastActiveTabId) {
        const lastActiveIndex = tabs.findIndex(t => t.blockId === lastActiveTabId);
        if (lastActiveIndex !== -1) {
          insertIndex = lastActiveIndex + 1;
        }
      }
    }

    // 插入标签
    tabs.splice(insertIndex, 0, newTab);

    // 更新order属性
    tabs.forEach((t, index) => {
      t.order = index;
    });

    return {
      success: true,
      message: `标签 "${title}" 已创建`,
      data: { tab: newTab, insertIndex }
    };
  } catch (error) {
    return {
      success: false,
      message: `创建标签失败: ${error}`
    };
  }
}

/**
 * 更新标签
 */
export function updateTab(
  tab: TabInfo,
  updates: Partial<TabInfo>,
  tabs: TabInfo[],
  options: TabUpdateOptions = {}
): TabOperationResult {
  try {
    const {
      updateUI = true,
      saveData = true,
      validateData = true
    } = options;

    const tabIndex = tabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex === -1) {
      return {
        success: false,
        message: `标签不存在: ${tab.title}`
      };
    }

    // 验证数据
    if (validateData) {
      const validationResult = validateTabData(updates);
      if (!validationResult.success) {
        return validationResult;
      }
    }

    // 更新标签
    tabs[tabIndex] = { ...tabs[tabIndex], ...updates };

    return {
      success: true,
      message: `标签 "${tab.title}" 已更新`,
      data: { tab: tabs[tabIndex], tabIndex }
    };
  } catch (error) {
    return {
      success: false,
      message: `更新标签失败: ${error}`
    };
  }
}

/**
 * 更新标签标题
 */
export function updateTabTitle(
  tab: TabInfo,
  newTitle: string,
  tabs: TabInfo[],
  options: TabUpdateOptions = {}
): TabOperationResult {
  if (!newTitle || newTitle.trim() === '') {
    return {
      success: false,
      message: '标签标题不能为空'
    };
  }

  return updateTab(tab, { title: newTitle.trim() }, tabs, options);
}

/**
 * 更新标签图标
 */
export function updateTabIcon(
  tab: TabInfo,
  newIcon: string,
  tabs: TabInfo[],
  options: TabUpdateOptions = {}
): TabOperationResult {
  return updateTab(tab, { icon: newIcon }, tabs, options);
}

/**
 * 移动标签到指定位置
 */
export function moveTab(
  tab: TabInfo,
  newIndex: number,
  tabs: TabInfo[],
  options: TabUpdateOptions = {}
): TabOperationResult {
  try {
    const {
      updateUI = true,
      saveData = true,
      validateData = true
    } = options;

    const currentIndex = tabs.findIndex(t => t.blockId === tab.blockId);
    if (currentIndex === -1) {
      return {
        success: false,
        message: `标签不存在: ${tab.title}`
      };
    }

    if (newIndex < 0 || newIndex >= tabs.length) {
      return {
        success: false,
        message: `无效的索引: ${newIndex}`
      };
    }

    if (currentIndex === newIndex) {
      return {
        success: true,
        message: `标签 "${tab.title}" 已在目标位置`
      };
    }

    // 移动标签
    const [movedTab] = tabs.splice(currentIndex, 1);
    tabs.splice(newIndex, 0, movedTab);

    // 更新order属性
    tabs.forEach((t, index) => {
      t.order = index;
    });

    return {
      success: true,
      message: `标签 "${tab.title}" 已移动到位置 ${newIndex}`,
      data: { tab: movedTab, oldIndex: currentIndex, newIndex }
    };
  } catch (error) {
    return {
      success: false,
      message: `移动标签失败: ${error}`
    };
  }
}

/**
 * 交换两个标签的位置
 */
export function swapTabs(
  tab1: TabInfo,
  tab2: TabInfo,
  tabs: TabInfo[],
  options: TabUpdateOptions = {}
): TabOperationResult {
  try {
    const {
      updateUI = true,
      saveData = true,
      validateData = true
    } = options;

    const index1 = tabs.findIndex(t => t.blockId === tab1.blockId);
    const index2 = tabs.findIndex(t => t.blockId === tab2.blockId);

    if (index1 === -1) {
      return {
        success: false,
        message: `标签不存在: ${tab1.title}`
      };
    }

    if (index2 === -1) {
      return {
        success: false,
        message: `标签不存在: ${tab2.title}`
      };
    }

    if (index1 === index2) {
      return {
        success: true,
        message: `标签 "${tab1.title}" 和 "${tab2.title}" 位置相同`
      };
    }

    // 交换位置
    [tabs[index1], tabs[index2]] = [tabs[index2], tabs[index1]];

    // 更新order属性
    tabs.forEach((t, index) => {
      t.order = index;
    });

    return {
      success: true,
      message: `标签 "${tab1.title}" 和 "${tab2.title}" 已交换位置`,
      data: { tab1: tabs[index2], tab2: tabs[index1], index1, index2 }
    };
  } catch (error) {
    return {
      success: false,
      message: `交换标签失败: ${error}`
    };
  }
}

/**
 * 查找相邻标签
 */
export function findAdjacentTab(tab: TabInfo, tabs: TabInfo[]): TabInfo | null {
  const tabIndex = tabs.findIndex(t => t.blockId === tab.blockId);
  if (tabIndex === -1) {
    return null;
  }

  // 优先查找右侧标签
  if (tabIndex < tabs.length - 1) {
    return tabs[tabIndex + 1];
  }

  // 如果没有右侧标签，查找左侧标签
  if (tabIndex > 0) {
    return tabs[tabIndex - 1];
  }

  return null;
}

/**
 * 计算智能插入位置
 */
export function calculateSmartInsertPosition(
  tabs: TabInfo[],
  afterBlockId?: string
): number {
  if (afterBlockId) {
    const afterIndex = tabs.findIndex(t => t.blockId === afterBlockId);
    if (afterIndex !== -1) {
      return afterIndex + 1;
    }
  }

  // 查找最后一个非固定标签的位置
  const lastNonPinnedIndex = findLastNonPinnedTabIndex(tabs);
  return lastNonPinnedIndex + 1;
}

/**
 * 更新标签顺序
 */
export function updateTabOrder(tabs: TabInfo[]): void {
  tabs.forEach((tab, index) => {
    tab.order = index;
  });
}

/**
 * 验证标签数据
 */
export function validateTabData(tabData: Partial<TabInfo>): TabOperationResult {
  if (tabData.blockId !== undefined && (!tabData.blockId || tabData.blockId.trim() === '')) {
    return {
      success: false,
      message: '标签块ID不能为空'
    };
  }

  if (tabData.title !== undefined && (!tabData.title || tabData.title.trim() === '')) {
    return {
      success: false,
      message: '标签标题不能为空'
    };
  }

  if (tabData.order !== undefined && (tabData.order < 0 || !Number.isInteger(tabData.order))) {
    return {
      success: false,
      message: '标签顺序必须是正整数'
    };
  }

  return {
    success: true,
    message: '标签数据验证通过'
  };
}

/**
 * 按固定状态排序标签
 */
export function sortTabsByPinStatus(tabs: TabInfo[]): void {
  tabs.sort((a, b) => {
    // 固定标签在前
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // 相同固定状态按order排序
    return a.order - b.order;
  });
}

/**
 * 查找标签
 */
export function findTab(blockId: string, tabs: TabInfo[]): TabInfo | null {
  return tabs.find(tab => tab.blockId === blockId) || null;
}

/**
 * 查找标签索引
 */
export function findTabIndex(blockId: string, tabs: TabInfo[]): number {
  return tabs.findIndex(tab => tab.blockId === blockId);
}

/**
 * 检查标签是否存在
 */
export function tabExists(blockId: string, tabs: TabInfo[]): boolean {
  return tabs.some(tab => tab.blockId === blockId);
}

/**
 * 获取标签统计信息
 */
export function getTabStats(tabs: TabInfo[]): {
  total: number;
  pinned: number;
  unpinned: number;
  journal: number;
  regular: number;
} {
  return {
    total: tabs.length,
    pinned: tabs.filter(tab => tab.isPinned).length,
    unpinned: tabs.filter(tab => !tab.isPinned).length,
    journal: tabs.filter(tab => tab.isJournal).length,
    regular: tabs.filter(tab => !tab.isJournal).length
  };
}

/**
 * 清理无效标签
 */
export function cleanInvalidTabs(tabs: TabInfo[]): TabInfo[] {
  return tabs.filter(tab => 
    tab.blockId && 
    tab.title && 
    tab.blockId.trim() !== '' && 
    tab.title.trim() !== ''
  );
}

/**
 * 批量更新标签属性
 */
export function batchUpdateTabProperties(
  tabs: TabInfo[],
  updates: Partial<TabInfo>,
  filter?: (tab: TabInfo) => boolean
): TabOperationResult {
  try {
    const tabsToUpdate = filter ? tabs.filter(filter) : tabs;
    
    if (tabsToUpdate.length === 0) {
      return {
        success: true,
        message: '没有标签需要更新'
      };
    }

    // 验证更新数据
    const validationResult = validateTabData(updates);
    if (!validationResult.success) {
      return validationResult;
    }

    // 批量更新
    tabsToUpdate.forEach(tab => {
      Object.assign(tab, updates);
    });

    return {
      success: true,
      message: `成功更新 ${tabsToUpdate.length} 个标签`,
      data: { updatedCount: tabsToUpdate.length }
    };
  } catch (error) {
    return {
      success: false,
      message: `批量更新失败: ${error}`
    };
  }
}

/**
 * 生成标签ID
 */
export function generateTabId(blockId: string, panelId: string): string {
  return `${panelId}-${blockId}`;
}

/**
 * 比较两个标签是否相等
 */
export function areTabsEqual(tab1: TabInfo, tab2: TabInfo): boolean {
  return tab1.blockId === tab2.blockId && tab1.panelId === tab2.panelId;
}

/**
 * 检查标签是否有效
 */
export function isValidTab(tab: TabInfo): boolean {
  return !!(tab.blockId && tab.title && tab.blockId.trim() !== '' && tab.title.trim() !== '');
}

/**
 * 获取标签显示名称
 */
export function getTabDisplayName(tab: TabInfo): string {
  return tab.title || `块 ${tab.blockId}`;
}

/**
 * 检查是否可以操作标签
 */
export function canOperateTab(tab: TabInfo, operation: 'switch' | 'pin' | 'delete' | 'update'): boolean {
  if (!isValidTab(tab)) {
    return false;
  }

  switch (operation) {
    case 'switch':
      return true;
    case 'pin':
      return true;
    case 'delete':
      return true;
    case 'update':
      return true;
    default:
      return false;
  }
}

// 辅助函数

/**
 * 获取当前激活的标签
 */
function getCurrentActiveTab(tabs: TabInfo[]): TabInfo | null {
  // 这里需要根据实际实现来确定如何获取当前激活的标签
  // 暂时返回第一个标签作为示例
  return tabs.length > 0 ? tabs[0] : null;
}

/**
 * 记录标签的滚动位置
 */
function recordScrollPositionForTab(tab: TabInfo): void {
  // 这里需要根据实际实现来记录滚动位置
  // 暂时留空
}

/**
 * 更新最后激活的标签ID
 */
function updateLastActiveTabId(blockId: string): void {
  // 这里需要根据实际实现来更新最后激活的标签ID
  // 暂时留空
}

/**
 * 获取最后激活的标签ID
 */
function getLastActiveTabId(): string | null {
  // 这里需要根据实际实现来获取最后激活的标签ID
  // 暂时返回null
  return null;
}

/**
 * 从标题中提取日期
 */
function extractDateFromTitle(title: string): Date | null {
  try {
    // 处理相对日期
    if (title.includes('今天') || title.includes('Today')) {
      return new Date();
    } else if (title.includes('昨天') || title.includes('Yesterday')) {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date;
    } else if (title.includes('明天') || title.includes('Tomorrow')) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    }

    // 处理标准日期格式
    // 匹配 yyyy-MM-dd 格式
    const isoMatch = title.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
      const date = new Date(isoMatch[1] + 'T00:00:00.000Z');
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // 匹配 yyyy年MM月dd日 格式
    const chineseMatch = title.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (chineseMatch) {
      const year = parseInt(chineseMatch[1]);
      const month = parseInt(chineseMatch[2]) - 1; // 月份从0开始
      const day = parseInt(chineseMatch[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // 匹配 MM/dd/yyyy 格式
    const usMatch = title.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (usMatch) {
      const month = parseInt(usMatch[1]) - 1; // 月份从0开始
      const day = parseInt(usMatch[2]);
      const year = parseInt(usMatch[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // 匹配 dd/MM/yyyy 格式
    const euMatch = title.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (euMatch) {
      const day = parseInt(euMatch[1]);
      const month = parseInt(euMatch[2]) - 1; // 月份从0开始
      const year = parseInt(euMatch[3]);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 检查是否为日期字符串
 */
function isDateString(str: string): boolean {
  // 这里需要根据实际实现来检查日期字符串
  // 暂时返回false
  return false;
}

/**
 * 查找现有标签
 */
function findExistingTab(blockId: string, tabs: TabInfo[]): TabInfo | null {
  return tabs.find(tab => tab.blockId === blockId) || null;
}

/**
 * 查找最后一个非固定标签的索引
 */
function findLastNonPinnedTabIndex(tabs: TabInfo[]): number {
  for (let i = tabs.length - 1; i >= 0; i--) {
    if (!tabs[i].isPinned) {
      return i;
    }
  }
  return -1;
}
