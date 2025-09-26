/**
 * 性能优化相关的工具函数
 */

/**
 * 创建防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate: boolean = false
): T & { cancel: () => void } {
  let timeoutId: number | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    const callNow = immediate && !timeoutId;
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = window.setTimeout(() => {
      timeoutId = null;
      if (!immediate) func(...args);
    }, delay);
    
    if (callNow) func(...args);
  }) as T & { cancel: () => void };
  
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}

/**
 * 创建节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): T & { cancel: () => void } {
  const { leading = true, trailing = true } = options;
  let timeoutId: number | null = null;
  let lastCallTime = 0;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T>;
  let lastThis: any;
  let result: ReturnType<T>;
  
  const throttled = function(this: any, ...args: Parameters<T>) {
    const time = Date.now();
    const isInvoking = leading && (time - lastInvokeTime) >= delay;
    
    lastArgs = args;
    lastThis = this;
    
    if (isInvoking) {
      lastInvokeTime = time;
      result = func.apply(lastThis, lastArgs);
      return result;
    }
    
    if (!timeoutId) {
      if (leading) {
        lastInvokeTime = time;
      }
      timeoutId = window.setTimeout(() => {
        lastInvokeTime = leading ? 0 : Date.now();
        timeoutId = null;
        result = func.apply(lastThis, lastArgs);
      }, delay - (time - lastInvokeTime));
    }
    
    return result;
  } as T & { cancel: () => void };
  
  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastInvokeTime = 0;
  };
  
  return throttled;
}

/**
 * 创建请求动画帧节流
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): T & { cancel: () => void } {
  let rafId: number | null = null;
  let lastArgs: Parameters<T>;
  let lastThis: any;
  
  const throttled = function(this: any, ...args: Parameters<T>) {
    lastArgs = args;
    lastThis = this;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        rafId = null;
        func.apply(lastThis, lastArgs);
      });
    }
  } as T & { cancel: () => void };
  
  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
  
  return throttled;
}

/**
 * 创建批量处理器
 */
export function createBatchProcessor<T>(
  processor: (items: T[]) => void,
  batchSize: number = 10,
  delay: number = 0
): {
  add: (item: T) => void;
  flush: () => void;
  clear: () => void;
} {
  const queue: T[] = [];
  let timeoutId: number | null = null;
  
  const processBatch = () => {
    if (queue.length === 0) return;
    
    const batch = queue.splice(0, batchSize);
    processor(batch);
    
    if (queue.length > 0) {
      timeoutId = window.setTimeout(processBatch, delay);
    }
  };
  
  return {
    add: (item: T) => {
      queue.push(item);
      
      if (queue.length >= batchSize) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        processBatch();
      } else if (timeoutId === null) {
        timeoutId = window.setTimeout(processBatch, delay);
      }
    },
    flush: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      processBatch();
    },
    clear: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      queue.length = 0;
    }
  };
}

/**
 * 创建内存池
 */
export function createObjectPool<T>(
  factory: () => T,
  reset: (obj: T) => void,
  initialSize: number = 10
): {
  get: () => T;
  release: (obj: T) => void;
  clear: () => void;
  size: () => number;
} {
  const pool: T[] = [];
  
  // 预填充池
  for (let i = 0; i < initialSize; i++) {
    pool.push(factory());
  }
  
  return {
    get: () => {
      if (pool.length > 0) {
        return pool.pop()!;
      }
      return factory();
    },
    release: (obj: T) => {
      reset(obj);
      pool.push(obj);
    },
    clear: () => {
      pool.length = 0;
    },
    size: () => pool.length
  };
}

/**
 * 创建LRU缓存
 */
export function createLRUCache<K, V>(
  maxSize: number = 100
): {
  get: (key: K) => V | undefined;
  set: (key: K, value: V) => void;
  has: (key: K) => boolean;
  delete: (key: K) => boolean;
  clear: () => void;
  size: () => number;
} {
  const cache = new Map<K, V>();
  
  return {
    get: (key: K) => {
      const value = cache.get(key);
      if (value !== undefined) {
        // 移动到末尾（最近使用）
        cache.delete(key);
        cache.set(key, value);
      }
      return value;
    },
    set: (key: K, value: V) => {
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= maxSize) {
        // 删除最旧的项
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
          cache.delete(firstKey);
        }
      }
      cache.set(key, value);
    },
    has: (key: K) => cache.has(key),
    delete: (key: K) => cache.delete(key),
    clear: () => cache.clear(),
    size: () => cache.size
  };
}

/**
 * 创建虚拟滚动
 */
export function createVirtualScroll<T>(
  items: T[],
  containerHeight: number,
  itemHeight: number,
  renderItem: (item: T, index: number) => HTMLElement
): {
  updateItems: (newItems: T[]) => void;
  updateContainerHeight: (height: number) => void;
  updateItemHeight: (height: number) => void;
  getVisibleItems: () => Array<{ item: T; index: number; top: number }>;
  scrollTo: (index: number) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
} {
  let currentItems = items;
  let currentContainerHeight = containerHeight;
  let currentItemHeight = itemHeight;
  let scrollTop = 0;
  
  const getVisibleRange = () => {
    const startIndex = Math.floor(scrollTop / currentItemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(currentContainerHeight / currentItemHeight) + 1,
      currentItems.length
    );
    return { startIndex, endIndex };
  };
  
  const getVisibleItems = () => {
    const { startIndex, endIndex } = getVisibleRange();
    const visibleItems: Array<{ item: T; index: number; top: number }> = [];
    
    for (let i = startIndex; i < endIndex; i++) {
      visibleItems.push({
        item: currentItems[i],
        index: i,
        top: i * currentItemHeight
      });
    }
    
    return visibleItems;
  };
  
  return {
    updateItems: (newItems: T[]) => {
      currentItems = newItems;
    },
    updateContainerHeight: (height: number) => {
      currentContainerHeight = height;
    },
    updateItemHeight: (height: number) => {
      currentItemHeight = height;
    },
    getVisibleItems,
    scrollTo: (index: number) => {
      scrollTop = index * currentItemHeight;
    },
    scrollToTop: () => {
      scrollTop = 0;
    },
    scrollToBottom: () => {
      scrollTop = (currentItems.length - 1) * currentItemHeight;
    }
  };
}

/**
 * 创建性能监控器
 */
export function createPerformanceMonitor(): {
  start: (name: string) => void;
  end: (name: string) => number;
  getMetrics: () => Record<string, number>;
  clear: () => void;
} {
  const metrics: Record<string, number> = {};
  const timers: Record<string, number> = {};
  
  return {
    start: (name: string) => {
      timers[name] = performance.now();
    },
    end: (name: string) => {
      if (timers[name] !== undefined) {
        const duration = performance.now() - timers[name];
        metrics[name] = duration;
        delete timers[name];
        return duration;
      }
      return 0;
    },
    getMetrics: () => ({ ...metrics }),
    clear: () => {
      Object.keys(metrics).forEach(key => delete metrics[key]);
      Object.keys(timers).forEach(key => delete timers[key]);
    }
  };
}

/**
 * 创建懒加载
 */
export function createLazyLoader<T>(
  loader: () => Promise<T>,
  timeout: number = 5000
): {
  load: () => Promise<T>;
  isLoaded: () => boolean;
  isLoading: () => boolean;
  clear: () => void;
} {
  let promise: Promise<T> | null = null;
  let loaded = false;
  let loading = false;
  
  return {
    load: () => {
      if (loaded) {
        return Promise.resolve(promise as Promise<T>);
      }
      
      if (loading) {
        return promise as Promise<T>;
      }
      
      loading = true;
      promise = Promise.race([
        loader(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Lazy load timeout')), timeout)
        )
      ]).then(result => {
        loaded = true;
        loading = false;
        return result;
      }).catch(error => {
        loading = false;
        throw error;
      });
      
      return promise;
    },
    isLoaded: () => loaded,
    isLoading: () => loading,
    clear: () => {
      promise = null;
      loaded = false;
      loading = false;
    }
  };
}

/**
 * 创建任务队列
 */
export function createTaskQueue(): {
  add: (task: () => Promise<void>, priority?: number) => void;
  run: () => Promise<void>;
  clear: () => void;
  size: () => number;
} {
  const tasks: Array<{ task: () => Promise<void>; priority: number }> = [];
  let running = false;
  
  return {
    add: (task: () => Promise<void>, priority: number = 0) => {
      tasks.push({ task, priority });
      tasks.sort((a, b) => b.priority - a.priority);
    },
    run: async () => {
      if (running) return;
      running = true;
      
      while (tasks.length > 0) {
        const { task } = tasks.shift()!;
        try {
          await task();
        } catch (error) {
          // 任务执行错误
        }
      }
      
      running = false;
    },
    clear: () => {
      tasks.length = 0;
    },
    size: () => tasks.length
  };
}

/**
 * 创建资源预加载器
 */
export function createResourcePreloader(): {
  preload: (url: string, type: 'image' | 'script' | 'style' | 'font') => Promise<void>;
  preloadMultiple: (resources: Array<{ url: string; type: 'image' | 'script' | 'style' | 'font' }>) => Promise<void>;
  clear: () => void;
} {
  const loadedResources = new Set<string>();
  
  const preload = (url: string, type: 'image' | 'script' | 'style' | 'font'): Promise<void> => {
    if (loadedResources.has(url)) {
      return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
      let element: HTMLElement;
      
      switch (type) {
        case 'image':
          element = new Image();
          (element as HTMLImageElement).onload = () => {
            loadedResources.add(url);
            resolve();
          };
          (element as HTMLImageElement).onerror = reject;
          (element as HTMLImageElement).src = url;
          break;
          
        case 'script':
          element = document.createElement('script');
          element.onload = () => {
            loadedResources.add(url);
            resolve();
          };
          element.onerror = reject;
          (element as HTMLScriptElement).src = url;
          document.head.appendChild(element);
          break;
          
        case 'style':
          element = document.createElement('link');
          element.onload = () => {
            loadedResources.add(url);
            resolve();
          };
          element.onerror = reject;
          (element as HTMLLinkElement).rel = 'stylesheet';
          (element as HTMLLinkElement).href = url;
          document.head.appendChild(element);
          break;
          
        case 'font':
          element = document.createElement('link');
          element.onload = () => {
            loadedResources.add(url);
            resolve();
          };
          element.onerror = reject;
          (element as HTMLLinkElement).rel = 'preload';
          (element as HTMLLinkElement).as = 'font';
          (element as HTMLLinkElement).href = url;
          (element as HTMLLinkElement).crossOrigin = 'anonymous';
          document.head.appendChild(element);
          break;
      }
    });
  };
  
  const preloadMultiple = async (resources: Array<{ url: string; type: 'image' | 'script' | 'style' | 'font' }>) => {
    await Promise.all(resources.map(({ url, type }) => preload(url, type)));
  };
  
  return {
    preload,
    preloadMultiple,
    clear: () => {
      loadedResources.clear();
    }
  };
}
