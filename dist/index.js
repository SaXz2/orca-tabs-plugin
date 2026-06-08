var Je = Object.defineProperty;
var Ze = (r, e, t) => e in r ? Je(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var y = (r, e, t) => Ze(r, typeof e != "symbol" ? e + "" : e, t);
const Ne = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, We = {
  /** JSON数据类型 - 用于存储结构化数据 */
  JSON: 0,
  /** 文本数据类型 - 用于存储纯文本数据 */
  Text: 1
}, C = {
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
  ENABLE_EDGE_HIDE: "enable-edge-hide",
  /** 气泡模式开关 - 存储是否启用气泡模式（仅垂直模式可用） */
  ENABLE_BUBBLE_MODE: "enable-bubble-mode"
}, $ = {
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
class Qe {
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
  async saveConfig(e, t, i = "orca-tabs-plugin") {
    const a = typeof t == "string" ? t : JSON.stringify(t);
    try {
      return await orca.plugins.setData(i, e, a), this.log(`???? ?????????????????????${e}:`, t), !0;
    } catch (n) {
      this.error(`???????????????????????? ${e}:`, n);
      try {
        if (typeof localStorage < "u")
          return localStorage.setItem(`${i}:${e}`, a), this.log(`Fallback save to localStorage for ${e}`), !0;
      } catch (o) {
        this.error(`localStorage ???????????? ${e}:`, o);
      }
      return !1;
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
  async getConfig(e, t = "orca-tabs-plugin", i) {
    const a = i !== void 0 ? i : null;
    try {
      const n = await orca.plugins.getData(t, e);
      if (n == null)
        return a;
      let o;
      if (typeof n == "string")
        try {
          o = JSON.parse(n);
        } catch {
          o = n;
        }
      else
        o = n;
      return this.log(`???? ?????????????????????${e}:`, o), o;
    } catch (n) {
      this.error(`???????????????????????? ${e}:`, n);
    }
    try {
      if (typeof localStorage < "u") {
        const n = localStorage.getItem(`${t}:${e}`);
        if (n == null)
          return a;
        try {
          return JSON.parse(n);
        } catch {
          return n;
        }
      }
    } catch (n) {
      this.error(`localStorage ???????????? ${e}:`, n);
    }
    return a;
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
      return await orca.plugins.removeData(t, e), this.log(`????????????????????????????${e}`), !0;
    } catch (i) {
      this.error(`???????????????????????? ${e}:`, i);
      try {
        if (typeof localStorage < "u")
          return localStorage.removeItem(`${t}:${e}`), this.log(`Fallback remove from localStorage for ${e}`), !0;
      } catch (a) {
        this.error(`localStorage ???????????? ${e}:`, a);
      }
      return !1;
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
      const i = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", i);
      const a = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(i) === JSON.stringify(a) ? "✅" : "❌"}`);
      const n = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", n);
      const o = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(n) === JSON.stringify(o) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
function J() {
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
    enableEdgeHide: !1,
    enableBubbleMode: !1
  };
}
function et(r, e, t = 200) {
  const i = e ? t : 400, a = 40, n = window.innerWidth - i, o = window.innerHeight - a;
  return {
    x: Math.max(0, Math.min(r.x, n)),
    y: Math.max(0, Math.min(r.y, o))
  };
}
function tt(r) {
  const e = J();
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
    enableEdgeHide: r.enableEdgeHide ?? e.enableEdgeHide,
    enableBubbleMode: r.enableBubbleMode ?? e.enableBubbleMode
  };
}
function ue(r, e, t) {
  return r ? { ...e } : { ...t };
}
function it(r, e, t, i) {
  return e ? {
    verticalPosition: { ...r },
    horizontalPosition: { ...i }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...r }
  };
}
function at(r) {
  return `布局模式: ${r.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${r.verticalWidth}px, 垂直位置: (${r.verticalPosition.x}, ${r.verticalPosition.y}), 水平位置: (${r.horizontalPosition.x}, ${r.horizontalPosition.y})`;
}
function ze(r, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${r.x}, ${r.y})`;
}
function N(r) {
  return !!(r.isViewPanel === !0 || r.blockType === "view" || typeof r.blockId == "string" && r.blockId.startsWith("view:"));
}
function nt(r) {
  const e = { ...r }, t = typeof e.blockId == "string" && e.blockId.startsWith("view:"), i = e.blockType === "view", a = e.isViewPanel === !0;
  return e.tabId || (e.tabId = G(e.blockId || "tab")), (t || i || a) && (e.isViewPanel = !0, e.blockType = "view"), e;
}
function R(r) {
  return Array.isArray(r) ? r.map(nt) : [];
}
function rt(r, e, t = {}) {
  try {
    const {
      updateOrder: i = !0,
      saveData: a = !0,
      updateUI: n = !0
    } = t, o = e.findIndex((d) => d.blockId === r.blockId);
    if (o === -1)
      return {
        success: !1,
        message: `标签不存在: ${r.title}`
      };
    e[o].isPinned = !e[o].isPinned;
    const s = e[o].isPinned;
    i && lt(e);
    const c = e.findIndex((d) => d.blockId === r.blockId), l = s ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${r.title}" 已${l}`,
      data: { tab: e[c], tabIndex: c }
    };
  } catch (i) {
    return {
      success: !1,
      message: `切换固定状态失败: ${i}`
    };
  }
}
function ot(r, e, t, i = {}) {
  try {
    const {
      updateUI: a = !0,
      saveData: n = !0,
      validateData: o = !0
    } = i, s = t.findIndex((c) => c.blockId === r.blockId);
    if (s === -1)
      return {
        success: !1,
        message: `标签不存在: ${r.title}`
      };
    if (o) {
      const c = ct(e);
      if (!c.success)
        return c;
    }
    return t[s] = { ...t[s], ...e }, {
      success: !0,
      message: `标签 "${r.title}" 已更新`,
      data: { tab: t[s], tabIndex: s }
    };
  } catch (a) {
    return {
      success: !1,
      message: `更新标签失败: ${a}`
    };
  }
}
function st(r, e, t, i = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : ot(r, { title: e.trim() }, t, i);
}
function ct(r) {
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
function lt(r) {
  r.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function G(r) {
  const e = Date.now().toString(36), t = Math.random().toString(36).slice(2, 8);
  return `${r}-${e}-${t}`;
}
class dt {
  constructor(e, t, i) {
    y(this, "storageService");
    y(this, "pluginName");
    y(this, "log");
    y(this, "warn");
    y(this, "error");
    y(this, "verboseLog");
    this.storageService = e, this.pluginName = t, this.log = i.log, this.warn = i.warn, this.error = i.error, this.verboseLog = i.verboseLog;
  }
  // ==================== 标签页数据存储 ====================
  /**
   * 保存第一个面板的标签数据到持久化存储
   */
  async saveFirstPanelTabs(e) {
    try {
      await this.storageService.saveConfig(C.FIRST_PANEL_TABS, e, this.pluginName), this.log(`💾 保存第一个面板的 ${e.length} 个标签页数据到API配置`);
    } catch (t) {
      this.warn("无法保存第一个面板标签数据:", t);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(C.FIRST_PANEL_TABS, this.pluginName, []);
      if (e && Array.isArray(e)) {
        const t = R(e);
        return this.log(`📂 从API配置恢复了第一个面板的 ${t.length} 个标签页`), t;
      } else
        return this.log("📂 没有找到第一个面板的持久化标签数据，返回空数组"), [];
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
    } catch (i) {
      this.warn(`❌ 保存面板 ${e} 标签页数据失败:`, i);
    }
  }
  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(e, t) {
    try {
      await this.storageService.saveConfig(e, t, this.pluginName), this.verboseLog(`💾 已保存 ${e} 的标签页数据: ${t.length} 个`);
    } catch (i) {
      this.warn(`❌ 保存 ${e} 标签页数据失败:`, i);
    }
  }
  /**
   * 从存储键恢复面板标签页数据
   */
  async restorePanelTabsByKey(e) {
    try {
      const t = await this.storageService.getConfig(e, this.pluginName, []);
      if (t && Array.isArray(t)) {
        const i = R(t);
        return this.verboseLog(`📂 从 ${e} 恢复了 ${i.length} 个标签页`), i;
      }
      return [];
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
      await this.storageService.saveConfig(C.CLOSED_TABS, Array.from(e), this.pluginName), this.log("💾 保存已关闭标签列表到API配置");
    } catch (t) {
      this.warn("无法保存已关闭标签列表:", t);
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  async restoreClosedTabs() {
    try {
      const e = await this.storageService.getConfig(C.CLOSED_TABS, this.pluginName, []);
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
      await this.storageService.saveConfig(C.RECENTLY_CLOSED_TABS, e, this.pluginName), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (t) {
      this.warn("无法保存最近关闭标签页列表:", t);
    }
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表
   */
  async restoreRecentlyClosedTabs() {
    try {
      const e = await this.storageService.getConfig(C.RECENTLY_CLOSED_TABS, this.pluginName, []);
      if (e && Array.isArray(e)) {
        const t = R(e);
        return this.log(`📂 从API配置恢复了 ${t.length} 个最近关闭的标签页`), t;
      } else
        return this.log("📂 没有找到最近关闭标签页数据，返回空数组"), [];
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
      await this.storageService.saveConfig(C.SAVED_TAB_SETS, e, this.pluginName), this.log("💾 保存多标签页集合到API配置");
    } catch (t) {
      this.warn("无法保存多标签页集合:", t);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(C.SAVED_TAB_SETS, this.pluginName, []);
      if (e && Array.isArray(e)) {
        const t = e.map((i) => ({
          ...i,
          tabs: R(i.tabs || [])
        }));
        return this.log(`📂 从API配置恢复了 ${t.length} 个多标签页集合`), t;
      } else
        return this.log("📂 没有找到多标签页集合数据，返回空数组"), [];
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
      const e = await this.storageService.getConfig(C.WORKSPACES, this.pluginName, []);
      let t = e && Array.isArray(e) ? e : [];
      t = t.map((n) => ({
        ...n,
        tabs: R(n.tabs || [])
      }));
      const i = await this.storageService.getConfig(C.ENABLE_WORKSPACES, this.pluginName, !1), a = typeof i == "boolean" ? i : !1;
      return this.log(`📁 已加载 ${t.length} 个工作区`), { workspaces: t, enableWorkspaces: a };
    } catch (e) {
      return this.error("加载工作区数据失败:", e), { workspaces: [], enableWorkspaces: !1 };
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces(e, t, i) {
    try {
      await this.storageService.saveConfig(C.WORKSPACES, e, this.pluginName), await this.storageService.saveConfig(C.CURRENT_WORKSPACE, t, this.pluginName), await this.storageService.saveConfig(C.ENABLE_WORKSPACES, i, this.pluginName), this.log("💾 工作区数据已保存");
    } catch (a) {
      this.error("保存工作区数据失败:", a);
    }
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    try {
      await this.storageService.saveConfig(C.CURRENT_WORKSPACE, null, this.pluginName), this.log("📁 已清除当前工作区状态");
    } catch (e) {
      this.error("清除当前工作区状态失败:", e);
    }
  }
  /**
   * 保存进入工作区前的标签页组
   */
  async saveTabsBeforeWorkspace(e) {
    try {
      await this.storageService.saveConfig(C.TABS_BEFORE_WORKSPACE, e, this.pluginName), this.log(`💾 已保存进入工作区前的标签页组: ${e.length}个标签页`);
    } catch (t) {
      this.error("保存进入工作区前的标签页组失败:", t);
    }
  }
  /**
   * 加载进入工作区前的标签页组
   */
  async loadTabsBeforeWorkspace() {
    try {
      const e = await this.storageService.getConfig(C.TABS_BEFORE_WORKSPACE, this.pluginName);
      if (e && e.length > 0) {
        const t = R(e);
        return this.log(`📁 已加载进入工作区前的标签页组: ${t.length}个标签页`), t;
      }
      return e;
    } catch (e) {
      return this.error("加载进入工作区前的标签页组失败:", e), null;
    }
  }
  /**
   * 清除进入工作区前的标签页组
   */
  async clearTabsBeforeWorkspace() {
    try {
      await this.storageService.saveConfig(C.TABS_BEFORE_WORKSPACE, null, this.pluginName), this.log("📁 已清除进入工作区前的标签页组");
    } catch (e) {
      this.error("清除进入工作区前的标签页组失败:", e);
    }
  }
  // ==================== 位置和布局配置 ====================
  /**
   * 保存位置信息
   */
  async savePosition(e, t, i, a) {
    try {
      const n = it(
        e,
        t,
        i,
        a
      ), o = await this.restoreLayoutMode();
      return await this.saveLayoutMode({
        ...o,
        isVerticalMode: t,
        verticalPosition: n.verticalPosition,
        horizontalPosition: n.horizontalPosition
      }), this.log(`???? ??????????????? ${ze(e, t)}`), n;
    } catch {
      return this.warn("????????????????????????"), { verticalPosition: i, horizontalPosition: a };
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode(e) {
    try {
      await this.storageService.saveConfig(C.LAYOUT_MODE, e, this.pluginName), this.log(`💾 布局模式已保存: ${e.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${e.verticalWidth}px, 垂直位置: (${e.verticalPosition.x}, ${e.verticalPosition.y}), 水平位置: (${e.horizontalPosition.x}, ${e.horizontalPosition.y}), 贴边隐藏: ${e.enableEdgeHide ? "启用" : "禁用"}`);
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
        C.LAYOUT_MODE,
        this.pluginName,
        J()
      ), t = {
        ...J(),
        ...e
      };
      return this.log(`📂 恢复布局模式配置: ${t.isVerticalMode ? "垂直" : "水平"}`), t;
    } catch (e) {
      return this.warn("恢复布局模式配置失败:", e), J();
    }
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode(e) {
    try {
      const t = { isFixedToTop: e };
      await this.storageService.saveConfig(C.FIXED_TO_TOP, t, this.pluginName), this.log(`💾 固定到顶部状态已保存: ${e ? "启用" : "禁用"}`);
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
        C.FIXED_TO_TOP,
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
      await this.storageService.saveConfig(C.FLOATING_WINDOW_VISIBLE, e, this.pluginName), this.log(`💾 浮窗可见状态已保存: ${e ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("保存浮窗可见状态失败:", t);
    }
  }
  /**
   * 恢复浮窗可见状态
   */
  async restoreFloatingWindowVisible() {
    try {
      const t = await this.storageService.getConfig(C.FLOATING_WINDOW_VISIBLE, this.pluginName, !1) || !1;
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
      await this.storageService.saveConfig(C.RECENT_TAB_SWITCH_HISTORY, e, this.pluginName), this.verboseLog(`💾 保存最近切换标签历史: ${Object.keys(e).length} 个标签的历史记录`);
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
        C.RECENT_TAB_SWITCH_HISTORY,
        this.pluginName,
        {}
      );
      if (e && typeof e == "object") {
        const t = {};
        for (const [i, a] of Object.entries(e))
          t[i] = {
            ...a,
            recentTabs: R(a.recentTabs || [])
          };
        return this.verboseLog(`📂 从API配置恢复了 ${Object.keys(t).length} 个标签的切换历史`), t;
      } else
        return this.log("📂 没有找到最近切换标签历史数据，返回空对象"), {};
    } catch (e) {
      return this.warn("无法恢复最近切换标签历史:", e), {};
    }
  }
  /**
   * 更新单个标签的切换历史
   */
  async updateTabSwitchHistory(e, t) {
    try {
      const i = await this.restoreRecentTabSwitchHistory(), a = "global_tab_history";
      i[a] || (i[a] = {
        tabId: a,
        recentTabs: [],
        lastUpdated: Date.now(),
        maxRecords: $.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS
        // 全局历史记录最大数量限制
      });
      const n = i[a];
      n.recentTabs = n.recentTabs.filter((o) => o.blockId !== t.blockId), n.recentTabs.unshift(t), n.recentTabs.length > n.maxRecords && (n.recentTabs = n.recentTabs.slice(0, n.maxRecords)), n.lastUpdated = Date.now(), await this.saveRecentTabSwitchHistory(i), this.verboseLog(`📝 更新全局切换历史: ${e} -> ${t.title} (历史记录数量: ${n.recentTabs.length})`);
    } catch (i) {
      this.warn("更新全局切换历史失败:", i);
    }
  }
  /**
   * 获取指定标签的最近切换历史
   */
  async getTabSwitchHistory(e) {
    try {
      const t = await this.restoreRecentTabSwitchHistory(), i = t[e];
      return i && i.recentTabs ? (this.verboseLog(`📖 获取标签 ${e} 的切换历史: ${i.recentTabs.length} 个记录`), i.recentTabs) : (this.verboseLog(`📖 标签 ${e} 没有切换历史记录，存储中的所有历史ID: ${Object.keys(t).join(", ")}`), []);
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
      await this.storageService.removeConfig(C.FIRST_PANEL_TABS), await this.storageService.removeConfig(C.CLOSED_TABS), await this.storageService.removeConfig(C.RECENT_TAB_SWITCH_HISTORY), this.log("🗑️ 已删除API配置缓存: 标签页数据、已关闭标签列表和切换历史");
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
      for (const [i, a] of Object.entries(e))
        if (a.recentTabs.length > $.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS) {
          const n = a.recentTabs.length;
          a.recentTabs = a.recentTabs.slice(0, $.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS), a.maxRecords = $.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS, t += n - a.recentTabs.length, this.log(`🧹 清理历史记录 ${i}: ${n} -> ${a.recentTabs.length}`);
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
    for (let i = 0; i < e.length; i++) {
      const a = e.charCodeAt(i);
      t = (t << 5) - t + a, t = t & t;
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
const He = 6048e5, ht = 864e5, Ee = Symbol.for("constructDateFrom");
function M(r, e) {
  return typeof r == "function" ? r(e) : r && typeof r == "object" && Ee in r ? r[Ee](e) : r instanceof Date ? new r.constructor(e) : new Date(e);
}
function B(r, e) {
  return M(e || r, r);
}
function Oe(r, e, t) {
  const i = B(r, t == null ? void 0 : t.in);
  return isNaN(e) ? M(r, NaN) : (e && i.setDate(i.getDate() + e), i);
}
let ut = {};
function he() {
  return ut;
}
function ne(r, e) {
  var s, c, l, d;
  const t = he(), i = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (s = e == null ? void 0 : e.locale) == null ? void 0 : s.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, a = B(r, e == null ? void 0 : e.in), n = a.getDay(), o = (n < i ? 7 : 0) + n - i;
  return a.setDate(a.getDate() - o), a.setHours(0, 0, 0, 0), a;
}
function se(r, e) {
  return ne(r, { ...e, weekStartsOn: 1 });
}
function Fe(r, e) {
  const t = B(r, e == null ? void 0 : e.in), i = t.getFullYear(), a = M(t, 0);
  a.setFullYear(i + 1, 0, 4), a.setHours(0, 0, 0, 0);
  const n = se(a), o = M(t, 0);
  o.setFullYear(i, 0, 4), o.setHours(0, 0, 0, 0);
  const s = se(o);
  return t.getTime() >= n.getTime() ? i + 1 : t.getTime() >= s.getTime() ? i : i - 1;
}
function Ie(r) {
  const e = B(r), t = new Date(
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
function _e(r, ...e) {
  const t = M.bind(
    null,
    e.find((i) => typeof i == "object")
  );
  return e.map(t);
}
function ce(r, e) {
  const t = B(r, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function bt(r, e, t) {
  const [i, a] = _e(
    t == null ? void 0 : t.in,
    r,
    e
  ), n = ce(i), o = ce(a), s = +n - Ie(n), c = +o - Ie(o);
  return Math.round((s - c) / ht);
}
function gt(r, e) {
  const t = Fe(r, e), i = M(r, 0);
  return i.setFullYear(t, 0, 4), i.setHours(0, 0, 0, 0), se(i);
}
function we(r) {
  return M(r, Date.now());
}
function Ce(r, e, t) {
  const [i, a] = _e(
    t == null ? void 0 : t.in,
    r,
    e
  );
  return +ce(i) == +ce(a);
}
function pt(r) {
  return r instanceof Date || typeof r == "object" && Object.prototype.toString.call(r) === "[object Date]";
}
function mt(r) {
  return !(!pt(r) && typeof r != "number" || isNaN(+B(r)));
}
function ft(r, e) {
  const t = B(r, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const vt = {
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
}, yt = (r, e, t) => {
  let i;
  const a = vt[r];
  return typeof a == "string" ? i = a : e === 1 ? i = a.one : i = a.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + i : i + " ago" : i;
};
function be(r) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : r.defaultWidth;
    return r.formats[t] || r.formats[r.defaultWidth];
  };
}
const xt = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Tt = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, wt = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ct = {
  date: be({
    formats: xt,
    defaultWidth: "full"
  }),
  time: be({
    formats: Tt,
    defaultWidth: "full"
  }),
  dateTime: be({
    formats: wt,
    defaultWidth: "full"
  })
}, kt = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Et = (r, e, t, i) => kt[r];
function Q(r) {
  return (e, t) => {
    const i = t != null && t.context ? String(t.context) : "standalone";
    let a;
    if (i === "formatting" && r.formattingValues) {
      const o = r.defaultFormattingWidth || r.defaultWidth, s = t != null && t.width ? String(t.width) : o;
      a = r.formattingValues[s] || r.formattingValues[o];
    } else {
      const o = r.defaultWidth, s = t != null && t.width ? String(t.width) : r.defaultWidth;
      a = r.values[s] || r.values[o];
    }
    const n = r.argumentCallback ? r.argumentCallback(e) : e;
    return a[n];
  };
}
const It = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, St = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Pt = {
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
}, $t = {
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
}, Lt = {
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
}, Dt = {
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
}, Mt = (r, e) => {
  const t = Number(r), i = t % 100;
  if (i > 20 || i < 10)
    switch (i % 10) {
      case 1:
        return t + "st";
      case 2:
        return t + "nd";
      case 3:
        return t + "rd";
    }
  return t + "th";
}, Bt = {
  ordinalNumber: Mt,
  era: Q({
    values: It,
    defaultWidth: "wide"
  }),
  quarter: Q({
    values: St,
    defaultWidth: "wide",
    argumentCallback: (r) => r - 1
  }),
  month: Q({
    values: Pt,
    defaultWidth: "wide"
  }),
  day: Q({
    values: $t,
    defaultWidth: "wide"
  }),
  dayPeriod: Q({
    values: Lt,
    defaultWidth: "wide",
    formattingValues: Dt,
    defaultFormattingWidth: "wide"
  })
};
function ee(r) {
  return (e, t = {}) => {
    const i = t.width, a = i && r.matchPatterns[i] || r.matchPatterns[r.defaultMatchWidth], n = e.match(a);
    if (!n)
      return null;
    const o = n[0], s = i && r.parsePatterns[i] || r.parsePatterns[r.defaultParseWidth], c = Array.isArray(s) ? Nt(s, (u) => u.test(o)) : (
      // [TODO] -- I challenge you to fix the type
      At(s, (u) => u.test(o))
    );
    let l;
    l = r.valueCallback ? r.valueCallback(c) : c, l = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(l)
    ) : l;
    const d = e.slice(o.length);
    return { value: l, rest: d };
  };
}
function At(r, e) {
  for (const t in r)
    if (Object.prototype.hasOwnProperty.call(r, t) && e(r[t]))
      return t;
}
function Nt(r, e) {
  for (let t = 0; t < r.length; t++)
    if (e(r[t]))
      return t;
}
function Wt(r) {
  return (e, t = {}) => {
    const i = e.match(r.matchPattern);
    if (!i) return null;
    const a = i[0], n = e.match(r.parsePattern);
    if (!n) return null;
    let o = r.valueCallback ? r.valueCallback(n[0]) : n[0];
    o = t.valueCallback ? t.valueCallback(o) : o;
    const s = e.slice(a.length);
    return { value: o, rest: s };
  };
}
const zt = /^(\d+)(th|st|nd|rd)?/i, Ht = /\d+/i, Ot = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Ft = {
  any: [/^b/i, /^(a|c)/i]
}, _t = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Ut = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Rt = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, qt = {
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
}, Vt = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, Yt = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, jt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Gt = {
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
}, Xt = {
  ordinalNumber: Wt({
    matchPattern: zt,
    parsePattern: Ht,
    valueCallback: (r) => parseInt(r, 10)
  }),
  era: ee({
    matchPatterns: Ot,
    defaultMatchWidth: "wide",
    parsePatterns: Ft,
    defaultParseWidth: "any"
  }),
  quarter: ee({
    matchPatterns: _t,
    defaultMatchWidth: "wide",
    parsePatterns: Ut,
    defaultParseWidth: "any",
    valueCallback: (r) => r + 1
  }),
  month: ee({
    matchPatterns: Rt,
    defaultMatchWidth: "wide",
    parsePatterns: qt,
    defaultParseWidth: "any"
  }),
  day: ee({
    matchPatterns: Vt,
    defaultMatchWidth: "wide",
    parsePatterns: Yt,
    defaultParseWidth: "any"
  }),
  dayPeriod: ee({
    matchPatterns: jt,
    defaultMatchWidth: "any",
    parsePatterns: Gt,
    defaultParseWidth: "any"
  })
}, Kt = {
  code: "en-US",
  formatDistance: yt,
  formatLong: Ct,
  formatRelative: Et,
  localize: Bt,
  match: Xt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Jt(r, e) {
  const t = B(r, e == null ? void 0 : e.in);
  return bt(t, ft(t)) + 1;
}
function Zt(r, e) {
  const t = B(r, e == null ? void 0 : e.in), i = +se(t) - +gt(t);
  return Math.round(i / He) + 1;
}
function Ue(r, e) {
  var d, u, h, b;
  const t = B(r, e == null ? void 0 : e.in), i = t.getFullYear(), a = he(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((u = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? a.firstWeekContainsDate ?? ((b = (h = a.locale) == null ? void 0 : h.options) == null ? void 0 : b.firstWeekContainsDate) ?? 1, o = M((e == null ? void 0 : e.in) || r, 0);
  o.setFullYear(i + 1, 0, n), o.setHours(0, 0, 0, 0);
  const s = ne(o, e), c = M((e == null ? void 0 : e.in) || r, 0);
  c.setFullYear(i, 0, n), c.setHours(0, 0, 0, 0);
  const l = ne(c, e);
  return +t >= +s ? i + 1 : +t >= +l ? i : i - 1;
}
function Qt(r, e) {
  var s, c, l, d;
  const t = he(), i = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((c = (s = e == null ? void 0 : e.locale) == null ? void 0 : s.options) == null ? void 0 : c.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, a = Ue(r, e), n = M((e == null ? void 0 : e.in) || r, 0);
  return n.setFullYear(a, 0, i), n.setHours(0, 0, 0, 0), ne(n, e);
}
function ei(r, e) {
  const t = B(r, e == null ? void 0 : e.in), i = +ne(t, e) - +Qt(t, e);
  return Math.round(i / He) + 1;
}
function I(r, e) {
  const t = r < 0 ? "-" : "", i = Math.abs(r).toString().padStart(e, "0");
  return t + i;
}
const z = {
  // Year
  y(r, e) {
    const t = r.getFullYear(), i = t > 0 ? t : 1 - t;
    return I(e === "yy" ? i % 100 : i, e.length);
  },
  // Month
  M(r, e) {
    const t = r.getMonth();
    return e === "M" ? String(t + 1) : I(t + 1, 2);
  },
  // Day of the month
  d(r, e) {
    return I(r.getDate(), e.length);
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
    return I(r.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(r, e) {
    return I(r.getHours(), e.length);
  },
  // Minute
  m(r, e) {
    return I(r.getMinutes(), e.length);
  },
  // Second
  s(r, e) {
    return I(r.getSeconds(), e.length);
  },
  // Fraction of second
  S(r, e) {
    const t = e.length, i = r.getMilliseconds(), a = Math.trunc(
      i * Math.pow(10, t - 3)
    );
    return I(a, e.length);
  }
}, j = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Se = {
  // Era
  G: function(r, e, t) {
    const i = r.getFullYear() > 0 ? 1 : 0;
    switch (e) {
      case "G":
      case "GG":
      case "GGG":
        return t.era(i, { width: "abbreviated" });
      case "GGGGG":
        return t.era(i, { width: "narrow" });
      case "GGGG":
      default:
        return t.era(i, { width: "wide" });
    }
  },
  // Year
  y: function(r, e, t) {
    if (e === "yo") {
      const i = r.getFullYear(), a = i > 0 ? i : 1 - i;
      return t.ordinalNumber(a, { unit: "year" });
    }
    return z.y(r, e);
  },
  // Local week-numbering year
  Y: function(r, e, t, i) {
    const a = Ue(r, i), n = a > 0 ? a : 1 - a;
    if (e === "YY") {
      const o = n % 100;
      return I(o, 2);
    }
    return e === "Yo" ? t.ordinalNumber(n, { unit: "year" }) : I(n, e.length);
  },
  // ISO week-numbering year
  R: function(r, e) {
    const t = Fe(r);
    return I(t, e.length);
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
    return I(t, e.length);
  },
  // Quarter
  Q: function(r, e, t) {
    const i = Math.ceil((r.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(i);
      case "QQ":
        return I(i, 2);
      case "Qo":
        return t.ordinalNumber(i, { unit: "quarter" });
      case "QQQ":
        return t.quarter(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return t.quarter(i, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return t.quarter(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(r, e, t) {
    const i = Math.ceil((r.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(i);
      case "qq":
        return I(i, 2);
      case "qo":
        return t.ordinalNumber(i, { unit: "quarter" });
      case "qqq":
        return t.quarter(i, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return t.quarter(i, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return t.quarter(i, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(r, e, t) {
    const i = r.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return z.M(r, e);
      case "Mo":
        return t.ordinalNumber(i + 1, { unit: "month" });
      case "MMM":
        return t.month(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return t.month(i, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return t.month(i, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(r, e, t) {
    const i = r.getMonth();
    switch (e) {
      case "L":
        return String(i + 1);
      case "LL":
        return I(i + 1, 2);
      case "Lo":
        return t.ordinalNumber(i + 1, { unit: "month" });
      case "LLL":
        return t.month(i, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return t.month(i, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return t.month(i, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(r, e, t, i) {
    const a = ei(r, i);
    return e === "wo" ? t.ordinalNumber(a, { unit: "week" }) : I(a, e.length);
  },
  // ISO week of year
  I: function(r, e, t) {
    const i = Zt(r);
    return e === "Io" ? t.ordinalNumber(i, { unit: "week" }) : I(i, e.length);
  },
  // Day of the month
  d: function(r, e, t) {
    return e === "do" ? t.ordinalNumber(r.getDate(), { unit: "date" }) : z.d(r, e);
  },
  // Day of year
  D: function(r, e, t) {
    const i = Jt(r);
    return e === "Do" ? t.ordinalNumber(i, { unit: "dayOfYear" }) : I(i, e.length);
  },
  // Day of week
  E: function(r, e, t) {
    const i = r.getDay();
    switch (e) {
      case "E":
      case "EE":
      case "EEE":
        return t.day(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return t.day(i, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return t.day(i, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return t.day(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(r, e, t, i) {
    const a = r.getDay(), n = (a - i.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(n);
      case "ee":
        return I(n, 2);
      case "eo":
        return t.ordinalNumber(n, { unit: "day" });
      case "eee":
        return t.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return t.day(a, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return t.day(a, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return t.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(r, e, t, i) {
    const a = r.getDay(), n = (a - i.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(n);
      case "cc":
        return I(n, e.length);
      case "co":
        return t.ordinalNumber(n, { unit: "day" });
      case "ccc":
        return t.day(a, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return t.day(a, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return t.day(a, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return t.day(a, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(r, e, t) {
    const i = r.getDay(), a = i === 0 ? 7 : i;
    switch (e) {
      case "i":
        return String(a);
      case "ii":
        return I(a, e.length);
      case "io":
        return t.ordinalNumber(a, { unit: "day" });
      case "iii":
        return t.day(i, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return t.day(i, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return t.day(i, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return t.day(i, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(r, e, t) {
    const a = r.getHours() / 12 >= 1 ? "pm" : "am";
    switch (e) {
      case "a":
      case "aa":
        return t.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return t.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return t.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return t.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(r, e, t) {
    const i = r.getHours();
    let a;
    switch (i === 12 ? a = j.noon : i === 0 ? a = j.midnight : a = i / 12 >= 1 ? "pm" : "am", e) {
      case "b":
      case "bb":
        return t.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return t.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return t.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return t.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(r, e, t) {
    const i = r.getHours();
    let a;
    switch (i >= 17 ? a = j.evening : i >= 12 ? a = j.afternoon : i >= 4 ? a = j.morning : a = j.night, e) {
      case "B":
      case "BB":
      case "BBB":
        return t.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return t.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return t.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(r, e, t) {
    if (e === "ho") {
      let i = r.getHours() % 12;
      return i === 0 && (i = 12), t.ordinalNumber(i, { unit: "hour" });
    }
    return z.h(r, e);
  },
  // Hour [0-23]
  H: function(r, e, t) {
    return e === "Ho" ? t.ordinalNumber(r.getHours(), { unit: "hour" }) : z.H(r, e);
  },
  // Hour [0-11]
  K: function(r, e, t) {
    const i = r.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(i, { unit: "hour" }) : I(i, e.length);
  },
  // Hour [1-24]
  k: function(r, e, t) {
    let i = r.getHours();
    return i === 0 && (i = 24), e === "ko" ? t.ordinalNumber(i, { unit: "hour" }) : I(i, e.length);
  },
  // Minute
  m: function(r, e, t) {
    return e === "mo" ? t.ordinalNumber(r.getMinutes(), { unit: "minute" }) : z.m(r, e);
  },
  // Second
  s: function(r, e, t) {
    return e === "so" ? t.ordinalNumber(r.getSeconds(), { unit: "second" }) : z.s(r, e);
  },
  // Fraction of second
  S: function(r, e) {
    return z.S(r, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(r, e, t) {
    const i = r.getTimezoneOffset();
    if (i === 0)
      return "Z";
    switch (e) {
      case "X":
        return $e(i);
      case "XXXX":
      case "XX":
        return V(i);
      case "XXXXX":
      case "XXX":
      default:
        return V(i, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(r, e, t) {
    const i = r.getTimezoneOffset();
    switch (e) {
      case "x":
        return $e(i);
      case "xxxx":
      case "xx":
        return V(i);
      case "xxxxx":
      case "xxx":
      default:
        return V(i, ":");
    }
  },
  // Timezone (GMT)
  O: function(r, e, t) {
    const i = r.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + Pe(i, ":");
      case "OOOO":
      default:
        return "GMT" + V(i, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(r, e, t) {
    const i = r.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + Pe(i, ":");
      case "zzzz":
      default:
        return "GMT" + V(i, ":");
    }
  },
  // Seconds timestamp
  t: function(r, e, t) {
    const i = Math.trunc(+r / 1e3);
    return I(i, e.length);
  },
  // Milliseconds timestamp
  T: function(r, e, t) {
    return I(+r, e.length);
  }
};
function Pe(r, e = "") {
  const t = r > 0 ? "-" : "+", i = Math.abs(r), a = Math.trunc(i / 60), n = i % 60;
  return n === 0 ? t + String(a) : t + String(a) + e + I(n, 2);
}
function $e(r, e) {
  return r % 60 === 0 ? (r > 0 ? "-" : "+") + I(Math.abs(r) / 60, 2) : V(r, e);
}
function V(r, e = "") {
  const t = r > 0 ? "-" : "+", i = Math.abs(r), a = I(Math.trunc(i / 60), 2), n = I(i % 60, 2);
  return t + a + e + n;
}
const Le = (r, e) => {
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
}, Re = (r, e) => {
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
}, ti = (r, e) => {
  const t = r.match(/(P+)(p+)?/) || [], i = t[1], a = t[2];
  if (!a)
    return Le(r, e);
  let n;
  switch (i) {
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
  return n.replace("{{date}}", Le(i, e)).replace("{{time}}", Re(a, e));
}, ii = {
  p: Re,
  P: ti
}, ai = /^D+$/, ni = /^Y+$/, ri = ["D", "DD", "YY", "YYYY"];
function oi(r) {
  return ai.test(r);
}
function si(r) {
  return ni.test(r);
}
function ci(r, e, t) {
  const i = li(r, e, t);
  if (console.warn(i), ri.includes(r)) throw new RangeError(i);
}
function li(r, e, t) {
  const i = r[0] === "Y" ? "years" : "days of the month";
  return `Use \`${r.toLowerCase()}\` instead of \`${r}\` (in \`${e}\`) for formatting ${i} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const di = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, hi = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, ui = /^'([^]*?)'?$/, bi = /''/g, gi = /[a-zA-Z]/;
function F(r, e, t) {
  var d, u, h, b;
  const i = he(), a = i.locale ?? Kt, n = i.firstWeekContainsDate ?? ((u = (d = i.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, o = i.weekStartsOn ?? ((b = (h = i.locale) == null ? void 0 : h.options) == null ? void 0 : b.weekStartsOn) ?? 0, s = B(r, t == null ? void 0 : t.in);
  if (!mt(s))
    throw new RangeError("Invalid time value");
  let c = e.match(hi).map((p) => {
    const m = p[0];
    if (m === "p" || m === "P") {
      const g = ii[m];
      return g(p, a.formatLong);
    }
    return p;
  }).join("").match(di).map((p) => {
    if (p === "''")
      return { isToken: !1, value: "'" };
    const m = p[0];
    if (m === "'")
      return { isToken: !1, value: pi(p) };
    if (Se[m])
      return { isToken: !0, value: p };
    if (m.match(gi))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: p };
  });
  a.localize.preprocessor && (c = a.localize.preprocessor(s, c));
  const l = {
    firstWeekContainsDate: n,
    weekStartsOn: o,
    locale: a
  };
  return c.map((p) => {
    if (!p.isToken) return p.value;
    const m = p.value;
    (si(m) || oi(m)) && ci(m, e, String(r));
    const g = Se[m[0]];
    return g(s, m, a.localize, l);
  }).join("");
}
function pi(r) {
  const e = r.match(ui);
  return e ? e[1].replace(bi, "'") : r;
}
function mi(r, e) {
  return Ce(
    M(r, r),
    we(r)
  );
}
function fi(r, e) {
  return Ce(
    r,
    Oe(we(r), 1),
    e
  );
}
function vi(r, e, t) {
  return Oe(r, -1, t);
}
function yi(r, e) {
  return Ce(
    M(r, r),
    vi(we(r))
  );
}
function xi(r) {
  try {
    let e = orca.state.settings[Ne.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), mi(r))
      return "今天";
    if (yi(r))
      return "昨天";
    if (fi(r))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const i = r.getDay(), n = ["日", "一", "二", "三", "四", "五", "六"][i], o = e.replace(/E/g, n);
          return F(r, o);
        } else
          return F(r, e);
      else
        return F(r, e);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const a of i)
        try {
          return F(r, a);
        } catch {
          continue;
        }
      return r.toLocaleDateString();
    }
  } catch {
    return r.toLocaleDateString();
  }
}
function qe(r) {
  try {
    const e = me(r, "_repr");
    if (!e || e.type !== We.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch {
    return null;
  }
}
async function ge(r) {
  try {
    if (qe(r))
      return "journal";
    if (r["data-type"]) {
      const i = r["data-type"];
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
      }[i] || i;
    }
    if (r.aliases && r.aliases.length > 0 && r.aliases[0])
      try {
        const a = me(r, "_hide");
        return a && a.value ? "page" : "tag";
      } catch {
        return "tag";
      }
    const t = me(r, "_repr");
    if (t && t.type === We.JSON && t.value)
      try {
        const i = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
        if (i.type)
          return i.type;
      } catch {
      }
    if (r.content && Array.isArray(r.content)) {
      if (r.content.some(
        (s) => s && typeof s == "object" && s.type === "code"
      ))
        return "code";
      if (r.content.some(
        (s) => s && typeof s == "object" && s.type === "table"
      ))
        return "table";
      if (r.content.some(
        (s) => s && typeof s == "object" && s.type === "image"
      ))
        return "image";
      if (r.content.some(
        (s) => s && typeof s == "object" && s.type === "link"
      ))
        return "link";
    }
    if (r.text) {
      const i = r.text.trim();
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
    return "default";
  } catch {
    return "default";
  }
}
function te(r) {
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
    const i = Ti(r);
    i && (t = i);
  }
  return t || (t = e.default), t;
}
function Ti(r) {
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
  for (const [i, a] of Object.entries(t))
    if (e.includes(i))
      return a;
  return null;
}
function me(r, e) {
  return !r.properties || !Array.isArray(r.properties) ? null : r.properties.find((t) => t.name === e);
}
function wi(r) {
  if (!Array.isArray(r) || r.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const i of r)
    i && typeof i == "object" && (i.t === "text" && i.v ? e++ : i.t === "ref" && i.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function Ci(r) {
  if (!r || r.length === 0) return "";
  let e = "";
  for (const t of r)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
let oe = !0;
function ki(r) {
  oe = r;
}
function Z(r) {
  if (!r) return !0;
  if (r.classList && (r.classList.contains("orca-hideable-hidden") || r.id === "sidebar"))
    return oe && console.debug("[ContentVisibilityHelper] 跳过操作：已知隐藏元素", r), !0;
  let e = r.parentElement;
  for (; e && e !== document.body; ) {
    if (e.classList && (e.classList.contains("orca-hideable-hidden") || e.id === "sidebar"))
      return oe && console.debug("[ContentVisibilityHelper] 跳过操作：父元素为已知隐藏元素", e), !0;
    e = e.parentElement;
  }
  try {
    const t = window.getComputedStyle(r);
    return t.getPropertyValue("content-visibility") === "hidden" ? (oe && console.debug("[ContentVisibilityHelper] 跳过操作：元素有 content-visibility: hidden", r), !0) : t.getPropertyValue("display") === "none" || t.getPropertyValue("visibility") === "hidden" || t.getPropertyValue("opacity") === "0";
  } catch {
    return !1;
  }
}
function Ve(r, e) {
  if (!r || Z(r))
    return !1;
  try {
    return r.style.cssText = e, !0;
  } catch {
    return !1;
  }
}
function ke(r) {
  if (!r || r.classList && (r.classList.contains("orca-hideable-hidden") || r.id === "sidebar"))
    return null;
  let e = r.parentElement;
  for (; e && e !== document.body; ) {
    if (e.classList && (e.classList.contains("orca-hideable-hidden") || e.id === "sidebar"))
      return null;
    e = e.parentElement;
  }
  try {
    const t = window.getComputedStyle(r);
    return t.getPropertyValue("content-visibility") === "hidden" || t.getPropertyValue("display") === "none" ? null : t;
  } catch {
    return null;
  }
}
function Ei(r) {
  const e = ke(r);
  if (!e)
    return null;
  try {
    const t = parseFloat(e.left), i = parseFloat(e.top);
    return { left: t, top: i };
  } catch {
    return null;
  }
}
function W(r, e) {
  if (Z(r))
    return console.debug("[ContentVisibilityHelper] 安全阻止了可能触发渲染警告的操作", r), !1;
  try {
    const t = ke(r);
    return !t || t.getPropertyValue("content-visibility") === "hidden" ? (console.debug("[ContentVisibilityHelper] 二次检查发现隐藏元素，阻止操作", r), !1) : (e(), !0);
  } catch (t) {
    return console.debug("[ContentVisibilityHelper] 渲染操作失败:", t), !1;
  }
}
function Ii(r, e, t, i) {
  const a = document.createElement("div");
  a.className = "orca-tabs-ref-menu-item", a.setAttribute("role", "menuitem"), a.style.cssText = `
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
  `, a.appendChild(n), a.appendChild(o), t && t.trim() !== "") {
    const s = document.createElement("span");
    s.textContent = t, s.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, a.appendChild(s);
  }
  return a.addEventListener("mouseenter", () => {
    a.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), a.addEventListener("mouseleave", () => {
    a.style.backgroundColor = "transparent";
  }), a.addEventListener("click", (s) => {
    s.preventDefault(), s.stopPropagation(), i();
    const c = a.closest('.orca-context-menu, .context-menu, [role="menu"]');
    c && (c.style.display = "none", c.remove());
  }), a;
}
function Si(r, e, t) {
  r.addEventListener("mouseenter", () => {
    r.style.cssText += e;
  }), r.addEventListener("mouseleave", () => {
    r.style.cssText = t;
  });
}
function Ye(r) {
  r && r.parentNode && r.parentNode.removeChild(r);
}
function Pi(r, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(r);
  if (t) {
    const i = parseInt(t[1], 16), a = parseInt(t[2], 16), n = parseInt(t[3], 16);
    return `rgba(${i}, ${a}, ${n}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function De(r, e, t, i, a) {
  let n = "var(--orca-tab-bg)", o = "var(--orca-color-text-1)", s = "normal", c = "";
  if (r.color)
    try {
      c = `--tab-color: ${r.color.startsWith("#") ? r.color : `#${r.color}`};`, n = "var(--orca-tab-colored-bg)", o = "var(--orca-tab-colored-text)", s = "600";
    } catch {
    }
  return e ? `
    ${c}
    background: ${n};
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
    background: ${n};
    color: ${o};
    font-weight: ${s};
    padding: 2px 8px;
    border-radius: var(--orca-radius-md);
    height: 24px;
    max-height: 24px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    max-width: ${i || 130}px;
    min-width: ${a || 80}px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform, margin, opacity, max-width, min-width;
  `;
}
function $i() {
  const r = document.createElement("div");
  return r.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, r;
}
function Li(r) {
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
function Di(r) {
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
    if (!Z(e)) {
      const i = e.offsetWidth;
      t.scrollWidth > i && (t.style.mask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.webkitMask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.maskSize = "100% 100%", t.style.webkitMaskSize = "100% 100%", t.style.maskRepeat = "no-repeat", t.style.webkitMaskRepeat = "no-repeat");
    }
  }), e;
}
function Mi() {
  const r = document.createElement("span");
  return r.textContent = "📌", r.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, r;
}
function Bi() {
  const r = document.createElement("div");
  return r.className = "tab-close-btn", r.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', r;
}
function ie(r, e, t = 180, i = 200) {
  const a = window.innerWidth, n = window.innerHeight, o = 10;
  let s = r, c = e;
  return s + t > a - o && (s = a - t - o), c + i > n - o && (c = n - i - o, c < e - i && (c = e - i - 5)), s < o && (s = o), c < o && (c = e + 5), s = Math.max(o, Math.min(s, a - t - o)), c = Math.max(o, Math.min(c, n - i - o)), { x: s, y: c };
}
function je() {
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
function le(r = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[r];
}
function fe() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function ae(r, e, t, i, a, n, o, s) {
  return r && o ? s ? `
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
        width: ${i || 200}px;
        min-width: 120px;
        max-width: 400px;
        align-items: stretch;
        overflow-y: auto;
        overflow-x: hidden;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        opacity: 1;
        transform: scale(1);
      ` : `
        position: fixed;
        top: ${e.y}px;
        left: ${e.x}px;
        z-index: 300;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        background: ${t};
        border-radius: 50%;
        padding: 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        user-select: none;
        pointer-events: auto;
        -webkit-app-region: no-drag;
        app-region: no-drag;
        width: 32px;
        height: 32px;
        min-width: 32px;
        max-width: 32px;
        overflow: clip;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        opacity: 1;
        transform: scale(1);
      ` : r ? `
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
    width: ${i || 200}px;
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
var L = /* @__PURE__ */ ((r) => (r[r.ERROR = 0] = "ERROR", r[r.WARN = 1] = "WARN", r[r.INFO = 2] = "INFO", r[r.DEBUG = 3] = "DEBUG", r[r.VERBOSE = 4] = "VERBOSE", r))(L || {});
const Ge = 1, K = class K {
  /**
   * 设置当前日志级别
   */
  static setLogLevel(e) {
    K.currentLogLevel = e;
  }
  /**
   * 获取当前日志级别
   */
  static getLogLevel() {
    return K.currentLogLevel;
  }
  /**
   * 检查是否应该输出指定级别的日志
   */
  static shouldLog(e) {
    return K.currentLogLevel >= e;
  }
};
y(K, "currentLogLevel", Ge);
let Y = K;
function pe(r, ...e) {
  Y.shouldLog(
    2
    /* INFO */
  ) && console.info("[OrcaPlugin]", r, ...e);
}
function Ai(r, ...e) {
  Y.shouldLog(
    0
    /* ERROR */
  ) && console.error("[OrcaPlugin]", r, ...e);
}
function Ni(r, ...e) {
  Y.shouldLog(
    1
    /* WARN */
  ) && console.warn("[OrcaPlugin]", r, ...e);
}
function q(r, ...e) {
  Y.shouldLog(
    4
    /* VERBOSE */
  ) && console.log("[OrcaPlugin]", r, ...e);
}
function Wi(r, e, t, i, a, n) {
  const o = document.createElement("div");
  o.className = r ? "orca-tabs-plugin orca-tabs-container vertical" : "orca-tabs-plugin orca-tabs-container";
  const s = ae(
    r,
    e,
    i,
    t,
    void 0,
    void 0,
    a,
    n
  );
  return Ve(o, s), o;
}
function zi(r, e, t) {
  const i = document.createElement("div");
  return i.className = "feature-toggle-button", i.innerHTML = e ? "🔒" : "🔓", i.title = e ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)", Ve(i, r ? `
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
  `), i.addEventListener("click", t), Si(i, e ? "#006600" : "#666", e ? "#004400" : "#333"), i;
}
function Hi(r, e, t) {
  const i = document.createElement("div");
  i.className = "hover-tab-list-container";
  const a = `
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
  i.style.cssText = a;
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
    const s = document.createElement("style");
    s.id = "hover-tab-list-styles", s.textContent = o, document.head.appendChild(s);
  }
  return i.appendChild(n), requestAnimationFrame(() => {
    i.style.opacity = "1", i.style.transform = "translateY(0)";
  }), i;
}
function Oi(r, e, t, i, a) {
  const n = document.createElement("div");
  n.className = "hover-tab-item", n.setAttribute("data-tab-id", r.tabId || r.blockId);
  const o = t.maxDisplayCount - 1, s = Math.max(t.minOpacity, 1 - e / o * (1 - t.minOpacity)), c = Math.max(t.minScale, 1 - e / o * (1 - t.minScale)), l = `
    display: flex;
    align-items: center;
    padding: 6px 8px;
    margin: 2px 0;
    border-radius: var(--orca-radius-sm, 4px);
    cursor: pointer;
    transition: all ${t.animationDuration}ms ease;
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
    h.stopPropagation(), i(r);
  }), n.addEventListener("mouseenter", () => {
    n.style.background = "var(--orca-bg-hover, rgba(0, 0, 0, 0.05))", n.style.transform = `scale(${Math.min(1, c + 0.05)})`;
  }), n.addEventListener("mouseleave", () => {
    n.style.background = "transparent", n.style.transform = `scale(${c})`;
  }), n;
}
function ve(r, e, t, i, a, n = 0) {
  const o = r.querySelector(".hover-tab-list-scroll");
  if (!o) return;
  o.innerHTML = "";
  const s = n, c = Math.min(s + t.maxDisplayCount, e.length);
  e.slice(s, c).forEach((d, u) => {
    const h = Oi(d, u, t, i);
    o.appendChild(h);
  }), n > 0 && (o.scrollTop = n * 32);
}
function Me(r, e, t, i, a) {
  q("🎨 showHoverTabList 被调用", { tabs: r.length, position: e, config: t });
  const n = document.querySelector(".hover-tab-list-container");
  n && (q("🗑️ 移除现有的悬浮列表"), Ye(n)), q("🏗️ 创建新容器");
  const o = Hi(t, e);
  return q("📦 容器创建完成", o), document.body && W(document.body, () => {
    document.body.appendChild(o);
  }), q("📄 容器已添加到页面"), q("🔄 更新内容"), ve(o, r, t, i), q("✅ 内容更新完成"), o;
}
function H() {
  const r = document.querySelector(".hover-tab-list-container");
  r && (r.style.opacity = "0", r.style.transform = "translateY(-10px)", setTimeout(() => {
    Ye(r);
  }, 200));
}
const ye = /* @__PURE__ */ new WeakMap();
function D(r, e) {
  if (!r || !e.text)
    return;
  let t = null, i = null;
  const a = (c) => {
    i = setTimeout(() => {
      if (!r.isConnected || !document.body.contains(r))
        return;
      const l = r.getBoundingClientRect();
      !l || l.width === 0 || l.height === 0 || l.top === 0 && l.left === 0 && l.bottom === 0 && l.right === 0 || (t || (t = document.createElement("div"), t.className = `orca-tooltip ${e.className || ""}`, (e.shortcut ? `${e.text} (${e.shortcut})` : e.text).split(`
`).forEach((u, h) => {
        h > 0 && t.appendChild(document.createElement("br")), t.appendChild(document.createTextNode(u));
      }), t.style.cssText = `
          position: absolute;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        `, document.body.appendChild(t)), t.style.opacity = "1", t.style.visibility = "hidden", requestAnimationFrame(() => {
        if (!t || !t.parentNode) return;
        const d = t.getBoundingClientRect();
        if (!d || d.width === 0 || d.height === 0) {
          n();
          return;
        }
        let u = 0, h = 0, b = e.defaultPlacement || "top";
        const p = window.innerWidth, m = window.innerHeight, g = 8, f = (w) => {
          let T = 0, x = 0;
          switch (w) {
            case "top":
              T = l.left + (l.width - d.width) / 2, x = l.top - d.height - 8;
              break;
            case "bottom":
              T = l.left + (l.width - d.width) / 2, x = l.bottom + 8;
              break;
            case "left":
              T = l.left - d.width - 8, x = l.top + (l.height - d.height) / 2;
              break;
            case "right":
              T = l.right + 8, x = l.top + (l.height - d.height) / 2;
              break;
          }
          return { x: T, y: x };
        }, v = (w) => {
          const { x: T, y: x } = f(w);
          return T >= g && T + d.width <= p - g && x >= g && x + d.height <= m - g;
        };
        if (v(b)) {
          const w = f(b);
          u = w.x, h = w.y;
        } else {
          const w = b === "bottom" ? ["top", "left", "right"] : b === "top" ? ["bottom", "left", "right"] : b === "left" ? ["right", "top", "bottom"] : ["left", "top", "bottom"];
          let T = !1;
          for (const x of w)
            if (v(x)) {
              const E = f(x);
              u = E.x, h = E.y, b = x, T = !0;
              break;
            }
          if (!T) {
            const x = f(b);
            u = x.x, h = x.y;
          }
        }
        if (u < g ? u = g : u + d.width > p - g && (u = p - d.width - g), h < g ? h = g : h + d.height > m - g && (h = m - d.height - g), d.width > p - 2 * g && (u = g, t.style.maxWidth = `${p - 2 * g}px`), isNaN(u) || isNaN(h) || !isFinite(u) || !isFinite(h)) {
          console.warn("[Tooltip] Invalid position calculated, hiding tooltip"), n();
          return;
        }
        u = Math.max(0, u), h = Math.max(0, h), t.style.left = `${u}px`, t.style.top = `${h}px`, t.style.visibility = "visible";
      }));
    }, e.delay || 500);
  }, n = () => {
    var c;
    if (i && (clearTimeout(i), i = null), t) {
      try {
        t.parentNode && t.parentNode.removeChild(t);
      } catch (l) {
        console.warn("Tooltip removal failed, trying alternative method:", l), (c = t.remove) == null || c.call(t);
      }
      t = null;
    }
  }, o = (c) => {
    if (t && t.parentNode) {
      const l = r.getBoundingClientRect();
      (c.clientX < l.left - 10 || c.clientX > l.right + 10 || c.clientY < l.top - 10 || c.clientY > l.bottom + 10) && n();
    }
  };
  r.addEventListener("mouseenter", a), r.addEventListener("mouseleave", n), r.addEventListener("mousedown", n), r.addEventListener("mousemove", o);
  const s = () => {
    var c;
    if (i && clearTimeout(i), r.removeEventListener("mouseenter", a), r.removeEventListener("mouseleave", n), r.removeEventListener("mousedown", n), r.removeEventListener("mousemove", o), t) {
      try {
        t.parentNode && t.parentNode.removeChild(t);
      } catch (l) {
        console.warn("Tooltip cleanup failed, trying alternative method:", l), (c = t.remove) == null || c.call(t);
      }
      t = null;
    }
  };
  ye.set(r, s);
}
function Fi(r) {
  const e = ye.get(r);
  e && (e(), ye.delete(r));
}
function X(r, e) {
  return {
    text: r,
    shortcut: e,
    delay: 200,
    defaultPlacement: "bottom"
    // 按钮tooltip默认显示在下方
  };
}
function xe(r) {
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
function Te(r) {
  return {
    text: r,
    delay: 500,
    defaultPlacement: "bottom"
    // 状态tooltip默认显示在下方
  };
}
function _i() {
  document.querySelectorAll('[data-tooltip="true"]').forEach((e, t) => {
    const i = e.getAttribute("data-tooltip-text"), a = e.getAttribute("data-tooltip-shortcut"), n = e.getAttribute("data-tooltip-delay");
    if (i) {
      const o = {
        text: i,
        shortcut: a || void 0,
        delay: n ? parseInt(n) : void 0
      };
      D(e, o);
    }
  });
}
function re() {
  document.querySelectorAll(".orca-tooltip").forEach((i) => {
    var a;
    try {
      i.parentNode ? i.parentNode.removeChild(i) : (a = i.remove) == null || a.call(i);
    } catch (n) {
      console.warn("Failed to remove tooltip:", n);
    }
  }), document.querySelectorAll(".tooltip").forEach((i) => {
    var a;
    try {
      i.parentNode ? i.parentNode.removeChild(i) : (a = i.remove) == null || a.call(i);
    } catch (n) {
      console.warn("Failed to remove tooltip:", n);
    }
  }), document.querySelectorAll('[style*="position: absolute"]').forEach((i) => {
    var l;
    const a = Ei(i);
    if (!a)
      return;
    const n = ke(i);
    if (!n)
      return;
    const o = a.left, s = a.top;
    if (parseInt(n.zIndex) >= 1e4 && o < 20 && s < 20 && (i.classList.contains("orca-tooltip") || i.classList.contains("tooltip")))
      try {
        i.parentNode ? i.parentNode.removeChild(i) : (l = i.remove) == null || l.call(i), console.log("[Tooltip] Cleaned up suspicious tooltip at top-left corner");
      } catch (d) {
        console.warn("Failed to remove suspicious tooltip:", d);
      }
  });
}
function Xe() {
  setInterval(() => {
    re();
  }, 3e4);
}
function Ke() {
  window.addEventListener("beforeunload", () => {
    re();
  }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "hidden" && re();
  });
}
typeof window < "u" && (window.addTooltip = D, window.removeTooltip = Fi, window.createButtonTooltip = X, window.createTabTooltip = xe, window.createStatusTooltip = Te, window.cleanupAllTooltips = re, window.startTooltipCleanupTimer = Xe, window.setupPageUnloadCleanup = Ke);
function Ui(r) {
  for (let e = r.length - 1; e >= 0; e--)
    if (!r[e].isPinned)
      return e;
  return -1;
}
function Ri(r) {
  return [...r].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function qi(r, e, t, i) {
  return e ? {
    x: r.x,
    y: r.y,
    width: t,
    height: i
  } : {
    x: r.x,
    y: r.y,
    width: Math.min(800, window.innerWidth - r.x - 10),
    height: 28
  };
}
function Vi(r, e, t, i) {
  const a = qi(r, e, t, i);
  let n = r.x, o = r.y;
  return a.x < 0 ? n = 0 : a.x + a.width > window.innerWidth && (n = window.innerWidth - a.width), a.y < 0 ? o = 0 : a.y + a.height > window.innerHeight && (o = window.innerHeight - a.height), { x: n, y: o };
}
function Be(r, e, t = !1) {
  let i = null;
  const a = (...n) => {
    const o = t && !i;
    i && clearTimeout(i), i = window.setTimeout(() => {
      i = null, t || r(...n);
    }, e), o && r(...n);
  };
  return a.cancel = () => {
    i && (clearTimeout(i), i = null);
  }, a;
}
function Yi(r, e, t) {
  var i, a;
  try {
    const n = r.startsWith("#") ? r : `#${r}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(n))
      return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const o = parseInt(n.slice(1, 3), 16), s = parseInt(n.slice(3, 5), 16), c = parseInt(n.slice(5, 7), 16), l = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((a = (i = window.orca) == null ? void 0 : i.state) == null ? void 0 : a.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 1.05) c h)` : `oklch(from rgb(${o}, ${s}, ${c}) calc(l * 0.6) c h)`;
  } catch {
    return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
function Ae(r, e, t, i) {
  if (typeof e == "number" && typeof t == "function")
    return ji(r, e, t, i);
  if (typeof e == "function" && typeof t == "function")
    return Gi(r, e, t);
  throw new Error("Invalid parameters for createWidthAdjustmentDialog");
}
function ji(r, e, t, i) {
  const a = document.createElement("div");
  a.className = "width-adjustment-dialog";
  const n = je();
  a.style.cssText = n;
  const o = document.createElement("div");
  o.className = "dialog-title", o.textContent = "调整标签宽度", a.appendChild(o);
  const s = document.createElement("div");
  s.className = "dialog-slider-container", s.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const c = document.createElement("div");
  c.textContent = "最大宽度 (80px - 200px)", c.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: var(--orca-color-text-1);
  `;
  const l = document.createElement("input");
  l.type = "range", l.min = "80", l.max = "200", l.value = r.toString(), l.style.cssText = fe();
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
  const b = document.createElement("input");
  b.type = "range", b.min = "60", b.max = "150", b.value = e.toString(), b.style.cssText = fe();
  const p = document.createElement("div");
  p.className = "dialog-width-display", p.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: var(--orca-color-text-1);
  `, p.textContent = `最小宽度: ${e}px`;
  let m = null;
  const g = (T, x) => {
    m && clearTimeout(m), m = window.setTimeout(() => {
      t(T, x), m = null;
    }, 150);
  };
  l.oninput = () => {
    const T = parseInt(l.value), x = parseInt(b.value);
    T < x && (b.value = T.toString(), p.textContent = `最小宽度: ${T}px`), d.textContent = `最大宽度: ${T}px`;
    const E = parseInt(l.value), k = parseInt(b.value);
    g(E, k);
  }, b.oninput = () => {
    const T = parseInt(l.value), x = parseInt(b.value);
    x > T && (l.value = x.toString(), d.textContent = `最大宽度: ${x}px`), p.textContent = `最小宽度: ${x}px`;
    const E = parseInt(l.value), k = parseInt(b.value);
    g(E, k);
  }, s.appendChild(c), s.appendChild(l), s.appendChild(d), u.appendChild(h), u.appendChild(b), u.appendChild(p), a.appendChild(s), a.appendChild(u);
  const f = document.createElement("div");
  f.className = "dialog-buttons", f.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const v = document.createElement("button");
  v.className = "btn btn-primary", v.textContent = "确定", v.style.cssText = le(), v.onclick = () => {
    const T = parseInt(l.value), x = parseInt(b.value);
    t(T, x), de(a);
  };
  const w = document.createElement("button");
  return w.className = "btn btn-secondary", w.textContent = "取消", w.style.cssText = le(), w.onclick = () => {
    i && i(), de(a);
  }, f.appendChild(v), f.appendChild(w), a.appendChild(f), a;
}
function Gi(r, e, t) {
  const i = document.createElement("div");
  i.className = "width-adjustment-dialog";
  const a = je();
  i.style.cssText = a;
  const n = document.createElement("div");
  n.className = "dialog-title", n.textContent = "调整面板宽度", i.appendChild(n);
  const o = document.createElement("div");
  o.className = "dialog-slider-container", o.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const s = document.createElement("input");
  s.type = "range", s.min = "120", s.max = "800", s.value = r.toString(), s.style.cssText = fe();
  const c = document.createElement("div");
  c.className = "dialog-width-display", c.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, c.textContent = `当前宽度: ${r}px`, s.oninput = () => {
    const h = parseInt(s.value);
    c.textContent = `当前宽度: ${h}px`, e(h);
  }, o.appendChild(s), o.appendChild(c), i.appendChild(o);
  const l = document.createElement("div");
  l.className = "dialog-buttons", l.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = le(), d.onclick = () => de(i);
  const u = document.createElement("button");
  return u.className = "btn btn-secondary", u.textContent = "取消", u.style.cssText = le(), u.onclick = () => {
    t(), de(i);
  }, l.appendChild(d), l.appendChild(u), i.appendChild(l), i;
}
function de(r) {
  r && r.parentNode && r.parentNode.removeChild(r);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function Xi() {
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
function Ki(r, e) {
  return r.length !== e.length ? !0 : !r.every((t, i) => t === e[i]);
}
let O;
class Ji {
  /**
   * 构造函数
   * @param pluginName 插件名称
   */
  constructor(e) {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    /** 插件名称 - 动态获取的插件名称，用于API调用和存储 */
    y(this, "pluginName");
    // ==================== 重构的面板数据管理 ====================
    /** 面板顺序映射 - 存储面板ID和序号的映射关系，支持面板关闭后重新排序 */
    y(this, "panelOrder", []);
    /** 当前激活的面板ID - 通过.orca-panel.active获取 */
    y(this, "currentPanelId", null);
    /** 当前面板索引 - 在panelOrder数组中的索引位置 */
    y(this, "currentPanelIndex", -1);
    /** 每个面板的标签页数据 - 索引对应panelOrder数组，完全独立存储 */
    y(this, "panelTabsData", []);
    /** 存储服务实例 - 提供统一的数据存储接口，支持Orca API和localStorage降级 */
    y(this, "storageService", new Qe());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    y(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    y(this, "lastPanelCheckTime", 0);
    /** 上次面板块检查时间 - 用于防抖 checkCurrentPanelBlocks 调用 */
    y(this, "lastBlockCheckTime", 0);
    /** 防抖的面板发现方法 - 500ms延迟，避免频繁调用 */
    y(this, "discoverPanelsDebounced", null);
    /** 数据保存防抖定时器 - 用于合并频繁的保存操作 */
    y(this, "saveDataDebounceTimer", null);
    /** 数据保存防抖延迟（毫秒） - 性能优化：增加到500ms减少频繁保存 */
    y(this, "SAVE_DEBOUNCE_DELAY", 500);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 当前日志级别 */
    y(this, "currentLogLevel", Ge);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* UI元素和状态管理 - UI Elements and State Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== UI元素引用 ====================
    /** 标签页容器元素 - 包含所有标签页的主容器 */
    y(this, "tabContainer", null);
    /** 循环切换器元素 - 用于在面板间切换的UI元素 */
    y(this, "cycleSwitcher", null);
    // ==================== 拖拽状态 ====================
    /** 是否正在拖拽 - 标识当前是否处于拖拽状态 */
    y(this, "isDragging", !1);
    /** 是否正在切换标签 - 防止在标签切换过程中错误替换标签 */
    y(this, "isSwitchingTab", !1);
    /** 拖拽起始X坐标 - 记录拖拽开始时的鼠标X坐标 */
    y(this, "dragStartX", 0);
    /** 拖拽起始Y坐标 - 记录拖拽开始时的鼠标Y坐标 */
    y(this, "dragStartY", 0);
    // ==================== 配置参数 ====================
    /** 最大标签页数量 - 限制同时显示的标签页数量，从设置中读取 */
    y(this, "maxTabs", 10);
    /** 主页块ID - 主页块的唯一标识符，从设置中读取 */
    y(this, "homePageBlockId", null);
    /** 标签页位置 - 标签页容器的屏幕坐标位置 */
    y(this, "position", { x: 50, y: 50 });
    // ==================== 状态管理 ====================
    /** 监控定时器 - 用于定期检查面板状态和更新UI */
    y(this, "monitoringInterval", null);
    /** 焦点同步定时器 - 控制自动同步焦点的轮询逻辑 */
    y(this, "focusSyncInterval", null);
    /** 上一次焦点检测的状态 - 用于避免重复调用 checkCurrentPanelBlocks */
    y(this, "lastFocusState", null);
    /** 面板块检测任务 - 防止 checkCurrentPanelBlocks 并发执行 */
    y(this, "panelBlockCheckTask", null);
    /** 面板状态检测任务 - 防止 checkPanelStatusChange 并发执行 */
    y(this, "panelStatusCheckTask", null);
    /** 正在创建的标签 - 防止重复创建同一个标签 */
    y(this, "creatingTabs", /* @__PURE__ */ new Set());
    /** 全局事件监听器 - 统一的全局事件处理函数 */
    y(this, "globalEventListener", null);
    /** 更新防抖计时器 - 防止频繁更新UI的防抖机制 */
    y(this, "updateDebounceTimer", null);
    /** 面板索引更新防抖计时器 - 防止频繁更新面板索引 */
    y(this, "panelIndexUpdateTimer", null);
    /** 上次更新时间 - 记录最后一次UI更新的时间戳 */
    y(this, "lastUpdateTime", 0);
    /** 是否正在更新 - 标识当前是否正在进行UI更新操作 */
    y(this, "isUpdating", !1);
    /** 是否已完成初始化 - 标识插件是否已完成初始化过程 */
    y(this, "isInitialized", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 布局和位置管理 - Layout and Position Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 布局模式 ====================
    /** 垂直模式标志 - 标识当前是否处于垂直布局模式 */
    y(this, "isVerticalMode", !1);
    /** 垂直模式窗口宽度 - 垂直布局模式下的标签页容器宽度 */
    y(this, "verticalWidth", 120);
    /** 垂直模式位置 - 垂直布局模式下的标签页容器位置 */
    y(this, "verticalPosition", { x: 20, y: 20 });
    /** 水平模式位置 - 水平布局模式下的标签页容器位置 */
    y(this, "horizontalPosition", { x: 20, y: 20 });
    /** 水平布局标签最大宽度 - 水平布局下标签的最大宽度 */
    y(this, "horizontalTabMaxWidth", 130);
    /** 水平布局标签最小宽度 - 水平布局下标签的最小宽度 */
    y(this, "horizontalTabMinWidth", 80);
    // ==================== 调整大小状态 ====================
    /** 是否正在调整大小 - 标识当前是否正在进行大小调整操作 */
    y(this, "isResizing", !1);
    /** 是否固定到顶部 - 标识标签页容器是否固定到屏幕顶部 */
    y(this, "isFixedToTop", !1);
    /** 调整大小手柄 - 用于调整标签页容器大小的拖拽手柄元素 */
    y(this, "resizeHandle", null);
    // ==================== 侧边栏对齐 ====================
    /** 侧边栏对齐功能是否启用 - 控制是否自动与侧边栏对齐 */
    y(this, "isSidebarAlignmentEnabled", !1);
    /** 侧边栏状态监听器 - 监听侧边栏状态变化的MutationObserver */
    y(this, "sidebarAlignmentObserver", null);
    /** 上次检测到的侧边栏状态 - 用于检测侧边栏状态变化 */
    y(this, "lastSidebarState", null);
    /** 侧边栏防抖计时器 - 防止频繁响应侧边栏状态变化 */
    y(this, "sidebarDebounceTimer", null);
    // ==================== 贴边隐藏 ====================
    /** 贴边隐藏功能是否启用 - 控制是否启用贴边隐藏功能 */
    y(this, "enableEdgeHide", !1);
    /** 当前贴边的方向 - 检测到容器靠近哪个边缘（null表示不靠近任何边缘） */
    y(this, "currentEdgeSide", null);
    /** 贴边隐藏是否展开 - 标识贴边隐藏状态下容器是否处于展开状态 */
    y(this, "isEdgeHideExpanded", !1);
    /** 贴边隐藏展开延迟定时器 - 用于延迟展开贴边隐藏的容器 */
    y(this, "edgeHideExpandTimer", null);
    /** 贴边隐藏收起延迟定时器 - 用于延迟收起贴边隐藏的容器 */
    y(this, "edgeHideCollapseTimer", null);
    /** 贴边隐藏触发区域元素 - 透明的触发区域，用于鼠标悬停检测 */
    y(this, "edgeHideTriggerElement", null);
    /** 容器鼠标进入处理器 - 绑定的事件处理函数，用于移除监听器 */
    y(this, "boundContainerMouseEnter", null);
    /** 容器鼠标离开处理器 - 绑定的事件处理函数，用于移除监听器 */
    y(this, "boundContainerMouseLeave", null);
    // ==================== 气泡模式 ====================
    /** 气泡模式是否启用 - 控制是否启用气泡模式（仅垂直模式可用） */
    y(this, "enableBubbleMode", !1);
    /** 气泡模式是否展开 - 标识气泡模式下容器是否处于展开状态 */
    y(this, "isBubbleExpanded", !1);
    /** 气泡模式展开延迟定时器 - 用于延迟展开气泡模式容器 */
    y(this, "bubbleExpandTimer", null);
    /** 气泡模式收起延迟定时器 - 用于延迟收起气泡模式容器 */
    y(this, "bubbleCollapseTimer", null);
    /** 气泡模式动画进行中标志 - 防止动画冲突 */
    y(this, "isBubbleAnimating", !1);
    /** 气泡模式动画定时器集合 - 用于取消所有进行中的动画 */
    y(this, "bubbleAnimationTimers", /* @__PURE__ */ new Set());
    // ==================== 窗口可见性 ====================
    /** 浮窗是否可见 - 控制标签页容器的显示/隐藏状态 */
    y(this, "isFloatingWindowVisible", !0);
    // ==================== 功能开关 ====================
    /** 是否显示块类型图标 - 控制是否在标签页中显示块类型图标 */
    y(this, "showBlockTypeIcons", !0);
    /** 是否在顶部栏显示按钮 - 控制是否在Orca顶部工具栏显示插件按钮 */
    y(this, "showInHeadbar", !0);
    /** 是否启用最近关闭的标签页功能 - 控制是否记录和显示最近关闭的标签页 */
    y(this, "enableRecentlyClosedTabs", !0);
    /** 是否启用多标签页保存功能 - 控制是否允许保存多个标签页组合 */
    y(this, "enableMultiTabSaving", !0);
    /** 是否在刷新后恢复聚焦标签页 - 控制软件刷新后是否自动聚焦并打开当前聚焦的标签页 */
    y(this, "restoreFocusedTab", !0);
    /** 新标签是否添加到末尾（一次性标志，使用后自动重置为false） */
    y(this, "addNewTabToEnd", !0);
    /** 是否启用中键固定标签页功能 - 控制中键点击是否固定标签页 */
    y(this, "enableMiddleClickPin", !1);
    /** 是否启用双击关闭标签页功能 - 控制双击是否关闭标签页 */
    y(this, "enableDoubleClickClose", !1);
    /** 是否隐藏标签页提示 - 控制是否隐藏标签页的悬停提示 */
    y(this, "hideTabTooltips", !1);
    /** 贴边隐藏检测防抖定时器 - 避免面板切换时的频繁检测 */
    y(this, "edgeHideDebounceTimer", null);
    /** 是否正在更新DOM - DOM更新期间禁用贴边隐藏检测 */
    y(this, "isUpdatingDOM", !1);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 性能优化 - Performance Optimization */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 性能优化管理器 ====================
    /** 性能优化管理器 - 统一管理所有性能优化工具 */
    y(this, "performanceOptimizer", null);
    /** MutationObserver优化器实例 - 用于优化DOM变化监听 */
    y(this, "optimizedObserver", null);
    /** 高级防抖优化器实例 - 用于任务防抖和调度 */
    y(this, "debounceOptimizer", null);
    /** 内存泄漏防护器实例 - 用于跟踪和清理资源 */
    y(this, "memoryLeakProtector", null);
    /** 批量处理器实例 - 用于批量DOM操作 */
    y(this, "batchProcessor", null);
    /** 性能监控器实例 - 用于监控性能指标（已禁用） */
    // private performanceMonitor: PerformanceMonitorOptimizer | null = null;
    /** 性能指标计数缓存 - 记录自定义指标的累计值（已禁用） */
    // private performanceCounters: Record<string, number> = {};
    /** 性能基线定时器ID - 控制基线采集任务 */
    y(this, "performanceBaselineTimer", null);
    /** 最近一次性能基线场景 */
    y(this, "lastBaselineScenario", null);
    /** 最近一次性能基线报告（已禁用） */
    // private lastBaselineReport: PerformanceReport | null = null;
    /** 上一次插件初始化耗时（毫秒） */
    y(this, "lastInitDurationMs", null);
    /** 性能指标名称常量 */
    y(this, "performanceMetricKeys", {
      initTotal: "plugin_init_total",
      tabInteraction: "tab_interaction_total",
      domMutations: "dom_mutations"
    });
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 拖拽和事件管理 - Drag and Event Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 拖拽状态管理 ====================
    /** 当前正在拖拽的标签 - 存储正在被拖拽的标签页信息 */
    y(this, "draggingTab", null);
    /** 全局拖拽结束监听器 - 处理拖拽结束事件的全局监听器 */
    y(this, "dragEndListener", null);
    /** 拖拽交换防抖计时器 - 防止拖拽过程中频繁触发交换操作 */
    y(this, "swapDebounceTimer", null);
    /** 拖拽位置指示器 - 显示拖拽目标位置的视觉指示器 */
    y(this, "dropIndicator", null);
    /** 当前拖拽悬停的标签 - 鼠标悬停的标签页信息 */
    y(this, "dragOverTab", null);
    /** 上次交换的目标标签和位置 - 防止重复交换 */
    y(this, "lastSwapKey", "");
    /** 优化的拖拽监听器 - 避免全文档监听 */
    y(this, "dragOverListener", null);
    /** 懒加载状态 - 避免不必要的初始化 */
    y(this, "isDragListenersInitialized", !1);
    /** 拖拽悬停计时器 - 控制拖拽悬停的延迟响应 */
    y(this, "dragOverTimer", null);
    /** 是否正在拖拽悬停状态 - 标识当前是否处于拖拽悬停状态 */
    y(this, "isDragOverActive", !1);
    // ==================== 事件监听器 ====================
    /** 主题变化监听器 - 监听Orca主题变化的事件监听器 */
    y(this, "themeChangeListener", null);
    /** 滚动监听器 - 监听页面滚动事件的监听器 */
    y(this, "scrollListener", null);
    // ==================== 缓存和优化 ====================
    /** 上次面板发现时间 - 记录最后一次发现面板的时间戳 */
    y(this, "lastPanelDiscoveryTime", 0);
    /** 面板发现缓存 - 缓存面板发现结果，避免频繁扫描 */
    y(this, "panelDiscoveryCache", null);
    /** 设置检查定时器 - 定期检查设置变化的定时器 */
    y(this, "settingsCheckInterval", null);
    /** 上次的设置状态 - 缓存上次的设置状态，用于检测变化 */
    y(this, "lastSettings", null);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 已关闭标签页跟踪 ====================
    /** 已关闭的标签页blockId集合 - 用于跟踪已关闭的标签页，避免重复创建 */
    y(this, "closedTabs", /* @__PURE__ */ new Set());
    /** 最近关闭的标签页列表 - 按时间倒序存储最近关闭的标签页信息 */
    y(this, "recentlyClosedTabs", []);
    /** 保存的多标签页集合 - 存储用户保存的标签页组合 */
    y(this, "savedTabSets", []);
    /** 记录上一个标签集合 - 用于比较标签页变化 */
    y(this, "previousTabSet", null);
    // ==================== 工作区功能 ====================
    /** 工作区列表 - 存储所有用户创建的工作区 */
    y(this, "workspaces", []);
    /** 当前工作区ID - 标识当前激活的工作区 */
    y(this, "currentWorkspace", null);
    /** 是否启用工作区功能 - 控制工作区功能的开关 */
    y(this, "enableWorkspaces", !0);
    /** 进入工作区之前的标签页组 - 用于退出工作区时恢复到原始标签页组 */
    y(this, "tabsBeforeWorkspace", null);
    /** 是否需要在初始化后恢复标签页组 - 用于处理在工作区状态下关闭软件的情况 */
    y(this, "shouldRestoreTabsBeforeWorkspace", !1);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    y(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    y(this, "lastActiveBlockId", null);
    y(this, "lastActiveTabInstanceId", null);
    /** 是否正在导航中 - 用于避免导航时触发重复的聚焦检测 */
    y(this, "isNavigating", !1);
    /** 最近导航到的块ID - 用于防止导航后立即重复创建标签页 */
    y(this, "lastNavigatedBlockId", null);
    /** 最近导航的时间戳 - 用于判断导航是否刚刚完成 */
    y(this, "lastNavigationTime", 0);
    // ==================== 快捷键相关 ====================
    /** 当前鼠标悬停的块ID - 用于快捷键操作的目标块 */
    y(this, "hoveredBlockId", null);
    // 防抖函数实例（仅用于拖拽等非关键场景）
    y(this, "draggingDebounce", Be(async () => {
      await this.updateTabsUI();
    }, 200));
    this.pluginName = e, this.discoverPanelsDebounced = Be(() => {
      this.discoverPanelsInternal();
    }, 500), this.initializePerformanceOptimizers();
  }
  /** 简单的日志方法 */
  log(e, ...t) {
    this.currentLogLevel >= L.INFO && pe(e, ...t);
  }
  logError(e, ...t) {
    this.currentLogLevel >= L.ERROR && Ai(e, ...t);
  }
  logWarn(e, ...t) {
    this.currentLogLevel >= L.WARN && Ni(e, ...t);
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
    const i = this.getLatestMetricMap(e.metrics), a = i.get(this.performanceMetricKeys.initTotal), n = i.get(this.performanceMetricKeys.tabInteraction), o = i.get(this.performanceMetricKeys.domMutations), s = i.get("fps"), c = i.get("memory_heap"), l = a ? `${a.value.toFixed(1)}${a.unit}` : this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : "n/a", d = n ? `${n.value.toFixed(0)}` : "0", u = o ? `${o.value.toFixed(0)}` : "0", h = s ? `${s.value.toFixed(0)}fps` : "n/a", b = c ? this.formatBytes(c.value) : "n/a";
    return [
      `[Performance][${t}] Baseline`,
      `  healthScore: ${e.healthScore}`,
      `  init_total: ${l}`,
      `  tab_interactions: ${d}`,
      `  dom_mutations: ${u}`,
      `  fps: ${h}`,
      `  heap_used: ${b}`,
      `  issues: ${e.issues.length}`
    ].join(`
`);
  }
  getLatestMetricMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const i of e) {
      const a = t.get(i.name);
      (!a || a.timestamp <= i.timestamp) && t.set(i.name, i);
    }
    return t;
  }
  formatBytes(e) {
    return e < 1024 ? `${e.toFixed(0)}B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)}KB` : e < 1024 * 1024 * 1024 ? `${(e / 1024 / 1024).toFixed(1)}MB` : `${(e / 1024 / 1024 / 1024).toFixed(1)}GB`;
  }
  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  debugLog(...e) {
    this.currentLogLevel >= L.DEBUG && pe(e.join(" "), ...e);
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...e) {
    this.currentLogLevel >= L.VERBOSE && pe(e.join(" "), ...e);
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
    this.currentLogLevel = e, Y.setLogLevel(e), this.log(`📊 日志级别已设置为: ${L[e]}`);
  }
  /**
   * 从存储中恢复调试模式设置
   */
  async restoreDebugMode() {
    try {
      await this.storageService.getConfig(C.DEBUG_MODE, this.pluginName) && this.setLogLevel(L.VERBOSE);
    } catch {
    }
  }
  /**
   * 恢复聚焦标签页恢复设置
   */
  async restoreRestoreFocusedTabSetting() {
    try {
      const e = await this.storageService.getConfig(C.RESTORE_FOCUSED_TAB, this.pluginName);
      e != null && (this.restoreFocusedTab = e);
    } catch {
    }
  }
  /**
   * 恢复功能开关设置
   */
  async restoreFeatureToggleSettings() {
    try {
      const e = await this.storageService.getConfig(C.ENABLE_MIDDLE_CLICK_PIN, this.pluginName), t = await this.storageService.getConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, this.pluginName), i = e ?? t;
      i != null && (this.enableMiddleClickPin = i, this.enableDoubleClickClose = i), this.log(`🔧 功能开关设置已恢复: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`);
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
    await this.restoreDebugMode(), await this.restoreRestoreFocusedTabSetting(), await this.restoreFeatureToggleSettings(), Xi(), this.tabStorageService = new dt(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[Ne.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.loadWorkspaces();
    const [
      e,
      t,
      i,
      a
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
            d && (this.getCurrentPanelTabs().find((b) => b.blockId === d) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${d}`), await this.checkCurrentPanelBlocks()));
          }
        }
      } else
        this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过当前聚焦页面的恢复');
    this.restoreFocusedTab ? await this.autoDetectAndSyncCurrentFocus() : this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过自动检测聚焦页面'), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.initializeOptimizedDOMObserver(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), setTimeout(() => {
      try {
        _i(), this.initializeHeadbarUserToolsTooltips(), Xe(), Ke(), this.log("✅ Tooltips 初始化完成，清理定时器和页面卸载清理已启动");
      } catch (c) {
        this.log("⚠️ Tooltips 初始化失败:", c);
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
      const i = this.getPanelIds().indexOf(t);
      i !== -1 && (this.currentPanelIndex = i, this.currentPanelId = t, this.log(`🔄 更新当前面板索引: ${i} (面板ID: ${t})`));
      const a = e.querySelectorAll('.orca-hideable:not([style*="display: none"])');
      let n = null;
      for (const d of a) {
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
      let s = this.getCurrentPanelTabs();
      s.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), s = this.getCurrentPanelTabs());
      const c = s.find((d) => d.blockId === o);
      if (c) {
        this.log(`📋 当前可见页面已存在于标签页中: "${c.title}" (${o})`), this.updateFocusState(o, c.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功同步已存在的标签页: "${c.title}"`);
        return;
      }
      this.log(`📋 当前可见页面不在标签页中，需要创建新标签页: ${o}`);
      const l = await this.getTabInfo(o, t, 0);
      if (!l) {
        this.log("⚠️ 无法获取块信息，跳过自动检测");
        return;
      }
      if (this.log(`🔍 获取到标签信息: "${l.title}" (类型: ${l.blockType || "unknown"})`), s.length >= this.maxTabs) {
        const d = s.length - 1, u = s[d];
        l.tabId = u.tabId || l.tabId, s[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${u.title}" -> "${l.title}"`);
      } else
        l.order = s.length, s.push(l), this.log(`➕ 添加新标签页到末尾: "${l.title}" (当前标签数: ${s.length}/${this.maxTabs})`);
      this.setCurrentPanelTabs(s), await this.saveCurrentPanelTabs(), this.updateFocusState(o, l.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功创建并同步新标签页: "${l.title}" (${o})`);
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
    const a = setInterval(() => {
      const n = orca.state.themeMode;
      n !== t && (this.log("备用检测：主题从", t, "切换到", n), t = n, setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 200));
    }, 500);
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", e), clearInterval(a);
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
      this.log(`📌 找到 ${t.length} 个用户工具栏按钮`), t.forEach((i, a) => {
        const n = i, o = n.getAttribute("title");
        o && (n.removeAttribute("title"), D(n, {
          text: o,
          delay: 300,
          defaultPlacement: "bottom"
        }), this.log(`✅ 已为用户工具栏按钮 ${a + 1} 添加 tooltip: "${o}"`));
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
        const a = this.getCurrentActiveTab();
        a && this.recordScrollPosition(a);
      }, 500);
    }, i = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    i.forEach((a) => {
      a.addEventListener("scroll", t, { passive: !0 });
    }), this.scrollListener = () => {
      i.forEach((a) => {
        a.removeEventListener("scroll", t);
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
          const i = this.tabContainer.getBoundingClientRect();
          if (!(t.clientX >= i.left && t.clientX <= i.right && t.clientY >= i.top && t.clientY <= i.bottom)) {
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
          const a = document.elementsFromPoint(t.clientX, t.clientY).find((n) => {
            if (!n.classList.contains("orca-tab") || !n.hasAttribute("data-block-id")) return !1;
            const o = n.style;
            return !(o.opacity === "0" && o.pointerEvents === "none" || n.classList.contains("close-button") || n.classList.contains("new-tab-button") || n.classList.contains("drag-handle") || n.classList.contains("resize-handle"));
          });
          if (a) {
            const n = a.getAttribute("data-block-id"), s = this.getCurrentPanelTabs().find((c) => c.blockId === n);
            if (s && s.blockId !== this.draggingTab.blockId) {
              const c = a.getBoundingClientRect(), l = this.isVerticalMode && !this.isFixedToTop;
              let d;
              if (l) {
                const h = c.top + c.height / 2;
                d = t.clientY < h ? "before" : "after";
              } else {
                const h = c.left + c.width / 2;
                d = t.clientX < h ? "before" : "after";
              }
              this.updateDropIndicator(a, d);
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
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tab").forEach((t) => {
      const i = t;
      i.removeAttribute("data-dragging"), i.removeAttribute("data-drag-over"), i.classList.remove("dragging", "drag-over"), i.style.opacity === "0" && i.style.pointerEvents === "none" && (i.style.opacity = "", i.style.pointerEvents = "");
    }), this.tabContainer.removeAttribute("data-dragging")), this.clearDropIndicator();
  }
  /**
   * 创建拖拽位置指示器
   */
  createDropIndicator(e, t) {
    const i = document.createElement("div");
    i.className = "orca-tab-drop-indicator", i.style.cssText = `
      position: absolute;
      height: 2px;
      background: var(--orca-color-primary-5);
      border-radius: 1px;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
      transition: all 0.2s ease;
    `;
    const a = e.getBoundingClientRect(), n = e.parentElement;
    if (n) {
      const o = n.getBoundingClientRect();
      t === "before" ? (i.style.left = `${a.left - o.left}px`, i.style.top = `${a.top - o.top - 1}px`, i.style.width = `${a.width}px`) : (i.style.left = `${a.left - o.left}px`, i.style.top = `${a.bottom - o.top - 1}px`, i.style.width = `${a.width}px`), n.appendChild(i);
    }
    return i;
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
  async swapTabsRealtime(e, t, i) {
    var h, b;
    if (!this.tabContainer) return;
    const a = this.getCurrentPanelTabs(), n = a.findIndex((p) => p.blockId === t.blockId), o = a.findIndex((p) => p.blockId === e.blockId);
    if (n === -1 || o === -1 || n === o) return;
    const s = a.filter((p) => p.isPinned).length;
    let c = i === "before" ? o : o + 1;
    if (n < c && c--, t.isPinned) {
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
    if (n === c) return;
    this.verboseLog(`🔄 [实时交换] ${t.title}: ${n} -> ${c}`);
    const [l] = a.splice(n, 1);
    a.splice(c, 0, l), await this.setCurrentPanelTabs(a);
    const d = this.tabContainer.querySelector(`[data-block-id="${t.blockId}"]`), u = this.tabContainer.querySelector(`[data-block-id="${e.blockId}"]`);
    d && u && (i === "before" ? (h = u.parentNode) == null || h.insertBefore(d, u) : (b = u.parentNode) == null || b.insertBefore(d, u.nextSibling));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(e, t) {
    const i = this.getCurrentPanelTabs(), a = i.findIndex((c) => c.blockId === e.blockId), n = i.findIndex((c) => c.blockId === t.blockId);
    if (a === -1 || n === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (a === n) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${n}) -> ${e.title} (${a})`);
    const o = i[n], s = i[a];
    i[a] = o, i[n] = s, i.forEach((c, l) => {
      c.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(i), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${o.title} -> 位置 ${a}`);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 面板管理 - Panel Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 发现并更新面板信息（防抖版本）
   * 排除特殊面板（如全局搜索面板），只处理正常的内容面板
   * 使用500ms防抖，避免频繁调用
   */
  async discoverPanels() {
    this.discoverPanelsDebounced ? this.discoverPanelsDebounced() : await this.discoverPanelsInternal();
  }
  /**
   * 发现并更新面板信息（内部实现）
   * 排除特殊面板（如全局搜索面板），只处理正常的内容面板
   */
  async discoverPanelsInternal() {
    const e = document.querySelectorAll(".orca-panel"), t = [];
    let i = null;
    if (e.forEach((n) => {
      const o = n.getAttribute("data-panel-id");
      if (o) {
        if (o.startsWith("_"))
          return;
        t.push(o), n.classList.contains("active") && (i = o);
      }
    }), this.panelDiscoveryCache) {
      const n = this.panelDiscoveryCache.panelIds;
      if (n.length === t.length && n.every((s, c) => s === t[c])) {
        this.verboseLog("📋 面板列表与缓存相同，跳过重新扫描"), this.updateCurrentPanelInfo(i);
        return;
      }
    }
    this.panelDiscoveryCache = {
      panelIds: [...t],
      timestamp: Date.now()
    };
    const a = this.getPanelIds();
    this.updatePanelOrder(t), this.updateCurrentPanelInfo(i), await this.handlePanelChanges(a, t);
  }
  /**
   * 更新当前面板信息
   */
  updateCurrentPanelInfo(e) {
    if (e) {
      const t = this.panelOrder.findIndex((i) => i.id === e);
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
    const i = e.filter((n) => !t.includes(n));
    i.length > 0 && (this.log("🗑️ 检测到面板被关闭:", i), await this.handlePanelClosure(i));
    const a = t.filter((n) => !e.includes(n));
    a.length > 0 && (this.log("🆕 检测到新面板被打开:", a), this.handleNewPanels(a)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   * 
   * 支持处理普通块面板和视图面板（如 AI Chat 面板）的关闭。
   * 视图面板的标签页 blockId 以 'view:' 前缀开头，需要特殊处理以避免错误。
   * 
   * Requirements: 4.3, 5.3
   */
  async handlePanelClosure(e) {
    this.log("🗑️ 处理面板关闭:", e);
    const t = [], i = [];
    e.forEach((a) => {
      const n = this.panelOrder.findIndex((o) => o.id === a);
      n !== -1 && (t.push(n), (this.panelTabsData[n] || []).forEach((s) => {
        N(s) && (i.push(s.blockId), this.verboseLog(`🖼️ 检测到视图面板标签页将被清理: ${s.title} (blockId: ${s.blockId})`));
      }));
    }), i.length > 0 && this.log(`🖼️ 面板关闭将清理 ${i.length} 个视图面板标签页`), t.sort((a, n) => n - a).forEach((a) => {
      (this.panelTabsData[a] || []).forEach((o) => {
        this.closedTabs.add(o.blockId);
      }), this.panelTabsData.splice(a, 1), this.log(`🗑️ 删除面板 ${e[t.indexOf(a)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((a) => a.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let a = 0; a < this.panelOrder.length; a++) {
      const n = this.panelTabsData[a] || [], o = a === 0 ? C.FIRST_PANEL_TABS : `panel_${a + 1}_tabs`;
      await this.savePanelTabsByKey(o, n);
    }
    await this.saveClosedTabs(), this.log("🔄 面板关闭后强制更新UI"), this.debouncedUpdateTabsUI();
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
    if (this.panelOrder.find((i) => i.id === e)) {
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
    const t = this.panelOrder.findIndex((i) => i.id === e);
    if (t === -1) {
      this.log(`⚠️ 面板 ${e} 不存在，无法删除`);
      return;
    }
    this.panelOrder.splice(t, 1), this.panelOrder.forEach((i, a) => {
      i.order = a + 1;
    }), this.log(`🗑️ 删除面板 ${e}，重新排序后的面板:`, this.panelOrder.map((i) => `${i.id}(${i.order})`)), this.panelTabsData.splice(t, 1);
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
    }), this.verboseLog("🔄 面板顺序更新完成:", this.panelOrder.map((n) => `${n.id}(${n.order})`));
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
    const i = t.querySelectorAll(".orca-block-editor[data-block-id]"), a = [];
    let n = 0;
    this.log(`🔍 扫描第一个面板 ${e}，找到 ${i.length} 个块编辑器`);
    for (const o of i) {
      const s = o.getAttribute("data-block-id");
      if (!s) continue;
      const c = await this.getTabInfo(s, e, n++);
      c && (a.push(c), this.log(`📋 找到标签页: ${c.title} (${s})`));
    }
    this.panelTabsData[0] = [...a], await this.savePanelTabsByKey(C.FIRST_PANEL_TABS, a), this.log(`📋 第一个面板扫描并保存了 ${a.length} 个标签页`);
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
    const e = this.getCurrentPanelTabs(), t = Ri(e);
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return Ui(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return Ci(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, i = !1, a = !1;
    for (const n of e)
      n && typeof n == "object" && (n.t === "r" && n.v ? (a = !0, n.a || (t = !0)) : n.t === "t" && n.v && (i = !0));
    return t || i && a;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return wi(e);
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
          let i = t.trim();
          return i = this.processSpecialFormats(i), i = this.cleanTitle(i), i.length > 50 && (i = i.substring(0, 47) + "..."), i;
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
    for (const i of e)
      if (typeof i == "string")
        t.push(i);
      else if (i && typeof i == "object") {
        if (i.t === "text" && i.v)
          t.push(i.v);
        else if (i.text)
          t.push(i.text);
        else if (i.content) {
          const a = this.extractTextFromContentSync(i.content);
          a && t.push(a);
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
          const a = e.getDay(), o = ["日", "一", "二", "三", "四", "五", "六"][a], s = t.replace(/E/g, o);
          return F(e, s);
        } else
          return F(e, t);
      else
        return F(e, t);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const n of a)
        try {
          return F(e, n);
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
    return !e.properties || !Array.isArray(e.properties) ? null : e.properties.find((i) => i.name === t);
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
    ].some((i) => i.test(e));
  }
  async getTabInfo(e, t, i) {
    try {
      if (e.startsWith("view:"))
        return this.verboseLog(`⏭️ 跳过视图面板的块信息获取: ${e}`), null;
      const a = await orca.invokeBackend("get-block", parseInt(e));
      if (!a) return null;
      let n = "", o = "", s = "", c = !1, l = "";
      l = await ge(a), this.verboseLog(`🔍 检测到块类型: ${l} (块ID: ${e})`), a.aliases && a.aliases.length > 0 && this.verboseLog(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(a.aliases)}, 检测到的类型=${l}`);
      try {
        const d = qe(a);
        if (d)
          c = !0, n = xi(d);
        else if (a.aliases && a.aliases.length > 0)
          n = a.aliases[0];
        else if (a.content && a.content.length > 0)
          this.needsContentConcatenation(a.content) && a.text ? n = a.text.substring(0, 50) : n = (await this.extractTextFromContent(a.content)).substring(0, 50);
        else if (a.text) {
          let u = a.text.substring(0, 50);
          if (l === "list") {
            const h = a.text.split(`
`)[0].trim();
            h && (u = h.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (l === "table") {
            const h = a.text.split(`
`)[0].trim();
            h && (u = h.replace(/\|/g, "").trim());
          } else if (l === "quote") {
            const h = a.text.split(`
`)[0].trim();
            h && (u = h.replace(/^>\s+/, ""));
          } else if (l === "image") {
            const h = a.text.match(/caption:\s*(.+)/i);
            h && h[1] ? u = h[1].trim() : u = a.text.trim();
          }
          n = u;
        } else
          n = `块 ${e}`;
      } catch (d) {
        this.warn("获取标题失败:", d), n = `块 ${e}`;
      }
      try {
        const d = this.findProperty(a, "_color"), u = this.findProperty(a, "_icon");
        d && d.type === 1 && (o = d.value), u && u.type === 1 && u.value && u.value.trim() ? (s = u.value, this.verboseLog(`🎨 使用用户自定义图标: ${s} (块ID: ${e})`)) : (this.showBlockTypeIcons || l === "journal") && (s = te(l), this.verboseLog(`🎨 使用块类型图标: ${s} (块类型: ${l}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), s = te(l);
      }
      return {
        blockId: e,
        tabId: G(e),
        panelId: t,
        title: n || `块 ${e}`,
        color: o,
        icon: s,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: i,
        blockType: l
      };
    } catch (a) {
      return this.error("获取标签信息失败:", a), null;
    }
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* UI创建和更新 - UI Creation and Updates */
  /* ———————————————————————————————————————————————————————————————————————————— */
  async createTabsUI() {
    var s;
    if (!this.isFloatingWindowVisible) {
      this.log("🙈 浮窗已隐藏，跳过UI创建");
      return;
    }
    if (this.tabContainer) {
      if (this.enableBubbleMode) {
        const c = (s = this.tabContainer) == null ? void 0 : s._bubbleClickOutsideHandler;
        c && document.removeEventListener("click", c, !0);
      }
      this.tabContainer.remove();
    }
    this.cycleSwitcher && this.cycleSwitcher.remove(), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.log("📱 使用自动切换模式，不创建面板切换器");
    const e = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)";
    let t, i, a;
    this.isFixedToTop ? (t = { x: 0, y: 0 }, i = !1, a = window.innerWidth) : (t = this.isVerticalMode ? this.verticalPosition : this.position, i = this.isVerticalMode, a = this.verticalWidth);
    const n = i && !this.isFixedToTop && this.enableBubbleMode;
    if (this.tabContainer = Wi(
      i,
      t,
      a,
      e,
      n,
      n ? this.isBubbleExpanded : !1
    ), this.isFixedToTop) {
      const c = document.querySelector(".orca-headbar-sidebar-tools") || document.body;
      this.log("🔍 查找顶部工具栏:", {
        headbar: (c == null ? void 0 : c.className) || (c == null ? void 0 : c.tagName),
        headbarExists: !!c,
        bodyChildren: document.body.children.length
      }), c && this.tabContainer && W(c, () => {
        c.appendChild(this.tabContainer);
      }), c === document.body && this.tabContainer ? W(this.tabContainer, () => {
        this.tabContainer.style.cssText += `
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
          `;
      }) : c && this.tabContainer && W(this.tabContainer, () => {
        this.tabContainer.style.cssText += `
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
          `;
      }), this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${c.className || c.tagName}`);
    } else this.tabContainer && (W(document.body, () => {
      document.body.appendChild(this.tabContainer);
    }), this.enableEdgeHide && this.debouncedApplyEdgeHideStyle(100));
    this.tabContainer.addEventListener("mousedown", (c) => {
      if (!c || !c.target)
        return;
      const l = c.target;
      l.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && c.stopPropagation();
    }), this.tabContainer.addEventListener("click", (c) => {
      if (!c || !c.target)
        return;
      const l = c.target;
      l.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && c.stopPropagation();
    });
    const o = document.createElement("div");
    o.className = "drag-handle", o.style.cssText = `
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
    `, o.textContent = "", o.addEventListener("mouseenter", () => {
      o.style.opacity = "0.5";
    }), o.addEventListener("mouseleave", () => {
      o.style.opacity = "0";
    }), o.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(o), this.isFixedToTop || document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && !n && this.enableDragResize(), await this.updateTabsUI(), n && (this.setupBubbleModeEvents(), this.isBubbleExpanded || this.createBubbleOverlay());
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

      /* 标签关闭按钮样式 */
      .orca-tabs-plugin .orca-tab .tab-close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        border-radius: 4px;
        opacity: 0;
        cursor: pointer;
        transition: opacity 0.15s ease, background-color 0.15s ease;
        color: var(--orca-color-text-2);
        margin-left: auto;
      }

      .orca-tabs-plugin .orca-tab .tab-close-btn:hover {
        background-color: var(--orca-color-menu-highlight);
        color: var(--orca-color-text-1);
      }

      .orca-tabs-plugin .orca-tab .tab-close-btn:active {
        background-color: color-mix(in srgb, var(--orca-color-menu-highlight), black 10%);
      }

      /* 悬浮标签时显示关闭按钮 */
      .orca-tabs-plugin .orca-tab:hover .tab-close-btn {
        opacity: 1;
      }

      /* 只有一个标签时隐藏关闭按钮 */
      .orca-tabs-plugin .orca-tabs-container .orca-tab:only-child .tab-close-btn {
        display: none;
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
  async updateTabsUI(e = !1) {
    var i;
    if (e && this.isUpdating && (this.verboseLog("🔄 强制更新：重置 isUpdating 标志"), this.isUpdating = !1, this.isUpdatingDOM = !1), !this.tabContainer || this.isUpdating) return;
    if (Z(this.tabContainer)) {
      this.verboseLog("⚠️ tabContainer 被 content-visibility 隐藏，跳过UI更新以避免渲染警告"), this.isUpdating = !1, this.isUpdatingDOM = !1;
      return;
    }
    this.isUpdating = !0, this.isUpdatingDOM = !0;
    const t = Date.now();
    try {
      if (!e && t - this.lastUpdateTime < 200) {
        t - this.lastUpdateTime < 50 && this.verboseLog("⏭️ 跳过UI更新：距离上次更新仅 " + (t - this.lastUpdateTime) + "ms"), this.isUpdating = !1, this.isUpdatingDOM = !1;
        return;
      }
      this.lastUpdateTime = t, e && this.verboseLog("🔄 强制更新UI（跳过防抖检查）");
      const n = this.tabContainer.querySelector(".drag-handle"), o = this.tabContainer.querySelector(".new-tab-button"), s = this.tabContainer.querySelector(".workspace-button"), c = Array.from(this.tabContainer.querySelectorAll(".orca-tab")).map((b) => b.getAttribute("data-tab-id")).filter((b) => b !== null), l = this.getCurrentPanelTabs();
      this.tabContainer.querySelectorAll(".orca-tab").forEach((b) => b.remove()), n && n.parentElement !== this.tabContainer && this.tabContainer.insertBefore(n, this.tabContainer.firstChild);
      let u = this.currentPanelId, h = this.currentPanelIndex;
      if (!u && this.panelOrder.length > 0 && (u = this.panelOrder[0].id, h = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${u}`)), u) {
        this.verboseLog(`📋 显示面板 ${u} 的标签页`);
        let b = this.panelTabsData[h] || [];
        b.length === 0 && (this.log(`🔍 面板 ${u} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(h, u), b = this.panelTabsData[h] || []), this.sortTabsByPinStatus(), b = this.panelTabsData[h] || [];
        const p = document.createDocumentFragment();
        b.forEach((g, f) => {
          const v = this.createTabElement(g);
          this.enableBubbleMode && this.isBubbleExpanded && (v.style.opacity = "1", v.style.transform = ""), p.appendChild(v);
        });
        const m = (i = this.tabContainer) == null ? void 0 : i.querySelector(".new-tab-button");
        this.tabContainer && (m ? this.tabContainer.insertBefore(p, m) : this.tabContainer.appendChild(p), this.enableBubbleMode && this.isBubbleExpanded && requestAnimationFrame(() => {
          var f;
          const g = (f = this.tabContainer) == null ? void 0 : f.querySelectorAll(".orca-tab");
          g == null || g.forEach((v) => {
            const w = v, T = w.getAttribute("data-focused") === "true";
            this.isBubbleAnimating || (T ? w.style.setProperty("opacity", "1", "important") : w.style.opacity = "1", w.style.transform = "", (!w.style.transition || w.style.transition === "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)") && (w.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"));
          });
        }));
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton(), this.isFixedToTop) {
        const b = "var(--orca-tab-bg)", p = "var(--orca-tab-border)", m = "var(--orca-color-text-1)", g = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        g.forEach((v) => {
          const w = v.getAttribute("data-block-id");
          if (!w) return;
          const x = this.getCurrentPanelTabs().find((E) => E.blockId === w);
          if (x) {
            let E, k, S = "normal";
            if (E = "var(--orca-tab-bg)", k = "var(--orca-color-text-1)", x.color)
              try {
                v.style.setProperty("--tab-color", x.color), (document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark")) && v.style.setProperty(
                  "--orca-tab-colored-text",
                  "oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h)",
                  "important"
                ), E = "var(--orca-tab-colored-bg)", k = "var(--orca-tab-colored-text)", S = "600";
              } catch {
              }
            v.style.cssText = `
             display: flex;
             align-items: center;
             padding: 2px 8px;
             background: ${E};
             border-radius: var(--orca-radius-md);
             border: 1px solid ${p};
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
             color: ${k};
             font-weight: ${S};
             backdrop-filter: blur(2px);
             -webkit-backdrop-filter: blur(2px);
             -webkit-app-region: no-drag;
             app-region: no-drag;
             pointer-events: auto;
             will-change: transform, margin, opacity, max-width, min-width;
           `, x.color && v.style.setProperty("--tab-color", x.color);
          }
        });
        const f = this.tabContainer.querySelector(".new-tab-button");
        f && (f.style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${b};
          border-radius: var(--orca-radius-md);
          border: 1px solid ${p};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${m};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${g.length}`);
      }
      if (this.enableEdgeHide && this.currentEdgeSide && !this.isFixedToTop && requestAnimationFrame(() => {
        this.applyEdgeConstraints();
      }), this.enableBubbleMode && this.isBubbleExpanded && this.tabContainer && this.tabContainer.querySelectorAll(".orca-tab").forEach((p) => {
        const m = p, g = m.getAttribute("data-focused") === "true";
        this.isBubbleAnimating || (g ? m.style.setProperty("opacity", "1", "important") : m.style.opacity = "1", m.style.transform = "", (!m.style.transition || m.style.transition === "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)") && (m.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"));
      }), this.enableEdgeHide && !this.isFixedToTop && this.debouncedApplyEdgeHideStyle(100), this.enableBubbleMode && !this.isBubbleExpanded && this.tabContainer) {
        const b = this.tabContainer.querySelector(".bubble-overlay");
        b ? (b.style.display = "flex", b.style.zIndex = "9999") : this.createBubbleOverlay();
      }
    } catch (a) {
      this.error("更新UI时发生错误:", a);
    } finally {
      this.isUpdating = !1, this.isUpdatingDOM = !1;
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
      e.forEach((i, a) => {
        const n = this.createTabElement(i);
        t.appendChild(n);
      });
    else {
      const i = document.createElement("div");
      i.className = "panel-status", i.style.cssText = `
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
      const a = this.currentPanelIndex + 1;
      i.textContent = `面板 ${a}（无标签页）`, D(i, Te(`当前在面板 ${a}，该面板没有标签页`)), t.appendChild(i);
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
      e.forEach((i, a) => {
        const n = this.createTabElement(i);
        t.appendChild(n);
      });
    else {
      const i = document.createElement("div");
      i.className = "panel-status", i.style.cssText = `
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
      const a = this.currentPanelIndex + 1;
      i.textContent = `面板 ${a}（无标签页）`, D(i, Te(`当前在面板 ${a}，该面板没有标签页`)), t.appendChild(i);
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
    const i = this.isVerticalMode ? `
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
    t.style.cssText = i, t.textContent = "+", D(t, X("新建标签页")), t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", async (a) => {
      a.preventDefault(), a.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(t), this.addNewTabButtonContextMenu(t), this.enableWorkspaces && this.addWorkspaceButton();
  }
  /**
   * 优化后的标签宽度更新方法 - 避免完全重建UI
   */
  async updateTabWidths(e, t) {
    try {
      this.horizontalTabMaxWidth = e, this.horizontalTabMinWidth = t, this.tabContainer && !this.isVerticalMode ? (this.tabContainer.querySelectorAll(".orca-tab").forEach((a) => {
        const n = a, o = this.getTabInfoFromElement(n);
        if (o) {
          const s = this.isVerticalMode && !this.isFixedToTop, c = De(o, s, () => "", e, t);
          n.style.cssText = c;
        }
      }), this.log(`📏 标签宽度已优化更新: 最大${e}px, 最小${t}px`)) : await this.createTabsUI();
      try {
        await this.saveLayoutMode();
      } catch (i) {
        this.error("保存宽度设置失败:", i);
      }
    } catch (i) {
      this.error("更新标签宽度失败:", i);
    }
  }
  /**
   * 从标签元素获取标签信息
   */
  getTabInfoFromElement(e) {
    const t = e.getAttribute("data-tab-id"), i = e.getAttribute("data-block-id");
    if (!t && !i) return null;
    const a = this.panelTabsData[this.currentPanelIndex] || [];
    return a.find((n) => n.tabId === t) || a.find((n) => n.blockId === i) || null;
  }
  /**
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    try {
      if (this.isVerticalMode) {
        const e = Ae(
          this.verticalWidth,
          async (t) => {
            try {
              orca.nav.changeSizes(orca.state.activePanel, [t]);
            } catch (i) {
              this.error("调整面板宽度失败:", i);
            }
            this.verticalWidth = t;
            try {
              await this.saveLayoutMode();
            } catch (i) {
              this.error("保存宽度设置失败:", i);
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
        const e = this.horizontalTabMaxWidth, t = this.horizontalTabMinWidth, i = Ae(
          this.horizontalTabMaxWidth,
          this.horizontalTabMinWidth,
          async (a, n) => {
            await this.updateTabWidths(a, n);
          },
          async () => {
            this.horizontalTabMaxWidth = e, this.horizontalTabMinWidth = t, await this.createTabsUI(), this.log(`📏 标签宽度已恢复: 最大${e}px, 最小${t}px`);
          }
        );
        document.body.appendChild(i);
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
    const i = zi(
      this.isVerticalMode,
      t,
      async (a) => {
        a.preventDefault(), a.stopPropagation(), this.log("🔧 点击功能切换按钮"), alert("功能切换按钮被点击了！"), await this.toggleFeatureSettings();
      }
    );
    D(i, X(
      t ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)"
    )), i.addEventListener("mouseenter", () => {
      i.style.background = t ? "rgba(0, 150, 0, 0.2)" : "rgba(0, 0, 0, 0.1)", i.style.color = t ? "#004400" : "#333";
    }), i.addEventListener("mouseleave", () => {
      i.style.background = t ? "rgba(0, 150, 0, 0.1)" : "transparent", i.style.color = t ? "#006600" : "#666";
    }), this.tabContainer.appendChild(i), this.log("🔧 功能切换按钮已添加到DOM");
  }
  /**
   * 切换功能设置
   */
  async toggleFeatureSettings() {
    try {
      this.log(`🔧 切换前状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), this.enableMiddleClickPin = !this.enableMiddleClickPin, this.enableDoubleClickClose = !this.enableDoubleClickClose, this.log(`🔧 切换后状态: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), await this.storageService.saveConfig(C.ENABLE_MIDDLE_CLICK_PIN, this.enableMiddleClickPin, this.pluginName), await this.storageService.saveConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, this.enableDoubleClickClose, this.pluginName), this.log("🔧 设置已保存到存储"), this.updateFeatureToggleButton(), this.log(`🔧 功能开关已切换: 中键固定=${this.enableMiddleClickPin}, 双击关闭=${this.enableDoubleClickClose}`), this.showFeatureToggleNotification();
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
    e.textContent = t ? "🔒" : "🔓", e.title = t ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)";
    const i = this.isVerticalMode ? `
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
    e.style.cssText = i;
  }
  /**
   * 显示功能切换通知
   */
  showFeatureToggleNotification() {
    const e = this.enableMiddleClickPin || this.enableDoubleClickClose, t = e ? "功能已启用：中键固定标签页，双击关闭标签页" : "功能已禁用：中键关闭标签页，双击固定标签页", i = document.createElement("div");
    i.style.cssText = `
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
    `, i.textContent = t, document.body.appendChild(i), setTimeout(() => {
      i.parentNode && i.parentNode.removeChild(i);
    }, 3e3);
  }
  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    var n;
    if (!this.tabContainer || this.tabContainer.querySelector(".workspace-button")) return;
    const t = document.createElement("div");
    t.className = "workspace-button";
    const i = this.isVerticalMode ? `
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
    t.style.cssText = i;
    const a = document.createElement("i");
    a.className = "ti ti-layout-grid", a.style.cssText = "font-size: 14px;", t.replaceChildren(a), D(t, X(`工作区 (${((n = this.workspaces) == null ? void 0 : n.length) || 0})`)), t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", (o) => {
      o.preventDefault(), o.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(o);
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
    const i = document.createElement("div");
    i.className = "new-tab-context-menu";
    const a = 200, n = 140, { x: o, y: s } = ie(e.clientX, e.clientY, a, n);
    i.style.cssText = `
      position: fixed;
      left: ${o}px;
      top: ${s}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: ${a}px;
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
        text: this.enableEdgeHide ? "关闭贴边隐藏" : "开启贴边隐藏",
        action: () => this.toggleEdgeHide(),
        icon: this.enableEdgeHide ? "👁" : "👁‍🗨"
      }
    ), this.isVerticalMode && !this.isFixedToTop && c.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: this.enableBubbleMode ? "关闭气泡模式" : "开启气泡模式",
        action: () => this.toggleBubbleMode(),
        icon: this.enableBubbleMode ? "🫧" : "💧"
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
        `, i.appendChild(m);
        return;
      }
      const b = document.createElement("div");
      if (b.style.cssText = `
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
        `, b.appendChild(m);
      }
      const p = document.createElement("span");
      p.textContent = h.text, b.appendChild(p), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.addEventListener("click", () => {
        h.action && h.action(), i.remove();
      }), i.appendChild(b);
    }), document.body.appendChild(i);
    const l = (h) => {
      !h || !h.target || i.contains(h.target) || (i.remove(), document.removeEventListener("click", l));
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
      this.isVerticalMode ? (this.verticalPosition = { ...this.position }, this.position = this.horizontalPosition || { x: 100, y: 100 }) : (this.horizontalPosition = { ...this.position }, this.position = this.verticalPosition || { x: 100, y: 100 }), this.isVerticalMode = !this.isVerticalMode, !this.isVerticalMode && this.enableBubbleMode && (this.enableBubbleMode = !1, this.isBubbleExpanded = !1, this.verboseLog("🫧 切换到水平模式，已自动禁用气泡模式")), await this.saveLayoutMode(), await this.createTabsUI(), this.log(`📐 布局模式已切换为: ${this.isVerticalMode ? "垂直" : "水平"}`);
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
   * 切换气泡模式（仅垂直模式可用）
   */
  async toggleBubbleMode() {
    try {
      if (!this.isVerticalMode) {
        this.log("⚠️ 气泡模式仅在垂直模式下可用");
        return;
      }
      this.enableBubbleMode = !this.enableBubbleMode, this.isBubbleExpanded = !1, this.log(`🫧 气泡模式已${this.enableBubbleMode ? "启用" : "禁用"}`), await this.saveLayoutMode(), await this.createTabsUI();
    } catch (e) {
      this.error("切换气泡模式失败:", e);
    }
  }
  /**
   * 设置气泡模式的事件处理
   */
  setupBubbleModeEvents() {
    if (!this.tabContainer) return;
    this.bubbleExpandTimer && (clearTimeout(this.bubbleExpandTimer), this.bubbleExpandTimer = null), this.bubbleCollapseTimer && (clearTimeout(this.bubbleCollapseTimer), this.bubbleCollapseTimer = null);
    const e = () => {
      this.isDragging || (this.bubbleCollapseTimer && (clearTimeout(this.bubbleCollapseTimer), this.bubbleCollapseTimer = null), this.isBubbleExpanded || this.expandBubble());
    }, t = (a) => {
      var o;
      if (this.isDragging) return;
      const n = a.relatedTarget;
      n && ((o = this.tabContainer) != null && o.contains(n)) || (this.bubbleExpandTimer && (clearTimeout(this.bubbleExpandTimer), this.bubbleExpandTimer = null), this.isBubbleExpanded && (this.bubbleCollapseTimer = setTimeout(() => {
        this.collapseBubble();
      }, 200)));
    }, i = (a) => {
      var o;
      if (!this.enableBubbleMode || !this.isBubbleExpanded) return;
      const n = a.target;
      n && !((o = this.tabContainer) != null && o.contains(n)) && (this.bubbleCollapseTimer && clearTimeout(this.bubbleCollapseTimer), this.collapseBubble());
    };
    this.tabContainer._bubbleMouseEnterHandler = e, this.tabContainer._bubbleMouseLeaveHandler = t, this.tabContainer._bubbleClickOutsideHandler = i, this.tabContainer.addEventListener("mouseenter", e), this.tabContainer.addEventListener("mouseleave", t), document.addEventListener("click", i, !0);
  }
  /**
   * 展开气泡
   */
  expandBubble() {
    if (!this.tabContainer || !this.enableBubbleMode || this.isBubbleExpanded) return;
    if (this.isBubbleAnimating && (this.verboseLog("🫧 检测到收起动画进行中，取消所有动画定时器"), this.cancelBubbleAnimations(), this.tabContainer)) {
      this.tabContainer.style.transform = "", this.tabContainer.style.opacity = "";
      const o = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)", s = this.isVerticalMode ? this.verticalPosition : this.position, c = ae(
        this.isVerticalMode,
        s,
        o,
        this.verticalWidth,
        void 0,
        void 0,
        !0,
        !1
      );
      this.tabContainer.style.cssText = c, this.tabContainer.style.overflow = "clip", this.tabContainer.style.overflowY = "clip", this.tabContainer.style.overflowX = "clip", requestAnimationFrame(() => {
      });
    }
    this.isBubbleExpanded = !0, this.isBubbleAnimating = !0;
    const e = this.tabContainer.querySelector(".bubble-overlay");
    e && (e.style.display = "none", e.style.opacity = "0", e.style.transform = "scale(0.8)"), this.tabContainer.style.transform = "scale(0.8)", this.tabContainer.style.opacity = "0.7";
    const t = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)", i = this.isVerticalMode ? this.verticalPosition : this.position, a = ae(
      this.isVerticalMode,
      i,
      t,
      this.verticalWidth,
      void 0,
      void 0,
      !0,
      !0
    );
    this.tabContainer && W(this.tabContainer, () => {
      this.tabContainer.style.cssText = a, this.tabContainer.style.overflow = "hidden", this.tabContainer.style.overflowY = "", this.tabContainer.style.overflowX = "";
    }), this.isUpdating = !1, this.lastUpdateTime = 0, requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.tabContainer.style.transition = "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", this.tabContainer.style.transform = "scale(1)", this.tabContainer.style.opacity = "1", this.updateTabsUI().then(() => {
          var s;
          const o = (s = this.tabContainer) == null ? void 0 : s.querySelectorAll(".orca-tab");
          if (!o || o.length === 0) {
            this.verboseLog("⚠️ 标签未加载，重试更新UI");
            const c = setTimeout(() => {
              this.isUpdating = !1, this.updateTabsUI().then(() => {
                this.applyTabAnimation();
              });
            }, 100);
            this.bubbleAnimationTimers.add(c);
          } else
            this.applyTabAnimation();
        }).catch((o) => {
          this.log(`❌ 更新标签UI失败: ${o}`), this.applyTabAnimation();
        });
      });
    });
    const n = setTimeout(() => {
      this.isBubbleAnimating = !1, this.verboseLog("🫧 展开动画完成");
    }, 800);
    this.bubbleAnimationTimers.add(n), this.verboseLog("🫧 气泡已展开");
  }
  /**
   * 应用标签动画
   */
  applyTabAnimation() {
    var i, a;
    const e = (i = this.tabContainer) == null ? void 0 : i.querySelectorAll(".orca-tab");
    if (!e || e.length === 0) return;
    this.tabContainer && this.enableBubbleMode && this.isBubbleExpanded && (this.tabContainer.style.overflow = "hidden", this.tabContainer.style.overflowY = "", this.tabContainer.style.overflowX = ""), e.forEach((n, o) => {
      const s = n, c = s.getAttribute("data-focused") === "true", l = c ? "0.5" : "0";
      s.style.setProperty("opacity", l, "important"), s.style.transform = "translateY(-8px)", s.style.transition = "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)", setTimeout(() => {
        c ? s.style.setProperty("opacity", "1", "important") : s.style.opacity = "1", s.style.transform = "translateY(0)";
      }, o * 15 + 50);
    });
    const t = (a = this.tabContainer) == null ? void 0 : a.querySelectorAll(".new-tab-button, .workspace-button");
    t && t.length > 0 && t.forEach((n, o) => {
      const s = n;
      s.style.opacity = "0", s.style.transform = "translateY(-8px)", s.style.transition = "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)", setTimeout(() => {
        s.style.opacity = "1", s.style.transform = "translateY(0)";
      }, (e.length + o) * 15 + 50);
    }), setTimeout(() => {
      this.tabContainer && this.enableBubbleMode && this.isBubbleExpanded && (this.tabContainer.style.overflow = "", this.tabContainer.style.overflowY = "auto", this.tabContainer.style.overflowX = "hidden");
    }, 450);
  }
  /**
   * 取消所有气泡动画
   */
  cancelBubbleAnimations() {
    this.bubbleAnimationTimers.forEach((e) => {
      clearTimeout(e);
    }), this.bubbleAnimationTimers.clear(), this.bubbleExpandTimer && (clearTimeout(this.bubbleExpandTimer), this.bubbleExpandTimer = null), this.bubbleCollapseTimer && (clearTimeout(this.bubbleCollapseTimer), this.bubbleCollapseTimer = null), this.tabContainer && (this.tabContainer.style.transition = "none", this.tabContainer.offsetHeight), this.isBubbleAnimating = !1;
  }
  /**
   * 收起气泡
   */
  collapseBubble() {
    if (!this.tabContainer || !this.enableBubbleMode || !this.isBubbleExpanded) return;
    this.isBubbleAnimating && (this.verboseLog("🫧 检测到展开动画进行中，取消所有动画定时器"), this.cancelBubbleAnimations()), this.isBubbleExpanded = !1, this.isBubbleAnimating = !0;
    const e = this.tabContainer.querySelectorAll(".orca-tab");
    e.forEach((a, n) => {
      const o = a, s = o.getAttribute("data-focused") === "true", c = o.style.opacity || "1";
      o.style.setProperty("opacity", c, "important");
      const l = s ? "0.4s" : "0.3s", d = "0";
      o.style.transition = `opacity ${l} cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)`;
      const u = setTimeout(() => {
        o.style.setProperty("opacity", d, "important"), o.style.transform = "translateY(-8px)";
      }, n * 8);
      this.bubbleAnimationTimers.add(u);
    });
    const t = this.tabContainer.querySelectorAll(".new-tab-button, .workspace-button");
    t.forEach((a, n) => {
      const o = a, s = o.style.opacity || "1";
      o.style.opacity = s, o.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
      const c = setTimeout(() => {
        o.style.opacity = "0", o.style.transform = "translateY(-8px)";
      }, (e.length + n) * 8);
      this.bubbleAnimationTimers.add(c);
    });
    const i = setTimeout(() => {
      const a = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)", n = this.isVerticalMode ? this.verticalPosition : this.position, o = ae(
        this.isVerticalMode,
        n,
        a,
        this.verticalWidth,
        void 0,
        void 0,
        !0,
        !1
      );
      this.tabContainer && (this.tabContainer.style.cssText = o, this.tabContainer.style.overflow = "clip", this.tabContainer.style.overflowY = "clip", this.tabContainer.style.overflowX = "clip", requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.tabContainer.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", this.tabContainer.style.transform = "scale(0.8)", this.tabContainer.style.opacity = "0.7";
          const s = setTimeout(() => {
            e.forEach((l) => {
              l.style.setProperty("opacity", "0", "important");
            }), t.forEach((l) => {
              const d = l;
              d.style.opacity = "0";
            });
          }, 500);
          this.bubbleAnimationTimers.add(s);
          const c = setTimeout(() => {
            var u;
            this.createBubbleOverlay();
            const l = (u = this.tabContainer) == null ? void 0 : u.querySelector(".bubble-overlay");
            l && (l.style.opacity = "0", l.style.transform = "scale(0.9)", l.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)", requestAnimationFrame(() => {
              l.style.opacity = "1", l.style.transform = "scale(1)";
              const h = l.querySelector("div");
              if (h) {
                const b = [
                  {
                    filter: "drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
                    transform: "scale(1) rotate(0deg)",
                    offset: 0
                  },
                  {
                    filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 16px rgba(255, 255, 255, 0.6))",
                    transform: "scale(1.05) rotate(180deg)",
                    offset: 0.5
                  },
                  {
                    filter: "drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
                    transform: "scale(1) rotate(360deg)",
                    offset: 1
                  }
                ];
                h.animate(b, {
                  duration: 400,
                  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }).addEventListener("finish", () => {
                  h.style.filter = "", h.style.transform = "";
                });
              }
            })), this.tabContainer.style.transform = "scale(1)", this.tabContainer.style.opacity = "1";
            const d = setTimeout(() => {
              this.isBubbleAnimating = !1, this.verboseLog("🫧 收起动画完成");
            }, 100);
            this.bubbleAnimationTimers.add(d);
          }, 300);
          this.bubbleAnimationTimers.add(c);
        });
      }));
    }, 50);
    this.bubbleAnimationTimers.add(i), this.verboseLog("🫧 气泡已收起");
  }
  /**
   * 创建气泡覆盖层（用于最小化时覆盖所有内容）
   */
  createBubbleOverlay() {
    var o, s;
    if (!this.tabContainer) return;
    const e = this.tabContainer.querySelector(".bubble-overlay");
    e && e.remove();
    const t = document.createElement("div");
    t.className = "bubble-overlay";
    const i = "var(--orca-color-bg-2)";
    t.style.cssText = `
      position: absolute;
      top: -1px;
      left: -1px;
      width: calc(100% + 2px);
      height: calc(100% + 2px);
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${i};
      border-radius: inherit;
      z-index: 9999;
      pointer-events: auto;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      opacity: 1;
      transform: scale(1);
    `;
    const a = document.createElement("div"), n = document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark") || ((s = (o = window.orca) == null ? void 0 : o.state) == null ? void 0 : s.themeMode) === "dark";
    a.style.cssText = `
      font-size: 16px;
      font-weight: bold;
      color: ${n ? "var(--orca-color-text-1, #ffffff)" : "var(--orca-text-primary, #333)"};
      user-select: none;
      pointer-events: none;
      text-shadow: ${n ? "0 1px 2px rgba(0, 0, 0, 0.5)" : "none"};
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      position: relative;
    `, a.textContent = "+", t.appendChild(a), this.tabContainer.appendChild(t), this.tabContainer.style.position !== "fixed" && (this.tabContainer.style.position = "fixed");
  }
  /**
   * 检测容器是否靠近屏幕边缘
   */
  detectEdgeProximity() {
    if (!this.tabContainer) return null;
    const e = this.tabContainer.getBoundingClientRect(), t = $.EDGE_DETECTION_DISTANCE;
    return !e || e.width === 0 || e.height === 0 ? (this.verboseLog("🔍 容器尺寸无效，跳过边缘检测"), null) : e.left < -e.width || e.top < -e.height || e.left > window.innerWidth || e.top > window.innerHeight ? (this.verboseLog("🔍 容器位置异常，跳过边缘检测"), null) : e.left <= t ? "left" : window.innerWidth - e.right <= t ? "right" : e.top <= t ? "top" : window.innerHeight - e.bottom <= t ? "bottom" : null;
  }
  /**
   * 防抖的贴边隐藏样式应用
   */
  debouncedApplyEdgeHideStyle(e = 200) {
    this.edgeHideDebounceTimer && clearTimeout(this.edgeHideDebounceTimer), this.edgeHideDebounceTimer = setTimeout(() => {
      this.applyEdgeHideStyle(), this.edgeHideDebounceTimer = null;
    }, e);
  }
  /**
   * 应用贴边隐藏样式
   */
  applyEdgeHideStyle() {
    if (!this.tabContainer) return;
    if (this.isUpdatingDOM) {
      this.verboseLog("🔍 DOM正在更新中，跳过贴边隐藏检测");
      return;
    }
    const e = this.detectEdgeProximity();
    if (this.verboseLog(`🔍 applyEdgeHideStyle: detectedEdge=${e}, currentEdgeSide=${this.currentEdgeSide}, isVerticalMode=${this.isVerticalMode}`), e !== this.currentEdgeSide || this.currentEdgeSide && this.enableEdgeHide) {
      if (this.currentEdgeSide = e, !this.currentEdgeSide) {
        this.tabContainer.style.transform = "none", this.tabContainer.style.maxHeight = "", this.isEdgeHideExpanded = !0, this.boundContainerMouseEnter && this.boundContainerMouseLeave && (this.tabContainer.removeEventListener("mouseenter", this.boundContainerMouseEnter), this.tabContainer.removeEventListener("mouseleave", this.boundContainerMouseLeave), this.boundContainerMouseEnter = null, this.boundContainerMouseLeave = null), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.verboseLog("📍 远离边缘，恢复正常显示");
        return;
      }
      const t = this.tabContainer.getBoundingClientRect();
      this.applyEdgeConstraints();
      const i = $.EDGE_HINT_SIZE;
      switch (this.currentEdgeSide) {
        case "left":
          {
            const a = t.width, n = a - i;
            this.verboseLog(`📦 左贴边隐藏: containerWidth=${a}, hintSize=${i}, translateAmount=${n}`), this.tabContainer.style.transform = `translateX(-${n}px)`;
          }
          break;
        case "right":
          {
            const a = t.width, n = a - i;
            this.verboseLog(`📦 右贴边隐藏: containerWidth=${a}, hintSize=${i}, translateAmount=${n}`), this.tabContainer.style.transform = `translateX(${n}px)`;
          }
          break;
        case "top":
          {
            const a = this.tabContainer.offsetHeight;
            this.tabContainer.style.transform = `translateY(-${a - i}px)`;
          }
          break;
        case "bottom":
          {
            const a = this.tabContainer.offsetHeight;
            this.tabContainer.style.transform = `translateY(${a - i}px)`;
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
          const i = window.innerHeight - e.top - t;
          this.tabContainer.style.maxHeight = `${Math.max(100, i)}px`, this.verboseLog(`📏 顶部贴边：可用高度 ${i}px`);
        }
        break;
      case "bottom":
        {
          const i = e.top + e.height - t;
          this.tabContainer.style.maxHeight = `${Math.max(100, i)}px`, this.verboseLog(`📏 底部贴边：容器top=${e.top}, height=${e.height}, 限制高度=${i}px`);
        }
        break;
      case "left":
      case "right":
        {
          const i = window.innerHeight * 0.8;
          this.tabContainer.style.maxHeight = `${i}px`, this.verboseLog(`📏 ${this.currentEdgeSide}侧贴边：限制高度 ${i}px`);
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
    const t = this.currentLogLevel === L.VERBOSE;
    this.edgeHideTriggerElement.style.cssText = `
      position: fixed;
      z-index: 999;
      background: ${t ? "rgba(255, 0, 0, 0.3)" : "transparent"};
      pointer-events: auto;
      border: ${t ? "2px solid red" : "none"};
    `;
    const i = $.EDGE_TRIGGER_ZONE_SIZE, a = e || this.tabContainer.getBoundingClientRect();
    switch (this.currentEdgeSide) {
      case "left":
        this.edgeHideTriggerElement.style.left = "0", this.edgeHideTriggerElement.style.top = `${a.top}px`, this.edgeHideTriggerElement.style.width = `${i + $.EDGE_HINT_SIZE}px`, this.edgeHideTriggerElement.style.height = `${a.height}px`;
        break;
      case "right":
        this.edgeHideTriggerElement.style.right = "0", this.edgeHideTriggerElement.style.top = `${a.top}px`, this.edgeHideTriggerElement.style.width = `${i + $.EDGE_HINT_SIZE}px`, this.edgeHideTriggerElement.style.height = `${a.height}px`;
        break;
      case "top":
        this.edgeHideTriggerElement.style.left = `${a.left}px`, this.edgeHideTriggerElement.style.top = "0", this.edgeHideTriggerElement.style.width = `${a.width}px`, this.edgeHideTriggerElement.style.height = `${i + $.EDGE_HINT_SIZE}px`;
        break;
      case "bottom":
        this.edgeHideTriggerElement.style.left = `${a.left}px`, this.edgeHideTriggerElement.style.bottom = "0", this.edgeHideTriggerElement.style.width = `${a.width}px`, this.edgeHideTriggerElement.style.height = `${i + $.EDGE_HINT_SIZE}px`;
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
    this.verboseLog(`🎯 创建触发区域: ${this.currentEdgeSide}侧`), this.verboseLog(`   - 触发区域大小: ${i}px`), this.verboseLog(`   - 触发区域位置: left=${n.left}, top=${n.top}, width=${n.width}, height=${n.height}`), this.verboseLog(`   - 容器位置（隐藏前）: left=${a.left}, top=${a.top}, width=${a.width}, height=${a.height}`), this.verboseLog(`   - 容器当前transform: ${this.tabContainer.style.transform}`), this.verboseLog(`   - isEdgeHideExpanded: ${this.isEdgeHideExpanded}`);
  }
  /**
   * 处理贴边隐藏的鼠标进入事件
   */
  handleEdgeHideMouseEnter() {
    if (this.verboseLog(`📥 handleEdgeHideMouseEnter - isExpanded: ${this.isEdgeHideExpanded}`), this.edgeHideCollapseTimer && (clearTimeout(this.edgeHideCollapseTimer), this.edgeHideCollapseTimer = null, this.verboseLog("⏹️ 清除收起定时器")), this.isEdgeHideExpanded) {
      this.verboseLog("✅ 已经展开，跳过");
      return;
    }
    this.verboseLog(`⏰ 设置展开定时器: ${$.EDGE_HIDE_EXPAND_DELAY}ms`), this.edgeHideExpandTimer = window.setTimeout(() => {
      this.verboseLog("🚀 展开定时器触发"), this.expandEdgeHide();
    }, $.EDGE_HIDE_EXPAND_DELAY);
  }
  /**
   * 处理贴边隐藏的鼠标离开事件
   */
  handleEdgeHideMouseLeave() {
    this.edgeHideExpandTimer && (clearTimeout(this.edgeHideExpandTimer), this.edgeHideExpandTimer = null), this.isEdgeHideExpanded && (this.edgeHideCollapseTimer = window.setTimeout(() => {
      this.collapseEdgeHide();
    }, $.EDGE_HIDE_COLLAPSE_DELAY));
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
    const e = $.EDGE_HINT_SIZE, t = this.tabContainer.getBoundingClientRect();
    switch (this.currentEdgeSide) {
      case "left":
        {
          const i = t.width;
          this.verboseLog(`📦 左贴边收起: containerWidth=${i}, translateAmount=${i - e}`), this.tabContainer.style.transform = `translateX(-${i - e}px)`;
        }
        break;
      case "right":
        {
          const i = t.width;
          this.verboseLog(`📦 右贴边收起: containerWidth=${i}, translateAmount=${i - e}`), this.tabContainer.style.transform = `translateX(${i - e}px)`;
        }
        break;
      case "top":
        {
          const i = this.tabContainer.offsetHeight;
          this.tabContainer.style.transform = `translateY(-${i - e}px)`;
        }
        break;
      case "bottom":
        {
          const i = this.tabContainer.offsetHeight;
          this.tabContainer.style.transform = `translateY(${i - e}px)`;
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
        (a) => a.type === "attributes" && a.attributeName === "class"
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
    const t = e.classList.contains("sidebar-closed"), i = e.classList.contains("sidebar-opened");
    t ? this.lastSidebarState = "closed" : i ? this.lastSidebarState = "opened" : this.lastSidebarState = "unknown";
  }
  /**
   * 立即检查侧边栏状态变化（无防抖）
   */
  checkSidebarStateChangeImmediate() {
    if (!this.isSidebarAlignmentEnabled) return;
    const e = document.querySelector("div#app");
    if (!e) return;
    const t = e.classList.contains("sidebar-closed"), i = e.classList.contains("sidebar-opened");
    let a;
    t ? a = "closed" : i ? a = "opened" : a = "unknown", this.lastSidebarState !== a && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${a}`), this.lastSidebarState = a, this.autoAdjustSidebarAlignment());
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
      const i = t.classList.contains("sidebar-closed"), a = t.classList.contains("sidebar-opened");
      if (!i && !a) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const n = this.getCurrentPosition();
      if (!n) return;
      const o = this.calculateSidebarAlignmentPosition(
        n,
        e,
        i,
        a
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
  calculateSidebarAlignmentPosition(e, t, i, a) {
    var o;
    let n;
    if (i)
      n = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${n}px`);
    else if (a) {
      n = e.x + t;
      const s = ((o = this.tabContainer) == null ? void 0 : o.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      n = Math.min(n, window.innerWidth - s - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${n}px`);
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
          title: this.isFloatingWindowVisible ? "隐藏标签栏" : "显示标签栏"
        }, e.createElement("i", {
          className: `${this.isFloatingWindowVisible ? "ti ti-eye" : "ti ti-eye-off"} orca-headbar-icon`
        }));
      }), this.showInHeadbar && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.debugButton`, () => {
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: () => this.toggleBlockTypeIcons(),
          title: this.showBlockTypeIcons ? "隐藏块类型图标" : "显示块类型图标"
        }, e.createElement("i", {
          className: `${this.showBlockTypeIcons ? "ti ti-palette" : "ti ti-palette-off"} orca-headbar-icon`
        }));
      }), this.enableRecentlyClosedTabs && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.recentlyClosedButton`, () => {
        var i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (a) => this.showRecentlyClosedTabsMenu(a),
          title: `最近关闭的标签页 (${((i = this.recentlyClosedTabs) == null ? void 0 : i.length) || 0})`
        }, e.createElement("i", {
          className: "ti ti-history orca-headbar-icon"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton(`${this.pluginName}.savedTabsButton`, () => {
        var i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (a) => this.showSavedTabSetsMenu(a),
          title: `保存的标签页集合 (${((i = this.savedTabSets) == null ? void 0 : i.length) || 0})`
        }, e.createElement("i", {
          className: "ti ti-bookmark orca-headbar-icon"
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
    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      if (N(a)) {
        this.verboseLog(`⏭️ 跳过视图面板: ${a.title}`);
        continue;
      }
      try {
        const n = await orca.invokeBackend("get-block", parseInt(a.blockId));
        if (n) {
          const o = await ge(n), s = this.findProperty(n, "_color"), c = this.findProperty(n, "_icon");
          let l = a.color, d = a.icon;
          s && s.type === 1 && (l = s.value), c && c.type === 1 && c.value && c.value.trim() ? d = c.value : d || (d = te(o)), a.blockType !== o || a.icon !== d || a.color !== l ? (e[i] = {
            ...a,
            blockType: o,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${a.title} -> 类型: ${o}, 图标: ${d}, 颜色: ${l}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${a.title} (无需更新)`);
        }
      } catch (n) {
        this.warn(`更新标签失败: ${a.title}`, n);
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
      if (Z(e))
        return this.log("⚠️ sidebar 被 content-visibility 隐藏，跳过宽度获取以避免渲染警告"), 0;
      this.log("   侧边栏元素信息:"), this.log(`     - ID: ${e.id}`), this.log(`     - 类名: ${e.className}`), this.log(`     - 标签名: ${e.tagName}`);
      const i = window.getComputedStyle(e).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${i}"`), i && i !== "") {
        const n = parseInt(i.replace("px", ""));
        if (isNaN(n))
          this.log(`⚠️ CSS变量值无法解析为数字: "${i}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${n}px`), n;
      } else
        this.log("⚠️ CSS变量 --orca-sidebar-width 不存在或为空");
      this.log("   尝试获取实际宽度...");
      const a = e.getBoundingClientRect();
      return this.log(`   实际尺寸: width=${a.width}px, height=${a.height}px`), a.width > 0 ? (this.log(`✅ 从实际尺寸获取侧边栏宽度: ${a.width}px`), a.width) : (this.log("⚠️ 无法获取侧边栏宽度，所有方法都失败"), 0);
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
    const t = e.clientX, i = this.verticalWidth, a = (o) => {
      const s = o.clientX - t, c = Math.max(120, Math.min(400, i + s));
      this.verticalWidth = c, this.tabContainer.style.width = `${c}px`;
    }, n = async () => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", n);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (o) {
        this.error("保存宽度设置失败:", o);
      }
    };
    document.addEventListener("mousemove", a), document.addEventListener("mouseup", n);
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
    t.className = "orca-tab", e.tabId || (e.tabId = G(e.blockId)), t.setAttribute("data-tab-id", e.tabId), t.setAttribute("data-block-id", e.blockId), this.isTabActive(e) && t.setAttribute("data-focused", "true");
    const a = this.isVerticalMode && !this.isFixedToTop, n = De(e, a, () => "", this.horizontalTabMaxWidth, this.horizontalTabMinWidth);
    t.style.cssText = n;
    const o = $i();
    if (e.icon && this.showBlockTypeIcons) {
      const l = Li(e.icon);
      o.appendChild(l);
    }
    const s = Di(e.title);
    if (o.appendChild(s), e.isPinned) {
      const l = Mi();
      o.appendChild(l);
    }
    const c = Bi();
    return c.addEventListener("click", (l) => {
      l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.closeTab(e);
    }), o.appendChild(c), t.appendChild(o), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), this.hideTabTooltips || D(t, xe(e)), t.addEventListener("click", (l) => {
      var b;
      const d = l.target;
      if (d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle"))
        return;
      if (t.getAttribute("data-long-pressed") === "true") {
        t.removeAttribute("data-long-pressed");
        return;
      }
      if (document.querySelector(".hover-tab-list-container")) {
        H();
        return;
      }
      l.preventDefault(), this.verboseLog(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`), this.closedTabs.has(e.blockId) && (this.closedTabs.delete(e.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${e.title}"，从已关闭列表中移除`));
      const h = (b = this.tabContainer) == null ? void 0 : b.querySelectorAll(".orca-tabs-plugin .orca-tab");
      h == null || h.forEach((p) => p.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (l) => {
    }), t.addEventListener("dblclick", (l) => {
      const d = l.target;
      d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle") || (l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.log(`🔧 双击事件处理: enableDoubleClickClose=${this.enableDoubleClickClose}`), this.enableDoubleClickClose ? (this.log("🔧 双击关闭标签页"), this.closeTab(e)) : (this.log("🔧 双击切换固定状态"), this.toggleTabPinStatus(e)));
    }), t.addEventListener("auxclick", (l) => {
      l.button === 1 && (l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.log(`🔧 中键事件处理: enableMiddleClickPin=${this.enableMiddleClickPin}`), this.enableMiddleClickPin ? (this.log("🔧 中键固定标签页"), this.toggleTabPinStatus(e)) : (this.log("🔧 中键关闭标签页"), this.closeTab(e)));
    }), t.addEventListener("keydown", (l) => {
      (l.target === t || t.contains(l.target)) && (l.key === "F2" ? (l.preventDefault(), l.stopPropagation(), this.renameTab(e)) : l.ctrlKey && l.key === "w" && (l.preventDefault(), l.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), this.addLongPressTabListEvents(t, e), t.draggable = !0, t.addEventListener("dragstart", (l) => {
      var h, b;
      const d = l.target;
      if (d.closest && d.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        l.preventDefault();
        return;
      }
      if (d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle")) {
        l.preventDefault();
        return;
      }
      l.dataTransfer.effectAllowed = "move", l.dataTransfer.dropEffect = "move", (h = l.dataTransfer) == null || h.setData("text/plain", e.blockId);
      const u = document.createElement("img");
      u.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", u.style.opacity = "0";
      try {
        const p = t.getBoundingClientRect(), m = l.clientX - p.left, g = l.clientY - p.top;
        (b = l.dataTransfer) == null || b.setDragImage(u, m, g);
      } catch {
      }
      this.draggingTab = e, this.dragOverTab = null, this.lastSwapKey = "", this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (this.verboseLog("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), this.verboseLog("🔄 拖拽开始，设置draggingTab:", e.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), requestAnimationFrame(() => {
        t.style.opacity = "0", t.style.pointerEvents = "none";
      }), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", async (l) => {
      this.verboseLog("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (this.verboseLog("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback();
      const d = this.getCurrentPanelTabs();
      await this.setCurrentPanelTabs(d), this.draggingTab = null, this.dragOverTab = null, this.lastSwapKey = "", this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (l) => {
      const d = l.target;
      if (!d.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        if (this.tabContainer && !this.tabContainer.contains(d)) {
          l.dataTransfer.dropEffect = "none";
          return;
        }
        if (!(d.classList.contains("close-button") || d.classList.contains("new-tab-button") || d.classList.contains("drag-handle") || d.classList.contains("resize-handle") || d.classList.contains("tab-icon")) && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
          if (this.draggingTab.isPinned !== e.isPinned) {
            l.dataTransfer.dropEffect = "none";
            return;
          }
          l.preventDefault(), l.stopPropagation(), l.dataTransfer.dropEffect = "move";
          const u = t.getBoundingClientRect(), h = this.isVerticalMode && !this.isFixedToTop;
          let b;
          if (h) {
            const m = u.top + u.height / 2;
            b = l.clientY < m ? "before" : "after";
          } else {
            const m = u.left + u.width / 2;
            b = l.clientX < m ? "before" : "after";
          }
          this.updateDropIndicator(t, b), this.dragOverTab = e;
          const p = `${e.blockId}-${b}`;
          this.lastSwapKey !== p && (this.lastSwapKey = p, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
            await this.swapTabsRealtime(e, this.draggingTab, b);
          }, 100)), this.verboseLog(`🔄 拖拽经过: ${e.title} (位置: ${b})`);
        }
      }
    }), t.addEventListener("dragenter", (l) => {
      if (!l.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (this.draggingTab.isPinned !== e.isPinned)
          return;
        l.preventDefault(), l.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`);
      }
    }), t.addEventListener("dragleave", (l) => {
      const d = t.getBoundingClientRect(), u = l.clientX, h = l.clientY, b = 5;
      (u < d.left - b || u > d.right + b || h < d.top - b || h > d.bottom + b) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (l) => {
      var u;
      l.preventDefault(), l.stopPropagation();
      const d = (u = l.dataTransfer) == null ? void 0 : u.getData("text/plain");
      this.log(`🔄 拖拽放置完成: ${d} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return Pi(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const i = parseInt(t[1], 16), a = parseInt(t[2], 16), n = parseInt(t[3], 16);
      return (0.299 * i + 0.587 * a + 0.114 * n) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (i) {
      let a = parseInt(i[1], 16), n = parseInt(i[2], 16), o = parseInt(i[3], 16);
      a = Math.floor(a * (1 - t)), n = Math.floor(n * (1 - t)), o = Math.floor(o * (1 - t));
      const s = a.toString(16).padStart(2, "0"), c = n.toString(16).padStart(2, "0"), l = o.toString(16).padStart(2, "0");
      return `#${s}${c}${l}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, i) {
    const a = e / 255, n = t / 255, o = i / 255, s = (_) => _ <= 0.04045 ? _ / 12.92 : Math.pow((_ + 0.055) / 1.055, 2.4), c = s(a), l = s(n), d = s(o), u = c * 0.4124564 + l * 0.3575761 + d * 0.1804375, h = c * 0.2126729 + l * 0.7151522 + d * 0.072175, b = c * 0.0193339 + l * 0.119192 + d * 0.9503041, p = 0.2104542553 * u + 0.793617785 * h - 0.0040720468 * b, m = 1.9779984951 * u - 2.428592205 * h + 0.4505937099 * b, g = 0.0259040371 * u + 0.7827717662 * h - 0.808675766 * b, f = Math.cbrt(p), v = Math.cbrt(m), w = Math.cbrt(g), T = 0.2104542553 * f + 0.793617785 * v + 0.0040720468 * w, x = 1.9779984951 * f - 2.428592205 * v + 0.4505937099 * w, E = 0.0259040371 * f + 0.7827717662 * v - 0.808675766 * w, k = Math.sqrt(x * x + E * E), S = Math.atan2(E, x) * 180 / Math.PI, A = S < 0 ? S + 360 : S;
    return { l: T, c: k, h: A };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, i) {
    const a = i * Math.PI / 180, n = t * Math.cos(a), o = t * Math.sin(a), s = e, c = n, l = o, d = s * s * s, u = c * c * c, h = l * l * l, b = 1.0478112 * d + 0.0228866 * u - 0.050217 * h, p = 0.0295424 * d + 0.9904844 * u + 0.0170491 * h, m = -92345e-7 * d + 0.0150436 * u + 0.7521316 * h, g = 3.2404542 * b - 1.5371385 * p - 0.4985314 * m, f = -0.969266 * b + 1.8760108 * p + 0.041556 * m, v = 0.0556434 * b - 0.2040259 * p + 1.0572252 * m, w = (k) => k <= 31308e-7 ? 12.92 * k : 1.055 * Math.pow(k, 1 / 2.4) - 0.055, T = Math.max(0, Math.min(255, Math.round(w(g) * 255))), x = Math.max(0, Math.min(255, Math.round(w(f) * 255))), E = Math.max(0, Math.min(255, Math.round(w(v) * 255)));
    return { r: T, g: x, b: E };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return Yi(e, t);
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
        const e = this.panelTabsData[this.currentPanelIndex] || [], t = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
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
    const e = this.panelTabsData[this.currentPanelIndex] || [], t = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
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
      this.verboseLog(`🔄 开始切换标签: ${e.title} (ID: ${e.blockId})`), this.isSwitchingTab = !0, e.tabId && (this.lastActiveTabInstanceId = e.tabId);
      const t = this.getCurrentActiveTab();
      t && (this.recordScrollPosition(t), this.lastActiveBlockId = t.blockId, this.verboseLog(`🎯 记录切换前的激活标签: ${t.title} (ID: ${t.blockId})`), this.recordTabSwitchHistory(t.blockId, e));
      const i = this.getPanelIds();
      let a = "";
      if (e.panelId && i.includes(e.panelId) ? a = e.panelId : this.currentPanelId && i.includes(this.currentPanelId) ? a = this.currentPanelId : i.length > 0 && (a = i[0]), !a) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const n = i.indexOf(a);
      n !== -1 ? (this.currentPanelIndex = n, this.currentPanelId = a) : this.warn(`⚠️ 目标面板 ${a} 不在面板列表中`), this.verboseLog(`🎯 目标面板ID: ${a}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(a);
      } catch (o) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", o);
      }
      if (N(e)) {
        const o = e.blockId.startsWith("view:") ? e.blockId.substring(5) : e.panelId;
        this.verboseLog(`🖼️ 检测到视图面板，使用 switchFocusTo 导航: ${o}`);
        try {
          orca.nav.switchFocusTo(o), this.verboseLog(`✅ 视图面板导航成功: ${e.title}`), this.lastActiveBlockId = e.blockId, setTimeout(() => {
            this.isSwitchingTab = !1;
          }, 300);
          return;
        } catch (s) {
          this.warn("⚠️ 视图面板导航失败:", s);
        }
      }
      try {
        this.verboseLog(`🚀 尝试使用安全导航到块 ${e.blockId}`), await this.safeNavigate(e.blockId, a, e), this.verboseLog("✅ 安全导航成功");
      } catch (o) {
        this.warn("导航失败，尝试备用方法:", o);
        const s = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (s)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), s.click();
        else {
          this.error("无法找到目标块元素:", e.blockId);
          const c = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          c ? (this.log("🔄 找到备用块元素，尝试点击"), c.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = e.blockId, this.verboseLog(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
        this.debugScrollPosition(e);
      }, 500), await this.focusTabElementById(e.tabId || e.blockId, e.blockId), this.enableBubbleMode && this.isBubbleExpanded && this.tabContainer && requestAnimationFrame(() => {
        var s;
        const o = (s = this.tabContainer) == null ? void 0 : s.querySelectorAll(".orca-tab");
        o == null || o.forEach((c) => {
          const l = c;
          l.style.opacity = "1", l.style.transform = "", (!l.style.transition || l.style.transition === "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)") && (l.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)");
        });
      }), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页切换，实时更新工作区: ${e.title}`)), setTimeout(() => {
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
    const i = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    return i ? i.getAttribute("data-block-id") === e.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), i = t.findIndex((n) => n.blockId === e.blockId);
    if (i === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let a = -1;
    if (i === 0 ? a = 1 : i === t.length - 1 ? a = i - 1 : a = i + 1, a >= 0 && a < t.length) {
      const n = t[a];
      this.log(`🔄 自动切换到相邻标签: "${n.title}" (位置: ${a})`), this.currentPanelId && await this.safeNavigate(n.blockId, this.currentPanelId || "", n);
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), i = rt(e, t, {
      updateOrder: !0,
      saveData: !0,
      updateUI: !0
    });
    i.success ? (this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页固定状态变化，实时更新工作区: ${e.title}`)), this.log(i.message)) : this.warn(i.message);
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
        },
        hideTabTooltips: {
          label: "隐藏标签页提示",
          type: "boolean",
          defaultValue: !1,
          description: "开启后将隐藏标签页的悬停提示（tooltip），减少视觉干扰"
        }
      };
      await orca.plugins.setSettingsSchema(this.pluginName, t);
      const i = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      i != null && i.homePageBlockId && (this.homePageBlockId = i.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (i == null ? void 0 : i.showInHeadbar) !== void 0 && (this.showInHeadbar = i.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (i == null ? void 0 : i.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = i.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (i == null ? void 0 : i.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = i.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (i == null ? void 0 : i.enableWorkspaces) !== void 0 && (this.enableWorkspaces = i.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), (i == null ? void 0 : i.debugMode) !== void 0 && (i.debugMode ? this.setLogLevel(L.VERBOSE) : this.setLogLevel(L.INFO), await this.storageService.saveConfig(C.DEBUG_MODE, i.debugMode, this.pluginName)), (i == null ? void 0 : i.restoreFocusedTab) !== void 0 && (this.restoreFocusedTab = i.restoreFocusedTab, this.log(`🎯 刷新后恢复聚焦标签页: ${this.restoreFocusedTab ? "开启" : "关闭"}`), await this.storageService.saveConfig(C.RESTORE_FOCUSED_TAB, i.restoreFocusedTab, this.pluginName)), (i == null ? void 0 : i.enableMiddleClickPin) !== void 0 && (this.enableMiddleClickPin = i.enableMiddleClickPin, this.enableDoubleClickClose = i.enableMiddleClickPin, await this.storageService.saveConfig(C.ENABLE_MIDDLE_CLICK_PIN, i.enableMiddleClickPin, this.pluginName), await this.storageService.saveConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, i.enableMiddleClickPin, this.pluginName)), (i == null ? void 0 : i.enableDoubleClickClose) !== void 0 && (this.enableMiddleClickPin = i.enableDoubleClickClose, this.enableDoubleClickClose = i.enableDoubleClickClose, await this.storageService.saveConfig(C.ENABLE_MIDDLE_CLICK_PIN, i.enableDoubleClickClose, this.pluginName), await this.storageService.saveConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, i.enableDoubleClickClose, this.pluginName)), (i == null ? void 0 : i.hideTabTooltips) !== void 0 && (this.hideTabTooltips = i.hideTabTooltips, this.log(`💬 标签页提示: ${i.hideTabTooltips ? "隐藏" : "显示"}`)), this.log("✅ 插件设置已注册");
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
      debugMode: this.currentLogLevel === L.VERBOSE,
      restoreFocusedTab: this.restoreFocusedTab,
      enableMiddleClickPin: this.enableMiddleClickPin,
      hideTabTooltips: this.hideTabTooltips
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
      const i = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      if (!i) return;
      if (i.showInHeadbar !== this.lastSettings.showInHeadbar) {
        const n = this.showInHeadbar;
        this.showInHeadbar = i.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${n ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (i.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = i.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), i.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const n = this.enableWorkspaces;
        this.enableWorkspaces = i.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${n ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.enableWorkspaces || this.removeWorkspaceButton(), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
      if (i.debugMode !== this.lastSettings.debugMode && (i.debugMode ? this.setLogLevel(L.VERBOSE) : this.setLogLevel(L.INFO), this.storageService.saveConfig(C.DEBUG_MODE, i.debugMode, this.pluginName).catch((n) => {
        this.error("保存调试模式设置失败:", n);
      }), this.lastSettings.debugMode = i.debugMode), i.restoreFocusedTab !== this.lastSettings.restoreFocusedTab) {
        const n = this.restoreFocusedTab;
        this.restoreFocusedTab = i.restoreFocusedTab, this.log(`🎯 设置变化：刷新后恢复聚焦标签页 ${n ? "开启" : "关闭"} -> ${this.restoreFocusedTab ? "开启" : "关闭"}`), this.storageService.saveConfig(C.RESTORE_FOCUSED_TAB, i.restoreFocusedTab, this.pluginName).catch((o) => {
          this.error("保存聚焦标签页恢复设置失败:", o);
        }), this.lastSettings.restoreFocusedTab = this.restoreFocusedTab;
      }
      const a = i.enableMiddleClickPin !== void 0 ? i.enableMiddleClickPin : i.enableDoubleClickClose;
      if (a !== void 0 && a !== this.lastSettings.enableMiddleClickPin) {
        const n = !!a;
        this.enableMiddleClickPin = n, this.enableDoubleClickClose = n, this.storageService.saveConfig(C.ENABLE_MIDDLE_CLICK_PIN, n, this.pluginName).catch((o) => this.error("保存中键固定设置失败:", o)), this.storageService.saveConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, n, this.pluginName).catch((o) => this.error("保存双击关闭设置失败:", o)), this.lastSettings.enableMiddleClickPin = n, (t = this.updateFeatureToggleButton) == null || t.call(this);
      }
      if (i.hideTabTooltips !== void 0 && i.hideTabTooltips !== this.lastSettings.hideTabTooltips) {
        const n = this.hideTabTooltips;
        this.hideTabTooltips = i.hideTabTooltips, this.log(`💬 设置变化：标签页提示 ${n ? "隐藏" : "显示"} -> ${this.hideTabTooltips ? "隐藏" : "显示"}`), this.updateAllTabTooltips(), this.lastSettings.hideTabTooltips = this.hideTabTooltips;
      }
    } catch (i) {
      this.error("检查设置变化失败:", i);
    }
  }
  /**
   * 更新所有标签页的tooltip状态
   */
  updateAllTabTooltips() {
    if (!this.tabContainer) return;
    const e = this.tabContainer.querySelectorAll(".orca-tab");
    e.forEach((t) => {
      if (this.hideTabTooltips) {
        const i = t.__tooltipCleanup;
        i && (i(), delete t.__tooltipCleanup);
      } else {
        const i = t.getAttribute("data-tab-id");
        if (i) {
          const a = this.getCurrentPanelTabs(), n = a.find((o) => o.tabId === i) || a.find((o) => o.blockId === i);
          n && D(t, xe(n));
        }
      }
    }), this.verboseLog(`💬 已更新 ${e.length} 个标签页的tooltip状态: ${this.hideTabTooltips ? "隐藏" : "显示"}`);
  }
  /**
   * 注册块菜单命令
   */
  registerBlockMenuCommands() {
    try {
      this.unregisterBlockMenuCommands(), orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.openInNewTab", {
        worksOnMultipleBlocks: !1,
        render: (e, t, i) => {
          const a = window.React;
          return !a || !orca.components.MenuText ? null : a.createElement(orca.components.MenuText, {
            title: "在新标签页打开",
            preIcon: "ti ti-external-link",
            onClick: () => {
              i(), this.openInNewTab(e.toString());
            }
          });
        }
      }), orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.addToTabGroup", {
        worksOnMultipleBlocks: !1,
        render: (e, t, i) => {
          const a = window.React;
          return !a || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : a.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              i(), this.getTabInfo(e.toString(), this.currentPanelId || "" || "", 0).then((n) => {
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
      const i = this.getCurrentPanelTabs(), a = {
        blockId: e,
        tabId: G(e),
        panelId: this.currentPanelId || "",
        title: t,
        isPinned: !1,
        order: i.length
      };
      this.log(`📋 新标签页信息: "${a.title}" (ID: ${e})`);
      const n = this.getCurrentActiveTab();
      let o = i.length;
      if (this.log(`📊 当前标签数量: ${i.length}, 标签列表: ${i.map((s) => s.title).join(", ")}`), this.addNewTabToEnd)
        o = i.length, this.log(`🎯 [一次性] 将新标签添加到末尾: "${a.title}", 插入位置: ${o}`), this.addNewTabToEnd = !1, this.log("♻️ 已重置标志，后续新标签将在聚焦标签后插入");
      else if (n) {
        const s = i.findIndex((c) => c.blockId === n.blockId);
        s !== -1 && (o = s + 1, this.log(`🎯 将在聚焦标签 "${n.title}" 后面插入新标签: "${a.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (i.length >= this.maxTabs) {
        i.splice(o, 0, a), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${a.title}`);
        const s = this.findLastNonPinnedTabIndex();
        if (s !== -1) {
          const c = i[s];
          i.splice(s, 1), this.log(`🗑️ 删除末尾的非固定标签: "${c.title}" 来保持数量限制`), i.forEach((l, d) => {
            l.order = d;
          });
        } else {
          const c = i.findIndex((l) => l.blockId === a.blockId);
          if (c !== -1) {
            i.splice(c, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${a.title}"`);
            return;
          }
        }
      } else
        i.splice(o, 0, a), this.verboseLog(`➕ 在位置 ${o} 插入新标签: ${a.title}`);
      i.forEach((s, c) => {
        s.order = c;
      }), this.lastActiveTabInstanceId = a.tabId || null, this.log(`🔄 已重新计算标签顺序: ${i.map((s) => `${s.title}(${s.order})`).join(", ")}`), this.syncCurrentTabsToStorage(i), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 创建新标签页，实时更新工作区: ${a.title}`)), await this.safeNavigate(e, this.currentPanelId || "", a), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${a.title}"`);
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
    if (e.startsWith("view:")) {
      this.verboseLog(`⏭️ 跳过视图面板的内容设置: ${e}`);
      return;
    }
    try {
      await orca.invokeBackend("set-block-content", parseInt(e), [{ t: "t", v: t }]), this.log(`📝 已为新块 ${e} 设置内容: "${t}"`);
    } catch (i) {
      this.warn("设置块内容失败，尝试备用方法:", i);
      try {
        await orca.invokeBackend("get-block", parseInt(e)) && this.log(`📝 跳过自动内容设置，用户可手动编辑块 ${e}`);
      } catch (a) {
        this.warn("备用方法也失败:", a);
      }
    }
  }
  /**
   * 强制让指定的标签元素呈聚焦状态，确保UI与数据同步
   */
  async focusTabElementById(e, t) {
    this.tabContainer || await this.updateTabsUI();
    const i = () => {
      var o, s, c;
      const a = (o = this.tabContainer) == null ? void 0 : o.querySelectorAll(".orca-tabs-plugin .orca-tab");
      a == null || a.forEach((l) => l.removeAttribute("data-focused"));
      let n = (s = this.tabContainer) == null ? void 0 : s.querySelector(`[data-tab-id="${e}"]`);
      if (!n && t && (n = (c = this.tabContainer) == null ? void 0 : c.querySelector(`[data-block-id="${t}"]`)), n) {
        n.setAttribute("data-focused", "true");
        const l = n.getAttribute("data-tab-id");
        return l && (this.lastActiveTabInstanceId = l), !0;
      }
      return !1;
    };
    i() || setTimeout(() => {
      i();
    }, 100);
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(e, t, i = !1) {
    this.verboseLog("📋 [DEBUG] ========== addTabToPanel 开始 =========="), this.verboseLog(`📋 [DEBUG] 参数: blockId=${e}, insertMode=${t}, navigate=${i}`), this.verboseLog(`📋 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`);
    try {
      const a = this.getCurrentPanelTabs();
      this.verboseLog(`📋 [DEBUG] 当前标签页数量: ${a.length}`), this.verboseLog("📋 [DEBUG] 当前标签页列表:"), a.forEach((l, d) => {
        this.verboseLog(`📋 [DEBUG]   [${d}] ${l.title} (ID: ${l.blockId}, 固定: ${l.isPinned})`);
      }), this.verboseLog(`📋 [DEBUG] closedTabs包含 ${e}: ${this.closedTabs.has(e)}`);
      const n = a.find((l) => l.blockId === e);
      if (n)
        return this.verboseLog(`📋 [DEBUG] ❌ 块 ${e} 已存在于标签页中: "${n.title}"`), this.closedTabs.has(e) && (this.verboseLog(`📋 [DEBUG] 从closedTabs中移除 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.verboseLog(`📋 [DEBUG] 切换到已存在标签: "${n.title}"`), await this.switchToTab(n), await this.focusTabElementById(n.tabId || n.blockId, n.blockId), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（已存在）=========="), !0;
      this.verboseLog(`📋 [DEBUG] ✅ 块 ${e} 不存在，准备创建新标签`), this.creatingTabs.has(e) ? this.verboseLog(`📋 [DEBUG] ℹ️ 块 ${e} 已在 creatingTabs 中（可能来自 Ctrl+点击）`) : (this.verboseLog(`📋 [DEBUG] 🔒 将块 ${e} 添加到 creatingTabs 集合，防止重复处理`), this.creatingTabs.add(e));
      let o = null;
      try {
        if (e.startsWith("view:"))
          return this.verboseLog(`⏭️ 跳过视图面板的块信息获取: ${e}`), !1;
        if (!orca.state.blocks[parseInt(e)])
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法找到块 ${e}`), this.warn(`无法找到块 ${e}`), !1;
        if (this.verboseLog("📋 [addTabToPanel] 找到块信息"), this.verboseLog("📋 [addTabToPanel] 获取标签信息..."), o = await this.getTabInfo(e, this.currentPanelId || "", a.length), !o)
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法获取块 ${e} 的标签信息`), this.warn(`无法获取块 ${e} 的标签信息`), !1;
        this.verboseLog(`📋 [addTabToPanel] 标签信息: "${o.title}" (类型: ${o.blockType})`);
      } finally {
        this.verboseLog(`📋 [DEBUG] 🔓 从 creatingTabs 集合中移除块 ${e}`), this.creatingTabs.delete(e);
      }
      let s = a.length, c = !1;
      if (this.verboseLog(`📋 [addTabToPanel] 插入模式: ${t}`), t === "replace") {
        this.verboseLog("📋 [addTabToPanel] 替换模式 - 获取当前聚焦标签");
        const l = this.getCurrentActiveTab();
        if (!l)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 没有找到当前聚焦的标签"), this.warn("没有找到当前聚焦的标签"), !1;
        this.verboseLog(`📋 [addTabToPanel] 聚焦标签: "${l.title}" (${l.blockId})`);
        const d = a.findIndex((u) => u.blockId === l.blockId);
        if (d === -1)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 无法找到聚焦标签在数组中的位置"), this.warn("无法找到聚焦标签在数组中的位置"), !1;
        l.isPinned ? (this.verboseLog("📋 [addTabToPanel] 聚焦标签是固定的，改为插入模式"), this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), s = d + 1, c = !1) : (this.verboseLog(`📋 [addTabToPanel] 将替换位置 ${d} 的标签`), s = d, c = !0);
      } else if (t === "after") {
        this.verboseLog("📋 [addTabToPanel] After模式 - 在聚焦标签后插入");
        const l = this.getCurrentActiveTab();
        if (l) {
          this.verboseLog(`📋 [addTabToPanel] 找到聚焦标签: "${l.title}" (${l.blockId})`);
          const d = a.findIndex((u) => u.blockId === l.blockId);
          d !== -1 ? (s = d + 1, this.verboseLog(`📋 [addTabToPanel] 将在位置 ${s} 插入（聚焦标签后面）`), this.log("📌 在聚焦标签后面插入新标签")) : this.verboseLog("📋 [addTabToPanel] 警告 - 聚焦标签不在列表中，使用默认位置");
        } else
          this.verboseLog("📋 [addTabToPanel] 警告 - 没有找到聚焦标签，使用默认位置");
      }
      if (this.verboseLog(`📋 [addTabToPanel] 最终插入位置: ${s}, 替换模式: ${c}`), a.length >= this.maxTabs)
        if (this.verboseLog(`📋 [addTabToPanel] 已达到标签上限 ${this.maxTabs}`), c)
          this.verboseLog(`📋 [addTabToPanel] 替换位置 ${s} 的标签`), a[s] = o;
        else {
          this.verboseLog("📋 [addTabToPanel] 插入新标签并删除最后一个非固定标签"), a.splice(s, 0, o);
          const l = this.findLastNonPinnedTabIndex();
          if (l !== -1)
            this.verboseLog(`📋 [addTabToPanel] 删除位置 ${l} 的非固定标签`), a.splice(l, 1);
          else {
            this.verboseLog("📋 [addTabToPanel] 所有标签都是固定的，无法插入");
            const d = a.findIndex((u) => u.blockId === o.blockId);
            return d !== -1 && a.splice(d, 1), !1;
          }
        }
      else
        this.verboseLog(`📋 [addTabToPanel] 标签数量未达到上限，直接${c ? "替换" : "插入"}`), c ? a[s] = o : a.splice(s, 0, o);
      return this.verboseLog(`📋 [addTabToPanel] 插入后标签列表: ${a.map((l) => `${l.title}(${l.blockId})`).join(", ")}`), this.verboseLog("📋 [DEBUG] 同步更新存储数组..."), this.syncCurrentTabsToStorage(a), this.verboseLog("📋 [DEBUG] 保存标签数据..."), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (this.verboseLog(`📋 [DEBUG] 更新工作区: ${this.currentWorkspace}`), await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${o.title}`)), this.verboseLog("📋 [DEBUG] 更新UI..."), await this.updateTabsUI(), i ? (this.verboseLog(`📋 [DEBUG] 开始导航到块 ${e}`), await this.safeNavigate(e, this.currentPanelId || "", o)) : this.verboseLog("📋 [DEBUG] 跳过导航（后台打开模式）"), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（成功）=========="), !0;
    } catch (a) {
      return this.error("[DEBUG] ❌ addTabToPanel 出错:", a), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（失败）=========="), !1;
    }
  }
  /**
   * 统一的导航方法，确保所有导航都设置 isNavigating 标志
   * @param blockId 要导航到的块ID
   * @param panelId 目标面板ID
   * @param tab 可选的标签信息，用于判断是否为日期块或视图面板
   */
  async safeNavigate(e, t, i) {
    this.isNavigating = !0, this.lastNavigatedBlockId = e, this.lastNavigationTime = Date.now(), this.verboseLog(`🚀 [safeNavigate] 开始导航到块 ${e}，设置 isNavigating = true`);
    try {
      if (i && N(i)) {
        const a = e.startsWith("view:") ? e.substring(5) : i.panelId;
        this.verboseLog(`🖼️ [safeNavigate] 检测到视图面板，使用 switchFocusTo 导航: ${a}`), orca.nav.switchFocusTo(a), this.verboseLog("✅ [safeNavigate] 视图面板导航成功");
        return;
      }
      if (i && (i.isJournal || i.blockType === "journal")) {
        this.verboseLog(`📅 [safeNavigate] 检测到日期块，使用 journal 导航: ${i.title}`);
        const a = this.extractDateFromTitle(i.title);
        if (a)
          try {
            await orca.nav.goTo("journal", { date: a }, t), this.verboseLog(`✅ [safeNavigate] 使用 journal 导航成功: ${a.toLocaleDateString()}`);
            return;
          } catch (n) {
            this.warn("⚠️ [safeNavigate] journal 导航失败，回退到块导航:", n);
          }
        else
          this.verboseLog(`⚠️ [safeNavigate] 无法从标题提取日期: "${i.title}"，回退到块导航`);
      }
      if (e.startsWith("view:")) {
        const a = e.substring(5);
        this.verboseLog(`🖼️ [safeNavigate] 检测到视图面板 blockId，使用 switchFocusTo 导航: ${a}`), orca.nav.switchFocusTo(a), this.verboseLog("✅ [safeNavigate] 视图面板导航成功");
        return;
      }
      await orca.nav.goTo("block", { blockId: parseInt(e) }, t), this.verboseLog("✅ [safeNavigate] 使用 block 导航成功");
    } catch (a) {
      throw this.error("❌ [safeNavigate] 导航失败:", a), a;
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
      const i = e.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (i) {
        const l = parseInt(i[1]), d = parseInt(i[2]) - 1, u = parseInt(i[3]), h = new Date(l, d, u);
        if (!isNaN(h.getTime()))
          return h;
      }
      const a = e.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (a) {
        const l = parseInt(a[1]) - 1, d = parseInt(a[2]), u = parseInt(a[3]), h = new Date(u, l, d);
        if (!isNaN(h.getTime()))
          return h;
      }
      const n = e.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (n) {
        const l = parseInt(n[1]), d = parseInt(n[2]) - 1, u = parseInt(n[3]);
        if (!a) {
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
      const s = e.match(/(\d{4})(\d{2})(\d{2})/);
      if (s) {
        const l = parseInt(s[1]), d = parseInt(s[2]) - 1, u = parseInt(s[3]), h = new Date(l, d, u);
        if (!isNaN(h.getTime()))
          return h;
      }
      const c = e.match(/(\d{1,2})月(\d{1,2})日/);
      if (c) {
        const d = (/* @__PURE__ */ new Date()).getFullYear(), u = parseInt(c[1]) - 1, h = parseInt(c[2]), b = new Date(d, u, h);
        if (!isNaN(b.getTime()))
          return b;
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
      const i = t.find((n) => n.blockId === e);
      if (i) {
        this.verboseLog(`🔗 [DEBUG] ❌ 块 ${e} 已存在，标签: "${i.title}"，无需操作`), this.closedTabs.has(e) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.creatingTabs.has(e) && (this.verboseLog(`🔓 [DEBUG] 从 creatingTabs 中移除 ${e}（已存在）`), this.creatingTabs.delete(e)), this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成（已存在）==========");
        return;
      }
      if (this.verboseLog(`🔗 [DEBUG] ✅ 块 ${e} 不存在，准备在后台创建新标签页`), this.closedTabs.has(e) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.verboseLog(`🔗 [DEBUG] 调用 addTabToPanel(blockId: ${e}, mode: 'after', navigate: false)`), await this.addTabToPanel(e, "after", !1)) {
        this.verboseLog("🔗 [DEBUG] ✅ 成功在后台创建新标签页"), await new Promise((o) => setTimeout(o, 150)), this.verboseLog("🔗 [DEBUG] 强制更新UI以确保标签页显示"), await this.updateTabsUI(!0);
        const n = this.getCurrentPanelTabs();
        this.verboseLog(`🔗 [DEBUG] 更新后标签页数量: ${n.length}`), this.verboseLog("🔗 [DEBUG] 更新后标签页列表:"), n.forEach((o, s) => {
          this.verboseLog(`🔗 [DEBUG]   [${s}] ${o.title} (ID: ${o.blockId})`);
        });
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
   * 5. 支持从块标（orca-block-handle）中提取块ID
   * 
   * @param element 起始DOM元素
   * @returns 块引用ID，如果未找到则返回null
   */
  getBlockRefId(e) {
    var t, i;
    try {
      let a = e;
      for (; a && a !== document.body; ) {
        const n = a.classList;
        if (n.contains("orca-block-handle") || n.contains("block-handle")) {
          let s = a.getAttribute("data-block-id") || a.getAttribute("data-blockid") || a.getAttribute("data-id");
          if (!s) {
            let c = a.parentElement;
            for (; c && c !== document.body && (s = c.getAttribute("data-block-id") || c.getAttribute("data-blockid") || c.getAttribute("data-id"), !(s && !isNaN(parseInt(s)) || c.classList.contains("orca-block") || c.classList.contains("orca-block-editor") || c.classList.contains("orca-hideable"))); )
              c = c.parentElement;
          }
          if (s && !isNaN(parseInt(s)))
            return this.log(`🔗 从块标中提取到块ID: ${s}`), s;
        }
        if (n.contains("orca-inline-r-content") || n.contains("orca-ref") || n.contains("block-ref") || n.contains("block-reference") || n.contains("orca-fragment-r") || n.contains("fragment-r") || n.contains("orca-block-reference") || a.tagName.toLowerCase() === "a" && ((t = a.getAttribute("href")) != null && t.startsWith("#"))) {
          const s = a.getAttribute("data-block-id") || a.getAttribute("data-ref-id") || a.getAttribute("data-blockid") || a.getAttribute("data-target-block-id") || a.getAttribute("data-fragment-v") || a.getAttribute("data-v") || ((i = a.getAttribute("href")) == null ? void 0 : i.replace("#", "")) || a.getAttribute("data-id");
          if (s && !isNaN(parseInt(s)))
            return this.log(`🔗 从元素中提取到块引用ID: ${s}`), s;
        }
        if (n.contains("orca-block") || n.contains("orca-block-editor") || n.contains("orca-hideable")) {
          const s = a.getAttribute("data-block-id") || a.getAttribute("data-blockid") || a.getAttribute("data-id");
          if (s && !isNaN(parseInt(s)))
            return this.log(`🔗 从块容器中提取到块ID: ${s}`), s;
        }
        const o = a.dataset;
        for (const [s, c] of Object.entries(o))
          if ((s.toLowerCase().includes("block") || s.toLowerCase().includes("ref")) && c && !isNaN(parseInt(c)))
            return this.log(`🔗 从data属性 ${s} 中提取到块引用ID: ${c}`), c;
        a = a.parentElement;
      }
      if (e.textContent) {
        const n = e.textContent.trim(), o = n.match(/\[\[(?:块)?(\d+)\]\]/) || n.match(/block[:\s]*(\d+)/i);
        if (o && o[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${o[1]}`), o[1];
      }
      return this.log("🔗 未能从元素中提取块引用ID"), null;
    } catch (a) {
      return this.error("获取块引用ID时出错:", a), null;
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
      const i = t.anchor.blockId.toString();
      return this.log(`🔍 获取到当前光标块ID: ${i}`), i;
    } catch (e) {
      return this.error("获取当前光标块ID时出错:", e), null;
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(e, t, i, a) {
    return Ii(e, t, i, a);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.getPanelIds()[this.currentPanelIndex], i = orca.nav.findViewPanel(t, orca.state.panels);
      if (i && i.viewState) {
        let a = null;
        const n = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (n) {
          const o = n.closest(".orca-panel");
          o && (a = o.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!a) {
          const o = document.querySelector(".orca-panel.active");
          o && (a = o.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (a || (a = document.body.scrollTop > 0 ? document.body : document.documentElement), a) {
          const o = {
            x: a.scrollLeft || 0,
            y: a.scrollTop || 0
          };
          i.viewState.scrollPosition = o;
          const s = this.getCurrentPanelTabs().findIndex((c) => c.blockId === e.blockId);
          s !== -1 && (this.getCurrentPanelTabs()[s].scrollPosition = o, await this.saveCurrentPanelTabs()), this.verboseLog(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, o, "容器:", a.className);
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
      const i = this.getCurrentPanelTabs(), a = i.findIndex((c) => c.blockId === e);
      if (a === -1) {
        this.verboseLog(`⚠️ 未找到要替换的标签: ${e}`);
        return;
      }
      const n = this.getCurrentActiveTab(), o = n && n.blockId === e, s = i[a];
      i[a] = t, this.verboseLog(`🔄 替换标签页: "${s.title}" -> "${t.title}"`), await this.setCurrentPanelTabs(i), await this.immediateUpdateTabsUI(), o && (this.verboseLog(`🎯 重新聚焦到替换后的标签: ${t.title}`), this.isNavigating = !0, await new Promise((c) => setTimeout(c, 50)), await this.switchToTab(t), setTimeout(() => {
        this.isNavigating = !1;
      }, 100)), this.recordTabSwitchHistory(e, t), this.verboseLog("✅ 标签页替换完成");
    } catch (i) {
      this.warn("替换标签页失败:", i), this.isNavigating = !1;
    }
  }
  /**
   * 记录标签切换历史
   */
  async recordTabSwitchHistory(e, t) {
    try {
      await this.tabStorageService.updateTabSwitchHistory(e, t), this.verboseLog(`📝 记录标签切换历史: ${e} -> ${t.blockId}`);
    } catch (i) {
      this.warn("记录标签切换历史失败:", i);
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
    let i = null, a = null, n = 0, o = !1;
    const s = {
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
        o = !0, this.verboseLog(`🖱️ 开始长按标签: ${t.title}`), i = window.setTimeout(async () => {
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
              const b = h.recentTabs;
              this.verboseLog(`📋 去重后的历史记录: ${b.length} 个记录`);
              const p = this.getCurrentPanelTabs(), m = new Set(p.map((x) => x.blockId)), g = b.filter((x) => !m.has(x.blockId));
              if (this.verboseLog(`📋 过滤后的历史记录: ${g.length} 个记录（已过滤 ${b.length - g.length} 个已打开的标签）`), g.length === 0) {
                this.verboseLog("⚠️ 过滤后没有可显示的历史记录，不显示悬浮列表");
                return;
              }
              const f = e.getBoundingClientRect(), v = {
                x: f.left,
                y: f.bottom + 4
                // 在标签下方显示
              };
              this.verboseLog(`📍 计算悬浮位置: x=${v.x}, y=${v.y}`), this.verboseLog(`📊 标签尺寸: width=${f.width}, height=${f.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
              const w = (x) => {
                this.verboseLog(`🖱️ 点击悬浮标签: ${x.title}`), this.getCurrentPanelTabs().find((S) => S.blockId === x.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${x.title}`), this.recordTabSwitchHistory(t.blockId, x), this.switchToTab(x)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${x.title}`), this.replaceCurrentTabWith(t.blockId, x)), H();
              };
              a = Me(
                g,
                v,
                s,
                w,
                this.isVerticalMode
              ), this.verboseLog("✅ 悬浮标签列表创建完成"), s.enableScroll && g.length > s.maxDisplayCount && this.addScrollEvents(a, g, s, n, w);
              const T = (x) => {
                const E = x.target;
                this.safeClosest(E, ".hover-tab-list-container") || (H(), a = null, n = 0, document.removeEventListener("click", T));
              };
              setTimeout(() => {
                document.addEventListener("click", T);
              }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${g.length} 个历史标签`);
            } catch (u) {
              this.warn("显示悬浮标签列表失败:", u);
            }
          }
        }, 500);
      }
    }), e.addEventListener("mouseup", () => {
      i && (clearTimeout(i), i = null), o = !1;
    }), e.addEventListener("mouseleave", () => {
      i && (clearTimeout(i), i = null), o = !1;
    });
    const c = () => {
      setTimeout(() => {
        H(), a = null, n = 0;
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
  addHoverTabListEvents(e, t) {
    let i = null, a = null, n = 0;
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
      this.verboseLog(`🖱️ 鼠标进入标签: ${t.title} (标签历史ID: ${l})`), i && (clearTimeout(i), i = null), i = window.setTimeout(async () => {
        try {
          this.verboseLog(`⏰ 开始检查标签 ${t.title} 的切换历史`);
          const d = await this.tabStorageService.restoreRecentTabSwitchHistory(), u = [];
          if (Object.values(d).forEach((x) => {
            x.recentTabs && u.push(...x.recentTabs);
          }), this.verboseLog(`📋 所有切换历史记录: ${u.length} 个记录`), u.length === 0) {
            this.verboseLog("⚠️ 没有切换历史记录，不显示悬浮列表");
            return;
          }
          const h = /* @__PURE__ */ new Map();
          u.forEach((x) => {
            h.set(x.blockId, x);
          });
          const b = Array.from(h.values());
          this.verboseLog(`📋 去重后的历史记录: ${b.length} 个记录`);
          const p = this.getCurrentPanelTabs(), m = new Set(p.map((x) => x.blockId)), g = b.filter((x) => !m.has(x.blockId));
          if (this.verboseLog(`📋 过滤后的历史记录: ${g.length} 个记录（已过滤 ${b.length - g.length} 个已打开的标签）`), g.length === 0) {
            this.verboseLog("⚠️ 过滤后没有可显示的历史记录，不显示悬浮列表");
            return;
          }
          const f = e.getBoundingClientRect(), v = {
            x: f.left,
            y: f.bottom + 4
            // 在标签下方显示
          };
          this.verboseLog(`📍 计算悬浮位置: x=${v.x}, y=${v.y}`), this.verboseLog(`📊 标签尺寸: width=${f.width}, height=${f.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
          const w = (x) => {
            this.verboseLog(`🖱️ 点击悬浮标签: ${x.title}`), this.getCurrentPanelTabs().find((S) => S.blockId === x.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${x.title}`), this.recordTabSwitchHistory(t.blockId, x), this.switchToTab(x)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${x.title}`), this.replaceCurrentTabWith(t.blockId, x)), H();
          };
          a = Me(
            g,
            v,
            o,
            w,
            this.isVerticalMode
          ), this.verboseLog("✅ 悬浮标签列表创建完成"), o.enableScroll && g.length > o.maxDisplayCount && this.addScrollEvents(a, g, o, n, w);
          const T = (x) => {
            const E = x.target;
            this.safeClosest(E, ".hover-tab-list-container") || (H(), a = null, n = 0, document.removeEventListener("click", T));
          };
          setTimeout(() => {
            document.addEventListener("click", T);
          }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${g.length} 个历史标签`);
        } catch (d) {
          this.warn("显示悬浮标签列表失败:", d);
        }
      }, 500);
    }), e.addEventListener("mouseleave", () => {
      i && (clearTimeout(i), i = null), i = window.setTimeout(() => {
        H(), a = null, n = 0;
      }, 200);
    });
    const s = () => {
      i && (clearTimeout(i), i = null);
    }, c = () => {
      i = window.setTimeout(() => {
        H(), a = null, n = 0;
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
  addScrollEvents(e, t, i, a, n) {
    const o = e.querySelector(".hover-tab-list-scroll");
    if (!o) return;
    let s = !1;
    o.addEventListener("wheel", (c) => {
      if (c.preventDefault(), s) return;
      s = !0;
      const l = c.deltaY > 0 ? i.scrollStep : -i.scrollStep, d = Math.max(0, Math.min(a + l, t.length - i.maxDisplayCount));
      d !== a && (a = d, ve(e, t, i, n, this.isVerticalMode, a)), setTimeout(() => {
        s = !1;
      }, 100);
    }), e.addEventListener("keydown", (c) => {
      if (c.key === "ArrowUp" || c.key === "ArrowDown") {
        c.preventDefault();
        const l = c.key === "ArrowDown" ? i.scrollStep : -i.scrollStep, d = Math.max(0, Math.min(a + l, t.length - i.maxDisplayCount));
        d !== a && (a = d, ve(e, t, i, n, this.isVerticalMode, a));
      }
    });
  }
  /**
   * 恢复标签的滚动位置
   */
  restoreScrollPosition(e) {
    try {
      let t = null;
      const i = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(i, orca.state.panels);
      if (a && a.viewState && a.viewState.scrollPosition && (t = a.viewState.scrollPosition, this.verboseLog(`🔄 从viewState恢复标签 "${e.title}" 滚动位置:`, t)), !t && e.scrollPosition && (t = e.scrollPosition, this.verboseLog(`🔄 从标签信息恢复标签 "${e.title}" 滚动位置:`, t)), !t) return;
      const n = (o = 1) => {
        if (o > 5) {
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
        s || (s = document.body.scrollTop > 0 ? document.body : document.documentElement), s ? (s.scrollLeft = t.x, s.scrollTop = t.y, this.verboseLog(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", s.className, `尝试${o}`)) : setTimeout(() => n(o + 1), 200 * o);
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
    const t = this.getPanelIds()[this.currentPanelIndex], i = orca.nav.findViewPanel(t, orca.state.panels);
    i && i.viewState ? (this.verboseLog("viewState中的滚动位置:", i.viewState.scrollPosition), this.verboseLog("完整viewState:", i.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((n) => {
      document.querySelectorAll(n).forEach((s, c) => {
        const l = s;
        (l.scrollTop > 0 || l.scrollLeft > 0) && this.log(`容器 ${n}[${c}]:`, {
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
        const c = document.querySelector(`.orca-panel[data-panel-id="${e.panelId}"]`);
        c && (t = c);
      }
      if (!t) return !1;
      const i = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!i) return !1;
      const n = i.getAttribute("data-block-id") === e.blockId;
      if (n && this.closedTabs.has(e.blockId))
        return this.verboseLog(`?? ?? ${e.title} ????????????????`), !1;
      if (!n)
        return !1;
      const o = this.getCurrentPanelTabs();
      if (this.lastActiveTabInstanceId) {
        const c = o.find((l) => l.tabId === this.lastActiveTabInstanceId);
        if (c && c.blockId === e.blockId)
          return e.tabId === this.lastActiveTabInstanceId;
      }
      const s = o.find((c) => c.blockId === e.blockId);
      return s != null && s.tabId ? (this.lastActiveTabInstanceId || (this.lastActiveTabInstanceId = s.tabId), e.tabId === s.tabId) : !0;
    } catch (t) {
      return this.warn("???????????:", t), !1;
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
      const c = t.getAttribute("data-tab-id"), l = t.getAttribute("data-block-id"), d = e.find((u) => u.tabId === c) || e.find((u) => u.blockId === l);
      if (d)
        return this.verboseLog(`?? ??UI????: ${d.title} (ID: ${d.blockId})`), d.tabId && (this.lastActiveTabInstanceId = d.tabId), this.enableWorkspaces && this.currentWorkspace && this.updateCurrentWorkspaceActiveIndex(d), d;
    }
    let i = null;
    if (this.currentPanelId && (i = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`)), i || (i = document.querySelector(".orca-panel.active")), !i)
      return this.verboseLog("?? ????????"), null;
    const a = i.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!a)
      return this.verboseLog("?? ????????????????"), null;
    const n = a.getAttribute("data-block-id");
    if (!n)
      return this.verboseLog("?? ??????????blockId"), null;
    const o = e.find((c) => c.blockId === n) || null;
    return o ? (this.verboseLog(`?? ??DOM??????????: ${o.title} (ID: ${n})`), o) : (this.verboseLog(`?? ??????????ID ${n} ?????`), null);
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
    const i = e.findIndex((a) => a.blockId === t.blockId);
    return i === -1 ? -1 : i;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    if (this.lastActiveBlockId) {
      const i = e.find((a) => a.blockId === this.lastActiveBlockId);
      if (i)
        return this.log(`🎯 找到上一个激活的标签: ${i.title}`), i;
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
    const i = t.findIndex((a) => a.blockId === e.blockId);
    return i === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${e.title}" (索引${i}) 后面插入新标签`), i);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), i = t.findIndex((a) => a.blockId === e.blockId);
    return i === -1 || t.length <= 1 ? null : i < t.length - 1 ? t[i + 1] : i > 0 ? t[i - 1] : i === 0 && t.length > 1 ? t[1] : null;
  }
  /**
   * 关闭标签页
   * 
   * 支持关闭普通块标签页和视图面板标签页（如 AI Chat 面板）。
   * 视图面板的 blockId 以 'view:' 前缀开头，需要特殊处理以避免错误。
   * 
   * Requirements: 4.3, 5.3
   */
  async closeTab(e) {
    var n;
    const t = this.getCurrentPanelTabs();
    if (t.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    e.isPinned && this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
    const i = N(e);
    i && this.verboseLog(`🖼️ 检测到视图面板标签页关闭: ${e.title} (blockId: ${e.blockId})`);
    const a = t.findIndex((o) => o.blockId === e.blockId);
    if (a !== -1) {
      const o = this.getCurrentActiveTab(), s = o && o.blockId === e.blockId, c = s ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const b = { ...e, closedAt: Date.now() }, p = this.recentlyClosedTabs.findIndex((m) => m.blockId === e.blockId);
        p !== -1 && this.recentlyClosedTabs.splice(p, 1), this.recentlyClosedTabs.unshift(b), this.recentlyClosedTabs.length > 10 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 10)), await this.saveRecentlyClosedTabs();
      }
      const l = CSS.escape(e.blockId), d = (n = this.tabContainer) == null ? void 0 : n.querySelector(`[data-block-id="${l}"]`), u = d == null ? void 0 : d.getAttribute("data-tab-history-id");
      u && await this.deleteTabSwitchHistory(u), t.splice(a, 1), this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`));
      const h = i ? "视图面板" : "标签";
      this.log(`🗑️ ${h} "${e.title}" 已关闭，已添加到关闭列表`), s && c ? (this.log(`🔄 自动切换到相邻标签: "${c.title}"`), await this.switchToTab(c)) : s && !c && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   * 
   * 支持关闭普通块标签页和视图面板标签页（如 AI Chat 面板）。
   * 视图面板的 blockId 以 'view:' 前缀开头，可以安全地添加到 closedTabs 集合。
   * 
   * Requirements: 4.3, 5.3
   */
  async closeAllTabs() {
    const e = this.getCurrentPanelTabs(), t = e.filter((o) => !o.isPinned);
    let i = 0;
    t.forEach((o) => {
      this.closedTabs.add(o.blockId), N(o) && (i++, this.verboseLog(`🖼️ 关闭视图面板标签页: ${o.title} (blockId: ${o.blockId})`));
    });
    const a = e.filter((o) => o.isPinned), n = e.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), i > 0 ? this.log(`🗑️ 已关闭 ${n} 个标签（包含 ${i} 个视图面板），保留了 ${a.length} 个固定标签`) : this.log(`🗑️ 已关闭 ${n} 个标签，保留了 ${a.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   * 
   * 支持关闭普通块标签页和视图面板标签页（如 AI Chat 面板）。
   * 视图面板的 blockId 以 'view:' 前缀开头，可以安全地添加到 closedTabs 集合。
   * 
   * Requirements: 4.3, 5.3
   */
  async closeOtherTabs(e) {
    const t = this.getCurrentPanelTabs(), i = t.filter(
      (s) => s.blockId === e.blockId || s.isPinned
    ), a = t.filter(
      (s) => s.blockId !== e.blockId && !s.isPinned
    );
    let n = 0;
    a.forEach((s) => {
      this.closedTabs.add(s.blockId), N(s) && (n++, this.verboseLog(`🖼️ 关闭视图面板标签页: ${s.title} (blockId: ${s.blockId})`));
    });
    const o = t.length - i.length;
    this.setCurrentPanelTabs(i), this.syncCurrentTabsToStorage(i), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), n > 0 ? this.log(`🗑️ 已关闭其他 ${o} 个标签（包含 ${n} 个视图面板），保留了当前标签和固定标签`) : this.log(`🗑️ 已关闭其他 ${o} 个标签，保留了当前标签和固定标签`);
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
    const t = document.querySelector(`[data-tab-id="${e.tabId || e.blockId}"]`);
    if (!t) {
      this.warn("找不到对应的标签元素");
      return;
    }
    const i = t.querySelector(".inline-rename-input");
    i && i.remove();
    const a = t.textContent, n = t.style.cssText, o = t.draggable;
    t.draggable = !1, t.setAttribute("data-renaming", "true");
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
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, t.textContent = "", t.appendChild(s), t.style.padding = "2px 8px", s.focus(), s.select();
    const d = async () => {
      const h = s.value.trim();
      if (h && h !== e.title) {
        await this.updateTabTitle(e, h), t.draggable = o, t.removeAttribute("data-renaming");
        return;
      }
      t.textContent = a, t.style.cssText = n, t.draggable = o, t.removeAttribute("data-renaming");
    }, u = () => {
      t.textContent = a, t.style.cssText = n, t.draggable = o, t.removeAttribute("data-renaming");
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
  showOrcaRenameInput(e) {
    const t = window.React, i = window.ReactDOM;
    if (!t || !i || !orca.components.InputBox) {
      this.warn("Orca组件不可用，回退到原生实现"), this.showRenameInput(e);
      return;
    }
    const a = document.createElement("div");
    a.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      pointer-events: none;
    `, document.body.appendChild(a);
    const n = document.querySelector(`[data-tab-id="${e.tabId || e.blockId}"]`);
    let o = { x: "50%", y: "50%" };
    if (n) {
      const u = n.getBoundingClientRect(), h = window.innerWidth, b = window.innerHeight, p = 300, m = 100, g = 20;
      let f = u.left, v = u.top - m - 10;
      f + p > h - g && (f = h - p - g), f < g && (f = g), v < g && (v = u.bottom + 10, v + m > b - g && (v = (b - m) / 2)), v + m > b - g && (v = b - m - g), f = Math.max(g, Math.min(f, h - p - g)), v = Math.max(g, Math.min(v, b - m - g)), o = { x: `${f}px`, y: `${v}px` };
    }
    const s = orca.components.InputBox, c = t.createElement(s, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (u, h, b) => {
        u && u.trim() && u.trim() !== e.title && this.updateTabTitle(e, u.trim()), b();
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
    W(a, () => {
      i.render(c, a);
    }), setTimeout(() => {
      const u = a.querySelector("div");
      u && u.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        i.unmountComponentAtNode(a), a.remove();
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
    const i = document.createElement("div");
    i.className = "tab-rename-input", i.style.cssText = `
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
    const a = document.createElement("input");
    a.type = "text", a.value = e.title, a.style.cssText = `
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
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "取消", n.appendChild(o), n.appendChild(s), i.appendChild(a), i.appendChild(n);
    const c = document.querySelector(`[data-tab-id="${e.tabId || e.blockId}"]`);
    if (c) {
      const h = c.getBoundingClientRect();
      i.style.left = `${h.left}px`, i.style.top = `${h.top - 60}px`;
    } else
      i.style.left = "50%", i.style.top = "50%", i.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(i), a.focus(), a.select();
    const l = () => {
      const h = a.value.trim();
      h && h !== e.title && this.updateTabTitle(e, h), i.remove();
    }, d = () => {
      i.remove();
    };
    o.addEventListener("click", l), s.addEventListener("click", d), a.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), d());
    });
    const u = (h) => {
      !h || !h.target || i.contains(h.target) || (d(), document.removeEventListener("click", u));
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
      const i = this.getCurrentPanelTabs(), a = st(e, t, i, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      a.success ? (this.syncCurrentTabsToStorage(i), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${t}`)), this.log(a.message)) : this.warn(a.message);
    } catch (i) {
      this.error("重命名标签失败:", i);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(e, t) {
    e.addEventListener("contextmenu", (i) => {
      i.preventDefault(), i.stopPropagation(), i.stopImmediatePropagation(), this.showTabContextMenu(i, t);
    });
  }
  createOrcaContextMenu(e, t) {
    const i = window.React, a = window.ReactDOM, n = document.createElement("div");
    n.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(n);
    const o = orca.components.ContextMenu, s = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, d = i.createElement(o, {
      menu: (b) => i.createElement(s, {}, [
        i.createElement(c, {
          key: "rename",
          title: "重命名标签",
          shortcut: "F2",
          onClick: () => {
            b(), this.renameTab(t);
          },
          children: i.createElement("div", {
            style: { display: "flex", alignItems: "center", gap: "8px" }
          }, [
            i.createElement("i", {
              key: "icon",
              className: "ti ti-edit",
              style: { fontSize: "14px", color: "var(--orca-color-text-1)" }
            }),
            i.createElement("span", { key: "text" }, "重命名标签")
          ])
        }),
        i.createElement(c, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            b(), this.toggleTabPinStatus(t);
          }
        }),
        // 如果有保存的标签组，添加"添加到已有标签组"选项
        ...this.savedTabSets.length > 0 ? [
          i.createElement(c, {
            key: "addToGroup",
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              b(), this.showAddToTabGroupDialog(t);
            }
          })
        ] : [],
        i.createElement(l, { key: "separator1" }),
        i.createElement(c, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            b(), this.closeTab(t);
          }
        }),
        i.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            b(), this.closeOtherTabs(t);
          }
        }),
        i.createElement(c, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            b(), this.closeAllTabs();
          }
        })
      ])
    }, (b, p) => i.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        background: "transparent"
      },
      onContextMenu: (g) => {
        g.preventDefault(), g.stopPropagation(), b(g);
      }
    }));
    W(n, () => {
      a.render(d, n);
    });
    const u = () => {
      a.unmountComponentAtNode(n), n.remove();
    }, h = new MutationObserver((b) => {
      b.forEach((p) => {
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
    var h, b;
    const i = document.querySelector(".tab-context-menu");
    i && i.remove();
    const a = document.documentElement.classList.contains("dark") || ((b = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : b.themeMode) === "dark", n = document.createElement("div");
    n.className = "tab-context-menu";
    const o = 220, s = 240, { x: c, y: l } = ie(e.clientX, e.clientY, o, s);
    n.style.cssText = `
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
      let g = "";
      p.text.includes("关闭") ? g = "close" : p.text.includes("重命名") ? g = "rename" : p.text.includes("固定") ? g = "pin" : p.text.includes("复制") ? g = "duplicate" : p.text.includes("保存到标签组") && (g = "save-to-group"), m.setAttribute("data-action", g), m.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: ${p.disabled ? a ? "#666" : "#999" : "var(--orca-color-text-1)"};
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
      const v = document.createElement("span");
      v.textContent = p.text, m.appendChild(v), p.disabled || (m.addEventListener("mouseenter", () => {
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
    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      if (N(a)) {
        this.verboseLog(`⏭️ 跳过视图面板: ${a.title}`);
        continue;
      }
      if (!a.blockType || !a.icon)
        try {
          const o = await orca.invokeBackend("get-block", parseInt(a.blockId));
          if (o) {
            const s = await ge(o);
            let c = a.icon;
            c || (c = te(s)), e[i] = {
              ...a,
              blockType: s,
              icon: c
            }, this.log(`✅ 更新恢复的标签: ${a.title} -> 类型: ${s}, 图标: ${c}`), t = !0;
          }
        } catch (o) {
          this.warn(`更新恢复的标签失败: ${a.title}`, o);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${a.title} (已有块类型和图标)`);
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
    for (let i = 0; i < e.length; i++) {
      const a = e.charCodeAt(i);
      t = (t << 5) - t + a, t = t & t;
    }
    return Math.abs(t).toString(36);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 拖拽功能 - Drag Functionality */
  /* ———————————————————————————————————————————————————————————————————————————— */
  startDrag(e) {
    if (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.enableBubbleMode && (this.isBubbleExpanded || this.expandBubble(), this.bubbleCollapseTimer && (clearTimeout(this.bubbleCollapseTimer), this.bubbleCollapseTimer = null), this.tabContainer)) {
      const n = this.tabContainer._bubbleMouseEnterHandler, o = this.tabContainer._bubbleMouseLeaveHandler, s = this.tabContainer._bubbleClickOutsideHandler;
      n && this.tabContainer.removeEventListener("mouseenter", n), o && this.tabContainer.removeEventListener("mouseleave", o), s && document.removeEventListener("click", s, !0);
    }
    this.isDragging = !0;
    const t = this.isVerticalMode ? this.verticalPosition : this.position;
    if (this.dragStartX = e.clientX - t.x, this.dragStartY = e.clientY - t.y, this.tabContainer) {
      this.tabContainer.classList.add("dragging"), this.tabContainer.style.transition = "none";
      const n = this.tabContainer.querySelector(".drag-handle");
      n && n.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const i = (n) => {
      this.isDragging && (n.preventDefault(), n.stopPropagation(), this.drag(n));
    }, a = (n) => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", a), this.stopDrag();
    };
    document.addEventListener("mousemove", i), document.addEventListener("mouseup", a), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    if (e.preventDefault(), this.enableBubbleMode && !this.isBubbleExpanded) {
      this.isBubbleExpanded = !0;
      const c = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)", l = this.isVerticalMode ? this.verticalPosition : this.position, d = ae(
        this.isVerticalMode,
        l,
        c,
        this.verticalWidth,
        void 0,
        void 0,
        !0,
        !0
      );
      this.tabContainer.style.cssText = d;
    }
    this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), i = 5, a = window.innerWidth - t.width - 5, n = 5, o = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(i, Math.min(a, this.verticalPosition.x)), this.verticalPosition.y = Math.max(n, Math.min(o, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(i, Math.min(a, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(n, Math.min(o, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const s = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = s.x + "px", this.tabContainer.style.top = s.y + "px", this.ensureClickableElements();
  }
  async stopDrag() {
    if (this.isDragging = !1, this.tabContainer) {
      this.tabContainer.classList.remove("dragging");
      const e = this.tabContainer.querySelector(".drag-handle");
      if (e && e.classList.remove("dragging"), this.tabContainer.style.cursor = "default", this.enableBubbleMode && this.isBubbleExpanded ? this.tabContainer.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" : this.enableBubbleMode && !this.isBubbleExpanded ? this.tabContainer.style.transition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" : this.tabContainer.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", this.enableEdgeHide && !this.isFixedToTop && (this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.boundContainerMouseEnter && this.boundContainerMouseLeave && (this.tabContainer.removeEventListener("mouseenter", this.boundContainerMouseEnter), this.tabContainer.removeEventListener("mouseleave", this.boundContainerMouseLeave), this.boundContainerMouseEnter = null, this.boundContainerMouseLeave = null), this.tabContainer.style.transform = "none", this.isEdgeHideExpanded = !0, this.currentEdgeSide = null, this.verboseLog("🔄 拖拽结束，重置贴边隐藏状态，准备重新检测"), this.debouncedApplyEdgeHideStyle(200)), this.enableBubbleMode && (this.bubbleCollapseTimer && (clearTimeout(this.bubbleCollapseTimer), this.bubbleCollapseTimer = null), this.tabContainer)) {
        const t = this.tabContainer._bubbleMouseEnterHandler, i = this.tabContainer._bubbleMouseLeaveHandler, a = this.tabContainer._bubbleClickOutsideHandler;
        t && !this.tabContainer.onmouseenter && this.tabContainer.addEventListener("mouseenter", t), i && !this.tabContainer.onmouseleave && this.tabContainer.addEventListener("mouseleave", i), a && document.addEventListener("click", a, !0);
      }
      this.tabContainer.style.userSelect = "", this.tabContainer.style.pointerEvents = "auto", this.tabContainer.style.touchAction = "";
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
      enableEdgeHide: this.enableEdgeHide,
      enableBubbleMode: this.enableBubbleMode
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
    document.body.style.pointerEvents = "auto", document.documentElement.style.pointerEvents = "auto", document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu").forEach((i) => {
      const a = i;
      a.style.pointerEvents === "none" && (a.style.pointerEvents = "auto");
    }), document.querySelectorAll('button, .btn, [role="button"]').forEach((i) => {
      const a = i;
      a.style.pointerEvents === "none" && (a.style.pointerEvents = "auto");
    });
  }
  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    document.querySelectorAll("*").forEach((i) => {
      const a = i;
      (a.style.cursor === "grabbing" || a.style.cursor === "grab") && (a.style.cursor = ""), a.style.userSelect === "none" && (a.style.userSelect = ""), a.style.pointerEvents === "none" && (a.style.pointerEvents = ""), a.style.touchAction === "none" && (a.style.touchAction = "");
    }), document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]").forEach((i) => {
      const a = i;
      a.style.cursor = "", a.style.userSelect = "", a.style.pointerEvents = "auto", a.style.touchAction = "";
    }), this.log("🔄 重置所有元素样式");
  }
  async restorePosition() {
    try {
      this.position = ue(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = et(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${ze(this.position, this.isVerticalMode)}`);
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
        C.LAYOUT_MODE,
        this.pluginName,
        J()
      );
      if (e) {
        const t = tt(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = ue(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.horizontalTabMaxWidth = t.horizontalTabMaxWidth, this.horizontalTabMinWidth = t.horizontalTabMinWidth, this.enableEdgeHide = t.enableEdgeHide, this.enableBubbleMode = t.enableBubbleMode, !this.isVerticalMode && this.enableBubbleMode && (this.enableBubbleMode = !1, this.isBubbleExpanded = !1, this.verboseLog("🫧 恢复配置：水平模式不支持气泡模式，已自动禁用")), this.log(`📐 布局模式已恢复: ${at(t)}, 当前位置: (${this.position.x}, ${this.position.y})`), this.isSidebarAlignmentEnabled && (this.startSidebarAlignmentObserver(), this.log("🔄 侧边栏对齐监听器已启动"));
      } else {
        const t = J();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.horizontalTabMaxWidth = t.horizontalTabMaxWidth, this.horizontalTabMinWidth = t.horizontalTabMinWidth, this.enableEdgeHide = t.enableEdgeHide, this.enableBubbleMode = t.enableBubbleMode, this.position = ue(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), !this.isVerticalMode && this.enableBubbleMode && (this.enableBubbleMode = !1, this.isBubbleExpanded = !1, this.verboseLog("🫧 默认配置：水平模式不支持气泡模式，已自动禁用")), this.log("📐 布局模式: 水平 (默认)");
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
        C.FIXED_TO_TOP,
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
    this.position = Vi(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var c, l;
    const i = (c = this.tabContainer) == null ? void 0 : c.querySelectorAll(".orca-tabs-plugin .orca-tab");
    i == null || i.forEach((d) => d.removeAttribute("data-focused"));
    const a = this.getCurrentPanelTabs();
    let n = null;
    if (this.lastActiveTabInstanceId) {
      const d = a.find((u) => u.tabId === this.lastActiveTabInstanceId);
      d && d.blockId === e && (n = d);
    }
    n || (n = a.find((d) => d.blockId === e) || null);
    const o = n != null && n.tabId ? `[data-tab-id="${n.tabId}"]` : `[data-block-id="${e}"]`, s = (l = this.tabContainer) == null ? void 0 : l.querySelector(o);
    if (s) {
      s.setAttribute("data-focused", "true");
      const d = s.getAttribute("data-tab-id");
      d && (this.lastActiveTabInstanceId = d), this.verboseLog(`?? ?????????????: "${t}"`);
    } else
      this.verboseLog(`?? ???????: ${e}`);
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
    } catch (i) {
      return this.error(`创建标签页信息失败: ${e}`, i), null;
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
      const i = t.getAttribute("data-block-id");
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
   * 处理子元素中的orca-hideable元素
   * @param element 父元素
   * @returns 是否处理了子元素中的orca-hideable
   */
  handleChildHideableElements(e) {
    const t = e.querySelector(".orca-hideable");
    if (!t)
      return !1;
    const i = t.querySelector(".orca-block-editor[data-block-id]");
    if (i) {
      const a = i.getAttribute("data-block-id");
      if (a) {
        const n = e.closest(".orca-panel");
        if (n) {
          const o = n.getAttribute("data-panel-id");
          o && this.handleNewBlockInPanel(a, o).catch((s) => {
            this.error(`处理新块失败: ${a}`, s);
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
    const i = Date.now() - this.lastNavigationTime;
    if (this.lastNavigatedBlockId && i < 1e3) {
      this.verboseLog(`⏭️ [DEBUG] 检测到导航后 ${i}ms 内的新块 ${e}，我们刚导航到 ${this.lastNavigatedBlockId}，跳过处理（防止重复标签页）`);
      return;
    }
    const a = document.querySelector(".orca-panel.active"), n = a == null ? void 0 : a.getAttribute("data-panel-id");
    if (n && t !== n) {
      this.log(`🚫 忽略非激活面板 ${t} 中的新块 ${e}，当前激活面板为 ${n}`);
      return;
    }
    const s = this.getPanelIds().indexOf(t);
    if (s === -1) {
      const g = document.querySelectorAll(".orca-panel");
      if (!(g.length > 0 && g[0].getAttribute("data-panel-id") === t)) {
        this.log(`🚫 不管理辅助面板 ${t} 的标签页`);
        return;
      }
    }
    s !== -1 && (this.currentPanelIndex = s, this.currentPanelId = t);
    let c = this.getCurrentPanelTabs();
    this.verboseLog(`🔍 [DEBUG] 当前标签页数量: ${c.length}`);
    const l = c.find((g) => g.blockId === e);
    if (l) {
      this.verboseLog(`🔍 [DEBUG] ✅ 标签 ${e} 已存在，只更新聚焦状态`), this.closedTabs.has(e) && (this.closedTabs.delete(e), this.saveClosedTabs()), this.updateFocusState(e, l.title), this.immediateUpdateTabsUI(), this.verboseLog("🔍 [DEBUG] ========== handleNewBlockInPanel 完成（已存在）==========");
      return;
    }
    this.verboseLog(`🔍 [DEBUG] ❌ 标签 ${e} 不存在，准备创建新标签`), this.creatingTabs.add(e);
    let d = null;
    try {
      if (d = await this.createTabInfoFromBlock(e, t), !d) return;
      c = this.getCurrentPanelTabs();
      const g = c.find((f) => f.blockId === e);
      if (g) {
        this.log(`✅ 标签已被其他地方创建（在await期间），只更新聚焦状态: "${g.title}"`), this.updateFocusState(e, g.title), this.immediateUpdateTabsUI();
        return;
      }
    } finally {
      this.creatingTabs.delete(e);
    }
    const u = this.getCurrentActiveTab();
    if (u) {
      if (u.isPinned) {
        this.log(`📌 当前激活标签已置顶，创建新标签: "${d.title}"`);
        const f = c.filter((v) => v.isPinned).length;
        c.splice(f, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(c), this.immediateUpdateTabsUI();
        return;
      }
      const g = c.findIndex((f) => f.blockId === u.blockId);
      if (g !== -1) {
        this.verboseLog(`🔄 替换当前激活标签页: "${u.title}" -> "${d.title}"`), this.recordTabSwitchHistory(u.blockId, d), d.tabId = c[g].tabId || d.tabId, c[g] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(c), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const g = c.findIndex((f) => f.blockId === this.lastActiveBlockId);
      if (g !== -1) {
        if (c[g].isPinned) {
          this.log(`📌 上一个激活标签已置顶，创建新标签: "${d.title}"`);
          const v = c.filter((w) => w.isPinned).length;
          c.splice(v, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(c), this.immediateUpdateTabsUI();
          return;
        }
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${c[g].title}" -> "${d.title}"`), this.recordTabSwitchHistory(c[g].blockId, d), d.tabId = c[g].tabId || d.tabId, c[g] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(c), this.immediateUpdateTabsUI();
        return;
      }
    }
    let h = -1;
    const b = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (b) {
      const g = b.getAttribute("data-tab-id"), f = b.getAttribute("data-block-id");
      h = c.findIndex((v) => v.tabId === g), h == -1 && f && (h = c.findIndex((v) => v.blockId === f));
    }
    if (h === -1) {
      const g = (m = this.tabContainer) == null ? void 0 : m.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (g && g.length > 0)
        for (let f = 0; f < g.length; f++) {
          const v = g[f];
          if (v.classList.contains("focused") || v.getAttribute("data-focused") === "true" || v.classList.contains("active")) {
            h = f;
            break;
          }
        }
    }
    if (h === -1 && c.length > 0 && (h = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), h >= 0 && h < c.length)
      if (c[h].isPinned) {
        this.log(`📌 目标标签已置顶，创建新标签: "${d.title}"`);
        const f = c.filter((v) => v.isPinned).length;
        c.splice(f, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(c), this.immediateUpdateTabsUI();
      } else
        d.tabId = c[h].tabId || d.tabId, c[h] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(c), this.immediateUpdateTabsUI();
    else
      c = [d], this.updateFocusState(e, d.title), this.setCurrentPanelTabs(c), this.immediateUpdateTabsUI();
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
        const f = document.querySelectorAll(".orca-panel");
        this.log("📊 当前所有面板状态:"), f.forEach((v, w) => {
          const T = v.getAttribute("data-panel-id"), x = v.classList.contains("active");
          this.log(`  面板${w + 1}: ID=${T}, active=${x}`);
        });
        return;
      }
      const t = e.getAttribute("data-panel-id");
      if (!t) {
        this.log("❌ 激活面板没有 data-panel-id");
        return;
      }
      this.verboseLog(`✅ 找到激活面板: ID=${t}, class=${e.className}`);
      const i = this.getPanelIds().indexOf(t);
      i !== -1 && (this.currentPanelIndex = i, this.currentPanelId = t, this.verboseLog(`🔄 更新当前面板索引: ${i} (面板ID: ${t})`));
      const a = this.getViewPanelInfo(e);
      if (a) {
        this.verboseLog(`🖼️ 检测到视图面板: ${a.title}`);
        let f = this.getCurrentPanelTabs();
        const v = `view:${a.panelId}`, w = f.find((T) => T.blockId === v);
        if (w)
          this.updateFocusState(v, w.title), await this.immediateUpdateTabsUI();
        else {
          const T = {
            blockId: v,
            tabId: G(v),
            panelId: a.panelId,
            title: a.title,
            icon: a.icon,
            order: 0,
            blockType: "view",
            isViewPanel: !0
          };
          this.panelTabsData[this.currentPanelIndex] = [T], this.log(`📋 为视图面板创建标签页: ${a.title}`);
          const x = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
          await this.savePanelTabsByKey(x, [T]), await this.immediateUpdateTabsUI();
        }
        return;
      }
      e.querySelectorAll(".orca-hideable");
      const n = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!n) {
        this.log(`❌ 激活面板 ${t} 中没有找到可见的块编辑器`);
        return;
      }
      const o = n.getAttribute("data-block-id");
      if (!o) {
        this.log("激活的块编辑器没有blockId");
        return;
      }
      let s = this.getCurrentPanelTabs();
      s.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), s = this.getCurrentPanelTabs());
      const c = s.find((f) => f.blockId === o);
      if (c) {
        this.closedTabs.has(o) && (this.closedTabs.delete(o), await this.saveClosedTabs()), this.updateFocusState(o, c.title), await this.immediateUpdateTabsUI();
        return;
      }
      const l = Date.now() - this.lastNavigationTime;
      if (this.lastNavigatedBlockId && l < 1e3 && s.find((v) => v.blockId === this.lastNavigatedBlockId)) {
        this.verboseLog(`⏭️ 检测到导航后的新块 ${o}，但我们刚导航到 ${this.lastNavigatedBlockId}，跳过处理（防止重复标签页）`), this.verboseLog(`⏭️ 时间差: ${l}ms`);
        return;
      }
      const d = (g = this.tabContainer) == null ? void 0 : g.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
      if (!d) {
        this.verboseLog(`⚠️ 未找到聚焦的标签元素，当前块: ${o}`);
        return;
      }
      const u = d.getAttribute("data-tab-id"), h = d.getAttribute("data-block-id");
      if (!u && !h)
        return;
      let b = s.findIndex((f) => f.tabId === u);
      if (b === -1 && h && (b = s.findIndex((f) => f.blockId === h)), b === -1)
        return;
      if (s[b].isPinned) {
        this.log(`📌 聚焦标签已置顶，不替换，创建新标签: "${o}"`);
        const f = s.find((v) => v.blockId === o);
        if (f) {
          this.log(`✅ 标签已被其他地方创建，只更新聚焦状态: "${f.title}"`), this.updateFocusState(o, f.title), await this.immediateUpdateTabsUI();
          return;
        }
        if (this.creatingTabs.has(o)) {
          this.log(`⏳ 标签 ${o} 正在被其他地方创建，跳过`);
          return;
        }
        this.creatingTabs.add(o);
        try {
          const v = await this.getTabInfo(o, t, s.length);
          if (!v)
            return;
          s = this.getCurrentPanelTabs();
          const w = s.find((x) => x.blockId === o);
          if (w) {
            this.log(`✅ 标签在创建过程中已被其他地方创建: "${w.title}"`), this.updateFocusState(o, w.title), await this.immediateUpdateTabsUI();
            return;
          }
          const T = s.filter((x) => x.isPinned).length;
          s.splice(T, 0, v), this.updateFocusState(o, v.title), this.setCurrentPanelTabs(s), await this.immediateUpdateTabsUI();
        } finally {
          this.creatingTabs.delete(o);
        }
        return;
      }
      const m = await this.getTabInfo(o, t, b);
      m && (m.tabId = s[b].tabId || m.tabId, s[b] = m, this.setCurrentPanelTabs(s), await this.immediateUpdateTabsUI());
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
      let o = !1, s = !1, c = !1, l = this.currentPanelIndex;
      const d = Date.now(), u = this.lastPanelCheckTime || 0, h = 1e3;
      if (n.forEach((b) => {
        if (b.type === "childList") {
          const p = b.target;
          if ((p.classList.contains("orca-panels-row") || p.closest(".orca-panels-row")) && (s = !0), b.addedNodes.length > 0 && p.closest(".orca-panel")) {
            for (const g of b.addedNodes)
              if (g.nodeType === Node.ELEMENT_NODE) {
                const f = g;
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
        if (b.type === "attributes" && b.attributeName === "class") {
          const p = b.target;
          if (p.classList.contains("orca-panel")) {
            if (c = !0, p.classList.contains("active")) {
              const m = p.getAttribute("data-panel-id"), g = p.querySelectorAll(".orca-hideable");
              let f = null;
              g.forEach((v) => {
                const w = v.classList.contains("orca-hideable-hidden"), T = v.querySelector(".orca-block-editor[data-block-id]"), x = T == null ? void 0 : T.getAttribute("data-block-id");
                !w && T && x && (f = x);
              }), f && m && this.handleNewBlockInPanel(f, m).catch((v) => {
                this.error(`处理面板激活时的新块失败: ${f}`, v);
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
        if (b.type === "attributes" && (b.attributeName === "data-panel-title" || b.attributeName === "data-panel-icon" || b.attributeName === "data-panel-type")) {
          const p = b.target;
          if (p.classList.contains("orca-panel")) {
            const m = p.getAttribute("data-panel-id"), g = p.getAttribute("data-panel-title"), f = p.getAttribute("data-panel-type");
            m && g && f === "view" && (this.verboseLog(`🎨 检测到视图面板元数据变化: ${g}`), o = !0);
          }
        }
      }), c && (await this.updateCurrentPanelIndex(), l !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${l} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), s && d - u > h ? (this.lastPanelCheckTime = d, this.verboseLog(`🔍 面板检查防抖：距离上次检查 ${d - u}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : s && d - u < 100 && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${d - u}ms`), o) {
        const b = Date.now(), p = 300, m = b - this.lastBlockCheckTime;
        m > p ? (this.lastBlockCheckTime = b, await this.checkCurrentPanelBlocks()) : m < 50 && this.verboseLog(`⏭️ 跳过块检查：距离上次检查仅 ${m}ms`);
      }
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      // 监听属性变化：class变化和视图面板元数据属性
      attributes: !0,
      attributeFilter: [
        "class",
        "data-panel-title",
        // 视图面板标题属性
        "data-panel-icon",
        // 视图面板图标属性
        "data-panel-type"
        // 视图面板类型属性
      ],
      // 不监听文本内容变化，减少触发频率
      characterData: !1
    });
    let t = null, i = null;
    const a = async (n) => {
      if (!n || !n.target)
        return;
      const o = n.target;
      if (o.closest(".orca-tabs-plugin") || o.closest(".orca-sidebar") || o.closest(".orca-headbar"))
        return;
      const s = o.closest('.orca-panel[data-panel-type="view"]');
      if (s) {
        const l = s.getAttribute("data-panel-id"), d = l ? `view:${l}` : null;
        if (d && d === i) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个视图面板 ${d}`);
          return;
        }
        t && clearTimeout(t), t = window.setTimeout(async () => {
          if (this.isNavigating) {
            this.verboseLog("⏭️ 正在导航中，跳过视图面板聚焦检测");
            return;
          }
          this.verboseLog(`🎯 检测到视图面板内点击: ${l}`), d && (i = d), await this.checkCurrentPanelBlocks(), t = null;
        }, 0);
        return;
      }
      const c = o.closest(".orca-hideable");
      if (c) {
        const l = c.querySelector(".orca-block-editor[data-block-id]"), d = l == null ? void 0 : l.getAttribute("data-block-id");
        if (d && d === i) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个块 ${d}`);
          return;
        }
        t && clearTimeout(t), t = window.setTimeout(async () => {
          if (!c.classList.contains("orca-hideable-hidden")) {
            if (this.isNavigating) {
              this.verboseLog("⏭️ 正在导航中，跳过聚焦检测");
              return;
            }
            this.verboseLog("🎯 检测到 orca-hideable 元素聚焦变化"), d && (i = d), await this.checkCurrentPanelBlocks();
          }
          t = null;
        }, 0);
      }
    };
    document.addEventListener("click", a), document.addEventListener("mousedown", a), document.addEventListener("focusin", a), document.addEventListener("keydown", (n) => {
      (n.key === "Tab" || n.key === "Enter" || n.key === " ") && (t && clearTimeout(t), t = window.setTimeout(a, 0));
    }), typeof window < "u" && (this.focusSyncInterval !== null && window.clearInterval(this.focusSyncInterval), this.focusSyncInterval = window.setInterval(async () => {
      var n;
      try {
        const o = document.querySelector(".orca-panel.active");
        if (o) {
          const s = o.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (s) {
            const c = s.getAttribute("data-block-id");
            if (c) {
              const l = (n = this.tabContainer) == null ? void 0 : n.querySelector('.orca-tab[data-focused="true"]'), d = !!l;
              if (!this.lastFocusState || this.lastFocusState.blockId !== c || this.lastFocusState.hasFocusedTab !== d)
                if (this.lastFocusState = { blockId: c, hasFocusedTab: d }, l) {
                  const h = l.getAttribute("data-block-id");
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
    const e = this.getPanelIds().length, t = [...this.getPanelIds()];
    if (this.currentPanelId, await this.discoverPanels(), this.getPanelIds().length > e)
      this.log(`🎉 发现新面板！从 ${e} 个增加到 ${this.getPanelIds().length} 个`), await this.createTabsUI();
    else if (this.getPanelIds().length < e) {
      this.log(`📉 面板数量减少！从 ${e} 个减少到 ${this.getPanelIds().length} 个`), this.log(`📋 旧面板列表: [${t.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`);
      const i = t[0], a = this.getPanelIds()[0];
      i && a && i !== a && (this.log(`🔄 第一个面板已变更: ${i} -> ${a}`), await this.handleFirstPanelChange(i, a)), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 更新持久化面板索引为: 0")), await this.createTabsUI();
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
          const i = this.getPanelIds().indexOf(t);
          if (i !== -1) {
            const a = this.currentPanelIndex;
            this.currentPanelIndex = i, this.currentPanelId = t, this.log(`🔄 面板索引更新: ${a} -> ${i} (面板ID: ${t})`), (!this.panelTabsData[i] || this.panelTabsData[i].length === 0) && (this.log(`🔍 面板 ${t} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(i, t || "")), this.debouncedUpdateTabsUI(), this.enableEdgeHide && !this.isFixedToTop && this.debouncedApplyEdgeHideStyle(300);
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
    });
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
    const i = t - 1, a = e[i];
    if (!a) {
      this.log("⚠️ 未找到上一个面板");
      return;
    }
    this.log(`🔄 聚焦到上一个面板: ${a} (索引: ${i})`);
    const n = document.querySelector(`.orca-panel[data-panel-id="${a}"]`);
    if (!n) {
      this.log(`❌ 未找到面板元素: ${a}`);
      return;
    }
    const o = document.querySelector(".orca-panel.active");
    o && o.classList.remove("active"), n.classList.add("active"), this.currentPanelIndex = i, this.currentPanelId = a, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${a}`);
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
    if ((e.ctrlKey || e.metaKey) && e.button === 0 && t) {
      const i = this.getBlockRefId(t);
      if (i) {
        this.creatingTabs.add(i), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.openInNewTab(i).catch((a) => {
          this.creatingTabs.delete(i);
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
      if (Array.from(e).filter((c) => {
        const l = c.getAttribute("data-panel-id");
        return l && !l.startsWith("_");
      }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
        this.verboseLog("📋 面板数量未变化，跳过面板发现");
        return;
      }
      const i = [...this.getPanelIds()], a = this.getPanelIds()[0] || null;
      await this.discoverPanels();
      const n = this.getPanelIds()[0] || null, o = Ki(i, this.getPanelIds());
      o && (this.log(`📋 面板列表发生变化: ${i.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${i.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${a} -> ${n}`), a !== n && (this.log(`🔄 持久化面板已变更: ${a} -> ${n}`), await this.handlePersistentPanelChange(a, n))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
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
  async handlePersistentPanelChange(e, t) {
    if (this.log(`🔄 处理持久化面板变更: ${e} -> ${t}`), t)
      if (e !== t) {
        this.log("🔍 持久化面板发生变化，重新扫描标签");
        const i = this.panelTabsData[0] || [];
        i.length > 0 ? (this.log(`✅ 新持久化面板 ${t} (索引: 0) 已有标签数据，直接使用`), this.panelTabsData[0] = [...i]) : (this.log(`🔍 新持久化面板 ${t} (索引: 0) 没有标签数据，重新扫描`), await this.scanPersistentPanel(t)), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的标签"), await this.updateTabsUI(), this.log(`✅ 持久化面板变更处理完成，当前有 ${this.getCurrentPanelTabs().length} 个标签`);
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
    const i = t.querySelectorAll(".orca-hideable"), a = [];
    let n = 0;
    for (const o of i) {
      const s = o.querySelector(".orca-block-editor");
      if (!s) continue;
      const c = s.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, e, n++);
      l && a.push(l);
    }
    this.panelTabsData[0] = [...a], this.panelTabsData[0] = [...a], this.log(`📋 持久化面板 ${e} (索引: 0) 扫描并保存了 ${a.length} 个标签页`);
  }
  /**
   * 扫描指定面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描DOM并存储到panelTabsData数组
   */
  async scanPanelTabsByIndex(e, t) {
    const i = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!i) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const a = i.querySelectorAll(".orca-block-editor[data-block-id]"), n = [];
    let o = 0;
    this.log(`🔍 扫描面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const c of a) {
      const l = c.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, t, o++);
      d && (n.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    e >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[e] = [...n], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${n.length} 个标签页`);
    const s = e === 0 ? C.FIRST_PANEL_TABS : `panel_${e + 1}_tabs`;
    await this.savePanelTabsByKey(s, n);
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
    const i = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!i) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const a = i.querySelectorAll(".orca-block-editor[data-block-id]"), n = [];
    let o = 0;
    this.log(`🔍 扫描当前聚焦面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const l of a) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const u = await this.getTabInfo(d, t, o++);
      u && (n.push(u), this.log(`📋 找到当前标签页: ${u.title} (${d})`));
    }
    const s = this.panelTabsData[e] || [];
    this.log(`📋 已加载的标签页: ${s.length} 个，当前标签页: ${n.length} 个`);
    const c = [...s];
    for (const l of n)
      c.push(l), this.log(`➕ 添加当前标签页: ${l.title}`);
    this.panelTabsData[e] = [...c], this.log(`📋 合并后标签页总数: ${c.length} 个`);
  }
  /**
   * 获取视图面板信息
   * 
   * 从面板 DOM 元素中提取视图面板的元数据（标题、图标、类型）。
   * 用于识别自定义视图面板（如 AI Chat），这些面板没有传统的块编辑器。
   * 
   * @param panel - 面板 DOM 元素
   * @returns ViewPanelInfo 对象（如果是视图面板）或 null（如果不是视图面板）
   * 
   * @example
   * ```typescript
   * const panel = document.querySelector('.orca-panel[data-panel-id="xxx"]');
   * const viewInfo = this.getViewPanelInfo(panel);
   * if (viewInfo) {
   *   console.log(`视图面板: ${viewInfo.title}, 图标: ${viewInfo.icon}`);
   * }
   * ```
   */
  getViewPanelInfo(e) {
    const t = e.getAttribute("data-panel-id"), i = e.getAttribute("data-panel-title"), a = e.getAttribute("data-panel-icon"), n = e.getAttribute("data-panel-type");
    return !t || !i || n !== "view" ? null : {
      panelId: t,
      title: i,
      icon: a || void 0,
      type: "view"
    };
  }
  /**
   * 扫描当前面板的标签页 - 重构为简化的数组操作
   * 按照用户思路：直接扫描当前面板并更新panelTabsData数组
   * 
   * 支持两种类型的面板：
   * 1. 块编辑器面板 - 包含 .orca-block-editor 元素的传统面板
   * 2. 视图面板 - 自定义视图面板（如 AI Chat），通过 data-panel-* 属性识别
   * 
   * Requirements: 3.2, 3.3, 4.1
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
    const t = this.getViewPanelInfo(e);
    if (t) {
      const s = {
        blockId: `view:${t.panelId}`,
        // 使用 view:${panelId} 格式
        tabId: G(`view:${t.panelId}`),
        panelId: t.panelId,
        title: t.title,
        icon: t.icon,
        order: 0,
        blockType: "view",
        // 设置 blockType 为 'view'
        isViewPanel: !0
        // 标识为视图面板
      };
      this.panelTabsData[this.currentPanelIndex] = [s], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 是视图面板: ${t.title}`);
      const c = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
      await this.savePanelTabsByKey(c, [s]);
      return;
    }
    const i = e.querySelectorAll(".orca-hideable"), a = [];
    let n = 0;
    for (const s of i) {
      const c = s.querySelector(".orca-block-editor");
      if (!c) continue;
      const l = c.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, this.currentPanelId || "", n++);
      d && a.push(d);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...a], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页`);
    const o = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(o, a);
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(e, t) {
    this.log(`🔄 处理第一个面板变更: ${e} -> ${t}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ""}, currentPanelIndex=${this.currentPanelIndex}`);
    const i = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${i.length} 个标签页`), i.length > 0 ? (this.log(`📋 迁移当前面板的 ${i.length} 个标签页到持久化存储`), this.panelTabsData[0] = [...i], this.log("🔄 持久化面板索引已简化，不再需要更新")) : (this.log("🗑️ 当前面板没有标签数据，清空并重新扫描"), this.panelTabsData[0] = [], await this.scanFirstPanel()), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`), this.log("✅ 持久化标签页:", this.getCurrentPanelTabs().map((a) => `${a.title}(${a.blockId})`));
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, i = this.recentlyClosedTabs.map((a, n) => ({
      label: `${a.title}`,
      icon: a.icon || te(a.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(a, n)
    }));
    i.push({
      label: "清空最近关闭列表",
      icon: "ti ti-trash",
      onClick: () => this.clearRecentlyClosedTabs()
    }), this.createRecentlyClosedTabsMenu(i, t);
  }
  /**
   * 创建最近关闭标签页菜单
   */
  createRecentlyClosedTabsMenu(e, t) {
    var p, m;
    const i = document.querySelector(".recently-closed-tabs-menu");
    i && i.remove();
    const a = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", n = document.createElement("div");
    n.className = "recently-closed-tabs-menu";
    const o = 280, s = 350, { x: c, y: l } = ie(t.x, t.y, o, s);
    n.style.cssText = `
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
    `, e.forEach((g, f) => {
      if (g.label === "---") {
        const T = document.createElement("div");
        T.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, n.appendChild(T);
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
      `, g.icon) {
        const T = document.createElement("div");
        if (T.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${a ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, g.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = g.icon, T.appendChild(x);
        } else
          T.textContent = g.icon;
        v.appendChild(T);
      }
      const w = document.createElement("span");
      w.textContent = g.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, v.appendChild(w), v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "transparent";
      }), v.addEventListener("click", () => {
        g.onClick(), n.remove();
      }), n.appendChild(v);
    }), document.body.appendChild(n);
    const d = n.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (n.style.left = `${u - d.width - 10}px`), d.bottom > h && (n.style.top = `${h - d.height - 10}px`);
    const b = (g) => {
      !g || !g.target || n.contains(g.target) || (n.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b));
    };
    setTimeout(() => {
      document.addEventListener("click", b), document.addEventListener("contextmenu", b);
    }, 0);
  }
  /**
   * 恢复最近关闭的标签页
   * 
   * 支持恢复普通块标签页和视图面板标签页（如 AI Chat 面板）。
   * 视图面板的 blockId 以 'view:' 前缀开头，需要特殊处理。
   * 
   * Requirements: 4.3, 5.3
   */
  async restoreRecentlyClosedTab(e, t) {
    try {
      if (this.recentlyClosedTabs.splice(t, 1), await this.saveRecentlyClosedTabs(), this.closedTabs.delete(e.blockId), await this.saveClosedTabs(), N(e)) {
        this.verboseLog(`🖼️ 恢复视图面板标签页: ${e.title} (blockId: ${e.blockId})`);
        const i = this.getCurrentPanelTabs(), a = i.find((n) => n.blockId === e.blockId);
        a ? (this.log(`🔄 视图面板标签页已存在，切换到该标签: "${e.title}"`), await this.switchToTab(a)) : (i.push({
          ...e,
          order: i.length,
          closedAt: void 0
          // 清除关闭时间戳
        }), this.syncCurrentTabsToStorage(i), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.switchToTab(e)), this.log(`🔄 已恢复视图面板标签页: "${e.title}"`), orca.notify("success", `已恢复标签页: ${e.title}`);
        return;
      }
      await this.addTabToPanel(e.blockId, "end", !0), this.log(`🔄 已恢复最近关闭的标签页: "${e.title}"`), orca.notify("success", `已恢复标签页: ${e.title}`);
    } catch (i) {
      this.error("恢复最近关闭标签页失败:", i), orca.notify("error", "恢复标签页失败");
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 100, y: 100 }, i = [];
    this.previousTabSet && this.previousTabSet.length > 0 && (i.push({
      label: `回到上一个标签集合 (${this.previousTabSet.length}个标签)`,
      icon: "ti ti-arrow-left",
      onClick: () => this.restorePreviousTabSet()
    }), i.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    })), this.savedTabSets.forEach((a, n) => {
      i.push({
        label: `${a.name} (${a.tabs.length}个标签)`,
        icon: a.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(a, n)
      });
    }), i.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), i.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    }), this.createRecentlyClosedTabsMenu(i, t);
  }
  /**
   * 显示多标签页保存菜单
   */
  async showMultiTabSavingMenu(e) {
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, i = [];
    i.push({
      label: "保存当前标签页",
      icon: "ti ti-plus",
      onClick: () => this.saveCurrentTabs()
    }), this.savedTabSets.length > 0 && (i.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), this.savedTabSets.forEach((a, n) => {
      i.push({
        label: `${a.name} (${a.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(a, n)
      });
    }), i.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), i.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    })), this.createMultiTabSavingMenu(i, t);
  }
  /**
   * 创建多标签页保存菜单
   */
  createMultiTabSavingMenu(e, t) {
    var p, m;
    const i = document.querySelector(".multi-tab-saving-menu");
    i && i.remove();
    const a = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", n = document.createElement("div");
    n.className = "multi-tab-saving-menu";
    const o = 300, s = 400, { x: c, y: l } = ie(t.x, t.y, o, s);
    n.style.cssText = `
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
    `, e.forEach((g, f) => {
      if (g.label === "---") {
        const T = document.createElement("div");
        T.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, n.appendChild(T);
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
      `, g.icon) {
        const T = document.createElement("div");
        if (T.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${a ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, g.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = g.icon, T.appendChild(x);
        } else
          T.textContent = g.icon;
        v.appendChild(T);
      }
      const w = document.createElement("span");
      w.textContent = g.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, v.appendChild(w), v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "transparent";
      }), v.addEventListener("click", () => {
        g.onClick(), n.remove();
      }), n.appendChild(v);
    }), document.body.appendChild(n);
    const d = n.getBoundingClientRect(), u = window.innerWidth, h = window.innerHeight;
    d.right > u && (n.style.left = `${u - d.width - 10}px`), d.bottom > h && (n.style.top = `${h - d.height - 10}px`);
    const b = (g) => {
      !g || !g.target || n.contains(g.target) || (n.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b));
    };
    setTimeout(() => {
      document.addEventListener("click", b), document.addEventListener("contextmenu", b);
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
    `, t.addEventListener("click", (k) => {
      k.stopPropagation();
    });
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, i.textContent = "保存标签页集合", t.appendChild(i);
    const a = document.createElement("div");
    a.style.cssText = `
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
    const s = document.createElement("button");
    s.className = "orca-button", s.textContent = "更新已有标签组", s.style.cssText = "flex: 1;";
    let c = !1;
    const l = () => {
      c = !1, o.className = "orca-button orca-button-secondary", o.style.cssText = "flex: 1;", s.className = "orca-button", s.style.cssText = "flex: 1;", u.style.display = "block", p.style.display = "none", x();
    }, d = () => {
      c = !0, s.className = "orca-button orca-button-secondary", s.style.cssText = "flex: 1;", o.className = "orca-button", o.style.cssText = "flex: 1;", u.style.display = "none", p.style.display = "block", x();
    };
    o.onclick = l, s.onclick = d, n.appendChild(o), n.appendChild(s), a.appendChild(n);
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
    const b = document.createElement("input");
    b.type = "text", b.value = `标签页集合 ${this.savedTabSets.length + 1}`, b.style.cssText = `
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
    `, b.addEventListener("focus", () => {
      b.style.borderColor = "var(--orca-color-primary-5)";
    }), b.addEventListener("blur", () => {
      b.style.borderColor = "#ddd";
    }), b.addEventListener("input", (k) => {
    }), u.appendChild(b);
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
    const g = document.createElement("select");
    g.style.cssText = `
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
    `, g.addEventListener("focus", () => {
      g.style.borderColor = "var(--orca-color-primary-5)";
    }), g.addEventListener("blur", () => {
      g.style.borderColor = "#ddd";
    });
    const f = document.createElement("option");
    f.value = "", f.textContent = "请选择标签页集合...", g.appendChild(f), this.savedTabSets.forEach((k, S) => {
      const A = document.createElement("option");
      A.value = S.toString(), A.textContent = `${k.name} (${k.tabs.length}个标签)`, g.appendChild(A);
    }), p.appendChild(g), a.appendChild(u), a.appendChild(p), t.appendChild(a);
    const v = document.createElement("div");
    v.style.cssText = `
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
    const T = document.createElement("button");
    T.className = "orca-button orca-button-primary", T.textContent = "保存", T.style.cssText = "", T.addEventListener("mouseenter", () => {
      T.style.backgroundColor = "#2563eb";
    }), T.addEventListener("mouseleave", () => {
      T.style.backgroundColor = "var(--orca-color-primary-5)";
    });
    const x = () => {
      T.textContent = c ? "更新" : "保存";
    };
    T.onclick = async () => {
      if (c) {
        const k = parseInt(g.value);
        if (isNaN(k) || k < 0 || k >= this.savedTabSets.length) {
          orca.notify("warn", "请选择要更新的标签页集合");
          return;
        }
        t.remove(), await this.performUpdateTabSet(k);
      } else {
        const k = b.value.trim();
        if (!k) {
          orca.notify("warn", "请输入名称");
          return;
        }
        t.remove(), await this.performSaveTabSet(k);
      }
    }, v.appendChild(w), v.appendChild(T), t.appendChild(v), document.body.appendChild(t), setTimeout(() => {
      b.focus(), b.select();
    }, 100), b.addEventListener("keydown", (k) => {
      k.key === "Enter" ? (k.preventDefault(), T.click()) : k.key === "Escape" && (k.preventDefault(), w.click());
    });
    const E = (k) => {
      !k || !k.target || t.contains(k.target) || (t.remove(), document.removeEventListener("click", E));
    };
    setTimeout(() => {
      document.addEventListener("click", E);
    }, 200);
  }
  /**
   * 执行保存标签页集合
   */
  async performSaveTabSet(e) {
    try {
      const t = this.getCurrentPanelTabs(), i = {
        id: `tabset_${Date.now()}`,
        name: e,
        tabs: [...t],
        // 深拷贝当前标签页
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.savedTabSets.push(i), await this.saveSavedTabSets(), this.log(`💾 已保存标签页集合: "${e}" (${t.length}个标签)`), orca.notify("success", `已保存标签页集合: ${e}`);
    } catch (t) {
      this.error("保存标签页集合失败:", t), orca.notify("error", "保存失败");
    }
  }
  /**
   * 执行更新已有标签页集合
   */
  async performUpdateTabSet(e) {
    try {
      const t = this.getCurrentPanelTabs(), i = this.savedTabSets[e];
      if (!i) {
        orca.notify("error", "标签页集合不存在");
        return;
      }
      i.tabs = [...t], i.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已更新标签页集合: "${i.name}" (${t.length}个标签)`), orca.notify("success", `已更新标签页集合: ${i.name}`);
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
    const i = document.createElement("div");
    i.className = "add-to-tabgroup-dialog", i.style.cssText = `
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
    `, i.addEventListener("click", (b) => {
      b.stopPropagation();
    });
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, a.textContent = "添加到已有标签组", i.appendChild(a);
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
    c.value = "", c.textContent = "请选择标签组...", s.appendChild(c), this.savedTabSets.forEach((b, p) => {
      const m = document.createElement("option");
      m.value = p.toString(), m.textContent = `${b.name} (${b.tabs.length}个标签)`, s.appendChild(m);
    }), n.appendChild(s), i.appendChild(n);
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
      i.remove(), this.manageSavedTabSets();
    };
    const u = document.createElement("button");
    u.className = "orca-button orca-button-primary", u.textContent = "添加", u.style.cssText = "", u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#2563eb";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "var(--orca-color-primary-5)";
    }), u.onclick = async () => {
      const b = parseInt(s.value);
      if (isNaN(b) || b < 0 || b >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      i.remove(), await this.addTabToGroup(e, b);
    }, l.appendChild(d), l.appendChild(u), i.appendChild(l), document.body.appendChild(i), setTimeout(() => {
      s.focus();
    }, 100), s.addEventListener("keydown", (b) => {
      b.key === "Enter" ? (b.preventDefault(), u.click()) : b.key === "Escape" && (b.preventDefault(), d.click());
    });
    const h = (b) => {
      !b || !b.target || i.contains(b.target) || (i.remove(), document.removeEventListener("click", h));
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
      const i = this.savedTabSets[t];
      if (!i) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (i.tabs.find((n) => n.blockId === e.blockId)) {
        orca.notify("warn", "该标签页已在此标签组中");
        return;
      }
      i.tabs.push({ ...e }), i.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`➕ 已将标签页 "${e.title}" 添加到标签组: "${i.name}"`), orca.notify("success", `已添加到标签组: ${i.name}`);
    } catch (i) {
      this.error("添加标签页到标签组失败:", i), orca.notify("error", "添加失败");
    }
  }
  /**
   * 加载保存的标签页集合
   */
  async loadSavedTabSet(e, t) {
    try {
      const i = this.getCurrentPanelTabs();
      this.previousTabSet = [...i], i.length = 0;
      for (const a of e.tabs) {
        const n = { ...a, panelId: this.currentPanelId || "" };
        i.push(n);
      }
      this.syncCurrentTabsToStorage(i), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), e.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已加载标签页集合: "${e.name}" (${e.tabs.length}个标签)`), orca.notify("success", `已加载标签页集合: ${e.name}`);
    } catch (i) {
      this.error("加载标签页集合失败:", i), orca.notify("error", "加载失败");
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
      for (const i of this.previousTabSet) {
        const a = { ...i, panelId: this.currentPanelId || "" };
        e.push(a);
      }
      this.previousTabSet = t, this.syncCurrentTabsToStorage(e), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`🔄 已回到上一个标签集合 (${this.previousTabSet.length}个标签)`), orca.notify("success", "已回到上一个标签集合");
    } catch (e) {
      this.error("回到上一个标签集合失败:", e), orca.notify("error", "恢复失败");
    }
  }
  /**
   * 重新渲染可排序的标签列表
   */
  renderSortableTabs(e, t, i) {
    var o, s;
    if (Z(e)) {
      this.verboseLog("⚠️ renderSortableTabs 容器被 content-visibility 隐藏，跳过渲染以避免渲染警告");
      return;
    }
    const a = document.documentElement.classList.contains("dark") || ((s = (o = window.orca) == null ? void 0 : o.state) == null ? void 0 : s.themeMode) === "dark";
    W(e, () => {
      e.innerHTML = "";
    });
    let n = -1;
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
      `, u.textContent = "⋮⋮", d.appendChild(u), c.icon) {
        const f = document.createElement("div");
        if (f.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${a ? "#cccccc" : "#666"};
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `, c.icon.startsWith("ti ti-")) {
          const v = document.createElement("i");
          v.className = c.icon, f.appendChild(v);
        } else
          f.textContent = c.icon;
        d.appendChild(f);
      }
      const h = document.createElement("div");
      h.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 20px;
      `;
      const b = document.createElement("div");
      b.style.cssText = `
        font-size: 14px;
        color: var(--orca-color-text-1);
        font-weight: 500;
        line-height: 1.2;
        margin-bottom: 2px;
      `, b.textContent = c.title, h.appendChild(b);
      const p = document.createElement("div");
      p.style.cssText = `
        font-size: 12px;
        color: #666;
        line-height: 1.2;
      `, p.textContent = `ID: ${c.blockId}`, h.appendChild(p), d.appendChild(h);
      const m = document.createElement("div");
      m.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;
      const g = document.createElement("div");
      g.style.cssText = `
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
      `, g.textContent = (l + 1).toString(), m.appendChild(g), d.appendChild(m), d.addEventListener("dragstart", (f) => {
        this.verboseLog("拖拽开始，索引:", l), n = l, f.dataTransfer.setData("text/plain", l.toString()), f.dataTransfer.setData("application/json", JSON.stringify(c)), f.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (f) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", n = -1;
      }), d.addEventListener("dragover", (f) => {
        f.preventDefault(), f.dataTransfer.dropEffect = "move", n !== -1 && n !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (f) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (f) => {
        f.preventDefault(), f.stopPropagation();
        const v = parseInt(f.dataTransfer.getData("text/plain")), w = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", v !== w && v >= 0) {
          const T = t[v];
          t.splice(v, 1), t.splice(w, 0, T), this.renderSortableTabs(e, t);
          const x = this.savedTabSets.find((E) => E.tabs === t);
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
    const i = await this.tabStorageService.loadTabsBeforeWorkspace();
    i && i.length > 0 && (this.tabsBeforeWorkspace = i, this.log(`📁 发现保存的标签页组数据: ${this.tabsBeforeWorkspace.length}个标签页，将在初始化后恢复`), this.shouldRestoreTabsBeforeWorkspace = !0);
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
      for (const i of e)
        try {
          const a = await this.getTabInfo(i.blockId, this.currentPanelId || "", t.length);
          a ? (a.isPinned = i.isPinned, a.order = i.order, a.scrollPosition = i.scrollPosition, t.push(a)) : t.push(i);
        } catch (a) {
          this.warn(`无法更新标签页信息 ${i.title}:`, a), t.push(i);
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
      const i = document.createElement("div");
      i.className = "exit-workspace-confirm-dialog", i.style.cssText = `
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
      const a = document.createElement("div");
      a.style.cssText = `
        font-size: 18px;
        font-weight: 600;
        color: var(--orca-color-text-1);
        margin-bottom: var(--orca-spacing-md);
      `, a.textContent = "退出工作区";
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
        i.remove(), e(!1);
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
        i.remove(), e(!0);
      }), s.addEventListener("mouseenter", () => {
        s.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), s.addEventListener("mouseleave", () => {
        s.style.backgroundColor = "var(--orca-color-bg-1)";
      }), c.addEventListener("mouseenter", () => {
        c.style.opacity = "0.9";
      }), c.addEventListener("mouseleave", () => {
        c.style.opacity = "1";
      }), o.appendChild(s), o.appendChild(c), i.appendChild(a), i.appendChild(n), i.appendChild(o), document.body.appendChild(i);
      const l = (d) => {
        !d || !d.target || i.contains(d.target) || (i.remove(), document.removeEventListener("click", l), e(!1));
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
    const t = document.documentElement.classList.contains("dark") || ((m = (p = window.orca) == null ? void 0 : p.state) == null ? void 0 : m.themeMode) === "dark", i = document.createElement("div");
    i.className = "save-workspace-dialog", i.style.cssText = `
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
    const a = document.createElement("div");
    a.style.cssText = `
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
      i.remove(), this.showWorkspaceMenu();
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
      const g = s.value.trim();
      if (!g) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((f) => f.name === g)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(g, l.value.trim()), i.remove();
    }, d.appendChild(u), d.appendChild(h), a.appendChild(n), a.appendChild(o), a.appendChild(s), a.appendChild(c), a.appendChild(l), a.appendChild(d), i.appendChild(a), document.body.appendChild(i), s.focus(), i.addEventListener("click", (g) => {
      g.target === i && i.remove();
    });
    const b = (g) => {
      g.key === "Escape" && (i.remove(), document.removeEventListener("keydown", b));
    };
    document.addEventListener("keydown", b);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const i = this.getCurrentPanelTabs(), a = this.getCurrentActiveTab(), n = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: i,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: a ? a.blockId : void 0
      };
      this.workspaces.push(n), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${i.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (i) {
      this.error("保存工作区失败:", i), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(e) {
    var v, w;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const i = document.documentElement.classList.contains("dark") || ((w = (v = window.orca) == null ? void 0 : v.state) == null ? void 0 : w.themeMode) === "dark", a = document.createElement("div");
    a.className = "workspace-menu";
    const n = 280, o = 400, s = e ? { x: e.clientX, y: e.clientY } : { x: 20, y: 60 }, { x: c, y: l } = ie(s.x, s.y, n, o);
    a.style.cssText = `
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
      a.remove(), this.saveCurrentWorkspace();
    };
    const b = document.createElement("div");
    if (b.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const T = document.createElement("div");
      T.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${i ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, T.textContent = "暂无工作区", b.appendChild(T);
    } else
      this.workspaces.forEach((T) => {
        const x = document.createElement("div");
        x.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-family: var(--orca-fontfamily-ui);
          font-size: var(--orca-fontsize-sm);
          display: flex;
          align-items: center;
          gap: 8px;
          border-radius: var(--orca-radius-md);
          color: var(--orca-color-text-1);
          ${this.currentWorkspace === T.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const E = T.icon || "ti ti-folder", k = document.createElement("i");
        k.className = E, k.style.cssText = `
          font-size: 14px;
          color: var(--orca-color-primary-5);
        `, x.appendChild(k);
        const S = document.createElement("div");
        S.style.cssText = "flex: 1;";
        const A = document.createElement("div");
        if (A.style.cssText = `
          font-weight: 500;
          color: var(--orca-color-text-1);
        `, A.textContent = T.name, S.appendChild(A), T.description) {
          const U = document.createElement("div");
          U.style.cssText = `
            font-size: 12px;
            color: ${i ? "#999" : "#666"};
            margin-top: 2px;
          `, U.textContent = T.description, S.appendChild(U);
        }
        const _ = document.createElement("div");
        if (_.style.cssText = `
          font-size: 11px;
          color: ${i ? "#777" : "#999"};
          margin-top: 2px;
        `, _.textContent = `${T.tabs.length}个标签`, S.appendChild(_), x.appendChild(S), this.currentWorkspace === T.id) {
          const U = document.createElement("i");
          U.className = "ti ti-check", U.style.cssText = `
            font-size: 14px;
            color: var(--orca-color-primary-5);
          `, x.appendChild(U);
        }
        x.addEventListener("mouseenter", () => {
          x.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), x.addEventListener("mouseleave", () => {
          x.style.backgroundColor = this.currentWorkspace === T.id ? "rgba(59, 130, 246, 0.1)" : "transparent";
        }), x.onclick = () => {
          a.remove(), this.switchToWorkspace(T.id);
        }, b.appendChild(x);
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
      a.remove(), this.manageWorkspaces();
    };
    let g = null;
    if (this.currentWorkspace) {
      g = document.createElement("div"), g.className = "workspace-menu-item", g.setAttribute("data-action", "exit-workspace"), g.style.cssText = `
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
      const T = document.createElement("span");
      T.textContent = "退出工作区", T.style.cssText = `
        margin-right: var(--orca-spacing-md);
        color: var(--orca-color-danger);
      `, g.appendChild(T), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.onclick = () => {
        a.remove(), this.exitWorkspace();
      };
    }
    a.appendChild(d), a.appendChild(u), a.appendChild(b), a.appendChild(p), g && a.appendChild(g), document.body.appendChild(a);
    const f = (T) => {
      !T || !T.target || a.contains(T.target) || (a.remove(), document.removeEventListener("click", f));
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
      const t = this.workspaces.find((i) => i.id === e);
      if (!t) {
        orca.notify("error", "工作区不存在");
        return;
      }
      if (!this.currentWorkspace && !this.tabsBeforeWorkspace) {
        const i = this.getCurrentPanelTabs();
        this.tabsBeforeWorkspace = [...i], await this.tabStorageService.saveTabsBeforeWorkspace(this.tabsBeforeWorkspace), this.log(`💾 保存了进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`);
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
      const i = [];
      for (const n of e)
        try {
          const o = await this.getTabInfo(n.blockId, this.currentPanelId || "", i.length);
          o ? (o.isPinned = n.isPinned, o.order = n.order, o.scrollPosition = n.scrollPosition, i.push(o)) : i.push(n);
        } catch (o) {
          this.warn(`无法更新标签页信息 ${n.title}:`, o), i.push(n);
        }
      this.panelTabsData[0] = i, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...i], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const a = t.lastActiveTabId;
      setTimeout(async () => {
        if (i.length > 0) {
          let n = i[0];
          if (a) {
            const o = i.find((s) => s.blockId === a);
            o ? (n = o, this.log(`🎯 导航到工作区中最后激活的标签页: ${n.title} (ID: ${a})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${n.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${n.title}`);
          await this.safeNavigate(n.blockId, this.currentPanelId || "", n);
        }
      }, 100), this.log(`📋 已替换当前标签页，共 ${i.length} 个标签，块类型图标已更新`);
    } catch (i) {
      throw this.error("替换标签页失败:", i), i;
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
    const t = this.workspaces.find((i) => i.id === this.currentWorkspace);
    t && (t.lastActiveTabId = e.blockId, t.updatedAt = Date.now(), await this.saveWorkspaces(), this.log(`🔄 实时更新工作区最后激活标签页: ${e.title} (ID: ${e.blockId})`));
  }
  /**
   * 保存当前标签页到当前工作区
   */
  async saveCurrentTabsToWorkspace() {
    if (!this.currentWorkspace) return;
    const e = this.workspaces.find((t) => t.id === this.currentWorkspace);
    if (e) {
      const t = this.getCurrentPanelTabs(), i = this.getCurrentActiveTab();
      e.tabs = t, e.lastActiveTabId = i ? i.blockId : void 0, e.updatedAt = Date.now(), await this.saveWorkspaces();
    }
  }
  /**
   * 管理工作区
   */
  manageWorkspaces() {
    var d, u;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", i = document.createElement("div");
    i.className = "manage-workspaces-dialog", i.style.cssText = `
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
    const a = document.createElement("div");
    a.style.cssText = `
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
        const b = document.createElement("div");
        b.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          margin-bottom: 8px;
          background: ${this.currentWorkspace === h.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)"};
        `;
        const p = h.icon || "ti ti-folder", m = document.createElement("i");
        m.className = p, m.style.cssText = `
          font-size: 20px;
          color: var(--orca-color-primary-5);
          margin-right: 12px;
        `, b.appendChild(m);
        const g = document.createElement("div");
        g.style.cssText = "flex: 1;";
        const f = document.createElement("div");
        if (f.style.cssText = `
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
          color: ${t ? "#ffffff" : "#333"};
        `, f.textContent = h.name, g.appendChild(f), h.description) {
          const x = document.createElement("div");
          x.style.cssText = `
            font-size: 12px;
            color: ${t ? "#999" : "#666"};
            margin-bottom: 4px;
          `, x.textContent = h.description, g.appendChild(x);
        }
        const v = document.createElement("div");
        v.style.cssText = `
          font-size: 11px;
          color: ${t ? "#777" : "#999"};
        `, v.textContent = `${h.tabs.length}个标签 • 创建于 ${new Date(h.createdAt).toLocaleString()}`, g.appendChild(v), b.appendChild(g);
        const w = document.createElement("div");
        if (w.style.cssText = `
          display: flex;
          gap: 8px;
        `, this.currentWorkspace === h.id) {
          const x = document.createElement("span");
          x.style.cssText = `
            color: var(--orca-color-primary-5);
            font-size: 12px;
          `, x.textContent = "当前", w.appendChild(x);
        }
        const T = document.createElement("button");
        T.className = "delete-workspace-btn", T.dataset.workspaceId = h.id, T.style.cssText = `
          padding: 4px 8px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          background: var(--orca-color-bg-1);
          color: #ef4444;
          cursor: pointer;
          font-size: 12px;
        `, T.textContent = "删除", w.appendChild(T), b.appendChild(w), b.addEventListener("mouseenter", () => {
          b.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), b.addEventListener("mouseleave", () => {
          b.style.backgroundColor = this.currentWorkspace === h.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)";
        }), o.appendChild(b);
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
      i.remove();
    }, s.appendChild(c), a.appendChild(n), a.appendChild(o), a.appendChild(s), i.appendChild(a), document.body.appendChild(i), i.querySelectorAll(".delete-workspace-btn").forEach((h) => {
      h.addEventListener("click", async (b) => {
        const p = b.target.getAttribute("data-workspace-id");
        p && (await this.deleteWorkspace(p), i.remove(), this.manageWorkspaces());
      });
    }), i.addEventListener("click", (h) => {
      h.target === i && i.remove();
    });
  }
  /**
   * 删除工作区
   */
  async deleteWorkspace(e) {
    try {
      const t = this.workspaces.find((i) => i.id === e);
      if (!t) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace === e && (this.currentWorkspace = null), this.workspaces = this.workspaces.filter((i) => i.id !== e), await this.saveWorkspaces(), this.log(`🗑️ 工作区已删除: "${t.name}"`), orca.notify("success", `工作区已删除: ${t.name}`);
    } catch (t) {
      this.error("删除工作区失败:", t), orca.notify("error", "删除工作区失败");
    }
  }
  /**
   * 显示标签集合详情
   */
  showTabSetDetails(e, t) {
    var h, b;
    document.documentElement.classList.contains("dark") || ((b = (h = window.orca) == null ? void 0 : h.state) == null || b.themeMode);
    const i = document.querySelector(".tabset-details-dialog");
    i && i.remove();
    const a = document.createElement("div");
    a.className = "tabset-details-dialog", a.style.cssText = `
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
    `, n.textContent = `标签集合详情: ${e.name}`, a.appendChild(n);
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;
    const s = document.createElement("div");
    s.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background-color: var(--orca-color-bg-1);
      border-radius: var(--orca-radius-md);
    `;
    const c = (p, m, g = !0) => {
      const f = document.createElement("div");
      f.style.cssText = `
        font-size: 14px;
        color: #666;
        ${g ? "margin-bottom: 8px;" : ""}
      `;
      const v = document.createElement("strong");
      v.textContent = `${p}:`, f.appendChild(v), f.appendChild(document.createTextNode(` ${m}`)), s.appendChild(f);
    };
    if (c("创建时间", new Date(e.createdAt).toLocaleString()), c("更新时间", new Date(e.updatedAt).toLocaleString()), c("标签数量", `${e.tabs.length}个`, !1), o.appendChild(s), e.tabs.length === 0) {
      const p = document.createElement("div");
      p.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `, p.textContent = "该标签集合为空", o.appendChild(p);
    } else {
      const p = document.createElement("div");
      p.style.cssText = `
        margin-bottom: 16px;
      `;
      const m = document.createElement("div");
      m.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: var(--orca-color-text-1);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const g = document.createElement("span");
      g.textContent = "包含的标签 (可拖拽排序):", m.appendChild(g);
      const f = document.createElement("span");
      f.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, f.textContent = "拖拽调整顺序", m.appendChild(f), p.appendChild(m);
      const v = document.createElement("div");
      v.className = "sortable-tabs-container", v.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(v, [...e.tabs], e), p.appendChild(v), o.appendChild(p);
    }
    a.appendChild(o);
    const l = document.createElement("div");
    l.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const d = document.createElement("button");
    d.className = "orca-button", d.textContent = "关闭", d.style.cssText = "", d.addEventListener("mouseenter", () => {
      d.style.backgroundColor = "#4b5563";
    }), d.addEventListener("mouseleave", () => {
      d.style.backgroundColor = "#6b7280";
    }), d.onclick = () => {
      a.remove(), t && this.manageSavedTabSets();
    }, l.appendChild(d), a.appendChild(l), document.body.appendChild(a);
    const u = (p) => {
      a.contains(p.target) || (a.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, i) {
    const a = document.querySelector(".rename-tabset-dialog");
    a && a.remove();
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
    }), s.appendChild(l), n.appendChild(s);
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
      if (this.savedTabSets.find((g) => g.name === p && g.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = p, e.updatedAt = Date.now(), await this.saveSavedTabSets(), n.remove(), i.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(u), d.appendChild(h), n.appendChild(d), document.body.appendChild(n), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), h.click()) : p.key === "Escape" && (p.preventDefault(), u.click());
    });
    const b = (p) => {
      !p || !p.target || n.contains(p.target) || (n.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b));
    };
    setTimeout(() => {
      document.addEventListener("click", b), document.addEventListener("contextmenu", b);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, i, a) {
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
    const o = i.textContent;
    i.replaceChildren(), i.appendChild(n), n.addEventListener("click", (d) => {
      d.stopPropagation();
    }), n.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), n.focus(), n.select();
    const s = async () => {
      const d = n.value.trim();
      if (!d) {
        i.textContent = o;
        return;
      }
      if (d === e.name) {
        i.textContent = o;
        return;
      }
      if (this.savedTabSets.find((h) => h.name === d && h.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), i.textContent = o;
        return;
      }
      e.name = d, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i.textContent = d, orca.notify("success", "重命名成功");
    }, c = () => {
      i.textContent = o;
    };
    n.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), s()) : d.key === "Escape" && (d.preventDefault(), c());
    });
    let l = null;
    n.addEventListener("blur", () => {
      l && clearTimeout(l), l = window.setTimeout(() => {
        s();
      }, 100);
    }), n.addEventListener("focus", () => {
      l && (clearTimeout(l), l = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, i, a, n) {
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
        background: ${e.icon === p.value ? "#e3f2fd" : "white"};
      `;
      const g = document.createElement("div");
      if (g.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, p.value.startsWith("ti ti-")) {
        const v = document.createElement("i");
        v.className = p.value, g.appendChild(v);
      } else
        g.textContent = p.icon;
      const f = document.createElement("div");
      f.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, f.textContent = p.name, m.appendChild(g), m.appendChild(f), m.addEventListener("click", async (v) => {
        v.stopPropagation(), e.icon = p.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), a(), o.remove(), n && n.focus(), orca.notify("success", "图标已更新");
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "#f5f5f5", m.style.borderColor = "var(--orca-color-primary-5)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = e.icon === p.value ? "#e3f2fd" : "white", m.style.borderColor = "#e0e0e0";
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
      p.stopPropagation(), o.remove(), n && n.focus();
    }, u.appendChild(h), o.appendChild(u), document.body.appendChild(o);
    const b = (p) => {
      o.contains(p.target) || (p.stopPropagation(), o.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b), n && n.focus());
    };
    setTimeout(() => {
      document.addEventListener("click", b), document.addEventListener("contextmenu", b);
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
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, i.textContent = "管理保存的标签页集合", t.appendChild(i);
    const a = document.createElement("div");
    a.style.cssText = `
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
      `, D(h, X("点击编辑图标"));
      const b = () => {
        if (h.replaceChildren(), c.icon)
          if (c.icon.startsWith("ti ti-")) {
            const x = document.createElement("i");
            x.className = c.icon, h.appendChild(x);
          } else
            h.textContent = c.icon;
        else
          h.textContent = "📁";
      };
      b(), h.addEventListener("click", () => {
        this.editTabSetIcon(c, l, h, b, t);
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
      `, m.textContent = c.name, D(m, X("点击编辑名称")), m.addEventListener("click", () => {
        this.editTabSetName(c, l, m, t);
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      });
      const g = document.createElement("div");
      g.style.cssText = `
        font-size: 12px;
        color: #666;
      `, g.textContent = `${c.tabs.length}个标签 • ${new Date(c.updatedAt).toLocaleString()}`, p.appendChild(m), p.appendChild(g), u.appendChild(h), u.appendChild(p);
      const f = document.createElement("div");
      f.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const v = document.createElement("button");
      v.className = "orca-button orca-button-primary", v.textContent = "加载", v.style.cssText = "", v.onclick = () => {
        this.loadSavedTabSet(c, l), t.remove();
      };
      const w = document.createElement("button");
      w.className = "orca-button", w.textContent = "查看", w.style.cssText = "", w.onclick = () => {
        this.showTabSetDetails(c, t);
      };
      const T = document.createElement("button");
      T.className = "orca-button", T.textContent = "删除", T.style.cssText = "", T.onclick = () => {
        confirm(`确定要删除标签页集合 "${c.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), t.remove(), this.manageSavedTabSets());
      }, f.appendChild(v), f.appendChild(w), f.appendChild(T), d.appendChild(u), d.appendChild(f), a.appendChild(d);
    }), t.appendChild(a);
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
    const s = (c) => {
      !c || !c.target || t.contains(c.target) || (t.remove(), document.removeEventListener("click", s), document.removeEventListener("contextmenu", s));
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
    var a;
    const t = e.healthScore || 0, i = ((a = e.issues) == null ? void 0 : a.length) || 0;
    this.log(`📊 性能报告: 健康分数 ${t}/100, 问题数: ${i}`), t < 50 && i > 0 && (this.log("⚠️ 性能分数过低，触发自动优化"), this.triggerPerformanceOptimization());
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
  trackOptimizedResource(e, t, i, a) {
    if (!this.performanceOptimizer)
      return e.addEventListener(t, i, a), null;
    const n = this.performanceOptimizer.trackEventListener(e, t, i, a);
    return n && this.verboseLog(`👂 跟踪事件监听器: ${t} -> ${n}`), n;
  }
  /**
   * 销毁插件，清理所有资源
   */
  destroy() {
    try {
      typeof window < "u" && this.performanceBaselineTimer !== null && window.clearTimeout(this.performanceBaselineTimer), this.performanceBaselineTimer = null, this.lastBaselineScenario = null, this.log("🗑️ 开始销毁插件..."), this.log("💾 保存插件数据..."), this.saveCurrentPanelTabsImmediately().catch((t) => {
        this.error("销毁时保存数据失败:", t);
      }), this.saveDataDebounceTimer !== null && (clearTimeout(this.saveDataDebounceTimer), this.saveDataDebounceTimer = null), this.edgeHideDebounceTimer !== null && (clearTimeout(this.edgeHideDebounceTimer), this.edgeHideDebounceTimer = null), this.performanceOptimizer && (this.log("🧹 清理性能优化器..."), this.performanceOptimizer.destroy(), this.performanceOptimizer = null), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null);
      const e = document.getElementById("orca-tabs-drag-styles");
      e && e.remove(), this.focusSyncInterval !== null && (typeof window < "u" ? window.clearInterval(this.focusSyncInterval) : clearInterval(this.focusSyncInterval), this.focusSyncInterval = null), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener, { capture: !0 }), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null, this.log("✅ 插件销毁完成");
    } catch (e) {
      this.error("❌ 插件销毁过程中发生错误:", e);
    }
  }
}
let P = null;
async function Qi(r) {
  O = r, orca.state.locale, ki(!0), P = new Ji(O), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => P == null ? void 0 : P.init(), 500);
  }) : setTimeout(() => P == null ? void 0 : P.init(), 500);
  try {
    orca.commands.unregisterCommand(`${O}.resetCache`);
  } catch {
  }
  orca.commands.registerCommand(
    `${O}.resetCache`,
    async () => {
      P && await P.resetCache();
    },
    "重置插件缓存"
  );
  try {
    orca.commands.unregisterCommand(`${O}.toggleBlockIcons`);
  } catch {
  }
  orca.commands.registerCommand(
    `${O}.toggleBlockIcons`,
    async () => {
      P && await P.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function ea() {
  P && (P.unregisterBlockMenuCommands(), P.unregisterHeadbarButton(), P.cleanupDragResize(), P.destroy(), P = null);
  try {
    re();
  } catch (r) {
    console.warn("清理 tooltip 时出错:", r);
  }
  try {
    orca.commands.unregisterCommand(`${O}.resetCache`);
  } catch {
  }
  try {
    orca.commands.unregisterCommand(`${O}.toggleBlockIcons`);
  } catch {
  }
}
export {
  Qi as load,
  ea as unload
};
