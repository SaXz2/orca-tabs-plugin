/**
 * 事件处理相关的工具函数
 */

import { TabInfo } from '../types';

/**
 * 创建拖拽事件处理器
 */
export function createDragHandlers(
  onDragStart: (e: MouseEvent) => void,
  onDrag: (e: MouseEvent) => void,
  onDragEnd: (e: MouseEvent) => void
) {
  const handleMouseMove = (event: MouseEvent) => {
    onDrag(event);
  };
  
  const handleMouseUp = (event: MouseEvent) => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    onDragEnd(event);
  };

  return {
    start: (e: MouseEvent) => {
      onDragStart(e);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    cleanup: () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };
}

/**
 * 创建防抖函数
 */
export function createDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: number | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T & { cancel: () => void };
  
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}

/**
 * 创建节流函数
 */
export function createThrottle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let lastCall = 0;
  let timeoutId: number | null = null;
  
  const throttled = ((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
      }, delay - (now - lastCall));
    }
  }) as T & { cancel: () => void };
  
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return throttled;
}

/**
 * 检查元素是否在指定区域内
 */
export function isElementInArea(
  element: HTMLElement,
  x: number,
  y: number,
  tolerance: number = 5
): boolean {
  const rect = element.getBoundingClientRect();
  return x >= rect.left - tolerance && 
         x <= rect.right + tolerance && 
         y >= rect.top - tolerance && 
         y <= rect.bottom + tolerance;
}

/**
 * 检查是否点击了侧边栏相关元素
 */
export function isSidebarElement(target: HTMLElement): boolean {
  return !!target.closest('.sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]');
}

/**
 * 检查是否点击了标签相关元素
 */
export function isTabElement(target: HTMLElement): boolean {
  return !!target.closest('.orca-tab, .new-tab-button, .drag-handle');
}

/**
 * 创建事件监听器清理函数
 */
export function createEventListenerCleanup() {
  const listeners: Array<{
    element: EventTarget;
    event: string;
    handler: EventListener;
    options?: boolean | AddEventListenerOptions;
  }> = [];

  return {
    add: <T extends EventTarget>(
      element: T,
      event: string,
      handler: EventListener,
      options?: boolean | AddEventListenerOptions
    ) => {
      element.addEventListener(event, handler, options);
      listeners.push({ element, event, handler, options });
    },
    remove: <T extends EventTarget>(
      element: T,
      event: string,
      handler: EventListener,
      options?: boolean | AddEventListenerOptions
    ) => {
      element.removeEventListener(event, handler, options);
      const index = listeners.findIndex(
        l => l.element === element && l.event === event && l.handler === handler
      );
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    },
    cleanup: () => {
      listeners.forEach(({ element, event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
      listeners.length = 0;
    }
  };
}

/**
 * 创建键盘快捷键处理器
 */
export function createKeyboardHandler() {
  const handlers = new Map<string, (e: KeyboardEvent) => void>();

  const handleKeyDown = (e: KeyboardEvent) => {
    const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.altKey ? 'alt+' : ''}${e.shiftKey ? 'shift+' : ''}${e.key.toLowerCase()}`;
    const handler = handlers.get(key);
    if (handler) {
      e.preventDefault();
      e.stopPropagation();
      handler(e);
    }
  };

  return {
    add: (key: string, handler: (e: KeyboardEvent) => void) => {
      handlers.set(key, handler);
    },
    remove: (key: string) => {
      handlers.delete(key);
    },
    start: () => {
      document.addEventListener('keydown', handleKeyDown);
    },
    stop: () => {
      document.removeEventListener('keydown', handleKeyDown);
    },
    cleanup: () => {
      handlers.clear();
    }
  };
}

/**
 * 创建鼠标事件处理器
 */
export function createMouseHandler() {
  const handlers = {
    click: new Set<(e: MouseEvent) => void>(),
    contextmenu: new Set<(e: MouseEvent) => void>(),
    mousedown: new Set<(e: MouseEvent) => void>(),
    mouseup: new Set<(e: MouseEvent) => void>(),
    mousemove: new Set<(e: MouseEvent) => void>()
  };

  const handleEvent = (type: keyof typeof handlers) => (e: MouseEvent) => {
    handlers[type].forEach(handler => handler(e));
  };

  const addListener = (type: keyof typeof handlers, handler: (e: MouseEvent) => void) => {
    handlers[type].add(handler);
  };

  const removeListener = (type: keyof typeof handlers, handler: (e: MouseEvent) => void) => {
    handlers[type].delete(handler);
  };

  const start = () => {
    document.addEventListener('click', handleEvent('click'));
    document.addEventListener('contextmenu', handleEvent('contextmenu'));
    document.addEventListener('mousedown', handleEvent('mousedown'));
    document.addEventListener('mouseup', handleEvent('mouseup'));
    document.addEventListener('mousemove', handleEvent('mousemove'));
  };

  const stop = () => {
    document.removeEventListener('click', handleEvent('click'));
    document.removeEventListener('contextmenu', handleEvent('contextmenu'));
    document.removeEventListener('mousedown', handleEvent('mousedown'));
    document.removeEventListener('mouseup', handleEvent('mouseup'));
    document.removeEventListener('mousemove', handleEvent('mousemove'));
  };

  const cleanup = () => {
    Object.values(handlers).forEach(handlerSet => handlerSet.clear());
  };

  return {
    add: addListener,
    remove: removeListener,
    start,
    stop,
    cleanup
  };
}

/**
 * 创建窗口大小变化处理器
 */
export function createResizeHandler(callback: () => void, delay: number = 100) {
  let timeoutId: number | null = null;
  
  const handleResize = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(callback, delay);
  };

  return {
    start: () => {
      window.addEventListener('resize', handleResize);
    },
    stop: () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  };
}

/**
 * 创建标签拖拽处理器
 */
export function createTabDragHandler(
  onDragStart: (tab: TabInfo, e: DragEvent) => void,
  onDragOver: (tab: TabInfo, e: DragEvent) => void,
  onDragEnd: (tab: TabInfo, e: DragEvent) => void
) {
  return {
    handleDragStart: (tab: TabInfo) => (e: DragEvent) => {
      e.dataTransfer!.effectAllowed = 'move';
      e.dataTransfer?.setData('text/plain', tab.blockId);
      onDragStart(tab, e);
    },
    handleDragOver: (tab: TabInfo) => (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'move';
      onDragOver(tab, e);
    },
    handleDragEnd: (tab: TabInfo) => (e: DragEvent) => {
      onDragEnd(tab, e);
    }
  };
}

/**
 * 创建标签点击处理器
 */
export function createTabClickHandler(
  onClick: (tab: TabInfo, e: MouseEvent) => void,
  onDoubleClick: (tab: TabInfo, e: MouseEvent) => void,
  onAuxClick: (tab: TabInfo, e: MouseEvent) => void
) {
  return {
    handleClick: (tab: TabInfo) => (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      onClick(tab, e);
    },
    handleDoubleClick: (tab: TabInfo) => (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      onDoubleClick(tab, e);
    },
    handleAuxClick: (tab: TabInfo) => (e: MouseEvent) => {
      if (e.button === 1) { // 中键
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onAuxClick(tab, e);
      }
    }
  };
}
