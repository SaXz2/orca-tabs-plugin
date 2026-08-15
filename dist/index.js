var Qe = Object.defineProperty;
var et = (c, e, t) => e in c ? Qe(c, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : c[e] = t;
var v = (c, e, t) => et(c, typeof e != "symbol" ? e + "" : e, t);
const He = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, Oe = {
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
  /** 固定到编辑器顶部状态 - 存储标签页容器是否覆盖在编辑器区域顶部的状态 */
  FIXED_TO_EDITOR_TOP: "fixed-to-editor-top",
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
  /** 进入工作区前的面板布局 - 存储进入工作区前的面板树，用于退出工作区时恢复多面板布局 */
  LAYOUT_BEFORE_WORKSPACE: "layout-before-workspace",
  /** 最近切换标签历史 - 存储每个标签的最近切换历史，用于悬浮显示功能 */
  RECENT_TAB_SWITCH_HISTORY: "recent-tab-switch-history",
  /** 中键固定标签页功能开关 - 存储是否启用中键固定标签页功能 */
  ENABLE_MIDDLE_CLICK_PIN: "enable-middle-click-pin",
  /** 双击关闭标签页功能开关 - 存储是否启用双击关闭标签页功能 */
  ENABLE_DOUBLE_CLICK_CLOSE: "enable-double-click-close",
  /** 贴边隐藏功能开关 - 存储是否启用贴边隐藏功能 */
  ENABLE_EDGE_HIDE: "enable-edge-hide",
  /** 气泡模式开关 - 存储是否启用气泡模式（仅垂直模式可用） */
  ENABLE_BUBBLE_MODE: "enable-bubble-mode",
  /** 合并显示所有面板标签开关 - 存储是否启用合并标签栏模式 */
  ENABLE_MERGED_TAB_BAR: "enable-merged-tab-bar",
  /** 合并模式固定条目 - 存储各面板固定历史条目的 key 列表（panelId → keys） */
  MERGED_PINNED_ENTRIES: "merged-pinned-entries",
  /** 合并模式标题覆盖 - 存储各面板历史条目的自定义标题（panelId|key → title） */
  MERGED_TITLE_OVERRIDES: "merged-title-overrides"
}, L = {
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
class tt {
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
    } catch (r) {
      this.error(`???????????????????????? ${e}:`, r);
      try {
        if (typeof localStorage < "u")
          return localStorage.setItem(`${i}:${e}`, a), this.log(`Fallback save to localStorage for ${e}`), !0;
      } catch (n) {
        this.error(`localStorage ???????????? ${e}:`, n);
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
      const r = await orca.plugins.getData(t, e);
      if (r == null)
        return a;
      let n;
      if (typeof r == "string")
        try {
          n = JSON.parse(r);
        } catch {
          n = r;
        }
      else
        n = r;
      return this.log(`???? ?????????????????????${e}:`, n), n;
    } catch (r) {
      this.error(`???????????????????????? ${e}:`, r);
    }
    try {
      if (typeof localStorage < "u") {
        const r = localStorage.getItem(`${t}:${e}`);
        if (r == null)
          return a;
        try {
          return JSON.parse(r);
        } catch {
          return r;
        }
      }
    } catch (r) {
      this.error(`localStorage ???????????? ${e}:`, r);
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
      const r = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", r);
      const n = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(r) === JSON.stringify(n) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
function Q() {
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
function it(c, e, t = 200) {
  const i = e ? t : 400, a = 40, r = window.innerWidth - i, n = window.innerHeight - a;
  return {
    x: Math.max(0, Math.min(c.x, r)),
    y: Math.max(0, Math.min(c.y, n))
  };
}
function at(c) {
  const e = Q();
  return {
    isVerticalMode: c.isVerticalMode ?? e.isVerticalMode,
    verticalWidth: c.verticalWidth ?? e.verticalWidth,
    verticalPosition: c.verticalPosition ?? e.verticalPosition,
    horizontalPosition: c.horizontalPosition ?? e.horizontalPosition,
    isSidebarAlignmentEnabled: c.isSidebarAlignmentEnabled !== void 0 ? c.isSidebarAlignmentEnabled : e.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: c.isFloatingWindowVisible ?? e.isFloatingWindowVisible,
    showBlockTypeIcons: c.showBlockTypeIcons ?? e.showBlockTypeIcons,
    showInHeadbar: c.showInHeadbar ?? e.showInHeadbar,
    horizontalTabMaxWidth: c.horizontalTabMaxWidth ?? e.horizontalTabMaxWidth,
    horizontalTabMinWidth: c.horizontalTabMinWidth ?? e.horizontalTabMinWidth,
    enableEdgeHide: c.enableEdgeHide ?? e.enableEdgeHide,
    enableBubbleMode: c.enableBubbleMode ?? e.enableBubbleMode
  };
}
function ue(c, e, t) {
  return c ? { ...e } : { ...t };
}
function rt(c, e, t, i) {
  return e ? {
    verticalPosition: { ...c },
    horizontalPosition: { ...i }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...c }
  };
}
function nt(c) {
  return `布局模式: ${c.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${c.verticalWidth}px, 垂直位置: (${c.verticalPosition.x}, ${c.verticalPosition.y}), 水平位置: (${c.horizontalPosition.x}, ${c.horizontalPosition.y})`;
}
function ze(c, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${c.x}, ${c.y})`;
}
function z(c) {
  return !!(c.isViewPanel === !0 || c.blockType === "view" || typeof c.blockId == "string" && c.blockId.startsWith("view:"));
}
function ot(c) {
  const e = { ...c }, t = typeof e.blockId == "string" && e.blockId.startsWith("view:"), i = e.blockType === "view", a = e.isViewPanel === !0;
  return e.tabId || (e.tabId = K(e.blockId || "tab")), (t || i || a) && (e.isViewPanel = !0, e.blockType = "view"), e;
}
function U(c) {
  return Array.isArray(c) ? c.map(ot) : [];
}
function st(c, e, t = {}) {
  try {
    const {
      updateOrder: i = !0,
      saveData: a = !0,
      updateUI: r = !0
    } = t, n = e.findIndex((d) => d.blockId === c.blockId);
    if (n === -1)
      return {
        success: !1,
        message: `标签不存在: ${c.title}`
      };
    e[n].isPinned = !e[n].isPinned;
    const o = e[n].isPinned;
    i && ht(e);
    const s = e.findIndex((d) => d.blockId === c.blockId), l = o ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${c.title}" 已${l}`,
      data: { tab: e[s], tabIndex: s }
    };
  } catch (i) {
    return {
      success: !1,
      message: `切换固定状态失败: ${i}`
    };
  }
}
function ct(c, e, t, i = {}) {
  try {
    const {
      updateUI: a = !0,
      saveData: r = !0,
      validateData: n = !0
    } = i, o = t.findIndex((s) => s.blockId === c.blockId);
    if (o === -1)
      return {
        success: !1,
        message: `标签不存在: ${c.title}`
      };
    if (n) {
      const s = dt(e);
      if (!s.success)
        return s;
    }
    return t[o] = { ...t[o], ...e }, {
      success: !0,
      message: `标签 "${c.title}" 已更新`,
      data: { tab: t[o], tabIndex: o }
    };
  } catch (a) {
    return {
      success: !1,
      message: `更新标签失败: ${a}`
    };
  }
}
function lt(c, e, t, i = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : ct(c, { title: e.trim() }, t, i);
}
function dt(c) {
  return c.blockId !== void 0 && (!c.blockId || c.blockId.trim() === "") ? {
    success: !1,
    message: "标签块ID不能为空"
  } : c.title !== void 0 && (!c.title || c.title.trim() === "") ? {
    success: !1,
    message: "标签标题不能为空"
  } : c.order !== void 0 && (c.order < 0 || !Number.isInteger(c.order)) ? {
    success: !1,
    message: "标签顺序必须是正整数"
  } : {
    success: !0,
    message: "标签数据验证通过"
  };
}
function ht(c) {
  c.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function K(c) {
  const e = Date.now().toString(36), t = Math.random().toString(36).slice(2, 8);
  return `${c}-${e}-${t}`;
}
class ut {
  constructor(e, t, i) {
    v(this, "storageService");
    v(this, "pluginName");
    v(this, "log");
    v(this, "warn");
    v(this, "error");
    v(this, "verboseLog");
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
        const t = U(e);
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
        const i = U(t);
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
        const t = U(e);
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
          tabs: U(i.tabs || [])
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
      t = t.map((r) => ({
        ...r,
        tabs: U(r.tabs || [])
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
        const t = U(e);
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
  /**
   * 保存进入工作区前的面板布局
   */
  async saveLayoutBeforeWorkspace(e) {
    try {
      await this.storageService.saveConfig(C.LAYOUT_BEFORE_WORKSPACE, e, this.pluginName), this.log("📁 已保存进入工作区前的面板布局");
    } catch (t) {
      this.error("保存进入工作区前的面板布局失败:", t);
    }
  }
  /**
   * 加载进入工作区前的面板布局
   */
  async loadLayoutBeforeWorkspace() {
    try {
      const e = await this.storageService.getConfig(
        C.LAYOUT_BEFORE_WORKSPACE,
        this.pluginName
      );
      return e && e.panels ? (this.log("📁 已加载进入工作区前的面板布局"), e) : null;
    } catch (e) {
      return this.error("加载进入工作区前的面板布局失败:", e), null;
    }
  }
  /**
   * 清除进入工作区前的面板布局
   */
  async clearLayoutBeforeWorkspace() {
    try {
      await this.storageService.saveConfig(C.LAYOUT_BEFORE_WORKSPACE, null, this.pluginName), this.log("📁 已清除进入工作区前的面板布局");
    } catch (e) {
      this.error("清除进入工作区前的面板布局失败:", e);
    }
  }
  // ==================== 位置和布局配置 ====================
  /**
   * 保存位置信息
   */
  async savePosition(e, t, i, a) {
    try {
      const r = rt(
        e,
        t,
        i,
        a
      ), n = await this.restoreLayoutMode();
      return await this.saveLayoutMode({
        ...n,
        isVerticalMode: t,
        verticalPosition: r.verticalPosition,
        horizontalPosition: r.horizontalPosition
      }), this.log(`???? ??????????????? ${ze(e, t)}`), r;
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
        Q()
      ), t = {
        ...Q(),
        ...e
      };
      return this.log(`📂 恢复布局模式配置: ${t.isVerticalMode ? "垂直" : "水平"}`), t;
    } catch (e) {
      return this.warn("恢复布局模式配置失败:", e), Q();
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
   * 保存固定到编辑器顶部状态到API配置
   */
  async saveFixedToEditorTopMode(e) {
    try {
      await this.storageService.saveConfig(C.FIXED_TO_EDITOR_TOP, { isFixedToEditorTop: e }, this.pluginName), this.log(`💾 固定到编辑器顶部状态已保存: ${e ? "启用" : "禁用"}`);
    } catch (t) {
      this.error("保存固定到编辑器顶部状态失败:", t);
    }
  }
  /**
   * 恢复固定到编辑器顶部状态
   */
  async restoreFixedToEditorTopMode() {
    try {
      const e = await this.storageService.getConfig(
        C.FIXED_TO_EDITOR_TOP,
        this.pluginName,
        { isFixedToEditorTop: !1 }
      ), t = (e == null ? void 0 : e.isFixedToEditorTop) || !1;
      return this.log(`📂 恢复固定到编辑器顶部状态: ${t ? "启用" : "禁用"}`), t;
    } catch (e) {
      return this.warn("恢复固定到编辑器顶部状态失败:", e), !1;
    }
  }
  /**
   * 保存合并模式固定条目（panelId → 固定 key 列表）
   */
  async saveMergedPinnedEntries(e) {
    try {
      await this.storageService.saveConfig(C.MERGED_PINNED_ENTRIES, e, this.pluginName);
    } catch (t) {
      this.error("保存合并模式固定条目失败:", t);
    }
  }
  /**
   * 恢复合并模式固定条目
   */
  async restoreMergedPinnedEntries() {
    try {
      const e = await this.storageService.getConfig(
        C.MERGED_PINNED_ENTRIES,
        this.pluginName,
        {}
      );
      return e && typeof e == "object" && !Array.isArray(e) ? e : {};
    } catch (e) {
      return this.warn("恢复合并模式固定条目失败:", e), {};
    }
  }
  /**
   * 保存合并模式标题覆盖（panelId|key → 自定义标题）
   */
  async saveMergedTitleOverrides(e) {
    try {
      await this.storageService.saveConfig(C.MERGED_TITLE_OVERRIDES, e, this.pluginName);
    } catch (t) {
      this.error("保存合并模式标题覆盖失败:", t);
    }
  }
  /**
   * 恢复合并模式标题覆盖
   */
  async restoreMergedTitleOverrides() {
    try {
      const e = await this.storageService.getConfig(
        C.MERGED_TITLE_OVERRIDES,
        this.pluginName,
        {}
      );
      return e && typeof e == "object" && !Array.isArray(e) ? e : {};
    } catch (e) {
      return this.warn("恢复合并模式标题覆盖失败:", e), {};
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
            recentTabs: U(a.recentTabs || [])
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
        maxRecords: L.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS
        // 全局历史记录最大数量限制
      });
      const r = i[a];
      r.recentTabs = r.recentTabs.filter((n) => n.blockId !== t.blockId), r.recentTabs.unshift(t), r.recentTabs.length > r.maxRecords && (r.recentTabs = r.recentTabs.slice(0, r.maxRecords)), r.lastUpdated = Date.now(), await this.saveRecentTabSwitchHistory(i), this.verboseLog(`📝 更新全局切换历史: ${e} -> ${t.title} (历史记录数量: ${r.recentTabs.length})`);
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
        if (a.recentTabs.length > L.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS) {
          const r = a.recentTabs.length;
          a.recentTabs = a.recentTabs.slice(0, L.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS), a.maxRecords = L.GLOBAL_TAB_SWITCH_HISTORY_MAX_RECORDS, t += r - a.recentTabs.length, this.log(`🧹 清理历史记录 ${i}: ${r} -> ${a.recentTabs.length}`);
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
const Fe = 6048e5, bt = 864e5, Se = Symbol.for("constructDateFrom");
function A(c, e) {
  return typeof c == "function" ? c(e) : c && typeof c == "object" && Se in c ? c[Se](e) : c instanceof Date ? new c.constructor(e) : new Date(e);
}
function W(c, e) {
  return A(e || c, c);
}
function _e(c, e, t) {
  const i = W(c, t == null ? void 0 : t.in);
  return isNaN(e) ? A(c, NaN) : (e && i.setDate(i.getDate() + e), i);
}
let gt = {};
function he() {
  return gt;
}
function re(c, e) {
  var o, s, l, d;
  const t = he(), i = (e == null ? void 0 : e.weekStartsOn) ?? ((s = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : s.weekStartsOn) ?? t.weekStartsOn ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, a = W(c, e == null ? void 0 : e.in), r = a.getDay(), n = (r < i ? 7 : 0) + r - i;
  return a.setDate(a.getDate() - n), a.setHours(0, 0, 0, 0), a;
}
function se(c, e) {
  return re(c, { ...e, weekStartsOn: 1 });
}
function Re(c, e) {
  const t = W(c, e == null ? void 0 : e.in), i = t.getFullYear(), a = A(t, 0);
  a.setFullYear(i + 1, 0, 4), a.setHours(0, 0, 0, 0);
  const r = se(a), n = A(t, 0);
  n.setFullYear(i, 0, 4), n.setHours(0, 0, 0, 0);
  const o = se(n);
  return t.getTime() >= r.getTime() ? i + 1 : t.getTime() >= o.getTime() ? i : i - 1;
}
function $e(c) {
  const e = W(c), t = new Date(
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
  return t.setUTCFullYear(e.getFullYear()), +c - +t;
}
function Ue(c, ...e) {
  const t = A.bind(
    null,
    e.find((i) => typeof i == "object")
  );
  return e.map(t);
}
function ce(c, e) {
  const t = W(c, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function pt(c, e, t) {
  const [i, a] = Ue(
    t == null ? void 0 : t.in,
    c,
    e
  ), r = ce(i), n = ce(a), o = +r - $e(r), s = +n - $e(n);
  return Math.round((o - s) / bt);
}
function mt(c, e) {
  const t = Re(c, e), i = A(c, 0);
  return i.setFullYear(t, 0, 4), i.setHours(0, 0, 0, 0), se(i);
}
function Ee(c) {
  return A(c, Date.now());
}
function Ie(c, e, t) {
  const [i, a] = Ue(
    t == null ? void 0 : t.in,
    c,
    e
  );
  return +ce(i) == +ce(a);
}
function ft(c) {
  return c instanceof Date || typeof c == "object" && Object.prototype.toString.call(c) === "[object Date]";
}
function vt(c) {
  return !(!ft(c) && typeof c != "number" || isNaN(+W(c)));
}
function yt(c, e) {
  const t = W(c, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const xt = {
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
}, Tt = (c, e, t) => {
  let i;
  const a = xt[c];
  return typeof a == "string" ? i = a : e === 1 ? i = a.one : i = a.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + i : i + " ago" : i;
};
function be(c) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : c.defaultWidth;
    return c.formats[t] || c.formats[c.defaultWidth];
  };
}
const wt = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, kt = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Ct = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Et = {
  date: be({
    formats: wt,
    defaultWidth: "full"
  }),
  time: be({
    formats: kt,
    defaultWidth: "full"
  }),
  dateTime: be({
    formats: Ct,
    defaultWidth: "full"
  })
}, It = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Pt = (c, e, t, i) => It[c];
function te(c) {
  return (e, t) => {
    const i = t != null && t.context ? String(t.context) : "standalone";
    let a;
    if (i === "formatting" && c.formattingValues) {
      const n = c.defaultFormattingWidth || c.defaultWidth, o = t != null && t.width ? String(t.width) : n;
      a = c.formattingValues[o] || c.formattingValues[n];
    } else {
      const n = c.defaultWidth, o = t != null && t.width ? String(t.width) : c.defaultWidth;
      a = c.values[o] || c.values[n];
    }
    const r = c.argumentCallback ? c.argumentCallback(e) : e;
    return a[r];
  };
}
const St = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, $t = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Lt = {
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
}, Mt = {
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
}, Dt = {
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
}, Bt = {
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
}, At = (c, e) => {
  const t = Number(c), i = t % 100;
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
}, Wt = {
  ordinalNumber: At,
  era: te({
    values: St,
    defaultWidth: "wide"
  }),
  quarter: te({
    values: $t,
    defaultWidth: "wide",
    argumentCallback: (c) => c - 1
  }),
  month: te({
    values: Lt,
    defaultWidth: "wide"
  }),
  day: te({
    values: Mt,
    defaultWidth: "wide"
  }),
  dayPeriod: te({
    values: Dt,
    defaultWidth: "wide",
    formattingValues: Bt,
    defaultFormattingWidth: "wide"
  })
};
function ie(c) {
  return (e, t = {}) => {
    const i = t.width, a = i && c.matchPatterns[i] || c.matchPatterns[c.defaultMatchWidth], r = e.match(a);
    if (!r)
      return null;
    const n = r[0], o = i && c.parsePatterns[i] || c.parsePatterns[c.defaultParseWidth], s = Array.isArray(o) ? Ht(o, (h) => h.test(n)) : (
      // [TODO] -- I challenge you to fix the type
      Nt(o, (h) => h.test(n))
    );
    let l;
    l = c.valueCallback ? c.valueCallback(s) : s, l = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(l)
    ) : l;
    const d = e.slice(n.length);
    return { value: l, rest: d };
  };
}
function Nt(c, e) {
  for (const t in c)
    if (Object.prototype.hasOwnProperty.call(c, t) && e(c[t]))
      return t;
}
function Ht(c, e) {
  for (let t = 0; t < c.length; t++)
    if (e(c[t]))
      return t;
}
function Ot(c) {
  return (e, t = {}) => {
    const i = e.match(c.matchPattern);
    if (!i) return null;
    const a = i[0], r = e.match(c.parsePattern);
    if (!r) return null;
    let n = c.valueCallback ? c.valueCallback(r[0]) : r[0];
    n = t.valueCallback ? t.valueCallback(n) : n;
    const o = e.slice(a.length);
    return { value: n, rest: o };
  };
}
const zt = /^(\d+)(th|st|nd|rd)?/i, Ft = /\d+/i, _t = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Rt = {
  any: [/^b/i, /^(a|c)/i]
}, Ut = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Vt = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, qt = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, jt = {
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
}, Yt = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, Gt = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Xt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Kt = {
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
}, Jt = {
  ordinalNumber: Ot({
    matchPattern: zt,
    parsePattern: Ft,
    valueCallback: (c) => parseInt(c, 10)
  }),
  era: ie({
    matchPatterns: _t,
    defaultMatchWidth: "wide",
    parsePatterns: Rt,
    defaultParseWidth: "any"
  }),
  quarter: ie({
    matchPatterns: Ut,
    defaultMatchWidth: "wide",
    parsePatterns: Vt,
    defaultParseWidth: "any",
    valueCallback: (c) => c + 1
  }),
  month: ie({
    matchPatterns: qt,
    defaultMatchWidth: "wide",
    parsePatterns: jt,
    defaultParseWidth: "any"
  }),
  day: ie({
    matchPatterns: Yt,
    defaultMatchWidth: "wide",
    parsePatterns: Gt,
    defaultParseWidth: "any"
  }),
  dayPeriod: ie({
    matchPatterns: Xt,
    defaultMatchWidth: "any",
    parsePatterns: Kt,
    defaultParseWidth: "any"
  })
}, Zt = {
  code: "en-US",
  formatDistance: Tt,
  formatLong: Et,
  formatRelative: Pt,
  localize: Wt,
  match: Jt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Qt(c, e) {
  const t = W(c, e == null ? void 0 : e.in);
  return pt(t, yt(t)) + 1;
}
function ei(c, e) {
  const t = W(c, e == null ? void 0 : e.in), i = +se(t) - +mt(t);
  return Math.round(i / Fe) + 1;
}
function Ve(c, e) {
  var d, h, u, b;
  const t = W(c, e == null ? void 0 : e.in), i = t.getFullYear(), a = he(), r = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((h = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? a.firstWeekContainsDate ?? ((b = (u = a.locale) == null ? void 0 : u.options) == null ? void 0 : b.firstWeekContainsDate) ?? 1, n = A((e == null ? void 0 : e.in) || c, 0);
  n.setFullYear(i + 1, 0, r), n.setHours(0, 0, 0, 0);
  const o = re(n, e), s = A((e == null ? void 0 : e.in) || c, 0);
  s.setFullYear(i, 0, r), s.setHours(0, 0, 0, 0);
  const l = re(s, e);
  return +t >= +o ? i + 1 : +t >= +l ? i : i - 1;
}
function ti(c, e) {
  var o, s, l, d;
  const t = he(), i = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((s = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : s.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, a = Ve(c, e), r = A((e == null ? void 0 : e.in) || c, 0);
  return r.setFullYear(a, 0, i), r.setHours(0, 0, 0, 0), re(r, e);
}
function ii(c, e) {
  const t = W(c, e == null ? void 0 : e.in), i = +re(t, e) - +ti(t, e);
  return Math.round(i / Fe) + 1;
}
function P(c, e) {
  const t = c < 0 ? "-" : "", i = Math.abs(c).toString().padStart(e, "0");
  return t + i;
}
const F = {
  // Year
  y(c, e) {
    const t = c.getFullYear(), i = t > 0 ? t : 1 - t;
    return P(e === "yy" ? i % 100 : i, e.length);
  },
  // Month
  M(c, e) {
    const t = c.getMonth();
    return e === "M" ? String(t + 1) : P(t + 1, 2);
  },
  // Day of the month
  d(c, e) {
    return P(c.getDate(), e.length);
  },
  // AM or PM
  a(c, e) {
    const t = c.getHours() / 12 >= 1 ? "pm" : "am";
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
  h(c, e) {
    return P(c.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(c, e) {
    return P(c.getHours(), e.length);
  },
  // Minute
  m(c, e) {
    return P(c.getMinutes(), e.length);
  },
  // Second
  s(c, e) {
    return P(c.getSeconds(), e.length);
  },
  // Fraction of second
  S(c, e) {
    const t = e.length, i = c.getMilliseconds(), a = Math.trunc(
      i * Math.pow(10, t - 3)
    );
    return P(a, e.length);
  }
}, Y = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Le = {
  // Era
  G: function(c, e, t) {
    const i = c.getFullYear() > 0 ? 1 : 0;
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
  y: function(c, e, t) {
    if (e === "yo") {
      const i = c.getFullYear(), a = i > 0 ? i : 1 - i;
      return t.ordinalNumber(a, { unit: "year" });
    }
    return F.y(c, e);
  },
  // Local week-numbering year
  Y: function(c, e, t, i) {
    const a = Ve(c, i), r = a > 0 ? a : 1 - a;
    if (e === "YY") {
      const n = r % 100;
      return P(n, 2);
    }
    return e === "Yo" ? t.ordinalNumber(r, { unit: "year" }) : P(r, e.length);
  },
  // ISO week-numbering year
  R: function(c, e) {
    const t = Re(c);
    return P(t, e.length);
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
  u: function(c, e) {
    const t = c.getFullYear();
    return P(t, e.length);
  },
  // Quarter
  Q: function(c, e, t) {
    const i = Math.ceil((c.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(i);
      case "QQ":
        return P(i, 2);
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
  q: function(c, e, t) {
    const i = Math.ceil((c.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(i);
      case "qq":
        return P(i, 2);
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
  M: function(c, e, t) {
    const i = c.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return F.M(c, e);
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
  L: function(c, e, t) {
    const i = c.getMonth();
    switch (e) {
      case "L":
        return String(i + 1);
      case "LL":
        return P(i + 1, 2);
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
  w: function(c, e, t, i) {
    const a = ii(c, i);
    return e === "wo" ? t.ordinalNumber(a, { unit: "week" }) : P(a, e.length);
  },
  // ISO week of year
  I: function(c, e, t) {
    const i = ei(c);
    return e === "Io" ? t.ordinalNumber(i, { unit: "week" }) : P(i, e.length);
  },
  // Day of the month
  d: function(c, e, t) {
    return e === "do" ? t.ordinalNumber(c.getDate(), { unit: "date" }) : F.d(c, e);
  },
  // Day of year
  D: function(c, e, t) {
    const i = Qt(c);
    return e === "Do" ? t.ordinalNumber(i, { unit: "dayOfYear" }) : P(i, e.length);
  },
  // Day of week
  E: function(c, e, t) {
    const i = c.getDay();
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
  e: function(c, e, t, i) {
    const a = c.getDay(), r = (a - i.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(r);
      case "ee":
        return P(r, 2);
      case "eo":
        return t.ordinalNumber(r, { unit: "day" });
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
  c: function(c, e, t, i) {
    const a = c.getDay(), r = (a - i.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(r);
      case "cc":
        return P(r, e.length);
      case "co":
        return t.ordinalNumber(r, { unit: "day" });
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
  i: function(c, e, t) {
    const i = c.getDay(), a = i === 0 ? 7 : i;
    switch (e) {
      case "i":
        return String(a);
      case "ii":
        return P(a, e.length);
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
  a: function(c, e, t) {
    const a = c.getHours() / 12 >= 1 ? "pm" : "am";
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
  b: function(c, e, t) {
    const i = c.getHours();
    let a;
    switch (i === 12 ? a = Y.noon : i === 0 ? a = Y.midnight : a = i / 12 >= 1 ? "pm" : "am", e) {
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
  B: function(c, e, t) {
    const i = c.getHours();
    let a;
    switch (i >= 17 ? a = Y.evening : i >= 12 ? a = Y.afternoon : i >= 4 ? a = Y.morning : a = Y.night, e) {
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
  h: function(c, e, t) {
    if (e === "ho") {
      let i = c.getHours() % 12;
      return i === 0 && (i = 12), t.ordinalNumber(i, { unit: "hour" });
    }
    return F.h(c, e);
  },
  // Hour [0-23]
  H: function(c, e, t) {
    return e === "Ho" ? t.ordinalNumber(c.getHours(), { unit: "hour" }) : F.H(c, e);
  },
  // Hour [0-11]
  K: function(c, e, t) {
    const i = c.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(i, { unit: "hour" }) : P(i, e.length);
  },
  // Hour [1-24]
  k: function(c, e, t) {
    let i = c.getHours();
    return i === 0 && (i = 24), e === "ko" ? t.ordinalNumber(i, { unit: "hour" }) : P(i, e.length);
  },
  // Minute
  m: function(c, e, t) {
    return e === "mo" ? t.ordinalNumber(c.getMinutes(), { unit: "minute" }) : F.m(c, e);
  },
  // Second
  s: function(c, e, t) {
    return e === "so" ? t.ordinalNumber(c.getSeconds(), { unit: "second" }) : F.s(c, e);
  },
  // Fraction of second
  S: function(c, e) {
    return F.S(c, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(c, e, t) {
    const i = c.getTimezoneOffset();
    if (i === 0)
      return "Z";
    switch (e) {
      case "X":
        return De(i);
      case "XXXX":
      case "XX":
        return q(i);
      case "XXXXX":
      case "XXX":
      default:
        return q(i, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(c, e, t) {
    const i = c.getTimezoneOffset();
    switch (e) {
      case "x":
        return De(i);
      case "xxxx":
      case "xx":
        return q(i);
      case "xxxxx":
      case "xxx":
      default:
        return q(i, ":");
    }
  },
  // Timezone (GMT)
  O: function(c, e, t) {
    const i = c.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + Me(i, ":");
      case "OOOO":
      default:
        return "GMT" + q(i, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(c, e, t) {
    const i = c.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + Me(i, ":");
      case "zzzz":
      default:
        return "GMT" + q(i, ":");
    }
  },
  // Seconds timestamp
  t: function(c, e, t) {
    const i = Math.trunc(+c / 1e3);
    return P(i, e.length);
  },
  // Milliseconds timestamp
  T: function(c, e, t) {
    return P(+c, e.length);
  }
};
function Me(c, e = "") {
  const t = c > 0 ? "-" : "+", i = Math.abs(c), a = Math.trunc(i / 60), r = i % 60;
  return r === 0 ? t + String(a) : t + String(a) + e + P(r, 2);
}
function De(c, e) {
  return c % 60 === 0 ? (c > 0 ? "-" : "+") + P(Math.abs(c) / 60, 2) : q(c, e);
}
function q(c, e = "") {
  const t = c > 0 ? "-" : "+", i = Math.abs(c), a = P(Math.trunc(i / 60), 2), r = P(i % 60, 2);
  return t + a + e + r;
}
const Be = (c, e) => {
  switch (c) {
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
}, qe = (c, e) => {
  switch (c) {
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
}, ai = (c, e) => {
  const t = c.match(/(P+)(p+)?/) || [], i = t[1], a = t[2];
  if (!a)
    return Be(c, e);
  let r;
  switch (i) {
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
  return r.replace("{{date}}", Be(i, e)).replace("{{time}}", qe(a, e));
}, ri = {
  p: qe,
  P: ai
}, ni = /^D+$/, oi = /^Y+$/, si = ["D", "DD", "YY", "YYYY"];
function ci(c) {
  return ni.test(c);
}
function li(c) {
  return oi.test(c);
}
function di(c, e, t) {
  const i = hi(c, e, t);
  if (console.warn(i), si.includes(c)) throw new RangeError(i);
}
function hi(c, e, t) {
  const i = c[0] === "Y" ? "years" : "days of the month";
  return `Use \`${c.toLowerCase()}\` instead of \`${c}\` (in \`${e}\`) for formatting ${i} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const ui = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, bi = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, gi = /^'([^]*?)'?$/, pi = /''/g, mi = /[a-zA-Z]/;
function R(c, e, t) {
  var d, h, u, b;
  const i = he(), a = i.locale ?? Zt, r = i.firstWeekContainsDate ?? ((h = (d = i.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, n = i.weekStartsOn ?? ((b = (u = i.locale) == null ? void 0 : u.options) == null ? void 0 : b.weekStartsOn) ?? 0, o = W(c, t == null ? void 0 : t.in);
  if (!vt(o))
    throw new RangeError("Invalid time value");
  let s = e.match(bi).map((g) => {
    const m = g[0];
    if (m === "p" || m === "P") {
      const p = ri[m];
      return p(g, a.formatLong);
    }
    return g;
  }).join("").match(ui).map((g) => {
    if (g === "''")
      return { isToken: !1, value: "'" };
    const m = g[0];
    if (m === "'")
      return { isToken: !1, value: fi(g) };
    if (Le[m])
      return { isToken: !0, value: g };
    if (m.match(mi))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: g };
  });
  a.localize.preprocessor && (s = a.localize.preprocessor(o, s));
  const l = {
    firstWeekContainsDate: r,
    weekStartsOn: n,
    locale: a
  };
  return s.map((g) => {
    if (!g.isToken) return g.value;
    const m = g.value;
    (li(m) || ci(m)) && di(m, e, String(c));
    const p = Le[m[0]];
    return p(o, m, a.localize, l);
  }).join("");
}
function fi(c) {
  const e = c.match(gi);
  return e ? e[1].replace(pi, "'") : c;
}
function vi(c, e) {
  return Ie(
    A(c, c),
    Ee(c)
  );
}
function yi(c, e) {
  return Ie(
    c,
    _e(Ee(c), 1),
    e
  );
}
function xi(c, e, t) {
  return _e(c, -1, t);
}
function Ti(c, e) {
  return Ie(
    A(c, c),
    xi(Ee(c))
  );
}
function ge(c) {
  try {
    let e = orca.state.settings[He.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), vi(c))
      return "今天";
    if (Ti(c))
      return "昨天";
    if (yi(c))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const i = c.getDay(), r = ["日", "一", "二", "三", "四", "五", "六"][i], n = e.replace(/E/g, r);
          return R(c, n);
        } else
          return R(c, e);
      else
        return R(c, e);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const a of i)
        try {
          return R(c, a);
        } catch {
          continue;
        }
      return c.toLocaleDateString();
    }
  } catch {
    return c.toLocaleDateString();
  }
}
function je(c) {
  try {
    const e = ye(c, "_repr");
    if (!e || e.type !== Oe.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch {
    return null;
  }
}
async function pe(c) {
  try {
    if (je(c))
      return "journal";
    if (c["data-type"]) {
      const i = c["data-type"];
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
    if (c.aliases && c.aliases.length > 0 && c.aliases[0])
      try {
        const a = ye(c, "_hide");
        return a && a.value ? "page" : "tag";
      } catch {
        return "tag";
      }
    const t = ye(c, "_repr");
    if (t && t.type === Oe.JSON && t.value)
      try {
        const i = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
        if (i.type)
          return i.type;
      } catch {
      }
    if (c.content && Array.isArray(c.content)) {
      if (c.content.some(
        (o) => o && typeof o == "object" && o.type === "code"
      ))
        return "code";
      if (c.content.some(
        (o) => o && typeof o == "object" && o.type === "table"
      ))
        return "table";
      if (c.content.some(
        (o) => o && typeof o == "object" && o.type === "image"
      ))
        return "image";
      if (c.content.some(
        (o) => o && typeof o == "object" && o.type === "link"
      ))
        return "link";
    }
    if (c.text) {
      const i = c.text.trim();
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
function G(c, e) {
  if (c === "heading" && typeof e == "number" && e >= 1 && e <= 6)
    return `ti ti-h-${e}`;
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
    ol: "ti ti-list-numbers",
    // 有序列表
    ul: "ti ti-list",
    // 无序列表
    quote: "ti ti-quote",
    // 引用
    quote2: "ti ti-blockquote",
    // 引用（嵌套）
    text: "ti ti-cube",
    // 普通文本
    block: "ti ti-square",
    // 块
    task: "ti ti-checkbox",
    // 任务
    math: "ti ti-math",
    // 数学公式
    query: "ti ti-zoom-question",
    // 查询
    query2: "ti ti-zoom-question",
    // 查询（嵌套）
    mermaid: "ti ti-chart-bar",
    // Mermaid 图表
    whiteboard: "ti ti-chalkboard",
    // 白板
    pdf: "ti ti-pdf",
    // PDF
    epub: "ti ti-book",
    // EPUB
    hr: "ti ti-separator",
    // 分隔线
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
    video: "ti ti-movie",
    // 视频
    movie: "ti ti-movie",
    // 视频（别名）
    audio: "ti ti-volume",
    // 音频
    document: "ti ti-file",
    // 文档
    spreadsheet: "ti ti-file-spreadsheet",
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
  let i = t[c];
  if (!i) {
    const a = wi(c);
    a && (i = a);
  }
  return i || (i = t.default), i;
}
function wi(c) {
  const e = c.toLowerCase(), t = {
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
function ye(c, e) {
  return !c.properties || !Array.isArray(c.properties) ? null : c.properties.find((t) => t.name === e);
}
function ki(c) {
  if (!Array.isArray(c) || c.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const i of c)
    i && typeof i == "object" && (i.t === "text" && i.v ? e++ : i.t === "ref" && i.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function Ci(c) {
  if (!c || c.length === 0) return "";
  let e = "";
  for (const t of c)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
let oe = !0;
function Ei(c) {
  oe = c;
}
function ee(c) {
  if (!c) return !0;
  if (c.classList && (c.classList.contains("orca-hideable-hidden") || c.id === "sidebar"))
    return oe && console.debug("[ContentVisibilityHelper] 跳过操作：已知隐藏元素", c), !0;
  let e = c.parentElement;
  for (; e && e !== document.body; ) {
    if (e.classList && (e.classList.contains("orca-hideable-hidden") || e.id === "sidebar"))
      return oe && console.debug("[ContentVisibilityHelper] 跳过操作：父元素为已知隐藏元素", e), !0;
    e = e.parentElement;
  }
  try {
    const t = window.getComputedStyle(c);
    return t.getPropertyValue("content-visibility") === "hidden" ? (oe && console.debug("[ContentVisibilityHelper] 跳过操作：元素有 content-visibility: hidden", c), !0) : t.getPropertyValue("display") === "none" || t.getPropertyValue("visibility") === "hidden" || t.getPropertyValue("opacity") === "0";
  } catch {
    return !1;
  }
}
function Ye(c, e) {
  if (!c || ee(c))
    return !1;
  try {
    return c.style.cssText = e, !0;
  } catch {
    return !1;
  }
}
function Pe(c) {
  if (!c || c.classList && (c.classList.contains("orca-hideable-hidden") || c.id === "sidebar"))
    return null;
  let e = c.parentElement;
  for (; e && e !== document.body; ) {
    if (e.classList && (e.classList.contains("orca-hideable-hidden") || e.id === "sidebar"))
      return null;
    e = e.parentElement;
  }
  try {
    const t = window.getComputedStyle(c);
    return t.getPropertyValue("content-visibility") === "hidden" || t.getPropertyValue("display") === "none" ? null : t;
  } catch {
    return null;
  }
}
function Ii(c) {
  const e = Pe(c);
  if (!e)
    return null;
  try {
    const t = parseFloat(e.left), i = parseFloat(e.top);
    return { left: t, top: i };
  } catch {
    return null;
  }
}
function N(c, e) {
  if (ee(c))
    return console.debug("[ContentVisibilityHelper] 安全阻止了可能触发渲染警告的操作", c), !1;
  try {
    const t = Pe(c);
    return !t || t.getPropertyValue("content-visibility") === "hidden" ? (console.debug("[ContentVisibilityHelper] 二次检查发现隐藏元素，阻止操作", c), !1) : (e(), !0);
  } catch (t) {
    return console.debug("[ContentVisibilityHelper] 渲染操作失败:", t), !1;
  }
}
function Pi(c, e, t, i) {
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
  const r = document.createElement("i");
  r.className = e, r.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const n = document.createElement("span");
  if (n.textContent = c, n.style.cssText = `
    flex: 1;
    color: var(--orca-color-text-1);
  `, a.appendChild(r), a.appendChild(n), t && t.trim() !== "") {
    const o = document.createElement("span");
    o.textContent = t, o.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, a.appendChild(o);
  }
  return a.addEventListener("mouseenter", () => {
    a.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), a.addEventListener("mouseleave", () => {
    a.style.backgroundColor = "transparent";
  }), a.addEventListener("click", (o) => {
    o.preventDefault(), o.stopPropagation(), i();
    const s = a.closest('.orca-context-menu, .context-menu, [role="menu"]');
    s && (s.style.display = "none", s.remove());
  }), a;
}
function Si(c, e, t) {
  c.addEventListener("mouseenter", () => {
    c.style.cssText += e;
  }), c.addEventListener("mouseleave", () => {
    c.style.cssText = t;
  });
}
function Ge(c) {
  c && c.parentNode && c.parentNode.removeChild(c);
}
function $i(c, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
  if (t) {
    const i = parseInt(t[1], 16), a = parseInt(t[2], 16), r = parseInt(t[3], 16);
    return `rgba(${i}, ${a}, ${r}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function Ae(c, e, t, i, a) {
  let r = "var(--orca-tab-bg)", n = "var(--orca-color-text-1)", o = "normal", s = "";
  if (c.color)
    try {
      s = `--tab-color: ${c.color.startsWith("#") ? c.color : `#${c.color}`};`, r = "var(--orca-tab-colored-bg)", n = "var(--orca-tab-colored-text)", o = "600";
    } catch {
    }
  return e ? `
    ${s}
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
    ${s}
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
function Li() {
  const c = document.createElement("div");
  return c.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, c;
}
function Mi(c) {
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
  `, c.startsWith("ti ti-")) {
    const t = document.createElement("i");
    t.className = c, e.appendChild(t);
  } else
    e.textContent = c;
  return e;
}
function Di(c) {
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
  `, t.textContent = c, e.appendChild(t), requestAnimationFrame(() => {
    if (!ee(e)) {
      const i = e.offsetWidth;
      t.scrollWidth > i && (t.style.mask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.webkitMask = "linear-gradient(to right, black 0%, black 87%, transparent 100%)", t.style.maskSize = "100% 100%", t.style.webkitMaskSize = "100% 100%", t.style.maskRepeat = "no-repeat", t.style.webkitMaskRepeat = "no-repeat");
    }
  }), e;
}
function me() {
  const c = document.createElement("span");
  return c.textContent = "📌", c.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, c;
}
function Bi() {
  const c = document.createElement("div");
  return c.className = "tab-close-btn", c.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>', c;
}
function X(c, e, t = 180, i = 200) {
  const a = window.innerWidth, r = window.innerHeight, n = 10;
  let o = c, s = e;
  return o + t > a - n && (o = a - t - n), s + i > r - n && (s = r - i - n, s < e - i && (s = e - i - 5)), o < n && (o = n), s < n && (s = e + 5), o = Math.max(n, Math.min(o, a - t - n)), s = Math.max(n, Math.min(s, r - i - n)), { x: o, y: s };
}
function Xe() {
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
function le(c = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[c];
}
function xe() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function ae(c, e, t, i, a, r, n, o) {
  return c && n ? o ? `
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
      ` : c ? `
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
var M = /* @__PURE__ */ ((c) => (c[c.ERROR = 0] = "ERROR", c[c.WARN = 1] = "WARN", c[c.INFO = 2] = "INFO", c[c.DEBUG = 3] = "DEBUG", c[c.VERBOSE = 4] = "VERBOSE", c))(M || {});
const Ke = 1, Z = class Z {
  /**
   * 设置当前日志级别
   */
  static setLogLevel(e) {
    Z.currentLogLevel = e;
  }
  /**
   * 获取当前日志级别
   */
  static getLogLevel() {
    return Z.currentLogLevel;
  }
  /**
   * 检查是否应该输出指定级别的日志
   */
  static shouldLog(e) {
    return Z.currentLogLevel >= e;
  }
};
v(Z, "currentLogLevel", Ke);
let j = Z;
function fe(c, ...e) {
  j.shouldLog(
    2
    /* INFO */
  ) && console.info("[OrcaPlugin]", c, ...e);
}
function Ai(c, ...e) {
  j.shouldLog(
    0
    /* ERROR */
  ) && console.error("[OrcaPlugin]", c, ...e);
}
function Wi(c, ...e) {
  j.shouldLog(
    1
    /* WARN */
  ) && console.warn("[OrcaPlugin]", c, ...e);
}
function V(c, ...e) {
  j.shouldLog(
    4
    /* VERBOSE */
  ) && console.log("[OrcaPlugin]", c, ...e);
}
function Ni(c, e, t, i, a, r) {
  const n = document.createElement("div");
  n.className = c ? "orca-tabs-plugin orca-tabs-container vertical" : "orca-tabs-plugin orca-tabs-container";
  const o = ae(
    c,
    e,
    i,
    t,
    void 0,
    void 0,
    a,
    r
  );
  return Ye(n, o), n;
}
function Hi(c, e, t) {
  const i = document.createElement("div");
  return i.className = "feature-toggle-button", i.innerHTML = e ? "🔒" : "🔓", i.title = e ? "中键固定/双击关闭 (已启用)" : "中键固定/双击关闭 (已禁用)", Ye(i, c ? `
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
function Oi(c, e, t) {
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
    max-height: ${c.maxDisplayCount * 32 + 8}px;
    width: ${c.maxWidth || 150}px;
    overflow: hidden;
    pointer-events: auto;
    transition: opacity 0.2s ease, transform 0.2s ease;
    opacity: 0;
    transform: translateY(-10px);
  `;
  i.style.cssText = a;
  const r = document.createElement("div");
  r.className = "hover-tab-list-scroll", r.style.cssText = `
    overflow-y: auto;
    overflow-x: hidden;
    max-height: ${c.maxDisplayCount * 32}px;
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
  return i.appendChild(r), requestAnimationFrame(() => {
    i.style.opacity = "1", i.style.transform = "translateY(0)";
  }), i;
}
function zi(c, e, t, i, a) {
  const r = document.createElement("div");
  r.className = "hover-tab-item", r.setAttribute("data-orca-tabs-tab-id", c.tabId || c.blockId);
  const n = t.maxDisplayCount - 1, o = Math.max(t.minOpacity, 1 - e / n * (1 - t.minOpacity)), s = Math.max(t.minScale, 1 - e / n * (1 - t.minScale)), l = `
    display: flex;
    align-items: center;
    padding: 6px 8px;
    margin: 2px 0;
    border-radius: var(--orca-radius-sm, 4px);
    cursor: pointer;
    transition: all ${t.animationDuration}ms ease;
    opacity: ${o};
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
  r.style.cssText = l;
  const d = document.createElement("div");
  if (d.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0;
  `, c.icon) {
    const u = document.createElement("span");
    c.icon.includes(" ") || c.icon.startsWith("ti-") ? u.className = c.icon : u.textContent = c.icon, u.style.cssText = `
      margin-right: 6px;
      font-size: 12px;
      flex-shrink: 0;
    `, d.appendChild(u);
  }
  const h = document.createElement("span");
  return h.textContent = c.title, h.style.cssText = `
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `, d.appendChild(h), r.appendChild(d), r.addEventListener("click", (u) => {
    u.stopPropagation(), i(c);
  }), r.addEventListener("mouseenter", () => {
    r.style.background = "var(--orca-bg-hover, rgba(0, 0, 0, 0.05))", r.style.transform = `scale(${Math.min(1, s + 0.05)})`;
  }), r.addEventListener("mouseleave", () => {
    r.style.background = "transparent", r.style.transform = `scale(${s})`;
  }), r;
}
function Te(c, e, t, i, a, r = 0) {
  const n = c.querySelector(".hover-tab-list-scroll");
  if (!n) return;
  n.innerHTML = "";
  const o = r, s = Math.min(o + t.maxDisplayCount, e.length);
  e.slice(o, s).forEach((d, h) => {
    const u = zi(d, h, t, i);
    n.appendChild(u);
  }), r > 0 && (n.scrollTop = r * 32);
}
function ve(c, e, t, i, a) {
  V("🎨 showHoverTabList 被调用", { tabs: c.length, position: e, config: t });
  const r = document.querySelector(".hover-tab-list-container");
  r && (V("🗑️ 移除现有的悬浮列表"), Ge(r)), V("🏗️ 创建新容器");
  const n = Oi(t, e);
  return V("📦 容器创建完成", n), document.body && N(document.body, () => {
    document.body.appendChild(n);
  }), V("📄 容器已添加到页面"), V("🔄 更新内容"), Te(n, c, t, i), V("✅ 内容更新完成"), n;
}
function D() {
  const c = document.querySelector(".hover-tab-list-container");
  c && (c.style.opacity = "0", c.style.transform = "translateY(-10px)", setTimeout(() => {
    Ge(c);
  }, 200));
}
const we = /* @__PURE__ */ new WeakMap();
function B(c, e) {
  if (!c || !e.text)
    return;
  let t = null, i = null;
  const a = (s) => {
    i = setTimeout(() => {
      if (!c.isConnected || !document.body.contains(c))
        return;
      const l = c.getBoundingClientRect();
      !l || l.width === 0 || l.height === 0 || l.top === 0 && l.left === 0 && l.bottom === 0 && l.right === 0 || (t || (t = document.createElement("div"), t.className = `orca-tooltip ${e.className || ""}`, (e.shortcut ? `${e.text} (${e.shortcut})` : e.text).split(`
`).forEach((h, u) => {
        u > 0 && t.appendChild(document.createElement("br")), t.appendChild(document.createTextNode(h));
      }), t.style.cssText = `
          position: absolute;
          opacity: 0;
          z-index: 10000;
          pointer-events: none;
        `, document.body.appendChild(t)), t.style.opacity = "1", t.style.visibility = "hidden", requestAnimationFrame(() => {
        if (!t || !t.parentNode) return;
        const d = t.getBoundingClientRect();
        if (!d || d.width === 0 || d.height === 0) {
          r();
          return;
        }
        let h = 0, u = 0, b = e.defaultPlacement || "top";
        const g = window.innerWidth, m = window.innerHeight, p = 8, f = (w) => {
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
          return x >= p && x + d.width <= g - p && T >= p && T + d.height <= m - p;
        };
        if (y(b)) {
          const w = f(b);
          h = w.x, u = w.y;
        } else {
          const w = b === "bottom" ? ["top", "left", "right"] : b === "top" ? ["bottom", "left", "right"] : b === "left" ? ["right", "top", "bottom"] : ["left", "top", "bottom"];
          let x = !1;
          for (const T of w)
            if (y(T)) {
              const E = f(T);
              h = E.x, u = E.y, b = T, x = !0;
              break;
            }
          if (!x) {
            const T = f(b);
            h = T.x, u = T.y;
          }
        }
        if (h < p ? h = p : h + d.width > g - p && (h = g - d.width - p), u < p ? u = p : u + d.height > m - p && (u = m - d.height - p), d.width > g - 2 * p && (h = p, t.style.maxWidth = `${g - 2 * p}px`), isNaN(h) || isNaN(u) || !isFinite(h) || !isFinite(u)) {
          console.warn("[Tooltip] Invalid position calculated, hiding tooltip"), r();
          return;
        }
        h = Math.max(0, h), u = Math.max(0, u), t.style.left = `${h}px`, t.style.top = `${u}px`, t.style.visibility = "visible";
      }));
    }, e.delay || 500);
  }, r = () => {
    var s;
    if (i && (clearTimeout(i), i = null), t) {
      try {
        t.parentNode && t.parentNode.removeChild(t);
      } catch (l) {
        console.warn("Tooltip removal failed, trying alternative method:", l), (s = t.remove) == null || s.call(t);
      }
      t = null;
    }
  }, n = (s) => {
    if (t && t.parentNode) {
      const l = c.getBoundingClientRect();
      (s.clientX < l.left - 10 || s.clientX > l.right + 10 || s.clientY < l.top - 10 || s.clientY > l.bottom + 10) && r();
    }
  };
  c.addEventListener("mouseenter", a), c.addEventListener("mouseleave", r), c.addEventListener("mousedown", r), c.addEventListener("mousemove", n);
  const o = () => {
    var s;
    if (i && clearTimeout(i), c.removeEventListener("mouseenter", a), c.removeEventListener("mouseleave", r), c.removeEventListener("mousedown", r), c.removeEventListener("mousemove", n), t) {
      try {
        t.parentNode && t.parentNode.removeChild(t);
      } catch (l) {
        console.warn("Tooltip cleanup failed, trying alternative method:", l), (s = t.remove) == null || s.call(t);
      }
      t = null;
    }
  };
  we.set(c, o);
}
function Fi(c) {
  const e = we.get(c);
  e && (e(), we.delete(c));
}
function J(c, e) {
  return {
    text: c,
    shortcut: e,
    delay: 200,
    defaultPlacement: "bottom"
    // 按钮tooltip默认显示在下方
  };
}
function ke(c) {
  let e = c.title || "未命名标签页";
  const t = [];
  return c.blockId && t.push(`ID: ${c.blockId}`), c.blockType && t.push(`类型: ${c.blockType}`), c.isPinned && t.push("📌 已固定"), c.isJournal && t.push("📝 日志块"), t.length > 0 && (e += `
` + t.join(" | ")), {
    text: e,
    delay: 300,
    defaultPlacement: "bottom"
    // 标签页 tooltip 默认显示在下方
  };
}
function Ce(c) {
  return {
    text: c,
    delay: 500,
    defaultPlacement: "bottom"
    // 状态tooltip默认显示在下方
  };
}
function _i() {
  document.querySelectorAll('[data-tooltip="true"]').forEach((e, t) => {
    const i = e.getAttribute("data-tooltip-text"), a = e.getAttribute("data-tooltip-shortcut"), r = e.getAttribute("data-tooltip-delay");
    if (i) {
      const n = {
        text: i,
        shortcut: a || void 0,
        delay: r ? parseInt(r) : void 0
      };
      B(e, n);
    }
  });
}
function ne() {
  document.querySelectorAll(".orca-tooltip").forEach((i) => {
    var a;
    try {
      i.parentNode ? i.parentNode.removeChild(i) : (a = i.remove) == null || a.call(i);
    } catch (r) {
      console.warn("Failed to remove tooltip:", r);
    }
  }), document.querySelectorAll(".tooltip").forEach((i) => {
    var a;
    try {
      i.parentNode ? i.parentNode.removeChild(i) : (a = i.remove) == null || a.call(i);
    } catch (r) {
      console.warn("Failed to remove tooltip:", r);
    }
  }), document.querySelectorAll('[style*="position: absolute"]').forEach((i) => {
    var l;
    const a = Ii(i);
    if (!a)
      return;
    const r = Pe(i);
    if (!r)
      return;
    const n = a.left, o = a.top;
    if (parseInt(r.zIndex) >= 1e4 && n < 20 && o < 20 && (i.classList.contains("orca-tooltip") || i.classList.contains("tooltip")))
      try {
        i.parentNode ? i.parentNode.removeChild(i) : (l = i.remove) == null || l.call(i), console.log("[Tooltip] Cleaned up suspicious tooltip at top-left corner");
      } catch (d) {
        console.warn("Failed to remove suspicious tooltip:", d);
      }
  });
}
function Je() {
  setInterval(() => {
    ne();
  }, 3e4);
}
function Ze() {
  window.addEventListener("beforeunload", () => {
    ne();
  }), document.addEventListener("visibilitychange", () => {
    document.visibilityState === "hidden" && ne();
  });
}
typeof window < "u" && (window.addTooltip = B, window.removeTooltip = Fi, window.createButtonTooltip = J, window.createTabTooltip = ke, window.createStatusTooltip = Ce, window.cleanupAllTooltips = ne, window.startTooltipCleanupTimer = Je, window.setupPageUnloadCleanup = Ze);
function Ri(c) {
  for (let e = c.length - 1; e >= 0; e--)
    if (!c[e].isPinned)
      return e;
  return -1;
}
function Ui(c) {
  return [...c].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function Vi(c, e, t, i) {
  return e ? {
    x: c.x,
    y: c.y,
    width: t,
    height: i
  } : {
    x: c.x,
    y: c.y,
    width: Math.min(800, window.innerWidth - c.x - 10),
    height: 28
  };
}
function qi(c, e, t, i) {
  const a = Vi(c, e, t, i);
  let r = c.x, n = c.y;
  return a.x < 0 ? r = 0 : a.x + a.width > window.innerWidth && (r = window.innerWidth - a.width), a.y < 0 ? n = 0 : a.y + a.height > window.innerHeight && (n = window.innerHeight - a.height), { x: r, y: n };
}
function We(c, e, t = !1) {
  let i = null;
  const a = (...r) => {
    const n = t && !i;
    i && clearTimeout(i), i = window.setTimeout(() => {
      i = null, t || c(...r);
    }, e), n && c(...r);
  };
  return a.cancel = () => {
    i && (clearTimeout(i), i = null);
  }, a;
}
function ji(c, e, t) {
  var i, a;
  try {
    const r = c.startsWith("#") ? c : `#${c}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(r))
      return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const n = parseInt(r.slice(1, 3), 16), o = parseInt(r.slice(3, 5), 16), s = parseInt(r.slice(5, 7), 16), l = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((a = (i = window.orca) == null ? void 0 : i.state) == null ? void 0 : a.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${n}, ${o}, ${s}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${n}, ${o}, ${s}) calc(l * 1.05) c h)` : `oklch(from rgb(${n}, ${o}, ${s}) calc(l * 0.6) c h)`;
  } catch {
    return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
function Ne(c, e, t, i) {
  if (typeof e == "number" && typeof t == "function")
    return Yi(c, e, t, i);
  if (typeof e == "function" && typeof t == "function")
    return Gi(c, e, t);
  throw new Error("Invalid parameters for createWidthAdjustmentDialog");
}
function Yi(c, e, t, i) {
  const a = document.createElement("div");
  a.className = "width-adjustment-dialog";
  const r = Xe();
  a.style.cssText = r;
  const n = document.createElement("div");
  n.className = "dialog-title", n.textContent = "调整标签宽度", a.appendChild(n);
  const o = document.createElement("div");
  o.className = "dialog-slider-container", o.style.cssText = `
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
  l.type = "range", l.min = "80", l.max = "200", l.value = c.toString(), l.style.cssText = xe();
  const d = document.createElement("div");
  d.className = "dialog-width-display", d.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: var(--orca-color-text-1);
  `, d.textContent = `最大宽度: ${c}px`;
  const h = document.createElement("div");
  h.className = "dialog-slider-container", h.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const u = document.createElement("div");
  u.textContent = "最小宽度 (60px - 150px)", u.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: var(--orca-color-text-1);
  `;
  const b = document.createElement("input");
  b.type = "range", b.min = "60", b.max = "150", b.value = e.toString(), b.style.cssText = xe();
  const g = document.createElement("div");
  g.className = "dialog-width-display", g.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: var(--orca-color-text-1);
  `, g.textContent = `最小宽度: ${e}px`;
  let m = null;
  const p = (x, T) => {
    m && clearTimeout(m), m = window.setTimeout(() => {
      t(x, T), m = null;
    }, 150);
  };
  l.oninput = () => {
    const x = parseInt(l.value), T = parseInt(b.value);
    x < T && (b.value = x.toString(), g.textContent = `最小宽度: ${x}px`), d.textContent = `最大宽度: ${x}px`;
    const E = parseInt(l.value), k = parseInt(b.value);
    p(E, k);
  }, b.oninput = () => {
    const x = parseInt(l.value), T = parseInt(b.value);
    T > x && (l.value = T.toString(), d.textContent = `最大宽度: ${T}px`), g.textContent = `最小宽度: ${T}px`;
    const E = parseInt(l.value), k = parseInt(b.value);
    p(E, k);
  }, o.appendChild(s), o.appendChild(l), o.appendChild(d), h.appendChild(u), h.appendChild(b), h.appendChild(g), a.appendChild(o), a.appendChild(h);
  const f = document.createElement("div");
  f.className = "dialog-buttons", f.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const y = document.createElement("button");
  y.className = "btn btn-primary", y.textContent = "确定", y.style.cssText = le(), y.onclick = () => {
    const x = parseInt(l.value), T = parseInt(b.value);
    t(x, T), de(a);
  };
  const w = document.createElement("button");
  return w.className = "btn btn-secondary", w.textContent = "取消", w.style.cssText = le(), w.onclick = () => {
    i && i(), de(a);
  }, f.appendChild(y), f.appendChild(w), a.appendChild(f), a;
}
function Gi(c, e, t) {
  const i = document.createElement("div");
  i.className = "width-adjustment-dialog";
  const a = Xe();
  i.style.cssText = a;
  const r = document.createElement("div");
  r.className = "dialog-title", r.textContent = "调整面板宽度", i.appendChild(r);
  const n = document.createElement("div");
  n.className = "dialog-slider-container", n.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const o = document.createElement("input");
  o.type = "range", o.min = "120", o.max = "800", o.value = c.toString(), o.style.cssText = xe();
  const s = document.createElement("div");
  s.className = "dialog-width-display", s.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, s.textContent = `当前宽度: ${c}px`, o.oninput = () => {
    const u = parseInt(o.value);
    s.textContent = `当前宽度: ${u}px`, e(u);
  }, n.appendChild(o), n.appendChild(s), i.appendChild(n);
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
  const h = document.createElement("button");
  return h.className = "btn btn-secondary", h.textContent = "取消", h.style.cssText = le(), h.onclick = () => {
    t(), de(i);
  }, l.appendChild(d), l.appendChild(h), i.appendChild(l), i;
}
function de(c) {
  c && c.parentNode && c.parentNode.removeChild(c);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function Xi() {
  if (document.getElementById("dialog-styles")) return;
  const c = document.createElement("style");
  c.id = "dialog-styles", c.textContent = `
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
  `, document.head.appendChild(c);
}
function Ki(c, e) {
  return c.length !== e.length ? !0 : !c.every((t, i) => t === e[i]);
}
let _;
const Ji = "32px";
class Zi {
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
    v(this, "storageService", new tt());
    /** 标签页存储服务实例 - 提供标签页相关的数据存储操作 */
    v(this, "tabStorageService");
    /** 上次面板检查时间 - 用于防抖面板发现调用 */
    v(this, "lastPanelCheckTime", 0);
    /** 上次面板块检查时间 - 用于防抖 checkCurrentPanelBlocks 调用 */
    v(this, "lastBlockCheckTime", 0);
    /** 防抖的面板发现方法 - 500ms延迟，避免频繁调用 */
    v(this, "discoverPanelsDebounced", null);
    /** 数据保存防抖定时器 - 用于合并频繁的保存操作 */
    v(this, "saveDataDebounceTimer", null);
    /** 数据保存防抖延迟（毫秒） - 性能优化：增加到500ms减少频繁保存 */
    v(this, "SAVE_DEBOUNCE_DELAY", 500);
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 当前日志级别 */
    v(this, "currentLogLevel", Ke);
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
    /** 是否固定到编辑器顶部 - 标签页容器覆盖在编辑器区域(#main)顶部（与固定到顶部互斥） */
    v(this, "isFixedToEditorTop", !1);
    /** 编辑器顶部固定模式的观察器 - 跟随侧边栏开合/窗口变化更新标签栏位置 */
    v(this, "editorTopObserver", null);
    /** 编辑器顶部固定模式的body class观察器 - 侧边栏响应式折叠（body类名切换）时更新位置 */
    v(this, "editorTopBodyObserver", null);
    /** 编辑器顶部固定模式的位置更新rAF节流标记 */
    v(this, "editorTopRafPending", !1);
    /** 编辑器顶部固定模式的兜底轮询定时器 - 无论侧边栏以何种方式开合，1秒内修正位置 */
    v(this, "editorTopGuardTimer", null);
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
    // ==================== 气泡模式 ====================
    /** 气泡模式是否启用 - 控制是否启用气泡模式（仅垂直模式可用） */
    v(this, "enableBubbleMode", !1);
    /** 气泡模式是否展开 - 标识气泡模式下容器是否处于展开状态 */
    v(this, "isBubbleExpanded", !1);
    /** 气泡模式展开延迟定时器 - 用于延迟展开气泡模式容器 */
    v(this, "bubbleExpandTimer", null);
    /** 气泡模式收起延迟定时器 - 用于延迟收起气泡模式容器 */
    v(this, "bubbleCollapseTimer", null);
    /** 气泡模式动画进行中标志 - 防止动画冲突 */
    v(this, "isBubbleAnimating", !1);
    /** 气泡模式动画定时器集合 - 用于取消所有进行中的动画 */
    v(this, "bubbleAnimationTimers", /* @__PURE__ */ new Set());
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
    /** 是否隐藏标签页提示 - 控制是否隐藏标签页的悬停提示 */
    v(this, "hideTabTooltips", !1);
    // ==================== 合并标签栏模式 ====================
    /** 合并显示所有面板标签是否启用 - 控制是否在一个标签栏中显示所有面板的标签组 */
    v(this, "enableMergedTabBar", !1);
    /** 每面板LRU历史缓存 - 合并模式下每个面板的视图历史（key: panelId） */
    v(this, "panelHistoryMap", /* @__PURE__ */ new Map());
    /** 历史使用计数器 - LRU 淘汰依据，数值越大越新 */
    v(this, "historyUseCounter", 0);
    /** 跨面板拖拽载荷 - 拖拽标签到面板时的统一数据 */
    v(this, "activeDragPayload", null);
    /** 面板放置提示元素 - 拖拽标签到面板时显示的半区高亮（懒创建单例） */
    v(this, "panelDropHint", null);
    /** 视图类型显示名 - 合并模式下无标题视图的回退名称 */
    v(this, "viewTypeNames", {
      journal: "日记",
      search: "搜索",
      tags: "标签",
      graph: "关系图",
      whiteboard: "白板"
    });
    /** 合并模式状态订阅取消函数 - valtio subscribe 返回的取消函数 */
    v(this, "mergedModeUnsubscribe", null);
    /** 合并模式DOM监听器 - 监听面板DOM变化以即时刷新标签栏 */
    v(this, "mergedModeObserver", null);
    /** 合并模式刷新定时器 - 防抖合并频繁触发的刷新请求 */
    v(this, "mergedRefreshTimer", null);
    /** 合并模式渲染签名 - 与上次渲染对比，相同则跳过DOM重建 */
    v(this, "mergedRenderSignature", "");
    /** 合并模式渲染进行中标志 - 防止并发渲染导致DOM重复 */
    v(this, "mergedRenderInProgress", !1);
    /** 历史同步进行中标志 - 防止并发同步（异步获取块数据时） */
    v(this, "syncPanelHistoryInProgress", !1);
    /** 块数据缓存 - 合并模式下未打开块的异步获取缓存（30秒TTL） */
    v(this, "blockDataCache", /* @__PURE__ */ new Map());
    /** 合并模式固定条目 - panelId → 固定历史 key 列表（持久化） */
    v(this, "mergedPinnedMap", {});
    /** 合并模式固定条目是否已从存储加载 */
    v(this, "mergedPinnedLoaded", !1);
    /** 合并模式标题覆盖 - panelId|key → 自定义标题（持久化） */
    v(this, "mergedTitleOverrides", {});
    /** 合并模式标题覆盖是否已从存储加载 */
    v(this, "mergedTitleOverridesLoaded", !1);
    /** 合并模式进入工作区前的面板历史快照 - 退出工作区时恢复，避免工作区打开的块泄漏到非工作区标签栏 */
    v(this, "mergedHistorySnapshot", null);
    /** 合并模式进入工作区前的激活视图条目 - 退出工作区时导航回去，使标签栏恢复到进入前状态 */
    v(this, "mergedActiveEntryBeforeWorkspace", null);
    /** 贴边隐藏检测防抖定时器 - 避免面板切换时的频繁检测 */
    v(this, "edgeHideDebounceTimer", null);
    /** 是否正在更新DOM - DOM更新期间禁用贴边隐藏检测 */
    v(this, "isUpdatingDOM", !1);
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
    /** 工作区标签组中已移除（但视图仍打开）的块ID - 防止同步时被重新加回 */
    v(this, "removedWorkspaceBlockIds", /* @__PURE__ */ new Set());
    /** 是否启用工作区功能 - 控制工作区功能的开关 */
    v(this, "enableWorkspaces", !0);
    /** 进入工作区之前的标签页组 - 用于退出工作区时恢复到原始标签页组 */
    v(this, "tabsBeforeWorkspace", null);
    /** 进入工作区之前的面板布局 - 用于退出工作区时恢复多面板布局 */
    v(this, "layoutBeforeWorkspace", null);
    /** 是否正在恢复面板布局 - 用于抑制合并模式监听器在重建期间触发，避免竞态 */
    v(this, "restoringPanelLayout", !1);
    /** 是否需要在初始化后恢复标签页组 - 用于处理在工作区状态下关闭软件的情况 */
    v(this, "shouldRestoreTabsBeforeWorkspace", !1);
    // ==================== 对话框管理 ====================
    /** 对话框层级管理器 - 管理对话框的z-index层级 */
    v(this, "dialogZIndex", 2e3);
    /** 最后激活的块ID - 记录最后激活的块，用于快捷键操作 */
    v(this, "lastActiveBlockId", null);
    v(this, "lastActiveTabInstanceId", null);
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
    v(this, "draggingDebounce", We(async () => {
      await this.updateTabsUI();
    }, 200));
    /** 合并模式聚焦事件处理器（引用保存以便卸载） */
    v(this, "mergedFocusInHandler", () => {
      this.handleMergedStateChange();
    });
    /** 合并模式状态订阅回调（引用保存以便卸载） */
    v(this, "mergedStateSubscriber", () => {
      this.handleMergedStateChange();
    });
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 跨面板拖拽分屏 - Cross-panel Drag & Drop */
    /* ———————————————————————————————————————————————————————————————————————————— */
    /** 面板放置监听器是否已安装 */
    v(this, "panelDropHandlersReady", !1);
    /**
     * 文档级 dragover（捕获阶段）：定位并显示面板放置提示
     */
    v(this, "panelDropDragOverHandler", (e) => {
      const t = this.activeDragPayload;
      if (!t) return;
      const i = e.target;
      if (!i || !i.closest) return;
      if (this.tabContainer && this.tabContainer.contains(i)) {
        e.preventDefault(), this.hidePanelDropHint();
        return;
      }
      const a = i.closest(".orca-panel");
      if (!a) {
        this.hidePanelDropHint();
        return;
      }
      if (t.kind === "tab" && !t.tab || t.kind === "history" && !t.entry) return;
      let r;
      if (t.kind === "tab" && (t.tab.isViewPanel || t.tab.blockId.startsWith("view:")))
        r = "center";
      else {
        const n = a.getBoundingClientRect();
        r = this.computeDropDirection(n, e.clientX, e.clientY);
      }
      e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move"), this.showPanelDropHint(a, r);
    });
    /**
     * 文档级 drop（捕获阶段）：处理放置到面板（中心打开/边缘分屏）
     */
    v(this, "panelDropDropHandler", (e) => {
      const t = this.activeDragPayload;
      if (!t) return;
      const i = e.target;
      if (!i || !i.closest || this.tabContainer && this.tabContainer.contains(i))
        return;
      const a = i.closest(".orca-panel");
      if (this.hidePanelDropHint(), !a) return;
      const r = a.dataset.panelId;
      if (!r) return;
      let n = "", o = {}, s = "";
      if (t.kind === "history" && t.entry)
        n = t.entry.view, o = { ...t.entry.viewArgs };
      else if (t.kind === "tab") {
        const h = this.resolveTabNavigate(t);
        if (!h) return;
        n = h.view, o = h.viewArgs, s = h.switchFocusTarget;
      } else
        return;
      const l = a.getBoundingClientRect(), d = n.startsWith("view:") ? "center" : this.computeDropDirection(l, e.clientX, e.clientY);
      e.preventDefault();
      try {
        if (d === "center")
          n.startsWith("view:") ? orca.nav.switchFocusTo(s || t.panelId) : (orca.nav.goTo(n, o, r), orca.nav.switchFocusTo(r));
        else {
          const h = orca.nav.addTo(r, d, {
            view: n,
            viewArgs: o,
            viewState: {}
          });
          h && orca.nav.switchFocusTo(h);
        }
      } catch (h) {
        this.warn("拖拽放置到面板失败:", h);
      }
      this.activeDragPayload = null;
    });
    v(this, "handleEditorTopResize", () => {
      this.editorTopRafPending || (this.editorTopRafPending = !0, requestAnimationFrame(() => {
        this.editorTopRafPending = !1, this.updateEditorTopPosition();
      }));
    });
    this.pluginName = e, this.discoverPanelsDebounced = We(() => {
      this.discoverPanelsInternal();
    }, 500), this.initializePerformanceOptimizers();
  }
  /** 简单的日志方法 */
  log(e, ...t) {
    this.currentLogLevel >= M.INFO && fe(e, ...t);
  }
  logError(e, ...t) {
    this.currentLogLevel >= M.ERROR && Ai(e, ...t);
  }
  logWarn(e, ...t) {
    this.currentLogLevel >= M.WARN && Wi(e, ...t);
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
    const i = this.getLatestMetricMap(e.metrics), a = i.get(this.performanceMetricKeys.initTotal), r = i.get(this.performanceMetricKeys.tabInteraction), n = i.get(this.performanceMetricKeys.domMutations), o = i.get("fps"), s = i.get("memory_heap"), l = a ? `${a.value.toFixed(1)}${a.unit}` : this.lastInitDurationMs !== null ? `${this.lastInitDurationMs.toFixed(1)}ms` : "n/a", d = r ? `${r.value.toFixed(0)}` : "0", h = n ? `${n.value.toFixed(0)}` : "0", u = o ? `${o.value.toFixed(0)}fps` : "n/a", b = s ? this.formatBytes(s.value) : "n/a";
    return [
      `[Performance][${t}] Baseline`,
      `  healthScore: ${e.healthScore}`,
      `  init_total: ${l}`,
      `  tab_interactions: ${d}`,
      `  dom_mutations: ${h}`,
      `  fps: ${u}`,
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
    this.currentLogLevel >= M.DEBUG && fe(e.join(" "), ...e);
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...e) {
    this.currentLogLevel >= M.VERBOSE && fe(e.join(" "), ...e);
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
    this.currentLogLevel = e, j.setLogLevel(e), this.log(`📊 日志级别已设置为: ${M[e]}`);
  }
  /**
   * 从存储中恢复调试模式设置
   */
  async restoreDebugMode() {
    try {
      await this.storageService.getConfig(C.DEBUG_MODE, this.pluginName) && this.setLogLevel(M.VERBOSE);
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
    await this.restoreDebugMode(), await this.restoreRestoreFocusedTabSetting(), await this.restoreFeatureToggleSettings(), Xi(), this.tabStorageService = new ut(this.storageService, this.pluginName, {
      log: this.log.bind(this),
      warn: this.warn.bind(this),
      error: this.error.bind(this),
      verboseLog: this.verboseLog.bind(this)
    });
    try {
      this.maxTabs = orca.state.settings[He.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.loadWorkspaces();
    const [
      e,
      t,
      i,
      a,
      r
    ] = await Promise.all([
      this.restorePosition(),
      this.restoreLayoutMode(),
      this.restoreFixedToTopMode(),
      this.restoreFixedToEditorTopMode(),
      this.restoreFloatingWindowVisibility()
    ]);
    this.isFixedToEditorTop && this.isFixedToTop && (this.isFixedToEditorTop = !1), this.registerHeadbarButton(), await this.discoverPanels();
    const n = this.getFirstPanel();
    if (n ? this.log(`🎯 初始化第1个面板（持久化面板）: ${n}`) : this.log("⚠️ 初始化时没有发现面板"), this.shouldRestoreTabsBeforeWorkspace && this.tabsBeforeWorkspace)
      this.log("🔄 检测到保存的标签页组，直接恢复而不加载普通标签页"), this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = [...this.tabsBeforeWorkspace], this.layoutBeforeWorkspace && (await this.restorePanelLayout(this.layoutBeforeWorkspace), this.layoutBeforeWorkspace = null, await this.tabStorageService.clearLayoutBeforeWorkspace()), this.shouldRestoreTabsBeforeWorkspace = !1, this.tabsBeforeWorkspace = null, await this.tabStorageService.clearTabsBeforeWorkspace(), this.log("✅ 已直接恢复到进入工作区前的标签页组");
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
    const o = document.querySelector(".orca-panel.active"), s = o == null ? void 0 : o.getAttribute("data-panel-id");
    if (s && !s.startsWith("_") && (this.currentPanelId = s, this.currentPanelIndex = this.getPanelIds().indexOf(s), this.log(`🎯 当前活动面板: ${s} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1 && requestIdleCallback(async () => {
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
    }, { timeout: 1e3 }), s && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${s} 的标签页`), await this.scanCurrentPanelTabs();
    else if (s && this.currentPanelIndex === 0)
      if (this.log("📋 当前活动面板是第一个面板，使用持久化数据"), this.restoreFocusedTab) {
        const l = document.querySelector(".orca-panel.active");
        if (l) {
          const d = l.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (d) {
            const h = d.getAttribute("data-block-id");
            h && (this.getCurrentPanelTabs().find((g) => g.blockId === h) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${h}`), await this.checkCurrentPanelBlocks()));
          }
        }
      } else
        this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过当前聚焦页面的恢复');
    this.restoreFocusedTab ? await this.autoDetectAndSyncCurrentFocus() : this.log('📋 已关闭"刷新后恢复聚焦标签页"，跳过自动检测聚焦页面'), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.initializeOptimizedDOMObserver(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), setTimeout(() => {
      try {
        _i(), this.initializeHeadbarUserToolsTooltips(), Je(), Ze(), this.log("✅ Tooltips 初始化完成，清理定时器和页面卸载清理已启动");
      } catch (l) {
        this.log("⚠️ Tooltips 初始化失败:", l);
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
      let r = null;
      for (const d of a) {
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
      const s = o.find((d) => d.blockId === n);
      if (s) {
        this.log(`📋 当前可见页面已存在于标签页中: "${s.title}" (${n})`), this.updateFocusState(n, s.title), await this.immediateUpdateTabsUI(), this.log(`✅ 成功同步已存在的标签页: "${s.title}"`);
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
        l.tabId = h.tabId || l.tabId, o[d] = l, l.order = d, this.log(`🔄 达到标签上限 (${this.maxTabs})，替换最后一个标签页: "${h.title}" -> "${l.title}"`);
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
    const a = setInterval(() => {
      const r = orca.state.themeMode;
      r !== t && (this.log("备用检测：主题从", t, "切换到", r), t = r, setTimeout(() => {
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
        const r = i, n = r.getAttribute("title");
        n && (r.removeAttribute("title"), B(r, {
          text: n,
          delay: 300,
          defaultPlacement: "bottom"
        }), this.log(`✅ 已为用户工具栏按钮 ${a + 1} 添加 tooltip: "${n}"`));
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
            (o) => o.classList.contains("new-tab-button") || o.classList.contains("drag-handle") || o.classList.contains("resize-handle")
          )) {
            this.clearDropIndicator();
            return;
          }
        }
        e || (e = requestAnimationFrame(() => {
          e = null;
          const a = document.elementsFromPoint(t.clientX, t.clientY).find((r) => {
            if (!r.classList.contains("orca-tab") || !r.hasAttribute("data-orca-tabs-block-id")) return !1;
            const n = r.style;
            return !(n.opacity === "0" && n.pointerEvents === "none" || r.classList.contains("close-button") || r.classList.contains("new-tab-button") || r.classList.contains("drag-handle") || r.classList.contains("resize-handle"));
          });
          if (a) {
            const r = a.getAttribute("data-orca-tabs-block-id"), o = this.getCurrentPanelTabs().find((s) => s.blockId === r);
            if (o && o.blockId !== this.draggingTab.blockId) {
              const s = a.getBoundingClientRect(), l = this.isVerticalMode && !this.isFixedToTop && !this.isFixedToEditorTop;
              let d;
              if (l) {
                const u = s.top + s.height / 2;
                d = t.clientY < u ? "before" : "after";
              } else {
                const u = s.left + s.width / 2;
                d = t.clientX < u ? "before" : "after";
              }
              this.updateDropIndicator(a, d);
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
    const a = e.getBoundingClientRect(), r = e.parentElement;
    if (r) {
      const n = r.getBoundingClientRect();
      t === "before" ? (i.style.left = `${a.left - n.left}px`, i.style.top = `${a.top - n.top - 1}px`, i.style.width = `${a.width}px`) : (i.style.left = `${a.left - n.left}px`, i.style.top = `${a.bottom - n.top - 1}px`, i.style.width = `${a.width}px`), r.appendChild(i);
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
    var u, b;
    if (!this.tabContainer) return;
    const a = this.getCurrentPanelTabs(), r = a.findIndex((g) => g.blockId === t.blockId), n = a.findIndex((g) => g.blockId === e.blockId);
    if (r === -1 || n === -1 || r === n) return;
    const o = a.filter((g) => g.isPinned).length;
    let s = i === "before" ? n : n + 1;
    if (r < s && s--, t.isPinned) {
      if (s >= o) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶区域: ${t.title}`);
        return;
      }
      if (!e.isPinned) {
        this.verboseLog(`📌 阻止置顶标签拖到非置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (!t.isPinned) {
      if (s < o) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶区域: ${t.title}`);
        return;
      }
      if (e.isPinned) {
        this.verboseLog(`📌 阻止非置顶标签拖到置顶标签上: ${t.title} -> ${e.title}`);
        return;
      }
    }
    if (r === s) return;
    this.verboseLog(`🔄 [实时交换] ${t.title}: ${r} -> ${s}`);
    const [l] = a.splice(r, 1);
    a.splice(s, 0, l), await this.setCurrentPanelTabs(a);
    const d = this.tabContainer.querySelector(`[data-orca-tabs-block-id="${t.blockId}"]`), h = this.tabContainer.querySelector(`[data-orca-tabs-block-id="${e.blockId}"]`);
    d && h && (i === "before" ? (u = h.parentNode) == null || u.insertBefore(d, h) : (b = h.parentNode) == null || b.insertBefore(d, h.nextSibling));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(e, t) {
    const i = this.getCurrentPanelTabs(), a = i.findIndex((s) => s.blockId === e.blockId), r = i.findIndex((s) => s.blockId === t.blockId);
    if (a === -1 || r === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (a === r) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${r}) -> ${e.title} (${a})`);
    const n = i[r], o = i[a];
    i[a] = n, i[r] = o, i.forEach((s, l) => {
      s.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(i), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${n.title} -> 位置 ${a}`);
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
    if (e.forEach((r) => {
      const n = r.getAttribute("data-panel-id");
      if (n) {
        if (n.startsWith("_"))
          return;
        t.push(n), r.classList.contains("active") && (i = n);
      }
    }), this.panelDiscoveryCache) {
      const r = this.panelDiscoveryCache.panelIds;
      if (r.length === t.length && r.every((o, s) => o === t[s])) {
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
    const i = e.filter((r) => !t.includes(r));
    i.length > 0 && (this.log("🗑️ 检测到面板被关闭:", i), await this.handlePanelClosure(i));
    const a = t.filter((r) => !e.includes(r));
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
      const r = this.panelOrder.findIndex((n) => n.id === a);
      r !== -1 && (t.push(r), (this.panelTabsData[r] || []).forEach((o) => {
        z(o) && (i.push(o.blockId), this.verboseLog(`🖼️ 检测到视图面板标签页将被清理: ${o.title} (blockId: ${o.blockId})`));
      }));
    }), i.length > 0 && this.log(`🖼️ 面板关闭将清理 ${i.length} 个视图面板标签页`), t.sort((a, r) => r - a).forEach((a) => {
      (this.panelTabsData[a] || []).forEach((n) => {
        this.closedTabs.add(n.blockId);
      }), this.panelTabsData.splice(a, 1), this.log(`🗑️ 删除面板 ${e[t.indexOf(a)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((a) => a.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let a = 0; a < this.panelOrder.length; a++) {
      const r = this.panelTabsData[a] || [], n = a === 0 ? C.FIRST_PANEL_TABS : `panel_${a + 1}_tabs`;
      await this.savePanelTabsByKey(n, r);
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
    if (t.length === e.length && t.every((r, n) => r === e[n]))
      return;
    e.forEach((r) => {
      this.panelOrder.find((n) => n.id === r) || this.addPanel(r);
    }), this.panelOrder.filter((r) => !e.includes(r.id)).forEach((r) => {
      this.removePanel(r.id);
    }), this.verboseLog("🔄 面板顺序更新完成:", this.panelOrder.map((r) => `${r.id}(${r.order})`));
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
    let r = 0;
    this.log(`🔍 扫描第一个面板 ${e}，找到 ${i.length} 个块编辑器`);
    for (const n of i) {
      const o = n.getAttribute("data-block-id");
      if (!o) continue;
      const s = await this.getTabInfo(o, e, r++);
      s && (a.push(s), this.log(`📋 找到标签页: ${s.title} (${o})`));
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
    const e = this.getCurrentPanelTabs(), t = Ui(e);
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return Ri(e);
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
    for (const r of e)
      r && typeof r == "object" && (r.t === "r" && r.v ? (a = !0, r.a || (t = !0)) : r.t === "t" && r.v && (i = !0));
    return t || i && a;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return ki(e);
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
          const a = e.getDay(), n = ["日", "一", "二", "三", "四", "五", "六"][a], o = t.replace(/E/g, n);
          return R(e, o);
        } else
          return R(e, t);
      else
        return R(e, t);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const r of a)
        try {
          return R(e, r);
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
  /**
   * 去掉文本尾部的 #标签 后缀（如 "标题 #标签1 #标签2" -> "标题"）
   */
  stripTrailingHashTags(e) {
    return e.replace(/(\s*#[^\s#]+)+$/u, "").trim();
  }
  /**
   * 从块属性中提取标题级别（用于 h1-h6 图标显示）
   */
  extractBlockLevel(e) {
    try {
      const t = this.findProperty(e, "_repr");
      if (!t || !t.value) return;
      const i = typeof t.value == "string" ? JSON.parse(t.value) : t.value, a = i == null ? void 0 : i.level;
      return typeof a == "number" && a >= 1 && a <= 6 ? a : void 0;
    } catch {
      return;
    }
  }
  async getTabInfo(e, t, i) {
    try {
      if (e.startsWith("view:"))
        return this.verboseLog(`⏭️ 跳过视图面板的块信息获取: ${e}`), null;
      const a = await orca.invokeBackend("get-block", parseInt(e));
      if (!a) return null;
      let r = "", n = "", o = "", s = !1, l = "";
      l = await pe(a), this.verboseLog(`🔍 检测到块类型: ${l} (块ID: ${e})`), a.aliases && a.aliases.length > 0 && this.verboseLog(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(a.aliases)}, 检测到的类型=${l}`);
      try {
        const d = je(a);
        if (d)
          s = !0, r = ge(d);
        else if (a.aliases && a.aliases.length > 0) {
          const h = String(a.aliases[0]), u = h.split("/").filter(Boolean);
          r = h.endsWith("/") && u.length > 0 ? u.pop() : h;
        } else if (a.content && a.content.length > 0)
          this.needsContentConcatenation(a.content) && a.text ? r = this.stripTrailingHashTags(a.text.substring(0, 50)) : r = this.stripTrailingHashTags((await this.extractTextFromContent(a.content)).substring(0, 50));
        else if (a.text) {
          let h = a.text.substring(0, 50);
          if (l === "list") {
            const u = a.text.split(`
`)[0].trim();
            u && (h = u.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (l === "table") {
            const u = a.text.split(`
`)[0].trim();
            u && (h = u.replace(/\|/g, "").trim());
          } else if (l === "quote") {
            const u = a.text.split(`
`)[0].trim();
            u && (h = u.replace(/^>\s+/, ""));
          } else if (l === "image") {
            const u = a.text.match(/caption:\s*(.+)/i);
            u && u[1] ? h = u[1].trim() : h = a.text.trim();
          }
          r = this.stripTrailingHashTags(h);
        } else
          r = `块 ${e}`;
      } catch (d) {
        this.warn("获取标题失败:", d), r = `块 ${e}`;
      }
      try {
        const d = this.findProperty(a, "_color"), h = this.findProperty(a, "_icon");
        d && d.type === 1 && (n = d.value), h && h.type === 1 && h.value && h.value.trim() ? (o = h.value, this.verboseLog(`🎨 使用用户自定义图标: ${o} (块ID: ${e})`)) : (this.showBlockTypeIcons || l === "journal") && (o = G(l, this.extractBlockLevel(a)), this.verboseLog(`🎨 使用块类型图标: ${o} (块类型: ${l}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), o = G(l, this.extractBlockLevel(a));
      }
      return {
        blockId: e,
        tabId: K(e),
        panelId: t,
        title: r || `块 ${e}`,
        color: n,
        icon: o,
        isJournal: s,
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
    var o;
    if (!this.isFloatingWindowVisible) {
      this.log("🙈 浮窗已隐藏，跳过UI创建");
      return;
    }
    if (this.tabContainer) {
      if (this.enableBubbleMode) {
        const s = (o = this.tabContainer) == null ? void 0 : o._bubbleClickOutsideHandler;
        s && document.removeEventListener("click", s, !0);
      }
      this.tabContainer.remove();
    }
    this.teardownEditorTopWatchers(), this.cycleSwitcher && this.cycleSwitcher.remove(), this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.log("📱 使用自动切换模式，不创建面板切换器");
    const e = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)";
    let t, i, a;
    this.isFixedToTop || this.isFixedToEditorTop ? (t = { x: 0, y: 0 }, i = !1, a = window.innerWidth) : (t = this.isVerticalMode ? this.verticalPosition : this.position, i = this.isVerticalMode, a = this.verticalWidth);
    const r = i && !this.isFixedToTop && this.enableBubbleMode;
    if (this.tabContainer = Ni(
      i,
      t,
      a,
      e,
      r,
      r ? this.isBubbleExpanded : !1
    ), this.isFixedToEditorTop) {
      const s = document.getElementById("headbar");
      N(document.body, () => {
        s && s.parentElement ? s.insertAdjacentElement("afterend", this.tabContainer) : document.body.appendChild(this.tabContainer);
      }), N(this.tabContainer, () => {
        this.tabContainer.style.cssText += `
          position: fixed;
          left: var(--orca-tabs-editor-left, 0px);
          right: var(--orca-tabs-editor-right, 0px);
          top: var(--orca-height-headbar, 38px);
          width: auto;
          max-width: none;
          height: ${Ji};
          z-index: calc(var(--orca-zindex-headbar, 1000) - 1);
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: nowrap;
          border-bottom: 2px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        `;
      }), this.tabContainer.classList.add("fixed-to-editor-top"), this.enableMergedTabBar && (this.tabContainer.style.removeProperty("backdrop-filter"), this.tabContainer.style.removeProperty("-webkit-backdrop-filter"), this.tabContainer.style.removeProperty("background")), this.setupEditorTopWatchers(), this.log("📐 标签页已固定到编辑器顶部");
    } else if (this.isFixedToTop) {
      const s = document.querySelector(".orca-headbar-sidebar-tools") || document.body;
      this.log("🔍 查找顶部工具栏:", {
        headbar: (s == null ? void 0 : s.className) || (s == null ? void 0 : s.tagName),
        headbarExists: !!s,
        bodyChildren: document.body.children.length
      }), s && this.tabContainer && N(s, () => {
        s.appendChild(this.tabContainer);
      }), s === document.body && this.tabContainer ? N(this.tabContainer, () => {
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
      }) : s && this.tabContainer && N(this.tabContainer, () => {
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
      }), this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${s.className || s.tagName}`);
    } else this.tabContainer && (N(document.body, () => {
      document.body.appendChild(this.tabContainer);
    }), this.enableEdgeHide && this.debouncedApplyEdgeHideStyle(100));
    this.tabContainer.addEventListener("mousedown", (s) => {
      if (!s || !s.target)
        return;
      const l = s.target;
      l.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && s.stopPropagation();
    }), this.tabContainer.addEventListener("click", (s) => {
      if (!s || !s.target)
        return;
      const l = s.target;
      l.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && s.stopPropagation();
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
    `, n.textContent = "", n.addEventListener("mouseenter", () => {
      n.style.opacity = "0.5";
    }), n.addEventListener("mouseleave", () => {
      n.style.opacity = "0";
    }), n.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(n), !this.isFixedToTop && !this.isFixedToEditorTop && document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && !r && this.enableDragResize(), this.mergedRenderSignature = "", await this.updateTabsUI(!0), r && (this.setupBubbleModeEvents(), this.isBubbleExpanded || this.createBubbleOverlay());
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

      /* 只有一个标签时隐藏关闭按钮（容器同时含两个类名，需复合选择器匹配同一元素） */
      .orca-tabs-plugin.orca-tabs-container .orca-tab:only-child .tab-close-btn {
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

      /* ========== 合并标签栏模式样式 ========== */
      /* 面板组之间的分隔条（2px宽、左右各1px间距，节省空间） */
      .orca-tabs-plugin .orca-tab-sep {
        flex-shrink: 0;
        width: 2px;
        height: 16px;
        margin: 0 1px;
        align-self: center;
        background: color-mix(in srgb, var(--orca-color-text-1), transparent 75%);
        pointer-events: none;
      }

      /* 垂直布局：分隔条为横向（容器类名含vertical，选择器需匹配同一元素） */
      .orca-tabs-plugin.vertical .orca-tab-sep {
        width: 70%;
        height: 2px;
        margin: 1px auto;
      }

      /* 合并模式标签：去掉常驻边框，避免与组间分隔条混淆 */
      .orca-tabs-plugin .orca-tab.orca-tab-merged {
        border: 1px solid transparent !important;
      }

      /* 合并模式标签：当前面板+当前视图高亮 */
      .orca-tabs-plugin .orca-tab-merged.orca-tab-active {
        box-shadow: inset 0 -2px 0 var(--orca-color-primary-5, #5B8DEF);
      }

      .orca-tabs-container.vertical .orca-tab-merged.orca-tab-active {
        box-shadow: inset 2px 0 0 var(--orca-color-primary-5, #5B8DEF);
      }

      .orca-tabs-plugin .orca-tab-merged.orca-tab-current {
        font-weight: 600;
      }

      /* 合并模式标签关闭按钮 */
      .orca-tabs-plugin .orca-tab-merged .orca-tab-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        margin-left: 4px;
        border-radius: 50%;
        font-size: 12px;
        line-height: 1;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .orca-tabs-plugin .orca-tab-merged:hover .orca-tab-close {
        opacity: 1;
      }

      .orca-tabs-plugin .orca-tab-merged .orca-tab-close:hover {
        background: var(--orca-color-menu-highlight);
      }

      /* 合并模式组内拖拽插入标记 */
      .orca-tabs-plugin .orca-tab-merged.orca-tab-insert {
        box-shadow: inset 2px 0 0 var(--orca-color-primary-5, #5B8DEF);
      }

      .orca-tabs-container.vertical .orca-tab-merged.orca-tab-insert {
        box-shadow: inset 0 2px 0 var(--orca-color-primary-5, #5B8DEF);
      }

      /* 拖拽标签到面板的放置提示（半区/中心高亮） */
      .orca-tabs-panel-drophint {
        position: fixed;
        z-index: 100000;
        pointer-events: none;
        border: 2px dashed var(--orca-color-primary-5, #5B8DEF);
        background: color-mix(in srgb, var(--orca-color-primary-5, #5B8DEF), transparent 70%);
        border-radius: 6px;
      }

      /* 合并模式标签基础布局（无内联样式，需要完整CSS定义） */
      .orca-tabs-plugin .orca-tab-merged {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: var(--orca-tab-bg);
        color: var(--orca-color-text-1);
        padding: 2px 8px;
        border-radius: var(--orca-radius-md);
        height: 24px;
        max-height: 24px;
        line-height: 20px;
        cursor: pointer;
        font-size: 12px;
        max-width: 130px;
        min-width: 0;
        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: auto;
      }

      .orca-tabs-plugin .orca-tab-merged .orca-tab-icon {
        font-size: 14px;
        flex-shrink: 0;
        line-height: 1;
      }

      .orca-tabs-plugin .orca-tab-merged .orca-tab-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
      }

      /* 合并模式标签拖拽中的视觉反馈 */
      .orca-tabs-plugin .orca-tab-merged.orca-tab-dragging {
        opacity: 0.5;
      }

      /* ========== 固定到编辑器顶部模式 ========== */
      /* 推移 #main 使内容不被标签栏遮挡（纯CSS，参考插件 body.neo-browser-tabs 实现） */
      body.orca-tabs-fixed-editor-top {
        --orca-tabs-editor-top-h: 32px;
      }
      body.orca-tabs-fixed-editor-top #main {
        margin-top: calc(var(--orca-height-headbar, 38px) + var(--orca-tabs-editor-top-h, 32px));
      }

      /* 固定定位使用 !important 类规则，任何内联样式重置（气泡/贴边等路径）都不会破坏定位 */
      .orca-tabs-plugin.fixed-to-editor-top {
        position: fixed !important;
        top: var(--orca-height-headbar, 38px) !important;
        left: var(--orca-tabs-editor-left, 0px) !important;
        right: var(--orca-tabs-editor-right, 0px) !important;
        width: auto !important;
        max-width: none !important;
        height: var(--orca-tabs-editor-top-h, 32px) !important;
        z-index: calc(var(--orca-zindex-headbar, 1000) - 1) !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
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
    if (ee(this.tabContainer)) {
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
      if (this.lastUpdateTime = t, e && this.verboseLog("🔄 强制更新UI（跳过防抖检查）"), this.enableMergedTabBar) {
        await this.syncPanelHistory(), this.renderMergedTabBar(), this.isUpdating = !1, this.isUpdatingDOM = !1;
        return;
      }
      const r = this.tabContainer.querySelector(".drag-handle"), n = this.tabContainer.querySelector(".new-tab-button"), o = this.tabContainer.querySelector(".workspace-button"), s = Array.from(this.tabContainer.querySelectorAll(".orca-tab")).map((b) => b.getAttribute("data-orca-tabs-tab-id")).filter((b) => b !== null), l = this.getCurrentPanelTabs();
      this.tabContainer.querySelectorAll(".orca-tab, .orca-tab-sep").forEach((b) => b.remove()), r && r.parentElement !== this.tabContainer && this.tabContainer.insertBefore(r, this.tabContainer.firstChild);
      let h = this.currentPanelId, u = this.currentPanelIndex;
      if (!h && this.panelOrder.length > 0 && (h = this.panelOrder[0].id, u = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${h}`)), h) {
        this.verboseLog(`📋 显示面板 ${h} 的标签页`);
        let b = this.panelTabsData[u] || [];
        b.length === 0 && (this.log(`🔍 面板 ${h} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(u, h), b = this.panelTabsData[u] || []), this.sortTabsByPinStatus(), b = this.panelTabsData[u] || [];
        const g = document.createDocumentFragment();
        b.forEach((p, f) => {
          const y = this.createTabElement(p);
          this.enableBubbleMode && this.isBubbleExpanded && (y.style.opacity = "1", y.style.transform = ""), g.appendChild(y);
        });
        const m = (i = this.tabContainer) == null ? void 0 : i.querySelector(".new-tab-button");
        this.tabContainer && (m ? this.tabContainer.insertBefore(g, m) : this.tabContainer.appendChild(g), this.enableBubbleMode && this.isBubbleExpanded && requestAnimationFrame(() => {
          var f;
          const p = (f = this.tabContainer) == null ? void 0 : f.querySelectorAll(".orca-tab");
          p == null || p.forEach((y) => {
            const w = y, x = w.getAttribute("data-focused") === "true";
            this.isBubbleAnimating || (x ? w.style.setProperty("opacity", "1", "important") : w.style.opacity = "1", w.style.transform = "", (!w.style.transition || w.style.transition === "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)") && (w.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"));
          });
        }));
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton(), this.isFixedToTop) {
        const b = "var(--orca-tab-bg)", g = "var(--orca-tab-border)", m = "var(--orca-color-text-1)", p = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        p.forEach((y) => {
          const w = y.getAttribute("data-orca-tabs-block-id");
          if (!w) return;
          const T = this.getCurrentPanelTabs().find((E) => E.blockId === w);
          if (T) {
            let E, k, I = "normal";
            if (E = "var(--orca-tab-bg)", k = "var(--orca-color-text-1)", T.color)
              try {
                y.style.setProperty("--tab-color", T.color), (document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark")) && y.style.setProperty(
                  "--orca-tab-colored-text",
                  "oklch(from var(--tab-color, #3b82f6) calc(l * 1.05) c h)",
                  "important"
                ), E = "var(--orca-tab-colored-bg)", k = "var(--orca-tab-colored-text)", I = "600";
              } catch {
              }
            y.style.cssText = `
             display: flex;
             align-items: center;
             padding: 2px 8px;
             background: ${E};
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
             color: ${k};
             font-weight: ${I};
             backdrop-filter: blur(2px);
             -webkit-backdrop-filter: blur(2px);
             -webkit-app-region: no-drag;
             app-region: no-drag;
             pointer-events: auto;
             will-change: transform, margin, opacity, max-width, min-width;
           `, T.color && y.style.setProperty("--tab-color", T.color);
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
          border: 1px solid ${g};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${m};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${p.length}`);
      }
      if (this.enableEdgeHide && this.currentEdgeSide && !this.isFixedToTop && !this.isFixedToEditorTop && requestAnimationFrame(() => {
        this.applyEdgeConstraints();
      }), this.enableBubbleMode && this.isBubbleExpanded && this.tabContainer && this.tabContainer.querySelectorAll(".orca-tab").forEach((g) => {
        const m = g, p = m.getAttribute("data-focused") === "true";
        this.isBubbleAnimating || (p ? m.style.setProperty("opacity", "1", "important") : m.style.opacity = "1", m.style.transform = "", (!m.style.transition || m.style.transition === "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)") && (m.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)"));
      }), this.enableEdgeHide && !this.isFixedToTop && !this.isFixedToEditorTop && this.debouncedApplyEdgeHideStyle(100), this.enableBubbleMode && !this.isBubbleExpanded && this.tabContainer) {
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
        const r = this.createTabElement(i);
        t.appendChild(r);
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
      i.textContent = `面板 ${a}（无标签页）`, B(i, Ce(`当前在面板 ${a}，该面板没有标签页`)), t.appendChild(i);
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
        const r = this.createTabElement(i);
        t.appendChild(r);
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
      i.textContent = `面板 ${a}（无标签页）`, B(i, Ce(`当前在面板 ${a}，该面板没有标签页`)), t.appendChild(i);
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
    t.style.cssText = i, t.textContent = "+", B(t, J("新建标签页")), t.addEventListener("mouseenter", () => {
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
        const r = a, n = this.getTabInfoFromElement(r);
        if (n) {
          const o = this.isVerticalMode && !this.isFixedToTop && !this.isFixedToEditorTop, s = Ae(n, o, () => "", e, t);
          r.style.cssText = s;
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
    const t = e.getAttribute("data-orca-tabs-tab-id"), i = e.getAttribute("data-orca-tabs-block-id");
    if (!t && !i) return null;
    const a = this.panelTabsData[this.currentPanelIndex] || [];
    return a.find((r) => r.tabId === t) || a.find((r) => r.blockId === i) || null;
  }
  /**
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    try {
      if (this.isVerticalMode) {
        const e = Ne(
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
        const e = this.horizontalTabMaxWidth, t = this.horizontalTabMinWidth, i = Ne(
          this.horizontalTabMaxWidth,
          this.horizontalTabMinWidth,
          async (a, r) => {
            await this.updateTabWidths(a, r);
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
    const i = Hi(
      this.isVerticalMode,
      t,
      async (a) => {
        a.preventDefault(), a.stopPropagation(), this.log("🔧 点击功能切换按钮"), alert("功能切换按钮被点击了！"), await this.toggleFeatureSettings();
      }
    );
    B(i, J(
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
    var r;
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
    a.className = "ti ti-layout-grid", a.style.cssText = "font-size: 14px;", t.replaceChildren(a), B(t, J(`工作区 (${((r = this.workspaces) == null ? void 0 : r.length) || 0})`)), t.addEventListener("mouseenter", () => {
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
    var d, h;
    const t = document.querySelector(".new-tab-context-menu");
    t && t.remove(), document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") : document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null || h.themeMode);
    const i = document.createElement("div");
    i.className = "new-tab-context-menu";
    const a = 200, r = 140, { x: n, y: o } = X(e.clientX, e.clientY, a, r);
    i.style.cssText = `
      position: fixed;
      left: ${n}px;
      top: ${o}px;
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
    ), this.isFixedToEditorTop && s.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: "取消固定到编辑器顶部",
        action: () => this.toggleFixedToEditorTop(),
        icon: "📐"
      }
    ), !this.isFixedToTop && !this.isFixedToEditorTop && s.push(
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
    ), !this.isVerticalMode && !this.isFixedToTop && !this.isFixedToEditorTop && s.push(
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
    ), !this.isFixedToTop && !this.isFixedToEditorTop && s.push(
      {
        text: "---",
        action: () => {
        },
        separator: !0
      },
      {
        text: "固定到编辑器顶部",
        action: () => this.toggleFixedToEditorTop(),
        icon: "📐"
      }
    ), (!this.isVerticalMode || this.isFixedToEditorTop) && s.push(
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
    ), !this.isFixedToTop && !this.isFixedToEditorTop && s.push(
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
    ), this.isVerticalMode && !this.isFixedToTop && !this.isFixedToEditorTop && s.push(
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
    ), !this.isFixedToTop && !this.isFixedToEditorTop && s.push(
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
    ), s.forEach((u) => {
      if (u.separator) {
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
      `, u.icon) {
        const m = document.createElement("span");
        m.textContent = u.icon, m.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, b.appendChild(m);
      }
      const g = document.createElement("span");
      g.textContent = u.text, b.appendChild(g), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      }), b.addEventListener("click", () => {
        u.action && u.action(), i.remove();
      }), i.appendChild(b);
    }), document.body.appendChild(i);
    const l = (u) => {
      !u || !u.target || i.contains(u.target) || (i.remove(), document.removeEventListener("click", l));
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
      this.log(`🔄 切换固定到顶部: ${this.isFixedToTop ? "取消固定" : "固定到顶部"}`), this.isFixedToTop = !this.isFixedToTop, this.isFixedToTop && (this.isFixedToEditorTop = !1, await this.saveFixedToEditorTopMode()), await this.saveFixedToTopMode(), await this.createTabsUI(), this.log(`✅ 固定到顶部已${this.isFixedToTop ? "启用" : "禁用"}`);
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
      var n;
      if (this.isDragging) return;
      const r = a.relatedTarget;
      r && ((n = this.tabContainer) != null && n.contains(r)) || (this.bubbleExpandTimer && (clearTimeout(this.bubbleExpandTimer), this.bubbleExpandTimer = null), this.isBubbleExpanded && (this.bubbleCollapseTimer = setTimeout(() => {
        this.collapseBubble();
      }, 200)));
    }, i = (a) => {
      var n;
      if (!this.enableBubbleMode || !this.isBubbleExpanded) return;
      const r = a.target;
      r && !((n = this.tabContainer) != null && n.contains(r)) && (this.bubbleCollapseTimer && clearTimeout(this.bubbleCollapseTimer), this.collapseBubble());
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
      const n = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)", o = this.isVerticalMode ? this.verticalPosition : this.position, s = ae(
        this.isVerticalMode,
        o,
        n,
        this.verticalWidth,
        void 0,
        void 0,
        !0,
        !1
      );
      this.tabContainer.style.cssText = s, this.tabContainer.style.overflow = "clip", this.tabContainer.style.overflowY = "clip", this.tabContainer.style.overflowX = "clip", requestAnimationFrame(() => {
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
    this.tabContainer && N(this.tabContainer, () => {
      this.tabContainer.style.cssText = a, this.tabContainer.style.overflow = "hidden", this.tabContainer.style.overflowY = "", this.tabContainer.style.overflowX = "";
    }), this.isUpdating = !1, this.lastUpdateTime = 0, requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.tabContainer.style.transition = "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)", this.tabContainer.style.transform = "scale(1)", this.tabContainer.style.opacity = "1", this.updateTabsUI().then(() => {
          var o;
          const n = (o = this.tabContainer) == null ? void 0 : o.querySelectorAll(".orca-tab");
          if (!n || n.length === 0) {
            this.verboseLog("⚠️ 标签未加载，重试更新UI");
            const s = setTimeout(() => {
              this.isUpdating = !1, this.updateTabsUI().then(() => {
                this.applyTabAnimation();
              });
            }, 100);
            this.bubbleAnimationTimers.add(s);
          } else
            this.applyTabAnimation();
        }).catch((n) => {
          this.log(`❌ 更新标签UI失败: ${n}`), this.applyTabAnimation();
        });
      });
    });
    const r = setTimeout(() => {
      this.isBubbleAnimating = !1, this.verboseLog("🫧 展开动画完成");
    }, 800);
    this.bubbleAnimationTimers.add(r), this.verboseLog("🫧 气泡已展开");
  }
  /**
   * 应用标签动画
   */
  applyTabAnimation() {
    var i, a;
    const e = (i = this.tabContainer) == null ? void 0 : i.querySelectorAll(".orca-tab");
    if (!e || e.length === 0) return;
    this.tabContainer && this.enableBubbleMode && this.isBubbleExpanded && (this.tabContainer.style.overflow = "hidden", this.tabContainer.style.overflowY = "", this.tabContainer.style.overflowX = ""), e.forEach((r, n) => {
      const o = r, s = o.getAttribute("data-focused") === "true", l = s ? "0.5" : "0";
      o.style.setProperty("opacity", l, "important"), o.style.transform = "translateY(-8px)", o.style.transition = "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)", setTimeout(() => {
        s ? o.style.setProperty("opacity", "1", "important") : o.style.opacity = "1", o.style.transform = "translateY(0)";
      }, n * 15 + 50);
    });
    const t = (a = this.tabContainer) == null ? void 0 : a.querySelectorAll(".new-tab-button, .workspace-button");
    t && t.length > 0 && t.forEach((r, n) => {
      const o = r;
      o.style.opacity = "0", o.style.transform = "translateY(-8px)", o.style.transition = "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)", setTimeout(() => {
        o.style.opacity = "1", o.style.transform = "translateY(0)";
      }, (e.length + n) * 15 + 50);
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
    e.forEach((a, r) => {
      const n = a, o = n.getAttribute("data-focused") === "true", s = n.style.opacity || "1";
      n.style.setProperty("opacity", s, "important");
      const l = o ? "0.4s" : "0.3s", d = "0";
      n.style.transition = `opacity ${l} cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)`;
      const h = setTimeout(() => {
        n.style.setProperty("opacity", d, "important"), n.style.transform = "translateY(-8px)";
      }, r * 8);
      this.bubbleAnimationTimers.add(h);
    });
    const t = this.tabContainer.querySelectorAll(".new-tab-button, .workspace-button");
    t.forEach((a, r) => {
      const n = a, o = n.style.opacity || "1";
      n.style.opacity = o, n.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)";
      const s = setTimeout(() => {
        n.style.opacity = "0", n.style.transform = "translateY(-8px)";
      }, (e.length + r) * 8);
      this.bubbleAnimationTimers.add(s);
    });
    const i = setTimeout(() => {
      const a = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)", r = this.isVerticalMode ? this.verticalPosition : this.position, n = ae(
        this.isVerticalMode,
        r,
        a,
        this.verticalWidth,
        void 0,
        void 0,
        !0,
        !1
      );
      this.tabContainer && (this.tabContainer.style.cssText = n, this.tabContainer.style.overflow = "clip", this.tabContainer.style.overflowY = "clip", this.tabContainer.style.overflowX = "clip", requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.tabContainer.style.transition = "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)", this.tabContainer.style.transform = "scale(0.8)", this.tabContainer.style.opacity = "0.7";
          const o = setTimeout(() => {
            e.forEach((l) => {
              l.style.setProperty("opacity", "0", "important");
            }), t.forEach((l) => {
              const d = l;
              d.style.opacity = "0";
            });
          }, 500);
          this.bubbleAnimationTimers.add(o);
          const s = setTimeout(() => {
            var h;
            this.createBubbleOverlay();
            const l = (h = this.tabContainer) == null ? void 0 : h.querySelector(".bubble-overlay");
            l && (l.style.opacity = "0", l.style.transform = "scale(0.9)", l.style.transition = "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)", requestAnimationFrame(() => {
              l.style.opacity = "1", l.style.transform = "scale(1)";
              const u = l.querySelector("div");
              if (u) {
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
                u.animate(b, {
                  duration: 400,
                  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                }).addEventListener("finish", () => {
                  u.style.filter = "", u.style.transform = "";
                });
              }
            })), this.tabContainer.style.transform = "scale(1)", this.tabContainer.style.opacity = "1";
            const d = setTimeout(() => {
              this.isBubbleAnimating = !1, this.verboseLog("🫧 收起动画完成");
            }, 100);
            this.bubbleAnimationTimers.add(d);
          }, 300);
          this.bubbleAnimationTimers.add(s);
        });
      }));
    }, 50);
    this.bubbleAnimationTimers.add(i), this.verboseLog("🫧 气泡已收起");
  }
  /**
   * 创建气泡覆盖层（用于最小化时覆盖所有内容）
   */
  createBubbleOverlay() {
    var n, o;
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
    const a = document.createElement("div"), r = document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark") || ((o = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : o.themeMode) === "dark";
    a.style.cssText = `
      font-size: 16px;
      font-weight: bold;
      color: ${r ? "var(--orca-color-text-1, #ffffff)" : "var(--orca-text-primary, #333)"};
      user-select: none;
      pointer-events: none;
      text-shadow: ${r ? "0 1px 2px rgba(0, 0, 0, 0.5)" : "none"};
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
    const e = this.tabContainer.getBoundingClientRect(), t = L.EDGE_DETECTION_DISTANCE;
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
      const i = L.EDGE_HINT_SIZE;
      switch (this.currentEdgeSide) {
        case "left":
          {
            const a = t.width, r = a - i;
            this.verboseLog(`📦 左贴边隐藏: containerWidth=${a}, hintSize=${i}, translateAmount=${r}`), this.tabContainer.style.transform = `translateX(-${r}px)`;
          }
          break;
        case "right":
          {
            const a = t.width, r = a - i;
            this.verboseLog(`📦 右贴边隐藏: containerWidth=${a}, hintSize=${i}, translateAmount=${r}`), this.tabContainer.style.transform = `translateX(${r}px)`;
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
    const t = this.currentLogLevel === M.VERBOSE;
    this.edgeHideTriggerElement.style.cssText = `
      position: fixed;
      z-index: 999;
      background: ${t ? "rgba(255, 0, 0, 0.3)" : "transparent"};
      pointer-events: auto;
      border: ${t ? "2px solid red" : "none"};
    `;
    const i = L.EDGE_TRIGGER_ZONE_SIZE, a = e || this.tabContainer.getBoundingClientRect();
    switch (this.currentEdgeSide) {
      case "left":
        this.edgeHideTriggerElement.style.left = "0", this.edgeHideTriggerElement.style.top = `${a.top}px`, this.edgeHideTriggerElement.style.width = `${i + L.EDGE_HINT_SIZE}px`, this.edgeHideTriggerElement.style.height = `${a.height}px`;
        break;
      case "right":
        this.edgeHideTriggerElement.style.right = "0", this.edgeHideTriggerElement.style.top = `${a.top}px`, this.edgeHideTriggerElement.style.width = `${i + L.EDGE_HINT_SIZE}px`, this.edgeHideTriggerElement.style.height = `${a.height}px`;
        break;
      case "top":
        this.edgeHideTriggerElement.style.left = `${a.left}px`, this.edgeHideTriggerElement.style.top = "0", this.edgeHideTriggerElement.style.width = `${a.width}px`, this.edgeHideTriggerElement.style.height = `${i + L.EDGE_HINT_SIZE}px`;
        break;
      case "bottom":
        this.edgeHideTriggerElement.style.left = `${a.left}px`, this.edgeHideTriggerElement.style.bottom = "0", this.edgeHideTriggerElement.style.width = `${a.width}px`, this.edgeHideTriggerElement.style.height = `${i + L.EDGE_HINT_SIZE}px`;
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
    const r = this.edgeHideTriggerElement.getBoundingClientRect();
    this.verboseLog(`🎯 创建触发区域: ${this.currentEdgeSide}侧`), this.verboseLog(`   - 触发区域大小: ${i}px`), this.verboseLog(`   - 触发区域位置: left=${r.left}, top=${r.top}, width=${r.width}, height=${r.height}`), this.verboseLog(`   - 容器位置（隐藏前）: left=${a.left}, top=${a.top}, width=${a.width}, height=${a.height}`), this.verboseLog(`   - 容器当前transform: ${this.tabContainer.style.transform}`), this.verboseLog(`   - isEdgeHideExpanded: ${this.isEdgeHideExpanded}`);
  }
  /**
   * 处理贴边隐藏的鼠标进入事件
   */
  handleEdgeHideMouseEnter() {
    if (this.verboseLog(`📥 handleEdgeHideMouseEnter - isExpanded: ${this.isEdgeHideExpanded}`), this.edgeHideCollapseTimer && (clearTimeout(this.edgeHideCollapseTimer), this.edgeHideCollapseTimer = null, this.verboseLog("⏹️ 清除收起定时器")), this.isEdgeHideExpanded) {
      this.verboseLog("✅ 已经展开，跳过");
      return;
    }
    this.verboseLog(`⏰ 设置展开定时器: ${L.EDGE_HIDE_EXPAND_DELAY}ms`), this.edgeHideExpandTimer = window.setTimeout(() => {
      this.verboseLog("🚀 展开定时器触发"), this.expandEdgeHide();
    }, L.EDGE_HIDE_EXPAND_DELAY);
  }
  /**
   * 处理贴边隐藏的鼠标离开事件
   */
  handleEdgeHideMouseLeave() {
    this.edgeHideExpandTimer && (clearTimeout(this.edgeHideExpandTimer), this.edgeHideExpandTimer = null), this.isEdgeHideExpanded && (this.edgeHideCollapseTimer = window.setTimeout(() => {
      this.collapseEdgeHide();
    }, L.EDGE_HIDE_COLLAPSE_DELAY));
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
    const e = L.EDGE_HINT_SIZE, t = this.tabContainer.getBoundingClientRect();
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
      const r = this.getCurrentPosition();
      if (!r) return;
      const n = this.calculateSidebarAlignmentPosition(
        r,
        e,
        i,
        a
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
  calculateSidebarAlignmentPosition(e, t, i, a) {
    var n;
    let r;
    if (i)
      r = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${r}px`);
    else if (a) {
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
      if (z(a)) {
        this.verboseLog(`⏭️ 跳过视图面板: ${a.title}`);
        continue;
      }
      try {
        const r = await orca.invokeBackend("get-block", parseInt(a.blockId));
        if (r) {
          const n = await pe(r), o = this.findProperty(r, "_color"), s = this.findProperty(r, "_icon");
          let l = a.color, d = a.icon;
          o && o.type === 1 && (l = o.value), s && s.type === 1 && s.value && s.value.trim() ? d = s.value : d || (d = G(n)), a.blockType !== n || a.icon !== d || a.color !== l ? (e[i] = {
            ...a,
            blockType: n,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${a.title} -> 类型: ${n}, 图标: ${d}, 颜色: ${l}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${a.title} (无需更新)`);
        }
      } catch (r) {
        this.warn(`更新标签失败: ${a.title}`, r);
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
      if (ee(e))
        return this.log("⚠️ sidebar 被 content-visibility 隐藏，跳过宽度获取以避免渲染警告"), 0;
      this.log("   侧边栏元素信息:"), this.log(`     - ID: ${e.id}`), this.log(`     - 类名: ${e.className}`), this.log(`     - 标签名: ${e.tagName}`);
      const i = window.getComputedStyle(e).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${i}"`), i && i !== "") {
        const r = parseInt(i.replace("px", ""));
        if (isNaN(r))
          this.log(`⚠️ CSS变量值无法解析为数字: "${i}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${r}px`), r;
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
    const t = e.clientX, i = this.verticalWidth, a = (n) => {
      const o = n.clientX - t, s = Math.max(120, Math.min(400, i + o));
      this.verticalWidth = s, this.tabContainer.style.width = `${s}px`;
    }, r = async () => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", r);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (n) {
        this.error("保存宽度设置失败:", n);
      }
    };
    document.addEventListener("mousemove", a), document.addEventListener("mouseup", r);
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
    t.className = "orca-tab", e.tabId || (e.tabId = K(e.blockId)), t.setAttribute("data-orca-tabs-tab-id", e.tabId), t.setAttribute("data-orca-tabs-block-id", e.blockId), this.isTabActive(e) && t.setAttribute("data-focused", "true");
    const a = this.isVerticalMode && !this.isFixedToTop && !this.isFixedToEditorTop, r = Ae(e, a, () => "", this.horizontalTabMaxWidth, this.horizontalTabMinWidth);
    t.style.cssText = r;
    const n = Li();
    if (e.icon && this.showBlockTypeIcons) {
      const l = Mi(e.icon);
      n.appendChild(l);
    }
    const o = Di(e.title);
    if (n.appendChild(o), e.isPinned) {
      const l = me();
      n.appendChild(l);
    }
    const s = Bi();
    return s.addEventListener("click", (l) => {
      l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.closeTab(e);
    }), n.appendChild(s), t.appendChild(n), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), this.hideTabTooltips || B(t, ke(e)), t.addEventListener("click", (l) => {
      var b;
      const d = l.target;
      if (d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle"))
        return;
      if (t.getAttribute("data-long-pressed") === "true") {
        t.removeAttribute("data-long-pressed");
        return;
      }
      if (document.querySelector(".hover-tab-list-container")) {
        D();
        return;
      }
      l.preventDefault(), this.verboseLog(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`), this.closedTabs.has(e.blockId) && (this.closedTabs.delete(e.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${e.title}"，从已关闭列表中移除`));
      const u = (b = this.tabContainer) == null ? void 0 : b.querySelectorAll(".orca-tabs-plugin .orca-tab");
      u == null || u.forEach((g) => g.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (l) => {
    }), t.addEventListener("dblclick", (l) => {
      const d = l.target;
      d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle") || (l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.log(`🔧 双击事件处理: enableDoubleClickClose=${this.enableDoubleClickClose}`), this.enableDoubleClickClose ? (this.log("🔧 双击关闭标签页"), this.closeTab(e)) : (this.log("🔧 双击切换固定状态"), this.toggleTabPinStatus(e)));
    }), t.addEventListener("auxclick", (l) => {
      l.button === 1 && (l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.log(`🔧 中键事件处理: enableMiddleClickPin=${this.enableMiddleClickPin}`), this.enableMiddleClickPin ? (this.log("🔧 中键固定标签页"), this.toggleTabPinStatus(e)) : (this.log("🔧 中键关闭标签页"), this.closeTab(e)));
    }), t.addEventListener("keydown", (l) => {
      (l.target === t || t.contains(l.target)) && (l.key === "F2" ? (l.preventDefault(), l.stopPropagation(), this.renameTab(e)) : l.ctrlKey && l.key === "w" && (l.preventDefault(), l.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), this.addLongPressTabListEvents(t, e), t.draggable = !0, t.addEventListener("dragstart", (l) => {
      var u, b;
      const d = l.target;
      if (d.closest && d.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        l.preventDefault();
        return;
      }
      if (d.classList.contains("drag-handle") || d.closest && d.closest(".drag-handle")) {
        l.preventDefault();
        return;
      }
      l.dataTransfer.effectAllowed = "move", l.dataTransfer.dropEffect = "move", (u = l.dataTransfer) == null || u.setData("text/plain", e.blockId);
      const h = document.createElement("img");
      h.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", h.style.opacity = "0";
      try {
        const g = t.getBoundingClientRect(), m = l.clientX - g.left, p = l.clientY - g.top;
        (b = l.dataTransfer) == null || b.setDragImage(h, m, p);
      } catch {
      }
      this.draggingTab = e, this.dragOverTab = null, this.lastSwapKey = "", this.activeDragPayload = { kind: "tab", panelId: e.panelId, key: e.blockId, tab: e }, this.setupPanelDropListeners(), this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (this.verboseLog("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), this.verboseLog("🔄 拖拽开始，设置draggingTab:", e.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), requestAnimationFrame(() => {
        t.style.opacity = "0", t.style.pointerEvents = "none";
      }), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", async (l) => {
      this.verboseLog("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (this.verboseLog("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback();
      const d = this.getCurrentPanelTabs();
      await this.setCurrentPanelTabs(d), this.draggingTab = null, this.dragOverTab = null, this.lastSwapKey = "", this.activeDragPayload = null, this.hidePanelDropHint(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
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
          const h = t.getBoundingClientRect(), u = this.isVerticalMode && !this.isFixedToTop && !this.isFixedToEditorTop;
          let b;
          if (u) {
            const m = h.top + h.height / 2;
            b = l.clientY < m ? "before" : "after";
          } else {
            const m = h.left + h.width / 2;
            b = l.clientX < m ? "before" : "after";
          }
          this.updateDropIndicator(t, b), this.dragOverTab = e;
          const g = `${e.blockId}-${b}`;
          this.lastSwapKey !== g && (this.lastSwapKey = g, this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = setTimeout(async () => {
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
      const d = t.getBoundingClientRect(), h = l.clientX, u = l.clientY, b = 5;
      (h < d.left - b || h > d.right + b || u < d.top - b || u > d.bottom + b) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (l) => {
      var h;
      l.preventDefault(), l.stopPropagation();
      const d = (h = l.dataTransfer) == null ? void 0 : h.getData("text/plain");
      this.log(`🔄 拖拽放置完成: ${d} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return $i(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const i = parseInt(t[1], 16), a = parseInt(t[2], 16), r = parseInt(t[3], 16);
      return (0.299 * i + 0.587 * a + 0.114 * r) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const i = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (i) {
      let a = parseInt(i[1], 16), r = parseInt(i[2], 16), n = parseInt(i[3], 16);
      a = Math.floor(a * (1 - t)), r = Math.floor(r * (1 - t)), n = Math.floor(n * (1 - t));
      const o = a.toString(16).padStart(2, "0"), s = r.toString(16).padStart(2, "0"), l = n.toString(16).padStart(2, "0");
      return `#${o}${s}${l}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, i) {
    const a = e / 255, r = t / 255, n = i / 255, o = (H) => H <= 0.04045 ? H / 12.92 : Math.pow((H + 0.055) / 1.055, 2.4), s = o(a), l = o(r), d = o(n), h = s * 0.4124564 + l * 0.3575761 + d * 0.1804375, u = s * 0.2126729 + l * 0.7151522 + d * 0.072175, b = s * 0.0193339 + l * 0.119192 + d * 0.9503041, g = 0.2104542553 * h + 0.793617785 * u - 0.0040720468 * b, m = 1.9779984951 * h - 2.428592205 * u + 0.4505937099 * b, p = 0.0259040371 * h + 0.7827717662 * u - 0.808675766 * b, f = Math.cbrt(g), y = Math.cbrt(m), w = Math.cbrt(p), x = 0.2104542553 * f + 0.793617785 * y + 0.0040720468 * w, T = 1.9779984951 * f - 2.428592205 * y + 0.4505937099 * w, E = 0.0259040371 * f + 0.7827717662 * y - 0.808675766 * w, k = Math.sqrt(T * T + E * E), I = Math.atan2(E, T) * 180 / Math.PI, S = I < 0 ? I + 360 : I;
    return { l: x, c: k, h: S };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, i) {
    const a = i * Math.PI / 180, r = t * Math.cos(a), n = t * Math.sin(a), o = e, s = r, l = n, d = o * o * o, h = s * s * s, u = l * l * l, b = 1.0478112 * d + 0.0228866 * h - 0.050217 * u, g = 0.0295424 * d + 0.9904844 * h + 0.0170491 * u, m = -92345e-7 * d + 0.0150436 * h + 0.7521316 * u, p = 3.2404542 * b - 1.5371385 * g - 0.4985314 * m, f = -0.969266 * b + 1.8760108 * g + 0.041556 * m, y = 0.0556434 * b - 0.2040259 * g + 1.0572252 * m, w = (k) => k <= 31308e-7 ? 12.92 * k : 1.055 * Math.pow(k, 1 / 2.4) - 0.055, x = Math.max(0, Math.min(255, Math.round(w(p) * 255))), T = Math.max(0, Math.min(255, Math.round(w(f) * 255))), E = Math.max(0, Math.min(255, Math.round(w(y) * 255)));
    return { r: x, g: T, b: E };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return ji(e, t);
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
    if (this.currentWorkspace) {
      this.log("🚫 在工作区状态下，跳过保存普通面板标签数据");
      return;
    }
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
    if (this.currentWorkspace) {
      this.log("🚫 在工作区状态下，跳过保存普通面板标签数据");
      return;
    }
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
      const r = i.indexOf(a);
      r !== -1 ? (this.currentPanelIndex = r, this.currentPanelId = a) : this.warn(`⚠️ 目标面板 ${a} 不在面板列表中`), this.verboseLog(`🎯 目标面板ID: ${a}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(a);
      } catch (n) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", n);
      }
      if (z(e)) {
        const n = e.blockId.startsWith("view:") ? e.blockId.substring(5) : e.panelId;
        this.verboseLog(`🖼️ 检测到视图面板，使用 switchFocusTo 导航: ${n}`);
        try {
          orca.nav.switchFocusTo(n), this.verboseLog(`✅ 视图面板导航成功: ${e.title}`), this.lastActiveBlockId = e.blockId, setTimeout(() => {
            this.isSwitchingTab = !1;
          }, 300);
          return;
        } catch (o) {
          this.warn("⚠️ 视图面板导航失败:", o);
        }
      }
      try {
        this.verboseLog(`🚀 尝试使用安全导航到块 ${e.blockId}`), await this.safeNavigate(e.blockId, a, e), this.verboseLog("✅ 安全导航成功");
      } catch (n) {
        this.warn("导航失败，尝试备用方法:", n);
        const o = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (o)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), o.click();
        else {
          this.error("无法找到目标块元素:", e.blockId);
          const s = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          s ? (this.log("🔄 找到备用块元素，尝试点击"), s.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = e.blockId, this.verboseLog(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
        this.debugScrollPosition(e);
      }, 500), await this.focusTabElementById(e.tabId || e.blockId, e.blockId), this.enableBubbleMode && this.isBubbleExpanded && this.tabContainer && requestAnimationFrame(() => {
        var o;
        const n = (o = this.tabContainer) == null ? void 0 : o.querySelectorAll(".orca-tab");
        n == null || n.forEach((s) => {
          const l = s;
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
    const t = this.getCurrentPanelTabs(), i = t.findIndex((r) => r.blockId === e.blockId);
    if (i === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let a = -1;
    if (i === 0 ? a = 1 : i === t.length - 1 ? a = i - 1 : a = i + 1, a >= 0 && a < t.length) {
      const r = t[a];
      this.log(`🔄 自动切换到相邻标签: "${r.title}" (位置: ${a})`), this.currentPanelId && await this.safeNavigate(r.blockId, this.currentPanelId || "", r);
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), i = st(e, t, {
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
        },
        enableMergedTabBar: {
          label: "合并显示所有面板标签",
          type: "boolean",
          defaultValue: !1,
          description: "开启后在一个标签栏中分组显示所有面板的标签（含每个面板最近的视图历史），不再随面板切换而变化"
        }
      };
      await orca.plugins.setSettingsSchema(this.pluginName, t);
      const i = (e = orca.state.plugins[this.pluginName]) == null ? void 0 : e.settings;
      i != null && i.homePageBlockId && (this.homePageBlockId = i.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (i == null ? void 0 : i.showInHeadbar) !== void 0 && (this.showInHeadbar = i.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (i == null ? void 0 : i.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = i.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (i == null ? void 0 : i.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = i.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (i == null ? void 0 : i.enableWorkspaces) !== void 0 && (this.enableWorkspaces = i.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), (i == null ? void 0 : i.debugMode) !== void 0 && (i.debugMode ? this.setLogLevel(M.VERBOSE) : this.setLogLevel(M.INFO), await this.storageService.saveConfig(C.DEBUG_MODE, i.debugMode, this.pluginName)), (i == null ? void 0 : i.restoreFocusedTab) !== void 0 && (this.restoreFocusedTab = i.restoreFocusedTab, this.log(`🎯 刷新后恢复聚焦标签页: ${this.restoreFocusedTab ? "开启" : "关闭"}`), await this.storageService.saveConfig(C.RESTORE_FOCUSED_TAB, i.restoreFocusedTab, this.pluginName)), (i == null ? void 0 : i.enableMiddleClickPin) !== void 0 && (this.enableMiddleClickPin = i.enableMiddleClickPin, this.enableDoubleClickClose = i.enableMiddleClickPin, await this.storageService.saveConfig(C.ENABLE_MIDDLE_CLICK_PIN, i.enableMiddleClickPin, this.pluginName), await this.storageService.saveConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, i.enableMiddleClickPin, this.pluginName)), (i == null ? void 0 : i.enableDoubleClickClose) !== void 0 && (this.enableMiddleClickPin = i.enableDoubleClickClose, this.enableDoubleClickClose = i.enableDoubleClickClose, await this.storageService.saveConfig(C.ENABLE_MIDDLE_CLICK_PIN, i.enableDoubleClickClose, this.pluginName), await this.storageService.saveConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, i.enableDoubleClickClose, this.pluginName)), (i == null ? void 0 : i.hideTabTooltips) !== void 0 && (this.hideTabTooltips = i.hideTabTooltips, this.log(`💬 标签页提示: ${i.hideTabTooltips ? "隐藏" : "显示"}`)), (i == null ? void 0 : i.enableMergedTabBar) !== void 0 && (this.enableMergedTabBar = i.enableMergedTabBar, await this.storageService.saveConfig(C.ENABLE_MERGED_TAB_BAR, i.enableMergedTabBar, this.pluginName), this.log(`🔀 合并显示所有面板标签: ${this.enableMergedTabBar ? "开启" : "关闭"}`), this.enableMergedTabBar && this.enableMergedModeWatchers()), this.log("✅ 插件设置已注册");
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
      debugMode: this.currentLogLevel === M.VERBOSE,
      restoreFocusedTab: this.restoreFocusedTab,
      enableMiddleClickPin: this.enableMiddleClickPin,
      hideTabTooltips: this.hideTabTooltips,
      enableMergedTabBar: this.enableMergedTabBar
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
        const r = this.showInHeadbar;
        this.showInHeadbar = i.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${r ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (i.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = i.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), i.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const r = this.enableWorkspaces;
        this.enableWorkspaces = i.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${r ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.enableWorkspaces || this.removeWorkspaceButton(), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
      }
      if (i.debugMode !== this.lastSettings.debugMode && (i.debugMode ? this.setLogLevel(M.VERBOSE) : this.setLogLevel(M.INFO), this.storageService.saveConfig(C.DEBUG_MODE, i.debugMode, this.pluginName).catch((r) => {
        this.error("保存调试模式设置失败:", r);
      }), this.lastSettings.debugMode = i.debugMode), i.restoreFocusedTab !== this.lastSettings.restoreFocusedTab) {
        const r = this.restoreFocusedTab;
        this.restoreFocusedTab = i.restoreFocusedTab, this.log(`🎯 设置变化：刷新后恢复聚焦标签页 ${r ? "开启" : "关闭"} -> ${this.restoreFocusedTab ? "开启" : "关闭"}`), this.storageService.saveConfig(C.RESTORE_FOCUSED_TAB, i.restoreFocusedTab, this.pluginName).catch((n) => {
          this.error("保存聚焦标签页恢复设置失败:", n);
        }), this.lastSettings.restoreFocusedTab = this.restoreFocusedTab;
      }
      const a = i.enableMiddleClickPin !== void 0 ? i.enableMiddleClickPin : i.enableDoubleClickClose;
      if (a !== void 0 && a !== this.lastSettings.enableMiddleClickPin) {
        const r = !!a;
        this.enableMiddleClickPin = r, this.enableDoubleClickClose = r, this.storageService.saveConfig(C.ENABLE_MIDDLE_CLICK_PIN, r, this.pluginName).catch((n) => this.error("保存中键固定设置失败:", n)), this.storageService.saveConfig(C.ENABLE_DOUBLE_CLICK_CLOSE, r, this.pluginName).catch((n) => this.error("保存双击关闭设置失败:", n)), this.lastSettings.enableMiddleClickPin = r, (t = this.updateFeatureToggleButton) == null || t.call(this);
      }
      if (i.hideTabTooltips !== void 0 && i.hideTabTooltips !== this.lastSettings.hideTabTooltips) {
        const r = this.hideTabTooltips;
        this.hideTabTooltips = i.hideTabTooltips, this.log(`💬 设置变化：标签页提示 ${r ? "隐藏" : "显示"} -> ${this.hideTabTooltips ? "隐藏" : "显示"}`), this.updateAllTabTooltips(), this.lastSettings.hideTabTooltips = this.hideTabTooltips;
      }
      if (i.enableMergedTabBar !== void 0 && i.enableMergedTabBar !== this.lastSettings.enableMergedTabBar) {
        const r = this.enableMergedTabBar;
        this.enableMergedTabBar = !!i.enableMergedTabBar, this.log(`🔀 设置变化：合并显示所有面板标签 ${r ? "开启" : "关闭"} -> ${this.enableMergedTabBar ? "开启" : "关闭"}`), this.storageService.saveConfig(C.ENABLE_MERGED_TAB_BAR, this.enableMergedTabBar, this.pluginName).catch((n) => this.error("保存合并标签栏设置失败:", n)), this.lastSettings.enableMergedTabBar = this.enableMergedTabBar, this.enableMergedTabBar ? this.enableMergedModeWatchers() : this.disableMergedModeWatchers(), this.debouncedUpdateTabsUI();
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
        const i = t.getAttribute("data-orca-tabs-tab-id");
        if (i) {
          const a = this.getCurrentPanelTabs(), r = a.find((n) => n.tabId === i) || a.find((n) => n.blockId === i);
          r && B(t, ke(r));
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
              i(), this.getTabInfo(e.toString(), this.currentPanelId || "" || "", 0).then((r) => {
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
        tabId: K(e),
        panelId: this.currentPanelId || "",
        title: t,
        isPinned: !1,
        order: i.length
      };
      this.log(`📋 新标签页信息: "${a.title}" (ID: ${e})`);
      const r = this.getCurrentActiveTab();
      let n = i.length;
      if (this.log(`📊 当前标签数量: ${i.length}, 标签列表: ${i.map((o) => o.title).join(", ")}`), this.addNewTabToEnd)
        n = i.length, this.log(`🎯 [一次性] 将新标签添加到末尾: "${a.title}", 插入位置: ${n}`), this.addNewTabToEnd = !1, this.log("♻️ 已重置标志，后续新标签将在聚焦标签后插入");
      else if (r) {
        const o = i.findIndex((s) => s.blockId === r.blockId);
        o !== -1 && (n = o + 1, this.log(`🎯 将在聚焦标签 "${r.title}" 后面插入新标签: "${a.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (i.length >= this.maxTabs) {
        i.splice(n, 0, a), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${a.title}`);
        const o = this.findLastNonPinnedTabIndex();
        if (o !== -1) {
          const s = i[o];
          i.splice(o, 1), this.log(`🗑️ 删除末尾的非固定标签: "${s.title}" 来保持数量限制`), i.forEach((l, d) => {
            l.order = d;
          });
        } else {
          const s = i.findIndex((l) => l.blockId === a.blockId);
          if (s !== -1) {
            i.splice(s, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${a.title}"`);
            return;
          }
        }
      } else
        i.splice(n, 0, a), this.verboseLog(`➕ 在位置 ${n} 插入新标签: ${a.title}`);
      i.forEach((o, s) => {
        o.order = s;
      }), this.lastActiveTabInstanceId = a.tabId || null, this.log(`🔄 已重新计算标签顺序: ${i.map((o) => `${o.title}(${o.order})`).join(", ")}`), this.syncCurrentTabsToStorage(i), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 创建新标签页，实时更新工作区: ${a.title}`)), await this.safeNavigate(e, this.currentPanelId || "", a), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${a.title}"`);
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
      var n, o, s;
      const a = (n = this.tabContainer) == null ? void 0 : n.querySelectorAll(".orca-tabs-plugin .orca-tab");
      a == null || a.forEach((l) => l.removeAttribute("data-focused"));
      let r = (o = this.tabContainer) == null ? void 0 : o.querySelector(`[data-orca-tabs-tab-id="${e}"]`);
      if (!r && t && (r = (s = this.tabContainer) == null ? void 0 : s.querySelector(`[data-orca-tabs-block-id="${t}"]`)), r) {
        r.setAttribute("data-focused", "true");
        const l = r.getAttribute("data-orca-tabs-tab-id");
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
      const r = a.find((l) => l.blockId === e);
      if (r)
        return this.verboseLog(`📋 [DEBUG] ❌ 块 ${e} 已存在于标签页中: "${r.title}"`), this.closedTabs.has(e) && (this.verboseLog(`📋 [DEBUG] 从closedTabs中移除 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.verboseLog(`📋 [DEBUG] 切换到已存在标签: "${r.title}"`), await this.switchToTab(r), await this.focusTabElementById(r.tabId || r.blockId, r.blockId), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（已存在）=========="), !0;
      this.verboseLog(`📋 [DEBUG] ✅ 块 ${e} 不存在，准备创建新标签`), this.creatingTabs.has(e) ? this.verboseLog(`📋 [DEBUG] ℹ️ 块 ${e} 已在 creatingTabs 中（可能来自 Ctrl+点击）`) : (this.verboseLog(`📋 [DEBUG] 🔒 将块 ${e} 添加到 creatingTabs 集合，防止重复处理`), this.creatingTabs.add(e));
      let n = null;
      try {
        if (e.startsWith("view:"))
          return this.verboseLog(`⏭️ 跳过视图面板的块信息获取: ${e}`), !1;
        if (!orca.state.blocks[parseInt(e)])
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法找到块 ${e}`), this.warn(`无法找到块 ${e}`), !1;
        if (this.verboseLog("📋 [addTabToPanel] 找到块信息"), this.verboseLog("📋 [addTabToPanel] 获取标签信息..."), n = await this.getTabInfo(e, this.currentPanelId || "", a.length), !n)
          return this.verboseLog(`📋 [addTabToPanel] 错误 - 无法获取块 ${e} 的标签信息`), this.warn(`无法获取块 ${e} 的标签信息`), !1;
        this.verboseLog(`📋 [addTabToPanel] 标签信息: "${n.title}" (类型: ${n.blockType})`);
      } finally {
        this.verboseLog(`📋 [DEBUG] 🔓 从 creatingTabs 集合中移除块 ${e}`), this.creatingTabs.delete(e);
      }
      let o = a.length, s = !1;
      if (this.verboseLog(`📋 [addTabToPanel] 插入模式: ${t}`), t === "replace") {
        this.verboseLog("📋 [addTabToPanel] 替换模式 - 获取当前聚焦标签");
        const l = this.getCurrentActiveTab();
        if (!l)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 没有找到当前聚焦的标签"), this.warn("没有找到当前聚焦的标签"), !1;
        this.verboseLog(`📋 [addTabToPanel] 聚焦标签: "${l.title}" (${l.blockId})`);
        const d = a.findIndex((h) => h.blockId === l.blockId);
        if (d === -1)
          return this.verboseLog("📋 [addTabToPanel] 错误 - 无法找到聚焦标签在数组中的位置"), this.warn("无法找到聚焦标签在数组中的位置"), !1;
        l.isPinned ? (this.verboseLog("📋 [addTabToPanel] 聚焦标签是固定的，改为插入模式"), this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), o = d + 1, s = !1) : (this.verboseLog(`📋 [addTabToPanel] 将替换位置 ${d} 的标签`), o = d, s = !0);
      } else if (t === "after") {
        this.verboseLog("📋 [addTabToPanel] After模式 - 在聚焦标签后插入");
        const l = this.getCurrentActiveTab();
        if (l) {
          this.verboseLog(`📋 [addTabToPanel] 找到聚焦标签: "${l.title}" (${l.blockId})`);
          const d = a.findIndex((h) => h.blockId === l.blockId);
          d !== -1 ? (o = d + 1, this.verboseLog(`📋 [addTabToPanel] 将在位置 ${o} 插入（聚焦标签后面）`), this.log("📌 在聚焦标签后面插入新标签")) : this.verboseLog("📋 [addTabToPanel] 警告 - 聚焦标签不在列表中，使用默认位置");
        } else
          this.verboseLog("📋 [addTabToPanel] 警告 - 没有找到聚焦标签，使用默认位置");
      }
      if (this.verboseLog(`📋 [addTabToPanel] 最终插入位置: ${o}, 替换模式: ${s}`), a.length >= this.maxTabs)
        if (this.verboseLog(`📋 [addTabToPanel] 已达到标签上限 ${this.maxTabs}`), s)
          this.verboseLog(`📋 [addTabToPanel] 替换位置 ${o} 的标签`), a[o] = n;
        else {
          this.verboseLog("📋 [addTabToPanel] 插入新标签并删除最后一个非固定标签"), a.splice(o, 0, n);
          const l = this.findLastNonPinnedTabIndex();
          if (l !== -1)
            this.verboseLog(`📋 [addTabToPanel] 删除位置 ${l} 的非固定标签`), a.splice(l, 1);
          else {
            this.verboseLog("📋 [addTabToPanel] 所有标签都是固定的，无法插入");
            const d = a.findIndex((h) => h.blockId === n.blockId);
            return d !== -1 && a.splice(d, 1), !1;
          }
        }
      else
        this.verboseLog(`📋 [addTabToPanel] 标签数量未达到上限，直接${s ? "替换" : "插入"}`), s ? a[o] = n : a.splice(o, 0, n);
      return this.verboseLog(`📋 [addTabToPanel] 插入后标签列表: ${a.map((l) => `${l.title}(${l.blockId})`).join(", ")}`), this.verboseLog("📋 [DEBUG] 同步更新存储数组..."), this.syncCurrentTabsToStorage(a), this.verboseLog("📋 [DEBUG] 保存标签数据..."), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (this.verboseLog(`📋 [DEBUG] 更新工作区: ${this.currentWorkspace}`), await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页添加，实时更新工作区: ${n.title}`)), this.verboseLog("📋 [DEBUG] 更新UI..."), await this.updateTabsUI(), i ? (this.verboseLog(`📋 [DEBUG] 开始导航到块 ${e}`), await this.safeNavigate(e, this.currentPanelId || "", n)) : this.verboseLog("📋 [DEBUG] 跳过导航（后台打开模式）"), this.verboseLog("📋 [DEBUG] ========== addTabToPanel 完成（成功）=========="), !0;
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
      if (i && z(i)) {
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
          } catch (r) {
            this.warn("⚠️ [safeNavigate] journal 导航失败，回退到块导航:", r);
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
        const l = parseInt(t[1]), d = parseInt(t[2]) - 1, h = parseInt(t[3]), u = new Date(l, d, h);
        if (!isNaN(u.getTime()))
          return u;
      }
      const i = e.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (i) {
        const l = parseInt(i[1]), d = parseInt(i[2]) - 1, h = parseInt(i[3]), u = new Date(l, d, h);
        if (!isNaN(u.getTime()))
          return u;
      }
      const a = e.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (a) {
        const l = parseInt(a[1]) - 1, d = parseInt(a[2]), h = parseInt(a[3]), u = new Date(h, l, d);
        if (!isNaN(u.getTime()))
          return u;
      }
      const r = e.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (r) {
        const l = parseInt(r[1]), d = parseInt(r[2]) - 1, h = parseInt(r[3]);
        if (!a) {
          const u = new Date(h, d, l);
          if (!isNaN(u.getTime()))
            return u;
        }
      }
      const n = e.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
      if (n) {
        const l = parseInt(n[1]), d = parseInt(n[2]) - 1, h = parseInt(n[3]), u = new Date(l, d, h);
        if (!isNaN(u.getTime()))
          return u;
      }
      const o = e.match(/(\d{4})(\d{2})(\d{2})/);
      if (o) {
        const l = parseInt(o[1]), d = parseInt(o[2]) - 1, h = parseInt(o[3]), u = new Date(l, d, h);
        if (!isNaN(u.getTime()))
          return u;
      }
      const s = e.match(/(\d{1,2})月(\d{1,2})日/);
      if (s) {
        const d = (/* @__PURE__ */ new Date()).getFullYear(), h = parseInt(s[1]) - 1, u = parseInt(s[2]), b = new Date(d, h, u);
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
    var t;
    this.verboseLog("🔗 [DEBUG] ========== openInNewTab 开始 =========="), this.verboseLog(`🔗 [DEBUG] 目标块ID: ${e}`), this.verboseLog(`🔗 [DEBUG] 当前面板ID: ${this.currentPanelId}, 索引: ${this.currentPanelIndex}`), this.verboseLog(`🔗 [DEBUG] creatingTabs 当前包含: ${Array.from(this.creatingTabs).join(", ") || "(空)"}`);
    try {
      if (this.enableMergedTabBar) {
        if (e.startsWith("view:")) {
          this.verboseLog(`🔗 [DEBUG] 合并模式：跳过视图面板 ${e}`);
          return;
        }
        const n = ((t = orca.state) == null ? void 0 : t.activePanel) || this.currentPanelId || "";
        if (this.verboseLog(`🔗 [DEBUG] 合并模式：在面板 ${n} 后台打开块 ${e}`), !n)
          return;
        const o = parseInt(e, 10), s = orca.nav.findViewPanel(n, orca.state.panels), l = (s == null ? void 0 : s.view) ?? null, d = s != null && s.viewArgs ? { ...s.viewArgs } : null, h = await this.fetchBlockData(o);
        orca.nav.goTo("block", { blockId: o }, n);
        const u = this.makeHistoryKey("block", { blockId: o });
        let b = this.panelHistoryMap.get(n);
        if (b || (b = [], this.panelHistoryMap.set(n, b)), !b.some((g) => g.key === u)) {
          for (b.push({
            panelId: n,
            key: u,
            view: "block",
            viewArgs: { blockId: o },
            title: h ? this.resolveBlockTitle(h, 0) : `块 ${o}`,
            icon: this.resolveHistoryEntryIcon("block", { blockId: o }, h),
            color: this.resolveBlockColor(h),
            used: ++this.historyUseCounter
          }); b.length > this.maxTabs; ) {
            let g = -1, m = 1 / 0;
            for (let p = 0; p < b.length; p++)
              b[p].key !== u && !b[p].isPinned && b[p].used < m && (m = b[p].used, g = p);
            if (g < 0) break;
            b.splice(g, 1);
          }
          this.sortMergedListByPin(b);
        }
        l && d && orca.nav.goTo(l, d, n), this.debouncedUpdateTabsUI(), this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成（合并模式后台打开）==========");
        return;
      }
      const i = this.getCurrentPanelTabs();
      this.verboseLog(`🔗 [DEBUG] 当前标签页数量: ${i.length}`), this.verboseLog("🔗 [DEBUG] 当前标签页列表:"), i.forEach((n, o) => {
        this.verboseLog(`🔗 [DEBUG]   [${o}] ${n.title} (ID: ${n.blockId}, 固定: ${n.isPinned})`);
      });
      const a = i.find((n) => n.blockId === e);
      if (a) {
        this.verboseLog(`🔗 [DEBUG] ❌ 块 ${e} 已存在，标签: "${a.title}"，无需操作`), this.closedTabs.has(e) && (this.verboseLog(`🔗 [DEBUG] 从已关闭列表中移除块 ${e}`), this.closedTabs.delete(e), await this.saveClosedTabs()), this.creatingTabs.has(e) && (this.verboseLog(`🔓 [DEBUG] 从 creatingTabs 中移除 ${e}（已存在）`), this.creatingTabs.delete(e)), this.verboseLog("🔗 [DEBUG] ========== openInNewTab 完成（已存在）==========");
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
    } catch (i) {
      this.error("[DEBUG] ❌ openInNewTab 处理失败:", i), this.creatingTabs.has(e) && (this.verboseLog(`🔓 [DEBUG] 异常时从 creatingTabs 中移除 ${e}`), this.creatingTabs.delete(e));
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
        const r = a.classList;
        if (r.contains("orca-block-handle") || r.contains("block-handle")) {
          let o = a.getAttribute("data-block-id") || a.getAttribute("data-blockid") || a.getAttribute("data-id");
          if (!o) {
            let s = a.parentElement;
            for (; s && s !== document.body && (o = s.getAttribute("data-block-id") || s.getAttribute("data-blockid") || s.getAttribute("data-id"), !(o && !isNaN(parseInt(o)) || s.classList.contains("orca-block") || s.classList.contains("orca-block-editor") || s.classList.contains("orca-hideable"))); )
              s = s.parentElement;
          }
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从块标中提取到块ID: ${o}`), o;
        }
        if (r.contains("orca-inline-r-content") || r.contains("orca-ref") || r.contains("block-ref") || r.contains("block-reference") || r.contains("orca-fragment-r") || r.contains("fragment-r") || r.contains("orca-block-reference") || a.tagName.toLowerCase() === "a" && ((t = a.getAttribute("href")) != null && t.startsWith("#"))) {
          const o = a.getAttribute("data-block-id") || a.getAttribute("data-ref-id") || a.getAttribute("data-blockid") || a.getAttribute("data-target-block-id") || a.getAttribute("data-fragment-v") || a.getAttribute("data-v") || ((i = a.getAttribute("href")) == null ? void 0 : i.replace("#", "")) || a.getAttribute("data-id");
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从元素中提取到块引用ID: ${o}`), o;
        }
        if (r.contains("orca-block") || r.contains("orca-block-editor") || r.contains("orca-hideable")) {
          const o = a.getAttribute("data-block-id") || a.getAttribute("data-blockid") || a.getAttribute("data-id");
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从块容器中提取到块ID: ${o}`), o;
        }
        const n = a.dataset;
        for (const [o, s] of Object.entries(n))
          if ((o.toLowerCase().includes("block") || o.toLowerCase().includes("ref")) && s && !isNaN(parseInt(s)))
            return this.log(`🔗 从data属性 ${o} 中提取到块引用ID: ${s}`), s;
        a = a.parentElement;
      }
      if (e.textContent) {
        const r = e.textContent.trim(), n = r.match(/\[\[(?:块)?(\d+)\]\]/) || r.match(/block[:\s]*(\d+)/i);
        if (n && n[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${n[1]}`), n[1];
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
    return Pi(e, t, i, a);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.getPanelIds()[this.currentPanelIndex], i = orca.nav.findViewPanel(t, orca.state.panels);
      if (i && i.viewState) {
        let a = null;
        const r = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (r) {
          const n = r.closest(".orca-panel");
          n && (a = n.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!a) {
          const n = document.querySelector(".orca-panel.active");
          n && (a = n.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (a || (a = document.body.scrollTop > 0 ? document.body : document.documentElement), a) {
          const n = {
            x: a.scrollLeft || 0,
            y: a.scrollTop || 0
          };
          i.viewState.scrollPosition = n;
          const o = this.getCurrentPanelTabs().findIndex((s) => s.blockId === e.blockId);
          o !== -1 && (this.getCurrentPanelTabs()[o].scrollPosition = n, await this.saveCurrentPanelTabs()), this.verboseLog(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, n, "容器:", a.className);
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
      const i = this.getCurrentPanelTabs(), a = i.findIndex((s) => s.blockId === e);
      if (a === -1) {
        this.verboseLog(`⚠️ 未找到要替换的标签: ${e}`);
        return;
      }
      const r = this.getCurrentActiveTab(), n = r && r.blockId === e, o = i[a];
      i[a] = t, this.verboseLog(`🔄 替换标签页: "${o.title}" -> "${t.title}"`), await this.setCurrentPanelTabs(i), await this.immediateUpdateTabsUI(), n && (this.verboseLog(`🎯 重新聚焦到替换后的标签: ${t.title}`), this.isNavigating = !0, await new Promise((s) => setTimeout(s, 50)), await this.switchToTab(t), setTimeout(() => {
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
    let i = null, a = null, r = 0, n = !1, o = null;
    const s = (u) => {
      if (!n || !o) return;
      const b = u.clientX - o.x, g = u.clientY - o.y;
      b * b + g * g > 25 && (this.verboseLog(`🚫 检测到移动，取消长按: ${t.title}`), l());
    }, l = () => {
      i && (clearTimeout(i), i = null), n = !1, o = null, document.removeEventListener("mousemove", s);
    }, d = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: !0,
      maxWidth: 150
    };
    e.addEventListener("mousedown", (u) => {
      if (u.button !== 0) return;
      const b = u.target;
      if (!(b.classList.contains("drag-handle") || b.closest && b.closest(".drag-handle"))) {
        if (e.hasAttribute("data-renaming")) {
          this.verboseLog(`✏️ 标签 ${t.title} 正在重命名，不启用长按切换列表`);
          return;
        }
        n = !0, o = { x: u.clientX, y: u.clientY }, document.addEventListener("mousemove", s), this.verboseLog(`🖱️ 开始长按标签: ${t.title}`), i = window.setTimeout(async () => {
          if (n) {
            if (this.draggingTab || this.isDragging) {
              this.verboseLog(`🚫 正在拖拽标签，取消长按列表: ${t.title}`);
              return;
            }
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
              const m = (await this.tabStorageService.restoreRecentTabSwitchHistory()).global_tab_history;
              if (this.verboseLog(`📋 全局切换历史记录: ${m ? m.recentTabs.length : 0} 个记录`), !m || m.recentTabs.length === 0) {
                this.verboseLog("⚠️ 没有全局切换历史记录，不显示悬浮列表");
                return;
              }
              const p = m.recentTabs;
              this.verboseLog(`📋 去重后的历史记录: ${p.length} 个记录`);
              const f = this.getCurrentPanelTabs(), y = new Set(f.map((I) => I.blockId)), w = p.filter((I) => !y.has(I.blockId));
              if (this.verboseLog(`📋 过滤后的历史记录: ${w.length} 个记录（已过滤 ${p.length - w.length} 个已打开的标签）`), w.length === 0) {
                this.verboseLog("⚠️ 过滤后没有可显示的历史记录，不显示悬浮列表");
                return;
              }
              const x = e.getBoundingClientRect(), T = {
                x: x.left,
                y: x.bottom + 4
                // 在标签下方显示
              };
              this.verboseLog(`📍 计算悬浮位置: x=${T.x}, y=${T.y}`), this.verboseLog(`📊 标签尺寸: width=${x.width}, height=${x.height}`), this.verboseLog("🎨 开始创建悬浮标签列表");
              const E = (I) => {
                this.verboseLog(`🖱️ 点击悬浮标签: ${I.title}`), this.getCurrentPanelTabs().find((O) => O.blockId === I.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${I.title}`), this.recordTabSwitchHistory(t.blockId, I), this.switchToTab(I)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${I.title}`), this.replaceCurrentTabWith(t.blockId, I)), D();
              };
              a = ve(
                w,
                T,
                d,
                E,
                this.isVerticalMode
              ), this.verboseLog("✅ 悬浮标签列表创建完成"), d.enableScroll && w.length > d.maxDisplayCount && this.addScrollEvents(a, w, d, r, E);
              const k = (I) => {
                const S = I.target;
                this.safeClosest(S, ".hover-tab-list-container") || (D(), a = null, r = 0, document.removeEventListener("click", k));
              };
              setTimeout(() => {
                document.addEventListener("click", k);
              }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${w.length} 个历史标签`);
            } catch (g) {
              this.warn("显示悬浮标签列表失败:", g);
            }
          }
        }, 500);
      }
    }), e.addEventListener("mouseup", () => {
      l();
    }), e.addEventListener("mouseleave", () => {
      l();
    }), e.addEventListener("dragstart", () => {
      this.verboseLog(`🚫 拖拽开始，取消长按并隐藏悬浮列表: ${t.title}`), l(), e.removeAttribute("data-long-pressed"), D();
    });
    const h = () => {
      setTimeout(() => {
        D(), a = null, r = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (u) => {
      !u || !u.target || this.safeClosest(u.target, ".hover-tab-list-container");
    }), document.addEventListener("mouseleave", (u) => {
      !u || !u.target || this.safeClosest(u.target, ".hover-tab-list-container") && h();
    });
  }
  /**
   * 添加悬浮标签列表事件
   */
  addHoverTabListEvents(e, t) {
    let i = null, a = null, r = 0;
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
      this.verboseLog(`🖱️ 鼠标进入标签: ${t.title} (标签历史ID: ${l})`), i && (clearTimeout(i), i = null), i = window.setTimeout(async () => {
        try {
          this.verboseLog(`⏰ 开始检查标签 ${t.title} 的切换历史`);
          const d = await this.tabStorageService.restoreRecentTabSwitchHistory(), h = [];
          if (Object.values(d).forEach((T) => {
            T.recentTabs && h.push(...T.recentTabs);
          }), this.verboseLog(`📋 所有切换历史记录: ${h.length} 个记录`), h.length === 0) {
            this.verboseLog("⚠️ 没有切换历史记录，不显示悬浮列表");
            return;
          }
          const u = /* @__PURE__ */ new Map();
          h.forEach((T) => {
            u.set(T.blockId, T);
          });
          const b = Array.from(u.values());
          this.verboseLog(`📋 去重后的历史记录: ${b.length} 个记录`);
          const g = this.getCurrentPanelTabs(), m = new Set(g.map((T) => T.blockId)), p = b.filter((T) => !m.has(T.blockId));
          if (this.verboseLog(`📋 过滤后的历史记录: ${p.length} 个记录（已过滤 ${b.length - p.length} 个已打开的标签）`), p.length === 0) {
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
            this.verboseLog(`🖱️ 点击悬浮标签: ${T.title}`), this.getCurrentPanelTabs().find((I) => I.blockId === T.blockId) ? (this.verboseLog(`🔄 标签已存在，跳转到: ${T.title}`), this.recordTabSwitchHistory(t.blockId, T), this.switchToTab(T)) : (this.verboseLog(`🔄 标签不存在，替换当前标签: ${t.title} -> ${T.title}`), this.replaceCurrentTabWith(t.blockId, T)), D();
          };
          a = ve(
            p,
            y,
            n,
            w,
            this.isVerticalMode
          ), this.verboseLog("✅ 悬浮标签列表创建完成"), n.enableScroll && p.length > n.maxDisplayCount && this.addScrollEvents(a, p, n, r, w);
          const x = (T) => {
            const E = T.target;
            this.safeClosest(E, ".hover-tab-list-container") || (D(), a = null, r = 0, document.removeEventListener("click", x));
          };
          setTimeout(() => {
            document.addEventListener("click", x);
          }, 100), this.verboseLog(`显示标签 ${t.title} 的悬浮列表: ${p.length} 个历史标签`);
        } catch (d) {
          this.warn("显示悬浮标签列表失败:", d);
        }
      }, 500);
    }), e.addEventListener("mouseleave", () => {
      i && (clearTimeout(i), i = null), i = window.setTimeout(() => {
        D(), a = null, r = 0;
      }, 200);
    });
    const o = () => {
      i && (clearTimeout(i), i = null);
    }, s = () => {
      i = window.setTimeout(() => {
        D(), a = null, r = 0;
      }, 200);
    };
    document.addEventListener("mouseenter", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && o();
    }), document.addEventListener("mouseleave", (l) => {
      !l || !l.target || this.safeClosest(l.target, ".hover-tab-list-container") && s();
    });
  }
  /**
   * 添加滚动事件
   */
  addScrollEvents(e, t, i, a, r) {
    const n = e.querySelector(".hover-tab-list-scroll");
    if (!n) return;
    let o = !1;
    n.addEventListener("wheel", (s) => {
      if (s.preventDefault(), o) return;
      o = !0;
      const l = s.deltaY > 0 ? i.scrollStep : -i.scrollStep, d = Math.max(0, Math.min(a + l, t.length - i.maxDisplayCount));
      d !== a && (a = d, Te(e, t, i, r, this.isVerticalMode, a)), setTimeout(() => {
        o = !1;
      }, 100);
    }), e.addEventListener("keydown", (s) => {
      if (s.key === "ArrowUp" || s.key === "ArrowDown") {
        s.preventDefault();
        const l = s.key === "ArrowDown" ? i.scrollStep : -i.scrollStep, d = Math.max(0, Math.min(a + l, t.length - i.maxDisplayCount));
        d !== a && (a = d, Te(e, t, i, r, this.isVerticalMode, a));
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
      const r = (n = 1) => {
        if (n > 5) {
          this.warn(`恢复标签 "${e.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let o = null;
        const s = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (s) {
          const l = s.closest(".orca-panel");
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
    const t = this.getPanelIds()[this.currentPanelIndex], i = orca.nav.findViewPanel(t, orca.state.panels);
    i && i.viewState ? (this.verboseLog("viewState中的滚动位置:", i.viewState.scrollPosition), this.verboseLog("完整viewState:", i.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((r) => {
      document.querySelectorAll(r).forEach((o, s) => {
        const l = o;
        (l.scrollTop > 0 || l.scrollLeft > 0) && this.log(`容器 ${r}[${s}]:`, {
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
        const s = document.querySelector(`.orca-panel[data-panel-id="${e.panelId}"]`);
        s && (t = s);
      }
      if (!t) return !1;
      const i = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!i) return !1;
      const r = i.getAttribute("data-block-id") === e.blockId;
      if (r && this.closedTabs.has(e.blockId))
        return this.verboseLog(`?? ?? ${e.title} ????????????????`), !1;
      if (!r)
        return !1;
      const n = this.getCurrentPanelTabs();
      if (this.lastActiveTabInstanceId) {
        const s = n.find((l) => l.tabId === this.lastActiveTabInstanceId);
        if (s && s.blockId === e.blockId)
          return e.tabId === this.lastActiveTabInstanceId;
      }
      const o = n.find((s) => s.blockId === e.blockId);
      return o != null && o.tabId ? (this.lastActiveTabInstanceId || (this.lastActiveTabInstanceId = o.tabId), e.tabId === o.tabId) : !0;
    } catch (t) {
      return this.warn("???????????:", t), !1;
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
      const s = t.getAttribute("data-orca-tabs-tab-id"), l = t.getAttribute("data-orca-tabs-block-id"), d = e.find((h) => h.tabId === s) || e.find((h) => h.blockId === l);
      if (d)
        return this.verboseLog(`?? ??UI????: ${d.title} (ID: ${d.blockId})`), d.tabId && (this.lastActiveTabInstanceId = d.tabId), this.enableWorkspaces && this.currentWorkspace && this.updateCurrentWorkspaceActiveIndex(d), d;
    }
    let i = null;
    if (this.currentPanelId && (i = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`)), i || (i = document.querySelector(".orca-panel.active")), !i)
      return this.verboseLog("?? ????????"), null;
    const a = i.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!a)
      return this.verboseLog("?? ????????????????"), null;
    const r = a.getAttribute("data-block-id");
    if (!r)
      return this.verboseLog("?? ??????????blockId"), null;
    const n = e.find((s) => s.blockId === r) || null;
    return n ? (this.verboseLog(`?? ??DOM??????????: ${n.title} (ID: ${r})`), n) : (this.verboseLog(`?? ??????????ID ${r} ?????`), null);
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
    var r;
    const t = this.getCurrentPanelTabs();
    if (t.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    if (e.isPinned) {
      this.log(`⚠️ 固定标签 "${e.title}" 不可关闭，请先取消固定`), orca.notify("info", `标签 "${e.title}" 已固定，请先取消固定再关闭`);
      return;
    }
    const i = z(e);
    i && this.verboseLog(`🖼️ 检测到视图面板标签页关闭: ${e.title} (blockId: ${e.blockId})`);
    const a = t.findIndex((n) => n.blockId === e.blockId);
    if (a !== -1) {
      const n = this.getCurrentActiveTab(), o = n && n.blockId === e.blockId, s = o ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const b = { ...e, closedAt: Date.now() }, g = this.recentlyClosedTabs.findIndex((m) => m.blockId === e.blockId);
        g !== -1 && this.recentlyClosedTabs.splice(g, 1), this.recentlyClosedTabs.unshift(b), this.recentlyClosedTabs.length > 10 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 10)), await this.saveRecentlyClosedTabs();
      }
      const l = CSS.escape(e.blockId), d = (r = this.tabContainer) == null ? void 0 : r.querySelector(`[data-orca-tabs-block-id="${l}"]`), h = d == null ? void 0 : d.getAttribute("data-tab-history-id");
      h && await this.deleteTabSwitchHistory(h), t.splice(a, 1), this.syncCurrentTabsToStorage(t), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`));
      const u = i ? "视图面板" : "标签";
      this.log(`🗑️ ${u} "${e.title}" 已关闭，已添加到关闭列表`), o && s ? (this.log(`🔄 自动切换到相邻标签: "${s.title}"`), await this.switchToTab(s)) : o && !s && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
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
    const e = this.getCurrentPanelTabs(), t = e.filter((n) => !n.isPinned);
    let i = 0;
    t.forEach((n) => {
      this.closedTabs.add(n.blockId), z(n) && (i++, this.verboseLog(`🖼️ 关闭视图面板标签页: ${n.title} (blockId: ${n.blockId})`));
    });
    const a = e.filter((n) => n.isPinned), r = e.length - a.length;
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), i > 0 ? this.log(`🗑️ 已关闭 ${r} 个标签（包含 ${i} 个视图面板），保留了 ${a.length} 个固定标签`) : this.log(`🗑️ 已关闭 ${r} 个标签，保留了 ${a.length} 个固定标签`);
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
      (o) => o.blockId === e.blockId || o.isPinned
    ), a = t.filter(
      (o) => o.blockId !== e.blockId && !o.isPinned
    );
    let r = 0;
    a.forEach((o) => {
      this.closedTabs.add(o.blockId), z(o) && (r++, this.verboseLog(`🖼️ 关闭视图面板标签页: ${o.title} (blockId: ${o.blockId})`));
    });
    const n = t.length - i.length;
    this.setCurrentPanelTabs(i), this.syncCurrentTabsToStorage(i), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), r > 0 ? this.log(`🗑️ 已关闭其他 ${n} 个标签（包含 ${r} 个视图面板），保留了当前标签和固定标签`) : this.log(`🗑️ 已关闭其他 ${n} 个标签，保留了当前标签和固定标签`);
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
    const t = document.querySelector(`[data-orca-tabs-tab-id="${e.tabId || e.blockId}"]`);
    if (!t) {
      this.warn("找不到对应的标签元素");
      return;
    }
    const i = t.querySelector(".inline-rename-input");
    i && i.remove();
    const a = t.textContent, r = t.style.cssText, n = t.draggable;
    t.draggable = !1, t.setAttribute("data-renaming", "true");
    const o = document.createElement("input");
    o.type = "text", o.value = e.title, o.className = "inline-rename-input";
    let s = "var(--orca-color-text-1)", l = "";
    e.color && (l = `--tab-color: ${e.color.startsWith("#") ? e.color : `#${e.color}`};`, s = "var(--orca-tab-colored-text)"), o.style.cssText = `
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
    `, t.textContent = "", t.appendChild(o), t.style.padding = "2px 8px", o.focus(), o.select();
    const d = async () => {
      const u = o.value.trim();
      if (u && u !== e.title) {
        await this.updateTabTitle(e, u), t.draggable = n, t.removeAttribute("data-renaming");
        return;
      }
      t.textContent = a, t.style.cssText = r, t.draggable = n, t.removeAttribute("data-renaming");
    }, h = () => {
      t.textContent = a, t.style.cssText = r, t.draggable = n, t.removeAttribute("data-renaming");
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
    const r = document.querySelector(`[data-orca-tabs-tab-id="${e.tabId || e.blockId}"]`);
    let n = { x: "50%", y: "50%" };
    if (r) {
      const h = r.getBoundingClientRect(), u = window.innerWidth, b = window.innerHeight, g = 300, m = 100, p = 20;
      let f = h.left, y = h.top - m - 10;
      f + g > u - p && (f = u - g - p), f < p && (f = p), y < p && (y = h.bottom + 10, y + m > b - p && (y = (b - m) / 2)), y + m > b - p && (y = b - m - p), f = Math.max(p, Math.min(f, u - g - p)), y = Math.max(p, Math.min(y, b - m - p)), n = { x: `${f}px`, y: `${y}px` };
    }
    const o = orca.components.InputBox, s = t.createElement(o, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (h, u, b) => {
        h && h.trim() && h.trim() !== e.title && this.updateTabTitle(e, h.trim()), b();
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
    N(a, () => {
      i.render(s, a);
    }), setTimeout(() => {
      const h = a.querySelector("div");
      h && h.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        i.unmountComponentAtNode(a), a.remove();
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
    o.className = "orca-button", o.textContent = "取消", r.appendChild(n), r.appendChild(o), i.appendChild(a), i.appendChild(r);
    const s = document.querySelector(`[data-orca-tabs-tab-id="${e.tabId || e.blockId}"]`);
    if (s) {
      const u = s.getBoundingClientRect();
      i.style.left = `${u.left}px`, i.style.top = `${u.top - 60}px`;
    } else
      i.style.left = "50%", i.style.top = "50%", i.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(i), a.focus(), a.select();
    const l = () => {
      const u = a.value.trim();
      u && u !== e.title && this.updateTabTitle(e, u), i.remove();
    }, d = () => {
      i.remove();
    };
    n.addEventListener("click", l), o.addEventListener("click", d), a.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), l()) : u.key === "Escape" && (u.preventDefault(), d());
    });
    const h = (u) => {
      !u || !u.target || i.contains(u.target) || (d(), document.removeEventListener("click", h));
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
      const i = this.getCurrentPanelTabs(), a = lt(e, t, i, {
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
    const i = window.React, a = window.ReactDOM, r = document.createElement("div");
    r.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(r);
    const n = orca.components.ContextMenu, o = orca.components.Menu, s = orca.components.MenuText, l = orca.components.MenuSeparator, d = i.createElement(n, {
      menu: (b) => i.createElement(o, {}, [
        i.createElement(s, {
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
        i.createElement(s, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            b(), this.toggleTabPinStatus(t);
          }
        }),
        // 如果有保存的标签组，添加"添加到已有标签组"选项
        ...this.savedTabSets.length > 0 ? [
          i.createElement(s, {
            key: "addToGroup",
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              b(), this.showAddToTabGroupDialog(t);
            }
          })
        ] : [],
        i.createElement(l, { key: "separator1" }),
        i.createElement(s, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            b(), this.closeTab(t);
          }
        }),
        i.createElement(s, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            b(), this.closeOtherTabs(t);
          }
        }),
        i.createElement(s, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            b(), this.closeAllTabs();
          }
        })
      ])
    }, (b, g) => i.createElement("div", {
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
        p.preventDefault(), p.stopPropagation(), b(p);
      }
    }));
    N(r, () => {
      a.render(d, r);
    });
    const h = () => {
      a.unmountComponentAtNode(r), r.remove();
    }, u = new MutationObserver((b) => {
      b.forEach((g) => {
        g.removedNodes.forEach((m) => {
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
    var u, b;
    const i = document.querySelector(".tab-context-menu");
    i && i.remove();
    const a = document.documentElement.classList.contains("dark") || ((b = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : b.themeMode) === "dark", r = document.createElement("div");
    r.className = "tab-context-menu";
    const n = 220, o = 240, { x: s, y: l } = X(e.clientX, e.clientY, n, o);
    r.style.cssText = `
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
    ), d.forEach((g) => {
      const m = document.createElement("div");
      m.className = "tab-context-menu-item";
      let p = "";
      g.text.includes("关闭") ? p = "close" : g.text.includes("重命名") ? p = "rename" : g.text.includes("固定") ? p = "pin" : g.text.includes("复制") ? p = "duplicate" : g.text.includes("保存到标签组") && (p = "save-to-group"), m.setAttribute("data-action", p), m.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: ${g.disabled ? a ? "#666" : "#999" : "var(--orca-color-text-1)"};
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s;
      `;
      const f = document.createElement("i");
      f.className = "tab-context-menu-icon", g.text.includes("重命名") ? f.classList.add("ti", "ti-edit") : g.text.includes("固定") ? f.classList.add("ti", t.isPinned ? "ti-pin-off" : "ti-pin") : g.text.includes("添加到已有标签组") ? f.classList.add("ti", "ti-bookmark-plus") : g.text.includes("关闭") ? f.classList.add("ti", "ti-x") : f.classList.add("ti", "ti-edit"), f.style.cssText = `
        flex: 0 0 auto;
        font-size: var(--orca-fontsize-lg);
        margin-top: var(--orca-spacing-xs);
        margin-right: var(--orca-spacing-md);
        color: var(--orca-tab-colored-text);
        width: 16px;
        text-align: center;
      `, m.appendChild(f);
      const y = document.createElement("span");
      y.textContent = g.text, m.appendChild(y), g.disabled || (m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      }), m.addEventListener("click", () => {
        g.action(), r.remove();
      })), r.appendChild(m);
    }), document.body.appendChild(r);
    const h = (g) => {
      !g || !g.target || r.contains(g.target) || (r.remove(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 100);
  }
  /**
   * 构建标签右键菜单（合并模式通用，复用 .tab-context-menu 样式）
   */
  buildContextMenu(e, t) {
    var h, u;
    const i = document.querySelector(".tab-context-menu");
    i && i.remove();
    const a = document.documentElement.classList.contains("dark") || ((u = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : u.themeMode) === "dark", r = document.createElement("div");
    r.className = "tab-context-menu";
    const n = 220, o = 240, { x: s, y: l } = X(e.clientX, e.clientY, n, o);
    r.style.cssText = `
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
    `, t.forEach((b) => {
      const g = document.createElement("div");
      g.className = "tab-context-menu-item", g.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-family: var(--orca-fontfamily-ui);
        font-size: var(--orca-fontsize-sm);
        color: ${b.disabled ? a ? "#666" : "#999" : "var(--orca-color-text-1)"};
        border-radius: var(--orca-radius-md);
        transition: background-color 0.2s;
      `;
      const m = document.createElement("i");
      m.className = `tab-context-menu-icon ${b.icon}`, m.style.cssText = `
        flex: 0 0 auto;
        font-size: var(--orca-fontsize-lg);
        margin-top: var(--orca-spacing-xs);
        margin-right: var(--orca-spacing-md);
        color: var(--orca-tab-colored-text);
        width: 16px;
        text-align: center;
      `, g.appendChild(m);
      const p = document.createElement("span");
      p.textContent = b.text, g.appendChild(p), b.disabled || (g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        b.action(), r.remove();
      })), r.appendChild(g);
    }), document.body.appendChild(r);
    const d = (b) => {
      !b || !b.target || r.contains(b.target) || (r.remove(), document.removeEventListener("click", d), document.removeEventListener("contextmenu", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d), document.addEventListener("contextmenu", d);
    }, 0);
  }
  /**
   * 显示合并模式历史条目右键菜单
   */
  showMergedTabContextMenu(e, t, i) {
    e.preventDefault(), e.stopPropagation();
    const a = this.panelHistoryMap.get(i) ?? [], r = `${i}|${t.key}`, n = this.mergedTitleOverrides[r] !== void 0, o = a.filter((h) => h.key !== t.key && !h.isPinned).length, s = a.filter((h) => !h.isPinned).length, l = this.collectViewPanels(orca.state.panels).length, d = a.length <= 1 && l <= 1;
    this.buildContextMenu(e, [
      {
        text: "重命名标签",
        icon: "ti ti-edit",
        action: () => {
          var u;
          const h = (u = this.tabContainer) == null ? void 0 : u.querySelector(
            `[data-orca-tabs-key="${CSS.escape(t.key)}"][data-orca-tabs-panel-id="${CSS.escape(i)}"]`
          );
          h && this.showMergedInlineRenameInput(h, t.title, t.color, (b) => {
            this.mergedTitleOverrides[r] = b, t.title = b, this.tabStorageService.saveMergedTitleOverrides(this.mergedTitleOverrides);
          });
        }
      },
      ...n ? [{
        text: "恢复默认标题",
        icon: "ti ti-refresh",
        action: () => {
          (async () => {
            delete this.mergedTitleOverrides[r];
            const h = t.view === "block" || t.view === "bgraph" ? await this.resolveBlockData(t.viewArgs) : null;
            t.title = this.resolveHistoryEntryTitle(t, h), this.tabStorageService.saveMergedTitleOverrides(this.mergedTitleOverrides), this.renderMergedTabBar();
          })();
        }
      }] : [],
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        icon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
        action: () => {
          this.toggleMergedEntryPin(i, t);
        }
      },
      ...this.savedTabSets.length > 0 ? [{
        text: "添加到已有标签组",
        icon: "ti ti-bookmark-plus",
        action: () => {
          var u;
          const h = {
            blockId: t.view === "block" ? String(((u = t.viewArgs) == null ? void 0 : u.blockId) ?? "") : t.view.startsWith("view:") ? `view:${t.panelId}` : t.key,
            panelId: t.panelId,
            title: t.title,
            order: 0,
            blockType: t.view,
            ...t.icon ? { icon: t.icon } : {},
            ...t.color ? { color: t.color } : {},
            ...t.view.startsWith("view:") ? { isViewPanel: !0 } : {}
          };
          this.showAddToTabGroupDialog(h);
        }
      }] : [],
      {
        text: "关闭其他标签",
        icon: "ti ti-x",
        action: () => this.removeOtherHistoryEntries(i, t.key),
        disabled: o === 0
      },
      {
        text: "关闭全部标签",
        icon: "ti ti-layout-list",
        action: () => this.closeAllHistoryEntries(i),
        disabled: s === 0 || d
      },
      {
        text: "关闭标签",
        icon: "ti ti-trash",
        action: () => this.removeHistoryEntry(i, t.key),
        disabled: !!t.isPinned || d
      }
    ]);
  }
  /**
   * 显示工作区标签右键菜单
   */
  showWorkspaceTabContextMenu(e, t) {
    e.preventDefault(), e.stopPropagation(), this.buildContextMenu(e, [
      {
        text: "重命名标签",
        icon: "ti ti-edit",
        action: () => {
          var a;
          const i = (a = this.tabContainer) == null ? void 0 : a.querySelector(
            `[data-orca-tabs-block-id="${CSS.escape(t.blockId)}"].orca-tab-merged`
          );
          i && this.showMergedInlineRenameInput(i, t.title, t.color, (r) => {
            t.title = r;
            const n = this.workspaces.find((o) => o.id === this.currentWorkspace);
            n && (n.updatedAt = Date.now(), this.saveWorkspaces());
          });
        }
      },
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        icon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
        action: () => {
          this.toggleWorkspaceTabPin(t);
        }
      },
      {
        text: "从工作区移除",
        icon: "ti ti-x",
        action: () => {
          this.removeTabFromActiveWorkspace(t);
        },
        disabled: !!t.isPinned
      }
    ]);
  }
  /**
   * 合并模式标签内联重命名输入框（历史条目与工作区标签通用）
   * @param el 标签元素
   * @param initialTitle 当前标题
   * @param color 标签颜色
   * @param onConfirm 确认回调（仅在标题有变更时调用）
   */
  showMergedInlineRenameInput(e, t, i, a) {
    const r = e.querySelector(".inline-rename-input");
    r && r.remove();
    const n = e.querySelector(".orca-tab-label");
    if (!n) return;
    const o = e.draggable;
    e.draggable = !1;
    const s = document.createElement("input");
    s.type = "text", s.value = t, s.className = "inline-rename-input";
    let l = "var(--orca-color-text-1)";
    if (i) {
      const g = i.startsWith("#") ? i : `#${i}`;
      s.style.setProperty("--tab-color", g), l = "var(--orca-tab-colored-text)";
    }
    s.style.cssText = `
      background: transparent;
      color: ${l};
      border: none;
      border-radius: var(--orca-radius-md);
      font-size: 14px;
      font-weight: 600;
      outline: none;
      flex: 1;
      min-width: 40px;
      max-width: 100%;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, n.style.display = "none", n.insertAdjacentElement("afterend", s), s.focus(), s.select();
    let d = !1;
    const h = () => {
      s.remove(), n.style.display = "", e.draggable = o;
    }, u = () => {
      if (d) return;
      d = !0;
      const g = s.value.trim();
      g && g !== t && a(g), h(), this.renderMergedTabBar();
    }, b = () => {
      d || (d = !0, h(), this.renderMergedTabBar());
    };
    s.addEventListener("blur", u), s.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), u()) : g.key === "Escape" && (g.preventDefault(), b());
    }), s.addEventListener("click", (g) => g.stopPropagation());
  }
  /**
   * 关闭组内全部历史条目（固定条目保留）
   */
  closeAllHistoryEntries(e) {
    const t = this.panelHistoryMap.get(e);
    if (!t) return;
    if (t.length <= 1 && this.collectViewPanels(orca.state.panels).length <= 1) {
      orca.notify("info", "至少保留一个标签页");
      return;
    }
    const i = orca.nav.findViewPanel(e, orca.state.panels), a = i ? this.makeHistoryKey(i.view ?? "", i.viewArgs) : "", r = t.filter((s) => !s.isPinned);
    if (!r.length) return;
    let n = !1;
    for (const s of r) {
      this.pushHistoryEntryToRecentlyClosed(s);
      const l = `${e}|${s.key}`;
      this.mergedTitleOverrides[l] !== void 0 && (delete this.mergedTitleOverrides[l], n = !0);
    }
    n && this.tabStorageService.saveMergedTitleOverrides(this.mergedTitleOverrides);
    const o = t.filter((s) => s.isPinned);
    if (this.panelHistoryMap.set(e, o), a && !o.some((s) => s.key === a))
      if (o.length)
        this.navigateToHistoryEntry(o[0]);
      else {
        try {
          orca.nav.close(e);
        } catch (s) {
          this.warn("关闭面板失败:", s);
        }
        this.panelHistoryMap.delete(e);
      }
    this.renderMergedTabBar();
  }
  /**
   * 关闭组内其他历史条目（固定条目与当前视图保留）
   */
  removeOtherHistoryEntries(e, t) {
    const i = this.panelHistoryMap.get(e);
    if (!i) return;
    const a = orca.nav.findViewPanel(e, orca.state.panels), r = a ? this.makeHistoryKey(a.view ?? "", a.viewArgs) : "", n = /* @__PURE__ */ new Set([t]);
    r && n.add(r);
    const o = i.filter((l) => !l.isPinned && !n.has(l.key));
    if (!o.length) return;
    let s = !1;
    for (const l of o) {
      this.pushHistoryEntryToRecentlyClosed(l);
      const d = `${e}|${l.key}`;
      this.mergedTitleOverrides[d] !== void 0 && (delete this.mergedTitleOverrides[d], s = !0);
    }
    s && this.tabStorageService.saveMergedTitleOverrides(this.mergedTitleOverrides), this.panelHistoryMap.set(e, i.filter((l) => !o.includes(l))), this.renderMergedTabBar();
  }
  /**
   * 将历史条目推入最近关闭列表（仅可恢复的视图类型：块/日志/视图面板）
   */
  pushHistoryEntryToRecentlyClosed(e) {
    var r, n, o;
    if (!this.enableRecentlyClosedTabs || e.view !== "block" && e.view !== "journal" && !e.view.startsWith("view:"))
      return;
    let t = "";
    if (e.view === "journal")
      try {
        const s = ((r = e.viewArgs) == null ? void 0 : r.date) instanceof Date ? e.viewArgs.date : new Date((n = e.viewArgs) == null ? void 0 : n.date);
        isNaN(s.getTime()) || (t = `journal:${s.toISOString()}`);
      } catch {
      }
    const i = {
      blockId: e.view === "block" ? String(((o = e.viewArgs) == null ? void 0 : o.blockId) ?? "") : e.view.startsWith("view:") ? `view:${e.panelId}` : t || e.key,
      panelId: e.panelId,
      title: e.title,
      order: 0,
      closedAt: Date.now(),
      blockType: e.view,
      ...e.icon ? { icon: e.icon } : {},
      ...e.color ? { color: e.color } : {},
      ...e.view.startsWith("view:") ? { isViewPanel: !0 } : {}
    }, a = this.recentlyClosedTabs.findIndex((s) => s.blockId === i.blockId);
    a !== -1 && this.recentlyClosedTabs.splice(a, 1), this.recentlyClosedTabs.unshift(i), this.recentlyClosedTabs.length > 10 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 10)), this.saveRecentlyClosedTabs();
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
      if (z(a)) {
        this.verboseLog(`⏭️ 跳过视图面板: ${a.title}`);
        continue;
      }
      if (!a.blockType || !a.icon)
        try {
          const n = await orca.invokeBackend("get-block", parseInt(a.blockId));
          if (n) {
            const o = await pe(n);
            let s = a.icon;
            s || (s = G(o)), e[i] = {
              ...a,
              blockType: o,
              icon: s
            }, this.log(`✅ 更新恢复的标签: ${a.title} -> 类型: ${o}, 图标: ${s}`), t = !0;
          }
        } catch (n) {
          this.warn(`更新恢复的标签失败: ${a.title}`, n);
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
  /* 合并标签栏模式 - Merged Tab Bar Mode */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 递归收集面板树中的所有视图面板（跳过 id 以 _ 开头的布局容器）
   */
  collectViewPanels(e, t = []) {
    if (!e) return t;
    if (Array.isArray(e.children))
      for (const i of e.children)
        this.collectViewPanels(i, t);
    return typeof e.id == "string" && e.id && !e.id.startsWith("_") && e.view && t.push(e), t;
  }
  /**
   * 生成视图历史键：view + 排序后的 viewArgs 序列化
   */
  makeHistoryKey(e, t) {
    let i = "";
    try {
      const a = t ?? {};
      i = Object.keys(a).sort().map((r) => `${r}=${String(a[r])}`).join("&");
    } catch {
    }
    return `${e}|${i}`;
  }
  /**
   * 从块数据同步解析标题（别名 / text / _repr，支持 mirror 递归）
   */
  resolveBlockTitle(e, t = 0) {
    var i, a;
    if (!e || t > 3) return "";
    try {
      const r = this.findProperty(e, "_repr");
      let n = null;
      if (r != null && r.value && (n = typeof r.value == "string" ? JSON.parse(r.value) : r.value), (n == null ? void 0 : n.type) === "mirror" && (n == null ? void 0 : n.mirroredId) != null) {
        const o = (i = orca.state.blocks) == null ? void 0 : i[this.normalizeBlockId(n.mirroredId) ?? -1], s = this.resolveBlockTitle(o, t + 1);
        if (s) return s;
      }
      if ((n == null ? void 0 : n.type) === "journal" && (n != null && n.date)) {
        const o = n.date instanceof Date ? n.date : new Date(n.date);
        if (!isNaN(o.getTime())) return ge(o);
      }
      if ((a = e.aliases) != null && a.length) {
        const o = String(e.aliases[0]), s = o.split("/").filter(Boolean);
        return o.endsWith("/") && s.length > 0 ? s.pop() : o;
      }
      if (e.text != null) {
        const o = this.stripTrailingHashTags(String(e.text).substring(0, 50));
        if (o) return o;
      }
      if ((n == null ? void 0 : n.cap) != null) return String(n.cap);
      if (n != null && n.type) return `(${n.type})`;
    } catch {
    }
    return "";
  }
  /**
   * 解析视图面板当前视图的显示标题
   * @param panel 视图面板状态
   * @param blockData 已解析的块数据（可选，缺省时尝试从 state.blocks 读取）
   */
  resolveHistoryEntryTitle(e, t) {
    var i;
    try {
      const a = e == null ? void 0 : e.view, r = (e == null ? void 0 : e.viewArgs) ?? {};
      if (a === "journal") {
        const n = r.date instanceof Date ? r.date : new Date(r.date);
        if (!isNaN(n.getTime())) return ge(n);
      }
      if (a === "block" || a === "bgraph") {
        const n = t ?? ((i = orca.state.blocks) == null ? void 0 : i[this.normalizeBlockId(r.blockId) ?? -1]), o = this.resolveBlockTitle(n);
        if (o) return a === "bgraph" ? `关系图：${o}` : o;
      }
      if (r.title != null) return String(r.title);
    } catch {
    }
    return this.viewTypeNames[e == null ? void 0 : e.view] || (e == null ? void 0 : e.view) || "未命名";
  }
  /**
   * 解析视图面板当前视图的显示图标（用户自定义 _icon 优先）
   * @param blockData 已解析的块数据（可选，缺省时尝试从 state.blocks 读取）
   */
  resolveHistoryEntryIcon(e, t, i) {
    var a, r;
    if (e === "journal") return "ti ti-calendar";
    if (e === "block" || e === "bgraph") {
      const n = i ?? ((a = orca.state.blocks) == null ? void 0 : a[this.normalizeBlockId(t == null ? void 0 : t.blockId) ?? -1]);
      if (!n) return "ti ti-file-text";
      try {
        const o = this.findProperty(n, "_icon");
        if (o && o.type === 1 && o.value && String(o.value).trim())
          return String(o.value).trim();
        const s = this.findProperty(n, "_repr");
        let l = null;
        if (s != null && s.value && (l = typeof s.value == "string" ? JSON.parse(s.value) : s.value), (l == null ? void 0 : l.type) === "heading") {
          const d = Number(l.level);
          return d >= 1 && d <= 6 ? `ti ti-h-${d}` : "ti ti-heading";
        }
        if (l != null && l.type) return G(l.type, l == null ? void 0 : l.level);
        if ((r = n.aliases) != null && r.length) {
          const d = this.findProperty(n, "_hide");
          return d != null && d.value ? "ti ti-file" : "ti ti-hash";
        }
      } catch {
      }
      return "ti ti-cube";
    }
    return "ti ti-file-text";
  }
  /**
   * 从块数据解析标签颜色（_color 属性）
   */
  resolveBlockColor(e) {
    try {
      const t = this.findProperty(e, "_color");
      if (t && t.type === 1 && t.value)
        return String(t.value);
    } catch {
    }
  }
  /**
   * 规范化块ID（viewArgs 中可能是数字或字符串）
   */
  normalizeBlockId(e) {
    const t = typeof e == "number" ? e : parseInt(String(e ?? ""), 10);
    return Number.isFinite(t) ? t : null;
  }
  /**
   * 异步获取块数据（带30秒TTL缓存）- 用于 state.blocks 中未加载的块
   */
  async fetchBlockData(e) {
    const t = this.blockDataCache.get(e);
    if (t && Date.now() - t.time < 3e4) return t.data;
    try {
      const i = await orca.invokeBackend("get-block", e);
      return i && this.blockDataCache.set(e, { data: i, time: Date.now() }), i ?? null;
    } catch {
      return null;
    }
  }
  /**
   * 解析视图的块数据：优先 state.blocks（已打开），缺失时异步从后端获取
   */
  async resolveBlockData(e) {
    var i;
    const t = this.normalizeBlockId(e == null ? void 0 : e.blockId);
    return t == null ? null : ((i = orca.state.blocks) == null ? void 0 : i[t]) ?? await this.fetchBlockData(t);
  }
  /**
   * 同步每面板 LRU 视图历史（仅合并模式调用）
   * 数据源为 orca.state.panels，包含未打开的视图；上限复用 maxTabs
   */
  async syncPanelHistory() {
    var e;
    if (!this.syncPanelHistoryInProgress) {
      this.syncPanelHistoryInProgress = !0;
      try {
        this.mergedPinnedLoaded || (this.mergedPinnedMap = await this.tabStorageService.restoreMergedPinnedEntries(), this.mergedPinnedLoaded = !0), this.mergedTitleOverridesLoaded || (this.mergedTitleOverrides = await this.tabStorageService.restoreMergedTitleOverrides(), this.mergedTitleOverridesLoaded = !0);
        const t = this.collectViewPanels((e = orca.state) == null ? void 0 : e.panels), i = /* @__PURE__ */ new Set();
        for (const n of t) {
          const o = n.id, s = n.view;
          if (!o || !s) continue;
          i.add(o);
          const l = this.makeHistoryKey(s, n.viewArgs);
          let d = this.panelHistoryMap.get(o);
          d || (d = [], this.panelHistoryMap.set(o, d));
          let h = d.find((g) => g.key === l);
          h || (h = {
            panelId: o,
            key: l,
            view: s,
            viewArgs: { ...n.viewArgs ?? {} },
            title: "",
            icon: "ti ti-file-text",
            used: 0,
            isPinned: (this.mergedPinnedMap[o] ?? []).includes(l)
          }, d.push(h));
          const u = s === "block" || s === "bgraph" ? await this.resolveBlockData(n.viewArgs) : null;
          h.used = ++this.historyUseCounter, h.title = this.resolveHistoryEntryTitle(n, u), h.icon = this.resolveHistoryEntryIcon(s, n.viewArgs, u), h.color = this.resolveBlockColor(u);
          const b = this.mergedTitleOverrides[`${o}|${l}`];
          for (b && (h.title = b); d.length > this.maxTabs; ) {
            let g = -1, m = 1 / 0;
            for (let p = 0; p < d.length; p++)
              d[p].key !== l && !d[p].isPinned && d[p].used < m && (m = d[p].used, g = p);
            if (g < 0) break;
            d.splice(g, 1);
          }
          this.sortMergedListByPin(d);
        }
        let a = !1, r = !1;
        for (const n of Array.from(this.panelHistoryMap.keys()))
          if (!i.has(n)) {
            this.panelHistoryMap.delete(n), this.mergedPinnedMap[n] && (delete this.mergedPinnedMap[n], a = !0);
            const o = `${n}|`;
            for (const s of Object.keys(this.mergedTitleOverrides))
              s.startsWith(o) && (delete this.mergedTitleOverrides[s], r = !0);
          }
        a && this.tabStorageService.saveMergedPinnedEntries(this.mergedPinnedMap), r && this.tabStorageService.saveMergedTitleOverrides(this.mergedTitleOverrides), this.syncWorkspaceTabsFromMergedHistory(t);
      } finally {
        this.syncPanelHistoryInProgress = !1;
      }
    }
  }
  /**
   * 按固定状态排序合并模式历史列表（固定在前，其余保持原有相对顺序）
   */
  sortMergedListByPin(e) {
    e.sort((t, i) => {
      const a = t.isPinned ? 1 : 0;
      return (i.isPinned ? 1 : 0) - a;
    });
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 面板布局序列化与恢复 - Panel Layout Serialization & Restore */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 序列化当前面板布局（面板树 + 激活面板）
   * 返回 null 表示无法读取面板树。
   */
  serializePanelLayout() {
    var n, o;
    const e = (n = orca.state) == null ? void 0 : n.panels;
    if (!e) return null;
    const t = ((o = orca.state) == null ? void 0 : o.activePanel) ?? "", i = [], a = this.serializePanelNode(e, i), r = t ? i.indexOf(t) : -1;
    return { panels: a, activeIndex: r };
  }
  /**
   * 递归序列化面板树节点
   * @param leafIds 收集叶子（视图面板）ID，用于确定激活面板索引
   */
  serializePanelNode(e, t) {
    return (e == null ? void 0 : e.direction) === "row" || (e == null ? void 0 : e.direction) === "column" ? {
      direction: e.direction,
      children: (e.children ?? []).map((i) => this.serializePanelNode(i, t))
    } : (typeof (e == null ? void 0 : e.id) == "string" && e.id && t.push(e.id), {
      view: (e == null ? void 0 : e.view) ?? "block",
      viewArgs: this.cloneForStorage(e == null ? void 0 : e.viewArgs),
      viewState: this.cloneForStorage(e == null ? void 0 : e.viewState)
    });
  }
  /**
   * 深度拷贝并处理 Date（转为可 JSON 序列化的标记对象）
   */
  cloneForStorage(e) {
    if (e instanceof Date) return { __orcaDate: e.toISOString() };
    if (Array.isArray(e)) return e.map((t) => this.cloneForStorage(t));
    if (e && typeof e == "object") {
      const t = {};
      for (const [i, a] of Object.entries(e))
        t[i] = this.cloneForStorage(a);
      return t;
    }
    return e;
  }
  /**
   * 从存储反序列化（还原 Date）
   */
  reviveFromStorage(e) {
    if (Array.isArray(e)) return e.map((t) => this.reviveFromStorage(t));
    if (e && typeof e == "object") {
      if (typeof e.__orcaDate == "string") return new Date(e.__orcaDate);
      const t = {};
      for (const [i, a] of Object.entries(e))
        t[i] = this.reviveFromStorage(a);
      return t;
    }
    return e;
  }
  /**
   * 恢复面板布局：关闭现有面板并按保存的面板树重建，最后聚焦目标面板。
   * @param layout 保存的面板布局
   * @param preferBlockId 优先聚焦的块ID（工作区最后激活标签），可选
   */
  async restorePanelLayout(e, t) {
    var a, r;
    if (!(e != null && e.panels)) return !1;
    const i = this.collectLayoutLeaves(e.panels);
    if (i.length === 0) return !1;
    this.restoringPanelLayout = !0;
    try {
      await this.closePanelsTo(i.length), await this.addPanelsTo(i.length, i);
      const n = this.collectViewPanels((a = orca.state) == null ? void 0 : a.panels), o = [];
      for (let l = 0; l < i.length && l < n.length; l++) {
        const d = i[l], h = n[l].id, u = this.reviveFromStorage(d.viewArgs ?? {});
        await this.navigatePanelToView(h, d.view, u), o.push({ panelId: h, view: d.view, viewArgs: u });
      }
      await this.waitForLayoutSettle();
      let s = "";
      if (t) {
        const l = o.find((d) => {
          var h;
          return d.view === "block" && ((h = d.viewArgs) == null ? void 0 : h.blockId) != null && String(d.viewArgs.blockId) === String(t);
        });
        l && (s = l.panelId);
      }
      if (!s) {
        const l = e.activeIndex;
        s = l >= 0 && l < o.length ? o[l].panelId : ((r = o[0]) == null ? void 0 : r.panelId) ?? "";
      }
      if (s)
        try {
          orca.nav.switchFocusTo(s);
        } catch {
        }
    } finally {
      this.restoringPanelLayout = !1;
    }
    return this.mergedRenderSignature = "", await this.updateTabsUI(!0), !0;
  }
  /**
   * 等待面板树稳定（让关闭/新增面板的状态变更生效后再继续）
   */
  async waitForLayoutSettle() {
    await new Promise((e) => setTimeout(e, 60));
  }
  /**
   * 关闭多余面板，直到面板数量等于目标值（轮询，兼容 orca.nav.close 异步生效）
   */
  async closePanelsTo(e) {
    var i;
    const t = Date.now() + 2e3;
    for (; Date.now() < t; ) {
      const a = this.collectViewPanels((i = orca.state) == null ? void 0 : i.panels);
      if (a.length <= e) return;
      const r = a[a.length - 1];
      try {
        orca.nav.close(r.id);
      } catch {
      }
      await this.waitForLayoutSettle();
    }
  }
  /**
   * 补充面板，直到面板数量等于目标值（addTo 携带 src 创建新面板）
   */
  async addPanelsTo(e, t) {
    var a, r;
    const i = Date.now() + 2e3;
    for (; Date.now() < i; ) {
      const n = this.collectViewPanels((a = orca.state) == null ? void 0 : a.panels);
      if (n.length >= e) return;
      const o = (r = n[n.length - 1]) == null ? void 0 : r.id;
      if (!o) return;
      const s = t[n.length];
      if (!s || !orca.nav.addTo(o, "right", {
        view: s.view,
        viewArgs: this.reviveFromStorage(s.viewArgs ?? {}),
        viewState: this.reviveFromStorage(s.viewState ?? {})
      })) return;
      await this.waitForLayoutSettle();
    }
  }
  /**
   * 扁平化布局树为有序叶子列表（DFS 顺序，与面板树从左到右/从上到下一致）
   */
  collectLayoutLeaves(e, t = []) {
    if (!e) return t;
    if (e.view != null)
      return t.push({ view: e.view, viewArgs: e.viewArgs ?? {}, viewState: e.viewState ?? {} }), t;
    for (const i of e.children ?? [])
      this.collectLayoutLeaves(i, t);
    return t;
  }
  /**
   * 将面板导航到指定视图
   */
  async navigatePanelToView(e, t, i) {
    try {
      if (t.startsWith("view:"))
        orca.nav.switchFocusTo(e);
      else if (t === "journal") {
        let a = i == null ? void 0 : i.date;
        a instanceof Date || (a = a ? new Date(a) : /* @__PURE__ */ new Date()), orca.nav.goTo("journal", { date: a }, e);
      } else
        orca.nav.goTo(t, i ?? {}, e);
    } catch (a) {
      this.warn(`恢复面板视图失败 (${t}):`, a);
    }
  }
  /**
   * 获取面板当前视图对应的块ID（用于工作区标签聚焦高亮）
   * - block/bgraph：取 viewArgs.blockId
   * - journal：无独立块ID，返回 null（日志标签不做聚焦高亮）
   */
  getPanelCurrentBlockId(e) {
    const t = e == null ? void 0 : e.view, i = (e == null ? void 0 : e.viewArgs) ?? {};
    return (t === "block" || t === "bgraph") && i.blockId != null ? String(i.blockId) : null;
  }
  /**
   * 把当前打开的面板历史同步进激活工作区的标签组（自动记录打开/关闭）
   * 工作区标签组对应合并标签栏的第一组（第一个面板），因此以第一个面板的历史为数据源。
   * 采用增量合并：保留已有标签，仅把「本工作区中新打开」的块加进来；
   * 移除仍由标签的 × / 中键显式触发（removeTabFromActiveWorkspace），避免历史变化误删未打开标签。
   */
  syncWorkspaceTabsFromMergedHistory(e) {
    var l, d;
    if (!this.enableMergedTabBar || !this.currentWorkspace) return;
    const t = this.workspaces.find((h) => h.id === this.currentWorkspace);
    if (!t) return;
    let i = null;
    for (const h of e) {
      const u = h.id, b = h.view;
      if (u && !u.startsWith("_") && b) {
        i = h;
        break;
      }
    }
    if (!i) return;
    const a = i.id, r = this.panelHistoryMap.get(a) ?? [], n = /* @__PURE__ */ new Set();
    if (this.mergedHistorySnapshot)
      for (const h of this.mergedHistorySnapshot.values())
        for (const u of h)
          (u.view === "block" || u.view === "bgraph") && ((l = u.viewArgs) == null ? void 0 : l.blockId) != null && n.add(String(u.viewArgs.blockId));
    let o = !1;
    const s = new Set(t.tabs.map((h) => h.blockId));
    for (const h of r) {
      if (h.view !== "block" && h.view !== "bgraph") continue;
      const u = (d = h.viewArgs) == null ? void 0 : d.blockId;
      if (u == null) continue;
      const b = String(u);
      s.has(b) || this.removedWorkspaceBlockIds.has(b) || n.has(b) || (t.tabs.push({
        blockId: b,
        panelId: a,
        title: h.title,
        order: t.tabs.length,
        ...h.icon ? { icon: h.icon } : {},
        ...h.color ? { color: h.color } : {},
        isPinned: h.isPinned ?? !1
      }), s.add(b), o = !0);
    }
    o && (t.tabs = [...t.tabs.filter((h) => h.isPinned), ...t.tabs.filter((h) => !h.isPinned)], t.updatedAt = Date.now(), this.saveWorkspaces(), this.log(`📁 工作区标签组已同步: ${t.tabs.length} 个标签`));
  }
  /**
   * 深拷贝合并模式面板历史（快照用于工作区进出时恢复）
   */
  cloneMergedHistory() {
    const e = /* @__PURE__ */ new Map();
    for (const [t, i] of this.panelHistoryMap)
      e.set(t, i.map((a) => ({ ...a, viewArgs: { ...a.viewArgs ?? {} } })));
    return e;
  }
  /**
   * 快照合并模式进入工作区前的面板历史与激活视图
   * 退出工作区时据此恢复，避免工作区打开的块泄漏到非工作区标签栏
   */
  snapshotMergedHistoryBeforeWorkspace() {
    this.mergedHistorySnapshot = this.cloneMergedHistory(), this.mergedActiveEntryBeforeWorkspace = this.getCurrentActiveHistoryEntry(), this.log("🔀 已快照合并模式进入工作区前的历史");
  }
  /**
   * 恢复合并模式进入工作区前的面板历史快照
   */
  restoreMergedHistorySnapshot() {
    if (this.mergedHistorySnapshot) {
      this.panelHistoryMap.clear();
      for (const [e, t] of this.mergedHistorySnapshot)
        this.panelHistoryMap.set(e, t.map((i) => ({ ...i, viewArgs: { ...i.viewArgs ?? {} } })));
      this.mergedHistorySnapshot = null, this.mergedRenderSignature = "", this.log("🔀 已恢复合并模式进入工作区前的历史快照");
    }
  }
  /**
   * 获取合并模式下当前激活面板的当前视图历史条目
   */
  getCurrentActiveHistoryEntry() {
    var i, a;
    if (!this.enableMergedTabBar) return null;
    const e = this.collectViewPanels((i = orca.state) == null ? void 0 : i.panels), t = (a = orca.state) == null ? void 0 : a.activePanel;
    for (const r of e) {
      const n = r.id, o = r.view;
      if (!n || n.startsWith("_") || !o || n !== t) continue;
      const s = this.makeHistoryKey(o, r.viewArgs), l = this.panelHistoryMap.get(n), d = l == null ? void 0 : l.find((h) => h.key === s);
      return d || {
        panelId: n,
        key: s,
        view: o,
        viewArgs: { ...r.viewArgs ?? {} },
        title: "",
        icon: "ti ti-file-text",
        used: 0
      };
    }
    return null;
  }
  /**
   * 合并模式退出工作区时导航回进入前的激活视图
   * 让 orca.state.panels 与历史快照一致，syncPanelHistory 不会重新加入工作区打开的块
   */
  async navigateBackToMergedEntry(e) {
    try {
      e.view.startsWith("view:") || await orca.nav.goTo(e.view, e.viewArgs ?? {}, e.panelId), orca.nav.switchFocusTo(e.panelId);
    } catch (t) {
      this.warn("退出工作区后恢复视图失败:", t);
    }
  }
  /**
   * 切换合并模式历史条目的固定状态并持久化
   */
  async toggleMergedEntryPin(e, t) {
    t.isPinned = !t.isPinned;
    const i = this.mergedPinnedMap[e] ?? [];
    t.isPinned ? i.includes(t.key) || i.push(t.key) : this.mergedPinnedMap[e] = i.filter((r) => r !== t.key), await this.tabStorageService.saveMergedPinnedEntries(this.mergedPinnedMap);
    const a = this.panelHistoryMap.get(e);
    a && this.sortMergedListByPin(a), this.log(`📌 合并模式标签固定状态: ${t.title} ${t.isPinned ? "已固定" : "已取消固定"}`), this.renderMergedTabBar();
  }
  /**
   * 渲染合并标签栏：每面板一组，组间分隔条
   * 使用渲染签名对比，状态无变化时跳过DOM重建（避免监听器频繁触发时闪烁）
   */
  renderMergedTabBar() {
    var o, s;
    if (!this.tabContainer || this.mergedRenderInProgress) return;
    const e = this.collectViewPanels((o = orca.state) == null ? void 0 : o.panels), t = (s = orca.state) == null ? void 0 : s.activePanel;
    let i = this.currentWorkspace ? this.workspaces.find((l) => l.id === this.currentWorkspace) ?? null : null;
    const a = [];
    for (const l of e) {
      const d = l.id, h = l.view;
      if (!d || d.startsWith("_") || !h) continue;
      const u = this.panelHistoryMap.get(d);
      if (!u || u.length === 0) continue;
      const b = this.makeHistoryKey(h, l.viewArgs);
      a.push(`${d}${d === t ? "*" : ""}@${b}#${u.map((g) => `${g.key}~${g.title}~${g.color ?? ""}~${g.icon}~${g.isPinned ? 1 : 0}`).join(",")}`);
    }
    const r = i ? `ws:${i.id}#${i.tabs.map((l) => `${l.blockId}~${l.title}~${l.color ?? ""}~${l.icon ?? ""}~${l.isPinned ? 1 : 0}`).join(",")}` : "", n = `${this.enableWorkspaces ? 1 : 0}|${r}|${a.join("||")}`;
    if (n !== this.mergedRenderSignature) {
      this.mergedRenderSignature = n, this.mergedRenderInProgress = !0;
      try {
        const l = this.tabContainer.querySelector(".drag-handle");
        this.tabContainer.querySelectorAll(".orca-tab, .orca-tab-sep").forEach((b) => b.remove()), l && l.parentElement !== this.tabContainer && this.tabContainer.insertBefore(l, this.tabContainer.firstChild);
        const d = document.createDocumentFragment();
        let h = !0;
        for (const b of e) {
          const g = b.id, m = b.view;
          if (!g || g.startsWith("_") || !m) continue;
          const p = this.panelHistoryMap.get(g), f = i !== null;
          if (!f && (!p || p.length === 0)) continue;
          if (!h) {
            const w = document.createElement("div");
            w.className = "orca-tab-sep", d.appendChild(w);
          }
          if (h = !1, f) {
            const w = i, x = this.getPanelCurrentBlockId(b), T = g === t;
            for (const E of w.tabs) {
              const I = x != null && E.blockId === x ? T ? "orca-tab-active" : "orca-tab-current" : "";
              d.appendChild(this.createWorkspaceTabElement(E, g, I));
            }
            i = null;
            continue;
          }
          const y = this.makeHistoryKey(m, b.viewArgs);
          for (const w of p) {
            const x = this.createMergedTabElement(w, y, g, g === t);
            d.appendChild(x);
          }
        }
        const u = this.tabContainer.querySelector(".new-tab-button");
        u ? this.tabContainer.insertBefore(d, u) : this.tabContainer.appendChild(d), this.addNewTabButton(), this.enableWorkspaces && this.addWorkspaceButton();
      } finally {
        this.mergedRenderInProgress = !1;
      }
    }
  }
  /**
   * 合并模式状态变化处理 - 防抖后刷新历史与标签栏
   * 由 valtio 订阅 / DOM监听 / 聚焦事件触发，保证任何面板变化即时反映
   */
  handleMergedStateChange() {
    this.enableMergedTabBar && (this.restoringPanelLayout || this.mergedRefreshTimer === null && (this.mergedRefreshTimer = window.setTimeout(() => {
      this.mergedRefreshTimer = null, !(!this.enableMergedTabBar || this.restoringPanelLayout) && this.syncPanelHistory().then(() => {
        this.enableMergedTabBar && this.renderMergedTabBar();
      }).catch((e) => {
        this.warn("合并模式刷新失败:", e);
      });
    }, 50)));
  }
  /**
   * 启用合并模式实时监听：
   * 1. valtio 订阅 orca.state（面板树/视图变化即时通知）
   * 2. MutationObserver 监听 #main（面板增删/焦点类名变化）
   * 3. focusin 事件（用户点击切换面板）
   */
  enableMergedModeWatchers() {
    if (this.mergedModeObserver || this.mergedModeUnsubscribe) return;
    try {
      const t = window.Valtio;
      t != null && t.subscribe && orca.state && (this.mergedModeUnsubscribe = t.subscribe(orca.state, this.mergedStateSubscriber));
    } catch (t) {
      this.warn("valtio 订阅失败:", t);
    }
    this.mergedModeObserver = new MutationObserver(() => {
      this.handleMergedStateChange();
    });
    const e = document.getElementById("main");
    this.mergedModeObserver.observe(e || document.body, {
      subtree: !0,
      childList: !0,
      attributes: !0,
      attributeFilter: ["class", "data-panel-id"]
    }), document.addEventListener("focusin", this.mergedFocusInHandler), this.mergedRenderSignature = "", this.log("🔀 合并模式实时监听已启用");
  }
  /**
   * 停用合并模式实时监听
   */
  disableMergedModeWatchers() {
    if (this.mergedModeUnsubscribe) {
      try {
        this.mergedModeUnsubscribe();
      } catch {
      }
      this.mergedModeUnsubscribe = null;
    }
    this.mergedModeObserver && (this.mergedModeObserver.disconnect(), this.mergedModeObserver = null), document.removeEventListener("focusin", this.mergedFocusInHandler), this.mergedRefreshTimer !== null && (clearTimeout(this.mergedRefreshTimer), this.mergedRefreshTimer = null), this.mergedRenderSignature = "", this.log("🔀 合并模式实时监听已停用");
  }
  /**
   * 创建标签图标元素（兼容 Tabler 图标与 emoji 图标）
   * - 以 "ti ti-" 开头视为 Tabler 图标，用 <i class> 渲染
   * - 其余（emoji / 用户自定义 _icon 值）用 <span textContent> 渲染
   */
  createMergedTabIcon(e, t) {
    if (e.startsWith("ti ti-")) {
      const a = document.createElement("i");
      return a.className = `${t} ${e}`, a;
    }
    const i = document.createElement("span");
    return i.className = t, i.textContent = e, i;
  }
  /**
   * 创建合并模式标签元素（不复用 createTabElement，避免长按/右键/双击等事件体系冲突）
   */
  createMergedTabElement(e, t, i, a) {
    var d;
    const r = document.createElement("div"), n = e.key === t;
    if (r.className = "orca-tab orca-tab-merged" + (n ? a ? " orca-tab-active" : " orca-tab-current" : ""), r.setAttribute("data-orca-tabs-key", e.key), r.setAttribute("data-orca-tabs-panel-id", i), r.draggable = !0, r.title = e.title, e.color) {
      const h = e.color.startsWith("#") ? e.color : `#${e.color}`;
      r.style.setProperty("--tab-color", h), r.style.background = "var(--orca-tab-colored-bg)", r.style.color = "var(--orca-tab-colored-text)", r.style.fontWeight = "600";
    }
    e.icon && (this.showBlockTypeIcons || e.view === "journal") && r.appendChild(this.createMergedTabIcon(e.icon, "orca-tab-icon"));
    const o = document.createElement("span");
    o.className = "orca-tab-label", o.textContent = e.title, r.appendChild(o), e.isPinned && r.appendChild(me());
    const s = ((d = this.panelHistoryMap.get(i)) == null ? void 0 : d.length) ?? 1, l = this.collectViewPanels(orca.state.panels).length;
    if (!e.isPinned && (s > 1 || l > 1)) {
      const h = document.createElement("span");
      h.className = "orca-tab-close", h.textContent = "×", h.title = "移出缓存", h.addEventListener("click", (u) => {
        u.stopPropagation(), this.removeHistoryEntry(i, e.key);
      }), r.appendChild(h);
    }
    return r.addEventListener("click", () => {
      if (r.getAttribute("data-long-pressed") === "true") {
        r.removeAttribute("data-long-pressed");
        return;
      }
      this.navigateToHistoryEntry(e);
    }), r.addEventListener("auxclick", (h) => {
      h.button === 1 && (h.preventDefault(), this.enableMiddleClickPin ? this.toggleMergedEntryPin(i, e) : this.removeHistoryEntry(i, e.key));
    }), r.addEventListener("dblclick", (h) => {
      h.preventDefault(), h.stopPropagation(), this.enableDoubleClickClose ? this.removeHistoryEntry(i, e.key) : this.toggleMergedEntryPin(i, e);
    }), r.addEventListener("contextmenu", (h) => {
      this.showMergedTabContextMenu(h, e, i);
    }), this.addMergedLongPressEvents(r, e, i), r.addEventListener("dragstart", (h) => {
      if (h.dataTransfer) {
        h.dataTransfer.effectAllowed = "copyMove";
        try {
          h.dataTransfer.setData("text/plain", e.title);
        } catch {
        }
      }
      this.activeDragPayload = { kind: "history", panelId: i, key: e.key, entry: e }, this.setupPanelDropListeners(), r.classList.add("orca-tab-dragging");
    }), r.addEventListener("dragend", () => {
      var h;
      this.activeDragPayload = null, this.hidePanelDropHint(), (h = this.tabContainer) == null || h.querySelectorAll(".orca-tab-insert").forEach((u) => u.classList.remove("orca-tab-insert")), r.classList.remove("orca-tab-dragging"), this.debouncedUpdateTabsUI();
    }), r.addEventListener("dragover", (h) => {
      const u = this.activeDragPayload;
      !u || u.panelId !== i || (h.preventDefault(), h.stopPropagation(), r.classList.add("orca-tab-insert"));
    }), r.addEventListener("dragleave", () => {
      r.classList.remove("orca-tab-insert");
    }), r.addEventListener("drop", (h) => {
      const u = this.activeDragPayload;
      if (!u || u.panelId !== i) return;
      h.preventDefault(), h.stopPropagation(), r.classList.remove("orca-tab-insert");
      const b = this.panelHistoryMap.get(i);
      if (!b) return;
      const g = b.findIndex((f) => f.key === u.key), m = b.findIndex((f) => f.key === e.key);
      if (g < 0 || m < 0 || g === m) return;
      const [p] = b.splice(g, 1);
      b.splice(m, 0, p), this.sortMergedListByPin(b), this.activeDragPayload = null, this.debouncedUpdateTabsUI();
    }), r;
  }
  /**
   * 合并模式标签长按事件：长按显示全局最近切换历史悬浮列表
   * 适配历史条目数据模型（entry.key/view/viewArgs 而非 TabInfo）
   */
  addMergedLongPressEvents(e, t, i) {
    let a = null, r = !1, n = null;
    const o = (d) => {
      if (!r || !n) return;
      const h = d.clientX - n.x, u = d.clientY - n.y;
      h * h + u * u > 25 && s();
    }, s = () => {
      a && (clearTimeout(a), a = null), r = !1, n = null, document.removeEventListener("mousemove", o);
    }, l = {
      maxDisplayCount: 5,
      scrollStep: 1,
      animationDuration: 200,
      minOpacity: 0.3,
      minScale: 0.8,
      enableScroll: !0,
      maxWidth: 150
    };
    e.addEventListener("mousedown", (d) => {
      d.button === 0 && (r = !0, n = { x: d.clientX, y: d.clientY }, document.addEventListener("mousemove", o), a = window.setTimeout(async () => {
        var h;
        if (r && !(this.draggingTab || this.isDragging)) {
          if (t.isPinned) {
            this.verboseLog(`📌 合并标签 ${t.title} 已固定，不显示长按列表`);
            return;
          }
          e.setAttribute("data-long-pressed", "true");
          try {
            const b = (await this.tabStorageService.restoreRecentTabSwitchHistory()).global_tab_history;
            if (!b || b.recentTabs.length === 0) {
              this.verboseLog("⚠️ 没有全局切换历史记录，不显示悬浮列表");
              return;
            }
            const g = this.panelHistoryMap.get(i) ?? [], m = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Set();
            for (const k of g)
              k.view === "block" && ((h = k.viewArgs) == null ? void 0 : h.blockId) != null ? m.add(String(k.viewArgs.blockId)) : k.view.startsWith("view:") && p.add(k.view.slice(5));
            const f = b.recentTabs.filter((k) => !(m.has(k.blockId) || (k.isViewPanel || k.blockId.startsWith("view:")) && p.has(k.panelId)));
            if (f.length === 0) return;
            const y = e.getBoundingClientRect(), w = { x: y.left, y: y.bottom + 4 }, x = (k) => {
              if (D(), k.isViewPanel || k.blockId.startsWith("view:")) {
                orca.nav.switchFocusTo(k.panelId);
                return;
              }
              if (k.isJournal) {
                const S = this.extractDateFromTitle(k.title);
                if (S) {
                  this.recordTabSwitchHistory(t.key, k);
                  try {
                    orca.nav.goTo("journal", { date: S }, i), orca.nav.switchFocusTo(i);
                  } catch (H) {
                    this.warn("长按列表导航到日志失败:", H);
                  }
                  this.debouncedUpdateTabsUI();
                  return;
                }
              }
              const I = parseInt(k.blockId, 10);
              if (!Number.isNaN(I)) {
                this.recordTabSwitchHistory(t.key, k);
                try {
                  orca.nav.goTo("block", { blockId: I }, i), orca.nav.switchFocusTo(i);
                } catch (S) {
                  this.warn("长按列表导航失败:", S);
                }
                this.debouncedUpdateTabsUI();
              }
            }, T = ve(
              f,
              w,
              l,
              x,
              this.isVerticalMode
            );
            l.enableScroll && f.length > l.maxDisplayCount && this.addScrollEvents(T, f, l, 0, x);
            const E = (k) => {
              const I = k.target;
              this.safeClosest(I, ".hover-tab-list-container") || (D(), document.removeEventListener("click", E));
            };
            setTimeout(() => {
              document.addEventListener("click", E);
            }, 100);
          } catch (u) {
            this.warn("合并模式长按悬浮列表失败:", u);
          }
        }
      }, 500));
    }), e.addEventListener("mouseup", () => {
      s();
    }), e.addEventListener("mouseleave", () => {
      s();
    }), e.addEventListener("dragstart", () => {
      s(), e.removeAttribute("data-long-pressed"), D();
    });
  }
  /**
   * 创建合并模式下的工作区标签元素
   * 工作区标签与普通标签语义一致：未打开的也显示，点击才导航打开
   * 关闭（×/中键）= 从工作区标签组移除（不关闭实际视图）
   */
  createWorkspaceTabElement(e, t, i = "") {
    const a = document.createElement("div");
    if (a.className = "orca-tab orca-tab-merged" + (i ? ` ${i}` : ""), a.setAttribute("data-orca-tabs-block-id", e.blockId), a.draggable = !0, a.title = e.title, e.color) {
      const n = e.color.startsWith("#") ? e.color : `#${e.color}`;
      a.style.setProperty("--tab-color", n), a.style.background = "var(--orca-tab-colored-bg)", a.style.color = "var(--orca-tab-colored-text)", a.style.fontWeight = "600";
    }
    e.icon && this.showBlockTypeIcons && a.appendChild(this.createMergedTabIcon(e.icon, "orca-tab-icon"));
    const r = document.createElement("span");
    if (r.className = "orca-tab-label", r.textContent = e.title, a.appendChild(r), e.isPinned && a.appendChild(me()), !e.isPinned) {
      const n = document.createElement("span");
      n.className = "orca-tab-close", n.textContent = "×", n.title = "从工作区移除", n.addEventListener("click", (o) => {
        o.stopPropagation(), this.removeTabFromActiveWorkspace(e);
      }), a.appendChild(n);
    }
    return a.addEventListener("click", () => {
      try {
        orca.nav.switchFocusTo(t);
      } catch {
      }
      this.safeNavigate(e.blockId, t, e), this.currentWorkspace && (this.lastActiveBlockId = e.blockId, this.updateCurrentWorkspaceActiveIndex(e));
    }), a.addEventListener("auxclick", (n) => {
      n.button === 1 && (n.preventDefault(), this.enableMiddleClickPin ? this.toggleWorkspaceTabPin(e) : this.removeTabFromActiveWorkspace(e));
    }), a.addEventListener("dblclick", (n) => {
      n.preventDefault(), n.stopPropagation(), this.enableDoubleClickClose ? this.removeTabFromActiveWorkspace(e) : this.toggleWorkspaceTabPin(e);
    }), a.addEventListener("contextmenu", (n) => {
      this.showWorkspaceTabContextMenu(n, e);
    }), a.addEventListener("dragstart", (n) => {
      if (n.dataTransfer) {
        n.dataTransfer.effectAllowed = "copyMove";
        try {
          n.dataTransfer.setData("text/plain", e.blockId);
        } catch {
        }
      }
      this.activeDragPayload = { kind: "tab", panelId: e.panelId, key: e.blockId, tab: e }, this.setupPanelDropListeners(), a.classList.add("orca-tab-dragging");
    }), a.addEventListener("dragend", () => {
      this.activeDragPayload = null, this.hidePanelDropHint(), a.classList.remove("orca-tab-dragging");
    }), a;
  }
  /**
   * 从激活的工作区移除标签并保存
   */
  async removeTabFromActiveWorkspace(e) {
    const t = this.workspaces.find((i) => i.id === this.currentWorkspace);
    if (t) {
      if (e.isPinned) {
        orca.notify("info", `标签 "${e.title}" 已固定，请先取消固定再移除`);
        return;
      }
      t.tabs = t.tabs.filter((i) => i.blockId !== e.blockId), this.removedWorkspaceBlockIds.add(e.blockId), t.updatedAt = Date.now(), await this.saveWorkspaces(), this.log(`📁 已从工作区 "${t.name}" 移除标签: ${e.title}`), this.debouncedUpdateTabsUI();
    }
  }
  /**
   * 切换工作区标签的固定状态（固定标签排最前）并保存
   */
  async toggleWorkspaceTabPin(e) {
    const t = this.workspaces.find((i) => i.id === this.currentWorkspace);
    t && (e.isPinned = !e.isPinned, t.tabs = [...t.tabs.filter((i) => i.isPinned), ...t.tabs.filter((i) => !i.isPinned)], t.updatedAt = Date.now(), await this.saveWorkspaces(), this.log(`📌 工作区标签固定状态: ${e.title} ${e.isPinned ? "已固定" : "已取消固定"}`), this.renderMergedTabBar());
  }
  /**
   * 导航到历史条目对应的视图
   */
  navigateToHistoryEntry(e) {
    var t;
    try {
      e.view.startsWith("view:") || orca.nav.goTo(e.view, e.viewArgs, e.panelId), orca.nav.switchFocusTo(e.panelId);
    } catch (i) {
      this.warn("导航到历史条目失败:", i);
    }
    if (e.view === "block" && ((t = e.viewArgs) == null ? void 0 : t.blockId) != null) {
      const i = {
        blockId: String(e.viewArgs.blockId),
        panelId: e.panelId,
        title: e.title,
        order: 0,
        ...e.icon ? { icon: e.icon } : {},
        ...e.color ? { color: e.color } : {}
      };
      this.recordTabSwitchHistory(e.key, i);
    }
    this.debouncedUpdateTabsUI();
  }
  /**
   * 从历史缓存移除条目（可恢复的视图类型进入最近关闭列表）
   */
  removeHistoryEntry(e, t) {
    const i = this.panelHistoryMap.get(e);
    if (!i) return;
    const a = i.findIndex((o) => o.key === t);
    if (a < 0) return;
    const r = i[a], n = this.collectViewPanels(orca.state.panels).length;
    if (i.length <= 1 && n <= 1) {
      this.log("⚠️ 唯一的标签页无法关闭"), orca.notify("info", "至少保留一个标签页");
      return;
    }
    if (r.isPinned) {
      this.log(`⚠️ 固定标签 "${r.title}" 不可移除，请先取消固定`), orca.notify("info", `标签 "${r.title}" 已固定，请先取消固定再移出`);
      return;
    }
    this.removeHistoryEntryCore(e, t);
  }
  /**
   * removeHistoryEntry 的核心移除逻辑
   */
  removeHistoryEntryCore(e, t) {
    const i = this.panelHistoryMap.get(e);
    if (!i) return;
    const a = i.findIndex((d) => d.key === t);
    if (a < 0) return;
    const r = i[a], n = orca.nav.findViewPanel(e, orca.state.panels), o = n ? this.makeHistoryKey(n.view ?? "", n.viewArgs) === t : !1;
    i.splice(a, 1);
    const s = this.mergedPinnedMap[e];
    s && s.includes(t) && (this.mergedPinnedMap[e] = s.filter((d) => d !== t), this.tabStorageService.saveMergedPinnedEntries(this.mergedPinnedMap));
    const l = `${e}|${t}`;
    if (this.mergedTitleOverrides[l] !== void 0 && (delete this.mergedTitleOverrides[l], this.tabStorageService.saveMergedTitleOverrides(this.mergedTitleOverrides)), this.pushHistoryEntryToRecentlyClosed(r), i.length) {
      if (o) {
        const d = i[Math.min(a, i.length - 1)];
        d && this.navigateToHistoryEntry(d);
      }
    } else {
      try {
        orca.nav.close(e);
      } catch (d) {
        this.warn("关闭面板失败:", d);
      }
      this.panelHistoryMap.delete(e);
    }
    this.renderMergedTabBar();
  }
  /**
   * 根据鼠标位置计算面板放置方向（四边距离比例 ≤0.25 判定边缘，否则中心）
   */
  computeDropDirection(e, t, i) {
    const a = (t - e.left) / Math.max(1, e.width), r = (i - e.top) / Math.max(1, e.height), n = [
      ["left", a],
      ["right", 1 - a],
      ["top", r],
      ["bottom", 1 - r]
    ];
    return n.sort((o, s) => o[1] - s[1]), n[0][1] <= 0.25 ? n[0][0] : "center";
  }
  /**
   * 显示面板放置提示（覆盖目标面板的对应半边或中心）
   */
  showPanelDropHint(e, t) {
    let i = this.panelDropHint;
    i || (i = document.createElement("div"), i.className = "orca-tabs-panel-drophint", document.body.appendChild(i), this.panelDropHint = i);
    const a = e.getBoundingClientRect();
    let r = a.left, n = a.top, o = a.width, s = a.height;
    t === "left" ? o = a.width / 2 : t === "right" ? (r = a.left + a.width / 2, o = a.width / 2) : t === "top" ? s = a.height / 2 : t === "bottom" && (n = a.top + a.height / 2, s = a.height / 2), i.style.display = "block", i.style.left = `${r}px`, i.style.top = `${n}px`, i.style.width = `${o}px`, i.style.height = `${s}px`;
  }
  /**
   * 隐藏面板放置提示
   */
  hidePanelDropHint() {
    this.panelDropHint && (this.panelDropHint.style.display = "none");
  }
  /**
   * 懒加载文档级拖拽监听（跨面板拖拽分屏，两种模式通用）
   */
  setupPanelDropListeners() {
    this.panelDropHandlersReady || (this.panelDropHandlersReady = !0, document.addEventListener("dragover", this.panelDropDragOverHandler, !0), document.addEventListener("drop", this.panelDropDropHandler, !0));
  }
  /**
   * 解析普通标签的导航目标
   */
  resolveTabNavigate(e) {
    const t = e.tab;
    if (!t) return null;
    if (t.isViewPanel || t.blockId.startsWith("view:")) {
      const a = t.blockId.startsWith("view:") ? t.blockId.substring(5) : t.panelId;
      return { view: `view:${a}`, viewArgs: {}, switchFocusTarget: a };
    }
    if (t.isJournal) {
      const a = this.extractDateFromTitle(t.title);
      return a ? { view: "journal", viewArgs: { date: a }, switchFocusTarget: "" } : null;
    }
    const i = parseInt(t.blockId, 10);
    return Number.isNaN(i) ? null : { view: "block", viewArgs: { blockId: i }, switchFocusTarget: "" };
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 拖拽功能 - Drag Functionality */
  /* ———————————————————————————————————————————————————————————————————————————— */
  startDrag(e) {
    if (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.enableBubbleMode && (this.isBubbleExpanded || this.expandBubble(), this.bubbleCollapseTimer && (clearTimeout(this.bubbleCollapseTimer), this.bubbleCollapseTimer = null), this.tabContainer)) {
      const r = this.tabContainer._bubbleMouseEnterHandler, n = this.tabContainer._bubbleMouseLeaveHandler, o = this.tabContainer._bubbleClickOutsideHandler;
      r && this.tabContainer.removeEventListener("mouseenter", r), n && this.tabContainer.removeEventListener("mouseleave", n), o && document.removeEventListener("click", o, !0);
    }
    this.isDragging = !0;
    const t = this.isVerticalMode ? this.verticalPosition : this.position;
    if (this.dragStartX = e.clientX - t.x, this.dragStartY = e.clientY - t.y, this.tabContainer) {
      this.tabContainer.classList.add("dragging"), this.tabContainer.style.transition = "none";
      const r = this.tabContainer.querySelector(".drag-handle");
      r && r.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const i = (r) => {
      this.isDragging && (r.preventDefault(), r.stopPropagation(), this.drag(r));
    }, a = (r) => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", a), this.stopDrag();
    };
    document.addEventListener("mousemove", i), document.addEventListener("mouseup", a), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    if (e.preventDefault(), this.enableBubbleMode && !this.isBubbleExpanded) {
      this.isBubbleExpanded = !0;
      const s = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)", l = this.isVerticalMode ? this.verticalPosition : this.position, d = ae(
        this.isVerticalMode,
        l,
        s,
        this.verticalWidth,
        void 0,
        void 0,
        !0,
        !0
      );
      this.tabContainer.style.cssText = d;
    }
    this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), i = 5, a = window.innerWidth - t.width - 5, r = 5, n = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(i, Math.min(a, this.verticalPosition.x)), this.verticalPosition.y = Math.max(r, Math.min(n, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(i, Math.min(a, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(r, Math.min(n, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const o = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = o.x + "px", this.tabContainer.style.top = o.y + "px", this.ensureClickableElements();
  }
  async stopDrag() {
    if (this.isDragging = !1, this.tabContainer) {
      this.tabContainer.classList.remove("dragging");
      const e = this.tabContainer.querySelector(".drag-handle");
      if (e && e.classList.remove("dragging"), this.tabContainer.style.cursor = "default", this.enableBubbleMode && this.isBubbleExpanded ? this.tabContainer.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" : this.enableBubbleMode && !this.isBubbleExpanded ? this.tabContainer.style.transition = "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)" : this.tabContainer.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)", this.enableEdgeHide && !this.isFixedToTop && !this.isFixedToEditorTop && (this.edgeHideTriggerElement && (this.edgeHideTriggerElement.remove(), this.edgeHideTriggerElement = null), this.boundContainerMouseEnter && this.boundContainerMouseLeave && (this.tabContainer.removeEventListener("mouseenter", this.boundContainerMouseEnter), this.tabContainer.removeEventListener("mouseleave", this.boundContainerMouseLeave), this.boundContainerMouseEnter = null, this.boundContainerMouseLeave = null), this.tabContainer.style.transform = "none", this.isEdgeHideExpanded = !0, this.currentEdgeSide = null, this.verboseLog("🔄 拖拽结束，重置贴边隐藏状态，准备重新检测"), this.debouncedApplyEdgeHideStyle(200)), this.enableBubbleMode && (this.bubbleCollapseTimer && (clearTimeout(this.bubbleCollapseTimer), this.bubbleCollapseTimer = null), this.tabContainer)) {
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
   * 保存固定到编辑器顶部状态到API配置
   */
  async saveFixedToEditorTopMode() {
    await this.tabStorageService.saveFixedToEditorTopMode(this.isFixedToEditorTop);
  }
  /**
   * 从API配置恢复固定到编辑器顶部状态
   */
  async restoreFixedToEditorTopMode() {
    try {
      this.isFixedToEditorTop = await this.tabStorageService.restoreFixedToEditorTopMode(), this.log(`📐 固定到编辑器顶部状态已恢复: ${this.isFixedToEditorTop ? "启用" : "禁用"}`);
    } catch (e) {
      this.error("恢复固定到编辑器顶部状态失败:", e), this.isFixedToEditorTop = !1;
    }
  }
  /**
   * 切换固定到编辑器顶部模式
   * 与固定到顶部(headbar内嵌)互斥：开启本模式时自动关闭固定到顶部
   */
  async toggleFixedToEditorTop() {
    try {
      this.log(`🔄 切换固定到编辑器顶部: ${this.isFixedToEditorTop ? "取消固定" : "固定"}`), this.isFixedToEditorTop = !this.isFixedToEditorTop, this.isFixedToEditorTop && (this.isFixedToTop = !1, await this.saveFixedToTopMode()), await this.saveFixedToEditorTopMode(), await this.createTabsUI(), this.log(`✅ 固定到编辑器顶部已${this.isFixedToEditorTop ? "启用" : "禁用"}`);
    } catch (e) {
      this.error("切换固定到编辑器顶部失败:", e);
    }
  }
  /**
   * 更新固定到编辑器顶部的位置（对齐参考插件的实现方式）：
   * 1. CSS变量设置在 body 上（容器重建也不会丢失，参考插件同款做法）
   * 2. 左右对齐编辑器区域(#main)的边界
   * 3. 推移 #main 由样式表中的 body 类规则完成（纯CSS，无JS时序问题）
   */
  updateEditorTopPosition() {
    if (!this.isFixedToEditorTop || !this.tabContainer) return;
    const e = document.getElementById("main");
    if (!e) return;
    const t = e.getBoundingClientRect(), i = document.body.style;
    i.setProperty("--orca-tabs-editor-left", `${Math.max(0, Math.round(t.left))}px`), i.setProperty("--orca-tabs-editor-right", `${Math.max(0, Math.round(window.innerWidth - t.right))}px`), i.setProperty("--orca-tabs-editor-top", `${Math.max(0, Math.round(t.top))}px`), i.setProperty("--orca-tabs-editor-bottom", `${Math.max(0, Math.round(window.innerHeight - t.bottom))}px`);
  }
  /**
   * 启用固定到编辑器顶部的位置跟随监听
   * 侧边栏开合、窗口缩放时实时更新标签栏位置；
   * 额外提供1秒兜底轮询，无论侧边栏以何种方式开合都能及时修正
   */
  setupEditorTopWatchers() {
    if (this.teardownEditorTopWatchers(), !this.isFixedToEditorTop) return;
    document.body.classList.add("orca-tabs-fixed-editor-top"), this.updateEditorTopPosition(), this.editorTopObserver = new ResizeObserver(() => this.updateEditorTopPosition());
    const e = [
      document.getElementById("main"),
      document.getElementById("sidebar"),
      document.querySelector(".orca-sidebar"),
      document.body
    ];
    for (const t of e)
      t && this.editorTopObserver.observe(t);
    this.editorTopBodyObserver = new MutationObserver(() => this.handleEditorTopResize()), this.editorTopBodyObserver.observe(document.body, {
      attributes: !0,
      attributeFilter: ["class"]
    }), window.addEventListener("resize", this.handleEditorTopResize), document.addEventListener("transitionend", this.handleEditorTopResize), this.editorTopGuardTimer = window.setInterval(() => {
      this.updateEditorTopPosition();
    }, 1e3);
  }
  /**
   * 关闭固定到编辑器顶部的位置跟随监听（移除body类即恢复 #main 原始布局）
   */
  teardownEditorTopWatchers() {
    window.removeEventListener("resize", this.handleEditorTopResize), document.removeEventListener("transitionend", this.handleEditorTopResize), this.editorTopObserver && (this.editorTopObserver.disconnect(), this.editorTopObserver = null), this.editorTopBodyObserver && (this.editorTopBodyObserver.disconnect(), this.editorTopBodyObserver = null), this.editorTopGuardTimer !== null && (clearInterval(this.editorTopGuardTimer), this.editorTopGuardTimer = null), document.body.classList.remove("orca-tabs-fixed-editor-top");
    const e = document.body.style;
    e.removeProperty("--orca-tabs-editor-left"), e.removeProperty("--orca-tabs-editor-right"), e.removeProperty("--orca-tabs-editor-top"), e.removeProperty("--orca-tabs-editor-bottom");
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
      ), this.position = it(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${ze(this.position, this.isVerticalMode)}`);
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
        Q()
      );
      if (e) {
        const t = at(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = ue(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.horizontalTabMaxWidth = t.horizontalTabMaxWidth, this.horizontalTabMinWidth = t.horizontalTabMinWidth, this.enableEdgeHide = t.enableEdgeHide, this.enableBubbleMode = t.enableBubbleMode, !this.isVerticalMode && this.enableBubbleMode && (this.enableBubbleMode = !1, this.isBubbleExpanded = !1, this.verboseLog("🫧 恢复配置：水平模式不支持气泡模式，已自动禁用")), this.log(`📐 布局模式已恢复: ${nt(t)}, 当前位置: (${this.position.x}, ${this.position.y})`), this.isSidebarAlignmentEnabled && (this.startSidebarAlignmentObserver(), this.log("🔄 侧边栏对齐监听器已启动"));
      } else {
        const t = Q();
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
    this.position = qi(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var s, l;
    const i = (s = this.tabContainer) == null ? void 0 : s.querySelectorAll(".orca-tabs-plugin .orca-tab");
    i == null || i.forEach((d) => d.removeAttribute("data-focused"));
    const a = this.getCurrentPanelTabs();
    let r = null;
    if (this.lastActiveTabInstanceId) {
      const d = a.find((h) => h.tabId === this.lastActiveTabInstanceId);
      d && d.blockId === e && (r = d);
    }
    r || (r = a.find((d) => d.blockId === e) || null);
    const n = r != null && r.tabId ? `[data-orca-tabs-tab-id="${r.tabId}"]` : `[data-orca-tabs-block-id="${e}"]`, o = (l = this.tabContainer) == null ? void 0 : l.querySelector(n);
    if (o) {
      o.setAttribute("data-focused", "true");
      const d = o.getAttribute("data-orca-tabs-tab-id");
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
          const r = a.getAttribute("data-panel-id");
          r && this.handleNewBlockInPanel(i, r).catch((n) => {
            this.error(`处理新块失败: ${i}`, n);
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
        const r = e.closest(".orca-panel");
        if (r) {
          const n = r.getAttribute("data-panel-id");
          n && this.handleNewBlockInPanel(a, n).catch((o) => {
            this.error(`处理新块失败: ${a}`, o);
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
    var g, m;
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
    const a = document.querySelector(".orca-panel.active"), r = a == null ? void 0 : a.getAttribute("data-panel-id");
    if (r && t !== r) {
      this.log(`🚫 忽略非激活面板 ${t} 中的新块 ${e}，当前激活面板为 ${r}`);
      return;
    }
    const o = this.getPanelIds().indexOf(t);
    if (o === -1) {
      const p = document.querySelectorAll(".orca-panel");
      if (!(p.length > 0 && p[0].getAttribute("data-panel-id") === t)) {
        this.log(`🚫 不管理辅助面板 ${t} 的标签页`);
        return;
      }
    }
    o !== -1 && (this.currentPanelIndex = o, this.currentPanelId = t);
    let s = this.getCurrentPanelTabs();
    this.verboseLog(`🔍 [DEBUG] 当前标签页数量: ${s.length}`);
    const l = s.find((p) => p.blockId === e);
    if (l) {
      this.verboseLog(`🔍 [DEBUG] ✅ 标签 ${e} 已存在，只更新聚焦状态`), this.closedTabs.has(e) && (this.closedTabs.delete(e), this.saveClosedTabs()), this.updateFocusState(e, l.title), this.immediateUpdateTabsUI(), this.verboseLog("🔍 [DEBUG] ========== handleNewBlockInPanel 完成（已存在）==========");
      return;
    }
    this.verboseLog(`🔍 [DEBUG] ❌ 标签 ${e} 不存在，准备创建新标签`), this.creatingTabs.add(e);
    let d = null;
    try {
      if (d = await this.createTabInfoFromBlock(e, t), !d) return;
      s = this.getCurrentPanelTabs();
      const p = s.find((f) => f.blockId === e);
      if (p) {
        this.log(`✅ 标签已被其他地方创建（在await期间），只更新聚焦状态: "${p.title}"`), this.updateFocusState(e, p.title), this.immediateUpdateTabsUI();
        return;
      }
    } finally {
      this.creatingTabs.delete(e);
    }
    const h = this.getCurrentActiveTab();
    if (h) {
      if (h.isPinned) {
        this.log(`📌 当前激活标签已置顶，创建新标签: "${d.title}"`);
        const f = s.filter((y) => y.isPinned).length;
        s.splice(f, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
      const p = s.findIndex((f) => f.blockId === h.blockId);
      if (p !== -1) {
        this.verboseLog(`🔄 替换当前激活标签页: "${h.title}" -> "${d.title}"`), this.recordTabSwitchHistory(h.blockId, d), d.tabId = s[p].tabId || d.tabId, s[p] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    if (this.lastActiveBlockId) {
      const p = s.findIndex((f) => f.blockId === this.lastActiveBlockId);
      if (p !== -1) {
        if (s[p].isPinned) {
          this.log(`📌 上一个激活标签已置顶，创建新标签: "${d.title}"`);
          const y = s.filter((w) => w.isPinned).length;
          s.splice(y, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
          return;
        }
        this.log(`🔄 使用上一个激活标签页作为替换目标: "${s[p].title}" -> "${d.title}"`), this.recordTabSwitchHistory(s[p].blockId, d), d.tabId = s[p].tabId || d.tabId, s[p] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
        return;
      }
    }
    let u = -1;
    const b = (g = this.tabContainer) == null ? void 0 : g.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (b) {
      const p = b.getAttribute("data-orca-tabs-tab-id"), f = b.getAttribute("data-orca-tabs-block-id");
      u = s.findIndex((y) => y.tabId === p), u == -1 && f && (u = s.findIndex((y) => y.blockId === f));
    }
    if (u === -1) {
      const p = (m = this.tabContainer) == null ? void 0 : m.querySelectorAll(".orca-tabs-plugin .orca-tab");
      if (p && p.length > 0)
        for (let f = 0; f < p.length; f++) {
          const y = p[f];
          if (y.classList.contains("focused") || y.getAttribute("data-focused") === "true" || y.classList.contains("active")) {
            u = f;
            break;
          }
        }
    }
    if (u === -1 && s.length > 0 && (u = 0, this.log("⚠️ 无法确定当前聚焦的标签页，使用第一个标签页作为替换目标")), u >= 0 && u < s.length)
      if (s[u].isPinned) {
        this.log(`📌 目标标签已置顶，创建新标签: "${d.title}"`);
        const f = s.filter((y) => y.isPinned).length;
        s.splice(f, 0, d), this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
      } else
        d.tabId = s[u].tabId || d.tabId, s[u] = d, this.updateFocusState(e, d.title), this.setCurrentPanelTabs(s), this.immediateUpdateTabsUI();
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
        const f = document.querySelectorAll(".orca-panel");
        this.log("📊 当前所有面板状态:"), f.forEach((y, w) => {
          const x = y.getAttribute("data-panel-id"), T = y.classList.contains("active");
          this.log(`  面板${w + 1}: ID=${x}, active=${T}`);
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
        const y = `view:${a.panelId}`, w = f.find((x) => x.blockId === y);
        if (w)
          this.updateFocusState(y, w.title), await this.immediateUpdateTabsUI();
        else {
          const x = {
            blockId: y,
            tabId: K(y),
            panelId: a.panelId,
            title: a.title,
            icon: a.icon,
            order: 0,
            blockType: "view",
            isViewPanel: !0
          };
          this.panelTabsData[this.currentPanelIndex] = [x], this.log(`📋 为视图面板创建标签页: ${a.title}`);
          const T = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
          await this.savePanelTabsByKey(T, [x]), await this.immediateUpdateTabsUI();
        }
        return;
      }
      e.querySelectorAll(".orca-hideable");
      const r = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!r) {
        this.log(`❌ 激活面板 ${t} 中没有找到可见的块编辑器`);
        return;
      }
      const n = r.getAttribute("data-block-id");
      if (!n) {
        this.log("激活的块编辑器没有blockId");
        return;
      }
      let o = this.getCurrentPanelTabs();
      o.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), o = this.getCurrentPanelTabs());
      const s = o.find((f) => f.blockId === n);
      if (s) {
        this.closedTabs.has(n) && (this.closedTabs.delete(n), await this.saveClosedTabs()), this.updateFocusState(n, s.title), await this.immediateUpdateTabsUI();
        return;
      }
      const l = Date.now() - this.lastNavigationTime;
      if (this.lastNavigatedBlockId && l < 1e3 && o.find((y) => y.blockId === this.lastNavigatedBlockId)) {
        this.verboseLog(`⏭️ 检测到导航后的新块 ${n}，但我们刚导航到 ${this.lastNavigatedBlockId}，跳过处理（防止重复标签页）`), this.verboseLog(`⏭️ 时间差: ${l}ms`);
        return;
      }
      const d = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
      if (!d) {
        this.verboseLog(`⚠️ 未找到聚焦的标签元素，当前块: ${n}`);
        return;
      }
      const h = d.getAttribute("data-orca-tabs-tab-id"), u = d.getAttribute("data-orca-tabs-block-id");
      if (!h && !u)
        return;
      let b = o.findIndex((f) => f.tabId === h);
      if (b === -1 && u && (b = o.findIndex((f) => f.blockId === u)), b === -1)
        return;
      if (o[b].isPinned) {
        this.log(`📌 聚焦标签已置顶，不替换，创建新标签: "${n}"`);
        const f = o.find((y) => y.blockId === n);
        if (f) {
          this.log(`✅ 标签已被其他地方创建，只更新聚焦状态: "${f.title}"`), this.updateFocusState(n, f.title), await this.immediateUpdateTabsUI();
          return;
        }
        if (this.creatingTabs.has(n)) {
          this.log(`⏳ 标签 ${n} 正在被其他地方创建，跳过`);
          return;
        }
        this.creatingTabs.add(n);
        try {
          const y = await this.getTabInfo(n, t, o.length);
          if (!y)
            return;
          o = this.getCurrentPanelTabs();
          const w = o.find((T) => T.blockId === n);
          if (w) {
            this.log(`✅ 标签在创建过程中已被其他地方创建: "${w.title}"`), this.updateFocusState(n, w.title), await this.immediateUpdateTabsUI();
            return;
          }
          const x = o.filter((T) => T.isPinned).length;
          o.splice(x, 0, y), this.updateFocusState(n, y.title), this.setCurrentPanelTabs(o), await this.immediateUpdateTabsUI();
        } finally {
          this.creatingTabs.delete(n);
        }
        return;
      }
      const m = await this.getTabInfo(n, t, b);
      m && (m.tabId = o[b].tabId || m.tabId, o[b] = m, this.setCurrentPanelTabs(o), await this.immediateUpdateTabsUI());
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
      let n = !1, o = !1, s = !1, l = this.currentPanelIndex;
      const d = Date.now(), h = this.lastPanelCheckTime || 0, u = 1e3;
      if (r.forEach((b) => {
        if (b.type === "childList") {
          const g = b.target;
          if ((g.classList.contains("orca-panels-row") || g.closest(".orca-panels-row")) && (o = !0), b.addedNodes.length > 0 && g.closest(".orca-panel")) {
            for (const p of b.addedNodes)
              if (p.nodeType === Node.ELEMENT_NODE) {
                const f = p;
                if (this.handleNewHideableElement(f)) {
                  n = !0;
                  break;
                }
                if (f.classList.contains("orca-block-editor") || f.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
                if (this.handleChildHideableElements(f)) {
                  n = !0;
                  break;
                }
              }
          }
        }
        if (b.type === "attributes" && b.attributeName === "class") {
          const g = b.target;
          if (g.classList.contains("orca-panel")) {
            if (s = !0, g.classList.contains("active")) {
              const m = g.getAttribute("data-panel-id"), p = g.querySelectorAll(".orca-hideable");
              let f = null;
              p.forEach((y) => {
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
            g.classList.contains("orca-locked") && g.classList.contains("active") && (this.log("🔒 检测到锁定面板激活，聚焦上一个面板"), this.focusToPreviousPanel());
          }
          g.classList.contains("orca-hideable") && !g.classList.contains("orca-hideable-hidden") && (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦状态变化"), n = !0);
        }
        if (b.type === "attributes" && (b.attributeName === "data-panel-title" || b.attributeName === "data-panel-icon" || b.attributeName === "data-panel-type")) {
          const g = b.target;
          if (g.classList.contains("orca-panel")) {
            const m = g.getAttribute("data-panel-id"), p = g.getAttribute("data-panel-title"), f = g.getAttribute("data-panel-type");
            m && p && f === "view" && (this.verboseLog(`🎨 检测到视图面板元数据变化: ${p}`), n = !0);
          }
        }
      }), s && (await this.updateCurrentPanelIndex(), l !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${l} -> ${this.currentPanelIndex}`), await this.immediateUpdateTabsUI())), o && d - h > u ? (this.lastPanelCheckTime = d, this.verboseLog(`🔍 面板检查防抖：距离上次检查 ${d - h}ms`), setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100)) : o && d - h < 100 && this.verboseLog(`⏭️ 跳过面板检查：距离上次检查仅 ${d - h}ms`), n) {
        const b = Date.now(), g = 300, m = b - this.lastBlockCheckTime;
        m > g ? (this.lastBlockCheckTime = b, await this.checkCurrentPanelBlocks()) : m < 50 && this.verboseLog(`⏭️ 跳过块检查：距离上次检查仅 ${m}ms`);
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
    const a = async (r) => {
      if (!r || !r.target)
        return;
      const n = r.target;
      if (n.closest(".orca-tabs-plugin") || n.closest(".orca-sidebar") || n.closest(".orca-headbar"))
        return;
      const o = n.closest('.orca-panel[data-panel-type="view"]');
      if (o) {
        const l = o.getAttribute("data-panel-id"), d = l ? `view:${l}` : null;
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
      const s = n.closest(".orca-hideable");
      if (s) {
        const l = s.querySelector(".orca-block-editor[data-block-id]"), d = l == null ? void 0 : l.getAttribute("data-block-id");
        if (d && d === i) {
          this.verboseLog(`⏭️ 跳过重复检查：同一个块 ${d}`);
          return;
        }
        t && clearTimeout(t), t = window.setTimeout(async () => {
          if (!s.classList.contains("orca-hideable-hidden")) {
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
    document.addEventListener("click", a), document.addEventListener("mousedown", a), document.addEventListener("focusin", a), document.addEventListener("keydown", (r) => {
      (r.key === "Tab" || r.key === "Enter" || r.key === " ") && (t && clearTimeout(t), t = window.setTimeout(a, 0));
    }), typeof window < "u" && (this.focusSyncInterval !== null && window.clearInterval(this.focusSyncInterval), this.focusSyncInterval = window.setInterval(async () => {
      var r;
      try {
        const n = document.querySelector(".orca-panel.active");
        if (n) {
          const o = n.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
          if (o) {
            const s = o.getAttribute("data-block-id");
            if (s) {
              const l = (r = this.tabContainer) == null ? void 0 : r.querySelector('.orca-tab[data-focused="true"]'), d = !!l;
              if (!this.lastFocusState || this.lastFocusState.blockId !== s || this.lastFocusState.hasFocusedTab !== d)
                if (this.lastFocusState = { blockId: s, hasFocusedTab: d }, l) {
                  const u = l.getAttribute("data-orca-tabs-block-id");
                  u !== s && (this.verboseLog(`?? 焦点检测到变更: ${u} -> ${s}`), await this.checkCurrentPanelBlocks());
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
            this.currentPanelIndex = i, this.currentPanelId = t, this.log(`🔄 面板索引更新: ${a} -> ${i} (面板ID: ${t})`), (!this.panelTabsData[i] || this.panelTabsData[i].length === 0) && (this.log(`🔍 面板 ${t} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(i, t || "")), this.debouncedUpdateTabsUI(), this.enableEdgeHide && !this.isFixedToTop && !this.isFixedToEditorTop && this.debouncedApplyEdgeHideStyle(300);
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
    const r = document.querySelector(`.orca-panel[data-panel-id="${a}"]`);
    if (!r) {
      this.log(`❌ 未找到面板元素: ${a}`);
      return;
    }
    const n = document.querySelector(".orca-panel.active");
    n && n.classList.remove("active"), r.classList.add("active"), this.currentPanelIndex = i, this.currentPanelId = a, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${a}`);
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
      if (Array.from(e).filter((s) => {
        const l = s.getAttribute("data-panel-id");
        return l && !l.startsWith("_");
      }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
        this.verboseLog("📋 面板数量未变化，跳过面板发现");
        return;
      }
      const i = [...this.getPanelIds()], a = this.getPanelIds()[0] || null;
      await this.discoverPanels();
      const r = this.getPanelIds()[0] || null, n = Ki(i, this.getPanelIds());
      n && (this.log(`📋 面板列表发生变化: ${i.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${i.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${a} -> ${r}`), a !== r && (this.log(`🔄 持久化面板已变更: ${a} -> ${r}`), await this.handlePersistentPanelChange(a, r))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
      const o = document.querySelector(".orca-panel.active");
      if (o) {
        const s = o.getAttribute("data-panel-id");
        if (s && !s.startsWith("_") && (s !== this.currentPanelId || n)) {
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
    let r = 0;
    for (const n of i) {
      const o = n.querySelector(".orca-block-editor");
      if (!o) continue;
      const s = o.getAttribute("data-block-id");
      if (!s) continue;
      const l = await this.getTabInfo(s, e, r++);
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
    const a = i.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let n = 0;
    this.log(`🔍 扫描面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const s of a) {
      const l = s.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, t, n++);
      d && (r.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    e >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[e] = [...r], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${r.length} 个标签页`);
    const o = e === 0 ? C.FIRST_PANEL_TABS : `panel_${e + 1}_tabs`;
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
    if (this.currentWorkspace) {
      this.log("🚫 在工作区状态下，跳过保存普通面板标签数据");
      return;
    }
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
    const a = i.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let n = 0;
    this.log(`🔍 扫描当前聚焦面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const l of a) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const h = await this.getTabInfo(d, t, n++);
      h && (r.push(h), this.log(`📋 找到当前标签页: ${h.title} (${d})`));
    }
    const o = this.panelTabsData[e] || [];
    this.log(`📋 已加载的标签页: ${o.length} 个，当前标签页: ${r.length} 个`);
    const s = [...o];
    for (const l of r)
      s.push(l), this.log(`➕ 添加当前标签页: ${l.title}`);
    this.panelTabsData[e] = [...s], this.log(`📋 合并后标签页总数: ${s.length} 个`);
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
    const t = e.getAttribute("data-panel-id"), i = e.getAttribute("data-panel-title"), a = e.getAttribute("data-panel-icon"), r = e.getAttribute("data-panel-type");
    return !t || !i || r !== "view" ? null : {
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
      const o = {
        blockId: `view:${t.panelId}`,
        // 使用 view:${panelId} 格式
        tabId: K(`view:${t.panelId}`),
        panelId: t.panelId,
        title: t.title,
        icon: t.icon,
        order: 0,
        blockType: "view",
        // 设置 blockType 为 'view'
        isViewPanel: !0
        // 标识为视图面板
      };
      this.panelTabsData[this.currentPanelIndex] = [o], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 是视图面板: ${t.title}`);
      const s = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
      await this.savePanelTabsByKey(s, [o]);
      return;
    }
    const i = e.querySelectorAll(".orca-hideable"), a = [];
    let r = 0;
    for (const o of i) {
      const s = o.querySelector(".orca-block-editor");
      if (!s) continue;
      const l = s.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, this.currentPanelId || "", r++);
      d && a.push(d);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...a], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页`);
    const n = this.currentPanelIndex === 0 ? C.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(n, a);
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, i = this.recentlyClosedTabs.map((a, r) => ({
      label: `${a.title}`,
      icon: a.icon || G(a.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(a, r)
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
    var g, m;
    const i = document.querySelector(".recently-closed-tabs-menu");
    i && i.remove();
    const a = document.documentElement.classList.contains("dark") || ((m = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : m.themeMode) === "dark", r = document.createElement("div");
    r.className = "recently-closed-tabs-menu";
    const n = 280, o = 350, { x: s, y: l } = X(t.x, t.y, n, o);
    r.style.cssText = `
      position: fixed;
      left: ${s}px;
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
    `, e.forEach((p, f) => {
      if (p.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, r.appendChild(x);
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
      `, p.icon) {
        const x = document.createElement("div");
        if (x.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${a ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, p.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = p.icon, x.appendChild(T);
        } else
          x.textContent = p.icon;
        y.appendChild(x);
      }
      const w = document.createElement("span");
      w.textContent = p.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, y.appendChild(w), y.addEventListener("mouseenter", () => {
        y.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), y.addEventListener("mouseleave", () => {
        y.style.backgroundColor = "transparent";
      }), y.addEventListener("click", () => {
        p.onClick(), r.remove();
      }), r.appendChild(y);
    }), document.body.appendChild(r);
    const d = r.getBoundingClientRect(), h = window.innerWidth, u = window.innerHeight;
    d.right > h && (r.style.left = `${h - d.width - 10}px`), d.bottom > u && (r.style.top = `${u - d.height - 10}px`);
    const b = (p) => {
      !p || !p.target || r.contains(p.target) || (r.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b));
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
    var i, a;
    try {
      if (this.recentlyClosedTabs.splice(t, 1), await this.saveRecentlyClosedTabs(), this.enableMergedTabBar) {
        const n = orca.nav.findViewPanel(e.panelId, orca.state.panels) ? e.panelId : ((i = orca.state) == null ? void 0 : i.activePanel) || e.panelId;
        if (e.isViewPanel || (a = e.blockType) != null && a.startsWith("view:"))
          orca.nav.switchFocusTo(n);
        else if (e.blockType === "journal") {
          let o = null;
          const s = /^journal:(.+)$/.exec(e.blockId);
          if (s) {
            const l = new Date(s[1]);
            isNaN(l.getTime()) || (o = l);
          }
          if (o || (o = this.extractDateFromTitle(e.title)), !o) {
            orca.notify("error", "无法解析日志日期，恢复失败");
            return;
          }
          orca.nav.goTo("journal", { date: o }, n), orca.nav.switchFocusTo(n);
        } else {
          const o = parseInt(e.blockId, 10);
          if (Number.isNaN(o)) {
            orca.notify("error", "无效的块ID，恢复失败");
            return;
          }
          orca.nav.goTo("block", { blockId: o }, n), orca.nav.switchFocusTo(n);
        }
        this.log(`🔄 已恢复最近关闭的标签页: "${e.title}"`), orca.notify("success", `已恢复标签页: ${e.title}`);
        return;
      }
      if (this.closedTabs.delete(e.blockId), await this.saveClosedTabs(), z(e)) {
        this.verboseLog(`🖼️ 恢复视图面板标签页: ${e.title} (blockId: ${e.blockId})`);
        const r = this.getCurrentPanelTabs(), n = r.find((o) => o.blockId === e.blockId);
        n ? (this.log(`🔄 视图面板标签页已存在，切换到该标签: "${e.title}"`), await this.switchToTab(n)) : (r.push({
          ...e,
          order: r.length,
          closedAt: void 0
          // 清除关闭时间戳
        }), this.syncCurrentTabsToStorage(r), await this.immediateUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.switchToTab(e)), this.log(`🔄 已恢复视图面板标签页: "${e.title}"`), orca.notify("success", `已恢复标签页: ${e.title}`);
        return;
      }
      await this.addTabToPanel(e.blockId, "end", !0), this.log(`🔄 已恢复最近关闭的标签页: "${e.title}"`), orca.notify("success", `已恢复标签页: ${e.title}`);
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
    })), this.savedTabSets.forEach((a, r) => {
      i.push({
        label: `${a.name} (${a.tabs.length}个标签)`,
        icon: a.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(a, r)
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
    }), this.savedTabSets.forEach((a, r) => {
      i.push({
        label: `${a.name} (${a.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(a, r)
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
    var g, m;
    const i = document.querySelector(".multi-tab-saving-menu");
    i && i.remove();
    const a = document.documentElement.classList.contains("dark") || ((m = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : m.themeMode) === "dark", r = document.createElement("div");
    r.className = "multi-tab-saving-menu";
    const n = 300, o = 400, { x: s, y: l } = X(t.x, t.y, n, o);
    r.style.cssText = `
      position: fixed;
      left: ${s}px;
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
    `, e.forEach((p, f) => {
      if (p.label === "---") {
        const x = document.createElement("div");
        x.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, r.appendChild(x);
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
      `, p.icon) {
        const x = document.createElement("div");
        if (x.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${a ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, p.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = p.icon, x.appendChild(T);
        } else
          x.textContent = p.icon;
        y.appendChild(x);
      }
      const w = document.createElement("span");
      w.textContent = p.label, w.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, y.appendChild(w), y.addEventListener("mouseenter", () => {
        y.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), y.addEventListener("mouseleave", () => {
        y.style.backgroundColor = "transparent";
      }), y.addEventListener("click", () => {
        p.onClick(), r.remove();
      }), r.appendChild(y);
    }), document.body.appendChild(r);
    const d = r.getBoundingClientRect(), h = window.innerWidth, u = window.innerHeight;
    d.right > h && (r.style.left = `${h - d.width - 10}px`), d.bottom > u && (r.style.top = `${u - d.height - 10}px`);
    const b = (p) => {
      !p || !p.target || r.contains(p.target) || (r.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b));
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
    let s = !1;
    const l = () => {
      s = !1, n.className = "orca-button orca-button-secondary", n.style.cssText = "flex: 1;", o.className = "orca-button", o.style.cssText = "flex: 1;", h.style.display = "block", g.style.display = "none", T();
    }, d = () => {
      s = !0, o.className = "orca-button orca-button-secondary", o.style.cssText = "flex: 1;", n.className = "orca-button", n.style.cssText = "flex: 1;", h.style.display = "none", g.style.display = "block", T();
    };
    n.onclick = l, o.onclick = d, r.appendChild(n), r.appendChild(o), a.appendChild(r);
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
    }), h.appendChild(b);
    const g = document.createElement("div");
    g.style.cssText = `
      display: none;
    `;
    const m = document.createElement("label");
    m.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, m.textContent = "请选择要更新的标签页集合:", g.appendChild(m);
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
    const f = document.createElement("option");
    f.value = "", f.textContent = "请选择标签页集合...", p.appendChild(f), this.savedTabSets.forEach((k, I) => {
      const S = document.createElement("option");
      S.value = I.toString(), S.textContent = `${k.name} (${k.tabs.length}个标签)`, p.appendChild(S);
    }), g.appendChild(p), a.appendChild(h), a.appendChild(g), t.appendChild(a);
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
        const k = parseInt(p.value);
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
    }, y.appendChild(w), y.appendChild(x), t.appendChild(y), document.body.appendChild(t), setTimeout(() => {
      b.focus(), b.select();
    }, 100), b.addEventListener("keydown", (k) => {
      k.key === "Enter" ? (k.preventDefault(), x.click()) : k.key === "Escape" && (k.preventDefault(), w.click());
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
    const s = document.createElement("option");
    s.value = "", s.textContent = "请选择标签组...", o.appendChild(s), this.savedTabSets.forEach((b, g) => {
      const m = document.createElement("option");
      m.value = g.toString(), m.textContent = `${b.name} (${b.tabs.length}个标签)`, o.appendChild(m);
    }), r.appendChild(o), i.appendChild(r);
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
    const h = document.createElement("button");
    h.className = "orca-button orca-button-primary", h.textContent = "添加", h.style.cssText = "", h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#2563eb";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "var(--orca-color-primary-5)";
    }), h.onclick = async () => {
      const b = parseInt(o.value);
      if (isNaN(b) || b < 0 || b >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      i.remove(), await this.addTabToGroup(e, b);
    }, l.appendChild(d), l.appendChild(h), i.appendChild(l), document.body.appendChild(i), setTimeout(() => {
      o.focus();
    }, 100), o.addEventListener("keydown", (b) => {
      b.key === "Enter" ? (b.preventDefault(), h.click()) : b.key === "Escape" && (b.preventDefault(), d.click());
    });
    const u = (b) => {
      !b || !b.target || i.contains(b.target) || (i.remove(), document.removeEventListener("click", u));
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
      const i = this.savedTabSets[t];
      if (!i) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (i.tabs.find((r) => r.blockId === e.blockId)) {
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
        const r = { ...a, panelId: this.currentPanelId || "" };
        i.push(r);
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
    var n, o;
    if (ee(e)) {
      this.verboseLog("⚠️ renderSortableTabs 容器被 content-visibility 隐藏，跳过渲染以避免渲染警告");
      return;
    }
    const a = document.documentElement.classList.contains("dark") || ((o = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : o.themeMode) === "dark";
    N(e, () => {
      e.innerHTML = "";
    });
    let r = -1;
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
      `, h.textContent = "⋮⋮", d.appendChild(h), s.icon) {
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
        `, s.icon.startsWith("ti ti-")) {
          const y = document.createElement("i");
          y.className = s.icon, f.appendChild(y);
        } else
          f.textContent = s.icon;
        d.appendChild(f);
      }
      const u = document.createElement("div");
      u.style.cssText = `
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
      `, b.textContent = s.title, u.appendChild(b);
      const g = document.createElement("div");
      g.style.cssText = `
        font-size: 12px;
        color: #666;
        line-height: 1.2;
      `, g.textContent = `ID: ${s.blockId}`, u.appendChild(g), d.appendChild(u);
      const m = document.createElement("div");
      m.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;
      const p = document.createElement("div");
      p.style.cssText = `
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
      `, p.textContent = (l + 1).toString(), m.appendChild(p), d.appendChild(m), d.addEventListener("dragstart", (f) => {
        this.verboseLog("拖拽开始，索引:", l), r = l, f.dataTransfer.setData("text/plain", l.toString()), f.dataTransfer.setData("application/json", JSON.stringify(s)), f.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (f) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", r = -1;
      }), d.addEventListener("dragover", (f) => {
        f.preventDefault(), f.dataTransfer.dropEffect = "move", r !== -1 && r !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (f) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (f) => {
        f.preventDefault(), f.stopPropagation();
        const y = parseInt(f.dataTransfer.getData("text/plain")), w = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", y !== w && y >= 0) {
          const x = t[y];
          t.splice(y, 1), t.splice(w, 0, x), this.renderSortableTabs(e, t);
          const T = this.savedTabSets.find((E) => E.tabs === t);
          T && (T.tabs = [...t], T.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
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
    const i = await this.tabStorageService.loadTabsBeforeWorkspace();
    i && i.length > 0 && (this.tabsBeforeWorkspace = i, this.log(`📁 发现保存的标签页组数据: ${this.tabsBeforeWorkspace.length}个标签页，将在初始化后恢复`), this.shouldRestoreTabsBeforeWorkspace = !0), this.layoutBeforeWorkspace = await this.tabStorageService.loadLayoutBeforeWorkspace();
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
      this.panelTabsData[0] = t, this.mergedRenderSignature = "", await this.updateTabsUI(!0), this.log(`📋 已恢复标签页组，共 ${t.length} 个标签（未保存到持久化存储）`);
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
      if (this.currentWorkspace && await this.saveCurrentTabsToWorkspace(), await this.clearCurrentWorkspace(), this.removedWorkspaceBlockIds.clear(), await this.saveWorkspaces(), this.layoutBeforeWorkspace)
        await this.restorePanelLayout(this.layoutBeforeWorkspace), this.layoutBeforeWorkspace = null, await this.tabStorageService.clearLayoutBeforeWorkspace();
      else if (this.enableMergedTabBar) {
        const t = this.mergedActiveEntryBeforeWorkspace;
        this.mergedActiveEntryBeforeWorkspace = null, t && await this.navigateBackToMergedEntry(t);
      }
      this.enableMergedTabBar && (this.mergedActiveEntryBeforeWorkspace = null, this.restoreMergedHistorySnapshot()), this.tabsBeforeWorkspace && this.tabsBeforeWorkspace.length > 0 ? (this.log(`🔄 恢复到进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`), await this.restoreTabsWithoutSaving(this.tabsBeforeWorkspace), this.tabsBeforeWorkspace = null, await this.tabStorageService.clearTabsBeforeWorkspace(), orca.notify("success", "已退出工作区并恢复之前的标签页组")) : (orca.notify("success", "已退出工作区"), this.mergedRenderSignature = "", await this.updateTabsUI(!0)), this.log("🚪 已退出工作区");
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
        i.remove(), e(!1);
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
        i.remove(), e(!0);
      }), o.addEventListener("mouseenter", () => {
        o.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), o.addEventListener("mouseleave", () => {
        o.style.backgroundColor = "var(--orca-color-bg-1)";
      }), s.addEventListener("mouseenter", () => {
        s.style.opacity = "0.9";
      }), s.addEventListener("mouseleave", () => {
        s.style.opacity = "1";
      }), n.appendChild(o), n.appendChild(s), i.appendChild(a), i.appendChild(r), i.appendChild(n), document.body.appendChild(i);
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
    var g, m;
    const e = document.querySelector(".save-workspace-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((m = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : m.themeMode) === "dark", i = document.createElement("div");
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
      i.remove(), this.showWorkspaceMenu();
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
      const p = o.value.trim();
      if (!p) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((f) => f.name === p)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(p, l.value.trim()), i.remove();
    }, d.appendChild(h), d.appendChild(u), a.appendChild(r), a.appendChild(n), a.appendChild(o), a.appendChild(s), a.appendChild(l), a.appendChild(d), i.appendChild(a), document.body.appendChild(i), o.focus(), i.addEventListener("click", (p) => {
      p.target === i && i.remove();
    });
    const b = (p) => {
      p.key === "Escape" && (i.remove(), document.removeEventListener("keydown", b));
    };
    document.addEventListener("keydown", b);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const i = this.getCurrentPanelTabs(), a = this.getCurrentActiveTab(), r = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: i,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: a ? a.blockId : void 0,
        layout: this.serializePanelLayout() ?? void 0
      };
      this.workspaces.push(r), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${i.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (i) {
      this.error("保存工作区失败:", i), orca.notify("error", "保存工作区失败");
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
    const i = document.documentElement.classList.contains("dark") || ((w = (y = window.orca) == null ? void 0 : y.state) == null ? void 0 : w.themeMode) === "dark", a = document.createElement("div");
    a.className = "workspace-menu";
    const r = 280, n = 400, o = e ? { x: e.clientX, y: e.clientY } : { x: 20, y: 60 }, { x: s, y: l } = X(o.x, o.y, r, n);
    a.style.cssText = `
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
      a.remove(), this.saveCurrentWorkspace();
    };
    const b = document.createElement("div");
    if (b.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const x = document.createElement("div");
      x.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${i ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, x.textContent = "暂无工作区", b.appendChild(x);
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
        const E = x.icon || "ti ti-folder", k = document.createElement("i");
        k.className = E, k.style.cssText = `
          font-size: 14px;
          color: var(--orca-color-primary-5);
        `, T.appendChild(k);
        const I = document.createElement("div");
        I.style.cssText = "flex: 1;";
        const S = document.createElement("div");
        if (S.style.cssText = `
          font-weight: 500;
          color: var(--orca-color-text-1);
        `, S.textContent = x.name, I.appendChild(S), x.description) {
          const O = document.createElement("div");
          O.style.cssText = `
            font-size: 12px;
            color: ${i ? "#999" : "#666"};
            margin-top: 2px;
          `, O.textContent = x.description, I.appendChild(O);
        }
        const H = document.createElement("div");
        if (H.style.cssText = `
          font-size: 11px;
          color: ${i ? "#777" : "#999"};
          margin-top: 2px;
        `, H.textContent = `${x.tabs.length}个标签`, I.appendChild(H), T.appendChild(I), this.currentWorkspace === x.id) {
          const O = document.createElement("i");
          O.className = "ti ti-check", O.style.cssText = `
            font-size: 14px;
            color: var(--orca-color-primary-5);
          `, T.appendChild(O);
        }
        T.addEventListener("mouseenter", () => {
          T.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), T.addEventListener("mouseleave", () => {
          T.style.backgroundColor = this.currentWorkspace === x.id ? "rgba(59, 130, 246, 0.1)" : "transparent";
        }), T.onclick = () => {
          a.remove(), this.switchToWorkspace(x.id);
        }, b.appendChild(T);
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
    const m = document.createElement("span");
    m.textContent = "管理工作区", m.style.cssText = `
      margin-right: var(--orca-spacing-md);
    `, g.appendChild(m), g.addEventListener("mouseenter", () => {
      g.style.backgroundColor = "var(--orca-color-menu-highlight)";
    }), g.addEventListener("mouseleave", () => {
      g.style.backgroundColor = "transparent";
    }), g.onclick = () => {
      a.remove(), this.manageWorkspaces();
    };
    let p = null;
    if (this.currentWorkspace) {
      p = document.createElement("div"), p.className = "workspace-menu-item", p.setAttribute("data-action", "exit-workspace"), p.style.cssText = `
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
      `, p.appendChild(x), p.addEventListener("mouseenter", () => {
        p.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), p.addEventListener("mouseleave", () => {
        p.style.backgroundColor = "transparent";
      }), p.onclick = () => {
        a.remove(), this.exitWorkspace();
      };
    }
    a.appendChild(d), a.appendChild(h), a.appendChild(b), a.appendChild(g), p && a.appendChild(p), document.body.appendChild(a);
    const f = (x) => {
      !x || !x.target || a.contains(x.target) || (a.remove(), document.removeEventListener("click", f));
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
        this.tabsBeforeWorkspace = [...a], await this.tabStorageService.saveTabsBeforeWorkspace(this.tabsBeforeWorkspace), this.log(`💾 保存了进入工作区前的标签页组: ${this.tabsBeforeWorkspace.length}个标签页`), this.layoutBeforeWorkspace = this.serializePanelLayout(), await this.tabStorageService.saveLayoutBeforeWorkspace(this.layoutBeforeWorkspace), this.enableMergedTabBar && this.snapshotMergedHistoryBeforeWorkspace();
      }
      this.currentWorkspace && await this.saveCurrentTabsToWorkspace(), this.currentWorkspace = e, this.removedWorkspaceBlockIds.clear(), await this.saveWorkspaces(), await this.tabStorageService.saveWorkspaces(this.workspaces, e, this.enableWorkspaces);
      const i = await this.restorePanelLayout(t.layout, t.lastActiveTabId);
      await this.replaceCurrentTabsWithWorkspace(t.tabs, t, i), this.log(`🔄 已切换到工作区: "${t.name}"`), orca.notify("success", `已切换到工作区: ${t.name}`);
    } catch (t) {
      this.error("切换工作区失败:", t), orca.notify("error", "切换工作区失败");
    }
  }
  /**
   * 用工作区的标签页完全替换当前标签页
   */
  async replaceCurrentTabsWithWorkspace(e, t, i = !1) {
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
      if (this.panelTabsData[0] = a, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...a], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), this.mergedRenderSignature = "", await this.updateTabsUI(!0), i) {
        this.log(`📋 已替换标签页数据（布局已恢复，跳过延迟导航），共 ${a.length} 个标签`);
        return;
      }
      const r = t.lastActiveTabId;
      setTimeout(async () => {
        if (a.length > 0) {
          let n = a[0];
          if (r) {
            const o = a.find((s) => s.blockId === r);
            o ? (n = o, this.log(`🎯 导航到工作区中最后激活的标签页: ${n.title} (ID: ${r})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${n.title}`);
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
      e.tabs = t, e.lastActiveTabId = i ? i.blockId : void 0;
      const a = this.serializePanelLayout();
      a && (e.layout = a), e.updatedAt = Date.now(), await this.saveWorkspaces();
    }
  }
  /**
   * 管理工作区
   */
  manageWorkspaces() {
    var d, h;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", i = document.createElement("div");
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
        const b = document.createElement("div");
        b.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          margin-bottom: 8px;
          background: ${this.currentWorkspace === u.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)"};
        `;
        const g = u.icon || "ti ti-folder", m = document.createElement("i");
        m.className = g, m.style.cssText = `
          font-size: 20px;
          color: var(--orca-color-primary-5);
          margin-right: 12px;
        `, b.appendChild(m);
        const p = document.createElement("div");
        p.style.cssText = "flex: 1;";
        const f = document.createElement("div");
        if (f.style.cssText = `
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
          color: ${t ? "#ffffff" : "#333"};
        `, f.textContent = u.name, p.appendChild(f), u.description) {
          const T = document.createElement("div");
          T.style.cssText = `
            font-size: 12px;
            color: ${t ? "#999" : "#666"};
            margin-bottom: 4px;
          `, T.textContent = u.description, p.appendChild(T);
        }
        const y = document.createElement("div");
        y.style.cssText = `
          font-size: 11px;
          color: ${t ? "#777" : "#999"};
        `, y.textContent = `${u.tabs.length}个标签 • 创建于 ${new Date(u.createdAt).toLocaleString()}`, p.appendChild(y), b.appendChild(p);
        const w = document.createElement("div");
        if (w.style.cssText = `
          display: flex;
          gap: 8px;
        `, this.currentWorkspace === u.id) {
          const T = document.createElement("span");
          T.style.cssText = `
            color: var(--orca-color-primary-5);
            font-size: 12px;
          `, T.textContent = "当前", w.appendChild(T);
        }
        const x = document.createElement("button");
        x.className = "delete-workspace-btn", x.dataset.workspaceId = u.id, x.style.cssText = `
          padding: 4px 8px;
          border: 1px solid var(--orca-color-border);
          border-radius: var(--orca-radius-md);
          background: var(--orca-color-bg-1);
          color: #ef4444;
          cursor: pointer;
          font-size: 12px;
        `, x.textContent = "删除", w.appendChild(x), b.appendChild(w), b.addEventListener("mouseenter", () => {
          b.style.backgroundColor = "var(--orca-color-menu-highlight)";
        }), b.addEventListener("mouseleave", () => {
          b.style.backgroundColor = this.currentWorkspace === u.id ? "rgba(59, 130, 246, 0.05)" : "var(--orca-color-bg-1)";
        }), n.appendChild(b);
      });
    const o = document.createElement("div");
    o.style.cssText = `
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
      i.remove();
    }, o.appendChild(s), a.appendChild(r), a.appendChild(n), a.appendChild(o), i.appendChild(a), document.body.appendChild(i), i.querySelectorAll(".delete-workspace-btn").forEach((u) => {
      u.addEventListener("click", async (b) => {
        const g = b.target.getAttribute("data-workspace-id");
        g && (await this.deleteWorkspace(g), i.remove(), this.manageWorkspaces());
      });
    }), i.addEventListener("click", (u) => {
      u.target === i && i.remove();
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
    var u, b;
    document.documentElement.classList.contains("dark") || ((b = (u = window.orca) == null ? void 0 : u.state) == null || b.themeMode);
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
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, r.textContent = `标签集合详情: ${e.name}`, a.appendChild(r);
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;
    const o = document.createElement("div");
    o.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background-color: var(--orca-color-bg-1);
      border-radius: var(--orca-radius-md);
    `;
    const s = (g, m, p = !0) => {
      const f = document.createElement("div");
      f.style.cssText = `
        font-size: 14px;
        color: #666;
        ${p ? "margin-bottom: 8px;" : ""}
      `;
      const y = document.createElement("strong");
      y.textContent = `${g}:`, f.appendChild(y), f.appendChild(document.createTextNode(` ${m}`)), o.appendChild(f);
    };
    if (s("创建时间", new Date(e.createdAt).toLocaleString()), s("更新时间", new Date(e.updatedAt).toLocaleString()), s("标签数量", `${e.tabs.length}个`, !1), n.appendChild(o), e.tabs.length === 0) {
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
      const p = document.createElement("span");
      p.textContent = "包含的标签 (可拖拽排序):", m.appendChild(p);
      const f = document.createElement("span");
      f.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, f.textContent = "拖拽调整顺序", m.appendChild(f), g.appendChild(m);
      const y = document.createElement("div");
      y.className = "sortable-tabs-container", y.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(y, [...e.tabs], e), g.appendChild(y), n.appendChild(g);
    }
    a.appendChild(n);
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
    const h = (g) => {
      a.contains(g.target) || (a.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, i) {
    const a = document.querySelector(".rename-tabset-dialog");
    a && a.remove();
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
    const s = document.createElement("label");
    s.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, s.textContent = "请输入新的名称:", o.appendChild(s);
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
      const g = l.value.trim();
      if (!g) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (g === e.name) {
        r.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((p) => p.name === g && p.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = g, e.updatedAt = Date.now(), await this.saveSavedTabSets(), r.remove(), i.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(h), d.appendChild(u), r.appendChild(d), document.body.appendChild(r), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), u.click()) : g.key === "Escape" && (g.preventDefault(), h.click());
    });
    const b = (g) => {
      !g || !g.target || r.contains(g.target) || (r.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b));
    };
    setTimeout(() => {
      document.addEventListener("click", b), document.addEventListener("contextmenu", b);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, i, a) {
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
    const n = i.textContent;
    i.replaceChildren(), i.appendChild(r), r.addEventListener("click", (d) => {
      d.stopPropagation();
    }), r.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), r.focus(), r.select();
    const o = async () => {
      const d = r.value.trim();
      if (!d) {
        i.textContent = n;
        return;
      }
      if (d === e.name) {
        i.textContent = n;
        return;
      }
      if (this.savedTabSets.find((u) => u.name === d && u.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), i.textContent = n;
        return;
      }
      e.name = d, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i.textContent = d, orca.notify("success", "重命名成功");
    }, s = () => {
      i.textContent = n;
    };
    r.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), o()) : d.key === "Escape" && (d.preventDefault(), s());
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
  async editTabSetIcon(e, t, i, a, r) {
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
    `, l.forEach((g) => {
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
        background: ${e.icon === g.value ? "#e3f2fd" : "white"};
      `;
      const p = document.createElement("div");
      if (p.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, g.value.startsWith("ti ti-")) {
        const y = document.createElement("i");
        y.className = g.value, p.appendChild(y);
      } else
        p.textContent = g.icon;
      const f = document.createElement("div");
      f.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, f.textContent = g.name, m.appendChild(p), m.appendChild(f), m.addEventListener("click", async (y) => {
        y.stopPropagation(), e.icon = g.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), a(), n.remove(), r && r.focus(), orca.notify("success", "图标已更新");
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "#f5f5f5", m.style.borderColor = "var(--orca-color-primary-5)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = e.icon === g.value ? "#e3f2fd" : "white", m.style.borderColor = "#e0e0e0";
      }), d.appendChild(m);
    }), s.appendChild(d), n.appendChild(s);
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
      g.stopPropagation(), n.remove(), r && r.focus();
    }, h.appendChild(u), n.appendChild(h), document.body.appendChild(n);
    const b = (g) => {
      n.contains(g.target) || (g.stopPropagation(), n.remove(), document.removeEventListener("click", b), document.removeEventListener("contextmenu", b), r && r.focus());
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
      `, B(u, J("点击编辑图标"));
      const b = () => {
        if (u.replaceChildren(), s.icon)
          if (s.icon.startsWith("ti ti-")) {
            const T = document.createElement("i");
            T.className = s.icon, u.appendChild(T);
          } else
            u.textContent = s.icon;
        else
          u.textContent = "📁";
      };
      b(), u.addEventListener("click", () => {
        this.editTabSetIcon(s, l, u, b, t);
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
      `, m.textContent = s.name, B(m, J("点击编辑名称")), m.addEventListener("click", () => {
        this.editTabSetName(s, l, m, t);
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = "transparent";
      });
      const p = document.createElement("div");
      p.style.cssText = `
        font-size: 12px;
        color: #666;
      `, p.textContent = `${s.tabs.length}个标签 • ${new Date(s.updatedAt).toLocaleString()}`, g.appendChild(m), g.appendChild(p), h.appendChild(u), h.appendChild(g);
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
      }, f.appendChild(y), f.appendChild(w), f.appendChild(x), d.appendChild(h), d.appendChild(f), a.appendChild(d);
    }), t.appendChild(a);
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
    const o = (s) => {
      !s || !s.target || t.contains(s.target) || (t.remove(), document.removeEventListener("click", o), document.removeEventListener("contextmenu", o));
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
    const r = this.performanceOptimizer.trackEventListener(e, t, i, a);
    return r && this.verboseLog(`👂 跟踪事件监听器: ${t} -> ${r}`), r;
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
let $ = null;
async function ea(c) {
  _ = c, orca.state.locale, Ei(!0), $ = new Zi(_), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => $ == null ? void 0 : $.init(), 500);
  }) : setTimeout(() => $ == null ? void 0 : $.init(), 500);
  try {
    orca.commands.unregisterCommand(`${_}.resetCache`);
  } catch {
  }
  orca.commands.registerCommand(
    `${_}.resetCache`,
    async () => {
      $ && await $.resetCache();
    },
    "重置插件缓存"
  );
  try {
    orca.commands.unregisterCommand(`${_}.toggleBlockIcons`);
  } catch {
  }
  orca.commands.registerCommand(
    `${_}.toggleBlockIcons`,
    async () => {
      $ && await $.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function ta() {
  $ && ($.unregisterBlockMenuCommands(), $.unregisterHeadbarButton(), $.cleanupDragResize(), $.destroy(), $ = null);
  try {
    ne();
  } catch (c) {
    console.warn("清理 tooltip 时出错:", c);
  }
  try {
    orca.commands.unregisterCommand(`${_}.resetCache`);
  } catch {
  }
  try {
    orca.commands.unregisterCommand(`${_}.toggleBlockIcons`);
  } catch {
  }
}
export {
  ea as load,
  ta as unload
};
