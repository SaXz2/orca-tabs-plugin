/**
 * 简单的 Tooltip 工具函数
 * 使用原生 DOM 实现悬浮提示
 */

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
      // 创建并插入
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = `orca-tooltip ${config.className || ''}`;
        const tooltipText = config.shortcut ? `${config.text} (${config.shortcut})` : config.text;
        if (tooltipText.includes('\n')) {
          tooltip.innerHTML = tooltipText.replace(/\n/g, '<br>');
        } else {
          tooltip.textContent = tooltipText;
        }
        tooltip.style.cssText = `
          position: absolute;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        `;
        document.body.appendChild(tooltip);
      }

      const rect = element.getBoundingClientRect();
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'hidden';
      const tooltipRect = tooltip.getBoundingClientRect();
      
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

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.visibility = 'visible';
    }, config.delay || 500) as unknown as number; // 性能优化：增加延迟到500ms
  };

  // 隐藏 tooltip（并在短延迟后从 DOM 移除，防止遗留）
  const hideTooltip = () => {
    if (showTimeout) {
      clearTimeout(showTimeout);
      showTimeout = null;
    }

    hideTimeout = setTimeout(() => {
      if (tooltip) {
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
        tooltip = null;
      }
    }, 0) as unknown as number;
  };

  // 绑定事件
  element.addEventListener('mouseenter', showTooltip);
  element.addEventListener('mouseleave', hideTooltip);
  element.addEventListener('mousedown', hideTooltip);

  // 存储清理函数（通过 WeakMap）
  const cleanup = () => {
    if (showTimeout) clearTimeout(showTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);
    element.removeEventListener('mouseenter', showTooltip);
    element.removeEventListener('mouseleave', hideTooltip);
    element.removeEventListener('mousedown', hideTooltip);
    if (tooltip && tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
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

// 将函数暴露到全局，供调试工具使用
if (typeof window !== 'undefined') {
  (window as any).addTooltip = addTooltip;
  (window as any).removeTooltip = removeTooltip;
  (window as any).createButtonTooltip = createButtonTooltip;
  (window as any).createTabTooltip = createTabTooltip;
  (window as any).createStatusTooltip = createStatusTooltip;
}
