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

import { TabInfo, SavedTabSet, Workspace, TabPosition } from '../types';
import { PLUGIN_STORAGE_KEYS } from '../constants';
import { OrcaStorageService } from './storage';
import { 
  updatePositionConfig, 
  createDefaultLayoutConfig, 
  generatePositionLogMessage,
  type LayoutConfig 
} from '../utils/configUtils';

/**
 * 标签页存储服务类
 * 
 * 提供统一的标签页数据存储接口，封装所有存储相关的操作。
 * 使用 OrcaStorageService 作为底层存储实现。
 */
export class TabStorageService {
  private storageService: OrcaStorageService;
  private log: (message: string) => void;
  private warn: (message: string, error?: any) => void;
  private error: (message: string, error?: any) => void;
  private verboseLog: (message: string) => void;

  constructor(
    storageService: OrcaStorageService,
    loggers: {
      log: (message: string) => void;
      warn: (message: string, error?: any) => void;
      error: (message: string, error?: any) => void;
      verboseLog: (message: string) => void;
    }
  ) {
    this.storageService = storageService;
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
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS, tabs, 'orca-tabs-plugin');
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
      const saved = await this.storageService.getConfig<TabInfo[]>(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS, 'orca-tabs-plugin', []);
      if (saved && Array.isArray(saved)) {
        this.log(`📂 从API配置恢复了第一个面板的 ${saved.length} 个标签页`);
        return saved;
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
      await this.storageService.saveConfig(`panel_${panelId}_tabs`, tabs, 'orca-tabs-plugin');
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
      await this.storageService.saveConfig(storageKey, tabs, 'orca-tabs-plugin');
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
      const saved = await this.storageService.getConfig<TabInfo[]>(storageKey, 'orca-tabs-plugin', []);
      if (saved && Array.isArray(saved)) {
        this.verboseLog(`📂 从 ${storageKey} 恢复了 ${saved.length} 个标签页`);
        return saved;
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
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.CLOSED_TABS, Array.from(closedTabs), 'orca-tabs-plugin');
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
      const saved = await this.storageService.getConfig<string[]>(PLUGIN_STORAGE_KEYS.CLOSED_TABS, 'orca-tabs-plugin', []);
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
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.RECENTLY_CLOSED_TABS, recentlyClosedTabs, 'orca-tabs-plugin');
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
      const saved = await this.storageService.getConfig<TabInfo[]>(PLUGIN_STORAGE_KEYS.RECENTLY_CLOSED_TABS, 'orca-tabs-plugin', []);
      if (saved && Array.isArray(saved)) {
        this.log(`📂 从API配置恢复了 ${saved.length} 个最近关闭的标签页`);
        return saved;
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
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.SAVED_TAB_SETS, savedTabSets, 'orca-tabs-plugin');
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
      const saved = await this.storageService.getConfig<SavedTabSet[]>(PLUGIN_STORAGE_KEYS.SAVED_TAB_SETS, 'orca-tabs-plugin', []);
      if (saved && Array.isArray(saved)) {
        this.log(`📂 从API配置恢复了 ${saved.length} 个多标签页集合`);
        return saved;
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
      const workspacesData = await this.storageService.getConfig(PLUGIN_STORAGE_KEYS.WORKSPACES);
      const workspaces: Workspace[] = workspacesData && Array.isArray(workspacesData) ? workspacesData : [];
      
      const enableWorkspaces = await this.storageService.getConfig(PLUGIN_STORAGE_KEYS.ENABLE_WORKSPACES);
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
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.WORKSPACES, workspaces, 'orca-tabs-plugin');
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.CURRENT_WORKSPACE, currentWorkspace, 'orca-tabs-plugin');
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_WORKSPACES, enableWorkspaces, 'orca-tabs-plugin');
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
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.CURRENT_WORKSPACE, null, 'orca-tabs-plugin');
      this.log(`📁 已清除当前工作区状态`);
    } catch (error) {
      this.error("清除当前工作区状态失败:", error);
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
      // 使用配置工具函数更新位置
      const updatedPositions = updatePositionConfig(
        position,
        isVerticalMode,
        verticalPosition,
        horizontalPosition
      );
      
      await this.saveLayoutMode({
        isVerticalMode,
        verticalWidth: 0, // 这个值需要从外部传入
        verticalPosition: updatedPositions.verticalPosition,
        horizontalPosition: updatedPositions.horizontalPosition,
        isSidebarAlignmentEnabled: false, // 这些值需要从外部传入
        isFloatingWindowVisible: false,
        showBlockTypeIcons: false,
        showInHeadbar: false
      });
      
      this.log(`💾 位置已保存: ${generatePositionLogMessage(position, isVerticalMode)}`);
      return updatedPositions;
    } catch (e) {
      this.warn("无法保存标签位置");
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
  }): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.LAYOUT_MODE, layoutData, 'orca-tabs-plugin');
      this.log(`💾 布局模式已保存: ${layoutData.isVerticalMode ? '垂直' : '水平'}, 垂直宽度: ${layoutData.verticalWidth}px, 垂直位置: (${layoutData.verticalPosition.x}, ${layoutData.verticalPosition.y}), 水平位置: (${layoutData.horizontalPosition.x}, ${layoutData.horizontalPosition.y})`);
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
        'orca-tabs-plugin', 
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
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FIXED_TO_TOP, fixedToTopData, 'orca-tabs-plugin');
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
        'orca-tabs-plugin', 
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
   * 保存浮窗可见状态
   */
  async saveFloatingWindowVisible(isVisible: boolean): Promise<void> {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE, isVisible, 'orca-tabs-plugin');
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
      const saved = await this.storageService.getConfig<boolean>(PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE, 'orca-tabs-plugin', false);
      const isVisible = saved || false;
      this.log(`📱 恢复浮窗可见状态: ${isVisible ? '显示' : '隐藏'}`);
      return isVisible;
    } catch (error) {
      this.error("恢复浮窗可见状态失败:", error);
      return false;
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
      this.log(`🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表`);
    } catch (e) {
      this.warn("删除API配置缓存失败:", e);
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
}
