/**
 * 块处理相关的工具函数
 */

import { formatJournalDate, extractJournalInfo, detectBlockType, getBlockTypeIcon, findProperty, format } from './blockUtils';

/**
 * 块类型检测结果接口
 */
export interface BlockTypeDetectionResult {
  type: string;
  confidence: number;
  method: string;
  details?: any;
}

/**
 * 块内容分析结果接口
 */
export interface BlockContentAnalysis {
  text: string;
  hasBlockRefs: boolean;
  hasLinks: boolean;
  hasImages: boolean;
  hasCode: boolean;
  hasMath: boolean;
  wordCount: number;
  charCount: number;
  fragments: ContentFragment[];
}

/**
 * 内容片段接口
 */
export interface ContentFragment {
  t: string;
  v: any;
  f?: string;
  fa?: any;
  u?: string;
  a?: string;
}

/**
 * 块属性接口
 */
export interface BlockProperty {
  name: string;
  value: any;
  type: number;
}

/**
 * 块扫描结果接口
 */
export interface BlockScanResult {
  blockId: string;
  title: string;
  type: string;
  icon: string;
  isJournal: boolean;
  properties: BlockProperty[];
  content: BlockContentAnalysis;
  aliases: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 增强的块类型检测
 */
export async function detectBlockTypeEnhanced(block: any): Promise<BlockTypeDetectionResult> {
  try {
    // 1. 检查是否是日期块
    const journalInfo = extractJournalInfo(block);
    if (journalInfo) {
      return {
        type: 'journal',
        confidence: 1.0,
        method: 'journal_info',
        details: { date: journalInfo }
      };
    }

    // 2. 检查 data-type 属性（最高优先级）
    if (block['data-type']) {
      const dataType = block['data-type'];
      let mappedType = dataType;
      
      switch (dataType) {
        case 'table2':
          mappedType = 'table';
          break;
        case 'ul':
        case 'ol':
          mappedType = 'list';
          break;
        default:
          // 保持原始类型
          break;
      }
      
      return {
        type: mappedType,
        confidence: 0.9,
        method: 'data_type',
        details: { originalType: dataType }
      };
    }

    // 3. 检查别名块
    if (block.aliases && block.aliases.length > 0) {
      const alias = block.aliases[0];
      if (alias) {
        try {
          // 使用 _hide 属性判断页面和标签
          const hideProp = findProperty(block, '_hide');
          const isPage = hideProp && hideProp.value;
          
          if (isPage) {
            return {
              type: 'page',
              confidence: 0.8,
              method: 'alias_hide_property',
              details: { alias, hideValue: hideProp.value }
            };
          } else {
            return {
              type: 'tag',
              confidence: 0.8,
              method: 'alias_hide_property',
              details: { alias, hideValue: hideProp ? hideProp.value : 'undefined' }
            };
          }
        } catch (error) {
          // 回退到文本分析
          const isTag = alias.includes('#') || 
                       alias.includes('@') || 
                       (alias.length < 20 && alias.match(/^[a-zA-Z0-9_-]+$/)) ||
                       alias.match(/^[a-z]+$/i);
          
          return {
            type: isTag ? 'tag' : 'page',
            confidence: 0.6,
            method: 'alias_text_analysis',
            details: { alias, isTag }
          };
        }
      }
      
      return {
        type: 'alias',
        confidence: 0.5,
        method: 'alias_default',
        details: { aliases: block.aliases }
      };
    }

    // 4. 检查 _repr 属性
    const reprProp = findProperty(block, '_repr');
    if (reprProp && reprProp.type === 0 && reprProp.value) {
      try {
        const reprData = typeof reprProp.value === 'string' 
          ? JSON.parse(reprProp.value) 
          : reprProp.value;
        
        if (reprData.type) {
          return {
            type: reprData.type,
            confidence: 0.7,
            method: 'repr_property',
            details: { reprData }
          };
        }
      } catch (e) {
        // JSON解析失败，继续其他检测
      }
    }

    // 5. 检查块内容特征
    const contentAnalysis = await analyzeBlockContent(block);
    
    if (contentAnalysis.hasCode) {
      return {
        type: 'code',
        confidence: 0.8,
        method: 'content_analysis',
        details: { hasCode: true }
      };
    }
    
    if (contentAnalysis.hasMath) {
      return {
        type: 'math',
        confidence: 0.8,
        method: 'content_analysis',
        details: { hasMath: true }
      };
    }
    
    if (contentAnalysis.hasImages) {
      return {
        type: 'image',
        confidence: 0.8,
        method: 'content_analysis',
        details: { hasImages: true }
      };
    }
    
    if (contentAnalysis.hasLinks) {
      return {
        type: 'link',
        confidence: 0.7,
        method: 'content_analysis',
        details: { hasLinks: true }
      };
    }

    // 6. 检查文本内容特征
    const text = contentAnalysis.text;
    if (text) {
      // 检查是否是标题（以#开头）
      if (text.match(/^#{1,6}\s/)) {
        return {
          type: 'heading',
          confidence: 0.9,
          method: 'text_pattern',
          details: { pattern: 'heading' }
        };
      }
      
      // 检查是否是列表
      if (text.match(/^[\s]*[-*+]\s/) || text.match(/^[\s]*\d+\.\s/)) {
        return {
          type: 'list',
          confidence: 0.8,
          method: 'text_pattern',
          details: { pattern: 'list' }
        };
      }
      
      // 检查是否是表格
      if (text.includes('|') && text.split('\n').filter(line => line.includes('|')).length > 1) {
        return {
          type: 'table',
          confidence: 0.7,
          method: 'text_pattern',
          details: { pattern: 'table' }
        };
      }
    }

    // 7. 默认类型
    return {
      type: 'text',
      confidence: 0.3,
      method: 'default',
      details: { textLength: text.length }
    };
  } catch (error) {
    return {
      type: 'unknown',
      confidence: 0.0,
      method: 'error',
      details: { error: error instanceof Error ? error.message : String(error) }
    };
  }
}

/**
 * 分析块内容
 */
export async function analyzeBlockContent(block: any): Promise<BlockContentAnalysis> {
  const fragments: ContentFragment[] = [];
  let text = '';
  let hasBlockRefs = false;
  let hasLinks = false;
  let hasImages = false;
  let hasCode = false;
  let hasMath = false;

  // 分析 content 数组
  if (block.content && Array.isArray(block.content)) {
    for (const fragment of block.content) {
      fragments.push(fragment);
      
      if (fragment.t === 't' && fragment.v) {
        text += fragment.v;
      } else if (fragment.t === 'r') {
        hasBlockRefs = true;
        if (fragment.u) {
          hasLinks = true;
          text += fragment.v || fragment.u;
        } else if (fragment.a) {
          text += `[[${fragment.a}]]`;
        } else {
          text += `[[块${fragment.v}]]`;
        }
      } else if (fragment.t === 'br' && fragment.v) {
        hasBlockRefs = true;
        text += `[[块${fragment.v}]]`;
      } else if (fragment.t && fragment.t.includes('math') && fragment.v) {
        hasMath = true;
        text += `[数学: ${fragment.v}]`;
      } else if (fragment.t && fragment.t.includes('code') && fragment.v) {
        hasCode = true;
        text += `[代码: ${fragment.v}]`;
      } else if (fragment.t && fragment.t.includes('image') && fragment.v) {
        hasImages = true;
        text += `[图片: ${fragment.v}]`;
      } else if (fragment.v) {
        text += fragment.v;
      }
    }
  }

  // 如果没有 content，使用 text 字段
  if (!text && block.text) {
    text = block.text;
  }

  // 计算统计信息
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = text.length;

  return {
    text,
    hasBlockRefs,
    hasLinks,
    hasImages,
    hasCode,
    hasMath,
    wordCount,
    charCount,
    fragments
  };
}

/**
 * 检查内容是否包含块引用
 */
export function isTextWithBlockRefs(content: any[]): boolean {
  if (!Array.isArray(content) || content.length === 0) {
    return false;
  }
  
  let textCount = 0;
  let refCount = 0;
  
  for (const fragment of content) {
    if (fragment && typeof fragment === 'object') {
      if (fragment.t === 'text' && fragment.v) {
        textCount++;
      } else if (fragment.t === 'ref' && fragment.v) {
        refCount++;
      }
    }
  }
  
  // 如果同时有文本和块引用，且文本数量大于等于块引用数量，认为是文本+块引用组合
  return textCount > 0 && refCount > 0 && textCount >= refCount;
}

/**
 * 获取块属性
 */
export function getBlockProperty(block: any, propertyName: string): BlockProperty | null {
  return findProperty(block, propertyName);
}

/**
 * 获取所有块属性
 */
export function getAllBlockProperties(block: any): BlockProperty[] {
  const properties: BlockProperty[] = [];
  
  if (block.properties) {
    for (const [name, prop] of Object.entries(block.properties)) {
      if (prop && typeof prop === 'object' && 'value' in prop && 'type' in prop) {
        properties.push({
          name,
          value: (prop as any).value,
          type: (prop as any).type
        });
      }
    }
  }
  
  return properties;
}

/**
 * 检查块是否有指定属性
 */
export function hasBlockProperty(block: any, propertyName: string): boolean {
  return getBlockProperty(block, propertyName) !== null;
}

/**
 * 获取块属性值
 */
export function getBlockPropertyValue(block: any, propertyName: string): any {
  const prop = getBlockProperty(block, propertyName);
  return prop ? prop.value : null;
}

/**
 * 检查是否为日期字符串
 */
export function isDateStringEnhanced(str: string): boolean {
  // 简单的日期字符串检测
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO format
  ];
  
  return datePatterns.some(pattern => pattern.test(str)) || !isNaN(Date.parse(str));
}

/**
 * 获取增强的块类型图标
 */
export function getBlockTypeIconEnhanced(blockType: string): string {
  return getBlockTypeIcon(blockType);
}

/**
 * 扫描单个块
 */
export async function scanBlock(blockId: string, block: any): Promise<BlockScanResult> {
  try {
    // 检测块类型
    const typeResult = await detectBlockTypeEnhanced(block);
    
    // 分析内容
    const contentAnalysis = await analyzeBlockContent(block);
    
    // 获取所有属性
    const properties = getAllBlockProperties(block);
    
    // 提取标题
    let title = '';
    if (typeResult.type === 'journal') {
      const journalInfo = extractJournalInfo(block);
      if (journalInfo) {
        title = formatJournalDate(journalInfo);
      }
    } else if (block.aliases && block.aliases.length > 0) {
      title = block.aliases[0];
    } else if (contentAnalysis.text) {
      title = contentAnalysis.text.substring(0, 50);
    } else if (block.text) {
      title = block.text.substring(0, 50);
    } else {
      title = `块 ${blockId}`;
    }
    
    // 获取图标
    const icon = getBlockTypeIconEnhanced(typeResult.type);
    
    // 检查是否是日期块
    const isJournal = typeResult.type === 'journal';
    
    return {
      blockId,
      title,
      type: typeResult.type,
      icon,
      isJournal,
      properties,
      content: contentAnalysis,
      aliases: block.aliases || [],
      createdAt: block.createdAt ? new Date(block.createdAt) : undefined,
      updatedAt: block.updatedAt ? new Date(block.updatedAt) : undefined
    };
  } catch (error) {
    throw new Error(`扫描块失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 从内容中提取文本
 */
export async function extractTextFromContent(content: any[]): Promise<string> {
  if (!content || content.length === 0) return "";
  
  let text = "";
  for (const fragment of content) {
    // ContentFragment 结构: { t: "类型", v: "值", f?: "格式", fa?: {...} }
    
    if (fragment.t === "t" && fragment.v) {
      // 文本类型片段，v 是实际文本内容
      text += fragment.v;
    } else if (fragment.t === "r") {
      // 链接/引用类型片段
      if (fragment.u) {
        // 如果有URL，这是外部链接
        if (fragment.v) {
          text += fragment.v; // 显示文本
        } else {
          text += fragment.u; // 使用URL
        }
      } else if (fragment.a) {
        // 优先使用别名字段 a，并加上 [[]] 包围
        text += `[[${fragment.a}]]`;
      } else if (fragment.v && (typeof fragment.v === "number" || typeof fragment.v === "string")) {
        // 如果v是数字或字符串且没有URL，这是块引用
        text += `[[块${fragment.v}]]`;
      } else if (fragment.v) {
        // 其他情况，v作为显示文本
        text += fragment.v;
      }
    } else if (fragment.t === "br" && fragment.v) {
      // 块引用类型，v 通常是块ID
      text += `[[块${fragment.v}]]`;
    } else if (fragment.t && fragment.t.includes("math") && fragment.v) {
      // 数学公式类型，显示公式内容
      text += `[数学: ${fragment.v}]`;
    } else if (fragment.t && fragment.t.includes("code") && fragment.v) {
      // 代码类型，显示代码内容
      text += `[代码: ${fragment.v}]`;
    } else if (fragment.t && fragment.t.includes("image") && fragment.v) {
      // 图片类型，显示图片描述
      text += `[图片: ${fragment.v}]`;
    } else if (fragment.v) {
      // 其他情况，v作为显示文本
      text += fragment.v;
    }
  }
  
  return text;
}

/**
 * 扫描多个块
 */
export async function scanBlocks(blocks: { [blockId: string]: any }): Promise<BlockScanResult[]> {
  const results: BlockScanResult[] = [];
  
  for (const [blockId, block] of Object.entries(blocks)) {
    try {
      const result = await scanBlock(blockId, block);
      results.push(result);
    } catch (error) {
      console.warn(`扫描块 ${blockId} 失败:`, error);
    }
  }
  
  return results;
}

/**
 * 过滤块
 */
export function filterBlocks(
  blocks: BlockScanResult[],
  filter: (block: BlockScanResult) => boolean
): BlockScanResult[] {
  return blocks.filter(filter);
}

/**
 * 搜索块
 */
export function searchBlocks(
  blocks: BlockScanResult[],
  query: string,
  searchFields: ('title' | 'text' | 'type' | 'aliases')[] = ['title', 'text']
): BlockScanResult[] {
  const lowerQuery = query.toLowerCase();
  
  return blocks.filter(block => {
    return searchFields.some(field => {
      switch (field) {
        case 'title':
          return block.title.toLowerCase().includes(lowerQuery);
        case 'text':
          return block.content.text.toLowerCase().includes(lowerQuery);
        case 'type':
          return block.type.toLowerCase().includes(lowerQuery);
        case 'aliases':
          return block.aliases.some(alias => alias.toLowerCase().includes(lowerQuery));
        default:
          return false;
      }
    });
  });
}

/**
 * 排序块
 */
export function sortBlocks(
  blocks: BlockScanResult[],
  sortBy: 'title' | 'type' | 'createdAt' | 'updatedAt' | 'wordCount' | 'charCount',
  order: 'asc' | 'desc' = 'asc'
): BlockScanResult[] {
  return blocks.sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
        break;
      case 'createdAt':
        aValue = a.createdAt || new Date(0);
        bValue = b.createdAt || new Date(0);
        break;
      case 'updatedAt':
        aValue = a.updatedAt || new Date(0);
        bValue = b.updatedAt || new Date(0);
        break;
      case 'wordCount':
        aValue = a.content.wordCount;
        bValue = b.content.wordCount;
        break;
      case 'charCount':
        aValue = a.content.charCount;
        bValue = b.content.charCount;
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * 获取块统计信息
 */
export function getBlockStats(blocks: BlockScanResult[]): {
  total: number;
  byType: { [type: string]: number };
  totalWords: number;
  totalChars: number;
  withImages: number;
  withCode: number;
  withMath: number;
  withLinks: number;
  withBlockRefs: number;
} {
  const stats = {
    total: blocks.length,
    byType: {} as { [type: string]: number },
    totalWords: 0,
    totalChars: 0,
    withImages: 0,
    withCode: 0,
    withMath: 0,
    withLinks: 0,
    withBlockRefs: 0
  };
  
  for (const block of blocks) {
    // 按类型统计
    stats.byType[block.type] = (stats.byType[block.type] || 0) + 1;
    
    // 内容统计
    stats.totalWords += block.content.wordCount;
    stats.totalChars += block.content.charCount;
    
    if (block.content.hasImages) stats.withImages++;
    if (block.content.hasCode) stats.withCode++;
    if (block.content.hasMath) stats.withMath++;
    if (block.content.hasLinks) stats.withLinks++;
    if (block.content.hasBlockRefs) stats.withBlockRefs++;
  }
  
  return stats;
}

/**
 * 验证块数据
 */
export function validateBlockData(block: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!block) {
    errors.push('块数据为空');
    return { valid: false, errors };
  }
  
  if (!block.id) {
    errors.push('缺少块ID');
  }
  
  if (!block.content && !block.text) {
    errors.push('缺少块内容');
  }
  
  if (block.content && !Array.isArray(block.content)) {
    errors.push('块内容格式错误');
  }
  
  if (block.aliases && !Array.isArray(block.aliases)) {
    errors.push('块别名格式错误');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 清理块数据
 */
export function cleanBlockData(block: any): any {
  const cleaned = { ...block };
  
    // 清理空内容
    if (cleaned.content && Array.isArray(cleaned.content)) {
      cleaned.content = cleaned.content.filter((fragment: any) => 
        fragment && fragment.t && fragment.v !== undefined && fragment.v !== null && fragment.v !== ''
      );
    }
    
    // 清理空别名
    if (cleaned.aliases && Array.isArray(cleaned.aliases)) {
      cleaned.aliases = cleaned.aliases.filter((alias: any) => 
        alias && typeof alias === 'string' && alias.trim() !== ''
      );
    }
  
  // 清理空文本
  if (cleaned.text && typeof cleaned.text === 'string') {
    cleaned.text = cleaned.text.trim();
    if (cleaned.text === '') {
      delete cleaned.text;
    }
  }
  
  return cleaned;
}
