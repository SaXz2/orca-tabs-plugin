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
}

export interface TabPosition {
  x: number;
  y: number;
}

export interface PanelTabsData {
  tabs: TabInfo[];
  lastActive: number; // 时间戳
}
