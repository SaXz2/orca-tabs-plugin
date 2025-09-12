/**
 * 布局管理相关的工具函数
 */

import { TabPosition } from '../types';

/**
 * 计算面板位置
 */
export function calculatePanelPosition(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): { x: number; y: number; width: number; height: number } {
  if (isVerticalMode) {
    return {
      x: position.x,
      y: position.y,
      width: verticalWidth,
      height: containerHeight
    };
  } else {
    return {
      x: position.x,
      y: position.y,
      width: Math.min(800, window.innerWidth - position.x - 10),
      height: 28
    };
  }
}

/**
 * 检查位置是否在窗口范围内
 */
export function isPositionInBounds(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): boolean {
  const bounds = calculatePanelPosition(position, isVerticalMode, verticalWidth, containerHeight);
  
  return bounds.x >= 0 && 
         bounds.y >= 0 && 
         bounds.x + bounds.width <= window.innerWidth && 
         bounds.y + bounds.height <= window.innerHeight;
}

/**
 * 约束位置到窗口范围内
 */
export function constrainPositionToBounds(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): TabPosition {
  const bounds = calculatePanelPosition(position, isVerticalMode, verticalWidth, containerHeight);
  
  let x = position.x;
  let y = position.y;
  
  // 约束X坐标
  if (bounds.x < 0) {
    x = 0;
  } else if (bounds.x + bounds.width > window.innerWidth) {
    x = window.innerWidth - bounds.width;
  }
  
  // 约束Y坐标
  if (bounds.y < 0) {
    y = 0;
  } else if (bounds.y + bounds.height > window.innerHeight) {
    y = window.innerHeight - bounds.height;
  }
  
  return { x, y };
}

/**
 * 计算拖拽边界
 */
export function calculateDragBounds(
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  if (isVerticalMode) {
    return {
      minX: 0,
      maxX: window.innerWidth - verticalWidth,
      minY: 0,
      maxY: window.innerHeight - containerHeight
    };
  } else {
    return {
      minX: 0,
      maxX: window.innerWidth - 200, // 最小宽度200px
      minY: 0,
      maxY: window.innerHeight - 28
    };
  }
}

/**
 * 计算调整大小的边界
 */
export function calculateResizeBounds(
  isVerticalMode: boolean,
  currentPosition: TabPosition,
  minWidth: number = 120,
  maxWidth: number = 400
): { minWidth: number; maxWidth: number; minHeight: number; maxHeight: number } {
  if (isVerticalMode) {
    const availableWidth = window.innerWidth - currentPosition.x;
    const availableHeight = window.innerHeight - currentPosition.y;
    
    return {
      minWidth: Math.min(minWidth, availableWidth),
      maxWidth: Math.min(maxWidth, availableWidth),
      minHeight: 100,
      maxHeight: Math.min(600, availableHeight)
    };
  } else {
    return {
      minWidth: 200,
      maxWidth: window.innerWidth - currentPosition.x,
      minHeight: 28,
      maxHeight: 28
    };
  }
}

/**
 * 计算智能位置（避免遮挡重要UI元素）
 */
export function calculateSmartPosition(
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number,
  avoidElements: Array<{ x: number; y: number; width: number; height: number }> = []
): TabPosition {
  const positions = [
    { x: 20, y: 20 }, // 左上角
    { x: window.innerWidth - verticalWidth - 20, y: 20 }, // 右上角
    { x: 20, y: window.innerHeight - containerHeight - 20 }, // 左下角
    { x: window.innerWidth - verticalWidth - 20, y: window.innerHeight - containerHeight - 20 }, // 右下角
    { x: (window.innerWidth - verticalWidth) / 2, y: 20 }, // 顶部居中
    { x: (window.innerWidth - verticalWidth) / 2, y: window.innerHeight - containerHeight - 20 }, // 底部居中
  ];

  // 过滤掉会超出边界的位置
  const validPositions = positions.filter(pos => 
    isPositionInBounds(pos, isVerticalMode, verticalWidth, containerHeight)
  );

  // 如果没有有效位置，返回默认位置
  if (validPositions.length === 0) {
    return { x: 20, y: 20 };
  }

  // 选择与避免元素重叠最少的位置
  let bestPosition = validPositions[0];
  let minOverlap = Number.MAX_VALUE;

  for (const pos of validPositions) {
    const bounds = calculatePanelPosition(pos, isVerticalMode, verticalWidth, containerHeight);
    let totalOverlap = 0;

    for (const element of avoidElements) {
      const overlap = calculateOverlap(bounds, element);
      totalOverlap += overlap;
    }

    if (totalOverlap < minOverlap) {
      minOverlap = totalOverlap;
      bestPosition = pos;
    }
  }

  return bestPosition;
}

/**
 * 计算两个矩形的重叠面积
 */
export function calculateOverlap(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): number {
  const left = Math.max(rect1.x, rect2.x);
  const right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
  const top = Math.max(rect1.y, rect2.y);
  const bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

  if (left < right && top < bottom) {
    return (right - left) * (bottom - top);
  }

  return 0;
}

/**
 * 计算面板在屏幕上的可见区域
 */
export function calculateVisibleArea(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): { x: number; y: number; width: number; height: number } {
  const bounds = calculatePanelPosition(position, isVerticalMode, verticalWidth, containerHeight);
  
  return {
    x: Math.max(0, bounds.x),
    y: Math.max(0, bounds.y),
    width: Math.min(bounds.width, window.innerWidth - Math.max(0, bounds.x)),
    height: Math.min(bounds.height, window.innerHeight - Math.max(0, bounds.y))
  };
}

/**
 * 检查面板是否完全可见
 */
export function isPanelFullyVisible(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): boolean {
  const bounds = calculatePanelPosition(position, isVerticalMode, verticalWidth, containerHeight);
  
  return bounds.x >= 0 && 
         bounds.y >= 0 && 
         bounds.x + bounds.width <= window.innerWidth && 
         bounds.y + bounds.height <= window.innerHeight;
}

/**
 * 计算面板中心点
 */
export function calculatePanelCenter(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): { x: number; y: number } {
  const bounds = calculatePanelPosition(position, isVerticalMode, verticalWidth, containerHeight);
  
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2
  };
}

/**
 * 计算面板到屏幕边缘的距离
 */
export function calculateDistanceToEdges(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): { left: number; right: number; top: number; bottom: number } {
  const bounds = calculatePanelPosition(position, isVerticalMode, verticalWidth, containerHeight);
  
  return {
    left: bounds.x,
    right: window.innerWidth - (bounds.x + bounds.width),
    top: bounds.y,
    bottom: window.innerHeight - (bounds.y + bounds.height)
  };
}

/**
 * 计算最佳调整大小方向
 */
export function calculateBestResizeDirection(
  position: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number
): 'left' | 'right' | 'both' {
  if (!isVerticalMode) return 'right';
  
  const distances = calculateDistanceToEdges(position, isVerticalMode, verticalWidth, containerHeight);
  
  // 如果右边空间更大，优先向右调整
  if (distances.right > distances.left) {
    return 'right';
  }
  // 如果左边空间更大，优先向左调整
  else if (distances.left > distances.right) {
    return 'left';
  }
  // 如果两边空间差不多，双向调整
  else {
    return 'both';
  }
}

/**
 * 计算标签容器的滚动位置
 */
export function calculateScrollPosition(
  containerHeight: number,
  tabCount: number,
  tabHeight: number = 28,
  gap: number = 4
): { scrollTop: number; maxScroll: number } {
  const totalHeight = tabCount * (tabHeight + gap) + gap;
  const maxScroll = Math.max(0, totalHeight - containerHeight);
  
  return {
    scrollTop: 0, // 默认滚动到顶部
    maxScroll
  };
}

/**
 * 计算标签在容器中的位置
 */
export function calculateTabPosition(
  tabIndex: number,
  isVerticalMode: boolean,
  tabHeight: number = 28,
  gap: number = 4
): { x: number; y: number; width: number; height: number } {
  if (isVerticalMode) {
    return {
      x: 0,
      y: tabIndex * (tabHeight + gap) + gap,
      width: 0, // 宽度由容器决定
      height: tabHeight
    };
  } else {
    return {
      x: tabIndex * (120 + gap) + gap, // 假设每个标签宽度120px
      y: 0,
      width: 120,
      height: tabHeight
    };
  }
}

/**
 * 计算标签容器的最大高度
 */
export function calculateMaxContainerHeight(
  isVerticalMode: boolean,
  maxHeightRatio: number = 0.8
): number {
  if (isVerticalMode) {
    return Math.min(600, window.innerHeight * maxHeightRatio);
  } else {
    return 28;
  }
}

/**
 * 计算标签容器的最大宽度
 */
export function calculateMaxContainerWidth(
  isVerticalMode: boolean,
  maxWidthRatio: number = 0.8
): number {
  if (isVerticalMode) {
    return Math.min(400, window.innerWidth * maxWidthRatio);
  } else {
    return Math.min(800, window.innerWidth * maxWidthRatio);
  }
}

/**
 * 检查是否需要调整面板位置
 */
export function shouldAdjustPanelPosition(
  currentPosition: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number,
  threshold: number = 50
): boolean {
  const distances = calculateDistanceToEdges(currentPosition, isVerticalMode, verticalWidth, containerHeight);
  
  // 如果面板太靠近边缘，需要调整
  return distances.left < threshold || 
         distances.right < threshold || 
         distances.top < threshold || 
         distances.bottom < threshold;
}

/**
 * 计算调整后的面板位置
 */
export function calculateAdjustedPosition(
  currentPosition: TabPosition,
  isVerticalMode: boolean,
  verticalWidth: number,
  containerHeight: number,
  threshold: number = 50
): TabPosition {
  const distances = calculateDistanceToEdges(currentPosition, isVerticalMode, verticalWidth, containerHeight);
  let { x, y } = currentPosition;
  
  // 调整X坐标
  if (distances.left < threshold) {
    x = threshold;
  } else if (distances.right < threshold) {
    x = window.innerWidth - verticalWidth - threshold;
  }
  
  // 调整Y坐标
  if (distances.top < threshold) {
    y = threshold;
  } else if (distances.bottom < threshold) {
    y = window.innerHeight - containerHeight - threshold;
  }
  
  return { x, y };
}
