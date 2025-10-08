/**
 * 性能监控优化工具
 * 
 * 提供完整的性能指标收集、分析和优化建议，
 * 帮助识别性能瓶颈并自动优化。
 */

import { simpleError } from './logUtils';

export interface PerformanceMetric {
  /** 指标名 */
  name: string;
  /** 指标值 */
  value: number;
  /** 单位 */
  unit: string;
  /** 时间戳 */
  timestamp: number;
  /** 指标类型 */
  type: 'duration' | 'count' | 'size' | 'rate' | 'custom';
  /** 是否正常 */
  healthy: boolean;
}

export interface PerformanceThreshold {
  /** 指标名 */
  name: string;
  /** 警告阈值 */
  warning: number;
  /** 错误阈值 */
  error: number;
  /** 最佳实践值 */
  recommended: number;
}

export interface PerformanceReport {
  /** 报告ID */
  id: string;
  /** 生成时间 */
  timestamp: number;
  /** 总体健康分数 0-100 */
  healthScore: number;
  /** 关键问题 */
  issues: Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    metric: string;
    impact: 'low' | 'medium' | 'high' | 'critical';
    recommendation: string;
  }>;
  /** 当前指标 */
  metrics: PerformanceMetric[];
  /** 趋势分析 */
  trends: Array<{
    metric: string;
    trend: 'improving' | 'stable' | 'degrading';
    changePercent: number;
  }>;
  /** 优化建议 */
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    description: string;
    estimatedImpact: string;
    implementation: string;
  }>;
}

export interface MonitoringConfig {
  /** 采样间隔（毫秒） */
  samplingInterval: number;
  /** 报告生成间隔（毫秒） */
  reportInterval: number;
  /** 历史保留时长（毫秒） */
  historyRetention: number;
  /** 是否启用自动优化 */
  enableAutoOptimization: boolean;
  /** 是否启用趋势分析 */
  enableTrendAnalysis: boolean;
  /** 性能指标阈值 */
  thresholds: PerformanceThreshold[];
}

export class PerformanceMonitorOptimizer {
  private static instance: PerformanceMonitorOptimizer;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private config: MonitoringConfig;
  private isMonitoring = false;
  private intervalId: number | null = null;
  private observers: Map<string, PerformanceObserver> = new Map();
  private reportCallbacks: Set<(report: PerformanceReport) => void> = new Set();
  private performanceEntries: PerformanceEntry[] = [];
  
  private constructor() {
    this.config = {
      samplingInterval: 5000,
      reportInterval: 30000,
      historyRetention: 300000, // 5分钟
      enableAutoOptimization: true,
      enableTrendAnalysis: true,
      thresholds: this.getDefaultThresholds()
    };
    
    this.setupDefaultThresholds();
    this.setupObservers();
  }
  
  /**
   * 获取单例实例
   */
  static getInstance(): PerformanceMonitorOptimizer {
    if (!PerformanceMonitorOptimizer.instance) {
      PerformanceMonitorOptimizer.instance = new PerformanceMonitorOptimizer();
    }
    return PerformanceMonitorOptimizer.instance;
  }
  
  /**
   * 开始监控
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.intervalId = window.setInterval(() => {
      this.collectMetrics();
    }, this.config.samplingInterval);
    
    // 定期生成报告
    window.setInterval(() => {
      this.generateReport();
    }, this.config.reportInterval);
  }
  
  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isMonitoring = false;
  }
  
  /**
   * 记录指标
   */
  recordMetric(
    name: string,
    value: number,
    unit: string = '',
    type: PerformanceMetric['type'] = 'custom'
  ): void {
    const threshold = this.thresholds.get(name);
    const healthy = threshold ? value <= threshold.error : true;
    
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      type,
      healthy
    };
    
    this.addMetric(metric);
  }
  
  /**
   * 开始性能测量
   */
  startMeasurement(name: string): () => number {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration, 'ms', 'duration');
      return duration;
    };
  }
  
  /**
   * 记录内存使用情况
   */
  recordMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory_heap', memory.usedJSHeapSize, 'bytes');
      this.recordMetric('memory_heap_total', memory.totalJSHeapSize, 'bytes');
      this.recordMetric('memory_heap_limit', memory.jsHeapSizeLimit, 'bytes');
    }
  }
  
  /**
   * 记录DOM操作性能
   */
  recordDOMOperation(type: string, duration: number): void {
    this.recordMetric(`dom_${type}`, duration, 'ms', 'duration');
  }
  
  /**
   * 记录渲染性能
   */
  recordRenderPerformance(): void {
    if ('getEntriesByType' in performance) {
      const renderEntries = performance.getEntriesByType('measure');
      renderEntries.forEach((entry: PerformanceEntry) => {
        this.recordMetric(`render_${entry.name}`, entry.duration, 'ms', 'duration');
      });
    }
  }
  
  /**
   * 获取指标历史
   */
  getMetricHistory(name: string, timeRange?: number): PerformanceMetric[] {
    const metrics = this.metrics.get(name) || [];
    
    if (timeRange) {
      const cutoff = Date.now() - timeRange;
      return metrics.filter(m => m.timestamp >= cutoff);
    }
    
    return metrics;
  }
  
  /**
   * 获取最新指标值
   */
  getLatestMetric(name: string): PerformanceMetric | null {
    const metrics = this.metrics.get(name);
    return metrics && metrics.length > 0 ? metrics[metrics.length - 1] : null;
  }
  
  /**
   * 生成性能报告
   */
  generateReport(): PerformanceReport {
    const reportId = `report_${Date.now()}`;
    const healthScore = this.calculateHealthScore();
    const issues = this.analyzeIssues();
    const trends = this.analyzeTrends();
    const recommendations = this.generateRecommendations();
    
    const report: PerformanceReport = {
      id: reportId,
      timestamp: Date.now(),
      healthScore,
      issues,
      metrics: this.getAllCurrentMetrics(),
      trends,
      recommendations
    };
    
    // 通知回调
    this.reportCallbacks.forEach(callback => {
      try {
        callback(report);
      } catch (error) {
        simpleError('Performance report callback error:', error);
      }
    });
    
    return report;
  }
  
  /**
   * 监听报告变化
   */
  onReportChange(callback: (report: PerformanceReport) => void): () => void {
    this.reportCallbacks.add(callback);
    return () => {
      this.reportCallbacks.delete(callback);
    };
  }
  
  /**
   * 手动触发优化
   */
  triggerOptimization(): Array<{ action: string; impact: string }> {
    const optimizations: Array<{ action: string; impact: string }> = [];
    
    // 分析当前性能问题
    const currentMetrics = this.getAllRecentMetrics();
    const issues = this.analyzeIssues();
    
    issues.forEach(issue => {
      switch (issue.metric) {
        case 'memory_heap':
          if (issue.type === 'error') {
            optimizations.push({
              action: '触发垃圾收集',
              impact: '清理未使用内存'
            });
            // 触发GC（只能提醒浏览器）
            if ('gc' in (window as any)) {
              (window as any).gc();
            }
          }
          break;
          
        case 'dom_update':
          if (issue.type === 'warning') {
            optimizations.push({
              action: '批量DOM操作',
              impact: '减少重排重绘'
            });
          }
          break;
          
        case 'render_frame':
          if (issue.type === 'warning') {
            optimizations.push({
              action: '启用CSS transform',
              impact: '优化渲染性能'
            });
          }
          break;
      }
    });
    
    return optimizations;
  }
  
  /**
   * 设置指标阈值
   */
  setThreshold(name: string, warning: number, error: number, recommended?: number): void {
    this.thresholds.set(name, {
      name,
      warning,
      error,
      recommended: recommended || Math.min(warning, error) * 0.5
    });
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.samplingInterval && this.intervalId) {
      // 重启监控
      this.stopMonitoring();
      setTimeout(() => this.startMonitoring(), 100);
    }
  }
  
  /**
   * 导出性能数据
   */
  exportData(): {
    metrics: Record<string, PerformanceMetric[]>;
    config: MonitoringConfig;
    report: PerformanceReport;
  } {
    const data: Record<string, PerformanceMetric[]> = {};
    this.metrics.forEach((metrics, name) => {
      data[name] = metrics;
    });
    
    return {
      metrics: data,
      config: this.config,
      report: this.generateReport()
    };
  }
  
  /**
   * 清理旧数据
   */
  cleanup(): void {
    const cutoff = Date.now() - this.config.historyRetention;
    
    this.metrics.forEach((metrics, name) => {
      const filtered = metrics.filter(m => m.timestamp >= cutoff);
      this.metrics.set(name, filtered);
    });
    
    // 清理性能条目
    this.performanceEntries = this.performanceEntries.filter(e => e.startTime >= cutoff);
  }
  
  private addMetric(metric: PerformanceMetric): void {
    const metrics = this.metrics.get(metric.name) || [];
    metrics.push(metric);
    
    // 清理旧数据
    const cutoff = Date.now() - this.config.historyRetention;
    const recentMetrics = metrics.filter(m => m.timestamp >= cutoff);
    
    this.metrics.set(metric.name, recentMetrics);
  }
  
  private collectMetrics(): void {
    // 收集内存使用情况
    this.recordMemoryUsage();
    
    // 收集渲染性能
    this.recordRenderPerformance();
    
    // 收集FPS
    this.recordFPS();
    
    // 收集DOM性能
    this.recordDOMMetrics();
  }
  
  private recordFPS(): void {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.recordMetric('fps', fps, 'fps');
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
  
  private recordDOMMetrics(): void {
    const observer = new MutationObserver((mutations) => {
      this.recordMetric('dom_mutations', mutations.length, 'count');
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          this.recordMetric('dom_nodes_changed', 
            mutation.addedNodes.length + mutation.removedNodes.length, 'count');
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });
    
    // 30秒后停止观察
    setTimeout(() => observer.disconnect(), 30000);
  }
  
  private calculateHealthScore(): number {
    const currentMetrics = this.getAllCurrentMetrics();
    let totalScore = 0;
    let validMetrics = 0;
    
    currentMetrics.forEach(metric => {
      const threshold = this.thresholds.get(metric.name);
      if (threshold) {
        validMetrics++;
        
        if (metric.value <= threshold.recommended) {
          totalScore += 100; // 优秀
        } else if (metric.value <= threshold.error) {
          totalScore += Math.max(0, 100 - ((metric.value - threshold.recommended) / threshold.recommended) * 50);
        } else {
          totalScore += Math.max(0, 50 - ((metric.value - threshold.error) / threshold.error) * 40);
        }
      }
    });
    
    return validMetrics > 0 ? Math.round(totalScore / validMetrics) : 100;
  }
  
  private analyzeIssues(): PerformanceReport['issues'] {
    const issues: PerformanceReport['issues'] = [];
    
    this.thresholds.forEach((threshold, metricName) => {
      const latestMetric = this.getLatestMetric(metricName);
      if (!latestMetric) return;
      
      if (latestMetric.value > threshold.error) {
        issues.push({
          type: 'error',
          message: `${metricName} 严重超标: ${latestMetric.value}${latestMetric.unit}`,
          metric: metricName,
          impact: 'critical',
          recommendation: `需要立即优化 ${metricName}，建议值: ${threshold.recommended}${latestMetric.unit}`
        });
      } else if (latestMetric.value > threshold.warning) {
        issues.push({
          type: 'warning',
          message: `${metricName} 接近警告阈值: ${latestMetric.value}${latestMetric.unit}`,
          metric: metricName,
          impact: 'medium',
          recommendation: `优化 ${metricName}，目标: ${threshold.recommended}${latestMetric.unit}`
        });
      }
    });
    
    return issues;
  }
  
  private analyzeTrends(): PerformanceReport['trends'] {
    const trends: PerformanceReport['trends'] = [];
    
    this.metrics.forEach((metrics, name) => {
      if (metrics.length < 2) return;
      
      const recent = metrics.slice(-5);
      const older = metrics.slice(-10, -5);
      
      if (recent.length > 0 && older.length > 0) {
        const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
        const olderAvg = older.reduce((sum, m) => sum + m.value, 0) / older.length;
        
        const changePercent = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
        let trend: 'improving' | 'stable' | 'degrading';
        
        if (changePercent < -5) {
          trend = 'improving';
        } else if (changePercent > 5) {
          trend = 'degrading';
        } else {
          trend = 'stable';
        }
        
        trends.push({
          metric: name,
          trend,
          changePercent: Math.round(changePercent)
        });
      }
    });
    
    return trends;
  }
  
  private generateRecommendations(): PerformanceReport['recommendations'] {
    const recommendations: PerformanceReport['recommendations'] = [];
    const issues = this.analyzeIssues();
    
    issues.forEach(issue => {
      switch (issue.metric) {
        case 'memory_heap':
          recommendations.push({
            priority: 'high',
            category: 'memory',
            description: '内存使用过高',
            estimatedImpact: '减少30-50%内存使用',
            implementation: '实现对象池、延迟加载、及时清理事件监听器'
          });
          break;
          
        case 'fps':
          recommendations.push({
            priority: 'high',
            category: 'rendering',
            description: '帧率过低',
            estimatedImpact: '提升20-40%渲染性能',
            implementation: '使用requestAnimationFrame、CSS transform、虚拟滚动'
          });
          break;
          
        case 'dom_updates':
          recommendations.push({
            priority: 'medium',
            category: 'dom',
            description: 'DOM操作频繁',
            estimatedImpact: '减少90%重排重绘',
            implementation: '批量DOM操作、使用DocumentFragment'
          });
          break;
      }
    });
    
    return recommendations;
  }
  
  private getAllCurrentMetrics(): PerformanceMetric[] {
    const current: PerformanceMetric[] = [];
    this.metrics.forEach(metrics => {
      if (metrics.length > 0) {
        current.push(metrics[metrics.length - 1]);
      }
    });
    return current;
  }
  
  private getAllRecentMetrics(): PerformanceMetric[] {
    const all: PerformanceMetric[] = [];
    this.metrics.forEach(metrics => {
      all.push(...metrics.slice(-10)); // 最近10个
    });
    return all;
  }
  
  private setupDefaultThresholds(): void {
    const defaults = this.getDefaultThresholds();
    defaults.forEach(threshold => {
      this.thresholds.set(threshold.name, threshold);
    });
  }
  
  private getDefaultThresholds(): PerformanceThreshold[] {
    return [
      {
        name: 'memory_heap',
        warning: 50 * 1024 * 1024, // 50MB
        error: 100 * 1024 * 1024,   // 100MB
        recommended: 30 * 1024 * 1024 // 30MB
      },
      {
        name: 'fps',
        warning: 45,
        error: 30,
        recommended: 60
      },
      {
        name: 'dom_updates',
        warning: 100,
        error: 500,
        recommended: 50
      },
      {
        name: 'render_frame',
        warning: 16,
        error: 33,
        recommended: 8
      }
    ];
  }
  
  private setupObservers(): void {
    // Long Task Observer
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric('long_task', entry.duration, 'ms', 'duration');
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.set('longtask', longTaskObserver);
      } catch (error) {
        // Long task observer not supported
      }
    }
  }
  
  /**
   * 销毁监控器
   */
  destroy(): void {
    this.stopMonitoring();
    
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    
    this.reportCallbacks.clear();
    this.metrics.clear();
    this.thresholds.clear();
    
    PerformanceMonitorOptimizer.instance = null as any;
  }
}
