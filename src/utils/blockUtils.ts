/**
 * Orca标签页插件块处理工具文件
 * 
 * 此文件提供与Orca块相关的工具函数，包括：
 * - 日期格式化和处理
 * - 块类型检测和识别
 * - 块属性提取和操作
 * - 块内容分析和处理
 * 
 * 这些工具函数是插件与Orca块系统交互的核心组件。
 * 
 * @file blockUtils.ts
 * @version 2.4.0
 * @since 2024
 */

// ==================== 依赖导入 ====================
// 日期处理库 - 提供强大的日期格式化和操作功能
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
// 国际化支持 - 提供多语言日期格式支持
import { zhCN as zhCNLocale, enUS as enUSLocale } from 'date-fns/locale';
// 常量定义 - 导入应用配置常量和属性类型
import { AppKeys, PropType } from '../constants';

// ==================== 导出声明 ====================
// 导出 date-fns 的 format 函数供其他模块使用
export { format };

// ==================== 日期处理函数 ====================
/**
 * 专门格式化日记日期（用于标签显示）
 * 
 * 这是一个智能的日期格式化函数，专门用于在标签页中显示日记日期。
 * 支持用户自定义格式、相对日期显示和多语言支持。
 * 
 * 功能特性：
 * - 支持用户自定义日期格式
 * - 智能相对日期显示（今天、昨天、明天）
 * - 多语言支持（中文、英文）
 * - 星期几的中文处理
 * - 错误处理和降级机制
 * 
 * @param date 要格式化的日期对象
 * @returns string 格式化后的日期字符串
 * @throws 当日期格式无效时抛出错误
 */
export function formatJournalDate(date: Date): string {
  try {
    // ==================== 获取用户设置 ====================
    // 从Orca设置中获取用户的日期格式偏好
    let dateFormat = orca.state.settings[AppKeys.JournalDateFormat];
    
    // 如果没有设置或设置无效，使用默认格式
    if (!dateFormat || typeof dateFormat !== 'string') {
      const locale = orca.state.locale || 'zh-CN';
      // 根据语言环境选择默认格式
      dateFormat = locale.startsWith('zh') ? 'yyyy年MM月dd日' : 'yyyy-MM-dd';
    }

    // ==================== 相对日期处理 ====================
    // 检查是否为相对日期，提供更友好的显示
    if (isToday(date)) {
      return '今天';
    } else if (isYesterday(date)) {
      return '昨天';
    } else if (isTomorrow(date)) {
      return '明天';
    }

    // 使用用户设置的格式
    try {
      // 检查是否包含星期几格式（E）
      if (dateFormat.includes('E')) {
        const locale = orca.state.locale || 'zh-CN';
        
        if (locale.startsWith('zh')) {
          // 中文环境，需要手动处理星期几
          const weekday = date.getDay(); // 0=周日, 1=周一, ..., 6=周六
          const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
          const weekdayText = weekdays[weekday];
          
          // 替换E为中文星期几
          const chinesePattern = dateFormat.replace(/E/g, weekdayText);
          return format(date, chinesePattern);
        } else {
          // 英文环境，使用date-fns的默认处理
          return format(date, dateFormat);
        }
      } else {
        // 不包含星期几，直接格式化
        return format(date, dateFormat);
      }
    } catch (e) {
      // 如果用户设置的格式无效，尝试常见格式
      const fallbackFormats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy年MM月dd日'];
      
      for (const fallbackFormat of fallbackFormats) {
        try {
          return format(date, fallbackFormat);
        } catch (e2) {
          continue;
        }
      }
      
      // 如果所有格式都失败，返回默认格式
      return date.toLocaleDateString();
    }
  } catch (e) {
    return date.toLocaleDateString();
  }
}

/**
 * 使用BlockProperty API提取日期块信息
 */
export function extractJournalInfo(block: any): Date | null {
  try {
    // 查找_repr属性（类型应该是PropType.JSON = 0）
    const reprProp = findProperty(block, '_repr');
    if (!reprProp || reprProp.type !== PropType.JSON || !reprProp.value) {
      return null;
    }

    // 解析JSON类型的属性值
    const reprData = typeof reprProp.value === 'string' 
      ? JSON.parse(reprProp.value) 
      : reprProp.value;

    // 检查是否是journal类型的日期块
    if (reprData.type === 'journal' && reprData.date) {
      return new Date(reprData.date);
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * 检测块类型
 */
export async function detectBlockType(block: any): Promise<string> {
  try {
    // 1. 检查是否是日期块
    const journalInfo = extractJournalInfo(block);
    if (journalInfo) {
      return 'journal';
    }

    // 2. 检查 data-type 属性（最高优先级）
    if (block['data-type']) {
      const dataType = block['data-type'];
      
      // 映射一些常见的data-type到我们的类型
      const typeMap: { [key: string]: string } = {
        'code': 'code',
        'table': 'table',
        'image': 'image',
        'link': 'link',
        'heading': 'heading',
        'quote': 'quote',
        'task': 'task',
        'list': 'list',
        'math': 'math'
      };
      
      return typeMap[dataType] || dataType;
    }

    // 3. 检查别名块
    if (block.aliases && block.aliases.length > 0) {
      
      const alias = block.aliases[0];
      if (alias) {
        try {
          // 使用 _hide 属性判断：有 _hide 且为 truthy 的是页面，否则是标签
          const hideProp = findProperty(block, '_hide');
          const isPage = hideProp && hideProp.value;
          
          if (isPage) {
            return 'page';
          } else {
            return 'alias';
          }
        } catch (e) {
          return 'alias';
        }
      }
    }

    // 4. 检查_repr属性中的类型
    const reprProp = findProperty(block, '_repr');
    if (reprProp && reprProp.type === PropType.JSON && reprProp.value) {
      try {
        const reprData = typeof reprProp.value === 'string' 
          ? JSON.parse(reprProp.value) 
          : reprProp.value;
        
        if (reprData.type) {
          return reprData.type;
        }
      } catch (e) {
        // 解析_repr属性失败
      }
    }

    // 5. 根据content内容推断类型
    if (block.content && Array.isArray(block.content)) {
      // 检查是否包含代码块
      const hasCodeBlock = block.content.some((item: any) => 
        item && typeof item === 'object' && item.type === 'code'
      );
      if (hasCodeBlock) {
        return 'code';
      }

      // 检查是否包含表格
      const hasTable = block.content.some((item: any) => 
        item && typeof item === 'object' && item.type === 'table'
      );
      if (hasTable) {
        return 'table';
      }

      // 检查是否包含图片
      const hasImage = block.content.some((item: any) => 
        item && typeof item === 'object' && item.type === 'image'
      );
      if (hasImage) {
        return 'image';
      }

      // 检查是否包含链接
      const hasLink = block.content.some((item: any) => 
        item && typeof item === 'object' && item.type === 'link'
      );
      if (hasLink) {
        return 'link';
      }
    }

    // 6. 检查块文本特征
    if (block.text) {
      const text = block.text.trim();
      
      // 检查是否是标题（以#开头）
      if (text.startsWith('#')) {
        return 'heading';
      }

      // 检查是否是引用（以>开头）
      if (text.startsWith('> ')) {
        return 'quote';
      }

      // 检查是否是代码行
      if (text.startsWith('```') || text.startsWith('`')) {
        return 'code';
      }

      // 检查是否是任务项
      if (text.startsWith('- [ ]') || text.startsWith('- [x]') || text.startsWith('* [ ]') || text.startsWith('* [x]')) {
        return 'task';
      }

      // 检查是否是表格（包含|分隔符且有多行）
      if (text.includes('|') && text.split('\n').length > 1) {
        return 'table';
      }

      // 检查是否是列表（无序列表：- * + 开头，有序列表：数字. 开头）
      if (text.startsWith('- ') || text.startsWith('* ') || text.startsWith('+ ') || 
          /^\d+\.\s/.test(text)) {
        return 'list';
      }

      // 检查是否包含URL链接
      const urlPattern = /https?:\/\/[^\s]+/;
      if (urlPattern.test(text)) {
        return 'link';
      }

      // 检查是否是数学公式
      if (text.includes('$$') || text.includes('$') && text.includes('=')) {
        return 'math';
      }
    }

    return 'default';
  } catch (e) {
    return 'default';
  }
}

/**
 * 根据块类型获取图标
 */
export function getBlockTypeIcon(blockType: string): string {
  const iconMap: { [key: string]: string } = {
    'journal': '📅',      // 日期块 - 保持emoji
    'alias': 'ti ti-tag',       // 别名块
    'page': 'ti ti-file-text',  // 页面
    'heading': 'ti ti-hash',    // 标题
    'code': 'ti ti-code',       // 代码
    'table': 'ti ti-table',     // 表格
    'image': 'ti ti-photo',     // 图片
    'link': 'ti ti-link',       // 链接
    'quote': 'ti ti-quote',     // 引用
    'task': 'ti ti-checkbox',   // 任务
    'list': 'ti ti-list',       // 列表
    'math': 'ti ti-math',       // 数学公式
    'default': 'ti ti-file'     // 默认
  };

  const icon = iconMap[blockType] || iconMap['default'];
  return icon;
}

/**
 * 检查字符串是否是日期格式
 */
export function isDateString(str: string): boolean {
  // 检查常见的日期格式
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,        // YYYY-MM-DD
    /^\d{4}\/\d{2}\/\d{2}$/,      // YYYY/MM/DD
    /^\d{2}\/\d{2}\/\d{4}$/,      // MM/DD/YYYY
    /^\d{4}-\d{2}-\d{2}T/,        // ISO format start
    /^\d{4}年\d{1,2}月\d{1,2}日$/, // 中文格式
  ];

  return datePatterns.some(pattern => pattern.test(str));
}

/**
 * 查找块的属性
 */
export function findProperty(block: any, propertyName: string): any {
  if (!block.properties || !Array.isArray(block.properties)) {
    return null;
  }

  return block.properties.find((prop: any) => prop.name === propertyName);
}
