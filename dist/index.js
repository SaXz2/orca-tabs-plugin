var Se = Object.defineProperty;
var Pe = (a, e, t) => e in a ? Se(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var m = (a, e, t) => Pe(a, typeof e != "symbol" ? e + "" : e, t);
let fe = "en", be = {};
function $e(a, e) {
  fe = a, be = e;
}
function Le(a, e, t) {
  var i;
  return ((i = be[fe]) == null ? void 0 : i[a]) ?? a;
}
const Me = {
  标签页插件已启动: "标签页插件已启动",
  "your plugin code starts here": "您的插件代码从这里开始",
  今天: "今天",
  昨天: "昨天",
  明天: "明天"
}, me = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
}, xe = {
  JSON: 0,
  Text: 1
}, C = {
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
class De {
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
      [C.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [C.SECOND_PANEL_TABS]: "orca-second-panel-tabs-api",
      [C.CLOSED_TABS]: "orca-closed-tabs-api",
      [C.RECENTLY_CLOSED_TABS]: "orca-recently-closed-tabs-api",
      [C.SAVED_TAB_SETS]: "orca-saved-tab-sets-api",
      [C.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [C.TABS_POSITION]: "orca-tabs-position-api",
      [C.LAYOUT_MODE]: "orca-tabs-layout-api",
      [C.FIXED_TO_TOP]: "orca-tabs-fixed-to-top-api"
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
      const s = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(o) === JSON.stringify(s) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
const ye = 6048e5, Ae = 864e5, ae = Symbol.for("constructDateFrom");
function D(a, e) {
  return typeof a == "function" ? a(e) : a && typeof a == "object" && ae in a ? a[ae](e) : a instanceof Date ? new a.constructor(e) : new Date(e);
}
function A(a, e) {
  return D(e || a, a);
}
function ve(a, e, t) {
  const n = A(a, t == null ? void 0 : t.in);
  return isNaN(e) ? D(a, NaN) : (e && n.setDate(n.getDate() + e), n);
}
let Be = {};
function G() {
  return Be;
}
function H(a, e) {
  var r, l, c, u;
  const t = G(), n = (e == null ? void 0 : e.weekStartsOn) ?? ((l = (r = e == null ? void 0 : e.locale) == null ? void 0 : r.options) == null ? void 0 : l.weekStartsOn) ?? t.weekStartsOn ?? ((u = (c = t.locale) == null ? void 0 : c.options) == null ? void 0 : u.weekStartsOn) ?? 0, i = A(a, e == null ? void 0 : e.in), o = i.getDay(), s = (o < n ? 7 : 0) + o - n;
  return i.setDate(i.getDate() - s), i.setHours(0, 0, 0, 0), i;
}
function j(a, e) {
  return H(a, { ...e, weekStartsOn: 1 });
}
function Te(a, e) {
  const t = A(a, e == null ? void 0 : e.in), n = t.getFullYear(), i = D(t, 0);
  i.setFullYear(n + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const o = j(i), s = D(t, 0);
  s.setFullYear(n, 0, 4), s.setHours(0, 0, 0, 0);
  const r = j(s);
  return t.getTime() >= o.getTime() ? n + 1 : t.getTime() >= r.getTime() ? n : n - 1;
}
function se(a) {
  const e = A(a), t = new Date(
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
  return t.setUTCFullYear(e.getFullYear()), +a - +t;
}
function we(a, ...e) {
  const t = D.bind(
    null,
    e.find((n) => typeof n == "object")
  );
  return e.map(t);
}
function X(a, e) {
  const t = A(a, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function We(a, e, t) {
  const [n, i] = we(
    t == null ? void 0 : t.in,
    a,
    e
  ), o = X(n), s = X(i), r = +o - se(o), l = +s - se(s);
  return Math.round((r - l) / Ae);
}
function ze(a, e) {
  const t = Te(a, e), n = D(a, 0);
  return n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), j(n);
}
function ne(a) {
  return D(a, Date.now());
}
function ie(a, e, t) {
  const [n, i] = we(
    t == null ? void 0 : t.in,
    a,
    e
  );
  return +X(n) == +X(i);
}
function Oe(a) {
  return a instanceof Date || typeof a == "object" && Object.prototype.toString.call(a) === "[object Date]";
}
function Ne(a) {
  return !(!Oe(a) && typeof a != "number" || isNaN(+A(a)));
}
function Fe(a, e) {
  const t = A(a, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const Re = {
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
}, qe = (a, e, t) => {
  let n;
  const i = Re[a];
  return typeof i == "string" ? n = i : e === 1 ? n = i.one : n = i.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + n : n + " ago" : n;
};
function te(a) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : a.defaultWidth;
    return a.formats[t] || a.formats[a.defaultWidth];
  };
}
const He = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, _e = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Ve = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ue = {
  date: te({
    formats: He,
    defaultWidth: "full"
  }),
  time: te({
    formats: _e,
    defaultWidth: "full"
  }),
  dateTime: te({
    formats: Ve,
    defaultWidth: "full"
  })
}, Ye = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, je = (a, e, t, n) => Ye[a];
function F(a) {
  return (e, t) => {
    const n = t != null && t.context ? String(t.context) : "standalone";
    let i;
    if (n === "formatting" && a.formattingValues) {
      const s = a.defaultFormattingWidth || a.defaultWidth, r = t != null && t.width ? String(t.width) : s;
      i = a.formattingValues[r] || a.formattingValues[s];
    } else {
      const s = a.defaultWidth, r = t != null && t.width ? String(t.width) : a.defaultWidth;
      i = a.values[r] || a.values[s];
    }
    const o = a.argumentCallback ? a.argumentCallback(e) : e;
    return i[o];
  };
}
const Xe = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Ge = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Je = {
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
}, Ze = {
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
}, Ke = {
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
}, et = (a, e) => {
  const t = Number(a), n = t % 100;
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
}, tt = {
  ordinalNumber: et,
  era: F({
    values: Xe,
    defaultWidth: "wide"
  }),
  quarter: F({
    values: Ge,
    defaultWidth: "wide",
    argumentCallback: (a) => a - 1
  }),
  month: F({
    values: Je,
    defaultWidth: "wide"
  }),
  day: F({
    values: Ze,
    defaultWidth: "wide"
  }),
  dayPeriod: F({
    values: Ke,
    defaultWidth: "wide",
    formattingValues: Qe,
    defaultFormattingWidth: "wide"
  })
};
function R(a) {
  return (e, t = {}) => {
    const n = t.width, i = n && a.matchPatterns[n] || a.matchPatterns[a.defaultMatchWidth], o = e.match(i);
    if (!o)
      return null;
    const s = o[0], r = n && a.parsePatterns[n] || a.parsePatterns[a.defaultParseWidth], l = Array.isArray(r) ? it(r, (h) => h.test(s)) : (
      // [TODO] -- I challenge you to fix the type
      nt(r, (h) => h.test(s))
    );
    let c;
    c = a.valueCallback ? a.valueCallback(l) : l, c = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(c)
    ) : c;
    const u = e.slice(s.length);
    return { value: c, rest: u };
  };
}
function nt(a, e) {
  for (const t in a)
    if (Object.prototype.hasOwnProperty.call(a, t) && e(a[t]))
      return t;
}
function it(a, e) {
  for (let t = 0; t < a.length; t++)
    if (e(a[t]))
      return t;
}
function ot(a) {
  return (e, t = {}) => {
    const n = e.match(a.matchPattern);
    if (!n) return null;
    const i = n[0], o = e.match(a.parsePattern);
    if (!o) return null;
    let s = a.valueCallback ? a.valueCallback(o[0]) : o[0];
    s = t.valueCallback ? t.valueCallback(s) : s;
    const r = e.slice(i.length);
    return { value: s, rest: r };
  };
}
const at = /^(\d+)(th|st|nd|rd)?/i, st = /\d+/i, rt = {
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
}, ft = {
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
}, mt = {
  ordinalNumber: ot({
    matchPattern: at,
    parsePattern: st,
    valueCallback: (a) => parseInt(a, 10)
  }),
  era: R({
    matchPatterns: rt,
    defaultMatchWidth: "wide",
    parsePatterns: ct,
    defaultParseWidth: "any"
  }),
  quarter: R({
    matchPatterns: lt,
    defaultMatchWidth: "wide",
    parsePatterns: dt,
    defaultParseWidth: "any",
    valueCallback: (a) => a + 1
  }),
  month: R({
    matchPatterns: ut,
    defaultMatchWidth: "wide",
    parsePatterns: ht,
    defaultParseWidth: "any"
  }),
  day: R({
    matchPatterns: pt,
    defaultMatchWidth: "wide",
    parsePatterns: gt,
    defaultParseWidth: "any"
  }),
  dayPeriod: R({
    matchPatterns: ft,
    defaultMatchWidth: "any",
    parsePatterns: bt,
    defaultParseWidth: "any"
  })
}, xt = {
  code: "en-US",
  formatDistance: qe,
  formatLong: Ue,
  formatRelative: je,
  localize: tt,
  match: mt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function yt(a, e) {
  const t = A(a, e == null ? void 0 : e.in);
  return We(t, Fe(t)) + 1;
}
function vt(a, e) {
  const t = A(a, e == null ? void 0 : e.in), n = +j(t) - +ze(t);
  return Math.round(n / ye) + 1;
}
function ke(a, e) {
  var u, h, d, p;
  const t = A(a, e == null ? void 0 : e.in), n = t.getFullYear(), i = G(), o = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((h = (u = e == null ? void 0 : e.locale) == null ? void 0 : u.options) == null ? void 0 : h.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((p = (d = i.locale) == null ? void 0 : d.options) == null ? void 0 : p.firstWeekContainsDate) ?? 1, s = D((e == null ? void 0 : e.in) || a, 0);
  s.setFullYear(n + 1, 0, o), s.setHours(0, 0, 0, 0);
  const r = H(s, e), l = D((e == null ? void 0 : e.in) || a, 0);
  l.setFullYear(n, 0, o), l.setHours(0, 0, 0, 0);
  const c = H(l, e);
  return +t >= +r ? n + 1 : +t >= +c ? n : n - 1;
}
function Tt(a, e) {
  var r, l, c, u;
  const t = G(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((l = (r = e == null ? void 0 : e.locale) == null ? void 0 : r.options) == null ? void 0 : l.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((u = (c = t.locale) == null ? void 0 : c.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, i = ke(a, e), o = D((e == null ? void 0 : e.in) || a, 0);
  return o.setFullYear(i, 0, n), o.setHours(0, 0, 0, 0), H(o, e);
}
function wt(a, e) {
  const t = A(a, e == null ? void 0 : e.in), n = +H(t, e) - +Tt(t, e);
  return Math.round(n / ye) + 1;
}
function I(a, e) {
  const t = a < 0 ? "-" : "", n = Math.abs(a).toString().padStart(e, "0");
  return t + n;
}
const B = {
  // Year
  y(a, e) {
    const t = a.getFullYear(), n = t > 0 ? t : 1 - t;
    return I(e === "yy" ? n % 100 : n, e.length);
  },
  // Month
  M(a, e) {
    const t = a.getMonth();
    return e === "M" ? String(t + 1) : I(t + 1, 2);
  },
  // Day of the month
  d(a, e) {
    return I(a.getDate(), e.length);
  },
  // AM or PM
  a(a, e) {
    const t = a.getHours() / 12 >= 1 ? "pm" : "am";
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
  h(a, e) {
    return I(a.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(a, e) {
    return I(a.getHours(), e.length);
  },
  // Minute
  m(a, e) {
    return I(a.getMinutes(), e.length);
  },
  // Second
  s(a, e) {
    return I(a.getSeconds(), e.length);
  },
  // Fraction of second
  S(a, e) {
    const t = e.length, n = a.getMilliseconds(), i = Math.trunc(
      n * Math.pow(10, t - 3)
    );
    return I(i, e.length);
  }
}, N = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, re = {
  // Era
  G: function(a, e, t) {
    const n = a.getFullYear() > 0 ? 1 : 0;
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
  y: function(a, e, t) {
    if (e === "yo") {
      const n = a.getFullYear(), i = n > 0 ? n : 1 - n;
      return t.ordinalNumber(i, { unit: "year" });
    }
    return B.y(a, e);
  },
  // Local week-numbering year
  Y: function(a, e, t, n) {
    const i = ke(a, n), o = i > 0 ? i : 1 - i;
    if (e === "YY") {
      const s = o % 100;
      return I(s, 2);
    }
    return e === "Yo" ? t.ordinalNumber(o, { unit: "year" }) : I(o, e.length);
  },
  // ISO week-numbering year
  R: function(a, e) {
    const t = Te(a);
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
  u: function(a, e) {
    const t = a.getFullYear();
    return I(t, e.length);
  },
  // Quarter
  Q: function(a, e, t) {
    const n = Math.ceil((a.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(n);
      case "QQ":
        return I(n, 2);
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
  q: function(a, e, t) {
    const n = Math.ceil((a.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(n);
      case "qq":
        return I(n, 2);
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
  M: function(a, e, t) {
    const n = a.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return B.M(a, e);
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
  L: function(a, e, t) {
    const n = a.getMonth();
    switch (e) {
      case "L":
        return String(n + 1);
      case "LL":
        return I(n + 1, 2);
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
  w: function(a, e, t, n) {
    const i = wt(a, n);
    return e === "wo" ? t.ordinalNumber(i, { unit: "week" }) : I(i, e.length);
  },
  // ISO week of year
  I: function(a, e, t) {
    const n = vt(a);
    return e === "Io" ? t.ordinalNumber(n, { unit: "week" }) : I(n, e.length);
  },
  // Day of the month
  d: function(a, e, t) {
    return e === "do" ? t.ordinalNumber(a.getDate(), { unit: "date" }) : B.d(a, e);
  },
  // Day of year
  D: function(a, e, t) {
    const n = yt(a);
    return e === "Do" ? t.ordinalNumber(n, { unit: "dayOfYear" }) : I(n, e.length);
  },
  // Day of week
  E: function(a, e, t) {
    const n = a.getDay();
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
  e: function(a, e, t, n) {
    const i = a.getDay(), o = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(o);
      case "ee":
        return I(o, 2);
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
  c: function(a, e, t, n) {
    const i = a.getDay(), o = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(o);
      case "cc":
        return I(o, e.length);
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
  i: function(a, e, t) {
    const n = a.getDay(), i = n === 0 ? 7 : n;
    switch (e) {
      case "i":
        return String(i);
      case "ii":
        return I(i, e.length);
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
  a: function(a, e, t) {
    const i = a.getHours() / 12 >= 1 ? "pm" : "am";
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
  b: function(a, e, t) {
    const n = a.getHours();
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
  B: function(a, e, t) {
    const n = a.getHours();
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
  h: function(a, e, t) {
    if (e === "ho") {
      let n = a.getHours() % 12;
      return n === 0 && (n = 12), t.ordinalNumber(n, { unit: "hour" });
    }
    return B.h(a, e);
  },
  // Hour [0-23]
  H: function(a, e, t) {
    return e === "Ho" ? t.ordinalNumber(a.getHours(), { unit: "hour" }) : B.H(a, e);
  },
  // Hour [0-11]
  K: function(a, e, t) {
    const n = a.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(n, { unit: "hour" }) : I(n, e.length);
  },
  // Hour [1-24]
  k: function(a, e, t) {
    let n = a.getHours();
    return n === 0 && (n = 24), e === "ko" ? t.ordinalNumber(n, { unit: "hour" }) : I(n, e.length);
  },
  // Minute
  m: function(a, e, t) {
    return e === "mo" ? t.ordinalNumber(a.getMinutes(), { unit: "minute" }) : B.m(a, e);
  },
  // Second
  s: function(a, e, t) {
    return e === "so" ? t.ordinalNumber(a.getSeconds(), { unit: "second" }) : B.s(a, e);
  },
  // Fraction of second
  S: function(a, e) {
    return B.S(a, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(a, e, t) {
    const n = a.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (e) {
      case "X":
        return le(n);
      case "XXXX":
      case "XX":
        return z(n);
      case "XXXXX":
      case "XXX":
      default:
        return z(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(a, e, t) {
    const n = a.getTimezoneOffset();
    switch (e) {
      case "x":
        return le(n);
      case "xxxx":
      case "xx":
        return z(n);
      case "xxxxx":
      case "xxx":
      default:
        return z(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(a, e, t) {
    const n = a.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + ce(n, ":");
      case "OOOO":
      default:
        return "GMT" + z(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(a, e, t) {
    const n = a.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + ce(n, ":");
      case "zzzz":
      default:
        return "GMT" + z(n, ":");
    }
  },
  // Seconds timestamp
  t: function(a, e, t) {
    const n = Math.trunc(+a / 1e3);
    return I(n, e.length);
  },
  // Milliseconds timestamp
  T: function(a, e, t) {
    return I(+a, e.length);
  }
};
function ce(a, e = "") {
  const t = a > 0 ? "-" : "+", n = Math.abs(a), i = Math.trunc(n / 60), o = n % 60;
  return o === 0 ? t + String(i) : t + String(i) + e + I(o, 2);
}
function le(a, e) {
  return a % 60 === 0 ? (a > 0 ? "-" : "+") + I(Math.abs(a) / 60, 2) : z(a, e);
}
function z(a, e = "") {
  const t = a > 0 ? "-" : "+", n = Math.abs(a), i = I(Math.trunc(n / 60), 2), o = I(n % 60, 2);
  return t + i + e + o;
}
const de = (a, e) => {
  switch (a) {
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
}, Ce = (a, e) => {
  switch (a) {
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
}, kt = (a, e) => {
  const t = a.match(/(P+)(p+)?/) || [], n = t[1], i = t[2];
  if (!i)
    return de(a, e);
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
  return o.replace("{{date}}", de(n, e)).replace("{{time}}", Ce(i, e));
}, Ct = {
  p: Ce,
  P: kt
}, It = /^D+$/, Et = /^Y+$/, St = ["D", "DD", "YY", "YYYY"];
function Pt(a) {
  return It.test(a);
}
function $t(a) {
  return Et.test(a);
}
function Lt(a, e, t) {
  const n = Mt(a, e, t);
  if (console.warn(n), St.includes(a)) throw new RangeError(n);
}
function Mt(a, e, t) {
  const n = a[0] === "Y" ? "years" : "days of the month";
  return `Use \`${a.toLowerCase()}\` instead of \`${a}\` (in \`${e}\`) for formatting ${n} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Dt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, At = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Bt = /^'([^]*?)'?$/, Wt = /''/g, zt = /[a-zA-Z]/;
function W(a, e, t) {
  var u, h, d, p;
  const n = G(), i = n.locale ?? xt, o = n.firstWeekContainsDate ?? ((h = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, s = n.weekStartsOn ?? ((p = (d = n.locale) == null ? void 0 : d.options) == null ? void 0 : p.weekStartsOn) ?? 0, r = A(a, t == null ? void 0 : t.in);
  if (!Ne(r))
    throw new RangeError("Invalid time value");
  let l = e.match(At).map((g) => {
    const f = g[0];
    if (f === "p" || f === "P") {
      const b = Ct[f];
      return b(g, i.formatLong);
    }
    return g;
  }).join("").match(Dt).map((g) => {
    if (g === "''")
      return { isToken: !1, value: "'" };
    const f = g[0];
    if (f === "'")
      return { isToken: !1, value: Ot(g) };
    if (re[f])
      return { isToken: !0, value: g };
    if (f.match(zt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + f + "`"
      );
    return { isToken: !1, value: g };
  });
  i.localize.preprocessor && (l = i.localize.preprocessor(r, l));
  const c = {
    firstWeekContainsDate: o,
    weekStartsOn: s,
    locale: i
  };
  return l.map((g) => {
    if (!g.isToken) return g.value;
    const f = g.value;
    ($t(f) || Pt(f)) && Lt(f, e, String(a));
    const b = re[f[0]];
    return b(r, f, i.localize, c);
  }).join("");
}
function Ot(a) {
  const e = a.match(Bt);
  return e ? e[1].replace(Wt, "'") : a;
}
function Nt(a, e) {
  return ie(
    D(a, a),
    ne(a)
  );
}
function Ft(a, e) {
  return ie(
    a,
    ve(ne(a), 1),
    e
  );
}
function Rt(a, e, t) {
  return ve(a, -1, t);
}
function qt(a, e) {
  return ie(
    D(a, a),
    Rt(ne(a))
  );
}
function Ht(a) {
  try {
    let e = orca.state.settings[me.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Nt(a))
      return "今天";
    if (qt(a))
      return "昨天";
    if (Ft(a))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const n = a.getDay(), o = ["日", "一", "二", "三", "四", "五", "六"][n], s = e.replace(/E/g, o);
          return W(a, s);
        } else
          return W(a, e);
      else
        return W(a, e);
    } catch {
      const n = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of n)
        try {
          return W(a, i);
        } catch {
          continue;
        }
      return a.toLocaleDateString();
    }
  } catch (e) {
    return console.warn("日期格式化失败:", e), a.toLocaleDateString();
  }
}
function V(a) {
  try {
    const e = _t(a, "_repr");
    if (!e || e.type !== xe.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch (e) {
    return console.warn("提取日期块信息失败:", e), null;
  }
}
function _t(a, e) {
  return !a.properties || !Array.isArray(a.properties) ? null : a.properties.find((t) => t.name === e);
}
function Vt(a) {
  if (!Array.isArray(a) || a.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const n of a)
    n && typeof n == "object" && (n.t === "text" && n.v ? e++ : n.t === "ref" && n.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function Ut(a) {
  if (!a || a.length === 0) return "";
  let e = "";
  for (const t of a)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function Yt(a, e, t, n) {
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
  const s = document.createElement("span");
  if (s.textContent = a, s.style.cssText = `
    flex: 1;
    color: #333;
  `, i.appendChild(o), i.appendChild(s), t && t.trim() !== "") {
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
function jt(a, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
  if (t) {
    const n = parseInt(t[1], 16), i = parseInt(t[2], 16), o = parseInt(t[3], 16);
    return `rgba(${n}, ${i}, ${o}, ${e})`;
  }
  return `rgba(200, 200, 200, ${e})`;
}
function Y() {
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
function Xt(a, e, t = 200) {
  const n = e ? t : 400, i = 40, o = window.innerWidth - n, s = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(a.x, o)),
    y: Math.max(0, Math.min(a.y, s))
  };
}
function Gt(a) {
  const e = Y();
  return {
    isVerticalMode: a.isVerticalMode ?? e.isVerticalMode,
    verticalWidth: a.verticalWidth ?? e.verticalWidth,
    verticalPosition: a.verticalPosition ?? e.verticalPosition,
    horizontalPosition: a.horizontalPosition ?? e.horizontalPosition,
    isSidebarAlignmentEnabled: a.isSidebarAlignmentEnabled ?? e.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: a.isFloatingWindowVisible ?? e.isFloatingWindowVisible,
    showBlockTypeIcons: a.showBlockTypeIcons ?? e.showBlockTypeIcons,
    showInHeadbar: a.showInHeadbar ?? e.showInHeadbar
  };
}
function U(a, e, t) {
  return a ? { ...e } : { ...t };
}
function Jt(a, e, t, n) {
  return e ? {
    verticalPosition: { ...a },
    horizontalPosition: { ...n }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...a }
  };
}
function Zt(a) {
  return `布局模式: ${a.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${a.verticalWidth}px, 垂直位置: (${a.verticalPosition.x}, ${a.verticalPosition.y}), 水平位置: (${a.horizontalPosition.x}, ${a.horizontalPosition.y})`;
}
function ue(a, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${a.x}, ${a.y})`;
}
function Kt(a, e, t, n) {
  let i, o, s = "normal";
  if (t ? (i = "rgba(255, 255, 255, 0.1)", o = "#ffffff") : (i = "rgba(200, 200, 200, 0.6)", o = "#333333"), a.color)
    try {
      const r = a.color.startsWith("#") ? a.color : `#${a.color}`;
      i = n(r, "background", t), o = n(r, "text", t), s = "600";
    } catch (r) {
      console.warn("颜色处理失败，使用默认颜色:", r);
    }
  return e ? `
    background: ${i};
    color: ${o};
    font-weight: ${s};
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
    font-weight: ${s};
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
function Qt() {
  const a = document.createElement("div");
  return a.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, a;
}
function en(a) {
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
  `, a.startsWith("ti ti-")) {
    const t = document.createElement("i");
    t.className = a, e.appendChild(t);
  } else
    e.textContent = a;
  return e;
}
function tn(a) {
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
  `, e.appendChild(t), e.textContent = a, e;
}
function nn() {
  const a = document.createElement("span");
  return a.textContent = "📌", a.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, a;
}
function on(a) {
  let e = a.title;
  return a.isPinned && (e += " (已固定)"), e;
}
function an() {
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
function he(a = "primary") {
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
  }[a];
}
function sn() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function rn(a, e, t, n) {
  return a ? `
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
function cn(a) {
  for (let e = a.length - 1; e >= 0; e--)
    if (!a[e].isPinned)
      return e;
  return -1;
}
function ln(a) {
  return [...a].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function dn(a, e, t = {}) {
  try {
    const {
      updateOrder: n = !0,
      saveData: i = !0,
      updateUI: o = !0
    } = t, s = e.findIndex((l) => l.blockId === a.blockId);
    if (s === -1)
      return {
        success: !1,
        message: `标签不存在: ${a.title}`
      };
    e[s].isPinned = !e[s].isPinned, n && gn(e);
    const r = e[s].isPinned ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${a.title}" 已${r}`,
      data: { tab: e[s], tabIndex: s }
    };
  } catch (n) {
    return {
      success: !1,
      message: `切换固定状态失败: ${n}`
    };
  }
}
function un(a, e, t, n = {}) {
  try {
    const {
      updateUI: i = !0,
      saveData: o = !0,
      validateData: s = !0
    } = n, r = t.findIndex((l) => l.blockId === a.blockId);
    if (r === -1)
      return {
        success: !1,
        message: `标签不存在: ${a.title}`
      };
    if (s) {
      const l = pn(e);
      if (!l.success)
        return l;
    }
    return t[r] = { ...t[r], ...e }, {
      success: !0,
      message: `标签 "${a.title}" 已更新`,
      data: { tab: t[r], tabIndex: r }
    };
  } catch (i) {
    return {
      success: !1,
      message: `更新标签失败: ${i}`
    };
  }
}
function hn(a, e, t, n = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : un(a, { title: e.trim() }, t, n);
}
function pn(a) {
  return a.blockId !== void 0 && (!a.blockId || a.blockId.trim() === "") ? {
    success: !1,
    message: "标签块ID不能为空"
  } : a.title !== void 0 && (!a.title || a.title.trim() === "") ? {
    success: !1,
    message: "标签标题不能为空"
  } : a.order !== void 0 && (a.order < 0 || !Number.isInteger(a.order)) ? {
    success: !1,
    message: "标签顺序必须是正整数"
  } : {
    success: !0,
    message: "标签数据验证通过"
  };
}
function gn(a) {
  a.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function fn(a, e, t, n) {
  return e ? {
    x: a.x,
    y: a.y,
    width: t,
    height: n
  } : {
    x: a.x,
    y: a.y,
    width: Math.min(800, window.innerWidth - a.x - 10),
    height: 28
  };
}
function bn(a, e, t, n) {
  const i = fn(a, e, t, n);
  let o = a.x, s = a.y;
  return i.x < 0 ? o = 0 : i.x + i.width > window.innerWidth && (o = window.innerWidth - i.width), i.y < 0 ? s = 0 : i.y + i.height > window.innerHeight && (s = window.innerHeight - i.height), { x: o, y: s };
}
function pe(a, e, t = !1) {
  let n = null;
  const i = (...o) => {
    const s = t && !n;
    n && clearTimeout(n), n = window.setTimeout(() => {
      n = null, t || a(...o);
    }, e), s && a(...o);
  };
  return i.cancel = () => {
    n && (clearTimeout(n), n = null);
  }, i;
}
function mn(a, e, t) {
  var n, i;
  try {
    const o = a.startsWith("#") ? a : `#${a}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(o))
      return console.warn("无效的十六进制颜色格式:", o), e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const s = parseInt(o.slice(1, 3), 16), r = parseInt(o.slice(3, 5), 16), l = parseInt(o.slice(5, 7), 16), c = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((i = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : i.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${s}, ${r}, ${l}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : c ? `oklch(from rgb(${s}, ${r}, ${l}) calc(l * 1.6) c h)` : `oklch(from rgb(${s}, ${r}, ${l}) calc(l * 0.6) c h)`;
  } catch (o) {
    return console.warn("颜色转换失败:", o), e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
var _ = /* @__PURE__ */ ((a) => (a[a.ERROR = 0] = "ERROR", a[a.WARN = 1] = "WARN", a[a.INFO = 2] = "INFO", a[a.DEBUG = 3] = "DEBUG", a[a.VERBOSE = 4] = "VERBOSE", a))(_ || {});
const xn = {
  level: 2,
  enableConsole: !0,
  enableStorage: !1,
  maxStorageEntries: 1e3,
  enableTimestamps: !0,
  enableColors: !0,
  prefix: "[OrcaTabs]"
};
class J {
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
    this.config = { ...xn, ...e };
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
    const { timestamp: t, level: n, message: i, data: o, source: s } = e;
    _[n];
    const r = this.config.enableTimestamps ? new Date(t).toLocaleTimeString() : "", l = `${this.config.prefix}${r ? ` [${r}]` : ""}`, c = s ? ` [${s}]` : "", u = `${l}${c} ${i}`;
    if (this.config.enableColors && typeof window < "u") {
      const h = this.colors[n];
      console.log(`%c${u}`, `color: ${h}`, o || "");
    } else
      this.getConsoleMethod(n)(u, o || "");
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
      const n = new Date(t.timestamp).toLocaleString(), i = _[t.level], o = t.source ? ` [${t.source}]` : "", s = t.data ? ` ${JSON.stringify(t.data)}` : "";
      return `[${n}] ${i}${o}: ${t.message}${s}`;
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
    const t = new J(this.config);
    return t.config.prefix = `${this.config.prefix}[${e}]`, t;
  }
}
new J();
function yn(a, e, t, n) {
  const i = document.createElement("div");
  i.className = "orca-tabs-container";
  const o = rn(a, e, n, t);
  return i.style.cssText = o, i;
}
function vn(a, e, t) {
  const n = document.createElement("div");
  n.className = "width-adjustment-dialog";
  const i = an();
  n.style.cssText = i;
  const o = document.createElement("div");
  o.className = "dialog-title", o.textContent = "调整面板宽度", n.appendChild(o);
  const s = document.createElement("div");
  s.className = "dialog-slider-container", s.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const r = document.createElement("input");
  r.type = "range", r.min = "120", r.max = "800", r.value = a.toString(), r.style.cssText = sn();
  const l = document.createElement("div");
  l.className = "dialog-width-display", l.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, l.textContent = `当前宽度: ${a}px`, r.oninput = () => {
    const d = parseInt(r.value);
    l.textContent = `当前宽度: ${d}px`, e(d);
  }, s.appendChild(r), s.appendChild(l), n.appendChild(s);
  const c = document.createElement("div");
  c.className = "dialog-buttons", c.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const u = document.createElement("button");
  u.className = "btn btn-primary", u.textContent = "确定", u.style.cssText = he(), u.onclick = () => ge(n);
  const h = document.createElement("button");
  return h.className = "btn btn-secondary", h.textContent = "取消", h.style.cssText = he(), h.onclick = () => {
    t(), ge(n);
  }, c.appendChild(u), c.appendChild(h), n.appendChild(c), n;
}
function ge(a) {
  a && a.parentNode && a.parentNode.removeChild(a);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function Tn() {
  if (document.getElementById("dialog-styles")) return;
  const a = document.createElement("style");
  a.id = "dialog-styles", a.textContent = `
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
  `, document.head.appendChild(a);
}
function wn() {
  const a = document.querySelector("section#main");
  if (!a)
    return console.warn("❌ 未找到 section#main"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const e = a.querySelector(".orca-panels-row");
  if (!e)
    return console.warn("❌ 未找到 .orca-panels-row"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const t = e.querySelectorAll('.orca-panel:not([data-menu-panel="true"])'), n = [];
  let i = null;
  return t.forEach((o) => {
    const s = o.getAttribute("data-panel-id");
    s && (n.push(s), o.classList.contains("active") && (i = s));
  }), {
    panelIds: n,
    activePanelId: i,
    panelCount: n.length
  };
}
function kn(a, e) {
  return a.length !== e.length ? !0 : !a.every((t, n) => t === e[n]);
}
let q;
class Cn {
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
    m(this, "storageService", new De());
    // 存储服务实例
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 日志管理 - Log Management */
    /* ———————————————————————————————————————————————————————————————————————————— */
    // 日志管理器
    m(this, "logManager", new J({
      level: typeof window < "u" && window.DEBUG_ORCA_TABS_VERBOSE === !0 ? _.VERBOSE : _.WARN,
      // 只显示警告和错误
      enableConsole: typeof window < "u" && window.DEBUG_ORCA_TABS === !0,
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
    m(this, "normalDebounce", pe(async () => {
      await this.updateTabsUI();
    }, 100));
    m(this, "draggingDebounce", pe(async () => {
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
    Tn();
    try {
      this.maxTabs = orca.state.settings[me.CachedEditorNum] || 10;
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
      const s = o.getBoundingClientRect();
      t === "before" ? (n.style.left = `${i.left - s.left}px`, n.style.top = `${i.top - s.top - 1}px`, n.style.width = `${i.width}px`) : (n.style.left = `${i.left - s.left}px`, n.style.top = `${i.bottom - s.top - 1}px`, n.style.width = `${i.width}px`), o.appendChild(n);
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
    const s = n[o], r = n[i];
    n[i] = s, n[o] = r, n.forEach((l, c) => {
      l.order = c;
    }), this.sortTabsByPinStatus(), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`✅ 标签交换完成: ${s.title} -> 位置 ${i}`);
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
    const { panelIds: t, activePanelId: n, panelCount: i } = wn();
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
    const e = this.getCurrentPanelTabs(), t = ln(e);
    this.setCurrentPanelTabs(t);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    const e = this.getCurrentPanelTabs();
    return cn(e);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    return Ut(e);
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
    return Vt(e);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 检测块类型
   */
  async detectBlockType(e) {
    try {
      if (V(e))
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
      if (n && n.type === xe.JSON && n.value)
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
          const i = e.getDay(), s = ["日", "一", "二", "三", "四", "五", "六"][i], r = t.replace(/E/g, s);
          return W(e, r);
        } else
          return W(e, t);
      else
        return W(e, t);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const o of i)
        try {
          return W(e, o);
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
      let o = "", s = "", r = "", l = !1, c = "";
      c = await this.detectBlockType(i), this.log(`🔍 检测到块类型: ${c} (块ID: ${e})`), i.aliases && i.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${c}`);
      try {
        const u = V(i);
        if (u)
          l = !0, o = Ht(u), console.log(`📅 识别为日期块: ${o}, 原始日期: ${u.toISOString()}`);
        else if (i.aliases && i.aliases.length > 0)
          o = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? o = i.text.substring(0, 50) : o = (await this.extractTextFromContent(i.content)).substring(0, 50);
        else if (i.text) {
          let h = i.text.substring(0, 50);
          if (c === "list") {
            const d = i.text.split(`
`)[0].trim();
            d && (h = d.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (c === "table") {
            const d = i.text.split(`
`)[0].trim();
            d && (h = d.replace(/\|/g, "").trim());
          } else if (c === "quote") {
            const d = i.text.split(`
`)[0].trim();
            d && (h = d.replace(/^>\s+/, ""));
          } else if (c === "image") {
            const d = i.text.match(/caption:\s*(.+)/i);
            d && d[1] ? h = d[1].trim() : h = i.text.trim();
          }
          o = h;
        } else
          o = `块 ${e}`, console.log(`❌ 没有找到合适的标题，使用块ID: ${e}`);
      } catch (u) {
        this.warn("获取标题失败:", u), o = `块 ${e}`;
      }
      try {
        const u = this.findProperty(i, "_color"), h = this.findProperty(i, "_icon");
        u && u.type === 1 && (s = u.value), h && h.type === 1 ? (r = h.value, this.log(`🎨 使用用户自定义图标: ${r} (块ID: ${e})`)) : (this.showBlockTypeIcons || c === "journal") && (r = this.getBlockTypeIcon(c), this.log(`🎨 使用块类型图标: ${r} (块类型: ${c}, 块ID: ${e})`));
      } catch (u) {
        this.warn("获取属性失败:", u), r = this.getBlockTypeIcon(c);
      }
      return {
        blockId: e,
        panelId: t,
        title: o || `块 ${e}`,
        color: s,
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
    if (this.isFixedToTop ? (n = { x: 0, y: 0 }, i = !1, o = window.innerWidth) : (n = this.isVerticalMode ? this.verticalPosition : this.position, i = this.isVerticalMode, o = this.verticalWidth), this.tabContainer = yn(
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
    const s = document.createElement("div");
    s.className = "drag-handle", s.style.cssText = `
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
    `, s.innerHTML = "", s.addEventListener("mouseenter", () => {
      s.style.opacity = "0.5";
    }), s.addEventListener("mouseleave", () => {
      s.style.opacity = "0";
    }), s.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(s), this.isFixedToTop || document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && this.enableDragResize(), await this.updateTabsUI();
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
    if (n && i ? (this.log("📋 显示第一个面板的固化标签页"), this.sortTabsByPinStatus(), this.firstPanelTabs.forEach((o, s) => {
      var l;
      const r = this.createTabElement(o);
      (l = this.tabContainer) == null || l.appendChild(r);
    }), this.addNewTabButton()) : await this.showCurrentPanelTabsSync(), this.isFixedToTop) {
      const o = orca.state.themeMode === "dark", s = o ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", r = o ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)", l = o ? "#ffffff" : "#333", c = this.tabContainer.querySelectorAll(".orca-tab");
      c.forEach((h) => {
        const d = h.getAttribute("data-tab-id");
        if (!d) return;
        const g = this.getCurrentPanelTabs().find((f) => f.blockId === d);
        if (g) {
          let f, b, T = "normal";
          if (o ? (f = "rgba(255, 255, 255, 0.1)", b = "#ffffff") : (f = "rgba(200, 200, 200, 0.6)", b = "#333333"), g.color)
            try {
              f = this.applyOklchFormula(g.color, "background"), b = this.applyOklchFormula(g.color, "text"), T = "600";
            } catch (y) {
              console.warn("颜色处理失败，使用默认颜色:", y);
            }
          h.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${f};
            border-radius: 4px;
            border: 1px solid ${r};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${b};
            font-weight: ${T};
            max-width: 150px;
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
          background: ${s};
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
      const u = await this.getTabInfo(c, this.currentPanelId, o++);
      u && i.push(u);
    }
    const s = this.mergeTabsIntelligently(n, i);
    this.setCurrentPanelTabs(s), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), this.log(`📋 面板 ${this.currentPanelIndex + 1} 扫描并保存了 ${s.length} 个标签页`);
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
    var h, d;
    const t = document.querySelector(".new-tab-context-menu");
    t && t.remove();
    const n = document.documentElement.classList.contains("dark") || ((d = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : d.themeMode) === "dark", i = document.createElement("div");
    i.className = "new-tab-context-menu";
    const o = 200, s = 140;
    let r = e.clientX, l = e.clientY;
    r + o > window.innerWidth && (r = window.innerWidth - o - 10), l + s > window.innerHeight && (l = window.innerHeight - s - 10), r = Math.max(10, r), l = Math.max(10, l), i.style.cssText = `
      position: fixed;
      left: ${r}px;
      top: ${l}px;
      background: ${n ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
      border: 1px solid ${n ? "#444" : "#ddd"};
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: ${o}px;
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
    ), c.forEach((p) => {
      if (p.separator) {
        const b = document.createElement("div");
        b.style.cssText = `
          height: 1px;
          background: ${n ? "#444" : "#ddd"};
          margin: 4px 8px;
        `, i.appendChild(b);
        return;
      }
      const g = document.createElement("div");
      if (g.style.cssText = `
        padding: 12px 16px;
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
      const f = document.createElement("span");
      f.textContent = p.text, g.appendChild(f), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = n ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        p.action && p.action(), i.remove();
      }), i.appendChild(g);
    }), document.body.appendChild(i);
    const u = (p) => {
      i.contains(p.target) || (i.remove(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
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
      const s = this.calculateSidebarAlignmentPosition(
        o,
        e,
        n,
        i
      );
      if (!s) return;
      await this.updatePosition(s), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${o.x}, ${o.y}) → (${s.x}, ${s.y})`);
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
    var s;
    let o;
    if (n)
      o = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${o}px`);
    else if (i) {
      o = e.x + t;
      const r = ((s = this.tabContainer) == null ? void 0 : s.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
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
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), this.registerHeadbarButton(), await this.storageService.saveConfig(C.FLOATING_WINDOW_VISIBLE, this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("切换浮窗状态失败:", e);
    }
  }
  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    try {
      const e = await this.storageService.getConfig(C.FLOATING_WINDOW_VISIBLE, "orca-tabs-plugin", !1);
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
          const o = await this.detectBlockType(i), s = this.findProperty(i, "_color"), r = this.findProperty(i, "_icon");
          let l = n.color, c = n.icon;
          s && s.type === 1 && (l = s.value), r && r.type === 1 ? c = r.value : c || (c = this.getBlockTypeIcon(o)), n.blockType !== o || n.icon !== c || n.color !== l ? (this.firstPanelTabs[t] = {
            ...n,
            blockType: o,
            icon: c,
            color: l
          }, this.log(`✅ 更新标签: ${n.title} -> 类型: ${o}, 图标: ${c}, 颜色: ${l}`), e = !0) : this.verboseLog(`⏭️ 跳过标签: ${n.title} (无需更新)`);
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
    const t = e.clientX, n = this.verticalWidth, i = async (s) => {
      const r = s.clientX - t, l = Math.max(120, Math.min(400, n + r));
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
      } catch (s) {
        this.error("保存宽度设置失败:", s);
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
    const t = this.verticalWidth, n = vn(
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
    const i = orca.state.themeMode === "dark", o = this.isVerticalMode && !this.isFixedToTop, s = Kt(e, o, i, (c, u) => this.applyOklchFormula(c, u));
    t.style.cssText = s;
    const r = Qt();
    if (e.icon && this.showBlockTypeIcons) {
      const c = en(e.icon);
      r.appendChild(c);
    }
    const l = tn(e.title);
    if (r.appendChild(l), e.isPinned) {
      const c = nn();
      r.appendChild(c);
    }
    return t.appendChild(r), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), t.title = on(e), t.addEventListener("click", (c) => {
      var h;
      console.log(`🖱️ 标签点击事件触发: ${e.title} (ID: ${e.blockId})`), c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.log(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`);
      const u = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tab");
      u == null || u.forEach((d) => d.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (c) => {
      console.log(`🖱️ 标签mousedown事件触发: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dblclick", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.closeTab(e));
    }), t.addEventListener("keydown", (c) => {
      (c.target === t || t.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(e)) : c.ctrlKey && c.key === "p" ? (c.preventDefault(), c.stopPropagation(), this.toggleTabPinStatus(e)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (c) => {
      var h;
      if (c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", (h = c.dataTransfer) == null || h.setData("text/plain", e.blockId), this.draggingTab = e, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), t.setAttribute("data-dragging", "true"), t.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", (c) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.hideDropZoneIndicator(), this.clearDragVisualFeedback(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (c) => {
      if (!c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (c.preventDefault(), c.stopPropagation(), c.dataTransfer.dropEffect = "move", !this.dragOverTab || this.dragOverTab.blockId !== e.blockId) {
          const h = t.getBoundingClientRect(), d = h.top + h.height / 2, p = c.clientY < d ? "before" : "after";
          this.updateDropIndicator(t, p), this.dragOverTab = e;
        }
        this.debouncedSwapTab(e, this.draggingTab), this.verboseLog(`🔄 拖拽经过: ${e.title} (目标: ${this.draggingTab.title})`);
      }
    }), t.addEventListener("dragenter", (c) => {
      c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== e.blockId && (c.preventDefault(), c.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`));
    }), t.addEventListener("dragleave", (c) => {
      const u = t.getBoundingClientRect(), h = c.clientX, d = c.clientY, p = 5;
      (h < u.left - p || h > u.right + p || d < u.top - p || d > u.bottom + p) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (c) => {
      var h;
      c.preventDefault();
      const u = (h = c.dataTransfer) == null ? void 0 : h.getData("text/plain");
      this.log(`🔄 拖拽放置: ${u} -> ${e.blockId}`);
    }), t;
  }
  hexToRgba(e, t) {
    return jt(e, t);
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
      let i = parseInt(n[1], 16), o = parseInt(n[2], 16), s = parseInt(n[3], 16);
      i = Math.floor(i * (1 - t)), o = Math.floor(o * (1 - t)), s = Math.floor(s * (1 - t));
      const r = i.toString(16).padStart(2, "0"), l = o.toString(16).padStart(2, "0"), c = s.toString(16).padStart(2, "0");
      return `#${r}${l}${c}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, n) {
    const i = e / 255, o = t / 255, s = n / 255, r = (w) => w <= 0.04045 ? w / 12.92 : Math.pow((w + 0.055) / 1.055, 2.4), l = r(i), c = r(o), u = r(s), h = l * 0.4124564 + c * 0.3575761 + u * 0.1804375, d = l * 0.2126729 + c * 0.7151522 + u * 0.072175, p = l * 0.0193339 + c * 0.119192 + u * 0.9503041, g = 0.2104542553 * h + 0.793617785 * d - 0.0040720468 * p, f = 1.9779984951 * h - 2.428592205 * d + 0.4505937099 * p, b = 0.0259040371 * h + 0.7827717662 * d - 0.808675766 * p, T = Math.cbrt(g), y = Math.cbrt(f), x = Math.cbrt(b), v = 0.2104542553 * T + 0.793617785 * y + 0.0040720468 * x, S = 1.9779984951 * T - 2.428592205 * y + 0.4505937099 * x, L = 0.0259040371 * T + 0.7827717662 * y - 0.808675766 * x, k = Math.sqrt(S * S + L * L), E = Math.atan2(L, S) * 180 / Math.PI, M = E < 0 ? E + 360 : E;
    return { l: v, c: k, h: M };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, n) {
    const i = n * Math.PI / 180, o = t * Math.cos(i), s = t * Math.sin(i), r = e, l = o, c = s, u = r * r * r, h = l * l * l, d = c * c * c, p = 1.0478112 * u + 0.0228866 * h - 0.050217 * d, g = 0.0295424 * u + 0.9904844 * h + 0.0170491 * d, f = -92345e-7 * u + 0.0150436 * h + 0.7521316 * d, b = 3.2404542 * p - 1.5371385 * g - 0.4985314 * f, T = -0.969266 * p + 1.8760108 * g + 0.041556 * f, y = 0.0556434 * p - 0.2040259 * g + 1.0572252 * f, x = (k) => k <= 31308e-7 ? 12.92 * k : 1.055 * Math.pow(k, 1 / 2.4) - 0.055, v = Math.max(0, Math.min(255, Math.round(x(b) * 255))), S = Math.max(0, Math.min(255, Math.round(x(T) * 255))), L = Math.max(0, Math.min(255, Math.round(x(y) * 255)));
    return { r: v, g: S, b: L };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    return mn(e, t);
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
            const s = await orca.invokeBackend("get-block", parseInt(e.blockId));
            if (s) {
              const r = V(s);
              r && !isNaN(r.getTime()) && (i = r, console.log(`📅 从块信息获取日期: ${r.toISOString()}`), o = !1);
            }
          } catch (s) {
            console.log("❌ 获取块信息失败:", s);
          }
          if (!i)
            if (e.title.includes("今天") || e.title.includes("Today")) {
              console.log("📅 使用原生命令跳转到今天");
              try {
                await orca.commands.invokeCommand("core.goToday"), console.log("✅ 今天导航成功"), o = !0;
              } catch (s) {
                console.log("❌ 今天导航失败:", s), i = /* @__PURE__ */ new Date(), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else if (e.title.includes("昨天") || e.title.includes("Yesterday")) {
              console.log("📅 使用原生命令跳转到昨天");
              try {
                await orca.commands.invokeCommand("core.goYesterday"), console.log("✅ 昨天导航成功"), o = !0;
              } catch (s) {
                console.log("❌ 昨天导航失败:", s), i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() - 1), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else if (e.title.includes("明天") || e.title.includes("Tomorrow")) {
              console.log("📅 使用原生命令跳转到明天");
              try {
                await orca.commands.invokeCommand("core.goTomorrow"), console.log("✅ 明天导航成功"), o = !0;
              } catch (s) {
                console.log("❌ 明天导航失败:", s), i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() + 1), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else {
              const s = e.title.match(/(\d{4}-\d{2}-\d{2})/);
              if (s) {
                const r = s[1];
                i = /* @__PURE__ */ new Date(r + "T00:00:00.000Z"), isNaN(i.getTime()) ? (console.log(`❌ 无效的日期格式: ${r}`), i = null) : console.log(`📅 从标题提取日期: ${r} -> ${i.toISOString()}`);
              } else {
                console.log(`🔍 尝试从块信息中获取原始日期: ${e.blockId}`);
                try {
                  const r = await orca.invokeBackend("get-block", parseInt(e.blockId));
                  if (r) {
                    const l = V(r);
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
              } catch (s) {
                console.log("❌ 日期导航失败:", s);
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
              } catch (s) {
                throw console.log("❌ 块ID导航失败:", s), s;
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
          const s = document.querySelector(`[data-block-id="${e.blockId}"]`) || document.querySelector(`#block-${e.blockId}`) || document.querySelector(`.block-${e.blockId}`);
          s ? (this.log("🔄 找到备用块元素，尝试点击"), s.click()) : this.error("完全无法找到目标块元素");
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
    const t = this.getCurrentPanelTabs(), n = dn(e, t, {
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
      let s = n.length;
      if (o) {
        const r = n.findIndex((l) => l.blockId === o.blockId);
        r !== -1 && (s = r + 1, this.log(`🎯 将在聚焦标签 "${o.title}" 后面插入新标签: "${i.title}"`));
      } else
        this.log("🎯 没有聚焦标签，将添加到末尾");
      if (n.length >= this.maxTabs) {
        n.splice(s, 0, i), this.verboseLog(`➕ 在位置 ${s} 插入新标签: ${i.title}`);
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
        n.splice(s, 0, i), this.verboseLog(`➕ 在位置 ${s} 插入新标签: ${i.title}`);
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
      if (i.find((u) => u.blockId === e))
        return this.log(`📋 块 ${e} 已存在于标签页中`), n && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId), !0;
      if (!orca.state.blocks[parseInt(e)])
        return this.warn(`无法找到块 ${e}`), !1;
      const r = await this.getTabInfo(e, this.currentPanelId, i.length);
      if (!r)
        return this.warn(`无法获取块 ${e} 的标签信息`), !1;
      let l = i.length, c = !1;
      if (t === "replace") {
        const u = this.getCurrentActiveTab();
        if (!u)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const h = i.findIndex((d) => d.blockId === u.blockId);
        if (h === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        u.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), l = h + 1, c = !1) : (l = h, c = !0);
      } else if (t === "after") {
        const u = this.getCurrentActiveTab();
        if (u) {
          const h = i.findIndex((d) => d.blockId === u.blockId);
          h !== -1 && (l = h + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (i.length >= this.maxTabs)
        if (c)
          i[l] = r;
        else {
          i.splice(l, 0, r);
          const u = this.findLastNonPinnedTabIndex();
          if (u !== -1)
            i.splice(u, 1);
          else {
            const h = i.findIndex((d) => d.blockId === r.blockId);
            if (h !== -1)
              return i.splice(h, 1), !1;
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
        const s = i.dataset;
        for (const [r, l] of Object.entries(s))
          if ((r.toLowerCase().includes("block") || r.toLowerCase().includes("ref")) && l && !isNaN(parseInt(l)))
            return this.log(`🔗 从data属性 ${r} 中提取到块引用ID: ${l}`), l;
        i = i.parentElement;
      }
      if (e.textContent) {
        const o = e.textContent.trim(), s = o.match(/\[\[(?:块)?(\d+)\]\]/) || o.match(/block[:\s]*(\d+)/i);
        if (s && s[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${s[1]}`), s[1];
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
    var t, n, i, o;
    try {
      const s = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let r = null;
      for (let c = s.length - 1; c >= 0; c--) {
        const u = s[c];
        if (u.offsetParent !== null && getComputedStyle(u).display !== "none") {
          r = u;
          break;
        }
      }
      if (!r) {
        this.log("🔗 未找到显示的右键菜单");
        return;
      }
      if (r.querySelector(".orca-tabs-ref-menu-item")) {
        this.log("🔗 块引用菜单项已存在");
        return;
      }
      if (this.log(`🔗 为块引用 ${e} 添加菜单项`), r.querySelectorAll('[role="menuitem"], .menu-item').length > 0) {
        const c = document.createElement("div");
        c.className = "orca-tabs-ref-menu-separator";
        const u = document.documentElement.classList.contains("dark") || ((n = (t = window.orca) == null ? void 0 : t.state) == null ? void 0 : n.themeMode) === "dark";
        c.style.cssText = `
          height: 1px;
          background: ${u ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
          margin: 4px 8px;
        `, r.appendChild(c);
      }
      if (this.savedTabSets.length > 0) {
        const c = document.createElement("div");
        c.className = "orca-tabs-ref-menu-item", c.setAttribute("role", "menuitem");
        const u = document.documentElement.classList.contains("dark") || ((o = (i = window.orca) == null ? void 0 : i.state) == null ? void 0 : o.themeMode) === "dark";
        c.style.cssText = `
          padding: 12px 16px;
          cursor: pointer;
          font-size: 14px;
          color: ${u ? "#ffffff" : "#333"};
          border-bottom: 1px solid ${u ? "#444" : "#eee"};
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        `, c.innerHTML = `
          <i class="ti ti-bookmark-plus" style="font-size: 14px;"></i>
          <span>添加到已有标签组</span>
        `, c.addEventListener("mouseenter", () => {
          c.style.backgroundColor = u ? "#444" : "#f0f0f0";
        }), c.addEventListener("mouseleave", () => {
          c.style.backgroundColor = "transparent";
        }), c.addEventListener("click", () => {
          const h = this.getCurrentActiveTab();
          h && this.showAddToTabGroupDialog(h), r == null || r.remove();
        }), r.appendChild(c);
      }
      this.log(`✅ 成功为块引用 ${e} 添加菜单项`);
    } catch (s) {
      this.error("增强块引用右键菜单时出错:", s);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(e, t, n, i) {
    return Yt(e, t, n, i);
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
          const s = o.closest(".orca-panel");
          s && (i = s.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!i) {
          const s = document.querySelector(".orca-panel.active");
          s && (i = s.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (i || (i = document.body.scrollTop > 0 ? document.body : document.documentElement), i) {
          const s = {
            x: i.scrollLeft || 0,
            y: i.scrollTop || 0
          };
          n.viewState.scrollPosition = s;
          const r = this.firstPanelTabs.findIndex((l) => l.blockId === e.blockId);
          r !== -1 && (this.firstPanelTabs[r].scrollPosition = s, await this.saveFirstPanelTabs()), this.log(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, s, "容器:", i.className);
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
      const o = (s = 1) => {
        if (s > 5) {
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
        r || (r = document.body.scrollTop > 0 ? document.body : document.documentElement), r ? (r.scrollLeft = t.x, r.scrollTop = t.y, this.log(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", r.className, `尝试${s}`)) : setTimeout(() => o(s + 1), 200 * s);
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
    const o = e.find((s) => s.blockId === i) || null;
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
      const i = this.getCurrentActiveTab(), o = i && i.blockId === e.blockId, s = o ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const r = { ...e, closedAt: Date.now() }, l = this.recentlyClosedTabs.findIndex((c) => c.blockId === e.blockId);
        l !== -1 && this.recentlyClosedTabs.splice(l, 1), this.recentlyClosedTabs.unshift(r), this.recentlyClosedTabs.length > 20 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 20)), await this.saveRecentlyClosedTabs();
      }
      t.splice(n, 1), this.debouncedUpdateTabsUI(), this.currentPanelIndex === 0 ? await this.saveFirstPanelTabs() : await this.saveSecondPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), o && s ? (this.log(`🔄 自动切换到相邻标签: "${s.title}"`), await this.switchToTab(s)) : o && !s && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
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
      (s) => s.blockId === e.blockId || s.isPinned
    );
    t.filter(
      (s) => s.blockId !== e.blockId && !s.isPinned
    ).forEach((s) => {
      this.closedTabs.add(s.blockId);
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
    const i = t.textContent, o = t.style.cssText, s = document.createElement("input");
    s.type = "text", s.value = e.title, s.className = "inline-rename-input";
    const r = orca.state.themeMode === "dark";
    let l = r ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", c = r ? "#ffffff" : "#333";
    e.color && (l = this.applyOklchFormula(e.color, "background"), c = this.applyOklchFormula(e.color, "text")), s.style.cssText = `
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
    `, t.textContent = "", t.appendChild(s), t.style.padding = "2px 8px", s.focus(), s.select();
    const u = async () => {
      const d = s.value.trim();
      if (d && d !== e.title) {
        await this.updateTabTitle(e, d);
        return;
      }
      t.textContent = i, t.style.cssText = o;
    }, h = () => {
      t.textContent = i, t.style.cssText = o;
    };
    s.addEventListener("blur", u), s.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), u()) : d.key === "Escape" && (d.preventDefault(), h());
    }), s.addEventListener("click", (d) => {
      d.stopPropagation();
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
    let s = { x: "50%", y: "50%" };
    if (o) {
      const h = o.getBoundingClientRect(), d = window.innerWidth, p = window.innerHeight, g = 300, f = 100, b = 20;
      let T = h.left, y = h.top - f - 10;
      T + g > d - b && (T = d - g - b), T < b && (T = b), y < b && (y = h.bottom + 10, y + f > p - b && (y = (p - f) / 2)), y + f > p - b && (y = p - f - b), T = Math.max(b, Math.min(T, d - g - b)), y = Math.max(b, Math.min(y, p - f - b)), s = { x: `${T}px`, y: `${y}px` };
    }
    const r = orca.components.InputBox, l = t.createElement(r, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (h, d, p) => {
        h && h.trim() && h.trim() !== e.title && this.updateTabTitle(e, h.trim()), p();
      },
      onCancel: (h) => {
        h();
      }
    }, (h) => t.createElement("div", {
      style: {
        position: "absolute",
        left: s.x,
        top: s.y,
        pointerEvents: "auto"
      },
      onClick: h
    }, ""));
    n.render(l, i), setTimeout(() => {
      const h = i.querySelector("div");
      h && h.click();
    }, 0);
    const c = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(i), i.remove();
      }, 100);
    }, u = (h) => {
      h.key === "Escape" && (c(), document.removeEventListener("keydown", u));
    };
    document.addEventListener("keydown", u);
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
    const s = document.createElement("button");
    s.textContent = "确认", s.style.cssText = `
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
    `, s.addEventListener("mouseenter", () => {
      s.style.backgroundColor = "#2563eb";
    }), s.addEventListener("mouseleave", () => {
      s.style.backgroundColor = "#3b82f6";
    }), r.addEventListener("mouseenter", () => {
      r.style.backgroundColor = "#4b5563";
    }), r.addEventListener("mouseleave", () => {
      r.style.backgroundColor = "#6b7280";
    }), o.appendChild(s), o.appendChild(r), n.appendChild(i), n.appendChild(o);
    const l = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (l) {
      const d = l.getBoundingClientRect();
      n.style.left = `${d.left}px`, n.style.top = `${d.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), i.focus(), i.select();
    const c = () => {
      const d = i.value.trim();
      d && d !== e.title && this.updateTabTitle(e, d), n.remove();
    }, u = () => {
      n.remove();
    };
    s.addEventListener("click", c), r.addEventListener("click", u), i.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), c()) : d.key === "Escape" && (d.preventDefault(), u());
    });
    const h = (d) => {
      n.contains(d.target) || (u(), document.removeEventListener("click", h));
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
      const n = this.getCurrentPanelTabs(), i = hn(e, t, n, {
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
        const o = window.React, s = window.ReactDOM;
        !o || !s || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? e.addEventListener("contextmenu", (r) => {
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
    const s = orca.components.ContextMenu, r = orca.components.Menu, l = orca.components.MenuText, c = orca.components.MenuSeparator, u = n.createElement(s, {
      menu: (p) => n.createElement(r, {}, [
        n.createElement(l, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            p(), this.renameTab(t);
          }
        }),
        n.createElement(l, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          shortcut: "Ctrl+P",
          onClick: () => {
            p(), this.toggleTabPinStatus(t);
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
            p(), this.closeTab(t);
          }
        }),
        n.createElement(l, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            p(), this.closeOtherTabs(t);
          }
        }),
        n.createElement(l, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
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
    i.render(u, o);
    const h = () => {
      i.unmountComponentAtNode(o), o.remove();
    }, d = new MutationObserver((p) => {
      p.forEach((g) => {
        g.removedNodes.forEach((f) => {
          f === e && (h(), d.disconnect());
        });
      });
    });
    d.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    var l, c;
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const i = document.documentElement.classList.contains("dark") || ((c = (l = window.orca) == null ? void 0 : l.state) == null ? void 0 : c.themeMode) === "dark", o = document.createElement("div");
    o.className = "tab-context-menu", o.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      background: ${i ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
      border: 1px solid ${i ? "#444" : "#ddd"};
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 180px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const s = [
      {
        text: "重命名标签",
        action: () => this.renameTab(t)
      },
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(t)
      }
    ];
    this.savedTabSets.length > 0 && s.push({
      text: "添加到已有标签组",
      action: () => this.showAddToTabGroupDialog(t)
    }), s.push(
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
    ), s.forEach((u) => {
      const h = document.createElement("div");
      h.textContent = u.text, h.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        color: ${u.disabled ? i ? "#666" : "#999" : i ? "#ffffff" : "#333"};
        border-bottom: 1px solid ${i ? "#444" : "#eee"};
        transition: background-color 0.2s;
      `, u.disabled || (h.addEventListener("mouseenter", () => {
        h.style.backgroundColor = i ? "#444" : "#f0f0f0";
      }), h.addEventListener("mouseleave", () => {
        h.style.backgroundColor = "transparent";
      }), h.addEventListener("click", () => {
        u.action(), o.remove();
      })), o.appendChild(h);
    }), document.body.appendChild(o);
    const r = (u) => {
      o.contains(u.target) || (o.remove(), document.removeEventListener("click", r));
    };
    setTimeout(() => {
      document.addEventListener("click", r);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    try {
      await this.storageService.saveConfig(C.FIRST_PANEL_TABS, this.firstPanelTabs), this.log("💾 保存标签数据到API配置");
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }
  /**
   * 保存第二个面板的标签数据到持久化存储（使用API）
   */
  async saveSecondPanelTabs() {
    try {
      await this.storageService.saveConfig(C.SECOND_PANEL_TABS, this.secondPanelTabs), this.log("💾 保存第二个面板标签数据到API配置");
    } catch (e) {
      this.warn("无法保存第二个面板标签数据:", e);
    }
  }
  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    try {
      await this.storageService.saveConfig(C.CLOSED_TABS, Array.from(this.closedTabs)), this.log("💾 保存已关闭标签列表到API配置");
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }
  /**
   * 保存最近关闭的标签页列表到持久化存储（使用API）
   */
  async saveRecentlyClosedTabs() {
    try {
      await this.storageService.saveConfig(C.RECENTLY_CLOSED_TABS, this.recentlyClosedTabs), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (e) {
      this.warn("无法保存最近关闭标签页列表:", e);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(C.FIRST_PANEL_TABS, "orca-tabs-plugin", []);
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
      const e = await this.storageService.getConfig(C.SECOND_PANEL_TABS, "orca-tabs-plugin", []);
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
            const s = await this.detectBlockType(o);
            let r = n.icon;
            r || (r = this.getBlockTypeIcon(s)), this.firstPanelTabs[t] = {
              ...n,
              blockType: s,
              icon: r
            }, this.log(`✅ 更新恢复的标签: ${n.title} -> 类型: ${s}, 图标: ${r}`), e = !0;
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
      const e = await this.storageService.getConfig(C.CLOSED_TABS, "orca-tabs-plugin", []);
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
      const e = await this.storageService.getConfig(C.RECENTLY_CLOSED_TABS, "orca-tabs-plugin", []);
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
      await this.storageService.saveConfig(C.SAVED_TAB_SETS, this.savedTabSets), this.log("💾 保存多标签页集合到API配置");
    } catch (e) {
      this.warn("无法保存多标签页集合:", e);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合（使用API）
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(C.SAVED_TAB_SETS, "orca-tabs-plugin", []);
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
    const t = this.tabContainer.getBoundingClientRect(), n = 5, i = window.innerWidth - t.width - 5, o = 5, s = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(n, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(o, Math.min(s, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(n, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(o, Math.min(s, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
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
      const e = Jt(
        this.position,
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      );
      this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, await this.saveLayoutMode(), this.log(`💾 位置已保存: ${ue(this.position, this.isVerticalMode)}`);
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
      await this.storageService.saveConfig(C.LAYOUT_MODE, e), this.log(`💾 布局模式已保存: ${this.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${this.verticalWidth}px, 垂直位置: (${this.verticalPosition.x}, ${this.verticalPosition.y}), 水平位置: (${this.horizontalPosition.x}, ${this.horizontalPosition.y})`);
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
      await this.storageService.saveConfig(C.FIXED_TO_TOP, e), this.log(`💾 固定到顶部状态已保存: ${this.isFixedToTop ? "启用" : "禁用"}`);
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
      this.position = U(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Xt(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${ue(this.position, this.isVerticalMode)}`);
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
        "orca-tabs-plugin",
        Y()
      );
      if (e) {
        const t = Gt(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = U(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.log(`📐 布局模式已恢复: ${Zt(t)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const t = Y();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = U(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
      const t = Y();
      this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = U(
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
        C.FIXED_TO_TOP,
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
    this.position = bn(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var u, h, d;
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
    const o = this.firstPanelTabs.find((p) => p.blockId === i);
    if (o) {
      this.verboseLog(`📋 当前激活页面已存在: "${o.title}"`);
      const p = (u = this.tabContainer) == null ? void 0 : u.querySelectorAll(".orca-tab");
      p == null || p.forEach((f) => f.removeAttribute("data-focused"));
      const g = (h = this.tabContainer) == null ? void 0 : h.querySelector(`[data-tab-id="${i}"]`);
      g && (g.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${o.title}"`)), this.debouncedUpdateTabsUI();
      return;
    }
    let s = this.firstPanelTabs.length, r = !1;
    const l = (d = this.tabContainer) == null ? void 0 : d.querySelector('.orca-tab[data-focused="true"]');
    if (l) {
      const p = l.getAttribute("data-tab-id");
      if (p) {
        const g = this.firstPanelTabs.findIndex((f) => f.blockId === p);
        g !== -1 ? this.firstPanelTabs[g].isPinned ? (s = g + 1, r = !1, this.log("📌 聚焦标签是固定的，将在其后面插入新标签")) : (s = g, r = !0, this.log("🎯 聚焦标签不是固定的，将替换聚焦标签")) : this.log("🎯 聚焦的标签不在数组中，插入到末尾");
      } else
        this.log("🎯 聚焦的标签没有data-tab-id，插入到末尾");
    } else
      this.log("🎯 没有找到聚焦的标签，将替换最后一个非固定标签");
    this.log(`🎯 最终计算的insertIndex: ${s}, 是否替换聚焦标签: ${r}`);
    const c = await this.getTabInfo(i, e, this.firstPanelTabs.length);
    if (c) {
      if (this.verboseLog(`📋 检测到新的激活页面: "${c.title}"`), this.firstPanelTabs.length >= this.maxTabs)
        if (r && s < this.firstPanelTabs.length) {
          const p = this.firstPanelTabs[s];
          this.firstPanelTabs[s] = c, this.log(`🔄 替换聚焦标签: "${p.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((g, f) => `${f}:${g.title}`));
        } else if (s < this.firstPanelTabs.length) {
          this.log("🎯 插入前数组:", this.firstPanelTabs.map((g, f) => `${f}:${g.title}`)), this.firstPanelTabs.splice(s + 1, 0, c), this.log(`➕ 在位置 ${s + 1} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((g, f) => `${f}:${g.title}`));
          const p = this.findLastNonPinnedTabIndex();
          if (p !== -1) {
            const g = this.firstPanelTabs[p];
            this.firstPanelTabs.splice(p, 1), this.log(`🗑️ 删除末尾的非固定标签: "${g.title}" 来保持数量限制`), this.log("🎯 最终数组:", this.firstPanelTabs.map((f, b) => `${b}:${f.title}`));
          } else {
            const g = this.firstPanelTabs.findIndex((f) => f.blockId === c.blockId);
            if (g !== -1) {
              this.firstPanelTabs.splice(g, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
              return;
            }
          }
        } else {
          const p = this.findLastNonPinnedTabIndex();
          if (p !== -1) {
            const g = this.firstPanelTabs[p];
            this.firstPanelTabs[p] = c, this.log(`🔄 没有聚焦标签，替换最后一个非固定标签: "${g.title}" -> "${c.title}"`);
          } else {
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
            return;
          }
        }
      else if (r && s < this.firstPanelTabs.length) {
        const p = this.firstPanelTabs[s];
        this.firstPanelTabs[s] = c, this.log(`🔄 替换聚焦标签: "${p.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((g, f) => `${f}:${g.title}`));
      } else
        this.firstPanelTabs.splice(s, 0, c), this.verboseLog(`➕ 在位置 ${s} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((p, g) => `${g}:${p.title}`));
      this.closedTabs.has(i) && (this.closedTabs.delete(i), await this.saveClosedTabs(), this.log(`🔄 标签 "${c.title}" 重新显示，从已关闭列表中移除`)), await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI();
    } else
      this.log("无法获取激活页面的标签信息");
  }
  observeChanges() {
    new MutationObserver(async (t) => {
      let n = !1, i = !1, o = !1, s = this.currentPanelIndex;
      t.forEach((r) => {
        if (r.type === "childList") {
          const l = r.target;
          if ((l.classList.contains("orca-panels-row") || l.closest(".orca-panels-row")) && (this.verboseLog("🔍 检测到面板行变化，检查新面板..."), i = !0), r.addedNodes.length > 0 && l.closest(".orca-panel")) {
            for (const u of r.addedNodes)
              if (u.nodeType === Node.ELEMENT_NODE) {
                const h = u;
                if (h.classList.contains("orca-block-editor") || h.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        r.type === "attributes" && r.attributeName === "class" && r.target.classList.contains("orca-panel") && (o = !0);
      }), o && (await this.updateCurrentPanelIndex(), s !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${s} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), i && setTimeout(async () => {
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
    const n = kn(t, this.panelIds);
    if (n) {
      this.log(`📋 面板列表发生变化: ${t.length} -> ${this.panelIds.length}`), this.log(`📋 旧面板列表: [${t.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const o = t[0], s = this.panelIds[0];
      o && s && o !== s && (this.log(`🔄 第一个面板已变更: ${o} -> ${s}`), this.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), await this.handleFirstPanelChange(o, s), this.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`));
    }
    const i = document.querySelector(".orca-panel.active");
    if (i) {
      const o = i.getAttribute("data-panel-id");
      if (o && (o !== this.currentPanelId || n)) {
        const s = this.currentPanelIndex, r = this.panelIds.indexOf(o);
        r !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${o} (索引: ${s} -> ${r})`), this.currentPanelIndex = r, this.currentPanelId = o, this.debouncedUpdateTabsUI());
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
      await this.storageService.removeConfig(C.FIRST_PANEL_TABS), await this.storageService.removeConfig(C.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
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
    var u, h;
    const n = document.querySelector(".recently-closed-tabs-menu");
    n && n.remove();
    const i = document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : h.themeMode) === "dark", o = document.createElement("div");
    o.className = "recently-closed-tabs-menu", o.style.cssText = `
      position: fixed;
      left: ${t.x}px;
      top: ${t.y}px;
      background: ${i ? "rgba(30, 30, 30, 0.95)" : "white"};
      border: 1px solid ${i ? "#444" : "#e0e0e0"};
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      z-index: 10000;
      min-width: 200px;
      max-width: 280px;
      max-height: 350px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((d, p) => {
      if (d.label === "---") {
        const b = document.createElement("div");
        b.style.cssText = `
          height: 1px;
          background: linear-gradient(to right, transparent, ${i ? "#444" : "#e0e0e0"}, transparent);
          margin: 4px 8px;
        `, o.appendChild(b);
        return;
      }
      const g = document.createElement("div");
      if (g.className = "recently-closed-menu-item", g.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        color: ${i ? "#ffffff" : "#333"};
        border-bottom: 1px solid ${i ? "#444" : "#f0f0f0"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, d.icon) {
        const b = document.createElement("div");
        if (b.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, d.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = d.icon, b.appendChild(T);
        } else
          b.textContent = d.icon;
        g.appendChild(b);
      }
      const f = document.createElement("span");
      f.textContent = d.label, f.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, g.appendChild(f), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = i ? "#444" : "#f5f5f5";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        d.onClick(), o.remove();
      }), o.appendChild(g);
    }), document.body.appendChild(o);
    const s = o.getBoundingClientRect(), r = window.innerWidth, l = window.innerHeight;
    s.right > r && (o.style.left = `${r - s.width - 10}px`), s.bottom > l && (o.style.top = `${l - s.height - 10}px`);
    const c = (d) => {
      o.contains(d.target) || (o.remove(), document.removeEventListener("click", c), document.removeEventListener("contextmenu", c));
    };
    setTimeout(() => {
      document.addEventListener("click", c), document.addEventListener("contextmenu", c);
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
    var u, h;
    const n = document.querySelector(".multi-tab-saving-menu");
    n && n.remove();
    const i = document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : h.themeMode) === "dark", o = document.createElement("div");
    o.className = "multi-tab-saving-menu", o.style.cssText = `
      position: fixed;
      left: ${t.x}px;
      top: ${t.y}px;
      background: ${i ? "rgba(30, 30, 30, 0.95)" : "white"};
      border: 1px solid ${i ? "#444" : "#e0e0e0"};
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      z-index: 10000;
      min-width: 200px;
      max-width: 300px;
      max-height: 400px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `, e.forEach((d, p) => {
      if (d.label === "---") {
        const b = document.createElement("div");
        b.style.cssText = `
          height: 1px;
          background: ${i ? "#444" : "#e0e0e0"};
          margin: 4px 0;
        `, o.appendChild(b);
        return;
      }
      const g = document.createElement("div");
      if (g.className = "multi-tab-saving-menu-item", g.style.cssText = `
        display: flex;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        color: ${i ? "#ffffff" : "#333"};
        border-bottom: 1px solid ${i ? "#444" : "#f0f0f0"};
        transition: background-color 0.2s ease;
        min-height: 24px;
      `, d.icon) {
        const b = document.createElement("div");
        if (b.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, d.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = d.icon, b.appendChild(T);
        } else
          b.textContent = d.icon;
        g.appendChild(b);
      }
      const f = document.createElement("span");
      f.textContent = d.label, f.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, g.appendChild(f), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = i ? "#444" : "#f5f5f5";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        d.onClick(), o.remove();
      }), o.appendChild(g);
    }), document.body.appendChild(o);
    const s = o.getBoundingClientRect(), r = window.innerWidth, l = window.innerHeight;
    s.right > r && (o.style.left = `${r - s.width - 10}px`), s.bottom > l && (o.style.top = `${l - s.height - 10}px`);
    const c = (d) => {
      o.contains(d.target) || (o.remove(), document.removeEventListener("click", c), document.removeEventListener("contextmenu", c));
    };
    setTimeout(() => {
      document.addEventListener("click", c), document.addEventListener("contextmenu", c);
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
    `, t.addEventListener("click", (k) => {
      k.stopPropagation();
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
    const s = document.createElement("button");
    s.textContent = "创建新标签组", s.style.cssText = `
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
      l = !1, s.style.cssText = `
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
      `, h.style.display = "block", g.style.display = "none", S();
    }, u = () => {
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
      `, s.style.cssText = `
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #ddd;
        background: white;
        color: #666;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      `, h.style.display = "none", g.style.display = "block", S();
    };
    s.onclick = c, r.onclick = u, o.appendChild(s), o.appendChild(r), i.appendChild(o);
    const h = document.createElement("div");
    h.style.cssText = `
      display: block;
    `;
    const d = document.createElement("label");
    d.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, d.textContent = "请输入新标签页集合名称:", h.appendChild(d);
    const p = document.createElement("input");
    p.type = "text", p.value = `标签页集合 ${this.savedTabSets.length + 1}`, p.style.cssText = `
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
    `, p.addEventListener("focus", () => {
      p.style.borderColor = "#3b82f6";
    }), p.addEventListener("blur", () => {
      p.style.borderColor = "#ddd";
    }), p.addEventListener("input", (k) => {
      console.log("输入框输入:", k.target.value);
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
      color: #333;
    `, f.textContent = "请选择要更新的标签页集合:", g.appendChild(f);
    const b = document.createElement("select");
    b.style.cssText = `
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
    `, b.addEventListener("focus", () => {
      b.style.borderColor = "#3b82f6";
    }), b.addEventListener("blur", () => {
      b.style.borderColor = "#ddd";
    });
    const T = document.createElement("option");
    T.value = "", T.textContent = "请选择标签页集合...", b.appendChild(T), this.savedTabSets.forEach((k, E) => {
      const M = document.createElement("option");
      M.value = E.toString(), M.textContent = `${k.name} (${k.tabs.length}个标签)`, b.appendChild(M);
    }), g.appendChild(b), i.appendChild(h), i.appendChild(g), t.appendChild(i);
    const y = document.createElement("div");
    y.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const x = document.createElement("button");
    x.textContent = "取消", x.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, x.addEventListener("mouseenter", () => {
      x.style.backgroundColor = "#4b5563";
    }), x.addEventListener("mouseleave", () => {
      x.style.backgroundColor = "#6b7280";
    }), x.onclick = () => {
      t.remove(), this.manageSavedTabSets();
    };
    const v = document.createElement("button");
    v.textContent = "保存", v.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, v.addEventListener("mouseenter", () => {
      v.style.backgroundColor = "#2563eb";
    }), v.addEventListener("mouseleave", () => {
      v.style.backgroundColor = "#3b82f6";
    });
    const S = () => {
      v.textContent = l ? "更新" : "保存";
    };
    v.onclick = async () => {
      if (l) {
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
    }, y.appendChild(x), y.appendChild(v), t.appendChild(y), document.body.appendChild(t), setTimeout(() => {
      p.focus(), p.select();
    }, 100), p.addEventListener("keydown", (k) => {
      k.key === "Enter" ? (k.preventDefault(), v.click()) : k.key === "Escape" && (k.preventDefault(), x.click());
    });
    const L = (k) => {
      t.contains(k.target) || (t.remove(), document.removeEventListener("click", L));
    };
    setTimeout(() => {
      document.addEventListener("click", L);
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
    `, n.addEventListener("click", (p) => {
      p.stopPropagation();
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
    const s = document.createElement("label");
    s.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, s.textContent = `将标签页 "${e.title}" 添加到:`, o.appendChild(s);
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
    l.value = "", l.textContent = "请选择标签组...", r.appendChild(l), this.savedTabSets.forEach((p, g) => {
      const f = document.createElement("option");
      f.value = g.toString(), f.textContent = `${p.name} (${p.tabs.length}个标签)`, r.appendChild(f);
    }), o.appendChild(r), n.appendChild(o);
    const c = document.createElement("div");
    c.style.cssText = `
      padding: 20px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    `;
    const u = document.createElement("button");
    u.textContent = "取消", u.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#4b5563";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "#6b7280";
    }), u.onclick = () => {
      n.remove(), this.manageSavedTabSets();
    };
    const h = document.createElement("button");
    h.textContent = "添加", h.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, h.addEventListener("mouseenter", () => {
      h.style.backgroundColor = "#2563eb";
    }), h.addEventListener("mouseleave", () => {
      h.style.backgroundColor = "#3b82f6";
    }), h.onclick = async () => {
      const p = parseInt(r.value);
      if (isNaN(p) || p < 0 || p >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      n.remove(), await this.addTabToGroup(e, p);
    }, c.appendChild(u), c.appendChild(h), n.appendChild(c), document.body.appendChild(n), setTimeout(() => {
      r.focus();
    }, 100), r.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), h.click()) : p.key === "Escape" && (p.preventDefault(), u.click());
    });
    const d = (p) => {
      n.contains(p.target) || (n.remove(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
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
  renderSortableTabs(e, t, n) {
    var c, u;
    const i = document.documentElement.classList.contains("dark") || ((u = (c = window.orca) == null ? void 0 : c.state) == null ? void 0 : u.themeMode) === "dark";
    e.innerHTML = "", t.forEach((h, d) => {
      const p = document.createElement("div");
      p.className = "sortable-tab-item", p.draggable = !0, p.dataset.index = d.toString(), p.style.cssText = `
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
      const g = document.createElement("div");
      if (g.style.cssText = `
        margin-right: 8px;
        color: #999;
        font-size: 12px;
        cursor: move;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 20px;
      `, g.innerHTML = "⋮⋮", p.appendChild(g), h.icon) {
        const x = document.createElement("div");
        if (x.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        `, h.icon.startsWith("ti ti-")) {
          const v = document.createElement("i");
          v.className = h.icon, x.appendChild(v);
        } else
          x.textContent = h.icon;
        p.appendChild(x);
      }
      const f = document.createElement("div");
      f.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 20px;
      `;
      let b = `
        <div style="font-size: 14px; color: #333; font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${h.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${h.blockId}</div>
      `;
      f.innerHTML = b, p.appendChild(f);
      const T = document.createElement("div");
      T.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 8px;
      `;
      const y = document.createElement("div");
      y.style.cssText = `
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
      `, y.textContent = (d + 1).toString(), T.appendChild(y), p.appendChild(T), p.addEventListener("dragstart", (x) => {
        x.dataTransfer.setData("text/plain", d.toString()), x.dataTransfer.effectAllowed = "move", p.style.opacity = "0.5", p.style.transform = "rotate(2deg)";
      }), p.addEventListener("dragend", (x) => {
        p.style.opacity = "1", p.style.transform = "rotate(0deg)";
      }), p.addEventListener("dragover", (x) => {
        x.preventDefault(), x.dataTransfer.dropEffect = "move", p.style.borderColor = "#3b82f6", p.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), p.addEventListener("dragleave", (x) => {
        p.style.borderColor = "#e0e0e0", p.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      }), p.addEventListener("drop", (x) => {
        x.preventDefault(), x.stopPropagation();
        const v = parseInt(x.dataTransfer.getData("text/plain")), S = d;
        if (v !== S) {
          const L = t[v];
          t.splice(v, 1), t.splice(S, 0, L), this.renderSortableTabs(e, t);
          const k = this.savedTabSets.find((E) => E.tabs === t);
          k && (k.tabs = [...t], k.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
        p.style.borderColor = "#e0e0e0", p.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      }), p.addEventListener("mouseenter", () => {
        p.style.backgroundColor = "rgba(59, 130, 246, 0.05)", p.style.borderColor = "#3b82f6";
      }), p.addEventListener("mouseleave", () => {
        p.style.backgroundColor = "rgba(255, 255, 255, 0.8)", p.style.borderColor = "#e0e0e0";
      }), e.appendChild(p);
    });
    const o = document.createElement("div");
    o.className = "delete-zone", o.style.cssText = `
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
    `, o.innerHTML = "🗑️ 拖拽到此处删除", e.style.position = "relative", e.appendChild(o);
    let s = -1;
    const r = (h) => {
      s = parseInt(h.target.dataset.index || "0"), o.style.display = "flex", o.style.transform = "translateY(0)";
    }, l = (h) => {
      s = -1, o.style.display = "none", o.style.transform = "translateY(-10px)";
    };
    o.addEventListener("dragover", (h) => {
      h.preventDefault(), h.dataTransfer.dropEffect = "move", o.style.transform = "scale(1.05)", o.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
    }), o.addEventListener("dragleave", (h) => {
      o.style.transform = "scale(1)", o.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
    }), o.addEventListener("drop", (h) => {
      if (h.preventDefault(), h.stopPropagation(), s >= 0 && s < t.length) {
        const d = t[s];
        t.splice(s, 1), this.renderSortableTabs(e, t);
        const p = this.savedTabSets.find((g) => g.tabs === t);
        p && (p.tabs = [...t], p.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", `已删除标签: ${d.title}`));
      }
      o.style.display = "none", o.style.transform = "translateY(-10px)";
    }), e.addEventListener("dragstart", r), e.addEventListener("dragend", l);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 工作区功能 - Workspace Management */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 加载工作区数据
   */
  async loadWorkspaces() {
    try {
      const e = await this.storageService.getConfig(C.WORKSPACES);
      e && Array.isArray(e) && (this.workspaces = e, this.log(`📁 已加载 ${this.workspaces.length} 个工作区`));
      const t = await this.storageService.getConfig(C.CURRENT_WORKSPACE);
      t && typeof t == "string" && (this.currentWorkspace = t, this.log(`📁 当前工作区: ${t}`));
      const n = await this.storageService.getConfig(C.ENABLE_WORKSPACES);
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
      await this.storageService.saveConfig(C.WORKSPACES, this.workspaces), await this.storageService.saveConfig(C.CURRENT_WORKSPACE, this.currentWorkspace), await this.storageService.saveConfig(C.ENABLE_WORKSPACES, this.enableWorkspaces), this.log("💾 工作区数据已保存");
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
    var g, f;
    const e = document.querySelector(".save-workspace-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((f = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : f.themeMode) === "dark", n = document.createElement("div");
    n.className = "save-workspace-dialog", n.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${t ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
      border: 1px solid ${t ? "#444" : "#ddd"};
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
    const o = document.createElement("div");
    o.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, o.textContent = "保存工作区";
    const s = document.createElement("div");
    s.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, s.textContent = "工作区名称:";
    const r = document.createElement("input");
    r.type = "text", r.placeholder = "请输入工作区名称...", r.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      border: 1px solid ${t ? "#444" : "#ddd"};
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      margin-bottom: 12px;
      background: ${t ? "#1a1a1a" : "#ffffff"};
      color: ${t ? "#ffffff" : "#333"};
    `;
    const l = document.createElement("div");
    l.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, l.textContent = "工作区描述 (可选):";
    const c = document.createElement("textarea");
    c.placeholder = "请输入工作区描述...", c.style.cssText = `
      width: 100%;
      height: 60px;
      padding: 8px 12px;
      border: 1px solid ${t ? "#444" : "#ddd"};
      border-radius: 6px;
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 16px;
      background: ${t ? "#1a1a1a" : "#ffffff"};
      color: ${t ? "#ffffff" : "#333"};
    `;
    const u = document.createElement("div");
    u.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const h = document.createElement("button");
    h.style.cssText = `
      padding: 8px 16px;
      border: 1px solid ${t ? "#444" : "#ddd"};
      border-radius: 6px;
      background: ${t ? "#1a1a1a" : "#fff"};
      color: ${t ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, h.textContent = "取消", h.onclick = () => {
      n.remove(), this.showWorkspaceMenu();
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
      const b = r.value.trim();
      if (!b) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((T) => T.name === b)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(b, c.value.trim()), n.remove();
    }, u.appendChild(h), u.appendChild(d), i.appendChild(o), i.appendChild(s), i.appendChild(r), i.appendChild(l), i.appendChild(c), i.appendChild(u), n.appendChild(i), document.body.appendChild(n), r.focus(), n.addEventListener("click", (b) => {
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
    var u, h;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const n = document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : h.themeMode) === "dark", i = document.createElement("div");
    i.className = "workspace-menu", i.style.cssText = `
      position: fixed;
      top: ${e ? e.clientY + 10 : 60}px;
      left: ${e ? e.clientX : 20}px;
      background: ${n ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
      border: 1px solid ${n ? "#444" : "#ddd"};
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: ${this.getNextDialogZIndex()};
      min-width: 200px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 12px 16px;
      border-bottom: 1px solid ${n ? "#444" : "#eee"};
      font-size: 14px;
      font-weight: 600;
      color: ${n ? "#ffffff" : "#333"};
    `, o.textContent = "工作区";
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid ${n ? "#444" : "#eee"};
      color: ${n ? "#ffffff" : "#333"};
    `, s.innerHTML = `
      <i class="ti ti-plus" style="font-size: 14px; color: #3b82f6;"></i>
      <span>保存当前工作区</span>
    `, s.onclick = () => {
      i.remove(), this.saveCurrentWorkspace();
    };
    const r = document.createElement("div");
    if (r.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const d = document.createElement("div");
      d.style.cssText = `
        padding: 12px 16px;
        color: ${n ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, d.textContent = "暂无工作区", r.appendChild(d);
    } else
      this.workspaces.forEach((d) => {
        const p = document.createElement("div");
        p.style.cssText = `
          padding: 12px 16px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid ${n ? "#444" : "#eee"};
          color: ${n ? "#ffffff" : "#333"};
          ${this.currentWorkspace === d.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const g = d.icon || "ti ti-folder";
        p.innerHTML = `
          <i class="${g}" style="font-size: 14px; color: #3b82f6;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: ${n ? "#ffffff" : "#333"};"">${d.name}</div>
            ${d.description ? `<div style="font-size: 12px; color: ${n ? "#999" : "#666"}; margin-top: 2px;">${d.description}</div>` : ""}
            <div style="font-size: 11px; color: ${n ? "#777" : "#999"}; margin-top: 2px;">${d.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === d.id ? '<i class="ti ti-check" style="font-size: 14px; color: #3b82f6;"></i>' : ""}
        `, p.onclick = () => {
          i.remove(), this.switchToWorkspace(d.id);
        }, r.appendChild(p);
      });
    const l = document.createElement("div");
    l.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-top: 1px solid ${n ? "#444" : "#eee"};
      color: ${n ? "#ffffff" : "#333"};
    `, l.innerHTML = `
      <i class="ti ti-settings" style="font-size: 14px; color: ${n ? "#999" : "#666"};"></i>
      <span>管理工作区</span>
    `, l.onclick = () => {
      i.remove(), this.manageWorkspaces();
    }, i.appendChild(o), i.appendChild(s), i.appendChild(r), i.appendChild(l), document.body.appendChild(i);
    const c = (d) => {
      i.contains(d.target) || (i.remove(), document.removeEventListener("click", c));
    };
    setTimeout(() => {
      document.addEventListener("click", c);
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
          const s = await this.getTabInfo(o.blockId, this.currentPanelId, n.length);
          s ? (s.isPinned = o.isPinned, s.order = o.order, s.scrollPosition = o.scrollPosition, n.push(s)) : n.push(o);
        } catch (s) {
          this.warn(`无法更新标签页信息 ${o.title}:`, s), n.push(o);
        }
      this.firstPanelTabs = n, await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), this.debouncedUpdateTabsUI();
      const i = t.lastActiveTabId;
      setTimeout(async () => {
        if (n.length > 0) {
          let o = n[0];
          if (i) {
            const s = n.find((r) => r.blockId === i);
            s ? (o = s, this.log(`🎯 导航到工作区中最后激活的标签页: ${o.title} (ID: ${i})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${o.title}`);
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
    var u, h;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : h.themeMode) === "dark", n = document.createElement("div");
    n.className = "manage-workspaces-dialog", n.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${t ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
      border: 1px solid ${t ? "#444" : "#ddd"};
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
    const o = document.createElement("div");
    o.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, o.textContent = "管理工作区";
    const s = document.createElement("div");
    if (s.style.cssText = `
      max-height: 400px;
      overflow-y: auto;
      margin-bottom: 20px;
    `, this.workspaces.length === 0) {
      const d = document.createElement("div");
      d.style.cssText = `
        padding: 40px;
        text-align: center;
        color: ${t ? "#999" : "#666"};
        font-size: 14px;
      `, d.textContent = "暂无工作区", s.appendChild(d);
    } else
      this.workspaces.forEach((d) => {
        const p = document.createElement("div");
        p.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid ${t ? "#444" : "#eee"};
          border-radius: 8px;
          margin-bottom: 8px;
          background: ${this.currentWorkspace === d.id ? "rgba(59, 130, 246, 0.05)" : t ? "#1a1a1a" : "#fff"};
        `;
        const g = d.icon || "ti ti-folder";
        p.innerHTML = `
          <i class="${g}" style="font-size: 20px; color: #3b82f6; margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; color: ${t ? "#ffffff" : "#333"};"">${d.name}</div>
            ${d.description ? `<div style="font-size: 12px; color: ${t ? "#999" : "#666"}; margin-bottom: 4px;">${d.description}</div>` : ""}
            <div style="font-size: 11px; color: ${t ? "#777" : "#999"};"">${d.tabs.length}个标签 • 创建于 ${new Date(d.createdAt).toLocaleString()}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${this.currentWorkspace === d.id ? '<span style="color: #3b82f6; font-size: 12px;">当前</span>' : ""}
            <button class="delete-workspace-btn" data-workspace-id="${d.id}" style="
              padding: 4px 8px;
              border: 1px solid #ef4444;
              border-radius: 4px;
              background: ${t ? "#1a1a1a" : "#fff"};
              color: #ef4444;
              cursor: pointer;
              font-size: 12px;
            ">删除</button>
          </div>
        `, s.appendChild(p);
      });
    const r = document.createElement("div");
    r.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const l = document.createElement("button");
    l.style.cssText = `
      padding: 8px 16px;
      border: 1px solid ${t ? "#444" : "#ddd"};
      border-radius: 6px;
      background: ${t ? "#1a1a1a" : "#fff"};
      color: ${t ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, l.textContent = "关闭", l.onclick = () => {
      n.remove();
    }, r.appendChild(l), i.appendChild(o), i.appendChild(s), i.appendChild(r), n.appendChild(i), document.body.appendChild(n), n.querySelectorAll(".delete-workspace-btn").forEach((d) => {
      d.addEventListener("click", async (p) => {
        const g = p.target.getAttribute("data-workspace-id");
        g && (await this.deleteWorkspace(g), n.remove(), this.manageWorkspaces());
      });
    }), n.addEventListener("click", (d) => {
      d.target === n && n.remove();
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
    var d, p;
    const n = document.documentElement.classList.contains("dark") || ((p = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : p.themeMode) === "dark", i = document.querySelector(".tabset-details-dialog");
    i && i.remove();
    const o = document.createElement("div");
    o.className = "tabset-details-dialog", o.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      z-index: ${this.getNextDialogZIndex() + 200};
      width: 500px;
      max-height: 600px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, s.textContent = `标签集合详情: ${e.name}`, o.appendChild(s);
    const r = document.createElement("div");
    r.style.cssText = `
      padding: 0 20px;
      max-height: 400px;
      overflow-y: auto;
    `;
    const l = document.createElement("div");
    if (l.style.cssText = `
      margin-bottom: 16px;
      padding: 12px;
      background: rgba(249, 249, 249, 0.8);
      border-radius: 6px;
    `, l.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>创建时间:</strong> ${new Date(e.createdAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>更新时间:</strong> ${new Date(e.updatedAt).toLocaleString()}
      </div>
      <div style="font-size: 14px; color: #666;">
        <strong>标签数量:</strong> ${e.tabs.length}个
      </div>
    `, r.appendChild(l), e.tabs.length === 0) {
      const g = document.createElement("div");
      g.style.cssText = `
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-size: 14px;
      `, g.textContent = "该标签集合为空", r.appendChild(g);
    } else {
      const g = document.createElement("div");
      g.style.cssText = `
        margin-bottom: 16px;
      `;
      const f = document.createElement("div");
      f.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const b = document.createElement("span");
      b.textContent = "包含的标签 (可拖拽排序):", f.appendChild(b);
      const T = document.createElement("span");
      T.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, T.textContent = "拖拽调整顺序", f.appendChild(T), g.appendChild(f);
      const y = document.createElement("div");
      y.className = "sortable-tabs-container", y.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: 8px;
        transition: border-color 0.3s ease;
      `;
      const x = [...e.tabs];
      x.forEach((E, M) => {
        const w = document.createElement("div");
        w.className = "sortable-tab-item", w.draggable = !0, w.dataset.index = M.toString(), w.style.cssText = `
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
        const Z = document.createElement("div");
        if (Z.style.cssText = `
          margin-right: 8px;
          color: #999;
          font-size: 12px;
          cursor: move;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 20px;
        `, Z.innerHTML = "⋮⋮", w.appendChild(Z), E.icon) {
          const P = document.createElement("div");
          if (P.style.cssText = `
            margin-right: 8px;
            font-size: 14px;
            color: ${n ? "#cccccc" : "#666"};
            width: 16px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          `, E.icon.startsWith("ti ti-")) {
            const O = document.createElement("i");
            O.className = E.icon, P.appendChild(O);
          } else
            P.textContent = E.icon;
          w.appendChild(P);
        }
        const K = document.createElement("div");
        K.style.cssText = `
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 20px;
        `;
        let Ie = `
          <div style="font-size: 14px; color: #333; font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${E.title}</div>
          <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${E.blockId}</div>
        `;
        K.innerHTML = Ie, w.appendChild(K);
        const Q = document.createElement("div");
        Q.style.cssText = `
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 8px;
        `;
        const ee = document.createElement("div");
        ee.style.cssText = `
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
        `, ee.textContent = (M + 1).toString(), Q.appendChild(ee), w.appendChild(Q), w.addEventListener("dragstart", (P) => {
          P.dataTransfer.setData("text/plain", M.toString()), P.dataTransfer.effectAllowed = "move", w.style.opacity = "0.5", w.style.transform = "rotate(2deg)";
        }), w.addEventListener("dragend", (P) => {
          w.style.opacity = "1", w.style.transform = "rotate(0deg)";
        }), w.addEventListener("dragover", (P) => {
          P.preventDefault(), P.dataTransfer.dropEffect = "move", w.style.borderColor = "#3b82f6", w.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
        }), w.addEventListener("dragleave", (P) => {
          w.style.borderColor = "#e0e0e0", w.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }), w.addEventListener("drop", (P) => {
          P.preventDefault(), P.stopPropagation();
          const O = parseInt(P.dataTransfer.getData("text/plain")), oe = M;
          if (O !== oe) {
            const Ee = x[O];
            x.splice(O, 1), x.splice(oe, 0, Ee), this.renderSortableTabs(y, x, e), e.tabs = [...x], e.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新");
          }
          w.style.borderColor = "#e0e0e0", w.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }), w.addEventListener("mouseenter", () => {
          w.style.backgroundColor = "rgba(59, 130, 246, 0.05)", w.style.borderColor = "#3b82f6";
        }), w.addEventListener("mouseleave", () => {
          w.style.backgroundColor = "rgba(255, 255, 255, 0.8)", w.style.borderColor = "#e0e0e0";
        }), y.appendChild(w);
      });
      const v = document.createElement("div");
      v.className = "delete-zone", v.style.cssText = `
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
      `, v.innerHTML = "🗑️ 拖拽到此处删除", y.style.position = "relative", y.appendChild(v);
      let S = -1;
      const L = (E) => {
        S = parseInt(E.target.dataset.index || "0"), v.style.display = "flex", v.style.transform = "translateY(0)";
      }, k = (E) => {
        S = -1, v.style.display = "none", v.style.transform = "translateY(-10px)";
      };
      v.addEventListener("dragover", (E) => {
        E.preventDefault(), E.dataTransfer.dropEffect = "move", v.style.transform = "scale(1.05)", v.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
      }), v.addEventListener("dragleave", (E) => {
        v.style.transform = "scale(1)", v.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
      }), v.addEventListener("drop", (E) => {
        if (E.preventDefault(), E.stopPropagation(), S >= 0 && S < x.length) {
          const M = x[S];
          x.splice(S, 1), this.renderSortableTabs(y, x, e), e.tabs = [...x], e.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", `已删除标签: ${M.title}`);
        }
        v.style.display = "none", v.style.transform = "translateY(-10px)";
      }), y.addEventListener("dragstart", L), y.addEventListener("dragend", k), g.appendChild(y), r.appendChild(g);
    }
    o.appendChild(r);
    const c = document.createElement("div");
    c.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const u = document.createElement("button");
    u.textContent = "关闭", u.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#4b5563";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "#6b7280";
    }), u.onclick = () => {
      o.remove(), t && this.manageSavedTabSets();
    }, c.appendChild(u), o.appendChild(c), document.body.appendChild(o);
    const h = (g) => {
      o.contains(g.target) || (o.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", h));
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
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, s.textContent = "重命名标签集合", o.appendChild(s);
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
    const u = document.createElement("div");
    u.style.cssText = `
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
    }), h.onclick = () => {
      o.remove(), this.manageSavedTabSets();
    };
    const d = document.createElement("button");
    d.textContent = "保存", d.style.cssText = `
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
      const g = c.value.trim();
      if (!g) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (g === e.name) {
        o.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((b) => b.name === g && b.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = g, e.updatedAt = Date.now(), await this.saveSavedTabSets(), o.remove(), n.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, u.appendChild(h), u.appendChild(d), o.appendChild(u), document.body.appendChild(o), setTimeout(() => {
      c.focus(), c.select();
    }, 100), c.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), d.click()) : g.key === "Escape" && (g.preventDefault(), h.click());
    });
    const p = (g) => {
      o.contains(g.target) || (o.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
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
    const s = n.textContent;
    n.innerHTML = "", n.appendChild(o), o.addEventListener("click", (u) => {
      u.stopPropagation();
    }), o.addEventListener("mousedown", (u) => {
      u.stopPropagation();
    }), o.focus(), o.select();
    const r = async () => {
      const u = o.value.trim();
      if (!u) {
        n.textContent = s;
        return;
      }
      if (u === e.name) {
        n.textContent = s;
        return;
      }
      if (this.savedTabSets.find((d) => d.name === u && d.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), n.textContent = s;
        return;
      }
      e.name = u, e.updatedAt = Date.now(), await this.saveSavedTabSets(), n.textContent = u, orca.notify("success", "重命名成功");
    }, l = () => {
      n.textContent = s;
    };
    o.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), r()) : u.key === "Escape" && (u.preventDefault(), l());
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
    const s = document.createElement("div");
    s.style.cssText = `
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
    `, r.textContent = "选择图标", s.appendChild(r);
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
    ], u = document.createElement("div");
    u.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 8px;
      margin-bottom: 16px;
    `, c.forEach((g) => {
      const f = document.createElement("div");
      f.style.cssText = `
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
      const b = document.createElement("div");
      if (b.style.cssText = `
        font-size: 24px;
        margin-bottom: 4px;
      `, g.value.startsWith("ti ti-")) {
        const y = document.createElement("i");
        y.className = g.value, b.appendChild(y);
      } else
        b.textContent = g.icon;
      const T = document.createElement("div");
      T.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, T.textContent = g.name, f.appendChild(b), f.appendChild(T), f.addEventListener("click", async (y) => {
        y.stopPropagation(), e.icon = g.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i(), s.remove(), o && o.focus(), orca.notify("success", "图标已更新");
      }), f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "#f5f5f5", f.style.borderColor = "#3b82f6";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = e.icon === g.value ? "#e3f2fd" : "white", f.style.borderColor = "#e0e0e0";
      }), u.appendChild(f);
    }), l.appendChild(u), s.appendChild(l);
    const h = document.createElement("div");
    h.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const d = document.createElement("button");
    d.textContent = "关闭", d.style.cssText = `
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
    }), d.onclick = (g) => {
      g.stopPropagation(), s.remove(), o && o.focus();
    }, h.appendChild(d), s.appendChild(h), document.body.appendChild(s);
    const p = (g) => {
      s.contains(g.target) || (g.stopPropagation(), s.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p), o && o.focus());
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
    const n = document.createElement("div");
    n.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, n.textContent = "管理保存的标签页集合", t.appendChild(n);
    const i = document.createElement("div");
    i.style.cssText = `
      padding: 0 20px;
      max-height: 300px;
      overflow-y: auto;
    `, this.savedTabSets.forEach((l, c) => {
      const u = document.createElement("div");
      u.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-bottom: 8px;
        background: rgba(249, 249, 249, 0.8);
        transition: background-color 0.2s;
      `, u.addEventListener("mouseenter", () => {
        u.style.backgroundColor = "rgba(240, 240, 240, 0.8)";
      }), u.addEventListener("mouseleave", () => {
        u.style.backgroundColor = "rgba(249, 249, 249, 0.8)";
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
        if (d.innerHTML = "", l.icon)
          if (l.icon.startsWith("ti ti-")) {
            const S = document.createElement("i");
            S.className = l.icon, d.appendChild(S);
          } else
            d.textContent = l.icon;
        else
          d.textContent = "📁";
      };
      p(), d.addEventListener("click", () => {
        this.editTabSetIcon(l, c, d, p, t);
      }), d.addEventListener("mouseenter", () => {
        d.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), d.addEventListener("mouseleave", () => {
        d.style.backgroundColor = "transparent";
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
        color: #333;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        transition: background-color 0.2s;
        min-height: 20px;
        display: flex;
        align-items: center;
      `, f.textContent = l.name, f.title = "点击编辑名称", f.addEventListener("click", () => {
        this.editTabSetName(l, c, f, t);
      }), f.addEventListener("mouseenter", () => {
        f.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), f.addEventListener("mouseleave", () => {
        f.style.backgroundColor = "transparent";
      });
      const b = document.createElement("div");
      b.style.cssText = `
        font-size: 12px;
        color: #666;
      `, b.textContent = `${l.tabs.length}个标签 • ${new Date(l.updatedAt).toLocaleString()}`, g.appendChild(f), g.appendChild(b), h.appendChild(d), h.appendChild(g);
      const T = document.createElement("div");
      T.style.cssText = `
        display: flex;
        gap: 8px;
      `;
      const y = document.createElement("button");
      y.textContent = "加载", y.style.cssText = `
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      `, y.addEventListener("mouseenter", () => {
        y.style.backgroundColor = "#2563eb";
      }), y.addEventListener("mouseleave", () => {
        y.style.backgroundColor = "#3b82f6";
      }), y.onclick = () => {
        this.loadSavedTabSet(l, c), t.remove();
      };
      const x = document.createElement("button");
      x.textContent = "查看", x.style.cssText = `
        background: #10b981;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      `, x.addEventListener("mouseenter", () => {
        x.style.backgroundColor = "#059669";
      }), x.addEventListener("mouseleave", () => {
        x.style.backgroundColor = "#10b981";
      }), x.onclick = () => {
        this.showTabSetDetails(l, t);
      };
      const v = document.createElement("button");
      v.textContent = "删除", v.style.cssText = `
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
      `, v.addEventListener("mouseenter", () => {
        v.style.backgroundColor = "#dc2626";
      }), v.addEventListener("mouseleave", () => {
        v.style.backgroundColor = "#ef4444";
      }), v.onclick = () => {
        confirm(`确定要删除标签页集合 "${l.name}" 吗？`) && (this.savedTabSets.splice(c, 1), this.saveSavedTabSets(), t.remove(), this.manageSavedTabSets());
      }, T.appendChild(y), T.appendChild(x), T.appendChild(v), u.appendChild(h), u.appendChild(T), i.appendChild(u);
    }), t.appendChild(i);
    const o = document.createElement("div");
    o.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const s = document.createElement("button");
    s.textContent = "关闭", s.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, s.addEventListener("mouseenter", () => {
      s.style.backgroundColor = "#4b5563";
    }), s.addEventListener("mouseleave", () => {
      s.style.backgroundColor = "#6b7280";
    }), s.onclick = () => t.remove(), o.appendChild(s), t.appendChild(o), document.body.appendChild(t);
    const r = (l) => {
      t.contains(l.target) || (t.remove(), document.removeEventListener("click", r), document.removeEventListener("contextmenu", r));
    };
    setTimeout(() => {
      document.addEventListener("click", r), document.addEventListener("contextmenu", r);
    }, 0);
  }
}
let $ = null;
async function En(a) {
  q = a, $e(orca.state.locale, { "zh-CN": Me }), $ = new Cn(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => $ == null ? void 0 : $.init(), 500);
  }) : setTimeout(() => $ == null ? void 0 : $.init(), 500), orca.commands.registerCommand(
    `${q}.resetCache`,
    async () => {
      $ && await $.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${q}.toggleBlockIcons`,
    async () => {
      $ && await $.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  ), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && (console.log(Le("标签页插件已启动")), console.log(`${q} loaded.`));
}
async function Sn() {
  $ && ($.unregisterHeadbarButton(), $.cleanupDragResize(), $.destroy(), $ = null), orca.commands.unregisterCommand(`${q}.resetCache`);
}
export {
  En as load,
  Sn as unload
};
