/**
 * DOM操作相关的工具函数
 */

/**
 * 创建上下文菜单项
 */
export function createContextMenuItem(
  title: string, 
  icon: string, 
  shortcut: string, 
  onClick: () => void
): HTMLElement {
  const item = document.createElement('div');
  item.className = 'orca-tabs-ref-menu-item';
  item.setAttribute('role', 'menuitem');
  item.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
    font-family: var(--orca-fontfamily-ui);
    font-size: var(--orca-fontsize-sm);
    line-height: 1.4;
    border-radius: var(--orca-radius-md);
  `;
  
  // 图标
  const iconElement = document.createElement('i');
  iconElement.className = icon;
  iconElement.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  
  // 标题
  const titleElement = document.createElement('span');
  titleElement.textContent = title;
  titleElement.style.cssText = `
    flex: 1;
    color: var(--orca-color-text-1);
  `;
  
  // 组装元素
  item.appendChild(iconElement);
  item.appendChild(titleElement);
  
  // 快捷键提示（仅当有快捷键时显示）
  if (shortcut && shortcut.trim() !== '') {
    const shortcutElement = document.createElement('span');
    shortcutElement.textContent = shortcut;
    shortcutElement.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `;
    item.appendChild(shortcutElement);
  }
  
  // 悬停效果
  item.addEventListener('mouseenter', () => {
    item.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
  });
  
  item.addEventListener('mouseleave', () => {
    item.style.backgroundColor = 'transparent';
  });
  
  // 点击事件
  item.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
    
    // 关闭菜单
    const menu = item.closest('.orca-context-menu, .context-menu, [role="menu"]') as HTMLElement;
    if (menu) {
      menu.style.display = 'none';
      menu.remove();
    }
  });
  
  return item;
}

/**
 * 创建带样式的元素
 */
export function createStyledElement(
  tagName: string,
  className: string,
  styles: string,
  textContent?: string
): HTMLElement {
  const element = document.createElement(tagName);
  element.className = className;
  element.style.cssText = styles;
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

/**
 * 添加悬停效果
 */
export function addHoverEffect(
  element: HTMLElement,
  hoverStyles: string,
  normalStyles: string
): void {
  element.addEventListener('mouseenter', () => {
    element.style.cssText += hoverStyles;
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.cssText = normalStyles;
  });
}

/**
 * 安全地移除元素
 */
export function safeRemoveElement(element: HTMLElement | null): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * 查找最近的父元素
 */
export function findClosestParent(
  element: HTMLElement,
  selector: string
): HTMLElement | null {
  return element.closest(selector) as HTMLElement | null;
}

// 导入contentVisibilityHelper中的函数用于内部使用
import { shouldAvoidOperation, safeRenderOperation, safeSetCSS, safeAppendChild, safeRemoveChild } from './contentVisibilityHelper';

/**
 * 为了向后兼容，重新导出contentVisibilityHelper中的函数
 */
export {
  shouldAvoidOperation as isElementHiddenByContentVisibility,
  safeRenderOperation,
  safeSetCSS as safeSetElementStyles,
  safeAppendChild,
  safeRemoveChild
} from './contentVisibilityHelper';

/**
 * 获取元素的可见状态信息
 * @param element 要检查的元素
 * @returns 包含可见状态信息的对象
 */
export function getElementVisibilityInfo(element: Element): {
  isVisible: boolean;
  isHiddenByContentVisibility: boolean;
  hasHiddenClass: boolean;
  isDisplayNone: boolean;
  computedVisibility: string;
  computedDisplay: string;
} {
  const computedStyle = window.getComputedStyle(element);
  const contentVisibility = computedStyle.getPropertyValue('content-visibility');
  const visibility = computedStyle.getPropertyValue('visibility');
  const display = computedStyle.getPropertyValue('display');

  return {
    isVisible: !shouldAvoidOperation(element) &&
                visibility !== 'hidden' &&
                display !== 'none' &&
                !element.classList.contains('orca-hideable-hidden'),
    isHiddenByContentVisibility: shouldAvoidOperation(element),
    hasHiddenClass: element.classList.contains('orca-hideable-hidden'),
    isDisplayNone: display === 'none',
    computedVisibility: visibility,
    computedDisplay: display
  };
}
