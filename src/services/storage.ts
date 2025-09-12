import { PLUGIN_STORAGE_KEYS } from '../constants';

/**
 * 基于Orca API的存储服务类
 * 提供统一的配置存储和读取接口，支持降级到localStorage
 */
export class OrcaStorageService {
  private log(...args: any[]) {
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
      console.log('[OrcaStorageService]', ...args);
    }
  }

  private warn(...args: any[]) {
    console.warn('[OrcaStorageService]', ...args);
  }

  private error(...args: any[]) {
    console.error('[OrcaStorageService]', ...args);
  }

  /**
   * 保存数据到Orca插件存储系统
   * @param key 存储键
   * @param data 要保存的数据
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async saveConfig(key: string, data: any, pluginName: string = 'orca-tabs-plugin'): Promise<boolean> {
    try {
      // 将复杂对象序列化为JSON字符串
      const serializedData = typeof data === 'string' ? data : JSON.stringify(data);
      await orca.plugins.setData(pluginName, key, serializedData);
      this.log(`💾 已保存插件数据 ${key}:`, data);
      return true;
    } catch (error) {
      this.warn(`无法保存插件数据 ${key}，尝试降级到localStorage:`, error);
      return this.saveToLocalStorage(key, data);
    }
  }

  /**
   * 从Orca插件存储系统读取数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   * @param defaultValue 默认值
   */
  async getConfig<T>(key: string, pluginName: string = 'orca-tabs-plugin', defaultValue?: T): Promise<T | null> {
    try {
      const result = await orca.plugins.getData(pluginName, key);
      
      if (result === null || result === undefined) {
        return defaultValue || null;
      }
      
      // 尝试反序列化JSON字符串
      let parsedResult: T;
      if (typeof result === 'string') {
        try {
          parsedResult = JSON.parse(result);
        } catch (parseError) {
          // 如果解析失败，可能是纯字符串，直接返回
          parsedResult = result as T;
        }
      } else {
        // 如果已经是对象，直接使用
        parsedResult = result as T;
      }
      
      this.log(`📂 已读取插件数据 ${key}:`, parsedResult);
      return parsedResult;
    } catch (error) {
      this.warn(`无法读取插件数据 ${key}，尝试从localStorage读取:`, error);
      return this.getFromLocalStorage(key, defaultValue);
    }
  }

  /**
   * 删除插件数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async removeConfig(key: string, pluginName: string = 'orca-tabs-plugin'): Promise<boolean> {
    try {
      await orca.plugins.removeData(pluginName, key);
      this.log(`🗑️ 已删除插件数据 ${key}`);
      return true;
    } catch (error) {
      this.warn(`无法删除插件数据 ${key}，尝试从localStorage删除:`, error);
      return this.removeFromLocalStorage(key);
    }
  }

  /**
   * 降级到localStorage保存
   */
  private saveToLocalStorage(key: string, data: any): boolean {
    try {
      const storageKey = this.getLocalStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(data));
      this.log(`💾 已降级保存到localStorage: ${storageKey}`);
      return true;
    } catch (error) {
      this.error(`无法保存到localStorage:`, error);
      return false;
    }
  }

  /**
   * 从localStorage读取
   */
  private getFromLocalStorage<T>(key: string, defaultValue?: T): T | null {
    try {
      const storageKey = this.getLocalStorageKey(key);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const result = JSON.parse(saved);
        this.log(`📂 已从localStorage读取: ${storageKey}`);
        return result;
      }
      return defaultValue || null;
    } catch (error) {
      this.error(`无法从localStorage读取:`, error);
      return defaultValue || null;
    }
  }

  /**
   * 从localStorage删除
   */
  private removeFromLocalStorage(key: string): boolean {
    try {
      const storageKey = this.getLocalStorageKey(key);
      localStorage.removeItem(storageKey);
      this.log(`🗑️ 已从localStorage删除: ${storageKey}`);
      return true;
    } catch (error) {
      this.error(`无法从localStorage删除:`, error);
      return false;
    }
  }

  /**
   * 获取localStorage键名
   */
  private getLocalStorageKey(key: string): string {
    const keyMap: Record<string, string> = {
      [PLUGIN_STORAGE_KEYS.FIRST_PANEL_TABS]: 'orca-first-panel-tabs-api',
      [PLUGIN_STORAGE_KEYS.CLOSED_TABS]: 'orca-closed-tabs-api',
      [PLUGIN_STORAGE_KEYS.FLOATING_WINDOW_VISIBLE]: 'orca-tabs-visible-api',
      [PLUGIN_STORAGE_KEYS.TABS_POSITION]: 'orca-tabs-position-api',
      [PLUGIN_STORAGE_KEYS.LAYOUT_MODE]: 'orca-tabs-layout-api',
    };
    return keyMap[key] || `orca-plugin-storage-${key}`;
  }

  /**
   * 测试API配置的序列化和反序列化
   */
  async testConfigSerialization(): Promise<void> {
    try {
      this.log("🧪 开始测试API配置序列化...");
      
      // 测试简单数据类型
      const testString = "test string";
      await this.saveConfig('test-string', testString);
      const retrievedString = await this.getConfig<string>('test-string', 'orca-tabs-plugin');
      this.log(`字符串测试: ${testString === retrievedString ? '✅' : '❌'}`);
      
      // 测试复杂对象
      const testObject = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig('test-object', testObject);
      const retrievedObject = await this.getConfig<typeof testObject>('test-object', 'orca-tabs-plugin');
      this.log(`对象测试: ${JSON.stringify(testObject) === JSON.stringify(retrievedObject) ? '✅' : '❌'}`);
      
      // 测试数组
      const testArray = [1, 2, 3, { nested: true }];
      await this.saveConfig('test-array', testArray);
      const retrievedArray = await this.getConfig<typeof testArray>('test-array', 'orca-tabs-plugin');
      this.log(`数组测试: ${JSON.stringify(testArray) === JSON.stringify(retrievedArray) ? '✅' : '❌'}`);
      
      // 清理测试数据
      await this.removeConfig('test-string');
      await this.removeConfig('test-object');
      await this.removeConfig('test-array');
      
      this.log("🧪 API配置序列化测试完成");
    } catch (error) {
      this.error("API配置序列化测试失败:", error);
    }
  }
}
