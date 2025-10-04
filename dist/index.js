var Se = Object.defineProperty;
var Ee = (o, e, t) => e in o ? Se(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var b = (o, e, t) => Ee(o, typeof e != "symbol" ? e + "" : e, t);
const me = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, be = {
  /** JSON数据类型 - 用于存储结构化数据 */
  JSON: 0,
  /** 文本数据类型 - 用于存储纯文本数据 */
  Text: 1
}, T = {
  /** 第一个面板的标签数据 - 存储第一个面板的标签页信息（向后兼容） */
  FIRST_PANEL_TABS: "first-panel-tabs",
  /** 第二个面板的标签数据 - 存储第二个面板的标签页信息（已废弃） */
  SECOND_PANEL_TABS: "second-panel-tabs",
  /** 已关闭标签列表 - 存储已关闭标签页的ID集合，用于避免重复创建 */
  CLOSED_TABS: "closed-tabs",
  /** 最近关闭的标签页列表 - 存储最近关闭的标签页详细信息，支持恢复功能 */
  RECENTLY_CLOSED_TABS: "recently-closed-tabs",
  /** 保存的多标签页集合 - 存储用户保存的标签页组合，支持快速切换 */
  SAVED_TAB_SETS: "saved-tab-sets",
  /** 工作区列表 - 存储用户创建的所有工作区信息 */
  WORKSPACES: "workspaces",
  /** 当前工作区 - 存储当前激活的工作区ID */
  CURRENT_WORKSPACE: "current-workspace",
  /** 启用工作区功能 - 存储工作区功能的开关状态 */
  ENABLE_WORKSPACES: "enable-workspaces",
  /** 浮窗可见状态 - 存储标签页容器的显示/隐藏状态 */
  FLOATING_WINDOW_VISIBLE: "floating-window-visible",
  /** 标签位置 - 存储标签页容器的屏幕坐标位置 */
  TABS_POSITION: "tabs-position",
  /** 布局模式 - 存储用户选择的布局模式（水平/垂直） */
  LAYOUT_MODE: "layout-mode",
  /** 固定到顶部状态 - 存储标签页容器是否固定到顶部的状态 */
  FIXED_TO_TOP: "fixed-to-top",
  /** 调试模式 - 存储是否启用详细日志输出 */
  DEBUG_MODE: "debug-mode",
  /** 刷新后恢复聚焦标签页 - 存储是否在软件刷新后自动聚焦并打开当前聚焦的标签页 */
  RESTORE_FOCUSED_TAB: "restore-focused-tab"
};
class Pe {
  // ==================== 日志方法 ====================
  /**
   * 调试日志方法
   * 仅在调试模式下输出日志信息，避免生产环境的日志污染
   * @param args 要记录的参数
   */
  log(...e) {
  }
  /**
   * 警告日志方法
   * 输出警告信息，提醒潜在问题
   * @param args 要记录的参数
   */
  warn(...e) {
  }
  /**
   * 错误日志方法
   * 输出错误信息，用于问题诊断
   * @param args 要记录的参数
   */
  error(...e) {
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
  async saveConfig(e, t, a = "orca-tabs-plugin") {
    try {
      const r = typeof t == "string" ? t : JSON.stringify(t);
      return await orca.plugins.setData(a, e, r), this.log(`💾 已保存插件数据 ${e}:`, t), !0;
    } catch (r) {
      return this.warn(`无法保存插件数据 ${e}，尝试降级到localStorage:`, r), this.saveToLocalStorage(e, t);
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
  async getConfig(e, t = "orca-tabs-plugin", a) {
    try {
      const r = await orca.plugins.getData(t, e);
      if (r == null)
        return a || null;
      let i;
      if (typeof r == "string")
        try {
          i = JSON.parse(r);
        } catch {
          i = r;
        }
      else
        i = r;
      return this.log(`📂 已读取插件数据 ${e}:`, i), i;
    } catch (r) {
      return this.warn(`无法读取插件数据 ${e}，尝试从localStorage读取:`, r), this.getFromLocalStorage(e, a);
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
  async removeConfig(e, t = "orca-tabs-plugin") {
    try {
      return await orca.plugins.removeData(t, e), this.log(`🗑️ 已删除插件数据 ${e}`), !0;
    } catch (a) {
      return this.warn(`无法删除插件数据 ${e}，尝试从localStorage删除:`, a), this.removeFromLocalStorage(e);
    }
  }
  // ==================== localStorage降级方法 ====================
  /**
   * 降级到localStorage保存
   * 
   * 当Orca API不可用时，使用localStorage作为备用存储方案。
   * 确保插件在API不可用的情况下仍能正常工作。
   * 
   * @param key 存储键 - 要保存的数据键名
   * @param data 要保存的数据 - 会被序列化为JSON字符串
   * @returns boolean 保存是否成功
   */
  saveToLocalStorage(e, t) {
    try {
      const a = this.getLocalStorageKey(e);
      return localStorage.setItem(a, JSON.stringify(t)), this.log(`💾 已降级保存到localStorage: ${a}`), !0;
    } catch (a) {
      return this.error("无法保存到localStorage:", a), !1;
    }
  }
  /**
   * 从localStorage读取数据
   * 
   * 从localStorage中读取数据并反序列化。
   * 支持默认值，当数据不存在时返回指定的默认值。
   * 
   * @template T 返回数据的类型
   * @param key 存储键 - 要读取的数据键名
   * @param defaultValue 默认值 - 当数据不存在时返回的默认值
   * @returns T | null 读取的数据或默认值或null
   */
  getFromLocalStorage(e, t) {
    try {
      const a = this.getLocalStorageKey(e), r = localStorage.getItem(a);
      if (r) {
        const i = JSON.parse(r);
        return this.log(`📂 已从localStorage读取: ${a}`), i;
      }
      return t || null;
    } catch (a) {
      return this.error("无法从localStorage读取:", a), t || null;
    }
  }
  /**
   * 从localStorage删除数据
   * 
   * 从localStorage中删除指定的数据。
   * 
   * @param key 存储键 - 要删除的数据键名
   * @returns boolean 删除是否成功
   */
  removeFromLocalStorage(e) {
    try {
      const t = this.getLocalStorageKey(e);
      return localStorage.removeItem(t), this.log(`🗑️ 已从localStorage删除: ${t}`), !0;
    } catch (t) {
      return this.error("无法从localStorage删除:", t), !1;
    }
  }
  // ==================== 工具方法 ====================
  /**
   * 获取localStorage键名
   * 
   * 将插件存储键映射为localStorage中使用的键名。
   * 这确保了localStorage键名的唯一性和一致性。
   * 
   * 键名映射规则：
   * - 使用预定义的映射表确保键名一致性
   * - 添加'orca-'前缀避免与其他插件冲突
   * - 添加'-api'后缀标识这是API降级存储
   * - 未映射的键名使用默认格式
   * 
   * @param key 插件存储键 - 来自PLUGIN_STORAGE_KEYS的键名
   * @returns string localStorage中使用的键名
   */
  getLocalStorageKey(e) {
    return {
      [T.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [T.SECOND_PANEL_TABS]: "orca-second-panel-tabs-api",
      [T.CLOSED_TABS]: "orca-closed-tabs-api",
      [T.RECENTLY_CLOSED_TABS]: "orca-recently-closed-tabs-api",
      [T.SAVED_TAB_SETS]: "orca-saved-tab-sets-api",
      [T.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [T.TABS_POSITION]: "orca-tabs-position-api",
      [T.LAYOUT_MODE]: "orca-tabs-layout-api",
      [T.FIXED_TO_TOP]: "orca-tabs-fixed-to-top-api"
    }[e] || `orca-plugin-storage-${e}`;
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
  async testConfigSerialization() {
    try {
      this.log("🧪 开始测试API配置序列化...");
      const e = "test string";
      await this.saveConfig("test-string", e);
      const t = await this.getConfig("test-string", "orca-tabs-plugin");
      this.log(`字符串测试: ${e === t ? "✅" : "❌"}`);
      const a = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", a);
      const r = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(a) === JSON.stringify(r) ? "✅" : "❌"}`);
      const i = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", i);
      const n = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(i) === JSON.stringify(n) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
function W() {
  return {
    isVerticalMode: !1,
    verticalWidth: 200,
    verticalPosition: { x: 20, y: 20 },
    horizontalPosition: { x: 20, y: 20 },
    isSidebarAlignmentEnabled: !1,
    isFloatingWindowVisible: !0,
    showBlockTypeIcons: !0,
    showInHeadbar: !0
  };
}
function Ie(o, e, t = 200) {
  const a = e ? t : 400, r = 40, i = window.innerWidth - a, n = window.innerHeight - r;
  return {
    x: Math.max(0, Math.min(o.x, i)),
    y: Math.max(0, Math.min(o.y, n))
  };
}
function $e(o) {
  const e = W();
  return {
    isVerticalMode: o.isVerticalMode ?? e.isVerticalMode,
    verticalWidth: o.verticalWidth ?? e.verticalWidth,
    verticalPosition: o.verticalPosition ?? e.verticalPosition,
    horizontalPosition: o.horizontalPosition ?? e.horizontalPosition,
    isSidebarAlignmentEnabled: o.isSidebarAlignmentEnabled ?? e.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: o.isFloatingWindowVisible ?? e.isFloatingWindowVisible,
    showBlockTypeIcons: o.showBlockTypeIcons ?? e.showBlockTypeIcons,
    showInHeadbar: o.showInHeadbar ?? e.showInHeadbar
  };
}
function Q(o, e, t) {
  return o ? { ...e } : { ...t };
}
function Me(o, e, t, a) {
  return e ? {
    verticalPosition: { ...o },
    horizontalPosition: { ...a }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...o }
  };
}
function Le(o) {
  return `布局模式: ${o.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${o.verticalWidth}px, 垂直位置: (${o.verticalPosition.x}, ${o.verticalPosition.y}), 水平位置: (${o.horizontalPosition.x}, ${o.horizontalPosition.y})`;
}
function fe(o, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${o.x}, ${o.y})`;
}
class De {
  constructor(e, t, a) {
    b(this, "storageService");
    b(this, "pluginName");
    b(this, "log");
    b(this, "warn");
    b(this, "error");
    b(this, "verboseLog");
    this.storageService = e, this.pluginName = t, this.log = a.log, this.warn = a.warn, this.error = a.error, this.verboseLog = a.verboseLog;
  }
  // ==================== 标签页数据存储 ====================
  /**
   * 保存第一个面板的标签数据到持久化存储
   */
  async saveFirstPanelTabs(e) {
    try {
      await this.storageService.saveConfig(T.FIRST_PANEL_TABS, e, this.pluginName), this.log(`💾 保存第一个面板的 ${e.length} 个标签页数据到API配置`);
    } catch (t) {
      this.warn("无法保存第一个面板标签数据:", t);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(T.FIRST_PANEL_TABS, this.pluginName, []);
      return e && Array.isArray(e) ? (this.log(`📂 从API配置恢复了第一个面板的 ${e.length} 个标签页`), e) : (this.log("📂 没有找到第一个面板的持久化标签数据，返回空数组"), []);
    } catch (e) {
      return this.warn("无法恢复第一个面板标签数据:", e), [];
    }
  }
  /**
   * 保存指定面板的标签页数据
   */
  async savePanelTabs(e, t) {
    try {
      await this.storageService.saveConfig(`panel_${e}_tabs`, t, this.pluginName), this.verboseLog(`💾 已保存面板 ${e} 的标签页数据: ${t.length} 个`);
    } catch (a) {
      this.warn(`❌ 保存面板 ${e} 标签页数据失败:`, a);
    }
  }
  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(e, t) {
    try {
      await this.storageService.saveConfig(e, t, this.pluginName), this.verboseLog(`💾 已保存 ${e} 的标签页数据: ${t.length} 个`);
    } catch (a) {
      this.warn(`❌ 保存 ${e} 标签页数据失败:`, a);
    }
  }
  /**
   * 从存储键恢复面板标签页数据
   */
  async restorePanelTabsByKey(e) {
    try {
      const t = await this.storageService.getConfig(e, this.pluginName, []);
      return t && Array.isArray(t) ? (this.verboseLog(`📂 从 ${e} 恢复了 ${t.length} 个标签页`), t) : [];
    } catch (t) {
      return this.warn(`❌ 恢复 ${e} 标签页数据失败:`, t), [];
    }
  }
  // ==================== 已关闭标签页管理 ====================
  /**
   * 保存已关闭标签列表到持久化存储
   */
  async saveClosedTabs(e) {
    try {
      await this.storageService.saveConfig(T.CLOSED_TABS, Array.from(e), this.pluginName), this.log("💾 保存已关闭标签列表到API配置");
    } catch (t) {
      this.warn("无法保存已关闭标签列表:", t);
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  async restoreClosedTabs() {
    try {
      const e = await this.storageService.getConfig(T.CLOSED_TABS, this.pluginName, []);
      if (e && Array.isArray(e)) {
        const t = new Set(e);
        return this.log(`📂 从API配置恢复了 ${t.size} 个已关闭标签`), t;
      } else
        return this.log("📂 没有找到持久化的已关闭标签数据，返回空集合"), /* @__PURE__ */ new Set();
    } catch (e) {
      return this.warn("无法恢复已关闭标签列表:", e), /* @__PURE__ */ new Set();
    }
  }
  // ==================== 最近关闭标签页管理 ====================
  /**
   * 保存最近关闭的标签页列表到持久化存储
   */
  async saveRecentlyClosedTabs(e) {
    try {
      await this.storageService.saveConfig(T.RECENTLY_CLOSED_TABS, e, this.pluginName), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (t) {
      this.warn("无法保存最近关闭标签页列表:", t);
    }
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表
   */
  async restoreRecentlyClosedTabs() {
    try {
      const e = await this.storageService.getConfig(T.RECENTLY_CLOSED_TABS, this.pluginName, []);
      return e && Array.isArray(e) ? (this.log(`📂 从API配置恢复了 ${e.length} 个最近关闭的标签页`), e) : (this.log("📂 没有找到最近关闭标签页数据，返回空数组"), []);
    } catch (e) {
      return this.warn("无法恢复最近关闭标签页列表:", e), [];
    }
  }
  // ==================== 标签页集合管理 ====================
  /**
   * 保存多标签页集合到持久化存储
   */
  async saveSavedTabSets(e) {
    try {
      await this.storageService.saveConfig(T.SAVED_TAB_SETS, e, this.pluginName), this.log("💾 保存多标签页集合到API配置");
    } catch (t) {
      this.warn("无法保存多标签页集合:", t);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(T.SAVED_TAB_SETS, this.pluginName, []);
      return e && Array.isArray(e) ? (this.log(`📂 从API配置恢复了 ${e.length} 个多标签页集合`), e) : (this.log("📂 没有找到多标签页集合数据，返回空数组"), []);
    } catch (e) {
      return this.warn("无法恢复多标签页集合:", e), [];
    }
  }
  // ==================== 工作区管理 ====================
  /**
   * 加载工作区数据
   */
  async loadWorkspaces() {
    try {
      const e = await this.storageService.getConfig(T.WORKSPACES), t = e && Array.isArray(e) ? e : [], a = await this.storageService.getConfig(T.ENABLE_WORKSPACES), r = typeof a == "boolean" ? a : !1;
      return this.log(`📁 已加载 ${t.length} 个工作区`), { workspaces: t, enableWorkspaces: r };
    } catch (e) {
      return this.error("加载工作区数据失败:", e), { workspaces: [], enableWorkspaces: !1 };
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces(e, t, a) {
    try {
      await this.storageService.saveConfig(T.WORKSPACES, e, this.pluginName), await this.storageService.saveConfig(T.CURRENT_WORKSPACE, t, this.pluginName), await this.storageService.saveConfig(T.ENABLE_WORKSPACES, a, this.pluginName), this.log("💾 工作区数据已保存");
    } catch (r) {
      this.error("保存工作区数据失败:", r);
    }
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    try {
      await this.storageService.saveConfig(T.CURRENT_WORKSPACE, null, this.pluginName), this.log("📁 已清除当前工作区状态");
    } catch (e) {
      this.error("清除当前工作区状态失败:", e);
    }
  }
  // ==================== 位置和布局配置 ====================
  /**
   * 保存位置信息
   */
  async savePosition(e, t, a, r) {
    try {
      const i = Me(
        e,
        t,
        a,
        r
      );
      return await this.saveLayoutMode({
        isVerticalMode: t,
        verticalWidth: 0,
        // 这个值需要从外部传入
        verticalPosition: i.verticalPosition,
        horizontalPosition: i.horizontalPosition,
        isSidebarAlignmentEnabled: !1,
        // 这些值需要从外部传入
        isFloatingWindowVisible: !1,
        showBlockTypeIcons: !1,
        showInHeadbar: !1
      }), this.log(`💾 位置已保存: ${fe(e, t)}`), i;
    } catch {
      return this.warn("无法保存标签位置"), { verticalPosition: a, horizontalPosition: r };
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(e) {
    try {
      await this.storageService.saveConfig(T.LAYOUT_MODE, e, this.pluginName), this.log(`💾 布局模式已保存: ${e.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${e.verticalWidth}px, 垂直位置: (${e.verticalPosition.x}, ${e.verticalPosition.y}), 水平位置: (${e.horizontalPosition.x}, ${e.horizontalPosition.y})`);
    } catch (t) {
      this.error("保存布局模式失败:", t);
    }
  }
  /**
   * 恢复布局模式配置
   */
  async restoreLayoutMode() {
    try {
      const e = await this.storageService.getConfig(
        T.LAYOUT_MODE,
        this.pluginName,
        W()
      ), t = {
        ...W(),
        ...e
      };
      return this.log(`📂 恢复布局模式配置: ${t.isVerticalMode ? "垂直" : "水平"}`), t;
    } catch (e) {
      return this.warn("恢复布局模式配置失败:", e), W();
    }
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode(e) {
    try {
      const t = { isFixedToTop: e };
      await this.storageService.saveConfig(T.FIXED_TO_TOP, t, this.pluginName), this.log(`💾 固定到顶部状态已保存: ${e ? "启用" : "禁用"}`);
    } catch (t) {
      this.error("保存固定到顶部状态失败:", t);
    }
  }
  /**
   * 恢复固定到顶部状态
   */
  async restoreFixedToTopMode() {
    try {
      const e = await this.storageService.getConfig(
        T.FIXED_TO_TOP,
        this.pluginName,
        { isFixedToTop: !1 }
      ), t = (e == null ? void 0 : e.isFixedToTop) || !1;
      return this.log(`📂 恢复固定到顶部状态: ${t ? "启用" : "禁用"}`), t;
    } catch (e) {
      return this.warn("恢复固定到顶部状态失败:", e), !1;
    }
  }
  /**
   * 保存浮窗可见状态
   */
  async saveFloatingWindowVisible(e) {
    try {
      await this.storageService.saveConfig(T.FLOATING_WINDOW_VISIBLE, e, this.pluginName), this.log(`💾 浮窗可见状态已保存: ${e ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("保存浮窗可见状态失败:", t);
    }
  }
  /**
   * 恢复浮窗可见状态
   */
  async restoreFloatingWindowVisible() {
    try {
      const t = await this.storageService.getConfig(T.FLOATING_WINDOW_VISIBLE, this.pluginName, !1) || !1;
      return this.log(`📱 恢复浮窗可见状态: ${t ? "显示" : "隐藏"}`), t;
    } catch (e) {
      return this.error("恢复浮窗可见状态失败:", e), !1;
    }
  }
  // ==================== 缓存清理 ====================
  /**
   * 删除API配置缓存
   */
  async clearCache() {
    try {
      await this.storageService.removeConfig(T.FIRST_PANEL_TABS), await this.storageService.removeConfig(T.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
    } catch (e) {
      this.warn("删除API配置缓存失败:", e);
    }
  }
  // ==================== 工具方法 ====================
  /**
   * 简单的字符串哈希函数
   */
  hashString(e) {
    let t = 0;
    for (let a = 0; a < e.length; a++) {
      const r = e.charCodeAt(a);
      t = (t << 5) - t + r, t = t & t;
    }
    return Math.abs(t).toString(36);
  }
}
const ve = 6048e5, Ae = 864e5, se = Symbol.for("constructDateFrom");
function I(o, e) {
  return typeof o == "function" ? o(e) : o && typeof o == "object" && se in o ? o[se](e) : o instanceof Date ? new o.constructor(e) : new Date(e);
}
function $(o, e) {
  return I(e || o, o);
}
function ye(o, e, t) {
  const a = $(o, t == null ? void 0 : t.in);
  return isNaN(e) ? I(o, NaN) : (e && a.setDate(a.getDate() + e), a);
}
let Oe = {};
function K() {
  return Oe;
}
function j(o, e) {
  var s, c, l, d;
  const t = K(), a = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (s = e == null ? void 0 : e.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, r = $(o, e == null ? void 0 : e.in), i = r.getDay(), n = (i < a ? 7 : 0) + i - a;
  return r.setDate(r.getDate() - n), r.setHours(0, 0, 0, 0), r;
}
function G(o, e) {
  return j(o, { ...e, weekStartsOn: 1 });
}
function xe(o, e) {
  const t = $(o, e == null ? void 0 : e.in), a = t.getFullYear(), r = I(t, 0);
  r.setFullYear(a + 1, 0, 4), r.setHours(0, 0, 0, 0);
  const i = G(r), n = I(t, 0);
  n.setFullYear(a, 0, 4), n.setHours(0, 0, 0, 0);
  const s = G(n);
  return t.getTime() >= i.getTime() ? a + 1 : t.getTime() >= s.getTime() ? a : a - 1;
}
function ce(o) {
  const e = $(o), t = new Date(
    Date.UTC(
      e.getFullYear(),
      e.getMonth(),
      e.getDate(),
      e.getHours(),
      e.getMinutes(),
      e.getSeconds(),
      e.getMilliseconds()
    )
  );
  return t.setUTCFullYear(e.getFullYear()), +o - +t;
}
function Te(o, ...e) {
  const t = I.bind(
    null,
    e.find((a) => typeof a == "object")
  );
  return e.map(t);
}
function X(o, e) {
  const t = $(o, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function Be(o, e, t) {
  const [a, r] = Te(
    t == null ? void 0 : t.in,
    o,
    e
  ), i = X(a), n = X(r), s = +i - ce(i), c = +n - ce(n);
  return Math.round((s - c) / Ae);
}
function ze(o, e) {
  const t = xe(o, e), a = I(o, 0);
  return a.setFullYear(t, 0, 4), a.setHours(0, 0, 0, 0), G(a);
}
function ne(o) {
  return I(o, Date.now());
}
function oe(o, e, t) {
  const [a, r] = Te(
    t == null ? void 0 : t.in,
    o,
    e
  );
  return +X(a) == +X(r);
}
function We(o) {
  return o instanceof Date || typeof o == "object" && Object.prototype.toString.call(o) === "[object Date]";
}
function Ne(o) {
  return !(!We(o) && typeof o != "number" || isNaN(+$(o)));
}
function Re(o, e) {
  const t = $(o, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const Fe = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
}, qe = (o, e, t) => {
  let a;
  const r = Fe[o];
  return typeof r == "string" ? a = r : e === 1 ? a = r.one : a = r.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + a : a + " ago" : a;
};
function Z(o) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : o.defaultWidth;
    return o.formats[t] || o.formats[o.defaultWidth];
  };
}
const Ue = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, _e = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, He = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ve = {
  date: Z({
    formats: Ue,
    defaultWidth: "full"
  }),
  time: Z({
    formats: _e,
    defaultWidth: "full"
  }),
  dateTime: Z({
    formats: He,
    defaultWidth: "full"
  })
}, je = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ye = (o, e, t, a) => je[o];
function q(o) {
  return (e, t) => {
    const a = t != null && t.context ? String(t.context) : "standalone";
    let r;
    if (a === "formatting" && o.formattingValues) {
      const n = o.defaultFormattingWidth || o.defaultWidth, s = t != null && t.width ? String(t.width) : n;
      r = o.formattingValues[s] || o.formattingValues[n];
    } else {
      const n = o.defaultWidth, s = t != null && t.width ? String(t.width) : o.defaultWidth;
      r = o.values[s] || o.values[n];
    }
    const i = o.argumentCallback ? o.argumentCallback(e) : e;
    return r[i];
  };
}
const Qe = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Ge = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Xe = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
}, Ke = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
}, Je = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
}, Ze = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
}, et = (o, e) => {
  const t = Number(o), a = t % 100;
  if (a > 20 || a < 10)
    switch (a % 10) {
      case 1:
        return t + "st";
      case 2:
        return t + "nd";
      case 3:
        return t + "rd";
    }
  return t + "th";
}, tt = {
  ordinalNumber: et,
  era: q({
    values: Qe,
    defaultWidth: "wide"
  }),
  quarter: q({
    values: Ge,
    defaultWidth: "wide",
    argumentCallback: (o) => o - 1
  }),
  month: q({
    values: Xe,
    defaultWidth: "wide"
  }),
  day: q({
    values: Ke,
    defaultWidth: "wide"
  }),
  dayPeriod: q({
    values: Je,
    defaultWidth: "wide",
    formattingValues: Ze,
    defaultFormattingWidth: "wide"
  })
};
function U(o) {
  return (e, t = {}) => {
    const a = t.width, r = a && o.matchPatterns[a] || o.matchPatterns[o.defaultMatchWidth], i = e.match(r);
    if (!i)
      return null;
    const n = i[0], s = a && o.parsePatterns[a] || o.parsePatterns[o.defaultParseWidth], c = Array.isArray(s) ? rt(s, (h) => h.test(n)) : (
      // [TODO] -- I challenge you to fix the type
      at(s, (h) => h.test(n))
    );
    let l;
    l = o.valueCallback ? o.valueCallback(c) : c, l = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(l)
    ) : l;
    const d = e.slice(n.length);
    return { value: l, rest: d };
  };
}
function at(o, e) {
  for (const t in o)
    if (Object.prototype.hasOwnProperty.call(o, t) && e(o[t]))
      return t;
}
function rt(o, e) {
  for (let t = 0; t < o.length; t++)
    if (e(o[t]))
      return t;
}
function it(o) {
  return (e, t = {}) => {
    const a = e.match(o.matchPattern);
    if (!a) return null;
    const r = a[0], i = e.match(o.parsePattern);
    if (!i) return null;
    let n = o.valueCallback ? o.valueCallback(i[0]) : i[0];
    n = t.valueCallback ? t.valueCallback(n) : n;
    const s = e.slice(r.length);
    return { value: n, rest: s };
  };
}
const nt = /^(\d+)(th|st|nd|rd)?/i, ot = /\d+/i, st = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, ct = {
  any: [/^b/i, /^(a|c)/i]
}, lt = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, dt = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, ut = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ht = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
}, pt = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, gt = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, mt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, bt = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
}, ft = {
  ordinalNumber: it({
    matchPattern: nt,
    parsePattern: ot,
    valueCallback: (o) => parseInt(o, 10)
  }),
  era: U({
    matchPatterns: st,
    defaultMatchWidth: "wide",
    parsePatterns: ct,
    defaultParseWidth: "any"
  }),
  quarter: U({
    matchPatterns: lt,
    defaultMatchWidth: "wide",
    parsePatterns: dt,
    defaultParseWidth: "any",
    valueCallback: (o) => o + 1
  }),
  month: U({
    matchPatterns: ut,
    defaultMatchWidth: "wide",
    parsePatterns: ht,
    defaultParseWidth: "any"
  }),
  day: U({
    matchPatterns: pt,
    defaultMatchWidth: "wide",
    parsePatterns: gt,
    defaultParseWidth: "any"
  }),
  dayPeriod: U({
    matchPatterns: mt,
    defaultMatchWidth: "any",
    parsePatterns: bt,
    defaultParseWidth: "any"
  })
}, vt = {
  code: "en-US",
  formatDistance: qe,
  formatLong: Ve,
  formatRelative: Ye,
  localize: tt,
  match: ft,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function yt(o, e) {
  const t = $(o, e == null ? void 0 : e.in);
  return Be(t, Re(t)) + 1;
}
function xt(o, e) {
  const t = $(o, e == null ? void 0 : e.in), a = +G(t) - +ze(t);
  return Math.round(a / ve) + 1;
}
function we(o, e) {
  var d, h, u, p;
  const t = $(o, e == null ? void 0 : e.in), a = t.getFullYear(), r = K(), i = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((h = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? r.firstWeekContainsDate ?? ((p = (u = r.locale) == null ? void 0 : u.options) == null ? void 0 : p.firstWeekContainsDate) ?? 1, n = I((e == null ? void 0 : e.in) || o, 0);
  n.setFullYear(a + 1, 0, i), n.setHours(0, 0, 0, 0);
  const s = j(n, e), c = I((e == null ? void 0 : e.in) || o, 0);
  c.setFullYear(a, 0, i), c.setHours(0, 0, 0, 0);
  const l = j(c, e);
  return +t >= +s ? a + 1 : +t >= +l ? a : a - 1;
}
function Tt(o, e) {
  var s, c, l, d;
  const t = K(), a = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((c = (s = e == null ? void 0 : e.locale) == null ? void 0 : s.options) == null ? void 0 : c.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, r = we(o, e), i = I((e == null ? void 0 : e.in) || o, 0);
  return i.setFullYear(r, 0, a), i.setHours(0, 0, 0, 0), j(i, e);
}
function wt(o, e) {
  const t = $(o, e == null ? void 0 : e.in), a = +j(t, e) - +Tt(t, e);
  return Math.round(a / ve) + 1;
}
function C(o, e) {
  const t = o < 0 ? "-" : "", a = Math.abs(o).toString().padStart(e, "0");
  return t + a;
}
const L = {
  // Year
  y(o, e) {
    const t = o.getFullYear(), a = t > 0 ? t : 1 - t;
    return C(e === "yy" ? a % 100 : a, e.length);
  },
  // Month
  M(o, e) {
    const t = o.getMonth();
    return e === "M" ? String(t + 1) : C(t + 1, 2);
  },
  // Day of the month
  d(o, e) {
    return C(o.getDate(), e.length);
  },
  // AM or PM
  a(o, e) {
    const t = o.getHours() / 12 >= 1 ? "pm" : "am";
    switch (e) {
      case "a":
      case "aa":
        return t.toUpperCase();
      case "aaa":
        return t;
      case "aaaaa":
        return t[0];
      case "aaaa":
      default:
        return t === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(o, e) {
    return C(o.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(o, e) {
    return C(o.getHours(), e.length);
  },
  // Minute
  m(o, e) {
    return C(o.getMinutes(), e.length);
  },
  // Second
  s(o, e) {
    return C(o.getSeconds(), e.length);
  },
  // Fraction of second
  S(o, e) {
    const t = e.length, a = o.getMilliseconds(), r = Math.trunc(
      a * Math.pow(10, t - 3)
    );
    return C(r, e.length);
  }
}, N = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, le = {
  // Era
  G: function(o, e, t) {
    const a = o.getFullYear() > 0 ? 1 : 0;
    switch (e) {
      case "G":
      case "GG":
      case "GGG":
        return t.era(a, { width: "abbreviated" });
      case "GGGGG":
        return t.era(a, { width: "narrow" });
      case "GGGG":
      default:
        return t.era(a, { width: "wide" });
    }
  },
  // Year
  y: function(o, e, t) {
    if (e === "yo") {
      const a = o.getFullYear(), r = a > 0 ? a : 1 - a;
      return t.ordinalNumber(r, { unit: "year" });
    }
    return L.y(o, e);
  },
  // Local week-numbering year
  Y: function(o, e, t, a) {
    const r = we(o, a), i = r > 0 ? r : 1 - r;
    if (e === "YY") {
      const n = i % 100;
      return C(n, 2);
    }
    return e === "Yo" ? t.ordinalNumber(i, { unit: "year" }) : C(i, e.length);
  },
  // ISO week-numbering year
  R: function(o, e) {
    const t = xe(o);
    return C(t, e.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function(o, e) {
    const t = o.getFullYear();
    return C(t, e.length);
  },
  // Quarter
  Q: function(o, e, t) {
    const a = Math.ceil((o.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(a);
      case "QQ":
        return C(a, 2);
      case "Qo":
        return t.ordinalNumber(a, { unit: "quarter" });
      case "QQQ":
        return t.quarter(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return t.quarter(a, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return t.quarter(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(o, e, t) {
    const a = Math.ceil((o.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(a);
      case "qq":
        return C(a, 2);
      case "qo":
        return t.ordinalNumber(a, { unit: "quarter" });
      case "qqq":
        return t.quarter(a, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return t.quarter(a, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return t.quarter(a, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(o, e, t) {
    const a = o.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return L.M(o, e);
      case "Mo":
        return t.ordinalNumber(a + 1, { unit: "month" });
      case "MMM":
        return t.month(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return t.month(a, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return t.month(a, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(o, e, t) {
    const a = o.getMonth();
    switch (e) {
      case "L":
        return String(a + 1);
      case "LL":
        return C(a + 1, 2);
      case "Lo":
        return t.ordinalNumber(a + 1, { unit: "month" });
      case "LLL":
        return t.month(a, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return t.month(a, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return t.month(a, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(o, e, t, a) {
    const r = wt(o, a);
    return e === "wo" ? t.ordinalNumber(r, { unit: "week" }) : C(r, e.length);
  },
  // ISO week of year
  I: function(o, e, t) {
    const a = xt(o);
    return e === "Io" ? t.ordinalNumber(a, { unit: "week" }) : C(a, e.length);
  },
  // Day of the month
  d: function(o, e, t) {
    return e === "do" ? t.ordinalNumber(o.getDate(), { unit: "date" }) : L.d(o, e);
  },
  // Day of year
  D: function(o, e, t) {
    const a = yt(o);
    return e === "Do" ? t.ordinalNumber(a, { unit: "dayOfYear" }) : C(a, e.length);
  },
  // Day of week
  E: function(o, e, t) {
    const a = o.getDay();
    switch (e) {
      case "E":
      case "EE":
      case "EEE":
        return t.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return t.day(a, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return t.day(a, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return t.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(o, e, t, a) {
    const r = o.getDay(), i = (r - a.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(i);
      case "ee":
        return C(i, 2);
      case "eo":
        return t.ordinalNumber(i, { unit: "day" });
      case "eee":
        return t.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return t.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return t.day(r, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return t.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(o, e, t, a) {
    const r = o.getDay(), i = (r - a.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(i);
      case "cc":
        return C(i, e.length);
      case "co":
        return t.ordinalNumber(i, { unit: "day" });
      case "ccc":
        return t.day(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return t.day(r, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return t.day(r, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return t.day(r, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(o, e, t) {
    const a = o.getDay(), r = a === 0 ? 7 : a;
    switch (e) {
      case "i":
        return String(r);
      case "ii":
        return C(r, e.length);
      case "io":
        return t.ordinalNumber(r, { unit: "day" });
      case "iii":
        return t.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return t.day(a, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return t.day(a, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return t.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(o, e, t) {
    const r = o.getHours() / 12 >= 1 ? "pm" : "am";
    switch (e) {
      case "a":
      case "aa":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return t.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return t.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(o, e, t) {
    const a = o.getHours();
    let r;
    switch (a === 12 ? r = N.noon : a === 0 ? r = N.midnight : r = a / 12 >= 1 ? "pm" : "am", e) {
      case "b":
      case "bb":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return t.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return t.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(o, e, t) {
    const a = o.getHours();
    let r;
    switch (a >= 17 ? r = N.evening : a >= 12 ? r = N.afternoon : a >= 4 ? r = N.morning : r = N.night, e) {
      case "B":
      case "BB":
      case "BBB":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return t.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return t.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(o, e, t) {
    if (e === "ho") {
      let a = o.getHours() % 12;
      return a === 0 && (a = 12), t.ordinalNumber(a, { unit: "hour" });
    }
    return L.h(o, e);
  },
  // Hour [0-23]
  H: function(o, e, t) {
    return e === "Ho" ? t.ordinalNumber(o.getHours(), { unit: "hour" }) : L.H(o, e);
  },
  // Hour [0-11]
  K: function(o, e, t) {
    const a = o.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(a, { unit: "hour" }) : C(a, e.length);
  },
  // Hour [1-24]
  k: function(o, e, t) {
    let a = o.getHours();
    return a === 0 && (a = 24), e === "ko" ? t.ordinalNumber(a, { unit: "hour" }) : C(a, e.length);
  },
  // Minute
  m: function(o, e, t) {
    return e === "mo" ? t.ordinalNumber(o.getMinutes(), { unit: "minute" }) : L.m(o, e);
  },
  // Second
  s: function(o, e, t) {
    return e === "so" ? t.ordinalNumber(o.getSeconds(), { unit: "second" }) : L.s(o, e);
  },
  // Fraction of second
  S: function(o, e) {
    return L.S(o, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(o, e, t) {
    const a = o.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (e) {
      case "X":
        return ue(a);
      case "XXXX":
      case "XX":
        return B(a);
      case "XXXXX":
      case "XXX":
      default:
        return B(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(o, e, t) {
    const a = o.getTimezoneOffset();
    switch (e) {
      case "x":
        return ue(a);
      case "xxxx":
      case "xx":
        return B(a);
      case "xxxxx":
      case "xxx":
      default:
        return B(a, ":");
    }
  },
  // Timezone (GMT)
  O: function(o, e, t) {
    const a = o.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + de(a, ":");
      case "OOOO":
      default:
        return "GMT" + B(a, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(o, e, t) {
    const a = o.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + de(a, ":");
      case "zzzz":
      default:
        return "GMT" + B(a, ":");
    }
  },
  // Seconds timestamp
  t: function(o, e, t) {
    const a = Math.trunc(+o / 1e3);
    return C(a, e.length);
  },
  // Milliseconds timestamp
  T: function(o, e, t) {
    return C(+o, e.length);
  }
};
function de(o, e = "") {
  const t = o > 0 ? "-" : "+", a = Math.abs(o), r = Math.trunc(a / 60), i = a % 60;
  return i === 0 ? t + String(r) : t + String(r) + e + C(i, 2);
}
function ue(o, e) {
  return o % 60 === 0 ? (o > 0 ? "-" : "+") + C(Math.abs(o) / 60, 2) : B(o, e);
}
function B(o, e = "") {
  const t = o > 0 ? "-" : "+", a = Math.abs(o), r = C(Math.trunc(a / 60), 2), i = C(a % 60, 2);
  return t + r + e + i;
}
const he = (o, e) => {
  switch (o) {
    case "P":
      return e.date({ width: "short" });
    case "PP":
      return e.date({ width: "medium" });
    case "PPP":
      return e.date({ width: "long" });
    case "PPPP":
    default:
      return e.date({ width: "full" });
  }
}, ke = (o, e) => {
  switch (o) {
    case "p":
      return e.time({ width: "short" });
    case "pp":
      return e.time({ width: "medium" });
    case "ppp":
      return e.time({ width: "long" });
    case "pppp":
    default:
      return e.time({ width: "full" });
  }
}, kt = (o, e) => {
  const t = o.match(/(P+)(p+)?/) || [], a = t[1], r = t[2];
  if (!r)
    return he(o, e);
  let i;
  switch (a) {
    case "P":
      i = e.dateTime({ width: "short" });
      break;
    case "PP":
      i = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      i = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      i = e.dateTime({ width: "full" });
      break;
  }
  return i.replace("{{date}}", he(a, e)).replace("{{time}}", ke(r, e));
}, Ct = {
  p: ke,
  P: kt
}, St = /^D+$/, Et = /^Y+$/, Pt = ["D", "DD", "YY", "YYYY"];
function It(o) {
  return St.test(o);
}
function $t(o) {
  return Et.test(o);
}
function Mt(o, e, t) {
  const a = Lt(o, e, t);
  if (console.warn(a), Pt.includes(o)) throw new RangeError(a);
}
function Lt(o, e, t) {
  const a = o[0] === "Y" ? "years" : "days of the month";
  return `Use \`${o.toLowerCase()}\` instead of \`${o}\` (in \`${e}\`) for formatting ${a} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Dt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, At = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Ot = /^'([^]*?)'?$/, Bt = /''/g, zt = /[a-zA-Z]/;
function O(o, e, t) {
  var d, h, u, p;
  const a = K(), r = a.locale ?? vt, i = a.firstWeekContainsDate ?? ((h = (d = a.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, n = a.weekStartsOn ?? ((p = (u = a.locale) == null ? void 0 : u.options) == null ? void 0 : p.weekStartsOn) ?? 0, s = $(o, t == null ? void 0 : t.in);
  if (!Ne(s))
    throw new RangeError("Invalid time value");
  let c = e.match(At).map((g) => {
    const f = g[0];
    if (f === "p" || f === "P") {
      const m = Ct[f];
      return m(g, r.formatLong);
    }
    return g;
  }).join("").match(Dt).map((g) => {
    if (g === "''")
      return { isToken: !1, value: "'" };
    const f = g[0];
    if (f === "'")
      return { isToken: !1, value: Wt(g) };
    if (le[f])
      return { isToken: !0, value: g };
    if (f.match(zt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + f + "`"
      );
    return { isToken: !1, value: g };
  });
  r.localize.preprocessor && (c = r.localize.preprocessor(s, c));
  const l = {
    firstWeekContainsDate: i,
    weekStartsOn: n,
    locale: r
  };
  return c.map((g) => {
    if (!g.isToken) return g.value;
    const f = g.value;
    ($t(f) || It(f)) && Mt(f, e, String(o));
    const m = le[f[0]];
    return m(s, f, r.localize, l);
  }).join("");
}
function Wt(o) {
  const e = o.match(Ot);
  return e ? e[1].replace(Bt, "'") : o;
}
function Nt(o, e) {
  return oe(
    I(o, o),
    ne(o)
  );
}
function Rt(o, e) {
  return oe(
    o,
    ye(ne(o), 1),
    e
  );
}
function Ft(o, e, t) {
  return ye(o, -1, t);
}
function qt(o, e) {
  return oe(
    I(o, o),
    Ft(ne(o))
  );
}
function Ut(o) {
  try {
    let e = orca.state.settings[me.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Nt(o))
      return "今天";
    if (qt(o))
      return "昨天";
    if (Rt(o))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const a = o.getDay(), i = ["日", "一", "二", "三", "四", "五", "六"][a], n = e.replace(/E/g, i);
          return O(o, n);
        } else
          return O(o, e);
      else
        return O(o, e);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const r of a)
        try {
          return O(o, r);
        } catch {
          continue;
        }
      return o.toLocaleDateString();
    }
  } catch {
    return o.toLocaleDateString();
  }
}
function Ce(o) {
  try {
    const e = ae(o, "_repr");
    if (!e || e.type !== be.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch {
    return null;
  }
}
async function ee(o) {
  try {
    if (Ce(o))
      return "journal";
    if (o["data-type"]) {
      const a = o["data-type"];
      return {
        code: "code",
        table: "table",
        image: "image",
        link: "link",
        heading: "heading",
        quote: "quote",
        task: "task",
        list: "list",
        math: "math"
      }[a] || a;
    }
    if (o.aliases && o.aliases.length > 0 && o.aliases[0])
      try {
        const r = ae(o, "_hide");
        return r && r.value ? "page" : "tag";
      } catch {
        return "tag";
      }
    const t = ae(o, "_repr");
    if (t && t.type === be.JSON && t.value)
      try {
        const a = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
        if (a.type)
          return a.type;
      } catch {
      }
    if (o.content && Array.isArray(o.content)) {
      if (o.content.some(
        (s) => s && typeof s == "object" && s.type === "code"
      ))
        return "code";
      if (o.content.some(
        (s) => s && typeof s == "object" && s.type === "table"
      ))
        return "table";
      if (o.content.some(
        (s) => s && typeof s == "object" && s.type === "image"
      ))
        return "image";
      if (o.content.some(
        (s) => s && typeof s == "object" && s.type === "link"
      ))
        return "link";
    }
    if (o.text) {
      const a = o.text.trim();
      if (a.startsWith("#"))
        return "heading";
      if (a.startsWith("> "))
        return "quote";
      if (a.startsWith("```") || a.startsWith("`"))
        return "code";
      if (a.startsWith("- [ ]") || a.startsWith("- [x]") || a.startsWith("* [ ]") || a.startsWith("* [x]"))
        return "task";
      if (a.includes("|") && a.split(`
`).length > 1)
        return "table";
      if (a.startsWith("- ") || a.startsWith("* ") || a.startsWith("+ ") || /^\d+\.\s/.test(a))
        return "list";
      if (/https?:\/\/[^\s]+/.test(a))
        return "link";
      if (a.includes("$$") || a.includes("$") && a.includes("="))
        return "math";
    }
    return "default";
  } catch {
    return "default";
  }
}
function _(o) {
  const e = {
    // 基础块类型
    journal: "📅",
    // 日期块 - 保持emoji
    alias: "ti ti-tag",
    // 别名块
    page: "ti ti-file",
    // 页面
    tag: "ti ti-hash",
    // 标签
    heading: "ti ti-heading",
    // 标题
    code: "ti ti-code",
    // 代码
    table: "ti ti-table",
    // 表格
    image: "ti ti-photo",
    // 图片
    link: "ti ti-link",
    // 链接
    list: "ti ti-list",
    // 列表
    quote: "ti ti-quote",
    // 引用
    text: "ti ti-file-text",
    // 普通文本
    block: "ti ti-square",
    // 块
    task: "ti ti-checkbox",
    // 任务
    math: "ti ti-math",
    // 数学公式
    // 扩展块类型
    idea: "ti ti-bulb",
    // 想法
    question: "ti ti-help-circle",
    // 问题
    answer: "ti ti-message-circle",
    // 答案
    summary: "ti ti-file-text",
    // 总结
    reference: "ti ti-book",
    // 参考
    example: "ti ti-code",
    // 示例
    warning: "ti ti-alert-triangle",
    // 警告
    info: "ti ti-info-circle",
    // 信息
    tip: "ti ti-lightbulb",
    // 提示
    note: "ti ti-note",
    // 笔记
    todo: "ti ti-checkbox",
    // 待办
    done: "ti ti-check",
    // 完成
    important: "ti ti-star",
    // 重要
    urgent: "ti ti-alert-circle",
    // 紧急
    meeting: "ti ti-calendar",
    // 会议
    event: "ti ti-calendar-event",
    // 事件
    project: "ti ti-folder",
    // 项目
    goal: "ti ti-target",
    // 目标
    habit: "ti ti-repeat",
    // 习惯
    bookmark: "ti ti-bookmark",
    // 书签
    attachment: "ti ti-paperclip",
    // 附件
    video: "ti ti-video",
    // 视频
    audio: "ti ti-headphones",
    // 音频
    document: "ti ti-file",
    // 文档
    spreadsheet: "ti ti-table",
    // 电子表格
    presentation: "ti ti-presentation",
    // 演示文稿
    database: "ti ti-database",
    // 数据库
    api: "ti ti-plug",
    // API
    config: "ti ti-settings",
    // 配置
    log: "ti ti-file-text",
    // 日志
    error: "ti ti-alert-triangle",
    // 错误
    success: "ti ti-check-circle",
    // 成功
    progress: "ti ti-progress",
    // 进度
    status: "ti ti-info-circle",
    // 状态
    version: "ti ti-git-branch",
    // 版本
    commit: "ti ti-git-commit",
    // 提交
    branch: "ti ti-git-branch",
    // 分支
    merge: "ti ti-git-merge",
    // 合并
    pull: "ti ti-git-pull",
    // 拉取
    push: "ti ti-git-push",
    // 推送
    deploy: "ti ti-rocket",
    // 部署
    build: "ti ti-hammer",
    // 构建
    test: "ti ti-flask",
    // 测试
    debug: "ti ti-bug",
    // 调试
    performance: "ti ti-gauge",
    // 性能
    security: "ti ti-shield",
    // 安全
    backup: "ti ti-archive",
    // 备份
    restore: "ti ti-refresh",
    // 恢复
    sync: "ti ti-refresh",
    // 同步
    export: "ti ti-download",
    // 导出
    import: "ti ti-upload",
    // 导入
    share: "ti ti-share",
    // 分享
    collaborate: "ti ti-users",
    // 协作
    review: "ti ti-eye",
    // 审查
    approve: "ti ti-check",
    // 批准
    reject: "ti ti-x",
    // 拒绝
    comment: "ti ti-message",
    // 评论
    feedback: "ti ti-message-circle",
    // 反馈
    suggestion: "ti ti-lightbulb",
    // 建议
    improvement: "ti ti-trending-up",
    // 改进
    optimization: "ti ti-zap",
    // 优化
    refactor: "ti ti-refresh",
    // 重构
    migration: "ti ti-arrow-right",
    // 迁移
    upgrade: "ti ti-arrow-up",
    // 升级
    downgrade: "ti ti-arrow-down",
    // 降级
    rollback: "ti ti-undo",
    // 回滚
    default: "ti ti-file"
    // 默认
  };
  let t = e[o];
  if (!t) {
    const a = _t(o);
    a && (t = a);
  }
  return t || (t = e.default), t;
}
function _t(o) {
  const e = o.toLowerCase(), t = {
    date: "ti ti-calendar",
    time: "ti ti-clock",
    calendar: "ti ti-calendar",
    schedule: "ti ti-calendar",
    plan: "ti ti-calendar",
    todo: "ti ti-checkbox",
    task: "ti ti-checkbox",
    check: "ti ti-check",
    done: "ti ti-check",
    complete: "ti ti-check",
    finish: "ti ti-check",
    code: "ti ti-code",
    program: "ti ti-code",
    script: "ti ti-code",
    function: "ti ti-code",
    method: "ti ti-code",
    class: "ti ti-code",
    object: "ti ti-code",
    variable: "ti ti-code",
    constant: "ti ti-code",
    string: "ti ti-code",
    number: "ti ti-code",
    boolean: "ti ti-code",
    array: "ti ti-code",
    list: "ti ti-list",
    item: "ti ti-list",
    element: "ti ti-list",
    entry: "ti ti-list",
    record: "ti ti-list",
    row: "ti ti-list",
    column: "ti ti-list",
    table: "ti ti-table",
    data: "ti ti-database",
    info: "ti ti-info-circle",
    information: "ti ti-info-circle",
    detail: "ti ti-info-circle",
    description: "ti ti-info-circle",
    explanation: "ti ti-info-circle",
    help: "ti ti-help-circle",
    question: "ti ti-help-circle",
    ask: "ti ti-help-circle",
    answer: "ti ti-message-circle",
    reply: "ti ti-message-circle",
    response: "ti ti-message-circle",
    comment: "ti ti-message",
    note: "ti ti-note",
    remark: "ti ti-note",
    memo: "ti ti-note",
    tip: "ti ti-lightbulb",
    hint: "ti ti-lightbulb",
    suggestion: "ti ti-lightbulb",
    idea: "ti ti-bulb",
    concept: "ti ti-bulb",
    thought: "ti ti-bulb",
    warning: "ti ti-alert-triangle",
    alert: "ti ti-alert-triangle",
    caution: "ti ti-alert-triangle",
    danger: "ti ti-alert-triangle",
    error: "ti ti-alert-triangle",
    mistake: "ti ti-alert-triangle",
    bug: "ti ti-bug",
    issue: "ti ti-bug",
    problem: "ti ti-bug",
    success: "ti ti-check-circle",
    win: "ti ti-check-circle",
    victory: "ti ti-check-circle",
    achievement: "ti ti-check-circle",
    goal: "ti ti-target",
    target: "ti ti-target",
    objective: "ti ti-target",
    aim: "ti ti-target",
    purpose: "ti ti-target",
    file: "ti ti-file",
    document: "ti ti-file",
    paper: "ti ti-file",
    report: "ti ti-file",
    article: "ti ti-file",
    post: "ti ti-file",
    page: "ti ti-file-text",
    web: "ti ti-file-text",
    site: "ti ti-file-text",
    url: "ti ti-link",
    link: "ti ti-link",
    href: "ti ti-link",
    reference: "ti ti-book",
    book: "ti ti-book",
    manual: "ti ti-book",
    guide: "ti ti-book",
    tutorial: "ti ti-book",
    example: "ti ti-code",
    sample: "ti ti-code",
    demo: "ti ti-code",
    test: "ti ti-flask",
    testing: "ti ti-flask",
    experiment: "ti ti-flask",
    trial: "ti ti-flask",
    image: "ti ti-photo",
    picture: "ti ti-photo",
    photo: "ti ti-photo",
    screenshot: "ti ti-photo",
    video: "ti ti-video",
    movie: "ti ti-video",
    clip: "ti ti-video",
    audio: "ti ti-headphones",
    sound: "ti ti-headphones",
    music: "ti ti-headphones",
    podcast: "ti ti-headphones",
    attachment: "ti ti-paperclip",
    attach: "ti ti-paperclip",
    download: "ti ti-download",
    upload: "ti ti-upload",
    import: "ti ti-upload",
    export: "ti ti-download",
    backup: "ti ti-archive",
    archive: "ti ti-archive",
    compress: "ti ti-archive",
    zip: "ti ti-archive",
    folder: "ti ti-folder",
    directory: "ti ti-folder",
    path: "ti ti-folder",
    project: "ti ti-folder",
    workspace: "ti ti-folder",
    team: "ti ti-users",
    group: "ti ti-users",
    user: "ti ti-user",
    person: "ti ti-user",
    people: "ti ti-users",
    collaborate: "ti ti-users",
    share: "ti ti-share",
    public: "ti ti-share",
    private: "ti ti-lock",
    secure: "ti ti-shield",
    security: "ti ti-shield",
    protect: "ti ti-shield",
    safe: "ti ti-shield",
    settings: "ti ti-settings",
    config: "ti ti-settings",
    configuration: "ti ti-settings",
    preference: "ti ti-settings",
    option: "ti ti-settings",
    parameter: "ti ti-settings"
  };
  for (const [a, r] of Object.entries(t))
    if (e.includes(a))
      return r;
  return null;
}
function ae(o, e) {
  return !o.properties || !Array.isArray(o.properties) ? null : o.properties.find((t) => t.name === e);
}
function Ht(o) {
  if (!Array.isArray(o) || o.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const a of o)
    a && typeof a == "object" && (a.t === "text" && a.v ? e++ : a.t === "ref" && a.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function Vt(o) {
  if (!o || o.length === 0) return "";
  let e = "";
  for (const t of o)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function jt(o, e, t, a) {
  const r = document.createElement("div");
  r.className = "orca-tabs-ref-menu-item", r.setAttribute("role", "menuitem"), r.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
    font-family: var(--orca-fontfamily-ui);
    font-size: var(--orca-fontsize-sm);
    line-height: 1.4;
    border-radius: var(--orca-radius-md);
  `;
  const i = document.createElement("i");
  i.className = e, i.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const n = document.createElement("span");
  if (n.textContent = o, n.style.cssText = `
    flex: 1;
    color: var(--orca-color-text-1);
  `, r.appendChild(i), r.appendChild(n), t && t.trim() !== "") {
    const s = document.createElement("span");
    s.textContent = t, s.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, r.appendChild(s);
  }
  return r.addEventListener("mouseenter", () => {
    r.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), r.addEventListener("mouseleave", () => {
    r.style.backgroundColor = "transparent";
  }), r.addEventListener("click", (s) => {
    s.preventDefault(), s.stopPropagation(), a();
    const c = r.closest('.orca-context-menu, .context-menu, [role="menu"]');
    c && (c.style.display = "none", c.remove());
  }), r;
}
function Yt(o, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);
  if (t) {
    const a = parseInt(t[1], 16), r = parseInt(t[2], 16), i = parseInt(t[3], 16);
    return `rgba(${a}, ${r}, ${i}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function Qt(o, e, t) {
  let a = "var(--orca-tab-bg)", r = "var(--orca-color-text-1)", i = "normal", n = "";
  if (o.color)
    try {
      n = `--tab-color: ${o.color.startsWith("#") ? o.color : `#${o.color}`};`, a = "var(--orca-tab-colored-bg)", r = "var(--orca-tab-colored-text)", i = "600";
    } catch {
    }
  return e ? `
    ${n}
    background: ${a};
    color: ${r};
    font-weight: ${i};
    padding: 2px 8px;
    border-radius: var(--orca-radius-md);
    height: 24px;
    max-height: 24px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    width: calc(100% - 6px);
    margin: 0 3px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, margin, opacity;
  ` : `
    ${n}
    background: ${a};
    color: ${r};
    font-weight: ${i};
    padding: 2px 8px;
    border-radius: var(--orca-radius-md);
    height: 24px;
    max-height: 24px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    max-width: 130px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, margin, opacity;
  `;
}
function Gt() {
  const o = document.createElement("div");
  return o.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, o;
}
function Xt(o) {
  const e = document.createElement("div");
  if (e.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    font-size: 14px;
    line-height: 1;
  `, o.startsWith("ti ti-")) {
    const t = document.createElement("i");
    t.className = o, e.appendChild(t);
  } else
    e.textContent = o;
  return e;
}
function Kt(o) {
  const e = document.createElement("div");
  e.style.cssText = `
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    min-width: 0;
    display: flex;
    align-items: center;
    line-height: 2.2;
    height: 16px;
    position: relative;
  `;
  const t = document.createElement("span");
  return t.style.cssText = `
    display: block;
    white-space: nowrap;
    width: 100%;
    line-height: 2.2;
    vertical-align: middle;
  `, t.textContent = o, e.appendChild(t), requestAnimationFrame(() => {
    const a = e.offsetWidth;
    t.scrollWidth > a && (t.style.mask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.webkitMask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.maskSize = "100% 100%", t.style.webkitMaskSize = "100% 100%", t.style.maskRepeat = "no-repeat", t.style.webkitMaskRepeat = "no-repeat");
  }), e;
}
function Jt() {
  const o = document.createElement("span");
  return o.textContent = "📌", o.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, o;
}
function Zt(o) {
  let e = o.title;
  return o.isPinned && (e += " (已固定)"), e;
}
function H(o, e, t = 180, a = 200) {
  const r = window.innerWidth, i = window.innerHeight, n = 10;
  let s = o, c = e;
  return s + t > r - n && (s = r - t - n), c + a > i - n && (c = i - a - n, c < e - a && (c = e - a - 5)), s < n && (s = n), c < n && (c = e + 5), s = Math.max(n, Math.min(s, r - t - n)), c = Math.max(n, Math.min(c, i - a - n)), { x: s, y: c };
}
function ea() {
  return `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--orca-color-bg-1);
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    padding: 20px;
    min-width: 300px;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  `;
}
function pe(o = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[o];
}
function ta() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function aa(o, e, t, a) {
  return o ? `
    position: fixed;
    top: ${e.y}px;
    left: ${e.x}px;
    z-index: 300;
    display: flex;
    flex-direction: column;
    gap: 6px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    background: ${t};
    border-radius: var(--orca-radius-md);
    padding: 4px 2px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    user-select: none;
    max-height: 80vh;
    flex-wrap: nowrap;
    pointer-events: auto;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    width: ${a || 200}px;
    min-width: 120px;
    max-width: 400px;
    align-items: stretch;
    overflow-y: auto;
    overflow-x: visible;
  ` : `
    position: fixed;
    top: ${e.y}px;
    left: ${e.x}px;
    z-index: 300;
    display: flex;
    gap: 10px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    background: ${t};
    border-radius: var(--orca-radius-md);
    padding: 2px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    user-select: none;
    max-width: 80vw;
    flex-wrap: wrap;
    pointer-events: auto;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    height: 28px;
    align-items: center;
    overflow-y: visible;
    overflow-x: visible;
  `;
}
function ra(o, e, t = {}) {
  try {
    const {
      updateOrder: a = !0,
      saveData: r = !0,
      updateUI: i = !0
    } = t, n = e.findIndex((d) => d.blockId === o.blockId);
    if (n === -1)
      return {
        success: !1,
        message: `标签不存在: ${o.title}`
      };
    e[n].isPinned = !e[n].isPinned;
    const s = e[n].isPinned;
    a && sa(e);
    const c = e.findIndex((d) => d.blockId === o.blockId), l = s ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${o.title}" 已${l}`,
      data: { tab: e[c], tabIndex: c }
    };
  } catch (a) {
    return {
      success: !1,
      message: `切换固定状态失败: ${a}`
    };
  }
}
function ia(o, e, t, a = {}) {
  try {
    const {
      updateUI: r = !0,
      saveData: i = !0,
      validateData: n = !0
    } = a, s = t.findIndex((c) => c.blockId === o.blockId);
    if (s === -1)
      return {
        success: !1,
        message: `标签不存在: ${o.title}`
      };
    if (n) {
      const c = oa(e);
      if (!c.success)
        return c;
    }
    return t[s] = { ...t[s], ...e }, {
      success: !0,
      message: `标签 "${o.title}" 已更新`,
      data: { tab: t[s], tabIndex: s }
    };
  } catch (r) {
    return {
      success: !1,
      message: `更新标签失败: ${r}`
    };
  }
}
function na(o, e, t, a = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : ia(o, { title: e.trim() }, t, a);
}
function oa(o) {
  return o.blockId !== void 0 && (!o.blockId || o.blockId.trim() === "") ? {
    success: !1,
    message: "标签块ID不能为空"
  } : o.title !== void 0 && (!o.title || o.title.trim() === "") ? {
    success: !1,
    message: "标签标题不能为空"
  } : o.order !== void 0 && (o.order < 0 || !Number.isInteger(o.order)) ? {
    success: !1,
    message: "标签顺序必须是正整数"
  } : {
    success: !0,
    message: "标签数据验证通过"
  };
}
function sa(o) {
  o.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function ca(o) {
  for (let e = o.length - 1; e >= 0; e--)
    if (!o[e].isPinned)
      return e;
  return -1;
}
function la(o) {
  return [...o].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function da(o, e, t, a) {
  return e ? {
    x: o.x,
    y: o.y,
    width: t,
    height: a
  } : {
    x: o.x,
    y: o.y,
    width: Math.min(800, window.innerWidth - o.x - 10),
    height: 28
  };
}
function ua(o, e, t, a) {
  const r = da(o, e, t, a);
  let i = o.x, n = o.y;
  return r.x < 0 ? i = 0 : r.x + r.width > window.innerWidth && (i = window.innerWidth - r.width), r.y < 0 ? n = 0 : r.y + r.height > window.innerHeight && (n = window.innerHeight - r.height), { x: i, y: n };
}
function ha(o, e, t = !1) {
  let a = null;
  const r = (...i) => {
    const n = t && !a;
    a && clearTimeout(a), a = window.setTimeout(() => {
      a = null, t || o(...i);
    }, e), n && o(...i);
  };
  return r.cancel = () => {
    a && (clearTimeout(a), a = null);
  }, r;
}
class pa {
  constructor(e = {}, t = {}) {
    b(this, "observer", null);
    b(this, "config");
    b(this, "callbacks");
    b(this, "mutationQueue", []);
    b(this, "batchTimer", null);
    b(this, "lastBatchTime", 0);
    b(this, "isObserving", !1);
    b(this, "targetElement");
    this.config = {
      enableBatch: !0,
      batchDelay: 16,
      // 一帧的时间
      maxBatchSize: 50,
      enableSmartFilter: !0,
      coolingPeriod: 100,
      ...e
    }, this.callbacks = t, this.targetElement = document.body;
  }
  /**
   * 开始观察
   */
  observe(e, t = {
    childList: !0,
    subtree: !0,
    attributes: !0,
    attributeFilter: ["class"]
  }) {
    this.isObserving && this.disconnect(), this.targetElement = e, this.observer = new MutationObserver(this.handleMutations.bind(this)), this.observer.observe(e, t), this.isObserving = !0;
  }
  /**
   * 停止观察
   */
  disconnect() {
    this.observer && (this.observer.disconnect(), this.observer = null), this.batchTimer && (clearTimeout(this.batchTimer), this.batchTimer = null), this.mutationQueue = [], this.isObserving = !1;
  }
  /**
   * 是否正在观察
   */
  get observing() {
    return this.isObserving;
  }
  /**
   * 处理突变记录
   */
  handleMutations(e) {
    const t = Date.now(), a = this.config.enableSmartFilter ? this.filterRelevantMutations(e) : e;
    if (a.length !== 0) {
      if (t - this.lastBatchTime < this.config.coolingPeriod) {
        this.log("🚨 检测到高频变化，启用冷却期"), a.forEach((r) => {
          this.handleHotMutation(r);
        });
        return;
      }
      this.config.enableBatch ? this.handleBatchMutations(a, t) : a.forEach((r) => {
        var i, n;
        (n = (i = this.callbacks).onHotMutation) == null || n.call(i, r);
      });
    }
  }
  /**
   * 处理批量变化
   */
  handleBatchMutations(e, t) {
    if (this.mutationQueue.push(...e), this.mutationQueue.length > this.config.maxBatchSize * 2) {
      this.flushBatch();
      return;
    }
    this.batchTimer && clearTimeout(this.batchTimer), this.batchTimer = window.setTimeout(() => {
      this.flushBatch();
    }, this.config.batchDelay);
  }
  /**
   * 立即处理队列中的所有变化
   */
  flushBatch() {
    var a, r;
    if (this.mutationQueue.length === 0)
      return;
    const e = [...this.mutationQueue];
    this.mutationQueue = [], this.batchTimer = null, this.lastBatchTime = Date.now();
    const t = this.deduplicateMutations(e);
    (r = (a = this.callbacks).onBatchMutations) == null || r.call(a, t);
  }
  /**
   * 处理热点变化（高频变化）
   */
  handleHotMutation(e) {
    var a, r;
    const t = e.target;
    this.isCriticalChange(e, t) ? (r = (a = this.callbacks).onHotMutation) == null || r.call(a, e) : this.throttleMutation(e);
  }
  /**
   * 检测是否为关键变化
   */
  isCriticalChange(e, t) {
    return !!(e.type === "attributes" && e.attributeName === "class" && (t.classList.contains("orca-panel") && t.classList.contains("active") || t.classList.contains("orca-hideable") && !t.classList.contains("orca-hideable-hidden")) || e.type === "childList" && e.addedNodes.length > 0 && t.closest(".orca-panel, .orca-panels-row"));
  }
  /**
   * 节流处理变化
   */
  throttleMutation(e) {
    requestAnimationFrame(() => {
      var t, a;
      (a = (t = this.callbacks).onThrottledMutation) == null || a.call(t, [e]);
    });
  }
  /**
   * 过滤相关的变化
   */
  filterRelevantMutations(e) {
    return e.filter((t) => {
      const a = t.target;
      return a.nodeType !== Node.ELEMENT_NODE ? !1 : [
        "orca-panel",
        "orca-hideable",
        "orca-block-editor",
        "orca-panels-row",
        "orca-tab"
      ].some(
        (n) => a.classList.contains(n) || a.closest(`.${n}`)
      );
    });
  }
  /**
   * 对变化进行去重和合并
   */
  deduplicateMutations(e) {
    const t = /* @__PURE__ */ new Set(), a = [];
    return e.reverse().forEach((r) => {
      const i = r.target;
      r.type === "attributes" || `${r.type}${Array.from(r.addedNodes).map((n) => {
        var s;
        return ((s = n.textContent) == null ? void 0 : s.substring(0, 50)) || "empty";
      }).join(",")}`, t.has(i) || (t.add(i), a.push(r));
    }), a.reverse();
  }
  /**
   * 获取性能统计
   */
  getPerformanceStats() {
    return {
      isObserving: this.isObserving,
      queueSize: this.mutationQueue.length,
      hasBatchTimer: this.batchTimer !== null
    };
  }
  /**
   * 强制立即处理所有队列中的变化
   */
  forceFlush() {
    this.batchTimer && (clearTimeout(this.batchTimer), this.batchTimer = null), this.flushBatch();
  }
  /**
   * 设置观察目标
   */
  setTarget(e) {
    this.isObserving && this.observer && (this.observer.disconnect(), this.observer.observe(e, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class"]
    }), this.targetElement = e);
  }
  /**
   * 更新配置
   */
  updateConfig(e) {
    if (this.config = { ...this.config, ...e }, this.isObserving && (e.enableBatch !== void 0 || e.batchDelay !== void 0)) {
      this.log("🔄 配置变化，重新初始化观察器");
      const t = this.targetElement;
      this.disconnect(), setTimeout(() => {
        this.observe(t);
      }, 0);
    }
  }
  log(e) {
    typeof window < "u" && window.DEBUG_ORCA_TABS && console.log(`[OptimizedMutationObserver] ${e}`);
  }
  /**
   * 销毁观察器
   */
  destroy() {
    this.disconnect(), this.callbacks = {}, this.config = {};
  }
}
class ga {
  constructor() {
    b(this, "layers", /* @__PURE__ */ new Map());
    b(this, "taskQueue", /* @__PURE__ */ new Map());
    b(this, "activeTimers", /* @__PURE__ */ new Map());
    b(this, "performanceMetrics");
    b(this, "taskIdCounter", 0);
    b(this, "isEnabled", !0);
    this.performanceMetrics = {
      totalTasks: 0,
      cancelledTasks: 0,
      executedTasks: 0,
      averageDelay: 0,
      peakQueueSize: 0,
      memoryUsage: this.getMemoryUsage()
    }, this.addLayer("immediate", { name: "immediate", delay: 0, priority: 10, cancelable: !1 }), this.addLayer("high", { name: "high", delay: 8, priority: 8, cancelable: !0, maxWait: 100 }), this.addLayer("normal", { name: "normal", delay: 16, priority: 5, cancelable: !0, maxWait: 200 }), this.addLayer("low", { name: "low", delay: 32, priority: 3, cancelable: !0, maxWait: 500 }), this.addLayer("idle", { name: "idle", delay: 100, priority: 1, cancelable: !0, maxWait: 1e3 });
  }
  /**
   * 添加防抖层级
   */
  addLayer(e, t) {
    this.layers.set(e, {
      ...t,
      maxWait: t.maxWait || t.delay * 2
    });
  }
  /**
   * 移除防抖层级
   */
  removeLayer(e) {
    this.layers.delete(e);
  }
  /**
   * 执行任务
   */
  execute(e, t = [], a = "normal", r = {}) {
    const i = this.layers.get(a);
    if (!i)
      return console.warn(`Unknown layer: ${a}`), e(...t);
    const n = r.id || `task_${++this.taskIdCounter}`;
    if (i.delay === 0)
      return this.updateMetrics("executed"), e(...t);
    if (this.taskQueue.get(n) && !i.cancelable && !r.forceExecute)
      return this.updateMetrics("cancelled"), Promise.resolve();
    const c = {
      id: n,
      fn: e,
      args: t,
      layer: i,
      createdAt: Date.now(),
      priority: r.priority || i.priority,
      forceExecute: r.forceExecute || !1
    };
    return this.taskQueue.set(n, c), this.scheduleExecution(c), this.updateMetrics("queued"), new Promise((l, d) => {
      this.waitForTaskResolution(n, l, d);
    });
  }
  /**
   * 取消任务
   */
  cancel(e) {
    if (!this.taskQueue.get(e))
      return !1;
    const a = this.activeTimers.get(e);
    return a && (clearTimeout(a), this.activeTimers.delete(e)), this.taskQueue.delete(e), this.updateMetrics("cancelled"), !0;
  }
  /**
   * 批量执行任务
   */
  batchExecute(e, t = {}) {
    const { concurrent: a = !1, maxConcurrency: r = 3 } = t;
    return a ? this.executeConcurrent(e, r) : this.executeSequential(e);
  }
  /**
   * 执行队列中的所有任务
   */
  flushAll() {
    const e = Array.from(this.taskQueue.values());
    this.activeTimers.forEach((t) => clearTimeout(t)), this.activeTimers.clear(), e.sort((t, a) => (a.priority || 0) - (t.priority || 0)), e.forEach((t) => {
      try {
        t.fn(...t.args), this.updateMetrics("executed");
      } catch (a) {
        console.error(`Task ${t.id} execution failed:`, a);
      }
    }), this.taskQueue.clear();
  }
  /**
   * 暂停调度器
   */
  pause() {
    this.isEnabled = !1;
  }
  /**
   * 恢复调度器
   */
  resume() {
    this.isEnabled = !0, this.taskQueue.forEach((e, t) => {
      this.activeTimers.has(t) || this.scheduleExecution(e);
    });
  }
  /**
   * 获取性能指标
   */
  getMetrics() {
    return {
      ...this.performanceMetrics,
      memoryUsage: this.getMemoryUsage()
    };
  }
  /**
   * 重置性能指标
   */
  resetMetrics() {
    this.performanceMetrics = {
      totalTasks: 0,
      cancelledTasks: 0,
      executedTasks: 0,
      averageDelay: 0,
      peakQueueSize: 0,
      memoryUsage: this.getMemoryUsage()
    };
  }
  /**
   * 检查是否存在指定任务
   */
  hasTask(e) {
    return this.taskQueue.has(e);
  }
  /**
   * 获取队列状态
   */
  getQueueStatus() {
    const e = /* @__PURE__ */ new Map();
    return this.taskQueue.forEach((t) => {
      const a = t.layer.name;
      e.set(a, (e.get(a) || 0) + 1);
    }), {
      totalTasks: this.taskQueue.size,
      tasksByLayer: e,
      pendingTasks: this.taskQueue.size,
      activeTimers: this.activeTimers.size
    };
  }
  /**
   * 调度任务执行
   */
  scheduleExecution(e) {
    if (!this.isEnabled)
      return;
    const t = setTimeout(() => {
      this.executeTask(e);
    }, e.layer.delay);
    this.activeTimers.set(e.id, t), e.layer.maxWait && e.layer.maxWait > e.layer.delay && setTimeout(() => {
      this.forceExecuteTask(e);
    }, e.layer.maxWait);
  }
  /**
   * 执行单个任务
   */
  executeTask(e) {
    try {
      e.fn(...e.args), this.updateMetrics("executed");
    } catch (t) {
      console.error(`Task ${e.id} execution failed:`, t);
    } finally {
      this.taskQueue.delete(e.id), this.activeTimers.delete(e.id);
    }
  }
  /**
   * 强制执行任务
   */
  forceExecuteTask(e) {
    if (!this.taskQueue.has(e.id))
      return;
    const t = this.activeTimers.get(e.id);
    t && (clearTimeout(t), this.activeTimers.delete(e.id)), this.executeTask(e);
  }
  /**
   * 并发执行任务
   */
  async executeConcurrent(e, t) {
    const a = new Array(e.length), r = [];
    let i = 0;
    const n = async (s, c) => {
      try {
        const l = await this.execute(
          c.fn,
          c.args || [],
          c.layer || "normal",
          { priority: c.priority || 0 }
        );
        a[s] = l;
      } catch (l) {
        console.error(`Task ${s} failed:`, l);
      }
    };
    for (; i < e.length; ) {
      for (; r.length < t && i < e.length; ) {
        const s = e[i], c = n(i, s);
        r.push(c), i++;
      }
      r.length > 0 && (await Promise.race(r), r.shift());
    }
    return await Promise.all(r), a;
  }
  /**
   * 顺序执行任务
   */
  async executeSequential(e) {
    const t = [];
    for (const a of e) {
      const r = await this.execute(
        a.fn,
        a.args || [],
        a.layer || "normal",
        { priority: a.priority || 0 }
      );
      t.push(r);
    }
    return t;
  }
  /**
   * 等待任务解析
   */
  waitForTaskResolution(e, t, a) {
    const r = setInterval(() => {
      this.taskQueue.has(e) || (clearInterval(r), t(Promise.resolve()));
    }, 10);
    setTimeout(() => {
      clearInterval(r), this.taskQueue.delete(e), a(new Error(`Task ${e} timeout`));
    }, 3e4);
  }
  /**
   * 更新性能指标
   */
  updateMetrics(e) {
    this.performanceMetrics.totalTasks++, e === "executed" ? this.performanceMetrics.executedTasks++ : e === "cancelled" && this.performanceMetrics.cancelledTasks++;
    const t = this.taskQueue.size;
    if (t > this.performanceMetrics.peakQueueSize && (this.performanceMetrics.peakQueueSize = t), this.performanceMetrics.totalTasks > 0) {
      const a = Array.from(this.activeTimers.values()).reduce((r, i) => r + i, 0);
      this.performanceMetrics.averageDelay = a / this.activeTimers.size;
    }
  }
  /**
   * 获取内存使用情况
   */
  getMemoryUsage() {
    var e;
    return ((e = performance == null ? void 0 : performance.memory) == null ? void 0 : e.usedJSHeapSize) || 0;
  }
  /**
   * 销毁优化器
   */
  destroy() {
    this.activeTimers.forEach((e) => clearTimeout(e)), this.activeTimers.clear(), this.taskQueue.clear(), this.layers.clear(), this.isEnabled = !1;
  }
}
const D = class D {
  constructor() {
    b(this, "trackedResources", /* @__PURE__ */ new Map());
    b(this, "cleanupListeners", /* @__PURE__ */ new Set());
    b(this, "autoCleanupInterval", null);
    b(this, "isEnabled", !0);
    b(this, "resourceIdCounter", 0);
    this.startAutoCleanup(), this.setupGlobalCleanup();
  }
  /**
   * 获取单例实例
   */
  static getInstance() {
    return D.instance || (D.instance = new D()), D.instance;
  }
  /**
   * 跟踪事件监听器
   */
  trackEventListener(e, t, a, r, i) {
    const n = `event_${++this.resourceIdCounter}`, s = () => {
      e.removeEventListener(t, a, r);
    }, c = {
      id: n,
      type: "eventListener",
      resource: { target: e, event: t, listener: a, options: r },
      createdAt: Date.now(),
      cleanup: s,
      description: i || `EventListener on ${e.constructor.name}.${t}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(c), n;
  }
  /**
   * 跟踪定时器
   */
  trackTimer(e, t = "timeout", a) {
    const r = `${t}_${e}`, i = () => {
      t === "timeout" ? clearTimeout(e) : clearInterval(e);
    }, n = {
      id: r,
      type: "timer",
      resource: { timerId: e, type: t },
      createdAt: Date.now(),
      cleanup: i,
      description: a || `${t.charAt(0).toUpperCase() + t.slice(1)} timer #${e}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(n), r;
  }
  /**
   * 跟踪观察者
   */
  trackObserver(e, t = "mutation", a) {
    const r = `observer_${++this.resourceIdCounter}`, i = () => {
      e.disconnect();
    }, n = {
      id: r,
      type: "observer",
      resource: e,
      createdAt: Date.now(),
      cleanup: i,
      description: a || `${t.charAt(0).toUpperCase() + t.slice(1)}Observer`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(n), r;
  }
  /**
   * 跟踪动画帧
   */
  trackAnimationFrame(e, t) {
    const a = `raf_${e}`, r = () => {
      cancelAnimationFrame(e);
    }, i = {
      id: a,
      type: "animationFrame",
      resource: { frameId: e },
      createdAt: Date.now(),
      cleanup: r,
      description: t || `AnimationFrame #${e}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(i), a;
  }
  /**
   * 跟踪Promise
   */
  trackPromise(e, t) {
    const a = `promise_${++this.resourceIdCounter}`, r = () => {
      e.catch(() => {
      });
    }, i = {
      id: a,
      type: "promise",
      resource: e,
      createdAt: Date.now(),
      cleanup: r,
      description: t || `Promise #${a}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(i), Promise.allSettled([e]).finally(() => {
      this.cleanupResource(a);
    }), a;
  }
  /**
   * 跟踪自定义资源
   */
  trackCustomResource(e, t, a) {
    const r = `custom_${++this.resourceIdCounter}`, i = {
      id: r,
      type: "custom",
      resource: e,
      createdAt: Date.now(),
      cleanup: t,
      description: a || `Custom resource #${r}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(i), r;
  }
  /**
   * 跟踪批量的清理操作
   */
  trackBatchCleanup(e, t) {
    return this.trackCustomResource(
      null,
      () => {
        e.forEach((a) => {
          try {
            a();
          } catch (r) {
            console.error("Batch cleanup error:", r);
          }
        });
      },
      t || `Batch cleanup (${e.length} items)`
    );
  }
  /**
   * 获取资源状态
   */
  getResource(e) {
    return this.trackedResources.get(e) || null;
  }
  /**
   * 检查资源是否存在
   */
  hasResource(e) {
    return this.trackedResources.has(e);
  }
  /**
   * 清理单个资源
   */
  cleanupResource(e) {
    const t = this.trackedResources.get(e);
    if (!t || t.destroyed)
      return !1;
    try {
      return t.cleanup(), t.destroyed = !0, this.notifyCleanupListeners(this.getMemoryStats()), !0;
    } catch (a) {
      return console.error(`Cleanup failed for resource ${e}:`, a), !1;
    } finally {
      this.trackedResources.delete(e);
    }
  }
  /**
   * 清理指定类型的所有资源
   */
  cleanupResourcesByType(e) {
    let t = 0;
    return this.trackedResources.forEach((a, r) => {
      a.type === e && !a.destroyed && this.cleanupResource(r) && t++;
    }), t;
  }
  /**
   * 清理所有资源
   */
  cleanupAllResources() {
    const e = this.getMemoryStats();
    return Array.from(this.trackedResources.values()).forEach((a) => {
      if (!a.destroyed)
        try {
          a.cleanup(), a.destroyed = !0;
        } catch (r) {
          console.error(`Cleanup failed for resource ${a.id}:`, r);
        }
    }), this.trackedResources.clear(), {
      ...e,
      cleanupCount: e.totalResources
    };
  }
  /**
   * 获取内存统计
   */
  getMemoryStats() {
    const e = /* @__PURE__ */ new Map();
    let t, a = 0;
    return this.trackedResources.forEach((r) => {
      if (r.destroyed)
        a++;
      else {
        const i = e.get(r.type) || 0;
        e.set(r.type, i + 1), (!t || r.createdAt < t.createdAt) && (t = r);
      }
    }), {
      totalResources: this.trackedResources.size,
      resourcesByType: e,
      leakedCount: a,
      memoryUsage: this.getMemoryUsage(),
      cleanupCount: this.getCleanupCount(),
      oldestResource: t
    };
  }
  /**
   * 检查潜在的内存泄漏
   */
  detectMemoryLeaks() {
    const e = this.getMemoryStats(), t = [];
    e.resourcesByType.forEach((i, n) => {
      const c = {
        eventListener: 50,
        timer: 20,
        observer: 10,
        animationFrame: 50,
        promise: 30,
        custom: 100
      }[n] || 10;
      i > c && t.push({
        type: n,
        count: i,
        description: `Too many ${n}s detected: ${i} (threshold: ${c})`
      });
    });
    const a = Date.now(), r = 3e5;
    return this.trackedResources.forEach((i, n) => {
      !i.destroyed && a - i.createdAt > r && t.push({
        type: "timeout",
        count: 1,
        description: `Long-running resource: ${i.description || n} (age: ${Math.round((a - i.createdAt) / 1e3)}s)`
      });
    }), t;
  }
  /**
   * 添加清理监听器
   */
  addCleanupListener(e) {
    return this.cleanupListeners.add(e), () => {
      this.cleanupListeners.delete(e);
    };
  }
  /**
   * 启用/禁用自动清理
   */
  setAutoCleanup(e, t = 3e4) {
    this.autoCleanupInterval && (clearInterval(this.autoCleanupInterval), this.autoCleanupInterval = null), e && (this.autoCleanupInterval = window.setInterval(() => {
      this.performAutoCleanup();
    }, t));
  }
  /**
   * 生成资源报告
   */
  generateReport() {
    const e = this.getMemoryStats(), t = this.detectMemoryLeaks();
    let a = `
=== Memory Leak Protection Report ===
Total Resources: ${e.totalResources}
Memory Usage: ${Math.round(e.memoryUsage / 1024 / 1024 * 100) / 100} MB
Cleanup Count: ${e.cleanupCount}

Resources by Type:`;
    return e.resourcesByType.forEach((r, i) => {
      a += `
- ${i}: ${r}`;
    }), t.length > 0 && (a += `

Potential Leaks:`, t.forEach((r) => {
      a += `
- ${r.description}`;
    })), e.oldestResource && (a += `

Oldest Resource: ${e.oldestResource.description}`, a += `
Age: ${Math.round((Date.now() - e.oldestResource.createdAt) / 1e3)}s`), a;
  }
  /**
   * 销毁保护器
   */
  destroy() {
    this.cleanupAllResources(), this.autoCleanupInterval && (clearInterval(this.autoCleanupInterval), this.autoCleanupInterval = null), this.cleanupListeners.clear(), this.isEnabled = !1, D.instance = null;
  }
  trackResource(e) {
    if (!this.isEnabled)
      return;
    this.trackedResources.set(e.id, e);
    const t = this.detectMemoryLeaks();
    t.length > 0 && this.log("⚠️ Potential memory leaks detected:", t);
  }
  notifyCleanupListeners(e) {
    this.cleanupListeners.forEach((t) => {
      try {
        t(e);
      } catch (a) {
        console.error("Cleanup listener error:", a);
      }
    });
  }
  performAutoCleanup() {
    const e = this.detectMemoryLeaks();
    e.length > 0 && (this.log("🧹 Performing auto-cleanup due to potential leaks"), e.forEach((t) => {
      if (t.type === "timeout") {
        const a = Date.now();
        this.trackedResources.forEach((r, i) => {
          !r.destroyed && a - r.createdAt > 3e5 && this.cleanupResource(i);
        });
      } else t.count > 100 && this.cleanupResourcesByType(t.type);
    }));
  }
  startAutoCleanup() {
    this.setAutoCleanup(!0, 3e4);
  }
  setupGlobalCleanup() {
    window.addEventListener("beforeunload", () => {
      this.cleanupAllResources();
    }), setInterval(() => {
      this.detectMemoryLeaks().length > 0 && this.log("📊 Memory leak report:", this.generateReport());
    }, 6e4);
  }
  getStackTrace() {
    try {
      throw new Error("");
    } catch (e) {
      return e.stack || "";
    }
  }
  getMemoryUsage() {
    var e;
    return ((e = performance == null ? void 0 : performance.memory) == null ? void 0 : e.usedJSHeapSize) || 0;
  }
  getCleanupCount() {
    return Array.from(this.trackedResources.values()).filter((e) => e.destroyed).length;
  }
  log(e, ...t) {
    typeof window < "u" && window.DEBUG_ORCA_TABS && console.log(`[MemoryLeakProtector] ${e}`, ...t);
  }
};
b(D, "instance");
let re = D;
class ma {
  constructor(e = {}) {
    b(this, "modules", /* @__PURE__ */ new Map());
    b(this, "config");
    b(this, "loadingQueue", []);
    b(this, "activeLoaders", 0);
    b(this, "observers", /* @__PURE__ */ new Map());
    b(this, "idleCallbackId", null);
    this.config = {
      maxConcurrency: 3,
      maxRetries: 3,
      defaultTimeout: 1e4,
      preloadStrategy: "idle",
      enableCache: !0,
      enableCompression: !1,
      ...e
    }, this.setupPreloadStrategy();
  }
  /**
   * 注册懒加载模块
   */
  registerModule(e, t, a = {}) {
    const r = {
      id: e,
      loader: t,
      loaded: !1,
      loading: !1,
      failureCount: 0,
      dependencies: a.dependencies || [],
      priority: a.priority || 0,
      timeout: a.timeout || this.config.defaultTimeout,
      lastLoadTime: void 0,
      instance: void 0
    };
    this.modules.set(e, r), a.autoLoad !== !1 && r.priority >= 8 && this.loadModule(e).catch((i) => {
      console.error(`Auto-loading module ${e} failed:`, i);
    });
  }
  /**
   * 加载模块
   */
  async loadModule(e) {
    const t = this.modules.get(e);
    if (!t)
      throw new Error(`Module ${e} not found`);
    if (t.loaded && t.instance)
      return t.instance;
    if (t.loading)
      return new Promise((a, r) => {
        const i = () => {
          t.loaded && t.instance ? a(t.instance) : !t.loading && t.failureCount > this.config.maxRetries ? r(new Error(`Module ${e} failed to load after ${this.config.maxRetries} retries`)) : setTimeout(i, 100);
        };
        i();
      });
    for (const a of t.dependencies)
      await this.loadModule(a);
    return this.executeLoad(t);
  }
  /**
   * 异步加载模块（延迟加载）
   */
  async lazyLoadModule(e, t = "idle") {
    switch (t) {
      case "immediate":
        return this.loadModule(e);
      case "idle":
        return this.loadOnIdle(e);
      case "visible":
        return this.loadOnVisible(e);
      case "user_interaction":
        return this.loadOnInteraction(e);
      default:
        return this.loadModule(e);
    }
  }
  /**
   * 批量加载模块
   */
  async loadModules(e) {
    const t = e.filter((i) => {
      const n = this.modules.get(i);
      return n && !n.loaded;
    });
    if (t.length === 0)
      return [];
    t.sort((i, n) => {
      const s = this.modules.get(i);
      return this.modules.get(n).priority - s.priority;
    });
    const a = [], r = [];
    for (const i of t) {
      r.length >= this.config.maxConcurrency && await Promise.race(r);
      const n = this.loadModule(i);
      r.push(n), a.push(n);
    }
    return Promise.all(a);
  }
  /**
   * 预加载模块
   */
  async preloadModules(e) {
    const t = e.filter((a) => {
      const r = this.modules.get(a);
      return r && !r.loaded && !r.loading;
    });
    if (t.length !== 0)
      for (const a of t)
        this.loadModule(a).catch(() => {
        });
  }
  /**
   * 获取模块状态
   */
  getModuleStatus(e) {
    const t = this.modules.get(e);
    return t ? t.loaded ? "loaded" : t.loading ? "loading" : t.failureCount > this.config.maxRetries ? "failed" : "not_found" : "not_found";
  }
  /**
   * 获取所有模块状态
   */
  getAllModuleStatus() {
    const e = {};
    return this.modules.forEach((t, a) => {
      e[a] = this.getModuleStatus(a);
    }), e;
  }
  /**
   * 获取加载进度
   */
  getLoadingProgress() {
    const e = Array.from(this.modules.values()), t = e.length, a = e.filter((n) => n.loaded).length, r = e.filter((n) => n.loading).length, i = e.filter((n) => n.failureCount > this.config.maxRetries).length;
    return {
      total: t,
      loaded: a,
      loading: r,
      failed: i,
      progress: t > 0 ? Math.round(a / t * 100) : 100
    };
  }
  /**
   * 卸载模块
   */
  unloadModule(e) {
    const t = this.modules.get(e);
    return !t || !t.loaded ? !1 : (t.loaded = !1, t.instance = void 0, t.lastLoadTime = void 0, !0);
  }
  /**
   * 清理所有模块
   */
  cleanup() {
    this.observers.forEach((e) => e.disconnect()), this.observers.clear(), this.idleCallbackId && (cancelIdleCallback(this.idleCallbackId), this.idleCallbackId = null), this.modules.clear(), this.loadingQueue = [];
  }
  /**
   * 检查是否有未加载的依赖
   */
  async checkDependencies(e) {
    const t = this.modules.get(e);
    if (!t) return !1;
    for (const a of t.dependencies) {
      const r = this.getModuleStatus(a);
      ["loaded"].includes(r) || await this.loadModule(a);
    }
    return !0;
  }
  /**
   * 监听加载进度变化
   */
  onProgressChange(e) {
    const t = setInterval(() => {
      e(this.getLoadingProgress());
    }, 1e3);
    return () => clearInterval(t);
  }
  /**
   * 配置更新
   */
  updateConfig(e) {
    this.config = { ...this.config, ...e }, this.setupPreloadStrategy();
  }
  async loadOnIdle(e) {
    return new Promise((t) => {
      const a = (r) => {
        r.timeRemaining() > 0 || r.didTimeout ? this.loadModule(e).then(t) : requestIdleCallback(a);
      };
      requestIdleCallback(a);
    });
  }
  async loadOnVisible(e) {
    return new Promise((t) => {
      const a = new IntersectionObserver(
        (r) => {
          r.forEach((i) => {
            i.isIntersecting && (a.disconnect(), this.loadModule(e).then(t));
          });
        },
        { threshold: 0.1 }
      );
      a.observe(document.body), setTimeout(() => {
        a.disconnect(), this.loadModule(e).then(t);
      }, 3e4);
    });
  }
  async loadOnInteraction(e) {
    return new Promise((t) => {
      const a = () => {
        removeEventListener("click", a), removeEventListener("keydown", a), removeEventListener("scroll", a), removeEventListener("mousemove", a), removeEventListener("touchstart", a), this.loadModule(e).then(t);
      };
      addEventListener("click", a), addEventListener("keydown", a), addEventListener("scroll", a), addEventListener("mousemove", a), addEventListener("touchstart", a), setTimeout(() => {
        a();
      }, 3e4);
    });
  }
  async executeLoad(e) {
    e.loading = !0, e.failureCount++;
    try {
      const t = await Promise.race([
        e.loader(),
        new Promise(
          (a, r) => setTimeout(() => r(new Error(`Module ${e.id} timeout`)), e.timeout)
        )
      ]);
      return e.loaded = !0, e.loading = !1, e.instance = t, e.lastLoadTime = Date.now(), e.failureCount = 0, t;
    } catch (t) {
      if (e.loading = !1, e.failureCount <= this.config.maxRetries) {
        const a = Math.min(1e3 * Math.pow(2, e.failureCount - 1), 1e4);
        return await new Promise((r) => setTimeout(r, a)), this.executeLoad(e);
      } else
        throw e.failureCount = this.config.maxRetries + 1, new Error(`Module ${e.id} failed to load: ${t}`);
    }
  }
  setupPreloadStrategy() {
    switch (this.config.preloadStrategy) {
      case "idle":
        this.scheduleIdlePreload();
        break;
      case "visible":
        this.scheduleVisiblePreload();
        break;
      case "aggressive":
        this.scheduleAggressivePreload();
        break;
    }
  }
  scheduleIdlePreload() {
    this.idleCallbackId && cancelIdleCallback(this.idleCallbackId), this.idleCallbackId = requestIdleCallback(() => {
      const e = Array.from(this.modules.values()).filter((t) => t.priority >= 7 && !t.loaded && !t.loading).map((t) => t.id);
      e.length > 0 && this.preloadModules(e), this.idleCallbackId = null;
    });
  }
  scheduleVisiblePreload() {
    const e = new IntersectionObserver(
      (t) => {
        t.forEach((a) => {
          if (a.isIntersecting) {
            const r = Array.from(this.modules.keys()).filter((i) => {
              const n = this.modules.get(i);
              return !n.loaded && !n.loading && n.priority >= 5;
            });
            r.length > 0 && this.preloadModules(r.slice(0, 3));
          }
        });
      },
      { rootMargin: "100px" }
    );
    e.observe(document.body), this.observers.set("visible_preload", e);
  }
  scheduleAggressivePreload() {
    const e = Array.from(this.modules.entries()).filter(([, t]) => t.priority >= 8 && !t.loaded && !t.loading).map(([t]) => t);
    e.length > 0 && this.loadModules(e);
  }
  removeEventListener(e, t) {
    document.removeEventListener(e, t, { capture: !0 });
  }
}
class ba {
  constructor(e = {}) {
    b(this, "queue", []);
    b(this, "config");
    b(this, "isProcessing", !1);
    b(this, "processingTimer", null);
    b(this, "operationIdCounter", 0);
    b(this, "metrics");
    b(this, "processingStartTime", 0);
    this.config = {
      maxBatchSize: 50,
      maxWaitTime: 16,
      processingInterval: 16,
      enablePriorityQueue: !0,
      enableVirtualization: !0,
      virtualizationThreshold: 100,
      ...e
    }, this.metrics = {
      totalOperations: 0,
      averageBatchSize: 0,
      averageProcessingTime: 0,
      peakQueueSize: 0,
      virtualizedTimeSaved: 0
    };
  }
  /**
   * 添加操作到批次队列
   */
  addOperation(e, t, a = {}) {
    const r = {
      id: `op_${++this.operationIdCounter}`,
      type: e,
      data: t,
      priority: a.priority || 5,
      async: a.async || !1,
      timestamp: Date.now(),
      callback: a.callback
    };
    return this.queue.push(r), this.queue.length > this.metrics.peakQueueSize && (this.metrics.peakQueueSize = this.queue.length), this.queue.length >= this.config.maxBatchSize && this.processBatch(), this.processingTimer || this.scheduleProcessing(), r.id;
  }
  /**
   * 立即处理所有操作
   */
  async flush() {
    this.processingTimer && (clearTimeout(this.processingTimer), this.processingTimer = null), await this.processBatch();
  }
  /**
   * 清除队列
   */
  clear() {
    this.processingTimer && (clearTimeout(this.processingTimer), this.processingTimer = null), this.queue.forEach((e) => {
      if (e.callback)
        try {
          e.callback(null);
        } catch (t) {
          console.error(`Clear callback error for operation ${e.id}:`, t);
        }
    }), this.queue = [];
  }
  /**
   * 获取队列状态
   */
  getQueueStatus() {
    return this.metrics.averageProcessingTime = this.metrics.totalOperations > 0 ? this.calculateAverageProcessingTime() : 0, {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      estimatedProcessingTime: this.queue.length * 0.1,
      // 估算每个操作0.1ms
      lastProcessingTime: this.metrics.averageProcessingTime
    };
  }
  /**
   * 获取性能指标
   */
  getMetrics() {
    return {
      ...this.metrics,
      averageBatchSize: this.calculateAverageBatchSize(),
      virtualizedTimeSaved: this.calculateVirtualizedTimeSaved()
    };
  }
  /**
   * 重置指标
   */
  resetMetrics() {
    this.metrics = {
      totalOperations: 0,
      averageBatchSize: 0,
      averageProcessingTime: 0,
      peakQueueSize: 0,
      virtualizedTimeSaved: 0
    };
  }
  /**
   * 检查操作是否存在
   */
  hasOperation(e) {
    return this.queue.some((t) => t.id === e);
  }
  /**
   * 按类型分组操作
   */
  groupOperationsByType() {
    const e = /* @__PURE__ */ new Map();
    return this.queue.forEach((t) => {
      const a = e.get(t.type) || [];
      a.push(t), e.set(t.type, a);
    }), e;
  }
  scheduleProcessing() {
    this.processingTimer = setTimeout(async () => {
      await this.processBatch(), this.queue.length > 0 ? this.scheduleProcessing() : this.processingTimer = null;
    }, this.config.processingInterval);
  }
  async processBatch() {
    if (this.isProcessing || this.queue.length === 0)
      return;
    this.isProcessing = !0, this.processingStartTime = performance.now(), this.config.enablePriorityQueue && this.queue.sort((r, i) => i.priority - r.priority);
    const e = Math.min(this.queue.length, this.config.maxBatchSize), t = this.queue.splice(0, e), a = this.groupOperations(t);
    for (const [r, i] of a)
      await this.processOperationGroup(r, i);
    this.updateMetrics(e), this.isProcessing = !1;
  }
  groupOperations(e) {
    const t = /* @__PURE__ */ new Map();
    return e.forEach((a) => {
      const r = t.get(a.type) || [];
      r.push(a), t.set(a.type, r);
    }), t;
  }
  async processOperationGroup(e, t) {
    try {
      switch (e) {
        case "dom":
          await this.processDOMOperations(t);
          break;
        case "css":
          await this.processCSSOperations(t);
          break;
        case "animation":
          await this.processAnimationOperations(t);
          break;
        case "data":
          await this.processDataOperations(t);
          break;
        default:
          await this.processGenericOperations(t);
          break;
      }
    } catch (a) {
      console.error(`Processing ${e} operations failed:`, a), t.forEach((r) => {
        if (r.callback)
          try {
            r.callback(a);
          } catch (i) {
            console.error(`Callback error for operation ${r.id}:`, i);
          }
      });
    }
  }
  async processDOMOperations(e) {
    const t = document.createDocumentFragment(), a = [];
    e.forEach((r) => {
      switch (r.type) {
        case "appendChild":
          a.push(() => {
            const i = r.data;
            i instanceof HTMLElement && t.appendChild(i);
          });
          break;
        case "removeChild":
          a.push(() => {
            const i = r.data;
            i && i.parentNode && i.parentNode.removeChild(i);
          });
          break;
        case "setAttribute":
          a.push(() => {
            const { element: i, name: n, value: s } = r.data;
            i && i.setAttribute && i.setAttribute(n, s);
          });
          break;
        case "setStyle":
          a.push(() => {
            const { element: i, styles: n } = r.data;
            i && i.style && Object.assign(i.style, n);
          });
          break;
      }
    }), await new Promise((r) => {
      requestAnimationFrame(() => {
        a.forEach((i) => i()), t.hasChildNodes() && (document.querySelector(".orca-tab-container") || document.body).appendChild(t), e.forEach((i) => {
          i.callback && i.callback(!0);
        }), r();
      });
    });
  }
  async processCSSOperations(e) {
    const t = /* @__PURE__ */ new Map();
    e.forEach((a) => {
      const { selector: r, styles: i } = a.data;
      r && i && t.set(r, i);
    }), t.size > 0 && await new Promise((a) => {
      requestAnimationFrame(() => {
        t.forEach((r, i) => {
          const n = document.querySelector(i);
          n instanceof HTMLElement && Object.assign(n.style, r);
        }), e.forEach((r) => {
          r.callback && r.callback(!0);
        }), a();
      });
    });
  }
  async processAnimationOperations(e) {
    const t = [];
    e.forEach((a) => {
      const { element: r, keyframes: i, options: n } = a.data;
      if (r && i && n)
        try {
          const s = r.animate(i, n);
          t.push(s);
        } catch (s) {
          console.error("Animation creation failed:", s);
        }
    }), t.length > 0 && (await Promise.allSettled(
      t.map(
        (a) => a.finished.catch(() => {
        })
      )
    ), e.forEach((a) => {
      a.callback && a.callback(!0);
    }));
  }
  async processDataOperations(e) {
    const t = [];
    e.forEach((a) => {
      t.push(async () => {
        const { target: r, method: i, params: n } = a.data;
        if (r && i)
          try {
            const s = await r[i](...n);
            a.callback && a.callback(s);
          } catch (s) {
            a.callback && a.callback(s);
          }
      });
    }), await Promise.all(t.map((a) => a()));
  }
  async processGenericOperations(e) {
    const t = [];
    e.forEach((a) => {
      typeof a.data == "function" && t.push(a.data);
    }), await new Promise((a) => {
      requestAnimationFrame(() => {
        t.forEach((r) => {
          try {
            r();
          } catch (i) {
            console.error("Generic operation failed:", i);
          }
        }), e.forEach((r) => {
          r.callback && r.callback(!0);
        }), a();
      });
    });
  }
  updateMetrics(e) {
    const t = performance.now() - this.processingStartTime;
    this.metrics.totalOperations += e;
    const a = this.metrics.averageProcessingTime * (this.metrics.totalOperations - e) + t;
    this.metrics.averageProcessingTime = a / this.metrics.totalOperations;
    const r = this.queue.length;
    r > this.metrics.peakQueueSize && (this.metrics.peakQueueSize = r);
  }
  calculateAverageBatchSize() {
    return this.metrics.totalOperations > 0 ? Math.round(this.metrics.totalOperations / Math.max(1, this.metrics.totalOperations / this.config.maxBatchSize)) : 0;
  }
  calculateAverageProcessingTime() {
    return this.metrics.averageProcessingTime;
  }
  calculateVirtualizedTimeSaved() {
    return this.config.enableVirtualization ? Math.max(0, this.metrics.peakQueueSize - this.config.maxBatchSize) * 0.1 : 0;
  }
  /**
   * 销毁处理器
   */
  destroy() {
    this.processingTimer && (clearTimeout(this.processingTimer), this.processingTimer = null), this.clear(), this.resetMetrics();
  }
}
const A = class A {
  constructor() {
    b(this, "metrics", /* @__PURE__ */ new Map());
    b(this, "thresholds", /* @__PURE__ */ new Map());
    b(this, "config");
    b(this, "isMonitoring", !1);
    b(this, "intervalId", null);
    b(this, "observers", /* @__PURE__ */ new Map());
    b(this, "reportCallbacks", /* @__PURE__ */ new Set());
    b(this, "performanceEntries", []);
    this.config = {
      samplingInterval: 5e3,
      reportInterval: 3e4,
      historyRetention: 3e5,
      // 5分钟
      enableAutoOptimization: !0,
      enableTrendAnalysis: !0,
      thresholds: this.getDefaultThresholds()
    }, this.setupDefaultThresholds(), this.setupObservers();
  }
  /**
   * 获取单例实例
   */
  static getInstance() {
    return A.instance || (A.instance = new A()), A.instance;
  }
  /**
   * 开始监控
   */
  startMonitoring() {
    this.isMonitoring || (this.isMonitoring = !0, this.intervalId = window.setInterval(() => {
      this.collectMetrics();
    }, this.config.samplingInterval), window.setInterval(() => {
      this.generateReport();
    }, this.config.reportInterval));
  }
  /**
   * 停止监控
   */
  stopMonitoring() {
    this.intervalId && (clearInterval(this.intervalId), this.intervalId = null), this.isMonitoring = !1;
  }
  /**
   * 记录指标
   */
  recordMetric(e, t, a = "", r = "custom") {
    const i = this.thresholds.get(e), n = i ? t <= i.error : !0, s = {
      name: e,
      value: t,
      unit: a,
      timestamp: Date.now(),
      type: r,
      healthy: n
    };
    this.addMetric(s);
  }
  /**
   * 开始性能测量
   */
  startMeasurement(e) {
    const t = performance.now();
    return () => {
      const a = performance.now() - t;
      return this.recordMetric(e, a, "ms", "duration"), a;
    };
  }
  /**
   * 记录内存使用情况
   */
  recordMemoryUsage() {
    if ("memory" in performance) {
      const e = performance.memory;
      this.recordMetric("memory_heap", e.usedJSHeapSize, "bytes"), this.recordMetric("memory_heap_total", e.totalJSHeapSize, "bytes"), this.recordMetric("memory_heap_limit", e.jsHeapSizeLimit, "bytes");
    }
  }
  /**
   * 记录DOM操作性能
   */
  recordDOMOperation(e, t) {
    this.recordMetric(`dom_${e}`, t, "ms", "duration");
  }
  /**
   * 记录渲染性能
   */
  recordRenderPerformance() {
    "getEntriesByType" in performance && performance.getEntriesByType("measure").forEach((t) => {
      this.recordMetric(`render_${t.name}`, t.duration, "ms", "duration");
    });
  }
  /**
   * 获取指标历史
   */
  getMetricHistory(e, t) {
    const a = this.metrics.get(e) || [];
    if (t) {
      const r = Date.now() - t;
      return a.filter((i) => i.timestamp >= r);
    }
    return a;
  }
  /**
   * 获取最新指标值
   */
  getLatestMetric(e) {
    const t = this.metrics.get(e);
    return t && t.length > 0 ? t[t.length - 1] : null;
  }
  /**
   * 生成性能报告
   */
  generateReport() {
    const e = `report_${Date.now()}`, t = this.calculateHealthScore(), a = this.analyzeIssues(), r = this.analyzeTrends(), i = this.generateRecommendations(), n = {
      id: e,
      timestamp: Date.now(),
      healthScore: t,
      issues: a,
      metrics: this.getAllCurrentMetrics(),
      trends: r,
      recommendations: i
    };
    return this.reportCallbacks.forEach((s) => {
      try {
        s(n);
      } catch (c) {
        console.error("Performance report callback error:", c);
      }
    }), n;
  }
  /**
   * 监听报告变化
   */
  onReportChange(e) {
    return this.reportCallbacks.add(e), () => {
      this.reportCallbacks.delete(e);
    };
  }
  /**
   * 手动触发优化
   */
  triggerOptimization() {
    const e = [];
    return this.getAllRecentMetrics(), this.analyzeIssues().forEach((a) => {
      switch (a.metric) {
        case "memory_heap":
          a.type === "error" && (e.push({
            action: "触发垃圾收集",
            impact: "清理未使用内存"
          }), "gc" in window && window.gc());
          break;
        case "dom_update":
          a.type === "warning" && e.push({
            action: "批量DOM操作",
            impact: "减少重排重绘"
          });
          break;
        case "render_frame":
          a.type === "warning" && e.push({
            action: "启用CSS transform",
            impact: "优化渲染性能"
          });
          break;
      }
    }), e;
  }
  /**
   * 设置指标阈值
   */
  setThreshold(e, t, a, r) {
    this.thresholds.set(e, {
      name: e,
      warning: t,
      error: a,
      recommended: r || Math.min(t, a) * 0.5
    });
  }
  /**
   * 更新配置
   */
  updateConfig(e) {
    this.config = { ...this.config, ...e }, e.samplingInterval && this.intervalId && (this.stopMonitoring(), setTimeout(() => this.startMonitoring(), 100));
  }
  /**
   * 导出性能数据
   */
  exportData() {
    const e = {};
    return this.metrics.forEach((t, a) => {
      e[a] = t;
    }), {
      metrics: e,
      config: this.config,
      report: this.generateReport()
    };
  }
  /**
   * 清理旧数据
   */
  cleanup() {
    const e = Date.now() - this.config.historyRetention;
    this.metrics.forEach((t, a) => {
      const r = t.filter((i) => i.timestamp >= e);
      this.metrics.set(a, r);
    }), this.performanceEntries = this.performanceEntries.filter((t) => t.startTime >= e);
  }
  addMetric(e) {
    const t = this.metrics.get(e.name) || [];
    t.push(e);
    const a = Date.now() - this.config.historyRetention, r = t.filter((i) => i.timestamp >= a);
    this.metrics.set(e.name, r);
  }
  collectMetrics() {
    this.recordMemoryUsage(), this.recordRenderPerformance(), this.recordFPS(), this.recordDOMMetrics();
  }
  recordFPS() {
    let e = performance.now(), t = 0;
    const a = () => {
      t++;
      const r = performance.now();
      if (r - e >= 1e3) {
        const i = Math.round(t * 1e3 / (r - e));
        this.recordMetric("fps", i, "fps"), t = 0, e = r;
      }
      requestAnimationFrame(a);
    };
    requestAnimationFrame(a);
  }
  recordDOMMetrics() {
    const e = new MutationObserver((t) => {
      this.recordMetric("dom_mutations", t.length, "count"), t.forEach((a) => {
        a.type === "childList" && this.recordMetric(
          "dom_nodes_changed",
          a.addedNodes.length + a.removedNodes.length,
          "count"
        );
      });
    });
    e.observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0
    }), setTimeout(() => e.disconnect(), 3e4);
  }
  calculateHealthScore() {
    const e = this.getAllCurrentMetrics();
    let t = 0, a = 0;
    return e.forEach((r) => {
      const i = this.thresholds.get(r.name);
      i && (a++, r.value <= i.recommended ? t += 100 : r.value <= i.error ? t += Math.max(0, 100 - (r.value - i.recommended) / i.recommended * 50) : t += Math.max(0, 50 - (r.value - i.error) / i.error * 40));
    }), a > 0 ? Math.round(t / a) : 100;
  }
  analyzeIssues() {
    const e = [];
    return this.thresholds.forEach((t, a) => {
      const r = this.getLatestMetric(a);
      r && (r.value > t.error ? e.push({
        type: "error",
        message: `${a} 严重超标: ${r.value}${r.unit}`,
        metric: a,
        impact: "critical",
        recommendation: `需要立即优化 ${a}，建议值: ${t.recommended}${r.unit}`
      }) : r.value > t.warning && e.push({
        type: "warning",
        message: `${a} 接近警告阈值: ${r.value}${r.unit}`,
        metric: a,
        impact: "medium",
        recommendation: `优化 ${a}，目标: ${t.recommended}${r.unit}`
      }));
    }), e;
  }
  analyzeTrends() {
    const e = [];
    return this.metrics.forEach((t, a) => {
      if (t.length < 2) return;
      const r = t.slice(-5), i = t.slice(-10, -5);
      if (r.length > 0 && i.length > 0) {
        const n = r.reduce((d, h) => d + h.value, 0) / r.length, s = i.reduce((d, h) => d + h.value, 0) / i.length, c = s > 0 ? (n - s) / s * 100 : 0;
        let l;
        c < -5 ? l = "improving" : c > 5 ? l = "degrading" : l = "stable", e.push({
          metric: a,
          trend: l,
          changePercent: Math.round(c)
        });
      }
    }), e;
  }
  generateRecommendations() {
    const e = [];
    return this.analyzeIssues().forEach((a) => {
      switch (a.metric) {
        case "memory_heap":
          e.push({
            priority: "high",
            category: "memory",
            description: "内存使用过高",
            estimatedImpact: "减少30-50%内存使用",
            implementation: "实现对象池、延迟加载、及时清理事件监听器"
          });
          break;
        case "fps":
          e.push({
            priority: "high",
            category: "rendering",
            description: "帧率过低",
            estimatedImpact: "提升20-40%渲染性能",
            implementation: "使用requestAnimationFrame、CSS transform、虚拟滚动"
          });
          break;
        case "dom_updates":
          e.push({
            priority: "medium",
            category: "dom",
            description: "DOM操作频繁",
            estimatedImpact: "减少90%重排重绘",
            implementation: "批量DOM操作、使用DocumentFragment"
          });
          break;
      }
    }), e;
  }
  getAllCurrentMetrics() {
    const e = [];
    return this.metrics.forEach((t) => {
      t.length > 0 && e.push(t[t.length - 1]);
    }), e;
  }
  getAllRecentMetrics() {
    const e = [];
    return this.metrics.forEach((t) => {
      e.push(...t.slice(-10));
    }), e;
  }
  setupDefaultThresholds() {
    this.getDefaultThresholds().forEach((t) => {
      this.thresholds.set(t.name, t);
    });
  }
  getDefaultThresholds() {
    return [
      {
        name: "memory_heap",
        warning: 50 * 1024 * 1024,
        // 50MB
        error: 100 * 1024 * 1024,
        // 100MB
        recommended: 30 * 1024 * 1024
        // 30MB
      },
      {
        name: "fps",
        warning: 45,
        error: 30,
        recommended: 60
      },
      {
        name: "dom_updates",
        warning: 100,
        error: 500,
        recommended: 50
      },
      {
        name: "render_frame",
        warning: 16,
        error: 33,
        recommended: 8
      }
    ];
  }
  setupObservers() {
    if ("PerformanceObserver" in window)
      try {
        const e = new PerformanceObserver((t) => {
          t.getEntries().forEach((a) => {
            this.recordMetric("long_task", a.duration, "ms", "duration");
          });
        });
        e.observe({ entryTypes: ["longtask"] }), this.observers.set("longtask", e);
      } catch {
      }
  }
  /**
   * 销毁监控器
   */
  destroy() {
    this.stopMonitoring(), this.observers.forEach((e) => e.disconnect()), this.observers.clear(), this.reportCallbacks.clear(), this.metrics.clear(), this.thresholds.clear(), A.instance = null;
  }
};
b(A, "instance");
let Y = A;
const z = class z {
  constructor() {
    b(this, "mutationObserver", null);
    b(this, "debounceOptimizer", null);
    b(this, "memoryLeakProtector", null);
    b(this, "lazyLoadingOptimizer", null);
    b(this, "batchProcessor", null);
    b(this, "performanceMonitor", null);
    b(this, "config");
    b(this, "isInitialized", !1);
    b(this, "initializationPromise", null);
    this.config = this.getDefaultConfig();
  }
  /**
   * 获取单例实例
   */
  static getInstance() {
    return z.instance || (z.instance = new z()), z.instance;
  }
  /**
   * 初始化性能优化器
   */
  async initialize(e) {
    if (!this.isInitialized) {
      if (this.initializationPromise)
        return this.initializationPromise;
      this.initializationPromise = this.performInitialization(e), await this.initializationPromise;
    }
  }
  /**
   * 执行初始化
   */
  async performInitialization(e) {
    try {
      e && this.applyConfig(e), this.config.mutationObserver && (this.mutationObserver = new pa(
        this.config.mutationObserver,
        {
          onBatchMutations: (t) => {
            this.log("MutationObserver: Processing batch of", t.length, "mutations");
          },
          onHotMutation: (t) => {
            this.log("MutationObserver: Hot mutation detected", t);
          },
          onThrottledMutation: (t) => {
            this.log("MutationObserver: Throttled", t.length, "mutations");
          }
        }
      )), this.config.debounce.length > 0 && (this.debounceOptimizer = new ga(), this.config.debounce.forEach((t) => {
        this.debounceOptimizer.addLayer(t.name, t);
      })), this.config.memoryLeak.enableAutoCleanup && (this.memoryLeakProtector = re.getInstance(), this.memoryLeakProtector.setAutoCleanup(!0, this.config.memoryLeak.autoCleanupInterval)), this.config.lazyLoading && (this.lazyLoadingOptimizer = new ma(this.config.lazyLoading)), this.config.batchProcessing && (this.batchProcessor = new ba(this.config.batchProcessing)), this.config.performanceMonitoring.enableMonitoring && (this.performanceMonitor = Y.getInstance(), this.performanceMonitor.updateConfig({
        reportInterval: this.config.performanceMonitoring.reportInterval,
        enableAutoOptimization: this.config.performanceMonitoring.enableAutoOptimization
      }), this.performanceMonitor.startMonitoring(), this.performanceMonitor.onReportChange((t) => {
        this.handlePerformanceReport(t);
      })), this.setupGlobalCleanup(), this.isInitialized = !0, this.log("所有性能优化器初始化完成");
    } catch (t) {
      throw this.log("性能优化器初始化失败:", t), t;
    }
  }
  /**
   * 开始DOM变化观察
   */
  startDOMObservation(e, t) {
    return this.mutationObserver ? (this.mutationObserver.observe(e, t), this.log("开始DOM变化观察"), this.mutationObserver) : (this.log("MutationObserver未初始化"), null);
  }
  /**
   * 停止DOM变化观察
   */
  stopDOMObservation() {
    this.mutationObserver && (this.mutationObserver.disconnect(), this.log("停止DOM变化观察"));
  }
  /**
   * 执行优化任务
   */
  async executeTask(e, t = [], a = "normal") {
    return this.debounceOptimizer ? this.debounceOptimizer.execute(e, t, a) : e(...t);
  }
  /**
   * 跟踪资源
   */
  trackEventListener(e, t, a, r) {
    return this.memoryLeakProtector ? this.memoryLeakProtector.trackEventListener(e, t, a, r) : (e.addEventListener(t, a, r), null);
  }
  /**
   * 跟踪定时器
   */
  trackTimer(e, t = "timeout") {
    return this.memoryLeakProtector ? this.memoryLeakProtector.trackTimer(e, t) : null;
  }
  /**
   * 跟踪观察者
   */
  trackObserver(e, t = "mutation") {
    return this.memoryLeakProtector ? this.memoryLeakProtector.trackObserver(e, t) : null;
  }
  /**
   * 注册懒加载模块
   */
  registerLazyModule(e, t, a) {
    this.lazyLoadingOptimizer && this.lazyLoadingOptimizer.registerModule(e, t, a);
  }
  /**
   * 添加批量操作
   */
  addBatchOperation(e, t, a) {
    return this.batchProcessor ? this.batchProcessor.addOperation(e, t, a) : null;
  }
  /**
   * 记录性能指标
   */
  recordMetric(e, t, a, r) {
    this.performanceMonitor && this.performanceMonitor.recordMetric(e, t, a, r);
  }
  /**
   * 开始性能测量
   */
  startPerformanceMeasurement(e) {
    return this.performanceMonitor ? this.performanceMonitor.startMeasurement(e) : null;
  }
  /**
   * 清理资源
   */
  cleanupResource(e) {
    return this.memoryLeakProtector ? this.memoryLeakProtector.cleanupResource(e) : !1;
  }
  /**
   * 清理所有资源
   */
  cleanupAllResources() {
    return this.memoryLeakProtector ? this.memoryLeakProtector.cleanupAllResources() : null;
  }
  /**
   * 获取优化状态
   */
  getOptimizationStatus() {
    const e = {
      mutationObserver: this.mutationObserver !== null,
      debounceOptimizer: this.debounceOptimizer !== null,
      memoryLeakProtection: this.memoryLeakProtector !== null,
      lazyLoading: this.lazyLoadingOptimizer !== null,
      batchProcessing: this.batchProcessor !== null,
      performanceMonitoring: this.performanceMonitor !== null
    }, t = Object.values(e).some((i) => i), a = this.determineHealthStatus(), r = this.generateOptimizationSuggestions();
    return {
      enabled: t,
      components: e,
      health: a,
      suggestions: r
    };
  }
  /**
   * 获取性能报告
   */
  getPerformanceReport() {
    return this.performanceMonitor ? this.performanceMonitor.generateReport() : null;
  }
  /**
   * 获取内存统计
   */
  getMemoryStats() {
    return this.memoryLeakProtector ? this.memoryLeakProtector.getMemoryStats() : null;
  }
  /**
   * 触发优化
   */
  triggerOptimization() {
    if (this.performanceMonitor && this.performanceMonitor.triggerOptimization(), this.memoryLeakProtector) {
      const e = this.memoryLeakProtector.detectMemoryLeaks();
      e.length > 0 && (this.log("检测到内存泄漏，开始清理:", e), this.memoryLeakProtector.cleanupAllResources());
    }
    this.batchProcessor && this.batchProcessor.flush();
  }
  /**
   * 生成优化报告
   */
  generateOptimizationReport() {
    const e = this.getOptimizationStatus(), t = this.getPerformanceReport(), a = this.getMemoryStats();
    let r = `
=== 性能优化报告 ===

整体状态: ${e.enabled ? "启用" : "禁用"}
健康程度: ${e.health}
组件状态:
  - MutationObserver: ${e.components.mutationObserver ? "激活" : "未激活"}
  - 防抖优化器: ${e.components.debounceOptimizer ? "激活" : "未激活"}
  - 内存保护: ${e.components.memoryLeakProtection ? "激活" : "未激活"}
  - 懒加载: ${e.components.lazyLoading ? "激活" : "未激活"}
  - 批量处理: ${e.components.batchProcessing ? "激活" : "未激活"}
  - 性能监控: ${e.components.performanceMonitoring ? "激活" : "未激活"}

优化建议:
${e.suggestions.map((i) => `  - ${i}`).join(`
`)}
`;
    return t && (r += `
性能指标:
  健康分数: ${t.healthScore}/ 100
  当前问题数: ${t.issues.length}
`), a && (r += `
内存统计:
  跟踪资源: ${a.totalResources}
  内存使用: ${Math.round(a.memoryUsage / 1024 / 1024 * 100) / 100} MB
`), r;
  }
  /**
   * 销毁优化器
   */
  destroy() {
    this.stopDOMObservation(), this.debounceOptimizer && this.debounceOptimizer.destroy(), this.memoryLeakProtector && this.memoryLeakProtector.destroy(), this.lazyLoadingOptimizer && this.lazyLoadingOptimizer.cleanup(), this.batchProcessor && this.batchProcessor.destroy(), this.performanceMonitor && this.performanceMonitor.destroy(), this.isInitialized = !1, this.initializationPromise = null, this.log("所有性能优化器已销毁");
  }
  /**
   * 应用配置
   */
  applyConfig(e) {
    this.config = { ...this.config, ...e };
  }
  /**
   * 处理性能报告
   */
  handlePerformanceReport(e) {
    this.log("收到性能报告:", e), this.config.performanceMonitoring.enableAutoOptimization && e.healthScore < 50 && (this.log("性能评分过低，触发自动优化"), this.triggerOptimization());
    const t = e.issues.filter((a) => a.impact === "critical");
    t.length > 0 && (this.log("检测到关键性能问题:", t), this.triggerOptimization());
  }
  /**
   * 确定健康状态
   */
  determineHealthStatus() {
    const e = Object.values(this.getOptimizationStatus().components).filter((a) => a).length, t = this.getPerformanceReport();
    return e >= 5 && t && t.healthScore >= 80 ? "excellent" : e >= 4 && t && t.healthScore >= 60 ? "good" : e >= 3 && t && t.healthScore >= 40 ? "warning" : "critical";
  }
  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions() {
    const e = [], t = this.getOptimizationStatus(), a = this.getPerformanceReport();
    return t.components.mutationObserver || e.push("启用MutationObserver优化以减少DOM监听开销"), t.components.debounceOptimizer || e.push("启用防抖优化器以处理高频操作"), t.components.memoryLeakProtection || e.push("启用内存泄漏保护以防止内存泄露"), t.components.lazyLoading || e.push("启用懒加载以延迟非关键功能"), t.components.batchProcessing || e.push("启用批量处理以优化DOM操作"), t.components.performanceMonitoring || e.push("启用性能监控以实时追踪性能指标"), a && a.recommendations.forEach((r) => {
      e.push(`[${r.priority}] ${r.description}`);
    }), e;
  }
  /**
   * 设置全局清理
   */
  setupGlobalCleanup() {
    window.addEventListener("beforeunload", () => {
      this.cleanupAllResources();
    }), setInterval(() => {
      const e = this.getMemoryStats();
      e && e.totalResources > 1e3 && (this.log("资源过多，触发清理"), this.triggerOptimization());
    }, 6e4);
  }
  /**
   * 获取默认配置
   */
  getDefaultConfig() {
    return {
      mutationObserver: {
        enableBatch: !0,
        batchDelay: 16,
        maxBatchSize: 50,
        enableSmartFilter: !0,
        coolingPeriod: 100
      },
      debounce: [
        { name: "immediate", delay: 0, priority: 10, cancelable: !1 },
        { name: "high", delay: 8, priority: 8, cancelable: !0, maxWait: 100 },
        { name: "normal", delay: 16, priority: 5, cancelable: !0, maxWait: 200 },
        { name: "low", delay: 32, priority: 3, cancelable: !0, maxWait: 500 },
        { name: "idle", delay: 100, priority: 1, cancelable: !0, maxWait: 1e3 }
      ],
      memoryLeak: {
        autoCleanupInterval: 3e4,
        enableAutoCleanup: !0
      },
      lazyLoading: {
        enableCache: !0,
        maxConcurrency: 3,
        preloadStrategy: "idle"
      },
      batchProcessing: {
        maxBatchSize: 50,
        maxWaitTime: 16,
        enableVirtualization: !0
      },
      performanceMonitoring: {
        enableMonitoring: !0,
        enableAutoOptimization: !0,
        reportInterval: 3e4
      }
    };
  }
  log(e, ...t) {
    typeof window < "u" && window.DEBUG_ORCA_TABS && console.log(`[PerformanceOptimizerManager] ${e}`, ...t);
  }
};
b(z, "instance");
let ie = z;
function fa(o, e, t) {
  var a, r;
  try {
    const i = o.startsWith("#") ? o : `#${o}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(i))
      return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const n = parseInt(i.slice(1, 3), 16), s = parseInt(i.slice(3, 5), 16), c = parseInt(i.slice(5, 7), 16), l = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((r = (a = window.orca) == null ? void 0 : a.state) == null ? void 0 : r.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${n}, ${s}, ${c}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${n}, ${s}, ${c}) calc(l * 1.05) c h)` : `oklch(from rgb(${n}, ${s}, ${c}) calc(l * 0.6) c h)`;
  } catch {
    return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
var P = /* @__PURE__ */ ((o) => (o[o.ERROR = 0] = "ERROR", o[o.WARN = 1] = "WARN", o[o.INFO = 2] = "INFO", o[o.DEBUG = 3] = "DEBUG", o[o.VERBOSE = 4] = "VERBOSE", o))(P || {});
const va = 2;
function te(o, ...e) {
  console.info("[OrcaPlugin]", o, ...e);
}
function ya(o, ...e) {
  console.error("[OrcaPlugin]", o, ...e);
}
function xa(o, ...e) {
  console.warn("[OrcaPlugin]", o, ...e);
}
function Ta(o, e, t, a) {
  const r = document.createElement("div");
  r.className = o ? "orca-tabs-plugin orca-tabs-container vertical" : "orca-tabs-plugin orca-tabs-container";
  const i = aa(o, e, a, t);
  return r.style.cssText = i, r;
}
function wa(o, e, t) {
  const a = document.createElement("div");
  a.className = "width-adjustment-dialog";
  const r = ea();
  a.style.cssText = r;
  const i = document.createElement("div");
  i.className = "dialog-title", i.textContent = "调整面板宽度", a.appendChild(i);
  const n = document.createElement("div");
  n.className = "dialog-slider-container", n.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const s = document.createElement("input");
  s.type = "range", s.min = "120", s.max = "800", s.value = o.toString(), s.style.cssText = ta();
  const c = document.createElement("div");
  c.className = "dialog-width-display", c.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, c.textContent = `当前宽度: ${o}px`, s.oninput = () => {
    const u = parseInt(s.value);
    c.textContent = `当前宽度: ${u}px`, e(u);
  }, n.appendChild(s), n.appendChild(c), a.appendChild(n);
  const l = document.createElement("div");
  l.className = "dialog-buttons", l.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = pe(), d.onclick = () => ge(a);
  const h = document.createElement("button");
  return h.className = "btn btn-secondary", h.textContent = "取消", h.style.cssText = pe(), h.onclick = () => {
    t(), ge(a);
  }, l.appendChild(d), l.appendChild(h), a.appendChild(l), a;
}
function ge(o) {
  o && o.parentNode && o.parentNode.removeChild(o);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function ka() {
  if (document.getElementById("dialog-styles")) return;
  const o = document.createElement("style");
  o.id = "dialog-styles", o.textContent = `
    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-20px);
        opacity: 0;
      }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
    
    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    
    .dialog-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .dialog-message {
      margin-bottom: 20px;
      line-height: 1.5;
    }
    
    .dialog-input-container {
      margin: 20px 0;
    }
    
    .dialog-progress-container {
      margin: 20px 0;
    }
    
    .dialog-progress-bar {
      width: 100%;
      height: 8px;
      background-color: #e0e0e0;
      border-radius: var(--orca-radius-md);
      overflow: hidden;
    }
    
    .dialog-progress-fill {
      height: 100%;
      background-color: #2196f3;
      transition: width 0.3s ease;
    }
    
    .dialog-progress-text {
      text-align: center;
      margin-top: 8px;
      font-size: 14px;
      color: #666;
    }
    
    .dialog-close {
      position: absolute;
      top: 10px;
      right: 15px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #999;
      line-height: 1;
    }
    
    .dialog-close:hover {
      color: #333;
    }
    
    .btn {
      padding: .175rem var(--orca-spacing-md);
      border: none;
      border-radius: var(--orca-radius-md);
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s ease;
    }
    
    .btn-primary {
      background-color: #2196f3;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #1976d2;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .btn-secondary:hover {
      background-color: #e0e0e0;
    }
  `, document.head.appendChild(o);
}
function Ca(o, e) {
  return o.length !== e.length ? !0 : !o.every((t, a) => t === e[a]);
}
let V;
class Sa {
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(e) {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    /** 插件名称 - 动态获取的插件名称，用于API调用和存储 */
    b(this, "pluginName");
    // ==================== 重构的面板数据管理 ====================
    /** 面板顺序映射 - 存储面板ID和序号的映射关系，支持面板关闭后重新排序 */
    b(this, "panelOrder", []);
    /** 当前激活的面板ID - 通过.orca-panel.active获取 */
    b(this, "currentPanelId", null);
    /** 当前面板索引 - 在panelOrder数组中的索引位置 */
    b(this, "currentPanelIndex", -1);
    /** 每个面板的标签页数据 - 索引对应panelOrder数组，完全独立存储 */
    b(this, "panelTabsData", []);
    /** 存储服务实例 - 提供统一的数据存储接口，支持Orca API和localStorage降级 */
    b(this, "storageService", new Pe());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    b(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    b(this, "lastPanelCheckTime", 0);
    /** 上次面板块检查时间 - 用于防抖 checkCurrentPanelBlocks 调用 */
    b(this, "lastBlockCheckTime", 0);
    /** 数据保存防抖定时器 - 用于合并频繁的保存操作 */
    b(this, "saveDataDebounceTimer", null);
    /** 数据保存防抖延迟（毫秒） - 默认300ms内的多次保存操作会被合并 */
    b(this, "SAVE_DEBOUNCE_DELAY", 300);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 当前日志级别 */
    b(this, "currentLogLevel", va);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* UI元素和状态管理 - UI Elements and State Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== UI元素引用 ====================
    /** 标签页容器元素 - 包含所有标签页的主容器 */
    b(this, "tabContainer", null);
    /** 循环切换器元素 - 用于在面板间切换的UI元素 */
    b(this, "cycleSwitcher", null);
    // ==================== 拖拽状态 ====================
    /** 是否正在拖拽 - 标识当前是否处于拖拽状态 */
    b(this, "isDragging", !1);
    /** 是否正在切换标签 - 防止在标签切换过程中错误替换标签 */
    b(this, "isSwitchingTab", !1);
    /** 拖拽起始X坐标 - 记录拖拽开始时的鼠标X坐标 */
    b(this, "dragStartX", 0);
    /** 拖拽起始Y坐标 - 记录拖拽开始时的鼠标Y坐标 */
    b(this, "dragStartY", 0);
    // ==================== 配置参数 ====================
    /** 最大标签页数量 - 限制同时显示的标签页数量，从设置中读取 */
    b(this, "maxTabs", 10);
    /** 主页块ID - 主页块的唯一标识符，从设置中读取 */
    b(this, "homePageBlockId", null);
    /** 标签页位置 - 标签页容器的屏幕坐标位置 */
    b(this, "position", { x: 50, y: 50 });
    // ==================== 状态管理 ====================
    /** 监控定时器 - 用于定期检查面板状态和更新UI */
    b(this, "monitoringInterval", null);
    /** 焦点同步定时器 - 控制自动同步焦点的轮询逻辑 */
    b(this, "focusSyncInterval", null);
    /** 上一次焦点检测的状态 - 用于避免重复调用 checkCurrentPanelBlocks */
    b(this, "lastFocusState", null);
    /** 面板块检测任务 - 防止 checkCurrentPanelBlocks 并发执行 */
    b(this, "panelBlockCheckTask", null);
    /** 面板状态检测任务 - 防止 checkPanelStatusChange 并发执行 */
    b(this, "panelStatusCheckTask", null);
    /** 正在创建的标签 - 防止重复创建同一个标签 */
    b(this, "creatingTabs", /* @__PURE__ */ new Set());
    /** 全局事件监听器 - 统一的全局事件处理函数 */
    b(this, "globalEventListener", null);
    /** 更新防抖计时器 - 防止频繁更新UI的防抖机制 */
    b(this, "updateDebounceTimer", null);
    /** 上次更新时间 - 记录最后一次UI更新的时间戳 */
    b(this, "lastUpdateTime", 0);
    /** 是否正在更新 - 标识当前是否正在进行UI更新操作 */
    b(this, "isUpdating", !1);
    /** 是否已完成初始化 - 标识插件是否已完成初始化过程 */
    b(this, "isInitialized", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 布局和位置管理 - Layout and Position Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 布局模式 ====================
    /** 垂直模式标志 - 标识当前是否处于垂直布局模式 */
    b(this, "isVerticalMode", !1);
    /** 垂直模式窗口宽度 - 垂直布局模式下的标签页容器宽度 */
    b(this, "verticalWidth", 120);
    /** 垂直模式位置 - 垂直布局模式下的标签页容器位置 */
    b(this, "verticalPosition", { x: 20, y: 20 });
    /** 水平模式位置 - 水平布局模式下的标签页容器位置 */
    b(this, "horizontalPosition", { x: 20, y: 20 });
    // ==================== 调整大小状态 ====================
    /** 是否正在调整大小 - 标识当前是否正在进行大小调整操作 */
    b(this, "isResizing", !1);
    /** 是否固定到顶部 - 标识标签页容器是否固定到屏幕顶部 */
    b(this, "isFixedToTop", !1);
    /** 调整大小手柄 - 用于调整标签页容器大小的拖拽手柄元素 */
    b(this, "resizeHandle", null);
    // ==================== 侧边栏对齐 ====================
    /** 侧边栏对齐功能是否启用 - 控制是否自动与侧边栏对齐 */
    b(this, "isSidebarAlignmentEnabled", !1);
    /** 侧边栏状态监听器 - 监听侧边栏状态变化的MutationObserver */
    b(this, "sidebarAlignmentObserver", null);
    /** 上次检测到的侧边栏状态 - 用于检测侧边栏状态变化 */
    b(this, "lastSidebarState", null);
    /** 侧边栏防抖计时器 - 防止频繁响应侧边栏状态变化 */
    b(this, "sidebarDebounceTimer", null);
    // ==================== 窗口可见性 ====================
    /** 浮窗是否可见 - 控制标签页容器的显示/隐藏状态 */
    b(this, "isFloatingWindowVisible", !0);
    // ==================== 功能开关 ====================
    /** 是否显示块类型图标 - 控制是否在标签页中显示块类型图标 */
    b(this, "showBlockTypeIcons", !0);
    /** 是否在顶部栏显示按钮 - 控制是否在Orca顶部工具栏显示插件按钮 */
    b(this, "showInHeadbar", !0);
    /** 是否启用最近关闭的标签页功能 - 控制是否记录和显示最近关闭的标签页 */
    b(this, "enableRecentlyClosedTabs", !0);
    /** 是否启用多标签页保存功能 - 控制是否允许保存多个标签页组合 */
    b(this, "enableMultiTabSaving", !0);
    /** 是否在刷新后恢复聚焦标签页 - 控制软件刷新后是否自动聚焦并打开当前聚焦的标签页 */
    b(this, "restoreFocusedTab", !0);
    /** 新标签是否添加到末尾（一次性标志，使用后自动重置为false） */
    b(this, "addNewTabToEnd", !0);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 性能优化 - Performance Optimization */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 性能优化管理器 ====================
    /** 性能优化管理器 - 统一管理所有性能优化工具 */
    b(this, "performanceOptimizer", null);
    /** MutationObserver优化器实例 - 用于优化DOM变化监听 */
    b(this, "optimizedObserver", null);
    /** 高级防抖优化器实例 - 用于任务防抖和调度 */
    b(this, "debounceOptimizer", null);
    /** 内存泄漏防护器实例 - 用于跟踪和清理资源 */
    b(this, "memoryLeakProtector", null);
    /** 批量处理器实例 - 用于批量DOM操作 */
    b(this, "batchProcessor", null);
    /** 性能监控器实例 - 用于监控性能指标 */
    b(this, "performanceMonitor", null);
    /** 性能指标计数缓存 - 记录自定义指标的累计值 */
    b(this, "performanceCounters", {});
    /** 性能基线定时器ID - 控制基线采集任务 */
    b(this, "performanceBaselineTimer", null);
    /** 最近一次性能基线场景 */
    b(this, "lastBaselineScenario", null);
    /** 最近一次性能基线报告 */
    b(this, "lastBaselineReport", null);
    /** 上一次插件初始化耗时（毫秒） */
    b(this, "lastInitDurationMs", null);
    /** 性能指标名称常量 */
    b(this, "performanceMetricKeys", {
      initTotal: "plugin_init_total",
      tabInteraction: "tab_interaction_total",
      domMutations: "dom_mutations"
    });
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 拖拽和事件管理 - Drag and Event Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 拖拽状态管理 ====================
    /** 当前正在拖拽的标签 - 存储正在被拖拽的标签页信息 */
    b(this, "draggingTab", null);
    /** 全局拖拽结束监听器 - 处理拖拽结束事件的全局监听器 */
    b(this, "dragEndListener", null);
    /** 拖拽交换防抖计时器 - 防止拖拽过程中频繁触发交换操作 */
    b(this, "swapDebounceTimer", null);
    /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
    b(this, "dropIndicator", null);
    /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
    b(this, "dragOverTab", null);
    /** 上次交换的目标标签和位置 - 防止重复交换 */
    b(this, "lastSwapKey", "");
    /** 优化的拖拽监听器 - 避免全文档监听 */
    b(this, "dragOverListener", null);
    /** 懒加载状态 - 避免不必要的初始化 */
    b(this, "isDragListenersInitialized", !1);
    /** 拖拽悬停计时器 - 控制拖拽悬停的延迟响应 */
    b(this, "dragOverTimer", null);
    /** 是否正在拖拽悬停状态 - 标识当前是否处于拖拽悬停状态 */
    b(this, "isDragOverActive", !1);
    // ==================== 事件监听器 ====================
    /** 主题变化监听器 - 监听Orca主题变化的事件监听器 */
    b(this, "themeChangeListener", null);
    /** 滚动监听器 - 监听页面滚动事件的监听器 */
    b(this, "scrollListener", null);
    // ==================== 缓存和优化 ====================
    /** 上次面板发现时间 - 记录最后一次发现面板的时间戳 */
    b(this, "lastPanelDiscoveryTime", 0);
    /** 面板发现缓存 - 缓存面板发现结果，避免频繁扫描 */
    b(this, "panelDiscoveryCache", null);
    /** 设置检查定时器 - 定期检查设置变化的定时器 */
    b(this, "settingsCheckInterval", null);
    /** 上次的设置状态 - 缓存上次的设置状态，用于检测变化 */
    b(this, "lastSettings", null);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 已关闭标签页跟踪 ====================
    /** 已关闭的标签页blockId集合 - 用于跟踪已关闭的标签页，避免重复创建 */
    b(this, "closedTabs", /* @__PURE__ */ new Set());
    /** 最近关闭的标签页列表 - 按时间倒序存储最近关闭的标签页信息 */
    b(this, "recentlyClosedTabs", []);
    /** 保存的多标签页集合 - 存储用户保存的标签页组合 */
    b(this, "savedTabSets", []);
    /** 记录上一个标签集合 - 用于比较标签页变化 */
    b(this, "previousTabSet", null);
    // ==================== 工作区功能 ====================
    /** 工作区列表 - 存储所有用户创建的工作区 */
    b(this, "workspaces", []);
    /** 当前工作区ID - 标识当前激活的工作区 */
    b(this, "currentWorkspace", null);
    /** 是否启用工作区功能 - 控制工作区功能的开关 */
    b(this, "enableWorkspaces", !0);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    b(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    b(this, "lastActiveBlockId", null);
    // ==================== 快捷键相关 ====================
    /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
    b(this, "hoveredBlockId", null);
    /** 当前右键菜单对应的块引用ID - 用于上下文菜单操作 */
    b(this, "currentContextBlockRefId", null);
    // 防抖函数实例（仅用于拖拽等非关键场景）
    b(this, "draggingDebounce", ha(async () => {
      await this.updateTabsUI();
    }, 200));
    this.pluginName = e, this.initializePerformanceOptimizers();
  }
  /** 简单的日志方法 */
  log(e, ...t) {
    this.currentLogLevel >= P.INFO && te(e, ...t);
  }
  logError(e, ...t) {
    this.currentLogLevel >= P.ERROR && ya(e, ...t);
  }
  logWarn(e, ...t) {
    this.currentLogLevel >= P.WARN && xa(e, ...t);
  }
  /**
   * 初始化性能优化器
   */
  initializePerformanceOptimizers() {
    try {
      this.log("🚀 初始化性能优化器..."), this.performanceOptimizer = ie.getInstance(), this.performanceMonitor = Y.getInstance(), this.log("✅ 性能优化器初始化完成");
    } catch (e) {
      this.error("❌ 性能优化器初始化失败:", e);
    }
  }
  /**
   * 确保性能监控实例可用
   */
  ensurePerformanceMonitorInstance() {
    if (this.performanceMonitor)
      return this.performanceMonitor;
    try {
      return this.performanceMonitor = Y.getInstance(), this.performanceMonitor;
    } catch (e) {
      return this.verboseLog("[Performance] monitor unavailable", e), null;
    }
  }
  /**
   * 启动性能计时
   */
  startPerformanceMeasurement(e) {
    const t = this.ensurePerformanceMonitorInstance();
    if (!t)
      return null;
    try {
      return t.startMeasurement(e);
    } catch (a) {
      return this.verboseLog(`[Performance] unable to start measurement: ${e}`, a), null;
    }
  }
  /**
   * 记录计数型指标
   */
  recordPerformanceCountMetric(e) {
    const t = this.ensurePerformanceMonitorInstance();
    if (!t)
      return;
    const a = (this.performanceCounters[e] ?? 0) + 1;
    this.performanceCounters[e] = a, t.recordMetric(e, a, "count", "count");
  }
  /**
   * 延迟输出性能基线报告
   */
  schedulePerformanceBaselineReport(e, t = 12e3) {
    this.ensurePerformanceMonitorInstance() && (typeof window > "u" || (this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = window.setTimeout(() => {
      this.emitPerformanceBaselineReport(e);
    }, t)));
  }
  /**
   * 输出性能基线报告
   */
  emitPerformanceBaselineReport(e) {
    var r, i;
    typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null;
    const t = ((r = this.performanceOptimizer) == null ? void 0 : r.getPerformanceReport()) ?? ((i = this.ensurePerformanceMonitorInstance()) == null ? void 0 : i.generateReport());
    if (!t) {
      this.verboseLog(`[Performance] baseline unavailable for scenario: ${e}`);
      return;
    }
    this.lastBaselineReport = t, this.lastBaselineScenario = e;
    const a = this.formatPerformanceBaselineReport(t, e);
    this.log(a);
  }
  /**
   * 构建性能基线日志
   */
  formatPerformanceBaselineReport(e, t) {
    const a = this.getLatestMetricMap(e.metrics), r = a.get(this.performanceMetricKeys.initTotal), i = a.get(this.performanceMetricKeys.tabInteraction), n = a.get(this.performanceMetricKeys.domMutations), s = a.get("fps"), c = a.get("memory_heap"), l = r ? `${r.value.toFixed(1)}${r.unit}` : this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : "n/a", d = i ? `${i.value.toFixed(0)}` : `${this.performanceCounters[this.performanceMetricKeys.tabInteraction] ?? 0}`, h = n ? `${n.value.toFixed(0)}` : "0", u = s ? `${s.value.toFixed(0)}fps` : "n/a", p = c ? this.formatBytes(c.value) : "n/a";
    return [
      `[Performance][${t}] Baseline`,
      `  healthScore: ${e.healthScore}`,
      `  init_total: ${l}`,
      `  tab_interactions: ${d}`,
      `  dom_mutations: ${h}`,
      `  fps: ${u}`,
      `  heap_used: ${p}`,
      `  issues: ${e.issues.length}`
    ].join(`
`);
  }
  getLatestMetricMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const a of e) {
      const r = t.get(a.name);
      (!r || r.timestamp <= a.timestamp) && t.set(a.name, a);
    }
    return t;
  }
  formatBytes(e) {
    return e < 1024 ? `${e.toFixed(0)}B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)}KB` : e < 1024 * 1024 * 1024 ? `${(e / 1024 / 1024).toFixed(1)}MB` : `${(e / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }
  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  debugLog(...e) {
    this.currentLogLevel >= P.DEBUG && te(e.join(" "), ...e);
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...e) {
    this.currentLogLevel >= P.VERBOSE && te(e.join(" "), ...e);
  }
  /** 警告日志 - 记录警告信息，提醒潜在问题 */
  warn(...e) {
    this.logWarn(e.join(" "));
  }
  /** 错误日志 - 记录错误信息，用于问题诊断 */
  error(...e) {
    this.logError(e.join(" "));
  }
  /**
   * 设置日志级别
   */
  setLogLevel(e) {
    this.currentLogLevel = e, this.log(`📊 日志级别已设置为: ${P[e]}`);
  }
  /**
   * 从存储中恢复调试模式设置
   */
  async restoreDebugMode() {
    try {
      await this.storageService.getConfig(T.DEBUG_MODE, this.pluginName) && this.setLogLevel(P.VERBOSE);
    } catch {
    }
  }
  /**
   * 恢复聚焦标签页恢复设置
   */
  async restoreRestoreFocusedTabSetting() {
    try {
      const e = await this.storageService.getConfig(T.RESTORE_FOCUSED_TAB, this.pluginName);
      e != null && (this.restoreFocusedTab = e);
    } catch {
    }
  }
  /**
   * 获取下一个对话框层级
   * 每次调用都会增加100，确保新对话框显示在最前面
   * @returns 下一个可用的z-index值
   */
  getNextDialogZIndex() {
    return this.dialogZIndex += 100, this.dialogZIndex;
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 初始化和生命周期管理 - Initialization and Lifecycle Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 初始化插件
   * 
   * 这是插件的主入口方法，负责完成所有初始化工作。初始化过程包括：
   * 1. 样式初始化 - 添加必要的CSS样式
   * 2. 配置读取 - 从Orca设置中读取插件配置
   * 3. 设置注册 - 注册插件相关的设置项
   * 4. 命令注册 - 注册块菜单命令和快捷键
   * 5. 状态恢复 - 恢复之前保存的插件状态
   * 6. UI初始化 - 创建和注册UI组件
   * 7. 面板发现 - 发现并初始化面板
   * 8. 事件监听 - 设置各种事件监听器
   * 
   * @async
   * @returns {Promise<void>} 初始化完成
   * @throws {Error} 当初始化过程中发生错误时抛出
   */
  async init() {
    await this.restoreDebugMode(), await this.restoreRestoreFocusedTabSetting();
    const e = this.startPerformanceMeasurement(this.performanceMetricKeys.initTotal);
    if (this.performanceOptimizer)
      try {
        await this.performanceOptimizer.initialize({
          mutationObserver: {
            enableBatch: !0,
            batchDelay: 16,
            maxBatchSize: 50,
            enableSmartFilter: !0,
            coolingPeriod: 100
          },
          debounce: [
            { name: "immediate", delay: 0, priority: 10, cancelable: !1 },
            { name: "high", delay: 8, priority: 8, cancelable: !0, maxWait: 100 },
            { name: "normal", delay: 16, priority: 5, cancelable: !0, maxWait: 200 },
            { name: "low", delay: 32, priority: 3, cancelable: !0, maxWait: 500 }
          ],
          memoryLeak: {
            autoCleanupInterval: 3e4,
            enableAutoCleanup: !0
          },
          lazyLoading: {
            enableCache: !0,
            maxConcurrency: 3,
            preloadStrategy: "idle"
          },
          batchProcessing: {
            maxBatchSize: 50,
            maxWaitTime: 16,
            enableVirtualization: !0
          },
          performanceMonitoring: {
            enableMonitoring: !0,
            enableAutoOptimization: !0,
            reportInterval: 3e4
          }
        }), this.log("✅ 性能优化管理器初始化完成");
      } catch (c) {
        this.error("❌ 性能优化管理器初始化失败:", c);
      }
    ka(), this.tabStorageService = new De(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[me.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFixedToTopMode(), await this.restoreFloatingWindowVisibility();
    const { workspaces: t, enableWorkspaces: a } = await this.tabStorageService.loadWorkspaces();
    this.workspaces = t, this.enableWorkspaces = a, this.registerHeadbarButton(), await this.discoverPanels();
    const r = this.getFirstPanel();
    r ? this.log(`🎯 初始化第1个面板（持久化面板）: ${r}`) : this.log("⚠️ 初始化时没有发现面板"), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization();
    const i = await this.tabStorageService.restoreFirstPanelTabs();
    this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = i, await this.updateRestoredTabsBlockTypes(), this.closedTabs = await this.tabStorageService.restoreClosedTabs(), this.recentlyClosedTabs = await this.tabStorageService.restoreRecentlyClosedTabs(), this.savedTabSets = await this.tabStorageService.restoreSavedTabSets();
    const n = document.querySelector(".orca-panel.active"), s = n == null ? void 0 : n.getAttribute("data-panel-id");
    if (s && !s.startsWith("_") && (this.currentPanelId = s, this.currentPanelIndex = this.getPanelIds().indexOf(s), this.log(`🎯 当前活动面板: ${s} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1) {
      this.log("📂 开始加载其他面板的标签页数据");
      for (let c = 1; c < this.panelOrder.length; c++) {
        const l = `panel_${c + 1}_tabs`;
        try {
          const d = await this.storageService.getConfig(l, this.pluginName, []);
          this.log(`📂 从存储获取到第 ${c + 1} 个面板的数据: ${d ? d.length : 0} 个标签页`), d && d.length > 0 ? (this.panelTabsData[c] = [...d], this.log(`✅ 成功加载第 ${c + 1} 个面板的标签页数据: ${d.length} 个`)) : (this.panelTabsData[c] = [], this.log(`📂 第 ${c + 1} 个面板没有保存的数据`));
        } catch (d) {
          this.warn(`❌ 加载第 ${c + 1} 个面板数据失败:`, d), this.panelTabsData[c] = [];
        }
      }
    }
    if (s && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${s} 的标签页`), await this.scanCurrentPanelTabs();
    else if (s && this.currentPanelIndex === 0)
      if (this.log("📋 当前活动面板是第一个面板，使用持久化数据"), this.restoreFocusedTab) {
        const c = document.querySelector(".orca-panel.active");
        if (c) {
          const l = c.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (l) {
            const d = l.getAttribute("data-block-id");
            d && (this.getCurrentPanelTabs().find((p) => p.blockId === d) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${d}`), await this.checkCurrentPanelBlocks()));
          }
        }
      } else
        this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过当前聚焦页面的恢复');
    this.restoreFocusedTab ? await this.autoDetectAndSyncCurrentFocus() : this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过自动检测聚焦页面'), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.initializeOptimizedDOMObserver(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.setupSettingsChecker(), e && (this.lastInitDurationMs = e()), this.schedulePerformanceBaselineReport("startup"), this.isInitialized = !0, this.log("✅ 插件初始化完成");
  }
  /**
   * 手动触发性能基线采集
   */
  requestPerformanceBaseline(e, t = 12e3) {
    this.schedulePerformanceBaselineReport(e, t);
  }
  /**
   * 软件启动时自动检测当前面板中可见的页面并同步到标签页
   * 
   * 功能说明：
   * - 检测当前激活面板中可见的 orca-hideable 页面
   * - 如果该页面不在标签页中，自动创建标签页
   * - 确保用户打开软件时，当前显示的页面会自动显示在标签页中
   * 
   * 使用场景：
   * - 软件启动后自动执行
   * - 检测当前面板中可见的页面（不固定为"今日"）
   * - 确保标签页与当前显示内容同步
   * - 提供更好的用户体验
   */
  async autoDetectAndSyncCurrentFocus() {
    try {
      this.log("🔍 开始自动检测当前面板中可见的页面并同步到标签页");
      const e = document.querySelector(".orca-panel.active");
      if (!e) {
        this.log("⚠️ 没有找到当前激活的面板，跳过自动检测");
        return;
      }
      const t = e.getAttribute("data-panel-id");
      if (!t) {
        this.log("⚠️ 激活面板没有 data-panel-id，跳过自动检测");
        return;
      }
      const a = this.getPanelIds().indexOf(t);
      a !== -1 && (this.currentPanelIndex = a, this.currentPanelId = t, this.log(`🔄 更新当前面板索引: ${a} (面板ID: ${t})`));
      const r = e.querySelectorAll('.orca-hideable:not([style*="display: none"])');
      let i = null;
      for (const d of r) {
        if (this.isInsidePopup(d))
          continue;
        const h = d.querySelector(".orca-block-editor[data-block-id]");
        if (h) {
          i = h;
          break;
        }
      }
      if (!i) {
        this.log(`⚠️ 激活面板 ${t} 中没有找到可见的块编辑器，跳过自动检测`);
        return;
      }
      const n = i.getAttribute("data-block-id");
      if (!n) {
        this.log("⚠️ 激活的块编辑器没有blockId，跳过自动检测");
        return;
      }
      this.log(`🔍 检测到当前可见的块ID: ${n}`);
      let s = this.getCurrentPanelTabs();
      s.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), s = this.getCurrentPanelTabs());
      const c = s.find((d) => d.blockId === n);
      if (c) {
        this.log(`📋 当前可见页面已存在于标签页中: "${c.title}" (${n})`), this.updateFocusState(n, c.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功同步已存在的标签页: "${c.title}"`);
        return;
      }
      this.log(`📋 当前可见页面不在标签页中，需要创建新标签页: ${n}`);
      const l = await this.getTabInfo(n, t, 0);
      if (!l) {
        this.log("⚠️ 无法获取块信息，跳过自动检测");
        return;
      }
      if (this.log(`🔍 获取到标签信息: "${l.title}" (类型: ${l.blockType || "unknown"})`), s.length >= this.maxTabs) {
        const d = s.length - 1, h = s[d];
        s[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${h.title}" -> "${l.title}"`);
      } else
        l.order = s.length, s.push(l), this.log(`➕ 添加新标签页到末尾: "${l.title}" (当前标签数: ${s.length}/${this.maxTabs})`);
      this.setCurrentPanelTabs(s), await this.saveCurrentPanelTabs(), this.updateFocusState(n, l.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功创建并同步新标签页: "${l.title}" (${n})`);
    } catch (e) {
      this.error("自动检测当前可见页面时发生错误:", e);
    }
  }
  /**
   * 检查元素是否位于弹窗内
   * 
   * @param element 要检查的元素
   * @returns 如果元素位于弹窗内返回 true，否则返回 false
   */
  isInsidePopup(e) {
    if (e.classList.contains("orca-popup") || e.classList.contains("orca-block-preview-popup"))
      return !0;
    let t = e.parentElement;
    for (; t; ) {
      if (t.classList.contains("orca-popup") || t.classList.contains("orca-block-preview-popup"))
        return !0;
      t = t.parentElement;
    }
    return !1;
  }
  /**
   * 设置主题变化监听器
   */
  setupThemeChangeListener() {
    this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null);
    const e = (i) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", i), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", e), this.log("主题变化监听器注册成功");
    } catch (i) {
      this.error("主题变化监听器注册失败:", i);
    }
    let t = orca.state.themeMode;
    const r = setInterval(() => {
      const i = orca.state.themeMode;
      i !== t && (this.log("备用检测：主题从", t, "切换到", i), t = i, setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 200));
    }, 500);
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", e), clearInterval(r);
    };
  }
  /**
   * 设置滚动监听器
   */
  setupScrollListener() {
    this.scrollListener && (this.scrollListener(), this.scrollListener = null);
    let e = null;
    const t = () => {
      e && clearTimeout(e), e = setTimeout(() => {
        const r = this.getCurrentActiveTab();
        r && this.recordScrollPosition(r);
      }, 300);
    }, a = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    a.forEach((r) => {
      r.addEventListener("scroll", t, { passive: !0 });
    }), this.scrollListener = () => {
      a.forEach((r) => {
        r.removeEventListener("scroll", t);
      }), e && clearTimeout(e);
    };
  }
  /**
   * 设置全局拖拽结束监听器
   */
  setupDragEndListener() {
    this.dragEndListener = () => {
      this.draggingTab = null, this.dragOverTab = null, this.lastSwapKey = "", this.clearDragVisualFeedback(), this.log("🔄 全局拖拽结束，清除拖拽状态");
    }, document.addEventListener("dragend", this.dragEndListener);
  }
  /**
   * 优化的拖拽监听器设置
   */
  setupOptimizedDragListeners() {
    let e = null;
    this.dragOverListener = (t) => {
      if (this.draggingTab) {
        if (t.preventDefault(), t.dataTransfer.dropEffect = "move", this.tabContainer) {
          const a = this.tabContainer.getBoundingClientRect();
          if (!(t.clientX >= a.left && t.clientX <= a.right && t.clientY >= a.top && t.clientY <= a.bottom)) {
            this.clearDropIndicator();
            return;
          }
          if (document.elementsFromPoint(t.clientX, t.clientY).some(
            (s) => s.classList.contains("new-tab-button") || s.classList.contains("drag-handle") || s.classList.contains("resize-handle")
          )) {
            this.clearDropIndicator();
            return;
          }
        }
        e || (e = requestAnimationFrame(() => {
          e = null;
          const r = document.elementsFromPoint(t.clientX, t.clientY).find((i) => {
            if (!i.classList.contains("orca-tab") || !i.hasAttribute("data-block-id")) return !1;
            const n = i.style;
            return !(n.opacity === "0" && n.pointerEvents === "none" || i.classList.contains("close-button") || i.classList.contains("new-tab-button") || i.classList.contains("drag-handle") || i.classList.contains("resize-handle"));
          });
          if (r) {
            const i = r.getAttribute("data-block-id"), s = this.getCurrentPanelTabs().find((c) => c.blockId === i);
            if (s && s.blockId !== this.draggingTab.blockId) {
              const c = r.getBoundingClientRect(), l = this.isVerticalMode && !this.isFixedToTop;
              let d;
              if (l) {
                const u = c.top + c.height / 2;
                d = t.clientY < u ? "before" : "after";
              } else {
                const u = c.left + c.width / 2;
                d = t.clientX < u ? "before" : "after";
              }
              this.updateDropIndicator(r, d);
              const h = `${s.blockId}-${d}`;
              this.lastSwapKey !== h && (this.lastSwapKey = h, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
                await this.swapTabsRealtime(s, this.draggingTab, d);
              }, 100));
            }
          }
        }));
      }
    };
  }
  /**
   * 处理拖拽经过事件
   */
  /**
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tab").forEach((t) => {
      const a = t;
      a.removeAttribute("data-dragging"), a.removeAttribute("data-drag-over"), a.classList.remove("dragging", "drag-over"), a.style.opacity === "0" && a.style.pointerEvents === "none" && (a.style.opacity = "", a.style.pointerEvents = "");
    }), this.tabContainer.removeAttribute("data-dragging")), this.clearDropIndicator();
  }
  /**
   * 创建拖拽位置指示器
   */
  createDropIndicator(e, t) {
    const a = document.createElement("div");
    a.className = "orca-tab-drop-indicator", a.style.cssText = `
      position: absolute;
      height: 2px;
      background: var(--orca-color-primary-5);
      border-radius: 1px;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
      transition: all 0.2s ease;
    `;
    const r = e.getBoundingClientRect(), i = e.parentElement;
    if (i) {
      const n = i.getBoundingClientRect();
      t === "before" ? (a.style.left = `${r.left - n.left}px`, a.style.top = `${r.top - n.top - 1}px`, a.style.width = `${r.width}px`) : (a.style.left = `${r.left - n.left}px`, a.style.top = `${r.bottom - n.top - 1}px`, a.style.width = `${r.width}px`), i.appendChild(a);
    }
    return a;
  }
  /**
   * 更新拖拽位置指示器（使用CSS伪元素）
   */
  updateDropIndicator(e, t) {
    this.clearDropIndicator(), e.setAttribute("data-drop-target", t);
  }
  /**
   * 清除拖拽位置指示器
   */
  clearDropIndicator() {
    this.tabContainer && this.tabContainer.querySelectorAll(".orca-tab").forEach((t) => {
      t.removeAttribute("data-drop-target");
    });
  }
  /**
   * 实时交换标签位置（拖拽过程中）- DOM级别平滑动画
   */
  async swapTabsRealtime(e, t, a) {
    var u, p;
    if (!this.tabContainer) return;
    const r = this.getCurrentPanelTabs(), i = r.findIndex((g) => g.blockId === t.blockId), n = r.findIndex((g) => g.blockId === e.blockId);
    if (i === -1 || n === -1 || i === n) return;
    const s = r.filter((g) => g.isPinned).length;
    let c = a === "before" ? n : n + 1;
    if (i < c && c--, t.isPinned) {
      if (c >= s) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶区域: ${t.title}`);
        return;
      }
      if (!e.isPinned) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (!t.isPinned) {
      if (c < s) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶区域: ${t.title}`);
        return;
      }
      if (e.isPinned) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (i === c) return;
    this.verboseLog(`🔄 [实时交换] ${t.title}: ${i} -> ${c}`);
    const [l] = r.splice(i, 1);
    r.splice(c, 0, l), await this.setCurrentPanelTabs(r);
    const d = this.tabContainer.querySelector(`[data-block-id="${t.blockId}"]`), h = this.tabContainer.querySelector(`[data-block-id="${e.blockId}"]`);
    d && h && (a === "before" ? (u = h.parentNode) == null || u.insertBefore(d, h) : (p = h.parentNode) == null || p.insertBefore(d, h.nextSibling));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(e, t) {
    const a = this.getCurrentPanelTabs(), r = a.findIndex((c) => c.blockId === e.blockId), i = a.findIndex((c) => c.blockId === t.blockId);
    if (r === -1 || i === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (r === i) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${i}) -> ${e.title} (${r})`);
    const n = a[i], s = a[r];
    a[r] = n, a[i] = s, a.forEach((c, l) => {
      c.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${n.title} -> 位置 ${r}`);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 面板管理 - Panel Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 发现并更新面板信息
   * 排除特殊面板（如全局搜索面板），只处理正常的内容面板
   */
  async discoverPanels() {
    const e = document.querySelectorAll(".orca-panel"), t = [];
    let a = null;
    e.forEach((i) => {
      const n = i.getAttribute("data-panel-id");
      if (n) {
        if (n.startsWith("_"))
          return;
        t.push(n), i.classList.contains("active") && (a = n);
      }
    });
    const r = this.getPanelIds();
    this.updatePanelOrder(t), this.updateCurrentPanelInfo(a), await this.handlePanelChanges(r, t);
  }
  /**
   * 更新当前面板信息
   */
  updateCurrentPanelInfo(e) {
    if (e) {
      const t = this.panelOrder.findIndex((a) => a.id === e);
      if (t !== -1) {
        if (this.currentPanelId === e && this.currentPanelIndex === t)
          return;
        this.currentPanelId = e, this.currentPanelIndex = t, this.log(`🔄 当前面板更新: ${e} (索引: ${t}, 序号: ${this.panelOrder[t].order})`);
      }
      return;
    }
    this.currentPanelId === null && this.currentPanelIndex === -1 || (this.currentPanelId = null, this.currentPanelIndex = -1, this.log("🔄 没有激活的面板"));
  }
  /**
   * 处理面板变化
   */
  async handlePanelChanges(e, t) {
    const a = e.filter((i) => !t.includes(i));
    a.length > 0 && (this.log("🗑️ 检测到面板被关闭:", a), await this.handlePanelClosure(a));
    const r = t.filter((i) => !e.includes(i));
    r.length > 0 && (this.log("🆕 检测到新面板被打开:", r), this.handleNewPanels(r)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   */
  async handlePanelClosure(e) {
    this.log("🗑️ 处理面板关闭:", e);
    const t = [];
    e.forEach((a) => {
      const r = this.panelOrder.findIndex((i) => i.id === a);
      r !== -1 && t.push(r);
    }), t.sort((a, r) => r - a).forEach((a) => {
      this.panelTabsData.splice(a, 1), this.log(`🗑️ 删除面板 ${e[t.indexOf(a)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((a) => a.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let a = 0; a < this.panelOrder.length; a++) {
      const r = this.panelTabsData[a] || [], i = a === 0 ? T.FIRST_PANEL_TABS : `panel_${a + 1}_tabs`;
      await this.savePanelTabsByKey(i, r);
    }
    this.log("🔄 面板关闭后强制更新UI"), this.debouncedUpdateTabsUI();
  }
  /**
   * 处理新面板
   */
  handleNewPanels(e) {
    this.log("🆕 新面板将在需要时自动扫描标签页数据");
  }
  /**
   * 调整panelTabsData数组大小
   */
  adjustPanelTabsDataSize() {
    for (; this.panelTabsData.length < this.getPanelIds().length; )
      this.panelTabsData.push([]);
    for (; this.panelTabsData.length > this.getPanelIds().length; )
      this.panelTabsData.pop();
  }
  // ==================== 新的面板管理方法 ====================
  /**
   * 获取面板ID数组（用于向后兼容）
   */
  getPanelIds() {
    return this.panelOrder.map((e) => e.id);
  }
  /**
   * 添加面板到顺序映射
   */
  addPanel(e) {
    if (this.panelOrder.find((a) => a.id === e)) {
      this.log(`📋 面板 ${e} 已存在，跳过添加`);
      return;
    }
    const t = this.panelOrder.length + 1;
    this.panelOrder.push({ id: e, order: t }), this.log(`📋 添加面板 ${e}，序号: ${t}`), this.ensurePanelTabsDataSize();
  }
  /**
   * 从顺序映射中删除面板
   */
  removePanel(e) {
    const t = this.panelOrder.findIndex((a) => a.id === e);
    if (t === -1) {
      this.log(`⚠️ 面板 ${e} 不存在，无法删除`);
      return;
    }
    this.panelOrder.splice(t, 1), this.panelOrder.forEach((a, r) => {
      a.order = r + 1;
    }), this.log(`🗑️ 删除面板 ${e}，重新排序后的面板:`, this.panelOrder.map((a) => `${a.id}(${a.order})`)), this.panelTabsData.splice(t, 1);
  }
  /**
   * 获取第1个面板（持久化面板）
   */
  getFirstPanel() {
    return this.panelOrder.length > 0 ? this.panelOrder[0].id : null;
  }
  /**
   * 确保panelTabsData数组大小与panelOrder匹配
   */
  ensurePanelTabsDataSize() {
    for (; this.panelTabsData.length < this.panelOrder.length; )
      this.panelTabsData.push([]);
    for (; this.panelTabsData.length > this.panelOrder.length; )
      this.panelTabsData.pop();
  }
  /**
   * 更新面板顺序映射
   */
  updatePanelOrder(e) {
    const t = this.getPanelIds();
    if (t.length === e.length && t.every((i, n) => i === e[n]))
      return;
    e.forEach((i) => {
      this.panelOrder.find((n) => n.id === i) || this.addPanel(i);
    }), this.panelOrder.filter((i) => !e.includes(i.id)).forEach((i) => {
      this.removePanel(i.id);
    }), this.log("🔄 面板顺序更新完成:", this.panelOrder.map((i) => `${i.id}(${i.order})`));
  }
  /**
   * 智能选择新的持久化面板（基于面板位置，不依赖ID）
   */
  // 这个方法已删除，因为重构后不再需要复杂的持久化逻辑
  /**
   * 更新面板标签页数组大小
   */
  // 这个方法已删除，因为重构后不再需要复杂的持久化逻辑
  /**
   * 检查是否为菜单面板（需要排除）
   */
  isMenuPanel(e) {
    if (e.classList.contains("orca-menu") || e.classList.contains("orca-recents-menu"))
      return !0;
    const t = e.parentElement;
    return !!(t && (t.classList.contains("orca-menu") || t.classList.contains("orca-recents-menu")));
  }
  /**
   * 扫描第一个面板的标签页（扫描所有标签页）
   */
  async scanFirstPanel() {
    if (this.getPanelIds().length === 0) return;
    const e = this.getPanelIds()[0], t = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!t) return;
    const a = t.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let i = 0;
    this.log(`🔍 扫描第一个面板 ${e}，找到 ${a.length} 个块编辑器`);
    for (const n of a) {
      const s = n.getAttribute("data-block-id");
      if (!s) continue;
      const c = await this.getTabInfo(s, e, i++);
      c && (r.push(c), this.log(`📋 找到标签页: ${c.title} (${s})`));
    }
    this.panelTabsData[0] = [...r], await this.savePanelTabsByKey(T.FIRST_PANEL_TABS, r), this.log(`📋 第一个面板扫描并保存了 ${r.length} 个标签页`);
  }
  /**
   * 合并第一个面板的标签页（现在只处理单个标签页）
   */
  mergeFirstPanelTabs(e) {
    e.length > 0 && this.sortTabsByPinStatus();
  }
  /**
   * 按固定状态排序标签（固定标签在前，非固定在后）
   */
  sortTabsByPinStatus() {
    const e = this.getCurrentPanelTabs(), t = la(e);
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return ca(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return Vt(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, a = !1, r = !1;
    for (const i of e)
      i && typeof i == "object" && (i.t === "r" && i.v ? (r = !0, i.a || (t = !0)) : i.t === "t" && i.v && (a = !0));
    return t || a && r;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return Ht(e);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  // ✅ 重构：移除重复的detectBlockType和getBlockTypeIcon实现，直接使用 utils/blockUtils.ts 中的函数
  /**
   * 获取所有支持的块类型和对应图标
   */
  getAllBlockTypeIcons() {
    return {
      journal: "📅",
      // 日期块 - 保持emoji
      alias: "ti ti-tag",
      // 别名块
      page: "ti ti-file-text",
      // 页面
      tag: "ti ti-tag",
      // 标签
      heading: "ti ti-heading",
      // 标题
      code: "ti ti-code",
      // 代码
      table: "ti ti-table",
      // 表格
      image: "ti ti-photo",
      // 图片
      link: "ti ti-link",
      // 链接
      list: "ti ti-list",
      // 列表
      quote: "ti ti-quote",
      // 引用
      text: "ti ti-box",
      // 普通文本
      block: "ti ti-square",
      // 块
      task: "ti ti-checkbox",
      // 任务
      idea: "ti ti-bulb",
      // 想法
      question: "ti ti-help-circle",
      // 问题
      answer: "ti ti-message-circle",
      // 答案
      summary: "ti ti-file-text",
      // 总结
      reference: "ti ti-book",
      // 参考
      example: "ti ti-code",
      // 示例
      warning: "ti ti-alert-triangle",
      // 警告
      info: "ti ti-info-circle",
      // 信息
      tip: "ti ti-lightbulb",
      // 提示
      math: "ti ti-math",
      // 数学公式
      default: "ti ti-file"
      // 默认
    };
  }
  /**
   * 获取块文本标题（智能标题提取）
   * 
   * 功能说明：
   * - 智能提取块标题，支持多种格式
   * - 处理特殊字符和格式
   * - 提供合理的标题长度限制
   * - 支持降级处理
   */
  getBlockTextTitle(e) {
    try {
      if (e.aliases && e.aliases.length > 0) {
        const t = e.aliases[0];
        if (t && t.trim())
          return this.cleanTitle(t);
      }
      if (e.text) {
        let t = e.text.trim();
        return t = this.processSpecialFormats(t), t = this.cleanTitle(t), t.length > 50 && (t = t.substring(0, 47) + "..."), t;
      }
      if (e.content && Array.isArray(e.content)) {
        const t = this.extractTextFromContentSync(e.content);
        if (t && t.trim()) {
          let a = t.trim();
          return a = this.processSpecialFormats(a), a = this.cleanTitle(a), a.length > 50 && (a = a.substring(0, 47) + "..."), a;
        }
      }
      return `块 ${e.id || "未知"}`;
    } catch (t) {
      return this.error("获取块标题时发生错误:", t), `块 ${e.id || "未知"}`;
    }
  }
  /**
   * 处理特殊格式的标题
   */
  processSpecialFormats(e) {
    return e = e.replace(/^#+\s*/, ""), e = e.replace(/^\*\*|\*\*$/g, ""), e = e.replace(/^\*|\*$/g, ""), e = e.replace(/^`|`$/g, ""), e = e.replace(/^>+\s*/, ""), e = e.replace(/^[-*+]\s*/, ""), e = e.replace(/^\d+\.\s*/, ""), e = e.replace(/^\[[x ]\]\s*/, ""), e;
  }
  /**
   * 清理标题
   */
  cleanTitle(e) {
    return e = e.replace(/\s+/g, " ").trim(), e = e.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s\-_.,!?()（）]/g, ""), e;
  }
  /**
   * 同步从内容中提取文本
   */
  extractTextFromContentSync(e) {
    if (!Array.isArray(e))
      return "";
    const t = [];
    for (const a of e)
      if (typeof a == "string")
        t.push(a);
      else if (a && typeof a == "object") {
        if (a.t === "text" && a.v)
          t.push(a.v);
        else if (a.text)
          t.push(a.text);
        else if (a.content) {
          const r = this.extractTextFromContentSync(a.content);
          r && t.push(r);
        }
      }
    return t.join("");
  }
  /**
   * 使用指定模式格式化日期
   */
  formatDateWithPattern(e, t) {
    try {
      if (t.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const r = e.getDay(), n = ["日", "一", "二", "三", "四", "五", "六"][r], s = t.replace(/E/g, n);
          return O(e, s);
        } else
          return O(e, t);
      else
        return O(e, t);
    } catch {
      const r = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of r)
        try {
          return O(e, i);
        } catch {
          continue;
        }
      return e.toISOString().split("T")[0];
    }
  }
  /**
   * 在块的properties中查找指定名称的属性
   */
  findProperty(e, t) {
    return !e.properties || !Array.isArray(e.properties) ? null : e.properties.find((a) => a.name === t);
  }
  /**
   * 检查字符串是否是日期格式
   */
  isDateString(e) {
    return [
      /^\d{4}-\d{2}-\d{2}$/,
      // YYYY-MM-DD
      /^\d{4}\/\d{2}\/\d{2}$/,
      // YYYY/MM/DD
      /^\d{2}\/\d{2}\/\d{4}$/,
      // MM/DD/YYYY
      /^\d{4}-\d{2}-\d{2}T/
      // ISO format start
    ].some((a) => a.test(e));
  }
  async getTabInfo(e, t, a) {
    try {
      const r = await orca.invokeBackend("get-block", parseInt(e));
      if (!r) return null;
      let i = "", n = "", s = "", c = !1, l = "";
      l = await ee(r), this.log(`🔍 检测到块类型: ${l} (块ID: ${e})`), r.aliases && r.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(r.aliases)}, 检测到的类型=${l}`);
      try {
        const d = Ce(r);
        if (d)
          c = !0, i = Ut(d);
        else if (r.aliases && r.aliases.length > 0)
          i = r.aliases[0];
        else if (r.content && r.content.length > 0)
          this.needsContentConcatenation(r.content) && r.text ? i = r.text.substring(0, 50) : i = (await this.extractTextFromContent(r.content)).substring(0, 50);
        else if (r.text) {
          let h = r.text.substring(0, 50);
          if (l === "list") {
            const u = r.text.split(`
`)[0].trim();
            u && (h = u.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (l === "table") {
            const u = r.text.split(`
`)[0].trim();
            u && (h = u.replace(/\|/g, "").trim());
          } else if (l === "quote") {
            const u = r.text.split(`
`)[0].trim();
            u && (h = u.replace(/^>\s+/, ""));
          } else if (l === "image") {
            const u = r.text.match(/caption:\s*(.+)/i);
            u && u[1] ? h = u[1].trim() : h = r.text.trim();
          }
          i = h;
        } else
          i = `块 ${e}`;
      } catch (d) {
        this.warn("获取标题失败:", d), i = `块 ${e}`;
      }
      try {
        const d = this.findProperty(r, "_color"), h = this.findProperty(r, "_icon");
        d && d.type === 1 && (n = d.value), h && h.type === 1 && h.value && h.value.trim() ? (s = h.value, this.log(`🎨 使用用户自定义图标: ${s} (块ID: ${e})`)) : (this.showBlockTypeIcons || l === "journal") && (s = _(l), this.log(`🎨 使用块类型图标: ${s} (块类型: ${l}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), s = _(l);
      }
      return {
        blockId: e,
        panelId: t,
        title: i || `块 ${e}`,
        color: n,
        icon: s,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: a,
        blockType: l
      };
    } catch (r) {
      return this.error("获取标签信息失败:", r), null;
    }
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* UI创建和更新 - UI Creation and Updates */
  /* ———————————————————————————————————————————————————————————————————————————— */
  async createTabsUI() {
    if (!this.isFloatingWindowVisible) {
      this.log("🙈 浮窗已隐藏，跳过UI创建");
      return;
    }
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), this.log("📱 使用自动切换模式，不创建面板切换器");
    const e = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)";
    let t, a, r;
    if (this.isFixedToTop ? (t = { x: 0, y: 0 }, a = !1, r = window.innerWidth) : (t = this.isVerticalMode ? this.verticalPosition : this.position, a = this.isVerticalMode, r = this.verticalWidth), this.tabContainer = Ta(
      a,
      t,
      r,
      e
    ), this.isFixedToTop) {
      const n = document.querySelector(".headbar") || document.querySelector(".toolbar") || document.querySelector(".top-bar") || document.querySelector('[class*="head"]') || document.querySelector('[class*="toolbar"]') || document.querySelector('[class*="bar"]') || document.body;
      this.log("🔍 查找顶部工具栏:", {
        headbar: (n == null ? void 0 : n.className) || (n == null ? void 0 : n.tagName),
        headbarExists: !!n,
        bodyChildren: document.body.children.length
      }), n.appendChild(this.tabContainer), n === document.body ? this.tabContainer.style.cssText += `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          background-color: var(--orca-color-bg-1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 2px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        ` : this.tabContainer.style.cssText += `
          display: flex;
          flex-direction: row;
          align-items: center;
          position: static;
          width: auto;
          height: 32px;
          border-radius: var(--orca-radius-md);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin: 0 4px;
          padding: 0 8px;
          gap: 10px;
        `, this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${n.className || n.tagName}`);
    } else
      document.body.appendChild(this.tabContainer);
    this.tabContainer.addEventListener("mousedown", (n) => {
      const s = n.target;
      s.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && n.stopPropagation();
    }), this.tabContainer.addEventListener("click", (n) => {
      const s = n.target;
      s.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && n.stopPropagation();
    });
    const i = document.createElement("div");
    i.className = "drag-handle", i.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      cursor: move;
      z-index: 9998;
      opacity: 0;
      background-color: transparent;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      transition: opacity 0.2s ease;
    `, i.innerHTML = "", i.addEventListener("mouseenter", () => {
      i.style.opacity = "0.5";
    }), i.addEventListener("mouseleave", () => {
      i.style.opacity = "0";
    }), i.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(i), this.isFixedToTop || document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && this.enableDragResize(), await this.updateTabsUI();
  }
  /**
   * 添加拖拽相关的CSS样式
   */
  addDragStyles() {
    if (document.getElementById("orca-tabs-drag-styles"))
      return;
    const e = document.createElement("style");
    e.id = "orca-tabs-drag-styles", e.textContent = `
      /* CSS变量定义 - 支持主题自动切换 */
      :root {
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(0 0 0 / 10%));
        --orca-tab-border: rgba(0, 0, 0, 0.1);
        --orca-tab-hover-border: var(--orca-color-primary-3);
        --orca-tab-active-border: rgba(0, 0, 0, 0.3);
        --orca-tab-container-bg: rgba(255, 255, 255, 0.1);
        --orca-input-bg: rgba(200, 200, 200, 0.6);
      }
      
      /* 暗色模式的CSS变量 */
      :root[data-theme="dark"],
      .dark {
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(0 0 0 / 40%));
        --orca-tab-border: rgba(255, 255, 255, 0.2);
        --orca-tab-hover-border: var(--orca-color-primary-3);
        --orca-tab-active-border: rgba(255, 255, 255, 0.4);
        --orca-input-bg: rgba(255, 255, 255, 0.1);
      }
      
      /* 有颜色标签的CSS变量 - 使用条件CSS变量 */
      .orca-tabs-plugin .orca-tab {
        --orca-tab-colored-bg: oklch(from var(--tab-color, #3b82f6) calc(l * 0.8) calc(c * 1.5) h / 25%);
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 0.6) c h);
      }
      
      /* 暗色模式下的标签页颜色 - 使用最高优先级的选择器 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab,
      html[data-theme="dark"] .orca-tabs-plugin .orca-tab,
      [data-theme="dark"] .orca-tabs-plugin .orca-tab,
      .dark .orca-tabs-plugin .orca-tab,
      .orca-tabs-plugin .orca-tab[data-theme="dark"],
      .orca-tabs-plugin[data-theme="dark"] .orca-tab {
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h) !important;
      }
      
      /* 使用CSS媒体查询作为备用方案 */
      @media (prefers-color-scheme: dark) {
        .orca-tabs-plugin .orca-tab {
          --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h) !important;
        }
      }
      
      /* 强制覆盖所有可能的暗色模式选择器 */
      :root.dark .orca-tabs-plugin .orca-tab,
      html.dark .orca-tabs-plugin .orca-tab,
      body.dark .orca-tabs-plugin .orca-tab {
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h) !important;
      }
      


      /* 拖拽悬停目标样式 */
      .orca-tabs-plugin .orca-tab[data-drag-over="true"] {
        border: 1px solid var(--orca-color-primary-5);
        transform: scale(1.02);
        box-shadow: 0 4px 12px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%);
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 95%);
        position: relative;
      }

      /* 拖拽悬停目标指示器 */
      .orca-tabs-plugin .orca-tab[data-drag-over="true"]::before {
        content: '';
        position: absolute;
        left: -2px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: var(--orca-color-primary-5);
        border-radius: 2px;
        box-shadow: 0 0 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 40%);
        animation: dragIndicator 0.3s ease-in-out;
      }

      /* 拖拽指示器动画 */
      @keyframes dragIndicator {
        0% {
          opacity: 0;
          transform: translateY(-50%) scaleY(0);
        }
        100% {
          opacity: 1;
          transform: translateY(-50%) scaleY(1);
        }
      }

      /* 拖拽容器状态 - 使用border紧贴，并放大1.05倍 */
      .orca-tabs-container[data-dragging="true"] {
        background-color: var(--orca-color-bg-1);
        outline: 1px dashed var(--orca-color-primary-5);
        outline-offset: 2px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-radius: 8px;
        transform: scale(1.05);
        transform-origin: center;
      }
      
      /* 拖拽状态下水平布局标签间距增加，便于拖拽操作 */
      .orca-tabs-container:not(.vertical)[data-dragging="true"] {
        gap: 10px !important;
      }
      
      /* 标签容器变化的平滑过渡（包括gap和transform） */
      .orca-tabs-container:not(.vertical) {
        transition: gap 0.2s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* 垂直布局也需要transform过渡 */
      .orca-tabs-container.vertical {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      /* 拖拽时的过渡动画 */
      .orca-tabs-plugin .orca-tab {
        will-change: transform, box-shadow, background, opacity, border;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), 
                    opacity 0.2s ease,
                    box-shadow 0.2s ease;
      }

      /* 未选中标签的基础样式 */
      .orca-tabs-plugin .orca-tab {
        opacity: 0.85;
        border: 1px solid transparent;
      }

      /* 暗色模式下的标签边框 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab,
      .dark .orca-tabs-plugin .orca-tab {
        border: 1px solid color-mix(in srgb, var(--orca-color-text-1), transparent 35%);
      }

      /* 选中/悬停的标签样式 - 使用CSS变量自动响应主题变化，但排除聚焦状态 */
      .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        opacity: 1 !important;
        border: 1px solid var(--orca-tab-hover-border) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      }

      /* 有颜色的悬停标签样式 - 使用标签颜色 */
      .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"])[style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 70%) !important;
      }

      /* 暗色模式下的悬停样式 - 通过CSS变量自动应用，但排除聚焦状态 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]),
      .dark .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
      }

      /* 暗色模式下有颜色的悬停标签样式 - 使用标签颜色 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"])[style*="--tab-color"],
      .dark .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"])[style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 80%) !important;
      }

      /* 点击/激活状态的标签样式 - 使用CSS变量自动响应主题变化，但排除聚焦状态 */
      .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        opacity: 1 !important;
        border: 1px solid var(--orca-color-primary-3) !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
        transform: scale(0.98) !important;
      }

      /* 暗色模式下的点击样式 - 通过CSS变量自动应用，但排除聚焦状态 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]),
      .dark .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        box-shadow: 0 1px 4px rgba(255, 255, 255, 0.2) !important;
      }

      /* 聚焦状态的标签样式 */
      .orca-tabs-plugin .orca-tab[data-focused="true"] {
        opacity: 1 !important;
        border: 1px solid var(--orca-color-primary-5) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--orca-color-primary-5), transparent 80%), 0 2px 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%) !important;
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 90%) !important;
        transform: scale(1.02) !important;
      }

      /* 有颜色的聚焦标签样式 - 使用标签颜色 */
      .orca-tabs-plugin .orca-tab[data-focused="true"][style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--tab-color), transparent 80%), 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 70%) !important;
        background: color-mix(in srgb, var(--tab-color), transparent 90%) !important;
      }

      /* 暗色模式下的聚焦样式 */
      .dark .orca-tabs-plugin .orca-tab[data-focused="true"] {
        border: 1px solid var(--orca-color-primary-5) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%), 0 2px 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 80%) !important;
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 85%) !important;
      }

      /* 暗色模式下有颜色的聚焦标签样式 - 使用标签颜色 */
      .dark .orca-tabs-plugin .orca-tab[data-focused="true"][style*="--tab-color"] {
        border: 1px solid var(--tab-color) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--tab-color), transparent 70%), 0 2px 8px color-mix(in srgb, var(--tab-color), transparent 80%) !important;
        background: color-mix(in srgb, var(--tab-color), transparent 85%) !important;
      }

      /* 拖拽时的光标样式 */
      .orca-tabs-plugin .orca-tab[draggable="true"] {
        cursor: pointer;
      }

      .orca-tabs-plugin .orca-tab[draggable="true"]:active {
        cursor: pointer;
      }

      /* 拖拽时的标签容器动画 - 平滑滑动 */
      .orca-tabs-container[data-dragging="true"] .orca-tab {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                    opacity 0.25s ease,
                    width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    margin 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    padding 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      /* 拖拽时标签的过渡效果 */
      .orca-tabs-container[data-dragging="true"] .orca-tab {
        will-change: transform;
      }
      
      /* 标签分隔线 - 使用伪元素（水平布局，有相邻标签时才显示） */
      .orca-tabs-container:not(.vertical) .orca-tab:not([data-drop-target]):has(+ .orca-tab)::after {
        content: '';
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 16px;
        background: color-mix(in srgb, var(--orca-color-text-1), transparent 75%);
        pointer-events: none;
        z-index: 10;
      }
      
      /* 拖拽时隐藏分隔线，避免与拖拽指示器冲突 */
      .orca-tabs-container[data-dragging="true"] .orca-tab::after {
        display: none;
      }

      /* 拖拽目标位置指示器 - 插入线样式（使用Orca主题色，优先级更高） */
      .orca-tab[data-drop-target="before"]::before,
      .orca-tab[data-drop-target="after"]::after {
        content: '' !important;
        position: absolute;
        background: var(--orca-color-primary-5, #5B8DEF);
        z-index: 1000;
        animation: dropIndicatorSlide 0.2s ease-out;
        box-shadow: 0 0 8px var(--orca-color-primary-shadow, rgba(91, 141, 239, 0.5));
        display: block !important;
      }
      
      /* 水平布局 - 左右插入线 */
      .orca-tabs-container:not(.vertical) .orca-tab[data-drop-target="before"]::before {
        left: -2px;
        top: 2px;
        bottom: 2px;
        width: 3px;
        border-radius: 2px;
      }
      
      .orca-tabs-container:not(.vertical) .orca-tab[data-drop-target="after"]::after {
        right: -2px;
        top: 2px;
        bottom: 2px;
        width: 3px;
        border-radius: 2px;
      }
      
      /* 垂直布局 - 上下插入线 */
      .orca-tabs-container.vertical .orca-tab[data-drop-target="before"]::before {
        left: 2px;
        right: 2px;
        top: -2px;
        height: 3px;
        border-radius: 2px;
      }
      
      .orca-tabs-container.vertical .orca-tab[data-drop-target="after"]::after {
        left: 2px;
        right: 2px;
        bottom: -2px;
        height: 3px;
        border-radius: 2px;
      }
      
      /* 插入线滑入动画 */
      @keyframes dropIndicatorSlide {
        from {
          opacity: 0;
          transform: scaleY(0.5);
        }
        to {
          opacity: 1;
          transform: scaleY(1);
        }
      }

      /* 拖拽完成后的回弹效果 */
      .orca-tabs-plugin .orca-tab[data-dragging="true"] {
        animation: dragBounce 0.3s ease-out;
      }

      @keyframes dragBounce {
        0% {
          transform: rotate(2deg);
        }
        50% {
          transform: rotate(1deg);
        }
        100% {
          transform: rotate(2deg);
        }
      }

      /* 目标元素基础样式 */
      .orca-menu.orca-block-preview.orca-block-preview-interactive {
        position: relative;
        min-width: 50px;
        min-height: 50px;
      }

      /* 右下角缩放手柄样式 */
      .resize-handle-br {
        position: absolute;
        background-color: #3498db;
        width: 10px;
        height: 10px;
        right: -5px;
        bottom: -5px;
        z-index: 9999;
        border-radius: 50%;
        opacity: 0;
        cursor: nwse-resize;
      }

      /* 缩放手柄交互效果 */
      .resize-handle-br:hover {
        opacity: 0.5;
        transition: opacity 0.2s ease;
      }

      .resize-handle-br.dragging {
        opacity: 1;
      }

      /* 拖拽手柄样式（顶部透明区域） */
      .drag-handle {
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        cursor: move;
        z-index: 9998;
        opacity: 0;
        background-color: transparent;
      }

      .drag-handle:hover {
        opacity: 0.5;
        transition: opacity 0.2s ease;
      }

      .drag-handle.dragging {
        opacity: 1;
      }

      /* 操作状态样式 */
      .resizing, .dragging {
        user-select: none;
        -webkit-user-select: none;
      }

      /* 全局鼠标样式 - 只影响插件内的拖拽和调整大小 */
      .orca-tabs-plugin .orca-tabs-plugin body.resizing {
        cursor: nwse-resize;
      }

      .orca-tabs-plugin .orca-tabs-plugin body.dragging {
        cursor: move;
      }

      /* 按钮基础样式 - 只影响插件内的按钮 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        transition: background-color 0.2s;
        background-color: transparent;
        padding: .175rem var(--orca-spacing-md);
        border-radius: var(--orca-radius-md);
        border: none;
        color: var(--orca-color-text-1);
      }

      /* 按钮悬停效果 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button:hover {
        background-color: var(--orca-color-menu-highlight);
      }

      /* 主要按钮样式 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button-primary {
        background: var(--orca-color-primary-5);
        color: white;
      }

      .orca-tabs-plugin .orca-tabs-plugin .orca-button-primary:hover {
        background: color-mix(in srgb, var(--orca-color-primary-5), black 10%);
      }

      /* 次要按钮样式 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-button-secondary {
        border: 1px solid var(--orca-color-primary-5);
        background: var(--orca-color-primary-5);
        color: white;
      }

      .orca-tabs-plugin .orca-tabs-plugin .orca-button-secondary:hover {
        background: color-mix(in srgb, var(--orca-color-primary-5), black 10%);
      }

      /* 菜单项图标样式 */
      .orca-tabs-plugin .tab-context-menu-item::before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: var(--orca-spacing-md);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
      }

      /* 标签右键菜单图标 */
      .orca-tabs-plugin .tab-context-menu-item[data-action="close"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="close-others"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'%3E%3C/path%3E%3Cpath d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'%3E%3C/path%3E%3Cpath d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="close-right"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'%3E%3C/path%3E%3Cpath d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'%3E%3C/path%3E%3Cpath d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="close-left"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 6h18'%3E%3C/path%3E%3Cpath d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'%3E%3C/path%3E%3Cpath d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="duplicate"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="rename"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'%3E%3C/path%3E%3Cpath d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .tab-context-menu-item[data-action="save-to-group"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
      }

      /* 工作区菜单图标 */
      .orca-tabs-plugin .workspace-menu-item::before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: var(--orca-spacing-md);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
      }

      .orca-tabs-plugin .workspace-menu-item[data-action="save-current"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'%3E%3C/path%3E%3Cpolyline points='17,21 17,13 7,13 7,21'%3E%3C/polyline%3E%3Cpolyline points='7,3 7,8 15,8'%3E%3C/polyline%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .workspace-menu-item[data-action="manage"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3Cpath d='M12 1v6m0 6v6m11-7h-6m-6 0H1'%3E%3C/path%3E%3C/svg%3E");
      }

      .orca-tabs-plugin .workspace-menu-item[data-action="workspace"]::before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
      }

      /* 添加到标签组菜单图标 */
      .orca-tabs-plugin .add-to-group-menu-item::before {
        content: '';
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: var(--orca-spacing-md);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
      }
    `, document.head.appendChild(e), this.log("✅ 拖拽样式已添加");
  }
  /**
   * 立即更新标签页UI（修复同步问题）
   * 
   * 问题背景：
   * - 防抖延迟导致编辑器与标签页不同步
   * - 用户看到编辑器已切换，但标签页仍显示旧内容
   * - 需要额外点击才能同步标签页状态
   * 
   * 修复方案：
   * - 提供立即更新方法，绕过防抖机制
   * - 确保聚焦状态变化时立即更新UI
   * - 保持编辑器与标签页的视觉同步
   * 
   * 避坑点：
   * 1. 不要在聚焦状态变化时使用防抖更新
   * 2. 确保UI更新与编辑器切换同步进行
   * 3. 避免用户看到不一致的状态
   * 4. 仅在拖拽等非关键场景使用防抖
   */
  async immediateUpdateTabsUI() {
    await this.updateTabsUI();
  }
  /**
   * 防抖更新标签页UI（仅用于拖拽等非关键场景）
   * 
   * 问题背景：
   * - 防抖机制导致标签页更新延迟
   * - 用户操作后需要等待才能看到结果
   * - 影响用户体验和视觉同步
   * 
   * 修复方案：
   * - 拖拽场景保持防抖，避免干扰拖拽体验
   * - 非拖拽场景立即更新，确保同步
   * - 区分不同场景的更新策略
   * 
   * 避坑点：
   * 1. 不要在所有场景都使用防抖
   * 2. 拖拽场景需要防抖避免闪烁
   * 3. 聚焦变化场景需要立即更新
   * 4. 根据场景选择合适的更新策略
   */
  debouncedUpdateTabsUI() {
    this.draggingTab ? this.draggingDebounce() : this.immediateUpdateTabsUI();
  }
  async updateTabsUI() {
    if (!this.tabContainer || this.isUpdating) return;
    this.isUpdating = !0;
    const e = Date.now();
    try {
      if (e - this.lastUpdateTime < 50) {
        this.verboseLog("⏭️ 跳过UI更新：距离上次更新仅 " + (e - this.lastUpdateTime) + "ms");
        return;
      }
      this.lastUpdateTime = e;
      const t = this.tabContainer.querySelector(".drag-handle"), a = this.tabContainer.querySelector(".new-tab-button"), r = this.tabContainer.querySelector(".workspace-button"), i = Array.from(this.tabContainer.querySelectorAll(".orca-tab")).map((c) => c.getAttribute("data-tab-id")).filter((c) => c !== null);
      this.tabContainer.innerHTML = "", t && this.tabContainer.appendChild(t);
      let n = this.currentPanelId, s = this.currentPanelIndex;
      if (!n && this.panelOrder.length > 0 && (n = this.panelOrder[0].id, s = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${n}`)), n) {
        this.log(`📋 显示面板 ${n} 的标签页`);
        let c = this.panelTabsData[s] || [];
        c.length === 0 && (this.log(`🔍 面板 ${n} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(s, n), c = this.panelTabsData[s] || []), this.sortTabsByPinStatus(), c.forEach((l, d) => {
          var u;
          const h = this.createTabElement(l);
          (u = this.tabContainer) == null || u.appendChild(h);
        });
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton(), this.isFixedToTop) {
        const c = "var(--orca-tab-bg)", l = "var(--orca-tab-border)", d = "var(--orca-color-text-1)", h = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        h.forEach((p) => {
          const g = p.getAttribute("data-tab-id");
          if (!g) return;
          const m = this.getCurrentPanelTabs().find((v) => v.blockId === g);
          if (m) {
            let v, y, w = "normal";
            if (v = "var(--orca-tab-bg)", y = "var(--orca-color-text-1)", m.color)
              try {
                p.style.setProperty("--tab-color", m.color), (document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark")) && p.style.setProperty(
                  "--orca-tab-colored-text",
                  "oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h)",
                  "important"
                ), v = "var(--orca-tab-colored-bg)", y = "var(--orca-tab-colored-text)", w = "600";
              } catch {
              }
            p.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${v};
            border-radius: var(--orca-radius-md);
            border: 1px solid ${l};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${y};
            font-weight: ${w};
            max-width: 100px;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            -webkit-app-region: no-drag;
            app-region: no-drag;
            pointer-events: auto;
          `, m.color && p.style.setProperty("--tab-color", m.color);
          }
        });
        const u = this.tabContainer.querySelector(".new-tab-button");
        u && (u.style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${c};
          border-radius: var(--orca-radius-md);
          border: 1px solid ${l};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${d};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${h.length}`);
      }
    } catch (t) {
      this.error("更新UI时发生错误:", t);
    } finally {
      this.isUpdating = !1;
    }
  }
  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || !this.tabContainer) return;
    let e = this.getCurrentPanelTabs();
    e.length === 0 && (await this.scanCurrentPanelTabs(), e = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${e.length} 个标签页`);
    const t = document.createDocumentFragment();
    if (e.length > 0)
      e.forEach((a, r) => {
        const i = this.createTabElement(a);
        t.appendChild(i);
      });
    else {
      const a = document.createElement("div");
      a.className = "panel-status", a.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: var(--orca-color-text-1);
        font-weight: normal;
        padding: 6px 12px;
        border-radius: var(--orca-radius-md);
        font-size: 12px;
        white-space: nowrap;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: auto;
      `;
      const r = this.currentPanelIndex + 1;
      a.textContent = `面板 ${r}（无标签页）`, a.title = `当前在面板 ${r}，该面板没有标签页`, t.appendChild(a);
    }
    this.tabContainer.appendChild(t), this.addNewTabButton();
  }
  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || !this.tabContainer) return;
    let e = this.getCurrentPanelTabs();
    e.length === 0 && (await this.checkCurrentPanelBlocks(), e = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${e.length} 个标签页`);
    const t = document.createDocumentFragment();
    if (e.length > 0)
      e.forEach((a, r) => {
        const i = this.createTabElement(a);
        t.appendChild(i);
      });
    else {
      const a = document.createElement("div");
      a.className = "panel-status", a.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: var(--orca-color-text-1);
        font-weight: normal;
        padding: 6px 12px;
        border-radius: var(--orca-radius-md);
        font-size: 12px;
        white-space: nowrap;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: auto;
      `;
      const r = this.currentPanelIndex + 1;
      a.textContent = `面板 ${r}（无标签页）`, a.title = `当前在面板 ${r}，该面板没有标签页`, t.appendChild(a);
    }
    this.tabContainer.appendChild(t), this.addNewTabButton();
  }
  /**
   * 检查和恢复更新状态 - 防止 isUpdating 标志卡死
   */
  checkAndRecoverUpdateState() {
    this.isUpdating && Date.now() - this.lastUpdateTime > 5e3 && (this.warn("检测到更新标志卡死，强制重置"), this.isUpdating = !1, this.debouncedUpdateTabsUI());
  }
  /**
   * 添加新建标签页按钮
   */
  addNewTabButton() {
    if (!this.tabContainer || this.tabContainer.querySelector(".new-tab-button")) return;
    const t = document.createElement("div");
    t.className = "new-tab-button";
    const a = this.isVerticalMode ? `
      width: calc(100% - 6px);
      margin: 0 3px;
      height: 24px;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
    ` : `
      width: 24px;
      height: 24px;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
      margin-left: 4px;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
    `;
    t.style.cssText = a, t.innerHTML = "+", t.title = "新建标签页", t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", async (r) => {
      r.preventDefault(), r.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(t), this.addNewTabButtonContextMenu(t), this.enableWorkspaces && this.addWorkspaceButton();
  }
  /**
   * 移除工作区按钮
   */
  removeWorkspaceButton() {
    if (!this.tabContainer) return;
    const e = this.tabContainer.querySelector(".workspace-button");
    e && (e.remove(), this.log("📁 工作区按钮已移除"));
  }
  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    var r;
    if (!this.tabContainer || this.tabContainer.querySelector(".workspace-button")) return;
    const t = document.createElement("div");
    t.className = "workspace-button";
    const a = this.isVerticalMode ? `
      width: calc(100% - 6px);
      margin: 0 3px;
      height: 24px;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
    ` : `
      width: 24px;
      height: 24px;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
      margin-left: 4px;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
    `;
    t.style.cssText = a, t.innerHTML = "📁", t.title = `工作区 (${((r = this.workspaces) == null ? void 0 : r.length) || 0})`, t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", (i) => {
      i.preventDefault(), i.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(i);
    }), this.tabContainer.appendChild(t);
  }
  /**
   * 为新建标签页按钮添加右键菜单
   */
  addNewTabButtonContextMenu(e) {
    e.addEventListener("contextmenu", (t) => {
      t.preventDefault(), t.stopPropagation(), this.showNewTabButtonContextMenu(t);
    });
  }
  /**
   * 显示新建标签页按钮的右键菜单
   */
  showNewTabButtonContextMenu(e) {
    var d, h;
    const t = document.querySelector(".new-tab-context-menu");
    t && t.remove(), document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") : document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null || h.themeMode);
    const a = document.createElement("div");
    a.className = "new-tab-context-menu";
    const r = 200, i = 140, { x: n, y: s } = H(e.clientX, e.clientY, r, i);
    a.style.cssText = `
      position: fixed;
      left: ${n}px;
      top: ${s}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: ${r}px;
      padding: var(--orca-spacing-sm);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const c = [
      {
        text: "新建标签页",
        action: () => this.createNewTab(),
        icon: "+"
      }
    ];
    this.isFixedToTop && c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: "取消固定到顶部",
        action: () => this.toggleFixedToTop(),
        icon: "📌"
      }
    ), this.isFixedToTop || c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: this.isVerticalMode ? "切换到水平布局" : "切换到垂直布局",
        action: () => this.toggleLayoutMode(),
        icon: this.isVerticalMode ? "⏸" : "⏵"
      }
    ), !this.isVerticalMode && !this.isFixedToTop && c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: "固定到顶部",
        action: () => this.toggleFixedToTop(),
        icon: "📌"
      }
    ), this.isVerticalMode && !this.isFixedToTop && c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: "调整面板宽度",
        action: () => this.showWidthAdjustmentDialog(),
        icon: "📏"
      }
    ), this.isFixedToTop || c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: this.isSidebarAlignmentEnabled ? "关闭侧边栏对齐" : "开启侧边栏对齐",
        action: () => this.toggleSidebarAlignment(),
        icon: this.isSidebarAlignmentEnabled ? "🔴" : "🟢"
      }
    ), this.enableMultiTabSaving && c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: "保存当前标签页",
        action: () => this.saveCurrentTabs(),
        icon: "💾"
      }
    ), c.forEach((u) => {
      if (u.separator) {
        const f = document.createElement("div");
        f.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, a.appendChild(f);
        return;
      }
      const p = document.createElement("div");
      if (p.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: var(--orca-color-text-1);
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s ease;
      `, u.icon) {
        const f = document.createElement("span");
        f.textContent = u.icon, f.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, p.appendChild(f);
      }
      const g = document.createElement("span");
      g.textContent = u.text, p.appendChild(g), p.addEventListener("mouseenter", () => {
        p.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), p.addEventListener("mouseleave", () => {
        p.style.backgroundColor = "transparent";
      }), p.addEventListener("click", () => {
        u.action && u.action(), a.remove();
      }), a.appendChild(p);
    }), document.body.appendChild(a);
    const l = (u) => {
      a.contains(u.target) || (a.remove(), document.removeEventListener("click", l));
    };
    setTimeout(() => {
      document.addEventListener("click", l);
    }, 100);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 布局切换 - Layout Switching */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 切换布局模式
   */
  async toggleLayoutMode() {
    try {
      this.isVerticalMode ? (this.verticalPosition = { ...this.position }, this.position = this.horizontalPosition || { x: 100, y: 100 }) : (this.horizontalPosition = { ...this.position }, this.position = this.verticalPosition || { x: 100, y: 100 }), this.isVerticalMode = !this.isVerticalMode, await this.saveLayoutMode(), await this.createTabsUI(), this.log(`📐 布局模式已切换为: ${this.isVerticalMode ? "垂直" : "水平"}`);
    } catch (e) {
      this.error("切换布局模式失败:", e);
    }
  }
  /**
   * 切换固定到顶部模式
   */
  async toggleFixedToTop() {
    try {
      this.log(`🔄 切换固定到顶部: ${this.isFixedToTop ? "取消固定" : "固定到顶部"}`), this.isFixedToTop = !this.isFixedToTop, await this.saveFixedToTopMode(), await this.createTabsUI(), this.log(`✅ 固定到顶部已${this.isFixedToTop ? "启用" : "禁用"}`);
    } catch (e) {
      this.error("切换固定到顶部失败:", e);
    }
  }
  /**
   * 切换侧边栏对齐状态
   */
  async toggleSidebarAlignment() {
    try {
      this.isSidebarAlignmentEnabled ? await this.disableSidebarAlignment() : await this.enableSidebarAlignment();
    } catch (e) {
      this.error("切换侧边栏对齐失败:", e);
    }
  }
  /**
   * 启用侧边栏对齐功能
   */
  async enableSidebarAlignment() {
    try {
      this.log("🚀 启用侧边栏对齐功能");
      const e = this.getSidebarWidth();
      if (this.log(`📏 读取到的侧边栏宽度: ${e}px`), e === 0) {
        this.log("⚠️ 无法读取侧边栏宽度，操作终止");
        return;
      }
      this.isSidebarAlignmentEnabled = !0, this.startSidebarAlignmentObserver(), this.log("✅ 侧边栏对齐功能已启用，标签栏保持在当前位置");
    } catch (e) {
      this.error("启用侧边栏对齐失败:", e);
    }
  }
  /**
   * 禁用侧边栏对齐功能
   */
  async disableSidebarAlignment() {
    try {
      this.log("🔴 禁用侧边栏对齐功能"), this.stopSidebarAlignmentObserver(), await this.performSidebarAlignment(), this.isSidebarAlignmentEnabled = !1, this.log("🔴 侧边栏对齐功能已禁用");
    } catch (e) {
      this.error("禁用侧边栏对齐失败:", e);
    }
  }
  /**
   * 开始监听侧边栏状态变化（使用 MutationObserver）
   */
  startSidebarAlignmentObserver() {
    this.stopSidebarAlignmentObserver(), this.updateLastSidebarState();
    const e = document.querySelector("div#app");
    if (!e) {
      this.log("⚠️ 未找到 div#app 元素，无法监听侧边栏状态变化");
      return;
    }
    this.sidebarAlignmentObserver = new MutationObserver((t) => {
      t.some(
        (r) => r.type === "attributes" && r.attributeName === "class"
      ) && (this.log("🔄 检测到 div#app class 变化，立即检查侧边栏状态"), this.checkSidebarStateChangeImmediate());
    }), this.sidebarAlignmentObserver.observe(e, {
      attributes: !0,
      attributeFilter: ["class"]
    }), this.log("👁️ 开始监听侧边栏状态变化（MutationObserver 模式）");
  }
  /**
   * 停止监听侧边栏状态变化
   */
  stopSidebarAlignmentObserver() {
    this.sidebarAlignmentObserver && (this.sidebarAlignmentObserver.disconnect(), this.sidebarAlignmentObserver = null), this.sidebarDebounceTimer && (clearTimeout(this.sidebarDebounceTimer), this.sidebarDebounceTimer = null), this.lastSidebarState = null, this.log("👁️ 停止监听侧边栏状态变化");
  }
  /**
   * 更新上次检测到的侧边栏状态
   */
  updateLastSidebarState() {
    const e = document.querySelector("div#app");
    if (!e) {
      this.lastSidebarState = null;
      return;
    }
    const t = e.classList.contains("sidebar-closed"), a = e.classList.contains("sidebar-opened");
    t ? this.lastSidebarState = "closed" : a ? this.lastSidebarState = "opened" : this.lastSidebarState = "unknown";
  }
  /**
   * 立即检查侧边栏状态变化（无防抖）
   */
  checkSidebarStateChangeImmediate() {
    if (!this.isSidebarAlignmentEnabled) return;
    const e = document.querySelector("div#app");
    if (!e) return;
    const t = e.classList.contains("sidebar-closed"), a = e.classList.contains("sidebar-opened");
    let r;
    t ? r = "closed" : a ? r = "opened" : r = "unknown", this.lastSidebarState !== r && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${r}`), this.lastSidebarState = r, this.autoAdjustSidebarAlignment());
  }
  /**
   * 检查侧边栏状态是否发生变化（带防抖）
   */
  checkSidebarStateChange() {
    this.isSidebarAlignmentEnabled && (this.sidebarDebounceTimer && clearTimeout(this.sidebarDebounceTimer), this.sidebarDebounceTimer = window.setTimeout(() => {
      this.checkSidebarStateChangeImmediate();
    }, 50));
  }
  /**
   * 自动调整侧边栏对齐
   */
  async autoAdjustSidebarAlignment() {
    this.isSidebarAlignmentEnabled && await this.performSidebarAlignment();
  }
  /**
   * 执行侧边栏对齐的核心逻辑
   */
  async performSidebarAlignment() {
    try {
      const e = this.getSidebarWidth();
      if (e === 0) return;
      const t = document.querySelector("div#app");
      if (!t) return;
      const a = t.classList.contains("sidebar-closed"), r = t.classList.contains("sidebar-opened");
      if (!a && !r) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const i = this.getCurrentPosition();
      if (!i) return;
      const n = this.calculateSidebarAlignmentPosition(
        i,
        e,
        a,
        r
      );
      if (!n) return;
      await this.updatePosition(n), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${i.x}, ${i.y}) → (${n.x}, ${n.y})`);
    } catch (e) {
      this.error("侧边栏对齐失败:", e);
    }
  }
  /**
   * 获取当前位置
   */
  getCurrentPosition() {
    if (this.tabContainer) {
      const e = this.tabContainer.getBoundingClientRect();
      return { x: e.left, y: e.top };
    }
    return this.isVerticalMode ? { x: this.verticalPosition.x, y: this.verticalPosition.y } : { x: this.position.x, y: this.position.y };
  }
  /**
   * 计算侧边栏对齐后的位置
   */
  calculateSidebarAlignmentPosition(e, t, a, r) {
    var n;
    let i;
    if (a)
      i = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${i}px`);
    else if (r) {
      i = e.x + t;
      const s = ((n = this.tabContainer) == null ? void 0 : n.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      i = Math.min(i, window.innerWidth - s - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${i}px`);
    } else
      return null;
    return { x: i, y: e.y };
  }
  /**
   * 更新位置到内存并保存
   */
  async updatePosition(e) {
    this.isVerticalMode ? (this.verticalPosition.x = e.x, this.verticalPosition.y = e.y, await this.saveLayoutMode(), this.log(`📍 垂直模式位置已更新: (${e.x}, ${e.y})`)) : (this.position.x = e.x, this.position.y = e.y, await this.savePosition(), this.log(`📍 水平模式位置已更新: (${e.x}, ${e.y})`));
  }
  /**
   * 切换浮窗显示/隐藏状态
   */
  async toggleFloatingWindow() {
    try {
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), this.registerHeadbarButton(), await this.tabStorageService.saveFloatingWindowVisible(this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("切换浮窗状态失败:", e);
    }
  }
  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    this.isFloatingWindowVisible = await this.tabStorageService.restoreFloatingWindowVisible();
  }
  /**
   * 注册顶部工具栏按钮
   */
  registerHeadbarButton() {
    try {
      this.unregisterHeadbarButton(), orca.headbar.registerHeadbarButton(`${this.pluginName}.toggleButton`, () => {
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: () => this.toggleFloatingWindow(),
          title: this.isFloatingWindowVisible ? "隐藏标签栏" : "显示标签栏",
          style: {
            color: this.isFloatingWindowVisible ? "#666" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: this.isFloatingWindowVisible ? "ti ti-eye" : "ti ti-eye-off"
        }));
      }), this.showInHeadbar && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.debugButton`, () => {
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: () => this.toggleBlockTypeIcons(),
          title: this.showBlockTypeIcons ? "隐藏块类型图标" : "显示块类型图标",
          style: {
            color: this.showBlockTypeIcons ? "#007acc" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: this.showBlockTypeIcons ? "ti ti-palette" : "ti ti-palette-off"
        }));
      }), this.enableRecentlyClosedTabs && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.recentlyClosedButton`, () => {
        var a, r;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (i) => this.showRecentlyClosedTabsMenu(i),
          title: `最近关闭的标签页 (${((a = this.recentlyClosedTabs) == null ? void 0 : a.length) || 0})`,
          style: {
            color: (((r = this.recentlyClosedTabs) == null ? void 0 : r.length) || 0) > 0 ? "#ff6b6b" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: "ti ti-history"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.savedTabsButton`, () => {
        var a, r;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (i) => this.showSavedTabSetsMenu(i),
          title: `保存的标签页集合 (${((a = this.savedTabSets) == null ? void 0 : a.length) || 0})`,
          style: {
            color: (((r = this.savedTabSets) == null ? void 0 : r.length) || 0) > 0 ? "#3b82f6" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: "ti ti-bookmark"
        }));
      }), this.log(`🔘 顶部工具栏按钮已注册 (切换按钮: 总是显示, 调试按钮: ${this.showInHeadbar ? "显示" : "隐藏"}, 最近关闭: ${this.enableRecentlyClosedTabs ? "显示" : "隐藏"}, 保存标签页: ${this.enableMultiTabSaving ? "显示" : "隐藏"})`);
    } catch (e) {
      this.error("注册顶部工具栏按钮失败:", e);
    }
  }
  /**
   * 注销顶部工具栏按钮
   */
  unregisterHeadbarButton() {
    try {
      orca.headbar.unregisterHeadbarButton(`${this.pluginName}.toggleButton`), orca.headbar.unregisterHeadbarButton(`${this.pluginName}.debugButton`), orca.headbar.unregisterHeadbarButton(`${this.pluginName}.recentlyClosedButton`), orca.headbar.unregisterHeadbarButton(`${this.pluginName}.savedTabsButton`), this.log("🔘 顶部工具栏按钮已注销");
    } catch (e) {
      this.error("注销顶部工具栏按钮失败:", e);
    }
  }
  /**
   * 显示块类型图标信息（调试功能）
   */
  showBlockTypeIconsInfo() {
    this.getAllBlockTypeIcons(), this.getCurrentPanelTabs().length > 0, this.log("🎨 块类型图标信息已输出到控制台");
  }
  /**
   * 切换块类型图标显示
   */
  async toggleBlockTypeIcons() {
    this.showBlockTypeIcons = !this.showBlockTypeIcons, this.log(`🎨 切换块类型图标显示: ${this.showBlockTypeIcons ? "开启" : "关闭"}`), await this.updateTabsUI(), await this.registerHeadbarButton();
    try {
      await this.saveLayoutMode(), await this.storageService.saveConfig("showBlockTypeIcons", this.showBlockTypeIcons, this.pluginName), this.log(`✅ 块类型图标显示设置已保存: ${this.showBlockTypeIcons ? "开启" : "关闭"}`);
    } catch (e) {
      this.error("保存设置失败:", e);
    }
  }
  /**
   * 更新所有标签页的块类型和图标
   */
  async updateAllTabsBlockTypes() {
    this.log("🔄 开始更新所有标签页的块类型和图标...");
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) {
      this.log("⚠️ 没有标签页需要更新");
      return;
    }
    let t = !1;
    for (let a = 0; a < e.length; a++) {
      const r = e[a];
      try {
        const i = await orca.invokeBackend("get-block", parseInt(r.blockId));
        if (i) {
          const n = await ee(i), s = this.findProperty(i, "_color"), c = this.findProperty(i, "_icon");
          let l = r.color, d = r.icon;
          s && s.type === 1 && (l = s.value), c && c.type === 1 && c.value && c.value.trim() ? d = c.value : d || (d = _(n)), r.blockType !== n || r.icon !== d || r.color !== l ? (e[a] = {
            ...r,
            blockType: n,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${r.title} -> 类型: ${n}, 图标: ${d}, 颜色: ${l}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${r.title} (无需更新)`);
        }
      } catch (i) {
        this.warn(`更新标签失败: ${r.title}`, i);
      }
    }
    t ? (this.log("🔄 检测到更新，保存数据并重新创建UI..."), this.setCurrentPanelTabs(e), await this.createTabsUI()) : this.log("ℹ️ 没有标签页需要更新"), this.log("✅ 所有标签页的块类型和图标已更新");
  }
  /**
   * 对齐到侧边栏（手动触发）
   */
  async alignToSidebar() {
    try {
      this.log("🎯 手动触发侧边栏对齐"), await this.performSidebarAlignment();
    } catch (e) {
      this.error("对齐到侧边栏失败:", e);
    }
  }
  /**
   * 获取侧边栏宽度
   */
  getSidebarWidth() {
    try {
      this.log("🔍 开始获取侧边栏宽度...");
      const e = document.querySelector("nav#sidebar");
      if (this.log(`   查找 nav#sidebar 元素: ${e ? "找到" : "未找到"}`), !e)
        return this.log("⚠️ 未找到 nav#sidebar 元素"), 0;
      this.log("   侧边栏元素信息:"), this.log(`     - ID: ${e.id}`), this.log(`     - 类名: ${e.className}`), this.log(`     - 标签名: ${e.tagName}`);
      const a = window.getComputedStyle(e).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${a}"`), a && a !== "") {
        const i = parseInt(a.replace("px", ""));
        if (isNaN(i))
          this.log(`⚠️ CSS变量值无法解析为数字: "${a}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${i}px`), i;
      } else
        this.log("⚠️ CSS变量 --orca-sidebar-width 不存在或为空");
      this.log("   尝试获取实际宽度...");
      const r = e.getBoundingClientRect();
      return this.log(`   实际尺寸: width=${r.width}px, height=${r.height}px`), r.width > 0 ? (this.log(`✅ 从实际尺寸获取侧边栏宽度: ${r.width}px`), r.width) : (this.log("⚠️ 无法获取侧边栏宽度，所有方法都失败"), 0);
    } catch (e) {
      return this.error("获取侧边栏宽度失败:", e), 0;
    }
  }
  /**
   * 启用拖拽调整宽度功能（重构版）
   */
  enableDragResize() {
    !this.isVerticalMode || !this.tabContainer || (this.removeResizeHandle(), this.createResizeHandle(), this.log("📏 拖拽调整宽度已启用"));
  }
  /**
   * 移除拖拽手柄
   */
  removeResizeHandle() {
    this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null);
  }
  /**
   * 创建拖拽手柄
   */
  createResizeHandle() {
    this.tabContainer && (this.resizeHandle = document.createElement("div"), this.resizeHandle.className = "resize-handle", this.resizeHandle.style.cssText = `
      position: absolute;
      top: 0;
      right: -4px;
      width: 8px;
      height: 100%;
      cursor: col-resize;
      background: rgba(0, 0, 0, 0.1);
      z-index: 1000;
      pointer-events: auto;
    `, this.resizeHandle.addEventListener("mousedown", this.handleResizeStart.bind(this)), this.tabContainer.appendChild(this.resizeHandle));
  }
  /**
   * 处理拖拽开始
   */
  handleResizeStart(e) {
    if (e.preventDefault(), e.stopPropagation(), !this.tabContainer) return;
    const t = e.clientX, a = this.verticalWidth, r = async (n) => {
      const s = n.clientX - t, c = Math.max(120, Math.min(400, a + s));
      this.verticalWidth = c;
      try {
        orca.nav.changeSizes(orca.state.activePanel, [c]), this.tabContainer.style.width = `${c}px`;
      } catch (l) {
        this.error("调整面板宽度失败:", l);
      }
    }, i = async () => {
      document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", i);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (n) {
        this.error("保存宽度设置失败:", n);
      }
    };
    document.addEventListener("mousemove", r), document.addEventListener("mouseup", i);
  }
  /**
   * 清理拖拽功能
   */
  cleanupDragResize() {
    this.removeResizeHandle();
  }
  /**
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    const e = document.querySelector(".width-adjustment-dialog");
    e && e.remove();
    const t = this.verticalWidth, a = wa(
      this.verticalWidth,
      async (r) => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [r]), this.tabContainer && (this.tabContainer.style.width = `${r}px`), this.verticalWidth = r, await this.saveLayoutMode();
        } catch (i) {
          this.error("实时调整面板宽度失败:", i);
        }
      },
      async () => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [t]), this.tabContainer && (this.tabContainer.style.width = `${t}px`), this.verticalWidth = t;
        } catch (r) {
          this.error("恢复面板宽度失败:", r);
        }
      }
    );
    document.body.appendChild(a);
  }
  /**
   * 更新垂直模式宽度
   */
  async updateVerticalWidth(e) {
    try {
      this.verticalWidth = e, await this.saveLayoutMode(), await this.createTabsUI(), this.log(`📏 垂直模式宽度已更新为: ${e}px`);
    } catch (t) {
      this.error("更新宽度失败:", t);
    }
  }
  /**
   * 创建标签元素
   */
  createTabElement(e) {
    this.verboseLog(`🔧 创建标签元素: ${e.title} (ID: ${e.blockId})`);
    const t = document.createElement("div");
    t.className = "orca-tab", t.setAttribute("data-tab-id", e.blockId), this.isTabActive(e) && t.setAttribute("data-focused", "true");
    const r = this.isVerticalMode && !this.isFixedToTop, i = Qt(e, r);
    t.style.cssText = i;
    const n = Gt();
    if (e.icon && this.showBlockTypeIcons) {
      const c = Xt(e.icon);
      n.appendChild(c);
    }
    const s = Kt(e.title);
    if (n.appendChild(s), e.isPinned) {
      const c = Jt();
      n.appendChild(c);
    }
    return t.appendChild(n), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), t.title = Zt(e), t.addEventListener("click", (c) => {
      var d;
      c.preventDefault(), this.log(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`), this.closedTabs.has(e.blockId) && (this.closedTabs.delete(e.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${e.title}"，从已关闭列表中移除`));
      const l = (d = this.tabContainer) == null ? void 0 : d.querySelectorAll(".orca-tabs-plugin .orca-tab");
      l == null || l.forEach((h) => h.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (c) => {
    }), t.addEventListener("dblclick", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.closeTab(e));
    }), t.addEventListener("keydown", (c) => {
      (c.target === t || t.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(e)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (c) => {
      var h, u;
      if (c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", c.dataTransfer.dropEffect = "move", (h = c.dataTransfer) == null || h.setData("text/plain", e.blockId);
      const d = document.createElement("img");
      d.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", d.style.opacity = "0";
      try {
        const p = t.getBoundingClientRect(), g = c.clientX - p.left, f = c.clientY - p.top;
        (u = c.dataTransfer) == null || u.setDragImage(d, g, f);
      } catch {
      }
      this.draggingTab = e, this.dragOverTab = null, this.lastSwapKey = "", this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (console.log("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), console.log("🔄 拖拽开始，设置draggingTab:", e.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), requestAnimationFrame(() => {
        t.style.opacity = "0", t.style.pointerEvents = "none";
      }), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", async (c) => {
      console.log("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (console.log("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback();
      const l = this.getCurrentPanelTabs();
      await this.setCurrentPanelTabs(l), this.draggingTab = null, this.dragOverTab = null, this.lastSwapKey = "", this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (c) => {
      const l = c.target;
      if (!l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        if (this.tabContainer && !this.tabContainer.contains(l)) {
          c.dataTransfer.dropEffect = "none";
          return;
        }
        if (!(l.classList.contains("close-button") || l.classList.contains("new-tab-button") || l.classList.contains("drag-handle") || l.classList.contains("resize-handle") || l.classList.contains("tab-icon")) && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
          if (this.draggingTab.isPinned !== e.isPinned) {
            c.dataTransfer.dropEffect = "none";
            return;
          }
          c.preventDefault(), c.stopPropagation(), c.dataTransfer.dropEffect = "move";
          const d = t.getBoundingClientRect(), h = this.isVerticalMode && !this.isFixedToTop;
          let u;
          if (h) {
            const g = d.top + d.height / 2;
            u = c.clientY < g ? "before" : "after";
          } else {
            const g = d.left + d.width / 2;
            u = c.clientX < g ? "before" : "after";
          }
          this.updateDropIndicator(t, u), this.dragOverTab = e;
          const p = `${e.blockId}-${u}`;
          this.lastSwapKey !== p && (this.lastSwapKey = p, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
            await this.swapTabsRealtime(e, this.draggingTab, u);
          }, 100)), this.verboseLog(`🔄 拖拽经过: ${e.title} (位置: ${u})`);
        }
      }
    }), t.addEventListener("dragenter", (c) => {
      if (!c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (this.draggingTab.isPinned !== e.isPinned)
          return;
        c.preventDefault(), c.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`);
      }
    }), t.addEventListener("dragleave", (c) => {
      const l = t.getBoundingClientRect(), d = c.clientX, h = c.clientY, u = 5;
      (d < l.left - u || d > l.right + u || h < l.top - u || h > l.bottom + u) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (c) => {
      var d;
      c.preventDefault(), c.stopPropagation();
      const l = (d = c.dataTransfer) == null ? void 0 : d.getData("text/plain");
      this.log(`🔄 拖拽放置完成: ${l} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return Yt(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const a = parseInt(t[1], 16), r = parseInt(t[2], 16), i = parseInt(t[3], 16);
      return (0.299 * a + 0.587 * r + 0.114 * i) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (a) {
      let r = parseInt(a[1], 16), i = parseInt(a[2], 16), n = parseInt(a[3], 16);
      r = Math.floor(r * (1 - t)), i = Math.floor(i * (1 - t)), n = Math.floor(n * (1 - t));
      const s = r.toString(16).padStart(2, "0"), c = i.toString(16).padStart(2, "0"), l = n.toString(16).padStart(2, "0");
      return `#${s}${c}${l}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, a) {
    const r = e / 255, i = t / 255, n = a / 255, s = (J) => J <= 0.04045 ? J / 12.92 : Math.pow((J + 0.055) / 1.055, 2.4), c = s(r), l = s(i), d = s(n), h = c * 0.4124564 + l * 0.3575761 + d * 0.1804375, u = c * 0.2126729 + l * 0.7151522 + d * 0.072175, p = c * 0.0193339 + l * 0.119192 + d * 0.9503041, g = 0.2104542553 * h + 0.793617785 * u - 0.0040720468 * p, f = 1.9779984951 * h - 2.428592205 * u + 0.4505937099 * p, m = 0.0259040371 * h + 0.7827717662 * u - 0.808675766 * p, v = Math.cbrt(g), y = Math.cbrt(f), w = Math.cbrt(m), x = 0.2104542553 * v + 0.793617785 * y + 0.0040720468 * w, k = 1.9779984951 * v - 2.428592205 * y + 0.4505937099 * w, M = 0.0259040371 * v + 0.7827717662 * y - 0.808675766 * w, S = Math.sqrt(k * k + M * M), R = Math.atan2(M, k) * 180 / Math.PI, F = R < 0 ? R + 360 : R;
    return { l: x, c: S, h: F };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, a) {
    const r = a * Math.PI / 180, i = t * Math.cos(r), n = t * Math.sin(r), s = e, c = i, l = n, d = s * s * s, h = c * c * c, u = l * l * l, p = 1.0478112 * d + 0.0228866 * h - 0.050217 * u, g = 0.0295424 * d + 0.9904844 * h + 0.0170491 * u, f = -92345e-7 * d + 0.0150436 * h + 0.7521316 * u, m = 3.2404542 * p - 1.5371385 * g - 0.4985314 * f, v = -0.969266 * p + 1.8760108 * g + 0.041556 * f, y = 0.0556434 * p - 0.2040259 * g + 1.0572252 * f, w = (S) => S <= 31308e-7 ? 12.92 * S : 1.055 * Math.pow(S, 1 / 2.4) - 0.055, x = Math.max(0, Math.min(255, Math.round(w(m) * 255))), k = Math.max(0, Math.min(255, Math.round(w(v) * 255))), M = Math.max(0, Math.min(255, Math.round(w(y) * 255)));
    return { r: x, g: k, b: M };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return fa(e, t);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 标签操作 - Tab Operations */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 获取当前面板的标签页数据 - 重构为简化的数组访问
   * 按照用户思路：直接用索引访问panelTabsData数组
   */
  getCurrentPanelTabs() {
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length)
      return this.log(`⚠️ 当前面板索引无效: ${this.currentPanelIndex}, 面板总数: ${this.getPanelIds().length}`), [];
    this.currentPanelIndex >= this.panelTabsData.length && (this.log(`🔧 调整panelTabsData数组大小，当前: ${this.panelTabsData.length}, 需要: ${this.currentPanelIndex + 1}`), this.adjustPanelTabsDataSize());
    const e = this.panelTabsData[this.currentPanelIndex] || [];
    return this.verboseLog(`📋 获取面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${e.length} 个`), e;
  }
  /**
   * 设置当前面板的标签页数据 - 重构为简化的数组操作
   * 按照用户思路：直接更新panelTabsData数组
   */
  setCurrentPanelTabs(e) {
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length) {
      this.log(`⚠️ 无法设置标签页数据，当前面板索引无效: ${this.currentPanelIndex}`);
      return;
    }
    this.currentPanelIndex >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[this.currentPanelIndex] = [...e], this.log(`📋 设置面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${e.length} 个`), this.saveCurrentPanelTabs();
  }
  /**
   * 保存当前面板的标签页数据到存储（带防抖）
   * 
   * 使用防抖机制避免频繁保存：
   * - 在短时间内的多次保存操作会被合并为一次
   * - 减少I/O操作，提高性能
   * - 确保最终数据的一致性
   */
  saveCurrentPanelTabs() {
    this.saveDataDebounceTimer !== null && clearTimeout(this.saveDataDebounceTimer), this.saveDataDebounceTimer = window.setTimeout(async () => {
      try {
        if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length)
          return;
        const e = this.panelTabsData[this.currentPanelIndex] || [], t = this.currentPanelIndex === 0 ? T.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
        await this.tabStorageService.savePanelTabsByKey(t, e);
      } catch (e) {
        this.error("保存面板标签页数据失败:", e);
      } finally {
        this.saveDataDebounceTimer = null;
      }
    }, this.SAVE_DEBOUNCE_DELAY);
  }
  /**
   * 立即保存当前面板的标签页数据（不使用防抖）
   * 
   * 在某些关键场景下需要立即保存数据，不能等待防抖：
   * - 插件卸载时
   * - 用户手动触发保存时
   * - 面板关闭时
   */
  async saveCurrentPanelTabsImmediately() {
    if (this.saveDataDebounceTimer !== null && (clearTimeout(this.saveDataDebounceTimer), this.saveDataDebounceTimer = null), this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length)
      return;
    const e = this.panelTabsData[this.currentPanelIndex] || [], t = this.currentPanelIndex === 0 ? T.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.tabStorageService.savePanelTabsByKey(t, e);
  }
  /**
   * 同步当前标签数组到对应的存储数组
   */
  syncCurrentTabsToStorage(e) {
    this.setCurrentPanelTabs(e);
  }
  async switchToTab(e) {
    try {
      this.recordPerformanceCountMetric(this.performanceMetricKeys.tabInteraction), this.log(`🔄 开始切换标签: ${e.title} (ID: ${e.blockId})`), this.isSwitchingTab = !0;
      const t = this.getCurrentActiveTab();
      t && t.blockId !== e.blockId && (this.recordScrollPosition(t), this.lastActiveBlockId = t.blockId, this.log(`🎯 记录切换前的激活标签: ${t.title} (ID: ${t.blockId})`));
      const a = this.getPanelIds();
      let r = "";
      if (e.panelId && a.includes(e.panelId) ? r = e.panelId : this.currentPanelId && a.includes(this.currentPanelId) ? r = this.currentPanelId : a.length > 0 && (r = a[0]), !r) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const i = a.indexOf(r);
      i !== -1 ? (this.currentPanelIndex = i, this.currentPanelId = r) : this.warn(`⚠️ 目标面板 ${r} 不在面板列表中`), this.log(`🎯 目标面板ID: ${r}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(r);
      } catch (n) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", n);
      }
      try {
        this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${e.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, r), this.log("✅ orca.nav.goTo 导航成功");
      } catch (n) {
        this.warn("导航失败，尝试备用方法:", n);
        const s = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (s)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), s.click();
        else {
          this.error("无法找到目标块元素:", e.blockId);
          const c = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          c ? (this.log("🔄 找到备用块元素，尝试点击"), c.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = e.blockId, this.log(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
        this.debugScrollPosition(e);
      }, 500), await this.focusTabElementById(e.blockId), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页切换，实时更新工作区: ${e.title}`)), setTimeout(() => {
        this.isSwitchingTab = !1;
      }, 300);
    } catch (t) {
      this.error("切换标签失败:", t), this.isSwitchingTab = !1;
    }
  }
  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(e) {
    const t = document.querySelector(".orca-panel.active");
    if (!t) return !1;
    const a = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    return a ? a.getAttribute("data-block-id") === e.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), a = t.findIndex((i) => i.blockId === e.blockId);
    if (a === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let r = -1;
    if (a === 0 ? r = 1 : a === t.length - 1 ? r = a - 1 : r = a + 1, r >= 0 && r < t.length) {
      const i = t[r];
      this.log(`🔄 自动切换到相邻标签: "${i.title}" (位置: ${r})`), this.currentPanelId && await orca.nav.goTo("block", { blockId: parseInt(i.blockId) }, this.currentPanelId || "");
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), a = ra(e, t, {
      updateOrder: !0,
      saveData: !0,
      updateUI: !0
    });
    a.success ? (this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页固定状态变化，实时更新工作区: ${e.title}`)), this.log(a.message)) : this.warn(a.message);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 设置管理 - Settings Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 注册插件设置
   */
  async registerPluginSettings() {
    var e;
    try {
      const t = {
        homePageBlockId: {
          label: "主页块ID",
          type: "string",
          defaultValue: "",
          description: "新建标签页时将导航到此块ID"
        },
        showInHeadbar: {
          label: "显示顶部工具栏按钮",
          type: "boolean",
          defaultValue: !0,
          description: "控制标签页顶部是否显示块类型图标按钮"
        },
        enableRecentlyClosedTabs: {
          label: "启用最近关闭的标签页功能",
          type: "boolean",
          defaultValue: !0,
          description: "控制是否启用最近关闭的标签页功能，包括顶部工具栏按钮和标签页恢复功能"
        },
        enableMultiTabSaving: {
          label: "启用多标签页保存功能",
          type: "boolean",
          defaultValue: !0,
          description: "控制是否启用多标签页保存功能，可以保存当前多个标签页的集合并随时恢复"
        },
        enableWorkspaces: {
          label: "启用工作区功能",
          type: "boolean",
          defaultValue: !0,
          description: "控制是否启用工作区功能，可以保存当前标签页为工作区并快速切换"
        },
        debugMode: {
          label: "调试模式",
          type: "boolean",
          defaultValue: !1,
          description: "开启后将显示详细的调试日志（仅用于开发调试，可能影响性能）"
        },
        restoreFocusedTab: {
          label: "刷新后恢复聚焦标签页",
          type: "boolean",
          defaultValue: !0,
          description: "开启后，软件刷新时将自动聚焦并打开当前聚焦的标签页；关闭后，只打开持久化的标签页"
        }
      };
      await orca.plugins.setSettingsSchema(this.pluginName, t);
      const a = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      a != null && a.homePageBlockId && (this.homePageBlockId = a.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (a == null ? void 0 : a.showInHeadbar) !== void 0 && (this.showInHeadbar = a.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = a.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = a.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableWorkspaces) !== void 0 && (this.enableWorkspaces = a.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), (a == null ? void 0 : a.debugMode) !== void 0 && (a.debugMode ? this.setLogLevel(P.VERBOSE) : this.setLogLevel(P.INFO), await this.storageService.saveConfig(T.DEBUG_MODE, a.debugMode, this.pluginName)), (a == null ? void 0 : a.restoreFocusedTab) !== void 0 && (this.restoreFocusedTab = a.restoreFocusedTab, this.log(`🎯 刷新后恢复聚焦标签页: ${this.restoreFocusedTab ? "开启" : "关闭"}`), await this.storageService.saveConfig(T.RESTORE_FOCUSED_TAB, a.restoreFocusedTab, this.pluginName)), this.log("✅ 插件设置已注册");
    } catch (t) {
      this.error("注册插件设置失败:", t);
    }
  }
  /**
   * 设置设置检查监听器
   */
  setupSettingsChecker() {
    this.lastSettings = {
      showInHeadbar: this.showInHeadbar,
      homePageBlockId: this.homePageBlockId,
      enableWorkspaces: this.enableWorkspaces,
      debugMode: this.currentLogLevel === P.VERBOSE,
      restoreFocusedTab: this.restoreFocusedTab
    }, this.settingsCheckInterval = setInterval(() => {
      this.checkSettingsChange();
    }, 2e3);
  }
  /**
   * 检查设置变化
   */
  checkSettingsChange() {
    var e;
    try {
      const t = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      if (!t) return;
      if (t.showInHeadbar !== this.lastSettings.showInHeadbar) {
        const a = this.showInHeadbar;
        this.showInHeadbar = t.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${a ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (t.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = t.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), t.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const a = this.enableWorkspaces;
        this.enableWorkspaces = t.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${a ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.enableWorkspaces || this.removeWorkspaceButton(), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
      if (t.debugMode !== this.lastSettings.debugMode && (t.debugMode ? this.setLogLevel(P.VERBOSE) : this.setLogLevel(P.INFO), this.storageService.saveConfig(T.DEBUG_MODE, t.debugMode, this.pluginName).catch((a) => {
        this.error("保存调试模式设置失败:", a);
      }), this.lastSettings.debugMode = t.debugMode), t.restoreFocusedTab !== this.lastSettings.restoreFocusedTab) {
        const a = this.restoreFocusedTab;
        this.restoreFocusedTab = t.restoreFocusedTab, this.log(`🎯 设置变化：刷新后恢复聚焦标签页 ${a ? "开启" : "关闭"} -> ${this.restoreFocusedTab ? "开启" : "关闭"}`), this.storageService.saveConfig(T.RESTORE_FOCUSED_TAB, t.restoreFocusedTab, this.pluginName).catch((r) => {
          this.error("保存聚焦标签页恢复设置失败:", r);
        }), this.lastSettings.restoreFocusedTab = this.restoreFocusedTab;
      }
    } catch (t) {
      this.error("检查设置变化失败:", t);
    }
  }
  /**
   * 注册块菜单命令
   */
  registerBlockMenuCommands() {
    try {
      orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.openInNewTab", {
        worksOnMultipleBlocks: !1,
        render: (e, t, a) => {
          const r = window.React;
          return !r || !orca.components.MenuText ? null : r.createElement(orca.components.MenuText, {
            title: "在新标签页打开",
            preIcon: "ti ti-external-link",
            onClick: () => {
              a(), this.openInNewTab(e.toString());
            }
          });
        }
      }), orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.addToTabGroup", {
        worksOnMultipleBlocks: !1,
        render: (e, t, a) => {
          const r = window.React;
          return !r || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : r.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              a(), this.getTabInfo(e.toString(), this.currentPanelId || "" || "", 0).then((i) => {
                i ? this.showAddToTabGroupDialog(i) : orca.notify("error", "无法获取块信息");
              });
            }
          });
        }
      }), this.log("✅ 已注册块菜单命令: 在新标签页打开"), this.log("✅ 已注册块菜单命令: 添加到已有标签组");
    } catch (e) {
      this.error("注册块菜单命令失败:", e);
    }
  }
  /**
   * 创建新标签页
   */
  async createNewTab() {
    try {
      const e = this.homePageBlockId && this.homePageBlockId.trim() ? this.homePageBlockId : "1", t = this.homePageBlockId && this.homePageBlockId.trim() ? "🏠 主页" : "📄 新标签页";
      this.log(`🆕 创建新标签页，使用块ID: ${e}`);
      const a = this.getCurrentPanelTabs(), r = {
        blockId: e,
        panelId: this.currentPanelId || "",
        title: t,
        isPinned: !1,
        order: a.length
      };
      this.log(`📋 新标签页信息: "${r.title}" (ID: ${e})`);
      const i = this.getCurrentActiveTab();
      let n = a.length;
      if (this.log(`📊 当前标签数量: ${a.length}, 标签列表: ${a.map((s) => s.title).join(", ")}`), this.addNewTabToEnd)
        n = a.length, this.log(`🎯 [一次性] 将新标签添加到末尾: "${r.title}", 插入位置: ${n}`), this.addNewTabToEnd = !1, this.log("♻️ 已重置标志，后续新标签将在聚焦标签后插入");
      else if (i) {
        const s = a.findIndex((c) => c.blockId === i.blockId);
        s !== -1 && (n = s + 1, this.log(`🎯 将在聚焦标签 "${i.title}" 后面插入新标签: "${r.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (a.length >= this.maxTabs) {
        a.splice(n, 0, r), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${r.title}`);
        const s = this.findLastNonPinnedTabIndex();
        if (s !== -1) {
          const c = a[s];
          a.splice(s, 1), this.log(`🗑️ 删除末尾的非固定标签: "${c.title}" 来保持数量限制`), a.forEach((l, d) => {
            l.order = d;
          });
        } else {
          const c = a.findIndex((l) => l.blockId === r.blockId);
          if (c !== -1) {
            a.splice(c, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${r.title}"`);
            return;
          }
        }
      } else
        a.splice(n, 0, r), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${r.title}`);
      a.forEach((s, c) => {
        s.order = c;
      }), this.log(`🔄 已重新计算标签顺序: ${a.map((s) => `${s.title}(${s.order})`).join(", ")}`), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 创建新标签页，实时更新工作区: ${r.title}`)), await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId || ""), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${r.title}"`);
    } catch (e) {
      this.error("创建新标签页时出错:", e);
    }
  }
  /**
   * 生成趣味性内容
   */
  generateFunContent() {
    const e = [
      "🌟 欢迎来到新标签页！开始您的创作之旅吧～",
      "✨ 这是一个全新的开始，让想法自由流淌...",
      "🎨 空白画布等待您的灵感，开始创作吧！",
      "💡 新的一天，新的想法，从这里开始记录...",
      "🚀 准备好探索新的知识领域了吗？",
      "📝 让文字在这里自由舞蹈，记录生活的美好",
      "🎯 专注当下，记录此刻的思考与感悟",
      "🌈 每个新标签页都是一个新的可能性",
      "💫 在这里，让创意无限延伸...",
      "🎪 欢迎来到您的个人知识舞台！"
    ], t = Math.floor(Math.random() * e.length);
    return e[t];
  }
  /**
   * 设置块内容
   */
  async setBlockContent(e, t) {
    try {
      await orca.invokeBackend("set-block-content", parseInt(e), [{ t: "t", v: t }]), this.log(`📝 已为新块 ${e} 设置内容: "${t}"`);
    } catch (a) {
      this.warn("设置块内容失败，尝试备用方法:", a);
      try {
        await orca.invokeBackend("get-block", parseInt(e)) && this.log(`📝 跳过自动内容设置，用户可手动编辑块 ${e}`);
      } catch (r) {
        this.warn("备用方法也失败:", r);
      }
    }
  }
  /**
   * 强制让指定的标签元素呈聚焦状态，确保UI与数据同步
   */
  async focusTabElementById(e) {
    this.tabContainer || await this.updateTabsUI();
    const t = () => {
      var i, n;
      const a = (i = this.tabContainer) == null ? void 0 : i.querySelectorAll(".orca-tabs-plugin .orca-tab");
      a == null || a.forEach((s) => s.removeAttribute("data-focused"));
      const r = (n = this.tabContainer) == null ? void 0 : n.querySelector(`[data-tab-id="${e}"]`);
      return r ? (r.setAttribute("data-focused", "true"), !0) : !1;
    };
    t() || (await this.updateTabsUI(), t());
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(e, t, a = !1) {
    try {
      const r = this.getCurrentPanelTabs(), i = r.find((d) => d.blockId === e);
      if (i)
        return this.log(`📋 块 ${e} 已存在于标签页中，聚焦已有标签`), this.closedTabs.has(e) && (this.closedTabs.delete(e), await this.saveClosedTabs()), await this.switchToTab(i), await this.focusTabElementById(i.blockId), !0;
      if (!orca.state.blocks[parseInt(e)])
        return this.warn(`无法找到块 ${e}`), !1;
      const s = await this.getTabInfo(e, this.currentPanelId || "", r.length);
      if (!s)
        return this.warn(`无法获取块 ${e} 的标签信息`), !1;
      let c = r.length, l = !1;
      if (t === "replace") {
        const d = this.getCurrentActiveTab();
        if (!d)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const h = r.findIndex((u) => u.blockId === d.blockId);
        if (h === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        d.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), c = h + 1, l = !1) : (c = h, l = !0);
      } else if (t === "after") {
        const d = this.getCurrentActiveTab();
        if (d) {
          const h = r.findIndex((u) => u.blockId === d.blockId);
          h !== -1 && (c = h + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (r.length >= this.maxTabs)
        if (l)
          r[c] = s;
        else {
          r.splice(c, 0, s);
          const d = this.findLastNonPinnedTabIndex();
          if (d !== -1)
            r.splice(d, 1);
          else {
            const h = r.findIndex((u) => u.blockId === s.blockId);
            if (h !== -1)
              return r.splice(h, 1), !1;
          }
        }
      else
        l ? r[c] = s : r.splice(c, 0, s);
      return this.syncCurrentTabsToStorage(r), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${s.title}`)), await this.updateTabsUI(), a && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId || ""), !0;
    } catch (r) {
      return this.error("添加标签页时出错:", r), !1;
    }
  }
  /**
   * 将指定块添加到标签页中，替换当前聚焦标签
   */
  async createBlockAfterFocused(e) {
    await this.addTabToPanel(e, "replace", !1);
  }
  /**
   * 在后台新建标签页打开指定块（在聚焦标签后面插入新标签但不跳转）
   */
  async openInNewTab(e) {
    await this.addTabToPanel(e, "after", !1);
  }
  /**
   * 从DOM元素中获取块引用的ID
   */
  getBlockRefId(e) {
    var t, a;
    try {
      let r = e;
      for (; r && r !== document.body; ) {
        const i = r.classList;
        if (i.contains("orca-ref") || i.contains("block-ref") || i.contains("block-reference") || i.contains("orca-fragment-r") || i.contains("fragment-r") || i.contains("orca-block-reference") || r.tagName.toLowerCase() === "a" && ((t = r.getAttribute("href")) != null && t.startsWith("#"))) {
          const s = r.getAttribute("data-ref-id") || r.getAttribute("data-target-block-id") || r.getAttribute("data-fragment-v") || r.getAttribute("data-v") || ((a = r.getAttribute("href")) == null ? void 0 : a.replace("#", "")) || r.getAttribute("data-id");
          if (s && !isNaN(parseInt(s)))
            return this.log(`🔗 从块引用元素中提取到ID: ${s}`), s;
        }
        const n = r.dataset;
        for (const [s, c] of Object.entries(n))
          if ((s.toLowerCase().includes("ref") || s.toLowerCase().includes("fragment")) && c && !isNaN(parseInt(c)))
            return this.log(`🔗 从data属性 ${s} 中提取到块引用ID: ${c}`), c;
        r = r.parentElement;
      }
      if (e.textContent) {
        const i = e.textContent.trim(), n = i.match(/\[\[(?:块)?(\d+)\]\]/) || i.match(/block[:\s]*(\d+)/i);
        if (n && n[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${n[1]}`), n[1];
      }
      return null;
    } catch (r) {
      return this.error("获取块引用ID时出错:", r), null;
    }
  }
  /**
   * 获取当前光标位置的块ID
   */
  getCurrentCursorBlockId() {
    try {
      const e = window.getSelection();
      if (!e || e.rangeCount === 0)
        return this.log("🔍 无法获取当前选择"), null;
      const t = orca.utils.getCursorDataFromSelection(e);
      if (!t)
        return this.log("🔍 无法从选择转换为 CursorData"), null;
      const a = t.anchor.blockId.toString();
      return this.log(`🔍 获取到当前光标块ID: ${a}`), a;
    } catch (e) {
      return this.error("获取当前光标块ID时出错:", e), null;
    }
  }
  /**
   * 增强块引用的右键菜单，添加标签页相关选项
   */
  enhanceBlockRefContextMenu(e) {
    var t, a, r, i;
    try {
      const n = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let s = null;
      for (let l = n.length - 1; l >= 0; l--) {
        const d = n[l];
        if (d.offsetParent !== null && getComputedStyle(d).display !== "none") {
          s = d;
          break;
        }
      }
      if (!s) {
        this.log("🔗 未找到显示的右键菜单");
        return;
      }
      if (s.querySelector(".orca-tabs-plugin .orca-tabs-ref-menu-item")) {
        this.log("🔗 块引用菜单项已存在");
        return;
      }
      if (this.log(`🔗 为块引用 ${e} 添加菜单项`), s.querySelectorAll('[role="menuitem"], .menu-item').length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-separator";
        const d = document.documentElement.classList.contains("dark") || ((a = (t = window.orca) == null ? void 0 : t.state) == null ? void 0 : a.themeMode) === "dark";
        l.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, s.appendChild(l);
      }
      if (this.savedTabSets.length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-item", l.setAttribute("role", "menuitem");
        const d = document.documentElement.classList.contains("dark") || ((i = (r = window.orca) == null ? void 0 : r.state) == null ? void 0 : i.themeMode) === "dark";
        l.className = "add-to-group-menu-item", l.setAttribute("data-action", "add-to-group"), l.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-family: var(--orca-fontfamily-ui);
          font-size: var(--orca-fontsize-sm);
          color: var(--orca-color-text-1);
          border-radius: var(--orca-radius-md);
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
        `;
        const h = document.createElement("span");
        h.textContent = "添加到已有标签组", h.style.cssText = `
          margin-right: var(--orca-spacing-md);
        `, l.appendChild(h), l.addEventListener("mouseenter", () => {
          l.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), l.addEventListener("mouseleave", () => {
          l.style.backgroundColor = "transparent";
        }), l.addEventListener("click", () => {
          const u = this.getCurrentActiveTab();
          u && this.showAddToTabGroupDialog(u), s == null || s.remove();
        }), s.appendChild(l);
      }
      this.log(`✅ 成功为块引用 ${e} 添加菜单项`);
    } catch (n) {
      this.error("增强块引用右键菜单时出错:", n);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(e, t, a, r) {
    return jt(e, t, a, r);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(t, orca.state.panels);
      if (a && a.viewState) {
        let r = null;
        const i = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (i) {
          const n = i.closest(".orca-panel");
          n && (r = n.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!r) {
          const n = document.querySelector(".orca-panel.active");
          n && (r = n.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (r || (r = document.body.scrollTop > 0 ? document.body : document.documentElement), r) {
          const n = {
            x: r.scrollLeft || 0,
            y: r.scrollTop || 0
          };
          a.viewState.scrollPosition = n;
          const s = this.getCurrentPanelTabs().findIndex((c) => c.blockId === e.blockId);
          s !== -1 && (this.getCurrentPanelTabs()[s].scrollPosition = n, await this.saveCurrentPanelTabs()), this.log(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, n, "容器:", r.className);
        } else
          this.warn(`未找到标签 "${e.title}" 的滚动容器`);
      } else
        this.warn(`未找到面板 ${t} 或viewState`);
    } catch (t) {
      this.warn("记录滚动位置时出错:", t);
    }
  }
  /**
   * 恢复标签的滚动位置
   */
  restoreScrollPosition(e) {
    try {
      let t = null;
      const a = this.getPanelIds()[this.currentPanelIndex], r = orca.nav.findViewPanel(a, orca.state.panels);
      if (r && r.viewState && r.viewState.scrollPosition && (t = r.viewState.scrollPosition, this.log(`🔄 从viewState恢复标签 "${e.title}" 滚动位置:`, t)), !t && e.scrollPosition && (t = e.scrollPosition, this.log(`🔄 从标签信息恢复标签 "${e.title}" 滚动位置:`, t)), !t) return;
      const i = (n = 1) => {
        if (n > 5) {
          this.warn(`恢复标签 "${e.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let s = null;
        const c = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (c) {
          const l = c.closest(".orca-panel");
          l && (s = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!s) {
          const l = document.querySelector(".orca-panel.active");
          l && (s = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        s || (s = document.body.scrollTop > 0 ? document.body : document.documentElement), s ? (s.scrollLeft = t.x, s.scrollTop = t.y, this.log(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", s.className, `尝试${n}`)) : setTimeout(() => i(n + 1), 200 * n);
      };
      i(), setTimeout(() => i(2), 100), setTimeout(() => i(3), 300);
    } catch (t) {
      this.warn("恢复滚动位置时出错:", t);
    }
  }
  /**
   * 调试滚动位置信息
   */
  debugScrollPosition(e) {
    this.log(`🔍 调试标签 "${e.title}" 滚动位置:`), this.log("标签保存的滚动位置:", e.scrollPosition);
    const t = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(t, orca.state.panels);
    a && a.viewState ? (this.log("viewState中的滚动位置:", a.viewState.scrollPosition), this.log("完整viewState:", a.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((i) => {
      document.querySelectorAll(i).forEach((s, c) => {
        const l = s;
        (l.scrollTop > 0 || l.scrollLeft > 0) && this.log(`容器 ${i}[${c}]:`, {
          scrollTop: l.scrollTop,
          scrollLeft: l.scrollLeft,
          className: l.className,
          id: l.id
        });
      });
    });
  }
  /**
   * 检查标签是否为当前激活状态
   */
  isTabActive(e) {
    try {
      let t = null;
      if (this.currentPanelId && (t = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`)), e.panelId) {
        const n = document.querySelector(`.orca-panel[data-panel-id="${e.panelId}"]`);
        n && (t = n);
      }
      if (t || (t = document.querySelector(".orca-panel.active")), !t) return !1;
      const a = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!a) return !1;
      const i = a.getAttribute("data-block-id") === e.blockId;
      return i && this.closedTabs.has(e.blockId) ? (this.verboseLog(`🔍 标签 ${e.title} 在已关闭列表中，不认为是激活状态`), !1) : i;
    } catch (t) {
      return this.warn("检查标签激活状态时出错:", t), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    var s;
    const e = this.enableWorkspaces ? this.getCurrentPanelTabs() : this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    const t = (s = this.tabContainer) == null ? void 0 : s.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (t) {
      const c = t.getAttribute("data-tab-id");
      if (c) {
        const l = e.find((d) => d.blockId === c);
        if (l)
          return this.verboseLog(`🎯 找到UI聚焦标签: ${l.title} (ID: ${c})`), this.enableWorkspaces && this.currentWorkspace && this.updateCurrentWorkspaceActiveIndex(l), l;
      }
    }
    let a = null;
    if (this.currentPanelId && (a = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`)), a || (a = document.querySelector(".orca-panel.active")), !a)
      return this.verboseLog("⚠️ 无法找到目标面板"), null;
    const r = a.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!r)
      return this.verboseLog("⚠️ 目标面板中没有找到可见的块编辑器"), null;
    const i = r.getAttribute("data-block-id");
    if (!i)
      return this.verboseLog("⚠️ 块编辑器没有 data-block-id 属性"), null;
    const n = e.find((c) => c.blockId === i) || null;
    return n ? this.verboseLog(`🎯 根据DOM块编辑器找到激活标签: ${n.title} (ID: ${i})`) : this.verboseLog(`⚠️ 在标签列表中找不到块ID ${i} 对应的标签`), this.enableWorkspaces && this.currentWorkspace && n && this.updateCurrentWorkspaceActiveIndex(n), n;
  }
  /**
   * 获取智能插入位置（在当前激活标签后面）
   */
  getSmartInsertPosition() {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return -1;
    const t = this.getCurrentActiveTab();
    if (!t)
      return -1;
    const a = e.findIndex((r) => r.blockId === t.blockId);
    return a === -1 ? -1 : a;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    if (this.lastActiveBlockId) {
      const a = e.find((r) => r.blockId === this.lastActiveBlockId);
      if (a)
        return this.log(`🎯 找到上一个激活的标签: ${a.title}`), a;
    }
    const t = this.getCurrentActiveTab();
    return t ? (this.log(`🎯 使用当前激活的标签: ${t.title}`), t) : (this.log("🎯 没有找到激活的标签"), null);
  }
  /**
   * 基于之前激活的标签获取智能插入位置
   */
  getSmartInsertPositionWithPrevious(e) {
    const t = this.getCurrentPanelTabs();
    if (t.length === 0) return -1;
    if (!e)
      return this.log("🎯 没有找到之前激活的标签，添加到末尾"), -1;
    const a = t.findIndex((r) => r.blockId === e.blockId);
    return a === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${e.title}" (索引${a}) 后面插入新标签`), a);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), a = t.findIndex((r) => r.blockId === e.blockId);
    return a === -1 || t.length <= 1 ? null : a < t.length - 1 ? t[a + 1] : a > 0 ? t[a - 1] : a === 0 && t.length > 1 ? t[1] : null;
  }
  /**
   * 关闭标签页
   */
  async closeTab(e) {
    const t = this.getCurrentPanelTabs();
    if (t.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    e.isPinned && this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
    const a = t.findIndex((r) => r.blockId === e.blockId);
    if (a !== -1) {
      const r = this.getCurrentActiveTab(), i = r && r.blockId === e.blockId, n = i ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const s = { ...e, closedAt: Date.now() }, c = this.recentlyClosedTabs.findIndex((l) => l.blockId === e.blockId);
        c !== -1 && this.recentlyClosedTabs.splice(c, 1), this.recentlyClosedTabs.unshift(s), this.recentlyClosedTabs.length > 20 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 20)), await this.saveRecentlyClosedTabs();
      }
      t.splice(a, 1), this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`)), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), i && n ? (this.log(`🔄 自动切换到相邻标签: "${n.title}"`), await this.switchToTab(n)) : i && !n && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const e = this.getCurrentPanelTabs();
    e.filter((i) => !i.isPinned).forEach((i) => {
      this.closedTabs.add(i.blockId);
    });
    const a = e.filter((i) => i.isPinned), r = e.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${r} 个标签，保留了 ${a.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(e) {
    const t = this.getCurrentPanelTabs(), a = t.filter(
      (n) => n.blockId === e.blockId || n.isPinned
    );
    t.filter(
      (n) => n.blockId !== e.blockId && !n.isPinned
    ).forEach((n) => {
      this.closedTabs.add(n.blockId);
    });
    const i = t.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${i} 个标签，保留了当前标签和固定标签`);
  }
  /**
   * 重命名标签（内联编辑）
   */
  renameTab(e) {
    const t = document.querySelector(".tab-context-menu");
    t && t.remove(), this.showInlineRenameInput(e);
  }
  /**
   * 显示内联重命名输入框
   */
  showInlineRenameInput(e) {
    const t = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (!t) {
      this.warn("找不到对应的标签元素");
      return;
    }
    const a = t.querySelector(".inline-rename-input");
    a && a.remove();
    const r = t.textContent, i = t.style.cssText, n = t.draggable;
    t.draggable = !1;
    const s = document.createElement("input");
    s.type = "text", s.value = e.title, s.className = "inline-rename-input";
    let c = "var(--orca-color-text-1)", l = "";
    e.color && (l = `--tab-color: ${e.color.startsWith("#") ? e.color : `#${e.color}`};`, c = "var(--orca-tab-colored-text)"), s.style.cssText = `
      ${l}
      background: transparent;
      color: ${c};
      border: none;
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      font-weight: 600;
      outline: none;
      width: 100%;
      max-width: 100px;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, t.textContent = "", t.appendChild(s), t.style.padding = "2px 8px", s.focus(), s.select();
    const d = async () => {
      const u = s.value.trim();
      if (u && u !== e.title) {
        await this.updateTabTitle(e, u), t.draggable = n;
        return;
      }
      t.textContent = r, t.style.cssText = i, t.draggable = n;
    }, h = () => {
      t.textContent = r, t.style.cssText = i, t.draggable = n;
    };
    s.addEventListener("blur", d), s.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), d()) : u.key === "Escape" && (u.preventDefault(), h());
    }), s.addEventListener("click", (u) => {
      u.stopPropagation();
    });
  }
  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(e) {
    const t = window.React, a = window.ReactDOM;
    if (!t || !a || !orca.components.InputBox) {
      this.warn("Orca组件不可用，回退到原生实现"), this.showRenameInput(e);
      return;
    }
    const r = document.createElement("div");
    r.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      pointer-events: none;
    `, document.body.appendChild(r);
    const i = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let n = { x: "50%", y: "50%" };
    if (i) {
      const h = i.getBoundingClientRect(), u = window.innerWidth, p = window.innerHeight, g = 300, f = 100, m = 20;
      let v = h.left, y = h.top - f - 10;
      v + g > u - m && (v = u - g - m), v < m && (v = m), y < m && (y = h.bottom + 10, y + f > p - m && (y = (p - f) / 2)), y + f > p - m && (y = p - f - m), v = Math.max(m, Math.min(v, u - g - m)), y = Math.max(m, Math.min(y, p - f - m)), n = { x: `${v}px`, y: `${y}px` };
    }
    const s = orca.components.InputBox, c = t.createElement(s, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (h, u, p) => {
        h && h.trim() && h.trim() !== e.title && this.updateTabTitle(e, h.trim()), p();
      },
      onCancel: (h) => {
        h();
      }
    }, (h) => t.createElement("div", {
      style: {
        position: "absolute",
        left: n.x,
        top: n.y,
        pointerEvents: "auto"
      },
      onClick: h
    }, ""));
    a.render(c, r), setTimeout(() => {
      const h = r.querySelector("div");
      h && h.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        a.unmountComponentAtNode(r), r.remove();
      }, 100);
    }, d = (h) => {
      h.key === "Escape" && (l(), document.removeEventListener("keydown", d));
    };
    document.addEventListener("keydown", d);
  }
  /**
   * 显示重命名输入框（原生实现，作为备选）
   */
  showRenameInput(e) {
    const t = document.querySelector(".tab-rename-input");
    t && t.remove();
    const a = document.createElement("div");
    a.className = "tab-rename-input", a.style.cssText = `
      position: fixed;
      z-index: 2000;
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-primary-5);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: .175rem var(--orca-spacing-md);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      min-width: 200px;
    `;
    const r = document.createElement("input");
    r.type = "text", r.value = e.title, r.style.cssText = `
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: var(--orca-color-text-1);
      width: 100%;
      padding: 4px 0;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;
    const n = document.createElement("button");
    n.className = "orca-button orca-button-primary", n.textContent = "确认";
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "取消", i.appendChild(n), i.appendChild(s), a.appendChild(r), a.appendChild(i);
    const c = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (c) {
      const u = c.getBoundingClientRect();
      a.style.left = `${u.left}px`, a.style.top = `${u.top - 60}px`;
    } else
      a.style.left = "50%", a.style.top = "50%", a.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(a), r.focus(), r.select();
    const l = () => {
      const u = r.value.trim();
      u && u !== e.title && this.updateTabTitle(e, u), a.remove();
    }, d = () => {
      a.remove();
    };
    n.addEventListener("click", l), s.addEventListener("click", d), r.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), l()) : u.key === "Escape" && (u.preventDefault(), d());
    });
    const h = (u) => {
      a.contains(u.target) || (d(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 100);
  }
  /**
   * 更新标签标题
   */
  async updateTabTitle(e, t) {
    try {
      const a = this.getCurrentPanelTabs(), r = na(e, t, a, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      r.success ? (this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${t}`)), this.log(r.message)) : this.warn(r.message);
    } catch (a) {
      this.error("重命名标签失败:", a);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(e, t) {
    e.addEventListener("contextmenu", (a) => {
      a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(), this.showTabContextMenu(a, t);
    });
  }
  createOrcaContextMenu(e, t) {
    const a = window.React, r = window.ReactDOM, i = document.createElement("div");
    i.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(i);
    const n = orca.components.ContextMenu, s = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, d = a.createElement(n, {
      menu: (p) => a.createElement(s, {}, [
        a.createElement(c, {
          key: "rename",
          title: "重命名标签",
          shortcut: "F2",
          onClick: () => {
            p(), this.renameTab(t);
          },
          children: a.createElement("div", {
            style: { display: "flex", alignItems: "center", gap: "8px" }
          }, [
            a.createElement("i", {
              key: "icon",
              className: "ti ti-edit",
              style: { fontSize: "14px", color: "var(--orca-color-text-1)" }
            }),
            a.createElement("span", { key: "text" }, "重命名标签")
          ])
        }),
        a.createElement(c, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            p(), this.toggleTabPinStatus(t);
          }
        }),
        // 如果有保存的标签组，添加"添加到已有标签组"选项
        ...this.savedTabSets.length > 0 ? [
          a.createElement(c, {
            key: "addToGroup",
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              p(), this.showAddToTabGroupDialog(t);
            }
          })
        ] : [],
        a.createElement(l, { key: "separator1" }),
        a.createElement(c, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeTab(t);
          }
        }),
        a.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeOtherTabs(t);
          }
        }),
        a.createElement(c, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeAllTabs();
          }
        })
      ])
    }, (p, g) => a.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        background: "transparent"
      },
      onContextMenu: (m) => {
        m.preventDefault(), m.stopPropagation(), p(m);
      }
    }));
    r.render(d, i);
    const h = () => {
      r.unmountComponentAtNode(i), i.remove();
    }, u = new MutationObserver((p) => {
      p.forEach((g) => {
        g.removedNodes.forEach((f) => {
          f === e && (h(), u.disconnect());
        });
      });
    });
    u.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    var u, p;
    const a = document.querySelector(".tab-context-menu");
    a && a.remove();
    const r = document.documentElement.classList.contains("dark") || ((p = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : p.themeMode) === "dark", i = document.createElement("div");
    i.className = "tab-context-menu";
    const n = 220, s = 240, { x: c, y: l } = H(e.clientX, e.clientY, n, s);
    i.style.cssText = `
      position: fixed;
      left: ${c}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: 180px;
      padding: var(--orca-spacing-sm);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const d = [
      {
        text: "重命名标签",
        action: () => this.renameTab(t)
      },
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(t)
      }
    ];
    this.savedTabSets.length > 0 && d.push({
      text: "添加到已有标签组",
      action: () => this.showAddToTabGroupDialog(t)
    }), d.push(
      {
        text: "关闭标签",
        action: () => this.closeTab(t),
        disabled: this.getCurrentPanelTabs().length <= 1
      },
      {
        text: "关闭其他标签",
        action: () => this.closeOtherTabs(t),
        disabled: this.getCurrentPanelTabs().length <= 1
      },
      {
        text: "关闭全部标签",
        action: () => this.closeAllTabs(),
        disabled: this.getCurrentPanelTabs().length <= 1
      }
    ), d.forEach((g) => {
      const f = document.createElement("div");
      f.className = "tab-context-menu-item";
      let m = "";
      g.text.includes("关闭") ? m = "close" : g.text.includes("重命名") ? m = "rename" : g.text.includes("固定") ? m = "pin" : g.text.includes("复制") ? m = "duplicate" : g.text.includes("保存到标签组") && (m = "save-to-group"), f.setAttribute("data-action", m), f.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: ${g.disabled ? r ? "#666" : "#999" : "var(--orca-color-text-1)"};
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s;
      `;
      const v = document.createElement("i");
      v.className = "tab-context-menu-icon", g.text.includes("重命名") ? v.classList.add("ti", "ti-edit") : g.text.includes("固定") ? v.classList.add("ti", t.isPinned ? "ti-pin-off" : "ti-pin") : g.text.includes("添加到已有标签组") ? v.classList.add("ti", "ti-bookmark-plus") : g.text.includes("关闭") ? v.classList.add("ti", "ti-x") : v.classList.add("ti", "ti-edit"), v.style.cssText = `
        flex: 0 0 auto;
        font-size: var(--orca-fontsize-lg);
        margin-top: var(--orca-spacing-xs);
        margin-right: var(--orca-spacing-md);
        color: var(--orca-tab-colored-text);
        width: 16px;
        text-align: center;
      `, f.appendChild(v);
      const y = document.createElement("span");
      y.textContent = g.text, f.appendChild(y), g.disabled || (f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = "transparent";
      }), f.addEventListener("click", () => {
        g.action(), i.remove();
      })), i.appendChild(f);
    }), document.body.appendChild(i);
    const h = (g) => {
      i.contains(g.target) || (i.remove(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    const e = this.panelTabsData[0] || [];
    await this.tabStorageService.saveFirstPanelTabs(e);
  }
  // 注意：第二个面板现在使用统一的数据结构，不再需要单独的处理方法
  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    await this.tabStorageService.saveClosedTabs(this.closedTabs);
  }
  /**
   * 保存最近关闭的标签页列表到持久化存储（使用API）
   */
  async saveRecentlyClosedTabs() {
    await this.tabStorageService.saveRecentlyClosedTabs(this.recentlyClosedTabs);
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    const e = await this.tabStorageService.restoreFirstPanelTabs();
    this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = e, await this.updateRestoredTabsBlockTypes();
  }
  // 注意：第二个面板现在使用统一的数据结构，不再需要单独的处理方法
  /**
   * 更新从存储中恢复的标签页的块类型和图标
   */
  async updateRestoredTabsBlockTypes() {
    this.log("🔄 更新从存储中恢复的标签页的块类型和图标...");
    const e = this.panelTabsData[0] || [];
    if (e.length === 0) {
      this.log("⚠️ 第一个面板没有标签页需要更新");
      return;
    }
    let t = !1;
    for (let a = 0; a < e.length; a++) {
      const r = e[a];
      if (!r.blockType || !r.icon)
        try {
          const n = await orca.invokeBackend("get-block", parseInt(r.blockId));
          if (n) {
            const s = await ee(n);
            let c = r.icon;
            c || (c = _(s)), e[a] = {
              ...r,
              blockType: s,
              icon: c
            }, this.log(`✅ 更新恢复的标签: ${r.title} -> 类型: ${s}, 图标: ${c}`), t = !0;
          }
        } catch (n) {
          this.warn(`更新恢复的标签失败: ${r.title}`, n);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${r.title} (已有块类型和图标)`);
    }
    t && (this.log("🔄 检测到恢复的标签页有更新，保存到存储..."), this.panelTabsData[0] = e, await this.saveFirstPanelTabs()), this.log("✅ 恢复的标签页块类型和图标更新完成");
  }
  /**
   * 从持久化存储恢复已关闭标签列表（使用API）
   */
  async restoreClosedTabs() {
    this.closedTabs = await this.tabStorageService.restoreClosedTabs();
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表（使用API）
   */
  async restoreRecentlyClosedTabs() {
    this.recentlyClosedTabs = await this.tabStorageService.restoreRecentlyClosedTabs();
  }
  /**
   * 保存多标签页集合到持久化存储（使用API）
   */
  async saveSavedTabSets() {
    await this.tabStorageService.saveSavedTabSets(this.savedTabSets);
  }
  /**
   * 从持久化存储恢复多标签页集合（使用API）
   */
  async restoreSavedTabSets() {
    this.savedTabSets = await this.tabStorageService.restoreSavedTabSets();
  }
  // 注意：以下方法已废弃，现在使用API配置存储
  // getStorageKey() 和 getClosedTabsStorageKey() 方法已被移除
  // 现在使用 OrcaStorageService 和 PLUGIN_STORAGE_KEYS 进行存储
  /**
   * 简单的字符串哈希函数
   */
  hashString(e) {
    let t = 0;
    for (let a = 0; a < e.length; a++) {
      const r = e.charCodeAt(a);
      t = (t << 5) - t + r, t = t & t;
    }
    return Math.abs(t).toString(36);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 拖拽功能 - Drag Functionality */
  /* ———————————————————————————————————————————————————————————————————————————— */
  startDrag(e) {
    e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.isDragging = !0;
    const t = this.isVerticalMode ? this.verticalPosition : this.position;
    if (this.dragStartX = e.clientX - t.x, this.dragStartY = e.clientY - t.y, this.tabContainer) {
      this.tabContainer.classList.add("dragging");
      const i = this.tabContainer.querySelector(".drag-handle");
      i && i.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const a = (i) => {
      this.isDragging && (i.preventDefault(), i.stopPropagation(), this.drag(i));
    }, r = (i) => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", r), this.stopDrag();
    };
    document.addEventListener("mousemove", a), document.addEventListener("mouseup", r), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), a = 5, r = window.innerWidth - t.width - 5, i = 5, n = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(a, Math.min(r, this.verticalPosition.x)), this.verticalPosition.y = Math.max(i, Math.min(n, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(a, Math.min(r, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(i, Math.min(n, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const s = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = s.x + "px", this.tabContainer.style.top = s.y + "px", this.ensureClickableElements();
  }
  async stopDrag() {
    if (this.isDragging = !1, this.tabContainer) {
      this.tabContainer.classList.remove("dragging");
      const e = this.tabContainer.querySelector(".drag-handle");
      e && e.classList.remove("dragging"), this.tabContainer.style.cursor = "default", this.tabContainer.style.userSelect = "", this.tabContainer.style.pointerEvents = "auto", this.tabContainer.style.touchAction = "";
    }
    document.body.classList.remove("dragging"), document.body.style.cursor = "", document.body.style.userSelect = "", document.body.style.pointerEvents = "", document.body.style.touchAction = "", document.documentElement.style.cursor = "", document.documentElement.style.userSelect = "", document.documentElement.style.pointerEvents = "", this.resetAllElements(), this.ensureClickableElements(), this.log("🔄 拖拽结束，清理所有拖拽状态"), await this.saveLayoutMode(), this.log(`💾 拖拽结束，位置已保存: ${this.isVerticalMode ? "垂直" : "水平"}模式 (${this.position.x}, ${this.position.y})`);
  }
  async savePosition() {
    const e = await this.tabStorageService.savePosition(
      this.position,
      this.isVerticalMode,
      this.verticalPosition,
      this.horizontalPosition
    );
    this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition;
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode() {
    await this.tabStorageService.saveLayoutMode({
      isVerticalMode: this.isVerticalMode,
      verticalWidth: this.verticalWidth,
      verticalPosition: this.verticalPosition,
      horizontalPosition: this.horizontalPosition,
      isSidebarAlignmentEnabled: this.isSidebarAlignmentEnabled,
      isFloatingWindowVisible: this.isFloatingWindowVisible,
      showBlockTypeIcons: this.showBlockTypeIcons,
      showInHeadbar: this.showInHeadbar
    });
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode() {
    await this.tabStorageService.saveFixedToTopMode(this.isFixedToTop);
  }
  /**
   * 确保所有元素都能正常点击（拖拽过程中调用）
   */
  ensureClickableElements() {
    document.body.style.pointerEvents = "auto", document.documentElement.style.pointerEvents = "auto", document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu").forEach((a) => {
      const r = a;
      r.style.pointerEvents === "none" && (r.style.pointerEvents = "auto");
    }), document.querySelectorAll('button, .btn, [role="button"]').forEach((a) => {
      const r = a;
      r.style.pointerEvents === "none" && (r.style.pointerEvents = "auto");
    });
  }
  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    document.querySelectorAll("*").forEach((a) => {
      const r = a;
      (r.style.cursor === "grabbing" || r.style.cursor === "grab") && (r.style.cursor = ""), r.style.userSelect === "none" && (r.style.userSelect = ""), r.style.pointerEvents === "none" && (r.style.pointerEvents = ""), r.style.touchAction === "none" && (r.style.touchAction = "");
    }), document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]").forEach((a) => {
      const r = a;
      r.style.cursor = "", r.style.userSelect = "", r.style.pointerEvents = "auto", r.style.touchAction = "";
    }), this.log("🔄 重置所有元素样式");
  }
  async restorePosition() {
    try {
      this.position = Q(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Ie(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${fe(this.position, this.isVerticalMode)}`);
    } catch {
      this.warn("无法恢复标签位置");
    }
  }
  /**
   * 从API配置恢复布局模式
   */
  async restoreLayoutMode() {
    try {
      const e = await this.storageService.getConfig(
        T.LAYOUT_MODE,
        this.pluginName,
        W()
      );
      if (e) {
        const t = $e(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = Q(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.log(`📐 布局模式已恢复: ${Le(t)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const t = W();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = Q(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
      const t = W();
      this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = Q(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      );
    }
  }
  /**
   * 从API配置恢复固定到顶部状态
   */
  async restoreFixedToTopMode() {
    try {
      const e = await this.storageService.getConfig(
        T.FIXED_TO_TOP,
        this.pluginName,
        { isFixedToTop: !1 }
      );
      e ? (this.isFixedToTop = e.isFixedToTop, this.log(`📌 固定到顶部状态已恢复: ${this.isFixedToTop ? "启用" : "禁用"}`)) : (this.isFixedToTop = !1, this.log("📌 固定到顶部状态: 禁用 (默认)"));
    } catch (e) {
      this.error("恢复固定到顶部状态失败:", e), this.isFixedToTop = !1;
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const e = this.isVerticalMode ? Math.min(this.getCurrentPanelTabs().length * 28 + 8, window.innerHeight * 0.8) : 28;
    this.position = ua(this.position, this.isVerticalMode, this.verticalWidth, e);
  }
  /**
   * 检查新添加的块
   */
  async checkForNewBlocks() {
    this.getPanelIds().length === 0 || !this.isInitialized || await this.checkCurrentPanelBlocks();
  }
  /**
   * 立即更新聚焦状态
   * 
   * 功能说明：
   * - 清除所有标签页的聚焦状态（data-focused="true"）
   * - 设置指定标签页为聚焦状态
   * - 确保视觉上只有一个标签页显示为激活状态
   * 
   * 使用场景：
   * - 用户点击不同内容时，需要立即更新标签页的聚焦状态
   * - 避免防抖延迟，提供即时的视觉反馈
   * 
   * @param blockId - 要聚焦的块ID
   * @param title - 标签页标题（用于日志记录）
   */
  updateFocusState(e, t) {
    var i, n;
    const a = (i = this.tabContainer) == null ? void 0 : i.querySelectorAll(".orca-tabs-plugin .orca-tab");
    a == null || a.forEach((s) => s.removeAttribute("data-focused"));
    const r = (n = this.tabContainer) == null ? void 0 : n.querySelector(`[data-tab-id="${e}"]`);
    r ? (r.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${t}"`)) : this.verboseLog(`⚠️ 未找到标签元素: ${e}`);
  }
  /**
   * 检查当前面板的当前激活页面（统一处理所有面板）
   * 
   * 功能说明：
   * - 检测用户聚焦的内容变化
   * - 更新标签页的聚焦状态
   * - 处理标签页内容的更新或创建
   * 
   * 核心逻辑：
   * 1. 获取当前激活的面板
   * 2. 查找面板中可见的块编辑器（没有 orca-hideable-hidden 类）
   * 3. 检查该块是否已存在于标签页中
   * 4. 如果存在：更新聚焦状态
   * 5. 如果不存在：更新当前聚焦标签页的内容
   * 
   * 使用场景：
   * - 用户点击不同内容时触发
   * - 键盘导航切换时触发
   * - 程序化聚焦时触发
   */
  /**
   * 从块ID创建标签页信息
   * 使用现有的完整 getTabInfo 方法，确保标题、图标、类型等信息的一致性
   */
  async createTabInfoFromBlock(e, t) {
    try {
      return await this.getTabInfo(e, t || "", 0);
    } catch (a) {
      return this.error(`创建标签页信息失败: ${e}`, a), null;
    }
  }
  /**
   * 处理新增的orca-hideable元素
   * @param element 新增的DOM元素
   * @returns 是否处理了orca-hideable元素
   */
  handleNewHideableElement(e) {
    if (!e.classList.contains("orca-hideable"))
      return !1;
    const t = e.querySelector(".orca-block-editor[data-block-id]");
    if (t) {
      const a = t.getAttribute("data-block-id");
      if (a) {
        const r = e.closest(".orca-panel");
        if (r) {
          const i = r.getAttribute("data-panel-id");
          i && this.handleNewBlockInPanel(a, i).catch((n) => {
            this.error(`处理新块失败: ${a}`, n);
          });
        }
      }
    }
    return !0;
  }
  /**
   * 处理子元素中的orca-hideable元素
   * @param element 父元素
   * @returns 是否处理了子元素中的orca-hideable
   */
  handleChildHideableElements(e) {
    const t = e.querySelector(".orca-hideable");
    if (!t)
      return !1;
    const a = t.querySelector(".orca-block-editor[data-block-id]");
    if (a) {
      const r = a.getAttribute("data-block-id");
      if (r) {
        const i = e.closest(".orca-panel");
        if (i) {
          const n = i.getAttribute("data-panel-id");
          n && this.handleNewBlockInPanel(r, n).catch((s) => {
            this.error(`处理新块失败: ${r}`, s);
          });
        }
      }
    }
    return !0;
  }
  /**
   * 处理面板中新增的块编辑器
   * 这是修复搜索打开页面问题的核心方法
   * 
   * 功能：
   * 1. 检查新块是否已存在于标签页中，如果存在则直接聚焦
   * 2. 如果不存在，则智能替换当前聚焦的标签页内容
   * 3. 确保标签页标题、图标等信息正确显示
   * 
   * @param blockId 新增的块ID
   * @param panelId 所在面板ID
   */
  async handleNewBlockInPanel(e, t) {
    var p, g;
    if (!e || !t) return;
    if (this.isSwitchingTab) {
      this.log(`🔄 正在切换标签，跳过 handleNewBlockInPanel: ${e}`);
      return;
    }
    const a = document.querySelector(".orca-panel.active"), r = a == null ? void 0 : a.getAttribute("data-panel-id");
    if (r && t !== r) {
      this.log(`🚫 忽略非激活面板 ${t} 中的新块 ${e}，当前激活面板为 ${r}`);
      return;
    }
    const n = this.getPanelIds().indexOf(t);
    if (n === -1) {
      const f = document.querySelectorAll(".orca-panel");
      if (!(f.length > 0 && f[0].getAttribute("data-panel-id") === t)) {
        this.log(`🚫 不管理辅助面板 ${t} 的标签页`);
        return;
      }
    }
    n !== -1 && (this.currentPanelIndex = n, this.currentPanelId = t);
    let s = this.getCurrentPanelTabs();
    const c = s.find((f) => f.blockId === e);
    if (c) {
      this.closedTabs.has(e) && (this.closedTabs.delete(e), this.saveClosedTabs()), this.updateFocusState(e, c.title), this.immediateUpdateTabsUI();
      return;
    }
    if (this.creatingTabs.has(e)) {
      this.log(`⏳ 标签 ${e} 正在被其他地方创建，跳过`);
      return;
    }
    this.creatingTabs.add(e);
    let l = null;
    try {
      if (l = await this.createTabInfoFromBlock(e, t), !l) return;
      s = this.getCurrentPanelTabs();
      const f = s.find((m) => m.blockId === e);
      if (f) {
        this.log(`✅ 标签已被其他地方创建（在await期间），只更新聚焦状态: "${f.title}"`), this.updateFocusState(e, f.title), this.immediateUpdateTabsUI();
        return;
      }
    } finally {
      this.creatingTabs.delete(e);
    }
    const d = this.getCurrentActiveTab();
    if (d) {
      if (d.isPinned) {
        this.log(`📌 当前激活标签已置顶，创建新标签: "${l.title}"`);
        const m = s.filter((v) => v.isPinned).length;
        s.splice(m, 0, l), this.updateFocusState(e, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
      const f = s.findIndex((m) => m.blockId === d.blockId);
      if (f !== -1) {
        this.log(`🔄 替换当前激活标签页: "${d.title}" -> "${l.title}"`), s[f] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const f = s.findIndex((m) => m.blockId === this.lastActiveBlockId);
      if (f !== -1) {
        if (s[f].isPinned) {
          this.log(`📌 上一个激活标签已置顶，创建新标签: "${l.title}"`);
          const v = s.filter((y) => y.isPinned).length;
          s.splice(v, 0, l), this.updateFocusState(e, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
          return;
        }
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${s[f].title}" -> "${l.title}"`), s[f] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    let h = -1;
    const u = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (u) {
      const f = u.getAttribute("data-tab-id");
      h = s.findIndex((m) => m.blockId === f);
    }
    if (h === -1) {
      const f = (g = this.tabContainer) == null ? void 0 : g.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (f && f.length > 0)
        for (let m = 0; m < f.length; m++) {
          const v = f[m];
          if (v.classList.contains("focused") || v.getAttribute("data-focused") === "true" || v.classList.contains("active")) {
            h = m;
            break;
          }
        }
    }
    if (h === -1 && s.length > 0 && (h = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), h >= 0 && h < s.length)
      if (s[h].isPinned) {
        this.log(`📌 目标标签已置顶，创建新标签: "${l.title}"`);
        const m = s.filter((v) => v.isPinned).length;
        s.splice(m, 0, l), this.updateFocusState(e, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
      } else
        s[h] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
    else
      s = [l], this.updateFocusState(e, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
  }
  async checkCurrentPanelBlocks() {
    if (this.panelBlockCheckTask) {
      await this.panelBlockCheckTask;
      return;
    }
    this.panelBlockCheckTask = (async () => {
      var p;
      this.log("🔍 开始检查当前面板块...");
      const e = document.querySelector(".orca-panel.active");
      if (!e) {
        this.log("❌ 没有找到当前激活的面板");
        const g = document.querySelectorAll(".orca-panel");
        this.log("📊 当前所有面板状态:"), g.forEach((f, m) => {
          const v = f.getAttribute("data-panel-id"), y = f.classList.contains("active");
          this.log(`  面板${m + 1}: ID=${v}, active=${y}`);
        });
        return;
      }
      const t = e.getAttribute("data-panel-id");
      if (!t) {
        this.log("❌ 激活面板没有 data-panel-id");
        return;
      }
      this.log(`✅ 找到激活面板: ID=${t}, class=${e.className}`);
      const a = this.getPanelIds().indexOf(t);
      a !== -1 && (this.currentPanelIndex = a, this.currentPanelId = t, this.verboseLog(`🔄 更新当前面板索引: ${a} (面板ID: ${t})`)), e.querySelectorAll(".orca-hideable");
      const r = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!r) {
        this.log(`❌ 激活面板 ${t} 中没有找到可见的块编辑器`);
        return;
      }
      const i = r.getAttribute("data-block-id");
      if (!i) {
        this.log("激活的块编辑器没有blockId");
        return;
      }
      let n = this.getCurrentPanelTabs();
      n.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), n = this.getCurrentPanelTabs());
      const s = n.find((g) => g.blockId === i);
      if (s) {
        this.closedTabs.has(i) && (this.closedTabs.delete(i), await this.saveClosedTabs()), this.updateFocusState(i, s.title), await this.immediateUpdateTabsUI();
        return;
      }
      const c = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
      if (!c) {
        this.log(`⚠️ 未找到聚焦的标签元素，当前块: ${i}`);
        return;
      }
      const l = c.getAttribute("data-tab-id");
      if (!l)
        return;
      const d = n.findIndex((g) => g.blockId === l);
      if (d === -1)
        return;
      if (n[d].isPinned) {
        this.log(`📌 聚焦标签已置顶，不替换，创建新标签: "${i}"`);
        const g = n.find((f) => f.blockId === i);
        if (g) {
          this.log(`✅ 标签已被其他地方创建，只更新聚焦状态: "${g.title}"`), this.updateFocusState(i, g.title), await this.immediateUpdateTabsUI();
          return;
        }
        if (this.creatingTabs.has(i)) {
          this.log(`⏳ 标签 ${i} 正在被其他地方创建，跳过`);
          return;
        }
        this.creatingTabs.add(i);
        try {
          const f = await this.getTabInfo(i, t, n.length);
          if (!f)
            return;
          n = this.getCurrentPanelTabs();
          const m = n.find((y) => y.blockId === i);
          if (m) {
            this.log(`✅ 标签在创建过程中已被其他地方创建: "${m.title}"`), this.updateFocusState(i, m.title), await this.immediateUpdateTabsUI();
            return;
          }
          const v = n.filter((y) => y.isPinned).length;
          n.splice(v, 0, f), this.updateFocusState(i, f.title), this.setCurrentPanelTabs(n), await this.immediateUpdateTabsUI();
        } finally {
          this.creatingTabs.delete(i);
        }
        return;
      }
      const u = await this.getTabInfo(i, t, d);
      u && (n[d] = u, this.setCurrentPanelTabs(n), await this.immediateUpdateTabsUI());
    })();
    try {
      await this.panelBlockCheckTask;
    } finally {
      this.panelBlockCheckTask = null;
    }
  }
  /**
   * 监听DOM变化的核心方法
   * 
   * 主要监听以下变化：
   * 1. 新面板的添加/删除
   * 2. 面板激活状态的变化
   * 3. orca-hideable元素的添加（搜索打开页面的关键修复）
   * 4. 块编辑器的添加
   * 
   * 这是修复搜索打开页面问题的关键部分
   */
  observeChanges() {
    new MutationObserver(async (i) => {
      let n = !1, s = !1, c = !1, l = this.currentPanelIndex;
      const d = Date.now(), h = this.lastPanelCheckTime || 0, u = 1e3;
      if (i.forEach((p) => {
        if (p.type === "childList") {
          const g = p.target;
          if ((g.classList.contains("orca-panels-row") || g.closest(".orca-panels-row")) && (s = !0), p.addedNodes.length > 0 && g.closest(".orca-panel")) {
            for (const m of p.addedNodes)
              if (m.nodeType === Node.ELEMENT_NODE) {
                const v = m;
                if (this.handleNewHideableElement(v)) {
                  n = !0;
                  break;
                }
                if (v.classList.contains("orca-block-editor") || v.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
                if (this.handleChildHideableElements(v)) {
                  n = !0;
                  break;
                }
              }
          }
        }
        if (p.type === "attributes" && p.attributeName === "class") {
          const g = p.target;
          if (g.classList.contains("orca-panel")) {
            if (c = !0, g.classList.contains("active")) {
              const f = g.getAttribute("data-panel-id"), m = g.querySelectorAll(".orca-hideable");
              let v = null;
              m.forEach((y) => {
                const w = y.classList.contains("orca-hideable-hidden"), x = y.querySelector(".orca-block-editor[data-block-id]"), k = x == null ? void 0 : x.getAttribute("data-block-id");
                !w && x && k && (v = k);
              }), v && f && this.handleNewBlockInPanel(v, f).catch((y) => {
                this.error(`处理面板激活时的新块失败: ${v}`, y);
              }), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 50), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 200);
            }
            g.classList.contains("orca-locked") && g.classList.contains("active") && (this.log("🔒 检测到锁定面板激活，聚焦上一个面板"), this.focusToPreviousPanel());
          }
          g.classList.contains("orca-hideable") && !g.classList.contains("orca-hideable-hidden") && (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦状态变化"), n = !0);
        }
      }), c && (await this.updateCurrentPanelIndex(), l !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${l} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), s && d - h > u ? (this.lastPanelCheckTime = d, this.log(`🔍 面板检查防抖：距离上次检查 ${d - h}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : s && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${d - h}ms`), n) {
        const p = Date.now(), g = 300, f = p - this.lastBlockCheckTime;
        f > g ? (this.verboseLog(`🔍 块检查防抖：距离上次检查 ${f}ms，执行检查`), this.lastBlockCheckTime = p, await this.checkCurrentPanelBlocks()) : this.verboseLog(`⏭️ 跳过块检查：距离上次检查仅 ${f}ms`);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class"]
    });
    let t = null, a = null;
    const r = async (i) => {
      const n = i.target;
      if (n.closest(".orca-tabs-plugin") || n.closest(".orca-sidebar") || n.closest(".orca-headbar"))
        return;
      const s = n.closest(".orca-hideable");
      if (s) {
        const c = s.querySelector(".orca-block-editor[data-block-id]"), l = c == null ? void 0 : c.getAttribute("data-block-id");
        if (l && l === a) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个块 ${l}`);
          return;
        }
        t && clearTimeout(t), t = window.setTimeout(async () => {
          s.classList.contains("orca-hideable-hidden") || (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦变化"), l && (a = l), await this.checkCurrentPanelBlocks()), t = null;
        }, 0);
      }
    };
    document.addEventListener("click", r), document.addEventListener("focusin", r), document.addEventListener("keydown", (i) => {
      (i.key === "Tab" || i.key === "Enter" || i.key === " ") && (t && clearTimeout(t), t = window.setTimeout(r, 0));
    }), typeof window < "u" && (this.focusSyncInterval !== null && window.clearInterval(this.focusSyncInterval), this.focusSyncInterval = window.setInterval(async () => {
      var i;
      try {
        const n = document.querySelector(".orca-panel.active");
        if (n) {
          const s = n.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (s) {
            const c = s.getAttribute("data-block-id");
            if (c) {
              const l = (i = this.tabContainer) == null ? void 0 : i.querySelector('.orca-tab[data-focused="true"]'), d = !!l;
              if (!this.lastFocusState || this.lastFocusState.blockId !== c || this.lastFocusState.hasFocusedTab !== d)
                if (this.lastFocusState = { blockId: c, hasFocusedTab: d }, l) {
                  const u = l.getAttribute("data-tab-id");
                  u !== c && (this.verboseLog(`?? 焦点检测到变更: ${u} -> ${c}`), await this.checkCurrentPanelBlocks());
                } else
                  this.verboseLog(`?? 焦点检测到无聚焦标签页，当前块: ${c}`), await this.checkCurrentPanelBlocks();
            }
          }
        }
      } catch {
      }
    }, 500));
  }
  /**
   * 检查新添加的面板
   */
  async checkForNewPanels() {
    const e = this.getPanelIds().length, t = [...this.getPanelIds()];
    if (this.currentPanelId, await this.discoverPanels(), this.getPanelIds().length > e)
      this.log(`🎉 发现新面板！从 ${e} 个增加到 ${this.getPanelIds().length} 个`), await this.createTabsUI();
    else if (this.getPanelIds().length < e) {
      this.log(`📉 面板数量减少！从 ${e} 个减少到 ${this.getPanelIds().length} 个`), this.log(`📋 旧面板列表: [${t.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`);
      const a = t[0], r = this.getPanelIds()[0];
      a && r && a !== r && (this.log(`🔄 第一个面板已变更: ${a} -> ${r}`), await this.handleFirstPanelChange(a, r)), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 更新持久化面板索引为: 0")), await this.createTabsUI();
    }
  }
  /**
   * 更新当前面板索引
   */
  async updateCurrentPanelIndex() {
    const e = document.querySelector(".orca-panel.active");
    if (e) {
      const t = e.getAttribute("data-panel-id");
      if (t && !t.startsWith("_")) {
        const a = this.getPanelIds().indexOf(t);
        if (a !== -1) {
          const r = this.currentPanelIndex;
          this.currentPanelIndex = a, this.currentPanelId = t, this.log(`🔄 面板索引更新: ${r} -> ${a} (面板ID: ${t})`), (!this.panelTabsData[a] || this.panelTabsData[a].length === 0) && (this.log(`🔍 面板 ${t} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(a, t || "")), this.debouncedUpdateTabsUI();
        }
      }
    }
  }
  /**
   * 监听窗口大小变化
   */
  observeWindowResize() {
    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.constrainPosition(), this.updateUIPositions();
      }, 100);
    });
  }
  /**
   * 启动主动的面板状态监控
   */
  startActiveMonitoring() {
    this.monitoringInterval = setInterval(async () => {
      await this.checkPanelStatusChange();
    }, 2e3), this.globalEventListener = async (e) => {
      await this.handleGlobalEvent(e);
    }, document.addEventListener("click", this.globalEventListener, { passive: !1 }), document.addEventListener("contextmenu", this.globalEventListener, { passive: !1 });
  }
  /**
   * 聚焦到上一个面板
   */
  focusToPreviousPanel() {
    const e = this.getPanelIds();
    if (e.length <= 1) {
      this.log("⚠️ 只有一个面板，无法切换到上一个面板");
      return;
    }
    const t = this.currentPanelIndex;
    if (t <= 0) {
      this.log("⚠️ 当前面板是第一个面板，无法切换到上一个面板");
      return;
    }
    const a = t - 1, r = e[a];
    if (!r) {
      this.log("⚠️ 未找到上一个面板");
      return;
    }
    this.log(`🔄 聚焦到上一个面板: ${r} (索引: ${a})`);
    const i = document.querySelector(`.orca-panel[data-panel-id="${r}"]`);
    if (!i) {
      this.log(`❌ 未找到面板元素: ${r}`);
      return;
    }
    const n = document.querySelector(".orca-panel.active");
    n && n.classList.remove("active"), i.classList.add("active"), this.currentPanelIndex = a, this.currentPanelId = r, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${r}`);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 事件处理 - Event Handling */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 统一的全局事件处理器
   */
  async handleGlobalEvent(e) {
    switch (e.type) {
      case "click":
        await this.handleClickEvent(e);
        break;
      case "contextmenu":
        await this.handleContextMenuEvent(e);
        break;
    }
  }
  /**
   * 处理点击事件
   */
  async handleClickEvent(e) {
    const t = e.target, a = this.getBlockRefId(t);
    if (a) {
      e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), e.ctrlKey || e.metaKey ? (this.log(`🔗 检测到 Ctrl+点击 块引用: ${a}，将在后台新建标签页`), await this.openInNewTab(a)) : (this.log(`🔗 检测到直接点击 块引用: ${a}，将替换当前标签页`), await this.createBlockAfterFocused(a));
      return;
    }
    if (t.closest(".orca-tabs-plugin")) {
      if (t.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        this.log("🔄 检测到侧边栏/面板点击，跳过面板状态检查");
        return;
      }
      if (this.isDragging) {
        this.log("🔄 检测到拖拽过程中，跳过面板状态检查");
        return;
      }
      setTimeout(() => {
        this.debouncedCheckPanelStatus();
      }, 300);
    }
  }
  /**
   * 处理右键菜单事件
   */
  async handleContextMenuEvent(e) {
    const t = e.target, a = this.getBlockRefId(t);
    a && (this.log(`🔗 检测到块引用右键菜单: ${a}`), this.currentContextBlockRefId = a, setTimeout(() => {
      this.enhanceBlockRefContextMenu(a);
    }, 50));
  }
  // handleKeydownEvent方法已移除，不再监听全局键盘事件
  /**
   * 防抖的面板状态检查
   */
  debouncedCheckPanelStatus() {
    this.checkAndRecoverUpdateState(), this.updateDebounceTimer && clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = setTimeout(async () => {
      await this.checkPanelStatusChange();
    }, 50);
  }
  /**
   * 检查面板状态是否发生变化
   */
  async checkPanelStatusChange() {
    if (this.panelStatusCheckTask) {
      await this.panelStatusCheckTask;
      return;
    }
    this.panelStatusCheckTask = (async () => {
      const e = document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])');
      if (Array.from(e).filter((c) => {
        const l = c.getAttribute("data-panel-id");
        return l && !l.startsWith("_");
      }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
        this.verboseLog("📋 面板数量未变化，跳过面板发现");
        return;
      }
      const a = [...this.getPanelIds()], r = this.getPanelIds()[0] || null;
      await this.discoverPanels();
      const i = this.getPanelIds()[0] || null, n = Ca(a, this.getPanelIds());
      n && (this.log(`📋 面板列表发生变化: ${a.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${a.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${r} -> ${i}`), r !== i && (this.log(`🔄 持久化面板已变更: ${r} -> ${i}`), await this.handlePersistentPanelChange(r, i))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
      const s = document.querySelector(".orca-panel.active");
      if (s) {
        const c = s.getAttribute("data-panel-id");
        if (c && !c.startsWith("_") && (c !== this.currentPanelId || n)) {
          const l = this.currentPanelIndex, d = this.getPanelIds().indexOf(c);
          d !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId || ""} -> ${c} (索引: ${l} -> ${d})`), this.currentPanelIndex = d, this.currentPanelId = c, await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI());
        }
      }
    })();
    try {
      await this.panelStatusCheckTask;
    } finally {
      this.panelStatusCheckTask = null;
    }
  }
  /**
   * 处理持久化面板变更（当需要持久化的面板发生变化时）
   */
  async handlePersistentPanelChange(e, t) {
    if (this.log(`🔄 处理持久化面板变更: ${e} -> ${t}`), t)
      if (e !== t) {
        this.log("🔍 持久化面板发生变化，重新扫描标签");
        const a = this.panelTabsData[0] || [];
        a.length > 0 ? (this.log(`✅ 新持久化面板 ${t} (索引: 0) 已有标签数据，直接使用`), this.panelTabsData[0] = [...a]) : (this.log(`🔍 新持久化面板 ${t} (索引: 0) 没有标签数据，重新扫描`), await this.scanPersistentPanel(t)), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的标签"), await this.updateTabsUI(), this.log(`✅ 持久化面板变更处理完成，当前有 ${this.getCurrentPanelTabs().length} 个标签`);
      } else
        this.log("✅ 持久化面板未变化，保持现有标签数据");
    else
      this.log("🗑️ 没有持久化面板，清空标签数据"), this.panelTabsData[0] = [], await this.saveFirstPanelTabs(), await this.updateTabsUI();
  }
  /**
   * 扫描持久化面板的标签
   */
  async scanPersistentPanel(e) {
    const t = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!t) {
      this.warn(`❌ 未找到持久化面板: ${e}`);
      return;
    }
    const a = t.querySelectorAll(".orca-hideable"), r = [];
    let i = 0;
    for (const n of a) {
      const s = n.querySelector(".orca-block-editor");
      if (!s) continue;
      const c = s.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, e, i++);
      l && r.push(l);
    }
    this.panelTabsData[0] = [...r], this.panelTabsData[0] = [...r], this.log(`📋 持久化面板 ${e} (索引: 0) 扫描并保存了 ${r.length} 个标签页`);
  }
  /**
   * 扫描指定面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描DOM并存储到panelTabsData数组
   */
  async scanPanelTabsByIndex(e, t) {
    const a = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!a) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const r = a.querySelectorAll(".orca-block-editor[data-block-id]"), i = [];
    let n = 0;
    this.log(`🔍 扫描面板 ${t}，找到 ${r.length} 个块编辑器`);
    for (const c of r) {
      const l = c.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, t, n++);
      d && (i.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    e >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[e] = [...i], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${i.length} 个标签页`);
    const s = e === 0 ? T.FIRST_PANEL_TABS : `panel_${e + 1}_tabs`;
    await this.savePanelTabsByKey(s, i);
  }
  /**
   * 保存指定面板的标签页数据
   */
  async savePanelTabs(e, t) {
    await this.tabStorageService.savePanelTabs(e, t);
  }
  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(e, t) {
    await this.tabStorageService.savePanelTabsByKey(e, t);
  }
  /**
   * 合并当前聚焦面板的标签页到已加载的数据中
   */
  async mergeCurrentPanelTabs(e, t) {
    const a = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!a) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const r = a.querySelectorAll(".orca-block-editor[data-block-id]"), i = [];
    let n = 0;
    this.log(`🔍 扫描当前聚焦面板 ${t}，找到 ${r.length} 个块编辑器`);
    for (const l of r) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const h = await this.getTabInfo(d, t, n++);
      h && (i.push(h), this.log(`📋 找到当前标签页: ${h.title} (${d})`));
    }
    const s = this.panelTabsData[e] || [];
    this.log(`📋 已加载的标签页: ${s.length} 个，当前标签页: ${i.length} 个`);
    const c = [...s];
    for (const l of i)
      c.push(l), this.log(`➕ 添加当前标签页: ${l.title}`);
    this.panelTabsData[e] = [...c], this.log(`📋 合并后标签页总数: ${c.length} 个`);
  }
  /**
   * 扫描当前面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描当前面板并更新panelTabsData数组
   */
  async scanCurrentPanelTabs() {
    if (!this.currentPanelId || this.currentPanelIndex < 0) {
      this.log("⚠️ 无法扫描标签页，当前面板信息无效");
      return;
    }
    const e = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId || ""}"]`);
    if (!e) {
      this.warn(`❌ 未找到当前面板: ${this.currentPanelId || ""}`);
      return;
    }
    const t = e.querySelectorAll(".orca-hideable"), a = [];
    let r = 0;
    for (const n of t) {
      const s = n.querySelector(".orca-block-editor");
      if (!s) continue;
      const c = s.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId || "", r++);
      l && a.push(l);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...a], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页`);
    const i = this.currentPanelIndex === 0 ? T.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(i, a);
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(e, t) {
    this.log(`🔄 处理第一个面板变更: ${e} -> ${t}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ""}, currentPanelIndex=${this.currentPanelIndex}`);
    const a = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${a.length} 个标签页`), a.length > 0 ? (this.log(`📋 迁移当前面板的 ${a.length} 个标签页到持久化存储`), this.panelTabsData[0] = [...a], this.log("🔄 持久化面板索引已简化，不再需要更新")) : (this.log("🗑️ 当前面板没有标签数据，清空并重新扫描"), this.panelTabsData[0] = [], await this.scanFirstPanel()), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`), this.log("✅ 持久化标签页:", this.getCurrentPanelTabs().map((r) => `${r.title}(${r.blockId})`));
  }
  /**
   * 更新UI元素位置
   */
  updateUIPositions() {
    if (this.tabContainer) {
      const e = this.isVerticalMode ? this.verticalPosition : this.position;
      this.tabContainer.style.left = e.x + "px", this.tabContainer.style.top = e.y + "px";
    }
  }
  /**
   * 重置插件缓存
   */
  async resetCache() {
    this.log("🔄 开始重置插件缓存..."), this.panelTabsData[0] = [], this.closedTabs.clear(), await this.tabStorageService.clearCache(), this.getPanelIds().length > 0 && (this.log("🔍 重新扫描第一个面板..."), await this.scanFirstPanel(), await this.saveFirstPanelTabs()), await this.updateTabsUI(), this.log("✅ 插件缓存重置完成");
  }
  // destroy方法在类的末尾重新实现了更完整的版本
  /**
   * 显示最近关闭的标签页菜单
   */
  async showRecentlyClosedTabsMenu(e) {
    if (this.recentlyClosedTabs.length === 0) {
      orca.notify("info", "没有最近关闭的标签页");
      return;
    }
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, a = this.recentlyClosedTabs.map((r, i) => ({
      label: `${r.title}`,
      icon: r.icon || _(r.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(r, i)
    }));
    a.push({
      label: "清空最近关闭列表",
      icon: "ti ti-trash",
      onClick: () => this.clearRecentlyClosedTabs()
    }), this.createRecentlyClosedTabsMenu(a, t);
  }
  /**
   * 创建最近关闭标签页菜单
   */
  createRecentlyClosedTabsMenu(e, t) {
    var g, f;
    const a = document.querySelector(".recently-closed-tabs-menu");
    a && a.remove();
    const r = document.documentElement.classList.contains("dark") || ((f = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : f.themeMode) === "dark", i = document.createElement("div");
    i.className = "recently-closed-tabs-menu";
    const n = 280, s = 350, { x: c, y: l } = H(t.x, t.y, n, s);
    i.style.cssText = `
      position: fixed;
      left: ${c}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: ${n}px;
      max-height: ${s}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((m, v) => {
      if (m.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, i.appendChild(x);
        return;
      }
      const y = document.createElement("div");
      if (y.className = "recently-closed-menu-item", y.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: var(--orca-color-text-1);
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, m.icon) {
        const x = document.createElement("div");
        if (x.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${r ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, m.icon.startsWith("ti ti-")) {
          const k = document.createElement("i");
          k.className = m.icon, x.appendChild(k);
        } else
          x.textContent = m.icon;
        y.appendChild(x);
      }
      const w = document.createElement("span");
      w.textContent = m.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, y.appendChild(w), y.addEventListener("mouseenter", () => {
        y.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), y.addEventListener("mouseleave", () => {
        y.style.backgroundColor = "transparent";
      }), y.addEventListener("click", () => {
        m.onClick(), i.remove();
      }), i.appendChild(y);
    }), document.body.appendChild(i);
    const d = i.getBoundingClientRect(), h = window.innerWidth, u = window.innerHeight;
    d.right > h && (i.style.left = `${h - d.width - 10}px`), d.bottom > u && (i.style.top = `${u - d.height - 10}px`);
    const p = (m) => {
      i.contains(m.target) || (i.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
    }, 0);
  }
  /**
   * 恢复最近关闭的标签页
   */
  async restoreRecentlyClosedTab(e, t) {
    try {
      this.recentlyClosedTabs.splice(t, 1), await this.saveRecentlyClosedTabs(), this.closedTabs.delete(e.blockId), await this.saveClosedTabs(), await this.addTabToPanel(e.blockId, "end", !0), this.log(`🔄 已恢复最近关闭的标签页: "${e.title}"`), orca.notify("success", `已恢复标签页: ${e.title}`);
    } catch (a) {
      this.error("恢复最近关闭标签页失败:", a), orca.notify("error", "恢复标签页失败");
    }
  }
  /**
   * 清空最近关闭的标签页列表
   */
  async clearRecentlyClosedTabs() {
    try {
      this.recentlyClosedTabs = [], await this.saveRecentlyClosedTabs(), this.log("🗑️ 已清空最近关闭的标签页列表"), orca.notify("success", "已清空最近关闭的标签页列表");
    } catch (e) {
      this.error("清空最近关闭标签页列表失败:", e), orca.notify("error", "清空失败");
    }
  }
  /**
   * 显示保存的标签页集合菜单
   */
  async showSavedTabSetsMenu(e) {
    if (this.savedTabSets.length === 0) {
      orca.notify("info", "没有保存的标签页集合");
      return;
    }
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 100, y: 100 }, a = [];
    this.previousTabSet && this.previousTabSet.length > 0 && (a.push({
      label: `回到上一个标签集合 (${this.previousTabSet.length}个标签)`,
      icon: "ti ti-arrow-left",
      onClick: () => this.restorePreviousTabSet()
    }), a.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    })), this.savedTabSets.forEach((r, i) => {
      a.push({
        label: `${r.name} (${r.tabs.length}个标签)`,
        icon: r.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(r, i)
      });
    }), a.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), a.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    }), this.createRecentlyClosedTabsMenu(a, t);
  }
  /**
   * 显示多标签页保存菜单
   */
  async showMultiTabSavingMenu(e) {
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, a = [];
    a.push({
      label: "保存当前标签页",
      icon: "ti ti-plus",
      onClick: () => this.saveCurrentTabs()
    }), this.savedTabSets.length > 0 && (a.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), this.savedTabSets.forEach((r, i) => {
      a.push({
        label: `${r.name} (${r.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(r, i)
      });
    }), a.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), a.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    })), this.createMultiTabSavingMenu(a, t);
  }
  /**
   * 创建多标签页保存菜单
   */
  createMultiTabSavingMenu(e, t) {
    var g, f;
    const a = document.querySelector(".multi-tab-saving-menu");
    a && a.remove();
    const r = document.documentElement.classList.contains("dark") || ((f = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : f.themeMode) === "dark", i = document.createElement("div");
    i.className = "multi-tab-saving-menu";
    const n = 300, s = 400, { x: c, y: l } = H(t.x, t.y, n, s);
    i.style.cssText = `
      position: fixed;
      left: ${c}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: ${n}px;
      max-height: ${s}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((m, v) => {
      if (m.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, i.appendChild(x);
        return;
      }
      const y = document.createElement("div");
      if (y.className = "multi-tab-saving-menu-item", y.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: var(--orca-color-text-1);
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, m.icon) {
        const x = document.createElement("div");
        if (x.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${r ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, m.icon.startsWith("ti ti-")) {
          const k = document.createElement("i");
          k.className = m.icon, x.appendChild(k);
        } else
          x.textContent = m.icon;
        y.appendChild(x);
      }
      const w = document.createElement("span");
      w.textContent = m.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, y.appendChild(w), y.addEventListener("mouseenter", () => {
        y.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), y.addEventListener("mouseleave", () => {
        y.style.backgroundColor = "transparent";
      }), y.addEventListener("click", () => {
        m.onClick(), i.remove();
      }), i.appendChild(y);
    }), document.body.appendChild(i);
    const d = i.getBoundingClientRect(), h = window.innerWidth, u = window.innerHeight;
    d.right > h && (i.style.left = `${h - d.width - 10}px`), d.bottom > u && (i.style.top = `${u - d.height - 10}px`);
    const p = (m) => {
      i.contains(m.target) || (i.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
    }, 0);
  }
  /**
   * 保存当前标签页
   */
  async saveCurrentTabs() {
    if (this.getCurrentPanelTabs().length === 0) {
      orca.notify("warn", "当前没有标签页可以保存");
      return;
    }
    this.showSaveTabSetDialog();
  }
  /**
   * 显示保存标签页集合的输入对话框
   */
  showSaveTabSetDialog() {
    const e = document.querySelector(".save-tabset-dialog");
    e && e.remove();
    const t = document.createElement("div");
    t.className = "save-tabset-dialog", t.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 450px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: auto;
    `, t.addEventListener("click", (S) => {
      S.stopPropagation();
    });
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, a.textContent = "保存标签页集合", t.appendChild(a);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 0 20px;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    `;
    const n = document.createElement("button");
    n.className = "orca-button orca-button-secondary", n.textContent = "创建新标签组", n.style.cssText = "flex: 1;";
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "更新已有标签组", s.style.cssText = "flex: 1;";
    let c = !1;
    const l = () => {
      c = !1, n.className = "orca-button orca-button-secondary", n.style.cssText = "flex: 1;", s.className = "orca-button", s.style.cssText = "flex: 1;", h.style.display = "block", g.style.display = "none", k();
    }, d = () => {
      c = !0, s.className = "orca-button orca-button-secondary", s.style.cssText = "flex: 1;", n.className = "orca-button", n.style.cssText = "flex: 1;", h.style.display = "none", g.style.display = "block", k();
    };
    n.onclick = l, s.onclick = d, i.appendChild(n), i.appendChild(s), r.appendChild(i);
    const h = document.createElement("div");
    h.style.cssText = `
      display: block;
    `;
    const u = document.createElement("label");
    u.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, u.textContent = "请输入新标签页集合名称:", h.appendChild(u);
    const p = document.createElement("input");
    p.type = "text", p.value = `标签页集合 ${this.savedTabSets.length + 1}`, p.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      user-select: text;
    `, p.addEventListener("focus", () => {
      p.style.borderColor = "var(--orca-color-primary-5)";
    }), p.addEventListener("blur", () => {
      p.style.borderColor = "#ddd";
    }), p.addEventListener("input", (S) => {
    }), h.appendChild(p);
    const g = document.createElement("div");
    g.style.cssText = `
      display: none;
    `;
    const f = document.createElement("label");
    f.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, f.textContent = "请选择要更新的标签页集合:", g.appendChild(f);
    const m = document.createElement("select");
    m.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      background: var(--orca-color-bg-1);
    `, m.addEventListener("focus", () => {
      m.style.borderColor = "var(--orca-color-primary-5)";
    }), m.addEventListener("blur", () => {
      m.style.borderColor = "#ddd";
    });
    const v = document.createElement("option");
    v.value = "", v.textContent = "请选择标签页集合...", m.appendChild(v), this.savedTabSets.forEach((S, R) => {
      const F = document.createElement("option");
      F.value = R.toString(), F.textContent = `${S.name} (${S.tabs.length}个标签)`, m.appendChild(F);
    }), g.appendChild(m), r.appendChild(h), r.appendChild(g), t.appendChild(r);
    const y = document.createElement("div");
    y.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const w = document.createElement("button");
    w.className = "orca-button", w.textContent = "取消", w.style.cssText = "", w.addEventListener("mouseenter", () => {
      w.style.backgroundColor = "#4b5563";
    }), w.addEventListener("mouseleave", () => {
      w.style.backgroundColor = "#6b7280";
    }), w.onclick = () => {
      t.remove(), this.manageSavedTabSets();
    };
    const x = document.createElement("button");
    x.className = "orca-button orca-button-primary", x.textContent = "保存", x.style.cssText = "", x.addEventListener("mouseenter", () => {
      x.style.backgroundColor = "#2563eb";
    }), x.addEventListener("mouseleave", () => {
      x.style.backgroundColor = "var(--orca-color-primary-5)";
    });
    const k = () => {
      x.textContent = c ? "更新" : "保存";
    };
    x.onclick = async () => {
      if (c) {
        const S = parseInt(m.value);
        if (isNaN(S) || S < 0 || S >= this.savedTabSets.length) {
          orca.notify("warn", "请选择要更新的标签页集合");
          return;
        }
        t.remove(), await this.performUpdateTabSet(S);
      } else {
        const S = p.value.trim();
        if (!S) {
          orca.notify("warn", "请输入名称");
          return;
        }
        t.remove(), await this.performSaveTabSet(S);
      }
    }, y.appendChild(w), y.appendChild(x), t.appendChild(y), document.body.appendChild(t), setTimeout(() => {
      p.focus(), p.select();
    }, 100), p.addEventListener("keydown", (S) => {
      S.key === "Enter" ? (S.preventDefault(), x.click()) : S.key === "Escape" && (S.preventDefault(), w.click());
    });
    const M = (S) => {
      t.contains(S.target) || (t.remove(), document.removeEventListener("click", M));
    };
    setTimeout(() => {
      document.addEventListener("click", M);
    }, 200);
  }
  /**
   * 执行保存标签页集合
   */
  async performSaveTabSet(e) {
    try {
      const t = this.getCurrentPanelTabs(), a = {
        id: `tabset_${Date.now()}`,
        name: e,
        tabs: [...t],
        // 深拷贝当前标签页
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.savedTabSets.push(a), await this.saveSavedTabSets(), this.log(`💾 已保存标签页集合: "${e}" (${t.length}个标签)`), orca.notify("success", `已保存标签页集合: ${e}`);
    } catch (t) {
      this.error("保存标签页集合失败:", t), orca.notify("error", "保存失败");
    }
  }
  /**
   * 执行更新已有标签页集合
   */
  async performUpdateTabSet(e) {
    try {
      const t = this.getCurrentPanelTabs(), a = this.savedTabSets[e];
      if (!a) {
        orca.notify("error", "标签页集合不存在");
        return;
      }
      a.tabs = [...t], a.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已更新标签页集合: "${a.name}" (${t.length}个标签)`), orca.notify("success", `已更新标签页集合: ${a.name}`);
    } catch (t) {
      this.error("更新标签页集合失败:", t), orca.notify("error", "更新失败");
    }
  }
  /**
   * 显示添加到已有标签组的对话框
   */
  showAddToTabGroupDialog(e) {
    const t = document.querySelector(".add-to-tabgroup-dialog");
    t && t.remove();
    const a = document.createElement("div");
    a.className = "add-to-tabgroup-dialog", a.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: auto;
    `, a.addEventListener("click", (p) => {
      p.stopPropagation();
    });
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, r.textContent = "添加到已有标签组", a.appendChild(r);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 0 20px;
    `;
    const n = document.createElement("label");
    n.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, n.textContent = `将标签页 "${e.title}" 添加到:`, i.appendChild(n);
    const s = document.createElement("select");
    s.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      background: var(--orca-color-bg-1);
    `, s.addEventListener("focus", () => {
      s.style.borderColor = "var(--orca-color-primary-5)";
    }), s.addEventListener("blur", () => {
      s.style.borderColor = "#ddd";
    });
    const c = document.createElement("option");
    c.value = "", c.textContent = "请选择标签组...", s.appendChild(c), this.savedTabSets.forEach((p, g) => {
      const f = document.createElement("option");
      f.value = g.toString(), f.textContent = `${p.name} (${p.tabs.length}个标签)`, s.appendChild(f);
    }), i.appendChild(s), a.appendChild(i);
    const l = document.createElement("div");
    l.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const d = document.createElement("button");
    d.className = "orca-button", d.textContent = "取消", d.style.cssText = "", d.addEventListener("mouseenter", () => {
      d.style.backgroundColor = "#4b5563";
    }), d.addEventListener("mouseleave", () => {
      d.style.backgroundColor = "#6b7280";
    }), d.onclick = () => {
      a.remove(), this.manageSavedTabSets();
    };
    const h = document.createElement("button");
    h.className = "orca-button orca-button-primary", h.textContent = "添加", h.style.cssText = "", h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#2563eb";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "var(--orca-color-primary-5)";
    }), h.onclick = async () => {
      const p = parseInt(s.value);
      if (isNaN(p) || p < 0 || p >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      a.remove(), await this.addTabToGroup(e, p);
    }, l.appendChild(d), l.appendChild(h), a.appendChild(l), document.body.appendChild(a), setTimeout(() => {
      s.focus();
    }, 100), s.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), h.click()) : p.key === "Escape" && (p.preventDefault(), d.click());
    });
    const u = (p) => {
      a.contains(p.target) || (a.remove(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
    }, 200);
  }
  /**
   * 将标签页添加到指定标签组
   */
  async addTabToGroup(e, t) {
    try {
      const a = this.savedTabSets[t];
      if (!a) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (a.tabs.find((i) => i.blockId === e.blockId)) {
        orca.notify("warn", "该标签页已在此标签组中");
        return;
      }
      a.tabs.push({ ...e }), a.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`➕ 已将标签页 "${e.title}" 添加到标签组: "${a.name}"`), orca.notify("success", `已添加到标签组: ${a.name}`);
    } catch (a) {
      this.error("添加标签页到标签组失败:", a), orca.notify("error", "添加失败");
    }
  }
  /**
   * 加载保存的标签页集合
   */
  async loadSavedTabSet(e, t) {
    try {
      const a = this.getCurrentPanelTabs();
      this.previousTabSet = [...a], a.length = 0;
      for (const r of e.tabs) {
        const i = { ...r, panelId: this.currentPanelId || "" };
        a.push(i);
      }
      this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), e.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已加载标签页集合: "${e.name}" (${e.tabs.length}个标签)`), orca.notify("success", `已加载标签页集合: ${e.name}`);
    } catch (a) {
      this.error("加载标签页集合失败:", a), orca.notify("error", "加载失败");
    }
  }
  /**
   * 回到上一个标签集合
   */
  async restorePreviousTabSet() {
    if (!this.previousTabSet || this.previousTabSet.length === 0) {
      orca.notify("info", "没有上一个标签集合");
      return;
    }
    try {
      const e = this.getCurrentPanelTabs(), t = [...e];
      e.length = 0;
      for (const a of this.previousTabSet) {
        const r = { ...a, panelId: this.currentPanelId || "" };
        e.push(r);
      }
      this.previousTabSet = t, this.syncCurrentTabsToStorage(e), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`🔄 已回到上一个标签集合 (${this.previousTabSet.length}个标签)`), orca.notify("success", "已回到上一个标签集合");
    } catch (e) {
      this.error("回到上一个标签集合失败:", e), orca.notify("error", "恢复失败");
    }
  }
  /**
   * 重新渲染可排序的标签列表
   */
  renderSortableTabs(e, t, a) {
    var n, s;
    const r = document.documentElement.classList.contains("dark") || ((s = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : s.themeMode) === "dark";
    e.innerHTML = "";
    let i = -1;
    t.forEach((c, l) => {
      const d = document.createElement("div");
      d.className = "sortable-tab-item", d.draggable = !0, d.dataset.index = l.toString(), d.dataset.tabId = c.blockId, d.style.cssText = `
        display: flex;
        align-items: center;
        padding: .175rem var(--orca-spacing-md);
        border: 1px solid #e0e0e0;
        border-radius: var(--orca-radius-md);
        margin-bottom: 4px;
        background: var(--orca-color-bg-1);
        cursor: move;
        transition: all 0.2s;
        user-select: none;
        position: relative;
      `;
      const h = document.createElement("div");
      if (h.style.cssText = `
        margin-right: 8px;
        color: #999;
        font-size: 12px;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 20px;
      `, h.innerHTML = "⋮⋮", d.appendChild(h), c.icon) {
        const m = document.createElement("div");
        if (m.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${r ? "#cccccc" : "#666"};
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `, c.icon.startsWith("ti ti-")) {
          const v = document.createElement("i");
          v.className = c.icon, m.appendChild(v);
        } else
          m.textContent = c.icon;
        d.appendChild(m);
      }
      const u = document.createElement("div");
      u.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 20px;
      `;
      let p = `
        <div style="font-size: 14px; color: var(--orca-color-text-1); font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${c.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${c.blockId}</div>
      `;
      u.innerHTML = p, d.appendChild(u);
      const g = document.createElement("div");
      g.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;
      const f = document.createElement("div");
      f.style.cssText = `
        font-size: 12px;
        color: #999;
        background: rgba(0, 0, 0, 0.1);
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      `, f.textContent = (l + 1).toString(), g.appendChild(f), d.appendChild(g), d.addEventListener("dragstart", (m) => {
        console.log("拖拽开始，索引:", l), i = l, m.dataTransfer.setData("text/plain", l.toString()), m.dataTransfer.setData("application/json", JSON.stringify(c)), m.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (m) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", i = -1;
      }), d.addEventListener("dragover", (m) => {
        m.preventDefault(), m.dataTransfer.dropEffect = "move", i !== -1 && i !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (m) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (m) => {
        m.preventDefault(), m.stopPropagation();
        const v = parseInt(m.dataTransfer.getData("text/plain")), y = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", v !== y && v >= 0) {
          const w = t[v];
          t.splice(v, 1), t.splice(y, 0, w), this.renderSortableTabs(e, t);
          const x = this.savedTabSets.find((k) => k.tabs === t);
          x && (x.tabs = [...t], x.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
      }), d.addEventListener("mouseenter", () => {
        i === -1 && (d.style.backgroundColor = "rgba(59, 130, 246, 0.05)", d.style.borderColor = "var(--orca-color-primary-5)");
      }), d.addEventListener("mouseleave", () => {
        i === -1 && (d.style.backgroundColor = "var(--orca-color-bg-1)", d.style.borderColor = "#e0e0e0");
      }), e.appendChild(d);
    });
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 工作区功能 - Workspace Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 加载工作区数据
   */
  async loadWorkspaces() {
    const { workspaces: e, enableWorkspaces: t } = await this.tabStorageService.loadWorkspaces();
    this.workspaces = e, this.enableWorkspaces = t, await this.clearCurrentWorkspace();
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces() {
    await this.tabStorageService.saveWorkspaces(this.workspaces, this.currentWorkspace, this.enableWorkspaces);
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    this.currentWorkspace = null, await this.tabStorageService.clearCurrentWorkspace();
  }
  /**
   * 退出当前工作区
   */
  async exitWorkspace() {
    try {
      if (!this.currentWorkspace) {
        orca.notify("warn", "当前没有工作区");
        return;
      }
      if (!await this.showExitWorkspaceConfirmDialog())
        return;
      await this.clearCurrentWorkspace(), await this.saveWorkspaces(), this.log("🚪 已退出工作区"), orca.notify("success", "已退出工作区");
    } catch (e) {
      this.error("退出工作区失败:", e), orca.notify("error", "退出工作区失败");
    }
  }
  /**
   * 显示退出工作区确认对话框
   */
  async showExitWorkspaceConfirmDialog() {
    return new Promise((e) => {
      const t = document.querySelector(".exit-workspace-confirm-dialog");
      t && t.remove();
      const a = document.createElement("div");
      a.className = "exit-workspace-confirm-dialog", a.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--orca-color-bg-1);
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-lg);
        box-shadow: var(--orca-shadow-dialog);
        z-index: ${this.getNextDialogZIndex()};
        min-width: 400px;
        max-width: 500px;
        padding: var(--orca-spacing-lg);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      `;
      const r = document.createElement("div");
      r.style.cssText = `
        font-size: 18px;
        font-weight: 600;
        color: var(--orca-color-text-1);
        margin-bottom: var(--orca-spacing-md);
      `, r.textContent = "退出工作区";
      const i = document.createElement("div");
      i.style.cssText = `
        font-size: 14px;
        color: var(--orca-color-text-2);
        line-height: 1.5;
        margin-bottom: var(--orca-spacing-lg);
      `, i.textContent = "确定要退出当前工作区吗？退出后当前标签页状态将不会保存到工作区中。";
      const n = document.createElement("div");
      n.style.cssText = `
        display: flex;
        gap: var(--orca-spacing-sm);
        justify-content: flex-end;
      `;
      const s = document.createElement("button");
      s.textContent = "取消", s.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-bg-1);
        color: var(--orca-color-text-1);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `, s.addEventListener("click", () => {
        a.remove(), e(!1);
      });
      const c = document.createElement("button");
      c.textContent = "确认退出", c.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-danger);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-danger);
        color: white;
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `, c.addEventListener("click", () => {
        a.remove(), e(!0);
      }), s.addEventListener("mouseenter", () => {
        s.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), s.addEventListener("mouseleave", () => {
        s.style.backgroundColor = "var(--orca-color-bg-1)";
      }), c.addEventListener("mouseenter", () => {
        c.style.opacity = "0.9";
      }), c.addEventListener("mouseleave", () => {
        c.style.opacity = "1";
      }), n.appendChild(s), n.appendChild(c), a.appendChild(r), a.appendChild(i), a.appendChild(n), document.body.appendChild(a);
      const l = (d) => {
        a.contains(d.target) || (a.remove(), document.removeEventListener("click", l), e(!1));
      };
      setTimeout(() => {
        document.addEventListener("click", l);
      }, 100);
    });
  }
  /**
   * 保存当前标签页为工作区
   */
  async saveCurrentWorkspace() {
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    if (this.getCurrentPanelTabs().length === 0) {
      orca.notify("warn", "当前没有标签页可保存");
      return;
    }
    this.showSaveWorkspaceDialog();
  }
  /**
   * 显示保存工作区对话框
   */
  showSaveWorkspaceDialog() {
    var g, f;
    const e = document.querySelector(".save-workspace-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((f = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : f.themeMode) === "dark", a = document.createElement("div");
    a.className = "save-workspace-dialog", a.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      max-width: 90vw;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, i.textContent = "保存工作区";
    const n = document.createElement("div");
    n.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, n.textContent = "工作区名称:";
    const s = document.createElement("input");
    s.type = "text", s.placeholder = "请输入工作区名称...", s.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      margin-bottom: 12px;
      background: var(--orca-color-bg-1);
      color: ${t ? "#ffffff" : "#333"};
    `;
    const c = document.createElement("div");
    c.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, c.textContent = "工作区描述 (可选):";
    const l = document.createElement("textarea");
    l.placeholder = "请输入工作区描述...", l.style.cssText = `
      width: 100%;
      height: 60px;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 16px;
      background: var(--orca-color-bg-1);
      color: ${t ? "#ffffff" : "#333"};
    `;
    const d = document.createElement("div");
    d.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const h = document.createElement("button");
    h.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-bg-1);
      color: ${t ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, h.textContent = "取消", h.onclick = () => {
      a.remove(), this.showWorkspaceMenu();
    };
    const u = document.createElement("button");
    u.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: none;
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-primary-5);
      color: white;
      cursor: pointer;
      font-size: 14px;
    `, u.textContent = "保存", u.onclick = async () => {
      const m = s.value.trim();
      if (!m) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((v) => v.name === m)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(m, l.value.trim()), a.remove();
    }, d.appendChild(h), d.appendChild(u), r.appendChild(i), r.appendChild(n), r.appendChild(s), r.appendChild(c), r.appendChild(l), r.appendChild(d), a.appendChild(r), document.body.appendChild(a), s.focus(), a.addEventListener("click", (m) => {
      m.target === a && a.remove();
    });
    const p = (m) => {
      m.key === "Escape" && (a.remove(), document.removeEventListener("keydown", p));
    };
    document.addEventListener("keydown", p);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const a = this.getCurrentPanelTabs(), r = this.getCurrentActiveTab(), i = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: a,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: r ? r.blockId : void 0
      };
      this.workspaces.push(i), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${a.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (a) {
      this.error("保存工作区失败:", a), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(e) {
    var y, w;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const a = document.documentElement.classList.contains("dark") || ((w = (y = window.orca) == null ? void 0 : y.state) == null ? void 0 : w.themeMode) === "dark", r = document.createElement("div");
    r.className = "workspace-menu";
    const i = 280, n = 400, s = e ? { x: e.clientX, y: e.clientY } : { x: 20, y: 60 }, { x: c, y: l } = H(s.x, s.y, i, n);
    r.style.cssText = `
      position: fixed;
      left: ${c}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: ${this.getNextDialogZIndex()};
      min-width: 200px;
      padding: var(--orca-spacing-sm);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const d = document.createElement("div");
    d.style.cssText = `
      padding: var(--orca-spacing-sm);
      border-bottom: 1px solid var(--orca-color-border);
      font-size: 14px;
      font-weight: 600;
      color: var(--orca-color-text-1);
    `, d.textContent = "工作区";
    const h = document.createElement("div");
    h.className = "workspace-menu-item", h.setAttribute("data-action", "save-current"), h.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-family: var(--orca-fontfamily-ui);
      font-size: var(--orca-fontsize-sm);
      display: flex;
      align-items: center;
      border-radius: var(--orca-radius-md);
      color: var(--orca-color-text-1);
    `;
    const u = document.createElement("span");
    u.textContent = "保存当前工作区", u.style.cssText = `
      margin-right: var(--orca-spacing-md);
    `, h.appendChild(u), h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "var(--orca-color-menu-highlight)";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "transparent";
    }), h.onclick = () => {
      r.remove(), this.saveCurrentWorkspace();
    };
    const p = document.createElement("div");
    if (p.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const x = document.createElement("div");
      x.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${a ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, x.textContent = "暂无工作区", p.appendChild(x);
    } else
      this.workspaces.forEach((x) => {
        const k = document.createElement("div");
        k.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-family: var(--orca-fontfamily-ui);
          font-size: var(--orca-fontsize-sm);
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: var(--orca-radius-md);
          color: var(--orca-color-text-1);
          ${this.currentWorkspace === x.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const M = x.icon || "ti ti-folder";
        k.innerHTML = `
          <i class="${M}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: var(--orca-color-text-1);"">${x.name}</div>
            ${x.description ? `<div style="font-size: 12px; color: ${a ? "#999" : "#666"}; margin-top: 2px;">${x.description}</div>` : ""}
            <div style="font-size: 11px; color: ${a ? "#777" : "#999"}; margin-top: 2px;">${x.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === x.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ""}
        `, k.addEventListener("mouseenter", () => {
          k.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), k.addEventListener("mouseleave", () => {
          k.style.backgroundColor = this.currentWorkspace === x.id ? "rgba(59, 130, 246, 0.1)" : "transparent";
        }), k.onclick = () => {
          r.remove(), this.switchToWorkspace(x.id);
        }, p.appendChild(k);
      });
    const g = document.createElement("div");
    g.className = "workspace-menu-item", g.setAttribute("data-action", "manage"), g.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-family: var(--orca-fontfamily-ui);
      font-size: var(--orca-fontsize-sm);
      display: flex;
      align-items: center;
      border-radius: var(--orca-radius-md);
      color: var(--orca-color-text-1);
    `;
    const f = document.createElement("span");
    f.textContent = "管理工作区", f.style.cssText = `
      margin-right: var(--orca-spacing-md);
    `, g.appendChild(f), g.addEventListener("mouseenter", () => {
      g.style.backgroundColor = "var(--orca-color-menu-highlight)";
    }), g.addEventListener("mouseleave", () => {
      g.style.backgroundColor = "transparent";
    }), g.onclick = () => {
      r.remove(), this.manageWorkspaces();
    };
    let m = null;
    if (this.currentWorkspace) {
      m = document.createElement("div"), m.className = "workspace-menu-item", m.setAttribute("data-action", "exit-workspace"), m.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        display: flex;
        align-items: center;
        border-radius: var(--orca-radius-md);
        color: var(--orca-color-text-1);
        border-top: 1px solid var(--orca-color-border);
        margin-top: var(--orca-spacing-sm);
      `;
      const x = document.createElement("span");
      x.textContent = "退出工作区", x.style.cssText = `
        margin-right: var(--orca-spacing-md);
        color: var(--orca-color-danger);
      `, m.appendChild(x), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      }), m.onclick = () => {
        r.remove(), this.exitWorkspace();
      };
    }
    r.appendChild(d), r.appendChild(h), r.appendChild(p), r.appendChild(g), m && r.appendChild(m), document.body.appendChild(r);
    const v = (x) => {
      r.contains(x.target) || (r.remove(), document.removeEventListener("click", v));
    };
    setTimeout(() => {
      document.addEventListener("click", v);
    }, 100);
  }
  /**
   * 切换到指定工作区
   */
  async switchToWorkspace(e) {
    try {
      const t = this.workspaces.find((a) => a.id === e);
      if (!t) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace && await this.saveCurrentTabsToWorkspace(), this.currentWorkspace = e, await this.saveWorkspaces(), await this.tabStorageService.saveWorkspaces(this.workspaces, e, this.enableWorkspaces), await this.replaceCurrentTabsWithWorkspace(t.tabs, t), this.log(`🔄 已切换到工作区: "${t.name}"`), orca.notify("success", `已切换到工作区: ${t.name}`);
    } catch (t) {
      this.error("切换工作区失败:", t), orca.notify("error", "切换工作区失败");
    }
  }
  /**
   * 用工作区的标签页完全替换当前标签页
   */
  async replaceCurrentTabsWithWorkspace(e, t) {
    try {
      this.panelTabsData[0] = [], this.panelTabsData[1] = [];
      const a = [];
      for (const i of e)
        try {
          const n = await this.getTabInfo(i.blockId, this.currentPanelId || "", a.length);
          n ? (n.isPinned = i.isPinned, n.order = i.order, n.scrollPosition = i.scrollPosition, a.push(n)) : a.push(i);
        } catch (n) {
          this.warn(`无法更新标签页信息 ${i.title}:`, n), a.push(i);
        }
      this.panelTabsData[0] = a, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...a], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const r = t.lastActiveTabId;
      setTimeout(async () => {
        if (a.length > 0) {
          let i = a[0];
          if (r) {
            const n = a.find((s) => s.blockId === r);
            n ? (i = n, this.log(`🎯 导航到工作区中最后激活的标签页: ${i.title} (ID: ${r})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${i.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${i.title}`);
          await orca.nav.goTo("block", { blockId: parseInt(i.blockId) }, this.currentPanelId || "");
        }
      }, 100), this.log(`📋 已替换当前标签页，共 ${a.length} 个标签，块类型图标已更新`);
    } catch (a) {
      throw this.error("替换标签页失败:", a), a;
    }
  }
  /**
   * 页面加载完成后更新当前工作区的最后激活标签页
   */
  async updateCurrentWorkspaceActiveIndexOnLoad() {
    if (!this.enableWorkspaces || !this.currentWorkspace) return;
    const e = this.getCurrentActiveTab();
    e && (await this.updateCurrentWorkspaceActiveIndex(e), this.log(`🔄 页面加载完成后更新工作区最后激活标签页: ${e.title}`));
  }
  /**
   * 实时更新当前工作区的最后激活标签页
   */
  async updateCurrentWorkspaceActiveIndex(e) {
    if (!this.currentWorkspace) return;
    const t = this.workspaces.find((a) => a.id === this.currentWorkspace);
    t && (t.lastActiveTabId = e.blockId, t.updatedAt = Date.now(), await this.saveWorkspaces(), this.log(`🔄 实时更新工作区最后激活标签页: ${e.title} (ID: ${e.blockId})`));
  }
  /**
   * 保存当前标签页到当前工作区
   */
  async saveCurrentTabsToWorkspace() {
    if (!this.currentWorkspace) return;
    const e = this.workspaces.find((t) => t.id === this.currentWorkspace);
    if (e) {
      const t = this.getCurrentPanelTabs(), a = this.getCurrentActiveTab();
      e.tabs = t, e.lastActiveTabId = a ? a.blockId : void 0, e.updatedAt = Date.now(), await this.saveWorkspaces();
    }
  }
  /**
   * 管理工作区
   */
  manageWorkspaces() {
    var d, h;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", a = document.createElement("div");
    a.className = "manage-workspaces-dialog", a.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: ${this.getNextDialogZIndex()};
      width: 600px;
      max-width: 90vw;
      max-height: 80vh;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, i.textContent = "管理工作区";
    const n = document.createElement("div");
    if (n.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
    `, this.workspaces.length === 0) {
      const u = document.createElement("div");
      u.style.cssText = `
        padding: 40px;
        text-align: center;
        color: ${t ? "#999" : "#666"};
        font-size: 14px;
      `, u.textContent = "暂无工作区", n.appendChild(u);
    } else
      this.workspaces.forEach((u) => {
        const p = document.createElement("div");
        p.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          margin-bottom: 8px;
          background: ${this.currentWorkspace === u.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)"};
        `;
        const g = u.icon || "ti ti-folder";
        p.innerHTML = `
          <i class="${g}" style="font-size: 20px; color: var(--orca-color-primary-5); margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; color: ${t ? "#ffffff" : "#333"};"">${u.name}</div>
            ${u.description ? `<div style="font-size: 12px; color: ${t ? "#999" : "#666"}; margin-bottom: 4px;">${u.description}</div>` : ""}
            <div style="font-size: 11px; color: ${t ? "#777" : "#999"};"">${u.tabs.length}个标签 • 创建于 ${new Date(u.createdAt).toLocaleString()}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${this.currentWorkspace === u.id ? '<span style="color: var(--orca-color-primary-5); font-size: 12px;">当前</span>' : ""}
            <button class="delete-workspace-btn" data-workspace-id="${u.id}" style="
              padding: 4px 8px;
              border: 1px solid var(--orca-color-border);
              border-radius: var(--orca-radius-md);
              background: var(--orca-color-bg-1);
              color: #ef4444;
              cursor: pointer;
              font-size: 12px;
            ">删除</button>
          </div>
        `, p.addEventListener("mouseenter", () => {
          p.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), p.addEventListener("mouseleave", () => {
          p.style.backgroundColor = this.currentWorkspace === u.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)";
        }), n.appendChild(p);
      });
    const s = document.createElement("div");
    s.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const c = document.createElement("button");
    c.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-bg-1);
      color: ${t ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, c.textContent = "关闭", c.onclick = () => {
      a.remove();
    }, s.appendChild(c), r.appendChild(i), r.appendChild(n), r.appendChild(s), a.appendChild(r), document.body.appendChild(a), a.querySelectorAll(".delete-workspace-btn").forEach((u) => {
      u.addEventListener("click", async (p) => {
        const g = p.target.getAttribute("data-workspace-id");
        g && (await this.deleteWorkspace(g), a.remove(), this.manageWorkspaces());
      });
    }), a.addEventListener("click", (u) => {
      u.target === a && a.remove();
    });
  }
  /**
   * 删除工作区
   */
  async deleteWorkspace(e) {
    try {
      const t = this.workspaces.find((a) => a.id === e);
      if (!t) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace === e && (this.currentWorkspace = null), this.workspaces = this.workspaces.filter((a) => a.id !== e), await this.saveWorkspaces(), this.log(`🗑️ 工作区已删除: "${t.name}"`), orca.notify("success", `工作区已删除: ${t.name}`);
    } catch (t) {
      this.error("删除工作区失败:", t), orca.notify("error", "删除工作区失败");
    }
  }
  /**
   * 显示标签集合详情
   */
  showTabSetDetails(e, t) {
    var h, u;
    document.documentElement.classList.contains("dark") || ((u = (h = window.orca) == null ? void 0 : h.state) == null || u.themeMode);
    const a = document.querySelector(".tabset-details-dialog");
    a && a.remove();
    const r = document.createElement("div");
    r.className = "tabset-details-dialog", r.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex() + 200};
      width: 500px;
      max-height: 600px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, i.textContent = `标签集合详情: ${e.name}`, r.appendChild(i);
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;
    const s = document.createElement("div");
    if (s.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background-color: var(--orca-color-bg-1);
      border-radius: var(--orca-radius-md);
    `, s.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>创建时间:</strong> ${new Date(e.createdAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>更新时间:</strong> ${new Date(e.updatedAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666;">
        <strong>标签数量:</strong> ${e.tabs.length}个
      </div>
    `, n.appendChild(s), e.tabs.length === 0) {
      const p = document.createElement("div");
      p.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `, p.textContent = "该标签集合为空", n.appendChild(p);
    } else {
      const p = document.createElement("div");
      p.style.cssText = `
        margin-bottom: 16px;
      `;
      const g = document.createElement("div");
      g.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const f = document.createElement("span");
      f.textContent = "包含的标签 (可拖拽排序):", g.appendChild(f);
      const m = document.createElement("span");
      m.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, m.textContent = "拖拽调整顺序", g.appendChild(m), p.appendChild(g);
      const v = document.createElement("div");
      v.className = "sortable-tabs-container", v.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(v, [...e.tabs], e), p.appendChild(v), n.appendChild(p);
    }
    r.appendChild(n);
    const c = document.createElement("div");
    c.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const l = document.createElement("button");
    l.className = "orca-button", l.textContent = "关闭", l.style.cssText = "", l.addEventListener("mouseenter", () => {
      l.style.backgroundColor = "#4b5563";
    }), l.addEventListener("mouseleave", () => {
      l.style.backgroundColor = "#6b7280";
    }), l.onclick = () => {
      r.remove(), t && this.manageSavedTabSets();
    }, c.appendChild(l), r.appendChild(c), document.body.appendChild(r);
    const d = (p) => {
      r.contains(p.target) || (r.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, a) {
    const r = document.querySelector(".rename-tabset-dialog");
    r && r.remove();
    const i = document.createElement("div");
    i.className = "rename-tabset-dialog", i.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 2000;
      width: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, n.textContent = "重命名标签集合", i.appendChild(n);
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 0 20px;
    `;
    const c = document.createElement("label");
    c.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, c.textContent = "请输入新的名称:", s.appendChild(c);
    const l = document.createElement("input");
    l.type = "text", l.value = e.name, l.style.cssText = `
      width: 100%;
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      user-select: text;
    `, l.addEventListener("focus", () => {
      l.style.borderColor = "var(--orca-color-primary-5)";
    }), l.addEventListener("blur", () => {
      l.style.borderColor = "#ddd";
    }), s.appendChild(l), i.appendChild(s);
    const d = document.createElement("div");
    d.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const h = document.createElement("button");
    h.className = "orca-button", h.textContent = "取消", h.style.cssText = "", h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#4b5563";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "#6b7280";
    }), h.onclick = () => {
      i.remove(), this.manageSavedTabSets();
    };
    const u = document.createElement("button");
    u.className = "orca-button orca-button-primary", u.textContent = "保存", u.style.cssText = "", u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#2563eb";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "var(--orca-color-primary-5)";
    }), u.onclick = async () => {
      const g = l.value.trim();
      if (!g) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (g === e.name) {
        i.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((m) => m.name === g && m.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = g, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i.remove(), a.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(h), d.appendChild(u), i.appendChild(d), document.body.appendChild(i), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), u.click()) : g.key === "Escape" && (g.preventDefault(), h.click());
    });
    const p = (g) => {
      i.contains(g.target) || (i.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, a, r) {
    const i = document.createElement("input");
    i.type = "text", i.value = e.name, i.style.cssText = `
      width: 100%;
      padding: 2px 4px;
      border: 1px solid var(--orca-color-primary-5);
      border-radius: 3px;
      font-size: 14px;
      font-weight: 600;
      color: var(--orca-color-text-1);
      background: var(--orca-color-bg-1);
      outline: none;
    `;
    const n = a.textContent;
    a.innerHTML = "", a.appendChild(i), i.addEventListener("click", (d) => {
      d.stopPropagation();
    }), i.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), i.focus(), i.select();
    const s = async () => {
      const d = i.value.trim();
      if (!d) {
        a.textContent = n;
        return;
      }
      if (d === e.name) {
        a.textContent = n;
        return;
      }
      if (this.savedTabSets.find((u) => u.name === d && u.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), a.textContent = n;
        return;
      }
      e.name = d, e.updatedAt = Date.now(), await this.saveSavedTabSets(), a.textContent = d, orca.notify("success", "重命名成功");
    }, c = () => {
      a.textContent = n;
    };
    i.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), s()) : d.key === "Escape" && (d.preventDefault(), c());
    });
    let l = null;
    i.addEventListener("blur", () => {
      l && clearTimeout(l), l = window.setTimeout(() => {
        s();
      }, 100);
    }), i.addEventListener("focus", () => {
      l && (clearTimeout(l), l = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, a, r, i) {
    const n = document.createElement("div");
    n.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      max-height: 500px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, s.textContent = "选择图标", n.appendChild(s);
    const c = document.createElement("div");
    c.style.cssText = `
      padding: 0 20px;
      max-height: 300px;
      overflow-y: auto;
    `;
    const l = [
      { name: "默认", value: "", icon: "📁" },
      { name: "工作", value: "ti ti-briefcase", icon: "💼" },
      { name: "学习", value: "ti ti-school", icon: "📚" },
      { name: "项目", value: "ti ti-folder", icon: "📂" },
      { name: "代码", value: "ti ti-code", icon: "💻" },
      { name: "设计", value: "ti ti-palette", icon: "🎨" },
      { name: "音乐", value: "ti ti-music", icon: "🎵" },
      { name: "视频", value: "ti ti-video", icon: "🎬" },
      { name: "图片", value: "ti ti-photo", icon: "🖼️" },
      { name: "文档", value: "ti ti-file-text", icon: "📄" },
      { name: "收藏", value: "ti ti-star", icon: "⭐" },
      { name: "重要", value: "ti ti-flag", icon: "🚩" },
      { name: "完成", value: "ti ti-check", icon: "✅" },
      { name: "进行中", value: "ti ti-clock", icon: "⏰" }
    ], d = document.createElement("div");
    d.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    `, l.forEach((g) => {
      const f = document.createElement("div");
      f.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border: 1px solid #e0e0e0;
        border-radius: var(--orca-radius-md);
        cursor: pointer;
        transition: all 0.2s;
        background: ${e.icon === g.value ? "#e3f2fd" : "white"};
      `;
      const m = document.createElement("div");
      if (m.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, g.value.startsWith("ti ti-")) {
        const y = document.createElement("i");
        y.className = g.value, m.appendChild(y);
      } else
        m.textContent = g.icon;
      const v = document.createElement("div");
      v.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, v.textContent = g.name, f.appendChild(m), f.appendChild(v), f.addEventListener("click", async (y) => {
        y.stopPropagation(), e.icon = g.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), r(), n.remove(), i && i.focus(), orca.notify("success", "图标已更新");
      }), f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "#f5f5f5", f.style.borderColor = "var(--orca-color-primary-5)";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = e.icon === g.value ? "#e3f2fd" : "white", f.style.borderColor = "#e0e0e0";
      }), d.appendChild(f);
    }), c.appendChild(d), n.appendChild(c);
    const h = document.createElement("div");
    h.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const u = document.createElement("button");
    u.className = "orca-button", u.textContent = "关闭", u.style.cssText = "", u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#4b5563";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "#6b7280";
    }), u.onclick = (g) => {
      g.stopPropagation(), n.remove(), i && i.focus();
    }, h.appendChild(u), n.appendChild(h), document.body.appendChild(n);
    const p = (g) => {
      n.contains(g.target) || (g.stopPropagation(), n.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p), i && i.focus());
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
    }, 200);
  }
  /**
   * 管理保存的标签页集合
   */
  async manageSavedTabSets() {
    if (this.savedTabSets.length === 0) {
      orca.notify("info", "没有保存的标签页集合");
      return;
    }
    const e = document.querySelector(".manage-saved-tabsets-dialog");
    e && e.remove();
    const t = document.createElement("div");
    t.className = "manage-saved-tabsets-dialog", t.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--orca-color-bg-1);
      border: 1px solid var(--orca-color-border);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 500px;
      max-height: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, a.textContent = "管理保存的标签页集合", t.appendChild(a);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 0 20px;
      max-height: 300px;
      overflow-y: auto;
    `, this.savedTabSets.forEach((c, l) => {
      const d = document.createElement("div");
      d.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-md);
        margin-bottom: 8px;
        background-color: var(--orca-color-bg-1);
        transition: background-color 0.2s;
      `, d.addEventListener("mouseenter", () => {
        d.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), d.addEventListener("mouseleave", () => {
        d.style.backgroundColor = "var(--orca-color-bg-1)";
      });
      const h = document.createElement("div");
      h.style.cssText = `
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      const u = document.createElement("div");
      u.style.cssText = `
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s;
      `, u.title = "点击编辑图标";
      const p = () => {
        if (u.innerHTML = "", c.icon)
          if (c.icon.startsWith("ti ti-")) {
            const k = document.createElement("i");
            k.className = c.icon, u.appendChild(k);
          } else
            u.textContent = c.icon;
        else
          u.textContent = "📁";
      };
      p(), u.addEventListener("click", () => {
        this.editTabSetIcon(c, l, u, p, t);
      }), u.addEventListener("mouseenter", () => {
        u.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), u.addEventListener("mouseleave", () => {
        u.style.backgroundColor = "transparent";
      });
      const g = document.createElement("div");
      g.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      `;
      const f = document.createElement("div");
      f.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
        min-height: 20px;
        display: flex;
        align-items: center;
      `, f.textContent = c.name, f.title = "点击编辑名称", f.addEventListener("click", () => {
        this.editTabSetName(c, l, f, t);
      }), f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = "transparent";
      });
      const m = document.createElement("div");
      m.style.cssText = `
        font-size: 12px;
        color: #666;
      `, m.textContent = `${c.tabs.length}个标签 • ${new Date(c.updatedAt).toLocaleString()}`, g.appendChild(f), g.appendChild(m), h.appendChild(u), h.appendChild(g);
      const v = document.createElement("div");
      v.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const y = document.createElement("button");
      y.className = "orca-button orca-button-primary", y.textContent = "加载", y.style.cssText = "", y.onclick = () => {
        this.loadSavedTabSet(c, l), t.remove();
      };
      const w = document.createElement("button");
      w.className = "orca-button", w.textContent = "查看", w.style.cssText = "", w.onclick = () => {
        this.showTabSetDetails(c, t);
      };
      const x = document.createElement("button");
      x.className = "orca-button", x.textContent = "删除", x.style.cssText = "", x.onclick = () => {
        confirm(`确定要删除标签页集合 "${c.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), t.remove(), this.manageSavedTabSets());
      }, v.appendChild(y), v.appendChild(w), v.appendChild(x), d.appendChild(h), d.appendChild(v), r.appendChild(d);
    }), t.appendChild(r);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const n = document.createElement("button");
    n.className = "orca-button", n.textContent = "关闭", n.style.cssText = "", n.addEventListener("mouseenter", () => {
      n.style.backgroundColor = "#4b5563";
    }), n.addEventListener("mouseleave", () => {
      n.style.backgroundColor = "#6b7280";
    }), n.onclick = () => t.remove(), i.appendChild(n), t.appendChild(i), document.body.appendChild(t);
    const s = (c) => {
      t.contains(c.target) || (t.remove(), document.removeEventListener("click", s), document.removeEventListener("contextmenu", s));
    };
    setTimeout(() => {
      document.addEventListener("click", s), document.addEventListener("contextmenu", s);
    }, 0);
  }
  /**
   * 初始化优化的DOM监听器
   */
  initializeOptimizedDOMObserver() {
    if (!this.performanceOptimizer) {
      this.log("⚠️ 性能优化管理器未初始化，跳过DOM监听器优化");
      return;
    }
    try {
      this.performanceOptimizer.startDOMObservation(document.body, {
        childList: !0,
        subtree: !0,
        attributes: !0,
        attributeFilter: ["class"]
      }), this.log("🔍 优化的DOM监听器已启动");
    } catch (e) {
      this.error("❌ 优化DOM监听器初始化失败:", e);
    }
  }
  /**
   * 处理性能报告
   */
  handlePerformanceReport(e) {
    var r;
    const t = e.healthScore || 0, a = ((r = e.issues) == null ? void 0 : r.length) || 0;
    this.log(`📊 性能报告: 健康分数 ${t}/100, 问题数: ${a}`), t < 50 && a > 0 && (this.log("⚠️ 性能分数过低，触发自动优化"), this.triggerPerformanceOptimization());
  }
  /**
   * 触发性能优化
   */
  triggerPerformanceOptimization() {
    if (this.performanceOptimizer)
      try {
        this.performanceOptimizer.triggerOptimization();
        const e = this.performanceOptimizer.getMemoryStats();
        e && e.totalResources > 1e3 && (this.log("🧹 检测到资源过多，执行清理"), this.performanceOptimizer.cleanupAllResources());
      } catch (e) {
        this.error("❌ 性能优化触发失败:", e);
      }
  }
  /**
   * 优化的防抖更新方法
   */
  async optimizedDebouncedUpdateTabsUI() {
    if (!this.performanceOptimizer) {
      this.debouncedUpdateTabsUI();
      return;
    }
    try {
      await this.performanceOptimizer.executeTask(
        () => this.immediateUpdateTabsUI(),
        [],
        "normal"
        // 使用普通优先级
      ), this.log("⚡ 使用优化防抖更新标签页UI");
    } catch (e) {
      this.error("❌ 优化防抖更新失败，降级到原始方法:", e), this.debouncedUpdateTabsUI();
    }
  }
  /**
   * 优化的资源跟踪
   */
  trackOptimizedResource(e, t, a, r) {
    if (!this.performanceOptimizer)
      return e.addEventListener(t, a, r), null;
    const i = this.performanceOptimizer.trackEventListener(e, t, a, r);
    return i && this.verboseLog(`👂 跟踪事件监听器: ${t} -> ${i}`), i;
  }
  /**
   * 销毁插件，清理所有资源
   */
  destroy() {
    try {
      typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null, this.lastBaselineScenario = null, this.lastBaselineReport = null, this.log("🗑️ 开始销毁插件..."), this.log("💾 保存插件数据..."), this.saveCurrentPanelTabsImmediately().catch((t) => {
        this.error("销毁时保存数据失败:", t);
      }), this.saveDataDebounceTimer !== null && (clearTimeout(this.saveDataDebounceTimer), this.saveDataDebounceTimer = null), this.performanceOptimizer && (this.log("🧹 清理性能优化器..."), this.performanceOptimizer.destroy(), this.performanceOptimizer = null), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
      const e = document.getElementById("orca-tabs-drag-styles");
      e && e.remove(), this.focusSyncInterval !== null && (typeof window < "u" ? window.clearInterval(this.focusSyncInterval) : clearInterval(this.focusSyncInterval), this.focusSyncInterval = null), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null, this.log("✅ 插件销毁完成");
    } catch (e) {
      this.error("❌ 插件销毁过程中发生错误:", e);
    }
  }
}
let E = null;
async function Pa(o) {
  V = o, orca.state.locale, E = new Sa(V), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => E == null ? void 0 : E.init(), 500);
  }) : setTimeout(() => E == null ? void 0 : E.init(), 500), orca.commands.registerCommand(
    `${V}.resetCache`,
    async () => {
      E && await E.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${V}.toggleBlockIcons`,
    async () => {
      E && await E.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function Ia() {
  E && (E.unregisterHeadbarButton(), E.cleanupDragResize(), E.destroy(), E = null), orca.commands.unregisterCommand(`${V}.resetCache`);
}
export {
  Pa as load,
  Ia as unload
};
