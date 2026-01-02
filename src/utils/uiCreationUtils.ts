/**
 * UI创建相关的工具函数
 */

import { TabInfo, TabPosition, HoverTabListConfig } from '../types';
import { createStyledElement, addHoverEffect, safeRemoveElement, safeSetElementStyles, safeRenderOperation } from './domUtils';
import { createTabContainerStyle, createDialogStyle, createButtonStyle, createInputStyle, createSliderStyle, createContextMenuStyle, createMenuItemStyle, createSeparatorStyle } from './uiUtils';
import { simpleVerbose } from './logUtils';

/**
 * 创建标签容器
 */
export function createTabContainer(
  isVerticalMode: boolean,
  position: TabPosition,
  verticalWidth: number,
  backgroundColor: string,
  enableBubbleMode?: boolean,
  isBubbleExpanded?: boolean
): HTMLElement {
  const container = document.createElement('div');
  container.className = isVerticalMode 
    ? 'orca-tabs-plugin orca-tabs-container vertical'
    : 'orca-tabs-plugin orca-tabs-container';
  
  const containerStyle = createTabContainerStyle(
    isVerticalMode,
    position,
    backgroundColor,
    verticalWidth,
    undefined,
    undefined,
    enableBubbleMode,
    isBubbleExpanded
  );
  // 使用安全的样式设置，避免在隐藏元素中设置样式
  safeSetElementStyles(container, containerStyle);
  
  return container;
}

/**
 * 创建功能切换按钮
 */
export function createFeatureToggleButton(
  isVerticalMode: boolean,
  isEnabled: boolean,
  onClick: (e: MouseEvent) => void
): HTMLElement {
  const button = document.createElement('div');
  button.className = 'feature-toggle-button';
  button.innerHTML = isEnabled ? '🔒' : '🔓';
  button.title = isEnabled ? '中键固定/双击关闭 (已启用)' : '中键固定/双击关闭 (已禁用)';
  
  const buttonStyle = isVerticalMode ? `
    width: calc(100% - 6px);
    margin: 0 3px;
    height: 24px;
    background: ${isEnabled ? 'rgba(0, 150, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${isEnabled ? '#004400' : '#660000'};
    min-height: 24px;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    border-radius: var(--orca-radius-md);
    transition: all 0.2s ease;
    border: 2px solid ${isEnabled ? 'rgba(0, 150, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)'};
    z-index: 1000;
  ` : `
    width: 28px;
    height: 28px;
    background: ${isEnabled ? 'rgba(0, 150, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)'};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${isEnabled ? '#004400' : '#660000'};
    margin-left: 4px;
    min-height: 28px;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    border-radius: var(--orca-radius-md);
    transition: all 0.2s ease;
    border: 2px solid ${isEnabled ? 'rgba(0, 150, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)'};
    z-index: 1000;
  `;
  
  // 使用安全的样式设置
  safeSetElementStyles(button, buttonStyle);
  button.addEventListener('click', onClick);
  
  // 添加悬停效果
  addHoverEffect(button, isEnabled ? '#006600' : '#666', isEnabled ? '#004400' : '#333');
  
  return button;
}

/**
 * 创建新建标签按钮
 */
export function createNewTabButton(
  isVerticalMode: boolean,
  onClick: (e: MouseEvent) => void
): HTMLElement {
  const button = document.createElement('div');
  button.className = 'new-tab-button';
  button.innerHTML = '+';
  button.title = '新建标签页';
  
  const buttonStyle = isVerticalMode ? `
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
  
  // 使用安全的样式设置
  safeSetElementStyles(button, buttonStyle);
  button.addEventListener('click', onClick);
  
  // 添加悬停效果
  addHoverEffect(button, '#666', '#333');
  
  return button;
}

/**
 * 创建拖拽手柄
 */
export function createDragHandle(
  isVerticalMode: boolean,
  onMouseDown: (e: MouseEvent) => void
): HTMLElement {
  const handle = document.createElement('div');
  handle.className = 'drag-handle';
  handle.innerHTML = '⋮⋮';
  handle.title = '拖拽移动';
  
  const handleStyle = isVerticalMode ? `
    width: calc(100% - 6px);
    margin: 0 3px;
    height: 24px;
    background: transparent;
    cursor: move;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #666;
    min-height: 24px;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    border-radius: var(--orca-radius-md);
    transition: all 0.2s ease;
  ` : `
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
  
  // 使用安全的样式设置
  safeSetElementStyles(handle, handleStyle);
  handle.addEventListener('mousedown', onMouseDown);
  
  return handle;
}

/**
 * 创建调整大小手柄
 */
export function createResizeHandle(
  onMouseDown: (e: MouseEvent) => void
): HTMLElement {
  const handle = document.createElement('div');
  handle.className = 'resize-handle';
  handle.title = '调整大小';
  
  const handleStyle = `
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
  
  // 使用安全的样式设置
  safeSetElementStyles(handle, handleStyle);
  handle.addEventListener('mousedown', onMouseDown);
  
  return handle;
}

/**
 * 创建状态元素
 */
export function createStatusElement(
  text: string,
  isVerticalMode: boolean
): HTMLElement {
  const status = document.createElement('div');
  status.className = 'status-element';
  status.textContent = text;
  
  const statusStyle = `
    background: rgba(100, 150, 200, 0.6);
    color: #333;
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
  
  status.style.cssText = statusStyle;
  
  return status;
}

/**
 * 创建宽度调整对话框
 */
export function createWidthAdjustmentDialog(
  currentWidth: number,
  onInput: (width: number) => void,
  onCancel: () => void
): HTMLElement {
  const dialog = document.createElement('div');
  dialog.className = 'width-adjustment-dialog';
  
  const dialogStyle = createDialogStyle();
  dialog.style.cssText = dialogStyle;

  // 标题
  const title = document.createElement('div');
  title.textContent = '调整面板宽度';
  title.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  `;

  // 当前宽度显示
  const currentWidthDisplay = document.createElement('div');
  currentWidthDisplay.textContent = `当前面板宽度: ${currentWidth}px`;
  currentWidthDisplay.style.cssText = `
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  `;

  // 滑块容器
  const sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = `margin-bottom: 16px;`;

  // 滑块标签
  const sliderLabel = document.createElement('div');
  sliderLabel.textContent = '宽度 (120px - 400px)';
  sliderLabel.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
  `;

  // 滑块
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '120';
  slider.max = '400';
  slider.value = currentWidth.toString();
  slider.style.cssText = createSliderStyle();

  // 滑块进度样式
  const updateSliderStyle = (value: number) => {
    const percentage = ((value - 120) / (400 - 120)) * 100;
    slider.style.background = `
      linear-gradient(to right, #007acc 0%, #007acc ${percentage}%, #ddd ${percentage}%, #ddd 100%)
    `;
  };
  updateSliderStyle(currentWidth);

  // 宽度显示
  const widthDisplay = document.createElement('div');
  widthDisplay.textContent = `${currentWidth}px`;
  widthDisplay.style.cssText = `
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #007acc;
    margin-top: 8px;
  `;

  // 滑块事件
  slider.addEventListener('input', (e) => {
    const value = parseInt((e.target as HTMLInputElement).value);
    widthDisplay.textContent = `${value}px`;
    updateSliderStyle(value);
    onInput(value);
  });

  // 按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  `;

  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = createButtonStyle('secondary');
  cancelButton.textContent = '取消';
  cancelButton.addEventListener('click', () => {
    onCancel();
    safeRemoveElement(dialog);
  });

  // 确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = createButtonStyle('primary');
  confirmButton.textContent = '确认';
  confirmButton.addEventListener('click', () => {
    // 确认按钮只是关闭对话框，实际保存已经在onInput中处理
    safeRemoveElement(dialog);
  });

  // 组装对话框
  sliderContainer.appendChild(sliderLabel);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(widthDisplay);
  
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(confirmButton);
  
  dialog.appendChild(title);
  dialog.appendChild(currentWidthDisplay);
  dialog.appendChild(sliderContainer);
  dialog.appendChild(buttonContainer);

  return dialog;
}

/**
 * 创建确认对话框
 */
export function createConfirmDialog(
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
): HTMLElement {
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  
  const dialogStyle = createDialogStyle();
  dialog.style.cssText = dialogStyle;

  // 标题
  const titleElement = document.createElement('div');
  titleElement.textContent = title;
  titleElement.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  `;

  // 消息
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.cssText = `
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
    line-height: 1.5;
  `;

  // 按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  `;

  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = createButtonStyle('secondary');
  cancelButton.textContent = '取消';
  cancelButton.addEventListener('click', () => {
    if (onCancel) onCancel();
    safeRemoveElement(dialog);
  });

  // 确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = createButtonStyle('danger');
  confirmButton.textContent = '确认';
  confirmButton.addEventListener('click', () => {
    onConfirm();
    safeRemoveElement(dialog);
  });

  // 组装对话框
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(confirmButton);
  
  dialog.appendChild(titleElement);
  dialog.appendChild(messageElement);
  dialog.appendChild(buttonContainer);

  return dialog;
}

/**
 * 创建输入对话框
 */
export function createInputDialog(
  title: string,
  placeholder: string,
  defaultValue: string = '',
  onConfirm: (value: string) => void,
  onCancel?: () => void
): HTMLElement {
  const dialog = document.createElement('div');
  dialog.className = 'input-dialog';
  
  const dialogStyle = createDialogStyle();
  dialog.style.cssText = dialogStyle;

  // 标题
  const titleElement = document.createElement('div');
  titleElement.textContent = title;
  titleElement.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  `;

  // 输入框
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = placeholder;
  input.value = defaultValue;
  input.style.cssText = createInputStyle();

  // 按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 16px;
  `;

  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = createButtonStyle('secondary');
  cancelButton.textContent = '取消';
  cancelButton.addEventListener('click', () => {
    if (onCancel) onCancel();
    safeRemoveElement(dialog);
  });

  // 确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = createButtonStyle('primary');
  confirmButton.textContent = '确认';
  confirmButton.addEventListener('click', () => {
    onConfirm(input.value);
    safeRemoveElement(dialog);
  });

  // 回车确认
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      onConfirm(input.value);
      safeRemoveElement(dialog);
    } else if (e.key === 'Escape') {
      if (onCancel) onCancel();
      safeRemoveElement(dialog);
    }
  });

  // 自动聚焦
  setTimeout(() => input.focus(), 0);

  // 组装对话框
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(confirmButton);
  
  dialog.appendChild(titleElement);
  dialog.appendChild(input);
  dialog.appendChild(buttonContainer);

  return dialog;
}

/**
 * 创建进度对话框
 */
export function createProgressDialog(
  title: string,
  message: string
): { dialog: HTMLElement; updateProgress: (progress: number) => void; close: () => void } {
  const dialog = document.createElement('div');
  dialog.className = 'progress-dialog';
  
  const dialogStyle = createDialogStyle();
  dialog.style.cssText = dialogStyle;

  // 标题
  const titleElement = document.createElement('div');
  titleElement.textContent = title;
  titleElement.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  `;

  // 消息
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.cssText = `
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  `;

  // 进度条容器
  const progressContainer = document.createElement('div');
  progressContainer.style.cssText = `
    width: 100%;
    height: 8px;
    background: #e5e5e5;
    border-radius: var(--orca-radius-md);
    overflow: hidden;
    margin-bottom: 16px;
  `;

  // 进度条
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    width: 0%;
    height: 100%;
    background: #007acc;
    border-radius: var(--orca-radius-md);
    transition: width 0.3s ease;
  `;

  // 进度文本
  const progressText = document.createElement('div');
  progressText.textContent = '0%';
  progressText.style.cssText = `
    text-align: center;
    font-size: 14px;
    color: #666;
  `;

  // 更新进度
  const updateProgress = (progress: number) => {
    const percentage = Math.min(100, Math.max(0, progress));
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}%`;
  };

  // 关闭对话框
  const close = () => {
    safeRemoveElement(dialog);
  };

  // 组装对话框
  progressContainer.appendChild(progressBar);
  dialog.appendChild(titleElement);
  dialog.appendChild(messageElement);
  dialog.appendChild(progressContainer);
  dialog.appendChild(progressText);

  return { dialog, updateProgress, close };
}

/**
 * 创建通知消息
 */
export function createNotification(
  message: string,
  type: 'success' | 'error' | 'warning' | 'info' = 'info',
  duration: number = 3000
): HTMLElement {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const colors = {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3'
  };

  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 12px 16px;
    border-radius: var(--orca-radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    max-width: 300px;
    word-wrap: break-word;
    animation: slideInRight 0.3s ease;
  `;

  // 图标
  const icon = document.createElement('span');
  icon.textContent = icons[type];
  icon.style.cssText = `
    font-size: 16px;
    font-weight: bold;
  `;

  // 消息
  const messageElement = document.createElement('span');
  messageElement.textContent = message;

  // 关闭按钮
  const closeButton = document.createElement('button');
  closeButton.className = 'orca-button';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => {
    safeRemoveElement(notification);
  });

  // 组装通知
  notification.appendChild(icon);
  notification.appendChild(messageElement);
  notification.appendChild(closeButton);

  // 自动关闭
  if (duration > 0) {
    setTimeout(() => {
      safeRemoveElement(notification);
    }, duration);
  }

  return notification;
}

/**
 * 创建加载指示器
 */
export function createLoadingIndicator(
  text: string = '加载中...'
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'loading-indicator';
  
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  `;

  // 旋转动画
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;

  // 文本
  const textElement = document.createElement('div');
  textElement.textContent = text;
  textElement.style.cssText = `
    font-size: 14px;
    color: white;
  `;

  // 添加CSS动画
  if (!document.getElementById('loading-animations')) {
    const style = document.createElement('style');
    style.id = 'loading-animations';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(spinner);
  container.appendChild(textElement);

  return container;
}

/**
 * 创建工具提示
 */
export function createTooltip(
  text: string,
  position: { x: number; y: number }
): HTMLElement {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  
  tooltip.style.cssText = `
    position: fixed;
    left: ${position.x}px;
    top: ${position.y - 30}px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 8px;
    border-radius: var(--orca-radius-md);
    font-size: 12px;
    z-index: 10000;
    pointer-events: none;
    white-space: nowrap;
    max-width: 200px;
    word-wrap: break-word;
  `;

  return tooltip;
}

/**
 * 创建上下文菜单
 */
export function createContextMenu(
  items: Array<{
    text: string;
    icon?: string;
    action: () => void;
    disabled?: boolean;
  }>,
  position: { x: number; y: number }
): HTMLElement {
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  
  const menuStyle = createContextMenuStyle(position.x, position.y);
  menu.style.cssText = menuStyle;

  items.forEach((item, index) => {
    if (item.text === '---') {
      // 分隔符
      const separator = document.createElement('div');
      separator.style.cssText = createSeparatorStyle();
      menu.appendChild(separator);
    } else {
      // 菜单项
      const menuItem = document.createElement('div');
      menuItem.className = 'context-menu-item';
      menuItem.style.cssText = createMenuItemStyle(item.disabled);
      
      if (item.icon) {
        const icon = document.createElement('span');
        icon.textContent = item.icon;
        icon.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
        `;
        menuItem.appendChild(icon);
      }
      
      const text = document.createElement('span');
      text.textContent = item.text;
      menuItem.appendChild(text);
      
      if (!item.disabled) {
        menuItem.addEventListener('click', () => {
          item.action();
          safeRemoveElement(menu);
        });
        
        // 悬停效果
        addHoverEffect(menuItem, 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.2)');
      }
      
      menu.appendChild(menuItem);
    }
  });

  // 点击外部关闭菜单
  const closeMenu = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      safeRemoveElement(menu);
      document.removeEventListener('click', closeMenu);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
  }, 0);

  return menu;
}

/**
 * 创建悬浮标签列表容器
 */
export function createHoverTabListContainer(
  config: HoverTabListConfig,
  position: { x: number; y: number },
  isVerticalMode: boolean
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'hover-tab-list-container';
  
  const containerStyle = `
    position: fixed;
    left: ${position.x}px;
    top: ${position.y}px;
    z-index: 10000;
    background: var(--orca-bg-primary, #ffffff);
    border: 1px solid var(--orca-border-color, #e0e0e0);
    border-radius: var(--orca-radius-md, 6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 4px;
    max-height: ${config.maxDisplayCount * 32 + 8}px;
    width: ${config.maxWidth || 150}px;
    overflow: hidden;
    pointer-events: auto;
    transition: opacity 0.2s ease, transform 0.2s ease;
    opacity: 0;
    transform: translateY(-10px);
  `;
  
  container.style.cssText = containerStyle;
  
  // 创建滚动容器
  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'hover-tab-list-scroll';
  scrollContainer.style.cssText = `
    overflow-y: auto;
    overflow-x: hidden;
    max-height: ${config.maxDisplayCount * 32}px;
    scrollbar-width: thin;
    scrollbar-color: var(--orca-scrollbar-thumb, #c0c0c0) var(--orca-scrollbar-track, #f0f0f0);
  `;
  
  // 添加滚动条样式
  const scrollbarStyle = `
    .hover-tab-list-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .hover-tab-list-scroll::-webkit-scrollbar-track {
      background: var(--orca-scrollbar-track, #f0f0f0);
      border-radius: 3px;
    }
    .hover-tab-list-scroll::-webkit-scrollbar-thumb {
      background: var(--orca-scrollbar-thumb, #c0c0c0);
      border-radius: 3px;
    }
    .hover-tab-list-scroll::-webkit-scrollbar-thumb:hover {
      background: var(--orca-scrollbar-thumb-hover, #a0a0a0);
    }
  `;
  
  // 添加样式到页面
  if (!document.getElementById('hover-tab-list-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'hover-tab-list-styles';
    styleElement.textContent = scrollbarStyle;
    document.head.appendChild(styleElement);
  }
  
  container.appendChild(scrollContainer);
  
  // 显示动画
  requestAnimationFrame(() => {
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  });
  
  return container;
}

/**
 * 创建悬浮标签项
 */
export function createHoverTabItem(
  tab: TabInfo,
  index: number,
  config: HoverTabListConfig,
  onClick: (tab: TabInfo) => void,
  isVerticalMode: boolean
): HTMLElement {
  const item = document.createElement('div');
  item.className = 'hover-tab-item';
  item.setAttribute('data-tab-id', tab.tabId || tab.blockId);
  
  // 计算透明度和缩放比例
  const maxIndex = config.maxDisplayCount - 1;
  const opacity = Math.max(config.minOpacity, 1 - (index / maxIndex) * (1 - config.minOpacity));
  const scale = Math.max(config.minScale, 1 - (index / maxIndex) * (1 - config.minScale));
  
  const itemStyle = `
    display: flex;
    align-items: center;
    padding: 6px 8px;
    margin: 2px 0;
    border-radius: var(--orca-radius-sm, 4px);
    cursor: pointer;
    transition: all ${config.animationDuration}ms ease;
    opacity: ${opacity};
    transform: scale(${scale});
    background: transparent;
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
    color: var(--orca-text-primary, #333333);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 24px;
    max-height: 24px;
  `;
  
  item.style.cssText = itemStyle;
  
  // 添加标签内容
  const content = document.createElement('div');
  content.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
  `;
  
  // 添加图标（如果有）
  if (tab.icon) {
    const icon = document.createElement('span');
    // 判断是emoji还是icon class
    // emoji通常是单个字符或很短的字符串，不包含空格
    // icon class通常是 "ti ti-xxx" 格式，包含空格
    if (tab.icon.includes(' ') || tab.icon.startsWith('ti-')) {
      // tabler icon class
      icon.className = tab.icon;
    } else {
      // emoji或其他文本图标
      icon.textContent = tab.icon;
    }
    icon.style.cssText = `
      margin-right: 6px;
      font-size: 12px;
      flex-shrink: 0;
    `;
    content.appendChild(icon);
  }
  
  // 添加标题
  const title = document.createElement('span');
  title.textContent = tab.title;
  title.style.cssText = `
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `;
  content.appendChild(title);
  
  item.appendChild(content);
  
  // 添加点击事件
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick(tab);
  });
  
  // 添加悬停效果
  item.addEventListener('mouseenter', () => {
    item.style.background = 'var(--orca-bg-hover, rgba(0, 0, 0, 0.05))';
    item.style.transform = `scale(${Math.min(1, scale + 0.05)})`;
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.background = 'transparent';
    item.style.transform = `scale(${scale})`;
  });
  
  return item;
}

/**
 * 更新悬浮标签列表
 */
export function updateHoverTabList(
  container: HTMLElement,
  tabs: TabInfo[],
  config: HoverTabListConfig,
  onClick: (tab: TabInfo) => void,
  isVerticalMode: boolean,
  scrollOffset: number = 0
): void {
  const scrollContainer = container.querySelector('.hover-tab-list-scroll') as HTMLElement;
  if (!scrollContainer) return;
  
  // 清空现有内容
  scrollContainer.innerHTML = '';
  
  // 计算显示范围
  const startIndex = scrollOffset;
  const endIndex = Math.min(startIndex + config.maxDisplayCount, tabs.length);
  const visibleTabs = tabs.slice(startIndex, endIndex);
  
  // 创建标签项
  visibleTabs.forEach((tab, index) => {
    const item = createHoverTabItem(tab, index, config, onClick, isVerticalMode);
    scrollContainer.appendChild(item);
  });
  
  // 更新滚动位置
  if (scrollOffset > 0) {
    scrollContainer.scrollTop = scrollOffset * 32; // 每个标签项高度约32px
  }
}

/**
 * 显示悬浮标签列表
 */
export function showHoverTabList(
  tabs: TabInfo[],
  position: { x: number; y: number },
  config: HoverTabListConfig,
  onClick: (tab: TabInfo) => void,
  isVerticalMode: boolean
): HTMLElement {
  simpleVerbose('🎨 showHoverTabList 被调用', { tabs: tabs.length, position, config });
  
  // 移除现有的悬浮列表
  const existingContainer = document.querySelector('.hover-tab-list-container') as HTMLElement;
  if (existingContainer) {
    simpleVerbose('🗑️ 移除现有的悬浮列表');
    safeRemoveElement(existingContainer);
  }
  
  // 创建新容器
  simpleVerbose('🏗️ 创建新容器');
  const container = createHoverTabListContainer(config, position, isVerticalMode);
  simpleVerbose('📦 容器创建完成', container);
  
  // 使用安全的DOM添加操作
  if (document.body) {
    safeRenderOperation(document.body, () => {
      document.body.appendChild(container);
    });
  }
  simpleVerbose('📄 容器已添加到页面');
  
  // 更新内容
  simpleVerbose('🔄 更新内容');
  updateHoverTabList(container, tabs, config, onClick, isVerticalMode);
  simpleVerbose('✅ 内容更新完成');
  
  return container;
}

/**
 * 隐藏悬浮标签列表
 */
export function hideHoverTabList(): void {
  const container = document.querySelector('.hover-tab-list-container') as HTMLElement;
  if (container) {
    // 添加淡出动画
    container.style.opacity = '0';
    container.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      safeRemoveElement(container);
    }, 200);
  }
}
