var Fe = Object.defineProperty;
var _e = (r, e, t) => e in r ? Fe(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var v = (r, e, t) => _e(r, typeof e != "symbol" ? e + "" : e, t);
const Ce = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, Ee = {
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
  ENABLE_DOUBLE_CLICK_CLOSE: "enable-double-click-close",
  /** 贴边隐藏功能开关 - 存储是否启用贴边隐藏功能 */
  ENABLE_EDGE_HIDE: "enable-edge-hide"
}, P = {
  /** 全局切换历史记录最大数量 - 限制全局标签页切换历史记录的最大数量 */
  GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS: 10,
  /** 触发区域宽度 - 鼠标进入这个宽度的边缘区域时会展开容器（像素） */
  EDGE_TRIGGER_ZONE_SIZE: 35,
  /** 隐藏时露出的边缘提示宽度 - 容器隐藏时露出的视觉提示宽度（像素） */
  EDGE_HINT_SIZE: 5,
  /** 贴边检测距离 - 距离屏幕边缘多少像素时触发贴边隐藏 */
  EDGE_DETECTION_DISTANCE: 15,
  /** 贴边隐藏展开延迟 - 鼠标悬停后展开的延迟时间（毫秒） */
  EDGE_HIDE_EXPAND_DELAY: 1,
  /** 贴边隐藏收起延迟 - 鼠标离开后收起的延迟时间（毫秒） */
  EDGE_HIDE_COLLAPSE_DELAY: 100
};
class Re {
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
      let n;
      if (typeof i == "string")
        try {
          n = JSON.parse(i);
        } catch {
          n = i;
        }
      else
        n = i;
      return this.log(`📂 已读取插件数据 ${e}:`, n), n;
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
      const n = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", n);
      const o = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(n) === JSON.stringify(o) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
function q() {
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
    horizontalTabMinWidth: 80,
    enableEdgeHide: !1
  };
}
function Ue(r, e, t = 200) {
  const a = e ? t : 400, i = 40, n = window.innerWidth - a, o = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(r.x, n)),
    y: Math.max(0, Math.min(r.y, o))
  };
}
function qe(r) {
  const e = q();
  return {
    isVerticalMode: r.isVerticalMode ?? e.isVerticalMode,
    verticalWidth: r.verticalWidth ?? e.verticalWidth,
    verticalPosition: r.verticalPosition ?? e.verticalPosition,
    horizontalPosition: r.horizontalPosition ?? e.horizontalPosition,
    isSidebarAlignmentEnabled: r.isSidebarAlignmentEnabled !== void 0 ? r.isSidebarAlignmentEnabled : e.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: r.isFloatingWindowVisible ?? e.isFloatingWindowVisible,
    showBlockTypeIcons: r.showBlockTypeIcons ?? e.showBlockTypeIcons,
    showInHeadbar: r.showInHeadbar ?? e.showInHeadbar,
    horizontalTabMaxWidth: r.horizontalTabMaxWidth ?? e.horizontalTabMaxWidth,
    horizontalTabMinWidth: r.horizontalTabMinWidth ?? e.horizontalTabMinWidth,
    enableEdgeHide: r.enableEdgeHide ?? e.enableEdgeHide
  };
}
function ne(r, e, t) {
  return r ? { ...e } : { ...t };
}
function Ve(r, e, t, a) {
  return e ? {
    verticalPosition: { ...r },
    horizontalPosition: { ...a }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...r }
  };
}
function Ye(r) {
  return `布局模式: ${r.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${r.verticalWidth}px, 垂直位置: (${r.verticalPosition.x}, ${r.verticalPosition.y}), 水平位置: (${r.horizontalPosition.x}, ${r.horizontalPosition.y})`;
}
function Se(r, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${r.x}, ${r.y})`;
}
class je {
  constructor(e, t, a) {
    v(this, "storageService");
    v(this, "pluginName");
    v(this, "log");
    v(this, "warn");
    v(this, "error");
    v(this, "verboseLog");
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
      const n = Ve(
        e,
        t,
        a,
        i
      );
      return await this.saveLayoutMode({
        isVerticalMode: t,
        verticalWidth: 0,
        // 这个值需要从外部传入
        verticalPosition: n.verticalPosition,
        horizontalPosition: n.horizontalPosition,
        isSidebarAlignmentEnabled: !1,
        // 这些值需要从外部传入
        isFloatingWindowVisible: !1,
        showBlockTypeIcons: !1,
        showInHeadbar: !1,
        horizontalTabMaxWidth: 130,
        horizontalTabMinWidth: 80,
        enableEdgeHide: !1
      }), this.log(`💾 位置已保存: ${Se(e, t)}`), n;
    } catch {
      return this.warn("无法保存标签位置"), { verticalPosition: a, horizontalPosition: i };
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(e) {
    try {
      await this.storageService.saveConfig(k.LAYOUT_MODE, e, this.pluginName), this.log(`💾 布局模式已保存: ${e.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${e.verticalWidth}px, 垂直位置: (${e.verticalPosition.x}, ${e.verticalPosition.y}), 水平位置: (${e.horizontalPosition.x}, ${e.horizontalPosition.y}), 贴边隐藏: ${e.enableEdgeHide ? "启用" : "禁用"}`);
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
        q()
      ), t = {
        ...q(),
        ...e
      };
      return this.log(`📂 恢复布局模式配置: ${t.isVerticalMode ? "垂直" : "水平"}`), t;
    } catch (e) {
      return this.warn("恢复布局模式配置失败:", e), q();
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
        maxRecords: P.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS
        // 全局历史记录最大数量限制
      });
      const n = a[i];
      n.recentTabs = n.recentTabs.filter((o) => o.blockId !== t.blockId), n.recentTabs.unshift(t), n.recentTabs.length > n.maxRecords && (n.recentTabs = n.recentTabs.slice(0, n.maxRecords)), n.lastUpdated = Date.now(), await this.saveRecentTabSwitchHistory(a), this.verboseLog(`📝 更新全局切换历史: ${e} -> ${t.title} (历史记录数量: ${n.recentTabs.length})`);
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
        if (i.recentTabs.length > P.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS) {
          const n = i.recentTabs.length;
          i.recentTabs = i.recentTabs.slice(0, P.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS), i.maxRecords = P.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS, t += n - i.recentTabs.length, this.log(`🧹 清理历史记录 ${a}: ${n} -> ${i.recentTabs.length}`);
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
const Ie = 6048e5, Ge = 864e5, pe = Symbol.for("constructDateFrom");
function L(r, e) {
  return typeof r == "function" ? r(e) : r && typeof r == "object" && pe in r ? r[pe](e) : r instanceof Date ? new r.constructor(e) : new Date(e);
}
function D(r, e) {
  return L(e || r, r);
}
function Pe(r, e, t) {
  const a = D(r, t == null ? void 0 : t.in);
  return isNaN(e) ? L(r, NaN) : (e && a.setDate(a.getDate() + e), a);
}
let Xe = {};
function ae() {
  return Xe;
}
function K(r, e) {
  var c, s, l, d;
  const t = ae(), a = (e == null ? void 0 : e.weekStartsOn) ?? ((s = (c = e == null ? void 0 : e.locale) == null ? void 0 : c.options) == null ? void 0 : s.weekStartsOn) ?? t.weekStartsOn ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, i = D(r, e == null ? void 0 : e.in), n = i.getDay(), o = (n < a ? 7 : 0) + n - a;
  return i.setDate(i.getDate() - o), i.setHours(0, 0, 0, 0), i;
}
function Z(r, e) {
  return K(r, { ...e, weekStartsOn: 1 });
}
function $e(r, e) {
  const t = D(r, e == null ? void 0 : e.in), a = t.getFullYear(), i = L(t, 0);
  i.setFullYear(a + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const n = Z(i), o = L(t, 0);
  o.setFullYear(a, 0, 4), o.setHours(0, 0, 0, 0);
  const c = Z(o);
  return t.getTime() >= n.getTime() ? a + 1 : t.getTime() >= c.getTime() ? a : a - 1;
}
function me(r) {
  const e = D(r), t = new Date(
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
  return t.setUTCFullYear(e.getFullYear()), +r - +t;
}
function Le(r, ...e) {
  const t = L.bind(
    null,
    e.find((a) => typeof a == "object")
  );
  return e.map(t);
}
function Q(r, e) {
  const t = D(r, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function Ke(r, e, t) {
  const [a, i] = Le(
    t == null ? void 0 : t.in,
    r,
    e
  ), n = Q(a), o = Q(i), c = +n - me(n), s = +o - me(o);
  return Math.round((c - s) / Ge);
}
function Je(r, e) {
  const t = $e(r, e), a = L(r, 0);
  return a.setFullYear(t, 0, 4), a.setHours(0, 0, 0, 0), Z(a);
}
function ge(r) {
  return L(r, Date.now());
}
function be(r, e, t) {
  const [a, i] = Le(
    t == null ? void 0 : t.in,
    r,
    e
  );
  return +Q(a) == +Q(i);
}
function Ze(r) {
  return r instanceof Date || typeof r == "object" && Object.prototype.toString.call(r) === "[object Date]";
}
function Qe(r) {
  return !(!Ze(r) && typeof r != "number" || isNaN(+D(r)));
}
function et(r, e) {
  const t = D(r, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const tt = {
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
}, at = (r, e, t) => {
  let a;
  const i = tt[r];
  return typeof i == "string" ? a = i : e === 1 ? a = i.one : a = i.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + a : a + " ago" : a;
};
function re(r) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : r.defaultWidth;
    return r.formats[t] || r.formats[r.defaultWidth];
  };
}
const it = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, nt = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, rt = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, ot = {
  date: re({
    formats: it,
    defaultWidth: "full"
  }),
  time: re({
    formats: nt,
    defaultWidth: "full"
  }),
  dateTime: re({
    formats: rt,
    defaultWidth: "full"
  })
}, st = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, ct = (r, e, t, a) => st[r];
function Y(r) {
  return (e, t) => {
    const a = t != null && t.context ? String(t.context) : "standalone";
    let i;
    if (a === "formatting" && r.formattingValues) {
      const o = r.defaultFormattingWidth || r.defaultWidth, c = t != null && t.width ? String(t.width) : o;
      i = r.formattingValues[c] || r.formattingValues[o];
    } else {
      const o = r.defaultWidth, c = t != null && t.width ? String(t.width) : r.defaultWidth;
      i = r.values[c] || r.values[o];
    }
    const n = r.argumentCallback ? r.argumentCallback(e) : e;
    return i[n];
  };
}
const lt = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, dt = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, ht = {
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
}, ut = {
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
}, gt = {
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
}, bt = {
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
}, pt = (r, e) => {
  const t = Number(r), a = t % 100;
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
}, mt = {
  ordinalNumber: pt,
  era: Y({
    values: lt,
    defaultWidth: "wide"
  }),
  quarter: Y({
    values: dt,
    defaultWidth: "wide",
    argumentCallback: (r) => r - 1
  }),
  month: Y({
    values: ht,
    defaultWidth: "wide"
  }),
  day: Y({
    values: ut,
    defaultWidth: "wide"
  }),
  dayPeriod: Y({
    values: gt,
    defaultWidth: "wide",
    formattingValues: bt,
    defaultFormattingWidth: "wide"
  })
};
function j(r) {
  return (e, t = {}) => {
    const a = t.width, i = a && r.matchPatterns[a] || r.matchPatterns[r.defaultMatchWidth], n = e.match(i);
    if (!n)
      return null;
    const o = n[0], c = a && r.parsePatterns[a] || r.parsePatterns[r.defaultParseWidth], s = Array.isArray(c) ? vt(c, (u) => u.test(o)) : (
      // [TODO] -- I challenge you to fix the type
      ft(c, (u) => u.test(o))
    );
    let l;
    l = r.valueCallback ? r.valueCallback(s) : s, l = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(l)
    ) : l;
    const d = e.slice(o.length);
    return { value: l, rest: d };
  };
}
function ft(r, e) {
  for (const t in r)
    if (Object.prototype.hasOwnProperty.call(r, t) && e(r[t]))
      return t;
}
function vt(r, e) {
  for (let t = 0; t < r.length; t++)
    if (e(r[t]))
      return t;
}
function xt(r) {
  return (e, t = {}) => {
    const a = e.match(r.matchPattern);
    if (!a) return null;
    const i = a[0], n = e.match(r.parsePattern);
    if (!n) return null;
    let o = r.valueCallback ? r.valueCallback(n[0]) : n[0];
    o = t.valueCallback ? t.valueCallback(o) : o;
    const c = e.slice(i.length);
    return { value: o, rest: c };
  };
}
const yt = /^(\d+)(th|st|nd|rd)?/i, Tt = /\d+/i, wt = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, kt = {
  any: [/^b/i, /^(a|c)/i]
}, Ct = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Et = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, St = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, It = {
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
}, Pt = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, $t = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Lt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Dt = {
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
}, Mt = {
  ordinalNumber: xt({
    matchPattern: yt,
    parsePattern: Tt,
    valueCallback: (r) => parseInt(r, 10)
  }),
  era: j({
    matchPatterns: wt,
    defaultMatchWidth: "wide",
    parsePatterns: kt,
    defaultParseWidth: "any"
  }),
  quarter: j({
    matchPatterns: Ct,
    defaultMatchWidth: "wide",
    parsePatterns: Et,
    defaultParseWidth: "any",
    valueCallback: (r) => r + 1
  }),
  month: j({
    matchPatterns: St,
    defaultMatchWidth: "wide",
    parsePatterns: It,
    defaultParseWidth: "any"
  }),
  day: j({
    matchPatterns: Pt,
    defaultMatchWidth: "wide",
    parsePatterns: $t,
    defaultParseWidth: "any"
  }),
  dayPeriod: j({
    matchPatterns: Lt,
    defaultMatchWidth: "any",
    parsePatterns: Dt,
    defaultParseWidth: "any"
  })
}, Bt = {
  code: "en-US",
  formatDistance: at,
  formatLong: ot,
  formatRelative: ct,
  localize: mt,
  match: Mt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function At(r, e) {
  const t = D(r, e == null ? void 0 : e.in);
  return Ke(t, et(t)) + 1;
}
function Wt(r, e) {
  const t = D(r, e == null ? void 0 : e.in), a = +Z(t) - +Je(t);
  return Math.round(a / Ie) + 1;
}
function De(r, e) {
  var d, u, h, g;
  const t = D(r, e == null ? void 0 : e.in), a = t.getFullYear(), i = ae(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((u = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((g = (h = i.locale) == null ? void 0 : h.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, o = L((e == null ? void 0 : e.in) || r, 0);
  o.setFullYear(a + 1, 0, n), o.setHours(0, 0, 0, 0);
  const c = K(o, e), s = L((e == null ? void 0 : e.in) || r, 0);
  s.setFullYear(a, 0, n), s.setHours(0, 0, 0, 0);
  const l = K(s, e);
  return +t >= +c ? a + 1 : +t >= +l ? a : a - 1;
}
function Nt(r, e) {
  var c, s, l, d;
  const t = ae(), a = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((s = (c = e == null ? void 0 : e.locale) == null ? void 0 : c.options) == null ? void 0 : s.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, i = De(r, e), n = L((e == null ? void 0 : e.in) || r, 0);
  return n.setFullYear(i, 0, a), n.setHours(0, 0, 0, 0), K(n, e);
}
function zt(r, e) {
  const t = D(r, e == null ? void 0 : e.in), a = +K(t, e) - +Nt(t, e);
  return Math.round(a / Ie) + 1;
}
function E(r, e) {
  const t = r < 0 ? "-" : "", a = Math.abs(r).toString().padStart(e, "0");
  return t + a;
}
const A = {
  // Year
  y(r, e) {
    const t = r.getFullYear(), a = t > 0 ? t : 1 - t;
    return E(e === "yy" ? a % 100 : a, e.length);
  },
  // Month
  M(r, e) {
    const t = r.getMonth();
    return e === "M" ? String(t + 1) : E(t + 1, 2);
  },
  // Day of the month
  d(r, e) {
    return E(r.getDate(), e.length);
  },
  // AM or PM
  a(r, e) {
    const t = r.getHours() / 12 >= 1 ? "pm" : "am";
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
  h(r, e) {
    return E(r.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(r, e) {
    return E(r.getHours(), e.length);
  },
  // Minute
  m(r, e) {
    return E(r.getMinutes(), e.length);
  },
  // Second
  s(r, e) {
    return E(r.getSeconds(), e.length);
  },
  // Fraction of second
  S(r, e) {
    const t = e.length, a = r.getMilliseconds(), i = Math.trunc(
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
}, fe = {
  // Era
  G: function(r, e, t) {
    const a = r.getFullYear() > 0 ? 1 : 0;
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
  y: function(r, e, t) {
    if (e === "yo") {
      const a = r.getFullYear(), i = a > 0 ? a : 1 - a;
      return t.ordinalNumber(i, { unit: "year" });
    }
    return A.y(r, e);
  },
  // Local week-numbering year
  Y: function(r, e, t, a) {
    const i = De(r, a), n = i > 0 ? i : 1 - i;
    if (e === "YY") {
      const o = n % 100;
      return E(o, 2);
    }
    return e === "Yo" ? t.ordinalNumber(n, { unit: "year" }) : E(n, e.length);
  },
  // ISO week-numbering year
  R: function(r, e) {
    const t = $e(r);
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
  u: function(r, e) {
    const t = r.getFullYear();
    return E(t, e.length);
  },
  // Quarter
  Q: function(r, e, t) {
    const a = Math.ceil((r.getMonth() + 1) / 3);
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
  q: function(r, e, t) {
    const a = Math.ceil((r.getMonth() + 1) / 3);
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
  M: function(r, e, t) {
    const a = r.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return A.M(r, e);
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
  L: function(r, e, t) {
    const a = r.getMonth();
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
  w: function(r, e, t, a) {
    const i = zt(r, a);
    return e === "wo" ? t.ordinalNumber(i, { unit: "week" }) : E(i, e.length);
  },
  // ISO week of year
  I: function(r, e, t) {
    const a = Wt(r);
    return e === "Io" ? t.ordinalNumber(a, { unit: "week" }) : E(a, e.length);
  },
  // Day of the month
  d: function(r, e, t) {
    return e === "do" ? t.ordinalNumber(r.getDate(), { unit: "date" }) : A.d(r, e);
  },
  // Day of year
  D: function(r, e, t) {
    const a = At(r);
    return e === "Do" ? t.ordinalNumber(a, { unit: "dayOfYear" }) : E(a, e.length);
  },
  // Day of week
  E: function(r, e, t) {
    const a = r.getDay();
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
  e: function(r, e, t, a) {
    const i = r.getDay(), n = (i - a.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(n);
      case "ee":
        return E(n, 2);
      case "eo":
        return t.ordinalNumber(n, { unit: "day" });
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
  c: function(r, e, t, a) {
    const i = r.getDay(), n = (i - a.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(n);
      case "cc":
        return E(n, e.length);
      case "co":
        return t.ordinalNumber(n, { unit: "day" });
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
  i: function(r, e, t) {
    const a = r.getDay(), i = a === 0 ? 7 : a;
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
  a: function(r, e, t) {
    const i = r.getHours() / 12 >= 1 ? "pm" : "am";
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
  b: function(r, e, t) {
    const a = r.getHours();
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
  B: function(r, e, t) {
    const a = r.getHours();
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
  h: function(r, e, t) {
    if (e === "ho") {
      let a = r.getHours() % 12;
      return a === 0 && (a = 12), t.ordinalNumber(a, { unit: "hour" });
    }
    return A.h(r, e);
  },
  // Hour [0-23]
  H: function(r, e, t) {
    return e === "Ho" ? t.ordinalNumber(r.getHours(), { unit: "hour" }) : A.H(r, e);
  },
  // Hour [0-11]
  K: function(r, e, t) {
    const a = r.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(a, { unit: "hour" }) : E(a, e.length);
  },
  // Hour [1-24]
  k: function(r, e, t) {
    let a = r.getHours();
    return a === 0 && (a = 24), e === "ko" ? t.ordinalNumber(a, { unit: "hour" }) : E(a, e.length);
  },
  // Minute
  m: function(r, e, t) {
    return e === "mo" ? t.ordinalNumber(r.getMinutes(), { unit: "minute" }) : A.m(r, e);
  },
  // Second
  s: function(r, e, t) {
    return e === "so" ? t.ordinalNumber(r.getSeconds(), { unit: "second" }) : A.s(r, e);
  },
  // Fraction of second
  S: function(r, e) {
    return A.S(r, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(r, e, t) {
    const a = r.getTimezoneOffset();
    if (a === 0)
      return "Z";
    switch (e) {
      case "X":
        return xe(a);
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
  x: function(r, e, t) {
    const a = r.getTimezoneOffset();
    switch (e) {
      case "x":
        return xe(a);
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
  O: function(r, e, t) {
    const a = r.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + ve(a, ":");
      case "OOOO":
      default:
        return "GMT" + O(a, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(r, e, t) {
    const a = r.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + ve(a, ":");
      case "zzzz":
      default:
        return "GMT" + O(a, ":");
    }
  },
  // Seconds timestamp
  t: function(r, e, t) {
    const a = Math.trunc(+r / 1e3);
    return E(a, e.length);
  },
  // Milliseconds timestamp
  T: function(r, e, t) {
    return E(+r, e.length);
  }
};
function ve(r, e = "") {
  const t = r > 0 ? "-" : "+", a = Math.abs(r), i = Math.trunc(a / 60), n = a % 60;
  return n === 0 ? t + String(i) : t + String(i) + e + E(n, 2);
}
function xe(r, e) {
  return r % 60 === 0 ? (r > 0 ? "-" : "+") + E(Math.abs(r) / 60, 2) : O(r, e);
}
function O(r, e = "") {
  const t = r > 0 ? "-" : "+", a = Math.abs(r), i = E(Math.trunc(a / 60), 2), n = E(a % 60, 2);
  return t + i + e + n;
}
const ye = (r, e) => {
  switch (r) {
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
}, Me = (r, e) => {
  switch (r) {
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
}, Ht = (r, e) => {
  const t = r.match(/(P+)(p+)?/) || [], a = t[1], i = t[2];
  if (!i)
    return ye(r, e);
  let n;
  switch (a) {
    case "P":
      n = e.dateTime({ width: "short" });
      break;
    case "PP":
      n = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      n = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      n = e.dateTime({ width: "full" });
      break;
  }
  return n.replace("{{date}}", ye(a, e)).replace("{{time}}", Me(i, e));
}, Ot = {
  p: Me,
  P: Ht
}, Ft = /^D+$/, _t = /^Y+$/, Rt = ["D", "DD", "YY", "YYYY"];
function Ut(r) {
  return Ft.test(r);
}
function qt(r) {
  return _t.test(r);
}
function Vt(r, e, t) {
  const a = Yt(r, e, t);
  if (console.warn(a), Rt.includes(r)) throw new RangeError(a);
}
function Yt(r, e, t) {
  const a = r[0] === "Y" ? "years" : "days of the month";
  return `Use \`${r.toLowerCase()}\` instead of \`${r}\` (in \`${e}\`) for formatting ${a} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const jt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Gt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Xt = /^'([^]*?)'?$/, Kt = /''/g, Jt = /[a-zA-Z]/;
function z(r, e, t) {
  var d, u, h, g;
  const a = ae(), i = a.locale ?? Bt, n = a.firstWeekContainsDate ?? ((u = (d = a.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, o = a.weekStartsOn ?? ((g = (h = a.locale) == null ? void 0 : h.options) == null ? void 0 : g.weekStartsOn) ?? 0, c = D(r, t == null ? void 0 : t.in);
  if (!Qe(c))
    throw new RangeError("Invalid time value");
  let s = e.match(Gt).map((p) => {
    const m = p[0];
    if (m === "p" || m === "P") {
      const b = Ot[m];
      return b(p, i.formatLong);
    }
    return p;
  }).join("").match(jt).map((p) => {
    if (p === "''")
      return { isToken: !1, value: "'" };
    const m = p[0];
    if (m === "'")
      return { isToken: !1, value: Zt(p) };
    if (fe[m])
      return { isToken: !0, value: p };
    if (m.match(Jt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: p };
  });
  i.localize.preprocessor && (s = i.localize.preprocessor(c, s));
  const l = {
    firstWeekContainsDate: n,
    weekStartsOn: o,
    locale: i
  };
  return s.map((p) => {
    if (!p.isToken) return p.value;
    const m = p.value;
    (qt(m) || Ut(m)) && Vt(m, e, String(r));
    const b = fe[m[0]];
    return b(c, m, i.localize, l);
  }).join("");
}
function Zt(r) {
  const e = r.match(Xt);
  return e ? e[1].replace(Kt, "'") : r;
}
function Qt(r, e) {
  return be(
    L(r, r),
    ge(r)
  );
}
function ea(r, e) {
  return be(
    r,
    Pe(ge(r), 1),
    e
  );
}
function ta(r, e, t) {
  return Pe(r, -1, t);
}
function aa(r, e) {
  return be(
    L(r, r),
    ta(ge(r))
  );
}
function ia(r) {
  try {
    let e = orca.state.settings[Ce.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Qt(r))
      return "今天";
    if (aa(r))
      return "昨天";
    if (ea(r))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const a = r.getDay(), n = ["日", "一", "二", "三", "四", "五", "六"][a], o = e.replace(/E/g, n);
          return z(r, o);
        } else
          return z(r, e);
      else
        return z(r, e);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of a)
        try {
          return z(r, i);
        } catch {
          continue;
        }
      return r.toLocaleDateString();
    }
  } catch {
    return r.toLocaleDateString();
  }
}
function Be(r) {
  try {
    const e = ce(r, "_repr");
    if (!e || e.type !== Ee.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch {
    return null;
  }
}
async function oe(r) {
  try {
    if (Be(r))
      return "journal";
    if (r["data-type"]) {
      const a = r["data-type"];
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
    if (r.aliases && r.aliases.length > 0 && r.aliases[0])
      try {
        const i = ce(r, "_hide");
        return i && i.value ? "page" : "tag";
      } catch {
        return "tag";
      }
    const t = ce(r, "_repr");
    if (t && t.type === Ee.JSON && t.value)
      try {
        const a = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
        if (a.type)
          return a.type;
      } catch {
      }
    if (r.content && Array.isArray(r.content)) {
      if (r.content.some(
        (c) => c && typeof c == "object" && c.type === "code"
      ))
        return "code";
      if (r.content.some(
        (c) => c && typeof c == "object" && c.type === "table"
      ))
        return "table";
      if (r.content.some(
        (c) => c && typeof c == "object" && c.type === "image"
      ))
        return "image";
      if (r.content.some(
        (c) => c && typeof c == "object" && c.type === "link"
      ))
        return "link";
    }
    if (r.text) {
      const a = r.text.trim();
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
function G(r) {
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
  let t = e[r];
  if (!t) {
    const a = na(r);
    a && (t = a);
  }
  return t || (t = e.default), t;
}
function na(r) {
  const e = r.toLowerCase(), t = {
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
  for (const [a, i] of Object.entries(t))
    if (e.includes(a))
      return i;
  return null;
}
function ce(r, e) {
  return !r.properties || !Array.isArray(r.properties) ? null : r.properties.find((t) => t.name === e);
}
function ra(r) {
  if (!Array.isArray(r) || r.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const a of r)
    a && typeof a == "object" && (a.t === "text" && a.v ? e++ : a.t === "ref" && a.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function oa(r) {
  if (!r || r.length === 0) return "";
  let e = "";
  for (const t of r)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function sa(r, e, t, a) {
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
  const n = document.createElement("i");
  n.className = e, n.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const o = document.createElement("span");
  if (o.textContent = r, o.style.cssText = `
    flex: 1;
    color: var(--orca-color-text-1);
  `, i.appendChild(n), i.appendChild(o), t && t.trim() !== "") {
    const c = document.createElement("span");
    c.textContent = t, c.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, i.appendChild(c);
  }
  return i.addEventListener("mouseenter", () => {
    i.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), i.addEventListener("mouseleave", () => {
    i.style.backgroundColor = "transparent";
  }), i.addEventListener("click", (c) => {
    c.preventDefault(), c.stopPropagation(), a();
    const s = i.closest('.orca-context-menu, .context-menu, [role="menu"]');
    s && (s.style.display = "none", s.remove());
  }), i;
}
function ca(r, e, t) {
  r.addEventListener("mouseenter", () => {
    r.style.cssText += e;
  }), r.addEventListener("mouseleave", () => {
    r.style.cssText = t;
  });
}
function Ae(r) {
  r && r.parentNode && r.parentNode.removeChild(r);
}
function la(r, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);
  if (t) {
    const a = parseInt(t[1], 16), i = parseInt(t[2], 16), n = parseInt(t[3], 16);
    return `rgba(${a}, ${i}, ${n}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function Te(r, e, t, a, i) {
  let n = "var(--orca-tab-bg)", o = "var(--orca-color-text-1)", c = "normal", s = "";
  if (r.color)
    try {
      s = `--tab-color: ${r.color.startsWith("#") ? r.color : `#${r.color}`};`, n = "var(--orca-tab-colored-bg)", o = "var(--orca-tab-colored-text)", c = "600";
    } catch {
    }
  return e ? `
    ${s}
    background: ${n};
    color: ${o};
    font-weight: ${c};
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
    ${s}
    background: ${n};
    color: ${o};
    font-weight: ${c};
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
  const r = document.createElement("div");
  return r.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, r;
}
function ha(r) {
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
  `, r.startsWith("ti ti-")) {
    const t = document.createElement("i");
    t.className = r, e.appendChild(t);
  } else
    e.textContent = r;
  return e;
}
function ua(r) {
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
  `, t.textContent = r, e.appendChild(t), requestAnimationFrame(() => {
    const a = e.offsetWidth;
    t.scrollWidth > a && (t.style.mask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.webkitMask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.maskSize = "100% 100%", t.style.webkitMaskSize = "100% 100%", t.style.maskRepeat = "no-repeat", t.style.webkitMaskRepeat = "no-repeat");
  }), e;
}
function ga() {
  const r = document.createElement("span");
  return r.textContent = "📌", r.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, r;
}
function X(r, e, t = 180, a = 200) {
  const i = window.innerWidth, n = window.innerHeight, o = 10;
  let c = r, s = e;
  return c + t > i - o && (c = i - t - o), s + a > n - o && (s = n - a - o, s < e - a && (s = e - a - 5)), c < o && (c = o), s < o && (s = e + 5), c = Math.max(o, Math.min(c, i - t - o)), s = Math.max(o, Math.min(s, n - a - o)), { x: c, y: s };
}
function We() {
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
function ee(r = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[r];
}
function le() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function ba(r, e, t, a, i, n) {
  return r ? `
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
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
var $ = /* @__PURE__ */ ((r) => (r[r.ERROR = 0] = "ERROR", r[r.WARN = 1] = "WARN", r[r.INFO = 2] = "INFO", r[r.DEBUG = 3] = "DEBUG", r[r.VERBOSE = 4] = "VERBOSE", r))($ || {});
const Ne = 1, U = class U {
  /**
   * 设置当前日志级别
   */
  static setLogLevel(e) {
    U.currentLogLevel = e;
  }
  /**
   * 获取当前日志级别
   */
  static getLogLevel() {
    return U.currentLogLevel;
  }
  /**
   * 检查是否应该输出指定级别的日志
   */
  static shouldLog(e) {
    return U.currentLogLevel >= e;
  }
};
v(U, "currentLogLevel", Ne);
let F = U;
function se(r, ...e) {
  F.shouldLog(
    2
    /* INFO */
  ) && console.info("[OrcaPlugin]", r, ...e);
}
function pa(r, ...e) {
  F.shouldLog(
    0
    /* ERROR */
  ) && console.error("[OrcaPlugin]", r, ...e);
}
function ma(r, ...e) {
  F.shouldLog(
    1
    /* WARN */
  ) && console.warn("[OrcaPlugin]", r, ...e);
}
function H(r, ...e) {
  F.shouldLog(
    4
    /* VERBOSE */
  ) && console.log("[OrcaPlugin]", r, ...e);
}
function fa(r, e, t, a) {
  const i = document.createElement("div");
  i.className = r ? "orca-tabs-plugin orca-tabs-container vertical" : "orca-tabs-plugin orca-tabs-container";
  const n = ba(r, e, a, t);
  return i.style.cssText = n, i;
}
function va(r, e, t) {
  const a = document.createElement("div");
  a.className = "feature-toggle-button", a.innerHTML = e ? "🔒" : "🔓", a.title = e ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)";
  const i = r ? `
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
  return a.style.cssText = i, a.addEventListener("click", t), ca(a, e ? "#006600" : "#666", e ? "#004400" : "#333"), a;
}
function xa(r, e, t) {
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
    max-height: ${r.maxDisplayCount * 32 + 8}px;
    width: ${r.maxWidth || 150}px;
    overflow: hidden;
    pointer-events: auto;
    transition: opacity 0.2s ease, transform 0.2s ease;
    opacity: 0;
    transform: translateY(-10px);
  `;
  a.style.cssText = i;
  const n = document.createElement("div");
  n.className = "hover-tab-list-scroll", n.style.cssText = `
    overflow-y: auto;
    overflow-x: hidden;
    max-height: ${r.maxDisplayCount * 32}px;
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
    const c = document.createElement("style");
    c.id = "hover-tab-list-styles", c.textContent = o, document.head.appendChild(c);
  }
  return a.appendChild(n), requestAnimationFrame(() => {
    a.style.opacity = "1", a.style.transform = "translateY(0)";
  }), a;
}
function ya(r, e, t, a, i) {
  const n = document.createElement("div");
  n.className = "hover-tab-item", n.setAttribute("data-tab-id", r.blockId);
  const o = t.maxDisplayCount - 1, c = Math.max(t.minOpacity, 1 - e / o * (1 - t.minOpacity)), s = Math.max(t.minScale, 1 - e / o * (1 - t.minScale)), l = `
    display: flex;
    align-items: center;
    padding: 6px 8px;
    margin: 2px 0;
    border-radius: var(--orca-radius-sm, 4px);
    cursor: pointer;
    transition: all ${t.animationDuration}ms ease;
    opacity: ${c};
    transform: scale(${s});
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
  n.style.cssText = l;
  const d = document.createElement("div");
  if (d.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
  `, r.icon) {
    const h = document.createElement("span");
    r.icon.includes(" ") || r.icon.startsWith("ti-") ? h.className = r.icon : h.textContent = r.icon, h.style.cssText = `
      margin-right: 6px;
      font-size: 12px;
      flex-shrink: 0;
    `, d.appendChild(h);
  }
  const u = document.createElement("span");
  return u.textContent = r.title, u.style.cssText = `
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `, d.appendChild(u), n.appendChild(d), n.addEventListener("click", (h) => {
    h.stopPropagation(), a(r);
  }), n.addEventListener("mouseenter", () => {
    n.style.background = "var(--orca-bg-hover, rgba(0, 0, 0, 0.05))", n.style.transform = `scale(${Math.min(1, s + 0.05)})`;
  }), n.addEventListener("mouseleave", () => {
    n.style.background = "transparent", n.style.transform = `scale(${s})`;
  }), n;
}
function de(r, e, t, a, i, n = 0) {
  const o = r.querySelector(".hover-tab-list-scroll");
  if (!o) return;
  o.innerHTML = "";
  const c = n, s = Math.min(c + t.maxDisplayCount, e.length);
  e.slice(c, s).forEach((d, u) => {
    const h = ya(d, u, t, a);
    o.appendChild(h);
  }), n > 0 && (o.scrollTop = n * 32);
}
function we(r, e, t, a, i) {
  H("🎨 showHoverTabList 被调用", { tabs: r.length, position: e, config: t });
  const n = document.querySelector(".hover-tab-list-container");
  n && (H("🗑️ 移除现有的悬浮列表"), Ae(n)), H("🏗️ 创建新容器");
  const o = xa(t, e);
  return H("📦 容器创建完成", o), document.body.appendChild(o), H("📄 容器已添加到页面"), H("🔄 更新内容"), de(o, r, t, a), H("✅ 内容更新完成"), o;
}
function W() {
  const r = document.querySelector(".hover-tab-list-container");
  r && (r.style.opacity = "0", r.style.transform = "translateY(-10px)", setTimeout(() => {
    Ae(r);
  }, 200));
}
const he = /* @__PURE__ */ new WeakMap();
function B(r, e) {
  if (!r || !e.text)
    return;
  let t = null, a = null;
  const i = (s) => {
    a = setTimeout(() => {
      if (!r.isConnected || !document.body.contains(r))
        return;
      const l = r.getBoundingClientRect();
      if (!(!l || l.width === 0 || l.height === 0 || l.top === 0 && l.left === 0 && l.bottom === 0 && l.right === 0)) {
        if (!t) {
          t = document.createElement("div"), t.className = `orca-tooltip ${e.className || ""}`;
          const d = e.shortcut ? `${e.text} (${e.shortcut})` : e.text;
          d.includes(`
`) ? t.innerHTML = d.replace(/\n/g, "<br>") : t.textContent = d, t.style.cssText = `
          position: absolute;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        `, document.body.appendChild(t);
        }
        t.style.opacity = "1", t.style.visibility = "hidden", requestAnimationFrame(() => {
          if (!t || !t.parentNode) return;
          const d = t.getBoundingClientRect();
          if (!d || d.width === 0 || d.height === 0) {
            n();
            return;
          }
          let u = 0, h = 0, g = e.defaultPlacement || "top";
          const p = window.innerWidth, m = window.innerHeight, b = 8, f = (w) => {
            let x = 0, T = 0;
            switch (w) {
              case "top":
                x = l.left + (l.width - d.width) / 2, T = l.top - d.height - 8;
                break;
              case "bottom":
                x = l.left + (l.width - d.width) / 2, T = l.bottom + 8;
                break;
              case "left":
                x = l.left - d.width - 8, T = l.top + (l.height - d.height) / 2;
                break;
              case "right":
                x = l.right + 8, T = l.top + (l.height - d.height) / 2;
                break;
            }
            return { x, y: T };
          }, y = (w) => {
            const { x, y: T } = f(w);
            return x >= b && x + d.width <= p - b && T >= b && T + d.height <= m - b;
          };
          if (y(g)) {
            const w = f(g);
            u = w.x, h = w.y;
          } else {
            const w = g === "bottom" ? ["top", "left", "right"] : g === "top" ? ["bottom", "left", "right"] : g === "left" ? ["right", "top", "bottom"] : ["left", "top", "bottom"];
            let x = !1;
            for (const T of w)
              if (y(T)) {
                const S = f(T);
                u = S.x, h = S.y, g = T, x = !0;
                break;
              }
            if (!x) {
              const T = f(g);
              u = T.x, h = T.y;
            }
          }
          if (u < b ? u = b : u + d.width > p - b && (u = p - d.width - b), h < b ? h = b : h + d.height > m - b && (h = m - d.height - b), d.width > p - 2 * b && (u = b, t.style.maxWidth = `${p - 2 * b}px`), isNaN(u) || isNaN(h) || !isFinite(u) || !isFinite(h)) {
            console.warn("[Tooltip] Invalid position calculated, hiding tooltip"), n();
            return;
          }
          u = Math.max(0, u), h = Math.max(0, h), t.style.left = `${u}px`, t.style.top = `${h}px`, t.style.visibility = "visible";
        });
      }
    }, e.delay || 500);
  }, n = () => {
    var s;
    if (a && (clearTimeout(a), a = null), t) {
      try {
        t.parentNode && t.parentNode.removeChild(t);
      } catch (l) {
        console.warn("Tooltip removal failed, trying alternative method:", l), (s = t.remove) == null || s.call(t);
      }
      t = null;
    }
  }, o = (s) => {
    if (t && t.parentNode) {
      const l = r.getBoundingClientRect();
      (s.clientX < l.left - 10 || s.clientX > l.right + 10 || s.clientY < l.top - 10 || s.clientY > l.bottom + 10) && n();
    }
  };
  r.addEventListener("mouseenter", i), r.addEventListener("mouseleave", n), r.addEventListener("mousedown", n), r.addEventListener("mousemove", o);
  const c = () => {
    var s;
    if (a && clearTimeout(a), r.removeEventListener("mouseenter", i), r.removeEventListener("mouseleave", n), r.removeEventListener("mousedown", n), r.removeEventListener("mousemove", o), t) {
      try {
        t.parentNode && t.parentNode.removeChild(t);
      } catch (l) {
        console.warn("Tooltip cleanup failed, trying alternative method:", l), (s = t.remove) == null || s.call(t);
      }
      t = null;
    }
  };
  he.set(r, c);
}
function Ta(r) {
  const e = he.get(r);
  e && (e(), he.delete(r));
}
function R(r, e) {
  return {
    text: r,
    shortcut: e,
    delay: 200,
    defaultPlacement: "bottom"
    // 按钮tooltip默认显示在下方
  };
}
function ze(r) {
  let e = r.title || "未命名标签页";
  const t = [];
  return r.blockId && t.push(`ID: ${r.blockId}`), r.blockType && t.push(`类型: ${r.blockType}`), r.isPinned && t.push("📌 已固定"), r.isJournal && t.push("📝 日志块"), t.length > 0 && (e += `
` + t.join(" | ")), {
    text: e,
    delay: 300,
    defaultPlacement: "bottom"
    // 标签页 tooltip 默认显示在下方
  };
}
function ue(r) {
  return {
    text: r,
    delay: 500,
    defaultPlacement: "bottom"
    // 状态tooltip默认显示在下方
  };
}
function wa() {
  document.querySelectorAll('[data-tooltip="true"]').forEach((e, t) => {
    const a = e.getAttribute("data-tooltip-text"), i = e.getAttribute("data-tooltip-shortcut"), n = e.getAttribute("data-tooltip-delay");
    if (a) {
      const o = {
        text: a,
        shortcut: i || void 0,
        delay: n ? parseInt(n) : void 0
      };
      B(e, o);
    }
  });
}
function J() {
  document.querySelectorAll(".orca-tooltip").forEach((a) => {
    var i;
    try {
      a.parentNode ? a.parentNode.removeChild(a) : (i = a.remove) == null || i.call(a);
    } catch (n) {
      console.warn("Failed to remove tooltip:", n);
    }
  }), document.querySelectorAll(".tooltip").forEach((a) => {
    var i;
    try {
      a.parentNode ? a.parentNode.removeChild(a) : (i = a.remove) == null || i.call(a);
    } catch (n) {
      console.warn("Failed to remove tooltip:", n);
    }
  }), document.querySelectorAll('[style*="position: absolute"]').forEach((a) => {
    var s;
    const i = window.getComputedStyle(a), n = parseFloat(i.left), o = parseFloat(i.top);
    if (parseInt(i.zIndex) >= 1e4 && n < 20 && o < 20 && (a.classList.contains("orca-tooltip") || a.classList.contains("tooltip")))
      try {
        a.parentNode ? a.parentNode.removeChild(a) : (s = a.remove) == null || s.call(a), console.log("[Tooltip] Cleaned up suspicious tooltip at top-left corner");
      } catch (l) {
        console.warn("Failed to remove suspicious tooltip:", l);
      }
  });
}
function He() {
  setInterval(() => {
    J();
  }, 3e4);
}
function Oe() {
  window.addEventListener("beforeunload", () => {
    J();
  }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "hidden" && J();
  });
}
typeof window < "u" && (window.addTooltip = B, window.removeTooltip = Ta, window.createButtonTooltip = R, window.createTabTooltip = ze, window.createStatusTooltip = ue, window.cleanupAllTooltips = J, window.startTooltipCleanupTimer = He, window.setupPageUnloadCleanup = Oe);
function ka(r, e, t = {}) {
  try {
    const {
      updateOrder: a = !0,
      saveData: i = !0,
      updateUI: n = !0
    } = t, o = e.findIndex((d) => d.blockId === r.blockId);
    if (o === -1)
      return {
        success: !1,
        message: `标签不存在: ${r.title}`
      };
    e[o].isPinned = !e[o].isPinned;
    const c = e[o].isPinned;
    a && Ia(e);
    const s = e.findIndex((d) => d.blockId === r.blockId), l = c ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${r.title}" 已${l}`,
      data: { tab: e[s], tabIndex: s }
    };
  } catch (a) {
    return {
      success: !1,
      message: `切换固定状态失败: ${a}`
    };
  }
}
function Ca(r, e, t, a = {}) {
  try {
    const {
      updateUI: i = !0,
      saveData: n = !0,
      validateData: o = !0
    } = a, c = t.findIndex((s) => s.blockId === r.blockId);
    if (c === -1)
      return {
        success: !1,
        message: `标签不存在: ${r.title}`
      };
    if (o) {
      const s = Sa(e);
      if (!s.success)
        return s;
    }
    return t[c] = { ...t[c], ...e }, {
      success: !0,
      message: `标签 "${r.title}" 已更新`,
      data: { tab: t[c], tabIndex: c }
    };
  } catch (i) {
    return {
      success: !1,
      message: `更新标签失败: ${i}`
    };
  }
}
function Ea(r, e, t, a = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : Ca(r, { title: e.trim() }, t, a);
}
function Sa(r) {
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
function Ia(r) {
  r.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function Pa(r) {
  for (let e = r.length - 1; e >= 0; e--)
    if (!r[e].isPinned)
      return e;
  return -1;
}
function $a(r) {
  return [...r].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function La(r, e, t, a) {
  return e ? {
    x: r.x,
    y: r.y,
    width: t,
    height: a
  } : {
    x: r.x,
    y: r.y,
    width: Math.min(800, window.innerWidth - r.x - 10),
    height: 28
  };
}
function Da(r, e, t, a) {
  const i = La(r, e, t, a);
  let n = r.x, o = r.y;
  return i.x < 0 ? n = 0 : i.x + i.width > window.innerWidth && (n = window.innerWidth - i.width), i.y < 0 ? o = 0 : i.y + i.height > window.innerHeight && (o = window.innerHeight - i.height), { x: n, y: o };
}
function Ma(r, e, t = !1) {
  let a = null;
  const i = (...n) => {
    const o = t && !a;
    a && clearTimeout(a), a = window.setTimeout(() => {
      a = null, t || r(...n);
    }, e), o && r(...n);
  };
  return i.cancel = () => {
    a && (clearTimeout(a), a = null);
  }, i;
}
function Ba(r, e, t) {
  var a, i;
  try {
    const n = r.startsWith("#") ? r : `#${r}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(n))
      return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const o = parseInt(n.slice(1, 3), 16), c = parseInt(n.slice(3, 5), 16), s = parseInt(n.slice(5, 7), 16), l = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((i = (a = window.orca) == null ? void 0 : a.state) == null ? void 0 : i.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${o}, ${c}, ${s}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${o}, ${c}, ${s}) calc(l * 1.05) c h)` : `oklch(from rgb(${o}, ${c}, ${s}) calc(l * 0.6) c h)`;
  } catch {
    return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
function ke(r, e, t, a) {
  if (typeof e == "number" && typeof t == "function")
    return Aa(r, e, t, a);
  if (typeof e == "function" && typeof t == "function")
    return Wa(r, e, t);
  throw new Error("Invalid parameters for createWidthAdjustmentDialog");
}
function Aa(r, e, t, a) {
  const i = document.createElement("div");
  i.className = "width-adjustment-dialog";
  const n = We();
  i.style.cssText = n;
  const o = document.createElement("div");
  o.className = "dialog-title", o.textContent = "调整标签宽度", i.appendChild(o);
  const c = document.createElement("div");
  c.className = "dialog-slider-container", c.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const s = document.createElement("div");
  s.textContent = "最大宽度 (80px - 200px)", s.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: var(--orca-color-text-1);
  `;
  const l = document.createElement("input");
  l.type = "range", l.min = "80", l.max = "200", l.value = r.toString(), l.style.cssText = le();
  const d = document.createElement("div");
  d.className = "dialog-width-display", d.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: var(--orca-color-text-1);
  `, d.textContent = `最大宽度: ${r}px`;
  const u = document.createElement("div");
  u.className = "dialog-slider-container", u.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const h = document.createElement("div");
  h.textContent = "最小宽度 (60px - 150px)", h.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: var(--orca-color-text-1);
  `;
  const g = document.createElement("input");
  g.type = "range", g.min = "60", g.max = "150", g.value = e.toString(), g.style.cssText = le();
  const p = document.createElement("div");
  p.className = "dialog-width-display", p.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: var(--orca-color-text-1);
  `, p.textContent = `最小宽度: ${e}px`;
  let m = null;
  const b = (x, T) => {
    m && clearTimeout(m), m = window.setTimeout(() => {
      t(x, T), m = null;
    }, 150);
  };
  l.oninput = () => {
    const x = parseInt(l.value), T = parseInt(g.value);
    x < T && (g.value = x.toString(), p.textContent = `最小宽度: ${x}px`), d.textContent = `最大宽度: ${x}px`;
    const S = parseInt(l.value), C = parseInt(g.value);
    b(S, C);
  }, g.oninput = () => {
    const x = parseInt(l.value), T = parseInt(g.value);
    T > x && (l.value = T.toString(), d.textContent = `最大宽度: ${T}px`), p.textContent = `最小宽度: ${T}px`;
    const S = parseInt(l.value), C = parseInt(g.value);
    b(S, C);
  }, c.appendChild(s), c.appendChild(l), c.appendChild(d), u.appendChild(h), u.appendChild(g), u.appendChild(p), i.appendChild(c), i.appendChild(u);
  const f = document.createElement("div");
  f.className = "dialog-buttons", f.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const y = document.createElement("button");
  y.className = "btn btn-primary", y.textContent = "确定", y.style.cssText = ee(), y.onclick = () => {
    const x = parseInt(l.value), T = parseInt(g.value);
    t(x, T), te(i);
  };
  const w = document.createElement("button");
  return w.className = "btn btn-secondary", w.textContent = "取消", w.style.cssText = ee(), w.onclick = () => {
    a && a(), te(i);
  }, f.appendChild(y), f.appendChild(w), i.appendChild(f), i;
}
function Wa(r, e, t) {
  const a = document.createElement("div");
  a.className = "width-adjustment-dialog";
  const i = We();
  a.style.cssText = i;
  const n = document.createElement("div");
  n.className = "dialog-title", n.textContent = "调整面板宽度", a.appendChild(n);
  const o = document.createElement("div");
  o.className = "dialog-slider-container", o.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const c = document.createElement("input");
  c.type = "range", c.min = "120", c.max = "800", c.value = r.toString(), c.style.cssText = le();
  const s = document.createElement("div");
  s.className = "dialog-width-display", s.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, s.textContent = `当前宽度: ${r}px`, c.oninput = () => {
    const h = parseInt(c.value);
    s.textContent = `当前宽度: ${h}px`, e(h);
  }, o.appendChild(c), o.appendChild(s), a.appendChild(o);
  const l = document.createElement("div");
  l.className = "dialog-buttons", l.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = ee(), d.onclick = () => te(a);
  const u = document.createElement("button");
  return u.className = "btn btn-secondary", u.textContent = "取消", u.style.cssText = ee(), u.onclick = () => {
    t(), te(a);
  }, l.appendChild(d), l.appendChild(u), a.appendChild(l), a;
}
function te(r) {
  r && r.parentNode && r.parentNode.removeChild(r);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function Na() {
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
function za(r, e) {
  return r.length !== e.length ? !0 : !r.every((t, a) => t === e[a]);
}
let N;
class Ha {
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(e) {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    /** 插件名称 - 动态获取的插件名称，用于API调用和存储 */
    v(this, "pluginName");
    // ==================== 重构的面板数据管理 ====================
    /** 面板顺序映射 - 存储面板ID和序号的映射关系，支持面板关闭后重新排序 */
    v(this, "panelOrder", []);
    /** 当前激活的面板ID - 通过.orca-panel.active获取 */
    v(this, "currentPanelId", null);
    /** 当前面板索引 - 在panelOrder数组中的索引位置 */
    v(this, "currentPanelIndex", -1);
    /** 每个面板的标签页数据 - 索引对应panelOrder数组，完全独立存储 */
    v(this, "panelTabsData", []);
    /** 存储服务实例 - 提供统一的数据存储接口，支持Orca API和localStorage降级 */
    v(this, "storageService", new Re());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    v(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    v(this, "lastPanelCheckTime", 0);
    /** 上次面板块检查时间 - 用于防抖 checkCurrentPanelBlocks 调用 */
    v(this, "lastBlockCheckTime", 0);
    /** 数据保存防抖定时器 - 用于合并频繁的保存操作 */
    v(this, "saveDataDebounceTimer", null);
    /** 数据保存防抖延迟（毫秒） - 性能优化：增加到500ms减少频繁保存 */
    v(this, "SAVE_DEBOUNCE_DELAY", 500);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 当前日志级别 */
    v(this, "currentLogLevel", Ne);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* UI元素和状态管理 - UI Elements and State Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== UI元素引用 ====================
    /** 标签页容器元素 - 包含所有标签页的主容器 */
    v(this, "tabContainer", null);
    /** 循环切换器元素 - 用于在面板间切换的UI元素 */
    v(this, "cycleSwitcher", null);
    // ==================== 拖拽状态 ====================
    /** 是否正在拖拽 - 标识当前是否处于拖拽状态 */
    v(this, "isDragging", !1);
    /** 是否正在切换标签 - 防止在标签切换过程中错误替换标签 */
    v(this, "isSwitchingTab", !1);
    /** 拖拽起始X坐标 - 记录拖拽开始时的鼠标X坐标 */
    v(this, "dragStartX", 0);
    /** 拖拽起始Y坐标 - 记录拖拽开始时的鼠标Y坐标 */
    v(this, "dragStartY", 0);
    // ==================== 配置参数 ====================
    /** 最大标签页数量 - 限制同时显示的标签页数量，从设置中读取 */
    v(this, "maxTabs", 10);
    /** 主页块ID - 主页块的唯一标识符，从设置中读取 */
    v(this, "homePageBlockId", null);
    /** 标签页位置 - 标签页容器的屏幕坐标位置 */
    v(this, "position", { x: 50, y: 50 });
    // ==================== 状态管理 ====================
    /** 监控定时器 - 用于定期检查面板状态和更新UI */
    v(this, "monitoringInterval", null);
    /** 焦点同步定时器 - 控制自动同步焦点的轮询逻辑 */
    v(this, "focusSyncInterval", null);
    /** 上一次焦点检测的状态 - 用于避免重复调用 checkCurrentPanelBlocks */
    v(this, "lastFocusState", null);
    /** 面板块检测任务 - 防止 checkCurrentPanelBlocks 并发执行 */
    v(this, "panelBlockCheckTask", null);
    /** 面板状态检测任务 - 防止 checkPanelStatusChange 并发执行 */
    v(this, "panelStatusCheckTask", null);
    /** 正在创建的标签 - 防止重复创建同一个标签 */
    v(this, "creatingTabs", /* @__PURE__ */ new Set());
    /** 全局事件监听器 - 统一的全局事件处理函数 */
    v(this, "globalEventListener", null);
    /** 更新防抖计时器 - 防止频繁更新UI的防抖机制 */
    v(this, "updateDebounceTimer", null);
    /** 面板索引更新防抖计时器 - 防止频繁更新面板索引 */
    v(this, "panelIndexUpdateTimer", null);
    /** 上次更新时间 - 记录最后一次UI更新的时间戳 */
    v(this, "lastUpdateTime", 0);
    /** 是否正在更新 - 标识当前是否正在进行UI更新操作 */
    v(this, "isUpdating", !1);
    /** 是否已完成初始化 - 标识插件是否已完成初始化过程 */
    v(this, "isInitialized", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 布局和位置管理 - Layout and Position Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 布局模式 ====================
    /** 垂直模式标志 - 标识当前是否处于垂直布局模式 */
    v(this, "isVerticalMode", !1);
    /** 垂直模式窗口宽度 - 垂直布局模式下的标签页容器宽度 */
    v(this, "verticalWidth", 120);
    /** 垂直模式位置 - 垂直布局模式下的标签页容器位置 */
    v(this, "verticalPosition", { x: 20, y: 20 });
    /** 水平模式位置 - 水平布局模式下的标签页容器位置 */
    v(this, "horizontalPosition", { x: 20, y: 20 });
    /** 水平布局标签最大宽度 - 水平布局下标签的最大宽度 */
    v(this, "horizontalTabMaxWidth", 130);
    /** 水平布局标签最小宽度 - 水平布局下标签的最小宽度 */
    v(this, "horizontalTabMinWidth", 80);
    // ==================== 调整大小状态 ====================
    /** 是否正在调整大小 - 标识当前是否正在进行大小调整操作 */
    v(this, "isResizing", !1);
    /** 是否固定到顶部 - 标识标签页容器是否固定到屏幕顶部 */
    v(this, "isFixedToTop", !1);
    /** 调整大小手柄 - 用于调整标签页容器大小的拖拽手柄元素 */
    v(this, "resizeHandle", null);
    // ==================== 侧边栏对齐 ====================
    /** 侧边栏对齐功能是否启用 - 控制是否自动与侧边栏对齐 */
    v(this, "isSidebarAlignmentEnabled", !1);
    /** 侧边栏状态监听器 - 监听侧边栏状态变化的MutationObserver */
    v(this, "sidebarAlignmentObserver", null);
    /** 上次检测到的侧边栏状态 - 用于检测侧边栏状态变化 */
    v(this, "lastSidebarState", null);
    /** 侧边栏防抖计时器 - 防止频繁响应侧边栏状态变化 */
    v(this, "sidebarDebounceTimer", null);
    // ==================== 贴边隐藏 ====================
    /** 贴边隐藏功能是否启用 - 控制是否启用贴边隐藏功能 */
    v(this, "enableEdgeHide", !1);
    /** 当前贴边的方向 - 检测到容器靠近哪个边缘（null表示不靠近任何边缘） */
    v(this, "currentEdgeSide", null);
    /** 贴边隐藏是否展开 - 标识贴边隐藏状态下容器是否处于展开状态 */
    v(this, "isEdgeHideExpanded", !1);
    /** 贴边隐藏展开延迟定时器 - 用于延迟展开贴边隐藏的容器 */
    v(this, "edgeHideExpandTimer", null);
    /** 贴边隐藏收起延迟定时器 - 用于延迟收起贴边隐藏的容器 */
    v(this, "edgeHideCollapseTimer", null);
    /** 贴边隐藏触发区域元素 - 透明的触发区域，用于鼠标悬停检测 */
    v(this, "edgeHideTriggerElement", null);
    /** 容器鼠标进入处理器 - 绑定的事件处理函数，用于移除监听器 */
    v(this, "boundContainerMouseEnter", null);
    /** 容器鼠标离开处理器 - 绑定的事件处理函数，用于移除监听器 */
    v(this, "boundContainerMouseLeave", null);
    // ==================== 窗口可见性 ====================
    /** 浮窗是否可见 - 控制标签页容器的显示/隐藏状态 */
    v(this, "isFloatingWindowVisible", !0);
    // ==================== 功能开关 ====================
    /** 是否显示块类型图标 - 控制是否在标签页中显示块类型图标 */
    v(this, "showBlockTypeIcons", !0);
    /** 是否在顶部栏显示按钮 - 控制是否在Orca顶部工具栏显示插件按钮 */
    v(this, "showInHeadbar", !0);
    /** 是否启用最近关闭的标签页功能 - 控制是否记录和显示最近关闭的标签页 */
    v(this, "enableRecentlyClosedTabs", !0);
    /** 是否启用多标签页保存功能 - 控制是否允许保存多个标签页组合 */
    v(this, "enableMultiTabSaving", !0);
    /** 是否在刷新后恢复聚焦标签页 - 控制软件刷新后是否自动聚焦并打开当前聚焦的标签页 */
    v(this, "restoreFocusedTab", !0);
    /** 新标签是否添加到末尾（一次性标志，使用后自动重置为false） */
    v(this, "addNewTabToEnd", !0);
    /** 是否启用中键固定标签页功能 - 控制中键点击是否固定标签页 */
    v(this, "enableMiddleClickPin", !1);
    /** 是否启用双击关闭标签页功能 - 控制双击是否关闭标签页 */
    v(this, "enableDoubleClickClose", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 性能优化 - Performance Optimization */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 性能优化管理器 ====================
    /** 性能优化管理器 - 统一管理所有性能优化工具 */
    v(this, "performanceOptimizer", null);
    /** MutationObserver优化器实例 - 用于优化DOM变化监听 */
    v(this, "optimizedObserver", null);
    /** 高级防抖优化器实例 - 用于任务防抖和调度 */
    v(this, "debounceOptimizer", null);
    /** 内存泄漏防护器实例 - 用于跟踪和清理资源 */
    v(this, "memoryLeakProtector", null);
    /** 批量处理器实例 - 用于批量DOM操作 */
    v(this, "batchProcessor", null);
    /** 性能监控器实例 - 用于监控性能指标（已禁用） */
    // private performanceMonitor: PerformanceMonitorOptimizer | null = null;
    /** 性能指标计数缓存 - 记录自定义指标的累计值（已禁用） */
    // private performanceCounters: Record<string, number> = {};
    /** 性能基线定时器ID - 控制基线采集任务 */
    v(this, "performanceBaselineTimer", null);
    /** 最近一次性能基线场景 */
    v(this, "lastBaselineScenario", null);
    /** 最近一次性能基线报告（已禁用） */
    // private lastBaselineReport: PerformanceReport | null = null;
    /** 上一次插件初始化耗时（毫秒） */
    v(this, "lastInitDurationMs", null);
    /** 性能指标名称常量 */
    v(this, "performanceMetricKeys", {
      initTotal: "plugin_init_total",
      tabInteraction: "tab_interaction_total",
      domMutations: "dom_mutations"
    });
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 拖拽和事件管理 - Drag and Event Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 拖拽状态管理 ====================
    /** 当前正在拖拽的标签 - 存储正在被拖拽的标签页信息 */
    v(this, "draggingTab", null);
    /** 全局拖拽结束监听器 - 处理拖拽结束事件的全局监听器 */
    v(this, "dragEndListener", null);
    /** 拖拽交换防抖计时器 - 防止拖拽过程中频繁触发交换操作 */
    v(this, "swapDebounceTimer", null);
    /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
    v(this, "dropIndicator", null);
    /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
    v(this, "dragOverTab", null);
    /** 上次交换的目标标签和位置 - 防止重复交换 */
    v(this, "lastSwapKey", "");
    /** 优化的拖拽监听器 - 避免全文档监听 */
    v(this, "dragOverListener", null);
    /** 懒加载状态 - 避免不必要的初始化 */
    v(this, "isDragListenersInitialized", !1);
    /** 拖拽悬停计时器 - 控制拖拽悬停的延迟响应 */
    v(this, "dragOverTimer", null);
    /** 是否正在拖拽悬停状态 - 标识当前是否处于拖拽悬停状态 */
    v(this, "isDragOverActive", !1);
    // ==================== 事件监听器 ====================
    /** 主题变化监听器 - 监听Orca主题变化的事件监听器 */
    v(this, "themeChangeListener", null);
    /** 滚动监听器 - 监听页面滚动事件的监听器 */
    v(this, "scrollListener", null);
    // ==================== 缓存和优化 ====================
    /** 上次面板发现时间 - 记录最后一次发现面板的时间戳 */
    v(this, "lastPanelDiscoveryTime", 0);
    /** 面板发现缓存 - 缓存面板发现结果，避免频繁扫描 */
    v(this, "panelDiscoveryCache", null);
    /** 设置检查定时器 - 定期检查设置变化的定时器 */
    v(this, "settingsCheckInterval", null);
    /** 上次的设置状态 - 缓存上次的设置状态，用于检测变化 */
    v(this, "lastSettings", null);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 已关闭标签页跟踪 ====================
    /** 已关闭的标签页blockId集合 - 用于跟踪已关闭的标签页，避免重复创建 */
    v(this, "closedTabs", /* @__PURE__ */ new Set());
    /** 最近关闭的标签页列表 - 按时间倒序存储最近关闭的标签页信息 */
    v(this, "recentlyClosedTabs", []);
    /** 保存的多标签页集合 - 存储用户保存的标签页组合 */
    v(this, "savedTabSets", []);
    /** 记录上一个标签集合 - 用于比较标签页变化 */
    v(this, "previousTabSet", null);
    // ==================== 工作区功能 ====================
    /** 工作区列表 - 存储所有用户创建的工作区 */
    v(this, "workspaces", []);
    /** 当前工作区ID - 标识当前激活的工作区 */
    v(this, "currentWorkspace", null);
    /** 是否启用工作区功能 - 控制工作区功能的开关 */
    v(this, "enableWorkspaces", !0);
    /** 进入工作区之前的标签页组 - 用于退出工作区时恢复到原始标签页组 */
    v(this, "tabsBeforeWorkspace", null);
    /** 是否需要在初始化后恢复标签页组 - 用于处理在工作区状态下关闭软件的情况 */
    v(this, "shouldRestoreTabsBeforeWorkspace", !1);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    v(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    v(this, "lastActiveBlockId", null);
    /** 是否正在导航中 - 用于避免导航时触发重复的聚焦检测 */
    v(this, "isNavigating", !1);
    /** 最近导航到的块ID - 用于防止导航后立即重复创建标签页 */
    v(this, "lastNavigatedBlockId", null);
    /** 最近导航的时间戳 - 用于判断导航是否刚刚完成 */
    v(this, "lastNavigationTime", 0);
    // ==================== 快捷键相关 ====================
    /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
    v(this, "hoveredBlockId", null);
    // 防抖函数实例（仅用于拖拽等非关键场景）
    v(this, "draggingDebounce", Ma(async () => {
      await this.updateTabsUI();
    }, 200));
    this.pluginName = e, this.initializePerformanceOptimizers();
  }
  /** 简单的日志方法 */
  log(e, ...t) {
    this.currentLogLevel >= $.INFO && se(e, ...t);
  }
  logError(e, ...t) {
    this.currentLogLevel >= $.ERROR && pa(e, ...t);
  }
  logWarn(e, ...t) {
    this.currentLogLevel >= $.WARN && ma(e, ...t);
  }
  /**
   * 初始化性能优化器
   */
  initializePerformanceOptimizers() {
    try {
      this.log("🚀 初始化性能优化器..."), this.log("✅ 性能优化器已禁用");
    } catch (e) {
      this.error("❌ 性能优化器初始化失败:", e);
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
  startPerformanceMeasurement(e) {
    return null;
  }
  /**
   * 记录计数型指标（已禁用）
   */
  recordPerformanceCountMetric(e) {
  }
  /**
   * 延迟输出性能基线报告
   */
  schedulePerformanceBaselineReport(e, t = 12e3) {
  }
  /**
   * 输出性能基线报告（已禁用）
   */
  emitPerformanceBaselineReport(e) {
  }
  /**
   * 构建性能基线日志（已禁用）
   */
  formatPerformanceBaselineReport(e, t) {
    const a = this.getLatestMetricMap(e.metrics), i = a.get(this.performanceMetricKeys.initTotal), n = a.get(this.performanceMetricKeys.tabInteraction), o = a.get(this.performanceMetricKeys.domMutations), c = a.get("fps"), s = a.get("memory_heap"), l = i ? `${i.value.toFixed(1)}${i.unit}` : this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : "n/a", d = n ? `${n.value.toFixed(0)}` : "0", u = o ? `${o.value.toFixed(0)}` : "0", h = c ? `${c.value.toFixed(0)}fps` : "n/a", g = s ? this.formatBytes(s.value) : "n/a";
    return [
      `[Performance][${t}] Baseline`,
      `  healthScore: ${e.healthScore}`,
      `  init_total: ${l}`,
      `  tab_interactions: ${d}`,
      `  dom_mutations: ${u}`,
      `  fps: ${h}`,
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
    this.currentLogLevel >= $.DEBUG && se(e.join(" "), ...e);
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...e) {
    this.currentLogLevel >= $.VERBOSE && se(e.join(" "), ...e);
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
    this.currentLogLevel = e, F.setLogLevel(e), this.log(`📊 日志级别已设置为: ${$[e]}`);
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
    await this.restoreDebugMode(), await this.restoreRestoreFocusedTabSetting(), await this.restoreFeatureToggleSettings(), Na(), this.tabStorageService = new je(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[Ce.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.loadWorkspaces();
    const [
      e,
      t,
      a,
      i
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
        s,
        l,
        d,
        u
      ] = await Promise.all([
        this.tabStorageService.restoreFirstPanelTabs(),
        this.tabStorageService.restoreClosedTabs(),
        this.tabStorageService.restoreRecentlyClosedTabs(),
        this.tabStorageService.restoreSavedTabSets()
      ]);
      this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = s, this.closedTabs = l, this.recentlyClosedTabs = d, this.savedTabSets = u, await this.updateRestoredTabsBlockTypes();
    }
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && requestIdleCallback(() => {
      this.storageService.testConfigSerialization();
    }, { timeout: 2e3 });
    const o = document.querySelector(".orca-panel.active"), c = o == null ? void 0 : o.getAttribute("data-panel-id");
    if (c && !c.startsWith("_") && (this.currentPanelId = c, this.currentPanelIndex = this.getPanelIds().indexOf(c), this.log(`🎯 当前活动面板: ${c} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1 && requestIdleCallback(async () => {
      this.log("📂 延迟加载其他面板的标签页数据");
      for (let s = 1; s < this.panelOrder.length; s++) {
        const l = `panel_${s + 1}_tabs`;
        try {
          const d = await this.storageService.getConfig(l, this.pluginName, []);
          this.log(`📂 从存储获取到第 ${s + 1} 个面板的数据: ${d ? d.length : 0} 个标签页`), d && d.length > 0 ? (this.panelTabsData[s] = [...d], this.log(`✅ 成功加载第 ${s + 1} 个面板的标签页数据: ${d.length} 个`)) : (this.panelTabsData[s] = [], this.log(`📂 第 ${s + 1} 个面板没有保存的数据`));
        } catch (d) {
          this.warn(`❌ 加载第 ${s + 1} 个面板数据失败:`, d), this.panelTabsData[s] = [];
        }
      }
    }, { timeout: 1e3 }), c && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${c} 的标签页`), await this.scanCurrentPanelTabs();
    else if (c && this.currentPanelIndex === 0)
      if (this.log("📋 当前活动面板是第一个面板，使用持久化数据"), this.restoreFocusedTab) {
        const s = document.querySelector(".orca-panel.active");
        if (s) {
          const l = s.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (l) {
            const d = l.getAttribute("data-block-id");
            d && (this.getCurrentPanelTabs().find((g) => g.blockId === d) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${d}`), await this.checkCurrentPanelBlocks()));
          }
        }
      } else
        this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过当前聚焦页面的恢复');
    this.restoreFocusedTab ? await this.autoDetectAndSyncCurrentFocus() : this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过自动检测聚焦页面'), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.initializeOptimizedDOMObserver(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), setTimeout(() => {
      try {
        wa(), this.initializeHeadbarUserToolsTooltips(), He(), Oe(), this.log("✅ Tooltips 初始化完成，清理定时器和页面卸载清理已启动");
      } catch (s) {
        this.log("⚠️ Tooltips 初始化失败:", s);
      }
    }, 1e3), this.setupSettingsChecker(), this.schedulePerformanceBaselineReport("startup"), this.isInitialized = !0, this.log("✅ 插件初始化完成");
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
      let n = null;
      for (const d of i) {
        if (this.isInsidePopup(d))
          continue;
        const u = d.querySelector(".orca-block-editor[data-block-id]");
        if (u) {
          n = u;
          break;
        }
      }
      if (!n) {
        this.log(`⚠️ 激活面板 ${t} 中没有找到可见的块编辑器，跳过自动检测`);
        return;
      }
      const o = n.getAttribute("data-block-id");
      if (!o) {
        this.log("⚠️ 激活的块编辑器没有blockId，跳过自动检测");
        return;
      }
      this.log(`🔍 检测到当前可见的块ID: ${o}`);
      let c = this.getCurrentPanelTabs();
      c.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), c = this.getCurrentPanelTabs());
      const s = c.find((d) => d.blockId === o);
      if (s) {
        this.log(`📋 当前可见页面已存在于标签页中: "${s.title}" (${o})`), this.updateFocusState(o, s.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功同步已存在的标签页: "${s.title}"`);
        return;
      }
      this.log(`📋 当前可见页面不在标签页中，需要创建新标签页: ${o}`);
      const l = await this.getTabInfo(o, t, 0);
      if (!l) {
        this.log("⚠️ 无法获取块信息，跳过自动检测");
        return;
      }
      if (this.log(`🔍 获取到标签信息: "${l.title}" (类型: ${l.blockType || "unknown"})`), c.length >= this.maxTabs) {
        const d = c.length - 1, u = c[d];
        c[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${u.title}" -> "${l.title}"`);
      } else
        l.order = c.length, c.push(l), this.log(`➕ 添加新标签页到末尾: "${l.title}" (当前标签数: ${c.length}/${this.maxTabs})`);
      this.setCurrentPanelTabs(c), await this.saveCurrentPanelTabs(), this.updateFocusState(o, l.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功创建并同步新标签页: "${l.title}" (${o})`);
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
    const e = (n) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", n), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", e), this.log("主题变化监听器注册成功");
    } catch (n) {
      this.error("主题变化监听器注册失败:", n);
    }
    let t = orca.state.themeMode;
    const i = setInterval(() => {
      const n = orca.state.themeMode;
      n !== t && (this.log("备用检测：主题从", t, "切换到", n), t = n, setTimeout(() => {
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
        const n = a, o = n.getAttribute("title");
        o && (n.removeAttribute("title"), B(n, {
          text: o,
          delay: 300,
          defaultPlacement: "bottom"
        }), this.log(`✅ 已为用户工具栏按钮 ${i + 1} 添加 tooltip: "${o}"`));
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
      }, 500);
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
            (c) => c.classList.contains("new-tab-button") || c.classList.contains("drag-handle") || c.classList.contains("resize-handle")
          )) {
            this.clearDropIndicator();
            return;
          }
        }
        e || (e = requestAnimationFrame(() => {
          e = null;
          const i = document.elementsFromPoint(t.clientX, t.clientY).find((n) => {
            if (!n.classList.contains("orca-tab") || !n.hasAttribute("data-block-id")) return !1;
            const o = n.style;
            return !(o.opacity === "0" && o.pointerEvents === "none" || n.classList.contains("close-button") || n.classList.contains("new-tab-button") || n.classList.contains("drag-handle") || n.classList.contains("resize-handle"));
          });
          if (i) {
            const n = i.getAttribute("data-block-id"), c = this.getCurrentPanelTabs().find((s) => s.blockId === n);
            if (c && c.blockId !== this.draggingTab.blockId) {
              const s = i.getBoundingClientRect(), l = this.isVerticalMode && !this.isFixedToTop;
              let d;
              if (l) {
                const h = s.top + s.height / 2;
                d = t.clientY < h ? "before" : "after";
              } else {
                const h = s.left + s.width / 2;
                d = t.clientX < h ? "before" : "after";
              }
              this.updateDropIndicator(i, d);
              const u = `${c.blockId}-${d}`;
              this.lastSwapKey !== u && (this.lastSwapKey = u, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
                await this.swapTabsRealtime(c, this.draggingTab, d);
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
    const i = e.getBoundingClientRect(), n = e.parentElement;
    if (n) {
      const o = n.getBoundingClientRect();
      t === "before" ? (a.style.left = `${i.left - o.left}px`, a.style.top = `${i.top - o.top - 1}px`, a.style.width = `${i.width}px`) : (a.style.left = `${i.left - o.left}px`, a.style.top = `${i.bottom - o.top - 1}px`, a.style.width = `${i.width}px`), n.appendChild(a);
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
    var h, g;
    if (!this.tabContainer) return;
    const i = this.getCurrentPanelTabs(), n = i.findIndex((p) => p.blockId === t.blockId), o = i.findIndex((p) => p.blockId === e.blockId);
    if (n === -1 || o === -1 || n === o) return;
    const c = i.filter((p) => p.isPinned).length;
    let s = a === "before" ? o : o + 1;
    if (n < s && s--, t.isPinned) {
      if (s >= c) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶区域: ${t.title}`);
        return;
      }
      if (!e.isPinned) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (!t.isPinned) {
      if (s < c) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶区域: ${t.title}`);
        return;
      }
      if (e.isPinned) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (n === s) return;
    this.verboseLog(`🔄 [实时交换] ${t.title}: ${n} -> ${s}`);
    const [l] = i.splice(n, 1);
    i.splice(s, 0, l), await this.setCurrentPanelTabs(i);
    const d = this.tabContainer.querySelector(`[data-block-id="${t.blockId}"]`), u = this.tabContainer.querySelector(`[data-block-id="${e.blockId}"]`);
    d && u && (a === "before" ? (h = u.parentNode) == null || h.insertBefore(d, u) : (g = u.parentNode) == null || g.insertBefore(d, u.nextSibling));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(e, t) {
    const a = this.getCurrentPanelTabs(), i = a.findIndex((s) => s.blockId === e.blockId), n = a.findIndex((s) => s.blockId === t.blockId);
    if (i === -1 || n === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (i === n) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${n}) -> ${e.title} (${i})`);
    const o = a[n], c = a[i];
    a[i] = o, a[n] = c, a.forEach((s, l) => {
      s.order = l;
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
    const e = document.querySelectorAll(".orca-panel"), t = [];
    let a = null;
    e.forEach((n) => {
      const o = n.getAttribute("data-panel-id");
      if (o) {
        if (o.startsWith("_"))
          return;
        t.push(o), n.classList.contains("active") && (a = o);
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
    const a = e.filter((n) => !t.includes(n));
    a.length > 0 && (this.log("🗑️ 检测到面板被关闭:", a), await this.handlePanelClosure(a));
    const i = t.filter((n) => !e.includes(n));
    i.length > 0 && (this.log("🆕 检测到新面板被打开:", i), this.handleNewPanels(i)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   */
  async handlePanelClosure(e) {
    this.log("🗑️ 处理面板关闭:", e);
    const t = [];
    e.forEach((a) => {
      const i = this.panelOrder.findIndex((n) => n.id === a);
      i !== -1 && t.push(i);
    }), t.sort((a, i) => i - a).forEach((a) => {
      this.panelTabsData.splice(a, 1), this.log(`🗑️ 删除面板 ${e[t.indexOf(a)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((a) => a.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let a = 0; a < this.panelOrder.length; a++) {
      const i = this.panelTabsData[a] || [], n = a === 0 ? k.FIRST_PANEL_TABS : `panel_${a + 1}_tabs`;
      await this.savePanelTabsByKey(n, i);
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
    if (t.length === e.length && t.every((n, o) => n === e[o]))
      return;
    e.forEach((n) => {
      this.panelOrder.find((o) => o.id === n) || this.addPanel(n);
    }), this.panelOrder.filter((n) => !e.includes(n.id)).forEach((n) => {
      this.removePanel(n.id);
    }), this.log("🔄 面板顺序更新完成:", this.panelOrder.map((n) => `${n.id}(${n.order})`));
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
    let n = 0;
    this.log(`🔍 扫描第一个面板 ${e}，找到 ${a.length} 个块编辑器`);
    for (const o of a) {
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const s = await this.getTabInfo(c, e, n++);
      s && (i.push(s), this.log(`📋 找到标签页: ${s.title} (${c})`));
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
    const e = this.getCurrentPanelTabs(), t = $a(e);
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return Pa(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return oa(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, a = !1, i = !1;
    for (const n of e)
      n && typeof n == "object" && (n.t === "r" && n.v ? (i = !0, n.a || (t = !0)) : n.t === "t" && n.v && (a = !0));
    return t || a && i;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return ra(e);
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
          const i = e.getDay(), o = ["日", "一", "二", "三", "四", "五", "六"][i], c = t.replace(/E/g, o);
          return z(e, c);
        } else
          return z(e, t);
      else
        return z(e, t);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const n of i)
        try {
          return z(e, n);
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
      let n = "", o = "", c = "", s = !1, l = "";
      l = await oe(i), this.verboseLog(`🔍 检测到块类型: ${l} (块ID: ${e})`), i.aliases && i.aliases.length > 0 && this.verboseLog(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${l}`);
      try {
        const d = Be(i);
        if (d)
          s = !0, n = ia(d);
        else if (i.aliases && i.aliases.length > 0)
          n = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? n = i.text.substring(0, 50) : n = (await this.extractTextFromContent(i.content)).substring(0, 50);
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
          n = u;
        } else
          n = `块 ${e}`;
      } catch (d) {
        this.warn("获取标题失败:", d), n = `块 ${e}`;
      }
      try {
        const d = this.findProperty(i, "_color"), u = this.findProperty(i, "_icon");
        d && d.type === 1 && (o = d.value), u && u.type === 1 && u.value && u.value.trim() ? (c = u.value, this.verboseLog(`🎨 使用用户自定义图标: ${c} (块ID: ${e})`)) : (this.showBlockTypeIcons || l === "journal") && (c = G(l), this.verboseLog(`🎨 使用块类型图标: ${c} (块类型: ${l}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), c = G(l);
      }
      return {
        blockId: e,
        panelId: t,
        title: n || `块 ${e}`,
        color: o,
        icon: c,
        isJournal: s,
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
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.log("📱 使用自动切换模式，不创建面板切换器");
    const e = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)";
    let t, a, i;
    if (this.isFixedToTop ? (t = { x: 0, y: 0 }, a = !1, i = window.innerWidth) : (t = this.isVerticalMode ? this.verticalPosition : this.position, a = this.isVerticalMode, i = this.verticalWidth), this.tabContainer = fa(
      a,
      t,
      i,
      e
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
      document.body.appendChild(this.tabContainer), this.enableEdgeHide && requestAnimationFrame(() => {
        this.applyEdgeHideStyle();
      });
    this.tabContainer.addEventListener("mousedown", (o) => {
      if (!o || !o.target)
        return;
      const c = o.target;
      c.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !c.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && o.stopPropagation();
    }), this.tabContainer.addEventListener("click", (o) => {
      if (!o || !o.target)
        return;
      const c = o.target;
      c.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !c.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && o.stopPropagation();
    });
    const n = document.createElement("div");
    n.className = "drag-handle", n.style.cssText = `
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
    `, n.innerHTML = "", n.addEventListener("mouseenter", () => {
      n.style.opacity = "0.5";
    }), n.addEventListener("mouseleave", () => {
      n.style.opacity = "0";
    }), n.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(n), this.isFixedToTop || document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && this.enableDragResize(), await this.updateTabsUI();
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
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(0 0 0 / 18%));
        --orca-tab-border: rgba(0, 0, 0, 0.1);
        --orca-tab-hover-border: var(--orca-color-primary-3);
        --orca-tab-active-border: rgba(0, 0, 0, 0.3);
        --orca-tab-container-bg: rgba(255, 255, 255, 0.1);
        --orca-input-bg: rgba(200, 200, 200, 0.6);
      }
      
      /* 手动设置的暗色模式 */
      :root[data-theme="dark"],
      .dark {
        --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(255 255 255 / 12%));
        --orca-tab-border: rgba(255, 255, 255, 0.2);
        --orca-tab-hover-border: var(--orca-color-primary-3);
        --orca-tab-active-border: rgba(255, 255, 255, 0.4);
        --orca-input-bg: rgba(255, 255, 255, 0.1);
      }
      
      /* 系统暗色模式检测 - 自动跟随系统主题 */
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          --orca-tab-bg: color-mix(in srgb, var(--orca-color-bg-1), rgb(255 255 255 / 12%));
          --orca-tab-border: rgba(255, 255, 255, 0.2);
          --orca-tab-hover-border: var(--orca-color-primary-3);
          --orca-tab-active-border: rgba(255, 255, 255, 0.4);
          --orca-input-bg: rgba(255, 255, 255, 0.1);
        }
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
      if (e - this.lastUpdateTime < 200) {
        e - this.lastUpdateTime < 50 && this.verboseLog("⏭️ 跳过UI更新：距离上次更新仅 " + (e - this.lastUpdateTime) + "ms");
        return;
      }
      this.lastUpdateTime = e;
      const i = this.tabContainer.querySelector(".drag-handle"), n = this.tabContainer.querySelector(".new-tab-button"), o = this.tabContainer.querySelector(".workspace-button"), c = Array.from(this.tabContainer.querySelectorAll(".orca-tab")).map((h) => h.getAttribute("data-tab-id")).filter((h) => h !== null), s = this.getCurrentPanelTabs();
      this.tabContainer.querySelectorAll(".orca-tab").forEach((h) => h.remove()), i && i.parentElement !== this.tabContainer && this.tabContainer.insertBefore(i, this.tabContainer.firstChild);
      let d = this.currentPanelId, u = this.currentPanelIndex;
      if (!d && this.panelOrder.length > 0 && (d = this.panelOrder[0].id, u = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${d}`)), d) {
        this.verboseLog(`📋 显示面板 ${d} 的标签页`);
        let h = this.panelTabsData[u] || [];
        h.length === 0 && (this.log(`🔍 面板 ${d} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(u, d), h = this.panelTabsData[u] || []), this.sortTabsByPinStatus(), h = this.panelTabsData[u] || [];
        const g = document.createDocumentFragment();
        h.forEach((m, b) => {
          const f = this.createTabElement(m);
          g.appendChild(f);
        });
        const p = (t = this.tabContainer) == null ? void 0 : t.querySelector(".new-tab-button");
        this.tabContainer && (p ? this.tabContainer.insertBefore(g, p) : this.tabContainer.appendChild(g));
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton(), this.isFixedToTop) {
        const h = "var(--orca-tab-bg)", g = "var(--orca-tab-border)", p = "var(--orca-color-text-1)", m = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        m.forEach((f) => {
          const y = f.getAttribute("data-tab-id");
          if (!y) return;
          const x = this.getCurrentPanelTabs().find((T) => T.blockId === y);
          if (x) {
            let T, S, C = "normal";
            if (T = "var(--orca-tab-bg)", S = "var(--orca-color-text-1)", x.color)
              try {
                f.style.setProperty("--tab-color", x.color), (document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark")) && f.style.setProperty(
                  "--orca-tab-colored-text",
                  "oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h)",
                  "important"
                ), T = "var(--orca-tab-colored-bg)", S = "var(--orca-tab-colored-text)", C = "600";
              } catch {
              }
            f.style.cssText = `
             display: flex;
             align-items: center;
             padding: 2px 8px;
             background: ${T};
             border-radius: var(--orca-radius-md);
             border: 1px solid ${g};
             font-size: 12px;
             height: 24px;
             max-height: 24px;
             line-height: 20px;
             max-width: ${this.horizontalTabMaxWidth || 130}px;
             min-width: ${this.horizontalTabMinWidth || 80}px;
             white-space: nowrap;
             cursor: pointer;
             transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
             box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
             color: ${S};
             font-weight: ${C};
             backdrop-filter: blur(2px);
             -webkit-backdrop-filter: blur(2px);
             -webkit-app-region: no-drag;
             app-region: no-drag;
             pointer-events: auto;
             will-change: transform, margin, opacity, max-width, min-width;
           `, x.color && f.style.setProperty("--tab-color", x.color);
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
      this.enableEdgeHide && this.currentEdgeSide && !this.isFixedToTop && requestAnimationFrame(() => {
        this.applyEdgeConstraints();
      });
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
        const n = this.createTabElement(a);
        t.appendChild(n);
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
      a.textContent = `面板 ${i}（无标签页）`, B(a, ue(`当前在面板 ${i}，该面板没有标签页`)), t.appendChild(a);
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
        const n = this.createTabElement(a);
        t.appendChild(n);
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
      a.textContent = `面板 ${i}（无标签页）`, B(a, ue(`当前在面板 ${i}，该面板没有标签页`)), t.appendChild(a);
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
    t.style.cssText = a, t.innerHTML = "+", B(t, R("新建标签页")), t.addEventListener("mouseenter", () => {
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
        const n = i, o = this.getTabInfoFromElement(n);
        if (o) {
          const c = this.isVerticalMode && !this.isFixedToTop, s = Te(o, c, () => "", e, t);
          n.style.cssText = s;
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
        const e = ke(
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
        const e = this.horizontalTabMaxWidth, t = this.horizontalTabMinWidth, a = ke(
          this.horizontalTabMaxWidth,
          this.horizontalTabMinWidth,
          async (i, n) => {
            await this.updateTabWidths(i, n);
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
    const a = va(
      this.isVerticalMode,
      t,
      async (i) => {
        i.preventDefault(), i.stopPropagation(), this.log("🔧 点击功能切换按钮"), alert("功能切换按钮被点击了！"), await this.toggleFeatureSettings();
      }
    );
    B(a, R(
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
    t.style.cssText = a, t.innerHTML = '<i class="ti ti-layout-grid" style="font-size: 14px;"></i>', B(t, R(`工作区 (${((i = this.workspaces) == null ? void 0 : i.length) || 0})`)), t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", (n) => {
      n.preventDefault(), n.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(n);
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
    var d, u;
    const t = document.querySelector(".new-tab-context-menu");
    t && t.remove(), document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") : document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null || u.themeMode);
    const a = document.createElement("div");
    a.className = "new-tab-context-menu";
    const i = 200, n = 140, { x: o, y: c } = X(e.clientX, e.clientY, i, n);
    a.style.cssText = `
      position: fixed;
      left: ${o}px;
      top: ${c}px;
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
    const s = [
      {
        text: "新建标签页",
        action: () => this.createNewTab(),
        icon: "+"
      }
    ];
    this.isFixedToTop && s.push(
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
    ), this.isFixedToTop || s.push(
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
    ), !this.isVerticalMode && !this.isFixedToTop && s.push(
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
    ), this.isVerticalMode || s.push(
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
    ), this.isFixedToTop || s.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: this.enableEdgeHide ? "关闭贴边隐藏" : "开启贴边隐藏",
        action: () => this.toggleEdgeHide(),
        icon: this.enableEdgeHide ? "👁" : "👁‍🗨"
      }
    ), this.isFixedToTop || s.push(
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
    ), this.enableMultiTabSaving && s.push(
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
    ), s.forEach((h) => {
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
   * 切换贴边隐藏功能
   */
  async toggleEdgeHide() {
    try {
      this.enableEdgeHide = !this.enableEdgeHide, this.log(`🔄 贴边隐藏功能已${this.enableEdgeHide ? "启用" : "禁用"}`), await this.saveLayoutMode(), await this.createTabsUI();
    } catch (e) {
      this.error("切换贴边隐藏失败:", e);
    }
  }
  /**
   * 检测容器是否靠近屏幕边缘
   */
  detectEdgeProximity() {
    if (!this.tabContainer) return null;
    const e = this.tabContainer.getBoundingClientRect(), t = P.EDGE_DETECTION_DISTANCE;
    return e.left <= t ? "left" : window.innerWidth - e.right <= t ? "right" : e.top <= t ? "top" : window.innerHeight - e.bottom <= t ? "bottom" : null;
  }
  /**
   * 应用贴边隐藏样式
   */
  applyEdgeHideStyle() {
    if (!this.tabContainer) return;
    const e = this.detectEdgeProximity();
    if (this.verboseLog(`🔍 applyEdgeHideStyle: detectedEdge=${e}, currentEdgeSide=${this.currentEdgeSide}, isVerticalMode=${this.isVerticalMode}`), e !== this.currentEdgeSide) {
      if (this.currentEdgeSide = e, !this.currentEdgeSide) {
        this.tabContainer.style.transform = "none", this.tabContainer.style.maxHeight = "", this.isEdgeHideExpanded = !0, this.boundContainerMouseEnter && this.boundContainerMouseLeave && (this.tabContainer.removeEventListener("mouseenter", this.boundContainerMouseEnter), this.tabContainer.removeEventListener("mouseleave", this.boundContainerMouseLeave), this.boundContainerMouseEnter = null, this.boundContainerMouseLeave = null), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.verboseLog("📍 远离边缘，恢复正常显示");
        return;
      }
      const t = this.tabContainer.getBoundingClientRect();
      this.applyEdgeConstraints();
      const a = P.EDGE_HINT_SIZE;
      switch (this.currentEdgeSide) {
        case "left":
          {
            const i = t.width, n = i - a;
            this.verboseLog(`📦 左贴边隐藏: containerWidth=${i}, hintSize=${a}, translateAmount=${n}`), this.tabContainer.style.transform = `translateX(-${n}px)`;
          }
          break;
        case "right":
          {
            const i = t.width, n = i - a;
            this.verboseLog(`📦 右贴边隐藏: containerWidth=${i}, hintSize=${a}, translateAmount=${n}`), this.tabContainer.style.transform = `translateX(${n}px)`;
          }
          break;
        case "top":
          {
            const i = this.tabContainer.offsetHeight;
            this.tabContainer.style.transform = `translateY(-${i - a}px)`;
          }
          break;
        case "bottom":
          {
            const i = this.tabContainer.offsetHeight;
            this.tabContainer.style.transform = `translateY(${i - a}px)`;
          }
          break;
      }
      this.isEdgeHideExpanded = !1, this.verboseLog(`🧲 检测到靠近${this.currentEdgeSide}边缘，自动隐藏`), this.attachEdgeHideEvents(t);
    }
  }
  /**
   * 根据贴边方向应用容器尺寸限制
   */
  applyEdgeConstraints() {
    if (!this.tabContainer || !this.currentEdgeSide) return;
    const e = this.tabContainer.getBoundingClientRect(), t = 20;
    switch (this.currentEdgeSide) {
      case "top":
        {
          const a = window.innerHeight - e.top - t;
          this.tabContainer.style.maxHeight = `${Math.max(100, a)}px`, this.verboseLog(`📏 顶部贴边：可用高度 ${a}px`);
        }
        break;
      case "bottom":
        {
          const a = e.top + e.height - t;
          this.tabContainer.style.maxHeight = `${Math.max(100, a)}px`, this.verboseLog(`📏 底部贴边：容器top=${e.top}, height=${e.height}, 限制高度=${a}px`);
        }
        break;
      case "left":
      case "right":
        {
          const a = window.innerHeight * 0.8;
          this.tabContainer.style.maxHeight = `${a}px`, this.verboseLog(`📏 ${this.currentEdgeSide}侧贴边：限制高度 ${a}px`);
        }
        break;
    }
  }
  /**
   * 附加贴边隐藏事件监听 - 创建透明触发区域用于展开/收起
   * @param containerRect 容器的位置信息（可选，如果不提供则使用当前位置）
   */
  attachEdgeHideEvents(e) {
    if (!this.tabContainer || !this.currentEdgeSide) return;
    this.boundContainerMouseEnter && this.boundContainerMouseLeave && (this.tabContainer.removeEventListener("mouseenter", this.boundContainerMouseEnter), this.tabContainer.removeEventListener("mouseleave", this.boundContainerMouseLeave)), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.edgeHideTriggerElement = document.createElement("div");
    const t = this.currentLogLevel === $.VERBOSE;
    this.edgeHideTriggerElement.style.cssText = `
      position: fixed;
      z-index: 999;
      background: ${t ? "rgba(255, 0, 0, 0.3)" : "transparent"};
      pointer-events: auto;
      border: ${t ? "2px solid red" : "none"};
    `;
    const a = P.EDGE_TRIGGER_ZONE_SIZE, i = e || this.tabContainer.getBoundingClientRect();
    switch (this.currentEdgeSide) {
      case "left":
        this.edgeHideTriggerElement.style.left = "0", this.edgeHideTriggerElement.style.top = `${i.top}px`, this.edgeHideTriggerElement.style.width = `${a + P.EDGE_HINT_SIZE}px`, this.edgeHideTriggerElement.style.height = `${i.height}px`;
        break;
      case "right":
        this.edgeHideTriggerElement.style.right = "0", this.edgeHideTriggerElement.style.top = `${i.top}px`, this.edgeHideTriggerElement.style.width = `${a + P.EDGE_HINT_SIZE}px`, this.edgeHideTriggerElement.style.height = `${i.height}px`;
        break;
      case "top":
        this.edgeHideTriggerElement.style.left = `${i.left}px`, this.edgeHideTriggerElement.style.top = "0", this.edgeHideTriggerElement.style.width = `${i.width}px`, this.edgeHideTriggerElement.style.height = `${a + P.EDGE_HINT_SIZE}px`;
        break;
      case "bottom":
        this.edgeHideTriggerElement.style.left = `${i.left}px`, this.edgeHideTriggerElement.style.bottom = "0", this.edgeHideTriggerElement.style.width = `${i.width}px`, this.edgeHideTriggerElement.style.height = `${a + P.EDGE_HINT_SIZE}px`;
        break;
    }
    this.edgeHideTriggerElement.addEventListener("mouseenter", () => {
      this.verboseLog(`🖱️ 鼠标进入触发区域 (${this.currentEdgeSide})`), this.handleEdgeHideMouseEnter();
    }), this.edgeHideTriggerElement.addEventListener("mouseleave", () => {
      this.verboseLog(`🖱️ 鼠标离开触发区域 (${this.currentEdgeSide})`), this.handleEdgeHideMouseLeave();
    }), this.boundContainerMouseEnter = () => {
      this.verboseLog("🖱️ 鼠标进入容器本身"), this.edgeHideCollapseTimer && (clearTimeout(this.edgeHideCollapseTimer), this.edgeHideCollapseTimer = null, this.verboseLog("⏹️ 清除容器收起定时器")), this.isEdgeHideExpanded || (this.verboseLog("🚀 容器隐藏中，触发展开"), this.handleEdgeHideMouseEnter());
    }, this.boundContainerMouseLeave = () => {
      this.verboseLog("🖱️ 鼠标离开容器本身"), this.handleEdgeHideMouseLeave();
    }, this.tabContainer.addEventListener("mouseenter", this.boundContainerMouseEnter), this.tabContainer.addEventListener("mouseleave", this.boundContainerMouseLeave), document.body.appendChild(this.edgeHideTriggerElement);
    const n = this.edgeHideTriggerElement.getBoundingClientRect();
    this.verboseLog(`🎯 创建触发区域: ${this.currentEdgeSide}侧`), this.verboseLog(`   - 触发区域大小: ${a}px`), this.verboseLog(`   - 触发区域位置: left=${n.left}, top=${n.top}, width=${n.width}, height=${n.height}`), this.verboseLog(`   - 容器位置（隐藏前）: left=${i.left}, top=${i.top}, width=${i.width}, height=${i.height}`), this.verboseLog(`   - 容器当前transform: ${this.tabContainer.style.transform}`), this.verboseLog(`   - isEdgeHideExpanded: ${this.isEdgeHideExpanded}`);
  }
  /**
   * 处理贴边隐藏的鼠标进入事件
   */
  handleEdgeHideMouseEnter() {
    if (this.verboseLog(`📥 handleEdgeHideMouseEnter - isExpanded: ${this.isEdgeHideExpanded}`), this.edgeHideCollapseTimer && (clearTimeout(this.edgeHideCollapseTimer), this.edgeHideCollapseTimer = null, this.verboseLog("⏹️ 清除收起定时器")), this.isEdgeHideExpanded) {
      this.verboseLog("✅ 已经展开，跳过");
      return;
    }
    this.verboseLog(`⏰ 设置展开定时器: ${P.EDGE_HIDE_EXPAND_DELAY}ms`), this.edgeHideExpandTimer = window.setTimeout(() => {
      this.verboseLog("🚀 展开定时器触发"), this.expandEdgeHide();
    }, P.EDGE_HIDE_EXPAND_DELAY);
  }
  /**
   * 处理贴边隐藏的鼠标离开事件
   */
  handleEdgeHideMouseLeave() {
    this.edgeHideExpandTimer && (clearTimeout(this.edgeHideExpandTimer), this.edgeHideExpandTimer = null), this.isEdgeHideExpanded && (this.edgeHideCollapseTimer = window.setTimeout(() => {
      this.collapseEdgeHide();
    }, P.EDGE_HIDE_COLLAPSE_DELAY));
  }
  /**
   * 展开贴边隐藏的容器
   */
  expandEdgeHide() {
    if (this.verboseLog(`🔓 expandEdgeHide 开始 - container: ${!!this.tabContainer}, isExpanded: ${this.isEdgeHideExpanded}, edge: ${this.currentEdgeSide}`), !this.tabContainer || this.isEdgeHideExpanded) {
      this.verboseLog(`❌ expandEdgeHide 跳过 - container: ${!!this.tabContainer}, isExpanded: ${this.isEdgeHideExpanded}`);
      return;
    }
    this.currentEdgeSide === "top" || this.currentEdgeSide === "bottom" ? (this.verboseLog(`📐 设置 translateY(0) for ${this.currentEdgeSide}`), this.tabContainer.style.transform = "translateY(0)") : (this.verboseLog(`📐 设置 translateX(0) for ${this.currentEdgeSide}`), this.tabContainer.style.transform = "translateX(0)"), this.isEdgeHideExpanded = !0, this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null, this.verboseLog("🗑️ 移除触发区域（展开状态下不需要）")), this.verboseLog("📂 贴边隐藏容器已展开");
  }
  /**
   * 收起贴边隐藏的容器
   */
  collapseEdgeHide() {
    if (!this.tabContainer || !this.isEdgeHideExpanded || !this.currentEdgeSide) return;
    const e = P.EDGE_HINT_SIZE, t = this.tabContainer.getBoundingClientRect();
    switch (this.currentEdgeSide) {
      case "left":
        {
          const a = t.width;
          this.verboseLog(`📦 左贴边收起: containerWidth=${a}, translateAmount=${a - e}`), this.tabContainer.style.transform = `translateX(-${a - e}px)`;
        }
        break;
      case "right":
        {
          const a = t.width;
          this.verboseLog(`📦 右贴边收起: containerWidth=${a}, translateAmount=${a - e}`), this.tabContainer.style.transform = `translateX(${a - e}px)`;
        }
        break;
      case "top":
        {
          const a = this.tabContainer.offsetHeight;
          this.tabContainer.style.transform = `translateY(-${a - e}px)`;
        }
        break;
      case "bottom":
        {
          const a = this.tabContainer.offsetHeight;
          this.tabContainer.style.transform = `translateY(${a - e}px)`;
        }
        break;
    }
    this.isEdgeHideExpanded = !1, this.attachEdgeHideEvents(t), this.verboseLog("📁 贴边隐藏容器已收起");
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
      const n = this.getCurrentPosition();
      if (!n) return;
      const o = this.calculateSidebarAlignmentPosition(
        n,
        e,
        a,
        i
      );
      if (!o) return;
      await this.updatePosition(o), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${n.x}, ${n.y}) → (${o.x}, ${o.y})`);
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
    var o;
    let n;
    if (a)
      n = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${n}px`);
    else if (i) {
      n = e.x + t;
      const c = ((o = this.tabContainer) == null ? void 0 : o.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      n = Math.min(n, window.innerWidth - c - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${n}px`);
    } else
      return null;
    return { x: n, y: e.y };
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
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), this.registerHeadbarButton(), await this.tabStorageService.saveFloatingWindowVisible(this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
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
          onClick: (n) => this.showRecentlyClosedTabsMenu(n),
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
          onClick: (n) => this.showSavedTabSetsMenu(n),
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
        const n = await orca.invokeBackend("get-block", parseInt(i.blockId));
        if (n) {
          const o = await oe(n), c = this.findProperty(n, "_color"), s = this.findProperty(n, "_icon");
          let l = i.color, d = i.icon;
          c && c.type === 1 && (l = c.value), s && s.type === 1 && s.value && s.value.trim() ? d = s.value : d || (d = G(o)), i.blockType !== o || i.icon !== d || i.color !== l ? (e[a] = {
            ...i,
            blockType: o,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${i.title} -> 类型: ${o}, 图标: ${d}, 颜色: ${l}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${i.title} (无需更新)`);
        }
      } catch (n) {
        this.warn(`更新标签失败: ${i.title}`, n);
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
        const n = parseInt(a.replace("px", ""));
        if (isNaN(n))
          this.log(`⚠️ CSS变量值无法解析为数字: "${a}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${n}px`), n;
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
    const t = e.clientX, a = this.verticalWidth, i = (o) => {
      const c = o.clientX - t, s = Math.max(120, Math.min(400, a + c));
      this.verticalWidth = s, this.tabContainer.style.width = `${s}px`;
    }, n = async () => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", n);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (o) {
        this.error("保存宽度设置失败:", o);
      }
    };
    document.addEventListener("mousemove", i), document.addEventListener("mouseup", n);
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
    const i = this.isVerticalMode && !this.isFixedToTop, n = Te(e, i, () => "", this.horizontalTabMaxWidth, this.horizontalTabMinWidth);
    t.style.cssText = n;
    const o = da();
    if (e.icon && this.showBlockTypeIcons) {
      const s = ha(e.icon);
      o.appendChild(s);
    }
    const c = ua(e.title);
    if (o.appendChild(c), e.isPinned) {
      const s = ga();
      o.appendChild(s);
    }
    return t.appendChild(o), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), B(t, ze(e)), t.addEventListener("click", (s) => {
      var h;
      const l = s.target;
      if (l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle"))
        return;
      if (t.getAttribute("data-long-pressed") === "true") {
        t.removeAttribute("data-long-pressed");
        return;
      }
      if (document.querySelector(".hover-tab-list-container")) {
        W();
        return;
      }
      s.preventDefault(), this.verboseLog(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`), this.closedTabs.has(e.blockId) && (this.closedTabs.delete(e.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${e.title}"，从已关闭列表中移除`));
      const u = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tabs-plugin .orca-tab");
      u == null || u.forEach((g) => g.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (s) => {
    }), t.addEventListener("dblclick", (s) => {
      const l = s.target;
      l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle") || (s.preventDefault(), s.stopPropagation(), s.stopImmediatePropagation(), this.log(`🔧 双击事件处理: enableDoubleClickClose=${this.enableDoubleClickClose}`), this.enableDoubleClickClose ? (this.log("🔧 双击关闭标签页"), this.closeTab(e)) : (this.log("🔧 双击切换固定状态"), this.toggleTabPinStatus(e)));
    }), t.addEventListener("auxclick", (s) => {
      s.button === 1 && (s.preventDefault(), s.stopPropagation(), s.stopImmediatePropagation(), this.log(`🔧 中键事件处理: enableMiddleClickPin=${this.enableMiddleClickPin}`), this.enableMiddleClickPin ? (this.log("🔧 中键固定标签页"), this.toggleTabPinStatus(e)) : (this.log("🔧 中键关闭标签页"), this.closeTab(e)));
    }), t.addEventListener("keydown", (s) => {
      (s.target === t || t.contains(s.target)) && (s.key === "F2" ? (s.preventDefault(), s.stopPropagation(), this.renameTab(e)) : s.ctrlKey && s.key === "w" && (s.preventDefault(), s.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), this.addLongPressTabListEvents(t, e), t.draggable = !0, t.addEventListener("dragstart", (s) => {
      var u, h;
      const l = s.target;
      if (l.closest && l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        s.preventDefault();
        return;
      }
      if (l.classList.contains("drag-handle") || l.closest && l.closest(".drag-handle")) {
        s.preventDefault();
        return;
      }
      s.dataTransfer.effectAllowed = "move", s.dataTransfer.dropEffect = "move", (u = s.dataTransfer) == null || u.setData("text/plain", e.blockId);
      const d = document.createElement("img");
      d.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", d.style.opacity = "0";
      try {
        const g = t.getBoundingClientRect(), p = s.clientX - g.left, m = s.clientY - g.top;
        (h = s.dataTransfer) == null || h.setDragImage(d, p, m);
      } catch {
      }
      this.draggingTab = e, this.dragOverTab = null, this.lastSwapKey = "", this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (this.verboseLog("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), this.verboseLog("🔄 拖拽开始，设置draggingTab:", e.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), requestAnimationFrame(() => {
        t.style.opacity = "0", t.style.pointerEvents = "none";
      }), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", async (s) => {
      this.verboseLog("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (this.verboseLog("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback();
      const l = this.getCurrentPanelTabs();
      await this.setCurrentPanelTabs(l), this.draggingTab = null, this.dragOverTab = null, this.lastSwapKey = "", this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (s) => {
      const l = s.target;
      if (!l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        if (this.tabContainer && !this.tabContainer.contains(l)) {
          s.dataTransfer.dropEffect = "none";
          return;
        }
        if (!(l.classList.contains("close-button") || l.classList.contains("new-tab-button") || l.classList.contains("drag-handle") || l.classList.contains("resize-handle") || l.classList.contains("tab-icon")) && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
          if (this.draggingTab.isPinned !== e.isPinned) {
            s.dataTransfer.dropEffect = "none";
            return;
          }
          s.preventDefault(), s.stopPropagation(), s.dataTransfer.dropEffect = "move";
          const d = t.getBoundingClientRect(), u = this.isVerticalMode && !this.isFixedToTop;
          let h;
          if (u) {
            const p = d.top + d.height / 2;
            h = s.clientY < p ? "before" : "after";
          } else {
            const p = d.left + d.width / 2;
            h = s.clientX < p ? "before" : "after";
          }
          this.updateDropIndicator(t, h), this.dragOverTab = e;
          const g = `${e.blockId}-${h}`;
          this.lastSwapKey !== g && (this.lastSwapKey = g, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
            await this.swapTabsRealtime(e, this.draggingTab, h);
          }, 100)), this.verboseLog(`🔄 拖拽经过: ${e.title} (位置: ${h})`);
        }
      }
    }), t.addEventListener("dragenter", (s) => {
      if (!s.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (this.draggingTab.isPinned !== e.isPinned)
          return;
        s.preventDefault(), s.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`);
      }
    }), t.addEventListener("dragleave", (s) => {
      const l = t.getBoundingClientRect(), d = s.clientX, u = s.clientY, h = 5;
      (d < l.left - h || d > l.right + h || u < l.top - h || u > l.bottom + h) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (s) => {
      var d;
      s.preventDefault(), s.stopPropagation();
      const l = (d = s.dataTransfer) == null ? void 0 : d.getData("text/plain");
      this.log(`🔄 拖拽放置完成: ${l} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return la(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const a = parseInt(t[1], 16), i = parseInt(t[2], 16), n = parseInt(t[3], 16);
      return (0.299 * a + 0.587 * i + 0.114 * n) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (a) {
      let i = parseInt(a[1], 16), n = parseInt(a[2], 16), o = parseInt(a[3], 16);
      i = Math.floor(i * (1 - t)), n = Math.floor(n * (1 - t)), o = Math.floor(o * (1 - t));
      const c = i.toString(16).padStart(2, "0"), s = n.toString(16).padStart(2, "0"), l = o.toString(16).padStart(2, "0");
      return `#${c}${s}${l}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, a) {
    const i = e / 255, n = t / 255, o = a / 255, c = (ie) => ie <= 0.04045 ? ie / 12.92 : Math.pow((ie + 0.055) / 1.055, 2.4), s = c(i), l = c(n), d = c(o), u = s * 0.4124564 + l * 0.3575761 + d * 0.1804375, h = s * 0.2126729 + l * 0.7151522 + d * 0.072175, g = s * 0.0193339 + l * 0.119192 + d * 0.9503041, p = 0.2104542553 * u + 0.793617785 * h - 0.0040720468 * g, m = 1.9779984951 * u - 2.428592205 * h + 0.4505937099 * g, b = 0.0259040371 * u + 0.7827717662 * h - 0.808675766 * g, f = Math.cbrt(p), y = Math.cbrt(m), w = Math.cbrt(b), x = 0.2104542553 * f + 0.793617785 * y + 0.0040720468 * w, T = 1.9779984951 * f - 2.428592205 * y + 0.4505937099 * w, S = 0.0259040371 * f + 0.7827717662 * y - 0.808675766 * w, C = Math.sqrt(T * T + S * S), M = Math.atan2(S, T) * 180 / Math.PI, V = M < 0 ? M + 360 : M;
    return { l: x, c: C, h: V };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, a) {
    const i = a * Math.PI / 180, n = t * Math.cos(i), o = t * Math.sin(i), c = e, s = n, l = o, d = c * c * c, u = s * s * s, h = l * l * l, g = 1.0478112 * d + 0.0228866 * u - 0.050217 * h, p = 0.0295424 * d + 0.9904844 * u + 0.0170491 * h, m = -92345e-7 * d + 0.0150436 * u + 0.7521316 * h, b = 3.2404542 * g - 1.5371385 * p - 0.4985314 * m, f = -0.969266 * g + 1.8760108 * p + 0.041556 * m, y = 0.0556434 * g - 0.2040259 * p + 1.0572252 * m, w = (C) => C <= 31308e-7 ? 12.92 * C : 1.055 * Math.pow(C, 1 / 2.4) - 0.055, x = Math.max(0, Math.min(255, Math.round(w(b) * 255))), T = Math.max(0, Math.min(255, Math.round(w(f) * 255))), S = Math.max(0, Math.min(255, Math.round(w(y) * 255)));
    return { r: x, g: T, b: S };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return Ba(e, t);
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
      this.verboseLog(`🔄 开始切换标签: ${e.title} (ID: ${e.blockId})`), this.isSwitchingTab = !0;
      const t = this.getCurrentActiveTab();
      t && (this.recordScrollPosition(t), this.lastActiveBlockId = t.blockId, this.verboseLog(`🎯 记录切换前的激活标签: ${t.title} (ID: ${t.blockId})`), this.recordTabSwitchHistory(t.blockId, e));
      const a = this.getPanelIds();
      let i = "";
      if (e.panelId && a.includes(e.panelId) ? i = e.panelId : this.currentPanelId && a.includes(this.currentPanelId) ? i = this.currentPanelId : a.length > 0 && (i = a[0]), !i) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const n = a.indexOf(i);
      n !== -1 ? (this.currentPanelIndex = n, this.currentPanelId = i) : this.warn(`⚠️ 目标面板 ${i} 不在面板列表中`), this.verboseLog(`🎯 目标面板ID: ${i}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(i);
      } catch (o) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", o);
      }
      try {
        this.verboseLog(`🚀 尝试使用安全导航到块 ${e.blockId}`), await this.safeNavigate(e.blockId, i, e), this.verboseLog("✅ 安全导航成功");
      } catch (o) {
        this.warn("导航失败，尝试备用方法:", o);
        const c = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (c)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), c.click();
        else {
          this.error("无法找到目标块元素:", e.blockId);
          const s = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          s ? (this.log("🔄 找到备用块元素，尝试点击"), s.click()) : this.error("完全无法找到目标块元素");
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
    const t = this.getCurrentPanelTabs(), a = t.findIndex((n) => n.blockId === e.blockId);
    if (a === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let i = -1;
    if (a === 0 ? i = 1 : a === t.length - 1 ? i = a - 1 : i = a + 1, i >= 0 && i < t.length) {
      const n = t[i];
      this.log(`🔄 自动切换到相邻标签: "${n.title}" (位置: ${i})`), this.currentPanelId && await this.safeNavigate(n.blockId, this.currentPanelId || "", n);
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), a = ka(e, t, {
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
        const n = this.showInHeadbar;
        this.showInHeadbar = a.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${n ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (a.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = a.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), a.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const n = this.enableWorkspaces;
        this.enableWorkspaces = a.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${n ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.enableWorkspaces || this.removeWorkspaceButton(), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
      if (a.debugMode !== this.lastSettings.debugMode && (a.debugMode ? this.setLogLevel($.VERBOSE) : this.setLogLevel($.INFO), this.storageService.saveConfig(k.DEBUG_MODE, a.debugMode, this.pluginName).catch((n) => {
        this.error("保存调试模式设置失败:", n);
      }), this.lastSettings.debugMode = a.debugMode), a.restoreFocusedTab !== this.lastSettings.restoreFocusedTab) {
        const n = this.restoreFocusedTab;
        this.restoreFocusedTab = a.restoreFocusedTab, this.log(`🎯 设置变化：刷新后恢复聚焦标签页 ${n ? "开启" : "关闭"} -> ${this.restoreFocusedTab ? "开启" : "关闭"}`), this.storageService.saveConfig(k.RESTORE_FOCUSED_TAB, a.restoreFocusedTab, this.pluginName).catch((o) => {
          this.error("保存聚焦标签页恢复设置失败:", o);
        }), this.lastSettings.restoreFocusedTab = this.restoreFocusedTab;
      }
      const i = a.enableMiddleClickPin !== void 0 ? a.enableMiddleClickPin : a.enableDoubleClickClose;
      if (i !== void 0 && i !== this.lastSettings.enableMiddleClickPin) {
        const n = !!i;
        this.enableMiddleClickPin = a.enableMiddleClickPin, this.enableDoubleClickClose = n, this.storageService.saveConfig(k.ENABLE_MIDDLE_CLICK_PIN, n, this.pluginName).catch((o) => this.error("保存中键固定设置失败:", o)), this.storageService.saveConfig(k.ENABLE_DOUBLE_CLICK_CLOSE, n, this.pluginName).catch((o) => this.error("保存双击关闭设置失败:", o)), this.lastSettings.enableMiddleClickPin = n, (t = this.updateFeatureToggleButton) == null || t.call(this);
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
              a(), this.getTabInfo(e.toString(), this.currentPanelId || "" || "", 0).then((n) => {
                n ? this.showAddToTabGroupDialog(n) : orca.notify("error", "无法获取块信息");
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
      const n = this.getCurrentActiveTab();
      let o = a.length;
      if (this.log(`📊 当前标签数量: ${a.length}, 标签列表: ${a.map((c) => c.title).join(", ")}`), this.addNewTabToEnd)
        o = a.length, this.log(`🎯 [一次性] 将新标签添加到末尾: "${i.title}", 插入位置: ${o}`), this.addNewTabToEnd = !1, this.log("♻️ 已重置标志，后续新标签将在聚焦标签后插入");
      else if (n) {
        const c = a.findIndex((s) => s.blockId === n.blockId);
        c !== -1 && (o = c + 1, this.log(`🎯 将在聚焦标签 "${n.title}" 后面插入新标签: "${i.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (a.length >= this.maxTabs) {
        a.splice(o, 0, i), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${i.title}`);
        const c = this.findLastNonPinnedTabIndex();
        if (c !== -1) {
          const s = a[c];
          a.splice(c, 1), this.log(`🗑️ 删除末尾的非固定标签: "${s.title}" 来保持数量限制`), a.forEach((l, d) => {
            l.order = d;
          });
        } else {
          const s = a.findIndex((l) => l.blockId === i.blockId);
          if (s !== -1) {
            a.splice(s, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${i.title}"`);
            return;
          }
        }
      } else
        a.splice(o, 0, i), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${i.title}`);
      a.forEach((c, s) => {
        c.order = s;
      }), this.log(`🔄 已重新计算标签顺序: ${a.map((c) => `${c.title}(${c.order})`).join(", ")}`), this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 创建新标签页，实时更新工作区: ${i.title}`)), await this.safeNavigate(e, this.currentPanelId || "", i), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${i.title}"`);
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
      var n, o;
      const a = (n = this.tabContainer) == null ? void 0 : n.querySelectorAll(".orca-tabs-plugin .orca-tab");
      a == null || a.forEach((c) => c.removeAttribute("data-focused"));
      const i = (o = this.tabContainer) == null ? void 0 : o.querySelector(`[data-tab-id="${e}"]`);
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
      const n = i.find((l) => l.blockId === e);
      if (n)
        return this.verboseLog(`📋 [DEBUG] ❌ 块 ${e} 已存在于标签页中: "${n.title}"`), this.closedTabs.has(e) && (this.verboseLog(`📋 [DEBUG] 从closedTabs中移除 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.verboseLog(`📋 [DEBUG] 切换到已存在标签: "${n.title}"`), await this.switchToTab(n), await this.focusTabElementById(n.blockId), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（已存在）=========="), !0;
      this.verboseLog(`📋 [DEBUG] ✅ 块 ${e} 不存在，准备创建新标签`), this.creatingTabs.has(e) ? this.verboseLog(`📋 [DEBUG] ℹ️ 块 ${e} 已在 creatingTabs 中（可能来自 Ctrl+点击）`) : (this.verboseLog(`📋 [DEBUG] 🔒 将块 ${e} 添加到 creatingTabs 集合，防止重复处理`), this.creatingTabs.add(e));
      let o = null;
      try {
        if (!orca.state.blocks[parseInt(e)])
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法找到块 ${e}`), this.warn(`无法找到块 ${e}`), !1;
        if (this.verboseLog("📋 [addTabToPanel] 找到块信息"), this.verboseLog("📋 [addTabToPanel] 获取标签信息..."), o = await this.getTabInfo(e, this.currentPanelId || "", i.length), !o)
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法获取块 ${e} 的标签信息`), this.warn(`无法获取块 ${e} 的标签信息`), !1;
        this.verboseLog(`📋 [addTabToPanel] 标签信息: "${o.title}" (类型: ${o.blockType})`);
      } finally {
        this.verboseLog(`📋 [DEBUG] 🔓 从 creatingTabs 集合中移除块 ${e}`), this.creatingTabs.delete(e);
      }
      let c = i.length, s = !1;
      if (this.verboseLog(`📋 [addTabToPanel] 插入模式: ${t}`), t === "replace") {
        this.verboseLog("📋 [addTabToPanel] 替换模式 - 获取当前聚焦标签");
        const l = this.getCurrentActiveTab();
        if (!l)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 没有找到当前聚焦的标签"), this.warn("没有找到当前聚焦的标签"), !1;
        this.verboseLog(`📋 [addTabToPanel] 聚焦标签: "${l.title}" (${l.blockId})`);
        const d = i.findIndex((u) => u.blockId === l.blockId);
        if (d === -1)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 无法找到聚焦标签在数组中的位置"), this.warn("无法找到聚焦标签在数组中的位置"), !1;
        l.isPinned ? (this.verboseLog("📋 [addTabToPanel] 聚焦标签是固定的，改为插入模式"), this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), c = d + 1, s = !1) : (this.verboseLog(`📋 [addTabToPanel] 将替换位置 ${d} 的标签`), c = d, s = !0);
      } else if (t === "after") {
        this.verboseLog("📋 [addTabToPanel] After模式 - 在聚焦标签后插入");
        const l = this.getCurrentActiveTab();
        if (l) {
          this.verboseLog(`📋 [addTabToPanel] 找到聚焦标签: "${l.title}" (${l.blockId})`);
          const d = i.findIndex((u) => u.blockId === l.blockId);
          d !== -1 ? (c = d + 1, this.verboseLog(`📋 [addTabToPanel] 将在位置 ${c} 插入（聚焦标签后面）`), this.log("📌 在聚焦标签后面插入新标签")) : this.verboseLog("📋 [addTabToPanel] 警告 - 聚焦标签不在列表中，使用默认位置");
        } else
          this.verboseLog("📋 [addTabToPanel] 警告 - 没有找到聚焦标签，使用默认位置");
      }
      if (this.verboseLog(`📋 [addTabToPanel] 最终插入位置: ${c}, 替换模式: ${s}`), i.length >= this.maxTabs)
        if (this.verboseLog(`📋 [addTabToPanel] 已达到标签上限 ${this.maxTabs}`), s)
          this.verboseLog(`📋 [addTabToPanel] 替换位置 ${c} 的标签`), i[c] = o;
        else {
          this.verboseLog("📋 [addTabToPanel] 插入新标签并删除最后一个非固定标签"), i.splice(c, 0, o);
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
        this.verboseLog(`📋 [addTabToPanel] 标签数量未达到上限，直接${s ? "替换" : "插入"}`), s ? i[c] = o : i.splice(c, 0, o);
      return this.verboseLog(`📋 [addTabToPanel] 插入后标签列表: ${i.map((l) => `${l.title}(${l.blockId})`).join(", ")}`), this.verboseLog("📋 [DEBUG] 同步更新存储数组..."), this.syncCurrentTabsToStorage(i), this.verboseLog("📋 [DEBUG] 保存标签数据..."), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (this.verboseLog(`📋 [DEBUG] 更新工作区: ${this.currentWorkspace}`), await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${o.title}`)), this.verboseLog("📋 [DEBUG] 更新UI..."), await this.updateTabsUI(), a ? (this.verboseLog(`📋 [DEBUG] 开始导航到块 ${e}`), await this.safeNavigate(e, this.currentPanelId || "", o)) : this.verboseLog("📋 [DEBUG] 跳过导航（后台打开模式）"), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（成功）=========="), !0;
    } catch (i) {
      return this.error("[DEBUG] ❌ addTabToPanel 出错:", i), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（失败）=========="), !1;
    }
  }
  /**
   * 统一的导航方法，确保所有导航都设置 isNavigating 标志
   * @param blockId 要导航到的块ID
   * @param panelId 目标面板ID
   * @param tab 可选的标签信息，用于判断是否为日期块
   */
  async safeNavigate(e, t, a) {
    this.isNavigating = !0, this.lastNavigatedBlockId = e, this.lastNavigationTime = Date.now(), this.verboseLog(`🚀 [safeNavigate] 开始导航到块 ${e}，设置 isNavigating = true`);
    try {
      if (a && (a.isJournal || a.blockType === "journal")) {
        this.verboseLog(`📅 [safeNavigate] 检测到日期块，使用 journal 导航: ${a.title}`);
        const i = this.extractDateFromTitle(a.title);
        if (i)
          try {
            await orca.nav.goTo("journal", { date: i }, t), this.verboseLog(`✅ [safeNavigate] 使用 journal 导航成功: ${i.toLocaleDateString()}`);
            return;
          } catch (n) {
            this.warn("⚠️ [safeNavigate] journal 导航失败，回退到块导航:", n);
          }
        else
          this.verboseLog(`⚠️ [safeNavigate] 无法从标题提取日期: "${a.title}"，回退到块导航`);
      }
      await orca.nav.goTo("block", { blockId: parseInt(e) }, t), this.verboseLog("✅ [safeNavigate] 使用 block 导航成功");
    } catch (i) {
      throw this.error("❌ [safeNavigate] 导航失败:", i), i;
    } finally {
      setTimeout(() => {
        this.isNavigating = !1, this.verboseLog("🏁 [safeNavigate] 设置 isNavigating = false");
      }, 500);
    }
  }
  /**
   * 从标题中提取日期
   * 支持多种日期格式，确保兼容性
   */
  extractDateFromTitle(e) {
    try {
      if (e.includes("今天") || e.includes("Today")) {
        const l = /* @__PURE__ */ new Date();
        return new Date(l.getFullYear(), l.getMonth(), l.getDate());
      } else if (e.includes("昨天") || e.includes("Yesterday")) {
        const l = /* @__PURE__ */ new Date();
        return new Date(l.getFullYear(), l.getMonth(), l.getDate() - 1);
      } else if (e.includes("明天") || e.includes("Tomorrow")) {
        const l = /* @__PURE__ */ new Date();
        return new Date(l.getFullYear(), l.getMonth(), l.getDate() + 1);
      }
      const t = e.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (t) {
        const l = parseInt(t[1]), d = parseInt(t[2]) - 1, u = parseInt(t[3]), h = new Date(l, d, u);
        if (!isNaN(h.getTime()))
          return h;
      }
      const a = e.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (a) {
        const l = parseInt(a[1]), d = parseInt(a[2]) - 1, u = parseInt(a[3]), h = new Date(l, d, u);
        if (!isNaN(h.getTime()))
          return h;
      }
      const i = e.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (i) {
        const l = parseInt(i[1]) - 1, d = parseInt(i[2]), u = parseInt(i[3]), h = new Date(u, l, d);
        if (!isNaN(h.getTime()))
          return h;
      }
      const n = e.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (n) {
        const l = parseInt(n[1]), d = parseInt(n[2]) - 1, u = parseInt(n[3]);
        if (!i) {
          const h = new Date(u, d, l);
          if (!isNaN(h.getTime()))
            return h;
        }
      }
      const o = e.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
      if (o) {
        const l = parseInt(o[1]), d = parseInt(o[2]) - 1, u = parseInt(o[3]), h = new Date(l, d, u);
        if (!isNaN(h.getTime()))
          return h;
      }
      const c = e.match(/(\d{4})(\d{2})(\d{2})/);
      if (c) {
        const l = parseInt(c[1]), d = parseInt(c[2]) - 1, u = parseInt(c[3]), h = new Date(l, d, u);
        if (!isNaN(h.getTime()))
          return h;
      }
      const s = e.match(/(\d{1,2})月(\d{1,2})日/);
      if (s) {
        const d = (/* @__PURE__ */ new Date()).getFullYear(), u = parseInt(s[1]) - 1, h = parseInt(s[2]), g = new Date(d, u, h);
        if (!isNaN(g.getTime()))
          return g;
      }
      return null;
    } catch (t) {
      return this.warn("从标题提取日期失败:", t), null;
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
      this.verboseLog(`🔗 [DEBUG] 当前标签页数量: ${t.length}`), this.verboseLog("🔗 [DEBUG] 当前标签页列表:"), t.forEach((n, o) => {
        this.verboseLog(`🔗 [DEBUG]   [${o}] ${n.title} (ID: ${n.blockId}, 固定: ${n.isPinned})`);
      });
      const a = t.find((n) => n.blockId === e);
      if (a) {
        this.verboseLog(`🔗 [DEBUG] ❌ 块 ${e} 已存在，标签: "${a.title}"，无需操作`), this.closedTabs.has(e) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.creatingTabs.has(e) && (this.verboseLog(`🔓 [DEBUG] 从 creatingTabs 中移除 ${e}（已存在）`), this.creatingTabs.delete(e)), this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成（已存在）==========");
        return;
      }
      if (this.verboseLog(`🔗 [DEBUG] ✅ 块 ${e} 不存在，准备在后台创建新标签页`), this.closedTabs.has(e) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.verboseLog(`🔗 [DEBUG] 调用 addTabToPanel(blockId: ${e}, mode: 'after', navigate: false)`), await this.addTabToPanel(e, "after", !1)) {
        this.verboseLog("🔗 [DEBUG] ✅ 成功在后台创建新标签页");
        const n = this.getCurrentPanelTabs();
        this.verboseLog(`🔗 [DEBUG] 更新后标签页数量: ${n.length}`);
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
        const n = i.classList;
        if (n.contains("orca-inline-r-content") || n.contains("orca-ref") || n.contains("block-ref") || n.contains("block-reference") || n.contains("orca-fragment-r") || n.contains("fragment-r") || n.contains("orca-block-reference") || i.tagName.toLowerCase() === "a" && ((t = i.getAttribute("href")) != null && t.startsWith("#"))) {
          const c = i.getAttribute("data-block-id") || i.getAttribute("data-ref-id") || i.getAttribute("data-blockid") || i.getAttribute("data-target-block-id") || i.getAttribute("data-fragment-v") || i.getAttribute("data-v") || ((a = i.getAttribute("href")) == null ? void 0 : a.replace("#", "")) || i.getAttribute("data-id");
          if (c && !isNaN(parseInt(c)))
            return this.log(`🔗 从元素中提取到块引用ID: ${c}`), c;
        }
        const o = i.dataset;
        for (const [c, s] of Object.entries(o))
          if ((c.toLowerCase().includes("block") || c.toLowerCase().includes("ref")) && s && !isNaN(parseInt(s)))
            return this.log(`🔗 从data属性 ${c} 中提取到块引用ID: ${s}`), s;
        i = i.parentElement;
      }
      if (e.textContent) {
        const n = e.textContent.trim(), o = n.match(/\[\[(?:块)?(\d+)\]\]/) || n.match(/block[:\s]*(\d+)/i);
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
    return sa(e, t, a, i);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(t, orca.state.panels);
      if (a && a.viewState) {
        let i = null;
        const n = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (n) {
          const o = n.closest(".orca-panel");
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
          const c = this.getCurrentPanelTabs().findIndex((s) => s.blockId === e.blockId);
          c !== -1 && (this.getCurrentPanelTabs()[c].scrollPosition = o, await this.saveCurrentPanelTabs()), this.verboseLog(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, o, "容器:", i.className);
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
      const a = this.getCurrentPanelTabs(), i = a.findIndex((s) => s.blockId === e);
      if (i === -1) {
        this.verboseLog(`⚠️ 未找到要替换的标签: ${e}`);
        return;
      }
      const n = this.getCurrentActiveTab(), o = n && n.blockId === e, c = a[i];
      a[i] = t, this.verboseLog(`🔄 替换标签页: "${c.title}" -> "${t.title}"`), await this.setCurrentPanelTabs(a), await this.immediateUpdateTabsUI(), o && (this.verboseLog(`🎯 重新聚焦到替换后的标签: ${t.title}`), this.isNavigating = !0, await new Promise((s) => setTimeout(s, 50)), await this.switchToTab(t), setTimeout(() => {
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
    let a = null, i = null, n = 0, o = !1;
    const c = {
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
      if (!(d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle"))) {
        if (e.hasAttribute("data-renaming")) {
          this.verboseLog(`✏️ 标签 ${t.title} 正在重命名，不启用长按切换列表`);
          return;
        }
        o = !0, this.verboseLog(`🖱️ 开始长按标签: ${t.title}`), a = window.setTimeout(async () => {
          if (o) {
            if (t.isPinned) {
              this.verboseLog(`📌 标签 ${t.title} 已置顶，不显示长按列表`);
              return;
            }
            if (e.hasAttribute("data-renaming")) {
              this.verboseLog(`✏️ 标签 ${t.title} 正在重命名，取消长按切换列表`);
              return;
            }
            e.setAttribute("data-long-pressed", "true");
            try {
              this.verboseLog("⏰ 长按触发，开始检查切换历史");
              const h = (await this.tabStorageService.restoreRecentTabSwitchHistory()).global_tab_history;
              if (this.verboseLog(`📋 全局切换历史记录: ${h ? h.recentTabs.length : 0} 个记录`), !h || h.recentTabs.length === 0) {
                this.verboseLog("⚠️ 没有全局切换历史记录，不显示悬浮列表");
                return;
              }
              const g = h.recentTabs;
              this.verboseLog(`📋 去重后的历史记录: ${g.length} 个记录`);
              const p = this.getCurrentPanelTabs(), m = new Set(p.map((T) => T.blockId)), b = g.filter((T) => !m.has(T.blockId));
              if (this.verboseLog(`📋 过滤后的历史记录: ${b.length} 个记录（已过滤 ${g.length - b.length} 个已打开的标签）`), b.length === 0) {
                this.verboseLog("⚠️ 过滤后没有可显示的历史记录，不显示悬浮列表");
                return;
              }
              const f = e.getBoundingClientRect(), y = {
                x: f.left,
                y: f.bottom + 4
                // 在标签下方显示
              };
              this.verboseLog(`📍 计算悬浮位置: x=${y.x}, y=${y.y}`), this.verboseLog(`📊 标签尺寸: width=${f.width}, height=${f.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
              const w = (T) => {
                this.verboseLog(`🖱️ 点击悬浮标签: ${T.title}`), this.getCurrentPanelTabs().find((M) => M.blockId === T.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${T.title}`), this.recordTabSwitchHistory(t.blockId, T), this.switchToTab(T)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${T.title}`), this.replaceCurrentTabWith(t.blockId, T)), W();
              };
              i = we(
                b,
                y,
                c,
                w,
                this.isVerticalMode
              ), this.verboseLog("✅ 悬浮标签列表创建完成"), c.enableScroll && b.length > c.maxDisplayCount && this.addScrollEvents(i, b, c, n, w);
              const x = (T) => {
                const S = T.target;
                this.safeClosest(S, ".hover-tab-list-container") || (W(), i = null, n = 0, document.removeEventListener("click", x));
              };
              setTimeout(() => {
                document.addEventListener("click", x);
              }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${b.length} 个历史标签`);
            } catch (u) {
              this.warn("显示悬浮标签列表失败:", u);
            }
          }
        }, 500);
      }
    }), e.addEventListener("mouseup", () => {
      a && (clearTimeout(a), a = null), o = !1;
    }), e.addEventListener("mouseleave", () => {
      a && (clearTimeout(a), a = null), o = !1;
    });
    const s = () => {
      setTimeout(() => {
        W(), i = null, n = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container");
    }), document.addEventListener("mouseleave", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && s();
    });
  }
  /**
   * 添加悬浮标签列表事件
   */
  addHoverTabListEvents(e, t) {
    let a = null, i = null, n = 0;
    const o = {
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
          const d = await this.tabStorageService.restoreRecentTabSwitchHistory(), u = [];
          if (Object.values(d).forEach((T) => {
            T.recentTabs && u.push(...T.recentTabs);
          }), this.verboseLog(`📋 所有切换历史记录: ${u.length} 个记录`), u.length === 0) {
            this.verboseLog("⚠️ 没有切换历史记录，不显示悬浮列表");
            return;
          }
          const h = /* @__PURE__ */ new Map();
          u.forEach((T) => {
            h.set(T.blockId, T);
          });
          const g = Array.from(h.values());
          this.verboseLog(`📋 去重后的历史记录: ${g.length} 个记录`);
          const p = this.getCurrentPanelTabs(), m = new Set(p.map((T) => T.blockId)), b = g.filter((T) => !m.has(T.blockId));
          if (this.verboseLog(`📋 过滤后的历史记录: ${b.length} 个记录（已过滤 ${g.length - b.length} 个已打开的标签）`), b.length === 0) {
            this.verboseLog("⚠️ 过滤后没有可显示的历史记录，不显示悬浮列表");
            return;
          }
          const f = e.getBoundingClientRect(), y = {
            x: f.left,
            y: f.bottom + 4
            // 在标签下方显示
          };
          this.verboseLog(`📍 计算悬浮位置: x=${y.x}, y=${y.y}`), this.verboseLog(`📊 标签尺寸: width=${f.width}, height=${f.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
          const w = (T) => {
            this.verboseLog(`🖱️ 点击悬浮标签: ${T.title}`), this.getCurrentPanelTabs().find((M) => M.blockId === T.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${T.title}`), this.recordTabSwitchHistory(t.blockId, T), this.switchToTab(T)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${T.title}`), this.replaceCurrentTabWith(t.blockId, T)), W();
          };
          i = we(
            b,
            y,
            o,
            w,
            this.isVerticalMode
          ), this.verboseLog("✅ 悬浮标签列表创建完成"), o.enableScroll && b.length > o.maxDisplayCount && this.addScrollEvents(i, b, o, n, w);
          const x = (T) => {
            const S = T.target;
            this.safeClosest(S, ".hover-tab-list-container") || (W(), i = null, n = 0, document.removeEventListener("click", x));
          };
          setTimeout(() => {
            document.addEventListener("click", x);
          }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${b.length} 个历史标签`);
        } catch (d) {
          this.warn("显示悬浮标签列表失败:", d);
        }
      }, 500);
    }), e.addEventListener("mouseleave", () => {
      a && (clearTimeout(a), a = null), a = window.setTimeout(() => {
        W(), i = null, n = 0;
      }, 200);
    });
    const c = () => {
      a && (clearTimeout(a), a = null);
    }, s = () => {
      a = window.setTimeout(() => {
        W(), i = null, n = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && c();
    }), document.addEventListener("mouseleave", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && s();
    });
  }
  /**
   * 添加滚动事件
   */
  addScrollEvents(e, t, a, i, n) {
    const o = e.querySelector(".hover-tab-list-scroll");
    if (!o) return;
    let c = !1;
    o.addEventListener("wheel", (s) => {
      if (s.preventDefault(), c) return;
      c = !0;
      const l = s.deltaY > 0 ? a.scrollStep : -a.scrollStep, d = Math.max(0, Math.min(i + l, t.length - a.maxDisplayCount));
      d !== i && (i = d, de(e, t, a, n, this.isVerticalMode, i)), setTimeout(() => {
        c = !1;
      }, 100);
    }), e.addEventListener("keydown", (s) => {
      if (s.key === "ArrowUp" || s.key === "ArrowDown") {
        s.preventDefault();
        const l = s.key === "ArrowDown" ? a.scrollStep : -a.scrollStep, d = Math.max(0, Math.min(i + l, t.length - a.maxDisplayCount));
        d !== i && (i = d, de(e, t, a, n, this.isVerticalMode, i));
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
      const n = (o = 1) => {
        if (o > 5) {
          this.warn(`恢复标签 "${e.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let c = null;
        const s = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (s) {
          const l = s.closest(".orca-panel");
          l && (c = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!c) {
          const l = document.querySelector(".orca-panel.active");
          l && (c = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        c || (c = document.body.scrollTop > 0 ? document.body : document.documentElement), c ? (c.scrollLeft = t.x, c.scrollTop = t.y, this.verboseLog(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", c.className, `尝试${o}`)) : setTimeout(() => n(o + 1), 200 * o);
      };
      n(), setTimeout(() => n(2), 100), setTimeout(() => n(3), 300);
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
    ].forEach((n) => {
      document.querySelectorAll(n).forEach((c, s) => {
        const l = c;
        (l.scrollTop > 0 || l.scrollLeft > 0) && this.log(`容器 ${n}[${s}]:`, {
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
        const o = document.querySelector(`.orca-panel[data-panel-id="${e.panelId}"]`);
        o && (t = o);
      }
      if (t || (t = document.querySelector(".orca-panel.active")), !t) return !1;
      const a = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!a) return !1;
      const n = a.getAttribute("data-block-id") === e.blockId;
      return n && this.closedTabs.has(e.blockId) ? (this.verboseLog(`🔍 标签 ${e.title} 在已关闭列表中，不认为是激活状态`), !1) : n;
    } catch (t) {
      return this.warn("检查标签激活状态时出错:", t), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    var c;
    const e = this.enableWorkspaces ? this.getCurrentPanelTabs() : this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    const t = (c = this.tabContainer) == null ? void 0 : c.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (t) {
      const s = t.getAttribute("data-tab-id");
      if (s) {
        const l = e.find((d) => d.blockId === s);
        if (l)
          return this.verboseLog(`🎯 找到UI聚焦标签: ${l.title} (ID: ${s})`), this.enableWorkspaces && this.currentWorkspace && this.updateCurrentWorkspaceActiveIndex(l), l;
      }
    }
    let a = null;
    if (this.currentPanelId && (a = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`)), a || (a = document.querySelector(".orca-panel.active")), !a)
      return this.verboseLog("⚠️ 无法找到目标面板"), null;
    const i = a.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!i)
      return this.verboseLog("⚠️ 目标面板中没有找到可见的块编辑器"), null;
    const n = i.getAttribute("data-block-id");
    if (!n)
      return this.verboseLog("⚠️ 块编辑器没有 data-block-id 属性"), null;
    const o = e.find((s) => s.blockId === n) || null;
    return o ? this.verboseLog(`🎯 根据DOM块编辑器找到激活标签: ${o.title} (ID: ${n})`) : this.verboseLog(`⚠️ 在标签列表中找不到块ID ${n} 对应的标签`), this.enableWorkspaces && this.currentWorkspace && o && this.updateCurrentWorkspaceActiveIndex(o), o;
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
    const a = t.findIndex((n) => n.blockId === e.blockId);
    if (a !== -1) {
      const n = this.getCurrentActiveTab(), o = n && n.blockId === e.blockId, c = o ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const d = { ...e, closedAt: Date.now() }, u = this.recentlyClosedTabs.findIndex((h) => h.blockId === e.blockId);
        u !== -1 && this.recentlyClosedTabs.splice(u, 1), this.recentlyClosedTabs.unshift(d), this.recentlyClosedTabs.length > 10 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 10)), await this.saveRecentlyClosedTabs();
      }
      const s = (i = this.tabContainer) == null ? void 0 : i.querySelector(`[data-tab-id="${e.blockId}"]`), l = s == null ? void 0 : s.getAttribute("data-tab-history-id");
      l && await this.deleteTabSwitchHistory(l), t.splice(a, 1), this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`)), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), o && c ? (this.log(`🔄 自动切换到相邻标签: "${c.title}"`), await this.switchToTab(c)) : o && !c && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const e = this.getCurrentPanelTabs();
    e.filter((n) => !n.isPinned).forEach((n) => {
      this.closedTabs.add(n.blockId);
    });
    const a = e.filter((n) => n.isPinned), i = e.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${i} 个标签，保留了 ${a.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(e) {
    const t = this.getCurrentPanelTabs(), a = t.filter(
      (o) => o.blockId === e.blockId || o.isPinned
    );
    t.filter(
      (o) => o.blockId !== e.blockId && !o.isPinned
    ).forEach((o) => {
      this.closedTabs.add(o.blockId);
    });
    const n = t.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${n} 个标签，保留了当前标签和固定标签`);
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
    const i = t.textContent, n = t.style.cssText, o = t.draggable;
    t.draggable = !1, t.setAttribute("data-renaming", "true");
    const c = document.createElement("input");
    c.type = "text", c.value = e.title, c.className = "inline-rename-input";
    let s = "var(--orca-color-text-1)", l = "";
    e.color && (l = `--tab-color: ${e.color.startsWith("#") ? e.color : `#${e.color}`};`, s = "var(--orca-tab-colored-text)"), c.style.cssText = `
      ${l}
      background: transparent;
      color: ${s};
      border: none;
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      font-weight: 600;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, t.textContent = "", t.appendChild(c), t.style.padding = "2px 8px", c.focus(), c.select();
    const d = async () => {
      const h = c.value.trim();
      if (h && h !== e.title) {
        await this.updateTabTitle(e, h), t.draggable = o, t.removeAttribute("data-renaming");
        return;
      }
      t.textContent = i, t.style.cssText = n, t.draggable = o, t.removeAttribute("data-renaming");
    }, u = () => {
      t.textContent = i, t.style.cssText = n, t.draggable = o, t.removeAttribute("data-renaming");
    };
    c.addEventListener("blur", d), c.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), d()) : h.key === "Escape" && (h.preventDefault(), u());
    }), c.addEventListener("click", (h) => {
      h.stopPropagation();
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
    const n = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let o = { x: "50%", y: "50%" };
    if (n) {
      const u = n.getBoundingClientRect(), h = window.innerWidth, g = window.innerHeight, p = 300, m = 100, b = 20;
      let f = u.left, y = u.top - m - 10;
      f + p > h - b && (f = h - p - b), f < b && (f = b), y < b && (y = u.bottom + 10, y + m > g - b && (y = (g - m) / 2)), y + m > g - b && (y = g - m - b), f = Math.max(b, Math.min(f, h - p - b)), y = Math.max(b, Math.min(y, g - m - b)), o = { x: `${f}px`, y: `${y}px` };
    }
    const c = orca.components.InputBox, s = t.createElement(c, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (u, h, g) => {
        u && u.trim() && u.trim() !== e.title && this.updateTabTitle(e, u.trim()), g();
      },
      onCancel: (u) => {
        u();
      }
    }, (u) => t.createElement("div", {
      style: {
        position: "absolute",
        left: o.x,
        top: o.y,
        pointerEvents: "auto"
      },
      onClick: u
    }, ""));
    a.render(s, i), setTimeout(() => {
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
    const n = document.createElement("div");
    n.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;
    const o = document.createElement("button");
    o.className = "orca-button orca-button-primary", o.textContent = "确认";
    const c = document.createElement("button");
    c.className = "orca-button", c.textContent = "取消", n.appendChild(o), n.appendChild(c), a.appendChild(i), a.appendChild(n);
    const s = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (s) {
      const h = s.getBoundingClientRect();
      a.style.left = `${h.left}px`, a.style.top = `${h.top - 60}px`;
    } else
      a.style.left = "50%", a.style.top = "50%", a.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(a), i.focus(), i.select();
    const l = () => {
      const h = i.value.trim();
      h && h !== e.title && this.updateTabTitle(e, h), a.remove();
    }, d = () => {
      a.remove();
    };
    o.addEventListener("click", l), c.addEventListener("click", d), i.addEventListener("keydown", (h) => {
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
  async updateTabTitle(e, t) {
    try {
      const a = this.getCurrentPanelTabs(), i = Ea(e, t, a, {
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
    const a = window.React, i = window.ReactDOM, n = document.createElement("div");
    n.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(n);
    const o = orca.components.ContextMenu, c = orca.components.Menu, s = orca.components.MenuText, l = orca.components.MenuSeparator, d = a.createElement(o, {
      menu: (g) => a.createElement(c, {}, [
        a.createElement(s, {
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
        a.createElement(s, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            g(), this.toggleTabPinStatus(t);
          }
        }),
        // 如果有保存的标签组，添加"添加到已有标签组"选项
        ...this.savedTabSets.length > 0 ? [
          a.createElement(s, {
            key: "addToGroup",
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              g(), this.showAddToTabGroupDialog(t);
            }
          })
        ] : [],
        a.createElement(l, { key: "separator1" }),
        a.createElement(s, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            g(), this.closeTab(t);
          }
        }),
        a.createElement(s, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            g(), this.closeOtherTabs(t);
          }
        }),
        a.createElement(s, {
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
    i.render(d, n);
    const u = () => {
      i.unmountComponentAtNode(n), n.remove();
    }, h = new MutationObserver((g) => {
      g.forEach((p) => {
        p.removedNodes.forEach((m) => {
          m === e && (u(), h.disconnect());
        });
      });
    });
    h.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    var h, g;
    const a = document.querySelector(".tab-context-menu");
    a && a.remove();
    const i = document.documentElement.classList.contains("dark") || ((g = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : g.themeMode) === "dark", n = document.createElement("div");
    n.className = "tab-context-menu";
    const o = 220, c = 240, { x: s, y: l } = X(e.clientX, e.clientY, o, c);
    n.style.cssText = `
      position: fixed;
      left: ${s}px;
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
      const f = document.createElement("i");
      f.className = "tab-context-menu-icon", p.text.includes("重命名") ? f.classList.add("ti", "ti-edit") : p.text.includes("固定") ? f.classList.add("ti", t.isPinned ? "ti-pin-off" : "ti-pin") : p.text.includes("添加到已有标签组") ? f.classList.add("ti", "ti-bookmark-plus") : p.text.includes("关闭") ? f.classList.add("ti", "ti-x") : f.classList.add("ti", "ti-edit"), f.style.cssText = `
        flex: 0 0 auto;
        font-size: var(--orca-fontsize-lg);
        margin-top: var(--orca-spacing-xs);
        margin-right: var(--orca-spacing-md);
        color: var(--orca-tab-colored-text);
        width: 16px;
        text-align: center;
      `, m.appendChild(f);
      const y = document.createElement("span");
      y.textContent = p.text, m.appendChild(y), p.disabled || (m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      }), m.addEventListener("click", () => {
        p.action(), n.remove();
      })), n.appendChild(m);
    }), document.body.appendChild(n);
    const u = (p) => {
      !p || !p.target || n.contains(p.target) || (n.remove(), document.removeEventListener("click", u));
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
          const o = await orca.invokeBackend("get-block", parseInt(i.blockId));
          if (o) {
            const c = await oe(o);
            let s = i.icon;
            s || (s = G(c)), e[a] = {
              ...i,
              blockType: c,
              icon: s
            }, this.log(`✅ 更新恢复的标签: ${i.title} -> 类型: ${c}, 图标: ${s}`), t = !0;
          }
        } catch (o) {
          this.warn(`更新恢复的标签失败: ${i.title}`, o);
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
      const n = this.tabContainer.querySelector(".drag-handle");
      n && n.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const a = (n) => {
      this.isDragging && (n.preventDefault(), n.stopPropagation(), this.drag(n));
    }, i = (n) => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", i), this.stopDrag();
    };
    document.addEventListener("mousemove", a), document.addEventListener("mouseup", i), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), a = 5, i = window.innerWidth - t.width - 5, n = 5, o = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(a, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(n, Math.min(o, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(a, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(n, Math.min(o, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const c = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = c.x + "px", this.tabContainer.style.top = c.y + "px", this.ensureClickableElements();
  }
  async stopDrag() {
    if (this.isDragging = !1, this.tabContainer) {
      this.tabContainer.classList.remove("dragging");
      const e = this.tabContainer.querySelector(".drag-handle");
      e && e.classList.remove("dragging"), this.tabContainer.style.cursor = "default", this.enableEdgeHide && !this.isFixedToTop && (this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.boundContainerMouseEnter && this.boundContainerMouseLeave && (this.tabContainer.removeEventListener("mouseenter", this.boundContainerMouseEnter), this.tabContainer.removeEventListener("mouseleave", this.boundContainerMouseLeave), this.boundContainerMouseEnter = null, this.boundContainerMouseLeave = null), this.tabContainer.style.transform = "none", this.isEdgeHideExpanded = !0, this.currentEdgeSide = null, this.verboseLog("🔄 拖拽结束，重置贴边隐藏状态，准备重新检测"), requestAnimationFrame(() => {
        this.applyEdgeHideStyle();
      })), this.tabContainer.style.userSelect = "", this.tabContainer.style.pointerEvents = "auto", this.tabContainer.style.touchAction = "";
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
      horizontalTabMinWidth: this.horizontalTabMinWidth,
      enableEdgeHide: this.enableEdgeHide
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
      this.position = ne(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Ue(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${Se(this.position, this.isVerticalMode)}`);
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
        q()
      );
      if (e) {
        const t = qe(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = ne(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.horizontalTabMaxWidth = t.horizontalTabMaxWidth, this.horizontalTabMinWidth = t.horizontalTabMinWidth, this.enableEdgeHide = t.enableEdgeHide, this.log(`📐 布局模式已恢复: ${Ye(t)}, 当前位置: (${this.position.x}, ${this.position.y})`), this.isSidebarAlignmentEnabled && (this.startSidebarAlignmentObserver(), this.log("🔄 侧边栏对齐监听器已启动"));
      } else {
        const t = q();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.horizontalTabMaxWidth = t.horizontalTabMaxWidth, this.horizontalTabMinWidth = t.horizontalTabMinWidth, this.enableEdgeHide = t.enableEdgeHide, this.position = ne(
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
    this.position = Da(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var n, o;
    const a = (n = this.tabContainer) == null ? void 0 : n.querySelectorAll(".orca-tabs-plugin .orca-tab");
    a == null || a.forEach((c) => c.removeAttribute("data-focused"));
    const i = (o = this.tabContainer) == null ? void 0 : o.querySelector(`[data-tab-id="${e}"]`);
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
          const n = i.getAttribute("data-panel-id");
          n && this.handleNewBlockInPanel(a, n).catch((o) => {
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
  handleChildHideableElements(e) {
    const t = e.querySelector(".orca-hideable");
    if (!t)
      return !1;
    const a = t.querySelector(".orca-block-editor[data-block-id]");
    if (a) {
      const i = a.getAttribute("data-block-id");
      if (i) {
        const n = e.closest(".orca-panel");
        if (n) {
          const o = n.getAttribute("data-panel-id");
          o && this.handleNewBlockInPanel(i, o).catch((c) => {
            this.error(`处理新块失败: ${i}`, c);
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
    var p, m;
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
    const a = Date.now() - this.lastNavigationTime;
    if (this.lastNavigatedBlockId && a < 1e3) {
      this.verboseLog(`⏭️ [DEBUG] 检测到导航后 ${a}ms 内的新块 ${e}，我们刚导航到 ${this.lastNavigatedBlockId}，跳过处理（防止重复标签页）`);
      return;
    }
    const i = document.querySelector(".orca-panel.active"), n = i == null ? void 0 : i.getAttribute("data-panel-id");
    if (n && t !== n) {
      this.log(`🚫 忽略非激活面板 ${t} 中的新块 ${e}，当前激活面板为 ${n}`);
      return;
    }
    const c = this.getPanelIds().indexOf(t);
    if (c === -1) {
      const b = document.querySelectorAll(".orca-panel");
      if (!(b.length > 0 && b[0].getAttribute("data-panel-id") === t)) {
        this.log(`🚫 不管理辅助面板 ${t} 的标签页`);
        return;
      }
    }
    c !== -1 && (this.currentPanelIndex = c, this.currentPanelId = t);
    let s = this.getCurrentPanelTabs();
    this.verboseLog(`🔍 [DEBUG] 当前标签页数量: ${s.length}`);
    const l = s.find((b) => b.blockId === e);
    if (l) {
      this.verboseLog(`🔍 [DEBUG] ✅ 标签 ${e} 已存在，只更新聚焦状态`), this.closedTabs.has(e) && (this.closedTabs.delete(e), this.saveClosedTabs()), this.updateFocusState(e, l.title), this.immediateUpdateTabsUI(), this.verboseLog("🔍 [DEBUG] ========== handleNewBlockInPanel 完成（已存在）==========");
      return;
    }
    this.verboseLog(`🔍 [DEBUG] ❌ 标签 ${e} 不存在，准备创建新标签`), this.creatingTabs.add(e);
    let d = null;
    try {
      if (d = await this.createTabInfoFromBlock(e, t), !d) return;
      s = this.getCurrentPanelTabs();
      const b = s.find((f) => f.blockId === e);
      if (b) {
        this.log(`✅ 标签已被其他地方创建（在await期间），只更新聚焦状态: "${b.title}"`), this.updateFocusState(e, b.title), this.immediateUpdateTabsUI();
        return;
      }
    } finally {
      this.creatingTabs.delete(e);
    }
    const u = this.getCurrentActiveTab();
    if (u) {
      if (u.isPinned) {
        this.log(`📌 当前激活标签已置顶，创建新标签: "${d.title}"`);
        const f = s.filter((y) => y.isPinned).length;
        s.splice(f, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
      const b = s.findIndex((f) => f.blockId === u.blockId);
      if (b !== -1) {
        this.verboseLog(`🔄 替换当前激活标签页: "${u.title}" -> "${d.title}"`), this.recordTabSwitchHistory(u.blockId, d), s[b] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const b = s.findIndex((f) => f.blockId === this.lastActiveBlockId);
      if (b !== -1) {
        if (s[b].isPinned) {
          this.log(`📌 上一个激活标签已置顶，创建新标签: "${d.title}"`);
          const y = s.filter((w) => w.isPinned).length;
          s.splice(y, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
          return;
        }
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${s[b].title}" -> "${d.title}"`), this.recordTabSwitchHistory(s[b].blockId, d), s[b] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    let h = -1;
    const g = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (g) {
      const b = g.getAttribute("data-tab-id");
      h = s.findIndex((f) => f.blockId === b);
    }
    if (h === -1) {
      const b = (m = this.tabContainer) == null ? void 0 : m.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (b && b.length > 0)
        for (let f = 0; f < b.length; f++) {
          const y = b[f];
          if (y.classList.contains("focused") || y.getAttribute("data-focused") === "true" || y.classList.contains("active")) {
            h = f;
            break;
          }
        }
    }
    if (h === -1 && s.length > 0 && (h = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), h >= 0 && h < s.length)
      if (s[h].isPinned) {
        this.log(`📌 目标标签已置顶，创建新标签: "${d.title}"`);
        const f = s.filter((y) => y.isPinned).length;
        s.splice(f, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
      } else
        s[h] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
    else
      s = [d], this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
  }
  async checkCurrentPanelBlocks() {
    if (this.panelBlockCheckTask) {
      await this.panelBlockCheckTask;
      return;
    }
    this.panelBlockCheckTask = (async () => {
      var p;
      if (this.isNavigating) {
        this.verboseLog("⏭️ 正在导航中，跳过面板块检查");
        return;
      }
      this.verboseLog("🔍 开始检查当前面板块...");
      const e = document.querySelector(".orca-panel.active");
      if (!e) {
        this.log("❌ 没有找到当前激活的面板");
        const m = document.querySelectorAll(".orca-panel");
        this.log("📊 当前所有面板状态:"), m.forEach((b, f) => {
          const y = b.getAttribute("data-panel-id"), w = b.classList.contains("active");
          this.log(`  面板${f + 1}: ID=${y}, active=${w}`);
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
      const n = i.getAttribute("data-block-id");
      if (!n) {
        this.log("激活的块编辑器没有blockId");
        return;
      }
      let o = this.getCurrentPanelTabs();
      o.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), o = this.getCurrentPanelTabs());
      const c = o.find((m) => m.blockId === n);
      if (c) {
        this.closedTabs.has(n) && (this.closedTabs.delete(n), await this.saveClosedTabs()), this.updateFocusState(n, c.title), await this.immediateUpdateTabsUI();
        return;
      }
      const s = Date.now() - this.lastNavigationTime;
      if (this.lastNavigatedBlockId && s < 1e3 && o.find((b) => b.blockId === this.lastNavigatedBlockId)) {
        this.verboseLog(`⏭️ 检测到导航后的新块 ${n}，但我们刚导航到 ${this.lastNavigatedBlockId}，跳过处理（防止重复标签页）`), this.verboseLog(`⏭️ 时间差: ${s}ms`);
        return;
      }
      const l = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
      if (!l) {
        this.verboseLog(`⚠️ 未找到聚焦的标签元素，当前块: ${n}`);
        return;
      }
      const d = l.getAttribute("data-tab-id");
      if (!d)
        return;
      const u = o.findIndex((m) => m.blockId === d);
      if (u === -1)
        return;
      if (o[u].isPinned) {
        this.log(`📌 聚焦标签已置顶，不替换，创建新标签: "${n}"`);
        const m = o.find((b) => b.blockId === n);
        if (m) {
          this.log(`✅ 标签已被其他地方创建，只更新聚焦状态: "${m.title}"`), this.updateFocusState(n, m.title), await this.immediateUpdateTabsUI();
          return;
        }
        if (this.creatingTabs.has(n)) {
          this.log(`⏳ 标签 ${n} 正在被其他地方创建，跳过`);
          return;
        }
        this.creatingTabs.add(n);
        try {
          const b = await this.getTabInfo(n, t, o.length);
          if (!b)
            return;
          o = this.getCurrentPanelTabs();
          const f = o.find((w) => w.blockId === n);
          if (f) {
            this.log(`✅ 标签在创建过程中已被其他地方创建: "${f.title}"`), this.updateFocusState(n, f.title), await this.immediateUpdateTabsUI();
            return;
          }
          const y = o.filter((w) => w.isPinned).length;
          o.splice(y, 0, b), this.updateFocusState(n, b.title), this.setCurrentPanelTabs(o), await this.immediateUpdateTabsUI();
        } finally {
          this.creatingTabs.delete(n);
        }
        return;
      }
      const g = await this.getTabInfo(n, t, u);
      g && (o[u] = g, this.setCurrentPanelTabs(o), await this.immediateUpdateTabsUI());
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
    new MutationObserver(async (n) => {
      let o = !1, c = !1, s = !1, l = this.currentPanelIndex;
      const d = Date.now(), u = this.lastPanelCheckTime || 0, h = 1e3;
      if (n.forEach((g) => {
        if (g.type === "childList") {
          const p = g.target;
          if ((p.classList.contains("orca-panels-row") || p.closest(".orca-panels-row")) && (c = !0), g.addedNodes.length > 0 && p.closest(".orca-panel")) {
            for (const b of g.addedNodes)
              if (b.nodeType === Node.ELEMENT_NODE) {
                const f = b;
                if (this.handleNewHideableElement(f)) {
                  o = !0;
                  break;
                }
                if (f.classList.contains("orca-block-editor") || f.querySelector(".orca-block-editor")) {
                  o = !0;
                  break;
                }
                if (this.handleChildHideableElements(f)) {
                  o = !0;
                  break;
                }
              }
          }
        }
        if (g.type === "attributes" && g.attributeName === "class") {
          const p = g.target;
          if (p.classList.contains("orca-panel")) {
            if (s = !0, p.classList.contains("active")) {
              const m = p.getAttribute("data-panel-id"), b = p.querySelectorAll(".orca-hideable");
              let f = null;
              b.forEach((y) => {
                const w = y.classList.contains("orca-hideable-hidden"), x = y.querySelector(".orca-block-editor[data-block-id]"), T = x == null ? void 0 : x.getAttribute("data-block-id");
                !w && x && T && (f = T);
              }), f && m && this.handleNewBlockInPanel(f, m).catch((y) => {
                this.error(`处理面板激活时的新块失败: ${f}`, y);
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
      }), s && (await this.updateCurrentPanelIndex(), l !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${l} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), c && d - u > h ? (this.lastPanelCheckTime = d, this.verboseLog(`🔍 面板检查防抖：距离上次检查 ${d - u}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : c && d - u < 100 && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${d - u}ms`), o) {
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
    let t = null, a = null;
    const i = async (n) => {
      if (!n || !n.target)
        return;
      const o = n.target;
      if (o.closest(".orca-tabs-plugin") || o.closest(".orca-sidebar") || o.closest(".orca-headbar"))
        return;
      const c = o.closest(".orca-hideable");
      if (c) {
        const s = c.querySelector(".orca-block-editor[data-block-id]"), l = s == null ? void 0 : s.getAttribute("data-block-id");
        if (l && l === a) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个块 ${l}`);
          return;
        }
        t && clearTimeout(t), t = window.setTimeout(async () => {
          if (!c.classList.contains("orca-hideable-hidden")) {
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
    document.addEventListener("click", i), document.addEventListener("focusin", i), document.addEventListener("keydown", (n) => {
      (n.key === "Tab" || n.key === "Enter" || n.key === " ") && (t && clearTimeout(t), t = window.setTimeout(i, 0));
    }), typeof window < "u" && (this.focusSyncInterval !== null && window.clearInterval(this.focusSyncInterval), this.focusSyncInterval = window.setInterval(async () => {
      var n;
      try {
        const o = document.querySelector(".orca-panel.active");
        if (o) {
          const c = o.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (c) {
            const s = c.getAttribute("data-block-id");
            if (s) {
              const l = (n = this.tabContainer) == null ? void 0 : n.querySelector('.orca-tab[data-focused="true"]'), d = !!l;
              if (!this.lastFocusState || this.lastFocusState.blockId !== s || this.lastFocusState.hasFocusedTab !== d)
                if (this.lastFocusState = { blockId: s, hasFocusedTab: d }, l) {
                  const h = l.getAttribute("data-tab-id");
                  h !== s && (this.verboseLog(`?? 焦点检测到变更: ${h} -> ${s}`), await this.checkCurrentPanelBlocks());
                } else
                  this.verboseLog(`?? 焦点检测到无聚焦标签页，当前块: ${s}`), await this.checkCurrentPanelBlocks();
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
    this.panelIndexUpdateTimer && clearTimeout(this.panelIndexUpdateTimer), this.panelIndexUpdateTimer = setTimeout(async () => {
      const e = document.querySelector(".orca-panel.active");
      if (e) {
        const t = e.getAttribute("data-panel-id");
        if (t && !t.startsWith("_")) {
          if (this.currentPanelId === t)
            return;
          const a = this.getPanelIds().indexOf(t);
          if (a !== -1) {
            const i = this.currentPanelIndex;
            this.currentPanelIndex = a, this.currentPanelId = t, this.log(`🔄 面板索引更新: ${i} -> ${a} (面板ID: ${t})`), (!this.panelTabsData[a] || this.panelTabsData[a].length === 0) && (this.log(`🔍 面板 ${t} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(a, t || "")), this.debouncedUpdateTabsUI();
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
    const n = document.querySelector(`.orca-panel[data-panel-id="${i}"]`);
    if (!n) {
      this.log(`❌ 未找到面板元素: ${i}`);
      return;
    }
    const o = document.querySelector(".orca-panel.active");
    o && o.classList.remove("active"), n.classList.add("active"), this.currentPanelIndex = a, this.currentPanelId = i, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${i}`);
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
    if (!e || !e.target)
      return;
    const t = e.target;
    if ((e.ctrlKey || e.metaKey) && t) {
      const a = this.getBlockRefId(t);
      if (a) {
        this.creatingTabs.add(a), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.openInNewTab(a).catch((i) => {
          this.creatingTabs.delete(a);
        });
        return;
      }
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
    !e || e.target;
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
      if (Array.from(e).filter((s) => {
        const l = s.getAttribute("data-panel-id");
        return l && !l.startsWith("_");
      }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
        this.verboseLog("📋 面板数量未变化，跳过面板发现");
        return;
      }
      const a = [...this.getPanelIds()], i = this.getPanelIds()[0] || null;
      await this.discoverPanels();
      const n = this.getPanelIds()[0] || null, o = za(a, this.getPanelIds());
      o && (this.log(`📋 面板列表发生变化: ${a.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${a.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${i} -> ${n}`), i !== n && (this.log(`🔄 持久化面板已变更: ${i} -> ${n}`), await this.handlePersistentPanelChange(i, n))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
      const c = document.querySelector(".orca-panel.active");
      if (c) {
        const s = c.getAttribute("data-panel-id");
        if (s && !s.startsWith("_") && (s !== this.currentPanelId || o)) {
          const l = this.currentPanelIndex, d = this.getPanelIds().indexOf(s);
          d !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId || ""} -> ${s} (索引: ${l} -> ${d})`), this.currentPanelIndex = d, this.currentPanelId = s, await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI());
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
    let n = 0;
    for (const o of a) {
      const c = o.querySelector(".orca-block-editor");
      if (!c) continue;
      const s = c.getAttribute("data-block-id");
      if (!s) continue;
      const l = await this.getTabInfo(s, e, n++);
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
    const i = a.querySelectorAll(".orca-block-editor[data-block-id]"), n = [];
    let o = 0;
    this.log(`🔍 扫描面板 ${t}，找到 ${i.length} 个块编辑器`);
    for (const s of i) {
      const l = s.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, t, o++);
      d && (n.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    e >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[e] = [...n], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${n.length} 个标签页`);
    const c = e === 0 ? k.FIRST_PANEL_TABS : `panel_${e + 1}_tabs`;
    await this.savePanelTabsByKey(c, n);
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
    const i = a.querySelectorAll(".orca-block-editor[data-block-id]"), n = [];
    let o = 0;
    this.log(`🔍 扫描当前聚焦面板 ${t}，找到 ${i.length} 个块编辑器`);
    for (const l of i) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const u = await this.getTabInfo(d, t, o++);
      u && (n.push(u), this.log(`📋 找到当前标签页: ${u.title} (${d})`));
    }
    const c = this.panelTabsData[e] || [];
    this.log(`📋 已加载的标签页: ${c.length} 个，当前标签页: ${n.length} 个`);
    const s = [...c];
    for (const l of n)
      s.push(l), this.log(`➕ 添加当前标签页: ${l.title}`);
    this.panelTabsData[e] = [...s], this.log(`📋 合并后标签页总数: ${s.length} 个`);
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
    for (const o of t) {
      const c = o.querySelector(".orca-block-editor");
      if (!c) continue;
      const s = c.getAttribute("data-block-id");
      if (!s) continue;
      const l = await this.getTabInfo(s, this.currentPanelId || "", i++);
      l && a.push(l);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...a], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页`);
    const n = this.currentPanelIndex === 0 ? k.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(n, a);
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, a = this.recentlyClosedTabs.map((i, n) => ({
      label: `${i.title}`,
      icon: i.icon || G(i.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(i, n)
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
    const i = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", n = document.createElement("div");
    n.className = "recently-closed-tabs-menu";
    const o = 280, c = 350, { x: s, y: l } = X(t.x, t.y, o, c);
    n.style.cssText = `
      position: fixed;
      left: ${s}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: ${o}px;
      max-height: ${c}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((b, f) => {
      if (b.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, n.appendChild(x);
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
          const T = document.createElement("i");
          T.className = b.icon, x.appendChild(T);
        } else
          x.textContent = b.icon;
        y.appendChild(x);
      }
      const w = document.createElement("span");
      w.textContent = b.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, y.appendChild(w), y.addEventListener("mouseenter", () => {
        y.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), y.addEventListener("mouseleave", () => {
        y.style.backgroundColor = "transparent";
      }), y.addEventListener("click", () => {
        b.onClick(), n.remove();
      }), n.appendChild(y);
    }), document.body.appendChild(n);
    const d = n.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (n.style.left = `${u - d.width - 10}px`), d.bottom > h && (n.style.top = `${h - d.height - 10}px`);
    const g = (b) => {
      !b || !b.target || n.contains(b.target) || (n.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
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
    })), this.savedTabSets.forEach((i, n) => {
      a.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: i.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, n)
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
    }), this.savedTabSets.forEach((i, n) => {
      a.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, n)
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
    const i = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", n = document.createElement("div");
    n.className = "multi-tab-saving-menu";
    const o = 300, c = 400, { x: s, y: l } = X(t.x, t.y, o, c);
    n.style.cssText = `
      position: fixed;
      left: ${s}px;
      top: ${l}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 10000;
      min-width: 200px;
      max-width: ${o}px;
      max-height: ${c}px;
      padding: var(--orca-spacing-sm);
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((b, f) => {
      if (b.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, n.appendChild(x);
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
          const T = document.createElement("i");
          T.className = b.icon, x.appendChild(T);
        } else
          x.textContent = b.icon;
        y.appendChild(x);
      }
      const w = document.createElement("span");
      w.textContent = b.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, y.appendChild(w), y.addEventListener("mouseenter", () => {
        y.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), y.addEventListener("mouseleave", () => {
        y.style.backgroundColor = "transparent";
      }), y.addEventListener("click", () => {
        b.onClick(), n.remove();
      }), n.appendChild(y);
    }), document.body.appendChild(n);
    const d = n.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (n.style.left = `${u - d.width - 10}px`), d.bottom > h && (n.style.top = `${h - d.height - 10}px`);
    const g = (b) => {
      !b || !b.target || n.contains(b.target) || (n.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
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
    const n = document.createElement("div");
    n.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    `;
    const o = document.createElement("button");
    o.className = "orca-button orca-button-secondary", o.textContent = "创建新标签组", o.style.cssText = "flex: 1;";
    const c = document.createElement("button");
    c.className = "orca-button", c.textContent = "更新已有标签组", c.style.cssText = "flex: 1;";
    let s = !1;
    const l = () => {
      s = !1, o.className = "orca-button orca-button-secondary", o.style.cssText = "flex: 1;", c.className = "orca-button", c.style.cssText = "flex: 1;", u.style.display = "block", p.style.display = "none", T();
    }, d = () => {
      s = !0, c.className = "orca-button orca-button-secondary", c.style.cssText = "flex: 1;", o.className = "orca-button", o.style.cssText = "flex: 1;", u.style.display = "none", p.style.display = "block", T();
    };
    o.onclick = l, c.onclick = d, n.appendChild(o), n.appendChild(c), i.appendChild(n);
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
    const f = document.createElement("option");
    f.value = "", f.textContent = "请选择标签页集合...", b.appendChild(f), this.savedTabSets.forEach((C, M) => {
      const V = document.createElement("option");
      V.value = M.toString(), V.textContent = `${C.name} (${C.tabs.length}个标签)`, b.appendChild(V);
    }), p.appendChild(b), i.appendChild(u), i.appendChild(p), t.appendChild(i);
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
    const T = () => {
      x.textContent = s ? "更新" : "保存";
    };
    x.onclick = async () => {
      if (s) {
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
    }, y.appendChild(w), y.appendChild(x), t.appendChild(y), document.body.appendChild(t), setTimeout(() => {
      g.focus(), g.select();
    }, 100), g.addEventListener("keydown", (C) => {
      C.key === "Enter" ? (C.preventDefault(), x.click()) : C.key === "Escape" && (C.preventDefault(), w.click());
    });
    const S = (C) => {
      !C || !C.target || t.contains(C.target) || (t.remove(), document.removeEventListener("click", S));
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
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 0 20px;
    `;
    const o = document.createElement("label");
    o.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, o.textContent = `将标签页 "${e.title}" 添加到:`, n.appendChild(o);
    const c = document.createElement("select");
    c.style.cssText = `
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
    `, c.addEventListener("focus", () => {
      c.style.borderColor = "var(--orca-color-primary-5)";
    }), c.addEventListener("blur", () => {
      c.style.borderColor = "#ddd";
    });
    const s = document.createElement("option");
    s.value = "", s.textContent = "请选择标签组...", c.appendChild(s), this.savedTabSets.forEach((g, p) => {
      const m = document.createElement("option");
      m.value = p.toString(), m.textContent = `${g.name} (${g.tabs.length}个标签)`, c.appendChild(m);
    }), n.appendChild(c), a.appendChild(n);
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
      const g = parseInt(c.value);
      if (isNaN(g) || g < 0 || g >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      a.remove(), await this.addTabToGroup(e, g);
    }, l.appendChild(d), l.appendChild(u), a.appendChild(l), document.body.appendChild(a), setTimeout(() => {
      c.focus();
    }, 100), c.addEventListener("keydown", (g) => {
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
  async addTabToGroup(e, t) {
    try {
      const a = this.savedTabSets[t];
      if (!a) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (a.tabs.find((n) => n.blockId === e.blockId)) {
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
        const n = { ...i, panelId: this.currentPanelId || "" };
        a.push(n);
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
    var o, c;
    const i = document.documentElement.classList.contains("dark") || ((c = (o = window.orca) == null ? void 0 : o.state) == null ? void 0 : c.themeMode) === "dark";
    e.innerHTML = "";
    let n = -1;
    t.forEach((s, l) => {
      const d = document.createElement("div");
      d.className = "sortable-tab-item", d.draggable = !0, d.dataset.index = l.toString(), d.dataset.tabId = s.blockId, d.style.cssText = `
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
      `, u.innerHTML = "⋮⋮", d.appendChild(u), s.icon) {
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
        `, s.icon.startsWith("ti ti-")) {
          const f = document.createElement("i");
          f.className = s.icon, b.appendChild(f);
        } else
          b.textContent = s.icon;
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
        <div style="font-size: 14px; color: var(--orca-color-text-1); font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${s.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${s.blockId}</div>
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
        this.verboseLog("拖拽开始，索引:", l), n = l, b.dataTransfer.setData("text/plain", l.toString()), b.dataTransfer.setData("application/json", JSON.stringify(s)), b.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (b) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", n = -1;
      }), d.addEventListener("dragover", (b) => {
        b.preventDefault(), b.dataTransfer.dropEffect = "move", n !== -1 && n !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (b) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (b) => {
        b.preventDefault(), b.stopPropagation();
        const f = parseInt(b.dataTransfer.getData("text/plain")), y = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", f !== y && f >= 0) {
          const w = t[f];
          t.splice(f, 1), t.splice(y, 0, w), this.renderSortableTabs(e, t);
          const x = this.savedTabSets.find((T) => T.tabs === t);
          x && (x.tabs = [...t], x.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
      }), d.addEventListener("mouseenter", () => {
        n === -1 && (d.style.backgroundColor = "rgba(59, 130, 246, 0.05)", d.style.borderColor = "var(--orca-color-primary-5)");
      }), d.addEventListener("mouseleave", () => {
        n === -1 && (d.style.backgroundColor = "var(--orca-color-bg-1)", d.style.borderColor = "#e0e0e0");
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
      const n = document.createElement("div");
      n.style.cssText = `
        font-size: 14px;
        color: var(--orca-color-text-2);
        line-height: 1.5;
        margin-bottom: var(--orca-spacing-lg);
      `, n.textContent = this.tabsBeforeWorkspace && this.tabsBeforeWorkspace.length > 0 ? "确定要退出当前工作区吗？退出后将恢复到进入工作区之前的标签页组。" : "确定要退出当前工作区吗？退出后当前工作区的标签页将不会保存。";
      const o = document.createElement("div");
      o.style.cssText = `
        display: flex;
        gap: var(--orca-spacing-sm);
        justify-content: flex-end;
      `;
      const c = document.createElement("button");
      c.textContent = "取消", c.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-border);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-bg-1);
        color: var(--orca-color-text-1);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `, c.addEventListener("click", () => {
        a.remove(), e(!1);
      });
      const s = document.createElement("button");
      s.textContent = "确认", s.style.cssText = `
        padding: var(--orca-spacing-sm) var(--orca-spacing-md);
        border: 1px solid var(--orca-color-primary);
        border-radius: var(--orca-radius-md);
        background: var(--orca-color-primary);
        color: var(--orca-color-text-on-primary);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        transition: all 0.2s ease;
      `, s.addEventListener("click", () => {
        a.remove(), e(!0);
      }), c.addEventListener("mouseenter", () => {
        c.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), c.addEventListener("mouseleave", () => {
        c.style.backgroundColor = "var(--orca-color-bg-1)";
      }), s.addEventListener("mouseenter", () => {
        s.style.opacity = "0.9";
      }), s.addEventListener("mouseleave", () => {
        s.style.opacity = "1";
      }), o.appendChild(c), o.appendChild(s), a.appendChild(i), a.appendChild(n), a.appendChild(o), document.body.appendChild(a);
      const l = (d) => {
        !d || !d.target || a.contains(d.target) || (a.remove(), document.removeEventListener("click", l), e(!1));
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
    const n = document.createElement("div");
    n.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, n.textContent = "保存工作区";
    const o = document.createElement("div");
    o.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, o.textContent = "工作区名称:";
    const c = document.createElement("input");
    c.type = "text", c.placeholder = "请输入工作区名称...", c.style.cssText = `
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
    const s = document.createElement("div");
    s.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, s.textContent = "工作区描述 (可选):";
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
      const b = c.value.trim();
      if (!b) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((f) => f.name === b)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(b, l.value.trim()), a.remove();
    }, d.appendChild(u), d.appendChild(h), i.appendChild(n), i.appendChild(o), i.appendChild(c), i.appendChild(s), i.appendChild(l), i.appendChild(d), a.appendChild(i), document.body.appendChild(a), c.focus(), a.addEventListener("click", (b) => {
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
      const a = this.getCurrentPanelTabs(), i = this.getCurrentActiveTab(), n = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: a,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: i ? i.blockId : void 0
      };
      this.workspaces.push(n), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${a.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
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
    const a = document.documentElement.classList.contains("dark") || ((w = (y = window.orca) == null ? void 0 : y.state) == null ? void 0 : w.themeMode) === "dark", i = document.createElement("div");
    i.className = "workspace-menu";
    const n = 280, o = 400, c = e ? { x: e.clientX, y: e.clientY } : { x: 20, y: 60 }, { x: s, y: l } = X(c.x, c.y, n, o);
    i.style.cssText = `
      position: fixed;
      left: ${s}px;
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
      const x = document.createElement("div");
      x.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${a ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, x.textContent = "暂无工作区", g.appendChild(x);
    } else
      this.workspaces.forEach((x) => {
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
          ${this.currentWorkspace === x.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const S = x.icon || "ti ti-folder";
        T.innerHTML = `
          <i class="${S}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: var(--orca-color-text-1);"">${x.name}</div>
            ${x.description ? `<div style="font-size: 12px; color: ${a ? "#999" : "#666"}; margin-top: 2px;">${x.description}</div>` : ""}
            <div style="font-size: 11px; color: ${a ? "#777" : "#999"}; margin-top: 2px;">${x.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === x.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ""}
        `, T.addEventListener("mouseenter", () => {
          T.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), T.addEventListener("mouseleave", () => {
          T.style.backgroundColor = this.currentWorkspace === x.id ? "rgba(59, 130, 246, 0.1)" : "transparent";
        }), T.onclick = () => {
          i.remove(), this.switchToWorkspace(x.id);
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
    i.appendChild(d), i.appendChild(u), i.appendChild(g), i.appendChild(p), b && i.appendChild(b), document.body.appendChild(i);
    const f = (x) => {
      !x || !x.target || i.contains(x.target) || (i.remove(), document.removeEventListener("click", f));
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
      for (const n of e)
        try {
          const o = await this.getTabInfo(n.blockId, this.currentPanelId || "", a.length);
          o ? (o.isPinned = n.isPinned, o.order = n.order, o.scrollPosition = n.scrollPosition, a.push(o)) : a.push(n);
        } catch (o) {
          this.warn(`无法更新标签页信息 ${n.title}:`, o), a.push(n);
        }
      this.panelTabsData[0] = a, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...a], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const i = t.lastActiveTabId;
      setTimeout(async () => {
        if (a.length > 0) {
          let n = a[0];
          if (i) {
            const o = a.find((c) => c.blockId === i);
            o ? (n = o, this.log(`🎯 导航到工作区中最后激活的标签页: ${n.title} (ID: ${i})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${n.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${n.title}`);
          await this.safeNavigate(n.blockId, this.currentPanelId || "", n);
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
    var d, u;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", a = document.createElement("div");
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
    const n = document.createElement("div");
    n.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, n.textContent = "管理工作区";
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
        color: ${t ? "#999" : "#666"};
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
        `, g.addEventListener("mouseenter", () => {
          g.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), g.addEventListener("mouseleave", () => {
          g.style.backgroundColor = this.currentWorkspace === h.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)";
        }), o.appendChild(g);
      });
    const c = document.createElement("div");
    c.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const s = document.createElement("button");
    s.style.cssText = `
      padding: .175rem var(--orca-spacing-md);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      background: var(--orca-color-bg-1);
      color: ${t ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, s.textContent = "关闭", s.onclick = () => {
      a.remove();
    }, c.appendChild(s), i.appendChild(n), i.appendChild(o), i.appendChild(c), a.appendChild(i), document.body.appendChild(a), a.querySelectorAll(".delete-workspace-btn").forEach((h) => {
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
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, n.textContent = `标签集合详情: ${e.name}`, i.appendChild(n);
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;
    const c = document.createElement("div");
    if (c.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background-color: var(--orca-color-bg-1);
      border-radius: var(--orca-radius-md);
    `, c.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>创建时间:</strong> ${new Date(e.createdAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>更新时间:</strong> ${new Date(e.updatedAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666;">
        <strong>标签数量:</strong> ${e.tabs.length}个
      </div>
    `, o.appendChild(c), e.tabs.length === 0) {
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
      const f = document.createElement("div");
      f.className = "sortable-tabs-container", f.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(f, [...e.tabs], e), g.appendChild(f), o.appendChild(g);
    }
    i.appendChild(o);
    const s = document.createElement("div");
    s.style.cssText = `
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
    }, s.appendChild(l), i.appendChild(s), document.body.appendChild(i);
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
    const n = document.createElement("div");
    n.className = "rename-tabset-dialog", n.style.cssText = `
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
    `, o.textContent = "重命名标签集合", n.appendChild(o);
    const c = document.createElement("div");
    c.style.cssText = `
      padding: 0 20px;
    `;
    const s = document.createElement("label");
    s.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, s.textContent = "请输入新的名称:", c.appendChild(s);
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
    }), c.appendChild(l), n.appendChild(c);
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
      n.remove(), this.manageSavedTabSets();
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
      if (p === e.name) {
        n.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((b) => b.name === p && b.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = p, e.updatedAt = Date.now(), await this.saveSavedTabSets(), n.remove(), a.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(u), d.appendChild(h), n.appendChild(d), document.body.appendChild(n), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), h.click()) : p.key === "Escape" && (p.preventDefault(), u.click());
    });
    const g = (p) => {
      !p || !p.target || n.contains(p.target) || (n.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g));
    };
    setTimeout(() => {
      document.addEventListener("click", g), document.addEventListener("contextmenu", g);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, a, i) {
    const n = document.createElement("input");
    n.type = "text", n.value = e.name, n.style.cssText = `
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
    a.innerHTML = "", a.appendChild(n), n.addEventListener("click", (d) => {
      d.stopPropagation();
    }), n.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), n.focus(), n.select();
    const c = async () => {
      const d = n.value.trim();
      if (!d) {
        a.textContent = o;
        return;
      }
      if (d === e.name) {
        a.textContent = o;
        return;
      }
      if (this.savedTabSets.find((h) => h.name === d && h.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), a.textContent = o;
        return;
      }
      e.name = d, e.updatedAt = Date.now(), await this.saveSavedTabSets(), a.textContent = d, orca.notify("success", "重命名成功");
    }, s = () => {
      a.textContent = o;
    };
    n.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), c()) : d.key === "Escape" && (d.preventDefault(), s());
    });
    let l = null;
    n.addEventListener("blur", () => {
      l && clearTimeout(l), l = window.setTimeout(() => {
        c();
      }, 100);
    }), n.addEventListener("focus", () => {
      l && (clearTimeout(l), l = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, a, i, n) {
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
    const c = document.createElement("div");
    c.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, c.textContent = "选择图标", o.appendChild(c);
    const s = document.createElement("div");
    s.style.cssText = `
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
        background: ${e.icon === p.value ? "#e3f2fd" : "white"};
      `;
      const b = document.createElement("div");
      if (b.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, p.value.startsWith("ti ti-")) {
        const y = document.createElement("i");
        y.className = p.value, b.appendChild(y);
      } else
        b.textContent = p.icon;
      const f = document.createElement("div");
      f.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, f.textContent = p.name, m.appendChild(b), m.appendChild(f), m.addEventListener("click", async (y) => {
        y.stopPropagation(), e.icon = p.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i(), o.remove(), n && n.focus(), orca.notify("success", "图标已更新");
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "#f5f5f5", m.style.borderColor = "var(--orca-color-primary-5)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = e.icon === p.value ? "#e3f2fd" : "white", m.style.borderColor = "#e0e0e0";
      }), d.appendChild(m);
    }), s.appendChild(d), o.appendChild(s);
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
      p.stopPropagation(), o.remove(), n && n.focus();
    }, u.appendChild(h), o.appendChild(u), document.body.appendChild(o);
    const g = (p) => {
      o.contains(p.target) || (p.stopPropagation(), o.remove(), document.removeEventListener("click", g), document.removeEventListener("contextmenu", g), n && n.focus());
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
    `, this.savedTabSets.forEach((s, l) => {
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
      `, B(h, R("点击编辑图标"));
      const g = () => {
        if (h.innerHTML = "", s.icon)
          if (s.icon.startsWith("ti ti-")) {
            const T = document.createElement("i");
            T.className = s.icon, h.appendChild(T);
          } else
            h.textContent = s.icon;
        else
          h.textContent = "📁";
      };
      g(), h.addEventListener("click", () => {
        this.editTabSetIcon(s, l, h, g, t);
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
      `, m.textContent = s.name, B(m, R("点击编辑名称")), m.addEventListener("click", () => {
        this.editTabSetName(s, l, m, t);
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      });
      const b = document.createElement("div");
      b.style.cssText = `
        font-size: 12px;
        color: #666;
      `, b.textContent = `${s.tabs.length}个标签 • ${new Date(s.updatedAt).toLocaleString()}`, p.appendChild(m), p.appendChild(b), u.appendChild(h), u.appendChild(p);
      const f = document.createElement("div");
      f.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const y = document.createElement("button");
      y.className = "orca-button orca-button-primary", y.textContent = "加载", y.style.cssText = "", y.onclick = () => {
        this.loadSavedTabSet(s, l), t.remove();
      };
      const w = document.createElement("button");
      w.className = "orca-button", w.textContent = "查看", w.style.cssText = "", w.onclick = () => {
        this.showTabSetDetails(s, t);
      };
      const x = document.createElement("button");
      x.className = "orca-button", x.textContent = "删除", x.style.cssText = "", x.onclick = () => {
        confirm(`确定要删除标签页集合 "${s.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), t.remove(), this.manageSavedTabSets());
      }, f.appendChild(y), f.appendChild(w), f.appendChild(x), d.appendChild(u), d.appendChild(f), i.appendChild(d);
    }), t.appendChild(i);
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const o = document.createElement("button");
    o.className = "orca-button", o.textContent = "关闭", o.style.cssText = "", o.addEventListener("mouseenter", () => {
      o.style.backgroundColor = "#4b5563";
    }), o.addEventListener("mouseleave", () => {
      o.style.backgroundColor = "#6b7280";
    }), o.onclick = () => t.remove(), n.appendChild(o), t.appendChild(n), document.body.appendChild(t);
    const c = (s) => {
      !s || !s.target || t.contains(s.target) || (t.remove(), document.removeEventListener("click", c), document.removeEventListener("contextmenu", c));
    };
    setTimeout(() => {
      document.addEventListener("click", c), document.addEventListener("contextmenu", c);
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
    const n = this.performanceOptimizer.trackEventListener(e, t, a, i);
    return n && this.verboseLog(`👂 跟踪事件监听器: ${t} -> ${n}`), n;
  }
  /**
   * 销毁插件，清理所有资源
   */
  destroy() {
    try {
      typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null, this.lastBaselineScenario = null, this.log("🗑️ 开始销毁插件..."), this.log("💾 保存插件数据..."), this.saveCurrentPanelTabsImmediately().catch((t) => {
        this.error("销毁时保存数据失败:", t);
      }), this.saveDataDebounceTimer !== null && (clearTimeout(this.saveDataDebounceTimer), this.saveDataDebounceTimer = null), this.performanceOptimizer && (this.log("🧹 清理性能优化器..."), this.performanceOptimizer.destroy(), this.performanceOptimizer = null), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null);
      const e = document.getElementById("orca-tabs-drag-styles");
      e && e.remove(), this.focusSyncInterval !== null && (typeof window < "u" ? window.clearInterval(this.focusSyncInterval) : clearInterval(this.focusSyncInterval), this.focusSyncInterval = null), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener, { capture: !0 }), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null, this.log("✅ 插件销毁完成");
    } catch (e) {
      this.error("❌ 插件销毁过程中发生错误:", e);
    }
  }
}
let I = null;
async function Fa(r) {
  N = r, orca.state.locale, I = new Ha(N), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => I == null ? void 0 : I.init(), 500);
  }) : setTimeout(() => I == null ? void 0 : I.init(), 500);
  try {
    orca.commands.unregisterCommand(`${N}.resetCache`);
  } catch {
  }
  orca.commands.registerCommand(
    `${N}.resetCache`,
    async () => {
      I && await I.resetCache();
    },
    "重置插件缓存"
  );
  try {
    orca.commands.unregisterCommand(`${N}.toggleBlockIcons`);
  } catch {
  }
  orca.commands.registerCommand(
    `${N}.toggleBlockIcons`,
    async () => {
      I && await I.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function _a() {
  I && (I.unregisterBlockMenuCommands(), I.unregisterHeadbarButton(), I.cleanupDragResize(), I.destroy(), I = null);
  try {
    J();
  } catch (r) {
    console.warn("清理 tooltip 时出错:", r);
  }
  try {
    orca.commands.unregisterCommand(`${N}.resetCache`);
  } catch {
  }
  try {
    orca.commands.unregisterCommand(`${N}.toggleBlockIcons`);
  } catch {
  }
}
export {
  Fa as load,
  _a as unload
};
