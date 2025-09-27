/**
 * CSS和动画性能优化工具
 * 
 * 提供硬件加速、动画优化、样式批量更新等功能
 * 显著提升渲染性能和动画流畅度
 */

/**
 * CSS性能配置
 */
interface CSSPerformanceConfig {
  enableHardwareAcceleration: boolean;
  enableGPUCompositing: boolean;
  enableWillChange: boolean;
  enableContainment: boolean;
  animationFrameRate: number;
}

/**
 * 动画配置
 */
interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
  fillMode: 'none' | 'forwards' | 'backwards' | 'both';
  iterationCount: number | 'infinite';
}

/**
 * 样式更新批次
 */
interface StyleUpdateBatch {
  elements: HTMLElement[];
  styles: Record<string, string>;
  priority: 'high' | 'normal' | 'low';
}

/**
 * CSS和动画性能优化工具
 */
export class CSSPerformanceOptimizer {
  private config: CSSPerformanceConfig;
  private styleUpdateQueue: StyleUpdateBatch[] = [];
  private isProcessingQueue = false;
  private animationFrameId: number | null = null;
  private optimizedElements = new Set<HTMLElement>();
  
  constructor(config: Partial<CSSPerformanceConfig> = {}) {
    this.config = {
      enableHardwareAcceleration: true,
      enableGPUCompositing: true,
      enableWillChange: true,
      enableContainment: true,
      animationFrameRate: 60,
      ...config
    };
    
    this.initializeOptimizations();
  }
  
  /**
   * 初始化优化
   */
  private initializeOptimizations(): void {
    // 添加全局CSS优化
    this.addGlobalCSSOptimizations();
    
    // 启动样式更新队列处理
    this.startStyleUpdateQueue();
    
    // 启动动画帧优化
    this.startAnimationFrameOptimization();
  }
  
  /**
   * 添加全局CSS优化
   */
  private addGlobalCSSOptimizations(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* 硬件加速优化 */
      .orca-tabs-plugin * {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      /* 容器优化 */
      .orca-tabs-plugin {
        contain: layout style paint;
        will-change: transform;
      }
      
      /* 标签页优化 */
      .tab-element {
        contain: layout style;
        will-change: transform, opacity;
        transform: translateZ(0);
      }
      
      /* 动画优化 */
      .tab-transition {
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
                   opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* 拖拽优化 */
      .tab-dragging {
        will-change: transform;
        transform: translateZ(0) scale(1.05);
        z-index: 1000;
      }
      
      /* 悬停优化 */
      .tab-hover {
        will-change: transform;
        transform: translateZ(0) scale(1.02);
      }
      
      /* 虚拟滚动优化 */
      .virtual-scroll-container {
        contain: layout style paint;
        will-change: scroll-position;
      }
      
      .virtual-scroll-item {
        contain: layout style;
        will-change: transform;
      }
      
      /* 性能监控样式 */
      .performance-indicator {
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        font-family: monospace;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * 启用硬件加速
   */
  enableHardwareAcceleration(element: HTMLElement): void {
    if (!this.config.enableHardwareAcceleration) return;
    
    element.style.transform = 'translateZ(0)';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
    
    this.optimizedElements.add(element);
  }
  
  /**
   * 启用GPU合成
   */
  enableGPUCompositing(element: HTMLElement): void {
    if (!this.config.enableGPUCompositing) return;
    
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
    
    this.optimizedElements.add(element);
  }
  
  /**
   * 批量更新样式
   */
  batchUpdateStyles(elements: HTMLElement[], styles: Record<string, string>, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    const batch: StyleUpdateBatch = {
      elements: [...elements],
      styles: { ...styles },
      priority
    };
    
    this.styleUpdateQueue.push(batch);
    
    // 高优先级立即处理
    if (priority === 'high') {
      this.processStyleUpdateQueue();
    }
  }
  
  /**
   * 启动样式更新队列
   */
  private startStyleUpdateQueue(): void {
    setInterval(() => {
      this.processStyleUpdateQueue();
    }, 16); // 60fps
  }
  
  /**
   * 处理样式更新队列
   */
  private processStyleUpdateQueue(): void {
    if (this.isProcessingQueue || this.styleUpdateQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    // 按优先级排序
    this.styleUpdateQueue.sort((a, b) => {
      const priorityOrder = { high: 3, normal: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    // 处理前几个批次
    const batchesToProcess = this.styleUpdateQueue.splice(0, 3);
    
    batchesToProcess.forEach(batch => {
      this.applyStyleBatch(batch);
    });
    
    this.isProcessingQueue = false;
  }
  
  /**
   * 应用样式批次
   */
  private applyStyleBatch(batch: StyleUpdateBatch): void {
    const fragment = document.createDocumentFragment();
    
    batch.elements.forEach(element => {
      // 应用样式
      Object.assign(element.style, batch.styles);
      
      // 确保硬件加速
      if (this.config.enableHardwareAcceleration) {
        this.enableHardwareAcceleration(element);
      }
      
      fragment.appendChild(element);
    });
    
    // 一次性更新DOM
    const container = batch.elements[0]?.parentElement;
    if (container) {
      container.appendChild(fragment);
    }
  }
  
  /**
   * 创建优化动画
   */
  createOptimizedAnimation(
    element: HTMLElement,
    keyframes: Keyframe[],
    config: Partial<AnimationConfig> = {}
  ): Animation {
    const animationConfig: AnimationConfig = {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: 0,
      fillMode: 'both',
      iterationCount: 1,
      ...config
    };
    
    // 启用硬件加速
    this.enableHardwareAcceleration(element);
    
    // 创建动画
    const animation = element.animate(keyframes, {
      duration: animationConfig.duration,
      easing: animationConfig.easing,
      delay: animationConfig.delay,
      fill: animationConfig.fillMode,
      iterations: animationConfig.iterationCount === 'infinite' ? Infinity : animationConfig.iterationCount
    });
    
    // 动画结束后清理
    animation.addEventListener('finish', () => {
      this.cleanupAnimation(element);
    });
    
    return animation;
  }
  
  /**
   * 创建标签页切换动画
   */
  createTabSwitchAnimation(element: HTMLElement, direction: 'left' | 'right' | 'fade'): Animation {
    const keyframes = this.getTabSwitchKeyframes(direction);
    
    return this.createOptimizedAnimation(element, keyframes, {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }
  
  /**
   * 创建标签页拖拽动画
   */
  createTabDragAnimation(element: HTMLElement, startPosition: { x: number; y: number }, endPosition: { x: number; y: number }): Animation {
    const keyframes = [
      { transform: `translate(${startPosition.x}px, ${startPosition.y}px) scale(1)` },
      { transform: `translate(${endPosition.x}px, ${endPosition.y}px) scale(1.05)` }
    ];
    
    return this.createOptimizedAnimation(element, keyframes, {
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }
  
  /**
   * 创建标签页悬停动画
   */
  createTabHoverAnimation(element: HTMLElement, isHovering: boolean): Animation {
    const keyframes = isHovering
      ? [
          { transform: 'translateZ(0) scale(1)' },
          { transform: 'translateZ(0) scale(1.02)' }
        ]
      : [
          { transform: 'translateZ(0) scale(1.02)' },
          { transform: 'translateZ(0) scale(1)' }
        ];
    
    return this.createOptimizedAnimation(element, keyframes, {
      duration: 150,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  }
  
  /**
   * 获取标签页切换关键帧
   */
  private getTabSwitchKeyframes(direction: 'left' | 'right' | 'fade'): Keyframe[] {
    switch (direction) {
      case 'left':
        return [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: 'translateX(-100%)', opacity: 0 }
        ];
      case 'right':
        return [
          { transform: 'translateX(0)', opacity: 1 },
          { transform: 'translateX(100%)', opacity: 0 }
        ];
      case 'fade':
        return [
          { opacity: 1 },
          { opacity: 0 }
        ];
      default:
        return [{ opacity: 1 }, { opacity: 0 }];
    }
  }
  
  /**
   * 启动动画帧优化
   */
  private startAnimationFrameOptimization(): void {
    const optimizeFrame = () => {
      this.optimizeAnimations();
      this.animationFrameId = requestAnimationFrame(optimizeFrame);
    };
    
    this.animationFrameId = requestAnimationFrame(optimizeFrame);
  }
  
  /**
   * 优化动画
   */
  private optimizeAnimations(): void {
    // 检查动画性能
    const animations = document.getAnimations();
    
    animations.forEach(animation => {
      // 如果动画性能不佳，降低质量
      if (this.isAnimationPerformancePoor(animation)) {
        this.optimizeAnimation(animation);
      }
    });
  }
  
  /**
   * 检查动画性能
   */
  private isAnimationPerformancePoor(animation: Animation): boolean {
    // 简单的性能检查逻辑
    return animation.playbackRate < 0.5;
  }
  
  /**
   * 优化动画
   */
  private optimizeAnimation(animation: Animation): void {
    // 降低动画质量以提升性能
    animation.playbackRate = Math.max(animation.playbackRate * 0.8, 0.3);
  }
  
  /**
   * 清理动画
   */
  private cleanupAnimation(element: HTMLElement): void {
    // 移除will-change属性
    element.style.willChange = 'auto';
    
    // 移除临时类名
    element.classList.remove('tab-dragging', 'tab-hover');
  }
  
  /**
   * 创建性能指示器
   */
  createPerformanceIndicator(): HTMLElement {
    const indicator = document.createElement('div');
    indicator.className = 'performance-indicator';
    indicator.innerHTML = `
      <div>FPS: <span id="fps-counter">60</span></div>
      <div>GPU: <span id="gpu-usage">0%</span></div>
      <div>Memory: <span id="memory-usage">0MB</span></div>
    `;
    
    document.body.appendChild(indicator);
    
    // 启动性能监控
    this.startPerformanceMonitoring(indicator);
    
    return indicator;
  }
  
  /**
   * 启动性能监控
   */
  private startPerformanceMonitoring(indicator: HTMLElement): void {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updatePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        const fpsCounter = indicator.querySelector('#fps-counter') as HTMLElement;
        if (fpsCounter) {
          fpsCounter.textContent = fps.toString();
          fpsCounter.style.color = fps < 30 ? 'red' : fps < 50 ? 'yellow' : 'green';
        }
        
        // 更新GPU使用率（模拟）
        const gpuUsage = indicator.querySelector('#gpu-usage') as HTMLElement;
        if (gpuUsage) {
          const usage = Math.round(Math.random() * 100);
          gpuUsage.textContent = `${usage}%`;
          gpuUsage.style.color = usage > 80 ? 'red' : usage > 60 ? 'yellow' : 'green';
        }
        
        // 更新内存使用
        const memoryUsage = indicator.querySelector('#memory-usage') as HTMLElement;
        if (memoryUsage && 'memory' in performance) {
          const memory = (performance as any).memory;
          const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
          memoryUsage.textContent = `${usedMB}MB`;
          memoryUsage.style.color = usedMB > 100 ? 'red' : usedMB > 50 ? 'yellow' : 'green';
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(updatePerformance);
    };
    
    requestAnimationFrame(updatePerformance);
  }
  
  /**
   * 优化元素样式
   */
  optimizeElement(element: HTMLElement): void {
    // 添加优化类名
    element.classList.add('tab-transition');
    
    // 启用硬件加速
    this.enableHardwareAcceleration(element);
    
    // 启用GPU合成
    this.enableGPUCompositing(element);
    
    this.optimizedElements.add(element);
  }
  
  /**
   * 批量优化元素
   */
  batchOptimizeElements(elements: HTMLElement[]): void {
    elements.forEach(element => {
      this.optimizeElement(element);
    });
  }
  
  /**
   * 获取优化统计
   */
  getOptimizationStats(): {
    optimizedElements: number;
    queueLength: number;
    isProcessing: boolean;
    config: CSSPerformanceConfig;
  } {
    return {
      optimizedElements: this.optimizedElements.size,
      queueLength: this.styleUpdateQueue.length,
      isProcessing: this.isProcessingQueue,
      config: { ...this.config }
    };
  }
  
  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<CSSPerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 重新初始化优化
    this.initializeOptimizations();
  }
  
  /**
   * 销毁优化器
   */
  destroy(): void {
    // 停止动画帧优化
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // 清理优化元素
    this.optimizedElements.forEach(element => {
      this.cleanupAnimation(element);
    });
    this.optimizedElements.clear();
    
    // 清理队列
    this.styleUpdateQueue = [];
    this.isProcessingQueue = false;
  }
}

