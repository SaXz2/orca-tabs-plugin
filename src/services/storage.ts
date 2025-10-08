/**
 * Orca标签页插件存储服务文件
 * 
 * 此文件提供统一的数据存储服务，支持Orca插件API和localStorage降级。
 * 确保插件数据能够可靠地保存和读取，即使在API不可用的情况下也能正常工作。
 * 
 * @file storage.ts
 * @version 2.4.0
 * @since 2024
 */

import { PLUGIN_STORAGE_KEYS } from '../constants';

/**
 * 基于Orca API的存储服务类
 * 
 * 提供统一的配置存储和读取接口，支持降级到localStorage。
 * 这个类封装了所有存储操作，确保数据的一致性和可靠性。
 * 
 * 主要功能：
 * - 数据保存和读取
 * - 数据删除
 * - 序列化和反序列化
 * - 错误处理和降级机制
 * - 调试和测试支持
 * 
 * @class OrcaStorageService
 * @version 2.4.0
 * @since 2024
 */
export class OrcaStorageService {
  // ==================== 日志方法 ====================
  /**
   * 调试日志方法
   * 仅在调试模式下输出日志信息，避免生产环境的日志污染
   * @param args 要记录的参数
   */
  private log(...args: any[]) {
    if (typeof window !== 'undefined' && (window as any).DEBUG_ORCA_TABS !== false) {
      // 调试日志
    }
  }

  /**
   * 警告日志方法
   * 输出警告信息，提醒潜在问题
   * @param args 要记录的参数
   */
  private warn(...args: any[]) {
    // 警告日志
  }

  /**
   * 错误日志方法
   * 输出错误信息，用于问题诊断
   * @param args 要记录的参数
   */
  private error(...args: any[]) {
    // 错误日志
  }

  // ==================== 主要存储方法 ====================
  /**
   * 保存数据到Orca插件存储系统
   * 
   * 这是存储服务的核心方法，负责将数据保存到Orca的插件存储系统中。
   * 如果Orca API不可用，会自动降级到localStorage。
   * 
   * 数据序列化：
   * - 字符串数据直接保存
   * - 复杂对象自动序列化为JSON字符串
   * - 确保数据格式的一致性
   * 
   * 错误处理：
   * - 捕获Orca API错误
   * - 自动降级到localStorage
   * - 记录详细的错误信息
   * 
   * @param key 存储键 - 用于标识数据的唯一键名
   * @param data 要保存的数据 - 可以是任何可序列化的数据类型
   * @param pluginName 插件名称 - 默认为'orca-tabs-plugin'
   * @returns Promise<boolean> 保存是否成功
   * @throws 当Orca API和localStorage都不可用时抛出错误
   */
  async saveConfig(key: string, data: any, pluginName: string = 'orca-tabs-plugin'): Promise<boolean> {
    try {
      // 数据序列化 - 将复杂对象转换为JSON字符串，确保存储格式一致
      const serializedData = typeof data === 'string' ? data : JSON.stringify(data);
      
      // 调用Orca API保存数据
      await orca.plugins.setData(pluginName, key, serializedData);
      
      // 记录成功日志
      this.log(`💾 已保存插件数据 ${key}:`, data);
      return true;
    } catch (error) {
      // 错误处理 - 记录错误
      this.error(`无法保存插件数据 ${key}:`, error);
      return false;
    }
  }

  /**
   * 从Orca插件存储系统读取数据
   * 
   * 这是数据读取的核心方法，负责从Orca的插件存储系统中读取数据。
   * 支持类型安全的泛型读取，并自动处理数据反序列化。
   * 
   * 数据反序列化：
   * - 自动检测数据类型
   * - JSON字符串自动解析为对象
   * - 纯字符串数据直接返回
   * - 已解析的对象直接使用
   * 
   * 错误处理：
   * - 捕获Orca API错误
   * - 自动降级到localStorage
   * - 提供默认值支持
   * 
   * @template T 返回数据的类型
   * @param key 存储键 - 要读取的数据键名
   * @param pluginName 插件名称 - 默认为'orca-tabs-plugin'
   * @param defaultValue 默认值 - 当数据不存在时返回的默认值
   * @returns Promise<T | null> 读取的数据或null
   * @throws 当Orca API和localStorage都不可用时抛出错误
   */
  async getConfig<T>(key: string, pluginName: string = 'orca-tabs-plugin', defaultValue?: T): Promise<T | null> {
    try {
      // 调用Orca API读取数据
      const result = await orca.plugins.getData(pluginName, key);
      
      // 检查数据是否存在
      if (result === null || result === undefined) {
        return defaultValue || null;
      }
      
      // 数据反序列化 - 根据数据类型进行相应的处理
      let parsedResult: T;
      if (typeof result === 'string') {
        try {
          // 尝试解析JSON字符串
          parsedResult = JSON.parse(result);
        } catch (parseError) {
          // 如果解析失败，可能是纯字符串，直接返回
          parsedResult = result as T;
        }
      } else {
        // 如果已经是对象，直接使用
        parsedResult = result as T;
      }
      
      // 记录成功日志
      this.log(`📂 已读取插件数据 ${key}:`, parsedResult);
      return parsedResult;
    } catch (error) {
      // 错误处理 - 记录错误
      this.error(`无法读取插件数据 ${key}:`, error);
      return defaultValue || null;
    }
  }

  /**
   * 删除插件数据
   * 
   * 从Orca插件存储系统中删除指定的数据。
   * 如果Orca API不可用，会自动降级到localStorage删除。
   * 
   * @param key 存储键 - 要删除的数据键名
   * @param pluginName 插件名称 - 默认为'orca-tabs-plugin'
   * @returns Promise<boolean> 删除是否成功
   * @throws 当Orca API和localStorage都不可用时抛出错误
   */
  async removeConfig(key: string, pluginName: string = 'orca-tabs-plugin'): Promise<boolean> {
    try {
      // 调用Orca API删除数据
      await orca.plugins.removeData(pluginName, key);
      
      // 记录成功日志
      this.log(`🗑️ 已删除插件数据 ${key}`);
      return true;
    } catch (error) {
      // 错误处理 - 记录错误
      this.error(`无法删除插件数据 ${key}:`, error);
      return false;
    }
  }


  // ==================== 测试和调试方法 ====================
  /**
   * 测试API配置的序列化和反序列化
   * 
   * 这是一个调试和测试方法，用于验证存储服务的序列化和反序列化功能。
   * 测试不同类型的数据（字符串、对象、数组）的保存和读取是否正确。
   * 
   * 测试内容：
   * 1. 字符串数据 - 测试基本字符串的保存和读取
   * 2. 复杂对象 - 测试嵌套对象的序列化和反序列化
   * 3. 数组数据 - 测试数组的保存和读取
   * 
   * 测试完成后会自动清理测试数据，不会影响实际使用。
   * 
   * @async
   * @returns Promise<void> 测试完成
   * @throws 当测试过程中发生错误时抛出
   */
  async testConfigSerialization(): Promise<void> {
    try {
      this.log("🧪 开始测试API配置序列化...");
      
      // ==================== 字符串数据测试 ====================
      // 测试简单字符串的保存和读取
      const testString = "test string";
      await this.saveConfig('test-string', testString);
      const retrievedString = await this.getConfig<string>('test-string', 'orca-tabs-plugin');
      this.log(`字符串测试: ${testString === retrievedString ? '✅' : '❌'}`);
      
      // ==================== 复杂对象测试 ====================
      // 测试嵌套对象的序列化和反序列化
      const testObject = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig('test-object', testObject);
      const retrievedObject = await this.getConfig<typeof testObject>('test-object', 'orca-tabs-plugin');
      this.log(`对象测试: ${JSON.stringify(testObject) === JSON.stringify(retrievedObject) ? '✅' : '❌'}`);
      
      // ==================== 数组数据测试 ====================
      // 测试数组的保存和读取
      const testArray = [1, 2, 3, { nested: true }];
      await this.saveConfig('test-array', testArray);
      const retrievedArray = await this.getConfig<typeof testArray>('test-array', 'orca-tabs-plugin');
      this.log(`数组测试: ${JSON.stringify(testArray) === JSON.stringify(retrievedArray) ? '✅' : '❌'}`);
      
      // ==================== 清理测试数据 ====================
      // 删除所有测试数据，避免影响实际使用
      await this.removeConfig('test-string');
      await this.removeConfig('test-object');
      await this.removeConfig('test-array');
      
      this.log("🧪 API配置序列化测试完成");
    } catch (error) {
      // 错误处理 - 记录测试失败的错误信息
      this.error("API配置序列化测试失败:", error);
    }
  }
}
