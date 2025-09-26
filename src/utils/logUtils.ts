/**
 * 日志和调试相关的工具函数
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
 * 日志配置
 */
export interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStorageEntries: number;
  enableTimestamps: boolean;
  enableColors: boolean;
  prefix: string;
}

/**
 * 默认日志配置
 */
export const DEFAULT_LOG_CONFIG: LogConfig = {
  level: LogLevel.INFO,
  enableConsole: true,
  enableStorage: false,
  maxStorageEntries: 1000,
  enableTimestamps: true,
  enableColors: true,
  prefix: '[OrcaTabs]'
};

/**
 * 日志条目接口
 */
export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
}

/**
 * 日志管理器类
 */
export class LogManager {
  private config: LogConfig;
  private storage: LogEntry[] = [];
  private colors: Record<LogLevel, string> = {
    [LogLevel.ERROR]: '#ff4444',
    [LogLevel.WARN]: '#ffaa00',
    [LogLevel.INFO]: '#00aaff',
    [LogLevel.DEBUG]: '#00ff88',
    [LogLevel.VERBOSE]: '#888888'
  };

  constructor(config: Partial<LogConfig> = {}) {
    this.config = { ...DEFAULT_LOG_CONFIG, ...config };
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * 记录日志
   */
  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    if (level > this.config.level) return;

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      message,
      data,
      source
    };

    // 控制台输出
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // 存储日志
    if (this.config.enableStorage) {
      this.logToStorage(entry);
    }
  }

  /**
   * 输出到控制台
   */
  private logToConsole(entry: LogEntry): void {
    const { timestamp, level, message, data, source } = entry;
    const levelName = LogLevel[level];
    const timeStr = this.config.enableTimestamps 
      ? new Date(timestamp).toLocaleTimeString() 
      : '';
    
    const prefix = `${this.config.prefix}${timeStr ? ` [${timeStr}]` : ''}`;
    const sourceStr = source ? ` [${source}]` : '';
    const fullMessage = `${prefix}${sourceStr} ${message}`;

    // 日志输出已禁用
    if (this.config.enableColors && typeof window !== 'undefined') {
      // 彩色日志输出已禁用
    } else {
      // 控制台日志输出已禁用
    }
  }

  /**
   * 获取控制台方法
   */
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    // 控制台方法已禁用
    return () => {};
  }

  /**
   * 存储日志
   */
  private logToStorage(entry: LogEntry): void {
    this.storage.push(entry);
    
    // 限制存储条目数量
    if (this.storage.length > this.config.maxStorageEntries) {
      this.storage = this.storage.slice(-this.config.maxStorageEntries);
    }
  }

  /**
   * 错误日志
   */
  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source);
  }

  /**
   * 警告日志
   */
  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source);
  }

  /**
   * 信息日志
   */
  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source);
  }

  /**
   * 调试日志
   */
  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  /**
   * 详细日志
   */
  verbose(message: string, data?: any, source?: string): void {
    this.log(LogLevel.VERBOSE, message, data, source);
  }

  /**
   * 获取存储的日志
   */
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let logs = this.storage;
    
    if (level !== undefined) {
      logs = logs.filter(log => log.level === level);
    }
    
    if (limit !== undefined) {
      logs = logs.slice(-limit);
    }
    
    return logs;
  }

  /**
   * 清空存储的日志
   */
  clearLogs(): void {
    this.storage = [];
  }

  /**
   * 导出日志
   */
  exportLogs(format: 'json' | 'text' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.storage, null, 2);
    } else {
      return this.storage
        .map(entry => {
          const time = new Date(entry.timestamp).toLocaleString();
          const level = LogLevel[entry.level];
          const source = entry.source ? ` [${entry.source}]` : '';
          const data = entry.data ? ` ${JSON.stringify(entry.data)}` : '';
          return `[${time}] ${level}${source}: ${entry.message}${data}`;
        })
        .join('\n');
    }
  }

  /**
   * 性能计时器
   */
  time(label: string): void {
    // 性能计时已禁用
  }

  /**
   * 结束性能计时
   */
  timeEnd(label: string): void {
    // 性能计时结束已禁用
  }

  /**
   * 性能标记
   */
  mark(label: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${this.config.prefix}-${label}`);
    }
  }

  /**
   * 性能测量
   */
  measure(name: string, startMark: string, endMark?: string): void {
    if (typeof performance !== 'undefined' && performance.measure) {
      const startLabel = `${this.config.prefix}-${startMark}`;
      const endLabel = endMark ? `${this.config.prefix}-${endMark}` : undefined;
      performance.measure(`${this.config.prefix}-${name}`, startLabel, endLabel);
    }
  }

  /**
   * 创建子日志器
   */
  createChild(source: string): LogManager {
    const child = new LogManager(this.config);
    child.config.prefix = `${this.config.prefix}[${source}]`;
    return child;
  }
}

/**
 * 全局日志管理器实例
 */
export const logger = new LogManager();

/**
 * 创建性能监控器
 */
export function createPerformanceMonitor(name: string): {
  start: () => void;
  end: () => number;
  mark: (label: string) => void;
  measure: (measureName: string, startLabel: string, endLabel?: string) => void;
} {
  const startTime = performance.now();
  
  return {
    start: () => {
      logger.mark(`${name}-start`);
    },
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.measure(`${name}-duration`, `${name}-start`);
      logger.debug(`${name} completed in ${duration.toFixed(2)}ms`);
      return duration;
    },
    mark: (label: string) => {
      logger.mark(`${name}-${label}`);
    },
    measure: (measureName: string, startLabel: string, endLabel?: string) => {
      logger.measure(`${name}-${measureName}`, `${name}-${startLabel}`, endLabel ? `${name}-${endLabel}` : undefined);
    }
  };
}

/**
 * 创建调试工具
 */
export function createDebugTools(): {
  inspect: (obj: any, name?: string) => void;
  trace: (message: string) => void;
  assert: (condition: any, message: string) => void;
  count: (label: string) => void;
  group: (label: string) => void;
  groupEnd: () => void;
} {
  return {
    inspect: (obj: any, name?: string) => {
      const label = name || 'Object';
      logger.debug(`Inspecting ${label}:`, obj);
      // 控制台表格输出已禁用
    },
    trace: (message: string) => {
      logger.debug(`Trace: ${message}`);
      // 控制台跟踪输出已禁用
    },
    assert: (condition: any, message: string) => {
      if (!condition) {
        logger.error(`Assertion failed: ${message}`);
        // 控制台断言输出已禁用
      }
    },
    count: (label: string) => {
      logger.debug(`Count ${label}`);
      // 控制台计数输出已禁用
    },
    group: (label: string) => {
      logger.debug(`Group: ${label}`);
      // 控制台分组输出已禁用
    },
    groupEnd: () => {
      // 控制台分组结束输出已禁用
    }
  };
}

/**
 * 创建错误处理器
 */
export function createErrorHandler(source: string): {
  handle: (error: Error, context?: string) => void;
  wrap: <T extends (...args: any[]) => any>(fn: T, context?: string) => T;
} {
  return {
    handle: (error: Error, context?: string) => {
      const message = context ? `${context}: ${error.message}` : error.message;
      logger.error(message, {
        error: error.stack,
        source,
        context
      });
    },
    wrap: <T extends (...args: any[]) => any>(fn: T, context?: string): T => {
      return ((...args: any[]) => {
        try {
          return fn(...args);
        } catch (error) {
          if (error instanceof Error) {
            logger.error(`Error in ${context || fn.name}: ${error.message}`, {
              error: error.stack,
              source,
              args
            });
          }
          throw error;
        }
      }) as T;
    }
  };
}

/**
 * 创建内存监控器
 */
export function createMemoryMonitor(): {
  check: () => void;
  getUsage: () => any;
  isLowMemory: () => boolean;
} {
  return {
    check: () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        logger.debug('Memory usage:', {
          used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
          limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
        });
      }
    },
    getUsage: () => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    },
    isLowMemory: () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        return usage > 0.8; // 使用超过80%认为内存不足
      }
      return false;
    }
  };
}

/**
 * 创建网络监控器
 */
export function createNetworkMonitor(): {
  checkConnection: () => any;
  isOnline: () => boolean;
  getConnectionType: () => string;
} {
  return {
    checkConnection: () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        logger.debug('Network connection:', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
        return connection;
      }
      return null;
    },
    isOnline: () => navigator.onLine,
    getConnectionType: () => {
      if ('connection' in navigator) {
        return (navigator as any).connection.effectiveType || 'unknown';
      }
      return 'unknown';
    }
  };
}
