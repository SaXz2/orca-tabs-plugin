var Rt = Object.defineProperty;
var Ut = (n, t, e) => t in n ? Rt(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var x = (n, t, e) => Ut(n, typeof t != "symbol" ? t + "" : t, e);
const Ct = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, Et = {
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
}, J = {
  /** 全局切换历史记录最大数量 - 限制全局标签页切换历史记录的最大数量 */
  GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS: 10
};
class _t {
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
      const i = typeof e == "string" ? e : JSON.stringify(e);
      return await orca.plugins.setData(a, t, i), this.log(`💾 已保存插件数据 ${t}:`, e), !0;
    } catch (i) {
      return this.error(`无法保存插件数据 ${t}:`, i), !1;
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
      const i = await orca.plugins.getData(e, t);
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
      return this.log(`📂 已读取插件数据 ${t}:`, r), r;
    } catch (i) {
      return this.error(`无法读取插件数据 ${t}:`, i), a || null;
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
      return this.error(`无法删除插件数据 ${t}:`, a), !1;
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
      const t = "test string";
      await this.saveConfig("test-string", t);
      const e = await this.getConfig("test-string", "orca-tabs-plugin");
      this.log(`字符串测试: ${t === e ? "✅" : "❌"}`);
      const a = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", a);
      const i = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(a) === JSON.stringify(i) ? "✅" : "❌"}`);
      const r = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", r);
      const o = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(r) === JSON.stringify(o) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (t) {
      this.error("API配置序列化测试失败:", t);
    }
  }
}
function H() {
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
function Ht(n, t, e = 200) {
  const a = t ? e : 400, i = 40, r = window.innerWidth - a, o = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(n.x, r)),
    y: Math.max(0, Math.min(n.y, o))
  };
}
function qt(n) {
  const t = H();
  return {
    isVerticalMode: n.isVerticalMode ?? t.isVerticalMode,
    verticalWidth: n.verticalWidth ?? t.verticalWidth,
    verticalPosition: n.verticalPosition ?? t.verticalPosition,
    horizontalPosition: n.horizontalPosition ?? t.horizontalPosition,
    isSidebarAlignmentEnabled: n.isSidebarAlignmentEnabled !== void 0 ? n.isSidebarAlignmentEnabled : t.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: n.isFloatingWindowVisible ?? t.isFloatingWindowVisible,
    showBlockTypeIcons: n.showBlockTypeIcons ?? t.showBlockTypeIcons,
    showInHeadbar: n.showInHeadbar ?? t.showInHeadbar,
    horizontalTabMaxWidth: n.horizontalTabMaxWidth ?? t.horizontalTabMaxWidth,
    horizontalTabMinWidth: n.horizontalTabMinWidth ?? t.horizontalTabMinWidth
  };
}
function rt(n, t, e) {
  return n ? { ...t } : { ...e };
}
function Vt(n, t, e, a) {
  return t ? {
    verticalPosition: { ...n },
    horizontalPosition: { ...a }
  } : {
    verticalPosition: { ...e },
    horizontalPosition: { ...n }
  };
}
function jt(n) {
  return `布局模式: ${n.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${n.verticalWidth}px, 垂直位置: (${n.verticalPosition.x}, ${n.verticalPosition.y}), 水平位置: (${n.horizontalPosition.x}, ${n.horizontalPosition.y})`;
}
function St(n, t) {
  return `位置已${t ? "垂直" : "水平"}模式 (${n.x}, ${n.y})`;
}
class Yt {
  constructor(t, e, a) {
    x(this, "storageService");
    x(this, "pluginName");
    x(this, "log");
    x(this, "warn");
    x(this, "error");
    x(this, "verboseLog");
    this.storageService = t, this.pluginName = e, this.log = a.log, this.warn = a.warn, this.error = a.error, this.verboseLog = a.verboseLog;
  }
  // ==================== 标签页数据存储 ====================
  /**
   * 保存第一个面板的标签数据到持久化存储
   */
  async saveFirstPanelTabs(t) {
    try {
      await this.storageService.saveConfig(k.FIRST_PANEL_TABS, t, this.pluginName), this.log(`💾 保存第一个面板的 ${t.length} 个标签页数据到API配置`);
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据
   */
  async restoreFirstPanelTabs() {
    try {
      const t = await this.storageService.getConfig(k.FIRST_PANEL_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(k.CLOSED_TABS, Array.from(t), this.pluginName), this.log("💾 保存已关闭标签列表到API配置");
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  async restoreClosedTabs() {
    try {
      const t = await this.storageService.getConfig(k.CLOSED_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(k.RECENTLY_CLOSED_TABS, t, this.pluginName), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (e) {
      this.warn("无法保存最近关闭标签页列表:", e);
    }
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表
   */
  async restoreRecentlyClosedTabs() {
    try {
      const t = await this.storageService.getConfig(k.RECENTLY_CLOSED_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(k.SAVED_TAB_SETS, t, this.pluginName), this.log("💾 保存多标签页集合到API配置");
    } catch (e) {
      this.warn("无法保存多标签页集合:", e);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合
   */
  async restoreSavedTabSets() {
    try {
      const t = await this.storageService.getConfig(k.SAVED_TAB_SETS, this.pluginName, []);
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
      const t = await this.storageService.getConfig(k.WORKSPACES), e = t && Array.isArray(t) ? t : [], a = await this.storageService.getConfig(k.ENABLE_WORKSPACES), i = typeof a == "boolean" ? a : !1;
      return this.log(`📁 已加载 ${e.length} 个工作区`), { workspaces: e, enableWorkspaces: i };
    } catch (t) {
      return this.error("加载工作区数据失败:", t), { workspaces: [], enableWorkspaces: !1 };
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces(t, e, a) {
    try {
      await this.storageService.saveConfig(k.WORKSPACES, t, this.pluginName), await this.storageService.saveConfig(k.CURRENT_WORKSPACE, e, this.pluginName), await this.storageService.saveConfig(k.ENABLE_WORKSPACES, a, this.pluginName), this.log("💾 工作区数据已保存");
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
    } catch (t) {
      this.error("清除当前工作区状态失败:", t);
    }
  }
  /**
   * 保存进入工作区前的标签页组
   */
  async saveTabsBeforeWorkspace(t) {
    try {
      await this.storageService.saveConfig(k.TABS_BEFORE_WORKSPACE, t, this.pluginName), this.log(`💾 已保存进入工作区前的标签页组: ${t.length}个标签页`);
    } catch (e) {
      this.error("保存进入工作区前的标签页组失败:", e);
    }
  }
  /**
   * 加载进入工作区前的标签页组
   */
  async loadTabsBeforeWorkspace() {
    try {
      const t = await this.storageService.getConfig(k.TABS_BEFORE_WORKSPACE, this.pluginName);
      return t && t.length > 0 && this.log(`📁 已加载进入工作区前的标签页组: ${t.length}个标签页`), t;
    } catch (t) {
      return this.error("加载进入工作区前的标签页组失败:", t), null;
    }
  }
  /**
   * 清除进入工作区前的标签页组
   */
  async clearTabsBeforeWorkspace() {
    try {
      await this.storageService.saveConfig(k.TABS_BEFORE_WORKSPACE, null, this.pluginName), this.log("📁 已清除进入工作区前的标签页组");
    } catch (t) {
      this.error("清除进入工作区前的标签页组失败:", t);
    }
  }
  // ==================== 位置和布局配置 ====================
  /**
   * 保存位置信息
   */
  async savePosition(t, e, a, i) {
    try {
      const r = Vt(
        t,
        e,
        a,
        i
      );
      return await this.saveLayoutMode({
        isVerticalMode: e,
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
      }), this.log(`💾 位置已保存: ${St(t, e)}`), r;
    } catch {
      return this.warn("无法保存标签位置"), { verticalPosition: a, horizontalPosition: i };
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(t) {
    try {
      await this.storageService.saveConfig(k.LAYOUT_MODE, t, this.pluginName), this.log(`💾 布局模式已保存: ${t.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${t.verticalWidth}px, 垂直位置: (${t.verticalPosition.x}, ${t.verticalPosition.y}), 水平位置: (${t.horizontalPosition.x}, ${t.horizontalPosition.y})`);
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
        k.LAYOUT_MODE,
        this.pluginName,
        H()
      ), e = {
        ...H(),
        ...t
      };
      return this.log(`📂 恢复布局模式配置: ${e.isVerticalMode ? "垂直" : "水平"}`), e;
    } catch (t) {
      return this.warn("恢复布局模式配置失败:", t), H();
    }
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode(t) {
    try {
      const e = { isFixedToTop: t };
      await this.storageService.saveConfig(k.FIXED_TO_TOP, e, this.pluginName), this.log(`💾 固定到顶部状态已保存: ${t ? "启用" : "禁用"}`);
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
        k.FIXED_TO_TOP,
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
      await this.storageService.saveConfig(k.FLOATING_WINDOW_VISIBLE, t, this.pluginName), this.log(`💾 浮窗可见状态已保存: ${t ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("保存浮窗可见状态失败:", e);
    }
  }
  /**
   * 恢复浮窗可见状态
   */
  async restoreFloatingWindowVisible() {
    try {
      const e = await this.storageService.getConfig(k.FLOATING_WINDOW_VISIBLE, this.pluginName, !1) || !1;
      return this.log(`📱 恢复浮窗可见状态: ${e ? "显示" : "隐藏"}`), e;
    } catch (t) {
      return this.error("恢复浮窗可见状态失败:", t), !1;
    }
  }
  // ==================== 最近切换标签历史管理 ====================
  /**
   * 保存最近切换标签历史
   */
  async saveRecentTabSwitchHistory(t) {
    try {
      await this.storageService.saveConfig(k.RECENT_TAB_SWITCH_HISTORY, t, this.pluginName), this.verboseLog(`💾 保存最近切换标签历史: ${Object.keys(t).length} 个标签的历史记录`);
    } catch (e) {
      this.warn("无法保存最近切换标签历史:", e);
    }
  }
  /**
   * 恢复最近切换标签历史
   */
  async restoreRecentTabSwitchHistory() {
    try {
      const t = await this.storageService.getConfig(
        k.RECENT_TAB_SWITCH_HISTORY,
        this.pluginName,
        {}
      );
      return t && typeof t == "object" ? (this.verboseLog(`📂 从API配置恢复了 ${Object.keys(t).length} 个标签的切换历史`), t) : (this.log("📂 没有找到最近切换标签历史数据，返回空对象"), {});
    } catch (t) {
      return this.warn("无法恢复最近切换标签历史:", t), {};
    }
  }
  /**
   * 更新单个标签的切换历史
   */
  async updateTabSwitchHistory(t, e) {
    try {
      const a = await this.restoreRecentTabSwitchHistory(), i = "global_tab_history";
      a[i] || (a[i] = {
        tabId: i,
        recentTabs: [],
        lastUpdated: Date.now(),
        maxRecords: J.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS
        // 全局历史记录最大数量限制
      });
      const r = a[i];
      r.recentTabs = r.recentTabs.filter((o) => o.blockId !== e.blockId), r.recentTabs.unshift(e), r.recentTabs.length > r.maxRecords && (r.recentTabs = r.recentTabs.slice(0, r.maxRecords)), r.lastUpdated = Date.now(), await this.saveRecentTabSwitchHistory(a), this.verboseLog(`📝 更新全局切换历史: ${t} -> ${e.title} (历史记录数量: ${r.recentTabs.length})`);
    } catch (a) {
      this.warn("更新全局切换历史失败:", a);
    }
  }
  /**
   * 获取指定标签的最近切换历史
   */
  async getTabSwitchHistory(t) {
    try {
      const e = await this.restoreRecentTabSwitchHistory(), a = e[t];
      return a && a.recentTabs ? (this.verboseLog(`📖 获取标签 ${t} 的切换历史: ${a.recentTabs.length} 个记录`), a.recentTabs) : (this.verboseLog(`📖 标签 ${t} 没有切换历史记录，存储中的所有历史ID: ${Object.keys(e).join(", ")}`), []);
    } catch (e) {
      return this.warn(`获取标签 ${t} 的切换历史失败:`, e), [];
    }
  }
  // ==================== 缓存清理 ====================
  /**
   * 删除API配置缓存
   */
  async clearCache() {
    try {
      await this.storageService.removeConfig(k.FIRST_PANEL_TABS), await this.storageService.removeConfig(k.CLOSED_TABS), await this.storageService.removeConfig(k.RECENT_TAB_SWITCH_HISTORY), this.log("🗑️ 已删除API配置缓存: 标签页数据、已关闭标签列表和切换历史");
    } catch (t) {
      this.warn("删除API配置缓存失败:", t);
    }
  }
  /**
   * 清理历史记录，确保符合新的数量限制
   */
  async cleanupHistoryRecords() {
    try {
      const t = await this.restoreRecentTabSwitchHistory();
      let e = 0;
      for (const [a, i] of Object.entries(t))
        if (i.recentTabs.length > J.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS) {
          const r = i.recentTabs.length;
          i.recentTabs = i.recentTabs.slice(0, J.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS), i.maxRecords = J.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS, e += r - i.recentTabs.length, this.log(`🧹 清理历史记录 ${a}: ${r} -> ${i.recentTabs.length}`);
        }
      e > 0 && (await this.saveRecentTabSwitchHistory(t), this.log(`✅ 历史记录清理完成，共清理了 ${e} 条记录`));
    } catch (t) {
      this.warn("清理历史记录失败:", t);
    }
  }
  // ==================== 工具方法 ====================
  /**
   * 简单的字符串哈希函数
   */
  hashString(t) {
    let e = 0;
    for (let a = 0; a < t.length; a++) {
      const i = t.charCodeAt(a);
      e = (e << 5) - e + i, e = e & e;
    }
    return Math.abs(e).toString(36);
  }
  /**
   * 删除指定标签的切换历史记录
   */
  async deleteTabSwitchHistory(t) {
    try {
      const e = await this.restoreRecentTabSwitchHistory();
      e[t] ? (delete e[t], await this.saveRecentTabSwitchHistory(e), this.verboseLog(`🗑️ 删除标签 ${t} 的切换历史记录`)) : this.verboseLog(`📖 标签 ${t} 没有切换历史记录，无需删除`);
    } catch (e) {
      this.warn(`删除标签 ${t} 的切换历史失败:`, e);
    }
  }
}
const It = 6048e5, Gt = 864e5, bt = Symbol.for("constructDateFrom");
function $(n, t) {
  return typeof n == "function" ? n(t) : n && typeof n == "object" && bt in n ? n[bt](t) : n instanceof Date ? new n.constructor(t) : new Date(t);
}
function L(n, t) {
  return $(t || n, n);
}
function Pt(n, t, e) {
  const a = L(n, e == null ? void 0 : e.in);
  return isNaN(t) ? $(n, NaN) : (t && a.setDate(a.getDate() + t), a);
}
let Kt = {};
function at() {
  return Kt;
}
function K(n, t) {
  var s, c, l, d;
  const e = at(), a = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? e.weekStartsOn ?? ((d = (l = e.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, i = L(n, t == null ? void 0 : t.in), r = i.getDay(), o = (r < a ? 7 : 0) + r - a;
  return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
function Q(n, t) {
  return K(n, { ...t, weekStartsOn: 1 });
}
function $t(n, t) {
  const e = L(n, t == null ? void 0 : t.in), a = e.getFullYear(), i = $(e, 0);
  i.setFullYear(a + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const r = Q(i), o = $(e, 0);
  o.setFullYear(a, 0, 4), o.setHours(0, 0, 0, 0);
  const s = Q(o);
  return e.getTime() >= r.getTime() ? a + 1 : e.getTime() >= s.getTime() ? a : a - 1;
}
function mt(n) {
  const t = L(n), e = new Date(
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
  return e.setUTCFullYear(t.getFullYear()), +n - +e;
}
function Lt(n, ...t) {
  const e = $.bind(
    null,
    t.find((a) => typeof a == "object")
  );
  return t.map(e);
}
function Z(n, t) {
  const e = L(n, t == null ? void 0 : t.in);
  return e.setHours(0, 0, 0, 0), e;
}
function Xt(n, t, e) {
  const [a, i] = Lt(
    e == null ? void 0 : e.in,
    n,
    t
  ), r = Z(a), o = Z(i), s = +r - mt(r), c = +o - mt(o);
  return Math.round((s - c) / Gt);
}
function Jt(n, t) {
  const e = $t(n, t), a = $(n, 0);
  return a.setFullYear(e, 0, 4), a.setHours(0, 0, 0, 0), Q(a);
}
function gt(n) {
  return $(n, Date.now());
}
function pt(n, t, e) {
  const [a, i] = Lt(
    e == null ? void 0 : e.in,
    n,
    t
  );
  return +Z(a) == +Z(i);
}
function Qt(n) {
  return n instanceof Date || typeof n == "object" && Object.prototype.toString.call(n) === "[object Date]";
}
function Zt(n) {
  return !(!Qt(n) && typeof n != "number" || isNaN(+L(n)));
}
function te(n, t) {
  const e = L(n, t == null ? void 0 : t.in);
  return e.setFullYear(e.getFullYear(), 0, 1), e.setHours(0, 0, 0, 0), e;
}
const ee = {
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
}, ae = (n, t, e) => {
  let a;
  const i = ee[n];
  return typeof i == "string" ? a = i : t === 1 ? a = i.one : a = i.other.replace("{{count}}", t.toString()), e != null && e.addSuffix ? e.comparison && e.comparison > 0 ? "in " + a : a + " ago" : a;
};
function nt(n) {
  return (t = {}) => {
    const e = t.width ? String(t.width) : n.defaultWidth;
    return n.formats[e] || n.formats[n.defaultWidth];
  };
}
const ie = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, re = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, ne = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, oe = {
  date: nt({
    formats: ie,
    defaultWidth: "full"
  }),
  time: nt({
    formats: re,
    defaultWidth: "full"
  }),
  dateTime: nt({
    formats: ne,
    defaultWidth: "full"
  })
}, se = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, ce = (n, t, e, a) => se[n];
function V(n) {
  return (t, e) => {
    const a = e != null && e.context ? String(e.context) : "standalone";
    let i;
    if (a === "formatting" && n.formattingValues) {
      const o = n.defaultFormattingWidth || n.defaultWidth, s = e != null && e.width ? String(e.width) : o;
      i = n.formattingValues[s] || n.formattingValues[o];
    } else {
      const o = n.defaultWidth, s = e != null && e.width ? String(e.width) : n.defaultWidth;
      i = n.values[s] || n.values[o];
    }
    const r = n.argumentCallback ? n.argumentCallback(t) : t;
    return i[r];
  };
}
const le = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, de = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, he = {
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
}, ue = {
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
}, ge = {
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
}, pe = {
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
}, be = (n, t) => {
  const e = Number(n), a = e % 100;
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
}, me = {
  ordinalNumber: be,
  era: V({
    values: le,
    defaultWidth: "wide"
  }),
  quarter: V({
    values: de,
    defaultWidth: "wide",
    argumentCallback: (n) => n - 1
  }),
  month: V({
    values: he,
    defaultWidth: "wide"
  }),
  day: V({
    values: ue,
    defaultWidth: "wide"
  }),
  dayPeriod: V({
    values: ge,
    defaultWidth: "wide",
    formattingValues: pe,
    defaultFormattingWidth: "wide"
  })
};
function j(n) {
  return (t, e = {}) => {
    const a = e.width, i = a && n.matchPatterns[a] || n.matchPatterns[n.defaultMatchWidth], r = t.match(i);
    if (!r)
      return null;
    const o = r[0], s = a && n.parsePatterns[a] || n.parsePatterns[n.defaultParseWidth], c = Array.isArray(s) ? ve(s, (u) => u.test(o)) : (
      // [TODO] -- I challenge you to fix the type
      fe(s, (u) => u.test(o))
    );
    let l;
    l = n.valueCallback ? n.valueCallback(c) : c, l = e.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      e.valueCallback(l)
    ) : l;
    const d = t.slice(o.length);
    return { value: l, rest: d };
  };
}
function fe(n, t) {
  for (const e in n)
    if (Object.prototype.hasOwnProperty.call(n, e) && t(n[e]))
      return e;
}
function ve(n, t) {
  for (let e = 0; e < n.length; e++)
    if (t(n[e]))
      return e;
}
function xe(n) {
  return (t, e = {}) => {
    const a = t.match(n.matchPattern);
    if (!a) return null;
    const i = a[0], r = t.match(n.parsePattern);
    if (!r) return null;
    let o = n.valueCallback ? n.valueCallback(r[0]) : r[0];
    o = e.valueCallback ? e.valueCallback(o) : o;
    const s = t.slice(i.length);
    return { value: o, rest: s };
  };
}
const ye = /^(\d+)(th|st|nd|rd)?/i, Te = /\d+/i, we = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, ke = {
  any: [/^b/i, /^(a|c)/i]
}, Ce = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Ee = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Se = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, Ie = {
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
}, Pe = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, $e = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Le = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, De = {
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
}, Me = {
  ordinalNumber: xe({
    matchPattern: ye,
    parsePattern: Te,
    valueCallback: (n) => parseInt(n, 10)
  }),
  era: j({
    matchPatterns: we,
    defaultMatchWidth: "wide",
    parsePatterns: ke,
    defaultParseWidth: "any"
  }),
  quarter: j({
    matchPatterns: Ce,
    defaultMatchWidth: "wide",
    parsePatterns: Ee,
    defaultParseWidth: "any",
    valueCallback: (n) => n + 1
  }),
  month: j({
    matchPatterns: Se,
    defaultMatchWidth: "wide",
    parsePatterns: Ie,
    defaultParseWidth: "any"
  }),
  day: j({
    matchPatterns: Pe,
    defaultMatchWidth: "wide",
    parsePatterns: $e,
    defaultParseWidth: "any"
  }),
  dayPeriod: j({
    matchPatterns: Le,
    defaultMatchWidth: "any",
    parsePatterns: De,
    defaultParseWidth: "any"
  })
}, Be = {
  code: "en-US",
  formatDistance: ae,
  formatLong: oe,
  formatRelative: ce,
  localize: me,
  match: Me,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Ae(n, t) {
  const e = L(n, t == null ? void 0 : t.in);
  return Xt(e, te(e)) + 1;
}
function We(n, t) {
  const e = L(n, t == null ? void 0 : t.in), a = +Q(e) - +Jt(e);
  return Math.round(a / It) + 1;
}
function Dt(n, t) {
  var d, u, h, g;
  const e = L(n, t == null ? void 0 : t.in), a = e.getFullYear(), i = at(), r = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((u = (d = t == null ? void 0 : t.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((g = (h = i.locale) == null ? void 0 : h.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, o = $((t == null ? void 0 : t.in) || n, 0);
  o.setFullYear(a + 1, 0, r), o.setHours(0, 0, 0, 0);
  const s = K(o, t), c = $((t == null ? void 0 : t.in) || n, 0);
  c.setFullYear(a, 0, r), c.setHours(0, 0, 0, 0);
  const l = K(c, t);
  return +e >= +s ? a + 1 : +e >= +l ? a : a - 1;
}
function Ne(n, t) {
  var s, c, l, d;
  const e = at(), a = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((c = (s = t == null ? void 0 : t.locale) == null ? void 0 : s.options) == null ? void 0 : c.firstWeekContainsDate) ?? e.firstWeekContainsDate ?? ((d = (l = e.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, i = Dt(n, t), r = $((t == null ? void 0 : t.in) || n, 0);
  return r.setFullYear(i, 0, a), r.setHours(0, 0, 0, 0), K(r, t);
}
function ze(n, t) {
  const e = L(n, t == null ? void 0 : t.in), a = +K(e, t) - +Ne(e, t);
  return Math.round(a / It) + 1;
}
function E(n, t) {
  const e = n < 0 ? "-" : "", a = Math.abs(n).toString().padStart(t, "0");
  return e + a;
}
const M = {
  // Year
  y(n, t) {
    const e = n.getFullYear(), a = e > 0 ? e : 1 - e;
    return E(t === "yy" ? a % 100 : a, t.length);
  },
  // Month
  M(n, t) {
    const e = n.getMonth();
    return t === "M" ? String(e + 1) : E(e + 1, 2);
  },
  // Day of the month
  d(n, t) {
    return E(n.getDate(), t.length);
  },
  // AM or PM
  a(n, t) {
    const e = n.getHours() / 12 >= 1 ? "pm" : "am";
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
  h(n, t) {
    return E(n.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(n, t) {
    return E(n.getHours(), t.length);
  },
  // Minute
  m(n, t) {
    return E(n.getMinutes(), t.length);
  },
  // Second
  s(n, t) {
    return E(n.getSeconds(), t.length);
  },
  // Fraction of second
  S(n, t) {
    const e = t.length, a = n.getMilliseconds(), i = Math.trunc(
      a * Math.pow(10, e - 3)
    );
    return E(i, t.length);
  }
}, R = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, ft = {
  // Era
  G: function(n, t, e) {
    const a = n.getFullYear() > 0 ? 1 : 0;
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
  y: function(n, t, e) {
    if (t === "yo") {
      const a = n.getFullYear(), i = a > 0 ? a : 1 - a;
      return e.ordinalNumber(i, { unit: "year" });
    }
    return M.y(n, t);
  },
  // Local week-numbering year
  Y: function(n, t, e, a) {
    const i = Dt(n, a), r = i > 0 ? i : 1 - i;
    if (t === "YY") {
      const o = r % 100;
      return E(o, 2);
    }
    return t === "Yo" ? e.ordinalNumber(r, { unit: "year" }) : E(r, t.length);
  },
  // ISO week-numbering year
  R: function(n, t) {
    const e = $t(n);
    return E(e, t.length);
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
  u: function(n, t) {
    const e = n.getFullYear();
    return E(e, t.length);
  },
  // Quarter
  Q: function(n, t, e) {
    const a = Math.ceil((n.getMonth() + 1) / 3);
    switch (t) {
      case "Q":
        return String(a);
      case "QQ":
        return E(a, 2);
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
  q: function(n, t, e) {
    const a = Math.ceil((n.getMonth() + 1) / 3);
    switch (t) {
      case "q":
        return String(a);
      case "qq":
        return E(a, 2);
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
  M: function(n, t, e) {
    const a = n.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return M.M(n, t);
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
  L: function(n, t, e) {
    const a = n.getMonth();
    switch (t) {
      case "L":
        return String(a + 1);
      case "LL":
        return E(a + 1, 2);
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
  w: function(n, t, e, a) {
    const i = ze(n, a);
    return t === "wo" ? e.ordinalNumber(i, { unit: "week" }) : E(i, t.length);
  },
  // ISO week of year
  I: function(n, t, e) {
    const a = We(n);
    return t === "Io" ? e.ordinalNumber(a, { unit: "week" }) : E(a, t.length);
  },
  // Day of the month
  d: function(n, t, e) {
    return t === "do" ? e.ordinalNumber(n.getDate(), { unit: "date" }) : M.d(n, t);
  },
  // Day of year
  D: function(n, t, e) {
    const a = Ae(n);
    return t === "Do" ? e.ordinalNumber(a, { unit: "dayOfYear" }) : E(a, t.length);
  },
  // Day of week
  E: function(n, t, e) {
    const a = n.getDay();
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
  e: function(n, t, e, a) {
    const i = n.getDay(), r = (i - a.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "e":
        return String(r);
      case "ee":
        return E(r, 2);
      case "eo":
        return e.ordinalNumber(r, { unit: "day" });
      case "eee":
        return e.day(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return e.day(i, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return e.day(i, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return e.day(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(n, t, e, a) {
    const i = n.getDay(), r = (i - a.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "c":
        return String(r);
      case "cc":
        return E(r, t.length);
      case "co":
        return e.ordinalNumber(r, { unit: "day" });
      case "ccc":
        return e.day(i, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return e.day(i, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return e.day(i, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return e.day(i, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(n, t, e) {
    const a = n.getDay(), i = a === 0 ? 7 : a;
    switch (t) {
      case "i":
        return String(i);
      case "ii":
        return E(i, t.length);
      case "io":
        return e.ordinalNumber(i, { unit: "day" });
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
  a: function(n, t, e) {
    const i = n.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return e.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return e.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return e.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return e.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(n, t, e) {
    const a = n.getHours();
    let i;
    switch (a === 12 ? i = R.noon : a === 0 ? i = R.midnight : i = a / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return e.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return e.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return e.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return e.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(n, t, e) {
    const a = n.getHours();
    let i;
    switch (a >= 17 ? i = R.evening : a >= 12 ? i = R.afternoon : a >= 4 ? i = R.morning : i = R.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return e.dayPeriod(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return e.dayPeriod(i, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return e.dayPeriod(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(n, t, e) {
    if (t === "ho") {
      let a = n.getHours() % 12;
      return a === 0 && (a = 12), e.ordinalNumber(a, { unit: "hour" });
    }
    return M.h(n, t);
  },
  // Hour [0-23]
  H: function(n, t, e) {
    return t === "Ho" ? e.ordinalNumber(n.getHours(), { unit: "hour" }) : M.H(n, t);
  },
  // Hour [0-11]
  K: function(n, t, e) {
    const a = n.getHours() % 12;
    return t === "Ko" ? e.ordinalNumber(a, { unit: "hour" }) : E(a, t.length);
  },
  // Hour [1-24]
  k: function(n, t, e) {
    let a = n.getHours();
    return a === 0 && (a = 24), t === "ko" ? e.ordinalNumber(a, { unit: "hour" }) : E(a, t.length);
  },
  // Minute
  m: function(n, t, e) {
    return t === "mo" ? e.ordinalNumber(n.getMinutes(), { unit: "minute" }) : M.m(n, t);
  },
  // Second
  s: function(n, t, e) {
    return t === "so" ? e.ordinalNumber(n.getSeconds(), { unit: "second" }) : M.s(n, t);
  },
  // Fraction of second
  S: function(n, t) {
    return M.S(n, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(n, t, e) {
    const a = n.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (t) {
      case "X":
        return xt(a);
      case "XXXX":
      case "XX":
        return O(a);
      case "XXXXX":
      case "XXX":
      default:
        return O(a, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(n, t, e) {
    const a = n.getTimezoneOffset();
    switch (t) {
      case "x":
        return xt(a);
      case "xxxx":
      case "xx":
        return O(a);
      case "xxxxx":
      case "xxx":
      default:
        return O(a, ":");
    }
  },
  // Timezone (GMT)
  O: function(n, t, e) {
    const a = n.getTimezoneOffset();
    switch (t) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + vt(a, ":");
      case "OOOO":
      default:
        return "GMT" + O(a, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(n, t, e) {
    const a = n.getTimezoneOffset();
    switch (t) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + vt(a, ":");
      case "zzzz":
      default:
        return "GMT" + O(a, ":");
    }
  },
  // Seconds timestamp
  t: function(n, t, e) {
    const a = Math.trunc(+n / 1e3);
    return E(a, t.length);
  },
  // Milliseconds timestamp
  T: function(n, t, e) {
    return E(+n, t.length);
  }
};
function vt(n, t = "") {
  const e = n > 0 ? "-" : "+", a = Math.abs(n), i = Math.trunc(a / 60), r = a % 60;
  return r === 0 ? e + String(i) : e + String(i) + t + E(r, 2);
}
function xt(n, t) {
  return n % 60 === 0 ? (n > 0 ? "-" : "+") + E(Math.abs(n) / 60, 2) : O(n, t);
}
function O(n, t = "") {
  const e = n > 0 ? "-" : "+", a = Math.abs(n), i = E(Math.trunc(a / 60), 2), r = E(a % 60, 2);
  return e + i + t + r;
}
const yt = (n, t) => {
  switch (n) {
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
}, Mt = (n, t) => {
  switch (n) {
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
}, Oe = (n, t) => {
  const e = n.match(/(P+)(p+)?/) || [], a = e[1], i = e[2];
  if (!i)
    return yt(n, t);
  let r;
  switch (a) {
    case "P":
      r = t.dateTime({ width: "short" });
      break;
    case "PP":
      r = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      r = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      r = t.dateTime({ width: "full" });
      break;
  }
  return r.replace("{{date}}", yt(a, t)).replace("{{time}}", Mt(i, t));
}, Fe = {
  p: Mt,
  P: Oe
}, Re = /^D+$/, Ue = /^Y+$/, _e = ["D", "DD", "YY", "YYYY"];
function He(n) {
  return Re.test(n);
}
function qe(n) {
  return Ue.test(n);
}
function Ve(n, t, e) {
  const a = je(n, t, e);
  if (console.warn(a), _e.includes(n)) throw new RangeError(a);
}
function je(n, t, e) {
  const a = n[0] === "Y" ? "years" : "days of the month";
  return `Use \`${n.toLowerCase()}\` instead of \`${n}\` (in \`${t}\`) for formatting ${a} to the input \`${e}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Ye = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Ge = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Ke = /^'([^]*?)'?$/, Xe = /''/g, Je = /[a-zA-Z]/;
function W(n, t, e) {
  var d, u, h, g;
  const a = at(), i = a.locale ?? Be, r = a.firstWeekContainsDate ?? ((u = (d = a.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, o = a.weekStartsOn ?? ((g = (h = a.locale) == null ? void 0 : h.options) == null ? void 0 : g.weekStartsOn) ?? 0, s = L(n, e == null ? void 0 : e.in);
  if (!Zt(s))
    throw new RangeError("Invalid time value");
  let c = t.match(Ge).map((p) => {
    const m = p[0];
    if (m === "p" || m === "P") {
      const b = Fe[m];
      return b(p, i.formatLong);
    }
    return p;
  }).join("").match(Ye).map((p) => {
    if (p === "''")
      return { isToken: !1, value: "'" };
    const m = p[0];
    if (m === "'")
      return { isToken: !1, value: Qe(p) };
    if (ft[m])
      return { isToken: !0, value: p };
    if (m.match(Je))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: p };
  });
  i.localize.preprocessor && (c = i.localize.preprocessor(s, c));
  const l = {
    firstWeekContainsDate: r,
    weekStartsOn: o,
    locale: i
  };
  return c.map((p) => {
    if (!p.isToken) return p.value;
    const m = p.value;
    (qe(m) || He(m)) && Ve(m, t, String(n));
    const b = ft[m[0]];
    return b(s, m, i.localize, l);
  }).join("");
}
function Qe(n) {
  const t = n.match(Ke);
  return t ? t[1].replace(Xe, "'") : n;
}
function Ze(n, t) {
  return pt(
    $(n, n),
    gt(n)
  );
}
function ta(n, t) {
  return pt(
    n,
    Pt(gt(n), 1),
    t
  );
}
function ea(n, t, e) {
  return Pt(n, -1, e);
}
function aa(n, t) {
  return pt(
    $(n, n),
    ea(gt(n))
  );
}
function ia(n) {
  try {
    let t = orca.state.settings[Ct.JournalDateFormat];
    if ((!t || typeof t != "string") && (t = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Ze(n))
      return "今天";
    if (aa(n))
      return "昨天";
    if (ta(n))
      return "明天";
    try {
      if (t.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const a = n.getDay(), r = ["日", "一", "二", "三", "四", "五", "六"][a], o = t.replace(/E/g, r);
          return W(n, o);
        } else
          return W(n, t);
      else
        return W(n, t);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of a)
        try {
          return W(n, i);
        } catch {
          continue;
        }
      return n.toLocaleDateString();
    }
  } catch {
    return n.toLocaleDateString();
  }
}
function Bt(n) {
  try {
    const t = ct(n, "_repr");
    if (!t || t.type !== Et.JSON || !t.value)
      return null;
    const e = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
    return e.type === "journal" && e.date ? new Date(e.date) : null;
  } catch {
    return null;
  }
}
async function ot(n) {
  try {
    if (Bt(n))
      return "journal";
    if (n["data-type"]) {
      const a = n["data-type"];
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
    if (n.aliases && n.aliases.length > 0 && n.aliases[0])
      try {
        const i = ct(n, "_hide");
        return i && i.value ? "page" : "tag";
      } catch {
        return "tag";
      }
    const e = ct(n, "_repr");
    if (e && e.type === Et.JSON && e.value)
      try {
        const a = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
        if (a.type)
          return a.type;
      } catch {
      }
    if (n.content && Array.isArray(n.content)) {
      if (n.content.some(
        (s) => s && typeof s == "object" && s.type === "code"
      ))
        return "code";
      if (n.content.some(
        (s) => s && typeof s == "object" && s.type === "table"
      ))
        return "table";
      if (n.content.some(
        (s) => s && typeof s == "object" && s.type === "image"
      ))
        return "image";
      if (n.content.some(
        (s) => s && typeof s == "object" && s.type === "link"
      ))
        return "link";
    }
    if (n.text) {
      const a = n.text.trim();
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
function Y(n) {
  const t = {
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
    text: "ti ti-cube",
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
    summary: "ti ti-cube",
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
    log: "ti ti-cube",
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
  let e = t[n];
  if (!e) {
    const a = ra(n);
    a && (e = a);
  }
  return e || (e = t.default), e;
}
function ra(n) {
  const t = n.toLowerCase(), e = {
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
    page: "ti ti-cube",
    web: "ti ti-cube",
    site: "ti ti-cube",
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
  for (const [a, i] of Object.entries(e))
    if (t.includes(a))
      return i;
  return null;
}
function ct(n, t) {
  return !n.properties || !Array.isArray(n.properties) ? null : n.properties.find((e) => e.name === t);
}
function na(n) {
  if (!Array.isArray(n) || n.length === 0)
    return !1;
  let t = 0, e = 0;
  for (const a of n)
    a && typeof a == "object" && (a.t === "text" && a.v ? t++ : a.t === "ref" && a.v && e++);
  return t > 0 && e > 0 && t >= e;
}
async function oa(n) {
  if (!n || n.length === 0) return "";
  let t = "";
  for (const e of n)
    e.t === "t" && e.v ? t += e.v : e.t === "r" ? e.u ? e.v ? t += e.v : t += e.u : e.a ? t += `[[${e.a}]]` : e.v && (typeof e.v == "number" || typeof e.v == "string") ? t += `[[块${e.v}]]` : e.v && (t += e.v) : e.t === "br" && e.v ? t += `[[块${e.v}]]` : e.t && e.t.includes("math") && e.v ? t += `[数学: ${e.v}]` : e.t && e.t.includes("code") && e.v ? t += `[代码: ${e.v}]` : e.t && e.t.includes("image") && e.v ? t += `[图片: ${e.v}]` : e.v && (t += e.v);
  return t;
}
function sa(n, t, e, a) {
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
  r.className = t, r.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const o = document.createElement("span");
  if (o.textContent = n, o.style.cssText = `
    flex: 1;
    color: var(--orca-color-text-1);
  `, i.appendChild(r), i.appendChild(o), e && e.trim() !== "") {
    const s = document.createElement("span");
    s.textContent = e, s.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, i.appendChild(s);
  }
  return i.addEventListener("mouseenter", () => {
    i.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), i.addEventListener("mouseleave", () => {
    i.style.backgroundColor = "transparent";
  }), i.addEventListener("click", (s) => {
    s.preventDefault(), s.stopPropagation(), a();
    const c = i.closest('.orca-context-menu, .context-menu, [role="menu"]');
    c && (c.style.display = "none", c.remove());
  }), i;
}
function ca(n, t, e) {
  n.addEventListener("mouseenter", () => {
    n.style.cssText += t;
  }), n.addEventListener("mouseleave", () => {
    n.style.cssText = e;
  });
}
function At(n) {
  n && n.parentNode && n.parentNode.removeChild(n);
}
function la(n, t) {
  const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n);
  if (e) {
    const a = parseInt(e[1], 16), i = parseInt(e[2], 16), r = parseInt(e[3], 16);
    return `rgba(${a}, ${i}, ${r}, ${t})`;
  }
  return `rgba(200, 200, 200, ${t})`;
}
function Tt(n, t, e, a, i) {
  let r = "var(--orca-tab-bg)", o = "var(--orca-color-text-1)", s = "normal", c = "";
  if (n.color)
    try {
      c = `--tab-color: ${n.color.startsWith("#") ? n.color : `#${n.color}`};`, r = "var(--orca-tab-colored-bg)", o = "var(--orca-tab-colored-text)", s = "600";
    } catch {
    }
  return t ? `
    ${c}
    background: ${r};
    color: ${o};
    font-weight: ${s};
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
    color: ${o};
    font-weight: ${s};
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
function da() {
  const n = document.createElement("div");
  return n.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, n;
}
function ha(n) {
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
  `, n.startsWith("ti ti-")) {
    const e = document.createElement("i");
    e.className = n, t.appendChild(e);
  } else
    t.textContent = n;
  return t;
}
function ua(n) {
  const t = document.createElement("div");
  t.style.cssText = `
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
  const e = document.createElement("span");
  return e.style.cssText = `
    display: block;
    white-space: nowrap;
    width: 100%;
    line-height: 2.2;
    vertical-align: middle;
  `, e.textContent = n, t.appendChild(e), requestAnimationFrame(() => {
    const a = t.offsetWidth;
    e.scrollWidth > a && (e.style.mask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", e.style.webkitMask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", e.style.maskSize = "100% 100%", e.style.webkitMaskSize = "100% 100%", e.style.maskRepeat = "no-repeat", e.style.webkitMaskRepeat = "no-repeat");
  }), t;
}
function ga() {
  const n = document.createElement("span");
  return n.textContent = "📌", n.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, n;
}
function G(n, t, e = 180, a = 200) {
  const i = window.innerWidth, r = window.innerHeight, o = 10;
  let s = n, c = t;
  return s + e > i - o && (s = i - e - o), c + a > r - o && (c = r - a - o, c < t - a && (c = t - a - 5)), s < o && (s = o), c < o && (c = t + 5), s = Math.max(o, Math.min(s, i - e - o)), c = Math.max(o, Math.min(c, r - a - o)), { x: s, y: c };
}
function Wt() {
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
function tt(n = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[n];
}
function lt() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function pa(n, t, e, a) {
  return n ? `
    position: fixed;
    top: ${t.y}px;
    left: ${t.x}px;
    z-index: 300;
    display: flex;
    flex-direction: column;
    gap: 6px;
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
    overflow-x: hidden;
  ` : `
    position: fixed;
    top: ${t.y}px;
    left: ${t.x}px;
    z-index: 300;
    display: flex;
    gap: 10px;
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
var P = /* @__PURE__ */ ((n) => (n[n.ERROR = 0] = "ERROR", n[n.WARN = 1] = "WARN", n[n.INFO = 2] = "INFO", n[n.DEBUG = 3] = "DEBUG", n[n.VERBOSE = 4] = "VERBOSE", n))(P || {});
const Nt = 1, _ = class _ {
  /**
   * 设置当前日志级别
   */
  static setLogLevel(t) {
    _.currentLogLevel = t;
  }
  /**
   * 获取当前日志级别
   */
  static getLogLevel() {
    return _.currentLogLevel;
  }
  /**
   * 检查是否应该输出指定级别的日志
   */
  static shouldLog(t) {
    return _.currentLogLevel >= t;
  }
};
x(_, "currentLogLevel", Nt);
let F = _;
function st(n, ...t) {
  F.shouldLog(
    2
    /* INFO */
  ) && console.info("[OrcaPlugin]", n, ...t);
}
function ba(n, ...t) {
  F.shouldLog(
    0
    /* ERROR */
  ) && console.error("[OrcaPlugin]", n, ...t);
}
function ma(n, ...t) {
  F.shouldLog(
    1
    /* WARN */
  ) && console.warn("[OrcaPlugin]", n, ...t);
}
function z(n, ...t) {
  F.shouldLog(
    4
    /* VERBOSE */
  ) && console.log("[OrcaPlugin]", n, ...t);
}
function fa(n, t, e, a) {
  const i = document.createElement("div");
  i.className = n ? "orca-tabs-plugin orca-tabs-container vertical" : "orca-tabs-plugin orca-tabs-container";
  const r = pa(n, t, a, e);
  return i.style.cssText = r, i;
}
function va(n, t, e) {
  const a = document.createElement("div");
  a.className = "feature-toggle-button", a.innerHTML = t ? "🔒" : "🔓", a.title = t ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)";
  const i = n ? `
    width: calc(100% - 6px);
    margin: 0 3px;
    height: 24px;
    background: ${t ? "rgba(0, 150, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${t ? "#004400" : "#660000"};
    min-height: 24px;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    border-radius: var(--orca-radius-md);
    transition: all 0.2s ease;
    border: 2px solid ${t ? "rgba(0, 150, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"};
    z-index: 1000;
  ` : `
    width: 28px;
    height: 28px;
    background: ${t ? "rgba(0, 150, 0, 0.3)" : "rgba(255, 0, 0, 0.3)"};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: ${t ? "#004400" : "#660000"};
    margin-left: 4px;
    min-height: 28px;
    flex-shrink: 0;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    border-radius: var(--orca-radius-md);
    transition: all 0.2s ease;
    border: 2px solid ${t ? "rgba(0, 150, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"};
    z-index: 1000;
  `;
  return a.style.cssText = i, a.addEventListener("click", e), ca(a, t ? "#006600" : "#666", t ? "#004400" : "#333"), a;
}
function xa(n, t, e) {
  const a = document.createElement("div");
  a.className = "hover-tab-list-container";
  const i = `
    position: fixed;
    left: ${t.x}px;
    top: ${t.y}px;
    z-index: 10000;
    background: var(--orca-bg-primary, #ffffff);
    border: 1px solid var(--orca-border-color, #e0e0e0);
    border-radius: var(--orca-radius-md, 6px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 4px;
    max-height: ${n.maxDisplayCount * 32 + 8}px;
    width: ${n.maxWidth || 150}px;
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
    max-height: ${n.maxDisplayCount * 32}px;
    scrollbar-width: thin;
    scrollbar-color: var(--orca-scrollbar-thumb, #c0c0c0) var(--orca-scrollbar-track, #f0f0f0);
  `;
  const o = `
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
    const s = document.createElement("style");
    s.id = "hover-tab-list-styles", s.textContent = o, document.head.appendChild(s);
  }
  return a.appendChild(r), requestAnimationFrame(() => {
    a.style.opacity = "1", a.style.transform = "translateY(0)";
  }), a;
}
function ya(n, t, e, a, i) {
  const r = document.createElement("div");
  r.className = "hover-tab-item", r.setAttribute("data-tab-id", n.blockId);
  const o = e.maxDisplayCount - 1, s = Math.max(e.minOpacity, 1 - t / o * (1 - e.minOpacity)), c = Math.max(e.minScale, 1 - t / o * (1 - e.minScale)), l = `
    display: flex;
    align-items: center;
    padding: 6px 8px;
    margin: 2px 0;
    border-radius: var(--orca-radius-sm, 4px);
    cursor: pointer;
    transition: all ${e.animationDuration}ms ease;
    opacity: ${s};
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
  `, n.icon) {
    const h = document.createElement("span");
    n.icon.includes(" ") || n.icon.startsWith("ti-") ? h.className = n.icon : h.textContent = n.icon, h.style.cssText = `
      margin-right: 6px;
      font-size: 12px;
      flex-shrink: 0;
    `, d.appendChild(h);
  }
  const u = document.createElement("span");
  return u.textContent = n.title, u.style.cssText = `
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `, d.appendChild(u), r.appendChild(d), r.addEventListener("click", (h) => {
    h.stopPropagation(), a(n);
  }), r.addEventListener("mouseenter", () => {
    r.style.background = "var(--orca-bg-hover, rgba(0, 0, 0, 0.05))", r.style.transform = `scale(${Math.min(1, c + 0.05)})`;
  }), r.addEventListener("mouseleave", () => {
    r.style.background = "transparent", r.style.transform = `scale(${c})`;
  }), r;
}
function dt(n, t, e, a, i, r = 0) {
  const o = n.querySelector(".hover-tab-list-scroll");
  if (!o) return;
  o.innerHTML = "";
  const s = r, c = Math.min(s + e.maxDisplayCount, t.length);
  t.slice(s, c).forEach((d, u) => {
    const h = ya(d, u, e, a);
    o.appendChild(h);
  }), r > 0 && (o.scrollTop = r * 32);
}
function wt(n, t, e, a, i) {
  z("🎨 showHoverTabList 被调用", { tabs: n.length, position: t, config: e });
  const r = document.querySelector(".hover-tab-list-container");
  r && (z("🗑️ 移除现有的悬浮列表"), At(r)), z("🏗️ 创建新容器");
  const o = xa(e, t);
  return z("📦 容器创建完成", o), document.body.appendChild(o), z("📄 容器已添加到页面"), z("🔄 更新内容"), dt(o, n, e, a), z("✅ 内容更新完成"), o;
}
function B() {
  const n = document.querySelector(".hover-tab-list-container");
  n && (n.style.opacity = "0", n.style.transform = "translateY(-10px)", setTimeout(() => {
    At(n);
  }, 200));
}
const ht = /* @__PURE__ */ new WeakMap();
function D(n, t) {
  if (!n || !t.text)
    return;
  let e = null, a = null;
  const i = (c) => {
    a = setTimeout(() => {
      if (!n.isConnected || !document.body.contains(n))
        return;
      const l = n.getBoundingClientRect();
      if (!(!l || l.width === 0 || l.height === 0 || l.top === 0 && l.left === 0 && l.bottom === 0 && l.right === 0)) {
        if (!e) {
          e = document.createElement("div"), e.className = `orca-tooltip ${t.className || ""}`;
          const d = t.shortcut ? `${t.text} (${t.shortcut})` : t.text;
          d.includes(`
`) ? e.innerHTML = d.replace(/\n/g, "<br>") : e.textContent = d, e.style.cssText = `
          position: absolute;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        `, document.body.appendChild(e);
        }
        e.style.opacity = "1", e.style.visibility = "hidden", requestAnimationFrame(() => {
          if (!e || !e.parentNode) return;
          const d = e.getBoundingClientRect();
          if (!d || d.width === 0 || d.height === 0) {
            r();
            return;
          }
          let u = 0, h = 0, g = t.defaultPlacement || "top";
          const p = window.innerWidth, m = window.innerHeight, b = 8, v = (w) => {
            let y = 0, T = 0;
            switch (w) {
              case "top":
                y = l.left + (l.width - d.width) / 2, T = l.top - d.height - 8;
                break;
              case "bottom":
                y = l.left + (l.width - d.width) / 2, T = l.bottom + 8;
                break;
              case "left":
                y = l.left - d.width - 8, T = l.top + (l.height - d.height) / 2;
                break;
              case "right":
                y = l.right + 8, T = l.top + (l.height - d.height) / 2;
                break;
            }
            return { x: y, y: T };
          }, f = (w) => {
            const { x: y, y: T } = v(w);
            return y >= b && y + d.width <= p - b && T >= b && T + d.height <= m - b;
          };
          if (f(g)) {
            const w = v(g);
            u = w.x, h = w.y;
          } else {
            const w = g === "bottom" ? ["top", "left", "right"] : g === "top" ? ["bottom", "left", "right"] : g === "left" ? ["right", "top", "bottom"] : ["left", "top", "bottom"];
            let y = !1;
            for (const T of w)
              if (f(T)) {
                const S = v(T);
                u = S.x, h = S.y, g = T, y = !0;
                break;
              }
            if (!y) {
              const T = v(g);
              u = T.x, h = T.y;
            }
          }
          if (u < b ? u = b : u + d.width > p - b && (u = p - d.width - b), h < b ? h = b : h + d.height > m - b && (h = m - d.height - b), d.width > p - 2 * b && (u = b, e.style.maxWidth = `${p - 2 * b}px`), isNaN(u) || isNaN(h) || !isFinite(u) || !isFinite(h)) {
            console.warn("[Tooltip] Invalid position calculated, hiding tooltip"), r();
            return;
          }
          u = Math.max(0, u), h = Math.max(0, h), e.style.left = `${u}px`, e.style.top = `${h}px`, e.style.visibility = "visible";
        });
      }
    }, t.delay || 500);
  }, r = () => {
    var c;
    if (a && (clearTimeout(a), a = null), e) {
      try {
        e.parentNode && e.parentNode.removeChild(e);
      } catch (l) {
        console.warn("Tooltip removal failed, trying alternative method:", l), (c = e.remove) == null || c.call(e);
      }
      e = null;
    }
  }, o = (c) => {
    if (e && e.parentNode) {
      const l = n.getBoundingClientRect();
      (c.clientX < l.left - 10 || c.clientX > l.right + 10 || c.clientY < l.top - 10 || c.clientY > l.bottom + 10) && r();
    }
  };
  n.addEventListener("mouseenter", i), n.addEventListener("mouseleave", r), n.addEventListener("mousedown", r), n.addEventListener("mousemove", o);
  const s = () => {
    var c;
    if (a && clearTimeout(a), n.removeEventListener("mouseenter", i), n.removeEventListener("mouseleave", r), n.removeEventListener("mousedown", r), n.removeEventListener("mousemove", o), e) {
      try {
        e.parentNode && e.parentNode.removeChild(e);
      } catch (l) {
        console.warn("Tooltip cleanup failed, trying alternative method:", l), (c = e.remove) == null || c.call(e);
      }
      e = null;
    }
  };
  ht.set(n, s);
}
function Ta(n) {
  const t = ht.get(n);
  t && (t(), ht.delete(n));
}
function U(n, t) {
  return {
    text: n,
    shortcut: t,
    delay: 200,
    defaultPlacement: "bottom"
    // 按钮tooltip默认显示在下方
  };
}
function zt(n) {
  let t = n.title || "未命名标签页";
  const e = [];
  return n.blockId && e.push(`ID: ${n.blockId}`), n.blockType && e.push(`类型: ${n.blockType}`), n.isPinned && e.push("📌 已固定"), n.isJournal && e.push("📝 日志块"), e.length > 0 && (t += `
` + e.join(" | ")), {
    text: t,
    delay: 300,
    defaultPlacement: "bottom"
    // 标签页 tooltip 默认显示在下方
  };
}
function ut(n) {
  return {
    text: n,
    delay: 500,
    defaultPlacement: "bottom"
    // 状态tooltip默认显示在下方
  };
}
function wa() {
  document.querySelectorAll('[data-tooltip="true"]').forEach((t, e) => {
    const a = t.getAttribute("data-tooltip-text"), i = t.getAttribute("data-tooltip-shortcut"), r = t.getAttribute("data-tooltip-delay");
    if (a) {
      const o = {
        text: a,
        shortcut: i || void 0,
        delay: r ? parseInt(r) : void 0
      };
      D(t, o);
    }
  });
}
function X() {
  document.querySelectorAll(".orca-tooltip").forEach((a) => {
    var i;
    try {
      a.parentNode ? a.parentNode.removeChild(a) : (i = a.remove) == null || i.call(a);
    } catch (r) {
      console.warn("Failed to remove tooltip:", r);
    }
  }), document.querySelectorAll(".tooltip").forEach((a) => {
    var i;
    try {
      a.parentNode ? a.parentNode.removeChild(a) : (i = a.remove) == null || i.call(a);
    } catch (r) {
      console.warn("Failed to remove tooltip:", r);
    }
  }), document.querySelectorAll('[style*="position: absolute"]').forEach((a) => {
    var c;
    const i = window.getComputedStyle(a), r = parseFloat(i.left), o = parseFloat(i.top);
    if (parseInt(i.zIndex) >= 1e4 && r < 20 && o < 20 && (a.classList.contains("orca-tooltip") || a.classList.contains("tooltip")))
      try {
        a.parentNode ? a.parentNode.removeChild(a) : (c = a.remove) == null || c.call(a), console.log("[Tooltip] Cleaned up suspicious tooltip at top-left corner");
      } catch (l) {
        console.warn("Failed to remove suspicious tooltip:", l);
      }
  });
}
function Ot() {
  setInterval(() => {
    X();
  }, 3e4);
}
function Ft() {
  window.addEventListener("beforeunload", () => {
    X();
  }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "hidden" && X();
  });
}
typeof window < "u" && (window.addTooltip = D, window.removeTooltip = Ta, window.createButtonTooltip = U, window.createTabTooltip = zt, window.createStatusTooltip = ut, window.cleanupAllTooltips = X, window.startTooltipCleanupTimer = Ot, window.setupPageUnloadCleanup = Ft);
function ka(n, t, e = {}) {
  try {
    const {
      updateOrder: a = !0,
      saveData: i = !0,
      updateUI: r = !0
    } = e, o = t.findIndex((d) => d.blockId === n.blockId);
    if (o === -1)
      return {
        success: !1,
        message: `标签不存在: ${n.title}`
      };
    t[o].isPinned = !t[o].isPinned;
    const s = t[o].isPinned;
    a && Ia(t);
    const c = t.findIndex((d) => d.blockId === n.blockId), l = s ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${n.title}" 已${l}`,
      data: { tab: t[c], tabIndex: c }
    };
  } catch (a) {
    return {
      success: !1,
      message: `切换固定状态失败: ${a}`
    };
  }
}
function Ca(n, t, e, a = {}) {
  try {
    const {
      updateUI: i = !0,
      saveData: r = !0,
      validateData: o = !0
    } = a, s = e.findIndex((c) => c.blockId === n.blockId);
    if (s === -1)
      return {
        success: !1,
        message: `标签不存在: ${n.title}`
      };
    if (o) {
      const c = Sa(t);
      if (!c.success)
        return c;
    }
    return e[s] = { ...e[s], ...t }, {
      success: !0,
      message: `标签 "${n.title}" 已更新`,
      data: { tab: e[s], tabIndex: s }
    };
  } catch (i) {
    return {
      success: !1,
      message: `更新标签失败: ${i}`
    };
  }
}
function Ea(n, t, e, a = {}) {
  return !t || t.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : Ca(n, { title: t.trim() }, e, a);
}
function Sa(n) {
  return n.blockId !== void 0 && (!n.blockId || n.blockId.trim() === "") ? {
    success: !1,
    message: "标签块ID不能为空"
  } : n.title !== void 0 && (!n.title || n.title.trim() === "") ? {
    success: !1,
    message: "标签标题不能为空"
  } : n.order !== void 0 && (n.order < 0 || !Number.isInteger(n.order)) ? {
    success: !1,
    message: "标签顺序必须是正整数"
  } : {
    success: !0,
    message: "标签数据验证通过"
  };
}
function Ia(n) {
  n.sort((t, e) => t.isPinned && !e.isPinned ? -1 : !t.isPinned && e.isPinned ? 1 : t.order - e.order);
}
function Pa(n) {
  for (let t = n.length - 1; t >= 0; t--)
    if (!n[t].isPinned)
      return t;
  return -1;
}
function $a(n) {
  return [...n].sort((t, e) => t.isPinned && !e.isPinned ? -1 : !t.isPinned && e.isPinned ? 1 : 0);
}
function La(n, t, e, a) {
  return t ? {
    x: n.x,
    y: n.y,
    width: e,
    height: a
  } : {
    x: n.x,
    y: n.y,
    width: Math.min(800, window.innerWidth - n.x - 10),
    height: 28
  };
}
function Da(n, t, e, a) {
  const i = La(n, t, e, a);
  let r = n.x, o = n.y;
  return i.x < 0 ? r = 0 : i.x + i.width > window.innerWidth && (r = window.innerWidth - i.width), i.y < 0 ? o = 0 : i.y + i.height > window.innerHeight && (o = window.innerHeight - i.height), { x: r, y: o };
}
function Ma(n, t, e = !1) {
  let a = null;
  const i = (...r) => {
    const o = e && !a;
    a && clearTimeout(a), a = window.setTimeout(() => {
      a = null, e || n(...r);
    }, t), o && n(...r);
  };
  return i.cancel = () => {
    a && (clearTimeout(a), a = null);
  }, i;
}
function Ba(n, t, e) {
  var a, i;
  try {
    const r = n.startsWith("#") ? n : `#${n}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(r))
      return t === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const o = parseInt(r.slice(1, 3), 16), s = parseInt(r.slice(3, 5), 16), c = parseInt(r.slice(5, 7), 16), l = e !== void 0 ? e : document.documentElement.classList.contains("dark") || ((i = (a = window.orca) == null ? void 0 : a.state) == null ? void 0 : i.themeMode) === "dark";
    return t === "background" ? `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 1.05) c h)` : `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 0.6) c h)`;
  } catch {
    return t === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
function kt(n, t, e, a) {
  if (typeof t == "number" && typeof e == "function")
    return Aa(n, t, e, a);
  if (typeof t == "function" && typeof e == "function")
    return Wa(n, t, e);
  throw new Error("Invalid parameters for createWidthAdjustmentDialog");
}
function Aa(n, t, e, a) {
  const i = document.createElement("div");
  i.className = "width-adjustment-dialog";
  const r = Wt();
  i.style.cssText = r;
  const o = document.createElement("div");
  o.className = "dialog-title", o.textContent = "调整标签宽度", i.appendChild(o);
  const s = document.createElement("div");
  s.className = "dialog-slider-container", s.style.cssText = `
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
  l.type = "range", l.min = "80", l.max = "200", l.value = n.toString(), l.style.cssText = lt();
  const d = document.createElement("div");
  d.className = "dialog-width-display", d.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, d.textContent = `最大宽度: ${n}px`;
  const u = document.createElement("div");
  u.className = "dialog-slider-container", u.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const h = document.createElement("div");
  h.textContent = "最小宽度 (60px - 150px)", h.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
  `;
  const g = document.createElement("input");
  g.type = "range", g.min = "60", g.max = "150", g.value = t.toString(), g.style.cssText = lt();
  const p = document.createElement("div");
  p.className = "dialog-width-display", p.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, p.textContent = `最小宽度: ${t}px`;
  let m = null;
  const b = (y, T) => {
    m && clearTimeout(m), m = window.setTimeout(() => {
      e(y, T), m = null;
    }, 150);
  };
  l.oninput = () => {
    const y = parseInt(l.value), T = parseInt(g.value);
    y < T && (g.value = y.toString(), p.textContent = `最小宽度: ${y}px`), d.textContent = `最大宽度: ${y}px`;
    const S = parseInt(l.value), C = parseInt(g.value);
    b(S, C);
  }, g.oninput = () => {
    const y = parseInt(l.value), T = parseInt(g.value);
    T > y && (l.value = T.toString(), d.textContent = `最大宽度: ${T}px`), p.textContent = `最小宽度: ${T}px`;
    const S = parseInt(l.value), C = parseInt(g.value);
    b(S, C);
  }, s.appendChild(c), s.appendChild(l), s.appendChild(d), u.appendChild(h), u.appendChild(g), u.appendChild(p), i.appendChild(s), i.appendChild(u);
  const v = document.createElement("div");
  v.className = "dialog-buttons", v.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const f = document.createElement("button");
  f.className = "btn btn-primary", f.textContent = "确定", f.style.cssText = tt(), f.onclick = () => {
    const y = parseInt(l.value), T = parseInt(g.value);
    e(y, T), et(i);
  };
  const w = document.createElement("button");
  return w.className = "btn btn-secondary", w.textContent = "取消", w.style.cssText = tt(), w.onclick = () => {
    a && a(), et(i);
  }, v.appendChild(f), v.appendChild(w), i.appendChild(v), i;
}
function Wa(n, t, e) {
  const a = document.createElement("div");
  a.className = "width-adjustment-dialog";
  const i = Wt();
  a.style.cssText = i;
  const r = document.createElement("div");
  r.className = "dialog-title", r.textContent = "调整面板宽度", a.appendChild(r);
  const o = document.createElement("div");
  o.className = "dialog-slider-container", o.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const s = document.createElement("input");
  s.type = "range", s.min = "120", s.max = "800", s.value = n.toString(), s.style.cssText = lt();
  const c = document.createElement("div");
  c.className = "dialog-width-display", c.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, c.textContent = `当前宽度: ${n}px`, s.oninput = () => {
    const h = parseInt(s.value);
    c.textContent = `当前宽度: ${h}px`, t(h);
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
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = tt(), d.onclick = () => et(a);
  const u = document.createElement("button");
  return u.className = "btn btn-secondary", u.textContent = "取消", u.style.cssText = tt(), u.onclick = () => {
    e(), et(a);
  }, l.appendChild(d), l.appendChild(u), a.appendChild(l), a;
}
function et(n) {
  n && n.parentNode && n.parentNode.removeChild(n);
  const t = document.querySelector(".dialog-backdrop");
  t && t.remove();
}
function Na() {
  if (document.getElementById("dialog-styles")) return;
  const n = document.createElement("style");
  n.id = "dialog-styles", n.textContent = `
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
  `, document.head.appendChild(n);
}
function za(n, t) {
  return n.length !== t.length ? !0 : !n.every((e, a) => e === t[a]);
}
let A;
class Oa {
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(t) {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    /** 插件名称 - 动态获取的插件名称，用于API调用和存储 */
    x(this, "pluginName");
    // ==================== 重构的面板数据管理 ====================
    /** 面板顺序映射 - 存储面板ID和序号的映射关系，支持面板关闭后重新排序 */
    x(this, "panelOrder", []);
    /** 当前激活的面板ID - 通过.orca-panel.active获取 */
    x(this, "currentPanelId", null);
    /** 当前面板索引 - 在panelOrder数组中的索引位置 */
    x(this, "currentPanelIndex", -1);
    /** 每个面板的标签页数据 - 索引对应panelOrder数组，完全独立存储 */
    x(this, "panelTabsData", []);
    /** 存储服务实例 - 提供统一的数据存储接口，支持Orca API和localStorage降级 */
    x(this, "storageService", new _t());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    x(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    x(this, "lastPanelCheckTime", 0);
    /** 上次面板块检查时间 - 用于防抖 checkCurrentPanelBlocks 调用 */
    x(this, "lastBlockCheckTime", 0);
    /** 数据保存防抖定时器 - 用于合并频繁的保存操作 */
    x(this, "saveDataDebounceTimer", null);
    /** 数据保存防抖延迟（毫秒） - 性能优化：增加到500ms减少频繁保存 */
    x(this, "SAVE_DEBOUNCE_DELAY", 500);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 当前日志级别 */
    x(this, "currentLogLevel", Nt);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* UI元素和状态管理 - UI Elements and State Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== UI元素引用 ====================
    /** 标签页容器元素 - 包含所有标签页的主容器 */
    x(this, "tabContainer", null);
    /** 循环切换器元素 - 用于在面板间切换的UI元素 */
    x(this, "cycleSwitcher", null);
    // ==================== 拖拽状态 ====================
    /** 是否正在拖拽 - 标识当前是否处于拖拽状态 */
    x(this, "isDragging", !1);
    /** 是否正在切换标签 - 防止在标签切换过程中错误替换标签 */
    x(this, "isSwitchingTab", !1);
    /** 拖拽起始X坐标 - 记录拖拽开始时的鼠标X坐标 */
    x(this, "dragStartX", 0);
    /** 拖拽起始Y坐标 - 记录拖拽开始时的鼠标Y坐标 */
    x(this, "dragStartY", 0);
    // ==================== 配置参数 ====================
    /** 最大标签页数量 - 限制同时显示的标签页数量，从设置中读取 */
    x(this, "maxTabs", 10);
    /** 主页块ID - 主页块的唯一标识符，从设置中读取 */
    x(this, "homePageBlockId", null);
    /** 标签页位置 - 标签页容器的屏幕坐标位置 */
    x(this, "position", { x: 50, y: 50 });
    // ==================== 状态管理 ====================
    /** 监控定时器 - 用于定期检查面板状态和更新UI */
    x(this, "monitoringInterval", null);
    /** 焦点同步定时器 - 控制自动同步焦点的轮询逻辑 */
    x(this, "focusSyncInterval", null);
    /** 上一次焦点检测的状态 - 用于避免重复调用 checkCurrentPanelBlocks */
    x(this, "lastFocusState", null);
    /** 面板块检测任务 - 防止 checkCurrentPanelBlocks 并发执行 */
    x(this, "panelBlockCheckTask", null);
    /** 面板状态检测任务 - 防止 checkPanelStatusChange 并发执行 */
    x(this, "panelStatusCheckTask", null);
    /** 正在创建的标签 - 防止重复创建同一个标签 */
    x(this, "creatingTabs", /* @__PURE__ */ new Set());
    /** 全局事件监听器 - 统一的全局事件处理函数 */
    x(this, "globalEventListener", null);
    /** 更新防抖计时器 - 防止频繁更新UI的防抖机制 */
    x(this, "updateDebounceTimer", null);
    /** 面板索引更新防抖计时器 - 防止频繁更新面板索引 */
    x(this, "panelIndexUpdateTimer", null);
    /** 上次更新时间 - 记录最后一次UI更新的时间戳 */
    x(this, "lastUpdateTime", 0);
    /** 是否正在更新 - 标识当前是否正在进行UI更新操作 */
    x(this, "isUpdating", !1);
    /** 是否已完成初始化 - 标识插件是否已完成初始化过程 */
    x(this, "isInitialized", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 布局和位置管理 - Layout and Position Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 布局模式 ====================
    /** 垂直模式标志 - 标识当前是否处于垂直布局模式 */
    x(this, "isVerticalMode", !1);
    /** 垂直模式窗口宽度 - 垂直布局模式下的标签页容器宽度 */
    x(this, "verticalWidth", 120);
    /** 垂直模式位置 - 垂直布局模式下的标签页容器位置 */
    x(this, "verticalPosition", { x: 20, y: 20 });
    /** 水平模式位置 - 水平布局模式下的标签页容器位置 */
    x(this, "horizontalPosition", { x: 20, y: 20 });
    /** 水平布局标签最大宽度 - 水平布局下标签的最大宽度 */
    x(this, "horizontalTabMaxWidth", 130);
    /** 水平布局标签最小宽度 - 水平布局下标签的最小宽度 */
    x(this, "horizontalTabMinWidth", 80);
    // ==================== 调整大小状态 ====================
    /** 是否正在调整大小 - 标识当前是否正在进行大小调整操作 */
    x(this, "isResizing", !1);
    /** 是否固定到顶部 - 标识标签页容器是否固定到屏幕顶部 */
    x(this, "isFixedToTop", !1);
    /** 调整大小手柄 - 用于调整标签页容器大小的拖拽手柄元素 */
    x(this, "resizeHandle", null);
    // ==================== 侧边栏对齐 ====================
    /** 侧边栏对齐功能是否启用 - 控制是否自动与侧边栏对齐 */
    x(this, "isSidebarAlignmentEnabled", !1);
    /** 侧边栏状态监听器 - 监听侧边栏状态变化的MutationObserver */
    x(this, "sidebarAlignmentObserver", null);
    /** 上次检测到的侧边栏状态 - 用于检测侧边栏状态变化 */
    x(this, "lastSidebarState", null);
    /** 侧边栏防抖计时器 - 防止频繁响应侧边栏状态变化 */
    x(this, "sidebarDebounceTimer", null);
    // ==================== 窗口可见性 ====================
    /** 浮窗是否可见 - 控制标签页容器的显示/隐藏状态 */
    x(this, "isFloatingWindowVisible", !0);
    // ==================== 功能开关 ====================
    /** 是否显示块类型图标 - 控制是否在标签页中显示块类型图标 */
    x(this, "showBlockTypeIcons", !0);
    /** 是否在顶部栏显示按钮 - 控制是否在Orca顶部工具栏显示插件按钮 */
    x(this, "showInHeadbar", !0);
    /** 是否启用最近关闭的标签页功能 - 控制是否记录和显示最近关闭的标签页 */
    x(this, "enableRecentlyClosedTabs", !0);
    /** 是否启用多标签页保存功能 - 控制是否允许保存多个标签页组合 */
    x(this, "enableMultiTabSaving", !0);
    /** 是否在刷新后恢复聚焦标签页 - 控制软件刷新后是否自动聚焦并打开当前聚焦的标签页 */
    x(this, "restoreFocusedTab", !0);
    /** 新标签是否添加到末尾（一次性标志，使用后自动重置为false） */
    x(this, "addNewTabToEnd", !0);
    /** 是否启用中键固定标签页功能 - 控制中键点击是否固定标签页 */
    x(this, "enableMiddleClickPin", !1);
    /** 是否启用双击关闭标签页功能 - 控制双击是否关闭标签页 */
    x(this, "enableDoubleClickClose", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 性能优化 - Performance Optimization */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 性能优化管理器 ====================
    /** 性能优化管理器 - 统一管理所有性能优化工具 */
    x(this, "performanceOptimizer", null);
    /** MutationObserver优化器实例 - 用于优化DOM变化监听 */
    x(this, "optimizedObserver", null);
    /** 高级防抖优化器实例 - 用于任务防抖和调度 */
    x(this, "debounceOptimizer", null);
    /** 内存泄漏防护器实例 - 用于跟踪和清理资源 */
    x(this, "memoryLeakProtector", null);
    /** 批量处理器实例 - 用于批量DOM操作 */
    x(this, "batchProcessor", null);
    /** 性能监控器实例 - 用于监控性能指标（已禁用） */
    // private performanceMonitor: PerformanceMonitorOptimizer | null = null;
    /** 性能指标计数缓存 - 记录自定义指标的累计值（已禁用） */
    // private performanceCounters: Record<string, number> = {};
    /** 性能基线定时器ID - 控制基线采集任务 */
    x(this, "performanceBaselineTimer", null);
    /** 最近一次性能基线场景 */
    x(this, "lastBaselineScenario", null);
    /** 最近一次性能基线报告（已禁用） */
    // private lastBaselineReport: PerformanceReport | null = null;
    /** 上一次插件初始化耗时（毫秒） */
    x(this, "lastInitDurationMs", null);
    /** 性能指标名称常量 */
    x(this, "performanceMetricKeys", {
      initTotal: "plugin_init_total",
      tabInteraction: "tab_interaction_total",
      domMutations: "dom_mutations"
    });
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 拖拽和事件管理 - Drag and Event Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 拖拽状态管理 ====================
    /** 当前正在拖拽的标签 - 存储正在被拖拽的标签页信息 */
    x(this, "draggingTab", null);
    /** 全局拖拽结束监听器 - 处理拖拽结束事件的全局监听器 */
    x(this, "dragEndListener", null);
    /** 拖拽交换防抖计时器 - 防止拖拽过程中频繁触发交换操作 */
    x(this, "swapDebounceTimer", null);
    /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
    x(this, "dropIndicator", null);
    /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
    x(this, "dragOverTab", null);
    /** 上次交换的目标标签和位置 - 防止重复交换 */
    x(this, "lastSwapKey", "");
    /** 优化的拖拽监听器 - 避免全文档监听 */
    x(this, "dragOverListener", null);
    /** 懒加载状态 - 避免不必要的初始化 */
    x(this, "isDragListenersInitialized", !1);
    /** 拖拽悬停计时器 - 控制拖拽悬停的延迟响应 */
    x(this, "dragOverTimer", null);
    /** 是否正在拖拽悬停状态 - 标识当前是否处于拖拽悬停状态 */
    x(this, "isDragOverActive", !1);
    // ==================== 事件监听器 ====================
    /** 主题变化监听器 - 监听Orca主题变化的事件监听器 */
    x(this, "themeChangeListener", null);
    /** 滚动监听器 - 监听页面滚动事件的监听器 */
    x(this, "scrollListener", null);
    // ==================== 缓存和优化 ====================
    /** 上次面板发现时间 - 记录最后一次发现面板的时间戳 */
    x(this, "lastPanelDiscoveryTime", 0);
    /** 面板发现缓存 - 缓存面板发现结果，避免频繁扫描 */
    x(this, "panelDiscoveryCache", null);
    /** 设置检查定时器 - 定期检查设置变化的定时器 */
    x(this, "settingsCheckInterval", null);
    /** 上次的设置状态 - 缓存上次的设置状态，用于检测变化 */
    x(this, "lastSettings", null);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 已关闭标签页跟踪 ====================
    /** 已关闭的标签页blockId集合 - 用于跟踪已关闭的标签页，避免重复创建 */
    x(this, "closedTabs", /* @__PURE__ */ new Set());
    /** 最近关闭的标签页列表 - 按时间倒序存储最近关闭的标签页信息 */
    x(this, "recentlyClosedTabs", []);
    /** 保存的多标签页集合 - 存储用户保存的标签页组合 */
    x(this, "savedTabSets", []);
    /** 记录上一个标签集合 - 用于比较标签页变化 */
    x(this, "previousTabSet", null);
    // ==================== 工作区功能 ====================
    /** 工作区列表 - 存储所有用户创建的工作区 */
    x(this, "workspaces", []);
    /** 当前工作区ID - 标识当前激活的工作区 */
    x(this, "currentWorkspace", null);
    /** 是否启用工作区功能 - 控制工作区功能的开关 */
    x(this, "enableWorkspaces", !0);
    /** 进入工作区之前的标签页组 - 用于退出工作区时恢复到原始标签页组 */
    x(this, "tabsBeforeWorkspace", null);
    /** 是否需要在初始化后恢复标签页组 - 用于处理在工作区状态下关闭软件的情况 */
    x(this, "shouldRestoreTabsBeforeWorkspace", !1);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    x(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    x(this, "lastActiveBlockId", null);
    /** 是否正在导航中 - 用于避免导航时触发重复的聚焦检测 */
    x(this, "isNavigating", !1);
    // ==================== 快捷键相关 ====================
    /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
    x(this, "hoveredBlockId", null);
    // 防抖函数实例（仅用于拖拽等非关键场景）
    x(this, "draggingDebounce", Ma(async () => {
      await this.updateTabsUI();
    }, 200));
    this.pluginName = t, this.initializePerformanceOptimizers();
  }
  /** 简单的日志方法 */
  log(t, ...e) {
    this.currentLogLevel >= P.INFO && st(t, ...e);
  }
  logError(t, ...e) {
    this.currentLogLevel >= P.ERROR && ba(t, ...e);
  }
  logWarn(t, ...e) {
    this.currentLogLevel >= P.WARN && ma(t, ...e);
  }
  /**
   * 初始化性能优化器
   */
  initializePerformanceOptimizers() {
    try {
      this.log("🚀 初始化性能优化器..."), this.log("✅ 性能优化器已禁用");
    } catch (t) {
      this.error("❌ 性能优化器初始化失败:", t);
    }
  }
  /**
   * 确保性能监控实例可用（已禁用）
   */
  ensurePerformanceMonitorInstance() {
    return null;
  }
  /**
   * 启动性能计时（已禁用）
   */
  startPerformanceMeasurement(t) {
    return null;
  }
  /**
   * 记录计数型指标（已禁用）
   */
  recordPerformanceCountMetric(t) {
  }
  /**
   * 延迟输出性能基线报告
   */
  schedulePerformanceBaselineReport(t, e = 12e3) {
  }
  /**
   * 输出性能基线报告（已禁用）
   */
  emitPerformanceBaselineReport(t) {
  }
  /**
   * 构建性能基线日志（已禁用）
   */
  formatPerformanceBaselineReport(t, e) {
    const a = this.getLatestMetricMap(t.metrics), i = a.get(this.performanceMetricKeys.initTotal), r = a.get(this.performanceMetricKeys.tabInteraction), o = a.get(this.performanceMetricKeys.domMutations), s = a.get("fps"), c = a.get("memory_heap"), l = i ? `${i.value.toFixed(1)}${i.unit}` : this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : "n/a", d = r ? `${r.value.toFixed(0)}` : "0", u = o ? `${o.value.toFixed(0)}` : "0", h = s ? `${s.value.toFixed(0)}fps` : "n/a", g = c ? this.formatBytes(c.value) : "n/a";
    return [
      `[Performance][${e}] Baseline`,
      `  healthScore: ${t.healthScore}`,
      `  init_total: ${l}`,
      `  tab_interactions: ${d}`,
      `  dom_mutations: ${u}`,
      `  fps: ${h}`,
      `  heap_used: ${g}`,
      `  issues: ${t.issues.length}`
    ].join(`
`);
  }
  getLatestMetricMap(t) {
    const e = /* @__PURE__ */ new Map();
    for (const a of t) {
      const i = e.get(a.name);
      (!i || i.timestamp <= a.timestamp) && e.set(a.name, a);
    }
    return e;
  }
  formatBytes(t) {
    return t < 1024 ? `${t.toFixed(0)}B` : t < 1024 * 1024 ? `${(t / 1024).toFixed(1)}KB` : t < 1024 * 1024 * 1024 ? `${(t / 1024 / 1024).toFixed(1)}MB` : `${(t / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }
  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  debugLog(...t) {
    this.currentLogLevel >= P.DEBUG && st(t.join(" "), ...t);
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...t) {
    this.currentLogLevel >= P.VERBOSE && st(t.join(" "), ...t);
  }
  /** 警告日志 - 记录警告信息，提醒潜在问题 */
  warn(...t) {
    this.logWarn(t.join(" "));
  }
  /** 错误日志 - 记录错误信息，用于问题诊断 */
  error(...t) {
    this.logError(t.join(" "));
  }
  /**
   * 设置日志级别
   */
  setLogLevel(t) {
    this.currentLogLevel = t, F.setLogLevel(t), this.log(`📊 日志级别已设置为: ${P[t]}`);
  }
  /**
   * 从存储中恢复调试模式设置
   */
  async restoreDebugMode() {
    try {
      await this.storageService.getConfig(k.DEBUG_MODE, this.pluginName) && this.setLogLevel(P.VERBOSE);
    } catch {
    }
  }
  /**
   * 恢复聚焦标签页恢复设置
   */
  async restoreRestoreFocusedTabSetting() {
    try {
      const t = await this.storageService.getConfig(k.RESTORE_FOCUSED_TAB, this.pluginName);
      t != null && (this.restoreFocusedTab = t);
    } catch {
    }
  }
  /**
   * 恢复功能开关设置
   */
  async restoreFeatureToggleSettings() {
    try {
      const t = await this.storageService.getConfig(k.ENABLE_MIDDLE_CLICK_PIN, this.pluginName), e = await this.storageService.getConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, this.pluginName), a = t ?? e;
      a != null && (this.enableMiddleClickPin = a, this.enableDoubleClickClose = a), this.log(`🔧 功能开关设置已恢复: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`);
    } catch (t) {
      this.log("⚠️ 恢复功能开关设置失败:", t);
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
    await this.restoreDebugMode(), await this.restoreRestoreFocusedTabSetting(), await this.restoreFeatureToggleSettings(), Na(), this.tabStorageService = new Yt(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[Ct.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.loadWorkspaces();
    const [
      t,
      e,
      a,
      i
    ] = await Promise.all([
      this.restorePosition(),
      this.restoreLayoutMode(),
      this.restoreFixedToTopMode(),
      this.restoreFloatingWindowVisibility()
    ]);
    this.registerHeadbarButton(), await this.discoverPanels();
    const r = this.getFirstPanel();
    if (r ? this.log(`🎯 初始化第1个面板（持久化面板）: ${r}`) : this.log("⚠️ 初始化时没有发现面板"), this.shouldRestoreTabsBeforeWorkspace && this.tabsBeforeWorkspace)
      this.log("🔄 检测到保存的标签页组，直接恢复而不加载普通标签页"), this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = [...this.tabsBeforeWorkspace], this.shouldRestoreTabsBeforeWorkspace = !1, this.tabsBeforeWorkspace = null, await this.tabStorageService.clearTabsBeforeWorkspace(), this.log("✅ 已直接恢复到进入工作区前的标签页组");
    else {
      const [
        c,
        l,
        d,
        u
      ] = await Promise.all([
        this.tabStorageService.restoreFirstPanelTabs(),
        this.tabStorageService.restoreClosedTabs(),
        this.tabStorageService.restoreRecentlyClosedTabs(),
        this.tabStorageService.restoreSavedTabSets()
      ]);
      this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = c, this.closedTabs = l, this.recentlyClosedTabs = d, this.savedTabSets = u, await this.updateRestoredTabsBlockTypes();
    }
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && requestIdleCallback(() => {
      this.storageService.testConfigSerialization();
    }, { timeout: 2e3 });
    const o = document.querySelector(".orca-panel.active"), s = o == null ? void 0 : o.getAttribute("data-panel-id");
    if (s && !s.startsWith("_") && (this.currentPanelId = s, this.currentPanelIndex = this.getPanelIds().indexOf(s), this.log(`🎯 当前活动面板: ${s} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1 && requestIdleCallback(async () => {
      this.log("📂 延迟加载其他面板的标签页数据");
      for (let c = 1; c < this.panelOrder.length; c++) {
        const l = `panel_${c + 1}_tabs`;
        try {
          const d = await this.storageService.getConfig(l, this.pluginName, []);
          this.log(`📂 从存储获取到第 ${c + 1} 个面板的数据: ${d ? d.length : 0} 个标签页`), d && d.length > 0 ? (this.panelTabsData[c] = [...d], this.log(`✅ 成功加载第 ${c + 1} 个面板的标签页数据: ${d.length} 个`)) : (this.panelTabsData[c] = [], this.log(`📂 第 ${c + 1} 个面板没有保存的数据`));
        } catch (d) {
          this.warn(`❌ 加载第 ${c + 1} 个面板数据失败:`, d), this.panelTabsData[c] = [];
        }
      }
    }, { timeout: 1e3 }), s && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${s} 的标签页`), await this.scanCurrentPanelTabs();
    else if (s && this.currentPanelIndex === 0)
      if (this.log("📋 当前活动面板是第一个面板，使用持久化数据"), this.restoreFocusedTab) {
        const c = document.querySelector(".orca-panel.active");
        if (c) {
          const l = c.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (l) {
            const d = l.getAttribute("data-block-id");
            d && (this.getCurrentPanelTabs().find((g) => g.blockId === d) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${d}`), await this.checkCurrentPanelBlocks()));
          }
        }
      } else
        this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过当前聚焦页面的恢复');
    this.restoreFocusedTab ? await this.autoDetectAndSyncCurrentFocus() : this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过自动检测聚焦页面'), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.initializeOptimizedDOMObserver(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), setTimeout(() => {
      try {
        wa(), this.initializeHeadbarUserToolsTooltips(), Ot(), Ft(), this.log("✅ Tooltips 初始化完成，清理定时器和页面卸载清理已启动");
      } catch (c) {
        this.log("⚠️ Tooltips 初始化失败:", c);
      }
    }, 1e3), this.setupSettingsChecker(), this.schedulePerformanceBaselineReport("startup"), this.isInitialized = !0, this.log("✅ 插件初始化完成");
  }
  /**
   * 手动触发性能基线采集
   */
  requestPerformanceBaseline(t, e = 12e3) {
    this.schedulePerformanceBaselineReport(t, e);
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
      const i = t.querySelectorAll('.orca-hideable:not([style*="display: none"])');
      let r = null;
      for (const d of i) {
        if (this.isInsidePopup(d))
          continue;
        const u = d.querySelector(".orca-block-editor[data-block-id]");
        if (u) {
          r = u;
          break;
        }
      }
      if (!r) {
        this.log(`⚠️ 激活面板 ${e} 中没有找到可见的块编辑器，跳过自动检测`);
        return;
      }
      const o = r.getAttribute("data-block-id");
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
        const d = s.length - 1, u = s[d];
        s[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${u.title}" -> "${l.title}"`);
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
    const t = (r) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", r), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", t), this.log("主题变化监听器注册成功");
    } catch (r) {
      this.error("主题变化监听器注册失败:", r);
    }
    let e = orca.state.themeMode;
    const i = setInterval(() => {
      const r = orca.state.themeMode;
      r !== e && (this.log("备用检测：主题从", e, "切换到", r), e = r, setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 200));
    }, 500);
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", t), clearInterval(i);
    };
  }
  /**
   * 为用户工具栏按钮添加 tooltip
   * 使用与标签页标题相同的 tooltip 风格
   */
  initializeHeadbarUserToolsTooltips() {
    try {
      const t = document.querySelector(".orca-headbar-user-tools");
      if (!t) {
        this.log("⚠️ 未找到用户工具栏容器 (.orca-headbar-user-tools)");
        return;
      }
      const e = t.querySelectorAll('button, [role="button"]');
      this.log(`📌 找到 ${e.length} 个用户工具栏按钮`), e.forEach((a, i) => {
        const r = a, o = r.getAttribute("title");
        o && (r.removeAttribute("title"), D(r, {
          text: o,
          delay: 300,
          defaultPlacement: "bottom"
        }), this.log(`✅ 已为用户工具栏按钮 ${i + 1} 添加 tooltip: "${o}"`));
      }), this.log("✅ 用户工具栏按钮 tooltip 初始化完成");
    } catch (t) {
      this.error("⚠️ 初始化用户工具栏按钮 tooltip 失败:", t);
    }
  }
  /**
   * 设置滚动监听器
   */
  setupScrollListener() {
    this.scrollListener && (this.scrollListener(), this.scrollListener = null);
    let t = null;
    const e = () => {
      t && clearTimeout(t), t = setTimeout(() => {
        const i = this.getCurrentActiveTab();
        i && this.recordScrollPosition(i);
      }, 500);
    }, a = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    a.forEach((i) => {
      i.addEventListener("scroll", e, { passive: !0 });
    }), this.scrollListener = () => {
      a.forEach((i) => {
        i.removeEventListener("scroll", e);
      }), t && clearTimeout(t);
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
    let t = null;
    this.dragOverListener = (e) => {
      if (this.draggingTab) {
        if (e.preventDefault(), e.dataTransfer.dropEffect = "move", this.tabContainer) {
          const a = this.tabContainer.getBoundingClientRect();
          if (!(e.clientX >= a.left && e.clientX <= a.right && e.clientY >= a.top && e.clientY <= a.bottom)) {
            this.clearDropIndicator();
            return;
          }
          if (document.elementsFromPoint(e.clientX, e.clientY).some(
            (s) => s.classList.contains("new-tab-button") || s.classList.contains("drag-handle") || s.classList.contains("resize-handle")
          )) {
            this.clearDropIndicator();
            return;
          }
        }
        t || (t = requestAnimationFrame(() => {
          t = null;
          const i = document.elementsFromPoint(e.clientX, e.clientY).find((r) => {
            if (!r.classList.contains("orca-tab") || !r.hasAttribute("data-block-id")) return !1;
            const o = r.style;
            return !(o.opacity === "0" && o.pointerEvents === "none" || r.classList.contains("close-button") || r.classList.contains("new-tab-button") || r.classList.contains("drag-handle") || r.classList.contains("resize-handle"));
          });
          if (i) {
            const r = i.getAttribute("data-block-id"), s = this.getCurrentPanelTabs().find((c) => c.blockId === r);
            if (s && s.blockId !== this.draggingTab.blockId) {
              const c = i.getBoundingClientRect(), l = this.isVerticalMode && !this.isFixedToTop;
              let d;
              if (l) {
                const h = c.top + c.height / 2;
                d = e.clientY < h ? "before" : "after";
              } else {
                const h = c.left + c.width / 2;
                d = e.clientX < h ? "before" : "after";
              }
              this.updateDropIndicator(i, d);
              const u = `${s.blockId}-${d}`;
              this.lastSwapKey !== u && (this.lastSwapKey = u, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
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
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tab").forEach((e) => {
      const a = e;
      a.removeAttribute("data-dragging"), a.removeAttribute("data-drag-over"), a.classList.remove("dragging", "drag-over"), a.style.opacity === "0" && a.style.pointerEvents === "none" && (a.style.opacity = "", a.style.pointerEvents = "");
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
    const i = t.getBoundingClientRect(), r = t.parentElement;
    if (r) {
      const o = r.getBoundingClientRect();
      e === "before" ? (a.style.left = `${i.left - o.left}px`, a.style.top = `${i.top - o.top - 1}px`, a.style.width = `${i.width}px`) : (a.style.left = `${i.left - o.left}px`, a.style.top = `${i.bottom - o.top - 1}px`, a.style.width = `${i.width}px`), r.appendChild(a);
    }
    return a;
  }
  /**
   * 更新拖拽位置指示器（使用CSS伪元素）
   */
  updateDropIndicator(t, e) {
    this.clearDropIndicator(), t.setAttribute("data-drop-target", e);
  }
  /**
   * 清除拖拽位置指示器
   */
  clearDropIndicator() {
    this.tabContainer && this.tabContainer.querySelectorAll(".orca-tab").forEach((e) => {
      e.removeAttribute("data-drop-target");
    });
  }
  /**
   * 实时交换标签位置（拖拽过程中）- DOM级别平滑动画
   */
  async swapTabsRealtime(t, e, a) {
    var h, g;
    if (!this.tabContainer) return;
    const i = this.getCurrentPanelTabs(), r = i.findIndex((p) => p.blockId === e.blockId), o = i.findIndex((p) => p.blockId === t.blockId);
    if (r === -1 || o === -1 || r === o) return;
    const s = i.filter((p) => p.isPinned).length;
    let c = a === "before" ? o : o + 1;
    if (r < c && c--, e.isPinned) {
      if (c >= s) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶区域: ${e.title}`);
        return;
      }
      if (!t.isPinned) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶标签上: ${e.title} -> ${t.title}`);
        return;
      }
    }
    if (!e.isPinned) {
      if (c < s) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶区域: ${e.title}`);
        return;
      }
      if (t.isPinned) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶标签上: ${e.title} -> ${t.title}`);
        return;
      }
    }
    if (r === c) return;
    this.verboseLog(`🔄 [实时交换] ${e.title}: ${r} -> ${c}`);
    const [l] = i.splice(r, 1);
    i.splice(c, 0, l), await this.setCurrentPanelTabs(i);
    const d = this.tabContainer.querySelector(`[data-block-id="${e.blockId}"]`), u = this.tabContainer.querySelector(`[data-block-id="${t.blockId}"]`);
    d && u && (a === "before" ? (h = u.parentNode) == null || h.insertBefore(d, u) : (g = u.parentNode) == null || g.insertBefore(d, u.nextSibling));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(t, e) {
    const a = this.getCurrentPanelTabs(), i = a.findIndex((c) => c.blockId === t.blockId), r = a.findIndex((c) => c.blockId === e.blockId);
    if (i === -1 || r === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (i === r) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${e.title} (${r}) -> ${t.title} (${i})`);
    const o = a[r], s = a[i];
    a[i] = o, a[r] = s, a.forEach((c, l) => {
      c.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${o.title} -> 位置 ${i}`);
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
    t.forEach((r) => {
      const o = r.getAttribute("data-panel-id");
      if (o) {
        if (o.startsWith("_"))
          return;
        e.push(o), r.classList.contains("active") && (a = o);
      }
    });
    const i = this.getPanelIds();
    this.updatePanelOrder(e), this.updateCurrentPanelInfo(a), await this.handlePanelChanges(i, e);
  }
  /**
   * 更新当前面板信息
   */
  updateCurrentPanelInfo(t) {
    if (t) {
      const e = this.panelOrder.findIndex((a) => a.id === t);
      if (e !== -1) {
        if (this.currentPanelId === t && this.currentPanelIndex === e)
          return;
        this.currentPanelId = t, this.currentPanelIndex = e, this.log(`🔄 当前面板更新: ${t} (索引: ${e}, 序号: ${this.panelOrder[e].order})`);
      }
      return;
    }
    this.currentPanelId === null && this.currentPanelIndex === -1 || (this.currentPanelId = null, this.currentPanelIndex = -1, this.log("🔄 没有激活的面板"));
  }
  /**
   * 处理面板变化
   */
  async handlePanelChanges(t, e) {
    const a = t.filter((r) => !e.includes(r));
    a.length > 0 && (this.log("🗑️ 检测到面板被关闭:", a), await this.handlePanelClosure(a));
    const i = e.filter((r) => !t.includes(r));
    i.length > 0 && (this.log("🆕 检测到新面板被打开:", i), this.handleNewPanels(i)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   */
  async handlePanelClosure(t) {
    this.log("🗑️ 处理面板关闭:", t);
    const e = [];
    t.forEach((a) => {
      const i = this.panelOrder.findIndex((r) => r.id === a);
      i !== -1 && e.push(i);
    }), e.sort((a, i) => i - a).forEach((a) => {
      this.panelTabsData.splice(a, 1), this.log(`🗑️ 删除面板 ${t[e.indexOf(a)]} 的标签页数据`);
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
    this.panelOrder.splice(e, 1), this.panelOrder.forEach((a, i) => {
      a.order = i + 1;
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
    const e = this.getPanelIds();
    if (e.length === t.length && e.every((r, o) => r === t[o]))
      return;
    t.forEach((r) => {
      this.panelOrder.find((o) => o.id === r) || this.addPanel(r);
    }), this.panelOrder.filter((r) => !t.includes(r.id)).forEach((r) => {
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
    const a = e.querySelectorAll(".orca-block-editor[data-block-id]"), i = [];
    let r = 0;
    this.log(`🔍 扫描第一个面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const o of a) {
      const s = o.getAttribute("data-block-id");
      if (!s) continue;
      const c = await this.getTabInfo(s, t, r++);
      c && (i.push(c), this.log(`📋 找到标签页: ${c.title} (${s})`));
    }
    this.panelTabsData[0] = [...i], await this.savePanelTabsByKey(k.FIRST_PANEL_TABS, i), this.log(`📋 第一个面板扫描并保存了 ${i.length} 个标签页`);
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
    const t = this.getCurrentPanelTabs(), e = $a(t);
    this.setCurrentPanelTabs(e), this.syncCurrentTabsToStorage(e);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const t = this.getCurrentPanelTabs();
    return Pa(t);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(t) {
    return oa(t);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(t) {
    if (!Array.isArray(t) || t.length === 0)
      return !1;
    let e = !1, a = !1, i = !1;
    for (const r of t)
      r && typeof r == "object" && (r.t === "r" && r.v ? (i = !0, r.a || (e = !0)) : r.t === "t" && r.v && (a = !0));
    return e || a && i;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(t) {
    return na(t);
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
      page: "ti ti-cube",
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
      summary: "ti ti-cube",
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
          const i = this.extractTextFromContentSync(a.content);
          i && e.push(i);
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
          const i = t.getDay(), o = ["日", "一", "二", "三", "四", "五", "六"][i], s = e.replace(/E/g, o);
          return W(t, s);
        } else
          return W(t, e);
      else
        return W(t, e);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const r of i)
        try {
          return W(t, r);
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
      const i = await orca.invokeBackend("get-block", parseInt(t));
      if (!i) return null;
      let r = "", o = "", s = "", c = !1, l = "";
      l = await ot(i), this.verboseLog(`🔍 检测到块类型: ${l} (块ID: ${t})`), i.aliases && i.aliases.length > 0 && this.verboseLog(`🏷️ 别名块详细信息: blockId=${t}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${l}`);
      try {
        const d = Bt(i);
        if (d)
          c = !0, r = ia(d);
        else if (i.aliases && i.aliases.length > 0)
          r = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? r = i.text.substring(0, 50) : r = (await this.extractTextFromContent(i.content)).substring(0, 50);
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
          r = u;
        } else
          r = `块 ${t}`;
      } catch (d) {
        this.warn("获取标题失败:", d), r = `块 ${t}`;
      }
      try {
        const d = this.findProperty(i, "_color"), u = this.findProperty(i, "_icon");
        d && d.type === 1 && (o = d.value), u && u.type === 1 && u.value && u.value.trim() ? (s = u.value, this.verboseLog(`🎨 使用用户自定义图标: ${s} (块ID: ${t})`)) : (this.showBlockTypeIcons || l === "journal") && (s = Y(l), this.verboseLog(`🎨 使用块类型图标: ${s} (块类型: ${l}, 块ID: ${t})`));
      } catch (d) {
        this.warn("获取属性失败:", d), s = Y(l);
      }
      return {
        blockId: t,
        panelId: e,
        title: r || `块 ${t}`,
        color: o,
        icon: s,
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
    const t = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)";
    let e, a, i;
    if (this.isFixedToTop ? (e = { x: 0, y: 0 }, a = !1, i = window.innerWidth) : (e = this.isVerticalMode ? this.verticalPosition : this.position, a = this.isVerticalMode, i = this.verticalWidth), this.tabContainer = fa(
      a,
      e,
      i,
      t
    ), this.isFixedToTop) {
      const o = document.querySelector(".orca-headbar-sidebar-tools") || document.body;
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
          border-radius: var(--orca-radius-md);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin: 0 4px;
          padding: 0 8px;
          gap: 10px;
        `, this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${o.className || o.tagName}`);
    } else
      document.body.appendChild(this.tabContainer);
    this.tabContainer.addEventListener("mousedown", (o) => {
      if (!o || !o.target)
        return;
      const s = o.target;
      s.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && o.stopPropagation();
    }), this.tabContainer.addEventListener("click", (o) => {
      if (!o || !o.target)
        return;
      const s = o.target;
      s.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && o.stopPropagation();
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
    const t = document.createElement("style");
    t.id = "orca-tabs-drag-styles", t.textContent = `
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
    var e;
    if (!this.tabContainer || this.isUpdating) return;
    this.isUpdating = !0;
    const t = Date.now();
    try {
      if (t - this.lastUpdateTime < 200) {
        t - this.lastUpdateTime < 50 && this.verboseLog("⏭️ 跳过UI更新：距离上次更新仅 " + (t - this.lastUpdateTime) + "ms");
        return;
      }
      this.lastUpdateTime = t;
      const i = this.tabContainer.querySelector(".drag-handle"), r = this.tabContainer.querySelector(".new-tab-button"), o = this.tabContainer.querySelector(".workspace-button"), s = Array.from(this.tabContainer.querySelectorAll(".orca-tab")).map((h) => h.getAttribute("data-tab-id")).filter((h) => h !== null), c = this.getCurrentPanelTabs();
      this.tabContainer.querySelectorAll(".orca-tab").forEach((h) => h.remove()), i && i.parentElement !== this.tabContainer && this.tabContainer.insertBefore(i, this.tabContainer.firstChild);
      let d = this.currentPanelId, u = this.currentPanelIndex;
      if (!d && this.panelOrder.length > 0 && (d = this.panelOrder[0].id, u = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${d}`)), d) {
        this.verboseLog(`📋 显示面板 ${d} 的标签页`);
        let h = this.panelTabsData[u] || [];
        h.length === 0 && (this.log(`🔍 面板 ${d} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(u, d), h = this.panelTabsData[u] || []), this.sortTabsByPinStatus(), h = this.panelTabsData[u] || [];
        const g = document.createDocumentFragment();
        h.forEach((m, b) => {
          const v = this.createTabElement(m);
          g.appendChild(v);
        });
        const p = (e = this.tabContainer) == null ? void 0 : e.querySelector(".new-tab-button");
        this.tabContainer && (p ? this.tabContainer.insertBefore(g, p) : this.tabContainer.appendChild(g));
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton(), this.isFixedToTop) {
        const h = "var(--orca-tab-bg)", g = "var(--orca-tab-border)", p = "var(--orca-color-text-1)", m = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        m.forEach((v) => {
          const f = v.getAttribute("data-tab-id");
          if (!f) return;
          const y = this.getCurrentPanelTabs().find((T) => T.blockId === f);
          if (y) {
            let T, S, C = "normal";
            if (T = "var(--orca-tab-bg)", S = "var(--orca-color-text-1)", y.color)
              try {
                v.style.setProperty("--tab-color", y.color), (document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark")) && v.style.setProperty(
                  "--orca-tab-colored-text",
                  "oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h)",
                  "important"
                ), T = "var(--orca-tab-colored-bg)", S = "var(--orca-tab-colored-text)", C = "600";
              } catch {
              }
            v.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${T};
            border-radius: var(--orca-radius-md);
            border: 1px solid ${g};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${S};
            font-weight: ${C};
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            -webkit-app-region: no-drag;
            app-region: no-drag;
            pointer-events: auto;
          `, y.color && v.style.setProperty("--tab-color", y.color);
          }
        });
        const b = this.tabContainer.querySelector(".new-tab-button");
        b && (b.style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${h};
          border-radius: var(--orca-radius-md);
          border: 1px solid ${g};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${p};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${m.length}`);
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
    let t = this.getCurrentPanelTabs();
    t.length === 0 && (await this.scanCurrentPanelTabs(), t = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${t.length} 个标签页`);
    const e = document.createDocumentFragment();
    if (t.length > 0)
      t.forEach((a, i) => {
        const r = this.createTabElement(a);
        e.appendChild(r);
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
      a.textContent = `面板 ${i}（无标签页）`, D(a, ut(`当前在面板 ${i}，该面板没有标签页`)), e.appendChild(a);
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
      t.forEach((a, i) => {
        const r = this.createTabElement(a);
        e.appendChild(r);
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
      a.textContent = `面板 ${i}（无标签页）`, D(a, ut(`当前在面板 ${i}，该面板没有标签页`)), e.appendChild(a);
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
    e.style.cssText = a, e.innerHTML = "+", D(e, U("新建标签页")), e.addEventListener("mouseenter", () => {
      e.style.background = "rgba(0, 0, 0, 0.1)", e.style.color = "#333";
    }), e.addEventListener("mouseleave", () => {
      e.style.background = "transparent", e.style.color = "#666";
    }), e.addEventListener("click", async (i) => {
      i.preventDefault(), i.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(e), this.addNewTabButtonContextMenu(e), this.enableWorkspaces && this.addWorkspaceButton();
  }
  /**
   * 优化后的标签宽度更新方法 - 避免完全重建UI
   */
  async updateTabWidths(t, e) {
    try {
      this.horizontalTabMaxWidth = t, this.horizontalTabMinWidth = e, this.tabContainer && !this.isVerticalMode ? (this.tabContainer.querySelectorAll(".orca-tab").forEach((i) => {
        const r = i, o = this.getTabInfoFromElement(r);
        if (o) {
          const s = this.isVerticalMode && !this.isFixedToTop, c = Tt(o, s, () => "", t, e);
          r.style.cssText = c;
        }
      }), this.log(`📏 标签宽度已优化更新: 最大${t}px, 最小${e}px`)) : await this.createTabsUI();
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
  getTabInfoFromElement(t) {
    const e = t.getAttribute("data-tab-id");
    return e && (this.panelTabsData[this.currentPanelIndex] || []).find((i) => i.blockId === e) || null;
  }
  /**
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    try {
      if (this.isVerticalMode) {
        const t = kt(
          this.verticalWidth,
          async (e) => {
            try {
              orca.nav.changeSizes(orca.state.activePanel, [e]);
            } catch (a) {
              this.error("调整面板宽度失败:", a);
            }
            this.verticalWidth = e;
            try {
              await this.saveLayoutMode();
            } catch (a) {
              this.error("保存宽度设置失败:", a);
            }
          },
          async () => {
            try {
              orca.nav.changeSizes(orca.state.activePanel, [this.verticalWidth]);
            } catch (e) {
              this.error("恢复面板宽度失败:", e);
            }
          }
        );
        document.body.appendChild(t);
      } else {
        const t = this.horizontalTabMaxWidth, e = this.horizontalTabMinWidth, a = kt(
          this.horizontalTabMaxWidth,
          this.horizontalTabMinWidth,
          async (i, r) => {
            await this.updateTabWidths(i, r);
          },
          async () => {
            this.horizontalTabMaxWidth = t, this.horizontalTabMinWidth = e, await this.createTabsUI(), this.log(`📏 标签宽度已恢复: 最大${t}px, 最小${e}px`);
          }
        );
        document.body.appendChild(a);
      }
    } catch (t) {
      this.error("显示宽度调整对话框失败:", t);
    }
  }
  /**
   * 移除工作区按钮
   */
  removeWorkspaceButton() {
    if (!this.tabContainer) return;
    const t = this.tabContainer.querySelector(".workspace-button");
    t && (t.remove(), this.log("📁 工作区按钮已移除"));
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
    const e = this.enableMiddleClickPin || this.enableDoubleClickClose;
    this.log(`🔧 创建功能切换按钮，当前状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}, 按钮启用=${e}`);
    const a = va(
      this.isVerticalMode,
      e,
      async (i) => {
        i.preventDefault(), i.stopPropagation(), this.log("🔧 点击功能切换按钮"), alert("功能切换按钮被点击了！"), await this.toggleFeatureSettings();
      }
    );
    D(a, U(
      e ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)"
    )), a.addEventListener("mouseenter", () => {
      a.style.background = e ? "rgba(0, 150, 0, 0.2)" : "rgba(0, 0, 0, 0.1)", a.style.color = e ? "#004400" : "#333";
    }), a.addEventListener("mouseleave", () => {
      a.style.background = e ? "rgba(0, 150, 0, 0.1)" : "transparent", a.style.color = e ? "#006600" : "#666";
    }), this.tabContainer.appendChild(a), this.log("🔧 功能切换按钮已添加到DOM");
  }
  /**
   * 切换功能设置
   */
  async toggleFeatureSettings() {
    try {
      this.log(`🔧 切换前状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), this.enableMiddleClickPin = !this.enableMiddleClickPin, this.enableDoubleClickClose = !this.enableDoubleClickClose, this.log(`🔧 切换后状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), await this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, this.enableMiddleClickPin, this.pluginName), await this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, this.enableDoubleClickClose, this.pluginName), this.log("🔧 设置已保存到存储"), this.updateFeatureToggleButton(), this.log(`🔧 功能开关已切换: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), this.showFeatureToggleNotification();
    } catch (t) {
      this.log("⚠️ 切换功能设置失败:", t);
    }
  }
  /**
   * 更新功能切换按钮状态
   */
  updateFeatureToggleButton() {
    if (!this.tabContainer) return;
    const t = this.tabContainer.querySelector(".feature-toggle-button");
    if (!t) return;
    const e = this.enableMiddleClickPin || this.enableDoubleClickClose;
    t.innerHTML = e ? "🔒" : "🔓", t.title = e ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)";
    const a = this.isVerticalMode ? `
      width: calc(100% - 6px);
      margin: 0 3px;
      height: 24px;
      background: ${e ? "rgba(0, 150, 0, 0.1)" : "transparent"};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: ${e ? "#006600" : "#666"};
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
      border: 1px solid ${e ? "rgba(0, 150, 0, 0.3)" : "transparent"};
    ` : `
      width: 24px;
      height: 24px;
      background: ${e ? "rgba(0, 150, 0, 0.1)" : "transparent"};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: ${e ? "#006600" : "#666"};
      margin-left: 4px;
      min-height: 24px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
      border-radius: var(--orca-radius-md);
      transition: all 0.2s ease;
      border: 1px solid ${e ? "rgba(0, 150, 0, 0.3)" : "transparent"};
    `;
    t.style.cssText = a;
  }
  /**
   * 显示功能切换通知
   */
  showFeatureToggleNotification() {
    const t = this.enableMiddleClickPin || this.enableDoubleClickClose, e = t ? "功能已启用：中键固定标签页，双击关闭标签页" : "功能已禁用：中键关闭标签页，双击固定标签页", a = document.createElement("div");
    a.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${t ? "#4caf50" : "#ff9800"};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      font-size: 14px;
      max-width: 300px;
      word-wrap: break-word;
      animation: slideInRight 0.3s ease;
    `, a.textContent = e, document.body.appendChild(a), setTimeout(() => {
      a.parentNode && a.parentNode.removeChild(a);
    }, 3e3);
  }
  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    var i;
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
    e.style.cssText = a, e.innerHTML = '<i class="ti ti-layout-grid" style="font-size: 14px;"></i>', D(e, U(`工作区 (${((i = this.workspaces) == null ? void 0 : i.length) || 0})`)), e.addEventListener("mouseenter", () => {
      e.style.background = "rgba(0, 0, 0, 0.1)", e.style.color = "#333";
    }), e.addEventListener("mouseleave", () => {
      e.style.background = "transparent", e.style.color = "#666";
    }), e.addEventListener("click", (r) => {
      r.preventDefault(), r.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(r);
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
    var d, u;
    const e = document.querySelector(".new-tab-context-menu");
    e && e.remove(), document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") : document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null || u.themeMode);
    const a = document.createElement("div");
    a.className = "new-tab-context-menu";
    const i = 200, r = 140, { x: o, y: s } = G(t.clientX, t.clientY, i, r);
    a.style.cssText = `
      position: fixed;
      left: ${o}px;
      top: ${s}px;
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
    ), c.forEach((h) => {
      if (h.separator) {
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
      `, h.icon) {
        const m = document.createElement("span");
        m.textContent = h.icon, m.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, g.appendChild(m);
      }
      const p = document.createElement("span");
      p.textContent = h.text, g.appendChild(p), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        h.action && h.action(), a.remove();
      }), a.appendChild(g);
    }), document.body.appendChild(a);
    const l = (h) => {
      !h || !h.target || a.contains(h.target) || (a.remove(), document.removeEventListener("click", l));
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
      this.isSidebarAlignmentEnabled = !0, this.startSidebarAlignmentObserver(), await this.saveLayoutMode(), this.log("✅ 侧边栏对齐功能已启用，标签栏保持在当前位置");
    } catch (t) {
      this.error("启用侧边栏对齐失败:", t);
    }
  }
  /**
   * 禁用侧边栏对齐功能
   */
  async disableSidebarAlignment() {
    try {
      this.log("🔴 禁用侧边栏对齐功能"), this.stopSidebarAlignmentObserver(), await this.performSidebarAlignment(), this.isSidebarAlignmentEnabled = !1, await this.saveLayoutMode(), this.log("🔴 侧边栏对齐功能已禁用");
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
        (i) => i.type === "attributes" && i.attributeName === "class"
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
    let i;
    e ? i = "closed" : a ? i = "opened" : i = "unknown", this.lastSidebarState !== i && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${i}`), this.lastSidebarState = i, this.autoAdjustSidebarAlignment());
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
      const a = e.classList.contains("sidebar-closed"), i = e.classList.contains("sidebar-opened");
      if (!a && !i) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const r = this.getCurrentPosition();
      if (!r) return;
      const o = this.calculateSidebarAlignmentPosition(
        r,
        t,
        a,
        i
      );
      if (!o) return;
      await this.updatePosition(o), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${r.x}, ${r.y}) → (${o.x}, ${o.y})`);
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
  calculateSidebarAlignmentPosition(t, e, a, i) {
    var o;
    let r;
    if (a)
      r = Math.max(10, t.x - e), this.log(`📐 侧边栏关闭，向左移动 ${e}px: ${t.x}px → ${r}px`);
    else if (i) {
      r = t.x + e;
      const s = ((o = this.tabContainer) == null ? void 0 : o.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      r = Math.min(r, window.innerWidth - s - 10), this.log(`📐 侧边栏打开，向右移动 ${e}px: ${t.x}px → ${r}px`);
    } else
      return null;
    return { x: r, y: t.y };
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
        var a, i;
        const t = window.React, e = orca.components.Button;
        return t.createElement(e, {
          variant: "plain",
          onClick: (r) => this.showRecentlyClosedTabsMenu(r),
          title: `最近关闭的标签页 (${((a = this.recentlyClosedTabs) == null ? void 0 : a.length) || 0})`,
          style: {
            color: (((i = this.recentlyClosedTabs) == null ? void 0 : i.length) || 0) > 0 ? "#ff6b6b" : "#999",
            transition: "color 0.2s ease"
          }
        }, t.createElement("i", {
          className: "ti ti-history"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.savedTabsButton`, () => {
        var a, i;
        const t = window.React, e = orca.components.Button;
        return t.createElement(e, {
          variant: "plain",
          onClick: (r) => this.showSavedTabSetsMenu(r),
          title: `保存的标签页集合 (${((a = this.savedTabSets) == null ? void 0 : a.length) || 0})`,
          style: {
            color: (((i = this.savedTabSets) == null ? void 0 : i.length) || 0) > 0 ? "#3b82f6" : "#999",
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
      const i = t[a];
      try {
        const r = await orca.invokeBackend("get-block", parseInt(i.blockId));
        if (r) {
          const o = await ot(r), s = this.findProperty(r, "_color"), c = this.findProperty(r, "_icon");
          let l = i.color, d = i.icon;
          s && s.type === 1 && (l = s.value), c && c.type === 1 && c.value && c.value.trim() ? d = c.value : d || (d = Y(o)), i.blockType !== o || i.icon !== d || i.color !== l ? (t[a] = {
            ...i,
            blockType: o,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${i.title} -> 类型: ${o}, 图标: ${d}, 颜色: ${l}`), e = !0) : this.verboseLog(`⏭️ 跳过标签: ${i.title} (无需更新)`);
        }
      } catch (r) {
        this.warn(`更新标签失败: ${i.title}`, r);
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
        const r = parseInt(a.replace("px", ""));
        if (isNaN(r))
          this.log(`⚠️ CSS变量值无法解析为数字: "${a}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${r}px`), r;
      } else
        this.log("⚠️ CSS变量 --orca-sidebar-width 不存在或为空");
      this.log("   尝试获取实际宽度...");
      const i = t.getBoundingClientRect();
      return this.log(`   实际尺寸: width=${i.width}px, height=${i.height}px`), i.width > 0 ? (this.log(`✅ 从实际尺寸获取侧边栏宽度: ${i.width}px`), i.width) : (this.log("⚠️ 无法获取侧边栏宽度，所有方法都失败"), 0);
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
  handleResizeStart(t) {
    if (t.preventDefault(), t.stopPropagation(), !this.tabContainer) return;
    const e = t.clientX, a = this.verticalWidth, i = (o) => {
      const s = o.clientX - e, c = Math.max(120, Math.min(400, a + s));
      this.verticalWidth = c, this.tabContainer.style.width = `${c}px`;
    }, r = async () => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", r);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (o) {
        this.error("保存宽度设置失败:", o);
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
    const i = this.isVerticalMode && !this.isFixedToTop, r = Tt(t, i, () => "", this.horizontalTabMaxWidth, this.horizontalTabMinWidth);
    e.style.cssText = r;
    const o = da();
    if (t.icon && this.showBlockTypeIcons) {
      const c = ha(t.icon);
      o.appendChild(c);
    }
    const s = ua(t.title);
    if (o.appendChild(s), t.isPinned) {
      const c = ga();
      o.appendChild(c);
    }
    return e.appendChild(o), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), D(e, zt(t)), e.addEventListener("click", (c) => {
      var h;
      const l = c.target;
      if (l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle"))
        return;
      if (e.getAttribute("data-long-pressed") === "true") {
        e.removeAttribute("data-long-pressed");
        return;
      }
      if (document.querySelector(".hover-tab-list-container")) {
        B();
        return;
      }
      c.preventDefault(), this.verboseLog(`🖱️ 点击标签: ${t.title} (ID: ${t.blockId})`), this.closedTabs.has(t.blockId) && (this.closedTabs.delete(t.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${t.title}"，从已关闭列表中移除`));
      const u = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tabs-plugin .orca-tab");
      u == null || u.forEach((g) => g.removeAttribute("data-focused")), e.setAttribute("data-focused", "true"), this.switchToTab(t);
    }), e.addEventListener("mousedown", (c) => {
    }), e.addEventListener("dblclick", (c) => {
      const l = c.target;
      l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle") || (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.log(`🔧 双击事件处理: enableDoubleClickClose=${this.enableDoubleClickClose}`), this.enableDoubleClickClose ? (this.log("🔧 双击关闭标签页"), this.closeTab(t)) : (this.log("🔧 双击切换固定状态"), this.toggleTabPinStatus(t)));
    }), e.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.log(`🔧 中键事件处理: enableMiddleClickPin=${this.enableMiddleClickPin}`), this.enableMiddleClickPin ? (this.log("🔧 中键固定标签页"), this.toggleTabPinStatus(t)) : (this.log("🔧 中键关闭标签页"), this.closeTab(t)));
    }), e.addEventListener("keydown", (c) => {
      (c.target === e || e.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(t)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(t)));
    }), this.addOrcaContextMenu(e, t), this.addLongPressTabListEvents(e, t), e.draggable = !0, e.addEventListener("dragstart", (c) => {
      var u, h;
      const l = c.target;
      if (l.closest && l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      if (l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", c.dataTransfer.dropEffect = "move", (u = c.dataTransfer) == null || u.setData("text/plain", t.blockId);
      const d = document.createElement("img");
      d.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", d.style.opacity = "0";
      try {
        const g = e.getBoundingClientRect(), p = c.clientX - g.left, m = c.clientY - g.top;
        (h = c.dataTransfer) == null || h.setDragImage(d, p, m);
      } catch {
      }
      this.draggingTab = t, this.dragOverTab = null, this.lastSwapKey = "", this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (this.verboseLog("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), this.verboseLog("🔄 拖拽开始，设置draggingTab:", t.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), requestAnimationFrame(() => {
        e.style.opacity = "0", e.style.pointerEvents = "none";
      }), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${t.title} (ID: ${t.blockId})`);
    }), e.addEventListener("dragend", async (c) => {
      this.verboseLog("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (this.verboseLog("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback();
      const l = this.getCurrentPanelTabs();
      await this.setCurrentPanelTabs(l), this.draggingTab = null, this.dragOverTab = null, this.lastSwapKey = "", this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${t.title}`);
    }), e.addEventListener("dragover", (c) => {
      const l = c.target;
      if (!l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        if (this.tabContainer && !this.tabContainer.contains(l)) {
          c.dataTransfer.dropEffect = "none";
          return;
        }
        if (!(l.classList.contains("close-button") || l.classList.contains("new-tab-button") || l.classList.contains("drag-handle") || l.classList.contains("resize-handle") || l.classList.contains("tab-icon")) && this.draggingTab && this.draggingTab.blockId !== t.blockId) {
          if (this.draggingTab.isPinned !== t.isPinned) {
            c.dataTransfer.dropEffect = "none";
            return;
          }
          c.preventDefault(), c.stopPropagation(), c.dataTransfer.dropEffect = "move";
          const d = e.getBoundingClientRect(), u = this.isVerticalMode && !this.isFixedToTop;
          let h;
          if (u) {
            const p = d.top + d.height / 2;
            h = c.clientY < p ? "before" : "after";
          } else {
            const p = d.left + d.width / 2;
            h = c.clientX < p ? "before" : "after";
          }
          this.updateDropIndicator(e, h), this.dragOverTab = t;
          const g = `${t.blockId}-${h}`;
          this.lastSwapKey !== g && (this.lastSwapKey = g, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
            await this.swapTabsRealtime(t, this.draggingTab, h);
          }, 100)), this.verboseLog(`🔄 拖拽经过: ${t.title} (位置: ${h})`);
        }
      }
    }), e.addEventListener("dragenter", (c) => {
      if (!c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== t.blockId) {
        if (this.draggingTab.isPinned !== t.isPinned)
          return;
        c.preventDefault(), c.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${t.title}`);
      }
    }), e.addEventListener("dragleave", (c) => {
      const l = e.getBoundingClientRect(), d = c.clientX, u = c.clientY, h = 5;
      (d < l.left - h || d > l.right + h || u < l.top - h || u > l.bottom + h) && this.verboseLog(`🔄 拖拽离开: ${t.title}`);
    }), e.addEventListener("drop", (c) => {
      var d;
      c.preventDefault(), c.stopPropagation();
      const l = (d = c.dataTransfer) == null ? void 0 : d.getData("text/plain");
      this.log(`🔄 拖拽放置完成: ${l} -> ${t.blockId}`);
    }), e;
  }
  hexToRgba(t, e) {
    return la(t, e);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(t) {
    const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (e) {
      const a = parseInt(e[1], 16), i = parseInt(e[2], 16), r = parseInt(e[3], 16);
      return (0.299 * a + 0.587 * i + 0.114 * r) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(t, e) {
    const a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (a) {
      let i = parseInt(a[1], 16), r = parseInt(a[2], 16), o = parseInt(a[3], 16);
      i = Math.floor(i * (1 - e)), r = Math.floor(r * (1 - e)), o = Math.floor(o * (1 - e));
      const s = i.toString(16).padStart(2, "0"), c = r.toString(16).padStart(2, "0"), l = o.toString(16).padStart(2, "0");
      return `#${s}${c}${l}`;
    }
    return t;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(t, e, a) {
    const i = t / 255, r = e / 255, o = a / 255, s = (it) => it <= 0.04045 ? it / 12.92 : Math.pow((it + 0.055) / 1.055, 2.4), c = s(i), l = s(r), d = s(o), u = c * 0.4124564 + l * 0.3575761 + d * 0.1804375, h = c * 0.2126729 + l * 0.7151522 + d * 0.072175, g = c * 0.0193339 + l * 0.119192 + d * 0.9503041, p = 0.2104542553 * u + 0.793617785 * h - 0.0040720468 * g, m = 1.9779984951 * u - 2.428592205 * h + 0.4505937099 * g, b = 0.0259040371 * u + 0.7827717662 * h - 0.808675766 * g, v = Math.cbrt(p), f = Math.cbrt(m), w = Math.cbrt(b), y = 0.2104542553 * v + 0.793617785 * f + 0.0040720468 * w, T = 1.9779984951 * v - 2.428592205 * f + 0.4505937099 * w, S = 0.0259040371 * v + 0.7827717662 * f - 0.808675766 * w, C = Math.sqrt(T * T + S * S), N = Math.atan2(S, T) * 180 / Math.PI, q = N < 0 ? N + 360 : N;
    return { l: y, c: C, h: q };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(t, e, a) {
    const i = a * Math.PI / 180, r = e * Math.cos(i), o = e * Math.sin(i), s = t, c = r, l = o, d = s * s * s, u = c * c * c, h = l * l * l, g = 1.0478112 * d + 0.0228866 * u - 0.050217 * h, p = 0.0295424 * d + 0.9904844 * u + 0.0170491 * h, m = -92345e-7 * d + 0.0150436 * u + 0.7521316 * h, b = 3.2404542 * g - 1.5371385 * p - 0.4985314 * m, v = -0.969266 * g + 1.8760108 * p + 0.041556 * m, f = 0.0556434 * g - 0.2040259 * p + 1.0572252 * m, w = (C) => C <= 31308e-7 ? 12.92 * C : 1.055 * Math.pow(C, 1 / 2.4) - 0.055, y = Math.max(0, Math.min(255, Math.round(w(b) * 255))), T = Math.max(0, Math.min(255, Math.round(w(v) * 255))), S = Math.max(0, Math.min(255, Math.round(w(f) * 255)));
    return { r: y, g: T, b: S };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(t, e) {
    return Ba(t, e);
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
  setCurrentPanelTabs(t) {
    if (this.currentPanelIndex < 0 || this.currentPanelIndex >= this.getPanelIds().length) {
      this.log(`⚠️ 无法设置标签页数据，当前面板索引无效: ${this.currentPanelIndex}`);
      return;
    }
    this.currentPanelIndex >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[this.currentPanelIndex] = [...t], this.verboseLog(`📋 设置面板 ${this.getPanelIds()[this.currentPanelIndex]} (索引: ${this.currentPanelIndex}) 的标签页数据: ${t.length} 个`), this.saveCurrentPanelTabs();
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
        const t = this.panelTabsData[this.currentPanelIndex] || [], e = this.currentPanelIndex === 0 ? k.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
        await this.tabStorageService.savePanelTabsByKey(e, t);
      } catch (t) {
        this.error("保存面板标签页数据失败:", t);
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
    const t = this.panelTabsData[this.currentPanelIndex] || [], e = this.currentPanelIndex === 0 ? k.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
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
      this.verboseLog(`🔄 开始切换标签: ${t.title} (ID: ${t.blockId})`), this.isSwitchingTab = !0;
      const e = this.getCurrentActiveTab();
      e && (this.recordScrollPosition(e), this.lastActiveBlockId = e.blockId, this.verboseLog(`🎯 记录切换前的激活标签: ${e.title} (ID: ${e.blockId})`), this.recordTabSwitchHistory(e.blockId, t));
      const a = this.getPanelIds();
      let i = "";
      if (t.panelId && a.includes(t.panelId) ? i = t.panelId : this.currentPanelId && a.includes(this.currentPanelId) ? i = this.currentPanelId : a.length > 0 && (i = a[0]), !i) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const r = a.indexOf(i);
      r !== -1 ? (this.currentPanelIndex = r, this.currentPanelId = i) : this.warn(`⚠️ 目标面板 ${i} 不在面板列表中`), this.verboseLog(`🎯 目标面板ID: ${i}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(i);
      } catch (o) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", o);
      }
      try {
        this.verboseLog(`🚀 尝试使用安全导航到块 ${t.blockId}`), await this.safeNavigate(t.blockId, i), this.verboseLog("✅ 安全导航成功");
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
      this.lastActiveBlockId = t.blockId, this.verboseLog(`🔄 切换到标签: ${t.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(t), setTimeout(() => {
        this.debugScrollPosition(t);
      }, 500), await this.focusTabElementById(t.blockId), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页切换，实时更新工作区: ${t.title}`)), setTimeout(() => {
        this.isSwitchingTab = !1;
      }, 300);
    } catch (e) {
      this.error("切换标签失败:", e), this.isSwitchingTab = !1;
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
    const e = this.getCurrentPanelTabs(), a = e.findIndex((r) => r.blockId === t.blockId);
    if (a === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let i = -1;
    if (a === 0 ? i = 1 : a === e.length - 1 ? i = a - 1 : i = a + 1, i >= 0 && i < e.length) {
      const r = e[i];
      this.log(`🔄 自动切换到相邻标签: "${r.title}" (位置: ${i})`), this.currentPanelId && await this.safeNavigate(r.blockId, this.currentPanelId || "");
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(t) {
    const e = this.getCurrentPanelTabs(), a = ka(t, e, {
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
      await orca.plugins.setSettingsSchema(this.pluginName, e);
      const a = (t = orca.state.plugins[this.pluginName]) == null ? void 0 : t.settings;
      a != null && a.homePageBlockId && (this.homePageBlockId = a.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (a == null ? void 0 : a.showInHeadbar) !== void 0 && (this.showInHeadbar = a.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = a.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = a.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (a == null ? void 0 : a.enableWorkspaces) !== void 0 && (this.enableWorkspaces = a.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), (a == null ? void 0 : a.debugMode) !== void 0 && (a.debugMode ? this.setLogLevel(P.VERBOSE) : this.setLogLevel(P.INFO), await this.storageService.saveConfig(k.DEBUG_MODE, a.debugMode, this.pluginName)), (a == null ? void 0 : a.restoreFocusedTab) !== void 0 && (this.restoreFocusedTab = a.restoreFocusedTab, this.log(`🎯 刷新后恢复聚焦标签页: ${this.restoreFocusedTab ? "开启" : "关闭"}`), await this.storageService.saveConfig(k.RESTORE_FOCUSED_TAB, a.restoreFocusedTab, this.pluginName)), (a == null ? void 0 : a.enableMiddleClickPin) !== void 0 && (this.enableMiddleClickPin = a.enableMiddleClickPin, this.enableDoubleClickClose = a.enableMiddleClickPin, await this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, a.enableMiddleClickPin, this.pluginName), await this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, a.enableMiddleClickPin, this.pluginName)), (a == null ? void 0 : a.enableDoubleClickClose) !== void 0 && (this.enableMiddleClickPin = a.enableDoubleClickClose, this.enableDoubleClickClose = a.enableDoubleClickClose, await this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, a.enableDoubleClickClose, this.pluginName), await this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, a.enableDoubleClickClose, this.pluginName)), this.log("✅ 插件设置已注册");
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
      enableWorkspaces: this.enableWorkspaces,
      debugMode: this.currentLogLevel === P.VERBOSE,
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
    var t, e;
    try {
      const a = (t = orca.state.plugins[this.pluginName]) == null ? void 0 : t.settings;
      if (!a) return;
      if (a.showInHeadbar !== this.lastSettings.showInHeadbar) {
        const r = this.showInHeadbar;
        this.showInHeadbar = a.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${r ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (a.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = a.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), a.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const r = this.enableWorkspaces;
        this.enableWorkspaces = a.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${r ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.enableWorkspaces || this.removeWorkspaceButton(), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
      if (a.debugMode !== this.lastSettings.debugMode && (a.debugMode ? this.setLogLevel(P.VERBOSE) : this.setLogLevel(P.INFO), this.storageService.saveConfig(k.DEBUG_MODE, a.debugMode, this.pluginName).catch((r) => {
        this.error("保存调试模式设置失败:", r);
      }), this.lastSettings.debugMode = a.debugMode), a.restoreFocusedTab !== this.lastSettings.restoreFocusedTab) {
        const r = this.restoreFocusedTab;
        this.restoreFocusedTab = a.restoreFocusedTab, this.log(`🎯 设置变化：刷新后恢复聚焦标签页 ${r ? "开启" : "关闭"} -> ${this.restoreFocusedTab ? "开启" : "关闭"}`), this.storageService.saveConfig(k.RESTORE_FOCUSED_TAB, a.restoreFocusedTab, this.pluginName).catch((o) => {
          this.error("保存聚焦标签页恢复设置失败:", o);
        }), this.lastSettings.restoreFocusedTab = this.restoreFocusedTab;
      }
      const i = a.enableMiddleClickPin !== void 0 ? a.enableMiddleClickPin : a.enableDoubleClickClose;
      if (i !== void 0 && i !== this.lastSettings.enableMiddleClickPin) {
        const r = !!i;
        this.enableMiddleClickPin = a.enableMiddleClickPin, this.enableDoubleClickClose = r, this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, r, this.pluginName).catch((o) => this.error("保存中键固定设置失败:", o)), this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, r, this.pluginName).catch((o) => this.error("保存双击关闭设置失败:", o)), this.lastSettings.enableMiddleClickPin = r, (e = this.updateFeatureToggleButton) == null || e.call(this);
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
      this.unregisterBlockMenuCommands(), orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.openInNewTab", {
        worksOnMultipleBlocks: !1,
        render: (t, e, a) => {
          const i = window.React;
          return !i || !orca.components.MenuText ? null : i.createElement(orca.components.MenuText, {
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
          const i = window.React;
          return !i || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : i.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              a(), this.getTabInfo(t.toString(), this.currentPanelId || "" || "", 0).then((r) => {
                r ? this.showAddToTabGroupDialog(r) : orca.notify("error", "无法获取块信息");
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
   * 注销块菜单命令
   */
  unregisterBlockMenuCommands() {
    try {
      orca.blockMenuCommands.unregisterBlockMenuCommand && orca.blockMenuCommands.unregisterBlockMenuCommand("orca-tabs.openInNewTab"), orca.blockMenuCommands.unregisterBlockMenuCommand && orca.blockMenuCommands.unregisterBlockMenuCommand("orca-tabs.addToTabGroup"), this.log("✅ 已注销块菜单命令");
    } catch {
      this.log("ℹ️ 注销块菜单命令时未发现已注册的命令");
    }
  }
  /**
   * 创建新标签页
   */
  async createNewTab() {
    try {
      const t = this.homePageBlockId && this.homePageBlockId.trim() ? this.homePageBlockId : "1", e = this.homePageBlockId && this.homePageBlockId.trim() ? "🏠 主页" : "📄 新标签页";
      this.log(`🆕 创建新标签页，使用块ID: ${t}`);
      const a = this.getCurrentPanelTabs(), i = {
        blockId: t,
        panelId: this.currentPanelId || "",
        title: e,
        isPinned: !1,
        order: a.length
      };
      this.log(`📋 新标签页信息: "${i.title}" (ID: ${t})`);
      const r = this.getCurrentActiveTab();
      let o = a.length;
      if (this.log(`📊 当前标签数量: ${a.length}, 标签列表: ${a.map((s) => s.title).join(", ")}`), this.addNewTabToEnd)
        o = a.length, this.log(`🎯 [一次性] 将新标签添加到末尾: "${i.title}", 插入位置: ${o}`), this.addNewTabToEnd = !1, this.log("♻️ 已重置标志，后续新标签将在聚焦标签后插入");
      else if (r) {
        const s = a.findIndex((c) => c.blockId === r.blockId);
        s !== -1 && (o = s + 1, this.log(`🎯 将在聚焦标签 "${r.title}" 后面插入新标签: "${i.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (a.length >= this.maxTabs) {
        a.splice(o, 0, i), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${i.title}`);
        const s = this.findLastNonPinnedTabIndex();
        if (s !== -1) {
          const c = a[s];
          a.splice(s, 1), this.log(`🗑️ 删除末尾的非固定标签: "${c.title}" 来保持数量限制`), a.forEach((l, d) => {
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
        a.splice(o, 0, i), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${i.title}`);
      a.forEach((s, c) => {
        s.order = c;
      }), this.log(`🔄 已重新计算标签顺序: ${a.map((s) => `${s.title}(${s.order})`).join(", ")}`), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 创建新标签页，实时更新工作区: ${i.title}`)), await this.safeNavigate(t, this.currentPanelId || ""), this.log(`🔄 导航到块: ${t}`), this.log(`✅ 成功创建新标签页: "${i.title}"`);
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
      } catch (i) {
        this.warn("备用方法也失败:", i);
      }
    }
  }
  /**
   * 强制让指定的标签元素呈聚焦状态，确保UI与数据同步
   */
  async focusTabElementById(t) {
    this.tabContainer || await this.updateTabsUI();
    const e = () => {
      var r, o;
      const a = (r = this.tabContainer) == null ? void 0 : r.querySelectorAll(".orca-tabs-plugin .orca-tab");
      a == null || a.forEach((s) => s.removeAttribute("data-focused"));
      const i = (o = this.tabContainer) == null ? void 0 : o.querySelector(`[data-tab-id="${t}"]`);
      return i ? (i.setAttribute("data-focused", "true"), !0) : !1;
    };
    e() || (await this.updateTabsUI(), e());
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(t, e, a = !1) {
    this.verboseLog("📋 [DEBUG] ========== addTabToPanel 开始 =========="), this.verboseLog(`📋 [DEBUG] 参数: blockId=${t}, insertMode=${e}, navigate=${a}`), this.verboseLog(`📋 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`);
    try {
      const i = this.getCurrentPanelTabs();
      this.verboseLog(`📋 [DEBUG] 当前标签页数量: ${i.length}`), this.verboseLog("📋 [DEBUG] 当前标签页列表:"), i.forEach((l, d) => {
        this.verboseLog(`📋 [DEBUG]   [${d}] ${l.title} (ID: ${l.blockId}, 固定: ${l.isPinned})`);
      }), this.verboseLog(`📋 [DEBUG] closedTabs包含 ${t}: ${this.closedTabs.has(t)}`);
      const r = i.find((l) => l.blockId === t);
      if (r)
        return this.verboseLog(`📋 [DEBUG] ❌ 块 ${t} 已存在于标签页中: "${r.title}"`), this.closedTabs.has(t) && (this.verboseLog(`📋 [DEBUG] 从closedTabs中移除 ${t}`), this.closedTabs.delete(t), await this.saveClosedTabs()), this.verboseLog(`📋 [DEBUG] 切换到已存在标签: "${r.title}"`), await this.switchToTab(r), await this.focusTabElementById(r.blockId), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（已存在）=========="), !0;
      this.verboseLog(`📋 [DEBUG] ✅ 块 ${t} 不存在，准备创建新标签`), this.creatingTabs.has(t) ? this.verboseLog(`📋 [DEBUG] ℹ️ 块 ${t} 已在 creatingTabs 中（可能来自 Ctrl+点击）`) : (this.verboseLog(`📋 [DEBUG] 🔒 将块 ${t} 添加到 creatingTabs 集合，防止重复处理`), this.creatingTabs.add(t));
      let o = null;
      try {
        if (!orca.state.blocks[parseInt(t)])
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法找到块 ${t}`), this.warn(`无法找到块 ${t}`), !1;
        if (this.verboseLog("📋 [addTabToPanel] 找到块信息"), this.verboseLog("📋 [addTabToPanel] 获取标签信息..."), o = await this.getTabInfo(t, this.currentPanelId || "", i.length), !o)
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法获取块 ${t} 的标签信息`), this.warn(`无法获取块 ${t} 的标签信息`), !1;
        this.verboseLog(`📋 [addTabToPanel] 标签信息: "${o.title}" (类型: ${o.blockType})`);
      } finally {
        this.verboseLog(`📋 [DEBUG] 🔓 从 creatingTabs 集合中移除块 ${t}`), this.creatingTabs.delete(t);
      }
      let s = i.length, c = !1;
      if (this.verboseLog(`📋 [addTabToPanel] 插入模式: ${e}`), e === "replace") {
        this.verboseLog("📋 [addTabToPanel] 替换模式 - 获取当前聚焦标签");
        const l = this.getCurrentActiveTab();
        if (!l)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 没有找到当前聚焦的标签"), this.warn("没有找到当前聚焦的标签"), !1;
        this.verboseLog(`📋 [addTabToPanel] 聚焦标签: "${l.title}" (${l.blockId})`);
        const d = i.findIndex((u) => u.blockId === l.blockId);
        if (d === -1)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 无法找到聚焦标签在数组中的位置"), this.warn("无法找到聚焦标签在数组中的位置"), !1;
        l.isPinned ? (this.verboseLog("📋 [addTabToPanel] 聚焦标签是固定的，改为插入模式"), this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), s = d + 1, c = !1) : (this.verboseLog(`📋 [addTabToPanel] 将替换位置 ${d} 的标签`), s = d, c = !0);
      } else if (e === "after") {
        this.verboseLog("📋 [addTabToPanel] After模式 - 在聚焦标签后插入");
        const l = this.getCurrentActiveTab();
        if (l) {
          this.verboseLog(`📋 [addTabToPanel] 找到聚焦标签: "${l.title}" (${l.blockId})`);
          const d = i.findIndex((u) => u.blockId === l.blockId);
          d !== -1 ? (s = d + 1, this.verboseLog(`📋 [addTabToPanel] 将在位置 ${s} 插入（聚焦标签后面）`), this.log("📌 在聚焦标签后面插入新标签")) : this.verboseLog("📋 [addTabToPanel] 警告 - 聚焦标签不在列表中，使用默认位置");
        } else
          this.verboseLog("📋 [addTabToPanel] 警告 - 没有找到聚焦标签，使用默认位置");
      }
      if (this.verboseLog(`📋 [addTabToPanel] 最终插入位置: ${s}, 替换模式: ${c}`), i.length >= this.maxTabs)
        if (this.verboseLog(`📋 [addTabToPanel] 已达到标签上限 ${this.maxTabs}`), c)
          this.verboseLog(`📋 [addTabToPanel] 替换位置 ${s} 的标签`), i[s] = o;
        else {
          this.verboseLog("📋 [addTabToPanel] 插入新标签并删除最后一个非固定标签"), i.splice(s, 0, o);
          const l = this.findLastNonPinnedTabIndex();
          if (l !== -1)
            this.verboseLog(`📋 [addTabToPanel] 删除位置 ${l} 的非固定标签`), i.splice(l, 1);
          else {
            this.verboseLog("📋 [addTabToPanel] 所有标签都是固定的，无法插入");
            const d = i.findIndex((u) => u.blockId === o.blockId);
            return d !== -1 && i.splice(d, 1), !1;
          }
        }
      else
        this.verboseLog(`📋 [addTabToPanel] 标签数量未达到上限，直接${c ? "替换" : "插入"}`), c ? i[s] = o : i.splice(s, 0, o);
      return this.verboseLog(`📋 [addTabToPanel] 插入后标签列表: ${i.map((l) => `${l.title}(${l.blockId})`).join(", ")}`), this.verboseLog("📋 [DEBUG] 同步更新存储数组..."), this.syncCurrentTabsToStorage(i), this.verboseLog("📋 [DEBUG] 保存标签数据..."), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (this.verboseLog(`📋 [DEBUG] 更新工作区: ${this.currentWorkspace}`), await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${o.title}`)), this.verboseLog("📋 [DEBUG] 更新UI..."), await this.updateTabsUI(), a ? (this.verboseLog(`📋 [DEBUG] 开始导航到块 ${t}`), await this.safeNavigate(t, this.currentPanelId || "")) : this.verboseLog("📋 [DEBUG] 跳过导航（后台打开模式）"), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（成功）=========="), !0;
    } catch (i) {
      return this.error("[DEBUG] ❌ addTabToPanel 出错:", i), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（失败）=========="), !1;
    }
  }
  /**
   * 统一的导航方法，确保所有导航都设置 isNavigating 标志
   * @param blockId 要导航到的块ID
   * @param panelId 目标面板ID
   */
  async safeNavigate(t, e) {
    this.isNavigating = !0, this.verboseLog(`🚀 [safeNavigate] 开始导航到块 ${t}，设置 isNavigating = true`);
    try {
      await orca.nav.goTo("block", { blockId: parseInt(t) }, e), this.verboseLog("✅ [safeNavigate] 导航成功");
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
  async openInNewTab(t) {
    this.verboseLog("🔗 [DEBUG] ========== openInNewTab 开始 =========="), this.verboseLog(`🔗 [DEBUG] 目标块ID: ${t}`), this.verboseLog(`🔗 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`), this.verboseLog(`🔗 [DEBUG] creatingTabs 当前包含: ${Array.from(this.creatingTabs).join(", ") || "(空)"}`);
    try {
      const e = this.getCurrentPanelTabs();
      this.verboseLog(`🔗 [DEBUG] 当前标签页数量: ${e.length}`), this.verboseLog("🔗 [DEBUG] 当前标签页列表:"), e.forEach((r, o) => {
        this.verboseLog(`🔗 [DEBUG]   [${o}] ${r.title} (ID: ${r.blockId}, 固定: ${r.isPinned})`);
      });
      const a = e.find((r) => r.blockId === t);
      if (a) {
        this.verboseLog(`🔗 [DEBUG] ❌ 块 ${t} 已存在，标签: "${a.title}"，无需操作`), this.closedTabs.has(t) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${t}`), this.closedTabs.delete(t), await this.saveClosedTabs()), this.creatingTabs.has(t) && (this.verboseLog(`🔓 [DEBUG] 从 creatingTabs 中移除 ${t}（已存在）`), this.creatingTabs.delete(t)), this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成（已存在）==========");
        return;
      }
      if (this.verboseLog(`🔗 [DEBUG] ✅ 块 ${t} 不存在，准备在后台创建新标签页`), this.closedTabs.has(t) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${t}`), this.closedTabs.delete(t), await this.saveClosedTabs()), this.verboseLog(`🔗 [DEBUG] 调用 addTabToPanel(blockId: ${t}, mode: 'after', navigate: false)`), await this.addTabToPanel(t, "after", !1)) {
        this.verboseLog("🔗 [DEBUG] ✅ 成功在后台创建新标签页");
        const r = this.getCurrentPanelTabs();
        this.verboseLog(`🔗 [DEBUG] 更新后标签页数量: ${r.length}`);
      } else
        this.verboseLog("🔗 [DEBUG] ❌ 创建新标签页失败");
      this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成 ==========");
    } catch (e) {
      this.error("[DEBUG] ❌ openInNewTab 处理失败:", e), this.creatingTabs.has(t) && (this.verboseLog(`🔓 [DEBUG] 异常时从 creatingTabs 中移除 ${t}`), this.creatingTabs.delete(t));
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
  getBlockRefId(t) {
    var e, a;
    try {
      let i = t;
      for (; i && i !== document.body; ) {
        const r = i.classList;
        if (r.contains("orca-inline-r-content") || r.contains("orca-ref") || r.contains("block-ref") || r.contains("block-reference") || r.contains("orca-fragment-r") || r.contains("fragment-r") || r.contains("orca-block-reference") || i.tagName.toLowerCase() === "a" && ((e = i.getAttribute("href")) != null && e.startsWith("#"))) {
          const s = i.getAttribute("data-block-id") || i.getAttribute("data-ref-id") || i.getAttribute("data-blockid") || i.getAttribute("data-target-block-id") || i.getAttribute("data-fragment-v") || i.getAttribute("data-v") || ((a = i.getAttribute("href")) == null ? void 0 : a.replace("#", "")) || i.getAttribute("data-id");
          if (s && !isNaN(parseInt(s)))
            return this.log(`🔗 从元素中提取到块引用ID: ${s}`), s;
        }
        const o = i.dataset;
        for (const [s, c] of Object.entries(o))
          if ((s.toLowerCase().includes("block") || s.toLowerCase().includes("ref")) && c && !isNaN(parseInt(c)))
            return this.log(`🔗 从data属性 ${s} 中提取到块引用ID: ${c}`), c;
        i = i.parentElement;
      }
      if (t.textContent) {
        const r = t.textContent.trim(), o = r.match(/\[\[(?:块)?(\d+)\]\]/) || r.match(/block[:\s]*(\d+)/i);
        if (o && o[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${o[1]}`), o[1];
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
   * 创建上下文菜单项
   */
  createContextMenuItem(t, e, a, i) {
    return sa(t, e, a, i);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(t) {
    try {
      const e = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(e, orca.state.panels);
      if (a && a.viewState) {
        let i = null;
        const r = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (r) {
          const o = r.closest(".orca-panel");
          o && (i = o.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!i) {
          const o = document.querySelector(".orca-panel.active");
          o && (i = o.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (i || (i = document.body.scrollTop > 0 ? document.body : document.documentElement), i) {
          const o = {
            x: i.scrollLeft || 0,
            y: i.scrollTop || 0
          };
          a.viewState.scrollPosition = o;
          const s = this.getCurrentPanelTabs().findIndex((c) => c.blockId === t.blockId);
          s !== -1 && (this.getCurrentPanelTabs()[s].scrollPosition = o, await this.saveCurrentPanelTabs()), this.verboseLog(`📝 记录标签 "${t.title}" 滚动位置到viewState:`, o, "容器:", i.className);
        } else
          this.warn(`未找到标签 "${t.title}" 的滚动容器`);
      } else
        this.warn(`未找到面板 ${e} 或viewState`);
    } catch (e) {
      this.warn("记录滚动位置时出错:", e);
    }
  }
  /**
   * 替换当前标签页内容
   */
  async replaceCurrentTabWith(t, e) {
    try {
      this.verboseLog(`🔄 开始替换标签页: ${t} -> ${e.blockId}`);
      const a = this.getCurrentPanelTabs(), i = a.findIndex((c) => c.blockId === t);
      if (i === -1) {
        this.verboseLog(`⚠️ 未找到要替换的标签: ${t}`);
        return;
      }
      const r = this.getCurrentActiveTab(), o = r && r.blockId === t, s = a[i];
      a[i] = e, this.verboseLog(`🔄 替换标签页: "${s.title}" -> "${e.title}"`), await this.setCurrentPanelTabs(a), await this.immediateUpdateTabsUI(), o && (this.verboseLog(`🎯 重新聚焦到替换后的标签: ${e.title}`), this.isNavigating = !0, await new Promise((c) => setTimeout(c, 50)), await this.switchToTab(e), setTimeout(() => {
        this.isNavigating = !1;
      }, 100)), this.recordTabSwitchHistory(t, e), this.verboseLog("✅ 标签页替换完成");
    } catch (a) {
      this.warn("替换标签页失败:", a), this.isNavigating = !1;
    }
  }
  /**
   * 记录标签切换历史
   */
  async recordTabSwitchHistory(t, e) {
    try {
      await this.tabStorageService.updateTabSwitchHistory(t, e), this.verboseLog(`📝 记录标签切换历史: ${t} -> ${e.blockId}`);
    } catch (a) {
      this.warn("记录标签切换历史失败:", a);
    }
  }
  /**
   * 删除标签的切换历史记录
   */
  async deleteTabSwitchHistory(t) {
    try {
      await this.tabStorageService.deleteTabSwitchHistory(t), this.log(`🗑️ 删除标签 ${t} 的切换历史记录`);
    } catch (e) {
      this.warn("删除标签切换历史失败:", e);
    }
  }
  /**
   * 安全的closest方法，避免类型错误
   */
  safeClosest(t, e) {
    if (!t || typeof t != "object" || !("closest" in t))
      return null;
    try {
      return t.closest(e);
    } catch {
      return null;
    }
  }
  /**
   * 添加左键长按事件显示最近切换标签
   */
  addLongPressTabListEvents(t, e) {
    let a = null, i = null, r = 0, o = !1;
    const s = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: !0,
      maxWidth: 150
    };
    t.addEventListener("mousedown", (l) => {
      if (l.button !== 0) return;
      const d = l.target;
      d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle") || (o = !0, this.verboseLog(`🖱️ 开始长按标签: ${e.title}`), a = window.setTimeout(async () => {
        if (o) {
          t.setAttribute("data-long-pressed", "true");
          try {
            this.verboseLog("⏰ 长按触发，开始检查切换历史");
            const h = (await this.tabStorageService.restoreRecentTabSwitchHistory()).global_tab_history;
            if (this.verboseLog(`📋 全局切换历史记录: ${h ? h.recentTabs.length : 0} 个记录`), !h || h.recentTabs.length === 0) {
              this.verboseLog("⚠️ 没有全局切换历史记录，不显示悬浮列表");
              return;
            }
            const g = h.recentTabs;
            if (this.verboseLog(`📋 去重后的历史记录: ${g.length} 个记录`), g.length === 0) {
              this.verboseLog("⚠️ 去重后没有历史记录，不显示悬浮列表");
              return;
            }
            const p = t.getBoundingClientRect(), m = {
              x: p.left,
              y: p.bottom + 4
              // 在标签下方显示
            };
            this.verboseLog(`📍 计算悬浮位置: x=${m.x}, y=${m.y}`), this.verboseLog(`📊 标签尺寸: width=${p.width}, height=${p.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
            const b = (f) => {
              this.verboseLog(`🖱️ 点击悬浮标签: ${f.title}`), this.getCurrentPanelTabs().find((T) => T.blockId === f.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${f.title}`), this.recordTabSwitchHistory(e.blockId, f), this.switchToTab(f)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${e.title} -> ${f.title}`), this.replaceCurrentTabWith(e.blockId, f)), B();
            };
            i = wt(
              g,
              m,
              s,
              b,
              this.isVerticalMode
            ), this.verboseLog("✅ 悬浮标签列表创建完成"), s.enableScroll && g.length > s.maxDisplayCount && this.addScrollEvents(i, g, s, r, b);
            const v = (f) => {
              const w = f.target;
              this.safeClosest(w, ".hover-tab-list-container") || (B(), i = null, r = 0, document.removeEventListener("click", v));
            };
            setTimeout(() => {
              document.addEventListener("click", v);
            }, 100), this.verboseLog(`显示标签 ${e.title} 的悬浮列表: ${g.length} 个历史标签`);
          } catch (u) {
            this.warn("显示悬浮标签列表失败:", u);
          }
        }
      }, 500));
    }), t.addEventListener("mouseup", () => {
      a && (clearTimeout(a), a = null), o = !1;
    }), t.addEventListener("mouseleave", () => {
      a && (clearTimeout(a), a = null), o = !1;
    });
    const c = () => {
      setTimeout(() => {
        B(), i = null, r = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container");
    }), document.addEventListener("mouseleave", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && c();
    });
  }
  /**
   * 添加悬浮标签列表事件
   */
  addHoverTabListEvents(t, e) {
    let a = null, i = null, r = 0;
    const o = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: !0,
      maxWidth: 150
    };
    t.addEventListener("mouseenter", async () => {
      const l = t.getAttribute("data-tab-history-id");
      this.verboseLog(`🖱️ 鼠标进入标签: ${e.title} (标签历史ID: ${l})`), a && (clearTimeout(a), a = null), a = window.setTimeout(async () => {
        try {
          this.verboseLog(`⏰ 开始检查标签 ${e.title} 的切换历史`);
          const d = await this.tabStorageService.restoreRecentTabSwitchHistory(), u = [];
          if (Object.values(d).forEach((f) => {
            f.recentTabs && u.push(...f.recentTabs);
          }), this.verboseLog(`📋 所有切换历史记录: ${u.length} 个记录`), u.length === 0) {
            this.verboseLog("⚠️ 没有切换历史记录，不显示悬浮列表");
            return;
          }
          const h = /* @__PURE__ */ new Map();
          u.forEach((f) => {
            h.set(f.blockId, f);
          });
          const g = Array.from(h.values());
          if (this.verboseLog(`📋 去重后的历史记录: ${g.length} 个记录`), g.length === 0) {
            this.verboseLog("⚠️ 去重后没有历史记录，不显示悬浮列表");
            return;
          }
          const p = t.getBoundingClientRect(), m = {
            x: p.left,
            y: p.bottom + 4
            // 在标签下方显示
          };
          this.verboseLog(`📍 计算悬浮位置: x=${m.x}, y=${m.y}`), this.verboseLog(`📊 标签尺寸: width=${p.width}, height=${p.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
          const b = (f) => {
            this.verboseLog(`🖱️ 点击悬浮标签: ${f.title}`), this.getCurrentPanelTabs().find((T) => T.blockId === f.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${f.title}`), this.recordTabSwitchHistory(e.blockId, f), this.switchToTab(f)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${e.title} -> ${f.title}`), this.replaceCurrentTabWith(e.blockId, f)), B();
          };
          i = wt(
            g,
            m,
            o,
            b,
            this.isVerticalMode
          ), this.verboseLog("✅ 悬浮标签列表创建完成"), o.enableScroll && g.length > o.maxDisplayCount && this.addScrollEvents(i, g, o, r, b);
          const v = (f) => {
            const w = f.target;
            this.safeClosest(w, ".hover-tab-list-container") || (B(), i = null, r = 0, document.removeEventListener("click", v));
          };
          setTimeout(() => {
            document.addEventListener("click", v);
          }, 100), this.verboseLog(`显示标签 ${e.title} 的悬浮列表: ${g.length} 个历史标签`);
        } catch (d) {
          this.warn("显示悬浮标签列表失败:", d);
        }
      }, 500);
    }), t.addEventListener("mouseleave", () => {
      a && (clearTimeout(a), a = null), a = window.setTimeout(() => {
        B(), i = null, r = 0;
      }, 200);
    });
    const s = () => {
      a && (clearTimeout(a), a = null);
    }, c = () => {
      a = window.setTimeout(() => {
        B(), i = null, r = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && s();
    }), document.addEventListener("mouseleave", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && c();
    });
  }
  /**
   * 添加滚动事件
   */
  addScrollEvents(t, e, a, i, r) {
    const o = t.querySelector(".hover-tab-list-scroll");
    if (!o) return;
    let s = !1;
    o.addEventListener("wheel", (c) => {
      if (c.preventDefault(), s) return;
      s = !0;
      const l = c.deltaY > 0 ? a.scrollStep : -a.scrollStep, d = Math.max(0, Math.min(i + l, e.length - a.maxDisplayCount));
      d !== i && (i = d, dt(t, e, a, r, this.isVerticalMode, i)), setTimeout(() => {
        s = !1;
      }, 100);
    }), t.addEventListener("keydown", (c) => {
      if (c.key === "ArrowUp" || c.key === "ArrowDown") {
        c.preventDefault();
        const l = c.key === "ArrowDown" ? a.scrollStep : -a.scrollStep, d = Math.max(0, Math.min(i + l, e.length - a.maxDisplayCount));
        d !== i && (i = d, dt(t, e, a, r, this.isVerticalMode, i));
      }
    });
  }
  /**
   * 恢复标签的滚动位置
   */
  restoreScrollPosition(t) {
    try {
      let e = null;
      const a = this.getPanelIds()[this.currentPanelIndex], i = orca.nav.findViewPanel(a, orca.state.panels);
      if (i && i.viewState && i.viewState.scrollPosition && (e = i.viewState.scrollPosition, this.verboseLog(`🔄 从viewState恢复标签 "${t.title}" 滚动位置:`, e)), !e && t.scrollPosition && (e = t.scrollPosition, this.verboseLog(`🔄 从标签信息恢复标签 "${t.title}" 滚动位置:`, e)), !e) return;
      const r = (o = 1) => {
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
        s || (s = document.body.scrollTop > 0 ? document.body : document.documentElement), s ? (s.scrollLeft = e.x, s.scrollTop = e.y, this.verboseLog(`🔄 恢复标签 "${t.title}" 滚动位置:`, e, "容器:", s.className, `尝试${o}`)) : setTimeout(() => r(o + 1), 200 * o);
      };
      r(), setTimeout(() => r(2), 100), setTimeout(() => r(3), 300);
    } catch (e) {
      this.warn("恢复滚动位置时出错:", e);
    }
  }
  /**
   * 调试滚动位置信息
   */
  debugScrollPosition(t) {
    this.verboseLog(`🔍 调试标签 "${t.title}" 滚动位置:`), this.verboseLog("标签保存的滚动位置:", t.scrollPosition);
    const e = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(e, orca.state.panels);
    a && a.viewState ? (this.verboseLog("viewState中的滚动位置:", a.viewState.scrollPosition), this.verboseLog("完整viewState:", a.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((r) => {
      document.querySelectorAll(r).forEach((s, c) => {
        const l = s;
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
  isTabActive(t) {
    try {
      let e = null;
      if (this.currentPanelId && (e = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`)), t.panelId) {
        const o = document.querySelector(`.orca-panel[data-panel-id="${t.panelId}"]`);
        o && (e = o);
      }
      if (e || (e = document.querySelector(".orca-panel.active")), !e) return !1;
      const a = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!a) return !1;
      const r = a.getAttribute("data-block-id") === t.blockId;
      return r && this.closedTabs.has(t.blockId) ? (this.verboseLog(`🔍 标签 ${t.title} 在已关闭列表中，不认为是激活状态`), !1) : r;
    } catch (e) {
      return this.warn("检查标签激活状态时出错:", e), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    var s;
    const t = this.enableWorkspaces ? this.getCurrentPanelTabs() : this.getCurrentPanelTabs();
    if (t.length === 0) return null;
    const e = (s = this.tabContainer) == null ? void 0 : s.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (e) {
      const c = e.getAttribute("data-tab-id");
      if (c) {
        const l = t.find((d) => d.blockId === c);
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
    const o = t.find((c) => c.blockId === r) || null;
    return o ? this.verboseLog(`🎯 根据DOM块编辑器找到激活标签: ${o.title} (ID: ${r})`) : this.verboseLog(`⚠️ 在标签列表中找不到块ID ${r} 对应的标签`), this.enableWorkspaces && this.currentWorkspace && o && this.updateCurrentWorkspaceActiveIndex(o), o;
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
    const a = t.findIndex((i) => i.blockId === e.blockId);
    return a === -1 ? -1 : a;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const t = this.getCurrentPanelTabs();
    if (t.length === 0) return null;
    if (this.lastActiveBlockId) {
      const a = t.find((i) => i.blockId === this.lastActiveBlockId);
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
    const a = e.findIndex((i) => i.blockId === t.blockId);
    return a === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${t.title}" (索引${a}) 后面插入新标签`), a);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(t) {
    const e = this.getCurrentPanelTabs(), a = e.findIndex((i) => i.blockId === t.blockId);
    return a === -1 || e.length <= 1 ? null : a < e.length - 1 ? e[a + 1] : a > 0 ? e[a - 1] : a === 0 && e.length > 1 ? e[1] : null;
  }
  /**
   * 关闭标签页
   */
  async closeTab(t) {
    var i;
    const e = this.getCurrentPanelTabs();
    if (e.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    t.isPinned && this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
    const a = e.findIndex((r) => r.blockId === t.blockId);
    if (a !== -1) {
      const r = this.getCurrentActiveTab(), o = r && r.blockId === t.blockId, s = o ? this.getAdjacentTab(t) : null;
      if (this.closedTabs.add(t.blockId), this.enableRecentlyClosedTabs) {
        const d = { ...t, closedAt: Date.now() }, u = this.recentlyClosedTabs.findIndex((h) => h.blockId === t.blockId);
        u !== -1 && this.recentlyClosedTabs.splice(u, 1), this.recentlyClosedTabs.unshift(d), this.recentlyClosedTabs.length > 10 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 10)), await this.saveRecentlyClosedTabs();
      }
      const c = (i = this.tabContainer) == null ? void 0 : i.querySelector(`[data-tab-id="${t.blockId}"]`), l = c == null ? void 0 : c.getAttribute("data-tab-history-id");
      l && await this.deleteTabSwitchHistory(l), e.splice(a, 1), this.syncCurrentTabsToStorage(e), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${t.title}`)), this.log(`🗑️ 标签 "${t.title}" 已关闭，已添加到关闭列表`), o && s ? (this.log(`🔄 自动切换到相邻标签: "${s.title}"`), await this.switchToTab(s)) : o && !s && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const t = this.getCurrentPanelTabs();
    t.filter((r) => !r.isPinned).forEach((r) => {
      this.closedTabs.add(r.blockId);
    });
    const a = t.filter((r) => r.isPinned), i = t.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${i} 个标签，保留了 ${a.length} 个固定标签`);
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
    const r = e.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${r} 个标签，保留了当前标签和固定标签`);
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
    const i = e.textContent, r = e.style.cssText, o = e.draggable;
    e.draggable = !1;
    const s = document.createElement("input");
    s.type = "text", s.value = t.title, s.className = "inline-rename-input";
    let c = "var(--orca-color-text-1)", l = "";
    t.color && (l = `--tab-color: ${t.color.startsWith("#") ? t.color : `#${t.color}`};`, c = "var(--orca-tab-colored-text)"), s.style.cssText = `
      ${l}
      background: transparent;
      color: ${c};
      border: none;
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      font-weight: 600;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, e.textContent = "", e.appendChild(s), e.style.padding = "2px 8px", s.focus(), s.select();
    const d = async () => {
      const h = s.value.trim();
      if (h && h !== t.title) {
        await this.updateTabTitle(t, h), e.draggable = o;
        return;
      }
      e.textContent = i, e.style.cssText = r, e.draggable = o;
    }, u = () => {
      e.textContent = i, e.style.cssText = r, e.draggable = o;
    };
    s.addEventListener("blur", d), s.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), d()) : h.key === "Escape" && (h.preventDefault(), u());
    }), s.addEventListener("click", (h) => {
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
    const r = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    let o = { x: "50%", y: "50%" };
    if (r) {
      const u = r.getBoundingClientRect(), h = window.innerWidth, g = window.innerHeight, p = 300, m = 100, b = 20;
      let v = u.left, f = u.top - m - 10;
      v + p > h - b && (v = h - p - b), v < b && (v = b), f < b && (f = u.bottom + 10, f + m > g - b && (f = (g - m) / 2)), f + m > g - b && (f = g - m - b), v = Math.max(b, Math.min(v, h - p - b)), f = Math.max(b, Math.min(f, g - m - b)), o = { x: `${v}px`, y: `${f}px` };
    }
    const s = orca.components.InputBox, c = e.createElement(s, {
      label: "重命名标签",
      defaultValue: t.title,
      onConfirm: (u, h, g) => {
        u && u.trim() && u.trim() !== t.title && this.updateTabTitle(t, u.trim()), g();
      },
      onCancel: (u) => {
        u();
      }
    }, (u) => e.createElement("div", {
      style: {
        position: "absolute",
        left: o.x,
        top: o.y,
        pointerEvents: "auto"
      },
      onClick: u
    }, ""));
    a.render(c, i), setTimeout(() => {
      const u = i.querySelector("div");
      u && u.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        a.unmountComponentAtNode(i), i.remove();
      }, 100);
    }, d = (u) => {
      u.key === "Escape" && (l(), document.removeEventListener("keydown", d));
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
      border: 1px solid var(--orca-color-primary-5);
      border-radius: var(--orca-radius-md);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: .175rem var(--orca-spacing-md);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      min-width: 200px;
    `;
    const i = document.createElement("input");
    i.type = "text", i.value = t.title, i.style.cssText = `
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
    const o = document.createElement("button");
    o.className = "orca-button orca-button-primary", o.textContent = "确认";
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "取消", r.appendChild(o), r.appendChild(s), a.appendChild(i), a.appendChild(r);
    const c = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    if (c) {
      const h = c.getBoundingClientRect();
      a.style.left = `${h.left}px`, a.style.top = `${h.top - 60}px`;
    } else
      a.style.left = "50%", a.style.top = "50%", a.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(a), i.focus(), i.select();
    const l = () => {
      const h = i.value.trim();
      h && h !== t.title && this.updateTabTitle(t, h), a.remove();
    }, d = () => {
      a.remove();
    };
    o.addEventListener("click", l), s.addEventListener("click", d), i.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), d());
    });
    const u = (h) => {
      !h || !h.target || a.contains(h.target) || (d(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
    }, 100);
  }
  /**
   * 更新标签标题
   */
  async updateTabTitle(t, e) {
    try {
      const a = this.getCurrentPanelTabs(), i = Ea(t, e, a, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      i.success ? (this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${e}`)), this.log(i.message)) : this.warn(i.message);
    } catch (a) {
      this.error("重命名标签失败:", a);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(t, e) {
    t.addEventListener("contextmenu", (a) => {
      a.preventDefault(), a.stopPropagation(), a.stopImmediatePropagation(), this.showTabContextMenu(a, e);
    });
  }
  createOrcaContextMenu(t, e) {
    const a = window.React, i = window.ReactDOM, r = document.createElement("div");
    r.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, t.appendChild(r);
    const o = orca.components.ContextMenu, s = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, d = a.createElement(o, {
      menu: (g) => a.createElement(s, {}, [
        a.createElement(c, {
          key: "rename",
          title: "重命名标签",
          shortcut: "F2",
          onClick: () => {
            g(), this.renameTab(e);
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
          title: e.isPinned ? "取消固定" : "固定标签",
          preIcon: e.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            g(), this.toggleTabPinStatus(e);
          }
        }),
        // 如果有保存的标签组，添加"添加到已有标签组"选项
        ...this.savedTabSets.length > 0 ? [
          a.createElement(c, {
            key: "addToGroup",
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              g(), this.showAddToTabGroupDialog(e);
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
    const u = () => {
      i.unmountComponentAtNode(r), r.remove();
    }, h = new MutationObserver((g) => {
      g.forEach((p) => {
        p.removedNodes.forEach((m) => {
          m === t && (u(), h.disconnect());
        });
      });
    });
    h.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(t, e) {
    var h, g;
    const a = document.querySelector(".tab-context-menu");
    a && a.remove();
    const i = document.documentElement.classList.contains("dark") || ((g = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : g.themeMode) === "dark", r = document.createElement("div");
    r.className = "tab-context-menu";
    const o = 220, s = 240, { x: c, y: l } = G(t.clientX, t.clientY, o, s);
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
        action: () => this.renameTab(e)
      },
      {
        text: e.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(e)
      }
    ];
    this.savedTabSets.length > 0 && d.push({
      text: "添加到已有标签组",
      action: () => this.showAddToTabGroupDialog(e)
    }), d.push(
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
      const v = document.createElement("i");
      v.className = "tab-context-menu-icon", p.text.includes("重命名") ? v.classList.add("ti", "ti-edit") : p.text.includes("固定") ? v.classList.add("ti", e.isPinned ? "ti-pin-off" : "ti-pin") : p.text.includes("添加到已有标签组") ? v.classList.add("ti", "ti-bookmark-plus") : p.text.includes("关闭") ? v.classList.add("ti", "ti-x") : v.classList.add("ti", "ti-edit"), v.style.cssText = `
        flex: 0 0 auto;
        font-size: var(--orca-fontsize-lg);
        margin-top: var(--orca-spacing-xs);
        margin-right: var(--orca-spacing-md);
        color: var(--orca-tab-colored-text);
        width: 16px;
        text-align: center;
      `, m.appendChild(v);
      const f = document.createElement("span");
      f.textContent = p.text, m.appendChild(f), p.disabled || (m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      }), m.addEventListener("click", () => {
        p.action(), r.remove();
      })), r.appendChild(m);
    }), document.body.appendChild(r);
    const u = (p) => {
      !p || !p.target || r.contains(p.target) || (r.remove(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
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
      const i = t[a];
      if (!i.blockType || !i.icon)
        try {
          const o = await orca.invokeBackend("get-block", parseInt(i.blockId));
          if (o) {
            const s = await ot(o);
            let c = i.icon;
            c || (c = Y(s)), t[a] = {
              ...i,
              blockType: s,
              icon: c
            }, this.log(`✅ 更新恢复的标签: ${i.title} -> 类型: ${s}, 图标: ${c}`), e = !0;
          }
        } catch (o) {
          this.warn(`更新恢复的标签失败: ${i.title}`, o);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${i.title} (已有块类型和图标)`);
    }
    e && (this.panelTabsData[0] = t, this.currentWorkspace ? this.log("🔄 在工作区状态下，跳过保存更新的标签页到存储") : (this.log("🔄 检测到恢复的标签页有更新，保存到存储..."), await this.saveFirstPanelTabs())), this.log("✅ 恢复的标签页块类型和图标更新完成");
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
      const i = t.charCodeAt(a);
      e = (e << 5) - e + i, e = e & e;
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
  drag(t) {
    if (!this.isDragging || !this.tabContainer) return;
    t.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = t.clientX - this.dragStartX, this.verticalPosition.y = t.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = t.clientX - this.dragStartX, this.horizontalPosition.y = t.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const e = this.tabContainer.getBoundingClientRect(), a = 5, i = window.innerWidth - e.width - 5, r = 5, o = window.innerHeight - e.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(a, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(r, Math.min(o, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(a, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(r, Math.min(o, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
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
      this.position = rt(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Ht(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${St(this.position, this.isVerticalMode)}`);
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
        k.LAYOUT_MODE,
        this.pluginName,
        H()
      );
      if (t) {
        const e = qt(t);
        this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.position = rt(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = e.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = e.isFloatingWindowVisible, this.showBlockTypeIcons = e.showBlockTypeIcons, this.showInHeadbar = e.showInHeadbar, this.horizontalTabMaxWidth = e.horizontalTabMaxWidth, this.horizontalTabMinWidth = e.horizontalTabMinWidth, this.log(`📐 布局模式已恢复: ${jt(e)}, 当前位置: (${this.position.x}, ${this.position.y})`), this.isSidebarAlignmentEnabled && (this.startSidebarAlignmentObserver(), this.log("🔄 侧边栏对齐监听器已启动"));
      } else {
        const e = H();
        this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.horizontalTabMaxWidth = e.horizontalTabMaxWidth, this.horizontalTabMinWidth = e.horizontalTabMinWidth, this.position = rt(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (t) {
      this.error("恢复布局模式失败:", t);
    }
  }
  /**
   * 从API配置恢复固定到顶部状态
   */
  async restoreFixedToTopMode() {
    try {
      const t = await this.storageService.getConfig(
        k.FIXED_TO_TOP,
        this.pluginName,
        { isFixedToTop: !1 }
      );
      t ? (this.isFixedToTop = t.isFixedToTop, this.log(`📌 固定到顶部状态已恢复: ${this.isFixedToTop ? "启用" : "禁用"}`)) : (this.isFixedToTop = !1, this.log("📌 固定到顶部状态: 禁用 (默认)"));
    } catch (t) {
      this.error("恢复固定到顶部状态失败:", t);
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const t = this.isVerticalMode ? Math.min(this.getCurrentPanelTabs().length * 28 + 8, window.innerHeight * 0.8) : 28;
    this.position = Da(this.position, this.isVerticalMode, this.verticalWidth, t);
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
    var r, o;
    const a = (r = this.tabContainer) == null ? void 0 : r.querySelectorAll(".orca-tabs-plugin .orca-tab");
    a == null || a.forEach((s) => s.removeAttribute("data-focused"));
    const i = (o = this.tabContainer) == null ? void 0 : o.querySelector(`[data-tab-id="${t}"]`);
    i ? (i.setAttribute("data-focused", "true"), this.verboseLog(`🎯 更新聚焦状态到已存在的标签: "${e}"`)) : this.verboseLog(`⚠️ 未找到标签元素: ${t}`);
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
        const i = t.closest(".orca-panel");
        if (i) {
          const r = i.getAttribute("data-panel-id");
          r && this.handleNewBlockInPanel(a, r).catch((o) => {
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
      const i = a.getAttribute("data-block-id");
      if (i) {
        const r = t.closest(".orca-panel");
        if (r) {
          const o = r.getAttribute("data-panel-id");
          o && this.handleNewBlockInPanel(i, o).catch((s) => {
            this.error(`处理新块失败: ${i}`, s);
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
    var g, p;
    if (!t || !e) return;
    if (this.verboseLog("🔍 [DEBUG] ========== handleNewBlockInPanel 开始 =========="), this.verboseLog(`🔍 [DEBUG] 参数: blockId=${t}, panelId=${e}`), this.isNavigating) {
      this.verboseLog(`⏭️ [DEBUG] 正在导航中，跳过 handleNewBlockInPanel: ${t}`);
      return;
    }
    if (this.isSwitchingTab) {
      this.verboseLog(`🔄 [DEBUG] 正在切换标签，跳过 handleNewBlockInPanel: ${t}`);
      return;
    }
    if (this.creatingTabs.has(t)) {
      this.verboseLog(`⏳ [DEBUG] 标签 ${t} 正在被其他地方创建（creatingTabs检查），立即跳过`);
      return;
    }
    const a = document.querySelector(".orca-panel.active"), i = a == null ? void 0 : a.getAttribute("data-panel-id");
    if (i && e !== i) {
      this.log(`🚫 忽略非激活面板 ${e} 中的新块 ${t}，当前激活面板为 ${i}`);
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
    this.verboseLog(`🔍 [DEBUG] 当前标签页数量: ${s.length}`);
    const c = s.find((m) => m.blockId === t);
    if (c) {
      this.verboseLog(`🔍 [DEBUG] ✅ 标签 ${t} 已存在，只更新聚焦状态`), this.closedTabs.has(t) && (this.closedTabs.delete(t), this.saveClosedTabs()), this.updateFocusState(t, c.title), this.immediateUpdateTabsUI(), this.verboseLog("🔍 [DEBUG] ========== handleNewBlockInPanel 完成（已存在）==========");
      return;
    }
    this.verboseLog(`🔍 [DEBUG] ❌ 标签 ${t} 不存在，准备创建新标签`), this.creatingTabs.add(t);
    let l = null;
    try {
      if (l = await this.createTabInfoFromBlock(t, e), !l) return;
      s = this.getCurrentPanelTabs();
      const m = s.find((b) => b.blockId === t);
      if (m) {
        this.log(`✅ 标签已被其他地方创建（在await期间），只更新聚焦状态: "${m.title}"`), this.updateFocusState(t, m.title), this.immediateUpdateTabsUI();
        return;
      }
    } finally {
      this.creatingTabs.delete(t);
    }
    const d = this.getCurrentActiveTab();
    if (d) {
      if (d.isPinned) {
        this.log(`📌 当前激活标签已置顶，创建新标签: "${l.title}"`);
        const b = s.filter((v) => v.isPinned).length;
        s.splice(b, 0, l), this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
      const m = s.findIndex((b) => b.blockId === d.blockId);
      if (m !== -1) {
        this.verboseLog(`🔄 替换当前激活标签页: "${d.title}" -> "${l.title}"`), this.recordTabSwitchHistory(d.blockId, l), s[m] = l, this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const m = s.findIndex((b) => b.blockId === this.lastActiveBlockId);
      if (m !== -1) {
        if (s[m].isPinned) {
          this.log(`📌 上一个激活标签已置顶，创建新标签: "${l.title}"`);
          const v = s.filter((f) => f.isPinned).length;
          s.splice(v, 0, l), this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
          return;
        }
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${s[m].title}" -> "${l.title}"`), this.recordTabSwitchHistory(s[m].blockId, l), s[m] = l, this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    let u = -1;
    const h = (g = this.tabContainer) == null ? void 0 : g.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (h) {
      const m = h.getAttribute("data-tab-id");
      u = s.findIndex((b) => b.blockId === m);
    }
    if (u === -1) {
      const m = (p = this.tabContainer) == null ? void 0 : p.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (m && m.length > 0)
        for (let b = 0; b < m.length; b++) {
          const v = m[b];
          if (v.classList.contains("focused") || v.getAttribute("data-focused") === "true" || v.classList.contains("active")) {
            u = b;
            break;
          }
        }
    }
    if (u === -1 && s.length > 0 && (u = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), u >= 0 && u < s.length)
      if (s[u].isPinned) {
        this.log(`📌 目标标签已置顶，创建新标签: "${l.title}"`);
        const b = s.filter((v) => v.isPinned).length;
        s.splice(b, 0, l), this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
      } else
        s[u] = l, this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
    else
      s = [l], this.updateFocusState(t, l.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
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
      const t = document.querySelector(".orca-panel.active");
      if (!t) {
        this.log("❌ 没有找到当前激活的面板");
        const p = document.querySelectorAll(".orca-panel");
        this.log("📊 当前所有面板状态:"), p.forEach((m, b) => {
          const v = m.getAttribute("data-panel-id"), f = m.classList.contains("active");
          this.log(`  面板${b + 1}: ID=${v}, active=${f}`);
        });
        return;
      }
      const e = t.getAttribute("data-panel-id");
      if (!e) {
        this.log("❌ 激活面板没有 data-panel-id");
        return;
      }
      this.verboseLog(`✅ 找到激活面板: ID=${e}, class=${t.className}`);
      const a = this.getPanelIds().indexOf(e);
      a !== -1 && (this.currentPanelIndex = a, this.currentPanelId = e, this.verboseLog(`🔄 更新当前面板索引: ${a} (面板ID: ${e})`)), t.querySelectorAll(".orca-hideable");
      const i = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!i) {
        this.log(`❌ 激活面板 ${e} 中没有找到可见的块编辑器`);
        return;
      }
      const r = i.getAttribute("data-block-id");
      if (!r) {
        this.log("激活的块编辑器没有blockId");
        return;
      }
      let o = this.getCurrentPanelTabs();
      o.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), o = this.getCurrentPanelTabs());
      const s = o.find((p) => p.blockId === r);
      if (s) {
        this.closedTabs.has(r) && (this.closedTabs.delete(r), await this.saveClosedTabs()), this.updateFocusState(r, s.title), await this.immediateUpdateTabsUI();
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
      const d = o.findIndex((p) => p.blockId === l);
      if (d === -1)
        return;
      if (o[d].isPinned) {
        this.log(`📌 聚焦标签已置顶，不替换，创建新标签: "${r}"`);
        const p = o.find((m) => m.blockId === r);
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
          const m = await this.getTabInfo(r, e, o.length);
          if (!m)
            return;
          o = this.getCurrentPanelTabs();
          const b = o.find((f) => f.blockId === r);
          if (b) {
            this.log(`✅ 标签在创建过程中已被其他地方创建: "${b.title}"`), this.updateFocusState(r, b.title), await this.immediateUpdateTabsUI();
            return;
          }
          const v = o.filter((f) => f.isPinned).length;
          o.splice(v, 0, m), this.updateFocusState(r, m.title), this.setCurrentPanelTabs(o), await this.immediateUpdateTabsUI();
        } finally {
          this.creatingTabs.delete(r);
        }
        return;
      }
      const h = await this.getTabInfo(r, e, d);
      h && (o[d] = h, this.setCurrentPanelTabs(o), await this.immediateUpdateTabsUI());
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
      let o = !1, s = !1, c = !1, l = this.currentPanelIndex;
      const d = Date.now(), u = this.lastPanelCheckTime || 0, h = 1e3;
      if (r.forEach((g) => {
        if (g.type === "childList") {
          const p = g.target;
          if ((p.classList.contains("orca-panels-row") || p.closest(".orca-panels-row")) && (s = !0), g.addedNodes.length > 0 && p.closest(".orca-panel")) {
            for (const b of g.addedNodes)
              if (b.nodeType === Node.ELEMENT_NODE) {
                const v = b;
                if (this.handleNewHideableElement(v)) {
                  o = !0;
                  break;
                }
                if (v.classList.contains("orca-block-editor") || v.querySelector(".orca-block-editor")) {
                  o = !0;
                  break;
                }
                if (this.handleChildHideableElements(v)) {
                  o = !0;
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
              let v = null;
              b.forEach((f) => {
                const w = f.classList.contains("orca-hideable-hidden"), y = f.querySelector(".orca-block-editor[data-block-id]"), T = y == null ? void 0 : y.getAttribute("data-block-id");
                !w && y && T && (v = T);
              }), v && m && this.handleNewBlockInPanel(v, m).catch((f) => {
                this.error(`处理面板激活时的新块失败: ${v}`, f);
              }), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 50), setTimeout(async () => {
                await this.checkCurrentPanelBlocks();
              }, 200);
            }
            p.classList.contains("orca-locked") && p.classList.contains("active") && (this.log("🔒 检测到锁定面板激活，聚焦上一个面板"), this.focusToPreviousPanel());
          }
          p.classList.contains("orca-hideable") && !p.classList.contains("orca-hideable-hidden") && (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦状态变化"), o = !0);
        }
      }), c && (await this.updateCurrentPanelIndex(), l !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${l} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), s && d - u > h ? (this.lastPanelCheckTime = d, this.verboseLog(`🔍 面板检查防抖：距离上次检查 ${d - u}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : s && d - u < 100 && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${d - u}ms`), o) {
        const g = Date.now(), p = 300, m = g - this.lastBlockCheckTime;
        m > p ? (this.lastBlockCheckTime = g, await this.checkCurrentPanelBlocks()) : m < 50 && this.verboseLog(`⏭️ 跳过块检查：距离上次检查仅 ${m}ms`);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      // 只监听属性变化中的class变化，减少不必要的回调
      attributes: !0,
      attributeFilter: ["class"],
      // 不监听文本内容变化，减少触发频率
      characterData: !1
    });
    let e = null, a = null;
    const i = async (r) => {
      if (!r || !r.target)
        return;
      const o = r.target;
      if (o.closest(".orca-tabs-plugin") || o.closest(".orca-sidebar") || o.closest(".orca-headbar"))
        return;
      const s = o.closest(".orca-hideable");
      if (s) {
        const c = s.querySelector(".orca-block-editor[data-block-id]"), l = c == null ? void 0 : c.getAttribute("data-block-id");
        if (l && l === a) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个块 ${l}`);
          return;
        }
        e && clearTimeout(e), e = window.setTimeout(async () => {
          if (!s.classList.contains("orca-hideable-hidden")) {
            if (this.isNavigating) {
              this.verboseLog("⏭️ 正在导航中，跳过聚焦检测");
              return;
            }
            this.verboseLog("🎯 检测到 orca-hideable 元素聚焦变化"), l && (a = l), await this.checkCurrentPanelBlocks();
          }
          e = null;
        }, 0);
      }
    };
    document.addEventListener("click", i), document.addEventListener("focusin", i), document.addEventListener("keydown", (r) => {
      (r.key === "Tab" || r.key === "Enter" || r.key === " ") && (e && clearTimeout(e), e = window.setTimeout(i, 0));
    }), typeof window < "u" && (this.focusSyncInterval !== null && window.clearInterval(this.focusSyncInterval), this.focusSyncInterval = window.setInterval(async () => {
      var r;
      try {
        const o = document.querySelector(".orca-panel.active");
        if (o) {
          const s = o.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (s) {
            const c = s.getAttribute("data-block-id");
            if (c) {
              const l = (r = this.tabContainer) == null ? void 0 : r.querySelector('.orca-tab[data-focused="true"]'), d = !!l;
              if (!this.lastFocusState || this.lastFocusState.blockId !== c || this.lastFocusState.hasFocusedTab !== d)
                if (this.lastFocusState = { blockId: c, hasFocusedTab: d }, l) {
                  const h = l.getAttribute("data-tab-id");
                  h !== c && (this.verboseLog(`?? 焦点检测到变更: ${h} -> ${c}`), await this.checkCurrentPanelBlocks());
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
    const t = this.getPanelIds().length, e = [...this.getPanelIds()];
    if (this.currentPanelId, await this.discoverPanels(), this.getPanelIds().length > t)
      this.log(`🎉 发现新面板！从 ${t} 个增加到 ${this.getPanelIds().length} 个`), await this.createTabsUI();
    else if (this.getPanelIds().length < t) {
      this.log(`📉 面板数量减少！从 ${t} 个减少到 ${this.getPanelIds().length} 个`), this.log(`📋 旧面板列表: [${e.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`);
      const a = e[0], i = this.getPanelIds()[0];
      a && i && a !== i && (this.log(`🔄 第一个面板已变更: ${a} -> ${i}`), await this.handleFirstPanelChange(a, i)), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 更新持久化面板索引为: 0")), await this.createTabsUI();
    }
  }
  /**
   * 更新当前面板索引
   */
  async updateCurrentPanelIndex() {
    this.panelIndexUpdateTimer && clearTimeout(this.panelIndexUpdateTimer), this.panelIndexUpdateTimer = setTimeout(async () => {
      const t = document.querySelector(".orca-panel.active");
      if (t) {
        const e = t.getAttribute("data-panel-id");
        if (e && !e.startsWith("_")) {
          if (this.currentPanelId === e)
            return;
          const a = this.getPanelIds().indexOf(e);
          if (a !== -1) {
            const i = this.currentPanelIndex;
            this.currentPanelIndex = a, this.currentPanelId = e, this.log(`🔄 面板索引更新: ${i} -> ${a} (面板ID: ${e})`), (!this.panelTabsData[a] || this.panelTabsData[a].length === 0) && (this.log(`🔍 面板 ${e} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(a, e || "")), this.debouncedUpdateTabsUI();
          }
        }
      }
    }, 150);
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
    const a = e - 1, i = t[a];
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
    const o = document.querySelector(".orca-panel.active");
    o && o.classList.remove("active"), r.classList.add("active"), this.currentPanelIndex = a, this.currentPanelId = i, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${i}`);
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
    if (!t || !t.target)
      return;
    const e = t.target;
    if ((t.ctrlKey || t.metaKey) && e) {
      this.verboseLog(`🖱️ [DEBUG] Ctrl+点击检测: ctrlKey=${t.ctrlKey}, metaKey=${t.metaKey}`), this.verboseLog(`🖱️ [DEBUG] 点击目标: ${e.tagName}, classes: ${e.className}`);
      const a = this.getBlockRefId(e);
      if (a) {
        this.verboseLog(`🔗 [DEBUG] 检测到 Ctrl+点击 块引用: ${a}`), this.verboseLog(`🔒 [DEBUG] 立即将块 ${a} 添加到 creatingTabs（防止Orca原生导航触发重复创建）`), this.creatingTabs.add(a), t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.verboseLog(`🔗 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`), this.verboseLog(`🔗 [DEBUG] 当前标签页数量: ${this.getCurrentPanelTabs().length}`), this.openInNewTab(a).catch((i) => {
          this.error("[DEBUG] Ctrl+点击创建标签失败:", i), this.creatingTabs.delete(a);
        });
        return;
      } else
        this.verboseLog("🔗 [DEBUG] 未能从点击目标获取块引用ID");
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
    !t || t.target;
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
      const t = document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])');
      if (Array.from(t).filter((c) => {
        const l = c.getAttribute("data-panel-id");
        return l && !l.startsWith("_");
      }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
        this.verboseLog("📋 面板数量未变化，跳过面板发现");
        return;
      }
      const a = [...this.getPanelIds()], i = this.getPanelIds()[0] || null;
      await this.discoverPanels();
      const r = this.getPanelIds()[0] || null, o = za(a, this.getPanelIds());
      o && (this.log(`📋 面板列表发生变化: ${a.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${a.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${i} -> ${r}`), i !== r && (this.log(`🔄 持久化面板已变更: ${i} -> ${r}`), await this.handlePersistentPanelChange(i, r))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
      const s = document.querySelector(".orca-panel.active");
      if (s) {
        const c = s.getAttribute("data-panel-id");
        if (c && !c.startsWith("_") && (c !== this.currentPanelId || o)) {
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
    const a = e.querySelectorAll(".orca-hideable"), i = [];
    let r = 0;
    for (const o of a) {
      const s = o.querySelector(".orca-block-editor");
      if (!s) continue;
      const c = s.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, t, r++);
      l && i.push(l);
    }
    this.panelTabsData[0] = [...i], this.panelTabsData[0] = [...i], this.log(`📋 持久化面板 ${t} (索引: 0) 扫描并保存了 ${i.length} 个标签页`);
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
    const i = a.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let o = 0;
    this.log(`🔍 扫描面板 ${e}，找到 ${i.length} 个块编辑器`);
    for (const c of i) {
      const l = c.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, e, o++);
      d && (r.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    t >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[t] = [...r], this.log(`📋 面板 ${e} (索引: ${t}) 扫描了 ${r.length} 个标签页`);
    const s = t === 0 ? k.FIRST_PANEL_TABS : `panel_${t + 1}_tabs`;
    await this.savePanelTabsByKey(s, r);
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
    const i = a.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let o = 0;
    this.log(`🔍 扫描当前聚焦面板 ${e}，找到 ${i.length} 个块编辑器`);
    for (const l of i) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const u = await this.getTabInfo(d, e, o++);
      u && (r.push(u), this.log(`📋 找到当前标签页: ${u.title} (${d})`));
    }
    const s = this.panelTabsData[t] || [];
    this.log(`📋 已加载的标签页: ${s.length} 个，当前标签页: ${r.length} 个`);
    const c = [...s];
    for (const l of r)
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
    let i = 0;
    for (const o of e) {
      const s = o.querySelector(".orca-block-editor");
      if (!s) continue;
      const c = s.getAttribute("data-block-id");
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
  async handleFirstPanelChange(t, e) {
    this.log(`🔄 处理第一个面板变更: ${t} -> ${e}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ""}, currentPanelIndex=${this.currentPanelIndex}`);
    const a = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${a.length} 个标签页`), a.length > 0 ? (this.log(`📋 迁移当前面板的 ${a.length} 个标签页到持久化存储`), this.panelTabsData[0] = [...a], this.log("🔄 持久化面板索引已简化，不再需要更新")) : (this.log("🗑️ 当前面板没有标签数据，清空并重新扫描"), this.panelTabsData[0] = [], await this.scanFirstPanel()), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`), this.log("✅ 持久化标签页:", this.getCurrentPanelTabs().map((i) => `${i.title}(${i.blockId})`));
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
  // destroy方法在类的末尾重新实现了更完整的版本
  /**
   * 显示最近关闭的标签页菜单
   */
  async showRecentlyClosedTabsMenu(t) {
    if (this.recentlyClosedTabs.length === 0) {
      orca.notify("info", "没有最近关闭的标签页");
      return;
    }
    const e = t ? { x: t.clientX, y: t.clientY } : { x: 0, y: 0 }, a = this.recentlyClosedTabs.map((i, r) => ({
      label: `${i.title}`,
      icon: i.icon || Y(i.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(i, r)
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
    var p, m;
    const a = document.querySelector(".recently-closed-tabs-menu");
    a && a.remove();
    const i = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", r = document.createElement("div");
    r.className = "recently-closed-tabs-menu";
    const o = 280, s = 350, { x: c, y: l } = G(e.x, e.y, o, s);
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
      max-width: ${o}px;
      max-height: ${s}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, t.forEach((b, v) => {
      if (b.label === "---") {
        const y = document.createElement("div");
        y.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, r.appendChild(y);
        return;
      }
      const f = document.createElement("div");
      if (f.className = "recently-closed-menu-item", f.style.cssText = `
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
        const y = document.createElement("div");
        if (y.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, b.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = b.icon, y.appendChild(T);
        } else
          y.textContent = b.icon;
        f.appendChild(y);
      }
      const w = document.createElement("span");
      w.textContent = b.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, f.appendChild(w), f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = "transparent";
      }), f.addEventListener("click", () => {
        b.onClick(), r.remove();
      }), r.appendChild(f);
    }), document.body.appendChild(r);
    const d = r.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (r.style.left = `${u - d.width - 10}px`), d.bottom > h && (r.style.top = `${h - d.height - 10}px`);
    const g = (b) => {
      !b || !b.target || r.contains(b.target) || (r.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
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
    })), this.createMultiTabSavingMenu(a, e);
  }
  /**
   * 创建多标签页保存菜单
   */
  createMultiTabSavingMenu(t, e) {
    var p, m;
    const a = document.querySelector(".multi-tab-saving-menu");
    a && a.remove();
    const i = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", r = document.createElement("div");
    r.className = "multi-tab-saving-menu";
    const o = 300, s = 400, { x: c, y: l } = G(e.x, e.y, o, s);
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
      max-width: ${o}px;
      max-height: ${s}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, t.forEach((b, v) => {
      if (b.label === "---") {
        const y = document.createElement("div");
        y.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, r.appendChild(y);
        return;
      }
      const f = document.createElement("div");
      if (f.className = "multi-tab-saving-menu-item", f.style.cssText = `
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
        const y = document.createElement("div");
        if (y.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, b.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = b.icon, y.appendChild(T);
        } else
          y.textContent = b.icon;
        f.appendChild(y);
      }
      const w = document.createElement("span");
      w.textContent = b.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, f.appendChild(w), f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = "transparent";
      }), f.addEventListener("click", () => {
        b.onClick(), r.remove();
      }), r.appendChild(f);
    }), document.body.appendChild(r);
    const d = r.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (r.style.left = `${u - d.width - 10}px`), d.bottom > h && (r.style.top = `${h - d.height - 10}px`);
    const g = (b) => {
      !b || !b.target || r.contains(b.target) || (r.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
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
    const o = document.createElement("button");
    o.className = "orca-button orca-button-secondary", o.textContent = "创建新标签组", o.style.cssText = "flex: 1;";
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "更新已有标签组", s.style.cssText = "flex: 1;";
    let c = !1;
    const l = () => {
      c = !1, o.className = "orca-button orca-button-secondary", o.style.cssText = "flex: 1;", s.className = "orca-button", s.style.cssText = "flex: 1;", u.style.display = "block", p.style.display = "none", T();
    }, d = () => {
      c = !0, s.className = "orca-button orca-button-secondary", s.style.cssText = "flex: 1;", o.className = "orca-button", o.style.cssText = "flex: 1;", u.style.display = "none", p.style.display = "block", T();
    };
    o.onclick = l, s.onclick = d, r.appendChild(o), r.appendChild(s), i.appendChild(r);
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
    }), u.appendChild(g);
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
    const v = document.createElement("option");
    v.value = "", v.textContent = "请选择标签页集合...", b.appendChild(v), this.savedTabSets.forEach((C, N) => {
      const q = document.createElement("option");
      q.value = N.toString(), q.textContent = `${C.name} (${C.tabs.length}个标签)`, b.appendChild(q);
    }), p.appendChild(b), i.appendChild(u), i.appendChild(p), e.appendChild(i);
    const f = document.createElement("div");
    f.style.cssText = `
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
      e.remove(), this.manageSavedTabSets();
    };
    const y = document.createElement("button");
    y.className = "orca-button orca-button-primary", y.textContent = "保存", y.style.cssText = "", y.addEventListener("mouseenter", () => {
      y.style.backgroundColor = "#2563eb";
    }), y.addEventListener("mouseleave", () => {
      y.style.backgroundColor = "var(--orca-color-primary-5)";
    });
    const T = () => {
      y.textContent = c ? "更新" : "保存";
    };
    y.onclick = async () => {
      if (c) {
        const C = parseInt(b.value);
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
    }, f.appendChild(w), f.appendChild(y), e.appendChild(f), document.body.appendChild(e), setTimeout(() => {
      g.focus(), g.select();
    }, 100), g.addEventListener("keydown", (C) => {
      C.key === "Enter" ? (C.preventDefault(), y.click()) : C.key === "Escape" && (C.preventDefault(), w.click());
    });
    const S = (C) => {
      !C || !C.target || e.contains(C.target) || (e.remove(), document.removeEventListener("click", S));
    };
    setTimeout(() => {
      document.addEventListener("click", S);
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
    const o = document.createElement("label");
    o.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, o.textContent = `将标签页 "${t.title}" 添加到:`, r.appendChild(o);
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
    c.value = "", c.textContent = "请选择标签组...", s.appendChild(c), this.savedTabSets.forEach((g, p) => {
      const m = document.createElement("option");
      m.value = p.toString(), m.textContent = `${g.name} (${g.tabs.length}个标签)`, s.appendChild(m);
    }), r.appendChild(s), a.appendChild(r);
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
    const u = document.createElement("button");
    u.className = "orca-button orca-button-primary", u.textContent = "添加", u.style.cssText = "", u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#2563eb";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "var(--orca-color-primary-5)";
    }), u.onclick = async () => {
      const g = parseInt(s.value);
      if (isNaN(g) || g < 0 || g >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      a.remove(), await this.addTabToGroup(t, g);
    }, l.appendChild(d), l.appendChild(u), a.appendChild(l), document.body.appendChild(a), setTimeout(() => {
      s.focus();
    }, 100), s.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), u.click()) : g.key === "Escape" && (g.preventDefault(), d.click());
    });
    const h = (g) => {
      !g || !g.target || a.contains(g.target) || (a.remove(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
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
      if (a.tabs.find((r) => r.blockId === t.blockId)) {
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
      for (const i of t.tabs) {
        const r = { ...i, panelId: this.currentPanelId || "" };
        a.push(r);
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
        const i = { ...a, panelId: this.currentPanelId || "" };
        t.push(i);
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
    const i = document.documentElement.classList.contains("dark") || ((s = (o = window.orca) == null ? void 0 : o.state) == null ? void 0 : s.themeMode) === "dark";
    t.innerHTML = "";
    let r = -1;
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
          const v = document.createElement("i");
          v.className = c.icon, b.appendChild(v);
        } else
          b.textContent = c.icon;
        d.appendChild(b);
      }
      const h = document.createElement("div");
      h.style.cssText = `
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
      h.innerHTML = g, d.appendChild(h);
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
        const v = parseInt(b.dataTransfer.getData("text/plain")), f = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", v !== f && v >= 0) {
          const w = e[v];
          e.splice(v, 1), e.splice(f, 0, w), this.renderSortableTabs(t, e);
          const y = this.savedTabSets.find((T) => T.tabs === e);
          y && (y.tabs = [...e], y.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
      }), d.addEventListener("mouseenter", () => {
        r === -1 && (d.style.backgroundColor = "rgba(59, 130, 246, 0.05)", d.style.borderColor = "var(--orca-color-primary-5)");
      }), d.addEventListener("mouseleave", () => {
        r === -1 && (d.style.backgroundColor = "var(--orca-color-bg-1)", d.style.borderColor = "#e0e0e0");
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
  async restoreTabsWithoutSaving(t) {
    try {
      this.panelTabsData[0] = [], this.panelTabsData[1] = [];
      const e = [];
      for (const a of t)
        try {
          const i = await this.getTabInfo(a.blockId, this.currentPanelId || "", e.length);
          i ? (i.isPinned = a.isPinned, i.order = a.order, i.scrollPosition = a.scrollPosition, e.push(i)) : e.push(a);
        } catch (i) {
          this.warn(`无法更新标签页信息 ${a.title}:`, i), e.push(a);
        }
      this.panelTabsData[0] = e, await this.updateTabsUI(), this.log(`📋 已恢复标签页组，共 ${e.length} 个标签（未保存到持久化存储）`);
    } catch (e) {
      throw this.error("恢复标签页组失败:", e), e;
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
    } catch (t) {
      this.error("退出工作区失败:", t), orca.notify("error", "退出工作区失败");
    }
  }
  /**
   * 显示退出工作区确认对话框
   */
  async showExitWorkspaceConfirmDialog() {
    return new Promise((t) => {
      const e = document.querySelector(".exit-workspace-confirm-dialog");
      e && e.remove();
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
      const o = document.createElement("div");
      o.style.cssText = `
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
        a.remove(), t(!1);
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
        a.remove(), t(!0);
      }), s.addEventListener("mouseenter", () => {
        s.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), s.addEventListener("mouseleave", () => {
        s.style.backgroundColor = "var(--orca-color-bg-1)";
      }), c.addEventListener("mouseenter", () => {
        c.style.opacity = "0.9";
      }), c.addEventListener("mouseleave", () => {
        c.style.opacity = "1";
      }), o.appendChild(s), o.appendChild(c), a.appendChild(i), a.appendChild(r), a.appendChild(o), document.body.appendChild(a);
      const l = (d) => {
        !d || !d.target || a.contains(d.target) || (a.remove(), document.removeEventListener("click", l), t(!1));
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
    const t = document.querySelector(".save-workspace-dialog");
    t && t.remove();
    const e = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", a = document.createElement("div");
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
      color: ${e ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, r.textContent = "保存工作区";
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
    const u = document.createElement("button");
    u.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-bg-1);
      color: ${e ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, u.textContent = "取消", u.onclick = () => {
      a.remove(), this.showWorkspaceMenu();
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
      const b = s.value.trim();
      if (!b) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((v) => v.name === b)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(b, l.value.trim()), a.remove();
    }, d.appendChild(u), d.appendChild(h), i.appendChild(r), i.appendChild(o), i.appendChild(s), i.appendChild(c), i.appendChild(l), i.appendChild(d), a.appendChild(i), document.body.appendChild(a), s.focus(), a.addEventListener("click", (b) => {
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
  async performSaveWorkspace(t, e) {
    try {
      const a = this.getCurrentPanelTabs(), i = this.getCurrentActiveTab(), r = {
        id: `workspace_${Date.now()}`,
        name: t,
        tabs: a,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: e || void 0,
        lastActiveTabId: i ? i.blockId : void 0
      };
      this.workspaces.push(r), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${t}" (${a.length}个标签)`), orca.notify("success", `工作区已保存: ${t}`);
    } catch (a) {
      this.error("保存工作区失败:", a), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(t) {
    var f, w;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const e = document.querySelector(".workspace-menu");
    e && e.remove();
    const a = document.documentElement.classList.contains("dark") || ((w = (f = window.orca) == null ? void 0 : f.state) == null ? void 0 : w.themeMode) === "dark", i = document.createElement("div");
    i.className = "workspace-menu";
    const r = 280, o = 400, s = t ? { x: t.clientX, y: t.clientY } : { x: 20, y: 60 }, { x: c, y: l } = G(s.x, s.y, r, o);
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
    const u = document.createElement("div");
    u.className = "workspace-menu-item", u.setAttribute("data-action", "save-current"), u.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-family: var(--orca-fontfamily-ui);
      font-size: var(--orca-fontsize-sm);
      display: flex;
      align-items: center;
      border-radius: var(--orca-radius-md);
      color: var(--orca-color-text-1);
    `;
    const h = document.createElement("span");
    h.textContent = "保存当前工作区", h.style.cssText = `
      margin-right: var(--orca-spacing-md);
    `, u.appendChild(h), u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "var(--orca-color-menu-highlight)";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "transparent";
    }), u.onclick = () => {
      i.remove(), this.saveCurrentWorkspace();
    };
    const g = document.createElement("div");
    if (g.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const y = document.createElement("div");
      y.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${a ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, y.textContent = "暂无工作区", g.appendChild(y);
    } else
      this.workspaces.forEach((y) => {
        const T = document.createElement("div");
        T.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-family: var(--orca-fontfamily-ui);
          font-size: var(--orca-fontsize-sm);
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: var(--orca-radius-md);
          color: var(--orca-color-text-1);
          ${this.currentWorkspace === y.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const S = y.icon || "ti ti-folder";
        T.innerHTML = `
          <i class="${S}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: var(--orca-color-text-1);"">${y.name}</div>
            ${y.description ? `<div style="font-size: 12px; color: ${a ? "#999" : "#666"}; margin-top: 2px;">${y.description}</div>` : ""}
            <div style="font-size: 11px; color: ${a ? "#777" : "#999"}; margin-top: 2px;">${y.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === y.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ""}
        `, T.addEventListener("mouseenter", () => {
          T.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), T.addEventListener("mouseleave", () => {
          T.style.backgroundColor = this.currentWorkspace === y.id ? "rgba(59, 130, 246, 0.1)" : "transparent";
        }), T.onclick = () => {
          i.remove(), this.switchToWorkspace(y.id);
        }, g.appendChild(T);
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
      const y = document.createElement("span");
      y.textContent = "退出工作区", y.style.cssText = `
        margin-right: var(--orca-spacing-md);
        color: var(--orca-color-danger);
      `, b.appendChild(y), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.onclick = () => {
        i.remove(), this.exitWorkspace();
      };
    }
    i.appendChild(d), i.appendChild(u), i.appendChild(g), i.appendChild(p), b && i.appendChild(b), document.body.appendChild(i);
    const v = (y) => {
      !y || !y.target || i.contains(y.target) || (i.remove(), document.removeEventListener("click", v));
    };
    setTimeout(() => {
      document.addEventListener("click", v);
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
      if (!this.currentWorkspace && !this.tabsBeforeWorkspace) {
        const a = this.getCurrentPanelTabs();
        this.tabsBeforeWorkspace = [...a], await this.tabStorageService.saveTabsBeforeWorkspace(this.tabsBeforeWorkspace), this.log(`💾 保存了进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`);
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
      for (const r of t)
        try {
          const o = await this.getTabInfo(r.blockId, this.currentPanelId || "", a.length);
          o ? (o.isPinned = r.isPinned, o.order = r.order, o.scrollPosition = r.scrollPosition, a.push(o)) : a.push(r);
        } catch (o) {
          this.warn(`无法更新标签页信息 ${r.title}:`, o), a.push(r);
        }
      this.panelTabsData[0] = a, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...a], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const i = e.lastActiveTabId;
      setTimeout(async () => {
        if (a.length > 0) {
          let r = a[0];
          if (i) {
            const o = a.find((s) => s.blockId === i);
            o ? (r = o, this.log(`🎯 导航到工作区中最后激活的标签页: ${r.title} (ID: ${i})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${r.title}`);
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
    var d, u;
    const t = document.querySelector(".manage-workspaces-dialog");
    t && t.remove();
    const e = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", a = document.createElement("div");
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
      color: ${e ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, r.textContent = "管理工作区";
    const o = document.createElement("div");
    if (o.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
    `, this.workspaces.length === 0) {
      const h = document.createElement("div");
      h.style.cssText = `
        padding: 40px;
        text-align: center;
        color: ${e ? "#999" : "#666"};
        font-size: 14px;
      `, h.textContent = "暂无工作区", o.appendChild(h);
    } else
      this.workspaces.forEach((h) => {
        const g = document.createElement("div");
        g.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          margin-bottom: 8px;
          background: ${this.currentWorkspace === h.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)"};
        `;
        const p = h.icon || "ti ti-folder";
        g.innerHTML = `
          <i class="${p}" style="font-size: 20px; color: var(--orca-color-primary-5); margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; color: ${e ? "#ffffff" : "#333"};"">${h.name}</div>
            ${h.description ? `<div style="font-size: 12px; color: ${e ? "#999" : "#666"}; margin-bottom: 4px;">${h.description}</div>` : ""}
            <div style="font-size: 11px; color: ${e ? "#777" : "#999"};"">${h.tabs.length}个标签 • 创建于 ${new Date(h.createdAt).toLocaleString()}</div>
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
        `, g.addEventListener("mouseenter", () => {
          g.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), g.addEventListener("mouseleave", () => {
          g.style.backgroundColor = this.currentWorkspace === h.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)";
        }), o.appendChild(g);
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
    }, s.appendChild(c), i.appendChild(r), i.appendChild(o), i.appendChild(s), a.appendChild(i), document.body.appendChild(a), a.querySelectorAll(".delete-workspace-btn").forEach((h) => {
      h.addEventListener("click", async (g) => {
        const p = g.target.getAttribute("data-workspace-id");
        p && (await this.deleteWorkspace(p), a.remove(), this.manageWorkspaces());
      });
    }), a.addEventListener("click", (h) => {
      h.target === a && a.remove();
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
    var u, h;
    document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null || h.themeMode);
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
    `, r.textContent = `标签集合详情: ${t.name}`, i.appendChild(r);
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
      const v = document.createElement("div");
      v.className = "sortable-tabs-container", v.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(v, [...t.tabs], t), g.appendChild(v), o.appendChild(g);
    }
    i.appendChild(o);
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
      i.remove(), e && this.manageSavedTabSets();
    }, c.appendChild(l), i.appendChild(c), document.body.appendChild(i);
    const d = (g) => {
      i.contains(g.target) || (i.remove(), e && this.manageSavedTabSets(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(t, e, a) {
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
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, o.textContent = "重命名标签集合", r.appendChild(o);
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
    }), s.appendChild(l), r.appendChild(s);
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
      r.remove(), this.manageSavedTabSets();
    };
    const h = document.createElement("button");
    h.className = "orca-button orca-button-primary", h.textContent = "保存", h.style.cssText = "", h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#2563eb";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "var(--orca-color-primary-5)";
    }), h.onclick = async () => {
      const p = l.value.trim();
      if (!p) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (p === t.name) {
        r.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((b) => b.name === p && b.id !== t.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      t.name = p, t.updatedAt = Date.now(), await this.saveSavedTabSets(), r.remove(), a.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(u), d.appendChild(h), r.appendChild(d), document.body.appendChild(r), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), h.click()) : p.key === "Escape" && (p.preventDefault(), u.click());
    });
    const g = (p) => {
      !p || !p.target || r.contains(p.target) || (r.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(t, e, a, i) {
    const r = document.createElement("input");
    r.type = "text", r.value = t.name, r.style.cssText = `
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
    a.innerHTML = "", a.appendChild(r), r.addEventListener("click", (d) => {
      d.stopPropagation();
    }), r.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), r.focus(), r.select();
    const s = async () => {
      const d = r.value.trim();
      if (!d) {
        a.textContent = o;
        return;
      }
      if (d === t.name) {
        a.textContent = o;
        return;
      }
      if (this.savedTabSets.find((h) => h.name === d && h.id !== t.id)) {
        orca.notify("warn", "该名称已存在"), a.textContent = o;
        return;
      }
      t.name = d, t.updatedAt = Date.now(), await this.saveSavedTabSets(), a.textContent = d, orca.notify("success", "重命名成功");
    }, c = () => {
      a.textContent = o;
    };
    r.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), s()) : d.key === "Escape" && (d.preventDefault(), c());
    });
    let l = null;
    r.addEventListener("blur", () => {
      l && clearTimeout(l), l = window.setTimeout(() => {
        s();
      }, 100);
    }), r.addEventListener("focus", () => {
      l && (clearTimeout(l), l = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(t, e, a, i, r) {
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
      { name: "文档", value: "ti ti-cube", icon: "📄" },
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
        background: ${t.icon === p.value ? "#e3f2fd" : "white"};
      `;
      const b = document.createElement("div");
      if (b.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, p.value.startsWith("ti ti-")) {
        const f = document.createElement("i");
        f.className = p.value, b.appendChild(f);
      } else
        b.textContent = p.icon;
      const v = document.createElement("div");
      v.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, v.textContent = p.name, m.appendChild(b), m.appendChild(v), m.addEventListener("click", async (f) => {
        f.stopPropagation(), t.icon = p.value, t.updatedAt = Date.now(), await this.saveSavedTabSets(), i(), o.remove(), r && r.focus(), orca.notify("success", "图标已更新");
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "#f5f5f5", m.style.borderColor = "var(--orca-color-primary-5)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = t.icon === p.value ? "#e3f2fd" : "white", m.style.borderColor = "#e0e0e0";
      }), d.appendChild(m);
    }), c.appendChild(d), o.appendChild(c);
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
    }), h.onclick = (p) => {
      p.stopPropagation(), o.remove(), r && r.focus();
    }, u.appendChild(h), o.appendChild(u), document.body.appendChild(o);
    const g = (p) => {
      o.contains(p.target) || (p.stopPropagation(), o.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g), r && r.focus());
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
      `, D(h, U("点击编辑图标"));
      const g = () => {
        if (h.innerHTML = "", c.icon)
          if (c.icon.startsWith("ti ti-")) {
            const T = document.createElement("i");
            T.className = c.icon, h.appendChild(T);
          } else
            h.textContent = c.icon;
        else
          h.textContent = "📁";
      };
      g(), h.addEventListener("click", () => {
        this.editTabSetIcon(c, l, h, g, e);
      }), h.addEventListener("mouseenter", () => {
        h.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), h.addEventListener("mouseleave", () => {
        h.style.backgroundColor = "transparent";
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
      `, m.textContent = c.name, D(m, U("点击编辑名称")), m.addEventListener("click", () => {
        this.editTabSetName(c, l, m, e);
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      });
      const b = document.createElement("div");
      b.style.cssText = `
        font-size: 12px;
        color: #666;
      `, b.textContent = `${c.tabs.length}个标签 • ${new Date(c.updatedAt).toLocaleString()}`, p.appendChild(m), p.appendChild(b), u.appendChild(h), u.appendChild(p);
      const v = document.createElement("div");
      v.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const f = document.createElement("button");
      f.className = "orca-button orca-button-primary", f.textContent = "加载", f.style.cssText = "", f.onclick = () => {
        this.loadSavedTabSet(c, l), e.remove();
      };
      const w = document.createElement("button");
      w.className = "orca-button", w.textContent = "查看", w.style.cssText = "", w.onclick = () => {
        this.showTabSetDetails(c, e);
      };
      const y = document.createElement("button");
      y.className = "orca-button", y.textContent = "删除", y.style.cssText = "", y.onclick = () => {
        confirm(`确定要删除标签页集合 "${c.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), e.remove(), this.manageSavedTabSets());
      }, v.appendChild(f), v.appendChild(w), v.appendChild(y), d.appendChild(u), d.appendChild(v), i.appendChild(d);
    }), e.appendChild(i);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const o = document.createElement("button");
    o.className = "orca-button", o.textContent = "关闭", o.style.cssText = "", o.addEventListener("mouseenter", () => {
      o.style.backgroundColor = "#4b5563";
    }), o.addEventListener("mouseleave", () => {
      o.style.backgroundColor = "#6b7280";
    }), o.onclick = () => e.remove(), r.appendChild(o), e.appendChild(r), document.body.appendChild(e);
    const s = (c) => {
      !c || !c.target || e.contains(c.target) || (e.remove(), document.removeEventListener("click", s), document.removeEventListener("contextmenu", s));
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
    } catch (t) {
      this.error("❌ 优化DOM监听器初始化失败:", t);
    }
  }
  /**
   * 处理性能报告
   */
  handlePerformanceReport(t) {
    var i;
    const e = t.healthScore || 0, a = ((i = t.issues) == null ? void 0 : i.length) || 0;
    this.log(`📊 性能报告: 健康分数 ${e}/100, 问题数: ${a}`), e < 50 && a > 0 && (this.log("⚠️ 性能分数过低，触发自动优化"), this.triggerPerformanceOptimization());
  }
  /**
   * 触发性能优化
   */
  triggerPerformanceOptimization() {
    if (this.performanceOptimizer)
      try {
        this.performanceOptimizer.triggerOptimization();
        const t = this.performanceOptimizer.getMemoryStats();
        t && t.totalResources > 1e3 && (this.log("🧹 检测到资源过多，执行清理"), this.performanceOptimizer.cleanupAllResources());
      } catch (t) {
        this.error("❌ 性能优化触发失败:", t);
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
    } catch (t) {
      this.error("❌ 优化防抖更新失败，降级到原始方法:", t), this.debouncedUpdateTabsUI();
    }
  }
  /**
   * 优化的资源跟踪
   */
  trackOptimizedResource(t, e, a, i) {
    if (!this.performanceOptimizer)
      return t.addEventListener(e, a, i), null;
    const r = this.performanceOptimizer.trackEventListener(t, e, a, i);
    return r && this.verboseLog(`👂 跟踪事件监听器: ${e} -> ${r}`), r;
  }
  /**
   * 销毁插件，清理所有资源
   */
  destroy() {
    try {
      typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null, this.lastBaselineScenario = null, this.log("🗑️ 开始销毁插件..."), this.log("💾 保存插件数据..."), this.saveCurrentPanelTabsImmediately().catch((e) => {
        this.error("销毁时保存数据失败:", e);
      }), this.saveDataDebounceTimer !== null && (clearTimeout(this.saveDataDebounceTimer), this.saveDataDebounceTimer = null), this.performanceOptimizer && (this.log("🧹 清理性能优化器..."), this.performanceOptimizer.destroy(), this.performanceOptimizer = null), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
      const t = document.getElementById("orca-tabs-drag-styles");
      t && t.remove(), this.focusSyncInterval !== null && (typeof window < "u" ? window.clearInterval(this.focusSyncInterval) : clearInterval(this.focusSyncInterval), this.focusSyncInterval = null), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener, { capture: !0 }), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null, this.log("✅ 插件销毁完成");
    } catch (t) {
      this.error("❌ 插件销毁过程中发生错误:", t);
    }
  }
}
let I = null;
async function Ra(n) {
  A = n, orca.state.locale, I = new Oa(A), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => I == null ? void 0 : I.init(), 500);
  }) : setTimeout(() => I == null ? void 0 : I.init(), 500);
  try {
    orca.commands.unregisterCommand(`${A}.resetCache`);
  } catch {
  }
  orca.commands.registerCommand(
    `${A}.resetCache`,
    async () => {
      I && await I.resetCache();
    },
    "重置插件缓存"
  );
  try {
    orca.commands.unregisterCommand(`${A}.toggleBlockIcons`);
  } catch {
  }
  orca.commands.registerCommand(
    `${A}.toggleBlockIcons`,
    async () => {
      I && await I.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function Ua() {
  I && (I.unregisterBlockMenuCommands(), I.unregisterHeadbarButton(), I.cleanupDragResize(), I.destroy(), I = null);
  try {
    X();
  } catch (n) {
    console.warn("清理 tooltip 时出错:", n);
  }
  try {
    orca.commands.unregisterCommand(`${A}.resetCache`);
  } catch {
  }
  try {
    orca.commands.unregisterCommand(`${A}.toggleBlockIcons`);
  } catch {
  }
}
export {
  Ra as load,
  Ua as unload
};
