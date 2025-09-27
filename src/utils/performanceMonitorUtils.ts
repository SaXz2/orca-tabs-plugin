/**
 * 性能监控工具
 * 
 * 提供全面的性能监控功能，包括渲染时间、内存使用、缓存统计等
 * 帮助开发者识别性能瓶颈和优化机会
 */

/**
 * 性能指标接口
 */
interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  eventCount: number;
  domOperations: number;
  timestamp: number;
}

/**
 * 性能报告接口
 */
interface PerformanceReport {
  averageRenderTime: number;
  averageMemoryUsage: number;
  averageCacheHitRate: number;
  totalEvents: number;
  totalDOMOperations: number;
  performanceScore: number;
  recommendations: string[];
}

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetricsCount = 100;
  private isEnabled = true;
  private monitoringInterval: number | null = null;
  private renderStartTime = 0;
  private domOperationCount = 0;
  private eventCount = 0;
  
  constructor() {
    this.startMonitoring();
  }
  
  /**
   * 开始性能监控
   */
  startMonitoring(): void {
    if (!this.isEnabled) return;
    
    // 监控内存使用
    this.monitorMemoryUsage();
    
    // 监控渲染性能
    this.monitorRenderPerformance();
    
    // 监控事件处理性能
    this.monitorEventPerformance();
    
    // 定期清理旧数据
    this.startCleanupTimer();
  }
  
  /**
   * 停止性能监控
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
  
  /**
   * 开始渲染计时
   */
  startRenderTimer(): void {
    this.renderStartTime = performance.now();
  }
  
  /**
   * 结束渲染计时
   */
  endRenderTimer(): number {
    if (this.renderStartTime === 0) return 0;
    
    const renderTime = performance.now() - this.renderStartTime;
    this.renderStartTime = 0;
    
    this.recordMetric('renderTime', renderTime);
    return renderTime;
  }
  
  /**
   * 记录DOM操作
   */
  recordDOMOperation(): void {
    this.domOperationCount++;
  }
  
  /**
   * 记录事件处理
   */
  recordEvent(): void {
    this.eventCount++;
  }
  
  /**
   * 记录性能指标
   */
  recordMetric(type: keyof PerformanceMetrics, value: number): void {
    if (!this.isEnabled) return;
    
    const now = Date.now();
    const latestMetric = this.metrics[this.metrics.length - 1];
    
    if (latestMetric && now - latestMetric.timestamp < 1000) {
      // 更新最新指标
      latestMetric[type] = value;
    } else {
      // 创建新指标
      const newMetric: PerformanceMetrics = {
        renderTime: 0,
        memoryUsage: 0,
        cacheHitRate: 0,
        eventCount: 0,
        domOperations: 0,
        timestamp: now
      };
      
      newMetric[type] = value;
      this.metrics.push(newMetric);
      
      // 限制指标数量
      if (this.metrics.length > this.maxMetricsCount) {
        this.metrics.shift();
      }
    }
  }
  
  /**
   * 监控内存使用
   */
  private monitorMemoryUsage(): void {
    setInterval(() => {
      // 检查浏览器是否支持内存API
      if ('memory' in performance && (performance as any).memory) {
        const memoryInfo = (performance as any).memory;
        const memoryData = {
          used: memoryInfo.usedJSHeapSize,
          total: memoryInfo.totalJSHeapSize,
          limit: memoryInfo.jsHeapSizeLimit
        };
        
        this.recordMetric('memoryUsage', memoryData.used);
        
        // 内存使用过高时警告
        if (memoryData.used / memoryData.limit > 0.8) {
          console.warn('🚨 内存使用过高:', {
            used: `${(memoryData.used / 1024 / 1024).toFixed(2)}MB`,
            total: `${(memoryData.total / 1024 / 1024).toFixed(2)}MB`,
            limit: `${(memoryData.limit / 1024 / 1024).toFixed(2)}MB`,
            usage: `${((memoryData.used / memoryData.limit) * 100).toFixed(1)}%`
          });
        }
      }
    }, 5000);
  }
  
  /**
   * 监控渲染性能
   */
  private monitorRenderPerformance(): void {
    // 使用 Performance Observer 监控渲染性能
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'measure') {
              const duration = entry.duration;
              if (duration > 16) { // 超过一帧时间
                console.warn('🐌 渲染性能警告:', {
                  name: entry.name,
                  duration: `${duration.toFixed(2)}ms`,
                  threshold: '16ms (1 frame)'
                });
              }
            }
          }
        });
        
        observer.observe({ entryTypes: ['measure'] });
      } catch (error) {
        console.warn('性能监控初始化失败:', error);
      }
    }
  }
  
  /**
   * 监控事件处理性能
   */
  private monitorEventPerformance(): void {
    // 监控事件处理延迟
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const self = this;
    
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (listener && typeof listener === 'function') {
        const wrappedListener = function(this: any, event: Event) {
          const startTime = performance.now();
          const result = listener.call(this, event);
          const endTime = performance.now();
          
          if (endTime - startTime > 5) { // 超过5ms
            console.warn('🐌 事件处理延迟:', {
              type,
              duration: `${(endTime - startTime).toFixed(2)}ms`,
              target: (this as any).tagName || 'Unknown'
            });
          }
          
          return result;
        };
        
        return originalAddEventListener.call(this, type, wrappedListener, options);
      }
      
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
  
  /**
   * 启动清理定时器
   */
  private startCleanupTimer(): void {
    this.monitoringInterval = window.setInterval(() => {
      // 清理过期的指标数据
      const now = Date.now();
      this.metrics = this.metrics.filter(metric => 
        now - metric.timestamp < 5 * 60 * 1000 // 保留5分钟内的数据
      );
      
      // 重置计数器
      this.domOperationCount = 0;
      this.eventCount = 0;
    }, 30000); // 每30秒清理一次
  }
  
  /**
   * 获取性能报告
   */
  getPerformanceReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        averageRenderTime: 0,
        averageMemoryUsage: 0,
        averageCacheHitRate: 0,
        totalEvents: 0,
        totalDOMOperations: 0,
        performanceScore: 0,
        recommendations: ['暂无性能数据']
      };
    }
    
    const recentMetrics = this.metrics.slice(-10); // 最近10个指标
    
    const averageRenderTime = this.calculateAverage(recentMetrics, 'renderTime');
    const averageMemoryUsage = this.calculateAverage(recentMetrics, 'memoryUsage');
    const averageCacheHitRate = this.calculateAverage(recentMetrics, 'cacheHitRate');
    const totalEvents = this.eventCount;
    const totalDOMOperations = this.domOperationCount;
    
    const performanceScore = this.calculatePerformanceScore({
      averageRenderTime,
      averageMemoryUsage,
      averageCacheHitRate,
      totalEvents,
      totalDOMOperations
    });
    
    const recommendations = this.generateRecommendations({
      averageRenderTime,
      averageMemoryUsage,
      averageCacheHitRate,
      totalEvents,
      totalDOMOperations
    });
    
    return {
      averageRenderTime,
      averageMemoryUsage,
      averageCacheHitRate,
      totalEvents,
      totalDOMOperations,
      performanceScore,
      recommendations
    };
  }
  
  /**
   * 计算平均值
   */
  private calculateAverage(metrics: PerformanceMetrics[], key: keyof PerformanceMetrics): number {
    const values = metrics.map(m => m[key] as number).filter(v => v > 0);
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  }
  
  /**
   * 计算性能分数
   */
  private calculatePerformanceScore(data: {
    averageRenderTime: number;
    averageMemoryUsage: number;
    averageCacheHitRate: number;
    totalEvents: number;
    totalDOMOperations: number;
  }): number {
    let score = 100;
    
    // 渲染时间评分 (0-40分)
    if (data.averageRenderTime > 50) score -= 40;
    else if (data.averageRenderTime > 30) score -= 30;
    else if (data.averageRenderTime > 16) score -= 20;
    else if (data.averageRenderTime > 10) score -= 10;
    
    // 内存使用评分 (0-30分)
    if (data.averageMemoryUsage > 100 * 1024 * 1024) score -= 30; // 100MB
    else if (data.averageMemoryUsage > 50 * 1024 * 1024) score -= 20; // 50MB
    else if (data.averageMemoryUsage > 20 * 1024 * 1024) score -= 10; // 20MB
    
    // 缓存命中率评分 (0-20分)
    if (data.averageCacheHitRate < 0.5) score -= 20;
    else if (data.averageCacheHitRate < 0.7) score -= 15;
    else if (data.averageCacheHitRate < 0.8) score -= 10;
    else if (data.averageCacheHitRate < 0.9) score -= 5;
    
    // DOM操作评分 (0-10分)
    if (data.totalDOMOperations > 100) score -= 10;
    else if (data.totalDOMOperations > 50) score -= 5;
    
    return Math.max(0, Math.min(100, score));
  }
  
  /**
   * 生成优化建议
   */
  private generateRecommendations(data: {
    averageRenderTime: number;
    averageMemoryUsage: number;
    averageCacheHitRate: number;
    totalEvents: number;
    totalDOMOperations: number;
  }): string[] {
    const recommendations: string[] = [];
    
    if (data.averageRenderTime > 30) {
      recommendations.push('🚀 渲染时间过长，建议使用增量DOM更新');
    }
    
    if (data.averageMemoryUsage > 50 * 1024 * 1024) {
      recommendations.push('💾 内存使用较高，建议优化缓存策略');
    }
    
    if (data.averageCacheHitRate < 0.7) {
      recommendations.push('📈 缓存命中率较低，建议优化缓存算法');
    }
    
    if (data.totalDOMOperations > 50) {
      recommendations.push('🔧 DOM操作频繁，建议使用事件委托');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ 性能表现良好，无需特别优化');
    }
    
    return recommendations;
  }
  
  /**
   * 获取实时性能指标
   */
  getRealTimeMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;
    
    return this.metrics[this.metrics.length - 1];
  }
  
  /**
   * 导出性能数据
   */
  exportPerformanceData(): string {
    return JSON.stringify({
      metrics: this.metrics,
      report: this.getPerformanceReport(),
      timestamp: Date.now()
    }, null, 2);
  }
  
  /**
   * 重置性能数据
   */
  reset(): void {
    this.metrics = [];
    this.domOperationCount = 0;
    this.eventCount = 0;
    this.renderStartTime = 0;
  }
  
  /**
   * 启用/禁用监控
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    
    if (enabled) {
      this.startMonitoring();
    } else {
      this.stopMonitoring();
    }
  }
  
  /**
   * 销毁监控器
   */
  destroy(): void {
    this.stopMonitoring();
    this.reset();
  }
}

/**
 * 全局性能监控器实例
 */
export const globalPerformanceMonitor = new PerformanceMonitor();
