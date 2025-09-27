/**
 * UI相关的工具函数
 */

import { TabInfo } from '../types';
import { createStyledElement, addHoverEffect } from './domUtils';

/**
 * 创建标签元素的基础样式 - 优化为纯CSS变量方式
 */
export function createTabBaseStyle(
  tab: TabInfo,
  isVerticalMode: boolean,
  applyOklchFormula: (hex: string, type: 'text' | 'background') => string
): string {
  // 使用CSS变量设置默认颜色，让浏览器自动响应主题变化
  let backgroundColor: string = 'var(--orca-tab-bg)';
  let textColor: string = 'var(--orca-color-text-1)';
  let fontWeight = 'normal';
  let customColorProps = '';
  
  // 如果有颜色，设置自定义属性让CSS处理
  if (tab.color) {
    try {
      // 确保颜色值以#开头
      const colorHex = tab.color.startsWith('#') ? tab.color : `#${tab.color}`;
      
      // 使用CSS自定义属性存储颜色，让CSS变量处理主题响应
      customColorProps = `--tab-color: ${colorHex};`;
      backgroundColor = 'var(--orca-tab-colored-bg)';
      textColor = 'var(--orca-tab-colored-text)';
      fontWeight = '600';
    } catch (error) {
      // 如果颜色处理失败，使用默认颜色
    }
  }

  return isVerticalMode ? `
    ${customColorProps}
    background: ${backgroundColor};
    color: ${textColor};
    font-weight: ${fontWeight};
    padding: 2px 8px;
    border-radius: var(--orca-radius-md);
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
    ${customColorProps}
    background: ${backgroundColor};
    color: ${textColor};
    font-weight: ${fontWeight};
    padding: 2px 8px;
    border-radius: var(--orca-radius-md);
    height: 24px;
    max-height: 24px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    max-width: 110px;
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
}

/**
 * 创建拖拽手柄样式
 */
export function createDragHandleStyle(): string {
  return `
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
}

/**
 * 创建调整大小手柄样式
 */
export function createResizeHandleStyle(): string {
  return `
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
}

/**
 * 创建状态元素样式
 */
export function createStatusElementStyle(): string {
  return `
    background: var(--orca-color-bg-1);
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
}

/**
 * 创建右键菜单样式
 */
export function createContextMenuStyle(x: number, y: number, width: number = 180): string {
  return `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    background: var(--orca-color-bg-1);
    border: 1px solid #ddd;
    border-radius: var(--orca-radius-md);
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
    padding: .175rem var(--orca-spacing-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: ${disabled ? '#999' : 'var(--orca-color-text-1)'};
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
    background: var(--orca-color-bg-1);
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
  const classMap = {
    primary: 'orca-button orca-button-primary',
    secondary: 'orca-button',
    danger: 'orca-button'
  };
  return classMap[type];
}

/**
 * 创建输入框样式
 */
export function createInputStyle(): string {
  return `
    border: 1px solid #ddd;
    border-radius: var(--orca-radius-md);
    padding: .175rem var(--orca-spacing-md);
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
    border-radius: var(--orca-radius-md);
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
    border-radius: var(--orca-radius-md);
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
