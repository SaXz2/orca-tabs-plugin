var Ve = Object.defineProperty;
var je = (s, e, t) => e in s ? Ve(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var f = (s, e, t) => je(s, typeof e != "symbol" ? e + "" : e, t);
const Le = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, Me = {
  /** JSON数据类型 - 用于存储结构化数据 */
  JSON: 0,
  /** 文本数据类型 - 用于存储纯文本数据 */
  Text: 1
}, k = {
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
  RESTORE_FOCUSED_TAB: "restore-focused-tab",
  /** 水平布局标签最大宽度 - 存储水平布局下标签的最大宽度设置 */
  HORIZONTAL_TAB_MAX_WIDTH: "horizontal-tab-max-width",
  /** 水平布局标签最小宽度 - 存储水平布局下标签的最小宽度设置 */
  HORIZONTAL_TAB_MIN_WIDTH: "horizontal-tab-min-width",
  /** 进入工作区前的标签页组 - 存储进入工作区前的普通标签页组，用于退出工作区时恢复 */
  TABS_BEFORE_WORKSPACE: "tabs-before-workspace",
  /** 最近切换标签历史 - 存储每个标签的最近切换历史，用于悬浮显示功能 */
  RECENT_TAB_SWITCH_HISTORY: "recent-tab-switch-history",
  /** 中键固定标签页功能开关 - 存储是否启用中键固定标签页功能 */
  ENABLE_MIDDLE_CLICK_PIN: "enable-middle-click-pin",
  /** 双击关闭标签页功能开关 - 存储是否启用双击关闭标签页功能 */
  ENABLE_DOUBLE_CLICK_CLOSE: "enable-double-click-close"
}, te = {
  /** 全局切换历史记录最大数量 - 限制全局标签页切换历史记录的最大数量 */
  GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS: 10
};
class Ge {
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
      const i = typeof t == "string" ? t : JSON.stringify(t);
      return await orca.plugins.setData(a, e, i), this.log(`💾 已保存插件数据 ${e}:`, t), !0;
    } catch (i) {
      return this.error(`无法保存插件数据 ${e}:`, i), !1;
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
      const i = await orca.plugins.getData(t, e);
      if (i == null)
        return a || null;
      let r;
      if (typeof i == "string")
        try {
          r = JSON.parse(i);
        } catch {
          r = i;
        }
      else
        r = i;
      return this.log(`📂 已读取插件数据 ${e}:`, r), r;
    } catch (i) {
      return this.error(`无法读取插件数据 ${e}:`, i), a || null;
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
      return this.error(`无法删除插件数据 ${e}:`, a), !1;
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
  async testConfigSerialization() {
    try {
      this.log("🧪 开始测试API配置序列化...");
      const e = "test string";
      await this.saveConfig("test-string", e);
      const t = await this.getConfig("test-string", "orca-tabs-plugin");
      this.log(`字符串测试: ${e === t ? "✅" : "❌"}`);
      const a = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", a);
      const i = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(a) === JSON.stringify(i) ? "✅" : "❌"}`);
      const r = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", r);
      const n = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(r) === JSON.stringify(n) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
function V() {
  return {
    isVerticalMode: !1,
    verticalWidth: 200,
    verticalPosition: { x: 20, y: 20 },
    horizontalPosition: { x: 20, y: 20 },
    isSidebarAlignmentEnabled: !1,
    isFloatingWindowVisible: !0,
    showBlockTypeIcons: !0,
    showInHeadbar: !0,
    horizontalTabMaxWidth: 130,
    horizontalTabMinWidth: 80
  };
}
function Ye(s, e, t = 200) {
  const a = e ? t : 400, i = 40, r = window.innerWidth - a, n = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(s.x, r)),
    y: Math.max(0, Math.min(s.y, n))
  };
}
function Ke(s) {
  const e = V();
  return {
    isVerticalMode: s.isVerticalMode ?? e.isVerticalMode,
    verticalWidth: s.verticalWidth ?? e.verticalWidth,
    verticalPosition: s.verticalPosition ?? e.verticalPosition,
    horizontalPosition: s.horizontalPosition ?? e.horizontalPosition,
    isSidebarAlignmentEnabled: s.isSidebarAlignmentEnabled !== void 0 ? s.isSidebarAlignmentEnabled : e.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: s.isFloatingWindowVisible ?? e.isFloatingWindowVisible,
    showBlockTypeIcons: s.showBlockTypeIcons ?? e.showBlockTypeIcons,
    showInHeadbar: s.showInHeadbar ?? e.showInHeadbar,
    horizontalTabMaxWidth: s.horizontalTabMaxWidth ?? e.horizontalTabMaxWidth,
    horizontalTabMinWidth: s.horizontalTabMinWidth ?? e.horizontalTabMinWidth
  };
}
function ce(s, e, t) {
  return s ? { ...e } : { ...t };
}
function Qe(s, e, t, a) {
  return e ? {
    verticalPosition: { ...s },
    horizontalPosition: { ...a }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...s }
  };
}
function Xe(s) {
  return `布局模式: ${s.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${s.verticalWidth}px, 垂直位置: (${s.verticalPosition.x}, ${s.verticalPosition.y}), 水平位置: (${s.horizontalPosition.x}, ${s.horizontalPosition.y})`;
}
function De(s, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${s.x}, ${s.y})`;
}
class Je {
  constructor(e, t, a) {
    f(this, "storageService");
    f(this, "pluginName");
    f(this, "log");
    f(this, "warn");
    f(this, "error");
    f(this, "verboseLog");
    this.storageService = e, this.pluginName = t, this.log = a.log, this.warn = a.warn, this.error = a.error, this.verboseLog = a.verboseLog;
  }
  // ==================== 标签页数据存储 ====================
  /**
   * 保存第一个面板的标签数据到持久化存储
   */
  async saveFirstPanelTabs(e) {
    try {
      await this.storageService.saveConfig(k.FIRST_PANEL_TABS, e, this.pluginName), this.log(`💾 保存第一个面板的 ${e.length} 个标签页数据到API配置`);
    } catch (t) {
      this.warn("无法保存第一个面板标签数据:", t);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(k.FIRST_PANEL_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(k.CLOSED_TABS, Array.from(e), this.pluginName), this.log("💾 保存已关闭标签列表到API配置");
    } catch (t) {
      this.warn("无法保存已关闭标签列表:", t);
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  async restoreClosedTabs() {
    try {
      const e = await this.storageService.getConfig(k.CLOSED_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(k.RECENTLY_CLOSED_TABS, e, this.pluginName), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (t) {
      this.warn("无法保存最近关闭标签页列表:", t);
    }
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表
   */
  async restoreRecentlyClosedTabs() {
    try {
      const e = await this.storageService.getConfig(k.RECENTLY_CLOSED_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(k.SAVED_TAB_SETS, e, this.pluginName), this.log("💾 保存多标签页集合到API配置");
    } catch (t) {
      this.warn("无法保存多标签页集合:", t);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(k.SAVED_TAB_SETS, this.pluginName, []);
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
      const e = await this.storageService.getConfig(k.WORKSPACES), t = e && Array.isArray(e) ? e : [], a = await this.storageService.getConfig(k.ENABLE_WORKSPACES), i = typeof a == "boolean" ? a : !1;
      return this.log(`📁 已加载 ${t.length} 个工作区`), { workspaces: t, enableWorkspaces: i };
    } catch (e) {
      return this.error("加载工作区数据失败:", e), { workspaces: [], enableWorkspaces: !1 };
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces(e, t, a) {
    try {
      await this.storageService.saveConfig(k.WORKSPACES, e, this.pluginName), await this.storageService.saveConfig(k.CURRENT_WORKSPACE, t, this.pluginName), await this.storageService.saveConfig(k.ENABLE_WORKSPACES, a, this.pluginName), this.log("💾 工作区数据已保存");
    } catch (i) {
      this.error("保存工作区数据失败:", i);
    }
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    try {
      await this.storageService.saveConfig(k.CURRENT_WORKSPACE, null, this.pluginName), this.log("📁 已清除当前工作区状态");
    } catch (e) {
      this.error("清除当前工作区状态失败:", e);
    }
  }
  /**
   * 保存进入工作区前的标签页组
   */
  async saveTabsBeforeWorkspace(e) {
    try {
      await this.storageService.saveConfig(k.TABS_BEFORE_WORKSPACE, e, this.pluginName), this.log(`💾 已保存进入工作区前的标签页组: ${e.length}个标签页`);
    } catch (t) {
      this.error("保存进入工作区前的标签页组失败:", t);
    }
  }
  /**
   * 加载进入工作区前的标签页组
   */
  async loadTabsBeforeWorkspace() {
    try {
      const e = await this.storageService.getConfig(k.TABS_BEFORE_WORKSPACE, this.pluginName);
      return e && e.length > 0 && this.log(`📁 已加载进入工作区前的标签页组: ${e.length}个标签页`), e;
    } catch (e) {
      return this.error("加载进入工作区前的标签页组失败:", e), null;
    }
  }
  /**
   * 清除进入工作区前的标签页组
   */
  async clearTabsBeforeWorkspace() {
    try {
      await this.storageService.saveConfig(k.TABS_BEFORE_WORKSPACE, null, this.pluginName), this.log("📁 已清除进入工作区前的标签页组");
    } catch (e) {
      this.error("清除进入工作区前的标签页组失败:", e);
    }
  }
  // ==================== 位置和布局配置 ====================
  /**
   * 保存位置信息
   */
  async savePosition(e, t, a, i) {
    try {
      const r = Qe(
        e,
        t,
        a,
        i
      );
      return await this.saveLayoutMode({
        isVerticalMode: t,
        verticalWidth: 0,
        // 这个值需要从外部传入
        verticalPosition: r.verticalPosition,
        horizontalPosition: r.horizontalPosition,
        isSidebarAlignmentEnabled: !1,
        // 这些值需要从外部传入
        isFloatingWindowVisible: !1,
        showBlockTypeIcons: !1,
        showInHeadbar: !1,
        horizontalTabMaxWidth: 130,
        horizontalTabMinWidth: 80
      }), this.log(`💾 位置已保存: ${De(e, t)}`), r;
    } catch {
      return this.warn("无法保存标签位置"), { verticalPosition: a, horizontalPosition: i };
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(e) {
    try {
      await this.storageService.saveConfig(k.LAYOUT_MODE, e, this.pluginName), this.log(`💾 布局模式已保存: ${e.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${e.verticalWidth}px, 垂直位置: (${e.verticalPosition.x}, ${e.verticalPosition.y}), 水平位置: (${e.horizontalPosition.x}, ${e.horizontalPosition.y})`);
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
        k.LAYOUT_MODE,
        this.pluginName,
        V()
      ), t = {
        ...V(),
        ...e
      };
      return this.log(`📂 恢复布局模式配置: ${t.isVerticalMode ? "垂直" : "水平"}`), t;
    } catch (e) {
      return this.warn("恢复布局模式配置失败:", e), V();
    }
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode(e) {
    try {
      const t = { isFixedToTop: e };
      await this.storageService.saveConfig(k.FIXED_TO_TOP, t, this.pluginName), this.log(`💾 固定到顶部状态已保存: ${e ? "启用" : "禁用"}`);
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
        k.FIXED_TO_TOP,
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
      await this.storageService.saveConfig(k.FLOATING_WINDOW_VISIBLE, e, this.pluginName), this.log(`💾 浮窗可见状态已保存: ${e ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("保存浮窗可见状态失败:", t);
    }
  }
  /**
   * 恢复浮窗可见状态
   */
  async restoreFloatingWindowVisible() {
    try {
      const t = await this.storageService.getConfig(k.FLOATING_WINDOW_VISIBLE, this.pluginName, !1) || !1;
      return this.log(`📱 恢复浮窗可见状态: ${t ? "显示" : "隐藏"}`), t;
    } catch (e) {
      return this.error("恢复浮窗可见状态失败:", e), !1;
    }
  }
  // ==================== 最近切换标签历史管理 ====================
  /**
   * 保存最近切换标签历史
   */
  async saveRecentTabSwitchHistory(e) {
    try {
      await this.storageService.saveConfig(k.RECENT_TAB_SWITCH_HISTORY, e, this.pluginName), this.verboseLog(`💾 保存最近切换标签历史: ${Object.keys(e).length} 个标签的历史记录`);
    } catch (t) {
      this.warn("无法保存最近切换标签历史:", t);
    }
  }
  /**
   * 恢复最近切换标签历史
   */
  async restoreRecentTabSwitchHistory() {
    try {
      const e = await this.storageService.getConfig(
        k.RECENT_TAB_SWITCH_HISTORY,
        this.pluginName,
        {}
      );
      return e && typeof e == "object" ? (this.verboseLog(`📂 从API配置恢复了 ${Object.keys(e).length} 个标签的切换历史`), e) : (this.log("📂 没有找到最近切换标签历史数据，返回空对象"), {});
    } catch (e) {
      return this.warn("无法恢复最近切换标签历史:", e), {};
    }
  }
  /**
   * 更新单个标签的切换历史
   */
  async updateTabSwitchHistory(e, t) {
    try {
      const a = await this.restoreRecentTabSwitchHistory(), i = "global_tab_history";
      a[i] || (a[i] = {
        tabId: i,
        recentTabs: [],
        lastUpdated: Date.now(),
        maxRecords: te.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS
        // 全局历史记录最大数量限制
      });
      const r = a[i];
      r.recentTabs = r.recentTabs.filter((n) => n.blockId !== t.blockId), r.recentTabs.unshift(t), r.recentTabs.length > r.maxRecords && (r.recentTabs = r.recentTabs.slice(0, r.maxRecords)), r.lastUpdated = Date.now(), await this.saveRecentTabSwitchHistory(a), this.verboseLog(`📝 更新全局切换历史: ${e} -> ${t.title} (历史记录数量: ${r.recentTabs.length})`);
    } catch (a) {
      this.warn("更新全局切换历史失败:", a);
    }
  }
  /**
   * 获取指定标签的最近切换历史
   */
  async getTabSwitchHistory(e) {
    try {
      const t = await this.restoreRecentTabSwitchHistory(), a = t[e];
      return a && a.recentTabs ? (this.verboseLog(`📖 获取标签 ${e} 的切换历史: ${a.recentTabs.length} 个记录`), a.recentTabs) : (this.verboseLog(`📖 标签 ${e} 没有切换历史记录，存储中的所有历史ID: ${Object.keys(t).join(", ")}`), []);
    } catch (t) {
      return this.warn(`获取标签 ${e} 的切换历史失败:`, t), [];
    }
  }
  // ==================== 缓存清理 ====================
  /**
   * 删除API配置缓存
   */
  async clearCache() {
    try {
      await this.storageService.removeConfig(k.FIRST_PANEL_TABS), await this.storageService.removeConfig(k.CLOSED_TABS), await this.storageService.removeConfig(k.RECENT_TAB_SWITCH_HISTORY), this.log("🗑️ 已删除API配置缓存: 标签页数据、已关闭标签列表和切换历史");
    } catch (e) {
      this.warn("删除API配置缓存失败:", e);
    }
  }
  /**
   * 清理历史记录，确保符合新的数量限制
   */
  async cleanupHistoryRecords() {
    try {
      const e = await this.restoreRecentTabSwitchHistory();
      let t = 0;
      for (const [a, i] of Object.entries(e))
        if (i.recentTabs.length > te.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS) {
          const r = i.recentTabs.length;
          i.recentTabs = i.recentTabs.slice(0, te.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS), i.maxRecords = te.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS, t += r - i.recentTabs.length, this.log(`🧹 清理历史记录 ${a}: ${r} -> ${i.recentTabs.length}`);
        }
      t > 0 && (await this.saveRecentTabSwitchHistory(e), this.log(`✅ 历史记录清理完成，共清理了 ${t} 条记录`));
    } catch (e) {
      this.warn("清理历史记录失败:", e);
    }
  }
  // ==================== 工具方法 ====================
  /**
   * 简单的字符串哈希函数
   */
  hashString(e) {
    let t = 0;
    for (let a = 0; a < e.length; a++) {
      const i = e.charCodeAt(a);
      t = (t << 5) - t + i, t = t & t;
    }
    return Math.abs(t).toString(36);
  }
  /**
   * 删除指定标签的切换历史记录
   */
  async deleteTabSwitchHistory(e) {
    try {
      const t = await this.restoreRecentTabSwitchHistory();
      t[e] ? (delete t[e], await this.saveRecentTabSwitchHistory(t), this.verboseLog(`🗑️ 删除标签 ${e} 的切换历史记录`)) : this.verboseLog(`📖 标签 ${e} 没有切换历史记录，无需删除`);
    } catch (t) {
      this.warn(`删除标签 ${e} 的切换历史失败:`, t);
    }
  }
}
const Be = 6048e5, Ze = 864e5, Te = Symbol.for("constructDateFrom");
function L(s, e) {
  return typeof s == "function" ? s(e) : s && typeof s == "object" && Te in s ? s[Te](e) : s instanceof Date ? new s.constructor(e) : new Date(e);
}
function M(s, e) {
  return L(e || s, s);
}
function Ae(s, e, t) {
  const a = M(s, t == null ? void 0 : t.in);
  return isNaN(e) ? L(s, NaN) : (e && a.setDate(a.getDate() + e), a);
}
let et = {};
function se() {
  return et;
}
function Z(s, e) {
  var o, c, l, d;
  const t = se(), a = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, i = M(s, e == null ? void 0 : e.in), r = i.getDay(), n = (r < a ? 7 : 0) + r - a;
  return i.setDate(i.getDate() - n), i.setHours(0, 0, 0, 0), i;
}
function ae(s, e) {
  return Z(s, { ...e, weekStartsOn: 1 });
}
function Oe(s, e) {
  const t = M(s, e == null ? void 0 : e.in), a = t.getFullYear(), i = L(t, 0);
  i.setFullYear(a + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const r = ae(i), n = L(t, 0);
  n.setFullYear(a, 0, 4), n.setHours(0, 0, 0, 0);
  const o = ae(n);
  return t.getTime() >= r.getTime() ? a + 1 : t.getTime() >= o.getTime() ? a : a - 1;
}
function we(s) {
  const e = M(s), t = new Date(
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
function ze(s, ...e) {
  const t = L.bind(
    null,
    e.find((a) => typeof a == "object")
  );
  return e.map(t);
}
function ie(s, e) {
  const t = M(s, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function tt(s, e, t) {
  const [a, i] = ze(
    t == null ? void 0 : t.in,
    s,
    e
  ), r = ie(a), n = ie(i), o = +r - we(r), c = +n - we(n);
  return Math.round((o - c) / Ze);
}
function at(s, e) {
  const t = Oe(s, e), a = L(s, 0);
  return a.setFullYear(t, 0, 4), a.setHours(0, 0, 0, 0), ae(a);
}
function ye(s) {
  return L(s, Date.now());
}
function xe(s, e, t) {
  const [a, i] = ze(
    t == null ? void 0 : t.in,
    s,
    e
  );
  return +ie(a) == +ie(i);
}
function it(s) {
  return s instanceof Date || typeof s == "object" && Object.prototype.toString.call(s) === "[object Date]";
}
function rt(s) {
  return !(!it(s) && typeof s != "number" || isNaN(+M(s)));
}
function nt(s, e) {
  const t = M(s, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const st = {
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
}, ot = (s, e, t) => {
  let a;
  const i = st[s];
  return typeof i == "string" ? a = i : e === 1 ? a = i.one : a = i.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + a : a + " ago" : a;
};
function le(s) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : s.defaultWidth;
    return s.formats[t] || s.formats[s.defaultWidth];
  };
}
const ct = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, lt = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, dt = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, ht = {
  date: le({
    formats: ct,
    defaultWidth: "full"
  }),
  time: le({
    formats: lt,
    defaultWidth: "full"
  }),
  dateTime: le({
    formats: dt,
    defaultWidth: "full"
  })
}, ut = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, gt = (s, e, t, a) => ut[s];
function Y(s) {
  return (e, t) => {
    const a = t != null && t.context ? String(t.context) : "standalone";
    let i;
    if (a === "formatting" && s.formattingValues) {
      const n = s.defaultFormattingWidth || s.defaultWidth, o = t != null && t.width ? String(t.width) : n;
      i = s.formattingValues[o] || s.formattingValues[n];
    } else {
      const n = s.defaultWidth, o = t != null && t.width ? String(t.width) : s.defaultWidth;
      i = s.values[o] || s.values[n];
    }
    const r = s.argumentCallback ? s.argumentCallback(e) : e;
    return i[r];
  };
}
const pt = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, bt = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, mt = {
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
}, ft = {
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
}, vt = {
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
}, yt = {
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
}, xt = (s, e) => {
  const t = Number(s), a = t % 100;
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
}, Tt = {
  ordinalNumber: xt,
  era: Y({
    values: pt,
    defaultWidth: "wide"
  }),
  quarter: Y({
    values: bt,
    defaultWidth: "wide",
    argumentCallback: (s) => s - 1
  }),
  month: Y({
    values: mt,
    defaultWidth: "wide"
  }),
  day: Y({
    values: ft,
    defaultWidth: "wide"
  }),
  dayPeriod: Y({
    values: vt,
    defaultWidth: "wide",
    formattingValues: yt,
    defaultFormattingWidth: "wide"
  })
};
function K(s) {
  return (e, t = {}) => {
    const a = t.width, i = a && s.matchPatterns[a] || s.matchPatterns[s.defaultMatchWidth], r = e.match(i);
    if (!r)
      return null;
    const n = r[0], o = a && s.parsePatterns[a] || s.parsePatterns[s.defaultParseWidth], c = Array.isArray(o) ? kt(o, (h) => h.test(n)) : (
      // [TODO] -- I challenge you to fix the type
      wt(o, (h) => h.test(n))
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
function wt(s, e) {
  for (const t in s)
    if (Object.prototype.hasOwnProperty.call(s, t) && e(s[t]))
      return t;
}
function kt(s, e) {
  for (let t = 0; t < s.length; t++)
    if (e(s[t]))
      return t;
}
function Ct(s) {
  return (e, t = {}) => {
    const a = e.match(s.matchPattern);
    if (!a) return null;
    const i = a[0], r = e.match(s.parsePattern);
    if (!r) return null;
    let n = s.valueCallback ? s.valueCallback(r[0]) : r[0];
    n = t.valueCallback ? t.valueCallback(n) : n;
    const o = e.slice(i.length);
    return { value: n, rest: o };
  };
}
const Et = /^(\d+)(th|st|nd|rd)?/i, St = /\d+/i, Pt = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, It = {
  any: [/^b/i, /^(a|c)/i]
}, $t = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Lt = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Mt = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, Dt = {
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
}, Bt = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, At = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Ot = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, zt = {
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
}, Wt = {
  ordinalNumber: Ct({
    matchPattern: Et,
    parsePattern: St,
    valueCallback: (s) => parseInt(s, 10)
  }),
  era: K({
    matchPatterns: Pt,
    defaultMatchWidth: "wide",
    parsePatterns: It,
    defaultParseWidth: "any"
  }),
  quarter: K({
    matchPatterns: $t,
    defaultMatchWidth: "wide",
    parsePatterns: Lt,
    defaultParseWidth: "any",
    valueCallback: (s) => s + 1
  }),
  month: K({
    matchPatterns: Mt,
    defaultMatchWidth: "wide",
    parsePatterns: Dt,
    defaultParseWidth: "any"
  }),
  day: K({
    matchPatterns: Bt,
    defaultMatchWidth: "wide",
    parsePatterns: At,
    defaultParseWidth: "any"
  }),
  dayPeriod: K({
    matchPatterns: Ot,
    defaultMatchWidth: "any",
    parsePatterns: zt,
    defaultParseWidth: "any"
  })
}, Nt = {
  code: "en-US",
  formatDistance: ot,
  formatLong: ht,
  formatRelative: gt,
  localize: Tt,
  match: Wt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Rt(s, e) {
  const t = M(s, e == null ? void 0 : e.in);
  return tt(t, nt(t)) + 1;
}
function Ft(s, e) {
  const t = M(s, e == null ? void 0 : e.in), a = +ae(t) - +at(t);
  return Math.round(a / Be) + 1;
}
function We(s, e) {
  var d, h, u, g;
  const t = M(s, e == null ? void 0 : e.in), a = t.getFullYear(), i = se(), r = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((h = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((g = (u = i.locale) == null ? void 0 : u.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, n = L((e == null ? void 0 : e.in) || s, 0);
  n.setFullYear(a + 1, 0, r), n.setHours(0, 0, 0, 0);
  const o = Z(n, e), c = L((e == null ? void 0 : e.in) || s, 0);
  c.setFullYear(a, 0, r), c.setHours(0, 0, 0, 0);
  const l = Z(c, e);
  return +t >= +o ? a + 1 : +t >= +l ? a : a - 1;
}
function Ut(s, e) {
  var o, c, l, d;
  const t = se(), a = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((c = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : c.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, i = We(s, e), r = L((e == null ? void 0 : e.in) || s, 0);
  return r.setFullYear(i, 0, a), r.setHours(0, 0, 0, 0), Z(r, e);
}
function _t(s, e) {
  const t = M(s, e == null ? void 0 : e.in), a = +Z(t, e) - +Ut(t, e);
  return Math.round(a / Be) + 1;
}
function E(s, e) {
  const t = s < 0 ? "-" : "", a = Math.abs(s).toString().padStart(e, "0");
  return t + a;
}
const A = {
  // Year
  y(s, e) {
    const t = s.getFullYear(), a = t > 0 ? t : 1 - t;
    return E(e === "yy" ? a % 100 : a, e.length);
  },
  // Month
  M(s, e) {
    const t = s.getMonth();
    return e === "M" ? String(t + 1) : E(t + 1, 2);
  },
  // Day of the month
  d(s, e) {
    return E(s.getDate(), e.length);
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
    return E(s.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(s, e) {
    return E(s.getHours(), e.length);
  },
  // Minute
  m(s, e) {
    return E(s.getMinutes(), e.length);
  },
  // Second
  s(s, e) {
    return E(s.getSeconds(), e.length);
  },
  // Fraction of second
  S(s, e) {
    const t = e.length, a = s.getMilliseconds(), i = Math.trunc(
      a * Math.pow(10, t - 3)
    );
    return E(i, e.length);
  }
}, _ = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, ke = {
  // Era
  G: function(s, e, t) {
    const a = s.getFullYear() > 0 ? 1 : 0;
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
  y: function(s, e, t) {
    if (e === "yo") {
      const a = s.getFullYear(), i = a > 0 ? a : 1 - a;
      return t.ordinalNumber(i, { unit: "year" });
    }
    return A.y(s, e);
  },
  // Local week-numbering year
  Y: function(s, e, t, a) {
    const i = We(s, a), r = i > 0 ? i : 1 - i;
    if (e === "YY") {
      const n = r % 100;
      return E(n, 2);
    }
    return e === "Yo" ? t.ordinalNumber(r, { unit: "year" }) : E(r, e.length);
  },
  // ISO week-numbering year
  R: function(s, e) {
    const t = Oe(s);
    return E(t, e.length);
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
    return E(t, e.length);
  },
  // Quarter
  Q: function(s, e, t) {
    const a = Math.ceil((s.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(a);
      case "QQ":
        return E(a, 2);
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
  q: function(s, e, t) {
    const a = Math.ceil((s.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(a);
      case "qq":
        return E(a, 2);
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
  M: function(s, e, t) {
    const a = s.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return A.M(s, e);
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
  L: function(s, e, t) {
    const a = s.getMonth();
    switch (e) {
      case "L":
        return String(a + 1);
      case "LL":
        return E(a + 1, 2);
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
  w: function(s, e, t, a) {
    const i = _t(s, a);
    return e === "wo" ? t.ordinalNumber(i, { unit: "week" }) : E(i, e.length);
  },
  // ISO week of year
  I: function(s, e, t) {
    const a = Ft(s);
    return e === "Io" ? t.ordinalNumber(a, { unit: "week" }) : E(a, e.length);
  },
  // Day of the month
  d: function(s, e, t) {
    return e === "do" ? t.ordinalNumber(s.getDate(), { unit: "date" }) : A.d(s, e);
  },
  // Day of year
  D: function(s, e, t) {
    const a = Rt(s);
    return e === "Do" ? t.ordinalNumber(a, { unit: "dayOfYear" }) : E(a, e.length);
  },
  // Day of week
  E: function(s, e, t) {
    const a = s.getDay();
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
  e: function(s, e, t, a) {
    const i = s.getDay(), r = (i - a.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(r);
      case "ee":
        return E(r, 2);
      case "eo":
        return t.ordinalNumber(r, { unit: "day" });
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
  c: function(s, e, t, a) {
    const i = s.getDay(), r = (i - a.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(r);
      case "cc":
        return E(r, e.length);
      case "co":
        return t.ordinalNumber(r, { unit: "day" });
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
    const a = s.getDay(), i = a === 0 ? 7 : a;
    switch (e) {
      case "i":
        return String(i);
      case "ii":
        return E(i, e.length);
      case "io":
        return t.ordinalNumber(i, { unit: "day" });
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
    const a = s.getHours();
    let i;
    switch (a === 12 ? i = _.noon : a === 0 ? i = _.midnight : i = a / 12 >= 1 ? "pm" : "am", e) {
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
    const a = s.getHours();
    let i;
    switch (a >= 17 ? i = _.evening : a >= 12 ? i = _.afternoon : a >= 4 ? i = _.morning : i = _.night, e) {
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
      let a = s.getHours() % 12;
      return a === 0 && (a = 12), t.ordinalNumber(a, { unit: "hour" });
    }
    return A.h(s, e);
  },
  // Hour [0-23]
  H: function(s, e, t) {
    return e === "Ho" ? t.ordinalNumber(s.getHours(), { unit: "hour" }) : A.H(s, e);
  },
  // Hour [0-11]
  K: function(s, e, t) {
    const a = s.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(a, { unit: "hour" }) : E(a, e.length);
  },
  // Hour [1-24]
  k: function(s, e, t) {
    let a = s.getHours();
    return a === 0 && (a = 24), e === "ko" ? t.ordinalNumber(a, { unit: "hour" }) : E(a, e.length);
  },
  // Minute
  m: function(s, e, t) {
    return e === "mo" ? t.ordinalNumber(s.getMinutes(), { unit: "minute" }) : A.m(s, e);
  },
  // Second
  s: function(s, e, t) {
    return e === "so" ? t.ordinalNumber(s.getSeconds(), { unit: "second" }) : A.s(s, e);
  },
  // Fraction of second
  S: function(s, e) {
    return A.S(s, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(s, e, t) {
    const a = s.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (e) {
      case "X":
        return Ee(a);
      case "XXXX":
      case "XX":
        return R(a);
      case "XXXXX":
      case "XXX":
      default:
        return R(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(s, e, t) {
    const a = s.getTimezoneOffset();
    switch (e) {
      case "x":
        return Ee(a);
      case "xxxx":
      case "xx":
        return R(a);
      case "xxxxx":
      case "xxx":
      default:
        return R(a, ":");
    }
  },
  // Timezone (GMT)
  O: function(s, e, t) {
    const a = s.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + Ce(a, ":");
      case "OOOO":
      default:
        return "GMT" + R(a, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(s, e, t) {
    const a = s.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + Ce(a, ":");
      case "zzzz":
      default:
        return "GMT" + R(a, ":");
    }
  },
  // Seconds timestamp
  t: function(s, e, t) {
    const a = Math.trunc(+s / 1e3);
    return E(a, e.length);
  },
  // Milliseconds timestamp
  T: function(s, e, t) {
    return E(+s, e.length);
  }
};
function Ce(s, e = "") {
  const t = s > 0 ? "-" : "+", a = Math.abs(s), i = Math.trunc(a / 60), r = a % 60;
  return r === 0 ? t + String(i) : t + String(i) + e + E(r, 2);
}
function Ee(s, e) {
  return s % 60 === 0 ? (s > 0 ? "-" : "+") + E(Math.abs(s) / 60, 2) : R(s, e);
}
function R(s, e = "") {
  const t = s > 0 ? "-" : "+", a = Math.abs(s), i = E(Math.trunc(a / 60), 2), r = E(a % 60, 2);
  return t + i + e + r;
}
const Se = (s, e) => {
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
}, Ne = (s, e) => {
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
}, Ht = (s, e) => {
  const t = s.match(/(P+)(p+)?/) || [], a = t[1], i = t[2];
  if (!i)
    return Se(s, e);
  let r;
  switch (a) {
    case "P":
      r = e.dateTime({ width: "short" });
      break;
    case "PP":
      r = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      r = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      r = e.dateTime({ width: "full" });
      break;
  }
  return r.replace("{{date}}", Se(a, e)).replace("{{time}}", Ne(i, e));
}, qt = {
  p: Ne,
  P: Ht
}, Vt = /^D+$/, jt = /^Y+$/, Gt = ["D", "DD", "YY", "YYYY"];
function Yt(s) {
  return Vt.test(s);
}
function Kt(s) {
  return jt.test(s);
}
function Qt(s, e, t) {
  const a = Xt(s, e, t);
  if (console.warn(a), Gt.includes(s)) throw new RangeError(a);
}
function Xt(s, e, t) {
  const a = s[0] === "Y" ? "years" : "days of the month";
  return `Use \`${s.toLowerCase()}\` instead of \`${s}\` (in \`${e}\`) for formatting ${a} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Jt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Zt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, ea = /^'([^]*?)'?$/, ta = /''/g, aa = /[a-zA-Z]/;
function N(s, e, t) {
  var d, h, u, g;
  const a = se(), i = a.locale ?? Nt, r = a.firstWeekContainsDate ?? ((h = (d = a.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, n = a.weekStartsOn ?? ((g = (u = a.locale) == null ? void 0 : u.options) == null ? void 0 : g.weekStartsOn) ?? 0, o = M(s, t == null ? void 0 : t.in);
  if (!rt(o))
    throw new RangeError("Invalid time value");
  let c = e.match(Zt).map((p) => {
    const m = p[0];
    if (m === "p" || m === "P") {
      const b = qt[m];
      return b(p, i.formatLong);
    }
    return p;
  }).join("").match(Jt).map((p) => {
    if (p === "''")
      return { isToken: !1, value: "'" };
    const m = p[0];
    if (m === "'")
      return { isToken: !1, value: ia(p) };
    if (ke[m])
      return { isToken: !0, value: p };
    if (m.match(aa))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: p };
  });
  i.localize.preprocessor && (c = i.localize.preprocessor(o, c));
  const l = {
    firstWeekContainsDate: r,
    weekStartsOn: n,
    locale: i
  };
  return c.map((p) => {
    if (!p.isToken) return p.value;
    const m = p.value;
    (Kt(m) || Yt(m)) && Qt(m, e, String(s));
    const b = ke[m[0]];
    return b(o, m, i.localize, l);
  }).join("");
}
function ia(s) {
  const e = s.match(ea);
  return e ? e[1].replace(ta, "'") : s;
}
function ra(s, e) {
  return xe(
    L(s, s),
    ye(s)
  );
}
function na(s, e) {
  return xe(
    s,
    Ae(ye(s), 1),
    e
  );
}
function sa(s, e, t) {
  return Ae(s, -1, t);
}
function oa(s, e) {
  return xe(
    L(s, s),
    sa(ye(s))
  );
}
function ca(s) {
  try {
    let e = orca.state.settings[Le.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), ra(s))
      return "今天";
    if (oa(s))
      return "昨天";
    if (na(s))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const a = s.getDay(), r = ["日", "一", "二", "三", "四", "五", "六"][a], n = e.replace(/E/g, r);
          return N(s, n);
        } else
          return N(s, e);
      else
        return N(s, e);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of a)
        try {
          return N(s, i);
        } catch {
          continue;
        }
      return s.toLocaleDateString();
    }
  } catch {
    return s.toLocaleDateString();
  }
}
function Re(s) {
  try {
    const e = ue(s, "_repr");
    if (!e || e.type !== Me.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch {
    return null;
  }
}
async function de(s) {
  try {
    if (Re(s))
      return "journal";
    if (s["data-type"]) {
      const a = s["data-type"];
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
    if (s.aliases && s.aliases.length > 0 && s.aliases[0])
      try {
        const i = ue(s, "_hide");
        return i && i.value ? "page" : "tag";
      } catch {
        return "tag";
      }
    const t = ue(s, "_repr");
    if (t && t.type === Me.JSON && t.value)
      try {
        const a = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
        if (a.type)
          return a.type;
      } catch {
      }
    if (s.content && Array.isArray(s.content)) {
      if (s.content.some(
        (o) => o && typeof o == "object" && o.type === "code"
      ))
        return "code";
      if (s.content.some(
        (o) => o && typeof o == "object" && o.type === "table"
      ))
        return "table";
      if (s.content.some(
        (o) => o && typeof o == "object" && o.type === "image"
      ))
        return "image";
      if (s.content.some(
        (o) => o && typeof o == "object" && o.type === "link"
      ))
        return "link";
    }
    if (s.text) {
      const a = s.text.trim();
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
function Q(s) {
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
  let t = e[s];
  if (!t) {
    const a = la(s);
    a && (t = a);
  }
  return t || (t = e.default), t;
}
function la(s) {
  const e = s.toLowerCase(), t = {
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
  for (const [a, i] of Object.entries(t))
    if (e.includes(a))
      return i;
  return null;
}
function ue(s, e) {
  return !s.properties || !Array.isArray(s.properties) ? null : s.properties.find((t) => t.name === e);
}
function da(s) {
  if (!Array.isArray(s) || s.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const a of s)
    a && typeof a == "object" && (a.t === "text" && a.v ? e++ : a.t === "ref" && a.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function ha(s) {
  if (!s || s.length === 0) return "";
  let e = "";
  for (const t of s)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function ua(s, e, t, a) {
  const i = document.createElement("div");
  i.className = "orca-tabs-ref-menu-item", i.setAttribute("role", "menuitem"), i.style.cssText = `
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
  const r = document.createElement("i");
  r.className = e, r.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const n = document.createElement("span");
  if (n.textContent = s, n.style.cssText = `
    flex: 1;
    color: var(--orca-color-text-1);
  `, i.appendChild(r), i.appendChild(n), t && t.trim() !== "") {
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
    o.preventDefault(), o.stopPropagation(), a();
    const c = i.closest('.orca-context-menu, .context-menu, [role="menu"]');
    c && (c.style.display = "none", c.remove());
  }), i;
}
function ga(s, e, t) {
  s.addEventListener("mouseenter", () => {
    s.style.cssText += e;
  }), s.addEventListener("mouseleave", () => {
    s.style.cssText = t;
  });
}
function Fe(s) {
  s && s.parentNode && s.parentNode.removeChild(s);
}
function pa(s, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);
  if (t) {
    const a = parseInt(t[1], 16), i = parseInt(t[2], 16), r = parseInt(t[3], 16);
    return `rgba(${a}, ${i}, ${r}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function Pe(s, e, t, a, i) {
  let r = "var(--orca-tab-bg)", n = "var(--orca-color-text-1)", o = "normal", c = "";
  if (s.color)
    try {
      c = `--tab-color: ${s.color.startsWith("#") ? s.color : `#${s.color}`};`, r = "var(--orca-tab-colored-bg)", n = "var(--orca-tab-colored-text)", o = "600";
    } catch {
    }
  return e ? `
    ${c}
    background: ${r};
    color: ${n};
    font-weight: ${o};
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
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, margin, opacity, max-width, min-width;
  ` : `
    ${c}
    background: ${r};
    color: ${n};
    font-weight: ${o};
    padding: 2px 8px;
    border-radius: var(--orca-radius-md);
    height: 24px;
    max-height: 24px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    max-width: ${a || 130}px;
    min-width: ${i || 80}px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, margin, opacity, max-width, min-width;
  `;
}
function ba() {
  const s = document.createElement("div");
  return s.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, s;
}
function ma(s) {
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
function fa(s) {
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
    const a = e.offsetWidth;
    t.scrollWidth > a && (t.style.mask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.webkitMask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.maskSize = "100% 100%", t.style.webkitMaskSize = "100% 100%", t.style.maskRepeat = "no-repeat", t.style.webkitMaskRepeat = "no-repeat");
  }), e;
}
function va() {
  const s = document.createElement("span");
  return s.textContent = "📌", s.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, s;
}
function X(s, e, t = 180, a = 200) {
  const i = window.innerWidth, r = window.innerHeight, n = 10;
  let o = s, c = e;
  return o + t > i - n && (o = i - t - n), c + a > r - n && (c = r - a - n, c < e - a && (c = e - a - 5)), o < n && (o = n), c < n && (c = e + 5), o = Math.max(n, Math.min(o, i - t - n)), c = Math.max(n, Math.min(c, r - a - n)), { x: o, y: c };
}
function Ue() {
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
function re(s = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[s];
}
function ge() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function ya(s, e, t, a) {
  return s ? `
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
    overflow-x: hidden;
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
var $ = /* @__PURE__ */ ((s) => (s[s.ERROR = 0] = "ERROR", s[s.WARN = 1] = "WARN", s[s.INFO = 2] = "INFO", s[s.DEBUG = 3] = "DEBUG", s[s.VERBOSE = 4] = "VERBOSE", s))($ || {});
const _e = 1, q = class q {
  /**
   * 设置当前日志级别
   */
  static setLogLevel(e) {
    q.currentLogLevel = e;
  }
  /**
   * 获取当前日志级别
   */
  static getLogLevel() {
    return q.currentLogLevel;
  }
  /**
   * 检查是否应该输出指定级别的日志
   */
  static shouldLog(e) {
    return q.currentLogLevel >= e;
  }
};
f(q, "currentLogLevel", _e);
let U = q;
function he(s, ...e) {
  U.shouldLog(
    2
    /* INFO */
  ) && console.info("[OrcaPlugin]", s, ...e);
}
function I(s, ...e) {
  U.shouldLog(
    0
    /* ERROR */
  ) && console.error("[OrcaPlugin]", s, ...e);
}
function He(s, ...e) {
  U.shouldLog(
    1
    /* WARN */
  ) && console.warn("[OrcaPlugin]", s, ...e);
}
function B(s, ...e) {
  U.shouldLog(
    4
    /* VERBOSE */
  ) && console.log("[OrcaPlugin]", s, ...e);
}
function xa(s, e, t, a) {
  const i = document.createElement("div");
  i.className = s ? "orca-tabs-plugin orca-tabs-container vertical" : "orca-tabs-plugin orca-tabs-container";
  const r = ya(s, e, a, t);
  return i.style.cssText = r, i;
}
function Ta(s, e, t) {
  const a = document.createElement("div");
  a.className = "feature-toggle-button", a.innerHTML = e ? "🔒" : "🔓", a.title = e ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)";
  const i = s ? `
    width: calc(100% - 6px);
    margin: 0 3px;
    height: 24px;
    background: ${e ? "rgba(0, 150, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${e ? "#004400" : "#660000"};
    min-height: 24px;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    border-radius: var(--orca-radius-md);
    transition: all 0.2s ease;
    border: 2px solid ${e ? "rgba(0, 150, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"};
    z-index: 1000;
  ` : `
    width: 28px;
    height: 28px;
    background: ${e ? "rgba(0, 150, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${e ? "#004400" : "#660000"};
    margin-left: 4px;
    min-height: 28px;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    border-radius: var(--orca-radius-md);
    transition: all 0.2s ease;
    border: 2px solid ${e ? "rgba(0, 150, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"};
    z-index: 1000;
  `;
  return a.style.cssText = i, a.addEventListener("click", t), ga(a, e ? "#006600" : "#666", e ? "#004400" : "#333"), a;
}
function wa(s, e, t) {
  const a = document.createElement("div");
  a.className = "hover-tab-list-container";
  const i = `
    position: fixed;
    left: ${e.x}px;
    top: ${e.y}px;
    z-index: 10000;
    background: var(--orca-bg-primary, #ffffff);
    border: 1px solid var(--orca-border-color, #e0e0e0);
    border-radius: var(--orca-radius-md, 6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 4px;
    max-height: ${s.maxDisplayCount * 32 + 8}px;
    width: ${s.maxWidth || 150}px;
    overflow: hidden;
    pointer-events: auto;
    transition: opacity 0.2s ease, transform 0.2s ease;
    opacity: 0;
    transform: translateY(-10px);
  `;
  a.style.cssText = i;
  const r = document.createElement("div");
  r.className = "hover-tab-list-scroll", r.style.cssText = `
    overflow-y: auto;
    overflow-x: hidden;
    max-height: ${s.maxDisplayCount * 32}px;
    scrollbar-width: thin;
    scrollbar-color: var(--orca-scrollbar-thumb, #c0c0c0) var(--orca-scrollbar-track, #f0f0f0);
  `;
  const n = `
    .hover-tab-list-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .hover-tab-list-scroll::-webkit-scrollbar-track {
      background: var(--orca-scrollbar-track, #f0f0f0);
      border-radius: 3px;
    }
    .hover-tab-list-scroll::-webkit-scrollbar-thumb {
      background: var(--orca-scrollbar-thumb, #c0c0c0);
      border-radius: 3px;
    }
    .hover-tab-list-scroll::-webkit-scrollbar-thumb:hover {
      background: var(--orca-scrollbar-thumb-hover, #a0a0a0);
    }
  `;
  if (!document.getElementById("hover-tab-list-styles")) {
    const o = document.createElement("style");
    o.id = "hover-tab-list-styles", o.textContent = n, document.head.appendChild(o);
  }
  return a.appendChild(r), requestAnimationFrame(() => {
    a.style.opacity = "1", a.style.transform = "translateY(0)";
  }), a;
}
function ka(s, e, t, a, i) {
  const r = document.createElement("div");
  r.className = "hover-tab-item", r.setAttribute("data-tab-id", s.blockId);
  const n = t.maxDisplayCount - 1, o = Math.max(t.minOpacity, 1 - e / n * (1 - t.minOpacity)), c = Math.max(t.minScale, 1 - e / n * (1 - t.minScale)), l = `
    display: flex;
    align-items: center;
    padding: 6px 8px;
    margin: 2px 0;
    border-radius: var(--orca-radius-sm, 4px);
    cursor: pointer;
    transition: all ${t.animationDuration}ms ease;
    opacity: ${o};
    transform: scale(${c});
    background: transparent;
    border: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
    color: var(--orca-text-primary, #333333);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 24px;
    max-height: 24px;
  `;
  r.style.cssText = l;
  const d = document.createElement("div");
  if (d.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
  `, s.icon) {
    const u = document.createElement("span");
    s.icon.includes(" ") || s.icon.startsWith("ti-") ? u.className = s.icon : u.textContent = s.icon, u.style.cssText = `
      margin-right: 6px;
      font-size: 12px;
      flex-shrink: 0;
    `, d.appendChild(u);
  }
  const h = document.createElement("span");
  return h.textContent = s.title, h.style.cssText = `
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `, d.appendChild(h), r.appendChild(d), r.addEventListener("click", (u) => {
    u.stopPropagation(), a(s);
  }), r.addEventListener("mouseenter", () => {
    r.style.background = "var(--orca-bg-hover, rgba(0, 0, 0, 0.05))", r.style.transform = `scale(${Math.min(1, c + 0.05)})`;
  }), r.addEventListener("mouseleave", () => {
    r.style.background = "transparent", r.style.transform = `scale(${c})`;
  }), r;
}
function pe(s, e, t, a, i, r = 0) {
  const n = s.querySelector(".hover-tab-list-scroll");
  if (!n) return;
  n.innerHTML = "";
  const o = r, c = Math.min(o + t.maxDisplayCount, e.length);
  e.slice(o, c).forEach((d, h) => {
    const u = ka(d, h, t, a);
    n.appendChild(u);
  }), r > 0 && (n.scrollTop = r * 32);
}
function Ie(s, e, t, a, i) {
  B("🎨 showHoverTabList 被调用", { tabs: s.length, position: e, config: t });
  const r = document.querySelector(".hover-tab-list-container");
  r && (B("🗑️ 移除现有的悬浮列表"), Fe(r)), B("🏗️ 创建新容器");
  const n = wa(t, e);
  return B("📦 容器创建完成", n), document.body.appendChild(n), B("📄 容器已添加到页面"), B("🔄 更新内容"), pe(n, s, t, a), B("✅ 内容更新完成"), n;
}
function O() {
  const s = document.querySelector(".hover-tab-list-container");
  s && (s.style.opacity = "0", s.style.transform = "translateY(-10px)", setTimeout(() => {
    Fe(s);
  }, 200));
}
const be = /* @__PURE__ */ new WeakMap();
function D(s, e) {
  if (!s || !e.text)
    return;
  let t = null, a = null, i = null;
  const r = (c) => {
    i && (clearTimeout(i), i = null), a = setTimeout(() => {
      if (!t) {
        t = document.createElement("div"), t.className = `orca-tooltip ${e.className || ""}`;
        const T = e.shortcut ? `${e.text} (${e.shortcut})` : e.text;
        T.includes(`
`) ? t.innerHTML = T.replace(/\n/g, "<br>") : t.textContent = T, t.style.cssText = `
          position: absolute;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        `, document.body.appendChild(t);
      }
      const l = s.getBoundingClientRect();
      t.style.opacity = "1", t.style.visibility = "hidden";
      const d = t.getBoundingClientRect();
      let h = 0, u = 0, g = e.defaultPlacement || "top";
      const p = window.innerWidth, m = window.innerHeight, b = 8, y = (T) => {
        let x = 0, w = 0;
        switch (T) {
          case "top":
            x = l.left + (l.width - d.width) / 2, w = l.top - d.height - 8;
            break;
          case "bottom":
            x = l.left + (l.width - d.width) / 2, w = l.bottom + 8;
            break;
          case "left":
            x = l.left - d.width - 8, w = l.top + (l.height - d.height) / 2;
            break;
          case "right":
            x = l.right + 8, w = l.top + (l.height - d.height) / 2;
            break;
        }
        return { x, y: w };
      }, v = (T) => {
        const { x, y: w } = y(T);
        return x >= b && x + d.width <= p - b && w >= b && w + d.height <= m - b;
      };
      if (v(g)) {
        const T = y(g);
        h = T.x, u = T.y;
      } else {
        const T = g === "bottom" ? ["top", "left", "right"] : g === "top" ? ["bottom", "left", "right"] : g === "left" ? ["right", "top", "bottom"] : ["left", "top", "bottom"];
        let x = !1;
        for (const w of T)
          if (v(w)) {
            const S = y(w);
            h = S.x, u = S.y, g = w, x = !0;
            break;
          }
        if (!x) {
          const w = y(g);
          h = w.x, u = w.y;
        }
      }
      h < b ? h = b : h + d.width > p - b && (h = p - d.width - b), u < b ? u = b : u + d.height > m - b && (u = m - d.height - b), d.width > p - 2 * b && (h = b, t.style.maxWidth = `${p - 2 * b}px`), t.style.left = `${h}px`, t.style.top = `${u}px`, t.style.visibility = "visible";
    }, e.delay || 300);
  }, n = () => {
    a && (clearTimeout(a), a = null), i = setTimeout(() => {
      t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }, 0);
  };
  s.addEventListener("mouseenter", r), s.addEventListener("mouseleave", n), s.addEventListener("mousedown", n);
  const o = () => {
    a && clearTimeout(a), i && clearTimeout(i), s.removeEventListener("mouseenter", r), s.removeEventListener("mouseleave", n), s.removeEventListener("mousedown", n), t && t.parentNode && t.parentNode.removeChild(t);
  };
  be.set(s, o);
}
function Ca(s) {
  const e = be.get(s);
  e && (e(), be.delete(s));
}
function H(s, e) {
  return {
    text: s,
    shortcut: e,
    delay: 200,
    defaultPlacement: "bottom"
    // 按钮tooltip默认显示在下方
  };
}
function qe(s) {
  let e = s.title || "未命名标签页";
  const t = [];
  return s.blockId && t.push(`ID: ${s.blockId}`), s.blockType && t.push(`类型: ${s.blockType}`), s.isPinned && t.push("📌 已固定"), s.isJournal && t.push("📝 日志块"), t.length > 0 && (e += `
` + t.join(" | ")), {
    text: e,
    delay: 300,
    defaultPlacement: "bottom"
    // 标签页 tooltip 默认显示在下方
  };
}
function me(s) {
  return {
    text: s,
    delay: 500,
    defaultPlacement: "bottom"
    // 状态tooltip默认显示在下方
  };
}
function Ea() {
  document.querySelectorAll('[data-tooltip="true"]').forEach((e, t) => {
    const a = e.getAttribute("data-tooltip-text"), i = e.getAttribute("data-tooltip-shortcut"), r = e.getAttribute("data-tooltip-delay");
    if (a) {
      const n = {
        text: a,
        shortcut: i || void 0,
        delay: r ? parseInt(r) : void 0
      };
      D(e, n);
    }
  });
}
typeof window < "u" && (window.addTooltip = D, window.removeTooltip = Ca, window.createButtonTooltip = H, window.createTabTooltip = qe, window.createStatusTooltip = me);
function Sa(s, e, t = {}) {
  try {
    const {
      updateOrder: a = !0,
      saveData: i = !0,
      updateUI: r = !0
    } = t, n = e.findIndex((d) => d.blockId === s.blockId);
    if (n === -1)
      return {
        success: !1,
        message: `标签不存在: ${s.title}`
      };
    e[n].isPinned = !e[n].isPinned;
    const o = e[n].isPinned;
    a && La(e);
    const c = e.findIndex((d) => d.blockId === s.blockId), l = o ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${s.title}" 已${l}`,
      data: { tab: e[c], tabIndex: c }
    };
  } catch (a) {
    return {
      success: !1,
      message: `切换固定状态失败: ${a}`
    };
  }
}
function Pa(s, e, t, a = {}) {
  try {
    const {
      updateUI: i = !0,
      saveData: r = !0,
      validateData: n = !0
    } = a, o = t.findIndex((c) => c.blockId === s.blockId);
    if (o === -1)
      return {
        success: !1,
        message: `标签不存在: ${s.title}`
      };
    if (n) {
      const c = $a(e);
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
function Ia(s, e, t, a = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : Pa(s, { title: e.trim() }, t, a);
}
function $a(s) {
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
function La(s) {
  s.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function Ma(s) {
  for (let e = s.length - 1; e >= 0; e--)
    if (!s[e].isPinned)
      return e;
  return -1;
}
function Da(s) {
  return [...s].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function Ba(s, e, t, a) {
  return e ? {
    x: s.x,
    y: s.y,
    width: t,
    height: a
  } : {
    x: s.x,
    y: s.y,
    width: Math.min(800, window.innerWidth - s.x - 10),
    height: 28
  };
}
function Aa(s, e, t, a) {
  const i = Ba(s, e, t, a);
  let r = s.x, n = s.y;
  return i.x < 0 ? r = 0 : i.x + i.width > window.innerWidth && (r = window.innerWidth - i.width), i.y < 0 ? n = 0 : i.y + i.height > window.innerHeight && (n = window.innerHeight - i.height), { x: r, y: n };
}
function Oa(s, e, t = !1) {
  let a = null;
  const i = (...r) => {
    const n = t && !a;
    a && clearTimeout(a), a = window.setTimeout(() => {
      a = null, t || s(...r);
    }, e), n && s(...r);
  };
  return i.cancel = () => {
    a && (clearTimeout(a), a = null);
  }, i;
}
class za {
  constructor(e = {}, t = {}) {
    f(this, "observer", null);
    f(this, "config");
    f(this, "callbacks");
    f(this, "mutationQueue", []);
    f(this, "batchTimer", null);
    f(this, "lastBatchTime", 0);
    f(this, "isObserving", !1);
    f(this, "targetElement");
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
        this.log("🚨 检测到高频变化，启用冷却期"), a.forEach((i) => {
          this.handleHotMutation(i);
        });
        return;
      }
      this.config.enableBatch ? this.handleBatchMutations(a, t) : a.forEach((i) => {
        var r, n;
        (n = (r = this.callbacks).onHotMutation) == null || n.call(r, i);
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
    var a, i;
    if (this.mutationQueue.length === 0)
      return;
    const e = [...this.mutationQueue];
    this.mutationQueue = [], this.batchTimer = null, this.lastBatchTime = Date.now();
    const t = this.deduplicateMutations(e);
    (i = (a = this.callbacks).onBatchMutations) == null || i.call(a, t);
  }
  /**
   * 处理热点变化（高频变化）
   */
  handleHotMutation(e) {
    var a, i;
    const t = e.target;
    this.isCriticalChange(e, t) ? (i = (a = this.callbacks).onHotMutation) == null || i.call(a, e) : this.throttleMutation(e);
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
    return e.reverse().forEach((i) => {
      const r = i.target;
      i.type === "attributes" || `${i.type}${Array.from(i.addedNodes).map((n) => {
        var o;
        return ((o = n.textContent) == null ? void 0 : o.substring(0, 50)) || "empty";
      }).join(",")}`, t.has(r) || (t.add(r), a.push(i));
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
    B(`[OptimizedMutationObserver] ${e}`);
  }
  /**
   * 销毁观察器
   */
  destroy() {
    this.disconnect(), this.callbacks = {}, this.config = {};
  }
}
class Wa {
  constructor() {
    f(this, "layers", /* @__PURE__ */ new Map());
    f(this, "taskQueue", /* @__PURE__ */ new Map());
    f(this, "activeTimers", /* @__PURE__ */ new Map());
    f(this, "performanceMetrics");
    f(this, "taskIdCounter", 0);
    f(this, "isEnabled", !0);
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
  execute(e, t = [], a = "normal", i = {}) {
    const r = this.layers.get(a);
    if (!r)
      return He(`Unknown layer: ${a}`), e(...t);
    const n = i.id || `task_${++this.taskIdCounter}`;
    if (r.delay === 0)
      return this.updateMetrics("executed"), e(...t);
    if (this.taskQueue.get(n) && !r.cancelable && !i.forceExecute)
      return this.updateMetrics("cancelled"), Promise.resolve();
    const c = {
      id: n,
      fn: e,
      args: t,
      layer: r,
      createdAt: Date.now(),
      priority: i.priority || r.priority,
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
    const a = this.activeTimers.get(e);
    return a && (clearTimeout(a), this.activeTimers.delete(e)), this.taskQueue.delete(e), this.updateMetrics("cancelled"), !0;
  }
  /**
   * 批量执行任务
   */
  batchExecute(e, t = {}) {
    const { concurrent: a = !1, maxConcurrency: i = 3 } = t;
    return a ? this.executeConcurrent(e, i) : this.executeSequential(e);
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
        I(`Task ${t.id} execution failed:`, a);
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
      I(`Task ${e.id} execution failed:`, t);
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
    const a = new Array(e.length), i = [];
    let r = 0;
    const n = async (o, c) => {
      try {
        const l = await this.execute(
          c.fn,
          c.args || [],
          c.layer || "normal",
          { priority: c.priority || 0 }
        );
        a[o] = l;
      } catch (l) {
        I(`Task ${o} failed:`, l);
      }
    };
    for (; r < e.length; ) {
      for (; i.length < t && r < e.length; ) {
        const o = e[r], c = n(r, o);
        i.push(c), r++;
      }
      i.length > 0 && (await Promise.race(i), i.shift());
    }
    return await Promise.all(i), a;
  }
  /**
   * 顺序执行任务
   */
  async executeSequential(e) {
    const t = [];
    for (const a of e) {
      const i = await this.execute(
        a.fn,
        a.args || [],
        a.layer || "normal",
        { priority: a.priority || 0 }
      );
      t.push(i);
    }
    return t;
  }
  /**
   * 等待任务解析
   */
  waitForTaskResolution(e, t, a) {
    const i = setInterval(() => {
      this.taskQueue.has(e) || (clearInterval(i), t(Promise.resolve()));
    }, 10);
    setTimeout(() => {
      clearInterval(i), this.taskQueue.delete(e), a(new Error(`Task ${e} timeout`));
    }, 3e4);
  }
  /**
   * 更新性能指标
   */
  updateMetrics(e) {
    this.performanceMetrics.totalTasks++, e === "executed" ? this.performanceMetrics.executedTasks++ : e === "cancelled" && this.performanceMetrics.cancelledTasks++;
    const t = this.taskQueue.size;
    if (t > this.performanceMetrics.peakQueueSize && (this.performanceMetrics.peakQueueSize = t), this.performanceMetrics.totalTasks > 0) {
      const a = Array.from(this.activeTimers.values()).reduce((i, r) => i + r, 0);
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
const z = class z {
  constructor() {
    f(this, "trackedResources", /* @__PURE__ */ new Map());
    f(this, "cleanupListeners", /* @__PURE__ */ new Set());
    f(this, "autoCleanupInterval", null);
    f(this, "isEnabled", !0);
    f(this, "resourceIdCounter", 0);
    this.startAutoCleanup(), this.setupGlobalCleanup();
  }
  /**
   * 获取单例实例
   */
  static getInstance() {
    return z.instance || (z.instance = new z()), z.instance;
  }
  /**
   * 跟踪事件监听器
   */
  trackEventListener(e, t, a, i, r) {
    const n = `event_${++this.resourceIdCounter}`, o = () => {
      e.removeEventListener(t, a, i);
    }, c = {
      id: n,
      type: "eventListener",
      resource: { target: e, event: t, listener: a, options: i },
      createdAt: Date.now(),
      cleanup: o,
      description: r || `EventListener on ${e.constructor.name}.${t}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(c), n;
  }
  /**
   * 跟踪定时器
   */
  trackTimer(e, t = "timeout", a) {
    const i = `${t}_${e}`, r = () => {
      t === "timeout" ? clearTimeout(e) : clearInterval(e);
    }, n = {
      id: i,
      type: "timer",
      resource: { timerId: e, type: t },
      createdAt: Date.now(),
      cleanup: r,
      description: a || `${t.charAt(0).toUpperCase() + t.slice(1)} timer #${e}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(n), i;
  }
  /**
   * 跟踪观察者
   */
  trackObserver(e, t = "mutation", a) {
    const i = `observer_${++this.resourceIdCounter}`, r = () => {
      e.disconnect();
    }, n = {
      id: i,
      type: "observer",
      resource: e,
      createdAt: Date.now(),
      cleanup: r,
      description: a || `${t.charAt(0).toUpperCase() + t.slice(1)}Observer`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(n), i;
  }
  /**
   * 跟踪动画帧
   */
  trackAnimationFrame(e, t) {
    const a = `raf_${e}`, i = () => {
      cancelAnimationFrame(e);
    }, r = {
      id: a,
      type: "animationFrame",
      resource: { frameId: e },
      createdAt: Date.now(),
      cleanup: i,
      description: t || `AnimationFrame #${e}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(r), a;
  }
  /**
   * 跟踪Promise
   */
  trackPromise(e, t) {
    const a = `promise_${++this.resourceIdCounter}`, i = () => {
      e.catch(() => {
      });
    }, r = {
      id: a,
      type: "promise",
      resource: e,
      createdAt: Date.now(),
      cleanup: i,
      description: t || `Promise #${a}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(r), Promise.allSettled([e]).finally(() => {
      this.cleanupResource(a);
    }), a;
  }
  /**
   * 跟踪自定义资源
   */
  trackCustomResource(e, t, a) {
    const i = `custom_${++this.resourceIdCounter}`, r = {
      id: i,
      type: "custom",
      resource: e,
      createdAt: Date.now(),
      cleanup: t,
      description: a || `Custom resource #${i}`,
      stack: this.getStackTrace(),
      destroyed: !1
    };
    return this.trackResource(r), i;
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
          } catch (i) {
            I("Batch cleanup error:", i);
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
      return I(`Cleanup failed for resource ${e}:`, a), !1;
    } finally {
      this.trackedResources.delete(e);
    }
  }
  /**
   * 清理指定类型的所有资源
   */
  cleanupResourcesByType(e) {
    let t = 0;
    return this.trackedResources.forEach((a, i) => {
      a.type === e && !a.destroyed && this.cleanupResource(i) && t++;
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
        } catch (i) {
          I(`Cleanup failed for resource ${a.id}:`, i);
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
    return this.trackedResources.forEach((i) => {
      if (i.destroyed)
        a++;
      else {
        const r = e.get(i.type) || 0;
        e.set(i.type, r + 1), (!t || i.createdAt < t.createdAt) && (t = i);
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
    e.resourcesByType.forEach((r, n) => {
      const c = {
        eventListener: 50,
        timer: 20,
        observer: 10,
        animationFrame: 50,
        promise: 30,
        custom: 100
      }[n] || 10;
      r > c && t.push({
        type: n,
        count: r,
        description: `Too many ${n}s detected: ${r} (threshold: ${c})`
      });
    });
    const a = Date.now(), i = 3e5;
    return this.trackedResources.forEach((r, n) => {
      !r.destroyed && a - r.createdAt > i && t.push({
        type: "timeout",
        count: 1,
        description: `Long-running resource: ${r.description || n} (age: ${Math.round((a - r.createdAt) / 1e3)}s)`
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
    return e.resourcesByType.forEach((i, r) => {
      a += `
- ${r}: ${i}`;
    }), t.length > 0 && (a += `

Potential Leaks:`, t.forEach((i) => {
      a += `
- ${i.description}`;
    })), e.oldestResource && (a += `

Oldest Resource: ${e.oldestResource.description}`, a += `
Age: ${Math.round((Date.now() - e.oldestResource.createdAt) / 1e3)}s`), a;
  }
  /**
   * 销毁保护器
   */
  destroy() {
    this.cleanupAllResources(), this.autoCleanupInterval && (clearInterval(this.autoCleanupInterval), this.autoCleanupInterval = null), this.cleanupListeners.clear(), this.isEnabled = !1, z.instance = null;
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
        I("Cleanup listener error:", a);
      }
    });
  }
  performAutoCleanup() {
    const e = this.detectMemoryLeaks();
    e.length > 0 && (this.log("🧹 Performing auto-cleanup due to potential leaks"), e.forEach((t) => {
      if (t.type === "timeout") {
        const a = Date.now();
        this.trackedResources.forEach((i, r) => {
          !i.destroyed && a - i.createdAt > 3e5 && this.cleanupResource(r);
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
    B(`[MemoryLeakProtector] ${e}`, ...t);
  }
};
f(z, "instance");
let fe = z;
class Na {
  constructor(e = {}) {
    f(this, "modules", /* @__PURE__ */ new Map());
    f(this, "config");
    f(this, "loadingQueue", []);
    f(this, "activeLoaders", 0);
    f(this, "observers", /* @__PURE__ */ new Map());
    f(this, "idleCallbackId", null);
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
    const i = {
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
    this.modules.set(e, i), a.autoLoad !== !1 && i.priority >= 8 && this.loadModule(e).catch((r) => {
      I(`Auto-loading module ${e} failed:`, r);
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
      return new Promise((a, i) => {
        const r = () => {
          t.loaded && t.instance ? a(t.instance) : !t.loading && t.failureCount > this.config.maxRetries ? i(new Error(`Module ${e} failed to load after ${this.config.maxRetries} retries`)) : setTimeout(r, 100);
        };
        r();
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
    const t = e.filter((r) => {
      const n = this.modules.get(r);
      return n && !n.loaded;
    });
    if (t.length === 0)
      return [];
    t.sort((r, n) => {
      const o = this.modules.get(r);
      return this.modules.get(n).priority - o.priority;
    });
    const a = [], i = [];
    for (const r of t) {
      i.length >= this.config.maxConcurrency && await Promise.race(i);
      const n = this.loadModule(r);
      i.push(n), a.push(n);
    }
    return Promise.all(a);
  }
  /**
   * 预加载模块
   */
  async preloadModules(e) {
    const t = e.filter((a) => {
      const i = this.modules.get(a);
      return i && !i.loaded && !i.loading;
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
    const e = Array.from(this.modules.values()), t = e.length, a = e.filter((n) => n.loaded).length, i = e.filter((n) => n.loading).length, r = e.filter((n) => n.failureCount > this.config.maxRetries).length;
    return {
      total: t,
      loaded: a,
      loading: i,
      failed: r,
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
      const i = this.getModuleStatus(a);
      ["loaded"].includes(i) || await this.loadModule(a);
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
      const a = (i) => {
        i.timeRemaining() > 0 || i.didTimeout ? this.loadModule(e).then(t) : requestIdleCallback(a);
      };
      requestIdleCallback(a);
    });
  }
  async loadOnVisible(e) {
    return new Promise((t) => {
      const a = new IntersectionObserver(
        (i) => {
          i.forEach((r) => {
            r.isIntersecting && (a.disconnect(), this.loadModule(e).then(t));
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
          (a, i) => setTimeout(() => i(new Error(`Module ${e.id} timeout`)), e.timeout)
        )
      ]);
      return e.loaded = !0, e.loading = !1, e.instance = t, e.lastLoadTime = Date.now(), e.failureCount = 0, t;
    } catch (t) {
      if (e.loading = !1, e.failureCount <= this.config.maxRetries) {
        const a = Math.min(1e3 * Math.pow(2, e.failureCount - 1), 1e4);
        return await new Promise((i) => setTimeout(i, a)), this.executeLoad(e);
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
            const i = Array.from(this.modules.keys()).filter((r) => {
              const n = this.modules.get(r);
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
class Ra {
  constructor(e = {}) {
    f(this, "queue", []);
    f(this, "config");
    f(this, "isProcessing", !1);
    f(this, "processingTimer", null);
    f(this, "operationIdCounter", 0);
    f(this, "metrics");
    f(this, "processingStartTime", 0);
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
    const i = {
      id: `op_${++this.operationIdCounter}`,
      type: e,
      data: t,
      priority: a.priority || 5,
      async: a.async || !1,
      timestamp: Date.now(),
      callback: a.callback
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
          I(`Clear callback error for operation ${e.id}:`, t);
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
    this.isProcessing = !0, this.processingStartTime = performance.now(), this.config.enablePriorityQueue && this.queue.sort((i, r) => r.priority - i.priority);
    const e = Math.min(this.queue.length, this.config.maxBatchSize), t = this.queue.splice(0, e), a = this.groupOperations(t);
    for (const [i, r] of a)
      await this.processOperationGroup(i, r);
    this.updateMetrics(e), this.isProcessing = !1;
  }
  groupOperations(e) {
    const t = /* @__PURE__ */ new Map();
    return e.forEach((a) => {
      const i = t.get(a.type) || [];
      i.push(a), t.set(a.type, i);
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
      I(`Processing ${e} operations failed:`, a), t.forEach((i) => {
        if (i.callback)
          try {
            i.callback(a);
          } catch (r) {
            I(`Callback error for operation ${i.id}:`, r);
          }
      });
    }
  }
  async processDOMOperations(e) {
    const t = document.createDocumentFragment(), a = [];
    e.forEach((i) => {
      switch (i.type) {
        case "appendChild":
          a.push(() => {
            const r = i.data;
            r instanceof HTMLElement && t.appendChild(r);
          });
          break;
        case "removeChild":
          a.push(() => {
            const r = i.data;
            r && r.parentNode && r.parentNode.removeChild(r);
          });
          break;
        case "setAttribute":
          a.push(() => {
            const { element: r, name: n, value: o } = i.data;
            r && r.setAttribute && r.setAttribute(n, o);
          });
          break;
        case "setStyle":
          a.push(() => {
            const { element: r, styles: n } = i.data;
            r && r.style && Object.assign(r.style, n);
          });
          break;
      }
    }), await new Promise((i) => {
      requestAnimationFrame(() => {
        a.forEach((r) => r()), t.hasChildNodes() && (document.querySelector(".orca-tab-container") || document.body).appendChild(t), e.forEach((r) => {
          r.callback && r.callback(!0);
        }), i();
      });
    });
  }
  async processCSSOperations(e) {
    const t = /* @__PURE__ */ new Map();
    e.forEach((a) => {
      const { selector: i, styles: r } = a.data;
      i && r && t.set(i, r);
    }), t.size > 0 && await new Promise((a) => {
      requestAnimationFrame(() => {
        t.forEach((i, r) => {
          const n = document.querySelector(r);
          n instanceof HTMLElement && Object.assign(n.style, i);
        }), e.forEach((i) => {
          i.callback && i.callback(!0);
        }), a();
      });
    });
  }
  async processAnimationOperations(e) {
    const t = [];
    e.forEach((a) => {
      const { element: i, keyframes: r, options: n } = a.data;
      if (i && r && n)
        try {
          const o = i.animate(r, n);
          t.push(o);
        } catch (o) {
          I("Animation creation failed:", o);
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
        const { target: i, method: r, params: n } = a.data;
        if (i && r)
          try {
            const o = await i[r](...n);
            a.callback && a.callback(o);
          } catch (o) {
            a.callback && a.callback(o);
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
        t.forEach((i) => {
          try {
            i();
          } catch (r) {
            I("Generic operation failed:", r);
          }
        }), e.forEach((i) => {
          i.callback && i.callback(!0);
        }), a();
      });
    });
  }
  updateMetrics(e) {
    const t = performance.now() - this.processingStartTime;
    this.metrics.totalOperations += e;
    const a = this.metrics.averageProcessingTime * (this.metrics.totalOperations - e) + t;
    this.metrics.averageProcessingTime = a / this.metrics.totalOperations;
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
const W = class W {
  constructor() {
    f(this, "metrics", /* @__PURE__ */ new Map());
    f(this, "thresholds", /* @__PURE__ */ new Map());
    f(this, "config");
    f(this, "isMonitoring", !1);
    f(this, "intervalId", null);
    f(this, "observers", /* @__PURE__ */ new Map());
    f(this, "reportCallbacks", /* @__PURE__ */ new Set());
    f(this, "performanceEntries", []);
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
    return W.instance || (W.instance = new W()), W.instance;
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
  recordMetric(e, t, a = "", i = "custom") {
    const r = this.thresholds.get(e), n = r ? t <= r.error : !0, o = {
      name: e,
      value: t,
      unit: a,
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
      const i = Date.now() - t;
      return a.filter((r) => r.timestamp >= i);
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
    const e = `report_${Date.now()}`, t = this.calculateHealthScore(), a = this.analyzeIssues(), i = this.analyzeTrends(), r = this.generateRecommendations(), n = {
      id: e,
      timestamp: Date.now(),
      healthScore: t,
      issues: a,
      metrics: this.getAllCurrentMetrics(),
      trends: i,
      recommendations: r
    };
    return this.reportCallbacks.forEach((o) => {
      try {
        o(n);
      } catch (c) {
        I("Performance report callback error:", c);
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
  setThreshold(e, t, a, i) {
    this.thresholds.set(e, {
      name: e,
      warning: t,
      error: a,
      recommended: i || Math.min(t, a) * 0.5
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
      const i = t.filter((r) => r.timestamp >= e);
      this.metrics.set(a, i);
    }), this.performanceEntries = this.performanceEntries.filter((t) => t.startTime >= e);
  }
  addMetric(e) {
    const t = this.metrics.get(e.name) || [];
    t.push(e);
    const a = Date.now() - this.config.historyRetention, i = t.filter((r) => r.timestamp >= a);
    this.metrics.set(e.name, i);
  }
  collectMetrics() {
    this.recordMemoryUsage(), this.recordRenderPerformance(), this.recordFPS(), this.recordDOMMetrics();
  }
  recordFPS() {
    let e = performance.now(), t = 0;
    const a = () => {
      t++;
      const i = performance.now();
      if (i - e >= 1e3) {
        const r = Math.round(t * 1e3 / (i - e));
        this.recordMetric("fps", r, "fps"), t = 0, e = i;
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
    return e.forEach((i) => {
      const r = this.thresholds.get(i.name);
      r && (a++, i.value <= r.recommended ? t += 100 : i.value <= r.error ? t += Math.max(0, 100 - (i.value - r.recommended) / r.recommended * 50) : t += Math.max(0, 50 - (i.value - r.error) / r.error * 40));
    }), a > 0 ? Math.round(t / a) : 100;
  }
  analyzeIssues() {
    const e = [];
    return this.thresholds.forEach((t, a) => {
      const i = this.getLatestMetric(a);
      i && (i.value > t.error ? e.push({
        type: "error",
        message: `${a} 严重超标: ${i.value}${i.unit}`,
        metric: a,
        impact: "critical",
        recommendation: `需要立即优化 ${a}，建议值: ${t.recommended}${i.unit}`
      }) : i.value > t.warning && e.push({
        type: "warning",
        message: `${a} 接近警告阈值: ${i.value}${i.unit}`,
        metric: a,
        impact: "medium",
        recommendation: `优化 ${a}，目标: ${t.recommended}${i.unit}`
      }));
    }), e;
  }
  analyzeTrends() {
    const e = [];
    return this.metrics.forEach((t, a) => {
      if (t.length < 2) return;
      const i = t.slice(-5), r = t.slice(-10, -5);
      if (i.length > 0 && r.length > 0) {
        const n = i.reduce((d, h) => d + h.value, 0) / i.length, o = r.reduce((d, h) => d + h.value, 0) / r.length, c = o > 0 ? (n - o) / o * 100 : 0;
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
    this.stopMonitoring(), this.observers.forEach((e) => e.disconnect()), this.observers.clear(), this.reportCallbacks.clear(), this.metrics.clear(), this.thresholds.clear(), W.instance = null;
  }
};
f(W, "instance");
let ee = W;
const F = class F {
  constructor() {
    f(this, "mutationObserver", null);
    f(this, "debounceOptimizer", null);
    f(this, "memoryLeakProtector", null);
    f(this, "lazyLoadingOptimizer", null);
    f(this, "batchProcessor", null);
    f(this, "performanceMonitor", null);
    f(this, "config");
    f(this, "isInitialized", !1);
    f(this, "initializationPromise", null);
    this.config = this.getDefaultConfig();
  }
  /**
   * 获取单例实例
   */
  static getInstance() {
    return F.instance || (F.instance = new F()), F.instance;
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
      e && this.applyConfig(e), this.config.mutationObserver && (this.mutationObserver = new za(
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
      )), this.config.debounce.length > 0 && (this.debounceOptimizer = new Wa(), this.config.debounce.forEach((t) => {
        this.debounceOptimizer.addLayer(t.name, t);
      })), this.config.memoryLeak.enableAutoCleanup && (this.memoryLeakProtector = fe.getInstance(), this.memoryLeakProtector.setAutoCleanup(!0, this.config.memoryLeak.autoCleanupInterval)), this.config.lazyLoading && (this.lazyLoadingOptimizer = new Na(this.config.lazyLoading)), this.config.batchProcessing && (this.batchProcessor = new Ra(this.config.batchProcessing)), this.config.performanceMonitoring.enableMonitoring && (this.performanceMonitor = ee.getInstance(), this.performanceMonitor.updateConfig({
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
  trackEventListener(e, t, a, i) {
    return this.memoryLeakProtector ? this.memoryLeakProtector.trackEventListener(e, t, a, i) : (e.addEventListener(t, a, i), null);
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
  recordMetric(e, t, a, i) {
    this.performanceMonitor && this.performanceMonitor.recordMetric(e, t, a, i);
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
    }, t = Object.values(e).some((r) => r), a = this.determineHealthStatus(), i = this.generateOptimizationSuggestions();
    return {
      enabled: t,
      components: e,
      health: a,
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
    const e = this.getOptimizationStatus(), t = this.getPerformanceReport(), a = this.getMemoryStats();
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
${e.suggestions.map((r) => `  - ${r}`).join(`
`)}
`;
    return t && (i += `
性能指标:
  健康分数: ${t.healthScore}/ 100
  当前问题数: ${t.issues.length}
`), a && (i += `
内存统计:
  跟踪资源: ${a.totalResources}
  内存使用: ${Math.round(a.memoryUsage / 1024 / 1024 * 100) / 100} MB
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
    return t.components.mutationObserver || e.push("启用MutationObserver优化以减少DOM监听开销"), t.components.debounceOptimizer || e.push("启用防抖优化器以处理高频操作"), t.components.memoryLeakProtection || e.push("启用内存泄漏保护以防止内存泄露"), t.components.lazyLoading || e.push("启用懒加载以延迟非关键功能"), t.components.batchProcessing || e.push("启用批量处理以优化DOM操作"), t.components.performanceMonitoring || e.push("启用性能监控以实时追踪性能指标"), a && a.recommendations.forEach((i) => {
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
    B(`[PerformanceOptimizerManager] ${e}`, ...t);
  }
};
f(F, "instance");
let ve = F;
function Fa(s, e, t) {
  var a, i;
  try {
    const r = s.startsWith("#") ? s : `#${s}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(r))
      return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const n = parseInt(r.slice(1, 3), 16), o = parseInt(r.slice(3, 5), 16), c = parseInt(r.slice(5, 7), 16), l = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((i = (a = window.orca) == null ? void 0 : a.state) == null ? void 0 : i.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${n}, ${o}, ${c}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${n}, ${o}, ${c}) calc(l * 1.05) c h)` : `oklch(from rgb(${n}, ${o}, ${c}) calc(l * 0.6) c h)`;
  } catch {
    return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
function $e(s, e, t, a) {
  if (typeof e == "number" && typeof t == "function")
    return Ua(s, e, t, a);
  if (typeof e == "function" && typeof t == "function")
    return _a(s, e, t);
  throw new Error("Invalid parameters for createWidthAdjustmentDialog");
}
function Ua(s, e, t, a) {
  const i = document.createElement("div");
  i.className = "width-adjustment-dialog";
  const r = Ue();
  i.style.cssText = r;
  const n = document.createElement("div");
  n.className = "dialog-title", n.textContent = "调整标签宽度", i.appendChild(n);
  const o = document.createElement("div");
  o.className = "dialog-slider-container", o.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const c = document.createElement("div");
  c.textContent = "最大宽度 (80px - 200px)", c.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
  `;
  const l = document.createElement("input");
  l.type = "range", l.min = "80", l.max = "200", l.value = s.toString(), l.style.cssText = ge();
  const d = document.createElement("div");
  d.className = "dialog-width-display", d.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, d.textContent = `最大宽度: ${s}px`;
  const h = document.createElement("div");
  h.className = "dialog-slider-container", h.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const u = document.createElement("div");
  u.textContent = "最小宽度 (60px - 150px)", u.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
  `;
  const g = document.createElement("input");
  g.type = "range", g.min = "60", g.max = "150", g.value = e.toString(), g.style.cssText = ge();
  const p = document.createElement("div");
  p.className = "dialog-width-display", p.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, p.textContent = `最小宽度: ${e}px`;
  let m = null;
  const b = (x, w) => {
    m && clearTimeout(m), m = window.setTimeout(() => {
      t(x, w), m = null;
    }, 150);
  };
  l.oninput = () => {
    const x = parseInt(l.value), w = parseInt(g.value);
    x < w && (g.value = x.toString(), p.textContent = `最小宽度: ${x}px`), d.textContent = `最大宽度: ${x}px`;
    const S = parseInt(l.value), C = parseInt(g.value);
    b(S, C);
  }, g.oninput = () => {
    const x = parseInt(l.value), w = parseInt(g.value);
    w > x && (l.value = w.toString(), d.textContent = `最大宽度: ${w}px`), p.textContent = `最小宽度: ${w}px`;
    const S = parseInt(l.value), C = parseInt(g.value);
    b(S, C);
  }, o.appendChild(c), o.appendChild(l), o.appendChild(d), h.appendChild(u), h.appendChild(g), h.appendChild(p), i.appendChild(o), i.appendChild(h);
  const y = document.createElement("div");
  y.className = "dialog-buttons", y.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const v = document.createElement("button");
  v.className = "btn btn-primary", v.textContent = "确定", v.style.cssText = re(), v.onclick = () => {
    const x = parseInt(l.value), w = parseInt(g.value);
    t(x, w), ne(i);
  };
  const T = document.createElement("button");
  return T.className = "btn btn-secondary", T.textContent = "取消", T.style.cssText = re(), T.onclick = () => {
    a && a(), ne(i);
  }, y.appendChild(v), y.appendChild(T), i.appendChild(y), i;
}
function _a(s, e, t) {
  const a = document.createElement("div");
  a.className = "width-adjustment-dialog";
  const i = Ue();
  a.style.cssText = i;
  const r = document.createElement("div");
  r.className = "dialog-title", r.textContent = "调整面板宽度", a.appendChild(r);
  const n = document.createElement("div");
  n.className = "dialog-slider-container", n.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const o = document.createElement("input");
  o.type = "range", o.min = "120", o.max = "800", o.value = s.toString(), o.style.cssText = ge();
  const c = document.createElement("div");
  c.className = "dialog-width-display", c.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, c.textContent = `当前宽度: ${s}px`, o.oninput = () => {
    const u = parseInt(o.value);
    c.textContent = `当前宽度: ${u}px`, e(u);
  }, n.appendChild(o), n.appendChild(c), a.appendChild(n);
  const l = document.createElement("div");
  l.className = "dialog-buttons", l.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = re(), d.onclick = () => ne(a);
  const h = document.createElement("button");
  return h.className = "btn btn-secondary", h.textContent = "取消", h.style.cssText = re(), h.onclick = () => {
    t(), ne(a);
  }, l.appendChild(d), l.appendChild(h), a.appendChild(l), a;
}
function ne(s) {
  s && s.parentNode && s.parentNode.removeChild(s);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function Ha() {
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
function qa(s, e) {
  return s.length !== e.length ? !0 : !s.every((t, a) => t === e[a]);
}
let J;
class Va {
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(e) {
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
    f(this, "storageService", new Ge());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    f(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    f(this, "lastPanelCheckTime", 0);
    /** 上次面板块检查时间 - 用于防抖 checkCurrentPanelBlocks 调用 */
    f(this, "lastBlockCheckTime", 0);
    /** 数据保存防抖定时器 - 用于合并频繁的保存操作 */
    f(this, "saveDataDebounceTimer", null);
    /** 数据保存防抖延迟（毫秒） - 默认300ms内的多次保存操作会被合并 */
    f(this, "SAVE_DEBOUNCE_DELAY", 300);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 当前日志级别 */
    f(this, "currentLogLevel", _e);
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
    /** 是否正在切换标签 - 防止在标签切换过程中错误替换标签 */
    f(this, "isSwitchingTab", !1);
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
    /** 焦点同步定时器 - 控制自动同步焦点的轮询逻辑 */
    f(this, "focusSyncInterval", null);
    /** 上一次焦点检测的状态 - 用于避免重复调用 checkCurrentPanelBlocks */
    f(this, "lastFocusState", null);
    /** 面板块检测任务 - 防止 checkCurrentPanelBlocks 并发执行 */
    f(this, "panelBlockCheckTask", null);
    /** 面板状态检测任务 - 防止 checkPanelStatusChange 并发执行 */
    f(this, "panelStatusCheckTask", null);
    /** 正在创建的标签 - 防止重复创建同一个标签 */
    f(this, "creatingTabs", /* @__PURE__ */ new Set());
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
    /** 水平布局标签最大宽度 - 水平布局下标签的最大宽度 */
    f(this, "horizontalTabMaxWidth", 130);
    /** 水平布局标签最小宽度 - 水平布局下标签的最小宽度 */
    f(this, "horizontalTabMinWidth", 80);
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
    /** 是否在刷新后恢复聚焦标签页 - 控制软件刷新后是否自动聚焦并打开当前聚焦的标签页 */
    f(this, "restoreFocusedTab", !0);
    /** 新标签是否添加到末尾（一次性标志，使用后自动重置为false） */
    f(this, "addNewTabToEnd", !0);
    /** 是否启用中键固定标签页功能 - 控制中键点击是否固定标签页 */
    f(this, "enableMiddleClickPin", !1);
    /** 是否启用双击关闭标签页功能 - 控制双击是否关闭标签页 */
    f(this, "enableDoubleClickClose", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 性能优化 - Performance Optimization */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 性能优化管理器 ====================
    /** 性能优化管理器 - 统一管理所有性能优化工具 */
    f(this, "performanceOptimizer", null);
    /** MutationObserver优化器实例 - 用于优化DOM变化监听 */
    f(this, "optimizedObserver", null);
    /** 高级防抖优化器实例 - 用于任务防抖和调度 */
    f(this, "debounceOptimizer", null);
    /** 内存泄漏防护器实例 - 用于跟踪和清理资源 */
    f(this, "memoryLeakProtector", null);
    /** 批量处理器实例 - 用于批量DOM操作 */
    f(this, "batchProcessor", null);
    /** 性能监控器实例 - 用于监控性能指标 */
    f(this, "performanceMonitor", null);
    /** 性能指标计数缓存 - 记录自定义指标的累计值 */
    f(this, "performanceCounters", {});
    /** 性能基线定时器ID - 控制基线采集任务 */
    f(this, "performanceBaselineTimer", null);
    /** 最近一次性能基线场景 */
    f(this, "lastBaselineScenario", null);
    /** 最近一次性能基线报告 */
    f(this, "lastBaselineReport", null);
    /** 上一次插件初始化耗时（毫秒） */
    f(this, "lastInitDurationMs", null);
    /** 性能指标名称常量 */
    f(this, "performanceMetricKeys", {
      initTotal: "plugin_init_total",
      tabInteraction: "tab_interaction_total",
      domMutations: "dom_mutations"
    });
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
    /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
    f(this, "dropIndicator", null);
    /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
    f(this, "dragOverTab", null);
    /** 上次交换的目标标签和位置 - 防止重复交换 */
    f(this, "lastSwapKey", "");
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
    /** 进入工作区之前的标签页组 - 用于退出工作区时恢复到原始标签页组 */
    f(this, "tabsBeforeWorkspace", null);
    /** 是否需要在初始化后恢复标签页组 - 用于处理在工作区状态下关闭软件的情况 */
    f(this, "shouldRestoreTabsBeforeWorkspace", !1);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    f(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    f(this, "lastActiveBlockId", null);
    /** 是否正在导航中 - 用于避免导航时触发重复的聚焦检测 */
    f(this, "isNavigating", !1);
    // ==================== 快捷键相关 ====================
    /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
    f(this, "hoveredBlockId", null);
    // 防抖函数实例（仅用于拖拽等非关键场景）
    f(this, "draggingDebounce", Oa(async () => {
      await this.updateTabsUI();
    }, 200));
    this.pluginName = e, this.initializePerformanceOptimizers();
  }
  /** 简单的日志方法 */
  log(e, ...t) {
    this.currentLogLevel >= $.INFO && he(e, ...t);
  }
  logError(e, ...t) {
    this.currentLogLevel >= $.ERROR && I(e, ...t);
  }
  logWarn(e, ...t) {
    this.currentLogLevel >= $.WARN && He(e, ...t);
  }
  /**
   * 初始化性能优化器
   */
  initializePerformanceOptimizers() {
    try {
      this.log("🚀 初始化性能优化器..."), this.performanceOptimizer = ve.getInstance(), this.performanceMonitor = ee.getInstance(), this.log("✅ 性能优化器初始化完成");
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
      return this.performanceMonitor = ee.getInstance(), this.performanceMonitor;
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
    var i, r;
    typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null;
    const t = ((i = this.performanceOptimizer) == null ? void 0 : i.getPerformanceReport()) ?? ((r = this.ensurePerformanceMonitorInstance()) == null ? void 0 : r.generateReport());
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
    const a = this.getLatestMetricMap(e.metrics), i = a.get(this.performanceMetricKeys.initTotal), r = a.get(this.performanceMetricKeys.tabInteraction), n = a.get(this.performanceMetricKeys.domMutations), o = a.get("fps"), c = a.get("memory_heap"), l = i ? `${i.value.toFixed(1)}${i.unit}` : this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : "n/a", d = r ? `${r.value.toFixed(0)}` : `${this.performanceCounters[this.performanceMetricKeys.tabInteraction] ?? 0}`, h = n ? `${n.value.toFixed(0)}` : "0", u = o ? `${o.value.toFixed(0)}fps` : "n/a", g = c ? this.formatBytes(c.value) : "n/a";
    return [
      `[Performance][${t}] Baseline`,
      `  healthScore: ${e.healthScore}`,
      `  init_total: ${l}`,
      `  tab_interactions: ${d}`,
      `  dom_mutations: ${h}`,
      `  fps: ${u}`,
      `  heap_used: ${g}`,
      `  issues: ${e.issues.length}`
    ].join(`
`);
  }
  getLatestMetricMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const a of e) {
      const i = t.get(a.name);
      (!i || i.timestamp <= a.timestamp) && t.set(a.name, a);
    }
    return t;
  }
  formatBytes(e) {
    return e < 1024 ? `${e.toFixed(0)}B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)}KB` : e < 1024 * 1024 * 1024 ? `${(e / 1024 / 1024).toFixed(1)}MB` : `${(e / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }
  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  debugLog(...e) {
    this.currentLogLevel >= $.DEBUG && he(e.join(" "), ...e);
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...e) {
    this.currentLogLevel >= $.VERBOSE && he(e.join(" "), ...e);
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
    this.currentLogLevel = e, U.setLogLevel(e), this.log(`📊 日志级别已设置为: ${$[e]}`);
  }
  /**
   * 从存储中恢复调试模式设置
   */
  async restoreDebugMode() {
    try {
      await this.storageService.getConfig(k.DEBUG_MODE, this.pluginName) && this.setLogLevel($.VERBOSE);
    } catch {
    }
  }
  /**
   * 恢复聚焦标签页恢复设置
   */
  async restoreRestoreFocusedTabSetting() {
    try {
      const e = await this.storageService.getConfig(k.RESTORE_FOCUSED_TAB, this.pluginName);
      e != null && (this.restoreFocusedTab = e);
    } catch {
    }
  }
  /**
   * 恢复功能开关设置
   */
  async restoreFeatureToggleSettings() {
    try {
      const e = await this.storageService.getConfig(k.ENABLE_MIDDLE_CLICK_PIN, this.pluginName), t = await this.storageService.getConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, this.pluginName), a = e ?? t;
      a != null && (this.enableMiddleClickPin = a, this.enableDoubleClickClose = a), this.log(`🔧 功能开关设置已恢复: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`);
    } catch (e) {
      this.log("⚠️ 恢复功能开关设置失败:", e);
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
    await this.restoreDebugMode(), await this.restoreRestoreFocusedTabSetting(), await this.restoreFeatureToggleSettings();
    const e = this.startPerformanceMeasurement(this.performanceMetricKeys.initTotal);
    Ha(), this.tabStorageService = new Je(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[Le.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.loadWorkspaces();
    const [
      t,
      a,
      i,
      r
    ] = await Promise.all([
      this.restorePosition(),
      this.restoreLayoutMode(),
      this.restoreFixedToTopMode(),
      this.restoreFloatingWindowVisibility()
    ]);
    this.registerHeadbarButton(), await this.discoverPanels();
    const n = this.getFirstPanel();
    if (n ? this.log(`🎯 初始化第1个面板（持久化面板）: ${n}`) : this.log("⚠️ 初始化时没有发现面板"), this.shouldRestoreTabsBeforeWorkspace && this.tabsBeforeWorkspace)
      this.log("🔄 检测到保存的标签页组，直接恢复而不加载普通标签页"), this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = [...this.tabsBeforeWorkspace], this.shouldRestoreTabsBeforeWorkspace = !1, this.tabsBeforeWorkspace = null, await this.tabStorageService.clearTabsBeforeWorkspace(), this.log("✅ 已直接恢复到进入工作区前的标签页组");
    else {
      const [
        l,
        d,
        h,
        u
      ] = await Promise.all([
        this.tabStorageService.restoreFirstPanelTabs(),
        this.tabStorageService.restoreClosedTabs(),
        this.tabStorageService.restoreRecentlyClosedTabs(),
        this.tabStorageService.restoreSavedTabSets()
      ]);
      this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = l, this.closedTabs = d, this.recentlyClosedTabs = h, this.savedTabSets = u, await this.updateRestoredTabsBlockTypes();
    }
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && requestIdleCallback(() => {
      this.storageService.testConfigSerialization();
    }, { timeout: 2e3 });
    const o = document.querySelector(".orca-panel.active"), c = o == null ? void 0 : o.getAttribute("data-panel-id");
    if (c && !c.startsWith("_") && (this.currentPanelId = c, this.currentPanelIndex = this.getPanelIds().indexOf(c), this.log(`🎯 当前活动面板: ${c} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1 && requestIdleCallback(async () => {
      this.log("📂 延迟加载其他面板的标签页数据");
      for (let l = 1; l < this.panelOrder.length; l++) {
        const d = `panel_${l + 1}_tabs`;
        try {
          const h = await this.storageService.getConfig(d, this.pluginName, []);
          this.log(`📂 从存储获取到第 ${l + 1} 个面板的数据: ${h ? h.length : 0} 个标签页`), h && h.length > 0 ? (this.panelTabsData[l] = [...h], this.log(`✅ 成功加载第 ${l + 1} 个面板的标签页数据: ${h.length} 个`)) : (this.panelTabsData[l] = [], this.log(`📂 第 ${l + 1} 个面板没有保存的数据`));
        } catch (h) {
          this.warn(`❌ 加载第 ${l + 1} 个面板数据失败:`, h), this.panelTabsData[l] = [];
        }
      }
    }, { timeout: 1e3 }), c && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${c} 的标签页`), await this.scanCurrentPanelTabs();
    else if (c && this.currentPanelIndex === 0)
      if (this.log("📋 当前活动面板是第一个面板，使用持久化数据"), this.restoreFocusedTab) {
        const l = document.querySelector(".orca-panel.active");
        if (l) {
          const d = l.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (d) {
            const h = d.getAttribute("data-block-id");
            h && (this.getCurrentPanelTabs().find((p) => p.blockId === h) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${h}`), await this.checkCurrentPanelBlocks()));
          }
        }
      } else
        this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过当前聚焦页面的恢复');
    this.restoreFocusedTab ? await this.autoDetectAndSyncCurrentFocus() : this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过自动检测聚焦页面'), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.initializeOptimizedDOMObserver(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), setTimeout(() => {
      try {
        Ea(), this.initializeHeadbarUserToolsTooltips(), this.log("✅ Tooltips 初始化完成");
      } catch (l) {
        this.log("⚠️ Tooltips 初始化失败:", l);
      }
    }, 1e3), this.setupSettingsChecker(), e && (this.lastInitDurationMs = e()), this.schedulePerformanceBaselineReport("startup"), this.isInitialized = !0, this.log("✅ 插件初始化完成"), requestIdleCallback(async () => {
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
          }), this.log("✅ 性能优化管理器延迟初始化完成");
        } catch (l) {
          this.error("❌ 性能优化管理器延迟初始化失败:", l);
        }
    }, { timeout: 2e3 });
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
      if (this.isNavigating) {
        this.log("⏭️ 正在导航中，跳过自动检测当前聚焦页面");
        return;
      }
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
      const i = e.querySelectorAll('.orca-hideable:not([style*="display: none"])');
      let r = null;
      for (const d of i) {
        if (this.isInsidePopup(d))
          continue;
        const h = d.querySelector(".orca-block-editor[data-block-id]");
        if (h) {
          r = h;
          break;
        }
      }
      if (!r) {
        this.log(`⚠️ 激活面板 ${t} 中没有找到可见的块编辑器，跳过自动检测`);
        return;
      }
      const n = r.getAttribute("data-block-id");
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
        const d = o.length - 1, h = o[d];
        o[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${h.title}" -> "${l.title}"`);
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
    const e = (r) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", r), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", e), this.log("主题变化监听器注册成功");
    } catch (r) {
      this.error("主题变化监听器注册失败:", r);
    }
    let t = orca.state.themeMode;
    const i = setInterval(() => {
      const r = orca.state.themeMode;
      r !== t && (this.log("备用检测：主题从", t, "切换到", r), t = r, setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 200));
    }, 500);
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", e), clearInterval(i);
    };
  }
  /**
   * 为用户工具栏按钮添加 tooltip
   * 使用与标签页标题相同的 tooltip 风格
   */
  initializeHeadbarUserToolsTooltips() {
    try {
      const e = document.querySelector(".orca-headbar-user-tools");
      if (!e) {
        this.log("⚠️ 未找到用户工具栏容器 (.orca-headbar-user-tools)");
        return;
      }
      const t = e.querySelectorAll('button, [role="button"]');
      this.log(`📌 找到 ${t.length} 个用户工具栏按钮`), t.forEach((a, i) => {
        const r = a, n = r.getAttribute("title");
        n && (r.removeAttribute("title"), D(r, {
          text: n,
          delay: 300,
          defaultPlacement: "bottom"
        }), this.log(`✅ 已为用户工具栏按钮 ${i + 1} 添加 tooltip: "${n}"`));
      }), this.log("✅ 用户工具栏按钮 tooltip 初始化完成");
    } catch (e) {
      this.error("⚠️ 初始化用户工具栏按钮 tooltip 失败:", e);
    }
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
    }, a = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    a.forEach((i) => {
      i.addEventListener("scroll", t, { passive: !0 });
    }), this.scrollListener = () => {
      a.forEach((i) => {
        i.removeEventListener("scroll", t);
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
            (o) => o.classList.contains("new-tab-button") || o.classList.contains("drag-handle") || o.classList.contains("resize-handle")
          )) {
            this.clearDropIndicator();
            return;
          }
        }
        e || (e = requestAnimationFrame(() => {
          e = null;
          const i = document.elementsFromPoint(t.clientX, t.clientY).find((r) => {
            if (!r.classList.contains("orca-tab") || !r.hasAttribute("data-block-id")) return !1;
            const n = r.style;
            return !(n.opacity === "0" && n.pointerEvents === "none" || r.classList.contains("close-button") || r.classList.contains("new-tab-button") || r.classList.contains("drag-handle") || r.classList.contains("resize-handle"));
          });
          if (i) {
            const r = i.getAttribute("data-block-id"), o = this.getCurrentPanelTabs().find((c) => c.blockId === r);
            if (o && o.blockId !== this.draggingTab.blockId) {
              const c = i.getBoundingClientRect(), l = this.isVerticalMode && !this.isFixedToTop;
              let d;
              if (l) {
                const u = c.top + c.height / 2;
                d = t.clientY < u ? "before" : "after";
              } else {
                const u = c.left + c.width / 2;
                d = t.clientX < u ? "before" : "after";
              }
              this.updateDropIndicator(i, d);
              const h = `${o.blockId}-${d}`;
              this.lastSwapKey !== h && (this.lastSwapKey = h, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
                await this.swapTabsRealtime(o, this.draggingTab, d);
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
    const i = e.getBoundingClientRect(), r = e.parentElement;
    if (r) {
      const n = r.getBoundingClientRect();
      t === "before" ? (a.style.left = `${i.left - n.left}px`, a.style.top = `${i.top - n.top - 1}px`, a.style.width = `${i.width}px`) : (a.style.left = `${i.left - n.left}px`, a.style.top = `${i.bottom - n.top - 1}px`, a.style.width = `${i.width}px`), r.appendChild(a);
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
    var u, g;
    if (!this.tabContainer) return;
    const i = this.getCurrentPanelTabs(), r = i.findIndex((p) => p.blockId === t.blockId), n = i.findIndex((p) => p.blockId === e.blockId);
    if (r === -1 || n === -1 || r === n) return;
    const o = i.filter((p) => p.isPinned).length;
    let c = a === "before" ? n : n + 1;
    if (r < c && c--, t.isPinned) {
      if (c >= o) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶区域: ${t.title}`);
        return;
      }
      if (!e.isPinned) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (!t.isPinned) {
      if (c < o) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶区域: ${t.title}`);
        return;
      }
      if (e.isPinned) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (r === c) return;
    this.verboseLog(`🔄 [实时交换] ${t.title}: ${r} -> ${c}`);
    const [l] = i.splice(r, 1);
    i.splice(c, 0, l), await this.setCurrentPanelTabs(i);
    const d = this.tabContainer.querySelector(`[data-block-id="${t.blockId}"]`), h = this.tabContainer.querySelector(`[data-block-id="${e.blockId}"]`);
    d && h && (a === "before" ? (u = h.parentNode) == null || u.insertBefore(d, h) : (g = h.parentNode) == null || g.insertBefore(d, h.nextSibling));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(e, t) {
    const a = this.getCurrentPanelTabs(), i = a.findIndex((c) => c.blockId === e.blockId), r = a.findIndex((c) => c.blockId === t.blockId);
    if (i === -1 || r === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (i === r) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${r}) -> ${e.title} (${i})`);
    const n = a[r], o = a[i];
    a[i] = n, a[r] = o, a.forEach((c, l) => {
      c.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${n.title} -> 位置 ${i}`);
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
    e.forEach((r) => {
      const n = r.getAttribute("data-panel-id");
      if (n) {
        if (n.startsWith("_"))
          return;
        t.push(n), r.classList.contains("active") && (a = n);
      }
    });
    const i = this.getPanelIds();
    this.updatePanelOrder(t), this.updateCurrentPanelInfo(a), await this.handlePanelChanges(i, t);
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
    const a = e.filter((r) => !t.includes(r));
    a.length > 0 && (this.log("🗑️ 检测到面板被关闭:", a), await this.handlePanelClosure(a));
    const i = t.filter((r) => !e.includes(r));
    i.length > 0 && (this.log("🆕 检测到新面板被打开:", i), this.handleNewPanels(i)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   */
  async handlePanelClosure(e) {
    this.log("🗑️ 处理面板关闭:", e);
    const t = [];
    e.forEach((a) => {
      const i = this.panelOrder.findIndex((r) => r.id === a);
      i !== -1 && t.push(i);
    }), t.sort((a, i) => i - a).forEach((a) => {
      this.panelTabsData.splice(a, 1), this.log(`🗑️ 删除面板 ${e[t.indexOf(a)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((a) => a.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let a = 0; a < this.panelOrder.length; a++) {
      const i = this.panelTabsData[a] || [], r = a === 0 ? k.FIRST_PANEL_TABS : `panel_${a + 1}_tabs`;
      await this.savePanelTabsByKey(r, i);
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
    this.panelOrder.splice(t, 1), this.panelOrder.forEach((a, i) => {
      a.order = i + 1;
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
    if (t.length === e.length && t.every((r, n) => r === e[n]))
      return;
    e.forEach((r) => {
      this.panelOrder.find((n) => n.id === r) || this.addPanel(r);
    }), this.panelOrder.filter((r) => !e.includes(r.id)).forEach((r) => {
      this.removePanel(r.id);
    }), this.log("🔄 面板顺序更新完成:", this.panelOrder.map((r) => `${r.id}(${r.order})`));
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
    const a = t.querySelectorAll(".orca-block-editor[data-block-id]"), i = [];
    let r = 0;
    this.log(`🔍 扫描第一个面板 ${e}，找到 ${a.length} 个块编辑器`);
    for (const n of a) {
      const o = n.getAttribute("data-block-id");
      if (!o) continue;
      const c = await this.getTabInfo(o, e, r++);
      c && (i.push(c), this.log(`📋 找到标签页: ${c.title} (${o})`));
    }
    this.panelTabsData[0] = [...i], await this.savePanelTabsByKey(k.FIRST_PANEL_TABS, i), this.log(`📋 第一个面板扫描并保存了 ${i.length} 个标签页`);
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
    const e = this.getCurrentPanelTabs(), t = Da(e);
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return Ma(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return ha(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, a = !1, i = !1;
    for (const r of e)
      r && typeof r == "object" && (r.t === "r" && r.v ? (i = !0, r.a || (t = !0)) : r.t === "t" && r.v && (a = !0));
    return t || a && i;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return da(e);
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
          const i = this.extractTextFromContentSync(a.content);
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
          return N(e, o);
        } else
          return N(e, t);
      else
        return N(e, t);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const r of i)
        try {
          return N(e, r);
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
      const i = await orca.invokeBackend("get-block", parseInt(e));
      if (!i) return null;
      let r = "", n = "", o = "", c = !1, l = "";
      l = await de(i), this.verboseLog(`🔍 检测到块类型: ${l} (块ID: ${e})`), i.aliases && i.aliases.length > 0 && this.verboseLog(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${l}`);
      try {
        const d = Re(i);
        if (d)
          c = !0, r = ca(d);
        else if (i.aliases && i.aliases.length > 0)
          r = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? r = i.text.substring(0, 50) : r = (await this.extractTextFromContent(i.content)).substring(0, 50);
        else if (i.text) {
          let h = i.text.substring(0, 50);
          if (l === "list") {
            const u = i.text.split(`
`)[0].trim();
            u && (h = u.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (l === "table") {
            const u = i.text.split(`
`)[0].trim();
            u && (h = u.replace(/\|/g, "").trim());
          } else if (l === "quote") {
            const u = i.text.split(`
`)[0].trim();
            u && (h = u.replace(/^>\s+/, ""));
          } else if (l === "image") {
            const u = i.text.match(/caption:\s*(.+)/i);
            u && u[1] ? h = u[1].trim() : h = i.text.trim();
          }
          r = h;
        } else
          r = `块 ${e}`;
      } catch (d) {
        this.warn("获取标题失败:", d), r = `块 ${e}`;
      }
      try {
        const d = this.findProperty(i, "_color"), h = this.findProperty(i, "_icon");
        d && d.type === 1 && (n = d.value), h && h.type === 1 && h.value && h.value.trim() ? (o = h.value, this.verboseLog(`🎨 使用用户自定义图标: ${o} (块ID: ${e})`)) : (this.showBlockTypeIcons || l === "journal") && (o = Q(l), this.verboseLog(`🎨 使用块类型图标: ${o} (块类型: ${l}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), o = Q(l);
      }
      return {
        blockId: e,
        panelId: t,
        title: r || `块 ${e}`,
        color: n,
        icon: o,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: a,
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
    let t, a, i;
    if (this.isFixedToTop ? (t = { x: 0, y: 0 }, a = !1, i = window.innerWidth) : (t = this.isVerticalMode ? this.verticalPosition : this.position, a = this.isVerticalMode, i = this.verticalWidth), this.tabContainer = xa(
      a,
      t,
      i,
      e
    ), this.isFixedToTop) {
      const n = document.querySelector(".orca-headbar-sidebar-tools") || document.body;
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
      const o = n.target;
      o.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !o.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && n.stopPropagation();
    }), this.tabContainer.addEventListener("click", (n) => {
      const o = n.target;
      o.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !o.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && n.stopPropagation();
    });
    const r = document.createElement("div");
    r.className = "drag-handle", r.style.cssText = `
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
    `, r.innerHTML = "", r.addEventListener("mouseenter", () => {
      r.style.opacity = "0.5";
    }), r.addEventListener("mouseleave", () => {
      r.style.opacity = "0";
    }), r.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(r), this.isFixedToTop || document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && this.enableDragResize(), await this.updateTabsUI();
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
    var t;
    if (!this.tabContainer || this.isUpdating) return;
    this.isUpdating = !0;
    const e = Date.now();
    try {
      if (e - this.lastUpdateTime < 50) {
        e - this.lastUpdateTime < 10 && this.verboseLog("⏭️ 跳过UI更新：距离上次更新仅 " + (e - this.lastUpdateTime) + "ms");
        return;
      }
      this.lastUpdateTime = e;
      const a = this.tabContainer.querySelector(".drag-handle"), i = this.tabContainer.querySelector(".new-tab-button"), r = this.tabContainer.querySelector(".workspace-button"), n = Array.from(this.tabContainer.querySelectorAll(".orca-tab")).map((d) => d.getAttribute("data-tab-id")).filter((d) => d !== null);
      this.tabContainer.querySelectorAll(".orca-tab").forEach((d) => d.remove()), a && a.parentElement !== this.tabContainer && this.tabContainer.insertBefore(a, this.tabContainer.firstChild);
      let c = this.currentPanelId, l = this.currentPanelIndex;
      if (!c && this.panelOrder.length > 0 && (c = this.panelOrder[0].id, l = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${c}`)), c) {
        this.verboseLog(`📋 显示面板 ${c} 的标签页`);
        let d = this.panelTabsData[l] || [];
        d.length === 0 && (this.log(`🔍 面板 ${c} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(l, c), d = this.panelTabsData[l] || []), this.sortTabsByPinStatus(), d = this.panelTabsData[l] || [];
        const h = document.createDocumentFragment();
        d.forEach((g, p) => {
          const m = this.createTabElement(g);
          h.appendChild(m);
        });
        const u = (t = this.tabContainer) == null ? void 0 : t.querySelector(".new-tab-button");
        this.tabContainer && (u ? this.tabContainer.insertBefore(h, u) : this.tabContainer.appendChild(h));
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton(), this.isFixedToTop) {
        const d = "var(--orca-tab-bg)", h = "var(--orca-tab-border)", u = "var(--orca-color-text-1)", g = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        g.forEach((m) => {
          const b = m.getAttribute("data-tab-id");
          if (!b) return;
          const v = this.getCurrentPanelTabs().find((T) => T.blockId === b);
          if (v) {
            let T, x, w = "normal";
            if (T = "var(--orca-tab-bg)", x = "var(--orca-color-text-1)", v.color)
              try {
                m.style.setProperty("--tab-color", v.color), (document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark")) && m.style.setProperty(
                  "--orca-tab-colored-text",
                  "oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h)",
                  "important"
                ), T = "var(--orca-tab-colored-bg)", x = "var(--orca-tab-colored-text)", w = "600";
              } catch {
              }
            m.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${T};
            border-radius: var(--orca-radius-md);
            border: 1px solid ${h};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${x};
            font-weight: ${w};
            max-width: 100px;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            -webkit-app-region: no-drag;
            app-region: no-drag;
            pointer-events: auto;
          `, v.color && m.style.setProperty("--tab-color", v.color);
          }
        });
        const p = this.tabContainer.querySelector(".new-tab-button");
        p && (p.style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${d};
          border-radius: var(--orca-radius-md);
          border: 1px solid ${h};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${u};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${g.length}`);
      }
    } catch (a) {
      this.error("更新UI时发生错误:", a);
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
      e.forEach((a, i) => {
        const r = this.createTabElement(a);
        t.appendChild(r);
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
      const i = this.currentPanelIndex + 1;
      a.textContent = `面板 ${i}（无标签页）`, D(a, me(`当前在面板 ${i}，该面板没有标签页`)), t.appendChild(a);
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
      e.forEach((a, i) => {
        const r = this.createTabElement(a);
        t.appendChild(r);
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
      const i = this.currentPanelIndex + 1;
      a.textContent = `面板 ${i}（无标签页）`, D(a, me(`当前在面板 ${i}，该面板没有标签页`)), t.appendChild(a);
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
    t.style.cssText = a, t.innerHTML = "+", D(t, H("新建标签页")), t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", async (i) => {
      i.preventDefault(), i.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(t), this.addNewTabButtonContextMenu(t), this.enableWorkspaces && this.addWorkspaceButton();
  }
  /**
   * 优化后的标签宽度更新方法 - 避免完全重建UI
   */
  async updateTabWidths(e, t) {
    try {
      this.horizontalTabMaxWidth = e, this.horizontalTabMinWidth = t, this.tabContainer && !this.isVerticalMode ? (this.tabContainer.querySelectorAll(".orca-tab").forEach((i) => {
        const r = i, n = this.getTabInfoFromElement(r);
        if (n) {
          const o = this.isVerticalMode && !this.isFixedToTop, c = Pe(n, o, () => "", e, t);
          r.style.cssText = c;
        }
      }), this.log(`📏 标签宽度已优化更新: 最大${e}px, 最小${t}px`)) : await this.createTabsUI();
      try {
        await this.saveLayoutMode();
      } catch (a) {
        this.error("保存宽度设置失败:", a);
      }
    } catch (a) {
      this.error("更新标签宽度失败:", a);
    }
  }
  /**
   * 从标签元素获取标签信息
   */
  getTabInfoFromElement(e) {
    const t = e.getAttribute("data-tab-id");
    return t && (this.panelTabsData[this.currentPanelIndex] || []).find((i) => i.blockId === t) || null;
  }
  /**
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    try {
      if (this.isVerticalMode) {
        const e = $e(
          this.verticalWidth,
          async (t) => {
            try {
              orca.nav.changeSizes(orca.state.activePanel, [t]);
            } catch (a) {
              this.error("调整面板宽度失败:", a);
            }
            this.verticalWidth = t;
            try {
              await this.saveLayoutMode();
            } catch (a) {
              this.error("保存宽度设置失败:", a);
            }
          },
          async () => {
            try {
              orca.nav.changeSizes(orca.state.activePanel, [this.verticalWidth]);
            } catch (t) {
              this.error("恢复面板宽度失败:", t);
            }
          }
        );
        document.body.appendChild(e);
      } else {
        const e = this.horizontalTabMaxWidth, t = this.horizontalTabMinWidth, a = $e(
          this.horizontalTabMaxWidth,
          this.horizontalTabMinWidth,
          async (i, r) => {
            await this.updateTabWidths(i, r);
          },
          async () => {
            this.horizontalTabMaxWidth = e, this.horizontalTabMinWidth = t, await this.createTabsUI(), this.log(`📏 标签宽度已恢复: 最大${e}px, 最小${t}px`);
          }
        );
        document.body.appendChild(a);
      }
    } catch (e) {
      this.error("显示宽度调整对话框失败:", e);
    }
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
   * 添加功能切换按钮
   */
  addFeatureToggleButton() {
    if (!this.tabContainer) return;
    if (this.tabContainer.querySelector(".feature-toggle-button")) {
      this.log("🔧 功能切换按钮已存在，跳过创建");
      return;
    }
    const t = this.enableMiddleClickPin || this.enableDoubleClickClose;
    this.log(`🔧 创建功能切换按钮，当前状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}, 按钮启用=${t}`);
    const a = Ta(
      this.isVerticalMode,
      t,
      async (i) => {
        i.preventDefault(), i.stopPropagation(), this.log("🔧 点击功能切换按钮"), alert("功能切换按钮被点击了！"), await this.toggleFeatureSettings();
      }
    );
    D(a, H(
      t ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)"
    )), a.addEventListener("mouseenter", () => {
      a.style.background = t ? "rgba(0, 150, 0, 0.2)" : "rgba(0, 0, 0, 0.1)", a.style.color = t ? "#004400" : "#333";
    }), a.addEventListener("mouseleave", () => {
      a.style.background = t ? "rgba(0, 150, 0, 0.1)" : "transparent", a.style.color = t ? "#006600" : "#666";
    }), this.tabContainer.appendChild(a), this.log("🔧 功能切换按钮已添加到DOM");
  }
  /**
   * 切换功能设置
   */
  async toggleFeatureSettings() {
    try {
      this.log(`🔧 切换前状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), this.enableMiddleClickPin = !this.enableMiddleClickPin, this.enableDoubleClickClose = !this.enableDoubleClickClose, this.log(`🔧 切换后状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), await this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, this.enableMiddleClickPin, this.pluginName), await this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, this.enableDoubleClickClose, this.pluginName), this.log("🔧 设置已保存到存储"), this.updateFeatureToggleButton(), this.log(`🔧 功能开关已切换: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), this.showFeatureToggleNotification();
    } catch (e) {
      this.log("⚠️ 切换功能设置失败:", e);
    }
  }
  /**
   * 更新功能切换按钮状态
   */
  updateFeatureToggleButton() {
    if (!this.tabContainer) return;
    const e = this.tabContainer.querySelector(".feature-toggle-button");
    if (!e) return;
    const t = this.enableMiddleClickPin || this.enableDoubleClickClose;
    e.innerHTML = t ? "🔒" : "🔓", e.title = t ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)";
    const a = this.isVerticalMode ? `
      width: calc(100% - 6px);
      margin: 0 3px;
      height: 24px;
      background: ${t ? "rgba(0, 150, 0, 0.1)" : "transparent"};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: ${t ? "#006600" : "#666"};
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
      border: 1px solid ${t ? "rgba(0, 150, 0, 0.3)" : "transparent"};
    ` : `
      width: 24px;
      height: 24px;
      background: ${t ? "rgba(0, 150, 0, 0.1)" : "transparent"};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: ${t ? "#006600" : "#666"};
      margin-left: 4px;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
      border: 1px solid ${t ? "rgba(0, 150, 0, 0.3)" : "transparent"};
    `;
    e.style.cssText = a;
  }
  /**
   * 显示功能切换通知
   */
  showFeatureToggleNotification() {
    const e = this.enableMiddleClickPin || this.enableDoubleClickClose, t = e ? "功能已启用：中键固定标签页，双击关闭标签页" : "功能已禁用：中键关闭标签页，双击固定标签页", a = document.createElement("div");
    a.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${e ? "#4caf50" : "#ff9800"};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-size: 14px;
      max-width: 300px;
      word-wrap: break-word;
      animation: slideInRight 0.3s ease;
    `, a.textContent = t, document.body.appendChild(a), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 3e3);
  }
  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    var i;
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
    t.style.cssText = a, t.innerHTML = '<i class="ti ti-layout-grid" style="font-size: 14px;"></i>', D(t, H(`工作区 (${((i = this.workspaces) == null ? void 0 : i.length) || 0})`)), t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", (r) => {
      r.preventDefault(), r.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(r);
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
    const i = 200, r = 140, { x: n, y: o } = X(e.clientX, e.clientY, i, r);
    a.style.cssText = `
      position: fixed;
      left: ${n}px;
      top: ${o}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: ${i}px;
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
    ), this.isVerticalMode || c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: "调整标签宽度",
        action: () => this.showWidthAdjustmentDialog(),
        icon: "⚙"
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
        const m = document.createElement("div");
        m.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, a.appendChild(m);
        return;
      }
      const g = document.createElement("div");
      if (g.style.cssText = `
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
        const m = document.createElement("span");
        m.textContent = u.icon, m.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, g.appendChild(m);
      }
      const p = document.createElement("span");
      p.textContent = u.text, g.appendChild(p), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        u.action && u.action(), a.remove();
      }), a.appendChild(g);
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
      this.isSidebarAlignmentEnabled = !0, this.startSidebarAlignmentObserver(), await this.saveLayoutMode(), this.log("✅ 侧边栏对齐功能已启用，标签栏保持在当前位置");
    } catch (e) {
      this.error("启用侧边栏对齐失败:", e);
    }
  }
  /**
   * 禁用侧边栏对齐功能
   */
  async disableSidebarAlignment() {
    try {
      this.log("🔴 禁用侧边栏对齐功能"), this.stopSidebarAlignmentObserver(), await this.performSidebarAlignment(), this.isSidebarAlignmentEnabled = !1, await this.saveLayoutMode(), this.log("🔴 侧边栏对齐功能已禁用");
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
    let i;
    t ? i = "closed" : a ? i = "opened" : i = "unknown", this.lastSidebarState !== i && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${i}`), this.lastSidebarState = i, this.autoAdjustSidebarAlignment());
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
      const a = t.classList.contains("sidebar-closed"), i = t.classList.contains("sidebar-opened");
      if (!a && !i) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const r = this.getCurrentPosition();
      if (!r) return;
      const n = this.calculateSidebarAlignmentPosition(
        r,
        e,
        a,
        i
      );
      if (!n) return;
      await this.updatePosition(n), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${r.x}, ${r.y}) → (${n.x}, ${n.y})`);
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
  calculateSidebarAlignmentPosition(e, t, a, i) {
    var n;
    let r;
    if (a)
      r = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${r}px`);
    else if (i) {
      r = e.x + t;
      const o = ((n = this.tabContainer) == null ? void 0 : n.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      r = Math.min(r, window.innerWidth - o - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${r}px`);
    } else
      return null;
    return { x: r, y: e.y };
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
        var a, i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (r) => this.showRecentlyClosedTabsMenu(r),
          title: `最近关闭的标签页 (${((a = this.recentlyClosedTabs) == null ? void 0 : a.length) || 0})`,
          style: {
            color: (((i = this.recentlyClosedTabs) == null ? void 0 : i.length) || 0) > 0 ? "#ff6b6b" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: "ti ti-history"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.savedTabsButton`, () => {
        var a, i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (r) => this.showSavedTabSetsMenu(r),
          title: `保存的标签页集合 (${((a = this.savedTabSets) == null ? void 0 : a.length) || 0})`,
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
    for (let a = 0; a < e.length; a++) {
      const i = e[a];
      try {
        const r = await orca.invokeBackend("get-block", parseInt(i.blockId));
        if (r) {
          const n = await de(r), o = this.findProperty(r, "_color"), c = this.findProperty(r, "_icon");
          let l = i.color, d = i.icon;
          o && o.type === 1 && (l = o.value), c && c.type === 1 && c.value && c.value.trim() ? d = c.value : d || (d = Q(n)), i.blockType !== n || i.icon !== d || i.color !== l ? (e[a] = {
            ...i,
            blockType: n,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${i.title} -> 类型: ${n}, 图标: ${d}, 颜色: ${l}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${i.title} (无需更新)`);
        }
      } catch (r) {
        this.warn(`更新标签失败: ${i.title}`, r);
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
        const r = parseInt(a.replace("px", ""));
        if (isNaN(r))
          this.log(`⚠️ CSS变量值无法解析为数字: "${a}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${r}px`), r;
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
      right: 0;
      width: 6px;
      height: 100%;
      cursor: col-resize;
      background: transparent;
      z-index: 1000;
      pointer-events: auto;
      transition: background 0.2s ease;
    `, this.resizeHandle.addEventListener("mouseenter", () => {
      this.resizeHandle.style.background = "rgba(0, 122, 204, 0.3)";
    }), this.resizeHandle.addEventListener("mouseleave", () => {
      this.resizeHandle.style.background = "transparent";
    }), this.resizeHandle.addEventListener("mousedown", this.handleResizeStart.bind(this)), this.tabContainer.appendChild(this.resizeHandle));
  }
  /**
   * 处理拖拽开始
   */
  handleResizeStart(e) {
    if (e.preventDefault(), e.stopPropagation(), !this.tabContainer) return;
    const t = e.clientX, a = this.verticalWidth, i = (n) => {
      const o = n.clientX - t, c = Math.max(120, Math.min(400, a + o));
      this.verticalWidth = c, this.tabContainer.style.width = `${c}px`;
    }, r = async () => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", r);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (n) {
        this.error("保存宽度设置失败:", n);
      }
    };
    document.addEventListener("mousemove", i), document.addEventListener("mouseup", r);
  }
  /**
   * 清理拖拽功能
   */
  cleanupDragResize() {
    this.removeResizeHandle();
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
    const i = this.isVerticalMode && !this.isFixedToTop, r = Pe(e, i, () => "", this.horizontalTabMaxWidth, this.horizontalTabMinWidth);
    t.style.cssText = r;
    const n = ba();
    if (e.icon && this.showBlockTypeIcons) {
      const c = ma(e.icon);
      n.appendChild(c);
    }
    const o = fa(e.title);
    if (n.appendChild(o), e.isPinned) {
      const c = va();
      n.appendChild(c);
    }
    return t.appendChild(n), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), D(t, qe(e)), t.addEventListener("click", (c) => {
      var u;
      const l = c.target;
      if (l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle"))
        return;
      if (t.getAttribute("data-long-pressed") === "true") {
        t.removeAttribute("data-long-pressed");
        return;
      }
      if (document.querySelector(".hover-tab-list-container")) {
        O();
        return;
      }
      c.preventDefault(), this.verboseLog(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`), this.closedTabs.has(e.blockId) && (this.closedTabs.delete(e.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${e.title}"，从已关闭列表中移除`));
      const h = (u = this.tabContainer) == null ? void 0 : u.querySelectorAll(".orca-tabs-plugin .orca-tab");
      h == null || h.forEach((g) => g.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (c) => {
    }), t.addEventListener("dblclick", (c) => {
      const l = c.target;
      l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle") || (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.log(`🔧 双击事件处理: enableDoubleClickClose=${this.enableDoubleClickClose}`), this.enableDoubleClickClose ? (this.log("🔧 双击关闭标签页"), this.closeTab(e)) : (this.log("🔧 双击切换固定状态"), this.toggleTabPinStatus(e)));
    }), t.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.log(`🔧 中键事件处理: enableMiddleClickPin=${this.enableMiddleClickPin}`), this.enableMiddleClickPin ? (this.log("🔧 中键固定标签页"), this.toggleTabPinStatus(e)) : (this.log("🔧 中键关闭标签页"), this.closeTab(e)));
    }), t.addEventListener("keydown", (c) => {
      (c.target === t || t.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(e)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), this.addLongPressTabListEvents(t, e), t.draggable = !0, t.addEventListener("dragstart", (c) => {
      var h, u;
      const l = c.target;
      if (l.closest && l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      if (l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", c.dataTransfer.dropEffect = "move", (h = c.dataTransfer) == null || h.setData("text/plain", e.blockId);
      const d = document.createElement("img");
      d.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", d.style.opacity = "0";
      try {
        const g = t.getBoundingClientRect(), p = c.clientX - g.left, m = c.clientY - g.top;
        (u = c.dataTransfer) == null || u.setDragImage(d, p, m);
      } catch {
      }
      this.draggingTab = e, this.dragOverTab = null, this.lastSwapKey = "", this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (this.verboseLog("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), this.verboseLog("🔄 拖拽开始，设置draggingTab:", e.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), requestAnimationFrame(() => {
        t.style.opacity = "0", t.style.pointerEvents = "none";
      }), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", async (c) => {
      this.verboseLog("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (this.verboseLog("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback();
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
            const p = d.top + d.height / 2;
            u = c.clientY < p ? "before" : "after";
          } else {
            const p = d.left + d.width / 2;
            u = c.clientX < p ? "before" : "after";
          }
          this.updateDropIndicator(t, u), this.dragOverTab = e;
          const g = `${e.blockId}-${u}`;
          this.lastSwapKey !== g && (this.lastSwapKey = g, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
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
    return pa(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const a = parseInt(t[1], 16), i = parseInt(t[2], 16), r = parseInt(t[3], 16);
      return (0.299 * a + 0.587 * i + 0.114 * r) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (a) {
      let i = parseInt(a[1], 16), r = parseInt(a[2], 16), n = parseInt(a[3], 16);
      i = Math.floor(i * (1 - t)), r = Math.floor(r * (1 - t)), n = Math.floor(n * (1 - t));
      const o = i.toString(16).padStart(2, "0"), c = r.toString(16).padStart(2, "0"), l = n.toString(16).padStart(2, "0");
      return `#${o}${c}${l}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, a) {
    const i = e / 255, r = t / 255, n = a / 255, o = (oe) => oe <= 0.04045 ? oe / 12.92 : Math.pow((oe + 0.055) / 1.055, 2.4), c = o(i), l = o(r), d = o(n), h = c * 0.4124564 + l * 0.3575761 + d * 0.1804375, u = c * 0.2126729 + l * 0.7151522 + d * 0.072175, g = c * 0.0193339 + l * 0.119192 + d * 0.9503041, p = 0.2104542553 * h + 0.793617785 * u - 0.0040720468 * g, m = 1.9779984951 * h - 2.428592205 * u + 0.4505937099 * g, b = 0.0259040371 * h + 0.7827717662 * u - 0.808675766 * g, y = Math.cbrt(p), v = Math.cbrt(m), T = Math.cbrt(b), x = 0.2104542553 * y + 0.793617785 * v + 0.0040720468 * T, w = 1.9779984951 * y - 2.428592205 * v + 0.4505937099 * T, S = 0.0259040371 * y + 0.7827717662 * v - 0.808675766 * T, C = Math.sqrt(w * w + S * S), j = Math.atan2(S, w) * 180 / Math.PI, G = j < 0 ? j + 360 : j;
    return { l: x, c: C, h: G };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, a) {
    const i = a * Math.PI / 180, r = t * Math.cos(i), n = t * Math.sin(i), o = e, c = r, l = n, d = o * o * o, h = c * c * c, u = l * l * l, g = 1.0478112 * d + 0.0228866 * h - 0.050217 * u, p = 0.0295424 * d + 0.9904844 * h + 0.0170491 * u, m = -92345e-7 * d + 0.0150436 * h + 0.7521316 * u, b = 3.2404542 * g - 1.5371385 * p - 0.4985314 * m, y = -0.969266 * g + 1.8760108 * p + 0.041556 * m, v = 0.0556434 * g - 0.2040259 * p + 1.0572252 * m, T = (C) => C <= 31308e-7 ? 12.92 * C : 1.055 * Math.pow(C, 1 / 2.4) - 0.055, x = Math.max(0, Math.min(255, Math.round(T(b) * 255))), w = Math.max(0, Math.min(255, Math.round(T(y) * 255))), S = Math.max(0, Math.min(255, Math.round(T(v) * 255)));
    return { r: x, g: w, b: S };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return Fa(e, t);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 标签操作 - Tab Operations */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 获取当前面板的标签页数据 - 重构为简化的数组访问
   * 按照用户思路：直接用索引访问panelTabsData数组
   */
  getCurrentPanelTabs() {
    return this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length ? (this.log(`⚠️ 当前面板索引无效: ${this.currentPanelIndex}, 面板总数: ${this.getPanelIds().length}`), []) : (this.currentPanelIndex >= this.panelTabsData.length && (this.log(`🔧 调整panelTabsData数组大小，当前: ${this.panelTabsData.length}, 需要: ${this.currentPanelIndex + 1}`), this.adjustPanelTabsDataSize()), this.panelTabsData[this.currentPanelIndex] || []);
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
    this.currentPanelIndex >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[this.currentPanelIndex] = [...e], this.verboseLog(`📋 设置面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${e.length} 个`), this.saveCurrentPanelTabs();
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
        const e = this.panelTabsData[this.currentPanelIndex] || [], t = this.currentPanelIndex === 0 ? k.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
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
    const e = this.panelTabsData[this.currentPanelIndex] || [], t = this.currentPanelIndex === 0 ? k.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
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
      this.recordPerformanceCountMetric(this.performanceMetricKeys.tabInteraction), this.verboseLog(`🔄 开始切换标签: ${e.title} (ID: ${e.blockId})`), this.isSwitchingTab = !0;
      const t = this.getCurrentActiveTab();
      t && (this.recordScrollPosition(t), this.lastActiveBlockId = t.blockId, this.verboseLog(`🎯 记录切换前的激活标签: ${t.title} (ID: ${t.blockId})`), this.recordTabSwitchHistory(t.blockId, e));
      const a = this.getPanelIds();
      let i = "";
      if (e.panelId && a.includes(e.panelId) ? i = e.panelId : this.currentPanelId && a.includes(this.currentPanelId) ? i = this.currentPanelId : a.length > 0 && (i = a[0]), !i) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const r = a.indexOf(i);
      r !== -1 ? (this.currentPanelIndex = r, this.currentPanelId = i) : this.warn(`⚠️ 目标面板 ${i} 不在面板列表中`), this.verboseLog(`🎯 目标面板ID: ${i}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(i);
      } catch (n) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", n);
      }
      try {
        this.verboseLog(`🚀 尝试使用安全导航到块 ${e.blockId}`), await this.safeNavigate(e.blockId, i), this.verboseLog("✅ 安全导航成功");
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
      this.lastActiveBlockId = e.blockId, this.verboseLog(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
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
    const t = this.getCurrentPanelTabs(), a = t.findIndex((r) => r.blockId === e.blockId);
    if (a === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let i = -1;
    if (a === 0 ? i = 1 : a === t.length - 1 ? i = a - 1 : i = a + 1, i >= 0 && i < t.length) {
      const r = t[i];
      this.log(`🔄 自动切换到相邻标签: "${r.title}" (位置: ${i})`), this.currentPanelId && await this.safeNavigate(r.blockId, this.currentPanelId || "");
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), a = Sa(e, t, {
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
        },
        enableMiddleClickPin: {
          label: "中键固定/双击关闭模式",
          type: "boolean",
          defaultValue: !1,
          description: "开启：中键=固定/取消固定，双击=关闭；关闭：中键=关闭，双击=固定/取消固定"
        }
      };
      await orca.plugins.setSettingsSchema(this.pluginName, t);
      const a = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      a != null && a.homePageBlockId && (this.homePageBlockId = a.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (a == null ? void 0 : a.showInHeadbar) !== void 0 && (this.showInHeadbar = a.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = a.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = a.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableWorkspaces) !== void 0 && (this.enableWorkspaces = a.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), (a == null ? void 0 : a.debugMode) !== void 0 && (a.debugMode ? this.setLogLevel($.VERBOSE) : this.setLogLevel($.INFO), await this.storageService.saveConfig(k.DEBUG_MODE, a.debugMode, this.pluginName)), (a == null ? void 0 : a.restoreFocusedTab) !== void 0 && (this.restoreFocusedTab = a.restoreFocusedTab, this.log(`🎯 刷新后恢复聚焦标签页: ${this.restoreFocusedTab ? "开启" : "关闭"}`), await this.storageService.saveConfig(k.RESTORE_FOCUSED_TAB, a.restoreFocusedTab, this.pluginName)), (a == null ? void 0 : a.enableMiddleClickPin) !== void 0 && (this.enableMiddleClickPin = a.enableMiddleClickPin, this.enableDoubleClickClose = a.enableMiddleClickPin, await this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, a.enableMiddleClickPin, this.pluginName), await this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, a.enableMiddleClickPin, this.pluginName)), (a == null ? void 0 : a.enableDoubleClickClose) !== void 0 && (this.enableMiddleClickPin = a.enableDoubleClickClose, this.enableDoubleClickClose = a.enableDoubleClickClose, await this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, a.enableDoubleClickClose, this.pluginName), await this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, a.enableDoubleClickClose, this.pluginName)), this.log("✅ 插件设置已注册");
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
      debugMode: this.currentLogLevel === $.VERBOSE,
      restoreFocusedTab: this.restoreFocusedTab,
      enableMiddleClickPin: this.enableMiddleClickPin
    }, this.settingsCheckInterval = setInterval(() => {
      this.checkSettingsChange();
    }, 2e3);
  }
  /**
   * 检查设置变化
   */
  checkSettingsChange() {
    var e, t;
    try {
      const a = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      if (!a) return;
      if (a.showInHeadbar !== this.lastSettings.showInHeadbar) {
        const r = this.showInHeadbar;
        this.showInHeadbar = a.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${r ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (a.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = a.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), a.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const r = this.enableWorkspaces;
        this.enableWorkspaces = a.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${r ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.enableWorkspaces || this.removeWorkspaceButton(), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
      if (a.debugMode !== this.lastSettings.debugMode && (a.debugMode ? this.setLogLevel($.VERBOSE) : this.setLogLevel($.INFO), this.storageService.saveConfig(k.DEBUG_MODE, a.debugMode, this.pluginName).catch((r) => {
        this.error("保存调试模式设置失败:", r);
      }), this.lastSettings.debugMode = a.debugMode), a.restoreFocusedTab !== this.lastSettings.restoreFocusedTab) {
        const r = this.restoreFocusedTab;
        this.restoreFocusedTab = a.restoreFocusedTab, this.log(`🎯 设置变化：刷新后恢复聚焦标签页 ${r ? "开启" : "关闭"} -> ${this.restoreFocusedTab ? "开启" : "关闭"}`), this.storageService.saveConfig(k.RESTORE_FOCUSED_TAB, a.restoreFocusedTab, this.pluginName).catch((n) => {
          this.error("保存聚焦标签页恢复设置失败:", n);
        }), this.lastSettings.restoreFocusedTab = this.restoreFocusedTab;
      }
      const i = a.enableMiddleClickPin !== void 0 ? a.enableMiddleClickPin : a.enableDoubleClickClose;
      if (i !== void 0 && i !== this.lastSettings.enableMiddleClickPin) {
        const r = !!i;
        this.enableMiddleClickPin = a.enableMiddleClickPin, this.enableDoubleClickClose = r, this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, r, this.pluginName).catch((n) => this.error("保存中键固定设置失败:", n)), this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, r, this.pluginName).catch((n) => this.error("保存双击关闭设置失败:", n)), this.lastSettings.enableMiddleClickPin = r, (t = this.updateFeatureToggleButton) == null || t.call(this);
      }
    } catch (a) {
      this.error("检查设置变化失败:", a);
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
          const i = window.React;
          return !i || !orca.components.MenuText ? null : i.createElement(orca.components.MenuText, {
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
          const i = window.React;
          return !i || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : i.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              a(), this.getTabInfo(e.toString(), this.currentPanelId || "" || "", 0).then((r) => {
                r ? this.showAddToTabGroupDialog(r) : orca.notify("error", "无法获取块信息");
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
      const a = this.getCurrentPanelTabs(), i = {
        blockId: e,
        panelId: this.currentPanelId || "",
        title: t,
        isPinned: !1,
        order: a.length
      };
      this.log(`📋 新标签页信息: "${i.title}" (ID: ${e})`);
      const r = this.getCurrentActiveTab();
      let n = a.length;
      if (this.log(`📊 当前标签数量: ${a.length}, 标签列表: ${a.map((o) => o.title).join(", ")}`), this.addNewTabToEnd)
        n = a.length, this.log(`🎯 [一次性] 将新标签添加到末尾: "${i.title}", 插入位置: ${n}`), this.addNewTabToEnd = !1, this.log("♻️ 已重置标志，后续新标签将在聚焦标签后插入");
      else if (r) {
        const o = a.findIndex((c) => c.blockId === r.blockId);
        o !== -1 && (n = o + 1, this.log(`🎯 将在聚焦标签 "${r.title}" 后面插入新标签: "${i.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (a.length >= this.maxTabs) {
        a.splice(n, 0, i), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${i.title}`);
        const o = this.findLastNonPinnedTabIndex();
        if (o !== -1) {
          const c = a[o];
          a.splice(o, 1), this.log(`🗑️ 删除末尾的非固定标签: "${c.title}" 来保持数量限制`), a.forEach((l, d) => {
            l.order = d;
          });
        } else {
          const c = a.findIndex((l) => l.blockId === i.blockId);
          if (c !== -1) {
            a.splice(c, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${i.title}"`);
            return;
          }
        }
      } else
        a.splice(n, 0, i), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${i.title}`);
      a.forEach((o, c) => {
        o.order = c;
      }), this.log(`🔄 已重新计算标签顺序: ${a.map((o) => `${o.title}(${o.order})`).join(", ")}`), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 创建新标签页，实时更新工作区: ${i.title}`)), await this.safeNavigate(e, this.currentPanelId || ""), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${i.title}"`);
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
      var r, n;
      const a = (r = this.tabContainer) == null ? void 0 : r.querySelectorAll(".orca-tabs-plugin .orca-tab");
      a == null || a.forEach((o) => o.removeAttribute("data-focused"));
      const i = (n = this.tabContainer) == null ? void 0 : n.querySelector(`[data-tab-id="${e}"]`);
      return i ? (i.setAttribute("data-focused", "true"), !0) : !1;
    };
    t() || (await this.updateTabsUI(), t());
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(e, t, a = !1) {
    this.verboseLog("📋 [DEBUG] ========== addTabToPanel 开始 =========="), this.verboseLog(`📋 [DEBUG] 参数: blockId=${e}, insertMode=${t}, navigate=${a}`), this.verboseLog(`📋 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`);
    try {
      const i = this.getCurrentPanelTabs();
      this.verboseLog(`📋 [DEBUG] 当前标签页数量: ${i.length}`), this.verboseLog("📋 [DEBUG] 当前标签页列表:"), i.forEach((l, d) => {
        this.verboseLog(`📋 [DEBUG]   [${d}] ${l.title} (ID: ${l.blockId}, 固定: ${l.isPinned})`);
      }), this.verboseLog(`📋 [DEBUG] closedTabs包含 ${e}: ${this.closedTabs.has(e)}`);
      const r = i.find((l) => l.blockId === e);
      if (r)
        return this.verboseLog(`📋 [DEBUG] ❌ 块 ${e} 已存在于标签页中: "${r.title}"`), this.closedTabs.has(e) && (this.verboseLog(`📋 [DEBUG] 从closedTabs中移除 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.verboseLog(`📋 [DEBUG] 切换到已存在标签: "${r.title}"`), await this.switchToTab(r), await this.focusTabElementById(r.blockId), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（已存在）=========="), !0;
      this.verboseLog(`📋 [DEBUG] ✅ 块 ${e} 不存在，准备创建新标签`), this.creatingTabs.has(e) ? this.verboseLog(`📋 [DEBUG] ℹ️ 块 ${e} 已在 creatingTabs 中（可能来自 Ctrl+点击）`) : (this.verboseLog(`📋 [DEBUG] 🔒 将块 ${e} 添加到 creatingTabs 集合，防止重复处理`), this.creatingTabs.add(e));
      let n = null;
      try {
        if (!orca.state.blocks[parseInt(e)])
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法找到块 ${e}`), this.warn(`无法找到块 ${e}`), !1;
        if (this.verboseLog("📋 [addTabToPanel] 找到块信息"), this.verboseLog("📋 [addTabToPanel] 获取标签信息..."), n = await this.getTabInfo(e, this.currentPanelId || "", i.length), !n)
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法获取块 ${e} 的标签信息`), this.warn(`无法获取块 ${e} 的标签信息`), !1;
        this.verboseLog(`📋 [addTabToPanel] 标签信息: "${n.title}" (类型: ${n.blockType})`);
      } finally {
        this.verboseLog(`📋 [DEBUG] 🔓 从 creatingTabs 集合中移除块 ${e}`), this.creatingTabs.delete(e);
      }
      let o = i.length, c = !1;
      if (this.verboseLog(`📋 [addTabToPanel] 插入模式: ${t}`), t === "replace") {
        this.verboseLog("📋 [addTabToPanel] 替换模式 - 获取当前聚焦标签");
        const l = this.getCurrentActiveTab();
        if (!l)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 没有找到当前聚焦的标签"), this.warn("没有找到当前聚焦的标签"), !1;
        this.verboseLog(`📋 [addTabToPanel] 聚焦标签: "${l.title}" (${l.blockId})`);
        const d = i.findIndex((h) => h.blockId === l.blockId);
        if (d === -1)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 无法找到聚焦标签在数组中的位置"), this.warn("无法找到聚焦标签在数组中的位置"), !1;
        l.isPinned ? (this.verboseLog("📋 [addTabToPanel] 聚焦标签是固定的，改为插入模式"), this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), o = d + 1, c = !1) : (this.verboseLog(`📋 [addTabToPanel] 将替换位置 ${d} 的标签`), o = d, c = !0);
      } else if (t === "after") {
        this.verboseLog("📋 [addTabToPanel] After模式 - 在聚焦标签后插入");
        const l = this.getCurrentActiveTab();
        if (l) {
          this.verboseLog(`📋 [addTabToPanel] 找到聚焦标签: "${l.title}" (${l.blockId})`);
          const d = i.findIndex((h) => h.blockId === l.blockId);
          d !== -1 ? (o = d + 1, this.verboseLog(`📋 [addTabToPanel] 将在位置 ${o} 插入（聚焦标签后面）`), this.log("📌 在聚焦标签后面插入新标签")) : this.verboseLog("📋 [addTabToPanel] 警告 - 聚焦标签不在列表中，使用默认位置");
        } else
          this.verboseLog("📋 [addTabToPanel] 警告 - 没有找到聚焦标签，使用默认位置");
      }
      if (this.verboseLog(`📋 [addTabToPanel] 最终插入位置: ${o}, 替换模式: ${c}`), i.length >= this.maxTabs)
        if (this.verboseLog(`📋 [addTabToPanel] 已达到标签上限 ${this.maxTabs}`), c)
          this.verboseLog(`📋 [addTabToPanel] 替换位置 ${o} 的标签`), i[o] = n;
        else {
          this.verboseLog("📋 [addTabToPanel] 插入新标签并删除最后一个非固定标签"), i.splice(o, 0, n);
          const l = this.findLastNonPinnedTabIndex();
          if (l !== -1)
            this.verboseLog(`📋 [addTabToPanel] 删除位置 ${l} 的非固定标签`), i.splice(l, 1);
          else {
            this.verboseLog("📋 [addTabToPanel] 所有标签都是固定的，无法插入");
            const d = i.findIndex((h) => h.blockId === n.blockId);
            return d !== -1 && i.splice(d, 1), !1;
          }
        }
      else
        this.verboseLog(`📋 [addTabToPanel] 标签数量未达到上限，直接${c ? "替换" : "插入"}`), c ? i[o] = n : i.splice(o, 0, n);
      return this.verboseLog(`📋 [addTabToPanel] 插入后标签列表: ${i.map((l) => `${l.title}(${l.blockId})`).join(", ")}`), this.verboseLog("📋 [DEBUG] 同步更新存储数组..."), this.syncCurrentTabsToStorage(i), this.verboseLog("📋 [DEBUG] 保存标签数据..."), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (this.verboseLog(`📋 [DEBUG] 更新工作区: ${this.currentWorkspace}`), await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${n.title}`)), this.verboseLog("📋 [DEBUG] 更新UI..."), await this.updateTabsUI(), a ? (this.verboseLog(`📋 [DEBUG] 开始导航到块 ${e}`), await this.safeNavigate(e, this.currentPanelId || "")) : this.verboseLog("📋 [DEBUG] 跳过导航（后台打开模式）"), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（成功）=========="), !0;
    } catch (i) {
      return this.error("[DEBUG] ❌ addTabToPanel 出错:", i), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（失败）=========="), !1;
    }
  }
  /**
   * 统一的导航方法，确保所有导航都设置 isNavigating 标志
   * @param blockId 要导航到的块ID
   * @param panelId 目标面板ID
   */
  async safeNavigate(e, t) {
    this.isNavigating = !0, this.verboseLog(`🚀 [safeNavigate] 开始导航到块 ${e}，设置 isNavigating = true`);
    try {
      await orca.nav.goTo("block", { blockId: parseInt(e) }, t), this.verboseLog("✅ [safeNavigate] 导航成功");
    } catch (a) {
      throw this.error("❌ [safeNavigate] 导航失败:", a), a;
    } finally {
      setTimeout(() => {
        this.isNavigating = !1, this.verboseLog("🏁 [safeNavigate] 设置 isNavigating = false");
      }, 150);
    }
  }
  /**
   * 在新标签页打开指定块（后台打开，不导航不聚焦）
   * 
   * 功能说明：
   * 1. 检查块是否已存在于标签页中
   * 2. 如果存在，不做任何操作（标签页已经存在）
   * 3. 如果不存在，在当前聚焦标签后面创建新标签页（后台打开）
   * 4. 不会导航或聚焦到新标签页
   * 
   * @param blockId 要打开的块ID
   */
  async openInNewTab(e) {
    this.verboseLog("🔗 [DEBUG] ========== openInNewTab 开始 =========="), this.verboseLog(`🔗 [DEBUG] 目标块ID: ${e}`), this.verboseLog(`🔗 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`), this.verboseLog(`🔗 [DEBUG] creatingTabs 当前包含: ${Array.from(this.creatingTabs).join(", ") || "(空)"}`);
    try {
      const t = this.getCurrentPanelTabs();
      this.verboseLog(`🔗 [DEBUG] 当前标签页数量: ${t.length}`), this.verboseLog("🔗 [DEBUG] 当前标签页列表:"), t.forEach((r, n) => {
        this.verboseLog(`🔗 [DEBUG]   [${n}] ${r.title} (ID: ${r.blockId}, 固定: ${r.isPinned})`);
      });
      const a = t.find((r) => r.blockId === e);
      if (a) {
        this.verboseLog(`🔗 [DEBUG] ❌ 块 ${e} 已存在，标签: "${a.title}"，无需操作`), this.closedTabs.has(e) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.creatingTabs.has(e) && (this.verboseLog(`🔓 [DEBUG] 从 creatingTabs 中移除 ${e}（已存在）`), this.creatingTabs.delete(e)), this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成（已存在）==========");
        return;
      }
      if (this.verboseLog(`🔗 [DEBUG] ✅ 块 ${e} 不存在，准备在后台创建新标签页`), this.closedTabs.has(e) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.verboseLog(`🔗 [DEBUG] 调用 addTabToPanel(blockId: ${e}, mode: 'after', navigate: false)`), await this.addTabToPanel(e, "after", !1)) {
        this.verboseLog("🔗 [DEBUG] ✅ 成功在后台创建新标签页");
        const r = this.getCurrentPanelTabs();
        this.verboseLog(`🔗 [DEBUG] 更新后标签页数量: ${r.length}`);
      } else
        this.verboseLog("🔗 [DEBUG] ❌ 创建新标签页失败");
      this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成 ==========");
    } catch (t) {
      this.error("[DEBUG] ❌ openInNewTab 处理失败:", t), this.creatingTabs.has(e) && (this.verboseLog(`🔓 [DEBUG] 异常时从 creatingTabs 中移除 ${e}`), this.creatingTabs.delete(e));
    }
  }
  /**
   * 从DOM元素中获取块引用的ID
   * 
   * 功能说明：
   * 1. 向上遍历DOM树查找块引用元素
   * 2. 支持多种块引用的class和属性
   * 3. 支持从data属性中提取块ID
   * 4. 支持从文本内容中解析块ID（如 [[块123]] 或 block:123）
   * 
   * @param element 起始DOM元素
   * @returns 块引用ID，如果未找到则返回null
   */
  getBlockRefId(e) {
    var t, a;
    try {
      let i = e;
      for (; i && i !== document.body; ) {
        const r = i.classList;
        if (r.contains("orca-inline-r-content") || r.contains("orca-ref") || r.contains("block-ref") || r.contains("block-reference") || r.contains("orca-fragment-r") || r.contains("fragment-r") || r.contains("orca-block-reference") || i.tagName.toLowerCase() === "a" && ((t = i.getAttribute("href")) != null && t.startsWith("#"))) {
          const o = i.getAttribute("data-block-id") || i.getAttribute("data-ref-id") || i.getAttribute("data-blockid") || i.getAttribute("data-target-block-id") || i.getAttribute("data-fragment-v") || i.getAttribute("data-v") || ((a = i.getAttribute("href")) == null ? void 0 : a.replace("#", "")) || i.getAttribute("data-id");
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从元素中提取到块引用ID: ${o}`), o;
        }
        const n = i.dataset;
        for (const [o, c] of Object.entries(n))
          if ((o.toLowerCase().includes("block") || o.toLowerCase().includes("ref")) && c && !isNaN(parseInt(c)))
            return this.log(`🔗 从data属性 ${o} 中提取到块引用ID: ${c}`), c;
        i = i.parentElement;
      }
      if (e.textContent) {
        const r = e.textContent.trim(), n = r.match(/\[\[(?:块)?(\d+)\]\]/) || r.match(/block[:\s]*(\d+)/i);
        if (n && n[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${n[1]}`), n[1];
      }
      return this.log("🔗 未能从元素中提取块引用ID"), null;
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
      const a = t.anchor.blockId.toString();
      return this.log(`🔍 获取到当前光标块ID: ${a}`), a;
    } catch (e) {
      return this.error("获取当前光标块ID时出错:", e), null;
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(e, t, a, i) {
    return ua(e, t, a, i);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(t, orca.state.panels);
      if (a && a.viewState) {
        let i = null;
        const r = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (r) {
          const n = r.closest(".orca-panel");
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
          a.viewState.scrollPosition = n;
          const o = this.getCurrentPanelTabs().findIndex((c) => c.blockId === e.blockId);
          o !== -1 && (this.getCurrentPanelTabs()[o].scrollPosition = n, await this.saveCurrentPanelTabs()), this.verboseLog(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, n, "容器:", i.className);
        } else
          this.warn(`未找到标签 "${e.title}" 的滚动容器`);
      } else
        this.warn(`未找到面板 ${t} 或viewState`);
    } catch (t) {
      this.warn("记录滚动位置时出错:", t);
    }
  }
  /**
   * 替换当前标签页内容
   */
  async replaceCurrentTabWith(e, t) {
    try {
      this.verboseLog(`🔄 开始替换标签页: ${e} -> ${t.blockId}`);
      const a = this.getCurrentPanelTabs(), i = a.findIndex((c) => c.blockId === e);
      if (i === -1) {
        this.verboseLog(`⚠️ 未找到要替换的标签: ${e}`);
        return;
      }
      const r = this.getCurrentActiveTab(), n = r && r.blockId === e, o = a[i];
      a[i] = t, this.verboseLog(`🔄 替换标签页: "${o.title}" -> "${t.title}"`), await this.setCurrentPanelTabs(a), await this.immediateUpdateTabsUI(), n && (this.verboseLog(`🎯 重新聚焦到替换后的标签: ${t.title}`), this.isNavigating = !0, await new Promise((c) => setTimeout(c, 50)), await this.switchToTab(t), setTimeout(() => {
        this.isNavigating = !1;
      }, 100)), this.recordTabSwitchHistory(e, t), this.verboseLog("✅ 标签页替换完成");
    } catch (a) {
      this.warn("替换标签页失败:", a), this.isNavigating = !1;
    }
  }
  /**
   * 记录标签切换历史
   */
  async recordTabSwitchHistory(e, t) {
    try {
      await this.tabStorageService.updateTabSwitchHistory(e, t), this.verboseLog(`📝 记录标签切换历史: ${e} -> ${t.blockId}`);
    } catch (a) {
      this.warn("记录标签切换历史失败:", a);
    }
  }
  /**
   * 删除标签的切换历史记录
   */
  async deleteTabSwitchHistory(e) {
    try {
      await this.tabStorageService.deleteTabSwitchHistory(e), this.log(`🗑️ 删除标签 ${e} 的切换历史记录`);
    } catch (t) {
      this.warn("删除标签切换历史失败:", t);
    }
  }
  /**
   * 安全的closest方法，避免类型错误
   */
  safeClosest(e, t) {
    if (!e || typeof e != "object" || !("closest" in e))
      return null;
    try {
      return e.closest(t);
    } catch {
      return null;
    }
  }
  /**
   * 添加左键长按事件显示最近切换标签
   */
  addLongPressTabListEvents(e, t) {
    let a = null, i = null, r = 0, n = !1;
    const o = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: !0,
      maxWidth: 150
    };
    e.addEventListener("mousedown", (l) => {
      if (l.button !== 0) return;
      const d = l.target;
      d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle") || (n = !0, this.verboseLog(`🖱️ 开始长按标签: ${t.title}`), a = window.setTimeout(async () => {
        if (n) {
          e.setAttribute("data-long-pressed", "true");
          try {
            this.verboseLog("⏰ 长按触发，开始检查切换历史");
            const u = (await this.tabStorageService.restoreRecentTabSwitchHistory()).global_tab_history;
            if (this.verboseLog(`📋 全局切换历史记录: ${u ? u.recentTabs.length : 0} 个记录`), !u || u.recentTabs.length === 0) {
              this.verboseLog("⚠️ 没有全局切换历史记录，不显示悬浮列表");
              return;
            }
            const g = u.recentTabs;
            if (this.verboseLog(`📋 去重后的历史记录: ${g.length} 个记录`), g.length === 0) {
              this.verboseLog("⚠️ 去重后没有历史记录，不显示悬浮列表");
              return;
            }
            const p = e.getBoundingClientRect(), m = {
              x: p.left,
              y: p.bottom + 4
              // 在标签下方显示
            };
            this.verboseLog(`📍 计算悬浮位置: x=${m.x}, y=${m.y}`), this.verboseLog(`📊 标签尺寸: width=${p.width}, height=${p.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
            const b = (v) => {
              this.verboseLog(`🖱️ 点击悬浮标签: ${v.title}`), this.getCurrentPanelTabs().find((w) => w.blockId === v.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${v.title}`), this.recordTabSwitchHistory(t.blockId, v), this.switchToTab(v)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${v.title}`), this.replaceCurrentTabWith(t.blockId, v)), O();
            };
            i = Ie(
              g,
              m,
              o,
              b,
              this.isVerticalMode
            ), this.verboseLog("✅ 悬浮标签列表创建完成"), o.enableScroll && g.length > o.maxDisplayCount && this.addScrollEvents(i, g, o, r, b);
            const y = (v) => {
              const T = v.target;
              this.safeClosest(T, ".hover-tab-list-container") || (O(), i = null, r = 0, document.removeEventListener("click", y));
            };
            setTimeout(() => {
              document.addEventListener("click", y);
            }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${g.length} 个历史标签`);
          } catch (h) {
            this.warn("显示悬浮标签列表失败:", h);
          }
        }
      }, 500));
    }), e.addEventListener("mouseup", () => {
      a && (clearTimeout(a), a = null), n = !1;
    }), e.addEventListener("mouseleave", () => {
      a && (clearTimeout(a), a = null), n = !1;
    });
    const c = () => {
      setTimeout(() => {
        O(), i = null, r = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (l) => {
      this.safeClosest(l.target, ".hover-tab-list-container");
    }), document.addEventListener("mouseleave", (l) => {
      this.safeClosest(l.target, ".hover-tab-list-container") && c();
    });
  }
  /**
   * 添加悬浮标签列表事件
   */
  addHoverTabListEvents(e, t) {
    let a = null, i = null, r = 0;
    const n = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: !0,
      maxWidth: 150
    };
    e.addEventListener("mouseenter", async () => {
      const l = e.getAttribute("data-tab-history-id");
      this.verboseLog(`🖱️ 鼠标进入标签: ${t.title} (标签历史ID: ${l})`), a && (clearTimeout(a), a = null), a = window.setTimeout(async () => {
        try {
          this.verboseLog(`⏰ 开始检查标签 ${t.title} 的切换历史`);
          const d = await this.tabStorageService.restoreRecentTabSwitchHistory(), h = [];
          if (Object.values(d).forEach((v) => {
            v.recentTabs && h.push(...v.recentTabs);
          }), this.verboseLog(`📋 所有切换历史记录: ${h.length} 个记录`), h.length === 0) {
            this.verboseLog("⚠️ 没有切换历史记录，不显示悬浮列表");
            return;
          }
          const u = /* @__PURE__ */ new Map();
          h.forEach((v) => {
            u.set(v.blockId, v);
          });
          const g = Array.from(u.values());
          if (this.verboseLog(`📋 去重后的历史记录: ${g.length} 个记录`), g.length === 0) {
            this.verboseLog("⚠️ 去重后没有历史记录，不显示悬浮列表");
            return;
          }
          const p = e.getBoundingClientRect(), m = {
            x: p.left,
            y: p.bottom + 4
            // 在标签下方显示
          };
          this.verboseLog(`📍 计算悬浮位置: x=${m.x}, y=${m.y}`), this.verboseLog(`📊 标签尺寸: width=${p.width}, height=${p.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
          const b = (v) => {
            this.verboseLog(`🖱️ 点击悬浮标签: ${v.title}`), this.getCurrentPanelTabs().find((w) => w.blockId === v.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${v.title}`), this.recordTabSwitchHistory(t.blockId, v), this.switchToTab(v)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${v.title}`), this.replaceCurrentTabWith(t.blockId, v)), O();
          };
          i = Ie(
            g,
            m,
            n,
            b,
            this.isVerticalMode
          ), this.verboseLog("✅ 悬浮标签列表创建完成"), n.enableScroll && g.length > n.maxDisplayCount && this.addScrollEvents(i, g, n, r, b);
          const y = (v) => {
            const T = v.target;
            this.safeClosest(T, ".hover-tab-list-container") || (O(), i = null, r = 0, document.removeEventListener("click", y));
          };
          setTimeout(() => {
            document.addEventListener("click", y);
          }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${g.length} 个历史标签`);
        } catch (d) {
          this.warn("显示悬浮标签列表失败:", d);
        }
      }, 300);
    }), e.addEventListener("mouseleave", () => {
      a && (clearTimeout(a), a = null), a = window.setTimeout(() => {
        O(), i = null, r = 0;
      }, 200);
    });
    const o = () => {
      a && (clearTimeout(a), a = null);
    }, c = () => {
      a = window.setTimeout(() => {
        O(), i = null, r = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (l) => {
      this.safeClosest(l.target, ".hover-tab-list-container") && o();
    }), document.addEventListener("mouseleave", (l) => {
      this.safeClosest(l.target, ".hover-tab-list-container") && c();
    });
  }
  /**
   * 添加滚动事件
   */
  addScrollEvents(e, t, a, i, r) {
    const n = e.querySelector(".hover-tab-list-scroll");
    if (!n) return;
    let o = !1;
    n.addEventListener("wheel", (c) => {
      if (c.preventDefault(), o) return;
      o = !0;
      const l = c.deltaY > 0 ? a.scrollStep : -a.scrollStep, d = Math.max(0, Math.min(i + l, t.length - a.maxDisplayCount));
      d !== i && (i = d, pe(e, t, a, r, this.isVerticalMode, i)), setTimeout(() => {
        o = !1;
      }, 100);
    }), e.addEventListener("keydown", (c) => {
      if (c.key === "ArrowUp" || c.key === "ArrowDown") {
        c.preventDefault();
        const l = c.key === "ArrowDown" ? a.scrollStep : -a.scrollStep, d = Math.max(0, Math.min(i + l, t.length - a.maxDisplayCount));
        d !== i && (i = d, pe(e, t, a, r, this.isVerticalMode, i));
      }
    });
  }
  /**
   * 恢复标签的滚动位置
   */
  restoreScrollPosition(e) {
    try {
      let t = null;
      const a = this.getPanelIds()[this.currentPanelIndex], i = orca.nav.findViewPanel(a, orca.state.panels);
      if (i && i.viewState && i.viewState.scrollPosition && (t = i.viewState.scrollPosition, this.verboseLog(`🔄 从viewState恢复标签 "${e.title}" 滚动位置:`, t)), !t && e.scrollPosition && (t = e.scrollPosition, this.verboseLog(`🔄 从标签信息恢复标签 "${e.title}" 滚动位置:`, t)), !t) return;
      const r = (n = 1) => {
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
        o || (o = document.body.scrollTop > 0 ? document.body : document.documentElement), o ? (o.scrollLeft = t.x, o.scrollTop = t.y, this.verboseLog(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", o.className, `尝试${n}`)) : setTimeout(() => r(n + 1), 200 * n);
      };
      r(), setTimeout(() => r(2), 100), setTimeout(() => r(3), 300);
    } catch (t) {
      this.warn("恢复滚动位置时出错:", t);
    }
  }
  /**
   * 调试滚动位置信息
   */
  debugScrollPosition(e) {
    this.verboseLog(`🔍 调试标签 "${e.title}" 滚动位置:`), this.verboseLog("标签保存的滚动位置:", e.scrollPosition);
    const t = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(t, orca.state.panels);
    a && a.viewState ? (this.verboseLog("viewState中的滚动位置:", a.viewState.scrollPosition), this.verboseLog("完整viewState:", a.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((r) => {
      document.querySelectorAll(r).forEach((o, c) => {
        const l = o;
        (l.scrollTop > 0 || l.scrollLeft > 0) && this.log(`容器 ${r}[${c}]:`, {
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
      const r = a.getAttribute("data-block-id") === e.blockId;
      return r && this.closedTabs.has(e.blockId) ? (this.verboseLog(`🔍 标签 ${e.title} 在已关闭列表中，不认为是激活状态`), !1) : r;
    } catch (t) {
      return this.warn("检查标签激活状态时出错:", t), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    var o;
    const e = this.enableWorkspaces ? this.getCurrentPanelTabs() : this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    const t = (o = this.tabContainer) == null ? void 0 : o.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
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
    const i = a.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!i)
      return this.verboseLog("⚠️ 目标面板中没有找到可见的块编辑器"), null;
    const r = i.getAttribute("data-block-id");
    if (!r)
      return this.verboseLog("⚠️ 块编辑器没有 data-block-id 属性"), null;
    const n = e.find((c) => c.blockId === r) || null;
    return n ? this.verboseLog(`🎯 根据DOM块编辑器找到激活标签: ${n.title} (ID: ${r})`) : this.verboseLog(`⚠️ 在标签列表中找不到块ID ${r} 对应的标签`), this.enableWorkspaces && this.currentWorkspace && n && this.updateCurrentWorkspaceActiveIndex(n), n;
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
    const a = e.findIndex((i) => i.blockId === t.blockId);
    return a === -1 ? -1 : a;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    if (this.lastActiveBlockId) {
      const a = e.find((i) => i.blockId === this.lastActiveBlockId);
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
    const a = t.findIndex((i) => i.blockId === e.blockId);
    return a === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${e.title}" (索引${a}) 后面插入新标签`), a);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), a = t.findIndex((i) => i.blockId === e.blockId);
    return a === -1 || t.length <= 1 ? null : a < t.length - 1 ? t[a + 1] : a > 0 ? t[a - 1] : a === 0 && t.length > 1 ? t[1] : null;
  }
  /**
   * 关闭标签页
   */
  async closeTab(e) {
    var i;
    const t = this.getCurrentPanelTabs();
    if (t.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    e.isPinned && this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
    const a = t.findIndex((r) => r.blockId === e.blockId);
    if (a !== -1) {
      const r = this.getCurrentActiveTab(), n = r && r.blockId === e.blockId, o = n ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const d = { ...e, closedAt: Date.now() }, h = this.recentlyClosedTabs.findIndex((u) => u.blockId === e.blockId);
        h !== -1 && this.recentlyClosedTabs.splice(h, 1), this.recentlyClosedTabs.unshift(d), this.recentlyClosedTabs.length > 10 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 10)), await this.saveRecentlyClosedTabs();
      }
      const c = (i = this.tabContainer) == null ? void 0 : i.querySelector(`[data-tab-id="${e.blockId}"]`), l = c == null ? void 0 : c.getAttribute("data-tab-history-id");
      l && await this.deleteTabSwitchHistory(l), t.splice(a, 1), this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`)), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), n && o ? (this.log(`🔄 自动切换到相邻标签: "${o.title}"`), await this.switchToTab(o)) : n && !o && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const e = this.getCurrentPanelTabs();
    e.filter((r) => !r.isPinned).forEach((r) => {
      this.closedTabs.add(r.blockId);
    });
    const a = e.filter((r) => r.isPinned), i = e.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${i} 个标签，保留了 ${a.length} 个固定标签`);
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
    const r = t.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${r} 个标签，保留了当前标签和固定标签`);
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
    const i = t.textContent, r = t.style.cssText, n = t.draggable;
    t.draggable = !1;
    const o = document.createElement("input");
    o.type = "text", o.value = e.title, o.className = "inline-rename-input";
    let c = "var(--orca-color-text-1)", l = "";
    e.color && (l = `--tab-color: ${e.color.startsWith("#") ? e.color : `#${e.color}`};`, c = "var(--orca-tab-colored-text)"), o.style.cssText = `
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
    `, t.textContent = "", t.appendChild(o), t.style.padding = "2px 8px", o.focus(), o.select();
    const d = async () => {
      const u = o.value.trim();
      if (u && u !== e.title) {
        await this.updateTabTitle(e, u), t.draggable = n;
        return;
      }
      t.textContent = i, t.style.cssText = r, t.draggable = n;
    }, h = () => {
      t.textContent = i, t.style.cssText = r, t.draggable = n;
    };
    o.addEventListener("blur", d), o.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), d()) : u.key === "Escape" && (u.preventDefault(), h());
    }), o.addEventListener("click", (u) => {
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
    const r = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let n = { x: "50%", y: "50%" };
    if (r) {
      const h = r.getBoundingClientRect(), u = window.innerWidth, g = window.innerHeight, p = 300, m = 100, b = 20;
      let y = h.left, v = h.top - m - 10;
      y + p > u - b && (y = u - p - b), y < b && (y = b), v < b && (v = h.bottom + 10, v + m > g - b && (v = (g - m) / 2)), v + m > g - b && (v = g - m - b), y = Math.max(b, Math.min(y, u - p - b)), v = Math.max(b, Math.min(v, g - m - b)), n = { x: `${y}px`, y: `${v}px` };
    }
    const o = orca.components.InputBox, c = t.createElement(o, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (h, u, g) => {
        h && h.trim() && h.trim() !== e.title && this.updateTabTitle(e, h.trim()), g();
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
    a.render(c, i), setTimeout(() => {
      const h = i.querySelector("div");
      h && h.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        a.unmountComponentAtNode(i), i.remove();
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
    const r = document.createElement("div");
    r.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;
    const n = document.createElement("button");
    n.className = "orca-button orca-button-primary", n.textContent = "确认";
    const o = document.createElement("button");
    o.className = "orca-button", o.textContent = "取消", r.appendChild(n), r.appendChild(o), a.appendChild(i), a.appendChild(r);
    const c = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (c) {
      const u = c.getBoundingClientRect();
      a.style.left = `${u.left}px`, a.style.top = `${u.top - 60}px`;
    } else
      a.style.left = "50%", a.style.top = "50%", a.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(a), i.focus(), i.select();
    const l = () => {
      const u = i.value.trim();
      u && u !== e.title && this.updateTabTitle(e, u), a.remove();
    }, d = () => {
      a.remove();
    };
    n.addEventListener("click", l), o.addEventListener("click", d), i.addEventListener("keydown", (u) => {
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
      const a = this.getCurrentPanelTabs(), i = Ia(e, t, a, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      i.success ? (this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${t}`)), this.log(i.message)) : this.warn(i.message);
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
    const a = window.React, i = window.ReactDOM, r = document.createElement("div");
    r.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(r);
    const n = orca.components.ContextMenu, o = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, d = a.createElement(n, {
      menu: (g) => a.createElement(o, {}, [
        a.createElement(c, {
          key: "rename",
          title: "重命名标签",
          shortcut: "F2",
          onClick: () => {
            g(), this.renameTab(t);
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
            g(), this.toggleTabPinStatus(t);
          }
        }),
        // 如果有保存的标签组，添加"添加到已有标签组"选项
        ...this.savedTabSets.length > 0 ? [
          a.createElement(c, {
            key: "addToGroup",
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              g(), this.showAddToTabGroupDialog(t);
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
            g(), this.closeTab(t);
          }
        }),
        a.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            g(), this.closeOtherTabs(t);
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
    }, (g, p) => a.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        background: "transparent"
      },
      onContextMenu: (b) => {
        b.preventDefault(), b.stopPropagation(), g(b);
      }
    }));
    i.render(d, r);
    const h = () => {
      i.unmountComponentAtNode(r), r.remove();
    }, u = new MutationObserver((g) => {
      g.forEach((p) => {
        p.removedNodes.forEach((m) => {
          m === e && (h(), u.disconnect());
        });
      });
    });
    u.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    var u, g;
    const a = document.querySelector(".tab-context-menu");
    a && a.remove();
    const i = document.documentElement.classList.contains("dark") || ((g = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : g.themeMode) === "dark", r = document.createElement("div");
    r.className = "tab-context-menu";
    const n = 220, o = 240, { x: c, y: l } = X(e.clientX, e.clientY, n, o);
    r.style.cssText = `
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
    ), d.forEach((p) => {
      const m = document.createElement("div");
      m.className = "tab-context-menu-item";
      let b = "";
      p.text.includes("关闭") ? b = "close" : p.text.includes("重命名") ? b = "rename" : p.text.includes("固定") ? b = "pin" : p.text.includes("复制") ? b = "duplicate" : p.text.includes("保存到标签组") && (b = "save-to-group"), m.setAttribute("data-action", b), m.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: ${p.disabled ? i ? "#666" : "#999" : "var(--orca-color-text-1)"};
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s;
      `;
      const y = document.createElement("i");
      y.className = "tab-context-menu-icon", p.text.includes("重命名") ? y.classList.add("ti", "ti-edit") : p.text.includes("固定") ? y.classList.add("ti", t.isPinned ? "ti-pin-off" : "ti-pin") : p.text.includes("添加到已有标签组") ? y.classList.add("ti", "ti-bookmark-plus") : p.text.includes("关闭") ? y.classList.add("ti", "ti-x") : y.classList.add("ti", "ti-edit"), y.style.cssText = `
        flex: 0 0 auto;
        font-size: var(--orca-fontsize-lg);
        margin-top: var(--orca-spacing-xs);
        margin-right: var(--orca-spacing-md);
        color: var(--orca-tab-colored-text);
        width: 16px;
        text-align: center;
      `, m.appendChild(y);
      const v = document.createElement("span");
      v.textContent = p.text, m.appendChild(v), p.disabled || (m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      }), m.addEventListener("click", () => {
        p.action(), r.remove();
      })), r.appendChild(m);
    }), document.body.appendChild(r);
    const h = (p) => {
      r.contains(p.target) || (r.remove(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    if (this.currentWorkspace) {
      this.log("🚫 在工作区状态下，跳过保存标签页到普通存储");
      return;
    }
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
      const i = e[a];
      if (!i.blockType || !i.icon)
        try {
          const n = await orca.invokeBackend("get-block", parseInt(i.blockId));
          if (n) {
            const o = await de(n);
            let c = i.icon;
            c || (c = Q(o)), e[a] = {
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
    t && (this.panelTabsData[0] = e, this.currentWorkspace ? this.log("🔄 在工作区状态下，跳过保存更新的标签页到存储") : (this.log("🔄 检测到恢复的标签页有更新，保存到存储..."), await this.saveFirstPanelTabs())), this.log("✅ 恢复的标签页块类型和图标更新完成");
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
      const i = e.charCodeAt(a);
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
      const r = this.tabContainer.querySelector(".drag-handle");
      r && r.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const a = (r) => {
      this.isDragging && (r.preventDefault(), r.stopPropagation(), this.drag(r));
    }, i = (r) => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", i), this.stopDrag();
    };
    document.addEventListener("mousemove", a), document.addEventListener("mouseup", i), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), a = 5, i = window.innerWidth - t.width - 5, r = 5, n = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(a, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(r, Math.min(n, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(a, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(r, Math.min(n, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
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
      showInHeadbar: this.showInHeadbar,
      horizontalTabMaxWidth: this.horizontalTabMaxWidth,
      horizontalTabMinWidth: this.horizontalTabMinWidth
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
      const i = a;
      i.style.pointerEvents === "none" && (i.style.pointerEvents = "auto");
    }), document.querySelectorAll('button, .btn, [role="button"]').forEach((a) => {
      const i = a;
      i.style.pointerEvents === "none" && (i.style.pointerEvents = "auto");
    });
  }
  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    document.querySelectorAll("*").forEach((a) => {
      const i = a;
      (i.style.cursor === "grabbing" || i.style.cursor === "grab") && (i.style.cursor = ""), i.style.userSelect === "none" && (i.style.userSelect = ""), i.style.pointerEvents === "none" && (i.style.pointerEvents = ""), i.style.touchAction === "none" && (i.style.touchAction = "");
    }), document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]").forEach((a) => {
      const i = a;
      i.style.cursor = "", i.style.userSelect = "", i.style.pointerEvents = "auto", i.style.touchAction = "";
    }), this.log("🔄 重置所有元素样式");
  }
  async restorePosition() {
    try {
      this.position = ce(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Ye(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${De(this.position, this.isVerticalMode)}`);
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
        k.LAYOUT_MODE,
        this.pluginName,
        V()
      );
      if (e) {
        const t = Ke(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = ce(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.horizontalTabMaxWidth = t.horizontalTabMaxWidth, this.horizontalTabMinWidth = t.horizontalTabMinWidth, this.log(`📐 布局模式已恢复: ${Xe(t)}, 当前位置: (${this.position.x}, ${this.position.y})`), this.isSidebarAlignmentEnabled && (this.startSidebarAlignmentObserver(), this.log("🔄 侧边栏对齐监听器已启动"));
      } else {
        const t = V();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.horizontalTabMaxWidth = t.horizontalTabMaxWidth, this.horizontalTabMinWidth = t.horizontalTabMinWidth, this.position = ce(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
    }
  }
  /**
   * 从API配置恢复固定到顶部状态
   */
  async restoreFixedToTopMode() {
    try {
      const e = await this.storageService.getConfig(
        k.FIXED_TO_TOP,
        this.pluginName,
        { isFixedToTop: !1 }
      );
      e ? (this.isFixedToTop = e.isFixedToTop, this.log(`📌 固定到顶部状态已恢复: ${this.isFixedToTop ? "启用" : "禁用"}`)) : (this.isFixedToTop = !1, this.log("📌 固定到顶部状态: 禁用 (默认)"));
    } catch (e) {
      this.error("恢复固定到顶部状态失败:", e);
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const e = this.isVerticalMode ? Math.min(this.getCurrentPanelTabs().length * 28 + 8, window.innerHeight * 0.8) : 28;
    this.position = Aa(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var r, n;
    const a = (r = this.tabContainer) == null ? void 0 : r.querySelectorAll(".orca-tabs-plugin .orca-tab");
    a == null || a.forEach((o) => o.removeAttribute("data-focused"));
    const i = (n = this.tabContainer) == null ? void 0 : n.querySelector(`[data-tab-id="${e}"]`);
    i ? (i.setAttribute("data-focused", "true"), this.verboseLog(`🎯 更新聚焦状态到已存在的标签: "${t}"`)) : this.verboseLog(`⚠️ 未找到标签元素: ${e}`);
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
        const i = e.closest(".orca-panel");
        if (i) {
          const r = i.getAttribute("data-panel-id");
          r && this.handleNewBlockInPanel(a, r).catch((n) => {
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
      const i = a.getAttribute("data-block-id");
      if (i) {
        const r = e.closest(".orca-panel");
        if (r) {
          const n = r.getAttribute("data-panel-id");
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
    var g, p;
    if (!e || !t) return;
    if (this.verboseLog("🔍 [DEBUG] ========== handleNewBlockInPanel 开始 =========="), this.verboseLog(`🔍 [DEBUG] 参数: blockId=${e}, panelId=${t}`), this.isNavigating) {
      this.verboseLog(`⏭️ [DEBUG] 正在导航中，跳过 handleNewBlockInPanel: ${e}`);
      return;
    }
    if (this.isSwitchingTab) {
      this.verboseLog(`🔄 [DEBUG] 正在切换标签，跳过 handleNewBlockInPanel: ${e}`);
      return;
    }
    if (this.creatingTabs.has(e)) {
      this.verboseLog(`⏳ [DEBUG] 标签 ${e} 正在被其他地方创建（creatingTabs检查），立即跳过`);
      return;
    }
    const a = document.querySelector(".orca-panel.active"), i = a == null ? void 0 : a.getAttribute("data-panel-id");
    if (i && t !== i) {
      this.log(`🚫 忽略非激活面板 ${t} 中的新块 ${e}，当前激活面板为 ${i}`);
      return;
    }
    const n = this.getPanelIds().indexOf(t);
    if (n === -1) {
      const m = document.querySelectorAll(".orca-panel");
      if (!(m.length > 0 && m[0].getAttribute("data-panel-id") === t)) {
        this.log(`🚫 不管理辅助面板 ${t} 的标签页`);
        return;
      }
    }
    n !== -1 && (this.currentPanelIndex = n, this.currentPanelId = t);
    let o = this.getCurrentPanelTabs();
    this.verboseLog(`🔍 [DEBUG] 当前标签页数量: ${o.length}`);
    const c = o.find((m) => m.blockId === e);
    if (c) {
      this.verboseLog(`🔍 [DEBUG] ✅ 标签 ${e} 已存在，只更新聚焦状态`), this.closedTabs.has(e) && (this.closedTabs.delete(e), this.saveClosedTabs()), this.updateFocusState(e, c.title), this.immediateUpdateTabsUI(), this.verboseLog("🔍 [DEBUG] ========== handleNewBlockInPanel 完成（已存在）==========");
      return;
    }
    this.verboseLog(`🔍 [DEBUG] ❌ 标签 ${e} 不存在，准备创建新标签`), this.creatingTabs.add(e);
    let l = null;
    try {
      if (l = await this.createTabInfoFromBlock(e, t), !l) return;
      o = this.getCurrentPanelTabs();
      const m = o.find((b) => b.blockId === e);
      if (m) {
        this.log(`✅ 标签已被其他地方创建（在await期间），只更新聚焦状态: "${m.title}"`), this.updateFocusState(e, m.title), this.immediateUpdateTabsUI();
        return;
      }
    } finally {
      this.creatingTabs.delete(e);
    }
    const d = this.getCurrentActiveTab();
    if (d) {
      if (d.isPinned) {
        this.log(`📌 当前激活标签已置顶，创建新标签: "${l.title}"`);
        const b = o.filter((y) => y.isPinned).length;
        o.splice(b, 0, l), this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
        return;
      }
      const m = o.findIndex((b) => b.blockId === d.blockId);
      if (m !== -1) {
        this.verboseLog(`🔄 替换当前激活标签页: "${d.title}" -> "${l.title}"`), this.recordTabSwitchHistory(d.blockId, l), o[m] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const m = o.findIndex((b) => b.blockId === this.lastActiveBlockId);
      if (m !== -1) {
        if (o[m].isPinned) {
          this.log(`📌 上一个激活标签已置顶，创建新标签: "${l.title}"`);
          const y = o.filter((v) => v.isPinned).length;
          o.splice(y, 0, l), this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
          return;
        }
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${o[m].title}" -> "${l.title}"`), this.recordTabSwitchHistory(o[m].blockId, l), o[m] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
        return;
      }
    }
    let h = -1;
    const u = (g = this.tabContainer) == null ? void 0 : g.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (u) {
      const m = u.getAttribute("data-tab-id");
      h = o.findIndex((b) => b.blockId === m);
    }
    if (h === -1) {
      const m = (p = this.tabContainer) == null ? void 0 : p.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (m && m.length > 0)
        for (let b = 0; b < m.length; b++) {
          const y = m[b];
          if (y.classList.contains("focused") || y.getAttribute("data-focused") === "true" || y.classList.contains("active")) {
            h = b;
            break;
          }
        }
    }
    if (h === -1 && o.length > 0 && (h = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), h >= 0 && h < o.length)
      if (o[h].isPinned) {
        this.log(`📌 目标标签已置顶，创建新标签: "${l.title}"`);
        const b = o.filter((y) => y.isPinned).length;
        o.splice(b, 0, l), this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
      } else
        o[h] = l, this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
    else
      o = [l], this.updateFocusState(e, l.title), this.setCurrentPanelTabs(o), this.immediateUpdateTabsUI();
  }
  async checkCurrentPanelBlocks() {
    if (this.panelBlockCheckTask) {
      await this.panelBlockCheckTask;
      return;
    }
    this.panelBlockCheckTask = (async () => {
      var g;
      if (this.isNavigating) {
        this.verboseLog("⏭️ 正在导航中，跳过面板块检查");
        return;
      }
      this.verboseLog("🔍 开始检查当前面板块...");
      const e = document.querySelector(".orca-panel.active");
      if (!e) {
        this.log("❌ 没有找到当前激活的面板");
        const p = document.querySelectorAll(".orca-panel");
        this.log("📊 当前所有面板状态:"), p.forEach((m, b) => {
          const y = m.getAttribute("data-panel-id"), v = m.classList.contains("active");
          this.log(`  面板${b + 1}: ID=${y}, active=${v}`);
        });
        return;
      }
      const t = e.getAttribute("data-panel-id");
      if (!t) {
        this.log("❌ 激活面板没有 data-panel-id");
        return;
      }
      this.verboseLog(`✅ 找到激活面板: ID=${t}, class=${e.className}`);
      const a = this.getPanelIds().indexOf(t);
      a !== -1 && (this.currentPanelIndex = a, this.currentPanelId = t, this.verboseLog(`🔄 更新当前面板索引: ${a} (面板ID: ${t})`)), e.querySelectorAll(".orca-hideable");
      const i = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!i) {
        this.log(`❌ 激活面板 ${t} 中没有找到可见的块编辑器`);
        return;
      }
      const r = i.getAttribute("data-block-id");
      if (!r) {
        this.log("激活的块编辑器没有blockId");
        return;
      }
      let n = this.getCurrentPanelTabs();
      n.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), n = this.getCurrentPanelTabs());
      const o = n.find((p) => p.blockId === r);
      if (o) {
        this.closedTabs.has(r) && (this.closedTabs.delete(r), await this.saveClosedTabs()), this.updateFocusState(r, o.title), await this.immediateUpdateTabsUI();
        return;
      }
      const c = (g = this.tabContainer) == null ? void 0 : g.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
      if (!c) {
        this.verboseLog(`⚠️ 未找到聚焦的标签元素，当前块: ${r}`);
        return;
      }
      const l = c.getAttribute("data-tab-id");
      if (!l)
        return;
      const d = n.findIndex((p) => p.blockId === l);
      if (d === -1)
        return;
      if (n[d].isPinned) {
        this.log(`📌 聚焦标签已置顶，不替换，创建新标签: "${r}"`);
        const p = n.find((m) => m.blockId === r);
        if (p) {
          this.log(`✅ 标签已被其他地方创建，只更新聚焦状态: "${p.title}"`), this.updateFocusState(r, p.title), await this.immediateUpdateTabsUI();
          return;
        }
        if (this.creatingTabs.has(r)) {
          this.log(`⏳ 标签 ${r} 正在被其他地方创建，跳过`);
          return;
        }
        this.creatingTabs.add(r);
        try {
          const m = await this.getTabInfo(r, t, n.length);
          if (!m)
            return;
          n = this.getCurrentPanelTabs();
          const b = n.find((v) => v.blockId === r);
          if (b) {
            this.log(`✅ 标签在创建过程中已被其他地方创建: "${b.title}"`), this.updateFocusState(r, b.title), await this.immediateUpdateTabsUI();
            return;
          }
          const y = n.filter((v) => v.isPinned).length;
          n.splice(y, 0, m), this.updateFocusState(r, m.title), this.setCurrentPanelTabs(n), await this.immediateUpdateTabsUI();
        } finally {
          this.creatingTabs.delete(r);
        }
        return;
      }
      const u = await this.getTabInfo(r, t, d);
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
    new MutationObserver(async (r) => {
      let n = !1, o = !1, c = !1, l = this.currentPanelIndex;
      const d = Date.now(), h = this.lastPanelCheckTime || 0, u = 1e3;
      if (r.forEach((g) => {
        if (g.type === "childList") {
          const p = g.target;
          if ((p.classList.contains("orca-panels-row") || p.closest(".orca-panels-row")) && (o = !0), g.addedNodes.length > 0 && p.closest(".orca-panel")) {
            for (const b of g.addedNodes)
              if (b.nodeType === Node.ELEMENT_NODE) {
                const y = b;
                if (this.handleNewHideableElement(y)) {
                  n = !0;
                  break;
                }
                if (y.classList.contains("orca-block-editor") || y.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
                if (this.handleChildHideableElements(y)) {
                  n = !0;
                  break;
                }
              }
          }
        }
        if (g.type === "attributes" && g.attributeName === "class") {
          const p = g.target;
          if (p.classList.contains("orca-panel")) {
            if (c = !0, p.classList.contains("active")) {
              const m = p.getAttribute("data-panel-id"), b = p.querySelectorAll(".orca-hideable");
              let y = null;
              b.forEach((v) => {
                const T = v.classList.contains("orca-hideable-hidden"), x = v.querySelector(".orca-block-editor[data-block-id]"), w = x == null ? void 0 : x.getAttribute("data-block-id");
                !T && x && w && (y = w);
              }), y && m && this.handleNewBlockInPanel(y, m).catch((v) => {
                this.error(`处理面板激活时的新块失败: ${y}`, v);
              }), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 50), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 200);
            }
            p.classList.contains("orca-locked") && p.classList.contains("active") && (this.log("🔒 检测到锁定面板激活，聚焦上一个面板"), this.focusToPreviousPanel());
          }
          p.classList.contains("orca-hideable") && !p.classList.contains("orca-hideable-hidden") && (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦状态变化"), n = !0);
        }
      }), c && (await this.updateCurrentPanelIndex(), l !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${l} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), o && d - h > u ? (this.lastPanelCheckTime = d, this.verboseLog(`🔍 面板检查防抖：距离上次检查 ${d - h}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : o && d - h < 100 && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${d - h}ms`), n) {
        const g = Date.now(), p = 300, m = g - this.lastBlockCheckTime;
        m > p ? (this.lastBlockCheckTime = g, await this.checkCurrentPanelBlocks()) : m < 50 && this.verboseLog(`⏭️ 跳过块检查：距离上次检查仅 ${m}ms`);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class"]
    });
    let t = null, a = null;
    const i = async (r) => {
      const n = r.target;
      if (n.closest(".orca-tabs-plugin") || n.closest(".orca-sidebar") || n.closest(".orca-headbar"))
        return;
      const o = n.closest(".orca-hideable");
      if (o) {
        const c = o.querySelector(".orca-block-editor[data-block-id]"), l = c == null ? void 0 : c.getAttribute("data-block-id");
        if (l && l === a) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个块 ${l}`);
          return;
        }
        t && clearTimeout(t), t = window.setTimeout(async () => {
          if (!o.classList.contains("orca-hideable-hidden")) {
            if (this.isNavigating) {
              this.verboseLog("⏭️ 正在导航中，跳过聚焦检测");
              return;
            }
            this.verboseLog("🎯 检测到 orca-hideable 元素聚焦变化"), l && (a = l), await this.checkCurrentPanelBlocks();
          }
          t = null;
        }, 0);
      }
    };
    document.addEventListener("click", i), document.addEventListener("focusin", i), document.addEventListener("keydown", (r) => {
      (r.key === "Tab" || r.key === "Enter" || r.key === " ") && (t && clearTimeout(t), t = window.setTimeout(i, 0));
    }), typeof window < "u" && (this.focusSyncInterval !== null && window.clearInterval(this.focusSyncInterval), this.focusSyncInterval = window.setInterval(async () => {
      var r;
      try {
        const n = document.querySelector(".orca-panel.active");
        if (n) {
          const o = n.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (o) {
            const c = o.getAttribute("data-block-id");
            if (c) {
              const l = (r = this.tabContainer) == null ? void 0 : r.querySelector('.orca-tab[data-focused="true"]'), d = !!l;
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
      const a = t[0], i = this.getPanelIds()[0];
      a && i && a !== i && (this.log(`🔄 第一个面板已变更: ${a} -> ${i}`), await this.handleFirstPanelChange(a, i)), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 更新持久化面板索引为: 0")), await this.createTabsUI();
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
          const i = this.currentPanelIndex;
          this.currentPanelIndex = a, this.currentPanelId = t, this.log(`🔄 面板索引更新: ${i} -> ${a} (面板ID: ${t})`), (!this.panelTabsData[a] || this.panelTabsData[a].length === 0) && (this.log(`🔍 面板 ${t} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(a, t || "")), this.debouncedUpdateTabsUI();
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
    }, document.addEventListener("click", this.globalEventListener, {
      passive: !1,
      // 不能使用 passive，需要调用 preventDefault()
      capture: !0
      // 【关键】在捕获阶段处理，先于 Orca 原生处理
    }), document.addEventListener("contextmenu", this.globalEventListener, { passive: !1 });
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
    const a = t - 1, i = e[a];
    if (!i) {
      this.log("⚠️ 未找到上一个面板");
      return;
    }
    this.log(`🔄 聚焦到上一个面板: ${i} (索引: ${a})`);
    const r = document.querySelector(`.orca-panel[data-panel-id="${i}"]`);
    if (!r) {
      this.log(`❌ 未找到面板元素: ${i}`);
      return;
    }
    const n = document.querySelector(".orca-panel.active");
    n && n.classList.remove("active"), r.classList.add("active"), this.currentPanelIndex = a, this.currentPanelId = i, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${i}`);
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
    const t = e.target;
    if ((e.ctrlKey || e.metaKey) && t) {
      this.verboseLog(`🖱️ [DEBUG] Ctrl+点击检测: ctrlKey=${e.ctrlKey}, metaKey=${e.metaKey}`), this.verboseLog(`🖱️ [DEBUG] 点击目标: ${t.tagName}, classes: ${t.className}`);
      const a = this.getBlockRefId(t);
      if (a) {
        this.verboseLog(`🔗 [DEBUG] 检测到 Ctrl+点击 块引用: ${a}`), this.verboseLog(`🔒 [DEBUG] 立即将块 ${a} 添加到 creatingTabs（防止Orca原生导航触发重复创建）`), this.creatingTabs.add(a), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.verboseLog(`🔗 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`), this.verboseLog(`🔗 [DEBUG] 当前标签页数量: ${this.getCurrentPanelTabs().length}`), this.openInNewTab(a).catch((i) => {
          this.error("[DEBUG] Ctrl+点击创建标签失败:", i), this.creatingTabs.delete(a);
        });
        return;
      } else
        this.verboseLog("🔗 [DEBUG] 未能从点击目标获取块引用ID");
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
      const a = [...this.getPanelIds()], i = this.getPanelIds()[0] || null;
      await this.discoverPanels();
      const r = this.getPanelIds()[0] || null, n = qa(a, this.getPanelIds());
      n && (this.log(`📋 面板列表发生变化: ${a.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${a.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${i} -> ${r}`), i !== r && (this.log(`🔄 持久化面板已变更: ${i} -> ${r}`), await this.handlePersistentPanelChange(i, r))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
      const o = document.querySelector(".orca-panel.active");
      if (o) {
        const c = o.getAttribute("data-panel-id");
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
    const a = t.querySelectorAll(".orca-hideable"), i = [];
    let r = 0;
    for (const n of a) {
      const o = n.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, e, r++);
      l && i.push(l);
    }
    this.panelTabsData[0] = [...i], this.panelTabsData[0] = [...i], this.log(`📋 持久化面板 ${e} (索引: 0) 扫描并保存了 ${i.length} 个标签页`);
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
    const i = a.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let n = 0;
    this.log(`🔍 扫描面板 ${t}，找到 ${i.length} 个块编辑器`);
    for (const c of i) {
      const l = c.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, t, n++);
      d && (r.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    e >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[e] = [...r], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${r.length} 个标签页`);
    const o = e === 0 ? k.FIRST_PANEL_TABS : `panel_${e + 1}_tabs`;
    await this.savePanelTabsByKey(o, r);
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
    const i = a.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let n = 0;
    this.log(`🔍 扫描当前聚焦面板 ${t}，找到 ${i.length} 个块编辑器`);
    for (const l of i) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const h = await this.getTabInfo(d, t, n++);
      h && (r.push(h), this.log(`📋 找到当前标签页: ${h.title} (${d})`));
    }
    const o = this.panelTabsData[e] || [];
    this.log(`📋 已加载的标签页: ${o.length} 个，当前标签页: ${r.length} 个`);
    const c = [...o];
    for (const l of r)
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
    let i = 0;
    for (const n of t) {
      const o = n.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId || "", i++);
      l && a.push(l);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...a], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页`);
    const r = this.currentPanelIndex === 0 ? k.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(r, a);
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(e, t) {
    this.log(`🔄 处理第一个面板变更: ${e} -> ${t}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ""}, currentPanelIndex=${this.currentPanelIndex}`);
    const a = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${a.length} 个标签页`), a.length > 0 ? (this.log(`📋 迁移当前面板的 ${a.length} 个标签页到持久化存储`), this.panelTabsData[0] = [...a], this.log("🔄 持久化面板索引已简化，不再需要更新")) : (this.log("🗑️ 当前面板没有标签数据，清空并重新扫描"), this.panelTabsData[0] = [], await this.scanFirstPanel()), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`), this.log("✅ 持久化标签页:", this.getCurrentPanelTabs().map((i) => `${i.title}(${i.blockId})`));
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, a = this.recentlyClosedTabs.map((i, r) => ({
      label: `${i.title}`,
      icon: i.icon || Q(i.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(i, r)
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
    var p, m;
    const a = document.querySelector(".recently-closed-tabs-menu");
    a && a.remove();
    const i = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", r = document.createElement("div");
    r.className = "recently-closed-tabs-menu";
    const n = 280, o = 350, { x: c, y: l } = X(t.x, t.y, n, o);
    r.style.cssText = `
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
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((b, y) => {
      if (b.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, r.appendChild(x);
        return;
      }
      const v = document.createElement("div");
      if (v.className = "recently-closed-menu-item", v.style.cssText = `
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
      `, b.icon) {
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
        `, b.icon.startsWith("ti ti-")) {
          const w = document.createElement("i");
          w.className = b.icon, x.appendChild(w);
        } else
          x.textContent = b.icon;
        v.appendChild(x);
      }
      const T = document.createElement("span");
      T.textContent = b.label, T.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, v.appendChild(T), v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "transparent";
      }), v.addEventListener("click", () => {
        b.onClick(), r.remove();
      }), r.appendChild(v);
    }), document.body.appendChild(r);
    const d = r.getBoundingClientRect(), h = window.innerWidth, u = window.innerHeight;
    d.right > h && (r.style.left = `${h - d.width - 10}px`), d.bottom > u && (r.style.top = `${u - d.height - 10}px`);
    const g = (b) => {
      r.contains(b.target) || (r.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
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
    })), this.savedTabSets.forEach((i, r) => {
      a.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: i.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, r)
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
    }), this.savedTabSets.forEach((i, r) => {
      a.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, r)
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
    var p, m;
    const a = document.querySelector(".multi-tab-saving-menu");
    a && a.remove();
    const i = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", r = document.createElement("div");
    r.className = "multi-tab-saving-menu";
    const n = 300, o = 400, { x: c, y: l } = X(t.x, t.y, n, o);
    r.style.cssText = `
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
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((b, y) => {
      if (b.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, r.appendChild(x);
        return;
      }
      const v = document.createElement("div");
      if (v.className = "multi-tab-saving-menu-item", v.style.cssText = `
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
      `, b.icon) {
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
        `, b.icon.startsWith("ti ti-")) {
          const w = document.createElement("i");
          w.className = b.icon, x.appendChild(w);
        } else
          x.textContent = b.icon;
        v.appendChild(x);
      }
      const T = document.createElement("span");
      T.textContent = b.label, T.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, v.appendChild(T), v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "transparent";
      }), v.addEventListener("click", () => {
        b.onClick(), r.remove();
      }), r.appendChild(v);
    }), document.body.appendChild(r);
    const d = r.getBoundingClientRect(), h = window.innerWidth, u = window.innerHeight;
    d.right > h && (r.style.left = `${h - d.width - 10}px`), d.bottom > u && (r.style.top = `${u - d.height - 10}px`);
    const g = (b) => {
      r.contains(b.target) || (r.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
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
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, a.textContent = "保存标签页集合", t.appendChild(a);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 0 20px;
    `;
    const r = document.createElement("div");
    r.style.cssText = `
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
      c = !1, n.className = "orca-button orca-button-secondary", n.style.cssText = "flex: 1;", o.className = "orca-button", o.style.cssText = "flex: 1;", h.style.display = "block", p.style.display = "none", w();
    }, d = () => {
      c = !0, o.className = "orca-button orca-button-secondary", o.style.cssText = "flex: 1;", n.className = "orca-button", n.style.cssText = "flex: 1;", h.style.display = "none", p.style.display = "block", w();
    };
    n.onclick = l, o.onclick = d, r.appendChild(n), r.appendChild(o), i.appendChild(r);
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
    const p = document.createElement("div");
    p.style.cssText = `
      display: none;
    `;
    const m = document.createElement("label");
    m.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, m.textContent = "请选择要更新的标签页集合:", p.appendChild(m);
    const b = document.createElement("select");
    b.style.cssText = `
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
    `, b.addEventListener("focus", () => {
      b.style.borderColor = "var(--orca-color-primary-5)";
    }), b.addEventListener("blur", () => {
      b.style.borderColor = "#ddd";
    });
    const y = document.createElement("option");
    y.value = "", y.textContent = "请选择标签页集合...", b.appendChild(y), this.savedTabSets.forEach((C, j) => {
      const G = document.createElement("option");
      G.value = j.toString(), G.textContent = `${C.name} (${C.tabs.length}个标签)`, b.appendChild(G);
    }), p.appendChild(b), i.appendChild(h), i.appendChild(p), t.appendChild(i);
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
    const w = () => {
      x.textContent = c ? "更新" : "保存";
    };
    x.onclick = async () => {
      if (c) {
        const C = parseInt(b.value);
        if (isNaN(C) || C < 0 || C >= this.savedTabSets.length) {
          orca.notify("warn", "请选择要更新的标签页集合");
          return;
        }
        t.remove(), await this.performUpdateTabSet(C);
      } else {
        const C = g.value.trim();
        if (!C) {
          orca.notify("warn", "请输入名称");
          return;
        }
        t.remove(), await this.performSaveTabSet(C);
      }
    }, v.appendChild(T), v.appendChild(x), t.appendChild(v), document.body.appendChild(t), setTimeout(() => {
      g.focus(), g.select();
    }, 100), g.addEventListener("keydown", (C) => {
      C.key === "Enter" ? (C.preventDefault(), x.click()) : C.key === "Escape" && (C.preventDefault(), T.click());
    });
    const S = (C) => {
      t.contains(C.target) || (t.remove(), document.removeEventListener("click", S));
    };
    setTimeout(() => {
      document.addEventListener("click", S);
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
    `, a.addEventListener("click", (g) => {
      g.stopPropagation();
    });
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, i.textContent = "添加到已有标签组", a.appendChild(i);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 0 20px;
    `;
    const n = document.createElement("label");
    n.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, n.textContent = `将标签页 "${e.title}" 添加到:`, r.appendChild(n);
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
    c.value = "", c.textContent = "请选择标签组...", o.appendChild(c), this.savedTabSets.forEach((g, p) => {
      const m = document.createElement("option");
      m.value = p.toString(), m.textContent = `${g.name} (${g.tabs.length}个标签)`, o.appendChild(m);
    }), r.appendChild(o), a.appendChild(r);
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
      const g = parseInt(o.value);
      if (isNaN(g) || g < 0 || g >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      a.remove(), await this.addTabToGroup(e, g);
    }, l.appendChild(d), l.appendChild(h), a.appendChild(l), document.body.appendChild(a), setTimeout(() => {
      o.focus();
    }, 100), o.addEventListener("keydown", (g) => {
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
  async addTabToGroup(e, t) {
    try {
      const a = this.savedTabSets[t];
      if (!a) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (a.tabs.find((r) => r.blockId === e.blockId)) {
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
      for (const i of e.tabs) {
        const r = { ...i, panelId: this.currentPanelId || "" };
        a.push(r);
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
        const i = { ...a, panelId: this.currentPanelId || "" };
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
  renderSortableTabs(e, t, a) {
    var n, o;
    const i = document.documentElement.classList.contains("dark") || ((o = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : o.themeMode) === "dark";
    e.innerHTML = "";
    let r = -1;
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
        const b = document.createElement("div");
        if (b.style.cssText = `
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
          y.className = c.icon, b.appendChild(y);
        } else
          b.textContent = c.icon;
        d.appendChild(b);
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
      const p = document.createElement("div");
      p.style.cssText = `
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
      `, m.textContent = (l + 1).toString(), p.appendChild(m), d.appendChild(p), d.addEventListener("dragstart", (b) => {
        this.verboseLog("拖拽开始，索引:", l), r = l, b.dataTransfer.setData("text/plain", l.toString()), b.dataTransfer.setData("application/json", JSON.stringify(c)), b.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (b) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", r = -1;
      }), d.addEventListener("dragover", (b) => {
        b.preventDefault(), b.dataTransfer.dropEffect = "move", r !== -1 && r !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (b) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (b) => {
        b.preventDefault(), b.stopPropagation();
        const y = parseInt(b.dataTransfer.getData("text/plain")), v = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", y !== v && y >= 0) {
          const T = t[y];
          t.splice(y, 1), t.splice(v, 0, T), this.renderSortableTabs(e, t);
          const x = this.savedTabSets.find((w) => w.tabs === t);
          x && (x.tabs = [...t], x.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
      }), d.addEventListener("mouseenter", () => {
        r === -1 && (d.style.backgroundColor = "rgba(59, 130, 246, 0.05)", d.style.borderColor = "var(--orca-color-primary-5)");
      }), d.addEventListener("mouseleave", () => {
        r === -1 && (d.style.backgroundColor = "var(--orca-color-bg-1)", d.style.borderColor = "#e0e0e0");
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
    const a = await this.tabStorageService.loadTabsBeforeWorkspace();
    a && a.length > 0 && (this.tabsBeforeWorkspace = a, this.log(`📁 发现保存的标签页组数据: ${this.tabsBeforeWorkspace.length}个标签页，将在初始化后恢复`), this.shouldRestoreTabsBeforeWorkspace = !0);
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces() {
    await this.tabStorageService.saveWorkspaces(this.workspaces, this.currentWorkspace, this.enableWorkspaces);
  }
  /**
   * 恢复标签页组但不保存到持久化存储
   * 用于退出工作区时恢复原始标签页组
   */
  async restoreTabsWithoutSaving(e) {
    try {
      this.panelTabsData[0] = [], this.panelTabsData[1] = [];
      const t = [];
      for (const a of e)
        try {
          const i = await this.getTabInfo(a.blockId, this.currentPanelId || "", t.length);
          i ? (i.isPinned = a.isPinned, i.order = a.order, i.scrollPosition = a.scrollPosition, t.push(i)) : t.push(a);
        } catch (i) {
          this.warn(`无法更新标签页信息 ${a.title}:`, i), t.push(a);
        }
      this.panelTabsData[0] = t, await this.updateTabsUI(), this.log(`📋 已恢复标签页组，共 ${t.length} 个标签（未保存到持久化存储）`);
    } catch (t) {
      throw this.error("恢复标签页组失败:", t), t;
    }
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
      await this.clearCurrentWorkspace(), await this.saveWorkspaces(), this.tabsBeforeWorkspace && this.tabsBeforeWorkspace.length > 0 ? (this.log(`🔄 恢复到进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`), await this.restoreTabsWithoutSaving(this.tabsBeforeWorkspace), this.tabsBeforeWorkspace = null, await this.tabStorageService.clearTabsBeforeWorkspace(), orca.notify("success", "已退出工作区并恢复之前的标签页组")) : orca.notify("success", "已退出工作区"), this.log("🚪 已退出工作区");
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
      const i = document.createElement("div");
      i.style.cssText = `
        font-size: 18px;
        font-weight: 600;
        color: var(--orca-color-text-1);
        margin-bottom: var(--orca-spacing-md);
      `, i.textContent = "退出工作区";
      const r = document.createElement("div");
      r.style.cssText = `
        font-size: 14px;
        color: var(--orca-color-text-2);
        line-height: 1.5;
        margin-bottom: var(--orca-spacing-lg);
      `, r.textContent = this.tabsBeforeWorkspace && this.tabsBeforeWorkspace.length > 0 ? "确定要退出当前工作区吗？退出后将恢复到进入工作区之前的标签页组。" : "确定要退出当前工作区吗？退出后当前工作区的标签页将不会保存。";
      const n = document.createElement("div");
      n.style.cssText = `
        display: flex;
        gap: var(--orca-spacing-sm);
        justify-content: flex-end;
      `;
      const o = document.createElement("button");
      o.textContent = "取消", o.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-bg-1);
        color: var(--orca-color-text-1);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `, o.addEventListener("click", () => {
        a.remove(), e(!1);
      });
      const c = document.createElement("button");
      c.textContent = "确认", c.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-primary);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-primary);
        color: var(--orca-color-text-on-primary);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `, c.addEventListener("click", () => {
        a.remove(), e(!0);
      }), o.addEventListener("mouseenter", () => {
        o.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), o.addEventListener("mouseleave", () => {
        o.style.backgroundColor = "var(--orca-color-bg-1)";
      }), c.addEventListener("mouseenter", () => {
        c.style.opacity = "0.9";
      }), c.addEventListener("mouseleave", () => {
        c.style.opacity = "1";
      }), n.appendChild(o), n.appendChild(c), a.appendChild(i), a.appendChild(r), a.appendChild(n), document.body.appendChild(a);
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
    var p, m;
    const e = document.querySelector(".save-workspace-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", a = document.createElement("div");
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
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px;
    `;
    const r = document.createElement("div");
    r.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, r.textContent = "保存工作区";
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
      const b = o.value.trim();
      if (!b) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((y) => y.name === b)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(b, l.value.trim()), a.remove();
    }, d.appendChild(h), d.appendChild(u), i.appendChild(r), i.appendChild(n), i.appendChild(o), i.appendChild(c), i.appendChild(l), i.appendChild(d), a.appendChild(i), document.body.appendChild(a), o.focus(), a.addEventListener("click", (b) => {
      b.target === a && a.remove();
    });
    const g = (b) => {
      b.key === "Escape" && (a.remove(), document.removeEventListener("keydown", g));
    };
    document.addEventListener("keydown", g);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const a = this.getCurrentPanelTabs(), i = this.getCurrentActiveTab(), r = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: a,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: i ? i.blockId : void 0
      };
      this.workspaces.push(r), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${a.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (a) {
      this.error("保存工作区失败:", a), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(e) {
    var v, T;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const a = document.documentElement.classList.contains("dark") || ((T = (v = window.orca) == null ? void 0 : v.state) == null ? void 0 : T.themeMode) === "dark", i = document.createElement("div");
    i.className = "workspace-menu";
    const r = 280, n = 400, o = e ? { x: e.clientX, y: e.clientY } : { x: 20, y: 60 }, { x: c, y: l } = X(o.x, o.y, r, n);
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
      i.remove(), this.saveCurrentWorkspace();
    };
    const g = document.createElement("div");
    if (g.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const x = document.createElement("div");
      x.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${a ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, x.textContent = "暂无工作区", g.appendChild(x);
    } else
      this.workspaces.forEach((x) => {
        const w = document.createElement("div");
        w.style.cssText = `
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
        const S = x.icon || "ti ti-folder";
        w.innerHTML = `
          <i class="${S}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: var(--orca-color-text-1);"">${x.name}</div>
            ${x.description ? `<div style="font-size: 12px; color: ${a ? "#999" : "#666"}; margin-top: 2px;">${x.description}</div>` : ""}
            <div style="font-size: 11px; color: ${a ? "#777" : "#999"}; margin-top: 2px;">${x.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === x.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ""}
        `, w.addEventListener("mouseenter", () => {
          w.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), w.addEventListener("mouseleave", () => {
          w.style.backgroundColor = this.currentWorkspace === x.id ? "rgba(59, 130, 246, 0.1)" : "transparent";
        }), w.onclick = () => {
          i.remove(), this.switchToWorkspace(x.id);
        }, g.appendChild(w);
      });
    const p = document.createElement("div");
    p.className = "workspace-menu-item", p.setAttribute("data-action", "manage"), p.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-family: var(--orca-fontfamily-ui);
      font-size: var(--orca-fontsize-sm);
      display: flex;
      align-items: center;
      border-radius: var(--orca-radius-md);
      color: var(--orca-color-text-1);
    `;
    const m = document.createElement("span");
    m.textContent = "管理工作区", m.style.cssText = `
      margin-right: var(--orca-spacing-md);
    `, p.appendChild(m), p.addEventListener("mouseenter", () => {
      p.style.backgroundColor = "var(--orca-color-menu-highlight)";
    }), p.addEventListener("mouseleave", () => {
      p.style.backgroundColor = "transparent";
    }), p.onclick = () => {
      i.remove(), this.manageWorkspaces();
    };
    let b = null;
    if (this.currentWorkspace) {
      b = document.createElement("div"), b.className = "workspace-menu-item", b.setAttribute("data-action", "exit-workspace"), b.style.cssText = `
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
      `, b.appendChild(x), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.onclick = () => {
        i.remove(), this.exitWorkspace();
      };
    }
    i.appendChild(d), i.appendChild(h), i.appendChild(g), i.appendChild(p), b && i.appendChild(b), document.body.appendChild(i);
    const y = (x) => {
      i.contains(x.target) || (i.remove(), document.removeEventListener("click", y));
    };
    setTimeout(() => {
      document.addEventListener("click", y);
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
      if (!this.currentWorkspace && !this.tabsBeforeWorkspace) {
        const a = this.getCurrentPanelTabs();
        this.tabsBeforeWorkspace = [...a], await this.tabStorageService.saveTabsBeforeWorkspace(this.tabsBeforeWorkspace), this.log(`💾 保存了进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`);
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
      for (const r of e)
        try {
          const n = await this.getTabInfo(r.blockId, this.currentPanelId || "", a.length);
          n ? (n.isPinned = r.isPinned, n.order = r.order, n.scrollPosition = r.scrollPosition, a.push(n)) : a.push(r);
        } catch (n) {
          this.warn(`无法更新标签页信息 ${r.title}:`, n), a.push(r);
        }
      this.panelTabsData[0] = a, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...a], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const i = t.lastActiveTabId;
      setTimeout(async () => {
        if (a.length > 0) {
          let r = a[0];
          if (i) {
            const n = a.find((o) => o.blockId === i);
            n ? (r = n, this.log(`🎯 导航到工作区中最后激活的标签页: ${r.title} (ID: ${i})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${r.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${r.title}`);
          await this.safeNavigate(r.blockId, this.currentPanelId || "");
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
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px;
    `;
    const r = document.createElement("div");
    r.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, r.textContent = "管理工作区";
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
        const p = u.icon || "ti ti-folder";
        g.innerHTML = `
          <i class="${p}" style="font-size: 20px; color: var(--orca-color-primary-5); margin-right: 12px;"></i>
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
        `, g.addEventListener("mouseenter", () => {
          g.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), g.addEventListener("mouseleave", () => {
          g.style.backgroundColor = this.currentWorkspace === u.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)";
        }), n.appendChild(g);
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
      a.remove();
    }, o.appendChild(c), i.appendChild(r), i.appendChild(n), i.appendChild(o), a.appendChild(i), document.body.appendChild(a), a.querySelectorAll(".delete-workspace-btn").forEach((u) => {
      u.addEventListener("click", async (g) => {
        const p = g.target.getAttribute("data-workspace-id");
        p && (await this.deleteWorkspace(p), a.remove(), this.manageWorkspaces());
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
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, r.textContent = `标签集合详情: ${e.name}`, i.appendChild(r);
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
      const g = document.createElement("div");
      g.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `, g.textContent = "该标签集合为空", n.appendChild(g);
    } else {
      const g = document.createElement("div");
      g.style.cssText = `
        margin-bottom: 16px;
      `;
      const p = document.createElement("div");
      p.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const m = document.createElement("span");
      m.textContent = "包含的标签 (可拖拽排序):", p.appendChild(m);
      const b = document.createElement("span");
      b.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, b.textContent = "拖拽调整顺序", p.appendChild(b), g.appendChild(p);
      const y = document.createElement("div");
      y.className = "sortable-tabs-container", y.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(y, [...e.tabs], e), g.appendChild(y), n.appendChild(g);
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
    const d = (g) => {
      i.contains(g.target) || (i.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, a) {
    const i = document.querySelector(".rename-tabset-dialog");
    i && i.remove();
    const r = document.createElement("div");
    r.className = "rename-tabset-dialog", r.style.cssText = `
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
    `, n.textContent = "重命名标签集合", r.appendChild(n);
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
    }), o.appendChild(l), r.appendChild(o);
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
      r.remove(), this.manageSavedTabSets();
    };
    const u = document.createElement("button");
    u.className = "orca-button orca-button-primary", u.textContent = "保存", u.style.cssText = "", u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#2563eb";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "var(--orca-color-primary-5)";
    }), u.onclick = async () => {
      const p = l.value.trim();
      if (!p) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (p === e.name) {
        r.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((b) => b.name === p && b.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = p, e.updatedAt = Date.now(), await this.saveSavedTabSets(), r.remove(), a.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(h), d.appendChild(u), r.appendChild(d), document.body.appendChild(r), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), u.click()) : p.key === "Escape" && (p.preventDefault(), h.click());
    });
    const g = (p) => {
      r.contains(p.target) || (r.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, a, i) {
    const r = document.createElement("input");
    r.type = "text", r.value = e.name, r.style.cssText = `
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
    a.innerHTML = "", a.appendChild(r), r.addEventListener("click", (d) => {
      d.stopPropagation();
    }), r.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), r.focus(), r.select();
    const o = async () => {
      const d = r.value.trim();
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
    r.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), o()) : d.key === "Escape" && (d.preventDefault(), c());
    });
    let l = null;
    r.addEventListener("blur", () => {
      l && clearTimeout(l), l = window.setTimeout(() => {
        o();
      }, 100);
    }), r.addEventListener("focus", () => {
      l && (clearTimeout(l), l = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, a, i, r) {
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
    `, l.forEach((p) => {
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
        background: ${e.icon === p.value ? "#e3f2fd" : "white"};
      `;
      const b = document.createElement("div");
      if (b.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, p.value.startsWith("ti ti-")) {
        const v = document.createElement("i");
        v.className = p.value, b.appendChild(v);
      } else
        b.textContent = p.icon;
      const y = document.createElement("div");
      y.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, y.textContent = p.name, m.appendChild(b), m.appendChild(y), m.addEventListener("click", async (v) => {
        v.stopPropagation(), e.icon = p.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i(), n.remove(), r && r.focus(), orca.notify("success", "图标已更新");
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "#f5f5f5", m.style.borderColor = "var(--orca-color-primary-5)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = e.icon === p.value ? "#e3f2fd" : "white", m.style.borderColor = "#e0e0e0";
      }), d.appendChild(m);
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
    }), u.onclick = (p) => {
      p.stopPropagation(), n.remove(), r && r.focus();
    }, h.appendChild(u), n.appendChild(h), document.body.appendChild(n);
    const g = (p) => {
      n.contains(p.target) || (p.stopPropagation(), n.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g), r && r.focus());
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
      `, D(u, H("点击编辑图标"));
      const g = () => {
        if (u.innerHTML = "", c.icon)
          if (c.icon.startsWith("ti ti-")) {
            const w = document.createElement("i");
            w.className = c.icon, u.appendChild(w);
          } else
            u.textContent = c.icon;
        else
          u.textContent = "📁";
      };
      g(), u.addEventListener("click", () => {
        this.editTabSetIcon(c, l, u, g, t);
      }), u.addEventListener("mouseenter", () => {
        u.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), u.addEventListener("mouseleave", () => {
        u.style.backgroundColor = "transparent";
      });
      const p = document.createElement("div");
      p.style.cssText = `
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
      `, m.textContent = c.name, D(m, H("点击编辑名称")), m.addEventListener("click", () => {
        this.editTabSetName(c, l, m, t);
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      });
      const b = document.createElement("div");
      b.style.cssText = `
        font-size: 12px;
        color: #666;
      `, b.textContent = `${c.tabs.length}个标签 • ${new Date(c.updatedAt).toLocaleString()}`, p.appendChild(m), p.appendChild(b), h.appendChild(u), h.appendChild(p);
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
      }, y.appendChild(v), y.appendChild(T), y.appendChild(x), d.appendChild(h), d.appendChild(y), i.appendChild(d);
    }), t.appendChild(i);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const n = document.createElement("button");
    n.className = "orca-button", n.textContent = "关闭", n.style.cssText = "", n.addEventListener("mouseenter", () => {
      n.style.backgroundColor = "#4b5563";
    }), n.addEventListener("mouseleave", () => {
      n.style.backgroundColor = "#6b7280";
    }), n.onclick = () => t.remove(), r.appendChild(n), t.appendChild(r), document.body.appendChild(t);
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
    const t = e.healthScore || 0, a = ((i = e.issues) == null ? void 0 : i.length) || 0;
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
  trackOptimizedResource(e, t, a, i) {
    if (!this.performanceOptimizer)
      return e.addEventListener(t, a, i), null;
    const r = this.performanceOptimizer.trackEventListener(e, t, a, i);
    return r && this.verboseLog(`👂 跟踪事件监听器: ${t} -> ${r}`), r;
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
      e && e.remove(), this.focusSyncInterval !== null && (typeof window < "u" ? window.clearInterval(this.focusSyncInterval) : clearInterval(this.focusSyncInterval), this.focusSyncInterval = null), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener, { capture: !0 }), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null, this.log("✅ 插件销毁完成");
    } catch (e) {
      this.error("❌ 插件销毁过程中发生错误:", e);
    }
  }
}
let P = null;
async function Ga(s) {
  J = s, orca.state.locale, P = new Va(J), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => P == null ? void 0 : P.init(), 500);
  }) : setTimeout(() => P == null ? void 0 : P.init(), 500), orca.commands.registerCommand(
    `${J}.resetCache`,
    async () => {
      P && await P.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${J}.toggleBlockIcons`,
    async () => {
      P && await P.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function Ya() {
  P && (P.unregisterHeadbarButton(), P.cleanupDragResize(), P.destroy(), P = null), orca.commands.unregisterCommand(`${J}.resetCache`);
}
export {
  Ga as load,
  Ya as unload
};
