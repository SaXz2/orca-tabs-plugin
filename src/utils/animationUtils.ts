/**
 * 动画和过渡效果相关的工具函数
 */

/**
 * 创建淡入动画
 */
export function createFadeInAnimation(
  element: HTMLElement,
  duration: number = 300,
  easing: string = 'ease-out'
): Promise<void> {
  return new Promise((resolve) => {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ${easing}`;
    
    // 强制重排
    element.offsetHeight;
    
    element.style.opacity = '1';
    
    setTimeout(() => {
      element.style.transition = '';
      resolve();
    }, duration);
  });
}

/**
 * 创建淡出动画
 */
export function createFadeOutAnimation(
  element: HTMLElement,
  duration: number = 300,
  easing: string = 'ease-in'
): Promise<void> {
  return new Promise((resolve) => {
    element.style.transition = `opacity ${duration}ms ${easing}`;
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.style.transition = '';
      resolve();
    }, duration);
  });
}

/**
 * 创建滑入动画
 */
export function createSlideInAnimation(
  element: HTMLElement,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'left',
  duration: number = 300,
  easing: string = 'ease-out'
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    
    // 设置初始位置
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)'
    };
    
    element.style.transform = transforms[direction];
    element.style.transition = `transform ${duration}ms ${easing}`;
    
    // 强制重排
    element.offsetHeight;
    
    // 滑入到最终位置
    element.style.transform = originalTransform || 'translateX(0) translateY(0)';
    
    setTimeout(() => {
      element.style.transition = originalTransition;
      resolve();
    }, duration);
  });
}

/**
 * 创建滑出动画
 */
export function createSlideOutAnimation(
  element: HTMLElement,
  direction: 'left' | 'right' | 'top' | 'bottom' = 'left',
  duration: number = 300,
  easing: string = 'ease-in'
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransition = element.style.transition;
    
    // 设置目标位置
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)'
    };
    
    element.style.transition = `transform ${duration}ms ${easing}`;
    element.style.transform = transforms[direction];
    
    setTimeout(() => {
      element.style.transition = originalTransition;
      resolve();
    }, duration);
  });
}

/**
 * 创建缩放动画
 */
export function createScaleAnimation(
  element: HTMLElement,
  fromScale: number = 0,
  toScale: number = 1,
  duration: number = 300,
  easing: string = 'ease-out'
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    
    element.style.transform = `scale(${fromScale})`;
    element.style.transition = `transform ${duration}ms ${easing}`;
    
    // 强制重排
    element.offsetHeight;
    
    element.style.transform = `scale(${toScale})`;
    
    setTimeout(() => {
      element.style.transform = originalTransform;
      element.style.transition = originalTransition;
      resolve();
    }, duration);
  });
}

/**
 * 创建弹跳动画
 */
export function createBounceAnimation(
  element: HTMLElement,
  duration: number = 600,
  intensity: number = 0.3
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    
    element.style.transition = `transform ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    
    // 创建弹跳关键帧
    const keyframes = [
      { transform: 'scale(1)', offset: 0 },
      { transform: `scale(${1 + intensity})`, offset: 0.3 },
      { transform: `scale(${1 - intensity * 0.5})`, offset: 0.6 },
      { transform: 'scale(1)', offset: 1 }
    ];
    
    const animation = element.animate(keyframes, {
      duration,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
    
    animation.addEventListener('finish', () => {
      element.style.transform = originalTransform;
      element.style.transition = originalTransition;
      resolve();
    });
  });
}

/**
 * 创建摇摆动画
 */
export function createShakeAnimation(
  element: HTMLElement,
  duration: number = 500,
  intensity: number = 10
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    
    element.style.transition = `transform ${duration}ms ease-in-out`;
    
    // 创建摇摆关键帧
    const keyframes = [
      { transform: 'translateX(0)', offset: 0 },
      { transform: `translateX(-${intensity}px)`, offset: 0.1 },
      { transform: `translateX(${intensity}px)`, offset: 0.2 },
      { transform: `translateX(-${intensity}px)`, offset: 0.3 },
      { transform: `translateX(${intensity}px)`, offset: 0.4 },
      { transform: `translateX(-${intensity}px)`, offset: 0.5 },
      { transform: `translateX(${intensity}px)`, offset: 0.6 },
      { transform: `translateX(-${intensity}px)`, offset: 0.7 },
      { transform: `translateX(${intensity}px)`, offset: 0.8 },
      { transform: `translateX(-${intensity}px)`, offset: 0.9 },
      { transform: 'translateX(0)', offset: 1 }
    ];
    
    const animation = element.animate(keyframes, {
      duration,
      easing: 'ease-in-out'
    });
    
    animation.addEventListener('finish', () => {
      element.style.transform = originalTransform;
      element.style.transition = originalTransition;
      resolve();
    });
  });
}

/**
 * 创建脉冲动画
 */
export function createPulseAnimation(
  element: HTMLElement,
  duration: number = 1000,
  intensity: number = 0.1
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    
    element.style.transition = `transform ${duration}ms ease-in-out`;
    
    // 创建脉冲关键帧
    const keyframes = [
      { transform: 'scale(1)', offset: 0 },
      { transform: `scale(${1 + intensity})`, offset: 0.5 },
      { transform: 'scale(1)', offset: 1 }
    ];
    
    const animation = element.animate(keyframes, {
      duration,
      easing: 'ease-in-out',
      iterations: 2
    });
    
    animation.addEventListener('finish', () => {
      element.style.transform = originalTransform;
      element.style.transition = originalTransition;
      resolve();
    });
  });
}

/**
 * 创建旋转动画
 */
export function createRotateAnimation(
  element: HTMLElement,
  angle: number = 360,
  duration: number = 500,
  easing: string = 'ease-in-out'
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransform = element.style.transform;
    const originalTransition = element.style.transition;
    
    element.style.transition = `transform ${duration}ms ${easing}`;
    element.style.transform = `rotate(${angle}deg)`;
    
    setTimeout(() => {
      element.style.transform = originalTransform;
      element.style.transition = originalTransition;
      resolve();
    }, duration);
  });
}

/**
 * 创建颜色过渡动画
 */
export function createColorTransitionAnimation(
  element: HTMLElement,
  fromColor: string,
  toColor: string,
  duration: number = 300,
  easing: string = 'ease-in-out'
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransition = element.style.transition;
    
    element.style.transition = `background-color ${duration}ms ${easing}, color ${duration}ms ${easing}`;
    element.style.backgroundColor = fromColor;
    
    // 强制重排
    element.offsetHeight;
    
    element.style.backgroundColor = toColor;
    
    setTimeout(() => {
      element.style.transition = originalTransition;
      resolve();
    }, duration);
  });
}

/**
 * 创建高度过渡动画
 */
export function createHeightTransitionAnimation(
  element: HTMLElement,
  fromHeight: string,
  toHeight: string,
  duration: number = 300,
  easing: string = 'ease-in-out'
): Promise<void> {
  return new Promise((resolve) => {
    const originalTransition = element.style.transition;
    const originalHeight = element.style.height;
    
    element.style.transition = `height ${duration}ms ${easing}`;
    element.style.height = fromHeight;
    
    // 强制重排
    element.offsetHeight;
    
    element.style.height = toHeight;
    
    setTimeout(() => {
      element.style.transition = originalTransition;
      element.style.height = originalHeight;
      resolve();
    }, duration);
  });
}

/**
 * 创建组合动画
 */
export function createCombinedAnimation(
  element: HTMLElement,
  animations: Array<{
    property: string;
    from: string;
    to: string;
    duration: number;
    easing?: string;
  }>,
  totalDuration: number
): Promise<void> {
  return new Promise((resolve) => {
    const originalStyles: Record<string, string> = {};
    const originalTransition = element.style.transition;
    
    // 保存原始样式
    animations.forEach(anim => {
      originalStyles[anim.property] = (element.style as any)[anim.property];
    });
    
    // 设置初始值
    animations.forEach(anim => {
      (element.style as any)[anim.property] = anim.from;
    });
    
    // 设置过渡
    const transitionParts = animations.map(anim => 
      `${anim.property} ${anim.duration}ms ${anim.easing || 'ease-in-out'}`
    );
    element.style.transition = transitionParts.join(', ');
    
    // 强制重排
    element.offsetHeight;
    
    // 设置目标值
    animations.forEach(anim => {
      (element.style as any)[anim.property] = anim.to;
    });
    
    setTimeout(() => {
      // 恢复原始样式
      Object.entries(originalStyles).forEach(([property, value]) => {
        (element.style as any)[property] = value;
      });
      element.style.transition = originalTransition;
      resolve();
    }, totalDuration);
  });
}

/**
 * 创建延迟动画
 */
export function createDelayedAnimation(
  element: HTMLElement,
  animation: () => Promise<void>,
  delay: number
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await animation();
      resolve();
    }, delay);
  });
}

/**
 * 创建循环动画
 */
export function createLoopAnimation(
  element: HTMLElement,
  animation: () => Promise<void>,
  interval: number,
  maxIterations: number = Infinity
): { stop: () => void } {
  let iteration = 0;
  let timeoutId: number | null = null;
  
  const runAnimation = async () => {
    if (iteration >= maxIterations) return;
    
    await animation();
    iteration++;
    
    if (iteration < maxIterations) {
      timeoutId = window.setTimeout(runAnimation, interval);
    }
  };
  
  runAnimation();
  
  return {
    stop: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    }
  };
}

/**
 * 检查元素是否在视口中
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 创建视口进入动画
 */
export function createViewportEnterAnimation(
  element: HTMLElement,
  animation: () => Promise<void>,
  threshold: number = 0.1
): Promise<void> {
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            animation().then(resolve);
          }
        });
      },
      { threshold }
    );
    
    observer.observe(element);
  });
}

/**
 * 创建动画队列
 */
export function createAnimationQueue(): {
  add: (animation: () => Promise<void>) => void;
  run: () => Promise<void>;
  clear: () => void;
} {
  const queue: Array<() => Promise<void>> = [];
  
  return {
    add: (animation: () => Promise<void>) => {
      queue.push(animation);
    },
    run: async () => {
      for (const animation of queue) {
        await animation();
      }
    },
    clear: () => {
      queue.length = 0;
    }
  };
}
