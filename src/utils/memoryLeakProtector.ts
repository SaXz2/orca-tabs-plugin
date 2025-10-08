/**
 * 内存泄漏防护工具
 * 
 * 自动跟踪和管理事件监听器、观察者、定时器等资源，
 * 防止内存泄漏和资源无法正确释放。
 */

import { simpleError, simpleVerbose } from './logUtils';

export interface TrackedResource {
  /** 资源ID */
  id: string;
  /** 资源类型 */
  type: 'eventListener' | 'timer' | 'observer' | 'animationFrame' | 'promise' | 'custom';
  /** 资源对象 */
  resource: any;
  /** 创建时间 */
  createdAt: number;
  /** 销毁函数 */
  cleanup: () => void;
  /** 资源描述 */
  description?: string;
  /** 来源栈 */
  stack?: string;
  /** 是否已销毁 */
  destroyed: boolean;
}

export interface MemoryStats {
  totalResources: number;
  resourcesByType: Map<string, number>;
  leakedCount: number;
  memoryUsage: number;
  cleanupCount: number;
  oldestResource?: TrackedResource;
}

export class MemoryLeakProtector {
  private static instance: MemoryLeakProtector;
  private trackedResources: Map<string, TrackedResource> = new Map();
  private cleanupListeners: Set<(stats: MemoryStats) => void> = new Set();
  private autoCleanupInterval: number | null = null;
  private isEnabled = true;
  private resourceIdCounter = 0;
  
  private constructor() {
    this.startAutoCleanup();
    this.setupGlobalCleanup();
  }
  
  /**
   * 获取单例实例
   */
  static getInstance(): MemoryLeakProtector {
    if (!MemoryLeakProtector.instance) {
      MemoryLeakProtector.instance = new MemoryLeakProtector();
    }
    return MemoryLeakProtector.instance;
  }
  
  /**
   * 跟踪事件监听器
   */
  trackEventListener(
    target: EventTarget,
    event: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
    description?: string
  ): string {
    const id = `event_${++this.resourceIdCounter}`;
    
    const cleanup = () => {
      target.removeEventListener(event, listener, options);
    };
    
    const resource: TrackedResource = {
      id,
      type: 'eventListener',
      resource: { target, event, listener, options },
      createdAt: Date.now(),
      cleanup,
      description: description || `EventListener on ${target.constructor.name}.${event}`,
      stack: this.getStackTrace(),
      destroyed: false
    };
    
    this.trackResource(resource);
    return id;
  }
  
  /**
   * 跟踪定时器
   */
  trackTimer(
    timerId: number,
    type: 'timeout' | 'interval' = 'timeout',
    description?: string
  ): string {
    const id = `${type}_${timerId}`;
    
    const cleanup = () => {
      if (type === 'timeout') {
        clearTimeout(timerId);
      } else {
        clearInterval(timerId);
      }
    };
    
    const resource: TrackedResource = {
      id,
      type: 'timer',
      resource: { timerId, type },
      createdAt: Date.now(),
      cleanup,
      description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} timer #${timerId}`,
      stack: this.getStackTrace(),
      destroyed: false
    };
    
    this.trackResource(resource);
    return id;
  }
  
  /**
   * 跟踪观察者
   */
  trackObserver(
    observer: MutationObserver | IntersectionObserver | ResizeObserver,
    type: 'mutation' | 'intersection' | 'resize' = 'mutation',
    description?: string
  ): string {
    const id = `observer_${++this.resourceIdCounter}`;
    
    const cleanup = () => {
      observer.disconnect();
    };
    
    const resource: TrackedResource = {
      id,
      type: 'observer',
      resource: observer,
      createdAt: Date.now(),
      cleanup,
      description: description || `${type.charAt(0).toUpperCase() + type.slice(1)}Observer`,
      stack: this.getStackTrace(),
      destroyed: false
    };
    
    this.trackResource(resource);
    return id;
  }
  
  /**
   * 跟踪动画帧
   */
  trackAnimationFrame(
    frameId: number,
    description?: string
  ): string {
    const id = `raf_${frameId}`;
    
    const cleanup = () => {
      cancelAnimationFrame(frameId);
    };
    
    const resource: TrackedResource = {
      id,
      type: 'animationFrame',
      resource: { frameId },
      createdAt: Date.now(),
      cleanup,
      description: description || `AnimationFrame #${frameId}`,
      stack: this.getStackTrace(),
      destroyed: false
    };
    
    this.trackResource(resource);
    return id;
  }
  
  /**
   * 跟踪Promise
   */
  trackPromise<T>(
    promise: Promise<T>,
    description?: string
  ): string {
    const id = `promise_${++this.resourceIdCounter}`;
    
    const cleanup = () => {
      // Promise无法被外部取消，只能忽略结果
      promise.catch(() => {});
    };
    
    const resource: TrackedResource = {
      id,
      type: 'promise',
      resource: promise,
      createdAt: Date.now(),
      cleanup,
      description: description || `Promise #${id}`,
      stack: this.getStackTrace(),
      destroyed: false
    };
    
    this.trackResource(resource);
    
    // Promise完成时自动清理
    Promise.allSettled([promise]).finally(() => {
      this.cleanupResource(id);
    });
    
    return id;
  }
  
  /**
   * 跟踪自定义资源
   */
  trackCustomResource(
    resource: any,
    cleanup: () => void,
    description?: string
  ): string {
    const id = `custom_${++this.resourceIdCounter}`;
    
    const trackedResource: TrackedResource = {
      id,
      type: 'custom',
      resource,
      createdAt: Date.now(),
      cleanup,
      description: description || `Custom resource #${id}`,
      stack: this.getStackTrace(),
      destroyed: false
    };
    
    this.trackResource(trackedResource);
    return id;
  }
  
  /**
   * 跟踪批量的清理操作
   */
  trackBatchCleanup(
    items: Array<() => void>,
    description?: string
  ): string {
    return this.trackCustomResource(
      null,
      () => {
        items.forEach(cleanup => {
          try {
            cleanup();
          } catch (error) {
            simpleError('Batch cleanup error:', error);
          }
        });
      },
      description || `Batch cleanup (${items.length} items)`
    );
  }
  
  /**
   * 获取资源状态
   */
  getResource(id: string): TrackedResource | null {
    return this.trackedResources.get(id) || null;
  }
  
  /**
   * 检查资源是否存在
   */
  hasResource(id: string): boolean {
    return this.trackedResources.has(id);
  }
  
  /**
   * 清理单个资源
   */
  cleanupResource(id: string): boolean {
    const resource = this.trackedResources.get(id);
    if (!resource || resource.destroyed) {
      return false;
    }
    
    try {
      resource.cleanup();
      resource.destroyed = true;
      this.notifyCleanupListeners(this.getMemoryStats());
      return true;
    } catch (error) {
      simpleError(`Cleanup failed for resource ${id}:`, error);
      return false;
    } finally {
      this.trackedResources.delete(id);
    }
  }
  
  /**
   * 清理指定类型的所有资源
   */
  cleanupResourcesByType(type: string): number {
    let cleanedCount = 0;
    
    this.trackedResources.forEach((resource, id) => {
      if (resource.type === type && !resource.destroyed) {
        if (this.cleanupResource(id)) {
          cleanedCount++;
        }
      }
    });
    
    return cleanedCount;
  }
  
  /**
   * 清理所有资源
   */
  cleanupAllResources(): MemoryStats {
    const stats = this.getMemoryStats();
    const resourcesToCleanup = Array.from(this.trackedResources.values());
    
    resourcesToCleanup.forEach(resource => {
      if (!resource.destroyed) {
        try {
          resource.cleanup();
          resource.destroyed = true;
        } catch (error) {
          simpleError(`Cleanup failed for resource ${resource.id}:`, error);
        }
      }
    });
    
    this.trackedResources.clear();
    
    return {
      ...stats,
      cleanupCount: stats.totalResources
    };
  }
  
  /**
   * 获取内存统计
   */
  getMemoryStats(): MemoryStats {
    const resourcesByType = new Map<string, number>();
    let oldestResource: TrackedResource | undefined;
    let leakedCount = 0;
    
    this.trackedResources.forEach(resource => {
      if (resource.destroyed) {
        leakedCount++;
      } else {
        const count = resourcesByType.get(resource.type) || 0;
        resourcesByType.set(resource.type, count + 1);
        
        if (!oldestResource || resource.createdAt < oldestResource.createdAt) {
          oldestResource = resource;
        }
      }
    });
    
    return {
      totalResources: this.trackedResources.size,
      resourcesByType,
      leakedCount,
      memoryUsage: this.getMemoryUsage(),
      cleanupCount: this.getCleanupCount(),
      oldestResource
    };
  }
  
  /**
   * 检查潜在的内存泄漏
   */
  detectMemoryLeaks(): Array<{ type: string; count: number; description: string }> {
    const stats = this.getMemoryStats();
    const leaks: Array<{ type: string; count: number; description: string }> = [];
    
    // 检查每个类型的资源数量
    stats.resourcesByType.forEach((count, type) => {
      const thresholds: Record<string, number> = {
        eventListener: 50,
        timer: 20,
        observer: 10,
        animationFrame: 50,
        promise: 30,
        custom: 100
      };
      
      const threshold = thresholds[type] || 10;
      if (count > threshold) {
        leaks.push({
          type,
          count,
          description: `Too many ${type}s detected: ${count} (threshold: ${threshold})`
        });
      }
    });
    
    // 检查长时间未清理的资源
    const now = Date.now();
    const maxAge = 300000; // 5分钟
    
                        this.trackedResources.forEach((resource, id) => {
                          if (!resource.destroyed && (now - resource.createdAt) > maxAge) {
                            leaks.push({
                              type: 'timeout',
                              count: 1,
                              description: `Long-running resource: ${resource.description || id} (age: ${Math.round((now - resource.createdAt) / 1000)}s)`
                            });
                          }
                        });
    
    return leaks;
  }
  
  /**
   * 添加清理监听器
   */
  addCleanupListener(listener: (stats: MemoryStats) => void): () => void {
    this.cleanupListeners.add(listener);
    return () => {
      this.cleanupListeners.delete(listener);
    };
  }
  
  /**
   * 启用/禁用自动清理
   */
  setAutoCleanup(enabled: boolean, interval: number = 30000): void {
    if (this.autoCleanupInterval) {
      clearInterval(this.autoCleanupInterval);
      this.autoCleanupInterval = null;
    }
    
    if (enabled) {
      this.autoCleanupInterval = window.setInterval(() => {
        this.performAutoCleanup();
      }, interval);
    }
  }
  
  /**
   * 生成资源报告
   */
  generateReport(): string {
    const stats = this.getMemoryStats();
    const leaks = this.detectMemoryLeaks();
    
    let report = `
=== Memory Leak Protection Report ===
Total Resources: ${stats.totalResources}
Memory Usage: ${Math.round(stats.memoryUsage / 1024 / 1024 * 100) / 100} MB
Cleanup Count: ${stats.cleanupCount}

Resources by Type:`;
    
    stats.resourcesByType.forEach((count, type) => {
      report += `\n- ${type}: ${count}`;
    });
    
    if (leaks.length > 0) {
      report += '\n\nPotential Leaks:';
      leaks.forEach(leak => {
        report += `\n- ${leak.description}`;
      });
    }
    
    if (stats.oldestResource) {
      report += `\n\nOldest Resource: ${stats.oldestResource.description}`;
      report += `\nAge: ${Math.round((Date.now() - stats.oldestResource.createdAt) / 1000)}s`;
    }
    
    return report;
  }
  
  /**
   * 销毁保护器
   */
  destroy(): void {
    this.cleanupAllResources();
    
    if (this.autoCleanupInterval) {
      clearInterval(this.autoCleanupInterval);
      this.autoCleanupInterval = null;
    }
    
    this.cleanupListeners.clear();
    this.isEnabled = false;
    MemoryLeakProtector.instance = null as any;
  }
  
  private trackResource(resource: TrackedResource): void {
    if (!this.isEnabled) {
      return;
    }
    
    this.trackedResources.set(resource.id, resource);
    
    // 检查是否需要立即清理
    const leaks = this.detectMemoryLeaks();
    if (leaks.length > 0) {
      this.log('⚠️ Potential memory leaks detected:', leaks);
    }
  }
  
  private notifyCleanupListeners(stats: MemoryStats): void {
    this.cleanupListeners.forEach(listener => {
      try {
        listener(stats);
      } catch (error) {
        simpleError('Cleanup listener error:', error);
      }
    });
  }
  
  private performAutoCleanup(): void {
    const leaks = this.detectMemoryLeaks();
    if (leaks.length > 0) {
      this.log('🧹 Performing auto-cleanup due to potential leaks');
      
      // 清理最老的资源
      leaks.forEach(leak => {
        if (leak.type === 'timeout') {
          // 清理长时间未清理的资源
          const now = Date.now();
                          this.trackedResources.forEach((resource, id) => {
                            if (!resource.destroyed && (now - resource.createdAt) > 300000) {
                              this.cleanupResource(id);
                            }
                          });
        } else if (leak.count > 100) {
          // 清理过多的资源
          this.cleanupResourcesByType(leak.type);
        }
      });
    }
  }
  
  private startAutoCleanup(): void {
    this.setAutoCleanup(true, 30000); // 每30秒检查一次
  }
  
  private setupGlobalCleanup(): void {
    // 页面卸载时自动清理
    window.addEventListener('beforeunload', () => {
      this.cleanupAllResources();
    });
    
    // 定期报告内存使用情况
    setInterval(() => {
      const leaks = this.detectMemoryLeaks();
      if (leaks.length > 0) {
        this.log('📊 Memory leak report:', this.generateReport());
      }
    }, 60000); // 每分钟检查
  }
  
  private getStackTrace(): string {
    try {
      throw new Error('');
    } catch (error) {
      return (error as Error).stack || '';
    }
  }
  
  private getMemoryUsage(): number {
    return (performance as any)?.memory?.usedJSHeapSize || 0;
  }
  
  private getCleanupCount(): number {
    return Array.from(this.trackedResources.values()).filter(r => r.destroyed).length;
  }
  
  private log(message: string, ...args: any[]): void {
    simpleVerbose(`[MemoryLeakProtector] ${message}`, ...args);
  }
}
