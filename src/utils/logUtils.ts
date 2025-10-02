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