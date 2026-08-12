/**
 * 标签页存储服务
 * 
 * 此服务负责管理所有标签页相关的数据存储操作，包括：
 * - 标签页数据存储和恢复
 * - 最近关闭标签页管理
 * - 标签页集合管理
 * - 工作区数据管理
 * - 位置和布局配置存储
 * 
 * @file tabStorage.ts
 * @version 2.5.6
 * @since 2024
 */

import { TabInfo, SavedTabSet, Workspace, TabPosition, RecentTabSwitchHistory } from '../types';
import { PLUGIN_STORAGE_KEYS, FEATURE_CONFIG } from '../constants';
import { OrcaStorageService } from './storage';
import { 
  updatePositionConfig, 
  createDefaultLayoutConfig, 
  generatePositionLogMessage,
  type LayoutConfig 
} from '../utils/configUtils';
import { normalizeTabInfoArray } from '../utils/tabOperationsUtils';

/**
 * 标签页存储服务类
 * 
 * 提供统一的标签页数据存储接口，封装所有存储相关的操作。
 * 使用 OrcaStorageService 作为底层存储实现。
 */
export class TabStorageService {
  private storageService: OrcaStorageService;
  private pluginName: string;
  private log: (message: string) => void;
  private warn: (message: string, error?: any) => void;
  private error: (message: string, error?: any) => void;
  private verboseLog: (message: string) => void;

  constructor(
    storageService: OrcaStorageService,
    pluginName: string,
    loggers: {
      log: (message: string) => void;
      warn: (message: string, error?: any) => void;
      error: (message: string, error?: any) => void;
      verboseLog: (message: string) => void;
    }
  ) {
    this.storageService = storageService;
    this.pluginName = pluginName;
    this.log = loggers.log;
    this.warn = loggers.warn;
    this.error = loggers.error;
    this.verboseLog = loggers.verboseLog;
  }

  // ==================== 标签页数据存储 ====================

  /**
   * 保存第一个面板的标签数据到持久化存储
   */
  async saveFirstPanelTabs(tabs: TabInfo[]): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS, tabs, this.pluginName);
      this.log(`💾 保存第一个面板的 ${tabs.length} 个标签页数据到API配置`);
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }

  /**
   * 从持久化存储恢复第一个面板的标签数据
   */
  async restoreFirstPanelTabs(): Promise<TabInfo[]> {
    try {
      const saved = await this.storageService.getConfig<TabInfo[]>(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS, this.pluginName, []);
      if (saved && Array.isArray(saved)) {
        // 规范化标签数据，确保视图面板字段正确设置
        const normalizedTabs = normalizeTabInfoArray(saved);
        this.log(`📂 从API配置恢复了第一个面板的 ${normalizedTabs.length} 个标签页`);
        return normalizedTabs;
      } else {
        this.log(`📂 没有找到第一个面板的持久化标签数据，返回空数组`);
        return [];
      }
    } catch (e) {
      this.warn("无法恢复第一个面板标签数据:", e);
      return [];
    }
  }

  /**
   * 保存指定面板的标签页数据
   */
  async savePanelTabs(panelId: string, tabs: TabInfo[]): Promise<void> {
    try {
      await this.storageService.saveConfig(`panel_${panelId}_tabs`, tabs, this.pluginName);
      this.verboseLog(`💾 已保存面板 ${panelId} 的标签页数据: ${tabs.length} 个`);
    } catch (error) {
      this.warn(`❌ 保存面板 ${panelId} 标签页数据失败:`, error);
    }
  }

  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(storageKey: string, tabs: TabInfo[]): Promise<void> {
    try {
      await this.storageService.saveConfig(storageKey, tabs, this.pluginName);
      this.verboseLog(`💾 已保存 ${storageKey} 的标签页数据: ${tabs.length} 个`);
    } catch (error) {
      this.warn(`❌ 保存 ${storageKey} 标签页数据失败:`, error);
    }
  }

  /**
   * 从存储键恢复面板标签页数据
   */
  async restorePanelTabsByKey(storageKey: string): Promise<TabInfo[]> {
    try {
      const saved = await this.storageService.getConfig<TabInfo[]>(storageKey, this.pluginName, []);
      if (saved && Array.isArray(saved)) {
        // 规范化标签数据，确保视图面板字段正确设置
        const normalizedTabs = normalizeTabInfoArray(saved);
        this.verboseLog(`📂 从 ${storageKey} 恢复了 ${normalizedTabs.length} 个标签页`);
        return normalizedTabs;
      }
      return [];
    } catch (error) {
      this.warn(`❌ 恢复 ${storageKey} 标签页数据失败:`, error);
      return [];
    }
  }

  // ==================== 已关闭标签页管理 ====================

  /**
   * 保存已关闭标签列表到持久化存储
   */
  async saveClosedTabs(closedTabs: Set<string>): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.CLOSED_TABS, Array.from(closedTabs), this.pluginName);
      this.log(`💾 保存已关闭标签列表到API配置`);
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }

  /**
   * 从持久化存储恢复已关闭标签列表
   */
  async restoreClosedTabs(): Promise<Set<string>> {
    try {
      const saved = await this.storageService.getConfig<string[]>(PLUGIN_STORAGE_KEYS.CLOSED_TABS, this.pluginName, []);
      if (saved && Array.isArray(saved)) {
        const closedTabs = new Set(saved);
        this.log(`📂 从API配置恢复了 ${closedTabs.size} 个已关闭标签`);
        return closedTabs;
      } else {
        this.log(`📂 没有找到持久化的已关闭标签数据，返回空集合`);
        return new Set();
      }
    } catch (e) {
      this.warn("无法恢复已关闭标签列表:", e);
      return new Set();
    }
  }

  // ==================== 最近关闭标签页管理 ====================

  /**
   * 保存最近关闭的标签页列表到持久化存储
   */
  async saveRecentlyClosedTabs(recentlyClosedTabs: TabInfo[]): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.RECENTLY_CLOSED_TABS, recentlyClosedTabs, this.pluginName);
      this.log(`💾 保存最近关闭标签页列表到API配置`);
    } catch (e) {
      this.warn("无法保存最近关闭标签页列表:", e);
    }
  }

  /**
   * 从持久化存储恢复最近关闭的标签页列表
   */
  async restoreRecentlyClosedTabs(): Promise<TabInfo[]> {
    try {
      const saved = await this.storageService.getConfig<TabInfo[]>(PLUGIN_STORAGE_KEYS.RECENTLY_CLOSED_TABS, this.pluginName, []);
      if (saved && Array.isArray(saved)) {
        // 规范化标签数据，确保视图面板字段正确设置
        const normalizedTabs = normalizeTabInfoArray(saved);
        this.log(`📂 从API配置恢复了 ${normalizedTabs.length} 个最近关闭的标签页`);
        return normalizedTabs;
      } else {
        this.log(`📂 没有找到最近关闭标签页数据，返回空数组`);
        return [];
      }
    } catch (e) {
      this.warn("无法恢复最近关闭标签页列表:", e);
      return [];
    }
  }

  // ==================== 标签页集合管理 ====================

  /**
   * 保存多标签页集合到持久化存储
   */
  async saveSavedTabSets(savedTabSets: SavedTabSet[]): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.SAVED_TAB_SETS, savedTabSets, this.pluginName);
      this.log(`💾 保存多标签页集合到API配置`);
    } catch (e) {
      this.warn("无法保存多标签页集合:", e);
    }
  }

  /**
   * 从持久化存储恢复多标签页集合
   */
  async restoreSavedTabSets(): Promise<SavedTabSet[]> {
    try {
      const saved = await this.storageService.getConfig<SavedTabSet[]>(PLUGIN_STORAGE_KEYS.SAVED_TAB_SETS, this.pluginName, []);
      if (saved && Array.isArray(saved)) {
        // 规范化每个标签页集合中的标签数据
        const normalizedSets = saved.map(set => ({
          ...set,
          tabs: normalizeTabInfoArray(set.tabs || [])
        }));
        this.log(`📂 从API配置恢复了 ${normalizedSets.length} 个多标签页集合`);
        return normalizedSets;
      } else {
        this.log(`📂 没有找到多标签页集合数据，返回空数组`);
        return [];
      }
    } catch (e) {
      this.warn("无法恢复多标签页集合:", e);
      return [];
    }
  }

  // ==================== 工作区管理 ====================

  /**
   * 加载工作区数据
   */
  async loadWorkspaces(): Promise<{ workspaces: Workspace[], enableWorkspaces: boolean }> {
    try {
      const workspacesData = await this.storageService.getConfig(PLUGIN_STORAGE_KEYS.WORKSPACES, this.pluginName, []);
      let workspaces: Workspace[] = workspacesData && Array.isArray(workspacesData) ? workspacesData : [];
      
      // 规范化每个工作区中的标签数据
      workspaces = workspaces.map(workspace => ({
        ...workspace,
        tabs: normalizeTabInfoArray(workspace.tabs || [])
      }));
      
      const enableWorkspaces = await this.storageService.getConfig(PLUGIN_STORAGE_KEYS.ENABLE_WORKSPACES, this.pluginName, false);
      const enableWorkspacesValue = typeof enableWorkspaces === 'boolean' ? enableWorkspaces : false;

      this.log(`📁 已加载 ${workspaces.length} 个工作区`);
      return { workspaces, enableWorkspaces: enableWorkspacesValue };
    } catch (error) {
      this.error("加载工作区数据失败:", error);
      return { workspaces: [], enableWorkspaces: false };
    }
  }

  /**
   * 保存工作区数据
   */
  async saveWorkspaces(workspaces: Workspace[], currentWorkspace: string | null, enableWorkspaces: boolean): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.WORKSPACES, workspaces, this.pluginName);
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.CURRENT_WORKSPACE, currentWorkspace, this.pluginName);
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_WORKSPACES, enableWorkspaces, this.pluginName);
      this.log(`💾 工作区数据已保存`);
    } catch (error) {
      this.error("保存工作区数据失败:", error);
    }
  }

  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace(): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.CURRENT_WORKSPACE, null, this.pluginName);
      this.log(`📁 已清除当前工作区状态`);
    } catch (error) {
      this.error("清除当前工作区状态失败:", error);
    }
  }

  /**
   * 保存进入工作区前的标签页组
   */
  async saveTabsBeforeWorkspace(tabs: TabInfo[]): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.TABS_BEFORE_WORKSPACE, tabs, this.pluginName);
      this.log(`💾 已保存进入工作区前的标签页组: ${tabs.length}个标签页`);
    } catch (error) {
      this.error("保存进入工作区前的标签页组失败:", error);
    }
  }

  /**
   * 加载进入工作区前的标签页组
   */
  async loadTabsBeforeWorkspace(): Promise<TabInfo[] | null> {
    try {
      const tabs = await this.storageService.getConfig<TabInfo[]>(PLUGIN_STORAGE_KEYS.TABS_BEFORE_WORKSPACE, this.pluginName);
      if (tabs && tabs.length > 0) {
        // 规范化标签数据，确保视图面板字段正确设置
        const normalizedTabs = normalizeTabInfoArray(tabs);
        this.log(`📁 已加载进入工作区前的标签页组: ${normalizedTabs.length}个标签页`);
        return normalizedTabs;
      }
      return tabs;
    } catch (error) {
      this.error("加载进入工作区前的标签页组失败:", error);
      return null;
    }
  }

  /**
   * 清除进入工作区前的标签页组
   */
  async clearTabsBeforeWorkspace(): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.TABS_BEFORE_WORKSPACE, null, this.pluginName);
      this.log(`📁 已清除进入工作区前的标签页组`);
    } catch (error) {
      this.error("清除进入工作区前的标签页组失败:", error);
    }
  }

  // ==================== 位置和布局配置 ====================

  /**
   * 保存位置信息
   */
  async savePosition(
    position: TabPosition, 
    isVerticalMode: boolean, 
    verticalPosition: TabPosition, 
    horizontalPosition: TabPosition
  ): Promise<{ verticalPosition: TabPosition, horizontalPosition: TabPosition }> {
    try {
      // ????????????????????????????????????
      const updatedPositions = updatePositionConfig(
        position,
        isVerticalMode,
        verticalPosition,
        horizontalPosition
      );
      
      const currentLayout = await this.restoreLayoutMode();
      await this.saveLayoutMode({
        ...currentLayout,
        isVerticalMode,
        verticalPosition: updatedPositions.verticalPosition,
        horizontalPosition: updatedPositions.horizontalPosition
      });
      
      this.log(`???? ??????????????? ${generatePositionLogMessage(position, isVerticalMode)}`);
      return updatedPositions;
    } catch (e) {
      this.warn("????????????????????????");
      return { verticalPosition, horizontalPosition };
    }
  }

  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(layoutData: {
    isVerticalMode: boolean;
    verticalWidth: number;
    verticalPosition: TabPosition;
    horizontalPosition: TabPosition;
    isSidebarAlignmentEnabled: boolean;
    isFloatingWindowVisible: boolean;
    showBlockTypeIcons: boolean;
    showInHeadbar: boolean;
    horizontalTabMaxWidth: number;
    horizontalTabMinWidth: number;
    enableEdgeHide: boolean;
    enableBubbleMode: boolean;
  }): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.LAYOUT_MODE, layoutData, this.pluginName);
      this.log(`💾 布局模式已保存: ${layoutData.isVerticalMode ? '垂直' : '水平'}, 垂直宽度: ${layoutData.verticalWidth}px, 垂直位置: (${layoutData.verticalPosition.x}, ${layoutData.verticalPosition.y}), 水平位置: (${layoutData.horizontalPosition.x}, ${layoutData.horizontalPosition.y}), 贴边隐藏: ${layoutData.enableEdgeHide ? '启用' : '禁用'}`);
    } catch (e) {
      this.error("保存布局模式失败:", e);
    }
  }

  /**
   * 恢复布局模式配置
   */
  async restoreLayoutMode(): Promise<LayoutConfig> {
    try {
      const saved = await this.storageService.getConfig<Partial<LayoutConfig>>(
        PLUGIN_STORAGE_KEYS.LAYOUT_MODE, 
        this.pluginName, 
        createDefaultLayoutConfig()
      );
      
      const layoutConfig = {
        ...createDefaultLayoutConfig(),
        ...saved
      };
      
      this.log(`📂 恢复布局模式配置: ${layoutConfig.isVerticalMode ? '垂直' : '水平'}`);
      return layoutConfig;
    } catch (e) {
      this.warn("恢复布局模式配置失败:", e);
      return createDefaultLayoutConfig();
    }
  }

  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode(isFixedToTop: boolean): Promise<void> {
    try {
      const fixedToTopData = { isFixedToTop };
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FIXED_TO_TOP, fixedToTopData, this.pluginName);
      this.log(`💾 固定到顶部状态已保存: ${isFixedToTop ? '启用' : '禁用'}`);
    } catch (e) {
      this.error("保存固定到顶部状态失败:", e);
    }
  }

  /**
   * 恢复固定到顶部状态
   */
  async restoreFixedToTopMode(): Promise<boolean> {
    try {
      const saved = await this.storageService.getConfig<{ isFixedToTop: boolean }>(
        PLUGIN_STORAGE_KEYS.FIXED_TO_TOP,
        this.pluginName,
        { isFixedToTop: false }
      );

      const isFixedToTop = saved?.isFixedToTop || false;
      this.log(`📂 恢复固定到顶部状态: ${isFixedToTop ? '启用' : '禁用'}`);
      return isFixedToTop;
    } catch (e) {
      this.warn("恢复固定到顶部状态失败:", e);
      return false;
    }
  }

  /**
   * 保存固定到编辑器顶部状态到API配置
   */
  async saveFixedToEditorTopMode(isFixedToEditorTop: boolean): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FIXED_TO_EDITOR_TOP, { isFixedToEditorTop }, this.pluginName);
      this.log(`💾 固定到编辑器顶部状态已保存: ${isFixedToEditorTop ? '启用' : '禁用'}`);
    } catch (e) {
      this.error("保存固定到编辑器顶部状态失败:", e);
    }
  }

  /**
   * 恢复固定到编辑器顶部状态
   */
  async restoreFixedToEditorTopMode(): Promise<boolean> {
    try {
      const saved = await this.storageService.getConfig<{ isFixedToEditorTop: boolean }>(
        PLUGIN_STORAGE_KEYS.FIXED_TO_EDITOR_TOP,
        this.pluginName,
        { isFixedToEditorTop: false }
      );

      const isFixedToEditorTop = saved?.isFixedToEditorTop || false;
      this.log(`📂 恢复固定到编辑器顶部状态: ${isFixedToEditorTop ? '启用' : '禁用'}`);
      return isFixedToEditorTop;
    } catch (e) {
      this.warn("恢复固定到编辑器顶部状态失败:", e);
      return false;
    }
  }

  /**
   * 保存合并模式固定条目（panelId → 固定 key 列表）
   */
  async saveMergedPinnedEntries(data: Record<string, string[]>): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.MERGED_PINNED_ENTRIES, data, this.pluginName);
    } catch (e) {
      this.error("保存合并模式固定条目失败:", e);
    }
  }

  /**
   * 恢复合并模式固定条目
   */
  async restoreMergedPinnedEntries(): Promise<Record<string, string[]>> {
    try {
      const saved = await this.storageService.getConfig<Record<string, string[]>>(
        PLUGIN_STORAGE_KEYS.MERGED_PINNED_ENTRIES,
        this.pluginName,
        {}
      );
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch (e) {
      this.warn("恢复合并模式固定条目失败:", e);
      return {};
    }
  }

  /**
   * 保存合并模式标题覆盖（panelId|key → 自定义标题）
   */
  async saveMergedTitleOverrides(data: Record<string, string>): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.MERGED_TITLE_OVERRIDES, data, this.pluginName);
    } catch (e) {
      this.error("保存合并模式标题覆盖失败:", e);
    }
  }

  /**
   * 恢复合并模式标题覆盖
   */
  async restoreMergedTitleOverrides(): Promise<Record<string, string>> {
    try {
      const saved = await this.storageService.getConfig<Record<string, string>>(
        PLUGIN_STORAGE_KEYS.MERGED_TITLE_OVERRIDES,
        this.pluginName,
        {}
      );
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch (e) {
      this.warn("恢复合并模式标题覆盖失败:", e);
      return {};
    }
  }

  /**
   * 保存浮窗可见状态
   */
  async saveFloatingWindowVisible(isVisible: boolean): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE, isVisible, this.pluginName);
      this.log(`💾 浮窗可见状态已保存: ${isVisible ? '显示' : '隐藏'}`);
    } catch (error) {
      this.error("保存浮窗可见状态失败:", error);
    }
  }

  /**
   * 恢复浮窗可见状态
   */
  async restoreFloatingWindowVisible(): Promise<boolean> {
    try {
      const saved = await this.storageService.getConfig<boolean>(PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE, this.pluginName, false);
      const isVisible = saved || false;
      this.log(`📱 恢复浮窗可见状态: ${isVisible ? '显示' : '隐藏'}`);
      return isVisible;
    } catch (error) {
      this.error("恢复浮窗可见状态失败:", error);
      return false;
    }
  }

  // ==================== 最近切换标签历史管理 ====================

  /**
   * 保存最近切换标签历史
   */
  async saveRecentTabSwitchHistory(history: Record<string, RecentTabSwitchHistory>): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.RECENT_TAB_SWITCH_HISTORY, history, this.pluginName);
      this.verboseLog(`💾 保存最近切换标签历史: ${Object.keys(history).length} 个标签的历史记录`);
    } catch (e) {
      this.warn("无法保存最近切换标签历史:", e);
    }
  }

  /**
   * 恢复最近切换标签历史
   */
  async restoreRecentTabSwitchHistory(): Promise<Record<string, RecentTabSwitchHistory>> {
    try {
      const saved = await this.storageService.getConfig<Record<string, RecentTabSwitchHistory>>(
        PLUGIN_STORAGE_KEYS.RECENT_TAB_SWITCH_HISTORY, 
        this.pluginName, 
        {}
      );
      if (saved && typeof saved === 'object') {
        // 规范化每个历史记录中的标签数据
        const normalizedHistory: Record<string, RecentTabSwitchHistory> = {};
        for (const [key, history] of Object.entries(saved)) {
          normalizedHistory[key] = {
            ...history,
            recentTabs: normalizeTabInfoArray(history.recentTabs || [])
          };
        }
        this.verboseLog(`📂 从API配置恢复了 ${Object.keys(normalizedHistory).length} 个标签的切换历史`);
        return normalizedHistory;
      } else {
        this.log(`📂 没有找到最近切换标签历史数据，返回空对象`);
        return {};
      }
    } catch (e) {
      this.warn("无法恢复最近切换标签历史:", e);
      return {};
    }
  }

  /**
   * 更新单个标签的切换历史
   */
  async updateTabSwitchHistory(fromTabId: string, toTab: TabInfo): Promise<void> {
    try {
      const allHistory = await this.restoreRecentTabSwitchHistory();
      
      // 使用全局历史记录键
      const globalHistoryKey = 'global_tab_history';
      
      // 获取或创建全局历史记录
      if (!allHistory[globalHistoryKey]) {
        allHistory[globalHistoryKey] = {
          tabId: globalHistoryKey,
          recentTabs: [],
          lastUpdated: Date.now(),
          maxRecords: FEATURE_CONFIG.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS // 全局历史记录最大数量限制
        };
      }
      
      const history = allHistory[globalHistoryKey];
      
      // 移除重复的标签（如果存在）
      history.recentTabs = history.recentTabs.filter(tab => tab.blockId !== toTab.blockId);
      
      // 添加新的标签到历史记录开头
      history.recentTabs.unshift(toTab);
      
      // 限制历史记录数量
      if (history.recentTabs.length > history.maxRecords) {
        history.recentTabs = history.recentTabs.slice(0, history.maxRecords);
      }
      
      // 更新最后更新时间
      history.lastUpdated = Date.now();
      
      // 保存更新后的历史记录
      await this.saveRecentTabSwitchHistory(allHistory);
      
      this.verboseLog(`📝 更新全局切换历史: ${fromTabId} -> ${toTab.title} (历史记录数量: ${history.recentTabs.length})`);
    } catch (e) {
      this.warn(`更新全局切换历史失败:`, e);
    }
  }

  /**
   * 获取指定标签的最近切换历史
   */
  async getTabSwitchHistory(tabId: string): Promise<TabInfo[]> {
    try {
      const allHistory = await this.restoreRecentTabSwitchHistory();
      const history = allHistory[tabId];
      
      if (history && history.recentTabs) {
        this.verboseLog(`📖 获取标签 ${tabId} 的切换历史: ${history.recentTabs.length} 个记录`);
        return history.recentTabs;
      } else {
        this.verboseLog(`📖 标签 ${tabId} 没有切换历史记录，存储中的所有历史ID: ${Object.keys(allHistory).join(', ')}`);
        return [];
      }
    } catch (e) {
      this.warn(`获取标签 ${tabId} 的切换历史失败:`, e);
      return [];
    }
  }

  // ==================== 缓存清理 ====================

  /**
   * 删除API配置缓存
   */
  async clearCache(): Promise<void> {
    try {
      await this.storageService.removeConfig(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS);
      await this.storageService.removeConfig(PLUGIN_STORAGE_KEYS.CLOSED_TABS);
      await this.storageService.removeConfig(PLUGIN_STORAGE_KEYS.RECENT_TAB_SWITCH_HISTORY);
      this.log(`🗑️ 已删除API配置缓存: 标签页数据、已关闭标签列表和切换历史`);
    } catch (e) {
      this.warn("删除API配置缓存失败:", e);
    }
  }

  /**
   * 清理历史记录，确保符合新的数量限制
   */
  async cleanupHistoryRecords(): Promise<void> {
    try {
      const allHistory = await this.restoreRecentTabSwitchHistory();
      let cleanedCount = 0;
      
      for (const [key, history] of Object.entries(allHistory)) {
        if (history.recentTabs.length > FEATURE_CONFIG.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS) {
          const originalCount = history.recentTabs.length;
          history.recentTabs = history.recentTabs.slice(0, FEATURE_CONFIG.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS);
          history.maxRecords = FEATURE_CONFIG.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS;
          cleanedCount += (originalCount - history.recentTabs.length);
          this.log(`🧹 清理历史记录 ${key}: ${originalCount} -> ${history.recentTabs.length}`);
        }
      }
      
      if (cleanedCount > 0) {
        await this.saveRecentTabSwitchHistory(allHistory);
        this.log(`✅ 历史记录清理完成，共清理了 ${cleanedCount} 条记录`);
      }
    } catch (e) {
      this.warn("清理历史记录失败:", e);
    }
  }

  // ==================== 工具方法 ====================

  /**
   * 简单的字符串哈希函数
   */
  hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * 删除指定标签的切换历史记录
   */
  async deleteTabSwitchHistory(tabId: string): Promise<void> {
    try {
      const allHistory = await this.restoreRecentTabSwitchHistory();
      
      if (allHistory[tabId]) {
        delete allHistory[tabId];
        await this.saveRecentTabSwitchHistory(allHistory);
        this.verboseLog(`🗑️ 删除标签 ${tabId} 的切换历史记录`);
      } else {
        this.verboseLog(`📖 标签 ${tabId} 没有切换历史记录，无需删除`);
      }
    } catch (e) {
      this.warn(`删除标签 ${tabId} 的切换历史失败:`, e);
    }
  }
}
