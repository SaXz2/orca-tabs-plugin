import { setupL10N, t } from "./libs/l10n";
import zhCN from "./translations/zhCN";
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { zhCN as zhCNLocale, enUS as enUSLocale } from 'date-fns/locale';

// 定义配置常量
const AppKeys = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
} as const;

// 定义属性类型常量
const PropType = {
  JSON: 0,
  Text: 1
} as const;

let pluginName: string;

interface TabInfo {
  blockId: string;
  panelId: string;
  title: string;
  color?: string;
  icon?: string;
  isJournal?: boolean;
  isPinned?: boolean;
  order: number;
  scrollPosition?: { x: number; y: number }; // 滚动位置
  blockType?: string; // 块类型
}

interface TabPosition {
  x: number;
  y: number;
}

interface PanelTabsData {
  tabs: TabInfo[];
  lastActive: number; // 时间戳
}

// 插件专用存储键定义
const PLUGIN_STORAGE_KEYS = {
  FIRST_PANEL_TABS: 'first-panel-tabs',      // 第一个面板的标签数据
  CLOSED_TABS: 'closed-tabs',               // 已关闭标签列表
  FLOATING_WINDOW_VISIBLE: 'floating-window-visible', // 浮窗可见状态
  TABS_POSITION: 'tabs-position',           // 标签位置
  LAYOUT_MODE: 'layout-mode',               // 布局模式
} as const;

/**
 * 基于Orca API的存储服务类
 * 提供统一的配置存储和读取接口，支持降级到localStorage
 */
class OrcaStorageService {
  private log(...args: any[]) {
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
      console.log('[OrcaStorageService]', ...args);
    }
  }

  private warn(...args: any[]) {
    console.warn('[OrcaStorageService]', ...args);
  }

  private error(...args: any[]) {
    console.error('[OrcaStorageService]', ...args);
  }

  /**
   * 保存数据到Orca插件存储系统
   * @param key 存储键
   * @param data 要保存的数据
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async saveConfig(key: string, data: any, pluginName: string = 'orca-tabs-plugin'): Promise<boolean> {
    try {
      // 将复杂对象序列化为JSON字符串
      const serializedData = typeof data === 'string' ? data : JSON.stringify(data);
      await orca.plugins.setData(pluginName, key, serializedData);
      this.log(`💾 已保存插件数据 ${key}:`, data);
      return true;
    } catch (error) {
      this.warn(`无法保存插件数据 ${key}，尝试降级到localStorage:`, error);
      return this.saveToLocalStorage(key, data);
    }
  }

  /**
   * 从Orca插件存储系统读取数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   * @param defaultValue 默认值
   */
  async getConfig<T>(key: string, pluginName: string = 'orca-tabs-plugin', defaultValue?: T): Promise<T | null> {
    try {
      const result = await orca.plugins.getData(pluginName, key);
      
      if (result === null || result === undefined) {
        return defaultValue || null;
      }
      
      // 尝试反序列化JSON字符串
      let parsedResult: T;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (parseError) {
          // 如果解析失败，可能是纯字符串，直接返回
          parsedResult = result as T;
        }
      } else {
        // 如果已经是对象，直接使用
        parsedResult = result as T;
      }
      
      this.log(`📂 已读取插件数据 ${key}:`, parsedResult);
      return parsedResult;
    } catch (error) {
      this.warn(`无法读取插件数据 ${key}，尝试从localStorage读取:`, error);
      return this.getFromLocalStorage(key, defaultValue);
    }
  }

  /**
   * 删除插件数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async removeConfig(key: string, pluginName: string = 'orca-tabs-plugin'): Promise<boolean> {
    try {
      await orca.plugins.removeData(pluginName, key);
      this.log(`🗑️ 已删除插件数据 ${key}`);
      return true;
    } catch (error) {
      this.warn(`无法删除插件数据 ${key}，尝试从localStorage删除:`, error);
      return this.removeFromLocalStorage(key);
    }
  }

  /**
   * 降级到localStorage保存
   */
  private saveToLocalStorage(key: string, data: any): boolean {
    try {
      const storageKey = this.getLocalStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(data));
      this.log(`💾 已降级保存到localStorage: ${storageKey}`);
      return true;
    } catch (error) {
      this.error(`无法保存到localStorage:`, error);
      return false;
    }
  }

  /**
   * 从localStorage读取
   */
  private getFromLocalStorage<T>(key: string, defaultValue?: T): T | null {
    try {
      const storageKey = this.getLocalStorageKey(key);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const result = JSON.parse(saved);
        this.log(`📂 已从localStorage读取: ${storageKey}`);
        return result;
      }
      return defaultValue || null;
    } catch (error) {
      this.error(`无法从localStorage读取:`, error);
      return defaultValue || null;
    }
  }

  /**
   * 从localStorage删除
   */
  private removeFromLocalStorage(key: string): boolean {
    try {
      const storageKey = this.getLocalStorageKey(key);
      localStorage.removeItem(storageKey);
      this.log(`🗑️ 已从localStorage删除: ${storageKey}`);
      return true;
    } catch (error) {
      this.error(`无法从localStorage删除:`, error);
      return false;
    }
  }

  /**
   * 获取localStorage键名
   */
  private getLocalStorageKey(key: string): string {
    const keyMap: Record<string, string> = {
      [PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS]: 'orca-first-panel-tabs-api',
      [PLUGIN_STORAGE_KEYS.CLOSED_TABS]: 'orca-closed-tabs-api',
      [PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE]: 'orca-tabs-visible-api',
      [PLUGIN_STORAGE_KEYS.TABS_POSITION]: 'orca-tabs-position-api',
      [PLUGIN_STORAGE_KEYS.LAYOUT_MODE]: 'orca-tabs-layout-api',
    };
    return keyMap[key] || `orca-plugin-storage-${key}`;
  }

  /**
   * 测试API配置的序列化和反序列化
   */
  async testConfigSerialization(): Promise<void> {
    try {
      this.log("🧪 开始测试API配置序列化...");
      
      // 测试简单数据类型
      const testString = "test string";
      await this.saveConfig('test-string', testString);
      const retrievedString = await this.getConfig<string>('test-string', 'orca-tabs-plugin');
      this.log(`字符串测试: ${testString === retrievedString ? '✅' : '❌'}`);
      
      // 测试复杂对象
      const testObject = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig('test-object', testObject);
      const retrievedObject = await this.getConfig<typeof testObject>('test-object', 'orca-tabs-plugin');
      this.log(`对象测试: ${JSON.stringify(testObject) === JSON.stringify(retrievedObject) ? '✅' : '❌'}`);
      
      // 测试数组
      const testArray = [1, 2, 3, { nested: true }];
      await this.saveConfig('test-array', testArray);
      const retrievedArray = await this.getConfig<typeof testArray>('test-array', 'orca-tabs-plugin');
      this.log(`数组测试: ${JSON.stringify(testArray) === JSON.stringify(retrievedArray) ? '✅' : '❌'}`);
      
      // 清理测试数据
      await this.removeConfig('test-string');
      await this.removeConfig('test-object');
      await this.removeConfig('test-array');
      
      this.log("🧪 API配置序列化测试完成");
    } catch (error) {
      this.error("API配置序列化测试失败:", error);
    }
  }


  /**
   * 获取旧的localStorage键名（用于迁移）
   */
}

class OrcaTabsPlugin {
  private firstPanelTabs: TabInfo[] = []; // 只存储第一个面板的标签数据
  private currentPanelId: string = '';
  private panelIds: string[] = []; // 所有面板ID列表
  private currentPanelIndex = 0; // 当前面板索引
  private storageService = new OrcaStorageService(); // 存储服务实例
  
  // 调试日志（开发模式）
  private log(...args: any[]) {
    // 在开发模式下启用日志（可以通过变量控制）
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
      console.log(...args);
    }
  }

  // 详细日志（仅在需要时启用）
  private verboseLog(...args: any[]) {
    // 只有在明确启用详细日志时才输出
    // 使用方法：在控制台设置 window.DEBUG_ORCA_TABS_VERBOSE = true
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS_VERBOSE === true) {
      console.log('[OrcaTabsPlugin]', ...args);
    }
  }
  
  private warn(...args: any[]) {
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
      console.warn(...args);
    }
  }
  
  private error(...args: any[]) {
    // 错误日志在生产环境也保留
    console.error(...args);
  }
  private tabContainer: HTMLElement | null = null;
  private cycleSwitcher: HTMLElement | null = null;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private maxTabs = 10; // 默认值，会从设置中读取
  private homePageBlockId: string | null = null; // 主页块ID，从设置中读取
  private position: TabPosition = { x: 50, y: 50 };
  private monitoringInterval: number | null = null;
  private globalEventListener: ((e: Event) => void) | null = null; // 统一的全局事件监听器
  private updateDebounceTimer: number | null = null; // 防抖计时器
  private lastUpdateTime: number = 0; // 上次更新时间
  private isUpdating: boolean = false; // 是否正在更新
  private isInitialized: boolean = false; // 是否已完成初始化
  private isVerticalMode: boolean = false; // 垂直模式标志
  private verticalWidth: number = 200; // 垂直模式下的窗口宽度
  private verticalPosition: TabPosition = { x: 20, y: 20 }; // 垂直模式下的位置
  private horizontalPosition: TabPosition = { x: 20, y: 20 }; // 水平模式下的位置
  private isResizing: boolean = false; // 是否正在调整大小
  private resizeHandle: HTMLElement | null = null; // 调整大小的拖拽手柄
  private isSidebarAlignmentEnabled: boolean = false; // 侧边栏对齐功能是否启用
  private sidebarAlignmentObserver: MutationObserver | null = null; // 侧边栏状态监听器
  private lastSidebarState: string | null = null; // 上次检测到的侧边栏状态
  private isFloatingWindowVisible: boolean = true; // 浮窗是否可见
  private sidebarDebounceTimer: number | null = null; // 防抖计时器
  public showBlockTypeIcons: boolean = true; // 是否显示块类型图标
  public showInHeadbar: boolean = true; // 是否在顶部栏显示按钮
  
  // 拖拽状态管理
  private draggingTab: TabInfo | null = null; // 当前正在拖拽的标签
  private dragEndListener: (() => void) | null = null; // 全局拖拽结束监听器
  private swapDebounceTimer: number | null = null; // 拖拽交换防抖计时器
  private lastSwapTarget: string | null = null; // 上次交换的目标标签ID，防止重复交换
  private dragOverTimer: number | null = null; // 拖拽悬停计时器
  private isDragOverActive = false; // 是否正在拖拽悬停状态
  private themeChangeListener: (() => void) | null = null; // 主题变化监听器
  private lastPanelDiscoveryTime = 0; // 上次面板发现时间
  private panelDiscoveryCache: { panelIds: string[], timestamp: number } | null = null; // 面板发现缓存
  private scrollListener: (() => void) | null = null; // 滚动监听器
  
  // 已关闭标签页跟踪
  private closedTabs: Set<string> = new Set(); // 已关闭的标签页blockId集合
  private lastActiveBlockId: string | null = null
  
  // 快捷键相关
  private hoveredBlockId: string | null = null; // 当前鼠标悬停的块ID
  private currentContextBlockRefId: string | null = null; // 当前右键菜单对应的块引用ID

  async init() {
    // 从设置中读取最大标签数
    try {
      this.maxTabs = orca.state.settings[AppKeys.CachedEditorNum] || 10;
    } catch (e) {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }

    // 注册插件设置
    await this.registerPluginSettings();

    // 注册块菜单命令
    this.registerBlockMenuCommands();

    // 恢复保存的位置
    await this.restorePosition();
    
    // 恢复布局模式
    await this.restoreLayoutMode();
    
    // 恢复浮窗可见状态
    await this.restoreFloatingWindowVisibility();
    
    
    // 注册顶部工具栏按钮
    this.registerHeadbarButton();
    
    // 发现所有面板
    this.discoverPanels();
    
    // 面板是动态创建的，不需要延迟检查
    // 监听器会自动检测新面板的创建
    
    
    // 测试API配置序列化（开发模式）
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
      await this.storageService.testConfigSerialization();
    }
    
    // 恢复第一个面板的标签页数据
    await this.restoreFirstPanelTabs();
    
    // 恢复已关闭标签列表
    await this.restoreClosedTabs();
    
    // 检查是否有持久化的数据
    const hasPersistentData = this.firstPanelTabs.length > 0;
    
    if (!hasPersistentData) {
      // 只有在没有持久化数据时才扫描第一个面板（首次使用）
      this.log("首次使用，扫描第一个面板创建标签页");
      await this.scanFirstPanel();
    } else {
      // 有持久化数据，使用固化的标签页状态
      this.log("检测到持久化数据，使用固化的标签页状态");
    }
    
    // 创建标签页UI
    await this.createTabsUI();
    
    // 监听DOM变化（只监听第一个面板的新增）
    this.observeChanges();
    
    // 监听窗口大小变化
    this.observeWindowResize();
    
    // 启动主动的面板状态检测
    this.startActiveMonitoring();
    
    // 设置全局拖拽结束监听器
    this.setupDragEndListener();
    
    // 监听主题变化
    this.setupThemeChangeListener();
    
    // 设置滚动监听器
    this.setupScrollListener();
    
    // 标记初始化完成
    this.isInitialized = true;
    this.log("✅ 插件初始化完成");
  }

  /**
   * 设置主题变化监听器
   */
  private setupThemeChangeListener() {
    // 移除之前的监听器
    if (this.themeChangeListener) {
      this.themeChangeListener();
      this.themeChangeListener = null;
    }

    // 使用Orca广播API监听主题变化
    const handleThemeChange = (theme: string) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", theme);
      this.log("当前主题模式:", orca.state.themeMode);
      
      // 延迟执行，确保主题切换完成
      setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode);
        this.debouncedUpdateTabsUI();
      }, 200); // 增加延迟时间
    };

    // 注册主题变化监听器
    try {
      orca.broadcasts.registerHandler("core.themeChanged", handleThemeChange);
      this.log("主题变化监听器注册成功");
    } catch (error) {
      this.error("主题变化监听器注册失败:", error);
    }

    // 添加备用的主题检测机制
    let lastThemeMode = orca.state.themeMode;
    const checkThemeChange = () => {
      const currentThemeMode = orca.state.themeMode;
      if (currentThemeMode !== lastThemeMode) {
        this.log("备用检测：主题从", lastThemeMode, "切换到", currentThemeMode);
        lastThemeMode = currentThemeMode;
        setTimeout(() => {
          this.debouncedUpdateTabsUI();
        }, 200);
      }
    };

    // 每500ms检查一次主题变化（备用机制）
    const themeCheckInterval = setInterval(checkThemeChange, 500);

    // 保存清理函数
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", handleThemeChange);
      clearInterval(themeCheckInterval);
    };
  }

  /**
   * 设置滚动监听器
   */
  private setupScrollListener() {
    // 移除之前的监听器
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }

    // 创建滚动监听器
    let scrollTimeout: number | null = null;
    const handleScroll = () => {
      // 防抖处理，避免频繁记录
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const currentActiveTab = this.getCurrentActiveTab();
        if (currentActiveTab) {
          this.recordScrollPosition(currentActiveTab);
        }
      }, 300); // 300ms防抖
    };

    // 监听所有可能的滚动容器
    const scrollContainers = document.querySelectorAll('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html');
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll, { passive: true });
    });

    // 保存清理函数
    this.scrollListener = () => {
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }

  /**
   * 设置全局拖拽结束监听器
   */
  setupDragEndListener() {
    this.dragEndListener = () => {
      this.draggingTab = null;
      this.clearDragVisualFeedback();
      this.log("🔄 全局拖拽结束，清除拖拽状态");
    };
    document.addEventListener("dragend", this.dragEndListener);
  }

  /**
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    if (this.tabContainer) {
      // 移除所有拖拽相关的CSS类
      const tabs = this.tabContainer.querySelectorAll('.orca-tab');
      tabs.forEach(tab => {
        tab.removeAttribute('data-dragging');
        tab.removeAttribute('data-drag-over');
        tab.classList.remove('dragging', 'drag-over');
      });
      
      // 移除容器拖拽状态
      this.tabContainer.removeAttribute('data-dragging');
    }
  }

  /**
   * 添加拖拽悬停效果（优化版）
   */
  addDragOverEffect(tabElement: HTMLElement) {
    // 检查是否已经有拖拽悬停效果
    if (tabElement.getAttribute('data-drag-over') === 'true') {
      return; // 避免重复添加
    }
    
    tabElement.setAttribute('data-drag-over', 'true');
    tabElement.classList.add('drag-over');
    
    // 清除之前的定时器
    if (this.dragOverTimer) {
      clearTimeout(this.dragOverTimer);
    }
  }

  /**
   * 移除拖拽悬停效果（优化版）
   */
  removeDragOverEffect(tabElement: HTMLElement) {
    // 检查是否真的有拖拽悬停效果
    if (tabElement.getAttribute('data-drag-over') !== 'true') {
      return; // 避免重复移除
    }
    
    tabElement.removeAttribute('data-drag-over');
    tabElement.classList.remove('drag-over');
    
    // 清除定时器
    if (this.dragOverTimer) {
      clearTimeout(this.dragOverTimer);
      this.dragOverTimer = null;
    }
  }

  /**
   * 防抖的标签交换函数（修复版）
   */
  async debouncedSwapTab(targetTab: TabInfo, draggingTab: TabInfo) {
    // 防止重复交换同一个目标
    if (this.lastSwapTarget === targetTab.blockId) {
      return;
    }
    
    // 立即执行交换，不使用延迟
      await this.swapTab(targetTab, draggingTab);
    this.lastSwapTarget = targetTab.blockId;
  }

  /**
   * 交换两个标签的位置（优化版）
   */
  async swapTab(targetTab: TabInfo, draggingTab: TabInfo) {
    if (this.currentPanelIndex !== 0) {
      this.log("只有第一个面板支持拖拽排序");
      return;
    }
    
    const targetIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === targetTab.blockId);
    const draggingIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === draggingTab.blockId);
    
    if (targetIndex !== -1 && draggingIndex !== -1 && targetIndex !== draggingIndex) {
      // 智能交换：根据拖拽方向决定交换策略
      const isMovingRight = draggingIndex < targetIndex;
      
      if (isMovingRight) {
        // 向右拖拽：将拖拽标签插入到目标标签的右边
        const draggedTab = this.firstPanelTabs.splice(draggingIndex, 1)[0];
        const newTargetIndex = targetIndex > draggingIndex ? targetIndex - 1 : targetIndex;
        this.firstPanelTabs.splice(newTargetIndex + 1, 0, draggedTab);
      } else {
        // 向左拖拽：将拖拽标签插入到目标标签的左边
        const draggedTab = this.firstPanelTabs.splice(draggingIndex, 1)[0];
        this.firstPanelTabs.splice(targetIndex, 0, draggedTab);
      }
      
      // 更新order属性
      this.firstPanelTabs.forEach((tab, index) => {
        tab.order = index;
      });
      
      
      // 重新排序（保持固定标签在前）
      this.sortTabsByPinStatus();
      
      // 优化：拖拽时只保存数据，不立即更新UI（避免干扰拖拽体验）
      await this.saveFirstPanelTabs();
      
      // 如果不是正在拖拽，立即更新UI；否则延迟更新
      if (!this.draggingTab) {
        this.debouncedUpdateTabsUI();
      }
    }
  }

  /**
   * 发现所有面板
   */
  discoverPanels() {
    const now = Date.now();
    
    // 如果距离上次发现不到1秒，且缓存有效，直接使用缓存
    if (now - this.lastPanelDiscoveryTime < 1000 && this.panelDiscoveryCache) {
      const cacheAge = now - this.panelDiscoveryCache.timestamp;
      if (cacheAge < 1000) { // 缓存1秒内有效
        this.panelIds = [...this.panelDiscoveryCache.panelIds];
        this.verboseLog("📋 使用面板发现缓存，面板ID列表:", this.panelIds);
        return;
      }
    }
    
    this.log("🔍 开始发现面板...");
    this.lastPanelDiscoveryTime = now;
    
    const mainSection = document.querySelector('section#main');
    if (!mainSection) {
      this.warn("❌ 未找到 section#main");
      return;
    }
    this.log("✅ 找到 section#main");

    const panelsRow = mainSection.querySelector('.orca-panels-row');
    if (!panelsRow) {
      this.warn("❌ 未找到 .orca-panels-row");
      return;
    }
    this.log("✅ 找到 .orca-panels-row");

    // 检查所有可能的面板选择器
    const allPanels = document.querySelectorAll('.orca-panel');
    
    const panels = panelsRow.querySelectorAll('.orca-panel');
    this.panelIds = [];
    
    
    // 详细检查每个面板
    panels.forEach((panel, index) => {
      const panelId = panel.getAttribute('data-panel-id');
      const isActive = panel.classList.contains('active');
      const isVisible = (panel as HTMLElement).offsetParent !== null; // 检查是否可见
      const rect = panel.getBoundingClientRect();
      const isMenuPanel = this.isMenuPanel(panel);
      
      this.log(`面板 ${index + 1}: ID=${panelId}, 激活=${isActive}, 可见=${isVisible}, 菜单=${isMenuPanel}, 位置=(${rect.left}, ${rect.top})`);
      
      if (panelId && !isMenuPanel) {
        this.panelIds.push(panelId);
      } else if (isMenuPanel) {
        this.log(`🚫 跳过菜单面板: ${panelId}`);
      } else {
        this.warn(`❌ 面板 ${index + 1} 没有 data-panel-id 属性`);
      }
    });
    
    // 如果面板数量不足，尝试其他方法
    if (panels.length < 2 && allPanels.length >= 2) {
      this.log("⚠️ 在 .orca-panels-row 中面板不足，尝试从整个文档中查找...");
      
      allPanels.forEach((panel, index) => {
        const panelId = panel.getAttribute('data-panel-id');
        const isMenuPanel = this.isMenuPanel(panel);
        if (panelId && !this.panelIds.includes(panelId) && !isMenuPanel) {
          this.panelIds.push(panelId);
          this.log(`➕ 从文档中找到额外面板: ID=${panelId}`);
        } else if (isMenuPanel) {
          this.log(`🚫 跳过菜单面板: ${panelId}`);
        }
      });
    }
    
    // 更新当前面板信息，但保持激活状态
    if (this.panelIds.length > 0) {
      // 检查当前激活的面板是否还在列表中
      const activePanel = document.querySelector('.orca-panel.active');
      if (activePanel) {
        const activePanelId = activePanel.getAttribute('data-panel-id');
        const activeIndex = this.panelIds.indexOf(activePanelId || '');
        
        if (activeIndex !== -1) {
          // 当前激活的面板还在列表中，保持其状态
          this.currentPanelId = activePanelId || '';
          this.currentPanelIndex = activeIndex;
        } else {
          // 当前激活的面板不在列表中，设置为第一个面板
          this.currentPanelId = this.panelIds[0];
          this.currentPanelIndex = 0;
        }
      } else {
        // 没有激活的面板，设置为第一个面板
        this.currentPanelId = this.panelIds[0];
        this.currentPanelIndex = 0;
      }
    }
    
    this.log(`🎯 最终发现 ${this.panelIds.length} 个面板，面板ID列表:`, this.panelIds);
    this.log(`🎯 当前面板: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`);
    
    // 更新缓存
    this.panelDiscoveryCache = {
      panelIds: [...this.panelIds],
      timestamp: now
    };
    
    // 如果只有一个面板，显示提示
    if (this.panelIds.length === 1) {
      this.log("ℹ️ 只有一个面板，不会显示切换按钮");
    } else if (this.panelIds.length > 1) {
      this.log(`✅ 发现 ${this.panelIds.length} 个面板，将创建循环切换器`);
    }
  }

  /**
   * 检查是否为菜单面板（需要排除）
   */
  isMenuPanel(panel: Element): boolean {
    // 检查是否包含菜单类
    if (panel.classList.contains('orca-menu') || 
        panel.classList.contains('orca-recents-menu')) {
      return true;
    }
    
    // 检查父元素是否包含菜单类
    const parent = panel.parentElement;
    if (parent && (parent.classList.contains('orca-menu') || 
                   parent.classList.contains('orca-recents-menu'))) {
      return true;
    }
    
    return false;
  }

  /**
   * 扫描第一个面板的标签页（只读取当前激活的页面）
   */
  async scanFirstPanel() {
    if (this.panelIds.length === 0) return;
    
    const firstPanelId = this.panelIds[0];
    const panel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!panel) return;

    // 只获取当前激活的页面（最上面的）
    const activeBlockEditor = panel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) {
      this.log("第一个面板中没有找到激活的块编辑器");
      return;
    }

    const blockId = activeBlockEditor.getAttribute('data-block-id');
    if (!blockId) {
      this.log("激活的块编辑器没有blockId");
      return;
    }

    // 获取当前激活页面的标签信息
    const tabInfo = await this.getTabInfo(blockId, firstPanelId, 0);
    if (tabInfo) {
      
      // 直接设置为第一个面板的标签页（只显示当前激活的页面）
      this.firstPanelTabs = [tabInfo];
      
      // 保存到持久化存储
      await this.saveFirstPanelTabs();
      
      await this.updateTabsUI();
    } else {
      this.log("无法获取激活页面的标签信息");
    }
  }

  /**
   * 合并第一个面板的标签页（现在只处理单个标签页）
   */
  mergeFirstPanelTabs(newTabs: TabInfo[]) {
    // 由于现在只处理当前激活的页面，这个方法主要用于兼容性
    // 实际逻辑已经在scanFirstPanel和checkFirstPanelBlocks中处理
    if (newTabs.length > 0) {
      // 应用排序逻辑（固定标签在前，非固定在后）
      this.sortTabsByPinStatus();
    }
  }

  /**
   * 按固定状态排序标签（固定标签在前，非固定在后）
   */
  sortTabsByPinStatus() {
    this.firstPanelTabs.sort((a, b) => {
      // 固定标签在前
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // 相同固定状态的标签保持数组中的顺序（不按order排序）
      // 这样新插入的标签会保持在正确的位置
      return 0;
    });
  }

  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex(): number {
    // 从后往前查找第一个非固定标签页
    for (let i = this.firstPanelTabs.length - 1; i >= 0; i--) {
      if (!this.firstPanelTabs[i].isPinned) {
        return i;
      }
    }
    return -1; // 没有找到非固定标签页
  }

  /**
   * 专门格式化日记日期（用于标签显示）
   */
  formatJournalDate(date: Date): string {
    try {
      // 获取用户的日期格式设置
      let dateFormat = orca.state.settings[AppKeys.JournalDateFormat];
      
      // 如果没有设置或设置无效，使用默认格式
      if (!dateFormat || typeof dateFormat !== 'string') {
        const locale = orca.state.locale || 'zh-CN';
        dateFormat = locale.startsWith('zh') ? 'yyyy年MM月dd日' : 'yyyy-MM-dd';
      }

      // 判断相对日期（优先显示相对日期）
      if (isToday(date)) {
        return t('今天');
      } else if (isYesterday(date)) {
        return t('昨天');
      } else if (isTomorrow(date)) {
        return t('明天');
      } else {
        // 使用用户设置的日期格式，但需要处理星期几的中文显示
        return this.formatDateWithPattern(date, dateFormat);
      }
    } catch (e) {
      // 如果格式化失败，使用默认格式
      this.warn("日期格式化失败:", e);
      return this.formatDateWithPattern(date, 'yyyy-MM-dd');
    }
  }

  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(content: any[]): Promise<string> {
    if (!content || content.length === 0) return "";
    
    let text = "";
    for (const fragment of content) {
      // ContentFragment 结构: { t: "类型", v: "值", f?: "格式", fa?: {...} }
      
      if (fragment.t === "t" && fragment.v) {
        // 文本类型片段，v 是实际文本内容
        text += fragment.v;
      } else if (fragment.t === "r") {
        // 链接/引用类型片段
        if (fragment.u) {
          // 如果有URL，这是外部链接
          if (fragment.v) {
            text += fragment.v; // 显示文本
          } else {
            text += fragment.u; // 使用URL
          }
        } else if (fragment.a) {
          // 优先使用别名字段 a，并加上 [[]] 包围
          text += `[[${fragment.a}]]`;
        } else if (fragment.v && (typeof fragment.v === "number" || typeof fragment.v === "string")) {
          // 如果v是数字或字符串且没有URL，这是块引用
          // 对于没有a字段的块引用，直接使用v值，不进行复杂的解析
          text += `[[块${fragment.v}]]`;
        } else if (fragment.v) {
          // 其他情况，v作为显示文本
          text += fragment.v;
        }
      } else if (fragment.t === "br" && fragment.v) {
        // 块引用类型，v 通常是块ID，使用getTabInfo方式读取
        try {
          const referencedBlockId = fragment.v.toString();
          // 使用getTabInfo方式获取块信息，这样能正确解析content
          const tabInfo = await this.getTabInfo(referencedBlockId, "", 0);
          if (tabInfo && tabInfo.title) {
            text += tabInfo.title;
          } else {
            text += `[[块${referencedBlockId}]]`;
          }
        } catch (e) {
          this.warn("处理块引用失败:", e);
          text += `[[块引用]]`;
        }
      } else if (fragment.t && fragment.t.includes("math") && fragment.v) {
        // 数学公式类型，显示公式内容
        text += `[数学: ${fragment.v}]`;
      } else if (fragment.t && fragment.t.includes("code") && fragment.v) {
        // 代码类型，显示代码内容
        text += fragment.v;
      } else if (fragment.v && typeof fragment.v === "string") {
        // 其他类型的片段，如果 v 是字符串就添加
        text += fragment.v;
      }
    }
    return text.trim();
  }

  /**
   * 使用BlockProperty API提取日期块信息
   */
  extractJournalInfo(block: any): Date | null {
    try {
      // 查找_repr属性（类型应该是PropType.JSON = 0）
      const reprProp = this.findProperty(block, '_repr');
      if (!reprProp || reprProp.type !== PropType.JSON || !reprProp.value) {
        return null;
      }

      // 解析JSON类型的属性值
      const reprData = typeof reprProp.value === 'string' 
        ? JSON.parse(reprProp.value) 
        : reprProp.value;

      // 检查是否是journal类型的日期块
      if (reprData.type === 'journal' && reprData.date) {
        return new Date(reprData.date);
      }

      return null;
    } catch (e) {
      // JSON解析失败或其他错误
      return null;
    }
  }

  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(content: any[]): boolean {
    if (!Array.isArray(content) || content.length === 0) {
      return false;
    }
    
    // 检查是否包含没有别名的块引用
    let hasRefsWithoutAlias = false;
    let hasText = false;
    let hasRefs = false;
    
    for (const fragment of content) {
      if (fragment && typeof fragment === 'object') {
        if (fragment.t === 'r' && fragment.v) {
          hasRefs = true;
          // 如果块引用没有a字段，认为需要拼接
          if (!fragment.a) {
            hasRefsWithoutAlias = true;
          }
        } else if (fragment.t === 't' && fragment.v) {
          hasText = true;
        }
      }
    }
    
    // 如果包含没有别名的块引用，或者包含文本+块引用的拼接格式，认为需要拼接
    return hasRefsWithoutAlias || (hasText && hasRefs);
  }

  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(content: any[]): boolean {
    if (!Array.isArray(content) || content.length === 0) {
      return false;
    }
    
    let textCount = 0;
    let refCount = 0;
    
    for (const fragment of content) {
      if (fragment && typeof fragment === 'object') {
        if (fragment.t === 'text' && fragment.v) {
          textCount++;
        } else if (fragment.t === 'ref' && fragment.v) {
          refCount++;
        }
      }
    }
    
    // 如果同时有文本和块引用，且文本数量大于等于块引用数量，认为是文本+块引用组合
    return textCount > 0 && refCount > 0 && textCount >= refCount;
  }

  /**
   * 检测块类型
   */
  async detectBlockType(block: any): Promise<string> {
    try {
      // 1. 检查是否是日期块
      const journalInfo = this.extractJournalInfo(block);
      if (journalInfo) {
        return 'journal';
      }

      // 2. 检查 data-type 属性（最高优先级）
      if (block['data-type']) {
        const dataType = block['data-type'];
        this.log(`🔍 检测到 data-type: ${dataType}`);
        
        switch (dataType) {
          case 'table2':
            return 'table';
          case 'ul':
            return 'list';
          case 'ol':
            return 'list';
          default:
            this.log(`⚠️ 未知的 data-type: ${dataType}`);
        }
      }

      // 3. 检查是否是别名块，使用 Orca API 准确判断页面和标签类型
      if (block.aliases && block.aliases.length > 0) {
        this.log(`🏷️ 检测到别名块: aliases=${JSON.stringify(block.aliases)}`);
        
        const alias = block.aliases[0];
        if (alias) {
          try {
            // 使用 _hide 属性判断：有 _hide 且为 truthy 的是页面，否则是标签
            const hideProp = this.findProperty(block, '_hide');
            const isPage = hideProp && hideProp.value;
            
            if (isPage) {
              this.log(`📄 通过 _hide 属性确认为页面: ${alias} (hide=${hideProp.value})`);
              return 'page';
            } else {
              this.log(`🏷️ 通过 _hide 属性确认为标签: ${alias} (hide=${hideProp ? hideProp.value : 'undefined'})`);
              return 'tag';
            }
          } catch (error) {
            this.warn("使用 API 检测标签失败，回退到文本分析:", error);
            // 回退到原来的文本分析逻辑
            if (alias.includes('#') || 
                alias.includes('@') || 
                alias.length < 20 && alias.match(/^[a-zA-Z0-9_-]+$/) ||
                alias.match(/^[a-z]+$/i)) {
              return 'tag';
            } else {
              return 'page';
            }
          }
        }
        
        return 'alias'; // 默认返回别名
      }
      
      // 调试：输出块的基本信息
      this.verboseLog(`🔍 块信息调试: blockId=${block.id}, aliases=${block.aliases ? JSON.stringify(block.aliases) : 'undefined'}, content=${block.content ? 'exists' : 'undefined'}, text=${block.text ? 'exists' : 'undefined'}`);

      // 4. 检查_repr属性中的类型
      const reprProp = this.findProperty(block, '_repr');
      if (reprProp && reprProp.type === PropType.JSON && reprProp.value) {
        try {
          const reprData = typeof reprProp.value === 'string' 
            ? JSON.parse(reprProp.value) 
            : reprProp.value;
          
          if (reprData.type) {
            return reprData.type;
          }
        } catch (e) {
          // JSON解析失败，继续其他检测
        }
      }

      // 5. 检查块内容特征
      if (block.content && Array.isArray(block.content)) {
        // 检查是否包含代码块
        const hasCodeBlock = block.content.some((item: any) => 
          item && typeof item === 'object' && item.type === 'code'
        );
        if (hasCodeBlock) {
          return 'code';
        }

        // 检查是否包含表格
        const hasTable = block.content.some((item: any) => 
          item && typeof item === 'object' && item.type === 'table'
        );
        if (hasTable) {
          return 'table';
        }

        // 检查是否包含图片
        const hasImage = block.content.some((item: any) => 
          item && typeof item === 'object' && item.type === 'image'
        );
        if (hasImage) {
          return 'image';
        }

        // 检查是否包含链接
        const hasLink = block.content.some((item: any) => 
          item && typeof item === 'object' && item.type === 'link'
        );
        if (hasLink) {
          return 'link';
        }
      }

      // 6. 检查块文本特征
      if (block.text) {
        const text = block.text.trim();
        
        // 检查是否是标题（以#开头）
        if (text.startsWith('#')) {
          return 'heading';
        }

        // 检查是否是引用（以>开头）
        if (text.startsWith('> ')) {
          return 'quote';
        }

        // 检查是否是代码行
        if (text.startsWith('```') || text.startsWith('`')) {
          return 'code';
        }

        // 检查是否是任务项
        if (text.startsWith('- [ ]') || text.startsWith('- [x]') || text.startsWith('* [ ]') || text.startsWith('* [x]')) {
          return 'task';
        }

        // 检查是否是表格（包含|分隔符且有多行）
        if (text.includes('|') && text.split('\n').length > 1) {
          return 'table';
        }

        // 检查是否是列表（无序列表：- * + 开头，有序列表：数字. 开头）
        if (text.startsWith('- ') || text.startsWith('* ') || text.startsWith('+ ') || 
            /^\d+\.\s/.test(text)) {
          return 'list';
        }

        // 检查是否包含URL链接
        const urlPattern = /https?:\/\/[^\s]+/;
        if (urlPattern.test(text)) {
          return 'link';
        }

        // 检查是否是数学公式
        if (text.includes('$$') || text.includes('$') && text.includes('=')) {
          return 'math';
        }
      }

      // 7. 默认类型
      return 'text';
    } catch (e) {
      this.warn("检测块类型失败:", e);
      return 'text';
    }
  }

  /**
   * 根据块类型获取图标
   */
  getBlockTypeIcon(blockType: string): string {
    const iconMap: { [key: string]: string } = {
      'journal': '📅',      // 日期块 - 保持emoji
      'alias': 'ti ti-tag',       // 别名块
      'page': 'ti ti-file',         // 页面
      'tag': 'ti ti-hash',         // 标签
      'heading': 'ti ti-heading',      // 标题
      'code': 'ti ti-code',         // 代码
      'table': 'ti ti-table',        // 表格
      'image': 'ti ti-photo',        // 图片
      'link': 'ti ti-link',         // 链接
      'list': 'ti ti-list',         // 列表
      'quote': 'ti ti-quote',        // 引用
      'text': 'ti ti-box',         // 普通文本
      'block': 'ti ti-square',        // 块
      'note': 'ti ti-notes',         // 笔记
      'task': 'ti ti-checkbox',         // 任务
      'idea': 'ti ti-bulb',         // 想法
      'question': 'ti ti-help-circle',     // 问题
      'answer': 'ti ti-message-circle',       // 答案
      'summary': 'ti ti-file-text',      // 总结
      'reference': 'ti ti-book',    // 参考
      'example': 'ti ti-code',      // 示例
      'warning': 'ti ti-alert-triangle',      // 警告
      'info': 'ti ti-info-circle',         // 信息
      'tip': 'ti ti-lightbulb',          // 提示
      'math': 'ti ti-math',         // 数学公式
      'default': 'ti ti-file'       // 默认
    };

    const icon = iconMap[blockType] || iconMap['default'];
    this.verboseLog(`🎨 为块类型 "${blockType}" 分配图标: ${icon}`);
    return icon;
  }

  /**
   * 获取所有支持的块类型和对应图标
   */
  getAllBlockTypeIcons(): { [key: string]: string } {
    return {
      'journal': '📅',      // 日期块 - 保持emoji
      'alias': 'ti ti-tag',       // 别名块
      'page': 'ti ti-file-text',         // 页面
      'tag': 'ti ti-tag',         // 标签
      'heading': 'ti ti-heading',      // 标题
      'code': 'ti ti-code',         // 代码
      'table': 'ti ti-table',        // 表格
      'image': 'ti ti-photo',        // 图片
      'link': 'ti ti-link',         // 链接
      'list': 'ti ti-list',         // 列表
      'quote': 'ti ti-quote',        // 引用
      'text': 'ti ti-box',         // 普通文本
      'block': 'ti ti-square',        // 块
      'note': 'ti ti-notes',         // 笔记
      'task': 'ti ti-checkbox',         // 任务
      'idea': 'ti ti-bulb',         // 想法
      'question': 'ti ti-help-circle',     // 问题
      'answer': 'ti ti-message-circle',       // 答案
      'summary': 'ti ti-file-text',      // 总结
      'reference': 'ti ti-book',    // 参考
      'example': 'ti ti-code',      // 示例
      'warning': 'ti ti-alert-triangle',      // 警告
      'info': 'ti ti-info-circle',         // 信息
      'tip': 'ti ti-lightbulb',          // 提示
      'math': 'ti ti-math',         // 数学公式
      'default': 'ti ti-file'       // 默认
    };
  }

  /**
   * 获取块文本标题（最低优先级）
   */
  getBlockTextTitle(block: any): string {
    // 使用块的文本内容
    if (block.text) {
      return block.text.substring(0, 50);
    }
    
    // 最后备选
    return `块 ${block.id}`;
  }

  /**
   * 使用指定模式格式化日期
   */
  formatDateWithPattern(date: Date, pattern: string): string {
    try {
      // 检查是否包含星期几格式（E）
      if (pattern.includes('E')) {
        const locale = orca.state.locale || 'zh-CN';
        
        if (locale.startsWith('zh')) {
          // 中文环境，需要手动处理星期几
          const weekday = date.getDay(); // 0=周日, 1=周一, ..., 6=周六
          const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
          const weekdayText = weekdays[weekday];
          
          // 替换E为中文星期几
          const chinesePattern = pattern.replace(/E/g, weekdayText);
          return format(date, chinesePattern);
        } else {
          // 非中文环境，直接使用format
          return format(date, pattern);
        }
      } else {
        // 不包含星期几，直接格式化
        return format(date, pattern);
      }
    } catch (e) {
      // 如果用户设置的格式无效，尝试常见格式
      const fallbackFormats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy年MM月dd日'];
      
      for (const fallbackFormat of fallbackFormats) {
        try {
          return format(date, fallbackFormat);
        } catch (fallbackError) {
          continue;
        }
      }
      
      // 最后的备选方案
      return date.toISOString().split('T')[0];
    }
  }


  /**
   * 在块的properties中查找指定名称的属性
   */
  findProperty(block: any, propertyName: string): any {
    if (!block.properties || !Array.isArray(block.properties)) {
      return null;
    }
    
    return block.properties.find((prop: any) => prop.name === propertyName);
  }

  /**
   * 检查字符串是否是日期格式
   */
  isDateString(str: string): boolean {
    // 检查常见的日期格式
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,        // YYYY-MM-DD
      /^\d{4}\/\d{2}\/\d{2}$/,      // YYYY/MM/DD
      /^\d{2}\/\d{2}\/\d{4}$/,      // MM/DD/YYYY
      /^\d{4}-\d{2}-\d{2}T/,        // ISO format start
    ];
    
    return datePatterns.some(pattern => pattern.test(str));
  }

  async getTabInfo(blockId: string, panelId: string, order: number): Promise<TabInfo | null> {
    try {
      // 获取块信息
      const block = await orca.invokeBackend("get-block", parseInt(blockId));
      if (!block) return null;

      let title = "";
      let color = "";
      let icon = "";
      let isJournal = false;
      let blockType = "";

      // 检测块类型
      blockType = await this.detectBlockType(block);
      this.log(`🔍 检测到块类型: ${blockType} (块ID: ${blockId})`);
      
      // 特别调试别名块
      if (block.aliases && block.aliases.length > 0) {
        this.log(`🏷️ 别名块详细信息: blockId=${blockId}, aliases=${JSON.stringify(block.aliases)}, 检测到的类型=${blockType}`);
      }

      // 获取标题：优先级 日期块 > 别名 > content内容 > text内容
      try {
        // 最高优先级：检查是否是日期块
        const journalInfo = this.extractJournalInfo(block);
        if (journalInfo) {
          isJournal = true;
          const formattedDate = this.formatJournalDate(journalInfo);
          title = formattedDate; // 移除文字中的图标，图标会通过icon属性单独显示
          console.log(`📅 识别为日期块: ${title}, 原始日期: ${journalInfo.toISOString()}`);
        } else if (block.aliases && block.aliases.length > 0) {
          // 第二优先级：检查是否有别名
          title = block.aliases[0];
        } else if (block.content && block.content.length > 0) {
          // 第三优先级：检查content是否需要拼接多段
          const needsConcatenation = this.needsContentConcatenation(block.content);
          if (needsConcatenation && block.text) {
            // 如果需要拼接多段，优先使用block.text
            title = block.text.substring(0, 50);
          } else {
            // 否则使用content内容解析
            title = (await this.extractTextFromContent(block.content)).substring(0, 50);
          }
        } else if (block.text) {
          // 第三优先级：使用text内容作为备选
          let textTitle = block.text.substring(0, 50);
          
          // 根据块类型优化标题提取
          if (blockType === 'list') {
            // 列表：提取第一行作为标题
            const firstLine = block.text.split('\n')[0].trim();
            if (firstLine) {
              // 移除列表标记
              textTitle = firstLine.replace(/^[-*+]\s+/, '').replace(/^\d+\.\s+/, '');
            }
          } else if (blockType === 'table') {
            // 表格：提取第一行作为标题
            const firstLine = block.text.split('\n')[0].trim();
            if (firstLine) {
              // 移除表格分隔符
              textTitle = firstLine.replace(/\|/g, '').trim();
            }
          } else if (blockType === 'quote') {
            // 引用：提取第一行作为标题
            const firstLine = block.text.split('\n')[0].trim();
            if (firstLine) {
              // 移除引用标记
              textTitle = firstLine.replace(/^>\s+/, '');
            }
          } else if (blockType === 'image') {
            // 图片：优先匹配 caption: 内容
            const captionMatch = block.text.match(/caption:\s*(.+)/i);
            if (captionMatch && captionMatch[1]) {
              textTitle = captionMatch[1].trim();
            } else {
              // 如果没有找到 caption，使用整个 text 内容
              textTitle = block.text.trim();
            }
          }
          
          title = textTitle;
        } else {
          // 最低优先级：使用块ID作为备选
          title = `块 ${blockId}`;
          console.log(`❌ 没有找到合适的标题，使用块ID: ${blockId}`);
        }
      } catch (e) {
        this.warn("获取标题失败:", e);
        title = `块 ${blockId}`;
      }

      // 获取颜色和图标 - 从块的properties数组中查找
      try {
        const colorProp = this.findProperty(block, '_color');
        const iconProp = this.findProperty(block, '_icon');
        
        if (colorProp && colorProp.type === 1) {
          color = colorProp.value;
        }
        
        // 优先使用用户自定义图标，否则根据设置决定是否使用块类型图标
        if (iconProp && iconProp.type === 1) {
          icon = iconProp.value;
          this.log(`🎨 使用用户自定义图标: ${icon} (块ID: ${blockId})`);
        } else if (this.showBlockTypeIcons || blockType === 'journal') {
          // 使用块类型对应的图标，日期块始终显示图标
          icon = this.getBlockTypeIcon(blockType);
          this.log(`🎨 使用块类型图标: ${icon} (块类型: ${blockType}, 块ID: ${blockId})`);
        }
      } catch (e) {
        this.warn("获取属性失败:", e);
        // 如果获取属性失败，使用块类型图标作为备选
        icon = this.getBlockTypeIcon(blockType);
      }

      return {
        blockId,
        panelId,
        title: title || `块 ${blockId}`,
        color,
        icon,
        isJournal,
        isPinned: false, // 新标签默认不固定
        order,
        blockType
      };
    } catch (e) {
      this.error("获取标签信息失败:", e);
      return null;
    }
  }

  async createTabsUI() {
    // 如果浮窗被隐藏，不创建UI
    if (!this.isFloatingWindowVisible) {
      this.log("🙈 浮窗已隐藏，跳过UI创建");
      return;
    }

    // 移除现有的标签容器和循环切换器
    if (this.tabContainer) {
      this.tabContainer.remove();
    }
    if (this.cycleSwitcher) {
      this.cycleSwitcher.remove();
    }


    // 不再创建循环切换器，因为标签页会自动切换
    this.log("📱 使用自动切换模式，不创建面板切换器");

    // 创建标签容器
    this.tabContainer = document.createElement('div');
    this.tabContainer.className = 'orca-tabs-container';
    // 不再需要为切换器预留空间
    // 根据主题模式设置背景
    const isDarkMode = orca.state.themeMode === 'dark';
    const backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    
    // 根据布局模式设置不同的样式
    const currentPosition = this.isVerticalMode ? this.verticalPosition : this.position;
    const containerStyle = this.isVerticalMode ? `
      position: fixed;
      top: ${currentPosition.y}px;
      left: ${currentPosition.x}px;
      z-index: 300;
      display: flex;
      flex-direction: column;
      gap: 4px;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      background: ${backgroundColor};
      border-radius: 6px;
      padding: 4px 2px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      user-select: none;
      max-height: 80vh;
      flex-wrap: nowrap;
      pointer-events: auto;
      -webkit-app-region: no-drag;
      width: ${this.verticalWidth}px;
      min-width: 120px;
      max-width: 400px;
      align-items: stretch;
      app-region: no-drag;
      overflow-y: auto;
      overflow-x: visible;
    ` : `
      position: fixed;
      top: ${currentPosition.y}px;
      left: ${currentPosition.x}px;
      z-index: 300;
      display: flex;
      gap: 4px;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      background: ${backgroundColor};
      border-radius: 6px;
      padding: 2px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      user-select: none;
      max-width: 80vw;
      flex-wrap: wrap;
      pointer-events: auto;
      -webkit-app-region: no-drag;
      height: 28px;
      align-items: center;
      app-region: no-drag;
    `;
    
    this.tabContainer.style.cssText = containerStyle;
    
    // 添加事件监听，只阻止标签栏内部的mousedown事件冒泡
    this.tabContainer.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;
      // 只阻止标签栏内部元素的mousedown事件，不影响侧边栏
      if (target.closest('.orca-tab, .new-tab-button, .drag-handle') && 
          !target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu')) {
        e.stopPropagation();
      }
    });
    
    
    this.tabContainer.addEventListener('click', (e) => {
      // 只阻止标签栏内部的点击事件冒泡，不影响侧边栏
      const target = e.target as HTMLElement;
      if (target.closest('.orca-tab, .new-tab-button, .drag-handle') && 
          !target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu')) {
        e.stopPropagation();
        console.log(`🖱️ 标签栏容器点击事件被阻止: ${target.className}`);
      }
    });

    // 创建拖拽手柄
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cssText = `
      width: 20px;
      height: 100%;
      background: transparent;
      cursor: move;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
      margin-right: 4px;
      min-height: 32px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
    `;
    dragHandle.innerHTML = '⋮⋮';

    // 添加拖拽事件
    dragHandle.addEventListener('mousedown', this.startDrag.bind(this));

    this.tabContainer.appendChild(dragHandle);
    document.body.appendChild(this.tabContainer);

    // 添加拖拽相关的CSS样式
    this.addDragStyles();

    // 如果是垂直模式，启用拖拽调整宽度功能
    if (this.isVerticalMode) {
      this.enableDragResize();
    }

    await this.updateTabsUI();
  }

  /**
   * 添加拖拽相关的CSS样式
   */
  addDragStyles() {
    // 检查是否已经添加过样式
    if (document.getElementById('orca-tabs-drag-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'orca-tabs-drag-styles';
    style.textContent = `
      /* 拖拽中的标签样式 */
      .orca-tab[data-dragging="true"] {
        border: 2px solid #ef4444 !important;
        margin: 0 12px !important;
        transform: scale(1.05) rotate(2deg) !important;
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
        z-index: 1000 !important;
        position: relative !important;
        opacity: 0.8 !important;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05)) !important;
      }

      /* 拖拽悬停目标样式 */
      .orca-tab[data-drag-over="true"] {
        border: 2px solid #3b82f6 !important;
        transform: scale(1.02) !important;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05)) !important;
        position: relative !important;
      }

      /* 拖拽悬停目标指示器 */
      .orca-tab[data-drag-over="true"]::before {
        content: '';
        position: absolute;
        left: -2px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: #3b82f6;
        border-radius: 2px;
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
        animation: dragIndicator 0.3s ease-in-out;
      }

      /* 拖拽指示器动画 */
      @keyframes dragIndicator {
        0% {
          opacity: 0;
          transform: translateY(-50%) scaleY(0);
        }
        100% {
          opacity: 1;
          transform: translateY(-50%) scaleY(1);
        }
      }

      /* 拖拽容器状态 */
      .orca-tabs-container[data-dragging="true"] {
        background: rgba(255, 255, 255, 0.15) !important;
        border: 2px dashed rgba(239, 68, 68, 0.4) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
      }

      /* 拖拽时的过渡动画 */
      .orca-tab {
        transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        will-change: transform, box-shadow, background, opacity, border;
      }

      /* 未选中标签的基础样式 */
      .orca-tab {
        opacity: 0.85;
        border: 1px solid transparent;
      }

      /* 选中/悬停的标签样式 */
      .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]) {
        opacity: 1 !important;
        border: 1px solid rgba(0, 0, 0, 0.2) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        transform: scale(1.02) !important;
        transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的选中样式 */
      .dark .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]) {
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
      }

      /* 点击/激活状态的标签样式 */
      .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]) {
        opacity: 1 !important;
        border: 1px solid rgba(0, 0, 0, 0.3) !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
        transform: scale(0.98) !important;
        transition: all 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的点击样式 */
      .dark .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]) {
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        box-shadow: 0 1px 4px rgba(255, 255, 255, 0.2) !important;
      }

      /* 聚焦状态的标签样式 */
      .orca-tab[data-focused="true"] {
        opacity: 1 !important;
        border: 2px solid #3b82f6 !important;
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(59, 130, 246, 0.3) !important;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05)) !important;
        transform: scale(1.02) !important;
        transition: all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的聚焦样式 */
      .dark .orca-tab[data-focused="true"] {
        border: 2px solid #60a5fa !important;
        box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.3), 0 2px 8px rgba(96, 165, 250, 0.2) !important;
        background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(96, 165, 250, 0.08)) !important;
      }

      /* 拖拽时的光标样式 */
      .orca-tab[draggable="true"] {
        cursor: pointer !important;
      }

      .orca-tab[draggable="true"]:active {
        cursor: pointer !important;
      }

      /* 拖拽时的标签容器动画 */
      .orca-tabs-container[data-dragging="true"] .orca-tab:not([data-dragging="true"]) {
        transition: all 0.2s ease !important;
      }

      /* 拖拽完成后的回弹效果 */
      .orca-tab[data-dragging="true"] {
        animation: dragBounce 0.3s ease-out;
      }

      @keyframes dragBounce {
        0% {
          transform: scale(1.05) rotate(2deg);
        }
        50% {
          transform: scale(1.08) rotate(1deg);
        }
        100% {
          transform: scale(1.05) rotate(2deg);
        }
      }
    `;
    
    document.head.appendChild(style);
    this.log("✅ 拖拽样式已添加");
  }

  /**
   * 防抖更新标签页UI（防止闪烁，优化版）
   */
  debouncedUpdateTabsUI() {
    // 如果正在拖拽，延迟更新UI以避免干扰拖拽体验
    if (this.draggingTab) {
    // 清除之前的计时器
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }
    
      // 设置新的计时器，拖拽时使用更长的延迟
    this.updateDebounceTimer = setTimeout(async () => {
      await this.updateTabsUI();
      }, 200); // 拖拽时200ms防抖
    } else {
      // 正常情况下的防抖
      if (this.updateDebounceTimer) {
        clearTimeout(this.updateDebounceTimer);
      }
      
      this.updateDebounceTimer = setTimeout(async () => {
        await this.updateTabsUI();
      }, 100); // 正常情况100ms防抖
    }
  }

  async updateTabsUI() {
    if (!this.tabContainer || this.isUpdating) return;
    
    // 防止重复更新
    this.isUpdating = true;
    const now = Date.now();
    
    // 限制更新频率（最小间隔50ms）
    if (now - this.lastUpdateTime < 50) {
      this.isUpdating = false;
      return;
    }
    
    this.lastUpdateTime = now;

    // 清除现有标签（保留拖拽手柄和新建按钮）
    const dragHandle = this.tabContainer.querySelector('.drag-handle');
    const newTabButton = this.tabContainer.querySelector('.new-tab-button');
    this.tabContainer.innerHTML = '';
    if (dragHandle) {
      this.tabContainer.appendChild(dragHandle);
    }

    // 检查第一个面板是否仍然存在
    const firstPanelExists = this.panelIds.length > 0 && document.querySelector(`.orca-panel[data-panel-id="${this.panelIds[0]}"]`);
    
    // 检查当前激活的面板是否是第一个面板
    const isFirstPanelActive = this.currentPanelIndex === 0;

    if (firstPanelExists && isFirstPanelActive) {
      // 第一个面板存在且激活时，显示固化标签页
      this.log("📋 显示第一个面板的固化标签页");
      // 确保标签按固定状态排序
      this.sortTabsByPinStatus();
      this.firstPanelTabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        this.tabContainer?.appendChild(tabElement);
      });
      
      // 在标签页后面添加新建按钮
      this.addNewTabButton();
    } else {
      // 其他情况：显示当前激活面板的实时标签页
      await this.showCurrentPanelTabsSync();
    }
    
    // 释放更新锁
    this.isUpdating = false;
  }

  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || !this.tabContainer) return;

    const panel = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!panel) {
      this.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }


    const hideableElements = panel.querySelectorAll('.orca-hideable');
    const tabs: TabInfo[] = [];
    let order = 0;
    
    // 使用与面板1相同的完整逻辑获取标签信息
    for (const hideable of hideableElements) {
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 使用完整的getTabInfo方法，与面板1保持一致
      const tabInfo = await this.getTabInfo(blockId, this.currentPanelId, order++);
      if (tabInfo) {
        tabs.push(tabInfo);
      }
    }

    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${tabs.length} 个标签页`);

    // 一次性更新DOM
    const fragment = document.createDocumentFragment();
    
    if (tabs.length > 0) {
      // 显示标签页
      tabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        fragment.appendChild(tabElement);
      });
    } else {
      // 显示提示
      const statusElement = document.createElement('div');
      statusElement.className = 'panel-status';
      statusElement.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: #333;
        font-weight: normal;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: auto;
      `;
      
      const panelNumber = this.currentPanelIndex + 1;
      statusElement.textContent = `面板 ${panelNumber}（无标签页）`;
      statusElement.title = `当前在面板 ${panelNumber}，该面板没有标签页`;
      
      fragment.appendChild(statusElement);
    }
    
    // 一次性替换内容
    this.tabContainer.appendChild(fragment);
  }


  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || !this.tabContainer) return;

    const panel = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!panel) {
      this.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }


    const hideableElements = panel.querySelectorAll('.orca-hideable');
    const tabs: TabInfo[] = [];
    let order = 0;
    
    // 同步获取标签信息，避免异步导致的闪烁
    for (const hideable of hideableElements) {
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 获取标签信息
      const tabInfo = await this.getTabInfo(blockId, this.currentPanelId, order++);
      if (tabInfo) {
        tabs.push(tabInfo);
      }
    }

    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${tabs.length} 个标签页`);

    // 一次性更新DOM，避免闪烁
    const fragment = document.createDocumentFragment();
    
    if (tabs.length > 0) {
      // 显示标签页
      tabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        fragment.appendChild(tabElement);
      });
    } else {
      // 显示提示
      const statusElement = document.createElement('div');
      statusElement.className = 'panel-status';
      statusElement.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: #333;
        font-weight: normal;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: auto;
      `;
      
      const panelNumber = this.currentPanelIndex + 1;
      statusElement.textContent = `面板 ${panelNumber}（无标签页）`;
      statusElement.title = `当前在面板 ${panelNumber}，该面板没有标签页`;
      
      fragment.appendChild(statusElement);
    }
    
    // 一次性替换内容
    this.tabContainer.appendChild(fragment);
  }

  /**
   * 添加新建标签页按钮
   */
  addNewTabButton() {
    if (!this.tabContainer) return;
    
    // 检查是否已经存在新建按钮
    const existingButton = this.tabContainer.querySelector('.new-tab-button');
    if (existingButton) return;
    
    // 创建新建标签页按钮
    const newTabButton = document.createElement('div');
    newTabButton.className = 'new-tab-button';
    // 根据布局模式设置不同的新建按钮样式
    const newButtonStyle = this.isVerticalMode ? `
      width: calc(100% - 6px);
      margin: 0 3px;
      height: 24px;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: 4px;
      transition: all 0.2s ease;
    ` : `
      width: 24px;
      height: 24px;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
      margin-left: 4px;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: 4px;
      transition: all 0.2s ease;
    `;
    
    newTabButton.style.cssText = newButtonStyle;
    newTabButton.innerHTML = '+';
    newTabButton.title = '新建标签页';

    // 添加悬停效果
    newTabButton.addEventListener('mouseenter', () => {
      newTabButton.style.background = 'rgba(0, 0, 0, 0.1)';
      newTabButton.style.color = '#333';
    });
    
    newTabButton.addEventListener('mouseleave', () => {
      newTabButton.style.background = 'transparent';
      newTabButton.style.color = '#666';
    });

    // 添加点击事件
    newTabButton.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.log('🆕 点击新建标签页按钮');
      await this.createNewTab();
    });

    this.tabContainer.appendChild(newTabButton);
    
    // 为新建标签页按钮添加右键菜单
    this.addNewTabButtonContextMenu(newTabButton);
  }
  
  /**
   * 为新建标签页按钮添加右键菜单
   */
  addNewTabButtonContextMenu(button: HTMLElement) {
    button.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showNewTabButtonContextMenu(e);
    });
  }
  
  /**
   * 显示新建标签页按钮的右键菜单
   */
  showNewTabButtonContextMenu(e: MouseEvent) {
    // 移除现有的右键菜单
    const existingMenu = document.querySelector('.new-tab-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 创建右键菜单
    const menu = document.createElement('div');
    menu.className = 'new-tab-context-menu';
    
    // 计算菜单位置，避免在屏幕边缘显示一半
    const menuWidth = 180;
    const menuHeight = 120; // 预估菜单高度
    let left = e.clientX;
    let top = e.clientY;
    
    // 如果菜单会超出右边界，向左调整
    if (left + menuWidth > window.innerWidth) {
      left = window.innerWidth - menuWidth - 10;
    }
    
    // 如果菜单会超出下边界，向上调整
    if (top + menuHeight > window.innerHeight) {
      top = window.innerHeight - menuHeight - 10;
    }
    
    // 确保不超出左边界和上边界
    left = Math.max(10, left);
    top = Math.max(10, top);
    
    menu.style.cssText = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: ${menuWidth}px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    // 菜单项
    const menuItems = [
      {
        text: '新建标签页',
        action: () => this.createNewTab(),
        icon: '+'
      },
      {
        text: '---',
        action: null,
        separator: true
      },
      {
        text: this.isVerticalMode ? '切换到水平布局' : '切换到垂直布局',
        action: () => this.toggleLayoutMode(),
        icon: this.isVerticalMode ? '⏸' : '⏵'
      }
    ];

    // 在垂直模式下添加面板宽度调整选项
    if (this.isVerticalMode) {
      menuItems.push(
        {
          text: '---',
          action: null,
          separator: true
        },
        {
          text: '调整面板宽度',
          action: () => this.showWidthAdjustmentDialog(),
          icon: '📏'
        }
      );
    }

    // 添加侧边栏对齐选项
    menuItems.push(
      {
        text: '---',
        action: null,
        separator: true
      },
      {
        text: this.isSidebarAlignmentEnabled ? '关闭侧边栏对齐' : '开启侧边栏对齐',
        action: () => this.toggleSidebarAlignment(),
        icon: this.isSidebarAlignmentEnabled ? '🔴' : '🟢'
      }
    );


    menuItems.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.style.cssText = `
          height: 1px;
          background: #ddd;
          margin: 4px 8px;
        `;
        menu.appendChild(separator);
        return;
      }

      const menuItem = document.createElement('div');
      menuItem.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #333;
        transition: background-color 0.2s ease;
      `;
      
      if (item.icon) {
        const icon = document.createElement('span');
        icon.textContent = item.icon;
        icon.style.cssText = `
          font-size: 12px;
          width: 16px;
          text-align: center;
        `;
        menuItem.appendChild(icon);
      }
      
      const text = document.createElement('span');
      text.textContent = item.text;
      menuItem.appendChild(text);
      
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      });
      
      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = 'transparent';
      });
      
      menuItem.addEventListener('click', () => {
        if (item.action) {
          item.action();
        }
        menu.remove();
      });
      
      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // 点击其他地方关闭菜单
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 100);
  }
  
  /**
   * 切换布局模式
   */
  async toggleLayoutMode() {
    try {
      // 切换模式前，保存当前位置到对应模式
      if (this.isVerticalMode) {
        // 从垂直模式切换到水平模式，保存垂直位置
        this.verticalPosition = { ...this.position };
        // 恢复水平位置（从保存的水平位置恢复）
        this.position = this.horizontalPosition || { x: 100, y: 100 };
      } else {
        // 从水平模式切换到垂直模式，保存水平位置
        this.horizontalPosition = { ...this.position };
        // 恢复垂直位置（从保存的垂直位置恢复）
        this.position = this.verticalPosition || { x: 100, y: 100 };
      }
      
      // 切换模式
      this.isVerticalMode = !this.isVerticalMode;
      
      // 保存布局模式到API配置
      await this.saveLayoutMode();
      
      // 重新创建UI
      await this.createTabsUI();
      
      this.log(`📐 布局模式已切换为: ${this.isVerticalMode ? '垂直' : '水平'}`);
    } catch (error) {
      this.error("切换布局模式失败:", error);
    }
  }
  
  /**
   * 切换侧边栏对齐状态
   */
  async toggleSidebarAlignment() {
    try {
      if (this.isSidebarAlignmentEnabled) {
        // 关闭侧边栏对齐功能
        await this.disableSidebarAlignment();
      } else {
        // 开启侧边栏对齐功能
        await this.enableSidebarAlignment();
      }
    } catch (error) {
      this.error("切换侧边栏对齐失败:", error);
    }
  }

  /**
   * 启用侧边栏对齐功能
   */
  async enableSidebarAlignment() {
    try {
      this.log("🚀 启用侧边栏对齐功能");
      
      // 读取侧边栏宽度
      const sidebarWidth = this.getSidebarWidth();
      this.log(`📏 读取到的侧边栏宽度: ${sidebarWidth}px`);
      
      if (sidebarWidth === 0) {
        this.log("⚠️ 无法读取侧边栏宽度，操作终止");
        return;
      }
      
      // 启用状态（不移动位置）
      this.isSidebarAlignmentEnabled = true;
      
      // 开始监听侧边栏状态变化
      this.startSidebarAlignmentObserver();
      
      this.log(`✅ 侧边栏对齐功能已启用，标签栏保持在当前位置`);
    } catch (error) {
      this.error("启用侧边栏对齐失败:", error);
    }
  }

  /**
   * 禁用侧边栏对齐功能
   */
  async disableSidebarAlignment() {
    try {
      this.log("🔴 禁用侧边栏对齐功能");
      
      // 停止监听
      this.stopSidebarAlignmentObserver();
      
      // 读取侧边栏宽度
      const sidebarWidth = this.getSidebarWidth();
      this.log(`📏 读取到的侧边栏宽度: ${sidebarWidth}px`);
      
      if (sidebarWidth > 0) {
        // 按照用户要求，读取 div#app 的 class 来判断侧边栏状态
        const appElement = document.querySelector('div#app');
        this.log(`🔍 查找 div#app 元素: ${appElement ? '找到' : '未找到'}`);
        
        if (appElement) {
          this.log(`🔍 app元素类名: ${appElement.className}`);
        }
        
        const isSidebarClosed = appElement?.classList.contains('sidebar-closed') || false;
        const isSidebarOpened = appElement?.classList.contains('sidebar-opened') || false;
        
        this.log(`🔍 侧边栏状态检测结果:`);
        this.log(`   - 关闭状态 (sidebar-closed): ${isSidebarClosed}`);
        this.log(`   - 打开状态 (sidebar-opened): ${isSidebarOpened}`);
        
        const currentX = this.isVerticalMode ? this.verticalPosition.x : this.position.x;
        this.log(`📍 当前位置: ${currentX}px (${this.isVerticalMode ? '垂直模式' : '水平模式'})`);
        
        let newX: number;
        let action: string;
        
        if (isSidebarClosed) {
          // 侧边栏关闭时，向左移动侧边栏宽度
          newX = Math.max(10, currentX - sidebarWidth);
          action = "向左移动";
          this.log(`📐 侧边栏关闭，向左移动 ${sidebarWidth}px，新位置: ${newX}px`);
        } else if (isSidebarOpened) {
          // 侧边栏打开时，向右移动侧边栏宽度
          newX = currentX + sidebarWidth;
          // 确保不超出窗口右边界
          const containerWidth = this.tabContainer?.getBoundingClientRect().width || 200;
          newX = Math.min(newX, window.innerWidth - containerWidth - 10);
          action = "向右移动";
          this.log(`📐 侧边栏打开，向右移动 ${sidebarWidth}px，新位置: ${newX}px`);
        } else {
          this.log("⚠️ 无法确定侧边栏状态，保持当前位置");
          this.isSidebarAlignmentEnabled = false;
          return;
        }
        
        // 更新位置
        if (this.isVerticalMode) {
          this.verticalPosition.x = newX;
          await this.saveLayoutMode();
        } else {
          this.position.x = newX;
          await this.savePosition();
        }
        
        // 重新创建UI
        this.log(`🎨 开始重新创建UI...`);
        await this.createTabsUI();
        this.log(`   UI重新创建完成`);
        
        this.log(`✅ 标签栏已${action}，最终位置: (${newX}, ${this.isVerticalMode ? this.verticalPosition.y : this.position.y})`);
      }
      
      // 禁用状态
      this.isSidebarAlignmentEnabled = false;
      this.log("🔴 侧边栏对齐功能已禁用");
    } catch (error) {
      this.error("禁用侧边栏对齐失败:", error);
    }
  }

  /**
   * 开始监听侧边栏状态变化（使用 MutationObserver）
   */
  startSidebarAlignmentObserver() {
    // 停止现有的监听器
    this.stopSidebarAlignmentObserver();

    // 初始化状态
    this.updateLastSidebarState();

    // 查找 div#app 元素
    const appElement = document.querySelector('div#app');
    if (!appElement) {
      this.log("⚠️ 未找到 div#app 元素，无法监听侧边栏状态变化");
      return;
    }

    // 创建 MutationObserver 监听 class 变化
    this.sidebarAlignmentObserver = new MutationObserver((mutations) => {
      // 检查是否有 class 属性变化
      const hasClassChange = mutations.some(mutation => 
        mutation.type === 'attributes' && mutation.attributeName === 'class'
      );

      if (hasClassChange) {
        this.log("🔄 检测到 div#app class 变化，立即检查侧边栏状态");
        this.checkSidebarStateChangeImmediate();
      }
    });

    // 开始监听 class 属性变化
    this.sidebarAlignmentObserver.observe(appElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    this.log("👁️ 开始监听侧边栏状态变化（MutationObserver 模式）");
  }

  /**
   * 停止监听侧边栏状态变化
   */
  stopSidebarAlignmentObserver() {
    // 清理 MutationObserver
    if (this.sidebarAlignmentObserver) {
      this.sidebarAlignmentObserver.disconnect();
      this.sidebarAlignmentObserver = null;
    }

    // 清理防抖计时器
    if (this.sidebarDebounceTimer) {
      clearTimeout(this.sidebarDebounceTimer);
      this.sidebarDebounceTimer = null;
    }

    // 重置状态
    this.lastSidebarState = null;

    this.log("👁️ 停止监听侧边栏状态变化");
  }

  /**
   * 更新上次检测到的侧边栏状态
   */
  updateLastSidebarState() {
    const appElement = document.querySelector('div#app');
    if (!appElement) {
      this.lastSidebarState = null;
      return;
    }

    const isSidebarClosed = appElement.classList.contains('sidebar-closed');
    const isSidebarOpened = appElement.classList.contains('sidebar-opened');
    
    if (isSidebarClosed) {
      this.lastSidebarState = 'closed';
    } else if (isSidebarOpened) {
      this.lastSidebarState = 'opened';
    } else {
      this.lastSidebarState = 'unknown';
    }
  }

  /**
   * 立即检查侧边栏状态变化（无防抖）
   */
  checkSidebarStateChangeImmediate() {
    if (!this.isSidebarAlignmentEnabled) return;

    const appElement = document.querySelector('div#app');
    if (!appElement) return;

    const isSidebarClosed = appElement.classList.contains('sidebar-closed');
    const isSidebarOpened = appElement.classList.contains('sidebar-opened');
    
    let currentState: string;
    if (isSidebarClosed) {
      currentState = 'closed';
    } else if (isSidebarOpened) {
      currentState = 'opened';
    } else {
      currentState = 'unknown';
    }

    // 如果状态发生变化，立即执行调整
    if (this.lastSidebarState !== currentState) {
      this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${currentState}`);
      this.lastSidebarState = currentState;
      
      // 立即执行调整
      this.autoAdjustSidebarAlignment();
    }
  }

  /**
   * 检查侧边栏状态是否发生变化（带防抖）
   */
  checkSidebarStateChange() {
    if (!this.isSidebarAlignmentEnabled) return;

    // 防抖处理
    if (this.sidebarDebounceTimer) {
      clearTimeout(this.sidebarDebounceTimer);
    }

    this.sidebarDebounceTimer = window.setTimeout(() => {
      this.checkSidebarStateChangeImmediate();
    }, 50); // 50ms 防抖，非常快
  }

  /**
   * 自动调整侧边栏对齐
   */
  async autoAdjustSidebarAlignment() {
    if (!this.isSidebarAlignmentEnabled) return;

    try {
      const sidebarWidth = this.getSidebarWidth();
      if (sidebarWidth === 0) return;

      const appElement = document.querySelector('div#app');
      if (!appElement) return;

      const isSidebarClosed = appElement.classList.contains('sidebar-closed');
      const isSidebarOpened = appElement.classList.contains('sidebar-opened');
      
      const currentX = this.isVerticalMode ? this.verticalPosition.x : this.position.x;
      let newX: number;
      
      if (isSidebarClosed) {
        newX = Math.max(10, currentX - sidebarWidth);
      } else if (isSidebarOpened) {
        newX = currentX + sidebarWidth;
        const containerWidth = this.tabContainer?.getBoundingClientRect().width || 200;
        newX = Math.min(newX, window.innerWidth - containerWidth - 10);
      } else {
        return;
      }
      
      // 更新位置
      if (this.isVerticalMode) {
        this.verticalPosition.x = newX;
        await this.saveLayoutMode();
      } else {
        this.position.x = newX;
        await this.savePosition();
      }
      
      // 重新创建UI
      await this.createTabsUI();
      
      this.log(`🔄 自动调整位置: ${currentX}px → ${newX}px`);
    } catch (error) {
      this.error("自动调整侧边栏对齐失败:", error);
    }
  }

  /**
   * 切换浮窗显示/隐藏状态
   */
  async toggleFloatingWindow() {
    try {
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible;
      
      if (this.isFloatingWindowVisible) {
        // 显示浮窗
        this.log("👁️ 显示浮窗");
        await this.createTabsUI();
      } else {
        // 隐藏浮窗
        this.log("🙈 隐藏浮窗");
        if (this.tabContainer) {
          this.tabContainer.remove();
          this.tabContainer = null;
        }
        if (this.resizeHandle) {
          this.resizeHandle.remove();
          this.resizeHandle = null;
        }
      }
      
      // 保存状态到API配置
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE, this.isFloatingWindowVisible);
      
      this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? '显示' : '隐藏'}`);
    } catch (error) {
      this.error("切换浮窗状态失败:", error);
    }
  }

  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    try {
      const saved = await this.storageService.getConfig<boolean>(PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE, 'orca-tabs-plugin', false);
      this.isFloatingWindowVisible = saved || false;
      this.log(`📱 恢复浮窗可见状态: ${this.isFloatingWindowVisible ? '显示' : '隐藏'}`);
    } catch (error) {
      this.error("恢复浮窗可见状态失败:", error);
    }
  }

  /**
   * 注册顶部工具栏按钮
   */
  registerHeadbarButton() {
    try {
      // 注册 headbar 按钮
      orca.headbar.registerHeadbarButton('orca-tabs-plugin.toggleButton', () => {
        const React = (window as any).React;
        const Button = orca.components.Button;
        
        return React.createElement(Button, {
          variant: 'plain',
          onClick: () => this.toggleFloatingWindow(),
          title: this.isFloatingWindowVisible ? '隐藏标签栏' : '显示标签栏',
          style: {
            color: this.isFloatingWindowVisible ? '#666' : '#999',
            transition: 'color 0.2s ease'
          }
        }, React.createElement('i', {
          className: this.isFloatingWindowVisible ? 'ti ti-eye' : 'ti ti-eye-off'
        }));
      });

      // 注册调试按钮（根据设置决定是否显示）
      if (this.showInHeadbar && typeof window !== 'undefined') {
        orca.headbar.registerHeadbarButton('orca-tabs-plugin.debugButton', () => {
          const React = (window as any).React;
          const Button = orca.components.Button;
          
          return React.createElement(Button, {
            variant: 'plain',
            onClick: () => this.toggleBlockTypeIcons(),
            title: this.showBlockTypeIcons ? '隐藏块类型图标' : '显示块类型图标',
            style: {
              color: this.showBlockTypeIcons ? '#007acc' : '#999',
              transition: 'color 0.2s ease'
            }
          }, React.createElement('i', {
            className: this.showBlockTypeIcons ? 'ti ti-palette' : 'ti ti-palette-off'
          }));
        });
      }
      
      this.log("🔘 顶部工具栏按钮已注册");
    } catch (error) {
      this.error("注册顶部工具栏按钮失败:", error);
    }
  }

  /**
   * 注销顶部工具栏按钮
   */
  unregisterHeadbarButton() {
    try {
      orca.headbar.unregisterHeadbarButton('orca-tabs-plugin.toggleButton');
      
      // 注销调试按钮
      if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
        orca.headbar.unregisterHeadbarButton('orca-tabs-plugin.debugButton');
      }
      
      this.log("🔘 顶部工具栏按钮已注销");
    } catch (error) {
      this.error("注销顶部工具栏按钮失败:", error);
    }
  }


  /**
   * 显示块类型图标信息（调试功能）
   */
  showBlockTypeIconsInfo() {
    const icons = this.getAllBlockTypeIcons();
    console.log("🎨 支持的块类型和图标:");
    console.table(icons);
    
    // 显示当前标签的块类型信息
    if (this.firstPanelTabs.length > 0) {
      console.log("📋 当前标签的块类型:");
      this.firstPanelTabs.forEach((tab, index) => {
        console.log(`${index + 1}. ${tab.title} (${tab.blockType || 'unknown'}) - ${tab.icon}`);
      });
    }
    
    this.log("🎨 块类型图标信息已输出到控制台");
  }

  /**
   * 切换块类型图标显示
   */
  async toggleBlockTypeIcons() {
    this.showBlockTypeIcons = !this.showBlockTypeIcons;
    
    // 更新所有标签页的图标
    await this.updateAllTabsBlockTypes();
    
    // 重新创建UI
    await this.createTabsUI();
    
    // 保存设置
    try {
      await this.saveLayoutMode();
      // 同步更新插件设置
      await this.storageService.saveConfig('showBlockTypeIcons', this.showBlockTypeIcons);
      this.log(`🎨 块类型图标显示已${this.showBlockTypeIcons ? '开启' : '关闭'}`);
    } catch (error) {
      this.error("保存设置失败:", error);
    }
  }


  /**
   * 更新所有标签页的块类型和图标
   */
  async updateAllTabsBlockTypes() {
    this.log("🔄 开始更新所有标签页的块类型和图标...");
    
    if (this.firstPanelTabs.length === 0) {
      this.log("⚠️ 没有标签页需要更新");
      return;
    }
    
    let hasUpdates = false;
    
    for (let i = 0; i < this.firstPanelTabs.length; i++) {
      const tab = this.firstPanelTabs[i];
      try {
        // 重新获取块信息
        const block = await orca.invokeBackend("get-block", parseInt(tab.blockId));
        if (block) {
          // 检测块类型
          const blockType = await this.detectBlockType(block);
          
          // 获取图标（优先使用用户自定义，否则使用块类型图标）
          let icon = tab.icon; // 保持用户自定义图标
          if (!icon) {
            icon = this.getBlockTypeIcon(blockType);
          }
          
          // 检查是否需要更新
          const needsUpdate = tab.blockType !== blockType || tab.icon !== icon;
          
          if (needsUpdate) {
            // 更新标签信息
            this.firstPanelTabs[i] = {
              ...tab,
              blockType,
              icon
            };
            
            this.log(`✅ 更新标签: ${tab.title} -> 类型: ${blockType}, 图标: ${icon}`);
            hasUpdates = true;
          } else {
            this.verboseLog(`⏭️ 跳过标签: ${tab.title} (无需更新)`);
          }
        }
      } catch (e) {
        this.warn(`更新标签失败: ${tab.title}`, e);
      }
    }
    
    // 只有在有更新时才重新创建UI
    if (hasUpdates) {
      this.log("🔄 检测到更新，重新创建UI...");
      await this.createTabsUI();
    } else {
      this.log("ℹ️ 没有标签页需要更新");
    }
    
    this.log("✅ 所有标签页的块类型和图标已更新");
  }

  /**
   * 对齐到侧边栏（保留原方法作为备用）
   */
  async alignToSidebar() {
    try {
      // 读取侧边栏宽度
      const sidebarWidth = this.getSidebarWidth();
      if (sidebarWidth === 0) {
        this.log("⚠️ 无法读取侧边栏宽度");
        return;
      }
      
      // 检查侧边栏状态
      const isSidebarClosed = document.querySelector('#sidebar.sidebar-closed') !== null;
      const isSidebarOpened = document.querySelector('#sidebar.sidebar-opened') !== null;
      
      this.log(`🔍 侧边栏状态 - 关闭: ${isSidebarClosed}, 打开: ${isSidebarOpened}`);
      
      let newX: number;
      
      const currentX = this.isVerticalMode ? this.verticalPosition.x : this.position.x;
      this.log(`📍 当前位置: ${currentX}px`);
      
      if (isSidebarClosed) {
        // 侧边栏关闭时，向左移动侧边栏宽度
        newX = Math.max(10, currentX - sidebarWidth);
        this.log(`📐 侧边栏关闭，向左移动 ${sidebarWidth}px，新位置: ${newX}px`);
      } else if (isSidebarOpened) {
        // 侧边栏打开时，向右移动侧边栏宽度
        newX = currentX + sidebarWidth;
        // 确保不超出窗口右边界
        const containerWidth = this.tabContainer?.getBoundingClientRect().width || 200;
        newX = Math.min(newX, window.innerWidth - containerWidth - 10);
        this.log(`📐 侧边栏打开，向右移动 ${sidebarWidth}px，新位置: ${newX}px`);
      } else {
        this.log("⚠️ 无法确定侧边栏状态");
        return;
      }
      
      // 更新位置
      if (this.isVerticalMode) {
        this.verticalPosition.x = newX;
      } else {
        this.position.x = newX;
      }
      
      // 保存位置
      if (this.isVerticalMode) {
        await this.saveLayoutMode();
      } else {
        await this.savePosition();
      }
      
      // 重新创建UI
      await this.createTabsUI();
      
      this.log(`📐 标签栏已对齐到侧边栏，新位置: (${newX}, ${this.isVerticalMode ? this.verticalPosition.y : this.position.y})`);
    } catch (error) {
      this.error("对齐到侧边栏失败:", error);
    }
  }
  
  /**
   * 获取侧边栏宽度
   */
  getSidebarWidth(): number {
    try {
      this.log("🔍 开始获取侧边栏宽度...");
      
      // 按照用户要求，读取 nav#sidebar 的 --orca-sidebar-width
      const sidebar = document.querySelector('nav#sidebar');
      this.log(`   查找 nav#sidebar 元素: ${sidebar ? '找到' : '未找到'}`);
      
      if (!sidebar) {
        this.log("⚠️ 未找到 nav#sidebar 元素");
        return 0;
      }
      
      this.log(`   侧边栏元素信息:`);
      this.log(`     - ID: ${sidebar.id}`);
      this.log(`     - 类名: ${sidebar.className}`);
      this.log(`     - 标签名: ${sidebar.tagName}`);
      
      // 获取计算后的样式
      const computedStyle = window.getComputedStyle(sidebar);
      const widthValue = computedStyle.getPropertyValue('--orca-sidebar-width');
      
      this.log(`   CSS变量 --orca-sidebar-width: "${widthValue}"`);
      
      if (widthValue && widthValue !== '') {
        // 解析CSS变量值，如 "240px"
        const width = parseInt(widthValue.replace('px', ''));
        if (!isNaN(width)) {
          this.log(`✅ 从CSS变量获取侧边栏宽度: ${width}px`);
          return width;
        } else {
          this.log(`⚠️ CSS变量值无法解析为数字: "${widthValue}"`);
        }
      } else {
        this.log(`⚠️ CSS变量 --orca-sidebar-width 不存在或为空`);
      }
      
      // 如果CSS变量不可用，尝试获取实际宽度
      this.log(`   尝试获取实际宽度...`);
      const rect = sidebar.getBoundingClientRect();
      this.log(`   实际尺寸: width=${rect.width}px, height=${rect.height}px`);
      
      if (rect.width > 0) {
        this.log(`✅ 从实际尺寸获取侧边栏宽度: ${rect.width}px`);
        return rect.width;
      }
      
      this.log("⚠️ 无法获取侧边栏宽度，所有方法都失败");
      return 0;
    } catch (error) {
      this.error("获取侧边栏宽度失败:", error);
      return 0;
    }
  }

  /**
   * 启用拖拽调整宽度功能（重构版）
   */
  enableDragResize() {
    if (!this.isVerticalMode || !this.tabContainer) return;
    
    // 清理现有手柄
    this.removeResizeHandle();
    
    // 创建拖拽手柄
    this.createResizeHandle();
    
    this.log("📏 拖拽调整宽度已启用");
  }
  
  /**
   * 移除拖拽手柄
   */
  removeResizeHandle() {
    if (this.resizeHandle) {
      this.resizeHandle.remove();
      this.resizeHandle = null;
    }
  }

  /**
   * 创建拖拽手柄
   */
  createResizeHandle() {
    if (!this.tabContainer) return;

    this.resizeHandle = document.createElement('div');
    this.resizeHandle.className = 'resize-handle';
    this.resizeHandle.style.cssText = `
      position: absolute;
      top: 0;
      right: -4px;
      width: 8px;
      height: 100%;
      cursor: col-resize;
      background: rgba(0, 0, 0, 0.1);
      z-index: 1000;
      pointer-events: auto;
    `;

    // 添加拖拽事件
    this.resizeHandle.addEventListener('mousedown', this.handleResizeStart.bind(this));
    
    this.tabContainer.appendChild(this.resizeHandle);
  }

  /**
   * 处理拖拽开始
   */
  handleResizeStart(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!this.tabContainer) return;

    const startX = e.clientX;
    const startWidth = this.verticalWidth;

    const handleMouseMove = async (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(120, Math.min(400, startWidth + deltaX));
      
      this.verticalWidth = newWidth;
      
      // 调整面板宽度
      try {
        orca.nav.changeSizes(orca.state.activePanel, [newWidth]);
        this.tabContainer!.style.width = `${newWidth}px`;
      } catch (error) {
        this.error("调整面板宽度失败:", error);
      }
    };

    const handleMouseUp = async () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // 保存设置
      try {
        await this.saveLayoutMode();
        this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (error) {
        this.error("保存宽度设置失败:", error);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  /**
   * 清理拖拽功能
   */
  cleanupDragResize() {
    this.removeResizeHandle();
  }

  /**
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    // 移除现有的对话框
    const existingDialog = document.querySelector('.width-adjustment-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    // 记录原始宽度，用于取消时恢复
    const originalWidth = this.verticalWidth;

    // 创建对话框
    const dialog = document.createElement('div');
    dialog.className = 'width-adjustment-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 2000;
      padding: 20px;
      min-width: 300px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    // 标题
    const title = document.createElement('div');
    title.textContent = '调整面板宽度';
    title.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #333;
    `;

    // 当前宽度显示
    const currentWidth = document.createElement('div');
    currentWidth.textContent = `当前面板宽度: ${this.verticalWidth}px`;
    currentWidth.style.cssText = `
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    `;

    // 滑块容器
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = `
      margin-bottom: 16px;
    `;

    // 滑块标签
    const sliderLabel = document.createElement('div');
    sliderLabel.textContent = '宽度 (120px - 400px)';
    sliderLabel.style.cssText = `
      font-size: 14px;
      margin-bottom: 8px;
      color: #333;
    `;

    // 滑块
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '120';
    slider.max = '400';
    slider.value = this.verticalWidth.toString();
    slider.style.cssText = `
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #ddd;
      outline: none;
      -webkit-appearance: none;
    `;

    // 滑块样式
    slider.style.background = `
      linear-gradient(to right, #007acc 0%, #007acc ${((this.verticalWidth - 120) / (400 - 120)) * 100}%, #ddd ${((this.verticalWidth - 120) / (400 - 120)) * 100}%, #ddd 100%)
    `;

    // 宽度显示
    const widthDisplay = document.createElement('div');
    widthDisplay.textContent = `${this.verticalWidth}px`;
    widthDisplay.style.cssText = `
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      color: #007acc;
      margin-top: 8px;
    `;

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    // 取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      color: #333;
      cursor: pointer;
      font-size: 14px;
    `;

    // 确定按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确定';
    confirmButton.style.cssText = `
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #007acc;
      color: white;
      cursor: pointer;
      font-size: 14px;
    `;

    // 滑块事件
    slider.addEventListener('input', async (e) => {
      const newWidth = parseInt((e.target as HTMLInputElement).value);
      widthDisplay.textContent = `${newWidth}px`;
      
      // 更新滑块背景
      const percentage = ((newWidth - 120) / (400 - 120)) * 100;
      slider.style.background = `
        linear-gradient(to right, #007acc 0%, #007acc ${percentage}%, #ddd ${percentage}%, #ddd 100%)
      `;
      
      // 实时调整面板宽度
      try {
        orca.nav.changeSizes(orca.state.activePanel, [newWidth]);
        
        if (this.tabContainer) {
          this.tabContainer.style.width = `${newWidth}px`;
        }
        
        this.verticalWidth = newWidth;
      } catch (error) {
        this.error("实时调整面板宽度失败:", error);
      }
    });

    // 按钮事件
    cancelButton.addEventListener('click', async () => {
      // 恢复到原始宽度
      try {
        orca.nav.changeSizes(orca.state.activePanel, [originalWidth]);
        
        if (this.tabContainer) {
          this.tabContainer.style.width = `${originalWidth}px`;
        }
        
        this.verticalWidth = originalWidth;
      } catch (error) {
        this.error("恢复面板宽度失败:", error);
      }
      
      dialog.remove();
    });

    confirmButton.addEventListener('click', async () => {
      const newWidth = parseInt(slider.value);
      
      try {
        // 保存设置（面板宽度已经在滑块移动时实时调整了）
        await this.saveLayoutMode();
        this.log(`📏 面板宽度设置已保存: ${newWidth}px`);
      } catch (error) {
        this.error("保存面板宽度设置失败:", error);
      }
      
      dialog.remove();
    });

    // 点击外部关闭
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    });

    // 组装对话框
    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(widthDisplay);
    
    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(confirmButton);
    
    dialog.appendChild(title);
    dialog.appendChild(currentWidth);
    dialog.appendChild(sliderContainer);
    dialog.appendChild(buttonContainer);
    
    document.body.appendChild(dialog);
  }
  
  /**
   * 更新垂直模式宽度
   */
  async updateVerticalWidth(newWidth: number) {
    try {
      this.verticalWidth = newWidth;
      
      // 保存宽度设置到localStorage
      await this.saveLayoutMode();
      
      // 重新创建UI
      await this.createTabsUI();
      
      this.log(`📏 垂直模式宽度已更新为: ${newWidth}px`);
    } catch (error) {
      this.error("更新宽度失败:", error);
    }
  }
  

  /**
   * 创建标签元素
   */
  createTabElement(tab: TabInfo): HTMLElement {
    this.verboseLog(`🔧 创建标签元素: ${tab.title} (ID: ${tab.blockId})`);
    const tabElement = document.createElement('div');
    tabElement.className = 'orca-tab';
    tabElement.setAttribute('data-tab-id', tab.blockId); // 添加data属性用于重命名定位
    
    // 检查是否为当前激活的标签
    const isActive = this.isTabActive(tab);
    if (isActive) {
      tabElement.setAttribute('data-focused', 'true');
    }
    
    // 设置样式
    const isDarkMode = orca.state.themeMode === 'dark';
    let backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(200, 200, 200, 0.6)';
    let textColor = isDarkMode ? '#ffffff' : '#333';
    let fontWeight = 'normal';
    
    // 如果有颜色，应用颜色样式
    if (tab.color) {
      // 使用OKLCH公式处理颜色（仅限暗色模式）
      backgroundColor = this.applyOklchFormula(tab.color, 'background');
      textColor = this.applyOklchFormula(tab.color, 'text');
      fontWeight = '600';
    }

    // 根据布局模式设置不同的标签样式
    const tabStyle = this.isVerticalMode ? `
      background: ${backgroundColor};
      color: ${textColor};
      font-weight: ${fontWeight};
      padding: 2px 8px;
      border-radius: 4px;
      height: 24px;
      max-height: 24px;
      line-height: 20px;
      cursor: pointer;
      font-size: 12px;
      width: calc(100% - 6px);
      margin: 0 3px;
      transition: all 0.2s ease;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
    ` : `
      background: ${backgroundColor};
      color: ${textColor};
      font-weight: ${fontWeight};
      padding: 2px 8px;
      border-radius: 4px;
      height: 24px;
      max-height: 24px;
      line-height: 20px;
      cursor: pointer;
      font-size: 12px;
      max-width: 150px;
      transition: all 0.2s ease;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
    `;
    
    tabElement.style.cssText = tabStyle;

    // 创建标签内容容器
    const tabContent = document.createElement('div');
    tabContent.style.cssText = `
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      gap: 6px;
    `;

    // 创建图标容器（如果有图标）
    if (tab.icon) {
      const iconContainer = document.createElement('div');
      iconContainer.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        font-size: 14px;
        line-height: 1;
      `;
      
      // 检查是否是 Tabler Icon
      if (tab.icon.startsWith('ti ti-')) {
        const iconElement = document.createElement('i');
        iconElement.className = tab.icon;
        iconContainer.appendChild(iconElement);
      } else {
        // 普通文本图标（如emoji）
        iconContainer.textContent = tab.icon;
      }
      
      tabContent.appendChild(iconContainer);
    }

    // 创建文本容器
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      min-width: 0;
      display: flex;
      align-items: center;
      line-height: 1;
      height: 16px;
      position: relative;
    `;
    
    // 添加渐变遮罩效果
    const gradientMask = document.createElement('div');
    gradientMask.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 100%;
      background: linear-gradient(to right, transparent, var(--orca-bg-color, #ffffff));
      pointer-events: none;
      z-index: 1;
    `;
    
    textContainer.appendChild(gradientMask);
    textContainer.textContent = tab.title;

    // 添加文本容器到内容容器
    tabContent.appendChild(textContainer);

    // 如果是固定标签，添加独立的图钉图标
    if (tab.isPinned) {
      const pinIcon = document.createElement('span');
      pinIcon.textContent = '📌';
      pinIcon.style.cssText = `
        flex-shrink: 0;
        font-size: 10px;
        opacity: 0.8;
      `;
      tabContent.appendChild(pinIcon);
    }

    // 将内容容器添加到标签元素
    tabElement.appendChild(tabContent);
    
    // 如果是垂直模式且没有拖拽手柄，自动添加
    if (this.isVerticalMode && !this.resizeHandle) {
      this.enableDragResize();
    }
    
    // 设置悬停提示
    let tooltip = tab.title;
    if (tab.isPinned) {
      tooltip += " (已固定)";
    }
    tabElement.title = tooltip;

    // 添加点击事件
    tabElement.addEventListener('click', (e) => {
      console.log(`🖱️ 标签点击事件触发: ${tab.title} (ID: ${tab.blockId})`);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      this.log(`🖱️ 点击标签: ${tab.title} (ID: ${tab.blockId})`);
      
      // 移除其他标签的聚焦状态
      const allTabs = this.tabContainer?.querySelectorAll('.orca-tab');
      allTabs?.forEach(t => t.removeAttribute('data-focused'));
      
      // 设置当前标签为聚焦状态
      tabElement.setAttribute('data-focused', 'true');
      
      // 普通点击切换标签
      this.switchToTab(tab);
    });
    
    // 添加mousedown事件用于调试
    tabElement.addEventListener('mousedown', (e) => {
      console.log(`🖱️ 标签mousedown事件触发: ${tab.title} (ID: ${tab.blockId})`);
    });

    // 添加双击事件切换固定状态
    tabElement.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.toggleTabPinStatus(tab);
    });

    // 添加中键点击事件
    tabElement.addEventListener('auxclick', (e) => {
      if (e.button === 1) { // 中键
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.closeTab(tab);
      }
    });

    // 添加键盘快捷键支持
    tabElement.addEventListener('keydown', (e) => {
      if (e.target === tabElement || tabElement.contains(e.target as Node)) {
        if (e.key === 'F2') {
      e.preventDefault();
      e.stopPropagation();
          this.renameTab(tab);
        } else if (e.ctrlKey && e.key === 'p') {
          e.preventDefault();
          e.stopPropagation();
          this.toggleTabPinStatus(tab);
        } else if (e.ctrlKey && e.key === 'w') {
          e.preventDefault();
          e.stopPropagation();
          this.closeTab(tab);
        }
      }
    });

    // 添加右键菜单事件（使用Orca原生ContextMenu）
    this.addOrcaContextMenu(tabElement, tab);

    // 添加标签拖拽排序功能
    tabElement.draggable = true;
    
    // 拖拽开始事件（优化版）
    tabElement.addEventListener('dragstart', (e) => {
      // 检查是否在侧边栏拖拽区域，如果是则不处理标签拖拽
      const target = e.target as HTMLElement;
      if (target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
        e.preventDefault();
        return;
      }
      
      e.dataTransfer!.effectAllowed = 'move'; // 声明拖拽类型为"移动"
      e.dataTransfer?.setData('text/plain', tab.blockId);
      
      // 记录当前被拖拽的标签
      this.draggingTab = tab;
      this.lastSwapTarget = null; // 重置上次交换目标
      
      // 设置拖拽视觉反馈
      tabElement.setAttribute('data-dragging', 'true');
      tabElement.classList.add('dragging');
      
      // 设置容器拖拽状态
      if (this.tabContainer) {
        this.tabContainer.setAttribute('data-dragging', 'true');
      }
      
    });

    // 拖拽结束事件（修复版）
    tabElement.addEventListener('dragend', (e) => {
      // 清除所有拖拽状态
      this.draggingTab = null;
      this.lastSwapTarget = null;
      
      // 清除所有拖拽相关的定时器
      if (this.swapDebounceTimer) {
        clearTimeout(this.swapDebounceTimer);
        this.swapDebounceTimer = null;
      }
      if (this.dragOverTimer) {
        clearTimeout(this.dragOverTimer);
        this.dragOverTimer = null;
      }
      
      // 清除视觉反馈
      this.clearDragVisualFeedback();
      
      // 拖拽结束后更新UI
      setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 50);
      
      this.log(`🔄 结束拖拽标签: ${tab.title}`);
    });

    // 拖拽经过事件（修复版）
    tabElement.addEventListener('dragover', (e) => {
      // 检查是否在侧边栏拖拽区域，如果是则不处理标签拖拽
      const target = e.target as HTMLElement;
      if (target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
        return;
      }
      
      if (this.draggingTab && this.draggingTab.blockId !== tab.blockId) {
        e.preventDefault(); // 允许放置（必须调用，否则无法触发后续逻辑）
        e.dataTransfer!.dropEffect = 'move';
        
        // 添加拖拽悬停效果
        this.addDragOverEffect(tabElement);
        
        // 调用交换函数（已优化防抖）
        this.debouncedSwapTab(tab, this.draggingTab);
      }
    });

    // 拖拽进入事件
    tabElement.addEventListener('dragenter', (e) => {
      // 检查是否在侧边栏拖拽区域，如果是则不处理标签拖拽
      const target = e.target as HTMLElement;
      if (target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
        return;
      }
      
      if (this.draggingTab && this.draggingTab.blockId !== tab.blockId) {
        e.preventDefault();
        // 添加拖拽悬停效果
        this.addDragOverEffect(tabElement);
      }
    });

    // 拖拽离开事件
    tabElement.addEventListener('dragleave', (e) => {
      // 检查是否真的离开了元素（而不是进入子元素）
      const rect = tabElement.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        // 移除拖拽悬停效果
        this.removeDragOverEffect(tabElement);
      }
    });

    // 拖拽放置事件（保留作为备用）
    tabElement.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedBlockId = e.dataTransfer?.getData('text/plain');
      this.log(`🔄 拖拽放置: ${draggedBlockId} -> ${tab.blockId}`);
      // 这个事件现在主要用于调试，实际交换逻辑在dragover中处理
    });

    // 添加悬停效果
    tabElement.addEventListener('mouseenter', () => {
      tabElement.style.transform = 'scale(1.05)';
      tabElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    });

    tabElement.addEventListener('mouseleave', () => {
      tabElement.style.transform = 'scale(1)';
      tabElement.style.boxShadow = 'none';
    });

    return tabElement;
  }

  hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(200, 200, 200, ${alpha})`;
  }

  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      
      // 计算相对亮度 (WCAG 标准)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // 如果背景较暗，使用白色文字；如果背景较亮，使用深色文字
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
    return '#333333';
  }

  /**
   * 加深颜色
   */
  darkenColor(hex: string, factor: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      let r = parseInt(result[1], 16);
      let g = parseInt(result[2], 16);
      let b = parseInt(result[3], 16);
      
      // 按比例减少RGB值来加深颜色
      r = Math.floor(r * (1 - factor));
      g = Math.floor(g * (1 - factor));
      b = Math.floor(b * (1 - factor));
      
      // 转换回十六进制
      const rHex = r.toString(16).padStart(2, '0');
      const gHex = g.toString(16).padStart(2, '0');
      const bHex = b.toString(16).padStart(2, '0');
      
      return `#${rHex}${gHex}${bHex}`;
    }
    return hex; // 如果解析失败，返回原颜色
  }

  /**
   * RGB转OKLCH颜色空间
   */
  private rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
    // 将RGB转换为线性RGB
    const linearR = r / 255;
    const linearG = g / 255;
    const linearB = b / 255;

    // 应用sRGB到线性RGB的转换
    const srgbToLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    
    const rLinear = srgbToLinear(linearR);
    const gLinear = srgbToLinear(linearG);
    const bLinear = srgbToLinear(linearB);

    // 转换为XYZ颜色空间
    const x = rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375;
    const y = rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750;
    const z = rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041;

    // 转换为OKLCH
    const l = 0.2104542553 * x + 0.7936177850 * y - 0.0040720468 * z;
    const m = 1.9779984951 * x - 2.4285922050 * y + 0.4505937099 * z;
    const s = 0.0259040371 * x + 0.7827717662 * y - 0.8086757660 * z;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const l_oklch = 0.2104542553 * l_ + 0.7936177850 * m_ + 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const b_oklch = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    const c = Math.sqrt(a * a + b_oklch * b_oklch);
    const h = Math.atan2(b_oklch, a) * 180 / Math.PI;
    const h_normalized = h < 0 ? h + 360 : h;

    return { l: l_oklch, c, h: h_normalized };
  }

  /**
   * OKLCH转RGB颜色空间
   */
  private oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
    const h_rad = h * Math.PI / 180;
    const a = c * Math.cos(h_rad);
    const b_oklch = c * Math.sin(h_rad);

    const l_ = l;
    const m_ = a;
    const s_ = b_oklch;

    const l_cubed = l_ * l_ * l_;
    const m_cubed = m_ * m_ * m_;
    const s_cubed = s_ * s_ * s_;

    const x = 1.0478112 * l_cubed + 0.0228866 * m_cubed - 0.0502170 * s_cubed;
    const y = 0.0295424 * l_cubed + 0.9904844 * m_cubed + 0.0170491 * s_cubed;
    const z = -0.0092345 * l_cubed + 0.0150436 * m_cubed + 0.7521316 * s_cubed;

    const rLinear = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    const gLinear = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
    const bLinear = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

    const linearToSrgb = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1/2.4) - 0.055;

    const r = Math.max(0, Math.min(255, Math.round(linearToSrgb(rLinear) * 255)));
    const g = Math.max(0, Math.min(255, Math.round(linearToSrgb(gLinear) * 255)));
    const b = Math.max(0, Math.min(255, Math.round(linearToSrgb(bLinear) * 255)));

    return { r, g, b };
  }

  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  private applyOklchFormula(hex: string, type: 'text' | 'background'): string {
    // 使用Orca API检查是否为暗色模式
    const isDarkMode = orca.state.themeMode === 'dark';
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    if (type === 'text') {
      // 文字颜色：根据模式调整对比度
      const brightness = (r + g + b) / 3;
      
      if (isDarkMode) {
        // 暗色模式：增亮文字
        if (brightness < 80) {
          // 暗色：适度增亮
          const factor = 1.6;
          const newR = Math.min(255, Math.round(r * factor));
          const newG = Math.min(255, Math.round(g * factor));
          const newB = Math.min(255, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else if (brightness < 150) {
          // 中等亮度：轻微增亮
          const factor = 1.3;
          const newR = Math.min(255, Math.round(r * factor));
          const newG = Math.min(255, Math.round(g * factor));
          const newB = Math.min(255, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else {
          // 亮色：保持原色或轻微增亮
          const factor = 1.1;
          const newR = Math.min(255, Math.round(r * factor));
          const newG = Math.min(255, Math.round(g * factor));
          const newB = Math.min(255, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        }
      } else {
        // 亮色模式：变暗文字以提高对比度
        if (brightness > 200) {
          // 很亮的颜色：大幅变暗
          const factor = 0.4;
          const newR = Math.max(0, Math.round(r * factor));
          const newG = Math.max(0, Math.round(g * factor));
          const newB = Math.max(0, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else if (brightness > 150) {
          // 中等亮度：适度变暗
          const factor = 0.6;
          const newR = Math.max(0, Math.round(r * factor));
          const newG = Math.max(0, Math.round(g * factor));
          const newB = Math.max(0, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else {
          // 暗色：轻微变暗
          const factor = 0.8;
          const newR = Math.max(0, Math.round(r * factor));
          const newG = Math.max(0, Math.round(g * factor));
          const newB = Math.max(0, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        }
      }
    } else {
      // 背景颜色：根据模式调整透明度
      if (isDarkMode) {
        return this.hexToRgba(hex, 0.25);
      } else {
        return this.hexToRgba(hex, 0.35);
      }
    }
  }

  async switchToTab(tab: TabInfo) {
    try {
      this.log(`🔄 开始切换标签: ${tab.title} (ID: ${tab.blockId})`);
      
      // 记录当前激活标签的滚动位置
      const currentActiveTab = this.getCurrentActiveTab();
      if (currentActiveTab && currentActiveTab.blockId !== tab.blockId) {
        this.recordScrollPosition(currentActiveTab);
        // 记录当前激活的标签ID，用于后续新标签的插入位置
        this.lastActiveBlockId = currentActiveTab.blockId;
        this.log(`🎯 记录切换前的激活标签: ${currentActiveTab.title} (ID: ${currentActiveTab.blockId})`);
      }
      
      // 根据当前面板索引决定在哪个面板打开
      const targetPanelId = this.panelIds[this.currentPanelIndex];
      this.log(`🎯 目标面板ID: ${targetPanelId}, 当前面板索引: ${this.currentPanelIndex}`);
      
      // 使用更安全的导航方式
      try {
        if (tab.isJournal) {
          // 日期块使用journal导航方式
          console.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${tab.blockId}, 标题: ${tab.title}`);
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${tab.blockId}`);
          
          // 从标签标题中提取日期信息
          let targetDate: Date | null = null;
          
          // 检查相对日期，使用 Orca 原生命令
          console.log(`🔍 检查日期块标题: ${tab.title}`);
          if (tab.title.includes('今天') || tab.title.includes('Today')) {
            console.log(`📅 使用原生命令跳转到今天`);
            try {
              await orca.commands.invokeCommand('core.goToday');
              console.log(`✅ 今天导航成功`);
              return; // 直接返回，不需要后续处理
            } catch (e) {
              console.log(`❌ 今天导航失败:`, e);
              // 如果原生命令失败，回退到日期格式
              targetDate = new Date();
              console.log(`📅 回退到日期格式: ${targetDate.toISOString()}`);
            }
          } else if (tab.title.includes('昨天') || tab.title.includes('Yesterday')) {
            console.log(`📅 使用原生命令跳转到昨天`);
            try {
              await orca.commands.invokeCommand('core.goYesterday');
              console.log(`✅ 昨天导航成功`);
              return; // 直接返回，不需要后续处理
            } catch (e) {
              console.log(`❌ 昨天导航失败:`, e);
              // 如果原生命令失败，回退到日期格式
              targetDate = new Date();
              targetDate.setDate(targetDate.getDate() - 1);
              console.log(`📅 回退到日期格式: ${targetDate.toISOString()}`);
            }
          } else if (tab.title.includes('明天') || tab.title.includes('Tomorrow')) {
            console.log(`📅 使用原生命令跳转到明天`);
            try {
              await orca.commands.invokeCommand('core.goTomorrow');
              console.log(`✅ 明天导航成功`);
              return; // 直接返回，不需要后续处理
            } catch (e) {
              console.log(`❌ 明天导航失败:`, e);
              // 如果原生命令失败，回退到日期格式
              targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + 1);
              console.log(`📅 回退到日期格式: ${targetDate.toISOString()}`);
            }
          } else {
            // 尝试从标题中提取日期
            const dateMatch = tab.title.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
              const dateStr = dateMatch[1];
              targetDate = new Date(dateStr + 'T00:00:00.000Z'); // 确保是UTC时间
              if (isNaN(targetDate.getTime())) {
                console.log(`❌ 无效的日期格式: ${dateStr}`);
                targetDate = null;
              } else {
                console.log(`📅 从标题提取日期: ${dateStr} -> ${targetDate.toISOString()}`);
              }
            } else {
              // 尝试从块信息中获取原始日期
              console.log(`🔍 尝试从块信息中获取原始日期: ${tab.blockId}`);
              try {
                const block = await orca.invokeBackend("get-block", parseInt(tab.blockId));
                if (block) {
                  const journalInfo = this.extractJournalInfo(block);
                  if (journalInfo && !isNaN(journalInfo.getTime())) {
                    targetDate = journalInfo;
                    console.log(`📅 从块信息获取日期: ${journalInfo.toISOString()}`);
                  } else {
                    console.log(`❌ 块信息中未找到有效日期信息`);
                  }
                } else {
                  console.log(`❌ 无法获取块信息`);
                }
              } catch (e) {
                console.log(`❌ 获取块信息失败:`, e);
                this.warn("无法获取块信息:", e);
              }
            }
          }
          
          if (targetDate) {
            console.log(`📅 使用日期导航: ${targetDate.toISOString().split('T')[0]}`);
            this.log(`📅 使用日期导航: ${targetDate.toISOString().split('T')[0]}`);
            try {
              // 确保日期是有效的
              if (isNaN(targetDate.getTime())) {
                throw new Error("Invalid date");
              }
              
              // 使用简单的 Date 对象格式
              console.log(`📅 使用简单日期格式: ${targetDate.toISOString()}`);
              await orca.nav.goTo("journal", { date: targetDate }, targetPanelId);
              console.log(`✅ 日期导航成功`);
            } catch (e) {
              console.log(`❌ 日期导航失败:`, e);
              // 如果简单格式失败，尝试 Orca 格式
              try {
                console.log(`🔄 尝试 Orca 日期格式`);
                const journalDate = {
                  t: 2, // 2 for full/absolute date
                  v: targetDate.getTime() // 使用时间戳
                };
                console.log(`📅 使用 Orca 日期格式:`, journalDate);
                await orca.nav.goTo("journal", { date: journalDate }, targetPanelId);
                console.log(`✅ Orca 日期导航成功`);
              } catch (e2) {
                console.log(`❌ Orca 日期导航也失败:`, e2);
                throw e2;
              }
            }
          } else {
            // 如果没有找到日期，尝试使用块ID
            console.log(`⚠️ 未找到日期信息，尝试使用块ID导航`);
            this.log(`⚠️ 未找到日期信息，尝试使用块ID导航`);
            try {
              await orca.nav.goTo("block", { blockId: parseInt(tab.blockId) }, targetPanelId);
              console.log(`✅ 块ID导航成功`);
            } catch (e) {
              console.log(`❌ 块ID导航失败:`, e);
              throw e;
            }
          }
        } else {
          // 普通块使用block导航方式
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${tab.blockId}`);
          await orca.nav.goTo("block", { blockId: parseInt(tab.blockId) }, targetPanelId);
        }
        this.log(`✅ orca.nav.goTo 导航成功`);
      } catch (navError) {
        this.warn("导航失败，尝试备用方法:", navError);
        // 备用方法：直接点击块引用
        const blockElement = document.querySelector(`[data-block-id="${tab.blockId}"]`);
        if (blockElement) {
          this.log(`🔄 使用备用方法点击块元素: ${tab.blockId}`);
          (blockElement as HTMLElement).click();
        } else {
          this.error("无法找到目标块元素:", tab.blockId);
          // 尝试其他选择器
          const altElement = document.querySelector(`[data-block-id="${tab.blockId}"]`) || 
                           document.querySelector(`#block-${tab.blockId}`) ||
                           document.querySelector(`.block-${tab.blockId}`);
          if (altElement) {
            this.log(`🔄 找到备用块元素，尝试点击`);
            (altElement as HTMLElement).click();
          } else {
            this.error("完全无法找到目标块元素");
          }
        }
      }
      
      // 更新当前激活的标签ID
      this.lastActiveBlockId = tab.blockId;
      this.log(`🔄 切换到标签: ${tab.title} (面板 ${this.currentPanelIndex + 1})`);
      
      // 恢复目标标签的滚动位置
      this.restoreScrollPosition(tab);
      
      // 调试信息
      setTimeout(() => {
        this.debugScrollPosition(tab);
      }, 500);
    } catch (e) {
      this.error("切换标签失败:", e);
    }
  }

  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(tab: TabInfo): boolean {
    const firstPanelId = this.panelIds[0];
    const firstPanel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!firstPanel) return false;
    
    // 获取当前激活的块编辑器
    const activeBlockEditor = firstPanel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) return false;
    
    const activeBlockId = activeBlockEditor.getAttribute('data-block-id');
    return activeBlockId === tab.blockId;
  }

  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(closedTab: TabInfo) {
    const currentIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === closedTab.blockId);
    if (currentIndex === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    
    let targetIndex = -1;
    
    // 根据位置决定切换到哪个相邻标签
    if (currentIndex === 0) {
      // 最左边：切换到右边
      targetIndex = 1;
    } else if (currentIndex === this.firstPanelTabs.length - 1) {
      // 最右边：切换到左边
      targetIndex = currentIndex - 1;
    } else {
      // 中间：优先切换到右边
      targetIndex = currentIndex + 1;
    }
    
    // 检查目标索引是否有效
    if (targetIndex >= 0 && targetIndex < this.firstPanelTabs.length) {
      const targetTab = this.firstPanelTabs[targetIndex];
      this.log(`🔄 自动切换到相邻标签: "${targetTab.title}" (位置: ${targetIndex})`);
      
      // 导航到目标标签页（在第一个面板中打开）
      const firstPanelId = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(targetTab.blockId) }, firstPanelId);
    } else {
      this.log("没有可切换的相邻标签页");
    }
  }

  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(tab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持固定功能
    
    const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex !== -1) {
      // 切换固定状态
      this.firstPanelTabs[tabIndex].isPinned = !this.firstPanelTabs[tabIndex].isPinned;
      
      // 重新排序
      this.sortTabsByPinStatus();
      
      // 更新UI和保存数据
      this.debouncedUpdateTabsUI();
      await this.saveFirstPanelTabs();
      
      const status = this.firstPanelTabs[tabIndex].isPinned ? '固定' : '取消固定';
      this.log(`📌 标签 "${tab.title}" 已${status}`);
    }
  }


  /**
   * 注册插件设置
   */
  private async registerPluginSettings() {
    try {
      const settingsSchema = {
        homePageBlockId: {
          label: "主页块ID",
          type: "string" as const,
          defaultValue: "",
          description: "新建标签页时将导航到此块ID"
        },
        showBlockTypeIcons: {
          label: "显示块类型图标",
          type: "boolean" as const,
          defaultValue: true,
          description: "控制标签页顶部是否显示块类型图标按钮"
        },
      };

      await orca.plugins.setSettingsSchema("orca-tabs-plugin", settingsSchema);
      
      // 读取设置值
      const settings = orca.state.plugins["orca-tabs-plugin"]?.settings;
      
      if (settings?.homePageBlockId) {
        this.homePageBlockId = settings.homePageBlockId;
        this.log(`🏠 主页块ID: ${this.homePageBlockId}`);
      }
      
      if (settings?.showBlockTypeIcons !== undefined) {
        this.showBlockTypeIcons = settings.showBlockTypeIcons;
        this.log(`🎨 块类型图标显示: ${this.showBlockTypeIcons ? '开启' : '关闭'}`);
      }
      
      this.log("✅ 插件设置已注册");
    } catch (error) {
      this.error("注册插件设置失败:", error);
    }
  }

  /**
   * 注册块菜单命令
   */
  private registerBlockMenuCommands() {
    try {
      // 注册"在新标签页打开"命令
      orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.openInNewTab", {
        worksOnMultipleBlocks: false,
        render: (blockId, rootBlockId, close) => {
          const React = (window as any).React;
          if (!React || !orca.components.MenuText) {
            return null;
          }

          return React.createElement(orca.components.MenuText, {
            title: "在新标签页打开",
            preIcon: "ti ti-external-link",
            onClick: () => {
              close();
              this.openInNewTab(blockId.toString());
            }
          });
        }
      });

      this.log("✅ 已注册块菜单命令: 在新标签页打开");
    } catch (error) {
      this.error("注册块菜单命令失败:", error);
    }
  }

  /**
   * 创建新标签页
   */
  async createNewTab() {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持此功能
    
    try {
      
      // 使用设置的主页块ID，如果没有设置则默认为1
      const newBlockId = (this.homePageBlockId && this.homePageBlockId.trim()) ? this.homePageBlockId : "1";
      const tabTitle = (this.homePageBlockId && this.homePageBlockId.trim()) ? "🏠 主页" : "📄 新标签页";
      
      this.log(`🆕 创建新标签页，使用块ID: ${newBlockId}`);
      
      // 创建标签信息
      const tabInfo: TabInfo = {
        blockId: newBlockId,
        panelId: this.panelIds[0],
        title: tabTitle,
        isPinned: false,
        order: this.firstPanelTabs.length
      };
      
      this.log(`📋 新标签页信息: "${tabInfo.title}" (ID: ${newBlockId})`);
      
      // 获取当前聚焦的标签
      const focusedTab = this.getCurrentActiveTab();
      let insertIndex = this.firstPanelTabs.length; // 默认插入到末尾
      
      if (focusedTab) {
        // 找到聚焦标签的索引，在其后面插入新标签
        const focusedIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === focusedTab.blockId);
        if (focusedIndex !== -1) {
          insertIndex = focusedIndex + 1; // 在聚焦标签后面插入
          this.log(`🎯 将在聚焦标签 "${focusedTab.title}" 后面插入新标签: "${tabInfo.title}"`);
        }
      } else {
        this.log(`🎯 没有聚焦标签，将添加到末尾`);
      }
      
      // 处理标签数量限制
      if (this.firstPanelTabs.length >= this.maxTabs) {
        // 达到上限，在指定位置插入新标签，然后删除最后一个非固定标签
        this.firstPanelTabs.splice(insertIndex, 0, tabInfo);
        this.verboseLog(`➕ 在位置 ${insertIndex} 插入新标签: ${tabInfo.title}`);
        
        // 删除最后一个非固定标签来保持数量限制
        const lastNonPinnedIndex = this.findLastNonPinnedTabIndex();
        if (lastNonPinnedIndex !== -1) {
          const removedTab = this.firstPanelTabs[lastNonPinnedIndex];
          this.firstPanelTabs.splice(lastNonPinnedIndex, 1);
          this.log(`🗑️ 删除末尾的非固定标签: "${removedTab.title}" 来保持数量限制`);
        } else {
          // 如果所有标签都是固定的，删除刚插入的新标签
          const newTabIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === tabInfo.blockId);
          if (newTabIndex !== -1) {
            this.firstPanelTabs.splice(newTabIndex, 1);
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${tabInfo.title}"`);
            return;
          }
        }
      } else {
        // 未达到上限，在指定位置插入新标签
        this.firstPanelTabs.splice(insertIndex, 0, tabInfo);
        this.verboseLog(`➕ 在位置 ${insertIndex} 插入新标签: ${tabInfo.title}`);
      }
      
      // 保存标签数据
      await this.saveFirstPanelTabs();
      
      // 更新UI
      await this.updateTabsUI();
      
      // 导航到目标块
      const firstPanelId = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(newBlockId) }, firstPanelId);
      this.log(`🔄 导航到块: ${newBlockId}`);
      
      // 成功提示已移除
      
      this.log(`✅ 成功创建新标签页: "${tabInfo.title}"`);
    } catch (error) {
      this.error("创建新标签页时出错:", error);
      // 错误提示已移除
    }
  }

  /**
   * 生成趣味性内容
   */
  private generateFunContent(): string {
    const funContents = [
      "🌟 欢迎来到新标签页！开始您的创作之旅吧～",
      "✨ 这是一个全新的开始，让想法自由流淌...",
      "🎨 空白画布等待您的灵感，开始创作吧！",
      "💡 新的一天，新的想法，从这里开始记录...",
      "🚀 准备好探索新的知识领域了吗？",
      "📝 让文字在这里自由舞蹈，记录生活的美好",
      "🎯 专注当下，记录此刻的思考与感悟",
      "🌈 每个新标签页都是一个新的可能性",
      "💫 在这里，让创意无限延伸...",
      "🎪 欢迎来到您的个人知识舞台！"
    ];
    
    const randomIndex = Math.floor(Math.random() * funContents.length);
    return funContents[randomIndex];
  }

  /**
   * 设置块内容
   */
  private async setBlockContent(blockId: string, content: string): Promise<void> {
    try {
      // 使用后端API来更新块内容
      await orca.invokeBackend("set-block-content", parseInt(blockId), [{ t: "t", v: content }]);
      this.log(`📝 已为新块 ${blockId} 设置内容: "${content}"`);
    } catch (error) {
      this.warn("设置块内容失败，尝试备用方法:", error);
      // 备用方法：直接更新块对象
      try {
        const block = await orca.invokeBackend("get-block", parseInt(blockId));
        if (block) {
          // 这里我们暂时跳过内容设置，让用户手动编辑
          this.log(`📝 跳过自动内容设置，用户可手动编辑块 ${blockId}`);
        }
      } catch (backupError) {
        this.warn("备用方法也失败:", backupError);
      }
    }
  }

  /**
   * 通用的标签添加方法
   */
  private async addTabToPanel(blockId: string, insertMode: 'replace' | 'after' | 'end', navigate: boolean = false): Promise<boolean> {
    if (this.currentPanelIndex !== 0) return false; // 只有第一个面板支持此功能
    
    try {
      // 检查块是否已经存在于标签页中
      const existingTab = this.firstPanelTabs.find(tab => tab.blockId === blockId);
      if (existingTab) {
        this.log(`📋 块 ${blockId} 已存在于标签页中`);
        if (navigate) {
          // 如果需要导航且已存在，直接跳转
          const firstPanelId = this.panelIds[0];
          await orca.nav.goTo("block", { blockId: parseInt(blockId) }, firstPanelId);
          // 提示已移除
        } else {
          // 提示已移除
        }
        return true;
      }

      // 获取块信息
      const block = orca.state.blocks[parseInt(blockId)];
      if (!block) {
        this.warn(`无法找到块 ${blockId}`);
        // 错误提示已移除
        return false;
      }

      // 使用getTabInfo方法获取完整的标签信息（包括块类型和图标）
      const tabInfo = await this.getTabInfo(blockId, this.panelIds[0], this.firstPanelTabs.length);
      if (!tabInfo) {
        this.warn(`无法获取块 ${blockId} 的标签信息`);
        return false;
      }

      // 确定插入位置
      let insertIndex = this.firstPanelTabs.length; // 默认插入到末尾
      let shouldReplace = false;

      if (insertMode === 'replace') {
        // 替换模式：获取聚焦标签并替换
        const focusedTab = this.getCurrentActiveTab();
        if (!focusedTab) {
          this.warn("没有找到当前聚焦的标签");
          // 警告提示已移除
          return false;
        }
        
        const focusedIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === focusedTab.blockId);
        if (focusedIndex === -1) {
          this.warn("无法找到聚焦标签在数组中的位置");
          // 错误提示已移除
          return false;
        }
        
        // 检查聚焦的标签是否是固定标签
        if (focusedTab.isPinned) {
          // 如果是固定标签，拒绝替换操作，改为在其后面插入
          this.log(`📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入`);
          insertIndex = focusedIndex + 1;
          shouldReplace = false;
        } else {
          // 如果不是固定标签，可以替换
          insertIndex = focusedIndex;
          shouldReplace = true;
        }
      } else if (insertMode === 'after') {
        // 在聚焦标签后面插入
        const focusedTab = this.getCurrentActiveTab();
        if (focusedTab) {
          const focusedIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === focusedTab.blockId);
          if (focusedIndex !== -1) {
            // 直接在聚焦标签后面插入
            insertIndex = focusedIndex + 1;
            this.log(`📌 在聚焦标签后面插入新标签`);
          }
        }
      }
      // 'end' 模式使用默认的末尾插入

      // 处理标签数量限制和插入逻辑
      if (this.firstPanelTabs.length >= this.maxTabs) {
        if (shouldReplace) {
          // 直接替换
          this.firstPanelTabs[insertIndex] = tabInfo;
        } else {
          // 插入新标签，然后删除最后一个非固定标签
          this.firstPanelTabs.splice(insertIndex, 0, tabInfo);
          const lastNonPinnedIndex = this.findLastNonPinnedTabIndex();
          if (lastNonPinnedIndex !== -1) {
            this.firstPanelTabs.splice(lastNonPinnedIndex, 1);
          } else {
            // 如果所有标签都是固定的，删除刚插入的新标签
            const newTabIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === tabInfo.blockId);
            if (newTabIndex !== -1) {
              this.firstPanelTabs.splice(newTabIndex, 1);
              // 警告提示已移除
              return false;
            }
          }
        }
      } else {
        if (shouldReplace) {
          this.firstPanelTabs[insertIndex] = tabInfo;
        } else {
          this.firstPanelTabs.splice(insertIndex, 0, tabInfo);
        }
      }

      // 保存标签数据
      await this.saveFirstPanelTabs();

      // 更新UI
      await this.updateTabsUI();

      // 导航（如果需要）
      if (navigate) {
        const firstPanelId = this.panelIds[0];
        await orca.nav.goTo("block", { blockId: parseInt(blockId) }, firstPanelId);
      }

      // 成功提示已移除

      return true;
    } catch (error) {
      this.error(`添加标签页时出错:`, error);
      // 错误提示已移除
      return false;
    }
  }

  /**
   * 将指定块添加到标签页中，替换当前聚焦标签
   */
  async createBlockAfterFocused(blockId: string) {
    await this.addTabToPanel(blockId, 'replace', false);
  }

  /**
   * 在后台新建标签页打开指定块（在聚焦标签后面插入新标签但不跳转）
   */
  async openInNewTab(blockId: string) {
    await this.addTabToPanel(blockId, 'after', false);
  }


  /**
   * 从DOM元素中获取块引用的ID
   */
  private getBlockRefId(element: HTMLElement): string | null {
    try {
      // 遍历当前元素及其父元素，寻找块引用标识
      let current: HTMLElement | null = element;
      
      while (current && current !== document.body) {
        // 检查常见的块引用类名和属性
        const classList = current.classList;
        
        // 检查是否有块引用相关的类名
        if (classList.contains('orca-ref') || 
            classList.contains('block-ref') || 
            classList.contains('block-reference') ||
            classList.contains('orca-fragment-r') ||
            classList.contains('fragment-r') ||
            classList.contains('orca-block-reference') ||
            current.tagName.toLowerCase() === 'a' && current.getAttribute('href')?.startsWith('#')) {
          
          // 尝试从不同的属性中获取块ID
          const blockId = current.getAttribute('data-block-id') ||
                          current.getAttribute('data-ref-id') ||
                          current.getAttribute('data-blockid') ||
                          current.getAttribute('data-target-block-id') ||
                          current.getAttribute('data-fragment-v') ||
                          current.getAttribute('data-v') ||
                          current.getAttribute('href')?.replace('#', '') ||
                          current.getAttribute('data-id');
          
          if (blockId && !isNaN(parseInt(blockId))) {
            this.log(`🔗 从元素中提取到块引用ID: ${blockId}`);
            return blockId;
          }
        }
        
        // 检查内联样式或其他可能的标识
        const dataAttrs = current.dataset;
        for (const [key, value] of Object.entries(dataAttrs)) {
          if ((key.toLowerCase().includes('block') || key.toLowerCase().includes('ref')) && 
              value && !isNaN(parseInt(value))) {
            this.log(`🔗 从data属性 ${key} 中提取到块引用ID: ${value}`);
            return value;
          }
        }
        
        // 继续向上查找父元素
        current = current.parentElement;
      }
      
      // 如果没有找到明确的块引用标识，尝试从文本内容中解析
      if (element.textContent) {
        const text = element.textContent.trim();
        // 匹配 [[块ID]] 或类似的格式
        const blockRefMatch = text.match(/\[\[(?:块)?(\d+)\]\]/) || text.match(/block[:\s]*(\d+)/i);
        if (blockRefMatch && blockRefMatch[1]) {
          this.log(`🔗 从文本内容中解析到块引用ID: ${blockRefMatch[1]}`);
          return blockRefMatch[1];
        }
      }
      
      this.log(`🔗 未能从元素中提取块引用ID`);
      return null;
    } catch (error) {
      this.error("获取块引用ID时出错:", error);
      return null;
    }
  }

  /**
   * 获取当前光标位置的块ID
   */
  private getCurrentCursorBlockId(): string | null {
    try {
      // 获取当前选择
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        this.log("🔍 无法获取当前选择");
        return null;
      }

      // 使用 Orca 工具转换为 CursorData
      const cursorData = orca.utils.getCursorDataFromSelection(selection);
      if (!cursorData) {
        this.log("🔍 无法从选择转换为 CursorData");
        return null;
      }

      // 返回光标锚点位置的块ID
      const blockId = cursorData.anchor.blockId.toString();
      this.log(`🔍 获取到当前光标块ID: ${blockId}`);
      return blockId;
    } catch (error) {
      this.error("获取当前光标块ID时出错:", error);
      return null;
    }
  }

  /**
   * 增强块引用的右键菜单，添加标签页相关选项
   */
  private enhanceBlockRefContextMenu(blockRefId: string) {
    try {
      // 查找当前显示的上下文菜单
      const contextMenus = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let targetMenu: HTMLElement | null = null;
      
      // 找到最新显示的菜单（通常是最后一个）
      for (let i = contextMenus.length - 1; i >= 0; i--) {
        const menu = contextMenus[i] as HTMLElement;
        if (menu.offsetParent !== null && getComputedStyle(menu).display !== 'none') {
          targetMenu = menu;
          break;
        }
      }
      
      if (!targetMenu) {
        this.log("🔗 未找到显示的右键菜单");
        return;
      }
      
      // 检查是否已经添加过我们的选项
      if (targetMenu.querySelector('.orca-tabs-ref-menu-item')) {
        this.log("🔗 块引用菜单项已存在");
        return;
      }
      
      this.log(`🔗 为块引用 ${blockRefId} 添加菜单项`);
      
      // 创建分隔符（如果需要）
      const existingItems = targetMenu.querySelectorAll('[role="menuitem"], .menu-item');
      if (existingItems.length > 0) {
        const separator = document.createElement('div');
        separator.className = 'orca-tabs-ref-menu-separator';
        separator.style.cssText = `
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 4px 8px;
        `;
        targetMenu.appendChild(separator);
      }
      
        // "在新标签页打开"选项已移除
      
      this.log(`✅ 成功为块引用 ${blockRefId} 添加菜单项`);
    } catch (error) {
      this.error("增强块引用右键菜单时出错:", error);
    }
  }

  /**
   * 创建上下文菜单项
   */
  private createContextMenuItem(title: string, icon: string, shortcut: string, onClick: () => void): HTMLElement {
    const item = document.createElement('div');
    item.className = 'orca-tabs-ref-menu-item';
    item.setAttribute('role', 'menuitem');
    item.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease;
      font-size: 14px;
      line-height: 1.4;
    `;
    
    // 图标
    const iconElement = document.createElement('i');
    iconElement.className = icon;
    iconElement.style.cssText = `
      margin-right: 8px;
      font-size: 16px;
      width: 16px;
      text-align: center;
      color: #666;
    `;
    
    // 标题
    const titleElement = document.createElement('span');
    titleElement.textContent = title;
    titleElement.style.cssText = `
      flex: 1;
      color: #333;
    `;
    
    // 组装元素
    item.appendChild(iconElement);
    item.appendChild(titleElement);
    
    // 快捷键提示（仅当有快捷键时显示）
    if (shortcut && shortcut.trim() !== '') {
      const shortcutElement = document.createElement('span');
      shortcutElement.textContent = shortcut;
      shortcutElement.style.cssText = `
        font-size: 12px;
        color: #999;
        margin-left: 12px;
      `;
      item.appendChild(shortcutElement);
    }
    
    // 悬停效果
    item.addEventListener('mouseenter', () => {
      item.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.backgroundColor = 'transparent';
    });
    
    // 点击事件
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick();
      
      // 关闭菜单
      const menu = item.closest('.orca-context-menu, .context-menu, [role="menu"]') as HTMLElement;
      if (menu) {
        menu.style.display = 'none';
        menu.remove();
      }
    });
    
    return item;
  }

  /**
   * 记录当前标签的滚动位置
   */
  private async recordScrollPosition(tab: TabInfo) {
    try {
      // 使用Orca的viewState API来保存滚动位置
      const panelId = this.panelIds[this.currentPanelIndex];
      const panel = orca.nav.findViewPanel(panelId, orca.state.panels);
      
      if (panel && panel.viewState) {
        // 尝试多种方式找到滚动容器
        let scrollContainer: HTMLElement | null = null;
        
        // 方法1: 通过block元素查找
        const blockElement = document.querySelector(`.orca-block-editor[data-block-id="${tab.blockId}"]`);
        if (blockElement) {
          const panelElement = blockElement.closest('.orca-panel');
          if (panelElement) {
            scrollContainer = panelElement.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法2: 直接查找当前激活面板的滚动容器
        if (!scrollContainer) {
          const activePanel = document.querySelector('.orca-panel.active');
          if (activePanel) {
            scrollContainer = activePanel.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法3: 查找body或documentElement的滚动
        if (!scrollContainer) {
          scrollContainer = document.body.scrollTop > 0 ? document.body : document.documentElement;
        }
        
        if (scrollContainer) {
          const scrollPosition = {
            x: scrollContainer.scrollLeft || 0,
            y: scrollContainer.scrollTop || 0
          };
          
          // 保存到Orca的viewState中
          panel.viewState.scrollPosition = scrollPosition;
          
          // 同时保存到标签信息中作为备份
          const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
          if (tabIndex !== -1) {
            this.firstPanelTabs[tabIndex].scrollPosition = scrollPosition;
            await this.saveFirstPanelTabs();
          }
          
          this.log(`📝 记录标签 "${tab.title}" 滚动位置到viewState:`, scrollPosition, '容器:', scrollContainer.className);
        } else {
          this.warn(`未找到标签 "${tab.title}" 的滚动容器`);
        }
      } else {
        this.warn(`未找到面板 ${panelId} 或viewState`);
      }
    } catch (error) {
      this.warn('记录滚动位置时出错:', error);
    }
  }

  /**
   * 恢复标签的滚动位置
   */
  private restoreScrollPosition(tab: TabInfo) {
    try {
      // 优先从Orca的viewState中获取滚动位置
      let scrollPosition = null;
      
      // 方法1: 从viewState获取
      const panelId = this.panelIds[this.currentPanelIndex];
      const panel = orca.nav.findViewPanel(panelId, orca.state.panels);
      if (panel && panel.viewState && panel.viewState.scrollPosition) {
        scrollPosition = panel.viewState.scrollPosition;
        this.log(`🔄 从viewState恢复标签 "${tab.title}" 滚动位置:`, scrollPosition);
      }
      
      // 方法2: 从标签信息获取（备份）
      if (!scrollPosition && tab.scrollPosition) {
        scrollPosition = tab.scrollPosition;
        this.log(`🔄 从标签信息恢复标签 "${tab.title}" 滚动位置:`, scrollPosition);
      }
      
      if (!scrollPosition) return;
      
      // 多次尝试恢复，确保DOM已更新
      const attemptRestore = (attempt: number = 1) => {
        if (attempt > 5) {
          this.warn(`恢复标签 "${tab.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        
        // 尝试多种方式找到滚动容器
        let scrollContainer: HTMLElement | null = null;
        
        // 方法1: 通过block元素查找
        const blockElement = document.querySelector(`.orca-block-editor[data-block-id="${tab.blockId}"]`);
        if (blockElement) {
          const panelElement = blockElement.closest('.orca-panel');
          if (panelElement) {
            scrollContainer = panelElement.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法2: 直接查找当前激活面板的滚动容器
        if (!scrollContainer) {
          const activePanel = document.querySelector('.orca-panel.active');
          if (activePanel) {
            scrollContainer = activePanel.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法3: 查找body或documentElement的滚动
        if (!scrollContainer) {
          scrollContainer = document.body.scrollTop > 0 ? document.body : document.documentElement;
        }
        
        if (scrollContainer) {
          scrollContainer.scrollLeft = scrollPosition.x;
          scrollContainer.scrollTop = scrollPosition.y;
          this.log(`🔄 恢复标签 "${tab.title}" 滚动位置:`, scrollPosition, '容器:', scrollContainer.className, `尝试${attempt}`);
        } else {
          // 如果没找到容器，延迟重试
          setTimeout(() => attemptRestore(attempt + 1), 200 * attempt);
        }
      };
      
      // 立即尝试一次，然后延迟尝试
      attemptRestore();
      setTimeout(() => attemptRestore(2), 100);
      setTimeout(() => attemptRestore(3), 300);
    } catch (error) {
      this.warn('恢复滚动位置时出错:', error);
    }
  }

  /**
   * 调试滚动位置信息
   */
  private debugScrollPosition(tab: TabInfo) {
    this.log(`🔍 调试标签 "${tab.title}" 滚动位置:`);
    this.log('标签保存的滚动位置:', tab.scrollPosition);
    
    // 检查viewState中的滚动位置
    const panelId = this.panelIds[this.currentPanelIndex];
    const panel = orca.nav.findViewPanel(panelId, orca.state.panels);
    if (panel && panel.viewState) {
      this.log('viewState中的滚动位置:', panel.viewState.scrollPosition);
      this.log('完整viewState:', panel.viewState);
    } else {
      this.log('未找到viewState');
    }
    
    // 查找所有可能的滚动容器
    const containers = [
      '.orca-panel-content',
      '.orca-editor-content', 
      '.scroll-container',
      '.orca-scroll-container',
      '.orca-panel',
      'body',
      'html'
    ];
    
    containers.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        const element = el as HTMLElement;
        if (element.scrollTop > 0 || element.scrollLeft > 0) {
          this.log(`容器 ${selector}[${index}]:`, {
            scrollTop: element.scrollTop,
            scrollLeft: element.scrollLeft,
            className: element.className,
            id: element.id
          });
        }
      });
    });
  }

  /**
   * 检查标签是否为当前激活状态
   */
  private isTabActive(tab: TabInfo): boolean {
    try {
      // 获取第一个面板
      const firstPanelId = this.panelIds[0];
      const firstPanel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
      if (!firstPanel) return false;

      // 获取当前激活的块编辑器（可见的那个）
      const activeBlock = firstPanel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
      if (!activeBlock) return false;

      const activeBlockId = activeBlock.getAttribute('data-block-id');
      return activeBlockId === tab.blockId;
    } catch (error) {
      this.warn('检查标签激活状态时出错:', error);
      return false;
    }
  }

  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab(): TabInfo | null {
    if (this.currentPanelIndex !== 0) return null; // 只有第一个面板支持
    
    if (this.firstPanelTabs.length === 0) return null;
    
    // 获取第一个面板中当前激活的块编辑器
    const firstPanelId = this.panelIds[0];
    const panel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!panel) return null;
    
    const activeBlockEditor = panel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) return null;
    
    const blockId = activeBlockEditor.getAttribute('data-block-id');
    if (!blockId) return null;
    
    // 在固化标签中查找对应的标签
    return this.firstPanelTabs.find(tab => tab.blockId === blockId) || null;
  }

  /**
   * 获取智能插入位置（在当前激活标签后面）
   */
  getSmartInsertPosition(): number {
    if (this.currentPanelIndex !== 0) return -1; // 只有第一个面板支持
    
    if (this.firstPanelTabs.length === 0) return -1;
    
    // 获取当前激活的标签
    const currentActiveTab = this.getCurrentActiveTab();
    if (!currentActiveTab) {
      // 如果没有找到当前激活的标签，返回-1表示添加到末尾
      return -1;
    }
    
    // 找到当前激活标签的索引
    const currentIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === currentActiveTab.blockId);
    if (currentIndex === -1) {
      // 如果没有找到索引，返回-1表示添加到末尾
      return -1;
    }
    
    // 返回当前标签的索引，新标签将插入到其后面（索引+1的位置）
    return currentIndex;
  }

  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne(): TabInfo | null {
    if (this.currentPanelIndex !== 0) return null; // 只有第一个面板支持
    
    if (this.firstPanelTabs.length === 0) return null;
    
    // 如果有记录的上一个激活标签ID，查找对应的标签
    if (this.lastActiveBlockId) {
      const lastActiveTab = this.firstPanelTabs.find(tab => tab.blockId === this.lastActiveBlockId);
      if (lastActiveTab) {
        this.log(`🎯 找到上一个激活的标签: ${lastActiveTab.title}`);
        return lastActiveTab;
      }
    }
    
    // 如果没有记录或找不到，尝试获取当前UI中的激活标签
    const currentActiveTab = this.getCurrentActiveTab();
    if (currentActiveTab) {
      this.log(`🎯 使用当前激活的标签: ${currentActiveTab.title}`);
      return currentActiveTab;
    }
    
    this.log(`🎯 没有找到激活的标签`);
    return null;
  }

  /**
   * 基于之前激活的标签获取智能插入位置
   */
  getSmartInsertPositionWithPrevious(previousActiveTab: TabInfo | null): number {
    if (this.currentPanelIndex !== 0) return -1; // 只有第一个面板支持
    
    if (this.firstPanelTabs.length === 0) return -1;
    
    if (!previousActiveTab) {
      this.log(`🎯 没有找到之前激活的标签，添加到末尾`);
      return -1;
    }
    
    // 找到之前激活标签的索引
    const previousIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === previousActiveTab.blockId);
    if (previousIndex === -1) {
      this.log(`🎯 之前激活的标签不在当前列表中，添加到末尾`);
      return -1;
    }
    
    this.log(`🎯 将在标签 "${previousActiveTab.title}" (索引${previousIndex}) 后面插入新标签`);
    return previousIndex;
  }

  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(currentTab: TabInfo): TabInfo | null {
    if (this.currentPanelIndex !== 0) return null; // 只有第一个面板支持
    
    const currentIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === currentTab.blockId);
    if (currentIndex === -1) return null;
    
    // 如果只有一个标签，返回null（无法切换）
    if (this.firstPanelTabs.length <= 1) return null;
    
    // 如果当前标签在中间位置，优先选择右边的标签
    if (currentIndex < this.firstPanelTabs.length - 1) {
      return this.firstPanelTabs[currentIndex + 1];
    }
    
    // 如果当前标签在最右边，选择左边的标签
    if (currentIndex > 0) {
      return this.firstPanelTabs[currentIndex - 1];
    }
    
    // 如果当前标签在最左边且只有一个其他标签，选择右边的标签
    if (currentIndex === 0 && this.firstPanelTabs.length > 1) {
      return this.firstPanelTabs[1];
    }
    
    return null;
  }

  /**
   * 关闭标签页
   */
  async closeTab(tab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持关闭功能
    
    // 检查是否只有一个标签
    if (this.firstPanelTabs.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    
    // 检查是否是固定标签
    if (tab.isPinned) {
      this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
      // 这里可以添加确认对话框，暂时直接关闭
    }
    
    const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex !== -1) {
      // 检查当前关闭的标签是否是激活的标签
      const currentActiveTab = this.getCurrentActiveTab();
      const isClosingActiveTab = currentActiveTab && currentActiveTab.blockId === tab.blockId;
      
      // 获取相邻标签（在移除当前标签之前）
      const adjacentTab = isClosingActiveTab ? this.getAdjacentTab(tab) : null;
      
      // 将标签添加到已关闭列表
      this.closedTabs.add(tab.blockId);
      
      // 移除标签
      this.firstPanelTabs.splice(tabIndex, 1);
      
      // 更新UI和保存数据
      this.debouncedUpdateTabsUI();
      await this.saveFirstPanelTabs();
      await this.saveClosedTabs();
      
      this.log(`🗑️ 标签 "${tab.title}" 已关闭，已添加到关闭列表`);
      
      // 如果关闭的是当前激活的标签，自动切换到相邻标签
      if (isClosingActiveTab && adjacentTab) {
        this.log(`🔄 自动切换到相邻标签: "${adjacentTab.title}"`);
        await this.switchToTab(adjacentTab);
      } else if (isClosingActiveTab && !adjacentTab) {
        this.log(`⚠️ 关闭了激活标签但没有相邻标签可切换`);
      }
    }
  }


  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持关闭功能
    
    // 将非固定标签添加到已关闭列表
    const nonPinnedTabs = this.firstPanelTabs.filter(tab => !tab.isPinned);
    nonPinnedTabs.forEach(tab => {
      this.closedTabs.add(tab.blockId);
    });
    
    // 只保留固定标签
    const pinnedTabs = this.firstPanelTabs.filter(tab => tab.isPinned);
    const closedCount = this.firstPanelTabs.length - pinnedTabs.length;
    
    this.firstPanelTabs = pinnedTabs;
    
    // 更新UI和保存数据
    this.debouncedUpdateTabsUI();
    await this.saveFirstPanelTabs();
    await this.saveClosedTabs();
    
    this.log(`🗑️ 已关闭 ${closedCount} 个标签，保留了 ${pinnedTabs.length} 个固定标签`);
  }

  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(currentTab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持关闭功能
    
    // 保留当前标签和所有固定标签
    const keepTabs = this.firstPanelTabs.filter(tab => 
      tab.blockId === currentTab.blockId || tab.isPinned
    );
    
    // 将其他标签添加到已关闭列表
    const otherTabs = this.firstPanelTabs.filter(tab => 
      tab.blockId !== currentTab.blockId && !tab.isPinned
    );
    otherTabs.forEach(tab => {
      this.closedTabs.add(tab.blockId);
    });
    
    const closedCount = this.firstPanelTabs.length - keepTabs.length;
    this.firstPanelTabs = keepTabs;
    
    // 更新UI和保存数据
    this.debouncedUpdateTabsUI();
    await this.saveFirstPanelTabs();
    await this.saveClosedTabs();
    
    this.log(`🗑️ 已关闭其他 ${closedCount} 个标签，保留了当前标签和固定标签`);
  }

  /**
   * 重命名标签（内联编辑）
   */
  renameTab(tab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持重命名功能
    
    // 移除现有的右键菜单
    const existingMenu = document.querySelector('.tab-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    // 使用内联编辑进行重命名
    this.showInlineRenameInput(tab);
  }

  /**
   * 显示内联重命名输入框
   */
  showInlineRenameInput(tab: TabInfo) {
    // 查找对应的标签元素
    const tabElement = document.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
    if (!tabElement) {
      this.warn("找不到对应的标签元素");
      return;
    }

    // 移除现有的内联输入框
    const existingInput = tabElement.querySelector('.inline-rename-input');
    if (existingInput) {
      existingInput.remove();
    }

    // 保存原始内容
    const originalContent = tabElement.textContent;
    const originalStyle = tabElement.style.cssText;

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = tab.title;
    input.className = 'inline-rename-input';
    
    // 设置输入框样式，使其与标签样式一致
    const isDarkMode = orca.state.themeMode === 'dark';
    let backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(200, 200, 200, 0.6)';
    let textColor = isDarkMode ? '#ffffff' : '#333';
    
    // 如果有颜色，应用颜色样式
    if (tab.color) {
      backgroundColor = this.applyOklchFormula(tab.color, 'background');
      textColor = this.applyOklchFormula(tab.color, 'text');
    }

    input.style.cssText = `
      background: ${backgroundColor};
      color: ${textColor};
      border: 2px solid #3b82f6;
      border-radius: 4px;
      padding: 2px 8px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      font-weight: 600;
      outline: none;
      width: 100%;
      max-width: 150px;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `;

    // 隐藏标签文本，显示输入框
    tabElement.textContent = '';
    tabElement.appendChild(input);
    tabElement.style.padding = '2px 8px'; // 保持原有padding

    // 选中输入框中的文本
    input.focus();
    input.select();

    // 确认重命名
    const confirmRename = async () => {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== tab.title) {
        await this.updateTabTitle(tab, newTitle);
        // 重命名后，让UI更新来显示新标题
        return; // 不恢复原始内容，让UI更新显示新标题
      }
      // 如果没有更改，恢复标签显示
      tabElement.textContent = originalContent;
      tabElement.style.cssText = originalStyle;
    };

    // 取消重命名
    const cancelRename = () => {
      // 恢复标签显示
      tabElement.textContent = originalContent;
      tabElement.style.cssText = originalStyle;
    };

    // 添加事件监听器
    input.addEventListener('blur', confirmRename);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelRename();
      }
    });

    // 防止点击事件冒泡
    input.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(tab: TabInfo) {
    // 创建临时的React元素来使用Orca组件
    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;
    
    if (!React || !ReactDOM || !orca.components.InputBox) {
      this.warn("Orca组件不可用，回退到原生实现");
      this.showRenameInput(tab);
      return;
    }

    // 创建容器元素
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      pointer-events: none;
    `;
    document.body.appendChild(container);

    // 计算输入框位置（优化版：靠近边缘时往内定位）
    const tabElement = document.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
    let inputPosition = { x: '50%', y: '50%' };
    
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const inputWidth = 300; // 输入框预估宽度
      const inputHeight = 100; // 输入框预估高度
      const margin = 20; // 边距
      
      // 计算最佳位置，优先在标签上方显示
      let x = rect.left;
      let y = rect.top - inputHeight - 10; // 在标签上方显示
      
      // 智能边界检测和调整
      // 检查右边界 - 如果太靠近右边缘，往左移动
      if (x + inputWidth > viewportWidth - margin) {
        x = viewportWidth - inputWidth - margin;
      }
      
      // 检查左边界 - 如果太靠近左边缘，往右移动
      if (x < margin) {
        x = margin;
      }
      
      // 检查上边界 - 如果上方空间不够，显示在下方
      if (y < margin) {
        y = rect.bottom + 10;
        
        // 如果下方也不够，调整到屏幕中央
        if (y + inputHeight > viewportHeight - margin) {
          y = (viewportHeight - inputHeight) / 2;
        }
      }
      
      // 检查下边界 - 如果下方空间不够，调整位置
      if (y + inputHeight > viewportHeight - margin) {
        y = viewportHeight - inputHeight - margin;
      }
      
      // 最终边界检查，确保完全在屏幕内
      x = Math.max(margin, Math.min(x, viewportWidth - inputWidth - margin));
      y = Math.max(margin, Math.min(y, viewportHeight - inputHeight - margin));
      
      inputPosition = { x: `${x}px`, y: `${y}px` };
    }

    // 创建InputBox组件
    const InputBox = orca.components.InputBox;
    const inputBoxElement = React.createElement(InputBox, {
      label: "重命名标签",
      defaultValue: tab.title,
      onConfirm: (value: string | undefined, e: any, close: () => void) => {
        if (value && value.trim() && value.trim() !== tab.title) {
          this.updateTabTitle(tab, value.trim());
        }
        close();
      },
      onCancel: (close: () => void) => {
        close();
      }
    }, (open: () => void) => {
      // 创建一个触发按钮，但立即触发
      const trigger = React.createElement('div', {
        style: {
          position: 'absolute',
          left: inputPosition.x,
          top: inputPosition.y,
          pointerEvents: 'auto'
        },
        onClick: open
      }, '');
      return trigger;
    });

    // 渲染组件
    ReactDOM.render(inputBoxElement, container);

    // 立即触发打开
    setTimeout(() => {
      const triggerElement = container.querySelector('div');
      if (triggerElement) {
        triggerElement.click();
      }
    }, 0);

    // 清理函数
    const cleanup = () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
      }, 100);
    };

    // 监听ESC键关闭
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
  }

  /**
   * 显示重命名输入框（原生实现，作为备选）
   */
  showRenameInput(tab: TabInfo) {
    // 移除现有的重命名输入框
    const existingInput = document.querySelector('.tab-rename-input');
    if (existingInput) {
      existingInput.remove();
    }

    // 创建重命名输入框容器
    const inputContainer = document.createElement('div');
    inputContainer.className = 'tab-rename-input';
    inputContainer.style.cssText = `
      position: fixed;
      z-index: 2000;
      background: rgba(255, 255, 255, 0.98);
      border: 2px solid #3b82f6;
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: 8px 12px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      min-width: 200px;
    `;

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = tab.title;
    input.style.cssText = `
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: #333;
      width: 100%;
      padding: 4px 0;
    `;

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;

    // 创建确认按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认';
    confirmBtn.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    // 创建取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    // 添加按钮悬停效果
    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.backgroundColor = '#2563eb';
    });
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.backgroundColor = '#3b82f6';
    });

    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.backgroundColor = '#4b5563';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.backgroundColor = '#6b7280';
    });

    // 组装元素
    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    inputContainer.appendChild(input);
    inputContainer.appendChild(buttonContainer);

    // 定位输入框
    const tabElement = document.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect();
      inputContainer.style.left = `${rect.left}px`;
      inputContainer.style.top = `${rect.top - 60}px`;
    } else {
      // 如果找不到标签元素，使用鼠标位置
      inputContainer.style.left = '50%';
      inputContainer.style.top = '50%';
      inputContainer.style.transform = 'translate(-50%, -50%)';
    }

    document.body.appendChild(inputContainer);

    // 自动聚焦并选中文本
    input.focus();
    input.select();

    // 确认重命名
    const confirmRename = () => {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== tab.title) {
        this.updateTabTitle(tab, newTitle);
      }
      inputContainer.remove();
    };

    // 取消重命名
    const cancelRename = () => {
      inputContainer.remove();
    };

    // 绑定事件
    confirmBtn.addEventListener('click', confirmRename);
    cancelBtn.addEventListener('click', cancelRename);

    // 回车确认，ESC取消
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelRename();
      }
    });

    // 点击外部关闭
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (!inputContainer.contains(e.target as Node)) {
        cancelRename();
        document.removeEventListener('click', closeOnOutsideClick);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeOnOutsideClick);
    }, 100);
  }

  /**
   * 更新标签标题
   */
  async updateTabTitle(tab: TabInfo, newTitle: string) {
    try {
      // 更新本地标签数据
      const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
      if (tabIndex !== -1) {
        this.firstPanelTabs[tabIndex].title = newTitle;
        
        // 保存数据
        await this.saveFirstPanelTabs();
        
        // 立即更新UI（重命名需要立即反馈）
        await this.updateTabsUI();
        
        this.log(`📝 标签重命名: "${tab.title}" -> "${newTitle}"`);
        
        // 可选：同时更新块的别名（如果需要同步到Orca）
        // await this.updateBlockAlias(tab.blockId, newTitle);
      }
    } catch (e) {
      this.error("重命名标签失败:", e);
    }
  }

  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(tabElement: HTMLElement, tab: TabInfo) {
    // 检查Orca组件是否可用
    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;
    
    if (!React || !ReactDOM || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      // 如果组件不可用，延迟重试一次
      setTimeout(() => {
        const retryReact = (window as any).React;
        const retryReactDOM = (window as any).ReactDOM;
        
        if (!retryReact || !retryReactDOM || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
          // 仍然不可用，使用原生实现
      tabElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.showTabContextMenu(e, tab);
      });
        } else {
          // 重试成功，使用Orca组件
          this.createOrcaContextMenu(tabElement, tab);
        }
      }, 100);
      return;
    }
    
    // 组件可用，直接创建
    this.createOrcaContextMenu(tabElement, tab);
  }
  
  createOrcaContextMenu(tabElement: HTMLElement, tab: TabInfo) {
    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;

    // 创建ContextMenu容器
    const menuContainer = document.createElement('div');
    menuContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    tabElement.appendChild(menuContainer);

    // 创建ContextMenu组件
    const ContextMenu = orca.components.ContextMenu;
    const Menu = orca.components.Menu;
    const MenuText = orca.components.MenuText;
    const MenuSeparator = orca.components.MenuSeparator;

    const contextMenuElement = React.createElement(ContextMenu, {
      menu: (close: () => void) => {
        return React.createElement(Menu, {}, [
          React.createElement(MenuText, {
            key: 'rename',
            title: '重命名标签',
            preIcon: 'ti ti-edit',
            shortcut: 'F2',
            onClick: () => {
              close();
              this.renameTab(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'pin',
            title: tab.isPinned ? '取消固定' : '固定标签',
            preIcon: tab.isPinned ? 'ti ti-pin-off' : 'ti ti-pin',
            shortcut: 'Ctrl+P',
            onClick: () => {
              close();
              this.toggleTabPinStatus(tab);
            }
          }),
          React.createElement(MenuSeparator, { key: 'separator1' }),
          React.createElement(MenuText, {
            key: 'close',
            title: '关闭标签',
            preIcon: 'ti ti-x',
            shortcut: 'Ctrl+W',
            disabled: this.firstPanelTabs.length <= 1,
            onClick: () => {
              close();
              this.closeTab(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'closeOthers',
            title: '关闭其他标签',
            preIcon: 'ti ti-x',
            disabled: this.firstPanelTabs.length <= 1,
            onClick: () => {
              close();
              this.closeOtherTabs(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'closeAll',
            title: '关闭全部标签',
            preIcon: 'ti ti-x',
            disabled: this.firstPanelTabs.length <= 1,
            onClick: () => {
              close();
              this.closeAllTabs();
            }
          })
        ]);
      }
    }, (openMenu: (e: React.UIEvent) => void, closeMenu: () => void) => {
      // 创建一个透明的覆盖层来捕获右键事件
      const overlay = React.createElement('div', {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          background: 'transparent'
        },
        onContextMenu: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          openMenu(e);
        }
      });
      return overlay;
    });

    // 渲染ContextMenu
    ReactDOM.render(contextMenuElement, menuContainer);

    // 清理函数
    const cleanup = () => {
      ReactDOM.unmountComponentAtNode(menuContainer);
      menuContainer.remove();
    };

    // 在标签元素被移除时清理
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === tabElement) {
            cleanup();
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e: MouseEvent, tab: TabInfo) {
    // 移除现有的右键菜单
    const existingMenu = document.querySelector('.tab-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 创建右键菜单
    const menu = document.createElement('div');
    menu.className = 'tab-context-menu';
    menu.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 150px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    // 菜单项
    const menuItems = [
      {
        text: '重命名标签',
        action: () => this.renameTab(tab)
      },
      {
        text: tab.isPinned ? '取消固定' : '固定标签',
        action: () => this.toggleTabPinStatus(tab)
      }
    ];


    // 添加关闭相关选项
    menuItems.push(
      {
        text: '关闭标签',
        action: () => this.closeTab(tab),
        disabled: this.firstPanelTabs.length <= 1
      } as any,
      {
        text: '关闭其他标签',
        action: () => this.closeOtherTabs(tab),
        disabled: this.firstPanelTabs.length <= 1
      } as any,
      {
        text: '关闭全部标签',
        action: () => this.closeAllTabs(),
        disabled: this.firstPanelTabs.length <= 1
      } as any
    );

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        color: ${(item as any).disabled ? '#999' : '#333'};
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
      `;
      
      if (!(item as any).disabled) {
        menuItem.addEventListener('mouseenter', () => {
          menuItem.style.backgroundColor = '#f0f0f0';
        });
        menuItem.addEventListener('mouseleave', () => {
          menuItem.style.backgroundColor = 'transparent';
        });
        menuItem.addEventListener('click', () => {
          item.action();
          menu.remove();
        });
      }
      
      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // 点击其他地方关闭菜单
    const closeMenu = (event: MouseEvent) => {
      if (!menu.contains(event.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 100);
  }



  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS, this.firstPanelTabs);
      this.log(`💾 保存标签数据到API配置`);
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }

  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.CLOSED_TABS, Array.from(this.closedTabs));
      this.log(`💾 保存已关闭标签列表到API配置`);
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }

  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    try {
      const saved = await this.storageService.getConfig<TabInfo[]>(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS, 'orca-tabs-plugin', []);
      if (saved && Array.isArray(saved)) {
        this.firstPanelTabs = saved;
        this.log(`📂 从API配置恢复了 ${this.firstPanelTabs.length} 个标签页`);
        
        // 检查并更新块类型和图标信息
        await this.updateRestoredTabsBlockTypes();
      } else {
        this.firstPanelTabs = [];
        this.log(`📂 没有找到持久化的标签数据，初始化为空数组`);
      }
    } catch (e) {
      this.warn("无法恢复第一个面板标签数据:", e);
      this.firstPanelTabs = [];
    }
  }

  /**
   * 更新从存储中恢复的标签页的块类型和图标
   */
  async updateRestoredTabsBlockTypes() {
    this.log("🔄 更新从存储中恢复的标签页的块类型和图标...");
    
    if (this.firstPanelTabs.length === 0) {
      this.log("⚠️ 没有标签页需要更新");
      return;
    }
    
    let hasUpdates = false;
    
    for (let i = 0; i < this.firstPanelTabs.length; i++) {
      const tab = this.firstPanelTabs[i];
      
      // 检查是否需要更新块类型和图标
      const needsUpdate = !tab.blockType || !tab.icon;
      
      if (needsUpdate) {
        try {
          // 重新获取块信息
          const block = await orca.invokeBackend("get-block", parseInt(tab.blockId));
          if (block) {
            // 检测块类型
            const blockType = await this.detectBlockType(block);
            
            // 获取图标（优先使用用户自定义，否则使用块类型图标）
            let icon = tab.icon; // 保持用户自定义图标
            if (!icon) {
              icon = this.getBlockTypeIcon(blockType);
            }
            
            // 更新标签信息
            this.firstPanelTabs[i] = {
              ...tab,
              blockType,
              icon
            };
            
            this.log(`✅ 更新恢复的标签: ${tab.title} -> 类型: ${blockType}, 图标: ${icon}`);
            hasUpdates = true;
          }
        } catch (e) {
          this.warn(`更新恢复的标签失败: ${tab.title}`, e);
        }
      } else {
        this.verboseLog(`⏭️ 跳过恢复的标签: ${tab.title} (已有块类型和图标)`);
      }
    }
    
    if (hasUpdates) {
      this.log("🔄 检测到恢复的标签页有更新，保存到存储...");
      await this.saveFirstPanelTabs();
    }
    
    this.log("✅ 恢复的标签页块类型和图标更新完成");
  }

  /**
   * 从持久化存储恢复已关闭标签列表（使用API）
   */
  async restoreClosedTabs() {
    try {
      const saved = await this.storageService.getConfig<string[]>(PLUGIN_STORAGE_KEYS.CLOSED_TABS, 'orca-tabs-plugin', []);
      if (saved && Array.isArray(saved)) {
        this.closedTabs = new Set(saved);
        this.log(`📂 从API配置恢复了 ${this.closedTabs.size} 个已关闭标签`);
      } else {
        this.closedTabs = new Set();
        this.log(`📂 没有找到持久化的已关闭标签数据，初始化为空集合`);
      }
    } catch (e) {
      this.warn("无法恢复已关闭标签列表:", e);
      this.closedTabs = new Set();
    }
  }

  // 注意：以下方法已废弃，现在使用API配置存储
  // getStorageKey() 和 getClosedTabsStorageKey() 方法已被移除
  // 现在使用 OrcaStorageService 和 PLUGIN_STORAGE_KEYS 进行存储

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






  startDrag(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation(); // 强制阻止窗口拖拽
    
    this.isDragging = true;
    // 根据布局模式使用不同的位置
    const currentPosition = this.isVerticalMode ? this.verticalPosition : this.position;
    this.dragStartX = e.clientX - currentPosition.x;
    this.dragStartY = e.clientY - currentPosition.y;

    // 使用箭头函数绑定this
    const handleMouseMove = (event: MouseEvent) => {
      // 只在拖拽标签栏时阻止默认行为
      if (this.isDragging) {
        event.preventDefault();
        event.stopPropagation();
        this.drag(event);
      }
    };
    
    const handleMouseUp = (event: MouseEvent) => {
      // 不阻止事件传播，让其他元素能正常响应
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      this.stopDrag();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    if (this.tabContainer) {
      this.tabContainer.style.cursor = 'grabbing';
    }
  }

  drag(e: MouseEvent) {
    if (!this.isDragging || !this.tabContainer) return;

    e.preventDefault();
    
    // 根据布局模式更新不同的位置
    if (this.isVerticalMode) {
      this.verticalPosition.x = e.clientX - this.dragStartX;
      this.verticalPosition.y = e.clientY - this.dragStartY;
    } else {
    this.position.x = e.clientX - this.dragStartX;
    this.position.y = e.clientY - this.dragStartY;
    }

    // 获取容器的实际尺寸
    const containerRect = this.tabContainer.getBoundingClientRect();
    
    // 限制在窗口范围内，考虑实际容器大小
    const minX = 5; // 留一点边距
    const maxX = window.innerWidth - containerRect.width - 5;
    const minY = 5;
    const maxY = window.innerHeight - containerRect.height - 5;
    
    // 根据布局模式限制不同的位置
    if (this.isVerticalMode) {
      this.verticalPosition.x = Math.max(minX, Math.min(maxX, this.verticalPosition.x));
      this.verticalPosition.y = Math.max(minY, Math.min(maxY, this.verticalPosition.y));
    } else {
    this.position.x = Math.max(minX, Math.min(maxX, this.position.x));
    this.position.y = Math.max(minY, Math.min(maxY, this.position.y));
    }

    // 只移动标签容器
    const currentPosition = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = currentPosition.x + 'px';
    this.tabContainer.style.top = currentPosition.y + 'px';
    
    // 确保拖拽过程中不会影响其他元素的点击
    this.ensureClickableElements();
  }

  async stopDrag() {
    this.isDragging = false;
    
    if (this.tabContainer) {
      this.tabContainer.style.cursor = 'default';
      // 移除可能影响其他元素点击的样式和属性
      this.tabContainer.style.userSelect = '';
      this.tabContainer.style.pointerEvents = 'auto';
      this.tabContainer.style.touchAction = '';
    }
    
    // 清理全局拖拽状态
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.body.style.pointerEvents = '';
    document.body.style.touchAction = '';
    document.documentElement.style.cursor = '';
    document.documentElement.style.userSelect = '';
    document.documentElement.style.pointerEvents = '';
    
    // 强制重置所有可能被影响的元素
    this.resetAllElements();
    
    // 确保所有元素都能正常点击
    this.ensureClickableElements();
    
    this.log("🔄 拖拽结束，清理所有拖拽状态");

    // 保存位置
    if (this.isVerticalMode) {
      // 垂直模式：更新垂直位置并保存布局数据
      this.verticalPosition = { ...this.position };
      await this.saveLayoutMode();
    } else {
      // 水平模式：更新水平位置并保存布局数据
      this.horizontalPosition = { ...this.position };
      await this.saveLayoutMode();
    }
  }

  async savePosition() {
    try {
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.TABS_POSITION, this.position);
    } catch (e) {
      this.warn("无法保存标签位置");
    }
  }

  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode() {
    try {
      const layoutData = {
        isVerticalMode: this.isVerticalMode,
        verticalWidth: this.verticalWidth,
        verticalPosition: this.verticalPosition,
        horizontalPosition: this.horizontalPosition, // 使用专门的水平位置属性
        isSidebarAlignmentEnabled: this.isSidebarAlignmentEnabled,
        isFloatingWindowVisible: this.isFloatingWindowVisible,
        showBlockTypeIcons: this.showBlockTypeIcons,
        showInHeadbar: this.showInHeadbar
      };
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.LAYOUT_MODE, layoutData);
      this.log(`💾 布局模式已保存: ${this.isVerticalMode ? '垂直' : '水平'}, 垂直宽度: ${this.verticalWidth}px, 垂直位置: (${this.verticalPosition.x}, ${this.verticalPosition.y}), 水平位置: (${this.horizontalPosition.x}, ${this.horizontalPosition.y})`);
    } catch (e) {
      this.error("保存布局模式失败:", e);
    }
  }

  /**
   * 确保所有元素都能正常点击（拖拽过程中调用）
   */
  ensureClickableElements() {
    // 确保 body 和 html 元素可以点击
    document.body.style.pointerEvents = 'auto';
    document.documentElement.style.pointerEvents = 'auto';
    
    // 确保 Orca 原生面板可以点击
    const orcaPanels = document.querySelectorAll('.orca-panel, .orca-sidebar, .orca-menu');
    orcaPanels.forEach((panel) => {
      const htmlPanel = panel as HTMLElement;
      if (htmlPanel.style.pointerEvents === 'none') {
        htmlPanel.style.pointerEvents = 'auto';
      }
    });
    
    // 确保按钮可以点击
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    buttons.forEach((btn) => {
      const htmlBtn = btn as HTMLElement;
      if (htmlBtn.style.pointerEvents === 'none') {
        htmlBtn.style.pointerEvents = 'auto';
      }
    });
  }

  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    // 重置所有元素的样式
    const allElements = document.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      // 重置可能被拖拽影响的样式
      if (htmlEl.style.cursor === 'grabbing' || htmlEl.style.cursor === 'grab') {
        htmlEl.style.cursor = '';
      }
      if (htmlEl.style.userSelect === 'none') {
        htmlEl.style.userSelect = '';
      }
      if (htmlEl.style.pointerEvents === 'none') {
        htmlEl.style.pointerEvents = '';
      }
      if (htmlEl.style.touchAction === 'none') {
        htmlEl.style.touchAction = '';
      }
    });
    
    // 特别处理可能被影响的 Orca 元素
    const orcaElements = document.querySelectorAll('.orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]');
    orcaElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.cursor = '';
      htmlEl.style.userSelect = '';
      htmlEl.style.pointerEvents = 'auto';
      htmlEl.style.touchAction = '';
    });
    
    this.log("🔄 重置所有元素样式");
  }

  async restorePosition() {
    try {
      const saved = await this.storageService.getConfig<{x: number, y: number}>(PLUGIN_STORAGE_KEYS.TABS_POSITION, 'orca-tabs-plugin', {x: 20, y: 20});
      if (saved) {
        this.position = saved;
        // 确保恢复的位置在有效范围内
        this.constrainPosition();
      }
    } catch (e) {
      this.warn("无法恢复标签位置");
    }
  }

  /**
   * 从API配置恢复布局模式
   */
  async restoreLayoutMode() {
    try {
      const saved = await this.storageService.getConfig<{
        isVerticalMode: boolean;
        verticalWidth: number;
        verticalPosition: {x: number, y: number};
        horizontalPosition?: {x: number, y: number};
        isSidebarAlignmentEnabled?: boolean;
        isFloatingWindowVisible?: boolean;
        showBlockTypeIcons?: boolean;
        showInHeadbar?: boolean;
      }>(PLUGIN_STORAGE_KEYS.LAYOUT_MODE, 'orca-tabs-plugin', {
        isVerticalMode: false,
        verticalWidth: 200,
        verticalPosition: { x: 20, y: 20 },
        horizontalPosition: { x: 20, y: 20 },
        isSidebarAlignmentEnabled: false,
        isFloatingWindowVisible: true,
        showBlockTypeIcons: true,
        showInHeadbar: true
      });
      
      if (saved) {
        this.isVerticalMode = saved.isVerticalMode || false;
        this.verticalWidth = saved.verticalWidth || 200;
        this.verticalPosition = saved.verticalPosition || { x: 20, y: 20 };
        
        // 恢复水平位置（如果存在）
        if (saved.horizontalPosition) {
          this.horizontalPosition = saved.horizontalPosition;
          this.position = { ...saved.horizontalPosition };
        }
        
        // 恢复其他设置
        this.isSidebarAlignmentEnabled = saved.isSidebarAlignmentEnabled || false;
        this.isFloatingWindowVisible = saved.isFloatingWindowVisible !== false;
        this.showBlockTypeIcons = saved.showBlockTypeIcons !== false;
        this.showInHeadbar = saved.showInHeadbar !== false;
        
        this.log(`📐 布局模式已恢复: ${this.isVerticalMode ? '垂直' : '水平'}, 垂直宽度: ${this.verticalWidth}px, 垂直位置: (${this.verticalPosition.x}, ${this.verticalPosition.y}), 水平位置: (${this.position.x}, ${this.position.y})`);
      } else {
        this.isVerticalMode = false;
        this.verticalWidth = 200;
        this.verticalPosition = { x: 20, y: 20 };
        this.position = { x: 20, y: 20 };
        this.log(`📐 布局模式: 水平 (默认)`);
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
      this.isVerticalMode = false;
      this.verticalWidth = 200;
      this.verticalPosition = { x: 20, y: 20 };
      this.position = { x: 20, y: 20 };
    }
  }

  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    // 保守估计容器大小（如果还没有创建）
    const estimatedWidth = 400;
    const estimatedHeight = 40;
    
    const minX = 0; // 允许紧靠左边缘
    const maxX = window.innerWidth - estimatedWidth;
    const minY = 0; // 允许紧靠上边缘
    const maxY = window.innerHeight - estimatedHeight;
    
    this.position.x = Math.max(minX, Math.min(maxX, this.position.x));
    this.position.y = Math.max(minY, Math.min(maxY, this.position.y));
  }

  /**
   * 检查新添加的块
   */
  async checkForNewBlocks() {
    if (this.panelIds.length === 0 || !this.isInitialized) return;
    
    // 如果是第一个面板，更新固化标签页
    if (this.currentPanelIndex === 0) {
      await this.checkFirstPanelBlocks();
    } else {
      // 如果是其他面板，更新实时显示
      this.debouncedUpdateTabsUI();
    }
  }

  /**
   * 检查第一个面板的当前激活页面
   */
  async checkFirstPanelBlocks() {
    const firstPanelId = this.panelIds[0];
    const firstPanel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!firstPanel) return;
    
    // 只获取当前激活的页面（最上面的）
    const activeBlockEditor = firstPanel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) {
      this.log("第一个面板中没有找到激活的块编辑器");
      return;
    }

    const blockId = activeBlockEditor.getAttribute('data-block-id');
    if (!blockId) {
      this.log("激活的块编辑器没有blockId");
      return;
    }

    // 检查是否已经存在这个标签页
    const existingTab = this.firstPanelTabs.find(tab => tab.blockId === blockId);
    if (existingTab) {
      // 如果已经存在，更新聚焦状态
      this.verboseLog(`📋 当前激活页面已存在: "${existingTab.title}"`);
      
      // 清除所有标签的聚焦状态
      const allTabs = this.tabContainer?.querySelectorAll('.orca-tab');
      allTabs?.forEach(tab => tab.removeAttribute('data-focused'));
      
      // 设置当前标签为聚焦状态
      const currentTabElement = this.tabContainer?.querySelector(`[data-tab-id="${blockId}"]`);
      if (currentTabElement) {
        currentTabElement.setAttribute('data-focused', 'true');
        this.log(`🎯 更新聚焦状态到已存在的标签: "${existingTab.title}"`);
      }
      
      // 更新UI显示
      this.debouncedUpdateTabsUI();
      return;
    }

    // 直接从UI中找到当前聚焦的标签
    let insertIndex = this.firstPanelTabs.length; // 默认插入到末尾
    let shouldReplaceFocused = false; // 是否应该替换聚焦的标签
    
    
    const focusedTabElement = this.tabContainer?.querySelector('.orca-tab[data-focused="true"]');
    
    if (focusedTabElement) {
      const focusedTabId = focusedTabElement.getAttribute('data-tab-id');
      
      if (focusedTabId) {
        const focusedIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === focusedTabId);
        
        if (focusedIndex !== -1) {
          const focusedTab = this.firstPanelTabs[focusedIndex];
          
          // 检查聚焦的标签是否是固定标签
          if (focusedTab.isPinned) {
            // 如果是固定标签，在其后面插入新标签，而不是替换
            insertIndex = focusedIndex + 1;
            shouldReplaceFocused = false;
            this.log(`📌 聚焦标签是固定的，将在其后面插入新标签`);
          } else {
            // 如果不是固定标签，可以替换
            insertIndex = focusedIndex;
            shouldReplaceFocused = true;
            this.log(`🎯 聚焦标签不是固定的，将替换聚焦标签`);
          }
        } else {
          this.log(`🎯 聚焦的标签不在数组中，插入到末尾`);
        }
      } else {
        this.log(`🎯 聚焦的标签没有data-tab-id，插入到末尾`);
      }
    } else {
      this.log(`🎯 没有找到聚焦的标签，将替换最后一个非固定标签`);
    }
    
    this.log(`🎯 最终计算的insertIndex: ${insertIndex}, 是否替换聚焦标签: ${shouldReplaceFocused}`);
    
    // 获取当前激活页面的标签信息
    const tabInfo = await this.getTabInfo(blockId, firstPanelId, this.firstPanelTabs.length);
    if (tabInfo) {
      this.verboseLog(`📋 检测到新的激活页面: "${tabInfo.title}"`);
      
      if (this.firstPanelTabs.length >= this.maxTabs) {
        // 达到上限，根据是否有聚焦标签决定处理方式
        
        if (shouldReplaceFocused && insertIndex < this.firstPanelTabs.length) {
          // 有聚焦标签，直接替换聚焦标签
          const replacedTab = this.firstPanelTabs[insertIndex];
          this.firstPanelTabs[insertIndex] = tabInfo;
          this.log(`🔄 替换聚焦标签: "${replacedTab.title}" -> "${tabInfo.title}"`);
          this.log(`🎯 替换后数组:`, this.firstPanelTabs.map((tab, idx) => `${idx}:${tab.title}`));
        } else if (insertIndex < this.firstPanelTabs.length) {
          // 有聚焦标签但不在替换模式，在聚焦标签后面插入，然后删除最后一个非固定标签
          this.log(`🎯 插入前数组:`, this.firstPanelTabs.map((tab, idx) => `${idx}:${tab.title}`));
          this.firstPanelTabs.splice(insertIndex + 1, 0, tabInfo);
          this.log(`➕ 在位置 ${insertIndex + 1} 插入新标签: ${tabInfo.title}`);
          this.verboseLog(`🎯 插入后数组:`, this.firstPanelTabs.map((tab, idx) => `${idx}:${tab.title}`));
          
          // 删除最后一个非固定标签来保持数量限制
          const lastNonPinnedIndex = this.findLastNonPinnedTabIndex();
          if (lastNonPinnedIndex !== -1) {
            const removedTab = this.firstPanelTabs[lastNonPinnedIndex];
            this.firstPanelTabs.splice(lastNonPinnedIndex, 1);
            this.log(`🗑️ 删除末尾的非固定标签: "${removedTab.title}" 来保持数量限制`);
            this.log(`🎯 最终数组:`, this.firstPanelTabs.map((tab, idx) => `${idx}:${tab.title}`));
          } else {
            // 如果所有标签都是固定的，删除刚插入的新标签
            const newTabIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === tabInfo.blockId);
            if (newTabIndex !== -1) {
              this.firstPanelTabs.splice(newTabIndex, 1);
              this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${tabInfo.title}"`);
              return;
            }
          }
        } else {
          // 没有聚焦标签，直接替换最后一个非固定标签
          const lastNonPinnedIndex = this.findLastNonPinnedTabIndex();
          if (lastNonPinnedIndex !== -1) {
            const replacedTab = this.firstPanelTabs[lastNonPinnedIndex];
            this.firstPanelTabs[lastNonPinnedIndex] = tabInfo;
            this.log(`🔄 没有聚焦标签，替换最后一个非固定标签: "${replacedTab.title}" -> "${tabInfo.title}"`);
          } else {
            // 如果所有标签都是固定的，无法添加
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${tabInfo.title}"`);
            return;
          }
        }
      } else {
        // 未达到上限，根据是否替换聚焦标签决定处理方式
        if (shouldReplaceFocused && insertIndex < this.firstPanelTabs.length) {
          // 替换聚焦标签
          const replacedTab = this.firstPanelTabs[insertIndex];
          this.firstPanelTabs[insertIndex] = tabInfo;
          this.log(`🔄 替换聚焦标签: "${replacedTab.title}" -> "${tabInfo.title}"`);
          this.log(`🎯 替换后数组:`, this.firstPanelTabs.map((tab, idx) => `${idx}:${tab.title}`));
        } else {
          // 在计算出的位置插入新标签
          this.firstPanelTabs.splice(insertIndex, 0, tabInfo);
          this.verboseLog(`➕ 在位置 ${insertIndex} 插入新标签: ${tabInfo.title}`);
          this.verboseLog(`🎯 插入后数组:`, this.firstPanelTabs.map((tab, idx) => `${idx}:${tab.title}`));
        }
      }
      
      // 如果标签页重新显示，从已关闭列表中移除
      if (this.closedTabs.has(blockId)) {
        this.closedTabs.delete(blockId);
        await this.saveClosedTabs();
        this.log(`🔄 标签 "${tabInfo.title}" 重新显示，从已关闭列表中移除`);
      }
      
      // 保存更新后的数组
      await this.saveFirstPanelTabs();
      this.debouncedUpdateTabsUI();
    } else {
      this.log("无法获取激活页面的标签信息");
    }
  }

  observeChanges() {
    // 监听DOM变化以更新标签和面板
    const observer = new MutationObserver(async (mutations) => {
      let shouldCheckNewBlocks = false;
      let shouldCheckNewPanels = false;
      
      let needsCurrentPanelUpdate = false;
      let oldIndex = this.currentPanelIndex;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const target = mutation.target as Element;
          
          // 检查是否有新的面板添加
          if (target.classList.contains('orca-panels-row') || 
              target.closest('.orca-panels-row')) {
            this.verboseLog("🔍 检测到面板行变化，检查新面板...");
            shouldCheckNewPanels = true;
          }
          
          // 检查是否有新的块编辑器添加到任何面板
          if (mutation.addedNodes.length > 0) {
            // 检查是否在任何面板内
            const isInAnyPanel = target.closest('.orca-panel');
            
            if (isInAnyPanel) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  // 检查是否添加了新的块编辑器
                  if (element.classList.contains('orca-block-editor') || 
                      element.querySelector('.orca-block-editor')) {
                    shouldCheckNewBlocks = true;
                    break;
                  }
                }
              }
            }
          }
        }
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // 检查面板激活状态变化，更新当前面板索引
          const target = mutation.target as Element;
          if (target.classList.contains('orca-panel')) {
            needsCurrentPanelUpdate = true;
          }
        }
      });

      // 处理面板切换
      if (needsCurrentPanelUpdate) {
        await this.updateCurrentPanelIndex();
        
        // 如果面板索引发生变化，立即更新标签页显示
        if (oldIndex !== this.currentPanelIndex) {
          this.log(`🔄 面板切换: ${oldIndex} -> ${this.currentPanelIndex}`);
          this.debouncedUpdateTabsUI();
        }
      }

      if (shouldCheckNewPanels) {
        // 检查新面板
        setTimeout(async () => {
          await this.checkForNewPanels();
        }, 100);
      }


      if (shouldCheckNewBlocks) {
        // 仅检查第一个面板的新增块
        setTimeout(async () => {
          await this.checkForNewBlocks();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /**
   * 检查新添加的面板
   */
  async checkForNewPanels() {
    const oldPanelCount = this.panelIds.length;
    const oldPanelIds = [...this.panelIds]; // 保存旧的面板ID列表
    const oldCurrentPanelId = this.currentPanelId;
    
    this.discoverPanels();
    
    if (this.panelIds.length > oldPanelCount) {
      this.log(`🎉 发现新面板！从 ${oldPanelCount} 个增加到 ${this.panelIds.length} 个`);
      
      // 重新创建UI以显示循环切换器
      await this.createTabsUI();
    } else if (this.panelIds.length < oldPanelCount) {
      this.log(`📉 面板数量减少！从 ${oldPanelCount} 个减少到 ${this.panelIds.length} 个`);
      this.log(`📋 旧面板列表: [${oldPanelIds.join(', ')}]`);
      this.log(`📋 新面板列表: [${this.panelIds.join(', ')}]`);
      
      // 检查第一个面板是否发生了变化
      const oldFirstPanelId = oldPanelIds[0];
      const newFirstPanelId = this.panelIds[0];
      
      if (oldFirstPanelId && newFirstPanelId && oldFirstPanelId !== newFirstPanelId) {
        this.log(`🔄 第一个面板已变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
        await this.handleFirstPanelChange(oldFirstPanelId, newFirstPanelId);
      }
      
      // 检查当前面板是否还存在
      if (this.currentPanelId && !this.panelIds.includes(this.currentPanelId)) {
        this.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`);
        this.currentPanelIndex = 0;
        this.currentPanelId = this.panelIds[0];
      }
      
      // 重新创建UI
      await this.createTabsUI();
    }
  }

  /**
   * 更新当前面板索引
   */
  async updateCurrentPanelIndex() {
    const activePanel = document.querySelector('.orca-panel.active');
    if (activePanel) {
      const panelId = activePanel.getAttribute('data-panel-id');
      if (panelId) {
        const index = this.panelIds.indexOf(panelId);
        if (index !== -1) {
          this.currentPanelIndex = index;
          this.currentPanelId = panelId;
          this.debouncedUpdateTabsUI();
        }
      }
    }
  }

  /**
   * 监听窗口大小变化
   */
  observeWindowResize() {
    window.addEventListener('resize', () => {
      // 延迟一点，确保窗口大小已经更新
      setTimeout(() => {
        this.constrainPosition();
        this.updateUIPositions();
      }, 100);
    });
  }

  /**
   * 启动主动的面板状态监控
   */
  startActiveMonitoring() {
    // 1. 定期检查面板状态（每2秒，大幅减少频率）
    this.monitoringInterval = setInterval(async () => {
      await this.checkPanelStatusChange();
    }, 2000);
    
    // 统一的全局事件监听器
    this.globalEventListener = async (e: Event) => {
      await this.handleGlobalEvent(e);
    };
    
    // 为不同类型的事件注册同一个监听器，使用较低优先级
    document.addEventListener('click', this.globalEventListener, { passive: true });
    document.addEventListener('contextmenu', this.globalEventListener, { passive: true });
    // 移除keydown监听以避免干扰Orca核心功能
  }

  /**
   * 统一的全局事件处理器
   */
  private async handleGlobalEvent(e: Event) {
    switch (e.type) {
      case 'click':
        await this.handleClickEvent(e as MouseEvent);
        break;
      case 'contextmenu':
        await this.handleContextMenuEvent(e as MouseEvent);
        break;
      // keydown事件处理已移除
    }
  }

  /**
   * 处理点击事件
   */
  private async handleClickEvent(e: MouseEvent) {
    // 检查是否是 Ctrl+点击 块引用
    if ((e.ctrlKey || e.metaKey) && e.target) {
      const target = e.target as HTMLElement;
      const blockRefId = this.getBlockRefId(target);
      
      if (blockRefId) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        this.log(`🔗 检测到 Ctrl+点击 块引用: ${blockRefId}，将在后台新建标签页`);
        
        // Ctrl+点击: 在新标签页打开
        await this.openInNewTab(blockRefId);
        return;
      }
    }
    
    // 检查是否点击了侧边栏相关元素，如果是则不处理
    const target = e.target as HTMLElement;
    if (target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
      this.log("🔄 检测到侧边栏/面板点击，跳过面板状态检查");
      return;
    }
    
    // 检查是否在拖拽过程中，如果是则不处理
    if (this.isDragging) {
      this.log("🔄 检测到拖拽过程中，跳过面板状态检查");
      return;
    }
    
    // 使用防抖，避免频繁触发
    setTimeout(() => {
      this.debouncedCheckPanelStatus();
    }, 100);
  }

  /**
   * 处理右键菜单事件
   */
  private async handleContextMenuEvent(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const blockRefId = this.getBlockRefId(target);
    
    if (blockRefId) {
      // 这是块引用的右键菜单
      this.log(`🔗 检测到块引用右键菜单: ${blockRefId}`);
      this.currentContextBlockRefId = blockRefId;
      
      // 延迟一点时间，让原生菜单先显示，然后我们添加自定义项
      setTimeout(() => {
        this.enhanceBlockRefContextMenu(blockRefId);
      }, 50);
    }
  }

  // handleKeydownEvent方法已移除，不再监听全局键盘事件

  /**
   * 防抖的面板状态检查
   */
  debouncedCheckPanelStatus() {
    // 清除之前的计时器
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }
    
    // 设置新的计时器
    this.updateDebounceTimer = setTimeout(async () => {
      await this.checkPanelStatusChange();
    }, 50); // 50ms防抖
  }

  /**
   * 检查面板状态是否发生变化
   */
  async checkPanelStatusChange() {
    // 快速检查面板数量是否变化
    const currentPanelCount = document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])').length;
    
    // 如果面板数量没有变化，跳过完整发现
    if (currentPanelCount === this.panelIds.length && this.panelDiscoveryCache) {
      const cacheAge = Date.now() - this.panelDiscoveryCache.timestamp;
      if (cacheAge < 3000) { // 缓存3秒内有效
        this.verboseLog("📋 面板数量未变化，跳过面板发现");
        return;
      }
    }
    
    // 首先重新扫描面板，检查是否有面板被关闭
    const oldPanelIds = [...this.panelIds];
    this.discoverPanels();
    
    // 检查面板列表是否发生变化
    const panelListChanged = oldPanelIds.length !== this.panelIds.length || 
      !oldPanelIds.every((id, index) => id === this.panelIds[index]);
    
    if (panelListChanged) {
      this.log(`📋 面板列表发生变化: ${oldPanelIds.length} -> ${this.panelIds.length}`);
      this.log(`📋 旧面板列表: [${oldPanelIds.join(', ')}]`);
      this.log(`📋 新面板列表: [${this.panelIds.join(', ')}]`);
      
      // 检查第一个面板是否被关闭
      const oldFirstPanelId = oldPanelIds[0];
      const newFirstPanelId = this.panelIds[0];
      
      if (oldFirstPanelId && newFirstPanelId && oldFirstPanelId !== newFirstPanelId) {
        this.log(`🔄 第一个面板已变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
        this.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`);
        // 将新的第一个面板设置为固化面板，并迁移/清空原有数据
        await this.handleFirstPanelChange(oldFirstPanelId, newFirstPanelId);
        this.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`);
      }
    }
    
    const activePanel = document.querySelector('.orca-panel.active');
    if (activePanel) {
      const panelId = activePanel.getAttribute('data-panel-id');
      if (panelId && (panelId !== this.currentPanelId || panelListChanged)) {
        // 面板发生了切换或面板列表发生变化
        const oldIndex = this.currentPanelIndex;
        const newIndex = this.panelIds.indexOf(panelId);
        
        if (newIndex !== -1) {
          this.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${panelId} (索引: ${oldIndex} -> ${newIndex})`);
          
          this.currentPanelIndex = newIndex;
          this.currentPanelId = panelId;
          
          // 更新UI（使用防抖）
          this.debouncedUpdateTabsUI();
        }
      }
    }
  }

  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(oldFirstPanelId: string, newFirstPanelId: string) {
    this.log(`🔄 处理第一个面板变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
    this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`);
    
    // 清空旧的固化标签数据（因为对应的面板已经不存在了）
    this.log(`🗑️ 清空旧面板 ${oldFirstPanelId} 的固化标签数据`);
    this.firstPanelTabs = [];
    
    // 扫描新的第一个面板，创建新的固化标签
    this.log(`🔍 为新的第一个面板 ${newFirstPanelId} 创建固化标签`);
    await this.scanFirstPanel();
    
    // 保存新的固化标签数据
    await this.saveFirstPanelTabs();
    
    // 立即更新UI显示新的固化标签
    this.log(`🎨 立即更新UI显示新的固化标签`);
    await this.updateTabsUI();
    
    this.log(`✅ 第一个面板变更处理完成，新建了 ${this.firstPanelTabs.length} 个固化标签`);
    this.log(`✅ 新的固化标签:`, this.firstPanelTabs.map(tab => `${tab.title}(${tab.blockId})`));
  }

  /**
   * 更新UI元素位置
   */
  updateUIPositions() {
    if (this.tabContainer) {
      this.tabContainer.style.left = this.position.x + 'px';
      this.tabContainer.style.top = this.position.y + 'px';
    }
  }

  /**
   * 重置插件缓存
   */
  async resetCache() {
    this.log("🔄 开始重置插件缓存...");
    
    // 清空固化标签数据
    this.firstPanelTabs = [];
    
    // 清空已关闭标签列表
    this.closedTabs.clear();
    
    // 清空API配置中的缓存数据
    try {
      await this.storageService.removeConfig(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS);
      await this.storageService.removeConfig(PLUGIN_STORAGE_KEYS.CLOSED_TABS);
      this.log(`🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表`);
    } catch (e) {
      this.warn("删除API配置缓存失败:", e);
    }
    
    // 重新扫描第一个面板
    if (this.panelIds.length > 0) {
      this.log("🔍 重新扫描第一个面板...");
      await this.scanFirstPanel();
      await this.saveFirstPanelTabs();
    }
    
    // 更新UI
    await this.updateTabsUI();
    
    this.log("✅ 插件缓存重置完成");
  }

  destroy() {
    // 清理UI元素
    if (this.tabContainer) {
      this.tabContainer.remove();
      this.tabContainer = null;
    }
    if (this.cycleSwitcher) {
      this.cycleSwitcher.remove();
      this.cycleSwitcher = null;
    }
    
    // 清理拖拽样式
    const dragStyles = document.getElementById('orca-tabs-drag-styles');
    if (dragStyles) {
      dragStyles.remove();
    }
    
    // 清理计时器
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
      this.updateDebounceTimer = null;
    }
    if (this.swapDebounceTimer) {
      clearTimeout(this.swapDebounceTimer);
      this.swapDebounceTimer = null;
    }
    
    // 清理监听器
    if (this.globalEventListener) {
      document.removeEventListener('click', this.globalEventListener);
      document.removeEventListener('contextmenu', this.globalEventListener);
      // keydown监听器已移除
      this.globalEventListener = null;
    }
    if (this.dragEndListener) {
      document.removeEventListener('dragend', this.dragEndListener);
      this.dragEndListener = null;
    }
    if (this.themeChangeListener) {
      this.themeChangeListener();
      this.themeChangeListener = null;
    }
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
    
    // 清理拖拽状态
    this.draggingTab = null;
  }
}

let tabsPlugin: OrcaTabsPlugin | null = null;

export async function load(_name: string) {
  pluginName = _name;

  setupL10N(orca.state.locale, { "zh-CN": zhCN });

  // 初始化标签页插件
  tabsPlugin = new OrcaTabsPlugin();
  
  // 等待DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => tabsPlugin?.init(), 500);
    });
  } else {
    setTimeout(() => tabsPlugin?.init(), 500);
  }

  // 注册重置缓存命令
  orca.commands.registerCommand(
    `${pluginName}.resetCache`,
    async () => {
      if (tabsPlugin) {
        await tabsPlugin.resetCache();
        // 成功提示已移除
      }
    },
    "重置插件缓存"
  );

  // 注册切换块类型图标命令
  orca.commands.registerCommand(
    `${pluginName}.toggleBlockIcons`,
    async () => {
      if (tabsPlugin) {
        await tabsPlugin.toggleBlockTypeIcons();
      }
    },
    "切换块类型图标显示"
  );


  if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
    console.log(t("标签页插件已启动"));
    console.log(`${pluginName} loaded.`);
  }
}

export async function unload() {
  // Clean up any resources used by the plugin here.
  if (tabsPlugin) {
    // 注销顶部工具栏按钮
    tabsPlugin.unregisterHeadbarButton();
    
    // 清理拖拽功能
    tabsPlugin.cleanupDragResize();
    
    tabsPlugin.destroy();
    tabsPlugin = null;
  }
  
  // 注销重置缓存命令
  orca.commands.unregisterCommand(`${pluginName}.resetCache`);
}

