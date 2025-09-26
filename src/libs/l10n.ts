/**
 * Orca标签页插件国际化支持文件
 * 
 * 此文件提供插件的国际化（i18n）支持，包括：
 * - 多语言文本管理
 * - 动态语言切换
 * - 文本模板和参数替换
 * - 回退机制和错误处理
 * 
 * 支持的语言通过翻译文件定义，确保插件在不同语言环境下都能正确显示。
 * 
 * @file l10n.ts
 * @version 2.4.0
 * @since 2024
 */

// ==================== 类型定义 ====================
/**
 * 翻译数据类型
 * 
 * 定义翻译数据的结构，支持多语言和多键值对。
 * 结构：{ [语言代码]: { [翻译键]: 翻译文本 } }
 * 
 * @example
 * {
 *   "zh-CN": { "hello": "你好", "world": "世界" },
 *   "en-US": { "hello": "Hello", "world": "World" }
 * }
 */
type Translations = { [locale: string]: { [key: string]: string } };

// ==================== 全局状态 ====================
/** 当前语言代码 - 存储当前激活的语言 */
let _locale = "en";

/** 翻译数据存储 - 存储所有语言的翻译数据 */
let _translations: Translations = {};

// ==================== 核心函数 ====================
/**
 * 设置国际化配置
 * 
 * 初始化国际化系统，设置当前语言和加载翻译数据。
 * 这个函数应该在插件初始化时调用，确保后续的文本翻译能正常工作。
 * 
 * @param locale 语言代码 - 要设置的语言（如 'zh-CN', 'en-US'）
 * @param builtinTranslations 内置翻译数据 - 包含所有支持语言的翻译
 * @example
 * setupL10N('zh-CN', {
 *   'zh-CN': { 'hello': '你好' },
 *   'en-US': { 'hello': 'Hello' }
 * });
 */
export function setupL10N(locale: string, builtinTranslations: Translations) {
  _locale = locale;
  _translations = builtinTranslations;
}

/**
 * 翻译文本函数
 * 
 * 这是国际化的核心函数，用于获取指定键的翻译文本。
 * 支持参数替换和动态语言切换。
 * 
 * 功能特性：
 * - 支持多语言文本获取
 * - 支持参数替换（使用 ${参数名} 语法）
 * - 支持动态语言切换
 * - 自动回退到键名（当翻译不存在时）
 * - 空值安全处理
 * 
 * @param key 翻译键 - 要获取的翻译文本的键名
 * @param args 参数对象 - 用于替换文本中的参数（可选）
 * @param locale 语言代码 - 指定语言，不指定则使用当前语言（可选）
 * @returns string 翻译后的文本
 * @example
 * t('hello') // 返回 '你好'（如果当前语言是中文）
 * t('greeting', { name: '张三' }) // 返回 '你好，张三！'（如果模板是 '你好，${name}！'）
 * t('hello', undefined, 'en-US') // 返回 'Hello'（强制使用英文）
 */
export function t(
  key: string,
  args?: { [key: string]: string },
  locale?: string
) {
  // 获取翻译模板 - 优先使用指定语言，否则使用当前语言
  const template = _translations[locale ?? _locale]?.[key] ?? key;

  // 如果没有参数，直接返回模板
  if (args == null) return template;

  // 参数替换 - 将模板中的 ${参数名} 替换为实际值
  return Object.entries(args).reduce(
    (str, [name, val]) => str.replaceAll(`\${${name}}`, val),
    template
  );
}
