/**
 * Orca标签页插件常量定义文件
 * 
 * 此文件包含插件中使用的所有常量定义，包括：
 * - 应用配置键名
 * - 数据类型常量
 * - 存储键名定义
 * 
 * 使用const断言确保常量的不可变性和类型安全。
 * 
 * @file constants.ts
 * @version 2.4.0
 * @since 2024
 */

// ==================== 应用配置常量 ====================
/**
 * Orca应用配置键名常量
 * 
 * 这些常量对应Orca编辑器中的设置项键名，用于读取和写入配置。
 * 键名必须与Orca内部使用的键名完全一致。
 */
export const AppKeys = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
} as const;

// ==================== 数据类型常量 ====================
/**
 * 属性类型常量
 * 
 * 定义Orca中不同数据类型的标识符，用于区分JSON和文本数据。
 * 这些常量与Orca内部的数据类型系统保持一致。
 */
export const PropType = {
  /** JSON数据类型 - 用于存储结构化数据 */
  JSON: 0,
  /** 文本数据类型 - 用于存储纯文本数据 */
  Text: 1
} as const;

// ==================== 插件存储键定义 ====================
/**
 * 插件专用存储键名常量
 * 
 * 定义插件在Orca存储系统中使用的所有键名。
 * 这些键名用于标识不同类型的数据，确保数据存储和检索的一致性。
 * 
 * 命名规范：
 * - 使用kebab-case（短横线分隔）
 * - 使用描述性的名称
 * - 避免与Orca内置键名冲突
 */
export const PLUGIN_STORAGE_KEYS = {
  /** 第一个面板的标签数据 - 存储第一个面板的标签页信息（向后兼容） */
  FIRST_PANEL_TABS: 'first-panel-tabs',
  
  /** 第二个面板的标签数据 - 存储第二个面板的标签页信息（已废弃） */
  SECOND_PANEL_TABS: 'second-panel-tabs',
  
  /** 已关闭标签列表 - 存储已关闭标签页的ID集合，用于避免重复创建 */
  CLOSED_TABS: 'closed-tabs',
  
  /** 最近关闭的标签页列表 - 存储最近关闭的标签页详细信息，支持恢复功能 */
  RECENTLY_CLOSED_TABS: 'recently-closed-tabs',
  
  /** 保存的多标签页集合 - 存储用户保存的标签页组合，支持快速切换 */
  SAVED_TAB_SETS: 'saved-tab-sets',
  
  /** 工作区列表 - 存储用户创建的所有工作区信息 */
  WORKSPACES: 'workspaces',
  
  /** 当前工作区 - 存储当前激活的工作区ID */
  CURRENT_WORKSPACE: 'current-workspace',
  
  /** 启用工作区功能 - 存储工作区功能的开关状态 */
  ENABLE_WORKSPACES: 'enable-workspaces',
  
  /** 浮窗可见状态 - 存储标签页容器的显示/隐藏状态 */
  FLOATING_WINDOW_VISIBLE: 'floating-window-visible',
  
  /** 标签位置 - 存储标签页容器的屏幕坐标位置 */
  TABS_POSITION: 'tabs-position',
  
  /** 布局模式 - 存储用户选择的布局模式（水平/垂直） */
  LAYOUT_MODE: 'layout-mode',
  
  /** 固定到顶部状态 - 存储标签页容器是否固定到顶部的状态 */
  FIXED_TO_TOP: 'fixed-to-top',
  
  /** 调试模式 - 存储是否启用详细日志输出 */
  DEBUG_MODE: 'debug-mode',
  
  /** 刷新后恢复聚焦标签页 - 存储是否在软件刷新后自动聚焦并打开当前聚焦的标签页 */
  RESTORE_FOCUSED_TAB: 'restore-focused-tab',
  
  /** 水平布局标签最大宽度 - 存储水平布局下标签的最大宽度设置 */
  HORIZONTAL_TAB_MAX_WIDTH: 'horizontal-tab-max-width',
  
  /** 水平布局标签最小宽度 - 存储水平布局下标签的最小宽度设置 */
  HORIZONTAL_TAB_MIN_WIDTH: 'horizontal-tab-min-width',
  
  /** 进入工作区前的标签页组 - 存储进入工作区前的普通标签页组，用于退出工作区时恢复 */
  TABS_BEFORE_WORKSPACE: 'tabs-before-workspace',
  
  /** 最近切换标签历史 - 存储每个标签的最近切换历史，用于悬浮显示功能 */
  RECENT_TAB_SWITCH_HISTORY: 'recent-tab-switch-history',
  
  /** 中键固定标签页功能开关 - 存储是否启用中键固定标签页功能 */
  ENABLE_MIDDLE_CLICK_PIN: 'enable-middle-click-pin',
  
  /** 双击关闭标签页功能开关 - 存储是否启用双击关闭标签页功能 */
  ENABLE_DOUBLE_CLICK_CLOSE: 'enable-double-click-close',
  
  /** 贴边隐藏功能开关 - 存储是否启用贴边隐藏功能 */
  ENABLE_EDGE_HIDE: 'enable-edge-hide',
  
  /** 气泡模式开关 - 存储是否启用气泡模式（仅垂直模式可用） */
  ENABLE_BUBBLE_MODE: 'enable-bubble-mode',
} as const;

// ==================== 功能配置常量 ====================
/**
 * 功能配置常量
 * 
 * 定义插件功能相关的配置参数，如数量限制、时间间隔等。
 * 这些常量用于控制插件的行为和性能。
 */
export const FEATURE_CONFIG = {
  /** 全局切换历史记录最大数量 - 限制全局标签页切换历史记录的最大数量 */
  GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS: 10,
  
  /** 触发区域宽度 - 鼠标进入这个宽度的边缘区域时会展开容器（像素） */
  EDGE_TRIGGER_ZONE_SIZE: 35,
  
  /** 隐藏时露出的边缘提示宽度 - 容器隐藏时露出的视觉提示宽度（像素） */
  EDGE_HINT_SIZE: 5,
  
  /** 贴边检测距离 - 距离屏幕边缘多少像素时触发贴边隐藏 */
  EDGE_DETECTION_DISTANCE: 15,
  
  /** 贴边隐藏展开延迟 - 鼠标悬停后展开的延迟时间（毫秒） */
  EDGE_HIDE_EXPAND_DELAY: 1,
  
  /** 贴边隐藏收起延迟 - 鼠标离开后收起的延迟时间（毫秒） */
  EDGE_HIDE_COLLAPSE_DELAY: 100,
} as const;