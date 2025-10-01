var me = Object.defineProperty;
var fe = (o, e, t) => e in o ? me(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var f = (o, e, t) => fe(o, typeof e != "symbol" ? e + "" : e, t);
const ce = {
  /** 缓存编辑器数量 - 对应Orca设置中的最大标签页数量配置 */
  CachedEditorNum: 13,
  /** 日志日期格式 - 对应Orca设置中的日期格式配置 */
  JournalDateFormat: 12
}, le = {
  /** JSON数据类型 - 用于存储结构化数据 */
  JSON: 0,
  /** 文本数据类型 - 用于存储纯文本数据 */
  Text: 1
}, v = {
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
class xe {
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
  async saveConfig(e, t, n = "orca-tabs-plugin") {
    try {
      const a = typeof t == "string" ? t : JSON.stringify(t);
      return await orca.plugins.setData(n, e, a), this.log(`💾 已保存插件数据 ${e}:`, t), !0;
    } catch (a) {
      return this.warn(`无法保存插件数据 ${e}，尝试降级到localStorage:`, a), this.saveToLocalStorage(e, t);
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
  async getConfig(e, t = "orca-tabs-plugin", n) {
    try {
      const a = await orca.plugins.getData(t, e);
      if (a == null)
        return n || null;
      let r;
      if (typeof a == "string")
        try {
          r = JSON.parse(a);
        } catch {
          r = a;
        }
      else
        r = a;
      return this.log(`📂 已读取插件数据 ${e}:`, r), r;
    } catch (a) {
      return this.warn(`无法读取插件数据 ${e}，尝试从localStorage读取:`, a), this.getFromLocalStorage(e, n);
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
    } catch (n) {
      return this.warn(`无法删除插件数据 ${e}，尝试从localStorage删除:`, n), this.removeFromLocalStorage(e);
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
      const n = this.getLocalStorageKey(e);
      return localStorage.setItem(n, JSON.stringify(t)), this.log(`💾 已降级保存到localStorage: ${n}`), !0;
    } catch (n) {
      return this.error("无法保存到localStorage:", n), !1;
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
      const n = this.getLocalStorageKey(e), a = localStorage.getItem(n);
      if (a) {
        const r = JSON.parse(a);
        return this.log(`📂 已从localStorage读取: ${n}`), r;
      }
      return t || null;
    } catch (n) {
      return this.error("无法从localStorage读取:", n), t || null;
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
      [v.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [v.SECOND_PANEL_TABS]: "orca-second-panel-tabs-api",
      [v.CLOSED_TABS]: "orca-closed-tabs-api",
      [v.RECENTLY_CLOSED_TABS]: "orca-recently-closed-tabs-api",
      [v.SAVED_TAB_SETS]: "orca-saved-tab-sets-api",
      [v.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [v.TABS_POSITION]: "orca-tabs-position-api",
      [v.LAYOUT_MODE]: "orca-tabs-layout-api",
      [v.FIXED_TO_TOP]: "orca-tabs-fixed-to-top-api"
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
      const n = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", n);
      const a = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(n) === JSON.stringify(a) ? "✅" : "❌"}`);
      const r = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", r);
      const i = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(r) === JSON.stringify(i) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
const de = 6048e5, ye = 864e5, Q = Symbol.for("constructDateFrom");
function S(o, e) {
  return typeof o == "function" ? o(e) : o && typeof o == "object" && Q in o ? o[Q](e) : o instanceof Date ? new o.constructor(e) : new Date(e);
}
function E(o, e) {
  return S(e || o, o);
}
function ue(o, e, t) {
  const n = E(o, t == null ? void 0 : t.in);
  return isNaN(e) ? S(o, NaN) : (e && n.setDate(n.getDate() + e), n);
}
let ve = {};
function Y() {
  return ve;
}
function z(o, e) {
  var c, s, l, d;
  const t = Y(), n = (e == null ? void 0 : e.weekStartsOn) ?? ((s = (c = e == null ? void 0 : e.locale) == null ? void 0 : c.options) == null ? void 0 : s.weekStartsOn) ?? t.weekStartsOn ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, a = E(o, e == null ? void 0 : e.in), r = a.getDay(), i = (r < n ? 7 : 0) + r - n;
  return a.setDate(a.getDate() - i), a.setHours(0, 0, 0, 0), a;
}
function U(o, e) {
  return z(o, { ...e, weekStartsOn: 1 });
}
function he(o, e) {
  const t = E(o, e == null ? void 0 : e.in), n = t.getFullYear(), a = S(t, 0);
  a.setFullYear(n + 1, 0, 4), a.setHours(0, 0, 0, 0);
  const r = U(a), i = S(t, 0);
  i.setFullYear(n, 0, 4), i.setHours(0, 0, 0, 0);
  const c = U(i);
  return t.getTime() >= r.getTime() ? n + 1 : t.getTime() >= c.getTime() ? n : n - 1;
}
function Z(o) {
  const e = E(o), t = new Date(
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
function ge(o, ...e) {
  const t = S.bind(
    null,
    e.find((n) => typeof n == "object")
  );
  return e.map(t);
}
function V(o, e) {
  const t = E(o, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function Te(o, e, t) {
  const [n, a] = ge(
    t == null ? void 0 : t.in,
    o,
    e
  ), r = V(n), i = V(a), c = +r - Z(r), s = +i - Z(i);
  return Math.round((c - s) / ye);
}
function we(o, e) {
  const t = he(o, e), n = S(o, 0);
  return n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), U(n);
}
function J(o) {
  return S(o, Date.now());
}
function K(o, e, t) {
  const [n, a] = ge(
    t == null ? void 0 : t.in,
    o,
    e
  );
  return +V(n) == +V(a);
}
function ke(o) {
  return o instanceof Date || typeof o == "object" && Object.prototype.toString.call(o) === "[object Date]";
}
function Ce(o) {
  return !(!ke(o) && typeof o != "number" || isNaN(+E(o)));
}
function Ie(o, e) {
  const t = E(o, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const Pe = {
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
}, Se = (o, e, t) => {
  let n;
  const a = Pe[o];
  return typeof a == "string" ? n = a : e === 1 ? n = a.one : n = a.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + n : n + " ago" : n;
};
function G(o) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : o.defaultWidth;
    return o.formats[t] || o.formats[o.defaultWidth];
  };
}
const Ee = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, $e = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Le = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, De = {
  date: G({
    formats: Ee,
    defaultWidth: "full"
  }),
  time: G({
    formats: $e,
    defaultWidth: "full"
  }),
  dateTime: G({
    formats: Le,
    defaultWidth: "full"
  })
}, Me = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ae = (o, e, t, n) => Me[o];
function O(o) {
  return (e, t) => {
    const n = t != null && t.context ? String(t.context) : "standalone";
    let a;
    if (n === "formatting" && o.formattingValues) {
      const i = o.defaultFormattingWidth || o.defaultWidth, c = t != null && t.width ? String(t.width) : i;
      a = o.formattingValues[c] || o.formattingValues[i];
    } else {
      const i = o.defaultWidth, c = t != null && t.width ? String(t.width) : o.defaultWidth;
      a = o.values[c] || o.values[i];
    }
    const r = o.argumentCallback ? o.argumentCallback(e) : e;
    return a[r];
  };
}
const We = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Be = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Oe = {
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
}, Ne = {
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
}, ze = {
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
}, Fe = {
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
}, Re = (o, e) => {
  const t = Number(o), n = t % 100;
  if (n > 20 || n < 10)
    switch (n % 10) {
      case 1:
        return t + "st";
      case 2:
        return t + "nd";
      case 3:
        return t + "rd";
    }
  return t + "th";
}, _e = {
  ordinalNumber: Re,
  era: O({
    values: We,
    defaultWidth: "wide"
  }),
  quarter: O({
    values: Be,
    defaultWidth: "wide",
    argumentCallback: (o) => o - 1
  }),
  month: O({
    values: Oe,
    defaultWidth: "wide"
  }),
  day: O({
    values: Ne,
    defaultWidth: "wide"
  }),
  dayPeriod: O({
    values: ze,
    defaultWidth: "wide",
    formattingValues: Fe,
    defaultFormattingWidth: "wide"
  })
};
function N(o) {
  return (e, t = {}) => {
    const n = t.width, a = n && o.matchPatterns[n] || o.matchPatterns[o.defaultMatchWidth], r = e.match(a);
    if (!r)
      return null;
    const i = r[0], c = n && o.parsePatterns[n] || o.parsePatterns[o.defaultParseWidth], s = Array.isArray(c) ? He(c, (h) => h.test(i)) : (
      // [TODO] -- I challenge you to fix the type
      qe(c, (h) => h.test(i))
    );
    let l;
    l = o.valueCallback ? o.valueCallback(s) : s, l = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(l)
    ) : l;
    const d = e.slice(i.length);
    return { value: l, rest: d };
  };
}
function qe(o, e) {
  for (const t in o)
    if (Object.prototype.hasOwnProperty.call(o, t) && e(o[t]))
      return t;
}
function He(o, e) {
  for (let t = 0; t < o.length; t++)
    if (e(o[t]))
      return t;
}
function Ue(o) {
  return (e, t = {}) => {
    const n = e.match(o.matchPattern);
    if (!n) return null;
    const a = n[0], r = e.match(o.parsePattern);
    if (!r) return null;
    let i = o.valueCallback ? o.valueCallback(r[0]) : r[0];
    i = t.valueCallback ? t.valueCallback(i) : i;
    const c = e.slice(a.length);
    return { value: i, rest: c };
  };
}
const Ve = /^(\d+)(th|st|nd|rd)?/i, Ye = /\d+/i, je = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Xe = {
  any: [/^b/i, /^(a|c)/i]
}, Ge = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Je = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Ke = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, Qe = {
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
}, Ze = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, et = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, tt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, nt = {
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
}, at = {
  ordinalNumber: Ue({
    matchPattern: Ve,
    parsePattern: Ye,
    valueCallback: (o) => parseInt(o, 10)
  }),
  era: N({
    matchPatterns: je,
    defaultMatchWidth: "wide",
    parsePatterns: Xe,
    defaultParseWidth: "any"
  }),
  quarter: N({
    matchPatterns: Ge,
    defaultMatchWidth: "wide",
    parsePatterns: Je,
    defaultParseWidth: "any",
    valueCallback: (o) => o + 1
  }),
  month: N({
    matchPatterns: Ke,
    defaultMatchWidth: "wide",
    parsePatterns: Qe,
    defaultParseWidth: "any"
  }),
  day: N({
    matchPatterns: Ze,
    defaultMatchWidth: "wide",
    parsePatterns: et,
    defaultParseWidth: "any"
  }),
  dayPeriod: N({
    matchPatterns: tt,
    defaultMatchWidth: "any",
    parsePatterns: nt,
    defaultParseWidth: "any"
  })
}, rt = {
  code: "en-US",
  formatDistance: Se,
  formatLong: De,
  formatRelative: Ae,
  localize: _e,
  match: at,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function ot(o, e) {
  const t = E(o, e == null ? void 0 : e.in);
  return Te(t, Ie(t)) + 1;
}
function it(o, e) {
  const t = E(o, e == null ? void 0 : e.in), n = +U(t) - +we(t);
  return Math.round(n / de) + 1;
}
function pe(o, e) {
  var d, h, u, p;
  const t = E(o, e == null ? void 0 : e.in), n = t.getFullYear(), a = Y(), r = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((h = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? a.firstWeekContainsDate ?? ((p = (u = a.locale) == null ? void 0 : u.options) == null ? void 0 : p.firstWeekContainsDate) ?? 1, i = S((e == null ? void 0 : e.in) || o, 0);
  i.setFullYear(n + 1, 0, r), i.setHours(0, 0, 0, 0);
  const c = z(i, e), s = S((e == null ? void 0 : e.in) || o, 0);
  s.setFullYear(n, 0, r), s.setHours(0, 0, 0, 0);
  const l = z(s, e);
  return +t >= +c ? n + 1 : +t >= +l ? n : n - 1;
}
function st(o, e) {
  var c, s, l, d;
  const t = Y(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((s = (c = e == null ? void 0 : e.locale) == null ? void 0 : c.options) == null ? void 0 : s.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, a = pe(o, e), r = S((e == null ? void 0 : e.in) || o, 0);
  return r.setFullYear(a, 0, n), r.setHours(0, 0, 0, 0), z(r, e);
}
function ct(o, e) {
  const t = E(o, e == null ? void 0 : e.in), n = +z(t, e) - +st(t, e);
  return Math.round(n / de) + 1;
}
function T(o, e) {
  const t = o < 0 ? "-" : "", n = Math.abs(o).toString().padStart(e, "0");
  return t + n;
}
const L = {
  // Year
  y(o, e) {
    const t = o.getFullYear(), n = t > 0 ? t : 1 - t;
    return T(e === "yy" ? n % 100 : n, e.length);
  },
  // Month
  M(o, e) {
    const t = o.getMonth();
    return e === "M" ? String(t + 1) : T(t + 1, 2);
  },
  // Day of the month
  d(o, e) {
    return T(o.getDate(), e.length);
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
    return T(o.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(o, e) {
    return T(o.getHours(), e.length);
  },
  // Minute
  m(o, e) {
    return T(o.getMinutes(), e.length);
  },
  // Second
  s(o, e) {
    return T(o.getSeconds(), e.length);
  },
  // Fraction of second
  S(o, e) {
    const t = e.length, n = o.getMilliseconds(), a = Math.trunc(
      n * Math.pow(10, t - 3)
    );
    return T(a, e.length);
  }
}, A = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, ee = {
  // Era
  G: function(o, e, t) {
    const n = o.getFullYear() > 0 ? 1 : 0;
    switch (e) {
      case "G":
      case "GG":
      case "GGG":
        return t.era(n, { width: "abbreviated" });
      case "GGGGG":
        return t.era(n, { width: "narrow" });
      case "GGGG":
      default:
        return t.era(n, { width: "wide" });
    }
  },
  // Year
  y: function(o, e, t) {
    if (e === "yo") {
      const n = o.getFullYear(), a = n > 0 ? n : 1 - n;
      return t.ordinalNumber(a, { unit: "year" });
    }
    return L.y(o, e);
  },
  // Local week-numbering year
  Y: function(o, e, t, n) {
    const a = pe(o, n), r = a > 0 ? a : 1 - a;
    if (e === "YY") {
      const i = r % 100;
      return T(i, 2);
    }
    return e === "Yo" ? t.ordinalNumber(r, { unit: "year" }) : T(r, e.length);
  },
  // ISO week-numbering year
  R: function(o, e) {
    const t = he(o);
    return T(t, e.length);
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
    return T(t, e.length);
  },
  // Quarter
  Q: function(o, e, t) {
    const n = Math.ceil((o.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(n);
      case "QQ":
        return T(n, 2);
      case "Qo":
        return t.ordinalNumber(n, { unit: "quarter" });
      case "QQQ":
        return t.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return t.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return t.quarter(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(o, e, t) {
    const n = Math.ceil((o.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(n);
      case "qq":
        return T(n, 2);
      case "qo":
        return t.ordinalNumber(n, { unit: "quarter" });
      case "qqq":
        return t.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return t.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return t.quarter(n, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(o, e, t) {
    const n = o.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return L.M(o, e);
      case "Mo":
        return t.ordinalNumber(n + 1, { unit: "month" });
      case "MMM":
        return t.month(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return t.month(n, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return t.month(n, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(o, e, t) {
    const n = o.getMonth();
    switch (e) {
      case "L":
        return String(n + 1);
      case "LL":
        return T(n + 1, 2);
      case "Lo":
        return t.ordinalNumber(n + 1, { unit: "month" });
      case "LLL":
        return t.month(n, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return t.month(n, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return t.month(n, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(o, e, t, n) {
    const a = ct(o, n);
    return e === "wo" ? t.ordinalNumber(a, { unit: "week" }) : T(a, e.length);
  },
  // ISO week of year
  I: function(o, e, t) {
    const n = it(o);
    return e === "Io" ? t.ordinalNumber(n, { unit: "week" }) : T(n, e.length);
  },
  // Day of the month
  d: function(o, e, t) {
    return e === "do" ? t.ordinalNumber(o.getDate(), { unit: "date" }) : L.d(o, e);
  },
  // Day of year
  D: function(o, e, t) {
    const n = ot(o);
    return e === "Do" ? t.ordinalNumber(n, { unit: "dayOfYear" }) : T(n, e.length);
  },
  // Day of week
  E: function(o, e, t) {
    const n = o.getDay();
    switch (e) {
      case "E":
      case "EE":
      case "EEE":
        return t.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return t.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return t.day(n, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return t.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(o, e, t, n) {
    const a = o.getDay(), r = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(r);
      case "ee":
        return T(r, 2);
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
  c: function(o, e, t, n) {
    const a = o.getDay(), r = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(r);
      case "cc":
        return T(r, e.length);
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
  i: function(o, e, t) {
    const n = o.getDay(), a = n === 0 ? 7 : n;
    switch (e) {
      case "i":
        return String(a);
      case "ii":
        return T(a, e.length);
      case "io":
        return t.ordinalNumber(a, { unit: "day" });
      case "iii":
        return t.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return t.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return t.day(n, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return t.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(o, e, t) {
    const a = o.getHours() / 12 >= 1 ? "pm" : "am";
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
  b: function(o, e, t) {
    const n = o.getHours();
    let a;
    switch (n === 12 ? a = A.noon : n === 0 ? a = A.midnight : a = n / 12 >= 1 ? "pm" : "am", e) {
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
  B: function(o, e, t) {
    const n = o.getHours();
    let a;
    switch (n >= 17 ? a = A.evening : n >= 12 ? a = A.afternoon : n >= 4 ? a = A.morning : a = A.night, e) {
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
  h: function(o, e, t) {
    if (e === "ho") {
      let n = o.getHours() % 12;
      return n === 0 && (n = 12), t.ordinalNumber(n, { unit: "hour" });
    }
    return L.h(o, e);
  },
  // Hour [0-23]
  H: function(o, e, t) {
    return e === "Ho" ? t.ordinalNumber(o.getHours(), { unit: "hour" }) : L.H(o, e);
  },
  // Hour [0-11]
  K: function(o, e, t) {
    const n = o.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(n, { unit: "hour" }) : T(n, e.length);
  },
  // Hour [1-24]
  k: function(o, e, t) {
    let n = o.getHours();
    return n === 0 && (n = 24), e === "ko" ? t.ordinalNumber(n, { unit: "hour" }) : T(n, e.length);
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
    const n = o.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (e) {
      case "X":
        return ne(n);
      case "XXXX":
      case "XX":
        return M(n);
      case "XXXXX":
      case "XXX":
      default:
        return M(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(o, e, t) {
    const n = o.getTimezoneOffset();
    switch (e) {
      case "x":
        return ne(n);
      case "xxxx":
      case "xx":
        return M(n);
      case "xxxxx":
      case "xxx":
      default:
        return M(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(o, e, t) {
    const n = o.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + te(n, ":");
      case "OOOO":
      default:
        return "GMT" + M(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(o, e, t) {
    const n = o.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + te(n, ":");
      case "zzzz":
      default:
        return "GMT" + M(n, ":");
    }
  },
  // Seconds timestamp
  t: function(o, e, t) {
    const n = Math.trunc(+o / 1e3);
    return T(n, e.length);
  },
  // Milliseconds timestamp
  T: function(o, e, t) {
    return T(+o, e.length);
  }
};
function te(o, e = "") {
  const t = o > 0 ? "-" : "+", n = Math.abs(o), a = Math.trunc(n / 60), r = n % 60;
  return r === 0 ? t + String(a) : t + String(a) + e + T(r, 2);
}
function ne(o, e) {
  return o % 60 === 0 ? (o > 0 ? "-" : "+") + T(Math.abs(o) / 60, 2) : M(o, e);
}
function M(o, e = "") {
  const t = o > 0 ? "-" : "+", n = Math.abs(o), a = T(Math.trunc(n / 60), 2), r = T(n % 60, 2);
  return t + a + e + r;
}
const ae = (o, e) => {
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
}, be = (o, e) => {
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
}, lt = (o, e) => {
  const t = o.match(/(P+)(p+)?/) || [], n = t[1], a = t[2];
  if (!a)
    return ae(o, e);
  let r;
  switch (n) {
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
  return r.replace("{{date}}", ae(n, e)).replace("{{time}}", be(a, e));
}, dt = {
  p: be,
  P: lt
}, ut = /^D+$/, ht = /^Y+$/, gt = ["D", "DD", "YY", "YYYY"];
function pt(o) {
  return ut.test(o);
}
function bt(o) {
  return ht.test(o);
}
function mt(o, e, t) {
  const n = ft(o, e, t);
  if (console.warn(n), gt.includes(o)) throw new RangeError(n);
}
function ft(o, e, t) {
  const n = o[0] === "Y" ? "years" : "days of the month";
  return `Use \`${o.toLowerCase()}\` instead of \`${o}\` (in \`${e}\`) for formatting ${n} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const xt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, yt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, vt = /^'([^]*?)'?$/, Tt = /''/g, wt = /[a-zA-Z]/;
function D(o, e, t) {
  var d, h, u, p;
  const n = Y(), a = n.locale ?? rt, r = n.firstWeekContainsDate ?? ((h = (d = n.locale) == null ? void 0 : d.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, i = n.weekStartsOn ?? ((p = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : p.weekStartsOn) ?? 0, c = E(o, t == null ? void 0 : t.in);
  if (!Ce(c))
    throw new RangeError("Invalid time value");
  let s = e.match(yt).map((g) => {
    const m = g[0];
    if (m === "p" || m === "P") {
      const b = dt[m];
      return b(g, a.formatLong);
    }
    return g;
  }).join("").match(xt).map((g) => {
    if (g === "''")
      return { isToken: !1, value: "'" };
    const m = g[0];
    if (m === "'")
      return { isToken: !1, value: kt(g) };
    if (ee[m])
      return { isToken: !0, value: g };
    if (m.match(wt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: g };
  });
  a.localize.preprocessor && (s = a.localize.preprocessor(c, s));
  const l = {
    firstWeekContainsDate: r,
    weekStartsOn: i,
    locale: a
  };
  return s.map((g) => {
    if (!g.isToken) return g.value;
    const m = g.value;
    (bt(m) || pt(m)) && mt(m, e, String(o));
    const b = ee[m[0]];
    return b(c, m, a.localize, l);
  }).join("");
}
function kt(o) {
  const e = o.match(vt);
  return e ? e[1].replace(Tt, "'") : o;
}
function Ct(o, e) {
  return K(
    S(o, o),
    J(o)
  );
}
function It(o, e) {
  return K(
    o,
    ue(J(o), 1),
    e
  );
}
function Pt(o, e, t) {
  return ue(o, -1, t);
}
function St(o, e) {
  return K(
    S(o, o),
    Pt(J(o))
  );
}
function Et(o) {
  try {
    let e = orca.state.settings[ce.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Ct(o))
      return "今天";
    if (St(o))
      return "昨天";
    if (It(o))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const n = o.getDay(), r = ["日", "一", "二", "三", "四", "五", "六"][n], i = e.replace(/E/g, r);
          return D(o, i);
        } else
          return D(o, e);
      else
        return D(o, e);
    } catch {
      const n = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const a of n)
        try {
          return D(o, a);
        } catch {
          continue;
        }
      return o.toLocaleDateString();
    }
  } catch {
    return o.toLocaleDateString();
  }
}
function R(o) {
  try {
    const e = $t(o, "_repr");
    if (!e || e.type !== le.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch {
    return null;
  }
}
function $t(o, e) {
  return !o.properties || !Array.isArray(o.properties) ? null : o.properties.find((t) => t.name === e);
}
function Lt(o) {
  if (!Array.isArray(o) || o.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const n of o)
    n && typeof n == "object" && (n.t === "text" && n.v ? e++ : n.t === "ref" && n.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function Dt(o) {
  if (!o || o.length === 0) return "";
  let e = "";
  for (const t of o)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function Mt(o, e, t, n) {
  const a = document.createElement("div");
  a.className = "orca-tabs-ref-menu-item", a.setAttribute("role", "menuitem"), a.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;
    font-size: 14px;
    line-height: 1.4;
  `;
  const r = document.createElement("i");
  r.className = e, r.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const i = document.createElement("span");
  if (i.textContent = o, i.style.cssText = `
    flex: 1;
    color: #333;
  `, a.appendChild(r), a.appendChild(i), t && t.trim() !== "") {
    const c = document.createElement("span");
    c.textContent = t, c.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, a.appendChild(c);
  }
  return a.addEventListener("mouseenter", () => {
    a.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), a.addEventListener("mouseleave", () => {
    a.style.backgroundColor = "transparent";
  }), a.addEventListener("click", (c) => {
    c.preventDefault(), c.stopPropagation(), n();
    const s = a.closest('.orca-context-menu, .context-menu, [role="menu"]');
    s && (s.style.display = "none", s.remove());
  }), a;
}
function At(o, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);
  if (t) {
    const n = parseInt(t[1], 16), a = parseInt(t[2], 16), r = parseInt(t[3], 16);
    return `rgba(${n}, ${a}, ${r}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
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
    showInHeadbar: !0
  };
}
function Wt(o, e, t = 200) {
  const n = e ? t : 400, a = 40, r = window.innerWidth - n, i = window.innerHeight - a;
  return {
    x: Math.max(0, Math.min(o.x, r)),
    y: Math.max(0, Math.min(o.y, i))
  };
}
function Bt(o) {
  const e = q();
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
function _(o, e, t) {
  return o ? { ...e } : { ...t };
}
function Ot(o, e, t, n) {
  return e ? {
    verticalPosition: { ...o },
    horizontalPosition: { ...n }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...o }
  };
}
function Nt(o) {
  return `布局模式: ${o.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${o.verticalWidth}px, 垂直位置: (${o.verticalPosition.x}, ${o.verticalPosition.y}), 水平位置: (${o.horizontalPosition.x}, ${o.horizontalPosition.y})`;
}
function re(o, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${o.x}, ${o.y})`;
}
function zt(o, e, t) {
  let n = "var(--orca-tab-bg)", a = "var(--orca-color-text-1)", r = "normal", i = "";
  if (o.color)
    try {
      i = `--tab-color: ${o.color.startsWith("#") ? o.color : `#${o.color}`};`, n = "var(--orca-tab-colored-bg)", a = "var(--orca-tab-colored-text)", r = "600";
    } catch {
    }
  return e ? `
    ${i}
    background: ${n};
    color: ${a};
    font-weight: ${r};
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
    ${i}
    background: ${n};
    color: ${a};
    font-weight: ${r};
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
function Ft() {
  const o = document.createElement("div");
  return o.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, o;
}
function Rt(o) {
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
function _t(o) {
  const e = document.createElement("div");
  e.style.cssText = `
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
  const t = document.createElement("div");
  return t.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(to right, transparent, var(--orca-bg-color, #ffffff));
    pointer-events: none;
    z-index: 1;
  `, e.appendChild(t), e.textContent = o, e;
}
function qt() {
  const o = document.createElement("span");
  return o.textContent = "📌", o.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, o;
}
function Ht(o) {
  let e = o.title;
  return o.isPinned && (e += " (已固定)"), e;
}
function Ut() {
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
function oe(o = "primary") {
  return {
    primary: "orca-button orca-button-primary",
    secondary: "orca-button",
    danger: "orca-button"
  }[o];
}
function Vt() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function Yt(o, e, t, n) {
  return o ? `
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
    width: ${n || 200}px;
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
function jt(o, e, t = {}) {
  try {
    const {
      updateOrder: n = !0,
      saveData: a = !0,
      updateUI: r = !0
    } = t, i = e.findIndex((s) => s.blockId === o.blockId);
    if (i === -1)
      return {
        success: !1,
        message: `标签不存在: ${o.title}`
      };
    e[i].isPinned = !e[i].isPinned, n && Kt(e);
    const c = e[i].isPinned ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${o.title}" 已${c}`,
      data: { tab: e[i], tabIndex: i }
    };
  } catch (n) {
    return {
      success: !1,
      message: `切换固定状态失败: ${n}`
    };
  }
}
function Xt(o, e, t, n = {}) {
  try {
    const {
      updateUI: a = !0,
      saveData: r = !0,
      validateData: i = !0
    } = n, c = t.findIndex((s) => s.blockId === o.blockId);
    if (c === -1)
      return {
        success: !1,
        message: `标签不存在: ${o.title}`
      };
    if (i) {
      const s = Jt(e);
      if (!s.success)
        return s;
    }
    return t[c] = { ...t[c], ...e }, {
      success: !0,
      message: `标签 "${o.title}" 已更新`,
      data: { tab: t[c], tabIndex: c }
    };
  } catch (a) {
    return {
      success: !1,
      message: `更新标签失败: ${a}`
    };
  }
}
function Gt(o, e, t, n = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : Xt(o, { title: e.trim() }, t, n);
}
function Jt(o) {
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
function Kt(o) {
  o.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function Qt(o) {
  for (let e = o.length - 1; e >= 0; e--)
    if (!o[e].isPinned)
      return e;
  return -1;
}
function Zt(o) {
  return [...o].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function en(o, e, t, n) {
  return e ? {
    x: o.x,
    y: o.y,
    width: t,
    height: n
  } : {
    x: o.x,
    y: o.y,
    width: Math.min(800, window.innerWidth - o.x - 10),
    height: 28
  };
}
function tn(o, e, t, n) {
  const a = en(o, e, t, n);
  let r = o.x, i = o.y;
  return a.x < 0 ? r = 0 : a.x + a.width > window.innerWidth && (r = window.innerWidth - a.width), a.y < 0 ? i = 0 : a.y + a.height > window.innerHeight && (i = window.innerHeight - a.height), { x: r, y: i };
}
function ie(o, e, t = !1) {
  let n = null;
  const a = (...r) => {
    const i = t && !n;
    n && clearTimeout(n), n = window.setTimeout(() => {
      n = null, t || o(...r);
    }, e), i && o(...r);
  };
  return a.cancel = () => {
    n && (clearTimeout(n), n = null);
  }, a;
}
function nn(o, e, t) {
  var n, a;
  try {
    const r = o.startsWith("#") ? o : `#${o}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(r))
      return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const i = parseInt(r.slice(1, 3), 16), c = parseInt(r.slice(3, 5), 16), s = parseInt(r.slice(5, 7), 16), l = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((a = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : a.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${i}, ${c}, ${s}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : l ? `oklch(from rgb(${i}, ${c}, ${s}) calc(l * 1.6) c h)` : `oklch(from rgb(${i}, ${c}, ${s}) calc(l * 0.6) c h)`;
  } catch {
    return e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
var F = /* @__PURE__ */ ((o) => (o[o.ERROR = 0] = "ERROR", o[o.WARN = 1] = "WARN", o[o.INFO = 2] = "INFO", o[o.DEBUG = 3] = "DEBUG", o[o.VERBOSE = 4] = "VERBOSE", o))(F || {});
const an = {
  level: 2,
  enableConsole: !0,
  enableStorage: !1,
  maxStorageEntries: 1e3,
  enableTimestamps: !0,
  enableColors: !0,
  prefix: "[OrcaTabs]"
};
class j {
  constructor(e = {}) {
    f(this, "config");
    f(this, "storage", []);
    f(this, "colors", {
      0: "#ff4444",
      1: "#ffaa00",
      2: "#00aaff",
      3: "#00ff88",
      4: "#888888"
    });
    this.config = { ...an, ...e };
  }
  /**
   * 更新配置
   */
  updateConfig(e) {
    this.config = { ...this.config, ...e };
  }
  /**
   * 记录日志
   */
  log(e, t, n, a) {
    if (e > this.config.level) return;
    const r = {
      timestamp: Date.now(),
      level: e,
      message: t,
      data: n,
      source: a
    };
    this.config.enableConsole && this.logToConsole(r), this.config.enableStorage && this.logToStorage(r);
  }
  /**
   * 输出到控制台
   */
  logToConsole(e) {
    const { timestamp: t, level: n, message: a, data: r, source: i } = e;
    F[n];
    const c = this.config.enableTimestamps ? new Date(t).toLocaleTimeString() : "";
    `${this.config.prefix}`, c && `${c}`, this.config.enableColors && typeof window < "u";
  }
  /**
   * 获取控制台方法
   */
  getConsoleMethod(e) {
    return () => {
    };
  }
  /**
   * 存储日志
   */
  logToStorage(e) {
    this.storage.push(e), this.storage.length > this.config.maxStorageEntries && (this.storage = this.storage.slice(-this.config.maxStorageEntries));
  }
  /**
   * 错误日志
   */
  error(e, t, n) {
    this.log(0, e, t, n);
  }
  /**
   * 警告日志
   */
  warn(e, t, n) {
    this.log(1, e, t, n);
  }
  /**
   * 信息日志
   */
  info(e, t, n) {
    this.log(2, e, t, n);
  }
  /**
   * 调试日志
   */
  debug(e, t, n) {
    this.log(3, e, t, n);
  }
  /**
   * 详细日志
   */
  verbose(e, t, n) {
    this.log(4, e, t, n);
  }
  /**
   * 获取存储的日志
   */
  getLogs(e, t) {
    let n = this.storage;
    return e !== void 0 && (n = n.filter((a) => a.level === e)), t !== void 0 && (n = n.slice(-t)), n;
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
  exportLogs(e = "json") {
    return e === "json" ? JSON.stringify(this.storage, null, 2) : this.storage.map((t) => {
      const n = new Date(t.timestamp).toLocaleString(), a = F[t.level], r = t.source ? ` [${t.source}]` : "", i = t.data ? ` ${JSON.stringify(t.data)}` : "";
      return `[${n}] ${a}${r}: ${t.message}${i}`;
    }).join(`
`);
  }
  /**
   * 性能计时器
   */
  time(e) {
  }
  /**
   * 结束性能计时
   */
  timeEnd(e) {
  }
  /**
   * 性能标记
   */
  mark(e) {
    typeof performance < "u" && performance.mark && performance.mark(`${this.config.prefix}-${e}`);
  }
  /**
   * 性能测量
   */
  measure(e, t, n) {
    if (typeof performance < "u" && performance.measure) {
      const a = `${this.config.prefix}-${t}`, r = n ? `${this.config.prefix}-${n}` : void 0;
      performance.measure(`${this.config.prefix}-${e}`, a, r);
    }
  }
  /**
   * 创建子日志器
   */
  createChild(e) {
    const t = new j(this.config);
    return t.config.prefix = `${this.config.prefix}[${e}]`, t;
  }
}
new j();
function rn(o, e, t, n) {
  const a = document.createElement("div");
  a.className = "orca-tabs-plugin orca-tabs-container";
  const r = Yt(o, e, n, t);
  return a.style.cssText = r, a;
}
function on(o, e, t) {
  const n = document.createElement("div");
  n.className = "width-adjustment-dialog";
  const a = Ut();
  n.style.cssText = a;
  const r = document.createElement("div");
  r.className = "dialog-title", r.textContent = "调整面板宽度", n.appendChild(r);
  const i = document.createElement("div");
  i.className = "dialog-slider-container", i.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const c = document.createElement("input");
  c.type = "range", c.min = "120", c.max = "800", c.value = o.toString(), c.style.cssText = Vt();
  const s = document.createElement("div");
  s.className = "dialog-width-display", s.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, s.textContent = `当前宽度: ${o}px`, c.oninput = () => {
    const u = parseInt(c.value);
    s.textContent = `当前宽度: ${u}px`, e(u);
  }, i.appendChild(c), i.appendChild(s), n.appendChild(i);
  const l = document.createElement("div");
  l.className = "dialog-buttons", l.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = oe(), d.onclick = () => se(n);
  const h = document.createElement("button");
  return h.className = "btn btn-secondary", h.textContent = "取消", h.style.cssText = oe(), h.onclick = () => {
    t(), se(n);
  }, l.appendChild(d), l.appendChild(h), n.appendChild(l), n;
}
function se(o) {
  o && o.parentNode && o.parentNode.removeChild(o);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function sn() {
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
function cn(o, e) {
  return o.length !== e.length ? !0 : !o.every((t, n) => t === e[n]);
}
let H;
class ln {
  constructor() {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
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
    f(this, "storageService", new xe());
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // ==================== 日志系统 ====================
    /** 日志管理器 - 提供统一的日志记录功能，支持不同级别的日志输出 */
    f(this, "logManager", new j({
      level: typeof window < "u" && window.DEBUG_ORCA_TABS_VERBOSE === !0 ? F.VERBOSE : F.WARN,
      // 生产模式：只显示警告和错误
      enableConsole: typeof window < "u" && window.DEBUG_ORCA_TABS === !0,
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
    // 防抖函数实例
    f(this, "normalDebounce", ie(async () => {
      await this.updateTabsUI();
    }, 100));
    f(this, "draggingDebounce", ie(async () => {
      await this.updateTabsUI();
    }, 200));
  }
  // ==================== 日志方法 ====================
  /** 调试日志 - 用于开发调试，记录一般信息 */
  log(...e) {
    this.logManager.info(e.join(" "));
  }
  /** 详细日志 - 仅在详细模式下启用，记录详细的调试信息 */
  verboseLog(...e) {
    this.logManager.verbose(e.join(" "));
  }
  /** 警告日志 - 记录警告信息，提醒潜在问题 */
  warn(...e) {
    this.logManager.warn(e.join(" "));
  }
  /** 错误日志 - 记录错误信息，用于问题诊断 */
  error(...e) {
    this.logManager.error(e.join(" "));
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
    sn();
    try {
      this.maxTabs = orca.state.settings[ce.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFixedToTopMode(), await this.restoreFloatingWindowVisibility(), await this.loadWorkspaces(), this.registerHeadbarButton(), await this.discoverPanels();
    const e = this.getFirstPanel();
    e ? this.log(`🎯 初始化第1个面板（持久化面板）: ${e}`) : this.log("⚠️ 初始化时没有发现面板"), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization(), await this.restoreFirstPanelTabs(), await this.restoreClosedTabs(), await this.restoreRecentlyClosedTabs(), await this.restoreSavedTabSets();
    const t = document.querySelector(".orca-panel.active"), n = t == null ? void 0 : t.getAttribute("data-panel-id");
    if (n && !n.startsWith("_") && (this.currentPanelId = n, this.currentPanelIndex = this.getPanelIds().indexOf(n), this.log(`🎯 当前活动面板: ${n} (索引: ${this.currentPanelIndex})`)), this.ensurePanelTabsDataSize(), this.panelOrder.length > 1) {
      this.log("📂 开始加载其他面板的标签页数据");
      for (let a = 1; a < this.panelOrder.length; a++) {
        const r = `panel_${a + 1}_tabs`;
        try {
          const i = await this.storageService.getConfig(r, "orca-tabs-plugin", []);
          this.log(`📂 从存储获取到第 ${a + 1} 个面板的数据: ${i ? i.length : 0} 个标签页`), i && i.length > 0 ? (this.panelTabsData[a] = [...i], this.log(`✅ 成功加载第 ${a + 1} 个面板的标签页数据: ${i.length} 个`)) : (this.panelTabsData[a] = [], this.log(`📂 第 ${a + 1} 个面板没有保存的数据`));
        } catch (i) {
          this.warn(`❌ 加载第 ${a + 1} 个面板数据失败:`, i), this.panelTabsData[a] = [];
        }
      }
    }
    if (n && this.currentPanelIndex !== 0)
      this.log(`🔍 扫描当前活动面板 ${n} 的标签页`), await this.scanCurrentPanelTabs();
    else if (n && this.currentPanelIndex === 0) {
      this.log("📋 当前活动面板是第一个面板，使用持久化数据");
      const a = document.querySelector(".orca-panel.active");
      if (a) {
        const r = a.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
        if (r) {
          const i = r.getAttribute("data-block-id");
          i && (this.getCurrentPanelTabs().find((l) => l.blockId === i) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${i}`), await this.checkCurrentPanelBlocks()));
        }
      }
    }
    await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.setupSettingsChecker(), this.isInitialized = !0, this.log("✅ 插件初始化完成");
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
   * 设置滚动监听器
   */
  setupScrollListener() {
    this.scrollListener && (this.scrollListener(), this.scrollListener = null);
    let e = null;
    const t = () => {
      e && clearTimeout(e), e = setTimeout(() => {
        const a = this.getCurrentActiveTab();
        a && this.recordScrollPosition(a);
      }, 300);
    }, n = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    n.forEach((a) => {
      a.addEventListener("scroll", t, { passive: !0 });
    }), this.scrollListener = () => {
      n.forEach((a) => {
        a.removeEventListener("scroll", t);
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
    const n = document.createElement("div");
    n.className = "orca-tab-drop-indicator", n.style.cssText = `
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
      const i = r.getBoundingClientRect();
      t === "before" ? (n.style.left = `${a.left - i.left}px`, n.style.top = `${a.top - i.top - 1}px`, n.style.width = `${a.width}px`) : (n.style.left = `${a.left - i.left}px`, n.style.top = `${a.bottom - i.top - 1}px`, n.style.width = `${a.width}px`), r.appendChild(n);
    }
    return n;
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
    const n = this.getCurrentPanelTabs(), a = n.findIndex((s) => s.blockId === e.blockId), r = n.findIndex((s) => s.blockId === t.blockId);
    if (a === -1 || r === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (a === r) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${r}) -> ${e.title} (${a})`);
    const i = n[r], c = n[a];
    n[a] = i, n[r] = c, n.forEach((s, l) => {
      s.order = l;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(n), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${i.title} -> 位置 ${a}`);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 面板管理 - Panel Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 发现所有面板
   */
  /**
   * 发现所有面板 - 重构为简化的数组管理
   * 按照用户思路：读取所有data-panel-id，按顺序存储到数组中
   */
  async discoverPanels() {
    this.log("🔍 开始发现面板...");
    const e = document.querySelectorAll(".orca-panel"), t = [];
    let n = null;
    e.forEach((r) => {
      const i = r.getAttribute("data-panel-id");
      if (i) {
        if (i.startsWith("_"))
          return;
        t.push(i), r.classList.contains("active") && (n = i);
      }
    }), this.log(`🎯 发现 ${t.length} 个面板:`, t), this.log(`🎯 当前激活面板: ${n || "无"}`);
    const a = this.getPanelIds();
    this.updatePanelOrder(t), this.updateCurrentPanelInfo(n), await this.handlePanelChanges(a, t);
  }
  /**
   * 更新当前面板信息
   */
  updateCurrentPanelInfo(e) {
    if (e) {
      const t = this.panelOrder.findIndex((n) => n.id === e);
      t !== -1 && (this.currentPanelId = e, this.currentPanelIndex = t, this.log(`🔄 当前面板更新: ${e} (索引: ${t}, 序号: ${this.panelOrder[t].order})`));
    } else
      this.currentPanelId = null, this.currentPanelIndex = -1, this.log("🔄 没有激活的面板");
  }
  /**
   * 处理面板变化
   */
  async handlePanelChanges(e, t) {
    const n = e.filter((r) => !t.includes(r));
    n.length > 0 && (this.log("🗑️ 检测到面板被关闭:", n), await this.handlePanelClosure(n));
    const a = t.filter((r) => !e.includes(r));
    a.length > 0 && (this.log("🆕 检测到新面板被打开:", a), this.handleNewPanels(a)), this.adjustPanelTabsDataSize();
  }
  /**
   * 处理面板关闭
   */
  async handlePanelClosure(e) {
    this.log("🗑️ 处理面板关闭:", e);
    const t = [];
    e.forEach((n) => {
      const a = this.panelOrder.findIndex((r) => r.id === n);
      a !== -1 && t.push(a);
    }), t.sort((n, a) => a - n).forEach((n) => {
      this.panelTabsData.splice(n, 1), this.log(`🗑️ 删除面板 ${e[t.indexOf(n)]} 的标签页数据`);
    }), this.currentPanelId && (this.currentPanelIndex = this.panelOrder.findIndex((n) => n.id === this.currentPanelId), this.currentPanelIndex === -1 && (this.panelOrder.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelOrder[0].id, this.log(`🔄 当前面板被关闭，切换到第一个面板: ${this.currentPanelId}`)) : (this.currentPanelIndex = -1, this.currentPanelId = null, this.log("❌ 所有面板已关闭")))), this.log("💾 面板关闭后保存所有剩余面板的数据");
    for (let n = 0; n < this.panelOrder.length; n++) {
      const a = this.panelTabsData[n] || [], r = n === 0 ? v.FIRST_PANEL_TABS : `panel_${n + 1}_tabs`;
      await this.savePanelTabsByKey(r, a);
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
    if (this.panelOrder.find((n) => n.id === e)) {
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
    const t = this.panelOrder.findIndex((n) => n.id === e);
    if (t === -1) {
      this.log(`⚠️ 面板 ${e} 不存在，无法删除`);
      return;
    }
    this.panelOrder.splice(t, 1), this.panelOrder.forEach((n, a) => {
      n.order = a + 1;
    }), this.log(`🗑️ 删除面板 ${e}，重新排序后的面板:`, this.panelOrder.map((n) => `${n.id}(${n.order})`)), this.panelTabsData.splice(t, 1);
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
    this.getPanelIds(), e.forEach((n) => {
      this.panelOrder.find((a) => a.id === n) || this.addPanel(n);
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
    const n = t.querySelectorAll(".orca-block-editor[data-block-id]"), a = [];
    let r = 0;
    this.log(`🔍 扫描第一个面板 ${e}，找到 ${n.length} 个块编辑器`);
    for (const i of n) {
      const c = i.getAttribute("data-block-id");
      if (!c) continue;
      const s = await this.getTabInfo(c, e, r++);
      s && (a.push(s), this.log(`📋 找到标签页: ${s.title} (${c})`));
    }
    this.panelTabsData[0] = [...a], await this.savePanelTabsByKey(v.FIRST_PANEL_TABS, a), this.log(`📋 第一个面板扫描并保存了 ${a.length} 个标签页`);
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
    const e = this.getCurrentPanelTabs(), t = Zt(e);
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return Qt(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return Dt(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, n = !1, a = !1;
    for (const r of e)
      r && typeof r == "object" && (r.t === "r" && r.v ? (a = !0, r.a || (t = !0)) : r.t === "t" && r.v && (n = !0));
    return t || n && a;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return Lt(e);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 检测块类型
   */
  async detectBlockType(e) {
    try {
      if (R(e))
        return "journal";
      if (e["data-type"]) {
        const a = e["data-type"];
        switch (this.log(`🔍 检测到 data-type: ${a}`), a) {
          case "table2":
            return "table";
          case "ul":
            return "list";
          case "ol":
            return "list";
          default:
            this.log(`⚠️ 未知的 data-type: ${a}`);
        }
      }
      if (e.aliases && e.aliases.length > 0) {
        this.log(`🏷️ 检测到别名块: aliases=${JSON.stringify(e.aliases)}`);
        const a = e.aliases[0];
        if (a)
          try {
            const r = this.findProperty(e, "_hide");
            return r && r.value ? (this.log(`📄 通过 _hide 属性确认为页面: ${a} (hide=${r.value})`), "page") : (this.log(`🏷️ 通过 _hide 属性确认为标签: ${a} (hide=${r ? r.value : "undefined"})`), "tag");
          } catch (r) {
            return this.warn("使用 API 检测标签失败，回退到文本分析:", r), a.includes("#") || a.includes("@") || a.length < 20 && a.match(/^[a-zA-Z0-9_-]+$/) || a.match(/^[a-z]+$/i) ? "tag" : "page";
          }
        return "alias";
      }
      this.verboseLog(`🔍 块信息调试: blockId=${e.id}, aliases=${e.aliases ? JSON.stringify(e.aliases) : "undefined"}, content=${e.content ? "exists" : "undefined"}, text=${e.text ? "exists" : "undefined"}`);
      const n = this.findProperty(e, "_repr");
      if (n && n.type === le.JSON && n.value)
        try {
          const a = typeof n.value == "string" ? JSON.parse(n.value) : n.value;
          if (a.type)
            return a.type;
        } catch {
        }
      if (e.content && Array.isArray(e.content)) {
        if (e.content.some(
          (s) => s && typeof s == "object" && s.type === "code"
        ))
          return "code";
        if (e.content.some(
          (s) => s && typeof s == "object" && s.type === "table"
        ))
          return "table";
        if (e.content.some(
          (s) => s && typeof s == "object" && s.type === "image"
        ))
          return "image";
        if (e.content.some(
          (s) => s && typeof s == "object" && s.type === "link"
        ))
          return "link";
      }
      if (e.text) {
        const a = e.text.trim();
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
      return "text";
    } catch (t) {
      return this.warn("检测块类型失败:", t), "text";
    }
  }
  /**
   * 根据块类型获取图标
   */
  getBlockTypeIcon(e) {
    const t = {
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
    }, n = t[e] || t.default;
    return this.verboseLog(`🎨 为块类型 "${e}" 分配图标: ${n}`), n;
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
   * 获取块文本标题（最低优先级）
   */
  getBlockTextTitle(e) {
    return e.text ? e.text.substring(0, 50) : `块 ${e.id}`;
  }
  /**
   * 使用指定模式格式化日期
   */
  formatDateWithPattern(e, t) {
    try {
      if (t.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const a = e.getDay(), i = ["日", "一", "二", "三", "四", "五", "六"][a], c = t.replace(/E/g, i);
          return D(e, c);
        } else
          return D(e, t);
      else
        return D(e, t);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const r of a)
        try {
          return D(e, r);
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
    return !e.properties || !Array.isArray(e.properties) ? null : e.properties.find((n) => n.name === t);
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
    ].some((n) => n.test(e));
  }
  async getTabInfo(e, t, n) {
    try {
      const a = await orca.invokeBackend("get-block", parseInt(e));
      if (!a) return null;
      let r = "", i = "", c = "", s = !1, l = "";
      l = await this.detectBlockType(a), this.log(`🔍 检测到块类型: ${l} (块ID: ${e})`), a.aliases && a.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(a.aliases)}, 检测到的类型=${l}`);
      try {
        const d = R(a);
        if (d)
          s = !0, r = Et(d);
        else if (a.aliases && a.aliases.length > 0)
          r = a.aliases[0];
        else if (a.content && a.content.length > 0)
          this.needsContentConcatenation(a.content) && a.text ? r = a.text.substring(0, 50) : r = (await this.extractTextFromContent(a.content)).substring(0, 50);
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
          r = h;
        } else
          r = `块 ${e}`;
      } catch (d) {
        this.warn("获取标题失败:", d), r = `块 ${e}`;
      }
      try {
        const d = this.findProperty(a, "_color"), h = this.findProperty(a, "_icon");
        d && d.type === 1 && (i = d.value), h && h.type === 1 ? (c = h.value, this.log(`🎨 使用用户自定义图标: ${c} (块ID: ${e})`)) : (this.showBlockTypeIcons || l === "journal") && (c = this.getBlockTypeIcon(l), this.log(`🎨 使用块类型图标: ${c} (块类型: ${l}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), c = this.getBlockTypeIcon(l);
      }
      return {
        blockId: e,
        panelId: t,
        title: r || `块 ${e}`,
        color: i,
        icon: c,
        isJournal: s,
        isPinned: !1,
        // 新标签默认不固定
        order: n,
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
    if (!this.isFloatingWindowVisible) {
      this.log("🙈 浮窗已隐藏，跳过UI创建");
      return;
    }
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), this.log("📱 使用自动切换模式，不创建面板切换器");
    const e = "color-mix(in srgb, var(--orca-color-bg-2), transparent 50%)";
    let t, n, a;
    if (this.isFixedToTop ? (t = { x: 0, y: 0 }, n = !1, a = window.innerWidth) : (t = this.isVerticalMode ? this.verticalPosition : this.position, n = this.isVerticalMode, a = this.verticalWidth), this.tabContainer = rn(
      n,
      t,
      a,
      e
    ), this.isFixedToTop) {
      const i = document.querySelector(".headbar") || document.querySelector(".toolbar") || document.querySelector(".top-bar") || document.querySelector('[class*="head"]') || document.querySelector('[class*="toolbar"]') || document.querySelector('[class*="bar"]') || document.body;
      this.log("🔍 查找顶部工具栏:", {
        headbar: (i == null ? void 0 : i.className) || (i == null ? void 0 : i.tagName),
        headbarExists: !!i,
        bodyChildren: document.body.children.length
      }), i.appendChild(this.tabContainer), i === document.body ? this.tabContainer.style.cssText += `
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
        `, this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${i.className || i.tagName}`);
    } else
      document.body.appendChild(this.tabContainer);
    this.tabContainer.addEventListener("mousedown", (i) => {
      const c = i.target;
      c.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !c.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && i.stopPropagation();
    }), this.tabContainer.addEventListener("click", (i) => {
      const c = i.target;
      c.closest(".orca-tabs-plugin .orca-tab, .new-tab-button, .drag-handle") && !c.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && i.stopPropagation();
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
    `, document.head.appendChild(e), this.log("✅ 拖拽样式已添加");
  }
  /**
   * 防抖更新标签页UI（防止闪烁，优化版）
   */
  debouncedUpdateTabsUI() {
    this.draggingTab ? this.draggingDebounce() : this.normalDebounce();
  }
  async updateTabsUI() {
    if (!this.tabContainer || this.isUpdating) return;
    this.isUpdating = !0;
    const e = Date.now();
    try {
      if (e - this.lastUpdateTime < 50)
        return;
      this.lastUpdateTime = e;
      const t = this.tabContainer.querySelector(".drag-handle"), n = this.tabContainer.querySelector(".new-tab-button"), a = this.tabContainer.querySelector(".workspace-button");
      this.tabContainer.innerHTML = "", t && this.tabContainer.appendChild(t);
      let r = this.currentPanelId, i = this.currentPanelIndex;
      if (!r && this.panelOrder.length > 0 && (r = this.panelOrder[0].id, i = 0, this.log(`📋 没有当前活动面板，显示第1个面板（持久化面板）: ${r}`)), r) {
        this.log(`📋 显示面板 ${r} 的标签页`);
        let c = this.panelTabsData[i] || [];
        c.length === 0 && (this.log(`🔍 面板 ${r} 没有标签数据，重新扫描`), await this.scanPanelTabsByIndex(i, r), c = this.panelTabsData[i] || []), this.sortTabsByPinStatus(), c.forEach((s, l) => {
          var h;
          const d = this.createTabElement(s);
          (h = this.tabContainer) == null || h.appendChild(d);
        });
      } else
        this.log("⚠️ 没有可显示的面板，跳过标签页显示");
      if (this.addNewTabButton(), this.addWorkspaceButton(), this.isFixedToTop) {
        const c = "var(--orca-tab-bg)", s = "var(--orca-tab-border)", l = "var(--orca-color-text-1)", d = this.tabContainer.querySelectorAll(".orca-tabs-plugin .orca-tab");
        d.forEach((u) => {
          const p = u.getAttribute("data-tab-id");
          if (!p) return;
          const m = this.getCurrentPanelTabs().find((b) => b.blockId === p);
          if (m) {
            let b, x, y = "normal";
            if (b = "var(--orca-tab-bg)", x = "var(--orca-color-text-1)", m.color)
              try {
                u.style.setProperty("--tab-color", m.color), b = "var(--orca-tab-colored-bg)", x = "var(--orca-tab-colored-text)", y = "600";
              } catch {
              }
            u.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${b};
            border-radius: var(--orca-radius-md);
            border: 1px solid ${s};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${x};
            font-weight: ${y};
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
          background: ${c};
          border-radius: var(--orca-radius-md);
          border: 1px solid ${s};
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
      e.forEach((n, a) => {
        const r = this.createTabElement(n);
        t.appendChild(r);
      });
    else {
      const n = document.createElement("div");
      n.className = "panel-status", n.style.cssText = `
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
      n.textContent = `面板 ${a}（无标签页）`, n.title = `当前在面板 ${a}，该面板没有标签页`, t.appendChild(n);
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
      e.forEach((n, a) => {
        const r = this.createTabElement(n);
        t.appendChild(r);
      });
    else {
      const n = document.createElement("div");
      n.className = "panel-status", n.style.cssText = `
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
      n.textContent = `面板 ${a}（无标签页）`, n.title = `当前在面板 ${a}，该面板没有标签页`, t.appendChild(n);
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
    const n = this.isVerticalMode ? `
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
    t.style.cssText = n, t.innerHTML = "+", t.title = "新建标签页", t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", async (a) => {
      a.preventDefault(), a.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(t), this.addNewTabButtonContextMenu(t), this.enableWorkspaces && this.addWorkspaceButton();
  }
  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    var a;
    if (!this.tabContainer || this.tabContainer.querySelector(".workspace-button")) return;
    const t = document.createElement("div");
    t.className = "workspace-button";
    const n = this.isVerticalMode ? `
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
    t.style.cssText = n, t.innerHTML = "📁", t.title = `工作区 (${((a = this.workspaces) == null ? void 0 : a.length) || 0})`, t.addEventListener("mouseenter", () => {
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
    var h, u;
    const t = document.querySelector(".new-tab-context-menu");
    t && t.remove();
    const n = document.documentElement.hasAttribute("data-theme") ? document.documentElement.getAttribute("data-theme") === "dark" : document.documentElement.classList.contains("dark") || ((u = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : u.themeMode) === "dark", a = document.createElement("div");
    a.className = "new-tab-context-menu";
    const r = 200, i = 140;
    let c = e.clientX, s = e.clientY;
    c + r > window.innerWidth && (c = window.innerWidth - r - 10), s + i > window.innerHeight && (s = window.innerHeight - i - 10), c = Math.max(10, c), s = Math.max(10, s), a.style.cssText = `
      position: fixed;
      left: ${c}px;
      top: ${s}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: ${r}px;
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
        const b = document.createElement("div");
        b.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, a.appendChild(b);
        return;
      }
      const g = document.createElement("div");
      if (g.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: ${n ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
      `, p.icon) {
        const b = document.createElement("span");
        b.textContent = p.icon, b.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, g.appendChild(b);
      }
      const m = document.createElement("span");
      m.textContent = p.text, g.appendChild(m), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        p.action && p.action(), a.remove();
      }), a.appendChild(g);
    }), document.body.appendChild(a);
    const d = (p) => {
      a.contains(p.target) || (a.remove(), document.removeEventListener("click", d));
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
    const t = e.classList.contains("sidebar-closed"), n = e.classList.contains("sidebar-opened");
    t ? this.lastSidebarState = "closed" : n ? this.lastSidebarState = "opened" : this.lastSidebarState = "unknown";
  }
  /**
   * 立即检查侧边栏状态变化（无防抖）
   */
  checkSidebarStateChangeImmediate() {
    if (!this.isSidebarAlignmentEnabled) return;
    const e = document.querySelector("div#app");
    if (!e) return;
    const t = e.classList.contains("sidebar-closed"), n = e.classList.contains("sidebar-opened");
    let a;
    t ? a = "closed" : n ? a = "opened" : a = "unknown", this.lastSidebarState !== a && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${a}`), this.lastSidebarState = a, this.autoAdjustSidebarAlignment());
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
      const n = t.classList.contains("sidebar-closed"), a = t.classList.contains("sidebar-opened");
      if (!n && !a) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const r = this.getCurrentPosition();
      if (!r) return;
      const i = this.calculateSidebarAlignmentPosition(
        r,
        e,
        n,
        a
      );
      if (!i) return;
      await this.updatePosition(i), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${r.x}, ${r.y}) → (${i.x}, ${i.y})`);
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
  calculateSidebarAlignmentPosition(e, t, n, a) {
    var i;
    let r;
    if (n)
      r = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${r}px`);
    else if (a) {
      r = e.x + t;
      const c = ((i = this.tabContainer) == null ? void 0 : i.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      r = Math.min(r, window.innerWidth - c - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${r}px`);
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
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), this.registerHeadbarButton(), await this.storageService.saveConfig(v.FLOATING_WINDOW_VISIBLE, this.isFloatingWindowVisible, "orca-tabs-plugin"), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("切换浮窗状态失败:", e);
    }
  }
  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    try {
      const e = await this.storageService.getConfig(v.FLOATING_WINDOW_VISIBLE, "orca-tabs-plugin", !1);
      this.isFloatingWindowVisible = e || !1, this.log(`📱 恢复浮窗可见状态: ${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("恢复浮窗可见状态失败:", e);
    }
  }
  /**
   * 注册顶部工具栏按钮
   */
  registerHeadbarButton() {
    try {
      this.unregisterHeadbarButton(), orca.headbar.registerHeadbarButton("orca-tabs-plugin.toggleButton", () => {
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
      }), this.showInHeadbar && typeof window < "u" && orca.headbar.registerHeadbarButton("orca-tabs-plugin.debugButton", () => {
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
      }), this.enableRecentlyClosedTabs && typeof window < "u" && orca.headbar.registerHeadbarButton("orca-tabs-plugin.recentlyClosedButton", () => {
        var n, a;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (r) => this.showRecentlyClosedTabsMenu(r),
          title: `最近关闭的标签页 (${((n = this.recentlyClosedTabs) == null ? void 0 : n.length) || 0})`,
          style: {
            color: (((a = this.recentlyClosedTabs) == null ? void 0 : a.length) || 0) > 0 ? "#ff6b6b" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: "ti ti-history"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton("orca-tabs-plugin.savedTabsButton", () => {
        var n, a;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (r) => this.showSavedTabSetsMenu(r),
          title: `保存的标签页集合 (${((n = this.savedTabSets) == null ? void 0 : n.length) || 0})`,
          style: {
            color: (((a = this.savedTabSets) == null ? void 0 : a.length) || 0) > 0 ? "#3b82f6" : "#999",
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
      orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.toggleButton"), orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.debugButton"), orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.recentlyClosedButton"), orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.savedTabsButton"), this.log("🔘 顶部工具栏按钮已注销");
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
      await this.saveLayoutMode(), await this.storageService.saveConfig("showBlockTypeIcons", this.showBlockTypeIcons, "orca-tabs-plugin"), this.log(`✅ 块类型图标显示设置已保存: ${this.showBlockTypeIcons ? "开启" : "关闭"}`);
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
    for (let n = 0; n < e.length; n++) {
      const a = e[n];
      try {
        const r = await orca.invokeBackend("get-block", parseInt(a.blockId));
        if (r) {
          const i = await this.detectBlockType(r), c = this.findProperty(r, "_color"), s = this.findProperty(r, "_icon");
          let l = a.color, d = a.icon;
          c && c.type === 1 && (l = c.value), s && s.type === 1 ? d = s.value : d || (d = this.getBlockTypeIcon(i)), a.blockType !== i || a.icon !== d || a.color !== l ? (e[n] = {
            ...a,
            blockType: i,
            icon: d,
            color: l
          }, this.log(`✅ 更新标签: ${a.title} -> 类型: ${i}, 图标: ${d}, 颜色: ${l}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${a.title} (无需更新)`);
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
      this.log("   侧边栏元素信息:"), this.log(`     - ID: ${e.id}`), this.log(`     - 类名: ${e.className}`), this.log(`     - 标签名: ${e.tagName}`);
      const n = window.getComputedStyle(e).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${n}"`), n && n !== "") {
        const r = parseInt(n.replace("px", ""));
        if (isNaN(r))
          this.log(`⚠️ CSS变量值无法解析为数字: "${n}"`);
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
    const t = e.clientX, n = this.verticalWidth, a = async (i) => {
      const c = i.clientX - t, s = Math.max(120, Math.min(400, n + c));
      this.verticalWidth = s;
      try {
        orca.nav.changeSizes(orca.state.activePanel, [s]), this.tabContainer.style.width = `${s}px`;
      } catch (l) {
        this.error("调整面板宽度失败:", l);
      }
    }, r = async () => {
      document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", r);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (i) {
        this.error("保存宽度设置失败:", i);
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
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    const e = document.querySelector(".width-adjustment-dialog");
    e && e.remove();
    const t = this.verticalWidth, n = on(
      this.verticalWidth,
      async (a) => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [a]), this.tabContainer && (this.tabContainer.style.width = `${a}px`), this.verticalWidth = a, await this.saveLayoutMode();
        } catch (r) {
          this.error("实时调整面板宽度失败:", r);
        }
      },
      async () => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [t]), this.tabContainer && (this.tabContainer.style.width = `${t}px`), this.verticalWidth = t;
        } catch (a) {
          this.error("恢复面板宽度失败:", a);
        }
      }
    );
    document.body.appendChild(n);
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
    const a = this.isVerticalMode && !this.isFixedToTop, r = zt(e, a);
    t.style.cssText = r;
    const i = Ft();
    if (e.icon && this.showBlockTypeIcons) {
      const s = Rt(e.icon);
      i.appendChild(s);
    }
    const c = _t(e.title);
    if (i.appendChild(c), e.isPinned) {
      const s = qt();
      i.appendChild(s);
    }
    return t.appendChild(i), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), t.title = Ht(e), t.addEventListener("click", (s) => {
      var d;
      s.preventDefault(), this.log(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`), this.closedTabs.has(e.blockId) && (this.closedTabs.delete(e.blockId), this.saveClosedTabs(), this.log(`🔄 点击已关闭的标签 "${e.title}"，从已关闭列表中移除`));
      const l = (d = this.tabContainer) == null ? void 0 : d.querySelectorAll(".orca-tabs-plugin .orca-tab");
      l == null || l.forEach((h) => h.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (s) => {
    }), t.addEventListener("dblclick", (s) => {
      s.preventDefault(), s.stopPropagation(), s.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (s) => {
      s.button === 1 && (s.preventDefault(), s.stopPropagation(), s.stopImmediatePropagation(), this.closeTab(e));
    }), t.addEventListener("keydown", (s) => {
      (s.target === t || t.contains(s.target)) && (s.key === "F2" ? (s.preventDefault(), s.stopPropagation(), this.renameTab(e)) : s.ctrlKey && s.key === "w" && (s.preventDefault(), s.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (s) => {
      var d;
      if (s.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        s.preventDefault();
        return;
      }
      s.dataTransfer.effectAllowed = "move", (d = s.dataTransfer) == null || d.setData("text/plain", e.blockId), this.draggingTab = e, this.lastSwapTarget = null, this.isDragListenersInitialized || (this.setupOptimizedDragListeners(), this.isDragListenersInitialized = !0), this.dragOverListener && (console.log("🔄 添加全局拖拽监听器"), document.addEventListener("dragover", this.dragOverListener)), console.log("🔄 拖拽开始，设置draggingTab:", e.title), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), t.setAttribute("data-dragging", "true"), t.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", (s) => {
      console.log("🔄 拖拽结束，清除draggingTab"), this.dragOverListener && (console.log("🔄 移除全局拖拽监听器"), document.removeEventListener("dragover", this.dragOverListener)), this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.clearDragVisualFeedback(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (s) => {
      if (!s.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (s.preventDefault(), s.stopPropagation(), s.dataTransfer.dropEffect = "move", !this.dragOverTab || this.dragOverTab.blockId !== e.blockId) {
          const d = t.getBoundingClientRect(), h = d.top + d.height / 2, u = s.clientY < h ? "before" : "after";
          this.updateDropIndicator(t, u), this.dragOverTab = e;
        }
        this.debouncedSwapTab(e, this.draggingTab), this.verboseLog(`🔄 拖拽经过: ${e.title} (目标: ${this.draggingTab.title})`);
      }
    }), t.addEventListener("dragenter", (s) => {
      s.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== e.blockId && (s.preventDefault(), s.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`));
    }), t.addEventListener("dragleave", (s) => {
      const l = t.getBoundingClientRect(), d = s.clientX, h = s.clientY, u = 5;
      (d < l.left - u || d > l.right + u || h < l.top - u || h > l.bottom + u) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (s) => {
      var d;
      s.preventDefault();
      const l = (d = s.dataTransfer) == null ? void 0 : d.getData("text/plain");
      this.log(`🔄 拖拽放置: ${l} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return At(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const n = parseInt(t[1], 16), a = parseInt(t[2], 16), r = parseInt(t[3], 16);
      return (0.299 * n + 0.587 * a + 0.114 * r) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (n) {
      let a = parseInt(n[1], 16), r = parseInt(n[2], 16), i = parseInt(n[3], 16);
      a = Math.floor(a * (1 - t)), r = Math.floor(r * (1 - t)), i = Math.floor(i * (1 - t));
      const c = a.toString(16).padStart(2, "0"), s = r.toString(16).padStart(2, "0"), l = i.toString(16).padStart(2, "0");
      return `#${c}${s}${l}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, n) {
    const a = e / 255, r = t / 255, i = n / 255, c = (X) => X <= 0.04045 ? X / 12.92 : Math.pow((X + 0.055) / 1.055, 2.4), s = c(a), l = c(r), d = c(i), h = s * 0.4124564 + l * 0.3575761 + d * 0.1804375, u = s * 0.2126729 + l * 0.7151522 + d * 0.072175, p = s * 0.0193339 + l * 0.119192 + d * 0.9503041, g = 0.2104542553 * h + 0.793617785 * u - 0.0040720468 * p, m = 1.9779984951 * h - 2.428592205 * u + 0.4505937099 * p, b = 0.0259040371 * h + 0.7827717662 * u - 0.808675766 * p, x = Math.cbrt(g), y = Math.cbrt(m), w = Math.cbrt(b), C = 0.2104542553 * x + 0.793617785 * y + 0.0040720468 * w, P = 1.9779984951 * x - 2.428592205 * y + 0.4505937099 * w, $ = 0.0259040371 * x + 0.7827717662 * y - 0.808675766 * w, k = Math.sqrt(P * P + $ * $), W = Math.atan2($, P) * 180 / Math.PI, B = W < 0 ? W + 360 : W;
    return { l: C, c: k, h: B };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, n) {
    const a = n * Math.PI / 180, r = t * Math.cos(a), i = t * Math.sin(a), c = e, s = r, l = i, d = c * c * c, h = s * s * s, u = l * l * l, p = 1.0478112 * d + 0.0228866 * h - 0.050217 * u, g = 0.0295424 * d + 0.9904844 * h + 0.0170491 * u, m = -92345e-7 * d + 0.0150436 * h + 0.7521316 * u, b = 3.2404542 * p - 1.5371385 * g - 0.4985314 * m, x = -0.969266 * p + 1.8760108 * g + 0.041556 * m, y = 0.0556434 * p - 0.2040259 * g + 1.0572252 * m, w = (k) => k <= 31308e-7 ? 12.92 * k : 1.055 * Math.pow(k, 1 / 2.4) - 0.055, C = Math.max(0, Math.min(255, Math.round(w(b) * 255))), P = Math.max(0, Math.min(255, Math.round(w(x) * 255))), $ = Math.max(0, Math.min(255, Math.round(w(y) * 255)));
    return { r: C, g: P, b: $ };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return nn(e, t);
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
    const e = this.panelTabsData[this.currentPanelIndex] || [];
    try {
      const t = this.currentPanelIndex === 0 ? v.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
      await this.storageService.saveConfig(t, e, "orca-tabs-plugin"), this.verboseLog(`💾 已保存第 ${this.currentPanelIndex + 1} 个面板的标签页数据: ${e.length} 个`);
    } catch (t) {
      this.warn(`❌ 保存第 ${this.currentPanelIndex + 1} 个面板标签页数据失败:`, t);
    }
  }
  /**
   * 同步当前标签数组到对应的存储数组
   */
  syncCurrentTabsToStorage(e) {
    this.setCurrentPanelTabs(e);
  }
  async switchToTab(e) {
    try {
      this.log(`🔄 开始切换标签: ${e.title} (ID: ${e.blockId})`);
      const t = this.getCurrentActiveTab();
      t && t.blockId !== e.blockId && (this.recordScrollPosition(t), this.lastActiveBlockId = t.blockId, this.log(`🎯 记录切换前的激活标签: ${t.title} (ID: ${t.blockId})`));
      const n = this.getPanelIds();
      let a = "";
      if (e.panelId && n.includes(e.panelId) ? a = e.panelId : this.currentPanelId && n.includes(this.currentPanelId) ? a = this.currentPanelId : n.length > 0 && (a = n[0]), !a) {
        this.warn("⚠️ 无法确定目标面板，当前没有可用的面板");
        return;
      }
      const r = n.indexOf(a);
      r !== -1 ? (this.currentPanelIndex = r, this.currentPanelId = a) : this.warn(`⚠️ 目标面板 ${a} 不在面板列表中`), this.log(`🎯 目标面板ID: ${a}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        orca.nav.switchFocusTo(a);
      } catch (i) {
        this.verboseLog("无法直接聚焦面板，继续尝试导航", i);
      }
      try {
        if (e.isJournal) {
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${e.blockId}`);
          let i = null, c = !1;
          try {
            const s = await orca.invokeBackend("get-block", parseInt(e.blockId));
            if (s) {
              const l = R(s);
              l && !isNaN(l.getTime()) && (i = l, c = !1);
            }
          } catch {
          }
          if (!i)
            if (e.title.includes("今天") || e.title.includes("Today"))
              try {
                await orca.commands.invokeCommand("core.goToday"), c = !0;
              } catch {
                i = /* @__PURE__ */ new Date();
              }
            else if (e.title.includes("昨天") || e.title.includes("Yesterday"))
              try {
                await orca.commands.invokeCommand("core.goYesterday"), c = !0;
              } catch {
                i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() - 1);
              }
            else if (e.title.includes("明天") || e.title.includes("Tomorrow"))
              try {
                await orca.commands.invokeCommand("core.goTomorrow"), c = !0;
              } catch {
                i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() + 1);
              }
            else {
              const s = e.title.match(/(\d{4}-\d{2}-\d{2})/);
              if (s) {
                const l = s[1];
                i = /* @__PURE__ */ new Date(l + "T00:00:00.000Z"), isNaN(i.getTime()) && (i = null);
              } else
                try {
                  const l = await orca.invokeBackend("get-block", parseInt(e.blockId));
                  if (l) {
                    const d = R(l);
                    d && !isNaN(d.getTime()) && (i = d);
                  }
                } catch (l) {
                  this.warn("无法获取块信息:", l);
                }
            }
          if (!c)
            if (i) {
              this.log(`📅 使用日期导航: ${i.toISOString().split("T")[0]}`);
              try {
                if (isNaN(i.getTime()))
                  throw new Error("Invalid date");
                await orca.nav.goTo("journal", { date: i }, a);
              } catch {
                try {
                  const l = {
                    t: 2,
                    // 2 for full/absolute date
                    v: i.getTime()
                    // 使用时间戳
                  };
                  await orca.nav.goTo("journal", { date: l }, a);
                } catch (l) {
                  throw l;
                }
              }
            } else {
              this.log("⚠️ 未找到日期信息，尝试使用块ID导航");
              try {
                await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, a);
              } catch (s) {
                throw s;
              }
            }
        } else
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${e.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, a);
        this.log("✅ orca.nav.goTo 导航成功");
      } catch (i) {
        this.warn("导航失败，尝试备用方法:", i);
        const c = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (c)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), c.click();
        else {
          this.error("无法找到目标块元素:", e.blockId);
          const s = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          s ? (this.log("🔄 找到备用块元素，尝试点击"), s.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = e.blockId, this.log(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
        this.debugScrollPosition(e);
      }, 500), await this.focusTabElementById(e.blockId);
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
    const n = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    return n ? n.getAttribute("data-block-id") === e.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), n = t.findIndex((r) => r.blockId === e.blockId);
    if (n === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let a = -1;
    if (n === 0 ? a = 1 : n === t.length - 1 ? a = n - 1 : a = n + 1, a >= 0 && a < t.length) {
      const r = t[a];
      this.log(`🔄 自动切换到相邻标签: "${r.title}" (位置: ${a})`), this.currentPanelId && await orca.nav.goTo("block", { blockId: parseInt(r.blockId) }, this.currentPanelId || "");
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), n = jt(e, t, {
      updateOrder: !0,
      saveData: !0,
      updateUI: !0
    });
    n.success ? (this.syncCurrentTabsToStorage(t), this.debouncedUpdateTabsUI(), await this.saveCurrentPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页固定状态变化，实时更新工作区: ${e.title}`)), this.log(n.message)) : this.warn(n.message);
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
      await orca.plugins.setSettingsSchema("orca-tabs-plugin", t);
      const n = (e = orca.state.plugins["orca-tabs-plugin"]) == null ? void 0 : e.settings;
      n != null && n.homePageBlockId && (this.homePageBlockId = n.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (n == null ? void 0 : n.showInHeadbar) !== void 0 && (this.showInHeadbar = n.showInHeadbar, this.log(`🔘 顶部工具栏按钮显示: ${this.showInHeadbar ? "开启" : "关闭"}`)), (n == null ? void 0 : n.enableRecentlyClosedTabs) !== void 0 && (this.enableRecentlyClosedTabs = n.enableRecentlyClosedTabs, this.log(`📋 最近关闭标签页功能: ${this.enableRecentlyClosedTabs ? "开启" : "关闭"}`)), (n == null ? void 0 : n.enableMultiTabSaving) !== void 0 && (this.enableMultiTabSaving = n.enableMultiTabSaving, this.log(`💾 多标签页保存功能: ${this.enableMultiTabSaving ? "开启" : "关闭"}`)), (n == null ? void 0 : n.enableWorkspaces) !== void 0 && (this.enableWorkspaces = n.enableWorkspaces, this.log(`📁 工作区功能: ${this.enableWorkspaces ? "开启" : "关闭"}`)), this.log("✅ 插件设置已注册");
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
      const t = (e = orca.state.plugins["orca-tabs-plugin"]) == null ? void 0 : e.settings;
      if (!t) return;
      if (t.showInHeadbar !== this.lastSettings.showInHeadbar) {
        const n = this.showInHeadbar;
        this.showInHeadbar = t.showInHeadbar, this.log(`🔘 设置变化：顶部工具栏按钮显示 ${n ? "开启" : "关闭"} -> ${this.showInHeadbar ? "开启" : "关闭"}`), this.registerHeadbarButton(), this.lastSettings.showInHeadbar = this.showInHeadbar;
      }
      if (t.homePageBlockId !== this.lastSettings.homePageBlockId && (this.homePageBlockId = t.homePageBlockId, this.log(`🏠 设置变化：主页块ID已更新为 ${this.homePageBlockId}`), this.lastSettings.homePageBlockId = this.homePageBlockId), t.enableWorkspaces !== this.lastSettings.enableWorkspaces) {
        const n = this.enableWorkspaces;
        this.enableWorkspaces = t.enableWorkspaces, this.log(`📁 设置变化：工作区功能 ${n ? "开启" : "关闭"} -> ${this.enableWorkspaces ? "开启" : "关闭"}`), this.debouncedUpdateTabsUI(), this.lastSettings.enableWorkspaces = this.enableWorkspaces;
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
        render: (e, t, n) => {
          const a = window.React;
          return !a || !orca.components.MenuText ? null : a.createElement(orca.components.MenuText, {
            title: "在新标签页打开",
            preIcon: "ti ti-external-link",
            onClick: () => {
              n(), this.openInNewTab(e.toString());
            }
          });
        }
      }), orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.addToTabGroup", {
        worksOnMultipleBlocks: !1,
        render: (e, t, n) => {
          const a = window.React;
          return !a || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : a.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              n(), this.getTabInfo(e.toString(), this.currentPanelId || "" || "", 0).then((r) => {
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
      const n = this.getCurrentPanelTabs(), a = {
        blockId: e,
        panelId: this.currentPanelId || "",
        title: t,
        isPinned: !1,
        order: n.length
      };
      this.log(`📋 新标签页信息: "${a.title}" (ID: ${e})`);
      const r = this.getCurrentActiveTab();
      let i = n.length;
      if (r) {
        const c = n.findIndex((s) => s.blockId === r.blockId);
        c !== -1 && (i = c + 1, this.log(`🎯 将在聚焦标签 "${r.title}" 后面插入新标签: "${a.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (n.length >= this.maxTabs) {
        n.splice(i, 0, a), this.verboseLog(`➕ 在位置 ${i} 插入新标签: ${a.title}`);
        const c = this.findLastNonPinnedTabIndex();
        if (c !== -1) {
          const s = n[c];
          n.splice(c, 1), this.log(`🗑️ 删除末尾的非固定标签: "${s.title}" 来保持数量限制`);
        } else {
          const s = n.findIndex((l) => l.blockId === a.blockId);
          if (s !== -1) {
            n.splice(s, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${a.title}"`);
            return;
          }
        }
      } else
        n.splice(i, 0, a), this.verboseLog(`➕ 在位置 ${i} 插入新标签: ${a.title}`);
      this.syncCurrentTabsToStorage(n), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId || ""), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${a.title}"`);
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
    } catch (n) {
      this.warn("设置块内容失败，尝试备用方法:", n);
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
  async focusTabElementById(e) {
    this.tabContainer || await this.updateTabsUI();
    const t = () => {
      var r, i;
      const n = (r = this.tabContainer) == null ? void 0 : r.querySelectorAll(".orca-tabs-plugin .orca-tab");
      n == null || n.forEach((c) => c.removeAttribute("data-focused"));
      const a = (i = this.tabContainer) == null ? void 0 : i.querySelector(`[data-tab-id="${e}"]`);
      return a ? (a.setAttribute("data-focused", "true"), !0) : !1;
    };
    t() || (await this.updateTabsUI(), t());
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(e, t, n = !1) {
    try {
      const a = this.getCurrentPanelTabs(), r = a.find((d) => d.blockId === e);
      if (r)
        return this.log(`📋 块 ${e} 已存在于标签页中，聚焦已有标签`), this.closedTabs.has(e) && (this.closedTabs.delete(e), await this.saveClosedTabs()), await this.switchToTab(r), await this.focusTabElementById(r.blockId), !0;
      if (!orca.state.blocks[parseInt(e)])
        return this.warn(`无法找到块 ${e}`), !1;
      const c = await this.getTabInfo(e, this.currentPanelId || "", a.length);
      if (!c)
        return this.warn(`无法获取块 ${e} 的标签信息`), !1;
      let s = a.length, l = !1;
      if (t === "replace") {
        const d = this.getCurrentActiveTab();
        if (!d)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const h = a.findIndex((u) => u.blockId === d.blockId);
        if (h === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        d.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), s = h + 1, l = !1) : (s = h, l = !0);
      } else if (t === "after") {
        const d = this.getCurrentActiveTab();
        if (d) {
          const h = a.findIndex((u) => u.blockId === d.blockId);
          h !== -1 && (s = h + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (a.length >= this.maxTabs)
        if (l)
          a[s] = c;
        else {
          a.splice(s, 0, c);
          const d = this.findLastNonPinnedTabIndex();
          if (d !== -1)
            a.splice(d, 1);
          else {
            const h = a.findIndex((u) => u.blockId === c.blockId);
            if (h !== -1)
              return a.splice(h, 1), !1;
          }
        }
      else
        l ? a[s] = c : a.splice(s, 0, c);
      return this.syncCurrentTabsToStorage(a), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), n && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId || ""), !0;
    } catch (a) {
      return this.error("添加标签页时出错:", a), !1;
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
    var t, n;
    try {
      let a = e;
      for (; a && a !== document.body; ) {
        const r = a.classList;
        if (r.contains("orca-ref") || r.contains("block-ref") || r.contains("block-reference") || r.contains("orca-fragment-r") || r.contains("fragment-r") || r.contains("orca-block-reference") || a.tagName.toLowerCase() === "a" && ((t = a.getAttribute("href")) != null && t.startsWith("#"))) {
          const c = a.getAttribute("data-ref-id") || a.getAttribute("data-target-block-id") || a.getAttribute("data-fragment-v") || a.getAttribute("data-v") || ((n = a.getAttribute("href")) == null ? void 0 : n.replace("#", "")) || a.getAttribute("data-id");
          if (c && !isNaN(parseInt(c)))
            return this.log(`🔗 从块引用元素中提取到ID: ${c}`), c;
        }
        const i = a.dataset;
        for (const [c, s] of Object.entries(i))
          if ((c.toLowerCase().includes("ref") || c.toLowerCase().includes("fragment")) && s && !isNaN(parseInt(s)))
            return this.log(`🔗 从data属性 ${c} 中提取到块引用ID: ${s}`), s;
        a = a.parentElement;
      }
      if (e.textContent) {
        const r = e.textContent.trim(), i = r.match(/\[\[(?:块)?(\d+)\]\]/) || r.match(/block[:\s]*(\d+)/i);
        if (i && i[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${i[1]}`), i[1];
      }
      return null;
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
      const n = t.anchor.blockId.toString();
      return this.log(`🔍 获取到当前光标块ID: ${n}`), n;
    } catch (e) {
      return this.error("获取当前光标块ID时出错:", e), null;
    }
  }
  /**
   * 增强块引用的右键菜单，添加标签页相关选项
   */
  enhanceBlockRefContextMenu(e) {
    var t, n, a, r;
    try {
      const i = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let c = null;
      for (let l = i.length - 1; l >= 0; l--) {
        const d = i[l];
        if (d.offsetParent !== null && getComputedStyle(d).display !== "none") {
          c = d;
          break;
        }
      }
      if (!c) {
        this.log("🔗 未找到显示的右键菜单");
        return;
      }
      if (c.querySelector(".orca-tabs-plugin .orca-tabs-ref-menu-item")) {
        this.log("🔗 块引用菜单项已存在");
        return;
      }
      if (this.log(`🔗 为块引用 ${e} 添加菜单项`), c.querySelectorAll('[role="menuitem"], .menu-item').length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-separator";
        const d = document.documentElement.classList.contains("dark") || ((n = (t = window.orca) == null ? void 0 : t.state) == null ? void 0 : n.themeMode) === "dark";
        l.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 8px;
        `, c.appendChild(l);
      }
      if (this.savedTabSets.length > 0) {
        const l = document.createElement("div");
        l.className = "orca-tabs-ref-menu-item", l.setAttribute("role", "menuitem");
        const d = document.documentElement.classList.contains("dark") || ((r = (a = window.orca) == null ? void 0 : a.state) == null ? void 0 : r.themeMode) === "dark";
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
          h && this.showAddToTabGroupDialog(h), c == null || c.remove();
        }), c.appendChild(l);
      }
      this.log(`✅ 成功为块引用 ${e} 添加菜单项`);
    } catch (i) {
      this.error("增强块引用右键菜单时出错:", i);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(e, t, n, a) {
    return Mt(e, t, n, a);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.getPanelIds()[this.currentPanelIndex], n = orca.nav.findViewPanel(t, orca.state.panels);
      if (n && n.viewState) {
        let a = null;
        const r = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (r) {
          const i = r.closest(".orca-panel");
          i && (a = i.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!a) {
          const i = document.querySelector(".orca-panel.active");
          i && (a = i.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (a || (a = document.body.scrollTop > 0 ? document.body : document.documentElement), a) {
          const i = {
            x: a.scrollLeft || 0,
            y: a.scrollTop || 0
          };
          n.viewState.scrollPosition = i;
          const c = this.getCurrentPanelTabs().findIndex((s) => s.blockId === e.blockId);
          c !== -1 && (this.getCurrentPanelTabs()[c].scrollPosition = i, await this.saveCurrentPanelTabs()), this.log(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, i, "容器:", a.className);
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
      const n = this.getPanelIds()[this.currentPanelIndex], a = orca.nav.findViewPanel(n, orca.state.panels);
      if (a && a.viewState && a.viewState.scrollPosition && (t = a.viewState.scrollPosition, this.log(`🔄 从viewState恢复标签 "${e.title}" 滚动位置:`, t)), !t && e.scrollPosition && (t = e.scrollPosition, this.log(`🔄 从标签信息恢复标签 "${e.title}" 滚动位置:`, t)), !t) return;
      const r = (i = 1) => {
        if (i > 5) {
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
        c || (c = document.body.scrollTop > 0 ? document.body : document.documentElement), c ? (c.scrollLeft = t.x, c.scrollTop = t.y, this.log(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", c.className, `尝试${i}`)) : setTimeout(() => r(i + 1), 200 * i);
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
    this.log(`🔍 调试标签 "${e.title}" 滚动位置:`), this.log("标签保存的滚动位置:", e.scrollPosition);
    const t = this.getPanelIds()[this.currentPanelIndex], n = orca.nav.findViewPanel(t, orca.state.panels);
    n && n.viewState ? (this.log("viewState中的滚动位置:", n.viewState.scrollPosition), this.log("完整viewState:", n.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((r) => {
      document.querySelectorAll(r).forEach((c, s) => {
        const l = c;
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
      const t = document.querySelector(".orca-panel.active");
      if (!t) return !1;
      const n = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
      if (!n) return !1;
      const r = n.getAttribute("data-block-id") === e.blockId;
      return r && this.closedTabs.has(e.blockId) ? (this.verboseLog(`🔍 标签 ${e.title} 在已关闭列表中，不认为是激活状态`), !1) : r;
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
    const n = t.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!n) return null;
    const a = n.getAttribute("data-block-id");
    if (!a) return null;
    const r = e.find((i) => i.blockId === a) || null;
    return this.enableWorkspaces && this.currentWorkspace && r && this.updateCurrentWorkspaceActiveIndex(r), r;
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
    const n = e.findIndex((a) => a.blockId === t.blockId);
    return n === -1 ? -1 : n;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    if (this.lastActiveBlockId) {
      const n = e.find((a) => a.blockId === this.lastActiveBlockId);
      if (n)
        return this.log(`🎯 找到上一个激活的标签: ${n.title}`), n;
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
    const n = t.findIndex((a) => a.blockId === e.blockId);
    return n === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${e.title}" (索引${n}) 后面插入新标签`), n);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), n = t.findIndex((a) => a.blockId === e.blockId);
    return n === -1 || t.length <= 1 ? null : n < t.length - 1 ? t[n + 1] : n > 0 ? t[n - 1] : n === 0 && t.length > 1 ? t[1] : null;
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
    const n = t.findIndex((a) => a.blockId === e.blockId);
    if (n !== -1) {
      const a = this.getCurrentActiveTab(), r = a && a.blockId === e.blockId, i = r ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const c = { ...e, closedAt: Date.now() }, s = this.recentlyClosedTabs.findIndex((l) => l.blockId === e.blockId);
        s !== -1 && this.recentlyClosedTabs.splice(s, 1), this.recentlyClosedTabs.unshift(c), this.recentlyClosedTabs.length > 20 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 20)), await this.saveRecentlyClosedTabs();
      }
      t.splice(n, 1), this.syncCurrentTabsToStorage(t), this.debouncedUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`)), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), r && i ? (this.log(`🔄 自动切换到相邻标签: "${i.title}"`), await this.switchToTab(i)) : r && !i && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
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
    const n = e.filter((r) => r.isPinned), a = e.length - n.length;
    this.setCurrentPanelTabs(n), this.syncCurrentTabsToStorage(n), this.debouncedUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${a} 个标签，保留了 ${n.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(e) {
    const t = this.getCurrentPanelTabs(), n = t.filter(
      (i) => i.blockId === e.blockId || i.isPinned
    );
    t.filter(
      (i) => i.blockId !== e.blockId && !i.isPinned
    ).forEach((i) => {
      this.closedTabs.add(i.blockId);
    });
    const r = t.length - n.length;
    this.setCurrentPanelTabs(n), this.syncCurrentTabsToStorage(n), this.debouncedUpdateTabsUI(), await this.saveCurrentPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${r} 个标签，保留了当前标签和固定标签`);
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
    const n = t.querySelector(".inline-rename-input");
    n && n.remove();
    const a = t.textContent, r = t.style.cssText, i = document.createElement("input");
    i.type = "text", i.value = e.title, i.className = "inline-rename-input";
    let c = "var(--orca-input-bg)", s = "var(--orca-color-text-1)";
    e.color && (c = this.applyOklchFormula(e.color, "background"), s = this.applyOklchFormula(e.color, "text")), i.style.cssText = `
      background: ${c};
      color: ${s};
      border: 2px solid var(--orca-color-primary-5);
      border-radius: var(--orca-radius-md);
      padding: 4px 12px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      font-weight: 600;
      outline: none;
      width: 100%;
      max-width: 100px;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, t.textContent = "", t.appendChild(i), t.style.padding = "2px 8px", i.focus(), i.select();
    const l = async () => {
      const h = i.value.trim();
      if (h && h !== e.title) {
        await this.updateTabTitle(e, h);
        return;
      }
      t.textContent = a, t.style.cssText = r;
    }, d = () => {
      t.textContent = a, t.style.cssText = r;
    };
    i.addEventListener("blur", l), i.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), d());
    }), i.addEventListener("click", (h) => {
      h.stopPropagation();
    });
  }
  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(e) {
    const t = window.React, n = window.ReactDOM;
    if (!t || !n || !orca.components.InputBox) {
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
    const r = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let i = { x: "50%", y: "50%" };
    if (r) {
      const h = r.getBoundingClientRect(), u = window.innerWidth, p = window.innerHeight, g = 300, m = 100, b = 20;
      let x = h.left, y = h.top - m - 10;
      x + g > u - b && (x = u - g - b), x < b && (x = b), y < b && (y = h.bottom + 10, y + m > p - b && (y = (p - m) / 2)), y + m > p - b && (y = p - m - b), x = Math.max(b, Math.min(x, u - g - b)), y = Math.max(b, Math.min(y, p - m - b)), i = { x: `${x}px`, y: `${y}px` };
    }
    const c = orca.components.InputBox, s = t.createElement(c, {
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
        left: i.x,
        top: i.y,
        pointerEvents: "auto"
      },
      onClick: h
    }, ""));
    n.render(s, a), setTimeout(() => {
      const h = a.querySelector("div");
      h && h.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(a), a.remove();
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
    const n = document.createElement("div");
    n.className = "tab-rename-input", n.style.cssText = `
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
    const i = document.createElement("button");
    i.className = "orca-button orca-button-primary", i.textContent = "确认";
    const c = document.createElement("button");
    c.className = "orca-button", c.textContent = "取消", r.appendChild(i), r.appendChild(c), n.appendChild(a), n.appendChild(r);
    const s = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (s) {
      const u = s.getBoundingClientRect();
      n.style.left = `${u.left}px`, n.style.top = `${u.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), a.focus(), a.select();
    const l = () => {
      const u = a.value.trim();
      u && u !== e.title && this.updateTabTitle(e, u), n.remove();
    }, d = () => {
      n.remove();
    };
    i.addEventListener("click", l), c.addEventListener("click", d), a.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), l()) : u.key === "Escape" && (u.preventDefault(), d());
    });
    const h = (u) => {
      n.contains(u.target) || (d(), document.removeEventListener("click", h));
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
      const n = this.getCurrentPanelTabs(), a = Gt(e, t, n, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      a.success ? (this.syncCurrentTabsToStorage(n), await this.saveCurrentPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${t}`)), this.log(a.message)) : this.warn(a.message);
    } catch (n) {
      this.error("重命名标签失败:", n);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(e, t) {
    const n = window.React, a = window.ReactDOM;
    if (!n || !a || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      setTimeout(() => {
        const r = window.React, i = window.ReactDOM;
        !r || !i || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? e.addEventListener("contextmenu", (c) => {
          c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.showTabContextMenu(c, t);
        }) : this.createOrcaContextMenu(e, t);
      }, 100);
      return;
    }
    this.createOrcaContextMenu(e, t);
  }
  createOrcaContextMenu(e, t) {
    const n = window.React, a = window.ReactDOM, r = document.createElement("div");
    r.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(r);
    const i = orca.components.ContextMenu, c = orca.components.Menu, s = orca.components.MenuText, l = orca.components.MenuSeparator, d = n.createElement(i, {
      menu: (p) => n.createElement(c, {}, [
        n.createElement(s, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            p(), this.renameTab(t);
          }
        }),
        n.createElement(s, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            p(), this.toggleTabPinStatus(t);
          }
        }),
        n.createElement(l, { key: "separator1" }),
        n.createElement(s, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeTab(t);
          }
        }),
        n.createElement(s, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeOtherTabs(t);
          }
        }),
        n.createElement(s, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.getCurrentPanelTabs().length <= 1,
          onClick: () => {
            p(), this.closeAllTabs();
          }
        })
      ])
    }, (p, g) => n.createElement("div", {
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
        b.preventDefault(), b.stopPropagation(), p(b);
      }
    }));
    a.render(d, r);
    const h = () => {
      a.unmountComponentAtNode(r), r.remove();
    }, u = new MutationObserver((p) => {
      p.forEach((g) => {
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
    var s, l;
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const a = document.documentElement.classList.contains("dark") || ((l = (s = window.orca) == null ? void 0 : s.state) == null ? void 0 : l.themeMode) === "dark", r = document.createElement("div");
    r.className = "tab-context-menu", r.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: 1000;
      min-width: 180px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const i = [
      {
        text: "重命名标签",
        action: () => this.renameTab(t)
      },
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(t)
      }
    ];
    this.savedTabSets.length > 0 && i.push({
      text: "添加到已有标签组",
      action: () => this.showAddToTabGroupDialog(t)
    }), i.push(
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
    ), i.forEach((d) => {
      const h = document.createElement("div");
      h.textContent = d.text, h.style.cssText = `
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${d.disabled ? a ? "#666" : "#999" : a ? "#ffffff" : "#333"};
        border-bottom: 1px solid var(--orca-color-border);
        transition: background-color 0.2s;
      `, d.disabled || (h.addEventListener("mouseenter", () => {
        h.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), h.addEventListener("mouseleave", () => {
        h.style.backgroundColor = "transparent";
      }), h.addEventListener("click", () => {
        d.action(), r.remove();
      })), r.appendChild(h);
    }), document.body.appendChild(r);
    const c = (d) => {
      r.contains(d.target) || (r.remove(), document.removeEventListener("click", c));
    };
    setTimeout(() => {
      document.addEventListener("click", c);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    try {
      const e = this.panelTabsData[0] || [];
      await this.storageService.saveConfig(v.FIRST_PANEL_TABS, e, "orca-tabs-plugin"), this.log(`💾 保存第一个面板的 ${e.length} 个标签页数据到API配置`);
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }
  // 注意：第二个面板现在使用统一的数据结构，不再需要单独的处理方法
  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    try {
      await this.storageService.saveConfig(v.CLOSED_TABS, Array.from(this.closedTabs), "orca-tabs-plugin"), this.log("💾 保存已关闭标签列表到API配置");
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }
  /**
   * 保存最近关闭的标签页列表到持久化存储（使用API）
   */
  async saveRecentlyClosedTabs() {
    try {
      await this.storageService.saveConfig(v.RECENTLY_CLOSED_TABS, this.recentlyClosedTabs, "orca-tabs-plugin"), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (e) {
      this.warn("无法保存最近关闭标签页列表:", e);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(v.FIRST_PANEL_TABS, "orca-tabs-plugin", []);
      e && Array.isArray(e) ? (this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = e, this.log(`📂 从API配置恢复了第一个面板的 ${e.length} 个标签页`), await this.updateRestoredTabsBlockTypes()) : (this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = [], this.log("📂 没有找到第一个面板的持久化标签数据，初始化为空数组"));
    } catch (e) {
      this.warn("无法恢复第一个面板标签数据:", e), this.panelTabsData.length === 0 && this.panelTabsData.push([]), this.panelTabsData[0] = [];
    }
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
    for (let n = 0; n < e.length; n++) {
      const a = e[n];
      if (!a.blockType || !a.icon)
        try {
          const i = await orca.invokeBackend("get-block", parseInt(a.blockId));
          if (i) {
            const c = await this.detectBlockType(i);
            let s = a.icon;
            s || (s = this.getBlockTypeIcon(c)), e[n] = {
              ...a,
              blockType: c,
              icon: s
            }, this.log(`✅ 更新恢复的标签: ${a.title} -> 类型: ${c}, 图标: ${s}`), t = !0;
          }
        } catch (i) {
          this.warn(`更新恢复的标签失败: ${a.title}`, i);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${a.title} (已有块类型和图标)`);
    }
    t && (this.log("🔄 检测到恢复的标签页有更新，保存到存储..."), this.panelTabsData[0] = e, await this.saveFirstPanelTabs()), this.log("✅ 恢复的标签页块类型和图标更新完成");
  }
  /**
   * 从持久化存储恢复已关闭标签列表（使用API）
   */
  async restoreClosedTabs() {
    try {
      const e = await this.storageService.getConfig(v.CLOSED_TABS, "orca-tabs-plugin", []);
      e && Array.isArray(e) ? (this.closedTabs = new Set(e), this.log(`📂 从API配置恢复了 ${this.closedTabs.size} 个已关闭标签`)) : (this.closedTabs = /* @__PURE__ */ new Set(), this.log("📂 没有找到持久化的已关闭标签数据，初始化为空集合"));
    } catch (e) {
      this.warn("无法恢复已关闭标签列表:", e), this.closedTabs = /* @__PURE__ */ new Set();
    }
  }
  /**
   * 从持久化存储恢复最近关闭的标签页列表（使用API）
   */
  async restoreRecentlyClosedTabs() {
    try {
      const e = await this.storageService.getConfig(v.RECENTLY_CLOSED_TABS, "orca-tabs-plugin", []);
      e && Array.isArray(e) ? (this.recentlyClosedTabs = e, this.log(`📂 从API配置恢复了 ${this.recentlyClosedTabs.length} 个最近关闭的标签页`)) : (this.recentlyClosedTabs = [], this.log("📂 没有找到最近关闭标签页数据，初始化为空数组"));
    } catch (e) {
      this.warn("无法恢复最近关闭标签页列表:", e), this.recentlyClosedTabs = [];
    }
  }
  /**
   * 保存多标签页集合到持久化存储（使用API）
   */
  async saveSavedTabSets() {
    try {
      await this.storageService.saveConfig(v.SAVED_TAB_SETS, this.savedTabSets, "orca-tabs-plugin"), this.log("💾 保存多标签页集合到API配置");
    } catch (e) {
      this.warn("无法保存多标签页集合:", e);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合（使用API）
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(v.SAVED_TAB_SETS, "orca-tabs-plugin", []);
      e && Array.isArray(e) ? (this.savedTabSets = e, this.log(`📂 从API配置恢复了 ${this.savedTabSets.length} 个多标签页集合`)) : (this.savedTabSets = [], this.log("📂 没有找到多标签页集合数据，初始化为空数组"));
    } catch (e) {
      this.warn("无法恢复多标签页集合:", e), this.savedTabSets = [];
    }
  }
  // 注意：以下方法已废弃，现在使用API配置存储
  // getStorageKey() 和 getClosedTabsStorageKey() 方法已被移除
  // 现在使用 OrcaStorageService 和 PLUGIN_STORAGE_KEYS 进行存储
  /**
   * 简单的字符串哈希函数
   */
  hashString(e) {
    let t = 0;
    for (let n = 0; n < e.length; n++) {
      const a = e.charCodeAt(n);
      t = (t << 5) - t + a, t = t & t;
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
    const n = (r) => {
      this.isDragging && (r.preventDefault(), r.stopPropagation(), this.drag(r));
    }, a = (r) => {
      document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", a), this.stopDrag();
    };
    document.addEventListener("mousemove", n), document.addEventListener("mouseup", a), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), n = 5, a = window.innerWidth - t.width - 5, r = 5, i = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(n, Math.min(a, this.verticalPosition.x)), this.verticalPosition.y = Math.max(r, Math.min(i, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(n, Math.min(a, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(r, Math.min(i, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const c = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = c.x + "px", this.tabContainer.style.top = c.y + "px", this.ensureClickableElements();
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
    try {
      const e = Ot(
        this.position,
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      );
      this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, await this.saveLayoutMode(), this.log(`💾 位置已保存: ${re(this.position, this.isVerticalMode)}`);
    } catch {
      this.warn("无法保存标签位置");
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode() {
    try {
      const e = {
        isVerticalMode: this.isVerticalMode,
        verticalWidth: this.verticalWidth,
        verticalPosition: this.verticalPosition,
        horizontalPosition: this.horizontalPosition,
        // 使用专门的水平位置属性
        isSidebarAlignmentEnabled: this.isSidebarAlignmentEnabled,
        isFloatingWindowVisible: this.isFloatingWindowVisible,
        showBlockTypeIcons: this.showBlockTypeIcons,
        showInHeadbar: this.showInHeadbar
      };
      await this.storageService.saveConfig(v.LAYOUT_MODE, e, "orca-tabs-plugin"), this.log(`💾 布局模式已保存: ${this.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${this.verticalWidth}px, 垂直位置: (${this.verticalPosition.x}, ${this.verticalPosition.y}), 水平位置: (${this.horizontalPosition.x}, ${this.horizontalPosition.y})`);
    } catch (e) {
      this.error("保存布局模式失败:", e);
    }
  }
  /**
   * 保存固定到顶部状态到API配置
   */
  async saveFixedToTopMode() {
    try {
      const e = {
        isFixedToTop: this.isFixedToTop
      };
      await this.storageService.saveConfig(v.FIXED_TO_TOP, e, "orca-tabs-plugin"), this.log(`💾 固定到顶部状态已保存: ${this.isFixedToTop ? "启用" : "禁用"}`);
    } catch (e) {
      this.error("保存固定到顶部状态失败:", e);
    }
  }
  /**
   * 确保所有元素都能正常点击（拖拽过程中调用）
   */
  ensureClickableElements() {
    document.body.style.pointerEvents = "auto", document.documentElement.style.pointerEvents = "auto", document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu").forEach((n) => {
      const a = n;
      a.style.pointerEvents === "none" && (a.style.pointerEvents = "auto");
    }), document.querySelectorAll('button, .btn, [role="button"]').forEach((n) => {
      const a = n;
      a.style.pointerEvents === "none" && (a.style.pointerEvents = "auto");
    });
  }
  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    document.querySelectorAll("*").forEach((n) => {
      const a = n;
      (a.style.cursor === "grabbing" || a.style.cursor === "grab") && (a.style.cursor = ""), a.style.userSelect === "none" && (a.style.userSelect = ""), a.style.pointerEvents === "none" && (a.style.pointerEvents = ""), a.style.touchAction === "none" && (a.style.touchAction = "");
    }), document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]").forEach((n) => {
      const a = n;
      a.style.cursor = "", a.style.userSelect = "", a.style.pointerEvents = "auto", a.style.touchAction = "";
    }), this.log("🔄 重置所有元素样式");
  }
  async restorePosition() {
    try {
      this.position = _(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Wt(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${re(this.position, this.isVerticalMode)}`);
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
        v.LAYOUT_MODE,
        "orca-tabs-plugin",
        q()
      );
      if (e) {
        const t = Bt(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = _(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.log(`📐 布局模式已恢复: ${Nt(t)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const t = q();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = _(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
      const t = q();
      this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = _(
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
        v.FIXED_TO_TOP,
        "orca-tabs-plugin",
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
    this.position = tn(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var r, i;
    const n = (r = this.tabContainer) == null ? void 0 : r.querySelectorAll(".orca-tabs-plugin .orca-tab");
    n == null || n.forEach((c) => c.removeAttribute("data-focused"));
    const a = (i = this.tabContainer) == null ? void 0 : i.querySelector(`[data-tab-id="${e}"]`);
    a ? (a.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${t}"`)) : this.verboseLog(`⚠️ 未找到标签元素: ${e}`);
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
  async checkCurrentPanelBlocks() {
    var p;
    const e = document.querySelector(".orca-panel.active");
    if (!e) {
      this.log("没有找到当前激活的面板");
      return;
    }
    const t = e.getAttribute("data-panel-id");
    if (!t) {
      this.log("激活面板没有 data-panel-id");
      return;
    }
    const n = this.getPanelIds().indexOf(t);
    n !== -1 && (this.currentPanelIndex = n, this.currentPanelId = t, this.verboseLog(`🔄 更新当前面板索引: ${n} (面板ID: ${t})`));
    const a = e.querySelector(".orca-hideable:not(.orca-hideable-hidden) .orca-block-editor[data-block-id]");
    if (!a) {
      this.log(`激活面板 ${t} 中没有找到可见的块编辑器`);
      return;
    }
    const r = a.getAttribute("data-block-id");
    if (!r) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    let i = this.getCurrentPanelTabs();
    i.length === 0 && (this.log("📋 当前面板没有标签数据，先扫描面板数据"), await this.scanCurrentPanelTabs(), i = this.getCurrentPanelTabs()), this.log(`🔍 检查标签页 ${r}，当前面板有 ${i.length} 个标签页:`, i.map((g) => `${g.title}(${g.blockId})`));
    const c = i.find((g) => g.blockId === r);
    if (c) {
      this.log(`📋 找到已存在的标签页: "${c.title}" (${r})`), this.closedTabs.has(r) && (this.closedTabs.delete(r), await this.saveClosedTabs(), this.log(`🔄 标签 "${c.title}" 重新激活，从已关闭列表中移除`)), this.updateFocusState(r, c.title), await this.updateTabsUI();
      return;
    }
    this.log(`📋 未找到标签页 ${r}，将更新当前聚焦的标签页内容`);
    const s = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tabs-plugin .orca-tab[data-focused="true"]');
    if (!s) {
      this.log("⚠️ 没有找到当前聚焦的标签页，无法更新");
      return;
    }
    const l = s.getAttribute("data-tab-id");
    if (!l) {
      this.log("⚠️ 聚焦的标签页没有 data-tab-id，无法更新");
      return;
    }
    const d = i.findIndex((g) => g.blockId === l);
    if (d === -1) {
      this.log("⚠️ 聚焦的标签页不在数组中，无法更新");
      return;
    }
    const h = await this.getTabInfo(r, t, d);
    if (!h) {
      this.log(`❌ 无法获取标签信息: ${r}`);
      return;
    }
    const u = i[d];
    i[d] = h, this.log(`🔄 更新聚焦标签页: "${u.title}" -> "${h.title}" (${r})`), this.setCurrentPanelTabs(i), await this.updateTabsUI();
  }
  observeChanges() {
    new MutationObserver(async (a) => {
      let r = !1, i = !1, c = !1, s = this.currentPanelIndex;
      a.forEach((l) => {
        if (l.type === "childList") {
          const d = l.target;
          if ((d.classList.contains("orca-panels-row") || d.closest(".orca-panels-row")) && (this.verboseLog("🔍 检测到面板行变化，检查新面板..."), i = !0), l.addedNodes.length > 0 && d.closest(".orca-panel")) {
            for (const u of l.addedNodes)
              if (u.nodeType === Node.ELEMENT_NODE) {
                const p = u;
                if (p.classList.contains("orca-block-editor") || p.querySelector(".orca-block-editor")) {
                  r = !0;
                  break;
                }
              }
          }
        }
        if (l.type === "attributes" && l.attributeName === "class") {
          const d = l.target;
          if (d.classList.contains("orca-panel") && (c = !0, d.classList.contains("orca-locked") && d.classList.contains("active") && (this.log("🔒 检测到锁定面板激活，聚焦上一个面板"), this.focusToPreviousPanel())), d.classList.contains("orca-hideable")) {
            const h = d.classList.contains("orca-hideable-hidden"), u = !d.classList.contains("orca-hideable-hidden");
            h && u && (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦状态变化"), r = !0);
          }
        }
      }), c && (await this.updateCurrentPanelIndex(), s !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${s} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), i && setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100), r && setTimeout(async () => {
        await this.checkForNewBlocks();
      }, 100);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class"]
    });
    let t = null;
    const n = async (a) => {
      const i = a.target.closest(".orca-hideable");
      i && (t && clearTimeout(t), t = window.setTimeout(async () => {
        i.classList.contains("orca-hideable-hidden") || (this.verboseLog("🎯 检测到 orca-hideable 元素聚焦变化"), await this.checkCurrentPanelBlocks()), t = null;
      }, 100));
    };
    document.addEventListener("click", n), document.addEventListener("focusin", n), document.addEventListener("keydown", (a) => {
      (a.key === "Tab" || a.key === "Enter" || a.key === " ") && (t && clearTimeout(t), t = window.setTimeout(n, 150));
    });
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
      const n = t[0], a = this.getPanelIds()[0];
      n && a && n !== a && (this.log(`🔄 第一个面板已变更: ${n} -> ${a}`), await this.handleFirstPanelChange(n, a)), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 更新持久化面板索引为: 0")), await this.createTabsUI();
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
        const n = this.getPanelIds().indexOf(t);
        if (n !== -1) {
          const a = this.currentPanelIndex;
          this.currentPanelIndex = n, this.currentPanelId = t, this.log(`🔄 面板索引更新: ${a} -> ${n} (面板ID: ${t})`), (!this.panelTabsData[n] || this.panelTabsData[n].length === 0) && (this.log(`🔍 面板 ${t} 没有数据，开始扫描`), await this.scanPanelTabsByIndex(n, t || "")), this.debouncedUpdateTabsUI();
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
    }, document.addEventListener("click", this.globalEventListener, { passive: !0 }), document.addEventListener("contextmenu", this.globalEventListener, { passive: !0 });
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
    const n = t - 1, a = e[n];
    if (!a) {
      this.log("⚠️ 未找到上一个面板");
      return;
    }
    this.log(`🔄 聚焦到上一个面板: ${a} (索引: ${n})`);
    const r = document.querySelector(`.orca-panel[data-panel-id="${a}"]`);
    if (!r) {
      this.log(`❌ 未找到面板元素: ${a}`);
      return;
    }
    const i = document.querySelector(".orca-panel.active");
    i && i.classList.remove("active"), r.classList.add("active"), this.currentPanelIndex = n, this.currentPanelId = a, this.debouncedUpdateTabsUI(), this.log(`✅ 已成功聚焦到上一个面板: ${a}`);
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
    const t = e.target, n = this.getBlockRefId(t);
    if (n) {
      e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), e.ctrlKey || e.metaKey ? (this.log(`🔗 检测到 Ctrl+点击 块引用: ${n}，将在后台新建标签页`), await this.openInNewTab(n)) : (this.log(`🔗 检测到直接点击 块引用: ${n}，将替换当前标签页`), await this.createBlockAfterFocused(n));
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
    const t = e.target, n = this.getBlockRefId(t);
    n && (this.log(`🔗 检测到块引用右键菜单: ${n}`), this.currentContextBlockRefId = n, setTimeout(() => {
      this.enhanceBlockRefContextMenu(n);
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
    if (Array.from(e).filter((s) => {
      const l = s.getAttribute("data-panel-id");
      return l && !l.startsWith("_");
    }).length === this.getPanelIds().length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
      this.verboseLog("📋 面板数量未变化，跳过面板发现");
      return;
    }
    const n = [...this.getPanelIds()], a = this.getPanelIds()[0] || null;
    await this.discoverPanels();
    const r = this.getPanelIds()[0] || null, i = cn(n, this.getPanelIds());
    i && (this.log(`📋 面板列表发生变化: ${n.length} -> ${this.getPanelIds().length}`), this.log(`📋 旧面板列表: [${n.join(", ")}]`), this.log(`📋 新面板列表: [${this.getPanelIds().join(", ")}]`), this.log(`📋 持久化面板变更: ${a} -> ${r}`), a !== r && (this.log(`🔄 持久化面板已变更: ${a} -> ${r}`), await this.handlePersistentPanelChange(a, r))), this.currentPanelId && !this.getPanelIds().includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId || ""} 已关闭，切换到第一个面板`), this.getPanelIds().length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId || ""}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
    const c = document.querySelector(".orca-panel.active");
    if (c) {
      const s = c.getAttribute("data-panel-id");
      if (s && !s.startsWith("_") && (s !== this.currentPanelId || i)) {
        const l = this.currentPanelIndex, d = this.getPanelIds().indexOf(s);
        d !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId || ""} -> ${s} (索引: ${l} -> ${d})`), this.currentPanelIndex = d, this.currentPanelId = s, await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI());
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
        const n = this.panelTabsData[0] || [];
        n.length > 0 ? (this.log(`✅ 新持久化面板 ${t} (索引: 0) 已有标签数据，直接使用`), this.panelTabsData[0] = [...n]) : (this.log(`🔍 新持久化面板 ${t} (索引: 0) 没有标签数据，重新扫描`), await this.scanPersistentPanel(t)), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的标签"), await this.updateTabsUI(), this.log(`✅ 持久化面板变更处理完成，当前有 ${this.getCurrentPanelTabs().length} 个标签`);
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
    const n = t.querySelectorAll(".orca-hideable"), a = [];
    let r = 0;
    for (const i of n) {
      const c = i.querySelector(".orca-block-editor");
      if (!c) continue;
      const s = c.getAttribute("data-block-id");
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
    const n = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!n) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const a = n.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let i = 0;
    this.log(`🔍 扫描面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const s of a) {
      const l = s.getAttribute("data-block-id");
      if (!l) continue;
      const d = await this.getTabInfo(l, t, i++);
      d && (r.push(d), this.log(`📋 找到标签页: ${d.title} (${l})`));
    }
    e >= this.panelTabsData.length && this.adjustPanelTabsDataSize(), this.panelTabsData[e] = [...r], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${r.length} 个标签页`);
    const c = e === 0 ? v.FIRST_PANEL_TABS : `panel_${e + 1}_tabs`;
    await this.savePanelTabsByKey(c, r);
  }
  /**
   * 保存指定面板的标签页数据
   */
  async savePanelTabs(e, t) {
    try {
      await this.storageService.saveConfig(`panel_${e}_tabs`, t, "orca-tabs-plugin"), this.verboseLog(`💾 已保存面板 ${e} 的标签页数据: ${t.length} 个`);
    } catch (n) {
      this.warn(`❌ 保存面板 ${e} 标签页数据失败:`, n);
    }
  }
  /**
   * 基于存储键保存面板标签页数据
   */
  async savePanelTabsByKey(e, t) {
    try {
      await this.storageService.saveConfig(e, t, "orca-tabs-plugin"), this.verboseLog(`💾 已保存 ${e} 的标签页数据: ${t.length} 个`);
    } catch (n) {
      this.warn(`❌ 保存 ${e} 标签页数据失败:`, n);
    }
  }
  /**
   * 合并当前聚焦面板的标签页到已加载的数据中
   */
  async mergeCurrentPanelTabs(e, t) {
    const n = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!n) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const a = n.querySelectorAll(".orca-block-editor[data-block-id]"), r = [];
    let i = 0;
    this.log(`🔍 扫描当前聚焦面板 ${t}，找到 ${a.length} 个块编辑器`);
    for (const l of a) {
      const d = l.getAttribute("data-block-id");
      if (!d) continue;
      const h = await this.getTabInfo(d, t, i++);
      h && (r.push(h), this.log(`📋 找到当前标签页: ${h.title} (${d})`));
    }
    const c = this.panelTabsData[e] || [];
    this.log(`📋 已加载的标签页: ${c.length} 个，当前标签页: ${r.length} 个`);
    const s = [...c];
    for (const l of r)
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
    const t = e.querySelectorAll(".orca-hideable"), n = [];
    let a = 0;
    for (const i of t) {
      const c = i.querySelector(".orca-block-editor");
      if (!c) continue;
      const s = c.getAttribute("data-block-id");
      if (!s) continue;
      const l = await this.getTabInfo(s, this.currentPanelId || "", a++);
      l && n.push(l);
    }
    this.getCurrentPanelTabs(), this.panelTabsData[this.currentPanelIndex] = [...n], this.log(`📋 面板 ${this.currentPanelId || ""} (索引: ${this.currentPanelIndex}) 扫描了 ${n.length} 个标签页`);
    const r = this.currentPanelIndex === 0 ? v.FIRST_PANEL_TABS : `panel_${this.currentPanelIndex + 1}_tabs`;
    await this.savePanelTabsByKey(r, n);
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(e, t) {
    this.log(`🔄 处理第一个面板变更: ${e} -> ${t}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId || ""}, currentPanelIndex=${this.currentPanelIndex}`);
    const n = this.getCurrentPanelTabs();
    this.log(`📋 当前面板有 ${n.length} 个标签页`), n.length > 0 ? (this.log(`📋 迁移当前面板的 ${n.length} 个标签页到持久化存储`), this.panelTabsData[0] = [...n], this.log("🔄 持久化面板索引已简化，不再需要更新")) : (this.log("🗑️ 当前面板没有标签数据，清空并重新扫描"), this.panelTabsData[0] = [], await this.scanFirstPanel()), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，持久化存储了 ${this.getCurrentPanelTabs().length} 个标签页`), this.log("✅ 持久化标签页:", this.getCurrentPanelTabs().map((a) => `${a.title}(${a.blockId})`));
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
    this.log("🔄 开始重置插件缓存..."), this.panelTabsData[0] = [], this.closedTabs.clear();
    try {
      await this.storageService.removeConfig(v.FIRST_PANEL_TABS), await this.storageService.removeConfig(v.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
    } catch (e) {
      this.warn("删除API配置缓存失败:", e);
    }
    this.getPanelIds().length > 0 && (this.log("🔍 重新扫描第一个面板..."), await this.scanFirstPanel(), await this.saveFirstPanelTabs()), await this.updateTabsUI(), this.log("✅ 插件缓存重置完成");
  }
  destroy() {
    this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
    const e = document.getElementById("orca-tabs-drag-styles");
    e && e.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.dragOverListener && (document.removeEventListener("dragover", this.dragOverListener), this.dragOverListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null;
  }
  /**
   * 显示最近关闭的标签页菜单
   */
  async showRecentlyClosedTabsMenu(e) {
    if (this.recentlyClosedTabs.length === 0) {
      orca.notify("info", "没有最近关闭的标签页");
      return;
    }
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, n = this.recentlyClosedTabs.map((a, r) => ({
      label: `${a.title}`,
      icon: a.icon || this.getBlockTypeIcon(a.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(a, r)
    }));
    n.push({
      label: "清空最近关闭列表",
      icon: "ti ti-trash",
      onClick: () => this.clearRecentlyClosedTabs()
    }), this.createRecentlyClosedTabsMenu(n, t);
  }
  /**
   * 创建最近关闭标签页菜单
   */
  createRecentlyClosedTabsMenu(e, t) {
    var d, h;
    const n = document.querySelector(".recently-closed-tabs-menu");
    n && n.remove();
    const a = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", r = document.createElement("div");
    r.className = "recently-closed-tabs-menu", r.style.cssText = `
      position: fixed;
      left: ${t.x}px;
      top: ${t.y}px;
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
    `, e.forEach((u, p) => {
      if (u.label === "---") {
        const b = document.createElement("div");
        b.style.cssText = `
          height: 1px;
          margin: 4px 8px;
        `, r.appendChild(b);
        return;
      }
      const g = document.createElement("div");
      if (g.className = "recently-closed-menu-item", g.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${a ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, u.icon) {
        const b = document.createElement("div");
        if (b.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${a ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, u.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = u.icon, b.appendChild(x);
        } else
          b.textContent = u.icon;
        g.appendChild(b);
      }
      const m = document.createElement("span");
      m.textContent = u.label, m.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, g.appendChild(m), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        u.onClick(), r.remove();
      }), r.appendChild(g);
    }), document.body.appendChild(r);
    const i = r.getBoundingClientRect(), c = window.innerWidth, s = window.innerHeight;
    i.right > c && (r.style.left = `${c - i.width - 10}px`), i.bottom > s && (r.style.top = `${s - i.height - 10}px`);
    const l = (u) => {
      r.contains(u.target) || (r.remove(), document.removeEventListener("click", l), document.removeEventListener("contextmenu", l));
    };
    setTimeout(() => {
      document.addEventListener("click", l), document.addEventListener("contextmenu", l);
    }, 0);
  }
  /**
   * 恢复最近关闭的标签页
   */
  async restoreRecentlyClosedTab(e, t) {
    try {
      this.recentlyClosedTabs.splice(t, 1), await this.saveRecentlyClosedTabs(), this.closedTabs.delete(e.blockId), await this.saveClosedTabs(), await this.addTabToPanel(e.blockId, "end", !0), this.log(`🔄 已恢复最近关闭的标签页: "${e.title}"`), orca.notify("success", `已恢复标签页: ${e.title}`);
    } catch (n) {
      this.error("恢复最近关闭标签页失败:", n), orca.notify("error", "恢复标签页失败");
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 100, y: 100 }, n = [];
    this.previousTabSet && this.previousTabSet.length > 0 && (n.push({
      label: `回到上一个标签集合 (${this.previousTabSet.length}个标签)`,
      icon: "ti ti-arrow-left",
      onClick: () => this.restorePreviousTabSet()
    }), n.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    })), this.savedTabSets.forEach((a, r) => {
      n.push({
        label: `${a.name} (${a.tabs.length}个标签)`,
        icon: a.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(a, r)
      });
    }), n.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), n.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    }), this.createRecentlyClosedTabsMenu(n, t);
  }
  /**
   * 显示多标签页保存菜单
   */
  async showMultiTabSavingMenu(e) {
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, n = [];
    n.push({
      label: "保存当前标签页",
      icon: "ti ti-plus",
      onClick: () => this.saveCurrentTabs()
    }), this.savedTabSets.length > 0 && (n.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), this.savedTabSets.forEach((a, r) => {
      n.push({
        label: `${a.name} (${a.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(a, r)
      });
    }), n.push({
      label: "---",
      icon: "",
      onClick: () => {
      }
    }), n.push({
      label: "管理保存的标签页",
      icon: "ti ti-settings",
      onClick: () => this.manageSavedTabSets()
    })), this.createMultiTabSavingMenu(n, t);
  }
  /**
   * 创建多标签页保存菜单
   */
  createMultiTabSavingMenu(e, t) {
    var d, h;
    const n = document.querySelector(".multi-tab-saving-menu");
    n && n.remove();
    const a = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", r = document.createElement("div");
    r.className = "multi-tab-saving-menu", r.style.cssText = `
      position: fixed;
      left: ${t.x}px;
      top: ${t.y}px;
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
    `, e.forEach((u, p) => {
      if (u.label === "---") {
        const b = document.createElement("div");
        b.style.cssText = `
          height: 1px;
          background: var(--orca-color-border);
          margin: 4px 0;
        `, r.appendChild(b);
        return;
      }
      const g = document.createElement("div");
      if (g.className = "multi-tab-saving-menu-item", g.style.cssText = `
        display: flex;
        align-items: center;
        padding: var(--orca-spacing-sm);
        cursor: pointer;
        font-size: 14px;
        color: ${a ? "#ffffff" : "#333"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, u.icon) {
        const b = document.createElement("div");
        if (b.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${a ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, u.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = u.icon, b.appendChild(x);
        } else
          b.textContent = u.icon;
        g.appendChild(b);
      }
      const m = document.createElement("span");
      m.textContent = u.label, m.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, g.appendChild(m), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "var(--orca-color-menu-highlight)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        u.onClick(), r.remove();
      }), r.appendChild(g);
    }), document.body.appendChild(r);
    const i = r.getBoundingClientRect(), c = window.innerWidth, s = window.innerHeight;
    i.right > c && (r.style.left = `${c - i.width - 10}px`), i.bottom > s && (r.style.top = `${s - i.height - 10}px`);
    const l = (u) => {
      r.contains(u.target) || (r.remove(), document.removeEventListener("click", l), document.removeEventListener("contextmenu", l));
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
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, n.textContent = "保存标签页集合", t.appendChild(n);
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
    const i = document.createElement("button");
    i.className = "orca-button orca-button-secondary", i.textContent = "创建新标签组", i.style.cssText = "flex: 1;";
    const c = document.createElement("button");
    c.className = "orca-button", c.textContent = "更新已有标签组", c.style.cssText = "flex: 1;";
    let s = !1;
    const l = () => {
      s = !1, i.className = "orca-button orca-button-secondary", i.style.cssText = "flex: 1;", c.className = "orca-button", c.style.cssText = "flex: 1;", h.style.display = "block", g.style.display = "none", P();
    }, d = () => {
      s = !0, c.className = "orca-button orca-button-secondary", c.style.cssText = "flex: 1;", i.className = "orca-button", i.style.cssText = "flex: 1;", h.style.display = "none", g.style.display = "block", P();
    };
    i.onclick = l, c.onclick = d, r.appendChild(i), r.appendChild(c), a.appendChild(r);
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
    }), p.addEventListener("input", (k) => {
    }), h.appendChild(p);
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
    const x = document.createElement("option");
    x.value = "", x.textContent = "请选择标签页集合...", b.appendChild(x), this.savedTabSets.forEach((k, W) => {
      const B = document.createElement("option");
      B.value = W.toString(), B.textContent = `${k.name} (${k.tabs.length}个标签)`, b.appendChild(B);
    }), g.appendChild(b), a.appendChild(h), a.appendChild(g), t.appendChild(a);
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
    const C = document.createElement("button");
    C.className = "orca-button orca-button-primary", C.textContent = "保存", C.style.cssText = "", C.addEventListener("mouseenter", () => {
      C.style.backgroundColor = "#2563eb";
    }), C.addEventListener("mouseleave", () => {
      C.style.backgroundColor = "var(--orca-color-primary-5)";
    });
    const P = () => {
      C.textContent = s ? "更新" : "保存";
    };
    C.onclick = async () => {
      if (s) {
        const k = parseInt(b.value);
        if (isNaN(k) || k < 0 || k >= this.savedTabSets.length) {
          orca.notify("warn", "请选择要更新的标签页集合");
          return;
        }
        t.remove(), await this.performUpdateTabSet(k);
      } else {
        const k = p.value.trim();
        if (!k) {
          orca.notify("warn", "请输入名称");
          return;
        }
        t.remove(), await this.performSaveTabSet(k);
      }
    }, y.appendChild(w), y.appendChild(C), t.appendChild(y), document.body.appendChild(t), setTimeout(() => {
      p.focus(), p.select();
    }, 100), p.addEventListener("keydown", (k) => {
      k.key === "Enter" ? (k.preventDefault(), C.click()) : k.key === "Escape" && (k.preventDefault(), w.click());
    });
    const $ = (k) => {
      t.contains(k.target) || (t.remove(), document.removeEventListener("click", $));
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
      const t = this.getCurrentPanelTabs(), n = {
        id: `tabset_${Date.now()}`,
        name: e,
        tabs: [...t],
        // 深拷贝当前标签页
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      this.savedTabSets.push(n), await this.saveSavedTabSets(), this.log(`💾 已保存标签页集合: "${e}" (${t.length}个标签)`), orca.notify("success", `已保存标签页集合: ${e}`);
    } catch (t) {
      this.error("保存标签页集合失败:", t), orca.notify("error", "保存失败");
    }
  }
  /**
   * 执行更新已有标签页集合
   */
  async performUpdateTabSet(e) {
    try {
      const t = this.getCurrentPanelTabs(), n = this.savedTabSets[e];
      if (!n) {
        orca.notify("error", "标签页集合不存在");
        return;
      }
      n.tabs = [...t], n.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已更新标签页集合: "${n.name}" (${t.length}个标签)`), orca.notify("success", `已更新标签页集合: ${n.name}`);
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
    const n = document.createElement("div");
    n.className = "add-to-tabgroup-dialog", n.style.cssText = `
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
    `, n.addEventListener("click", (p) => {
      p.stopPropagation();
    });
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, a.textContent = "添加到已有标签组", n.appendChild(a);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 0 20px;
    `;
    const i = document.createElement("label");
    i.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--orca-color-text-1);
    `, i.textContent = `将标签页 "${e.title}" 添加到:`, r.appendChild(i);
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
    s.value = "", s.textContent = "请选择标签组...", c.appendChild(s), this.savedTabSets.forEach((p, g) => {
      const m = document.createElement("option");
      m.value = g.toString(), m.textContent = `${p.name} (${p.tabs.length}个标签)`, c.appendChild(m);
    }), r.appendChild(c), n.appendChild(r);
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
      n.remove(), this.manageSavedTabSets();
    };
    const h = document.createElement("button");
    h.className = "orca-button orca-button-primary", h.textContent = "添加", h.style.cssText = "", h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#2563eb";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "var(--orca-color-primary-5)";
    }), h.onclick = async () => {
      const p = parseInt(c.value);
      if (isNaN(p) || p < 0 || p >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      n.remove(), await this.addTabToGroup(e, p);
    }, l.appendChild(d), l.appendChild(h), n.appendChild(l), document.body.appendChild(n), setTimeout(() => {
      c.focus();
    }, 100), c.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), h.click()) : p.key === "Escape" && (p.preventDefault(), d.click());
    });
    const u = (p) => {
      n.contains(p.target) || (n.remove(), document.removeEventListener("click", u));
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
      const n = this.savedTabSets[t];
      if (!n) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (n.tabs.find((r) => r.blockId === e.blockId)) {
        orca.notify("warn", "该标签页已在此标签组中");
        return;
      }
      n.tabs.push({ ...e }), n.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`➕ 已将标签页 "${e.title}" 添加到标签组: "${n.name}"`), orca.notify("success", `已添加到标签组: ${n.name}`);
    } catch (n) {
      this.error("添加标签页到标签组失败:", n), orca.notify("error", "添加失败");
    }
  }
  /**
   * 加载保存的标签页集合
   */
  async loadSavedTabSet(e, t) {
    try {
      const n = this.getCurrentPanelTabs();
      this.previousTabSet = [...n], n.length = 0;
      for (const a of e.tabs) {
        const r = { ...a, panelId: this.currentPanelId || "" };
        n.push(r);
      }
      this.syncCurrentTabsToStorage(n), await this.saveCurrentPanelTabs(), this.debouncedUpdateTabsUI(), e.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已加载标签页集合: "${e.name}" (${e.tabs.length}个标签)`), orca.notify("success", `已加载标签页集合: ${e.name}`);
    } catch (n) {
      this.error("加载标签页集合失败:", n), orca.notify("error", "加载失败");
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
      for (const n of this.previousTabSet) {
        const a = { ...n, panelId: this.currentPanelId || "" };
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
  renderSortableTabs(e, t, n) {
    var i, c;
    const a = document.documentElement.classList.contains("dark") || ((c = (i = window.orca) == null ? void 0 : i.state) == null ? void 0 : c.themeMode) === "dark";
    e.innerHTML = "";
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
      `, h.innerHTML = "⋮⋮", d.appendChild(h), s.icon) {
        const b = document.createElement("div");
        if (b.style.cssText = `
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
          const x = document.createElement("i");
          x.className = s.icon, b.appendChild(x);
        } else
          b.textContent = s.icon;
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
      let p = `
        <div style="font-size: 14px; color: var(--orca-color-text-1); font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${s.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${s.blockId}</div>
      `;
      u.innerHTML = p, d.appendChild(u);
      const g = document.createElement("div");
      g.style.cssText = `
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
      `, m.textContent = (l + 1).toString(), g.appendChild(m), d.appendChild(g), d.addEventListener("dragstart", (b) => {
        console.log("拖拽开始，索引:", l), r = l, b.dataTransfer.setData("text/plain", l.toString()), b.dataTransfer.setData("application/json", JSON.stringify(s)), b.dataTransfer.effectAllowed = "move", d.style.opacity = "0.5", d.style.transform = "rotate(2deg)";
      }), d.addEventListener("dragend", (b) => {
        d.style.opacity = "1", d.style.transform = "rotate(0deg)", r = -1;
      }), d.addEventListener("dragover", (b) => {
        b.preventDefault(), b.dataTransfer.dropEffect = "move", r !== -1 && r !== l && (d.style.borderColor = "var(--orca-color-primary-5)", d.style.backgroundColor = "rgba(59, 130, 246, 0.1)");
      }), d.addEventListener("dragleave", (b) => {
        d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)";
      }), d.addEventListener("drop", (b) => {
        b.preventDefault(), b.stopPropagation();
        const x = parseInt(b.dataTransfer.getData("text/plain")), y = l;
        if (d.style.borderColor = "#e0e0e0", d.style.backgroundColor = "var(--orca-color-bg-1)", x !== y && x >= 0) {
          const w = t[x];
          t.splice(x, 1), t.splice(y, 0, w), this.renderSortableTabs(e, t);
          const C = this.savedTabSets.find((P) => P.tabs === t);
          C && (C.tabs = [...t], C.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
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
    try {
      const e = await this.storageService.getConfig(v.WORKSPACES);
      e && Array.isArray(e) && (this.workspaces = e, this.log(`📁 已加载 ${this.workspaces.length} 个工作区`)), await this.clearCurrentWorkspace();
      const t = await this.storageService.getConfig(v.ENABLE_WORKSPACES);
      typeof t == "boolean" && (this.enableWorkspaces = t);
    } catch (e) {
      this.error("加载工作区数据失败:", e);
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces() {
    try {
      await this.storageService.saveConfig(v.WORKSPACES, this.workspaces, "orca-tabs-plugin"), await this.storageService.saveConfig(v.CURRENT_WORKSPACE, this.currentWorkspace, "orca-tabs-plugin"), await this.storageService.saveConfig(v.ENABLE_WORKSPACES, this.enableWorkspaces, "orca-tabs-plugin"), this.log("💾 工作区数据已保存");
    } catch (e) {
      this.error("保存工作区数据失败:", e);
    }
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    try {
      this.currentWorkspace = null, await this.storageService.saveConfig(v.CURRENT_WORKSPACE, null, "orca-tabs-plugin"), this.log("📁 已清除当前工作区状态");
    } catch (e) {
      this.error("清除当前工作区状态失败:", e);
    }
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
    const t = document.documentElement.classList.contains("dark") || ((m = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : m.themeMode) === "dark", n = document.createElement("div");
    n.className = "save-workspace-dialog", n.style.cssText = `
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
    const i = document.createElement("div");
    i.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, i.textContent = "工作区名称:";
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
      n.remove(), this.showWorkspaceMenu();
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
      const b = c.value.trim();
      if (!b) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((x) => x.name === b)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(b, l.value.trim()), n.remove();
    }, d.appendChild(h), d.appendChild(u), a.appendChild(r), a.appendChild(i), a.appendChild(c), a.appendChild(s), a.appendChild(l), a.appendChild(d), n.appendChild(a), document.body.appendChild(n), c.focus(), n.addEventListener("click", (b) => {
      b.target === n && n.remove();
    });
    const p = (b) => {
      b.key === "Escape" && (n.remove(), document.removeEventListener("keydown", p));
    };
    document.addEventListener("keydown", p);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const n = this.getCurrentPanelTabs(), a = this.getCurrentActiveTab(), r = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: n,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: a ? a.blockId : void 0
      };
      this.workspaces.push(r), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${n.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (n) {
      this.error("保存工作区失败:", n), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(e) {
    var d, h;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const n = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", a = document.createElement("div");
    a.className = "workspace-menu", a.style.cssText = `
      position: fixed;
      top: ${e ? e.clientY + 10 : 60}px;
      left: ${e ? e.clientX : 20}px;
      background: var(--orca-color-bg-1);
      border: 1px solid var(--sakura-dark-surface0);
      border-radius: var(--orca-radius-md);
      box-shadow: var(--orca-shadow-menu);
      z-index: ${this.getNextDialogZIndex()};
      min-width: 200px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const r = document.createElement("div");
    r.style.cssText = `
      padding: var(--orca-spacing-sm);
      border-bottom: 1px solid var(--orca-color-border);
      font-size: 14px;
      font-weight: 600;
      color: ${n ? "#ffffff" : "#333"};
    `, r.textContent = "工作区";
    const i = document.createElement("div");
    i.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--orca-color-border);
      color: ${n ? "#ffffff" : "#333"};
    `, i.innerHTML = `
      <i class="ti ti-plus" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
      <span>保存当前工作区</span>
    `, i.onclick = () => {
      a.remove(), this.saveCurrentWorkspace();
    };
    const c = document.createElement("div");
    if (c.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const u = document.createElement("div");
      u.style.cssText = `
        padding: var(--orca-spacing-sm);
        color: ${n ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, u.textContent = "暂无工作区", c.appendChild(u);
    } else
      this.workspaces.forEach((u) => {
        const p = document.createElement("div");
        p.style.cssText = `
          padding: var(--orca-spacing-sm);
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid var(--orca-color-border);
          color: ${n ? "#ffffff" : "#333"};
          ${this.currentWorkspace === u.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const g = u.icon || "ti ti-folder";
        p.innerHTML = `
          <i class="${g}" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: ${n ? "#ffffff" : "#333"};"">${u.name}</div>
            ${u.description ? `<div style="font-size: 12px; color: ${n ? "#999" : "#666"}; margin-top: 2px;">${u.description}</div>` : ""}
            <div style="font-size: 11px; color: ${n ? "#777" : "#999"}; margin-top: 2px;">${u.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === u.id ? '<i class="ti ti-check" style="font-size: 14px; color: var(--orca-color-primary-5);"></i>' : ""}
        `, p.onclick = () => {
          a.remove(), this.switchToWorkspace(u.id);
        }, c.appendChild(p);
      });
    const s = document.createElement("div");
    s.style.cssText = `
      padding: var(--orca-spacing-sm);
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${n ? "#ffffff" : "#333"};
    `, s.innerHTML = `
      <i class="ti ti-settings" style="font-size: 14px; color: ${n ? "#999" : "#666"};"></i>
      <span>管理工作区</span>
    `, s.onclick = () => {
      a.remove(), this.manageWorkspaces();
    }, a.appendChild(r), a.appendChild(i), a.appendChild(c), a.appendChild(s), document.body.appendChild(a);
    const l = (u) => {
      a.contains(u.target) || (a.remove(), document.removeEventListener("click", l));
    };
    setTimeout(() => {
      document.addEventListener("click", l);
    }, 100);
  }
  /**
   * 切换到指定工作区
   */
  async switchToWorkspace(e) {
    try {
      const t = this.workspaces.find((n) => n.id === e);
      if (!t) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace && await this.saveCurrentTabsToWorkspace(), this.currentWorkspace = e, await this.saveWorkspaces(), await this.storageService.saveConfig(v.CURRENT_WORKSPACE, e, "orca-tabs-plugin"), await this.replaceCurrentTabsWithWorkspace(t.tabs, t), this.log(`🔄 已切换到工作区: "${t.name}"`), orca.notify("success", `已切换到工作区: ${t.name}`);
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
      const n = [];
      for (const r of e)
        try {
          const i = await this.getTabInfo(r.blockId, this.currentPanelId || "", n.length);
          i ? (i.isPinned = r.isPinned, i.order = r.order, i.scrollPosition = r.scrollPosition, n.push(i)) : n.push(r);
        } catch (i) {
          this.warn(`无法更新标签页信息 ${r.title}:`, i), n.push(r);
        }
      this.panelTabsData[0] = n, this.panelTabsData.length <= 0 && (this.panelTabsData[0] = []), this.panelTabsData[0] = [...n], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.getPanelIds()[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const a = t.lastActiveTabId;
      setTimeout(async () => {
        if (n.length > 0) {
          let r = n[0];
          if (a) {
            const i = n.find((c) => c.blockId === a);
            i ? (r = i, this.log(`🎯 导航到工作区中最后激活的标签页: ${r.title} (ID: ${a})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${r.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${r.title}`);
          await orca.nav.goTo("block", { blockId: parseInt(r.blockId) }, this.currentPanelId || "");
        }
      }, 100), this.log(`📋 已替换当前标签页，共 ${n.length} 个标签，块类型图标已更新`);
    } catch (n) {
      throw this.error("替换标签页失败:", n), n;
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
    const t = this.workspaces.find((n) => n.id === this.currentWorkspace);
    t && (t.lastActiveTabId = e.blockId, t.updatedAt = Date.now(), await this.saveWorkspaces(), this.log(`🔄 实时更新工作区最后激活标签页: ${e.title} (ID: ${e.blockId})`));
  }
  /**
   * 保存当前标签页到当前工作区
   */
  async saveCurrentTabsToWorkspace() {
    if (!this.currentWorkspace) return;
    const e = this.workspaces.find((t) => t.id === this.currentWorkspace);
    if (e) {
      const t = this.getCurrentPanelTabs(), n = this.getCurrentActiveTab();
      e.tabs = t, e.lastActiveTabId = n ? n.blockId : void 0, e.updatedAt = Date.now(), await this.saveWorkspaces();
    }
  }
  /**
   * 管理工作区
   */
  manageWorkspaces() {
    var d, h;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((h = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : h.themeMode) === "dark", n = document.createElement("div");
    n.className = "manage-workspaces-dialog", n.style.cssText = `
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
    const i = document.createElement("div");
    if (i.style.cssText = `
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
      `, u.textContent = "暂无工作区", i.appendChild(u);
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
        `, i.appendChild(p);
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
      n.remove();
    }, c.appendChild(s), a.appendChild(r), a.appendChild(i), a.appendChild(c), n.appendChild(a), document.body.appendChild(n), n.querySelectorAll(".delete-workspace-btn").forEach((u) => {
      u.addEventListener("click", async (p) => {
        const g = p.target.getAttribute("data-workspace-id");
        g && (await this.deleteWorkspace(g), n.remove(), this.manageWorkspaces());
      });
    }), n.addEventListener("click", (u) => {
      u.target === n && n.remove();
    });
  }
  /**
   * 删除工作区
   */
  async deleteWorkspace(e) {
    try {
      const t = this.workspaces.find((n) => n.id === e);
      if (!t) {
        orca.notify("error", "工作区不存在");
        return;
      }
      this.currentWorkspace === e && (this.currentWorkspace = null), this.workspaces = this.workspaces.filter((n) => n.id !== e), await this.saveWorkspaces(), this.log(`🗑️ 工作区已删除: "${t.name}"`), orca.notify("success", `工作区已删除: ${t.name}`);
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
    const n = document.querySelector(".tabset-details-dialog");
    n && n.remove();
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
    const i = document.createElement("div");
    i.style.cssText = `
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
    `, i.appendChild(c), e.tabs.length === 0) {
      const p = document.createElement("div");
      p.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `, p.textContent = "该标签集合为空", i.appendChild(p);
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
      const m = document.createElement("span");
      m.textContent = "包含的标签 (可拖拽排序):", g.appendChild(m);
      const b = document.createElement("span");
      b.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, b.textContent = "拖拽调整顺序", g.appendChild(b), p.appendChild(g);
      const x = document.createElement("div");
      x.className = "sortable-tabs-container", x.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: var(--orca-radius-md);
        transition: border-color 0.3s ease;
      `, this.renderSortableTabs(x, [...e.tabs], e), p.appendChild(x), i.appendChild(p);
    }
    a.appendChild(i);
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
      a.remove(), t && this.manageSavedTabSets();
    }, s.appendChild(l), a.appendChild(s), document.body.appendChild(a);
    const d = (p) => {
      a.contains(p.target) || (a.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, n) {
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
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, i.textContent = "重命名标签集合", r.appendChild(i);
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
    }), c.appendChild(l), r.appendChild(c);
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
      if (this.savedTabSets.find((b) => b.name === g && b.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = g, e.updatedAt = Date.now(), await this.saveSavedTabSets(), r.remove(), n.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(h), d.appendChild(u), r.appendChild(d), document.body.appendChild(r), setTimeout(() => {
      l.focus(), l.select();
    }, 100), l.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), u.click()) : g.key === "Escape" && (g.preventDefault(), h.click());
    });
    const p = (g) => {
      r.contains(g.target) || (r.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, n, a) {
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
    const i = n.textContent;
    n.innerHTML = "", n.appendChild(r), r.addEventListener("click", (d) => {
      d.stopPropagation();
    }), r.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), r.focus(), r.select();
    const c = async () => {
      const d = r.value.trim();
      if (!d) {
        n.textContent = i;
        return;
      }
      if (d === e.name) {
        n.textContent = i;
        return;
      }
      if (this.savedTabSets.find((u) => u.name === d && u.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), n.textContent = i;
        return;
      }
      e.name = d, e.updatedAt = Date.now(), await this.saveSavedTabSets(), n.textContent = d, orca.notify("success", "重命名成功");
    }, s = () => {
      n.textContent = i;
    };
    r.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), c()) : d.key === "Escape" && (d.preventDefault(), s());
    });
    let l = null;
    r.addEventListener("blur", () => {
      l && clearTimeout(l), l = window.setTimeout(() => {
        c();
      }, 100);
    }), r.addEventListener("focus", () => {
      l && (clearTimeout(l), l = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, n, a, r) {
    const i = document.createElement("div");
    i.style.cssText = `
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
    `, c.textContent = "选择图标", i.appendChild(c);
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
      const b = document.createElement("div");
      if (b.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, g.value.startsWith("ti ti-")) {
        const y = document.createElement("i");
        y.className = g.value, b.appendChild(y);
      } else
        b.textContent = g.icon;
      const x = document.createElement("div");
      x.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, x.textContent = g.name, m.appendChild(b), m.appendChild(x), m.addEventListener("click", async (y) => {
        y.stopPropagation(), e.icon = g.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), a(), i.remove(), r && r.focus(), orca.notify("success", "图标已更新");
      }), m.addEventListener("mouseenter", () => {
        m.style.backgroundColor = "#f5f5f5", m.style.borderColor = "var(--orca-color-primary-5)";
      }), m.addEventListener("mouseleave", () => {
        m.style.backgroundColor = e.icon === g.value ? "#e3f2fd" : "white", m.style.borderColor = "#e0e0e0";
      }), d.appendChild(m);
    }), s.appendChild(d), i.appendChild(s);
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
      g.stopPropagation(), i.remove(), r && r.focus();
    }, h.appendChild(u), i.appendChild(h), document.body.appendChild(i);
    const p = (g) => {
      i.contains(g.target) || (g.stopPropagation(), i.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p), r && r.focus());
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
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: var(--orca-color-text-1);
      margin-bottom: 16px;
    `, n.textContent = "管理保存的标签页集合", t.appendChild(n);
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
      `, u.title = "点击编辑图标";
      const p = () => {
        if (u.innerHTML = "", s.icon)
          if (s.icon.startsWith("ti ti-")) {
            const P = document.createElement("i");
            P.className = s.icon, u.appendChild(P);
          } else
            u.textContent = s.icon;
        else
          u.textContent = "📁";
      };
      p(), u.addEventListener("click", () => {
        this.editTabSetIcon(s, l, u, p, t);
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
      `, m.textContent = s.name, m.title = "点击编辑名称", m.addEventListener("click", () => {
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
      `, b.textContent = `${s.tabs.length}个标签 • ${new Date(s.updatedAt).toLocaleString()}`, g.appendChild(m), g.appendChild(b), h.appendChild(u), h.appendChild(g);
      const x = document.createElement("div");
      x.style.cssText = `
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
      const C = document.createElement("button");
      C.className = "orca-button", C.textContent = "删除", C.style.cssText = "", C.onclick = () => {
        confirm(`确定要删除标签页集合 "${s.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), t.remove(), this.manageSavedTabSets());
      }, x.appendChild(y), x.appendChild(w), x.appendChild(C), d.appendChild(h), d.appendChild(x), a.appendChild(d);
    }), t.appendChild(a);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const i = document.createElement("button");
    i.className = "orca-button", i.textContent = "关闭", i.style.cssText = "", i.addEventListener("mouseenter", () => {
      i.style.backgroundColor = "#4b5563";
    }), i.addEventListener("mouseleave", () => {
      i.style.backgroundColor = "#6b7280";
    }), i.onclick = () => t.remove(), r.appendChild(i), t.appendChild(r), document.body.appendChild(t);
    const c = (s) => {
      t.contains(s.target) || (t.remove(), document.removeEventListener("click", c), document.removeEventListener("contextmenu", c));
    };
    setTimeout(() => {
      document.addEventListener("click", c), document.addEventListener("contextmenu", c);
    }, 0);
  }
}
let I = null;
async function un(o) {
  H = o, orca.state.locale, I = new ln(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => I == null ? void 0 : I.init(), 500);
  }) : setTimeout(() => I == null ? void 0 : I.init(), 500), orca.commands.registerCommand(
    `${H}.resetCache`,
    async () => {
      I && await I.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${H}.toggleBlockIcons`,
    async () => {
      I && await I.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  );
}
async function hn() {
  I && (I.unregisterHeadbarButton(), I.cleanupDragResize(), I.destroy(), I = null), orca.commands.unregisterCommand(`${H}.resetCache`);
}
export {
  un as load,
  hn as unload
};
