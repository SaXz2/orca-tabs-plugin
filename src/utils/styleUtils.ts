/**
 * 样式相关的工具函数
 */

/**
 * 将十六进制颜色转换为RGBA格式
 */
export function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(200, 200, 200, ${alpha})`;
}

/**
 * 应用OKLCH颜色公式处理颜色（优化版）
 * 优先使用简单的RGB调整，避免OKLCH偏色问题
 */
export function applyOklchFormula(hex: string, type: 'text' | 'background'): string {
  // 使用Orca API检查是否为暗色模式
  const isDarkMode = orca.state.themeMode === 'dark';
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  if (type === 'text') {
    // 文字颜色：根据模式调整对比度
    const brightness = (r + g + b) / 3;
    
    if (isDarkMode) {
      // 暗色模式：增亮文字
      if (brightness < 80) {
        // 暗色：适度增亮
        const factor = 1.6;
        const newR = Math.min(255, Math.round(r * factor));
        const newG = Math.min(255, Math.round(g * factor));
        const newB = Math.min(255, Math.round(b * factor));
        return `rgb(${newR}, ${newG}, ${newB})`;
      } else if (brightness < 150) {
        // 中等亮度：轻微增亮
        const factor = 1.3;
        const newR = Math.min(255, Math.round(r * factor));
        const newG = Math.min(255, Math.round(g * factor));
        const newB = Math.min(255, Math.round(b * factor));
        return `rgb(${newR}, ${newG}, ${newB})`;
      } else {
        // 亮色：保持原色或轻微增亮
        const factor = 1.1;
        const newR = Math.min(255, Math.round(r * factor));
        const newG = Math.min(255, Math.round(g * factor));
        const newB = Math.min(255, Math.round(b * factor));
        return `rgb(${newR}, ${newG}, ${newB})`;
      }
    } else {
      // 亮色模式：变暗文字以提高对比度
      if (brightness > 200) {
        // 很亮的颜色：大幅变暗
        const factor = 0.4;
        const newR = Math.max(0, Math.round(r * factor));
        const newG = Math.max(0, Math.round(g * factor));
        const newB = Math.max(0, Math.round(b * factor));
        return `rgb(${newR}, ${newG}, ${newB})`;
      } else if (brightness > 150) {
        // 中等亮度：适度变暗
        const factor = 0.6;
        const newR = Math.max(0, Math.round(r * factor));
        const newG = Math.max(0, Math.round(g * factor));
        const newB = Math.max(0, Math.round(b * factor));
        return `rgb(${newR}, ${newG}, ${newB})`;
      } else {
        // 暗色：轻微变暗
        const factor = 0.8;
        const newR = Math.max(0, Math.round(r * factor));
        const newG = Math.max(0, Math.round(g * factor));
        const newB = Math.max(0, Math.round(b * factor));
        return `rgb(${newR}, ${newG}, ${newB})`;
      }
    }
  } else {
    // 背景颜色：根据模式调整透明度
    if (isDarkMode) {
      return hexToRgba(hex, 0.25);
    } else {
      return hexToRgba(hex, 0.35);
    }
  }
}

/**
 * 获取主题相关的颜色
 */
export function getThemeColor(isDarkMode: boolean, lightColor: string, darkColor: string): string {
  return isDarkMode ? darkColor : lightColor;
}

/**
 * 生成渐变背景样式
 */
export function generateGradientBackground(colors: string[], direction: 'horizontal' | 'vertical' | 'diagonal' = 'horizontal'): string {
  const gradientDirection = direction === 'horizontal' ? 'to right' : 
                          direction === 'vertical' ? 'to bottom' : '45deg';
  return `linear-gradient(${gradientDirection}, ${colors.join(', ')})`;
}

/**
 * 生成阴影样式
 */
export function generateShadow(
  x: number = 0, 
  y: number = 2, 
  blur: number = 4, 
  spread: number = 0, 
  color: string = 'rgba(0, 0, 0, 0.1)'
): string {
  return `${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

/**
 * 生成过渡动画样式
 */
export function generateTransition(properties: string[] = ['all'], duration: number = 0.2, easing: string = 'ease'): string {
  return properties.map(prop => `${prop} ${duration}s ${easing}`).join(', ');
}
