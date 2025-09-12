/**
 * UI相关的工具函数
 */

import { TabInfo } from '../types';
import { createStyledElement, addHoverEffect } from './domUtils';

/**
 * 创建标签元素的基础样式
 */
export function createTabBaseStyle(
  tab: TabInfo,
  isVerticalMode: boolean,
  isDarkMode: boolean,
  applyOklchFormula: (hex: string, type: 'text' | 'background') => string
): string {
  let backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(200, 200, 200, 0.6)';
  let textColor = isDarkMode ? '#ffffff' : '#333';
  let fontWeight = 'normal';
  
  // 如果有颜色，应用颜色样式
  if (tab.color) {
    backgroundColor = applyOklchFormula(tab.color, 'background');
    textColor = applyOklchFormula(tab.color, 'text');
    fontWeight = '600';
  }

  return isVerticalMode ? `
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
}

/**
 * 创建标签内容容器
 */
export function createTabContentContainer(): HTMLElement {
  const tabContent = document.createElement('div');
  tabContent.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `;
  return tabContent;
}

/**
 * 创建标签图标容器
 */
export function createTabIconContainer(icon: string): HTMLElement {
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
  if (icon.startsWith('ti ti-')) {
    const iconElement = document.createElement('i');
    iconElement.className = icon;
    iconContainer.appendChild(iconElement);
  } else {
    // 普通文本图标（如emoji）
    iconContainer.textContent = icon;
  }
  
  return iconContainer;
}

/**
 * 创建标签文本容器
 */
export function createTabTextContainer(title: string): HTMLElement {
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
  textContainer.textContent = title;
  
  return textContainer;
}

/**
 * 创建固定标签的图钉图标
 */
export function createPinIcon(): HTMLElement {
  const pinIcon = document.createElement('span');
  pinIcon.textContent = '📌';
  pinIcon.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `;
  return pinIcon;
}

/**
 * 创建标签悬停提示
 */
export function createTabTooltip(tab: TabInfo): string {
  let tooltip = tab.title;
  if (tab.isPinned) {
    tooltip += " (已固定)";
  }
  return tooltip;
}

/**
 * 创建新建标签页按钮样式
 */
export function createNewTabButtonStyle(isVerticalMode: boolean): string {
  return isVerticalMode ? `
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
}

/**
 * 创建拖拽手柄样式
 */
export function createDragHandleStyle(): string {
  return `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    cursor: move;
    z-index: 9998;
    opacity: 0;
    background-color: transparent;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
  `;
}

/**
 * 创建调整大小手柄样式
 */
export function createResizeHandleStyle(): string {
  return `
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
    pointer-events: auto;
  `;
}

/**
 * 创建拖拽手柄悬停效果样式
 */
export function createDragHandleHoverStyle(): string {
  return `
    .drag-handle:hover {
      opacity: 0.3;
      transition: opacity 0.2s ease;
    }
  `;
}

/**
 * 创建调整大小手柄悬停效果样式
 */
export function createResizeHandleHoverStyle(): string {
  return `
    .resize-handle:hover {
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }
    
    .resize-handle.dragging {
      opacity: 1;
    }
  `;
}

/**
 * 创建操作状态样式
 */
export function createOperationStateStyle(): string {
  return `
    .resizing, .dragging {
      user-select: none !important;
      -webkit-user-select: none !important;
    }
    
    body.resizing {
      cursor: nwse-resize !important;
    }
    
    body.dragging {
      cursor: move !important;
    }
  `;
}

/**
 * 创建状态元素样式
 */
export function createStatusElementStyle(): string {
  return `
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
}

/**
 * 创建右键菜单样式
 */
export function createContextMenuStyle(x: number, y: number, width: number = 180): string {
  return `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    min-width: ${width}px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  `;
}

/**
 * 创建菜单项样式
 */
export function createMenuItemStyle(disabled: boolean = false): string {
  return `
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: ${disabled ? '#999' : '#333'};
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s ease;
  `;
}

/**
 * 创建分隔符样式
 */
export function createSeparatorStyle(): string {
  return `
    height: 1px;
    background: #ddd;
    margin: 4px 8px;
  `;
}

/**
 * 创建对话框样式
 */
export function createDialogStyle(): string {
  return `
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
}

/**
 * 创建按钮样式
 */
export function createButtonStyle(type: 'primary' | 'secondary' | 'danger' = 'primary'): string {
  const styles = {
    primary: `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `,
    secondary: `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `,
    danger: `
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `
  };
  
  return styles[type];
}

/**
 * 创建输入框样式
 */
export function createInputStyle(): string {
  return `
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;
  `;
}

/**
 * 创建滑块样式
 */
export function createSliderStyle(): string {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}

/**
 * 创建标签容器样式
 */
export function createTabContainerStyle(
  isVerticalMode: boolean,
  position: { x: number; y: number },
  backgroundColor: string,
  verticalWidth?: number
): string {
  return isVerticalMode ? `
    position: fixed;
    top: ${position.y}px;
    left: ${position.x}px;
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
    app-region: no-drag;
    width: ${verticalWidth || 200}px;
    min-width: 120px;
    max-width: 400px;
    align-items: stretch;
    overflow-y: auto;
    overflow-x: visible;
  ` : `
    position: fixed;
    top: ${position.y}px;
    left: ${position.x}px;
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
    app-region: no-drag;
    height: 28px;
    align-items: center;
    overflow-y: visible;
    overflow-x: visible;
  `;
}
