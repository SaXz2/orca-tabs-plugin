var xe = Object.defineProperty;
var Te = (s, e, t) => e in s ? xe(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var g = (s, e, t) => Te(s, typeof e != "symbol" ? e + "" : e, t);
const ue = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, he = {
  /** JSON数据类型 - 用于存储结构化数据 */
  JSON: 0,
  /** 文本数据类型 - 用于存储纯文本数据 */
  Text: 1
}, w = {
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
class we {
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
  async saveConfig(e, t, r = "orca-tabs-plugin") {
    try {
      const i = typeof t == "string" ? t : JSON.stringify(t);
      return await orca.plugins.setData(r, e, i), this.log(`💾 已保存插件数据 ${e}:`, t), !0;
    } catch (i) {
      return this.warn(`无法保存插件数据 ${e}，尝试降级到localStorage:`, i), this.saveToLocalStorage(e, t);
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
  async getConfig(e, t = "orca-tabs-plugin", r) {
    try {
      const i = await orca.plugins.getData(t, e);
      if (i == null)
        return r || null;
      let a;
      if (typeof i == "string")
        try {
          a = JSON.parse(i);
        } catch {
          a = i;
        }
      else
        a = i;
      return this.log(`📂 已读取插件数据 ${e}:`, a), a;
    } catch (i) {
      return this.warn(`无法读取插件数据 ${e}，尝试从localStorage读取:`, i), this.getFromLocalStorage(e, r);
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
    } catch (r) {
      return this.warn(`无法删除插件数据 ${e}，尝试从localStorage删除:`, r), this.removeFromLocalStorage(e);
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
      const r = this.getLocalStorageKey(e);
      return localStorage.setItem(r, JSON.stringify(t)), this.log(`💾 已降级保存到localStorage: ${r}`), !0;
    } catch (r) {
      return this.error("无法保存到localStorage:", r), !1;
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
      const r = this.getLocalStorageKey(e), i = localStorage.getItem(r);
      if (i) {
        const a = JSON.parse(i);
        return this.log(`📂 已从localStorage读取: ${r}`), a;
      }
      return t || null;
    } catch (r) {
      return this.error("无法从localStorage读取:", r), t || null;
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
      [w.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [w.SECOND_PANEL_TABS]: "orca-second-panel-tabs-api",
      [w.CLOSED_TABS]: "orca-closed-tabs-api",
      [w.RECENTLY_CLOSED_TABS]: "orca-recently-closed-tabs-api",
      [w.SAVED_TAB_SETS]: "orca-saved-tab-sets-api",
      [w.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [w.TABS_POSITION]: "orca-tabs-position-api",
      [w.LAYOUT_MODE]: "orca-tabs-layout-api",
      [w.FIXED_TO_TOP]: "orca-tabs-fixed-to-top-api"
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
      const r = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", r);
      const i = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(r) === JSON.stringify(i) ? "✅" : "❌"}`);
      const a = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", a);
      const n = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(a) === JSON.stringify(n) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
function B() {
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
function ke(s, e, t = 200) {
  const r = e ? t : 400, i = 40, a = window.innerWidth - r, n = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(s.x, a)),
    y: Math.max(0, Math.min(s.y, n))
  };
}
function Ce(s) {
  const e = B();
  return {
    isVerticalMode: s.isVerticalMode ?? e.isVerticalMode,
    verticalWidth: s.verticalWidth ?? e.verticalWidth,
    verticalPosition: s.verticalPosition ?? e.verticalPosition,
    horizontalPosition: s.horizontalPosition ?? e.horizontalPosition,
    isSidebarAlignmentEnabled: s.isSidebarAlignmentEnabled ?? e.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: s.isFloatingWindowVisible ?? e.isFloatingWindowVisible,
    showBlockTypeIcons: s.showBlockTypeIcons ?? e.showBlockTypeIcons,
    showInHeadbar: s.showInHeadbar ?? e.showInHeadbar
  };
}
function j(s, e, t) {
  return s ? { ...e } : { ...t };
}
function Pe(s, e, t, r) {
  return e ? {
    verticalPosition: { ...s },
    horizontalPosition: { ...r }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...s }
  };
}
function Ie(s) {
  return `布局模式: ${s.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${s.verticalWidth}px, 垂直位置: (${s.verticalPosition.x}, ${s.verticalPosition.y}), 水平位置: (${s.horizontalPosition.x}, ${s.horizontalPosition.y})`;
}
function pe(s, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${s.x}, ${s.y})`;
}
class Se {
  constructor(e, t, r) {
    g(this, "storageService");
    g(this, "pluginName");
    g(this, "log");
    g(this, "warn");
    g(this, "error");
    g(this, "verboseLog");
    this.storageService = e, this.pluginName = t, this.log = r.log, this.warn = r.warn, this.error = r.error, this.verboseLog = r.verboseLog;
  }
  // ==================== 标签页数据存储 ====================
  /**
   * 保存第一个面板的标签数据到持久化存储
   */
  async saveFirstPanelTabs(e) {
    try {
      await this.storageService.saveConfig(w.FIRST_PANEL_TABS, e, this.pluginName), this.log(`💾 保存第一个面板的 ${e.length} 个标签页数据到API配置`);
    } catch (t) {
      this.warn("无法保存第一个面板标签数据:", t);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(w.FIRST_PANEL_TABS, this.pluginName, []);
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
    } catch (r) {
      this.warn(`❌ 保存面板 ${e} 标签页数据失败:`, r);
    }
  }
  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(e, t) {
    try {
      await this.storageService.saveConfig(e, t, this.pluginName), this.verboseLog(`💾 已保存 ${e} 的标签页数据: ${t.length} 个`);
    } catch (r) {
      this.warn(`❌ 保存 ${e} 标签页数据失败:`, r);
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
      await this.storageService.saveConfig(w.CLOSED_TABS, Array.from(e), this.pluginName), this.log("💾 保存已关闭标签列表到API配置");
    } catch (t) {
      this.warn("无法保存已关闭标签列表:", t);
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  async restoreClosedTabs() {
    try {
      const e = await this.storageService.getConfig(w.CLOSED_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(w.RECENTLY_CLOSED_TABS, e, this.pluginName), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (t) {
      this.warn("无法保存最近关闭标签页列表:", t);
    }
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表
   */
  async restoreRecentlyClosedTabs() {
    try {
      const e = await this.storageService.getConfig(w.RECENTLY_CLOSED_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(w.SAVED_TAB_SETS, e, this.pluginName), this.log("💾 保存多标签页集合到API配置");
    } catch (t) {
      this.warn("无法保存多标签页集合:", t);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(w.SAVED_TAB_SETS, this.pluginName, []);
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
      const e = await this.storageService.getConfig(w.WORKSPACES), t = e && Array.isArray(e) ? e : [], r = await this.storageService.getConfig(w.ENABLE_WORKSPACES), i = typeof r == "boolean" ? r : !1;
      return this.log(`📁 已加载 ${t.length} 个工作区`), { workspaces: t, enableWorkspaces: i };
    } catch (e) {
      return this.error("加载工作区数据失败:", e), { workspaces: [], enableWorkspaces: !1 };
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces(e, t, r) {
    try {
      await this.storageService.saveConfig(w.WORKSPACES, e, this.pluginName), await this.storageService.saveConfig(w.CURRENT_WORKSPACE, t, this.pluginName), await this.storageService.saveConfig(w.ENABLE_WORKSPACES, r, this.pluginName), this.log("💾 工作区数据已保存");
    } catch (i) {
      this.error("保存工作区数据失败:", i);
    }
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    try {
      await this.storageService.saveConfig(w.CURRENT_WORKSPACE, null, this.pluginName), this.log("📁 已清除当前工作区状态");
    } catch (e) {
      this.error("清除当前工作区状态失败:", e);
    }
  }
  // ==================== 位置和布局配置 ====================
  /**
   * 保存位置信息
   */
  async savePosition(e, t, r, i) {
    try {
      const a = Pe(
        e,
        t,
        r,
        i
      );
      return await this.saveLayoutMode({
        isVerticalMode: t,
        verticalWidth: 0,
        // 这个值需要从外部传入
        verticalPosition: a.verticalPosition,
        horizontalPosition: a.horizontalPosition,
        isSidebarAlignmentEnabled: !1,
        // 这些值需要从外部传入
        isFloatingWindowVisible: !1,
        showBlockTypeIcons: !1,
        showInHeadbar: !1
      }), this.log(`💾 位置已保存: ${pe(e, t)}`), a;
    } catch {
      return this.warn("无法保存标签位置"), { verticalPosition: r, horizontalPosition: i };
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(e) {
    try {
      await this.storageService.saveConfig(w.LAYOUT_MODE, e, this.pluginName), this.log(`💾 布局模式已保存: ${e.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${e.verticalWidth}px, 垂直位置: (${e.verticalPosition.x}, ${e.verticalPosition.y}), 水平位置: (${e.horizontalPosition.x}, ${e.horizontalPosition.y})`);
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
        w.LAYOUT_MODE,
        this.pluginName,
        B()
      ), t = {
        ...B(),
        ...e
      };
      return this.log(`📂 恢复布局模式配置: ${t.isVerticalMode ? "垂直" : "水平"}`), t;
    } catch (e) {
      return this.warn("恢复布局模式配置失败:", e), B();
    }
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode(e) {
    try {
      const t = { isFixedToTop: e };
      await this.storageService.saveConfig(w.FIXED_TO_TOP, t, this.pluginName), this.log(`💾 固定到顶部状态已保存: ${e ? "启用" : "禁用"}`);
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
        w.FIXED_TO_TOP,
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
      await this.storageService.saveConfig(w.FLOATING_WINDOW_VISIBLE, e, this.pluginName), this.log(`💾 浮窗可见状态已保存: ${e ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("保存浮窗可见状态失败:", t);
    }
  }
  /**
   * 恢复浮窗可见状态
   */
  async restoreFloatingWindowVisible() {
    try {
      const t = await this.storageService.getConfig(w.FLOATING_WINDOW_VISIBLE, this.pluginName, !1) || !1;
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
      await this.storageService.removeConfig(w.FIRST_PANEL_TABS), await this.storageService.removeConfig(w.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
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
    for (let r = 0; r < e.length; r++) {
      const i = e.charCodeAt(r);
      t = (t << 5) - t + i, t = t & t;
    }
    return Math.abs(t).toString(36);
  }
}
const ge = 6048e5, Ee = 864e5, re = Symbol.for("constructDateFrom");
function S(s, e) {
  return typeof s == "function" ? s(e) : s && typeof s == "object" && re in s ? s[re](e) : s instanceof Date ? new s.constructor(e) : new Date(e);
}
function E(s, e) {
  return S(e || s, s);
}
function me(s, e, t) {
  const r = E(s, t == null ? void 0 : t.in);
  return isNaN(e) ? S(s, NaN) : (e && r.setDate(r.getDate() + e), r);
}
let $e = {};
function G() {
  return $e;
}
function H(s, e) {
  var o, c, l, d;
  const t = G(), r = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, i = E(s, e == null ? void 0 : e.in), a = i.getDay(), n = (a < r ? 7 : 0) + a - r;
  return i.setDate(i.getDate() - n), i.setHours(0, 0, 0, 0), i;
}
function Y(s, e) {
  return H(s, { ...e, weekStartsOn: 1 });
}
function be(s, e) {
  const t = E(s, e == null ? void 0 : e.in), r = t.getFullYear(), i = S(t, 0);
  i.setFullYear(r + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const a = Y(i), n = S(t, 0);
  n.setFullYear(r, 0, 4), n.setHours(0, 0, 0, 0);
  const o = Y(n);
  return t.getTime() >= a.getTime() ? r + 1 : t.getTime() >= o.getTime() ? r : r - 1;
}
function ie(s) {
  const e = E(s), t = new Date(
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
  return t.setUTCFullYear(e.getFullYear()), +s - +t;
}
function fe(s, ...e) {
  const t = S.bind(
    null,
    e.find((r) => typeof r == "object")
  );
  return e.map(t);
}
function Q(s, e) {
  const t = E(s, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function Me(s, e, t) {
  const [r, i] = fe(
    t == null ? void 0 : t.in,
    s,
    e
  ), a = Q(r), n = Q(i), o = +a - ie(a), c = +n - ie(n);
  return Math.round((o - c) / Ee);
}
function Le(s, e) {
  const t = be(s, e), r = S(s, 0);
  return r.setFullYear(t, 0, 4), r.setHours(0, 0, 0, 0), Y(r);
}
function ee(s) {
  return S(s, Date.now());
}
function te(s, e, t) {
  const [r, i] = fe(
    t == null ? void 0 : t.in,
    s,
    e
  );
  return +Q(r) == +Q(i);
}
function De(s) {
  return s instanceof Date || typeof s == "object" && Object.prototype.toString.call(s) === "[object Date]";
}
function Ae(s) {
  return !(!De(s) && typeof s != "number" || isNaN(+E(s)));
}
function Oe(s, e) {
  const t = E(s, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const ze = {
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
}, Be = (s, e, t) => {
  let r;
  const i = ze[s];
  return typeof i == "string" ? r = i : e === 1 ? r = i.one : r = i.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + r : r + " ago" : r;
};
function K(s) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : s.defaultWidth;
    return s.formats[t] || s.formats[s.defaultWidth];
  };
}
const We = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Ne = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Re = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Fe = {
  date: K({
    formats: We,
    defaultWidth: "full"
  }),
  time: K({
    formats: Ne,
    defaultWidth: "full"
  }),
  dateTime: K({
    formats: Re,
    defaultWidth: "full"
  })
}, qe = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, _e = (s, e, t, r) => qe[s];
function F(s) {
  return (e, t) => {
    const r = t != null && t.context ? String(t.context) : "standalone";
    let i;
    if (r === "formatting" && s.formattingValues) {
      const n = s.defaultFormattingWidth || s.defaultWidth, o = t != null && t.width ? String(t.width) : n;
      i = s.formattingValues[o] || s.formattingValues[n];
    } else {
      const n = s.defaultWidth, o = t != null && t.width ? String(t.width) : s.defaultWidth;
      i = s.values[o] || s.values[n];
    }
    const a = s.argumentCallback ? s.argumentCallback(e) : e;
    return i[a];
  };
}
const Ue = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, He = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Ve = {
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
}, je = {
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
}, Ye = {
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
}, Qe = {
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
}, Ge = (s, e) => {
  const t = Number(s), r = t % 100;
  if (r > 20 || r < 10)
    switch (r % 10) {
      case 1:
        return t + "st";
      case 2:
        return t + "nd";
      case 3:
        return t + "rd";
    }
  return t + "th";
}, Xe = {
  ordinalNumber: Ge,
  era: F({
    values: Ue,
    defaultWidth: "wide"
  }),
  quarter: F({
    values: He,
    defaultWidth: "wide",
    argumentCallback: (s) => s - 1
  }),
  month: F({
    values: Ve,
    defaultWidth: "wide"
  }),
  day: F({
    values: je,
    defaultWidth: "wide"
  }),
  dayPeriod: F({
    values: Ye,
    defaultWidth: "wide",
    formattingValues: Qe,
    defaultFormattingWidth: "wide"
  })
};
function q(s) {
  return (e, t = {}) => {
    const r = t.width, i = r && s.matchPatterns[r] || s.matchPatterns[s.defaultMatchWidth], a = e.match(i);
    if (!a)
      return null;
    const n = a[0], o = r && s.parsePatterns[r] || s.parsePatterns[s.defaultParseWidth], c = Array.isArray(o) ? Je(o, (u) => u.test(n)) : (
      // [TODO] -- I challenge you to fix the type
      Ke(o, (u) => u.test(n))
    );
    let l;
    l = s.valueCallback ? s.valueCallback(c) : c, l = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(l)
    ) : l;
    const d = e.slice(n.length);
    return { value: l, rest: d };
  };
}
function Ke(s, e) {
  for (const t in s)
    if (Object.prototype.hasOwnProperty.call(s, t) && e(s[t]))
      return t;
}
function Je(s, e) {
  for (let t = 0; t < s.length; t++)
    if (e(s[t]))
      return t;
}
function Ze(s) {
  return (e, t = {}) => {
    const r = e.match(s.matchPattern);
    if (!r) return null;
    const i = r[0], a = e.match(s.parsePattern);
    if (!a) return null;
    let n = s.valueCallback ? s.valueCallback(a[0]) : a[0];
    n = t.valueCallback ? t.valueCallback(n) : n;
    const o = e.slice(i.length);
    return { value: n, rest: o };
  };
}
const et = /^(\d+)(th|st|nd|rd)?/i, tt = /\d+/i, rt = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, it = {
  any: [/^b/i, /^(a|c)/i]
}, at = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, nt = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, st = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ot = {
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
}, ct = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, lt = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, dt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, ut = {
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
}, ht = {
  ordinalNumber: Ze({
    matchPattern: et,
    parsePattern: tt,
    valueCallback: (s) => parseInt(s, 10)
  }),
  era: q({
    matchPatterns: rt,
    defaultMatchWidth: "wide",
    parsePatterns: it,
    defaultParseWidth: "any"
  }),
  quarter: q({
    matchPatterns: at,
    defaultMatchWidth: "wide",
    parsePatterns: nt,
    defaultParseWidth: "any",
    valueCallback: (s) => s + 1
  }),
  month: q({
    matchPatterns: st,
    defaultMatchWidth: "wide",
    parsePatterns: ot,
    defaultParseWidth: "any"
  }),
  day: q({
    matchPatterns: ct,
    defaultMatchWidth: "wide",
    parsePatterns: lt,
    defaultParseWidth: "any"
  }),
  dayPeriod: q({
    matchPatterns: dt,
    defaultMatchWidth: "any",
    parsePatterns: ut,
    defaultParseWidth: "any"
  })
}, pt = {
  code: "en-US",
  formatDistance: Be,
  formatLong: Fe,
  formatRelative: _e,
  localize: Xe,
  match: ht,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function gt(s, e) {
  const t = E(s, e == null ? void 0 : e.in);
  return Me(t, Oe(t)) + 1;
}
function mt(s, e) {
  const t = E(s, e == null ? void 0 : e.in), r = +Y(t) - +Le(t);
  return Math.round(r / ge) + 1;
}
function ye(s, e) {
  var d, u, h, p;
  const t = E(s, e == null ? void 0 : e.in), r = t.getFullYear(), i = G(), a = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((u = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((p = (h = i.locale) == null ? void 0 : h.options) == null ? void 0 : p.firstWeekContainsDate) ?? 1, n = S((e == null ? void 0 : e.in) || s, 0);
  n.setFullYear(r + 1, 0, a), n.setHours(0, 0, 0, 0);
  const o = H(n, e), c = S((e == null ? void 0 : e.in) || s, 0);
  c.setFullYear(r, 0, a), c.setHours(0, 0, 0, 0);
  const l = H(c, e);
  return +t >= +o ? r + 1 : +t >= +l ? r : r - 1;
}
function bt(s, e) {
  var o, c, l, d;
  const t = G(), r = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((c = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : c.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, i = ye(s, e), a = S((e == null ? void 0 : e.in) || s, 0);
  return a.setFullYear(i, 0, r), a.setHours(0, 0, 0, 0), H(a, e);
}
function ft(s, e) {
  const t = E(s, e == null ? void 0 : e.in), r = +H(t, e) - +bt(t, e);
  return Math.round(r / ge) + 1;
}
function k(s, e) {
  const t = s < 0 ? "-" : "", r = Math.abs(s).toString().padStart(e, "0");
  return t + r;
}
const M = {
  // Year
  y(s, e) {
    const t = s.getFullYear(), r = t > 0 ? t : 1 - t;
    return k(e === "yy" ? r % 100 : r, e.length);
  },
  // Month
  M(s, e) {
    const t = s.getMonth();
    return e === "M" ? String(t + 1) : k(t + 1, 2);
  },
  // Day of the month
  d(s, e) {
    return k(s.getDate(), e.length);
  },
  // AM or PM
  a(s, e) {
    const t = s.getHours() / 12 >= 1 ? "pm" : "am";
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
  h(s, e) {
    return k(s.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(s, e) {
    return k(s.getHours(), e.length);
  },
  // Minute
  m(s, e) {
    return k(s.getMinutes(), e.length);
  },
  // Second
  s(s, e) {
    return k(s.getSeconds(), e.length);
  },
  // Fraction of second
  S(s, e) {
    const t = e.length, r = s.getMilliseconds(), i = Math.trunc(
      r * Math.pow(10, t - 3)
    );
    return k(i, e.length);
  }
}, W = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, ae = {
  // Era
  G: function(s, e, t) {
    const r = s.getFullYear() > 0 ? 1 : 0;
    switch (e) {
      case "G":
      case "GG":
      case "GGG":
        return t.era(r, { width: "abbreviated" });
      case "GGGGG":
        return t.era(r, { width: "narrow" });
      case "GGGG":
      default:
        return t.era(r, { width: "wide" });
    }
  },
  // Year
  y: function(s, e, t) {
    if (e === "yo") {
      const r = s.getFullYear(), i = r > 0 ? r : 1 - r;
      return t.ordinalNumber(i, { unit: "year" });
    }
    return M.y(s, e);
  },
  // Local week-numbering year
  Y: function(s, e, t, r) {
    const i = ye(s, r), a = i > 0 ? i : 1 - i;
    if (e === "YY") {
      const n = a % 100;
      return k(n, 2);
    }
    return e === "Yo" ? t.ordinalNumber(a, { unit: "year" }) : k(a, e.length);
  },
  // ISO week-numbering year
  R: function(s, e) {
    const t = be(s);
    return k(t, e.length);
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
  u: function(s, e) {
    const t = s.getFullYear();
    return k(t, e.length);
  },
  // Quarter
  Q: function(s, e, t) {
    const r = Math.ceil((s.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(r);
      case "QQ":
        return k(r, 2);
      case "Qo":
        return t.ordinalNumber(r, { unit: "quarter" });
      case "QQQ":
        return t.quarter(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return t.quarter(r, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return t.quarter(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(s, e, t) {
    const r = Math.ceil((s.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(r);
      case "qq":
        return k(r, 2);
      case "qo":
        return t.ordinalNumber(r, { unit: "quarter" });
      case "qqq":
        return t.quarter(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return t.quarter(r, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return t.quarter(r, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(s, e, t) {
    const r = s.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return M.M(s, e);
      case "Mo":
        return t.ordinalNumber(r + 1, { unit: "month" });
      case "MMM":
        return t.month(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return t.month(r, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return t.month(r, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(s, e, t) {
    const r = s.getMonth();
    switch (e) {
      case "L":
        return String(r + 1);
      case "LL":
        return k(r + 1, 2);
      case "Lo":
        return t.ordinalNumber(r + 1, { unit: "month" });
      case "LLL":
        return t.month(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return t.month(r, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return t.month(r, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(s, e, t, r) {
    const i = ft(s, r);
    return e === "wo" ? t.ordinalNumber(i, { unit: "week" }) : k(i, e.length);
  },
  // ISO week of year
  I: function(s, e, t) {
    const r = mt(s);
    return e === "Io" ? t.ordinalNumber(r, { unit: "week" }) : k(r, e.length);
  },
  // Day of the month
  d: function(s, e, t) {
    return e === "do" ? t.ordinalNumber(s.getDate(), { unit: "date" }) : M.d(s, e);
  },
  // Day of year
  D: function(s, e, t) {
    const r = gt(s);
    return e === "Do" ? t.ordinalNumber(r, { unit: "dayOfYear" }) : k(r, e.length);
  },
  // Day of week
  E: function(s, e, t) {
    const r = s.getDay();
    switch (e) {
      case "E":
      case "EE":
      case "EEE":
        return t.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return t.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return t.day(r, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return t.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(s, e, t, r) {
    const i = s.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(a);
      case "ee":
        return k(a, 2);
      case "eo":
        return t.ordinalNumber(a, { unit: "day" });
      case "eee":
        return t.day(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return t.day(i, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return t.day(i, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return t.day(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(s, e, t, r) {
    const i = s.getDay(), a = (i - r.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(a);
      case "cc":
        return k(a, e.length);
      case "co":
        return t.ordinalNumber(a, { unit: "day" });
      case "ccc":
        return t.day(i, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return t.day(i, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return t.day(i, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return t.day(i, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(s, e, t) {
    const r = s.getDay(), i = r === 0 ? 7 : r;
    switch (e) {
      case "i":
        return String(i);
      case "ii":
        return k(i, e.length);
      case "io":
        return t.ordinalNumber(i, { unit: "day" });
      case "iii":
        return t.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return t.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return t.day(r, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return t.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(s, e, t) {
    const i = s.getHours() / 12 >= 1 ? "pm" : "am";
    switch (e) {
      case "a":
      case "aa":
        return t.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return t.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return t.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return t.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(s, e, t) {
    const r = s.getHours();
    let i;
    switch (r === 12 ? i = W.noon : r === 0 ? i = W.midnight : i = r / 12 >= 1 ? "pm" : "am", e) {
      case "b":
      case "bb":
        return t.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return t.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return t.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return t.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(s, e, t) {
    const r = s.getHours();
    let i;
    switch (r >= 17 ? i = W.evening : r >= 12 ? i = W.afternoon : r >= 4 ? i = W.morning : i = W.night, e) {
      case "B":
      case "BB":
      case "BBB":
        return t.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return t.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return t.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(s, e, t) {
    if (e === "ho") {
      let r = s.getHours() % 12;
      return r === 0 && (r = 12), t.ordinalNumber(r, { unit: "hour" });
    }
    return M.h(s, e);
  },
  // Hour [0-23]
  H: function(s, e, t) {
    return e === "Ho" ? t.ordinalNumber(s.getHours(), { unit: "hour" }) : M.H(s, e);
  },
  // Hour [0-11]
  K: function(s, e, t) {
    const r = s.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(r, { unit: "hour" }) : k(r, e.length);
  },
  // Hour [1-24]
  k: function(s, e, t) {
    let r = s.getHours();
    return r === 0 && (r = 24), e === "ko" ? t.ordinalNumber(r, { unit: "hour" }) : k(r, e.length);
  },
  // Minute
  m: function(s, e, t) {
    return e === "mo" ? t.ordinalNumber(s.getMinutes(), { unit: "minute" }) : M.m(s, e);
  },
  // Second
  s: function(s, e, t) {
    return e === "so" ? t.ordinalNumber(s.getSeconds(), { unit: "second" }) : M.s(s, e);
  },
  // Fraction of second
  S: function(s, e) {
    return M.S(s, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(s, e, t) {
    const r = s.getTimezoneOffset();
    if (r === 0)
      return "Z";
    switch (e) {
      case "X":
        return se(r);
      case "XXXX":
      case "XX":
        return O(r);
      case "XXXXX":
      case "XXX":
      default:
        return O(r, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(s, e, t) {
    const r = s.getTimezoneOffset();
    switch (e) {
      case "x":
        return se(r);
      case "xxxx":
      case "xx":
        return O(r);
      case "xxxxx":
      case "xxx":
      default:
        return O(r, ":");
    }
  },
  // Timezone (GMT)
  O: function(s, e, t) {
    const r = s.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + ne(r, ":");
      case "OOOO":
      default:
        return "GMT" + O(r, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(s, e, t) {
    const r = s.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + ne(r, ":");
      case "zzzz":
      default:
        return "GMT" + O(r, ":");
    }
  },
  // Seconds timestamp
  t: function(s, e, t) {
    const r = Math.trunc(+s / 1e3);
    return k(r, e.length);
  },
  // Milliseconds timestamp
  T: function(s, e, t) {
    return k(+s, e.length);
  }
};
function ne(s, e = "") {
  const t = s > 0 ? "-" : "+", r = Math.abs(s), i = Math.trunc(r / 60), a = r % 60;
  return a === 0 ? t + String(i) : t + String(i) + e + k(a, 2);
}
function se(s, e) {
  return s % 60 === 0 ? (s > 0 ? "-" : "+") + k(Math.abs(s) / 60, 2) : O(s, e);
}
function O(s, e = "") {
  const t = s > 0 ? "-" : "+", r = Math.abs(s), i = k(Math.trunc(r / 60), 2), a = k(r % 60, 2);
  return t + i + e + a;
}
const oe = (s, e) => {
  switch (s) {
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
}, ve = (s, e) => {
  switch (s) {
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
}, yt = (s, e) => {
  const t = s.match(/(P+)(p+)?/) || [], r = t[1], i = t[2];
  if (!i)
    return oe(s, e);
  let a;
  switch (r) {
    case "P":
      a = e.dateTime({ width: "short" });
      break;
    case "PP":
      a = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      a = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      a = e.dateTime({ width: "full" });
      break;
  }
  return a.replace("{{date}}", oe(r, e)).replace("{{time}}", ve(i, e));
}, vt = {
  p: ve,
  P: yt
}, xt = /^D+$/, Tt = /^Y+$/, wt = ["D", "DD", "YY", "YYYY"];
function kt(s) {
  return xt.test(s);
}
function Ct(s) {
  return Tt.test(s);
}
function Pt(s, e, t) {
  const r = It(s, e, t);
  if (console.warn(r), wt.includes(s)) throw new RangeError(r);
}
function It(s, e, t) {
  const r = s[0] === "Y" ? "years" : "days of the month";
  return `Use \`${s.toLowerCase()}\` instead of \`${s}\` (in \`${e}\`) for formatting ${r} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const St = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Et = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, $t = /^'([^]*?)'?$/, Mt = /''/g, Lt = /[a-zA-Z]/;
function A(s, e, t) {
  var d, u, h, p;
  const r = G(), i = r.locale ?? pt, a = r.firstWeekContainsDate ?? ((u = (d = r.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, n = r.weekStartsOn ?? ((p = (h = r.locale) == null ? void 0 : h.options) == null ? void 0 : p.weekStartsOn) ?? 0, o = E(s, t == null ? void 0 : t.in);
  if (!Ae(o))
    throw new RangeError("Invalid time value");
  let c = e.match(Et).map((f) => {
    const b = f[0];
    if (b === "p" || b === "P") {
      const m = vt[b];
      return m(f, i.formatLong);
    }
    return f;
  }).join("").match(St).map((f) => {
    if (f === "''")
      return { isToken: !1, value: "'" };
    const b = f[0];
    if (b === "'")
      return { isToken: !1, value: Dt(f) };
    if (ae[b])
      return { isToken: !0, value: f };
    if (b.match(Lt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + b + "`"
      );
    return { isToken: !1, value: f };
  });
  i.localize.preprocessor && (c = i.localize.preprocessor(o, c));
  const l = {
    firstWeekContainsDate: a,
    weekStartsOn: n,
    locale: i
  };
  return c.map((f) => {
    if (!f.isToken) return f.value;
    const b = f.value;
    (Ct(b) || kt(b)) && Pt(b, e, String(s));
    const m = ae[b[0]];
    return m(o, b, i.localize, l);
  }).join("");
}
function Dt(s) {
  const e = s.match($t);
  return e ? e[1].replace(Mt, "'") : s;
}
function At(s, e) {
  return te(
    S(s, s),
    ee(s)
  );
}
function Ot(s, e) {
  return te(
    s,
    me(ee(s), 1),
    e
  );
}
function zt(s, e, t) {
  return me(s, -1, t);
}
function Bt(s, e) {
  return te(
    S(s, s),
    zt(ee(s))
  );
}
function Wt(s) {
  try {
    let e = orca.state.settings[ue.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), At(s))
      return "今天";
    if (Bt(s))
      return "昨天";
    if (Ot(s))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const r = s.getDay(), a = ["日", "一", "二", "三", "四", "五", "六"][r], n = e.replace(/E/g, a);
          return A(s, n);
        } else
          return A(s, e);
      else
        return A(s, e);
    } catch {
      const r = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of r)
        try {
          return A(s, i);
        } catch {
          continue;
        }
      return s.toLocaleDateString();
    }
  } catch {
    return s.toLocaleDateString();
  }
}
function ce(s) {
  try {
    const e = Nt(s, "_repr");
    if (!e || e.type !== he.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch {
    return null;
  }
}
function Nt(s, e) {
  return !s.properties || !Array.isArray(s.properties) ? null : s.properties.find((t) => t.name === e);
}
function Rt(s) {
  if (!Array.isArray(s) || s.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const r of s)
    r && typeof r == "object" && (r.t === "text" && r.v ? e++ : r.t === "ref" && r.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function Ft(s) {
  if (!s || s.length === 0) return "";
  let e = "";
  for (const t of s)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function qt(s, e, t, r) {
  const i = document.createElement("div");
  i.className = "orca-tabs-ref-menu-item", i.setAttribute("role", "menuitem"), i.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
    font-size: 14px;
    line-height: 1.4;
  `;
  const a = document.createElement("i");
  a.className = e, a.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const n = document.createElement("span");
  if (n.textContent = s, n.style.cssText = `
    flex: 1;
    color: #333;
  `, i.appendChild(a), i.appendChild(n), t && t.trim() !== "") {
    const o = document.createElement("span");
    o.textContent = t, o.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, i.appendChild(o);
  }
  return i.addEventListener("mouseenter", () => {
    i.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), i.addEventListener("mouseleave", () => {
    i.style.backgroundColor = "transparent";
  }), i.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), r();
    const c = i.closest('.orca-context-menu, .context-menu, [role="menu"]');
    c && (c.style.display = "none", c.remove());
  }), i;
}
function _t(s, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);
  if (t) {
    const r = parseInt(t[1], 16), i = parseInt(t[2], 16), a = parseInt(t[3], 16);
    return `rgba(${r}, ${i}, ${a}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function Ut(s, e, t) {
  let r = "var(--orca-tab-bg)", i = "var(--orca-color-text-1)", a = "normal", n = "";
  if (s.color)
    try {
      n = `--tab-color: ${s.color.startsWith("#") ? s.color : `#${s.color}`};`, r = "var(--orca-tab-colored-bg)", i = "var(--orca-tab-colored-text)", a = "600";
    } catch {
    }
  return e ? `
    ${n}
    background: ${r};
    color: ${i};
    font-weight: ${a};
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
  ` : `
    ${n}
    background: ${r};
    color: ${i};
    font-weight: ${a};
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
  `;
}
function Ht() {
  const s = document.createElement("div");
  return s.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, s;
}
function Vt(s) {
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
  `, s.startsWith("ti ti-")) {
    const t = document.createElement("i");
    t.className = s, e.appendChild(t);
  } else
    e.textContent = s;
  return e;
}
function jt(s) {
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
  `, t.textContent = s, e.appendChild(t), requestAnimationFrame(() => {
    const r = e.offsetWidth;
    t.scrollWidth > r && (t.style.mask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.webkitMask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.maskSize = "100% 100%", t.style.webkitMaskSize = "100% 100%", t.style.maskRepeat = "no-repeat", t.style.webkitMaskRepeat = "no-repeat");
  }), e;
}
function Yt() {
  const s = document.createElement("span");
  return s.textContent = "📌", s.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, s;
}
function Qt(s) {
  let e = s.title;
  return s.isPinned && (e += " (已固定)"), e;
}
function _(s, e, t = 180, r = 200) {
  const i = window.innerWidth, a = window.innerHeight, n = 10;
  let o = s, c = e;
  return o + t > i - n && (o = i - t - n), c + r > a - n && (c = a - r - n, c < e - r && (c = e - r - 5)), o < n && (o = n), c < n && (c = e + 5), o = Math.max(n, Math.min(o, i - t - n)), c = Math.max(n, Math.min(c, a - r - n)), { x: o, y: c };
}
function Gt() {
  const s = document.createElement("div");
  return s.className = "orca-tab-separator", s.style.cssText = `
    width: 1px;
    height: 20px;
    background: color-mix(in srgb, var(--orca-color-text-1), transparent 70%);
    flex-shrink: 0;
    margin: 0px 0px;
  `, s;
}
function Xt() {
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
function le(s = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[s];
}
function Kt() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function Jt(s, e, t, r) {
  return s ? `
    position: fixed;
    top: ${e.y}px;
    left: ${e.x}px;
    z-index: 300;
    display: flex;
    flex-direction: column;
    gap: 4px;
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
    width: ${r || 200}px;
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
    gap: 4px;
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
function Zt(s, e, t = {}) {
  try {
    const {
      updateOrder: r = !0,
      saveData: i = !0,
      updateUI: a = !0
    } = t, n = e.findIndex((c) => c.blockId === s.blockId);
    if (n === -1)
      return {
        success: !1,
        message: `标签不存在: ${s.title}`
      };
    e[n].isPinned = !e[n].isPinned, r && ir(e);
    const o = e[n].isPinned ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${s.title}" 已${o}`,
      data: { tab: e[n], tabIndex: n }
    };
  } catch (r) {
    return {
      success: !1,
      message: `切换固定状态失败: ${r}`
    };
  }
}
function er(s, e, t, r = {}) {
  try {
    const {
      updateUI: i = !0,
      saveData: a = !0,
      validateData: n = !0
    } = r, o = t.findIndex((c) => c.blockId === s.blockId);
    if (o === -1)
      return {
        success: !1,
        message: `标签不存在: ${s.title}`
      };
    if (n) {
      const c = rr(e);
      if (!c.success)
        return c;
    }
    return t[o] = { ...t[o], ...e }, {
      success: !0,
      message: `标签 "${s.title}" 已更新`,
      data: { tab: t[o], tabIndex: o }
    };
  } catch (i) {
    return {
      success: !1,
      message: `更新标签失败: ${i}`
    };
  }
}
function tr(s, e, t, r = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : er(s, { title: e.trim() }, t, r);
}
function rr(s) {
  return s.blockId !== void 0 && (!s.blockId || s.blockId.trim() === "") ? {
    success: !1,
    message: "标签块ID不能为空"
  } : s.title !== void 0 && (!s.title || s.title.trim() === "") ? {
    success: !1,
    message: "标签标题不能为空"
  } : s.order !== void 0 && (s.order < 0 || !Number.isInteger(s.order)) ? {
    success: !1,
    message: "标签顺序必须是正整数"
  } : {
    success: !0,
    message: "标签数据验证通过"
  };
}
function ir(s) {
  s.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function ar(s) {
  for (let e = s.length - 1; e >= 0; e--)
    if (!s[e].isPinned)
      return e;
  return -1;
}
function nr(s) {
  return [...s].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function sr(s, e, t, r) {
  return e ? {
    x: s.x,
    y: s.y,
    width: t,
    height: r
  } : {
    x: s.x,
    y: s.y,
    width: Math.min(800, window.innerWidth - s.x - 10),
    height: 28
  };
}
function or(s, e, t, r) {
  const i = sr(s, e, t, r);
  let a = s.x, n = s.y;
  return i.x < 0 ? a = 0 : i.x + i.width > window.innerWidth && (a = window.innerWidth - i.width), i.y < 0 ? n = 0 : i.y + i.height > window.innerHeight && (n = window.innerHeight - i.height), { x: a, y: n };
}
function cr(s, e, t = !1) {
  let r = null;
  const i = (...a) => {
    const n = t && !r;
    r && clearTimeout(r), r = window.setTimeout(() => {
      r = null, t || s(...a);
    }, e), n && s(...a);
  };
  return i.cancel = () => {
    r && (clearTimeout(r), r = null);
  }, i;
}
class lr {
  constructor(e = {}, t = {}) {
    g(this, "observer", null);
    g(this, "config");
    g(this, "callbacks");
    g(this, "mutationQueue", []);
    g(this, "batchTimer", null);
    g(this, "lastBatchTime", 0);
    g(this, "isObserving", !1);
    g(this, "targetElement");
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
    const t = Date.now(), r = this.config.enableSmartFilter ? this.filterRelevantMutations(e) : e;
    if (r.length !== 0) {
      if (t - this.lastBatchTime < this.config.coolingPeriod) {
        this.log("🚨 检测到高频变化，启用冷却期"), r.forEach((i) => {
          this.handleHotMutation(i);
        });
        return;
      }
      this.config.enableBatch ? this.handleBatchMutations(r, t) : r.forEach((i) => {
        var a, n;
        (n = (a = this.callbacks).onHotMutation) == null || n.call(a, i);
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
    var r, i;
    if (this.mutationQueue.length === 0)
      return;
    const e = [...this.mutationQueue];
    this.mutationQueue = [], this.batchTimer = null, this.lastBatchTime = Date.now();
    const t = this.deduplicateMutations(e);
    (i = (r = this.callbacks).onBatchMutations) == null || i.call(r, t);
  }
  /**
   * 处理热点变化（高频变化）
   */
  handleHotMutation(e) {
    var r, i;
    const t = e.target;
    this.isCriticalChange(e, t) ? (i = (r = this.callbacks).onHotMutation) == null || i.call(r, e) : this.throttleMutation(e);
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
      var t, r;
      (r = (t = this.callbacks).onThrottledMutation) == null || r.call(t, [e]);
    });
  }
  /**
   * 过滤相关的变化
   */
  filterRelevantMutations(e) {
    return e.filter((t) => {
      const r = t.target;
      return r.nodeType !== Node.ELEMENT_NODE ? !1 : [
        "orca-panel",
        "orca-hideable",
        "orca-block-editor",
        "orca-panels-row",
        "orca-tab"
      ].some(
        (n) => r.classList.contains(n) || r.closest(`.${n}`)
      );
    });
  }
  /**
   * 对变化进行去重和合并
   */
  deduplicateMutations(e) {
    const t = /* @__PURE__ */ new Set(), r = [];
    return e.reverse().forEach((i) => {
      const a = i.target;
      i.type === "attributes" || `${i.type}${Array.from(i.addedNodes).map((n) => {
        var o;
        return ((o = n.textContent) == null ? void 0 : o.substring(0, 50)) || "empty";
      }).join(",")}`, t.has(a) || (t.add(a), r.push(i));
    }), r.reverse();
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
class dr {
  constructor() {
    g(this, "layers", /* @__PURE__ */ new Map());
    g(this, "taskQueue", /* @__PURE__ */ new Map());
    g(this, "activeTimers", /* @__PURE__ */ new Map());
    g(this, "performanceMetrics");
    g(this, "taskIdCounter", 0);
    g(this, "isEnabled", !0);
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
  execute(e, t = [], r = "normal", i = {}) {
    const a = this.layers.get(r);
    if (!a)
      return console.warn(`Unknown layer: ${r}`), e(...t);
    const n = i.id || `task_${++this.taskIdCounter}`;
    if (a.delay === 0)
      return this.updateMetrics("executed"), e(...t);
    if (this.taskQueue.get(n) && !a.cancelable && !i.forceExecute)
      return this.updateMetrics("cancelled"), Promise.resolve();
    const c = {
      id: n,
      fn: e,
      args: t,
      layer: a,
      createdAt: Date.now(),
      priority: i.priority || a.priority,
      forceExecute: i.forceExecute || !1
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
    const r = this.activeTimers.get(e);
    return r && (clearTimeout(r), this.activeTimers.delete(e)), this.taskQueue.delete(e), this.updateMetrics("cancelled"), !0;
  }
  /**
   * 批量执行任务
   */
  batchExecute(e, t = {}) {
    const { concurrent: r = !1, maxConcurrency: i = 3 } = t;
    return r ? this.executeConcurrent(e, i) : this.executeSequential(e);
  }
  /**
   * 执行队列中的所有任务
   */
  flushAll() {
    const e = Array.from(this.taskQueue.values());
    this.activeTimers.forEach((t) => clearTimeout(t)), this.activeTimers.clear(), e.sort((t, r) => (r.priority || 0) - (t.priority || 0)), e.forEach((t) => {
      try {
        t.fn(...t.args), this.updateMetrics("executed");
      } catch (r) {
        console.error(`Task ${t.id} execution failed:`, r);
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
      const r = t.layer.name;
      e.set(r, (e.get(r) || 0) + 1);
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
    const r = new Array(e.length), i = [];
    let a = 0;
    const n = async (o, c) => {
      try {
        const l = await this.execute(
          c.fn,
          c.args || [],
          c.layer || "normal",
          { priority: c.priority || 0 }
        );
        r[o] = l;
      } catch (l) {
        console.error(`Task ${o} failed:`, l);
      }
    };
    for (; a < e.length; ) {
      for (; i.length < t && a < e.length; ) {
        const o = e[a], c = n(a, o);
        i.push(c), a++;
      }
      i.length > 0 && (await Promise.race(i), i.shift());
    }
    return await Promise.all(i), r;
  }
  /**
   * 顺序执行任务
   */
  async executeSequential(e) {
    const t = [];
    for (const r of e) {
      const i = await this.execute(
        r.fn,
        r.args || [],
        r.layer || "normal",
        { priority: r.priority || 0 }
      );
      t.push(i);
    }
    return t;
  }
  /**
   * 等待任务解析
   */
  waitForTaskResolution(e, t, r) {
    const i = setInterval(() => {
      this.taskQueue.has(e) || (clearInterval(i), t(Promise.resolve()));
    }, 10);
    setTimeout(() => {
      clearInterval(i), this.taskQueue.delete(e), r(new Error(`Task ${e} timeout`));
    }, 3e4);
  }
  /**
   * 更新性能指标
   */
  updateMetrics(e) {
    this.performanceMetrics.totalTasks++, e === "executed" ? this.performanceMetrics.executedTasks++ : e === "cancelled" && this.performanceMetrics.cancelledTasks++;
    const t = this.taskQueue.size;
    if (t > this.performanceMetrics.peakQueueSize && (this.performanceMetrics.peakQueueSize = t), this.performanceMetrics.totalTasks > 0) {
      const r = Array.from(this.activeTimers.values()).reduce((i, a) => i + a, 0);
      this.performanceMetrics.averageDelay = r / this.activeTimers.size;
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
const L = class L {
  constructor() {
    g(this, "trackedResources", /* @__PURE__ */ new Map());
    g(this, "cleanupListeners", /* @__PURE__ */ new Set());
    g(this, "autoCleanupInterval", null);
    g(this, "isEnabled", !0);
    g(this, "resourceIdCounter", 0);
    this.startAutoCleanup(), this.setupGlobalCleanup();
  }
  /**
   * 获取单例实例
   */
  static getInstance() {
    return L.instance || (L.instance = new L()), L.instance;
  }
  /**
   * 跟踪事件监听器
   */
  trackEventListener(e, t, r, i, a) {
    const n = `event_${++this.resourceIdCounter}`, o = () => {
      e.removeEventListener(t, r, i);
    }, c = {
      id: n,
      type: "eventListener",
      resource: { target: e, event: t, listener: r, options: i },
      createdAt: Date.now(),
      cleanup: o,
      description: a || `EventListener on ${e.constructor.name}.${t}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(c), n;
  }
  /**
   * 跟踪定时器
   */
  trackTimer(e, t = "timeout", r) {
    const i = `${t}_${e}`, a = () => {
      t === "timeout" ? clearTimeout(e) : clearInterval(e);
    }, n = {
      id: i,
      type: "timer",
      resource: { timerId: e, type: t },
      createdAt: Date.now(),
      cleanup: a,
      description: r || `${t.charAt(0).toUpperCase() + t.slice(1)} timer #${e}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(n), i;
  }
  /**
   * 跟踪观察者
   */
  trackObserver(e, t = "mutation", r) {
    const i = `observer_${++this.resourceIdCounter}`, a = () => {
      e.disconnect();
    }, n = {
      id: i,
      type: "observer",
      resource: e,
      createdAt: Date.now(),
      cleanup: a,
      description: r || `${t.charAt(0).toUpperCase() + t.slice(1)}Observer`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(n), i;
  }
  /**
   * 跟踪动画帧
   */
  trackAnimationFrame(e, t) {
    const r = `raf_${e}`, i = () => {
      cancelAnimationFrame(e);
    }, a = {
      id: r,
      type: "animationFrame",
      resource: { frameId: e },
      createdAt: Date.now(),
      cleanup: i,
      description: t || `AnimationFrame #${e}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(a), r;
  }
  /**
   * 跟踪Promise
   */
  trackPromise(e, t) {
    const r = `promise_${++this.resourceIdCounter}`, i = () => {
      e.catch(() => {
      });
    }, a = {
      id: r,
      type: "promise",
      resource: e,
      createdAt: Date.now(),
      cleanup: i,
      description: t || `Promise #${r}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(a), Promise.allSettled([e]).finally(() => {
      this.cleanupResource(r);
    }), r;
  }
  /**
   * 跟踪自定义资源
   */
  trackCustomResource(e, t, r) {
    const i = `custom_${++this.resourceIdCounter}`, a = {
      id: i,
      type: "custom",
      resource: e,
      createdAt: Date.now(),
      cleanup: t,
      description: r || `Custom resource #${i}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(a), i;
  }
  /**
   * 跟踪批量的清理操作
   */
  trackBatchCleanup(e, t) {
    return this.trackCustomResource(
      null,
      () => {
        e.forEach((r) => {
          try {
            r();
          } catch (i) {
            console.error("Batch cleanup error:", i);
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
    } catch (r) {
      return console.error(`Cleanup failed for resource ${e}:`, r), !1;
    } finally {
      this.trackedResources.delete(e);
    }
  }
  /**
   * 清理指定类型的所有资源
   */
  cleanupResourcesByType(e) {
    let t = 0;
    return this.trackedResources.forEach((r, i) => {
      r.type === e && !r.destroyed && this.cleanupResource(i) && t++;
    }), t;
  }
  /**
   * 清理所有资源
   */
  cleanupAllResources() {
    const e = this.getMemoryStats();
    return Array.from(this.trackedResources.values()).forEach((r) => {
      if (!r.destroyed)
        try {
          r.cleanup(), r.destroyed = !0;
        } catch (i) {
          console.error(`Cleanup failed for resource ${r.id}:`, i);
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
    let t, r = 0;
    return this.trackedResources.forEach((i) => {
      if (i.destroyed)
        r++;
      else {
        const a = e.get(i.type) || 0;
        e.set(i.type, a + 1), (!t || i.createdAt < t.createdAt) && (t = i);
      }
    }), {
      totalResources: this.trackedResources.size,
      resourcesByType: e,
      leakedCount: r,
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
    e.resourcesByType.forEach((a, n) => {
      const c = {
        eventListener: 50,
        timer: 20,
        observer: 10,
        animationFrame: 50,
        promise: 30,
        custom: 100
      }[n] || 10;
      a > c && t.push({
        type: n,
        count: a,
        description: `Too many ${n}s detected: ${a} (threshold: ${c})`
      });
    });
    const r = Date.now(), i = 3e5;
    return this.trackedResources.forEach((a, n) => {
      !a.destroyed && r - a.createdAt > i && t.push({
        type: "timeout",
        count: 1,
        description: `Long-running resource: ${a.description || n} (age: ${Math.round((r - a.createdAt) / 1e3)}s)`
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
    let r = `
=== Memory Leak Protection Report ===
Total Resources: ${e.totalResources}
Memory Usage: ${Math.round(e.memoryUsage / 1024 / 1024 * 100) / 100} MB
Cleanup Count: ${e.cleanupCount}

Resources by Type:`;
    return e.resourcesByType.forEach((i, a) => {
      r += `
- ${a}: ${i}`;
    }), t.length > 0 && (r += `

Potential Leaks:`, t.forEach((i) => {
      r += `
- ${i.description}`;
    })), e.oldestResource && (r += `

Oldest Resource: ${e.oldestResource.description}`, r += `
Age: ${Math.round((Date.now() - e.oldestResource.createdAt) / 1e3)}s`), r;
  }
  /**
   * 销毁保护器
   */
  destroy() {
    this.cleanupAllResources(), this.autoCleanupInterval && (clearInterval(this.autoCleanupInterval), this.autoCleanupInterval = null), this.cleanupListeners.clear(), this.isEnabled = !1, L.instance = null;
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
      } catch (r) {
        console.error("Cleanup listener error:", r);
      }
    });
  }
  performAutoCleanup() {
    const e = this.detectMemoryLeaks();
    e.length > 0 && (this.log("🧹 Performing auto-cleanup due to potential leaks"), e.forEach((t) => {
      if (t.type === "timeout") {
        const r = Date.now();
        this.trackedResources.forEach((i, a) => {
          !i.destroyed && r - i.createdAt > 3e5 && this.cleanupResource(a);
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
g(L, "instance");
let J = L;
class ur {
  constructor(e = {}) {
    g(this, "modules", /* @__PURE__ */ new Map());
    g(this, "config");
    g(this, "loadingQueue", []);
    g(this, "activeLoaders", 0);
    g(this, "observers", /* @__PURE__ */ new Map());
    g(this, "idleCallbackId", null);
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
  registerModule(e, t, r = {}) {
    const i = {
      id: e,
      loader: t,
      loaded: !1,
      loading: !1,
      failureCount: 0,
      dependencies: r.dependencies || [],
      priority: r.priority || 0,
      timeout: r.timeout || this.config.defaultTimeout,
      lastLoadTime: void 0,
      instance: void 0
    };
    this.modules.set(e, i), r.autoLoad !== !1 && i.priority >= 8 && this.loadModule(e).catch((a) => {
      console.error(`Auto-loading module ${e} failed:`, a);
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
      return new Promise((r, i) => {
        const a = () => {
          t.loaded && t.instance ? r(t.instance) : !t.loading && t.failureCount > this.config.maxRetries ? i(new Error(`Module ${e} failed to load after ${this.config.maxRetries} retries`)) : setTimeout(a, 100);
        };
        a();
      });
    for (const r of t.dependencies)
      await this.loadModule(r);
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
    const t = e.filter((a) => {
      const n = this.modules.get(a);
      return n && !n.loaded;
    });
    if (t.length === 0)
      return [];
    t.sort((a, n) => {
      const o = this.modules.get(a);
      return this.modules.get(n).priority - o.priority;
    });
    const r = [], i = [];
    for (const a of t) {
      i.length >= this.config.maxConcurrency && await Promise.race(i);
      const n = this.loadModule(a);
      i.push(n), r.push(n);
    }
    return Promise.all(r);
  }
  /**
   * 预加载模块
   */
  async preloadModules(e) {
    const t = e.filter((r) => {
      const i = this.modules.get(r);
      return i && !i.loaded && !i.loading;
    });
    if (t.length !== 0)
      for (const r of t)
        this.loadModule(r).catch(() => {
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
    return this.modules.forEach((t, r) => {
      e[r] = this.getModuleStatus(r);
    }), e;
  }
  /**
   * 获取加载进度
   */
  getLoadingProgress() {
    const e = Array.from(this.modules.values()), t = e.length, r = e.filter((n) => n.loaded).length, i = e.filter((n) => n.loading).length, a = e.filter((n) => n.failureCount > this.config.maxRetries).length;
    return {
      total: t,
      loaded: r,
      loading: i,
      failed: a,
      progress: t > 0 ? Math.round(r / t * 100) : 100
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
    for (const r of t.dependencies) {
      const i = this.getModuleStatus(r);
      ["loaded"].includes(i) || await this.loadModule(r);
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
      const r = (i) => {
        i.timeRemaining() > 0 || i.didTimeout ? this.loadModule(e).then(t) : requestIdleCallback(r);
      };
      requestIdleCallback(r);
    });
  }
  async loadOnVisible(e) {
    return new Promise((t) => {
      const r = new IntersectionObserver(
        (i) => {
          i.forEach((a) => {
            a.isIntersecting && (r.disconnect(), this.loadModule(e).then(t));
          });
        },
        { threshold: 0.1 }
      );
      r.observe(document.body), setTimeout(() => {
        r.disconnect(), this.loadModule(e).then(t);
      }, 3e4);
    });
  }
  async loadOnInteraction(e) {
    return new Promise((t) => {
      const r = () => {
        removeEventListener("click", r), removeEventListener("keydown", r), removeEventListener("scroll", r), removeEventListener("mousemove", r), removeEventListener("touchstart", r), this.loadModule(e).then(t);
      };
      addEventListener("click", r), addEventListener("keydown", r), addEventListener("scroll", r), addEventListener("mousemove", r), addEventListener("touchstart", r), setTimeout(() => {
        r();
      }, 3e4);
    });
  }
  async executeLoad(e) {
    e.loading = !0, e.failureCount++;
    try {
      const t = await Promise.race([
        e.loader(),
        new Promise(
          (r, i) => setTimeout(() => i(new Error(`Module ${e.id} timeout`)), e.timeout)
        )
      ]);
      return e.loaded = !0, e.loading = !1, e.instance = t, e.lastLoadTime = Date.now(), e.failureCount = 0, t;
    } catch (t) {
      if (e.loading = !1, e.failureCount <= this.config.maxRetries) {
        const r = Math.min(1e3 * Math.pow(2, e.failureCount - 1), 1e4);
        return await new Promise((i) => setTimeout(i, r)), this.executeLoad(e);
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
        t.forEach((r) => {
          if (r.isIntersecting) {
            const i = Array.from(this.modules.keys()).filter((a) => {
              const n = this.modules.get(a);
              return !n.loaded && !n.loading && n.priority >= 5;
            });
            i.length > 0 && this.preloadModules(i.slice(0, 3));
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
class hr {
  constructor(e = {}) {
    g(this, "queue", []);
    g(this, "config");
    g(this, "isProcessing", !1);
    g(this, "processingTimer", null);
    g(this, "operationIdCounter", 0);
    g(this, "metrics");
    g(this, "processingStartTime", 0);
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
  addOperation(e, t, r = {}) {
    const i = {
      id: `op_${++this.operationIdCounter}`,
      type: e,
      data: t,
      priority: r.priority || 5,
      async: r.async || !1,
      timestamp: Date.now(),
      callback: r.callback
    };
    return this.queue.push(i), this.queue.length > this.metrics.peakQueueSize && (this.metrics.peakQueueSize = this.queue.length), this.queue.length >= this.config.maxBatchSize && this.processBatch(), this.processingTimer || this.scheduleProcessing(), i.id;
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
      const r = e.get(t.type) || [];
      r.push(t), e.set(t.type, r);
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
    this.isProcessing = !0, this.processingStartTime = performance.now(), this.config.enablePriorityQueue && this.queue.sort((i, a) => a.priority - i.priority);
    const e = Math.min(this.queue.length, this.config.maxBatchSize), t = this.queue.splice(0, e), r = this.groupOperations(t);
    for (const [i, a] of r)
      await this.processOperationGroup(i, a);
    this.updateMetrics(e), this.isProcessing = !1;
  }
  groupOperations(e) {
    const t = /* @__PURE__ */ new Map();
    return e.forEach((r) => {
      const i = t.get(r.type) || [];
      i.push(r), t.set(r.type, i);
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
    } catch (r) {
      console.error(`Processing ${e} operations failed:`, r), t.forEach((i) => {
        if (i.callback)
          try {
            i.callback(r);
          } catch (a) {
            console.error(`Callback error for operation ${i.id}:`, a);
          }
      });
    }
  }
  async processDOMOperations(e) {
    const t = document.createDocumentFragment(), r = [];
    e.forEach((i) => {
      switch (i.type) {
        case "appendChild":
          r.push(() => {
            const a = i.data;
            a instanceof HTMLElement && t.appendChild(a);
          });
          break;
        case "removeChild":
          r.push(() => {
            const a = i.data;
            a && a.parentNode && a.parentNode.removeChild(a);
          });
          break;
        case "setAttribute":
          r.push(() => {
            const { element: a, name: n, value: o } = i.data;
            a && a.setAttribute && a.setAttribute(n, o);
          });
          break;
        case "setStyle":
          r.push(() => {
            const { element: a, styles: n } = i.data;
            a && a.style && Object.assign(a.style, n);
          });
          break;
      }
    }), await new Promise((i) => {
      requestAnimationFrame(() => {
        r.forEach((a) => a()), t.hasChildNodes() && (document.querySelector(".orca-tab-container") || document.body).appendChild(t), e.forEach((a) => {
          a.callback && a.callback(!0);
        }), i();
      });
    });
  }
  async processCSSOperations(e) {
    const t = /* @__PURE__ */ new Map();
    e.forEach((r) => {
      const { selector: i, styles: a } = r.data;
      i && a && t.set(i, a);
    }), t.size > 0 && await new Promise((r) => {
      requestAnimationFrame(() => {
        t.forEach((i, a) => {
          const n = document.querySelector(a);
          n instanceof HTMLElement && Object.assign(n.style, i);
        }), e.forEach((i) => {
          i.callback && i.callback(!0);
        }), r();
      });
    });
  }
  async processAnimationOperations(e) {
    const t = [];
    e.forEach((r) => {
      const { element: i, keyframes: a, options: n } = r.data;
      if (i && a && n)
        try {
          const o = i.animate(a, n);
          t.push(o);
        } catch (o) {
          console.error("Animation creation failed:", o);
        }
    }), t.length > 0 && (await Promise.allSettled(
      t.map(
        (r) => r.finished.catch(() => {
        })
      )
    ), e.forEach((r) => {
      r.callback && r.callback(!0);
    }));
  }
  async processDataOperations(e) {
    const t = [];
    e.forEach((r) => {
      t.push(async () => {
        const { target: i, method: a, params: n } = r.data;
        if (i && a)
          try {
            const o = await i[a](...n);
            r.callback && r.callback(o);
          } catch (o) {
            r.callback && r.callback(o);
          }
      });
    }), await Promise.all(t.map((r) => r()));
  }
  async processGenericOperations(e) {
    const t = [];
    e.forEach((r) => {
      typeof r.data == "function" && t.push(r.data);
    }), await new Promise((r) => {
      requestAnimationFrame(() => {
        t.forEach((i) => {
          try {
            i();
          } catch (a) {
            console.error("Generic operation failed:", a);
          }
        }), e.forEach((i) => {
          i.callback && i.callback(!0);
        }), r();
      });
    });
  }
  updateMetrics(e) {
    const t = performance.now() - this.processingStartTime;
    this.metrics.totalOperations += e;
    const r = this.metrics.averageProcessingTime * (this.metrics.totalOperations - e) + t;
    this.metrics.averageProcessingTime = r / this.metrics.totalOperations;
    const i = this.queue.length;
    i > this.metrics.peakQueueSize && (this.metrics.peakQueueSize = i);
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
const D = class D {
  constructor() {
    g(this, "metrics", /* @__PURE__ */ new Map());
    g(this, "thresholds", /* @__PURE__ */ new Map());
    g(this, "config");
    g(this, "isMonitoring", !1);
    g(this, "intervalId", null);
    g(this, "observers", /* @__PURE__ */ new Map());
    g(this, "reportCallbacks", /* @__PURE__ */ new Set());
    g(this, "performanceEntries", []);
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
    return D.instance || (D.instance = new D()), D.instance;
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
  recordMetric(e, t, r = "", i = "custom") {
    const a = this.thresholds.get(e), n = a ? t <= a.error : !0, o = {
      name: e,
      value: t,
      unit: r,
      timestamp: Date.now(),
      type: i,
      healthy: n
    };
    this.addMetric(o);
  }
  /**
   * 开始性能测量
   */
  startMeasurement(e) {
    const t = performance.now();
    return () => {
      const r = performance.now() - t;
      return this.recordMetric(e, r, "ms", "duration"), r;
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
    const r = this.metrics.get(e) || [];
    if (t) {
      const i = Date.now() - t;
      return r.filter((a) => a.timestamp >= i);
    }
    return r;
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
    const e = `report_${Date.now()}`, t = this.calculateHealthScore(), r = this.analyzeIssues(), i = this.analyzeTrends(), a = this.generateRecommendations(), n = {
      id: e,
      timestamp: Date.now(),
      healthScore: t,
      issues: r,
      metrics: this.getAllCurrentMetrics(),
      trends: i,
      recommendations: a
    };
    return this.reportCallbacks.forEach((o) => {
      try {
        o(n);
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
    return this.getAllRecentMetrics(), this.analyzeIssues().forEach((r) => {
      switch (r.metric) {
        case "memory_heap":
          r.type === "error" && (e.push({
            action: "触发垃圾收集",
            impact: "清理未使用内存"
          }), "gc" in window && window.gc());
          break;
        case "dom_update":
          r.type === "warning" && e.push({
            action: "批量DOM操作",
            impact: "减少重排重绘"
          });
          break;
        case "render_frame":
          r.type === "warning" && e.push({
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
  setThreshold(e, t, r, i) {
    this.thresholds.set(e, {
      name: e,
      warning: t,
      error: r,
      recommended: i || Math.min(t, r) * 0.5
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
    return this.metrics.forEach((t, r) => {
      e[r] = t;
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
    this.metrics.forEach((t, r) => {
      const i = t.filter((a) => a.timestamp >= e);
      this.metrics.set(r, i);
    }), this.performanceEntries = this.performanceEntries.filter((t) => t.startTime >= e);
  }
  addMetric(e) {
    const t = this.metrics.get(e.name) || [];
    t.push(e);
    const r = Date.now() - this.config.historyRetention, i = t.filter((a) => a.timestamp >= r);
    this.metrics.set(e.name, i);
  }
  collectMetrics() {
    this.recordMemoryUsage(), this.recordRenderPerformance(), this.recordFPS(), this.recordDOMMetrics();
  }
  recordFPS() {
    let e = performance.now(), t = 0;
    const r = () => {
      t++;
      const i = performance.now();
      if (i - e >= 1e3) {
        const a = Math.round(t * 1e3 / (i - e));
        this.recordMetric("fps", a, "fps"), t = 0, e = i;
      }
      requestAnimationFrame(r);
    };
    requestAnimationFrame(r);
  }
  recordDOMMetrics() {
    const e = new MutationObserver((t) => {
      this.recordMetric("dom_mutations", t.length, "count"), t.forEach((r) => {
        r.type === "childList" && this.recordMetric(
          "dom_nodes_changed",
          r.addedNodes.length + r.removedNodes.length,
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
    let t = 0, r = 0;
    return e.forEach((i) => {
      const a = this.thresholds.get(i.name);
      a && (r++, i.value <= a.recommended ? t += 100 : i.value <= a.error ? t += Math.max(0, 100 - (i.value - a.recommended) / a.recommended * 50) : t += Math.max(0, 50 - (i.value - a.error) / a.error * 40));
    }), r > 0 ? Math.round(t / r) : 100;
  }
  analyzeIssues() {
    const e = [];
    return this.thresholds.forEach((t, r) => {
      const i = this.getLatestMetric(r);
      i && (i.value > t.error ? e.push({
        type: "error",
        message: `${r} 严重超标: ${i.value}${i.unit}`,
        metric: r,
        impact: "critical",
        recommendation: `需要立即优化 ${r}，建议值: ${t.recommended}${i.unit}`
      }) : i.value > t.warning && e.push({
        type: "warning",
        message: `${r} 接近警告阈值: ${i.value}${i.unit}`,
        metric: r,
        impact: "medium",
        recommendation: `优化 ${r}，目标: ${t.recommended}${i.unit}`
      }));
    }), e;
  }
  analyzeTrends() {
    const e = [];
    return this.metrics.forEach((t, r) => {
      if (t.length < 2) return;
      const i = t.slice(-5), a = t.slice(-10, -5);
      if (i.length > 0 && a.length > 0) {
        const n = i.reduce((d, u) => d + u.value, 0) / i.length, o = a.reduce((d, u) => d + u.value, 0) / a.length, c = o > 0 ? (n - o) / o * 100 : 0;
        let l;
        c < -5 ? l = "improving" : c > 5 ? l = "degrading" : l = "stable", e.push({
          metric: r,
          trend: l,
          changePercent: Math.round(c)
        });
      }
    }), e;
  }
  generateRecommendations() {
    const e = [];
    return this.analyzeIssues().forEach((r) => {
      switch (r.metric) {
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
          t.getEntries().forEach((r) => {
            this.recordMetric("long_task", r.duration, "ms", "duration");
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
    this.stopMonitoring(), this.observers.forEach((e) => e.disconnect()), this.observers.clear(), this.reportCallbacks.clear(), this.metrics.clear(), this.thresholds.clear(), D.instance = null;
  }
};
g(D, "instance");
let V = D;
const z = class z {
  constructor() {
    g(this, "mutationObserver", null);
    g(this, "debounceOptimizer", null);
    g(this, "memoryLeakProtector", null);
    g(this, "lazyLoadingOptimizer", null);
    g(this, "batchProcessor", null);
    g(this, "performanceMonitor", null);
    g(this, "config");
    g(this, "isInitialized", !1);
    g(this, "initializationPromise", null);
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
      e && this.applyConfig(e), this.config.mutationObserver && (this.mutationObserver = new lr(
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
      )), this.config.debounce.length > 0 && (this.debounceOptimizer = new dr(), this.config.debounce.forEach((t) => {
        this.debounceOptimizer.addLayer(t.name, t);
      })), this.config.memoryLeak.enableAutoCleanup && (this.memoryLeakProtector = J.getInstance(), this.memoryLeakProtector.setAutoCleanup(!0, this.config.memoryLeak.autoCleanupInterval)), this.config.lazyLoading && (this.lazyLoadingOptimizer = new ur(this.config.lazyLoading)), this.config.batchProcessing && (this.batchProcessor = new hr(this.config.batchProcessing)), this.config.performanceMonitoring.enableMonitoring && (this.performanceMonitor = V.getInstance(), this.performanceMonitor.updateConfig({
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
  async executeTask(e, t = [], r = "normal") {
    return this.debounceOptimizer ? this.debounceOptimizer.execute(e, t, r) : e(...t);
  }
  /**
   * 跟踪资源
   */
  trackEventListener(e, t, r, i) {
    return this.memoryLeakProtector ? this.memoryLeakProtector.trackEventListener(e, t, r, i) : (e.addEventListener(t, r, i), null);
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
  registerLazyModule(e, t, r) {
    this.lazyLoadingOptimizer && this.lazyLoadingOptimizer.registerModule(e, t, r);
  }
  /**
   * 添加批量操作
   */
  addBatchOperation(e, t, r) {
    return this.batchProcessor ? this.batchProcessor.addOperation(e, t, r) : null;
  }
  /**
   * 记录性能指标
   */
  recordMetric(e, t, r, i) {
    this.performanceMonitor && this.performanceMonitor.recordMetric(e, t, r, i);
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
    }, t = Object.values(e).some((a) => a), r = this.determineHealthStatus(), i = this.generateOptimizationSuggestions();
    return {
      enabled: t,
      components: e,
      health: r,
      suggestions: i
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
    const e = this.getOptimizationStatus(), t = this.getPerformanceReport(), r = this.getMemoryStats();
    let i = `
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
${e.suggestions.map((a) => `  - ${a}`).join(`
`)}
`;
    return t && (i += `
性能指标:
  健康分数: ${t.healthScore}/ 100
  当前问题数: ${t.issues.length}
`), r && (i += `
内存统计:
  跟踪资源: ${r.totalResources}
  内存使用: ${Math.round(r.memoryUsage / 1024 / 1024 * 100) / 100} MB
`), i;
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
    const t = e.issues.filter((r) => r.impact === "critical");
    t.length > 0 && (this.log("检测到关键性能问题:", t), this.triggerOptimization());
  }
  /**
   * 确定健康状态
   */
  determineHealthStatus() {
    const e = Object.values(this.getOptimizationStatus().components).filter((r) => r).length, t = this.getPerformanceReport();
    return e >= 5 && t && t.healthScore >= 80 ? "excellent" : e >= 4 && t && t.healthScore >= 60 ? "good" : e >= 3 && t && t.healthScore >= 40 ? "warning" : "critical";
  }
  /**
   * 生成优化建议
   */
  generateOptimizationSuggestions() {
    const e = [], t = this.getOptimizationStatus(), r = this.getPerformanceReport();
    return t.components.mutationObserver || e.push("启用MutationObserver优化以减少DOM监听开销"), t.components.debounceOptimizer || e.push("启用防抖优化器以处理高频操作"), t.components.memoryLeakProtection || e.push("启用内存泄漏保护以防止内存泄露"), t.components.lazyLoading || e.push("启用懒加载以延迟非关键功能"), t.components.batchProcessing || e.push("启用批量处理以优化DOM操作"), t.components.performanceMonitoring || e.push("启用性能监控以实时追踪性能指标"), r && r.recommendations.forEach((i) => {
      e.push(`[${i.priority}] ${i.description}`);
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
g(z, "instance");
let Z = z;
function pr(s, e, t) {
  var r, i;
  try {
    const a = s.startsWith("#") ? s : `#${s}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(a))
      return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const n = parseInt(a.slice(1, 3), 16), o = parseInt(a.slice(3, 5), 16), c = parseInt(a.slice(5, 7), 16), l = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((i = (r = window.orca) == null ? void 0 : r.state) == null ? void 0 : i.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${n}, ${o}, ${c}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${n}, ${o}, ${c}) calc(l * 1.6) c h)` : `oklch(from rgb(${n}, ${o}, ${c}) calc(l * 0.6) c h)`;
  } catch {
    return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
function gr(s, ...e) {
  console.info("[OrcaPlugin]", s, ...e);
}
function mr(s, ...e) {
  console.error("[OrcaPlugin]", s, ...e);
}
function br(s, ...e) {
  console.warn("[OrcaPlugin]", s, ...e);
}
function fr(s, e, t, r) {
  const i = document.createElement("div");
  i.className = "orca-tabs-plugin orca-tabs-container";
  const a = Jt(s, e, r, t);
  return i.style.cssText = a, i;
}
function yr(s, e, t) {
  const r = document.createElement("div");
  r.className = "width-adjustment-dialog";
  const i = Xt();
  r.style.cssText = i;
  const a = document.createElement("div");
  a.className = "dialog-title", a.textContent = "调整面板宽度", r.appendChild(a);
  const n = document.createElement("div");
  n.className = "dialog-slider-container", n.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const o = document.createElement("input");
  o.type = "range", o.min = "120", o.max = "800", o.value = s.toString(), o.style.cssText = Kt();
  const c = document.createElement("div");
  c.className = "dialog-width-display", c.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, c.textContent = `当前宽度: ${s}px`, o.oninput = () => {
    const h = parseInt(o.value);
    c.textContent = `当前宽度: ${h}px`, e(h);
  }, n.appendChild(o), n.appendChild(c), r.appendChild(n);
  const l = document.createElement("div");
  l.className = "dialog-buttons", l.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = le(), d.onclick = () => de(r);
  const u = document.createElement("button");
  return u.className = "btn btn-secondary", u.textContent = "取消", u.style.cssText = le(), u.onclick = () => {
    t(), de(r);
  }, l.appendChild(d), l.appendChild(u), r.appendChild(l), r;
}
function de(s) {
  s && s.parentNode && s.parentNode.removeChild(s);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function vr() {
  if (document.getElementById("dialog-styles")) return;
  const s = document.createElement("style");
  s.id = "dialog-styles", s.textContent = `
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
  `, document.head.appendChild(s);
}
function xr(s, e) {
  return s.length !== e.length ? !0 : !s.every((t, r) => t === e[r]);
}
let U;
class Tr {
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(e) {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    /** 插件名称 - 动态获取的插件名称，用于API调用和存储 */
    g(this, "pluginName");
    // ==================== 重构的面板数据管理 ====================
    /** 面板顺序映射 - 存储面板ID和序号的映射关系，支持面板关闭后重新排序 */
    g(this, "panelOrder", []);
    /** 当前激活的面板ID - 通过.orca-panel.active获取 */
    g(this, "currentPanelId", null);
    /** 当前面板索引 - 在panelOrder数组中的索引位置 */
    g(this, "currentPanelIndex", -1);
    /** 每个面板的标签页数据 - 索引对应panelOrder数组，完全独立存储 */
    g(this, "panelTabsData", []);
    /** 存储服务实例 - 提供统一的数据存储接口，支持Orca API和localStorage降级 */
    g(this, "storageService", new we());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    g(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    g(this, "lastPanelCheckTime", 0);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* UI元素和状态管理 - UI Elements and State Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== UI元素引用 ====================
    /** 标签页容器元素 - 包含所有标签页的主容器 */
    g(this, "tabContainer", null);
    /** 循环切换器元素 - 用于在面板间切换的UI元素 */
    g(this, "cycleSwitcher", null);
    // ==================== 拖拽状态 ====================
    /** 是否正在拖拽 - 标识当前是否处于拖拽状态 */
    g(this, "isDragging", !1);
    /** 拖拽起始X坐标 - 记录拖拽开始时的鼠标X坐标 */
    g(this, "dragStartX", 0);
    /** 拖拽起始Y坐标 - 记录拖拽开始时的鼠标Y坐标 */
    g(this, "dragStartY", 0);
    // ==================== 配置参数 ====================
    /** 最大标签页数量 - 限制同时显示的标签页数量，从设置中读取 */
    g(this, "maxTabs", 10);
    /** 主页块ID - 主页块的唯一标识符，从设置中读取 */
    g(this, "homePageBlockId", null);
    /** 标签页位置 - 标签页容器的屏幕坐标位置 */
    g(this, "position", { x: 50, y: 50 });
    // ==================== 状态管理 ====================
    /** 监控定时器 - 用于定期检查面板状态和更新UI */
    g(this, "monitoringInterval", null);
    /** 全局事件监听器 - 统一的全局事件处理函数 */
    g(this, "globalEventListener", null);
    /** 更新防抖计时器 - 防止频繁更新UI的防抖机制 */
    g(this, "updateDebounceTimer", null);
    /** 上次更新时间 - 记录最后一次UI更新的时间戳 */
    g(this, "lastUpdateTime", 0);
    /** 是否正在更新 - 标识当前是否正在进行UI更新操作 */
    g(this, "isUpdating", !1);
    /** 是否已完成初始化 - 标识插件是否已完成初始化过程 */
    g(this, "isInitialized", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 布局和位置管理 - Layout and Position Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 布局模式 ====================
    /** 垂直模式标志 - 标识当前是否处于垂直布局模式 */
    g(this, "isVerticalMode", !1);
    /** 垂直模式窗口宽度 - 垂直布局模式下的标签页容器宽度 */
    g(this, "verticalWidth", 120);
    /** 垂直模式位置 - 垂直布局模式下的标签页容器位置 */
    g(this, "verticalPosition", { x: 20, y: 20 });
    /** 水平模式位置 - 水平布局模式下的标签页容器位置 */
    g(this, "horizontalPosition", { x: 20, y: 20 });
    // ==================== 调整大小状态 ====================
    /** 是否正在调整大小 - 标识当前是否正在进行大小调整操作 */
    g(this, "isResizing", !1);
    /** 是否固定到顶部 - 标识标签页容器是否固定到屏幕顶部 */
    g(this, "isFixedToTop", !1);
    /** 调整大小手柄 - 用于调整标签页容器大小的拖拽手柄元素 */
    g(this, "resizeHandle", null);
    // ==================== 侧边栏对齐 ====================
    /** 侧边栏对齐功能是否启用 - 控制是否自动与侧边栏对齐 */
    g(this, "isSidebarAlignmentEnabled", !1);
    /** 侧边栏状态监听器 - 监听侧边栏状态变化的MutationObserver */
    g(this, "sidebarAlignmentObserver", null);
    /** 上次检测到的侧边栏状态 - 用于检测侧边栏状态变化 */
    g(this, "lastSidebarState", null);
    /** 侧边栏防抖计时器 - 防止频繁响应侧边栏状态变化 */
    g(this, "sidebarDebounceTimer", null);
    // ==================== 窗口可见性 ====================
    /** 浮窗是否可见 - 控制标签页容器的显示/隐藏状态 */
    g(this, "isFloatingWindowVisible", !0);
    // ==================== 功能开关 ====================
    /** 是否显示块类型图标 - 控制是否在标签页中显示块类型图标 */
    g(this, "showBlockTypeIcons", !0);
    /** 是否在顶部栏显示按钮 - 控制是否在Orca顶部工具栏显示插件按钮 */
    g(this, "showInHeadbar", !0);
    /** 是否启用最近关闭的标签页功能 - 控制是否记录和显示最近关闭的标签页 */
    g(this, "enableRecentlyClosedTabs", !0);
    /** 是否启用多标签页保存功能 - 控制是否允许保存多个标签页组合 */
    g(this, "enableMultiTabSaving", !0);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 性能优化 - Performance Optimization */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 性能优化管理器 ====================
    /** 性能优化管理器 - 统一管理所有性能优化工具 */
    g(this, "performanceOptimizer", null);
    /** MutationObserver优化器实例 - 用于优化DOM变化监听 */
    g(this, "optimizedObserver", null);
    /** 高级防抖优化器实例 - 用于任务防抖和调度 */
    g(this, "debounceOptimizer", null);
    /** 内存泄漏防护器实例 - 用于跟踪和清理资源 */
    g(this, "memoryLeakProtector", null);
    /** 批量处理器实例 - 用于批量DOM操作 */
    g(this, "batchProcessor", null);
    /** 性能监控器实例 - 用于监控性能指标 */
    g(this, "performanceMonitor", null);
    /** 性能指标计数缓存 - 记录自定义指标的累计值 */
    g(this, "performanceCounters", {});
    /** 性能基线定时器ID - 控制基线采集任务 */
    g(this, "performanceBaselineTimer", null);
    /** 最近一次性能基线场景 */
    g(this, "lastBaselineScenario", null);
    /** 最近一次性能基线报告 */
    g(this, "lastBaselineReport", null);
    /** 上一次插件初始化耗时（毫秒） */
    g(this, "lastInitDurationMs", null);
    /** 性能指标名称常量 */
    g(this, "performanceMetricKeys", {
      initTotal: "plugin_init_total",
      tabInteraction: "tab_interaction_total",
      domMutations: "dom_mutations"
    });
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 拖拽和事件管理 - Drag and Event Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 拖拽状态管理 ====================
    /** 当前正在拖拽的标签 - 存储正在被拖拽的标签页信息 */
    g(this, "draggingTab", null);
    /** 全局拖拽结束监听器 - 处理拖拽结束事件的全局监听器 */
    g(this, "dragEndListener", null);
    /** 拖拽交换防抖计时器 - 防止拖拽过程中频繁触发交换操作 */
    g(this, "swapDebounceTimer", null);
    /** 上次交换的目标标签ID - 防止重复交换同一目标标签 */
    g(this, "lastSwapTarget", null);
    /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
    g(this, "dropIndicator", null);
    /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
    g(this, "dragOverTab", null);
    /** 优化的拖拽监听器 - 避免全文档监听 */
    g(this, "dragOverListener", null);
    /** 懒加载状态 - 避免不必要的初始化 */
    g(this, "isDragListenersInitialized", !1);
    /** 拖拽悬停计时器 - 控制拖拽悬停的延迟响应 */
    g(this, "dragOverTimer", null);
    /** 是否正在拖拽悬停状态 - 标识当前是否处于拖拽悬停状态 */
    g(this, "isDragOverActive", !1);
    // ==================== 事件监听器 ====================
    /** 主题变化监听器 - 监听Orca主题变化的事件监听器 */
    g(this, "themeChangeListener", null);
    /** 滚动监听器 - 监听页面滚动事件的监听器 */
    g(this, "scrollListener", null);
    // ==================== 缓存和优化 ====================
    /** 上次面板发现时间 - 记录最后一次发现面板的时间戳 */
    g(this, "lastPanelDiscoveryTime", 0);
    /** 面板发现缓存 - 缓存面板发现结果，避免频繁扫描 */
    g(this, "panelDiscoveryCache", null);
    /** 设置检查定时器 - 定期检查设置变化的定时器 */
    g(this, "settingsCheckInterval", null);
    /** 上次的设置状态 - 缓存上次的设置状态，用于检测变化 */
    g(this, "lastSettings", null);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 已关闭标签页跟踪 ====================
    /** 已关闭的标签页blockId集合 - 用于跟踪已关闭的标签页，避免重复创建 */
    g(this, "closedTabs", /* @__PURE__ */ new Set());
    /** 最近关闭的标签页列表 - 按时间倒序存储最近关闭的标签页信息 */
    g(this, "recentlyClosedTabs", []);
    /** 保存的多标签页集合 - 存储用户保存的标签页组合 */
    g(this, "savedTabSets", []);
    /** 记录上一个标签集合 - 用于比较标签页变化 */
    g(this, "previousTabSet", null);
    // ==================== 工作区功能 ====================
    /** 工作区列表 - 存储所有用户创建的工作区 */
    g(this, "workspaces", []);
    /** 当前工作区ID - 标识当前激活的工作区 */
    g(this, "currentWorkspace", null);
    /** 是否启用工作区功能 - 控制工作区功能的开关 */
    g(this, "enableWorkspaces", !0);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    g(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    g(this, "lastActiveBlockId", null);
    // ==================== 快捷键相关 ====================
    /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
    g(this, "hoveredBlockId", null);
    /** 当前右键菜单对应的块引用ID - 用于上下文菜单操作 */
    g(this, "currentContextBlockRefId", null);
    // 防抖函数实例（仅用于拖拽等非关键场景）
    g(this, "draggingDebounce", cr(async () => {
      await this.updateTabsUI();
    }, 200));
    this.pluginName = e, this.initializePerformanceOptimizers();
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 日志管理 - Log Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  // ==================== 日志系统 ====================
  /** 简单的日志方法 */
  log(e, ...t) {
    gr(e, ...t);
  }
  logError(e, ...t) {
    mr(e, ...t);
  }
  logWarn(e, ...t) {
    br(e, ...t);
  }
  /**
   * 初始化性能优化器
   */
  initializePerformanceOptimizers() {
    try {
      this.log("🚀 初始化性能优化器..."), this.performanceOptimizer = Z.getInstance(), this.performanceMonitor = V.getInstance(), this.log("✅ 性能优化器初始化完成");
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
      return this.performanceMonitor = V.getInstance(), this.performanceMonitor;
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
    } catch (r) {
      return this.verboseLog(`[Performance] unable to start measurement: ${e}`, r), null;
    }
  }
  /**
   * 记录计数型指标
   */
  recordPerformanceCountMetric(e) {
    const t = this.ensurePerformanceMonitorInstance();
    if (!t)
      return;
    const r = (this.performanceCounters[e] ?? 0) + 1;
    this.performanceCounters[e] = r, t.recordMetric(e, r, "count", "count");
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
    var i, a;
    typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null;
    const t = ((i = this.performanceOptimizer) == null ? void 0 : i.getPerformanceReport()) ?? ((a = this.ensurePerformanceMonitorInstance()) == null ? void 0 : a.generateReport());
    if (!t) {
      this.verboseLog(`[Performance] baseline unavailable for scenario: ${e}`);
      return;
    }
    this.lastBaselineReport = t, this.lastBaselineScenario = e;
    const r = this.formatPerformanceBaselineReport(t, e);
    this.log(r);
  }
  /**
   * 构建性能基线日志
   */
  formatPerformanceBaselineReport(e, t) {
    const r = this.getLatestMetricMap(e.metrics), i = r.get(this.performanceMetricKeys.initTotal), a = r.get(this.performanceMetricKeys.tabInteraction), n = r.get(this.performanceMetricKeys.domMutations), o = r.get("fps"), c = r.get("memory_heap"), l = i ? `${i.value.toFixed(1)}${i.unit}` : this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : "n/a", d = a ? `${a.value.toFixed(0)}` : `${this.performanceCounters[this.performanceMetricKeys.tabInteraction] ?? 0}`, u = n ? `${n.value.toFixed(0)}` : "0", h = o ? `${o.value.toFixed(0)}fps` : "n/a", p = c ? this.formatBytes(c.value) : "n/a";
    return [
      `[Performance][${t}] Baseline`,
      `  healthScore: ${e.healthScore}`,
      `  init_total: ${l}`,
      `  tab_interactions: ${d}`,
      `  dom_mutations: ${u}`,
      `  fps: ${h}`,
      `  heap_used: ${p}`,
      `  issues: ${e.issues.length}`
    ].join(`
`);
  }
  getLatestMetricMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const r of e) {
      const i = t.get(r.name);
      (!i || i.timestamp <= r.timestamp) && t.set(r.name, r);
    }
    return t;
  }
  formatBytes(e) {
    return e < 1024 ? `${e.toFixed(0)}B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)}KB` : e < 1024 * 1024 * 1024 ? `${(e / 1024 / 1024).toFixed(1)}MB` : `${(e / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }
  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  debugLog(...e) {
    this.log(e.join(" "));
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...e) {
    this.log(e.join(" "));
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
    vr(), this.tabStorageService = new Se(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[ue.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFixedToTopMode(), await this.restoreFloatingWindowVisibility();
    const { workspaces: t, enableWorkspaces: r } = await this.tabStorageService.loadWorkspaces();
    this.workspaces = t, this.enableWorkspaces = r, this.registerHeadbarButton(), await this.discoverPanels();
    const i = this.getFirstPanel();
    i ? this.log(`🎯 初始化第1个面板（持久化面板）: ${i}`) : this.log("⚠️ 初始化时没有发现面板"), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization();
    const a = await this.tabStorageService.restoreFirstPanelTabs();
    this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = a, await this.updateRestoredTabsBlockTypes(), this.closedTabs = await this.tabStorageService.restoreClosedTabs(), this.recentlyClosedTabs = await this.tabStorageService.restoreRecentlyClosedTabs(), this.savedTabSets = await this.tabStorageService.restoreSavedTabSets();
    const n = document.querySelector(".orca-panel.active"), o = n == null ? void 0 : n.getAttribute("data-panel-id");
    if (o && !o.startsWith("_") && (this.currentPanelId = o, this.currentPanelIndex = this.getPanelIds().indexOf(o), this.log(`🎯 当前活动面板: ${o} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1) {
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
    if (o && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${o} 的标签页`), await this.scanCurrentPanelTabs();
    else if (o && this.currentPanelIndex === 0) {
      this.log("📋 当前活动面板是第一个面板，使用持久化数据");
      const c = document.querySelector(".orca-panel.active");
      if (c) {
        const l = c.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
        if (l) {
          const d = l.getAttribute("data-block-id");
          d && (this.getCurrentPanelTabs().find((p) => p.blockId === d) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${d}`), await this.checkCurrentPanelBlocks()));
        }
      }
    }
    await this.autoDetectAndSyncCurrentFocus(), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.initializeOptimizedDOMObserver(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.setupSettingsChecker(), e && (this.lastInitDurationMs = e()), this.schedulePerformanceBaselineReport("startup"), this.isInitialized = !0, this.log("✅ 插件初始化完成");
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
      const r = this.getPanelIds().indexOf(t);
      r !== -1 && (this.currentPanelIndex = r, this.currentPanelId = t, this.log(`🔄 更新当前面板索引: ${r} (面板ID: ${t})`));
      const i = e.querySelectorAll('.orca-hideable:not([style*="display: none"])');
      let a = null;
      for (const d of i) {
        if (this.isInsidePopup(d))
          continue;
        const u = d.querySelector(".orca-block-editor[data-block-id]");
        if (u) {
          a = u;
          break;
        }
      }
      if (!a) {
        this.log(`⚠️ 激活面板 ${t} 中没有找到可见的块编辑器，跳过自动检测`);
        return;
      }
      const n = a.getAttribute("data-block-id");
      if (!n) {
        this.log("⚠️ 激活的块编辑器没有blockId，跳过自动检测");
        return;
      }
      this.log(`🔍 检测到当前可见的块ID: ${n}`);
      let o = this.getCurrentPanelTabs();
      o.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), o = this.getCurrentPanelTabs());
      const c = o.find((d) => d.blockId === n);
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
      if (this.log(`🔍 获取到标签信息: "${l.title}" (类型: ${l.blockType || "unknown"})`), o.length >= this.maxTabs) {
        const d = o.length - 1, u = o[d];
        o[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${u.title}" -> "${l.title}"`);
      } else
        l.order = o.length, o.push(l), this.log(`➕ 添加新标签页到末尾: "${l.title}" (当前标签数: ${o.length}/${this.maxTabs})`);
      this.setCurrentPanelTabs(o), await this.saveCurrentPanelTabs(), this.updateFocusState(n, l.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功创建并同步新标签页: "${l.title}" (${n})`);
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
    const e = (a) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", a), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", e), this.log("主题变化监听器注册成功");
    } catch (a) {
      this.error("主题变化监听器注册失败:", a);
    }
    let t = orca.state.themeMode;
    const i = setInterval(() => {
      const a = orca.state.themeMode;
      a !== t && (this.log("备用检测：主题从", t, "切换到", a), t = a, setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 200));
    }, 500);
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", e), clearInterval(i);
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
        const i = this.getCurrentActiveTab();
        i && this.recordScrollPosition(i);
      }, 300);
    }, r = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    r.forEach((i) => {
      i.addEventListener("scroll", t, { passive: !0 });
    }), this.scrollListener = () => {
      r.forEach((i) => {
        i.removeEventListener("scroll", t);
      }), e && clearTimeout(e);
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
    let e = null;
    this.dragOverListener = (t) => {
      this.draggingTab && (e || (e = requestAnimationFrame(() => {
        e = null;
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
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab").forEach((t) => {
      t.removeAttribute("data-dragging"), t.removeAttribute("data-drag-over"), t.classList.remove("dragging", "drag-over");
    }), this.tabContainer.removeAttribute("data-dragging")), this.clearDropIndicator();
  }
  /**
   * 创建拖拽位置指示器
   */
  createDropIndicator(e, t) {
    const r = document.createElement("div");
    r.className = "orca-tab-drop-indicator", r.style.cssText = `
      position: absolute;
      height: 2px;
      background: var(--orca-color-primary-5);
      border-radius: 1px;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
      transition: all 0.2s ease;
    `;
    const i = e.getBoundingClientRect(), a = e.parentElement;
    if (a) {
      const n = a.getBoundingClientRect();
      t === "before" ? (r.style.left = `${i.left - n.left}px`, r.style.top = `${i.top - n.top - 1}px`, r.style.width = `${i.width}px`) : (r.style.left = `${i.left - n.left}px`, r.style.top = `${i.bottom - n.top - 1}px`, r.style.width = `${i.width}px`), a.appendChild(r);
    }
    return r;
  }
  /**
   * 更新拖拽位置指示器
   */
  updateDropIndicator(e, t) {
    this.clearDropIndicator(), this.dropIndicator = this.createDropIndicator(e, t);
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
  async debouncedSwapTab(e, t) {
    this.lastSwapTarget !== e.blockId && (this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = window.setTimeout(async () => {
      await this.swapTab(e, t), this.lastSwapTarget = e.blockId;
    }, 16));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(e, t) {
    const r = this.getCurrentPanelTabs(), i = r.findIndex((c) => c.blockId === e.blockId), a = r.findIndex((c) => c.blockId === t.blockId);
    if (i === -1 || a === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (i === a) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${a}) -> ${e.title} (${i})`);
    const n = r[a], o = r[i];
    r[i] = n, r[a] = o, r.forEach((c, l) => {
      c.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(r), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${n.title} -> 位置 ${i}`);
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
    let r = null;
    e.forEach((a) => {
      const n = a.getAttribute("data-panel-id");
      if (n) {
        if (n.startsWith("_"))
          return;
        t.push(n), a.classList.contains("active") && (r = n);
      }
    });
    const i = this.getPanelIds();
    this.updatePanelOrder(t), this.updateCurrentPanelInfo(r), await this.handlePanelChanges(i, t);
  }
  /**
   * 更新当前面板信息
   */
  updateCurrentPanelInfo(e) {
    if (e) {
      const t = this.panelOrder.findIndex((r) => r.id === e);
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
    const r = e.filter((a) => !t.includes(a));
    r.length > 0 && (this.log("🗑️ 检测到面板被关闭:", r), await this.handlePanelClosure(r));
    const i = t.filter((a) => !e.includes(a));
    i.length > 0 && (this.log("🆕 检测到新面板被打开:", i), this.handleNewPanels(i)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   */
  async handlePanelClosure(e) {
    this.log("🗑️ 处理面板关闭:", e);
    const t = [];
    e.forEach((r) => {
      const i = this.panelOrder.findIndex((a) => a.id === r);
      i !== -1 && t.push(i);
    }), t.sort((r, i) => i - r).forEach((r) => {
      this.panelTabsData.splice(r, 1), this.log(`🗑️ 删除面板 ${e[t.indexOf(r)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((r) => r.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let r = 0; r < this.panelOrder.length; r++) {
      const i = this.panelTabsData[r] || [], a = r === 0 ? w.FIRST_PANEL_TABS : `panel_${r + 1}_tabs`;
      await this.savePanelTabsByKey(a, i);
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
    if (this.panelOrder.find((r) => r.id === e)) {
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
    const t = this.panelOrder.findIndex((r) => r.id === e);
    if (t === -1) {
      this.log(`⚠️ 面板 ${e} 不存在，无法删除`);
      return;
    }
    this.panelOrder.splice(t, 1), this.panelOrder.forEach((r, i) => {
      r.order = i + 1;
    }), this.log(`🗑️ 删除面板 ${e}，重新排序后的面板:`, this.panelOrder.map((r) => `${r.id}(${r.order})`)), this.panelTabsData.splice(t, 1);
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
    if (t.length === e.length && t.every((a, n) => a === e[n]))
      return;
    e.forEach((a) => {
      this.panelOrder.find((n) => n.id === a) || this.addPanel(a);
    }), this.panelOrder.filter((a) => !e.includes(a.id)).forEach((a) => {
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
    const r = t.querySelectorAll(".orca-block-editor[data-block-id]"), i = [];
    let a = 0;
    this.log(`🔍 扫描第一个面板 ${e}，找到 ${r.length} 个块编辑器`);
    for (const n of r) {
      const o = n.getAttribute("data-block-id");
      if (!o) continue;
      const c = await this.getTabInfo(o, e, a++);
      c && (i.push(c), this.log(`📋 找到标签页: ${c.title} (${o})`));
    }
    this.panelTabsData[0] = [...i], await this.savePanelTabsByKey(w.FIRST_PANEL_TABS, i), this.log(`📋 第一个面板扫描并保存了 ${i.length} 个标签页`);
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
    const e = this.getCurrentPanelTabs(), t = nr(e);
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return ar(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return Ft(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, r = !1, i = !1;
    for (const a of e)
      a && typeof a == "object" && (a.t === "r" && a.v ? (i = !0, a.a || (t = !0)) : a.t === "t" && a.v && (r = !0));
    return t || r && i;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return Rt(e);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 检测块类型
   */
  async detectBlockType(e) {
    try {
      if (ce(e))
        return "journal";
      if (e["data-type"]) {
        const i = e["data-type"];
        switch (this.log(`🔍 检测到 data-type: ${i}`), i) {
          case "table2":
            return "table";
          case "ul":
            return "list";
          case "ol":
            return "list";
          default:
            this.log(`⚠️ 未知的 data-type: ${i}`);
        }
      }
      if (e.aliases && e.aliases.length > 0) {
        this.log(`🏷️ 检测到别名块: aliases=${JSON.stringify(e.aliases)}`);
        const i = e.aliases[0];
        if (i)
          try {
            const a = this.findProperty(e, "_hide");
            return a && a.value ? (this.log(`📄 通过 _hide 属性确认为页面: ${i} (hide=${a.value})`), "page") : (this.log(`🏷️ 通过 _hide 属性确认为标签: ${i} (hide=${a ? a.value : "undefined"})`), "tag");
          } catch (a) {
            return this.warn("使用 API 检测标签失败，回退到文本分析:", a), i.includes("#") || i.includes("@") || i.length < 20 && i.match(/^[a-zA-Z0-9_-]+$/) || i.match(/^[a-z]+$/i) ? "tag" : "page";
          }
        return "alias";
      }
      this.verboseLog(`🔍 块信息调试: blockId=${e.id}, aliases=${e.aliases ? JSON.stringify(e.aliases) : "undefined"}, content=${e.content ? "exists" : "undefined"}, text=${e.text ? "exists" : "undefined"}`);
      const r = this.findProperty(e, "_repr");
      if (r && r.type === he.JSON && r.value)
        try {
          const i = typeof r.value == "string" ? JSON.parse(r.value) : r.value;
          if (i.type)
            return i.type;
        } catch {
        }
      if (e.content && Array.isArray(e.content)) {
        if (e.content.some(
          (c) => c && typeof c == "object" && c.type === "code"
        ))
          return "code";
        if (e.content.some(
          (c) => c && typeof c == "object" && c.type === "table"
        ))
          return "table";
        if (e.content.some(
          (c) => c && typeof c == "object" && c.type === "image"
        ))
          return "image";
        if (e.content.some(
          (c) => c && typeof c == "object" && c.type === "link"
        ))
          return "link";
      }
      if (e.text) {
        const i = e.text.trim();
        if (i.startsWith("#"))
          return "heading";
        if (i.startsWith("> "))
          return "quote";
        if (i.startsWith("```") || i.startsWith("`"))
          return "code";
        if (i.startsWith("- [ ]") || i.startsWith("- [x]") || i.startsWith("* [ ]") || i.startsWith("* [x]"))
          return "task";
        if (i.includes("|") && i.split(`
`).length > 1)
          return "table";
        if (i.startsWith("- ") || i.startsWith("* ") || i.startsWith("+ ") || /^\d+\.\s/.test(i))
          return "list";
        if (/https?:\/\/[^\s]+/.test(i))
          return "link";
        if (i.includes("$$") || i.includes("$") && i.includes("="))
          return "math";
      }
      return "text";
    } catch (t) {
      return this.warn("检测块类型失败:", t), "text";
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
  getBlockTypeIcon(e) {
    const t = {
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
    let r = t[e];
    if (!r) {
      const i = this.getSmartIcon(e, t);
      i && (r = i);
    }
    return r || (r = t.default), this.verboseLog(`🎨 为块类型 "${e}" 分配图标: ${r}`), r;
  }
  /**
   * 智能图标选择
   */
  getSmartIcon(e, t) {
    const r = e.toLowerCase(), i = {
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
    for (const [a, n] of Object.entries(i))
      if (r.includes(a))
        return n;
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
          let r = t.trim();
          return r = this.processSpecialFormats(r), r = this.cleanTitle(r), r.length > 50 && (r = r.substring(0, 47) + "..."), r;
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
    for (const r of e)
      if (typeof r == "string")
        t.push(r);
      else if (r && typeof r == "object") {
        if (r.t === "text" && r.v)
          t.push(r.v);
        else if (r.text)
          t.push(r.text);
        else if (r.content) {
          const i = this.extractTextFromContentSync(r.content);
          i && t.push(i);
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
          const i = e.getDay(), n = ["日", "一", "二", "三", "四", "五", "六"][i], o = t.replace(/E/g, n);
          return A(e, o);
        } else
          return A(e, t);
      else
        return A(e, t);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const a of i)
        try {
          return A(e, a);
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
    return !e.properties || !Array.isArray(e.properties) ? null : e.properties.find((r) => r.name === t);
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
    ].some((r) => r.test(e));
  }
  async getTabInfo(e, t, r) {
    try {
      const i = await orca.invokeBackend("get-block", parseInt(e));
      if (!i) return null;
      let a = "", n = "", o = "", c = !1, l = "";
      l = await this.detectBlockType(i), this.log(`🔍 检测到块类型: ${l} (块ID: ${e})`), i.aliases && i.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${l}`);
      try {
        const d = ce(i);
        if (d)
          c = !0, a = Wt(d);
        else if (i.aliases && i.aliases.length > 0)
          a = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? a = i.text.substring(0, 50) : a = (await this.extractTextFromContent(i.content)).substring(0, 50);
        else if (i.text) {
          let u = i.text.substring(0, 50);
          if (l === "list") {
            const h = i.text.split(`
`)[0].trim();
            h && (u = h.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (l === "table") {
            const h = i.text.split(`
`)[0].trim();
            h && (u = h.replace(/\|/g, "").trim());
          } else if (l === "quote") {
            const h = i.text.split(`
`)[0].trim();
            h && (u = h.replace(/^>\s+/, ""));
          } else if (l === "image") {
            const h = i.text.match(/caption:\s*(.+)/i);
            h && h[1] ? u = h[1].trim() : u = i.text.trim();
          }
          a = u;
        } else
          a = `块 ${e}`;
      } catch (d) {
        this.warn("获取标题失败:", d), a = `块 ${e}`;
      }
      try {
        const d = this.findProperty(i, "_color"), u = this.findProperty(i, "_icon");
        d && d.type === 1 && (n = d.value), u && u.type === 1 && u.value && u.value.trim() ? (o = u.value, this.log(`🎨 使用用户自定义图标: ${o} (块ID: ${e})`)) : (this.showBlockTypeIcons || l === "journal") && (o = this.getBlockTypeIcon(l), this.log(`🎨 使用块类型图标: ${o} (块类型: ${l}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), o = this.getBlockTypeIcon(l);
      }
      return {
        blockId: e,
        panelId: t,
        title: a || `块 ${e}`,
        color: n,
        icon: o,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: r,
        blockType: l
      };
    } catch (i) {
      return this.error("获取标签信息失败:", i), null;
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
    let t, r, i;
    if (this.isFixedToTop ? (t = { x: 0, y: 0 }, r = !1, i = window.innerWidth) : (t = this.isVerticalMode ? this.verticalPosition : this.position, r = this.isVerticalMode, i = this.verticalWidth), this.tabContainer = fr(
      r,
      t,
      i,
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
          gap: 4px;
        `, this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${n.className || n.tagName}`);
    } else
      document.body.appendChild(this.tabContainer);
    this.tabContainer.addEventListener("mousedown", (n) => {
      const o = n.target;
      o.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !o.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && n.stopPropagation();
    }), this.tabContainer.addEventListener("click", (n) => {
      const o = n.target;
      o.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !o.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && n.stopPropagation();
    });
    const a = document.createElement("div");
    a.className = "drag-handle", a.style.cssText = `
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
    `, a.innerHTML = "", a.addEventListener("mouseenter", () => {
      a.style.opacity = "0.5";
    }), a.addEventListener("mouseleave", () => {
      a.style.opacity = "0";
    }), a.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(a), this.isFixedToTop || document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && this.enableDragResize(), await this.updateTabsUI();
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

      /* 拖拽容器状态 */
      .orca-tabs-plugin .orca-tabs-plugin .orca-tabs-plugin .orca-tabs-container[data-dragging="true"] {
        background-color: var(--orca-color-bg-1);
        border: 2px dashed rgba(239, 68, 68, 0.4);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      /* 拖拽时的过渡动画 */
      .orca-tabs-plugin .orca-tab {
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
      }

      /* 暗色模式下的悬停样式 - 通过CSS变量自动应用，但排除聚焦状态 */
      :root[data-theme="dark"] .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]),
      .dark .orca-tabs-plugin .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]):not([data-focused="true"]) {
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
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

      /* 暗色模式下的聚焦样式 */
      .dark .orca-tabs-plugin .orca-tab[data-focused="true"] {
        border: 1px solid var(--orca-color-primary-5) !important;
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
      if (e - this.lastUpdateTime < 50)
        return;
      this.lastUpdateTime = e;
      const t = this.tabContainer.querySelector(".drag-handle"), r = this.tabContainer.querySelector(".new-tab-button"), i = this.tabContainer.querySelector(".workspace-button");
      this.tabContainer.innerHTML = "", t && this.tabContainer.appendChild(t);
      let a = this.currentPanelId, n = this.currentPanelIndex;
      if (!a && this.panelOrder.length > 0 && (a = this.panelOrder[0].id, n = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${a}`)), a) {
        this.log(`📋 显示面板 ${a} 的标签页`);
        let o = this.panelTabsData[n] || [];
        o.length === 0 && (this.log(`🔍 面板 ${a} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(n, a), o = this.panelTabsData[n] || []), this.sortTabsByPinStatus(), o.forEach((c, l) => {
          var u, h;
          const d = this.createTabElement(c);
          if ((u = this.tabContainer) == null || u.appendChild(d), !this.isVerticalMode && l < o.length - 1) {
            const p = Gt();
            (h = this.tabContainer) == null || h.appendChild(p);
          }
        });
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton(), this.isFixedToTop) {
        const o = "var(--orca-tab-bg)", c = "var(--orca-tab-border)", l = "var(--orca-color-text-1)", d = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        d.forEach((h) => {
          const p = h.getAttribute("data-tab-id");
          if (!p) return;
          const b = this.getCurrentPanelTabs().find((m) => m.blockId === p);
          if (b) {
            let m, y, v = "normal";
            if (m = "var(--orca-tab-bg)", y = "var(--orca-color-text-1)", b.color)
              try {
                h.style.setProperty("--tab-color", b.color), m = "var(--orca-tab-colored-bg)", y = "var(--orca-tab-colored-text)", v = "600";
              } catch {
              }
            h.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${m};
            border-radius: var(--orca-radius-md);
            border: 1px solid ${c};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${y};
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
        const u = this.tabContainer.querySelector(".new-tab-button");
        u && (u.style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${o};
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
      e.forEach((r, i) => {
        const a = this.createTabElement(r);
        t.appendChild(a);
      });
    else {
      const r = document.createElement("div");
      r.className = "panel-status", r.style.cssText = `
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
      const i = this.currentPanelIndex + 1;
      r.textContent = `面板 ${i}（无标签页）`, r.title = `当前在面板 ${i}，该面板没有标签页`, t.appendChild(r);
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
      e.forEach((r, i) => {
        const a = this.createTabElement(r);
        t.appendChild(a);
      });
    else {
      const r = document.createElement("div");
      r.className = "panel-status", r.style.cssText = `
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
      const i = this.currentPanelIndex + 1;
      r.textContent = `面板 ${i}（无标签页）`, r.title = `当前在面板 ${i}，该面板没有标签页`, t.appendChild(r);
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
    const r = this.isVerticalMode ? `
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
    t.style.cssText = r, t.innerHTML = "+", t.title = "新建标签页", t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", async (i) => {
      i.preventDefault(), i.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
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
    var i;
    if (!this.tabContainer || this.tabContainer.querySelector(".workspace-button")) return;
    const t = document.createElement("div");
    t.className = "workspace-button";
    const r = this.isVerticalMode ? `
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
    t.style.cssText = r, t.innerHTML = "📁", t.title = `工作区 (${((i = this.workspaces) == null ? void 0 : i.length) || 0})`, t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", (a) => {
      a.preventDefault(), a.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(a);
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
    var u, h;
    const t = document.querySelector(".new-tab-context-menu");
    t && t.remove();
    const r = document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : h.themeMode) === "dark", i = document.createElement("div");
    i.className = "new-tab-context-menu";
    const a = 200, n = 140, { x: o, y: c } = _(e.clientX, e.clientY, a, n);
    i.style.cssText = `
      position: fixed;
      left: ${o}px;
      top: ${c}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: ${a}px;
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
    ), l.forEach((p) => {
      if (p.separator) {
        const m = document.createElement("div");
        m.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, i.appendChild(m);
        return;
      }
      const f = document.createElement("div");
      if (f.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: ${r ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
      `, p.icon) {
        const m = document.createElement("span");
        m.textContent = p.icon, m.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, f.appendChild(m);
      }
      const b = document.createElement("span");
      b.textContent = p.text, f.appendChild(b), f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = "transparent";
      }), f.addEventListener("click", () => {
        p.action && p.action(), i.remove();
      }), i.appendChild(f);
    }), document.body.appendChild(i);
    const d = (p) => {
      i.contains(p.target) || (i.remove(), document.removeEventListener("click", d));
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
        (i) => i.type === "attributes" && i.attributeName === "class"
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
    const t = e.classList.contains("sidebar-closed"), r = e.classList.contains("sidebar-opened");
    t ? this.lastSidebarState = "closed" : r ? this.lastSidebarState = "opened" : this.lastSidebarState = "unknown";
  }
  /**
   * 立即检查侧边栏状态变化（无防抖）
   */
  checkSidebarStateChangeImmediate() {
    if (!this.isSidebarAlignmentEnabled) return;
    const e = document.querySelector("div#app");
    if (!e) return;
    const t = e.classList.contains("sidebar-closed"), r = e.classList.contains("sidebar-opened");
    let i;
    t ? i = "closed" : r ? i = "opened" : i = "unknown", this.lastSidebarState !== i && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${i}`), this.lastSidebarState = i, this.autoAdjustSidebarAlignment());
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
      const r = t.classList.contains("sidebar-closed"), i = t.classList.contains("sidebar-opened");
      if (!r && !i) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const a = this.getCurrentPosition();
      if (!a) return;
      const n = this.calculateSidebarAlignmentPosition(
        a,
        e,
        r,
        i
      );
      if (!n) return;
      await this.updatePosition(n), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${a.x}, ${a.y}) → (${n.x}, ${n.y})`);
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
  calculateSidebarAlignmentPosition(e, t, r, i) {
    var n;
    let a;
    if (r)
      a = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${a}px`);
    else if (i) {
      a = e.x + t;
      const o = ((n = this.tabContainer) == null ? void 0 : n.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      a = Math.min(a, window.innerWidth - o - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${a}px`);
    } else
      return null;
    return { x: a, y: e.y };
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
        var r, i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (a) => this.showRecentlyClosedTabsMenu(a),
          title: `最近关闭的标签页 (${((r = this.recentlyClosedTabs) == null ? void 0 : r.length) || 0})`,
          style: {
            color: (((i = this.recentlyClosedTabs) == null ? void 0 : i.length) || 0) > 0 ? "#ff6b6b" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: "ti ti-history"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.savedTabsButton`, () => {
        var r, i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (a) => this.showSavedTabSetsMenu(a),
          title: `保存的标签页集合 (${((r = this.savedTabSets) == null ? void 0 : r.length) || 0})`,
          style: {
            color: (((i = this.savedTabSets) == null ? void 0 : i.length) || 0) > 0 ? "#3b82f6" : "#999",
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
    for (let r = 0; r < e.length; r++) {
      const i = e[r];
      try {
        const a = await orca.invokeBackend("get-block", parseInt(i.blockId));
        if (a) {
          const n = await this.detectBlockType(a), o = this.findProperty(a, "_color"), c = this.findProperty(a, "_icon");
          let l = i.color, d = i.icon;
          o && o.type === 1 && (l = o.value), c && c.type === 1 && c.value && c.value.trim() ? d = c.value : d || (d = this.getBlockTypeIcon(n)), i.blockType !== n || i.icon !== d || i.color !== l ? (e[r] = {
            ...i,
            blockType: n,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${i.title} -> 类型: ${n}, 图标: ${d}, 颜色: ${l}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${i.title} (无需更新)`);
        }
      } catch (a) {
        this.warn(`更新标签失败: ${i.title}`, a);
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
      const r = window.getComputedStyle(e).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${r}"`), r && r !== "") {
        const a = parseInt(r.replace("px", ""));
        if (isNaN(a))
          this.log(`⚠️ CSS变量值无法解析为数字: "${r}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${a}px`), a;
      } else
        this.log("⚠️ CSS变量 --orca-sidebar-width 不存在或为空");
      this.log("   尝试获取实际宽度...");
      const i = e.getBoundingClientRect();
      return this.log(`   实际尺寸: width=${i.width}px, height=${i.height}px`), i.width > 0 ? (this.log(`✅ 从实际尺寸获取侧边栏宽度: ${i.width}px`), i.width) : (this.log("⚠️ 无法获取侧边栏宽度，所有方法都失败"), 0);
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
    const t = e.clientX, r = this.verticalWidth, i = async (n) => {
      const o = n.clientX - t, c = Math.max(120, Math.min(400, r + o));
      this.verticalWidth = c;
      try {
        orca.nav.changeSizes(orca.state.activePanel, [c]), this.tabContainer.style.width = `${c}px`;
      } catch (l) {
        this.error("调整面板宽度失败:", l);
      }
    }, a = async () => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", a);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (n) {
        this.error("保存宽度设置失败:", n);
      }
    };
    document.addEventListener("mousemove", i), document.addEventListener("mouseup", a);
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
    const t = this.verticalWidth, r = yr(
      this.verticalWidth,
      async (i) => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [i]), this.tabContainer && (this.tabContainer.style.width = `${i}px`), this.verticalWidth = i, await this.saveLayoutMode();
        } catch (a) {
          this.error("实时调整面板宽度失败:", a);
        }
      },
      async () => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [t]), this.tabContainer && (this.tabContainer.style.width = `${t}px`), this.verticalWidth = t;
        } catch (i) {
          this.error("恢复面板宽度失败:", i);
        }
      }
    );
    document.body.appendChild(r);
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
    const i = this.isVerticalMode && !this.isFixedToTop, a = Ut(e, i);
    t.style.cssText = a;
    const n = Ht();
    if (e.icon && this.showBlockTypeIcons) {
      const c = Vt(e.icon);
      n.appendChild(c);
    }
    const o = jt(e.title);
    if (n.appendChild(o), e.isPinned) {
      const c = Yt();
      n.appendChild(c);
    }
    return t.appendChild(n), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), t.title = Qt(e), t.addEventListener("click", (c) => {
      var d;
      c.preventDefault(), this.log(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`), this.closedTabs.has(e.blockId) && (this.closedTabs.delete(e.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${e.title}"，从已关闭列表中移除`));
      const l = (d = this.tabContainer) == null ? void 0 : d.querySelectorAll(".orca-tabs-plugin .orca-tab");
      l == null || l.forEach((u) => u.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (c) => {
    }), t.addEventListener("dblclick", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.closeTab(e));
    }), t.addEventListener("keydown", (c) => {
      (c.target === t || t.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(e)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (c) => {
      var d;
      if (c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", (d = c.dataTransfer) == null || d.setData("text/plain", e.blockId), this.draggingTab = e, this.lastSwapTarget = null, this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (console.log("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), console.log("🔄 拖拽开始，设置draggingTab:", e.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), t.setAttribute("data-dragging", "true"), t.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", (c) => {
      console.log("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (console.log("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (c) => {
      if (!c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (c.preventDefault(), c.stopPropagation(), c.dataTransfer.dropEffect = "move", !this.dragOverTab || this.dragOverTab.blockId !== e.blockId) {
          const d = t.getBoundingClientRect(), u = d.top + d.height / 2, h = c.clientY < u ? "before" : "after";
          this.updateDropIndicator(t, h), this.dragOverTab = e;
        }
        this.debouncedSwapTab(e, this.draggingTab), this.verboseLog(`🔄 拖拽经过: ${e.title} (目标: ${this.draggingTab.title})`);
      }
    }), t.addEventListener("dragenter", (c) => {
      c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== e.blockId && (c.preventDefault(), c.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`));
    }), t.addEventListener("dragleave", (c) => {
      const l = t.getBoundingClientRect(), d = c.clientX, u = c.clientY, h = 5;
      (d < l.left - h || d > l.right + h || u < l.top - h || u > l.bottom + h) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (c) => {
      var d;
      c.preventDefault();
      const l = (d = c.dataTransfer) == null ? void 0 : d.getData("text/plain");
      this.log(`🔄 拖拽放置: ${l} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return _t(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const r = parseInt(t[1], 16), i = parseInt(t[2], 16), a = parseInt(t[3], 16);
      return (0.299 * r + 0.587 * i + 0.114 * a) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (r) {
      let i = parseInt(r[1], 16), a = parseInt(r[2], 16), n = parseInt(r[3], 16);
      i = Math.floor(i * (1 - t)), a = Math.floor(a * (1 - t)), n = Math.floor(n * (1 - t));
      const o = i.toString(16).padStart(2, "0"), c = a.toString(16).padStart(2, "0"), l = n.toString(16).padStart(2, "0");
      return `#${o}${c}${l}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, r) {
    const i = e / 255, a = t / 255, n = r / 255, o = (X) => X <= 0.04045 ? X / 12.92 : Math.pow((X + 0.055) / 1.055, 2.4), c = o(i), l = o(a), d = o(n), u = c * 0.4124564 + l * 0.3575761 + d * 0.1804375, h = c * 0.2126729 + l * 0.7151522 + d * 0.072175, p = c * 0.0193339 + l * 0.119192 + d * 0.9503041, f = 0.2104542553 * u + 0.793617785 * h - 0.0040720468 * p, b = 1.9779984951 * u - 2.428592205 * h + 0.4505937099 * p, m = 0.0259040371 * u + 0.7827717662 * h - 0.808675766 * p, y = Math.cbrt(f), v = Math.cbrt(b), T = Math.cbrt(m), x = 0.2104542553 * y + 0.793617785 * v + 0.0040720468 * T, P = 1.9779984951 * y - 2.428592205 * v + 0.4505937099 * T, $ = 0.0259040371 * y + 0.7827717662 * v - 0.808675766 * T, C = Math.sqrt(P * P + $ * $), N = Math.atan2($, P) * 180 / Math.PI, R = N < 0 ? N + 360 : N;
    return { l: x, c: C, h: R };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, r) {
    const i = r * Math.PI / 180, a = t * Math.cos(i), n = t * Math.sin(i), o = e, c = a, l = n, d = o * o * o, u = c * c * c, h = l * l * l, p = 1.0478112 * d + 0.0228866 * u - 0.050217 * h, f = 0.0295424 * d + 0.9904844 * u + 0.0170491 * h, b = -92345e-7 * d + 0.0150436 * u + 0.7521316 * h, m = 3.2404542 * p - 1.5371385 * f - 0.4985314 * b, y = -0.969266 * p + 1.8760108 * f + 0.041556 * b, v = 0.0556434 * p - 0.2040259 * f + 1.0572252 * b, T = (C) => C <= 31308e-7 ? 12.92 * C : 1.055 * Math.pow(C, 1 / 2.4) - 0.055, x = Math.max(0, Math.min(255, Math.round(T(m) * 255))), P = Math.max(0, Math.min(255, Math.round(T(y) * 255))), $ = Math.max(0, Math.min(255, Math.round(T(v) * 255)));
    return { r: x, g: P, b: $ };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return pr(e, t);
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
   * 保存当前面板的标签页数据到存储
   */
  async saveCurrentPanelTabs() {
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length)
      return;
    const e = this.panelTabsData[this.currentPanelIndex] || [], t = this.currentPanelIndex === 0 ? w.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
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
      this.recordPerformanceCountMetric(this.performanceMetricKeys.tabInteraction), this.log(`🔄 开始切换标签: ${e.title} (ID: ${e.blockId})`);
      const t = this.getCurrentActiveTab();
      t && t.blockId !== e.blockId && (this.recordScrollPosition(t), this.lastActiveBlockId = t.blockId, this.log(`🎯 记录切换前的激活标签: ${t.title} (ID: ${t.blockId})`));
      const r = this.getPanelIds();
      let i = "";
      if (e.panelId && r.includes(e.panelId) ? i = e.panelId : this.currentPanelId && r.includes(this.currentPanelId) ? i = this.currentPanelId : r.length > 0 && (i = r[0]), !i) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const a = r.indexOf(i);
      a !== -1 ? (this.currentPanelIndex = a, this.currentPanelId = i) : this.warn(`⚠️ 目标面板 ${i} 不在面板列表中`), this.log(`🎯 目标面板ID: ${i}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(i);
      } catch (n) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", n);
      }
      try {
        this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${e.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, i), this.log("✅ orca.nav.goTo 导航成功");
      } catch (n) {
        this.warn("导航失败，尝试备用方法:", n);
        const o = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (o)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), o.click();
        else {
          this.error("无法找到目标块元素:", e.blockId);
          const c = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          c ? (this.log("🔄 找到备用块元素，尝试点击"), c.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = e.blockId, this.log(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
        this.debugScrollPosition(e);
      }, 500), await this.focusTabElementById(e.blockId), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页切换，实时更新工作区: ${e.title}`));
    } catch (t) {
      this.error("切换标签失败:", t);
    }
  }
  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(e) {
    const t = document.querySelector(".orca-panel.active");
    if (!t) return !1;
    const r = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    return r ? r.getAttribute("data-block-id") === e.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), r = t.findIndex((a) => a.blockId === e.blockId);
    if (r === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let i = -1;
    if (r === 0 ? i = 1 : r === t.length - 1 ? i = r - 1 : i = r + 1, i >= 0 && i < t.length) {
      const a = t[i];
      this.log(`🔄 自动切换到相邻标签: "${a.title}" (位置: ${i})`), this.currentPanelId && await orca.nav.goTo("block", { blockId: parseInt(a.blockId) }, this.currentPanelId || "");
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), r = Zt(e, t, {
      updateOrder: !0,
      saveData: !0,
      updateUI: !0
    });
    r.success ? (this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页固定状态变化，实时更新工作区: ${e.title}`)), this.log(r.message)) : this.warn(r.message);
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
        }
      };
      await orca.plugins.setSettingsSchema(this.pluginName, t);
      const r = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      r != null && r.homePageBlockId && (this.homePageBlockId = r.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (r == null ? void 0 : r.showInHeadbar) !== void 0 && (this.showInHeadbar = r.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (r == null ? void 0 : r.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = r.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (r == null ? void 0 : r.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = r.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (r == null ? void 0 : r.enableWorkspaces) !== void 0 && (this.enableWorkspaces = r.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), this.log("✅ 插件设置已注册");
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
      enableWorkspaces: this.enableWorkspaces
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
        const r = this.showInHeadbar;
        this.showInHeadbar = t.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${r ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (t.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = t.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), t.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const r = this.enableWorkspaces;
        this.enableWorkspaces = t.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${r ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.enableWorkspaces || this.removeWorkspaceButton(), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
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
        render: (e, t, r) => {
          const i = window.React;
          return !i || !orca.components.MenuText ? null : i.createElement(orca.components.MenuText, {
            title: "在新标签页打开",
            preIcon: "ti ti-external-link",
            onClick: () => {
              r(), this.openInNewTab(e.toString());
            }
          });
        }
      }), orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.addToTabGroup", {
        worksOnMultipleBlocks: !1,
        render: (e, t, r) => {
          const i = window.React;
          return !i || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : i.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              r(), this.getTabInfo(e.toString(), this.currentPanelId || "" || "", 0).then((a) => {
                a ? this.showAddToTabGroupDialog(a) : orca.notify("error", "无法获取块信息");
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
      const r = this.getCurrentPanelTabs(), i = {
        blockId: e,
        panelId: this.currentPanelId || "",
        title: t,
        isPinned: !1,
        order: r.length
      };
      this.log(`📋 新标签页信息: "${i.title}" (ID: ${e})`);
      const a = this.getCurrentActiveTab();
      let n = r.length;
      if (a) {
        const o = r.findIndex((c) => c.blockId === a.blockId);
        o !== -1 && (n = o + 1, this.log(`🎯 将在聚焦标签 "${a.title}" 后面插入新标签: "${i.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (r.length >= this.maxTabs) {
        r.splice(n, 0, i), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${i.title}`);
        const o = this.findLastNonPinnedTabIndex();
        if (o !== -1) {
          const c = r[o];
          r.splice(o, 1), this.log(`🗑️ 删除末尾的非固定标签: "${c.title}" 来保持数量限制`);
        } else {
          const c = r.findIndex((l) => l.blockId === i.blockId);
          if (c !== -1) {
            r.splice(c, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${i.title}"`);
            return;
          }
        }
      } else
        r.splice(n, 0, i), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${i.title}`);
      this.syncCurrentTabsToStorage(r), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId || ""), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${i.title}"`);
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
    } catch (r) {
      this.warn("设置块内容失败，尝试备用方法:", r);
      try {
        await orca.invokeBackend("get-block", parseInt(e)) && this.log(`📝 跳过自动内容设置，用户可手动编辑块 ${e}`);
      } catch (i) {
        this.warn("备用方法也失败:", i);
      }
    }
  }
  /**
   * 强制让指定的标签元素呈聚焦状态，确保UI与数据同步
   */
  async focusTabElementById(e) {
    this.tabContainer || await this.updateTabsUI();
    const t = () => {
      var a, n;
      const r = (a = this.tabContainer) == null ? void 0 : a.querySelectorAll(".orca-tabs-plugin .orca-tab");
      r == null || r.forEach((o) => o.removeAttribute("data-focused"));
      const i = (n = this.tabContainer) == null ? void 0 : n.querySelector(`[data-tab-id="${e}"]`);
      return i ? (i.setAttribute("data-focused", "true"), !0) : !1;
    };
    t() || (await this.updateTabsUI(), t());
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(e, t, r = !1) {
    try {
      const i = this.getCurrentPanelTabs(), a = i.find((d) => d.blockId === e);
      if (a)
        return this.log(`📋 块 ${e} 已存在于标签页中，聚焦已有标签`), this.closedTabs.has(e) && (this.closedTabs.delete(e), await this.saveClosedTabs()), await this.switchToTab(a), await this.focusTabElementById(a.blockId), !0;
      if (!orca.state.blocks[parseInt(e)])
        return this.warn(`无法找到块 ${e}`), !1;
      const o = await this.getTabInfo(e, this.currentPanelId || "", i.length);
      if (!o)
        return this.warn(`无法获取块 ${e} 的标签信息`), !1;
      let c = i.length, l = !1;
      if (t === "replace") {
        const d = this.getCurrentActiveTab();
        if (!d)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const u = i.findIndex((h) => h.blockId === d.blockId);
        if (u === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        d.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), c = u + 1, l = !1) : (c = u, l = !0);
      } else if (t === "after") {
        const d = this.getCurrentActiveTab();
        if (d) {
          const u = i.findIndex((h) => h.blockId === d.blockId);
          u !== -1 && (c = u + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (i.length >= this.maxTabs)
        if (l)
          i[c] = o;
        else {
          i.splice(c, 0, o);
          const d = this.findLastNonPinnedTabIndex();
          if (d !== -1)
            i.splice(d, 1);
          else {
            const u = i.findIndex((h) => h.blockId === o.blockId);
            if (u !== -1)
              return i.splice(u, 1), !1;
          }
        }
      else
        l ? i[c] = o : i.splice(c, 0, o);
      return this.syncCurrentTabsToStorage(i), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${o.title}`)), await this.updateTabsUI(), r && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId || ""), !0;
    } catch (i) {
      return this.error("添加标签页时出错:", i), !1;
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
    var t, r;
    try {
      let i = e;
      for (; i && i !== document.body; ) {
        const a = i.classList;
        if (a.contains("orca-ref") || a.contains("block-ref") || a.contains("block-reference") || a.contains("orca-fragment-r") || a.contains("fragment-r") || a.contains("orca-block-reference") || i.tagName.toLowerCase() === "a" && ((t = i.getAttribute("href")) != null && t.startsWith("#"))) {
          const o = i.getAttribute("data-ref-id") || i.getAttribute("data-target-block-id") || i.getAttribute("data-fragment-v") || i.getAttribute("data-v") || ((r = i.getAttribute("href")) == null ? void 0 : r.replace("#", "")) || i.getAttribute("data-id");
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从块引用元素中提取到ID: ${o}`), o;
        }
        const n = i.dataset;
        for (const [o, c] of Object.entries(n))
          if ((o.toLowerCase().includes("ref") || o.toLowerCase().includes("fragment")) && c && !isNaN(parseInt(c)))
            return this.log(`🔗 从data属性 ${o} 中提取到块引用ID: ${c}`), c;
        i = i.parentElement;
      }
      if (e.textContent) {
        const a = e.textContent.trim(), n = a.match(/\[\[(?:块)?(\d+)\]\]/) || a.match(/block[:\s]*(\d+)/i);
        if (n && n[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${n[1]}`), n[1];
      }
      return null;
    } catch (i) {
      return this.error("获取块引用ID时出错:", i), null;
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
      const r = t.anchor.blockId.toString();
      return this.log(`🔍 获取到当前光标块ID: ${r}`), r;
    } catch (e) {
      return this.error("获取当前光标块ID时出错:", e), null;
    }
  }
  /**
   * 增强块引用的右键菜单，添加标签页相关选项
   */
  enhanceBlockRefContextMenu(e) {
    var t, r, i, a;
    try {
      const n = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let o = null;
      for (let l = n.length - 1; l >= 0; l--) {
        const d = n[l];
        if (d.offsetParent !== null && getComputedStyle(d).display !== "none") {
          o = d;
          break;
        }
      }
      if (!o) {
        this.log("🔗 未找到显示的右键菜单");
        return;
      }
      if (o.querySelector(".orca-tabs-plugin .orca-tabs-ref-menu-item")) {
        this.log("🔗 块引用菜单项已存在");
        return;
      }
      if (this.log(`🔗 为块引用 ${e} 添加菜单项`), o.querySelectorAll('[role="menuitem"], .menu-item').length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-separator";
        const d = document.documentElement.classList.contains("dark") || ((r = (t = window.orca) == null ? void 0 : t.state) == null ? void 0 : r.themeMode) === "dark";
        l.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, o.appendChild(l);
      }
      if (this.savedTabSets.length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-item", l.setAttribute("role", "menuitem");
        const d = document.documentElement.classList.contains("dark") || ((a = (i = window.orca) == null ? void 0 : i.state) == null ? void 0 : a.themeMode) === "dark";
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
          const u = this.getCurrentActiveTab();
          u && this.showAddToTabGroupDialog(u), o == null || o.remove();
        }), o.appendChild(l);
      }
      this.log(`✅ 成功为块引用 ${e} 添加菜单项`);
    } catch (n) {
      this.error("增强块引用右键菜单时出错:", n);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(e, t, r, i) {
    return qt(e, t, r, i);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.getPanelIds()[this.currentPanelIndex], r = orca.nav.findViewPanel(t, orca.state.panels);
      if (r && r.viewState) {
        let i = null;
        const a = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (a) {
          const n = a.closest(".orca-panel");
          n && (i = n.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!i) {
          const n = document.querySelector(".orca-panel.active");
          n && (i = n.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (i || (i = document.body.scrollTop > 0 ? document.body : document.documentElement), i) {
          const n = {
            x: i.scrollLeft || 0,
            y: i.scrollTop || 0
          };
          r.viewState.scrollPosition = n;
          const o = this.getCurrentPanelTabs().findIndex((c) => c.blockId === e.blockId);
          o !== -1 && (this.getCurrentPanelTabs()[o].scrollPosition = n, await this.saveCurrentPanelTabs()), this.log(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, n, "容器:", i.className);
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
      const r = this.getPanelIds()[this.currentPanelIndex], i = orca.nav.findViewPanel(r, orca.state.panels);
      if (i && i.viewState && i.viewState.scrollPosition && (t = i.viewState.scrollPosition, this.log(`🔄 从viewState恢复标签 "${e.title}" 滚动位置:`, t)), !t && e.scrollPosition && (t = e.scrollPosition, this.log(`🔄 从标签信息恢复标签 "${e.title}" 滚动位置:`, t)), !t) return;
      const a = (n = 1) => {
        if (n > 5) {
          this.warn(`恢复标签 "${e.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let o = null;
        const c = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (c) {
          const l = c.closest(".orca-panel");
          l && (o = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!o) {
          const l = document.querySelector(".orca-panel.active");
          l && (o = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        o || (o = document.body.scrollTop > 0 ? document.body : document.documentElement), o ? (o.scrollLeft = t.x, o.scrollTop = t.y, this.log(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", o.className, `尝试${n}`)) : setTimeout(() => a(n + 1), 200 * n);
      };
      a(), setTimeout(() => a(2), 100), setTimeout(() => a(3), 300);
    } catch (t) {
      this.warn("恢复滚动位置时出错:", t);
    }
  }
  /**
   * 调试滚动位置信息
   */
  debugScrollPosition(e) {
    this.log(`🔍 调试标签 "${e.title}" 滚动位置:`), this.log("标签保存的滚动位置:", e.scrollPosition);
    const t = this.getPanelIds()[this.currentPanelIndex], r = orca.nav.findViewPanel(t, orca.state.panels);
    r && r.viewState ? (this.log("viewState中的滚动位置:", r.viewState.scrollPosition), this.log("完整viewState:", r.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((a) => {
      document.querySelectorAll(a).forEach((o, c) => {
        const l = o;
        (l.scrollTop > 0 || l.scrollLeft > 0) && this.log(`容器 ${a}[${c}]:`, {
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
      const t = document.querySelector(".orca-panel.active");
      if (!t) return !1;
      const r = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!r) return !1;
      const a = r.getAttribute("data-block-id") === e.blockId;
      return a && this.closedTabs.has(e.blockId) ? (this.verboseLog(`🔍 标签 ${e.title} 在已关闭列表中，不认为是激活状态`), !1) : a;
    } catch (t) {
      return this.warn("检查标签激活状态时出错:", t), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    const e = this.enableWorkspaces ? this.getCurrentPanelTabs() : this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    const t = document.querySelector(".orca-panel.active");
    if (!t) return null;
    const r = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!r) return null;
    const i = r.getAttribute("data-block-id");
    if (!i) return null;
    const a = e.find((n) => n.blockId === i) || null;
    return this.enableWorkspaces && this.currentWorkspace && a && this.updateCurrentWorkspaceActiveIndex(a), a;
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
    const r = e.findIndex((i) => i.blockId === t.blockId);
    return r === -1 ? -1 : r;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    if (this.lastActiveBlockId) {
      const r = e.find((i) => i.blockId === this.lastActiveBlockId);
      if (r)
        return this.log(`🎯 找到上一个激活的标签: ${r.title}`), r;
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
    const r = t.findIndex((i) => i.blockId === e.blockId);
    return r === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${e.title}" (索引${r}) 后面插入新标签`), r);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), r = t.findIndex((i) => i.blockId === e.blockId);
    return r === -1 || t.length <= 1 ? null : r < t.length - 1 ? t[r + 1] : r > 0 ? t[r - 1] : r === 0 && t.length > 1 ? t[1] : null;
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
    const r = t.findIndex((i) => i.blockId === e.blockId);
    if (r !== -1) {
      const i = this.getCurrentActiveTab(), a = i && i.blockId === e.blockId, n = a ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const o = { ...e, closedAt: Date.now() }, c = this.recentlyClosedTabs.findIndex((l) => l.blockId === e.blockId);
        c !== -1 && this.recentlyClosedTabs.splice(c, 1), this.recentlyClosedTabs.unshift(o), this.recentlyClosedTabs.length > 20 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 20)), await this.saveRecentlyClosedTabs();
      }
      t.splice(r, 1), this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`)), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), a && n ? (this.log(`🔄 自动切换到相邻标签: "${n.title}"`), await this.switchToTab(n)) : a && !n && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const e = this.getCurrentPanelTabs();
    e.filter((a) => !a.isPinned).forEach((a) => {
      this.closedTabs.add(a.blockId);
    });
    const r = e.filter((a) => a.isPinned), i = e.length - r.length;
    this.setCurrentPanelTabs(r), this.syncCurrentTabsToStorage(r), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${i} 个标签，保留了 ${r.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(e) {
    const t = this.getCurrentPanelTabs(), r = t.filter(
      (n) => n.blockId === e.blockId || n.isPinned
    );
    t.filter(
      (n) => n.blockId !== e.blockId && !n.isPinned
    ).forEach((n) => {
      this.closedTabs.add(n.blockId);
    });
    const a = t.length - r.length;
    this.setCurrentPanelTabs(r), this.syncCurrentTabsToStorage(r), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${a} 个标签，保留了当前标签和固定标签`);
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
    const r = t.querySelector(".inline-rename-input");
    r && r.remove();
    const i = t.textContent, a = t.style.cssText, n = t.draggable;
    t.draggable = !1;
    const o = document.createElement("input");
    o.type = "text", o.value = e.title, o.className = "inline-rename-input";
    let c = "var(--orca-color-text-1)";
    e.color && (c = this.applyOklchFormula(e.color, "text")), o.style.cssText = `
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
    `, t.textContent = "", t.appendChild(o), t.style.padding = "2px 8px", o.focus(), o.select();
    const l = async () => {
      const u = o.value.trim();
      if (u && u !== e.title) {
        await this.updateTabTitle(e, u), t.draggable = n;
        return;
      }
      t.textContent = i, t.style.cssText = a, t.draggable = n;
    }, d = () => {
      t.textContent = i, t.style.cssText = a, t.draggable = n;
    };
    o.addEventListener("blur", l), o.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), l()) : u.key === "Escape" && (u.preventDefault(), d());
    }), o.addEventListener("click", (u) => {
      u.stopPropagation();
    });
  }
  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(e) {
    const t = window.React, r = window.ReactDOM;
    if (!t || !r || !orca.components.InputBox) {
      this.warn("Orca组件不可用，回退到原生实现"), this.showRenameInput(e);
      return;
    }
    const i = document.createElement("div");
    i.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      pointer-events: none;
    `, document.body.appendChild(i);
    const a = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let n = { x: "50%", y: "50%" };
    if (a) {
      const u = a.getBoundingClientRect(), h = window.innerWidth, p = window.innerHeight, f = 300, b = 100, m = 20;
      let y = u.left, v = u.top - b - 10;
      y + f > h - m && (y = h - f - m), y < m && (y = m), v < m && (v = u.bottom + 10, v + b > p - m && (v = (p - b) / 2)), v + b > p - m && (v = p - b - m), y = Math.max(m, Math.min(y, h - f - m)), v = Math.max(m, Math.min(v, p - b - m)), n = { x: `${y}px`, y: `${v}px` };
    }
    const o = orca.components.InputBox, c = t.createElement(o, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (u, h, p) => {
        u && u.trim() && u.trim() !== e.title && this.updateTabTitle(e, u.trim()), p();
      },
      onCancel: (u) => {
        u();
      }
    }, (u) => t.createElement("div", {
      style: {
        position: "absolute",
        left: n.x,
        top: n.y,
        pointerEvents: "auto"
      },
      onClick: u
    }, ""));
    r.render(c, i), setTimeout(() => {
      const u = i.querySelector("div");
      u && u.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        r.unmountComponentAtNode(i), i.remove();
      }, 100);
    }, d = (u) => {
      u.key === "Escape" && (l(), document.removeEventListener("keydown", d));
    };
    document.addEventListener("keydown", d);
  }
  /**
   * 显示重命名输入框（原生实现，作为备选）
   */
  showRenameInput(e) {
    const t = document.querySelector(".tab-rename-input");
    t && t.remove();
    const r = document.createElement("div");
    r.className = "tab-rename-input", r.style.cssText = `
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
    const i = document.createElement("input");
    i.type = "text", i.value = e.title, i.style.cssText = `
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: var(--orca-color-text-1);
      width: 100%;
      padding: 4px 0;
    `;
    const a = document.createElement("div");
    a.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;
    const n = document.createElement("button");
    n.className = "orca-button orca-button-primary", n.textContent = "确认";
    const o = document.createElement("button");
    o.className = "orca-button", o.textContent = "取消", a.appendChild(n), a.appendChild(o), r.appendChild(i), r.appendChild(a);
    const c = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (c) {
      const h = c.getBoundingClientRect();
      r.style.left = `${h.left}px`, r.style.top = `${h.top - 60}px`;
    } else
      r.style.left = "50%", r.style.top = "50%", r.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(r), i.focus(), i.select();
    const l = () => {
      const h = i.value.trim();
      h && h !== e.title && this.updateTabTitle(e, h), r.remove();
    }, d = () => {
      r.remove();
    };
    n.addEventListener("click", l), o.addEventListener("click", d), i.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), d());
    });
    const u = (h) => {
      r.contains(h.target) || (d(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
    }, 100);
  }
  /**
   * 更新标签标题
   */
  async updateTabTitle(e, t) {
    try {
      const r = this.getCurrentPanelTabs(), i = tr(e, t, r, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      i.success ? (this.syncCurrentTabsToStorage(r), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${t}`)), this.log(i.message)) : this.warn(i.message);
    } catch (r) {
      this.error("重命名标签失败:", r);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(e, t) {
    const r = window.React, i = window.ReactDOM;
    if (!r || !i || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      setTimeout(() => {
        const a = window.React, n = window.ReactDOM;
        !a || !n || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? e.addEventListener("contextmenu", (o) => {
          o.preventDefault(), o.stopPropagation(), o.stopImmediatePropagation(), this.showTabContextMenu(o, t);
        }) : this.createOrcaContextMenu(e, t);
      }, 100);
      return;
    }
    this.createOrcaContextMenu(e, t);
  }
  createOrcaContextMenu(e, t) {
    const r = window.React, i = window.ReactDOM, a = document.createElement("div");
    a.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(a);
    const n = orca.components.ContextMenu, o = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, d = r.createElement(n, {
      menu: (p) => r.createElement(o, {}, [
        r.createElement(c, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            p(), this.renameTab(t);
          }
        }),
        r.createElement(c, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            p(), this.toggleTabPinStatus(t);
          }
        }),
        r.createElement(l, { key: "separator1" }),
        r.createElement(c, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeTab(t);
          }
        }),
        r.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeOtherTabs(t);
          }
        }),
        r.createElement(c, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeAllTabs();
          }
        })
      ])
    }, (p, f) => r.createElement("div", {
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
    i.render(d, a);
    const u = () => {
      i.unmountComponentAtNode(a), a.remove();
    }, h = new MutationObserver((p) => {
      p.forEach((f) => {
        f.removedNodes.forEach((b) => {
          b === e && (u(), h.disconnect());
        });
      });
    });
    h.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    var h, p;
    const r = document.querySelector(".tab-context-menu");
    r && r.remove();
    const i = document.documentElement.classList.contains("dark") || ((p = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : p.themeMode) === "dark", a = document.createElement("div");
    a.className = "tab-context-menu";
    const n = 220, o = 240, { x: c, y: l } = _(e.clientX, e.clientY, n, o);
    a.style.cssText = `
      position: fixed;
      left: ${c}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: 180px;
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
    ), d.forEach((f) => {
      const b = document.createElement("div");
      b.textContent = f.text, b.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${f.disabled ? i ? "#666" : "#999" : i ? "#ffffff" : "#333"};
        border-bottom: 1px solid var(--orca-color-border);
        transition: background-color 0.2s;
      `, f.disabled || (b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.addEventListener("click", () => {
        f.action(), a.remove();
      })), a.appendChild(b);
    }), document.body.appendChild(a);
    const u = (f) => {
      a.contains(f.target) || (a.remove(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
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
    for (let r = 0; r < e.length; r++) {
      const i = e[r];
      if (!i.blockType || !i.icon)
        try {
          const n = await orca.invokeBackend("get-block", parseInt(i.blockId));
          if (n) {
            const o = await this.detectBlockType(n);
            let c = i.icon;
            c || (c = this.getBlockTypeIcon(o)), e[r] = {
              ...i,
              blockType: o,
              icon: c
            }, this.log(`✅ 更新恢复的标签: ${i.title} -> 类型: ${o}, 图标: ${c}`), t = !0;
          }
        } catch (n) {
          this.warn(`更新恢复的标签失败: ${i.title}`, n);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${i.title} (已有块类型和图标)`);
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
    for (let r = 0; r < e.length; r++) {
      const i = e.charCodeAt(r);
      t = (t << 5) - t + i, t = t & t;
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
      const a = this.tabContainer.querySelector(".drag-handle");
      a && a.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const r = (a) => {
      this.isDragging && (a.preventDefault(), a.stopPropagation(), this.drag(a));
    }, i = (a) => {
      document.removeEventListener("mousemove", r), document.removeEventListener("mouseup", i), this.stopDrag();
    };
    document.addEventListener("mousemove", r), document.addEventListener("mouseup", i), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), r = 5, i = window.innerWidth - t.width - 5, a = 5, n = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(r, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(a, Math.min(n, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(r, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(a, Math.min(n, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const o = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = o.x + "px", this.tabContainer.style.top = o.y + "px", this.ensureClickableElements();
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
    document.body.style.pointerEvents = "auto", document.documentElement.style.pointerEvents = "auto", document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu").forEach((r) => {
      const i = r;
      i.style.pointerEvents === "none" && (i.style.pointerEvents = "auto");
    }), document.querySelectorAll('button, .btn, [role="button"]').forEach((r) => {
      const i = r;
      i.style.pointerEvents === "none" && (i.style.pointerEvents = "auto");
    });
  }
  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    document.querySelectorAll("*").forEach((r) => {
      const i = r;
      (i.style.cursor === "grabbing" || i.style.cursor === "grab") && (i.style.cursor = ""), i.style.userSelect === "none" && (i.style.userSelect = ""), i.style.pointerEvents === "none" && (i.style.pointerEvents = ""), i.style.touchAction === "none" && (i.style.touchAction = "");
    }), document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]").forEach((r) => {
      const i = r;
      i.style.cursor = "", i.style.userSelect = "", i.style.pointerEvents = "auto", i.style.touchAction = "";
    }), this.log("🔄 重置所有元素样式");
  }
  async restorePosition() {
    try {
      this.position = j(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = ke(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${pe(this.position, this.isVerticalMode)}`);
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
        w.LAYOUT_MODE,
        this.pluginName,
        B()
      );
      if (e) {
        const t = Ce(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = j(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.log(`📐 布局模式已恢复: ${Ie(t)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const t = B();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = j(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
      const t = B();
      this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = j(
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
        w.FIXED_TO_TOP,
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
    this.position = or(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var a, n;
    const r = (a = this.tabContainer) == null ? void 0 : a.querySelectorAll(".orca-tabs-plugin .orca-tab");
    r == null || r.forEach((o) => o.removeAttribute("data-focused"));
    const i = (n = this.tabContainer) == null ? void 0 : n.querySelector(`[data-tab-id="${e}"]`);
    i ? (i.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${t}"`)) : this.verboseLog(`⚠️ 未找到标签元素: ${e}`);
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
    } catch (r) {
      return this.error(`创建标签页信息失败: ${e}`, r), null;
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
      const r = t.getAttribute("data-block-id");
      if (r) {
        const i = e.closest(".orca-panel");
        if (i) {
          const a = i.getAttribute("data-panel-id");
          a && this.handleNewBlockInPanel(r, a).catch((n) => {
            this.error(`处理新块失败: ${r}`, n);
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
    const r = t.querySelector(".orca-block-editor[data-block-id]");
    if (r) {
      const i = r.getAttribute("data-block-id");
      if (i) {
        const a = e.closest(".orca-panel");
        if (a) {
          const n = a.getAttribute("data-panel-id");
          n && this.handleNewBlockInPanel(i, n).catch((o) => {
            this.error(`处理新块失败: ${i}`, o);
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
    var p, f;
    if (!e || !t) return;
    const r = document.querySelector(".orca-panel.active"), i = r == null ? void 0 : r.getAttribute("data-panel-id");
    if (i && t !== i) {
      this.log(`🚫 忽略非激活面板 ${t} 中的新块 ${e}，当前激活面板为 ${i}`);
      return;
    }
    const n = this.getPanelIds().indexOf(t);
    if (n === -1) {
      const b = document.querySelectorAll(".orca-panel");
      if (!(b.length > 0 && b[0].getAttribute("data-panel-id") === t)) {
        this.log(`🚫 不管理辅助面板 ${t} 的标签页`);
        return;
      }
    }
    n !== -1 && (this.currentPanelIndex = n, this.currentPanelId = t);
    let o = this.getCurrentPanelTabs();
    const c = o.find((b) => b.blockId === e);
    if (c) {
      this.closedTabs.has(e) && (this.closedTabs.delete(e), this.saveClosedTabs()), this.updateFocusState(e, c.title), this.immediateUpdateTabsUI();
      return;
    }
    const l = await this.createTabInfoFromBlock(e, t);
    if (!l) return;
    const d = this.getCurrentActiveTab();
    if (d) {
      const b = o.findIndex((m) => m.blockId === d.blockId);
      if (b !== -1) {
        this.log(`🔄 替换当前激活标签页: "${d.title}" -> "${l.title}"`), o[b] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const b = o.findIndex((m) => m.blockId === this.lastActiveBlockId);
      if (b !== -1) {
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${o[b].title}" -> "${l.title}"`), o[b] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
        return;
      }
    }
    let u = -1;
    const h = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (h) {
      const b = h.getAttribute("data-tab-id");
      u = o.findIndex((m) => m.blockId === b);
    }
    if (u === -1) {
      const b = (f = this.tabContainer) == null ? void 0 : f.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (b && b.length > 0)
        for (let m = 0; m < b.length; m++) {
          const y = b[m];
          if (y.classList.contains("focused") || y.getAttribute("data-focused") === "true" || y.classList.contains("active")) {
            u = m;
            break;
          }
        }
    }
    u === -1 && o.length > 0 && (u = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), u >= 0 && u < o.length ? (o[u] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI()) : (o = [l], this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI());
  }
  async checkCurrentPanelBlocks() {
    var h;
    this.log("🔍 开始检查当前面板块...");
    const e = document.querySelector(".orca-panel.active");
    if (!e) {
      this.log("❌ 没有找到当前激活的面板");
      const p = document.querySelectorAll(".orca-panel");
      this.log("📊 当前所有面板状态:"), p.forEach((f, b) => {
        const m = f.getAttribute("data-panel-id"), y = f.classList.contains("active");
        this.log(`  面板${b + 1}: ID=${m}, active=${y}`);
      });
      return;
    }
    const t = e.getAttribute("data-panel-id");
    if (!t) {
      this.log("❌ 激活面板没有 data-panel-id");
      return;
    }
    this.log(`✅ 找到激活面板: ID=${t}, class=${e.className}`);
    const r = this.getPanelIds().indexOf(t);
    r !== -1 && (this.currentPanelIndex = r, this.currentPanelId = t, this.verboseLog(`🔄 更新当前面板索引: ${r} (面板ID: ${t})`)), e.querySelectorAll(".orca-hideable");
    const i = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!i) {
      this.log(`❌ 激活面板 ${t} 中没有找到可见的块编辑器`);
      return;
    }
    const a = i.getAttribute("data-block-id");
    if (!a) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    let n = this.getCurrentPanelTabs();
    n.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), n = this.getCurrentPanelTabs());
    const o = n.find((p) => p.blockId === a);
    if (o) {
      this.closedTabs.has(a) && (this.closedTabs.delete(a), await this.saveClosedTabs()), this.updateFocusState(a, o.title), await this.immediateUpdateTabsUI();
      return;
    }
    const c = (h = this.tabContainer) == null ? void 0 : h.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (!c)
      return;
    const l = c.getAttribute("data-tab-id");
    if (!l)
      return;
    const d = n.findIndex((p) => p.blockId === l);
    if (d === -1)
      return;
    const u = await this.getTabInfo(a, t, d);
    u && (n[d] = u, this.setCurrentPanelTabs(n), await this.immediateUpdateTabsUI());
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
      let a = !1, n = !1, o = !1, c = this.currentPanelIndex;
      const l = Date.now(), d = this.lastPanelCheckTime || 0, u = 1e3;
      i.forEach((h) => {
        if (h.type === "childList") {
          const p = h.target;
          if ((p.classList.contains("orca-panels-row") || p.closest(".orca-panels-row")) && (n = !0), h.addedNodes.length > 0 && p.closest(".orca-panel")) {
            for (const b of h.addedNodes)
              if (b.nodeType === Node.ELEMENT_NODE) {
                const m = b;
                if (this.handleNewHideableElement(m)) {
                  a = !0;
                  break;
                }
                if (m.classList.contains("orca-block-editor") || m.querySelector(".orca-block-editor")) {
                  a = !0;
                  break;
                }
                if (this.handleChildHideableElements(m)) {
                  a = !0;
                  break;
                }
              }
          }
        }
        if (h.type === "attributes" && h.attributeName === "class") {
          const p = h.target;
          if (p.classList.contains("orca-panel")) {
            if (o = !0, p.classList.contains("active")) {
              const f = p.getAttribute("data-panel-id"), b = p.querySelectorAll(".orca-hideable");
              let m = null;
              b.forEach((y) => {
                const v = y.classList.contains("orca-hideable-hidden"), T = y.querySelector(".orca-block-editor[data-block-id]"), x = T == null ? void 0 : T.getAttribute("data-block-id");
                !v && T && x && (m = x);
              }), m && f && this.handleNewBlockInPanel(m, f).catch((y) => {
                this.error(`处理面板激活时的新块失败: ${m}`, y);
              }), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 50), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 200);
            }
            p.classList.contains("orca-locked") && p.classList.contains("active") && (this.log("🔒 检测到锁定面板激活，聚焦上一个面板"), this.focusToPreviousPanel());
          }
          p.classList.contains("orca-hideable") && !p.classList.contains("orca-hideable-hidden") && (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦状态变化"), a = !0);
        }
      }), o && (await this.updateCurrentPanelIndex(), c !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${c} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), n && l - d > u ? (this.lastPanelCheckTime = l, this.log(`🔍 面板检查防抖：距离上次检查 ${l - d}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : n && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${l - d}ms`), a && await this.checkCurrentPanelBlocks();
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class"]
    });
    let t = null;
    const r = async (i) => {
      const n = i.target.closest(".orca-hideable");
      n && (t && clearTimeout(t), t = window.setTimeout(async () => {
        n.classList.contains("orca-hideable-hidden") || (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦变化"), await this.checkCurrentPanelBlocks()), t = null;
      }, 0));
    };
    document.addEventListener("click", r), document.addEventListener("focusin", r), document.addEventListener("keydown", (i) => {
      (i.key === "Tab" || i.key === "Enter" || i.key === " ") && (t && clearTimeout(t), t = window.setTimeout(r, 0));
    }), setInterval(async () => {
      var i;
      try {
        const a = document.querySelector(".orca-panel.active");
        if (a) {
          const n = a.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (n) {
            const o = n.getAttribute("data-block-id");
            if (o) {
              const c = (i = this.tabContainer) == null ? void 0 : i.querySelector('.orca-tab[data-focused="true"]');
              if (c) {
                const l = c.getAttribute("data-tab-id");
                l !== o && (this.verboseLog(`🔄 主动检测到块变化: ${l} -> ${o}`), await this.checkCurrentPanelBlocks());
              } else
                this.verboseLog(`🔄 主动检测到无聚焦标签页，当前块: ${o}`), await this.checkCurrentPanelBlocks();
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
    const e = this.getPanelIds().length, t = [...this.getPanelIds()];
    if (this.currentPanelId, await this.discoverPanels(), this.getPanelIds().length > e)
      this.log(`🎉 发现新面板！从 ${e} 个增加到 ${this.getPanelIds().length} 个`), await this.createTabsUI();
    else if (this.getPanelIds().length < e) {
      this.log(`📉 面板数量减少！从 ${e} 个减少到 ${this.getPanelIds().length} 个`), this.log(`📋 旧面板列表: [${t.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`);
      const r = t[0], i = this.getPanelIds()[0];
      r && i && r !== i && (this.log(`🔄 第一个面板已变更: ${r} -> ${i}`), await this.handleFirstPanelChange(r, i)), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 更新持久化面板索引为: 0")), await this.createTabsUI();
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
        const r = this.getPanelIds().indexOf(t);
        if (r !== -1) {
          const i = this.currentPanelIndex;
          this.currentPanelIndex = r, this.currentPanelId = t, this.log(`🔄 面板索引更新: ${i} -> ${r} (面板ID: ${t})`), (!this.panelTabsData[r] || this.panelTabsData[r].length === 0) && (this.log(`🔍 面板 ${t} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(r, t || "")), this.debouncedUpdateTabsUI();
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
    const r = t - 1, i = e[r];
    if (!i) {
      this.log("⚠️ 未找到上一个面板");
      return;
    }
    this.log(`🔄 聚焦到上一个面板: ${i} (索引: ${r})`);
    const a = document.querySelector(`.orca-panel[data-panel-id="${i}"]`);
    if (!a) {
      this.log(`❌ 未找到面板元素: ${i}`);
      return;
    }
    const n = document.querySelector(".orca-panel.active");
    n && n.classList.remove("active"), a.classList.add("active"), this.currentPanelIndex = r, this.currentPanelId = i, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${i}`);
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
    const t = e.target, r = this.getBlockRefId(t);
    if (r) {
      e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), e.ctrlKey || e.metaKey ? (this.log(`🔗 检测到 Ctrl+点击 块引用: ${r}，将在后台新建标签页`), await this.openInNewTab(r)) : (this.log(`🔗 检测到直接点击 块引用: ${r}，将替换当前标签页`), await this.createBlockAfterFocused(r));
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
    const t = e.target, r = this.getBlockRefId(t);
    r && (this.log(`🔗 检测到块引用右键菜单: ${r}`), this.currentContextBlockRefId = r, setTimeout(() => {
      this.enhanceBlockRefContextMenu(r);
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
    const e = document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])');
    if (Array.from(e).filter((c) => {
      const l = c.getAttribute("data-panel-id");
      return l && !l.startsWith("_");
    }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
      this.verboseLog("📋 面板数量未变化，跳过面板发现");
      return;
    }
    const r = [...this.getPanelIds()], i = this.getPanelIds()[0] || null;
    await this.discoverPanels();
    const a = this.getPanelIds()[0] || null, n = xr(r, this.getPanelIds());
    n && (this.log(`📋 面板列表发生变化: ${r.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${r.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${i} -> ${a}`), i !== a && (this.log(`🔄 持久化面板已变更: ${i} -> ${a}`), await this.handlePersistentPanelChange(i, a))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
    const o = document.querySelector(".orca-panel.active");
    if (o) {
      const c = o.getAttribute("data-panel-id");
      if (c && !c.startsWith("_") && (c !== this.currentPanelId || n)) {
        const l = this.currentPanelIndex, d = this.getPanelIds().indexOf(c);
        d !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId || ""} -> ${c} (索引: ${l} -> ${d})`), this.currentPanelIndex = d, this.currentPanelId = c, await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI());
      }
    }
  }
  /**
   * 处理持久化面板变更（当需要持久化的面板发生变化时）
   */
  async handlePersistentPanelChange(e, t) {
    if (this.log(`🔄 处理持久化面板变更: ${e} -> ${t}`), t)
      if (e !== t) {
        this.log("🔍 持久化面板发生变化，重新扫描标签");
        const r = this.panelTabsData[0] || [];
        r.length > 0 ? (this.log(`✅ 新持久化面板 ${t} (索引: 0) 已有标签数据，直接使用`), this.panelTabsData[0] = [...r]) : (this.log(`🔍 新持久化面板 ${t} (索引: 0) 没有标签数据，重新扫描`), await this.scanPersistentPanel(t)), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的标签"), await this.updateTabsUI(), this.log(`✅ 持久化面板变更处理完成，当前有 ${this.getCurrentPanelTabs().length} 个标签`);
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
    const r = t.querySelectorAll(".orca-hideable"), i = [];
    let a = 0;
    for (const n of r) {
      const o = n.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, e, a++);
      l && i.push(l);
    }
    this.panelTabsData[0] = [...i], this.panelTabsData[0] = [...i], this.log(`📋 持久化面板 ${e} (索引: 0) 扫描并保存了 ${i.length} 个标签页`);
  }
  /**
   * 扫描指定面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描DOM并存储到panelTabsData数组
   */
  async scanPanelTabsByIndex(e, t) {
    const r = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!r) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const i = r.querySelectorAll(".orca-block-editor[data-block-id]"), a = [];
    let n = 0;
    this.log(`🔍 扫描面板 ${t}，找到 ${i.length} 个块编辑器`);
    for (const c of i) {
      const l = c.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, t, n++);
      d && (a.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    e >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[e] = [...a], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${a.length} 个标签页`);
    const o = e === 0 ? w.FIRST_PANEL_TABS : `panel_${e + 1}_tabs`;
    await this.savePanelTabsByKey(o, a);
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
    const r = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!r) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const i = r.querySelectorAll(".orca-block-editor[data-block-id]"), a = [];
    let n = 0;
    this.log(`🔍 扫描当前聚焦面板 ${t}，找到 ${i.length} 个块编辑器`);
    for (const l of i) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const u = await this.getTabInfo(d, t, n++);
      u && (a.push(u), this.log(`📋 找到当前标签页: ${u.title} (${d})`));
    }
    const o = this.panelTabsData[e] || [];
    this.log(`📋 已加载的标签页: ${o.length} 个，当前标签页: ${a.length} 个`);
    const c = [...o];
    for (const l of a)
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
    const t = e.querySelectorAll(".orca-hideable"), r = [];
    let i = 0;
    for (const n of t) {
      const o = n.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId || "", i++);
      l && r.push(l);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...r], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${r.length} 个标签页`);
    const a = this.currentPanelIndex === 0 ? w.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(a, r);
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(e, t) {
    this.log(`🔄 处理第一个面板变更: ${e} -> ${t}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ""}, currentPanelIndex=${this.currentPanelIndex}`);
    const r = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${r.length} 个标签页`), r.length > 0 ? (this.log(`📋 迁移当前面板的 ${r.length} 个标签页到持久化存储`), this.panelTabsData[0] = [...r], this.log("🔄 持久化面板索引已简化，不再需要更新")) : (this.log("🗑️ 当前面板没有标签数据，清空并重新扫描"), this.panelTabsData[0] = [], await this.scanFirstPanel()), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`), this.log("✅ 持久化标签页:", this.getCurrentPanelTabs().map((i) => `${i.title}(${i.blockId})`));
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, r = this.recentlyClosedTabs.map((i, a) => ({
      label: `${i.title}`,
      icon: i.icon || this.getBlockTypeIcon(i.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(i, a)
    }));
    r.push({
      label: "清空最近关闭列表",
      icon: "ti ti-trash",
      onClick: () => this.clearRecentlyClosedTabs()
    }), this.createRecentlyClosedTabsMenu(r, t);
  }
  /**
   * 创建最近关闭标签页菜单
   */
  createRecentlyClosedTabsMenu(e, t) {
    var f, b;
    const r = document.querySelector(".recently-closed-tabs-menu");
    r && r.remove();
    const i = document.documentElement.classList.contains("dark") || ((b = (f = window.orca) == null ? void 0 : f.state) == null ? void 0 : b.themeMode) === "dark", a = document.createElement("div");
    a.className = "recently-closed-tabs-menu";
    const n = 280, o = 350, { x: c, y: l } = _(t.x, t.y, n, o);
    a.style.cssText = `
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
      max-height: ${o}px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((m, y) => {
      if (m.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, a.appendChild(x);
        return;
      }
      const v = document.createElement("div");
      if (v.className = "recently-closed-menu-item", v.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${i ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, m.icon) {
        const x = document.createElement("div");
        if (x.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, m.icon.startsWith("ti ti-")) {
          const P = document.createElement("i");
          P.className = m.icon, x.appendChild(P);
        } else
          x.textContent = m.icon;
        v.appendChild(x);
      }
      const T = document.createElement("span");
      T.textContent = m.label, T.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, v.appendChild(T), v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "transparent";
      }), v.addEventListener("click", () => {
        m.onClick(), a.remove();
      }), a.appendChild(v);
    }), document.body.appendChild(a);
    const d = a.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (a.style.left = `${u - d.width - 10}px`), d.bottom > h && (a.style.top = `${h - d.height - 10}px`);
    const p = (m) => {
      a.contains(m.target) || (a.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
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
    } catch (r) {
      this.error("恢复最近关闭标签页失败:", r), orca.notify("error", "恢复标签页失败");
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 100, y: 100 }, r = [];
    this.previousTabSet && this.previousTabSet.length > 0 && (r.push({
      label: `回到上一个标签集合 (${this.previousTabSet.length}个标签)`,
      icon: "ti ti-arrow-left",
      onClick: () => this.restorePreviousTabSet()
    }), r.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    })), this.savedTabSets.forEach((i, a) => {
      r.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: i.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, a)
      });
    }), r.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), r.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    }), this.createRecentlyClosedTabsMenu(r, t);
  }
  /**
   * 显示多标签页保存菜单
   */
  async showMultiTabSavingMenu(e) {
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, r = [];
    r.push({
      label: "保存当前标签页",
      icon: "ti ti-plus",
      onClick: () => this.saveCurrentTabs()
    }), this.savedTabSets.length > 0 && (r.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), this.savedTabSets.forEach((i, a) => {
      r.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, a)
      });
    }), r.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), r.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    })), this.createMultiTabSavingMenu(r, t);
  }
  /**
   * 创建多标签页保存菜单
   */
  createMultiTabSavingMenu(e, t) {
    var f, b;
    const r = document.querySelector(".multi-tab-saving-menu");
    r && r.remove();
    const i = document.documentElement.classList.contains("dark") || ((b = (f = window.orca) == null ? void 0 : f.state) == null ? void 0 : b.themeMode) === "dark", a = document.createElement("div");
    a.className = "multi-tab-saving-menu";
    const n = 300, o = 400, { x: c, y: l } = _(t.x, t.y, n, o);
    a.style.cssText = `
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
      max-height: ${o}px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((m, y) => {
      if (m.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, a.appendChild(x);
        return;
      }
      const v = document.createElement("div");
      if (v.className = "multi-tab-saving-menu-item", v.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${i ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, m.icon) {
        const x = document.createElement("div");
        if (x.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, m.icon.startsWith("ti ti-")) {
          const P = document.createElement("i");
          P.className = m.icon, x.appendChild(P);
        } else
          x.textContent = m.icon;
        v.appendChild(x);
      }
      const T = document.createElement("span");
      T.textContent = m.label, T.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, v.appendChild(T), v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "transparent";
      }), v.addEventListener("click", () => {
        m.onClick(), a.remove();
      }), a.appendChild(v);
    }), document.body.appendChild(a);
    const d = a.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (a.style.left = `${u - d.width - 10}px`), d.bottom > h && (a.style.top = `${h - d.height - 10}px`);
    const p = (m) => {
      a.contains(m.target) || (a.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
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
    `, t.addEventListener("click", (C) => {
      C.stopPropagation();
    });
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, r.textContent = "保存标签页集合", t.appendChild(r);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 0 20px;
    `;
    const a = document.createElement("div");
    a.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    `;
    const n = document.createElement("button");
    n.className = "orca-button orca-button-secondary", n.textContent = "创建新标签组", n.style.cssText = "flex: 1;";
    const o = document.createElement("button");
    o.className = "orca-button", o.textContent = "更新已有标签组", o.style.cssText = "flex: 1;";
    let c = !1;
    const l = () => {
      c = !1, n.className = "orca-button orca-button-secondary", n.style.cssText = "flex: 1;", o.className = "orca-button", o.style.cssText = "flex: 1;", u.style.display = "block", f.style.display = "none", P();
    }, d = () => {
      c = !0, o.className = "orca-button orca-button-secondary", o.style.cssText = "flex: 1;", n.className = "orca-button", n.style.cssText = "flex: 1;", u.style.display = "none", f.style.display = "block", P();
    };
    n.onclick = l, o.onclick = d, a.appendChild(n), a.appendChild(o), i.appendChild(a);
    const u = document.createElement("div");
    u.style.cssText = `
      display: block;
    `;
    const h = document.createElement("label");
    h.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, h.textContent = "请输入新标签页集合名称:", u.appendChild(h);
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
    }), p.addEventListener("input", (C) => {
    }), u.appendChild(p);
    const f = document.createElement("div");
    f.style.cssText = `
      display: none;
    `;
    const b = document.createElement("label");
    b.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, b.textContent = "请选择要更新的标签页集合:", f.appendChild(b);
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
    const y = document.createElement("option");
    y.value = "", y.textContent = "请选择标签页集合...", m.appendChild(y), this.savedTabSets.forEach((C, N) => {
      const R = document.createElement("option");
      R.value = N.toString(), R.textContent = `${C.name} (${C.tabs.length}个标签)`, m.appendChild(R);
    }), f.appendChild(m), i.appendChild(u), i.appendChild(f), t.appendChild(i);
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
      t.remove(), this.manageSavedTabSets();
    };
    const x = document.createElement("button");
    x.className = "orca-button orca-button-primary", x.textContent = "保存", x.style.cssText = "", x.addEventListener("mouseenter", () => {
      x.style.backgroundColor = "#2563eb";
    }), x.addEventListener("mouseleave", () => {
      x.style.backgroundColor = "var(--orca-color-primary-5)";
    });
    const P = () => {
      x.textContent = c ? "更新" : "保存";
    };
    x.onclick = async () => {
      if (c) {
        const C = parseInt(m.value);
        if (isNaN(C) || C < 0 || C >= this.savedTabSets.length) {
          orca.notify("warn", "请选择要更新的标签页集合");
          return;
        }
        t.remove(), await this.performUpdateTabSet(C);
      } else {
        const C = p.value.trim();
        if (!C) {
          orca.notify("warn", "请输入名称");
          return;
        }
        t.remove(), await this.performSaveTabSet(C);
      }
    }, v.appendChild(T), v.appendChild(x), t.appendChild(v), document.body.appendChild(t), setTimeout(() => {
      p.focus(), p.select();
    }, 100), p.addEventListener("keydown", (C) => {
      C.key === "Enter" ? (C.preventDefault(), x.click()) : C.key === "Escape" && (C.preventDefault(), T.click());
    });
    const $ = (C) => {
      t.contains(C.target) || (t.remove(), document.removeEventListener("click", $));
    };
    setTimeout(() => {
      document.addEventListener("click", $);
    }, 200);
  }
  /**
   * 执行保存标签页集合
   */
  async performSaveTabSet(e) {
    try {
      const t = this.getCurrentPanelTabs(), r = {
        id: `tabset_${Date.now()}`,
        name: e,
        tabs: [...t],
        // 深拷贝当前标签页
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.savedTabSets.push(r), await this.saveSavedTabSets(), this.log(`💾 已保存标签页集合: "${e}" (${t.length}个标签)`), orca.notify("success", `已保存标签页集合: ${e}`);
    } catch (t) {
      this.error("保存标签页集合失败:", t), orca.notify("error", "保存失败");
    }
  }
  /**
   * 执行更新已有标签页集合
   */
  async performUpdateTabSet(e) {
    try {
      const t = this.getCurrentPanelTabs(), r = this.savedTabSets[e];
      if (!r) {
        orca.notify("error", "标签页集合不存在");
        return;
      }
      r.tabs = [...t], r.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已更新标签页集合: "${r.name}" (${t.length}个标签)`), orca.notify("success", `已更新标签页集合: ${r.name}`);
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
    const r = document.createElement("div");
    r.className = "add-to-tabgroup-dialog", r.style.cssText = `
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
    `, r.addEventListener("click", (p) => {
      p.stopPropagation();
    });
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, i.textContent = "添加到已有标签组", r.appendChild(i);
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 0 20px;
    `;
    const n = document.createElement("label");
    n.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, n.textContent = `将标签页 "${e.title}" 添加到:`, a.appendChild(n);
    const o = document.createElement("select");
    o.style.cssText = `
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
    `, o.addEventListener("focus", () => {
      o.style.borderColor = "var(--orca-color-primary-5)";
    }), o.addEventListener("blur", () => {
      o.style.borderColor = "#ddd";
    });
    const c = document.createElement("option");
    c.value = "", c.textContent = "请选择标签组...", o.appendChild(c), this.savedTabSets.forEach((p, f) => {
      const b = document.createElement("option");
      b.value = f.toString(), b.textContent = `${p.name} (${p.tabs.length}个标签)`, o.appendChild(b);
    }), a.appendChild(o), r.appendChild(a);
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
      r.remove(), this.manageSavedTabSets();
    };
    const u = document.createElement("button");
    u.className = "orca-button orca-button-primary", u.textContent = "添加", u.style.cssText = "", u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#2563eb";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "var(--orca-color-primary-5)";
    }), u.onclick = async () => {
      const p = parseInt(o.value);
      if (isNaN(p) || p < 0 || p >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      r.remove(), await this.addTabToGroup(e, p);
    }, l.appendChild(d), l.appendChild(u), r.appendChild(l), document.body.appendChild(r), setTimeout(() => {
      o.focus();
    }, 100), o.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), u.click()) : p.key === "Escape" && (p.preventDefault(), d.click());
    });
    const h = (p) => {
      r.contains(p.target) || (r.remove(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 200);
  }
  /**
   * 将标签页添加到指定标签组
   */
  async addTabToGroup(e, t) {
    try {
      const r = this.savedTabSets[t];
      if (!r) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (r.tabs.find((a) => a.blockId === e.blockId)) {
        orca.notify("warn", "该标签页已在此标签组中");
        return;
      }
      r.tabs.push({ ...e }), r.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`➕ 已将标签页 "${e.title}" 添加到标签组: "${r.name}"`), orca.notify("success", `已添加到标签组: ${r.name}`);
    } catch (r) {
      this.error("添加标签页到标签组失败:", r), orca.notify("error", "添加失败");
    }
  }
  /**
   * 加载保存的标签页集合
   */
  async loadSavedTabSet(e, t) {
    try {
      const r = this.getCurrentPanelTabs();
      this.previousTabSet = [...r], r.length = 0;
      for (const i of e.tabs) {
        const a = { ...i, panelId: this.currentPanelId || "" };
        r.push(a);
      }
      this.syncCurrentTabsToStorage(r), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), e.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已加载标签页集合: "${e.name}" (${e.tabs.length}个标签)`), orca.notify("success", `已加载标签页集合: ${e.name}`);
    } catch (r) {
      this.error("加载标签页集合失败:", r), orca.notify("error", "加载失败");
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
      for (const r of this.previousTabSet) {
        const i = { ...r, panelId: this.currentPanelId || "" };
        e.push(i);
      }
      this.previousTabSet = t, this.syncCurrentTabsToStorage(e), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`🔄 已回到上一个标签集合 (${this.previousTabSet.length}个标签)`), orca.notify("success", "已回到上一个标签集合");
    } catch (e) {
      this.error("回到上一个标签集合失败:", e), orca.notify("error", "恢复失败");
    }
  }
  /**
   * 重新渲染可排序的标签列表
   */
  renderSortableTabs(e, t, r) {
    var n, o;
    const i = document.documentElement.classList.contains("dark") || ((o = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : o.themeMode) === "dark";
    e.innerHTML = "";
    let a = -1;
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
      const u = document.createElement("div");
      if (u.style.cssText = `
        margin-right: 8px;
        color: #999;
        font-size: 12px;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 20px;
      `, u.innerHTML = "⋮⋮", d.appendChild(u), c.icon) {
        const m = document.createElement("div");
        if (m.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `, c.icon.startsWith("ti ti-")) {
          const y = document.createElement("i");
          y.className = c.icon, m.appendChild(y);
        } else
          m.textContent = c.icon;
        d.appendChild(m);
      }
      const h = document.createElement("div");
      h.style.cssText = `
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
      h.innerHTML = p, d.appendChild(h);
      const f = document.createElement("div");
      f.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;
      const b = document.createElement("div");
      b.style.cssText = `
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
      `, b.textContent = (l + 1).toString(), f.appendChild(b), d.appendChild(f), d.addEventListener("dragstart", (m) => {
        console.log("拖拽开始，索引:", l), a = l, m.dataTransfer.setData("text/plain", l.toString()), m.dataTransfer.setData("application/json", JSON.stringify(c)), m.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (m) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", a = -1;
      }), d.addEventListener("dragover", (m) => {
        m.preventDefault(), m.dataTransfer.dropEffect = "move", a !== -1 && a !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (m) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (m) => {
        m.preventDefault(), m.stopPropagation();
        const y = parseInt(m.dataTransfer.getData("text/plain")), v = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", y !== v && y >= 0) {
          const T = t[y];
          t.splice(y, 1), t.splice(v, 0, T), this.renderSortableTabs(e, t);
          const x = this.savedTabSets.find((P) => P.tabs === t);
          x && (x.tabs = [...t], x.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
      }), d.addEventListener("mouseenter", () => {
        a === -1 && (d.style.backgroundColor = "rgba(59, 130, 246, 0.05)", d.style.borderColor = "var(--orca-color-primary-5)");
      }), d.addEventListener("mouseleave", () => {
        a === -1 && (d.style.backgroundColor = "var(--orca-color-bg-1)", d.style.borderColor = "#e0e0e0");
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
    var f, b;
    const e = document.querySelector(".save-workspace-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((b = (f = window.orca) == null ? void 0 : f.state) == null ? void 0 : b.themeMode) === "dark", r = document.createElement("div");
    r.className = "save-workspace-dialog", r.style.cssText = `
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
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px;
    `;
    const a = document.createElement("div");
    a.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, a.textContent = "保存工作区";
    const n = document.createElement("div");
    n.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, n.textContent = "工作区名称:";
    const o = document.createElement("input");
    o.type = "text", o.placeholder = "请输入工作区名称...", o.style.cssText = `
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
    const u = document.createElement("button");
    u.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-bg-1);
      color: ${t ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, u.textContent = "取消", u.onclick = () => {
      r.remove(), this.showWorkspaceMenu();
    };
    const h = document.createElement("button");
    h.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: none;
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-primary-5);
      color: white;
      cursor: pointer;
      font-size: 14px;
    `, h.textContent = "保存", h.onclick = async () => {
      const m = o.value.trim();
      if (!m) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((y) => y.name === m)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(m, l.value.trim()), r.remove();
    }, d.appendChild(u), d.appendChild(h), i.appendChild(a), i.appendChild(n), i.appendChild(o), i.appendChild(c), i.appendChild(l), i.appendChild(d), r.appendChild(i), document.body.appendChild(r), o.focus(), r.addEventListener("click", (m) => {
      m.target === r && r.remove();
    });
    const p = (m) => {
      m.key === "Escape" && (r.remove(), document.removeEventListener("keydown", p));
    };
    document.addEventListener("keydown", p);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const r = this.getCurrentPanelTabs(), i = this.getCurrentActiveTab(), a = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: r,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: i ? i.blockId : void 0
      };
      this.workspaces.push(a), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${r.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (r) {
      this.error("保存工作区失败:", r), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(e) {
    var b, m;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const r = document.documentElement.classList.contains("dark") || ((m = (b = window.orca) == null ? void 0 : b.state) == null ? void 0 : m.themeMode) === "dark", i = document.createElement("div");
    i.className = "workspace-menu";
    const a = 280, n = 400, o = e ? { x: e.clientX, y: e.clientY } : { x: 20, y: 60 }, { x: c, y: l } = _(o.x, o.y, a, n);
    i.style.cssText = `
      position: fixed;
      left: ${c}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: ${this.getNextDialogZIndex()};
      min-width: 200px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const d = document.createElement("div");
    d.style.cssText = `
      padding: var(--orca-spacing-sm);
      border-bottom: 1px solid var(--orca-color-border);
      font-size: 14px;
      font-weight: 600;
      color: ${r ? "#ffffff" : "#333"};
    `, d.textContent = "工作区";
    const u = document.createElement("div");
    u.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--orca-color-border);
      color: ${r ? "#ffffff" : "#333"};
    `, u.innerHTML = `
      <i class="ti ti-plus" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
      <span>保存当前工作区</span>
    `, u.onclick = () => {
      i.remove(), this.saveCurrentWorkspace();
    };
    const h = document.createElement("div");
    if (h.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const y = document.createElement("div");
      y.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${r ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, y.textContent = "暂无工作区", h.appendChild(y);
    } else
      this.workspaces.forEach((y) => {
        const v = document.createElement("div");
        v.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--orca-color-border);
          color: ${r ? "#ffffff" : "#333"};
          ${this.currentWorkspace === y.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const T = y.icon || "ti ti-folder";
        v.innerHTML = `
          <i class="${T}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: ${r ? "#ffffff" : "#333"};"">${y.name}</div>
            ${y.description ? `<div style="font-size: 12px; color: ${r ? "#999" : "#666"}; margin-top: 2px;">${y.description}</div>` : ""}
            <div style="font-size: 11px; color: ${r ? "#777" : "#999"}; margin-top: 2px;">${y.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === y.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ""}
        `, v.onclick = () => {
          i.remove(), this.switchToWorkspace(y.id);
        }, h.appendChild(v);
      });
    const p = document.createElement("div");
    p.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${r ? "#ffffff" : "#333"};
    `, p.innerHTML = `
      <i class="ti ti-settings" style="font-size: 14px; color: ${r ? "#999" : "#666"};"></i>
      <span>管理工作区</span>
    `, p.onclick = () => {
      i.remove(), this.manageWorkspaces();
    }, i.appendChild(d), i.appendChild(u), i.appendChild(h), i.appendChild(p), document.body.appendChild(i);
    const f = (y) => {
      i.contains(y.target) || (i.remove(), document.removeEventListener("click", f));
    };
    setTimeout(() => {
      document.addEventListener("click", f);
    }, 100);
  }
  /**
   * 切换到指定工作区
   */
  async switchToWorkspace(e) {
    try {
      const t = this.workspaces.find((r) => r.id === e);
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
      const r = [];
      for (const a of e)
        try {
          const n = await this.getTabInfo(a.blockId, this.currentPanelId || "", r.length);
          n ? (n.isPinned = a.isPinned, n.order = a.order, n.scrollPosition = a.scrollPosition, r.push(n)) : r.push(a);
        } catch (n) {
          this.warn(`无法更新标签页信息 ${a.title}:`, n), r.push(a);
        }
      this.panelTabsData[0] = r, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...r], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const i = t.lastActiveTabId;
      setTimeout(async () => {
        if (r.length > 0) {
          let a = r[0];
          if (i) {
            const n = r.find((o) => o.blockId === i);
            n ? (a = n, this.log(`🎯 导航到工作区中最后激活的标签页: ${a.title} (ID: ${i})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${a.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${a.title}`);
          await orca.nav.goTo("block", { blockId: parseInt(a.blockId) }, this.currentPanelId || "");
        }
      }, 100), this.log(`📋 已替换当前标签页，共 ${r.length} 个标签，块类型图标已更新`);
    } catch (r) {
      throw this.error("替换标签页失败:", r), r;
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
    const t = this.workspaces.find((r) => r.id === this.currentWorkspace);
    t && (t.lastActiveTabId = e.blockId, t.updatedAt = Date.now(), await this.saveWorkspaces(), this.log(`🔄 实时更新工作区最后激活标签页: ${e.title} (ID: ${e.blockId})`));
  }
  /**
   * 保存当前标签页到当前工作区
   */
  async saveCurrentTabsToWorkspace() {
    if (!this.currentWorkspace) return;
    const e = this.workspaces.find((t) => t.id === this.currentWorkspace);
    if (e) {
      const t = this.getCurrentPanelTabs(), r = this.getCurrentActiveTab();
      e.tabs = t, e.lastActiveTabId = r ? r.blockId : void 0, e.updatedAt = Date.now(), await this.saveWorkspaces();
    }
  }
  /**
   * 管理工作区
   */
  manageWorkspaces() {
    var d, u;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", r = document.createElement("div");
    r.className = "manage-workspaces-dialog", r.style.cssText = `
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
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px;
    `;
    const a = document.createElement("div");
    a.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, a.textContent = "管理工作区";
    const n = document.createElement("div");
    if (n.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
    `, this.workspaces.length === 0) {
      const h = document.createElement("div");
      h.style.cssText = `
        padding: 40px;
        text-align: center;
        color: ${t ? "#999" : "#666"};
        font-size: 14px;
      `, h.textContent = "暂无工作区", n.appendChild(h);
    } else
      this.workspaces.forEach((h) => {
        const p = document.createElement("div");
        p.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          margin-bottom: 8px;
          background: ${this.currentWorkspace === h.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)"};
        `;
        const f = h.icon || "ti ti-folder";
        p.innerHTML = `
          <i class="${f}" style="font-size: 20px; color: var(--orca-color-primary-5); margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; color: ${t ? "#ffffff" : "#333"};"">${h.name}</div>
            ${h.description ? `<div style="font-size: 12px; color: ${t ? "#999" : "#666"}; margin-bottom: 4px;">${h.description}</div>` : ""}
            <div style="font-size: 11px; color: ${t ? "#777" : "#999"};"">${h.tabs.length}个标签 • 创建于 ${new Date(h.createdAt).toLocaleString()}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${this.currentWorkspace === h.id ? '<span style="color: var(--orca-color-primary-5); font-size: 12px;">当前</span>' : ""}
            <button class="delete-workspace-btn" data-workspace-id="${h.id}" style="
              padding: 4px 8px;
              border: 1px solid var(--orca-color-border);
              border-radius: var(--orca-radius-md);
              background: var(--orca-color-bg-1);
              color: #ef4444;
              cursor: pointer;
              font-size: 12px;
            ">删除</button>
          </div>
        `, n.appendChild(p);
      });
    const o = document.createElement("div");
    o.style.cssText = `
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
      r.remove();
    }, o.appendChild(c), i.appendChild(a), i.appendChild(n), i.appendChild(o), r.appendChild(i), document.body.appendChild(r), r.querySelectorAll(".delete-workspace-btn").forEach((h) => {
      h.addEventListener("click", async (p) => {
        const f = p.target.getAttribute("data-workspace-id");
        f && (await this.deleteWorkspace(f), r.remove(), this.manageWorkspaces());
      });
    }), r.addEventListener("click", (h) => {
      h.target === r && r.remove();
    });
  }
  /**
   * 删除工作区
   */
  async deleteWorkspace(e) {
    try {
      const t = this.workspaces.find((r) => r.id === e);
      if (!t) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace === e && (this.currentWorkspace = null), this.workspaces = this.workspaces.filter((r) => r.id !== e), await this.saveWorkspaces(), this.log(`🗑️ 工作区已删除: "${t.name}"`), orca.notify("success", `工作区已删除: ${t.name}`);
    } catch (t) {
      this.error("删除工作区失败:", t), orca.notify("error", "删除工作区失败");
    }
  }
  /**
   * 显示标签集合详情
   */
  showTabSetDetails(e, t) {
    var u, h;
    document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null || h.themeMode);
    const r = document.querySelector(".tabset-details-dialog");
    r && r.remove();
    const i = document.createElement("div");
    i.className = "tabset-details-dialog", i.style.cssText = `
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
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, a.textContent = `标签集合详情: ${e.name}`, i.appendChild(a);
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;
    const o = document.createElement("div");
    if (o.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background-color: var(--orca-color-bg-1);
      border-radius: var(--orca-radius-md);
    `, o.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>创建时间:</strong> ${new Date(e.createdAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>更新时间:</strong> ${new Date(e.updatedAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666;">
        <strong>标签数量:</strong> ${e.tabs.length}个
      </div>
    `, n.appendChild(o), e.tabs.length === 0) {
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
      const f = document.createElement("div");
      f.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const b = document.createElement("span");
      b.textContent = "包含的标签 (可拖拽排序):", f.appendChild(b);
      const m = document.createElement("span");
      m.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, m.textContent = "拖拽调整顺序", f.appendChild(m), p.appendChild(f);
      const y = document.createElement("div");
      y.className = "sortable-tabs-container", y.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(y, [...e.tabs], e), p.appendChild(y), n.appendChild(p);
    }
    i.appendChild(n);
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
      i.remove(), t && this.manageSavedTabSets();
    }, c.appendChild(l), i.appendChild(c), document.body.appendChild(i);
    const d = (p) => {
      i.contains(p.target) || (i.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, r) {
    const i = document.querySelector(".rename-tabset-dialog");
    i && i.remove();
    const a = document.createElement("div");
    a.className = "rename-tabset-dialog", a.style.cssText = `
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
    `, n.textContent = "重命名标签集合", a.appendChild(n);
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 0 20px;
    `;
    const c = document.createElement("label");
    c.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, c.textContent = "请输入新的名称:", o.appendChild(c);
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
    }), o.appendChild(l), a.appendChild(o);
    const d = document.createElement("div");
    d.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const u = document.createElement("button");
    u.className = "orca-button", u.textContent = "取消", u.style.cssText = "", u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#4b5563";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "#6b7280";
    }), u.onclick = () => {
      a.remove(), this.manageSavedTabSets();
    };
    const h = document.createElement("button");
    h.className = "orca-button orca-button-primary", h.textContent = "保存", h.style.cssText = "", h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#2563eb";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "var(--orca-color-primary-5)";
    }), h.onclick = async () => {
      const f = l.value.trim();
      if (!f) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (f === e.name) {
        a.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((m) => m.name === f && m.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = f, e.updatedAt = Date.now(), await this.saveSavedTabSets(), a.remove(), r.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(u), d.appendChild(h), a.appendChild(d), document.body.appendChild(a), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (f) => {
      f.key === "Enter" ? (f.preventDefault(), h.click()) : f.key === "Escape" && (f.preventDefault(), u.click());
    });
    const p = (f) => {
      a.contains(f.target) || (a.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, r, i) {
    const a = document.createElement("input");
    a.type = "text", a.value = e.name, a.style.cssText = `
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
    const n = r.textContent;
    r.innerHTML = "", r.appendChild(a), a.addEventListener("click", (d) => {
      d.stopPropagation();
    }), a.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), a.focus(), a.select();
    const o = async () => {
      const d = a.value.trim();
      if (!d) {
        r.textContent = n;
        return;
      }
      if (d === e.name) {
        r.textContent = n;
        return;
      }
      if (this.savedTabSets.find((h) => h.name === d && h.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), r.textContent = n;
        return;
      }
      e.name = d, e.updatedAt = Date.now(), await this.saveSavedTabSets(), r.textContent = d, orca.notify("success", "重命名成功");
    }, c = () => {
      r.textContent = n;
    };
    a.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), o()) : d.key === "Escape" && (d.preventDefault(), c());
    });
    let l = null;
    a.addEventListener("blur", () => {
      l && clearTimeout(l), l = window.setTimeout(() => {
        o();
      }, 100);
    }), a.addEventListener("focus", () => {
      l && (clearTimeout(l), l = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, r, i, a) {
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
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, o.textContent = "选择图标", n.appendChild(o);
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
    `, l.forEach((f) => {
      const b = document.createElement("div");
      b.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border: 1px solid #e0e0e0;
        border-radius: var(--orca-radius-md);
        cursor: pointer;
        transition: all 0.2s;
        background: ${e.icon === f.value ? "#e3f2fd" : "white"};
      `;
      const m = document.createElement("div");
      if (m.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, f.value.startsWith("ti ti-")) {
        const v = document.createElement("i");
        v.className = f.value, m.appendChild(v);
      } else
        m.textContent = f.icon;
      const y = document.createElement("div");
      y.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, y.textContent = f.name, b.appendChild(m), b.appendChild(y), b.addEventListener("click", async (v) => {
        v.stopPropagation(), e.icon = f.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i(), n.remove(), a && a.focus(), orca.notify("success", "图标已更新");
      }), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "#f5f5f5", b.style.borderColor = "var(--orca-color-primary-5)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = e.icon === f.value ? "#e3f2fd" : "white", b.style.borderColor = "#e0e0e0";
      }), d.appendChild(b);
    }), c.appendChild(d), n.appendChild(c);
    const u = document.createElement("div");
    u.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const h = document.createElement("button");
    h.className = "orca-button", h.textContent = "关闭", h.style.cssText = "", h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#4b5563";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "#6b7280";
    }), h.onclick = (f) => {
      f.stopPropagation(), n.remove(), a && a.focus();
    }, u.appendChild(h), n.appendChild(u), document.body.appendChild(n);
    const p = (f) => {
      n.contains(f.target) || (f.stopPropagation(), n.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p), a && a.focus());
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
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, r.textContent = "管理保存的标签页集合", t.appendChild(r);
    const i = document.createElement("div");
    i.style.cssText = `
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
      const u = document.createElement("div");
      u.style.cssText = `
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      const h = document.createElement("div");
      h.style.cssText = `
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
      `, h.title = "点击编辑图标";
      const p = () => {
        if (h.innerHTML = "", c.icon)
          if (c.icon.startsWith("ti ti-")) {
            const P = document.createElement("i");
            P.className = c.icon, h.appendChild(P);
          } else
            h.textContent = c.icon;
        else
          h.textContent = "📁";
      };
      p(), h.addEventListener("click", () => {
        this.editTabSetIcon(c, l, h, p, t);
      }), h.addEventListener("mouseenter", () => {
        h.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), h.addEventListener("mouseleave", () => {
        h.style.backgroundColor = "transparent";
      });
      const f = document.createElement("div");
      f.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      `;
      const b = document.createElement("div");
      b.style.cssText = `
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
      `, b.textContent = c.name, b.title = "点击编辑名称", b.addEventListener("click", () => {
        this.editTabSetName(c, l, b, t);
      }), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      });
      const m = document.createElement("div");
      m.style.cssText = `
        font-size: 12px;
        color: #666;
      `, m.textContent = `${c.tabs.length}个标签 • ${new Date(c.updatedAt).toLocaleString()}`, f.appendChild(b), f.appendChild(m), u.appendChild(h), u.appendChild(f);
      const y = document.createElement("div");
      y.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const v = document.createElement("button");
      v.className = "orca-button orca-button-primary", v.textContent = "加载", v.style.cssText = "", v.onclick = () => {
        this.loadSavedTabSet(c, l), t.remove();
      };
      const T = document.createElement("button");
      T.className = "orca-button", T.textContent = "查看", T.style.cssText = "", T.onclick = () => {
        this.showTabSetDetails(c, t);
      };
      const x = document.createElement("button");
      x.className = "orca-button", x.textContent = "删除", x.style.cssText = "", x.onclick = () => {
        confirm(`确定要删除标签页集合 "${c.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), t.remove(), this.manageSavedTabSets());
      }, y.appendChild(v), y.appendChild(T), y.appendChild(x), d.appendChild(u), d.appendChild(y), i.appendChild(d);
    }), t.appendChild(i);
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const n = document.createElement("button");
    n.className = "orca-button", n.textContent = "关闭", n.style.cssText = "", n.addEventListener("mouseenter", () => {
      n.style.backgroundColor = "#4b5563";
    }), n.addEventListener("mouseleave", () => {
      n.style.backgroundColor = "#6b7280";
    }), n.onclick = () => t.remove(), a.appendChild(n), t.appendChild(a), document.body.appendChild(t);
    const o = (c) => {
      t.contains(c.target) || (t.remove(), document.removeEventListener("click", o), document.removeEventListener("contextmenu", o));
    };
    setTimeout(() => {
      document.addEventListener("click", o), document.addEventListener("contextmenu", o);
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
    var i;
    const t = e.healthScore || 0, r = ((i = e.issues) == null ? void 0 : i.length) || 0;
    this.log(`📊 性能报告: 健康分数 ${t}/100, 问题数: ${r}`), t < 50 && r > 0 && (this.log("⚠️ 性能分数过低，触发自动优化"), this.triggerPerformanceOptimization());
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
  trackOptimizedResource(e, t, r, i) {
    if (!this.performanceOptimizer)
      return e.addEventListener(t, r, i), null;
    const a = this.performanceOptimizer.trackEventListener(e, t, r, i);
    return a && this.verboseLog(`👂 跟踪事件监听器: ${t} -> ${a}`), a;
  }
  /**
   * 销毁插件，清理所有资源
   */
  destroy() {
    try {
      typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null, this.lastBaselineScenario = null, this.lastBaselineReport = null, this.log("🗑️ 开始销毁插件..."), this.performanceOptimizer && (this.log("🧹 清理性能优化器..."), this.performanceOptimizer.destroy(), this.performanceOptimizer = null), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
      const e = document.getElementById("orca-tabs-drag-styles");
      e && e.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null, this.log("✅ 插件销毁完成");
    } catch (e) {
      this.error("❌ 插件销毁过程中发生错误:", e);
    }
  }
}
let I = null;
async function kr(s) {
  U = s, orca.state.locale, I = new Tr(U), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => I == null ? void 0 : I.init(), 500);
  }) : setTimeout(() => I == null ? void 0 : I.init(), 500), orca.commands.registerCommand(
    `${U}.resetCache`,
    async () => {
      I && await I.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${U}.toggleBlockIcons`,
    async () => {
      I && await I.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function Cr() {
  I && (I.unregisterHeadbarButton(), I.cleanupDragResize(), I.destroy(), I = null), orca.commands.unregisterCommand(`${U}.resetCache`);
}
export {
  kr as load,
  Cr as unload
};
