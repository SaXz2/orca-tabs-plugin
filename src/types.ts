export interface TabInfo {
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
  closedAt?: number; // 关闭时间戳（用于最近关闭标签页功能）
}

export interface TabPosition {
  x: number;
  y: number;
}

export interface PanelTabsData {
  tabs: TabInfo[];
  lastActive: number; // 时间戳
}

export interface SavedTabSet {
  id: string;
  name: string;
  tabs: TabInfo[];
  createdAt: number;
  updatedAt: number;
  icon?: string; // 自定义图标
}

export interface Workspace {
  id: string;
  name: string;
  tabs: TabInfo[];
  createdAt: number;
  updatedAt: number;
  icon?: string; // 自定义图标
  description?: string; // 工作区描述
  lastActiveTabId?: string; // 最后激活的标签页ID
}
