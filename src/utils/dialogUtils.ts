/**
 * 对话框相关的工具函数
 */

import { createDialogStyle, createButtonStyle, createInputStyle, createSliderStyle, createContextMenuStyle, createMenuItemStyle, createSeparatorStyle } from './uiUtils';

/**
 * 对话框配置接口
 */
export interface DialogConfig {
  title?: string;
  message?: string;
  width?: number;
  height?: number;
  closable?: boolean;
  modal?: boolean;
  backdrop?: boolean;
  animation?: boolean;
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  zIndex?: number;
}

/**
 * 确认对话框配置接口
 */
export interface ConfirmDialogConfig extends DialogConfig {
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * 输入对话框配置接口
 */
export interface InputDialogConfig extends DialogConfig {
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'password' | 'email' | 'number';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
}

/**
 * 进度对话框配置接口
 */
export interface ProgressDialogConfig extends DialogConfig {
  showPercentage?: boolean;
  showCancel?: boolean;
  cancelText?: string;
  onCancel?: () => void;
}

/**
 * 通知配置接口
 */
export interface NotificationConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  closable?: boolean;
  autoClose?: boolean;
  animation?: boolean;
}

/**
 * 工具提示配置接口
 */
export interface TooltipConfig {
  position?: { x: number; y: number };
  offset?: { x: number; y: number };
  arrow?: boolean;
  theme?: 'light' | 'dark';
  maxWidth?: number;
  delay?: number;
}

/**
 * 上下文菜单配置接口
 */
export interface ContextMenuConfig {
  position: { x: number; y: number };
  items: ContextMenuItem[];
  theme?: 'light' | 'dark';
  maxHeight?: number;
  onClose?: () => void;
}

/**
 * 上下文菜单项接口
 */
export interface ContextMenuItem {
  text: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

/**
 * 对话框管理器接口
 */
export interface DialogManager {
  show: (dialog: HTMLElement) => void;
  hide: (dialog: HTMLElement) => void;
  close: (dialog: HTMLElement) => void;
  closeAll: () => void;
  isOpen: (dialog: HTMLElement) => boolean;
  getOpenDialogs: () => HTMLElement[];
}

/**
 * 创建基础对话框
 */
export function createDialog(config: DialogConfig = {}): HTMLElement {
  const dialog = document.createElement('div');
  dialog.className = 'orca-dialog';
  
  const {
    title,
    message,
    width = 400,
    height = 'auto',
    closable = true,
    modal = true,
    backdrop = true,
    animation = true,
    position = 'center',
    zIndex = 1000
  } = config;
  
  // 应用样式
  const dialogStyle = createDialogStyle();
  dialog.style.cssText = dialogStyle;
  
  // 设置尺寸和位置
  dialog.style.width = typeof width === 'number' ? `${width}px` : width;
  dialog.style.height = typeof height === 'number' ? `${height}px` : height;
  dialog.style.zIndex = zIndex.toString();
  
  // 设置位置
  if (position === 'center') {
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
  }
  
  // 添加动画类
  if (animation) {
    dialog.classList.add('dialog-animate');
  }
  
  // 创建内容
  if (title) {
    const titleElement = document.createElement('div');
    titleElement.className = 'dialog-title';
    titleElement.textContent = title;
    dialog.appendChild(titleElement);
  }
  
  if (message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'dialog-message';
    messageElement.textContent = message;
    dialog.appendChild(messageElement);
  }
  
  // 添加关闭按钮
  if (closable) {
    const closeButton = document.createElement('button');
    closeButton.className = 'dialog-close';
    closeButton.innerHTML = '×';
    closeButton.onclick = () => closeDialog(dialog);
    dialog.appendChild(closeButton);
  }
  
  // 添加模态背景
  if (modal && backdrop) {
    const backdropElement = document.createElement('div');
    backdropElement.className = 'dialog-backdrop';
    backdropElement.onclick = () => closeDialog(dialog);
    document.body.appendChild(backdropElement);
  }
  
  return dialog;
}

/**
 * 创建确认对话框
 */
export function createConfirmDialog(config: ConfirmDialogConfig): HTMLElement {
  const {
    title = '确认',
    message = '确定要执行此操作吗？',
    confirmText = '确定',
    cancelText = '取消',
    confirmButtonClass = 'btn-primary',
    cancelButtonClass = 'btn-secondary',
    onConfirm,
    onCancel,
    ...dialogConfig
  } = config;
  
  const dialog = createDialog({
    ...dialogConfig,
    title,
    message
  });
  
  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dialog-buttons';
  
  // 确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = `btn ${confirmButtonClass}`;
  confirmButton.textContent = confirmText;
  confirmButton.onclick = () => {
    if (onConfirm) onConfirm();
    closeDialog(dialog);
  };
  
  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = `btn ${cancelButtonClass}`;
  cancelButton.textContent = cancelText;
  cancelButton.onclick = () => {
    if (onCancel) onCancel();
    closeDialog(dialog);
  };
  
  buttonContainer.appendChild(confirmButton);
  buttonContainer.appendChild(cancelButton);
  dialog.appendChild(buttonContainer);
  
  return dialog;
}

/**
 * 创建输入对话框
 */
export function createInputDialog(config: InputDialogConfig): HTMLElement {
  const {
    title = '输入',
    message = '请输入内容：',
    placeholder = '',
    defaultValue = '',
    inputType = 'text',
    required = false,
    minLength,
    maxLength,
    pattern,
    confirmText = '确定',
    cancelText = '取消',
    onConfirm,
    onCancel,
    ...dialogConfig
  } = config;
  
  const dialog = createDialog({
    ...dialogConfig,
    title,
    message
  });
  
  // 创建输入框
  const inputContainer = document.createElement('div');
  inputContainer.className = 'dialog-input-container';
  
  const input = document.createElement('input');
  input.type = inputType;
  input.placeholder = placeholder;
  input.value = defaultValue;
  input.required = required;
  
  if (minLength !== undefined) input.minLength = minLength;
  if (maxLength !== undefined) input.maxLength = maxLength;
  if (pattern) input.pattern = pattern;
  
  input.style.cssText = createInputStyle();
  inputContainer.appendChild(input);
  dialog.appendChild(inputContainer);
  
  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dialog-buttons';
  
  // 确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = 'btn btn-primary';
  confirmButton.textContent = confirmText;
  confirmButton.onclick = () => {
    const value = input.value.trim();
    if (required && !value) {
      input.focus();
      return;
    }
    if (onConfirm) onConfirm(value);
    closeDialog(dialog);
  };
  
  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-secondary';
  cancelButton.textContent = cancelText;
  cancelButton.onclick = () => {
    if (onCancel) onCancel();
    closeDialog(dialog);
  };
  
  buttonContainer.appendChild(confirmButton);
  buttonContainer.appendChild(cancelButton);
  dialog.appendChild(buttonContainer);
  
  // 聚焦输入框
  setTimeout(() => input.focus(), 100);
  
  return dialog;
}

/**
 * 创建进度对话框
 */
export function createProgressDialog(config: ProgressDialogConfig): {
  dialog: HTMLElement;
  updateProgress: (progress: number) => void;
  close: () => void;
} {
  const {
    title = '处理中',
    message = '请稍候...',
    showPercentage = true,
    showCancel = false,
    cancelText = '取消',
    onCancel,
    ...dialogConfig
  } = config;
  
  const dialog = createDialog({
    ...dialogConfig,
    title,
    message
  });
  
  // 创建进度条容器
  const progressContainer = document.createElement('div');
  progressContainer.className = 'dialog-progress-container';
  
  const progressBar = document.createElement('div');
  progressBar.className = 'dialog-progress-bar';
  progressBar.style.cssText = `
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: var(--orca-radius-md);
    overflow: hidden;
  `;
  
  const progressFill = document.createElement('div');
  progressFill.className = 'dialog-progress-fill';
  progressFill.style.cssText = `
    width: 0%;
    height: 100%;
    background-color: #2196f3;
    transition: width 0.3s ease;
  `;
  
  progressBar.appendChild(progressFill);
  progressContainer.appendChild(progressBar);
  
  // 百分比显示
  const percentageText = document.createElement('div');
  percentageText.className = 'dialog-progress-text';
  percentageText.style.cssText = `
    text-align: center;
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  `;
  
  if (showPercentage) {
    progressContainer.appendChild(percentageText);
  }
  
  dialog.appendChild(progressContainer);
  
  // 创建按钮容器
  if (showCancel) {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'dialog-buttons';
    
    const cancelButton = document.createElement('button');
    cancelButton.className = 'btn btn-secondary';
    cancelButton.textContent = cancelText;
    cancelButton.onclick = () => {
      if (onCancel) onCancel();
      closeDialog(dialog);
    };
    
    buttonContainer.appendChild(cancelButton);
    dialog.appendChild(buttonContainer);
  }
  
  const updateProgress = (progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));
    progressFill.style.width = `${clampedProgress}%`;
    if (showPercentage) {
      percentageText.textContent = `${Math.round(clampedProgress)}%`;
    }
  };
  
  const close = () => closeDialog(dialog);
  
  return { dialog, updateProgress, close };
}

/**
 * 创建通知
 */
export function createNotification(
  message: string,
  config: NotificationConfig = {}
): HTMLElement {
  const {
    type = 'info',
    duration = 3000,
    position = 'top-right',
    closable = true,
    autoClose = true,
    animation = true
  } = config;
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const colors = {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3'
  };
  
  const positionStyles = {
    'top-right': 'top: 20px; right: 20px;',
    'top-left': 'top: 20px; left: 20px;',
    'bottom-right': 'bottom: 20px; right: 20px;',
    'bottom-left': 'bottom: 20px; left: 20px;',
    'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
    'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
  };
  
  notification.style.cssText = `
    position: fixed;
    ${positionStyles[position]}
    background-color: ${colors[type]};
    color: white;
    padding: 12px 20px;
    border-radius: var(--orca-radius-md);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    max-width: 300px;
    word-wrap: break-word;
    ${animation ? 'animation: slideIn 0.3s ease;' : ''}
  `;
  
  notification.textContent = message;
  
  // 添加关闭按钮
  if (closable) {
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      margin-left: 10px;
      padding: 0;
      line-height: 1;
    `;
    closeButton.onclick = () => closeNotification(notification);
    notification.appendChild(closeButton);
  }
  
  // 自动关闭
  if (autoClose && duration > 0) {
    setTimeout(() => closeNotification(notification), duration);
  }
  
  document.body.appendChild(notification);
  
  return notification;
}

/**
 * 创建加载指示器
 */
export function createLoadingIndicator(text: string = '加载中...'): HTMLElement {
  const container = document.createElement('div');
  container.className = 'loading-indicator';
  
  container.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 8px;
    z-index: 10000;
    text-align: center;
    min-width: 120px;
  `;
  
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff40;
    border-top: 2px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 10px;
  `;
  
  const textElement = document.createElement('div');
  textElement.textContent = text;
  textElement.style.cssText = `
    font-size: 14px;
    margin-top: 10px;
  `;
  
  container.appendChild(spinner);
  container.appendChild(textElement);
  
  document.body.appendChild(container);
  
  return container;
}

/**
 * 创建工具提示
 */
export function createTooltip(
  text: string,
  config: TooltipConfig = {}
): HTMLElement {
  const {
    position = { x: 0, y: 0 },
    offset = { x: 0, y: 0 },
    arrow = true,
    theme = 'light',
    maxWidth = 200,
    delay = 0
  } = config;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;
  
  const themeStyles = {
    light: {
      backgroundColor: 'var(--orca-color-bg-1)',
      color: 'var(--orca-color-text-1)',
      border: '1px solid #555'
    },
    dark: {
      backgroundColor: 'var(--orca-color-bg-1)',
      color: 'var(--orca-color-text-1)',
      border: '1px solid #ddd'
    }
  };
  
  const currentTheme = themeStyles[theme];
  
  tooltip.style.cssText = `
    position: fixed;
    left: ${position.x + offset.x}px;
    top: ${position.y + offset.y}px;
    background-color: ${currentTheme.backgroundColor};
    color: ${currentTheme.color};
    border: ${currentTheme.border};
    padding: 8px 12px;
    border-radius: var(--orca-radius-md);
    font-size: 12px;
    z-index: 10000;
    max-width: ${maxWidth}px;
    word-wrap: break-word;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  `;
  
  if (arrow) {
    const arrowElement = document.createElement('div');
    arrowElement.style.cssText = `
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid ${currentTheme.backgroundColor};
    `;
    tooltip.appendChild(arrowElement);
  }
  
  document.body.appendChild(tooltip);
  
  // 延迟显示
  if (delay > 0) {
    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, delay);
  } else {
    tooltip.style.opacity = '1';
  }
  
  return tooltip;
}

/**
 * 创建上下文菜单
 */
export function createContextMenu(config: ContextMenuConfig): HTMLElement {
  const {
    position,
    items,
    theme = 'light',
    maxHeight = 300,
    onClose
  } = config;
  
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  
  const themeStyles = {
    light: {
      backgroundColor: 'var(--orca-color-bg-1)',
      color: 'var(--orca-color-text-1)',
      border: '1px solid #ddd',
      shadow: '0 2px 8px rgba(0,0,0,0.15)'
    },
    dark: {
      backgroundColor: 'var(--orca-color-bg-1)',
      color: 'var(--orca-color-text-1)',
      border: '1px solid #555',
      shadow: '0 2px 8px rgba(0,0,0,0.3)'
    }
  };
  
  const currentTheme = themeStyles[theme];
  
  const menuStyle = createContextMenuStyle(position.x, position.y, 180, maxHeight);
  menu.style.cssText = menuStyle + `
    background-color: ${currentTheme.backgroundColor};
    color: ${currentTheme.color};
    border: ${currentTheme.border};
    box-shadow: ${currentTheme.shadow};
    max-height: ${maxHeight}px;
    overflow-y: auto;
  `;
  
  items.forEach((item, index) => {
    if (item.separator) {
      const separator = document.createElement('div');
      separator.style.cssText = createSeparatorStyle();
      menu.appendChild(separator);
    } else {
      const menuItem = document.createElement('div');
      menuItem.className = 'context-menu-item';
      menuItem.style.cssText = createMenuItemStyle();
      
      if (item.icon) {
        const iconElement = document.createElement('span');
        iconElement.textContent = item.icon;
        iconElement.style.marginRight = '8px';
        menuItem.appendChild(iconElement);
      }
      
      const textElement = document.createElement('span');
      textElement.textContent = item.text;
      menuItem.appendChild(textElement);
      
      if (!item.disabled) {
        menuItem.style.cursor = 'pointer';
        menuItem.onclick = () => {
          item.action();
          closeContextMenu(menu);
          if (onClose) onClose();
        };
      } else {
        menuItem.style.opacity = '0.5';
        menuItem.style.cursor = 'not-allowed';
      }
      
      menu.appendChild(menuItem);
    }
  });
  
  document.body.appendChild(menu);
  
  // 点击外部关闭菜单
  const closeOnClickOutside = (e: MouseEvent) => {
    if (!menu.contains(e.target as Node)) {
      closeContextMenu(menu);
      if (onClose) onClose();
      document.removeEventListener('click', closeOnClickOutside);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeOnClickOutside);
  }, 0);
  
  return menu;
}

/**
 * 创建标签宽度调整对话框
 */
export function createWidthAdjustmentDialog(
  maxWidth: number,
  minWidth: number,
  onInput: (maxWidth: number, minWidth: number) => void,
  onCancel?: () => void
): HTMLElement;
/**
 * 创建面板宽度调整对话框
 */
export function createWidthAdjustmentDialog(
  currentWidth: number,
  onInput: (width: number) => void,
  onCancel: () => void
): HTMLElement;
export function createWidthAdjustmentDialog(
  maxWidthOrCurrentWidth: number,
  minWidthOrOnInput: number | ((width: number) => void),
  onConfirmOrOnCancel?: ((maxWidth: number, minWidth: number) => void) | (() => void),
  onCancel?: () => void
): HTMLElement {
  // 判断是水平布局还是垂直布局的参数
  if (typeof minWidthOrOnInput === 'number' && typeof onConfirmOrOnCancel === 'function') {
    // 水平布局：调整标签宽度
    return createHorizontalWidthDialog(maxWidthOrCurrentWidth, minWidthOrOnInput, onConfirmOrOnCancel as (maxWidth: number, minWidth: number) => void, onCancel);
  } else if (typeof minWidthOrOnInput === 'function' && typeof onConfirmOrOnCancel === 'function') {
    // 垂直布局：调整面板宽度
    return createVerticalWidthDialog(maxWidthOrCurrentWidth, minWidthOrOnInput as (width: number) => void, onConfirmOrOnCancel as () => void);
  }
  
  throw new Error('Invalid parameters for createWidthAdjustmentDialog');
}

/**
 * 创建水平布局标签宽度调整对话框
 */
function createHorizontalWidthDialog(
  maxWidth: number,
  minWidth: number,
  onInput: (maxWidth: number, minWidth: number) => void,
  onCancel?: () => void
): HTMLElement {
  const dialog = document.createElement('div');
  dialog.className = 'width-adjustment-dialog';
  
  const dialogStyle = createDialogStyle();
  dialog.style.cssText = dialogStyle;
  
  // 标题
  const title = document.createElement('div');
  title.className = 'dialog-title';
  title.textContent = '调整标签宽度';
  dialog.appendChild(title);
  
  // 最大宽度滑块容器
  const maxWidthContainer = document.createElement('div');
  maxWidthContainer.className = 'dialog-slider-container';
  maxWidthContainer.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  
  // 最大宽度标签
  const maxWidthLabel = document.createElement('div');
  maxWidthLabel.textContent = '最大宽度 (80px - 200px)';
  maxWidthLabel.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
  `;
  
  // 最大宽度滑块
  const maxWidthSlider = document.createElement('input');
  maxWidthSlider.type = 'range';
  maxWidthSlider.min = '80';
  maxWidthSlider.max = '200';
  maxWidthSlider.value = maxWidth.toString();
  maxWidthSlider.style.cssText = createSliderStyle();
  
  // 最大宽度显示
  const maxWidthDisplay = document.createElement('div');
  maxWidthDisplay.className = 'dialog-width-display';
  maxWidthDisplay.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `;
  maxWidthDisplay.textContent = `最大宽度: ${maxWidth}px`;
  
  // 最小宽度滑块容器
  const minWidthContainer = document.createElement('div');
  minWidthContainer.className = 'dialog-slider-container';
  minWidthContainer.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  
  // 最小宽度标签
  const minWidthLabel = document.createElement('div');
  minWidthLabel.textContent = '最小宽度 (60px - 150px)';
  minWidthLabel.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
  `;
  
  // 最小宽度滑块
  const minWidthSlider = document.createElement('input');
  minWidthSlider.type = 'range';
  minWidthSlider.min = '60';
  minWidthSlider.max = '150';
  minWidthSlider.value = minWidth.toString();
  minWidthSlider.style.cssText = createSliderStyle();
  
  // 最小宽度显示
  const minWidthDisplay = document.createElement('div');
  minWidthDisplay.className = 'dialog-width-display';
  minWidthDisplay.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `;
  minWidthDisplay.textContent = `最小宽度: ${minWidth}px`;
  
  // 防抖定时器
  let debounceTimer: number | null = null;
  
  // 防抖更新函数
  const debouncedUpdate = (maxWidth: number, minWidth: number) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    debounceTimer = window.setTimeout(() => {
      onInput(maxWidth, minWidth);
      debounceTimer = null;
    }, 150); // 150ms防抖延迟
  };
  
  // 滑块事件
  maxWidthSlider.oninput = () => {
    const newMaxWidth = parseInt(maxWidthSlider.value);
    const newMinWidth = parseInt(minWidthSlider.value);
    
    // 确保最大宽度不小于最小宽度
    if (newMaxWidth < newMinWidth) {
      minWidthSlider.value = newMaxWidth.toString();
      minWidthDisplay.textContent = `最小宽度: ${newMaxWidth}px`;
    }
    
    maxWidthDisplay.textContent = `最大宽度: ${newMaxWidth}px`;
    
    // 使用防抖更新
    const finalMaxWidth = parseInt(maxWidthSlider.value);
    const finalMinWidth = parseInt(minWidthSlider.value);
    debouncedUpdate(finalMaxWidth, finalMinWidth);
  };
  
  minWidthSlider.oninput = () => {
    const newMaxWidth = parseInt(maxWidthSlider.value);
    const newMinWidth = parseInt(minWidthSlider.value);
    
    // 确保最小宽度不大于最大宽度
    if (newMinWidth > newMaxWidth) {
      maxWidthSlider.value = newMinWidth.toString();
      maxWidthDisplay.textContent = `最大宽度: ${newMinWidth}px`;
    }
    
    minWidthDisplay.textContent = `最小宽度: ${newMinWidth}px`;
    
    // 使用防抖更新
    const finalMaxWidth = parseInt(maxWidthSlider.value);
    const finalMinWidth = parseInt(minWidthSlider.value);
    debouncedUpdate(finalMaxWidth, finalMinWidth);
  };
  
  // 组装最大宽度容器
  maxWidthContainer.appendChild(maxWidthLabel);
  maxWidthContainer.appendChild(maxWidthSlider);
  maxWidthContainer.appendChild(maxWidthDisplay);
  
  // 组装最小宽度容器
  minWidthContainer.appendChild(minWidthLabel);
  minWidthContainer.appendChild(minWidthSlider);
  minWidthContainer.appendChild(minWidthDisplay);
  
  dialog.appendChild(maxWidthContainer);
  dialog.appendChild(minWidthContainer);
  
  // 按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dialog-buttons';
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  
  // 确定按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = 'btn btn-primary';
  confirmButton.textContent = '确定';
  confirmButton.style.cssText = createButtonStyle();
  confirmButton.onclick = () => {
    // 确定时保存设置
    const finalMaxWidth = parseInt(maxWidthSlider.value);
    const finalMinWidth = parseInt(minWidthSlider.value);
    onInput(finalMaxWidth, finalMinWidth);
    closeDialog(dialog);
  };
  
  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-secondary';
  cancelButton.textContent = '取消';
  cancelButton.style.cssText = createButtonStyle();
  cancelButton.onclick = () => {
    // 取消时恢复原始设置
    if (onCancel) {
      onCancel();
    }
    closeDialog(dialog);
  };
  
  buttonContainer.appendChild(confirmButton);
  buttonContainer.appendChild(cancelButton);
  dialog.appendChild(buttonContainer);
  
  return dialog;
}

/**
 * 创建垂直布局面板宽度调整对话框
 */
function createVerticalWidthDialog(
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
  title.className = 'dialog-title';
  title.textContent = '调整面板宽度';
  dialog.appendChild(title);
  
  // 滑块容器
  const sliderContainer = document.createElement('div');
  sliderContainer.className = 'dialog-slider-container';
  sliderContainer.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  
  // 滑块
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '120';
  slider.max = '800';
  slider.value = currentWidth.toString();
  slider.style.cssText = createSliderStyle();
  
  // 宽度显示
  const widthDisplay = document.createElement('div');
  widthDisplay.className = 'dialog-width-display';
  widthDisplay.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `;
  widthDisplay.textContent = `当前宽度: ${currentWidth}px`;
  
  // 滑块事件
  slider.oninput = () => {
    const newWidth = parseInt(slider.value);
    widthDisplay.textContent = `当前宽度: ${newWidth}px`;
    onInput(newWidth);
  };
  
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(widthDisplay);
  dialog.appendChild(sliderContainer);
  
  // 按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dialog-buttons';
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  
  // 确定按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = 'btn btn-primary';
  confirmButton.textContent = '确定';
  confirmButton.style.cssText = createButtonStyle();
  confirmButton.onclick = () => closeDialog(dialog);
  
  // 取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = 'btn btn-secondary';
  cancelButton.textContent = '取消';
  cancelButton.style.cssText = createButtonStyle();
  cancelButton.onclick = () => {
    onCancel();
    closeDialog(dialog);
  };
  
  buttonContainer.appendChild(confirmButton);
  buttonContainer.appendChild(cancelButton);
  dialog.appendChild(buttonContainer);
  
  return dialog;
}

/**
 * 关闭对话框
 */
export function closeDialog(dialog: HTMLElement): void {
  if (dialog && dialog.parentNode) {
    dialog.parentNode.removeChild(dialog);
  }
  
  // 移除相关的背景
  const backdrop = document.querySelector('.dialog-backdrop');
  if (backdrop) {
    backdrop.remove();
  }
}

/**
 * 关闭通知
 */
export function closeNotification(notification: HTMLElement): void {
  if (notification && notification.parentNode) {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }
}

/**
 * 关闭上下文菜单
 */
export function closeContextMenu(menu: HTMLElement): void {
  if (menu && menu.parentNode) {
    menu.parentNode.removeChild(menu);
  }
}

/**
 * 关闭加载指示器
 */
export function closeLoadingIndicator(indicator: HTMLElement): void {
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

/**
 * 关闭工具提示
 */
export function closeTooltip(tooltip: HTMLElement): void {
  if (tooltip && tooltip.parentNode) {
    tooltip.parentNode.removeChild(tooltip);
  }
}

/**
 * 对话框管理器
 */
export class DialogManagerImpl implements DialogManager {
  private openDialogs: Set<HTMLElement> = new Set();
  
  show(dialog: HTMLElement): void {
    this.openDialogs.add(dialog);
    document.body.appendChild(dialog);
  }
  
  hide(dialog: HTMLElement): void {
    if (dialog.parentNode) {
      dialog.style.display = 'none';
    }
  }
  
  close(dialog: HTMLElement): void {
    this.openDialogs.delete(dialog);
    closeDialog(dialog);
  }
  
  closeAll(): void {
    this.openDialogs.forEach(dialog => this.close(dialog));
    this.openDialogs.clear();
  }
  
  isOpen(dialog: HTMLElement): boolean {
    return this.openDialogs.has(dialog);
  }
  
  getOpenDialogs(): HTMLElement[] {
    return Array.from(this.openDialogs);
  }
}

/**
 * 全局对话框管理器实例
 */
export const dialogManager = new DialogManagerImpl();

/**
 * 显示确认对话框
 */
export function showConfirmDialog(config: ConfirmDialogConfig): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = createConfirmDialog({
      ...config,
      onConfirm: () => {
        if (config.onConfirm) config.onConfirm();
        resolve(true);
      },
      onCancel: () => {
        if (config.onCancel) config.onCancel();
        resolve(false);
      }
    });
    
    dialogManager.show(dialog);
  });
}

/**
 * 显示输入对话框
 */
export function showInputDialog(config: InputDialogConfig): Promise<string | null> {
  return new Promise((resolve) => {
    const dialog = createInputDialog({
      ...config,
      onConfirm: (value) => {
        if (config.onConfirm) config.onConfirm(value);
        resolve(value);
      },
      onCancel: () => {
        if (config.onCancel) config.onCancel();
        resolve(null);
      }
    });
    
    dialogManager.show(dialog);
  });
}

/**
 * 显示通知
 */
export function showNotification(message: string, config: NotificationConfig = {}): HTMLElement {
  return createNotification(message, config);
}

/**
 * 显示加载指示器
 */
export function showLoadingIndicator(text: string = '加载中...'): HTMLElement {
  return createLoadingIndicator(text);
}

/**
 * 显示工具提示
 */
export function showTooltip(text: string, config: TooltipConfig = {}): HTMLElement {
  return createTooltip(text, config);
}

/**
 * 显示上下文菜单
 */
export function showContextMenu(config: ContextMenuConfig): HTMLElement {
  return createContextMenu(config);
}

/**
 * 添加对话框样式到页面
 */
export function addDialogStyles(): void {
  if (document.getElementById('dialog-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'dialog-styles';
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-20px);
        opacity: 0;
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
    
    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .dialog-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .dialog-message {
      margin-bottom: 20px;
      line-height: 1.5;
    }
    
    .dialog-input-container {
      margin: 20px 0;
    }
    
    .dialog-progress-container {
      margin: 20px 0;
    }
    
    .dialog-progress-bar {
      width: 100%;
      height: 8px;
      background-color: #e0e0e0;
      border-radius: var(--orca-radius-md);
      overflow: hidden;
    }
    
    .dialog-progress-fill {
      height: 100%;
      background-color: #2196f3;
      transition: width 0.3s ease;
    }
    
    .dialog-progress-text {
      text-align: center;
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }
    
    .dialog-close {
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      line-height: 1;
    }
    
    .dialog-close:hover {
      color: #333;
    }
    
    .btn {
      padding: .175rem var(--orca-spacing-md);
      border: none;
      border-radius: var(--orca-radius-md);
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    .btn-primary {
      background-color: #2196f3;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #1976d2;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .btn-secondary:hover {
      background-color: #e0e0e0;
    }
  `;
  
  document.head.appendChild(style);
}
