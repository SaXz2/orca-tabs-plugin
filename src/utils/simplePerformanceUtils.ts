/**
 * 简化的性能监控器
 * 
 * 只监控关键性能指标，避免过度复杂化
 * 专注于实际性能瓶颈的识别
 */

/**
 * 简化的性能监控器
 */
export class SimplePerformanceMonitor {
  private renderTimes: number[] = [];
  private maxSamples = 10; // 只保留最近10次记录
  private isEnabled = true;
  
  constructor() {
    // 定期清理旧数据
    setInterval(() => {
      this.cleanupOldData();
    }, 60000); // 每分钟清理一次
  }
  
  /**
   * 开始渲染计时
   */
  startRenderTimer(): void {
    if (!this.isEnabled) return;
    
    (this as any).renderStartTime = performance.now();
  }
  
  /**
   * 结束渲染计时
   */
  endRenderTimer(): number {
    if (!this.isEnabled || !(this as any).renderStartTime) return 0;
    
    const renderTime = performance.now() - (this as any).renderStartTime;
    (this as any).renderStartTime = 0;
    
    // 记录渲染时间
    this.renderTimes.push(renderTime);
    
    // 限制样本数量
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes.shift();
    }
    
    // 如果渲染时间过长，发出警告
    if (renderTime > 30) {
      console.warn(`⚠️ 渲染时间过长: ${renderTime.toFixed(2)}ms`);
    }
    
    return renderTime;
  }
  
  /**
   * 获取性能报告
   */
  getPerformanceReport(): {
    averageRenderTime: number;
    maxRenderTime: number;
    slowRenders: number;
    performanceScore: number;
  } {
    if (this.renderTimes.length === 0) {
      return {
        averageRenderTime: 0,
        maxRenderTime: 0,
        slowRenders: 0,
        performanceScore: 100
      };
    }
    
    const averageRenderTime = this.renderTimes.reduce((sum, time) => sum + time, 0) / this.renderTimes.length;
    const maxRenderTime = Math.max(...this.renderTimes);
    const slowRenders = this.renderTimes.filter(time => time > 30).length;
    
    // 简单的性能评分
    let performanceScore = 100;
    if (averageRenderTime > 50) performanceScore -= 40;
    else if (averageRenderTime > 30) performanceScore -= 20;
    else if (averageRenderTime > 20) performanceScore -= 10;
    
    if (slowRenders > 3) performanceScore -= 20;
    else if (slowRenders > 1) performanceScore -= 10;
    
    return {
      averageRenderTime: Math.round(averageRenderTime * 100) / 100,
      maxRenderTime: Math.round(maxRenderTime * 100) / 100,
      slowRenders,
      performanceScore: Math.max(0, performanceScore)
    };
  }
  
  /**
   * 清理旧数据
   */
  private cleanupOldData(): void {
    // 保留最近的数据
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes = this.renderTimes.slice(-this.maxSamples);
    }
  }
  
  /**
   * 启用/禁用监控
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }
  
  /**
   * 重置数据
   */
  reset(): void {
    this.renderTimes = [];
    (this as any).renderStartTime = 0;
  }
  
  /**
   * 销毁监控器
   */
  destroy(): void {
    this.reset();
    this.isEnabled = false;
  }
}
