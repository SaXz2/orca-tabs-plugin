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
 * 生产环境使用WARN级别，只显示警告和错误，开发环境可以通过DEBUG_MODE设置提升到VERBOSE
 */
export const DEFAULT_LOG_LEVEL = LogLevel.WARN;

/**
 * 全局日志配置
 * 用于控制日志输出行为
 */
export class LogConfig {
  private static currentLogLevel: LogLevel = DEFAULT_LOG_LEVEL;
  
  /**
   * 设置当前日志级别
   */
  static setLogLevel(level: LogLevel): void {
    LogConfig.currentLogLevel = level;
  }
  
  /**
   * 获取当前日志级别
   */
  static getLogLevel(): LogLevel {
    return LogConfig.currentLogLevel;
  }
  
  /**
   * 检查是否应该输出指定级别的日志
   */
  static shouldLog(level: LogLevel): boolean {
    return LogConfig.currentLogLevel >= level;
  }
}

/**
 * 简单的日志实现
 * 仅在日志级别允许时输出
 */
export function simpleLog(message: string, ...args: any[]): void {
  if (LogConfig.shouldLog(LogLevel.INFO)) {
    console.info('[OrcaPlugin]', message, ...args);
  }
}

/**
 * 简单的错误日志实现
 * 仅在日志级别允许时输出
 */
export function simpleError(message: string, ...args: any[]): void {
  if (LogConfig.shouldLog(LogLevel.ERROR)) {
    console.error('[OrcaPlugin]', message, ...args);
  }
}

/**
 * 简单的警告日志实现
 * 仅在日志级别允许时输出
 */
export function simpleWarn(message: string, ...args: any[]): void {
  if (LogConfig.shouldLog(LogLevel.WARN)) {
    console.warn('[OrcaPlugin]', message, ...args);
  }
}

/**
 * 调试日志实现
 * 仅在DEBUG或更高级别时输出
 */
export function simpleDebug(message: string, ...args: any[]): void {
  if (LogConfig.shouldLog(LogLevel.DEBUG)) {
    console.debug('[OrcaPlugin]', message, ...args);
  }
}

/**
 * 详细日志实现
 * 仅在VERBOSE级别时输出
 */
export function simpleVerbose(message: string, ...args: any[]): void {
  if (LogConfig.shouldLog(LogLevel.VERBOSE)) {
    console.log('[OrcaPlugin]', message, ...args);
  }
}