/**
 * 主题和样式管理相关的工具函数
 */

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * 颜色类型
 */
export type ColorType = 'text' | 'background' | 'border' | 'accent';

/**
 * 主题配置接口
 */
export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor?: string;
  accentColor?: string;
  customColors?: Record<string, string>;
}

/**
 * 默认主题配置
 */
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'auto',
  primaryColor: '#3b82f6',
  accentColor: '#8b5cf6'
};

/**
 * 检查是否为暗色模式
 */
export function isDarkMode(themeMode: ThemeMode): boolean {
  if (themeMode === 'dark') return true;
  if (themeMode === 'light') return false;
  
  // auto 模式：检查系统偏好
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * 获取当前主题模式
 */
export function getCurrentThemeMode(): ThemeMode {
  const stored = localStorage.getItem('orca-theme-mode');
  if (stored && ['light', 'dark', 'auto'].includes(stored)) {
    return stored as ThemeMode;
  }
  return 'auto';
}

/**
 * 设置主题模式
 */
export function setThemeMode(mode: ThemeMode): void {
  localStorage.setItem('orca-theme-mode', mode);
  updateDocumentTheme(mode);
}

/**
 * 更新文档主题
 */
export function updateDocumentTheme(mode: ThemeMode): void {
  const isDark = isDarkMode(mode);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', isDark);
}

/**
 * 监听主题变化
 */
export function watchThemeChange(callback: (isDark: boolean) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // 返回清理函数
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}

/**
 * 获取主题颜色
 */
export function getThemeColor(
  colorType: ColorType,
  isDark: boolean,
  customColors?: Record<string, string>
): string {
  const colors = {
    light: {
      text: '#1f2937',
      background: '#ffffff',
      border: '#e5e7eb',
      accent: '#3b82f6'
    },
    dark: {
      text: '#f9fafb',
      background: '#111827',
      border: '#374151',
      accent: '#60a5fa'
    }
  };
  
  const theme = isDark ? colors.dark : colors.light;
  return customColors?.[colorType] || theme[colorType];
}

/**
 * 应用OKLCH颜色公式
 */
export function applyOklchFormula(hex: string, type: 'text' | 'background', isDarkMode?: boolean): string {
  try {
    // 确保颜色值以#开头
    const colorHex = hex.startsWith('#') ? hex : `#${hex}`;
    
    // 验证十六进制颜色格式
    if (!/^#[0-9A-Fa-f]{6}$/.test(colorHex)) {
      console.warn('无效的十六进制颜色格式:', colorHex);
      return type === 'background' ? 'rgba(0, 0, 0, 0.1)' : '#333333';
    }
    
    // 将十六进制颜色转换为RGB
    const r = parseInt(colorHex.slice(1, 3), 16);
    const g = parseInt(colorHex.slice(3, 5), 16);
    const b = parseInt(colorHex.slice(5, 7), 16);

    // 如果没有传入isDarkMode参数，则自动检测
    const darkMode = isDarkMode !== undefined ? isDarkMode : 
      (document.documentElement.classList.contains('dark') || 
       (window as any).orca?.state?.themeMode === 'dark');

    if (type === 'background') {
      // 背景色：使用OKLCH from语法，基于原色生成背景色
      return `oklch(from rgb(${r}, ${g}, ${b}) calc(l * 0.8) calc(c * 1.5) h / 25%)`;
    } else {
      // 文字色：使用OKLCH from语法，基于原色生成文字色
      if (darkMode) {
        // 暗色模式：提高亮度，保持饱和度
        return `oklch(from rgb(${r}, ${g}, ${b}) calc(l * 1.6) c h)`;
      } else {
        // 亮色模式：降低亮度，保持饱和度
        return `oklch(from rgb(${r}, ${g}, ${b}) calc(l * 0.6) c h)`;
      }
    }
  } catch (error) {
    console.warn('颜色转换失败:', error);
    // 回退到简单的颜色处理
    if (type === 'background') {
      return 'rgba(0, 0, 0, 0.1)';
    } else {
      return '#333333';
    }
  }
}

/**
 * RGB转OKLCH
 */
function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  // 先转换为线性RGB
  const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // 转换为XYZ (使用sRGB到XYZ的转换矩阵)
  const x = linearR * 0.4124564 + linearG * 0.3575761 + linearB * 0.1804375;
  const y = linearR * 0.2126729 + linearG * 0.7151522 + linearB * 0.0721750;
  const z = linearR * 0.0193339 + linearG * 0.1191920 + linearB * 0.9503041;

  // 转换为OKLAB (使用正确的OKLAB转换矩阵)
  const l = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const a = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const b_lab = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z);

  // 转换为OKLCH
  const l_oklch = l;
  const c_oklch = Math.sqrt(a * a + b_lab * b_lab);
  const h_oklch = Math.atan2(b_lab, a) * (180 / Math.PI);

  // 确保色相在0-360度范围内
  const h_normalized = h_oklch < 0 ? h_oklch + 360 : h_oklch;

  return [l_oklch, c_oklch, h_normalized];
}

/**
 * 生成渐变背景
 */
export function generateGradientBackground(
  colors: string[],
  direction: 'horizontal' | 'vertical' | 'diagonal' | 'radial' = 'horizontal',
  opacity: number = 1
): string {
  const directionMap = {
    horizontal: 'to right',
    vertical: 'to bottom',
    diagonal: 'to bottom right',
    radial: 'circle'
  };

  const colorStops = colors.map((color, index) => {
    const position = (index / (colors.length - 1)) * 100;
    return `${color} ${position}%`;
  }).join(', ');

  if (direction === 'radial') {
    return `radial-gradient(circle, ${colorStops})`;
  } else {
    return `linear-gradient(${directionMap[direction]}, ${colorStops})`;
  }
}

/**
 * 生成阴影效果
 */
export function generateShadow(
  type: 'small' | 'medium' | 'large' | 'xlarge',
  color: string = 'rgba(0, 0, 0, 0.1)',
  isDark: boolean = false
): string {
  const shadows = {
    small: isDark 
      ? `0 1px 3px ${color}, 0 1px 2px ${color}`
      : `0 1px 2px ${color}`,
    medium: isDark
      ? `0 4px 6px ${color}, 0 2px 4px ${color}`
      : `0 4px 6px ${color}`,
    large: isDark
      ? `0 10px 15px ${color}, 0 4px 6px ${color}`
      : `0 10px 15px ${color}`,
    xlarge: isDark
      ? `0 20px 25px ${color}, 0 10px 10px ${color}`
      : `0 20px 25px ${color}`
  };

  return shadows[type];
}

/**
 * 生成过渡效果
 */
export function generateTransition(
  properties: string[] = ['all'],
  duration: number = 300,
  easing: string = 'ease-in-out',
  delay: number = 0
): string {
  return properties
    .map(prop => `${prop} ${duration}ms ${easing} ${delay}ms`)
    .join(', ');
}

/**
 * 生成毛玻璃效果
 */
export function generateBackdropBlur(
  blur: number = 8,
  opacity: number = 0.8,
  saturate: number = 180
): string {
  return `
    backdrop-filter: blur(${blur}px) saturate(${saturate}%);
    -webkit-backdrop-filter: blur(${blur}px) saturate(${saturate}%);
    background: rgba(255, 255, 255, ${opacity});
  `;
}

/**
 * 生成暗色毛玻璃效果
 */
export function generateDarkBackdropBlur(
  blur: number = 8,
  opacity: number = 0.1,
  saturate: number = 180
): string {
  return `
    backdrop-filter: blur(${blur}px) saturate(${saturate}%);
    -webkit-backdrop-filter: blur(${blur}px) saturate(${saturate}%);
    background: rgba(0, 0, 0, ${opacity});
  `;
}

/**
 * 生成边框样式
 */
export function generateBorder(
  width: number = 1,
  style: 'solid' | 'dashed' | 'dotted' | 'none' = 'solid',
  color: string = 'rgba(0, 0, 0, 0.1)',
  radius: number = 4
): string {
  return `
    border: ${width}px ${style} ${color};
    border-radius: ${radius}px;
  `;
}

/**
 * 生成焦点样式
 */
export function generateFocusStyle(
  color: string = '#3b82f6',
  width: number = 2,
  offset: number = 2
): string {
  return `
    outline: none;
    box-shadow: 0 0 0 ${width}px ${color}${offset > 0 ? `, 0 0 0 ${width + offset}px ${color}40` : ''};
  `;
}

/**
 * 生成悬停效果
 */
export function generateHoverEffect(
  baseColor: string,
  hoverColor: string,
  transition: string = 'all 0.2s ease'
): string {
  return `
    background-color: ${baseColor};
    transition: ${transition};
    
    &:hover {
      background-color: ${hoverColor};
    }
  `;
}

/**
 * 生成激活效果
 */
export function generateActiveEffect(
  baseColor: string,
  activeColor: string,
  transition: string = 'all 0.1s ease'
): string {
  return `
    background-color: ${baseColor};
    transition: ${transition};
    
    &:active {
      background-color: ${activeColor};
      transform: scale(0.98);
    }
  `;
}

/**
 * 生成禁用样式
 */
export function generateDisabledStyle(
  baseColor: string,
  disabledColor: string = 'rgba(0, 0, 0, 0.1)',
  disabledTextColor: string = 'rgba(0, 0, 0, 0.3)'
): string {
  return `
    background-color: ${baseColor};
    color: ${disabledTextColor};
    cursor: not-allowed;
    opacity: 0.6;
    
    &:disabled {
      background-color: ${disabledColor};
      color: ${disabledTextColor};
    }
  `;
}

/**
 * 生成响应式断点
 */
export function generateResponsiveBreakpoints(): Record<string, string> {
  return {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  };
}

/**
 * 生成媒体查询
 */
export function generateMediaQuery(
  breakpoint: string,
  styles: string
): string {
  return `
    @media (min-width: ${breakpoint}) {
      ${styles}
    }
  `;
}

/**
 * 生成暗色模式媒体查询
 */
export function generateDarkModeQuery(styles: string): string {
  return `
    @media (prefers-color-scheme: dark) {
      ${styles}
    }
  `;
}

/**
 * 生成打印样式
 */
export function generatePrintStyles(styles: string): string {
  return `
    @media print {
      ${styles}
    }
  `;
}

/**
 * 生成动画关键帧
 */
export function generateKeyframes(
  name: string,
  keyframes: Record<string, Record<string, string>>
): string {
  const keyframeString = Object.entries(keyframes)
    .map(([percentage, properties]) => {
      const props = Object.entries(properties)
        .map(([prop, value]) => `    ${prop}: ${value};`)
        .join('\n');
      return `  ${percentage}% {\n${props}\n  }`;
    })
    .join('\n');

  return `
    @keyframes ${name} {
${keyframeString}
    }
  `;
}

/**
 * 生成CSS变量
 */
export function generateCSSVariables(
  variables: Record<string, string>,
  prefix: string = '--orca'
): string {
  return Object.entries(variables)
    .map(([key, value]) => `${prefix}-${key}: ${value};`)
    .join('\n');
}

/**
 * 应用主题到元素
 */
export function applyThemeToElement(
  element: HTMLElement,
  theme: ThemeConfig,
  isDark: boolean
): void {
  const computedStyle = getComputedStyle(element);
  const primaryColor = theme.primaryColor || DEFAULT_THEME_CONFIG.primaryColor!;
  const accentColor = theme.accentColor || DEFAULT_THEME_CONFIG.accentColor!;

  // 应用CSS变量
  element.style.setProperty('--orca-primary', primaryColor);
  element.style.setProperty('--orca-accent', accentColor);
  element.style.setProperty('--orca-text', getThemeColor('text', isDark));
  element.style.setProperty('--orca-background', getThemeColor('background', isDark));
  element.style.setProperty('--orca-border', getThemeColor('border', isDark));

  // 应用自定义颜色
  if (theme.customColors) {
    Object.entries(theme.customColors).forEach(([key, value]) => {
      element.style.setProperty(`--orca-${key}`, value);
    });
  }
}

/**
 * 创建主题样式表
 */
export function createThemeStyleSheet(
  theme: ThemeConfig,
  isDark: boolean
): HTMLStyleElement {
  const style = document.createElement('style');
  style.id = 'orca-theme-styles';
  
  const primaryColor = theme.primaryColor || DEFAULT_THEME_CONFIG.primaryColor!;
  const accentColor = theme.accentColor || DEFAULT_THEME_CONFIG.accentColor!;
  
  const css = `
    :root {
      --orca-primary: ${primaryColor};
      --orca-accent: ${accentColor};
      --orca-text: ${getThemeColor('text', isDark)};
      --orca-background: ${getThemeColor('background', isDark)};
      --orca-border: ${getThemeColor('border', isDark)};
    }
    
    [data-theme="dark"] {
      --orca-text: ${getThemeColor('text', true)};
      --orca-background: ${getThemeColor('background', true)};
      --orca-border: ${getThemeColor('border', true)};
    }
    
    [data-theme="light"] {
      --orca-text: ${getThemeColor('text', false)};
      --orca-background: ${getThemeColor('background', false)};
      --orca-border: ${getThemeColor('border', false)};
    }
  `;
  
  style.textContent = css;
  return style;
}

/**
 * 更新主题样式表
 */
export function updateThemeStyleSheet(
  theme: ThemeConfig,
  isDark: boolean
): void {
  let style = document.getElementById('orca-theme-styles') as HTMLStyleElement;
  
  if (!style) {
    style = createThemeStyleSheet(theme, isDark);
    document.head.appendChild(style);
  } else {
    const primaryColor = theme.primaryColor || DEFAULT_THEME_CONFIG.primaryColor!;
    const accentColor = theme.accentColor || DEFAULT_THEME_CONFIG.accentColor!;
    
    const css = `
      :root {
        --orca-primary: ${primaryColor};
        --orca-accent: ${accentColor};
        --orca-text: ${getThemeColor('text', isDark)};
        --orca-background: ${getThemeColor('background', isDark)};
        --orca-border: ${getThemeColor('border', isDark)};
      }
      
      [data-theme="dark"] {
        --orca-text: ${getThemeColor('text', true)};
        --orca-background: ${getThemeColor('background', true)};
        --orca-border: ${getThemeColor('border', true)};
      }
      
      [data-theme="light"] {
        --orca-text: ${getThemeColor('text', false)};
        --orca-background: ${getThemeColor('background', false)};
        --orca-border: ${getThemeColor('border', false)};
      }
    `;
    
    style.textContent = css;
  }
}
