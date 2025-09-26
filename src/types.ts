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
  
  /** 块类型 - 标识Orca中块的类型（如文本、标题、列表等） */
  blockType?: string;
  
  /** 关闭时间戳 - 记录标签页关闭的时间，用于最近关闭标签页功能 */
  closedAt?: number;
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
