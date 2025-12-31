/**
 * Orca标签页插件类型定义文件
 * 
 * 此文件包含插件中使用的所有TypeScript接口和类型定义。
 * 这些类型定义确保代码的类型安全性和可维护性。
 * 
 * @file types.ts
 * @version 2.4.0
 * @since 2024
 */

/**
 * 视图面板信息接口
 * 
 * 定义自定义视图面板（如 AI Chat）的元数据结构。
 * 用于从 DOM 元素中提取视图面板的显示信息。
 */
export interface ViewPanelInfo {
  /** 面板ID - 面板的唯一标识符 */
  panelId: string;
  
  /** 面板标题 - 显示在标签页上的文本内容 */
  title: string;
  
  /** 面板图标 - 可选的图标，用于显示在标签页上 */
  icon?: string;
  
  /** 面板类型 - 固定为 "view" 表示这是一个视图面板 */
  type: 'view';
}

/**
 * 标签页信息接口
 * 
 * 定义单个标签页的完整信息结构，包含所有必要的元数据。
 * 这个接口是插件数据模型的核心，用于存储和管理标签页状态。
 */
export interface TabInfo {
  /** 块ID - Orca中块的唯一标识符，用于导航和操作 */
  blockId: string;
  
  /** 面板ID - 标签页所属面板的唯一标识符 */
  panelId: string;
  
  /** 标签页标题 - 显示在标签页上的文本内容 */
  title: string;
  
  /** 标签页颜色 - 可选的标签页背景颜色，用于视觉区分 */
  color?: string;
  
  /** 标签页图标 - 可选的图标标识符，用于显示块类型图标 */
  icon?: string;
  
  /** 是否为日志块 - 标识此标签页是否对应日志类型的块 */
  isJournal?: boolean;
  
  /** 是否已固定 - 标识此标签页是否被固定到特定位置 */
  isPinned?: boolean;
  
  /** 排序顺序 - 标签页在面板中的显示顺序，数值越小越靠前 */
  order: number;
  
  /** 滚动位置 - 记录标签页内容的滚动位置，用于恢复用户查看状态 */
  scrollPosition?: { x: number; y: number };
  
  /** 
   * 块类型 - 标识Orca中块的类型
   * 可能的值包括：文本、标题、列表等块类型，以及 "view" 表示视图面板
   * 当 blockType 为 "view" 时，表示这是一个自定义视图面板（如 AI Chat），
   * 而非传统的块编辑器面板
   */
  blockType?: string;
  
  /** 关闭时间戳 - 记录标签页关闭的时间，用于最近关闭标签页功能 */
  closedAt?: number;
  
  /** 
   * 是否为视图面板 - 标识此标签页是否对应自定义视图面板
   * 视图面板（如 AI Chat）没有真正的块ID，使用 "view:${panelId}" 格式的合成ID
   * 当此字段为 true 时，应使用面板导航而非块导航
   */
  isViewPanel?: boolean;
}

/**
 * 标签页位置接口
 * 
 * 定义标签页容器在屏幕上的坐标位置。
 * 用于实现拖拽和位置记忆功能。
 */
export interface TabPosition {
  /** X坐标 - 标签页容器在屏幕上的水平位置（像素） */
  x: number;
  
  /** Y坐标 - 标签页容器在屏幕上的垂直位置（像素） */
  y: number;
}

/**
 * 面板标签页数据接口
 * 
 * 定义单个面板的标签页数据集合。
 * 包含该面板的所有标签页信息和最后激活时间。
 */
export interface PanelTabsData {
  /** 标签页列表 - 该面板包含的所有标签页信息 */
  tabs: TabInfo[];
  
  /** 最后激活时间 - 该面板最后一次被激活的时间戳 */
  lastActive: number;
}

/**
 * 保存的标签页集合接口
 * 
 * 定义用户保存的标签页组合，支持快速切换不同的标签页集合。
 * 这是工作区功能的基础数据结构。
 */
export interface SavedTabSet {
  /** 集合ID - 标签页集合的唯一标识符 */
  id: string;
  
  /** 集合名称 - 用户自定义的集合名称，用于显示和识别 */
  name: string;
  
  /** 标签页列表 - 该集合包含的所有标签页信息 */
  tabs: TabInfo[];
  
  /** 创建时间 - 集合创建的时间戳 */
  createdAt: number;
  
  /** 更新时间 - 集合最后修改的时间戳 */
  updatedAt: number;
  
  /** 自定义图标 - 可选的集合图标，用于视觉识别 */
  icon?: string;
}

/**
 * 工作区接口
 * 
 * 定义工作区的完整信息结构，包含标签页集合和元数据。
 * 工作区是比标签页集合更高级的概念，可以包含多个标签页集合。
 */
export interface Workspace {
  /** 工作区ID - 工作区的唯一标识符 */
  id: string;
  
  /** 工作区名称 - 用户自定义的工作区名称 */
  name: string;
  
  /** 标签页列表 - 该工作区包含的所有标签页信息 */
  tabs: TabInfo[];
  
  /** 创建时间 - 工作区创建的时间戳 */
  createdAt: number;
  
  /** 更新时间 - 工作区最后修改的时间戳 */
  updatedAt: number;
  
  /** 自定义图标 - 可选的工作区图标，用于视觉识别 */
  icon?: string;
  
  /** 工作区描述 - 可选的工作区描述信息，用于详细说明 */
  description?: string;
  
  /** 最后激活的标签页ID - 记录工作区中最后激活的标签页，用于恢复状态 */
  lastActiveTabId?: string;
}

/**
 * 最近切换标签历史接口
 * 
 * 定义单个标签的最近切换历史记录，用于悬浮显示功能。
 * 记录从该标签切换到其他标签的历史，支持快速切换回之前的标签。
 */
export interface RecentTabSwitchHistory {
  /** 标签ID - 当前标签的唯一标识符 */
  tabId: string;
  
  /** 最近切换的标签列表 - 按时间倒序排列，最新的在前 */
  recentTabs: TabInfo[];
  
  /** 最后更新时间 - 记录历史最后更新的时间戳 */
  lastUpdated: number;
  
  /** 最大记录数量 - 限制历史记录的最大数量，避免存储过多数据 */
  maxRecords: number;
}

/**
 * 悬浮标签列表配置接口
 * 
 * 定义悬浮显示标签列表的配置选项，控制显示效果和交互行为。
 */
export interface HoverTabListConfig {
  /** 最大显示数量 - 悬浮列表中最多显示的标签数量 */
  maxDisplayCount: number;
  
  /** 滚动步长 - 每次滚动显示的标签数量 */
  scrollStep: number;
  
  /** 动画持续时间 - 标签大小和透明度变化的动画时间（毫秒） */
  animationDuration: number;
  
  /** 最小透明度 - 最远标签的最小透明度值（0-1） */
  minOpacity: number;
  
  /** 最小缩放比例 - 最远标签的最小缩放比例（0-1） */
  minScale: number;
  
  /** 是否启用滚动 - 是否允许滚动查看更多标签 */
  enableScroll: boolean;
  
  /** 最大宽度 - 悬浮列表的最大宽度（像素） */
  maxWidth?: number;
}
