var Ee = Object.defineProperty;
var Se = (o, e, t) => e in o ? Ee(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var m = (o, e, t) => Se(o, typeof e != "symbol" ? e + "" : e, t);
let be = "en", fe = {};
function $e(o, e) {
  be = o, fe = e;
}
function Le(o, e, t) {
  var i;
  return ((i = fe[be]) == null ? void 0 : i[o]) ?? o;
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
}, k = {
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
      let s;
      if (typeof i == "string")
        try {
          s = JSON.parse(i);
        } catch {
          s = i;
        }
      else
        s = i;
      return this.log(`📂 已读取插件数据 ${e}:`, s), s;
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
        const s = JSON.parse(i);
        return this.log(`📂 已从localStorage读取: ${n}`), s;
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
      [k.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [k.SECOND_PANEL_TABS]: "orca-second-panel-tabs-api",
      [k.CLOSED_TABS]: "orca-closed-tabs-api",
      [k.RECENTLY_CLOSED_TABS]: "orca-recently-closed-tabs-api",
      [k.SAVED_TAB_SETS]: "orca-saved-tab-sets-api",
      [k.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [k.TABS_POSITION]: "orca-tabs-position-api",
      [k.LAYOUT_MODE]: "orca-tabs-layout-api",
      [k.FIXED_TO_TOP]: "orca-tabs-fixed-to-top-api"
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
      const s = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", s);
      const a = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(s) === JSON.stringify(a) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (e) {
      this.error("API配置序列化测试失败:", e);
    }
  }
}
const ye = 6048e5, Ae = 864e5, oe = Symbol.for("constructDateFrom");
function D(o, e) {
  return typeof o == "function" ? o(e) : o && typeof o == "object" && oe in o ? o[oe](e) : o instanceof Date ? new o.constructor(e) : new Date(e);
}
function A(o, e) {
  return D(e || o, o);
}
function ve(o, e, t) {
  const n = A(o, t == null ? void 0 : t.in);
  return isNaN(e) ? D(o, NaN) : (e && n.setDate(n.getDate() + e), n);
}
let Be = {};
function G() {
  return Be;
}
function H(o, e) {
  var r, l, c, d;
  const t = G(), n = (e == null ? void 0 : e.weekStartsOn) ?? ((l = (r = e == null ? void 0 : e.locale) == null ? void 0 : r.options) == null ? void 0 : l.weekStartsOn) ?? t.weekStartsOn ?? ((d = (c = t.locale) == null ? void 0 : c.options) == null ? void 0 : d.weekStartsOn) ?? 0, i = A(o, e == null ? void 0 : e.in), s = i.getDay(), a = (s < n ? 7 : 0) + s - n;
  return i.setDate(i.getDate() - a), i.setHours(0, 0, 0, 0), i;
}
function j(o, e) {
  return H(o, { ...e, weekStartsOn: 1 });
}
function Te(o, e) {
  const t = A(o, e == null ? void 0 : e.in), n = t.getFullYear(), i = D(t, 0);
  i.setFullYear(n + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const s = j(i), a = D(t, 0);
  a.setFullYear(n, 0, 4), a.setHours(0, 0, 0, 0);
  const r = j(a);
  return t.getTime() >= s.getTime() ? n + 1 : t.getTime() >= r.getTime() ? n : n - 1;
}
function ae(o) {
  const e = A(o), t = new Date(
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
function we(o, ...e) {
  const t = D.bind(
    null,
    e.find((n) => typeof n == "object")
  );
  return e.map(t);
}
function X(o, e) {
  const t = A(o, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function We(o, e, t) {
  const [n, i] = we(
    t == null ? void 0 : t.in,
    o,
    e
  ), s = X(n), a = X(i), r = +s - ae(s), l = +a - ae(a);
  return Math.round((r - l) / Ae);
}
function ze(o, e) {
  const t = Te(o, e), n = D(o, 0);
  return n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), j(n);
}
function ne(o) {
  return D(o, Date.now());
}
function ie(o, e, t) {
  const [n, i] = we(
    t == null ? void 0 : t.in,
    o,
    e
  );
  return +X(n) == +X(i);
}
function Oe(o) {
  return o instanceof Date || typeof o == "object" && Object.prototype.toString.call(o) === "[object Date]";
}
function Ne(o) {
  return !(!Oe(o) && typeof o != "number" || isNaN(+A(o)));
}
function Fe(o, e) {
  const t = A(o, e == null ? void 0 : e.in);
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
}, qe = (o, e, t) => {
  let n;
  const i = Re[o];
  return typeof i == "string" ? n = i : e === 1 ? n = i.one : n = i.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + n : n + " ago" : n;
};
function te(o) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : o.defaultWidth;
    return o.formats[t] || o.formats[o.defaultWidth];
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
}, Ue = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ve = {
  date: te({
    formats: He,
    defaultWidth: "full"
  }),
  time: te({
    formats: _e,
    defaultWidth: "full"
  }),
  dateTime: te({
    formats: Ue,
    defaultWidth: "full"
  })
}, Ye = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, je = (o, e, t, n) => Ye[o];
function F(o) {
  return (e, t) => {
    const n = t != null && t.context ? String(t.context) : "standalone";
    let i;
    if (n === "formatting" && o.formattingValues) {
      const a = o.defaultFormattingWidth || o.defaultWidth, r = t != null && t.width ? String(t.width) : a;
      i = o.formattingValues[r] || o.formattingValues[a];
    } else {
      const a = o.defaultWidth, r = t != null && t.width ? String(t.width) : o.defaultWidth;
      i = o.values[r] || o.values[a];
    }
    const s = o.argumentCallback ? o.argumentCallback(e) : e;
    return i[s];
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
}, et = (o, e) => {
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
}, tt = {
  ordinalNumber: et,
  era: F({
    values: Xe,
    defaultWidth: "wide"
  }),
  quarter: F({
    values: Ge,
    defaultWidth: "wide",
    argumentCallback: (o) => o - 1
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
function R(o) {
  return (e, t = {}) => {
    const n = t.width, i = n && o.matchPatterns[n] || o.matchPatterns[o.defaultMatchWidth], s = e.match(i);
    if (!s)
      return null;
    const a = s[0], r = n && o.parsePatterns[n] || o.parsePatterns[o.defaultParseWidth], l = Array.isArray(r) ? it(r, (u) => u.test(a)) : (
      // [TODO] -- I challenge you to fix the type
      nt(r, (u) => u.test(a))
    );
    let c;
    c = o.valueCallback ? o.valueCallback(l) : l, c = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(c)
    ) : c;
    const d = e.slice(a.length);
    return { value: c, rest: d };
  };
}
function nt(o, e) {
  for (const t in o)
    if (Object.prototype.hasOwnProperty.call(o, t) && e(o[t]))
      return t;
}
function it(o, e) {
  for (let t = 0; t < o.length; t++)
    if (e(o[t]))
      return t;
}
function st(o) {
  return (e, t = {}) => {
    const n = e.match(o.matchPattern);
    if (!n) return null;
    const i = n[0], s = e.match(o.parsePattern);
    if (!s) return null;
    let a = o.valueCallback ? o.valueCallback(s[0]) : s[0];
    a = t.valueCallback ? t.valueCallback(a) : a;
    const r = e.slice(i.length);
    return { value: a, rest: r };
  };
}
const ot = /^(\d+)(th|st|nd|rd)?/i, at = /\d+/i, rt = {
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
}, ht = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ut = {
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
}, bt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, ft = {
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
  ordinalNumber: st({
    matchPattern: ot,
    parsePattern: at,
    valueCallback: (o) => parseInt(o, 10)
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
    valueCallback: (o) => o + 1
  }),
  month: R({
    matchPatterns: ht,
    defaultMatchWidth: "wide",
    parsePatterns: ut,
    defaultParseWidth: "any"
  }),
  day: R({
    matchPatterns: pt,
    defaultMatchWidth: "wide",
    parsePatterns: gt,
    defaultParseWidth: "any"
  }),
  dayPeriod: R({
    matchPatterns: bt,
    defaultMatchWidth: "any",
    parsePatterns: ft,
    defaultParseWidth: "any"
  })
}, xt = {
  code: "en-US",
  formatDistance: qe,
  formatLong: Ve,
  formatRelative: je,
  localize: tt,
  match: mt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function yt(o, e) {
  const t = A(o, e == null ? void 0 : e.in);
  return We(t, Fe(t)) + 1;
}
function vt(o, e) {
  const t = A(o, e == null ? void 0 : e.in), n = +j(t) - +ze(t);
  return Math.round(n / ye) + 1;
}
function ke(o, e) {
  var d, u, h, p;
  const t = A(o, e == null ? void 0 : e.in), n = t.getFullYear(), i = G(), s = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((u = (d = e == null ? void 0 : e.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((p = (h = i.locale) == null ? void 0 : h.options) == null ? void 0 : p.firstWeekContainsDate) ?? 1, a = D((e == null ? void 0 : e.in) || o, 0);
  a.setFullYear(n + 1, 0, s), a.setHours(0, 0, 0, 0);
  const r = H(a, e), l = D((e == null ? void 0 : e.in) || o, 0);
  l.setFullYear(n, 0, s), l.setHours(0, 0, 0, 0);
  const c = H(l, e);
  return +t >= +r ? n + 1 : +t >= +c ? n : n - 1;
}
function Tt(o, e) {
  var r, l, c, d;
  const t = G(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((l = (r = e == null ? void 0 : e.locale) == null ? void 0 : r.options) == null ? void 0 : l.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((d = (c = t.locale) == null ? void 0 : c.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, i = ke(o, e), s = D((e == null ? void 0 : e.in) || o, 0);
  return s.setFullYear(i, 0, n), s.setHours(0, 0, 0, 0), H(s, e);
}
function wt(o, e) {
  const t = A(o, e == null ? void 0 : e.in), n = +H(t, e) - +Tt(t, e);
  return Math.round(n / ye) + 1;
}
function I(o, e) {
  const t = o < 0 ? "-" : "", n = Math.abs(o).toString().padStart(e, "0");
  return t + n;
}
const B = {
  // Year
  y(o, e) {
    const t = o.getFullYear(), n = t > 0 ? t : 1 - t;
    return I(e === "yy" ? n % 100 : n, e.length);
  },
  // Month
  M(o, e) {
    const t = o.getMonth();
    return e === "M" ? String(t + 1) : I(t + 1, 2);
  },
  // Day of the month
  d(o, e) {
    return I(o.getDate(), e.length);
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
    return I(o.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(o, e) {
    return I(o.getHours(), e.length);
  },
  // Minute
  m(o, e) {
    return I(o.getMinutes(), e.length);
  },
  // Second
  s(o, e) {
    return I(o.getSeconds(), e.length);
  },
  // Fraction of second
  S(o, e) {
    const t = e.length, n = o.getMilliseconds(), i = Math.trunc(
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
      const n = o.getFullYear(), i = n > 0 ? n : 1 - n;
      return t.ordinalNumber(i, { unit: "year" });
    }
    return B.y(o, e);
  },
  // Local week-numbering year
  Y: function(o, e, t, n) {
    const i = ke(o, n), s = i > 0 ? i : 1 - i;
    if (e === "YY") {
      const a = s % 100;
      return I(a, 2);
    }
    return e === "Yo" ? t.ordinalNumber(s, { unit: "year" }) : I(s, e.length);
  },
  // ISO week-numbering year
  R: function(o, e) {
    const t = Te(o);
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
  u: function(o, e) {
    const t = o.getFullYear();
    return I(t, e.length);
  },
  // Quarter
  Q: function(o, e, t) {
    const n = Math.ceil((o.getMonth() + 1) / 3);
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
  q: function(o, e, t) {
    const n = Math.ceil((o.getMonth() + 1) / 3);
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
  M: function(o, e, t) {
    const n = o.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return B.M(o, e);
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
  w: function(o, e, t, n) {
    const i = wt(o, n);
    return e === "wo" ? t.ordinalNumber(i, { unit: "week" }) : I(i, e.length);
  },
  // ISO week of year
  I: function(o, e, t) {
    const n = vt(o);
    return e === "Io" ? t.ordinalNumber(n, { unit: "week" }) : I(n, e.length);
  },
  // Day of the month
  d: function(o, e, t) {
    return e === "do" ? t.ordinalNumber(o.getDate(), { unit: "date" }) : B.d(o, e);
  },
  // Day of year
  D: function(o, e, t) {
    const n = yt(o);
    return e === "Do" ? t.ordinalNumber(n, { unit: "dayOfYear" }) : I(n, e.length);
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
    const i = o.getDay(), s = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(s);
      case "ee":
        return I(s, 2);
      case "eo":
        return t.ordinalNumber(s, { unit: "day" });
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
  c: function(o, e, t, n) {
    const i = o.getDay(), s = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(s);
      case "cc":
        return I(s, e.length);
      case "co":
        return t.ordinalNumber(s, { unit: "day" });
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
  i: function(o, e, t) {
    const n = o.getDay(), i = n === 0 ? 7 : n;
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
  a: function(o, e, t) {
    const i = o.getHours() / 12 >= 1 ? "pm" : "am";
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
  b: function(o, e, t) {
    const n = o.getHours();
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
  B: function(o, e, t) {
    const n = o.getHours();
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
  h: function(o, e, t) {
    if (e === "ho") {
      let n = o.getHours() % 12;
      return n === 0 && (n = 12), t.ordinalNumber(n, { unit: "hour" });
    }
    return B.h(o, e);
  },
  // Hour [0-23]
  H: function(o, e, t) {
    return e === "Ho" ? t.ordinalNumber(o.getHours(), { unit: "hour" }) : B.H(o, e);
  },
  // Hour [0-11]
  K: function(o, e, t) {
    const n = o.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(n, { unit: "hour" }) : I(n, e.length);
  },
  // Hour [1-24]
  k: function(o, e, t) {
    let n = o.getHours();
    return n === 0 && (n = 24), e === "ko" ? t.ordinalNumber(n, { unit: "hour" }) : I(n, e.length);
  },
  // Minute
  m: function(o, e, t) {
    return e === "mo" ? t.ordinalNumber(o.getMinutes(), { unit: "minute" }) : B.m(o, e);
  },
  // Second
  s: function(o, e, t) {
    return e === "so" ? t.ordinalNumber(o.getSeconds(), { unit: "second" }) : B.s(o, e);
  },
  // Fraction of second
  S: function(o, e) {
    return B.S(o, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(o, e, t) {
    const n = o.getTimezoneOffset();
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
  x: function(o, e, t) {
    const n = o.getTimezoneOffset();
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
  O: function(o, e, t) {
    const n = o.getTimezoneOffset();
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
  z: function(o, e, t) {
    const n = o.getTimezoneOffset();
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
  t: function(o, e, t) {
    const n = Math.trunc(+o / 1e3);
    return I(n, e.length);
  },
  // Milliseconds timestamp
  T: function(o, e, t) {
    return I(+o, e.length);
  }
};
function ce(o, e = "") {
  const t = o > 0 ? "-" : "+", n = Math.abs(o), i = Math.trunc(n / 60), s = n % 60;
  return s === 0 ? t + String(i) : t + String(i) + e + I(s, 2);
}
function le(o, e) {
  return o % 60 === 0 ? (o > 0 ? "-" : "+") + I(Math.abs(o) / 60, 2) : z(o, e);
}
function z(o, e = "") {
  const t = o > 0 ? "-" : "+", n = Math.abs(o), i = I(Math.trunc(n / 60), 2), s = I(n % 60, 2);
  return t + i + e + s;
}
const de = (o, e) => {
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
}, Ce = (o, e) => {
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
}, kt = (o, e) => {
  const t = o.match(/(P+)(p+)?/) || [], n = t[1], i = t[2];
  if (!i)
    return de(o, e);
  let s;
  switch (n) {
    case "P":
      s = e.dateTime({ width: "short" });
      break;
    case "PP":
      s = e.dateTime({ width: "medium" });
      break;
    case "PPP":
      s = e.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      s = e.dateTime({ width: "full" });
      break;
  }
  return s.replace("{{date}}", de(n, e)).replace("{{time}}", Ce(i, e));
}, Ct = {
  p: Ce,
  P: kt
}, It = /^D+$/, Pt = /^Y+$/, Et = ["D", "DD", "YY", "YYYY"];
function St(o) {
  return It.test(o);
}
function $t(o) {
  return Pt.test(o);
}
function Lt(o, e, t) {
  const n = Mt(o, e, t);
  if (console.warn(n), Et.includes(o)) throw new RangeError(n);
}
function Mt(o, e, t) {
  const n = o[0] === "Y" ? "years" : "days of the month";
  return `Use \`${o.toLowerCase()}\` instead of \`${o}\` (in \`${e}\`) for formatting ${n} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Dt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, At = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, Bt = /^'([^]*?)'?$/, Wt = /''/g, zt = /[a-zA-Z]/;
function W(o, e, t) {
  var d, u, h, p;
  const n = G(), i = n.locale ?? xt, s = n.firstWeekContainsDate ?? ((u = (d = n.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, a = n.weekStartsOn ?? ((p = (h = n.locale) == null ? void 0 : h.options) == null ? void 0 : p.weekStartsOn) ?? 0, r = A(o, t == null ? void 0 : t.in);
  if (!Ne(r))
    throw new RangeError("Invalid time value");
  let l = e.match(At).map((g) => {
    const b = g[0];
    if (b === "p" || b === "P") {
      const f = Ct[b];
      return f(g, i.formatLong);
    }
    return g;
  }).join("").match(Dt).map((g) => {
    if (g === "''")
      return { isToken: !1, value: "'" };
    const b = g[0];
    if (b === "'")
      return { isToken: !1, value: Ot(g) };
    if (re[b])
      return { isToken: !0, value: g };
    if (b.match(zt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + b + "`"
      );
    return { isToken: !1, value: g };
  });
  i.localize.preprocessor && (l = i.localize.preprocessor(r, l));
  const c = {
    firstWeekContainsDate: s,
    weekStartsOn: a,
    locale: i
  };
  return l.map((g) => {
    if (!g.isToken) return g.value;
    const b = g.value;
    ($t(b) || St(b)) && Lt(b, e, String(o));
    const f = re[b[0]];
    return f(r, b, i.localize, c);
  }).join("");
}
function Ot(o) {
  const e = o.match(Bt);
  return e ? e[1].replace(Wt, "'") : o;
}
function Nt(o, e) {
  return ie(
    D(o, o),
    ne(o)
  );
}
function Ft(o, e) {
  return ie(
    o,
    ve(ne(o), 1),
    e
  );
}
function Rt(o, e, t) {
  return ve(o, -1, t);
}
function qt(o, e) {
  return ie(
    D(o, o),
    Rt(ne(o))
  );
}
function Ht(o) {
  try {
    let e = orca.state.settings[me.JournalDateFormat];
    if ((!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Nt(o))
      return "今天";
    if (qt(o))
      return "昨天";
    if (Ft(o))
      return "明天";
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const n = o.getDay(), s = ["日", "一", "二", "三", "四", "五", "六"][n], a = e.replace(/E/g, s);
          return W(o, a);
        } else
          return W(o, e);
      else
        return W(o, e);
    } catch {
      const n = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of n)
        try {
          return W(o, i);
        } catch {
          continue;
        }
      return o.toLocaleDateString();
    }
  } catch (e) {
    return console.warn("日期格式化失败:", e), o.toLocaleDateString();
  }
}
function U(o) {
  try {
    const e = _t(o, "_repr");
    if (!e || e.type !== xe.JSON || !e.value)
      return null;
    const t = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
    return t.type === "journal" && t.date ? new Date(t.date) : null;
  } catch (e) {
    return console.warn("提取日期块信息失败:", e), null;
  }
}
function _t(o, e) {
  return !o.properties || !Array.isArray(o.properties) ? null : o.properties.find((t) => t.name === e);
}
function Ut(o) {
  if (!Array.isArray(o) || o.length === 0)
    return !1;
  let e = 0, t = 0;
  for (const n of o)
    n && typeof n == "object" && (n.t === "text" && n.v ? e++ : n.t === "ref" && n.v && t++);
  return e > 0 && t > 0 && e >= t;
}
async function Vt(o) {
  if (!o || o.length === 0) return "";
  let e = "";
  for (const t of o)
    t.t === "t" && t.v ? e += t.v : t.t === "r" ? t.u ? t.v ? e += t.v : e += t.u : t.a ? e += `[[${t.a}]]` : t.v && (typeof t.v == "number" || typeof t.v == "string") ? e += `[[块${t.v}]]` : t.v && (e += t.v) : t.t === "br" && t.v ? e += `[[块${t.v}]]` : t.t && t.t.includes("math") && t.v ? e += `[数学: ${t.v}]` : t.t && t.t.includes("code") && t.v ? e += `[代码: ${t.v}]` : t.t && t.t.includes("image") && t.v ? e += `[图片: ${t.v}]` : t.v && (e += t.v);
  return e;
}
function Yt(o, e, t, n) {
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
  const s = document.createElement("i");
  s.className = e, s.style.cssText = `
    margin-right: 8px;
    font-size: 16px;
    width: 16px;
    text-align: center;
    color: #666;
  `;
  const a = document.createElement("span");
  if (a.textContent = o, a.style.cssText = `
    flex: 1;
    color: #333;
  `, i.appendChild(s), i.appendChild(a), t && t.trim() !== "") {
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
function jt(o, e) {
  const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(o);
  if (t) {
    const n = parseInt(t[1], 16), i = parseInt(t[2], 16), s = parseInt(t[3], 16);
    return `rgba(${n}, ${i}, ${s}, ${e})`;
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
function Xt(o, e, t = 200) {
  const n = e ? t : 400, i = 40, s = window.innerWidth - n, a = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(o.x, s)),
    y: Math.max(0, Math.min(o.y, a))
  };
}
function Gt(o) {
  const e = Y();
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
function V(o, e, t) {
  return o ? { ...e } : { ...t };
}
function Jt(o, e, t, n) {
  return e ? {
    verticalPosition: { ...o },
    horizontalPosition: { ...n }
  } : {
    verticalPosition: { ...t },
    horizontalPosition: { ...o }
  };
}
function Zt(o) {
  return `布局模式: ${o.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${o.verticalWidth}px, 垂直位置: (${o.verticalPosition.x}, ${o.verticalPosition.y}), 水平位置: (${o.horizontalPosition.x}, ${o.horizontalPosition.y})`;
}
function he(o, e) {
  return `位置已${e ? "垂直" : "水平"}模式 (${o.x}, ${o.y})`;
}
function Kt(o, e, t, n) {
  let i, s, a = "normal";
  if (t ? (i = "rgba(255, 255, 255, 0.1)", s = "#ffffff") : (i = "rgba(200, 200, 200, 0.6)", s = "#333333"), o.color)
    try {
      const r = o.color.startsWith("#") ? o.color : `#${o.color}`;
      i = n(r, "background", t), s = n(r, "text", t), a = "600";
    } catch (r) {
      console.warn("颜色处理失败，使用默认颜色:", r);
    }
  return e ? `
    background: ${i};
    color: ${s};
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
    color: ${s};
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
function Qt() {
  const o = document.createElement("div");
  return o.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, o;
}
function en(o) {
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
function tn(o) {
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
function nn() {
  const o = document.createElement("span");
  return o.textContent = "📌", o.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, o;
}
function sn(o) {
  let e = o.title;
  return o.isPinned && (e += " (已固定)"), e;
}
function on() {
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
function ue(o = "primary") {
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
  }[o];
}
function an() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function rn(o, e, t, n) {
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
function cn(o) {
  for (let e = o.length - 1; e >= 0; e--)
    if (!o[e].isPinned)
      return e;
  return -1;
}
function ln(o) {
  return [...o].sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : 0);
}
function dn(o, e, t = {}) {
  try {
    const {
      updateOrder: n = !0,
      saveData: i = !0,
      updateUI: s = !0
    } = t, a = e.findIndex((l) => l.blockId === o.blockId);
    if (a === -1)
      return {
        success: !1,
        message: `标签不存在: ${o.title}`
      };
    e[a].isPinned = !e[a].isPinned, n && gn(e);
    const r = e[a].isPinned ? "固定" : "取消固定";
    return {
      success: !0,
      message: `标签 "${o.title}" 已${r}`,
      data: { tab: e[a], tabIndex: a }
    };
  } catch (n) {
    return {
      success: !1,
      message: `切换固定状态失败: ${n}`
    };
  }
}
function hn(o, e, t, n = {}) {
  try {
    const {
      updateUI: i = !0,
      saveData: s = !0,
      validateData: a = !0
    } = n, r = t.findIndex((l) => l.blockId === o.blockId);
    if (r === -1)
      return {
        success: !1,
        message: `标签不存在: ${o.title}`
      };
    if (a) {
      const l = pn(e);
      if (!l.success)
        return l;
    }
    return t[r] = { ...t[r], ...e }, {
      success: !0,
      message: `标签 "${o.title}" 已更新`,
      data: { tab: t[r], tabIndex: r }
    };
  } catch (i) {
    return {
      success: !1,
      message: `更新标签失败: ${i}`
    };
  }
}
function un(o, e, t, n = {}) {
  return !e || e.trim() === "" ? {
    success: !1,
    message: "标签标题不能为空"
  } : hn(o, { title: e.trim() }, t, n);
}
function pn(o) {
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
function gn(o) {
  o.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
}
function bn(o, e, t, n) {
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
function fn(o, e, t, n) {
  const i = bn(o, e, t, n);
  let s = o.x, a = o.y;
  return i.x < 0 ? s = 0 : i.x + i.width > window.innerWidth && (s = window.innerWidth - i.width), i.y < 0 ? a = 0 : i.y + i.height > window.innerHeight && (a = window.innerHeight - i.height), { x: s, y: a };
}
function pe(o, e, t = !1) {
  let n = null;
  const i = (...s) => {
    const a = t && !n;
    n && clearTimeout(n), n = window.setTimeout(() => {
      n = null, t || o(...s);
    }, e), a && o(...s);
  };
  return i.cancel = () => {
    n && (clearTimeout(n), n = null);
  }, i;
}
function mn(o, e, t) {
  var n, i;
  try {
    const s = o.startsWith("#") ? o : `#${o}`;
    if (!/^#[0-9A-Fa-f]{6}$/.test(s))
      return console.warn("无效的十六进制颜色格式:", s), e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
    const a = parseInt(s.slice(1, 3), 16), r = parseInt(s.slice(3, 5), 16), l = parseInt(s.slice(5, 7), 16), c = t !== void 0 ? t : document.documentElement.classList.contains("dark") || ((i = (n = window.orca) == null ? void 0 : n.state) == null ? void 0 : i.themeMode) === "dark";
    return e === "background" ? `oklch(from rgb(${a}, ${r}, ${l}) calc(l * 0.8) calc(c * 1.5) h / 25%)` : c ? `oklch(from rgb(${a}, ${r}, ${l}) calc(l * 1.6) c h)` : `oklch(from rgb(${a}, ${r}, ${l}) calc(l * 0.6) c h)`;
  } catch (s) {
    return console.warn("颜色转换失败:", s), e === "background" ? "rgba(0, 0, 0, 0.1)" : "#333333";
  }
}
var _ = /* @__PURE__ */ ((o) => (o[o.ERROR = 0] = "ERROR", o[o.WARN = 1] = "WARN", o[o.INFO = 2] = "INFO", o[o.DEBUG = 3] = "DEBUG", o[o.VERBOSE = 4] = "VERBOSE", o))(_ || {});
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
    const s = {
      timestamp: Date.now(),
      level: e,
      message: t,
      data: n,
      source: i
    };
    this.config.enableConsole && this.logToConsole(s), this.config.enableStorage && this.logToStorage(s);
  }
  /**
   * 输出到控制台
   */
  logToConsole(e) {
    const { timestamp: t, level: n, message: i, data: s, source: a } = e;
    _[n];
    const r = this.config.enableTimestamps ? new Date(t).toLocaleTimeString() : "", l = `${this.config.prefix}${r ? ` [${r}]` : ""}`, c = a ? ` [${a}]` : "", d = `${l}${c} ${i}`;
    if (this.config.enableColors && typeof window < "u") {
      const u = this.colors[n];
      console.log(`%c${d}`, `color: ${u}`, s || "");
    } else
      this.getConsoleMethod(n)(d, s || "");
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
      const n = new Date(t.timestamp).toLocaleString(), i = _[t.level], s = t.source ? ` [${t.source}]` : "", a = t.data ? ` ${JSON.stringify(t.data)}` : "";
      return `[${n}] ${i}${s}: ${t.message}${a}`;
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
      const i = `${this.config.prefix}-${t}`, s = n ? `${this.config.prefix}-${n}` : void 0;
      performance.measure(`${this.config.prefix}-${e}`, i, s);
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
function yn(o, e, t, n) {
  const i = document.createElement("div");
  i.className = "orca-tabs-container";
  const s = rn(o, e, n, t);
  return i.style.cssText = s, i;
}
function vn(o, e, t) {
  const n = document.createElement("div");
  n.className = "width-adjustment-dialog";
  const i = on();
  n.style.cssText = i;
  const s = document.createElement("div");
  s.className = "dialog-title", s.textContent = "调整面板宽度", n.appendChild(s);
  const a = document.createElement("div");
  a.className = "dialog-slider-container", a.style.cssText = `
    margin: 20px 0;
    padding: 0 20px;
  `;
  const r = document.createElement("input");
  r.type = "range", r.min = "120", r.max = "800", r.value = o.toString(), r.style.cssText = an();
  const l = document.createElement("div");
  l.className = "dialog-width-display", l.style.cssText = `
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  `, l.textContent = `当前宽度: ${o}px`, r.oninput = () => {
    const h = parseInt(r.value);
    l.textContent = `当前宽度: ${h}px`, e(h);
  }, a.appendChild(r), a.appendChild(l), n.appendChild(a);
  const c = document.createElement("div");
  c.className = "dialog-buttons", c.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid #eee;
  `;
  const d = document.createElement("button");
  d.className = "btn btn-primary", d.textContent = "确定", d.style.cssText = ue(), d.onclick = () => ge(n);
  const u = document.createElement("button");
  return u.className = "btn btn-secondary", u.textContent = "取消", u.style.cssText = ue(), u.onclick = () => {
    t(), ge(n);
  }, c.appendChild(d), c.appendChild(u), n.appendChild(c), n;
}
function ge(o) {
  o && o.parentNode && o.parentNode.removeChild(o);
  const e = document.querySelector(".dialog-backdrop");
  e && e.remove();
}
function Tn() {
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
  `, document.head.appendChild(o);
}
function wn() {
  const o = document.querySelector("section#main");
  if (!o)
    return console.warn("❌ 未找到 section#main"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const e = o.querySelector(".orca-panels-row");
  if (!e)
    return console.warn("❌ 未找到 .orca-panels-row"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const t = e.querySelectorAll('.orca-panel:not([data-menu-panel="true"])'), n = [];
  let i = null;
  return t.forEach((s) => {
    const a = s.getAttribute("data-panel-id");
    a && (n.push(a), s.classList.contains("active") && (i = a));
  }), n.sort((s, a) => {
    const r = parseInt(s), l = parseInt(a);
    return !isNaN(r) && !isNaN(l) ? r - l : s.localeCompare(a);
  }), {
    panelIds: n,
    activePanelId: i,
    panelCount: n.length
  };
}
function kn(o, e) {
  return o.length !== e.length ? !0 : !o.every((t, n) => t === e[n]);
}
let q;
class Cn {
  constructor() {
    /* ———————————————————————————————————————————————————————————————————————————— */
    /* 核心数据属性 - Core Data Properties */
    /* ———————————————————————————————————————————————————————————————————————————— */
    m(this, "firstPanelTabs", []);
    // 只存储需要持久化的面板标签数据
    m(this, "secondPanelTabs", []);
    // 存储第二个面板的标签数据（已废弃）
    m(this, "tempCurrentPanelTabs", []);
    // 临时存储当前面板的标签数据（非持久化）
    m(this, "panelTabsMap", /* @__PURE__ */ new Map());
    // 基于data-panel-id存储每个面板的标签数据
    m(this, "currentPanelId", "");
    m(this, "panelIds", []);
    // 所有面板ID列表
    m(this, "currentPanelIndex", 0);
    // 当前面板索引
    m(this, "persistentPanelId", null);
    // 当前持久化的面板ID
    m(this, "persistentPanelIndex", 0);
    // 持久化面板的索引位置（基于面板顺序）
    m(this, "panelTabsByIndex", []);
    // 基于面板索引存储标签页数据
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
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFixedToTopMode(), await this.restoreFloatingWindowVisibility(), await this.loadWorkspaces(), this.registerHeadbarButton(), this.discoverPanels();
    const e = this.getPersistentPanelId();
    e ? this.log(`🎯 初始化持久化面板: ${e}`) : this.log("⚠️ 初始化时没有发现持久化面板"), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization(), await this.restoreFirstPanelTabs(), await this.restoreSecondPanelTabs(), await this.restoreClosedTabs(), await this.restoreRecentlyClosedTabs(), await this.restoreSavedTabSets();
    const t = document.querySelector(".orca-panel.active"), n = t == null ? void 0 : t.getAttribute("data-panel-id");
    if (n && (this.currentPanelId = n, this.currentPanelIndex = this.panelIds.indexOf(n), this.log(`🎯 当前活动面板: ${n} (索引: ${this.currentPanelIndex})`)), n)
      if (this.isCurrentPanelPersistent()) {
        this.log("📋 当前活动面板是持久化面板，跳过扫描，使用持久化数据");
        const s = document.querySelector(".orca-panel.active");
        if (s) {
          const a = s.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
          if (a) {
            const r = a.getAttribute("data-block-id");
            r && (this.firstPanelTabs.find((c) => c.blockId === r) || (this.log(`📋 当前激活页面不在持久化标签页中，添加到前面: ${r}`), await this.checkFirstPanelBlocks()));
          }
        }
      } else
        this.log(`🔍 扫描当前活动面板 ${n} 的标签页`), await this.scanCurrentPanelTabs();
    const i = this.getPersistentPanelId();
    i && this.persistentPanelIndex < this.panelTabsByIndex.length && this.firstPanelTabs.length > 0 && (this.log(`📂 恢复持久化面板 ${i} 的标签页数据到索引 ${this.persistentPanelIndex}`), this.panelTabsByIndex[this.persistentPanelIndex] = [...this.firstPanelTabs]);
    for (let s = 0; s < this.panelTabsByIndex.length; s++)
      if (!this.panelTabsByIndex[s] || this.panelTabsByIndex[s].length === 0) {
        const a = this.panelIds[s];
        a && (this.log(`🔍 面板 ${a} (索引: ${s}) 没有标签页数据，开始扫描`), await this.scanPanelTabsByIndex(s, a));
      }
    await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.setupSettingsChecker(), this.isInitialized = !0, this.log("✅ 插件初始化完成");
  }
  /**
   * 设置主题变化监听器
   */
  setupThemeChangeListener() {
    this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null);
    const e = (s) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", s), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", e), this.log("主题变化监听器注册成功");
    } catch (s) {
      this.error("主题变化监听器注册失败:", s);
    }
    let t = orca.state.themeMode;
    const i = setInterval(() => {
      const s = orca.state.themeMode;
      s !== t && (this.log("备用检测：主题从", t, "切换到", s), t = s, setTimeout(() => {
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
    const i = e.getBoundingClientRect(), s = e.parentElement;
    if (s) {
      const a = s.getBoundingClientRect();
      t === "before" ? (n.style.left = `${i.left - a.left}px`, n.style.top = `${i.top - a.top - 1}px`, n.style.width = `${i.width}px`) : (n.style.left = `${i.left - a.left}px`, n.style.top = `${i.bottom - a.top - 1}px`, n.style.width = `${i.width}px`), s.appendChild(n);
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
    const n = this.getCurrentPanelTabs(), i = n.findIndex((l) => l.blockId === e.blockId), s = n.findIndex((l) => l.blockId === t.blockId);
    if (i === -1 || s === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (i === s) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${t.title} (${s}) -> ${e.title} (${i})`);
    const a = n[s], r = n[i];
    n[i] = a, n[s] = r, n.forEach((l, c) => {
      l.order = c;
    }), this.sortTabsByPinStatus(), this.syncCurrentTabsToStorage(n), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 标签页拖拽排序，实时更新工作区")), this.log(`✅ 标签交换完成: ${a.title} -> 位置 ${i}`);
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
    this.log(`🎯 最终发现 ${i} 个面板，面板ID列表:`, t), this.log(`🎯 活动面板: ${n || "无"}`), this.panelIds = t;
    const s = this.selectNewPersistentPanel();
    s !== this.persistentPanelId && this.setPersistentPanelId(s), n && n !== this.currentPanelId && (this.currentPanelId = n, this.currentPanelIndex = t.indexOf(n), this.log(`🔄 活动面板已更新: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`)), this.panelDiscoveryCache = {
      panelIds: [...t],
      timestamp: e
    }, this.updatePanelTabsArraySize(), i === 1 ? this.log("ℹ️ 只有一个面板，不会显示切换按钮") : i > 1 && this.log(`✅ 发现 ${i} 个面板，将创建循环切换器`);
  }
  /**
   * 获取需要持久化保存的面板ID（智能选择）
   */
  getPersistentPanelId() {
    return this.persistentPanelId;
  }
  /**
   * 设置持久化面板ID
   */
  setPersistentPanelId(e) {
    this.persistentPanelId = e, this.log(`🔄 设置持久化面板: ${e}`);
  }
  /**
   * 检查当前面板是否需要持久化保存
   */
  isCurrentPanelPersistent() {
    return this.currentPanelIndex === this.persistentPanelIndex;
  }
  /**
   * 智能选择新的持久化面板（基于面板位置，不依赖ID）
   */
  selectNewPersistentPanel() {
    if (this.panelIds.length === 0)
      return this.log("❌ 没有可用的面板"), null;
    const e = this.panelIds[0];
    return this.persistentPanelIndex = 0, this.panelTabsByIndex.length <= this.persistentPanelIndex && (this.panelTabsByIndex[this.persistentPanelIndex] = []), this.log(`🔄 选择新的持久化面板: ${e} (位置: 第一个面板, 索引: ${this.persistentPanelIndex})`), e;
  }
  /**
   * 更新面板标签页数组大小
   */
  updatePanelTabsArraySize() {
    const e = this.panelTabsByIndex.length, t = this.panelIds.length;
    if (t > e) {
      for (let n = e; n < t; n++)
        this.panelTabsByIndex[n] = [];
      this.log(`📋 扩展面板标签页数组: ${e} -> ${t}`);
    } else t < e && (this.panelTabsByIndex = this.panelTabsByIndex.slice(0, t), this.log(`📋 收缩面板标签页数组: ${e} -> ${t}`));
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
   * 扫描第一个面板的标签页（扫描所有标签页）
   */
  async scanFirstPanel() {
    if (this.panelIds.length === 0) return;
    const e = this.panelIds[0], t = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!t) return;
    const n = t.querySelectorAll(".orca-hideable"), i = [];
    let s = 0;
    for (const a of n) {
      const r = a.querySelector(".orca-block-editor");
      if (!r) continue;
      const l = r.getAttribute("data-block-id");
      if (!l) continue;
      const c = await this.getTabInfo(l, e, s++);
      c && i.push(c);
    }
    this.panelTabsByIndex[0] = [...i], this.firstPanelTabs = [...i], await this.saveFirstPanelTabs(), this.log(`📋 第一个面板扫描并保存了 ${i.length} 个标签页`);
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
    this.setCurrentPanelTabs(t), this.syncCurrentTabsToStorage(t);
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
    return Vt(e);
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(e) {
    if (!Array.isArray(e) || e.length === 0)
      return !1;
    let t = !1, n = !1, i = !1;
    for (const s of e)
      s && typeof s == "object" && (s.t === "r" && s.v ? (i = !0, s.a || (t = !0)) : s.t === "t" && s.v && (n = !0));
    return t || n && i;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(e) {
    return Ut(e);
  }
  /* ———————————————————————————————————————————————————————————————————————————— */
  /* 块类型检测和处理 - Block Type Detection and Processing */
  /* ———————————————————————————————————————————————————————————————————————————— */
  /**
   * 检测块类型
   */
  async detectBlockType(e) {
    try {
      if (U(e))
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
            const s = this.findProperty(e, "_hide");
            return s && s.value ? (this.log(`📄 通过 _hide 属性确认为页面: ${i} (hide=${s.value})`), "page") : (this.log(`🏷️ 通过 _hide 属性确认为标签: ${i} (hide=${s ? s.value : "undefined"})`), "tag");
          } catch (s) {
            return this.warn("使用 API 检测标签失败，回退到文本分析:", s), i.includes("#") || i.includes("@") || i.length < 20 && i.match(/^[a-zA-Z0-9_-]+$/) || i.match(/^[a-z]+$/i) ? "tag" : "page";
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
          const i = e.getDay(), a = ["日", "一", "二", "三", "四", "五", "六"][i], r = t.replace(/E/g, a);
          return W(e, r);
        } else
          return W(e, t);
      else
        return W(e, t);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const s of i)
        try {
          return W(e, s);
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
      let s = "", a = "", r = "", l = !1, c = "";
      c = await this.detectBlockType(i), this.log(`🔍 检测到块类型: ${c} (块ID: ${e})`), i.aliases && i.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${e}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${c}`);
      try {
        const d = U(i);
        if (d)
          l = !0, s = Ht(d), console.log(`📅 识别为日期块: ${s}, 原始日期: ${d.toISOString()}`);
        else if (i.aliases && i.aliases.length > 0)
          s = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? s = i.text.substring(0, 50) : s = (await this.extractTextFromContent(i.content)).substring(0, 50);
        else if (i.text) {
          let u = i.text.substring(0, 50);
          if (c === "list") {
            const h = i.text.split(`
`)[0].trim();
            h && (u = h.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (c === "table") {
            const h = i.text.split(`
`)[0].trim();
            h && (u = h.replace(/\|/g, "").trim());
          } else if (c === "quote") {
            const h = i.text.split(`
`)[0].trim();
            h && (u = h.replace(/^>\s+/, ""));
          } else if (c === "image") {
            const h = i.text.match(/caption:\s*(.+)/i);
            h && h[1] ? u = h[1].trim() : u = i.text.trim();
          }
          s = u;
        } else
          s = `块 ${e}`, console.log(`❌ 没有找到合适的标题，使用块ID: ${e}`);
      } catch (d) {
        this.warn("获取标题失败:", d), s = `块 ${e}`;
      }
      try {
        const d = this.findProperty(i, "_color"), u = this.findProperty(i, "_icon");
        d && d.type === 1 && (a = d.value), u && u.type === 1 ? (r = u.value, this.log(`🎨 使用用户自定义图标: ${r} (块ID: ${e})`)) : (this.showBlockTypeIcons || c === "journal") && (r = this.getBlockTypeIcon(c), this.log(`🎨 使用块类型图标: ${r} (块类型: ${c}, 块ID: ${e})`));
      } catch (d) {
        this.warn("获取属性失败:", d), r = this.getBlockTypeIcon(c);
      }
      return {
        blockId: e,
        panelId: t,
        title: s || `块 ${e}`,
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
    let n, i, s;
    if (this.isFixedToTop ? (n = { x: 0, y: 0 }, i = !1, s = window.innerWidth) : (n = this.isVerticalMode ? this.verticalPosition : this.position, i = this.isVerticalMode, s = this.verticalWidth), this.tabContainer = yn(
      i,
      n,
      s,
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
    if (this.tabContainer.querySelector(".new-tab-button"), this.tabContainer.querySelector(".workspace-button"), this.tabContainer.innerHTML = "", t && this.tabContainer.appendChild(t), this.currentPanelId) {
      this.log(`📋 显示当前活动面板 ${this.currentPanelId} 的标签页`);
      let n = this.getCurrentPanelTabs();
      n.length === 0 && (this.log("🔍 当前面板没有标签数据，重新扫描"), await this.scanCurrentPanelTabs(), n = this.getCurrentPanelTabs()), this.sortTabsByPinStatus(), n.forEach((i, s) => {
        var r;
        const a = this.createTabElement(i);
        (r = this.tabContainer) == null || r.appendChild(a);
      });
    } else
      this.log("⚠️ 没有当前活动面板，跳过标签页显示");
    if (this.addNewTabButton(), this.addWorkspaceButton(), this.isFixedToTop) {
      const n = orca.state.themeMode === "dark", i = n ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", s = n ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)", a = n ? "#ffffff" : "#333", r = this.tabContainer.querySelectorAll(".orca-tab");
      r.forEach((c) => {
        const d = c.getAttribute("data-tab-id");
        if (!d) return;
        const h = this.getCurrentPanelTabs().find((p) => p.blockId === d);
        if (h) {
          let p, g, b = "normal";
          if (n ? (p = "rgba(255, 255, 255, 0.1)", g = "#ffffff") : (p = "rgba(200, 200, 200, 0.6)", g = "#333333"), h.color)
            try {
              p = this.applyOklchFormula(h.color, "background"), g = this.applyOklchFormula(h.color, "text"), b = "600";
            } catch (f) {
              console.warn("颜色处理失败，使用默认颜色:", f);
            }
          c.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            background: ${p};
            border-radius: 4px;
            border: 1px solid ${s};
            font-size: 12px;
            height: 24px;
            min-width: auto;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: ${g};
            font-weight: ${b};
            max-width: 150px;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            -webkit-app-region: no-drag;
            app-region: no-drag;
            pointer-events: auto;
          `;
        }
      });
      const l = this.tabContainer.querySelector(".new-tab-button");
      l && (l.style.cssText += `
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: ${i};
          border-radius: 4px;
          border: 1px solid ${s};
          font-size: 12px;
          height: 24px;
          width: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          color: ${a};
        `), this.log(`📌 固定到顶部模式样式已应用，标签页数量: ${r.length}`);
    }
    this.isUpdating = !1;
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
      e.forEach((n, i) => {
        const s = this.createTabElement(n);
        t.appendChild(s);
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
    let s = 0;
    for (const r of t) {
      const l = r.querySelector(".orca-block-editor");
      if (!l) continue;
      const c = l.getAttribute("data-block-id");
      if (!c) continue;
      const d = await this.getTabInfo(c, this.currentPanelId, s++);
      d && i.push(d);
    }
    const a = this.mergeTabsIntelligently(n, i);
    this.setCurrentPanelTabs(a), this.syncCurrentTabsToStorage(a), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), this.log(`📋 面板 ${this.currentPanelIndex + 1} 扫描并保存了 ${a.length} 个标签页`);
  }
  /**
   * 智能合并标签数组
   */
  mergeTabsIntelligently(e, t) {
    const n = [], i = new Set(e.map((s) => s.blockId));
    for (const s of e)
      if (t.some((r) => r.blockId === s.blockId)) {
        const r = t.find((l) => l.blockId === s.blockId);
        r ? n.push({
          ...s,
          title: r.title,
          blockType: r.blockType,
          icon: r.icon
        }) : n.push(s);
      }
    for (const s of t)
      i.has(s.blockId) || n.push(s);
    return n;
  }
  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || !this.tabContainer) return;
    let e = this.getCurrentPanelTabs();
    this.currentPanelIndex !== 0 && e.length === 0 && (await this.scanAndSaveCurrentPanelTabs(), e = this.getCurrentPanelTabs()), this.log(`📋 面板 ${this.currentPanelIndex + 1} 显示 ${e.length} 个标签页`);
    const t = document.createDocumentFragment();
    if (e.length > 0)
      e.forEach((n, i) => {
        const s = this.createTabElement(n);
        t.appendChild(s);
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
    }), t.addEventListener("click", (s) => {
      s.preventDefault(), s.stopPropagation(), this.log("📁 点击工作区按钮"), this.showWorkspaceMenu(s);
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
    const n = document.documentElement.classList.contains("dark") || ((h = (u = window.orca) == null ? void 0 : u.state) == null ? void 0 : h.themeMode) === "dark", i = document.createElement("div");
    i.className = "new-tab-context-menu";
    const s = 200, a = 140;
    let r = e.clientX, l = e.clientY;
    r + s > window.innerWidth && (r = window.innerWidth - s - 10), l + a > window.innerHeight && (l = window.innerHeight - a - 10), r = Math.max(10, r), l = Math.max(10, l), i.style.cssText = `
      position: fixed;
      left: ${r}px;
      top: ${l}px;
      background: ${n ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
      border: 1px solid ${n ? "#444" : "#ddd"};
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: ${s}px;
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
        const f = document.createElement("div");
        f.style.cssText = `
          height: 1px;
          background: ${n ? "#444" : "#ddd"};
          margin: 4px 8px;
        `, i.appendChild(f);
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
        const f = document.createElement("span");
        f.textContent = p.icon, f.style.cssText = `
          font-size: 14px;
          width: 18px;
          text-align: center;
        `, g.appendChild(f);
      }
      const b = document.createElement("span");
      b.textContent = p.text, g.appendChild(b), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = n ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        p.action && p.action(), i.remove();
      }), i.appendChild(g);
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
      const s = this.getCurrentPosition();
      if (!s) return;
      const a = this.calculateSidebarAlignmentPosition(
        s,
        e,
        n,
        i
      );
      if (!a) return;
      await this.updatePosition(a), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${s.x}, ${s.y}) → (${a.x}, ${a.y})`);
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
    let s;
    if (n)
      s = Math.max(10, e.x - t), this.log(`📐 侧边栏关闭，向左移动 ${t}px: ${e.x}px → ${s}px`);
    else if (i) {
      s = e.x + t;
      const r = ((a = this.tabContainer) == null ? void 0 : a.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      s = Math.min(s, window.innerWidth - r - 10), this.log(`📐 侧边栏打开，向右移动 ${t}px: ${e.x}px → ${s}px`);
    } else
      return null;
    return { x: s, y: e.y };
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
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), this.registerHeadbarButton(), await this.storageService.saveConfig(k.FLOATING_WINDOW_VISIBLE, this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (e) {
      this.error("切换浮窗状态失败:", e);
    }
  }
  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    try {
      const e = await this.storageService.getConfig(k.FLOATING_WINDOW_VISIBLE, "orca-tabs-plugin", !1);
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
          onClick: (s) => this.showRecentlyClosedTabsMenu(s),
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
          onClick: (s) => this.showSavedTabSetsMenu(s),
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
          const s = await this.detectBlockType(i), a = this.findProperty(i, "_color"), r = this.findProperty(i, "_icon");
          let l = n.color, c = n.icon;
          a && a.type === 1 && (l = a.value), r && r.type === 1 ? c = r.value : c || (c = this.getBlockTypeIcon(s)), n.blockType !== s || n.icon !== c || n.color !== l ? (this.firstPanelTabs[t] = {
            ...n,
            blockType: s,
            icon: c,
            color: l
          }, this.log(`✅ 更新标签: ${n.title} -> 类型: ${s}, 图标: ${c}, 颜色: ${l}`), e = !0) : this.verboseLog(`⏭️ 跳过标签: ${n.title} (无需更新)`);
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
        const s = parseInt(n.replace("px", ""));
        if (isNaN(s))
          this.log(`⚠️ CSS变量值无法解析为数字: "${n}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${s}px`), s;
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
    }, s = async () => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", s);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (a) {
        this.error("保存宽度设置失败:", a);
      }
    };
    document.addEventListener("mousemove", i), document.addEventListener("mouseup", s);
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
        } catch (s) {
          this.error("实时调整面板宽度失败:", s);
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
    const i = orca.state.themeMode === "dark", s = this.isVerticalMode && !this.isFixedToTop, a = Kt(e, s, i, (c, d) => this.applyOklchFormula(c, d));
    t.style.cssText = a;
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
    return t.appendChild(r), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), t.title = sn(e), t.addEventListener("click", (c) => {
      var u;
      console.log(`🖱️ 标签点击事件触发: ${e.title} (ID: ${e.blockId})`), c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.log(`🖱️ 点击标签: ${e.title} (ID: ${e.blockId})`);
      const d = (u = this.tabContainer) == null ? void 0 : u.querySelectorAll(".orca-tab");
      d == null || d.forEach((h) => h.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("mousedown", (c) => {
      console.log(`🖱️ 标签mousedown事件触发: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dblclick", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.closeTab(e));
    }), t.addEventListener("keydown", (c) => {
      (c.target === t || t.contains(c.target)) && (c.key === "F2" ? (c.preventDefault(), c.stopPropagation(), this.renameTab(e)) : c.ctrlKey && c.key === "p" ? (c.preventDefault(), c.stopPropagation(), this.toggleTabPinStatus(e)) : c.ctrlKey && c.key === "w" && (c.preventDefault(), c.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (c) => {
      var u;
      if (c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        c.preventDefault();
        return;
      }
      c.dataTransfer.effectAllowed = "move", (u = c.dataTransfer) == null || u.setData("text/plain", e.blockId), this.draggingTab = e, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), t.setAttribute("data-dragging", "true"), t.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${e.title} (ID: ${e.blockId})`);
    }), t.addEventListener("dragend", (c) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDropIndicator(), this.hideDropZoneIndicator(), this.clearDragVisualFeedback(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (c) => {
      if (!c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") && this.draggingTab && this.draggingTab.blockId !== e.blockId) {
        if (c.preventDefault(), c.stopPropagation(), c.dataTransfer.dropEffect = "move", !this.dragOverTab || this.dragOverTab.blockId !== e.blockId) {
          const u = t.getBoundingClientRect(), h = u.top + u.height / 2, p = c.clientY < h ? "before" : "after";
          this.updateDropIndicator(t, p), this.dragOverTab = e;
        }
        this.debouncedSwapTab(e, this.draggingTab), this.verboseLog(`🔄 拖拽经过: ${e.title} (目标: ${this.draggingTab.title})`);
      }
    }), t.addEventListener("dragenter", (c) => {
      c.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== e.blockId && (c.preventDefault(), c.stopPropagation(), this.verboseLog(`🔄 拖拽进入: ${e.title}`));
    }), t.addEventListener("dragleave", (c) => {
      const d = t.getBoundingClientRect(), u = c.clientX, h = c.clientY, p = 5;
      (u < d.left - p || u > d.right + p || h < d.top - p || h > d.bottom + p) && this.verboseLog(`🔄 拖拽离开: ${e.title}`);
    }), t.addEventListener("drop", (c) => {
      var u;
      c.preventDefault();
      const d = (u = c.dataTransfer) == null ? void 0 : u.getData("text/plain");
      this.log(`🔄 拖拽放置: ${d} -> ${e.blockId}`);
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
      const n = parseInt(t[1], 16), i = parseInt(t[2], 16), s = parseInt(t[3], 16);
      return (0.299 * n + 0.587 * i + 0.114 * s) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (n) {
      let i = parseInt(n[1], 16), s = parseInt(n[2], 16), a = parseInt(n[3], 16);
      i = Math.floor(i * (1 - t)), s = Math.floor(s * (1 - t)), a = Math.floor(a * (1 - t));
      const r = i.toString(16).padStart(2, "0"), l = s.toString(16).padStart(2, "0"), c = a.toString(16).padStart(2, "0");
      return `#${r}${l}${c}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, n) {
    const i = e / 255, s = t / 255, a = n / 255, r = (w) => w <= 0.04045 ? w / 12.92 : Math.pow((w + 0.055) / 1.055, 2.4), l = r(i), c = r(s), d = r(a), u = l * 0.4124564 + c * 0.3575761 + d * 0.1804375, h = l * 0.2126729 + c * 0.7151522 + d * 0.072175, p = l * 0.0193339 + c * 0.119192 + d * 0.9503041, g = 0.2104542553 * u + 0.793617785 * h - 0.0040720468 * p, b = 1.9779984951 * u - 2.428592205 * h + 0.4505937099 * p, f = 0.0259040371 * u + 0.7827717662 * h - 0.808675766 * p, T = Math.cbrt(g), y = Math.cbrt(b), x = Math.cbrt(f), v = 0.2104542553 * T + 0.793617785 * y + 0.0040720468 * x, E = 1.9779984951 * T - 2.428592205 * y + 0.4505937099 * x, L = 0.0259040371 * T + 0.7827717662 * y - 0.808675766 * x, C = Math.sqrt(E * E + L * L), P = Math.atan2(L, E) * 180 / Math.PI, M = P < 0 ? P + 360 : P;
    return { l: v, c: C, h: M };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, n) {
    const i = n * Math.PI / 180, s = t * Math.cos(i), a = t * Math.sin(i), r = e, l = s, c = a, d = r * r * r, u = l * l * l, h = c * c * c, p = 1.0478112 * d + 0.0228866 * u - 0.050217 * h, g = 0.0295424 * d + 0.9904844 * u + 0.0170491 * h, b = -92345e-7 * d + 0.0150436 * u + 0.7521316 * h, f = 3.2404542 * p - 1.5371385 * g - 0.4985314 * b, T = -0.969266 * p + 1.8760108 * g + 0.041556 * b, y = 0.0556434 * p - 0.2040259 * g + 1.0572252 * b, x = (C) => C <= 31308e-7 ? 12.92 * C : 1.055 * Math.pow(C, 1 / 2.4) - 0.055, v = Math.max(0, Math.min(255, Math.round(x(f) * 255))), E = Math.max(0, Math.min(255, Math.round(x(T) * 255))), L = Math.max(0, Math.min(255, Math.round(x(y) * 255)));
    return { r: v, g: E, b: L };
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
   * 获取当前面板的标签数组（基于data-panel-id）
   */
  getCurrentPanelTabs() {
    return this.currentPanelIndex < 0 || this.currentPanelIndex >= this.panelTabsByIndex.length ? [] : this.isCurrentPanelPersistent() ? this.firstPanelTabs : this.panelTabsByIndex[this.currentPanelIndex] || [];
  }
  /**
   * 设置当前面板的标签数组（基于data-panel-id）
   */
  setCurrentPanelTabs(e) {
    this.currentPanelIndex < 0 || this.currentPanelIndex >= this.panelTabsByIndex.length || (this.panelTabsByIndex[this.currentPanelIndex] = [...e], this.isCurrentPanelPersistent() && (this.firstPanelTabs = [...e]), this.currentPanelIndex === 1 && (this.secondPanelTabs = [...e]));
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
      const n = this.panelIds[this.currentPanelIndex];
      this.log(`🎯 目标面板ID: ${n}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        if (e.isJournal) {
          console.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${e.blockId}, 标题: ${e.title}`), this.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${e.blockId}`);
          let i = null, s = !1;
          console.log(`🔍 检查日期块标题: ${e.title}`);
          try {
            const a = await orca.invokeBackend("get-block", parseInt(e.blockId));
            if (a) {
              const r = U(a);
              r && !isNaN(r.getTime()) && (i = r, console.log(`📅 从块信息获取日期: ${r.toISOString()}`), s = !1);
            }
          } catch (a) {
            console.log("❌ 获取块信息失败:", a);
          }
          if (!i)
            if (e.title.includes("今天") || e.title.includes("Today")) {
              console.log("📅 使用原生命令跳转到今天");
              try {
                await orca.commands.invokeCommand("core.goToday"), console.log("✅ 今天导航成功"), s = !0;
              } catch (a) {
                console.log("❌ 今天导航失败:", a), i = /* @__PURE__ */ new Date(), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else if (e.title.includes("昨天") || e.title.includes("Yesterday")) {
              console.log("📅 使用原生命令跳转到昨天");
              try {
                await orca.commands.invokeCommand("core.goYesterday"), console.log("✅ 昨天导航成功"), s = !0;
              } catch (a) {
                console.log("❌ 昨天导航失败:", a), i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() - 1), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
              }
            } else if (e.title.includes("明天") || e.title.includes("Tomorrow")) {
              console.log("📅 使用原生命令跳转到明天");
              try {
                await orca.commands.invokeCommand("core.goTomorrow"), console.log("✅ 明天导航成功"), s = !0;
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
                    const l = U(r);
                    l && !isNaN(l.getTime()) ? (i = l, console.log(`📅 从块信息获取日期: ${l.toISOString()}`)) : console.log("❌ 块信息中未找到有效日期信息");
                  } else
                    console.log("❌ 无法获取块信息");
                } catch (r) {
                  console.log("❌ 获取块信息失败:", r), this.warn("无法获取块信息:", r);
                }
              }
            }
          if (!s)
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
        const s = document.querySelector(`[data-block-id="${e.blockId}"]`);
        if (s)
          this.log(`🔄 使用备用方法点击块元素: ${e.blockId}`), s.click();
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
      const s = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(i.blockId) }, s);
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
    n.success ? (this.syncCurrentTabsToStorage(t), this.debouncedUpdateTabsUI(), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页固定状态变化，实时更新工作区: ${e.title}`)), this.log(n.message)) : this.warn(n.message);
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
              n(), this.getTabInfo(e.toString(), this.currentPanelId, 0).then((s) => {
                s ? this.showAddToTabGroupDialog(s) : orca.notify("error", "无法获取块信息");
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
      const s = this.getCurrentActiveTab();
      let a = n.length;
      if (s) {
        const r = n.findIndex((l) => l.blockId === s.blockId);
        r !== -1 && (a = r + 1, this.log(`🎯 将在聚焦标签 "${s.title}" 后面插入新标签: "${i.title}"`));
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
      this.syncCurrentTabsToStorage(n), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), await this.updateTabsUI(), await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId), this.log(`🔄 导航到块: ${e}`), this.log(`✅ 成功创建新标签页: "${i.title}"`);
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
      if (i.find((d) => d.blockId === e))
        return this.log(`📋 块 ${e} 已存在于标签页中`), n && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId), !0;
      if (!orca.state.blocks[parseInt(e)])
        return this.warn(`无法找到块 ${e}`), !1;
      const r = await this.getTabInfo(e, this.currentPanelId, i.length);
      if (!r)
        return this.warn(`无法获取块 ${e} 的标签信息`), !1;
      let l = i.length, c = !1;
      if (t === "replace") {
        const d = this.getCurrentActiveTab();
        if (!d)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const u = i.findIndex((h) => h.blockId === d.blockId);
        if (u === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        d.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), l = u + 1, c = !1) : (l = u, c = !0);
      } else if (t === "after") {
        const d = this.getCurrentActiveTab();
        if (d) {
          const u = i.findIndex((h) => h.blockId === d.blockId);
          u !== -1 && (l = u + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (i.length >= this.maxTabs)
        if (c)
          i[l] = r;
        else {
          i.splice(l, 0, r);
          const d = this.findLastNonPinnedTabIndex();
          if (d !== -1)
            i.splice(d, 1);
          else {
            const u = i.findIndex((h) => h.blockId === r.blockId);
            if (u !== -1)
              return i.splice(u, 1), !1;
          }
        }
      else
        c ? i[l] = r : i.splice(l, 0, r);
      return this.syncCurrentTabsToStorage(i), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), await this.updateTabsUI(), n && await orca.nav.goTo("block", { blockId: parseInt(e) }, this.currentPanelId), !0;
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
        const s = i.classList;
        if (s.contains("orca-ref") || s.contains("block-ref") || s.contains("block-reference") || s.contains("orca-fragment-r") || s.contains("fragment-r") || s.contains("orca-block-reference") || i.tagName.toLowerCase() === "a" && ((t = i.getAttribute("href")) != null && t.startsWith("#"))) {
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
        const s = e.textContent.trim(), a = s.match(/\[\[(?:块)?(\d+)\]\]/) || s.match(/block[:\s]*(\d+)/i);
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
    var t, n, i, s;
    try {
      const a = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let r = null;
      for (let c = a.length - 1; c >= 0; c--) {
        const d = a[c];
        if (d.offsetParent !== null && getComputedStyle(d).display !== "none") {
          r = d;
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
        const d = document.documentElement.classList.contains("dark") || ((n = (t = window.orca) == null ? void 0 : t.state) == null ? void 0 : n.themeMode) === "dark";
        c.style.cssText = `
          height: 1px;
          background: ${d ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
          margin: 4px 8px;
        `, r.appendChild(c);
      }
      if (this.savedTabSets.length > 0) {
        const c = document.createElement("div");
        c.className = "orca-tabs-ref-menu-item", c.setAttribute("role", "menuitem");
        const d = document.documentElement.classList.contains("dark") || ((s = (i = window.orca) == null ? void 0 : i.state) == null ? void 0 : s.themeMode) === "dark";
        c.style.cssText = `
          padding: 12px 16px;
          cursor: pointer;
          font-size: 14px;
          color: ${d ? "#ffffff" : "#333"};
          border-bottom: 1px solid ${d ? "#444" : "#eee"};
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        `, c.innerHTML = `
          <i class="ti ti-bookmark-plus" style="font-size: 14px;"></i>
          <span>添加到已有标签组</span>
        `, c.addEventListener("mouseenter", () => {
          c.style.backgroundColor = d ? "#444" : "#f0f0f0";
        }), c.addEventListener("mouseleave", () => {
          c.style.backgroundColor = "transparent";
        }), c.addEventListener("click", () => {
          const u = this.getCurrentActiveTab();
          u && this.showAddToTabGroupDialog(u), r == null || r.remove();
        }), r.appendChild(c);
      }
      this.log(`✅ 成功为块引用 ${e} 添加菜单项`);
    } catch (a) {
      this.error("增强块引用右键菜单时出错:", a);
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
        const s = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (s) {
          const a = s.closest(".orca-panel");
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
      const s = (a = 1) => {
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
        r || (r = document.body.scrollTop > 0 ? document.body : document.documentElement), r ? (r.scrollLeft = t.x, r.scrollTop = t.y, this.log(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", r.className, `尝试${a}`)) : setTimeout(() => s(a + 1), 200 * a);
      };
      s(), setTimeout(() => s(2), 100), setTimeout(() => s(3), 300);
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
    ].forEach((s) => {
      document.querySelectorAll(s).forEach((r, l) => {
        const c = r;
        (c.scrollTop > 0 || c.scrollLeft > 0) && this.log(`容器 ${s}[${l}]:`, {
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
    const s = e.find((a) => a.blockId === i) || null;
    return this.enableWorkspaces && this.currentWorkspace && s && this.updateCurrentWorkspaceActiveIndex(s), s;
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
      const i = this.getCurrentActiveTab(), s = i && i.blockId === e.blockId, a = s ? this.getAdjacentTab(e) : null;
      if (this.closedTabs.add(e.blockId), this.enableRecentlyClosedTabs) {
        const r = { ...e, closedAt: Date.now() }, l = this.recentlyClosedTabs.findIndex((c) => c.blockId === e.blockId);
        l !== -1 && this.recentlyClosedTabs.splice(l, 1), this.recentlyClosedTabs.unshift(r), this.recentlyClosedTabs.length > 20 && (this.recentlyClosedTabs = this.recentlyClosedTabs.slice(0, 20)), await this.saveRecentlyClosedTabs();
      }
      t.splice(n, 1), this.syncCurrentTabsToStorage(t), this.debouncedUpdateTabsUI(), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页删除，实时更新工作区: ${e.title}`)), this.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), s && a ? (this.log(`🔄 自动切换到相邻标签: "${a.title}"`), await this.switchToTab(a)) : s && !a && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    const e = this.getCurrentPanelTabs();
    e.filter((s) => !s.isPinned).forEach((s) => {
      this.closedTabs.add(s.blockId);
    });
    const n = e.filter((s) => s.isPinned), i = e.length - n.length;
    this.setCurrentPanelTabs(n), this.syncCurrentTabsToStorage(n), this.debouncedUpdateTabsUI(), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 批量关闭标签页，实时更新工作区")), this.log(`🗑️ 已关闭 ${i} 个标签，保留了 ${n.length} 个固定标签`);
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
    const s = t.length - n.length;
    this.setCurrentPanelTabs(n), this.syncCurrentTabsToStorage(n), this.debouncedUpdateTabsUI(), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log("🔄 关闭其他标签页，实时更新工作区")), this.log(`🗑️ 已关闭其他 ${s} 个标签，保留了当前标签和固定标签`);
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
    const i = t.textContent, s = t.style.cssText, a = document.createElement("input");
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
    const d = async () => {
      const h = a.value.trim();
      if (h && h !== e.title) {
        await this.updateTabTitle(e, h);
        return;
      }
      t.textContent = i, t.style.cssText = s;
    }, u = () => {
      t.textContent = i, t.style.cssText = s;
    };
    a.addEventListener("blur", d), a.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), d()) : h.key === "Escape" && (h.preventDefault(), u());
    }), a.addEventListener("click", (h) => {
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
    const s = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let a = { x: "50%", y: "50%" };
    if (s) {
      const u = s.getBoundingClientRect(), h = window.innerWidth, p = window.innerHeight, g = 300, b = 100, f = 20;
      let T = u.left, y = u.top - b - 10;
      T + g > h - f && (T = h - g - f), T < f && (T = f), y < f && (y = u.bottom + 10, y + b > p - f && (y = (p - b) / 2)), y + b > p - f && (y = p - b - f), T = Math.max(f, Math.min(T, h - g - f)), y = Math.max(f, Math.min(y, p - b - f)), a = { x: `${T}px`, y: `${y}px` };
    }
    const r = orca.components.InputBox, l = t.createElement(r, {
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
        left: a.x,
        top: a.y,
        pointerEvents: "auto"
      },
      onClick: u
    }, ""));
    n.render(l, i), setTimeout(() => {
      const u = i.querySelector("div");
      u && u.click();
    }, 0);
    const c = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(i), i.remove();
      }, 100);
    }, d = (u) => {
      u.key === "Escape" && (c(), document.removeEventListener("keydown", d));
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
    const s = document.createElement("div");
    s.style.cssText = `
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
    }), s.appendChild(a), s.appendChild(r), n.appendChild(i), n.appendChild(s);
    const l = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (l) {
      const h = l.getBoundingClientRect();
      n.style.left = `${h.left}px`, n.style.top = `${h.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), i.focus(), i.select();
    const c = () => {
      const h = i.value.trim();
      h && h !== e.title && this.updateTabTitle(e, h), n.remove();
    }, d = () => {
      n.remove();
    };
    a.addEventListener("click", c), r.addEventListener("click", d), i.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), c()) : h.key === "Escape" && (h.preventDefault(), d());
    });
    const u = (h) => {
      n.contains(h.target) || (d(), document.removeEventListener("click", u));
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
      const n = this.getCurrentPanelTabs(), i = un(e, t, n, {
        updateUI: !0,
        saveData: !0,
        validateData: !0
      });
      i.success ? (this.syncCurrentTabsToStorage(n), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), await this.updateTabsUI(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页重命名，实时更新工作区: ${t}`)), this.log(i.message)) : this.warn(i.message);
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
        const s = window.React, a = window.ReactDOM;
        !s || !a || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? e.addEventListener("contextmenu", (r) => {
          r.preventDefault(), r.stopPropagation(), r.stopImmediatePropagation(), this.showTabContextMenu(r, t);
        }) : this.createOrcaContextMenu(e, t);
      }, 100);
      return;
    }
    this.createOrcaContextMenu(e, t);
  }
  createOrcaContextMenu(e, t) {
    const n = window.React, i = window.ReactDOM, s = document.createElement("div");
    s.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(s);
    const a = orca.components.ContextMenu, r = orca.components.Menu, l = orca.components.MenuText, c = orca.components.MenuSeparator, d = n.createElement(a, {
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
      onContextMenu: (f) => {
        f.preventDefault(), f.stopPropagation(), p(f);
      }
    }));
    i.render(d, s);
    const u = () => {
      i.unmountComponentAtNode(s), s.remove();
    }, h = new MutationObserver((p) => {
      p.forEach((g) => {
        g.removedNodes.forEach((b) => {
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
    var l, c;
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const i = document.documentElement.classList.contains("dark") || ((c = (l = window.orca) == null ? void 0 : l.state) == null ? void 0 : c.themeMode) === "dark", s = document.createElement("div");
    s.className = "tab-context-menu", s.style.cssText = `
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
    const a = [
      {
        text: "重命名标签",
        action: () => this.renameTab(t)
      },
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(t)
      }
    ];
    this.savedTabSets.length > 0 && a.push({
      text: "添加到已有标签组",
      action: () => this.showAddToTabGroupDialog(t)
    }), a.push(
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
    ), a.forEach((d) => {
      const u = document.createElement("div");
      u.textContent = d.text, u.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        font-size: 14px;
        color: ${d.disabled ? i ? "#666" : "#999" : i ? "#ffffff" : "#333"};
        border-bottom: 1px solid ${i ? "#444" : "#eee"};
        transition: background-color 0.2s;
      `, d.disabled || (u.addEventListener("mouseenter", () => {
        u.style.backgroundColor = i ? "#444" : "#f0f0f0";
      }), u.addEventListener("mouseleave", () => {
        u.style.backgroundColor = "transparent";
      }), u.addEventListener("click", () => {
        d.action(), s.remove();
      })), s.appendChild(u);
    }), document.body.appendChild(s);
    const r = (d) => {
      s.contains(d.target) || (s.remove(), document.removeEventListener("click", r));
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
      await this.storageService.saveConfig(k.FIRST_PANEL_TABS, this.firstPanelTabs), this.log("💾 保存标签数据到API配置");
    } catch (e) {
      this.warn("无法保存第一个面板标签数据:", e);
    }
  }
  /**
   * 保存第二个面板的标签数据到持久化存储（使用API）
   */
  async saveSecondPanelTabs() {
    try {
      await this.storageService.saveConfig(k.SECOND_PANEL_TABS, this.secondPanelTabs), this.log("💾 保存第二个面板标签数据到API配置");
    } catch (e) {
      this.warn("无法保存第二个面板标签数据:", e);
    }
  }
  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    try {
      await this.storageService.saveConfig(k.CLOSED_TABS, Array.from(this.closedTabs)), this.log("💾 保存已关闭标签列表到API配置");
    } catch (e) {
      this.warn("无法保存已关闭标签列表:", e);
    }
  }
  /**
   * 保存最近关闭的标签页列表到持久化存储（使用API）
   */
  async saveRecentlyClosedTabs() {
    try {
      await this.storageService.saveConfig(k.RECENTLY_CLOSED_TABS, this.recentlyClosedTabs), this.log("💾 保存最近关闭标签页列表到API配置");
    } catch (e) {
      this.warn("无法保存最近关闭标签页列表:", e);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    try {
      const e = await this.storageService.getConfig(k.FIRST_PANEL_TABS, "orca-tabs-plugin", []);
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
      const e = await this.storageService.getConfig(k.SECOND_PANEL_TABS, "orca-tabs-plugin", []);
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
          const s = await orca.invokeBackend("get-block", parseInt(n.blockId));
          if (s) {
            const a = await this.detectBlockType(s);
            let r = n.icon;
            r || (r = this.getBlockTypeIcon(a)), this.firstPanelTabs[t] = {
              ...n,
              blockType: a,
              icon: r
            }, this.log(`✅ 更新恢复的标签: ${n.title} -> 类型: ${a}, 图标: ${r}`), e = !0;
          }
        } catch (s) {
          this.warn(`更新恢复的标签失败: ${n.title}`, s);
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
      const e = await this.storageService.getConfig(k.CLOSED_TABS, "orca-tabs-plugin", []);
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
      const e = await this.storageService.getConfig(k.RECENTLY_CLOSED_TABS, "orca-tabs-plugin", []);
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
      await this.storageService.saveConfig(k.SAVED_TAB_SETS, this.savedTabSets), this.log("💾 保存多标签页集合到API配置");
    } catch (e) {
      this.warn("无法保存多标签页集合:", e);
    }
  }
  /**
   * 从持久化存储恢复多标签页集合（使用API）
   */
  async restoreSavedTabSets() {
    try {
      const e = await this.storageService.getConfig(k.SAVED_TAB_SETS, "orca-tabs-plugin", []);
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
      const s = this.tabContainer.querySelector(".drag-handle");
      s && s.classList.add("dragging");
    }
    document.body.classList.add("dragging");
    const n = (s) => {
      this.isDragging && (s.preventDefault(), s.stopPropagation(), this.drag(s));
    }, i = (s) => {
      document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", i), this.stopDrag();
    };
    document.addEventListener("mousemove", n), document.addEventListener("mouseup", i), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = e.clientX - this.dragStartX, this.verticalPosition.y = e.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = e.clientX - this.dragStartX, this.horizontalPosition.y = e.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const t = this.tabContainer.getBoundingClientRect(), n = 5, i = window.innerWidth - t.width - 5, s = 5, a = window.innerHeight - t.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(n, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(s, Math.min(a, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(n, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(s, Math.min(a, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
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
      this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, await this.saveLayoutMode(), this.log(`💾 位置已保存: ${he(this.position, this.isVerticalMode)}`);
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
      await this.storageService.saveConfig(k.LAYOUT_MODE, e), this.log(`💾 布局模式已保存: ${this.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${this.verticalWidth}px, 垂直位置: (${this.verticalPosition.x}, ${this.verticalPosition.y}), 水平位置: (${this.horizontalPosition.x}, ${this.horizontalPosition.y})`);
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
      await this.storageService.saveConfig(k.FIXED_TO_TOP, e), this.log(`💾 固定到顶部状态已保存: ${this.isFixedToTop ? "启用" : "禁用"}`);
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
      this.position = V(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Xt(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${he(this.position, this.isVerticalMode)}`);
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
        "orca-tabs-plugin",
        Y()
      );
      if (e) {
        const t = Gt(e);
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = V(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = t.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = t.isFloatingWindowVisible, this.showBlockTypeIcons = t.showBlockTypeIcons, this.showInHeadbar = t.showInHeadbar, this.log(`📐 布局模式已恢复: ${Zt(t)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const t = Y();
        this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = V(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (e) {
      this.error("恢复布局模式失败:", e);
      const t = Y();
      this.isVerticalMode = t.isVerticalMode, this.verticalWidth = t.verticalWidth, this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, this.position = V(
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
        k.FIXED_TO_TOP,
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
    this.position = fn(this.position, this.isVerticalMode, this.verticalWidth, e);
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
    var u, h, p;
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
    const s = this.firstPanelTabs.find((g) => g.blockId === i);
    if (s) {
      this.verboseLog(`📋 当前激活页面已存在: "${s.title}"`);
      const g = (u = this.tabContainer) == null ? void 0 : u.querySelectorAll(".orca-tab");
      g == null || g.forEach((f) => f.removeAttribute("data-focused"));
      const b = (h = this.tabContainer) == null ? void 0 : h.querySelector(`[data-tab-id="${i}"]`);
      b && (b.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${s.title}"`)), this.debouncedUpdateTabsUI();
      return;
    }
    this.log(`📋 检测到用户点击了被删除的页面，重新添加到标签栏: ${i}`);
    const a = await this.getTabInfo(i, e, this.firstPanelTabs.length);
    if (!a) {
      this.log(`❌ 无法获取标签信息: ${i}`);
      return;
    }
    let r = this.firstPanelTabs.length, l = !1;
    const c = (p = this.tabContainer) == null ? void 0 : p.querySelector('.orca-tab[data-focused="true"]');
    if (c) {
      const g = c.getAttribute("data-tab-id");
      if (g) {
        const b = this.firstPanelTabs.findIndex((f) => f.blockId === g);
        b !== -1 ? this.firstPanelTabs[b].isPinned ? (r = b + 1, l = !1, this.log("📌 聚焦标签是固定的，将在其后面插入新标签")) : (r = b, l = !0, this.log("🎯 聚焦标签不是固定的，将替换聚焦标签")) : this.log("🎯 聚焦的标签不在数组中，插入到末尾");
      } else
        this.log("🎯 聚焦的标签没有data-tab-id，插入到末尾");
    } else
      this.log("🎯 没有找到聚焦的标签，将替换最后一个非固定标签");
    this.log(`🎯 最终计算的insertIndex: ${r}, 是否替换聚焦标签: ${l}`);
    const d = a;
    if (this.verboseLog(`📋 检测到新的激活页面: "${d.title}"`), this.firstPanelTabs.length >= this.maxTabs)
      if (l && r < this.firstPanelTabs.length) {
        const g = this.firstPanelTabs[r];
        this.firstPanelTabs[r] = d, this.log(`🔄 替换聚焦标签: "${g.title}" -> "${d.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((b, f) => `${f}:${b.title}`));
      } else if (r < this.firstPanelTabs.length) {
        this.log("🎯 插入前数组:", this.firstPanelTabs.map((b, f) => `${f}:${b.title}`)), this.firstPanelTabs.splice(r + 1, 0, d), this.log(`➕ 在位置 ${r + 1} 插入新标签: ${d.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((b, f) => `${f}:${b.title}`));
        const g = this.findLastNonPinnedTabIndex();
        if (g !== -1) {
          const b = this.firstPanelTabs[g];
          this.firstPanelTabs.splice(g, 1), this.log(`🗑️ 删除末尾的非固定标签: "${b.title}" 来保持数量限制`), this.log("🎯 最终数组:", this.firstPanelTabs.map((f, T) => `${T}:${f.title}`));
        } else {
          const b = this.firstPanelTabs.findIndex((f) => f.blockId === d.blockId);
          if (b !== -1) {
            this.firstPanelTabs.splice(b, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${d.title}"`);
            return;
          }
        }
      } else {
        const g = this.findLastNonPinnedTabIndex();
        if (g !== -1) {
          const b = this.firstPanelTabs[g];
          this.firstPanelTabs[g] = d, this.log(`🔄 没有聚焦标签，替换最后一个非固定标签: "${b.title}" -> "${d.title}"`);
        } else {
          this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${d.title}"`);
          return;
        }
      }
    else if (l && r < this.firstPanelTabs.length) {
      const g = this.firstPanelTabs[r];
      this.firstPanelTabs[r] = d, this.log(`🔄 替换聚焦标签: "${g.title}" -> "${d.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((b, f) => `${f}:${b.title}`));
    } else
      this.firstPanelTabs.splice(r, 0, d), this.verboseLog(`➕ 在位置 ${r} 插入新标签: ${d.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((g, b) => `${b}:${g.title}`));
    this.closedTabs.has(i) && (this.closedTabs.delete(i), await this.saveClosedTabs(), this.log(`🔄 标签 "${d.title}" 重新显示，从已关闭列表中移除`)), await this.saveFirstPanelTabs(), this.enableWorkspaces && this.currentWorkspace && (await this.saveCurrentTabsToWorkspace(), this.log(`🔄 标签页新增，实时更新工作区: ${d.title}`)), this.debouncedUpdateTabsUI();
  }
  observeChanges() {
    new MutationObserver(async (t) => {
      let n = !1, i = !1, s = !1, a = this.currentPanelIndex;
      t.forEach((r) => {
        if (r.type === "childList") {
          const l = r.target;
          if ((l.classList.contains("orca-panels-row") || l.closest(".orca-panels-row")) && (this.verboseLog("🔍 检测到面板行变化，检查新面板..."), i = !0), r.addedNodes.length > 0 && l.closest(".orca-panel")) {
            for (const d of r.addedNodes)
              if (d.nodeType === Node.ELEMENT_NODE) {
                const u = d;
                if (u.classList.contains("orca-block-editor") || u.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        r.type === "attributes" && r.attributeName === "class" && r.target.classList.contains("orca-panel") && (s = !0);
      }), s && (await this.updateCurrentPanelIndex(), a !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${a} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), i && setTimeout(async () => {
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
    const t = [...this.panelIds], n = this.getPersistentPanelId();
    this.discoverPanels();
    const i = this.getPersistentPanelId(), s = kn(t, this.panelIds);
    s && (this.log(`📋 面板列表发生变化: ${t.length} -> ${this.panelIds.length}`), this.log(`📋 旧面板列表: [${t.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`), this.log(`📋 持久化面板变更: ${n} -> ${i}`), n !== i && (this.log(`🔄 持久化面板已变更: ${n} -> ${i}`), await this.handlePersistentPanelChange(n, i))), this.currentPanelId && !this.panelIds.includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`), this.panelIds.length > 0 ? (this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0], this.log(`🔄 已切换到第一个面板: ${this.currentPanelId}`), await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI()) : (this.log("⚠️ 没有可用的面板"), this.currentPanelId = "", this.currentPanelIndex = -1, this.debouncedUpdateTabsUI()));
    const a = document.querySelector(".orca-panel.active");
    if (a) {
      const r = a.getAttribute("data-panel-id");
      if (r && (r !== this.currentPanelId || s)) {
        const l = this.currentPanelIndex, c = this.panelIds.indexOf(r);
        c !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${r} (索引: ${l} -> ${c})`), this.currentPanelIndex = c, this.currentPanelId = r, await this.scanCurrentPanelTabs(), this.debouncedUpdateTabsUI());
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
        const n = this.panelTabsByIndex[this.persistentPanelIndex] || [];
        n.length > 0 ? (this.log(`✅ 新持久化面板 ${t} (索引: ${this.persistentPanelIndex}) 已有标签数据，直接使用`), this.firstPanelTabs = [...n]) : (this.log(`🔍 新持久化面板 ${t} (索引: ${this.persistentPanelIndex}) 没有标签数据，重新扫描`), await this.scanPersistentPanel(t)), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的标签"), await this.updateTabsUI(), this.log(`✅ 持久化面板变更处理完成，当前有 ${this.firstPanelTabs.length} 个标签`);
      } else
        this.log("✅ 持久化面板未变化，保持现有标签数据");
    else
      this.log("🗑️ 没有持久化面板，清空标签数据"), this.firstPanelTabs = [], await this.saveFirstPanelTabs(), await this.updateTabsUI();
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
    const n = t.querySelectorAll(".orca-hideable"), i = [];
    let s = 0;
    for (const a of n) {
      const r = a.querySelector(".orca-block-editor");
      if (!r) continue;
      const l = r.getAttribute("data-block-id");
      if (!l) continue;
      const c = await this.getTabInfo(l, e, s++);
      c && i.push(c);
    }
    this.panelTabsByIndex[this.persistentPanelIndex] = [...i], this.firstPanelTabs = [...i], this.log(`📋 持久化面板 ${e} (索引: ${this.persistentPanelIndex}) 扫描并保存了 ${i.length} 个标签页`);
  }
  /**
   * 根据索引扫描指定面板的标签页
   */
  async scanPanelTabsByIndex(e, t) {
    const n = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!n) {
      this.warn(`❌ 未找到面板: ${t}`);
      return;
    }
    const i = n.querySelectorAll(".orca-hideable"), s = [];
    let a = 0;
    for (const r of i) {
      const l = r.querySelector(".orca-block-editor");
      if (!l) continue;
      const c = l.getAttribute("data-block-id");
      if (!c) continue;
      const d = await this.getTabInfo(c, t, a++);
      d && s.push(d);
    }
    this.panelTabsByIndex[e] = [...s], this.log(`📋 面板 ${t} (索引: ${e}) 扫描了 ${s.length} 个标签页`);
  }
  /**
   * 扫描当前面板的标签（更新到panelTabsMap）
   */
  async scanCurrentPanelTabs() {
    if (!this.currentPanelId) return;
    const e = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!e) {
      this.warn(`❌ 未找到当前面板: ${this.currentPanelId}`);
      return;
    }
    const t = e.querySelectorAll(".orca-hideable"), n = [];
    let i = 0;
    for (const r of t) {
      const l = r.querySelector(".orca-block-editor");
      if (!l) continue;
      const c = l.getAttribute("data-block-id");
      if (!c) continue;
      const d = await this.getTabInfo(c, this.currentPanelId, i++);
      d && n.push(d);
    }
    const s = this.getCurrentPanelTabs(), a = this.mergeTabsIntelligently(s, n);
    this.panelTabsByIndex[this.currentPanelIndex] = [...a], this.isCurrentPanelPersistent() ? (this.firstPanelTabs = [...a], this.log(`📋 持久化面板 ${this.currentPanelId} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页，已同步到firstPanelTabs`)) : this.log(`📋 当前面板 ${this.currentPanelId} (索引: ${this.currentPanelIndex}) 扫描了 ${a.length} 个标签页`);
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
      await this.storageService.removeConfig(k.FIRST_PANEL_TABS), await this.storageService.removeConfig(k.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
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
    const t = e ? { x: e.clientX, y: e.clientY } : { x: 0, y: 0 }, n = this.recentlyClosedTabs.map((i, s) => ({
      label: `${i.title}`,
      icon: i.icon || this.getBlockTypeIcon(i.blockType || "default"),
      onClick: () => this.restoreRecentlyClosedTab(i, s)
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
    var d, u;
    const n = document.querySelector(".recently-closed-tabs-menu");
    n && n.remove();
    const i = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", s = document.createElement("div");
    s.className = "recently-closed-tabs-menu", s.style.cssText = `
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
    `, e.forEach((h, p) => {
      if (h.label === "---") {
        const f = document.createElement("div");
        f.style.cssText = `
          height: 1px;
          background: linear-gradient(to right, transparent, ${i ? "#444" : "#e0e0e0"}, transparent);
          margin: 4px 8px;
        `, s.appendChild(f);
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
      `, h.icon) {
        const f = document.createElement("div");
        if (f.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, h.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = h.icon, f.appendChild(T);
        } else
          f.textContent = h.icon;
        g.appendChild(f);
      }
      const b = document.createElement("span");
      b.textContent = h.label, b.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, g.appendChild(b), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = i ? "#444" : "#f5f5f5";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        h.onClick(), s.remove();
      }), s.appendChild(g);
    }), document.body.appendChild(s);
    const a = s.getBoundingClientRect(), r = window.innerWidth, l = window.innerHeight;
    a.right > r && (s.style.left = `${r - a.width - 10}px`), a.bottom > l && (s.style.top = `${l - a.height - 10}px`);
    const c = (h) => {
      s.contains(h.target) || (s.remove(), document.removeEventListener("click", c), document.removeEventListener("contextmenu", c));
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
    })), this.savedTabSets.forEach((i, s) => {
      n.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: i.icon || "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, s)
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
    }), this.savedTabSets.forEach((i, s) => {
      n.push({
        label: `${i.name} (${i.tabs.length}个标签)`,
        icon: "ti ti-bookmark",
        onClick: () => this.loadSavedTabSet(i, s)
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
    var d, u;
    const n = document.querySelector(".multi-tab-saving-menu");
    n && n.remove();
    const i = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", s = document.createElement("div");
    s.className = "multi-tab-saving-menu", s.style.cssText = `
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
    `, e.forEach((h, p) => {
      if (h.label === "---") {
        const f = document.createElement("div");
        f.style.cssText = `
          height: 1px;
          background: ${i ? "#444" : "#e0e0e0"};
          margin: 4px 0;
        `, s.appendChild(f);
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
      `, h.icon) {
        const f = document.createElement("div");
        if (f.style.cssText = `
          margin-right: 8px;
          font-size: 14px;
          color: ${i ? "#cccccc" : "#666"};
          width: 16px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        `, h.icon.startsWith("ti ti-")) {
          const T = document.createElement("i");
          T.className = h.icon, f.appendChild(T);
        } else
          f.textContent = h.icon;
        g.appendChild(f);
      }
      const b = document.createElement("span");
      b.textContent = h.label, b.style.cssText = `
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `, g.appendChild(b), g.addEventListener("mouseenter", () => {
        g.style.backgroundColor = i ? "#444" : "#f5f5f5";
      }), g.addEventListener("mouseleave", () => {
        g.style.backgroundColor = "transparent";
      }), g.addEventListener("click", () => {
        h.onClick(), s.remove();
      }), s.appendChild(g);
    }), document.body.appendChild(s);
    const a = s.getBoundingClientRect(), r = window.innerWidth, l = window.innerHeight;
    a.right > r && (s.style.left = `${r - a.width - 10}px`), a.bottom > l && (s.style.top = `${l - a.height - 10}px`);
    const c = (h) => {
      s.contains(h.target) || (s.remove(), document.removeEventListener("click", c), document.removeEventListener("contextmenu", c));
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
    `, t.addEventListener("click", (C) => {
      C.stopPropagation();
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
    const s = document.createElement("div");
    s.style.cssText = `
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
      `, u.style.display = "block", g.style.display = "none", E();
    }, d = () => {
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
      `, u.style.display = "none", g.style.display = "block", E();
    };
    a.onclick = c, r.onclick = d, s.appendChild(a), s.appendChild(r), i.appendChild(s);
    const u = document.createElement("div");
    u.style.cssText = `
      display: block;
    `;
    const h = document.createElement("label");
    h.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, h.textContent = "请输入新标签页集合名称:", u.appendChild(h);
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
    }), p.addEventListener("input", (C) => {
      console.log("输入框输入:", C.target.value);
    }), u.appendChild(p);
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
    const T = document.createElement("option");
    T.value = "", T.textContent = "请选择标签页集合...", f.appendChild(T), this.savedTabSets.forEach((C, P) => {
      const M = document.createElement("option");
      M.value = P.toString(), M.textContent = `${C.name} (${C.tabs.length}个标签)`, f.appendChild(M);
    }), g.appendChild(f), i.appendChild(u), i.appendChild(g), t.appendChild(i);
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
    const E = () => {
      v.textContent = l ? "更新" : "保存";
    };
    v.onclick = async () => {
      if (l) {
        const C = parseInt(f.value);
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
    }, y.appendChild(x), y.appendChild(v), t.appendChild(y), document.body.appendChild(t), setTimeout(() => {
      p.focus(), p.select();
    }, 100), p.addEventListener("keydown", (C) => {
      C.key === "Enter" ? (C.preventDefault(), v.click()) : C.key === "Escape" && (C.preventDefault(), x.click());
    });
    const L = (C) => {
      t.contains(C.target) || (t.remove(), document.removeEventListener("click", L));
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
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 0 20px;
    `;
    const a = document.createElement("label");
    a.style.cssText = `
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #333;
    `, a.textContent = `将标签页 "${e.title}" 添加到:`, s.appendChild(a);
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
      const b = document.createElement("option");
      b.value = g.toString(), b.textContent = `${p.name} (${p.tabs.length}个标签)`, r.appendChild(b);
    }), s.appendChild(r), n.appendChild(s);
    const c = document.createElement("div");
    c.style.cssText = `
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
      n.remove(), this.manageSavedTabSets();
    };
    const u = document.createElement("button");
    u.textContent = "添加", u.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, u.addEventListener("mouseenter", () => {
      u.style.backgroundColor = "#2563eb";
    }), u.addEventListener("mouseleave", () => {
      u.style.backgroundColor = "#3b82f6";
    }), u.onclick = async () => {
      const p = parseInt(r.value);
      if (isNaN(p) || p < 0 || p >= this.savedTabSets.length) {
        orca.notify("warn", "请选择要添加到的标签组");
        return;
      }
      n.remove(), await this.addTabToGroup(e, p);
    }, c.appendChild(d), c.appendChild(u), n.appendChild(c), document.body.appendChild(n), setTimeout(() => {
      r.focus();
    }, 100), r.addEventListener("keydown", (p) => {
      p.key === "Enter" ? (p.preventDefault(), u.click()) : p.key === "Escape" && (p.preventDefault(), d.click());
    });
    const h = (p) => {
      n.contains(p.target) || (n.remove(), document.removeEventListener("click", h));
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
      const n = this.savedTabSets[t];
      if (!n) {
        orca.notify("error", "标签组不存在");
        return;
      }
      if (n.tabs.find((s) => s.blockId === e.blockId)) {
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
        const s = { ...i, panelId: this.currentPanelId };
        n.push(s);
      }
      this.syncCurrentTabsToStorage(n), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI(), e.updatedAt = Date.now(), await this.saveSavedTabSets(), this.log(`🔄 已加载标签页集合: "${e.name}" (${e.tabs.length}个标签)`), orca.notify("success", `已加载标签页集合: ${e.name}`);
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
      this.previousTabSet = t, this.syncCurrentTabsToStorage(e), this.isCurrentPanelPersistent() && await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`🔄 已回到上一个标签集合 (${this.previousTabSet.length}个标签)`), orca.notify("success", "已回到上一个标签集合");
    } catch (e) {
      this.error("回到上一个标签集合失败:", e), orca.notify("error", "恢复失败");
    }
  }
  /**
   * 重新渲染可排序的标签列表
   */
  renderSortableTabs(e, t, n) {
    var c, d;
    const i = document.documentElement.classList.contains("dark") || ((d = (c = window.orca) == null ? void 0 : c.state) == null ? void 0 : d.themeMode) === "dark";
    e.innerHTML = "", t.forEach((u, h) => {
      const p = document.createElement("div");
      p.className = "sortable-tab-item", p.draggable = !0, p.dataset.index = h.toString(), p.style.cssText = `
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
      `, g.innerHTML = "⋮⋮", p.appendChild(g), u.icon) {
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
        `, u.icon.startsWith("ti ti-")) {
          const v = document.createElement("i");
          v.className = u.icon, x.appendChild(v);
        } else
          x.textContent = u.icon;
        p.appendChild(x);
      }
      const b = document.createElement("div");
      b.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-height: 20px;
      `;
      let f = `
        <div style="font-size: 14px; color: #333; font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${u.title}</div>
        <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${u.blockId}</div>
      `;
      b.innerHTML = f, p.appendChild(b);
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
      `, y.textContent = (h + 1).toString(), T.appendChild(y), p.appendChild(T), p.addEventListener("dragstart", (x) => {
        x.dataTransfer.setData("text/plain", h.toString()), x.dataTransfer.effectAllowed = "move", p.style.opacity = "0.5", p.style.transform = "rotate(2deg)";
      }), p.addEventListener("dragend", (x) => {
        p.style.opacity = "1", p.style.transform = "rotate(0deg)";
      }), p.addEventListener("dragover", (x) => {
        x.preventDefault(), x.dataTransfer.dropEffect = "move", p.style.borderColor = "#3b82f6", p.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), p.addEventListener("dragleave", (x) => {
        p.style.borderColor = "#e0e0e0", p.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      }), p.addEventListener("drop", (x) => {
        x.preventDefault(), x.stopPropagation();
        const v = parseInt(x.dataTransfer.getData("text/plain")), E = h;
        if (v !== E) {
          const L = t[v];
          t.splice(v, 1), t.splice(E, 0, L), this.renderSortableTabs(e, t);
          const C = this.savedTabSets.find((P) => P.tabs === t);
          C && (C.tabs = [...t], C.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新"));
        }
        p.style.borderColor = "#e0e0e0", p.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      }), p.addEventListener("mouseenter", () => {
        p.style.backgroundColor = "rgba(59, 130, 246, 0.05)", p.style.borderColor = "#3b82f6";
      }), p.addEventListener("mouseleave", () => {
        p.style.backgroundColor = "rgba(255, 255, 255, 0.8)", p.style.borderColor = "#e0e0e0";
      }), e.appendChild(p);
    });
    const s = document.createElement("div");
    s.className = "delete-zone", s.style.cssText = `
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
    `, s.innerHTML = "🗑️ 拖拽到此处删除", e.style.position = "relative", e.appendChild(s);
    let a = -1;
    const r = (u) => {
      a = parseInt(u.target.dataset.index || "0"), s.style.display = "flex", s.style.transform = "translateY(0)";
    }, l = (u) => {
      a = -1, s.style.display = "none", s.style.transform = "translateY(-10px)";
    };
    s.addEventListener("dragover", (u) => {
      u.preventDefault(), u.dataTransfer.dropEffect = "move", s.style.transform = "scale(1.05)", s.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
    }), s.addEventListener("dragleave", (u) => {
      s.style.transform = "scale(1)", s.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
    }), s.addEventListener("drop", (u) => {
      if (u.preventDefault(), u.stopPropagation(), a >= 0 && a < t.length) {
        const h = t[a];
        t.splice(a, 1), this.renderSortableTabs(e, t);
        const p = this.savedTabSets.find((g) => g.tabs === t);
        p && (p.tabs = [...t], p.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", `已删除标签: ${h.title}`));
      }
      s.style.display = "none", s.style.transform = "translateY(-10px)";
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
      const e = await this.storageService.getConfig(k.WORKSPACES);
      e && Array.isArray(e) && (this.workspaces = e, this.log(`📁 已加载 ${this.workspaces.length} 个工作区`)), await this.clearCurrentWorkspace();
      const t = await this.storageService.getConfig(k.ENABLE_WORKSPACES);
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
      await this.storageService.saveConfig(k.WORKSPACES, this.workspaces), await this.storageService.saveConfig(k.CURRENT_WORKSPACE, this.currentWorkspace), await this.storageService.saveConfig(k.ENABLE_WORKSPACES, this.enableWorkspaces), this.log("💾 工作区数据已保存");
    } catch (e) {
      this.error("保存工作区数据失败:", e);
    }
  }
  /**
   * 清除当前工作区状态
   */
  async clearCurrentWorkspace() {
    try {
      this.currentWorkspace = null, await this.storageService.saveConfig(k.CURRENT_WORKSPACE, null), this.log("📁 已清除当前工作区状态");
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
    var g, b;
    const e = document.querySelector(".save-workspace-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((b = (g = window.orca) == null ? void 0 : g.state) == null ? void 0 : b.themeMode) === "dark", n = document.createElement("div");
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
    const s = document.createElement("div");
    s.style.cssText = `
      font-size: 16px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 16px;
      text-align: center;
    `, s.textContent = "保存工作区";
    const a = document.createElement("div");
    a.style.cssText = `
      font-size: 14px;
      font-weight: 500;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 8px;
    `, a.textContent = "工作区名称:";
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
    const d = document.createElement("div");
    d.style.cssText = `
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    `;
    const u = document.createElement("button");
    u.style.cssText = `
      padding: 8px 16px;
      border: 1px solid ${t ? "#444" : "#ddd"};
      border-radius: 6px;
      background: ${t ? "#1a1a1a" : "#fff"};
      color: ${t ? "#999" : "#666"};
      cursor: pointer;
      font-size: 14px;
    `, u.textContent = "取消", u.onclick = () => {
      n.remove(), this.showWorkspaceMenu();
    };
    const h = document.createElement("button");
    h.style.cssText = `
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      background: #3b82f6;
      color: white;
      cursor: pointer;
      font-size: 14px;
    `, h.textContent = "保存", h.onclick = async () => {
      const f = r.value.trim();
      if (!f) {
        orca.notify("warn", "请输入工作区名称");
        return;
      }
      if (this.workspaces.some((T) => T.name === f)) {
        orca.notify("warn", "工作区名称已存在");
        return;
      }
      await this.performSaveWorkspace(f, c.value.trim()), n.remove();
    }, d.appendChild(u), d.appendChild(h), i.appendChild(s), i.appendChild(a), i.appendChild(r), i.appendChild(l), i.appendChild(c), i.appendChild(d), n.appendChild(i), document.body.appendChild(n), r.focus(), n.addEventListener("click", (f) => {
      f.target === n && n.remove();
    });
    const p = (f) => {
      f.key === "Escape" && (n.remove(), document.removeEventListener("keydown", p));
    };
    document.addEventListener("keydown", p);
  }
  /**
   * 执行保存工作区
   */
  async performSaveWorkspace(e, t) {
    try {
      const n = this.firstPanelTabs, i = this.getCurrentActiveTab(), s = {
        id: `workspace_${Date.now()}`,
        name: e,
        tabs: n,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        description: t || void 0,
        lastActiveTabId: i ? i.blockId : void 0
      };
      this.workspaces.push(s), await this.saveWorkspaces(), this.log(`💾 工作区已保存: "${e}" (${n.length}个标签)`), orca.notify("success", `工作区已保存: ${e}`);
    } catch (n) {
      this.error("保存工作区失败:", n), orca.notify("error", "保存工作区失败");
    }
  }
  /**
   * 显示工作区切换菜单
   */
  showWorkspaceMenu(e) {
    var d, u;
    if (!this.enableWorkspaces) {
      orca.notify("warn", "工作区功能已禁用");
      return;
    }
    const t = document.querySelector(".workspace-menu");
    t && t.remove();
    const n = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", i = document.createElement("div");
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
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 12px 16px;
      border-bottom: 1px solid ${n ? "#444" : "#eee"};
      font-size: 14px;
      font-weight: 600;
      color: ${n ? "#ffffff" : "#333"};
    `, s.textContent = "工作区";
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid ${n ? "#444" : "#eee"};
      color: ${n ? "#ffffff" : "#333"};
    `, a.innerHTML = `
      <i class="ti ti-plus" style="font-size: 14px; color: #3b82f6;"></i>
      <span>保存当前工作区</span>
    `, a.onclick = () => {
      i.remove(), this.saveCurrentWorkspace();
    };
    const r = document.createElement("div");
    if (r.style.cssText = `
      max-height: 300px;
      overflow-y: auto;
    `, this.workspaces.length === 0) {
      const h = document.createElement("div");
      h.style.cssText = `
        padding: 12px 16px;
        color: ${n ? "#999" : "#666"};
        font-size: 14px;
        text-align: center;
      `, h.textContent = "暂无工作区", r.appendChild(h);
    } else
      this.workspaces.forEach((h) => {
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
          ${this.currentWorkspace === h.id ? "background: rgba(59, 130, 246, 0.1);" : ""}
        `;
        const g = h.icon || "ti ti-folder";
        p.innerHTML = `
          <i class="${g}" style="font-size: 14px; color: #3b82f6;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; color: ${n ? "#ffffff" : "#333"};"">${h.name}</div>
            ${h.description ? `<div style="font-size: 12px; color: ${n ? "#999" : "#666"}; margin-top: 2px;">${h.description}</div>` : ""}
            <div style="font-size: 11px; color: ${n ? "#777" : "#999"}; margin-top: 2px;">${h.tabs.length}个标签</div>
          </div>
          ${this.currentWorkspace === h.id ? '<i class="ti ti-check" style="font-size: 14px; color: #3b82f6;"></i>' : ""}
        `, p.onclick = () => {
          i.remove(), this.switchToWorkspace(h.id);
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
    }, i.appendChild(s), i.appendChild(a), i.appendChild(r), i.appendChild(l), document.body.appendChild(i);
    const c = (h) => {
      i.contains(h.target) || (i.remove(), document.removeEventListener("click", c));
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
      this.currentWorkspace && await this.saveCurrentTabsToWorkspace(), this.currentWorkspace = e, await this.saveWorkspaces(), await this.storageService.saveConfig(k.CURRENT_WORKSPACE, e), await this.replaceCurrentTabsWithWorkspace(t.tabs, t), this.log(`🔄 已切换到工作区: "${t.name}"`), orca.notify("success", `已切换到工作区: ${t.name}`);
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
      for (const s of e)
        try {
          const a = await this.getTabInfo(s.blockId, this.currentPanelId, n.length);
          a ? (a.isPinned = s.isPinned, a.order = s.order, a.scrollPosition = s.scrollPosition, n.push(a)) : n.push(s);
        } catch (a) {
          this.warn(`无法更新标签页信息 ${s.title}:`, a), n.push(s);
        }
      this.firstPanelTabs = n, this.panelTabsByIndex.length <= 0 && (this.panelTabsByIndex[0] = []), this.panelTabsByIndex[0] = [...n], await this.saveFirstPanelTabs(), this.currentPanelIndex !== 0 && (this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0], this.log("🔄 工作区切换：切换到第一个面板 (索引: 0)")), await this.updateTabsUI();
      const i = t.lastActiveTabId;
      setTimeout(async () => {
        if (n.length > 0) {
          let s = n[0];
          if (i) {
            const a = n.find((r) => r.blockId === i);
            a ? (s = a, this.log(`🎯 导航到工作区中最后激活的标签页: ${s.title} (ID: ${i})`)) : this.log(`🎯 工作区中记录的最后激活标签页不存在，导航到第一个标签页: ${s.title}`);
          } else
            this.log(`🎯 工作区中没有记录最后激活标签页，导航到第一个标签页: ${s.title}`);
          await orca.nav.goTo("block", { blockId: parseInt(s.blockId) }, this.currentPanelId);
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
    var d, u;
    const e = document.querySelector(".manage-workspaces-dialog");
    e && e.remove();
    const t = document.documentElement.classList.contains("dark") || ((u = (d = window.orca) == null ? void 0 : d.state) == null ? void 0 : u.themeMode) === "dark", n = document.createElement("div");
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
    const s = document.createElement("div");
    s.style.cssText = `
      font-size: 18px;
      font-weight: 600;
      color: ${t ? "#ffffff" : "#333"};
      margin-bottom: 20px;
      text-align: center;
    `, s.textContent = "管理工作区";
    const a = document.createElement("div");
    if (a.style.cssText = `
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
      `, h.textContent = "暂无工作区", a.appendChild(h);
    } else
      this.workspaces.forEach((h) => {
        const p = document.createElement("div");
        p.style.cssText = `
          display: flex;
          align-items: center;
          padding: 12px;
          border: 1px solid ${t ? "#444" : "#eee"};
          border-radius: 8px;
          margin-bottom: 8px;
          background: ${this.currentWorkspace === h.id ? "rgba(59, 130, 246, 0.05)" : t ? "#1a1a1a" : "#fff"};
        `;
        const g = h.icon || "ti ti-folder";
        p.innerHTML = `
          <i class="${g}" style="font-size: 20px; color: #3b82f6; margin-right: 12px;"></i>
          <div style="flex: 1;">
            <div style="font-weight: 500; font-size: 14px; margin-bottom: 4px; color: ${t ? "#ffffff" : "#333"};"">${h.name}</div>
            ${h.description ? `<div style="font-size: 12px; color: ${t ? "#999" : "#666"}; margin-bottom: 4px;">${h.description}</div>` : ""}
            <div style="font-size: 11px; color: ${t ? "#777" : "#999"};"">${h.tabs.length}个标签 • 创建于 ${new Date(h.createdAt).toLocaleString()}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            ${this.currentWorkspace === h.id ? '<span style="color: #3b82f6; font-size: 12px;">当前</span>' : ""}
            <button class="delete-workspace-btn" data-workspace-id="${h.id}" style="
              padding: 4px 8px;
              border: 1px solid #ef4444;
              border-radius: 4px;
              background: ${t ? "#1a1a1a" : "#fff"};
              color: #ef4444;
              cursor: pointer;
              font-size: 12px;
            ">删除</button>
          </div>
        `, a.appendChild(p);
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
    }, r.appendChild(l), i.appendChild(s), i.appendChild(a), i.appendChild(r), n.appendChild(i), document.body.appendChild(n), n.querySelectorAll(".delete-workspace-btn").forEach((h) => {
      h.addEventListener("click", async (p) => {
        const g = p.target.getAttribute("data-workspace-id");
        g && (await this.deleteWorkspace(g), n.remove(), this.manageWorkspaces());
      });
    }), n.addEventListener("click", (h) => {
      h.target === n && n.remove();
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
    var h, p;
    const n = document.documentElement.classList.contains("dark") || ((p = (h = window.orca) == null ? void 0 : h.state) == null ? void 0 : p.themeMode) === "dark", i = document.querySelector(".tabset-details-dialog");
    i && i.remove();
    const s = document.createElement("div");
    s.className = "tabset-details-dialog", s.style.cssText = `
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
    const a = document.createElement("div");
    a.style.cssText = `
      padding: 20px 20px 0 20px;
      font-weight: 600;
      font-size: 16px;
      color: #333;
      margin-bottom: 16px;
    `, a.textContent = `标签集合详情: ${e.name}`, s.appendChild(a);
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
      const b = document.createElement("div");
      b.style.cssText = `
        font-weight: 600;
        font-size: 14px;
        color: #333;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      const f = document.createElement("span");
      f.textContent = "包含的标签 (可拖拽排序):", b.appendChild(f);
      const T = document.createElement("span");
      T.style.cssText = `
        font-size: 12px;
        color: #666;
        font-weight: normal;
      `, T.textContent = "拖拽调整顺序", b.appendChild(T), g.appendChild(b);
      const y = document.createElement("div");
      y.className = "sortable-tabs-container", y.style.cssText = `
        min-height: 100px;
        position: relative;
        border: 2px dashed transparent;
        border-radius: 8px;
        transition: border-color 0.3s ease;
      `;
      const x = [...e.tabs];
      x.forEach((P, M) => {
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
        `, Z.innerHTML = "⋮⋮", w.appendChild(Z), P.icon) {
          const S = document.createElement("div");
          if (S.style.cssText = `
            margin-right: 8px;
            font-size: 14px;
            color: ${n ? "#cccccc" : "#666"};
            width: 16px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          `, P.icon.startsWith("ti ti-")) {
            const O = document.createElement("i");
            O.className = P.icon, S.appendChild(O);
          } else
            S.textContent = P.icon;
          w.appendChild(S);
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
          <div style="font-size: 14px; color: #333; font-weight: 500; line-height: 1.2; margin-bottom: 2px;">${P.title}</div>
          <div style="font-size: 12px; color: #666; line-height: 1.2;">ID: ${P.blockId}</div>
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
        `, ee.textContent = (M + 1).toString(), Q.appendChild(ee), w.appendChild(Q), w.addEventListener("dragstart", (S) => {
          S.dataTransfer.setData("text/plain", M.toString()), S.dataTransfer.effectAllowed = "move", w.style.opacity = "0.5", w.style.transform = "rotate(2deg)";
        }), w.addEventListener("dragend", (S) => {
          w.style.opacity = "1", w.style.transform = "rotate(0deg)";
        }), w.addEventListener("dragover", (S) => {
          S.preventDefault(), S.dataTransfer.dropEffect = "move", w.style.borderColor = "#3b82f6", w.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
        }), w.addEventListener("dragleave", (S) => {
          w.style.borderColor = "#e0e0e0", w.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        }), w.addEventListener("drop", (S) => {
          S.preventDefault(), S.stopPropagation();
          const O = parseInt(S.dataTransfer.getData("text/plain")), se = M;
          if (O !== se) {
            const Pe = x[O];
            x.splice(O, 1), x.splice(se, 0, Pe), this.renderSortableTabs(y, x, e), e.tabs = [...x], e.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", "标签顺序已更新");
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
      let E = -1;
      const L = (P) => {
        E = parseInt(P.target.dataset.index || "0"), v.style.display = "flex", v.style.transform = "translateY(0)";
      }, C = (P) => {
        E = -1, v.style.display = "none", v.style.transform = "translateY(-10px)";
      };
      v.addEventListener("dragover", (P) => {
        P.preventDefault(), P.dataTransfer.dropEffect = "move", v.style.transform = "scale(1.05)", v.style.boxShadow = "0 6px 16px rgba(239, 68, 68, 0.4)";
      }), v.addEventListener("dragleave", (P) => {
        v.style.transform = "scale(1)", v.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.3)";
      }), v.addEventListener("drop", (P) => {
        if (P.preventDefault(), P.stopPropagation(), E >= 0 && E < x.length) {
          const M = x[E];
          x.splice(E, 1), this.renderSortableTabs(y, x, e), e.tabs = [...x], e.updatedAt = Date.now(), this.saveSavedTabSets(), orca.notify("success", `已删除标签: ${M.title}`);
        }
        v.style.display = "none", v.style.transform = "translateY(-10px)";
      }), y.addEventListener("dragstart", L), y.addEventListener("dragend", C), g.appendChild(y), r.appendChild(g);
    }
    s.appendChild(r);
    const c = document.createElement("div");
    c.style.cssText = `
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
    }), d.onclick = () => {
      s.remove(), t && this.manageSavedTabSets();
    }, c.appendChild(d), s.appendChild(c), document.body.appendChild(s);
    const u = (g) => {
      s.contains(g.target) || (s.remove(), t && this.manageSavedTabSets(), document.removeEventListener("click", u));
    };
    setTimeout(() => {
      document.addEventListener("click", u);
    }, 200);
  }
  /**
   * 重命名标签集合
   */
  renameTabSet(e, t, n) {
    const i = document.querySelector(".rename-tabset-dialog");
    i && i.remove();
    const s = document.createElement("div");
    s.className = "rename-tabset-dialog", s.style.cssText = `
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
    `, a.textContent = "重命名标签集合", s.appendChild(a);
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
    }), r.appendChild(c), s.appendChild(r);
    const d = document.createElement("div");
    d.style.cssText = `
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
      s.remove(), this.manageSavedTabSets();
    };
    const h = document.createElement("button");
    h.textContent = "保存", h.style.cssText = `
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
      const g = c.value.trim();
      if (!g) {
        orca.notify("warn", "请输入名称");
        return;
      }
      if (g === e.name) {
        s.remove(), this.manageSavedTabSets();
        return;
      }
      if (this.savedTabSets.find((f) => f.name === g && f.id !== e.id)) {
        orca.notify("warn", "该名称已存在");
        return;
      }
      e.name = g, e.updatedAt = Date.now(), await this.saveSavedTabSets(), s.remove(), n.remove(), this.manageSavedTabSets(), orca.notify("success", "重命名成功");
    }, d.appendChild(u), d.appendChild(h), s.appendChild(d), document.body.appendChild(s), setTimeout(() => {
      c.focus(), c.select();
    }, 100), c.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), h.click()) : g.key === "Escape" && (g.preventDefault(), u.click());
    });
    const p = (g) => {
      s.contains(g.target) || (s.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p));
    };
    setTimeout(() => {
      document.addEventListener("click", p), document.addEventListener("contextmenu", p);
    }, 200);
  }
  /**
   * 内联编辑标签集合名称
   */
  async editTabSetName(e, t, n, i) {
    const s = document.createElement("input");
    s.type = "text", s.value = e.name, s.style.cssText = `
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
    n.innerHTML = "", n.appendChild(s), s.addEventListener("click", (d) => {
      d.stopPropagation();
    }), s.addEventListener("mousedown", (d) => {
      d.stopPropagation();
    }), s.focus(), s.select();
    const r = async () => {
      const d = s.value.trim();
      if (!d) {
        n.textContent = a;
        return;
      }
      if (d === e.name) {
        n.textContent = a;
        return;
      }
      if (this.savedTabSets.find((h) => h.name === d && h.id !== e.id)) {
        orca.notify("warn", "该名称已存在"), n.textContent = a;
        return;
      }
      e.name = d, e.updatedAt = Date.now(), await this.saveSavedTabSets(), n.textContent = d, orca.notify("success", "重命名成功");
    }, l = () => {
      n.textContent = a;
    };
    s.addEventListener("keydown", (d) => {
      d.key === "Enter" ? (d.preventDefault(), r()) : d.key === "Escape" && (d.preventDefault(), l());
    });
    let c = null;
    s.addEventListener("blur", () => {
      c && clearTimeout(c), c = window.setTimeout(() => {
        r();
      }, 100);
    }), s.addEventListener("focus", () => {
      c && (clearTimeout(c), c = null);
    });
  }
  /**
   * 内联编辑标签集合图标
   */
  async editTabSetIcon(e, t, n, i, s) {
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
        const y = document.createElement("i");
        y.className = g.value, f.appendChild(y);
      } else
        f.textContent = g.icon;
      const T = document.createElement("div");
      T.style.cssText = `
        font-size: 12px;
        color: #666;
        text-align: center;
      `, T.textContent = g.name, b.appendChild(f), b.appendChild(T), b.addEventListener("click", async (y) => {
        y.stopPropagation(), e.icon = g.value, e.updatedAt = Date.now(), await this.saveSavedTabSets(), i(), a.remove(), s && s.focus(), orca.notify("success", "图标已更新");
      }), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "#f5f5f5", b.style.borderColor = "#3b82f6";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = e.icon === g.value ? "#e3f2fd" : "white", b.style.borderColor = "#e0e0e0";
      }), d.appendChild(b);
    }), l.appendChild(d), a.appendChild(l);
    const u = document.createElement("div");
    u.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const h = document.createElement("button");
    h.textContent = "关闭", h.style.cssText = `
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
    }), h.onclick = (g) => {
      g.stopPropagation(), a.remove(), s && s.focus();
    }, u.appendChild(h), a.appendChild(u), document.body.appendChild(a);
    const p = (g) => {
      a.contains(g.target) || (g.stopPropagation(), a.remove(), document.removeEventListener("click", p), document.removeEventListener("contextmenu", p), s && s.focus());
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
      const d = document.createElement("div");
      d.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        margin-bottom: 8px;
        background: rgba(249, 249, 249, 0.8);
        transition: background-color 0.2s;
      `, d.addEventListener("mouseenter", () => {
        d.style.backgroundColor = "rgba(240, 240, 240, 0.8)";
      }), d.addEventListener("mouseleave", () => {
        d.style.backgroundColor = "rgba(249, 249, 249, 0.8)";
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
        border-radius: 4px;
        transition: background-color 0.2s;
      `, h.title = "点击编辑图标";
      const p = () => {
        if (h.innerHTML = "", l.icon)
          if (l.icon.startsWith("ti ti-")) {
            const E = document.createElement("i");
            E.className = l.icon, h.appendChild(E);
          } else
            h.textContent = l.icon;
        else
          h.textContent = "📁";
      };
      p(), h.addEventListener("click", () => {
        this.editTabSetIcon(l, c, h, p, t);
      }), h.addEventListener("mouseenter", () => {
        h.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), h.addEventListener("mouseleave", () => {
        h.style.backgroundColor = "transparent";
      });
      const g = document.createElement("div");
      g.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      `;
      const b = document.createElement("div");
      b.style.cssText = `
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
      `, b.textContent = l.name, b.title = "点击编辑名称", b.addEventListener("click", () => {
        this.editTabSetName(l, c, b, t);
      }), b.addEventListener("mouseenter", () => {
        b.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
      }), b.addEventListener("mouseleave", () => {
        b.style.backgroundColor = "transparent";
      });
      const f = document.createElement("div");
      f.style.cssText = `
        font-size: 12px;
        color: #666;
      `, f.textContent = `${l.tabs.length}个标签 • ${new Date(l.updatedAt).toLocaleString()}`, g.appendChild(b), g.appendChild(f), u.appendChild(h), u.appendChild(g);
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
      }, T.appendChild(y), T.appendChild(x), T.appendChild(v), d.appendChild(u), d.appendChild(T), i.appendChild(d);
    }), t.appendChild(i);
    const s = document.createElement("div");
    s.style.cssText = `
      padding: 20px;
      display: flex;
      justify-content: flex-end;
    `;
    const a = document.createElement("button");
    a.textContent = "关闭", a.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, a.addEventListener("mouseenter", () => {
      a.style.backgroundColor = "#4b5563";
    }), a.addEventListener("mouseleave", () => {
      a.style.backgroundColor = "#6b7280";
    }), a.onclick = () => t.remove(), s.appendChild(a), t.appendChild(s), document.body.appendChild(t);
    const r = (l) => {
      t.contains(l.target) || (t.remove(), document.removeEventListener("click", r), document.removeEventListener("contextmenu", r));
    };
    setTimeout(() => {
      document.addEventListener("click", r), document.addEventListener("contextmenu", r);
    }, 0);
  }
}
let $ = null;
async function Pn(o) {
  q = o, $e(orca.state.locale, { "zh-CN": Me }), $ = new Cn(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
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
async function En() {
  $ && ($.unregisterHeadbarButton(), $.cleanupDragResize(), $.destroy(), $ = null), orca.commands.unregisterCommand(`${q}.resetCache`);
}
export {
  Pn as load,
  En as unload
};
