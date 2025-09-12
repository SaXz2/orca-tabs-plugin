// 定义配置常量
export const AppKeys = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
} as const;

// 定义属性类型常量
export const PropType = {
  JSON: 0,
  Text: 1
} as const;

// 插件专用存储键定义
export const PLUGIN_STORAGE_KEYS = {
  FIRST_PANEL_TABS: 'first-panel-tabs',      // 第一个面板的标签数据
  CLOSED_TABS: 'closed-tabs',               // 已关闭标签列表
  FLOATING_WINDOW_VISIBLE: 'floating-window-visible', // 浮窗可见状态
  TABS_POSITION: 'tabs-position',           // 标签位置
  LAYOUT_MODE: 'layout-mode',               // 布局模式
} as const;
