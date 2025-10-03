/**
 * 简化的日志工具
 */

/**
 * 日志级别
 */
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  VERBOSE = 4
}

/**
 * 默认日志级别
 * 生产环境使用INFO级别，开发环境可以通过DEBUG_MODE设置提升到VERBOSE
 */
export const DEFAULT_LOG_LEVEL = LogLevel.INFO;

/**
 * 简单的日志实现
 */
export function simpleLog(message: string, ...args: any[]): void {
  console.info('[OrcaPlugin]', message, ...args);
}

/**
 * 简单的错误日志实现
 */
export function simpleError(message: string, ...args: any[]): void {
  console.error('[OrcaPlugin]', message, ...args);
}

/**
 * 简单的警告日志实现
 */
export function simpleWarn(message: string, ...args: any[]): void {
  console.warn('[OrcaPlugin]', message, ...args);
}