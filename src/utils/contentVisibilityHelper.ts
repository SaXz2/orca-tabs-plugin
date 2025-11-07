/**
 * Content-Visibility 隐藏元素保护工具
 * 增强的修复方案，全面避免对隐藏元素进行渲染操作
 */

// 全局开关，用于控制是否启用严格模式
let STRICT_MODE = true;

/**
 * 启用或禁用严格模式
 * @param enabled 是否启用严格模式
 */
export function setStrictMode(enabled: boolean): void {
  STRICT_MODE = enabled;
}

/**
 * 检查元素是否应该避免操作
 * @param element 要检查的元素
 * @returns 如果应该避免操作则返回 true
 */
export function shouldAvoidOperation(element: Element): boolean {
  if (!element) return true;

  // 首先检查已知的隐藏元素特征，避免调用getComputedStyle
  if (element.classList && (
    element.classList.contains('orca-hideable-hidden') ||
    element.id === 'sidebar'
  )) {
    if (STRICT_MODE) {
      console.debug(`[ContentVisibilityHelper] 跳过操作：已知隐藏元素`, element);
    }
    return true;
  }

  // 递归检查父元素是否为已知隐藏元素
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    if (parent.classList && (
      parent.classList.contains('orca-hideable-hidden') ||
      parent.id === 'sidebar'
    )) {
      if (STRICT_MODE) {
        console.debug(`[ContentVisibilityHelper] 跳过操作：父元素为已知隐藏元素`, parent);
      }
      return true;
    }
    parent = parent.parentElement;
  }

  try {
    // 只有对未知元素才调用getComputedStyle
    const computedStyle = window.getComputedStyle(element);

    // 检查 content-visibility
    const contentVisibility = computedStyle.getPropertyValue('content-visibility');
    if (contentVisibility === 'hidden') {
      if (STRICT_MODE) {
        console.debug(`[ContentVisibilityHelper] 跳过操作：元素有 content-visibility: hidden`, element);
      }
      return true;
    }

    // 检查 display: none
    const display = computedStyle.getPropertyValue('display');
    if (display === 'none') {
      return true;
    }

    // 检查 visibility: hidden
    const visibility = computedStyle.getPropertyValue('visibility');
    if (visibility === 'hidden') {
      return true;
    }

    // 检查 opacity: 0
    const opacity = computedStyle.getPropertyValue('opacity');
    if (opacity === '0') {
      return true;
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
 * 安全地获取元素的计算样式，避免对content-visibility隐藏的元素进行计算
 * @param element 要获取样式的元素
 * @returns CSSStyleDeclaration 或 null（如果元素被隐藏）
 */
export function safeGetComputedStyle(element: Element): CSSStyleDeclaration | null {
  if (!element) {
    return null;
  }

  // 首先检查已知隐藏元素，避免调用getComputedStyle
  if (element.classList && (
    element.classList.contains('orca-hideable-hidden') ||
    element.id === 'sidebar'
  )) {
    return null;
  }

  // 检查父元素是否为已知隐藏元素
  let parent = element.parentElement;
  while (parent && parent !== document.body) {
    if (parent.classList && (
      parent.classList.contains('orca-hideable-hidden') ||
      parent.id === 'sidebar'
    )) {
      return null;
    }
    parent = parent.parentElement;
  }

  try {
    // 只对可能可见的元素调用getComputedStyle
    const style = window.getComputedStyle(element);

    // 再次检查计算样式
    if (style.getPropertyValue('content-visibility') === 'hidden' ||
        style.getPropertyValue('display') === 'none') {
      return null;
    }

    return style;
  } catch (error) {
    return null;
  }
}

/**
 * 安全地获取元素的位置信息，避免对content-visibility隐藏的元素进行布局计算
 * @param element 要获取位置的元素
 * @returns 包含left, top的对象，如果元素被隐藏则返回null
 */
export function safeGetElementPosition(element: Element): { left: number; top: number } | null {
  const style = safeGetComputedStyle(element);
  if (!style) {
    return null;
  }

  try {
    const left = parseFloat(style.left);
    const top = parseFloat(style.top);
    return { left, top };
  } catch (error) {
    return null;
  }
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
    console.debug(`[ContentVisibilityHelper] 安全阻止了可能触发渲染警告的操作`, element);
    return false;
  }

  try {
    // 在操作前再次快速检查
    const computedStyle = safeGetComputedStyle(element);
    if (!computedStyle || computedStyle.getPropertyValue('content-visibility') === 'hidden') {
      console.debug(`[ContentVisibilityHelper] 二次检查发现隐藏元素，阻止操作`, element);
      return false;
    }

    renderOperation();
    return true;
  } catch (error) {
    console.debug(`[ContentVisibilityHelper] 渲染操作失败:`, error);
    return false;
  }
}