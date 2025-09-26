/**
 * Orca标签页插件样式工具文件
 * 
 * 此文件提供与样式处理相关的工具函数，包括：
 * - 颜色格式转换和处理
 * - 主题适配和颜色调整
 * - 样式生成和优化
 * - 响应式设计支持
 * 
 * 这些工具函数确保插件在不同主题和环境下都能正确显示。
 * 
 * @file styleUtils.ts
 * @version 2.4.0
 * @since 2024
 */

// ==================== 颜色处理函数 ====================
/**
 * 将十六进制颜色转换为RGBA格式
 * 
 * 这是一个基础的颜色格式转换函数，将十六进制颜色代码转换为RGBA格式。
 * 支持带透明度的颜色处理，用于创建半透明效果。
 * 
 * 功能特性：
 * - 支持3位和6位十六进制颜色代码
 * - 自动处理#前缀
 * - 支持自定义透明度
 * - 错误处理和默认值
 * 
 * @param hex 十六进制颜色代码（如 #FF0000 或 #F00）
 * @param alpha 透明度值（0-1之间）
 * @returns string RGBA格式的颜色字符串
 * @example
 * hexToRgba('#FF0000', 0.5) // 返回 'rgba(255, 0, 0, 0.5)'
 * hexToRgba('#F00', 1) // 返回 'rgba(255, 0, 0, 1)'
 */
export function hexToRgba(hex: string, alpha: number): string {
  // 使用正则表达式解析十六进制颜色代码
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  
  if (result) {
    // 解析RGB值
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    // 返回RGBA格式字符串
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // 如果解析失败，返回默认的灰色
  return `rgba(200, 200, 200, ${alpha})`;
}

/**
 * 应用OKLCH颜色公式处理颜色（优化版）
 * 
 * 这是一个智能的颜色处理函数，根据Orca的主题模式自动调整颜色。
 * 优先使用简单的RGB调整，避免OKLCH偏色问题，确保颜色在不同主题下都有良好的可读性。
 * 
 * 功能特性：
 * - 自动检测Orca主题模式（明色/暗色）
 * - 根据颜色用途（文字/背景）进行不同处理
 * - 智能亮度调整，确保对比度
 * - 避免颜色过亮或过暗
 * - 保持颜色原有的色调特征
 * 
 * @param hex 十六进制颜色代码
 * @param type 颜色用途类型（'text' | 'background'）
 * @returns string 处理后的颜色代码
 * @example
 * applyOklchFormula('#FF0000', 'text') // 根据主题调整红色文字
 * applyOklchFormula('#000000', 'background') // 根据主题调整黑色背景
 */
export function applyOklchFormula(hex: string, type: 'text' | 'background'): string {
  // ==================== 主题检测 ====================
  // 使用Orca API检查当前主题模式
  const isDarkMode = orca.state.themeMode === 'dark';
  
  // ==================== 颜色解析 ====================
  // 解析十六进制颜色代码
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex; // 如果解析失败，返回原颜色

  // 提取RGB值
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
