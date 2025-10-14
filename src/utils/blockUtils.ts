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
            return 'tag';
          }
        } catch (e) {
          return 'tag';
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
 * 根据块类型获取图标（增强版）
 * 
 * 功能说明：
 * - 支持更多块类型的图标映射
 * - 提供智能图标选择
 * - 支持自定义图标
 * - 提供降级处理
 */
export function getBlockTypeIcon(blockType: string): string {
  const iconMap: { [key: string]: string } = {
    // 基础块类型
    'journal': '📅',              // 日期块 - 保持emoji
    'alias': 'ti ti-tag',         // 别名块
    'page': 'ti ti-file',         // 页面
    'tag': 'ti ti-hash',          // 标签
    'heading': 'ti ti-heading',   // 标题
    'code': 'ti ti-code',         // 代码
    'table': 'ti ti-table',       // 表格
    'image': 'ti ti-photo',       // 图片
    'link': 'ti ti-link',         // 链接
    'list': 'ti ti-list',         // 列表
    'quote': 'ti ti-quote',       // 引用
    'text': 'ti ti-cube',    // 普通文本
    'block': 'ti ti-square',      // 块
    'task': 'ti ti-checkbox',     // 任务
    'math': 'ti ti-math',         // 数学公式
    
    // 扩展块类型
    'idea': 'ti ti-bulb',         // 想法
    'question': 'ti ti-help-circle',     // 问题
    'answer': 'ti ti-message-circle',    // 答案
    'summary': 'ti ti-cube',        // 总结
    'reference': 'ti ti-book',           // 参考
    'example': 'ti ti-code',             // 示例
    'warning': 'ti ti-alert-triangle',   // 警告
    'info': 'ti ti-info-circle',         // 信息
    'tip': 'ti ti-lightbulb',            // 提示
    'note': 'ti ti-note',                // 笔记
    'todo': 'ti ti-checkbox',            // 待办
    'done': 'ti ti-check',               // 完成
    'important': 'ti ti-star',           // 重要
    'urgent': 'ti ti-alert-circle',      // 紧急
    'meeting': 'ti ti-calendar',         // 会议
    'event': 'ti ti-calendar-event',     // 事件
    'project': 'ti ti-folder',           // 项目
    'goal': 'ti ti-target',              // 目标
    'habit': 'ti ti-repeat',             // 习惯
    'bookmark': 'ti ti-bookmark',        // 书签
    'attachment': 'ti ti-paperclip',     // 附件
    'video': 'ti ti-video',              // 视频
    'audio': 'ti ti-headphones',         // 音频
    'document': 'ti ti-file',            // 文档
    'spreadsheet': 'ti ti-table',        // 电子表格
    'presentation': 'ti ti-presentation', // 演示文稿
    'database': 'ti ti-database',        // 数据库
    'api': 'ti ti-plug',                 // API
    'config': 'ti ti-settings',          // 配置
    'log': 'ti ti-cube',            // 日志
    'error': 'ti ti-alert-triangle',     // 错误
    'success': 'ti ti-check-circle',     // 成功
    'progress': 'ti ti-progress',        // 进度
    'status': 'ti ti-info-circle',       // 状态
    'version': 'ti ti-git-branch',       // 版本
    'commit': 'ti ti-git-commit',        // 提交
    'branch': 'ti ti-git-branch',        // 分支
    'merge': 'ti ti-git-merge',          // 合并
    'pull': 'ti ti-git-pull',            // 拉取
    'push': 'ti ti-git-push',            // 推送
    'deploy': 'ti ti-rocket',            // 部署
    'build': 'ti ti-hammer',             // 构建
    'test': 'ti ti-flask',               // 测试
    'debug': 'ti ti-bug',                // 调试
    'performance': 'ti ti-gauge',        // 性能
    'security': 'ti ti-shield',          // 安全
    'backup': 'ti ti-archive',           // 备份
    'restore': 'ti ti-refresh',          // 恢复
    'sync': 'ti ti-refresh',             // 同步
    'export': 'ti ti-download',          // 导出
    'import': 'ti ti-upload',            // 导入
    'share': 'ti ti-share',              // 分享
    'collaborate': 'ti ti-users',        // 协作
    'review': 'ti ti-eye',               // 审查
    'approve': 'ti ti-check',            // 批准
    'reject': 'ti ti-x',                 // 拒绝
    'comment': 'ti ti-message',          // 评论
    'feedback': 'ti ti-message-circle',  // 反馈
    'suggestion': 'ti ti-lightbulb',     // 建议
    'improvement': 'ti ti-trending-up',  // 改进
    'optimization': 'ti ti-zap',         // 优化
    'refactor': 'ti ti-refresh',         // 重构
    'migration': 'ti ti-arrow-right',    // 迁移
    'upgrade': 'ti ti-arrow-up',         // 升级
    'downgrade': 'ti ti-arrow-down',     // 降级
    'rollback': 'ti ti-undo',            // 回滚
    'default': 'ti ti-file'              // 默认
  };

  // 智能图标选择
  let icon = iconMap[blockType];
  
  // 如果没有找到精确匹配，尝试模糊匹配
  if (!icon) {
    const smartIcon = getSmartIcon(blockType);
    if (smartIcon) {
      icon = smartIcon;
    }
  }
  
  // 如果还是没有找到，使用默认图标
  if (!icon) {
    icon = iconMap['default'];
  }

  return icon;
}

/**
 * 智能图标选择（通过关键词匹配）
 */
function getSmartIcon(blockType: string): string | null {
  const lowerType = blockType.toLowerCase();
  
  // 关键词匹配
  const keywordMap: { [key: string]: string } = {
    'date': 'ti ti-calendar',
    'time': 'ti ti-clock',
    'calendar': 'ti ti-calendar',
    'schedule': 'ti ti-calendar',
    'plan': 'ti ti-calendar',
    'todo': 'ti ti-checkbox',
    'task': 'ti ti-checkbox',
    'check': 'ti ti-check',
    'done': 'ti ti-check',
    'complete': 'ti ti-check',
    'finish': 'ti ti-check',
    'code': 'ti ti-code',
    'program': 'ti ti-code',
    'script': 'ti ti-code',
    'function': 'ti ti-code',
    'method': 'ti ti-code',
    'class': 'ti ti-code',
    'object': 'ti ti-code',
    'variable': 'ti ti-code',
    'constant': 'ti ti-code',
    'string': 'ti ti-code',
    'number': 'ti ti-code',
    'boolean': 'ti ti-code',
    'array': 'ti ti-code',
    'list': 'ti ti-list',
    'item': 'ti ti-list',
    'element': 'ti ti-list',
    'entry': 'ti ti-list',
    'record': 'ti ti-list',
    'row': 'ti ti-list',
    'column': 'ti ti-list',
    'table': 'ti ti-table',
    'data': 'ti ti-database',
    'info': 'ti ti-info-circle',
    'information': 'ti ti-info-circle',
    'detail': 'ti ti-info-circle',
    'description': 'ti ti-info-circle',
    'explanation': 'ti ti-info-circle',
    'help': 'ti ti-help-circle',
    'question': 'ti ti-help-circle',
    'ask': 'ti ti-help-circle',
    'answer': 'ti ti-message-circle',
    'reply': 'ti ti-message-circle',
    'response': 'ti ti-message-circle',
    'comment': 'ti ti-message',
    'note': 'ti ti-note',
    'remark': 'ti ti-note',
    'memo': 'ti ti-note',
    'tip': 'ti ti-lightbulb',
    'hint': 'ti ti-lightbulb',
    'suggestion': 'ti ti-lightbulb',
    'idea': 'ti ti-bulb',
    'concept': 'ti ti-bulb',
    'thought': 'ti ti-bulb',
    'warning': 'ti ti-alert-triangle',
    'alert': 'ti ti-alert-triangle',
    'caution': 'ti ti-alert-triangle',
    'danger': 'ti ti-alert-triangle',
    'error': 'ti ti-alert-triangle',
    'mistake': 'ti ti-alert-triangle',
    'bug': 'ti ti-bug',
    'issue': 'ti ti-bug',
    'problem': 'ti ti-bug',
    'success': 'ti ti-check-circle',
    'win': 'ti ti-check-circle',
    'victory': 'ti ti-check-circle',
    'achievement': 'ti ti-check-circle',
    'goal': 'ti ti-target',
    'target': 'ti ti-target',
    'objective': 'ti ti-target',
    'aim': 'ti ti-target',
    'purpose': 'ti ti-target',
    'file': 'ti ti-file',
    'document': 'ti ti-file',
    'paper': 'ti ti-file',
    'report': 'ti ti-file',
    'article': 'ti ti-file',
    'post': 'ti ti-file',
    'page': 'ti ti-cube',
    'web': 'ti ti-cube',
    'site': 'ti ti-cube',
    'url': 'ti ti-link',
    'link': 'ti ti-link',
    'href': 'ti ti-link',
    'reference': 'ti ti-book',
    'book': 'ti ti-book',
    'manual': 'ti ti-book',
    'guide': 'ti ti-book',
    'tutorial': 'ti ti-book',
    'example': 'ti ti-code',
    'sample': 'ti ti-code',
    'demo': 'ti ti-code',
    'test': 'ti ti-flask',
    'testing': 'ti ti-flask',
    'experiment': 'ti ti-flask',
    'trial': 'ti ti-flask',
    'image': 'ti ti-photo',
    'picture': 'ti ti-photo',
    'photo': 'ti ti-photo',
    'screenshot': 'ti ti-photo',
    'video': 'ti ti-video',
    'movie': 'ti ti-video',
    'clip': 'ti ti-video',
    'audio': 'ti ti-headphones',
    'sound': 'ti ti-headphones',
    'music': 'ti ti-headphones',
    'podcast': 'ti ti-headphones',
    'attachment': 'ti ti-paperclip',
    'attach': 'ti ti-paperclip',
    'download': 'ti ti-download',
    'upload': 'ti ti-upload',
    'import': 'ti ti-upload',
    'export': 'ti ti-download',
    'backup': 'ti ti-archive',
    'archive': 'ti ti-archive',
    'compress': 'ti ti-archive',
    'zip': 'ti ti-archive',
    'folder': 'ti ti-folder',
    'directory': 'ti ti-folder',
    'path': 'ti ti-folder',
    'project': 'ti ti-folder',
    'workspace': 'ti ti-folder',
    'team': 'ti ti-users',
    'group': 'ti ti-users',
    'user': 'ti ti-user',
    'person': 'ti ti-user',
    'people': 'ti ti-users',
    'collaborate': 'ti ti-users',
    'share': 'ti ti-share',
    'public': 'ti ti-share',
    'private': 'ti ti-lock',
    'secure': 'ti ti-shield',
    'security': 'ti ti-shield',
    'protect': 'ti ti-shield',
    'safe': 'ti ti-shield',
    'settings': 'ti ti-settings',
    'config': 'ti ti-settings',
    'configuration': 'ti ti-settings',
    'preference': 'ti ti-settings',
    'option': 'ti ti-settings',
    'parameter': 'ti ti-settings'
  };

  // 查找匹配的关键词
  for (const [keyword, icon] of Object.entries(keywordMap)) {
    if (lowerType.includes(keyword)) {
      return icon;
    }
  }

  return null;
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
