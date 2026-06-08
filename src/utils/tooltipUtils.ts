/**
 * 简单的 Tooltip 工具函数
 * 使用原生 DOM 实现悬浮提示
 */

import { safeGetComputedStyle, safeGetElementPosition } from './domUtils';

export interface TooltipConfig {
  /** 提示文本 */
  text: string;
  /** 快捷键（可选） */
  shortcut?: string;
  /** 延迟时间 */
  delay?: number;
  /** 默认位置 */
  defaultPlacement?: "top" | "bottom" | "left" | "right";
  /** 自定义类名 */
  className?: string;
}

// 使用 WeakMap 存储清理函数，避免在 DOM 节点上挂载以 "_" 开头的属性
const tooltipCleanupMap: WeakMap<HTMLElement, () => void> = new WeakMap();

/**
 * 为元素添加悬浮提示
 * @param element 目标元素
 * @param config 提示配置
 */
export function addTooltip(element: HTMLElement, config: TooltipConfig): void {
  if (!element || !config.text) {
    // 静默跳过无效的tooltip配置
    return;
  }

  // 懒创建 tooltip，只有显示时才创建并插入 DOM
  let tooltip: HTMLDivElement | null = null;

  let showTimeout: number | null = null;
  let hideTimeout: number | null = null;
  // 不再使用 MutationObserver；改为严格的创建-销毁策略

  // 显示 tooltip
  const showTooltip = (e: MouseEvent) => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    showTimeout = setTimeout(() => {
      // 检查元素是否仍然在 DOM 中且可见
      if (!element.isConnected || !document.body.contains(element)) {
        return;
      }

      // 获取元素位置
      const rect = element.getBoundingClientRect();
      
      // 验证 rect 是否有效（防止元素不在视口或已被移除）
      if (!rect || rect.width === 0 || rect.height === 0 || 
          (rect.top === 0 && rect.left === 0 && rect.bottom === 0 && rect.right === 0)) {
        // 元素无效或不可见，不显示 tooltip
        return;
      }

      // 创建并插入
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = `orca-tooltip ${config.className || ''}`;
        const tooltipText = config.shortcut ? `${config.text} (${config.shortcut})` : config.text;
        tooltipText.split('\n').forEach((line, index) => {
          if (index > 0) {
            tooltip!.appendChild(document.createElement('br'));
          }
          tooltip!.appendChild(document.createTextNode(line));
        });
        tooltip.style.cssText = `
          position: absolute;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        `;
        document.body.appendChild(tooltip);
      }

      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'hidden';
      
      // 等待一帧确保 tooltip 已渲染
      requestAnimationFrame(() => {
        if (!tooltip || !tooltip.parentNode) return;
        
        const tooltipRect = tooltip.getBoundingClientRect();
        
        // 验证 tooltipRect 是否有效
        if (!tooltipRect || tooltipRect.width === 0 || tooltipRect.height === 0) {
          // tooltip 未正确渲染，隐藏并清理
          hideTooltip();
          return;
        }
      
      let left = 0;
      let top = 0;
      let placement = config.defaultPlacement || 'top';

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = 8;

      // 智能位置选择：检查默认位置是否合适，如果不合适则自动调整
      const calculatePosition = (pos: "top" | "bottom" | "left" | "right") => {
        let x = 0, y = 0;
        switch (pos) {
          case 'top':
            x = rect.left + (rect.width - tooltipRect.width) / 2;
            y = rect.top - tooltipRect.height - 8;
            break;
          case 'bottom':
            x = rect.left + (rect.width - tooltipRect.width) / 2;
            y = rect.bottom + 8;
            break;
          case 'left':
            x = rect.left - tooltipRect.width - 8;
            y = rect.top + (rect.height - tooltipRect.height) / 2;
            break;
          case 'right':
            x = rect.right + 8;
            y = rect.top + (rect.height - tooltipRect.height) / 2;
            break;
        }
        return { x, y };
      };

      // 检查位置是否合适（不超出屏幕边界）
      const isPositionValid = (pos: "top" | "bottom" | "left" | "right") => {
        const { x, y } = calculatePosition(pos);
        return x >= margin && 
               x + tooltipRect.width <= viewportWidth - margin &&
               y >= margin && 
               y + tooltipRect.height <= viewportHeight - margin;
      };

      // 智能选择最佳位置
      if (isPositionValid(placement)) {
        // 默认位置合适，使用默认位置
        const pos = calculatePosition(placement);
        left = pos.x;
        top = pos.y;
      } else {
        // 默认位置不合适，尝试其他位置
        const alternatives: ("top" | "bottom" | "left" | "right")[] = 
          placement === 'bottom' ? ['top', 'left', 'right'] : 
          placement === 'top' ? ['bottom', 'left', 'right'] :
          placement === 'left' ? ['right', 'top', 'bottom'] :
          ['left', 'top', 'bottom'];

        let foundValidPosition = false;
        for (const alt of alternatives) {
          if (isPositionValid(alt)) {
            const pos = calculatePosition(alt);
            left = pos.x;
            top = pos.y;
            placement = alt;
            foundValidPosition = true;
            break;
          }
        }

        // 如果所有位置都不合适，使用默认位置但进行边界调整
        if (!foundValidPosition) {
          const pos = calculatePosition(placement);
          left = pos.x;
          top = pos.y;
        }
      }

        // 最终边界检查和调整
        // 水平边界检查
        if (left < margin) {
          left = margin;
        } else if (left + tooltipRect.width > viewportWidth - margin) {
          left = viewportWidth - tooltipRect.width - margin;
        }

        // 垂直边界检查
        if (top < margin) {
          top = margin;
        } else if (top + tooltipRect.height > viewportHeight - margin) {
          top = viewportHeight - tooltipRect.height - margin;
        }

        // 如果 tooltip 太宽，尝试调整位置
        if (tooltipRect.width > viewportWidth - 2 * margin) {
          left = margin;
          tooltip.style.maxWidth = `${viewportWidth - 2 * margin}px`;
        }

        // 最终安全检查：确保位置值有效
        if (isNaN(left) || isNaN(top) || !isFinite(left) || !isFinite(top)) {
          console.warn('[Tooltip] Invalid position calculated, hiding tooltip');
          hideTooltip();
          return;
        }

        // 确保位置值不为负数（额外的安全检查）
        left = Math.max(0, left);
        top = Math.max(0, top);

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.visibility = 'visible';
      });
    }, config.delay || 500) as unknown as number; // 性能优化：增加延迟到500ms
  };

  // 隐藏 tooltip（立即从 DOM 移除，防止遗留）
  const hideTooltip = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }

    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    // 立即清理 tooltip，不使用延迟
    if (tooltip) {
      try {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      } catch (error) {
        // 如果移除失败，尝试其他方法
        console.warn('Tooltip removal failed, trying alternative method:', error);
        tooltip.remove?.();
      }
      tooltip = null;
    }
  };

  // 鼠标移动监听器：如果鼠标移动太快，隐藏 tooltip
  const handleMouseMove = (e: MouseEvent) => {
    if (tooltip && tooltip.parentNode) {
      const rect = element.getBoundingClientRect();
      const isOutside = 
        e.clientX < rect.left - 10 ||
        e.clientX > rect.right + 10 ||
        e.clientY < rect.top - 10 ||
        e.clientY > rect.bottom + 10;
      
      if (isOutside) {
        hideTooltip();
      }
    }
  };

  // 绑定事件
  element.addEventListener('mouseenter', showTooltip);
  element.addEventListener('mouseleave', hideTooltip);
  element.addEventListener('mousedown', hideTooltip);
  element.addEventListener('mousemove', handleMouseMove);

  // 存储清理函数（通过 WeakMap）
  const cleanup = () => {
    if (showTimeout) clearTimeout(showTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);
    element.removeEventListener('mouseenter', showTooltip);
    element.removeEventListener('mouseleave', hideTooltip);
    element.removeEventListener('mousedown', hideTooltip);
    element.removeEventListener('mousemove', handleMouseMove);
    
    // 更健壮的 tooltip 清理
    if (tooltip) {
      try {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      } catch (error) {
        console.warn('Tooltip cleanup failed, trying alternative method:', error);
        tooltip.remove?.();
      }
      tooltip = null;
    }
  };
  tooltipCleanupMap.set(element, cleanup);
}

/**
 * 移除元素的 tooltip
 * @param element 目标元素
 */
export function removeTooltip(element: HTMLElement): void {
  const cleanup = tooltipCleanupMap.get(element);
  if (cleanup) {
    cleanup();
    tooltipCleanupMap.delete(element);
  }
}

/**
 * 创建按钮的 tooltip 配置
 * @param text 提示文本
 * @param shortcut 快捷键（可选）
 * @returns tooltip 配置
 */
export function createButtonTooltip(text: string, shortcut?: string): TooltipConfig {
  return {
    text,
    shortcut,
    delay: 200,
    defaultPlacement: 'bottom' // 按钮tooltip默认显示在下方
  };
}

/**
 * 创建标签页的 tooltip 配置
 * @param tab 标签页信息
 * @returns tooltip 配置
 */
export function createTabTooltip(tab: any): TooltipConfig {
  // 第一行：标题
  let tooltipText = tab.title || '未命名标签页';
  
  // 第二行：详细信息
  const details = [];
  
  if (tab.blockId) {
    details.push(`ID: ${tab.blockId}`);
  }
  
  if (tab.blockType) {
    details.push(`类型: ${tab.blockType}`);
  }
  
  if (tab.isPinned) {
    details.push('📌 已固定');
  }
  
  if (tab.isJournal) {
    details.push('📝 日志块');
  }
  
  // 如果有详细信息，添加到第二行
  if (details.length > 0) {
    tooltipText += '\n' + details.join(' | ');
  }

  return {
    text: tooltipText,
    delay: 300,
    defaultPlacement: 'bottom' // 标签页 tooltip 默认显示在下方
  };
}

/**
 * 创建状态指示器的 tooltip 配置
 * @param text 提示文本
 * @returns tooltip 配置
 */
export function createStatusTooltip(text: string): TooltipConfig {
  return {
    text,
    delay: 500,
    defaultPlacement: 'bottom' // 状态tooltip默认显示在下方
  };
}

/**
 * 批量初始化 tooltips
 * 处理所有带有 data-tooltip 属性的元素
 */
export function initializeTooltips(): void {
  const elements = document.querySelectorAll('[data-tooltip="true"]');
  
  elements.forEach((element, index) => {
    const text = element.getAttribute('data-tooltip-text');
    const shortcut = element.getAttribute('data-tooltip-shortcut');
    const delay = element.getAttribute('data-tooltip-delay');
    
    if (text) {
      const config: TooltipConfig = {
        text,
        shortcut: shortcut || undefined,
        delay: delay ? parseInt(delay) : undefined
      };
      
      addTooltip(element as HTMLElement, config);
    }
  });
}

/**
 * 清理所有遗留的 tooltip 元素
 * 这是一个安全措施，用于清理可能遗留的 orca-tooltip 元素
 */
export function cleanupAllTooltips(): void {
  // 清理 orca-tooltip 元素
  const tooltips = document.querySelectorAll('.orca-tooltip');
  tooltips.forEach(tooltip => {
    try {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      } else {
        tooltip.remove?.();
      }
    } catch (error) {
      console.warn('Failed to remove tooltip:', error);
    }
  });
  
  // 同时清理其他可能的 tooltip 类名
  const otherTooltips = document.querySelectorAll('.tooltip');
  otherTooltips.forEach(tooltip => {
    try {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      } else {
        tooltip.remove?.();
      }
    } catch (error) {
      console.warn('Failed to remove tooltip:', error);
    }
  });
  
  // 清理可能跑到左上角的 tooltip（position: absolute 且 left/top 接近 0）
  const suspiciousTooltips = document.querySelectorAll('[style*="position: absolute"]');
  suspiciousTooltips.forEach(el => {
    // 使用安全的位置获取函数，避免对content-visibility隐藏的元素进行布局计算
    const position = safeGetElementPosition(el);
    if (!position) {
      // 如果无法安全获取位置，跳过此元素
      return;
    }

    const style = safeGetComputedStyle(el);
    if (!style) {
      return;
    }

    const left = position.left;
    const top = position.top;
    const zIndex = parseInt(style.zIndex);

    // 如果是高 z-index 的绝对定位元素，且位置在左上角附近，可能是遗留的 tooltip
    if (zIndex >= 10000 && left < 20 && top < 20 &&
        (el.classList.contains('orca-tooltip') || el.classList.contains('tooltip'))) {
      try {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        } else {
          el.remove?.();
        }
        console.log('[Tooltip] Cleaned up suspicious tooltip at top-left corner');
      } catch (error) {
        console.warn('Failed to remove suspicious tooltip:', error);
      }
    }
  });
}

/**
 * 定期清理遗留的 tooltip 元素
 * 每30秒检查一次，清理可能遗留的 tooltip
 */
export function startTooltipCleanupTimer(): void {
  setInterval(() => {
    cleanupAllTooltips();
  }, 30000); // 30秒清理一次
}

/**
 * 设置页面卸载时的清理机制
 * 确保在页面关闭或刷新时清理所有 tooltip
 */
export function setupPageUnloadCleanup(): void {
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    cleanupAllTooltips();
  });
  
  // 页面隐藏时清理（移动端或标签页切换）
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      cleanupAllTooltips();
    }
  });
}

// 将函数暴露到全局，供调试工具使用
if (typeof window !== 'undefined') {
  (window as any).addTooltip = addTooltip;
  (window as any).removeTooltip = removeTooltip;
  (window as any).createButtonTooltip = createButtonTooltip;
  (window as any).createTabTooltip = createTabTooltip;
  (window as any).createStatusTooltip = createStatusTooltip;
  (window as any).cleanupAllTooltips = cleanupAllTooltips;
  (window as any).startTooltipCleanupTimer = startTooltipCleanupTimer;
  (window as any).setupPageUnloadCleanup = setupPageUnloadCleanup;
}
