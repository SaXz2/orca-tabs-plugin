var yt = Object.defineProperty;
var xt = (a, t, e) => t in a ? yt(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var b = (a, t, e) => xt(a, typeof t != "symbol" ? t + "" : t, e);
let ot = "en", lt = {};
function wt(a, t) {
  ot = a, lt = t;
}
function vt(a, t, e) {
  var i;
  return ((i = lt[ot]) == null ? void 0 : i[a]) ?? a;
}
const Tt = {
  标签页插件已启动: "标签页插件已启动",
  "your plugin code starts here": "您的插件代码从这里开始",
  今天: "今天",
  昨天: "昨天",
  明天: "明天"
}, ct = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
}, dt = {
  JSON: 0,
  Text: 1
}, v = {
  FIRST_PANEL_TABS: "first-panel-tabs",
  // 第一个面板的标签数据
  CLOSED_TABS: "closed-tabs",
  // 已关闭标签列表
  FLOATING_WINDOW_VISIBLE: "floating-window-visible",
  // 浮窗可见状态
  TABS_POSITION: "tabs-position",
  // 标签位置
  LAYOUT_MODE: "layout-mode"
  // 布局模式
};
class Pt {
  log(...t) {
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && console.log("[OrcaStorageService]", ...t);
  }
  warn(...t) {
    console.warn("[OrcaStorageService]", ...t);
  }
  error(...t) {
    console.error("[OrcaStorageService]", ...t);
  }
  /**
   * 保存数据到Orca插件存储系统
   * @param key 存储键
   * @param data 要保存的数据
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async saveConfig(t, e, n = "orca-tabs-plugin") {
    try {
      const i = typeof e == "string" ? e : JSON.stringify(e);
      return await orca.plugins.setData(n, t, i), this.log(`💾 已保存插件数据 ${t}:`, e), !0;
    } catch (i) {
      return this.warn(`无法保存插件数据 ${t}，尝试降级到localStorage:`, i), this.saveToLocalStorage(t, e);
    }
  }
  /**
   * 从Orca插件存储系统读取数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   * @param defaultValue 默认值
   */
  async getConfig(t, e = "orca-tabs-plugin", n) {
    try {
      const i = await orca.plugins.getData(e, t);
      if (i == null)
        return n || null;
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
      return this.warn(`无法读取插件数据 ${t}，尝试从localStorage读取:`, i), this.getFromLocalStorage(t, n);
    }
  }
  /**
   * 删除插件数据
   * @param key 存储键
   * @param pluginName 插件名称（默认orca-tabs-plugin）
   */
  async removeConfig(t, e = "orca-tabs-plugin") {
    try {
      return await orca.plugins.removeData(e, t), this.log(`🗑️ 已删除插件数据 ${t}`), !0;
    } catch (n) {
      return this.warn(`无法删除插件数据 ${t}，尝试从localStorage删除:`, n), this.removeFromLocalStorage(t);
    }
  }
  /**
   * 降级到localStorage保存
   */
  saveToLocalStorage(t, e) {
    try {
      const n = this.getLocalStorageKey(t);
      return localStorage.setItem(n, JSON.stringify(e)), this.log(`💾 已降级保存到localStorage: ${n}`), !0;
    } catch (n) {
      return this.error("无法保存到localStorage:", n), !1;
    }
  }
  /**
   * 从localStorage读取
   */
  getFromLocalStorage(t, e) {
    try {
      const n = this.getLocalStorageKey(t), i = localStorage.getItem(n);
      if (i) {
        const r = JSON.parse(i);
        return this.log(`📂 已从localStorage读取: ${n}`), r;
      }
      return e || null;
    } catch (n) {
      return this.error("无法从localStorage读取:", n), e || null;
    }
  }
  /**
   * 从localStorage删除
   */
  removeFromLocalStorage(t) {
    try {
      const e = this.getLocalStorageKey(t);
      return localStorage.removeItem(e), this.log(`🗑️ 已从localStorage删除: ${e}`), !0;
    } catch (e) {
      return this.error("无法从localStorage删除:", e), !1;
    }
  }
  /**
   * 获取localStorage键名
   */
  getLocalStorageKey(t) {
    return {
      [v.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [v.CLOSED_TABS]: "orca-closed-tabs-api",
      [v.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [v.TABS_POSITION]: "orca-tabs-position-api",
      [v.LAYOUT_MODE]: "orca-tabs-layout-api"
    }[t] || `orca-plugin-storage-${t}`;
  }
  /**
   * 测试API配置的序列化和反序列化
   */
  async testConfigSerialization() {
    try {
      this.log("🧪 开始测试API配置序列化...");
      const t = "test string";
      await this.saveConfig("test-string", t);
      const e = await this.getConfig("test-string", "orca-tabs-plugin");
      this.log(`字符串测试: ${t === e ? "✅" : "❌"}`);
      const n = { name: "test", value: 123, nested: { data: [1, 2, 3] } };
      await this.saveConfig("test-object", n);
      const i = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(n) === JSON.stringify(i) ? "✅" : "❌"}`);
      const r = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", r);
      const s = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(r) === JSON.stringify(s) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (t) {
      this.error("API配置序列化测试失败:", t);
    }
  }
}
const ht = 6048e5, It = 864e5, Q = Symbol.for("constructDateFrom");
function P(a, t) {
  return typeof a == "function" ? a(t) : a && typeof a == "object" && Q in a ? a[Q](t) : a instanceof Date ? new a.constructor(t) : new Date(t);
}
function I(a, t) {
  return P(t || a, a);
}
function ut(a, t, e) {
  const n = I(a, e == null ? void 0 : e.in);
  return isNaN(t) ? P(a, NaN) : (t && n.setDate(n.getDate() + t), n);
}
let kt = {};
function V() {
  return kt;
}
function W(a, t) {
  var o, l, c, h;
  const e = V(), n = (t == null ? void 0 : t.weekStartsOn) ?? ((l = (o = t == null ? void 0 : t.locale) == null ? void 0 : o.options) == null ? void 0 : l.weekStartsOn) ?? e.weekStartsOn ?? ((h = (c = e.locale) == null ? void 0 : c.options) == null ? void 0 : h.weekStartsOn) ?? 0, i = I(a, t == null ? void 0 : t.in), r = i.getDay(), s = (r < n ? 7 : 0) + r - n;
  return i.setDate(i.getDate() - s), i.setHours(0, 0, 0, 0), i;
}
function R(a, t) {
  return W(a, { ...t, weekStartsOn: 1 });
}
function gt(a, t) {
  const e = I(a, t == null ? void 0 : t.in), n = e.getFullYear(), i = P(e, 0);
  i.setFullYear(n + 1, 0, 4), i.setHours(0, 0, 0, 0);
  const r = R(i), s = P(e, 0);
  s.setFullYear(n, 0, 4), s.setHours(0, 0, 0, 0);
  const o = R(s);
  return e.getTime() >= r.getTime() ? n + 1 : e.getTime() >= o.getTime() ? n : n - 1;
}
function K(a) {
  const t = I(a), e = new Date(
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
  return e.setUTCFullYear(t.getFullYear()), +a - +e;
}
function ft(a, ...t) {
  const e = P.bind(
    null,
    t.find((n) => typeof n == "object")
  );
  return t.map(e);
}
function q(a, t) {
  const e = I(a, t == null ? void 0 : t.in);
  return e.setHours(0, 0, 0, 0), e;
}
function St(a, t, e) {
  const [n, i] = ft(
    e == null ? void 0 : e.in,
    a,
    t
  ), r = q(n), s = q(i), o = +r - K(r), l = +s - K(s);
  return Math.round((o - l) / It);
}
function Ct(a, t) {
  const e = gt(a, t), n = P(a, 0);
  return n.setFullYear(e, 0, 4), n.setHours(0, 0, 0, 0), R(n);
}
function G(a) {
  return P(a, Date.now());
}
function J(a, t, e) {
  const [n, i] = ft(
    e == null ? void 0 : e.in,
    a,
    t
  );
  return +q(n) == +q(i);
}
function $t(a) {
  return a instanceof Date || typeof a == "object" && Object.prototype.toString.call(a) === "[object Date]";
}
function Et(a) {
  return !(!$t(a) && typeof a != "number" || isNaN(+I(a)));
}
function Mt(a, t) {
  const e = I(a, t == null ? void 0 : t.in);
  return e.setFullYear(e.getFullYear(), 0, 1), e.setHours(0, 0, 0, 0), e;
}
const Dt = {
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
}, Lt = (a, t, e) => {
  let n;
  const i = Dt[a];
  return typeof i == "string" ? n = i : t === 1 ? n = i.one : n = i.other.replace("{{count}}", t.toString()), e != null && e.addSuffix ? e.comparison && e.comparison > 0 ? "in " + n : n + " ago" : n;
};
function j(a) {
  return (t = {}) => {
    const e = t.width ? String(t.width) : a.defaultWidth;
    return a.formats[e] || a.formats[a.defaultWidth];
  };
}
const At = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Ot = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Bt = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Wt = {
  date: j({
    formats: At,
    defaultWidth: "full"
  }),
  time: j({
    formats: Ot,
    defaultWidth: "full"
  }),
  dateTime: j({
    formats: Bt,
    defaultWidth: "full"
  })
}, Nt = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, zt = (a, t, e, n) => Nt[a];
function A(a) {
  return (t, e) => {
    const n = e != null && e.context ? String(e.context) : "standalone";
    let i;
    if (n === "formatting" && a.formattingValues) {
      const s = a.defaultFormattingWidth || a.defaultWidth, o = e != null && e.width ? String(e.width) : s;
      i = a.formattingValues[o] || a.formattingValues[s];
    } else {
      const s = a.defaultWidth, o = e != null && e.width ? String(e.width) : a.defaultWidth;
      i = a.values[o] || a.values[s];
    }
    const r = a.argumentCallback ? a.argumentCallback(t) : t;
    return i[r];
  };
}
const Ft = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Rt = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, qt = {
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
}, Vt = {
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
}, _t = {
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
}, Ht = {
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
}, Ut = (a, t) => {
  const e = Number(a), n = e % 100;
  if (n > 20 || n < 10)
    switch (n % 10) {
      case 1:
        return e + "st";
      case 2:
        return e + "nd";
      case 3:
        return e + "rd";
    }
  return e + "th";
}, Yt = {
  ordinalNumber: Ut,
  era: A({
    values: Ft,
    defaultWidth: "wide"
  }),
  quarter: A({
    values: Rt,
    defaultWidth: "wide",
    argumentCallback: (a) => a - 1
  }),
  month: A({
    values: qt,
    defaultWidth: "wide"
  }),
  day: A({
    values: Vt,
    defaultWidth: "wide"
  }),
  dayPeriod: A({
    values: _t,
    defaultWidth: "wide",
    formattingValues: Ht,
    defaultFormattingWidth: "wide"
  })
};
function O(a) {
  return (t, e = {}) => {
    const n = e.width, i = n && a.matchPatterns[n] || a.matchPatterns[a.defaultMatchWidth], r = t.match(i);
    if (!r)
      return null;
    const s = r[0], o = n && a.parsePatterns[n] || a.parsePatterns[a.defaultParseWidth], l = Array.isArray(o) ? Xt(o, (d) => d.test(s)) : (
      // [TODO] -- I challenge you to fix the type
      jt(o, (d) => d.test(s))
    );
    let c;
    c = a.valueCallback ? a.valueCallback(l) : l, c = e.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      e.valueCallback(c)
    ) : c;
    const h = t.slice(s.length);
    return { value: c, rest: h };
  };
}
function jt(a, t) {
  for (const e in a)
    if (Object.prototype.hasOwnProperty.call(a, e) && t(a[e]))
      return e;
}
function Xt(a, t) {
  for (let e = 0; e < a.length; e++)
    if (t(a[e]))
      return e;
}
function Gt(a) {
  return (t, e = {}) => {
    const n = t.match(a.matchPattern);
    if (!n) return null;
    const i = n[0], r = t.match(a.parsePattern);
    if (!r) return null;
    let s = a.valueCallback ? a.valueCallback(r[0]) : r[0];
    s = e.valueCallback ? e.valueCallback(s) : s;
    const o = t.slice(i.length);
    return { value: s, rest: o };
  };
}
const Jt = /^(\d+)(th|st|nd|rd)?/i, Qt = /\d+/i, Kt = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Zt = {
  any: [/^b/i, /^(a|c)/i]
}, te = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, ee = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, ne = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ie = {
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
}, ae = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, re = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, se = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, oe = {
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
}, le = {
  ordinalNumber: Gt({
    matchPattern: Jt,
    parsePattern: Qt,
    valueCallback: (a) => parseInt(a, 10)
  }),
  era: O({
    matchPatterns: Kt,
    defaultMatchWidth: "wide",
    parsePatterns: Zt,
    defaultParseWidth: "any"
  }),
  quarter: O({
    matchPatterns: te,
    defaultMatchWidth: "wide",
    parsePatterns: ee,
    defaultParseWidth: "any",
    valueCallback: (a) => a + 1
  }),
  month: O({
    matchPatterns: ne,
    defaultMatchWidth: "wide",
    parsePatterns: ie,
    defaultParseWidth: "any"
  }),
  day: O({
    matchPatterns: ae,
    defaultMatchWidth: "wide",
    parsePatterns: re,
    defaultParseWidth: "any"
  }),
  dayPeriod: O({
    matchPatterns: se,
    defaultMatchWidth: "any",
    parsePatterns: oe,
    defaultParseWidth: "any"
  })
}, ce = {
  code: "en-US",
  formatDistance: Lt,
  formatLong: Wt,
  formatRelative: zt,
  localize: Yt,
  match: le,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function de(a, t) {
  const e = I(a, t == null ? void 0 : t.in);
  return St(e, Mt(e)) + 1;
}
function he(a, t) {
  const e = I(a, t == null ? void 0 : t.in), n = +R(e) - +Ct(e);
  return Math.round(n / ht) + 1;
}
function bt(a, t) {
  var h, d, u, g;
  const e = I(a, t == null ? void 0 : t.in), n = e.getFullYear(), i = V(), r = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((d = (h = t == null ? void 0 : t.locale) == null ? void 0 : h.options) == null ? void 0 : d.firstWeekContainsDate) ?? i.firstWeekContainsDate ?? ((g = (u = i.locale) == null ? void 0 : u.options) == null ? void 0 : g.firstWeekContainsDate) ?? 1, s = P((t == null ? void 0 : t.in) || a, 0);
  s.setFullYear(n + 1, 0, r), s.setHours(0, 0, 0, 0);
  const o = W(s, t), l = P((t == null ? void 0 : t.in) || a, 0);
  l.setFullYear(n, 0, r), l.setHours(0, 0, 0, 0);
  const c = W(l, t);
  return +e >= +o ? n + 1 : +e >= +c ? n : n - 1;
}
function ue(a, t) {
  var o, l, c, h;
  const e = V(), n = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((l = (o = t == null ? void 0 : t.locale) == null ? void 0 : o.options) == null ? void 0 : l.firstWeekContainsDate) ?? e.firstWeekContainsDate ?? ((h = (c = e.locale) == null ? void 0 : c.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, i = bt(a, t), r = P((t == null ? void 0 : t.in) || a, 0);
  return r.setFullYear(i, 0, n), r.setHours(0, 0, 0, 0), W(r, t);
}
function ge(a, t) {
  const e = I(a, t == null ? void 0 : t.in), n = +W(e, t) - +ue(e, t);
  return Math.round(n / ht) + 1;
}
function y(a, t) {
  const e = a < 0 ? "-" : "", n = Math.abs(a).toString().padStart(t, "0");
  return e + n;
}
const k = {
  // Year
  y(a, t) {
    const e = a.getFullYear(), n = e > 0 ? e : 1 - e;
    return y(t === "yy" ? n % 100 : n, t.length);
  },
  // Month
  M(a, t) {
    const e = a.getMonth();
    return t === "M" ? String(e + 1) : y(e + 1, 2);
  },
  // Day of the month
  d(a, t) {
    return y(a.getDate(), t.length);
  },
  // AM or PM
  a(a, t) {
    const e = a.getHours() / 12 >= 1 ? "pm" : "am";
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
  h(a, t) {
    return y(a.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(a, t) {
    return y(a.getHours(), t.length);
  },
  // Minute
  m(a, t) {
    return y(a.getMinutes(), t.length);
  },
  // Second
  s(a, t) {
    return y(a.getSeconds(), t.length);
  },
  // Fraction of second
  S(a, t) {
    const e = t.length, n = a.getMilliseconds(), i = Math.trunc(
      n * Math.pow(10, e - 3)
    );
    return y(i, t.length);
  }
}, E = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, Z = {
  // Era
  G: function(a, t, e) {
    const n = a.getFullYear() > 0 ? 1 : 0;
    switch (t) {
      case "G":
      case "GG":
      case "GGG":
        return e.era(n, { width: "abbreviated" });
      case "GGGGG":
        return e.era(n, { width: "narrow" });
      case "GGGG":
      default:
        return e.era(n, { width: "wide" });
    }
  },
  // Year
  y: function(a, t, e) {
    if (t === "yo") {
      const n = a.getFullYear(), i = n > 0 ? n : 1 - n;
      return e.ordinalNumber(i, { unit: "year" });
    }
    return k.y(a, t);
  },
  // Local week-numbering year
  Y: function(a, t, e, n) {
    const i = bt(a, n), r = i > 0 ? i : 1 - i;
    if (t === "YY") {
      const s = r % 100;
      return y(s, 2);
    }
    return t === "Yo" ? e.ordinalNumber(r, { unit: "year" }) : y(r, t.length);
  },
  // ISO week-numbering year
  R: function(a, t) {
    const e = gt(a);
    return y(e, t.length);
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
  u: function(a, t) {
    const e = a.getFullYear();
    return y(e, t.length);
  },
  // Quarter
  Q: function(a, t, e) {
    const n = Math.ceil((a.getMonth() + 1) / 3);
    switch (t) {
      case "Q":
        return String(n);
      case "QQ":
        return y(n, 2);
      case "Qo":
        return e.ordinalNumber(n, { unit: "quarter" });
      case "QQQ":
        return e.quarter(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "QQQQQ":
        return e.quarter(n, {
          width: "narrow",
          context: "formatting"
        });
      case "QQQQ":
      default:
        return e.quarter(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function(a, t, e) {
    const n = Math.ceil((a.getMonth() + 1) / 3);
    switch (t) {
      case "q":
        return String(n);
      case "qq":
        return y(n, 2);
      case "qo":
        return e.ordinalNumber(n, { unit: "quarter" });
      case "qqq":
        return e.quarter(n, {
          width: "abbreviated",
          context: "standalone"
        });
      case "qqqqq":
        return e.quarter(n, {
          width: "narrow",
          context: "standalone"
        });
      case "qqqq":
      default:
        return e.quarter(n, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function(a, t, e) {
    const n = a.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return k.M(a, t);
      case "Mo":
        return e.ordinalNumber(n + 1, { unit: "month" });
      case "MMM":
        return e.month(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "MMMMM":
        return e.month(n, {
          width: "narrow",
          context: "formatting"
        });
      case "MMMM":
      default:
        return e.month(n, { width: "wide", context: "formatting" });
    }
  },
  // Stand-alone month
  L: function(a, t, e) {
    const n = a.getMonth();
    switch (t) {
      case "L":
        return String(n + 1);
      case "LL":
        return y(n + 1, 2);
      case "Lo":
        return e.ordinalNumber(n + 1, { unit: "month" });
      case "LLL":
        return e.month(n, {
          width: "abbreviated",
          context: "standalone"
        });
      case "LLLLL":
        return e.month(n, {
          width: "narrow",
          context: "standalone"
        });
      case "LLLL":
      default:
        return e.month(n, { width: "wide", context: "standalone" });
    }
  },
  // Local week of year
  w: function(a, t, e, n) {
    const i = ge(a, n);
    return t === "wo" ? e.ordinalNumber(i, { unit: "week" }) : y(i, t.length);
  },
  // ISO week of year
  I: function(a, t, e) {
    const n = he(a);
    return t === "Io" ? e.ordinalNumber(n, { unit: "week" }) : y(n, t.length);
  },
  // Day of the month
  d: function(a, t, e) {
    return t === "do" ? e.ordinalNumber(a.getDate(), { unit: "date" }) : k.d(a, t);
  },
  // Day of year
  D: function(a, t, e) {
    const n = de(a);
    return t === "Do" ? e.ordinalNumber(n, { unit: "dayOfYear" }) : y(n, t.length);
  },
  // Day of week
  E: function(a, t, e) {
    const n = a.getDay();
    switch (t) {
      case "E":
      case "EE":
      case "EEE":
        return e.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "EEEEE":
        return e.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "EEEEEE":
        return e.day(n, {
          width: "short",
          context: "formatting"
        });
      case "EEEE":
      default:
        return e.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function(a, t, e, n) {
    const i = a.getDay(), r = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "e":
        return String(r);
      case "ee":
        return y(r, 2);
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
  c: function(a, t, e, n) {
    const i = a.getDay(), r = (i - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "c":
        return String(r);
      case "cc":
        return y(r, t.length);
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
  i: function(a, t, e) {
    const n = a.getDay(), i = n === 0 ? 7 : n;
    switch (t) {
      case "i":
        return String(i);
      case "ii":
        return y(i, t.length);
      case "io":
        return e.ordinalNumber(i, { unit: "day" });
      case "iii":
        return e.day(n, {
          width: "abbreviated",
          context: "formatting"
        });
      case "iiiii":
        return e.day(n, {
          width: "narrow",
          context: "formatting"
        });
      case "iiiiii":
        return e.day(n, {
          width: "short",
          context: "formatting"
        });
      case "iiii":
      default:
        return e.day(n, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function(a, t, e) {
    const i = a.getHours() / 12 >= 1 ? "pm" : "am";
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
  b: function(a, t, e) {
    const n = a.getHours();
    let i;
    switch (n === 12 ? i = E.noon : n === 0 ? i = E.midnight : i = n / 12 >= 1 ? "pm" : "am", t) {
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
  B: function(a, t, e) {
    const n = a.getHours();
    let i;
    switch (n >= 17 ? i = E.evening : n >= 12 ? i = E.afternoon : n >= 4 ? i = E.morning : i = E.night, t) {
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
  h: function(a, t, e) {
    if (t === "ho") {
      let n = a.getHours() % 12;
      return n === 0 && (n = 12), e.ordinalNumber(n, { unit: "hour" });
    }
    return k.h(a, t);
  },
  // Hour [0-23]
  H: function(a, t, e) {
    return t === "Ho" ? e.ordinalNumber(a.getHours(), { unit: "hour" }) : k.H(a, t);
  },
  // Hour [0-11]
  K: function(a, t, e) {
    const n = a.getHours() % 12;
    return t === "Ko" ? e.ordinalNumber(n, { unit: "hour" }) : y(n, t.length);
  },
  // Hour [1-24]
  k: function(a, t, e) {
    let n = a.getHours();
    return n === 0 && (n = 24), t === "ko" ? e.ordinalNumber(n, { unit: "hour" }) : y(n, t.length);
  },
  // Minute
  m: function(a, t, e) {
    return t === "mo" ? e.ordinalNumber(a.getMinutes(), { unit: "minute" }) : k.m(a, t);
  },
  // Second
  s: function(a, t, e) {
    return t === "so" ? e.ordinalNumber(a.getSeconds(), { unit: "second" }) : k.s(a, t);
  },
  // Fraction of second
  S: function(a, t) {
    return k.S(a, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(a, t, e) {
    const n = a.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (t) {
      case "X":
        return et(n);
      case "XXXX":
      case "XX":
        return $(n);
      case "XXXXX":
      case "XXX":
      default:
        return $(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(a, t, e) {
    const n = a.getTimezoneOffset();
    switch (t) {
      case "x":
        return et(n);
      case "xxxx":
      case "xx":
        return $(n);
      case "xxxxx":
      case "xxx":
      default:
        return $(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(a, t, e) {
    const n = a.getTimezoneOffset();
    switch (t) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + tt(n, ":");
      case "OOOO":
      default:
        return "GMT" + $(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(a, t, e) {
    const n = a.getTimezoneOffset();
    switch (t) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + tt(n, ":");
      case "zzzz":
      default:
        return "GMT" + $(n, ":");
    }
  },
  // Seconds timestamp
  t: function(a, t, e) {
    const n = Math.trunc(+a / 1e3);
    return y(n, t.length);
  },
  // Milliseconds timestamp
  T: function(a, t, e) {
    return y(+a, t.length);
  }
};
function tt(a, t = "") {
  const e = a > 0 ? "-" : "+", n = Math.abs(a), i = Math.trunc(n / 60), r = n % 60;
  return r === 0 ? e + String(i) : e + String(i) + t + y(r, 2);
}
function et(a, t) {
  return a % 60 === 0 ? (a > 0 ? "-" : "+") + y(Math.abs(a) / 60, 2) : $(a, t);
}
function $(a, t = "") {
  const e = a > 0 ? "-" : "+", n = Math.abs(a), i = y(Math.trunc(n / 60), 2), r = y(n % 60, 2);
  return e + i + t + r;
}
const nt = (a, t) => {
  switch (a) {
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
}, pt = (a, t) => {
  switch (a) {
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
}, fe = (a, t) => {
  const e = a.match(/(P+)(p+)?/) || [], n = e[1], i = e[2];
  if (!i)
    return nt(a, t);
  let r;
  switch (n) {
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
  return r.replace("{{date}}", nt(n, t)).replace("{{time}}", pt(i, t));
}, be = {
  p: pt,
  P: fe
}, pe = /^D+$/, me = /^Y+$/, ye = ["D", "DD", "YY", "YYYY"];
function xe(a) {
  return pe.test(a);
}
function we(a) {
  return me.test(a);
}
function ve(a, t, e) {
  const n = Te(a, t, e);
  if (console.warn(n), ye.includes(a)) throw new RangeError(n);
}
function Te(a, t, e) {
  const n = a[0] === "Y" ? "years" : "days of the month";
  return `Use \`${a.toLowerCase()}\` instead of \`${a}\` (in \`${t}\`) for formatting ${n} to the input \`${e}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const Pe = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, Ie = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, ke = /^'([^]*?)'?$/, Se = /''/g, Ce = /[a-zA-Z]/;
function S(a, t, e) {
  var h, d, u, g;
  const n = V(), i = n.locale ?? ce, r = n.firstWeekContainsDate ?? ((d = (h = n.locale) == null ? void 0 : h.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, s = n.weekStartsOn ?? ((g = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : g.weekStartsOn) ?? 0, o = I(a, e == null ? void 0 : e.in);
  if (!Et(o))
    throw new RangeError("Invalid time value");
  let l = t.match(Ie).map((f) => {
    const p = f[0];
    if (p === "p" || p === "P") {
      const m = be[p];
      return m(f, i.formatLong);
    }
    return f;
  }).join("").match(Pe).map((f) => {
    if (f === "''")
      return { isToken: !1, value: "'" };
    const p = f[0];
    if (p === "'")
      return { isToken: !1, value: $e(f) };
    if (Z[p])
      return { isToken: !0, value: f };
    if (p.match(Ce))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + p + "`"
      );
    return { isToken: !1, value: f };
  });
  i.localize.preprocessor && (l = i.localize.preprocessor(o, l));
  const c = {
    firstWeekContainsDate: r,
    weekStartsOn: s,
    locale: i
  };
  return l.map((f) => {
    if (!f.isToken) return f.value;
    const p = f.value;
    (we(p) || xe(p)) && ve(p, t, String(a));
    const m = Z[p[0]];
    return m(o, p, i.localize, c);
  }).join("");
}
function $e(a) {
  const t = a.match(ke);
  return t ? t[1].replace(Se, "'") : a;
}
function Ee(a, t) {
  return J(
    P(a, a),
    G(a)
  );
}
function Me(a, t) {
  return J(
    a,
    ut(G(a), 1),
    t
  );
}
function De(a, t, e) {
  return ut(a, -1, e);
}
function Le(a, t) {
  return J(
    P(a, a),
    De(G(a))
  );
}
function Ae(a) {
  try {
    let t = orca.state.settings[ct.JournalDateFormat];
    if ((!t || typeof t != "string") && (t = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), Ee(a))
      return "今天";
    if (Le(a))
      return "昨天";
    if (Me(a))
      return "明天";
    try {
      if (t.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const n = a.getDay(), r = ["日", "一", "二", "三", "四", "五", "六"][n], s = t.replace(/E/g, r);
          return S(a, s);
        } else
          return S(a, t);
      else
        return S(a, t);
    } catch {
      const n = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of n)
        try {
          return S(a, i);
        } catch {
          continue;
        }
      return a.toLocaleDateString();
    }
  } catch (t) {
    return console.warn("日期格式化失败:", t), a.toLocaleDateString();
  }
}
function X(a) {
  try {
    const t = Oe(a, "_repr");
    if (!t || t.type !== dt.JSON || !t.value)
      return null;
    const e = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
    return e.type === "journal" && e.date ? new Date(e.date) : null;
  } catch (t) {
    return console.warn("提取日期块信息失败:", t), null;
  }
}
function Oe(a, t) {
  return !a.properties || !Array.isArray(a.properties) ? null : a.properties.find((e) => e.name === t);
}
function Be(a, t, e, n) {
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
  const r = document.createElement("i");
  r.className = t, r.style.cssText = `
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
  `, i.appendChild(r), i.appendChild(s), e && e.trim() !== "") {
    const o = document.createElement("span");
    o.textContent = e, o.style.cssText = `
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
    o.preventDefault(), o.stopPropagation(), n();
    const l = i.closest('.orca-context-menu, .context-menu, [role="menu"]');
    l && (l.style.display = "none", l.remove());
  }), i;
}
function it(a) {
  a && a.parentNode && a.parentNode.removeChild(a);
}
function We(a, t) {
  const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
  if (e) {
    const n = parseInt(e[1], 16), i = parseInt(e[2], 16), r = parseInt(e[3], 16);
    return `rgba(${n}, ${i}, ${r}, ${t})`;
  }
  return `rgba(200, 200, 200, ${t})`;
}
function F() {
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
function Ne(a, t, e = 200) {
  const n = t ? e : 400, i = 40, r = window.innerWidth - n, s = window.innerHeight - i;
  return {
    x: Math.max(0, Math.min(a.x, r)),
    y: Math.max(0, Math.min(a.y, s))
  };
}
function ze(a) {
  const t = F();
  return {
    isVerticalMode: a.isVerticalMode ?? t.isVerticalMode,
    verticalWidth: a.verticalWidth ?? t.verticalWidth,
    verticalPosition: a.verticalPosition ?? t.verticalPosition,
    horizontalPosition: a.horizontalPosition ?? t.horizontalPosition,
    isSidebarAlignmentEnabled: a.isSidebarAlignmentEnabled ?? t.isSidebarAlignmentEnabled,
    isFloatingWindowVisible: a.isFloatingWindowVisible ?? t.isFloatingWindowVisible,
    showBlockTypeIcons: a.showBlockTypeIcons ?? t.showBlockTypeIcons,
    showInHeadbar: a.showInHeadbar ?? t.showInHeadbar
  };
}
function z(a, t, e) {
  return a ? { ...t } : { ...e };
}
function Fe(a, t, e, n) {
  return t ? {
    verticalPosition: { ...a },
    horizontalPosition: { ...n }
  } : {
    verticalPosition: { ...e },
    horizontalPosition: { ...a }
  };
}
function Re(a) {
  return `布局模式: ${a.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${a.verticalWidth}px, 垂直位置: (${a.verticalPosition.x}, ${a.verticalPosition.y}), 水平位置: (${a.horizontalPosition.x}, ${a.horizontalPosition.y})`;
}
function at(a, t) {
  return `位置已${t ? "垂直" : "水平"}模式 (${a.x}, ${a.y})`;
}
function qe(a, t, e, n) {
  let i = e ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", r = e ? "#ffffff" : "#333", s = "normal";
  return a.color && (i = n(a.color, "background"), r = n(a.color, "text"), s = "600"), t ? `
    background: ${i};
    color: ${r};
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
    color: ${r};
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
function Ve() {
  const a = document.createElement("div");
  return a.style.cssText = `
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    gap: 6px;
  `, a;
}
function _e(a) {
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
  `, a.startsWith("ti ti-")) {
    const e = document.createElement("i");
    e.className = a, t.appendChild(e);
  } else
    t.textContent = a;
  return t;
}
function He(a) {
  const t = document.createElement("div");
  t.style.cssText = `
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
  const e = document.createElement("div");
  return e.style.cssText = `
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(to right, transparent, var(--orca-bg-color, #ffffff));
    pointer-events: none;
    z-index: 1;
  `, t.appendChild(e), t.textContent = a, t;
}
function Ue() {
  const a = document.createElement("span");
  return a.textContent = "📌", a.style.cssText = `
    flex-shrink: 0;
    font-size: 10px;
    opacity: 0.8;
  `, a;
}
function Ye(a) {
  let t = a.title;
  return a.isPinned && (t += " (已固定)"), t;
}
function je() {
  return `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    cursor: move;
    z-index: 9998;
    opacity: 0;
    background-color: transparent;
    -webkit-app-region: no-drag;
    app-region: no-drag;
    pointer-events: auto;
  `;
}
function Xe() {
  return `
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
    pointer-events: auto;
  `;
}
function Ge() {
  return `
    .drag-handle:hover {
      opacity: 0.3;
      transition: opacity 0.2s ease;
    }
  `;
}
function Je() {
  return `
    .resize-handle:hover {
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }
    
    .resize-handle.dragging {
      opacity: 1;
    }
  `;
}
function Qe() {
  return `
    .resizing, .dragging {
      user-select: none !important;
      -webkit-user-select: none !important;
    }
    
    body.resizing {
      cursor: nwse-resize !important;
    }
    
    body.dragging {
      cursor: move !important;
    }
  `;
}
function Ke() {
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
function rt(a = "primary") {
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
function Ze() {
  return `
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    -webkit-appearance: none;
  `;
}
function tn(a, t, e, n) {
  return a ? `
    position: fixed;
    top: ${t.y}px;
    left: ${t.x}px;
    z-index: 300;
    display: flex;
    flex-direction: column;
    gap: 4px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    background: ${e};
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
    top: ${t.y}px;
    left: ${t.x}px;
    z-index: 300;
    display: flex;
    gap: 4px;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    background: ${e};
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
function en(a) {
  for (let t = a.length - 1; t >= 0; t--)
    if (!a[t].isPinned)
      return t;
  return -1;
}
function nn(a) {
  return [...a].sort((t, e) => t.isPinned && !e.isPinned ? -1 : !t.isPinned && e.isPinned ? 1 : 0);
}
function an(a, t, e, n) {
  return t ? {
    x: a.x,
    y: a.y,
    width: e,
    height: n
  } : {
    x: a.x,
    y: a.y,
    width: Math.min(800, window.innerWidth - a.x - 10),
    height: 28
  };
}
function rn(a, t, e, n) {
  const i = an(a, t, e, n);
  let r = a.x, s = a.y;
  return i.x < 0 ? r = 0 : i.x + i.width > window.innerWidth && (r = window.innerWidth - i.width), i.y < 0 ? s = 0 : i.y + i.height > window.innerHeight && (s = window.innerHeight - i.height), { x: r, y: s };
}
function st(a, t, e = !1) {
  let n = null;
  const i = (...r) => {
    const s = e && !n;
    n && clearTimeout(n), n = window.setTimeout(() => {
      n = null, e || a(...r);
    }, t), s && a(...r);
  };
  return i.cancel = () => {
    n && (clearTimeout(n), n = null);
  }, i;
}
function sn(a, t) {
  const e = parseInt(a.slice(1, 3), 16) / 255, n = parseInt(a.slice(3, 5), 16) / 255, i = parseInt(a.slice(5, 7), 16) / 255, [r, s, o] = on(e, n, i);
  return t === "background" ? `oklch(${Math.max(0.1, r * 0.3)} ${Math.min(0.4, s * 1.2)} ${o})` : `oklch(${Math.min(0.9, r * 1.5)} ${Math.max(0.05, s * 0.6)} ${o})`;
}
function on(a, t, e) {
  const n = a <= 0.04045 ? a / 12.92 : Math.pow((a + 0.055) / 1.055, 2.4), i = t <= 0.04045 ? t / 12.92 : Math.pow((t + 0.055) / 1.055, 2.4), r = e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4), s = n * 0.4124564 + i * 0.3575761 + r * 0.1804375, o = n * 0.2126729 + i * 0.7151522 + r * 0.072175, l = n * 0.0193339 + i * 0.119192 + r * 0.9503041, c = Math.cbrt(0.8189330101 * s + 0.3618667424 * o - 0.1288597137 * l), h = Math.cbrt(0.0329845436 * s + 0.9293118715 * o + 0.0361456387 * l), d = Math.cbrt(0.0482003018 * s + 0.2643662691 * o + 0.633851707 * l), u = c, g = Math.sqrt(h * h + d * d), f = Math.atan2(d, h) * (180 / Math.PI);
  return [u, g, f];
}
var N = /* @__PURE__ */ ((a) => (a[a.ERROR = 0] = "ERROR", a[a.WARN = 1] = "WARN", a[a.INFO = 2] = "INFO", a[a.DEBUG = 3] = "DEBUG", a[a.VERBOSE = 4] = "VERBOSE", a))(N || {});
const ln = {
  level: 2,
  enableConsole: !0,
  enableStorage: !1,
  maxStorageEntries: 1e3,
  enableTimestamps: !0,
  enableColors: !0,
  prefix: "[OrcaTabs]"
};
class _ {
  constructor(t = {}) {
    b(this, "config");
    b(this, "storage", []);
    b(this, "colors", {
      0: "#ff4444",
      1: "#ffaa00",
      2: "#00aaff",
      3: "#00ff88",
      4: "#888888"
    });
    this.config = { ...ln, ...t };
  }
  /**
   * 更新配置
   */
  updateConfig(t) {
    this.config = { ...this.config, ...t };
  }
  /**
   * 记录日志
   */
  log(t, e, n, i) {
    if (t > this.config.level) return;
    const r = {
      timestamp: Date.now(),
      level: t,
      message: e,
      data: n,
      source: i
    };
    this.config.enableConsole && this.logToConsole(r), this.config.enableStorage && this.logToStorage(r);
  }
  /**
   * 输出到控制台
   */
  logToConsole(t) {
    const { timestamp: e, level: n, message: i, data: r, source: s } = t;
    N[n];
    const o = this.config.enableTimestamps ? new Date(e).toLocaleTimeString() : "", l = `${this.config.prefix}${o ? ` [${o}]` : ""}`, c = s ? ` [${s}]` : "", h = `${l}${c} ${i}`;
    if (this.config.enableColors && typeof window < "u") {
      const d = this.colors[n];
      console.log(`%c${h}`, `color: ${d}`, r || "");
    } else
      this.getConsoleMethod(n)(h, r || "");
  }
  /**
   * 获取控制台方法
   */
  getConsoleMethod(t) {
    switch (t) {
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
  logToStorage(t) {
    this.storage.push(t), this.storage.length > this.config.maxStorageEntries && (this.storage = this.storage.slice(-this.config.maxStorageEntries));
  }
  /**
   * 错误日志
   */
  error(t, e, n) {
    this.log(0, t, e, n);
  }
  /**
   * 警告日志
   */
  warn(t, e, n) {
    this.log(1, t, e, n);
  }
  /**
   * 信息日志
   */
  info(t, e, n) {
    this.log(2, t, e, n);
  }
  /**
   * 调试日志
   */
  debug(t, e, n) {
    this.log(3, t, e, n);
  }
  /**
   * 详细日志
   */
  verbose(t, e, n) {
    this.log(4, t, e, n);
  }
  /**
   * 获取存储的日志
   */
  getLogs(t, e) {
    let n = this.storage;
    return t !== void 0 && (n = n.filter((i) => i.level === t)), e !== void 0 && (n = n.slice(-e)), n;
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
  exportLogs(t = "json") {
    return t === "json" ? JSON.stringify(this.storage, null, 2) : this.storage.map((e) => {
      const n = new Date(e.timestamp).toLocaleString(), i = N[e.level], r = e.source ? ` [${e.source}]` : "", s = e.data ? ` ${JSON.stringify(e.data)}` : "";
      return `[${n}] ${i}${r}: ${e.message}${s}`;
    }).join(`
`);
  }
  /**
   * 性能计时器
   */
  time(t) {
    console.time(`${this.config.prefix} ${t}`);
  }
  /**
   * 结束性能计时
   */
  timeEnd(t) {
    console.timeEnd(`${this.config.prefix} ${t}`);
  }
  /**
   * 性能标记
   */
  mark(t) {
    typeof performance < "u" && performance.mark && performance.mark(`${this.config.prefix}-${t}`);
  }
  /**
   * 性能测量
   */
  measure(t, e, n) {
    if (typeof performance < "u" && performance.measure) {
      const i = `${this.config.prefix}-${e}`, r = n ? `${this.config.prefix}-${n}` : void 0;
      performance.measure(`${this.config.prefix}-${t}`, i, r);
    }
  }
  /**
   * 创建子日志器
   */
  createChild(t) {
    const e = new _(this.config);
    return e.config.prefix = `${this.config.prefix}[${t}]`, e;
  }
}
new _();
function cn(a, t, e, n) {
  const i = document.createElement("div");
  i.className = "orca-tabs-container";
  const r = tn(a, t, n, e);
  return i.style.cssText = r, i;
}
function dn(a, t, e) {
  const n = document.createElement("div");
  n.className = "width-adjustment-dialog";
  const i = Ke();
  n.style.cssText = i;
  const r = document.createElement("div");
  r.textContent = "调整面板宽度", r.style.cssText = `
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  `;
  const s = document.createElement("div");
  s.textContent = `当前面板宽度: ${a}px`, s.style.cssText = `
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  `;
  const o = document.createElement("div");
  o.style.cssText = "margin-bottom: 16px;";
  const l = document.createElement("div");
  l.textContent = "宽度 (120px - 400px)", l.style.cssText = `
    font-size: 14px;
    margin-bottom: 8px;
    color: #333;
  `;
  const c = document.createElement("input");
  c.type = "range", c.min = "120", c.max = "400", c.value = a.toString(), c.style.cssText = Ze();
  const h = (p) => {
    const m = (p - 120) / 280 * 100;
    c.style.background = `
      linear-gradient(to right, #007acc 0%, #007acc ${m}%, #ddd ${m}%, #ddd 100%)
    `;
  };
  h(a);
  const d = document.createElement("div");
  d.textContent = `${a}px`, d.style.cssText = `
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #007acc;
    margin-top: 8px;
  `, c.addEventListener("input", (p) => {
    const m = parseInt(p.target.value);
    d.textContent = `${m}px`, h(m), t(m);
  });
  const u = document.createElement("div");
  u.style.cssText = `
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  `;
  const g = document.createElement("button");
  g.textContent = "取消", g.style.cssText = rt("secondary"), g.addEventListener("click", () => {
    e(), it(n);
  });
  const f = document.createElement("button");
  return f.textContent = "确认", f.style.cssText = rt("primary"), f.addEventListener("click", () => {
    it(n);
  }), o.appendChild(l), o.appendChild(c), o.appendChild(d), u.appendChild(g), u.appendChild(f), n.appendChild(r), n.appendChild(s), n.appendChild(o), n.appendChild(u), n;
}
function hn() {
  const a = document.querySelector("section#main");
  if (!a)
    return console.warn("❌ 未找到 section#main"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const t = a.querySelector(".orca-panels-row");
  if (!t)
    return console.warn("❌ 未找到 .orca-panels-row"), { panelIds: [], activePanelId: null, panelCount: 0 };
  const e = t.querySelectorAll('.orca-panel:not([data-menu-panel="true"])'), n = [];
  let i = null;
  return e.forEach((r) => {
    const s = r.getAttribute("data-panel-id");
    s && (n.push(s), r.classList.contains("active") && (i = s));
  }), {
    panelIds: n,
    activePanelId: i,
    panelCount: n.length
  };
}
function un(a, t) {
  return a.length !== t.length ? !0 : !a.every((e, n) => e === t[n]);
}
function gn() {
  const a = document.querySelector(".orca-sidebar");
  return a ? a.getBoundingClientRect().width : 0;
}
function fn() {
  const a = document.querySelector(".orca-sidebar");
  return a ? a.getBoundingClientRect().width > 0 : !1;
}
function bn() {
  const a = document.querySelector("div#app"), t = (a == null ? void 0 : a.classList.contains("sidebar-closed")) || !1, e = (a == null ? void 0 : a.classList.contains("sidebar-opened")) || !1, n = gn(), i = fn();
  return {
    isClosed: t,
    isOpened: e,
    isVisible: i,
    width: n
  };
}
function pn(a, t, e, n, i = 0) {
  return e ? {
    x: i,
    y: a.y
  } : n ? {
    x: t + i,
    y: a.y
  } : null;
}
function mn(a, t, e = 0) {
  return !t.isVisible || t.width === 0 ? null : pn(
    a,
    t.width,
    t.isClosed,
    t.isOpened,
    e
  );
}
let B;
class yn {
  constructor() {
    b(this, "firstPanelTabs", []);
    // 只存储第一个面板的标签数据
    b(this, "currentPanelId", "");
    b(this, "panelIds", []);
    // 所有面板ID列表
    b(this, "currentPanelIndex", 0);
    // 当前面板索引
    b(this, "storageService", new Pt());
    // 存储服务实例
    // 日志管理器
    b(this, "logManager", new _({
      level: typeof window < "u" && window.DEBUG_ORCA_TABS_VERBOSE === !0 ? N.VERBOSE : N.INFO,
      enableConsole: typeof window < "u" && window.DEBUG_ORCA_TABS !== !1,
      prefix: "[OrcaTabsPlugin]"
    }));
    b(this, "tabContainer", null);
    b(this, "cycleSwitcher", null);
    b(this, "isDragging", !1);
    b(this, "dragStartX", 0);
    b(this, "dragStartY", 0);
    b(this, "maxTabs", 10);
    // 默认值，会从设置中读取
    b(this, "homePageBlockId", null);
    // 主页块ID，从设置中读取
    b(this, "position", { x: 50, y: 50 });
    b(this, "monitoringInterval", null);
    b(this, "globalEventListener", null);
    // 统一的全局事件监听器
    b(this, "updateDebounceTimer", null);
    // 防抖计时器
    b(this, "lastUpdateTime", 0);
    // 上次更新时间
    b(this, "isUpdating", !1);
    // 是否正在更新
    b(this, "isInitialized", !1);
    // 是否已完成初始化
    b(this, "isVerticalMode", !1);
    // 垂直模式标志
    b(this, "verticalWidth", 200);
    // 垂直模式下的窗口宽度
    b(this, "verticalPosition", { x: 20, y: 20 });
    // 垂直模式下的位置
    b(this, "horizontalPosition", { x: 20, y: 20 });
    // 水平模式下的位置
    b(this, "isResizing", !1);
    // 是否正在调整大小
    b(this, "resizeHandle", null);
    // 调整大小的拖拽手柄
    b(this, "isSidebarAlignmentEnabled", !1);
    // 侧边栏对齐功能是否启用
    b(this, "sidebarAlignmentObserver", null);
    // 侧边栏状态监听器
    b(this, "lastSidebarState", null);
    // 上次检测到的侧边栏状态
    b(this, "isFloatingWindowVisible", !0);
    // 浮窗是否可见
    b(this, "sidebarDebounceTimer", null);
    // 防抖计时器
    b(this, "showBlockTypeIcons", !0);
    // 是否显示块类型图标
    b(this, "showInHeadbar", !0);
    // 是否在顶部栏显示按钮
    // 拖拽状态管理
    b(this, "draggingTab", null);
    // 当前正在拖拽的标签
    b(this, "dragEndListener", null);
    // 全局拖拽结束监听器
    b(this, "swapDebounceTimer", null);
    // 拖拽交换防抖计时器
    b(this, "lastSwapTarget", null);
    // 上次交换的目标标签ID，防止重复交换
    b(this, "dragOverTimer", null);
    // 拖拽悬停计时器
    b(this, "isDragOverActive", !1);
    // 是否正在拖拽悬停状态
    b(this, "themeChangeListener", null);
    // 主题变化监听器
    b(this, "lastPanelDiscoveryTime", 0);
    // 上次面板发现时间
    b(this, "panelDiscoveryCache", null);
    // 面板发现缓存
    b(this, "scrollListener", null);
    // 滚动监听器
    // 已关闭标签页跟踪
    b(this, "closedTabs", /* @__PURE__ */ new Set());
    // 已关闭的标签页blockId集合
    b(this, "lastActiveBlockId", null);
    // 快捷键相关
    b(this, "hoveredBlockId", null);
    // 当前鼠标悬停的块ID
    b(this, "currentContextBlockRefId", null);
    // 防抖函数实例
    b(this, "normalDebounce", st(async () => {
      await this.updateTabsUI();
    }, 100));
    b(this, "draggingDebounce", st(async () => {
      await this.updateTabsUI();
    }, 200));
  }
  // 调试日志（开发模式）
  log(...t) {
    this.logManager.info(t.join(" "));
  }
  // 详细日志（仅在需要时启用）
  verboseLog(...t) {
    this.logManager.verbose(t.join(" "));
  }
  warn(...t) {
    this.logManager.warn(t.join(" "));
  }
  error(...t) {
    this.logManager.error(t.join(" "));
  }
  // 当前右键菜单对应的块引用ID
  async init() {
    try {
      this.maxTabs = orca.state.settings[ct.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFloatingWindowVisibility(), this.registerHeadbarButton(), this.discoverPanels(), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization(), await this.restoreFirstPanelTabs(), await this.restoreClosedTabs(), this.firstPanelTabs.length > 0 ? this.log("检测到持久化数据，使用固化的标签页状态") : (this.log("首次使用，扫描第一个面板创建标签页"), await this.scanFirstPanel()), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.isInitialized = !0, this.log("✅ 插件初始化完成");
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
   * 设置滚动监听器
   */
  setupScrollListener() {
    this.scrollListener && (this.scrollListener(), this.scrollListener = null);
    let t = null;
    const e = () => {
      t && clearTimeout(t), t = setTimeout(() => {
        const i = this.getCurrentActiveTab();
        i && this.recordScrollPosition(i);
      }, 300);
    }, n = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    n.forEach((i) => {
      i.addEventListener("scroll", e, { passive: !0 });
    }), this.scrollListener = () => {
      n.forEach((i) => {
        i.removeEventListener("scroll", e);
      }), t && clearTimeout(t);
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
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tab").forEach((e) => {
      e.removeAttribute("data-dragging"), e.removeAttribute("data-drag-over"), e.classList.remove("dragging", "drag-over");
    }), this.tabContainer.removeAttribute("data-dragging"));
  }
  /**
   * 添加拖拽悬停效果（优化版）
   */
  addDragOverEffect(t) {
    t.getAttribute("data-drag-over") !== "true" && (t.setAttribute("data-drag-over", "true"), t.classList.add("drag-over"), this.dragOverTimer && clearTimeout(this.dragOverTimer));
  }
  /**
   * 移除拖拽悬停效果（优化版）
   */
  removeDragOverEffect(t) {
    t.getAttribute("data-drag-over") === "true" && (t.removeAttribute("data-drag-over"), t.classList.remove("drag-over"), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null));
  }
  /**
   * 防抖的标签交换函数（改进版）
   */
  async debouncedSwapTab(t, e) {
    this.lastSwapTarget !== t.blockId && (this.swapDebounceTimer && clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = window.setTimeout(async () => {
      await this.swapTab(t, e), this.lastSwapTarget = t.blockId;
    }, 16));
  }
  /**
   * 交换两个标签的位置（改进版）
   */
  async swapTab(t, e) {
    if (this.currentPanelIndex !== 0) {
      this.log("只有第一个面板支持拖拽排序");
      return;
    }
    const n = this.firstPanelTabs.findIndex((o) => o.blockId === t.blockId), i = this.firstPanelTabs.findIndex((o) => o.blockId === e.blockId);
    if (n === -1 || i === -1) {
      this.warn("无法找到目标标签或拖拽标签");
      return;
    }
    if (n === i) {
      this.log("目标标签和拖拽标签相同，跳过交换");
      return;
    }
    this.log(`🔄 交换标签: ${e.title} (${i}) -> ${t.title} (${n})`);
    const r = this.firstPanelTabs[i], s = this.firstPanelTabs[n];
    this.firstPanelTabs[n] = r, this.firstPanelTabs[i] = s, this.firstPanelTabs.forEach((o, l) => {
      o.order = l;
    }), this.sortTabsByPinStatus(), await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI(), this.log(`✅ 标签交换完成: ${r.title} -> 位置 ${n}`);
  }
  /**
   * 发现所有面板
   */
  discoverPanels() {
    const t = Date.now();
    if (t - this.lastPanelDiscoveryTime < 1e3 && this.panelDiscoveryCache && t - this.panelDiscoveryCache.timestamp < 1e3) {
      this.panelIds = [...this.panelDiscoveryCache.panelIds], this.verboseLog("📋 使用面板发现缓存，面板ID列表:", this.panelIds);
      return;
    }
    this.log("🔍 开始发现面板..."), this.lastPanelDiscoveryTime = t;
    const { panelIds: e, activePanelId: n, panelCount: i } = hn();
    this.log(`🎯 最终发现 ${i} 个面板，面板ID列表:`, e), this.log(`🎯 活动面板: ${n || "无"}`), this.panelIds = e, n && n !== this.currentPanelId && (this.currentPanelId = n, this.currentPanelIndex = e.indexOf(n), this.log(`🔄 活动面板已更新: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`)), this.panelDiscoveryCache = {
      panelIds: [...e],
      timestamp: t
    }, i === 1 ? this.log("ℹ️ 只有一个面板，不会显示切换按钮") : i > 1 && this.log(`✅ 发现 ${i} 个面板，将创建循环切换器`);
  }
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
   * 扫描第一个面板的标签页（只读取当前激活的页面）
   */
  async scanFirstPanel() {
    if (this.panelIds.length === 0) return;
    const t = this.panelIds[0], e = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!e) return;
    const n = e.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) {
      this.log("第一个面板中没有找到激活的块编辑器");
      return;
    }
    const i = n.getAttribute("data-block-id");
    if (!i) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    const r = await this.getTabInfo(i, t, 0);
    r ? (this.firstPanelTabs = [r], await this.saveFirstPanelTabs(), await this.updateTabsUI()) : this.log("无法获取激活页面的标签信息");
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
    this.firstPanelTabs = nn(this.firstPanelTabs);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    return en(this.firstPanelTabs);
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(t) {
    if (!t || t.length === 0) return "";
    let e = "";
    for (const n of t)
      if (n.t === "t" && n.v)
        e += n.v;
      else if (n.t === "r")
        n.u ? n.v ? e += n.v : e += n.u : n.a ? e += `[[${n.a}]]` : n.v && (typeof n.v == "number" || typeof n.v == "string") ? e += `[[块${n.v}]]` : n.v && (e += n.v);
      else if (n.t === "br" && n.v)
        try {
          const i = n.v.toString(), r = await this.getTabInfo(i, "", 0);
          r && r.title ? e += r.title : e += `[[块${i}]]`;
        } catch (i) {
          this.warn("处理块引用失败:", i), e += "[[块引用]]";
        }
      else n.t && n.t.includes("math") && n.v ? e += `[数学: ${n.v}]` : (n.t && n.t.includes("code") && n.v || n.v && typeof n.v == "string") && (e += n.v);
    return e.trim();
  }
  /**
   * 检查content是否需要拼接多段
   */
  needsContentConcatenation(t) {
    if (!Array.isArray(t) || t.length === 0)
      return !1;
    let e = !1, n = !1, i = !1;
    for (const r of t)
      r && typeof r == "object" && (r.t === "r" && r.v ? (i = !0, r.a || (e = !0)) : r.t === "t" && r.v && (n = !0));
    return e || n && i;
  }
  /**
   * 检查content是否主要是文本+块引用的组合
   */
  isTextWithBlockRefs(t) {
    if (!Array.isArray(t) || t.length === 0)
      return !1;
    let e = 0, n = 0;
    for (const i of t)
      i && typeof i == "object" && (i.t === "text" && i.v ? e++ : i.t === "ref" && i.v && n++);
    return e > 0 && n > 0 && e >= n;
  }
  /**
   * 检测块类型
   */
  async detectBlockType(t) {
    try {
      if (X(t))
        return "journal";
      if (t["data-type"]) {
        const i = t["data-type"];
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
      if (t.aliases && t.aliases.length > 0) {
        this.log(`🏷️ 检测到别名块: aliases=${JSON.stringify(t.aliases)}`);
        const i = t.aliases[0];
        if (i)
          try {
            const r = this.findProperty(t, "_hide");
            return r && r.value ? (this.log(`📄 通过 _hide 属性确认为页面: ${i} (hide=${r.value})`), "page") : (this.log(`🏷️ 通过 _hide 属性确认为标签: ${i} (hide=${r ? r.value : "undefined"})`), "tag");
          } catch (r) {
            return this.warn("使用 API 检测标签失败，回退到文本分析:", r), i.includes("#") || i.includes("@") || i.length < 20 && i.match(/^[a-zA-Z0-9_-]+$/) || i.match(/^[a-z]+$/i) ? "tag" : "page";
          }
        return "alias";
      }
      this.verboseLog(`🔍 块信息调试: blockId=${t.id}, aliases=${t.aliases ? JSON.stringify(t.aliases) : "undefined"}, content=${t.content ? "exists" : "undefined"}, text=${t.text ? "exists" : "undefined"}`);
      const n = this.findProperty(t, "_repr");
      if (n && n.type === dt.JSON && n.value)
        try {
          const i = typeof n.value == "string" ? JSON.parse(n.value) : n.value;
          if (i.type)
            return i.type;
        } catch {
        }
      if (t.content && Array.isArray(t.content)) {
        if (t.content.some(
          (l) => l && typeof l == "object" && l.type === "code"
        ))
          return "code";
        if (t.content.some(
          (l) => l && typeof l == "object" && l.type === "table"
        ))
          return "table";
        if (t.content.some(
          (l) => l && typeof l == "object" && l.type === "image"
        ))
          return "image";
        if (t.content.some(
          (l) => l && typeof l == "object" && l.type === "link"
        ))
          return "link";
      }
      if (t.text) {
        const i = t.text.trim();
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
    } catch (e) {
      return this.warn("检测块类型失败:", e), "text";
    }
  }
  /**
   * 根据块类型获取图标
   */
  getBlockTypeIcon(t) {
    const e = {
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
    }, n = e[t] || e.default;
    return this.verboseLog(`🎨 为块类型 "${t}" 分配图标: ${n}`), n;
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
  getBlockTextTitle(t) {
    return t.text ? t.text.substring(0, 50) : `块 ${t.id}`;
  }
  /**
   * 使用指定模式格式化日期
   */
  formatDateWithPattern(t, e) {
    try {
      if (e.includes("E"))
        if ((orca.state.locale || "zh-CN").startsWith("zh")) {
          const i = t.getDay(), s = ["日", "一", "二", "三", "四", "五", "六"][i], o = e.replace(/E/g, s);
          return S(t, o);
        } else
          return S(t, e);
      else
        return S(t, e);
    } catch {
      const i = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const r of i)
        try {
          return S(t, r);
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
    return !t.properties || !Array.isArray(t.properties) ? null : t.properties.find((n) => n.name === e);
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
    ].some((n) => n.test(t));
  }
  async getTabInfo(t, e, n) {
    try {
      const i = await orca.invokeBackend("get-block", parseInt(t));
      if (!i) return null;
      let r = "", s = "", o = "", l = !1, c = "";
      c = await this.detectBlockType(i), this.log(`🔍 检测到块类型: ${c} (块ID: ${t})`), i.aliases && i.aliases.length > 0 && this.log(`🏷️ 别名块详细信息: blockId=${t}, aliases=${JSON.stringify(i.aliases)}, 检测到的类型=${c}`);
      try {
        const h = X(i);
        if (h)
          l = !0, r = Ae(h), console.log(`📅 识别为日期块: ${r}, 原始日期: ${h.toISOString()}`);
        else if (i.aliases && i.aliases.length > 0)
          r = i.aliases[0];
        else if (i.content && i.content.length > 0)
          this.needsContentConcatenation(i.content) && i.text ? r = i.text.substring(0, 50) : r = (await this.extractTextFromContent(i.content)).substring(0, 50);
        else if (i.text) {
          let d = i.text.substring(0, 50);
          if (c === "list") {
            const u = i.text.split(`
`)[0].trim();
            u && (d = u.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, ""));
          } else if (c === "table") {
            const u = i.text.split(`
`)[0].trim();
            u && (d = u.replace(/\|/g, "").trim());
          } else if (c === "quote") {
            const u = i.text.split(`
`)[0].trim();
            u && (d = u.replace(/^>\s+/, ""));
          } else if (c === "image") {
            const u = i.text.match(/caption:\s*(.+)/i);
            u && u[1] ? d = u[1].trim() : d = i.text.trim();
          }
          r = d;
        } else
          r = `块 ${t}`, console.log(`❌ 没有找到合适的标题，使用块ID: ${t}`);
      } catch (h) {
        this.warn("获取标题失败:", h), r = `块 ${t}`;
      }
      try {
        const h = this.findProperty(i, "_color"), d = this.findProperty(i, "_icon");
        h && h.type === 1 && (s = h.value), d && d.type === 1 ? (o = d.value, this.log(`🎨 使用用户自定义图标: ${o} (块ID: ${t})`)) : (this.showBlockTypeIcons || c === "journal") && (o = this.getBlockTypeIcon(c), this.log(`🎨 使用块类型图标: ${o} (块类型: ${c}, 块ID: ${t})`));
      } catch (h) {
        this.warn("获取属性失败:", h), o = this.getBlockTypeIcon(c);
      }
      return {
        blockId: t,
        panelId: e,
        title: r || `块 ${t}`,
        color: s,
        icon: o,
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
  async createTabsUI() {
    if (!this.isFloatingWindowVisible) {
      this.log("🙈 浮窗已隐藏，跳过UI创建");
      return;
    }
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), this.log("📱 使用自动切换模式，不创建面板切换器");
    const t = orca.state.themeMode === "dark", e = "rgba(255, 255, 255, 0.1)", n = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer = cn(
      this.isVerticalMode,
      n,
      this.verticalWidth,
      e
    ), this.tabContainer.addEventListener("mousedown", (r) => {
      const s = r.target;
      s.closest(".orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && r.stopPropagation();
    }), this.tabContainer.addEventListener("click", (r) => {
      const s = r.target;
      s.closest(".orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && (r.stopPropagation(), console.log(`🖱️ 标签栏容器点击事件被阻止: ${s.className}`));
    });
    const i = document.createElement("div");
    i.className = "drag-handle", i.style.cssText = je(), i.innerHTML = "⋮⋮", i.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(i), document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && this.enableDragResize(), await this.updateTabsUI();
  }
  /**
   * 添加拖拽相关的CSS样式
   */
  addDragStyles() {
    if (document.getElementById("orca-tabs-drag-styles"))
      return;
    const t = document.createElement("style");
    t.id = "orca-tabs-drag-styles", t.textContent = `
      ${Ge()}
      ${Je()}
      ${Qe()}
      /* 拖拽中的标签样式 */
      .orca-tab[data-dragging="true"] {
        border: 2px solid #ef4444 !important;
        margin: 0 12px !important;
        transform: scale(1.05) rotate(2deg) !important;
        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4) !important;
        z-index: 1000 !important;
        position: relative !important;
        opacity: 0.8 !important;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05)) !important;
      }

      /* 拖拽悬停目标样式 */
      .orca-tab[data-drag-over="true"] {
        border: 2px solid #3b82f6 !important;
        transform: scale(1.02) !important;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05)) !important;
        position: relative !important;
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
        background: rgba(255, 255, 255, 0.15) !important;
        border: 2px dashed rgba(239, 68, 68, 0.4) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
      }

      /* 拖拽时的过渡动画 */
      .orca-tab {
        transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        will-change: transform, box-shadow, background, opacity, border;
      }

      /* 未选中标签的基础样式 */
      .orca-tab {
        opacity: 0.85;
        border: 1px solid transparent;
      }

      /* 选中/悬停的标签样式 */
      .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]) {
        opacity: 1 !important;
        border: 1px solid rgba(0, 0, 0, 0.2) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        transform: scale(1.02) !important;
        transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的选中样式 */
      .dark .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]) {
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1) !important;
      }

      /* 点击/激活状态的标签样式 */
      .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]) {
        opacity: 1 !important;
        border: 1px solid rgba(0, 0, 0, 0.3) !important;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2) !important;
        transform: scale(0.98) !important;
        transition: all 0.08s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
      }

      /* 暗色模式下的点击样式 */
      .dark .orca-tab:active:not([data-dragging="true"]):not([data-drag-over="true"]) {
        border: 1px solid rgba(255, 255, 255, 0.4) !important;
        box-shadow: 0 1px 4px rgba(255, 255, 255, 0.2) !important;
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
        cursor: pointer !important;
      }

      .orca-tab[draggable="true"]:active {
        cursor: pointer !important;
      }

      /* 拖拽时的标签容器动画 */
      .orca-tabs-container[data-dragging="true"] .orca-tab:not([data-dragging="true"]) {
        transition: all 0.2s ease !important;
      }

      /* 拖拽完成后的回弹效果 */
      .orca-tab[data-dragging="true"] {
        animation: dragBounce 0.3s ease-out;
      }

      @keyframes dragBounce {
        0% {
          transform: scale(1.05) rotate(2deg);
        }
        50% {
          transform: scale(1.08) rotate(1deg);
        }
        100% {
          transform: scale(1.05) rotate(2deg);
        }
      }
    `, document.head.appendChild(t), this.log("✅ 拖拽样式已添加");
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
    const t = Date.now();
    if (t - this.lastUpdateTime < 50) {
      this.isUpdating = !1;
      return;
    }
    this.lastUpdateTime = t;
    const e = this.tabContainer.querySelector(".drag-handle");
    this.tabContainer.querySelector(".new-tab-button"), this.tabContainer.innerHTML = "", e && this.tabContainer.appendChild(e);
    const n = this.panelIds.length > 0 && document.querySelector(`.orca-panel[data-panel-id="${this.panelIds[0]}"]`), i = this.currentPanelIndex === 0;
    n && i ? (this.log("📋 显示第一个面板的固化标签页"), this.sortTabsByPinStatus(), this.firstPanelTabs.forEach((r, s) => {
      var l;
      const o = this.createTabElement(r);
      (l = this.tabContainer) == null || l.appendChild(o);
    }), this.addNewTabButton()) : await this.showCurrentPanelTabsSync(), this.isUpdating = !1;
  }
  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || !this.tabContainer) return;
    const t = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!t) {
      this.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }
    const e = t.querySelectorAll(".orca-hideable"), n = [];
    let i = 0;
    for (const s of e) {
      const o = s.querySelector(".orca-block-editor");
      if (!o) continue;
      const l = o.getAttribute("data-block-id");
      if (!l) continue;
      const c = await this.getTabInfo(l, this.currentPanelId, i++);
      c && n.push(c);
    }
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const r = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((s, o) => {
        const l = this.createTabElement(s);
        r.appendChild(l);
      });
    else {
      const s = document.createElement("div");
      s.className = "panel-status", s.style.cssText = `
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
      const o = this.currentPanelIndex + 1;
      s.textContent = `面板 ${o}（无标签页）`, s.title = `当前在面板 ${o}，该面板没有标签页`, r.appendChild(s);
    }
    this.tabContainer.appendChild(r);
  }
  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || !this.tabContainer) return;
    const t = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!t) {
      this.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }
    const e = t.querySelectorAll(".orca-hideable"), n = [];
    let i = 0;
    for (const s of e) {
      const o = s.querySelector(".orca-block-editor");
      if (!o) continue;
      const l = o.getAttribute("data-block-id");
      if (!l) continue;
      const c = await this.getTabInfo(l, this.currentPanelId, i++);
      c && n.push(c);
    }
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const r = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((s, o) => {
        const l = this.createTabElement(s);
        r.appendChild(l);
      });
    else {
      const s = document.createElement("div");
      s.className = "panel-status", s.style.cssText = `
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
      const o = this.currentPanelIndex + 1;
      s.textContent = `面板 ${o}（无标签页）`, s.title = `当前在面板 ${o}，该面板没有标签页`, r.appendChild(s);
    }
    this.tabContainer.appendChild(r);
  }
  /**
   * 添加新建标签页按钮
   */
  addNewTabButton() {
    if (!this.tabContainer || this.tabContainer.querySelector(".new-tab-button")) return;
    const e = document.createElement("div");
    e.className = "new-tab-button";
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
    e.style.cssText = n, e.innerHTML = "+", e.title = "新建标签页", e.addEventListener("mouseenter", () => {
      e.style.background = "rgba(0, 0, 0, 0.1)", e.style.color = "#333";
    }), e.addEventListener("mouseleave", () => {
      e.style.background = "transparent", e.style.color = "#666";
    }), e.addEventListener("click", async (i) => {
      i.preventDefault(), i.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(e), this.addNewTabButtonContextMenu(e);
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
    const e = document.querySelector(".new-tab-context-menu");
    e && e.remove();
    const n = document.createElement("div");
    n.className = "new-tab-context-menu";
    const i = 180, r = 120;
    let s = t.clientX, o = t.clientY;
    s + i > window.innerWidth && (s = window.innerWidth - i - 10), o + r > window.innerHeight && (o = window.innerHeight - r - 10), s = Math.max(10, s), o = Math.max(10, o), n.style.cssText = `
      position: fixed;
      left: ${s}px;
      top: ${o}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 6px;
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
      },
      {
        text: "---",
        action: null,
        separator: !0
      },
      {
        text: this.isVerticalMode ? "切换到水平布局" : "切换到垂直布局",
        action: () => this.toggleLayoutMode(),
        icon: this.isVerticalMode ? "⏸" : "⏵"
      }
    ];
    this.isVerticalMode && l.push(
      {
        text: "---",
        action: null,
        separator: !0
      },
      {
        text: "调整面板宽度",
        action: () => this.showWidthAdjustmentDialog(),
        icon: "📏"
      }
    ), l.push(
      {
        text: "---",
        action: null,
        separator: !0
      },
      {
        text: this.isSidebarAlignmentEnabled ? "关闭侧边栏对齐" : "开启侧边栏对齐",
        action: () => this.toggleSidebarAlignment(),
        icon: this.isSidebarAlignmentEnabled ? "🔴" : "🟢"
      }
    ), l.forEach((h) => {
      if (h.separator) {
        const g = document.createElement("div");
        g.style.cssText = `
          height: 1px;
          background: #ddd;
          margin: 4px 8px;
        `, n.appendChild(g);
        return;
      }
      const d = document.createElement("div");
      if (d.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #333;
        transition: background-color 0.2s ease;
      `, h.icon) {
        const g = document.createElement("span");
        g.textContent = h.icon, g.style.cssText = `
          font-size: 12px;
          width: 16px;
          text-align: center;
        `, d.appendChild(g);
      }
      const u = document.createElement("span");
      u.textContent = h.text, d.appendChild(u), d.addEventListener("mouseenter", () => {
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
      this.isSidebarAlignmentEnabled = !0, this.startSidebarAlignmentObserver(), this.log("✅ 侧边栏对齐功能已启用，标签栏保持在当前位置");
    } catch (t) {
      this.error("启用侧边栏对齐失败:", t);
    }
  }
  /**
   * 禁用侧边栏对齐功能
   */
  async disableSidebarAlignment() {
    try {
      this.log("🔴 禁用侧边栏对齐功能"), this.stopSidebarAlignmentObserver(), await this.performSidebarAlignment(), this.isSidebarAlignmentEnabled = !1, this.log("🔴 侧边栏对齐功能已禁用");
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
    const e = t.classList.contains("sidebar-closed"), n = t.classList.contains("sidebar-opened");
    e ? this.lastSidebarState = "closed" : n ? this.lastSidebarState = "opened" : this.lastSidebarState = "unknown";
  }
  /**
   * 立即检查侧边栏状态变化（无防抖）
   */
  checkSidebarStateChangeImmediate() {
    if (!this.isSidebarAlignmentEnabled) return;
    const t = document.querySelector("div#app");
    if (!t) return;
    const e = t.classList.contains("sidebar-closed"), n = t.classList.contains("sidebar-opened");
    let i;
    e ? i = "closed" : n ? i = "opened" : i = "unknown", this.lastSidebarState !== i && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${i}`), this.lastSidebarState = i, this.autoAdjustSidebarAlignment());
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
      const t = this.getCurrentPosition();
      if (!t) return;
      const e = bn();
      if (!e.isVisible || e.width === 0) {
        this.log("⚠️ 侧边栏不可见或宽度为0，跳过对齐");
        return;
      }
      const n = mn(
        t,
        e,
        0
        // alignmentOffset
      );
      if (!n) {
        this.log("⚠️ 无法计算对齐位置，跳过对齐");
        return;
      }
      await this.updatePosition(n), await this.createTabsUI(), this.log(`🔄 侧边栏对齐完成: (${t.x}, ${t.y}) → (${n.x}, ${n.y})`);
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
  calculateSidebarAlignmentPosition(t, e, n, i) {
    var s;
    let r;
    if (n)
      r = Math.max(10, t.x - e), this.log(`📐 侧边栏关闭，向左移动 ${e}px: ${t.x}px → ${r}px`);
    else if (i) {
      r = t.x + e;
      const o = ((s = this.tabContainer) == null ? void 0 : s.getBoundingClientRect().width) || (this.isVerticalMode ? this.verticalWidth : 200);
      r = Math.min(r, window.innerWidth - o - 10), this.log(`📐 侧边栏打开，向右移动 ${e}px: ${t.x}px → ${r}px`);
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
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), await this.storageService.saveConfig(v.FLOATING_WINDOW_VISIBLE, this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("切换浮窗状态失败:", t);
    }
  }
  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    try {
      const t = await this.storageService.getConfig(v.FLOATING_WINDOW_VISIBLE, "orca-tabs-plugin", !1);
      this.isFloatingWindowVisible = t || !1, this.log(`📱 恢复浮窗可见状态: ${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("恢复浮窗可见状态失败:", t);
    }
  }
  /**
   * 注册顶部工具栏按钮
   */
  registerHeadbarButton() {
    try {
      orca.headbar.registerHeadbarButton("orca-tabs-plugin.toggleButton", () => {
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
      }), this.showInHeadbar && typeof window < "u" && orca.headbar.registerHeadbarButton("orca-tabs-plugin.debugButton", () => {
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
      }), this.log("🔘 顶部工具栏按钮已注册");
    } catch (t) {
      this.error("注册顶部工具栏按钮失败:", t);
    }
  }
  /**
   * 注销顶部工具栏按钮
   */
  unregisterHeadbarButton() {
    try {
      orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.toggleButton"), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.debugButton"), this.log("🔘 顶部工具栏按钮已注销");
    } catch (t) {
      this.error("注销顶部工具栏按钮失败:", t);
    }
  }
  /**
   * 显示块类型图标信息（调试功能）
   */
  showBlockTypeIconsInfo() {
    const t = this.getAllBlockTypeIcons();
    console.log("🎨 支持的块类型和图标:"), console.table(t), this.firstPanelTabs.length > 0 && (console.log("📋 当前标签的块类型:"), this.firstPanelTabs.forEach((e, n) => {
      console.log(`${n + 1}. ${e.title} (${e.blockType || "unknown"}) - ${e.icon}`);
    })), this.log("🎨 块类型图标信息已输出到控制台");
  }
  /**
   * 切换块类型图标显示
   */
  async toggleBlockTypeIcons() {
    this.showBlockTypeIcons = !this.showBlockTypeIcons, await this.updateAllTabsBlockTypes(), await this.createTabsUI();
    try {
      await this.saveLayoutMode(), await this.storageService.saveConfig("showBlockTypeIcons", this.showBlockTypeIcons), this.log(`🎨 块类型图标显示已${this.showBlockTypeIcons ? "开启" : "关闭"}`);
    } catch (t) {
      this.error("保存设置失败:", t);
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
    let t = !1;
    for (let e = 0; e < this.firstPanelTabs.length; e++) {
      const n = this.firstPanelTabs[e];
      try {
        const i = await orca.invokeBackend("get-block", parseInt(n.blockId));
        if (i) {
          const r = await this.detectBlockType(i);
          let s = n.icon;
          s || (s = this.getBlockTypeIcon(r)), n.blockType !== r || n.icon !== s ? (this.firstPanelTabs[e] = {
            ...n,
            blockType: r,
            icon: s
          }, this.log(`✅ 更新标签: ${n.title} -> 类型: ${r}, 图标: ${s}`), t = !0) : this.verboseLog(`⏭️ 跳过标签: ${n.title} (无需更新)`);
        }
      } catch (i) {
        this.warn(`更新标签失败: ${n.title}`, i);
      }
    }
    t ? (this.log("🔄 检测到更新，重新创建UI..."), await this.createTabsUI()) : this.log("ℹ️ 没有标签页需要更新"), this.log("✅ 所有标签页的块类型和图标已更新");
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
      const n = window.getComputedStyle(t).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${n}"`), n && n !== "") {
        const r = parseInt(n.replace("px", ""));
        if (isNaN(r))
          this.log(`⚠️ CSS变量值无法解析为数字: "${n}"`);
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
    this.tabContainer && (this.resizeHandle = document.createElement("div"), this.resizeHandle.className = "resize-handle", this.resizeHandle.style.cssText = Xe(), this.resizeHandle.addEventListener("mousedown", this.handleResizeStart.bind(this)), this.tabContainer.appendChild(this.resizeHandle));
  }
  /**
   * 处理拖拽开始
   */
  handleResizeStart(t) {
    if (t.preventDefault(), t.stopPropagation(), !this.tabContainer) return;
    const e = t.clientX, n = this.verticalWidth, i = async (s) => {
      const o = s.clientX - e, l = Math.max(120, Math.min(400, n + o));
      this.verticalWidth = l;
      try {
        orca.nav.changeSizes(orca.state.activePanel, [l]), this.tabContainer.style.width = `${l}px`;
      } catch (c) {
        this.error("调整面板宽度失败:", c);
      }
    }, r = async () => {
      document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", r);
      try {
        await this.saveLayoutMode(), this.log(`📏 面板宽度已调整为: ${this.verticalWidth}px`);
      } catch (s) {
        this.error("保存宽度设置失败:", s);
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
   * 显示宽度调整对话框
   */
  async showWidthAdjustmentDialog() {
    const t = document.querySelector(".width-adjustment-dialog");
    t && t.remove();
    const e = this.verticalWidth, n = dn(
      this.verticalWidth,
      async (i) => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [i]), this.tabContainer && (this.tabContainer.style.width = `${i}px`), this.verticalWidth = i, await this.saveLayoutMode();
        } catch (r) {
          this.error("实时调整面板宽度失败:", r);
        }
      },
      async () => {
        try {
          orca.nav.changeSizes(orca.state.activePanel, [e]), this.tabContainer && (this.tabContainer.style.width = `${e}px`), this.verticalWidth = e;
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
    const i = orca.state.themeMode === "dark", r = qe(t, this.isVerticalMode, i, this.applyOklchFormula.bind(this));
    e.style.cssText = r;
    const s = Ve();
    if (t.icon) {
      const l = _e(t.icon);
      s.appendChild(l);
    }
    const o = He(t.title);
    if (s.appendChild(o), t.isPinned) {
      const l = Ue();
      s.appendChild(l);
    }
    return e.appendChild(s), this.isVerticalMode && !this.resizeHandle && this.enableDragResize(), e.title = Ye(t), e.addEventListener("click", (l) => {
      var h;
      console.log(`🖱️ 标签点击事件触发: ${t.title} (ID: ${t.blockId})`), l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.log(`🖱️ 点击标签: ${t.title} (ID: ${t.blockId})`);
      const c = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tab");
      c == null || c.forEach((d) => d.removeAttribute("data-focused")), e.setAttribute("data-focused", "true"), this.switchToTab(t);
    }), e.addEventListener("mousedown", (l) => {
      console.log(`🖱️ 标签mousedown事件触发: ${t.title} (ID: ${t.blockId})`);
    }), e.addEventListener("dblclick", (l) => {
      l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.toggleTabPinStatus(t);
    }), e.addEventListener("auxclick", (l) => {
      l.button === 1 && (l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.closeTab(t));
    }), e.addEventListener("keydown", (l) => {
      (l.target === e || e.contains(l.target)) && (l.key === "F2" ? (l.preventDefault(), l.stopPropagation(), this.renameTab(t)) : l.ctrlKey && l.key === "p" ? (l.preventDefault(), l.stopPropagation(), this.toggleTabPinStatus(t)) : l.ctrlKey && l.key === "w" && (l.preventDefault(), l.stopPropagation(), this.closeTab(t)));
    }), this.addOrcaContextMenu(e, t), e.draggable = !0, e.addEventListener("dragstart", (l) => {
      var h;
      if (l.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        l.preventDefault();
        return;
      }
      l.dataTransfer.effectAllowed = "move", (h = l.dataTransfer) == null || h.setData("text/plain", t.blockId), this.draggingTab = t, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), e.setAttribute("data-dragging", "true"), e.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), this.log(`🔄 开始拖拽标签: ${t.title} (ID: ${t.blockId})`);
    }), e.addEventListener("dragend", (l) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDragVisualFeedback(), this.debouncedUpdateTabsUI(), this.log(`🔄 结束拖拽标签: ${t.title}`);
    }), e.addEventListener("dragover", (l) => {
      l.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== t.blockId && (l.preventDefault(), l.stopPropagation(), l.dataTransfer.dropEffect = "move", this.addDragOverEffect(e), this.debouncedSwapTab(t, this.draggingTab), this.verboseLog(`🔄 拖拽经过: ${t.title} (目标: ${this.draggingTab.title})`));
    }), e.addEventListener("dragenter", (l) => {
      l.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== t.blockId && (l.preventDefault(), l.stopPropagation(), this.addDragOverEffect(e), this.verboseLog(`🔄 拖拽进入: ${t.title}`));
    }), e.addEventListener("dragleave", (l) => {
      const c = e.getBoundingClientRect(), h = l.clientX, d = l.clientY, u = 5;
      (h < c.left - u || h > c.right + u || d < c.top - u || d > c.bottom + u) && (this.removeDragOverEffect(e), this.verboseLog(`🔄 拖拽离开: ${t.title}`));
    }), e.addEventListener("drop", (l) => {
      var h;
      l.preventDefault();
      const c = (h = l.dataTransfer) == null ? void 0 : h.getData("text/plain");
      this.log(`🔄 拖拽放置: ${c} -> ${t.blockId}`);
    }), e.addEventListener("mouseenter", () => {
      e.style.transform = "scale(1.05)", e.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
    }), e.addEventListener("mouseleave", () => {
      e.style.transform = "scale(1)", e.style.boxShadow = "none";
    }), e;
  }
  hexToRgba(t, e) {
    return We(t, e);
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(t) {
    const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (e) {
      const n = parseInt(e[1], 16), i = parseInt(e[2], 16), r = parseInt(e[3], 16);
      return (0.299 * n + 0.587 * i + 0.114 * r) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(t, e) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (n) {
      let i = parseInt(n[1], 16), r = parseInt(n[2], 16), s = parseInt(n[3], 16);
      i = Math.floor(i * (1 - e)), r = Math.floor(r * (1 - e)), s = Math.floor(s * (1 - e));
      const o = i.toString(16).padStart(2, "0"), l = r.toString(16).padStart(2, "0"), c = s.toString(16).padStart(2, "0");
      return `#${o}${l}${c}`;
    }
    return t;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(t, e, n) {
    const i = t / 255, r = e / 255, s = n / 255, o = (Y) => Y <= 0.04045 ? Y / 12.92 : Math.pow((Y + 0.055) / 1.055, 2.4), l = o(i), c = o(r), h = o(s), d = l * 0.4124564 + c * 0.3575761 + h * 0.1804375, u = l * 0.2126729 + c * 0.7151522 + h * 0.072175, g = l * 0.0193339 + c * 0.119192 + h * 0.9503041, f = 0.2104542553 * d + 0.793617785 * u - 0.0040720468 * g, p = 1.9779984951 * d - 2.428592205 * u + 0.4505937099 * g, m = 0.0259040371 * d + 0.7827717662 * u - 0.808675766 * g, T = Math.cbrt(f), w = Math.cbrt(p), C = Math.cbrt(m), H = 0.2104542553 * T + 0.793617785 * w + 0.0040720468 * C, M = 1.9779984951 * T - 2.428592205 * w + 0.4505937099 * C, D = 0.0259040371 * T + 0.7827717662 * w - 0.808675766 * C, L = Math.sqrt(M * M + D * D), U = Math.atan2(D, M) * 180 / Math.PI, mt = U < 0 ? U + 360 : U;
    return { l: H, c: L, h: mt };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(t, e, n) {
    const i = n * Math.PI / 180, r = e * Math.cos(i), s = e * Math.sin(i), o = t, l = r, c = s, h = o * o * o, d = l * l * l, u = c * c * c, g = 1.0478112 * h + 0.0228866 * d - 0.050217 * u, f = 0.0295424 * h + 0.9904844 * d + 0.0170491 * u, p = -92345e-7 * h + 0.0150436 * d + 0.7521316 * u, m = 3.2404542 * g - 1.5371385 * f - 0.4985314 * p, T = -0.969266 * g + 1.8760108 * f + 0.041556 * p, w = 0.0556434 * g - 0.2040259 * f + 1.0572252 * p, C = (L) => L <= 31308e-7 ? 12.92 * L : 1.055 * Math.pow(L, 1 / 2.4) - 0.055, H = Math.max(0, Math.min(255, Math.round(C(m) * 255))), M = Math.max(0, Math.min(255, Math.round(C(T) * 255))), D = Math.max(0, Math.min(255, Math.round(C(w) * 255)));
    return { r: H, g: M, b: D };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(t, e) {
    return sn(t, e);
  }
  async switchToTab(t) {
    try {
      this.log(`🔄 开始切换标签: ${t.title} (ID: ${t.blockId})`);
      const e = this.getCurrentActiveTab();
      e && e.blockId !== t.blockId && (this.recordScrollPosition(e), this.lastActiveBlockId = e.blockId, this.log(`🎯 记录切换前的激活标签: ${e.title} (ID: ${e.blockId})`));
      const n = this.panelIds[this.currentPanelIndex];
      this.log(`🎯 目标面板ID: ${n}, 当前面板索引: ${this.currentPanelIndex}`);
      try {
        if (t.isJournal) {
          console.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${t.blockId}, 标题: ${t.title}`), this.log(`🚀 尝试使用 orca.nav.goTo 导航到日期块 ${t.blockId}`);
          let i = null;
          if (console.log(`🔍 检查日期块标题: ${t.title}`), t.title.includes("今天") || t.title.includes("Today")) {
            console.log("📅 使用原生命令跳转到今天");
            try {
              await orca.commands.invokeCommand("core.goToday"), console.log("✅ 今天导航成功");
              return;
            } catch (r) {
              console.log("❌ 今天导航失败:", r), i = /* @__PURE__ */ new Date(), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
            }
          } else if (t.title.includes("昨天") || t.title.includes("Yesterday")) {
            console.log("📅 使用原生命令跳转到昨天");
            try {
              await orca.commands.invokeCommand("core.goYesterday"), console.log("✅ 昨天导航成功");
              return;
            } catch (r) {
              console.log("❌ 昨天导航失败:", r), i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() - 1), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
            }
          } else if (t.title.includes("明天") || t.title.includes("Tomorrow")) {
            console.log("📅 使用原生命令跳转到明天");
            try {
              await orca.commands.invokeCommand("core.goTomorrow"), console.log("✅ 明天导航成功");
              return;
            } catch (r) {
              console.log("❌ 明天导航失败:", r), i = /* @__PURE__ */ new Date(), i.setDate(i.getDate() + 1), console.log(`📅 回退到日期格式: ${i.toISOString()}`);
            }
          } else {
            const r = t.title.match(/(\d{4}-\d{2}-\d{2})/);
            if (r) {
              const s = r[1];
              i = /* @__PURE__ */ new Date(s + "T00:00:00.000Z"), isNaN(i.getTime()) ? (console.log(`❌ 无效的日期格式: ${s}`), i = null) : console.log(`📅 从标题提取日期: ${s} -> ${i.toISOString()}`);
            } else {
              console.log(`🔍 尝试从块信息中获取原始日期: ${t.blockId}`);
              try {
                const s = await orca.invokeBackend("get-block", parseInt(t.blockId));
                if (s) {
                  const o = X(s);
                  o && !isNaN(o.getTime()) ? (i = o, console.log(`📅 从块信息获取日期: ${o.toISOString()}`)) : console.log("❌ 块信息中未找到有效日期信息");
                } else
                  console.log("❌ 无法获取块信息");
              } catch (s) {
                console.log("❌ 获取块信息失败:", s), this.warn("无法获取块信息:", s);
              }
            }
          }
          if (i) {
            console.log(`📅 使用日期导航: ${i.toISOString().split("T")[0]}`), this.log(`📅 使用日期导航: ${i.toISOString().split("T")[0]}`);
            try {
              if (isNaN(i.getTime()))
                throw new Error("Invalid date");
              console.log(`📅 使用简单日期格式: ${i.toISOString()}`), await orca.nav.goTo("journal", { date: i }, n), console.log("✅ 日期导航成功");
            } catch (r) {
              console.log("❌ 日期导航失败:", r);
              try {
                console.log("🔄 尝试 Orca 日期格式");
                const s = {
                  t: 2,
                  // 2 for full/absolute date
                  v: i.getTime()
                  // 使用时间戳
                };
                console.log("📅 使用 Orca 日期格式:", s), await orca.nav.goTo("journal", { date: s }, n), console.log("✅ Orca 日期导航成功");
              } catch (s) {
                throw console.log("❌ Orca 日期导航也失败:", s), s;
              }
            }
          } else {
            console.log("⚠️ 未找到日期信息，尝试使用块ID导航"), this.log("⚠️ 未找到日期信息，尝试使用块ID导航");
            try {
              await orca.nav.goTo("block", { blockId: parseInt(t.blockId) }, n), console.log("✅ 块ID导航成功");
            } catch (r) {
              throw console.log("❌ 块ID导航失败:", r), r;
            }
          }
        } else
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${t.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(t.blockId) }, n);
        this.log("✅ orca.nav.goTo 导航成功");
      } catch (i) {
        this.warn("导航失败，尝试备用方法:", i);
        const r = document.querySelector(`[data-block-id="${t.blockId}"]`);
        if (r)
          this.log(`🔄 使用备用方法点击块元素: ${t.blockId}`), r.click();
        else {
          this.error("无法找到目标块元素:", t.blockId);
          const s = document.querySelector(`[data-block-id="${t.blockId}"]`) || document.querySelector(`#block-${t.blockId}`) || document.querySelector(`.block-${t.blockId}`);
          s ? (this.log("🔄 找到备用块元素，尝试点击"), s.click()) : this.error("完全无法找到目标块元素");
        }
      }
      this.lastActiveBlockId = t.blockId, this.log(`🔄 切换到标签: ${t.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(t), setTimeout(() => {
        this.debugScrollPosition(t);
      }, 500);
    } catch (e) {
      this.error("切换标签失败:", e);
    }
  }
  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(t) {
    const e = this.panelIds[0], n = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!n) return !1;
    const i = n.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    return i ? i.getAttribute("data-block-id") === t.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(t) {
    const e = this.firstPanelTabs.findIndex((i) => i.blockId === t.blockId);
    if (e === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let n = -1;
    if (e === 0 ? n = 1 : e === this.firstPanelTabs.length - 1 ? n = e - 1 : n = e + 1, n >= 0 && n < this.firstPanelTabs.length) {
      const i = this.firstPanelTabs[n];
      this.log(`🔄 自动切换到相邻标签: "${i.title}" (位置: ${n})`);
      const r = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(i.blockId) }, r);
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  async toggleTabPinStatus(t) {
    if (this.currentPanelIndex !== 0) return;
    const e = this.firstPanelTabs.findIndex((n) => n.blockId === t.blockId);
    if (e !== -1) {
      this.firstPanelTabs[e].isPinned = !this.firstPanelTabs[e].isPinned, this.sortTabsByPinStatus(), this.debouncedUpdateTabsUI(), await this.saveFirstPanelTabs();
      const n = this.firstPanelTabs[e].isPinned ? "固定" : "取消固定";
      this.log(`📌 标签 "${t.title}" 已${n}`);
    }
  }
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
        showBlockTypeIcons: {
          label: "显示块类型图标",
          type: "boolean",
          defaultValue: !0,
          description: "控制标签页顶部是否显示块类型图标按钮"
        }
      };
      await orca.plugins.setSettingsSchema("orca-tabs-plugin", e);
      const n = (t = orca.state.plugins["orca-tabs-plugin"]) == null ? void 0 : t.settings;
      n != null && n.homePageBlockId && (this.homePageBlockId = n.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), (n == null ? void 0 : n.showBlockTypeIcons) !== void 0 && (this.showBlockTypeIcons = n.showBlockTypeIcons, this.log(`🎨 块类型图标显示: ${this.showBlockTypeIcons ? "开启" : "关闭"}`)), this.log("✅ 插件设置已注册");
    } catch (e) {
      this.error("注册插件设置失败:", e);
    }
  }
  /**
   * 注册块菜单命令
   */
  registerBlockMenuCommands() {
    try {
      orca.blockMenuCommands.registerBlockMenuCommand("orca-tabs.openInNewTab", {
        worksOnMultipleBlocks: !1,
        render: (t, e, n) => {
          const i = window.React;
          return !i || !orca.components.MenuText ? null : i.createElement(orca.components.MenuText, {
            title: "在新标签页打开",
            preIcon: "ti ti-external-link",
            onClick: () => {
              n(), this.openInNewTab(t.toString());
            }
          });
        }
      }), this.log("✅ 已注册块菜单命令: 在新标签页打开");
    } catch (t) {
      this.error("注册块菜单命令失败:", t);
    }
  }
  /**
   * 创建新标签页
   */
  async createNewTab() {
    if (this.currentPanelIndex === 0)
      try {
        const t = this.homePageBlockId && this.homePageBlockId.trim() ? this.homePageBlockId : "1", e = this.homePageBlockId && this.homePageBlockId.trim() ? "🏠 主页" : "📄 新标签页";
        this.log(`🆕 创建新标签页，使用块ID: ${t}`);
        const n = {
          blockId: t,
          panelId: this.panelIds[0],
          title: e,
          isPinned: !1,
          order: this.firstPanelTabs.length
        };
        this.log(`📋 新标签页信息: "${n.title}" (ID: ${t})`);
        const i = this.getCurrentActiveTab();
        let r = this.firstPanelTabs.length;
        if (i) {
          const o = this.firstPanelTabs.findIndex((l) => l.blockId === i.blockId);
          o !== -1 && (r = o + 1, this.log(`🎯 将在聚焦标签 "${i.title}" 后面插入新标签: "${n.title}"`));
        } else
          this.log("🎯 没有聚焦标签，将添加到末尾");
        if (this.firstPanelTabs.length >= this.maxTabs) {
          this.firstPanelTabs.splice(r, 0, n), this.verboseLog(`➕ 在位置 ${r} 插入新标签: ${n.title}`);
          const o = this.findLastNonPinnedTabIndex();
          if (o !== -1) {
            const l = this.firstPanelTabs[o];
            this.firstPanelTabs.splice(o, 1), this.log(`🗑️ 删除末尾的非固定标签: "${l.title}" 来保持数量限制`);
          } else {
            const l = this.firstPanelTabs.findIndex((c) => c.blockId === n.blockId);
            if (l !== -1) {
              this.firstPanelTabs.splice(l, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${n.title}"`);
              return;
            }
          }
        } else
          this.firstPanelTabs.splice(r, 0, n), this.verboseLog(`➕ 在位置 ${r} 插入新标签: ${n.title}`);
        await this.saveFirstPanelTabs(), await this.updateTabsUI();
        const s = this.panelIds[0];
        await orca.nav.goTo("block", { blockId: parseInt(t) }, s), this.log(`🔄 导航到块: ${t}`), this.log(`✅ 成功创建新标签页: "${n.title}"`);
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
    } catch (n) {
      this.warn("设置块内容失败，尝试备用方法:", n);
      try {
        await orca.invokeBackend("get-block", parseInt(t)) && this.log(`📝 跳过自动内容设置，用户可手动编辑块 ${t}`);
      } catch (i) {
        this.warn("备用方法也失败:", i);
      }
    }
  }
  /**
   * 通用的标签添加方法
   */
  async addTabToPanel(t, e, n = !1) {
    if (this.currentPanelIndex !== 0) return !1;
    try {
      if (this.firstPanelTabs.find((c) => c.blockId === t)) {
        if (this.log(`📋 块 ${t} 已存在于标签页中`), n) {
          const c = this.panelIds[0];
          await orca.nav.goTo("block", { blockId: parseInt(t) }, c);
        }
        return !0;
      }
      if (!orca.state.blocks[parseInt(t)])
        return this.warn(`无法找到块 ${t}`), !1;
      const s = await this.getTabInfo(t, this.panelIds[0], this.firstPanelTabs.length);
      if (!s)
        return this.warn(`无法获取块 ${t} 的标签信息`), !1;
      let o = this.firstPanelTabs.length, l = !1;
      if (e === "replace") {
        const c = this.getCurrentActiveTab();
        if (!c)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const h = this.firstPanelTabs.findIndex((d) => d.blockId === c.blockId);
        if (h === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        c.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), o = h + 1, l = !1) : (o = h, l = !0);
      } else if (e === "after") {
        const c = this.getCurrentActiveTab();
        if (c) {
          const h = this.firstPanelTabs.findIndex((d) => d.blockId === c.blockId);
          h !== -1 && (o = h + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (this.firstPanelTabs.length >= this.maxTabs)
        if (l)
          this.firstPanelTabs[o] = s;
        else {
          this.firstPanelTabs.splice(o, 0, s);
          const c = this.findLastNonPinnedTabIndex();
          if (c !== -1)
            this.firstPanelTabs.splice(c, 1);
          else {
            const h = this.firstPanelTabs.findIndex((d) => d.blockId === s.blockId);
            if (h !== -1)
              return this.firstPanelTabs.splice(h, 1), !1;
          }
        }
      else
        l ? this.firstPanelTabs[o] = s : this.firstPanelTabs.splice(o, 0, s);
      if (await this.saveFirstPanelTabs(), await this.updateTabsUI(), n) {
        const c = this.panelIds[0];
        await orca.nav.goTo("block", { blockId: parseInt(t) }, c);
      }
      return !0;
    } catch (i) {
      return this.error("添加标签页时出错:", i), !1;
    }
  }
  /**
   * 将指定块添加到标签页中，替换当前聚焦标签
   */
  async createBlockAfterFocused(t) {
    await this.addTabToPanel(t, "replace", !1);
  }
  /**
   * 在后台新建标签页打开指定块（在聚焦标签后面插入新标签但不跳转）
   */
  async openInNewTab(t) {
    await this.addTabToPanel(t, "after", !1);
  }
  /**
   * 从DOM元素中获取块引用的ID
   */
  getBlockRefId(t) {
    var e, n;
    try {
      let i = t;
      for (; i && i !== document.body; ) {
        const r = i.classList;
        if (r.contains("orca-ref") || r.contains("block-ref") || r.contains("block-reference") || r.contains("orca-fragment-r") || r.contains("fragment-r") || r.contains("orca-block-reference") || i.tagName.toLowerCase() === "a" && ((e = i.getAttribute("href")) != null && e.startsWith("#"))) {
          const o = i.getAttribute("data-block-id") || i.getAttribute("data-ref-id") || i.getAttribute("data-blockid") || i.getAttribute("data-target-block-id") || i.getAttribute("data-fragment-v") || i.getAttribute("data-v") || ((n = i.getAttribute("href")) == null ? void 0 : n.replace("#", "")) || i.getAttribute("data-id");
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从元素中提取到块引用ID: ${o}`), o;
        }
        const s = i.dataset;
        for (const [o, l] of Object.entries(s))
          if ((o.toLowerCase().includes("block") || o.toLowerCase().includes("ref")) && l && !isNaN(parseInt(l)))
            return this.log(`🔗 从data属性 ${o} 中提取到块引用ID: ${l}`), l;
        i = i.parentElement;
      }
      if (t.textContent) {
        const r = t.textContent.trim(), s = r.match(/\[\[(?:块)?(\d+)\]\]/) || r.match(/block[:\s]*(\d+)/i);
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
      const t = window.getSelection();
      if (!t || t.rangeCount === 0)
        return this.log("🔍 无法获取当前选择"), null;
      const e = orca.utils.getCursorDataFromSelection(t);
      if (!e)
        return this.log("🔍 无法从选择转换为 CursorData"), null;
      const n = e.anchor.blockId.toString();
      return this.log(`🔍 获取到当前光标块ID: ${n}`), n;
    } catch (t) {
      return this.error("获取当前光标块ID时出错:", t), null;
    }
  }
  /**
   * 增强块引用的右键菜单，添加标签页相关选项
   */
  enhanceBlockRefContextMenu(t) {
    try {
      const e = document.querySelectorAll('.orca-context-menu, .context-menu, [role="menu"]');
      let n = null;
      for (let r = e.length - 1; r >= 0; r--) {
        const s = e[r];
        if (s.offsetParent !== null && getComputedStyle(s).display !== "none") {
          n = s;
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
      if (this.log(`🔗 为块引用 ${t} 添加菜单项`), n.querySelectorAll('[role="menuitem"], .menu-item').length > 0) {
        const r = document.createElement("div");
        r.className = "orca-tabs-ref-menu-separator", r.style.cssText = `
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 4px 8px;
        `, n.appendChild(r);
      }
      this.log(`✅ 成功为块引用 ${t} 添加菜单项`);
    } catch (e) {
      this.error("增强块引用右键菜单时出错:", e);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(t, e, n, i) {
    return Be(t, e, n, i);
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(t) {
    try {
      const e = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(e, orca.state.panels);
      if (n && n.viewState) {
        let i = null;
        const r = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (r) {
          const s = r.closest(".orca-panel");
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
          const o = this.firstPanelTabs.findIndex((l) => l.blockId === t.blockId);
          o !== -1 && (this.firstPanelTabs[o].scrollPosition = s, await this.saveFirstPanelTabs()), this.log(`📝 记录标签 "${t.title}" 滚动位置到viewState:`, s, "容器:", i.className);
        } else
          this.warn(`未找到标签 "${t.title}" 的滚动容器`);
      } else
        this.warn(`未找到面板 ${e} 或viewState`);
    } catch (e) {
      this.warn("记录滚动位置时出错:", e);
    }
  }
  /**
   * 恢复标签的滚动位置
   */
  restoreScrollPosition(t) {
    try {
      let e = null;
      const n = this.panelIds[this.currentPanelIndex], i = orca.nav.findViewPanel(n, orca.state.panels);
      if (i && i.viewState && i.viewState.scrollPosition && (e = i.viewState.scrollPosition, this.log(`🔄 从viewState恢复标签 "${t.title}" 滚动位置:`, e)), !e && t.scrollPosition && (e = t.scrollPosition, this.log(`🔄 从标签信息恢复标签 "${t.title}" 滚动位置:`, e)), !e) return;
      const r = (s = 1) => {
        if (s > 5) {
          this.warn(`恢复标签 "${t.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let o = null;
        const l = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (l) {
          const c = l.closest(".orca-panel");
          c && (o = c.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!o) {
          const c = document.querySelector(".orca-panel.active");
          c && (o = c.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        o || (o = document.body.scrollTop > 0 ? document.body : document.documentElement), o ? (o.scrollLeft = e.x, o.scrollTop = e.y, this.log(`🔄 恢复标签 "${t.title}" 滚动位置:`, e, "容器:", o.className, `尝试${s}`)) : setTimeout(() => r(s + 1), 200 * s);
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
    this.log(`🔍 调试标签 "${t.title}" 滚动位置:`), this.log("标签保存的滚动位置:", t.scrollPosition);
    const e = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(e, orca.state.panels);
    n && n.viewState ? (this.log("viewState中的滚动位置:", n.viewState.scrollPosition), this.log("完整viewState:", n.viewState)) : this.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((r) => {
      document.querySelectorAll(r).forEach((o, l) => {
        const c = o;
        (c.scrollTop > 0 || c.scrollLeft > 0) && this.log(`容器 ${r}[${l}]:`, {
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
  isTabActive(t) {
    try {
      const e = this.panelIds[0], n = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
      if (!n) return !1;
      const i = n.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
      return i ? i.getAttribute("data-block-id") === t.blockId : !1;
    } catch (e) {
      return this.warn("检查标签激活状态时出错:", e), !1;
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    if (this.currentPanelIndex !== 0 || this.firstPanelTabs.length === 0) return null;
    const t = this.panelIds[0], e = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!e) return null;
    const n = e.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) return null;
    const i = n.getAttribute("data-block-id");
    return i && this.firstPanelTabs.find((r) => r.blockId === i) || null;
  }
  /**
   * 获取智能插入位置（在当前激活标签后面）
   */
  getSmartInsertPosition() {
    if (this.currentPanelIndex !== 0 || this.firstPanelTabs.length === 0) return -1;
    const t = this.getCurrentActiveTab();
    if (!t)
      return -1;
    const e = this.firstPanelTabs.findIndex((n) => n.blockId === t.blockId);
    return e === -1 ? -1 : e;
  }
  /**
   * 获取新标签添加前的当前激活标签（用于确定插入位置）
   */
  getCurrentActiveTabBeforeNewOne() {
    if (this.currentPanelIndex !== 0 || this.firstPanelTabs.length === 0) return null;
    if (this.lastActiveBlockId) {
      const e = this.firstPanelTabs.find((n) => n.blockId === this.lastActiveBlockId);
      if (e)
        return this.log(`🎯 找到上一个激活的标签: ${e.title}`), e;
    }
    const t = this.getCurrentActiveTab();
    return t ? (this.log(`🎯 使用当前激活的标签: ${t.title}`), t) : (this.log("🎯 没有找到激活的标签"), null);
  }
  /**
   * 基于之前激活的标签获取智能插入位置
   */
  getSmartInsertPositionWithPrevious(t) {
    if (this.currentPanelIndex !== 0 || this.firstPanelTabs.length === 0) return -1;
    if (!t)
      return this.log("🎯 没有找到之前激活的标签，添加到末尾"), -1;
    const e = this.firstPanelTabs.findIndex((n) => n.blockId === t.blockId);
    return e === -1 ? (this.log("🎯 之前激活的标签不在当前列表中，添加到末尾"), -1) : (this.log(`🎯 将在标签 "${t.title}" (索引${e}) 后面插入新标签`), e);
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(t) {
    if (this.currentPanelIndex !== 0) return null;
    const e = this.firstPanelTabs.findIndex((n) => n.blockId === t.blockId);
    return e === -1 || this.firstPanelTabs.length <= 1 ? null : e < this.firstPanelTabs.length - 1 ? this.firstPanelTabs[e + 1] : e > 0 ? this.firstPanelTabs[e - 1] : e === 0 && this.firstPanelTabs.length > 1 ? this.firstPanelTabs[1] : null;
  }
  /**
   * 关闭标签页
   */
  async closeTab(t) {
    if (this.currentPanelIndex !== 0) return;
    if (this.firstPanelTabs.length <= 1) {
      this.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    t.isPinned && this.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
    const e = this.firstPanelTabs.findIndex((n) => n.blockId === t.blockId);
    if (e !== -1) {
      const n = this.getCurrentActiveTab(), i = n && n.blockId === t.blockId, r = i ? this.getAdjacentTab(t) : null;
      this.closedTabs.add(t.blockId), this.firstPanelTabs.splice(e, 1), this.debouncedUpdateTabsUI(), await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 标签 "${t.title}" 已关闭，已添加到关闭列表`), i && r ? (this.log(`🔄 自动切换到相邻标签: "${r.title}"`), await this.switchToTab(r)) : i && !r && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    if (this.currentPanelIndex !== 0) return;
    this.firstPanelTabs.filter((i) => !i.isPinned).forEach((i) => {
      this.closedTabs.add(i.blockId);
    });
    const e = this.firstPanelTabs.filter((i) => i.isPinned), n = this.firstPanelTabs.length - e.length;
    this.firstPanelTabs = e, this.debouncedUpdateTabsUI(), await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 已关闭 ${n} 个标签，保留了 ${e.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(t) {
    if (this.currentPanelIndex !== 0) return;
    const e = this.firstPanelTabs.filter(
      (r) => r.blockId === t.blockId || r.isPinned
    );
    this.firstPanelTabs.filter(
      (r) => r.blockId !== t.blockId && !r.isPinned
    ).forEach((r) => {
      this.closedTabs.add(r.blockId);
    });
    const i = this.firstPanelTabs.length - e.length;
    this.firstPanelTabs = e, this.debouncedUpdateTabsUI(), await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 已关闭其他 ${i} 个标签，保留了当前标签和固定标签`);
  }
  /**
   * 重命名标签（内联编辑）
   */
  renameTab(t) {
    if (this.currentPanelIndex !== 0) return;
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
    const n = e.querySelector(".inline-rename-input");
    n && n.remove();
    const i = e.textContent, r = e.style.cssText, s = document.createElement("input");
    s.type = "text", s.value = t.title, s.className = "inline-rename-input";
    const o = orca.state.themeMode === "dark";
    let l = o ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", c = o ? "#ffffff" : "#333";
    t.color && (l = this.applyOklchFormula(t.color, "background"), c = this.applyOklchFormula(t.color, "text")), s.style.cssText = `
      background: ${l};
      color: ${c};
      border: 2px solid #3b82f6;
      border-radius: 4px;
      padding: 2px 8px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      font-weight: 600;
      outline: none;
      width: 100%;
      max-width: 150px;
      box-sizing: border-box;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, e.textContent = "", e.appendChild(s), e.style.padding = "2px 8px", s.focus(), s.select();
    const h = async () => {
      const u = s.value.trim();
      if (u && u !== t.title) {
        await this.updateTabTitle(t, u);
        return;
      }
      e.textContent = i, e.style.cssText = r;
    }, d = () => {
      e.textContent = i, e.style.cssText = r;
    };
    s.addEventListener("blur", h), s.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), h()) : u.key === "Escape" && (u.preventDefault(), d());
    }), s.addEventListener("click", (u) => {
      u.stopPropagation();
    });
  }
  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(t) {
    const e = window.React, n = window.ReactDOM;
    if (!e || !n || !orca.components.InputBox) {
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
    let s = { x: "50%", y: "50%" };
    if (r) {
      const d = r.getBoundingClientRect(), u = window.innerWidth, g = window.innerHeight, f = 300, p = 100, m = 20;
      let T = d.left, w = d.top - p - 10;
      T + f > u - m && (T = u - f - m), T < m && (T = m), w < m && (w = d.bottom + 10, w + p > g - m && (w = (g - p) / 2)), w + p > g - m && (w = g - p - m), T = Math.max(m, Math.min(T, u - f - m)), w = Math.max(m, Math.min(w, g - p - m)), s = { x: `${T}px`, y: `${w}px` };
    }
    const o = orca.components.InputBox, l = e.createElement(o, {
      label: "重命名标签",
      defaultValue: t.title,
      onConfirm: (d, u, g) => {
        d && d.trim() && d.trim() !== t.title && this.updateTabTitle(t, d.trim()), g();
      },
      onCancel: (d) => {
        d();
      }
    }, (d) => e.createElement("div", {
      style: {
        position: "absolute",
        left: s.x,
        top: s.y,
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
  showRenameInput(t) {
    const e = document.querySelector(".tab-rename-input");
    e && e.remove();
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
    i.type = "text", i.value = t.title, i.style.cssText = `
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: #333;
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
    const s = document.createElement("button");
    s.textContent = "确认", s.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    const o = document.createElement("button");
    o.textContent = "取消", o.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `, s.addEventListener("mouseenter", () => {
      s.style.backgroundColor = "#2563eb";
    }), s.addEventListener("mouseleave", () => {
      s.style.backgroundColor = "#3b82f6";
    }), o.addEventListener("mouseenter", () => {
      o.style.backgroundColor = "#4b5563";
    }), o.addEventListener("mouseleave", () => {
      o.style.backgroundColor = "#6b7280";
    }), r.appendChild(s), r.appendChild(o), n.appendChild(i), n.appendChild(r);
    const l = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    if (l) {
      const u = l.getBoundingClientRect();
      n.style.left = `${u.left}px`, n.style.top = `${u.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), i.focus(), i.select();
    const c = () => {
      const u = i.value.trim();
      u && u !== t.title && this.updateTabTitle(t, u), n.remove();
    }, h = () => {
      n.remove();
    };
    s.addEventListener("click", c), o.addEventListener("click", h), i.addEventListener("keydown", (u) => {
      u.key === "Enter" ? (u.preventDefault(), c()) : u.key === "Escape" && (u.preventDefault(), h());
    });
    const d = (u) => {
      n.contains(u.target) || (h(), document.removeEventListener("click", d));
    };
    setTimeout(() => {
      document.addEventListener("click", d);
    }, 100);
  }
  /**
   * 更新标签标题
   */
  async updateTabTitle(t, e) {
    try {
      const n = this.firstPanelTabs.findIndex((i) => i.blockId === t.blockId);
      n !== -1 && (this.firstPanelTabs[n].title = e, await this.saveFirstPanelTabs(), await this.updateTabsUI(), this.log(`📝 标签重命名: "${t.title}" -> "${e}"`));
    } catch (n) {
      this.error("重命名标签失败:", n);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(t, e) {
    const n = window.React, i = window.ReactDOM;
    if (!n || !i || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      setTimeout(() => {
        const r = window.React, s = window.ReactDOM;
        !r || !s || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? t.addEventListener("contextmenu", (o) => {
          o.preventDefault(), o.stopPropagation(), o.stopImmediatePropagation(), this.showTabContextMenu(o, e);
        }) : this.createOrcaContextMenu(t, e);
      }, 100);
      return;
    }
    this.createOrcaContextMenu(t, e);
  }
  createOrcaContextMenu(t, e) {
    const n = window.React, i = window.ReactDOM, r = document.createElement("div");
    r.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, t.appendChild(r);
    const s = orca.components.ContextMenu, o = orca.components.Menu, l = orca.components.MenuText, c = orca.components.MenuSeparator, h = n.createElement(s, {
      menu: (g) => n.createElement(o, {}, [
        n.createElement(l, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            g(), this.renameTab(e);
          }
        }),
        n.createElement(l, {
          key: "pin",
          title: e.isPinned ? "取消固定" : "固定标签",
          preIcon: e.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          shortcut: "Ctrl+P",
          onClick: () => {
            g(), this.toggleTabPinStatus(e);
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
            g(), this.closeTab(e);
          }
        }),
        n.createElement(l, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            g(), this.closeOtherTabs(e);
          }
        }),
        n.createElement(l, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            g(), this.closeAllTabs();
          }
        })
      ])
    }, (g, f) => n.createElement("div", {
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
        m.preventDefault(), m.stopPropagation(), g(m);
      }
    }));
    i.render(h, r);
    const d = () => {
      i.unmountComponentAtNode(r), r.remove();
    }, u = new MutationObserver((g) => {
      g.forEach((f) => {
        f.removedNodes.forEach((p) => {
          p === t && (d(), u.disconnect());
        });
      });
    });
    u.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(t, e) {
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const i = document.createElement("div");
    i.className = "tab-context-menu", i.style.cssText = `
      position: fixed;
      left: ${t.clientX}px;
      top: ${t.clientY}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 150px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `;
    const r = [
      {
        text: "重命名标签",
        action: () => this.renameTab(e)
      },
      {
        text: e.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(e)
      }
    ];
    r.push(
      {
        text: "关闭标签",
        action: () => this.closeTab(e),
        disabled: this.firstPanelTabs.length <= 1
      },
      {
        text: "关闭其他标签",
        action: () => this.closeOtherTabs(e),
        disabled: this.firstPanelTabs.length <= 1
      },
      {
        text: "关闭全部标签",
        action: () => this.closeAllTabs(),
        disabled: this.firstPanelTabs.length <= 1
      }
    ), r.forEach((o) => {
      const l = document.createElement("div");
      l.textContent = o.text, l.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        color: ${o.disabled ? "#999" : "#333"};
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
      `, o.disabled || (l.addEventListener("mouseenter", () => {
        l.style.backgroundColor = "#f0f0f0";
      }), l.addEventListener("mouseleave", () => {
        l.style.backgroundColor = "transparent";
      }), l.addEventListener("click", () => {
        o.action(), i.remove();
      })), i.appendChild(l);
    }), document.body.appendChild(i);
    const s = (o) => {
      i.contains(o.target) || (i.remove(), document.removeEventListener("click", s));
    };
    setTimeout(() => {
      document.addEventListener("click", s);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（使用API）
   */
  async saveFirstPanelTabs() {
    try {
      await this.storageService.saveConfig(v.FIRST_PANEL_TABS, this.firstPanelTabs), this.log("💾 保存标签数据到API配置");
    } catch (t) {
      this.warn("无法保存第一个面板标签数据:", t);
    }
  }
  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    try {
      await this.storageService.saveConfig(v.CLOSED_TABS, Array.from(this.closedTabs)), this.log("💾 保存已关闭标签列表到API配置");
    } catch (t) {
      this.warn("无法保存已关闭标签列表:", t);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    try {
      const t = await this.storageService.getConfig(v.FIRST_PANEL_TABS, "orca-tabs-plugin", []);
      t && Array.isArray(t) ? (this.firstPanelTabs = t, this.log(`📂 从API配置恢复了 ${this.firstPanelTabs.length} 个标签页`), await this.updateRestoredTabsBlockTypes()) : (this.firstPanelTabs = [], this.log("📂 没有找到持久化的标签数据，初始化为空数组"));
    } catch (t) {
      this.warn("无法恢复第一个面板标签数据:", t), this.firstPanelTabs = [];
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
    let t = !1;
    for (let e = 0; e < this.firstPanelTabs.length; e++) {
      const n = this.firstPanelTabs[e];
      if (!n.blockType || !n.icon)
        try {
          const r = await orca.invokeBackend("get-block", parseInt(n.blockId));
          if (r) {
            const s = await this.detectBlockType(r);
            let o = n.icon;
            o || (o = this.getBlockTypeIcon(s)), this.firstPanelTabs[e] = {
              ...n,
              blockType: s,
              icon: o
            }, this.log(`✅ 更新恢复的标签: ${n.title} -> 类型: ${s}, 图标: ${o}`), t = !0;
          }
        } catch (r) {
          this.warn(`更新恢复的标签失败: ${n.title}`, r);
        }
      else
        this.verboseLog(`⏭️ 跳过恢复的标签: ${n.title} (已有块类型和图标)`);
    }
    t && (this.log("🔄 检测到恢复的标签页有更新，保存到存储..."), await this.saveFirstPanelTabs()), this.log("✅ 恢复的标签页块类型和图标更新完成");
  }
  /**
   * 从持久化存储恢复已关闭标签列表（使用API）
   */
  async restoreClosedTabs() {
    try {
      const t = await this.storageService.getConfig(v.CLOSED_TABS, "orca-tabs-plugin", []);
      t && Array.isArray(t) ? (this.closedTabs = new Set(t), this.log(`📂 从API配置恢复了 ${this.closedTabs.size} 个已关闭标签`)) : (this.closedTabs = /* @__PURE__ */ new Set(), this.log("📂 没有找到持久化的已关闭标签数据，初始化为空集合"));
    } catch (t) {
      this.warn("无法恢复已关闭标签列表:", t), this.closedTabs = /* @__PURE__ */ new Set();
    }
  }
  // 注意：以下方法已废弃，现在使用API配置存储
  // getStorageKey() 和 getClosedTabsStorageKey() 方法已被移除
  // 现在使用 OrcaStorageService 和 PLUGIN_STORAGE_KEYS 进行存储
  /**
   * 简单的字符串哈希函数
   */
  hashString(t) {
    let e = 0;
    for (let n = 0; n < t.length; n++) {
      const i = t.charCodeAt(n);
      e = (e << 5) - e + i, e = e & e;
    }
    return Math.abs(e).toString(36);
  }
  startDrag(t) {
    t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.isDragging = !0;
    const e = this.isVerticalMode ? this.verticalPosition : this.position;
    this.dragStartX = t.clientX - e.x, this.dragStartY = t.clientY - e.y;
    const n = (r) => {
      this.isDragging && (r.preventDefault(), r.stopPropagation(), this.drag(r));
    }, i = (r) => {
      document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", i), this.stopDrag();
    };
    document.addEventListener("mousemove", n), document.addEventListener("mouseup", i), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(t) {
    if (!this.isDragging || !this.tabContainer) return;
    t.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = t.clientX - this.dragStartX, this.verticalPosition.y = t.clientY - this.dragStartY, this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = t.clientX - this.dragStartX, this.horizontalPosition.y = t.clientY - this.dragStartY, this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const e = this.tabContainer.getBoundingClientRect(), n = 5, i = window.innerWidth - e.width - 5, r = 5, s = window.innerHeight - e.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(n, Math.min(i, this.verticalPosition.x)), this.verticalPosition.y = Math.max(r, Math.min(s, this.verticalPosition.y)), this.position.x = this.verticalPosition.x, this.position.y = this.verticalPosition.y) : (this.horizontalPosition.x = Math.max(n, Math.min(i, this.horizontalPosition.x)), this.horizontalPosition.y = Math.max(r, Math.min(s, this.horizontalPosition.y)), this.position.x = this.horizontalPosition.x, this.position.y = this.horizontalPosition.y);
    const o = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = o.x + "px", this.tabContainer.style.top = o.y + "px", this.ensureClickableElements();
  }
  async stopDrag() {
    this.isDragging = !1, this.tabContainer && (this.tabContainer.style.cursor = "default", this.tabContainer.style.userSelect = "", this.tabContainer.style.pointerEvents = "auto", this.tabContainer.style.touchAction = ""), document.body.style.cursor = "", document.body.style.userSelect = "", document.body.style.pointerEvents = "", document.body.style.touchAction = "", document.documentElement.style.cursor = "", document.documentElement.style.userSelect = "", document.documentElement.style.pointerEvents = "", this.resetAllElements(), this.ensureClickableElements(), this.log("🔄 拖拽结束，清理所有拖拽状态"), await this.saveLayoutMode(), this.log(`💾 拖拽结束，位置已保存: ${this.isVerticalMode ? "垂直" : "水平"}模式 (${this.position.x}, ${this.position.y})`);
  }
  async savePosition() {
    try {
      const t = Fe(
        this.position,
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      );
      this.verticalPosition = t.verticalPosition, this.horizontalPosition = t.horizontalPosition, await this.saveLayoutMode(), this.log(`💾 位置已保存: ${at(this.position, this.isVerticalMode)}`);
    } catch {
      this.warn("无法保存标签位置");
    }
  }
  /**
   * 保存布局模式到API配置
   */
  async saveLayoutMode() {
    try {
      const t = {
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
      await this.storageService.saveConfig(v.LAYOUT_MODE, t), this.log(`💾 布局模式已保存: ${this.isVerticalMode ? "垂直" : "水平"}, 垂直宽度: ${this.verticalWidth}px, 垂直位置: (${this.verticalPosition.x}, ${this.verticalPosition.y}), 水平位置: (${this.horizontalPosition.x}, ${this.horizontalPosition.y})`);
    } catch (t) {
      this.error("保存布局模式失败:", t);
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
      this.position = z(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      ), this.position = Ne(this.position, this.isVerticalMode, this.verticalWidth), this.log(`📍 位置已恢复: ${at(this.position, this.isVerticalMode)}`);
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
        v.LAYOUT_MODE,
        "orca-tabs-plugin",
        F()
      );
      if (t) {
        const e = ze(t);
        this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.position = z(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.isSidebarAlignmentEnabled = e.isSidebarAlignmentEnabled, this.isFloatingWindowVisible = e.isFloatingWindowVisible, this.showBlockTypeIcons = e.showBlockTypeIcons, this.showInHeadbar = e.showInHeadbar, this.log(`📐 布局模式已恢复: ${Re(e)}, 当前位置: (${this.position.x}, ${this.position.y})`);
      } else {
        const e = F();
        this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.position = z(
          this.isVerticalMode,
          this.verticalPosition,
          this.horizontalPosition
        ), this.log("📐 布局模式: 水平 (默认)");
      }
    } catch (t) {
      this.error("恢复布局模式失败:", t);
      const e = F();
      this.isVerticalMode = e.isVerticalMode, this.verticalWidth = e.verticalWidth, this.verticalPosition = e.verticalPosition, this.horizontalPosition = e.horizontalPosition, this.position = z(
        this.isVerticalMode,
        this.verticalPosition,
        this.horizontalPosition
      );
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const t = this.isVerticalMode ? Math.min(this.firstPanelTabs.length * 28 + 8, window.innerHeight * 0.8) : 28;
    this.position = rn(this.position, this.isVerticalMode, this.verticalWidth, t);
  }
  /**
   * 检查新添加的块
   */
  async checkForNewBlocks() {
    this.panelIds.length === 0 || !this.isInitialized || (this.currentPanelIndex === 0 ? await this.checkFirstPanelBlocks() : this.debouncedUpdateTabsUI());
  }
  /**
   * 检查第一个面板的当前激活页面
   */
  async checkFirstPanelBlocks() {
    var h, d, u;
    const t = this.panelIds[0], e = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!e) return;
    const n = e.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) {
      this.log("第一个面板中没有找到激活的块编辑器");
      return;
    }
    const i = n.getAttribute("data-block-id");
    if (!i) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    const r = this.firstPanelTabs.find((g) => g.blockId === i);
    if (r) {
      this.verboseLog(`📋 当前激活页面已存在: "${r.title}"`);
      const g = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tab");
      g == null || g.forEach((p) => p.removeAttribute("data-focused"));
      const f = (d = this.tabContainer) == null ? void 0 : d.querySelector(`[data-tab-id="${i}"]`);
      f && (f.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${r.title}"`)), this.debouncedUpdateTabsUI();
      return;
    }
    let s = this.firstPanelTabs.length, o = !1;
    const l = (u = this.tabContainer) == null ? void 0 : u.querySelector('.orca-tab[data-focused="true"]');
    if (l) {
      const g = l.getAttribute("data-tab-id");
      if (g) {
        const f = this.firstPanelTabs.findIndex((p) => p.blockId === g);
        f !== -1 ? this.firstPanelTabs[f].isPinned ? (s = f + 1, o = !1, this.log("📌 聚焦标签是固定的，将在其后面插入新标签")) : (s = f, o = !0, this.log("🎯 聚焦标签不是固定的，将替换聚焦标签")) : this.log("🎯 聚焦的标签不在数组中，插入到末尾");
      } else
        this.log("🎯 聚焦的标签没有data-tab-id，插入到末尾");
    } else
      this.log("🎯 没有找到聚焦的标签，将替换最后一个非固定标签");
    this.log(`🎯 最终计算的insertIndex: ${s}, 是否替换聚焦标签: ${o}`);
    const c = await this.getTabInfo(i, t, this.firstPanelTabs.length);
    if (c) {
      if (this.verboseLog(`📋 检测到新的激活页面: "${c.title}"`), this.firstPanelTabs.length >= this.maxTabs)
        if (o && s < this.firstPanelTabs.length) {
          const g = this.firstPanelTabs[s];
          this.firstPanelTabs[s] = c, this.log(`🔄 替换聚焦标签: "${g.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((f, p) => `${p}:${f.title}`));
        } else if (s < this.firstPanelTabs.length) {
          this.log("🎯 插入前数组:", this.firstPanelTabs.map((f, p) => `${p}:${f.title}`)), this.firstPanelTabs.splice(s + 1, 0, c), this.log(`➕ 在位置 ${s + 1} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((f, p) => `${p}:${f.title}`));
          const g = this.findLastNonPinnedTabIndex();
          if (g !== -1) {
            const f = this.firstPanelTabs[g];
            this.firstPanelTabs.splice(g, 1), this.log(`🗑️ 删除末尾的非固定标签: "${f.title}" 来保持数量限制`), this.log("🎯 最终数组:", this.firstPanelTabs.map((p, m) => `${m}:${p.title}`));
          } else {
            const f = this.firstPanelTabs.findIndex((p) => p.blockId === c.blockId);
            if (f !== -1) {
              this.firstPanelTabs.splice(f, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
              return;
            }
          }
        } else {
          const g = this.findLastNonPinnedTabIndex();
          if (g !== -1) {
            const f = this.firstPanelTabs[g];
            this.firstPanelTabs[g] = c, this.log(`🔄 没有聚焦标签，替换最后一个非固定标签: "${f.title}" -> "${c.title}"`);
          } else {
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
            return;
          }
        }
      else if (o && s < this.firstPanelTabs.length) {
        const g = this.firstPanelTabs[s];
        this.firstPanelTabs[s] = c, this.log(`🔄 替换聚焦标签: "${g.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((f, p) => `${p}:${f.title}`));
      } else
        this.firstPanelTabs.splice(s, 0, c), this.verboseLog(`➕ 在位置 ${s} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((g, f) => `${f}:${g.title}`));
      this.closedTabs.has(i) && (this.closedTabs.delete(i), await this.saveClosedTabs(), this.log(`🔄 标签 "${c.title}" 重新显示，从已关闭列表中移除`)), await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI();
    } else
      this.log("无法获取激活页面的标签信息");
  }
  observeChanges() {
    new MutationObserver(async (e) => {
      let n = !1, i = !1, r = !1, s = this.currentPanelIndex;
      e.forEach((o) => {
        if (o.type === "childList") {
          const l = o.target;
          if ((l.classList.contains("orca-panels-row") || l.closest(".orca-panels-row")) && (this.verboseLog("🔍 检测到面板行变化，检查新面板..."), i = !0), o.addedNodes.length > 0 && l.closest(".orca-panel")) {
            for (const h of o.addedNodes)
              if (h.nodeType === Node.ELEMENT_NODE) {
                const d = h;
                if (d.classList.contains("orca-block-editor") || d.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        o.type === "attributes" && o.attributeName === "class" && o.target.classList.contains("orca-panel") && (r = !0);
      }), r && (await this.updateCurrentPanelIndex(), s !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${s} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), i && setTimeout(async () => {
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
    const t = this.panelIds.length, e = [...this.panelIds];
    if (this.currentPanelId, this.discoverPanels(), this.panelIds.length > t)
      this.log(`🎉 发现新面板！从 ${t} 个增加到 ${this.panelIds.length} 个`), await this.createTabsUI();
    else if (this.panelIds.length < t) {
      this.log(`📉 面板数量减少！从 ${t} 个减少到 ${this.panelIds.length} 个`), this.log(`📋 旧面板列表: [${e.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const n = e[0], i = this.panelIds[0];
      n && i && n !== i && (this.log(`🔄 第一个面板已变更: ${n} -> ${i}`), await this.handleFirstPanelChange(n, i)), this.currentPanelId && !this.panelIds.includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0]), await this.createTabsUI();
    }
  }
  /**
   * 更新当前面板索引
   */
  async updateCurrentPanelIndex() {
    const t = document.querySelector(".orca-panel.active");
    if (t) {
      const e = t.getAttribute("data-panel-id");
      if (e) {
        const n = this.panelIds.indexOf(e);
        n !== -1 && (this.currentPanelIndex = n, this.currentPanelId = e, this.debouncedUpdateTabsUI());
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
    }, 2e3), this.globalEventListener = async (t) => {
      await this.handleGlobalEvent(t);
    }, document.addEventListener("click", this.globalEventListener, { passive: !0 }), document.addEventListener("contextmenu", this.globalEventListener, { passive: !0 });
  }
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
    if ((t.ctrlKey || t.metaKey) && t.target) {
      const n = t.target, i = this.getBlockRefId(n);
      if (i) {
        t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.log(`🔗 检测到 Ctrl+点击 块引用: ${i}，将在后台新建标签页`), await this.openInNewTab(i);
        return;
      }
    }
    if (t.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
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
  async handleContextMenuEvent(t) {
    const e = t.target, n = this.getBlockRefId(e);
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
    const e = [...this.panelIds];
    this.discoverPanels();
    const n = un(e, this.panelIds);
    if (n) {
      this.log(`📋 面板列表发生变化: ${e.length} -> ${this.panelIds.length}`), this.log(`📋 旧面板列表: [${e.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const r = e[0], s = this.panelIds[0];
      r && s && r !== s && (this.log(`🔄 第一个面板已变更: ${r} -> ${s}`), this.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), await this.handleFirstPanelChange(r, s), this.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`));
    }
    const i = document.querySelector(".orca-panel.active");
    if (i) {
      const r = i.getAttribute("data-panel-id");
      if (r && (r !== this.currentPanelId || n)) {
        const s = this.currentPanelIndex, o = this.panelIds.indexOf(r);
        o !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${r} (索引: ${s} -> ${o})`), this.currentPanelIndex = o, this.currentPanelId = r, this.debouncedUpdateTabsUI());
      }
    }
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(t, e) {
    this.log(`🔄 处理第一个面板变更: ${t} -> ${e}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), this.log(`🗑️ 清空旧面板 ${t} 的固化标签数据`), this.firstPanelTabs = [], this.log(`🔍 为新的第一个面板 ${e} 创建固化标签`), await this.scanFirstPanel(), await this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，新建了 ${this.firstPanelTabs.length} 个固化标签`), this.log("✅ 新的固化标签:", this.firstPanelTabs.map((n) => `${n.title}(${n.blockId})`));
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
    this.log("🔄 开始重置插件缓存..."), this.firstPanelTabs = [], this.closedTabs.clear();
    try {
      await this.storageService.removeConfig(v.FIRST_PANEL_TABS), await this.storageService.removeConfig(v.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
    } catch (t) {
      this.warn("删除API配置缓存失败:", t);
    }
    this.panelIds.length > 0 && (this.log("🔍 重新扫描第一个面板..."), await this.scanFirstPanel(), await this.saveFirstPanelTabs()), await this.updateTabsUI(), this.log("✅ 插件缓存重置完成");
  }
  destroy() {
    this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
    const t = document.getElementById("orca-tabs-drag-styles");
    t && t.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null;
  }
}
let x = null;
async function wn(a) {
  B = a, wt(orca.state.locale, { "zh-CN": Tt }), x = new yn(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => x == null ? void 0 : x.init(), 500);
  }) : setTimeout(() => x == null ? void 0 : x.init(), 500), orca.commands.registerCommand(
    `${B}.resetCache`,
    async () => {
      x && await x.resetCache();
    },
    "重置插件缓存"
  ), orca.commands.registerCommand(
    `${B}.toggleBlockIcons`,
    async () => {
      x && await x.toggleBlockTypeIcons();
    },
    "切换块类型图标显示"
  ), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && (console.log(vt("标签页插件已启动")), console.log(`${B} loaded.`));
}
async function vn() {
  x && (x.unregisterHeadbarButton(), x.cleanupDragResize(), x.destroy(), x = null), orca.commands.unregisterCommand(`${B}.resetCache`);
}
export {
  wn as load,
  vn as unload
};
