var Ie = Object.defineProperty;
var Ee = (s, e, t) => e in s ? Ie(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var m = (s, e, t) => Ee(s, typeof e != "symbol" ? e + "" : e, t);
let ge = "en", be = {};
function Se(s, e) {
  ge = s, be = e;
}
function Pe(s, e, t) {
  var i;
  return ((i = be[ge]) == null ? void 0 : i[s]) ?? s;
}
const $e = {
  标签页插件已启动: "标签页插件已启动",
  "your plugin code starts here": "您的插件代码从这里开始",
  今天: "今天",
  昨天: "昨天",
  明天: "明天"
}, fe = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
}, me = {
  JSON: 0,
  Text: 1
}, w = {
  FIRST_PANEL_TABS: "first-panel-tabs",
  // 第一个面板的标签数据
  SECOND_PANEL_TABS: "second-panel-tabs",
  // 第二个面板的标签数据
  CLOSED_TABS: "closed-tabs",
  // 已关闭标签列表
  RECENTLY_CLOSED_TABS: "recently-closed-tabs",
  // 最近关闭的标签页列表
  SAVED_TAB_SETS: "saved-tab-sets",
  // 保存的多标签页集合
  WORKSPACES: "workspaces",
  // 工作区列表
  CURRENT_WORKSPACE: "current-workspace",
  // 当前工作区
  ENABLE_WORKSPACES: "enable-workspaces",
  // 启用工作区功能
  FLOATING_WINDOW_VISIBLE: "floating-window-visible",
  // 浮窗可见状态
  TABS_POSITION: "tabs-position",
  // 标签位置
  LAYOUT_MODE: "layout-mode",
  // 布局模式
  FIXED_TO_TOP: "fixed-to-top"
  // 固定到顶部状态
};
class Le {
  log(...e) {
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && console.log("[OrcaStorageService]", ...e);
  }
  warn(...e) {
    console.warn("[OrcaStorageService]", ...e);
  }
  error(...e) {
    console.error("[OrcaStorageService]", ...e);
  }
  /**
   * 保存数据到Orca插件存储系统
   * @param key 存储键
   * @param data 要保存的数据
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async saveConfig(e, t, n = "orca-tabs-plugin") {
    try {
      const i = typeof t == "string" ? t : JSON.stringify(t);
      return await orca.plugins.setData(n, e, i), this.log(`💾 已保存插件数据 ${e}:`, t), !0;
    } catch (i) {
      return this.warn(`无法保存插件数据 ${e}，尝试降级到localStorage:`, i), this.saveToLocalStorage(e, t);
    }
  }
  /**
   * 从Orca插件存储系统读取数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   * @param defaultValue 默认值
   */
  async getConfig(e, t = "orca-tabs-plugin", n) {
    try {
      const i = await orca.plugins.getData(t, e);
      if (i == null)
        return n || null;
      let o;
      if (typeof i == "string")
        try {
          o = JSON.parse(i);
        } catch {
          o = i;
        }
      else
        o = i;
      return this.log(`📂 已读取插件数据 ${e}:`, o), o;
    } catch (i) {
      return this.warn(`无法读取插件数据 ${e}，尝试从localStorage读取:`, i), this.getFromLocalStorage(e, n);
    }
  }
  /**
   * 删除插件数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async removeConfig(e, t = "orca-tabs-plugin") {
    try {
      return await orca.plugins.removeData(t, e), this.log(`🗑️ 已删除插件数据 ${e}`), !0;
    } catch (n) {
      return this.warn(`无法删除插件数据 ${e}，尝试从localStorage删除:`, n), this.removeFromLocalStorage(e);
    }
  }
  /**
   * 降级到localStorage保存
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
   * 从localStorage读取
   */
  getFromLocalStorage(e, t) {
    try {
      const n = this.getLocalStorageKey(e), i = localStorage.getItem(n);
      if (i) {
        const o = JSON.parse(i);
        return this.log(`📂 已从localStorage读取: ${n}`), o;
      }
      return t || null;
    } catch (n) {
      return this.error("无法从localStorage读取:", n), t || null;
    }
  }
  /**
   * 从localStorage删除
   */
  removeFromLocalStorage(e) {
    try {
      const t = this.getLocalStorageKey(e);
      return localStorage.removeItem(t), this.log(`🗑️ 已从localStorage删除: ${t}`), !0;
    } catch (t) {
      return this.error("无法从localStorage删除:", t), !1;
    }
  }
  /**
   * 获取localStorage键名
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
  /**
   * 测试API配置的序列化和反序列化
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
      const i = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(n) === JSON.stringify(i) ? "✅" : "❌"}`);
      const o = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", o);
      const a = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(o) === JSON.stringify(a) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
const xe = 6048e5, Me = 864e5, oe = Symbol.for("constructDateFrom");
function $(s, e) {
  return typeof s == "function" ? s(e) : s && typeof s == "object" && oe in s ? s[oe](e) : s instanceof Date ? new s.constructor(e) : new Date(e);
}
function L(s, e) {
  return $(e || s, s);
}
function ye(s, e, t) {
  const n = L(s, t == null ? void 0 : t.in);
  return isNaN(e) ? $(s, NaN) : (e && n.setDate(n.getDate() + e), n);
}
let De = {};
function Z() {
  return De;
}
function _(s, e) {
  var r, l, c, h;
  const t = Z(), n = (e == null ? void 0 : e.weekStartsOn) ?? ((l = (r = e == null ? void 0 : e.locale) == null ? void 0 : r.options) == null ? void 0 : l.weekStartsOn) ?? t.weekStartsOn ?? ((h = (c = t.locale) == null ? void 0 : c.options) == null ? void 0 : h.weekStartsOn) ?? 0, i = L(s, e == null ? void 0 : e.in), o = i.getDay(), a = (o < n ? 7 : 0) + o - n;
  return i.setDate(i.getDate() - a), i.setHours(0, 0, 0, 0), i;
}
function G(s, e) {
  return _(s, { ...e, weekStartsOn: 1 });
}
function ve(s, e) {
  const t = L(s, e == null ? void 0 : e.in), n = t.getFullYear(), i = $(t, 0);
  i.setFullYear(n + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const o = G(i), a = $(t, 0);
  a.setFullYear(n, 0, 4), a.setHours(0, 0, 0, 0);
  const r = G(a);
  return t.getTime() >= o.getTime() ? n + 1 : t.getTime() >= r.getTime() ? n : n - 1;
}
function se(s) {
  const e = L(s), t = new Date(
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
function Te(s, ...e) {
  const t = $.bind(
    null,
    e.find((n) => typeof n == "object")
  );
  return e.map(t);
}
function J(s, e) {
  const t = L(s, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function Ae(s, e, t) {
  const [n, i] = Te(
    t == null ? void 0 : t.in,
    s,
    e
  ), o = J(n), a = J(i), r = +o - se(o), l = +a - se(a);
  return Math.round((r - l) / Me);
}
function ze(s, e) {
  const t = ve(s, e), n = $(s, 0);
  return n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), G(n);
}
function te(s) {
  return $(s, Date.now());
}
function ne(s, e, t) {
  const [n, i] = Te(
    t == null ? void 0 : t.in,
    s,
    e
  );
  return +J(n) == +J(i);
}
function Be(s) {
  return s instanceof Date || typeof s == "object" && Object.prototype.toString.call(s) === "[object Date]";
}
function We(s) {
  return !(!Be(s) && typeof s != "number" || isNaN(+L(s)));
}
function Oe(s, e) {
  const t = L(s, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const Ne = {
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
}, Fe = (s, e, t) => {
  let n;
  const i = Ne[s];
  return typeof i == "string" ? n = i : e === 1 ? n = i.one : n = i.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + n : n + " ago" : n;
};
function ee(s) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : s.defaultWidth;
    return s.formats[t] || s.formats[s.defaultWidth];
  };
}
const Re = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, He = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, qe = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, _e = {
  date: ee({
    formats: Re,
    defaultWidth: "full"
  }),
  time: ee({
    formats: He,
    defaultWidth: "full"
  }),
  dateTime: ee({
    formats: qe,
    defaultWidth: "full"
  })
}, Ve = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ue = (s, e, t, n) => Ve[s];
function R(s) {
  return (e, t) => {
    const n = t != null && t.context ? String(t.context) : "standalone";
    let i;
    if (n === "formatting" && s.formattingValues) {
      const a = s.defaultFormattingWidth || s.defaultWidth, r = t != null && t.width ? String(t.width) : a;
      i = s.formattingValues[r] || s.formattingValues[a];
    } else {
      const a = s.defaultWidth, r = t != null && t.width ? String(t.width) : s.defaultWidth;
      i = s.values[r] || s.values[a];
    }
    const o = s.argumentCallback ? s.argumentCallback(e) : e;
    return i[o];
  };
}
const Ye = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, je = {
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
}, Ge = {
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
}, Ke = (s, e) => {
  const t = Number(s), n = t % 100;
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
}, Qe = {
  ordinalNumber: Ke,
  era: R({
    values: Ye,
    defaultWidth: "wide"
  }),
  quarter: R({
    values: je,
    defaultWidth: "wide",
    argumentCallback: (s) => s - 1
  }),
  month: R({
    values: Xe,
    defaultWidth: "wide"
  }),
  day: R({
    values: Ge,
    defaultWidth: "wide"
  }),
  dayPeriod: R({
    values: Je,
    defaultWidth: "wide",
    formattingValues: Ze,
    defaultFormattingWidth: "wide"
  })
};
function H(s) {
  return (e, t = {}) => {
    const n = t.width, i = n && s.matchPatterns[n] || s.matchPatterns[s.defaultMatchWidth], o = e.match(i);
    if (!o)
      return null;
    const a = o[0], r = n && s.parsePatterns[n] || s.parsePatterns[s.defaultParseWidth], l = Array.isArray(r) ? tt(r, (d) => d.test(a)) : (
      // [TODO] -- I challenge you to fix the type
      et(r, (d) => d.test(a))
    );
    let c;
    c = s.valueCallback ? s.valueCallback(l) : l, c = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(c)
    ) : c;
    const h = e.slice(a.length);
    return { value: c, rest: h };
  };
}
function et(s, e) {
  for (const t in s)
    if (Object.prototype.hasOwnProperty.call(s, t) && e(s[t]))
      return t;
}
function tt(s, e) {
  for (let t = 0; t < s.length; t++)
    if (e(s[t]))
      return t;
}
function nt(s) {
  return (e, t = {}) => {
    const n = e.match(s.matchPattern);
    if (!n) return null;
    const i = n[0], o = e.match(s.parsePattern);
    if (!o) return null;
    let a = s.valueCallback ? s.valueCallback(o[0]) : o[0];
    a = t.valueCallback ? t.valueCallback(a) : a;
    const r = e.slice(i.length);
    return { value: a, rest: r };
  };
}
const it = /^(\d+)(th|st|nd|rd)?/i, ot = /\d+/i, st = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, at = {
  any: [/^b/i, /^(a|c)/i]
}, rt = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, ct = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, lt = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, dt = {
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
}, ht = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, ut = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, pt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, gt = {
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
}, bt = {
  ordinalNumber: nt({
    matchPattern: it,
    parsePattern: ot,
    valueCallback: (s) => parseInt(s, 10)
  }),
  era: H({
    matchPatterns: st,
    defaultMatchWidth: "wide",
    parsePatterns: at,
    defaultParseWidth: "any"
  }),
  quarter: H({
    matchPatterns: rt,
    defaultMatchWidth: "wide",
    parsePatterns: ct,
    defaultParseWidth: "any",
    valueCallback: (s) => s + 1
  }),
  month: H({
    matchPatterns: lt,
    defaultMatchWidth: "wide",
    parsePatterns: dt,
    defaultParseWidth: "any"
  }),
  day: H({
    matchPatterns: ht,
    defaultMatchWidth: "wide",
    parsePatterns: ut,
    defaultParseWidth: "any"
  }),
  dayPeriod: H({
    matchPatterns: pt,
    defaultMatchWidth: "any",
    parsePatterns: gt,
    defaultParseWidth: "any"
  })
}, ft = {
  code: "en-US",
  formatDistance: Fe,
  formatLong: _e,
  formatRelative: Ue,
  localize: Qe,
  match: bt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function mt(s, e) {
  const t = L(s, e == null ? void 0 : e.in);
  return Ae(t, Oe(t)) + 1;
}
function xt(s, e) {
  const t = L(s, e == null ? void 0 : e.in), n = +G(t) - +ze(t);
  return Math.round(n / xe) + 1;
}
function we(s, e) {
  var h, d, p, u;
  const t = L(s, e == null ? void 0 : e.in), n = t.getFullYear(), i = Z(), o = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((d = (h = e == null ? void 0 : e.locale) == null ? void 0 : h.options) == null ? void 0 : d.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((u = (p = i.locale) == null ? void 0 : p.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, a = $((e == null ? void 0 : e.in) || s, 0);
  a.setFullYear(n + 1, 0, o), a.setHours(0, 0, 0, 0);
  const r = _(a, e), l = $((e == null ? void 0 : e.in) || s, 0);
  l.setFullYear(n, 0, o), l.setHours(0, 0, 0, 0);
  const c = _(l, e);
  return +t >= +r ? n + 1 : +t >= +c ? n : n - 1;
}
function yt(s, e) {
  var r, l, c, h;
  const t = Z(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((l = (r = e == null ? void 0 : e.locale) == null ? void 0 : r.options) == null ? void 0 : l.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((h = (c = t.locale) == null ? void 0 : c.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, i = we(s, e), o = $((e == null ? void 0 : e.in) || s, 0);
  return o.setFullYear(i, 0, n), o.setHours(0, 0, 0, 0), _(o, e);
}
function vt(s, e) {
  const t = L(s, e == null ? void 0 : e.in), n = +_(t, e) - +yt(t, e);
  return Math.round(n / xe) + 1;
}
function C(s, e) {
  const t = s < 0 ? "-" : "", n = Math.abs(s).toString().padStart(e, "0");
  return t + n;
}
const A = {
  // Year
  y(s, e) {
    const t = s.getFullYear(), n = t > 0 ? t : 1 - t;
    return C(e === "yy" ? n % 100 : n, e.length);
  },
  // Month
  M(s, e) {
    const t = s.getMonth();
    return e === "M" ? String(t + 1) : C(t + 1, 2);
  },
  // Day of the month
  d(s, e) {
    return C(s.getDate(), e.length);
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
    return C(s.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(s, e) {
    return C(s.getHours(), e.length);
  },
  // Minute
  m(s, e) {
    return C(s.getMinutes(), e.length);
  },
  // Second
  s(s, e) {
    return C(s.getSeconds(), e.length);
  },
  // Fraction of second
  S(s, e) {
    const t = e.length, n = s.getMilliseconds(), i = Math.trunc(
      n * Math.pow(10, t - 3)
    );
    return C(i, e.length);
  }
}, N = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, ae = {
  // Era
  G: function(s, e, t) {
    const n = s.getFullYear() > 0 ? 1 : 0;
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
  y: function(s, e, t) {
    if (e === "yo") {
      const n = s.getFullYear(), i = n > 0 ? n : 1 - n;
      return t.ordinalNumber(i, { unit: "year" });
    }
    return A.y(s, e);
  },
  // Local week-numbering year
  Y: function(s, e, t, n) {
    const i = we(s, n), o = i > 0 ? i : 1 - i;
    if (e === "YY") {
      const a = o % 100;
      return C(a, 2);
    }
    return e === "Yo" ? t.ordinalNumber(o, { unit: "year" }) : C(o, e.length);
  },
  // ISO week-numbering year
  R: function(s, e) {
    const t = ve(s);
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
  u: function(s, e) {
    const t = s.getFullYear();
    return C(t, e.length);
  },
  // Quarter
  Q: function(s, e, t) {
    const n = Math.ceil((s.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(n);
      case "QQ":
        return C(n, 2);
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
  q: function(s, e, t) {
    const n = Math.ceil((s.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(n);
      case "qq":
        return C(n, 2);
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
  M: function(s, e, t) {
    const n = s.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return A.M(s, e);
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
  L: function(s, e, t) {
    const n = s.getMonth();
    switch (e) {
      case "L":
        return String(n + 1);
      case "LL":
        return C(n + 1, 2);
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
  w: function(s, e, t, n) {
    const i = vt(s, n);
    return e === "wo" ? t.ordinalNumber(i, { unit: "week" }) : C(i, e.length);
  },
  // ISO week of year
  I: function(s, e, t) {
    const n = xt(s);
    return e === "Io" ? t.ordinalNumber(n, { unit: "week" }) : C(n, e.length);
  },
  // Day of the month
  d: function(s, e, t) {
    return e === "do" ? t.ordinalNumber(s.getDate(), { unit: "date" }) : A.d(s, e);
  },
  // Day of year
  D: function(s, e, t) {
    const n = mt(s);
    return e === "Do" ? t.ordinalNumber(n, { unit: "dayOfYear" }) : C(n, e.length);
  },
  // Day of week
  E: function(s, e, t) {
    const n = s.getDay();
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
  e: function(s, e, t, n) {
    const i = s.getDay(), o = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(o);
      case "ee":
        return C(o, 2);
      case "eo":
        return t.ordinalNumber(o, { unit: "day" });
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
  c: function(s, e, t, n) {
    const i = s.getDay(), o = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(o);
      case "cc":
        return C(o, e.length);
      case "co":
        return t.ordinalNumber(o, { unit: "day" });
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
    const n = s.getDay(), i = n === 0 ? 7 : n;
    switch (e) {
      case "i":
        return String(i);
      case "ii":
        return C(i, e.length);
      case "io":
        return t.ordinalNumber(i, { unit: "day" });
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
    const n = s.getHours();
    let i;
    switch (n === 12 ? i = N.noon : n === 0 ? i = N.midnight : i = n / 12 >= 1 ? "pm" : "am", e) {
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
    const n = s.getHours();
    let i;
    switch (n >= 17 ? i = N.evening : n >= 12 ? i = N.afternoon : n >= 4 ? i = N.morning : i = N.night, e) {
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
      let n = s.getHours() % 12;
      return n === 0 && (n = 12), t.ordinalNumber(n, { unit: "hour" });
    }
    return A.h(s, e);
  },
  // Hour [0-23]
  H: function(s, e, t) {
    return e === "Ho" ? t.ordinalNumber(s.getHours(), { unit: "hour" }) : A.H(s, e);
  },
  // Hour [0-11]
  K: function(s, e, t) {
    const n = s.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(n, { unit: "hour" }) : C(n, e.length);
  },
  // Hour [1-24]
  k: function(s, e, t) {
    let n = s.getHours();
    return n === 0 && (n = 24), e === "ko" ? t.ordinalNumber(n, { unit: "hour" }) : C(n, e.length);
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
    const n = s.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (e) {
      case "X":
        return ce(n);
      case "XXXX":
      case "XX":
        return B(n);
      case "XXXXX":
      case "XXX":
      default:
        return B(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(s, e, t) {
    const n = s.getTimezoneOffset();
    switch (e) {
      case "x":
        return ce(n);
      case "xxxx":
      case "xx":
        return B(n);
      case "xxxxx":
      case "xxx":
      default:
        return B(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(s, e, t) {
    const n = s.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + re(n, ":");
      case "OOOO":
      default:
        return "GMT" + B(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(s, e, t) {
    const n = s.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + re(n, ":");
      case "zzzz":
      default:
        return "GMT" + B(n, ":");
    }
  },
  // Seconds timestamp
  t: function(s, e, t) {
    const n = Math.trunc(+s / 1e3);
    return C(n, e.length);
  },
  // Milliseconds timestamp
  T: function(s, e, t) {
    return C(+s, e.length);
  }
};
function re(s, e = "") {
  const t = s > 0 ? "-" : "+", n = Math.abs(s), i = Math.trunc(n / 60), o = n % 60;
  return o === 0 ? t + String(i) : t + String(i) + e + C(o, 2);
}
function ce(s, e) {
  return s % 60 === 0 ? (s > 0 ? "-" : "+") + C(Math.abs(s) / 60, 2) : B(s, e);
}
function B(s, e = "") {
  const t = s > 0 ? "-" : "+", n = Math.abs(s), i = C(Math.trunc(n / 60), 2), o = C(n % 60, 2);
  return t + i + e + o;
}
const le = (s, e) => {
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
}, ke = (s, e) => {
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
}, Tt = (s, e) => {
  const t = s.match(/(P+)(p+)?/) || [], n = t[1], i = t[2];
  if (!i)
    return le(s, e);
  let o;
  switch (n) {
    case "P":
      o = e.dateTime({ width: "short" });
      break;
    case "PP":
      o = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      o = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      o = e.dateTime({ width: "full" });
      break;
  }
  return o.replace("{{date}}", le(n, e)).replace("{{time}}", ke(i, e));
}, wt = {
  p: ke,
  P: Tt
}, kt = /^D+$/, Ct = /^Y+$/, It = ["D", "DD", "YY", "YYYY"];
function Et(s) {
  return kt.test(s);
}
function St(s) {
  return Ct.test(s);
}
function Pt(s, e, t) {
  const n = $t(s, e, t);
  if (console.warn(n), It.includes(s)) throw new RangeError(n);
}
function $t(s, e, t) {
  const n = s[0] === "Y" ? "years" : "days of the month";
  return `Use \`${s.toLowerCase()}\` instead of \`${s}\` (in \`${e}\`) for formatting ${n} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Lt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Mt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Dt = /^'([^]*?)'?$/, At = /''/g, zt = /[a-zA-Z]/;
function z(s, e, t) {
  var h, d, p, u;
  const n = Z(), i = n.locale ?? ft, o = n.firstWeekContainsDate ?? ((d = (h = n.locale) == null ? void 0 : h.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, a = n.weekStartsOn ?? ((u = (p = n.locale) == null ? void 0 : p.options) == null ? void 0 : u.weekStartsOn) ?? 0, r = L(s, t == null ? void 0 : t.in);
  if (!We(r))
    throw new RangeError("Invalid time value");
  let l = e.match(Mt).map((g) => {
    const b = g[0];
    if (b === "p" || b === "P") {
      const f = wt[b];
      return f(g, i.formatLong);
    }
    return g;
  }).join("").match(Lt).map((g) => {
    if (g === "''")
      return { isToken: !1, value: "'" };
    const b = g[0];
    if (b === "'")
      return { isToken: !1, value: Bt(g) };
    if (ae[b])
      return { isToken: !0, value: g };
    if (b.match(zt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + b + "`"
      );
    return { isToken: !1, value: g };
  });
  i.localize.preprocessor && (l = i.localize.preprocessor(r, l));
  const c = {
    firstWeekContainsDate: o,
    weekStartsOn: a,
    locale: i
  };
  return l.map((g) => {
    if (!g.isToken) return g.value;
    const b = g.value;
    (St(b) || Et(b)) && Pt(b, e, String(s));
    const f = ae[b[0]];
    return f(r, b, i.localize, c);
  }).join("");
}
function Bt(s) {
  const e = s.match(Dt);
  return e ? e[1].replace(At, "'") : s;
}
function Wt(s, e) {
  return ne(
    $(s, s),
    te(s)
  );
}
function Ot(s, e) {
  return ne(
    s,
    ye(te(s), 1),
    e
  );
}
function Nt(s, e, t) {
  return ye(s, -1, t);
}
function Ft(s, e) {
  return ne(
    $(s, s),
    Nt(te(s))
  );
}
function Rt(s) {
  try {
    let e = orca.state.settings[fe.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Wt(s))
      return "今天";
    if (Ft(s))
      return "昨天";
    if (Ot(s))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const n = s.getDay(), o = ["日", "一", "二", "三", "四", "五", "六"][n], a = e.replace(/E/g, o);
          return z(s, a);
        } else
          return z(s, e);
      else
        return z(s, e);
    } catch {
      const n = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of n)
        try {
          return z(s, i);
        } catch {
          continue;
        }
      return s.toLocaleDateString();
    }
  } catch (e) {
    return console.warn("日期格式化失败:", e), s.toLocaleDateString();
  }
}
function Y(s) {
  try {
    const e = Ht(s, "_repr");
    if (!e || e.type !== me.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch (e) {
    return console.warn("提取日期块信息失败:", e), null;
  }
}
function Ht(s, e) {
  return !s.properties || !Array.isArray(s.properties) ? null : s.properties.find((t) => t.name === e);
}
function qt(s) {
  if (!Array.isArray(s) || s.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const n of s)
    n && typeof n == "object" && (n.t === "text" && n.v ? e++ : n.t === "ref" && n.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function _t(s) {
  if (!s || s.length === 0) return "";
  let e = "";
  for (const t of s)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function Vt(s, e, t, n) {
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
  const o = document.createElement("i");
  o.className = e, o.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const a = document.createElement("span");
  if (a.textContent = s, a.style.cssText = `
    flex: 1;
    color: #333;
  `, i.appendChild(o), i.appendChild(a), t && t.trim() !== "") {
    const r = document.createElement("span");
    r.textContent = t, r.style.cssText = `
      font-size: 12px;
      color: #999;
      margin-left: 12px;
    `, i.appendChild(r);
  }
  return i.addEventListener("mouseenter", () => {
    i.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
  }), i.addEventListener("mouseleave", () => {
    i.style.backgroundColor = "transparent";
  }), i.addEventListener("click", (r) => {
    r.preventDefault(), r.stopPropagation(), n();
    const l = i.closest('.orca-context-menu, .context-menu, [role="menu"]');
    l && (l.style.display = "none", l.remove());
  }), i;
}
function Ut(s, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);
  if (t) {
    const n = parseInt(t[1], 16), i = parseInt(t[2], 16), o = parseInt(t[3], 16);
    return `rgba(${n}, ${i}, ${o}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function X() {
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
function Yt(s, e, t = 200) {
  const n = e ? t : 400, i = 40, o = window.innerWidth - n, a = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(s.x, o)),
    y: Math.max(0, Math.min(s.y, a))
  };
}
function jt(s) {
  const e = X();
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
function Xt(s, e, t, n) {
  return e ? {
    verticalPosition: { ...s },
    horizontalPosition: { ...n }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...s }
  };
}
function Gt(s) {
  return `布局模式: ${s.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${s.verticalWidth}px, 垂直位置: (${s.verticalPosition.x}, ${s.verticalPosition.y}), 水平位置: (${s.horizontalPosition.x}, ${s.horizontalPosition.y})`;
}
function de(s, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${s.x}, ${s.y})`;
}
function Jt(s, e, t, n) {
  let i, o, a = "normal";
  if (t ? (i = "rgba(255, 255, 255, 0.1)", o = "#ffffff") : (i = "rgba(200, 200, 200, 0.6)", o = "#333333"), s.color)
    try {
      const r = s.color.startsWith("#") ? s.color : `#${s.color}`;
      i = n(r, "background"), o = n(r, "text"), a = "600";
    } catch (r) {
      console.warn("颜色处理失败，使用默认颜色:", r);
    }
  return e ? `
    background: ${i};
    color: ${o};
    font-weight: ${a};
    padding: 2px 8px;
    border-radius: 4px;
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
    background: ${i};
    color: ${o};
    font-weight: ${a};
    padding: 2px 8px;
    border-radius: 4px;
    height: 24px;
    max-height: 24px;
    line-height: 20px;
    cursor: pointer;
    font-size: 12px;
    max-width: 150px;
    transition: all 0.2s ease;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
  `;
}
function Zt() {
  const s = document.createElement("div");
  return s.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, s;
}
function Kt(s) {
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
function Qt(s) {
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
  `, e.appendChild(t), e.textContent = s, e;
}
function en() {
  const s = document.createElement("span");
  return s.textContent = "📌", s.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, s;
}
function tn(s) {
  let e = s.title;
  return s.isPinned && (e += " (已固定)"), e;
}
function nn() {
  return `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
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
function he(s = "primary") {
  return {
    primary: `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `,
    secondary: `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `,
    danger: `
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `
  }[s];
}
function on() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function sn(s, e, t, n) {
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
    border-radius: 6px;
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
    border-radius: 6px;
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
function an(s) {
  for (let e = s.length - 1; e >= 0; e--)
    if (!s[e].isPinned)
      return e;
  return -1;
}
function rn(s) {
  return [...s].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function cn(s, e, t = {}) {
  try {
    const {
      updateOrder: n = !0,
      saveData: i = !0,
      updateUI: o = !0
    } = t, a = e.findIndex((l) => l.blockId === s.blockId);
    if (a === -1)
      return {
        success: !1,
        message: `标签不存在: ${s.title}`
      };
    e[a].isPinned = !e[a].isPinned, n && un(e);
    const r = e[a].isPinned ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${s.title}" 已${r}`,
      data: { tab: e[a], tabIndex: a }
    };
  } catch (n) {
    return {
      success: !1,
      message: `切换固定状态失败: ${n}`
    };
  }
}
function ln(s, e, t, n = {}) {
  try {
    const {
      updateUI: i = !0,
      saveData: o = !0,
      validateData: a = !0
    } = n, r = t.findIndex((l) => l.blockId === s.blockId);
    if (r === -1)
      return {
        success: !1,
        message: `标签不存在: ${s.title}`
      };
    if (a) {
      const l = hn(e);
      if (!l.success)
        return l;
    }
    return t[r] = { ...t[r], ...e }, {
      success: !0,
      message: `标签 "${s.title}" 已更新`,
      data: { tab: t[r], tabIndex: r }
    };
  } catch (i) {
    return {
      success: !1,
      message: `更新标签失败: ${i}`
    };
  }
}
function dn(s, e, t, n = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : ln(s, { title: e.trim() }, t, n);
}
function hn(s) {
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
function un(s) {
  s.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function pn(s, e, t, n) {
  return e ? {
    x: s.x,
    y: s.y,
    width: t,
    height: n
  } : {
    x: s.x,
    y: s.y,
    width: Math.min(800, window.innerWidth - s.x - 10),
    height: 28
  };
}
function gn(s, e, t, n) {
  const i = pn(s, e, t, n);
  let o = s.x, a = s.y;
  return i.x < 0 ? o = 0 : i.x + i.width > window.innerWidth && (o = window.innerWidth - i.width), i.y < 0 ? a = 0 : i.y + i.height > window.innerHeight && (a = window.innerHeight - i.height), { x: o, y: a };
}
function ue(s, e, t = !1) {
  let n = null;
  const i = (...o) => {
    const a = t && !n;
    n && clearTimeout(n), n = window.setTimeout(() => {
      n = null, t || s(...o);
    }, e), a && s(...o);
  };
  return i.cancel = () => {
    n && (clearTimeout(n), n = null);
  }, i;
}
function bn(s, e) {
  try {
    const t = s.startsWith("#") ? s : `#${s}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(t))
      return console.warn("无效的十六进制颜色格式:", t), e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const n = parseInt(t.slice(1, 3), 16) / 255, i = parseInt(t.slice(3, 5), 16) / 255, o = parseInt(t.slice(5, 7), 16) / 255, [a, r, l] = fn(n, i, o);
    if (e === "background") {
      const c = Math.max(0.1, Math.min(0.4, a * 0.4)), h = Math.min(0.3, r * 1.1), d = isNaN(l) ? 0 : l;
      return `oklch(${c} ${h} ${d})`;
    } else {
      const c = Math.min(0.9, Math.max(0.2, a * 1.3)), h = Math.max(0.05, Math.min(0.2, r * 0.7)), d = isNaN(l) ? 0 : l;
      return `oklch(${c} ${h} ${d})`;
    }
  } catch (t) {
    return console.warn("OKLCH颜色转换失败:", t), e === "background" ? s + "20" : s;
  }
}
function fn(s, e, t) {
  const n = s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4), i = e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4), o = t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4), a = n * 0.4124564 + i * 0.3575761 + o * 0.1804375, r = n * 0.2126729 + i * 0.7151522 + o * 0.072175, l = n * 0.0193339 + i * 0.119192 + o * 0.9503041, c = Math.cbrt(0.8189330101 * a + 0.3618667424 * r - 0.1288597137 * l), h = Math.cbrt(0.0329845436 * a + 0.9293118715 * r + 0.0361456387 * l), d = Math.cbrt(0.0482003018 * a + 0.2643662691 * r + 0.633851707 * l), p = c, u = Math.sqrt(h * h + d * d), g = Math.atan2(d, h) * (180 / Math.PI);
  return [p, u, g];
}
var V = /* @__PURE__ */ ((s) => (s[s.ERROR = 0] = "ERROR", s[s.WARN = 1] = "WARN", s[s.INFO = 2] = "INFO", s[s.DEBUG = 3] = "DEBUG", s[s.VERBOSE = 4] = "VERBOSE", s))(V || {});
const mn = {
  level: 2,
  enableConsole: !0,
  enableStorage: !1,
  maxStorageEntries: 1e3,
  enableTimestamps: !0,
  enableColors: !0,
  prefix: "[OrcaTabs]"
};
class K {
  constructor(e = {}) {
    m(this, "config");
    m(this, "storage", []);
    m(this, "colors", {
      0: "#ff4444",
      1: "#ffaa00",
      2: "#00aaff",
      3: "#00ff88",
      4: "#888888"
    });
    this.config = { ...mn, ...e };
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
  log(e, t, n, i) {
    if (e > this.config.level) return;
    const o = {
      timestamp: Date.now(),
      level: e,
      message: t,
      data: n,
      source: i
    };
    this.config.enableConsole && this.logToConsole(o), this.config.enableStorage && this.logToStorage(o);
  }
  /**
   * 输出到控制台
   */
  logToConsole(e) {
    const { timestamp: t, level: n, message: i, data: o, source: a } = e;
    V[n];
    const r = this.config.enableTimestamps ? new Date(t).toLocaleTimeString() : "", l = `${this.config.prefix}${r ? ` [${r}]` : ""}`, c = a ? ` [${a}]` : "", h = `${l}${c} ${i}`;
    if (this.config.enableColors && typeof window < "u") {
      const d = this.colors[n];
      console.log(`%c${h}`, `color: ${d}`, o || "");
    } else
      this.getConsoleMethod(n)(h, o || "");
  }
  /**
   * 获取控制台方法
   */
  getConsoleMethod(e) {
    switch (e) {
      case 0:
        return console.error;
      case 1:
        return console.warn;
      case 2:
        return console.info;
      case 3:
      case 4:
        return console.log;
      default:
        return console.log;
    }
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
    return e !== void 0 && (n = n.filter((i) => i.level === e)), t !== void 0 && (n = n.slice(-t)), n;
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
      const n = new Date(t.timestamp).toLocaleString(), i = V[t.level], o = t.source ? ` [${t.source}]` : "", a = t.data ? ` ${JSON.stringify(t.data)}` : "";
      return `[${n}] ${i}${o}: ${t.message}${a}`;
    }).join(`
`);
  }
  /**
   * 性能计时器
   */
  time(e) {
    console.time(`${this.config.prefix} ${e}`);
  }
  /**
   * 结束性能计时
   */
  timeEnd(e) {
    console.timeEnd(`${this.config.prefix} ${e}`);
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
      const i = `${this.config.prefix}-${t}`, o = n ? `${this.config.prefix}-${n}` : void 0;
      performance.measure(`${this.config.prefix}-${e}`, i, o);
    }
  }
  /**
   * 创建子日志器
   */
  createChild(e) {
    const t = new K(this.config);
    return t.config.prefix = `${this.config.prefix}[${e}]`, t;
  }
}
new K();
function xn(s, e, t, n) {
  const i = document.createElement("div");
  i.className = "orca-tabs-container";
  const o = sn(s, e, n, t);
  return i.style.cssText = o, i;
}
function yn(s, e, t) {
  const n = document.createElement("div");
  n.className = "width-adjustment-dialog";
  const i = nn();
  n.style.cssText = i;
  const o = document.createElement("div");
  o.className = "dialog-title", o.textContent = "调整面板宽度", n.appendChild(o);
  const a = document.createElement("div");
  a.className = "dialog-slider-container", a.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const r = document.createElement("input");
  r.type = "range", r.min = "120", r.max = "800", r.value = s.toString(), r.style.cssText = on();
  const l = document.createElement("div");
  l.className = "dialog-width-display", l.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, l.textContent = `当前宽度: ${s}px`, r.oninput = () => {
    const p = parseInt(r.value);
    l.textContent = `当前宽度: ${p}px`, e(p);
  }, a.appendChild(r), a.appendChild(l), n.appendChild(a);
  const c = document.createElement("div");
  c.className = "dialog-buttons", c.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const h = document.createElement("button");
  h.className = "btn btn-primary", h.textContent = "确定", h.style.cssText = he(), h.onclick = () => pe(n);
  const d = document.createElement("button");
  return d.className = "btn btn-secondary", d.textContent = "取消", d.style.cssText = he(), d.onclick = () => {
    t(), pe(n);
  }, c.appendChild(h), c.appendChild(d), n.appendChild(c), n;
}
function pe(s) {
  s && s.parentNode && s.parentNode.removeChild(s);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function vn() {
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
      border-radius: 4px;
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
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
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
function Tn() {
  const s = document.querySelector("section#main");
  if (!s)
    return console.warn("❌ 未找到 section#main"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const e = s.querySelector(".orca-panels-row");
  if (!e)
    return console.warn("❌ 未找到 .orca-panels-row"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const t = e.querySelectorAll('.orca-panel:not([data-menu-panel="true"])'), n = [];
  let i = null;
  return t.forEach((o) => {
    const a = o.getAttribute("data-panel-id");
    a && (n.push(a), o.classList.contains("active") && (i = a));
  }), {
    panelIds: n,
    activePanelId: i,
    panelCount: n.length
  };
}
function wn(s, e) {
  return s.length !== e.length ? !0 : !s.every((t, n) => t === e[n]);
}
let q;
class kn {
  constructor() {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    m(this, "firstPanelTabs", []);
    // 只存储第一个面板的标签数据
    m(this, "secondPanelTabs", []);
    // 存储第二个面板的标签数据
    m(this, "currentPanelId", "");
    m(this, "panelIds", []);
    // 所有面板ID列表
    m(this, "currentPanelIndex", 0);
    // 当前面板索引
    m(this, "storageService", new Le());
    // 存储服务实例
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // 日志管理器
    m(this, "logManager", new K({
      level: typeof window < "u" && window.DEBUG_ORCA_TABS_VERBOSE === !0 ? V.VERBOSE : V.INFO,
      enableConsole: typeof window < "u" && window.DEBUG_ORCA_TABS !== !1,
      prefix: "[OrcaTabsPlugin]"
    }));
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* UI元素和状态管理 - UI Elements and State Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    m(this, "tabContainer", null);
    m(this, "cycleSwitcher", null);
    m(this, "isDragging", !1);
    m(this, "dragStartX", 0);
    m(this, "dragStartY", 0);
    m(this, "maxTabs", 10);
    // 默认值，会从设置中读取
    m(this, "homePageBlockId", null);
    // 主页块ID，从设置中读取
    m(this, "position", { x: 50, y: 50 });
    m(this, "monitoringInterval", null);
    m(this, "globalEventListener", null);
    // 统一的全局事件监听器
    m(this, "updateDebounceTimer", null);
    // 防抖计时器
    m(this, "lastUpdateTime", 0);
    // 上次更新时间
    m(this, "isUpdating", !1);
    // 是否正在更新
    m(this, "isInitialized", !1);
    // 是否已完成初始化
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 布局和位置管理 - Layout and Position Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    m(this, "isVerticalMode", !1);
    // 垂直模式标志
    m(this, "verticalWidth", 120);
    // 垂直模式下的窗口宽度
    m(this, "verticalPosition", { x: 20, y: 20 });
    // 垂直模式下的位置
    m(this, "horizontalPosition", { x: 20, y: 20 });
    // 水平模式下的位置
    m(this, "isResizing", !1);
    // 是否正在调整大小
    m(this, "isFixedToTop", !1);
    // 是否固定到顶部
    m(this, "resizeHandle", null);
    // 调整大小的拖拽手柄
    m(this, "isSidebarAlignmentEnabled", !1);
    // 侧边栏对齐功能是否启用
    m(this, "sidebarAlignmentObserver", null);
    // 侧边栏状态监听器
    m(this, "lastSidebarState", null);
    // 上次检测到的侧边栏状态
    m(this, "isFloatingWindowVisible", !0);
    // 浮窗是否可见
    m(this, "sidebarDebounceTimer", null);
    // 防抖计时器
    m(this, "showBlockTypeIcons", !0);
    // 是否显示块类型图标
    m(this, "showInHeadbar", !0);
    // 是否在顶部栏显示按钮
    m(this, "enableRecentlyClosedTabs", !0);
    // 是否启用最近关闭的标签页功能
    m(this, "enableMultiTabSaving", !0);
    // 是否启用多标签页保存功能
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 拖拽和事件管理 - Drag and Event Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // 拖拽状态管理
    m(this, "draggingTab", null);
    // 当前正在拖拽的标签
    m(this, "dragEndListener", null);
    // 全局拖拽结束监听器
    m(this, "swapDebounceTimer", null);
    // 拖拽交换防抖计时器
    m(this, "lastSwapTarget", null);
    // 上次交换的目标标签ID，防止重复交换
    m(this, "dropIndicator", null);
    // 拖拽位置指示器
    m(this, "dragOverTab", null);
    // 当前拖拽悬停的标签
    m(this, "dropZoneIndicator", null);
    // 删除区域指示器
    m(this, "dragOverTimer", null);
    // 拖拽悬停计时器
    m(this, "isDragOverActive", !1);
    // 是否正在拖拽悬停状态
    m(this, "themeChangeListener", null);
    // 主题变化监听器
    m(this, "lastPanelDiscoveryTime", 0);
    // 上次面板发现时间
    m(this, "panelDiscoveryCache", null);
    // 面板发现缓存
    m(this, "settingsCheckInterval", null);
    // 设置检查定时器
    m(this, "lastSettings", null);
    // 上次的设置状态
    m(this, "scrollListener", null);
    // 滚动监听器
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 标签页跟踪和快捷键 - Tab Tracking and Shortcuts */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // 已关闭标签页跟踪
    m(this, "closedTabs", /* @__PURE__ */ new Set());
    // 已关闭的标签页blockId集合
    m(this, "recentlyClosedTabs", []);
    // 最近关闭的标签页列表（按时间倒序）
    m(this, "savedTabSets", []);
    // 保存的多标签页集合
    m(this, "previousTabSet", null);
    // 记录上一个标签集合
    // 工作区功能相关
    m(this, "workspaces", []);
    // 工作区列表
    m(this, "currentWorkspace", null);
    // 当前工作区ID
    m(this, "enableWorkspaces", !0);
    // 是否启用工作区功能
    m(this, "dialogZIndex", 2e3);
    m(this, "lastActiveBlockId", null);
    // 快捷键相关
    m(this, "hoveredBlockId", null);
    // 当前鼠标悬停的块ID
    m(this, "currentContextBlockRefId", null);
    // 防抖函数实例
    m(this, "normalDebounce", ue(async () => {
      await this.updateTabsUI();
    }, 100));
    m(this, "draggingDebounce", ue(async () => {
      await this.updateTabsUI();
    }, 200));
  }
  // 调试日志（开发模式）
  log(...e) {
    this.logManager.info(e.join(" "));
  }
  // 详细日志（仅在需要时启用）
  verboseLog(...e) {
    this.logManager.verbose(e.join(" "));
  }
  warn(...e) {
    this.logManager.warn(e.join(" "));
  }
  error(...e) {
    this.logManager.error(e.join(" "));
  }
  // 对话框层级管理器
  /**
   * 获取下一个对话框层级
   */
  getNextDialogZIndex() {
    return this.dialogZIndex += 100, this.dialogZIndex;
  }
  // 当前右键菜单对应的块引用ID
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 初始化和生命周期管理 - Initialization and Lifecycle Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  async init() {
    vn();
    try {
      this.maxTabs = orca.state.settings[fe.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFixedToTopMode(), await this.restoreFloatingWindowVisibility(), await this.loadWorkspaces(), setTimeout(() => {
      this.updateCurrentWorkspaceActiveIndexOnLoad();
    }, 1e3), this.registerHeadbarButton(), this.discoverPanels(), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization(), await this.restoreFirstPanelTabs(), await this.restoreSecondPanelTabs(), await this.restoreClosedTabs(), await this.restoreRecentlyClosedTabs(), await this.restoreSavedTabSets();
    const e = document.querySelector(".orca-panel.active"), t = e == null ? void 0 : e.getAttribute("data-panel-id"), n = t ? this.panelIds.indexOf(t) : 0;
    n === 0 ? this.firstPanelTabs.length > 0 ? this.log("检测到第一个面板的持久化数据，使用固化的标签页状态") : (this.log("首次使用，扫描第一个面板创建标签页"), await this.scanFirstPanel()) : (this.log(`当前激活的是面板 ${n + 1}，将扫描该面板的标签页`), this.currentPanelIndex = n, this.currentPanelId = t || "", await this.scanAndSaveCurrentPanelTabs()), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.setupSettingsChecker(), this.isInitialized = !0, this.log("✅ 插件初始化完成");
  }
  /**
   * 设置主题变化监听器
   */
  setupThemeChangeListener() {
    this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null);
    const e = (o) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", o), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", e), this.log("主题变化监听器注册成功");
    } catch (o) {
      this.error("主题变化监听器注册失败:", o);
    }
    let t = orca.state.themeMode;
    const i = setInterval(() => {
      const o = orca.state.themeMode;
      o !== t && (this.log("备用检测：主题从", t, "切换到", o), t = o, setTimeout(() => {
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
    }, n = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    n.forEach((i) => {
      i.addEventListener("scroll", t, { passive: !0 });
    }), this.scrollListener = () => {
      n.forEach((i) => {
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
    }, document.addEventListener("dragend", this.dragEndListener), document.addEventListener("dragover", (e) => {
      if (this.draggingTab) {
        e.preventDefault(), e.dataTransfer.dropEffect = "move";
        const t = document.querySelector(".orca-tabs-container");
        t && !t.contains(e.target) ? this.showDropZoneIndicator(e.clientX, e.clientY) : this.hideDropZoneIndicator();
      }
    }), document.addEventListener("drop", (e) => {
      if (this.draggingTab) {
        e.preventDefault(), e.stopPropagation();
        const t = document.querySelector(".orca-tabs-container");
        t && !t.contains(e.target) && (this.closeTab(this.draggingTab), this.log(`🗑️ 拖拽删除标签页: ${this.draggingTab.title}`)), this.hideDropZoneIndicator();
      }
    });
  }
  /**
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tab").forEach((t) => {
      t.removeAttribute("data-dragging"), t.removeAttribute("data-drag-over"), t.classList.remove("dragging", "drag-over");
    }), this.tabContainer.removeAttribute("data-dragging")), this.clearDropIndicator(), this.hideDropZoneIndicator();
  }
  /**
   * 创建拖拽位置指示器
   */
  createDropIndicator(e, t) {
    const n = document.createElement("div");
    n.className = "orca-tab-drop-indicator", n.style.cssText = `
      position: absolute;
      height: 2px;
      background: #3b82f6;
      border-radius: 1px;
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 0 4px rgba(59, 130, 246, 0.5);
      transition: all 0.2s ease;
    `;
    const i = e.getBoundingClientRect(), o = e.parentElement;
    if (o) {
      const a = o.getBoundingClientRect();
      t === "before" ? (n.style.left = `${i.left - a.left}px`, n.style.top = `${i.top - a.top - 1}px`, n.style.width = `${i.width}px`) : (n.style.left = `${i.left - a.left}px`, n.style.top = `${i.bottom - a.top - 1}px`, n.style.width = `${i.width}px`), o.appendChild(n);
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
   * 显示删除区域指示器
   */
  showDropZoneIndicator(e, t) {
    if (!this.dropZoneIndicator) {
      this.dropZoneIndicator = document.createElement("div"), this.dropZoneIndicator.className = "orca-tab-drop-zone", this.dropZoneIndicator.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 100px;
        background: rgba(239, 68, 68, 0.1);
        border: 2px dashed #ef4444;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: 600;
        color: #ef4444;
        z-index: 10000;
        pointer-events: none;
        backdrop-filter: blur(4px);
        transition: all 0.3s ease;
        animation: pulse 1s infinite;
      `;
      const n = document.createElement("style");
      n.textContent = `
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        }
      `, document.head.appendChild(n), this.dropZoneIndicator.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">🗑️</div>
          <div>拖拽到此处删除</div>
        </div>
      `, document.body.appendChild(this.dropZoneIndicator);
    }
  }
  /**
   * 隐藏删除区域指示器
   */
  hideDropZoneIndicator() {
    this.dropZoneIndicator && (this.dropZoneIndicator.remove(), this.dropZoneIndicator = null);
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
    const n = this.getCurrentPanelTabs(), i = n.findIndex((l) => l.blockId === e.blockId), o = n.findIndex((l) => l.blockId === t.blockId);
    if (i === -1 || o === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (i === o) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${o}) -> ${e.title} (${i})`);
    const a = n[o], r = n[i];
    n[i] = a, n[o] = r, n.forEach((l, c) => {
      l.order = c;
    }), this.sortTabsByPinStatus(), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`✅ 标签交换完成: ${a.title} -> 位置 ${i}`);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 面板管理 - Panel Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 发现所有面板
   */
  discoverPanels() {
    const e = Date.now();
    if (e - this.lastPanelDiscoveryTime < 1e3 && this.panelDiscoveryCache && e - this.panelDiscoveryCache.timestamp < 1e3) {
      this.panelIds = [...this.panelDiscoveryCache.panelIds], this.verboseLog("📋 使用面板发现缓存，面板ID列表:", this.panelIds);
      return;
    }
    this.log("🔍 开始发现面板..."), this.lastPanelDiscoveryTime = e;
    const { panelIds: t, activePanelId: n, panelCount: i } = Tn();
    this.log(`🎯 最终发现 ${i} 个面板，面板ID列表:`, t), this.log(`🎯 活动面板: ${n || "无"}`), this.panelIds = t, n && n !== this.currentPanelId && (this.currentPanelId = n, this.currentPanelIndex = t.indexOf(n), this.log(`🔄 活动面板已更新: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`)), this.panelDiscoveryCache = {
      panelIds: [...t],
      timestamp: e
    }, i === 1 ? this.log("ℹ️ 只有一个面板，不会显示切换按钮") : i > 1 && this.log(`✅ 发现 ${i} 个面板，将创建循环切换器`);
  }
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
   * 扫描第一个面板的标签页（只读取当前激活的页面）
   */
  async scanFirstPanel() {
    if (this.panelIds.length === 0) return;
    const e = this.panelIds[0], t = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!t) return;
    const n = t.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) {
      this.log("第一个面板中没有找到激活的块编辑器");
      return;
    }
    const i = n.getAttribute("data-block-id");
    if (!i) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    const o = await this.getTabInfo(i, e, 0);
    o ? (this.firstPanelTabs = [o], await this.saveFirstPanelTabs(), await this.updateTabsUI()) : this.log("无法获取激活页面的标签信息");
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
    const e = this.getCurrentPanelTabs(), t = rn(e);
    this.setCurrentPanelTabs(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return an(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return _t(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, n = !1, i = !1;
    for (const o of e)
      o && typeof o == "object" && (o.t === "r" && o.v ? (i = !0, o.a || (t = !0)) : o.t === "t" && o.v && (n = !0));
    return t || n && i;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return qt(e);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 检测块类型
   */
  async detectBlockType(e) {
    try {
      if (Y(e))
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
            const o = this.findProperty(e, "_hide");
            return o && o.value ? (this.log(`📄 通过 _hide 属性确认为页面: ${i} (hide=${o.value})`), "page") : (this.log(`🏷️ 通过 _hide 属性确认为标签: ${i} (hide=${o ? o.value : "undefined"})`), "tag");
          } catch (o) {
            return this.warn("使用 API 检测标签失败，回退到文本分析:", o), i.includes("#") || i.includes("@") || i.length < 20 && i.match(/^[a-zA-Z0-9_-]+$/) || i.match(/^[a-z]+$/i) ? "tag" : "page";
          }
        return "alias";
      }
      this.verboseLog(`🔍 块信息调试: blockId=${e.id}, aliases=${e.aliases ? JSON.stringify(e.aliases) : "undefined"}, content=${e.content ? "exists" : "undefined"}, text=${e.text ? "exists" : "undefined"}`);
      const n = this.findProperty(e, "_repr");
      if (n && n.type === me.JSON && n.value)
        try {
          const i = typeof n.value == "string" ? JSON.parse(n.value) : n.value;
          if (i.type)
            return i.type;
        } catch {
        }
      if (e.content && Array.isArray(e.content)) {
        if (e.content.some(
          (l) => l && typeof l == "object" && l.type === "code"
        ))
          return "code";
        if (e.content.some(
          (l) => l && typeof l == "object" && l.type === "table"
        ))
          return "table";
        if (e.content.some(
          (l) => l && typeof l == "object" && l.type === "image"
        ))
          return "image";
        if (e.content.some(
          (l) => l && typeof l == "object" && l.type === "link"
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
      note: "ti ti-notes",
      // 笔记
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
      note: "ti ti-notes",
      // 笔记
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
          const i = e.getDay(), a = ["日", "一", "二", "三", "四", "五", "六"][i], r = t.replace(/E/g, a);
          return z(e, r);
        } else
          return z(e, t);
      else
        return z(e, t);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const o of i)
        try {
          return z(e, o);
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
      const i = await orca.invokeBackend("get-block", parseInt(e));
      if (!i) return null;
      let o = "", a = "", r = "", l = !1, c = "";
      c = await this.detectBlockType(i), this.log(`🔍 检测到块类型: ${c} (块ID: ${e})`), i.aliases && i.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${c}`);
      try {
        const h = Y(i);
        if (h)
          l = !0, o = Rt(h), console.log(`📅 识别为日期块: ${o}, 原始日期: ${h.toISOString()}`);
        else if (i.aliases && i.aliases.length > 0)
          o = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? o = i.text.substring(0, 50) : o = (await this.extractTextFromContent(i.content)).substring(0, 50);
        else if (i.text) {
          let d = i.text.substring(0, 50);
          if (c === "list") {
            const p = i.text.split(`
`)[0].trim();
            p && (d = p.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (c === "table") {
            const p = i.text.split(`
`)[0].trim();
            p && (d = p.replace(/\|/g, "").trim());
          } else if (c === "quote") {
            const p = i.text.split(`
`)[0].trim();
            p && (d = p.replace(/^>\s+/, ""));
          } else if (c === "image") {
            const p = i.text.match(/caption:\s*(.+)/i);
            p && p[1] ? d = p[1].trim() : d = i.text.trim();
          }
          o = d;
        } else
          o = `块 ${e}`, console.log(`❌ 没有找到合适的标题，使用块ID: ${e}`);
      } catch (h) {
        this.warn("获取标题失败:", h), o = `块 ${e}`;
      }
      try {
        const h = this.findProperty(i, "_color"), d = this.findProperty(i, "_icon");
        h && h.type === 1 && (a = h.value), d && d.type === 1 ? (r = d.value, this.log(`🎨 使用用户自定义图标: ${r} (块ID: ${e})`)) : (this.showBlockTypeIcons || c === "journal") && (r = this.getBlockTypeIcon(c), this.log(`🎨 使用块类型图标: ${r} (块类型: ${c}, 块ID: ${e})`));
      } catch (h) {
        this.warn("获取属性失败:", h), r = this.getBlockTypeIcon(c);
      }
      return {
        blockId: e,
        panelId: t,
        title: o || `块 ${e}`,
        color: a,
        icon: r,
        isJournal: l,
        isPinned: !1,
        // 新标签默认不固定
        order: n,
        blockType: c
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
    const e = orca.state.themeMode === "dark", t = "rgba(255, 255, 255, 0.1)";
    let n, i, o;
    if (this.isFixedToTop ? (n = { x: 0, y: 0 }, i = !1, o = window.innerWidth) : (n = this.isVerticalMode ? this.verticalPosition : this.position, i = this.isVerticalMode, o = this.verticalWidth), this.tabContainer = xn(
      i,
      n,
      o,
      t
    ), this.isFixedToTop) {
      const r = document.querySelector(".headbar") || document.querySelector(".toolbar") || document.querySelector(".top-bar") || document.querySelector('[class*="head"]') || document.querySelector('[class*="toolbar"]') || document.querySelector('[class*="bar"]') || document.body;
      this.log("🔍 查找顶部工具栏:", {
        headbar: (r == null ? void 0 : r.className) || (r == null ? void 0 : r.tagName),
        headbarExists: !!r,
        bodyChildren: document.body.children.length
      }), r.appendChild(this.tabContainer), r === document.body ? this.tabContainer.style.cssText += `
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10000;
          background: rgba(255, 255, 255, 0.95);
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
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin: 0 4px;
          padding: 0 8px;
          gap: 4px;
        `, this.tabContainer.classList.add("fixed-to-top"), this.log(`📌 标签页已添加到顶部工具栏: ${r.className || r.tagName}`);
    } else
      document.body.appendChild(this.tabContainer);
    this.tabContainer.addEventListener("mousedown", (r) => {
      const l = r.target;
      l.closest(".orca-tab, .new-tab-button, .drag-handle") && !l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && r.stopPropagation();
    }), this.tabContainer.addEventListener("click", (r) => {
      const l = r.target;
      l.closest(".orca-tab, .new-tab-button, .drag-handle") && !l.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && (r.stopPropagation(), console.log(`🖱️ 标签栏容器点击事件被阻止: ${l.className}`));
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
      /* 拖拽中的标签样式 */
      .orca-tab[data-dragging="true"] {
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
      .orca-tab[data-drag-over="true"] {
        border: 2px solid #3b82f6;
        transform: scale(1.02);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
        position: relative;
      }

      /* 拖拽悬停目标指示器 */
      .orca-tab[data-drag-over="true"]::before {
        content: '';
        position: absolute;
        left: -2px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: #3b82f6;
        border-radius: 2px;
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
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
      .orca-tabs-container[data-dragging="true"] {
        background: rgba(255, 255, 255, 0.15);
        border: 2px dashed rgba(239, 68, 68, 0.4);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      /* 拖拽时的过渡动画 */
      .orca-tab {
        transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        will-change: transform, box-shadow, background, opacity, border;
      }

      /* 未选中标签的基础样式 */
      .orca-tab {
        opacity: 0.85;
        border: 1px solid transparent;
      }

      /* 选中/悬停的标签样式 */
      .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]) {
        opacity: 1;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transform: scale(1.02);
        transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      /* 暗色模式下的选中样式 */
      .dark .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]) {
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);
      }

      /* 点击/激活状态的标签样式 */
      .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]) {
        opacity: 1;
        border: 1px solid rgba(0, 0, 0, 0.3);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
        transform: scale(0.98);
        transition: all 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      /* 暗色模式下的点击样式 */
      .dark .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]) {
        border: 1px solid rgba(255, 255, 255, 0.4);
        box-shadow: 0 1px 4px rgba(255, 255, 255, 0.2);
      }

      /* 聚焦状态的标签样式 */
      .orca-tab[data-focused="true"] {
        opacity: 1 !important;
        border: 2px solid #3b82f6 !important;
        box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(59, 130, 246, 0.3) !important;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05)) !important;
        transform: scale(1.02) !important;
        transition: all 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的聚焦样式 */
      .dark .orca-tab[data-focused="true"] {
        border: 2px solid #60a5fa !important;
        box-shadow: 0 0 0 1px rgba(96, 165, 250, 0.3), 0 2px 8px rgba(96, 165, 250, 0.2) !important;
        background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(96, 165, 250, 0.08)) !important;
      }

      /* 拖拽时的光标样式 */
      .orca-tab[draggable="true"] {
        cursor: pointer;
      }

      .orca-tab[draggable="true"]:active {
        cursor: pointer;
      }

      /* 拖拽时的标签容器动画 */
      .orca-tabs-container[data-dragging="true"] .orca-tab:not([data-dragging="true"]) {
        transition: all 0.2s ease;
      }

      /* 拖拽完成后的回弹效果 */
      .orca-tab[data-dragging="true"] {
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

      /* 全局鼠标样式 */
      body.resizing {
        cursor: nwse-resize;
      }

      body.dragging {
        cursor: move;
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
    if (e - this.lastUpdateTime < 50) {
      this.isUpdating = !1;
      return;
    }
    this.lastUpdateTime = e;
    const t = this.tabContainer.querySelector(".drag-handle");
    this.tabContainer.querySelector(".new-tab-button"), this.tabContainer.querySelector(".workspace-button"), this.tabContainer.innerHTML = "", t && this.tabContainer.appendChild(t);
    const n = this.panelIds.length > 0 && document.querySelector(`.orca-panel[data-panel-id="${this.panelIds[0]}"]`), i = this.currentPanelIndex === 0;
    if (n && i ? (this.log("📋 显示第一个面板的固化标签页"), this.sortTabsByPinStatus(), this.firstPanelTabs.forEach((o, a) => {
      var l;
      const r = this.createTabElement(o);
      (l = this.tabContainer) == null || l.appendChild(r);
    }), this.addNewTabButton()) : await this.showCurrentPanelTabsSync(), this.isFixedToTop) {
      const o = orca.state.themeMode === "dark", a = o ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", r = o ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)", l = o ? "#ffffff" : "#333", c = this.tabContainer.querySelectorAll(".orca-tab");
      c.forEach((d) => {
        const p = d.getAttribute("data-tab-id");
        if (!p) return;
        const g = this.getCurrentPanelTabs().find((b) => b.blockId === p);
        if (g) {
          let b, f, x = "normal";
          if (o ? (b = "rgba(255, 255, 255, 0.1)", f = "#ffffff") : (b = "rgba(200, 200, 200, 0.6)", f = "#333333"), g.color)
            try {
              b = this.applyOklchFormula(g.color, "background"), f = this.applyOklchFormula(g.color, "text"), x = "600";
            } catch (v) {
              console.warn("颜色处理失败，使用默认颜色:", v);
            }
          d.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${b};
            border-radius: 4px;
            border: 1px solid ${r};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${f};
            font-weight: ${x};
            max-width: 150px;
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
          background: ${a};
          border-radius: 4px;
          border: 1px solid ${r};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${l};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${c.length}`);
    }
    this.isUpdating = !1;
  }
  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || !this.tabContainer) return;
    let e = this.getCurrentPanelTabs();
    this.currentPanelIndex !== 0 && (await this.scanAndSaveCurrentPanelTabs(), e = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${e.length} 个标签页`);
    const t = document.createDocumentFragment();
    if (e.length > 0)
      e.forEach((n, i) => {
        const o = this.createTabElement(n);
        t.appendChild(o);
      });
    else {
      const n = document.createElement("div");
      n.className = "panel-status", n.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: #333;
        font-weight: normal;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: auto;
      `;
      const i = this.currentPanelIndex + 1;
      n.textContent = `面板 ${i}（无标签页）`, n.title = `当前在面板 ${i}，该面板没有标签页`, t.appendChild(n);
    }
    this.tabContainer.appendChild(t), this.addNewTabButton();
  }
  /**
   * 扫描并保存当前面板的标签数据
   */
  async scanAndSaveCurrentPanelTabs() {
    if (!this.currentPanelId) return;
    const e = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!e) {
      this.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }
    const t = e.querySelectorAll(".orca-hideable"), n = this.getCurrentPanelTabs(), i = [];
    let o = 0;
    for (const r of t) {
      const l = r.querySelector(".orca-block-editor");
      if (!l) continue;
      const c = l.getAttribute("data-block-id");
      if (!c) continue;
      const h = await this.getTabInfo(c, this.currentPanelId, o++);
      h && i.push(h);
    }
    const a = this.mergeTabsIntelligently(n, i);
    this.setCurrentPanelTabs(a), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), this.log(`📋 面板 ${this.currentPanelIndex + 1} 扫描并保存了 ${a.length} 个标签页`);
  }
  /**
   * 智能合并标签数组
   */
  mergeTabsIntelligently(e, t) {
    const n = [], i = new Set(e.map((o) => o.blockId));
    for (const o of e)
      if (t.some((r) => r.blockId === o.blockId)) {
        const r = t.find((l) => l.blockId === o.blockId);
        r ? n.push({
          ...o,
          title: r.title,
          blockType: r.blockType,
          icon: r.icon
        }) : n.push(o);
      }
    for (const o of t)
      i.has(o.blockId) || n.push(o);
    return n;
  }
  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || !this.tabContainer) return;
    let e = this.getCurrentPanelTabs();
    this.currentPanelIndex !== 0 && (await this.scanAndSaveCurrentPanelTabs(), e = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${e.length} 个标签页`);
    const t = document.createDocumentFragment();
    if (e.length > 0)
      e.forEach((n, i) => {
        const o = this.createTabElement(n);
        t.appendChild(o);
      });
    else {
      const n = document.createElement("div");
      n.className = "panel-status", n.style.cssText = `
        background: rgba(100, 150, 200, 0.6);
        color: #333;
        font-weight: normal;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        backdrop-filter: blur(2px);
        -webkit-backdrop-filter: blur(2px);
        -webkit-app-region: no-drag;
        app-region: no-drag;
        pointer-events: auto;
      `;
      const i = this.currentPanelIndex + 1;
      n.textContent = `面板 ${i}（无标签页）`, n.title = `当前在面板 ${i}，该面板没有标签页`, t.appendChild(n);
    }
    this.tabContainer.appendChild(t), this.addNewTabButton();
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
      border-radius: 4px;
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
      border-radius: 4px;
      transition: all 0.2s ease;
    `;
    t.style.cssText = n, t.innerHTML = "+", t.title = "新建标签页", t.addEventListener("mouseenter", () => {
      t.style.background = "rgba(0, 0, 0, 0.1)", t.style.color = "#333";
    }), t.addEventListener("mouseleave", () => {
      t.style.background = "transparent", t.style.color = "#666";
    }), t.addEventListener("click", async (i) => {
      i.preventDefault(), i.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(t), this.addNewTabButtonContextMenu(t), this.enableWorkspaces && this.addWorkspaceButton();
  }
  /**
   * 添加工作区按钮
   */
  addWorkspaceButton() {
    var i;
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
      border-radius: 4px;
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
      border-radius: 4px;
      transition: all 0.2s ease;
    `;
    t.style.cssText = n, t.innerHTML = "📁", t.title = `工作区 (${((i = this.workspaces) == null ? void 0 : i.length) || 0})`, t.addEventListener("mouseenter", () => {
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
    const t = document.querySelector(".new-tab-context-menu");
    t && t.remove();
    const n = document.createElement("div");
    n.className = "new-tab-context-menu";
    const i = 200, o = 140;
    let a = e.clientX, r = e.clientY;
    a + i > window.innerWidth && (a = window.innerWidth - i - 10), r + o > window.innerHeight && (r = window.innerHeight - o - 10), a = Math.max(10, a), r = Math.max(10, r), n.style.cssText = `
      position: fixed;
      left: ${a}px;
      top: ${r}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    ), l.forEach((h) => {
      if (h.separator) {
        const u = document.createElement("div");
        u.style.cssText = `
          height: 1px;
          background: #ddd;
          margin: 4px 8px;
        `, n.appendChild(u);
        return;
      }
      const d = document.createElement("div");
      if (d.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        color: #333;
        transition: background-color 0.2s ease;
      `, h.icon) {
        const u = document.createElement("span");
        u.textContent = h.icon, u.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, d.appendChild(u);
      }
      const p = document.createElement("span");
      p.textContent = h.text, d.appendChild(p), d.addEventListener("mouseenter", () => {
        d.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      }), d.addEventListener("mouseleave", () => {
        d.style.backgroundColor = "transparent";
      }), d.addEventListener("click", () => {
        h.action && h.action(), n.remove();
      }), n.appendChild(d);
    }), document.body.appendChild(n);
    const c = (h) => {
      n.contains(h.target) || (n.remove(), document.removeEventListener("click", c));
    };
    setTimeout(() => {
      document.addEventListener("click", c);
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
    let i;
    t ? i = "closed" : n ? i = "opened" : i = "unknown", this.lastSidebarState !== i && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${i}`), this.lastSidebarState = i, this.autoAdjustSidebarAlignment());
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
      const n = t.classList.contains("sidebar-closed"), i = t.classList.contains("sidebar-opened");
      if (!n && !i) {
        this.log("⚠️ 无法确定侧边栏状态，跳过对齐");
        return;
      }
      const o = this.getCurrentPosition();
      if (!o) return;
      const a = this.calculateSidebarAlignmentPosition(
        o,
        e,
        n,
        i
      );
      if (!a) return;
      await this.updatePosition(a), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${o.x}, ${o.y}) → (${a.x}, ${a.y})`);
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
  calculateSidebarAlignmentPosition(e, t, n, i) {
    var a;
    let o;
    if (n)
      o = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${o}px`);
    else if (i) {
      o = e.x + t;
      const r = ((a = this.tabContainer) == null ? void 0 : a.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      o = Math.min(o, window.innerWidth - r - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${o}px`);
    } else
      return null;
    return { x: o, y: e.y };
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
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), this.registerHeadbarButton(), await this.storageService.saveConfig(w.FLOATING_WINDOW_VISIBLE, this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("切换浮窗状态失败:", e);
    }
  }
  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    try {
      const e = await this.storageService.getConfig(w.FLOATING_WINDOW_VISIBLE, "orca-tabs-plugin", !1);
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
        var n, i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (o) => this.showRecentlyClosedTabsMenu(o),
          title: `最近关闭的标签页 (${((n = this.recentlyClosedTabs) == null ? void 0 : n.length) || 0})`,
          style: {
            color: (((i = this.recentlyClosedTabs) == null ? void 0 : i.length) || 0) > 0 ? "#ff6b6b" : "#999",
            transition: "color 0.2s ease"
          }
        }, e.createElement("i", {
          className: "ti ti-history"
        }));
      }), this.enableMultiTabSaving && typeof window < "u" && orca.headbar.registerHeadbarButton("orca-tabs-plugin.savedTabsButton", () => {
        var n, i;
        const e = window.React, t = orca.components.Button;
        return e.createElement(t, {
          variant: "plain",
          onClick: (o) => this.showSavedTabSetsMenu(o),
          title: `保存的标签页集合 (${((n = this.savedTabSets) == null ? void 0 : n.length) || 0})`,
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
      orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.toggleButton"), orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.debugButton"), orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.recentlyClosedButton"), orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.savedTabsButton"), this.log("🔘 顶部工具栏按钮已注销");
    } catch (e) {
      this.error("注销顶部工具栏按钮失败:", e);
    }
  }
  /**
   * 显示块类型图标信息（调试功能）
   */
  showBlockTypeIconsInfo() {
    const e = this.getAllBlockTypeIcons();
    console.log("🎨 支持的块类型和图标:"), console.table(e), this.firstPanelTabs.length > 0 && (console.log("📋 当前标签的块类型:"), this.firstPanelTabs.forEach((t, n) => {
      console.log(`${n + 1}. ${t.title} (${t.blockType || "unknown"}) - ${t.icon}`);
    })), this.log("🎨 块类型图标信息已输出到控制台");
  }
  /**
   * 切换块类型图标显示
   */
  async toggleBlockTypeIcons() {
    this.showBlockTypeIcons = !this.showBlockTypeIcons, this.log(`🎨 切换块类型图标显示: ${this.showBlockTypeIcons ? "开启" : "关闭"}`), await this.updateTabsUI(), await this.registerHeadbarButton();
    try {
      await this.saveLayoutMode(), await this.storageService.saveConfig("showBlockTypeIcons", this.showBlockTypeIcons), this.log(`✅ 块类型图标显示设置已保存: ${this.showBlockTypeIcons ? "开启" : "关闭"}`);
    } catch (e) {
      this.error("保存设置失败:", e);
    }
  }
  /**
   * 更新所有标签页的块类型和图标
   */
  async updateAllTabsBlockTypes() {
    if (this.log("🔄 开始更新所有标签页的块类型和图标..."), this.firstPanelTabs.length === 0) {
      this.log("⚠️ 没有标签页需要更新");
      return;
    }
    let e = !1;
    for (let t = 0; t < this.firstPanelTabs.length; t++) {
      const n = this.firstPanelTabs[t];
      try {
        const i = await orca.invokeBackend("get-block", parseInt(n.blockId));
        if (i) {
          const o = await this.detectBlockType(i);
          let a = n.icon;
          a || (a = this.getBlockTypeIcon(o)), n.blockType !== o || n.icon !== a ? (this.firstPanelTabs[t] = {
            ...n,
            blockType: o,
            icon: a
          }, this.log(`✅ 更新标签: ${n.title} -> 类型: ${o}, 图标: ${a}`), e = !0) : this.verboseLog(`⏭️ 跳过标签: ${n.title} (无需更新)`);
        }
      } catch (i) {
        this.warn(`更新标签失败: ${n.title}`, i);
      }
    }
    e ? (this.log("🔄 检测到更新，重新创建UI..."), await this.createTabsUI()) : this.log("ℹ️ 没有标签页需要更新"), this.log("✅ 所有标签页的块类型和图标已更新");
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
        const o = parseInt(n.replace("px", ""));
        if (isNaN(o))
          this.log(`⚠️ CSS变量值无法解析为数字: "${n}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${o}px`), o;
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
    const t = e.clientX, n = this.verticalWidth, i = async (a) => {
      const r = a.clientX - t, l = Math.max(120, Math.min(400, n + r));
      this.verticalWidth = l;
      try {
        orca.nav.changeSizes(orca.state.activePanel, [l]), this.tabContainer.style.width = `${l}px`;
      } catch (c) {
        this.error("调整面板宽度失败:", c);
      }
    }, o = async () => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", o);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (a) {
        this.error("保存宽度设置失败:", a);
      }
    };
    document.addEventListener("mousemove", i), document.addEventListener("mouseup", o);
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
    const t = this.verticalWidth, n = yn(
      this.verticalWidth,
      async (i) => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [i]), this.tabContainer && (this.tabContainer.style.width = `${i}px`), this.verticalWidth = i, await this.saveLayoutMode();
        } catch (o) {
          this.error("实时调整面板宽度失败:", o);
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
    const i = orca.state.themeMode === "dark", o = this.isVerticalMode && !this.isFixedToTop, a = Jt(e, o, i, (c, h) => this.applyOklchFormula(c, h));
    t.style.cssText = a;
    const r = Zt();
    if (e.icon && this.showBlockTypeIcons) {
      const c = Kt(e.icon);
      r.appendChild(c);
    }
    const l = Qt(e.title);
    if (r.appendChild(l), e.isPinned) {
      const c = en();
      r.appendChild(c);
    }
    return t.appendChild(r), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), t.title = tn(e), t.addEventListener("click", (c) => {
      var d;
      console.log(`🖱️ 标签点击事件触发: ${e.title} (ID: ${e.blockId})`), c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.log(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`);
      const h = (d = this.tabContainer) == null ? void 0 : d.querySelectorAll(".orca-tab");
      h == null || h.forEach((p) => p.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (c) => {
      console.log(`🖱️ 标签mousedown事件触发: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dblclick", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.closeTab(e));
    }), t.addEventListener("keydown", (c) => {
      (c.target === t || t.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(e)) : c.ctrlKey && c.key === "p" ? (c.preventDefault(), c.stopPropagation(), this.toggleTabPinStatus(e)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (c) => {
      var d;
      if (c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", (d = c.dataTransfer) == null || d.setData("text/plain", e.blockId), this.draggingTab = e, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), t.setAttribute("data-dragging", "true"), t.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", (c) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.hideDropZoneIndicator(), this.clearDragVisualFeedback(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (c) => {
      if (!c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (c.preventDefault(), c.stopPropagation(), c.dataTransfer.dropEffect = "move", !this.dragOverTab || this.dragOverTab.blockId !== e.blockId) {
          const d = t.getBoundingClientRect(), p = d.top + d.height / 2, u = c.clientY < p ? "before" : "after";
          this.updateDropIndicator(t, u), this.dragOverTab = e;
        }
        this.debouncedSwapTab(e, this.draggingTab), this.verboseLog(`🔄 拖拽经过: ${e.title} (目标: ${this.draggingTab.title})`);
      }
    }), t.addEventListener("dragenter", (c) => {
      c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== e.blockId && (c.preventDefault(), c.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`));
    }), t.addEventListener("dragleave", (c) => {
      const h = t.getBoundingClientRect(), d = c.clientX, p = c.clientY, u = 5;
      (d < h.left - u || d > h.right + u || p < h.top - u || p > h.bottom + u) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (c) => {
      var d;
      c.preventDefault();
      const h = (d = c.dataTransfer) == null ? void 0 : d.getData("text/plain");
      this.log(`🔄 拖拽放置: ${h} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return Ut(e, t);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const n = parseInt(t[1], 16), i = parseInt(t[2], 16), o = parseInt(t[3], 16);
      return (0.299 * n + 0.587 * i + 0.114 * o) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (n) {
      let i = parseInt(n[1], 16), o = parseInt(n[2], 16), a = parseInt(n[3], 16);
      i = Math.floor(i * (1 - t)), o = Math.floor(o * (1 - t)), a = Math.floor(a * (1 - t));
      const r = i.toString(16).padStart(2, "0"), l = o.toString(16).padStart(2, "0"), c = a.toString(16).padStart(2, "0");
      return `#${r}${l}${c}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, n) {
    const i = e / 255, o = t / 255, a = n / 255, r = (W) => W <= 0.04045 ? W / 12.92 : Math.pow((W + 0.055) / 1.055, 2.4), l = r(i), c = r(o), h = r(a), d = l * 0.4124564 + c * 0.3575761 + h * 0.1804375, p = l * 0.2126729 + c * 0.7151522 + h * 0.072175, u = l * 0.0193339 + c * 0.119192 + h * 0.9503041, g = 0.2104542553 * d + 0.793617785 * p - 0.0040720468 * u, b = 1.9779984951 * d - 2.428592205 * p + 0.4505937099 * u, f = 0.0259040371 * d + 0.7827717662 * p - 0.808675766 * u, x = Math.cbrt(g), v = Math.cbrt(b), k = Math.cbrt(f), I = 0.2104542553 * x + 0.793617785 * v + 0.0040720468 * k, T = 1.9779984951 * x - 2.428592205 * v + 0.4505937099 * k, S = 0.0259040371 * x + 0.7827717662 * v - 0.808675766 * k, y = Math.sqrt(T * T + S * S), M = Math.atan2(S, T) * 180 / Math.PI, D = M < 0 ? M + 360 : M;
    return { l: I, c: y, h: D };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, n) {
    const i = n * Math.PI / 180, o = t * Math.cos(i), a = t * Math.sin(i), r = e, l = o, c = a, h = r * r * r, d = l * l * l, p = c * c * c, u = 1.0478112 * h + 0.0228866 * d - 0.050217 * p, g = 0.0295424 * h + 0.9904844 * d + 0.0170491 * p, b = -92345e-7 * h + 0.0150436 * d + 0.7521316 * p, f = 3.2404542 * u - 1.5371385 * g - 0.4985314 * b, x = -0.969266 * u + 1.8760108 * g + 0.041556 * b, v = 0.0556434 * u - 0.2040259 * g + 1.0572252 * b, k = (y) => y <= 31308e-7 ? 12.92 * y : 1.055 * Math.pow(y, 1 / 2.4) - 0.055, I = Math.max(0, Math.min(255, Math.round(k(f) * 255))), T = Math.max(0, Math.min(255, Math.round(k(x) * 255))), S = Math.max(0, Math.min(255, Math.round(k(v) * 255)));
    return { r: I, g: T, b: S };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return bn(e, t);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 标签操作 - Tab Operations */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 获取当前面板的标签数组
   */
  getCurrentPanelTabs() {
    return this.currentPanelIndex === 0 ? this.firstPanelTabs : this.secondPanelTabs;
  }
  /**
   * 设置当前面板的标签数组
   */
  setCurrentPanelTabs(e) {
    this.currentPanelIndex === 0 ? this.firstPanelTabs = e : this.secondPanelTabs = e;
  }
  async switchToTab(e) {
    try {
      this.log(`🔄 开始切换标签: ${e.title} (ID: ${e.blockId})`);
      const t = this.getCurrentActiveTab();
      t && t.blockId !== e.blockId && (this.recordScrollPosition(t), this.lastActiveBlockId = t.blockId, this.log(`🎯 记录切换前的激活标签: ${t.title} (ID: ${t.blockId})`));
      const n = this.panelIds[this.currentPanelIndex];
      this.log(`🎯 目标面板ID: ${n}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        if (e.isJournal) {
          console.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${e.blockId}, 标题: ${e.title}`), this.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${e.blockId}`);
          let i = null, o = !1;
          console.log(`🔍 检查日期块标题: ${e.title}`);
          try {
            const a = await orca.invokeBackend("get-block", parseInt(e.blockId));
            if (a) {
              const r = Y(a);
              r && !isNaN(r.getTime()) && (i = r, console.log(`📅 从块信息获取日期: ${r.toISOString()}`), o = !1);
            }
          } catch (a) {
            console.log("❌ 获取块信息失败:", a);
          }
          if (!i)
            if (e.title.includes("今天") || e.title.includes("Today")) {
              console.log("📅 使用原生命令跳转到今天");
              try {
                await orca.commands.invokeCommand("core.goToday"), console.log("✅ 今天导航成功"), o = !0;
              } catch (a) {
                console.log("❌ 今天导航失败:", a), i = /* @__PURE__ */ new Date(), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else if (e.title.includes("昨天") || e.title.includes("Yesterday")) {
              console.log("📅 使用原生命令跳转到昨天");
              try {
                await orca.commands.invokeCommand("core.goYesterday"), console.log("✅ 昨天导航成功"), o = !0;
              } catch (a) {
                console.log("❌ 昨天导航失败:", a), i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() - 1), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else if (e.title.includes("明天") || e.title.includes("Tomorrow")) {
              console.log("📅 使用原生命令跳转到明天");
              try {
                await orca.commands.invokeCommand("core.goTomorrow"), console.log("✅ 明天导航成功"), o = !0;
              } catch (a) {
                console.log("❌ 明天导航失败:", a), i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() + 1), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else {
              const a = e.title.match(/(\d{4}-\d{2}-\d{2})/);
              if (a) {
                const r = a[1];
                i = /* @__PURE__ */ new Date(r + "T00:00:00.000Z"), isNaN(i.getTime()) ? (console.log(`❌ 无效的日期格式: ${r}`), i = null) : console.log(`📅 从标题提取日期: ${r} -> ${i.toISOString()}`);
              } else {
                console.log(`🔍 尝试从块信息中获取原始日期: ${e.blockId}`);
                try {
                  const r = await orca.invokeBackend("get-block", parseInt(e.blockId));
                  if (r) {
                    const l = Y(r);
                    l && !isNaN(l.getTime()) ? (i = l, console.log(`📅 从块信息获取日期: ${l.toISOString()}`)) : console.log("❌ 块信息中未找到有效日期信息");
                  } else
                    console.log("❌ 无法获取块信息");
                } catch (r) {
                  console.log("❌ 获取块信息失败:", r), this.warn("无法获取块信息:", r);
                }
              }
            }
          if (!o)
            if (i) {
              console.log(`📅 使用日期导航: ${i.toISOString().split("T")[0]}`), this.log(`📅 使用日期导航: ${i.toISOString().split("T")[0]}`);
              try {
                if (isNaN(i.getTime()))
                  throw new Error("Invalid date");
                console.log(`📅 使用简单日期格式: ${i.toISOString()}`), await orca.nav.goTo("journal", { date: i }, n), console.log("✅ 日期导航成功");
              } catch (a) {
                console.log("❌ 日期导航失败:", a);
                try {
                  console.log("🔄 尝试 Orca 日期格式");
                  const r = {
                    t: 2,
                    // 2 for full/absolute date
                    v: i.getTime()
                    // 使用时间戳
                  };
                  console.log("📅 使用 Orca 日期格式:", r), await orca.nav.goTo("journal", { date: r }, n), console.log("✅ Orca 日期导航成功");
                } catch (r) {
                  throw console.log("❌ Orca 日期导航也失败:", r), r;
                }
              }
            } else {
              console.log("⚠️ 未找到日期信息，尝试使用块ID导航"), this.log("⚠️ 未找到日期信息，尝试使用块ID导航");
              try {
                await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, n), console.log("✅ 块ID导航成功");
              } catch (a) {
                throw console.log("❌ 块ID导航失败:", a), a;
              }
            }
        } else
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${e.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, n);
        this.log("✅ orca.nav.goTo 导航成功");
      } catch (i) {
        this.warn("导航失败，尝试备用方法:", i);
        const o = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (o)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), o.click();
        else {
          this.error("无法找到目标块元素:", e.blockId);
          const a = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          a ? (this.log("🔄 找到备用块元素，尝试点击"), a.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = e.blockId, this.log(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
        this.debugScrollPosition(e);
      }, 500);
    } catch (t) {
      this.error("切换标签失败:", t);
    }
  }
  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(e) {
    const t = this.panelIds[0], n = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!n) return !1;
    const i = n.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    return i ? i.getAttribute("data-block-id") === e.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(e) {
    const t = this.firstPanelTabs.findIndex((i) => i.blockId === e.blockId);
    if (t === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let n = -1;
    if (t === 0 ? n = 1 : t === this.firstPanelTabs.length - 1 ? n = t - 1 : n = t + 1, n >= 0 && n < this.firstPanelTabs.length) {
      const i = this.firstPanelTabs[n];
      this.log(`🔄 自动切换到相邻标签: "${i.title}" (位置: ${n})`);
      const o = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(i.blockId) }, o);
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(e) {
    const t = this.getCurrentPanelTabs(), n = cn(e, t, {
      updateOrder: !0,
      saveData: !0,
      updateUI: !0
    });
    n.success ? (this.debouncedUpdateTabsUI(), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), this.log(n.message)) : this.warn(n.message);
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
          const i = window.React;
          return !i || !orca.components.MenuText ? null : i.createElement(orca.components.MenuText, {
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
          const i = window.React;
          return !i || !orca.components.MenuText || this.savedTabSets.length === 0 ? null : i.createElement(orca.components.MenuText, {
            title: "添加到已有标签组",
            preIcon: "ti ti-bookmark-plus",
            onClick: () => {
              n(), this.getTabInfo(e.toString(), this.currentPanelId, 0).then((o) => {
                o ? this.showAddToTabGroupDialog(o) : orca.notify("error", "无法获取块信息");
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
      const n = this.getCurrentPanelTabs(), i = {
        blockId: e,
        panelId: this.currentPanelId,
        title: t,
        isPinned: !1,
        order: n.length
      };
      this.log(`📋 新标签页信息: "${i.title}" (ID: ${e})`);
      const o = this.getCurrentActiveTab();
      let a = n.length;
      if (o) {
        const r = n.findIndex((l) => l.blockId === o.blockId);
        r !== -1 && (a = r + 1, this.log(`🎯 将在聚焦标签 "${o.title}" 后面插入新标签: "${i.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (n.length >= this.maxTabs) {
        n.splice(a, 0, i), this.verboseLog(`➕ 在位置 ${a} 插入新标签: ${i.title}`);
        const r = this.findLastNonPinnedTabIndex();
        if (r !== -1) {
          const l = n[r];
          n.splice(r, 1), this.log(`🗑️ 删除末尾的非固定标签: "${l.title}" 来保持数量限制`);
        } else {
          const l = n.findIndex((c) => c.blockId === i.blockId);
          if (l !== -1) {
            n.splice(l, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${i.title}"`);
            return;
          }
        }
      } else
        n.splice(a, 0, i), this.verboseLog(`➕ 在位置 ${a} 插入新标签: ${i.title}`);
      this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), await this.updateTabsUI(), await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${i.title}"`);
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
      } catch (i) {
        this.warn("备用方法也失败:", i);
      }
    }
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(e, t, n = !1) {
    try {
      const i = this.getCurrentPanelTabs();
      if (i.find((h) => h.blockId === e))
        return this.log(`📋 块 ${e} 已存在于标签页中`), n && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId), !0;
      if (!orca.state.blocks[parseInt(e)])
        return this.warn(`无法找到块 ${e}`), !1;
      const r = await this.getTabInfo(e, this.currentPanelId, i.length);
      if (!r)
        return this.warn(`无法获取块 ${e} 的标签信息`), !1;
      let l = i.length, c = !1;
      if (t === "replace") {
        const h = this.getCurrentActiveTab();
        if (!h)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const d = i.findIndex((p) => p.blockId === h.blockId);
        if (d === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        h.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), l = d + 1, c = !1) : (l = d, c = !0);
      } else if (t === "after") {
        const h = this.getCurrentActiveTab();
        if (h) {
          const d = i.findIndex((p) => p.blockId === h.blockId);
          d !== -1 && (l = d + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (i.length >= this.maxTabs)
        if (c)
          i[l] = r;
        else {
          i.splice(l, 0, r);
          const h = this.findLastNonPinnedTabIndex();
          if (h !== -1)
            i.splice(h, 1);
          else {
            const d = i.findIndex((p) => p.blockId === r.blockId);
            if (d !== -1)
              return i.splice(d, 1), !1;
          }
        }
      else
        c ? i[l] = r : i.splice(l, 0, r);
      return this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), await this.updateTabsUI(), n && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId), !0;
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
    var t, n;
    try {
      let i = e;
      for (; i && i !== document.body; ) {
        const o = i.classList;
        if (o.contains("orca-ref") || o.contains("block-ref") || o.contains("block-reference") || o.contains("orca-fragment-r") || o.contains("fragment-r") || o.contains("orca-block-reference") || i.tagName.toLowerCase() === "a" && ((t = i.getAttribute("href")) != null && t.startsWith("#"))) {
          const r = i.getAttribute("data-block-id") || i.getAttribute("data-ref-id") || i.getAttribute("data-blockid") || i.getAttribute("data-target-block-id") || i.getAttribute("data-fragment-v") || i.getAttribute("data-v") || ((n = i.getAttribute("href")) == null ? void 0 : n.replace("#", "")) || i.getAttribute("data-id");
          if (r && !isNaN(parseInt(r)))
            return this.log(`🔗 从元素中提取到块引用ID: ${r}`), r;
        }
        const a = i.dataset;
        for (const [r, l] of Object.entries(a))
          if ((r.toLowerCase().includes("block") || r.toLowerCase().includes("ref")) && l && !isNaN(parseInt(l)))
            return this.log(`🔗 从data属性 ${r} 中提取到块引用ID: ${l}`), l;
        i = i.parentElement;
      }
      if (e.textContent) {
        const o = e.textContent.trim(), a = o.match(/\[\[(?:块)?(\d+)\]\]/) || o.match(/block[:\s]*(\d+)/i);
        if (a && a[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${a[1]}`), a[1];
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
    try {
      const t = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let n = null;
      for (let o = t.length - 1; o >= 0; o--) {
        const a = t[o];
        if (a.offsetParent !== null && getComputedStyle(a).display !== "none") {
          n = a;
          break;
        }
      }
      if (!n) {
        this.log("🔗 未找到显示的右键菜单");
        return;
      }
      if (n.querySelector(".orca-tabs-ref-menu-item")) {
        this.log("🔗 块引用菜单项已存在");
        return;
      }
      if (this.log(`🔗 为块引用 ${e} 添加菜单项`), n.querySelectorAll('[role="menuitem"], .menu-item').length > 0) {
        const o = document.createElement("div");
        o.className = "orca-tabs-ref-menu-separator", o.style.cssText = `
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 4px 8px;
        `, n.appendChild(o);
      }
      if (this.savedTabSets.length > 0) {
        const o = document.createElement("div");
        o.className = "orca-tabs-ref-menu-item", o.setAttribute("role", "menuitem"), o.style.cssText = `
          padding: 12px 16px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #eee;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        `, o.innerHTML = `
          <i class="ti ti-bookmark-plus" style="font-size: 14px;"></i>
          <span>添加到已有标签组</span>
        `, o.addEventListener("mouseenter", () => {
          o.style.backgroundColor = "#f0f0f0";
        }), o.addEventListener("mouseleave", () => {
          o.style.backgroundColor = "transparent";
        }), o.addEventListener("click", () => {
          const a = this.getCurrentActiveTab();
          a && this.showAddToTabGroupDialog(a), n == null || n.remove();
        }), n.appendChild(o);
      }
      this.log(`✅ 成功为块引用 ${e} 添加菜单项`);
    } catch (t) {
      this.error("增强块引用右键菜单时出错:", t);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(e, t, n, i) {
    return Vt(e, t, n, i);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(e) {
    try {
      const t = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(t, orca.state.panels);
      if (n && n.viewState) {
        let i = null;
        const o = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (o) {
          const a = o.closest(".orca-panel");
          a && (i = a.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!i) {
          const a = document.querySelector(".orca-panel.active");
          a && (i = a.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (i || (i = document.body.scrollTop > 0 ? document.body : document.documentElement), i) {
          const a = {
            x: i.scrollLeft || 0,
            y: i.scrollTop || 0
          };
          n.viewState.scrollPosition = a;
          const r = this.firstPanelTabs.findIndex((l) => l.blockId === e.blockId);
          r !== -1 && (this.firstPanelTabs[r].scrollPosition = a, await this.saveFirstPanelTabs()), this.log(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, a, "容器:", i.className);
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
      const n = this.panelIds[this.currentPanelIndex], i = orca.nav.findViewPanel(n, orca.state.panels);
      if (i && i.viewState && i.viewState.scrollPosition && (t = i.viewState.scrollPosition, this.log(`🔄 从viewState恢复标签 "${e.title}" 滚动位置:`, t)), !t && e.scrollPosition && (t = e.scrollPosition, this.log(`🔄 从标签信息恢复标签 "${e.title}" 滚动位置:`, t)), !t) return;
      const o = (a = 1) => {
        if (a > 5) {
          this.warn(`恢复标签 "${e.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let r = null;
        const l = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (l) {
          const c = l.closest(".orca-panel");
          c && (r = c.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!r) {
          const c = document.querySelector(".orca-panel.active");
          c && (r = c.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        r || (r = document.body.scrollTop > 0 ? document.body : document.documentElement), r ? (r.scrollLeft = t.x, r.scrollTop = t.y, this.log(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", r.className, `尝试${a}`)) : setTimeout(() => o(a + 1), 200 * a);
      };
      o(), setTimeout(() => o(2), 100), setTimeout(() => o(3), 300);
    } catch (t) {
      this.warn("恢复滚动位置时出错:", t);
    }
  }
  /**
   * 调试滚动位置信息
   */
  debugScrollPosition(e) {
    this.log(`🔍 调试标签 "${e.title}" 滚动位置:`), this.log("标签保存的滚动位置:", e.scrollPosition);
    const t = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(t, orca.state.panels);
    n && n.viewState ? (this.log("viewState中的滚动位置:", n.viewState.scrollPosition), this.log("完整viewState:", n.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((o) => {
      document.querySelectorAll(o).forEach((r, l) => {
        const c = r;
        (c.scrollTop > 0 || c.scrollLeft > 0) && this.log(`容器 ${o}[${l}]:`, {
          scrollTop: c.scrollTop,
          scrollLeft: c.scrollLeft,
          className: c.className,
          id: c.id
        });
      });
    });
  }
  /**
   * 检查标签是否为当前激活状态
   */
  isTabActive(e) {
    try {
      const t = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
      if (!t) return !1;
      const n = t.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
      return n ? n.getAttribute("data-block-id") === e.blockId : !1;
    } catch (t) {
      return this.warn("检查标签激活状态时出错:", t), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    const e = this.enableWorkspaces ? this.firstPanelTabs : this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    const t = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!t) return null;
    const n = t.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) return null;
    const i = n.getAttribute("data-block-id");
    if (!i) return null;
    const o = e.find((a) => a.blockId === i) || null;
    return this.enableWorkspaces && this.currentWorkspace && o && this.updateCurrentWorkspaceActiveIndex(o), o;
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
    const n = e.findIndex((i) => i.blockId === t.blockId);
    return n === -1 ? -1 : n;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    const e = this.getCurrentPanelTabs();
    if (e.length === 0) return null;
    if (this.lastActiveBlockId) {
      const n = e.find((i) => i.blockId === this.lastActiveBlockId);
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
    const n = t.findIndex((i) => i.blockId === e.blockId);
    return n === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${e.title}" (索引${n}) 后面插入新标签`), n);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(e) {
    const t = this.getCurrentPanelTabs(), n = t.findIndex((i) => i.blockId === e.blockId);
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
    const n = t.findIndex((i) => i.blockId === e.blockId);
    if (n !== -1) {
      const i = this.getCurrentActiveTab(), o = i && i.blockId === e.blockId, a = o ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const r = { ...e, closedAt: Date.now() }, l = this.recentlyClosedTabs.findIndex((c) => c.blockId === e.blockId);
        l !== -1 && this.recentlyClosedTabs.splice(l, 1), this.recentlyClosedTabs.unshift(r), this.recentlyClosedTabs.length > 20 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 20)), await this.saveRecentlyClosedTabs();
      }
      t.splice(n, 1), this.debouncedUpdateTabsUI(), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), o && a ? (this.log(`🔄 自动切换到相邻标签: "${a.title}"`), await this.switchToTab(a)) : o && !a && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const e = this.getCurrentPanelTabs();
    e.filter((o) => !o.isPinned).forEach((o) => {
      this.closedTabs.add(o.blockId);
    });
    const n = e.filter((o) => o.isPinned), i = e.length - n.length;
    this.setCurrentPanelTabs(n), this.debouncedUpdateTabsUI(), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 已关闭 ${i} 个标签，保留了 ${n.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(e) {
    const t = this.getCurrentPanelTabs(), n = t.filter(
      (a) => a.blockId === e.blockId || a.isPinned
    );
    t.filter(
      (a) => a.blockId !== e.blockId && !a.isPinned
    ).forEach((a) => {
      this.closedTabs.add(a.blockId);
    });
    const o = t.length - n.length;
    this.setCurrentPanelTabs(n), this.debouncedUpdateTabsUI(), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 已关闭其他 ${o} 个标签，保留了当前标签和固定标签`);
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
    const i = t.textContent, o = t.style.cssText, a = document.createElement("input");
    a.type = "text", a.value = e.title, a.className = "inline-rename-input";
    const r = orca.state.themeMode === "dark";
    let l = r ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", c = r ? "#ffffff" : "#333";
    e.color && (l = this.applyOklchFormula(e.color, "background"), c = this.applyOklchFormula(e.color, "text")), a.style.cssText = `
      background: ${l};
      color: ${c};
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 4px 12px;
      height: 24px;
      line-height: 24px;
      font-size: 14px;
      font-weight: 600;
      outline: none;
      width: 100%;
      max-width: 150px;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, t.textContent = "", t.appendChild(a), t.style.padding = "2px 8px", a.focus(), a.select();
    const h = async () => {
      const p = a.value.trim();
      if (p && p !== e.title) {
        await this.updateTabTitle(e, p);
        return;
      }
      t.textContent = i, t.style.cssText = o;
    }, d = () => {
      t.textContent = i, t.style.cssText = o;
    };
    a.addEventListener("blur", h), a.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), h()) : p.key === "Escape" && (p.preventDefault(), d());
    }), a.addEventListener("click", (p) => {
      p.stopPropagation();
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
    const o = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let a = { x: "50%", y: "50%" };
    if (o) {
      const d = o.getBoundingClientRect(), p = window.innerWidth, u = window.innerHeight, g = 300, b = 100, f = 20;
      let x = d.left, v = d.top - b - 10;
      x + g > p - f && (x = p - g - f), x < f && (x = f), v < f && (v = d.bottom + 10, v + b > u - f && (v = (u - b) / 2)), v + b > u - f && (v = u - b - f), x = Math.max(f, Math.min(x, p - g - f)), v = Math.max(f, Math.min(v, u - b - f)), a = { x: `${x}px`, y: `${v}px` };
    }
    const r = orca.components.InputBox, l = t.createElement(r, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (d, p, u) => {
        d && d.trim() && d.trim() !== e.title && this.updateTabTitle(e, d.trim()), u();
      },
      onCancel: (d) => {
        d();
      }
    }, (d) => t.createElement("div", {
      style: {
        position: "absolute",
        left: a.x,
        top: a.y,
        pointerEvents: "auto"
      },
      onClick: d
    }, ""));
    n.render(l, i), setTimeout(() => {
      const d = i.querySelector("div");
      d && d.click();
    }, 0);
    const c = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(i), i.remove();
      }, 100);
    }, h = (d) => {
      d.key === "Escape" && (c(), document.removeEventListener("keydown", h));
    };
    document.addEventListener("keydown", h);
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
      background: rgba(255, 255, 255, 0.98);
      border: 2px solid #3b82f6;
      border-radius: 8px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      padding: 8px 12px;
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
      color: #333;
      width: 100%;
      padding: 4px 0;
    `;
    const o = document.createElement("div");
    o.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;
    const a = document.createElement("button");
    a.textContent = "确认", a.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    const r = document.createElement("button");
    r.textContent = "取消", r.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, a.addEventListener("mouseenter", () => {
      a.style.backgroundColor = "#2563eb";
    }), a.addEventListener("mouseleave", () => {
      a.style.backgroundColor = "#3b82f6";
    }), r.addEventListener("mouseenter", () => {
      r.style.backgroundColor = "#4b5563";
    }), r.addEventListener("mouseleave", () => {
      r.style.backgroundColor = "#6b7280";
    }), o.appendChild(a), o.appendChild(r), n.appendChild(i), n.appendChild(o);
    const l = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (l) {
      const p = l.getBoundingClientRect();
      n.style.left = `${p.left}px`, n.style.top = `${p.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), i.focus(), i.select();
    const c = () => {
      const p = i.value.trim();
      p && p !== e.title && this.updateTabTitle(e, p), n.remove();
    }, h = () => {
      n.remove();
    };
    a.addEventListener("click", c), r.addEventListener("click", h), i.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), c()) : p.key === "Escape" && (p.preventDefault(), h());
    });
    const d = (p) => {
      n.contains(p.target) || (h(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 100);
  }
  /**
   * 更新标签标题
   */
  async updateTabTitle(e, t) {
    try {
      const n = this.getCurrentPanelTabs(), i = dn(e, t, n, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      i.success ? (this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), await this.updateTabsUI(), this.log(i.message)) : this.warn(i.message);
    } catch (n) {
      this.error("重命名标签失败:", n);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(e, t) {
    const n = window.React, i = window.ReactDOM;
    if (!n || !i || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      setTimeout(() => {
        const o = window.React, a = window.ReactDOM;
        !o || !a || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? e.addEventListener("contextmenu", (r) => {
          r.preventDefault(), r.stopPropagation(), r.stopImmediatePropagation(), this.showTabContextMenu(r, t);
        }) : this.createOrcaContextMenu(e, t);
      }, 100);
      return;
    }
    this.createOrcaContextMenu(e, t);
  }
  createOrcaContextMenu(e, t) {
    const n = window.React, i = window.ReactDOM, o = document.createElement("div");
    o.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(o);
    const a = orca.components.ContextMenu, r = orca.components.Menu, l = orca.components.MenuText, c = orca.components.MenuSeparator, h = n.createElement(a, {
      menu: (u) => n.createElement(r, {}, [
        n.createElement(l, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            u(), this.renameTab(t);
          }
        }),
        n.createElement(l, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          shortcut: "Ctrl+P",
          onClick: () => {
            u(), this.toggleTabPinStatus(t);
          }
        }),
        n.createElement(c, { key: "separator1" }),
        n.createElement(l, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            u(), this.closeTab(t);
          }
        }),
        n.createElement(l, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            u(), this.closeOtherTabs(t);
          }
        }),
        n.createElement(l, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            u(), this.closeAllTabs();
          }
        })
      ])
    }, (u, g) => n.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        background: "transparent"
      },
      onContextMenu: (f) => {
        f.preventDefault(), f.stopPropagation(), u(f);
      }
    }));
    i.render(h, o);
    const d = () => {
      i.unmountComponentAtNode(o), o.remove();
    }, p = new MutationObserver((u) => {
      u.forEach((g) => {
        g.removedNodes.forEach((b) => {
          b === e && (d(), p.disconnect());
        });
      });
    });
    p.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const i = document.createElement("div");
    i.className = "tab-context-menu", i.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 180px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const o = [
      {
        text: "重命名标签",
        action: () => this.renameTab(t)
      },
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(t)
      }
    ];
    this.savedTabSets.length > 0 && o.push({
      text: "添加到已有标签组",
      action: () => this.showAddToTabGroupDialog(t)
    }), o.push(
      {
        text: "关闭标签",
        action: () => this.closeTab(t),
        disabled: this.firstPanelTabs.length <= 1
      },
      {
        text: "关闭其他标签",
        action: () => this.closeOtherTabs(t),
        disabled: this.firstPanelTabs.length <= 1
      },
      {
        text: "关闭全部标签",
        action: () => this.closeAllTabs(),
        disabled: this.firstPanelTabs.length <= 1
      }
    ), o.forEach((r) => {
      const l = document.createElement("div");
      l.textContent = r.text, l.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        color: ${r.disabled ? "#999" : "#333"};
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
      `, r.disabled || (l.addEventListener("mouseenter", () => {
        l.style.backgroundColor = "#f0f0f0";
      }), l.addEventListener("mouseleave", () => {
        l.style.backgroundColor = "transparent";
      }), l.addEventListener("click", () => {
        r.action(), i.remove();
      })), i.appendChild(l);
    }), document.body.appendChild(i);
    const a = (r) => {
      i.contains(r.target) || (i.remove(), document.removeEventListener("click", a));
    };
    setTimeout(() => {
      document.addEventListener("click", a);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    try {
      await this.storageService.saveConfig(w.FIRST_PANEL_TABS, this.firstPanelTabs), this.log("💾 保存标签数据到API配置");
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }
  /**
   * 保存第二个面板的标签数据到持久化存储（使用API）
   */
  async saveSecondPanelTabs() {
    try {
      await this.storageService.saveConfig(w.SECOND_PANEL_TABS, this.secondPanelTabs), this.log("💾 保存第二个面板标签数据到API配置");
    } catch (e) {
      this.warn("无法保存第二个面板标签数据:", e);
    }
  }
  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    try {
      await this.storageService.saveConfig(w.CLOSED_TABS, Array.from(this.closedTabs)), this.log("💾 保存已关闭标签列表到API配置");
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }
  /**
   * 保存最近关闭的标签页列表到持久化存储（使用API）
   */
  async saveRecentlyClosedTabs() {
    try {
      await this.storageService.saveConfig(w.RECENTLY_CLOSED_TABS, this.recentlyClosedTabs), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (e) {
      this.warn("无法保存最近关闭标签页列表:", e);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(w.FIRST_PANEL_TABS, "orca-tabs-plugin", []);
      e && Array.isArray(e) ? (this.firstPanelTabs = e, this.log(`📂 从API配置恢复了 ${this.firstPanelTabs.length} 个标签页`), await this.updateRestoredTabsBlockTypes()) : (this.firstPanelTabs = [], this.log("📂 没有找到持久化的标签数据，初始化为空数组"));
    } catch (e) {
      this.warn("无法恢复第一个面板标签数据:", e), this.firstPanelTabs = [];
    }
  }
  /**
   * 从持久化存储恢复第二个面板的标签数据（使用API）
   */
  async restoreSecondPanelTabs() {
    try {
      const e = await this.storageService.getConfig(w.SECOND_PANEL_TABS, "orca-tabs-plugin", []);
      e && Array.isArray(e) ? (this.secondPanelTabs = e, this.log(`📂 从API配置恢复了第二个面板的 ${this.secondPanelTabs.length} 个标签页`)) : (this.secondPanelTabs = [], this.log("📂 没有找到第二个面板的持久化标签数据，初始化为空数组"));
    } catch (e) {
      this.warn("无法恢复第二个面板标签数据:", e), this.secondPanelTabs = [];
    }
  }
  /**
   * 更新从存储中恢复的标签页的块类型和图标
   */
  async updateRestoredTabsBlockTypes() {
    if (this.log("🔄 更新从存储中恢复的标签页的块类型和图标..."), this.firstPanelTabs.length === 0) {
      this.log("⚠️ 没有标签页需要更新");
      return;
    }
    let e = !1;
    for (let t = 0; t < this.firstPanelTabs.length; t++) {
      const n = this.firstPanelTabs[t];
      if (!n.blockType || !n.icon)
        try {
          const o = await orca.invokeBackend("get-block", parseInt(n.blockId));
          if (o) {
            const a = await this.detectBlockType(o);
            let r = n.icon;
            r || (r = this.getBlockTypeIcon(a)), this.firstPanelTabs[t] = {
              ...n,
              blockType: a,
              icon: r
            }, this.log(`✅ 更新恢复的标签: ${n.title} -> 类型: ${a}, 图标: ${r}`), e = !0;
          }
        } catch (o) {
          this.warn(`更新恢复的标签失败: ${n.title}`, o);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${n.title} (已有块类型和图标)`);
    }
    e && (this.log("🔄 检测到恢复的标签页有更新，保存到存储..."), await this.saveFirstPanelTabs()), this.log("✅ 恢复的标签页块类型和图标更新完成");
  }
  /**
   * 从持久化存储恢复已关闭标签列表（使用API）
   */
  async restoreClosedTabs() {
    try {
      const e = await this.storageService.getConfig(w.CLOSED_TABS, "orca-tabs-plugin", []);
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
      const e = await this.storageService.getConfig(w.RECENTLY_CLOSED_TABS, "orca-tabs-plugin", []);
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
      await this.storageService.saveConfig(w.SAVED_TAB_SETS, this.savedTabSets), this.log("💾 保存多标签页集合到API配置");
    } catch (e) {
      this.warn("无法保存多标签页集合:", e);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合（使用API）
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(w.SAVED_TAB_SETS, "orca-tabs-plugin", []);
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
      const i = e.charCodeAt(n);
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
      const o = this.tabContainer.querySelector(".drag-handle");
      o && o.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const n = (o) => {
      this.isDragging && (o.preventDefault(), o.stopPropagation(), this.drag(o));
    }, i = (o) => {
      document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", i), this.stopDrag();
    };
    document.addEventListener("mousemove", n), document.addEventListener("mouseup", i), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), n = 5, i = window.innerWidth - t.width - 5, o = 5, a = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(n, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(o, Math.min(a, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(n, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(o, Math.min(a, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const r = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = r.x + "px", this.tabContainer.style.top = r.y + "px", this.ensureClickableElements();
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
      const e = Xt(
        this.position,
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      );
      this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, await this.saveLayoutMode(), this.log(`💾 位置已保存: ${de(this.position, this.isVerticalMode)}`);
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
      await this.storageService.saveConfig(w.LAYOUT_MODE, e), this.log(`💾 布局模式已保存: ${this.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${this.verticalWidth}px, 垂直位置: (${this.verticalPosition.x}, ${this.verticalPosition.y}), 水平位置: (${this.horizontalPosition.x}, ${this.horizontalPosition.y})`);
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
      await this.storageService.saveConfig(w.FIXED_TO_TOP, e), this.log(`💾 固定到顶部状态已保存: ${this.isFixedToTop ? "启用" : "禁用"}`);
    } catch (e) {
      this.error("保存固定到顶部状态失败:", e);
    }
  }
  /**
   * 确保所有元素都能正常点击（拖拽过程中调用）
   */
  ensureClickableElements() {
    document.body.style.pointerEvents = "auto", document.documentElement.style.pointerEvents = "auto", document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu").forEach((n) => {
      const i = n;
      i.style.pointerEvents === "none" && (i.style.pointerEvents = "auto");
    }), document.querySelectorAll('button, .btn, [role="button"]').forEach((n) => {
      const i = n;
      i.style.pointerEvents === "none" && (i.style.pointerEvents = "auto");
    });
  }
  /**
   * 强制重置所有可能被拖拽影响的元素
   */
  resetAllElements() {
    document.querySelectorAll("*").forEach((n) => {
      const i = n;
      (i.style.cursor === "grabbing" || i.style.cursor === "grab") && (i.style.cursor = ""), i.style.userSelect === "none" && (i.style.userSelect = ""), i.style.pointerEvents === "none" && (i.style.pointerEvents = ""), i.style.touchAction === "none" && (i.style.touchAction = "");
    }), document.querySelectorAll(".orca-panel, .orca-sidebar, .orca-menu, .orca-recents-menu, [data-panel-id]").forEach((n) => {
      const i = n;
      i.style.cursor = "", i.style.userSelect = "", i.style.pointerEvents = "auto", i.style.touchAction = "";
    }), this.log("🔄 重置所有元素样式");
  }
  async restorePosition() {
    try {
      this.position = j(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Yt(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${de(this.position, this.isVerticalMode)}`);
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
        "orca-tabs-plugin",
        X()
      );
      if (e) {
        const t = jt(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = j(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.log(`📐 布局模式已恢复: ${Gt(t)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const t = X();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = j(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
      const t = X();
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
    const e = this.isVerticalMode ? Math.min(this.firstPanelTabs.length * 28 + 8, window.innerHeight * 0.8) : 28;
    this.position = gn(this.position, this.isVerticalMode, this.verticalWidth, e);
  }
  /**
   * 检查新添加的块
   */
  async checkForNewBlocks() {
    this.panelIds.length === 0 || !this.isInitialized || (this.currentPanelIndex === 0 ? await this.checkFirstPanelBlocks() : (await this.scanAndSaveCurrentPanelTabs(), this.debouncedUpdateTabsUI()));
  }
  /**
   * 检查第一个面板的当前激活页面
   */
  async checkFirstPanelBlocks() {
    var h, d, p;
    const e = this.panelIds[0], t = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!t) return;
    const n = t.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) {
      this.log("第一个面板中没有找到激活的块编辑器");
      return;
    }
    const i = n.getAttribute("data-block-id");
    if (!i) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    const o = this.firstPanelTabs.find((u) => u.blockId === i);
    if (o) {
      this.verboseLog(`📋 当前激活页面已存在: "${o.title}"`);
      const u = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tab");
      u == null || u.forEach((b) => b.removeAttribute("data-focused"));
      const g = (d = this.tabContainer) == null ? void 0 : d.querySelector(`[data-tab-id="${i}"]`);
      g && (g.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${o.title}"`)), this.debouncedUpdateTabsUI();
      return;
    }
    let a = this.firstPanelTabs.length, r = !1;
    const l = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tab[data-focused="true"]');
    if (l) {
      const u = l.getAttribute("data-tab-id");
      if (u) {
        const g = this.firstPanelTabs.findIndex((b) => b.blockId === u);
        g !== -1 ? this.firstPanelTabs[g].isPinned ? (a = g + 1, r = !1, this.log("📌 聚焦标签是固定的，将在其后面插入新标签")) : (a = g, r = !0, this.log("🎯 聚焦标签不是固定的，将替换聚焦标签")) : this.log("🎯 聚焦的标签不在数组中，插入到末尾");
      } else
        this.log("🎯 聚焦的标签没有data-tab-id，插入到末尾");
    } else
      this.log("🎯 没有找到聚焦的标签，将替换最后一个非固定标签");
    this.log(`🎯 最终计算的insertIndex: ${a}, 是否替换聚焦标签: ${r}`);
    const c = await this.getTabInfo(i, e, this.firstPanelTabs.length);
    if (c) {
      if (this.verboseLog(`📋 检测到新的激活页面: "${c.title}"`), this.firstPanelTabs.length >= this.maxTabs)
        if (r && a < this.firstPanelTabs.length) {
          const u = this.firstPanelTabs[a];
          this.firstPanelTabs[a] = c, this.log(`🔄 替换聚焦标签: "${u.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((g, b) => `${b}:${g.title}`));
        } else if (a < this.firstPanelTabs.length) {
          this.log("🎯 插入前数组:", this.firstPanelTabs.map((g, b) => `${b}:${g.title}`)), this.firstPanelTabs.splice(a + 1, 0, c), this.log(`➕ 在位置 ${a + 1} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((g, b) => `${b}:${g.title}`));
          const u = this.findLastNonPinnedTabIndex();
          if (u !== -1) {
            const g = this.firstPanelTabs[u];
            this.firstPanelTabs.splice(u, 1), this.log(`🗑️ 删除末尾的非固定标签: "${g.title}" 来保持数量限制`), this.log("🎯 最终数组:", this.firstPanelTabs.map((b, f) => `${f}:${b.title}`));
          } else {
            const g = this.firstPanelTabs.findIndex((b) => b.blockId === c.blockId);
            if (g !== -1) {
              this.firstPanelTabs.splice(g, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
              return;
            }
          }
        } else {
          const u = this.findLastNonPinnedTabIndex();
          if (u !== -1) {
            const g = this.firstPanelTabs[u];
            this.firstPanelTabs[u] = c, this.log(`🔄 没有聚焦标签，替换最后一个非固定标签: "${g.title}" -> "${c.title}"`);
          } else {
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
            return;
          }
        }
      else if (r && a < this.firstPanelTabs.length) {
        const u = this.firstPanelTabs[a];
        this.firstPanelTabs[a] = c, this.log(`🔄 替换聚焦标签: "${u.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((g, b) => `${b}:${g.title}`));
      } else
        this.firstPanelTabs.splice(a, 0, c), this.verboseLog(`➕ 在位置 ${a} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((u, g) => `${g}:${u.title}`));
      this.closedTabs.has(i) && (this.closedTabs.delete(i), await this.saveClosedTabs(), this.log(`🔄 标签 "${c.title}" 重新显示，从已关闭列表中移除`)), await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI();
    } else
      this.log("无法获取激活页面的标签信息");
  }
  observeChanges() {
    new MutationObserver(async (t) => {
      let n = !1, i = !1, o = !1, a = this.currentPanelIndex;
      t.forEach((r) => {
        if (r.type === "childList") {
          const l = r.target;
          if ((l.classList.contains("orca-panels-row") || l.closest(".orca-panels-row")) && (this.verboseLog("🔍 检测到面板行变化，检查新面板..."), i = !0), r.addedNodes.length > 0 && l.closest(".orca-panel")) {
            for (const h of r.addedNodes)
              if (h.nodeType === Node.ELEMENT_NODE) {
                const d = h;
                if (d.classList.contains("orca-block-editor") || d.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        r.type === "attributes" && r.attributeName === "class" && r.target.classList.contains("orca-panel") && (o = !0);
      }), o && (await this.updateCurrentPanelIndex(), a !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${a} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), i && setTimeout(async () => {
        await this.checkForNewPanels();
      }, 100), n && setTimeout(async () => {
        await this.checkForNewBlocks();
      }, 100);
    }).observe(document.body, {
      childList: !0,
      subtree: !0,
      attributes: !0,
      attributeFilter: ["class"]
    });
  }
  /**
   * 检查新添加的面板
   */
  async checkForNewPanels() {
    const e = this.panelIds.length, t = [...this.panelIds];
    if (this.currentPanelId, this.discoverPanels(), this.panelIds.length > e)
      this.log(`🎉 发现新面板！从 ${e} 个增加到 ${this.panelIds.length} 个`), await this.createTabsUI();
    else if (this.panelIds.length < e) {
      this.log(`📉 面板数量减少！从 ${e} 个减少到 ${this.panelIds.length} 个`), this.log(`📋 旧面板列表: [${t.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const n = t[0], i = this.panelIds[0];
      n && i && n !== i && (this.log(`🔄 第一个面板已变更: ${n} -> ${i}`), await this.handleFirstPanelChange(n, i)), this.currentPanelId && !this.panelIds.includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0]), await this.createTabsUI();
    }
  }
  /**
   * 更新当前面板索引
   */
  async updateCurrentPanelIndex() {
    const e = document.querySelector(".orca-panel.active");
    if (e) {
      const t = e.getAttribute("data-panel-id");
      if (t) {
        const n = this.panelIds.indexOf(t);
        n !== -1 && (this.currentPanelIndex = n, this.currentPanelId = t, this.debouncedUpdateTabsUI());
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
    if ((e.ctrlKey || e.metaKey) && e.target) {
      const n = e.target, i = this.getBlockRefId(n);
      if (i) {
        e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.log(`🔗 检测到 Ctrl+点击 块引用: ${i}，将在后台新建标签页`), await this.openInNewTab(i);
        return;
      }
    }
    if (e.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
      this.log("🔄 检测到侧边栏/面板点击，跳过面板状态检查");
      return;
    }
    if (this.isDragging) {
      this.log("🔄 检测到拖拽过程中，跳过面板状态检查");
      return;
    }
    setTimeout(() => {
      this.debouncedCheckPanelStatus();
    }, 100);
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
    this.updateDebounceTimer && clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = setTimeout(async () => {
      await this.checkPanelStatusChange();
    }, 50);
  }
  /**
   * 检查面板状态是否发生变化
   */
  async checkPanelStatusChange() {
    if (document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])').length === this.panelIds.length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
      this.verboseLog("📋 面板数量未变化，跳过面板发现");
      return;
    }
    const t = [...this.panelIds];
    this.discoverPanels();
    const n = wn(t, this.panelIds);
    if (n) {
      this.log(`📋 面板列表发生变化: ${t.length} -> ${this.panelIds.length}`), this.log(`📋 旧面板列表: [${t.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const o = t[0], a = this.panelIds[0];
      o && a && o !== a && (this.log(`🔄 第一个面板已变更: ${o} -> ${a}`), this.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), await this.handleFirstPanelChange(o, a), this.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`));
    }
    const i = document.querySelector(".orca-panel.active");
    if (i) {
      const o = i.getAttribute("data-panel-id");
      if (o && (o !== this.currentPanelId || n)) {
        const a = this.currentPanelIndex, r = this.panelIds.indexOf(o);
        r !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${o} (索引: ${a} -> ${r})`), this.currentPanelIndex = r, this.currentPanelId = o, this.debouncedUpdateTabsUI());
      }
    }
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(e, t) {
    this.log(`🔄 处理第一个面板变更: ${e} -> ${t}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), this.log(`🗑️ 清空旧面板 ${e} 的固化标签数据`), this.firstPanelTabs = [], this.log(`🔍 为新的第一个面板 ${t} 创建固化标签`), await this.scanFirstPanel(), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，新建了 ${this.firstPanelTabs.length} 个固化标签`), this.log("✅ 新的固化标签:", this.firstPanelTabs.map((n) => `${n.title}(${n.blockId})`));
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
    this.log("🔄 开始重置插件缓存..."), this.firstPanelTabs = [], this.closedTabs.clear();
    try {
      await this.storageService.removeConfig(w.FIRST_PANEL_TABS), await this.storageService.removeConfig(w.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
    } catch (e) {
      this.warn("删除API配置缓存失败:", e);
    }
    this.panelIds.length > 0 && (this.log("🔍 重新扫描第一个面板..."), await this.scanFirstPanel(), await this.saveFirstPanelTabs()), await this.updateTabsUI(), this.log("✅ 插件缓存重置完成");
  }
  destroy() {
    this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
    const e = document.getElementById("orca-tabs-drag-styles");
    e && e.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.settingsCheckInterval && (clearInterval(this.settingsCheckInterval), this.settingsCheckInterval = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null;
  }
  /**
   * 显示最近关闭的标签页菜单
   */
  async showRecentlyClosedTabsMenu(e) {
    if (this.recentlyClosedTabs.length === 0) {
      orca.notify("info", "没有最近关闭的标签页");
      return;
    }
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, n = this.recentlyClosedTabs.map((i, o) => ({
      label: `${i.title}`,
      icon: i.icon || this.getBlockTypeIcon(i.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(i, o)
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
    const n = document.querySelector(".recently-closed-tabs-menu");
    n && n.remove();
    const i = document.createElement("div");
    i.className = "recently-closed-tabs-menu", i.style.cssText = `
      position: fixed;
      left: ${t.x}px;
      top: ${t.y}px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      z-index: 10000;
      min-width: 200px;
      max-width: 280px;
      max-height: 350px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((c, h) => {
      if (c.label === "---") {
        const u = document.createElement("div");
        u.style.cssText = `
          height: 1px;
          background: linear-gradient(to right, transparent, #e0e0e0, transparent);
          margin: 4px 8px;
        `, i.appendChild(u);
        return;
      }
      const d = document.createElement("div");
      if (d.className = "recently-closed-menu-item", d.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, c.icon) {
        const u = document.createElement("div");
        if (u.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: #666;
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, c.icon.startsWith("ti ti-")) {
          const g = document.createElement("i");
          g.className = c.icon, u.appendChild(g);
        } else
          u.textContent = c.icon;
        d.appendChild(u);
      }
      const p = document.createElement("span");
      p.textContent = c.label, p.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, d.appendChild(p), d.addEventListener("mouseenter", () => {
        d.style.backgroundColor = "#f5f5f5";
      }), d.addEventListener("mouseleave", () => {
        d.style.backgroundColor = "transparent";
      }), d.addEventListener("click", () => {
        c.onClick(), i.remove();
      }), i.appendChild(d);
    }), document.body.appendChild(i);
    const o = i.getBoundingClientRect(), a = window.innerWidth, r = window.innerHeight;
    o.right > a && (i.style.left = `${a - o.width - 10}px`), o.bottom > r && (i.style.top = `${r - o.height - 10}px`);
    const l = (c) => {
      i.contains(c.target) || (i.remove(), document.removeEventListener("click", l), document.removeEventListener("contextmenu", l));
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
    })), this.savedTabSets.forEach((i, o) => {
      n.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: i.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, o)
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
    }), this.savedTabSets.forEach((i, o) => {
      n.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, o)
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
    const n = document.querySelector(".multi-tab-saving-menu");
    n && n.remove();
    const i = document.createElement("div");
    i.className = "multi-tab-saving-menu", i.style.cssText = `
      position: fixed;
      left: ${t.x}px;
      top: ${t.y}px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      z-index: 10000;
      min-width: 200px;
      max-width: 300px;
      max-height: 400px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((c, h) => {
      if (c.label === "---") {
        const u = document.createElement("div");
        u.style.cssText = `
          height: 1px;
          background: #e0e0e0;
          margin: 4px 0;
        `, i.appendChild(u);
        return;
      }
      const d = document.createElement("div");
      if (d.className = "multi-tab-saving-menu-item", d.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        color: #333;
        border-bottom: 1px solid #f0f0f0;
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, c.icon) {
        const u = document.createElement("div");
        if (u.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: #666;
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, c.icon.startsWith("ti ti-")) {
          const g = document.createElement("i");
          g.className = c.icon, u.appendChild(g);
        } else
          u.textContent = c.icon;
        d.appendChild(u);
      }
      const p = document.createElement("span");
      p.textContent = c.label, p.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, d.appendChild(p), d.addEventListener("mouseenter", () => {
        d.style.backgroundColor = "#f5f5f5";
      }), d.addEventListener("mouseleave", () => {
        d.style.backgroundColor = "transparent";
      }), d.addEventListener("click", () => {
        c.onClick(), i.remove();
      }), i.appendChild(d);
    }), document.body.appendChild(i);
    const o = i.getBoundingClientRect(), a = window.innerWidth, r = window.innerHeight;
    o.right > a && (i.style.left = `${a - o.width - 10}px`), o.bottom > r && (i.style.top = `${r - o.height - 10}px`);
    const l = (c) => {
      i.contains(c.target) || (i.remove(), document.removeEventListener("click", l), document.removeEventListener("contextmenu", l));
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
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 450px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: auto;
    `, t.addEventListener("click", (y) => {
      y.stopPropagation();
    });
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, n.textContent = "保存标签页集合", t.appendChild(n);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 0 20px;
    `;
    const o = document.createElement("div");
    o.style.cssText = `
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    `;
    const a = document.createElement("button");
    a.textContent = "创建新标签组", a.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #3b82f6;
      background: #3b82f6;
      color: white;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    const r = document.createElement("button");
    r.textContent = "更新已有标签组", r.style.cssText = `
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      color: #666;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    `;
    let l = !1;
    const c = () => {
      l = !1, a.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #3b82f6;
        background: #3b82f6;
        color: white;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `, r.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
        color: #666;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `, d.style.display = "block", g.style.display = "none", T();
    }, h = () => {
      l = !0, r.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #3b82f6;
        background: #3b82f6;
        color: white;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `, a.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
        color: #666;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `, d.style.display = "none", g.style.display = "block", T();
    };
    a.onclick = c, r.onclick = h, o.appendChild(a), o.appendChild(r), i.appendChild(o);
    const d = document.createElement("div");
    d.style.cssText = `
      display: block;
    `;
    const p = document.createElement("label");
    p.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, p.textContent = "请输入新标签页集合名称:", d.appendChild(p);
    const u = document.createElement("input");
    u.type = "text", u.value = `标签页集合 ${this.savedTabSets.length + 1}`, u.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      user-select: text;
    `, u.addEventListener("focus", () => {
      u.style.borderColor = "#3b82f6";
    }), u.addEventListener("blur", () => {
      u.style.borderColor = "#ddd";
    }), u.addEventListener("input", (y) => {
      console.log("输入框输入:", y.target.value);
    }), d.appendChild(u);
    const g = document.createElement("div");
    g.style.cssText = `
      display: none;
    `;
    const b = document.createElement("label");
    b.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, b.textContent = "请选择要更新的标签页集合:", g.appendChild(b);
    const f = document.createElement("select");
    f.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      background: white;
    `, f.addEventListener("focus", () => {
      f.style.borderColor = "#3b82f6";
    }), f.addEventListener("blur", () => {
      f.style.borderColor = "#ddd";
    });
    const x = document.createElement("option");
    x.value = "", x.textContent = "请选择标签页集合...", f.appendChild(x), this.savedTabSets.forEach((y, M) => {
      const D = document.createElement("option");
      D.value = M.toString(), D.textContent = `${y.name} (${y.tabs.length}个标签)`, f.appendChild(D);
    }), g.appendChild(f), i.appendChild(d), i.appendChild(g), t.appendChild(i);
    const v = document.createElement("div");
    v.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const k = document.createElement("button");
    k.textContent = "取消", k.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, k.addEventListener("mouseenter", () => {
      k.style.backgroundColor = "#4b5563";
    }), k.addEventListener("mouseleave", () => {
      k.style.backgroundColor = "#6b7280";
    }), k.onclick = () => t.remove();
    const I = document.createElement("button");
    I.textContent = "保存", I.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, I.addEventListener("mouseenter", () => {
      I.style.backgroundColor = "#2563eb";
    }), I.addEventListener("mouseleave", () => {
      I.style.backgroundColor = "#3b82f6";
    });
    const T = () => {
      I.textContent = l ? "更新" : "保存";
    };
    I.onclick = async () => {
      if (l) {
        const y = parseInt(f.value);
        if (isNaN(y) || y < 0 || y >= this.savedTabSets.length) {
          orca.notify("warn", "请选择要更新的标签页集合");
          return;
        }
        t.remove(), await this.performUpdateTabSet(y);
      } else {
        const y = u.value.trim();
        if (!y) {
          orca.notify("warn", "请输入名称");
          return;
        }
        t.remove(), await this.performSaveTabSet(y);
      }
    }, v.appendChild(k), v.appendChild(I), t.appendChild(v), document.body.appendChild(t), setTimeout(() => {
      u.focus(), u.select();
    }, 100), u.addEventListener("keydown", (y) => {
      y.key === "Enter" ? (y.preventDefault(), I.click()) : y.key === "Escape" && (y.preventDefault(), k.click());
    });
    const S = (y) => {
      t.contains(y.target) || (t.remove(), document.removeEventListener("click", S));
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
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      pointer-events: auto;
    `, n.addEventListener("click", (u) => {
      u.stopPropagation();
    });
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, i.textContent = "添加到已有标签组", n.appendChild(i);
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 0 20px;
    `;
    const a = document.createElement("label");
    a.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, a.textContent = `将标签页 "${e.title}" 添加到:`, o.appendChild(a);
    const r = document.createElement("select");
    r.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      background: white;
    `, r.addEventListener("focus", () => {
      r.style.borderColor = "#3b82f6";
    }), r.addEventListener("blur", () => {
      r.style.borderColor = "#ddd";
    });
    const l = document.createElement("option");
    l.value = "", l.textContent = "请选择标签组...", r.appendChild(l), this.savedTabSets.forEach((u, g) => {
      const b = document.createElement("option");
      b.value = g.toString(), b.textContent = `${u.name} (${u.tabs.length}个标签)`, r.appendChild(b);
    }), o.appendChild(r), n.appendChild(o);
    const c = document.createElement("div");
    c.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const h = document.createElement("button");
    h.textContent = "取消", h.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#4b5563";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "#6b7280";
    }), h.onclick = () => n.remove();
    const d = document.createElement("button");
    d.textContent = "添加", d.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, d.addEventListener("mouseenter", () => {
      d.style.backgroundColor = "#2563eb";
    }), d.addEventListener("mouseleave", () => {
      d.style.backgroundColor = "#3b82f6";
    }), d.onclick = async () => {
      const u = parseInt(r.value);
      if (isNaN(u) || u < 0 || u >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      n.remove(), await this.addTabToGroup(e, u);
    }, c.appendChild(h), c.appendChild(d), n.appendChild(c), document.body.appendChild(n), setTimeout(() => {
      r.focus();
    }, 100), r.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), d.click()) : u.key === "Escape" && (u.preventDefault(), h.click());
    });
    const p = (u) => {
      n.contains(u.target) || (n.remove(), document.removeEventListener("click", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p);
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
      if (n.tabs.find((o) => o.blockId === e.blockId)) {
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
      for (const i of e.tabs) {
        const o = { ...i, panelId: this.currentPanelId };
        n.push(o);
      }
      this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), this.debouncedUpdateTabsUI(), e.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已加载标签页集合: "${e.name}" (${e.tabs.length}个标签)`), orca.notify("success", `已加载标签页集合: ${e.name}`);
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
        const i = { ...n, panelId: this.currentPanelId };
        e.push(i);
      }
      this.previousTabSet = t, this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`🔄 已回到上一个标签集合 (${this.previousTabSet.length}个标签)`), orca.notify("success", "已回到上一个标签集合");
    } catch (e) {
      this.error("回到上一个标签集合失败:", e), orca.notify("error", "恢复失败");
    }
  }
  /**
   * 重新渲染可排序的标签列表
   */
  renderSortableTabs(e, t) {
    e.innerHTML = "", t.forEach((r, l) => {
      const c = document.createElement("div");
      c.className = "sortable-tab-item", c.draggable = !0, c.dataset.index = l.toString(), c.style.cssText = `
        display: flex;
        align-items: center;
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        margin-bottom: 4px;
        background: rgba(255, 255, 255, 0.8);
        cursor: move;
        transition: all 0.2s;
        user-select: none;
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
      `, h.innerHTML = "⋮⋮", c.appendChild(h), r.icon) {
        const f = document.createElement("div");
        if (f.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: #666;
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `, r.icon.startsWith("ti ti-")) {
          const x = document.createElement("i");
          x.className = r.icon, f.appendChild(x);
        } else
          f.textContent = r.icon;
        c.appendChild(f);
      }
      const d = document.createElement("div");
      d.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 20px;
      `;
      let p = `
        <div style="font-size: 14px; color: #333; font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${r.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${r.blockId}</div>
      `;
      r.notes && r.notes.trim() && (p += `
          <div style="font-size: 11px; color: #888; line-height: 1.2; margin-top: 2px; font-style: italic;">
            💭 ${r.notes}
          </div>
        `), d.innerHTML = p, c.appendChild(d);
      const u = document.createElement("div");
      u.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;
      const g = document.createElement("button");
      g.style.cssText = `
        width: 24px;
        height: 24px;
        border: none;
        border-radius: 4px;
        background: ${r.notes ? "#3b82f6" : "#f3f4f6"};
        color: ${r.notes ? "white" : "#666"};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.2s;
      `, g.innerHTML = "💭", g.title = r.notes ? `备注: ${r.notes}` : "添加备注", g.onclick = (f) => {
        f.stopPropagation();
        const x = this.savedTabSets.find((v) => v.tabs === t);
        x && this.editTabNotes(r, x, l);
      }, u.appendChild(g);
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
      `, b.textContent = (l + 1).toString(), u.appendChild(b), c.appendChild(u), c.addEventListener("dragstart", (f) => {
        f.dataTransfer.setData("text/plain", l.toString()), f.dataTransfer.effectAllowed = "move", c.style.opacity = "0.5", c.style.transform = "rotate(2deg)";
      }), c.addEventListener("dragend", (f) => {
        c.style.opacity = "1", c.style.transform = "rotate(0deg)";
      }), c.addEventListener("dragover", (f) => {
        f.preventDefault(), f.dataTransfer.dropEffect = "move", c.style.borderColor = "#3b82f6", c.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), c.addEventListener("dragleave", (f) => {
        c.style.borderColor = "#e0e0e0", c.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      }), c.addEventListener("drop", (f) => {
        f.preventDefault(), f.stopPropagation();
        const x = parseInt(f.dataTransfer.getData("text/plain")), v = l;
        if (x !== v) {
          const k = t[x];
          t.splice(x, 1), t.splice(v, 0, k), this.renderSortableTabs(e, t);
          const I = this.savedTabSets.find((T) => T.tabs === t);
          I && (I.tabs = [...t], I.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
        c.style.borderColor = "#e0e0e0", c.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      }), c.addEventListener("mouseenter", () => {
        c.style.backgroundColor = "rgba(59, 130, 246, 0.05)", c.style.borderColor = "#3b82f6";
      }), c.addEventListener("mouseleave", () => {
        c.style.backgroundColor = "rgba(255, 255, 255, 0.8)", c.style.borderColor = "#e0e0e0";
      }), e.appendChild(c);
    });
    const n = document.createElement("div");
    n.className = "delete-zone", n.style.cssText = `
      position: absolute;
      top: -50px;
      left: 0;
      right: 0;
      height: 40px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      border-radius: 8px;
      display: none;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      z-index: 1000;
      transition: all 0.3s ease;
    `, n.innerHTML = "🗑️ 拖拽到此处删除", e.style.position = "relative", e.appendChild(n);
    let i = -1;
    const o = (r) => {
      i = parseInt(r.target.dataset.index || "0"), n.style.display = "flex", n.style.transform = "translateY(0)";
    }, a = (r) => {
      i = -1, n.style.display = "none", n.style.transform = "translateY(-10px)";
    };
    n.addEventListener("dragover", (r) => {
      r.preventDefault(), r.dataTransfer.dropEffect = "move", n.style.transform = "scale(1.05)", n.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
    }), n.addEventListener("dragleave", (r) => {
      n.style.transform = "scale(1)", n.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
    }), n.addEventListener("drop", (r) => {
      if (r.preventDefault(), r.stopPropagation(), i >= 0 && i < t.length) {
        const l = t[i];
        t.splice(i, 1), this.renderSortableTabs(e, t);
        const c = this.savedTabSets.find((h) => h.tabs === t);
        c && (c.tabs = [...t], c.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", `已删除标签: ${l.title}`));
      }
      n.style.display = "none", n.style.transform = "translateY(-10px)";
    }), e.addEventListener("dragstart", o), e.addEventListener("dragend", a);
  }
  /**
   * 编辑标签备注
   */
  editTabNotes(e, t, n) {
    this.log(`编辑标签备注: ${e.title} (块ID: ${e.blockId})`);
    const i = document.querySelector(".tab-notes-edit-dialog");
    i && i.remove();
    const o = document.createElement("div");
    o.className = "tab-notes-edit-dialog", o.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      width: 500px;
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
      color: #333;
      margin-bottom: 16px;
      text-align: center;
    `, r.textContent = `编辑备注 - ${e.title}`;
    const l = document.createElement("div");
    l.style.cssText = `
      background: #f8f9fa;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #666;
    `, l.innerHTML = `
      <div><strong>标签标题:</strong> ${e.title}</div>
      <div><strong>块ID:</strong> ${e.blockId}</div>
    `;
    const c = document.createElement("div");
    c.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    `, c.textContent = "备注内容:";
    const h = document.createElement("textarea");
    h.style.cssText = `
      width: 100%;
      height: 120px;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      outline: none;
      box-sizing: border-box;
    `, h.placeholder = "请输入标签备注...", h.value = e.notes || "";
    const d = document.createElement("div");
    d.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 16px;
    `;
    const p = document.createElement("button");
    p.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #fff;
      color: #666;
      cursor: pointer;
      font-size: 14px;
    `, p.textContent = "取消", p.onclick = () => {
      o.remove(), this.showTabSetDetails(t);
    };
    const u = document.createElement("button");
    u.style.cssText = `
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 14px;
    `, u.textContent = "保存", u.onclick = async () => {
      const b = h.value.trim();
      try {
        e.notes = b, t.tabs[n] = e, t.updatedAt = Date.now(), await this.saveSavedTabSets(), o.remove(), this.showTabSetDetails(t), orca.notify("success", "备注已保存"), this.log(`✅ 标签备注已更新: ${e.title} - ${b || "(无备注)"}`);
      } catch (f) {
        this.error("保存备注失败:", f), orca.notify("error", "保存备注失败");
      }
    }, d.appendChild(p), d.appendChild(u), a.appendChild(r), a.appendChild(l), a.appendChild(c), a.appendChild(h), a.appendChild(d), o.appendChild(a), document.body.appendChild(o), h.focus(), h.select(), o.addEventListener("click", (b) => {
      b.target === o && (o.remove(), this.showTabSetDetails(t));
    });
    const g = (b) => {
      b.key === "Escape" && (o.remove(), this.showTabSetDetails(t), document.removeEventListener("keydown", g));
    };
    document.addEventListener("keydown", g);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 工作区功能 - Workspace Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 加载工作区数据
   */
  async loadWorkspaces() {
    try {
      const e = await this.storageService.getConfig(w.WORKSPACES);
      e && Array.isArray(e) && (this.workspaces = e, this.log(`📁 已加载 ${this.workspaces.length} 个工作区`));
      const t = await this.storageService.getConfig(w.CURRENT_WORKSPACE);
      t && typeof t == "string" && (this.currentWorkspace = t, this.log(`📁 当前工作区: ${t}`));
      const n = await this.storageService.getConfig(w.ENABLE_WORKSPACES);
      typeof n == "boolean" && (this.enableWorkspaces = n);
    } catch (e) {
      this.error("加载工作区数据失败:", e);
    }
  }
  /**
   * 保存工作区数据
   */
  async saveWorkspaces() {
    try {
      await this.storageService.saveConfig(w.WORKSPACES, this.workspaces), await this.storageService.saveConfig(w.CURRENT_WORKSPACE, this.currentWorkspace), await this.storageService.saveConfig(w.ENABLE_WORKSPACES, this.enableWorkspaces), this.log("💾 工作区数据已保存");
    } catch (e) {
      this.error("保存工作区数据失败:", e);
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
    const e = document.querySelector(".save-workspace-dialog");
    e && e.remove();
    const t = document.createElement("div");
    t.className = "save-workspace-dialog", t.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
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
      color: #333;
      margin-bottom: 16px;
      text-align: center;
    `, i.textContent = "保存工作区";
    const o = document.createElement("div");
    o.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    `, o.textContent = "工作区名称:";
    const a = document.createElement("input");
    a.type = "text", a.placeholder = "请输入工作区名称...", a.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      margin-bottom: 12px;
    `;
    const r = document.createElement("div");
    r.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    `, r.textContent = "工作区描述 (可选):";
    const l = document.createElement("textarea");
    l.placeholder = "请输入工作区描述...", l.style.cssText = `
      width: 100%;
      height: 60px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 16px;
    `;
    const c = document.createElement("div");
    c.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const h = document.createElement("button");
    h.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: #fff;
      color: #666;
      cursor: pointer;
      font-size: 14px;
    `, h.textContent = "取消", h.onclick = () => {
      t.remove();
    };
    const d = document.createElement("button");
    d.style.cssText = `
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 14px;
    `, d.textContent = "保存", d.onclick = async () => {
      const u = a.value.trim();
      if (!u) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((g) => g.name === u)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(u, l.value.trim()), t.remove();
    }, c.appendChild(h), c.appendChild(d), n.appendChild(i), n.appendChild(o), n.appendChild(a), n.appendChild(r), n.appendChild(l), n.appendChild(c), t.appendChild(n), document.body.appendChild(t), a.focus(), t.addEventListener("click", (u) => {
      u.target === t && t.remove();
    });
    const p = (u) => {
      u.key === "Escape" && (t.remove(), document.removeEventListener("keydown", p));
    };
    document.addEventListener("keydown", p);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const n = this.firstPanelTabs, i = this.getCurrentActiveTab(), o = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: n,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: i ? i.blockId : void 0
      };
      this.workspaces.push(o), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${n.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (n) {
      this.error("保存工作区失败:", n), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(e) {
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const n = document.createElement("div");
    n.className = "workspace-menu", n.style.cssText = `
      position: fixed;
      top: ${e ? e.clientY + 10 : 60}px;
      left: ${e ? e.clientX : 20}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: ${this.getNextDialogZIndex()};
      min-width: 200px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    `, i.textContent = "工作区";
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #eee;
    `, o.innerHTML = `
      <i class="ti ti-plus" style="font-size: 14px; color: #3b82f6;"></i>
      <span>保存当前工作区</span>
    `, o.onclick = () => {
      n.remove(), this.saveCurrentWorkspace();
    };
    const a = document.createElement("div");
    if (a.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const c = document.createElement("div");
      c.style.cssText = `
        padding: 12px 16px;
        color: #666;
        font-size: 14px;
        text-align: center;
      `, c.textContent = "暂无工作区", a.appendChild(c);
    } else
      this.workspaces.forEach((c) => {
        const h = document.createElement("div");
        h.style.cssText = `
          padding: 12px 16px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid #eee;
          ${this.currentWorkspace === c.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const d = c.icon || "ti ti-folder";
        h.innerHTML = `
          <i class="${d}" style="font-size: 14px; color: #3b82f6;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500;">${c.name}</div>
            ${c.description ? `<div style="font-size: 12px; color: #666; margin-top: 2px;">${c.description}</div>` : ""}
            <div style="font-size: 11px; color: #999; margin-top: 2px;">${c.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === c.id ? '<i class="ti ti-check" style="font-size: 14px; color: #3b82f6;"></i>' : ""}
        `, h.onclick = () => {
          n.remove(), this.switchToWorkspace(c.id);
        }, a.appendChild(h);
      });
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid #eee;
    `, r.innerHTML = `
      <i class="ti ti-settings" style="font-size: 14px; color: #666;"></i>
      <span>管理工作区</span>
    `, r.onclick = () => {
      n.remove(), this.manageWorkspaces();
    }, n.appendChild(i), n.appendChild(o), n.appendChild(a), n.appendChild(r), document.body.appendChild(n);
    const l = (c) => {
      n.contains(c.target) || (n.remove(), document.removeEventListener("click", l));
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
      this.currentWorkspace && await this.saveCurrentTabsToWorkspace(), this.currentWorkspace = e, await this.saveWorkspaces(), await this.replaceCurrentTabsWithWorkspace(t.tabs, t), this.log(`🔄 已切换到工作区: "${t.name}"`), orca.notify("success", `已切换到工作区: ${t.name}`);
    } catch (t) {
      this.error("切换工作区失败:", t), orca.notify("error", "切换工作区失败");
    }
  }
  /**
   * 用工作区的标签页完全替换当前标签页
   */
  async replaceCurrentTabsWithWorkspace(e, t) {
    try {
      this.firstPanelTabs = [], this.secondPanelTabs = [];
      const n = [];
      for (const o of e)
        try {
          const a = await this.getTabInfo(o.blockId, this.currentPanelId, n.length);
          a ? (a.notes = o.notes, a.isPinned = o.isPinned, a.order = o.order, a.scrollPosition = o.scrollPosition, n.push(a)) : n.push(o);
        } catch (a) {
          this.warn(`无法更新标签页信息 ${o.title}:`, a), n.push(o);
        }
      this.firstPanelTabs = n, await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), this.debouncedUpdateTabsUI();
      const i = t.lastActiveTabId;
      setTimeout(async () => {
        if (n.length > 0) {
          let o = n[0];
          if (i) {
            const a = n.find((r) => r.blockId === i);
            a ? (o = a, this.log(`🎯 导航到工作区中最后激活的标签页: ${o.title} (ID: ${i})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${o.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${o.title}`);
          await orca.nav.goTo("block", { blockId: parseInt(o.blockId) }, this.currentPanelId);
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
      const t = this.firstPanelTabs, n = this.getCurrentActiveTab();
      e.tabs = t, e.lastActiveTabId = n ? n.blockId : void 0, e.updatedAt = Date.now(), await this.saveWorkspaces();
    }
  }
  /**
   * 管理工作区
   */
  manageWorkspaces() {
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.createElement("div");
    t.className = "manage-workspaces-dialog", t.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
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
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    `, i.textContent = "管理工作区";
    const o = document.createElement("div");
    if (o.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
    `, this.workspaces.length === 0) {
      const c = document.createElement("div");
      c.style.cssText = `
        padding: 40px;
        text-align: center;
        color: #666;
        font-size: 14px;
      `, c.textContent = "暂无工作区", o.appendChild(c);
    } else
      this.workspaces.forEach((c) => {
        const h = document.createElement("div");
        h.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid #eee;
          border-radius: 8px;
          margin-bottom: 8px;
          background: ${this.currentWorkspace === c.id ? "rgba(59, 130, 246, 0.05)" : "#fff"};
        `;
        const d = c.icon || "ti ti-folder";
        h.innerHTML = `
          <i class="${d}" style="font-size: 20px; color: #3b82f6; margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px;">${c.name}</div>
            ${c.description ? `<div style="font-size: 12px; color: #666; margin-bottom: 4px;">${c.description}</div>` : ""}
            <div style="font-size: 11px; color: #999;">${c.tabs.length}个标签 • 创建于 ${new Date(c.createdAt).toLocaleString()}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${this.currentWorkspace === c.id ? '<span style="color: #3b82f6; font-size: 12px;">当前</span>' : ""}
            <button class="delete-workspace-btn" data-workspace-id="${c.id}" style="
              padding: 4px 8px;
              border: 1px solid #ef4444;
              border-radius: 4px;
              background: #fff;
              color: #ef4444;
              cursor: pointer;
              font-size: 12px;
            ">删除</button>
          </div>
        `, o.appendChild(h);
      });
    const a = document.createElement("div");
    a.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const r = document.createElement("button");
    r.style.cssText = `
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: #fff;
      color: #666;
      cursor: pointer;
      font-size: 14px;
    `, r.textContent = "关闭", r.onclick = () => {
      t.remove();
    }, a.appendChild(r), n.appendChild(i), n.appendChild(o), n.appendChild(a), t.appendChild(n), document.body.appendChild(t), t.querySelectorAll(".delete-workspace-btn").forEach((c) => {
      c.addEventListener("click", async (h) => {
        const d = h.target.getAttribute("data-workspace-id");
        d && (await this.deleteWorkspace(d), t.remove(), this.manageWorkspaces());
      });
    }), t.addEventListener("click", (c) => {
      c.target === t && t.remove();
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
    const n = document.querySelector(".tabset-details-dialog");
    n && n.remove();
    const i = document.createElement("div");
    i.className = "tabset-details-dialog", i.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 500px;
      max-height: 600px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, o.textContent = `标签集合详情: ${e.name}`, i.appendChild(o);
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;
    const r = document.createElement("div");
    if (r.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background: rgba(249, 249, 249, 0.8);
      border-radius: 6px;
    `, r.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>创建时间:</strong> ${new Date(e.createdAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>更新时间:</strong> ${new Date(e.updatedAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666;">
        <strong>标签数量:</strong> ${e.tabs.length}个
      </div>
    `, a.appendChild(r), e.tabs.length === 0) {
      const d = document.createElement("div");
      d.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `, d.textContent = "该标签集合为空", a.appendChild(d);
    } else {
      const d = document.createElement("div");
      d.style.cssText = `
        margin-bottom: 16px;
      `;
      const p = document.createElement("div");
      p.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const u = document.createElement("span");
      u.textContent = "包含的标签 (可拖拽排序):", p.appendChild(u);
      const g = document.createElement("span");
      g.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, g.textContent = "拖拽调整顺序", p.appendChild(g), d.appendChild(p);
      const b = document.createElement("div");
      b.className = "sortable-tabs-container", b.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: 8px;
        transition: border-color 0.3s ease;
      `;
      const f = [...e.tabs];
      f.forEach((T, S) => {
        const y = document.createElement("div");
        y.className = "sortable-tab-item", y.draggable = !0, y.dataset.index = S.toString(), y.style.cssText = `
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          margin-bottom: 4px;
          background: rgba(255, 255, 255, 0.8);
          cursor: move;
          transition: all 0.2s;
          user-select: none;
        `;
        const M = document.createElement("div");
        if (M.style.cssText = `
          margin-right: 8px;
          color: #999;
          font-size: 12px;
          cursor: move;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 20px;
        `, M.innerHTML = "⋮⋮", y.appendChild(M), T.icon) {
          const E = document.createElement("div");
          if (E.style.cssText = `
            margin-right: 8px;
            font-size: 14px;
            color: #666;
            width: 16px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          `, T.icon.startsWith("ti ti-")) {
            const O = document.createElement("i");
            O.className = T.icon, E.appendChild(O);
          } else
            E.textContent = T.icon;
          y.appendChild(E);
        }
        const D = document.createElement("div");
        D.style.cssText = `
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 20px;
        `;
        let W = `
          <div style="font-size: 14px; color: #333; font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${T.title}</div>
          <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${T.blockId}</div>
        `;
        T.notes && T.notes.trim() && (W += `
            <div style="font-size: 11px; color: #888; line-height: 1.2; margin-top: 2px; font-style: italic;">
              💭 ${T.notes}
            </div>
          `), D.innerHTML = W, y.appendChild(D);
        const U = document.createElement("div");
        U.style.cssText = `
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 8px;
        `;
        const F = document.createElement("button");
        F.style.cssText = `
          width: 24px;
          height: 24px;
          border: none;
          border-radius: 4px;
          background: ${T.notes ? "#3b82f6" : "#f3f4f6"};
          color: ${T.notes ? "white" : "#666"};
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          transition: all 0.2s;
        `, F.innerHTML = "💭", F.title = T.notes ? `备注: ${T.notes}` : "添加备注", F.onclick = (E) => {
          E.stopPropagation(), this.editTabNotes(T, e, S);
        }, U.appendChild(F);
        const Q = document.createElement("div");
        Q.style.cssText = `
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
        `, Q.textContent = (S + 1).toString(), U.appendChild(Q), y.appendChild(U), y.addEventListener("dragstart", (E) => {
          E.dataTransfer.setData("text/plain", S.toString()), E.dataTransfer.effectAllowed = "move", y.style.opacity = "0.5", y.style.transform = "rotate(2deg)";
        }), y.addEventListener("dragend", (E) => {
          y.style.opacity = "1", y.style.transform = "rotate(0deg)";
        }), y.addEventListener("dragover", (E) => {
          E.preventDefault(), E.dataTransfer.dropEffect = "move", y.style.borderColor = "#3b82f6", y.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
        }), y.addEventListener("dragleave", (E) => {
          y.style.borderColor = "#e0e0e0", y.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }), y.addEventListener("drop", (E) => {
          E.preventDefault(), E.stopPropagation();
          const O = parseInt(E.dataTransfer.getData("text/plain")), ie = S;
          if (O !== ie) {
            const Ce = f[O];
            f.splice(O, 1), f.splice(ie, 0, Ce), this.renderSortableTabs(b, f), e.tabs = [...f], e.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新");
          }
          y.style.borderColor = "#e0e0e0", y.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }), y.addEventListener("mouseenter", () => {
          y.style.backgroundColor = "rgba(59, 130, 246, 0.05)", y.style.borderColor = "#3b82f6";
        }), y.addEventListener("mouseleave", () => {
          y.style.backgroundColor = "rgba(255, 255, 255, 0.8)", y.style.borderColor = "#e0e0e0";
        }), b.appendChild(y);
      });
      const x = document.createElement("div");
      x.className = "delete-zone", x.style.cssText = `
        position: absolute;
        top: -50px;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(135deg, #ef4444, #dc2626);
        border-radius: 8px;
        display: none;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
      `, x.innerHTML = "🗑️ 拖拽到此处删除", b.style.position = "relative", b.appendChild(x);
      let v = -1;
      const k = (T) => {
        v = parseInt(T.target.dataset.index || "0"), x.style.display = "flex", x.style.transform = "translateY(0)";
      }, I = (T) => {
        v = -1, x.style.display = "none", x.style.transform = "translateY(-10px)";
      };
      x.addEventListener("dragover", (T) => {
        T.preventDefault(), T.dataTransfer.dropEffect = "move", x.style.transform = "scale(1.05)", x.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
      }), x.addEventListener("dragleave", (T) => {
        x.style.transform = "scale(1)", x.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
      }), x.addEventListener("drop", (T) => {
        if (T.preventDefault(), T.stopPropagation(), v >= 0 && v < f.length) {
          const S = f[v];
          f.splice(v, 1), this.renderSortableTabs(b, f), e.tabs = [...f], e.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", `已删除标签: ${S.title}`);
        }
        x.style.display = "none", x.style.transform = "translateY(-10px)";
      }), b.addEventListener("dragstart", k), b.addEventListener("dragend", I), d.appendChild(b), a.appendChild(d);
    }
    i.appendChild(a);
    const l = document.createElement("div");
    l.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const c = document.createElement("button");
    c.textContent = "关闭", c.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, c.addEventListener("mouseenter", () => {
      c.style.backgroundColor = "#4b5563";
    }), c.addEventListener("mouseleave", () => {
      c.style.backgroundColor = "#6b7280";
    }), c.onclick = () => {
      i.remove(), t && this.manageSavedTabSets();
    }, l.appendChild(c), i.appendChild(l), document.body.appendChild(i);
    const h = (d) => {
      i.contains(d.target) || (i.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, n) {
    const i = document.querySelector(".rename-tabset-dialog");
    i && i.remove();
    const o = document.createElement("div");
    o.className = "rename-tabset-dialog", o.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: 2000;
      width: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, a.textContent = "重命名标签集合", o.appendChild(a);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 0 20px;
    `;
    const l = document.createElement("label");
    l.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, l.textContent = "请输入新的名称:", r.appendChild(l);
    const c = document.createElement("input");
    c.type = "text", c.value = e.name, c.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
      pointer-events: auto;
      user-select: text;
    `, c.addEventListener("focus", () => {
      c.style.borderColor = "#3b82f6";
    }), c.addEventListener("blur", () => {
      c.style.borderColor = "#ddd";
    }), r.appendChild(c), o.appendChild(r);
    const h = document.createElement("div");
    h.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const d = document.createElement("button");
    d.textContent = "取消", d.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, d.addEventListener("mouseenter", () => {
      d.style.backgroundColor = "#4b5563";
    }), d.addEventListener("mouseleave", () => {
      d.style.backgroundColor = "#6b7280";
    }), d.onclick = () => {
      o.remove(), this.manageSavedTabSets();
    };
    const p = document.createElement("button");
    p.textContent = "保存", p.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, p.addEventListener("mouseenter", () => {
      p.style.backgroundColor = "#2563eb";
    }), p.addEventListener("mouseleave", () => {
      p.style.backgroundColor = "#3b82f6";
    }), p.onclick = async () => {
      const g = c.value.trim();
      if (!g) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (g === e.name) {
        o.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((f) => f.name === g && f.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = g, e.updatedAt = Date.now(), await this.saveSavedTabSets(), o.remove(), n.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, h.appendChild(d), h.appendChild(p), o.appendChild(h), document.body.appendChild(o), setTimeout(() => {
      c.focus(), c.select();
    }, 100), c.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), p.click()) : g.key === "Escape" && (g.preventDefault(), d.click());
    });
    const u = (g) => {
      o.contains(g.target) || (o.remove(), document.removeEventListener("click", u), document.removeEventListener("contextmenu", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u), document.addEventListener("contextmenu", u);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, n, i) {
    const o = document.createElement("input");
    o.type = "text", o.value = e.name, o.style.cssText = `
      width: 100%;
      padding: 2px 4px;
      border: 1px solid #3b82f6;
      border-radius: 3px;
      font-size: 14px;
      font-weight: 600;
      color: #333;
      background: white;
      outline: none;
    `;
    const a = n.textContent;
    n.innerHTML = "", n.appendChild(o), o.addEventListener("click", (h) => {
      h.stopPropagation();
    }), o.addEventListener("mousedown", (h) => {
      h.stopPropagation();
    }), o.focus(), o.select();
    const r = async () => {
      const h = o.value.trim();
      if (!h) {
        n.textContent = a;
        return;
      }
      if (h === e.name) {
        n.textContent = a;
        return;
      }
      if (this.savedTabSets.find((p) => p.name === h && p.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), n.textContent = a;
        return;
      }
      e.name = h, e.updatedAt = Date.now(), await this.saveSavedTabSets(), n.textContent = h, orca.notify("success", "重命名成功");
    }, l = () => {
      n.textContent = a;
    };
    o.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), r()) : h.key === "Escape" && (h.preventDefault(), l());
    });
    let c = null;
    o.addEventListener("blur", () => {
      c && clearTimeout(c), c = window.setTimeout(() => {
        r();
      }, 100);
    }), o.addEventListener("focus", () => {
      c && (clearTimeout(c), c = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, n, i, o) {
    const a = document.createElement("div");
    a.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 400px;
      max-height: 500px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, r.textContent = "选择图标", a.appendChild(r);
    const l = document.createElement("div");
    l.style.cssText = `
      padding: 0 20px;
      max-height: 300px;
      overflow-y: auto;
    `;
    const c = [
      { name: "默认", value: "", icon: "📁" },
      { name: "工作", value: "ti ti-briefcase", icon: "💼" },
      { name: "学习", value: "ti ti-school", icon: "📚" },
      { name: "项目", value: "ti ti-folder", icon: "📂" },
      { name: "笔记", value: "ti ti-notes", icon: "📝" },
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
    ], h = document.createElement("div");
    h.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    `, c.forEach((g) => {
      const b = document.createElement("div");
      b.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        background: ${e.icon === g.value ? "#e3f2fd" : "white"};
      `;
      const f = document.createElement("div");
      if (f.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, g.value.startsWith("ti ti-")) {
        const v = document.createElement("i");
        v.className = g.value, f.appendChild(v);
      } else
        f.textContent = g.icon;
      const x = document.createElement("div");
      x.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, x.textContent = g.name, b.appendChild(f), b.appendChild(x), b.addEventListener("click", async (v) => {
        v.stopPropagation(), e.icon = g.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i(), a.remove(), o && o.focus(), orca.notify("success", "图标已更新");
      }), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "#f5f5f5", b.style.borderColor = "#3b82f6";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = e.icon === g.value ? "#e3f2fd" : "white", b.style.borderColor = "#e0e0e0";
      }), h.appendChild(b);
    }), l.appendChild(h), a.appendChild(l);
    const d = document.createElement("div");
    d.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const p = document.createElement("button");
    p.textContent = "关闭", p.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, p.addEventListener("mouseenter", () => {
      p.style.backgroundColor = "#4b5563";
    }), p.addEventListener("mouseleave", () => {
      p.style.backgroundColor = "#6b7280";
    }), p.onclick = (g) => {
      g.stopPropagation(), a.remove(), o && o.focus();
    }, d.appendChild(p), a.appendChild(d), document.body.appendChild(a);
    const u = (g) => {
      a.contains(g.target) || (g.stopPropagation(), a.remove(), document.removeEventListener("click", u), document.removeEventListener("contextmenu", u), o && o.focus());
    };
    setTimeout(() => {
      document.addEventListener("click", u), document.addEventListener("contextmenu", u);
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
    const e = document.createElement("div");
    e.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex()};
      width: 500px;
      max-height: 400px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const t = document.createElement("div");
    t.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, t.textContent = "管理保存的标签页集合", e.appendChild(t);
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 0 20px;
      max-height: 300px;
      overflow-y: auto;
    `, this.savedTabSets.forEach((r, l) => {
      const c = document.createElement("div");
      c.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-bottom: 8px;
        background: rgba(249, 249, 249, 0.8);
        transition: background-color 0.2s;
      `, c.addEventListener("mouseenter", () => {
        c.style.backgroundColor = "rgba(240, 240, 240, 0.8)";
      }), c.addEventListener("mouseleave", () => {
        c.style.backgroundColor = "rgba(249, 249, 249, 0.8)";
      });
      const h = document.createElement("div");
      h.style.cssText = `
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      const d = document.createElement("div");
      d.style.cssText = `
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #666;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s;
      `, d.title = "点击编辑图标";
      const p = () => {
        if (d.innerHTML = "", r.icon)
          if (r.icon.startsWith("ti ti-")) {
            const I = document.createElement("i");
            I.className = r.icon, d.appendChild(I);
          } else
            d.textContent = r.icon;
        else
          d.textContent = "📁";
      };
      p(), d.addEventListener("click", () => {
        this.editTabSetIcon(r, l, d, p, e);
      }), d.addEventListener("mouseenter", () => {
        d.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), d.addEventListener("mouseleave", () => {
        d.style.backgroundColor = "transparent";
      });
      const u = document.createElement("div");
      u.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      `;
      const g = document.createElement("div");
      g.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
        min-height: 20px;
        display: flex;
        align-items: center;
      `, g.textContent = r.name, g.title = "点击编辑名称", g.addEventListener("click", () => {
        this.editTabSetName(r, l, g, e);
      }), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      });
      const b = document.createElement("div");
      b.style.cssText = `
        font-size: 12px;
        color: #666;
      `, b.textContent = `${r.tabs.length}个标签 • ${new Date(r.updatedAt).toLocaleString()}`, u.appendChild(g), u.appendChild(b), h.appendChild(d), h.appendChild(u);
      const f = document.createElement("div");
      f.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const x = document.createElement("button");
      x.textContent = "加载", x.style.cssText = `
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      `, x.addEventListener("mouseenter", () => {
        x.style.backgroundColor = "#2563eb";
      }), x.addEventListener("mouseleave", () => {
        x.style.backgroundColor = "#3b82f6";
      }), x.onclick = () => {
        this.loadSavedTabSet(r, l), e.remove();
      };
      const v = document.createElement("button");
      v.textContent = "查看", v.style.cssText = `
        background: #10b981;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      `, v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "#059669";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "#10b981";
      }), v.onclick = () => {
        this.showTabSetDetails(r, e);
      };
      const k = document.createElement("button");
      k.textContent = "删除", k.style.cssText = `
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      `, k.addEventListener("mouseenter", () => {
        k.style.backgroundColor = "#dc2626";
      }), k.addEventListener("mouseleave", () => {
        k.style.backgroundColor = "#ef4444";
      }), k.onclick = () => {
        confirm(`确定要删除标签页集合 "${r.name}" 吗？`) && (this.savedTabSets.splice(l, 1), this.saveSavedTabSets(), e.remove(), this.manageSavedTabSets());
      }, f.appendChild(x), f.appendChild(v), f.appendChild(k), c.appendChild(h), c.appendChild(f), n.appendChild(c);
    }), e.appendChild(n);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const o = document.createElement("button");
    o.textContent = "关闭", o.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, o.addEventListener("mouseenter", () => {
      o.style.backgroundColor = "#4b5563";
    }), o.addEventListener("mouseleave", () => {
      o.style.backgroundColor = "#6b7280";
    }), o.onclick = () => e.remove(), i.appendChild(o), e.appendChild(i), document.body.appendChild(e);
    const a = (r) => {
      e.contains(r.target) || (e.remove(), document.removeEventListener("click", a), document.removeEventListener("contextmenu", a));
    };
    setTimeout(() => {
      document.addEventListener("click", a), document.addEventListener("contextmenu", a);
    }, 0);
  }
}
let P = null;
async function In(s) {
  q = s, Se(orca.state.locale, { "zh-CN": $e }), P = new kn(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => P == null ? void 0 : P.init(), 500);
  }) : setTimeout(() => P == null ? void 0 : P.init(), 500), orca.commands.registerCommand(
    `${q}.resetCache`,
    async () => {
      P && await P.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${q}.toggleBlockIcons`,
    async () => {
      P && await P.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  ), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && (console.log(Pe("标签页插件已启动")), console.log(`${q} loaded.`));
}
async function En() {
  P && (P.unregisterHeadbarButton(), P.cleanupDragResize(), P.destroy(), P = null), orca.commands.unregisterCommand(`${q}.resetCache`);
}
export {
  In as load,
  En as unload
};
