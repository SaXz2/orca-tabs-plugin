/**
 * Content-Visibility 隐藏元素保护工具
 * 简单直接的修复方案，避免对隐藏元素进行渲染操作
 */

/**
 * 检查元素是否应该避免操作
 * @param element 要检查的元素
 * @returns 如果应该避免操作则返回 true
 */
export function shouldAvoidOperation(element: Element): boolean {
  if (!element) return true;

  try {
    const computedStyle = window.getComputedStyle(element);

    // 检查 content-visibility
    if (computedStyle.getPropertyValue('content-visibility') === 'hidden') {
      return true;
    }

    // 检查 display: none
    if (computedStyle.getPropertyValue('display') === 'none') {
      return true;
    }

    // 检查 visibility: hidden
    if (computedStyle.getPropertyValue('visibility') === 'hidden') {
      return true;
    }

    // 检查 opacity: 0
    if (computedStyle.getPropertyValue('opacity') === '0') {
      return true;
    }

    // 递归检查父元素
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.getPropertyValue('content-visibility') === 'hidden') {
        return true;
      }
      parent = parent.parentElement;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * 安全的样式设置函数
 * @param element 目标元素
 * @param cssText CSS样式文本
 * @returns 是否成功设置
 */
export function safeSetCSS(element: HTMLElement, cssText: string): boolean {
  if (!element || shouldAvoidOperation(element)) {
    return false;
  }

  try {
    element.style.cssText = cssText;
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 安全的DOM添加函数
 * @param parent 父元素
 * @param child 子元素
 * @returns 是否成功添加
 */
export function safeAppendChild(parent: HTMLElement, child: Node): boolean {
  if (!parent || !child || shouldAvoidOperation(parent)) {
    return false;
  }

  try {
    parent.appendChild(child);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 安全的DOM移除函数
 * @param parent 父元素
 * @param child 子元素
 * @returns 是否成功移除
 */
export function safeRemoveChild(parent: HTMLElement, child: Node): boolean {
  if (!parent || !child || shouldAvoidOperation(parent)) {
    return false;
  }

  try {
    if (child.parentNode === parent) {
      parent.removeChild(child);
    }
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 检查特定选择器的元素是否隐藏
 * @param selectors 选择器数组
 * @returns 是否有任何隐藏元素
 */
export function hasHiddenElements(selectors: string[]): boolean {
  return selectors.some(selector => {
    const element = document.querySelector(selector);
    return element && shouldAvoidOperation(element);
  });
}

/**
 * 安全地执行可能触发渲染的操作（向后兼容函数）
 * @param element 要操作的元素
 * @param renderOperation 渲染操作函数
 * @returns 操作是否被执行
 */
export function safeRenderOperation(
  element: Element,
  renderOperation: () => void
): boolean {
  if (shouldAvoidOperation(element)) {
    return false;
  }

  try {
    renderOperation();
    return true;
  } catch (error) {
    return false;
  }
}