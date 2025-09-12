/**
 * 面板管理相关的工具函数
 */

/**
 * 面板发现缓存接口
 */
export interface PanelDiscoveryCache {
  panelIds: string[];
  timestamp: number;
}

/**
 * 面板状态接口
 */
export interface PanelStatus {
  id: string;
  isActive: boolean;
  isVisible: boolean;
  width?: number;
  height?: number;
}

/**
 * 侧边栏对齐配置接口
 */
export interface SidebarAlignmentConfig {
  enabled: boolean;
  sidebarWidth: number;
  alignmentOffset: number;
  autoAdjust: boolean;
}

/**
 * 发现面板
 */
export function discoverPanels(): {
  panelIds: string[];
  activePanelId: string | null;
  panelCount: number;
} {
  const mainSection = document.querySelector('section#main');
  if (!mainSection) {
    console.warn("❌ 未找到 section#main");
    return { panelIds: [], activePanelId: null, panelCount: 0 };
  }

  const panelsRow = mainSection.querySelector('.orca-panels-row');
  if (!panelsRow) {
    console.warn("❌ 未找到 .orca-panels-row");
    return { panelIds: [], activePanelId: null, panelCount: 0 };
  }

  // 查找所有面板，排除菜单面板
  const panels = panelsRow.querySelectorAll('.orca-panel:not([data-menu-panel="true"])');
  const panelIds: string[] = [];
  let activePanelId: string | null = null;

  panels.forEach((panel) => {
    const panelId = panel.getAttribute('data-panel-id');
    if (panelId) {
      panelIds.push(panelId);
      
      // 检查是否为活动面板
      if (panel.classList.contains('active')) {
        activePanelId = panelId;
      }
    }
  });

  return {
    panelIds,
    activePanelId,
    panelCount: panelIds.length
  };
}

/**
 * 检查面板状态
 */
export function checkPanelStatus(panelId: string): PanelStatus {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`);
  if (!panel) {
    return {
      id: panelId,
      isActive: false,
      isVisible: false
    };
  }

  const rect = panel.getBoundingClientRect();
  
  return {
    id: panelId,
    isActive: panel.classList.contains('active'),
    isVisible: rect.width > 0 && rect.height > 0,
    width: rect.width,
    height: rect.height
  };
}

/**
 * 获取所有面板状态
 */
export function getAllPanelStatuses(panelIds: string[]): PanelStatus[] {
  return panelIds.map(panelId => checkPanelStatus(panelId));
}

/**
 * 检查面板列表是否发生变化
 */
export function hasPanelListChanged(
  oldPanelIds: string[],
  newPanelIds: string[]
): boolean {
  if (oldPanelIds.length !== newPanelIds.length) {
    return true;
  }
  
  return !oldPanelIds.every((id, index) => id === newPanelIds[index]);
}

/**
 * 获取侧边栏宽度
 */
export function getSidebarWidth(): number {
  const sidebar = document.querySelector('.orca-sidebar');
  if (!sidebar) {
    return 0;
  }
  
  const rect = sidebar.getBoundingClientRect();
  return rect.width;
}

/**
 * 检查侧边栏是否可见
 */
export function isSidebarVisible(): boolean {
  const sidebar = document.querySelector('.orca-sidebar');
  if (!sidebar) {
    return false;
  }
  
  const rect = sidebar.getBoundingClientRect();
  return rect.width > 0;
}

/**
 * 获取侧边栏位置
 */
export function getSidebarPosition(): { x: number; y: number; width: number; height: number } | null {
  const sidebar = document.querySelector('.orca-sidebar');
  if (!sidebar) {
    return null;
  }
  
  const rect = sidebar.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height
  };
}

/**
 * 计算标签栏对齐位置
 */
export function calculateAlignmentPosition(
  sidebarPosition: { x: number; y: number; width: number; height: number },
  alignmentOffset: number = 0
): { x: number; y: number } {
  return {
    x: sidebarPosition.x + sidebarPosition.width + alignmentOffset,
    y: sidebarPosition.y
  };
}

/**
 * 检查标签栏是否需要对齐
 */
export function shouldAlignToSidebar(
  currentPosition: { x: number; y: number },
  sidebarPosition: { x: number; y: number; width: number; height: number },
  alignmentOffset: number = 0,
  tolerance: number = 10
): boolean {
  const targetPosition = calculateAlignmentPosition(sidebarPosition, alignmentOffset);
  
  return Math.abs(currentPosition.x - targetPosition.x) <= tolerance &&
         Math.abs(currentPosition.y - targetPosition.y) <= tolerance;
}

/**
 * 创建面板状态监控器
 */
export function createPanelStatusMonitor(
  onPanelChange: (oldPanelIds: string[], newPanelIds: string[]) => void,
  onActivePanelChange: (oldPanelId: string | null, newPanelId: string | null) => void,
  interval: number = 1000
): {
  start: () => void;
  stop: () => void;
  check: () => void;
} {
  let intervalId: number | null = null;
  let lastPanelIds: string[] = [];
  let lastActivePanelId: string | null = null;

  const check = () => {
    const { panelIds, activePanelId } = discoverPanels();
    
    // 检查面板列表变化
    if (hasPanelListChanged(lastPanelIds, panelIds)) {
      onPanelChange(lastPanelIds, panelIds);
      lastPanelIds = [...panelIds];
    }
    
    // 检查活动面板变化
    if (lastActivePanelId !== activePanelId) {
      onActivePanelChange(lastActivePanelId, activePanelId);
      lastActivePanelId = activePanelId;
    }
  };

  return {
    start: () => {
      if (intervalId) return;
      
      // 初始化
      const { panelIds, activePanelId } = discoverPanels();
      lastPanelIds = [...panelIds];
      lastActivePanelId = activePanelId;
      
      intervalId = window.setInterval(check, interval);
    },
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    check
  };
}


/**
 * 创建面板变化监听器
 */
export function createPanelChangeListener(
  onPanelAdded: (panelId: string) => void,
  onPanelRemoved: (panelId: string) => void,
  onPanelActivated: (panelId: string) => void,
  onPanelDeactivated: (panelId: string) => void
): {
  start: () => void;
  stop: () => void;
} {
  let observer: MutationObserver | null = null;
  let lastPanelIds: string[] = [];
  let lastActivePanelId: string | null = null;

  const checkChanges = () => {
    const { panelIds, activePanelId } = discoverPanels();
    
    // 检查新增的面板
    panelIds.forEach(panelId => {
      if (!lastPanelIds.includes(panelId)) {
        onPanelAdded(panelId);
      }
    });
    
    // 检查移除的面板
    lastPanelIds.forEach(panelId => {
      if (!panelIds.includes(panelId)) {
        onPanelRemoved(panelId);
      }
    });
    
    // 检查活动面板变化
    if (lastActivePanelId !== activePanelId) {
      if (lastActivePanelId) {
        onPanelDeactivated(lastActivePanelId);
      }
      if (activePanelId) {
        onPanelActivated(activePanelId);
      }
    }
    
    lastPanelIds = [...panelIds];
    lastActivePanelId = activePanelId;
  };

  return {
    start: () => {
      if (observer) return;
      
      // 初始化
      const { panelIds, activePanelId } = discoverPanels();
      lastPanelIds = [...panelIds];
      lastActivePanelId = activePanelId;
      
      // 创建MutationObserver监听DOM变化
      observer = new MutationObserver(() => {
        // 使用防抖避免频繁检查
        setTimeout(checkChanges, 100);
      });
      
      // 监听主区域的变化
      const mainSection = document.querySelector('section#main');
      if (mainSection) {
        observer.observe(mainSection, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'data-panel-id']
        });
      }
    },
    stop: () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  };
}

/**
 * 计算面板切换动画
 */
export function calculatePanelSwitchAnimation(
  fromPanelId: string,
  toPanelId: string,
  duration: number = 300
): {
  fromPanel: HTMLElement | null;
  toPanel: HTMLElement | null;
  animation: {
    duration: number;
    easing: string;
  };
} {
  const fromPanel = document.querySelector(`[data-panel-id="${fromPanelId}"]`) as HTMLElement;
  const toPanel = document.querySelector(`[data-panel-id="${toPanelId}"]`) as HTMLElement;
  
  return {
    fromPanel,
    toPanel,
    animation: {
      duration,
      easing: 'ease-in-out'
    }
  };
}

/**
 * 获取面板在屏幕上的位置
 */
export function getPanelScreenPosition(panelId: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`);
  if (!panel) {
    return null;
  }
  
  const rect = panel.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height
  };
}

/**
 * 检查面板是否在视口中
 */
export function isPanelInViewport(panelId: string): boolean {
  const position = getPanelScreenPosition(panelId);
  if (!position) {
    return false;
  }
  
  return position.x >= 0 && 
         position.y >= 0 && 
         position.x + position.width <= window.innerWidth && 
         position.y + position.height <= window.innerHeight;
}

/**
 * 获取面板的可见区域
 */
export function getPanelVisibleArea(panelId: string): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  const position = getPanelScreenPosition(panelId);
  if (!position) {
    return null;
  }
  
  return {
    x: Math.max(0, position.x),
    y: Math.max(0, position.y),
    width: Math.min(position.width, window.innerWidth - Math.max(0, position.x)),
    height: Math.min(position.height, window.innerHeight - Math.max(0, position.y))
  };
}

/**
 * 计算面板的相对位置
 */
export function calculatePanelRelativePosition(
  panelId: string,
  referencePanelId: string
): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  const panel = getPanelScreenPosition(panelId);
  const reference = getPanelScreenPosition(referencePanelId);
  
  if (!panel || !reference) {
    return null;
  }
  
  return {
    x: panel.x - reference.x,
    y: panel.y - reference.y,
    width: panel.width,
    height: panel.height
  };
}

/**
 * 检查面板是否重叠
 */
export function checkPanelOverlap(
  panelId1: string,
  panelId2: string
): boolean {
  const panel1 = getPanelScreenPosition(panelId1);
  const panel2 = getPanelScreenPosition(panelId2);
  
  if (!panel1 || !panel2) {
    return false;
  }
  
  return !(panel1.x + panel1.width <= panel2.x || 
           panel2.x + panel2.width <= panel1.x || 
           panel1.y + panel1.height <= panel2.y || 
           panel2.y + panel2.height <= panel1.y);
}

/**
 * 计算面板重叠面积
 */
export function calculatePanelOverlapArea(
  panelId1: string,
  panelId2: string
): number {
  const panel1 = getPanelScreenPosition(panelId1);
  const panel2 = getPanelScreenPosition(panelId2);
  
  if (!panel1 || !panel2) {
    return 0;
  }
  
  const left = Math.max(panel1.x, panel2.x);
  const right = Math.min(panel1.x + panel1.width, panel2.x + panel2.width);
  const top = Math.max(panel1.y, panel2.y);
  const bottom = Math.min(panel1.y + panel1.height, panel2.y + panel2.height);
  
  if (left < right && top < bottom) {
    return (right - left) * (bottom - top);
  }
  
  return 0;
}

/**
 * 获取面板的层级顺序
 */
export function getPanelZIndex(panelId: string): number {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`);
  if (!panel) {
    return 0;
  }
  
  const computedStyle = window.getComputedStyle(panel);
  return parseInt(computedStyle.zIndex) || 0;
}

/**
 * 设置面板的层级顺序
 */
export function setPanelZIndex(panelId: string, zIndex: number): boolean {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`) as HTMLElement;
  if (!panel) {
    return false;
  }
  
  panel.style.zIndex = zIndex.toString();
  return true;
}

/**
 * 获取面板的透明度
 */
export function getPanelOpacity(panelId: string): number {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`);
  if (!panel) {
    return 1;
  }
  
  const computedStyle = window.getComputedStyle(panel);
  return parseFloat(computedStyle.opacity) || 1;
}

/**
 * 设置面板的透明度
 */
export function setPanelOpacity(panelId: string, opacity: number): boolean {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`) as HTMLElement;
  if (!panel) {
    return false;
  }
  
  panel.style.opacity = Math.max(0, Math.min(1, opacity)).toString();
  return true;
}

/**
 * 检查面板是否被遮挡
 */
export function isPanelOccluded(panelId: string): boolean {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`);
  if (!panel) {
    return false;
  }
  
  const rect = panel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const elementAtCenter = document.elementFromPoint(centerX, centerY);
  return elementAtCenter !== panel && !panel.contains(elementAtCenter);
}

/**
 * 获取面板的遮挡元素
 */
export function getPanelOccludingElements(panelId: string): HTMLElement[] {
  const panel = document.querySelector(`[data-panel-id="${panelId}"]`);
  if (!panel) {
    return [];
  }
  
  const rect = panel.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const elementAtCenter = document.elementFromPoint(centerX, centerY);
  if (!elementAtCenter || elementAtCenter === panel || panel.contains(elementAtCenter)) {
    return [];
  }
  
  return [elementAtCenter as HTMLElement];
}

/**
 * 检查侧边栏状态
 */
export function checkSidebarStatus(): {
  isClosed: boolean;
  isOpened: boolean;
  isVisible: boolean;
  width: number;
} {
  const appElement = document.querySelector('div#app');
  const isClosed = appElement?.classList.contains('sidebar-closed') || false;
  const isOpened = appElement?.classList.contains('sidebar-opened') || false;
  const width = getSidebarWidth();
  const isVisible = isSidebarVisible();
  
  return {
    isClosed,
    isOpened,
    isVisible,
    width
  };
}

/**
 * 计算侧边栏对齐位置
 */
export function calculateSidebarAlignmentPosition(
  currentPosition: { x: number; y: number },
  sidebarWidth: number,
  isSidebarClosed: boolean,
  isSidebarOpened: boolean,
  alignmentOffset: number = 0
): { x: number; y: number } | null {
  if (isSidebarClosed) {
    // 侧边栏关闭时，标签栏应该靠近左边缘
    return {
      x: alignmentOffset,
      y: currentPosition.y
    };
  } else if (isSidebarOpened) {
    // 侧边栏打开时，标签栏应该对齐到侧边栏右侧
    return {
      x: sidebarWidth + alignmentOffset,
      y: currentPosition.y
    };
  }
  
  return null;
}

/**
 * 检查是否需要执行侧边栏对齐
 */
export function shouldPerformSidebarAlignment(
  currentPosition: { x: number; y: number },
  sidebarStatus: {
    isClosed: boolean;
    isOpened: boolean;
    isVisible: boolean;
    width: number;
  },
  alignmentOffset: number = 0,
  tolerance: number = 10
): boolean {
  if (!sidebarStatus.isVisible || sidebarStatus.width === 0) {
    return false;
  }
  
  const targetPosition = calculateSidebarAlignmentPosition(
    currentPosition,
    sidebarStatus.width,
    sidebarStatus.isClosed,
    sidebarStatus.isOpened,
    alignmentOffset
  );
  
  if (!targetPosition) {
    return false;
  }
  
  return Math.abs(currentPosition.x - targetPosition.x) > tolerance;
}

/**
 * 创建侧边栏对齐监控器
 */
export function createSidebarAlignmentMonitor(
  onAlignmentNeeded: (targetPosition: { x: number; y: number }) => void,
  onAlignmentCompleted: (oldPosition: { x: number; y: number }, newPosition: { x: number; y: number }) => void,
  interval: number = 500
): {
  start: () => void;
  stop: () => void;
  check: () => void;
} {
  let intervalId: number | null = null;
  let lastSidebarStatus: ReturnType<typeof checkSidebarStatus> | null = null;

  const check = () => {
    const currentStatus = checkSidebarStatus();
    
    // 检查侧边栏状态是否发生变化
    if (!lastSidebarStatus || 
        lastSidebarStatus.isClosed !== currentStatus.isClosed ||
        lastSidebarStatus.isOpened !== currentStatus.isOpened ||
        lastSidebarStatus.width !== currentStatus.width) {
      
      // 侧边栏状态发生变化，需要重新对齐
      if (currentStatus.isVisible && currentStatus.width > 0) {
        const targetPosition = calculateSidebarAlignmentPosition(
          { x: 0, y: 0 }, // 这里需要传入当前位置
          currentStatus.width,
          currentStatus.isClosed,
          currentStatus.isOpened
        );
        
        if (targetPosition) {
          onAlignmentNeeded(targetPosition);
        }
      }
      
      lastSidebarStatus = currentStatus;
    }
  };

  return {
    start: () => {
      if (intervalId) return;
      
      // 初始化
      lastSidebarStatus = checkSidebarStatus();
      
      intervalId = window.setInterval(check, interval);
    },
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    check
  };
}

/**
 * 执行侧边栏对齐
 */
export function performSidebarAlignment(
  currentPosition: { x: number; y: number },
  sidebarStatus: {
    isClosed: boolean;
    isOpened: boolean;
    isVisible: boolean;
    width: number;
  },
  alignmentOffset: number = 0
): { x: number; y: number } | null {
  if (!sidebarStatus.isVisible || sidebarStatus.width === 0) {
    return null;
  }
  
  return calculateSidebarAlignmentPosition(
    currentPosition,
    sidebarStatus.width,
    sidebarStatus.isClosed,
    sidebarStatus.isOpened,
    alignmentOffset
  );
}

/**
 * 创建面板切换动画
 */
export function createPanelSwitchAnimation(
  fromPanelId: string,
  toPanelId: string,
  duration: number = 300
): {
  fromPanel: HTMLElement | null;
  toPanel: HTMLElement | null;
  animation: {
    duration: number;
    easing: string;
  };
} {
  const fromPanel = document.querySelector(`[data-panel-id="${fromPanelId}"]`) as HTMLElement;
  const toPanel = document.querySelector(`[data-panel-id="${toPanelId}"]`) as HTMLElement;
  
  return {
    fromPanel,
    toPanel,
    animation: {
      duration,
      easing: 'ease-in-out'
    }
  };
}

/**
 * 获取面板切换历史
 */
export function getPanelSwitchHistory(panelIds: string[]): string[] {
  // 这里可以维护一个切换历史，用于实现"上一个面板"功能
  return [...panelIds];
}

/**
 * 计算面板切换方向
 */
export function calculatePanelSwitchDirection(
  fromPanelId: string,
  toPanelId: string,
  panelIds: string[]
): 'left' | 'right' | 'unknown' {
  const fromIndex = panelIds.indexOf(fromPanelId);
  const toIndex = panelIds.indexOf(toPanelId);
  
  if (fromIndex === -1 || toIndex === -1) {
    return 'unknown';
  }
  
  return toIndex > fromIndex ? 'right' : 'left';
}

/**
 * 获取面板的相邻面板
 */
export function getAdjacentPanels(panelId: string, panelIds: string[]): {
  previous: string | null;
  next: string | null;
} {
  const index = panelIds.indexOf(panelId);
  if (index === -1) {
    return { previous: null, next: null };
  }
  
  return {
    previous: index > 0 ? panelIds[index - 1] : null,
    next: index < panelIds.length - 1 ? panelIds[index + 1] : null
  };
}

/**
 * 检查面板是否可以切换
 */
export function canSwitchToPanel(panelId: string, panelIds: string[]): boolean {
  return panelIds.includes(panelId);
}

/**
 * 获取面板的切换顺序
 */
export function getPanelSwitchOrder(panelIds: string[], currentPanelId: string): string[] {
  const currentIndex = panelIds.indexOf(currentPanelId);
  if (currentIndex === -1) {
    return panelIds;
  }
  
  // 从当前面板开始，按顺序排列
  return [
    ...panelIds.slice(currentIndex),
    ...panelIds.slice(0, currentIndex)
  ];
}

