/* ———————————————————————————————————————————————————————————————————————————— */
/* 导入模块 - Module Imports */
/* ———————————————————————————————————————————————————————————————————————————— */

/**
 * Orca标签页插件主文件
 * 
 * 这是一个为Orca编辑器设计的标签页管理插件，提供以下核心功能：
 * 1. 多面板标签页管理 - 支持多个面板的标签页独立管理
 * 2. 标签页拖拽排序 - 支持拖拽重新排列标签页顺序
 * 3. 标签页固定功能 - 支持固定重要标签页到特定位置
 * 4. 最近关闭标签页 - 记录并支持恢复最近关闭的标签页
 * 5. 工作区管理 - 支持保存和切换不同的标签页集合
 * 6. 多标签页保存 - 支持保存多个标签页组合
 * 7. 主题适配 - 自动适配Orca的明暗主题
 * 8. 响应式布局 - 支持水平和垂直两种布局模式
 * 9. 性能优化 - 包含防抖、缓存、虚拟滚动等性能优化
 * 10. 国际化支持 - 支持多语言界面
 * 
 * 技术架构：
 * - 使用TypeScript编写，提供完整的类型安全
 * - 采用模块化设计，功能按工具类分离
 * - 使用Orca插件API进行数据存储和UI集成
 * - 支持热重载和开发调试
 * 
 * @author Orca Tabs Plugin Team
 * @version 2.4.0
 * @since 2024
 */

// ==================== 第三方库导入 ====================
// 国际化支持库 - 提供多语言文本翻译功能
import { setupL10N, t } from "./libs/l10n";
// 中文翻译文件 - 包含所有中文界面文本
import zhCN from "./translations/zhCN";

// ==================== 本地模块导入 ====================
// 常量定义 - 包含应用配置常量和存储键定义
import { AppKeys, PropType, PLUGIN_STORAGE_KEYS } from './constants';
// 类型定义 - 包含所有TypeScript接口和类型
import { TabInfo, TabPosition, PanelTabsData, SavedTabSet, Workspace, HoverTabListConfig } from './types';
// 存储服务 - 提供统一的数据存储接口，支持Orca API和localStorage降级
import { OrcaStorageService } from './services/storage';
// 标签页存储服务 - 提供标签页相关的数据存储操作
import { TabStorageService } from './services/tabStorage';
// ==================== 块处理工具函数 ====================
// 基础块处理工具 - 提供块类型检测、日期格式化、属性提取等基础功能
import { formatJournalDate, extractJournalInfo, detectBlockType, getBlockTypeIcon, isDateString, findProperty, format } from './utils/blockUtils';
// 增强块处理工具
import { 
  isTextWithBlockRefs,
  extractTextFromContent
} from './utils/blockProcessingUtils';

// ==================== DOM操作工具函数 ====================
// DOM操作工具 - 提供安全的DOM元素创建、操作和事件处理功能
import { 
  findClosestParent,
  createContextMenuItem
} from './utils/domUtils';

// ==================== 样式工具函数 ====================
// 样式处理工具 - 提供颜色转换、样式生成等样式相关功能
import { hexToRgba } from './utils/styleUtils';

// ==================== 配置管理工具函数 ====================
import { 
  createDefaultLayoutConfig,
  validatePosition,
  mergeLayoutConfig,
  getPositionByMode,
  generateLayoutLogMessage,
  generatePositionLogMessage,
  type LayoutConfig
} from './utils/configUtils';

// 注: 已移除未使用的事件处理工具以减小包体积

// ==================== UI创建工具函数 ====================
import { 
  createTabBaseStyle,
  createTabContentContainer,
  createTabIconContainer,
  createTabTextContainer,
  createPinIcon,
  createTabTooltip,
  calculateContextMenuPosition
} from './utils/uiUtils';

// UI创建工具函数
import { 
  showHoverTabList,
  hideHoverTabList,
  updateHoverTabList
} from './utils/uiCreationUtils';

// Tooltip 工具函数
import { 
  addTooltip,
  createButtonTooltip,
  createStatusTooltip,
  createTabTooltip as createCustomTabTooltip,
  initializeTooltips
} from './utils/tooltipUtils';

// 数据处理工具函数
import { 
  findLastNonPinnedTabIndex, 
  sortTabsByPinStatus
} from './utils/dataUtils';

// 标签操作工具函数
import { 
  switchToTab,
  performNavigation,
  navigateToJournalBlock,
  navigateToRegularBlock,
  toggleTabPinStatus,
  pinTab,
  unpinTab,
  deleteTab,
  createTab,
  updateTab,
  updateTabTitle,
  updateTabIcon,
  moveTab as moveTabOperation,
  swapTabs as swapTabsOperation,
  findAdjacentTab,
  calculateSmartInsertPosition as calculateSmartInsertPositionOperation,
  updateTabOrder,
  validateTabData as validateTabDataOperation,
  sortTabsByPinStatus as sortTabsByPinStatusOperation,
  findTab,
  findTabIndex as findTabIndexOperation,
  tabExists,
  getTabStats,
  cleanInvalidTabs as cleanInvalidTabsOperation,
  batchUpdateTabProperties as batchUpdateTabPropertiesOperation,
  generateTabId as generateTabIdOperation,
  areTabsEqual as areTabsEqualOperation,
  isValidTab,
  getTabDisplayName,
  canOperateTab,
  type TabOperationResult,
  type TabSwitchOptions,
  type TabPinOptions,
  type TabDeleteOptions,
  type TabCreateOptions,
  type TabUpdateOptions
} from './utils/tabOperationsUtils';
import { 
  shouldAdjustPanelPosition, 
  calculateAdjustedPosition,
  constrainPositionToBounds
} from './utils/layoutUtils';
import { 
  isElementInViewport
} from './utils/animationUtils';
import { 
  debounce,
  createBatchProcessor
} from './utils/performanceUtils';

// ==================== 性能优化工具导入 ====================
// 性能优化管理器 - 提供统一的性能优化管理
import { PerformanceOptimizerManager } from './utils/performanceOptimizerManager';
// MutationObserver优化器 - 优化DOM变化监听
import { OptimizedMutationObserver } from './utils/mutationObserverOptimizer';
// 高级防抖优化器 - 高级防抖和任务调度
import { AdvancedDebounceOptimizer } from './utils/advancedDebounceOptimizer';
// 内存泄漏防护器 - 防止内存泄漏
import { MemoryLeakProtector } from './utils/memoryLeakProtector';
// 批量处理器优化器 - DOM操作批量处理
import { BatchProcessorOptimizer } from './utils/batchProcessorOptimizer';
// 性能监控优化器 - 性能监控和分析
import { PerformanceMonitorOptimizer, type PerformanceMetric, type PerformanceReport } from './utils/performanceMonitorOptimizer';
import { 
  isDarkMode, 
  getCurrentThemeMode, 
  watchThemeChange, 
  getThemeColor, 
  applyOklchFormula, 
  type ThemeMode
} from './utils/themeUtils';
import { 
  LogLevel,
  DEFAULT_LOG_LEVEL,
  simpleLog,
  simpleError,
  simpleWarn
} from './utils/logUtils';
import { 
  createTabContainer, 
  createNewTabButton, 
  createDragHandle, 
  createResizeHandle, 
  createStatusElement,
  createFeatureToggleButton
} from './utils/uiCreationUtils';
import { 
  createWidthAdjustmentDialog,
  createConfirmDialog,
  createInputDialog,
  createProgressDialog,
  createNotification,
  createLoadingIndicator,
  createTooltip,
  createContextMenu,
  showConfirmDialog,
  showInputDialog,
  showNotification,
  showLoadingIndicator,
  showTooltip,
  showContextMenu,
  closeDialog,
  closeNotification,
  closeContextMenu,
  closeLoadingIndicator,
  closeTooltip,
  dialogManager,
  addDialogStyles,
  type DialogConfig,
  type ConfirmDialogConfig,
  type InputDialogConfig,
  type ProgressDialogConfig,
  type NotificationConfig,
  type TooltipConfig,
  type ContextMenuConfig,
  type ContextMenuItem,
  type DialogManager
} from './utils/dialogUtils';
import { 
  discoverPanels, 
  checkPanelStatus, 
  getAllPanelStatuses, 
  hasPanelListChanged, 
  getSidebarWidth, 
  isSidebarVisible, 
  getSidebarPosition, 
  calculateAlignmentPosition, 
  shouldAlignToSidebar, 
  type PanelStatus
} from './utils/panelManagementUtils';

/* ———————————————————————————————————————————————————————————————————————————— */
/* 全局变量和类定义 - Global Variables and Class Definition */
/* ———————————————————————————————————————————————————————————————————————————— */

// ==================== 全局变量 ====================
/** 插件名称 - 用于标识和调试 */
let pluginName: string;

/* ———————————————————————————————————————————————————————————————————————————— */
/* 主插件类 - Main Plugin Class */
/* ———————————————————————————————————————————————————————————————————————————— */

/**
 * Orca标签页插件主类
 * 
 * 这是插件的核心类，负责管理所有标签页相关的功能。主要职责包括：
 * 
 * 核心功能：
 * - 标签页生命周期管理（创建、更新、删除、切换）
 * - 多面板支持（支持多个面板的独立标签页管理）
 * - 拖拽排序（支持标签页的拖拽重新排序）
 * - 固定功能（支持固定重要标签页到特定位置）
 * - 最近关闭标签页（记录和恢复最近关闭的标签页）
 * - 工作区管理（保存和切换不同的标签页集合）
 * - 主题适配（自动适配Orca的明暗主题）
 * - 响应式布局（支持水平和垂直两种布局模式）
 * 
 * 技术特性：
 * - 使用TypeScript提供完整的类型安全
 * - 采用事件驱动架构，支持异步操作
 * - 内置性能优化（防抖、缓存、虚拟滚动等）
 * - 支持热重载和开发调试
 * - 完整的错误处理和日志记录
 * 
 * 生命周期：
 * 1. init() - 初始化插件，注册事件监听器和UI组件
 * 2. 运行时 - 处理用户交互、面板变化、主题切换等
 * 3. 销毁 - 清理事件监听器和DOM元素
 * 
 * @class OrcaTabsPlugin
 * @version 2.4.0
 * @since 2024
 */
class OrcaTabsPlugin {
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 核心数据属性 - Core Data Properties */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  /** 插件名称 - 动态获取的插件名称，用于API调用和存储 */
  private pluginName: string;
  
  // ==================== 重构的面板数据管理 ====================
  /** 面板顺序映射 - 存储面板ID和序号的映射关系，支持面板关闭后重新排序 */
  private panelOrder: { id: string, order: number }[] = [];
  
  /** 当前激活的面板ID - 通过.orca-panel.active获取 */
  private currentPanelId: string | null = null;
  
  /** 当前面板索引 - 在panelOrder数组中的索引位置 */
  private currentPanelIndex: number = -1;
  
  /** 每个面板的标签页数据 - 索引对应panelOrder数组，完全独立存储 */
  private panelTabsData: TabInfo[][] = [];
  
  /** 存储服务实例 - 提供统一的数据存储接口，支持Orca API和localStorage降级 */
  private storageService = new OrcaStorageService();
  
  /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
  private tabStorageService!: TabStorageService;
  
  /** 上次面板检查时间 - 用于防抖面板发现调用 */
  private lastPanelCheckTime: number = 0;
  
  /** 上次面板块检查时间 - 用于防抖 checkCurrentPanelBlocks 调用 */
  private lastBlockCheckTime: number = 0;
  
  /** 数据保存防抖定时器 - 用于合并频繁的保存操作 */
  private saveDataDebounceTimer: number | null = null;
  
  /** 数据保存防抖延迟（毫秒） - 默认300ms内的多次保存操作会被合并 */
  private readonly SAVE_DEBOUNCE_DELAY = 300;
  
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 日志管理 - Log Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  // ==================== 日志系统 ====================
  /** 当前日志级别 */
  private currentLogLevel: LogLevel = DEFAULT_LOG_LEVEL;
  
  /** 简单的日志方法 */
  private log(message: string, ...args: any[]): void {
    if (this.currentLogLevel >= LogLevel.INFO) {
      simpleLog(message, ...args);
    }
  }
  
  private logError(message: string, ...args: any[]): void {
    if (this.currentLogLevel >= LogLevel.ERROR) {
      simpleError(message, ...args);
    }
  }
  
  private logWarn(message: string, ...args: any[]): void {
    if (this.currentLogLevel >= LogLevel.WARN) {
      simpleWarn(message, ...args);
    }
  }
  
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(pluginName: string) {
    this.pluginName = pluginName;
    
    // 初始化性能优化器
    this.initializePerformanceOptimizers();
  }
  
  /**
   * 初始化性能优化器
   */
  private initializePerformanceOptimizers(): void {
    try {
      this.log('🚀 初始化性能优化器...');
      
      // 初始化性能优化管理器
      this.performanceOptimizer = PerformanceOptimizerManager.getInstance();
      this.performanceMonitor = PerformanceMonitorOptimizer.getInstance();
      
      this.log('✅ 性能优化器初始化完成');
    } catch (error) {
      this.error('❌ 性能优化器初始化失败:', error);
    }
  }


  /**
   * 确保性能监控实例可用
   */
  private ensurePerformanceMonitorInstance(): PerformanceMonitorOptimizer | null {
    if (this.performanceMonitor) {
      return this.performanceMonitor;
    }
    try {
      this.performanceMonitor = PerformanceMonitorOptimizer.getInstance();
      return this.performanceMonitor;
    } catch (error) {
      this.verboseLog('[Performance] monitor unavailable', error);
      return null;
    }
  }

  /**
   * 启动性能计时
   */
  private startPerformanceMeasurement(name: string): (() => number) | null {
    const monitor = this.ensurePerformanceMonitorInstance();
    if (!monitor) {
      return null;
    }
    try {
      return monitor.startMeasurement(name);
    } catch (error) {
      this.verboseLog(`[Performance] unable to start measurement: ${name}`, error);
      return null;
    }
  }

  /**
   * 记录计数型指标
   */
  private recordPerformanceCountMetric(name: string): void {
    const monitor = this.ensurePerformanceMonitorInstance();
    if (!monitor) {
      return;
    }
    const nextCount = (this.performanceCounters[name] ?? 0) + 1;
    this.performanceCounters[name] = nextCount;
    monitor.recordMetric(name, nextCount, 'count', 'count');
  }

  /**
   * 延迟输出性能基线报告
   */
  private schedulePerformanceBaselineReport(scenario: string, delayMs: number = 12000): void {
    const monitor = this.ensurePerformanceMonitorInstance();
    if (!monitor) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    if (this.performanceBaselineTimer !== null) {
      window.clearTimeout(this.performanceBaselineTimer);
    }
    this.performanceBaselineTimer = window.setTimeout(() => {
      this.emitPerformanceBaselineReport(scenario);
    }, delayMs);
  }

  /**
   * 输出性能基线报告
   */
  private emitPerformanceBaselineReport(scenario: string): void {
    if (typeof window !== 'undefined' && this.performanceBaselineTimer !== null) {
      window.clearTimeout(this.performanceBaselineTimer);
    }
    this.performanceBaselineTimer = null;
    const report = this.performanceOptimizer?.getPerformanceReport()
      ?? this.ensurePerformanceMonitorInstance()?.generateReport();
    if (!report) {
      this.verboseLog(`[Performance] baseline unavailable for scenario: ${scenario}`);
      return;
    }
    this.lastBaselineReport = report;
    this.lastBaselineScenario = scenario;
    const summary = this.formatPerformanceBaselineReport(report, scenario);
    this.log(summary);
  }

  /**
   * 构建性能基线日志
   */
  private formatPerformanceBaselineReport(report: PerformanceReport, scenario: string): string {
    const metricMap = this.getLatestMetricMap(report.metrics);
    const initMetric = metricMap.get(this.performanceMetricKeys.initTotal);
    const tabMetric = metricMap.get(this.performanceMetricKeys.tabInteraction);
    const domMetric = metricMap.get(this.performanceMetricKeys.domMutations);
    const fpsMetric = metricMap.get('fps');
    const heapMetric = metricMap.get('memory_heap');

    const initText = initMetric
      ? `${initMetric.value.toFixed(1)}${initMetric.unit}`
      : (this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : 'n/a');
    const tabText = tabMetric ? `${tabMetric.value.toFixed(0)}` : `${this.performanceCounters[this.performanceMetricKeys.tabInteraction] ?? 0}`;
    const domText = domMetric ? `${domMetric.value.toFixed(0)}` : '0';
    const fpsText = fpsMetric ? `${fpsMetric.value.toFixed(0)}fps` : 'n/a';
    const heapText = heapMetric ? this.formatBytes(heapMetric.value) : 'n/a';

    return [
      `[Performance][${scenario}] Baseline`,
      `  healthScore: ${report.healthScore}`,
      `  init_total: ${initText}`,
      `  tab_interactions: ${tabText}`,
      `  dom_mutations: ${domText}`,
      `  fps: ${fpsText}`,
      `  heap_used: ${heapText}`,
      `  issues: ${report.issues.length}`
    ].join('\n');

  }

  private getLatestMetricMap(metrics: PerformanceMetric[]): Map<string, PerformanceMetric> {
    const metricMap = new Map<string, PerformanceMetric>();
    for (const metric of metrics) {
      const previous = metricMap.get(metric.name);
      if (!previous || previous.timestamp <= metric.timestamp) {
        metricMap.set(metric.name, metric);
      }
    }
    return metricMap;
  }

  private formatBytes(value: number): string {
    if (value < 1024) {
      return `${value.toFixed(0)}B`;
    }
    if (value < 1024 * 1024) {
      return `${(value / 1024).toFixed(1)}KB`;
    }
    if (value < 1024 * 1024 * 1024) {
      return `${(value / 1024 / 1024).toFixed(1)}MB`;
    }
    return `${(value / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }

  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  private debugLog(...args: any[]) {
    if (this.currentLogLevel >= LogLevel.DEBUG) {
      simpleLog(args.join(' '), ...args);
    }
  }

  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  private verboseLog(...args: any[]) {
    if (this.currentLogLevel >= LogLevel.VERBOSE) {
      simpleLog(args.join(' '), ...args);
    }
  }
  
  /** 警告日志 - 记录警告信息，提醒潜在问题 */
  private warn(...args: any[]) {
    this.logWarn(args.join(' '));
  }
  
  /** 错误日志 - 记录错误信息，用于问题诊断 */
  private error(...args: any[]) {
    this.logError(args.join(' '));
  }
  
  /**
   * 设置日志级别
   */
  private setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
    this.log(`📊 日志级别已设置为: ${LogLevel[level]}`);
  }
  
  /**
   * 从存储中恢复调试模式设置
   */
  private async restoreDebugMode(): Promise<void> {
    try {
      const debugMode = await this.storageService.getConfig<boolean>(PLUGIN_STORAGE_KEYS.DEBUG_MODE, this.pluginName);
      if (debugMode) {
        this.setLogLevel(LogLevel.VERBOSE);
      }
    } catch (error) {
      // 静默失败，使用默认日志级别
    }
  }
  
  /**
   * 恢复聚焦标签页恢复设置
   */
  private async restoreRestoreFocusedTabSetting(): Promise<void> {
    try {
      const restoreFocusedTab = await this.storageService.getConfig<boolean>(PLUGIN_STORAGE_KEYS.RESTORE_FOCUSED_TAB, this.pluginName);
      if (restoreFocusedTab !== null && restoreFocusedTab !== undefined) {
        this.restoreFocusedTab = restoreFocusedTab;
      }
    } catch (error) {
      // 静默失败，使用默认值
    }
  }
  
  /**
   * 恢复功能开关设置
   */
  private async restoreFeatureToggleSettings(): Promise<void> {
    try {
      // 读取两个键，任意一个存在则以其为准，保持两者一致
      const v1 = await this.storageService.getConfig<boolean>(PLUGIN_STORAGE_KEYS.ENABLE_MIDDLE_CLICK_PIN, this.pluginName);
      const v2 = await this.storageService.getConfig<boolean>(PLUGIN_STORAGE_KEYS.ENABLE_DOUBLE_CLICK_CLOSE, this.pluginName);
      const merged = (v1 !== null && v1 !== undefined) ? v1 : v2;
      if (merged !== null && merged !== undefined) {
        this.enableMiddleClickPin = merged;
        this.enableDoubleClickClose = merged;
      }
      
      this.log(`🔧 功能开关设置已恢复: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`);
    } catch (error) {
      this.log('⚠️ 恢复功能开关设置失败:', error);
    }
  }
  
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* UI元素和状态管理 - UI Elements and State Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  // ==================== UI元素引用 ====================
  /** 标签页容器元素 - 包含所有标签页的主容器 */
  private tabContainer: HTMLElement | null = null;
  
  /** 循环切换器元素 - 用于在面板间切换的UI元素 */
  private cycleSwitcher: HTMLElement | null = null;
  
  // ==================== 拖拽状态 ====================
  /** 是否正在拖拽 - 标识当前是否处于拖拽状态 */
  private isDragging = false;
  
  /** 是否正在切换标签 - 防止在标签切换过程中错误替换标签 */
  private isSwitchingTab = false;
  
  /** 拖拽起始X坐标 - 记录拖拽开始时的鼠标X坐标 */
  private dragStartX = 0;
  
  /** 拖拽起始Y坐标 - 记录拖拽开始时的鼠标Y坐标 */
  private dragStartY = 0;
  
  // ==================== 配置参数 ====================
  /** 最大标签页数量 - 限制同时显示的标签页数量，从设置中读取 */
  private maxTabs = 10;
  
  /** 主页块ID - 主页块的唯一标识符，从设置中读取 */
  private homePageBlockId: string | null = null;
  
  /** 标签页位置 - 标签页容器的屏幕坐标位置 */
  private position: TabPosition = { x: 50, y: 50 };
  
  // ==================== 状态管理 ====================
  /** 监控定时器 - 用于定期检查面板状态和更新UI */
  private monitoringInterval: number | null = null;
  
  /** 焦点同步定时器 - 控制自动同步焦点的轮询逻辑 */
  private focusSyncInterval: number | null = null;
  
  /** 上一次焦点检测的状态 - 用于避免重复调用 checkCurrentPanelBlocks */
  private lastFocusState: { blockId: string | null; hasFocusedTab: boolean } | null = null;
  
  /** 面板块检测任务 - 防止 checkCurrentPanelBlocks 并发执行 */
  private panelBlockCheckTask: Promise<void> | null = null;
  
  /** 面板状态检测任务 - 防止 checkPanelStatusChange 并发执行 */
  private panelStatusCheckTask: Promise<void> | null = null;
  
  /** 正在创建的标签 - 防止重复创建同一个标签 */
  private creatingTabs: Set<string> = new Set();
  
  /** 全局事件监听器 - 统一的全局事件处理函数 */
  private globalEventListener: ((e: Event) => void) | null = null;
  
  /** 更新防抖计时器 - 防止频繁更新UI的防抖机制 */
  private updateDebounceTimer: number | null = null;
  
  /** 上次更新时间 - 记录最后一次UI更新的时间戳 */
  private lastUpdateTime: number = 0;
  
  /** 是否正在更新 - 标识当前是否正在进行UI更新操作 */
  private isUpdating: boolean = false;
  
  /** 是否已完成初始化 - 标识插件是否已完成初始化过程 */
  private isInitialized: boolean = false;
  
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 布局和位置管理 - Layout and Position Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  // ==================== 布局模式 ====================
  /** 垂直模式标志 - 标识当前是否处于垂直布局模式 */
  private isVerticalMode: boolean = false;
  
  /** 垂直模式窗口宽度 - 垂直布局模式下的标签页容器宽度 */
  private verticalWidth: number = 120;
  
  /** 垂直模式位置 - 垂直布局模式下的标签页容器位置 */
  private verticalPosition: TabPosition = { x: 20, y: 20 };
  
  /** 水平模式位置 - 水平布局模式下的标签页容器位置 */
  private horizontalPosition: TabPosition = { x: 20, y: 20 };
  
  /** 水平布局标签最大宽度 - 水平布局下标签的最大宽度 */
  private horizontalTabMaxWidth: number = 130;
  
  /** 水平布局标签最小宽度 - 水平布局下标签的最小宽度 */
  private horizontalTabMinWidth: number = 80;
  
  // ==================== 调整大小状态 ====================
  /** 是否正在调整大小 - 标识当前是否正在进行大小调整操作 */
  private isResizing: boolean = false;
  
  /** 是否固定到顶部 - 标识标签页容器是否固定到屏幕顶部 */
  private isFixedToTop: boolean = false;
  
  /** 调整大小手柄 - 用于调整标签页容器大小的拖拽手柄元素 */
  private resizeHandle: HTMLElement | null = null;
  
  // ==================== 侧边栏对齐 ====================
  /** 侧边栏对齐功能是否启用 - 控制是否自动与侧边栏对齐 */
  private isSidebarAlignmentEnabled: boolean = false;
  
  /** 侧边栏状态监听器 - 监听侧边栏状态变化的MutationObserver */
  private sidebarAlignmentObserver: MutationObserver | null = null;
  
  /** 上次检测到的侧边栏状态 - 用于检测侧边栏状态变化 */
  private lastSidebarState: string | null = null;
  
  /** 侧边栏防抖计时器 - 防止频繁响应侧边栏状态变化 */
  private sidebarDebounceTimer: number | null = null;
  
  // ==================== 窗口可见性 ====================
  /** 浮窗是否可见 - 控制标签页容器的显示/隐藏状态 */
  private isFloatingWindowVisible: boolean = true;
  
  // ==================== 功能开关 ====================
  /** 是否显示块类型图标 - 控制是否在标签页中显示块类型图标 */
  public showBlockTypeIcons: boolean = true;
  
  /** 是否在顶部栏显示按钮 - 控制是否在Orca顶部工具栏显示插件按钮 */
  public showInHeadbar: boolean = true;
  
  /** 是否启用最近关闭的标签页功能 - 控制是否记录和显示最近关闭的标签页 */
  public enableRecentlyClosedTabs: boolean = true;
  
  /** 是否启用多标签页保存功能 - 控制是否允许保存多个标签页组合 */
  public enableMultiTabSaving: boolean = true;
  
  /** 是否在刷新后恢复聚焦标签页 - 控制软件刷新后是否自动聚焦并打开当前聚焦的标签页 */
  public restoreFocusedTab: boolean = true;
  
  /** 新标签是否添加到末尾（一次性标志，使用后自动重置为false） */
  private addNewTabToEnd: boolean = true;
  
  /** 是否启用中键固定标签页功能 - 控制中键点击是否固定标签页 */
  private enableMiddleClickPin: boolean = false;
  
  /** 是否启用双击关闭标签页功能 - 控制双击是否关闭标签页 */
  private enableDoubleClickClose: boolean = false;
  
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 性能优化 - Performance Optimization */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  // ==================== 性能优化管理器 ====================
  /** 性能优化管理器 - 统一管理所有性能优化工具 */
  private performanceOptimizer: PerformanceOptimizerManager | null = null;
  
  /** MutationObserver优化器实例 - 用于优化DOM变化监听 */
  private optimizedObserver: OptimizedMutationObserver | null = null;
  
  /** 高级防抖优化器实例 - 用于任务防抖和调度 */
  private debounceOptimizer: AdvancedDebounceOptimizer | null = null;
  
  /** 内存泄漏防护器实例 - 用于跟踪和清理资源 */
  private memoryLeakProtector: MemoryLeakProtector | null = null;
  
  /** 批量处理器实例 - 用于批量DOM操作 */
  private batchProcessor: BatchProcessorOptimizer | null = null;
  
  /** 性能监控器实例 - 用于监控性能指标 */
  private performanceMonitor: PerformanceMonitorOptimizer | null = null;
  /** 性能指标计数缓存 - 记录自定义指标的累计值 */
  private performanceCounters: Record<string, number> = {};
  /** 性能基线定时器ID - 控制基线采集任务 */
  private performanceBaselineTimer: number | null = null;
  /** 最近一次性能基线场景 */
  private lastBaselineScenario: string | null = null;
  /** 最近一次性能基线报告 */
  private lastBaselineReport: PerformanceReport | null = null;
  /** 上一次插件初始化耗时（毫秒） */
  private lastInitDurationMs: number | null = null;
  /** 性能指标名称常量 */
  private readonly performanceMetricKeys = {
    initTotal: 'plugin_init_total',
    tabInteraction: 'tab_interaction_total',
    domMutations: 'dom_mutations'
  } as const;

  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 拖拽和事件管理 - Drag and Event Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  // ==================== 拖拽状态管理 ====================
  /** 当前正在拖拽的标签 - 存储正在被拖拽的标签页信息 */
  private draggingTab: TabInfo | null = null;
  
  /** 全局拖拽结束监听器 - 处理拖拽结束事件的全局监听器 */
  private dragEndListener: (() => void) | null = null;
  
  /** 拖拽交换防抖计时器 - 防止拖拽过程中频繁触发交换操作 */
  private swapDebounceTimer: number | null = null;
  
  /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
  private dropIndicator: HTMLElement | null = null;
  
  /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
  private dragOverTab: TabInfo | null = null;
  
  /** 上次交换的目标标签和位置 - 防止重复交换 */
  private lastSwapKey: string = '';
  
  
  
  /** 优化的拖拽监听器 - 避免全文档监听 */
  private dragOverListener: ((e: DragEvent) => void) | null = null;
  
  /** 懒加载状态 - 避免不必要的初始化 */
  private isDragListenersInitialized = false;
  
  /** 拖拽悬停计时器 - 控制拖拽悬停的延迟响应 */
  private dragOverTimer: number | null = null;
  
  /** 是否正在拖拽悬停状态 - 标识当前是否处于拖拽悬停状态 */
  private isDragOverActive = false;
  
  // ==================== 事件监听器 ====================
  /** 主题变化监听器 - 监听Orca主题变化的事件监听器 */
  private themeChangeListener: (() => void) | null = null;
  
  /** 滚动监听器 - 监听页面滚动事件的监听器 */
  private scrollListener: (() => void) | null = null;
  
  // ==================== 缓存和优化 ====================
  /** 上次面板发现时间 - 记录最后一次发现面板的时间戳 */
  private lastPanelDiscoveryTime = 0;
  
  /** 面板发现缓存 - 缓存面板发现结果，避免频繁扫描 */
  private panelDiscoveryCache: { panelIds: string[], timestamp: number } | null = null;
  
  /** 设置检查定时器 - 定期检查设置变化的定时器 */
  private settingsCheckInterval: number | null = null;
  
  /** 上次的设置状态 - 缓存上次的设置状态，用于检测变化 */
  private lastSettings: any = null;
  
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  // ==================== 已关闭标签页跟踪 ====================
  /** 已关闭的标签页blockId集合 - 用于跟踪已关闭的标签页，避免重复创建 */
  private closedTabs: Set<string> = new Set();
  
  /** 最近关闭的标签页列表 - 按时间倒序存储最近关闭的标签页信息 */
  private recentlyClosedTabs: TabInfo[] = [];
  
  /** 保存的多标签页集合 - 存储用户保存的标签页组合 */
  private savedTabSets: SavedTabSet[] = [];
  
  /** 记录上一个标签集合 - 用于比较标签页变化 */
  private previousTabSet: TabInfo[] | null = null;
  
  // ==================== 工作区功能 ====================
  /** 工作区列表 - 存储所有用户创建的工作区 */
  private workspaces: Workspace[] = [];
  
  /** 当前工作区ID - 标识当前激活的工作区 */
  private currentWorkspace: string | null = null;
  
  /** 是否启用工作区功能 - 控制工作区功能的开关 */
  private enableWorkspaces: boolean = true;
  
  /** 进入工作区之前的标签页组 - 用于退出工作区时恢复到原始标签页组 */
  private tabsBeforeWorkspace: TabInfo[] | null = null;
  
  /** 是否需要在初始化后恢复标签页组 - 用于处理在工作区状态下关闭软件的情况 */
  private shouldRestoreTabsBeforeWorkspace: boolean = false;
  
  // ==================== 对话框管理 ====================
  /** 对话框层级管理器 - 管理对话框的z-index层级 */
  private dialogZIndex = 2000;

  /**
   * 获取下一个对话框层级
   * 每次调用都会增加100，确保新对话框显示在最前面
   * @returns 下一个可用的z-index值
   */
  private getNextDialogZIndex(): number {
    this.dialogZIndex += 100;
    return this.dialogZIndex;
  }
  
  /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
  private lastActiveBlockId: string | null = null;
  
  /** 是否正在导航中 - 用于避免导航时触发重复的聚焦检测 */
  private isNavigating: boolean = false;
  
  // ==================== 快捷键相关 ====================
  /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
  private hoveredBlockId: string | null = null;

  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 初始化和生命周期管理 - Initialization and Lifecycle Management */
  /* ———————————————————————————————————————————————————————————————————————————— */

  /**
   * 初始化插件
   * 
   * 这是插件的主入口方法，负责完成所有初始化工作。初始化过程包括：
   * 1. 样式初始化 - 添加必要的CSS样式
   * 2. 配置读取 - 从Orca设置中读取插件配置
   * 3. 设置注册 - 注册插件相关的设置项
   * 4. 命令注册 - 注册块菜单命令和快捷键
   * 5. 状态恢复 - 恢复之前保存的插件状态
   * 6. UI初始化 - 创建和注册UI组件
   * 7. 面板发现 - 发现并初始化面板
   * 8. 事件监听 - 设置各种事件监听器
   * 
   * @async
   * @returns {Promise<void>} 初始化完成
   * @throws {Error} 当初始化过程中发生错误时抛出
   */
  async init() {
    // ==================== 日志级别恢复 ====================
    // 先恢复调试模式设置，这样后续的日志输出会根据级别控制
    await this.restoreDebugMode();
    
    // 恢复聚焦标签页恢复设置
    await this.restoreRestoreFocusedTabSetting();
    
    // 恢复功能开关设置
    await this.restoreFeatureToggleSettings();
    
    const stopInitMeasurement = this.startPerformanceMeasurement(this.performanceMetricKeys.initTotal);
    
    // ==================== 样式初始化 ====================
    // 添加对话框样式 - 为所有对话框组件添加基础样式
    addDialogStyles();
    
    // ==================== 服务初始化 ====================
    // 初始化标签页存储服务
    this.tabStorageService = new TabStorageService(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    
    // ==================== 配置读取 ====================
    // 从设置中读取最大标签数 - 从Orca全局设置中读取用户配置的最大标签页数量
    try {
      this.maxTabs = orca.state.settings[AppKeys.CachedEditorNum] || 10;
    } catch (e) {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }

    // ==================== 设置注册 ====================
    // 注册插件设置 - 向Orca注册插件相关的设置项，供用户在设置界面中配置
    await this.registerPluginSettings();

    // ==================== 命令注册 ====================
    // 注册块菜单命令 - 注册右键菜单中的命令，如"添加到标签页"等
    this.registerBlockMenuCommands();

    // ==================== 先加载工作区数据 ====================
    // 必须先加载工作区数据，以便后续判断是否在工作区状态
    await this.loadWorkspaces();
    
    // ==================== 并行状态恢复 ====================
    // 将独立的恢复操作并行执行以减少初始化时间
    const [
      _position,
      _layoutMode,
      _fixedToTop,
      _floatingVisibility
    ] = await Promise.all([
      this.restorePosition(),
      this.restoreLayoutMode(),
      this.restoreFixedToTopMode(),
      this.restoreFloatingWindowVisibility()
    ]);
    
    // 注意：页面刷新后不自动加载当前工作区，用户需要手动切换工作区
    
    // ==================== UI初始化 ====================
    // 注册顶部工具栏按钮 - 在Orca顶部工具栏添加插件按钮
    this.registerHeadbarButton();
    
    // 发现所有面板 - 扫描页面中的所有面板，建立面板映射
    await this.discoverPanels();
    
    // ==================== 面板初始化 ====================
    // 初始化第1个面板（持久化面板）
    const firstPanelId = this.getFirstPanel();
    if (firstPanelId) {
      this.log(`🎯 初始化第1个面板（持久化面板）: ${firstPanelId}`);
    } else {
      this.log(`⚠️ 初始化时没有发现面板`);
    }
    
    // 面板是动态创建的，不需要延迟检查
    // 监听器会自动检测新面板的创建
    
    
    // ==================== 检查是否需要恢复标签页组 ====================
    // 如果发现保存的标签页组，说明用户是在工作区状态下关闭的软件
    // 应该直接恢复标签页组，而不是加载可能被污染的普通标签页
    if (this.shouldRestoreTabsBeforeWorkspace && this.tabsBeforeWorkspace) {
      this.log(`🔄 检测到保存的标签页组，直接恢复而不加载普通标签页`);
      
      // 直接使用保存的标签页组
      if (this.panelTabsData.length === 0) {
        this.panelTabsData.push([]);
      }
      this.panelTabsData[0] = [...this.tabsBeforeWorkspace];
      
      // 清除恢复标记和保存的数据
      this.shouldRestoreTabsBeforeWorkspace = false;
      this.tabsBeforeWorkspace = null;
      await this.tabStorageService.clearTabsBeforeWorkspace();
      
      this.log(`✅ 已直接恢复到进入工作区前的标签页组`);
    } else {
      // ==================== 正常加载标签页数据 ====================
      // 只有在没有保存的标签页组时才加载普通标签页
      const [
        firstPanelTabs,
        closedTabs,
        recentlyClosedTabs,
        savedTabSets
      ] = await Promise.all([
        this.tabStorageService.restoreFirstPanelTabs(),
        this.tabStorageService.restoreClosedTabs(),
        this.tabStorageService.restoreRecentlyClosedTabs(),
        this.tabStorageService.restoreSavedTabSets()
      ]);
      
      if (this.panelTabsData.length === 0) {
        this.panelTabsData.push([]);
      }
      this.panelTabsData[0] = firstPanelTabs;
      this.closedTabs = closedTabs;
      this.recentlyClosedTabs = recentlyClosedTabs;
      this.savedTabSets = savedTabSets;
      
      await this.updateRestoredTabsBlockTypes();
    }
    
    // 测试API配置序列化（开发模式）- 延迟到空闲时间
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
      requestIdleCallback(() => {
        this.storageService.testConfigSerialization();
      }, { timeout: 2000 });
    }
    
    // 设置当前活动面板，排除特殊面板
    const currentActivePanel = document.querySelector('.orca-panel.active');
    const activePanelId = currentActivePanel?.getAttribute('data-panel-id');
    if (activePanelId && !activePanelId.startsWith('_')) {
      this.currentPanelId = activePanelId;
      this.currentPanelIndex = this.getPanelIds().indexOf(activePanelId);
      this.log(`🎯 当前活动面板: ${activePanelId} (索引: ${this.currentPanelIndex})`);
    }
    
    // 确保panelTabsData数组有足够的大小
    this.ensurePanelTabsDataSize();
    
    // ==================== 延迟加载其他面板数据 ====================
    // 将其他面板的数据加载延迟到空闲时间，优先完成首屏渲染
    if (this.panelOrder.length > 1) {
      requestIdleCallback(async () => {
        this.log(`📂 延迟加载其他面板的标签页数据`);
      for (let i = 1; i < this.panelOrder.length; i++) {
        const storageKey = `panel_${i + 1}_tabs`;
        try {
          const savedTabs = await this.storageService.getConfig<TabInfo[]>(storageKey, this.pluginName, []);
          this.log(`📂 从存储获取到第 ${i + 1} 个面板的数据: ${savedTabs ? savedTabs.length : 0} 个标签页`);
          
          if (savedTabs && savedTabs.length > 0) {
            this.panelTabsData[i] = [...savedTabs];
            this.log(`✅ 成功加载第 ${i + 1} 个面板的标签页数据: ${savedTabs.length} 个`);
          } else {
            this.panelTabsData[i] = [];
            this.log(`📂 第 ${i + 1} 个面板没有保存的数据`);
          }
        } catch (error) {
          this.warn(`❌ 加载第 ${i + 1} 个面板数据失败:`, error);
          this.panelTabsData[i] = [];
        }
      }
      }, { timeout: 1000 });
    }
    
    // 扫描当前活动面板的标签页（如果不是第一个面板）
    if (activePanelId && this.currentPanelIndex !== 0) {
      this.log(`🔍 扫描当前活动面板 ${activePanelId} 的标签页`);
      await this.scanCurrentPanelTabs();
    } else if (activePanelId && this.currentPanelIndex === 0) {
      this.log(`📋 当前活动面板是第一个面板，使用持久化数据`);
      
      // 根据设置决定是否恢复聚焦页面
      if (this.restoreFocusedTab) {
        // 检查当前激活的页面是否在持久化标签页中
        const currentActivePanel = document.querySelector('.orca-panel.active');
        if (currentActivePanel) {
          const activeBlockEditor = currentActivePanel.querySelector('.orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]');
          if (activeBlockEditor) {
            const blockId = activeBlockEditor.getAttribute('data-block-id');
            if (blockId) {
              const currentTabs = this.getCurrentPanelTabs();
              const existingTab = currentTabs.find(tab => tab.blockId === blockId);
              if (!existingTab) {
                this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${blockId}`);
                await this.checkCurrentPanelBlocks();
              }
            }
          }
        }
      } else {
        this.log(`📋 已关闭"刷新后恢复聚焦标签页"，跳过当前聚焦页面的恢复`);
      }
    }
    
    // ==================== 启动时自动检测聚焦页面 ====================
    // 软件启动后自动检测当前面板中聚焦的页面并显示在标签页中
    // 这确保用户打开软件时，当前聚焦的页面（如"今日"）会自动显示在标签页中
    if (this.restoreFocusedTab) {
      await this.autoDetectAndSyncCurrentFocus();
    } else {
      this.log(`📋 已关闭"刷新后恢复聚焦标签页"，跳过自动检测聚焦页面`);
    }
    
    // 创建标签页UI
    await this.createTabsUI();
    
    // 监听DOM变化（只监听第一个面板的新增）
    this.observeChanges();
    
    // 监听窗口大小变化
    this.observeWindowResize();
    
    // ==================== 优化的DOM监听初始化 ====================
    // 启动优化的DOM变化监听
    this.initializeOptimizedDOMObserver();
    
    // 启动主动的面板状态检测
    this.startActiveMonitoring();
    
    // 设置全局拖拽结束监听器
    this.setupDragEndListener();
    
    // 监听主题变化
    this.setupThemeChangeListener();
    
      // 设置滚动监听器
      this.setupScrollListener();
      
      // ==================== 初始化 Tooltips ====================
      // 延迟初始化 Tooltips，确保 DOM 完全加载
      setTimeout(() => {
        try {
          initializeTooltips();
          // 为用户工具栏按钮添加 tooltip
          this.initializeHeadbarUserToolsTooltips();
          this.log('✅ Tooltips 初始化完成');
        } catch (error) {
          this.log('⚠️ Tooltips 初始化失败:', error);
        }
      }, 1000);
    
    // 设置设置检查监听器
    this.setupSettingsChecker();
    
    if (stopInitMeasurement) {
      this.lastInitDurationMs = stopInitMeasurement();
    }
    this.schedulePerformanceBaselineReport('startup');
    
    // 标记初始化完成
    this.isInitialized = true;
    this.log("✅ 插件初始化完成");
    
    // ==================== 延迟初始化性能优化器 ====================
    // 将性能优化管理器的初始化延迟到空闲时间，避免阻塞主线程
    requestIdleCallback(async () => {
      if (this.performanceOptimizer) {
        try {
          await this.performanceOptimizer.initialize({
            mutationObserver: {
              enableBatch: true,
              batchDelay: 16,
              maxBatchSize: 50,
              enableSmartFilter: true,
              coolingPeriod: 100
            },
            debounce: [
              { name: 'immediate', delay: 0, priority: 10, cancelable: false },
              { name: 'high', delay: 8, priority: 8, cancelable: true, maxWait: 100 },
              { name: 'normal', delay: 16, priority: 5, cancelable: true, maxWait: 200 },
              { name: 'low', delay: 32, priority: 3, cancelable: true, maxWait: 500 }
            ],
            memoryLeak: {
              autoCleanupInterval: 30000,
              enableAutoCleanup: true
            },
            lazyLoading: {
              enableCache: true,
              maxConcurrency: 3,
              preloadStrategy: 'idle'
            },
            batchProcessing: {
              maxBatchSize: 50,
              maxWaitTime: 16,
              enableVirtualization: true
            },
            performanceMonitoring: {
              enableMonitoring: true,
              enableAutoOptimization: true,
              reportInterval: 30000
            }
          });
          this.log('✅ 性能优化管理器延迟初始化完成');
        } catch (error) {
          this.error('❌ 性能优化管理器延迟初始化失败:', error);
        }
      }
    }, { timeout: 2000 });
  }


  /**
   * 手动触发性能基线采集
   */
  requestPerformanceBaseline(scenario: string, delayMs: number = 12000): void {
    this.schedulePerformanceBaselineReport(scenario, delayMs);
  }

  /**
   * 软件启动时自动检测当前面板中可见的页面并同步到标签页
   * 
   * 功能说明：
   * - 检测当前激活面板中可见的 orca-hideable 页面
   * - 如果该页面不在标签页中，自动创建标签页
   * - 确保用户打开软件时，当前显示的页面会自动显示在标签页中
   * 
   * 使用场景：
   * - 软件启动后自动执行
   * - 检测当前面板中可见的页面（不固定为"今日"）
   * - 确保标签页与当前显示内容同步
   * - 提供更好的用户体验
   */
  private async autoDetectAndSyncCurrentFocus() {
    try {
      // 【修复BUG】如果正在导航中，跳过自动检测，避免重复创建标签页
      if (this.isNavigating) {
        this.log('⏭️ 正在导航中，跳过自动检测当前聚焦页面');
        return;
      }
      
      this.log("🔍 开始自动检测当前面板中可见的页面并同步到标签页");
      
      // 步骤1: 获取当前激活的面板
      const currentActivePanel = document.querySelector('.orca-panel.active');
      if (!currentActivePanel) {
        this.log("⚠️ 没有找到当前激活的面板，跳过自动检测");
        return;
      }
      
      // 步骤2: 获取面板ID
      const currentPanelId = currentActivePanel.getAttribute('data-panel-id');
      if (!currentPanelId) {
        this.log("⚠️ 激活面板没有 data-panel-id，跳过自动检测");
        return;
      }
      
      // 步骤3: 更新当前面板索引
      const panelIndex = this.getPanelIds().indexOf(currentPanelId);
      if (panelIndex !== -1) {
        this.currentPanelIndex = panelIndex;
        this.currentPanelId = currentPanelId;
        this.log(`🔄 更新当前面板索引: ${panelIndex} (面板ID: ${currentPanelId})`);
      }
      
      // 步骤4: 获取当前面板中可见的 orca-hideable 页面
      // 查找所有可见的 hideable 元素，然后过滤掉位于弹窗内的元素
      const hideables = currentActivePanel.querySelectorAll('.orca-hideable:not([style*="display: none"])');
      let activeHideable = null;
      
      for (const hideable of hideables) {
        // 跳过位于 .orca-popup.orca-block-preview-popup 内的元素
        if (this.isInsidePopup(hideable)) {
          continue;
        }
        
        const blockEditor = hideable.querySelector('.orca-block-editor[data-block-id]');
        if (blockEditor) {
          activeHideable = blockEditor;
          break;
        }
      }
      
      if (!activeHideable) {
        this.log(`⚠️ 激活面板 ${currentPanelId} 中没有找到可见的块编辑器，跳过自动检测`);
        return;
      }
      
      // 步骤5: 获取块ID
      const blockId = activeHideable.getAttribute('data-block-id');
      if (!blockId) {
        this.log("⚠️ 激活的块编辑器没有blockId，跳过自动检测");
        return;
      }
      
      this.log(`🔍 检测到当前可见的块ID: ${blockId}`);
      
      // 步骤6: 获取当前面板的标签页数据
      let currentTabs = this.getCurrentPanelTabs();
      
      // 步骤7: 如果当前面板没有标签数据，先扫描面板数据
      if (currentTabs.length === 0) {
        this.log(`📋 当前面板没有标签数据，先扫描面板数据`);
        await this.scanCurrentPanelTabs();
        currentTabs = this.getCurrentPanelTabs();
      }
      
      // 步骤8: 检查可见的页面是否已存在于标签页中
      const existingTab = currentTabs.find(tab => tab.blockId === blockId);
      if (existingTab) {
        this.log(`📋 当前可见页面已存在于标签页中: "${existingTab.title}" (${blockId})`);
        
        // 更新聚焦状态
        this.updateFocusState(blockId, existingTab.title);
        
        // 立即更新UI显示
        await this.immediateUpdateTabsUI();
        
        this.log(`✅ 成功同步已存在的标签页: "${existingTab.title}"`);
        return;
      }
      
      // 步骤9: 可见的页面不存在于标签页中，需要创建新标签页
      this.log(`📋 当前可见页面不在标签页中，需要创建新标签页: ${blockId}`);
      
      // 使用 getTabInfo 方法获取完整的标签信息（包括块类型和图标）
      const newTabInfo = await this.getTabInfo(blockId, currentPanelId, 0);
      if (!newTabInfo) {
        this.log("⚠️ 无法获取块信息，跳过自动检测");
        return;
      }
      
      this.log(`🔍 获取到标签信息: "${newTabInfo.title}" (类型: ${newTabInfo.blockType || 'unknown'})`);
      
      // 检查是否达到标签上限
      if (currentTabs.length >= this.maxTabs) {
        // 达到标签上限，替换最后一个标签页
        const lastIndex = currentTabs.length - 1;
        const oldTab = currentTabs[lastIndex];
        currentTabs[lastIndex] = newTabInfo;
        newTabInfo.order = lastIndex;
        
        this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${oldTab.title}" -> "${newTabInfo.title}"`);
      } else {
        // 未达到标签上限，将新标签页添加到数组末尾
        newTabInfo.order = currentTabs.length;
        currentTabs.push(newTabInfo);
        
        this.log(`➕ 添加新标签页到末尾: "${newTabInfo.title}" (当前标签数: ${currentTabs.length}/${this.maxTabs})`);
      }
      
      // 保存标签页数据
      this.setCurrentPanelTabs(currentTabs);
      await this.saveCurrentPanelTabs();
      
      // 更新聚焦状态
      this.updateFocusState(blockId, newTabInfo.title);
      
      // 立即更新UI显示
      await this.immediateUpdateTabsUI();
      
      this.log(`✅ 成功创建并同步新标签页: "${newTabInfo.title}" (${blockId})`);
      
    } catch (error) {
      this.error("自动检测当前可见页面时发生错误:", error);
    }
  }

  /**
   * 检查元素是否位于弹窗内
   * 
   * @param element 要检查的元素
   * @returns 如果元素位于弹窗内返回 true，否则返回 false
   */
  private isInsidePopup(element: Element): boolean {
    // 检查元素本身是否是弹窗
    if (element.classList.contains('orca-popup') || 
        element.classList.contains('orca-block-preview-popup')) {
      return true;
    }
    
    // 检查元素的父级是否包含弹窗
    let parent = element.parentElement;
    while (parent) {
      if (parent.classList.contains('orca-popup') || 
          parent.classList.contains('orca-block-preview-popup')) {
        return true;
      }
      parent = parent.parentElement;
    }
    
    return false;
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
   * 为用户工具栏按钮添加 tooltip
   * 使用与标签页标题相同的 tooltip 风格
   */
  private initializeHeadbarUserToolsTooltips() {
    try {
      // 查找用户工具栏容器
      const userTools = document.querySelector('.orca-headbar-user-tools');
      
      if (!userTools) {
        this.log('⚠️ 未找到用户工具栏容器 (.orca-headbar-user-tools)');
        return;
      }

      // 查找所有按钮
      const buttons = userTools.querySelectorAll('button, [role="button"]');
      this.log(`📌 找到 ${buttons.length} 个用户工具栏按钮`);

      buttons.forEach((button, index) => {
        const buttonEl = button as HTMLElement;
        
        // 获取按钮的原始 title 属性
        const originalTitle = buttonEl.getAttribute('title');
        
        if (originalTitle) {
          // 移除原始 title 属性，避免浏览器默认 tooltip
          buttonEl.removeAttribute('title');
          
          // 添加自定义 tooltip
          addTooltip(buttonEl, {
            text: originalTitle,
            delay: 300,
            defaultPlacement: 'bottom'
          });
          
          this.log(`✅ 已为用户工具栏按钮 ${index + 1} 添加 tooltip: "${originalTitle}"`);
        }
      });

      this.log('✅ 用户工具栏按钮 tooltip 初始化完成');
    } catch (error) {
      this.error('⚠️ 初始化用户工具栏按钮 tooltip 失败:', error);
    }
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
      }, 300) as any as number; // 300ms防抖
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
      this.dragOverTab = null;
      this.lastSwapKey = '';
      this.clearDragVisualFeedback();
      this.log("🔄 全局拖拽结束，清除拖拽状态");
    };
    document.addEventListener("dragend", this.dragEndListener);
  }

  /**
   * 优化的拖拽监听器设置
   */
  setupOptimizedDragListeners() {
    // 使用节流优化dragover事件
    let dragoverThrottle: number | null = null;
    
    this.dragOverListener = (e: DragEvent) => {
      if (!this.draggingTab) return;
      
      // 默认允许移动（保持move光标，避免禁止符号）
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';
      
      // 检查是否在标签容器内
      if (this.tabContainer) {
        const containerRect = this.tabContainer.getBoundingClientRect();
        const isInside = (
          e.clientX >= containerRect.left &&
          e.clientX <= containerRect.right &&
          e.clientY >= containerRect.top &&
          e.clientY <= containerRect.bottom
        );
        
        if (!isInside) {
          this.clearDropIndicator();
          return;
        }
        
        // 检查鼠标下方是否有非标签元素
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const hasNonTabElement = elements.some(el => 
          el.classList.contains('new-tab-button') ||
          el.classList.contains('drag-handle') ||
          el.classList.contains('resize-handle')
        );
        
        if (hasNonTabElement) {
          this.clearDropIndicator();
          return;
        }
      }
      
      // 节流处理，避免频繁触发
      if (dragoverThrottle) return;
      dragoverThrottle = requestAnimationFrame(() => {
        dragoverThrottle = null;
        
        // 检测鼠标下方的标签元素 - 严格过滤
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const tabElement = elements.find(el => {
          // 必须是标签元素
          if (!el.classList.contains('orca-tab')) return false;
          // 必须有blockId
          if (!el.hasAttribute('data-block-id')) return false;
          // 排除被拖拽的标签（通过opacity判断）
          const style = (el as HTMLElement).style;
          if (style.opacity === '0' && style.pointerEvents === 'none') return false;
          // 排除按钮等子元素
          if (el.classList.contains('close-button') || 
              el.classList.contains('new-tab-button') || 
              el.classList.contains('drag-handle') ||
              el.classList.contains('resize-handle')) return false;
          return true;
        }) as HTMLElement;
        
        if (tabElement) {
          const blockId = tabElement.getAttribute('data-block-id');
          const currentTabs = this.getCurrentPanelTabs();
          const targetTab = currentTabs.find(t => t.blockId === blockId);
          
          if (targetTab && targetTab.blockId !== this.draggingTab!.blockId) {
            // 计算位置
            const rect = tabElement.getBoundingClientRect();
            const isVertical = this.isVerticalMode && !this.isFixedToTop;
            let position: 'before' | 'after';
            
            if (isVertical) {
              const midY = rect.top + rect.height / 2;
              position = e.clientY < midY ? 'before' : 'after';
            } else {
              const midX = rect.left + rect.width / 2;
              position = e.clientX < midX ? 'before' : 'after';
            }
            
            // 更新指示器并执行实时交换
            this.updateDropIndicator(tabElement, position);
            
            // 使用防抖优化，避免频繁交换
            const swapKey = `${targetTab.blockId}-${position}`;
            if (this.lastSwapKey !== swapKey) {
              this.lastSwapKey = swapKey;
              
              // 清除之前的定时器
              if (this.swapDebounceTimer) {
                clearTimeout(this.swapDebounceTimer);
              }
              
              // 延迟执行交换
              this.swapDebounceTimer = setTimeout(async () => {
                await this.swapTabsRealtime(targetTab, this.draggingTab!, position);
              }, 100) as any as number;
            }
          }
        }
      });
    };
    
  }

  /**
   * 处理拖拽经过事件
   */

  /**
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    if (this.tabContainer) {
      // 移除所有拖拽相关的CSS类和属性
      const tabs = this.tabContainer.querySelectorAll('.orca-tab');
      tabs.forEach(tab => {
        const tabElement = tab as HTMLElement;
        tabElement.removeAttribute('data-dragging');
        tabElement.removeAttribute('data-drag-over');
        tabElement.classList.remove('dragging', 'drag-over');
        
        // 恢复被隐藏标签的样式
        if (tabElement.style.opacity === '0' && tabElement.style.pointerEvents === 'none') {
          tabElement.style.opacity = '';
          tabElement.style.pointerEvents = '';
        }
      });
      
      // 移除容器拖拽状态
      this.tabContainer.removeAttribute('data-dragging');
    }
    
    // 清除拖拽指示器
    this.clearDropIndicator();
  }


  /**
   * 创建拖拽位置指示器
   */
  createDropIndicator(tabElement: HTMLElement, position: 'before' | 'after'): HTMLElement {
    const indicator = document.createElement('div');
    indicator.className = 'orca-tab-drop-indicator';
    indicator.style.cssText = `
      position: absolute;
      height: 2px;
      background: var(--orca-color-primary-5);
      border-radius: 1px;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
      transition: all 0.2s ease;
    `;
    
    const rect = tabElement.getBoundingClientRect();
    const container = tabElement.parentElement;
    if (container) {
      const containerRect = container.getBoundingClientRect();
      
      if (position === 'before') {
        indicator.style.left = `${rect.left - containerRect.left}px`;
        indicator.style.top = `${rect.top - containerRect.top - 1}px`;
        indicator.style.width = `${rect.width}px`;
      } else {
        indicator.style.left = `${rect.left - containerRect.left}px`;
        indicator.style.top = `${rect.bottom - containerRect.top - 1}px`;
        indicator.style.width = `${rect.width}px`;
      }
      
      container.appendChild(indicator);
    }
    
    return indicator;
  }

  /**
   * 更新拖拽位置指示器（使用CSS伪元素）
   */
  updateDropIndicator(tabElement: HTMLElement, position: 'before' | 'after') {
    // 清除之前的指示器
    this.clearDropIndicator();
    
    // 设置新的指示器
    tabElement.setAttribute('data-drop-target', position);
  }

  /**
   * 清除拖拽位置指示器
   */
  clearDropIndicator() {
    if (this.tabContainer) {
      const tabs = this.tabContainer.querySelectorAll('.orca-tab');
      tabs.forEach(tab => {
        tab.removeAttribute('data-drop-target');
      });
    }
  }




  /**
   * 实时交换标签位置（拖拽过程中）- DOM级别平滑动画
   */
  async swapTabsRealtime(targetTab: TabInfo, draggingTab: TabInfo, position: 'before' | 'after') {
    if (!this.tabContainer) return;
    
    const currentTabs = this.getCurrentPanelTabs();
    const dragIndex = currentTabs.findIndex(tab => tab.blockId === draggingTab.blockId);
    const targetIndex = currentTabs.findIndex(tab => tab.blockId === targetTab.blockId);
    
    if (dragIndex === -1 || targetIndex === -1) return;
    if (dragIndex === targetIndex) return;
    
    // 计算置顶标签的数量
    const pinnedCount = currentTabs.filter(t => t.isPinned).length;
    
    // 计算实际插入位置
    let insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
    
    // 如果拖拽源在目标之前，需要调整插入位置
    if (dragIndex < insertIndex) {
      insertIndex--;
    }
    
    // 置顶标签只能在置顶区域内拖动
    if (draggingTab.isPinned) {
      // 置顶标签不能拖到非置顶区域
      if (insertIndex >= pinnedCount) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶区域: ${draggingTab.title}`);
        return;
      }
      // 置顶标签不能拖到非置顶标签上
      if (!targetTab.isPinned) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶标签上: ${draggingTab.title} -> ${targetTab.title}`);
        return;
      }
    }
    
    // 非置顶标签只能在非置顶区域内拖动
    if (!draggingTab.isPinned) {
      // 非置顶标签不能拖到置顶区域
      if (insertIndex < pinnedCount) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶区域: ${draggingTab.title}`);
        return;
      }
      // 非置顶标签不能拖到置顶标签上
      if (targetTab.isPinned) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶标签上: ${draggingTab.title} -> ${targetTab.title}`);
        return;
      }
    }
    
    // 如果位置没变，跳过
    if (dragIndex === insertIndex) return;
    
    this.verboseLog(`🔄 [实时交换] ${draggingTab.title}: ${dragIndex} -> ${insertIndex}`);
    
    // 更新数据
    const [draggedTab] = currentTabs.splice(dragIndex, 1);
    currentTabs.splice(insertIndex, 0, draggedTab);
    await this.setCurrentPanelTabs(currentTabs);
    
    // DOM级别的移动 - 直接操作DOM顺序，触发CSS过渡
    const draggedElement = this.tabContainer.querySelector(`[data-block-id="${draggingTab.blockId}"]`);
    const targetElement = this.tabContainer.querySelector(`[data-block-id="${targetTab.blockId}"]`);
    
    if (draggedElement && targetElement) {
      // 使用DOM操作而不是重新渲染，这样CSS transition才能生效
      if (position === 'before') {
        targetElement.parentNode?.insertBefore(draggedElement, targetElement);
      } else {
        targetElement.parentNode?.insertBefore(draggedElement, targetElement.nextSibling);
      }
    }
  }

  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(targetTab: TabInfo, draggingTab: TabInfo) {
    const currentTabs = this.getCurrentPanelTabs();
    
    const targetIndex = currentTabs.findIndex(tab => tab.blockId === targetTab.blockId);
    const draggingIndex = currentTabs.findIndex(tab => tab.blockId === draggingTab.blockId);
    
    if (targetIndex === -1 || draggingIndex === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    
    if (targetIndex === draggingIndex) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    
    this.log(`🔄 交换标签: ${draggingTab.title} (${draggingIndex}) -> ${targetTab.title} (${targetIndex})`);
    
    // 改进的交换逻辑：直接交换位置
    const draggedTab = currentTabs[draggingIndex];
    const targetTabData = currentTabs[targetIndex];
    
    // 交换位置
    currentTabs[targetIndex] = draggedTab;
    currentTabs[draggingIndex] = targetTabData;
    
    // 更新order属性
    currentTabs.forEach((tab, index) => {
      tab.order = index;
    });
    
    // 重新排序（保持固定标签在前）
    this.sortTabsByPinStatus();
    
    // 同步更新对应的存储数组
    this.syncCurrentTabsToStorage(currentTabs);
    
     // 保存当前面板的数据（基于位置顺序）
     await this.saveCurrentPanelTabs();
    
    // 立即更新UI以提供即时反馈
    this.debouncedUpdateTabsUI();
    
    // 如果启用了工作区功能且有当前工作区，实时更新工作区
    if (this.enableWorkspaces && this.currentWorkspace) {
      await this.saveCurrentTabsToWorkspace();
      this.log(`🔄 标签页拖拽排序，实时更新工作区`);
    }
    
    this.log(`✅ 标签交换完成: ${draggedTab.title} -> 位置 ${targetIndex}`);
  }

  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 面板管理 - Panel Management */
  /* ———————————————————————————————————————————————————————————————————————————— */

  /**
   * 发现并更新面板信息
   * 排除特殊面板（如全局搜索面板），只处理正常的内容面板
   */
  async discoverPanels() {
    // 获取所有面板元素
    const panels = document.querySelectorAll('.orca-panel');
    const newPanelIds: string[] = [];
    let activePanelId: string | null = null;
    
    // 按DOM顺序收集面板ID，排除特殊面板
    panels.forEach(panel => {
      const panelId = panel.getAttribute('data-panel-id');
      if (panelId) {
        // 排除特殊的悬浮面板（如 _globalSearch, _reference）
        if (panelId.startsWith('_')) {
          return; // 跳过特殊面板
        }
        
        newPanelIds.push(panelId);
        
        // 检查是否为激活面板
        if (panel.classList.contains('active')) {
          activePanelId = panelId;
        }
      }
    });
    
    // 检查面板变化
    const oldPanelIds = this.getPanelIds();
    this.updatePanelOrder(newPanelIds);
    
    // 更新当前面板信息
    this.updateCurrentPanelInfo(activePanelId);
    
    // 处理面板变化（新增、删除、重排序）
    await this.handlePanelChanges(oldPanelIds, newPanelIds);
  }
  
  /**
   * 更新当前面板信息
   */
  private updateCurrentPanelInfo(activePanelId: string | null) {
    if (activePanelId) {
      const index = this.panelOrder.findIndex(p => p.id === activePanelId);
      if (index !== -1) {
        if (this.currentPanelId === activePanelId && this.currentPanelIndex === index) {
          return;
        }
        this.currentPanelId = activePanelId;
        this.currentPanelIndex = index;
        this.log(`🔄 当前面板更新: ${activePanelId} (索引: ${index}, 序号: ${this.panelOrder[index].order})`);
      }
      return;
    }
    if (this.currentPanelId === null && this.currentPanelIndex === -1) {
      return;
    }
    this.currentPanelId = null;
    this.currentPanelIndex = -1;
    this.log('🔄 没有激活的面板');
  }
  
  /**
   * 处理面板变化
   */
  private async handlePanelChanges(oldPanelIds: string[], newPanelIds: string[]) {
    // 检查是否有面板被关闭
    const closedPanels = oldPanelIds.filter(id => !newPanelIds.includes(id));
    if (closedPanels.length > 0) {
      this.log(`🗑️ 检测到面板被关闭:`, closedPanels);
      await this.handlePanelClosure(closedPanels);
    }
    
    // 检查是否有新面板被打开
    const newPanels = newPanelIds.filter(id => !oldPanelIds.includes(id));
    if (newPanels.length > 0) {
      this.log(`🆕 检测到新面板被打开:`, newPanels);
      this.handleNewPanels(newPanels);
    }
    
    // 调整panelTabsData数组大小
    this.adjustPanelTabsDataSize();
  }
  
  /**
   * 处理面板关闭
   */
  private async handlePanelClosure(closedPanelIds: string[]) {
    this.log(`🗑️ 处理面板关闭:`, closedPanelIds);
    
    // 找到被关闭面板的索引
    const closedIndices: number[] = [];
    closedPanelIds.forEach(closedId => {
      const oldIndex = this.panelOrder.findIndex(p => p.id === closedId);
      if (oldIndex !== -1) {
        closedIndices.push(oldIndex);
      }
    });
    
    // 从后往前删除，避免索引错乱
    closedIndices.sort((a, b) => b - a).forEach(index => {
      this.panelTabsData.splice(index, 1);
      this.log(`🗑️ 删除面板 ${closedPanelIds[closedIndices.indexOf(index)]} 的标签页数据`);
    });
    
    // 重新计算当前面板索引
    if (this.currentPanelId) {
      this.currentPanelIndex = this.panelOrder.findIndex(p => p.id === this.currentPanelId);
      if (this.currentPanelIndex === -1) {
        // 如果当前面板被关闭，切换到第一个可用面板
        if (this.panelOrder.length > 0) {
          this.currentPanelIndex = 0;
          this.currentPanelId = this.panelOrder[0].id;
          this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`);
        } else {
          this.currentPanelIndex = -1;
          this.currentPanelId = null;
          this.log(`❌ 所有面板已关闭`);
        }
      }
    }
    
    // 保存所有剩余面板的数据到存储（基于位置顺序）
    this.log(`💾 面板关闭后保存所有剩余面板的数据`);
    for (let i = 0; i < this.panelOrder.length; i++) {
      const tabs = this.panelTabsData[i] || [];
      const storageKey = i === 0 ? PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS : `panel_${i + 1}_tabs`;
      await this.savePanelTabsByKey(storageKey, tabs);
    }
    
    // 强制更新UI，确保面板关闭后能正确显示
    this.log(`🔄 面板关闭后强制更新UI`);
    this.debouncedUpdateTabsUI();
  }
  
  /**
   * 处理新面板
   */
  private handleNewPanels(newPanelIds: string[]) {
    // 新面板的标签页数据会在需要时自动扫描
    this.log(`🆕 新面板将在需要时自动扫描标签页数据`);
  }
  
  /**
   * 调整panelTabsData数组大小
   */
  private adjustPanelTabsDataSize() {
    // 确保panelTabsData数组大小与panelIds一致
    while (this.panelTabsData.length < this.getPanelIds().length) {
      this.panelTabsData.push([]);
    }
    while (this.panelTabsData.length > this.getPanelIds().length) {
      this.panelTabsData.pop();
    }
  }

  // ==================== 新的面板管理方法 ====================
  
  /**
   * 获取面板ID数组（用于向后兼容）
   */
  private getPanelIds(): string[] {
    return this.panelOrder.map(panel => panel.id);
  }
  
  /**
   * 添加面板到顺序映射
   */
  private addPanel(panelId: string): void {
    // 检查面板是否已存在
    if (this.panelOrder.find(p => p.id === panelId)) {
      this.log(`📋 面板 ${panelId} 已存在，跳过添加`);
      return;
    }
    
    const newOrder = this.panelOrder.length + 1;
    this.panelOrder.push({ id: panelId, order: newOrder });
    this.log(`📋 添加面板 ${panelId}，序号: ${newOrder}`);
    
    // 确保panelTabsData数组有足够的空间
    this.ensurePanelTabsDataSize();
  }
  
  /**
   * 从顺序映射中删除面板
   */
  private removePanel(panelId: string): void {
    const index = this.panelOrder.findIndex(p => p.id === panelId);
    if (index === -1) {
      this.log(`⚠️ 面板 ${panelId} 不存在，无法删除`);
      return;
    }
    
    // 删除面板
    this.panelOrder.splice(index, 1);
    
    // 重新排序剩余面板
    this.panelOrder.forEach((panel, i) => {
      panel.order = i + 1;
    });
    
    this.log(`🗑️ 删除面板 ${panelId}，重新排序后的面板:`, this.panelOrder.map(p => `${p.id}(${p.order})`));
    
    // 调整panelTabsData数组
    this.panelTabsData.splice(index, 1);
  }
  
  /**
   * 获取第1个面板（持久化面板）
   */
  private getFirstPanel(): string | null {
    return this.panelOrder.length > 0 ? this.panelOrder[0].id : null;
  }
  
  /**
   * 确保panelTabsData数组大小与panelOrder匹配
   */
  private ensurePanelTabsDataSize(): void {
    while (this.panelTabsData.length < this.panelOrder.length) {
      this.panelTabsData.push([]);
    }
    while (this.panelTabsData.length > this.panelOrder.length) {
      this.panelTabsData.pop();
    }
  }
  
  /**
   * 更新面板顺序映射
   */
  private updatePanelOrder(newPanelIds: string[]): void {
    const oldPanelIds = this.getPanelIds();

    const isSameOrder = oldPanelIds.length === newPanelIds.length &&
      oldPanelIds.every((id, index) => id === newPanelIds[index]);
    if (isSameOrder) {
      return;
    }

    // 添加新面板
    newPanelIds.forEach(panelId => {
      if (!this.panelOrder.find(p => p.id === panelId)) {
        this.addPanel(panelId);
      }
    });

    // 删除不存在的面板
    const panelsToRemove = this.panelOrder.filter(p => !newPanelIds.includes(p.id));
    panelsToRemove.forEach(panel => {
      this.removePanel(panel.id);
    });

    this.log(`🔄 面板顺序更新完成:`, this.panelOrder.map(p => `${p.id}(${p.order})`));
  }

  /**
   * 智能选择新的持久化面板（基于面板位置，不依赖ID）
   */
  // 这个方法已删除，因为重构后不再需要复杂的持久化逻辑

  /**
   * 更新面板标签页数组大小
   */
  // 这个方法已删除，因为重构后不再需要复杂的持久化逻辑

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
   * 扫描第一个面板的标签页（扫描所有标签页）
   */
  async scanFirstPanel() {
    if (this.getPanelIds().length === 0) return;
    
    const firstPanelId = this.getPanelIds()[0];
    const panel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!panel) return;

    // 直接查找所有块编辑器，包括隐藏的
    const blockEditors = panel.querySelectorAll('.orca-block-editor[data-block-id]');
    const newTabs: TabInfo[] = [];
    let order = 0;
    
    this.log(`🔍 扫描第一个面板 ${firstPanelId}，找到 ${blockEditors.length} 个块编辑器`);

    // 扫描DOM获取标签信息
    for (const blockEditor of blockEditors) {
      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 获取标签信息
      const tabInfo = await this.getTabInfo(blockId, firstPanelId, order++);
      if (tabInfo) {
        newTabs.push(tabInfo);
        this.log(`📋 找到标签页: ${tabInfo.title} (${blockId})`);
      }
    }

    // 更新第一个面板的标签页数据
    this.panelTabsData[0] = [...newTabs];
    
    // 保存到存储（第1个面板）
    await this.savePanelTabsByKey(PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS, newTabs);
    
    this.log(`📋 第一个面板扫描并保存了 ${newTabs.length} 个标签页`);
  }

  /**
   * 合并第一个面板的标签页（现在只处理单个标签页）
   */
  mergeFirstPanelTabs(newTabs: TabInfo[]) {
    // 由于现在只处理当前激活的页面，这个方法主要用于兼容性
    if (newTabs.length > 0) {
      // 应用排序逻辑（固定标签在前，非固定在后）
      this.sortTabsByPinStatus();
    }
  }

  /**
   * 按固定状态排序标签（固定标签在前，非固定在后）
   */
  sortTabsByPinStatus() {
    // 排序当前面板的标签页
    const currentTabs = this.getCurrentPanelTabs();
    const sortedTabs = sortTabsByPinStatus(currentTabs);
    this.setCurrentPanelTabs(sortedTabs);
    
    // 同步更新对应的存储数组
    this.syncCurrentTabsToStorage(sortedTabs);
  }

  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex(): number {
    const currentTabs = this.getCurrentPanelTabs();
    return findLastNonPinnedTabIndex(currentTabs);
  }


  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(content: any[]): Promise<string> {
    return extractTextFromContent(content);
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
    return isTextWithBlockRefs(content);
  }

  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  
  // ✅ 重构：移除重复的detectBlockType和getBlockTypeIcon实现，直接使用 utils/blockUtils.ts 中的函数

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
   * 获取块文本标题（智能标题提取）
   * 
   * 功能说明：
   * - 智能提取块标题，支持多种格式
   * - 处理特殊字符和格式
   * - 提供合理的标题长度限制
   * - 支持降级处理
   */
  getBlockTextTitle(block: any): string {
    try {
      // 1. 优先使用别名
      if (block.aliases && block.aliases.length > 0) {
        const alias = block.aliases[0];
        if (alias && alias.trim()) {
          return this.cleanTitle(alias);
        }
      }

      // 2. 使用块文本内容
      if (block.text) {
        let title = block.text.trim();
        
        // 处理特殊格式
        title = this.processSpecialFormats(title);
        
        // 清理标题
        title = this.cleanTitle(title);
        
        // 限制长度
        if (title.length > 50) {
          title = title.substring(0, 47) + '...';
        }
        
        return title;
      }

      // 3. 从内容中提取文本
      if (block.content && Array.isArray(block.content)) {
        const textContent = this.extractTextFromContentSync(block.content);
        if (textContent && textContent.trim()) {
          let title = textContent.trim();
          title = this.processSpecialFormats(title);
          title = this.cleanTitle(title);
          
          if (title.length > 50) {
            title = title.substring(0, 47) + '...';
          }
          
          return title;
        }
      }

      // 4. 最后备选
      return `块 ${block.id || '未知'}`;
    } catch (error) {
      this.error("获取块标题时发生错误:", error);
      return `块 ${block.id || '未知'}`;
    }
  }

  /**
   * 处理特殊格式的标题
   */
  private processSpecialFormats(title: string): string {
    // 移除Markdown格式标记
    title = title.replace(/^#+\s*/, ''); // 移除标题标记
    title = title.replace(/^\*\*|\*\*$/g, ''); // 移除粗体标记
    title = title.replace(/^\*|\*$/g, ''); // 移除斜体标记
    title = title.replace(/^`|`$/g, ''); // 移除代码标记
    title = title.replace(/^>+\s*/, ''); // 移除引用标记
    title = title.replace(/^[-*+]\s*/, ''); // 移除列表标记
    title = title.replace(/^\d+\.\s*/, ''); // 移除有序列表标记
    title = title.replace(/^\[[x ]\]\s*/, ''); // 移除任务标记
    
    return title;
  }

  /**
   * 清理标题
   */
  private cleanTitle(title: string): string {
    // 移除多余的空白字符
    title = title.replace(/\s+/g, ' ').trim();
    
    // 移除特殊字符（保留中文、英文、数字、基本标点）
    title = title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s\-_.,!?()（）]/g, '');
    
    return title;
  }

  /**
   * 同步从内容中提取文本
   */
  private extractTextFromContentSync(content: any[]): string {
    if (!Array.isArray(content)) {
      return '';
    }

    const textParts: string[] = [];
    
    for (const item of content) {
      if (typeof item === 'string') {
        textParts.push(item);
      } else if (item && typeof item === 'object') {
        if (item.t === 'text' && item.v) {
          textParts.push(item.v);
        } else if (item.text) {
          textParts.push(item.text);
        } else if (item.content) {
          const subText = this.extractTextFromContentSync(item.content);
          if (subText) {
            textParts.push(subText);
          }
        }
      }
    }
    
    return textParts.join('');
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

      // 检测块类型（使用工具函数）
      blockType = await detectBlockType(block);
      this.log(`🔍 检测到块类型: ${blockType} (块ID: ${blockId})`);
      
      // 特别调试别名块
      if (block.aliases && block.aliases.length > 0) {
        this.log(`🏷️ 别名块详细信息: blockId=${blockId}, aliases=${JSON.stringify(block.aliases)}, 检测到的类型=${blockType}`);
      }

      // 获取标题：优先级 日期块 > 别名 > content内容 > text内容
      try {
        // 最高优先级：检查是否是日期块
        const journalInfo = extractJournalInfo(block);
        if (journalInfo) {
          isJournal = true;
          const formattedDate = formatJournalDate(journalInfo);
          title = formattedDate; // 移除文字中的图标，图标会通过icon属性单独显示
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
        if (iconProp && iconProp.type === 1 && iconProp.value && iconProp.value.trim()) {
          icon = iconProp.value;
          this.log(`🎨 使用用户自定义图标: ${icon} (块ID: ${blockId})`);
        } else if (this.showBlockTypeIcons || blockType === 'journal') {
          // 使用块类型对应的图标，日期块始终显示图标
          icon = getBlockTypeIcon(blockType);
          this.log(`🎨 使用块类型图标: ${icon} (块类型: ${blockType}, 块ID: ${blockId})`);
        }
      } catch (e) {
        this.warn("获取属性失败:", e);
        // 如果获取属性失败，使用块类型图标作为备选
        icon = getBlockTypeIcon(blockType);
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

  /* ———————————————————————————————————————————————————————————————————————————— */
  /* UI创建和更新 - UI Creation and Updates */
  /* ———————————————————————————————————————————————————————————————————————————— */

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

    // 创建标签容器 - 使用指定的CSS变量，并添加透明度
    const backgroundColor = 'color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)';
    
    // 根据固定到顶部模式决定位置
    let currentPosition: TabPosition;
    let isVertical: boolean;
    let width: number;
    
    if (this.isFixedToTop) {
      // 固定到顶部模式：强制水平布局，位置在顶部
      currentPosition = { x: 0, y: 0 };
      isVertical = false; // 强制水平布局
      width = window.innerWidth;
    } else {
      // 正常模式：使用原有逻辑
      currentPosition = this.isVerticalMode ? this.verticalPosition : this.position;
      isVertical = this.isVerticalMode;
      width = this.verticalWidth;
    }
    
    this.tabContainer = createTabContainer(
      isVertical, 
      currentPosition, 
      width, 
      backgroundColor
    );
    
    // 如果是固定到顶部模式，将标签页直接添加到顶部工具栏
    if (this.isFixedToTop) {
      // 查找顶部工具栏 - 使用精确的Orca侧边栏工具选择器
      const headbar = document.querySelector('.orca-headbar-sidebar-tools') || 
                     document.body;
      
      this.log(`🔍 查找顶部工具栏:`, {
        headbar: headbar?.className || headbar?.tagName,
        headbarExists: !!headbar,
        bodyChildren: document.body.children.length
      });
      
      // 将标签容器添加到顶部工具栏
      headbar.appendChild(this.tabContainer);
      
      // 如果添加到body，创建固定顶部栏
      if (headbar === document.body) {
        this.tabContainer.style.cssText += `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          background-color: var(--orca-color-bg-1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 2px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `;
      } else {
        // 使用flex布局让标签页水平排列
        this.tabContainer.style.cssText += `
          display: flex;
          flex-direction: row;
          align-items: center;
          position: static;
          width: auto;
          height: 32px;
          border-radius: var(--orca-radius-md);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin: 0 4px;
          padding: 0 8px;
          gap: 10px;
        `;
      }
      
      // 添加固定到顶部的特殊类名
      this.tabContainer.classList.add('fixed-to-top');
      
      this.log(`📌 标签页已添加到顶部工具栏: ${headbar.className || headbar.tagName}`);
    } else {
      // 正常模式：添加到body
      document.body.appendChild(this.tabContainer);
    }
    
    // 添加事件监听，只阻止标签栏内部的mousedown事件冒泡
    this.tabContainer.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;
      // 只阻止标签栏内部元素的mousedown事件，不影响侧边栏
      if (target.closest('.orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle') && 
          !target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu')) {
        e.stopPropagation();
      }
    });
    
    
    this.tabContainer.addEventListener('click', (e) => {
      // 只阻止标签栏内部的点击事件冒泡，不影响侧边栏
      const target = e.target as HTMLElement;
      if (target.closest('.orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle') && 
          !target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu')) {
        e.stopPropagation();
      }
    });

    // 创建拖拽手柄
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      cursor: move;
      z-index: 9998;
      opacity: 0;
      background-color: transparent;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      transition: opacity 0.2s ease;
    `;
    dragHandle.innerHTML = '';
    
    // 添加悬停效果
    dragHandle.addEventListener('mouseenter', () => {
      dragHandle.style.opacity = '0.5';
    });
    
    dragHandle.addEventListener('mouseleave', () => {
      dragHandle.style.opacity = '0';
    });

    // 添加拖拽事件
    dragHandle.addEventListener('mousedown', this.startDrag.bind(this));

    this.tabContainer.appendChild(dragHandle);
    
    // 只有在非固定到顶部模式下才添加到body
    if (!this.isFixedToTop) {
      document.body.appendChild(this.tabContainer);
    }

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
      /* CSS变量定义 - 支持主题自动切换 */
      :root {
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(0 0 0 / 10%));
        --orca-tab-border: rgba(0, 0, 0, 0.1);
        --orca-tab-hover-border: var(--orca-color-primary-3);
        --orca-tab-active-border: rgba(0, 0, 0, 0.3);
        --orca-tab-container-bg: rgba(255, 255, 255, 0.1);
        --orca-input-bg: rgba(200, 200, 200, 0.6);
      }
      
      /* 暗色模式的CSS变量 */
      :root[data-theme="dark"],
      .dark {
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(0 0 0 / 40%));
        --orca-tab-border: rgba(255, 255, 255, 0.2);
        --orca-tab-hover-border: var(--orca-color-primary-3);
        --orca-tab-active-border: rgba(255, 255, 255, 0.4);
        --orca-input-bg: rgba(255, 255, 255, 0.1);
      }
      
      /* 有颜色标签的CSS变量 - 使用条件CSS变量 */
      .orca-tabs-plugin .orca-tab {
        --orca-tab-colored-bg: oklch(from var(--tab-color, #3b82f6) calc(l * 0.8) calc(c * 1.5) h / 25%);
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 0.6) c h);
      }
      
      /* 暗色模式下的标签页颜色 - 使用最高优先级的选择器 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab,
      html[data-theme="dark"] .orca-tabs-plugin .orca-tab,
      [data-theme="dark"] .orca-tabs-plugin .orca-tab,
      .dark .orca-tabs-plugin .orca-tab,
      .orca-tabs-plugin .orca-tab[data-theme="dark"],
      .orca-tabs-plugin[data-theme="dark"] .orca-tab {
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h) !important;
      }
      
      /* 使用CSS媒体查询作为备用方案 */
      @media (prefers-color-scheme: dark) {
        .orca-tabs-plugin .orca-tab {
          --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h) !important;
        }
      }
      
      /* 强制覆盖所有可能的暗色模式选择器 */
      :root.dark .orca-tabs-plugin .orca-tab,
      html.dark .orca-tabs-plugin .orca-tab,
      body.dark .orca-tabs-plugin .orca-tab {
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h) !important;
      }
      


      /* 拖拽悬停目标样式 */
      .orca-tabs-plugin .orca-tab[data-drag-over="true"] {
        border: 1px solid var(--orca-color-primary-5);
        transform: scale(1.02);
        box-shadow: 0 4px 12px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%);
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 95%);
        position: relative;
      }

      /* 拖拽悬停目标指示器 */
      .orca-tabs-plugin .orca-tab[data-drag-over="true"]::before {
        content: '';
        position: absolute;
        left: -2px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: var(--orca-color-primary-5);
        border-radius: 2px;
        box-shadow: 0 0 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 40%);
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

      /* 拖拽容器状态 - 使用border紧贴，并放大1.05倍 */
      .orca-tabs-container[data-dragging="true"] {
        background-color: var(--orca-color-bg-1);
        outline: 1px dashed var(--orca-color-primary-5);
        outline-offset: 2px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        transform: scale(1.05);
        transform-origin: center;
      }
      
      /* 拖拽状态下水平布局标签间距增加，便于拖拽操作 */
      .orca-tabs-container:not(.vertical)[data-dragging="true"] {
        gap: 10px !important;
      }
      
      /* 标签容器变化的平滑过渡（包括gap和transform） */
      .orca-tabs-container:not(.vertical) {
        transition: gap 0.2s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* 垂直布局也需要transform过渡 */
      .orca-tabs-container.vertical {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* 拖拽时的过渡动画 */
      .orca-tabs-plugin .orca-tab {
        will-change: transform, box-shadow, background, opacity, border;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), 
                    opacity 0.2s ease,
                    box-shadow 0.2s ease;
      }

      /* 未选中标签的基础样式 */
      .orca-tabs-plugin .orca-tab {
        opacity: 0.85;
        border: 1px solid transparent;
      }

      /* 暗色模式下的标签边框 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab,
      .dark .orca-tabs-plugin .orca-tab {
        border: 1px solid color-mix(in srgb, var(--orca-color-text-1), transparent 35%);
      }

      /* 选中/悬停的标签样式 - 使用CSS变量自动响应主题变化，但排除聚焦状态 */
      .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        opacity: 1 !important;
        border: 1px solid var(--orca-tab-hover-border) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      }

      /* 有颜色的悬停标签样式 - 使用标签颜色 */
      .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"])[style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 70%) !important;
      }

      /* 暗色模式下的悬停样式 - 通过CSS变量自动应用，但排除聚焦状态 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]),
      .dark .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
      }

      /* 暗色模式下有颜色的悬停标签样式 - 使用标签颜色 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"])[style*="--tab-color"],
      .dark .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"])[style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 80%) !important;
      }

      /* 点击/激活状态的标签样式 - 使用CSS变量自动响应主题变化，但排除聚焦状态 */
      .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        opacity: 1 !important;
        border: 1px solid var(--orca-color-primary-3) !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
        transform: scale(0.98) !important;
      }

      /* 暗色模式下的点击样式 - 通过CSS变量自动应用，但排除聚焦状态 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]),
      .dark .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        box-shadow: 0 1px 4px rgba(255, 255, 255, 0.2) !important;
      }

      /* 聚焦状态的标签样式 */
      .orca-tabs-plugin .orca-tab[data-focused="true"] {
        opacity: 1 !important;
        border: 1px solid var(--orca-color-primary-5) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--orca-color-primary-5), transparent 80%), 0 2px 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%) !important;
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 90%) !important;
        transform: scale(1.02) !important;
      }

      /* 有颜色的聚焦标签样式 - 使用标签颜色 */
      .orca-tabs-plugin .orca-tab[data-focused="true"][style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--tab-color), transparent 80%), 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 70%) !important;
        background: color-mix(in srgb, var(--tab-color), transparent 90%) !important;
      }

      /* 暗色模式下的聚焦样式 */
      .dark .orca-tabs-plugin .orca-tab[data-focused="true"] {
        border: 1px solid var(--orca-color-primary-5) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%), 0 2px 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 80%) !important;
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 85%) !important;
      }

      /* 暗色模式下有颜色的聚焦标签样式 - 使用标签颜色 */
      .dark .orca-tabs-plugin .orca-tab[data-focused="true"][style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--tab-color), transparent 70%), 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 80%) !important;
        background: color-mix(in srgb, var(--tab-color), transparent 85%) !important;
      }

      /* 拖拽时的光标样式 */
      .orca-tabs-plugin .orca-tab[draggable="true"] {
        cursor: pointer;
      }

      .orca-tabs-plugin .orca-tab[draggable="true"]:active {
        cursor: pointer;
      }

      /* 拖拽时的标签容器动画 - 平滑滑动 */
      .orca-tabs-container[data-dragging="true"] .orca-tab {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                    opacity 0.25s ease,
                    width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    margin 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    padding 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* 拖拽时标签的过渡效果 */
      .orca-tabs-container[data-dragging="true"] .orca-tab {
        will-change: transform;
      }
      
      /* 标签分隔线 - 使用伪元素（水平布局，有相邻标签时才显示） */
      .orca-tabs-container:not(.vertical) .orca-tab:not([data-drop-target]):has(+ .orca-tab)::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 16px;
        background: color-mix(in srgb, var(--orca-color-text-1), transparent 75%);
        pointer-events: none;
        z-index: 10;
      }
      
      /* 拖拽时隐藏分隔线，避免与拖拽指示器冲突 */
      .orca-tabs-container[data-dragging="true"] .orca-tab::after {
        display: none;
      }

      /* 拖拽目标位置指示器 - 插入线样式（使用Orca主题色，优先级更高） */
      .orca-tab[data-drop-target="before"]::before,
      .orca-tab[data-drop-target="after"]::after {
        content: '' !important;
        position: absolute;
        background: var(--orca-color-primary-5, #5B8DEF);
        z-index: 1000;
        animation: dropIndicatorSlide 0.2s ease-out;
        box-shadow: 0 0 8px var(--orca-color-primary-shadow, rgba(91, 141, 239, 0.5));
        display: block !important;
      }
      
      /* 水平布局 - 左右插入线 */
      .orca-tabs-container:not(.vertical) .orca-tab[data-drop-target="before"]::before {
        left: -2px;
        top: 2px;
        bottom: 2px;
        width: 3px;
        border-radius: 2px;
      }
      
      .orca-tabs-container:not(.vertical) .orca-tab[data-drop-target="after"]::after {
        right: -2px;
        top: 2px;
        bottom: 2px;
        width: 3px;
        border-radius: 2px;
      }
      
      /* 垂直布局 - 上下插入线 */
      .orca-tabs-container.vertical .orca-tab[data-drop-target="before"]::before {
        left: 2px;
        right: 2px;
        top: -2px;
        height: 3px;
        border-radius: 2px;
      }
      
      .orca-tabs-container.vertical .orca-tab[data-drop-target="after"]::after {
        left: 2px;
        right: 2px;
        bottom: -2px;
        height: 3px;
        border-radius: 2px;
      }
      
      /* 插入线滑入动画 */
      @keyframes dropIndicatorSlide {
        from {
          opacity: 0;
          transform: scaleY(0.5);
        }
        to {
          opacity: 1;
          transform: scaleY(1);
        }
      }

      /* 拖拽完成后的回弹效果 */
      .orca-tabs-plugin .orca-tab[data-dragging="true"] {
        animation: dragBounce 0.3s ease-out;
      }

      @keyframes dragBounce {
        0% {
          transform: rotate(2deg);
        }
        50% {
          transform: rotate(1deg);
        }
        100% {
          transform: rotate(2deg);
        }
      }

      /* 目标元素基础样式 */
      .orca-menu.orca-block-preview.orca-block-preview-interactive {
        position: relative;
        min-width: 50px;
        min-height: 50px;
      }

      /* 右下角缩放手柄样式 */
      .resize-handle-br {
        position: absolute;
        background-color: #3498db;
        width: 10px;
        height: 10px;
        right: -5px;
        bottom: -5px;
        z-index: 9999;
        border-radius: 50%;
        opacity: 0;
        cursor: nwse-resize;
      }

      /* 缩放手柄交互效果 */
      .resize-handle-br:hover {
        opacity: 0.5;
        transition: opacity 0.2s ease;
      }

      .resize-handle-br.dragging {
        opacity: 1;
      }

      /* 拖拽手柄样式（顶部透明区域） */
      .drag-handle {
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        cursor: move;
        z-index: 9998;
        opacity: 0;
        background-color: transparent;
      }

      .drag-handle:hover {
        opacity: 0.5;
        transition: opacity 0.2s ease;
      }

      .drag-handle.dragging {
        opacity: 1;
      }

      /* 操作状态样式 */
      .resizing, .dragging {
        user-select: none;
        -webkit-user-select: none;
      }

      /* 全局鼠标样式 - 只影响插件内的拖拽和调整大小 */
      .orca-tabs-plugin .orca-tabs-plugin body.resizing {
        cursor: nwse-resize;
      }

      .orca-tabs-plugin .orca-tabs-plugin body.dragging {
        cursor: move;
      }

      /* 按钮基础样式 - 只影响插件内的按钮 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        transition: background-color 0.2s;
        background-color: transparent;
        padding: .175rem var(--orca-spacing-md);
        border-radius: var(--orca-radius-md);
        border: none;
        color: var(--orca-color-text-1);
      }

      /* 按钮悬停效果 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button:hover {
        background-color: var(--orca-color-menu-highlight);
      }

      /* 主要按钮样式 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button-primary {
        background: var(--orca-color-primary-5);
        color: white;
      }

      .orca-tabs-plugin .orca-tabs-plugin .orca-button-primary:hover {
        background: color-mix(in srgb, var(--orca-color-primary-5), black 10%);
      }

      /* 次要按钮样式 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button-secondary {
        border: 1px solid var(--orca-color-primary-5);
        background: var(--orca-color-primary-5);
        color: white;
      }

      .orca-tabs-plugin .orca-tabs-plugin .orca-button-secondary:hover {
        background: color-mix(in srgb, var(--orca-color-primary-5), black 10%);
      }

      /* 菜单项图标样式 */
      .orca-tabs-plugin .tab-context-menu-item::before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: var(--orca-spacing-md);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
      }

      /* 标签右键菜单图标 */
      .orca-tabs-plugin .tab-context-menu-item[data-action="close"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="close-others"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'%3E%3C/path%3E%3Cpath d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'%3E%3C/path%3E%3Cpath d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="close-right"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'%3E%3C/path%3E%3Cpath d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'%3E%3C/path%3E%3Cpath d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="close-left"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'%3E%3C/path%3E%3Cpath d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'%3E%3C/path%3E%3Cpath d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="duplicate"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="rename"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'%3E%3C/path%3E%3Cpath d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="save-to-group"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
      }

      /* 工作区菜单图标 */
      .orca-tabs-plugin .workspace-menu-item::before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: var(--orca-spacing-md);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
      }

      .orca-tabs-plugin .workspace-menu-item[data-action="save-current"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'%3E%3C/path%3E%3Cpolyline points='17,21 17,13 7,13 7,21'%3E%3C/polyline%3E%3Cpolyline points='7,3 7,8 15,8'%3E%3C/polyline%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .workspace-menu-item[data-action="manage"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3Cpath d='M12 1v6m0 6v6m11-7h-6m-6 0H1'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .workspace-menu-item[data-action="workspace"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
      }

      /* 添加到标签组菜单图标 */
      .orca-tabs-plugin .add-to-group-menu-item::before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: var(--orca-spacing-md);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
      }
    `;
    
    document.head.appendChild(style);
    this.log("✅ 拖拽样式已添加");
  }

  // 防抖函数实例（仅用于拖拽等非关键场景）
  private draggingDebounce = debounce(async () => {
    await this.updateTabsUI();
  }, 200);

  /**
   * 立即更新标签页UI（修复同步问题）
   * 
   * 问题背景：
   * - 防抖延迟导致编辑器与标签页不同步
   * - 用户看到编辑器已切换，但标签页仍显示旧内容
   * - 需要额外点击才能同步标签页状态
   * 
   * 修复方案：
   * - 提供立即更新方法，绕过防抖机制
   * - 确保聚焦状态变化时立即更新UI
   * - 保持编辑器与标签页的视觉同步
   * 
   * 避坑点：
   * 1. 不要在聚焦状态变化时使用防抖更新
   * 2. 确保UI更新与编辑器切换同步进行
   * 3. 避免用户看到不一致的状态
   * 4. 仅在拖拽等非关键场景使用防抖
   */
  async immediateUpdateTabsUI() {
    // 立即更新，无延迟
    await this.updateTabsUI();
  }

  /**
   * 防抖更新标签页UI（仅用于拖拽等非关键场景）
   * 
   * 问题背景：
   * - 防抖机制导致标签页更新延迟
   * - 用户操作后需要等待才能看到结果
   * - 影响用户体验和视觉同步
   * 
   * 修复方案：
   * - 拖拽场景保持防抖，避免干扰拖拽体验
   * - 非拖拽场景立即更新，确保同步
   * - 区分不同场景的更新策略
   * 
   * 避坑点：
   * 1. 不要在所有场景都使用防抖
   * 2. 拖拽场景需要防抖避免闪烁
   * 3. 聚焦变化场景需要立即更新
   * 4. 根据场景选择合适的更新策略
   */
  debouncedUpdateTabsUI() {
    // 如果正在拖拽，延迟更新UI以避免干扰拖拽体验
    if (this.draggingTab) {
      this.draggingDebounce();
    } else {
      // 非拖拽场景立即更新，确保同步
      this.immediateUpdateTabsUI();
    }
  }

  async updateTabsUI() {
    if (!this.tabContainer || this.isUpdating) return;
    
    // 防止重复更新
    this.isUpdating = true;
    const now = Date.now();
    
    try {
      // 限制更新频率（最小间隔50ms）
      if (now - this.lastUpdateTime < 50) {
        this.verboseLog('⏭️ 跳过UI更新：距离上次更新仅 ' + (now - this.lastUpdateTime) + 'ms');
        return;
      }
      
      this.lastUpdateTime = now;

    // 清除现有标签（保留拖拽手柄、新建按钮和工作区按钮）
    const dragHandle = this.tabContainer.querySelector('.drag-handle');
    const newTabButton = this.tabContainer.querySelector('.new-tab-button');
    const workspaceButton = this.tabContainer.querySelector('.workspace-button');
    
    // 获取当前显示的标签ID列表，用于后续比较
    const currentDisplayedTabIds = Array.from(this.tabContainer.querySelectorAll('.orca-tab'))
      .map(el => el.getAttribute('data-tab-id'))
      .filter(id => id !== null) as string[];
    
    // 优化：使用选择性删除而不是innerHTML = ''，减少强制重排
    // 只删除标签元素，保留其他元素
    const tabsToRemove = this.tabContainer.querySelectorAll('.orca-tab');
    tabsToRemove.forEach(tab => tab.remove());
    
    // 保留拖拽手柄在最前面
    if (dragHandle && dragHandle.parentElement !== this.tabContainer) {
      this.tabContainer.insertBefore(dragHandle, this.tabContainer.firstChild);
    }

    // 显示标签页 - 优先显示当前活动面板，否则显示第1个面板（持久化面板）
    let targetPanelId = this.currentPanelId;
    let targetPanelIndex = this.currentPanelIndex;
    
    // 如果没有当前活动面板，显示第1个面板（持久化面板）
    if (!targetPanelId && this.panelOrder.length > 0) {
      targetPanelId = this.panelOrder[0].id;
      targetPanelIndex = 0;
      this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${targetPanelId}`);
    }
    
    if (targetPanelId) {
      this.verboseLog(`📋 显示面板 ${targetPanelId} 的标签页`);
      
      // 获取目标面板的标签页数据
      let targetTabs = this.panelTabsData[targetPanelIndex] || [];
      
      // 如果目标面板没有标签数据，尝试扫描
      if (targetTabs.length === 0) {
        this.log(`🔍 面板 ${targetPanelId} 没有标签数据，重新扫描`);
        await this.scanPanelTabsByIndex(targetPanelIndex, targetPanelId);
        targetTabs = this.panelTabsData[targetPanelIndex] || [];
      }
      
      // 确保标签按固定状态排序
      this.sortTabsByPinStatus();
      
      // 【修复BUG】重新获取排序后的标签数组，因为 sortTabsByPinStatus 会创建新数组
      targetTabs = this.panelTabsData[targetPanelIndex] || [];
      
      // 优化：使用DocumentFragment批量添加标签，减少DOM重排次数
      const fragment = document.createDocumentFragment();
      targetTabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        fragment.appendChild(tabElement);
      });
      
      // 找到新建按钮的位置，在它之前插入标签
      const newTabBtn = this.tabContainer?.querySelector('.new-tab-button');
      if (this.tabContainer) {
        if (newTabBtn) {
          // 在新建按钮之前插入所有标签
          this.tabContainer.insertBefore(fragment, newTabBtn);
        } else {
          // 如果没有按钮，直接添加到末尾
          this.tabContainer.appendChild(fragment);
        }
      }
    } else {
      this.log(`⚠️ 没有可显示的面板，跳过标签页显示`);
    }
    
    // 始终添加新建按钮和工作区按钮（无论是否有当前面板）
    this.addNewTabButton();
    // 只有在启用工作区功能时才添加工作区按钮
    if (this.enableWorkspaces) {
      this.addWorkspaceButton();
    }
    
    // 如果是固定到顶部模式，重新应用样式
    if (this.isFixedToTop) {
      // 使用CSS变量，让浏览器自动响应主题变化，避免JS检测延迟
      const backgroundColor = 'var(--orca-tab-bg)';
      const borderColor = 'var(--orca-tab-border)';
      const textColor = 'var(--orca-color-text-1)';
      
      // 调整标签页样式以适应顶部工具栏
      const tabs = this.tabContainer.querySelectorAll('.orca-tabs-plugin .orca-tab');
      tabs.forEach(tabElement => {
        const tabId = tabElement.getAttribute('data-tab-id');
        if (!tabId) return;
        
        // 查找对应的标签信息
        const currentTabs = this.getCurrentPanelTabs();
        const tabInfo = currentTabs.find(tab => tab.blockId === tabId);
        
        if (tabInfo) {
          // 使用正确的颜色逻辑
          let tabBackgroundColor: string;
          let tabTextColor: string;
          let fontWeight = 'normal';
          
          // 使用 CSS 变量，让浏览器自动响应主题变化
          tabBackgroundColor = 'var(--orca-tab-bg)';
          tabTextColor = 'var(--orca-color-text-1)';
          
          // 如果有颜色，应用颜色样式（这里仍需要JS计算，但会减少主题切换的延迟）
          if (tabInfo.color) {
            try {
              // 使用CSS自定义属性存储颜色值，让CSS处理主题变化
              (tabElement as HTMLElement).style.setProperty('--tab-color', tabInfo.color);
              
              // 检测暗色模式并直接设置正确的CSS变量
              const isDarkMode = document.documentElement.hasAttribute('data-theme') 
                ? document.documentElement.getAttribute('data-theme') === 'dark'
                : document.documentElement.classList.contains('dark');
              
              if (isDarkMode) {
                // 暗色模式下直接设置1.05的亮度
                (tabElement as HTMLElement).style.setProperty('--orca-tab-colored-text', 
                  `oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h)`, 'important');
              }
              
              tabBackgroundColor = 'var(--orca-tab-colored-bg)';
              tabTextColor = 'var(--orca-tab-colored-text)';
              fontWeight = '600';
            } catch (error) {
            }
          }
          
          // 只设置基础样式，不覆盖聚焦和悬浮样式
          (tabElement as HTMLElement).style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${tabBackgroundColor};
            border-radius: var(--orca-radius-md);
            border: 1px solid ${borderColor};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${tabTextColor};
            font-weight: ${fontWeight};
            max-width: 100px;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            -webkit-app-region: no-drag;
            app-region: no-drag;
            pointer-events: auto;
          `;
          
          // 确保CSS变量正确设置，让CSS规则能够生效
          if (tabInfo.color) {
            (tabElement as HTMLElement).style.setProperty('--tab-color', tabInfo.color);
          }
        }
      });
      
      // 调整新建标签页按钮样式
      const newTabButton = this.tabContainer.querySelector('.new-tab-button');
      if (newTabButton) {
        (newTabButton as HTMLElement).style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${backgroundColor};
          border-radius: var(--orca-radius-md);
          border: 1px solid ${borderColor};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${textColor};
        `;
      }
      
      this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${tabs.length}`);
    }
    } catch (error) {
      this.error("更新UI时发生错误:", error);
    } finally {
      // 确保无论如何都会重置标志
      this.isUpdating = false;
    }
  }

  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || '' || !this.tabContainer) return;

    // 获取当前面板的标签数据
    let currentTabs = this.getCurrentPanelTabs();
    
    // 如果当前面板没有标签数据，尝试扫描
    if (currentTabs.length === 0) {
      await this.scanCurrentPanelTabs();
      currentTabs = this.getCurrentPanelTabs();
    }
    
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${currentTabs.length} 个标签页`);

    // 一次性更新DOM
    const fragment = document.createDocumentFragment();
    
    if (currentTabs.length > 0) {
      // 显示标签页
      currentTabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        fragment.appendChild(tabElement);
      });
    } else {
      // 显示提示
      const statusElement = document.createElement('div');
      statusElement.className = 'panel-status';
      statusElement.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: var(--orca-color-text-1);
        font-weight: normal;
        padding: 6px 12px;
        border-radius: var(--orca-radius-md);
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
        addTooltip(statusElement, createStatusTooltip(`当前在面板 ${panelNumber}，该面板没有标签页`));
      
      fragment.appendChild(statusElement);
    }
    
    // 一次性替换内容
    this.tabContainer.appendChild(fragment);
    
    // 添加新建标签页按钮
    this.addNewTabButton();
  }



  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || '' || !this.tabContainer) return;

    // 使用保存的标签数组，而不是重新扫描DOM
    let currentTabs = this.getCurrentPanelTabs();
    
     // 对于所有面板，只有在没有标签时才重新扫描（避免删除后重新排列）
     if (currentTabs.length === 0) {
       await this.checkCurrentPanelBlocks();
      currentTabs = this.getCurrentPanelTabs();
    }
    
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${currentTabs.length} 个标签页`);

    // 一次性更新DOM，避免闪烁
    const fragment = document.createDocumentFragment();
    
    if (currentTabs.length > 0) {
      // 显示标签页
      currentTabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        fragment.appendChild(tabElement);
      });
    } else {
      // 显示提示
      const statusElement = document.createElement('div');
      statusElement.className = 'panel-status';
      statusElement.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: var(--orca-color-text-1);
        font-weight: normal;
        padding: 6px 12px;
        border-radius: var(--orca-radius-md);
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
        addTooltip(statusElement, createStatusTooltip(`当前在面板 ${panelNumber}，该面板没有标签页`));
      
      fragment.appendChild(statusElement);
    }
    
    // 一次性替换内容
    this.tabContainer.appendChild(fragment);
    
    // 添加新建标签页按钮
    this.addNewTabButton();
  }

  /**
   * 检查和恢复更新状态 - 防止 isUpdating 标志卡死
   */
  checkAndRecoverUpdateState() {
    if (this.isUpdating) {
      const timeoutDuration = Date.now() - this.lastUpdateTime;
      if (timeoutDuration > 5000) { // 5秒超时
        this.warn("检测到更新标志卡死，强制重置");
        this.isUpdating = false;
        this.debouncedUpdateTabsUI();
      }
    }
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
      border-radius: var(--orca-radius-md);
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
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
    `;
    
    newTabButton.style.cssText = newButtonStyle;
    newTabButton.innerHTML = '+';
      addTooltip(newTabButton, createButtonTooltip('新建标签页'));

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
    
    // 添加工作区按钮（如果启用）
    if (this.enableWorkspaces) {
      this.addWorkspaceButton();
    }
  }


  /**
   * 优化后的标签宽度更新方法 - 避免完全重建UI
   */
  async updateTabWidths(maxWidth: number, minWidth: number) {
    try {
      // 更新宽度设置
      this.horizontalTabMaxWidth = maxWidth;
      this.horizontalTabMinWidth = minWidth;
      
      // 如果标签容器存在，直接更新现有标签的样式
      if (this.tabContainer && !this.isVerticalMode) {
        const tabs = this.tabContainer.querySelectorAll('.orca-tab');
        tabs.forEach(tab => {
          const tabElement = tab as HTMLElement;
          // 重新应用标签样式，只更新宽度相关部分
          const tabInfo = this.getTabInfoFromElement(tabElement);
          if (tabInfo) {
            const useVerticalStyle = this.isVerticalMode && !this.isFixedToTop;
            const tabStyle = createTabBaseStyle(tabInfo, useVerticalStyle, () => '', maxWidth, minWidth);
            tabElement.style.cssText = tabStyle;
          }
        });
        
        this.log(`📏 标签宽度已优化更新: 最大${maxWidth}px, 最小${minWidth}px`);
      } else {
        // 如果容器不存在或垂直模式，使用原有方法
        await this.createTabsUI();
      }
      
      // 保存设置到存储
      try {
        await this.saveLayoutMode();
      } catch (error) {
        this.error("保存宽度设置失败:", error);
      }
    } catch (error) {
      this.error("更新标签宽度失败:", error);
    }
  }

  /**
   * 从标签元素获取标签信息
   */
  private getTabInfoFromElement(tabElement: HTMLElement): TabInfo | null {
    const tabId = tabElement.getAttribute('data-tab-id');
    if (!tabId) return null;
    
    // 从当前面板的标签列表中查找对应的标签信息
    const currentTabs = this.panelTabsData[this.currentPanelIndex] || [];
    return currentTabs.find(tab => tab.blockId === tabId) || null;
  }

  /**
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    try {
      if (this.isVerticalMode) {
        // 垂直模式：调整面板宽度
        const dialog = createWidthAdjustmentDialog(
          this.verticalWidth,
          async (newWidth: number) => {
            // 实时调整面板宽度
            try {
              orca.nav.changeSizes(orca.state.activePanel, [newWidth]);
            } catch (error) {
              this.error("调整面板宽度失败:", error);
            }
            
            this.verticalWidth = newWidth;
            
            // 实时保存设置
            try {
              await this.saveLayoutMode();
            } catch (error) {
              this.error("保存宽度设置失败:", error);
            }
          },
          async () => {
            // 取消时恢复原始宽度
            try {
              orca.nav.changeSizes(orca.state.activePanel, [this.verticalWidth]);
            } catch (error) {
              this.error("恢复面板宽度失败:", error);
            }
          }
        ) as HTMLElement;
        
        document.body.appendChild(dialog);
      } else {
        // 水平模式：调整标签宽度
        // 记录原始宽度设置，用于取消时恢复
        const originalMaxWidth = this.horizontalTabMaxWidth;
        const originalMinWidth = this.horizontalTabMinWidth;
        
        const dialog = createWidthAdjustmentDialog(
          this.horizontalTabMaxWidth,
          this.horizontalTabMinWidth,
          async (maxWidth: number, minWidth: number) => {
            // 使用优化的更新方法，避免完全重建UI
            await this.updateTabWidths(maxWidth, minWidth);
          },
          async () => {
            // 取消时恢复原始设置
            this.horizontalTabMaxWidth = originalMaxWidth;
            this.horizontalTabMinWidth = originalMinWidth;
            
            // 重新创建标签UI以恢复原始宽度
            await this.createTabsUI();
            
            this.log(`📏 标签宽度已恢复: 最大${originalMaxWidth}px, 最小${originalMinWidth}px`);
          }
        );
        
        document.body.appendChild(dialog);
      }
    } catch (error) {
      this.error("显示宽度调整对话框失败:", error);
    }
  }

  /**
   * 移除工作区按钮
   */
  removeWorkspaceButton() {
    if (!this.tabContainer) return;
    
    const existingButton = this.tabContainer.querySelector('.workspace-button');
    if (existingButton) {
      existingButton.remove();
      this.log('📁 工作区按钮已移除');
    }
  }

  /**
   * 添加功能切换按钮
   */
  addFeatureToggleButton() {
    if (!this.tabContainer) return;
    
    // 检查是否已经存在功能切换按钮
    const existingButton = this.tabContainer.querySelector('.feature-toggle-button');
    if (existingButton) {
      this.log('🔧 功能切换按钮已存在，跳过创建');
      return;
    }
    
    // 检查当前功能开关状态
    const isEnabled = this.enableMiddleClickPin || this.enableDoubleClickClose;
    this.log(`🔧 创建功能切换按钮，当前状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}, 按钮启用=${isEnabled}`);
    
    const featureToggleButton = createFeatureToggleButton(
      this.isVerticalMode,
      isEnabled,
      async (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.log('🔧 点击功能切换按钮');
        alert('功能切换按钮被点击了！');
        await this.toggleFeatureSettings();
      }
    );

    // 添加工具提示
    addTooltip(featureToggleButton, createButtonTooltip(
      isEnabled ? '中键固定/双击关闭 (已启用)' : '中键固定/双击关闭 (已禁用)'
    ));

    // 添加悬停效果
    featureToggleButton.addEventListener('mouseenter', () => {
      featureToggleButton.style.background = isEnabled 
        ? 'rgba(0, 150, 0, 0.2)' 
        : 'rgba(0, 0, 0, 0.1)';
      featureToggleButton.style.color = isEnabled ? '#004400' : '#333';
    });
    
    featureToggleButton.addEventListener('mouseleave', () => {
      featureToggleButton.style.background = isEnabled 
        ? 'rgba(0, 150, 0, 0.1)' 
        : 'transparent';
      featureToggleButton.style.color = isEnabled ? '#006600' : '#666';
    });

    this.tabContainer.appendChild(featureToggleButton);
    this.log('🔧 功能切换按钮已添加到DOM');
  }
  
  /**
   * 切换功能设置
   */
  private async toggleFeatureSettings() {
    try {
      this.log(`🔧 切换前状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`);
      
      // 切换功能开关状态
      this.enableMiddleClickPin = !this.enableMiddleClickPin;
      this.enableDoubleClickClose = !this.enableDoubleClickClose;
      
      this.log(`🔧 切换后状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`);
      
      // 保存设置到存储
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_MIDDLE_CLICK_PIN, this.enableMiddleClickPin, this.pluginName);
      await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_DOUBLE_CLICK_CLOSE, this.enableDoubleClickClose, this.pluginName);
      
      this.log('🔧 设置已保存到存储');
      
      // 更新按钮状态
      this.updateFeatureToggleButton();
      
      this.log(`🔧 功能开关已切换: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`);
      
      // 显示通知
      this.showFeatureToggleNotification();
    } catch (error) {
      this.log('⚠️ 切换功能设置失败:', error);
    }
  }
  
  /**
   * 更新功能切换按钮状态
   */
  private updateFeatureToggleButton() {
    if (!this.tabContainer) return;
    
    const button = this.tabContainer.querySelector('.feature-toggle-button') as HTMLElement;
    if (!button) return;
    
    const isEnabled = this.enableMiddleClickPin || this.enableDoubleClickClose;
    
    // 更新按钮内容
    button.innerHTML = isEnabled ? '🔒' : '🔓';
    button.title = isEnabled ? '中键固定/双击关闭 (已启用)' : '中键固定/双击关闭 (已禁用)';
    
    // 更新样式
    const buttonStyle = this.isVerticalMode ? `
      width: calc(100% - 6px);
      margin: 0 3px;
      height: 24px;
      background: ${isEnabled ? 'rgba(0, 150, 0, 0.1)' : 'transparent'};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: ${isEnabled ? '#006600' : '#666'};
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
      border: 1px solid ${isEnabled ? 'rgba(0, 150, 0, 0.3)' : 'transparent'};
    ` : `
      width: 24px;
      height: 24px;
      background: ${isEnabled ? 'rgba(0, 150, 0, 0.1)' : 'transparent'};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: ${isEnabled ? '#006600' : '#666'};
      margin-left: 4px;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
      border: 1px solid ${isEnabled ? 'rgba(0, 150, 0, 0.3)' : 'transparent'};
    `;
    
    button.style.cssText = buttonStyle;
  }
  
  /**
   * 显示功能切换通知
   */
  private showFeatureToggleNotification() {
    const isEnabled = this.enableMiddleClickPin || this.enableDoubleClickClose;
    const message = isEnabled 
      ? '功能已启用：中键固定标签页，双击关闭标签页' 
      : '功能已禁用：中键关闭标签页，双击固定标签页';
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isEnabled ? '#4caf50' : '#ff9800'};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-size: 14px;
      max-width: 300px;
      word-wrap: break-word;
      animation: slideInRight 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    if (!this.tabContainer) return;
    
    // 检查是否已经存在工作区按钮
    const existingButton = this.tabContainer.querySelector('.workspace-button');
    if (existingButton) return;
    
    // 创建工作区按钮
    const workspaceButton = document.createElement('div');
    workspaceButton.className = 'workspace-button';
    
    // 根据布局模式设置不同的工作区按钮样式
    const workspaceButtonStyle = this.isVerticalMode ? `
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
      border-radius: var(--orca-radius-md);
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
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
    `;
    
    workspaceButton.style.cssText = workspaceButtonStyle;
    workspaceButton.innerHTML = '<i class="ti ti-layout-grid" style="font-size: 14px;"></i>';
      addTooltip(workspaceButton, createButtonTooltip(`工作区 (${this.workspaces?.length || 0})`));

    // 添加悬停效果
    workspaceButton.addEventListener('mouseenter', () => {
      workspaceButton.style.background = 'rgba(0, 0, 0, 0.1)';
      workspaceButton.style.color = '#333';
    });
    
    workspaceButton.addEventListener('mouseleave', () => {
      workspaceButton.style.background = 'transparent';
      workspaceButton.style.color = '#666';
    });

    // 添加点击事件
    workspaceButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.log('📁 点击工作区按钮');
      this.showWorkspaceMenu(e);
    });

    this.tabContainer.appendChild(workspaceButton);
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

    // 优化主题检测：优先使用data-theme属性
    const isDarkMode = document.documentElement.hasAttribute('data-theme') 
      ? document.documentElement.getAttribute('data-theme') === 'dark'
      : document.documentElement.classList.contains('dark') || 
        (window as any).orca?.state?.themeMode === 'dark';

    // 创建右键菜单
    const menu = document.createElement('div');
    menu.className = 'new-tab-context-menu';
    
    // 计算菜单位置，避免在屏幕边缘显示一半
    // 使用智能菜单定位算法
    const menuWidth = 200;
    const menuHeight = 140; // 预估菜单高度
    const { x: left, y: top } = calculateContextMenuPosition(e.clientX, e.clientY, menuWidth, menuHeight);
    
    menu.style.cssText = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: ${menuWidth}px;
      padding: var(--orca-spacing-sm);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    // 菜单项
    const menuItems: ContextMenuItem[] = [
      {
        text: '新建标签页',
        action: () => this.createNewTab(),
        icon: '+'
      }
    ];

    // 如果当前是固定到顶部模式，添加取消固定选项
    if (this.isFixedToTop) {
      menuItems.push(
        {
          text: '---',
          action: () => {},
          separator: true
        },
        {
          text: '取消固定到顶部',
          action: () => this.toggleFixedToTop(),
          icon: '📌'
        }
      );
    }

    // 只有在非固定到顶部模式下才显示布局切换选项
    if (!this.isFixedToTop) {
      menuItems.push(
        {
          text: '---',
          action: () => {},
          separator: true
        },
        {
          text: this.isVerticalMode ? '切换到水平布局' : '切换到垂直布局',
          action: () => this.toggleLayoutMode(),
          icon: this.isVerticalMode ? '⏸' : '⏵'
        }
      );
    }

    // 只有在水平布局且非固定到顶部模式下才显示固定到顶部选项
    if (!this.isVerticalMode && !this.isFixedToTop) {
      menuItems.push(
        {
          text: '---',
          action: () => {},
          separator: true
        },
        {
          text: '固定到顶部',
          action: () => this.toggleFixedToTop(),
          icon: '📌'
        }
      );
    }

    // 垂直模式下通过拖动右侧调整手柄来调整面板宽度，无需菜单项

    // 在水平布局下添加标签宽度调整选项
    if (!this.isVerticalMode) {
      menuItems.push(
        {
          text: '---',
          action: () => {},
          separator: true
        },
        {
          text: '调整标签宽度',
          action: () => this.showWidthAdjustmentDialog(),
          icon: '⚙'
        }
      );
    }

    // 只有在非固定到顶部模式下才添加侧边栏对齐选项
    if (!this.isFixedToTop) {
      menuItems.push(
        {
          text: '---',
          action: () => {},
          separator: true
        },
        {
          text: this.isSidebarAlignmentEnabled ? '关闭侧边栏对齐' : '开启侧边栏对齐',
          action: () => this.toggleSidebarAlignment(),
          icon: this.isSidebarAlignmentEnabled ? '🔴' : '🟢'
        }
      );
    }

    // 如果启用了多标签页保存功能，添加保存选项
    if (this.enableMultiTabSaving) {
      menuItems.push(
        {
          text: '---',
          action: () => {},
          separator: true
        },
        {
          text: '保存当前标签页',
          action: () => this.saveCurrentTabs(),
          icon: '💾'
        }
      );
    }


    menuItems.forEach(item => {
      if (item.separator) {
        const separator = document.createElement('div');
        separator.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `;
        menu.appendChild(separator);
        return;
      }

      const menuItem = document.createElement('div');
      menuItem.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: var(--orca-color-text-1);
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s ease;
      `;
      
      if (item.icon) {
        const icon = document.createElement('span');
        icon.textContent = item.icon;
        icon.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `;
        menuItem.appendChild(icon);
      }
      
      const text = document.createElement('span');
      text.textContent = item.text;
      menuItem.appendChild(text);
      
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
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
  
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 布局切换 - Layout Switching */
  /* ———————————————————————————————————————————————————————————————————————————— */

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
   * 切换固定到顶部模式
   */
  async toggleFixedToTop() {
    try {
      this.log(`🔄 切换固定到顶部: ${this.isFixedToTop ? '取消固定' : '固定到顶部'}`);
      
      // 切换固定状态
      this.isFixedToTop = !this.isFixedToTop;
      
      // 保存固定状态到API配置
      await this.saveFixedToTopMode();
      
      // 重新创建UI
      await this.createTabsUI();
      
      this.log(`✅ 固定到顶部已${this.isFixedToTop ? '启用' : '禁用'}`);
    } catch (error) {
      this.error("切换固定到顶部失败:", error);
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
      
      // 保存状态到存储
      await this.saveLayoutMode();
      
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
      
      // 执行最后一次对齐调整
      await this.performSidebarAlignment();
      
      // 禁用状态
      this.isSidebarAlignmentEnabled = false;
      
      // 保存状态到存储
      await this.saveLayoutMode();
      
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
    await this.performSidebarAlignment();
  }

  /**
   * 执行侧边栏对齐的核心逻辑
   */
  async performSidebarAlignment() {
    try {
      const sidebarWidth = this.getSidebarWidth();
      if (sidebarWidth === 0) return;

      const appElement = document.querySelector('div#app');
      if (!appElement) return;

      const isSidebarClosed = appElement.classList.contains('sidebar-closed');
      const isSidebarOpened = appElement.classList.contains('sidebar-opened');
      
      if (!isSidebarClosed && !isSidebarOpened) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }

      // 获取当前位置
      const currentPosition = this.getCurrentPosition();
      if (!currentPosition) return;

      // 计算新位置
      const newPosition = this.calculateSidebarAlignmentPosition(
        currentPosition, 
        sidebarWidth, 
        isSidebarClosed, 
        isSidebarOpened
      );

      if (!newPosition) return;

      // 更新位置
      await this.updatePosition(newPosition);
      
      // 重新创建UI
      await this.createTabsUI();
      
      this.log(`🔄 侧边栏对齐完成: (${currentPosition.x}, ${currentPosition.y}) → (${newPosition.x}, ${newPosition.y})`);
    } catch (error) {
      this.error("侧边栏对齐失败:", error);
    }
  }

  /**
   * 获取当前位置
   */
  getCurrentPosition(): { x: number; y: number } | null {
    // 优先从DOM元素读取当前位置
    if (this.tabContainer) {
      const rect = this.tabContainer.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    }
    
    // 如果容器不存在，使用内存中的位置
    if (this.isVerticalMode) {
      return { x: this.verticalPosition.x, y: this.verticalPosition.y };
    } else {
      return { x: this.position.x, y: this.position.y };
    }
  }

  /**
   * 计算侧边栏对齐后的位置
   */
  calculateSidebarAlignmentPosition(
    currentPosition: { x: number; y: number },
    sidebarWidth: number,
    isSidebarClosed: boolean,
    isSidebarOpened: boolean
  ): { x: number; y: number } | null {
    let newX: number;
    
    if (isSidebarClosed) {
      // 侧边栏关闭时，向左移动侧边栏宽度
      newX = Math.max(10, currentPosition.x - sidebarWidth);
      this.log(`📐 侧边栏关闭，向左移动 ${sidebarWidth}px: ${currentPosition.x}px → ${newX}px`);
    } else if (isSidebarOpened) {
      // 侧边栏打开时，向右移动侧边栏宽度
      newX = currentPosition.x + sidebarWidth;
      
      // 确保不超出窗口右边界
      const containerWidth = this.tabContainer?.getBoundingClientRect().width || 
                           (this.isVerticalMode ? this.verticalWidth : 200);
      newX = Math.min(newX, window.innerWidth - containerWidth - 10);
      this.log(`📐 侧边栏打开，向右移动 ${sidebarWidth}px: ${currentPosition.x}px → ${newX}px`);
    } else {
      return null;
    }

    // 保持Y坐标不变，只更新X坐标
    return { x: newX, y: currentPosition.y };
  }

  /**
   * 更新位置到内存并保存
   */
  async updatePosition(newPosition: { x: number; y: number }) {
    if (this.isVerticalMode) {
      this.verticalPosition.x = newPosition.x;
      this.verticalPosition.y = newPosition.y;
      await this.saveLayoutMode();
      this.log(`📍 垂直模式位置已更新: (${newPosition.x}, ${newPosition.y})`);
    } else {
      this.position.x = newPosition.x;
      this.position.y = newPosition.y;
      await this.savePosition();
      this.log(`📍 水平模式位置已更新: (${newPosition.x}, ${newPosition.y})`);
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
      
      // 重新注册顶部工具栏按钮以更新图标状态
      this.registerHeadbarButton();
      
      // 保存状态到API配置
      await this.tabStorageService.saveFloatingWindowVisible(this.isFloatingWindowVisible);
      
      this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? '显示' : '隐藏'}`);
    } catch (error) {
      this.error("切换浮窗状态失败:", error);
    }
  }

  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    this.isFloatingWindowVisible = await this.tabStorageService.restoreFloatingWindowVisible();
  }

  /**
   * 注册顶部工具栏按钮
   */
  registerHeadbarButton() {
    try {
      // 先注销所有按钮，避免重复注册
      this.unregisterHeadbarButton();
      
      // 注册切换按钮（总是显示）
      orca.headbar.registerHeadbarButton(`${this.pluginName}.toggleButton`, () => {
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
        orca.headbar.registerHeadbarButton(`${this.pluginName}.debugButton`, () => {
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

      // 注册最近关闭标签页按钮（根据设置决定是否显示）
      if (this.enableRecentlyClosedTabs && typeof window !== 'undefined') {
        orca.headbar.registerHeadbarButton(`${this.pluginName}.recentlyClosedButton`, () => {
          const React = (window as any).React;
          const Button = orca.components.Button;
          
          return React.createElement(Button, {
            variant: 'plain',
            onClick: (event: MouseEvent) => this.showRecentlyClosedTabsMenu(event),
            title: `最近关闭的标签页 (${this.recentlyClosedTabs?.length || 0})`,
            style: {
              color: (this.recentlyClosedTabs?.length || 0) > 0 ? '#ff6b6b' : '#999',
              transition: 'color 0.2s ease'
            }
          }, React.createElement('i', {
            className: 'ti ti-history'
          }));
        });
      }

      // 注册保存标签页按钮（根据设置决定是否显示）
      if (this.enableMultiTabSaving && typeof window !== 'undefined') {
        orca.headbar.registerHeadbarButton(`${this.pluginName}.savedTabsButton`, () => {
          const React = (window as any).React;
          const Button = orca.components.Button;
          
          return React.createElement(Button, {
            variant: 'plain',
            onClick: (event: MouseEvent) => this.showSavedTabSetsMenu(event),
            title: `保存的标签页集合 (${this.savedTabSets?.length || 0})`,
            style: {
              color: (this.savedTabSets?.length || 0) > 0 ? '#3b82f6' : '#999',
              transition: 'color 0.2s ease'
            }
          }, React.createElement('i', {
            className: 'ti ti-bookmark'
          }));
        });
      }


      
      this.log(`🔘 顶部工具栏按钮已注册 (切换按钮: 总是显示, 调试按钮: ${this.showInHeadbar ? '显示' : '隐藏'}, 最近关闭: ${this.enableRecentlyClosedTabs ? '显示' : '隐藏'}, 保存标签页: ${this.enableMultiTabSaving ? '显示' : '隐藏'})`);
    } catch (error) {
      this.error("注册顶部工具栏按钮失败:", error);
    }
  }

  /**
   * 注销顶部工具栏按钮
   */
  unregisterHeadbarButton() {
    try {
      // 注销切换按钮
      orca.headbar.unregisterHeadbarButton(`${this.pluginName}.toggleButton`);
      
      // 注销调试按钮（无论是否在调试模式都尝试注销）
      orca.headbar.unregisterHeadbarButton(`${this.pluginName}.debugButton`);
      
      // 注销最近关闭标签页按钮
      orca.headbar.unregisterHeadbarButton(`${this.pluginName}.recentlyClosedButton`);
      
      // 注销保存标签页按钮
      orca.headbar.unregisterHeadbarButton(`${this.pluginName}.savedTabsButton`);
      
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
    // 控制台表格输出已禁用
    
    // 显示当前标签的块类型信息
    const currentTabs = this.getCurrentPanelTabs();
    if (currentTabs.length > 0) {
    }
    
    this.log("🎨 块类型图标信息已输出到控制台");
  }

  /**
   * 切换块类型图标显示
   */
  async toggleBlockTypeIcons() {
    this.showBlockTypeIcons = !this.showBlockTypeIcons;
    
    this.log(`🎨 切换块类型图标显示: ${this.showBlockTypeIcons ? '开启' : '关闭'}`);
    
    // 立即更新UI，不需要重新获取块类型
    await this.updateTabsUI();
    
    // 重新注册顶部工具栏按钮以更新按钮状态
    await this.registerHeadbarButton();
    
    // 保存设置
    try {
      await this.saveLayoutMode();
      // 同步更新插件设置
      await this.storageService.saveConfig('showBlockTypeIcons', this.showBlockTypeIcons, this.pluginName);
      this.log(`✅ 块类型图标显示设置已保存: ${this.showBlockTypeIcons ? '开启' : '关闭'}`);
    } catch (error) {
      this.error("保存设置失败:", error);
    }
  }


  /**
   * 更新所有标签页的块类型和图标
   */
  async updateAllTabsBlockTypes() {
    this.log("🔄 开始更新所有标签页的块类型和图标...");
    
    const currentTabs = this.getCurrentPanelTabs();
    if (currentTabs.length === 0) {
      this.log("⚠️ 没有标签页需要更新");
      return;
    }
    
    let hasUpdates = false;
    
    for (let i = 0; i < currentTabs.length; i++) {
      const tab = currentTabs[i];
      try {
        // 重新获取块信息
        const block = await orca.invokeBackend("get-block", parseInt(tab.blockId));
        if (block) {
          // 检测块类型（使用工具函数）
          const blockType = await detectBlockType(block);
          
          // 获取颜色和图标（优先使用用户自定义，否则使用块类型图标）
          const colorProp = this.findProperty(block, '_color');
          const iconProp = this.findProperty(block, '_icon');
          
          let color = tab.color; // 保持现有颜色
          let icon = tab.icon; // 保持现有图标
          
          // 更新颜色
          if (colorProp && colorProp.type === 1) {
            color = colorProp.value;
          }
          
          // 更新图标
          if (iconProp && iconProp.type === 1 && iconProp.value && iconProp.value.trim()) {
            icon = iconProp.value;
          } else if (!icon) {
            icon = getBlockTypeIcon(blockType);
          }
          
          // 检查是否需要更新
          const needsUpdate = tab.blockType !== blockType || tab.icon !== icon || tab.color !== color;
          
          if (needsUpdate) {
            // 更新标签信息
            currentTabs[i] = {
              ...tab,
              blockType,
              icon,
              color
            };
            
            this.log(`✅ 更新标签: ${tab.title} -> 类型: ${blockType}, 图标: ${icon}, 颜色: ${color}`);
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
      this.log("🔄 检测到更新，保存数据并重新创建UI...");
      // 保存更新后的数据
      this.setCurrentPanelTabs(currentTabs);
      await this.createTabsUI();
    } else {
      this.log("ℹ️ 没有标签页需要更新");
    }
    
    this.log("✅ 所有标签页的块类型和图标已更新");
  }

  /**
   * 对齐到侧边栏（手动触发）
   */
  async alignToSidebar() {
    try {
      this.log("🎯 手动触发侧边栏对齐");
      await this.performSidebarAlignment();
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
      right: 0;
      width: 6px;
      height: 100%;
      cursor: col-resize;
      background: transparent;
      z-index: 1000;
      pointer-events: auto;
      transition: background 0.2s ease;
    `;

    // 添加悬停效果
    this.resizeHandle.addEventListener('mouseenter', () => {
      this.resizeHandle!.style.background = 'rgba(0, 122, 204, 0.3)';
    });
    
    this.resizeHandle.addEventListener('mouseleave', () => {
      this.resizeHandle!.style.background = 'transparent';
    });

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

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(120, Math.min(400, startWidth + deltaX));
      
      this.verticalWidth = newWidth;
      
      // 直接调整标签容器宽度
        this.tabContainer!.style.width = `${newWidth}px`;
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
    
    // 设置样式 - 移除JS主题检测，让CSS变量自动处理
    // 固定到顶部模式使用水平布局样式
    const useVerticalStyle = this.isVerticalMode && !this.isFixedToTop;
    const tabStyle = createTabBaseStyle(tab, useVerticalStyle, () => '', this.horizontalTabMaxWidth, this.horizontalTabMinWidth);
    tabElement.style.cssText = tabStyle;

    // 创建标签内容容器
    const tabContent = createTabContentContainer();

    // 创建图标容器（根据设置决定是否显示图标）
    if (tab.icon && this.showBlockTypeIcons) {
      const iconContainer = createTabIconContainer(tab.icon);
      tabContent.appendChild(iconContainer);
    }

    // 创建文本容器
    const textContainer = createTabTextContainer(tab.title);

    // 添加文本容器到内容容器
    tabContent.appendChild(textContainer);

    // 如果是固定标签，添加独立的图钉图标
    if (tab.isPinned) {
      const pinIcon = createPinIcon();
      tabContent.appendChild(pinIcon);
    }

    // 将内容容器添加到标签元素
    tabElement.appendChild(tabContent);
    
    // 如果是垂直模式且没有拖拽手柄，自动添加
    if (this.isVerticalMode && !this.resizeHandle) {
      this.enableDragResize();
    }
    
      // 设置悬停提示
      addTooltip(tabElement, createCustomTabTooltip(tab));

    // 添加点击事件
    tabElement.addEventListener('click', (e) => {
      // 检查是否点击了 drag-handle 元素，如果是则忽略
      const target = e.target as HTMLElement;
      if (target.classList.contains('drag-handle') || (target.closest && target.closest('.drag-handle'))) {
        return;
      }
      
      // 检查是否刚刚触发了长按事件，如果是则不执行点击切换
      if (tabElement.getAttribute('data-long-pressed') === 'true') {
        tabElement.removeAttribute('data-long-pressed');
        return;
      }
      
      // 检查是否已经有悬浮列表显示，如果有则隐藏
      const existingContainer = document.querySelector('.hover-tab-list-container');
      if (existingContainer) {
        hideHoverTabList();
        return;
      }
      
      // 只阻止默认行为，但允许事件继续传播让Orca能正常响应
      e.preventDefault();
      // 移除过度的事件阻止，让Orca能正常处理点击
      // e.stopPropagation();
      // e.stopImmediatePropagation();
      
      this.log(`🖱️ 点击标签: ${tab.title} (ID: ${tab.blockId})`);
      
      // 如果标签在已关闭列表中，先从列表中移除
      if (this.closedTabs.has(tab.blockId)) {
        this.closedTabs.delete(tab.blockId);
        this.saveClosedTabs();
        this.log(`🔄 点击已关闭的标签 "${tab.title}"，从已关闭列表中移除`);
      }
      
      // 移除其他标签的聚焦状态
      const allTabs = this.tabContainer?.querySelectorAll('.orca-tabs-plugin .orca-tab');
      allTabs?.forEach(t => t.removeAttribute('data-focused'));
      
      // 设置当前标签为聚焦状态
      tabElement.setAttribute('data-focused', 'true');
      
      // 普通点击切换标签
      this.switchToTab(tab);
    });
    
    // 添加mousedown事件用于调试
    tabElement.addEventListener('mousedown', (e) => {
    });

    // 添加双击事件切换固定状态
    tabElement.addEventListener('dblclick', (e) => {
      // 检查是否点击了 drag-handle 元素，如果是则忽略
      const target = e.target as HTMLElement;
      if (target.classList.contains('drag-handle') || (target.closest && target.closest('.drag-handle'))) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // 根据功能开关决定行为
      this.log(`🔧 双击事件处理: enableDoubleClickClose=${this.enableDoubleClickClose}`);
      if (this.enableDoubleClickClose) {
        // 双击关闭标签页
        this.log('🔧 双击关闭标签页');
        this.closeTab(tab);
      } else {
        // 默认行为：切换固定状态
        this.log('🔧 双击切换固定状态');
        this.toggleTabPinStatus(tab);
      }
    });

    // 添加中键点击事件
    tabElement.addEventListener('auxclick', (e) => {
      if (e.button === 1) { // 中键
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // 根据功能开关决定行为
        this.log(`🔧 中键事件处理: enableMiddleClickPin=${this.enableMiddleClickPin}`);
        if (this.enableMiddleClickPin) {
          // 中键固定标签页
          this.log('🔧 中键固定标签页');
          this.toggleTabPinStatus(tab);
        } else {
          // 默认行为：关闭标签页
          this.log('🔧 中键关闭标签页');
          this.closeTab(tab);
        }
      }
    });

    // 添加键盘快捷键支持
    tabElement.addEventListener('keydown', (e) => {
      if (e.target === tabElement || tabElement.contains(e.target as Node)) {
        if (e.key === 'F2') {
      e.preventDefault();
      e.stopPropagation();
          this.renameTab(tab);
        } else if (e.ctrlKey && e.key === 'w') {
          e.preventDefault();
          e.stopPropagation();
          this.closeTab(tab);
        }
      }
    });

    // 添加右键菜单事件（使用Orca原生ContextMenu）
    this.addOrcaContextMenu(tabElement, tab);

    // 添加左键长按事件显示最近切换标签
    this.addLongPressTabListEvents(tabElement, tab);

    // 添加标签拖拽排序功能（所有标签都可以拖动）
    tabElement.draggable = true;
    
    // 拖拽开始事件（优化版）
    tabElement.addEventListener('dragstart', (e) => {
      // 检查是否在侧边栏拖拽区域，如果是则不处理标签拖拽
      const target = e.target as HTMLElement;
      if (target.closest && target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
        e.preventDefault();
        return;
      }
      
      // 检查是否点击了 drag-handle 元素，如果是则忽略拖拽
      if (target.classList.contains('drag-handle') || (target.closest && target.closest('.drag-handle'))) {
        e.preventDefault();
        return;
      }
      
      e.dataTransfer!.effectAllowed = 'move'; // 声明拖拽类型为"移动"
      e.dataTransfer!.dropEffect = 'move'; // 设置鼠标样式为移动
      e.dataTransfer?.setData('text/plain', tab.blockId);
      
      // 使用透明图像完全隐藏浏览器默认的拖拽预览（设置偏移避免元素跳动）
      const emptyImg = document.createElement('img');
      emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      emptyImg.style.opacity = '0';
      try {
        // 使用鼠标相对位置作为偏移，避免拖拽时元素跳动
        const rect = tabElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        e.dataTransfer?.setDragImage(emptyImg, offsetX, offsetY);
      } catch (error) {
        // 某些浏览器可能不支持
      }
      
      // 记录当前被拖拽的标签
      this.draggingTab = tab;
      this.dragOverTab = null; // 重置悬停标签
      this.lastSwapKey = ''; // 重置交换键
      
      // 优化：懒加载拖拽监听器
      if (!this.isDragListenersInitialized) {
        this.setupOptimizedDragListeners();
        this.isDragListenersInitialized = true;
      }
      
      // 只在拖拽开始时添加全局监听器
      if (this.dragOverListener) {
        console.log('🔄 添加全局拖拽监听器');
        document.addEventListener('dragover', this.dragOverListener);
      }
      
      console.log('🔄 拖拽开始，设置draggingTab:', tab.title);
      
      // 清除之前的防抖定时器
      if (this.swapDebounceTimer) {
        clearTimeout(this.swapDebounceTimer);
        this.swapDebounceTimer = null;
      }
      
      // 延迟隐藏原位置的标签（避免干扰拖拽事件）
      requestAnimationFrame(() => {
        tabElement.style.opacity = '0';
        tabElement.style.pointerEvents = 'none';
      });
      
      // 设置容器拖拽状态
      if (this.tabContainer) {
        this.tabContainer.setAttribute('data-dragging', 'true');
      }
      
      this.log(`🔄 开始拖拽标签: ${tab.title} (ID: ${tab.blockId})`);
    });

    // 拖拽结束事件（改进版）
    tabElement.addEventListener('dragend', async (e) => {
      console.log('🔄 拖拽结束，清除draggingTab');
      
      // 优化：拖拽结束时移除全局监听器
      if (this.dragOverListener) {
        console.log('🔄 移除全局拖拽监听器');
        document.removeEventListener('dragover', this.dragOverListener);
      }
      
      // 清除所有拖拽相关的定时器
      if (this.swapDebounceTimer) {
        clearTimeout(this.swapDebounceTimer);
        this.swapDebounceTimer = null;
      }
      if (this.dragOverTimer) {
        clearTimeout(this.dragOverTimer);
        this.dragOverTimer = null;
      }
      
      // 清除拖拽指示器
      this.clearDropIndicator();
      
      // 清除视觉反馈
      this.clearDragVisualFeedback();
      
      // 保存最终的标签顺序（重要：确保拖拽结果被持久化）
      const currentTabs = this.getCurrentPanelTabs();
      await this.setCurrentPanelTabs(currentTabs);
      
      // 清除所有拖拽状态
      this.draggingTab = null;
      this.dragOverTab = null;
      this.lastSwapKey = '';
      
      // 拖拽结束后立即更新UI
      this.debouncedUpdateTabsUI();
      
      this.log(`🔄 结束拖拽标签: ${tab.title}`);
    });

    // 拖拽经过事件（改进版）- 限制在容器内
    tabElement.addEventListener('dragover', (e) => {
      // 检查是否在侧边栏拖拽区域，如果是则不处理标签拖拽
      const target = e.target as HTMLElement;
      if (target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
        return;
      }
      
      // 检查是否在标签容器内
      if (this.tabContainer && !this.tabContainer.contains(target)) {
        e.dataTransfer!.dropEffect = 'none';
        return;
      }
      
      // 检查是否点击到了非标签元素（如关闭按钮等）
      if (target.classList.contains('close-button') || 
          target.classList.contains('new-tab-button') || 
          target.classList.contains('drag-handle') ||
          target.classList.contains('resize-handle') ||
          target.classList.contains('tab-icon')) {
        return;
      }
      
      if (this.draggingTab && this.draggingTab.blockId !== tab.blockId) {
        // 置顶标签只能拖到置顶标签上，非置顶标签只能拖到非置顶标签上
        if (this.draggingTab.isPinned !== tab.isPinned) {
          e.dataTransfer!.dropEffect = 'none';
          return;
        }
        
        e.preventDefault(); // 允许放置（必须调用，否则无法触发后续逻辑）
        e.stopPropagation(); // 阻止事件冒泡
        e.dataTransfer!.dropEffect = 'move';
        
        // 根据布局模式判断位置
        const rect = tabElement.getBoundingClientRect();
        const isVertical = this.isVerticalMode && !this.isFixedToTop;
        let position: 'before' | 'after';
        
        if (isVertical) {
          // 垂直布局：根据Y轴判断
          const midY = rect.top + rect.height / 2;
          position = e.clientY < midY ? 'before' : 'after';
        } else {
          // 水平布局：根据X轴判断
          const midX = rect.left + rect.width / 2;
          position = e.clientX < midX ? 'before' : 'after';
        }
        
        // 更新拖拽目标指示器
        this.updateDropIndicator(tabElement, position);
        this.dragOverTab = tab;
        
        // 使用防抖优化，避免频繁交换
        const swapKey = `${tab.blockId}-${position}`;
        if (this.lastSwapKey !== swapKey) {
          this.lastSwapKey = swapKey;
          
          // 清除之前的定时器
          if (this.swapDebounceTimer) {
            clearTimeout(this.swapDebounceTimer);
          }
          
          // 延迟执行交换，避免快速移动时频繁触发
          this.swapDebounceTimer = setTimeout(async () => {
            await this.swapTabsRealtime(tab, this.draggingTab!, position);
          }, 100) as any as number; // 100ms防抖，更流畅
        }
        
        this.verboseLog(`🔄 拖拽经过: ${tab.title} (位置: ${position})`);
      }
    });

    // 拖拽进入事件（改进版）
    tabElement.addEventListener('dragenter', (e) => {
      // 检查是否在侧边栏拖拽区域，如果是则不处理标签拖拽
      const target = e.target as HTMLElement;
      if (target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
        return;
      }
      
      if (this.draggingTab && this.draggingTab.blockId !== tab.blockId) {
        // 置顶标签只能拖到置顶标签上，非置顶标签只能拖到非置顶标签上
        if (this.draggingTab.isPinned !== tab.isPinned) {
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        this.verboseLog(`🔄 拖拽进入: ${tab.title}`);
      }
    });

    // 拖拽离开事件（改进版）
    tabElement.addEventListener('dragleave', (e) => {
      // 检查是否真的离开了元素（而不是进入子元素）
      const rect = tabElement.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      // 增加容错范围，避免快速移动时误判
      const tolerance = 5;
      if (x < rect.left - tolerance || x > rect.right + tolerance || 
          y < rect.top - tolerance || y > rect.bottom + tolerance) {
        this.verboseLog(`🔄 拖拽离开: ${tab.title}`);
      }
    });

    // 拖拽放置事件 - 已在拖拽过程中实时交换，这里只需清理状态
    tabElement.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const draggedBlockId = e.dataTransfer?.getData('text/plain');
      this.log(`🔄 拖拽放置完成: ${draggedBlockId} -> ${tab.blockId}`);
    });


    return tabElement;
  }

  hexToRgba(hex: string, alpha: number): string {
    return hexToRgba(hex, alpha);
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
    return applyOklchFormula(hex, type);
  }

  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 标签操作 - Tab Operations */
  /* ———————————————————————————————————————————————————————————————————————————— */

  /**
   * 获取当前面板的标签页数据 - 重构为简化的数组访问
   * 按照用户思路：直接用索引访问panelTabsData数组
   */
  private getCurrentPanelTabs(): TabInfo[] {
    this.verboseLog(`📋 [DEBUG] getCurrentPanelTabs 调用`);
    
    // 检查当前面板索引是否有效
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length) {
      this.log(`⚠️ [DEBUG] 当前面板索引无效: ${this.currentPanelIndex}, 面板总数: ${this.getPanelIds().length}`);
      return [];
    }
    
    // 确保panelTabsData数组有足够的大小
    if (this.currentPanelIndex >= this.panelTabsData.length) {
      this.log(`🔧 [DEBUG] 调整panelTabsData数组大小，当前: ${this.panelTabsData.length}, 需要: ${this.currentPanelIndex + 1}`);
      this.adjustPanelTabsDataSize();
    }
    
    const tabs = this.panelTabsData[this.currentPanelIndex] || [];
    this.verboseLog(`📋 [DEBUG] 获取面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${tabs.length} 个`);
    
    return tabs;
  }

  /**
   * 设置当前面板的标签页数据 - 重构为简化的数组操作
   * 按照用户思路：直接更新panelTabsData数组
   */
  private setCurrentPanelTabs(tabs: TabInfo[]): void {
    // 检查当前面板索引是否有效
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length) {
      this.log(`⚠️ 无法设置标签页数据，当前面板索引无效: ${this.currentPanelIndex}`);
      return;
    }
    
    // 确保panelTabsData数组有足够的大小
    if (this.currentPanelIndex >= this.panelTabsData.length) {
      this.adjustPanelTabsDataSize();
    }
    
    // 直接更新对应索引的标签页数据
    this.panelTabsData[this.currentPanelIndex] = [...tabs];
    
    // 改为VERBOSE级别，减少生产环境日志输出
    this.verboseLog(`📋 设置面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${tabs.length} 个`);
    
    // 保存数据到存储
    this.saveCurrentPanelTabs();
  }
  
  /**
   * 保存当前面板的标签页数据到存储（带防抖）
   * 
   * 使用防抖机制避免频繁保存：
   * - 在短时间内的多次保存操作会被合并为一次
   * - 减少I/O操作，提高性能
   * - 确保最终数据的一致性
   */
  private saveCurrentPanelTabs() {
    // 清除之前的定时器
    if (this.saveDataDebounceTimer !== null) {
      clearTimeout(this.saveDataDebounceTimer);
    }
    
    // 设置新的防抖定时器
    this.saveDataDebounceTimer = window.setTimeout(async () => {
      try {
        if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length) {
          return;
        }
        
        const tabs = this.panelTabsData[this.currentPanelIndex] || [];
        
        // 基于位置顺序保存数据
        const storageKey = this.currentPanelIndex === 0 ? PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
        await this.tabStorageService.savePanelTabsByKey(storageKey, tabs);
      } catch (error) {
        this.error('保存面板标签页数据失败:', error);
      } finally {
        this.saveDataDebounceTimer = null;
      }
    }, this.SAVE_DEBOUNCE_DELAY);
  }
  
  /**
   * 立即保存当前面板的标签页数据（不使用防抖）
   * 
   * 在某些关键场景下需要立即保存数据，不能等待防抖：
   * - 插件卸载时
   * - 用户手动触发保存时
   * - 面板关闭时
   */
  private async saveCurrentPanelTabsImmediately() {
    // 取消防抖定时器
    if (this.saveDataDebounceTimer !== null) {
      clearTimeout(this.saveDataDebounceTimer);
      this.saveDataDebounceTimer = null;
    }
    
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length) {
      return;
    }
    
    const tabs = this.panelTabsData[this.currentPanelIndex] || [];
    
    // 基于位置顺序保存数据
    const storageKey = this.currentPanelIndex === 0 ? PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.tabStorageService.savePanelTabsByKey(storageKey, tabs);
  }


  /**
   * 同步当前标签数组到对应的存储数组
   */
  private syncCurrentTabsToStorage(tabs: TabInfo[]): void {
    this.setCurrentPanelTabs(tabs);
  }


  async switchToTab(tab: TabInfo) {
    try {
      this.recordPerformanceCountMetric(this.performanceMetricKeys.tabInteraction);
      this.log(`🔄 开始切换标签: ${tab.title} (ID: ${tab.blockId})`);
      
      // 设置标记，防止在切换过程中错误替换标签
      this.isSwitchingTab = true;
      
      // 记录当前激活标签的滚动位置
      const currentActiveTab = this.getCurrentActiveTab();
      if (currentActiveTab) {
        this.recordScrollPosition(currentActiveTab);
        // 记录当前激活的标签ID，用于后续新标签的插入位置
        this.lastActiveBlockId = currentActiveTab.blockId;
        this.log(`🎯 记录切换前的激活标签: ${currentActiveTab.title} (ID: ${currentActiveTab.blockId})`);
        
        // 记录标签切换历史 - 无论是否切换到不同标签都记录
        this.recordTabSwitchHistory(currentActiveTab.blockId, tab);
      }
      
      // 根据标签信息和当前状态决定目标面板
      const panelIds = this.getPanelIds();
      let targetPanelId = '';

      if (tab.panelId && panelIds.includes(tab.panelId)) {
        targetPanelId = tab.panelId;
      } else if (this.currentPanelId && panelIds.includes(this.currentPanelId)) {
        targetPanelId = this.currentPanelId;
      } else if (panelIds.length > 0) {
        targetPanelId = panelIds[0];
      }

      if (!targetPanelId) {
        this.warn(`⚠️ 无法确定目标面板，当前没有可用的面板`);
        return;
      }

      const resolvedPanelIndex = panelIds.indexOf(targetPanelId);
      if (resolvedPanelIndex !== -1) {
        this.currentPanelIndex = resolvedPanelIndex;
        this.currentPanelId = targetPanelId;
      } else {
        this.warn(`⚠️ 目标面板 ${targetPanelId} 不在面板列表中`);
      }

      this.log(`🎯 目标面板ID: ${targetPanelId}, 当前面板索引: ${this.currentPanelIndex}`);

      try {
        orca.nav.switchFocusTo(targetPanelId);
      } catch (focusError) {
        this.verboseLog('无法直接聚焦面板，继续尝试导航', focusError);
      }
      
      // 使用更安全的导航方式
      try {
        /**
         * 统一使用块导航方式（修复日期类型标签页切换问题）
         * 
         * 问题背景：
         * - 日期类型标签页使用 orca.nav.goTo("journal", ...) 导航
         * - 普通块使用 orca.nav.goTo("block", ...) 导航
         * - journal 导航可能不会触发聚焦变化事件，导致标签页不同步
         * 
         * 修复方案：
         * - 统一使用块导航方式，确保所有标签页都能正确触发聚焦变化
         * - 移除复杂的日期提取和处理逻辑，简化代码
         * - 保持与普通块标签页一致的行为
         * 
         * 避坑点：
         * 1. 不要使用 orca.nav.goTo("journal", ...) 导航日期块
         * 2. 不要依赖日期提取逻辑，直接使用块ID导航
         * 3. 确保所有标签页使用相同的导航方式
         * 4. 避免复杂的条件判断，保持代码简洁
         */
        this.log(`🚀 尝试使用安全导航到块 ${tab.blockId}`);
        await this.safeNavigate(tab.blockId, targetPanelId);
        this.log(`✅ 安全导航成功`);
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

      await this.focusTabElementById(tab.blockId);
      
      // 如果启用了工作区功能且有当前工作区，实时更新工作区
      if (this.enableWorkspaces && this.currentWorkspace) {
        await this.saveCurrentTabsToWorkspace();
        this.log(`🔄 标签页切换，实时更新工作区: ${tab.title}`);
      }
      
      // 延迟清除标记，确保导航完成后再允许替换操作
      setTimeout(() => {
        this.isSwitchingTab = false;
      }, 300);
    } catch (e) {
      this.error("切换标签失败:", e);
      this.isSwitchingTab = false; // 出错时也要清除标记
    }
  }

  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(tab: TabInfo): boolean {
    // 只检查当前激活的面板
    const currentActivePanel = document.querySelector('.orca-panel.active');
    if (!currentActivePanel) return false;
    
    // 获取当前激活面板中可见的块编辑器（没有 orca-hideable-hidden 类）
    const activeBlockEditor = currentActivePanel.querySelector('.orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) return false;
    
    const activeBlockId = activeBlockEditor.getAttribute('data-block-id');
    return activeBlockId === tab.blockId;
  }

  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(closedTab: TabInfo) {
    const currentTabs = this.getCurrentPanelTabs();
    const currentIndex = currentTabs.findIndex(tab => tab.blockId === closedTab.blockId);
    if (currentIndex === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    
    let targetIndex = -1;
    
    // 根据位置决定切换到哪个相邻标签
    if (currentIndex === 0) {
      // 最左边：切换到右边
      targetIndex = 1;
    } else if (currentIndex === currentTabs.length - 1) {
      // 最右边：切换到左边
      targetIndex = currentIndex - 1;
    } else {
      // 中间：优先切换到右边
      targetIndex = currentIndex + 1;
    }
    
    // 检查目标索引是否有效
    if (targetIndex >= 0 && targetIndex < currentTabs.length) {
      const targetTab = currentTabs[targetIndex];
      this.log(`🔄 自动切换到相邻标签: "${targetTab.title}" (位置: ${targetIndex})`);
      
      // 导航到目标标签页（在当前面板中打开）
      if (this.currentPanelId || '') {
        await this.safeNavigate(targetTab.blockId, this.currentPanelId || '');
      }
    } else {
      this.log("没有可切换的相邻标签页");
    }
  }

  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(tab: TabInfo) {
    const currentTabs = this.getCurrentPanelTabs();
    
    const result = toggleTabPinStatus(tab, currentTabs, {
      updateOrder: true,
      saveData: true,
      updateUI: true
    });
    
    if (result.success) {
      // 同步更新对应的存储数组
      this.syncCurrentTabsToStorage(currentTabs);
      
      // 更新UI和保存数据（修复同步问题）
      await this.immediateUpdateTabsUI();
       await this.saveCurrentPanelTabs();
      
      // 如果启用了工作区功能且有当前工作区，实时更新工作区
      if (this.enableWorkspaces && this.currentWorkspace) {
        await this.saveCurrentTabsToWorkspace();
        this.log(`🔄 标签页固定状态变化，实时更新工作区: ${tab.title}`);
      }
      
      this.log(result.message);
    } else {
      this.warn(result.message);
    }
  }


  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 设置管理 - Settings Management */
  /* ———————————————————————————————————————————————————————————————————————————— */

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
        showInHeadbar: {
          label: "显示顶部工具栏按钮",
          type: "boolean" as const,
          defaultValue: true,
          description: "控制标签页顶部是否显示块类型图标按钮"
        },
        enableRecentlyClosedTabs: {
          label: "启用最近关闭的标签页功能",
          type: "boolean" as const,
          defaultValue: true,
          description: "控制是否启用最近关闭的标签页功能，包括顶部工具栏按钮和标签页恢复功能"
        },
        enableMultiTabSaving: {
          label: "启用多标签页保存功能",
          type: "boolean" as const,
          defaultValue: true,
          description: "控制是否启用多标签页保存功能，可以保存当前多个标签页的集合并随时恢复"
        },
        enableWorkspaces: {
          label: "启用工作区功能",
          type: "boolean" as const,
          defaultValue: true,
          description: "控制是否启用工作区功能，可以保存当前标签页为工作区并快速切换"
        },
        debugMode: {
          label: "调试模式",
          type: "boolean" as const,
          defaultValue: false,
          description: "开启后将显示详细的调试日志（仅用于开发调试，可能影响性能）"
        },
        restoreFocusedTab: {
          label: "刷新后恢复聚焦标签页",
          type: "boolean" as const,
          defaultValue: true,
          description: "开启后，软件刷新时将自动聚焦并打开当前聚焦的标签页；关闭后，只打开持久化的标签页"
        },
        enableMiddleClickPin: {
          label: "中键固定/双击关闭模式",
          type: "boolean" as const,
          defaultValue: false,
          description: "开启：中键=固定/取消固定，双击=关闭；关闭：中键=关闭，双击=固定/取消固定"
        },
      };

      await orca.plugins.setSettingsSchema(this.pluginName, settingsSchema);
      
      // 读取设置值
      const settings = orca.state.plugins[this.pluginName]?.settings;
      
      if (settings?.homePageBlockId) {
        this.homePageBlockId = settings.homePageBlockId;
        this.log(`🏠 主页块ID: ${this.homePageBlockId}`);
      }
      
      if (settings?.showInHeadbar !== undefined) {
        this.showInHeadbar = settings.showInHeadbar;
        this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? '开启' : '关闭'}`);
      }
      
      if (settings?.enableRecentlyClosedTabs !== undefined) {
        this.enableRecentlyClosedTabs = settings.enableRecentlyClosedTabs;
        this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? '开启' : '关闭'}`);
      }
      
      if (settings?.enableMultiTabSaving !== undefined) {
        this.enableMultiTabSaving = settings.enableMultiTabSaving;
        this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? '开启' : '关闭'}`);
      }
      
      if (settings?.enableWorkspaces !== undefined) {
        this.enableWorkspaces = settings.enableWorkspaces;
        this.log(`📁 工作区功能: ${this.enableWorkspaces ? '开启' : '关闭'}`);
      }
      
      if (settings?.debugMode !== undefined) {
        if (settings.debugMode) {
          this.setLogLevel(LogLevel.VERBOSE);
        } else {
          this.setLogLevel(LogLevel.INFO);
        }
        // 保存调试模式设置
        await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.DEBUG_MODE, settings.debugMode, this.pluginName);
      }
      
      if (settings?.restoreFocusedTab !== undefined) {
        this.restoreFocusedTab = settings.restoreFocusedTab;
        this.log(`🎯 刷新后恢复聚焦标签页: ${this.restoreFocusedTab ? '开启' : '关闭'}`);
        // 保存设置
        await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.RESTORE_FOCUSED_TAB, settings.restoreFocusedTab, this.pluginName);
      }

      // 新增：读取并持久化“中键固定 / 双击关闭”设置（单一开关，兼容旧字段）
      if (settings?.enableMiddleClickPin !== undefined) {
        this.enableMiddleClickPin = settings.enableMiddleClickPin;
        this.enableDoubleClickClose = settings.enableMiddleClickPin; // 同步
        await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_MIDDLE_CLICK_PIN, settings.enableMiddleClickPin, this.pluginName);
        await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_DOUBLE_CLICK_CLOSE, settings.enableMiddleClickPin, this.pluginName);
      }
      // 兼容：若旧版本面板仍传入 enableDoubleClickClose，则以其为准同步两端
      if (settings?.enableDoubleClickClose !== undefined) {
        this.enableMiddleClickPin = settings.enableDoubleClickClose;
        this.enableDoubleClickClose = settings.enableDoubleClickClose;
        await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_MIDDLE_CLICK_PIN, settings.enableDoubleClickClose, this.pluginName);
        await this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_DOUBLE_CLICK_CLOSE, settings.enableDoubleClickClose, this.pluginName);
      }
      
      this.log("✅ 插件设置已注册");
    } catch (error) {
      this.error("注册插件设置失败:", error);
    }
  }

  /**
   * 设置设置检查监听器
   */
  private setupSettingsChecker() {
    // 初始化设置状态
    this.lastSettings = {
      showInHeadbar: this.showInHeadbar,
      homePageBlockId: this.homePageBlockId,
      enableWorkspaces: this.enableWorkspaces,
      debugMode: this.currentLogLevel === LogLevel.VERBOSE,
      restoreFocusedTab: this.restoreFocusedTab,
      enableMiddleClickPin: this.enableMiddleClickPin
    };
    
    // 每2秒检查一次设置变化
    this.settingsCheckInterval = setInterval(() => {
      this.checkSettingsChange();
    }, 2000) as any as number;
  }

  /**
   * 检查设置变化
   */
  private checkSettingsChange() {
    try {
      const currentSettings = orca.state.plugins[this.pluginName]?.settings;
      if (!currentSettings) return;
      
      // 检查各个设置是否发生变化
      if (currentSettings.showInHeadbar !== this.lastSettings.showInHeadbar) {
        const oldValue = this.showInHeadbar;
        this.showInHeadbar = currentSettings.showInHeadbar;
        this.log(`🔘 设置变化：顶部工具栏按钮显示 ${oldValue ? '开启' : '关闭'} -> ${this.showInHeadbar ? '开启' : '关闭'}`);
        
        // 重新注册按钮
        this.registerHeadbarButton();
        this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      
      if (currentSettings.homePageBlockId !== this.lastSettings.homePageBlockId) {
        this.homePageBlockId = currentSettings.homePageBlockId;
        this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`);
        this.lastSettings.homePageBlockId = this.homePageBlockId;
      }
      
      if (currentSettings.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const oldValue = this.enableWorkspaces;
        this.enableWorkspaces = currentSettings.enableWorkspaces;
        this.log(`📁 设置变化：工作区功能 ${oldValue ? '开启' : '关闭'} -> ${this.enableWorkspaces ? '开启' : '关闭'}`);

        // 如果没有启用工作区功能，先移除工作区按钮
        if (!this.enableWorkspaces) {
          this.removeWorkspaceButton();
        }
        
        // 重新更新UI以显示或隐藏工作区按钮
        this.debouncedUpdateTabsUI();
        this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
      
      if (currentSettings.debugMode !== this.lastSettings.debugMode) {
        if (currentSettings.debugMode) {
          this.setLogLevel(LogLevel.VERBOSE);
        } else {
          this.setLogLevel(LogLevel.INFO);
        }
        // 异步保存调试模式设置
        this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.DEBUG_MODE, currentSettings.debugMode, this.pluginName).catch(err => {
          this.error("保存调试模式设置失败:", err);
        });
        this.lastSettings.debugMode = currentSettings.debugMode;
      }
      
      if (currentSettings.restoreFocusedTab !== this.lastSettings.restoreFocusedTab) {
        const oldValue = this.restoreFocusedTab;
        this.restoreFocusedTab = currentSettings.restoreFocusedTab;
        this.log(`🎯 设置变化：刷新后恢复聚焦标签页 ${oldValue ? '开启' : '关闭'} -> ${this.restoreFocusedTab ? '开启' : '关闭'}`);
        // 异步保存设置
        this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.RESTORE_FOCUSED_TAB, currentSettings.restoreFocusedTab, this.pluginName).catch(err => {
          this.error("保存聚焦标签页恢复设置失败:", err);
        });
        this.lastSettings.restoreFocusedTab = this.restoreFocusedTab;
      }

      // 新增：监听中键固定/双击关闭（单一设置）变化；兼容旧字段
      const currentSwap = (currentSettings.enableMiddleClickPin !== undefined)
        ? currentSettings.enableMiddleClickPin
        : currentSettings.enableDoubleClickClose; // 旧字段

      if (currentSwap !== undefined && currentSwap !== this.lastSettings.enableMiddleClickPin) {
        const newValue = !!currentSwap;
        this.enableMiddleClickPin = currentSettings.enableMiddleClickPin;
        this.enableDoubleClickClose = newValue; // 同步
        this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_MIDDLE_CLICK_PIN, newValue, this.pluginName).catch(err => this.error("保存中键固定设置失败:", err));
        this.storageService.saveConfig(PLUGIN_STORAGE_KEYS.ENABLE_DOUBLE_CLICK_CLOSE, newValue, this.pluginName).catch(err => this.error("保存双击关闭设置失败:", err));
        this.lastSettings.enableMiddleClickPin = newValue;
        // 更新UI中可能存在的按钮状态（若仍存在）
        this.updateFeatureToggleButton?.();
      }
    } catch (error) {
      this.error("检查设置变化失败:", error);
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

      // 注册"添加到已有标签组"命令
      orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.addToTabGroup", {
        worksOnMultipleBlocks: false,
        render: (blockId, rootBlockId, close) => {
          const React = (window as any).React;
          if (!React || !orca.components.MenuText) {
            return null;
          }

          // 如果没有保存的标签组，不显示此选项
          if (this.savedTabSets.length === 0) {
            return null;
          }

          return React.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              close();
              // 创建当前块的标签页信息
              this.getTabInfo(blockId.toString(), this.currentPanelId || '' || '', 0).then(tabInfo => {
                if (tabInfo) {
                  this.showAddToTabGroupDialog(tabInfo);
                } else {
                  orca.notify('error', '无法获取块信息');
                }
              });
            }
          });
        }
      });

      this.log("✅ 已注册块菜单命令: 在新标签页打开");
      this.log("✅ 已注册块菜单命令: 添加到已有标签组");
    } catch (error) {
      this.error("注册块菜单命令失败:", error);
    }
  }

  /**
   * 创建新标签页
   */
  async createNewTab() {
    // 支持所有面板创建新标签
    
    try {
      
      // 使用设置的主页块ID，如果没有设置则默认为1
      const newBlockId = (this.homePageBlockId && this.homePageBlockId.trim()) ? this.homePageBlockId : "1";
      const tabTitle = (this.homePageBlockId && this.homePageBlockId.trim()) ? "🏠 主页" : "📄 新标签页";
      
      this.log(`🆕 创建新标签页，使用块ID: ${newBlockId}`);
      
      // 创建标签信息
      const currentTabs = this.getCurrentPanelTabs();
      const tabInfo: TabInfo = {
        blockId: newBlockId,
        panelId: this.currentPanelId || '',
        title: tabTitle,
        isPinned: false,
        order: currentTabs.length
      };
      
      this.log(`📋 新标签页信息: "${tabInfo.title}" (ID: ${newBlockId})`);
      
      // 获取当前聚焦的标签
      const focusedTab = this.getCurrentActiveTab();
      let insertIndex = currentTabs.length; // 默认插入到末尾
      
      this.log(`📊 当前标签数量: ${currentTabs.length}, 标签列表: ${currentTabs.map(t => t.title).join(', ')}`);
      
      // 一次性逻辑：如果 addNewTabToEnd 为 true，将新标签添加到末尾，然后重置标志
      if (this.addNewTabToEnd) {
        insertIndex = currentTabs.length; // 添加到末尾
        this.log(`🎯 [一次性] 将新标签添加到末尾: "${tabInfo.title}", 插入位置: ${insertIndex}`);
        this.addNewTabToEnd = false; // 重置标志，后续恢复正常行为
        this.log(`♻️ 已重置标志，后续新标签将在聚焦标签后插入`);
      } else if (focusedTab) {
        // 找到聚焦标签的索引，在其后面插入新标签
        const focusedIndex = currentTabs.findIndex(tab => tab.blockId === focusedTab.blockId);
        if (focusedIndex !== -1) {
          insertIndex = focusedIndex + 1; // 在聚焦标签后面插入
          this.log(`🎯 将在聚焦标签 "${focusedTab.title}" 后面插入新标签: "${tabInfo.title}"`);
        }
      } else {
        this.log(`🎯 没有聚焦标签，将添加到末尾`);
      }
      
      // 处理标签数量限制
      if (currentTabs.length >= this.maxTabs) {
        // 达到上限，在指定位置插入新标签，然后删除最后一个非固定标签
        currentTabs.splice(insertIndex, 0, tabInfo);
        this.verboseLog(`➕ 在位置 ${insertIndex} 插入新标签: ${tabInfo.title}`);
        
        // 删除最后一个非固定标签来保持数量限制
        const lastNonPinnedIndex = this.findLastNonPinnedTabIndex();
        if (lastNonPinnedIndex !== -1) {
          const removedTab = currentTabs[lastNonPinnedIndex];
          currentTabs.splice(lastNonPinnedIndex, 1);
          this.log(`🗑️ 删除末尾的非固定标签: "${removedTab.title}" 来保持数量限制`);
          
          // 重新计算所有标签的 order 值
          currentTabs.forEach((tab, index) => {
            tab.order = index;
          });
        } else {
          // 如果所有标签都是固定的，删除刚插入的新标签
          const newTabIndex = currentTabs.findIndex(tab => tab.blockId === tabInfo.blockId);
          if (newTabIndex !== -1) {
            currentTabs.splice(newTabIndex, 1);
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${tabInfo.title}"`);
            return;
          }
        }
      } else {
        // 未达到上限，在指定位置插入新标签
        currentTabs.splice(insertIndex, 0, tabInfo);
        this.verboseLog(`➕ 在位置 ${insertIndex} 插入新标签: ${tabInfo.title}`);
      }
      
      // 重新计算所有标签的 order 值，确保按插入顺序排列
      currentTabs.forEach((tab, index) => {
        tab.order = index;
      });
      this.log(`🔄 已重新计算标签顺序: ${currentTabs.map(t => `${t.title}(${t.order})`).join(', ')}`);
      
      // 同步更新存储数组
      this.syncCurrentTabsToStorage(currentTabs);
      
      // 保存标签数据
       await this.saveCurrentPanelTabs();
      
      // 更新UI
      await this.updateTabsUI();
      
      // 如果启用了工作区功能且有当前工作区，实时更新工作区
      if (this.enableWorkspaces && this.currentWorkspace) {
        await this.saveCurrentTabsToWorkspace();
        this.log(`🔄 创建新标签页，实时更新工作区: ${tabInfo.title}`);
      }
      
      // 导航到目标块
      await this.safeNavigate(newBlockId, this.currentPanelId || '');
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
   * 强制让指定的标签元素呈聚焦状态，确保UI与数据同步
   */
  private async focusTabElementById(blockId: string): Promise<void> {
    if (!this.tabContainer) {
      await this.updateTabsUI();
    }

    const applyFocus = (): boolean => {
      const allTabs = this.tabContainer?.querySelectorAll('.orca-tabs-plugin .orca-tab');
      allTabs?.forEach(tab => tab.removeAttribute('data-focused'));

      const targetTab = this.tabContainer?.querySelector(`[data-tab-id="${blockId}"]`) as HTMLElement | null;
      if (targetTab) {
        targetTab.setAttribute('data-focused', 'true');
        return true;
      }
      return false;
    };

    if (applyFocus()) {
      return;
    }

    await this.updateTabsUI();
    applyFocus();
  }

  /**
   * 通用的标签添加方法
   */
  private async addTabToPanel(blockId: string, insertMode: 'replace' | 'after' | 'end', navigate: boolean = false): Promise<boolean> {
    // 支持所有面板添加标签
    this.log(`📋 [DEBUG] ========== addTabToPanel 开始 ==========`);
    this.log(`📋 [DEBUG] 参数: blockId=${blockId}, insertMode=${insertMode}, navigate=${navigate}`);
    this.log(`📋 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`);

    try {
      const currentTabs = this.getCurrentPanelTabs();
      this.log(`📋 [DEBUG] 当前标签页数量: ${currentTabs.length}`);
      this.log(`📋 [DEBUG] 当前标签页列表:`);
      currentTabs.forEach((tab, idx) => {
        this.log(`📋 [DEBUG]   [${idx}] ${tab.title} (ID: ${tab.blockId}, 固定: ${tab.isPinned})`);
      });
      this.log(`📋 [DEBUG] closedTabs包含 ${blockId}: ${this.closedTabs.has(blockId)}`);

      // 检查块是否已经存在于标签页中
      const existingTab = currentTabs.find(tab => tab.blockId === blockId);
      if (existingTab) {
        this.log(`📋 [DEBUG] ❌ 块 ${blockId} 已存在于标签页中: "${existingTab.title}"`);

        if (this.closedTabs.has(blockId)) {
          this.log(`📋 [DEBUG] 从closedTabs中移除 ${blockId}`);
          this.closedTabs.delete(blockId);
          await this.saveClosedTabs();
        }

        this.log(`📋 [DEBUG] 切换到已存在标签: "${existingTab.title}"`);
        await this.switchToTab(existingTab);
        await this.focusTabElementById(existingTab.blockId);

        this.log(`📋 [DEBUG] ========== addTabToPanel 完成（已存在）==========`);
        return true;
      }

      this.log(`📋 [DEBUG] ✅ 块 ${blockId} 不存在，准备创建新标签`);

      // 【修复BUG】如果还没有标记，则标记为正在创建
      // 注意：如果是从 Ctrl+点击进来的，可能已经在 handleClickEvent 中标记了
      if (!this.creatingTabs.has(blockId)) {
        this.log(`📋 [DEBUG] 🔒 将块 ${blockId} 添加到 creatingTabs 集合，防止重复处理`);
        this.creatingTabs.add(blockId);
      } else {
        this.log(`📋 [DEBUG] ℹ️ 块 ${blockId} 已在 creatingTabs 中（可能来自 Ctrl+点击）`);
      }
      
      let tabInfo: TabInfo | null = null;
      try {
      // 获取块信息
      const block = orca.state.blocks[parseInt(blockId)];
      if (!block) {
          this.verboseLog(`📋 [addTabToPanel] 错误 - 无法找到块 ${blockId}`);
        this.warn(`无法找到块 ${blockId}`);
        return false;
      }
        this.verboseLog(`📋 [addTabToPanel] 找到块信息`);

      // 使用getTabInfo方法获取完整的标签信息（包括块类型和图标）
        this.verboseLog(`📋 [addTabToPanel] 获取标签信息...`);
        tabInfo = await this.getTabInfo(blockId, this.currentPanelId || '', currentTabs.length);
      if (!tabInfo) {
          this.verboseLog(`📋 [addTabToPanel] 错误 - 无法获取块 ${blockId} 的标签信息`);
        this.warn(`无法获取块 ${blockId} 的标签信息`);
        return false;
        }
        this.verboseLog(`📋 [addTabToPanel] 标签信息: "${tabInfo.title}" (类型: ${tabInfo.blockType})`);
      } finally {
        // 【修复BUG】确保清除标记，无论成功还是失败
        this.log(`📋 [DEBUG] 🔓 从 creatingTabs 集合中移除块 ${blockId}`);
        this.creatingTabs.delete(blockId);
      }


      // 确定插入位置
      let insertIndex = currentTabs.length; // 默认插入到末尾
      let shouldReplace = false;
      this.verboseLog(`📋 [addTabToPanel] 插入模式: ${insertMode}`);

      if (insertMode === 'replace') {
        // 替换模式：获取聚焦标签并替换
        this.verboseLog(`📋 [addTabToPanel] 替换模式 - 获取当前聚焦标签`);
        const focusedTab = this.getCurrentActiveTab();
        if (!focusedTab) {
          this.verboseLog(`📋 [addTabToPanel] 错误 - 没有找到当前聚焦的标签`);
          this.warn("没有找到当前聚焦的标签");
          return false;
        }
        this.verboseLog(`📋 [addTabToPanel] 聚焦标签: "${focusedTab.title}" (${focusedTab.blockId})`);
        
        const focusedIndex = currentTabs.findIndex(tab => tab.blockId === focusedTab.blockId);
        if (focusedIndex === -1) {
          this.verboseLog(`📋 [addTabToPanel] 错误 - 无法找到聚焦标签在数组中的位置`);
          this.warn("无法找到聚焦标签在数组中的位置");
          return false;
        }
        
        // 检查聚焦的标签是否是固定标签
        if (focusedTab.isPinned) {
          // 如果是固定标签，拒绝替换操作，改为在其后面插入
          this.verboseLog(`📋 [addTabToPanel] 聚焦标签是固定的，改为插入模式`);
          this.log(`📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入`);
          insertIndex = focusedIndex + 1;
          shouldReplace = false;
        } else {
          // 如果不是固定标签，可以替换
          this.verboseLog(`📋 [addTabToPanel] 将替换位置 ${focusedIndex} 的标签`);
          insertIndex = focusedIndex;
          shouldReplace = true;
        }
      } else if (insertMode === 'after') {
        // 在聚焦标签后面插入
        this.verboseLog(`📋 [addTabToPanel] After模式 - 在聚焦标签后插入`);
        
        // 获取当前聚焦的标签
        const focusedTab = this.getCurrentActiveTab();
        if (focusedTab) {
          this.verboseLog(`📋 [addTabToPanel] 找到聚焦标签: "${focusedTab.title}" (${focusedTab.blockId})`);
          const focusedIndex = currentTabs.findIndex(tab => tab.blockId === focusedTab.blockId);
          if (focusedIndex !== -1) {
            insertIndex = focusedIndex + 1;
            this.verboseLog(`📋 [addTabToPanel] 将在位置 ${insertIndex} 插入（聚焦标签后面）`);
            this.log(`📌 在聚焦标签后面插入新标签`);
          } else {
            this.verboseLog(`📋 [addTabToPanel] 警告 - 聚焦标签不在列表中，使用默认位置`);
          }
        } else {
          this.verboseLog(`📋 [addTabToPanel] 警告 - 没有找到聚焦标签，使用默认位置`);
        }
      }
      // 'end' 模式使用默认的末尾插入
      this.verboseLog(`📋 [addTabToPanel] 最终插入位置: ${insertIndex}, 替换模式: ${shouldReplace}`);

      // 处理标签数量限制和插入逻辑
      if (currentTabs.length >= this.maxTabs) {
        this.verboseLog(`📋 [addTabToPanel] 已达到标签上限 ${this.maxTabs}`);
        if (shouldReplace) {
          // 直接替换
          this.verboseLog(`📋 [addTabToPanel] 替换位置 ${insertIndex} 的标签`);
          currentTabs[insertIndex] = tabInfo;
        } else {
          // 插入新标签，然后删除最后一个非固定标签
          this.verboseLog(`📋 [addTabToPanel] 插入新标签并删除最后一个非固定标签`);
          currentTabs.splice(insertIndex, 0, tabInfo);
          const lastNonPinnedIndex = this.findLastNonPinnedTabIndex();
          if (lastNonPinnedIndex !== -1) {
            this.verboseLog(`📋 [addTabToPanel] 删除位置 ${lastNonPinnedIndex} 的非固定标签`);
            currentTabs.splice(lastNonPinnedIndex, 1);
          } else {
            // 如果所有标签都是固定的，删除刚插入的新标签
            this.verboseLog(`📋 [addTabToPanel] 所有标签都是固定的，无法插入`);
            const newTabIndex = currentTabs.findIndex(tab => tab.blockId === tabInfo.blockId);
            if (newTabIndex !== -1) {
              currentTabs.splice(newTabIndex, 1);
            }
              return false;
          }
        }
      } else {
        this.verboseLog(`📋 [addTabToPanel] 标签数量未达到上限，直接${shouldReplace ? '替换' : '插入'}`);
        if (shouldReplace) {
          currentTabs[insertIndex] = tabInfo;
        } else {
          currentTabs.splice(insertIndex, 0, tabInfo);
        }
      }

      this.verboseLog(`📋 [addTabToPanel] 插入后标签列表: ${currentTabs.map(t => `${t.title}(${t.blockId})`).join(', ')}`);

      // 同步更新存储数组
      this.log(`📋 [DEBUG] 同步更新存储数组...`);
      this.syncCurrentTabsToStorage(currentTabs);
      
      // 保存标签数据
      this.log(`📋 [DEBUG] 保存标签数据...`);
       await this.saveCurrentPanelTabs();

      // 如果启用了工作区功能且有当前工作区，实时更新工作区
      if (this.enableWorkspaces && this.currentWorkspace) {
        this.log(`📋 [DEBUG] 更新工作区: ${this.currentWorkspace}`);
        await this.saveCurrentTabsToWorkspace();
        this.log(`🔄 标签页添加，实时更新工作区: ${tabInfo.title}`);
      }

      // 更新UI
      this.log(`📋 [DEBUG] 更新UI...`);
      await this.updateTabsUI();

      // 导航（如果需要）
      if (navigate) {
        this.log(`📋 [DEBUG] 开始导航到块 ${blockId}`);
        // 使用统一的安全导航方法
        await this.safeNavigate(blockId, this.currentPanelId || '');
      } else {
        this.log(`📋 [DEBUG] 跳过导航（后台打开模式）`);
      }

      this.log(`📋 [DEBUG] ========== addTabToPanel 完成（成功）==========`);
      return true;
    } catch (error) {
      this.error(`[DEBUG] ❌ addTabToPanel 出错:`, error);
      this.log(`📋 [DEBUG] ========== addTabToPanel 完成（失败）==========`);
      return false;
    }
  }

  /**
   * 统一的导航方法，确保所有导航都设置 isNavigating 标志
   * @param blockId 要导航到的块ID
   * @param panelId 目标面板ID
   */
  private async safeNavigate(blockId: string, panelId: string): Promise<void> {
    this.isNavigating = true;
    this.verboseLog(`🚀 [safeNavigate] 开始导航到块 ${blockId}，设置 isNavigating = true`);
    
    try {
      await orca.nav.goTo("block", { blockId: parseInt(blockId) }, panelId);
      this.verboseLog(`✅ [safeNavigate] 导航成功`);
    } catch (error) {
      this.error(`❌ [safeNavigate] 导航失败:`, error);
      throw error;
    } finally {
      // 导航完成后重新启用聚焦检测
      setTimeout(() => {
        this.isNavigating = false;
        this.verboseLog(`🏁 [safeNavigate] 设置 isNavigating = false`);
      }, 150); // 稍微增加延迟，确保DOM完全稳定
    }
  }

  /**
   * 在新标签页打开指定块（后台打开，不导航不聚焦）
   * 
   * 功能说明：
   * 1. 检查块是否已存在于标签页中
   * 2. 如果存在，不做任何操作（标签页已经存在）
   * 3. 如果不存在，在当前聚焦标签后面创建新标签页（后台打开）
   * 4. 不会导航或聚焦到新标签页
   * 
   * @param blockId 要打开的块ID
   */
  async openInNewTab(blockId: string) {
    this.log(`🔗 [DEBUG] ========== openInNewTab 开始 ==========`);
    this.log(`🔗 [DEBUG] 目标块ID: ${blockId}`);
    this.log(`🔗 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`);
    this.log(`🔗 [DEBUG] creatingTabs 当前包含: ${Array.from(this.creatingTabs).join(', ') || '(空)'}`);
    
    try {
      // 步骤1: 获取当前标签页列表
      const currentTabs = this.getCurrentPanelTabs();
      this.log(`🔗 [DEBUG] 当前标签页数量: ${currentTabs.length}`);
      this.log(`🔗 [DEBUG] 当前标签页列表:`);
      currentTabs.forEach((tab, idx) => {
        this.log(`🔗 [DEBUG]   [${idx}] ${tab.title} (ID: ${tab.blockId}, 固定: ${tab.isPinned})`);
      });
      
      // 步骤2: 检查块是否已存在
      const existingTab = currentTabs.find(tab => tab.blockId === blockId);
      
      if (existingTab) {
        // 分支A: 块已存在，不做任何操作
        this.log(`🔗 [DEBUG] ❌ 块 ${blockId} 已存在，标签: "${existingTab.title}"，无需操作`);
        
        // 从已关闭列表中移除（如果存在）
        if (this.closedTabs.has(blockId)) {
          this.log(`🔗 [DEBUG] 从已关闭列表中移除块 ${blockId}`);
          this.closedTabs.delete(blockId);
          await this.saveClosedTabs();
        }
        
        // 清除创建标记
        if (this.creatingTabs.has(blockId)) {
          this.log(`🔓 [DEBUG] 从 creatingTabs 中移除 ${blockId}（已存在）`);
          this.creatingTabs.delete(blockId);
        }
        
        this.log(`🔗 [DEBUG] ========== openInNewTab 完成（已存在）==========`);
        return;
      }
      
      // 分支B: 块不存在，在后台创建新标签页
      this.log(`🔗 [DEBUG] ✅ 块 ${blockId} 不存在，准备在后台创建新标签页`);
      
      // 从已关闭列表中移除（如果存在）
      if (this.closedTabs.has(blockId)) {
        this.log(`🔗 [DEBUG] 从已关闭列表中移除块 ${blockId}`);
        this.closedTabs.delete(blockId);
        await this.saveClosedTabs();
      }
      
      // 调用 addTabToPanel 创建新标签页（后台打开）
      // 参数说明：
      // - blockId: 要打开的块ID
      // - 'after': 在当前聚焦标签后面插入
      // - false: 不导航到新标签页（后台打开）
      this.log(`🔗 [DEBUG] 调用 addTabToPanel(blockId: ${blockId}, mode: 'after', navigate: false)`);
      const success = await this.addTabToPanel(blockId, 'after', false);
      
      if (success) {
        this.log(`🔗 [DEBUG] ✅ 成功在后台创建新标签页`);
        const updatedTabs = this.getCurrentPanelTabs();
        this.log(`🔗 [DEBUG] 更新后标签页数量: ${updatedTabs.length}`);
      } else {
        this.log(`🔗 [DEBUG] ❌ 创建新标签页失败`);
      }
      
      this.log(`🔗 [DEBUG] ========== openInNewTab 完成 ==========`);
    } catch (error) {
      this.error(`[DEBUG] ❌ openInNewTab 处理失败:`, error);
      // 失败时也要清除标记
      if (this.creatingTabs.has(blockId)) {
        this.log(`🔓 [DEBUG] 异常时从 creatingTabs 中移除 ${blockId}`);
        this.creatingTabs.delete(blockId);
      }
    }
  }

  /**
   * 从DOM元素中获取块引用的ID
   * 
   * 功能说明：
   * 1. 向上遍历DOM树查找块引用元素
   * 2. 支持多种块引用的class和属性
   * 3. 支持从data属性中提取块ID
   * 4. 支持从文本内容中解析块ID（如 [[块123]] 或 block:123）
   * 
   * @param element 起始DOM元素
   * @returns 块引用ID，如果未找到则返回null
   */
  private getBlockRefId(element: HTMLElement): string | null {
    try {
      let current: HTMLElement | null = element;
      
      // 向上遍历DOM树
      while (current && current !== document.body) {
        const classList = current.classList;
        
        // 检查是否是块引用元素（支持多种class名称）
        if (
          classList.contains('orca-inline-r-content') ||
          classList.contains('orca-ref') ||
            classList.contains('block-ref') || 
            classList.contains('block-reference') ||
            classList.contains('orca-fragment-r') ||
            classList.contains('fragment-r') ||
            classList.contains('orca-block-reference') ||
          (current.tagName.toLowerCase() === 'a' && current.getAttribute('href')?.startsWith('#'))
        ) {
          // 尝试从各种可能的属性中获取块ID
          const blockId = 
            current.getAttribute('data-block-id') ||
            current.getAttribute('data-ref-id') ||
            current.getAttribute('data-blockid') ||
                          current.getAttribute('data-target-block-id') ||
                          current.getAttribute('data-fragment-v') ||
                          current.getAttribute('data-v') ||
                          current.getAttribute('href')?.replace('#', '') ||
                          current.getAttribute('data-id');
          
          // 验证块ID是否有效（应该是数字）
          if (blockId && !isNaN(parseInt(blockId))) {
            this.log(`🔗 从元素中提取到块引用ID: ${blockId}`);
            return blockId;
          }
        }
        
        // 检查data属性中是否包含块ID
        const dataset = current.dataset;
        for (const [key, value] of Object.entries(dataset)) {
          if ((key.toLowerCase().includes('block') || key.toLowerCase().includes('ref')) && 
              value && !isNaN(parseInt(value))) {
            this.log(`🔗 从data属性 ${key} 中提取到块引用ID: ${value}`);
            return value;
          }
        }
        
        current = current.parentElement;
      }
      
      // 尝试从文本内容中解析块ID（作为后备方案）
      if (element.textContent) {
        const text = element.textContent.trim();
        const match = text.match(/\[\[(?:块)?(\d+)\]\]/) || text.match(/block[:\s]*(\d+)/i);
        if (match && match[1]) {
          this.log(`🔗 从文本内容中解析到块引用ID: ${match[1]}`);
          return match[1];
        }
      }
      
      this.log("🔗 未能从元素中提取块引用ID");
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
   * 创建上下文菜单项
   */
  private createContextMenuItem(title: string, icon: string, shortcut: string, onClick: () => void): HTMLElement {
    return createContextMenuItem(title, icon, shortcut, onClick);
  }

  /**
   * 记录当前标签的滚动位置
   */
  private async recordScrollPosition(tab: TabInfo) {
    try {
      // 使用Orca的viewState API来保存滚动位置
      const panelId = this.getPanelIds()[this.currentPanelIndex];
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
          const tabIndex = this.getCurrentPanelTabs().findIndex(t => t.blockId === tab.blockId);
          if (tabIndex !== -1) {
            this.getCurrentPanelTabs()[tabIndex].scrollPosition = scrollPosition;
            await this.saveCurrentPanelTabs();
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
   * 替换当前标签页内容
   */
  private async replaceCurrentTabWith(currentBlockId: string, newTab: TabInfo) {
    try {
      this.log(`🔄 开始替换标签页: ${currentBlockId} -> ${newTab.blockId}`);
      
      // 获取当前面板的标签列表
      const currentTabs = this.getCurrentPanelTabs();
      
      // 找到要替换的标签索引
      const replaceIndex = currentTabs.findIndex(tab => tab.blockId === currentBlockId);
      if (replaceIndex === -1) {
        this.log(`⚠️ 未找到要替换的标签: ${currentBlockId}`);
        return;
      }
      
      // 检查当前标签是否是激活的标签
      const currentActiveTab = this.getCurrentActiveTab();
      const isReplacingActiveTab = currentActiveTab && currentActiveTab.blockId === currentBlockId;
      
      // 替换标签内容
      const oldTab = currentTabs[replaceIndex];
      currentTabs[replaceIndex] = newTab;
      
      this.log(`🔄 替换标签页: "${oldTab.title}" -> "${newTab.title}"`);
      
      // 更新存储
      await this.setCurrentPanelTabs(currentTabs);
      
      // 更新UI
      await this.immediateUpdateTabsUI();
      
      // 如果替换的是激活标签，需要重新聚焦
      if (isReplacingActiveTab) {
        this.log(`🎯 重新聚焦到替换后的标签: ${newTab.title}`);
        await this.switchToTab(newTab);
      }
      
      // 记录切换历史
      this.recordTabSwitchHistory(currentBlockId, newTab);
      
      this.log(`✅ 标签页替换完成`);
    } catch (error) {
      this.warn('替换标签页失败:', error);
    }
  }

  /**
   * 记录标签切换历史
   */
  private async recordTabSwitchHistory(fromTabBlockId: string, toTab: TabInfo) {
    try {
      await this.tabStorageService.updateTabSwitchHistory(fromTabBlockId, toTab);
      this.verboseLog(`📝 记录标签切换历史: ${fromTabBlockId} -> ${toTab.blockId}`);
    } catch (error) {
      this.warn('记录标签切换历史失败:', error);
    }
  }

  /**
   * 删除标签的切换历史记录
   */
  private async deleteTabSwitchHistory(tabId: string) {
    try {
      await this.tabStorageService.deleteTabSwitchHistory(tabId);
      this.log(`🗑️ 删除标签 ${tabId} 的切换历史记录`);
    } catch (error) {
      this.warn('删除标签切换历史失败:', error);
    }
  }

  /**
   * 安全的closest方法，避免类型错误
   */
  private safeClosest(element: EventTarget | null, selector: string): HTMLElement | null {
    if (!element || typeof element !== 'object' || !('closest' in element)) {
      return null;
    }
    try {
      return (element as HTMLElement).closest(selector);
    } catch (error) {
      return null;
    }
  }

  /**
   * 添加左键长按事件显示最近切换标签
   */
  private addLongPressTabListEvents(tabElement: HTMLElement, tab: TabInfo) {
    let longPressTimeout: number | null = null;
    let hoverTabListContainer: HTMLElement | null = null;
    let scrollOffset = 0;
    let isLongPressing = false;
    
    // 悬浮配置
    const hoverConfig: HoverTabListConfig = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: true,
      maxWidth: 150
    };

    // 鼠标按下事件
    tabElement.addEventListener('mousedown', (e) => {
      // 只处理左键
      if (e.button !== 0) return;
      
      // 检查是否在拖拽手柄上，如果是则不处理长按
      const target = e.target as HTMLElement;
      if (target.classList.contains('drag-handle') || (target.closest && target.closest('.drag-handle'))) {
        return;
      }
      
      isLongPressing = true;
      this.log(`🖱️ 开始长按标签: ${tab.title}`);
      
      // 设置长按延迟（500ms）
      longPressTimeout = window.setTimeout(async () => {
        if (!isLongPressing) return;
        
        // 设置标记，防止触发点击事件
        tabElement.setAttribute('data-long-pressed', 'true');
        
        let recentTabs: TabInfo[] = [];
        
        try {
          this.log(`⏰ 长按触发，开始检查切换历史`);
          
          // 获取全局切换历史记录
          const allHistory = await this.tabStorageService.restoreRecentTabSwitchHistory();
          const globalHistory = allHistory['global_tab_history'];
          
          this.log(`📋 全局切换历史记录: ${globalHistory ? globalHistory.recentTabs.length : 0} 个记录`);
          
          if (!globalHistory || globalHistory.recentTabs.length === 0) {
            this.log(`⚠️ 没有全局切换历史记录，不显示悬浮列表`);
            return;
          }
          
          // 使用全局历史记录
          const deduplicatedTabs = globalHistory.recentTabs;
          
          this.log(`📋 去重后的历史记录: ${deduplicatedTabs.length} 个记录`);
          
          if (deduplicatedTabs.length === 0) {
            this.log(`⚠️ 去重后没有历史记录，不显示悬浮列表`);
            return;
          }

          // 计算悬浮位置
          const rect = tabElement.getBoundingClientRect();
          const position = {
            x: rect.left,
            y: rect.bottom + 4 // 在标签下方显示
          };

          this.log(`📍 计算悬浮位置: x=${position.x}, y=${position.y}`);
          this.log(`📊 标签尺寸: width=${rect.width}, height=${rect.height}`);

          // 显示悬浮标签列表
          this.log(`🎨 开始创建悬浮标签列表`);
          hoverTabListContainer = showHoverTabList(
            deduplicatedTabs,
            position,
            hoverConfig,
            (clickedTab) => {
              this.log(`🖱️ 点击悬浮标签: ${clickedTab.title}`);
              
              // 检查点击的标签是否已经存在于当前标签栏中
              const currentTabs = this.getCurrentPanelTabs();
              const existingTab = currentTabs.find(tabItem => tabItem.blockId === clickedTab.blockId);
              
              if (existingTab) {
                // 如果标签已存在，直接跳转到该标签
                this.log(`🔄 标签已存在，跳转到: ${clickedTab.title}`);
                // 更新全局历史记录，将点击的标签移到最新位置
                this.recordTabSwitchHistory(tab.blockId, clickedTab);
                this.switchToTab(clickedTab);
              } else {
                // 如果标签不存在，替换当前标签页
                this.log(`🔄 标签不存在，替换当前标签: ${tab.title} -> ${clickedTab.title}`);
                this.replaceCurrentTabWith(tab.blockId, clickedTab);
              }
              hideHoverTabList();
            },
            this.isVerticalMode
          );
          
          this.log(`✅ 悬浮标签列表创建完成`);

          // 添加滚动事件监听
          if (hoverConfig.enableScroll && deduplicatedTabs.length > hoverConfig.maxDisplayCount) {
            this.addScrollEvents(hoverTabListContainer, deduplicatedTabs, hoverConfig, scrollOffset);
          }
          
          // 添加全局点击监听，点击空白区域隐藏悬浮列表
          const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // 如果点击的不是悬浮列表容器内的元素，则隐藏悬浮列表
            if (!this.safeClosest(target, '.hover-tab-list-container')) {
              hideHoverTabList();
              hoverTabListContainer = null;
              scrollOffset = 0;
              document.removeEventListener('click', handleGlobalClick);
            }
          };
          
          // 延迟添加点击监听，避免立即触发
          setTimeout(() => {
            document.addEventListener('click', handleGlobalClick);
          }, 100);

          this.verboseLog(`显示标签 ${tab.title} 的悬浮列表: ${deduplicatedTabs.length} 个历史标签`);
        } catch (error) {
          this.warn('显示悬浮标签列表失败:', error);
        }
      }, 500); // 500ms长按延迟
    });

    // 鼠标释放事件
    tabElement.addEventListener('mouseup', () => {
      if (longPressTimeout) {
        clearTimeout(longPressTimeout);
        longPressTimeout = null;
      }
      isLongPressing = false;
    });

    // 鼠标离开事件
    tabElement.addEventListener('mouseleave', () => {
      if (longPressTimeout) {
        clearTimeout(longPressTimeout);
        longPressTimeout = null;
      }
      isLongPressing = false;
    });

    // 悬浮列表的鼠标事件
    const handleHoverListMouseEnter = () => {
      // 保持悬浮列表显示
    };

    const handleHoverListMouseLeave = () => {
      // 延迟隐藏悬浮列表
      setTimeout(() => {
        hideHoverTabList();
        hoverTabListContainer = null;
        scrollOffset = 0;
      }, 200);
    };

    // 监听悬浮列表的鼠标事件
    document.addEventListener('mouseenter', (e) => {
      if (this.safeClosest(e.target, '.hover-tab-list-container')) {
        handleHoverListMouseEnter();
      }
    });

    document.addEventListener('mouseleave', (e) => {
      if (this.safeClosest(e.target, '.hover-tab-list-container')) {
        handleHoverListMouseLeave();
      }
    });
  }

  /**
   * 添加悬浮标签列表事件
   */
  private addHoverTabListEvents(tabElement: HTMLElement, tab: TabInfo) {
    let hoverTimeout: number | null = null;
    let hoverTabListContainer: HTMLElement | null = null;
    let scrollOffset = 0;
    
    // 悬浮配置
    const hoverConfig: HoverTabListConfig = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: true,
      maxWidth: 150
    };

    // 鼠标进入事件
    tabElement.addEventListener('mouseenter', async () => {
      const tabHistoryId = tabElement.getAttribute('data-tab-history-id');
      this.log(`🖱️ 鼠标进入标签: ${tab.title} (标签历史ID: ${tabHistoryId})`);
      
      // 清除隐藏定时器
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      // 延迟显示，避免快速移动时频繁显示
      hoverTimeout = window.setTimeout(async () => {
        try {
          this.log(`⏰ 开始检查标签 ${tab.title} 的切换历史`);
          
          // 获取所有切换历史记录
          const allHistory = await this.tabStorageService.restoreRecentTabSwitchHistory();
          const allRecentTabs: TabInfo[] = [];
          
          // 收集所有历史记录中的标签
          Object.values(allHistory).forEach(history => {
            if (history.recentTabs) {
              allRecentTabs.push(...history.recentTabs);
            }
          });
          
          this.log(`📋 所有切换历史记录: ${allRecentTabs.length} 个记录`);
          
          if (allRecentTabs.length === 0) {
            this.log(`⚠️ 没有切换历史记录，不显示悬浮列表`);
            return;
          }
          
          // 去重：基于blockId去重，保留最新的记录
          const uniqueTabs = new Map<string, TabInfo>();
          allRecentTabs.forEach(tab => {
            uniqueTabs.set(tab.blockId, tab);
          });
          
          // 转换为数组并按正序排列（最新的在后面）
          const deduplicatedTabs = Array.from(uniqueTabs.values());
          
          this.log(`📋 去重后的历史记录: ${deduplicatedTabs.length} 个记录`);
          
          if (deduplicatedTabs.length === 0) {
            this.log(`⚠️ 去重后没有历史记录，不显示悬浮列表`);
            return;
          }

          // 计算悬浮位置
          const rect = tabElement.getBoundingClientRect();
          const position = {
            x: rect.left,
            y: rect.bottom + 4 // 在标签下方显示
          };

          this.log(`📍 计算悬浮位置: x=${position.x}, y=${position.y}`);
          this.log(`📊 标签尺寸: width=${rect.width}, height=${rect.height}`);

          // 显示悬浮标签列表
          this.log(`🎨 开始创建悬浮标签列表`);
          hoverTabListContainer = showHoverTabList(
            deduplicatedTabs,
            position,
            hoverConfig,
            (clickedTab) => {
              this.log(`🖱️ 点击悬浮标签: ${clickedTab.title}`);
              
              // 检查点击的标签是否已经存在于当前标签栏中
              const currentTabs = this.getCurrentPanelTabs();
              const existingTab = currentTabs.find(tabItem => tabItem.blockId === clickedTab.blockId);
              
              if (existingTab) {
                // 如果标签已存在，直接跳转到该标签
                this.log(`🔄 标签已存在，跳转到: ${clickedTab.title}`);
                // 更新全局历史记录，将点击的标签移到最新位置
                this.recordTabSwitchHistory(tab.blockId, clickedTab);
                this.switchToTab(clickedTab);
              } else {
                // 如果标签不存在，替换当前标签页
                this.log(`🔄 标签不存在，替换当前标签: ${tab.title} -> ${clickedTab.title}`);
                this.replaceCurrentTabWith(tab.blockId, clickedTab);
              }
              hideHoverTabList();
            },
            this.isVerticalMode
          );
          
          this.log(`✅ 悬浮标签列表创建完成`);

          // 添加滚动事件监听
          if (hoverConfig.enableScroll && deduplicatedTabs.length > hoverConfig.maxDisplayCount) {
            this.addScrollEvents(hoverTabListContainer, deduplicatedTabs, hoverConfig, scrollOffset);
          }
          
          // 添加全局点击监听，点击空白区域隐藏悬浮列表
          const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // 如果点击的不是悬浮列表容器内的元素，则隐藏悬浮列表
            if (!this.safeClosest(target, '.hover-tab-list-container')) {
              hideHoverTabList();
              hoverTabListContainer = null;
              scrollOffset = 0;
              document.removeEventListener('click', handleGlobalClick);
            }
          };
          
          // 延迟添加点击监听，避免立即触发
          setTimeout(() => {
            document.addEventListener('click', handleGlobalClick);
          }, 100);

          this.verboseLog(`显示标签 ${tab.title} 的悬浮列表: ${deduplicatedTabs.length} 个历史标签`);
        } catch (error) {
          this.warn('显示悬浮标签列表失败:', error);
        }
      }, 300); // 300ms延迟
    });

    // 鼠标离开事件
    tabElement.addEventListener('mouseleave', () => {
      // 清除显示定时器
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      // 延迟隐藏，给用户时间移动到悬浮列表
      hoverTimeout = window.setTimeout(() => {
        hideHoverTabList();
        hoverTabListContainer = null;
        scrollOffset = 0;
      }, 200);
    });

    // 悬浮列表的鼠标事件
    const handleHoverListMouseEnter = () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
    };

    const handleHoverListMouseLeave = () => {
      hoverTimeout = window.setTimeout(() => {
        hideHoverTabList();
        hoverTabListContainer = null;
        scrollOffset = 0;
      }, 200);
    };

    // 监听悬浮列表的鼠标事件
    document.addEventListener('mouseenter', (e) => {
      if (this.safeClosest(e.target, '.hover-tab-list-container')) {
        handleHoverListMouseEnter();
      }
    });

    document.addEventListener('mouseleave', (e) => {
      if (this.safeClosest(e.target, '.hover-tab-list-container')) {
        handleHoverListMouseLeave();
      }
    });
  }

  /**
   * 添加滚动事件
   */
  private addScrollEvents(
    container: HTMLElement,
    tabs: TabInfo[],
    config: HoverTabListConfig,
    scrollOffset: number
  ) {
    const scrollContainer = container.querySelector('.hover-tab-list-scroll') as HTMLElement;
    if (!scrollContainer) return;

    let isScrolling = false;

    // 鼠标滚轮事件
    scrollContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      
      if (isScrolling) return;
      isScrolling = true;

      const delta = e.deltaY > 0 ? config.scrollStep : -config.scrollStep;
      const newOffset = Math.max(0, Math.min(scrollOffset + delta, tabs.length - config.maxDisplayCount));
      
      if (newOffset !== scrollOffset) {
        scrollOffset = newOffset;
        updateHoverTabList(container, tabs, config, (clickedTab) => {
          this.log(`🖱️ 点击悬浮标签切换到: ${clickedTab.title}`);
          this.switchToTab(clickedTab);
          hideHoverTabList();
        }, this.isVerticalMode, scrollOffset);
      }

      setTimeout(() => {
        isScrolling = false;
      }, 100);
    });

    // 键盘事件
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        
        const delta = e.key === 'ArrowDown' ? config.scrollStep : -config.scrollStep;
        const newOffset = Math.max(0, Math.min(scrollOffset + delta, tabs.length - config.maxDisplayCount));
        
        if (newOffset !== scrollOffset) {
          scrollOffset = newOffset;
          updateHoverTabList(container, tabs, config, (clickedTab) => {
            this.log(`🖱️ 点击悬浮标签切换到: ${clickedTab.title}`);
            this.switchToTab(clickedTab);
            hideHoverTabList();
          }, this.isVerticalMode, scrollOffset);
        }
      }
    });
  }

  /**
   * 恢复标签的滚动位置
   */
  private restoreScrollPosition(tab: TabInfo) {
    try {
      // 优先从Orca的viewState中获取滚动位置
      let scrollPosition = null;
      
      // 方法1: 从viewState获取
      const panelId = this.getPanelIds()[this.currentPanelIndex];
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
    const panelId = this.getPanelIds()[this.currentPanelIndex];
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
      // 【修复BUG2】检查标签所属的面板，而不是全局活动面板
      // 这样可以确保每个面板独立维护自己的聚焦状态
      let targetPanel: Element | null = null;
      
      // 首先尝试使用当前面板ID
      if (this.currentPanelId) {
        targetPanel = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
      }
      
      // 如果标签有明确的面板ID，使用标签的面板ID
      if (tab.panelId) {
        const tabPanel = document.querySelector(`.orca-panel[data-panel-id="${tab.panelId}"]`);
        if (tabPanel) {
          targetPanel = tabPanel;
        }
      }
      
      // 如果都找不到，才回退到全局活动面板
      if (!targetPanel) {
        targetPanel = document.querySelector('.orca-panel.active');
      }
      
      if (!targetPanel) return false;

      // 获取目标面板中可见的块编辑器（没有 orca-hideable-hidden 类）
      const activeBlock = targetPanel.querySelector('.orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]');
      if (!activeBlock) return false;

      const activeBlockId = activeBlock.getAttribute('data-block-id');
      const isActive = activeBlockId === tab.blockId;
      
      // 如果标签在已关闭列表中，不应该被认为是激活的
      if (isActive && this.closedTabs.has(tab.blockId)) {
        this.verboseLog(`🔍 标签 ${tab.title} 在已关闭列表中，不认为是激活状态`);
        return false;
      }
      
      return isActive;
    } catch (error) {
      this.warn('检查标签激活状态时出错:', error);
      return false;
    }
  }

  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab(): TabInfo | null {
    // 工作区功能启用时，总是使用第一个面板的数据
    const currentTabs = this.enableWorkspaces ? this.getCurrentPanelTabs() : this.getCurrentPanelTabs();
    
    if (currentTabs.length === 0) return null;
    
    // 【修复BUG1】优先检查UI中明确标记为聚焦的标签（用户点击选择的）
    // 这是最可靠的方式，因为它反映了用户的明确意图
    const focusedTabElement = this.tabContainer?.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (focusedTabElement) {
      const focusedBlockId = focusedTabElement.getAttribute('data-tab-id');
      if (focusedBlockId) {
        const focusedTab = currentTabs.find(tab => tab.blockId === focusedBlockId);
        if (focusedTab) {
          this.verboseLog(`🎯 找到UI聚焦标签: ${focusedTab.title} (ID: ${focusedBlockId})`);
          
          // 如果启用了工作区功能且有当前工作区，实时更新最后激活标签页
          if (this.enableWorkspaces && this.currentWorkspace) {
            this.updateCurrentWorkspaceActiveIndex(focusedTab);
          }
          
          return focusedTab;
        }
      }
    }
    
    // 【修复BUG2】确保只检查当前面板，避免多面板切换时的混淆
    // 获取当前面板ID对应的面板元素
    let targetPanel: Element | null = null;
    if (this.currentPanelId) {
      targetPanel = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    }
    
    // 如果找不到指定面板，回退到当前激活的面板
    if (!targetPanel) {
      targetPanel = document.querySelector('.orca-panel.active');
    }
    
    if (!targetPanel) {
      this.verboseLog('⚠️ 无法找到目标面板');
      return null;
    }
    
    // 获取目标面板中可见的块编辑器（没有 orca-hideable-hidden 类）
    const activeBlockEditor = targetPanel.querySelector('.orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]');
    
    if (!activeBlockEditor) {
      this.verboseLog('⚠️ 目标面板中没有找到可见的块编辑器');
      return null;
    }
    
    const blockId = activeBlockEditor.getAttribute('data-block-id');
    if (!blockId) {
      this.verboseLog('⚠️ 块编辑器没有 data-block-id 属性');
      return null;
    }
    
    // 在当前面板标签中查找对应的标签
    const activeTab = currentTabs.find(tab => tab.blockId === blockId) || null;
    
    if (activeTab) {
      this.verboseLog(`🎯 根据DOM块编辑器找到激活标签: ${activeTab.title} (ID: ${blockId})`);
    } else {
      this.verboseLog(`⚠️ 在标签列表中找不到块ID ${blockId} 对应的标签`);
    }
    
    // 如果启用了工作区功能且有当前工作区，实时更新最后激活标签页
    if (this.enableWorkspaces && this.currentWorkspace && activeTab) {
      this.updateCurrentWorkspaceActiveIndex(activeTab);
    }
    
    return activeTab;
  }

  /**
   * 获取智能插入位置（在当前激活标签后面）
   */
  getSmartInsertPosition(): number {
    const currentTabs = this.getCurrentPanelTabs();
    
    if (currentTabs.length === 0) return -1;
    
    // 获取当前激活的标签
    const currentActiveTab = this.getCurrentActiveTab();
    if (!currentActiveTab) {
      // 如果没有找到当前激活的标签，返回-1表示添加到末尾
      return -1;
    }
    
    // 找到当前激活标签的索引
    const currentIndex = currentTabs.findIndex(tab => tab.blockId === currentActiveTab.blockId);
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
    const currentTabs = this.getCurrentPanelTabs();
    
    if (currentTabs.length === 0) return null;
    
    // 如果有记录的上一个激活标签ID，查找对应的标签
    if (this.lastActiveBlockId) {
      const lastActiveTab = currentTabs.find(tab => tab.blockId === this.lastActiveBlockId);
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
    const currentTabs = this.getCurrentPanelTabs();
    
    if (currentTabs.length === 0) return -1;
    
    if (!previousActiveTab) {
      this.log(`🎯 没有找到之前激活的标签，添加到末尾`);
      return -1;
    }
    
    // 找到之前激活标签的索引
    const previousIndex = currentTabs.findIndex(tab => tab.blockId === previousActiveTab.blockId);
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
    const currentTabs = this.getCurrentPanelTabs();
    
    const currentIndex = currentTabs.findIndex(tab => tab.blockId === currentTab.blockId);
    if (currentIndex === -1) return null;
    
    // 如果只有一个标签，返回null（无法切换）
    if (currentTabs.length <= 1) return null;
    
    // 如果当前标签在中间位置，优先选择右边的标签
    if (currentIndex < currentTabs.length - 1) {
      return currentTabs[currentIndex + 1];
    }
    
    // 如果当前标签在最右边，选择左边的标签
    if (currentIndex > 0) {
      return currentTabs[currentIndex - 1];
    }
    
    // 如果当前标签在最左边且只有一个其他标签，选择右边的标签
    if (currentIndex === 0 && currentTabs.length > 1) {
      return currentTabs[1];
    }
    
    return null;
  }

  /**
   * 关闭标签页
   */
  async closeTab(tab: TabInfo) {
    const currentTabs = this.getCurrentPanelTabs();
    
    // 检查是否只有一个标签
    if (currentTabs.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    
    // 检查是否是固定标签
    if (tab.isPinned) {
      this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
      // 这里可以添加确认对话框，暂时直接关闭
    }
    
    const tabIndex = currentTabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex !== -1) {
      // 检查当前关闭的标签是否是激活的标签
      const currentActiveTab = this.getCurrentActiveTab();
      const isClosingActiveTab = currentActiveTab && currentActiveTab.blockId === tab.blockId;
      
      // 获取相邻标签（在移除当前标签之前）
      const adjacentTab = isClosingActiveTab ? this.getAdjacentTab(tab) : null;
      
      // 将标签添加到已关闭列表
      this.closedTabs.add(tab.blockId);
      
      // 如果启用了最近关闭标签页功能，添加到最近关闭列表
      if (this.enableRecentlyClosedTabs) {
        // 添加时间戳
        const tabWithTimestamp = { ...tab, closedAt: Date.now() };
        
        // 检查是否已经存在相同的blockId，如果存在则先移除
        const existingIndex = this.recentlyClosedTabs.findIndex(t => t.blockId === tab.blockId);
        if (existingIndex !== -1) {
          this.recentlyClosedTabs.splice(existingIndex, 1);
        }
        
        // 添加到列表开头（最新的在前面）
        this.recentlyClosedTabs.unshift(tabWithTimestamp);
        
        // 限制最近关闭列表的最大长度（最多保存10个）
        if (this.recentlyClosedTabs.length > 10) {
          this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 10);
        }
        await this.saveRecentlyClosedTabs();
      }
      
      // 删除该标签的切换历史记录
      const tabElement = this.tabContainer?.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
      const tabHistoryId = tabElement?.getAttribute('data-tab-history-id');
      if (tabHistoryId) {
        await this.deleteTabSwitchHistory(tabHistoryId);
      }
      
      // 移除标签
      currentTabs.splice(tabIndex, 1);
      
      // 同步更新对应的存储数组
      this.syncCurrentTabsToStorage(currentTabs);
      
      // 更新UI和保存数据（修复同步问题）
      await this.immediateUpdateTabsUI();
       await this.saveCurrentPanelTabs();
      await this.saveClosedTabs();
      
      // 如果启用了工作区功能且有当前工作区，实时更新工作区
      if (this.enableWorkspaces && this.currentWorkspace) {
        await this.saveCurrentTabsToWorkspace();
        this.log(`🔄 标签页删除，实时更新工作区: ${tab.title}`);
      }
      
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
    const currentTabs = this.getCurrentPanelTabs();
    
    // 将非固定标签添加到已关闭列表
    const nonPinnedTabs = currentTabs.filter(tab => !tab.isPinned);
    nonPinnedTabs.forEach(tab => {
      this.closedTabs.add(tab.blockId);
    });
    
    // 只保留固定标签
    const pinnedTabs = currentTabs.filter(tab => tab.isPinned);
    const closedCount = currentTabs.length - pinnedTabs.length;
    
    this.setCurrentPanelTabs(pinnedTabs);
    
    // 同步更新对应的存储数组
    this.syncCurrentTabsToStorage(pinnedTabs);
    
    // 更新UI和保存数据（修复同步问题）
    await this.immediateUpdateTabsUI();
       await this.saveCurrentPanelTabs();
    await this.saveClosedTabs();
    
    // 如果启用了工作区功能且有当前工作区，实时更新工作区
    if (this.enableWorkspaces && this.currentWorkspace) {
      await this.saveCurrentTabsToWorkspace();
      this.log(`🔄 批量关闭标签页，实时更新工作区`);
    }
    
    this.log(`🗑️ 已关闭 ${closedCount} 个标签，保留了 ${pinnedTabs.length} 个固定标签`);
  }

  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(currentTab: TabInfo) {
    const currentTabs = this.getCurrentPanelTabs();
    
    // 保留当前标签和所有固定标签
    const keepTabs = currentTabs.filter(tab => 
      tab.blockId === currentTab.blockId || tab.isPinned
    );
    
    // 将其他标签添加到已关闭列表
    const otherTabs = currentTabs.filter(tab => 
      tab.blockId !== currentTab.blockId && !tab.isPinned
    );
    otherTabs.forEach(tab => {
      this.closedTabs.add(tab.blockId);
    });
    
    const closedCount = currentTabs.length - keepTabs.length;
    this.setCurrentPanelTabs(keepTabs);
    
    // 同步更新对应的存储数组
    this.syncCurrentTabsToStorage(keepTabs);
    
    // 更新UI和保存数据（修复同步问题）
    await this.immediateUpdateTabsUI();
       await this.saveCurrentPanelTabs();
    await this.saveClosedTabs();
    
    // 如果启用了工作区功能且有当前工作区，实时更新工作区
    if (this.enableWorkspaces && this.currentWorkspace) {
      await this.saveCurrentTabsToWorkspace();
      this.log(`🔄 关闭其他标签页，实时更新工作区`);
    }
    
    this.log(`🗑️ 已关闭其他 ${closedCount} 个标签，保留了当前标签和固定标签`);
  }

  /**
   * 重命名标签（内联编辑）
   */
  renameTab(tab: TabInfo) {
    // 支持所有面板重命名标签
    
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

    // 保存原始内容和拖拽状态
    const originalContent = tabElement.textContent;
    const originalStyle = tabElement.style.cssText;
    const originalDraggable = tabElement.draggable;
    
    // 禁用拖拽功能，防止重命名时触发拖拽移动
    tabElement.draggable = false;

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = tab.title;
    input.className = 'inline-rename-input';
    
    // 设置输入框样式，保持透明背景
    let textColor = 'var(--orca-color-text-1)';
    let customColorProps = '';
    
    // 如果有颜色，使用CSS变量处理
    if (tab.color) {
      const colorHex = tab.color.startsWith('#') ? tab.color : `#${tab.color}`;
      customColorProps = `--tab-color: ${colorHex};`;
      textColor = 'var(--orca-tab-colored-text)';
    }

    input.style.cssText = `
      ${customColorProps}
      background: transparent;
      color: ${textColor};
      border: none;
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      font-weight: 600;
      outline: none;
      width: 100%;
      max-width: 100px;
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
        // 恢复拖拽功能
        tabElement.draggable = originalDraggable;
        // 重命名后，让UI更新来显示新标题
        return; // 不恢复原始内容，让UI更新显示新标题
      }
      // 如果没有更改，恢复标签显示和拖拽功能
      tabElement.textContent = originalContent;
      tabElement.style.cssText = originalStyle;
      tabElement.draggable = originalDraggable;
    };

    // 取消重命名
    const cancelRename = () => {
      // 恢复标签显示和拖拽功能
      tabElement.textContent = originalContent;
      tabElement.style.cssText = originalStyle;
      tabElement.draggable = originalDraggable;
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
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-primary-5);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: .175rem var(--orca-spacing-md);
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
      color: var(--orca-color-text-1);
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
    confirmBtn.className = 'orca-button orca-button-primary';
    confirmBtn.textContent = '确认';

    // 创建取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'orca-button';
    cancelBtn.textContent = '取消';

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
      const currentTabs = this.getCurrentPanelTabs();
      const result = updateTabTitle(tab, newTitle, currentTabs, {
        updateUI: true,
        saveData: true,
        validateData: true
      });
      
      if (result.success) {
        // 保存数据
        // 同步更新存储数组
        this.syncCurrentTabsToStorage(currentTabs);
        
       await this.saveCurrentPanelTabs();
        
        // 立即更新UI（重命名需要立即反馈）
        await this.updateTabsUI();
        
        // 如果启用了工作区功能且有当前工作区，实时更新工作区
        if (this.enableWorkspaces && this.currentWorkspace) {
          await this.saveCurrentTabsToWorkspace();
          this.log(`🔄 标签页重命名，实时更新工作区: ${newTitle}`);
        }
        
        this.log(result.message);
        
        // 可选：同时更新块的别名（如果需要同步到Orca）
        // await this.updateBlockAlias(tab.blockId, newTitle);
      } else {
        this.warn(result.message);
      }
    } catch (e) {
      this.error("重命名标签失败:", e);
    }
  }

  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(tabElement: HTMLElement, tab: TabInfo) {
    // 直接使用原生实现，确保图标能正确显示
    tabElement.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.showTabContextMenu(e, tab);
    });
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
            shortcut: 'F2',
            onClick: () => {
              close();
              this.renameTab(tab);
            },
            children: React.createElement('div', {
              style: { display: 'flex', alignItems: 'center', gap: '8px' }
            }, [
              React.createElement('i', { 
                key: 'icon',
                className: 'ti ti-edit',
                style: { fontSize: '14px', color: 'var(--orca-color-text-1)' }
              }),
              React.createElement('span', { key: 'text' }, '重命名标签')
            ])
          }),
          React.createElement(MenuText, {
            key: 'pin',
            title: tab.isPinned ? '取消固定' : '固定标签',
            preIcon: tab.isPinned ? 'ti ti-pin-off' : 'ti ti-pin',
            onClick: () => {
              close();
              this.toggleTabPinStatus(tab);
            }
          }),
          // 如果有保存的标签组，添加"添加到已有标签组"选项
          ...(this.savedTabSets.length > 0 ? [
            React.createElement(MenuText, {
              key: 'addToGroup',
              title: '添加到已有标签组',
              preIcon: 'ti ti-bookmark-plus',
              onClick: () => {
                close();
                this.showAddToTabGroupDialog(tab);
              }
            })
          ] : []),
          React.createElement(MenuSeparator, { key: 'separator1' }),
          React.createElement(MenuText, {
            key: 'close',
            title: '关闭标签',
            preIcon: 'ti ti-x',
            shortcut: 'Ctrl+W',
            disabled: this.getCurrentPanelTabs().length <= 1,
            onClick: () => {
              close();
              this.closeTab(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'closeOthers',
            title: '关闭其他标签',
            preIcon: 'ti ti-x',
            disabled: this.getCurrentPanelTabs().length <= 1,
            onClick: () => {
              close();
              this.closeOtherTabs(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'closeAll',
            title: '关闭全部标签',
            preIcon: 'ti ti-x',
            disabled: this.getCurrentPanelTabs().length <= 1,
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

    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (window as any).orca?.state?.themeMode === 'dark';

    // 创建右键菜单
    const menu = document.createElement('div');
    menu.className = 'tab-context-menu';
    // 使用智能菜单定位算法
    const menuWidth = 220;
    const menuHeight = 240; // 预估菜单高度
    const { x: menuLeft, y: menuTop } = calculateContextMenuPosition(e.clientX, e.clientY, menuWidth, menuHeight);
    
    menu.style.cssText = `
      position: fixed;
      left: ${menuLeft}px;
      top: ${menuTop}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: 180px;
      padding: var(--orca-spacing-sm);
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

    // 如果有保存的标签组，添加"添加到已有标签组"选项
    if (this.savedTabSets.length > 0) {
      menuItems.push({
        text: '添加到已有标签组',
        action: () => this.showAddToTabGroupDialog(tab)
      });
    }


    // 添加关闭相关选项
    menuItems.push(
      {
        text: '关闭标签',
        action: () => this.closeTab(tab),
        disabled: this.getCurrentPanelTabs().length <= 1
      } as any,
      {
        text: '关闭其他标签',
        action: () => this.closeOtherTabs(tab),
        disabled: this.getCurrentPanelTabs().length <= 1
      } as any,
      {
        text: '关闭全部标签',
        action: () => this.closeAllTabs(),
        disabled: this.getCurrentPanelTabs().length <= 1
      } as any
    );

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'tab-context-menu-item';
      
      // 根据文本内容设置data-action属性
      let actionType = '';
      if (item.text.includes('关闭')) actionType = 'close';
      else if (item.text.includes('重命名')) actionType = 'rename';
      else if (item.text.includes('固定')) actionType = 'pin';
      else if (item.text.includes('复制')) actionType = 'duplicate';
      else if (item.text.includes('保存到标签组')) actionType = 'save-to-group';
      
      menuItem.setAttribute('data-action', actionType);
      menuItem.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: ${(item as any).disabled ? (isDarkMode ? '#666' : '#999') : 'var(--orca-color-text-1)'};
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s;
      `;
      
      // 创建图标元素
      const iconElement = document.createElement('i');
      iconElement.className = 'tab-context-menu-icon';
      
      // 根据文本内容设置图标
      if (item.text.includes('重命名')) iconElement.classList.add('ti', 'ti-edit');
      else if (item.text.includes('固定')) iconElement.classList.add('ti', tab.isPinned ? 'ti-pin-off' : 'ti-pin');
      else if (item.text.includes('添加到已有标签组')) iconElement.classList.add('ti', 'ti-bookmark-plus');
      else if (item.text.includes('关闭')) iconElement.classList.add('ti', 'ti-x');
      else iconElement.classList.add('ti', 'ti-edit'); // 默认图标
      
      iconElement.style.cssText = `
        flex: 0 0 auto;
        font-size: var(--orca-fontsize-lg);
        margin-top: var(--orca-spacing-xs);
        margin-right: var(--orca-spacing-md);
        color: var(--orca-tab-colored-text);
        width: 16px;
        text-align: center;
      `;
      menuItem.appendChild(iconElement);
      
      // 创建文本子元素
      const textElement = document.createElement('span');
      textElement.textContent = item.text;
      menuItem.appendChild(textElement);
      
      if (!(item as any).disabled) {
        menuItem.addEventListener('mouseenter', () => {
          menuItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
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
    // 在工作区状态下，不保存标签页到普通存储
    // 避免工作区的标签页覆盖用户的普通标签页
    if (this.currentWorkspace) {
      this.log(`🚫 在工作区状态下，跳过保存标签页到普通存储`);
      return;
    }
    
    const firstPanelTabs = this.panelTabsData[0] || [];
    await this.tabStorageService.saveFirstPanelTabs(firstPanelTabs);
  }

  // 注意：第二个面板现在使用统一的数据结构，不再需要单独的处理方法

  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    await this.tabStorageService.saveClosedTabs(this.closedTabs);
  }

  /**
   * 保存最近关闭的标签页列表到持久化存储（使用API）
   */
  async saveRecentlyClosedTabs() {
    await this.tabStorageService.saveRecentlyClosedTabs(this.recentlyClosedTabs);
  }

  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    const saved = await this.tabStorageService.restoreFirstPanelTabs();
    // 确保panelTabsData数组有足够的空间
    if (this.panelTabsData.length === 0) {
      this.panelTabsData.push([]);
    }
    this.panelTabsData[0] = saved;
    
    // 检查并更新块类型和图标信息
    await this.updateRestoredTabsBlockTypes();
  }

  // 注意：第二个面板现在使用统一的数据结构，不再需要单独的处理方法

  /**
   * 更新从存储中恢复的标签页的块类型和图标
   */
  async updateRestoredTabsBlockTypes() {
    this.log("🔄 更新从存储中恢复的标签页的块类型和图标...");
    
    // 直接访问第一个面板的数据
    const firstPanelTabs = this.panelTabsData[0] || [];
    if (firstPanelTabs.length === 0) {
      this.log("⚠️ 第一个面板没有标签页需要更新");
      return;
    }
    
    let hasUpdates = false;
    
    for (let i = 0; i < firstPanelTabs.length; i++) {
      const tab = firstPanelTabs[i];
      
      // 检查是否需要更新块类型和图标
      const needsUpdate = !tab.blockType || !tab.icon;
      
      if (needsUpdate) {
        try {
          // 重新获取块信息
          const block = await orca.invokeBackend("get-block", parseInt(tab.blockId));
          if (block) {
            // 检测块类型（使用工具函数）
            const blockType = await detectBlockType(block);
            
            // 获取图标（优先使用用户自定义，否则使用块类型图标）
            let icon = tab.icon; // 保持用户自定义图标
            if (!icon) {
              icon = getBlockTypeIcon(blockType);
            }
            
            // 更新标签信息
            firstPanelTabs[i] = {
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
      // 更新panelTabsData数组
      this.panelTabsData[0] = firstPanelTabs;
      
      // 只有在非工作区状态下才保存更新的标签页
      // 如果在工作区状态下，不应该覆盖普通标签页的存储
      if (!this.currentWorkspace) {
        this.log("🔄 检测到恢复的标签页有更新，保存到存储...");
      await this.saveFirstPanelTabs();
      } else {
        this.log("🔄 在工作区状态下，跳过保存更新的标签页到存储");
      }
    }
    
    this.log("✅ 恢复的标签页块类型和图标更新完成");
  }

  /**
   * 从持久化存储恢复已关闭标签列表（使用API）
   */
  async restoreClosedTabs() {
    this.closedTabs = await this.tabStorageService.restoreClosedTabs();
  }

  /**
   * 从持久化存储恢复最近关闭的标签页列表（使用API）
   */
  async restoreRecentlyClosedTabs() {
    this.recentlyClosedTabs = await this.tabStorageService.restoreRecentlyClosedTabs();
  }

  /**
   * 保存多标签页集合到持久化存储（使用API）
   */
  async saveSavedTabSets() {
    await this.tabStorageService.saveSavedTabSets(this.savedTabSets);
  }

  /**
   * 从持久化存储恢复多标签页集合（使用API）
   */
  async restoreSavedTabSets() {
    this.savedTabSets = await this.tabStorageService.restoreSavedTabSets();
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






  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 拖拽功能 - Drag Functionality */
  /* ———————————————————————————————————————————————————————————————————————————— */

  startDrag(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation(); // 强制阻止窗口拖拽
    
    this.isDragging = true;
    // 根据布局模式使用不同的位置
    const currentPosition = this.isVerticalMode ? this.verticalPosition : this.position;
    this.dragStartX = e.clientX - currentPosition.x;
    this.dragStartY = e.clientY - currentPosition.y;

    // 添加拖拽状态类
    if (this.tabContainer) {
      this.tabContainer.classList.add('dragging');
      const dragHandle = this.tabContainer.querySelector('.drag-handle');
      if (dragHandle) {
        dragHandle.classList.add('dragging');
      }
    }
    document.body.classList.add('dragging');

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
      // 同时更新当前位置用于显示
      this.position.x = this.verticalPosition.x;
      this.position.y = this.verticalPosition.y;
    } else {
      this.horizontalPosition.x = e.clientX - this.dragStartX;
      this.horizontalPosition.y = e.clientY - this.dragStartY;
      // 同时更新当前位置用于显示
      this.position.x = this.horizontalPosition.x;
      this.position.y = this.horizontalPosition.y;
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
      // 同步更新当前位置
      this.position.x = this.verticalPosition.x;
      this.position.y = this.verticalPosition.y;
    } else {
      this.horizontalPosition.x = Math.max(minX, Math.min(maxX, this.horizontalPosition.x));
      this.horizontalPosition.y = Math.max(minY, Math.min(maxY, this.horizontalPosition.y));
      // 同步更新当前位置
      this.position.x = this.horizontalPosition.x;
      this.position.y = this.horizontalPosition.y;
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
    
    // 移除拖拽状态类
    if (this.tabContainer) {
      this.tabContainer.classList.remove('dragging');
      const dragHandle = this.tabContainer.querySelector('.drag-handle');
      if (dragHandle) {
        dragHandle.classList.remove('dragging');
      }
      this.tabContainer.style.cursor = 'default';
      // 移除可能影响其他元素点击的样式和属性
      this.tabContainer.style.userSelect = '';
      this.tabContainer.style.pointerEvents = 'auto';
      this.tabContainer.style.touchAction = '';
    }
    document.body.classList.remove('dragging');
    
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

    // 保存位置（位置已经在drag方法中正确更新）
      await this.saveLayoutMode();
    this.log(`💾 拖拽结束，位置已保存: ${this.isVerticalMode ? '垂直' : '水平'}模式 (${this.position.x}, ${this.position.y})`);
  }

  async savePosition() {
    const updatedPositions = await this.tabStorageService.savePosition(
      this.position,
      this.isVerticalMode,
      this.verticalPosition,
      this.horizontalPosition
    );
    
    this.verticalPosition = updatedPositions.verticalPosition;
    this.horizontalPosition = updatedPositions.horizontalPosition;
  }

  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode() {
    await this.tabStorageService.saveLayoutMode({
      isVerticalMode: this.isVerticalMode,
      verticalWidth: this.verticalWidth,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      isSidebarAlignmentEnabled: this.isSidebarAlignmentEnabled,
      isFloatingWindowVisible: this.isFloatingWindowVisible,
      showBlockTypeIcons: this.showBlockTypeIcons,
      showInHeadbar: this.showInHeadbar,
      horizontalTabMaxWidth: this.horizontalTabMaxWidth,
      horizontalTabMinWidth: this.horizontalTabMinWidth
    });
  }

  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode() {
    await this.tabStorageService.saveFixedToTopMode(this.isFixedToTop);
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
      // 使用配置工具函数获取正确的位置
      this.position = getPositionByMode(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      );
      
        // 确保恢复的位置在有效范围内
      this.position = validatePosition(this.position, this.isVerticalMode, this.verticalWidth);
      
      this.log(`📍 位置已恢复: ${generatePositionLogMessage(this.position, this.isVerticalMode)}`);
    } catch (e) {
      this.warn("无法恢复标签位置");
    }
  }

  /**
   * 从API配置恢复布局模式
   */
  async restoreLayoutMode() {
    try {
      const saved = await this.storageService.getConfig<Partial<LayoutConfig>>(
        PLUGIN_STORAGE_KEYS.LAYOUT_MODE, 
        this.pluginName, 
        createDefaultLayoutConfig()
      );
      
      if (saved) {
        // 使用配置工具函数合并配置
        const config = mergeLayoutConfig(saved);
        
        this.isVerticalMode = config.isVerticalMode;
        this.verticalWidth = config.verticalWidth;
        this.verticalPosition = config.verticalPosition;
        this.horizontalPosition = config.horizontalPosition;
        
        // 根据当前布局模式设置正确的位置
        this.position = getPositionByMode(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        );
        
        // 恢复其他设置
        this.isSidebarAlignmentEnabled = config.isSidebarAlignmentEnabled;
        this.isFloatingWindowVisible = config.isFloatingWindowVisible;
        this.showBlockTypeIcons = config.showBlockTypeIcons;
        this.showInHeadbar = config.showInHeadbar;
        this.horizontalTabMaxWidth = config.horizontalTabMaxWidth;
        this.horizontalTabMinWidth = config.horizontalTabMinWidth;
        
        this.log(`📐 布局模式已恢复: ${generateLayoutLogMessage(config)}, 当前位置: (${this.position.x}, ${this.position.y})`);
        
        // 如果侧边栏对齐功能已启用，启动监听器
        if (this.isSidebarAlignmentEnabled) {
          this.startSidebarAlignmentObserver();
          this.log("🔄 侧边栏对齐监听器已启动");
        }
      } else {
        // 使用默认配置
        const defaultConfig = createDefaultLayoutConfig();
        this.isVerticalMode = defaultConfig.isVerticalMode;
        this.verticalWidth = defaultConfig.verticalWidth;
        this.verticalPosition = defaultConfig.verticalPosition;
        this.horizontalPosition = defaultConfig.horizontalPosition;
        this.horizontalTabMaxWidth = defaultConfig.horizontalTabMaxWidth;
        this.horizontalTabMinWidth = defaultConfig.horizontalTabMinWidth;
        this.position = getPositionByMode(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        );
        this.log(`📐 布局模式: 水平 (默认)`);
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
    }
  }

  /**
   * 从API配置恢复固定到顶部状态
   */
  async restoreFixedToTopMode() {
    try {
      const saved = await this.storageService.getConfig<{ isFixedToTop: boolean }>(
        PLUGIN_STORAGE_KEYS.FIXED_TO_TOP, 
        this.pluginName, 
        { isFixedToTop: false }
      );
      
      if (saved) {
        this.isFixedToTop = saved.isFixedToTop;
        this.log(`📌 固定到顶部状态已恢复: ${this.isFixedToTop ? '启用' : '禁用'}`);
      } else {
        this.isFixedToTop = false;
        this.log(`📌 固定到顶部状态: 禁用 (默认)`);
      }
    } catch (e) {
      this.error("恢复固定到顶部状态失败:", e);
    }
  }

  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const containerHeight = this.isVerticalMode ? Math.min(this.getCurrentPanelTabs().length * 28 + 8, window.innerHeight * 0.8) : 28;
    this.position = constrainPositionToBounds(this.position, this.isVerticalMode, this.verticalWidth, containerHeight);
  }

  /**
   * 检查新添加的块
   */
  async checkForNewBlocks() {
    if (this.getPanelIds().length === 0 || !this.isInitialized) return;
    
    // 所有面板都使用统一的处理逻辑（基于第一个面板的特殊处理）
    await this.checkCurrentPanelBlocks();
  }

  /**
   * 立即更新聚焦状态
   * 
   * 功能说明：
   * - 清除所有标签页的聚焦状态（data-focused="true"）
   * - 设置指定标签页为聚焦状态
   * - 确保视觉上只有一个标签页显示为激活状态
   * 
   * 使用场景：
   * - 用户点击不同内容时，需要立即更新标签页的聚焦状态
   * - 避免防抖延迟，提供即时的视觉反馈
   * 
   * @param blockId - 要聚焦的块ID
   * @param title - 标签页标题（用于日志记录）
   */
  private updateFocusState(blockId: string, title: string) {
    // 步骤1: 清除所有标签页的聚焦状态
    // 查找所有标签页元素，移除 data-focused 属性
    const allTabs = this.tabContainer?.querySelectorAll('.orca-tabs-plugin .orca-tab');
    allTabs?.forEach(tab => tab.removeAttribute('data-focused'));
    
    // 步骤2: 设置目标标签页为聚焦状态
    // 根据 blockId 查找对应的标签页元素
    const currentTabElement = this.tabContainer?.querySelector(`[data-tab-id="${blockId}"]`);
    if (currentTabElement) {
      // 设置聚焦状态，触发CSS样式变化
      currentTabElement.setAttribute('data-focused', 'true');
      this.verboseLog(`🎯 更新聚焦状态到已存在的标签: "${title}"`);
    } else {
      // 如果找不到标签页元素，记录警告日志
      this.verboseLog(`⚠️ 未找到标签元素: ${blockId}`);
    }
  }

  /**
   * 检查当前面板的当前激活页面（统一处理所有面板）
   * 
   * 功能说明：
   * - 检测用户聚焦的内容变化
   * - 更新标签页的聚焦状态
   * - 处理标签页内容的更新或创建
   * 
   * 核心逻辑：
   * 1. 获取当前激活的面板
   * 2. 查找面板中可见的块编辑器（没有 orca-hideable-hidden 类）
   * 3. 检查该块是否已存在于标签页中
   * 4. 如果存在：更新聚焦状态
   * 5. 如果不存在：更新当前聚焦标签页的内容
   * 
   * 使用场景：
   * - 用户点击不同内容时触发
   * - 键盘导航切换时触发
   * - 程序化聚焦时触发
   */
  /**
   * 从块ID创建标签页信息
   * 使用现有的完整 getTabInfo 方法，确保标题、图标、类型等信息的一致性
   */
  private async createTabInfoFromBlock(blockId: string, panelId?: string): Promise<TabInfo | null> {
    try {
      const tabInfo = await this.getTabInfo(blockId, panelId || '', 0);
      return tabInfo;
    } catch (error) {
      this.error(`创建标签页信息失败: ${blockId}`, error);
      return null;
    }
  }

  /**
   * 处理新增的orca-hideable元素
   * @param element 新增的DOM元素
   * @returns 是否处理了orca-hideable元素
   */
  private handleNewHideableElement(element: Element): boolean {
    if (!element.classList.contains('orca-hideable')) {
      return false;
    }

    const hasBlockEditor = element.querySelector('.orca-block-editor[data-block-id]');
    if (hasBlockEditor) {
      const blockId = hasBlockEditor.getAttribute('data-block-id');
      if (blockId) {
        const containingPanel = element.closest('.orca-panel');
        if (containingPanel) {
          const panelId = containingPanel.getAttribute('data-panel-id');
          if (panelId) {
            // 直接调用处理方法，确保立即更新标签页
            this.handleNewBlockInPanel(blockId, panelId).catch(error => {
              this.error(`处理新块失败: ${blockId}`, error);
            });
          }
        }
      }
    }
    return true;
  }

  /**
   * 处理子元素中的orca-hideable元素
   * @param element 父元素
   * @returns 是否处理了子元素中的orca-hideable
   */
  private handleChildHideableElements(element: Element): boolean {
    const hideableChild = element.querySelector('.orca-hideable');
    if (!hideableChild) {
      return false;
    }

    const hasBlockEditor = hideableChild.querySelector('.orca-block-editor[data-block-id]');
    if (hasBlockEditor) {
      const blockId = hasBlockEditor.getAttribute('data-block-id');
      if (blockId) {
        const containingPanel = element.closest('.orca-panel');
        if (containingPanel) {
          const panelId = containingPanel.getAttribute('data-panel-id');
          if (panelId) {
            this.handleNewBlockInPanel(blockId, panelId).catch(error => {
              this.error(`处理新块失败: ${blockId}`, error);
            });
          }
        }
      }
    }
    return true;
  }

  /**
   * 处理面板中新增的块编辑器
   * 这是修复搜索打开页面问题的核心方法
   * 
   * 功能：
   * 1. 检查新块是否已存在于标签页中，如果存在则直接聚焦
   * 2. 如果不存在，则智能替换当前聚焦的标签页内容
   * 3. 确保标签页标题、图标等信息正确显示
   * 
   * @param blockId 新增的块ID
   * @param panelId 所在面板ID
   */
  private async handleNewBlockInPanel(blockId: string, panelId: string) {
    if (!blockId || !panelId) return;
    
    this.log(`🔍 [DEBUG] ========== handleNewBlockInPanel 开始 ==========`);
    this.log(`🔍 [DEBUG] 参数: blockId=${blockId}, panelId=${panelId}`);
    
    // 【修复BUG】如果正在导航中，跳过处理，避免导航时替换标签页内容
    if (this.isNavigating) {
      this.log(`⏭️ [DEBUG] 正在导航中，跳过 handleNewBlockInPanel: ${blockId}`);
      return;
    }
    
    // 如果正在切换标签，不要替换现有标签
    if (this.isSwitchingTab) {
      this.log(`🔄 [DEBUG] 正在切换标签，跳过 handleNewBlockInPanel: ${blockId}`);
      return;
    }
    
    // 【关键修复】最优先检查是否正在创建中，在所有其他检查之前
    if (this.creatingTabs.has(blockId)) {
      this.log(`⏳ [DEBUG] 标签 ${blockId} 正在被其他地方创建（creatingTabs检查），立即跳过`);
      return;
    }
    
    // 【修复】验证是否应该处理这个面板的变化
    // 关键判断：只有当新块出现在当前用户正在使用的面板中时，才应该更新标签页
    
    // 获取当前激活的面板（用户正在查看的面板）
    const currentActivePanel = document.querySelector('.orca-panel.active');
    const currentActivePanelId = currentActivePanel?.getAttribute('data-panel-id');
    
    // 如果新块不是出现在当前激活的面板中，则不应该影响标签页
    if (currentActivePanelId && panelId !== currentActivePanelId) {
      this.log(`🚫 忽略非激活面板 ${panelId} 中的新块 ${blockId}，当前激活面板为 ${currentActivePanelId}`);
      return;
    }
    
    // 检查面板是否在我们的管理范围内
    const managedPanelIds = this.getPanelIds();
    const panelIndex = managedPanelIds.indexOf(panelId);
    
    // 如果这是一个新面板，检查是否应该开始管理它
    if (panelIndex === -1) {
      // 只管理主面板（第一个面板）的标签页
      const allPanels = document.querySelectorAll('.orca-panel');
      const isPrimaryPanel = allPanels.length > 0 && allPanels[0].getAttribute('data-panel-id') === panelId;
      
      if (!isPrimaryPanel) {
        this.log(`🚫 不管理辅助面板 ${panelId} 的标签页`);
        return;
      }
    }
    
    // 只有在确认应该处理时，才更新当前面板信息
    if (panelIndex !== -1) {
      this.currentPanelIndex = panelIndex;
      this.currentPanelId = panelId;
    }
    
    let currentTabs = this.getCurrentPanelTabs();
    this.log(`🔍 [DEBUG] 当前标签页数量: ${currentTabs.length}`);
    
    // 检查标签页是否已存在
    const existingTab = currentTabs.find(tab => tab.blockId === blockId);
    if (existingTab) {
      // 标签页已存在，直接聚焦
      this.log(`🔍 [DEBUG] ✅ 标签 ${blockId} 已存在，只更新聚焦状态`);
      if (this.closedTabs.has(blockId)) {
        this.closedTabs.delete(blockId);
        this.saveClosedTabs();
      }
      
      this.updateFocusState(blockId, existingTab.title);
      this.immediateUpdateTabsUI();
      this.log(`🔍 [DEBUG] ========== handleNewBlockInPanel 完成（已存在）==========`);
      return;
    }
    
    this.log(`🔍 [DEBUG] ❌ 标签 ${blockId} 不存在，准备创建新标签`)
    
    // 标记为正在创建
    this.creatingTabs.add(blockId);
    
    let newTabInfo: TabInfo | null = null;
    try {
      // 标签页不存在，需要创建新的标签页信息
      newTabInfo = await this.createTabInfoFromBlock(blockId, panelId);
      if (!newTabInfo) return;
      
      // 重新获取tabs并再次检查（异步操作期间可能被其他地方创建了）
      currentTabs = this.getCurrentPanelTabs();
      const recheckExistingTab = currentTabs.find(tab => tab.blockId === blockId);
      if (recheckExistingTab) {
        this.log(`✅ 标签已被其他地方创建（在await期间），只更新聚焦状态: "${recheckExistingTab.title}"`);
        this.updateFocusState(blockId, recheckExistingTab.title);
        this.immediateUpdateTabsUI();
        return;
      }
    } finally {
      // 确保清除标记
      this.creatingTabs.delete(blockId);
    }
    
    // 使用更可靠的方法获取当前激活的标签页
    const currentActiveTab = this.getCurrentActiveTab();
    if (currentActiveTab) {
      // 如果当前激活的标签是置顶的，不应该替换它，而应该创建新标签
      if (currentActiveTab.isPinned) {
        this.log(`📌 当前激活标签已置顶，创建新标签: "${newTabInfo.title}"`);
        // 在所有置顶标签后面插入新标签（而不是当前标签后面）
        const pinnedCount = currentTabs.filter(t => t.isPinned).length;
        currentTabs.splice(pinnedCount, 0, newTabInfo);
        this.updateFocusState(blockId, newTabInfo.title);
        this.setCurrentPanelTabs(currentTabs);
        this.immediateUpdateTabsUI();
        return;
      }
      
      // 找到当前激活标签页的索引
      const activeIndex = currentTabs.findIndex(tab => tab.blockId === currentActiveTab.blockId);
      if (activeIndex !== -1) {
        // 替换当前激活的标签页内容
        this.log(`🔄 替换当前激活标签页: "${currentActiveTab.title}" -> "${newTabInfo.title}"`);
        
        // 记录标签切换历史 - 记录从当前标签切换到新标签
        this.recordTabSwitchHistory(currentActiveTab.blockId, newTabInfo);
        
        currentTabs[activeIndex] = newTabInfo;
        this.updateFocusState(blockId, newTabInfo.title);
        this.setCurrentPanelTabs(currentTabs);
        this.immediateUpdateTabsUI();
        return;
      }
    }
    
    // 备用方案：如果getCurrentActiveTab()无法获取（可能是时序问题），
    // 尝试通过lastActiveBlockId来确定上一个激活的标签页
    if (this.lastActiveBlockId) {
      const lastActiveIndex = currentTabs.findIndex(tab => tab.blockId === this.lastActiveBlockId);
      if (lastActiveIndex !== -1) {
        const lastActiveTab = currentTabs[lastActiveIndex];
        // 如果上一个激活的标签是置顶的，创建新标签而不是替换
        if (lastActiveTab.isPinned) {
          this.log(`📌 上一个激活标签已置顶，创建新标签: "${newTabInfo.title}"`);
          // 在所有置顶标签后面插入新标签（而不是上一个标签后面）
          const pinnedCount = currentTabs.filter(t => t.isPinned).length;
          currentTabs.splice(pinnedCount, 0, newTabInfo);
          this.updateFocusState(blockId, newTabInfo.title);
          this.setCurrentPanelTabs(currentTabs);
          this.immediateUpdateTabsUI();
          return;
        }
        
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${currentTabs[lastActiveIndex].title}" -> "${newTabInfo.title}"`);
        
        // 记录标签切换历史 - 记录从上一个标签切换到新标签
        this.recordTabSwitchHistory(currentTabs[lastActiveIndex].blockId, newTabInfo);
        
        currentTabs[lastActiveIndex] = newTabInfo;
        this.updateFocusState(blockId, newTabInfo.title);
        this.setCurrentPanelTabs(currentTabs);
        this.immediateUpdateTabsUI();
        return;
      }
    }
    
    // 如果无法获取当前激活标签页，尝试通过DOM元素查找
    let targetIndex = -1;
    const focusedTabElement = this.tabContainer?.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (focusedTabElement) {
      const focusedTabId = focusedTabElement.getAttribute('data-tab-id');
      targetIndex = currentTabs.findIndex(tab => tab.blockId === focusedTabId);
    }
    
    // 如果还是没找到，查找有聚焦样式的标签页
    if (targetIndex === -1) {
      const allTabElements = this.tabContainer?.querySelectorAll('.orca-tabs-plugin .orca-tab');
      if (allTabElements && allTabElements.length > 0) {
        for (let i = 0; i < allTabElements.length; i++) {
          const tabElement = allTabElements[i];
          if (tabElement.classList.contains('focused') || 
              tabElement.getAttribute('data-focused') === 'true' ||
              tabElement.classList.contains('active')) {
            targetIndex = i;
            break;
          }
        }
      }
    }
    
    // 如果还是没找到，使用第一个标签页而不是最后一个（更符合用户预期）
    if (targetIndex === -1 && currentTabs.length > 0) {
      targetIndex = 0;
      this.log(`⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标`);
    }
    
    if (targetIndex >= 0 && targetIndex < currentTabs.length) {
      const targetTab = currentTabs[targetIndex];
      // 如果目标标签是置顶的，创建新标签而不是替换
      if (targetTab.isPinned) {
        this.log(`📌 目标标签已置顶，创建新标签: "${newTabInfo.title}"`);
        // 在所有置顶标签后面插入新标签（而不是目标标签后面）
        const pinnedCount = currentTabs.filter(t => t.isPinned).length;
        currentTabs.splice(pinnedCount, 0, newTabInfo);
        this.updateFocusState(blockId, newTabInfo.title);
        this.setCurrentPanelTabs(currentTabs);
        this.immediateUpdateTabsUI();
      } else {
        // 替换目标标签页的内容
        currentTabs[targetIndex] = newTabInfo;
        this.updateFocusState(blockId, newTabInfo.title);
        this.setCurrentPanelTabs(currentTabs);
        this.immediateUpdateTabsUI();
      }
    } else {
      // 如果没有任何标签页，创建第一个标签页
      currentTabs = [newTabInfo];
      this.updateFocusState(blockId, newTabInfo.title);
      this.setCurrentPanelTabs(currentTabs);
      this.immediateUpdateTabsUI();
    }
  }

  async checkCurrentPanelBlocks() {
    if (this.panelBlockCheckTask) {
      await this.panelBlockCheckTask;
      return;
    }

    this.panelBlockCheckTask = (async () => {
      // 【修复BUG】如果正在导航中，跳过面板块检查，避免重复创建标签页
      if (this.isNavigating) {
        this.verboseLog('⏭️ 正在导航中，跳过面板块检查');
        return;
      }

      this.verboseLog('🔍 开始检查当前面板块...');

      // 步骤1: 获取当前激活的面板
      // 查找带有 .active 类的面板元素
      const currentActivePanel = document.querySelector('.orca-panel.active');
      if (!currentActivePanel) {
        this.log('❌ 没有找到当前激活的面板');
        // 调试：列出所有面板的状态
        const allPanels = document.querySelectorAll('.orca-panel');
        this.log(`📊 当前所有面板状态:`);
        allPanels.forEach((panel, index) => {
          const panelId = panel.getAttribute('data-panel-id');
          const isActive = panel.classList.contains('active');
          this.log(`  面板${index + 1}: ID=${panelId}, active=${isActive}`);
        });
        return;
      }

      // 步骤2: 获取面板ID
      // 从面板元素中提取 data-panel-id 属性
      const currentPanelId = currentActivePanel.getAttribute('data-panel-id');
      if (!currentPanelId) {
        this.log('❌ 激活面板没有 data-panel-id');
        return;
      }

      this.verboseLog(`✅ 找到激活面板: ID=${currentPanelId}, class=${currentActivePanel.className}`);

      // 步骤3: 更新当前面板索引
      // 确保 this.currentPanelIndex 和 this.currentPanelId 与DOM状态同步
      // 这是关键步骤，避免读取错误面板的数据
      const panelIndex = this.getPanelIds().indexOf(currentPanelId);
      if (panelIndex !== -1) {
        this.currentPanelIndex = panelIndex;
        this.currentPanelId = currentPanelId;
        this.verboseLog(`🔄 更新当前面板索引: ${panelIndex} (面板ID: ${currentPanelId})`);
      }

      // 步骤4: 获取当前激活的块编辑器
      // 查找面板中可见的块编辑器（没有 orca-hideable-hidden 类）
      // 这个选择器确保只获取用户当前看到的内容

      // 检查面板内的hideable元素
      const allHideableElements = currentActivePanel.querySelectorAll('.orca-hideable');

      const activeBlockEditor = currentActivePanel.querySelector('.orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]');
      if (!activeBlockEditor) {
        this.log(`❌ 激活面板 ${currentPanelId} 中没有找到可见的块编辑器`);
        return;
      }


      // 步骤5: 获取块ID
      // 从块编辑器中提取 data-block-id 属性，用于标识具体的内容块
      const blockId = activeBlockEditor.getAttribute('data-block-id');
      if (!blockId) {
        this.log("激活的块编辑器没有blockId");
        return;
      }

      // 步骤6: 获取当前面板的标签页数据
      // 从内存中读取当前面板的标签页数组
      let currentTabs = this.getCurrentPanelTabs();

      // 步骤7: 数据完整性检查
      // 如果当前面板没有标签数据，先扫描面板数据
      // 这解决了面板切换后数据为空的问题
      if (currentTabs.length === 0) {
        this.log(`📋 当前面板没有标签数据，先扫描面板数据`);
        await this.scanCurrentPanelTabs();
        currentTabs = this.getCurrentPanelTabs();
      }


      // 步骤9: 查找已存在的标签页
      // 在当前面板的标签页数组中查找对应的块ID
      const existingTab = currentTabs.find(tab => tab.blockId === blockId);
      if (existingTab) {
        // 分支A: 标签页已存在 - 更新聚焦状态
        // 处理已关闭标签页的重新激活
        if (this.closedTabs.has(blockId)) {
          this.closedTabs.delete(blockId);
          await this.saveClosedTabs();
        }

        // 更新聚焦状态并刷新UI
        this.updateFocusState(blockId, existingTab.title);
        await this.immediateUpdateTabsUI();
        return;
      }

      // 标签页不存在 - 更新当前聚焦标签页的内容
      const focusedTabElement = this.tabContainer?.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
      if (!focusedTabElement) {
        this.log(`⚠️ 未找到聚焦的标签元素，当前块: ${blockId}`);
        return;
      }

      const focusedTabId = focusedTabElement.getAttribute('data-tab-id');
      if (!focusedTabId) {
        return;
      }

      const focusedIndex = currentTabs.findIndex(tab => tab.blockId === focusedTabId);
      if (focusedIndex === -1) {
        return;
      }

      const focusedTab = currentTabs[focusedIndex];
      
      // 如果聚焦的标签是置顶的，不应该替换它，而应该创建新标签
      if (focusedTab.isPinned) {
        this.log(`📌 聚焦标签已置顶，不替换，创建新标签: "${blockId}"`);
        
        // 再次检查是否已存在（可能在等待过程中被其他地方创建了）
        const recheckExistingTab = currentTabs.find(tab => tab.blockId === blockId);
        if (recheckExistingTab) {
          this.log(`✅ 标签已被其他地方创建，只更新聚焦状态: "${recheckExistingTab.title}"`);
          this.updateFocusState(blockId, recheckExistingTab.title);
          await this.immediateUpdateTabsUI();
          return;
        }
        
        // 检查是否正在创建中
        if (this.creatingTabs.has(blockId)) {
          this.log(`⏳ 标签 ${blockId} 正在被其他地方创建，跳过`);
          return;
        }
        
        // 标记为正在创建
        this.creatingTabs.add(blockId);
        
        try {
          // 创建新的标签页信息
          const newTabInfo = await this.getTabInfo(blockId, currentPanelId, currentTabs.length);
          if (!newTabInfo) {
            return;
          }
          
          // 再次获取最新的tabs并检查（可能在await期间被创建了）
          currentTabs = this.getCurrentPanelTabs();
          const finalCheck = currentTabs.find(tab => tab.blockId === blockId);
          if (finalCheck) {
            this.log(`✅ 标签在创建过程中已被其他地方创建: "${finalCheck.title}"`);
            this.updateFocusState(blockId, finalCheck.title);
            await this.immediateUpdateTabsUI();
            return;
          }
          
          // 在所有置顶标签后面插入新标签（而不是当前聚焦标签后面）
          const pinnedCount = currentTabs.filter(t => t.isPinned).length;
          currentTabs.splice(pinnedCount, 0, newTabInfo);
          this.updateFocusState(blockId, newTabInfo.title);
          this.setCurrentPanelTabs(currentTabs);
          await this.immediateUpdateTabsUI();
        } finally {
          // 确保清除标记
          this.creatingTabs.delete(blockId);
        }
        return;
      }

      // 创建新的标签页信息并替换非置顶标签
      const newTabInfo = await this.getTabInfo(blockId, currentPanelId, focusedIndex);
      if (!newTabInfo) {
        return;
      }

      currentTabs[focusedIndex] = newTabInfo;
      this.setCurrentPanelTabs(currentTabs);
      await this.immediateUpdateTabsUI();
      return;
    })();

    try {
      await this.panelBlockCheckTask;
    } finally {
      this.panelBlockCheckTask = null;
    }
  }



  /**
   * 监听DOM变化的核心方法
   * 
   * 主要监听以下变化：
   * 1. 新面板的添加/删除
   * 2. 面板激活状态的变化
   * 3. orca-hideable元素的添加（搜索打开页面的关键修复）
   * 4. 块编辑器的添加
   * 
   * 这是修复搜索打开页面问题的关键部分
   */
  observeChanges() {
    const observer = new MutationObserver(async (mutations) => {
      let shouldCheckNewBlocks = false;
      let shouldCheckNewPanels = false;
      
      let needsCurrentPanelUpdate = false;
      let oldIndex = this.currentPanelIndex;
      
      // 防抖：避免频繁的面板发现调用
      const now = Date.now();
      const lastPanelCheck = this.lastPanelCheckTime || 0;
      const panelCheckInterval = 1000; // 1秒内最多检查一次面板
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const target = mutation.target as Element;
          
          
          // 检查是否有新的面板添加
          if (target.classList.contains('orca-panels-row') || 
              target.closest('.orca-panels-row')) {
            shouldCheckNewPanels = true;
          }
          
          // 检查新增的节点，寻找orca-hideable元素和块编辑器
          if (mutation.addedNodes.length > 0) {
            const isInAnyPanel = target.closest('.orca-panel');
            
            if (isInAnyPanel) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  
                  // 【核心修复】处理新增的orca-hideable元素
                  if (this.handleNewHideableElement(element)) {
                    shouldCheckNewBlocks = true;
                    break;
                  }
                  
                  // 检查是否添加了新的块编辑器
                  if (element.classList.contains('orca-block-editor') || 
                      element.querySelector('.orca-block-editor')) {
                    shouldCheckNewBlocks = true;
                    break;
                  }
                  
                  // 检查子元素中的orca-hideable
                  if (this.handleChildHideableElements(element)) {
                    shouldCheckNewBlocks = true;
                    break;
                  }
                }
              }
            }
          }
        }
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const target = mutation.target as Element;
          
          // 检查面板激活状态变化，更新当前面板索引
          if (target.classList.contains('orca-panel')) {
            needsCurrentPanelUpdate = true;
            
            // 【核心修复】检测面板重新激活时的处理
            // 这是修复搜索打开页面问题的另一个关键逻辑
            // 当面板重新获得active状态时，检查是否有新的可见内容需要更新标签页
            if (target.classList.contains('active')) {
              const panelId = target.getAttribute('data-panel-id');
              
              // 查找面板内最新的可见块编辑器
              const hideableElements = target.querySelectorAll('.orca-hideable');
              let latestVisibleBlockId: string | null = null;
              
              hideableElements.forEach((element) => {
                const isHidden = element.classList.contains('orca-hideable-hidden');
                const hasBlockEditor = element.querySelector('.orca-block-editor[data-block-id]');
                const blockId = hasBlockEditor?.getAttribute('data-block-id');
                
                // 记录最新的可见块编辑器（通常是用户刚刚打开的内容）
                if (!isHidden && hasBlockEditor && blockId) {
                  latestVisibleBlockId = blockId;
                }
              });
              
              // 如果找到了新的可见块编辑器，立即处理
              if (latestVisibleBlockId && panelId) {
                this.handleNewBlockInPanel(latestVisibleBlockId, panelId).catch(error => {
                  this.error(`处理面板激活时的新块失败: ${latestVisibleBlockId}`, error);
                });
              }
              
              // 延迟检查，确保DOM完全更新（处理异步加载的内容）
              setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 50);
              
              setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 200);
            }
            
            // 检测锁定面板并聚焦上一个面板
            if (target.classList.contains('orca-locked') && target.classList.contains('active')) {
              this.log('🔒 检测到锁定面板激活，聚焦上一个面板');
              this.focusToPreviousPanel();
            }
          }
          
          // 检查 orca-hideable 元素的类名变化（聚焦状态变化）
          if (target.classList.contains('orca-hideable')) {
            // 检查元素是否变为可见状态（没有 orca-hideable-hidden 类）
            const isNowVisible = !target.classList.contains('orca-hideable-hidden');
            
            // 如果元素现在是可见的，说明用户可能聚焦了这个元素
            if (isNowVisible) {
              this.verboseLog('🎯 检测到 orca-hideable 元素聚焦状态变化');
              shouldCheckNewBlocks = true; // 触发标签页检查
            }
          }
        }
      });

      // 处理面板切换
      if (needsCurrentPanelUpdate) {
        await this.updateCurrentPanelIndex();
        
        /**
         * 面板切换时立即更新标签页显示（修复同步问题）
         * 
         * 问题背景：
         * - 面板切换时使用防抖更新
         * - 用户切换面板后标签页更新滞后
         * - 影响面板切换的用户体验
         * 
         * 修复方案：
         * - 面板切换时立即更新标签页
         * - 确保面板切换与标签页同步
         * - 提供即时的视觉反馈
         * 
         * 避坑点：
         * 1. 不要在面板切换时使用防抖
         * 2. 确保面板切换立即响应
         * 3. 避免用户看到不一致的状态
         * 4. 保持面板切换与标签页的同步
         */
        if (oldIndex !== this.currentPanelIndex) {
          this.log(`🔄 面板切换: ${oldIndex} -> ${this.currentPanelIndex}`);
          await this.immediateUpdateTabsUI();
        }
      }

      if (shouldCheckNewPanels && (now - lastPanelCheck) > panelCheckInterval) {
        // 检查新面板（防抖）
        this.lastPanelCheckTime = now;
        this.log(`🔍 面板检查防抖：距离上次检查 ${now - lastPanelCheck}ms`);
        setTimeout(async () => {
          await this.checkForNewPanels();
        }, 100);
      } else if (shouldCheckNewPanels) {
        this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${now - lastPanelCheck}ms`);
      }


      if (shouldCheckNewBlocks) {
        /**
         * 检查聚焦状态变化（带防抖）
         * 
         * 问题背景：
         * - MutationObserver 频繁触发导致大量重复调用
         * - 每次 DOM 变化都会触发检查
         * - 导致性能问题和大量日志
         * 
         * 修复方案：
         * - 添加防抖机制，限制调用频率
         * - 在300ms内只响应一次检查请求
         * - 确保DOM变化时标签页能够同步，但避免过度调用
         * 
         * 避坑点：
         * 1. 防抖间隔不能太长，避免用户感知延迟
         * 2. 防抖间隔不能太短，避免频繁调用
         * 3. 需要在真正有状态变化时才更新
         */
        const now = Date.now();
        const blockCheckInterval = 300; // 300ms 防抖间隔
        const timeSinceLastCheck = now - this.lastBlockCheckTime;
        if (timeSinceLastCheck > blockCheckInterval) {
          this.verboseLog(`🔍 块检查防抖：距离上次检查 ${timeSinceLastCheck}ms，执行检查`);
          this.lastBlockCheckTime = now;
          await this.checkCurrentPanelBlocks();
        } else {
          this.verboseLog(`⏭️ 跳过块检查：距离上次检查仅 ${timeSinceLastCheck}ms`);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
    
    // ==================== 聚焦变化检测系统 ====================
    // 功能说明：
    // - 监听用户的聚焦行为（点击、键盘导航等）
    // - 检测 orca-hideable 元素的聚焦状态变化
    // - 触发标签页的聚焦状态更新
    
    // 防抖机制：避免频繁触发，提高性能
    let focusChangeTimeout: number | null = null;
    
    /**
     * 聚焦变化处理函数
     * 
     * 核心逻辑：
     * 1. 检查点击的元素是否在 orca-hideable 容器内
     * 2. 延迟检查，确保DOM类名变化已完成
     * 3. 验证元素是否变为可见状态
     * 4. 触发标签页聚焦状态更新
     * 
     * @param e - 事件对象
     */
    // 记录上次检查的块ID，避免重复检查同一个块
    let lastCheckedBlockId: string | null = null;
    
    const handleFocusChange = async (e: Event) => {
      const target = e.target as Element;
      
      // 步骤0: 提前过滤 - 只处理可能相关的点击
      // 如果点击的是标签页容器、侧边栏等，直接跳过
      if (target.closest('.orca-tabs-plugin') || 
          target.closest('.orca-sidebar') ||
          target.closest('.orca-headbar')) {
        return;
      }
      
      // 步骤1: 查找最近的 orca-hideable 元素
      // 检查点击的元素是否在可隐藏的容器内
      const hideableElement = target.closest('.orca-hideable');
      
      if (hideableElement) {
        // 步骤1.5: 提前检查是否真的需要更新
        // 获取当前点击的块ID
        const blockEditor = hideableElement.querySelector('.orca-block-editor[data-block-id]');
        const currentBlockId = blockEditor?.getAttribute('data-block-id');
        
        // 如果是同一个块，跳过检查（避免重复）
        if (currentBlockId && currentBlockId === lastCheckedBlockId) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个块 ${currentBlockId}`);
          return;
        }
        
        // 步骤2: 防抖处理
        // 清除之前的延迟，避免重复触发
        if (focusChangeTimeout) {
          clearTimeout(focusChangeTimeout);
        }
        
        /**
         * 步骤3: 立即检查（修复同步问题）
         * 
         * 问题背景：
         * - 100ms延迟导致聚焦变化响应滞后
         * - 用户点击后需要等待才能看到标签页更新
         * - 影响用户体验和视觉同步
         * 
         * 修复方案：
         * - 移除延迟，立即响应聚焦变化
         * - 确保标签页与编辑器同步更新
         * - 提供即时的视觉反馈
         * 
         * 优化改进：
         * - 添加重复检查过滤，避免相同块的多次触发
         * - 提前过滤无关点击，减少不必要的DOM查询
         * - 记录上次检查的块ID，智能跳过
         * 
         * 避坑点：
         * 1. 不要在聚焦变化时使用延迟
         * 2. 确保事件处理立即响应
         * 3. 避免用户看到不一致的状态
         * 4. 保持编辑器与标签页的同步
         * 5. 避免重复检查同一个块
         */
        focusChangeTimeout = window.setTimeout(async () => {
          // 步骤4: 验证聚焦状态
          // 检查元素是否现在是可见的（没有 orca-hideable-hidden 类）
          if (!hideableElement.classList.contains('orca-hideable-hidden')) {
            // 【修复BUG】如果正在导航中，跳过聚焦检测，避免重复创建标签页
            if (this.isNavigating) {
              this.verboseLog('⏭️ 正在导航中，跳过聚焦检测');
              return;
            }
            
            this.verboseLog('🎯 检测到 orca-hideable 元素聚焦变化');
            
            // 更新上次检查的块ID
            if (currentBlockId) {
              lastCheckedBlockId = currentBlockId;
            }
            
            // 步骤5: 立即触发标签页更新
            // 调用 checkCurrentPanelBlocks 方法，立即更新标签页聚焦状态
            await this.checkCurrentPanelBlocks();
          }
          
          // 清理防抖状态
          focusChangeTimeout = null;
        }, 0); // 立即执行，无延迟
      }
    };
    
    // ==================== 事件监听器注册 ====================
    
    // 监听器1: 点击事件
    // 处理用户鼠标点击不同内容的情况
    document.addEventListener('click', handleFocusChange);
    
    // 监听器2: 聚焦事件
    // 处理键盘导航、程序化聚焦等情况
    document.addEventListener('focusin', handleFocusChange);
    
    /**
     * 监听器3: 键盘事件
     * 
     * 问题背景：
     * - 键盘导航（Tab键）有150ms延迟
     * - 用户使用键盘切换时响应滞后
     * - 影响键盘用户的体验
     * 
     * 修复方案：
     * - 移除键盘事件延迟，立即响应
     * - 确保键盘导航与鼠标点击一致
     * - 提供统一的用户体验
     * 
     * 避坑点：
     * 1. 不要给键盘事件添加延迟
     * 2. 确保键盘导航立即响应
     * 3. 保持键盘和鼠标操作的一致性
     * 4. 避免键盘用户看到滞后效果
     */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
        // 立即处理键盘事件（修复同步问题）
        if (focusChangeTimeout) {
          clearTimeout(focusChangeTimeout);
        }
        focusChangeTimeout = window.setTimeout(handleFocusChange, 0);
      }
    });

    /**
     * 监听器4: 主动检测机制（修复同步问题）
     * 
     * 问题背景：
     * - 仅依赖事件监听可能遗漏某些变化
     * - 程序化导航或外部操作可能不触发事件
     * - 需要额外的保障机制确保同步
     * 
     * 修复方案：
     * - 定期检查当前激活的块与聚焦标签页的匹配
     * - 发现不匹配时立即更新
     * - 提供最后一道保障机制
     * 
     * 避坑点：
     * 1. 不要完全依赖事件监听
     * 2. 需要主动检测机制作为保障
     * 3. 检查频率要适中，避免性能问题
     * 4. 错误处理要静默，避免影响主流程
     */
    if (typeof window !== 'undefined') {
      if (this.focusSyncInterval !== null) {
        window.clearInterval(this.focusSyncInterval);
      }
      this.focusSyncInterval = window.setInterval(async () => {
        try {
          // 检查是否有可见的块编辑器
          const currentActivePanel = document.querySelector('.orca-panel.active');
          if (currentActivePanel) {
            const activeBlockEditor = currentActivePanel.querySelector('.orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]');
            if (activeBlockEditor) {
              const blockId = activeBlockEditor.getAttribute('data-block-id');
              if (blockId) {
                // 校验当前焦点的标签页是否匹配
                const focusedTab = this.tabContainer?.querySelector('.orca-tab[data-focused="true"]');
                const hasFocusedTab = !!focusedTab;
                
                // 检查状态是否真正改变
                const stateChanged = !this.lastFocusState || 
                  this.lastFocusState.blockId !== blockId || 
                  this.lastFocusState.hasFocusedTab !== hasFocusedTab;
                
                if (stateChanged) {
                  // 更新状态记录
                  this.lastFocusState = { blockId, hasFocusedTab };
                  
                  if (focusedTab) {
                    const focusedTabId = focusedTab.getAttribute('data-tab-id');
                    if (focusedTabId !== blockId) {
                      this.verboseLog(`?? 焦点检测到变更: ${focusedTabId} -> ${blockId}`);
                      await this.checkCurrentPanelBlocks();
                    }
                  } else {
                    this.verboseLog(`?? 焦点检测到无聚焦标签页，当前块: ${blockId}`);
                    await this.checkCurrentPanelBlocks();
                  }
                }
              }
            }
          }
        } catch (error) {
          // 忽略焦点轮询中的非关键错误
        }
      }, 500); // 每500ms检查一次
    }
  }

  /**
   * 检查新添加的面板
   */
  async checkForNewPanels() {
    const oldPanelCount = this.getPanelIds().length;
    const oldPanelIds = [...this.getPanelIds()]; // 保存旧的面板ID列表
    const oldCurrentPanelId = this.currentPanelId || '';
    
    await this.discoverPanels();
    
    if (this.getPanelIds().length > oldPanelCount) {
      this.log(`🎉 发现新面板！从 ${oldPanelCount} 个增加到 ${this.getPanelIds().length} 个`);
      
      // 重新创建UI以显示循环切换器
      await this.createTabsUI();
    } else if (this.getPanelIds().length < oldPanelCount) {
      this.log(`📉 面板数量减少！从 ${oldPanelCount} 个减少到 ${this.getPanelIds().length} 个`);
      this.log(`📋 旧面板列表: [${oldPanelIds.join(', ')}]`);
      this.log(`📋 新面板列表: [${this.getPanelIds().join(', ')}]`);
      
      // 检查第一个面板是否发生了变化
      const oldFirstPanelId = oldPanelIds[0];
      const newFirstPanelId = this.getPanelIds()[0];
      
      if (oldFirstPanelId && newFirstPanelId && oldFirstPanelId !== newFirstPanelId) {
        this.log(`🔄 第一个面板已变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
        await this.handleFirstPanelChange(oldFirstPanelId, newFirstPanelId);
      }
      
      // 检查当前面板是否还存在
      if (this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId)) {
        this.log(`🔄 当前面板 ${this.currentPanelId || ''} 已关闭，切换到第一个面板`);
        this.currentPanelIndex = 0;
        this.currentPanelId = this.getPanelIds()[0];
        
        // 修复: 同时更新持久化面板索引，确保数据一致性
        // 持久化面板索引已简化，不再需要更新
        this.log(`🔄 更新持久化面板索引为: ${0}`);
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
      if (panelId && !panelId.startsWith('_')) { // 排除特殊面板
        const index = this.getPanelIds().indexOf(panelId);
        if (index !== -1) {
          // 修复: 记录面板索引变化
          const oldIndex = this.currentPanelIndex;
          this.currentPanelIndex = index;
          this.currentPanelId = panelId;
          
          this.log(`🔄 面板索引更新: ${oldIndex} -> ${index} (面板ID: ${panelId})`);
          
          // 确保每个面板有独立的标签页数据
          if (!this.panelTabsData[index] || this.panelTabsData[index].length === 0) {
            this.log(`🔍 面板 ${panelId} 没有数据，开始扫描`);
            await this.scanPanelTabsByIndex(index, panelId || '');
          }
          
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
    }, 2000) as any as number;
    
    // 统一的全局事件监听器
    this.globalEventListener = async (e: Event) => {
      await this.handleGlobalEvent(e);
    };
    
    // 为不同类型的事件注册同一个监听器
    // 【重要修复】使用 capture: true 在捕获阶段处理，确保在 Orca 原生处理之前拦截
    // 这对于 Ctrl+点击块引用功能至关重要，避免触发 Orca 的原生导航
    document.addEventListener('click', this.globalEventListener, { 
      passive: false,  // 不能使用 passive，需要调用 preventDefault()
      capture: true    // 【关键】在捕获阶段处理，先于 Orca 原生处理
    });
    document.addEventListener('contextmenu', this.globalEventListener, { passive: false });
    // 移除keydown监听以避免干扰Orca核心功能
  }

  /**
   * 聚焦到上一个面板
   */
  private focusToPreviousPanel() {
    const panelIds = this.getPanelIds();
    if (panelIds.length <= 1) {
      this.log('⚠️ 只有一个面板，无法切换到上一个面板');
      return;
    }

    // 获取当前面板索引
    const currentIndex = this.currentPanelIndex;
    if (currentIndex <= 0) {
      this.log('⚠️ 当前面板是第一个面板，无法切换到上一个面板');
      return;
    }

    // 计算上一个面板的索引
    const previousIndex = currentIndex - 1;
    const previousPanelId = panelIds[previousIndex];
    
    if (!previousPanelId) {
      this.log('⚠️ 未找到上一个面板');
      return;
    }

    this.log(`🔄 聚焦到上一个面板: ${previousPanelId} (索引: ${previousIndex})`);

    // 查找上一个面板元素
    const previousPanel = document.querySelector(`.orca-panel[data-panel-id="${previousPanelId}"]`);
    if (!previousPanel) {
      this.log(`❌ 未找到面板元素: ${previousPanelId}`);
      return;
    }

    // 移除当前面板的active类
    const currentPanel = document.querySelector('.orca-panel.active');
    if (currentPanel) {
      currentPanel.classList.remove('active');
    }

    // 为上一个面板添加active类
    previousPanel.classList.add('active');

    // 更新当前面板信息
    this.currentPanelIndex = previousIndex;
    this.currentPanelId = previousPanelId;

    // 更新标签页显示
    this.debouncedUpdateTabsUI();

    this.log(`✅ 已成功聚焦到上一个面板: ${previousPanelId}`);
  }

  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 事件处理 - Event Handling */
  /* ———————————————————————————————————————————————————————————————————————————— */

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
    const target = e.target as HTMLElement;
    
    // 检查是否按住 Ctrl 键（Windows/Linux）或 Cmd 键（Mac）点击
    if ((e.ctrlKey || e.metaKey) && target) {
      this.log(`🖱️ [DEBUG] Ctrl+点击检测: ctrlKey=${e.ctrlKey}, metaKey=${e.metaKey}`);
      this.log(`🖱️ [DEBUG] 点击目标: ${target.tagName}, classes: ${target.className}`);
      
    const blockRefId = this.getBlockRefId(target);
    if (blockRefId) {
        this.log(`🔗 [DEBUG] 检测到 Ctrl+点击 块引用: ${blockRefId}`);
        
        // 【关键修复】立即标记为正在创建，防止任何后续处理
        // 这必须在阻止事件之前执行，确保即使事件处理有任何延迟，
        // handleNewBlockInPanel 也能检测到并跳过
        this.log(`🔒 [DEBUG] 立即将块 ${blockRefId} 添加到 creatingTabs（防止Orca原生导航触发重复创建）`);
        this.creatingTabs.add(blockRefId);
        
        // 阻止默认行为和事件传播
        // 在捕获阶段就彻底阻止，避免Orca的原生处理
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
        this.log(`🔗 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`);
        this.log(`🔗 [DEBUG] 当前标签页数量: ${this.getCurrentPanelTabs().length}`);
        
        // 异步执行标签页创建
        this.openInNewTab(blockRefId).catch(error => {
          this.error(`[DEBUG] Ctrl+点击创建标签失败:`, error);
          // 如果失败，清除标记
          this.creatingTabs.delete(blockRefId);
        });
        
        return;
      } else {
        this.log(`🔗 [DEBUG] 未能从点击目标获取块引用ID`);
      }
    }
    
    // 如果点击的不是插件相关元素，直接返回，减少干扰
    if (!target.closest('.orca-tabs-plugin')) {
      return;
    }
    
    // 检查是否点击了侧边栏相关元素，如果是则不处理


    if (target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]')) {
      this.log("🔄 检测到侧边栏/面板点击，跳过面板状态检查");
      return;
    }
    
    // 检查是否在拖拽过程中，如果是则不处理
    if (this.isDragging) {
      this.log("🔄 检测到拖拽过程中，跳过面板状态检查");
      return;
    }
    
    // 使用防抖，避免频繁触发 - 增加防抖时间减少干扰
    setTimeout(() => {
      this.debouncedCheckPanelStatus();
    }, 300); // 从100ms增加到300ms
  }

  /**
   * 处理右键菜单事件
   */
  private async handleContextMenuEvent(e: MouseEvent) {
    // 右键菜单事件处理已移除
  }

  // handleKeydownEvent方法已移除，不再监听全局键盘事件

  /**
   * 防抖的面板状态检查
   */
  debouncedCheckPanelStatus() {
    // 首先检查并恢复更新状态
    this.checkAndRecoverUpdateState();
    
    // 清除之前的计时器
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }
    
    // 设置新的计时器
    this.updateDebounceTimer = setTimeout(async () => {
      await this.checkPanelStatusChange();
    }, 50) as any as number; // 50ms防抖
  }

  /**
   * 检查面板状态是否发生变化
   */
  async checkPanelStatusChange() {
    if (this.panelStatusCheckTask) {
      await this.panelStatusCheckTask;
      return;
    }

    this.panelStatusCheckTask = (async () => {

      // 快速检查面板数量是否变化，排除特殊面板
      const allPanels = document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])');
      const currentPanelCount = Array.from(allPanels).filter(panel => {
        const panelId = panel.getAttribute('data-panel-id');
        return panelId && !panelId.startsWith('_'); // 排除特殊面板
      }).length;

      // 如果面板数量没有变化，跳过完整发现
      if (currentPanelCount === this.getPanelIds().length && this.panelDiscoveryCache) {
        const cacheAge = Date.now() - this.panelDiscoveryCache.timestamp;
        if (cacheAge < 3000) { // 缓存3秒内有效
          this.verboseLog("📋 面板数量未变化，跳过面板发现");
          return;
        }
      }

      // 首先重新扫描面板，检查是否有面板被关闭
      const oldPanelIds = [...this.getPanelIds()];
      const oldPersistentPanelId = this.getPanelIds()[0] || null;
      await this.discoverPanels();
      const newPersistentPanelId = this.getPanelIds()[0] || null;

      // 检查面板列表是否发生变化
      const panelListChanged = hasPanelListChanged(oldPanelIds, this.getPanelIds());

      if (panelListChanged) {
        this.log(`📋 面板列表发生变化: ${oldPanelIds.length} -> ${this.getPanelIds().length}`);
        this.log(`📋 旧面板列表: [${oldPanelIds.join(', ')}]`);
        this.log(`📋 新面板列表: [${this.getPanelIds().join(', ')}]`);
        this.log(`📋 持久化面板变更: ${oldPersistentPanelId} -> ${newPersistentPanelId}`);

        // 如果持久化面板发生变化，需要重新扫描标签
        if (oldPersistentPanelId !== newPersistentPanelId) {
          this.log(`🔄 持久化面板已变更: ${oldPersistentPanelId} -> ${newPersistentPanelId}`);
          await this.handlePersistentPanelChange(oldPersistentPanelId, newPersistentPanelId);
        }
      }

      // 检查当前面板是否仍然存在
      if (this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId)) {
        this.log(`🔄 当前面板 ${this.currentPanelId || ''} 已关闭，切换到第一个面板`);
        if (this.getPanelIds().length > 0) {
          this.currentPanelIndex = 0;
          this.currentPanelId = this.getPanelIds()[0];
          this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ''}`);

          // 扫描并更新当前面板的标签数据
          await this.scanCurrentPanelTabs();
          this.debouncedUpdateTabsUI();
        } else {
          this.log(`⚠️ 没有可用的面板`);
          this.currentPanelId = '';
          this.currentPanelIndex = -1;
          this.debouncedUpdateTabsUI();
        }
      }

      // 检查当前活动面板，排除特殊面板
      const activePanel = document.querySelector('.orca-panel.active');
      if (activePanel) {
        const panelId = activePanel.getAttribute('data-panel-id');
        if (panelId && !panelId.startsWith('_') && (panelId !== this.currentPanelId || '' || panelListChanged)) {
          // 面板发生了切换或面板列表发生变化
          const oldIndex = this.currentPanelIndex;
          const newIndex = this.getPanelIds().indexOf(panelId);

          if (newIndex !== -1) {
            this.log(`🔄 检测到面板切换: ${this.currentPanelId || ''} -> ${panelId} (索引: ${oldIndex} -> ${newIndex})`);

            this.currentPanelIndex = newIndex;
            this.currentPanelId = panelId;

            // 扫描并更新当前面板的标签数据
            await this.scanCurrentPanelTabs();
            this.debouncedUpdateTabsUI();
          }
        }
      }
    })();

    try {
      await this.panelStatusCheckTask;
    } finally {
      this.panelStatusCheckTask = null;
    }
  }


  /**
   * 处理持久化面板变更（当需要持久化的面板发生变化时）
   */
  async handlePersistentPanelChange(oldPersistentPanelId: string | null, newPersistentPanelId: string | null) {
    this.log(`🔄 处理持久化面板变更: ${oldPersistentPanelId} -> ${newPersistentPanelId}`);
    
    if (newPersistentPanelId) {
      // 如果新的持久化面板与旧的不同，需要重新扫描
      if (oldPersistentPanelId !== newPersistentPanelId) {
        this.log(`🔍 持久化面板发生变化，重新扫描标签`);
        
        // 检查新持久化面板是否已有标签数据
        const existingTabs = this.panelTabsData[0] || [];
        if (existingTabs.length > 0) {
          this.log(`✅ 新持久化面板 ${newPersistentPanelId} (索引: ${0}) 已有标签数据，直接使用`);
          this.panelTabsData[0] = [...existingTabs];
        } else {
          this.log(`🔍 新持久化面板 ${newPersistentPanelId} (索引: ${0}) 没有标签数据，重新扫描`);
          // 扫描新的持久化面板，创建新的标签
          await this.scanPersistentPanel(newPersistentPanelId);
        }
        
        // 保存新的标签数据
        await this.saveFirstPanelTabs();
        
        // 立即更新UI显示新的标签
        this.log(`🎨 立即更新UI显示新的标签`);
        await this.updateTabsUI();
        
        this.log(`✅ 持久化面板变更处理完成，当前有 ${this.getCurrentPanelTabs().length} 个标签`);
      } else {
        this.log(`✅ 持久化面板未变化，保持现有标签数据`);
      }
    } else {
      // 没有持久化面板，清空标签数据
      this.log(`🗑️ 没有持久化面板，清空标签数据`);
      this.panelTabsData[0] = [];
      await this.saveFirstPanelTabs();
      await this.updateTabsUI();
    }
  }

  /**
   * 扫描持久化面板的标签
   */
  async scanPersistentPanel(panelId: string) {
    const panel = document.querySelector(`.orca-panel[data-panel-id="${panelId}"]`);
    if (!panel) {
      this.warn(`❌ 未找到持久化面板: ${panelId}`);
      return;
    }

    const hideableElements = panel.querySelectorAll('.orca-hideable');
    const newTabs: TabInfo[] = [];
    let order = 0;
    
    // 扫描DOM获取标签信息
    for (const hideable of hideableElements) {
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 获取标签信息
      const tabInfo = await this.getTabInfo(blockId, panelId, order++);
      if (tabInfo) {
        newTabs.push(tabInfo);
      }
    }

    // 更新基于索引的面板标签数据
    this.panelTabsData[0] = [...newTabs];
    this.panelTabsData[0] = [...newTabs];
    this.log(`📋 持久化面板 ${panelId} (索引: ${0}) 扫描并保存了 ${newTabs.length} 个标签页`);
  }

  /**
   * 扫描指定面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描DOM并存储到panelTabsData数组
   */
  async scanPanelTabsByIndex(panelIndex: number, panelId: string) {
    const panel = document.querySelector(`.orca-panel[data-panel-id="${panelId}"]`);
    if (!panel) {
      this.warn(`❌ 未找到面板: ${panelId}`);
      return;
    }

    // 直接查找所有块编辑器，包括隐藏的
    const blockEditors = panel.querySelectorAll('.orca-block-editor[data-block-id]');
    const newTabs: TabInfo[] = [];
    let order = 0;
    
    this.log(`🔍 扫描面板 ${panelId}，找到 ${blockEditors.length} 个块编辑器`);

    // 扫描DOM获取标签信息
    for (const blockEditor of blockEditors) {
      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 获取标签信息
      const tabInfo = await this.getTabInfo(blockId, panelId, order++);
      if (tabInfo) {
        newTabs.push(tabInfo);
        this.log(`📋 找到标签页: ${tabInfo.title} (${blockId})`);
      }
    }

    // 确保panelTabsData数组有足够的大小
    if (panelIndex >= this.panelTabsData.length) {
      this.adjustPanelTabsDataSize();
    }

    // 直接更新对应索引的标签页数据
    this.panelTabsData[panelIndex] = [...newTabs];
    this.log(`📋 面板 ${panelId} (索引: ${panelIndex}) 扫描了 ${newTabs.length} 个标签页`);
    
    // 保存数据（基于位置顺序）
    const storageKey = panelIndex === 0 ? PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS : `panel_${panelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(storageKey, newTabs);
  }
  
  /**
   * 保存指定面板的标签页数据
   */
  private async savePanelTabs(panelId: string, tabs: TabInfo[]) {
    await this.tabStorageService.savePanelTabs(panelId, tabs);
  }
  
  /**
   * 基于存储键保存面板标签页数据
   */
  private async savePanelTabsByKey(storageKey: string, tabs: TabInfo[]) {
    await this.tabStorageService.savePanelTabsByKey(storageKey, tabs);
  }
  
  /**
   * 合并当前聚焦面板的标签页到已加载的数据中
   */
  private async mergeCurrentPanelTabs(panelIndex: number, panelId: string) {
    const panel = document.querySelector(`.orca-panel[data-panel-id="${panelId}"]`);
    if (!panel) {
      this.warn(`❌ 未找到面板: ${panelId}`);
      return;
    }

    // 扫描当前聚焦面板的标签页
    const blockEditors = panel.querySelectorAll('.orca-block-editor[data-block-id]');
    const currentTabs: TabInfo[] = [];
    let order = 0;
    
    this.log(`🔍 扫描当前聚焦面板 ${panelId}，找到 ${blockEditors.length} 个块编辑器`);
    
    for (const blockEditor of blockEditors) {
      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      const tabInfo = await this.getTabInfo(blockId, panelId, order++);
      if (tabInfo) {
        currentTabs.push(tabInfo);
        this.log(`📋 找到当前标签页: ${tabInfo.title} (${blockId})`);
      }
    }
    
    // 获取已加载的数据
    const loadedTabs = this.panelTabsData[panelIndex] || [];
    this.log(`📋 已加载的标签页: ${loadedTabs.length} 个，当前标签页: ${currentTabs.length} 个`);
    
    // 合并逻辑：将当前标签页添加到已加载数据的后面
    const mergedTabs = [...loadedTabs];
    
    // 简单合并：将当前扫描的标签页添加到已保存数据的后面
    for (const currentTab of currentTabs) {
      mergedTabs.push(currentTab);
      this.log(`➕ 添加当前标签页: ${currentTab.title}`);
    }
    
    // 更新数据
    this.panelTabsData[panelIndex] = [...mergedTabs];
    this.log(`📋 合并后标签页总数: ${mergedTabs.length} 个`);
    
    // 注意：不在这里保存，让其他地方的保存逻辑来处理
    // 这样可以避免在初始化时过早保存数据
  }

  /**
   * 扫描当前面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描当前面板并更新panelTabsData数组
   */
  async scanCurrentPanelTabs() {
    if (!this.currentPanelId || '' || this.currentPanelIndex < 0) {
      this.log(`⚠️ 无法扫描标签页，当前面板信息无效`);
      return;
    }

    const panel = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId || ''}"]`);
    if (!panel) {
      this.warn(`❌ 未找到当前面板: ${this.currentPanelId || ''}`);
      return;
    }

    const hideableElements = panel.querySelectorAll('.orca-hideable');
    const newTabs: TabInfo[] = [];
    let order = 0;
    
    // 扫描DOM获取标签信息
    for (const hideable of hideableElements) {
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 获取标签信息
      const tabInfo = await this.getTabInfo(blockId, this.currentPanelId || '', order++);
      if (tabInfo) {
        newTabs.push(tabInfo);
      }
    }

    // 获取当前面板的现有标签数据
    const currentTabs = this.getCurrentPanelTabs();
    
    // 简单合并：直接使用新扫描的标签页
    this.panelTabsData[this.currentPanelIndex] = [...newTabs];
    
    this.log(`📋 面板 ${this.currentPanelId || ''} (索引: ${this.currentPanelIndex}) 扫描了 ${newTabs.length} 个标签页`);
    
    // 保存数据（基于当前面板索引）
    const storageKey = this.currentPanelIndex === 0 ? PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(storageKey, newTabs);
  }

  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(oldFirstPanelId: string, newFirstPanelId: string) {
    this.log(`🔄 处理第一个面板变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
    this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ''}, currentPanelIndex=${this.currentPanelIndex}`);
    
    // 修复: 保存当前面板的标签数据，避免数据丢失
    const currentTabs = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${currentTabs.length} 个标签页`);
    
    // 如果当前面板有标签数据，迁移到firstPanelTabs
    if (currentTabs.length > 0) {
      this.log(`📋 迁移当前面板的 ${currentTabs.length} 个标签页到持久化存储`);
      this.panelTabsData[0] = [...currentTabs];
      
      // 更新持久化面板索引（已简化，不再需要更新）
      this.log(`🔄 持久化面板索引已简化，不再需要更新`);
    } else {
      // 否则清空并重新扫描
      this.log(`🗑️ 当前面板没有标签数据，清空并重新扫描`);
      this.panelTabsData[0] = [];
    await this.scanFirstPanel();
    }
    
    // 保存新的固化标签数据
    await this.saveFirstPanelTabs();
    
    // 立即更新UI显示新的固化标签
    this.log(`🎨 立即更新UI显示新的固化标签`);
    await this.updateTabsUI();
    
    this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`);
    this.log(`✅ 持久化标签页:`, this.getCurrentPanelTabs().map(tab => `${tab.title}(${tab.blockId})`));
  }

  /**
   * 更新UI元素位置
   */
  updateUIPositions() {
    if (this.tabContainer) {
      // 根据布局模式使用正确的位置
      const currentPosition = this.isVerticalMode ? this.verticalPosition : this.position;
      this.tabContainer.style.left = currentPosition.x + 'px';
      this.tabContainer.style.top = currentPosition.y + 'px';
    }
  }

  /**
   * 重置插件缓存
   */
  async resetCache() {
    this.log("🔄 开始重置插件缓存...");
    
    // 清空固化标签数据
    this.panelTabsData[0] = [];
    
    // 清空已关闭标签列表
    this.closedTabs.clear();
    
    // 清空API配置中的缓存数据
    await this.tabStorageService.clearCache();
    
    // 重新扫描第一个面板
    if (this.getPanelIds().length > 0) {
      this.log("🔍 重新扫描第一个面板...");
      await this.scanFirstPanel();
      await this.saveFirstPanelTabs();
    }
    
    // 更新UI
    await this.updateTabsUI();
    
    this.log("✅ 插件缓存重置完成");
  }

  // destroy方法在类的末尾重新实现了更完整的版本

  /**
   * 显示最近关闭的标签页菜单
   */
  async showRecentlyClosedTabsMenu(event?: MouseEvent) {
    if (this.recentlyClosedTabs.length === 0) {
      orca.notify('info', '没有最近关闭的标签页');
      return;
    }

    // 获取鼠标位置
    const position = event ? { x: event.clientX, y: event.clientY } : { x: 0, y: 0 };

    // 创建菜单项
    const menuItems = this.recentlyClosedTabs.map((tab, index) => ({
      label: `${tab.title}`,
      icon: tab.icon || getBlockTypeIcon(tab.blockType || 'default'),
      onClick: () => this.restoreRecentlyClosedTab(tab, index)
    }));

    // 添加清空选项
    menuItems.push({
      label: '清空最近关闭列表',
      icon: 'ti ti-trash',
      onClick: () => this.clearRecentlyClosedTabs()
    });


    // 创建自定义菜单
    this.createRecentlyClosedTabsMenu(menuItems, position);
  }

  /**
   * 创建最近关闭标签页菜单
   */
  createRecentlyClosedTabsMenu(items: Array<{label: string, icon: string, onClick: () => void}>, position: {x: number, y: number}) {
    // 移除现有菜单
    const existingMenu = document.querySelector('.recently-closed-tabs-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (window as any).orca?.state?.themeMode === 'dark';

    const menu = document.createElement('div');
    menu.className = 'recently-closed-tabs-menu';
    // 使用智能菜单定位算法
    const menuWidth = 280;
    const menuHeight = 350;
    const { x: left, y: top } = calculateContextMenuPosition(position.x, position.y, menuWidth, menuHeight);
    
    menu.style.cssText = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: ${menuWidth}px;
      max-height: ${menuHeight}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    items.forEach((item, index) => {
      // 检查是否是分割线
      if (item.label === '---') {
        const separator = document.createElement('div');
        separator.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `;
        menu.appendChild(separator);
        return;
      }

      const menuItem = document.createElement('div');
      menuItem.className = 'recently-closed-menu-item';
      menuItem.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: var(--orca-color-text-1);
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s ease;
        min-height: 24px;
      `;

      // 添加图标
      if (item.icon) {
        const iconElement = document.createElement('div');
        iconElement.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${isDarkMode ? '#cccccc' : '#666'};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        // 检查是否是 Tabler Icon
        if (item.icon.startsWith('ti ti-')) {
          const iElement = document.createElement('i');
          iElement.className = item.icon;
          iconElement.appendChild(iElement);
        } else {
          // 普通文本图标（如emoji）
          iconElement.textContent = item.icon;
        }
        
        menuItem.appendChild(iconElement);
      }

      // 添加文本
      const textElement = document.createElement('span');
      textElement.textContent = item.label;
      textElement.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      menuItem.appendChild(textElement);

      // 悬停效果
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
      });
      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = 'transparent';
      });

      // 点击事件
      menuItem.addEventListener('click', () => {
        item.onClick();
        menu.remove();
      });

      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // 调整菜单位置，确保不超出屏幕
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      menu.style.left = `${viewportWidth - rect.width - 10}px`;
    }
    if (rect.bottom > viewportHeight) {
      menu.style.top = `${viewportHeight - rect.height - 10}px`;
    }

    // 点击外部关闭菜单
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
        document.removeEventListener('contextmenu', closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeMenu);
      document.addEventListener('contextmenu', closeMenu);
    }, 0);
  }

  /**
   * 恢复最近关闭的标签页
   */
  async restoreRecentlyClosedTab(tab: TabInfo, index: number) {
    try {
      // 从最近关闭列表中移除
      this.recentlyClosedTabs.splice(index, 1);
      await this.saveRecentlyClosedTabs();

      // 从已关闭列表中移除（如果存在）
      this.closedTabs.delete(tab.blockId);
      await this.saveClosedTabs();

      // 添加到当前面板
      await this.addTabToPanel(tab.blockId, 'end', true);

      this.log(`🔄 已恢复最近关闭的标签页: "${tab.title}"`);
      orca.notify('success', `已恢复标签页: ${tab.title}`);
    } catch (error) {
      this.error('恢复最近关闭标签页失败:', error);
      orca.notify('error', '恢复标签页失败');
    }
  }

  /**
   * 清空最近关闭的标签页列表
   */
  async clearRecentlyClosedTabs() {
    try {
      this.recentlyClosedTabs = [];
      await this.saveRecentlyClosedTabs();
      this.log('🗑️ 已清空最近关闭的标签页列表');
      orca.notify('success', '已清空最近关闭的标签页列表');
    } catch (error) {
      this.error('清空最近关闭标签页列表失败:', error);
      orca.notify('error', '清空失败');
    }
  }

  /**
   * 显示保存的标签页集合菜单
   */
  async showSavedTabSetsMenu(event?: MouseEvent) {
    if (this.savedTabSets.length === 0) {
      orca.notify('info', '没有保存的标签页集合');
      return;
    }

    // 获取鼠标位置
    const position = event ? { x: event.clientX, y: event.clientY } : { x: 100, y: 100 };

    // 创建菜单项
    const menuItems = [];

    // 如果有上一个标签集合，添加回到上一个标签集合选项
    if (this.previousTabSet && this.previousTabSet.length > 0) {
      menuItems.push({
        label: `回到上一个标签集合 (${this.previousTabSet.length}个标签)`,
        icon: 'ti ti-arrow-left',
        onClick: () => this.restorePreviousTabSet()
      });
      menuItems.push({
        label: '---',
        icon: '',
        onClick: () => {}
      });
    }

    // 添加已保存的标签页集合
    this.savedTabSets.forEach((tabSet, index) => {
      menuItems.push({
        label: `${tabSet.name} (${tabSet.tabs.length}个标签)`,
        icon: tabSet.icon || 'ti ti-bookmark',
        onClick: () => this.loadSavedTabSet(tabSet, index)
      });
    });

    // 添加管理选项
    menuItems.push({
      label: '---',
      icon: '',
      onClick: () => {}
    });
    menuItems.push({
      label: '管理保存的标签页',
      icon: 'ti ti-settings',
      onClick: () => this.manageSavedTabSets()
    });

    // 创建自定义菜单
    this.createRecentlyClosedTabsMenu(menuItems, position);
  }

  /**
   * 显示多标签页保存菜单
   */
  async showMultiTabSavingMenu(event?: MouseEvent) {
    // 获取鼠标位置
    const position = event ? { x: event.clientX, y: event.clientY } : { x: 0, y: 0 };

    // 创建菜单项
    const menuItems = [];

    // 添加保存当前标签页选项
    menuItems.push({
      label: '保存当前标签页',
      icon: 'ti ti-plus',
      onClick: () => this.saveCurrentTabs()
    });

    // 添加分隔符
    if (this.savedTabSets.length > 0) {
      menuItems.push({
        label: '---',
        icon: '',
        onClick: () => {}
      });

      // 添加已保存的标签页集合
      this.savedTabSets.forEach((tabSet, index) => {
        menuItems.push({
          label: `${tabSet.name} (${tabSet.tabs.length}个标签)`,
          icon: 'ti ti-bookmark',
          onClick: () => this.loadSavedTabSet(tabSet, index)
        });
      });

      // 添加管理选项
      menuItems.push({
        label: '---',
        icon: '',
        onClick: () => {}
      });
      menuItems.push({
        label: '管理保存的标签页',
        icon: 'ti ti-settings',
        onClick: () => this.manageSavedTabSets()
      });
    }

    // 创建自定义菜单
    this.createMultiTabSavingMenu(menuItems, position);
  }

  /**
   * 创建多标签页保存菜单
   */
  createMultiTabSavingMenu(items: Array<{label: string, icon: string, onClick: () => void}>, position: {x: number, y: number}) {
    // 移除现有菜单
    const existingMenu = document.querySelector('.multi-tab-saving-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (window as any).orca?.state?.themeMode === 'dark';

    const menu = document.createElement('div');
    menu.className = 'multi-tab-saving-menu';
    // 使用智能菜单定位算法
    const menuWidth = 300;
    const menuHeight = 400;
    const { x: left, y: top } = calculateContextMenuPosition(position.x, position.y, menuWidth, menuHeight);
    
    menu.style.cssText = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: ${menuWidth}px;
      max-height: ${menuHeight}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    items.forEach((item, index) => {
      if (item.label === '---') {
        // 分隔符
        const separator = document.createElement('div');
        separator.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `;
        menu.appendChild(separator);
        return;
      }

      const menuItem = document.createElement('div');
      menuItem.className = 'multi-tab-saving-menu-item';
      menuItem.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: var(--orca-color-text-1);
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s ease;
        min-height: 24px;
      `;

      // 添加图标
      if (item.icon) {
        const iconElement = document.createElement('div');
        iconElement.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${isDarkMode ? '#cccccc' : '#666'};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        
        // 检查是否是 Tabler Icon
        if (item.icon.startsWith('ti ti-')) {
          const iElement = document.createElement('i');
          iElement.className = item.icon;
          iconElement.appendChild(iElement);
        } else {
          // 普通文本图标（如emoji）
          iconElement.textContent = item.icon;
        }
        
        menuItem.appendChild(iconElement);
      }

      // 添加文本
      const textElement = document.createElement('span');
      textElement.textContent = item.label;
      textElement.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;
      menuItem.appendChild(textElement);

      // 悬停效果
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
      });
      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = 'transparent';
      });

      // 点击事件
      menuItem.addEventListener('click', () => {
        item.onClick();
        menu.remove();
      });

      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // 调整菜单位置，确保不超出屏幕
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      menu.style.left = `${viewportWidth - rect.width - 10}px`;
    }
    if (rect.bottom > viewportHeight) {
      menu.style.top = `${viewportHeight - rect.height - 10}px`;
    }

    // 点击外部关闭菜单
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
        document.removeEventListener('contextmenu', closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeMenu);
      document.addEventListener('contextmenu', closeMenu);
    }, 0);
  }

  /**
   * 保存当前标签页
   */
  async saveCurrentTabs() {
    const currentTabs = this.getCurrentPanelTabs();
    if (currentTabs.length === 0) {
      orca.notify('warn', '当前没有标签页可以保存');
      return;
    }

    // 创建自定义输入对话框
    this.showSaveTabSetDialog();
  }

  /**
   * 显示保存标签页集合的输入对话框
   */
  showSaveTabSetDialog() {
    // 移除现有对话框
    const existingDialog = document.querySelector('.save-tabset-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.className = 'save-tabset-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 450px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: auto;
    `;
    
    // 阻止对话框内部点击事件冒泡
    dialog.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `;
    header.textContent = '保存标签页集合';
    dialog.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 0 20px;
    `;

    // 添加模式选择按钮
    const modeContainer = document.createElement('div');
    modeContainer.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    `;

    const createNewBtn = document.createElement('button');
    createNewBtn.className = 'orca-button orca-button-secondary';
    createNewBtn.textContent = '创建新标签组';
    createNewBtn.style.cssText = `flex: 1;`;

    const updateExistingBtn = document.createElement('button');
    updateExistingBtn.className = 'orca-button';
    updateExistingBtn.textContent = '更新已有标签组';
    updateExistingBtn.style.cssText = `flex: 1;`;

    let isUpdateMode = false;

    const switchToCreateMode = () => {
      isUpdateMode = false;
      createNewBtn.className = 'orca-button orca-button-secondary';
      createNewBtn.style.cssText = `flex: 1;`;
      updateExistingBtn.className = 'orca-button';
      updateExistingBtn.style.cssText = `flex: 1;`;
      inputContainer.style.display = 'block';
      dropdownContainer.style.display = 'none';
      updateSaveButtonText();
    };

    const switchToUpdateMode = () => {
      isUpdateMode = true;
      updateExistingBtn.className = 'orca-button orca-button-secondary';
      updateExistingBtn.style.cssText = `flex: 1;`;
      createNewBtn.className = 'orca-button';
      createNewBtn.style.cssText = `flex: 1;`;
      inputContainer.style.display = 'none';
      dropdownContainer.style.display = 'block';
      updateSaveButtonText();
    };

    createNewBtn.onclick = switchToCreateMode;
    updateExistingBtn.onclick = switchToUpdateMode;

    modeContainer.appendChild(createNewBtn);
    modeContainer.appendChild(updateExistingBtn);
    content.appendChild(modeContainer);

    // 创建新标签组的输入容器
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      display: block;
    `;

    const label = document.createElement('label');
    label.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `;
    label.textContent = '请输入新标签页集合名称:';
    inputContainer.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = `标签页集合 ${this.savedTabSets.length + 1}`;
    input.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      user-select: text;
    `;
    input.addEventListener('focus', () => {
      input.style.borderColor = 'var(--orca-color-primary-5)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#ddd';
    });
    
    // 确保输入框可以接收输入
    input.addEventListener('input', (e) => {
      // 输入框输入处理
    });
    inputContainer.appendChild(input);

    // 更新已有标签组的下拉容器
    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.cssText = `
      display: none;
    `;

    const dropdownLabel = document.createElement('label');
    dropdownLabel.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `;
    dropdownLabel.textContent = '请选择要更新的标签页集合:';
    dropdownContainer.appendChild(dropdownLabel);

    const dropdown = document.createElement('select');
    dropdown.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      background: var(--orca-color-bg-1);
    `;
    dropdown.addEventListener('focus', () => {
      dropdown.style.borderColor = 'var(--orca-color-primary-5)';
    });
    dropdown.addEventListener('blur', () => {
      dropdown.style.borderColor = '#ddd';
    });

    // 添加选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '请选择标签页集合...';
    dropdown.appendChild(defaultOption);

    this.savedTabSets.forEach((tabSet, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = `${tabSet.name} (${tabSet.tabs.length}个标签)`;
      dropdown.appendChild(option);
    });

    dropdownContainer.appendChild(dropdown);

    content.appendChild(inputContainer);
    content.appendChild(dropdownContainer);

    dialog.appendChild(content);

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'orca-button';
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = ``;
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.backgroundColor = '#4b5563';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.backgroundColor = '#6b7280';
    });
    cancelBtn.onclick = () => {
      dialog.remove();
      // 重新显示管理页面
      this.manageSavedTabSets();
    };

    const saveBtn = document.createElement('button');
    saveBtn.className = 'orca-button orca-button-primary';
    saveBtn.textContent = '保存';
    saveBtn.style.cssText = ``;
    saveBtn.addEventListener('mouseenter', () => {
      saveBtn.style.backgroundColor = '#2563eb';
    });
    saveBtn.addEventListener('mouseleave', () => {
      saveBtn.style.backgroundColor = 'var(--orca-color-primary-5)';
    });

    // 更新按钮文本的函数
    const updateSaveButtonText = () => {
      saveBtn.textContent = isUpdateMode ? '更新' : '保存';
    };

    saveBtn.onclick = async () => {
      if (isUpdateMode) {
        // 更新模式：检查是否选择了标签组
        const selectedIndex = parseInt(dropdown.value);
        if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= this.savedTabSets.length) {
          orca.notify('warn', '请选择要更新的标签页集合');
          return;
        }
        
        dialog.remove();
        await this.performUpdateTabSet(selectedIndex);
      } else {
        // 创建模式：检查输入名称
      const name = input.value.trim();
      if (!name) {
        orca.notify('warn', '请输入名称');
        return;
      }
      
      dialog.remove();
      await this.performSaveTabSet(name);
      }
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);
    dialog.appendChild(footer);

    document.body.appendChild(dialog);

    // 聚焦到输入框
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    // 回车键保存
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelBtn.click();
      }
    });

    // 点击外部关闭对话框
    const closeDialog = (e: MouseEvent) => {
      if (!dialog.contains(e.target as Node)) {
        dialog.remove();
        document.removeEventListener('click', closeDialog);
      }
    };

    // 延迟添加点击外部关闭事件，避免干扰输入框
    setTimeout(() => {
      document.addEventListener('click', closeDialog);
    }, 200);
  }

  /**
   * 执行保存标签页集合
   */
  async performSaveTabSet(name: string) {
    try {
      const currentTabs = this.getCurrentPanelTabs();
      const tabSet: SavedTabSet = {
        id: `tabset_${Date.now()}`,
        name: name,
        tabs: [...currentTabs], // 深拷贝当前标签页
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      this.savedTabSets.push(tabSet);
      await this.saveSavedTabSets();

      this.log(`💾 已保存标签页集合: "${name}" (${currentTabs.length}个标签)`);
      orca.notify('success', `已保存标签页集合: ${name}`);
    } catch (error) {
      this.error('保存标签页集合失败:', error);
      orca.notify('error', '保存失败');
    }
  }

  /**
   * 执行更新已有标签页集合
   */
  async performUpdateTabSet(index: number) {
    try {
      const currentTabs = this.getCurrentPanelTabs();
      const tabSet = this.savedTabSets[index];
      
      if (!tabSet) {
        orca.notify('error', '标签页集合不存在');
        return;
      }

      // 更新标签页集合
      tabSet.tabs = [...currentTabs]; // 深拷贝当前标签页
      tabSet.updatedAt = Date.now();

      await this.saveSavedTabSets();

      this.log(`🔄 已更新标签页集合: "${tabSet.name}" (${currentTabs.length}个标签)`);
      orca.notify('success', `已更新标签页集合: ${tabSet.name}`);
    } catch (error) {
      this.error('更新标签页集合失败:', error);
      orca.notify('error', '更新失败');
    }
  }

  /**
   * 显示添加到已有标签组的对话框
   */
  showAddToTabGroupDialog(tab: TabInfo) {
    // 移除现有对话框
    const existingDialog = document.querySelector('.add-to-tabgroup-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.className = 'add-to-tabgroup-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: auto;
    `;
    
    // 阻止对话框内部点击事件冒泡
    dialog.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `;
    header.textContent = '添加到已有标签组';
    dialog.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 0 20px;
    `;

    const label = document.createElement('label');
    label.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `;
    label.textContent = `将标签页 "${tab.title}" 添加到:`;
    content.appendChild(label);

    const dropdown = document.createElement('select');
    dropdown.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      background: var(--orca-color-bg-1);
    `;
    dropdown.addEventListener('focus', () => {
      dropdown.style.borderColor = 'var(--orca-color-primary-5)';
    });
    dropdown.addEventListener('blur', () => {
      dropdown.style.borderColor = '#ddd';
    });

    // 添加选项
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '请选择标签组...';
    dropdown.appendChild(defaultOption);

    this.savedTabSets.forEach((tabSet, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = `${tabSet.name} (${tabSet.tabs.length}个标签)`;
      dropdown.appendChild(option);
    });

    content.appendChild(dropdown);
    dialog.appendChild(content);

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'orca-button';
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = ``;
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.backgroundColor = '#4b5563';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.backgroundColor = '#6b7280';
    });
    cancelBtn.onclick = () => {
      dialog.remove();
      // 重新显示管理页面
      this.manageSavedTabSets();
    };

    const addBtn = document.createElement('button');
    addBtn.className = 'orca-button orca-button-primary';
    addBtn.textContent = '添加';
    addBtn.style.cssText = ``;
    addBtn.addEventListener('mouseenter', () => {
      addBtn.style.backgroundColor = '#2563eb';
    });
    addBtn.addEventListener('mouseleave', () => {
      addBtn.style.backgroundColor = 'var(--orca-color-primary-5)';
    });
    addBtn.onclick = async () => {
      const selectedIndex = parseInt(dropdown.value);
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= this.savedTabSets.length) {
        orca.notify('warn', '请选择要添加到的标签组');
        return;
      }
      
      dialog.remove();
      await this.addTabToGroup(tab, selectedIndex);
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(addBtn);
    dialog.appendChild(footer);

    document.body.appendChild(dialog);

    // 聚焦到下拉框
    setTimeout(() => {
      dropdown.focus();
    }, 100);

    // 回车键添加
    dropdown.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addBtn.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelBtn.click();
      }
    });

    // 点击外部关闭对话框
    const closeDialog = (e: MouseEvent) => {
      if (!dialog.contains(e.target as Node)) {
        dialog.remove();
        document.removeEventListener('click', closeDialog);
      }
    };

    // 延迟添加点击外部关闭事件，避免干扰下拉框
    setTimeout(() => {
      document.addEventListener('click', closeDialog);
    }, 200);
  }

  /**
   * 将标签页添加到指定标签组
   */
  async addTabToGroup(tab: TabInfo, groupIndex: number) {
    try {
      const tabSet = this.savedTabSets[groupIndex];
      
      if (!tabSet) {
        orca.notify('error', '标签组不存在');
        return;
      }

      // 检查标签页是否已经在该组中
      const existingTab = tabSet.tabs.find(t => t.blockId === tab.blockId);
      if (existingTab) {
        orca.notify('warn', '该标签页已在此标签组中');
        return;
      }

      // 添加标签页到组中
      tabSet.tabs.push({...tab}); // 深拷贝标签页信息
      tabSet.updatedAt = Date.now();

      await this.saveSavedTabSets();

      this.log(`➕ 已将标签页 "${tab.title}" 添加到标签组: "${tabSet.name}"`);
      orca.notify('success', `已添加到标签组: ${tabSet.name}`);
    } catch (error) {
      this.error('添加标签页到标签组失败:', error);
      orca.notify('error', '添加失败');
    }
  }


  /**
   * 加载保存的标签页集合
   */
  async loadSavedTabSet(tabSet: SavedTabSet, index: number) {
    try {
      // 保存当前标签集合到上一个标签集合
      const currentTabs = this.getCurrentPanelTabs();
      this.previousTabSet = [...currentTabs]; // 深拷贝当前标签集合
      
      // 清空当前面板的标签页
      currentTabs.length = 0;

      // 加载保存的标签页
      for (const tab of tabSet.tabs) {
        // 更新面板ID为当前面板
        const updatedTab = { ...tab, panelId: this.currentPanelId || '' };
        currentTabs.push(updatedTab);
      }

      // 同步更新存储数组
      this.syncCurrentTabsToStorage(currentTabs);
      
      // 保存当前面板数据
       await this.saveCurrentPanelTabs();

      // 更新UI
      this.debouncedUpdateTabsUI();

      // 更新保存时间
      tabSet.updatedAt = Date.now();
      await this.saveSavedTabSets();

      this.log(`🔄 已加载标签页集合: "${tabSet.name}" (${tabSet.tabs.length}个标签)`);
      orca.notify('success', `已加载标签页集合: ${tabSet.name}`);
    } catch (error) {
      this.error('加载标签页集合失败:', error);
      orca.notify('error', '加载失败');
    }
  }

  /**
   * 回到上一个标签集合
   */
  async restorePreviousTabSet() {
    if (!this.previousTabSet || this.previousTabSet.length === 0) {
      orca.notify('info', '没有上一个标签集合');
      return;
    }

    try {
      // 保存当前标签集合到上一个标签集合（用于再次切换）
      const currentTabs = this.getCurrentPanelTabs();
      const tempPreviousTabSet = [...currentTabs];
      
      // 清空当前面板的标签页
      currentTabs.length = 0;

      // 恢复上一个标签集合
      for (const tab of this.previousTabSet) {
        // 更新面板ID为当前面板
        const updatedTab = { ...tab, panelId: this.currentPanelId || '' };
        currentTabs.push(updatedTab);
      }

      // 交换当前和上一个标签集合
      this.previousTabSet = tempPreviousTabSet;

      // 同步更新存储数组
      this.syncCurrentTabsToStorage(currentTabs);
      
      // 保存当前面板数据
       await this.saveCurrentPanelTabs();

      // 更新UI
      this.debouncedUpdateTabsUI();

      this.log(`🔄 已回到上一个标签集合 (${this.previousTabSet.length}个标签)`);
      orca.notify('success', '已回到上一个标签集合');
    } catch (error) {
      this.error('回到上一个标签集合失败:', error);
      orca.notify('error', '恢复失败');
    }
  }

  /**
   * 重新渲染可排序的标签列表
   */
  renderSortableTabs(container: HTMLElement, tabs: TabInfo[], tabSet?: SavedTabSet) {
    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') ||
                      (window as any).orca?.state?.themeMode === 'dark';
    
    // 清空容器
    container.innerHTML = '';
    
    // 全局拖拽状态管理
    let draggedTabIndex = -1;
    let draggedTabElement: HTMLElement | null = null;
    
    
    // 删除标签
    const deleteTab = (index: number) => {
      if (index >= 0 && index < tabs.length) {
        const deletedTab = tabs[index];
        tabs.splice(index, 1);
        
        // 重新渲染列表
        this.renderSortableTabs(container, tabs);
        
        // 更新原始数据
        const tabSet = this.savedTabSets.find(ts => ts.tabs === tabs);
        if (tabSet) {
          tabSet.tabs = [...tabs];
          tabSet.updatedAt = Date.now();
          
          // 保存更改
          this.saveSavedTabSets();
          
          orca.notify('success', `已删除标签: ${deletedTab.title}`);
        }
      }
    };
    
    
    tabs.forEach((tab, index) => {
      const tabItem = document.createElement('div');
      tabItem.className = 'sortable-tab-item';
      tabItem.draggable = true;
      tabItem.dataset.index = index.toString();
      tabItem.dataset.tabId = tab.blockId;
      tabItem.style.cssText = `
        display: flex;
        align-items: center;
        padding: .175rem var(--orca-spacing-md);
        border: 1px solid #e0e0e0;
        border-radius: var(--orca-radius-md);
        margin-bottom: 4px;
        background: var(--orca-color-bg-1);
        cursor: move;
        transition: all 0.2s;
        user-select: none;
        position: relative;
      `;

      // 添加拖拽图标
      const dragHandle = document.createElement('div');
      dragHandle.style.cssText = `
        margin-right: 8px;
        color: #999;
        font-size: 12px;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 20px;
      `;
      dragHandle.innerHTML = '⋮⋮';
      tabItem.appendChild(dragHandle);

      // 添加图标
      if (tab.icon) {
        const iconElement = document.createElement('div');
        iconElement.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${isDarkMode ? '#cccccc' : '#666'};
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `;
        
        if (tab.icon.startsWith('ti ti-')) {
          const iElement = document.createElement('i');
          iElement.className = tab.icon;
          iconElement.appendChild(iElement);
        } else {
          iconElement.textContent = tab.icon;
        }
        
        tabItem.appendChild(iconElement);
      }

      // 添加标签信息
      const tabInfo = document.createElement('div');
      tabInfo.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 20px;
      `;
      
      // 构建标签信息HTML
      let tabInfoHTML = `
        <div style="font-size: 14px; color: var(--orca-color-text-1); font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${tab.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${tab.blockId}</div>
      `;
      
      tabInfo.innerHTML = tabInfoHTML;
      tabItem.appendChild(tabInfo);

      // 添加操作按钮容器
      const actionContainer = document.createElement('div');
      actionContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;

      // 添加序号
      const orderNumber = document.createElement('div');
      orderNumber.style.cssText = `
        font-size: 12px;
        color: #999;
        background: rgba(0, 0, 0, 0.1);
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      `;
      orderNumber.textContent = (index + 1).toString();
      actionContainer.appendChild(orderNumber);

      tabItem.appendChild(actionContainer);

      // 拖拽开始事件
      tabItem.addEventListener('dragstart', (e) => {
        console.log('拖拽开始，索引:', index);
        draggedTabIndex = index;
        draggedTabElement = tabItem;
        
        // 设置拖拽数据
        e.dataTransfer!.setData('text/plain', index.toString());
        e.dataTransfer!.setData('application/json', JSON.stringify(tab));
        e.dataTransfer!.effectAllowed = 'move';
        
        // 视觉反馈
        tabItem.style.opacity = '0.5';
        tabItem.style.transform = 'rotate(2deg)';
        
      });

      // 拖拽结束事件
      tabItem.addEventListener('dragend', (e) => {
        // 恢复视觉状态
        tabItem.style.opacity = '1';
        tabItem.style.transform = 'rotate(0deg)';
        
        
        // 重置状态
        draggedTabIndex = -1;
        draggedTabElement = null;
      });

      // 拖拽悬停事件
      tabItem.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
        
        // 只处理其他标签的拖拽
        if (draggedTabIndex !== -1 && draggedTabIndex !== index) {
          tabItem.style.borderColor = 'var(--orca-color-primary-5)';
          tabItem.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        }
      });

      // 拖拽离开事件
      tabItem.addEventListener('dragleave', (e) => {
        tabItem.style.borderColor = '#e0e0e0';
        tabItem.style.backgroundColor = 'var(--orca-color-bg-1)';
      });

      // 放置事件
      tabItem.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const draggedIndex = parseInt(e.dataTransfer!.getData('text/plain'));
        const targetIndex = index;
        
        // 恢复样式
        tabItem.style.borderColor = '#e0e0e0';
        tabItem.style.backgroundColor = 'var(--orca-color-bg-1)';
        
        // 执行位置交换
        if (draggedIndex !== targetIndex && draggedIndex >= 0) {
          const draggedTab = tabs[draggedIndex];
          tabs.splice(draggedIndex, 1);
          tabs.splice(targetIndex, 0, draggedTab);
          
          // 重新渲染排序后的列表
          this.renderSortableTabs(container, tabs);
          
          // 更新原始数据
          const tabSet = this.savedTabSets.find(ts => ts.tabs === tabs);
          if (tabSet) {
            tabSet.tabs = [...tabs];
            tabSet.updatedAt = Date.now();
            
            // 保存更改
            this.saveSavedTabSets();
            
            orca.notify('success', '标签顺序已更新');
          }
        }
      });

      // 悬停效果
      tabItem.addEventListener('mouseenter', () => {
        if (draggedTabIndex === -1) {
          tabItem.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
          tabItem.style.borderColor = 'var(--orca-color-primary-5)';
        }
      });

      tabItem.addEventListener('mouseleave', () => {
        if (draggedTabIndex === -1) {
          tabItem.style.backgroundColor = 'var(--orca-color-bg-1)';
          tabItem.style.borderColor = '#e0e0e0';
        }
      });

      container.appendChild(tabItem);
    });

  }


  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 工作区功能 - Workspace Management */
  /* ———————————————————————————————————————————————————————————————————————————— */

  /**
   * 加载工作区数据
   */
  private async loadWorkspaces() {
    const { workspaces, enableWorkspaces } = await this.tabStorageService.loadWorkspaces();
    this.workspaces = workspaces;
    this.enableWorkspaces = enableWorkspaces;
    
    // 页面刷新后不自动加载当前工作区，重置为默认状态
    await this.clearCurrentWorkspace();
    
    // 加载保存的标签页组数据，如果存在则自动恢复
    const tabsBeforeWorkspace = await this.tabStorageService.loadTabsBeforeWorkspace();
    if (tabsBeforeWorkspace && tabsBeforeWorkspace.length > 0) {
      this.tabsBeforeWorkspace = tabsBeforeWorkspace;
      this.log(`📁 发现保存的标签页组数据: ${this.tabsBeforeWorkspace.length}个标签页，将在初始化后恢复`);
      
      // 标记需要恢复标签页组
      this.shouldRestoreTabsBeforeWorkspace = true;
    }
  }

  /**
   * 保存工作区数据
   */
  private async saveWorkspaces() {
    await this.tabStorageService.saveWorkspaces(this.workspaces, this.currentWorkspace, this.enableWorkspaces);
  }

  /**
   * 恢复标签页组但不保存到持久化存储
   * 用于退出工作区时恢复原始标签页组
   */
  private async restoreTabsWithoutSaving(tabs: TabInfo[]) {
    try {
      // 清空当前标签页数据
      this.panelTabsData[0] = [];
      this.panelTabsData[1] = [];

      // 重新获取每个标签页的最新信息
      const updatedTabs: TabInfo[] = [];
      for (const tab of tabs) {
        try {
          // 重新获取标签页信息，确保包含最新的块类型和图标
          const updatedTab = await this.getTabInfo(tab.blockId, this.currentPanelId || '', updatedTabs.length);
          if (updatedTab) {
            // 保留原有的一些重要信息
            updatedTab.isPinned = tab.isPinned;
            updatedTab.order = tab.order;
            updatedTab.scrollPosition = tab.scrollPosition;
            updatedTabs.push(updatedTab);
          } else {
            // 如果无法获取最新信息，使用原始数据
            updatedTabs.push(tab);
          }
        } catch (error) {
          this.warn(`无法更新标签页信息 ${tab.title}:`, error);
          // 如果更新失败，使用原始数据
          updatedTabs.push(tab);
        }
      }

      // 设置到第一个面板
      this.panelTabsData[0] = updatedTabs;
      
      // 更新UI显示，但不保存到持久化存储
      await this.updateTabsUI();
      
      this.log(`📋 已恢复标签页组，共 ${updatedTabs.length} 个标签（未保存到持久化存储）`);
    } catch (error) {
      this.error("恢复标签页组失败:", error);
      throw error;
    }
  }

  /**
   * 清除当前工作区状态
   */
  private async clearCurrentWorkspace() {
    this.currentWorkspace = null;
    await this.tabStorageService.clearCurrentWorkspace();
  }

  /**
   * 退出当前工作区
   */
  private async exitWorkspace() {
    try {
      if (!this.currentWorkspace) {
        orca.notify('warn', '当前没有工作区');
        return;
      }

      // 使用自定义确认对话框
      const confirmed = await this.showExitWorkspaceConfirmDialog();
      if (!confirmed) {
        return;
      }

      // 清除当前工作区状态
      await this.clearCurrentWorkspace();
      
      // 保存工作区配置
      await this.saveWorkspaces();

      // 如果有保存的标签页组，恢复到进入工作区之前的状态
      if (this.tabsBeforeWorkspace && this.tabsBeforeWorkspace.length > 0) {
        this.log(`🔄 恢复到进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`);
        
        // 直接恢复标签页组，不保存到持久化存储
        await this.restoreTabsWithoutSaving(this.tabsBeforeWorkspace);
        
        // 清除保存的标签页组（内存和持久化存储）
        this.tabsBeforeWorkspace = null;
        await this.tabStorageService.clearTabsBeforeWorkspace();
        
        orca.notify('success', '已退出工作区并恢复之前的标签页组');
      } else {
        orca.notify('success', '已退出工作区');
      }

      this.log(`🚪 已退出工作区`);
    } catch (error) {
      this.error("退出工作区失败:", error);
      orca.notify('error', '退出工作区失败');
    }
  }

  /**
   * 显示退出工作区确认对话框
   */
  private async showExitWorkspaceConfirmDialog(): Promise<boolean> {
    return new Promise((resolve) => {
      // 移除现有对话框
      const existingDialog = document.querySelector('.exit-workspace-confirm-dialog');
      if (existingDialog) {
        existingDialog.remove();
      }

      // 创建对话框
      const dialog = document.createElement('div');
      dialog.className = 'exit-workspace-confirm-dialog';
      dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--orca-color-bg-1);
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-lg);
        box-shadow: var(--orca-shadow-dialog);
        z-index: ${this.getNextDialogZIndex()};
        min-width: 400px;
        max-width: 500px;
        padding: var(--orca-spacing-lg);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      `;

      // 标题
      const title = document.createElement('div');
      title.style.cssText = `
        font-size: 18px;
        font-weight: 600;
        color: var(--orca-color-text-1);
        margin-bottom: var(--orca-spacing-md);
      `;
      title.textContent = '退出工作区';

      // 消息
      const message = document.createElement('div');
      message.style.cssText = `
        font-size: 14px;
        color: var(--orca-color-text-2);
        line-height: 1.5;
        margin-bottom: var(--orca-spacing-lg);
      `;
      message.textContent = this.tabsBeforeWorkspace && this.tabsBeforeWorkspace.length > 0 
        ? '确定要退出当前工作区吗？退出后将恢复到进入工作区之前的标签页组。'
        : '确定要退出当前工作区吗？退出后当前工作区的标签页将不会保存。';

      // 按钮容器
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: var(--orca-spacing-sm);
        justify-content: flex-end;
      `;

      // 取消按钮
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '取消';
      cancelButton.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-bg-1);
        color: var(--orca-color-text-1);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `;
      cancelButton.addEventListener('click', () => {
        dialog.remove();
        resolve(false);
      });

      // 确认按钮
      const confirmButton = document.createElement('button');
      confirmButton.textContent = '确认';
      confirmButton.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-primary);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-primary);
        color: var(--orca-color-text-on-primary);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `;
      confirmButton.addEventListener('click', () => {
        dialog.remove();
        resolve(true);
      });

      // 添加悬停效果
      cancelButton.addEventListener('mouseenter', () => {
        cancelButton.style.backgroundColor = 'var(--orca-color-menu-highlight)';
      });
      cancelButton.addEventListener('mouseleave', () => {
        cancelButton.style.backgroundColor = 'var(--orca-color-bg-1)';
      });

      confirmButton.addEventListener('mouseenter', () => {
        confirmButton.style.opacity = '0.9';
      });
      confirmButton.addEventListener('mouseleave', () => {
        confirmButton.style.opacity = '1';
      });

      // 组装对话框
      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(confirmButton);
      dialog.appendChild(title);
      dialog.appendChild(message);
      dialog.appendChild(buttonContainer);

      document.body.appendChild(dialog);

      // 点击外部关闭对话框
      const handleClickOutside = (e: MouseEvent) => {
        if (!dialog.contains(e.target as Node)) {
          dialog.remove();
          document.removeEventListener('click', handleClickOutside);
          resolve(false);
        }
      };
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
    });
  }

  /**
   * 保存当前标签页为工作区
   */
  async saveCurrentWorkspace() {
    if (!this.enableWorkspaces) {
      orca.notify('warn', '工作区功能已禁用');
      return;
    }

    const currentTabs = this.getCurrentPanelTabs();
    if (currentTabs.length === 0) {
      orca.notify('warn', '当前没有标签页可保存');
      return;
    }

    this.showSaveWorkspaceDialog();
  }

  /**
   * 显示保存工作区对话框
   */
  private showSaveWorkspaceDialog() {
    // 移除现有对话框
    const existingDialog = document.querySelector('.save-workspace-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (window as any).orca?.state?.themeMode === 'dark';

    const dialog = document.createElement('div');
    dialog.className = 'save-workspace-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      max-width: 90vw;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 20px;
    `;

    // 标题
    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${isDarkMode ? '#ffffff' : '#333'};
      margin-bottom: 16px;
      text-align: center;
    `;
    title.textContent = '保存工作区';

    // 工作区名称输入
    const nameLabel = document.createElement('div');
    nameLabel.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${isDarkMode ? '#ffffff' : '#333'};
      margin-bottom: 8px;
    `;
    nameLabel.textContent = '工作区名称:';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = '请输入工作区名称...';
    nameInput.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      margin-bottom: 12px;
      background: var(--orca-color-bg-1);
      color: ${isDarkMode ? '#ffffff' : '#333'};
    `;

    // 工作区描述输入
    const descLabel = document.createElement('div');
    descLabel.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${isDarkMode ? '#ffffff' : '#333'};
      margin-bottom: 8px;
    `;
    descLabel.textContent = '工作区描述 (可选):';

    const descInput = document.createElement('textarea');
    descInput.placeholder = '请输入工作区描述...';
    descInput.style.cssText = `
      width: 100%;
      height: 60px;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 16px;
      background: var(--orca-color-bg-1);
      color: ${isDarkMode ? '#ffffff' : '#333'};
    `;

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;

    // 取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-bg-1);
      color: ${isDarkMode ? '#999' : '#666'};
      cursor: pointer;
      font-size: 14px;
    `;
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = () => {
      dialog.remove();
      // 重新显示工作区菜单
      this.showWorkspaceMenu();
    };

    // 保存按钮
    const saveBtn = document.createElement('button');
    saveBtn.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: none;
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-primary-5);
      color: white;
      cursor: pointer;
      font-size: 14px;
    `;
    saveBtn.textContent = '保存';
    saveBtn.onclick = async () => {
      const name = nameInput.value.trim();
      if (!name) {
        orca.notify('warn', '请输入工作区名称');
        return;
      }

      // 检查名称是否已存在
      if (this.workspaces.some(w => w.name === name)) {
        orca.notify('warn', '工作区名称已存在');
        return;
      }

      await this.performSaveWorkspace(name, descInput.value.trim());
      dialog.remove();
    };

    // 组装对话框
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(saveBtn);
    
    content.appendChild(title);
    content.appendChild(nameLabel);
    content.appendChild(nameInput);
    content.appendChild(descLabel);
    content.appendChild(descInput);
    content.appendChild(buttonContainer);
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);

    // 聚焦到输入框
    nameInput.focus();

    // 点击外部关闭对话框
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    });

    // ESC键关闭对话框
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dialog.remove();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
  }

  /**
   * 执行保存工作区
   */
  private async performSaveWorkspace(name: string, description: string) {
    try {
      // 工作区保存时，总是使用第一个面板的数据
      const currentTabs = this.getCurrentPanelTabs();
      const currentActiveTab = this.getCurrentActiveTab();
      
      const workspace: Workspace = {
        id: `workspace_${Date.now()}`,
        name,
        tabs: currentTabs,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: description || undefined,
        lastActiveTabId: currentActiveTab ? currentActiveTab.blockId : undefined
      };

      this.workspaces.push(workspace);
      await this.saveWorkspaces();

      this.log(`💾 工作区已保存: "${name}" (${currentTabs.length}个标签)`);
      orca.notify('success', `工作区已保存: ${name}`);
    } catch (error) {
      this.error("保存工作区失败:", error);
      orca.notify('error', '保存工作区失败');
    }
  }

  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(event?: MouseEvent) {
    if (!this.enableWorkspaces) {
      orca.notify('warn', '工作区功能已禁用');
      return;
    }

    // 移除现有菜单
    const existingMenu = document.querySelector('.workspace-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (window as any).orca?.state?.themeMode === 'dark';

    const menu = document.createElement('div');
    menu.className = 'workspace-menu';
    // 使用智能菜单定位算法
    const menuWidth = 280;
    const menuHeight = 400;
    const position = event ? { x: event.clientX, y: event.clientY } : { x: 20, y: 60 };
    const { x: left, y: top } = calculateContextMenuPosition(position.x, position.y, menuWidth, menuHeight);
    
    menu.style.cssText = `
      position: fixed;
      left: ${left}px;
      top: ${top}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: ${this.getNextDialogZIndex()};
      min-width: 200px;
      padding: var(--orca-spacing-sm);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    // 菜单标题
    const title = document.createElement('div');
    title.style.cssText = `
      padding: var(--orca-spacing-sm);
      border-bottom: 1px solid var(--orca-color-border);
      font-size: 14px;
      font-weight: 600;
      color: var(--orca-color-text-1);
    `;
    title.textContent = '工作区';

    // 保存当前工作区选项
    const saveCurrentItem = document.createElement('div');
    saveCurrentItem.className = 'workspace-menu-item';
    saveCurrentItem.setAttribute('data-action', 'save-current');
    saveCurrentItem.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-family: var(--orca-fontfamily-ui);
      font-size: var(--orca-fontsize-sm);
      display: flex;
      align-items: center;
      border-radius: var(--orca-radius-md);
      color: var(--orca-color-text-1);
    `;
    
    // 创建文本子元素
    const saveCurrentText = document.createElement('span');
    saveCurrentText.textContent = '保存当前工作区';
    saveCurrentText.style.cssText = `
      margin-right: var(--orca-spacing-md);
    `;
    saveCurrentItem.appendChild(saveCurrentText);
    
    // 添加悬浮效果
    saveCurrentItem.addEventListener('mouseenter', () => {
      saveCurrentItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
    });
    
    saveCurrentItem.addEventListener('mouseleave', () => {
      saveCurrentItem.style.backgroundColor = 'transparent';
    });
    
    saveCurrentItem.onclick = () => {
      menu.remove();
      this.saveCurrentWorkspace();
    };

    // 工作区列表
    const workspacesList = document.createElement('div');
    workspacesList.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `;

    if (this.workspaces.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${isDarkMode ? '#999' : '#666'};
        font-size: 14px;
        text-align: center;
      `;
      emptyItem.textContent = '暂无工作区';
      workspacesList.appendChild(emptyItem);
    } else {
      this.workspaces.forEach(workspace => {
        const workspaceItem = document.createElement('div');
        workspaceItem.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-family: var(--orca-fontfamily-ui);
          font-size: var(--orca-fontsize-sm);
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: var(--orca-radius-md);
          color: var(--orca-color-text-1);
          ${this.currentWorkspace === workspace.id ? 'background: rgba(59, 130, 246, 0.1);' : ''}
        `;
        
        const icon = workspace.icon || 'ti ti-folder';
        workspaceItem.innerHTML = `
          <i class="${icon}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: var(--orca-color-text-1);"">${workspace.name}</div>
            ${workspace.description ? `<div style="font-size: 12px; color: ${isDarkMode ? '#999' : '#666'}; margin-top: 2px;">${workspace.description}</div>` : ''}
            <div style="font-size: 11px; color: ${isDarkMode ? '#777' : '#999'}; margin-top: 2px;">${workspace.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === workspace.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ''}
        `;
        
        // 添加悬浮效果
        workspaceItem.addEventListener('mouseenter', () => {
          workspaceItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
        });
        
        workspaceItem.addEventListener('mouseleave', () => {
          workspaceItem.style.backgroundColor = this.currentWorkspace === workspace.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent';
        });
        
        workspaceItem.onclick = () => {
          menu.remove();
          this.switchToWorkspace(workspace.id);
        };
        
        workspacesList.appendChild(workspaceItem);
      });
    }

    // 管理选项
    const manageItem = document.createElement('div');
    manageItem.className = 'workspace-menu-item';
    manageItem.setAttribute('data-action', 'manage');
    manageItem.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-family: var(--orca-fontfamily-ui);
      font-size: var(--orca-fontsize-sm);
      display: flex;
      align-items: center;
      border-radius: var(--orca-radius-md);
      color: var(--orca-color-text-1);
    `;
    
    // 创建文本子元素
    const manageText = document.createElement('span');
    manageText.textContent = '管理工作区';
    manageText.style.cssText = `
      margin-right: var(--orca-spacing-md);
    `;
    manageItem.appendChild(manageText);
    
    // 添加悬浮效果
    manageItem.addEventListener('mouseenter', () => {
      manageItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
    });
    
    manageItem.addEventListener('mouseleave', () => {
      manageItem.style.backgroundColor = 'transparent';
    });
    
    manageItem.onclick = () => {
      menu.remove();
      this.manageWorkspaces();
    };

    // 退出工作区选项（仅在当前有工作区时显示）
    let exitWorkspaceItem: HTMLElement | null = null;
    if (this.currentWorkspace) {
      exitWorkspaceItem = document.createElement('div');
      exitWorkspaceItem.className = 'workspace-menu-item';
      exitWorkspaceItem.setAttribute('data-action', 'exit-workspace');
      exitWorkspaceItem.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        display: flex;
        align-items: center;
        border-radius: var(--orca-radius-md);
        color: var(--orca-color-text-1);
        border-top: 1px solid var(--orca-color-border);
        margin-top: var(--orca-spacing-sm);
      `;
      
      // 创建文本子元素
      const exitText = document.createElement('span');
      exitText.textContent = '退出工作区';
      exitText.style.cssText = `
        margin-right: var(--orca-spacing-md);
        color: var(--orca-color-danger);
      `;
      exitWorkspaceItem.appendChild(exitText);
      
      // 添加悬浮效果
      exitWorkspaceItem.addEventListener('mouseenter', () => {
        exitWorkspaceItem!.style.backgroundColor = 'var(--orca-color-menu-highlight)';
      });
      
      exitWorkspaceItem.addEventListener('mouseleave', () => {
        exitWorkspaceItem!.style.backgroundColor = 'transparent';
      });
      
      exitWorkspaceItem.onclick = () => {
        menu.remove();
        this.exitWorkspace();
      };
    }

    // 组装菜单
    menu.appendChild(title);
    menu.appendChild(saveCurrentItem);
    menu.appendChild(workspacesList);
    menu.appendChild(manageItem);
    if (exitWorkspaceItem) {
      menu.appendChild(exitWorkspaceItem);
    }

    document.body.appendChild(menu);

    // 点击外部关闭菜单
    const handleClickOutside = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', handleClickOutside);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
  }

  /**
   * 切换到指定工作区
   */
  private async switchToWorkspace(workspaceId: string) {
    try {
      const workspace = this.workspaces.find(w => w.id === workspaceId);
      if (!workspace) {
        orca.notify('error', '工作区不存在');
        return;
      }
      
      // 如果之前不在任何工作区中，保存当前标签页组以便退出时恢复
      if (!this.currentWorkspace && !this.tabsBeforeWorkspace) {
        const currentTabs = this.getCurrentPanelTabs();
        this.tabsBeforeWorkspace = [...currentTabs];
        
        // 只保存到专用的"进入工作区前"存储，不要覆盖普通标签页存储
        await this.tabStorageService.saveTabsBeforeWorkspace(this.tabsBeforeWorkspace);
        
        this.log(`💾 保存了进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`);
      }

      // 保存当前工作区（如果存在）
      if (this.currentWorkspace) {
        await this.saveCurrentTabsToWorkspace();
      }

      // 切换到新工作区
      this.currentWorkspace = workspaceId;
      await this.saveWorkspaces();
      
      // 保存当前工作区ID到存储
      await this.tabStorageService.saveWorkspaces(this.workspaces, workspaceId, this.enableWorkspaces);

      // 完全替换当前标签页集合
      await this.replaceCurrentTabsWithWorkspace(workspace.tabs, workspace);

      this.log(`🔄 已切换到工作区: "${workspace.name}"`);
      orca.notify('success', `已切换到工作区: ${workspace.name}`);
    } catch (error) {
      this.error("切换工作区失败:", error);
      orca.notify('error', '切换工作区失败');
    }
  }

  /**
   * 用工作区的标签页完全替换当前标签页
   */
  private async replaceCurrentTabsWithWorkspace(workspaceTabs: TabInfo[], workspace: Workspace) {
    try {
      // 清空当前标签页数据
      this.panelTabsData[0] = [];
      this.panelTabsData[1] = [];

      // 重新获取每个标签页的最新信息（包括块类型图标）
      const updatedTabs: TabInfo[] = [];
      for (const tab of workspaceTabs) {
        try {
          // 重新获取标签页信息，确保包含最新的块类型和图标
          const updatedTab = await this.getTabInfo(tab.blockId, this.currentPanelId || '', updatedTabs.length);
          if (updatedTab) {
            // 保留工作区保存的一些重要信息（如固定状态、激活序号等）
            updatedTab.isPinned = tab.isPinned;
            updatedTab.order = tab.order;
            updatedTab.scrollPosition = tab.scrollPosition;
            updatedTabs.push(updatedTab);
          } else {
            // 如果无法获取最新信息，使用原始数据
            updatedTabs.push(tab);
          }
        } catch (error) {
          this.warn(`无法更新标签页信息 ${tab.title}:`, error);
          // 如果更新失败，使用原始数据
          updatedTabs.push(tab);
        }
      }


      // 工作区切换时，总是设置到第一个面板（索引0）
      this.panelTabsData[0] = updatedTabs;
      
      // 确保panelTabsByIndex数组有足够的空间
      if (this.panelTabsData.length <= 0) {
        this.panelTabsData[0] = [];
      }
      
      // 更新基于索引的存储
      this.panelTabsData[0] = [...updatedTabs];
      
      await this.saveFirstPanelTabs();
      
      // 如果当前面板不是第一个面板，切换到第一个面板
      if (this.currentPanelIndex !== 0) {
        this.currentPanelIndex = 0;
        this.currentPanelId = this.getPanelIds()[0];
        this.log(`🔄 工作区切换：切换到第一个面板 (索引: 0)`);
      }

      // 更新UI显示（工作区切换需要立即更新，不使用防抖）
      await this.updateTabsUI();

      // 延迟导航，确保UI更新完成后再导航
      const lastActiveTabId = workspace.lastActiveTabId;
      setTimeout(async () => {
        // 导航到正确的标签页（优先使用lastActiveTabId，否则使用第一个）
        if (updatedTabs.length > 0) {
          let targetTab = updatedTabs[0]; // 默认第一个标签页
          
          // 查找最后激活的标签页
          if (lastActiveTabId) {
            const activeTab = updatedTabs.find(tab => tab.blockId === lastActiveTabId);
            if (activeTab) {
              targetTab = activeTab;
              this.log(`🎯 导航到工作区中最后激活的标签页: ${targetTab.title} (ID: ${lastActiveTabId})`);
            } else {
              this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${targetTab.title}`);
            }
          } else {
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${targetTab.title}`);
          }
          
          await this.safeNavigate(targetTab.blockId, this.currentPanelId || '');
        }
      }, 100); // 延迟100ms确保UI更新完成

      this.log(`📋 已替换当前标签页，共 ${updatedTabs.length} 个标签，块类型图标已更新`);
    } catch (error) {
      this.error("替换标签页失败:", error);
      throw error;
    }
  }

  /**
   * 页面加载完成后更新当前工作区的最后激活标签页
   */
  private async updateCurrentWorkspaceActiveIndexOnLoad() {
    if (!this.enableWorkspaces || !this.currentWorkspace) return;

    const currentActiveTab = this.getCurrentActiveTab();
    if (currentActiveTab) {
      await this.updateCurrentWorkspaceActiveIndex(currentActiveTab);
      this.log(`🔄 页面加载完成后更新工作区最后激活标签页: ${currentActiveTab.title}`);
    }
  }

  /**
   * 实时更新当前工作区的最后激活标签页
   */
  private async updateCurrentWorkspaceActiveIndex(activeTab: TabInfo) {
    if (!this.currentWorkspace) return;

    const workspace = this.workspaces.find(w => w.id === this.currentWorkspace);
    if (workspace) {
      workspace.lastActiveTabId = activeTab.blockId;
      workspace.updatedAt = Date.now();
      await this.saveWorkspaces();
      this.log(`🔄 实时更新工作区最后激活标签页: ${activeTab.title} (ID: ${activeTab.blockId})`);
    }
  }

  /**
   * 保存当前标签页到当前工作区
   */
  private async saveCurrentTabsToWorkspace() {
    if (!this.currentWorkspace) return;

    const workspace = this.workspaces.find(w => w.id === this.currentWorkspace);
    if (workspace) {
      // 工作区更新时，总是使用第一个面板的数据
      const currentTabs = this.getCurrentPanelTabs();
      const currentActiveTab = this.getCurrentActiveTab();
      
      workspace.tabs = currentTabs;
      workspace.lastActiveTabId = currentActiveTab ? currentActiveTab.blockId : undefined;
      workspace.updatedAt = Date.now();
      await this.saveWorkspaces();
    }
  }

  /**
   * 管理工作区
   */
  private manageWorkspaces() {
    // 移除现有对话框
    const existingDialog = document.querySelector('.manage-workspaces-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                      (window as any).orca?.state?.themeMode === 'dark';

    const dialog = document.createElement('div');
    dialog.className = 'manage-workspaces-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: ${this.getNextDialogZIndex()};
      width: 600px;
      max-width: 90vw;
      max-height: 80vh;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 20px;
    `;

    // 标题
    const title = document.createElement('div');
    title.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${isDarkMode ? '#ffffff' : '#333'};
      margin-bottom: 20px;
      text-align: center;
    `;
    title.textContent = '管理工作区';

    // 工作区列表
    const workspacesList = document.createElement('div');
    workspacesList.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
    `;

    if (this.workspaces.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.style.cssText = `
        padding: 40px;
        text-align: center;
        color: ${isDarkMode ? '#999' : '#666'};
        font-size: 14px;
      `;
      emptyItem.textContent = '暂无工作区';
      workspacesList.appendChild(emptyItem);
    } else {
      this.workspaces.forEach(workspace => {
        const workspaceItem = document.createElement('div');
        workspaceItem.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          margin-bottom: 8px;
          background: ${this.currentWorkspace === workspace.id ? 'rgba(59, 130, 246, 0.05)' : 'var(--orca-color-bg-1)'};
        `;

        const icon = workspace.icon || 'ti ti-folder';
        workspaceItem.innerHTML = `
          <i class="${icon}" style="font-size: 20px; color: var(--orca-color-primary-5); margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; color: ${isDarkMode ? '#ffffff' : '#333'};"">${workspace.name}</div>
            ${workspace.description ? `<div style="font-size: 12px; color: ${isDarkMode ? '#999' : '#666'}; margin-bottom: 4px;">${workspace.description}</div>` : ''}
            <div style="font-size: 11px; color: ${isDarkMode ? '#777' : '#999'};"">${workspace.tabs.length}个标签 • 创建于 ${new Date(workspace.createdAt).toLocaleString()}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${this.currentWorkspace === workspace.id ? '<span style="color: var(--orca-color-primary-5); font-size: 12px;">当前</span>' : ''}
            <button class="delete-workspace-btn" data-workspace-id="${workspace.id}" style="
              padding: 4px 8px;
              border: 1px solid var(--orca-color-border);
              border-radius: var(--orca-radius-md);
              background: var(--orca-color-bg-1);
              color: #ef4444;
              cursor: pointer;
              font-size: 12px;
            ">删除</button>
          </div>
        `;

        // 添加悬浮效果
        workspaceItem.addEventListener('mouseenter', () => {
          workspaceItem.style.backgroundColor = 'var(--orca-color-menu-highlight)';
        });
        
        workspaceItem.addEventListener('mouseleave', () => {
          workspaceItem.style.backgroundColor = this.currentWorkspace === workspace.id ? 'rgba(59, 130, 246, 0.05)' : 'var(--orca-color-bg-1)';
        });

        workspacesList.appendChild(workspaceItem);
      });
    }

    // 按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;

    // 关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-bg-1);
      color: ${isDarkMode ? '#999' : '#666'};
      cursor: pointer;
      font-size: 14px;
    `;
    closeBtn.textContent = '关闭';
    closeBtn.onclick = () => {
      dialog.remove();
    };

    // 组装对话框
    buttonContainer.appendChild(closeBtn);
    
    content.appendChild(title);
    content.appendChild(workspacesList);
    content.appendChild(buttonContainer);
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);

    // 绑定删除按钮事件
    const deleteButtons = dialog.querySelectorAll('.delete-workspace-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const workspaceId = (e.target as HTMLElement).getAttribute('data-workspace-id');
        if (workspaceId) {
          await this.deleteWorkspace(workspaceId);
          dialog.remove();
          this.manageWorkspaces(); // 重新打开管理对话框
        }
      });
    });

    // 点击外部关闭对话框
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    });
  }

  /**
   * 删除工作区
   */
  private async deleteWorkspace(workspaceId: string) {
    try {
      const workspace = this.workspaces.find(w => w.id === workspaceId);
      if (!workspace) {
        orca.notify('error', '工作区不存在');
        return;
      }

      if (this.currentWorkspace === workspaceId) {
        this.currentWorkspace = null;
      }

      this.workspaces = this.workspaces.filter(w => w.id !== workspaceId);
      await this.saveWorkspaces();

      this.log(`🗑️ 工作区已删除: "${workspace.name}"`);
      orca.notify('success', `工作区已删除: ${workspace.name}`);
    } catch (error) {
      this.error("删除工作区失败:", error);
      orca.notify('error', '删除工作区失败');
    }
  }

  /**
   * 显示标签集合详情
   */
  showTabSetDetails(tabSet: SavedTabSet, parentDialog?: HTMLElement) {
    // 检测暗色模式
    const isDarkMode = document.documentElement.classList.contains('dark') ||
                      (window as any).orca?.state?.themeMode === 'dark';
    
    // 移除现有详情对话框
    const existingDialog = document.querySelector('.tabset-details-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.className = 'tabset-details-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex() + 200};
      width: 500px;
      max-height: 600px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `;
    header.textContent = `标签集合详情: ${tabSet.name}`;
    dialog.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;

    // 显示基本信息
    const info = document.createElement('div');
    info.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background-color: var(--orca-color-bg-1);
      border-radius: var(--orca-radius-md);
    `;
    info.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>创建时间:</strong> ${new Date(tabSet.createdAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>更新时间:</strong> ${new Date(tabSet.updatedAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666;">
        <strong>标签数量:</strong> ${tabSet.tabs.length}个
      </div>
    `;
    content.appendChild(info);

    // 显示标签列表
    if (tabSet.tabs.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `;
      emptyMessage.textContent = '该标签集合为空';
      content.appendChild(emptyMessage);
    } else {
      const tabsList = document.createElement('div');
      tabsList.style.cssText = `
        margin-bottom: 16px;
      `;
      
      const tabsTitle = document.createElement('div');
      tabsTitle.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      
      const titleText = document.createElement('span');
      titleText.textContent = '包含的标签 (可拖拽排序):';
      tabsTitle.appendChild(titleText);
      
      const sortHint = document.createElement('span');
      sortHint.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `;
      sortHint.textContent = '拖拽调整顺序';
      tabsTitle.appendChild(sortHint);
      
      tabsList.appendChild(tabsTitle);

      // 创建可排序的标签容器
      const sortableContainer = document.createElement('div');
      sortableContainer.className = 'sortable-tabs-container';
      sortableContainer.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `;

      // 使用新的 renderSortableTabs 方法
      this.renderSortableTabs(sortableContainer, [...tabSet.tabs], tabSet);

      tabsList.appendChild(sortableContainer);
      content.appendChild(tabsList);
    }

    dialog.appendChild(content);

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'orca-button';
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = ``;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = '#4b5563';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = '#6b7280';
    });
    closeBtn.onclick = () => {
      dialog.remove();
      if (parentDialog) {
        // 如果有关联的父对话框，重新显示管理页面
        this.manageSavedTabSets();
      }
    };

    footer.appendChild(closeBtn);
    dialog.appendChild(footer);

    document.body.appendChild(dialog);

    // 点击外部关闭对话框
    const closeDialog = (e: MouseEvent) => {
      if (!dialog.contains(e.target as Node)) {
        dialog.remove();
        if (parentDialog) {
          // 如果有关联的父对话框，重新显示管理页面
          this.manageSavedTabSets();
        }
        document.removeEventListener('click', closeDialog);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeDialog);
    }, 200);
  }

  /**
   * 重命名标签集合
   */
  renameTabSet(tabSet: SavedTabSet, index: number, parentDialog: HTMLElement) {
    // 移除现有重命名对话框
    const existingDialog = document.querySelector('.rename-tabset-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    const dialog = document.createElement('div');
    dialog.className = 'rename-tabset-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 2000;
      width: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `;
    header.textContent = '重命名标签集合';
    dialog.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 0 20px;
    `;

    const label = document.createElement('label');
    label.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `;
    label.textContent = '请输入新的名称:';
    content.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.value = tabSet.name;
    input.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      user-select: text;
    `;
    input.addEventListener('focus', () => {
      input.style.borderColor = 'var(--orca-color-primary-5)';
    });
    input.addEventListener('blur', () => {
      input.style.borderColor = '#ddd';
    });
    content.appendChild(input);

    dialog.appendChild(content);

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'orca-button';
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = ``;
    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.backgroundColor = '#4b5563';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.backgroundColor = '#6b7280';
    });
    cancelBtn.onclick = () => {
      dialog.remove();
      // 重新显示管理页面
      this.manageSavedTabSets();
    };

    const saveBtn = document.createElement('button');
    saveBtn.className = 'orca-button orca-button-primary';
    saveBtn.textContent = '保存';
    saveBtn.style.cssText = ``;
    saveBtn.addEventListener('mouseenter', () => {
      saveBtn.style.backgroundColor = '#2563eb';
    });
    saveBtn.addEventListener('mouseleave', () => {
      saveBtn.style.backgroundColor = 'var(--orca-color-primary-5)';
    });
    saveBtn.onclick = async () => {
      const newName = input.value.trim();
      if (!newName) {
        orca.notify('warn', '请输入名称');
        return;
      }
      
      if (newName === tabSet.name) {
        dialog.remove();
        // 重新显示管理页面
        this.manageSavedTabSets();
        return;
      }
      
      // 检查名称是否重复
      const existingTabSet = this.savedTabSets.find(ts => ts.name === newName && ts.id !== tabSet.id);
      if (existingTabSet) {
        orca.notify('warn', '该名称已存在');
        return;
      }
      
      // 更新名称
      tabSet.name = newName;
      tabSet.updatedAt = Date.now();
      await this.saveSavedTabSets();
      
      dialog.remove();
      parentDialog.remove();
      this.manageSavedTabSets(); // 重新打开管理对话框
      
      orca.notify('success', '重命名成功');
    };

    footer.appendChild(cancelBtn);
    footer.appendChild(saveBtn);
    dialog.appendChild(footer);

    document.body.appendChild(dialog);

    // 聚焦到输入框
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);

    // 回车键保存
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveBtn.click();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelBtn.click();
      }
    });

    // 点击外部关闭对话框
    const closeDialog = (e: MouseEvent) => {
      if (!dialog.contains(e.target as Node)) {
        dialog.remove();
        document.removeEventListener('click', closeDialog);
        document.removeEventListener('contextmenu', closeDialog);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeDialog);
      document.addEventListener('contextmenu', closeDialog);
    }, 200);
  }

  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(tabSet: SavedTabSet, index: number, nameDisplay: HTMLElement, parentDialog: HTMLElement) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = tabSet.name;
    input.style.cssText = `
      width: 100%;
      padding: 2px 4px;
      border: 1px solid var(--orca-color-primary-5);
      border-radius: 3px;
      font-size: 14px;
      font-weight: 600;
      color: var(--orca-color-text-1);
      background: var(--orca-color-bg-1);
      outline: none;
    `;

    // 替换显示元素
    const originalText = nameDisplay.textContent;
    nameDisplay.innerHTML = '';
    nameDisplay.appendChild(input);

    // 阻止输入框的点击事件传播，避免触发外部关闭事件
    input.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    input.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });

    // 聚焦并选中文本
    input.focus();
    input.select();

    const saveEdit = async () => {
      const newName = input.value.trim();
      if (!newName) {
        nameDisplay.textContent = originalText;
        return;
      }

      if (newName === tabSet.name) {
        nameDisplay.textContent = originalText;
        return;
      }

      // 检查名称是否重复
      const existingTabSet = this.savedTabSets.find(ts => ts.name === newName && ts.id !== tabSet.id);
      if (existingTabSet) {
        orca.notify('warn', '该名称已存在');
        nameDisplay.textContent = originalText;
        return;
      }

      // 更新名称
      tabSet.name = newName;
      tabSet.updatedAt = Date.now();
      await this.saveSavedTabSets();
      
      nameDisplay.textContent = newName;
      orca.notify('success', '重命名成功');
    };

    const cancelEdit = () => {
      nameDisplay.textContent = originalText;
    };

    // 键盘事件
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    });

    // 失去焦点时保存（延迟执行，避免重复触发）
    let blurTimeout: number | null = null;
    input.addEventListener('blur', () => {
      if (blurTimeout) {
        clearTimeout(blurTimeout);
      }
      blurTimeout = window.setTimeout(() => {
        saveEdit();
      }, 100);
    });

    // 重新获得焦点时取消保存
    input.addEventListener('focus', () => {
      if (blurTimeout) {
        clearTimeout(blurTimeout);
        blurTimeout = null;
      }
    });
  }

  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(tabSet: SavedTabSet, index: number, iconContainer: HTMLElement, updateIcon: () => void, parentDialog: HTMLElement) {
    // 创建图标选择对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      max-height: 500px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `;
    header.textContent = '选择图标';
    dialog.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 0 20px;
      max-height: 300px;
      overflow-y: auto;
    `;

    // 常用图标列表
    const commonIcons = [
      { name: '默认', value: '', icon: '📁' },
      { name: '工作', value: 'ti ti-briefcase', icon: '💼' },
      { name: '学习', value: 'ti ti-school', icon: '📚' },
      { name: '项目', value: 'ti ti-folder', icon: '📂' },
      { name: '代码', value: 'ti ti-code', icon: '💻' },
      { name: '设计', value: 'ti ti-palette', icon: '🎨' },
      { name: '音乐', value: 'ti ti-music', icon: '🎵' },
      { name: '视频', value: 'ti ti-video', icon: '🎬' },
      { name: '图片', value: 'ti ti-photo', icon: '🖼️' },
      { name: '文档', value: 'ti ti-file-text', icon: '📄' },
      { name: '收藏', value: 'ti ti-star', icon: '⭐' },
      { name: '重要', value: 'ti ti-flag', icon: '🚩' },
      { name: '完成', value: 'ti ti-check', icon: '✅' },
      { name: '进行中', value: 'ti ti-clock', icon: '⏰' },
    ];

    const iconGrid = document.createElement('div');
    iconGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    `;

    commonIcons.forEach(iconData => {
      const iconItem = document.createElement('div');
      iconItem.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border: 1px solid #e0e0e0;
        border-radius: var(--orca-radius-md);
        cursor: pointer;
        transition: all 0.2s;
        background: ${tabSet.icon === iconData.value ? '#e3f2fd' : 'white'};
      `;

      const iconElement = document.createElement('div');
      iconElement.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `;
      
      if (iconData.value.startsWith('ti ti-')) {
        const iElement = document.createElement('i');
        iElement.className = iconData.value;
        iconElement.appendChild(iElement);
      } else {
        iconElement.textContent = iconData.icon;
      }

      const labelElement = document.createElement('div');
      labelElement.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `;
      labelElement.textContent = iconData.name;

      iconItem.appendChild(iconElement);
      iconItem.appendChild(labelElement);

      iconItem.addEventListener('click', async (e) => {
        e.stopPropagation();
        tabSet.icon = iconData.value;
        tabSet.updatedAt = Date.now();
        await this.saveSavedTabSets();
        updateIcon();
        dialog.remove();
        // 重新聚焦到父对话框，防止父对话框被意外关闭
        if (parentDialog) {
          parentDialog.focus();
        }
        orca.notify('success', '图标已更新');
      });

      iconItem.addEventListener('mouseenter', () => {
        iconItem.style.backgroundColor = '#f5f5f5';
        iconItem.style.borderColor = 'var(--orca-color-primary-5)';
      });

      iconItem.addEventListener('mouseleave', () => {
        iconItem.style.backgroundColor = tabSet.icon === iconData.value ? '#e3f2fd' : 'white';
        iconItem.style.borderColor = '#e0e0e0';
      });

      iconGrid.appendChild(iconItem);
    });

    content.appendChild(iconGrid);
    dialog.appendChild(content);

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'orca-button';
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = ``;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = '#4b5563';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = '#6b7280';
    });
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      dialog.remove();
      // 重新聚焦到父对话框，防止父对话框被意外关闭
      if (parentDialog) {
        parentDialog.focus();
      }
    };

    footer.appendChild(closeBtn);
    dialog.appendChild(footer);

    document.body.appendChild(dialog);

    // 点击外部关闭对话框
    const closeDialog = (e: MouseEvent) => {
      if (!dialog.contains(e.target as Node)) {
        e.stopPropagation(); // 阻止事件冒泡到父对话框
        dialog.remove();
        document.removeEventListener('click', closeDialog);
        document.removeEventListener('contextmenu', closeDialog);
        // 重新聚焦到父对话框
        if (parentDialog) {
          parentDialog.focus();
        }
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeDialog);
      document.addEventListener('contextmenu', closeDialog);
    }, 200);
  }

  /**
   * 管理保存的标签页集合
   */
  async manageSavedTabSets() {
    if (this.savedTabSets.length === 0) {
      orca.notify('info', '没有保存的标签页集合');
      return;
    }

    // 移除现有的管理对话框
    const existingDialog = document.querySelector('.manage-saved-tabsets-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    // 创建管理对话框
    const dialog = document.createElement('div');
    dialog.className = 'manage-saved-tabsets-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 500px;
      max-height: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `;
    header.textContent = '管理保存的标签页集合';
    dialog.appendChild(header);

    const content = document.createElement('div');
    content.style.cssText = `
      padding: 0 20px;
      max-height: 300px;
      overflow-y: auto;
    `;

    this.savedTabSets.forEach((tabSet, index) => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-md);
        margin-bottom: 8px;
        background-color: var(--orca-color-bg-1);
        transition: background-color 0.2s;
      `;

      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = 'var(--orca-color-menu-highlight)';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'var(--orca-color-bg-1)';
      });

      const info = document.createElement('div');
      info.style.cssText = `
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
      `;

      // 图标区域
      const iconContainer = document.createElement('div');
      iconContainer.style.cssText = `
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s;
      `;
        addTooltip(iconContainer, createButtonTooltip('点击编辑图标'));
      
      // 设置图标
      const updateIcon = () => {
        iconContainer.innerHTML = '';
        if (tabSet.icon) {
          if (tabSet.icon.startsWith('ti ti-')) {
            const iElement = document.createElement('i');
            iElement.className = tabSet.icon;
            iconContainer.appendChild(iElement);
          } else {
            iconContainer.textContent = tabSet.icon;
          }
        } else {
          iconContainer.textContent = '📁'; // 默认图标
        }
      };
      updateIcon();

      // 图标编辑功能
      iconContainer.addEventListener('click', () => {
        this.editTabSetIcon(tabSet, index, iconContainer, updateIcon, dialog);
      });

      iconContainer.addEventListener('mouseenter', () => {
        iconContainer.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      });

      iconContainer.addEventListener('mouseleave', () => {
        iconContainer.style.backgroundColor = 'transparent';
      });

      // 名称区域
      const nameContainer = document.createElement('div');
      nameContainer.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      `;

      const nameDisplay = document.createElement('div');
      nameDisplay.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
        min-height: 20px;
        display: flex;
        align-items: center;
      `;
      nameDisplay.textContent = tabSet.name;
        addTooltip(nameDisplay, createButtonTooltip('点击编辑名称'));

      // 名称编辑功能
      nameDisplay.addEventListener('click', () => {
        this.editTabSetName(tabSet, index, nameDisplay, dialog);
      });

      nameDisplay.addEventListener('mouseenter', () => {
        nameDisplay.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
      });

      nameDisplay.addEventListener('mouseleave', () => {
        nameDisplay.style.backgroundColor = 'transparent';
      });

      const detailsDisplay = document.createElement('div');
      detailsDisplay.style.cssText = `
        font-size: 12px;
        color: #666;
      `;
      detailsDisplay.textContent = `${tabSet.tabs.length}个标签 • ${new Date(tabSet.updatedAt).toLocaleString()}`;

      nameContainer.appendChild(nameDisplay);
      nameContainer.appendChild(detailsDisplay);

      info.appendChild(iconContainer);
      info.appendChild(nameContainer);

      const actions = document.createElement('div');
      actions.style.cssText = `
        display: flex;
        gap: 8px;
      `;

      const loadBtn = document.createElement('button');
      loadBtn.className = 'orca-button orca-button-primary';
      loadBtn.textContent = '加载';
      loadBtn.style.cssText = ``;
      loadBtn.onclick = () => {
        this.loadSavedTabSet(tabSet, index);
        dialog.remove();
      };

      const viewBtn = document.createElement('button');
      viewBtn.className = 'orca-button';
      viewBtn.textContent = '查看';
      viewBtn.style.cssText = ``;
      viewBtn.onclick = () => {
        this.showTabSetDetails(tabSet, dialog);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'orca-button';
      deleteBtn.textContent = '删除';
      deleteBtn.style.cssText = ``;
      deleteBtn.onclick = () => {
        if (confirm(`确定要删除标签页集合 "${tabSet.name}" 吗？`)) {
          this.savedTabSets.splice(index, 1);
          this.saveSavedTabSets();
          dialog.remove();
          this.manageSavedTabSets(); // 重新打开管理对话框
        }
      };

      actions.appendChild(loadBtn);
      actions.appendChild(viewBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(actions);
      content.appendChild(item);
    });

    dialog.appendChild(content);

    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'orca-button';
    closeBtn.textContent = '关闭';
    closeBtn.style.cssText = ``;
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = '#4b5563';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = '#6b7280';
    });
    closeBtn.onclick = () => dialog.remove();

    footer.appendChild(closeBtn);
    dialog.appendChild(footer);

    document.body.appendChild(dialog);

    // 点击外部关闭对话框
    const closeDialog = (e: MouseEvent) => {
      if (!dialog.contains(e.target as Node)) {
        dialog.remove();
        document.removeEventListener('click', closeDialog);
        document.removeEventListener('contextmenu', closeDialog);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeDialog);
      document.addEventListener('contextmenu', closeDialog);
    }, 0);
  }

  /**
   * 初始化优化的DOM监听器
   */
  private initializeOptimizedDOMObserver(): void {
    if (!this.performanceOptimizer) {
      this.log('⚠️ 性能优化管理器未初始化，跳过DOM监听器优化');
      return;
    }

    try {
      // 启动优化的DOM观察器
      this.performanceOptimizer.startDOMObservation(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });

      this.log('🔍 优化的DOM监听器已启动');

      // 注意：性能报告变化监听在实际应用中可以通过轮询或其他方式实现

    } catch (error) {
      this.error('❌ 优化DOM监听器初始化失败:', error);
    }
  }

  /**
   * 处理性能报告
   */
  private handlePerformanceReport(report: any): void {
    const healthScore = report.healthScore || 0;
    const issuesCount = report.issues?.length || 0;
    
    this.log(`📊 性能报告: 健康分数 ${healthScore}/100, 问题数: ${issuesCount}`);
    
    // 如果健康分数过低，自动优化
    if (healthScore < 50 && issuesCount > 0) {
      this.log('⚠️ 性能分数过低，触发自动优化');
      this.triggerPerformanceOptimization();
    }
  }

  /**
   * 触发性能优化
   */
  private triggerPerformanceOptimization(): void {
    if (!this.performanceOptimizer) {
      return;
    }

    try {
      // 触发优化策略
      this.performanceOptimizer.triggerOptimization();
      
      // 清理可能的内存泄漏
      const memoryStats = this.performanceOptimizer.getMemoryStats();
      if (memoryStats && memoryStats.totalResources > 1000) {
        this.log('🧹 检测到资源过多，执行清理');
        this.performanceOptimizer.cleanupAllResources();
      }

    } catch (error) {
      this.error('❌ 性能优化触发失败:', error);
    }
  }

  /**
   * 优化的防抖更新方法
   */
  async optimizedDebouncedUpdateTabsUI(): Promise<void> {
    if (!this.performanceOptimizer) {
      // 降级到原来的方法
      this.debouncedUpdateTabsUI();
      return;
    }

    try {
      await this.performanceOptimizer.executeTask(
        () => this.immediateUpdateTabsUI(),
        [],
        'normal' // 使用普通优先级
      );
      this.log('⚡ 使用优化防抖更新标签页UI');
    } catch (error) {
      this.error('❌ 优化防抖更新失败，降级到原始方法:', error);
      this.debouncedUpdateTabsUI();
    }
  }

  /**
   * 优化的资源跟踪
   */
  private trackOptimizedResource(
    target: EventTarget,
    event: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): string | null {
    if (!this.performanceOptimizer) {
      // 降级到原始添加事件监听器
      target.addEventListener(event, listener, options);
      return null;
    }

    // 使用优化管理器跟踪事件监听器
    const resourceId = this.performanceOptimizer.trackEventListener(target, event, listener, options);
    
    if (resourceId) {
      this.verboseLog(`👂 跟踪事件监听器: ${event} -> ${resourceId}`);
    }

    return resourceId;
  }

  /**
   * 销毁插件，清理所有资源
   */
  destroy(): void {
    try {
      if (typeof window !== 'undefined' && this.performanceBaselineTimer !== null) {
        window.clearTimeout(this.performanceBaselineTimer);
      }
      this.performanceBaselineTimer = null;
      this.lastBaselineScenario = null;
      this.lastBaselineReport = null;
      this.log('🗑️ 开始销毁插件...');
      
      // 立即保存数据（不等待防抖）
      this.log('💾 保存插件数据...');
      this.saveCurrentPanelTabsImmediately().catch(err => {
        this.error('销毁时保存数据失败:', err);
      });
      
      // 清理数据保存定时器
      if (this.saveDataDebounceTimer !== null) {
        clearTimeout(this.saveDataDebounceTimer);
        this.saveDataDebounceTimer = null;
      }
      
      // 清理性能优化器
      if (this.performanceOptimizer) {
        this.log('🧹 清理性能优化器...');
        this.performanceOptimizer.destroy();
        this.performanceOptimizer = null;
      }
      
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
      if (this.focusSyncInterval !== null) {
        if (typeof window !== 'undefined') {
          window.clearInterval(this.focusSyncInterval);
        } else {
          clearInterval(this.focusSyncInterval);
        }
        this.focusSyncInterval = null;
      }

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
      if (this.settingsCheckInterval) {
        clearInterval(this.settingsCheckInterval);
        this.settingsCheckInterval = null;
      }
      
      // 清理事件监听器
      if (this.globalEventListener) {
        // 【重要】移除时必须使用相同的 capture 参数
        document.removeEventListener('click', this.globalEventListener, { capture: true });
        document.removeEventListener('contextmenu', this.globalEventListener);
        this.globalEventListener = null;
      }
      if (this.dragEndListener) {
        document.removeEventListener('dragend', this.dragEndListener);
        this.dragEndListener = null;
      }
      if (this.dragOverListener) {
        document.removeEventListener('dragover', this.dragOverListener);
        this.dragOverListener = null;
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
      
      this.log('✅ 插件销毁完成');
      
    } catch (error) {
      this.error('❌ 插件销毁过程中发生错误:', error);
    }
  }

}

let tabsPlugin: OrcaTabsPlugin | null = null;

/* ———————————————————————————————————————————————————————————————————————————— */
/* 插件入口点 - Plugin Entry Points */
/* ———————————————————————————————————————————————————————————————————————————— */

export async function load(_name: string) {
  pluginName = _name;

  setupL10N(orca.state.locale, { "zh-CN": zhCN });

  // 初始化标签页插件
  tabsPlugin = new OrcaTabsPlugin(pluginName);
  
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
    // 插件启动日志
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

