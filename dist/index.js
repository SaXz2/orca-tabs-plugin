var bt = Object.defineProperty;
var mt = (r, t, e) => t in r ? bt(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var f = (r, t, e) => mt(r, typeof t != "symbol" ? t + "" : t, e);
const ot = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, st = {
  /** JSON数据类型 - 用于存储结构化数据 */
  JSON: 0,
  /** 文本数据类型 - 用于存储纯文本数据 */
  Text: 1
}, y = {
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
  FIXED_TO_TOP: "fixed-to-top"
};
class ft {
  // ==================== 日志方法 ====================
  /**
   * 调试日志方法
   * 仅在调试模式下输出日志信息，避免生产环境的日志污染
   * @param args 要记录的参数
   */
  log(...t) {
  }
  /**
   * 警告日志方法
   * 输出警告信息，提醒潜在问题
   * @param args 要记录的参数
   */
  warn(...t) {
  }
  /**
   * 错误日志方法
   * 输出错误信息，用于问题诊断
   * @param args 要记录的参数
   */
  error(...t) {
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
  async saveConfig(t, e, a = "orca-tabs-plugin") {
    try {
      const n = typeof e == "string" ? e : JSON.stringify(e);
      return await orca.plugins.setData(a, t, n), this.log(`💾 已保存插件数据 ${t}:`, e), !0;
    } catch (n) {
      return this.warn(`无法保存插件数据 ${t}，尝试降级到localStorage:`, n), this.saveToLocalStorage(t, e);
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
  async getConfig(t, e = "orca-tabs-plugin", a) {
    try {
      const n = await orca.plugins.getData(e, t);
      if (n == null)
        return a || null;
      let i;
      if (typeof n == "string")
        try {
          i = JSON.parse(n);
        } catch {
          i = n;
        }
      else
        i = n;
      return this.log(`📂 已读取插件数据 ${t}:`, i), i;
    } catch (n) {
      return this.warn(`无法读取插件数据 ${t}，尝试从localStorage读取:`, n), this.getFromLocalStorage(t, a);
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
  async removeConfig(t, e = "orca-tabs-plugin") {
    try {
      return await orca.plugins.removeData(e, t), this.log(`🗑️ 已删除插件数据 ${t}`), !0;
    } catch (a) {
      return this.warn(`无法删除插件数据 ${t}，尝试从localStorage删除:`, a), this.removeFromLocalStorage(t);
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
  saveToLocalStorage(t, e) {
    try {
      const a = this.getLocalStorageKey(t);
      return localStorage.setItem(a, JSON.stringify(e)), this.log(`💾 已降级保存到localStorage: ${a}`), !0;
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
  getFromLocalStorage(t, e) {
    try {
      const a = this.getLocalStorageKey(t), n = localStorage.getItem(a);
      if (n) {
        const i = JSON.parse(n);
        return this.log(`📂 已从localStorage读取: ${a}`), i;
      }
      return e || null;
    } catch (a) {
      return this.error("无法从localStorage读取:", a), e || null;
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
  removeFromLocalStorage(t) {
    try {
      const e = this.getLocalStorageKey(t);
      return localStorage.removeItem(e), this.log(`🗑️ 已从localStorage删除: ${e}`), !0;
    } catch (e) {
      return this.error("无法从localStorage删除:", e), !1;
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
  getLocalStorageKey(t) {
    return {
      [y.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [y.SECOND_PANEL_TABS]: "orca-second-panel-tabs-api",
      [y.CLOSED_TABS]: "orca-closed-tabs-api",
      [y.RECENTLY_CLOSED_TABS]: "orca-recently-closed-tabs-api",
      [y.SAVED_TAB_SETS]: "orca-saved-tab-sets-api",
      [y.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [y.TABS_POSITION]: "orca-tabs-position-api",
      [y.LAYOUT_MODE]: "orca-tabs-layout-api",
      [y.FIXED_TO_TOP]: "orca-tabs-fixed-to-top-api"
    }[t] || `orca-plugin-storage-${t}`;
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
      const t = "test string";
      await this.saveConfig("test-string", t);
      const e = await this.getConfig("test-string", "orca-tabs-plugin");
      this.log(`字符串测试: ${t === e ? "✅" : "❌"}`);
      const a = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", a);
      const n = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(a) === JSON.stringify(n) ? "✅" : "❌"}`);
      const i = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", i);
      const o = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(i) === JSON.stringify(o) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (t) {
      this.error("API配置序列化测试失败:", t);
    }
  }
}
function A() {
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
function xt(r, t, e = 200) {
  const a = t ? e : 400, n = 40, i = window.innerWidth - a, o = window.innerHeight - n;
  return {
    x: Math.max(0, Math.min(r.x, i)),
    y: Math.max(0, Math.min(r.y, o))
  };
}
function vt(r) {
  const t = A();
  return {
    isVerticalMode: r.isVerticalMode ?? t.isVerticalMode,
    verticalWidth: r.verticalWidth ?? t.verticalWidth,
    verticalPosition: r.verticalPosition ?? t.verticalPosition,
    horizontalPosition: r.horizontalPosition ?? t.horizontalPosition,
    isSidebarAlignmentEnabled: r.isSidebarAlignmentEnabled ?? t.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: r.isFloatingWindowVisible ?? t.isFloatingWindowVisible,
    showBlockTypeIcons: r.showBlockTypeIcons ?? t.showBlockTypeIcons,
    showInHeadbar: r.showInHeadbar ?? t.showInHeadbar
  };
}
function _(r, t, e) {
  return r ? { ...t } : { ...e };
}
function yt(r, t, e, a) {
  return t ? {
    verticalPosition: { ...r },
    horizontalPosition: { ...a }
  } : {
    verticalPosition: { ...e },
    horizontalPosition: { ...r }
  };
}
function Tt(r) {
  return `布局模式: ${r.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${r.verticalWidth}px, 垂直位置: (${r.verticalPosition.x}, ${r.verticalPosition.y}), 水平位置: (${r.horizontalPosition.x}, ${r.horizontalPosition.y})`;
}
function ct(r, t) {
  return `位置已${t ? "垂直" : "水平"}模式 (${r.x}, ${r.y})`;
}
class wt {
  constructor(t, e, a) {
    f(this, "storageService");
    f(this, "pluginName");
    f(this, "log");
    f(this, "warn");
    f(this, "error");
    f(this, "verboseLog");
    this.storageService = t, this.pluginName = e, this.log = a.log, this.warn = a.warn, this.error = a.error, this.verboseLog = a.verboseLog;
  }
  // ==================== 标签页数据存储 ====================
  /**
   * 保存第一个面板的标签数据到持久化存储
   */
  async saveFirstPanelTabs(t) {
    try {
      await this.storageService.saveConfig(y.FIRST_PANEL_TABS, t, this.pluginName), this.log(`💾 保存第一个面板的 ${t.length} 个标签页数据到API配置`);
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据
   */
  async restoreFirstPanelTabs() {
    try {
      const t = await this.storageService.getConfig(y.FIRST_PANEL_TABS, this.pluginName, []);
      return t && Array.isArray(t) ? (this.log(`📂 从API配置恢复了第一个面板的 ${t.length} 个标签页`), t) : (this.log("📂 没有找到第一个面板的持久化标签数据，返回空数组"), []);
    } catch (t) {
      return this.warn("无法恢复第一个面板标签数据:", t), [];
    }
  }
  /**
   * 保存指定面板的标签页数据
   */
  async savePanelTabs(t, e) {
    try {
      await this.storageService.saveConfig(`panel_${t}_tabs`, e, this.pluginName), this.verboseLog(`💾 已保存面板 ${t} 的标签页数据: ${e.length} 个`);
    } catch (a) {
      this.warn(`❌ 保存面板 ${t} 标签页数据失败:`, a);
    }
  }
  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(t, e) {
    try {
      await this.storageService.saveConfig(t, e, this.pluginName), this.verboseLog(`💾 已保存 ${t} 的标签页数据: ${e.length} 个`);
    } catch (a) {
      this.warn(`❌ 保存 ${t} 标签页数据失败:`, a);
    }
  }
  /**
   * 从存储键恢复面板标签页数据
   */
  async restorePanelTabsByKey(t) {
    try {
      const e = await this.storageService.getConfig(t, this.pluginName, []);
      return e && Array.isArray(e) ? (this.verboseLog(`📂 从 ${t} 恢复了 ${e.length} 个标签页`), e) : [];
    } catch (e) {
      return this.warn(`❌ 恢复 ${t} 标签页数据失败:`, e), [];
    }
  }
  // ==================== 已关闭标签页管理 ====================
  /**
   * 保存已关闭标签列表到持久化存储
   */
  async saveClosedTabs(t) {
    try {
      await this.storageService.saveConfig(y.CLOSED_TABS, Array.from(t), this.pluginName), this.log("💾 保存已关闭标签列表到API配置");
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  async restoreClosedTabs() {
    try {
      const t = await this.storageService.getConfig(y.CLOSED_TABS, this.pluginName, []);
      if (t && Array.isArray(t)) {
        const e = new Set(t);
        return this.log(`📂 从API配置恢复了 ${e.size} 个已关闭标签`), e;
      } else
        return this.log("📂 没有找到持久化的已关闭标签数据，返回空集合"), /* @__PURE__ */ new Set();
    } catch (t) {
      return this.warn("无法恢复已关闭标签列表:", t), /* @__PURE__ */ new Set();
    }
  }
  // ==================== 最近关闭标签页管理 ====================
  /**
   * 保存最近关闭的标签页列表到持久化存储
   */
  async saveRecentlyClosedTabs(t) {
    try {
      await this.storageService.saveConfig(y.RECENTLY_CLOSED_TABS, t, this.pluginName), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (e) {
      this.warn("无法保存最近关闭标签页列表:", e);
    }
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表
   */
  async restoreRecentlyClosedTabs() {
    try {
      const t = await this.storageService.getConfig(y.RECENTLY_CLOSED_TABS, this.pluginName, []);
      return t && Array.isArray(t) ? (this.log(`📂 从API配置恢复了 ${t.length} 个最近关闭的标签页`), t) : (this.log("📂 没有找到最近关闭标签页数据，返回空数组"), []);
    } catch (t) {
      return this.warn("无法恢复最近关闭标签页列表:", t), [];
    }
  }
  // ==================== 标签页集合管理 ====================
  /**
   * 保存多标签页集合到持久化存储
   */
  async saveSavedTabSets(t) {
    try {
      await this.storageService.saveConfig(y.SAVED_TAB_SETS, t, this.pluginName), this.log("💾 保存多标签页集合到API配置");
    } catch (e) {
      this.warn("无法保存多标签页集合:", e);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合
   */
  async restoreSavedTabSets() {
    try {
      const t = await this.storageService.getConfig(y.SAVED_TAB_SETS, this.pluginName, []);
      return t && Array.isArray(t) ? (this.log(`📂 从API配置恢复了 ${t.length} 个多标签页集合`), t) : (this.log("📂 没有找到多标签页集合数据，返回空数组"), []);
    } catch (t) {
      return this.warn("无法恢复多标签页集合:", t), [];
    }
  }
  // ==================== 工作区管理 ====================
  /**
   * 加载工作区数据
   */
  async loadWorkspaces() {
    try {
      const t = await this.storageService.getConfig(y.WORKSPACES), e = t && Array.isArray(t) ? t : [], a = await this.storageService.getConfig(y.ENABLE_WORKSPACES), n = typeof a == "boolean" ? a : !1;
      return this.log(`📁 已加载 ${e.length} 个工作区`), { workspaces: e, enableWorkspaces: n };
    } catch (t) {
      return this.error("加载工作区数据失败:", t), { workspaces: [], enableWorkspaces: !1 };
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces(t, e, a) {
    try {
      await this.storageService.saveConfig(y.WORKSPACES, t, this.pluginName), await this.storageService.saveConfig(y.CURRENT_WORKSPACE, e, this.pluginName), await this.storageService.saveConfig(y.ENABLE_WORKSPACES, a, this.pluginName), this.log("💾 工作区数据已保存");
    } catch (n) {
      this.error("保存工作区数据失败:", n);
    }
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    try {
      await this.storageService.saveConfig(y.CURRENT_WORKSPACE, null, this.pluginName), this.log("📁 已清除当前工作区状态");
    } catch (t) {
      this.error("清除当前工作区状态失败:", t);
    }
  }
  // ==================== 位置和布局配置 ====================
  /**
   * 保存位置信息
   */
  async savePosition(t, e, a, n) {
    try {
      const i = yt(
        t,
        e,
        a,
        n
      );
      return await this.saveLayoutMode({
        isVerticalMode: e,
        verticalWidth: 0,
        // 这个值需要从外部传入
        verticalPosition: i.verticalPosition,
        horizontalPosition: i.horizontalPosition,
        isSidebarAlignmentEnabled: !1,
        // 这些值需要从外部传入
        isFloatingWindowVisible: !1,
        showBlockTypeIcons: !1,
        showInHeadbar: !1
      }), this.log(`💾 位置已保存: ${ct(t, e)}`), i;
    } catch {
      return this.warn("无法保存标签位置"), { verticalPosition: a, horizontalPosition: n };
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(t) {
    try {
      await this.storageService.saveConfig(y.LAYOUT_MODE, t, this.pluginName), this.log(`💾 布局模式已保存: ${t.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${t.verticalWidth}px, 垂直位置: (${t.verticalPosition.x}, ${t.verticalPosition.y}), 水平位置: (${t.horizontalPosition.x}, ${t.horizontalPosition.y})`);
    } catch (e) {
      this.error("保存布局模式失败:", e);
    }
  }
  /**
   * 恢复布局模式配置
   */
  async restoreLayoutMode() {
    try {
      const t = await this.storageService.getConfig(
        y.LAYOUT_MODE,
        this.pluginName,
        A()
      ), e = {
        ...A(),
        ...t
      };
      return this.log(`📂 恢复布局模式配置: ${e.isVerticalMode ? "垂直" : "水平"}`), e;
    } catch (t) {
      return this.warn("恢复布局模式配置失败:", t), A();
    }
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode(t) {
    try {
      const e = { isFixedToTop: t };
      await this.storageService.saveConfig(y.FIXED_TO_TOP, e, this.pluginName), this.log(`💾 固定到顶部状态已保存: ${t ? "启用" : "禁用"}`);
    } catch (e) {
      this.error("保存固定到顶部状态失败:", e);
    }
  }
  /**
   * 恢复固定到顶部状态
   */
  async restoreFixedToTopMode() {
    try {
      const t = await this.storageService.getConfig(
        y.FIXED_TO_TOP,
        this.pluginName,
        { isFixedToTop: !1 }
      ), e = (t == null ? void 0 : t.isFixedToTop) || !1;
      return this.log(`📂 恢复固定到顶部状态: ${e ? "启用" : "禁用"}`), e;
    } catch (t) {
      return this.warn("恢复固定到顶部状态失败:", t), !1;
    }
  }
  /**
   * 保存浮窗可见状态
   */
  async saveFloatingWindowVisible(t) {
    try {
      await this.storageService.saveConfig(y.FLOATING_WINDOW_VISIBLE, t, this.pluginName), this.log(`💾 浮窗可见状态已保存: ${t ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("保存浮窗可见状态失败:", e);
    }
  }
  /**
   * 恢复浮窗可见状态
   */
  async restoreFloatingWindowVisible() {
    try {
      const e = await this.storageService.getConfig(y.FLOATING_WINDOW_VISIBLE, this.pluginName, !1) || !1;
      return this.log(`📱 恢复浮窗可见状态: ${e ? "显示" : "隐藏"}`), e;
    } catch (t) {
      return this.error("恢复浮窗可见状态失败:", t), !1;
    }
  }
  // ==================== 缓存清理 ====================
  /**
   * 删除API配置缓存
   */
  async clearCache() {
    try {
      await this.storageService.removeConfig(y.FIRST_PANEL_TABS), await this.storageService.removeConfig(y.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
    } catch (t) {
      this.warn("删除API配置缓存失败:", t);
    }
  }
  // ==================== 工具方法 ====================
  /**
   * 简单的字符串哈希函数
   */
  hashString(t) {
    let e = 0;
    for (let a = 0; a < t.length; a++) {
      const n = t.charCodeAt(a);
      e = (e << 5) - e + n, e = e & e;
    }
    return Math.abs(e).toString(36);
  }
}
const lt = 6048e5, kt = 864e5, J = Symbol.for("constructDateFrom");
function P(r, t) {
  return typeof r == "function" ? r(t) : r && typeof r == "object" && J in r ? r[J](t) : r instanceof Date ? new r.constructor(t) : new Date(t);
}
function E(r, t) {
  return P(t || r, r);
}
function dt(r, t, e) {
  const a = E(r, e == null ? void 0 : e.in);
  return isNaN(t) ? P(r, NaN) : (t && a.setDate(a.getDate() + t), a);
}
let Ct = {};
function V() {
  return Ct;
}
function q(r, t) {
  var s, c, l, d;
  const e = V(), a = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? e.weekStartsOn ?? ((d = (l = e.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, n = E(r, t == null ? void 0 : t.in), i = n.getDay(), o = (i < a ? 7 : 0) + i - a;
  return n.setDate(n.getDate() - o), n.setHours(0, 0, 0, 0), n;
}
function U(r, t) {
  return q(r, { ...t, weekStartsOn: 1 });
}
function ht(r, t) {
  const e = E(r, t == null ? void 0 : t.in), a = e.getFullYear(), n = P(e, 0);
  n.setFullYear(a + 1, 0, 4), n.setHours(0, 0, 0, 0);
  const i = U(n), o = P(e, 0);
  o.setFullYear(a, 0, 4), o.setHours(0, 0, 0, 0);
  const s = U(o);
  return e.getTime() >= i.getTime() ? a + 1 : e.getTime() >= s.getTime() ? a : a - 1;
}
function Q(r) {
  const t = E(r), e = new Date(
    Date.UTC(
      t.getFullYear(),
      t.getMonth(),
      t.getDate(),
      t.getHours(),
      t.getMinutes(),
      t.getSeconds(),
      t.getMilliseconds()
    )
  );
  return e.setUTCFullYear(t.getFullYear()), +r - +e;
}
function ut(r, ...t) {
  const e = P.bind(
    null,
    t.find((a) => typeof a == "object")
  );
  return t.map(e);
}
function H(r, t) {
  const e = E(r, t == null ? void 0 : t.in);
  return e.setHours(0, 0, 0, 0), e;
}
function It(r, t, e) {
  const [a, n] = ut(
    e == null ? void 0 : e.in,
    r,
    t
  ), i = H(a), o = H(n), s = +i - Q(i), c = +o - Q(o);
  return Math.round((s - c) / kt);
}
function St(r, t) {
  const e = ht(r, t), a = P(r, 0);
  return a.setFullYear(e, 0, 4), a.setHours(0, 0, 0, 0), U(a);
}
function G(r) {
  return P(r, Date.now());
}
function K(r, t, e) {
  const [a, n] = ut(
    e == null ? void 0 : e.in,
    r,
    t
  );
  return +H(a) == +H(n);
}
function Pt(r) {
  return r instanceof Date || typeof r == "object" && Object.prototype.toString.call(r) === "[object Date]";
}
function Et(r) {
  return !(!Pt(r) && typeof r != "number" || isNaN(+E(r)));
}
function $t(r, t) {
  const e = E(r, t == null ? void 0 : t.in);
  return e.setFullYear(e.getFullYear(), 0, 1), e.setHours(0, 0, 0, 0), e;
}
const Lt = {
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
}, Mt = (r, t, e) => {
  let a;
  const n = Lt[r];
  return typeof n == "string" ? a = n : t === 1 ? a = n.one : a = n.other.replace("{{count}}", t.toString()), e != null && e.addSuffix ? e.comparison && e.comparison > 0 ? "in " + a : a + " ago" : a;
};
function X(r) {
  return (t = {}) => {
    const e = t.width ? String(t.width) : r.defaultWidth;
    return r.formats[e] || r.formats[r.defaultWidth];
  };
}
const Dt = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, At = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Wt = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Bt = {
  date: X({
    formats: Dt,
    defaultWidth: "full"
  }),
  time: X({
    formats: At,
    defaultWidth: "full"
  }),
  dateTime: X({
    formats: Wt,
    defaultWidth: "full"
  })
}, Nt = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ot = (r, t, e, a) => Nt[r];
function z(r) {
  return (t, e) => {
    const a = e != null && e.context ? String(e.context) : "standalone";
    let n;
    if (a === "formatting" && r.formattingValues) {
      const o = r.defaultFormattingWidth || r.defaultWidth, s = e != null && e.width ? String(e.width) : o;
      n = r.formattingValues[s] || r.formattingValues[o];
    } else {
      const o = r.defaultWidth, s = e != null && e.width ? String(e.width) : r.defaultWidth;
      n = r.values[s] || r.values[o];
    }
    const i = r.argumentCallback ? r.argumentCallback(t) : t;
    return n[i];
  };
}
const zt = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Ft = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Rt = {
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
}, qt = {
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
}, _t = {
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
}, Ut = {
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
}, Ht = (r, t) => {
  const e = Number(r), a = e % 100;
  if (a > 20 || a < 10)
    switch (a % 10) {
      case 1:
        return e + "st";
      case 2:
        return e + "nd";
      case 3:
        return e + "rd";
    }
  return e + "th";
}, Vt = {
  ordinalNumber: Ht,
  era: z({
    values: zt,
    defaultWidth: "wide"
  }),
  quarter: z({
    values: Ft,
    defaultWidth: "wide",
    argumentCallback: (r) => r - 1
  }),
  month: z({
    values: Rt,
    defaultWidth: "wide"
  }),
  day: z({
    values: qt,
    defaultWidth: "wide"
  }),
  dayPeriod: z({
    values: _t,
    defaultWidth: "wide",
    formattingValues: Ut,
    defaultFormattingWidth: "wide"
  })
};
function F(r) {
  return (t, e = {}) => {
    const a = e.width, n = a && r.matchPatterns[a] || r.matchPatterns[r.defaultMatchWidth], i = t.match(n);
    if (!i)
      return null;
    const o = i[0], s = a && r.parsePatterns[a] || r.parsePatterns[r.defaultParseWidth], c = Array.isArray(s) ? Yt(s, (h) => h.test(o)) : (
      // [TODO] -- I challenge you to fix the type
      jt(s, (h) => h.test(o))
    );
    let l;
    l = r.valueCallback ? r.valueCallback(c) : c, l = e.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      e.valueCallback(l)
    ) : l;
    const d = t.slice(o.length);
    return { value: l, rest: d };
  };
}
function jt(r, t) {
  for (const e in r)
    if (Object.prototype.hasOwnProperty.call(r, e) && t(r[e]))
      return e;
}
function Yt(r, t) {
  for (let e = 0; e < r.length; e++)
    if (t(r[e]))
      return e;
}
function Xt(r) {
  return (t, e = {}) => {
    const a = t.match(r.matchPattern);
    if (!a) return null;
    const n = a[0], i = t.match(r.parsePattern);
    if (!i) return null;
    let o = r.valueCallback ? r.valueCallback(i[0]) : i[0];
    o = e.valueCallback ? e.valueCallback(o) : o;
    const s = t.slice(n.length);
    return { value: o, rest: s };
  };
}
const Gt = /^(\d+)(th|st|nd|rd)?/i, Kt = /\d+/i, Jt = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Qt = {
  any: [/^b/i, /^(a|c)/i]
}, Zt = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, te = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, ee = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ae = {
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
}, ne = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, ie = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, re = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, oe = {
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
}, se = {
  ordinalNumber: Xt({
    matchPattern: Gt,
    parsePattern: Kt,
    valueCallback: (r) => parseInt(r, 10)
  }),
  era: F({
    matchPatterns: Jt,
    defaultMatchWidth: "wide",
    parsePatterns: Qt,
    defaultParseWidth: "any"
  }),
  quarter: F({
    matchPatterns: Zt,
    defaultMatchWidth: "wide",
    parsePatterns: te,
    defaultParseWidth: "any",
    valueCallback: (r) => r + 1
  }),
  month: F({
    matchPatterns: ee,
    defaultMatchWidth: "wide",
    parsePatterns: ae,
    defaultParseWidth: "any"
  }),
  day: F({
    matchPatterns: ne,
    defaultMatchWidth: "wide",
    parsePatterns: ie,
    defaultParseWidth: "any"
  }),
  dayPeriod: F({
    matchPatterns: re,
    defaultMatchWidth: "any",
    parsePatterns: oe,
    defaultParseWidth: "any"
  })
}, ce = {
  code: "en-US",
  formatDistance: Mt,
  formatLong: Bt,
  formatRelative: Ot,
  localize: Vt,
  match: se,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function le(r, t) {
  const e = E(r, t == null ? void 0 : t.in);
  return It(e, $t(e)) + 1;
}
function de(r, t) {
  const e = E(r, t == null ? void 0 : t.in), a = +U(e) - +St(e);
  return Math.round(a / lt) + 1;
}
function gt(r, t) {
  var d, h, u, g;
  const e = E(r, t == null ? void 0 : t.in), a = e.getFullYear(), n = V(), i = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((h = (d = t == null ? void 0 : t.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? n.firstWeekContainsDate ?? ((g = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, o = P((t == null ? void 0 : t.in) || r, 0);
  o.setFullYear(a + 1, 0, i), o.setHours(0, 0, 0, 0);
  const s = q(o, t), c = P((t == null ? void 0 : t.in) || r, 0);
  c.setFullYear(a, 0, i), c.setHours(0, 0, 0, 0);
  const l = q(c, t);
  return +e >= +s ? a + 1 : +e >= +l ? a : a - 1;
}
function he(r, t) {
  var s, c, l, d;
  const e = V(), a = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.firstWeekContainsDate) ?? e.firstWeekContainsDate ?? ((d = (l = e.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, n = gt(r, t), i = P((t == null ? void 0 : t.in) || r, 0);
  return i.setFullYear(n, 0, a), i.setHours(0, 0, 0, 0), q(i, t);
}
function ue(r, t) {
  const e = E(r, t == null ? void 0 : t.in), a = +q(e, t) - +he(e, t);
  return Math.round(a / lt) + 1;
}
function w(r, t) {
  const e = r < 0 ? "-" : "", a = Math.abs(r).toString().padStart(t, "0");
  return e + a;
}
const L = {
  // Year
  y(r, t) {
    const e = r.getFullYear(), a = e > 0 ? e : 1 - e;
    return w(t === "yy" ? a % 100 : a, t.length);
  },
  // Month
  M(r, t) {
    const e = r.getMonth();
    return t === "M" ? String(e + 1) : w(e + 1, 2);
  },
  // Day of the month
  d(r, t) {
    return w(r.getDate(), t.length);
  },
  // AM or PM
  a(r, t) {
    const e = r.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return e.toUpperCase();
      case "aaa":
        return e;
      case "aaaaa":
        return e[0];
      case "aaaa":
      default:
        return e === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h(r, t) {
    return w(r.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(r, t) {
    return w(r.getHours(), t.length);
  },
  // Minute
  m(r, t) {
    return w(r.getMinutes(), t.length);
  },
  // Second
  s(r, t) {
    return w(r.getSeconds(), t.length);
  },
  // Fraction of second
  S(r, t) {
    const e = t.length, a = r.getMilliseconds(), n = Math.trunc(
      a * Math.pow(10, e - 3)
    );
    return w(n, t.length);
  }
}, W = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Z = {
  // Era
  G: function(r, t, e) {
    const a = r.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      case "G":
      case "GG":
      case "GGG":
        return e.era(a, { width: "abbreviated" });
      case "GGGGG":
        return e.era(a, { width: "narrow" });
      case "GGGG":
      default:
        return e.era(a, { width: "wide" });
    }
  },
  // Year
  y: function(r, t, e) {
    if (t === "yo") {
      const a = r.getFullYear(), n = a > 0 ? a : 1 - a;
      return e.ordinalNumber(n, { unit: "year" });
    }
    return L.y(r, t);
  },
  // Local week-numbering year
  Y: function(r, t, e, a) {
    const n = gt(r, a), i = n > 0 ? n : 1 - n;
    if (t === "YY") {
      const o = i % 100;
      return w(o, 2);
    }
    return t === "Yo" ? e.ordinalNumber(i, { unit: "year" }) : w(i, t.length);
  },
  // ISO week-numbering year
  R: function(r, t) {
    const e = ht(r);
    return w(e, t.length);
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
  u: function(r, t) {
    const e = r.getFullYear();
    return w(e, t.length);
  },
  // Quarter
  Q: function(r, t, e) {
    const a = Math.ceil((r.getMonth() + 1) / 3);
    switch (t) {
      case "Q":
        return String(a);
      case "QQ":
        return w(a, 2);
      case "Qo":
        return e.ordinalNumber(a, { unit: "quarter" });
      case "QQQ":
        return e.quarter(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return e.quarter(a, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return e.quarter(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(r, t, e) {
    const a = Math.ceil((r.getMonth() + 1) / 3);
    switch (t) {
      case "q":
        return String(a);
      case "qq":
        return w(a, 2);
      case "qo":
        return e.ordinalNumber(a, { unit: "quarter" });
      case "qqq":
        return e.quarter(a, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return e.quarter(a, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return e.quarter(a, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(r, t, e) {
    const a = r.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return L.M(r, t);
      case "Mo":
        return e.ordinalNumber(a + 1, { unit: "month" });
      case "MMM":
        return e.month(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return e.month(a, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return e.month(a, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(r, t, e) {
    const a = r.getMonth();
    switch (t) {
      case "L":
        return String(a + 1);
      case "LL":
        return w(a + 1, 2);
      case "Lo":
        return e.ordinalNumber(a + 1, { unit: "month" });
      case "LLL":
        return e.month(a, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return e.month(a, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return e.month(a, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(r, t, e, a) {
    const n = ue(r, a);
    return t === "wo" ? e.ordinalNumber(n, { unit: "week" }) : w(n, t.length);
  },
  // ISO week of year
  I: function(r, t, e) {
    const a = de(r);
    return t === "Io" ? e.ordinalNumber(a, { unit: "week" }) : w(a, t.length);
  },
  // Day of the month
  d: function(r, t, e) {
    return t === "do" ? e.ordinalNumber(r.getDate(), { unit: "date" }) : L.d(r, t);
  },
  // Day of year
  D: function(r, t, e) {
    const a = le(r);
    return t === "Do" ? e.ordinalNumber(a, { unit: "dayOfYear" }) : w(a, t.length);
  },
  // Day of week
  E: function(r, t, e) {
    const a = r.getDay();
    switch (t) {
      case "E":
      case "EE":
      case "EEE":
        return e.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return e.day(a, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return e.day(a, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return e.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(r, t, e, a) {
    const n = r.getDay(), i = (n - a.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "e":
        return String(i);
      case "ee":
        return w(i, 2);
      case "eo":
        return e.ordinalNumber(i, { unit: "day" });
      case "eee":
        return e.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return e.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return e.day(n, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return e.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(r, t, e, a) {
    const n = r.getDay(), i = (n - a.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "c":
        return String(i);
      case "cc":
        return w(i, t.length);
      case "co":
        return e.ordinalNumber(i, { unit: "day" });
      case "ccc":
        return e.day(n, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return e.day(n, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return e.day(n, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return e.day(n, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(r, t, e) {
    const a = r.getDay(), n = a === 0 ? 7 : a;
    switch (t) {
      case "i":
        return String(n);
      case "ii":
        return w(n, t.length);
      case "io":
        return e.ordinalNumber(n, { unit: "day" });
      case "iii":
        return e.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return e.day(a, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return e.day(a, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return e.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(r, t, e) {
    const n = r.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return e.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return e.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return e.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return e.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(r, t, e) {
    const a = r.getHours();
    let n;
    switch (a === 12 ? n = W.noon : a === 0 ? n = W.midnight : n = a / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return e.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return e.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return e.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return e.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(r, t, e) {
    const a = r.getHours();
    let n;
    switch (a >= 17 ? n = W.evening : a >= 12 ? n = W.afternoon : a >= 4 ? n = W.morning : n = W.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return e.dayPeriod(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return e.dayPeriod(n, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return e.dayPeriod(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(r, t, e) {
    if (t === "ho") {
      let a = r.getHours() % 12;
      return a === 0 && (a = 12), e.ordinalNumber(a, { unit: "hour" });
    }
    return L.h(r, t);
  },
  // Hour [0-23]
  H: function(r, t, e) {
    return t === "Ho" ? e.ordinalNumber(r.getHours(), { unit: "hour" }) : L.H(r, t);
  },
  // Hour [0-11]
  K: function(r, t, e) {
    const a = r.getHours() % 12;
    return t === "Ko" ? e.ordinalNumber(a, { unit: "hour" }) : w(a, t.length);
  },
  // Hour [1-24]
  k: function(r, t, e) {
    let a = r.getHours();
    return a === 0 && (a = 24), t === "ko" ? e.ordinalNumber(a, { unit: "hour" }) : w(a, t.length);
  },
  // Minute
  m: function(r, t, e) {
    return t === "mo" ? e.ordinalNumber(r.getMinutes(), { unit: "minute" }) : L.m(r, t);
  },
  // Second
  s: function(r, t, e) {
    return t === "so" ? e.ordinalNumber(r.getSeconds(), { unit: "second" }) : L.s(r, t);
  },
  // Fraction of second
  S: function(r, t) {
    return L.S(r, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(r, t, e) {
    const a = r.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (t) {
      case "X":
        return et(a);
      case "XXXX":
      case "XX":
        return D(a);
      case "XXXXX":
      case "XXX":
      default:
        return D(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(r, t, e) {
    const a = r.getTimezoneOffset();
    switch (t) {
      case "x":
        return et(a);
      case "xxxx":
      case "xx":
        return D(a);
      case "xxxxx":
      case "xxx":
      default:
        return D(a, ":");
    }
  },
  // Timezone (GMT)
  O: function(r, t, e) {
    const a = r.getTimezoneOffset();
    switch (t) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + tt(a, ":");
      case "OOOO":
      default:
        return "GMT" + D(a, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(r, t, e) {
    const a = r.getTimezoneOffset();
    switch (t) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + tt(a, ":");
      case "zzzz":
      default:
        return "GMT" + D(a, ":");
    }
  },
  // Seconds timestamp
  t: function(r, t, e) {
    const a = Math.trunc(+r / 1e3);
    return w(a, t.length);
  },
  // Milliseconds timestamp
  T: function(r, t, e) {
    return w(+r, t.length);
  }
};
function tt(r, t = "") {
  const e = r > 0 ? "-" : "+", a = Math.abs(r), n = Math.trunc(a / 60), i = a % 60;
  return i === 0 ? e + String(n) : e + String(n) + t + w(i, 2);
}
function et(r, t) {
  return r % 60 === 0 ? (r > 0 ? "-" : "+") + w(Math.abs(r) / 60, 2) : D(r, t);
}
function D(r, t = "") {
  const e = r > 0 ? "-" : "+", a = Math.abs(r), n = w(Math.trunc(a / 60), 2), i = w(a % 60, 2);
  return e + n + t + i;
}
const at = (r, t) => {
  switch (r) {
    case "P":
      return t.date({ width: "short" });
    case "PP":
      return t.date({ width: "medium" });
    case "PPP":
      return t.date({ width: "long" });
    case "PPPP":
    default:
      return t.date({ width: "full" });
  }
}, pt = (r, t) => {
  switch (r) {
    case "p":
      return t.time({ width: "short" });
    case "pp":
      return t.time({ width: "medium" });
    case "ppp":
      return t.time({ width: "long" });
    case "pppp":
    default:
      return t.time({ width: "full" });
  }
}, ge = (r, t) => {
  const e = r.match(/(P+)(p+)?/) || [], a = e[1], n = e[2];
  if (!n)
    return at(r, t);
  let i;
  switch (a) {
    case "P":
      i = t.dateTime({ width: "short" });
      break;
    case "PP":
      i = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      i = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      i = t.dateTime({ width: "full" });
      break;
  }
  return i.replace("{{date}}", at(a, t)).replace("{{time}}", pt(n, t));
}, pe = {
  p: pt,
  P: ge
}, be = /^D+$/, me = /^Y+$/, fe = ["D", "DD", "YY", "YYYY"];
function xe(r) {
  return be.test(r);
}
function ve(r) {
  return me.test(r);
}
function ye(r, t, e) {
  const a = Te(r, t, e);
  if (console.warn(a), fe.includes(r)) throw new RangeError(a);
}
function Te(r, t, e) {
  const a = r[0] === "Y" ? "years" : "days of the month";
  return `Use \`${r.toLowerCase()}\` instead of \`${r}\` (in \`${t}\`) for formatting ${a} to the input \`${e}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const we = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, ke = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Ce = /^'([^]*?)'?$/, Ie = /''/g, Se = /[a-zA-Z]/;
function M(r, t, e) {
  var d, h, u, g;
  const a = V(), n = a.locale ?? ce, i = a.firstWeekContainsDate ?? ((h = (d = a.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, o = a.weekStartsOn ?? ((g = (u = a.locale) == null ? void 0 : u.options) == null ? void 0 : g.weekStartsOn) ?? 0, s = E(r, e == null ? void 0 : e.in);
  if (!Et(s))
    throw new RangeError("Invalid time value");
  let c = t.match(ke).map((b) => {
    const m = b[0];
    if (m === "p" || m === "P") {
      const p = pe[m];
      return p(b, n.formatLong);
    }
    return b;
  }).join("").match(we).map((b) => {
    if (b === "''")
      return { isToken: !1, value: "'" };
    const m = b[0];
    if (m === "'")
      return { isToken: !1, value: Pe(b) };
    if (Z[m])
      return { isToken: !0, value: b };
    if (m.match(Se))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: b };
  });
  n.localize.preprocessor && (c = n.localize.preprocessor(s, c));
  const l = {
    firstWeekContainsDate: i,
    weekStartsOn: o,
    locale: n
  };
  return c.map((b) => {
    if (!b.isToken) return b.value;
    const m = b.value;
    (ve(m) || xe(m)) && ye(m, t, String(r));
    const p = Z[m[0]];
    return p(s, m, n.localize, l);
  }).join("");
}
function Pe(r) {
  const t = r.match(Ce);
  return t ? t[1].replace(Ie, "'") : r;
}
function Ee(r, t) {
  return K(
    P(r, r),
    G(r)
  );
}
function $e(r, t) {
  return K(
    r,
    dt(G(r), 1),
    t
  );
}
function Le(r, t, e) {
  return dt(r, -1, e);
}
function Me(r, t) {
  return K(
    P(r, r),
    Le(G(r))
  );
}
function De(r) {
  try {
    let t = orca.state.settings[ot.JournalDateFormat];
    if ((!t || typeof t != "string") && (t = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Ee(r))
      return "今天";
    if (Me(r))
      return "昨天";
    if ($e(r))
      return "明天";
    try {
      if (t.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const a = r.getDay(), i = ["日", "一", "二", "三", "四", "五", "六"][a], o = t.replace(/E/g, i);
          return M(r, o);
        } else
          return M(r, t);
      else
        return M(r, t);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const n of a)
        try {
          return M(r, n);
        } catch {
          continue;
        }
      return r.toLocaleDateString();
    }
  } catch {
    return r.toLocaleDateString();
  }
}
function nt(r) {
  try {
    const t = Ae(r, "_repr");
    if (!t || t.type !== st.JSON || !t.value)
      return null;
    const e = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
    return e.type === "journal" && e.date ? new Date(e.date) : null;
  } catch {
    return null;
  }
}
function Ae(r, t) {
  return !r.properties || !Array.isArray(r.properties) ? null : r.properties.find((e) => e.name === t);
}
function We(r) {
  if (!Array.isArray(r) || r.length === 0)
    return !1;
  let t = 0, e = 0;
  for (const a of r)
    a && typeof a == "object" && (a.t === "text" && a.v ? t++ : a.t === "ref" && a.v && e++);
  return t > 0 && e > 0 && t >= e;
}
async function Be(r) {
  if (!r || r.length === 0) return "";
  let t = "";
  for (const e of r)
    e.t === "t" && e.v ? t += e.v : e.t === "r" ? e.u ? e.v ? t += e.v : t += e.u : e.a ? t += `[[${e.a}]]` : e.v && (typeof e.v == "number" || typeof e.v == "string") ? t += `[[块${e.v}]]` : e.v && (t += e.v) : e.t === "br" && e.v ? t += `[[块${e.v}]]` : e.t && e.t.includes("math") && e.v ? t += `[数学: ${e.v}]` : e.t && e.t.includes("code") && e.v ? t += `[代码: ${e.v}]` : e.t && e.t.includes("image") && e.v ? t += `[图片: ${e.v}]` : e.v && (t += e.v);
  return t;
}
function Ne(r, t, e, a) {
  const n = document.createElement("div");
  n.className = "orca-tabs-ref-menu-item", n.setAttribute("role", "menuitem"), n.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
    font-size: 14px;
    line-height: 1.4;
  `;
  const i = document.createElement("i");
  i.className = t, i.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const o = document.createElement("span");
  if (o.textContent = r, o.style.cssText = `
    flex: 1;
    color: #333;
  `, n.appendChild(i), n.appendChild(o), e && e.trim() !== "") {
    const s = document.createElement("span");
    s.textContent = e, s.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, n.appendChild(s);
  }
  return n.addEventListener("mouseenter", () => {
    n.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), n.addEventListener("mouseleave", () => {
    n.style.backgroundColor = "transparent";
  }), n.addEventListener("click", (s) => {
    s.preventDefault(), s.stopPropagation(), a();
    const c = n.closest('.orca-context-menu, .context-menu, [role="menu"]');
    c && (c.style.display = "none", c.remove());
  }), n;
}
function Oe(r, t) {
  const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);
  if (e) {
    const a = parseInt(e[1], 16), n = parseInt(e[2], 16), i = parseInt(e[3], 16);
    return `rgba(${a}, ${n}, ${i}, ${t})`;
  }
  return `rgba(200, 200, 200, ${t})`;
}
function ze(r, t, e) {
  let a = "var(--orca-tab-bg)", n = "var(--orca-color-text-1)", i = "normal", o = "";
  if (r.color)
    try {
      o = `--tab-color: ${r.color.startsWith("#") ? r.color : `#${r.color}`};`, a = "var(--orca-tab-colored-bg)", n = "var(--orca-tab-colored-text)", i = "600";
    } catch {
    }
  return t ? `
    ${o}
    background: ${a};
    color: ${n};
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
    transition: all 0.2s ease;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
  ` : `
    ${o}
    background: ${a};
    color: ${n};
    font-weight: ${i};
    padding: 2px 8px;
    border-radius: var(--orca-radius-md);
    height: 24px;
    max-height: 24px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    max-width: 130px;
    transition: all 0.2s ease;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
  `;
}
function Fe() {
  const r = document.createElement("div");
  return r.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, r;
}
function Re(r) {
  const t = document.createElement("div");
  if (t.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    font-size: 14px;
    line-height: 1;
  `, r.startsWith("ti ti-")) {
    const e = document.createElement("i");
    e.className = r, t.appendChild(e);
  } else
    t.textContent = r;
  return t;
}
function qe(r) {
  const t = document.createElement("div");
  t.style.cssText = `
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    min-width: 0;
    display: flex;
    align-items: center;
    line-height: 1;
    height: 16px;
    position: relative;
  `;
  const e = document.createElement("span");
  return e.style.cssText = `
    display: block;
    white-space: nowrap;
    width: 100%;
  `, e.textContent = r, t.appendChild(e), requestAnimationFrame(() => {
    const a = t.offsetWidth;
    e.scrollWidth > a && (e.style.mask = "linear-gradient(to right, black 0%, black 70%, transparent 100%)", e.style.webkitMask = "linear-gradient(to right, black 0%, black 70%, transparent 100%)");
  }), t;
}
function _e() {
  const r = document.createElement("span");
  return r.textContent = "📌", r.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, r;
}
function Ue(r) {
  let t = r.title;
  return r.isPinned && (t += " (已固定)"), t;
}
function He() {
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
function it(r = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[r];
}
function Ve() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function je(r, t, e, a) {
  return r ? `
    position: fixed;
    top: ${t.y}px;
    left: ${t.x}px;
    z-index: 300;
    display: flex;
    flex-direction: column;
    gap: 4px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    background: ${e};
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
    top: ${t.y}px;
    left: ${t.x}px;
    z-index: 300;
    display: flex;
    gap: 4px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    background: ${e};
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
function Ye(r, t, e = {}) {
  try {
    const {
      updateOrder: a = !0,
      saveData: n = !0,
      updateUI: i = !0
    } = e, o = t.findIndex((c) => c.blockId === r.blockId);
    if (o === -1)
      return {
        success: !1,
        message: `标签不存在: ${r.title}`
      };
    t[o].isPinned = !t[o].isPinned, a && Je(t);
    const s = t[o].isPinned ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${r.title}" 已${s}`,
      data: { tab: t[o], tabIndex: o }
    };
  } catch (a) {
    return {
      success: !1,
      message: `切换固定状态失败: ${a}`
    };
  }
}
function Xe(r, t, e, a = {}) {
  try {
    const {
      updateUI: n = !0,
      saveData: i = !0,
      validateData: o = !0
    } = a, s = e.findIndex((c) => c.blockId === r.blockId);
    if (s === -1)
      return {
        success: !1,
        message: `标签不存在: ${r.title}`
      };
    if (o) {
      const c = Ke(t);
      if (!c.success)
        return c;
    }
    return e[s] = { ...e[s], ...t }, {
      success: !0,
      message: `标签 "${r.title}" 已更新`,
      data: { tab: e[s], tabIndex: s }
    };
  } catch (n) {
    return {
      success: !1,
      message: `更新标签失败: ${n}`
    };
  }
}
function Ge(r, t, e, a = {}) {
  return !t || t.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : Xe(r, { title: t.trim() }, e, a);
}
function Ke(r) {
  return r.blockId !== void 0 && (!r.blockId || r.blockId.trim() === "") ? {
    success: !1,
    message: "标签块ID不能为空"
  } : r.title !== void 0 && (!r.title || r.title.trim() === "") ? {
    success: !1,
    message: "标签标题不能为空"
  } : r.order !== void 0 && (r.order < 0 || !Number.isInteger(r.order)) ? {
    success: !1,
    message: "标签顺序必须是正整数"
  } : {
    success: !0,
    message: "标签数据验证通过"
  };
}
function Je(r) {
  r.sort((t, e) => t.isPinned && !e.isPinned ? -1 : !t.isPinned && e.isPinned ? 1 : t.order - e.order);
}
function Qe(r) {
  for (let t = r.length - 1; t >= 0; t--)
    if (!r[t].isPinned)
      return t;
  return -1;
}
function Ze(r) {
  return [...r].sort((t, e) => t.isPinned && !e.isPinned ? -1 : !t.isPinned && e.isPinned ? 1 : 0);
}
function ta(r, t, e, a) {
  return t ? {
    x: r.x,
    y: r.y,
    width: e,
    height: a
  } : {
    x: r.x,
    y: r.y,
    width: Math.min(800, window.innerWidth - r.x - 10),
    height: 28
  };
}
function ea(r, t, e, a) {
  const n = ta(r, t, e, a);
  let i = r.x, o = r.y;
  return n.x < 0 ? i = 0 : n.x + n.width > window.innerWidth && (i = window.innerWidth - n.width), n.y < 0 ? o = 0 : n.y + n.height > window.innerHeight && (o = window.innerHeight - n.height), { x: i, y: o };
}
function aa(r, t, e = !1) {
  let a = null;
  const n = (...i) => {
    const o = e && !a;
    a && clearTimeout(a), a = window.setTimeout(() => {
      a = null, e || r(...i);
    }, t), o && r(...i);
  };
  return n.cancel = () => {
    a && (clearTimeout(a), a = null);
  }, n;
}
function na(r, t, e) {
  var a, n;
  try {
    const i = r.startsWith("#") ? r : `#${r}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(i))
      return t === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const o = parseInt(i.slice(1, 3), 16), s = parseInt(i.slice(3, 5), 16), c = parseInt(i.slice(5, 7), 16), l = e !== void 0 ? e : document.documentElement.classList.contains("dark") || ((n = (a = window.orca) == null ? void 0 : a.state) == null ? void 0 : n.themeMode) === "dark";
    return t === "background" ? `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 1.6) c h)` : `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 0.6) c h)`;
  } catch {
    return t === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
var B = /* @__PURE__ */ ((r) => (r[r.ERROR = 0] = "ERROR", r[r.WARN = 1] = "WARN", r[r.INFO = 2] = "INFO", r[r.DEBUG = 3] = "DEBUG", r[r.VERBOSE = 4] = "VERBOSE", r))(B || {});
const ia = {
  level: 2,
  enableConsole: !0,
  enableStorage: !1,
  maxStorageEntries: 1e3,
  enableTimestamps: !0,
  enableColors: !0,
  prefix: "[OrcaTabs]"
};
class j {
  constructor(t = {}) {
    f(this, "config");
    f(this, "storage", []);
    f(this, "colors", {
      0: "#ff4444",
      1: "#ffaa00",
      2: "#00aaff",
      3: "#00ff88",
      4: "#888888"
    });
    this.config = { ...ia, ...t };
  }
  /**
   * 更新配置
   */
  updateConfig(t) {
    this.config = { ...this.config, ...t };
  }
  /**
   * 记录日志
   */
  log(t, e, a, n) {
    if (t > this.config.level) return;
    const i = {
      timestamp: Date.now(),
      level: t,
      message: e,
      data: a,
      source: n
    };
    this.config.enableConsole && this.logToConsole(i), this.config.enableStorage && this.logToStorage(i);
  }
  /**
   * 输出到控制台
   */
  logToConsole(t) {
    const { timestamp: e, level: a, message: n, data: i, source: o } = t;
    B[a];
    const s = this.config.enableTimestamps ? new Date(e).toLocaleTimeString() : "", c = `${this.config.prefix}${s ? ` [${s}]` : ""}`, l = o ? ` [${o}]` : "", d = `${c}${l} ${n}`, h = this.getConsoleMethod(a);
    i !== void 0 ? h(d, i) : h(d);
  }
  /**
   * 获取控制台方法
   */
  getConsoleMethod(t) {
    switch (t) {
      case 0:
        return console.error.bind(console);
      case 1:
        return console.warn.bind(console);
      case 2:
        return console.info.bind(console);
      case 3:
        return console.debug.bind(console);
      case 4:
        return console.log.bind(console);
      default:
        return console.log.bind(console);
    }
  }
  /**
   * 存储日志
   */
  logToStorage(t) {
    this.storage.push(t), this.storage.length > this.config.maxStorageEntries && (this.storage = this.storage.slice(-this.config.maxStorageEntries));
  }
  /**
   * 错误日志
   */
  error(t, e, a) {
    this.log(0, t, e, a);
  }
  /**
   * 警告日志
   */
  warn(t, e, a) {
    this.log(1, t, e, a);
  }
  /**
   * 信息日志
   */
  info(t, e, a) {
    this.log(2, t, e, a);
  }
  /**
   * 调试日志
   */
  debug(t, e, a) {
    this.log(3, t, e, a);
  }
  /**
   * 详细日志
   */
  verbose(t, e, a) {
    this.log(4, t, e, a);
  }
  /**
   * 获取存储的日志
   */
  getLogs(t, e) {
    let a = this.storage;
    return t !== void 0 && (a = a.filter((n) => n.level === t)), e !== void 0 && (a = a.slice(-e)), a;
  }
  /**
   * 清空存储的日志
   */
  clearLogs() {
    this.storage = [];
  }
  /**
   * 导出日志
   */
  exportLogs(t = "json") {
    return t === "json" ? JSON.stringify(this.storage, null, 2) : this.storage.map((e) => {
      const a = new Date(e.timestamp).toLocaleString(), n = B[e.level], i = e.source ? ` [${e.source}]` : "", o = e.data ? ` ${JSON.stringify(e.data)}` : "";
      return `[${a}] ${n}${i}: ${e.message}${o}`;
    }).join(`
`);
  }
  /**
   * 性能计时器
   */
  time(t) {
  }
  /**
   * 结束性能计时
   */
  timeEnd(t) {
  }
  /**
   * 性能标记
   */
  mark(t) {
    typeof performance < "u" && performance.mark && performance.mark(`${this.config.prefix}-${t}`);
  }
  /**
   * 性能测量
   */
  measure(t, e, a) {
    if (typeof performance < "u" && performance.measure) {
      const n = `${this.config.prefix}-${e}`, i = a ? `${this.config.prefix}-${a}` : void 0;
      performance.measure(`${this.config.prefix}-${t}`, n, i);
    }
  }
  /**
   * 创建子日志器
   */
  createChild(t) {
    const e = new j(this.config);
    return e.config.prefix = `${this.config.prefix}[${t}]`, e;
  }
}
new j();
function ra(r, t, e, a) {
  const n = document.createElement("div");
  n.className = "orca-tabs-plugin orca-tabs-container";
  const i = je(r, t, a, e);
  return n.style.cssText = i, n;
}
function oa(r, t, e) {
  const a = document.createElement("div");
  a.className = "width-adjustment-dialog";
  const n = He();
  a.style.cssText = n;
  const i = document.createElement("div");
  i.className = "dialog-title", i.textContent = "调整面板宽度", a.appendChild(i);
  const o = document.createElement("div");
  o.className = "dialog-slider-container", o.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const s = document.createElement("input");
  s.type = "range", s.min = "120", s.max = "800", s.value = r.toString(), s.style.cssText = Ve();
  const c = document.createElement("div");
  c.className = "dialog-width-display", c.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, c.textContent = `当前宽度: ${r}px`, s.oninput = () => {
    const u = parseInt(s.value);
    c.textContent = `当前宽度: ${u}px`, t(u);
  }, o.appendChild(s), o.appendChild(c), a.appendChild(o);
  const l = document.createElement("div");
  l.className = "dialog-buttons", l.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = it(), d.onclick = () => rt(a);
  const h = document.createElement("button");
  return h.className = "btn btn-secondary", h.textContent = "取消", h.style.cssText = it(), h.onclick = () => {
    e(), rt(a);
  }, l.appendChild(d), l.appendChild(h), a.appendChild(l), a;
}
function rt(r) {
  r && r.parentNode && r.parentNode.removeChild(r);
  const t = document.querySelector(".dialog-backdrop");
  t && t.remove();
}
function sa() {
  if (document.getElementById("dialog-styles")) return;
  const r = document.createElement("style");
  r.id = "dialog-styles", r.textContent = `
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
  `, document.head.appendChild(r);
}
function ca(r, t) {
  return r.length !== t.length ? !0 : !r.every((e, a) => e === t[a]);
}
let R;
class la {
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(t) {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    /** 插件名称 - 动态获取的插件名称，用于API调用和存储 */
    f(this, "pluginName");
    // ==================== 重构的面板数据管理 ====================
    /** 面板顺序映射 - 存储面板ID和序号的映射关系，支持面板关闭后重新排序 */
    f(this, "panelOrder", []);
    /** 当前激活的面板ID - 通过.orca-panel.active获取 */
    f(this, "currentPanelId", null);
    /** 当前面板索引 - 在panelOrder数组中的索引位置 */
    f(this, "currentPanelIndex", -1);
    /** 每个面板的标签页数据 - 索引对应panelOrder数组，完全独立存储 */
    f(this, "panelTabsData", []);
    /** 存储服务实例 - 提供统一的数据存储接口，支持Orca API和localStorage降级 */
    f(this, "storageService", new ft());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    f(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    f(this, "lastPanelCheckTime", 0);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 日志管理器 - 提供统一的日志记录功能，支持不同级别的日志输出 */
    f(this, "logManager", new j({
      level: typeof window < "u" && window.DEBUG_ORCA_TABS_VERBOSE === !0 ? B.VERBOSE : (typeof window < "u" && window.DEBUG_ORCA_TABS === !0, B.INFO),
      // 默认模式：显示信息、警告和错误（临时启用以便调试）
      enableConsole: !0,
      // 始终启用控制台输出
      prefix: "[OrcaTabsPlugin]"
      // 日志前缀，便于识别插件日志
    }));
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* UI元素和状态管理 - UI Elements and State Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== UI元素引用 ====================
    /** 标签页容器元素 - 包含所有标签页的主容器 */
    f(this, "tabContainer", null);
    /** 循环切换器元素 - 用于在面板间切换的UI元素 */
    f(this, "cycleSwitcher", null);
    // ==================== 拖拽状态 ====================
    /** 是否正在拖拽 - 标识当前是否处于拖拽状态 */
    f(this, "isDragging", !1);
    /** 拖拽起始X坐标 - 记录拖拽开始时的鼠标X坐标 */
    f(this, "dragStartX", 0);
    /** 拖拽起始Y坐标 - 记录拖拽开始时的鼠标Y坐标 */
    f(this, "dragStartY", 0);
    // ==================== 配置参数 ====================
    /** 最大标签页数量 - 限制同时显示的标签页数量，从设置中读取 */
    f(this, "maxTabs", 10);
    /** 主页块ID - 主页块的唯一标识符，从设置中读取 */
    f(this, "homePageBlockId", null);
    /** 标签页位置 - 标签页容器的屏幕坐标位置 */
    f(this, "position", { x: 50, y: 50 });
    // ==================== 状态管理 ====================
    /** 监控定时器 - 用于定期检查面板状态和更新UI */
    f(this, "monitoringInterval", null);
    /** 全局事件监听器 - 统一的全局事件处理函数 */
    f(this, "globalEventListener", null);
    /** 更新防抖计时器 - 防止频繁更新UI的防抖机制 */
    f(this, "updateDebounceTimer", null);
    /** 上次更新时间 - 记录最后一次UI更新的时间戳 */
    f(this, "lastUpdateTime", 0);
    /** 是否正在更新 - 标识当前是否正在进行UI更新操作 */
    f(this, "isUpdating", !1);
    /** 是否已完成初始化 - 标识插件是否已完成初始化过程 */
    f(this, "isInitialized", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 布局和位置管理 - Layout and Position Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 布局模式 ====================
    /** 垂直模式标志 - 标识当前是否处于垂直布局模式 */
    f(this, "isVerticalMode", !1);
    /** 垂直模式窗口宽度 - 垂直布局模式下的标签页容器宽度 */
    f(this, "verticalWidth", 120);
    /** 垂直模式位置 - 垂直布局模式下的标签页容器位置 */
    f(this, "verticalPosition", { x: 20, y: 20 });
    /** 水平模式位置 - 水平布局模式下的标签页容器位置 */
    f(this, "horizontalPosition", { x: 20, y: 20 });
    // ==================== 调整大小状态 ====================
    /** 是否正在调整大小 - 标识当前是否正在进行大小调整操作 */
    f(this, "isResizing", !1);
    /** 是否固定到顶部 - 标识标签页容器是否固定到屏幕顶部 */
    f(this, "isFixedToTop", !1);
    /** 调整大小手柄 - 用于调整标签页容器大小的拖拽手柄元素 */
    f(this, "resizeHandle", null);
    // ==================== 侧边栏对齐 ====================
    /** 侧边栏对齐功能是否启用 - 控制是否自动与侧边栏对齐 */
    f(this, "isSidebarAlignmentEnabled", !1);
    /** 侧边栏状态监听器 - 监听侧边栏状态变化的MutationObserver */
    f(this, "sidebarAlignmentObserver", null);
    /** 上次检测到的侧边栏状态 - 用于检测侧边栏状态变化 */
    f(this, "lastSidebarState", null);
    /** 侧边栏防抖计时器 - 防止频繁响应侧边栏状态变化 */
    f(this, "sidebarDebounceTimer", null);
    // ==================== 窗口可见性 ====================
    /** 浮窗是否可见 - 控制标签页容器的显示/隐藏状态 */
    f(this, "isFloatingWindowVisible", !0);
    // ==================== 功能开关 ====================
    /** 是否显示块类型图标 - 控制是否在标签页中显示块类型图标 */
    f(this, "showBlockTypeIcons", !0);
    /** 是否在顶部栏显示按钮 - 控制是否在Orca顶部工具栏显示插件按钮 */
    f(this, "showInHeadbar", !0);
    /** 是否启用最近关闭的标签页功能 - 控制是否记录和显示最近关闭的标签页 */
    f(this, "enableRecentlyClosedTabs", !0);
    /** 是否启用多标签页保存功能 - 控制是否允许保存多个标签页组合 */
    f(this, "enableMultiTabSaving", !0);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 拖拽和事件管理 - Drag and Event Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 拖拽状态管理 ====================
    /** 当前正在拖拽的标签 - 存储正在被拖拽的标签页信息 */
    f(this, "draggingTab", null);
    /** 全局拖拽结束监听器 - 处理拖拽结束事件的全局监听器 */
    f(this, "dragEndListener", null);
    /** 拖拽交换防抖计时器 - 防止拖拽过程中频繁触发交换操作 */
    f(this, "swapDebounceTimer", null);
    /** 上次交换的目标标签ID - 防止重复交换同一目标标签 */
    f(this, "lastSwapTarget", null);
    /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
    f(this, "dropIndicator", null);
    /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
    f(this, "dragOverTab", null);
    /** 优化的拖拽监听器 - 避免全文档监听 */
    f(this, "dragOverListener", null);
    /** 懒加载状态 - 避免不必要的初始化 */
    f(this, "isDragListenersInitialized", !1);
    /** 拖拽悬停计时器 - 控制拖拽悬停的延迟响应 */
    f(this, "dragOverTimer", null);
    /** 是否正在拖拽悬停状态 - 标识当前是否处于拖拽悬停状态 */
    f(this, "isDragOverActive", !1);
    // ==================== 事件监听器 ====================
    /** 主题变化监听器 - 监听Orca主题变化的事件监听器 */
    f(this, "themeChangeListener", null);
    /** 滚动监听器 - 监听页面滚动事件的监听器 */
    f(this, "scrollListener", null);
    // ==================== 缓存和优化 ====================
    /** 上次面板发现时间 - 记录最后一次发现面板的时间戳 */
    f(this, "lastPanelDiscoveryTime", 0);
    /** 面板发现缓存 - 缓存面板发现结果，避免频繁扫描 */
    f(this, "panelDiscoveryCache", null);
    /** 设置检查定时器 - 定期检查设置变化的定时器 */
    f(this, "settingsCheckInterval", null);
    /** 上次的设置状态 - 缓存上次的设置状态，用于检测变化 */
    f(this, "lastSettings", null);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 已关闭标签页跟踪 ====================
    /** 已关闭的标签页blockId集合 - 用于跟踪已关闭的标签页，避免重复创建 */
    f(this, "closedTabs", /* @__PURE__ */ new Set());
    /** 最近关闭的标签页列表 - 按时间倒序存储最近关闭的标签页信息 */
    f(this, "recentlyClosedTabs", []);
    /** 保存的多标签页集合 - 存储用户保存的标签页组合 */
    f(this, "savedTabSets", []);
    /** 记录上一个标签集合 - 用于比较标签页变化 */
    f(this, "previousTabSet", null);
    // ==================== 工作区功能 ====================
    /** 工作区列表 - 存储所有用户创建的工作区 */
    f(this, "workspaces", []);
    /** 当前工作区ID - 标识当前激活的工作区 */
    f(this, "currentWorkspace", null);
    /** 是否启用工作区功能 - 控制工作区功能的开关 */
    f(this, "enableWorkspaces", !0);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    f(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    f(this, "lastActiveBlockId", null);
    // ==================== 快捷键相关 ====================
    /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
    f(this, "hoveredBlockId", null);
    /** 当前右键菜单对应的块引用ID - 用于上下文菜单操作 */
    f(this, "currentContextBlockRefId", null);
    // 防抖函数实例（仅用于拖拽等非关键场景）
    f(this, "draggingDebounce", aa(async () => {
      await this.updateTabsUI();
    }, 200));
    this.pluginName = t;
  }
  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  log(...t) {
    this.logManager.info(t.join(" "));
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...t) {
    this.logManager.verbose(t.join(" "));
  }
  /** 警告日志 - 记录警告信息，提醒潜在问题 */
  warn(...t) {
    this.logManager.warn(t.join(" "));
  }
  /** 错误日志 - 记录错误信息，用于问题诊断 */
  error(...t) {
    this.logManager.error(t.join(" "));
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
    sa(), this.tabStorageService = new wt(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[ot.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFixedToTopMode(), await this.restoreFloatingWindowVisibility();
    const { workspaces: t, enableWorkspaces: e } = await this.tabStorageService.loadWorkspaces();
    this.workspaces = t, this.enableWorkspaces = e, this.registerHeadbarButton(), await this.discoverPanels();
    const a = this.getFirstPanel();
    a ? this.log(`🎯 初始化第1个面板（持久化面板）: ${a}`) : this.log("⚠️ 初始化时没有发现面板"), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization();
    const n = await this.tabStorageService.restoreFirstPanelTabs();
    this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = n, await this.updateRestoredTabsBlockTypes(), this.closedTabs = await this.tabStorageService.restoreClosedTabs(), this.recentlyClosedTabs = await this.tabStorageService.restoreRecentlyClosedTabs(), this.savedTabSets = await this.tabStorageService.restoreSavedTabSets();
    const i = document.querySelector(".orca-panel.active"), o = i == null ? void 0 : i.getAttribute("data-panel-id");
    if (o && !o.startsWith("_") && (this.currentPanelId = o, this.currentPanelIndex = this.getPanelIds().indexOf(o), this.log(`🎯 当前活动面板: ${o} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1) {
      this.log("📂 开始加载其他面板的标签页数据");
      for (let s = 1; s < this.panelOrder.length; s++) {
        const c = `panel_${s + 1}_tabs`;
        try {
          const l = await this.storageService.getConfig(c, this.pluginName, []);
          this.log(`📂 从存储获取到第 ${s + 1} 个面板的数据: ${l ? l.length : 0} 个标签页`), l && l.length > 0 ? (this.panelTabsData[s] = [...l], this.log(`✅ 成功加载第 ${s + 1} 个面板的标签页数据: ${l.length} 个`)) : (this.panelTabsData[s] = [], this.log(`📂 第 ${s + 1} 个面板没有保存的数据`));
        } catch (l) {
          this.warn(`❌ 加载第 ${s + 1} 个面板数据失败:`, l), this.panelTabsData[s] = [];
        }
      }
    }
    if (o && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${o} 的标签页`), await this.scanCurrentPanelTabs();
    else if (o && this.currentPanelIndex === 0) {
      this.log("📋 当前活动面板是第一个面板，使用持久化数据");
      const s = document.querySelector(".orca-panel.active");
      if (s) {
        const c = s.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
        if (c) {
          const l = c.getAttribute("data-block-id");
          l && (this.getCurrentPanelTabs().find((u) => u.blockId === l) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${l}`), await this.checkCurrentPanelBlocks()));
        }
      }
    }
    await this.autoDetectAndSyncCurrentFocus(), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.setupSettingsChecker(), this.isInitialized = !0, this.log("✅ 插件初始化完成");
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
      const t = document.querySelector(".orca-panel.active");
      if (!t) {
        this.log("⚠️ 没有找到当前激活的面板，跳过自动检测");
        return;
      }
      const e = t.getAttribute("data-panel-id");
      if (!e) {
        this.log("⚠️ 激活面板没有 data-panel-id，跳过自动检测");
        return;
      }
      const a = this.getPanelIds().indexOf(e);
      a !== -1 && (this.currentPanelIndex = a, this.currentPanelId = e, this.log(`🔄 更新当前面板索引: ${a} (面板ID: ${e})`));
      const n = t.querySelectorAll('.orca-hideable:not([style*="display: none"])');
      let i = null;
      for (const d of n) {
        if (this.isInsidePopup(d))
          continue;
        const h = d.querySelector(".orca-block-editor[data-block-id]");
        if (h) {
          i = h;
          break;
        }
      }
      if (!i) {
        this.log(`⚠️ 激活面板 ${e} 中没有找到可见的块编辑器，跳过自动检测`);
        return;
      }
      const o = i.getAttribute("data-block-id");
      if (!o) {
        this.log("⚠️ 激活的块编辑器没有blockId，跳过自动检测");
        return;
      }
      this.log(`🔍 检测到当前可见的块ID: ${o}`);
      let s = this.getCurrentPanelTabs();
      s.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), s = this.getCurrentPanelTabs());
      const c = s.find((d) => d.blockId === o);
      if (c) {
        this.log(`📋 当前可见页面已存在于标签页中: "${c.title}" (${o})`), this.updateFocusState(o, c.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功同步已存在的标签页: "${c.title}"`);
        return;
      }
      this.log(`📋 当前可见页面不在标签页中，需要创建新标签页: ${o}`);
      const l = await this.getTabInfo(o, e, 0);
      if (!l) {
        this.log("⚠️ 无法获取块信息，跳过自动检测");
        return;
      }
      if (this.log(`🔍 获取到标签信息: "${l.title}" (类型: ${l.blockType || "unknown"})`), s.length >= this.maxTabs) {
        const d = s.length - 1, h = s[d];
        s[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${h.title}" -> "${l.title}"`);
      } else
        l.order = s.length, s.push(l), this.log(`➕ 添加新标签页到末尾: "${l.title}" (当前标签数: ${s.length}/${this.maxTabs})`);
      this.setCurrentPanelTabs(s), await this.saveCurrentPanelTabs(), this.updateFocusState(o, l.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功创建并同步新标签页: "${l.title}" (${o})`);
    } catch (t) {
      this.error("自动检测当前可见页面时发生错误:", t);
    }
  }
  /**
   * 检查元素是否位于弹窗内
   * 
   * @param element 要检查的元素
   * @returns 如果元素位于弹窗内返回 true，否则返回 false
   */
  isInsidePopup(t) {
    if (t.classList.contains("orca-popup") || t.classList.contains("orca-block-preview-popup"))
      return !0;
    let e = t.parentElement;
    for (; e; ) {
      if (e.classList.contains("orca-popup") || e.classList.contains("orca-block-preview-popup"))
        return !0;
      e = e.parentElement;
    }
    return !1;
  }
  /**
   * 设置主题变化监听器
   */
  setupThemeChangeListener() {
    this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null);
    const t = (i) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", i), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", t), this.log("主题变化监听器注册成功");
    } catch (i) {
      this.error("主题变化监听器注册失败:", i);
    }
    let e = orca.state.themeMode;
    const n = setInterval(() => {
      const i = orca.state.themeMode;
      i !== e && (this.log("备用检测：主题从", e, "切换到", i), e = i, setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 200));
    }, 500);
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", t), clearInterval(n);
    };
  }
  /**
   * 设置滚动监听器
   */
  setupScrollListener() {
    this.scrollListener && (this.scrollListener(), this.scrollListener = null);
    let t = null;
    const e = () => {
      t && clearTimeout(t), t = setTimeout(() => {
        const n = this.getCurrentActiveTab();
        n && this.recordScrollPosition(n);
      }, 300);
    }, a = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    a.forEach((n) => {
      n.addEventListener("scroll", e, { passive: !0 });
    }), this.scrollListener = () => {
      a.forEach((n) => {
        n.removeEventListener("scroll", e);
      }), t && clearTimeout(t);
    };
  }
  /**
   * 设置全局拖拽结束监听器
   */
  setupDragEndListener() {
    this.dragEndListener = () => {
      this.draggingTab = null, this.clearDragVisualFeedback(), this.log("🔄 全局拖拽结束，清除拖拽状态");
    }, document.addEventListener("dragend", this.dragEndListener);
  }
  /**
   * 优化的拖拽监听器设置
   */
  setupOptimizedDragListeners() {
    let t = null;
    this.dragOverListener = (e) => {
      this.draggingTab && (t || (t = requestAnimationFrame(() => {
        t = null;
      })));
    };
  }
  /**
   * 处理拖拽经过事件
   */
  /**
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab").forEach((e) => {
      e.removeAttribute("data-dragging"), e.removeAttribute("data-drag-over"), e.classList.remove("dragging", "drag-over");
    }), this.tabContainer.removeAttribute("data-dragging")), this.clearDropIndicator();
  }
  /**
   * 创建拖拽位置指示器
   */
  createDropIndicator(t, e) {
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
    const n = t.getBoundingClientRect(), i = t.parentElement;
    if (i) {
      const o = i.getBoundingClientRect();
      e === "before" ? (a.style.left = `${n.left - o.left}px`, a.style.top = `${n.top - o.top - 1}px`, a.style.width = `${n.width}px`) : (a.style.left = `${n.left - o.left}px`, a.style.top = `${n.bottom - o.top - 1}px`, a.style.width = `${n.width}px`), i.appendChild(a);
    }
    return a;
  }
  /**
   * 更新拖拽位置指示器
   */
  updateDropIndicator(t, e) {
    this.clearDropIndicator(), this.dropIndicator = this.createDropIndicator(t, e);
  }
  /**
   * 清除拖拽位置指示器
   */
  clearDropIndicator() {
    this.dropIndicator && (this.dropIndicator.remove(), this.dropIndicator = null);
  }
  /**
   * 防抖的标签交换函数（改进版）
   */
  async debouncedSwapTab(t, e) {
    this.lastSwapTarget !== t.blockId && (this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = window.setTimeout(async () => {
      await this.swapTab(t, e), this.lastSwapTarget = t.blockId;
    }, 16));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(t, e) {
    const a = this.getCurrentPanelTabs(), n = a.findIndex((c) => c.blockId === t.blockId), i = a.findIndex((c) => c.blockId === e.blockId);
    if (n === -1 || i === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (n === i) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${e.title} (${i}) -> ${t.title} (${n})`);
    const o = a[i], s = a[n];
    a[n] = o, a[i] = s, a.forEach((c, l) => {
      c.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${o.title} -> 位置 ${n}`);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 面板管理 - Panel Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 发现并更新面板信息
   * 排除特殊面板（如全局搜索面板），只处理正常的内容面板
   */
  async discoverPanels() {
    const t = document.querySelectorAll(".orca-panel"), e = [];
    let a = null;
    t.forEach((i) => {
      const o = i.getAttribute("data-panel-id");
      if (o) {
        if (o.startsWith("_"))
          return;
        e.push(o), i.classList.contains("active") && (a = o);
      }
    });
    const n = this.getPanelIds();
    this.updatePanelOrder(e), this.updateCurrentPanelInfo(a), await this.handlePanelChanges(n, e);
  }
  /**
   * 更新当前面板信息
   */
  updateCurrentPanelInfo(t) {
    if (t) {
      const e = this.panelOrder.findIndex((a) => a.id === t);
      e !== -1 && (this.currentPanelId = t, this.currentPanelIndex = e, this.log(`🔄 当前面板更新: ${t} (索引: ${e}, 序号: ${this.panelOrder[e].order})`));
    } else
      this.currentPanelId = null, this.currentPanelIndex = -1, this.log("🔄 没有激活的面板");
  }
  /**
   * 处理面板变化
   */
  async handlePanelChanges(t, e) {
    const a = t.filter((i) => !e.includes(i));
    a.length > 0 && (this.log("🗑️ 检测到面板被关闭:", a), await this.handlePanelClosure(a));
    const n = e.filter((i) => !t.includes(i));
    n.length > 0 && (this.log("🆕 检测到新面板被打开:", n), this.handleNewPanels(n)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   */
  async handlePanelClosure(t) {
    this.log("🗑️ 处理面板关闭:", t);
    const e = [];
    t.forEach((a) => {
      const n = this.panelOrder.findIndex((i) => i.id === a);
      n !== -1 && e.push(n);
    }), e.sort((a, n) => n - a).forEach((a) => {
      this.panelTabsData.splice(a, 1), this.log(`🗑️ 删除面板 ${t[e.indexOf(a)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((a) => a.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let a = 0; a < this.panelOrder.length; a++) {
      const n = this.panelTabsData[a] || [], i = a === 0 ? y.FIRST_PANEL_TABS : `panel_${a + 1}_tabs`;
      await this.savePanelTabsByKey(i, n);
    }
    this.log("🔄 面板关闭后强制更新UI"), this.debouncedUpdateTabsUI();
  }
  /**
   * 处理新面板
   */
  handleNewPanels(t) {
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
    return this.panelOrder.map((t) => t.id);
  }
  /**
   * 添加面板到顺序映射
   */
  addPanel(t) {
    if (this.panelOrder.find((a) => a.id === t)) {
      this.log(`📋 面板 ${t} 已存在，跳过添加`);
      return;
    }
    const e = this.panelOrder.length + 1;
    this.panelOrder.push({ id: t, order: e }), this.log(`📋 添加面板 ${t}，序号: ${e}`), this.ensurePanelTabsDataSize();
  }
  /**
   * 从顺序映射中删除面板
   */
  removePanel(t) {
    const e = this.panelOrder.findIndex((a) => a.id === t);
    if (e === -1) {
      this.log(`⚠️ 面板 ${t} 不存在，无法删除`);
      return;
    }
    this.panelOrder.splice(e, 1), this.panelOrder.forEach((a, n) => {
      a.order = n + 1;
    }), this.log(`🗑️ 删除面板 ${t}，重新排序后的面板:`, this.panelOrder.map((a) => `${a.id}(${a.order})`)), this.panelTabsData.splice(e, 1);
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
  updatePanelOrder(t) {
    this.getPanelIds(), t.forEach((a) => {
      this.panelOrder.find((n) => n.id === a) || this.addPanel(a);
    }), this.panelOrder.filter((a) => !t.includes(a.id)).forEach((a) => {
      this.removePanel(a.id);
    }), this.log("🔄 面板顺序更新完成:", this.panelOrder.map((a) => `${a.id}(${a.order})`));
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
  isMenuPanel(t) {
    if (t.classList.contains("orca-menu") || t.classList.contains("orca-recents-menu"))
      return !0;
    const e = t.parentElement;
    return !!(e && (e.classList.contains("orca-menu") || e.classList.contains("orca-recents-menu")));
  }
  /**
   * 扫描第一个面板的标签页（扫描所有标签页）
   */
  async scanFirstPanel() {
    if (this.getPanelIds().length === 0) return;
    const t = this.getPanelIds()[0], e = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!e) return;
    const a = e.querySelectorAll(".orca-block-editor[data-block-id]"), n = [];
    let i = 0;
    this.log(`🔍 扫描第一个面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const o of a) {
      const s = o.getAttribute("data-block-id");
      if (!s) continue;
      const c = await this.getTabInfo(s, t, i++);
      c && (n.push(c), this.log(`📋 找到标签页: ${c.title} (${s})`));
    }
    this.panelTabsData[0] = [...n], await this.savePanelTabsByKey(y.FIRST_PANEL_TABS, n), this.log(`📋 第一个面板扫描并保存了 ${n.length} 个标签页`);
  }
  /**
   * 合并第一个面板的标签页（现在只处理单个标签页）
   */
  mergeFirstPanelTabs(t) {
    t.length > 0 && this.sortTabsByPinStatus();
  }
  /**
   * 按固定状态排序标签（固定标签在前，非固定在后）
   */
  sortTabsByPinStatus() {
    const t = this.getCurrentPanelTabs(), e = Ze(t);
    this.setCurrentPanelTabs(e), this.syncCurrentTabsToStorage(e);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const t = this.getCurrentPanelTabs();
    return Qe(t);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(t) {
    return Be(t);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(t) {
    if (!Array.isArray(t) || t.length === 0)
      return !1;
    let e = !1, a = !1, n = !1;
    for (const i of t)
      i && typeof i == "object" && (i.t === "r" && i.v ? (n = !0, i.a || (e = !0)) : i.t === "t" && i.v && (a = !0));
    return e || a && n;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(t) {
    return We(t);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 检测块类型
   */
  async detectBlockType(t) {
    try {
      if (nt(t))
        return "journal";
      if (t["data-type"]) {
        const n = t["data-type"];
        switch (this.log(`🔍 检测到 data-type: ${n}`), n) {
          case "table2":
            return "table";
          case "ul":
            return "list";
          case "ol":
            return "list";
          default:
            this.log(`⚠️ 未知的 data-type: ${n}`);
        }
      }
      if (t.aliases && t.aliases.length > 0) {
        this.log(`🏷️ 检测到别名块: aliases=${JSON.stringify(t.aliases)}`);
        const n = t.aliases[0];
        if (n)
          try {
            const i = this.findProperty(t, "_hide");
            return i && i.value ? (this.log(`📄 通过 _hide 属性确认为页面: ${n} (hide=${i.value})`), "page") : (this.log(`🏷️ 通过 _hide 属性确认为标签: ${n} (hide=${i ? i.value : "undefined"})`), "tag");
          } catch (i) {
            return this.warn("使用 API 检测标签失败，回退到文本分析:", i), n.includes("#") || n.includes("@") || n.length < 20 && n.match(/^[a-zA-Z0-9_-]+$/) || n.match(/^[a-z]+$/i) ? "tag" : "page";
          }
        return "alias";
      }
      this.verboseLog(`🔍 块信息调试: blockId=${t.id}, aliases=${t.aliases ? JSON.stringify(t.aliases) : "undefined"}, content=${t.content ? "exists" : "undefined"}, text=${t.text ? "exists" : "undefined"}`);
      const a = this.findProperty(t, "_repr");
      if (a && a.type === st.JSON && a.value)
        try {
          const n = typeof a.value == "string" ? JSON.parse(a.value) : a.value;
          if (n.type)
            return n.type;
        } catch {
        }
      if (t.content && Array.isArray(t.content)) {
        if (t.content.some(
          (c) => c && typeof c == "object" && c.type === "code"
        ))
          return "code";
        if (t.content.some(
          (c) => c && typeof c == "object" && c.type === "table"
        ))
          return "table";
        if (t.content.some(
          (c) => c && typeof c == "object" && c.type === "image"
        ))
          return "image";
        if (t.content.some(
          (c) => c && typeof c == "object" && c.type === "link"
        ))
          return "link";
      }
      if (t.text) {
        const n = t.text.trim();
        if (n.startsWith("#"))
          return "heading";
        if (n.startsWith("> "))
          return "quote";
        if (n.startsWith("```") || n.startsWith("`"))
          return "code";
        if (n.startsWith("- [ ]") || n.startsWith("- [x]") || n.startsWith("* [ ]") || n.startsWith("* [x]"))
          return "task";
        if (n.includes("|") && n.split(`
`).length > 1)
          return "table";
        if (n.startsWith("- ") || n.startsWith("* ") || n.startsWith("+ ") || /^\d+\.\s/.test(n))
          return "list";
        if (/https?:\/\/[^\s]+/.test(n))
          return "link";
        if (n.includes("$$") || n.includes("$") && n.includes("="))
          return "math";
      }
      return "text";
    } catch (e) {
      return this.warn("检测块类型失败:", e), "text";
    }
  }
  /**
   * 根据块类型获取图标（增强版）
   * 
   * 功能说明：
   * - 支持更多块类型的图标映射
   * - 提供智能图标选择
   * - 支持自定义图标
   * - 提供降级处理
   */
  getBlockTypeIcon(t) {
    const e = {
      // 基础块类型
      journal: "📅",
      // 日期块 - 保持emoji
      alias: "ti ti-tag",
      // 别名块
      page: "ti ti-file-text",
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
    let a = e[t];
    if (!a) {
      const n = this.getSmartIcon(t, e);
      n && (a = n);
    }
    return a || (a = e.default), this.verboseLog(`🎨 为块类型 "${t}" 分配图标: ${a}`), a;
  }
  /**
   * 智能图标选择
   */
  getSmartIcon(t, e) {
    const a = t.toLowerCase(), n = {
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
      parameter: "ti ti-settings",
      default: "ti ti-file"
    };
    for (const [i, o] of Object.entries(n))
      if (a.includes(i))
        return o;
    return null;
  }
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
  getBlockTextTitle(t) {
    try {
      if (t.aliases && t.aliases.length > 0) {
        const e = t.aliases[0];
        if (e && e.trim())
          return this.cleanTitle(e);
      }
      if (t.text) {
        let e = t.text.trim();
        return e = this.processSpecialFormats(e), e = this.cleanTitle(e), e.length > 50 && (e = e.substring(0, 47) + "..."), e;
      }
      if (t.content && Array.isArray(t.content)) {
        const e = this.extractTextFromContentSync(t.content);
        if (e && e.trim()) {
          let a = e.trim();
          return a = this.processSpecialFormats(a), a = this.cleanTitle(a), a.length > 50 && (a = a.substring(0, 47) + "..."), a;
        }
      }
      return `块 ${t.id || "未知"}`;
    } catch (e) {
      return this.error("获取块标题时发生错误:", e), `块 ${t.id || "未知"}`;
    }
  }
  /**
   * 处理特殊格式的标题
   */
  processSpecialFormats(t) {
    return t = t.replace(/^#+\s*/, ""), t = t.replace(/^\*\*|\*\*$/g, ""), t = t.replace(/^\*|\*$/g, ""), t = t.replace(/^`|`$/g, ""), t = t.replace(/^>+\s*/, ""), t = t.replace(/^[-*+]\s*/, ""), t = t.replace(/^\d+\.\s*/, ""), t = t.replace(/^\[[x ]\]\s*/, ""), t;
  }
  /**
   * 清理标题
   */
  cleanTitle(t) {
    return t = t.replace(/\s+/g, " ").trim(), t = t.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s\-_.,!?()（）]/g, ""), t;
  }
  /**
   * 同步从内容中提取文本
   */
  extractTextFromContentSync(t) {
    if (!Array.isArray(t))
      return "";
    const e = [];
    for (const a of t)
      if (typeof a == "string")
        e.push(a);
      else if (a && typeof a == "object") {
        if (a.t === "text" && a.v)
          e.push(a.v);
        else if (a.text)
          e.push(a.text);
        else if (a.content) {
          const n = this.extractTextFromContentSync(a.content);
          n && e.push(n);
        }
      }
    return e.join("");
  }
  /**
   * 使用指定模式格式化日期
   */
  formatDateWithPattern(t, e) {
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const n = t.getDay(), o = ["日", "一", "二", "三", "四", "五", "六"][n], s = e.replace(/E/g, o);
          return M(t, s);
        } else
          return M(t, e);
      else
        return M(t, e);
    } catch {
      const n = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of n)
        try {
          return M(t, i);
        } catch {
          continue;
        }
      return t.toISOString().split("T")[0];
    }
  }
  /**
   * 在块的properties中查找指定名称的属性
   */
  findProperty(t, e) {
    return !t.properties || !Array.isArray(t.properties) ? null : t.properties.find((a) => a.name === e);
  }
  /**
   * 检查字符串是否是日期格式
   */
  isDateString(t) {
    return [
      /^\d{4}-\d{2}-\d{2}$/,
      // YYYY-MM-DD
      /^\d{4}\/\d{2}\/\d{2}$/,
      // YYYY/MM/DD
      /^\d{2}\/\d{2}\/\d{4}$/,
      // MM/DD/YYYY
      /^\d{4}-\d{2}-\d{2}T/
      // ISO format start
    ].some((a) => a.test(t));
  }
  async getTabInfo(t, e, a) {
    try {
      const n = await orca.invokeBackend("get-block", parseInt(t));
      if (!n) return null;
      let i = "", o = "", s = "", c = !1, l = "";
      l = await this.detectBlockType(n), this.log(`🔍 检测到块类型: ${l} (块ID: ${t})`), n.aliases && n.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${t}, aliases=${JSON.stringify(n.aliases)}, 检测到的类型=${l}`);
      try {
        const d = nt(n);
        if (d)
          c = !0, i = De(d);
        else if (n.aliases && n.aliases.length > 0)
          i = n.aliases[0];
        else if (n.content && n.content.length > 0)
          this.needsContentConcatenation(n.content) && n.text ? i = n.text.substring(0, 50) : i = (await this.extractTextFromContent(n.content)).substring(0, 50);
        else if (n.text) {
          let h = n.text.substring(0, 50);
          if (l === "list") {
            const u = n.text.split(`
`)[0].trim();
            u && (h = u.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (l === "table") {
            const u = n.text.split(`
`)[0].trim();
            u && (h = u.replace(/\|/g, "").trim());
          } else if (l === "quote") {
            const u = n.text.split(`
`)[0].trim();
            u && (h = u.replace(/^>\s+/, ""));
          } else if (l === "image") {
            const u = n.text.match(/caption:\s*(.+)/i);
            u && u[1] ? h = u[1].trim() : h = n.text.trim();
          }
          i = h;
        } else
          i = `块 ${t}`;
      } catch (d) {
        this.warn("获取标题失败:", d), i = `块 ${t}`;
      }
      try {
        const d = this.findProperty(n, "_color"), h = this.findProperty(n, "_icon");
        d && d.type === 1 && (o = d.value), h && h.type === 1 ? (s = h.value, this.log(`🎨 使用用户自定义图标: ${s} (块ID: ${t})`)) : (this.showBlockTypeIcons || l === "journal") && (s = this.getBlockTypeIcon(l), this.log(`🎨 使用块类型图标: ${s} (块类型: ${l}, 块ID: ${t})`));
      } catch (d) {
        this.warn("获取属性失败:", d), s = this.getBlockTypeIcon(l);
      }
      return {
        blockId: t,
        panelId: e,
        title: i || `块 ${t}`,
        color: o,
        icon: s,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: a,
        blockType: l
      };
    } catch (n) {
      return this.error("获取标签信息失败:", n), null;
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
    const t = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)";
    let e, a, n;
    if (this.isFixedToTop ? (e = { x: 0, y: 0 }, a = !1, n = window.innerWidth) : (e = this.isVerticalMode ? this.verticalPosition : this.position, a = this.isVerticalMode, n = this.verticalWidth), this.tabContainer = ra(
      a,
      e,
      n,
      t
    ), this.isFixedToTop) {
      const o = document.querySelector(".headbar") || document.querySelector(".toolbar") || document.querySelector(".top-bar") || document.querySelector('[class*="head"]') || document.querySelector('[class*="toolbar"]') || document.querySelector('[class*="bar"]') || document.body;
      this.log("🔍 查找顶部工具栏:", {
        headbar: (o == null ? void 0 : o.className) || (o == null ? void 0 : o.tagName),
        headbarExists: !!o,
        bodyChildren: document.body.children.length
      }), o.appendChild(this.tabContainer), o === document.body ? this.tabContainer.style.cssText += `
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
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--orca-radius-md);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin: 0 4px;
          padding: 0 8px;
          gap: 4px;
        `, this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${o.className || o.tagName}`);
    } else
      document.body.appendChild(this.tabContainer);
    this.tabContainer.addEventListener("mousedown", (o) => {
      const s = o.target;
      s.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && o.stopPropagation();
    }), this.tabContainer.addEventListener("click", (o) => {
      const s = o.target;
      s.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && o.stopPropagation();
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
    const t = document.createElement("style");
    t.id = "orca-tabs-drag-styles", t.textContent = `
      /* CSS变量定义 - 支持主题自动切换 */
      :root {
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(0 0 0 / 10%));
        --orca-tab-border: rgba(0, 0, 0, 0.1);
        --orca-tab-hover-border: rgba(0, 0, 0, 0.2);
        --orca-tab-active-border: rgba(0, 0, 0, 0.3);
        --orca-tab-container-bg: rgba(255, 255, 255, 0.1);
        --orca-input-bg: rgba(200, 200, 200, 0.6);
      }
      
      /* 暗色模式的CSS变量 */
      :root[data-theme="dark"],
      .dark {
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(0 0 0 / 40%));
        --orca-tab-border: rgba(255, 255, 255, 0.2);
        --orca-tab-hover-border: rgba(255, 255, 255, 0.3);
        --orca-tab-active-border: rgba(255, 255, 255, 0.4);
        --orca-input-bg: rgba(255, 255, 255, 0.1);
      }
      
      /* 有颜色标签的CSS变量 */
      .orca-tabs-plugin .orca-tab {
        --orca-tab-colored-bg: oklch(from var(--tab-color, #3b82f6) calc(l * 0.8) calc(c * 1.5) h / 25%);
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 0.6) c h);
      }
      
      /* 暗色模式下有颜色标签的CSS变量 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab,
      .dark .orca-tabs-plugin .orca-tab {
        --orca-tab-colored-text: oklch(from var(--tab-color, #3b82f6) calc(l * 1.6) c h);
      }
      
      /* 拖拽中的标签样式 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-tabs-plugin .orca-tab[data-dragging="true"] {
        border: 2px solid #ef4444;
        margin: 0 12px;
        transform: rotate(2deg);
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        z-index: 1000;
        position: relative;
        opacity: 0.3;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
        transition: opacity 0.2s ease;
      }

      /* 拖拽悬停目标样式 */
      .orca-tabs-plugin .orca-tab[data-drag-over="true"] {
        border: 2px solid var(--orca-color-primary-5);
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

      /* 拖拽容器状态 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-tabs-plugin .orca-tabs-container[data-dragging="true"] {
        background-color: var(--orca-color-bg-1);
        border: 2px dashed rgba(239, 68, 68, 0.4);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      /* 拖拽时的过渡动画 */
      .orca-tabs-plugin .orca-tab {
        transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: transform, box-shadow, background, opacity, border;
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
        transform: scale(1.02) !important;
        transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的悬停样式 - 通过CSS变量自动应用，但排除聚焦状态 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]),
      .dark .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
      }

      /* 点击/激活状态的标签样式 - 使用CSS变量自动响应主题变化，但排除聚焦状态 */
      .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        opacity: 1 !important;
        border: 1px solid var(--orca-tab-active-border) !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
        transform: scale(0.98) !important;
        transition: all 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的点击样式 - 通过CSS变量自动应用，但排除聚焦状态 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]),
      .dark .orca-tabs-plugin .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        box-shadow: 0 1px 4px rgba(255, 255, 255, 0.2) !important;
      }

      /* 聚焦状态的标签样式 */
      .orca-tabs-plugin .orca-tab[data-focused="true"] {
        opacity: 1 !important;
        border: 2px solid var(--orca-color-primary-5) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--orca-color-primary-5), transparent 80%), 0 2px 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%) !important;
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 90%) !important;
        transform: scale(1.02) !important;
        transition: all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的聚焦样式 */
      .dark .orca-tabs-plugin .orca-tab[data-focused="true"] {
        border: 2px solid var(--orca-color-primary-5) !important;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--orca-color-primary-5), transparent 70%), 0 2px 8px color-mix(in srgb, var(--orca-color-primary-5), transparent 80%) !important;
        background: color-mix(in srgb, var(--orca-color-primary-5), transparent 85%) !important;
      }

      /* 拖拽时的光标样式 */
      .orca-tabs-plugin .orca-tab[draggable="true"] {
        cursor: pointer;
      }

      .orca-tabs-plugin .orca-tab[draggable="true"]:active {
        cursor: pointer;
      }

      /* 拖拽时的标签容器动画 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-tabs-plugin .orca-tabs-container[data-dragging="true"] .orca-tabs-plugin .orca-tab:not([data-dragging="true"]) {
        transition: all 0.2s ease;
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
    `, document.head.appendChild(t), this.log("✅ 拖拽样式已添加");
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
    const t = Date.now();
    try {
      if (t - this.lastUpdateTime < 50)
        return;
      this.lastUpdateTime = t;
      const e = this.tabContainer.querySelector(".drag-handle"), a = this.tabContainer.querySelector(".new-tab-button"), n = this.tabContainer.querySelector(".workspace-button");
      this.tabContainer.innerHTML = "", e && this.tabContainer.appendChild(e);
      let i = this.currentPanelId, o = this.currentPanelIndex;
      if (!i && this.panelOrder.length > 0 && (i = this.panelOrder[0].id, o = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${i}`)), i) {
        this.log(`📋 显示面板 ${i} 的标签页`);
        let s = this.panelTabsData[o] || [];
        s.length === 0 && (this.log(`🔍 面板 ${i} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(o, i), s = this.panelTabsData[o] || []), this.sortTabsByPinStatus(), s.forEach((c, l) => {
          var h;
          const d = this.createTabElement(c);
          (h = this.tabContainer) == null || h.appendChild(d);
        });
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.addWorkspaceButton(), this.isFixedToTop) {
        const s = "var(--orca-tab-bg)", c = "var(--orca-tab-border)", l = "var(--orca-color-text-1)", d = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        d.forEach((u) => {
          const g = u.getAttribute("data-tab-id");
          if (!g) return;
          const m = this.getCurrentPanelTabs().find((p) => p.blockId === g);
          if (m) {
            let p, x, v = "normal";
            if (p = "var(--orca-tab-bg)", x = "var(--orca-color-text-1)", m.color)
              try {
                u.style.setProperty("--tab-color", m.color), p = "var(--orca-tab-colored-bg)", x = "var(--orca-tab-colored-text)", v = "600";
              } catch {
              }
            u.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${p};
            border-radius: var(--orca-radius-md);
            border: 1px solid ${c};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${x};
            font-weight: ${v};
            max-width: 100px;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            -webkit-app-region: no-drag;
            app-region: no-drag;
            pointer-events: auto;
          `;
          }
        });
        const h = this.tabContainer.querySelector(".new-tab-button");
        h && (h.style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${s};
          border-radius: var(--orca-radius-md);
          border: 1px solid ${c};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${l};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${d.length}`);
      }
    } catch (e) {
      this.error("更新UI时发生错误:", e);
    } finally {
      this.isUpdating = !1;
    }
  }
  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || !this.tabContainer) return;
    let t = this.getCurrentPanelTabs();
    t.length === 0 && (await this.scanCurrentPanelTabs(), t = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${t.length} 个标签页`);
    const e = document.createDocumentFragment();
    if (t.length > 0)
      t.forEach((a, n) => {
        const i = this.createTabElement(a);
        e.appendChild(i);
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
      const n = this.currentPanelIndex + 1;
      a.textContent = `面板 ${n}（无标签页）`, a.title = `当前在面板 ${n}，该面板没有标签页`, e.appendChild(a);
    }
    this.tabContainer.appendChild(e), this.addNewTabButton();
  }
  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || !this.tabContainer) return;
    let t = this.getCurrentPanelTabs();
    t.length === 0 && (await this.checkCurrentPanelBlocks(), t = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${t.length} 个标签页`);
    const e = document.createDocumentFragment();
    if (t.length > 0)
      t.forEach((a, n) => {
        const i = this.createTabElement(a);
        e.appendChild(i);
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
      const n = this.currentPanelIndex + 1;
      a.textContent = `面板 ${n}（无标签页）`, a.title = `当前在面板 ${n}，该面板没有标签页`, e.appendChild(a);
    }
    this.tabContainer.appendChild(e), this.addNewTabButton();
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
    const e = document.createElement("div");
    e.className = "new-tab-button";
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
    e.style.cssText = a, e.innerHTML = "+", e.title = "新建标签页", e.addEventListener("mouseenter", () => {
      e.style.background = "rgba(0, 0, 0, 0.1)", e.style.color = "#333";
    }), e.addEventListener("mouseleave", () => {
      e.style.background = "transparent", e.style.color = "#666";
    }), e.addEventListener("click", async (n) => {
      n.preventDefault(), n.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(e), this.addNewTabButtonContextMenu(e), this.enableWorkspaces && this.addWorkspaceButton();
  }
  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    var n;
    if (!this.tabContainer || this.tabContainer.querySelector(".workspace-button")) return;
    const e = document.createElement("div");
    e.className = "workspace-button";
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
    e.style.cssText = a, e.innerHTML = "📁", e.title = `工作区 (${((n = this.workspaces) == null ? void 0 : n.length) || 0})`, e.addEventListener("mouseenter", () => {
      e.style.background = "rgba(0, 0, 0, 0.1)", e.style.color = "#333";
    }), e.addEventListener("mouseleave", () => {
      e.style.background = "transparent", e.style.color = "#666";
    }), e.addEventListener("click", (i) => {
      i.preventDefault(), i.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(i);
    }), this.tabContainer.appendChild(e);
  }
  /**
   * 为新建标签页按钮添加右键菜单
   */
  addNewTabButtonContextMenu(t) {
    t.addEventListener("contextmenu", (e) => {
      e.preventDefault(), e.stopPropagation(), this.showNewTabButtonContextMenu(e);
    });
  }
  /**
   * 显示新建标签页按钮的右键菜单
   */
  showNewTabButtonContextMenu(t) {
    var h, u;
    const e = document.querySelector(".new-tab-context-menu");
    e && e.remove();
    const a = document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark") || ((u = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : u.themeMode) === "dark", n = document.createElement("div");
    n.className = "new-tab-context-menu";
    const i = 200, o = 140;
    let s = t.clientX, c = t.clientY;
    s + i > window.innerWidth && (s = window.innerWidth - i - 10), c + o > window.innerHeight && (c = window.innerHeight - o - 10), s = Math.max(10, s), c = Math.max(10, c), n.style.cssText = `
      position: fixed;
      left: ${s}px;
      top: ${c}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: ${i}px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const l = [
      {
        text: "新建标签页",
        action: () => this.createNewTab(),
        icon: "+"
      }
    ];
    this.isFixedToTop && l.push(
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
    ), this.isFixedToTop || l.push(
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
    ), !this.isVerticalMode && !this.isFixedToTop && l.push(
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
    ), this.isVerticalMode && !this.isFixedToTop && l.push(
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
    ), this.isFixedToTop || l.push(
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
    ), this.enableMultiTabSaving && l.push(
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
    ), l.forEach((g) => {
      if (g.separator) {
        const p = document.createElement("div");
        p.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, n.appendChild(p);
        return;
      }
      const b = document.createElement("div");
      if (b.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: ${a ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
      `, g.icon) {
        const p = document.createElement("span");
        p.textContent = g.icon, p.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, b.appendChild(p);
      }
      const m = document.createElement("span");
      m.textContent = g.text, b.appendChild(m), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.addEventListener("click", () => {
        g.action && g.action(), n.remove();
      }), n.appendChild(b);
    }), document.body.appendChild(n);
    const d = (g) => {
      n.contains(g.target) || (n.remove(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
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
    } catch (t) {
      this.error("切换布局模式失败:", t);
    }
  }
  /**
   * 切换固定到顶部模式
   */
  async toggleFixedToTop() {
    try {
      this.log(`🔄 切换固定到顶部: ${this.isFixedToTop ? "取消固定" : "固定到顶部"}`), this.isFixedToTop = !this.isFixedToTop, await this.saveFixedToTopMode(), await this.createTabsUI(), this.log(`✅ 固定到顶部已${this.isFixedToTop ? "启用" : "禁用"}`);
    } catch (t) {
      this.error("切换固定到顶部失败:", t);
    }
  }
  /**
   * 切换侧边栏对齐状态
   */
  async toggleSidebarAlignment() {
    try {
      this.isSidebarAlignmentEnabled ? await this.disableSidebarAlignment() : await this.enableSidebarAlignment();
    } catch (t) {
      this.error("切换侧边栏对齐失败:", t);
    }
  }
  /**
   * 启用侧边栏对齐功能
   */
  async enableSidebarAlignment() {
    try {
      this.log("🚀 启用侧边栏对齐功能");
      const t = this.getSidebarWidth();
      if (this.log(`📏 读取到的侧边栏宽度: ${t}px`), t === 0) {
        this.log("⚠️ 无法读取侧边栏宽度，操作终止");
        return;
      }
      this.isSidebarAlignmentEnabled = !0, this.startSidebarAlignmentObserver(), this.log("✅ 侧边栏对齐功能已启用，标签栏保持在当前位置");
    } catch (t) {
      this.error("启用侧边栏对齐失败:", t);
    }
  }
  /**
   * 禁用侧边栏对齐功能
   */
  async disableSidebarAlignment() {
    try {
      this.log("🔴 禁用侧边栏对齐功能"), this.stopSidebarAlignmentObserver(), await this.performSidebarAlignment(), this.isSidebarAlignmentEnabled = !1, this.log("🔴 侧边栏对齐功能已禁用");
    } catch (t) {
      this.error("禁用侧边栏对齐失败:", t);
    }
  }
  /**
   * 开始监听侧边栏状态变化（使用 MutationObserver）
   */
  startSidebarAlignmentObserver() {
    this.stopSidebarAlignmentObserver(), this.updateLastSidebarState();
    const t = document.querySelector("div#app");
    if (!t) {
      this.log("⚠️ 未找到 div#app 元素，无法监听侧边栏状态变化");
      return;
    }
    this.sidebarAlignmentObserver = new MutationObserver((e) => {
      e.some(
        (n) => n.type === "attributes" && n.attributeName === "class"
      ) && (this.log("🔄 检测到 div#app class 变化，立即检查侧边栏状态"), this.checkSidebarStateChangeImmediate());
    }), this.sidebarAlignmentObserver.observe(t, {
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
    const t = document.querySelector("div#app");
    if (!t) {
      this.lastSidebarState = null;
      return;
    }
    const e = t.classList.contains("sidebar-closed"), a = t.classList.contains("sidebar-opened");
    e ? this.lastSidebarState = "closed" : a ? this.lastSidebarState = "opened" : this.lastSidebarState = "unknown";
  }
  /**
   * 立即检查侧边栏状态变化（无防抖）
   */
  checkSidebarStateChangeImmediate() {
    if (!this.isSidebarAlignmentEnabled) return;
    const t = document.querySelector("div#app");
    if (!t) return;
    const e = t.classList.contains("sidebar-closed"), a = t.classList.contains("sidebar-opened");
    let n;
    e ? n = "closed" : a ? n = "opened" : n = "unknown", this.lastSidebarState !== n && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${n}`), this.lastSidebarState = n, this.autoAdjustSidebarAlignment());
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
      const t = this.getSidebarWidth();
      if (t === 0) return;
      const e = document.querySelector("div#app");
      if (!e) return;
      const a = e.classList.contains("sidebar-closed"), n = e.classList.contains("sidebar-opened");
      if (!a && !n) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const i = this.getCurrentPosition();
      if (!i) return;
      const o = this.calculateSidebarAlignmentPosition(
        i,
        t,
        a,
        n
      );
      if (!o) return;
      await this.updatePosition(o), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${i.x}, ${i.y}) → (${o.x}, ${o.y})`);
    } catch (t) {
      this.error("侧边栏对齐失败:", t);
    }
  }
  /**
   * 获取当前位置
   */
  getCurrentPosition() {
    if (this.tabContainer) {
      const t = this.tabContainer.getBoundingClientRect();
      return { x: t.left, y: t.top };
    }
    return this.isVerticalMode ? { x: this.verticalPosition.x, y: this.verticalPosition.y } : { x: this.position.x, y: this.position.y };
  }
  /**
   * 计算侧边栏对齐后的位置
   */
  calculateSidebarAlignmentPosition(t, e, a, n) {
    var o;
    let i;
    if (a)
      i = Math.max(10, t.x - e), this.log(`📐 侧边栏关闭，向左移动 ${e}px: ${t.x}px → ${i}px`);
    else if (n) {
      i = t.x + e;
      const s = ((o = this.tabContainer) == null ? void 0 : o.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      i = Math.min(i, window.innerWidth - s - 10), this.log(`📐 侧边栏打开，向右移动 ${e}px: ${t.x}px → ${i}px`);
    } else
      return null;
    return { x: i, y: t.y };
  }
  /**
   * 更新位置到内存并保存
   */
  async updatePosition(t) {
    this.isVerticalMode ? (this.verticalPosition.x = t.x, this.verticalPosition.y = t.y, await this.saveLayoutMode(), this.log(`📍 垂直模式位置已更新: (${t.x}, ${t.y})`)) : (this.position.x = t.x, this.position.y = t.y, await this.savePosition(), this.log(`📍 水平模式位置已更新: (${t.x}, ${t.y})`));
  }
  /**
   * 切换浮窗显示/隐藏状态
   */
  async toggleFloatingWindow() {
    try {
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), this.registerHeadbarButton(), await this.tabStorageService.saveFloatingWindowVisible(this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("切换浮窗状态失败:", t);
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
        const t = window.React, e = orca.components.Button;
        return t.createElement(e, {
          variant: "plain",
          onClick: () => this.toggleFloatingWindow(),
          title: this.isFloatingWindowVisible ? "隐藏标签栏" : "显示标签栏",
          style: {
            color: this.isFloatingWindowVisible ? "#666" : "#999",
            transition: "color 0.2s ease"
          }
        }, t.createElement("i", {
          className: this.isFloatingWindowVisible ? "ti ti-eye" : "ti ti-eye-off"
        }));
      }), this.showInHeadbar && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.debugButton`, () => {
        const t = window.React, e = orca.components.Button;
        return t.createElement(e, {
          variant: "plain",
          onClick: () => this.toggleBlockTypeIcons(),
          title: this.showBlockTypeIcons ? "隐藏块类型图标" : "显示块类型图标",
          style: {
            color: this.showBlockTypeIcons ? "#007acc" : "#999",
            transition: "color 0.2s ease"
          }
        }, t.createElement("i", {
          className: this.showBlockTypeIcons ? "ti ti-palette" : "ti ti-palette-off"
        }));
      }), this.enableRecentlyClosedTabs && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.recentlyClosedButton`, () => {
        var a, n;
        const t = window.React, e = orca.components.Button;
        return t.createElement(e, {
          variant: "plain",
          onClick: (i) => this.showRecentlyClosedTabsMenu(i),
          title: `最近关闭的标签页 (${((a = this.recentlyClosedTabs) == null ? void 0 : a.length) || 0})`,
          style: {
            color: (((n = this.recentlyClosedTabs) == null ? void 0 : n.length) || 0) > 0 ? "#ff6b6b" : "#999",
            transition: "color 0.2s ease"
          }
        }, t.createElement("i", {
          className: "ti ti-history"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.savedTabsButton`, () => {
        var a, n;
        const t = window.React, e = orca.components.Button;
        return t.createElement(e, {
          variant: "plain",
          onClick: (i) => this.showSavedTabSetsMenu(i),
          title: `保存的标签页集合 (${((a = this.savedTabSets) == null ? void 0 : a.length) || 0})`,
          style: {
            color: (((n = this.savedTabSets) == null ? void 0 : n.length) || 0) > 0 ? "#3b82f6" : "#999",
            transition: "color 0.2s ease"
          }
        }, t.createElement("i", {
          className: "ti ti-bookmark"
        }));
      }), this.log(`🔘 顶部工具栏按钮已注册 (切换按钮: 总是显示, 调试按钮: ${this.showInHeadbar ? "显示" : "隐藏"}, 最近关闭: ${this.enableRecentlyClosedTabs ? "显示" : "隐藏"}, 保存标签页: ${this.enableMultiTabSaving ? "显示" : "隐藏"})`);
    } catch (t) {
      this.error("注册顶部工具栏按钮失败:", t);
    }
  }
  /**
   * 注销顶部工具栏按钮
   */
  unregisterHeadbarButton() {
    try {
      orca.headbar.unregisterHeadbarButton(`${this.pluginName}.toggleButton`), orca.headbar.unregisterHeadbarButton(`${this.pluginName}.debugButton`), orca.headbar.unregisterHeadbarButton(`${this.pluginName}.recentlyClosedButton`), orca.headbar.unregisterHeadbarButton(`${this.pluginName}.savedTabsButton`), this.log("🔘 顶部工具栏按钮已注销");
    } catch (t) {
      this.error("注销顶部工具栏按钮失败:", t);
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
    } catch (t) {
      this.error("保存设置失败:", t);
    }
  }
  /**
   * 更新所有标签页的块类型和图标
   */
  async updateAllTabsBlockTypes() {
    this.log("🔄 开始更新所有标签页的块类型和图标...");
    const t = this.getCurrentPanelTabs();
    if (t.length === 0) {
      this.log("⚠️ 没有标签页需要更新");
      return;
    }
    let e = !1;
    for (let a = 0; a < t.length; a++) {
      const n = t[a];
      try {
        const i = await orca.invokeBackend("get-block", parseInt(n.blockId));
        if (i) {
          const o = await this.detectBlockType(i), s = this.findProperty(i, "_color"), c = this.findProperty(i, "_icon");
          let l = n.color, d = n.icon;
          s && s.type === 1 && (l = s.value), c && c.type === 1 ? d = c.value : d || (d = this.getBlockTypeIcon(o)), n.blockType !== o || n.icon !== d || n.color !== l ? (t[a] = {
            ...n,
            blockType: o,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${n.title} -> 类型: ${o}, 图标: ${d}, 颜色: ${l}`), e = !0) : this.verboseLog(`⏭️ 跳过标签: ${n.title} (无需更新)`);
        }
      } catch (i) {
        this.warn(`更新标签失败: ${n.title}`, i);
      }
    }
    e ? (this.log("🔄 检测到更新，保存数据并重新创建UI..."), this.setCurrentPanelTabs(t), await this.createTabsUI()) : this.log("ℹ️ 没有标签页需要更新"), this.log("✅ 所有标签页的块类型和图标已更新");
  }
  /**
   * 对齐到侧边栏（手动触发）
   */
  async alignToSidebar() {
    try {
      this.log("🎯 手动触发侧边栏对齐"), await this.performSidebarAlignment();
    } catch (t) {
      this.error("对齐到侧边栏失败:", t);
    }
  }
  /**
   * 获取侧边栏宽度
   */
  getSidebarWidth() {
    try {
      this.log("🔍 开始获取侧边栏宽度...");
      const t = document.querySelector("nav#sidebar");
      if (this.log(`   查找 nav#sidebar 元素: ${t ? "找到" : "未找到"}`), !t)
        return this.log("⚠️ 未找到 nav#sidebar 元素"), 0;
      this.log("   侧边栏元素信息:"), this.log(`     - ID: ${t.id}`), this.log(`     - 类名: ${t.className}`), this.log(`     - 标签名: ${t.tagName}`);
      const a = window.getComputedStyle(t).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${a}"`), a && a !== "") {
        const i = parseInt(a.replace("px", ""));
        if (isNaN(i))
          this.log(`⚠️ CSS变量值无法解析为数字: "${a}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${i}px`), i;
      } else
        this.log("⚠️ CSS变量 --orca-sidebar-width 不存在或为空");
      this.log("   尝试获取实际宽度...");
      const n = t.getBoundingClientRect();
      return this.log(`   实际尺寸: width=${n.width}px, height=${n.height}px`), n.width > 0 ? (this.log(`✅ 从实际尺寸获取侧边栏宽度: ${n.width}px`), n.width) : (this.log("⚠️ 无法获取侧边栏宽度，所有方法都失败"), 0);
    } catch (t) {
      return this.error("获取侧边栏宽度失败:", t), 0;
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
  handleResizeStart(t) {
    if (t.preventDefault(), t.stopPropagation(), !this.tabContainer) return;
    const e = t.clientX, a = this.verticalWidth, n = async (o) => {
      const s = o.clientX - e, c = Math.max(120, Math.min(400, a + s));
      this.verticalWidth = c;
      try {
        orca.nav.changeSizes(orca.state.activePanel, [c]), this.tabContainer.style.width = `${c}px`;
      } catch (l) {
        this.error("调整面板宽度失败:", l);
      }
    }, i = async () => {
      document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", i);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (o) {
        this.error("保存宽度设置失败:", o);
      }
    };
    document.addEventListener("mousemove", n), document.addEventListener("mouseup", i);
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
    const t = document.querySelector(".width-adjustment-dialog");
    t && t.remove();
    const e = this.verticalWidth, a = oa(
      this.verticalWidth,
      async (n) => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [n]), this.tabContainer && (this.tabContainer.style.width = `${n}px`), this.verticalWidth = n, await this.saveLayoutMode();
        } catch (i) {
          this.error("实时调整面板宽度失败:", i);
        }
      },
      async () => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [e]), this.tabContainer && (this.tabContainer.style.width = `${e}px`), this.verticalWidth = e;
        } catch (n) {
          this.error("恢复面板宽度失败:", n);
        }
      }
    );
    document.body.appendChild(a);
  }
  /**
   * 更新垂直模式宽度
   */
  async updateVerticalWidth(t) {
    try {
      this.verticalWidth = t, await this.saveLayoutMode(), await this.createTabsUI(), this.log(`📏 垂直模式宽度已更新为: ${t}px`);
    } catch (e) {
      this.error("更新宽度失败:", e);
    }
  }
  /**
   * 创建标签元素
   */
  createTabElement(t) {
    this.verboseLog(`🔧 创建标签元素: ${t.title} (ID: ${t.blockId})`);
    const e = document.createElement("div");
    e.className = "orca-tab", e.setAttribute("data-tab-id", t.blockId), this.isTabActive(t) && e.setAttribute("data-focused", "true");
    const n = this.isVerticalMode && !this.isFixedToTop, i = ze(t, n);
    e.style.cssText = i;
    const o = Fe();
    if (t.icon && this.showBlockTypeIcons) {
      const c = Re(t.icon);
      o.appendChild(c);
    }
    const s = qe(t.title);
    if (o.appendChild(s), t.isPinned) {
      const c = _e();
      o.appendChild(c);
    }
    return e.appendChild(o), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), e.title = Ue(t), e.addEventListener("click", (c) => {
      var d;
      c.preventDefault(), this.log(`🖱️ 点击标签: ${t.title} (ID: ${t.blockId})`), this.closedTabs.has(t.blockId) && (this.closedTabs.delete(t.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${t.title}"，从已关闭列表中移除`));
      const l = (d = this.tabContainer) == null ? void 0 : d.querySelectorAll(".orca-tabs-plugin .orca-tab");
      l == null || l.forEach((h) => h.removeAttribute("data-focused")), e.setAttribute("data-focused", "true"), this.switchToTab(t);
    }), e.addEventListener("mousedown", (c) => {
    }), e.addEventListener("dblclick", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.toggleTabPinStatus(t);
    }), e.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.closeTab(t));
    }), e.addEventListener("keydown", (c) => {
      (c.target === e || e.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(t)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(t)));
    }), this.addOrcaContextMenu(e, t), e.draggable = !0, e.addEventListener("dragstart", (c) => {
      var d;
      if (c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", (d = c.dataTransfer) == null || d.setData("text/plain", t.blockId), this.draggingTab = t, this.lastSwapTarget = null, this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (console.log("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), console.log("🔄 拖拽开始，设置draggingTab:", t.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), e.setAttribute("data-dragging", "true"), e.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${t.title} (ID: ${t.blockId})`);
    }), e.addEventListener("dragend", (c) => {
      console.log("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (console.log("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${t.title}`);
    }), e.addEventListener("dragover", (c) => {
      if (!c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== t.blockId) {
        if (c.preventDefault(), c.stopPropagation(), c.dataTransfer.dropEffect = "move", !this.dragOverTab || this.dragOverTab.blockId !== t.blockId) {
          const d = e.getBoundingClientRect(), h = d.top + d.height / 2, u = c.clientY < h ? "before" : "after";
          this.updateDropIndicator(e, u), this.dragOverTab = t;
        }
        this.debouncedSwapTab(t, this.draggingTab), this.verboseLog(`🔄 拖拽经过: ${t.title} (目标: ${this.draggingTab.title})`);
      }
    }), e.addEventListener("dragenter", (c) => {
      c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== t.blockId && (c.preventDefault(), c.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${t.title}`));
    }), e.addEventListener("dragleave", (c) => {
      const l = e.getBoundingClientRect(), d = c.clientX, h = c.clientY, u = 5;
      (d < l.left - u || d > l.right + u || h < l.top - u || h > l.bottom + u) && this.verboseLog(`🔄 拖拽离开: ${t.title}`);
    }), e.addEventListener("drop", (c) => {
      var d;
      c.preventDefault();
      const l = (d = c.dataTransfer) == null ? void 0 : d.getData("text/plain");
      this.log(`🔄 拖拽放置: ${l} -> ${t.blockId}`);
    }), e;
  }
  hexToRgba(t, e) {
    return Oe(t, e);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(t) {
    const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (e) {
      const a = parseInt(e[1], 16), n = parseInt(e[2], 16), i = parseInt(e[3], 16);
      return (0.299 * a + 0.587 * n + 0.114 * i) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(t, e) {
    const a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (a) {
      let n = parseInt(a[1], 16), i = parseInt(a[2], 16), o = parseInt(a[3], 16);
      n = Math.floor(n * (1 - e)), i = Math.floor(i * (1 - e)), o = Math.floor(o * (1 - e));
      const s = n.toString(16).padStart(2, "0"), c = i.toString(16).padStart(2, "0"), l = o.toString(16).padStart(2, "0");
      return `#${s}${c}${l}`;
    }
    return t;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(t, e, a) {
    const n = t / 255, i = e / 255, o = a / 255, s = (Y) => Y <= 0.04045 ? Y / 12.92 : Math.pow((Y + 0.055) / 1.055, 2.4), c = s(n), l = s(i), d = s(o), h = c * 0.4124564 + l * 0.3575761 + d * 0.1804375, u = c * 0.2126729 + l * 0.7151522 + d * 0.072175, g = c * 0.0193339 + l * 0.119192 + d * 0.9503041, b = 0.2104542553 * h + 0.793617785 * u - 0.0040720468 * g, m = 1.9779984951 * h - 2.428592205 * u + 0.4505937099 * g, p = 0.0259040371 * h + 0.7827717662 * u - 0.808675766 * g, x = Math.cbrt(b), v = Math.cbrt(m), T = Math.cbrt(p), k = 0.2104542553 * x + 0.793617785 * v + 0.0040720468 * T, S = 1.9779984951 * x - 2.428592205 * v + 0.4505937099 * T, $ = 0.0259040371 * x + 0.7827717662 * v - 0.808675766 * T, C = Math.sqrt(S * S + $ * $), N = Math.atan2($, S) * 180 / Math.PI, O = N < 0 ? N + 360 : N;
    return { l: k, c: C, h: O };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(t, e, a) {
    const n = a * Math.PI / 180, i = e * Math.cos(n), o = e * Math.sin(n), s = t, c = i, l = o, d = s * s * s, h = c * c * c, u = l * l * l, g = 1.0478112 * d + 0.0228866 * h - 0.050217 * u, b = 0.0295424 * d + 0.9904844 * h + 0.0170491 * u, m = -92345e-7 * d + 0.0150436 * h + 0.7521316 * u, p = 3.2404542 * g - 1.5371385 * b - 0.4985314 * m, x = -0.969266 * g + 1.8760108 * b + 0.041556 * m, v = 0.0556434 * g - 0.2040259 * b + 1.0572252 * m, T = (C) => C <= 31308e-7 ? 12.92 * C : 1.055 * Math.pow(C, 1 / 2.4) - 0.055, k = Math.max(0, Math.min(255, Math.round(T(p) * 255))), S = Math.max(0, Math.min(255, Math.round(T(x) * 255))), $ = Math.max(0, Math.min(255, Math.round(T(v) * 255)));
    return { r: k, g: S, b: $ };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(t, e) {
    return na(t, e);
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
    const t = this.panelTabsData[this.currentPanelIndex] || [];
    return this.verboseLog(`📋 获取面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${t.length} 个`), t;
  }
  /**
   * 设置当前面板的标签页数据 - 重构为简化的数组操作
   * 按照用户思路：直接更新panelTabsData数组
   */
  setCurrentPanelTabs(t) {
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length) {
      this.log(`⚠️ 无法设置标签页数据，当前面板索引无效: ${this.currentPanelIndex}`);
      return;
    }
    this.currentPanelIndex >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[this.currentPanelIndex] = [...t], this.log(`📋 设置面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${t.length} 个`), this.saveCurrentPanelTabs();
  }
  /**
   * 保存当前面板的标签页数据到存储
   */
  async saveCurrentPanelTabs() {
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length)
      return;
    const t = this.panelTabsData[this.currentPanelIndex] || [], e = this.currentPanelIndex === 0 ? y.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.tabStorageService.savePanelTabsByKey(e, t);
  }
  /**
   * 同步当前标签数组到对应的存储数组
   */
  syncCurrentTabsToStorage(t) {
    this.setCurrentPanelTabs(t);
  }
  async switchToTab(t) {
    try {
      this.log(`🔄 开始切换标签: ${t.title} (ID: ${t.blockId})`);
      const e = this.getCurrentActiveTab();
      e && e.blockId !== t.blockId && (this.recordScrollPosition(e), this.lastActiveBlockId = e.blockId, this.log(`🎯 记录切换前的激活标签: ${e.title} (ID: ${e.blockId})`));
      const a = this.getPanelIds();
      let n = "";
      if (t.panelId && a.includes(t.panelId) ? n = t.panelId : this.currentPanelId && a.includes(this.currentPanelId) ? n = this.currentPanelId : a.length > 0 && (n = a[0]), !n) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const i = a.indexOf(n);
      i !== -1 ? (this.currentPanelIndex = i, this.currentPanelId = n) : this.warn(`⚠️ 目标面板 ${n} 不在面板列表中`), this.log(`🎯 目标面板ID: ${n}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(n);
      } catch (o) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", o);
      }
      try {
        this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${t.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(t.blockId) }, n), this.log("✅ orca.nav.goTo 导航成功");
      } catch (o) {
        this.warn("导航失败，尝试备用方法:", o);
        const s = document.querySelector(`[data-block-id="${t.blockId}"]`);
        if (s)
          this.log(`🔄 使用备用方法点击块元素: ${t.blockId}`), s.click();
        else {
          this.error("无法找到目标块元素:", t.blockId);
          const c = document.querySelector(`[data-block-id="${t.blockId}"]`) || document.querySelector(`#block-${t.blockId}`) || document.querySelector(`.block-${t.blockId}`);
          c ? (this.log("🔄 找到备用块元素，尝试点击"), c.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = t.blockId, this.log(`🔄 切换到标签: ${t.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(t), setTimeout(() => {
        this.debugScrollPosition(t);
      }, 500), await this.focusTabElementById(t.blockId), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页切换，实时更新工作区: ${t.title}`));
    } catch (e) {
      this.error("切换标签失败:", e);
    }
  }
  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(t) {
    const e = document.querySelector(".orca-panel.active");
    if (!e) return !1;
    const a = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    return a ? a.getAttribute("data-block-id") === t.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(t) {
    const e = this.getCurrentPanelTabs(), a = e.findIndex((i) => i.blockId === t.blockId);
    if (a === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let n = -1;
    if (a === 0 ? n = 1 : a === e.length - 1 ? n = a - 1 : n = a + 1, n >= 0 && n < e.length) {
      const i = e[n];
      this.log(`🔄 自动切换到相邻标签: "${i.title}" (位置: ${n})`), this.currentPanelId && await orca.nav.goTo("block", { blockId: parseInt(i.blockId) }, this.currentPanelId || "");
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(t) {
    const e = this.getCurrentPanelTabs(), a = Ye(t, e, {
      updateOrder: !0,
      saveData: !0,
      updateUI: !0
    });
    a.success ? (this.syncCurrentTabsToStorage(e), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页固定状态变化，实时更新工作区: ${t.title}`)), this.log(a.message)) : this.warn(a.message);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 设置管理 - Settings Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 注册插件设置
   */
  async registerPluginSettings() {
    var t;
    try {
      const e = {
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
        }
      };
      await orca.plugins.setSettingsSchema(this.pluginName, e);
      const a = (t = orca.state.plugins[this.pluginName]) == null ? void 0 : t.settings;
      a != null && a.homePageBlockId && (this.homePageBlockId = a.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (a == null ? void 0 : a.showInHeadbar) !== void 0 && (this.showInHeadbar = a.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = a.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = a.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableWorkspaces) !== void 0 && (this.enableWorkspaces = a.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), this.log("✅ 插件设置已注册");
    } catch (e) {
      this.error("注册插件设置失败:", e);
    }
  }
  /**
   * 设置设置检查监听器
   */
  setupSettingsChecker() {
    this.lastSettings = {
      showInHeadbar: this.showInHeadbar,
      homePageBlockId: this.homePageBlockId,
      enableWorkspaces: this.enableWorkspaces
    }, this.settingsCheckInterval = setInterval(() => {
      this.checkSettingsChange();
    }, 2e3);
  }
  /**
   * 检查设置变化
   */
  checkSettingsChange() {
    var t;
    try {
      const e = (t = orca.state.plugins[this.pluginName]) == null ? void 0 : t.settings;
      if (!e) return;
      if (e.showInHeadbar !== this.lastSettings.showInHeadbar) {
        const a = this.showInHeadbar;
        this.showInHeadbar = e.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${a ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (e.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = e.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), e.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const a = this.enableWorkspaces;
        this.enableWorkspaces = e.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${a ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
    } catch (e) {
      this.error("检查设置变化失败:", e);
    }
  }
  /**
   * 注册块菜单命令
   */
  registerBlockMenuCommands() {
    try {
      orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.openInNewTab", {
        worksOnMultipleBlocks: !1,
        render: (t, e, a) => {
          const n = window.React;
          return !n || !orca.components.MenuText ? null : n.createElement(orca.components.MenuText, {
            title: "在新标签页打开",
            preIcon: "ti ti-external-link",
            onClick: () => {
              a(), this.openInNewTab(t.toString());
            }
          });
        }
      }), orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.addToTabGroup", {
        worksOnMultipleBlocks: !1,
        render: (t, e, a) => {
          const n = window.React;
          return !n || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : n.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              a(), this.getTabInfo(t.toString(), this.currentPanelId || "" || "", 0).then((i) => {
                i ? this.showAddToTabGroupDialog(i) : orca.notify("error", "无法获取块信息");
              });
            }
          });
        }
      }), this.log("✅ 已注册块菜单命令: 在新标签页打开"), this.log("✅ 已注册块菜单命令: 添加到已有标签组");
    } catch (t) {
      this.error("注册块菜单命令失败:", t);
    }
  }
  /**
   * 创建新标签页
   */
  async createNewTab() {
    try {
      const t = this.homePageBlockId && this.homePageBlockId.trim() ? this.homePageBlockId : "1", e = this.homePageBlockId && this.homePageBlockId.trim() ? "🏠 主页" : "📄 新标签页";
      this.log(`🆕 创建新标签页，使用块ID: ${t}`);
      const a = this.getCurrentPanelTabs(), n = {
        blockId: t,
        panelId: this.currentPanelId || "",
        title: e,
        isPinned: !1,
        order: a.length
      };
      this.log(`📋 新标签页信息: "${n.title}" (ID: ${t})`);
      const i = this.getCurrentActiveTab();
      let o = a.length;
      if (i) {
        const s = a.findIndex((c) => c.blockId === i.blockId);
        s !== -1 && (o = s + 1, this.log(`🎯 将在聚焦标签 "${i.title}" 后面插入新标签: "${n.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (a.length >= this.maxTabs) {
        a.splice(o, 0, n), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${n.title}`);
        const s = this.findLastNonPinnedTabIndex();
        if (s !== -1) {
          const c = a[s];
          a.splice(s, 1), this.log(`🗑️ 删除末尾的非固定标签: "${c.title}" 来保持数量限制`);
        } else {
          const c = a.findIndex((l) => l.blockId === n.blockId);
          if (c !== -1) {
            a.splice(c, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${n.title}"`);
            return;
          }
        }
      } else
        a.splice(o, 0, n), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${n.title}`);
      this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), await orca.nav.goTo("block", { blockId: parseInt(t) }, this.currentPanelId || ""), this.log(`🔄 导航到块: ${t}`), this.log(`✅ 成功创建新标签页: "${n.title}"`);
    } catch (t) {
      this.error("创建新标签页时出错:", t);
    }
  }
  /**
   * 生成趣味性内容
   */
  generateFunContent() {
    const t = [
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
    ], e = Math.floor(Math.random() * t.length);
    return t[e];
  }
  /**
   * 设置块内容
   */
  async setBlockContent(t, e) {
    try {
      await orca.invokeBackend("set-block-content", parseInt(t), [{ t: "t", v: e }]), this.log(`📝 已为新块 ${t} 设置内容: "${e}"`);
    } catch (a) {
      this.warn("设置块内容失败，尝试备用方法:", a);
      try {
        await orca.invokeBackend("get-block", parseInt(t)) && this.log(`📝 跳过自动内容设置，用户可手动编辑块 ${t}`);
      } catch (n) {
        this.warn("备用方法也失败:", n);
      }
    }
  }
  /**
   * 强制让指定的标签元素呈聚焦状态，确保UI与数据同步
   */
  async focusTabElementById(t) {
    this.tabContainer || await this.updateTabsUI();
    const e = () => {
      var i, o;
      const a = (i = this.tabContainer) == null ? void 0 : i.querySelectorAll(".orca-tabs-plugin .orca-tab");
      a == null || a.forEach((s) => s.removeAttribute("data-focused"));
      const n = (o = this.tabContainer) == null ? void 0 : o.querySelector(`[data-tab-id="${t}"]`);
      return n ? (n.setAttribute("data-focused", "true"), !0) : !1;
    };
    e() || (await this.updateTabsUI(), e());
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(t, e, a = !1) {
    try {
      const n = this.getCurrentPanelTabs(), i = n.find((d) => d.blockId === t);
      if (i)
        return this.log(`📋 块 ${t} 已存在于标签页中，聚焦已有标签`), this.closedTabs.has(t) && (this.closedTabs.delete(t), await this.saveClosedTabs()), await this.switchToTab(i), await this.focusTabElementById(i.blockId), !0;
      if (!orca.state.blocks[parseInt(t)])
        return this.warn(`无法找到块 ${t}`), !1;
      const s = await this.getTabInfo(t, this.currentPanelId || "", n.length);
      if (!s)
        return this.warn(`无法获取块 ${t} 的标签信息`), !1;
      let c = n.length, l = !1;
      if (e === "replace") {
        const d = this.getCurrentActiveTab();
        if (!d)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const h = n.findIndex((u) => u.blockId === d.blockId);
        if (h === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        d.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), c = h + 1, l = !1) : (c = h, l = !0);
      } else if (e === "after") {
        const d = this.getCurrentActiveTab();
        if (d) {
          const h = n.findIndex((u) => u.blockId === d.blockId);
          h !== -1 && (c = h + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (n.length >= this.maxTabs)
        if (l)
          n[c] = s;
        else {
          n.splice(c, 0, s);
          const d = this.findLastNonPinnedTabIndex();
          if (d !== -1)
            n.splice(d, 1);
          else {
            const h = n.findIndex((u) => u.blockId === s.blockId);
            if (h !== -1)
              return n.splice(h, 1), !1;
          }
        }
      else
        l ? n[c] = s : n.splice(c, 0, s);
      return this.syncCurrentTabsToStorage(n), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${s.title}`)), await this.updateTabsUI(), a && await orca.nav.goTo("block", { blockId: parseInt(t) }, this.currentPanelId || ""), !0;
    } catch (n) {
      return this.error("添加标签页时出错:", n), !1;
    }
  }
  /**
   * 将指定块添加到标签页中，替换当前聚焦标签
   */
  async createBlockAfterFocused(t) {
    await this.addTabToPanel(t, "replace", !1);
  }
  /**
   * 在后台新建标签页打开指定块（在聚焦标签后面插入新标签但不跳转）
   */
  async openInNewTab(t) {
    await this.addTabToPanel(t, "after", !1);
  }
  /**
   * 从DOM元素中获取块引用的ID
   */
  getBlockRefId(t) {
    var e, a;
    try {
      let n = t;
      for (; n && n !== document.body; ) {
        const i = n.classList;
        if (i.contains("orca-ref") || i.contains("block-ref") || i.contains("block-reference") || i.contains("orca-fragment-r") || i.contains("fragment-r") || i.contains("orca-block-reference") || n.tagName.toLowerCase() === "a" && ((e = n.getAttribute("href")) != null && e.startsWith("#"))) {
          const s = n.getAttribute("data-ref-id") || n.getAttribute("data-target-block-id") || n.getAttribute("data-fragment-v") || n.getAttribute("data-v") || ((a = n.getAttribute("href")) == null ? void 0 : a.replace("#", "")) || n.getAttribute("data-id");
          if (s && !isNaN(parseInt(s)))
            return this.log(`🔗 从块引用元素中提取到ID: ${s}`), s;
        }
        const o = n.dataset;
        for (const [s, c] of Object.entries(o))
          if ((s.toLowerCase().includes("ref") || s.toLowerCase().includes("fragment")) && c && !isNaN(parseInt(c)))
            return this.log(`🔗 从data属性 ${s} 中提取到块引用ID: ${c}`), c;
        n = n.parentElement;
      }
      if (t.textContent) {
        const i = t.textContent.trim(), o = i.match(/\[\[(?:块)?(\d+)\]\]/) || i.match(/block[:\s]*(\d+)/i);
        if (o && o[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${o[1]}`), o[1];
      }
      return null;
    } catch (n) {
      return this.error("获取块引用ID时出错:", n), null;
    }
  }
  /**
   * 获取当前光标位置的块ID
   */
  getCurrentCursorBlockId() {
    try {
      const t = window.getSelection();
      if (!t || t.rangeCount === 0)
        return this.log("🔍 无法获取当前选择"), null;
      const e = orca.utils.getCursorDataFromSelection(t);
      if (!e)
        return this.log("🔍 无法从选择转换为 CursorData"), null;
      const a = e.anchor.blockId.toString();
      return this.log(`🔍 获取到当前光标块ID: ${a}`), a;
    } catch (t) {
      return this.error("获取当前光标块ID时出错:", t), null;
    }
  }
  /**
   * 增强块引用的右键菜单，添加标签页相关选项
   */
  enhanceBlockRefContextMenu(t) {
    var e, a, n, i;
    try {
      const o = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let s = null;
      for (let l = o.length - 1; l >= 0; l--) {
        const d = o[l];
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
      if (this.log(`🔗 为块引用 ${t} 添加菜单项`), s.querySelectorAll('[role="menuitem"], .menu-item').length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-separator";
        const d = document.documentElement.classList.contains("dark") || ((a = (e = window.orca) == null ? void 0 : e.state) == null ? void 0 : a.themeMode) === "dark";
        l.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, s.appendChild(l);
      }
      if (this.savedTabSets.length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-item", l.setAttribute("role", "menuitem");
        const d = document.documentElement.classList.contains("dark") || ((i = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : i.themeMode) === "dark";
        l.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-size: 14px;
          color: ${d ? "#ffffff" : "#333"};
          border-bottom: 1px solid var(--orca-color-border);
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        `, l.innerHTML = `
          <i class="ti ti-bookmark-plus" style="font-size: 14px;"></i>
          <span>添加到已有标签组</span>
        `, l.addEventListener("mouseenter", () => {
          l.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), l.addEventListener("mouseleave", () => {
          l.style.backgroundColor = "transparent";
        }), l.addEventListener("click", () => {
          const h = this.getCurrentActiveTab();
          h && this.showAddToTabGroupDialog(h), s == null || s.remove();
        }), s.appendChild(l);
      }
      this.log(`✅ 成功为块引用 ${t} 添加菜单项`);
    } catch (o) {
      this.error("增强块引用右键菜单时出错:", o);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(t, e, a, n) {
    return Ne(t, e, a, n);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(t) {
    try {
      const e = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(e, orca.state.panels);
      if (a && a.viewState) {
        let n = null;
        const i = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (i) {
          const o = i.closest(".orca-panel");
          o && (n = o.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!n) {
          const o = document.querySelector(".orca-panel.active");
          o && (n = o.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (n || (n = document.body.scrollTop > 0 ? document.body : document.documentElement), n) {
          const o = {
            x: n.scrollLeft || 0,
            y: n.scrollTop || 0
          };
          a.viewState.scrollPosition = o;
          const s = this.getCurrentPanelTabs().findIndex((c) => c.blockId === t.blockId);
          s !== -1 && (this.getCurrentPanelTabs()[s].scrollPosition = o, await this.saveCurrentPanelTabs()), this.log(`📝 记录标签 "${t.title}" 滚动位置到viewState:`, o, "容器:", n.className);
        } else
          this.warn(`未找到标签 "${t.title}" 的滚动容器`);
      } else
        this.warn(`未找到面板 ${e} 或viewState`);
    } catch (e) {
      this.warn("记录滚动位置时出错:", e);
    }
  }
  /**
   * 恢复标签的滚动位置
   */
  restoreScrollPosition(t) {
    try {
      let e = null;
      const a = this.getPanelIds()[this.currentPanelIndex], n = orca.nav.findViewPanel(a, orca.state.panels);
      if (n && n.viewState && n.viewState.scrollPosition && (e = n.viewState.scrollPosition, this.log(`🔄 从viewState恢复标签 "${t.title}" 滚动位置:`, e)), !e && t.scrollPosition && (e = t.scrollPosition, this.log(`🔄 从标签信息恢复标签 "${t.title}" 滚动位置:`, e)), !e) return;
      const i = (o = 1) => {
        if (o > 5) {
          this.warn(`恢复标签 "${t.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let s = null;
        const c = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (c) {
          const l = c.closest(".orca-panel");
          l && (s = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!s) {
          const l = document.querySelector(".orca-panel.active");
          l && (s = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        s || (s = document.body.scrollTop > 0 ? document.body : document.documentElement), s ? (s.scrollLeft = e.x, s.scrollTop = e.y, this.log(`🔄 恢复标签 "${t.title}" 滚动位置:`, e, "容器:", s.className, `尝试${o}`)) : setTimeout(() => i(o + 1), 200 * o);
      };
      i(), setTimeout(() => i(2), 100), setTimeout(() => i(3), 300);
    } catch (e) {
      this.warn("恢复滚动位置时出错:", e);
    }
  }
  /**
   * 调试滚动位置信息
   */
  debugScrollPosition(t) {
    this.log(`🔍 调试标签 "${t.title}" 滚动位置:`), this.log("标签保存的滚动位置:", t.scrollPosition);
    const e = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(e, orca.state.panels);
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
  isTabActive(t) {
    try {
      const e = document.querySelector(".orca-panel.active");
      if (!e) return !1;
      const a = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!a) return !1;
      const i = a.getAttribute("data-block-id") === t.blockId;
      return i && this.closedTabs.has(t.blockId) ? (this.verboseLog(`🔍 标签 ${t.title} 在已关闭列表中，不认为是激活状态`), !1) : i;
    } catch (e) {
      return this.warn("检查标签激活状态时出错:", e), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    const t = this.enableWorkspaces ? this.getCurrentPanelTabs() : this.getCurrentPanelTabs();
    if (t.length === 0) return null;
    const e = document.querySelector(".orca-panel.active");
    if (!e) return null;
    const a = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!a) return null;
    const n = a.getAttribute("data-block-id");
    if (!n) return null;
    const i = t.find((o) => o.blockId === n) || null;
    return this.enableWorkspaces && this.currentWorkspace && i && this.updateCurrentWorkspaceActiveIndex(i), i;
  }
  /**
   * 获取智能插入位置（在当前激活标签后面）
   */
  getSmartInsertPosition() {
    const t = this.getCurrentPanelTabs();
    if (t.length === 0) return -1;
    const e = this.getCurrentActiveTab();
    if (!e)
      return -1;
    const a = t.findIndex((n) => n.blockId === e.blockId);
    return a === -1 ? -1 : a;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const t = this.getCurrentPanelTabs();
    if (t.length === 0) return null;
    if (this.lastActiveBlockId) {
      const a = t.find((n) => n.blockId === this.lastActiveBlockId);
      if (a)
        return this.log(`🎯 找到上一个激活的标签: ${a.title}`), a;
    }
    const e = this.getCurrentActiveTab();
    return e ? (this.log(`🎯 使用当前激活的标签: ${e.title}`), e) : (this.log("🎯 没有找到激活的标签"), null);
  }
  /**
   * 基于之前激活的标签获取智能插入位置
   */
  getSmartInsertPositionWithPrevious(t) {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return -1;
    if (!t)
      return this.log("🎯 没有找到之前激活的标签，添加到末尾"), -1;
    const a = e.findIndex((n) => n.blockId === t.blockId);
    return a === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${t.title}" (索引${a}) 后面插入新标签`), a);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(t) {
    const e = this.getCurrentPanelTabs(), a = e.findIndex((n) => n.blockId === t.blockId);
    return a === -1 || e.length <= 1 ? null : a < e.length - 1 ? e[a + 1] : a > 0 ? e[a - 1] : a === 0 && e.length > 1 ? e[1] : null;
  }
  /**
   * 关闭标签页
   */
  async closeTab(t) {
    const e = this.getCurrentPanelTabs();
    if (e.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    t.isPinned && this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
    const a = e.findIndex((n) => n.blockId === t.blockId);
    if (a !== -1) {
      const n = this.getCurrentActiveTab(), i = n && n.blockId === t.blockId, o = i ? this.getAdjacentTab(t) : null;
      if (this.closedTabs.add(t.blockId), this.enableRecentlyClosedTabs) {
        const s = { ...t, closedAt: Date.now() }, c = this.recentlyClosedTabs.findIndex((l) => l.blockId === t.blockId);
        c !== -1 && this.recentlyClosedTabs.splice(c, 1), this.recentlyClosedTabs.unshift(s), this.recentlyClosedTabs.length > 20 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 20)), await this.saveRecentlyClosedTabs();
      }
      e.splice(a, 1), this.syncCurrentTabsToStorage(e), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${t.title}`)), this.log(`🗑️ 标签 "${t.title}" 已关闭，已添加到关闭列表`), i && o ? (this.log(`🔄 自动切换到相邻标签: "${o.title}"`), await this.switchToTab(o)) : i && !o && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const t = this.getCurrentPanelTabs();
    t.filter((i) => !i.isPinned).forEach((i) => {
      this.closedTabs.add(i.blockId);
    });
    const a = t.filter((i) => i.isPinned), n = t.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${n} 个标签，保留了 ${a.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(t) {
    const e = this.getCurrentPanelTabs(), a = e.filter(
      (o) => o.blockId === t.blockId || o.isPinned
    );
    e.filter(
      (o) => o.blockId !== t.blockId && !o.isPinned
    ).forEach((o) => {
      this.closedTabs.add(o.blockId);
    });
    const i = e.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${i} 个标签，保留了当前标签和固定标签`);
  }
  /**
   * 重命名标签（内联编辑）
   */
  renameTab(t) {
    const e = document.querySelector(".tab-context-menu");
    e && e.remove(), this.showInlineRenameInput(t);
  }
  /**
   * 显示内联重命名输入框
   */
  showInlineRenameInput(t) {
    const e = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    if (!e) {
      this.warn("找不到对应的标签元素");
      return;
    }
    const a = e.querySelector(".inline-rename-input");
    a && a.remove();
    const n = e.textContent, i = e.style.cssText, o = document.createElement("input");
    o.type = "text", o.value = t.title, o.className = "inline-rename-input";
    let s = "var(--orca-input-bg)", c = "var(--orca-color-text-1)";
    t.color && (s = this.applyOklchFormula(t.color, "background"), c = this.applyOklchFormula(t.color, "text")), o.style.cssText = `
      background: ${s};
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
    `, e.textContent = "", e.appendChild(o), e.style.padding = "2px 8px", o.focus(), o.select();
    const l = async () => {
      const h = o.value.trim();
      if (h && h !== t.title) {
        await this.updateTabTitle(t, h);
        return;
      }
      e.textContent = n, e.style.cssText = i;
    }, d = () => {
      e.textContent = n, e.style.cssText = i;
    };
    o.addEventListener("blur", l), o.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), d());
    }), o.addEventListener("click", (h) => {
      h.stopPropagation();
    });
  }
  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(t) {
    const e = window.React, a = window.ReactDOM;
    if (!e || !a || !orca.components.InputBox) {
      this.warn("Orca组件不可用，回退到原生实现"), this.showRenameInput(t);
      return;
    }
    const n = document.createElement("div");
    n.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      pointer-events: none;
    `, document.body.appendChild(n);
    const i = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    let o = { x: "50%", y: "50%" };
    if (i) {
      const h = i.getBoundingClientRect(), u = window.innerWidth, g = window.innerHeight, b = 300, m = 100, p = 20;
      let x = h.left, v = h.top - m - 10;
      x + b > u - p && (x = u - b - p), x < p && (x = p), v < p && (v = h.bottom + 10, v + m > g - p && (v = (g - m) / 2)), v + m > g - p && (v = g - m - p), x = Math.max(p, Math.min(x, u - b - p)), v = Math.max(p, Math.min(v, g - m - p)), o = { x: `${x}px`, y: `${v}px` };
    }
    const s = orca.components.InputBox, c = e.createElement(s, {
      label: "重命名标签",
      defaultValue: t.title,
      onConfirm: (h, u, g) => {
        h && h.trim() && h.trim() !== t.title && this.updateTabTitle(t, h.trim()), g();
      },
      onCancel: (h) => {
        h();
      }
    }, (h) => e.createElement("div", {
      style: {
        position: "absolute",
        left: o.x,
        top: o.y,
        pointerEvents: "auto"
      },
      onClick: h
    }, ""));
    a.render(c, n), setTimeout(() => {
      const h = n.querySelector("div");
      h && h.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        a.unmountComponentAtNode(n), n.remove();
      }, 100);
    }, d = (h) => {
      h.key === "Escape" && (l(), document.removeEventListener("keydown", d));
    };
    document.addEventListener("keydown", d);
  }
  /**
   * 显示重命名输入框（原生实现，作为备选）
   */
  showRenameInput(t) {
    const e = document.querySelector(".tab-rename-input");
    e && e.remove();
    const a = document.createElement("div");
    a.className = "tab-rename-input", a.style.cssText = `
      position: fixed;
      z-index: 2000;
      background-color: var(--orca-color-bg-1);
      border: 2px solid var(--orca-color-primary-5);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: .175rem var(--orca-spacing-md);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      min-width: 200px;
    `;
    const n = document.createElement("input");
    n.type = "text", n.value = t.title, n.style.cssText = `
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
    const o = document.createElement("button");
    o.className = "orca-button orca-button-primary", o.textContent = "确认";
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "取消", i.appendChild(o), i.appendChild(s), a.appendChild(n), a.appendChild(i);
    const c = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    if (c) {
      const u = c.getBoundingClientRect();
      a.style.left = `${u.left}px`, a.style.top = `${u.top - 60}px`;
    } else
      a.style.left = "50%", a.style.top = "50%", a.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(a), n.focus(), n.select();
    const l = () => {
      const u = n.value.trim();
      u && u !== t.title && this.updateTabTitle(t, u), a.remove();
    }, d = () => {
      a.remove();
    };
    o.addEventListener("click", l), s.addEventListener("click", d), n.addEventListener("keydown", (u) => {
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
  async updateTabTitle(t, e) {
    try {
      const a = this.getCurrentPanelTabs(), n = Ge(t, e, a, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      n.success ? (this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${e}`)), this.log(n.message)) : this.warn(n.message);
    } catch (a) {
      this.error("重命名标签失败:", a);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(t, e) {
    const a = window.React, n = window.ReactDOM;
    if (!a || !n || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      setTimeout(() => {
        const i = window.React, o = window.ReactDOM;
        !i || !o || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? t.addEventListener("contextmenu", (s) => {
          s.preventDefault(), s.stopPropagation(), s.stopImmediatePropagation(), this.showTabContextMenu(s, e);
        }) : this.createOrcaContextMenu(t, e);
      }, 100);
      return;
    }
    this.createOrcaContextMenu(t, e);
  }
  createOrcaContextMenu(t, e) {
    const a = window.React, n = window.ReactDOM, i = document.createElement("div");
    i.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, t.appendChild(i);
    const o = orca.components.ContextMenu, s = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, d = a.createElement(o, {
      menu: (g) => a.createElement(s, {}, [
        a.createElement(c, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            g(), this.renameTab(e);
          }
        }),
        a.createElement(c, {
          key: "pin",
          title: e.isPinned ? "取消固定" : "固定标签",
          preIcon: e.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            g(), this.toggleTabPinStatus(e);
          }
        }),
        a.createElement(l, { key: "separator1" }),
        a.createElement(c, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            g(), this.closeTab(e);
          }
        }),
        a.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            g(), this.closeOtherTabs(e);
          }
        }),
        a.createElement(c, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            g(), this.closeAllTabs();
          }
        })
      ])
    }, (g, b) => a.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        background: "transparent"
      },
      onContextMenu: (p) => {
        p.preventDefault(), p.stopPropagation(), g(p);
      }
    }));
    n.render(d, i);
    const h = () => {
      n.unmountComponentAtNode(i), i.remove();
    }, u = new MutationObserver((g) => {
      g.forEach((b) => {
        b.removedNodes.forEach((m) => {
          m === t && (h(), u.disconnect());
        });
      });
    });
    u.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(t, e) {
    var c, l;
    const a = document.querySelector(".tab-context-menu");
    a && a.remove();
    const n = document.documentElement.classList.contains("dark") || ((l = (c = window.orca) == null ? void 0 : c.state) == null ? void 0 : l.themeMode) === "dark", i = document.createElement("div");
    i.className = "tab-context-menu", i.style.cssText = `
      position: fixed;
      left: ${t.clientX}px;
      top: ${t.clientY}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: 180px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const o = [
      {
        text: "重命名标签",
        action: () => this.renameTab(e)
      },
      {
        text: e.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(e)
      }
    ];
    this.savedTabSets.length > 0 && o.push({
      text: "添加到已有标签组",
      action: () => this.showAddToTabGroupDialog(e)
    }), o.push(
      {
        text: "关闭标签",
        action: () => this.closeTab(e),
        disabled: this.getCurrentPanelTabs().length <= 1
      },
      {
        text: "关闭其他标签",
        action: () => this.closeOtherTabs(e),
        disabled: this.getCurrentPanelTabs().length <= 1
      },
      {
        text: "关闭全部标签",
        action: () => this.closeAllTabs(),
        disabled: this.getCurrentPanelTabs().length <= 1
      }
    ), o.forEach((d) => {
      const h = document.createElement("div");
      h.textContent = d.text, h.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${d.disabled ? n ? "#666" : "#999" : n ? "#ffffff" : "#333"};
        border-bottom: 1px solid var(--orca-color-border);
        transition: background-color 0.2s;
      `, d.disabled || (h.addEventListener("mouseenter", () => {
        h.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), h.addEventListener("mouseleave", () => {
        h.style.backgroundColor = "transparent";
      }), h.addEventListener("click", () => {
        d.action(), i.remove();
      })), i.appendChild(h);
    }), document.body.appendChild(i);
    const s = (d) => {
      i.contains(d.target) || (i.remove(), document.removeEventListener("click", s));
    };
    setTimeout(() => {
      document.addEventListener("click", s);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    const t = this.panelTabsData[0] || [];
    await this.tabStorageService.saveFirstPanelTabs(t);
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
    const t = await this.tabStorageService.restoreFirstPanelTabs();
    this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = t, await this.updateRestoredTabsBlockTypes();
  }
  // 注意：第二个面板现在使用统一的数据结构，不再需要单独的处理方法
  /**
   * 更新从存储中恢复的标签页的块类型和图标
   */
  async updateRestoredTabsBlockTypes() {
    this.log("🔄 更新从存储中恢复的标签页的块类型和图标...");
    const t = this.panelTabsData[0] || [];
    if (t.length === 0) {
      this.log("⚠️ 第一个面板没有标签页需要更新");
      return;
    }
    let e = !1;
    for (let a = 0; a < t.length; a++) {
      const n = t[a];
      if (!n.blockType || !n.icon)
        try {
          const o = await orca.invokeBackend("get-block", parseInt(n.blockId));
          if (o) {
            const s = await this.detectBlockType(o);
            let c = n.icon;
            c || (c = this.getBlockTypeIcon(s)), t[a] = {
              ...n,
              blockType: s,
              icon: c
            }, this.log(`✅ 更新恢复的标签: ${n.title} -> 类型: ${s}, 图标: ${c}`), e = !0;
          }
        } catch (o) {
          this.warn(`更新恢复的标签失败: ${n.title}`, o);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${n.title} (已有块类型和图标)`);
    }
    e && (this.log("🔄 检测到恢复的标签页有更新，保存到存储..."), this.panelTabsData[0] = t, await this.saveFirstPanelTabs()), this.log("✅ 恢复的标签页块类型和图标更新完成");
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
  hashString(t) {
    let e = 0;
    for (let a = 0; a < t.length; a++) {
      const n = t.charCodeAt(a);
      e = (e << 5) - e + n, e = e & e;
    }
    return Math.abs(e).toString(36);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 拖拽功能 - Drag Functionality */
  /* ———————————————————————————————————————————————————————————————————————————— */
  startDrag(t) {
    t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.isDragging = !0;
    const e = this.isVerticalMode ? this.verticalPosition : this.position;
    if (this.dragStartX = t.clientX - e.x, this.dragStartY = t.clientY - e.y, this.tabContainer) {
      this.tabContainer.classList.add("dragging");
      const i = this.tabContainer.querySelector(".drag-handle");
      i && i.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const a = (i) => {
      this.isDragging && (i.preventDefault(), i.stopPropagation(), this.drag(i));
    }, n = (i) => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", n), this.stopDrag();
    };
    document.addEventListener("mousemove", a), document.addEventListener("mouseup", n), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(t) {
    if (!this.isDragging || !this.tabContainer) return;
    t.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = t.clientX - this.dragStartX, this.verticalPosition.y = t.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = t.clientX - this.dragStartX, this.horizontalPosition.y = t.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const e = this.tabContainer.getBoundingClientRect(), a = 5, n = window.innerWidth - e.width - 5, i = 5, o = window.innerHeight - e.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(a, Math.min(n, this.verticalPosition.x)), this.verticalPosition.y = Math.max(i, Math.min(o, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(a, Math.min(n, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(i, Math.min(o, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const s = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = s.x + "px", this.tabContainer.style.top = s.y + "px", this.ensureClickableElements();
  }
  async stopDrag() {
    if (this.isDragging = !1, this.tabContainer) {
      this.tabContainer.classList.remove("dragging");
      const t = this.tabContainer.querySelector(".drag-handle");
      t && t.classList.remove("dragging"), this.tabContainer.style.cursor = "default", this.tabContainer.style.userSelect = "", this.tabContainer.style.pointerEvents = "auto", this.tabContainer.style.touchAction = "";
    }
    document.body.classList.remove("dragging"), document.body.style.cursor = "", document.body.style.userSelect = "", document.body.style.pointerEvents = "", document.body.style.touchAction = "", document.documentElement.style.cursor = "", document.documentElement.style.userSelect = "", document.documentElement.style.pointerEvents = "", this.resetAllElements(), this.ensureClickableElements(), this.log("🔄 拖拽结束，清理所有拖拽状态"), await this.saveLayoutMode(), this.log(`💾 拖拽结束，位置已保存: ${this.isVerticalMode ? "垂直" : "水平"}模式 (${this.position.x}, ${this.position.y})`);
  }
  async savePosition() {
    const t = await this.tabStorageService.savePosition(
      this.position,
      this.isVerticalMode,
      this.verticalPosition,
      this.horizontalPosition
    );
    this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition;
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
      const n = a;
      n.style.pointerEvents === "none" && (n.style.pointerEvents = "auto");
    }), document.querySelectorAll('button, .btn, [role="button"]').forEach((a) => {
      const n = a;
      n.style.pointerEvents === "none" && (n.style.pointerEvents = "auto");
    });
  }
  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    document.querySelectorAll("*").forEach((a) => {
      const n = a;
      (n.style.cursor === "grabbing" || n.style.cursor === "grab") && (n.style.cursor = ""), n.style.userSelect === "none" && (n.style.userSelect = ""), n.style.pointerEvents === "none" && (n.style.pointerEvents = ""), n.style.touchAction === "none" && (n.style.touchAction = "");
    }), document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]").forEach((a) => {
      const n = a;
      n.style.cursor = "", n.style.userSelect = "", n.style.pointerEvents = "auto", n.style.touchAction = "";
    }), this.log("🔄 重置所有元素样式");
  }
  async restorePosition() {
    try {
      this.position = _(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = xt(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${ct(this.position, this.isVerticalMode)}`);
    } catch {
      this.warn("无法恢复标签位置");
    }
  }
  /**
   * 从API配置恢复布局模式
   */
  async restoreLayoutMode() {
    try {
      const t = await this.storageService.getConfig(
        y.LAYOUT_MODE,
        this.pluginName,
        A()
      );
      if (t) {
        const e = vt(t);
        this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.position = _(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = e.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = e.isFloatingWindowVisible, this.showBlockTypeIcons = e.showBlockTypeIcons, this.showInHeadbar = e.showInHeadbar, this.log(`📐 布局模式已恢复: ${Tt(e)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const e = A();
        this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.position = _(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (t) {
      this.error("恢复布局模式失败:", t);
      const e = A();
      this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.position = _(
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
      const t = await this.storageService.getConfig(
        y.FIXED_TO_TOP,
        this.pluginName,
        { isFixedToTop: !1 }
      );
      t ? (this.isFixedToTop = t.isFixedToTop, this.log(`📌 固定到顶部状态已恢复: ${this.isFixedToTop ? "启用" : "禁用"}`)) : (this.isFixedToTop = !1, this.log("📌 固定到顶部状态: 禁用 (默认)"));
    } catch (t) {
      this.error("恢复固定到顶部状态失败:", t), this.isFixedToTop = !1;
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const t = this.isVerticalMode ? Math.min(this.getCurrentPanelTabs().length * 28 + 8, window.innerHeight * 0.8) : 28;
    this.position = ea(this.position, this.isVerticalMode, this.verticalWidth, t);
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
  updateFocusState(t, e) {
    var i, o;
    const a = (i = this.tabContainer) == null ? void 0 : i.querySelectorAll(".orca-tabs-plugin .orca-tab");
    a == null || a.forEach((s) => s.removeAttribute("data-focused"));
    const n = (o = this.tabContainer) == null ? void 0 : o.querySelector(`[data-tab-id="${t}"]`);
    n ? (n.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${e}"`)) : this.verboseLog(`⚠️ 未找到标签元素: ${t}`);
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
  async createTabInfoFromBlock(t, e) {
    try {
      return await this.getTabInfo(t, e || "", 0);
    } catch (a) {
      return this.error(`创建标签页信息失败: ${t}`, a), null;
    }
  }
  /**
   * 处理新增的orca-hideable元素
   * @param element 新增的DOM元素
   * @returns 是否处理了orca-hideable元素
   */
  handleNewHideableElement(t) {
    if (!t.classList.contains("orca-hideable"))
      return !1;
    const e = t.querySelector(".orca-block-editor[data-block-id]");
    if (e) {
      const a = e.getAttribute("data-block-id");
      if (a) {
        const n = t.closest(".orca-panel");
        if (n) {
          const i = n.getAttribute("data-panel-id");
          i && this.handleNewBlockInPanel(a, i).catch((o) => {
            this.error(`处理新块失败: ${a}`, o);
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
  handleChildHideableElements(t) {
    const e = t.querySelector(".orca-hideable");
    if (!e)
      return !1;
    const a = e.querySelector(".orca-block-editor[data-block-id]");
    if (a) {
      const n = a.getAttribute("data-block-id");
      if (n) {
        const i = t.closest(".orca-panel");
        if (i) {
          const o = i.getAttribute("data-panel-id");
          o && this.handleNewBlockInPanel(n, o).catch((s) => {
            this.error(`处理新块失败: ${n}`, s);
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
  async handleNewBlockInPanel(t, e) {
    var g, b;
    if (!t || !e) return;
    const a = document.querySelector(".orca-panel.active"), n = a == null ? void 0 : a.getAttribute("data-panel-id");
    if (n && e !== n) {
      this.log(`🚫 忽略非激活面板 ${e} 中的新块 ${t}，当前激活面板为 ${n}`);
      return;
    }
    const o = this.getPanelIds().indexOf(e);
    if (o === -1) {
      const m = document.querySelectorAll(".orca-panel");
      if (!(m.length > 0 && m[0].getAttribute("data-panel-id") === e)) {
        this.log(`🚫 不管理辅助面板 ${e} 的标签页`);
        return;
      }
    }
    o !== -1 && (this.currentPanelIndex = o, this.currentPanelId = e);
    let s = this.getCurrentPanelTabs();
    const c = s.find((m) => m.blockId === t);
    if (c) {
      this.closedTabs.has(t) && (this.closedTabs.delete(t), this.saveClosedTabs()), this.updateFocusState(t, c.title), this.immediateUpdateTabsUI();
      return;
    }
    const l = await this.createTabInfoFromBlock(t, e);
    if (!l) return;
    const d = this.getCurrentActiveTab();
    if (d) {
      const m = s.findIndex((p) => p.blockId === d.blockId);
      if (m !== -1) {
        this.log(`🔄 替换当前激活标签页: "${d.title}" -> "${l.title}"`), s[m] = l, this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const m = s.findIndex((p) => p.blockId === this.lastActiveBlockId);
      if (m !== -1) {
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${s[m].title}" -> "${l.title}"`), s[m] = l, this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    let h = -1;
    const u = (g = this.tabContainer) == null ? void 0 : g.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (u) {
      const m = u.getAttribute("data-tab-id");
      h = s.findIndex((p) => p.blockId === m);
    }
    if (h === -1) {
      const m = (b = this.tabContainer) == null ? void 0 : b.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (m && m.length > 0)
        for (let p = 0; p < m.length; p++) {
          const x = m[p];
          if (x.classList.contains("focused") || x.getAttribute("data-focused") === "true" || x.classList.contains("active")) {
            h = p;
            break;
          }
        }
    }
    h === -1 && s.length > 0 && (h = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), h >= 0 && h < s.length ? (s[h] = l, this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI()) : (s = [l], this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI());
  }
  async checkCurrentPanelBlocks() {
    var u;
    this.log("🔍 开始检查当前面板块...");
    const t = document.querySelector(".orca-panel.active");
    if (!t) {
      this.log("❌ 没有找到当前激活的面板");
      const g = document.querySelectorAll(".orca-panel");
      this.log("📊 当前所有面板状态:"), g.forEach((b, m) => {
        const p = b.getAttribute("data-panel-id"), x = b.classList.contains("active");
        this.log(`  面板${m + 1}: ID=${p}, active=${x}`);
      });
      return;
    }
    const e = t.getAttribute("data-panel-id");
    if (!e) {
      this.log("❌ 激活面板没有 data-panel-id");
      return;
    }
    this.log(`✅ 找到激活面板: ID=${e}, class=${t.className}`);
    const a = this.getPanelIds().indexOf(e);
    a !== -1 && (this.currentPanelIndex = a, this.currentPanelId = e, this.verboseLog(`🔄 更新当前面板索引: ${a} (面板ID: ${e})`)), t.querySelectorAll(".orca-hideable");
    const n = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!n) {
      this.log(`❌ 激活面板 ${e} 中没有找到可见的块编辑器`);
      return;
    }
    const i = n.getAttribute("data-block-id");
    if (!i) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    let o = this.getCurrentPanelTabs();
    o.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), o = this.getCurrentPanelTabs());
    const s = o.find((g) => g.blockId === i);
    if (s) {
      this.closedTabs.has(i) && (this.closedTabs.delete(i), await this.saveClosedTabs()), this.updateFocusState(i, s.title), await this.immediateUpdateTabsUI();
      return;
    }
    const c = (u = this.tabContainer) == null ? void 0 : u.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (!c)
      return;
    const l = c.getAttribute("data-tab-id");
    if (!l)
      return;
    const d = o.findIndex((g) => g.blockId === l);
    if (d === -1)
      return;
    const h = await this.getTabInfo(i, e, d);
    h && (o[d] = h, this.setCurrentPanelTabs(o), await this.immediateUpdateTabsUI());
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
    new MutationObserver(async (n) => {
      let i = !1, o = !1, s = !1, c = this.currentPanelIndex;
      const l = Date.now(), d = this.lastPanelCheckTime || 0, h = 1e3;
      n.forEach((u) => {
        if (u.type === "childList") {
          const g = u.target;
          if ((g.classList.contains("orca-panels-row") || g.closest(".orca-panels-row")) && (o = !0), u.addedNodes.length > 0 && g.closest(".orca-panel")) {
            for (const m of u.addedNodes)
              if (m.nodeType === Node.ELEMENT_NODE) {
                const p = m;
                if (this.handleNewHideableElement(p)) {
                  i = !0;
                  break;
                }
                if (p.classList.contains("orca-block-editor") || p.querySelector(".orca-block-editor")) {
                  i = !0;
                  break;
                }
                if (this.handleChildHideableElements(p)) {
                  i = !0;
                  break;
                }
              }
          }
        }
        if (u.type === "attributes" && u.attributeName === "class") {
          const g = u.target;
          if (g.classList.contains("orca-panel")) {
            if (s = !0, g.classList.contains("active")) {
              const b = g.getAttribute("data-panel-id"), m = g.querySelectorAll(".orca-hideable");
              let p = null;
              m.forEach((x) => {
                const v = x.classList.contains("orca-hideable-hidden"), T = x.querySelector(".orca-block-editor[data-block-id]"), k = T == null ? void 0 : T.getAttribute("data-block-id");
                !v && T && k && (p = k);
              }), p && b && this.handleNewBlockInPanel(p, b).catch((x) => {
                this.error(`处理面板激活时的新块失败: ${p}`, x);
              }), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 50), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 200);
            }
            g.classList.contains("orca-locked") && g.classList.contains("active") && (this.log("🔒 检测到锁定面板激活，聚焦上一个面板"), this.focusToPreviousPanel());
          }
          g.classList.contains("orca-hideable") && !g.classList.contains("orca-hideable-hidden") && (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦状态变化"), i = !0);
        }
      }), s && (await this.updateCurrentPanelIndex(), c !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${c} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), o && l - d > h ? (this.lastPanelCheckTime = l, this.log(`🔍 面板检查防抖：距离上次检查 ${l - d}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : o && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${l - d}ms`), i && await this.checkCurrentPanelBlocks();
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class"]
    });
    let e = null;
    const a = async (n) => {
      const o = n.target.closest(".orca-hideable");
      o && (e && clearTimeout(e), e = window.setTimeout(async () => {
        o.classList.contains("orca-hideable-hidden") || (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦变化"), await this.checkCurrentPanelBlocks()), e = null;
      }, 0));
    };
    document.addEventListener("click", a), document.addEventListener("focusin", a), document.addEventListener("keydown", (n) => {
      (n.key === "Tab" || n.key === "Enter" || n.key === " ") && (e && clearTimeout(e), e = window.setTimeout(a, 0));
    }), setInterval(async () => {
      var n;
      try {
        const i = document.querySelector(".orca-panel.active");
        if (i) {
          const o = i.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (o) {
            const s = o.getAttribute("data-block-id");
            if (s) {
              const c = (n = this.tabContainer) == null ? void 0 : n.querySelector('.orca-tab[data-focused="true"]');
              if (c) {
                const l = c.getAttribute("data-tab-id");
                l !== s && (this.verboseLog(`🔄 主动检测到块变化: ${l} -> ${s}`), await this.checkCurrentPanelBlocks());
              } else
                this.verboseLog(`🔄 主动检测到无聚焦标签页，当前块: ${s}`), await this.checkCurrentPanelBlocks();
            }
          }
        }
      } catch {
      }
    }, 500);
  }
  /**
   * 检查新添加的面板
   */
  async checkForNewPanels() {
    const t = this.getPanelIds().length, e = [...this.getPanelIds()];
    if (this.currentPanelId, await this.discoverPanels(), this.getPanelIds().length > t)
      this.log(`🎉 发现新面板！从 ${t} 个增加到 ${this.getPanelIds().length} 个`), await this.createTabsUI();
    else if (this.getPanelIds().length < t) {
      this.log(`📉 面板数量减少！从 ${t} 个减少到 ${this.getPanelIds().length} 个`), this.log(`📋 旧面板列表: [${e.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`);
      const a = e[0], n = this.getPanelIds()[0];
      a && n && a !== n && (this.log(`🔄 第一个面板已变更: ${a} -> ${n}`), await this.handleFirstPanelChange(a, n)), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 更新持久化面板索引为: 0")), await this.createTabsUI();
    }
  }
  /**
   * 更新当前面板索引
   */
  async updateCurrentPanelIndex() {
    const t = document.querySelector(".orca-panel.active");
    if (t) {
      const e = t.getAttribute("data-panel-id");
      if (e && !e.startsWith("_")) {
        const a = this.getPanelIds().indexOf(e);
        if (a !== -1) {
          const n = this.currentPanelIndex;
          this.currentPanelIndex = a, this.currentPanelId = e, this.log(`🔄 面板索引更新: ${n} -> ${a} (面板ID: ${e})`), (!this.panelTabsData[a] || this.panelTabsData[a].length === 0) && (this.log(`🔍 面板 ${e} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(a, e || "")), this.debouncedUpdateTabsUI();
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
    }, 2e3), this.globalEventListener = async (t) => {
      await this.handleGlobalEvent(t);
    }, document.addEventListener("click", this.globalEventListener, { passive: !1 }), document.addEventListener("contextmenu", this.globalEventListener, { passive: !1 });
  }
  /**
   * 聚焦到上一个面板
   */
  focusToPreviousPanel() {
    const t = this.getPanelIds();
    if (t.length <= 1) {
      this.log("⚠️ 只有一个面板，无法切换到上一个面板");
      return;
    }
    const e = this.currentPanelIndex;
    if (e <= 0) {
      this.log("⚠️ 当前面板是第一个面板，无法切换到上一个面板");
      return;
    }
    const a = e - 1, n = t[a];
    if (!n) {
      this.log("⚠️ 未找到上一个面板");
      return;
    }
    this.log(`🔄 聚焦到上一个面板: ${n} (索引: ${a})`);
    const i = document.querySelector(`.orca-panel[data-panel-id="${n}"]`);
    if (!i) {
      this.log(`❌ 未找到面板元素: ${n}`);
      return;
    }
    const o = document.querySelector(".orca-panel.active");
    o && o.classList.remove("active"), i.classList.add("active"), this.currentPanelIndex = a, this.currentPanelId = n, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${n}`);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 事件处理 - Event Handling */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 统一的全局事件处理器
   */
  async handleGlobalEvent(t) {
    switch (t.type) {
      case "click":
        await this.handleClickEvent(t);
        break;
      case "contextmenu":
        await this.handleContextMenuEvent(t);
        break;
    }
  }
  /**
   * 处理点击事件
   */
  async handleClickEvent(t) {
    const e = t.target, a = this.getBlockRefId(e);
    if (a) {
      t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), t.ctrlKey || t.metaKey ? (this.log(`🔗 检测到 Ctrl+点击 块引用: ${a}，将在后台新建标签页`), await this.openInNewTab(a)) : (this.log(`🔗 检测到直接点击 块引用: ${a}，将替换当前标签页`), await this.createBlockAfterFocused(a));
      return;
    }
    if (e.closest(".orca-tabs-plugin")) {
      if (e.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
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
  async handleContextMenuEvent(t) {
    const e = t.target, a = this.getBlockRefId(e);
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
    const t = document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])');
    if (Array.from(t).filter((c) => {
      const l = c.getAttribute("data-panel-id");
      return l && !l.startsWith("_");
    }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
      this.verboseLog("📋 面板数量未变化，跳过面板发现");
      return;
    }
    const a = [...this.getPanelIds()], n = this.getPanelIds()[0] || null;
    await this.discoverPanels();
    const i = this.getPanelIds()[0] || null, o = ca(a, this.getPanelIds());
    o && (this.log(`📋 面板列表发生变化: ${a.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${a.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${n} -> ${i}`), n !== i && (this.log(`🔄 持久化面板已变更: ${n} -> ${i}`), await this.handlePersistentPanelChange(n, i))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
    const s = document.querySelector(".orca-panel.active");
    if (s) {
      const c = s.getAttribute("data-panel-id");
      if (c && !c.startsWith("_") && (c !== this.currentPanelId || o)) {
        const l = this.currentPanelIndex, d = this.getPanelIds().indexOf(c);
        d !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId || ""} -> ${c} (索引: ${l} -> ${d})`), this.currentPanelIndex = d, this.currentPanelId = c, await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI());
      }
    }
  }
  /**
   * 处理持久化面板变更（当需要持久化的面板发生变化时）
   */
  async handlePersistentPanelChange(t, e) {
    if (this.log(`🔄 处理持久化面板变更: ${t} -> ${e}`), e)
      if (t !== e) {
        this.log("🔍 持久化面板发生变化，重新扫描标签");
        const a = this.panelTabsData[0] || [];
        a.length > 0 ? (this.log(`✅ 新持久化面板 ${e} (索引: 0) 已有标签数据，直接使用`), this.panelTabsData[0] = [...a]) : (this.log(`🔍 新持久化面板 ${e} (索引: 0) 没有标签数据，重新扫描`), await this.scanPersistentPanel(e)), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的标签"), await this.updateTabsUI(), this.log(`✅ 持久化面板变更处理完成，当前有 ${this.getCurrentPanelTabs().length} 个标签`);
      } else
        this.log("✅ 持久化面板未变化，保持现有标签数据");
    else
      this.log("🗑️ 没有持久化面板，清空标签数据"), this.panelTabsData[0] = [], await this.saveFirstPanelTabs(), await this.updateTabsUI();
  }
  /**
   * 扫描持久化面板的标签
   */
  async scanPersistentPanel(t) {
    const e = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!e) {
      this.warn(`❌ 未找到持久化面板: ${t}`);
      return;
    }
    const a = e.querySelectorAll(".orca-hideable"), n = [];
    let i = 0;
    for (const o of a) {
      const s = o.querySelector(".orca-block-editor");
      if (!s) continue;
      const c = s.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, t, i++);
      l && n.push(l);
    }
    this.panelTabsData[0] = [...n], this.panelTabsData[0] = [...n], this.log(`📋 持久化面板 ${t} (索引: 0) 扫描并保存了 ${n.length} 个标签页`);
  }
  /**
   * 扫描指定面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描DOM并存储到panelTabsData数组
   */
  async scanPanelTabsByIndex(t, e) {
    const a = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!a) {
      this.warn(`❌ 未找到面板: ${e}`);
      return;
    }
    const n = a.querySelectorAll(".orca-block-editor[data-block-id]"), i = [];
    let o = 0;
    this.log(`🔍 扫描面板 ${e}，找到 ${n.length} 个块编辑器`);
    for (const c of n) {
      const l = c.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, e, o++);
      d && (i.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    t >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[t] = [...i], this.log(`📋 面板 ${e} (索引: ${t}) 扫描了 ${i.length} 个标签页`);
    const s = t === 0 ? y.FIRST_PANEL_TABS : `panel_${t + 1}_tabs`;
    await this.savePanelTabsByKey(s, i);
  }
  /**
   * 保存指定面板的标签页数据
   */
  async savePanelTabs(t, e) {
    await this.tabStorageService.savePanelTabs(t, e);
  }
  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(t, e) {
    await this.tabStorageService.savePanelTabsByKey(t, e);
  }
  /**
   * 合并当前聚焦面板的标签页到已加载的数据中
   */
  async mergeCurrentPanelTabs(t, e) {
    const a = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!a) {
      this.warn(`❌ 未找到面板: ${e}`);
      return;
    }
    const n = a.querySelectorAll(".orca-block-editor[data-block-id]"), i = [];
    let o = 0;
    this.log(`🔍 扫描当前聚焦面板 ${e}，找到 ${n.length} 个块编辑器`);
    for (const l of n) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const h = await this.getTabInfo(d, e, o++);
      h && (i.push(h), this.log(`📋 找到当前标签页: ${h.title} (${d})`));
    }
    const s = this.panelTabsData[t] || [];
    this.log(`📋 已加载的标签页: ${s.length} 个，当前标签页: ${i.length} 个`);
    const c = [...s];
    for (const l of i)
      c.push(l), this.log(`➕ 添加当前标签页: ${l.title}`);
    this.panelTabsData[t] = [...c], this.log(`📋 合并后标签页总数: ${c.length} 个`);
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
    const t = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId || ""}"]`);
    if (!t) {
      this.warn(`❌ 未找到当前面板: ${this.currentPanelId || ""}`);
      return;
    }
    const e = t.querySelectorAll(".orca-hideable"), a = [];
    let n = 0;
    for (const o of e) {
      const s = o.querySelector(".orca-block-editor");
      if (!s) continue;
      const c = s.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId || "", n++);
      l && a.push(l);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...a], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页`);
    const i = this.currentPanelIndex === 0 ? y.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(i, a);
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(t, e) {
    this.log(`🔄 处理第一个面板变更: ${t} -> ${e}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ""}, currentPanelIndex=${this.currentPanelIndex}`);
    const a = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${a.length} 个标签页`), a.length > 0 ? (this.log(`📋 迁移当前面板的 ${a.length} 个标签页到持久化存储`), this.panelTabsData[0] = [...a], this.log("🔄 持久化面板索引已简化，不再需要更新")) : (this.log("🗑️ 当前面板没有标签数据，清空并重新扫描"), this.panelTabsData[0] = [], await this.scanFirstPanel()), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`), this.log("✅ 持久化标签页:", this.getCurrentPanelTabs().map((n) => `${n.title}(${n.blockId})`));
  }
  /**
   * 更新UI元素位置
   */
  updateUIPositions() {
    if (this.tabContainer) {
      const t = this.isVerticalMode ? this.verticalPosition : this.position;
      this.tabContainer.style.left = t.x + "px", this.tabContainer.style.top = t.y + "px";
    }
  }
  /**
   * 重置插件缓存
   */
  async resetCache() {
    this.log("🔄 开始重置插件缓存..."), this.panelTabsData[0] = [], this.closedTabs.clear(), await this.tabStorageService.clearCache(), this.getPanelIds().length > 0 && (this.log("🔍 重新扫描第一个面板..."), await this.scanFirstPanel(), await this.saveFirstPanelTabs()), await this.updateTabsUI(), this.log("✅ 插件缓存重置完成");
  }
  destroy() {
    this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
    const t = document.getElementById("orca-tabs-drag-styles");
    t && t.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null;
  }
  /**
   * 显示最近关闭的标签页菜单
   */
  async showRecentlyClosedTabsMenu(t) {
    if (this.recentlyClosedTabs.length === 0) {
      orca.notify("info", "没有最近关闭的标签页");
      return;
    }
    const e = t ? { x: t.clientX, y: t.clientY } : { x: 0, y: 0 }, a = this.recentlyClosedTabs.map((n, i) => ({
      label: `${n.title}`,
      icon: n.icon || this.getBlockTypeIcon(n.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(n, i)
    }));
    a.push({
      label: "清空最近关闭列表",
      icon: "ti ti-trash",
      onClick: () => this.clearRecentlyClosedTabs()
    }), this.createRecentlyClosedTabsMenu(a, e);
  }
  /**
   * 创建最近关闭标签页菜单
   */
  createRecentlyClosedTabsMenu(t, e) {
    var d, h;
    const a = document.querySelector(".recently-closed-tabs-menu");
    a && a.remove();
    const n = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", i = document.createElement("div");
    i.className = "recently-closed-tabs-menu", i.style.cssText = `
      position: fixed;
      left: ${e.x}px;
      top: ${e.y}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: 280px;
      max-height: 350px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, t.forEach((u, g) => {
      if (u.label === "---") {
        const p = document.createElement("div");
        p.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, i.appendChild(p);
        return;
      }
      const b = document.createElement("div");
      if (b.className = "recently-closed-menu-item", b.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${n ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, u.icon) {
        const p = document.createElement("div");
        if (p.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${n ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, u.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = u.icon, p.appendChild(x);
        } else
          p.textContent = u.icon;
        b.appendChild(p);
      }
      const m = document.createElement("span");
      m.textContent = u.label, m.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, b.appendChild(m), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.addEventListener("click", () => {
        u.onClick(), i.remove();
      }), i.appendChild(b);
    }), document.body.appendChild(i);
    const o = i.getBoundingClientRect(), s = window.innerWidth, c = window.innerHeight;
    o.right > s && (i.style.left = `${s - o.width - 10}px`), o.bottom > c && (i.style.top = `${c - o.height - 10}px`);
    const l = (u) => {
      i.contains(u.target) || (i.remove(), document.removeEventListener("click", l), document.removeEventListener("contextmenu", l));
    };
    setTimeout(() => {
      document.addEventListener("click", l), document.addEventListener("contextmenu", l);
    }, 0);
  }
  /**
   * 恢复最近关闭的标签页
   */
  async restoreRecentlyClosedTab(t, e) {
    try {
      this.recentlyClosedTabs.splice(e, 1), await this.saveRecentlyClosedTabs(), this.closedTabs.delete(t.blockId), await this.saveClosedTabs(), await this.addTabToPanel(t.blockId, "end", !0), this.log(`🔄 已恢复最近关闭的标签页: "${t.title}"`), orca.notify("success", `已恢复标签页: ${t.title}`);
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
    } catch (t) {
      this.error("清空最近关闭标签页列表失败:", t), orca.notify("error", "清空失败");
    }
  }
  /**
   * 显示保存的标签页集合菜单
   */
  async showSavedTabSetsMenu(t) {
    if (this.savedTabSets.length === 0) {
      orca.notify("info", "没有保存的标签页集合");
      return;
    }
    const e = t ? { x: t.clientX, y: t.clientY } : { x: 100, y: 100 }, a = [];
    this.previousTabSet && this.previousTabSet.length > 0 && (a.push({
      label: `回到上一个标签集合 (${this.previousTabSet.length}个标签)`,
      icon: "ti ti-arrow-left",
      onClick: () => this.restorePreviousTabSet()
    }), a.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    })), this.savedTabSets.forEach((n, i) => {
      a.push({
        label: `${n.name} (${n.tabs.length}个标签)`,
        icon: n.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(n, i)
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
    }), this.createRecentlyClosedTabsMenu(a, e);
  }
  /**
   * 显示多标签页保存菜单
   */
  async showMultiTabSavingMenu(t) {
    const e = t ? { x: t.clientX, y: t.clientY } : { x: 0, y: 0 }, a = [];
    a.push({
      label: "保存当前标签页",
      icon: "ti ti-plus",
      onClick: () => this.saveCurrentTabs()
    }), this.savedTabSets.length > 0 && (a.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), this.savedTabSets.forEach((n, i) => {
      a.push({
        label: `${n.name} (${n.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(n, i)
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
    })), this.createMultiTabSavingMenu(a, e);
  }
  /**
   * 创建多标签页保存菜单
   */
  createMultiTabSavingMenu(t, e) {
    var d, h;
    const a = document.querySelector(".multi-tab-saving-menu");
    a && a.remove();
    const n = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", i = document.createElement("div");
    i.className = "multi-tab-saving-menu", i.style.cssText = `
      position: fixed;
      left: ${e.x}px;
      top: ${e.y}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: 300px;
      max-height: 400px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, t.forEach((u, g) => {
      if (u.label === "---") {
        const p = document.createElement("div");
        p.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, i.appendChild(p);
        return;
      }
      const b = document.createElement("div");
      if (b.className = "multi-tab-saving-menu-item", b.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${n ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, u.icon) {
        const p = document.createElement("div");
        if (p.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${n ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, u.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = u.icon, p.appendChild(x);
        } else
          p.textContent = u.icon;
        b.appendChild(p);
      }
      const m = document.createElement("span");
      m.textContent = u.label, m.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, b.appendChild(m), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.addEventListener("click", () => {
        u.onClick(), i.remove();
      }), i.appendChild(b);
    }), document.body.appendChild(i);
    const o = i.getBoundingClientRect(), s = window.innerWidth, c = window.innerHeight;
    o.right > s && (i.style.left = `${s - o.width - 10}px`), o.bottom > c && (i.style.top = `${c - o.height - 10}px`);
    const l = (u) => {
      i.contains(u.target) || (i.remove(), document.removeEventListener("click", l), document.removeEventListener("contextmenu", l));
    };
    setTimeout(() => {
      document.addEventListener("click", l), document.addEventListener("contextmenu", l);
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
    const t = document.querySelector(".save-tabset-dialog");
    t && t.remove();
    const e = document.createElement("div");
    e.className = "save-tabset-dialog", e.style.cssText = `
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
    `, e.addEventListener("click", (C) => {
      C.stopPropagation();
    });
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, a.textContent = "保存标签页集合", e.appendChild(a);
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 0 20px;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    `;
    const o = document.createElement("button");
    o.className = "orca-button orca-button-secondary", o.textContent = "创建新标签组", o.style.cssText = "flex: 1;";
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "更新已有标签组", s.style.cssText = "flex: 1;";
    let c = !1;
    const l = () => {
      c = !1, o.className = "orca-button orca-button-secondary", o.style.cssText = "flex: 1;", s.className = "orca-button", s.style.cssText = "flex: 1;", h.style.display = "block", b.style.display = "none", S();
    }, d = () => {
      c = !0, s.className = "orca-button orca-button-secondary", s.style.cssText = "flex: 1;", o.className = "orca-button", o.style.cssText = "flex: 1;", h.style.display = "none", b.style.display = "block", S();
    };
    o.onclick = l, s.onclick = d, i.appendChild(o), i.appendChild(s), n.appendChild(i);
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
    const g = document.createElement("input");
    g.type = "text", g.value = `标签页集合 ${this.savedTabSets.length + 1}`, g.style.cssText = `
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
    `, g.addEventListener("focus", () => {
      g.style.borderColor = "var(--orca-color-primary-5)";
    }), g.addEventListener("blur", () => {
      g.style.borderColor = "#ddd";
    }), g.addEventListener("input", (C) => {
    }), h.appendChild(g);
    const b = document.createElement("div");
    b.style.cssText = `
      display: none;
    `;
    const m = document.createElement("label");
    m.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, m.textContent = "请选择要更新的标签页集合:", b.appendChild(m);
    const p = document.createElement("select");
    p.style.cssText = `
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
    `, p.addEventListener("focus", () => {
      p.style.borderColor = "var(--orca-color-primary-5)";
    }), p.addEventListener("blur", () => {
      p.style.borderColor = "#ddd";
    });
    const x = document.createElement("option");
    x.value = "", x.textContent = "请选择标签页集合...", p.appendChild(x), this.savedTabSets.forEach((C, N) => {
      const O = document.createElement("option");
      O.value = N.toString(), O.textContent = `${C.name} (${C.tabs.length}个标签)`, p.appendChild(O);
    }), b.appendChild(p), n.appendChild(h), n.appendChild(b), e.appendChild(n);
    const v = document.createElement("div");
    v.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const T = document.createElement("button");
    T.className = "orca-button", T.textContent = "取消", T.style.cssText = "", T.addEventListener("mouseenter", () => {
      T.style.backgroundColor = "#4b5563";
    }), T.addEventListener("mouseleave", () => {
      T.style.backgroundColor = "#6b7280";
    }), T.onclick = () => {
      e.remove(), this.manageSavedTabSets();
    };
    const k = document.createElement("button");
    k.className = "orca-button orca-button-primary", k.textContent = "保存", k.style.cssText = "", k.addEventListener("mouseenter", () => {
      k.style.backgroundColor = "#2563eb";
    }), k.addEventListener("mouseleave", () => {
      k.style.backgroundColor = "var(--orca-color-primary-5)";
    });
    const S = () => {
      k.textContent = c ? "更新" : "保存";
    };
    k.onclick = async () => {
      if (c) {
        const C = parseInt(p.value);
        if (isNaN(C) || C < 0 || C >= this.savedTabSets.length) {
          orca.notify("warn", "请选择要更新的标签页集合");
          return;
        }
        e.remove(), await this.performUpdateTabSet(C);
      } else {
        const C = g.value.trim();
        if (!C) {
          orca.notify("warn", "请输入名称");
          return;
        }
        e.remove(), await this.performSaveTabSet(C);
      }
    }, v.appendChild(T), v.appendChild(k), e.appendChild(v), document.body.appendChild(e), setTimeout(() => {
      g.focus(), g.select();
    }, 100), g.addEventListener("keydown", (C) => {
      C.key === "Enter" ? (C.preventDefault(), k.click()) : C.key === "Escape" && (C.preventDefault(), T.click());
    });
    const $ = (C) => {
      e.contains(C.target) || (e.remove(), document.removeEventListener("click", $));
    };
    setTimeout(() => {
      document.addEventListener("click", $);
    }, 200);
  }
  /**
   * 执行保存标签页集合
   */
  async performSaveTabSet(t) {
    try {
      const e = this.getCurrentPanelTabs(), a = {
        id: `tabset_${Date.now()}`,
        name: t,
        tabs: [...e],
        // 深拷贝当前标签页
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.savedTabSets.push(a), await this.saveSavedTabSets(), this.log(`💾 已保存标签页集合: "${t}" (${e.length}个标签)`), orca.notify("success", `已保存标签页集合: ${t}`);
    } catch (e) {
      this.error("保存标签页集合失败:", e), orca.notify("error", "保存失败");
    }
  }
  /**
   * 执行更新已有标签页集合
   */
  async performUpdateTabSet(t) {
    try {
      const e = this.getCurrentPanelTabs(), a = this.savedTabSets[t];
      if (!a) {
        orca.notify("error", "标签页集合不存在");
        return;
      }
      a.tabs = [...e], a.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已更新标签页集合: "${a.name}" (${e.length}个标签)`), orca.notify("success", `已更新标签页集合: ${a.name}`);
    } catch (e) {
      this.error("更新标签页集合失败:", e), orca.notify("error", "更新失败");
    }
  }
  /**
   * 显示添加到已有标签组的对话框
   */
  showAddToTabGroupDialog(t) {
    const e = document.querySelector(".add-to-tabgroup-dialog");
    e && e.remove();
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
    `, a.addEventListener("click", (g) => {
      g.stopPropagation();
    });
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, n.textContent = "添加到已有标签组", a.appendChild(n);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 0 20px;
    `;
    const o = document.createElement("label");
    o.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, o.textContent = `将标签页 "${t.title}" 添加到:`, i.appendChild(o);
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
    c.value = "", c.textContent = "请选择标签组...", s.appendChild(c), this.savedTabSets.forEach((g, b) => {
      const m = document.createElement("option");
      m.value = b.toString(), m.textContent = `${g.name} (${g.tabs.length}个标签)`, s.appendChild(m);
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
      const g = parseInt(s.value);
      if (isNaN(g) || g < 0 || g >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      a.remove(), await this.addTabToGroup(t, g);
    }, l.appendChild(d), l.appendChild(h), a.appendChild(l), document.body.appendChild(a), setTimeout(() => {
      s.focus();
    }, 100), s.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), h.click()) : g.key === "Escape" && (g.preventDefault(), d.click());
    });
    const u = (g) => {
      a.contains(g.target) || (a.remove(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
    }, 200);
  }
  /**
   * 将标签页添加到指定标签组
   */
  async addTabToGroup(t, e) {
    try {
      const a = this.savedTabSets[e];
      if (!a) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (a.tabs.find((i) => i.blockId === t.blockId)) {
        orca.notify("warn", "该标签页已在此标签组中");
        return;
      }
      a.tabs.push({ ...t }), a.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`➕ 已将标签页 "${t.title}" 添加到标签组: "${a.name}"`), orca.notify("success", `已添加到标签组: ${a.name}`);
    } catch (a) {
      this.error("添加标签页到标签组失败:", a), orca.notify("error", "添加失败");
    }
  }
  /**
   * 加载保存的标签页集合
   */
  async loadSavedTabSet(t, e) {
    try {
      const a = this.getCurrentPanelTabs();
      this.previousTabSet = [...a], a.length = 0;
      for (const n of t.tabs) {
        const i = { ...n, panelId: this.currentPanelId || "" };
        a.push(i);
      }
      this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), t.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已加载标签页集合: "${t.name}" (${t.tabs.length}个标签)`), orca.notify("success", `已加载标签页集合: ${t.name}`);
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
      const t = this.getCurrentPanelTabs(), e = [...t];
      t.length = 0;
      for (const a of this.previousTabSet) {
        const n = { ...a, panelId: this.currentPanelId || "" };
        t.push(n);
      }
      this.previousTabSet = e, this.syncCurrentTabsToStorage(t), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`🔄 已回到上一个标签集合 (${this.previousTabSet.length}个标签)`), orca.notify("success", "已回到上一个标签集合");
    } catch (t) {
      this.error("回到上一个标签集合失败:", t), orca.notify("error", "恢复失败");
    }
  }
  /**
   * 重新渲染可排序的标签列表
   */
  renderSortableTabs(t, e, a) {
    var o, s;
    const n = document.documentElement.classList.contains("dark") || ((s = (o = window.orca) == null ? void 0 : o.state) == null ? void 0 : s.themeMode) === "dark";
    t.innerHTML = "";
    let i = -1;
    e.forEach((c, l) => {
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
        const p = document.createElement("div");
        if (p.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${n ? "#cccccc" : "#666"};
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `, c.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = c.icon, p.appendChild(x);
        } else
          p.textContent = c.icon;
        d.appendChild(p);
      }
      const u = document.createElement("div");
      u.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 20px;
      `;
      let g = `
        <div style="font-size: 14px; color: var(--orca-color-text-1); font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${c.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${c.blockId}</div>
      `;
      u.innerHTML = g, d.appendChild(u);
      const b = document.createElement("div");
      b.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;
      const m = document.createElement("div");
      m.style.cssText = `
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
      `, m.textContent = (l + 1).toString(), b.appendChild(m), d.appendChild(b), d.addEventListener("dragstart", (p) => {
        console.log("拖拽开始，索引:", l), i = l, p.dataTransfer.setData("text/plain", l.toString()), p.dataTransfer.setData("application/json", JSON.stringify(c)), p.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (p) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", i = -1;
      }), d.addEventListener("dragover", (p) => {
        p.preventDefault(), p.dataTransfer.dropEffect = "move", i !== -1 && i !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (p) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (p) => {
        p.preventDefault(), p.stopPropagation();
        const x = parseInt(p.dataTransfer.getData("text/plain")), v = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", x !== v && x >= 0) {
          const T = e[x];
          e.splice(x, 1), e.splice(v, 0, T), this.renderSortableTabs(t, e);
          const k = this.savedTabSets.find((S) => S.tabs === e);
          k && (k.tabs = [...e], k.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
      }), d.addEventListener("mouseenter", () => {
        i === -1 && (d.style.backgroundColor = "rgba(59, 130, 246, 0.05)", d.style.borderColor = "var(--orca-color-primary-5)");
      }), d.addEventListener("mouseleave", () => {
        i === -1 && (d.style.backgroundColor = "var(--orca-color-bg-1)", d.style.borderColor = "#e0e0e0");
      }), t.appendChild(d);
    });
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 工作区功能 - Workspace Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 加载工作区数据
   */
  async loadWorkspaces() {
    const { workspaces: t, enableWorkspaces: e } = await this.tabStorageService.loadWorkspaces();
    this.workspaces = t, this.enableWorkspaces = e, await this.clearCurrentWorkspace();
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
    var b, m;
    const t = document.querySelector(".save-workspace-dialog");
    t && t.remove();
    const e = document.documentElement.classList.contains("dark") || ((m = (b = window.orca) == null ? void 0 : b.state) == null ? void 0 : m.themeMode) === "dark", a = document.createElement("div");
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
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${e ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, i.textContent = "保存工作区";
    const o = document.createElement("div");
    o.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${e ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, o.textContent = "工作区名称:";
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
      color: ${e ? "#ffffff" : "#333"};
    `;
    const c = document.createElement("div");
    c.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${e ? "#ffffff" : "#333"};
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
      color: ${e ? "#ffffff" : "#333"};
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
      color: ${e ? "#999" : "#666"};
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
      const p = s.value.trim();
      if (!p) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((x) => x.name === p)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(p, l.value.trim()), a.remove();
    }, d.appendChild(h), d.appendChild(u), n.appendChild(i), n.appendChild(o), n.appendChild(s), n.appendChild(c), n.appendChild(l), n.appendChild(d), a.appendChild(n), document.body.appendChild(a), s.focus(), a.addEventListener("click", (p) => {
      p.target === a && a.remove();
    });
    const g = (p) => {
      p.key === "Escape" && (a.remove(), document.removeEventListener("keydown", g));
    };
    document.addEventListener("keydown", g);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(t, e) {
    try {
      const a = this.getCurrentPanelTabs(), n = this.getCurrentActiveTab(), i = {
        id: `workspace_${Date.now()}`,
        name: t,
        tabs: a,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: e || void 0,
        lastActiveTabId: n ? n.blockId : void 0
      };
      this.workspaces.push(i), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${t}" (${a.length}个标签)`), orca.notify("success", `工作区已保存: ${t}`);
    } catch (a) {
      this.error("保存工作区失败:", a), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(t) {
    var d, h;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const e = document.querySelector(".workspace-menu");
    e && e.remove();
    const a = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", n = document.createElement("div");
    n.className = "workspace-menu", n.style.cssText = `
      position: fixed;
      top: ${t ? t.clientY + 10 : 60}px;
      left: ${t ? t.clientX : 20}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: ${this.getNextDialogZIndex()};
      min-width: 200px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      padding: var(--orca-spacing-sm);
      border-bottom: 1px solid var(--orca-color-border);
      font-size: 14px;
      font-weight: 600;
      color: ${a ? "#ffffff" : "#333"};
    `, i.textContent = "工作区";
    const o = document.createElement("div");
    o.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--orca-color-border);
      color: ${a ? "#ffffff" : "#333"};
    `, o.innerHTML = `
      <i class="ti ti-plus" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
      <span>保存当前工作区</span>
    `, o.onclick = () => {
      n.remove(), this.saveCurrentWorkspace();
    };
    const s = document.createElement("div");
    if (s.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const u = document.createElement("div");
      u.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${a ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, u.textContent = "暂无工作区", s.appendChild(u);
    } else
      this.workspaces.forEach((u) => {
        const g = document.createElement("div");
        g.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--orca-color-border);
          color: ${a ? "#ffffff" : "#333"};
          ${this.currentWorkspace === u.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const b = u.icon || "ti ti-folder";
        g.innerHTML = `
          <i class="${b}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: ${a ? "#ffffff" : "#333"};"">${u.name}</div>
            ${u.description ? `<div style="font-size: 12px; color: ${a ? "#999" : "#666"}; margin-top: 2px;">${u.description}</div>` : ""}
            <div style="font-size: 11px; color: ${a ? "#777" : "#999"}; margin-top: 2px;">${u.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === u.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ""}
        `, g.onclick = () => {
          n.remove(), this.switchToWorkspace(u.id);
        }, s.appendChild(g);
      });
    const c = document.createElement("div");
    c.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${a ? "#ffffff" : "#333"};
    `, c.innerHTML = `
      <i class="ti ti-settings" style="font-size: 14px; color: ${a ? "#999" : "#666"};"></i>
      <span>管理工作区</span>
    `, c.onclick = () => {
      n.remove(), this.manageWorkspaces();
    }, n.appendChild(i), n.appendChild(o), n.appendChild(s), n.appendChild(c), document.body.appendChild(n);
    const l = (u) => {
      n.contains(u.target) || (n.remove(), document.removeEventListener("click", l));
    };
    setTimeout(() => {
      document.addEventListener("click", l);
    }, 100);
  }
  /**
   * 切换到指定工作区
   */
  async switchToWorkspace(t) {
    try {
      const e = this.workspaces.find((a) => a.id === t);
      if (!e) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace && await this.saveCurrentTabsToWorkspace(), this.currentWorkspace = t, await this.saveWorkspaces(), await this.tabStorageService.saveWorkspaces(this.workspaces, t, this.enableWorkspaces), await this.replaceCurrentTabsWithWorkspace(e.tabs, e), this.log(`🔄 已切换到工作区: "${e.name}"`), orca.notify("success", `已切换到工作区: ${e.name}`);
    } catch (e) {
      this.error("切换工作区失败:", e), orca.notify("error", "切换工作区失败");
    }
  }
  /**
   * 用工作区的标签页完全替换当前标签页
   */
  async replaceCurrentTabsWithWorkspace(t, e) {
    try {
      this.panelTabsData[0] = [], this.panelTabsData[1] = [];
      const a = [];
      for (const i of t)
        try {
          const o = await this.getTabInfo(i.blockId, this.currentPanelId || "", a.length);
          o ? (o.isPinned = i.isPinned, o.order = i.order, o.scrollPosition = i.scrollPosition, a.push(o)) : a.push(i);
        } catch (o) {
          this.warn(`无法更新标签页信息 ${i.title}:`, o), a.push(i);
        }
      this.panelTabsData[0] = a, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...a], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const n = e.lastActiveTabId;
      setTimeout(async () => {
        if (a.length > 0) {
          let i = a[0];
          if (n) {
            const o = a.find((s) => s.blockId === n);
            o ? (i = o, this.log(`🎯 导航到工作区中最后激活的标签页: ${i.title} (ID: ${n})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${i.title}`);
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
    const t = this.getCurrentActiveTab();
    t && (await this.updateCurrentWorkspaceActiveIndex(t), this.log(`🔄 页面加载完成后更新工作区最后激活标签页: ${t.title}`));
  }
  /**
   * 实时更新当前工作区的最后激活标签页
   */
  async updateCurrentWorkspaceActiveIndex(t) {
    if (!this.currentWorkspace) return;
    const e = this.workspaces.find((a) => a.id === this.currentWorkspace);
    e && (e.lastActiveTabId = t.blockId, e.updatedAt = Date.now(), await this.saveWorkspaces(), this.log(`🔄 实时更新工作区最后激活标签页: ${t.title} (ID: ${t.blockId})`));
  }
  /**
   * 保存当前标签页到当前工作区
   */
  async saveCurrentTabsToWorkspace() {
    if (!this.currentWorkspace) return;
    const t = this.workspaces.find((e) => e.id === this.currentWorkspace);
    if (t) {
      const e = this.getCurrentPanelTabs(), a = this.getCurrentActiveTab();
      t.tabs = e, t.lastActiveTabId = a ? a.blockId : void 0, t.updatedAt = Date.now(), await this.saveWorkspaces();
    }
  }
  /**
   * 管理工作区
   */
  manageWorkspaces() {
    var d, h;
    const t = document.querySelector(".manage-workspaces-dialog");
    t && t.remove();
    const e = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", a = document.createElement("div");
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
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${e ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, i.textContent = "管理工作区";
    const o = document.createElement("div");
    if (o.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
    `, this.workspaces.length === 0) {
      const u = document.createElement("div");
      u.style.cssText = `
        padding: 40px;
        text-align: center;
        color: ${e ? "#999" : "#666"};
        font-size: 14px;
      `, u.textContent = "暂无工作区", o.appendChild(u);
    } else
      this.workspaces.forEach((u) => {
        const g = document.createElement("div");
        g.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          margin-bottom: 8px;
          background: ${this.currentWorkspace === u.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)"};
        `;
        const b = u.icon || "ti ti-folder";
        g.innerHTML = `
          <i class="${b}" style="font-size: 20px; color: var(--orca-color-primary-5); margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; color: ${e ? "#ffffff" : "#333"};"">${u.name}</div>
            ${u.description ? `<div style="font-size: 12px; color: ${e ? "#999" : "#666"}; margin-bottom: 4px;">${u.description}</div>` : ""}
            <div style="font-size: 11px; color: ${e ? "#777" : "#999"};"">${u.tabs.length}个标签 • 创建于 ${new Date(u.createdAt).toLocaleString()}</div>
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
        `, o.appendChild(g);
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
      color: ${e ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, c.textContent = "关闭", c.onclick = () => {
      a.remove();
    }, s.appendChild(c), n.appendChild(i), n.appendChild(o), n.appendChild(s), a.appendChild(n), document.body.appendChild(a), a.querySelectorAll(".delete-workspace-btn").forEach((u) => {
      u.addEventListener("click", async (g) => {
        const b = g.target.getAttribute("data-workspace-id");
        b && (await this.deleteWorkspace(b), a.remove(), this.manageWorkspaces());
      });
    }), a.addEventListener("click", (u) => {
      u.target === a && a.remove();
    });
  }
  /**
   * 删除工作区
   */
  async deleteWorkspace(t) {
    try {
      const e = this.workspaces.find((a) => a.id === t);
      if (!e) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace === t && (this.currentWorkspace = null), this.workspaces = this.workspaces.filter((a) => a.id !== t), await this.saveWorkspaces(), this.log(`🗑️ 工作区已删除: "${e.name}"`), orca.notify("success", `工作区已删除: ${e.name}`);
    } catch (e) {
      this.error("删除工作区失败:", e), orca.notify("error", "删除工作区失败");
    }
  }
  /**
   * 显示标签集合详情
   */
  showTabSetDetails(t, e) {
    var h, u;
    document.documentElement.classList.contains("dark") || ((u = (h = window.orca) == null ? void 0 : h.state) == null || u.themeMode);
    const a = document.querySelector(".tabset-details-dialog");
    a && a.remove();
    const n = document.createElement("div");
    n.className = "tabset-details-dialog", n.style.cssText = `
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
    `, i.textContent = `标签集合详情: ${t.name}`, n.appendChild(i);
    const o = document.createElement("div");
    o.style.cssText = `
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
        <strong>创建时间:</strong> ${new Date(t.createdAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>更新时间:</strong> ${new Date(t.updatedAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666;">
        <strong>标签数量:</strong> ${t.tabs.length}个
      </div>
    `, o.appendChild(s), t.tabs.length === 0) {
      const g = document.createElement("div");
      g.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `, g.textContent = "该标签集合为空", o.appendChild(g);
    } else {
      const g = document.createElement("div");
      g.style.cssText = `
        margin-bottom: 16px;
      `;
      const b = document.createElement("div");
      b.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const m = document.createElement("span");
      m.textContent = "包含的标签 (可拖拽排序):", b.appendChild(m);
      const p = document.createElement("span");
      p.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, p.textContent = "拖拽调整顺序", b.appendChild(p), g.appendChild(b);
      const x = document.createElement("div");
      x.className = "sortable-tabs-container", x.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(x, [...t.tabs], t), g.appendChild(x), o.appendChild(g);
    }
    n.appendChild(o);
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
      n.remove(), e && this.manageSavedTabSets();
    }, c.appendChild(l), n.appendChild(c), document.body.appendChild(n);
    const d = (g) => {
      n.contains(g.target) || (n.remove(), e && this.manageSavedTabSets(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(t, e, a) {
    const n = document.querySelector(".rename-tabset-dialog");
    n && n.remove();
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
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, o.textContent = "重命名标签集合", i.appendChild(o);
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
    l.type = "text", l.value = t.name, l.style.cssText = `
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
      const b = l.value.trim();
      if (!b) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (b === t.name) {
        i.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((p) => p.name === b && p.id !== t.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      t.name = b, t.updatedAt = Date.now(), await this.saveSavedTabSets(), i.remove(), a.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(h), d.appendChild(u), i.appendChild(d), document.body.appendChild(i), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (b) => {
      b.key === "Enter" ? (b.preventDefault(), u.click()) : b.key === "Escape" && (b.preventDefault(), h.click());
    });
    const g = (b) => {
      i.contains(b.target) || (i.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(t, e, a, n) {
    const i = document.createElement("input");
    i.type = "text", i.value = t.name, i.style.cssText = `
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
    const o = a.textContent;
    a.innerHTML = "", a.appendChild(i), i.addEventListener("click", (d) => {
      d.stopPropagation();
    }), i.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), i.focus(), i.select();
    const s = async () => {
      const d = i.value.trim();
      if (!d) {
        a.textContent = o;
        return;
      }
      if (d === t.name) {
        a.textContent = o;
        return;
      }
      if (this.savedTabSets.find((u) => u.name === d && u.id !== t.id)) {
        orca.notify("warn", "该名称已存在"), a.textContent = o;
        return;
      }
      t.name = d, t.updatedAt = Date.now(), await this.saveSavedTabSets(), a.textContent = d, orca.notify("success", "重命名成功");
    }, c = () => {
      a.textContent = o;
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
  async editTabSetIcon(t, e, a, n, i) {
    const o = document.createElement("div");
    o.style.cssText = `
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
    `, s.textContent = "选择图标", o.appendChild(s);
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
    `, l.forEach((b) => {
      const m = document.createElement("div");
      m.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border: 1px solid #e0e0e0;
        border-radius: var(--orca-radius-md);
        cursor: pointer;
        transition: all 0.2s;
        background: ${t.icon === b.value ? "#e3f2fd" : "white"};
      `;
      const p = document.createElement("div");
      if (p.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, b.value.startsWith("ti ti-")) {
        const v = document.createElement("i");
        v.className = b.value, p.appendChild(v);
      } else
        p.textContent = b.icon;
      const x = document.createElement("div");
      x.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, x.textContent = b.name, m.appendChild(p), m.appendChild(x), m.addEventListener("click", async (v) => {
        v.stopPropagation(), t.icon = b.value, t.updatedAt = Date.now(), await this.saveSavedTabSets(), n(), o.remove(), i && i.focus(), orca.notify("success", "图标已更新");
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "#f5f5f5", m.style.borderColor = "var(--orca-color-primary-5)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = t.icon === b.value ? "#e3f2fd" : "white", m.style.borderColor = "#e0e0e0";
      }), d.appendChild(m);
    }), c.appendChild(d), o.appendChild(c);
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
    }), u.onclick = (b) => {
      b.stopPropagation(), o.remove(), i && i.focus();
    }, h.appendChild(u), o.appendChild(h), document.body.appendChild(o);
    const g = (b) => {
      o.contains(b.target) || (b.stopPropagation(), o.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g), i && i.focus());
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
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
    const t = document.querySelector(".manage-saved-tabsets-dialog");
    t && t.remove();
    const e = document.createElement("div");
    e.className = "manage-saved-tabsets-dialog", e.style.cssText = `
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
    `, a.textContent = "管理保存的标签页集合", e.appendChild(a);
    const n = document.createElement("div");
    n.style.cssText = `
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
      const g = () => {
        if (u.innerHTML = "", c.icon)
          if (c.icon.startsWith("ti ti-")) {
            const S = document.createElement("i");
            S.className = c.icon, u.appendChild(S);
          } else
            u.textContent = c.icon;
        else
          u.textContent = "📁";
      };
      g(), u.addEventListener("click", () => {
        this.editTabSetIcon(c, l, u, g, e);
      }), u.addEventListener("mouseenter", () => {
        u.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), u.addEventListener("mouseleave", () => {
        u.style.backgroundColor = "transparent";
      });
      const b = document.createElement("div");
      b.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      `;
      const m = document.createElement("div");
      m.style.cssText = `
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
      `, m.textContent = c.name, m.title = "点击编辑名称", m.addEventListener("click", () => {
        this.editTabSetName(c, l, m, e);
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      });
      const p = document.createElement("div");
      p.style.cssText = `
        font-size: 12px;
        color: #666;
      `, p.textContent = `${c.tabs.length}个标签 • ${new Date(c.updatedAt).toLocaleString()}`, b.appendChild(m), b.appendChild(p), h.appendChild(u), h.appendChild(b);
      const x = document.createElement("div");
      x.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const v = document.createElement("button");
      v.className = "orca-button orca-button-primary", v.textContent = "加载", v.style.cssText = "", v.onclick = () => {
        this.loadSavedTabSet(c, l), e.remove();
      };
      const T = document.createElement("button");
      T.className = "orca-button", T.textContent = "查看", T.style.cssText = "", T.onclick = () => {
        this.showTabSetDetails(c, e);
      };
      const k = document.createElement("button");
      k.className = "orca-button", k.textContent = "删除", k.style.cssText = "", k.onclick = () => {
        confirm(`确定要删除标签页集合 "${c.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), e.remove(), this.manageSavedTabSets());
      }, x.appendChild(v), x.appendChild(T), x.appendChild(k), d.appendChild(h), d.appendChild(x), n.appendChild(d);
    }), e.appendChild(n);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const o = document.createElement("button");
    o.className = "orca-button", o.textContent = "关闭", o.style.cssText = "", o.addEventListener("mouseenter", () => {
      o.style.backgroundColor = "#4b5563";
    }), o.addEventListener("mouseleave", () => {
      o.style.backgroundColor = "#6b7280";
    }), o.onclick = () => e.remove(), i.appendChild(o), e.appendChild(i), document.body.appendChild(e);
    const s = (c) => {
      e.contains(c.target) || (e.remove(), document.removeEventListener("click", s), document.removeEventListener("contextmenu", s));
    };
    setTimeout(() => {
      document.addEventListener("click", s), document.addEventListener("contextmenu", s);
    }, 0);
  }
}
let I = null;
async function ha(r) {
  R = r, orca.state.locale, I = new la(R), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => I == null ? void 0 : I.init(), 500);
  }) : setTimeout(() => I == null ? void 0 : I.init(), 500), orca.commands.registerCommand(
    `${R}.resetCache`,
    async () => {
      I && await I.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${R}.toggleBlockIcons`,
    async () => {
      I && await I.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function ua() {
  I && (I.unregisterHeadbarButton(), I.cleanupDragResize(), I.destroy(), I = null), orca.commands.unregisterCommand(`${R}.resetCache`);
}
export {
  ha as load,
  ua as unload
};
