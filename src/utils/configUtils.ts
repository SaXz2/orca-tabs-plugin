import { PLUGIN_STORAGE_KEYS } from '../constants';
import { TabPosition } from '../types';

/**
 * 配置相关的工具函数
 */

export interface LayoutConfig {
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
}

export interface PositionConfig {
  x: number;
  y: number;
}

/**
 * 创建默认的布局配置
 */
export function createDefaultLayoutConfig(): LayoutConfig {
  return {
    isVerticalMode: false,
    verticalWidth: 200,
    verticalPosition: { x: 20, y: 20 },
    horizontalPosition: { x: 20, y: 20 },
    isSidebarAlignmentEnabled: false,
    isFloatingWindowVisible: true,
    showBlockTypeIcons: true,
    showInHeadbar: true,
    horizontalTabMaxWidth: 130,
    horizontalTabMinWidth: 80,
    enableEdgeHide: false,
    enableBubbleMode: false
  };
}

/**
 * 创建默认的位置配置
 */
export function createDefaultPositionConfig(): PositionConfig {
  return { x: 20, y: 20 };
}

/**
 * 验证位置是否在有效范围内
 */
export function validatePosition(position: TabPosition, isVerticalMode: boolean, verticalWidth: number = 200): TabPosition {
  const estimatedWidth = isVerticalMode ? verticalWidth : 400;
  const estimatedHeight = 40;
  
  const maxX = window.innerWidth - estimatedWidth;
  const maxY = window.innerHeight - estimatedHeight;
  
  return {
    x: Math.max(0, Math.min(position.x, maxX)),
    y: Math.max(0, Math.min(position.y, maxY))
  };
}

/**
 * 合并布局配置，使用默认值填充缺失的属性
 */
export function mergeLayoutConfig(saved: Partial<LayoutConfig>): LayoutConfig {
  const defaultConfig = createDefaultLayoutConfig();
  
  return {
    isVerticalMode: saved.isVerticalMode ?? defaultConfig.isVerticalMode,
    verticalWidth: saved.verticalWidth ?? defaultConfig.verticalWidth,
    verticalPosition: saved.verticalPosition ?? defaultConfig.verticalPosition,
    horizontalPosition: saved.horizontalPosition ?? defaultConfig.horizontalPosition,
    isSidebarAlignmentEnabled: saved.isSidebarAlignmentEnabled !== undefined ? saved.isSidebarAlignmentEnabled : defaultConfig.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: saved.isFloatingWindowVisible ?? defaultConfig.isFloatingWindowVisible,
    showBlockTypeIcons: saved.showBlockTypeIcons ?? defaultConfig.showBlockTypeIcons,
    showInHeadbar: saved.showInHeadbar ?? defaultConfig.showInHeadbar,
    horizontalTabMaxWidth: saved.horizontalTabMaxWidth ?? defaultConfig.horizontalTabMaxWidth,
    horizontalTabMinWidth: saved.horizontalTabMinWidth ?? defaultConfig.horizontalTabMinWidth,
    enableEdgeHide: saved.enableEdgeHide ?? defaultConfig.enableEdgeHide,
    enableBubbleMode: saved.enableBubbleMode ?? defaultConfig.enableBubbleMode
  };
}

/**
 * 根据布局模式获取正确的位置
 */
export function getPositionByMode(
  isVerticalMode: boolean, 
  verticalPosition: TabPosition, 
  horizontalPosition: TabPosition
): TabPosition {
  return isVerticalMode ? { ...verticalPosition } : { ...horizontalPosition };
}

/**
 * 更新位置配置
 */
export function updatePositionConfig(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalPosition: TabPosition,
  horizontalPosition: TabPosition
): { verticalPosition: TabPosition; horizontalPosition: TabPosition } {
  if (isVerticalMode) {
    return {
      verticalPosition: { ...position },
      horizontalPosition: { ...horizontalPosition }
    };
  } else {
    return {
      verticalPosition: { ...verticalPosition },
      horizontalPosition: { ...position }
    };
  }
}

/**
 * 生成布局配置的日志信息
 */
export function generateLayoutLogMessage(config: LayoutConfig): string {
  return `布局模式: ${config.isVerticalMode ? '垂直' : '水平'}, 垂直宽度: ${config.verticalWidth}px, 垂直位置: (${config.verticalPosition.x}, ${config.verticalPosition.y}), 水平位置: (${config.horizontalPosition.x}, ${config.horizontalPosition.y})`;
}

/**
 * 生成位置配置的日志信息
 */
export function generatePositionLogMessage(position: TabPosition, isVerticalMode: boolean): string {
  return `位置已${isVerticalMode ? '垂直' : '水平'}模式 (${position.x}, ${position.y})`;
}
