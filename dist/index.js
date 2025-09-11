var ct = Object.defineProperty;
var dt = (r, t, e) => t in r ? ct(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var m = (r, t, e) => dt(r, typeof t != "symbol" ? t + "" : t, e);
let tt = "en", et = {};
function ht(r, t) {
  tt = r, et = t;
}
function N(r, t, e) {
  var a;
  return ((a = et[e ?? tt]) == null ? void 0 : a[r]) ?? r;
}
const ut = {
  标签页插件已启动: "标签页插件已启动",
  "your plugin code starts here": "您的插件代码从这里开始",
  今天: "今天",
  昨天: "昨天",
  明天: "明天"
}, nt = 6048e5, gt = 864e5, X = Symbol.for("constructDateFrom");
function I(r, t) {
  return typeof r == "function" ? r(t) : r && typeof r == "object" && X in r ? r[X](t) : r instanceof Date ? new r.constructor(t) : new Date(t);
}
function P(r, t) {
  return I(t || r, r);
}
function at(r, t, e) {
  const n = P(r, e == null ? void 0 : e.in);
  return isNaN(t) ? I(r, NaN) : (t && n.setDate(n.getDate() + t), n);
}
let ft = {};
function q() {
  return ft;
}
function A(r, t) {
  var o, l, c, u;
  const e = q(), n = (t == null ? void 0 : t.weekStartsOn) ?? ((l = (o = t == null ? void 0 : t.locale) == null ? void 0 : o.options) == null ? void 0 : l.weekStartsOn) ?? e.weekStartsOn ?? ((u = (c = e.locale) == null ? void 0 : c.options) == null ? void 0 : u.weekStartsOn) ?? 0, a = P(r, t == null ? void 0 : t.in), i = a.getDay(), s = (i < n ? 7 : 0) + i - n;
  return a.setDate(a.getDate() - s), a.setHours(0, 0, 0, 0), a;
}
function F(r, t) {
  return A(r, { ...t, weekStartsOn: 1 });
}
function it(r, t) {
  const e = P(r, t == null ? void 0 : t.in), n = e.getFullYear(), a = I(e, 0);
  a.setFullYear(n + 1, 0, 4), a.setHours(0, 0, 0, 0);
  const i = F(a), s = I(e, 0);
  s.setFullYear(n, 0, 4), s.setHours(0, 0, 0, 0);
  const o = F(s);
  return e.getTime() >= i.getTime() ? n + 1 : e.getTime() >= o.getTime() ? n : n - 1;
}
function j(r) {
  const t = P(r), e = new Date(
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
  return e.setUTCFullYear(t.getFullYear()), +r - +e;
}
function rt(r, ...t) {
  const e = I.bind(
    null,
    t.find((n) => typeof n == "object")
  );
  return t.map(e);
}
function R(r, t) {
  const e = P(r, t == null ? void 0 : t.in);
  return e.setHours(0, 0, 0, 0), e;
}
function bt(r, t, e) {
  const [n, a] = rt(
    e == null ? void 0 : e.in,
    r,
    t
  ), i = R(n), s = R(a), o = +i - j(i), l = +s - j(s);
  return Math.round((o - l) / gt);
}
function mt(r, t) {
  const e = it(r, t), n = I(r, 0);
  return n.setFullYear(e, 0, 4), n.setHours(0, 0, 0, 0), F(n);
}
function U(r) {
  return I(r, Date.now());
}
function H(r, t, e) {
  const [n, a] = rt(
    e == null ? void 0 : e.in,
    r,
    t
  );
  return +R(n) == +R(a);
}
function pt(r) {
  return r instanceof Date || typeof r == "object" && Object.prototype.toString.call(r) === "[object Date]";
}
function yt(r) {
  return !(!pt(r) && typeof r != "number" || isNaN(+P(r)));
}
function wt(r, t) {
  const e = P(r, t == null ? void 0 : t.in);
  return e.setFullYear(e.getFullYear(), 0, 1), e.setHours(0, 0, 0, 0), e;
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
}, vt = (r, t, e) => {
  let n;
  const a = xt[r];
  return typeof a == "string" ? n = a : t === 1 ? n = a.one : n = a.other.replace("{{count}}", t.toString()), e != null && e.addSuffix ? e.comparison && e.comparison > 0 ? "in " + n : n + " ago" : n;
};
function V(r) {
  return (t = {}) => {
    const e = t.width ? String(t.width) : r.defaultWidth;
    return r.formats[e] || r.formats[r.defaultWidth];
  };
}
const Tt = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, It = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, Pt = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, kt = {
  date: V({
    formats: Tt,
    defaultWidth: "full"
  }),
  time: V({
    formats: It,
    defaultWidth: "full"
  }),
  dateTime: V({
    formats: Pt,
    defaultWidth: "full"
  })
}, St = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ct = (r, t, e, n) => St[r];
function L(r) {
  return (t, e) => {
    const n = e != null && e.context ? String(e.context) : "standalone";
    let a;
    if (n === "formatting" && r.formattingValues) {
      const s = r.defaultFormattingWidth || r.defaultWidth, o = e != null && e.width ? String(e.width) : s;
      a = r.formattingValues[o] || r.formattingValues[s];
    } else {
      const s = r.defaultWidth, o = e != null && e.width ? String(e.width) : r.defaultWidth;
      a = r.values[o] || r.values[s];
    }
    const i = r.argumentCallback ? r.argumentCallback(t) : t;
    return a[i];
  };
}
const $t = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Mt = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, Et = {
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
}, Dt = {
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
}, Ot = {
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
}, At = (r, t) => {
  const e = Number(r), n = e % 100;
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
}, Bt = {
  ordinalNumber: At,
  era: L({
    values: $t,
    defaultWidth: "wide"
  }),
  quarter: L({
    values: Mt,
    defaultWidth: "wide",
    argumentCallback: (r) => r - 1
  }),
  month: L({
    values: Et,
    defaultWidth: "wide"
  }),
  day: L({
    values: Dt,
    defaultWidth: "wide"
  }),
  dayPeriod: L({
    values: Lt,
    defaultWidth: "wide",
    formattingValues: Ot,
    defaultFormattingWidth: "wide"
  })
};
function O(r) {
  return (t, e = {}) => {
    const n = e.width, a = n && r.matchPatterns[n] || r.matchPatterns[r.defaultMatchWidth], i = t.match(a);
    if (!i)
      return null;
    const s = i[0], o = n && r.parsePatterns[n] || r.parsePatterns[r.defaultParseWidth], l = Array.isArray(o) ? Wt(o, (h) => h.test(s)) : (
      // [TODO] -- I challenge you to fix the type
      Nt(o, (h) => h.test(s))
    );
    let c;
    c = r.valueCallback ? r.valueCallback(l) : l, c = e.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      e.valueCallback(c)
    ) : c;
    const u = t.slice(s.length);
    return { value: c, rest: u };
  };
}
function Nt(r, t) {
  for (const e in r)
    if (Object.prototype.hasOwnProperty.call(r, e) && t(r[e]))
      return e;
}
function Wt(r, t) {
  for (let e = 0; e < r.length; e++)
    if (t(r[e]))
      return e;
}
function Ft(r) {
  return (t, e = {}) => {
    const n = t.match(r.matchPattern);
    if (!n) return null;
    const a = n[0], i = t.match(r.parsePattern);
    if (!i) return null;
    let s = r.valueCallback ? r.valueCallback(i[0]) : i[0];
    s = e.valueCallback ? e.valueCallback(s) : s;
    const o = t.slice(a.length);
    return { value: s, rest: o };
  };
}
const Rt = /^(\d+)(th|st|nd|rd)?/i, qt = /\d+/i, _t = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, zt = {
  any: [/^b/i, /^(a|c)/i]
}, Yt = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Vt = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Ut = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, Ht = {
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
}, Xt = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, jt = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Gt = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Jt = {
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
}, Kt = {
  ordinalNumber: Ft({
    matchPattern: Rt,
    parsePattern: qt,
    valueCallback: (r) => parseInt(r, 10)
  }),
  era: O({
    matchPatterns: _t,
    defaultMatchWidth: "wide",
    parsePatterns: zt,
    defaultParseWidth: "any"
  }),
  quarter: O({
    matchPatterns: Yt,
    defaultMatchWidth: "wide",
    parsePatterns: Vt,
    defaultParseWidth: "any",
    valueCallback: (r) => r + 1
  }),
  month: O({
    matchPatterns: Ut,
    defaultMatchWidth: "wide",
    parsePatterns: Ht,
    defaultParseWidth: "any"
  }),
  day: O({
    matchPatterns: Xt,
    defaultMatchWidth: "wide",
    parsePatterns: jt,
    defaultParseWidth: "any"
  }),
  dayPeriod: O({
    matchPatterns: Gt,
    defaultMatchWidth: "any",
    parsePatterns: Jt,
    defaultParseWidth: "any"
  })
}, Qt = {
  code: "en-US",
  formatDistance: vt,
  formatLong: kt,
  formatRelative: Ct,
  localize: Bt,
  match: Kt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Zt(r, t) {
  const e = P(r, t == null ? void 0 : t.in);
  return bt(e, wt(e)) + 1;
}
function te(r, t) {
  const e = P(r, t == null ? void 0 : t.in), n = +F(e) - +mt(e);
  return Math.round(n / nt) + 1;
}
function st(r, t) {
  var u, h, g, d;
  const e = P(r, t == null ? void 0 : t.in), n = e.getFullYear(), a = q(), i = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((h = (u = t == null ? void 0 : t.locale) == null ? void 0 : u.options) == null ? void 0 : h.firstWeekContainsDate) ?? a.firstWeekContainsDate ?? ((d = (g = a.locale) == null ? void 0 : g.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, s = I((t == null ? void 0 : t.in) || r, 0);
  s.setFullYear(n + 1, 0, i), s.setHours(0, 0, 0, 0);
  const o = A(s, t), l = I((t == null ? void 0 : t.in) || r, 0);
  l.setFullYear(n, 0, i), l.setHours(0, 0, 0, 0);
  const c = A(l, t);
  return +e >= +o ? n + 1 : +e >= +c ? n : n - 1;
}
function ee(r, t) {
  var o, l, c, u;
  const e = q(), n = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((l = (o = t == null ? void 0 : t.locale) == null ? void 0 : o.options) == null ? void 0 : l.firstWeekContainsDate) ?? e.firstWeekContainsDate ?? ((u = (c = e.locale) == null ? void 0 : c.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, a = st(r, t), i = I((t == null ? void 0 : t.in) || r, 0);
  return i.setFullYear(a, 0, n), i.setHours(0, 0, 0, 0), A(i, t);
}
function ne(r, t) {
  const e = P(r, t == null ? void 0 : t.in), n = +A(e, t) - +ee(e, t);
  return Math.round(n / nt) + 1;
}
function y(r, t) {
  const e = r < 0 ? "-" : "", n = Math.abs(r).toString().padStart(t, "0");
  return e + n;
}
const k = {
  // Year
  y(r, t) {
    const e = r.getFullYear(), n = e > 0 ? e : 1 - e;
    return y(t === "yy" ? n % 100 : n, t.length);
  },
  // Month
  M(r, t) {
    const e = r.getMonth();
    return t === "M" ? String(e + 1) : y(e + 1, 2);
  },
  // Day of the month
  d(r, t) {
    return y(r.getDate(), t.length);
  },
  // AM or PM
  a(r, t) {
    const e = r.getHours() / 12 >= 1 ? "pm" : "am";
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
  h(r, t) {
    return y(r.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(r, t) {
    return y(r.getHours(), t.length);
  },
  // Minute
  m(r, t) {
    return y(r.getMinutes(), t.length);
  },
  // Second
  s(r, t) {
    return y(r.getSeconds(), t.length);
  },
  // Fraction of second
  S(r, t) {
    const e = t.length, n = r.getMilliseconds(), a = Math.trunc(
      n * Math.pow(10, e - 3)
    );
    return y(a, t.length);
  }
}, $ = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, G = {
  // Era
  G: function(r, t, e) {
    const n = r.getFullYear() > 0 ? 1 : 0;
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
  y: function(r, t, e) {
    if (t === "yo") {
      const n = r.getFullYear(), a = n > 0 ? n : 1 - n;
      return e.ordinalNumber(a, { unit: "year" });
    }
    return k.y(r, t);
  },
  // Local week-numbering year
  Y: function(r, t, e, n) {
    const a = st(r, n), i = a > 0 ? a : 1 - a;
    if (t === "YY") {
      const s = i % 100;
      return y(s, 2);
    }
    return t === "Yo" ? e.ordinalNumber(i, { unit: "year" }) : y(i, t.length);
  },
  // ISO week-numbering year
  R: function(r, t) {
    const e = it(r);
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
  u: function(r, t) {
    const e = r.getFullYear();
    return y(e, t.length);
  },
  // Quarter
  Q: function(r, t, e) {
    const n = Math.ceil((r.getMonth() + 1) / 3);
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
  q: function(r, t, e) {
    const n = Math.ceil((r.getMonth() + 1) / 3);
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
  M: function(r, t, e) {
    const n = r.getMonth();
    switch (t) {
      case "M":
      case "MM":
        return k.M(r, t);
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
  L: function(r, t, e) {
    const n = r.getMonth();
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
  w: function(r, t, e, n) {
    const a = ne(r, n);
    return t === "wo" ? e.ordinalNumber(a, { unit: "week" }) : y(a, t.length);
  },
  // ISO week of year
  I: function(r, t, e) {
    const n = te(r);
    return t === "Io" ? e.ordinalNumber(n, { unit: "week" }) : y(n, t.length);
  },
  // Day of the month
  d: function(r, t, e) {
    return t === "do" ? e.ordinalNumber(r.getDate(), { unit: "date" }) : k.d(r, t);
  },
  // Day of year
  D: function(r, t, e) {
    const n = Zt(r);
    return t === "Do" ? e.ordinalNumber(n, { unit: "dayOfYear" }) : y(n, t.length);
  },
  // Day of week
  E: function(r, t, e) {
    const n = r.getDay();
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
  e: function(r, t, e, n) {
    const a = r.getDay(), i = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "e":
        return String(i);
      case "ee":
        return y(i, 2);
      case "eo":
        return e.ordinalNumber(i, { unit: "day" });
      case "eee":
        return e.day(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return e.day(a, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return e.day(a, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return e.day(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(r, t, e, n) {
    const a = r.getDay(), i = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "c":
        return String(i);
      case "cc":
        return y(i, t.length);
      case "co":
        return e.ordinalNumber(i, { unit: "day" });
      case "ccc":
        return e.day(a, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return e.day(a, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return e.day(a, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return e.day(a, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(r, t, e) {
    const n = r.getDay(), a = n === 0 ? 7 : n;
    switch (t) {
      case "i":
        return String(a);
      case "ii":
        return y(a, t.length);
      case "io":
        return e.ordinalNumber(a, { unit: "day" });
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
  a: function(r, t, e) {
    const a = r.getHours() / 12 >= 1 ? "pm" : "am";
    switch (t) {
      case "a":
      case "aa":
        return e.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return e.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return e.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return e.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(r, t, e) {
    const n = r.getHours();
    let a;
    switch (n === 12 ? a = $.noon : n === 0 ? a = $.midnight : a = n / 12 >= 1 ? "pm" : "am", t) {
      case "b":
      case "bb":
        return e.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return e.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return e.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return e.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(r, t, e) {
    const n = r.getHours();
    let a;
    switch (n >= 17 ? a = $.evening : n >= 12 ? a = $.afternoon : n >= 4 ? a = $.morning : a = $.night, t) {
      case "B":
      case "BB":
      case "BBB":
        return e.dayPeriod(a, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return e.dayPeriod(a, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return e.dayPeriod(a, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function(r, t, e) {
    if (t === "ho") {
      let n = r.getHours() % 12;
      return n === 0 && (n = 12), e.ordinalNumber(n, { unit: "hour" });
    }
    return k.h(r, t);
  },
  // Hour [0-23]
  H: function(r, t, e) {
    return t === "Ho" ? e.ordinalNumber(r.getHours(), { unit: "hour" }) : k.H(r, t);
  },
  // Hour [0-11]
  K: function(r, t, e) {
    const n = r.getHours() % 12;
    return t === "Ko" ? e.ordinalNumber(n, { unit: "hour" }) : y(n, t.length);
  },
  // Hour [1-24]
  k: function(r, t, e) {
    let n = r.getHours();
    return n === 0 && (n = 24), t === "ko" ? e.ordinalNumber(n, { unit: "hour" }) : y(n, t.length);
  },
  // Minute
  m: function(r, t, e) {
    return t === "mo" ? e.ordinalNumber(r.getMinutes(), { unit: "minute" }) : k.m(r, t);
  },
  // Second
  s: function(r, t, e) {
    return t === "so" ? e.ordinalNumber(r.getSeconds(), { unit: "second" }) : k.s(r, t);
  },
  // Fraction of second
  S: function(r, t) {
    return k.S(r, t);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(r, t, e) {
    const n = r.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (t) {
      case "X":
        return K(n);
      case "XXXX":
      case "XX":
        return C(n);
      case "XXXXX":
      case "XXX":
      default:
        return C(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(r, t, e) {
    const n = r.getTimezoneOffset();
    switch (t) {
      case "x":
        return K(n);
      case "xxxx":
      case "xx":
        return C(n);
      case "xxxxx":
      case "xxx":
      default:
        return C(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(r, t, e) {
    const n = r.getTimezoneOffset();
    switch (t) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + J(n, ":");
      case "OOOO":
      default:
        return "GMT" + C(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(r, t, e) {
    const n = r.getTimezoneOffset();
    switch (t) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + J(n, ":");
      case "zzzz":
      default:
        return "GMT" + C(n, ":");
    }
  },
  // Seconds timestamp
  t: function(r, t, e) {
    const n = Math.trunc(+r / 1e3);
    return y(n, t.length);
  },
  // Milliseconds timestamp
  T: function(r, t, e) {
    return y(+r, t.length);
  }
};
function J(r, t = "") {
  const e = r > 0 ? "-" : "+", n = Math.abs(r), a = Math.trunc(n / 60), i = n % 60;
  return i === 0 ? e + String(a) : e + String(a) + t + y(i, 2);
}
function K(r, t) {
  return r % 60 === 0 ? (r > 0 ? "-" : "+") + y(Math.abs(r) / 60, 2) : C(r, t);
}
function C(r, t = "") {
  const e = r > 0 ? "-" : "+", n = Math.abs(r), a = y(Math.trunc(n / 60), 2), i = y(n % 60, 2);
  return e + a + t + i;
}
const Q = (r, t) => {
  switch (r) {
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
}, ot = (r, t) => {
  switch (r) {
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
}, ae = (r, t) => {
  const e = r.match(/(P+)(p+)?/) || [], n = e[1], a = e[2];
  if (!a)
    return Q(r, t);
  let i;
  switch (n) {
    case "P":
      i = t.dateTime({ width: "short" });
      break;
    case "PP":
      i = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      i = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      i = t.dateTime({ width: "full" });
      break;
  }
  return i.replace("{{date}}", Q(n, t)).replace("{{time}}", ot(a, t));
}, ie = {
  p: ot,
  P: ae
}, re = /^D+$/, se = /^Y+$/, oe = ["D", "DD", "YY", "YYYY"];
function le(r) {
  return re.test(r);
}
function ce(r) {
  return se.test(r);
}
function de(r, t, e) {
  const n = he(r, t, e);
  if (console.warn(n), oe.includes(r)) throw new RangeError(n);
}
function he(r, t, e) {
  const n = r[0] === "Y" ? "years" : "days of the month";
  return `Use \`${r.toLowerCase()}\` instead of \`${r}\` (in \`${t}\`) for formatting ${n} to the input \`${e}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const ue = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, ge = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, fe = /^'([^]*?)'?$/, be = /''/g, me = /[a-zA-Z]/;
function B(r, t, e) {
  var u, h, g, d;
  const n = q(), a = n.locale ?? Qt, i = n.firstWeekContainsDate ?? ((h = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : h.firstWeekContainsDate) ?? 1, s = n.weekStartsOn ?? ((d = (g = n.locale) == null ? void 0 : g.options) == null ? void 0 : d.weekStartsOn) ?? 0, o = P(r, e == null ? void 0 : e.in);
  if (!yt(o))
    throw new RangeError("Invalid time value");
  let l = t.match(ge).map((f) => {
    const b = f[0];
    if (b === "p" || b === "P") {
      const p = ie[b];
      return p(f, a.formatLong);
    }
    return f;
  }).join("").match(ue).map((f) => {
    if (f === "''")
      return { isToken: !1, value: "'" };
    const b = f[0];
    if (b === "'")
      return { isToken: !1, value: pe(f) };
    if (G[b])
      return { isToken: !0, value: f };
    if (b.match(me))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + b + "`"
      );
    return { isToken: !1, value: f };
  });
  a.localize.preprocessor && (l = a.localize.preprocessor(o, l));
  const c = {
    firstWeekContainsDate: i,
    weekStartsOn: s,
    locale: a
  };
  return l.map((f) => {
    if (!f.isToken) return f.value;
    const b = f.value;
    (ce(b) || le(b)) && de(b, t, String(r));
    const p = G[b[0]];
    return p(o, b, a.localize, c);
  }).join("");
}
function pe(r) {
  const t = r.match(fe);
  return t ? t[1].replace(be, "'") : r;
}
function ye(r, t) {
  return H(
    I(r, r),
    U(r)
  );
}
function we(r, t) {
  return H(
    r,
    at(U(r), 1),
    t
  );
}
function xe(r, t, e) {
  return at(r, -1, e);
}
function ve(r, t) {
  return H(
    I(r, r),
    xe(U(r))
  );
}
const Z = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
}, Te = {
  JSON: 0,
  Text: 1
};
let W;
const w = {
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
class Ie {
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
      const a = typeof e == "string" ? e : JSON.stringify(e);
      return await orca.plugins.setData(n, t, a), this.log(`💾 已保存插件数据 ${t}:`, e), !0;
    } catch (a) {
      return this.warn(`无法保存插件数据 ${t}，尝试降级到localStorage:`, a), this.saveToLocalStorage(t, e);
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
      const a = await orca.plugins.getData(e, t);
      if (a == null)
        return n || null;
      let i;
      if (typeof a == "string")
        try {
          i = JSON.parse(a);
        } catch {
          i = a;
        }
      else
        i = a;
      return this.log(`📂 已读取插件数据 ${t}:`, i), i;
    } catch (a) {
      return this.warn(`无法读取插件数据 ${t}，尝试从localStorage读取:`, a), this.getFromLocalStorage(t, n);
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
      const n = this.getLocalStorageKey(t), a = localStorage.getItem(n);
      if (a) {
        const i = JSON.parse(a);
        return this.log(`📂 已从localStorage读取: ${n}`), i;
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
      [w.FIRST_PANEL_TABS]: "orca-first-panel-tabs-api",
      [w.CLOSED_TABS]: "orca-closed-tabs-api",
      [w.FLOATING_WINDOW_VISIBLE]: "orca-tabs-visible-api",
      [w.TABS_POSITION]: "orca-tabs-position-api",
      [w.LAYOUT_MODE]: "orca-tabs-layout-api"
    }[t] || `orca-plugin-storage-${t}`;
  }
  /**
   * 迁移localStorage数据到API配置
   * 检查是否存在旧的localStorage数据，如果存在则迁移到API配置
   */
  async migrateFromLocalStorage() {
    try {
      this.log("🔄 开始检查并迁移localStorage数据..."), await this.migrateTabData(), await this.migrateClosedTabs(), await this.migrateFloatingWindowVisibility(), await this.migratePosition(), await this.migrateLayoutMode(), this.log("✅ 数据迁移完成");
    } catch (t) {
      this.error("数据迁移失败:", t);
    }
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
      const a = await this.getConfig("test-object", "orca-tabs-plugin");
      this.log(`对象测试: ${JSON.stringify(n) === JSON.stringify(a) ? "✅" : "❌"}`);
      const i = [1, 2, 3, { nested: !0 }];
      await this.saveConfig("test-array", i);
      const s = await this.getConfig("test-array", "orca-tabs-plugin");
      this.log(`数组测试: ${JSON.stringify(i) === JSON.stringify(s) ? "✅" : "❌"}`), await this.removeConfig("test-string"), await this.removeConfig("test-object"), await this.removeConfig("test-array"), this.log("🧪 API配置序列化测试完成");
    } catch (t) {
      this.error("API配置序列化测试失败:", t);
    }
  }
  /**
   * 迁移标签页数据
   */
  async migrateTabData() {
    try {
      const t = this.getOldLocalStorageKeys();
      let e = !1;
      for (const n of t) {
        const a = localStorage.getItem(n);
        if (a)
          try {
            const i = JSON.parse(a);
            if (Array.isArray(i) && i.length > 0) {
              await this.saveConfig(w.FIRST_PANEL_TABS, i), this.log(`📦 已迁移标签页数据: ${n} -> API配置`), e = !0;
              break;
            }
          } catch (i) {
            this.warn(`解析旧标签页数据失败: ${n}`, i);
          }
      }
      e || this.log("📦 没有找到需要迁移的标签页数据");
    } catch (t) {
      this.warn("迁移标签页数据失败:", t);
    }
  }
  /**
   * 迁移已关闭标签列表
   */
  async migrateClosedTabs() {
    try {
      const t = this.getOldClosedTabsKeys();
      let e = !1;
      for (const n of t) {
        const a = localStorage.getItem(n);
        if (a)
          try {
            const i = JSON.parse(a);
            if (Array.isArray(i)) {
              await this.saveConfig(w.CLOSED_TABS, i), this.log(`📦 已迁移已关闭标签列表: ${n} -> API配置`), e = !0;
              break;
            }
          } catch (i) {
            this.warn(`解析旧已关闭标签数据失败: ${n}`, i);
          }
      }
      e || this.log("📦 没有找到需要迁移的已关闭标签数据");
    } catch (t) {
      this.warn("迁移已关闭标签数据失败:", t);
    }
  }
  /**
   * 迁移浮窗可见状态
   */
  async migrateFloatingWindowVisibility() {
    try {
      const t = localStorage.getItem("orca-tabs-visible");
      if (t !== null) {
        const e = t === "true";
        await this.saveConfig(w.FLOATING_WINDOW_VISIBLE, e), this.log("📦 已迁移浮窗可见状态: orca-tabs-visible -> API配置");
      } else
        this.log("📦 没有找到需要迁移的浮窗可见状态数据");
    } catch (t) {
      this.warn("迁移浮窗可见状态失败:", t);
    }
  }
  /**
   * 迁移位置数据
   */
  async migratePosition() {
    try {
      const t = localStorage.getItem("orca-tabs-position");
      if (t)
        try {
          const e = JSON.parse(t);
          e && typeof e.x == "number" && typeof e.y == "number" && (await this.saveConfig(w.TABS_POSITION, e), this.log("📦 已迁移位置数据: orca-tabs-position -> API配置"));
        } catch (e) {
          this.warn("解析旧位置数据失败:", e);
        }
      else
        this.log("📦 没有找到需要迁移的位置数据");
    } catch (t) {
      this.warn("迁移位置数据失败:", t);
    }
  }
  /**
   * 迁移布局模式
   */
  async migrateLayoutMode() {
    try {
      const t = localStorage.getItem("orca-tabs-layout");
      if (t)
        try {
          const e = JSON.parse(t);
          e && typeof e == "object" && (await this.saveConfig(w.LAYOUT_MODE, e), this.log("📦 已迁移布局模式数据: orca-tabs-layout -> API配置"));
        } catch (e) {
          this.warn("解析旧布局模式数据失败:", e);
        }
      else
        this.log("📦 没有找到需要迁移的布局模式数据");
    } catch (t) {
      this.warn("迁移布局模式数据失败:", t);
    }
  }
  /**
   * 获取旧的localStorage键名（用于迁移）
   */
  getOldLocalStorageKeys() {
    try {
      const t = orca.state.repo;
      if (t && typeof t == "string")
        return [`orca-first-panel-tabs-repo-${t}`, "orca-first-panel-tabs-default"];
    } catch {
    }
    return ["orca-first-panel-tabs-default"];
  }
  /**
   * 获取旧的已关闭标签localStorage键名（用于迁移）
   */
  getOldClosedTabsKeys() {
    try {
      const t = orca.state.repo;
      if (t && typeof t == "string")
        return [`orca-closed-tabs-repo-${t}`, "orca-closed-tabs-default"];
    } catch {
    }
    return ["orca-closed-tabs-default"];
  }
}
class Pe {
  constructor() {
    m(this, "firstPanelTabs", []);
    // 只存储第一个面板的标签数据
    m(this, "currentPanelId", "");
    m(this, "panelIds", []);
    // 所有面板ID列表
    m(this, "currentPanelIndex", 0);
    // 当前面板索引
    m(this, "storageService", new Ie());
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
    m(this, "isVerticalMode", !1);
    // 垂直模式标志
    m(this, "verticalWidth", 200);
    // 垂直模式下的窗口宽度
    m(this, "verticalPosition", { x: 20, y: 20 });
    // 垂直模式下的位置
    m(this, "isResizing", !1);
    // 是否正在调整大小
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
    // 拖拽状态管理
    m(this, "draggingTab", null);
    // 当前正在拖拽的标签
    m(this, "dragEndListener", null);
    // 全局拖拽结束监听器
    m(this, "swapDebounceTimer", null);
    // 拖拽交换防抖计时器
    m(this, "lastSwapTarget", null);
    // 上次交换的目标标签ID，防止重复交换
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
    m(this, "scrollListener", null);
    // 滚动监听器
    // 已关闭标签页跟踪
    m(this, "closedTabs", /* @__PURE__ */ new Set());
    // 已关闭的标签页blockId集合
    m(this, "lastActiveBlockId", null);
    // 快捷键相关
    m(this, "hoveredBlockId", null);
    // 当前鼠标悬停的块ID
    m(this, "currentContextBlockRefId", null);
  }
  // 存储服务实例
  // 调试日志（开发模式）
  log(...t) {
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && console.log(...t);
  }
  // 详细日志（仅在需要时启用）
  verboseLog(...t) {
    typeof window < "u" && window.DEBUG_ORCA_TABS_VERBOSE === !0 && console.log("[OrcaTabsPlugin]", ...t);
  }
  warn(...t) {
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && console.warn(...t);
  }
  error(...t) {
    console.error(...t);
  }
  // 当前右键菜单对应的块引用ID
  async init() {
    try {
      this.maxTabs = orca.state.settings[Z.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), await this.restorePosition(), await this.restoreLayoutMode(), await this.restoreFloatingWindowVisibility(), this.registerHeadbarButton(), this.discoverPanels(), await this.storageService.migrateFromLocalStorage(), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && await this.storageService.testConfigSerialization(), await this.restoreFirstPanelTabs(), await this.restoreClosedTabs(), this.firstPanelTabs.length > 0 ? this.log("检测到持久化数据，使用固化的标签页状态") : (this.log("首次使用，扫描第一个面板创建标签页"), await this.scanFirstPanel()), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.isInitialized = !0, this.log("✅ 插件初始化完成");
  }
  /**
   * 设置主题变化监听器
   */
  setupThemeChangeListener() {
    this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null);
    const t = (i) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", i), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", t), this.log("主题变化监听器注册成功");
    } catch (i) {
      this.error("主题变化监听器注册失败:", i);
    }
    let e = orca.state.themeMode;
    const a = setInterval(() => {
      const i = orca.state.themeMode;
      i !== e && (this.log("备用检测：主题从", e, "切换到", i), e = i, setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 200));
    }, 500);
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", t), clearInterval(a);
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
        const a = this.getCurrentActiveTab();
        a && this.recordScrollPosition(a);
      }, 300);
    }, n = document.querySelectorAll(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html");
    n.forEach((a) => {
      a.addEventListener("scroll", e, { passive: !0 });
    }), this.scrollListener = () => {
      n.forEach((a) => {
        a.removeEventListener("scroll", e);
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
   * 防抖的标签交换函数（修复版）
   */
  async debouncedSwapTab(t, e) {
    this.lastSwapTarget !== t.blockId && (await this.swapTab(t, e), this.lastSwapTarget = t.blockId);
  }
  /**
   * 交换两个标签的位置（优化版）
   */
  async swapTab(t, e) {
    if (this.currentPanelIndex !== 0) {
      this.log("只有第一个面板支持拖拽排序");
      return;
    }
    const n = this.firstPanelTabs.findIndex((i) => i.blockId === t.blockId), a = this.firstPanelTabs.findIndex((i) => i.blockId === e.blockId);
    if (n !== -1 && a !== -1 && n !== a) {
      if (a < n) {
        const s = this.firstPanelTabs.splice(a, 1)[0], o = n > a ? n - 1 : n;
        this.firstPanelTabs.splice(o + 1, 0, s);
      } else {
        const s = this.firstPanelTabs.splice(a, 1)[0];
        this.firstPanelTabs.splice(n, 0, s);
      }
      this.firstPanelTabs.forEach((s, o) => {
        s.order = o;
      }), this.sortTabsByPinStatus(), await this.saveFirstPanelTabs(), this.draggingTab || this.debouncedUpdateTabsUI();
    }
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
    const e = document.querySelector("section#main");
    if (!e) {
      this.warn("❌ 未找到 section#main");
      return;
    }
    this.log("✅ 找到 section#main");
    const n = e.querySelector(".orca-panels-row");
    if (!n) {
      this.warn("❌ 未找到 .orca-panels-row");
      return;
    }
    this.log("✅ 找到 .orca-panels-row");
    const a = document.querySelectorAll(".orca-panel"), i = n.querySelectorAll(".orca-panel");
    if (this.panelIds = [], i.forEach((s, o) => {
      const l = s.getAttribute("data-panel-id"), c = s.classList.contains("active"), u = s.offsetParent !== null, h = s.getBoundingClientRect(), g = this.isMenuPanel(s);
      this.log(`面板 ${o + 1}: ID=${l}, 激活=${c}, 可见=${u}, 菜单=${g}, 位置=(${h.left}, ${h.top})`), l && !g ? this.panelIds.push(l) : g ? this.log(`🚫 跳过菜单面板: ${l}`) : this.warn(`❌ 面板 ${o + 1} 没有 data-panel-id 属性`);
    }), i.length < 2 && a.length >= 2 && (this.log("⚠️ 在 .orca-panels-row 中面板不足，尝试从整个文档中查找..."), a.forEach((s, o) => {
      const l = s.getAttribute("data-panel-id"), c = this.isMenuPanel(s);
      l && !this.panelIds.includes(l) && !c ? (this.panelIds.push(l), this.log(`➕ 从文档中找到额外面板: ID=${l}`)) : c && this.log(`🚫 跳过菜单面板: ${l}`);
    })), this.panelIds.length > 0) {
      const s = document.querySelector(".orca-panel.active");
      if (s) {
        const o = s.getAttribute("data-panel-id"), l = this.panelIds.indexOf(o || "");
        l !== -1 ? (this.currentPanelId = o || "", this.currentPanelIndex = l) : (this.currentPanelId = this.panelIds[0], this.currentPanelIndex = 0);
      } else
        this.currentPanelId = this.panelIds[0], this.currentPanelIndex = 0;
    }
    this.log(`🎯 最终发现 ${this.panelIds.length} 个面板，面板ID列表:`, this.panelIds), this.log(`🎯 当前面板: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`), this.panelDiscoveryCache = {
      panelIds: [...this.panelIds],
      timestamp: t
    }, this.panelIds.length === 1 ? this.log("ℹ️ 只有一个面板，不会显示切换按钮") : this.panelIds.length > 1 && this.log(`✅ 发现 ${this.panelIds.length} 个面板，将创建循环切换器`);
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
    const a = n.getAttribute("data-block-id");
    if (!a) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    const i = await this.getTabInfo(a, t, 0);
    i ? (this.firstPanelTabs = [i], await this.saveFirstPanelTabs(), await this.updateTabsUI()) : this.log("无法获取激活页面的标签信息");
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
    this.firstPanelTabs.sort((t, e) => t.isPinned && !e.isPinned ? -1 : !t.isPinned && e.isPinned ? 1 : 0);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    for (let t = this.firstPanelTabs.length - 1; t >= 0; t--)
      if (!this.firstPanelTabs[t].isPinned)
        return t;
    return -1;
  }
  /**
   * 专门格式化日记日期（用于标签显示）
   */
  formatJournalDate(t) {
    try {
      let e = orca.state.settings[Z.JournalDateFormat];
      return (!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), ye(t) ? N("今天") : ve(t) ? N("昨天") : we(t) ? N("明天") : this.formatDateWithPattern(t, e);
    } catch (e) {
      return this.warn("日期格式化失败:", e), this.formatDateWithPattern(t, "yyyy-MM-dd");
    }
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
        if (n.u)
          n.v ? e += n.v : e += n.u;
        else if (n.v && (typeof n.v == "number" || typeof n.v == "string"))
          try {
            const a = n.v.toString(), i = await this.getTabInfo(a, "", 0);
            i && i.title ? e += i.title : e += `[[块${a}]]`;
          } catch (a) {
            this.warn("处理r类型块引用失败:", a), e += "[[块引用]]";
          }
        else n.v && (e += n.v);
      else if (n.t === "br" && n.v)
        try {
          const a = n.v.toString(), i = await this.getTabInfo(a, "", 0);
          i && i.title ? e += i.title : e += `[[块${a}]]`;
        } catch (a) {
          this.warn("处理块引用失败:", a), e += "[[块引用]]";
        }
      else n.t && n.t.includes("math") && n.v ? e += `[数学: ${n.v}]` : (n.t && n.t.includes("code") && n.v || n.v && typeof n.v == "string") && (e += n.v);
    return e.trim();
  }
  /**
   * 使用BlockProperty API提取日期块信息
   */
  extractJournalInfo(t) {
    try {
      const e = this.findProperty(t, "_repr");
      if (!e || e.type !== Te.JSON || !e.value)
        return null;
      const n = typeof e.value == "string" ? JSON.parse(e.value) : e.value;
      return n.type === "journal" && n.date ? new Date(n.date) : null;
    } catch {
      return null;
    }
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
          const a = t.getDay(), s = ["日", "一", "二", "三", "四", "五", "六"][a], o = e.replace(/E/g, s);
          return B(t, o);
        } else
          return B(t, e);
      else
        return B(t, e);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const i of a)
        try {
          return B(t, i);
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
      const a = await orca.invokeBackend("get-block", parseInt(t));
      if (!a) return null;
      let i = "", s = "", o = "", l = !1;
      try {
        if (a.aliases && a.aliases.length > 0)
          i = a.aliases[0];
        else if (a.content && a.content.length > 0)
          i = (await this.extractTextFromContent(a.content)).substring(0, 50);
        else if (a.text)
          i = a.text.substring(0, 50);
        else {
          const c = this.extractJournalInfo(a);
          console.log(`🔍 检查块 ${t} 是否为日期块:`, c), c ? (l = !0, i = `📅 ${this.formatJournalDate(c)}`, console.log(`📅 识别为日期块: ${i}, 原始日期: ${c.toISOString()}`)) : (i = `块 ${t}`, console.log(`❌ 不是日期块: ${t}`));
        }
      } catch (c) {
        this.warn("获取标题失败:", c), i = `块 ${t}`;
      }
      try {
        const c = this.findProperty(a, "_color"), u = this.findProperty(a, "_icon");
        c && c.type === 1 && (s = c.value), u && u.type === 1 && (o = u.value);
      } catch (c) {
        this.warn("获取属性失败:", c);
      }
      return {
        blockId: t,
        panelId: e,
        title: i || `块 ${t}`,
        color: s,
        icon: o,
        isJournal: l,
        isPinned: !1,
        // 新标签默认不固定
        order: n
      };
    } catch (a) {
      return this.error("获取标签信息失败:", a), null;
    }
  }
  async createTabsUI() {
    if (!this.isFloatingWindowVisible) {
      this.log("🙈 浮窗已隐藏，跳过UI创建");
      return;
    }
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), this.log("📱 使用自动切换模式，不创建面板切换器"), this.tabContainer = document.createElement("div"), this.tabContainer.className = "orca-tabs-container";
    const t = orca.state.themeMode === "dark", e = "rgba(255, 255, 255, 0.1)", n = this.isVerticalMode ? this.verticalPosition : this.position, a = this.isVerticalMode ? `
      position: fixed;
      top: ${n.y}px;
      left: ${n.x}px;
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
      width: auto;
      min-width: 120px;
      max-width: 400px;
      align-items: stretch;
      app-region: no-drag;
      overflow-y: auto;
      overflow-x: hidden;
    ` : `
      position: fixed;
      top: ${n.y}px;
      left: ${n.x}px;
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
      height: 28px;
      align-items: center;
      app-region: no-drag;
    `;
    this.tabContainer.style.cssText = a, this.tabContainer.addEventListener("mousedown", (s) => {
      const o = s.target;
      o.closest(".orca-tab, .new-tab-button, .drag-handle") && !o.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && s.stopPropagation();
    }), this.tabContainer.addEventListener("click", (s) => {
      const o = s.target;
      o.closest(".orca-tab, .new-tab-button, .drag-handle") && !o.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && (s.stopPropagation(), console.log(`🖱️ 标签栏容器点击事件被阻止: ${o.className}`));
    });
    const i = document.createElement("div");
    i.className = "drag-handle", i.style.cssText = `
      width: 20px;
      height: 100%;
      background: transparent;
      cursor: move;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #666;
      margin-right: 4px;
      min-height: 32px;
      flex-shrink: 0;
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
    `, i.innerHTML = "⋮⋮", i.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(i), document.body.appendChild(this.tabContainer), this.addDragStyles(), this.isVerticalMode && await this.enableDragResize(), await this.updateTabsUI();
  }
  /**
   * 添加拖拽相关的CSS样式
   */
  addDragStyles() {
    if (document.getElementById("orca-tabs-drag-styles"))
      return;
    const t = document.createElement("style");
    t.id = "orca-tabs-drag-styles", t.textContent = `
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
    this.draggingTab ? (this.updateDebounceTimer && clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = setTimeout(async () => {
      await this.updateTabsUI();
    }, 200)) : (this.updateDebounceTimer && clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = setTimeout(async () => {
      await this.updateTabsUI();
    }, 100));
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
    const n = this.panelIds.length > 0 && document.querySelector(`.orca-panel[data-panel-id="${this.panelIds[0]}"]`), a = this.currentPanelIndex === 0;
    n && a ? (this.log("📋 显示第一个面板的固化标签页"), this.sortTabsByPinStatus(), this.firstPanelTabs.forEach((i, s) => {
      var l;
      const o = this.createTabElement(i);
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
    let a = 0;
    for (const s of e) {
      const o = s.querySelector(".orca-block-editor");
      if (!o) continue;
      const l = o.getAttribute("data-block-id");
      if (!l) continue;
      const c = await this.getTabInfo(l, this.currentPanelId, a++);
      c && n.push(c);
    }
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const i = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((s, o) => {
        const l = this.createTabElement(s);
        i.appendChild(l);
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
      s.textContent = `面板 ${o}（无标签页）`, s.title = `当前在面板 ${o}，该面板没有标签页`, i.appendChild(s);
    }
    this.tabContainer.appendChild(i);
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
    let a = 0;
    for (const s of e) {
      const o = s.querySelector(".orca-block-editor");
      if (!o) continue;
      const l = o.getAttribute("data-block-id");
      if (!l) continue;
      const c = await this.getTabInfo(l, this.currentPanelId, a++);
      c && n.push(c);
    }
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const i = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((s, o) => {
        const l = this.createTabElement(s);
        i.appendChild(l);
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
      s.textContent = `面板 ${o}（无标签页）`, s.title = `当前在面板 ${o}，该面板没有标签页`, i.appendChild(s);
    }
    this.tabContainer.appendChild(i);
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
    }), e.addEventListener("click", async (a) => {
      a.preventDefault(), a.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
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
    const a = 180, i = 120;
    let s = t.clientX, o = t.clientY;
    s + a > window.innerWidth && (s = window.innerWidth - a - 10), o + i > window.innerHeight && (o = window.innerHeight - i - 10), s = Math.max(10, s), o = Math.max(10, o), n.style.cssText = `
      position: fixed;
      left: ${s}px;
      top: ${o}px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: ${a}px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    `, [
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
      },
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
    ].forEach((u) => {
      if (u.separator) {
        const d = document.createElement("div");
        d.style.cssText = `
          height: 1px;
          background: #ddd;
          margin: 4px 8px;
        `, n.appendChild(d);
        return;
      }
      const h = document.createElement("div");
      if (h.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: #333;
        transition: background-color 0.2s ease;
      `, u.icon) {
        const d = document.createElement("span");
        d.textContent = u.icon, d.style.cssText = `
          font-size: 12px;
          width: 16px;
          text-align: center;
        `, h.appendChild(d);
      }
      const g = document.createElement("span");
      g.textContent = u.text, h.appendChild(g), h.addEventListener("mouseenter", () => {
        h.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      }), h.addEventListener("mouseleave", () => {
        h.style.backgroundColor = "transparent";
      }), h.addEventListener("click", () => {
        u.action && u.action(), n.remove();
      }), n.appendChild(h);
    }), document.body.appendChild(n);
    const c = (u) => {
      n.contains(u.target) || (n.remove(), document.removeEventListener("click", c));
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
      this.isVerticalMode ? this.verticalPosition = { ...this.position } : this.position = { ...this.verticalPosition }, this.isVerticalMode = !this.isVerticalMode, await this.saveLayoutMode(), await this.createTabsUI(), this.log(`📐 布局模式已切换为: ${this.isVerticalMode ? "垂直" : "水平"}`);
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
    var t;
    try {
      this.log("🔴 禁用侧边栏对齐功能"), this.stopSidebarAlignmentObserver();
      const e = this.getSidebarWidth();
      if (this.log(`📏 读取到的侧边栏宽度: ${e}px`), e > 0) {
        const n = document.querySelector("div#app");
        this.log(`🔍 查找 div#app 元素: ${n ? "找到" : "未找到"}`), n && this.log(`🔍 app元素类名: ${n.className}`);
        const a = (n == null ? void 0 : n.classList.contains("sidebar-closed")) || !1, i = (n == null ? void 0 : n.classList.contains("sidebar-opened")) || !1;
        this.log("🔍 侧边栏状态检测结果:"), this.log(`   - 关闭状态 (sidebar-closed): ${a}`), this.log(`   - 打开状态 (sidebar-opened): ${i}`);
        const s = this.isVerticalMode ? this.verticalPosition.x : this.position.x;
        this.log(`📍 当前位置: ${s}px (${this.isVerticalMode ? "垂直模式" : "水平模式"})`);
        let o, l;
        if (a)
          o = Math.max(10, s - e), l = "向左移动", this.log(`📐 侧边栏关闭，向左移动 ${e}px，新位置: ${o}px`);
        else if (i) {
          o = s + e;
          const c = ((t = this.tabContainer) == null ? void 0 : t.getBoundingClientRect().width) || 200;
          o = Math.min(o, window.innerWidth - c - 10), l = "向右移动", this.log(`📐 侧边栏打开，向右移动 ${e}px，新位置: ${o}px`);
        } else {
          this.log("⚠️ 无法确定侧边栏状态，保持当前位置"), this.isSidebarAlignmentEnabled = !1;
          return;
        }
        this.isVerticalMode ? (this.verticalPosition.x = o, await this.saveLayoutMode()) : (this.position.x = o, await this.savePosition()), this.log("🎨 开始重新创建UI..."), await this.createTabsUI(), this.log("   UI重新创建完成"), this.log(`✅ 标签栏已${l}，最终位置: (${o}, ${this.isVerticalMode ? this.verticalPosition.y : this.position.y})`);
      }
      this.isSidebarAlignmentEnabled = !1, this.log("🔴 侧边栏对齐功能已禁用");
    } catch (e) {
      this.error("禁用侧边栏对齐失败:", e);
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
        (a) => a.type === "attributes" && a.attributeName === "class"
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
    let a;
    e ? a = "closed" : n ? a = "opened" : a = "unknown", this.lastSidebarState !== a && (this.log(`🔄 检测到侧边栏状态变化: ${this.lastSidebarState} -> ${a}`), this.lastSidebarState = a, this.autoAdjustSidebarAlignment());
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
    var t;
    if (this.isSidebarAlignmentEnabled)
      try {
        const e = this.getSidebarWidth();
        if (e === 0) return;
        const n = document.querySelector("div#app");
        if (!n) return;
        const a = n.classList.contains("sidebar-closed"), i = n.classList.contains("sidebar-opened"), s = this.isVerticalMode ? this.verticalPosition.x : this.position.x;
        let o;
        if (a)
          o = Math.max(10, s - e);
        else if (i) {
          o = s + e;
          const l = ((t = this.tabContainer) == null ? void 0 : t.getBoundingClientRect().width) || 200;
          o = Math.min(o, window.innerWidth - l - 10);
        } else
          return;
        this.isVerticalMode ? (this.verticalPosition.x = o, await this.saveLayoutMode()) : (this.position.x = o, await this.savePosition()), await this.createTabsUI(), this.log(`🔄 自动调整位置: ${s}px → ${o}px`);
      } catch (e) {
        this.error("自动调整侧边栏对齐失败:", e);
      }
  }
  /**
   * 切换浮窗显示/隐藏状态
   */
  async toggleFloatingWindow() {
    try {
      this.isFloatingWindowVisible = !this.isFloatingWindowVisible, this.isFloatingWindowVisible ? (this.log("👁️ 显示浮窗"), await this.createTabsUI()) : (this.log("🙈 隐藏浮窗"), this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.resizeHandle && (this.resizeHandle.remove(), this.resizeHandle = null)), await this.storageService.saveConfig(w.FLOATING_WINDOW_VISIBLE, this.isFloatingWindowVisible), this.log(`✅ 浮窗已${this.isFloatingWindowVisible ? "显示" : "隐藏"}`);
    } catch (t) {
      this.error("切换浮窗状态失败:", t);
    }
  }
  /**
   * 从API配置恢复浮窗可见状态
   */
  async restoreFloatingWindowVisibility() {
    try {
      const t = await this.storageService.getConfig(w.FLOATING_WINDOW_VISIBLE, "orca-tabs-plugin", !1);
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
      orca.headbar.unregisterHeadbarButton("orca-tabs-plugin.toggleButton"), this.log("🔘 顶部工具栏按钮已注销");
    } catch (t) {
      this.error("注销顶部工具栏按钮失败:", t);
    }
  }
  /**
   * 对齐到侧边栏（保留原方法作为备用）
   */
  async alignToSidebar() {
    var t;
    try {
      const e = this.getSidebarWidth();
      if (e === 0) {
        this.log("⚠️ 无法读取侧边栏宽度");
        return;
      }
      const n = document.querySelector("#sidebar.sidebar-closed") !== null, a = document.querySelector("#sidebar.sidebar-opened") !== null;
      this.log(`🔍 侧边栏状态 - 关闭: ${n}, 打开: ${a}`);
      let i;
      const s = this.isVerticalMode ? this.verticalPosition.x : this.position.x;
      if (this.log(`📍 当前位置: ${s}px`), n)
        i = Math.max(10, s - e), this.log(`📐 侧边栏关闭，向左移动 ${e}px，新位置: ${i}px`);
      else if (a) {
        i = s + e;
        const o = ((t = this.tabContainer) == null ? void 0 : t.getBoundingClientRect().width) || 200;
        i = Math.min(i, window.innerWidth - o - 10), this.log(`📐 侧边栏打开，向右移动 ${e}px，新位置: ${i}px`);
      } else {
        this.log("⚠️ 无法确定侧边栏状态");
        return;
      }
      this.isVerticalMode ? this.verticalPosition.x = i : this.position.x = i, this.isVerticalMode ? await this.saveLayoutMode() : await this.savePosition(), await this.createTabsUI(), this.log(`📐 标签栏已对齐到侧边栏，新位置: (${i}, ${this.isVerticalMode ? this.verticalPosition.y : this.position.y})`);
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
      const t = document.querySelector("nav#sidebar");
      if (this.log(`   查找 nav#sidebar 元素: ${t ? "找到" : "未找到"}`), !t)
        return this.log("⚠️ 未找到 nav#sidebar 元素"), 0;
      this.log("   侧边栏元素信息:"), this.log(`     - ID: ${t.id}`), this.log(`     - 类名: ${t.className}`), this.log(`     - 标签名: ${t.tagName}`);
      const n = window.getComputedStyle(t).getPropertyValue("--orca-sidebar-width");
      if (this.log(`   CSS变量 --orca-sidebar-width: "${n}"`), n && n !== "") {
        const i = parseInt(n.replace("px", ""));
        if (isNaN(i))
          this.log(`⚠️ CSS变量值无法解析为数字: "${n}"`);
        else
          return this.log(`✅ 从CSS变量获取侧边栏宽度: ${i}px`), i;
      } else
        this.log("⚠️ CSS变量 --orca-sidebar-width 不存在或为空");
      this.log("   尝试获取实际宽度...");
      const a = t.getBoundingClientRect();
      return this.log(`   实际尺寸: width=${a.width}px, height=${a.height}px`), a.width > 0 ? (this.log(`✅ 从实际尺寸获取侧边栏宽度: ${a.width}px`), a.width) : (this.log("⚠️ 无法获取侧边栏宽度，所有方法都失败"), 0);
    } catch (t) {
      return this.error("获取侧边栏宽度失败:", t), 0;
    }
  }
  /**
   * 启用拖拽调整宽度功能
   */
  async enableDragResize() {
    if (!this.isVerticalMode) {
      this.log("⚠️ 拖拽调整宽度仅在垂直模式下可用");
      return;
    }
    if (!this.tabContainer) return;
    this.resizeHandle && this.resizeHandle.remove(), this.resizeHandle = document.createElement("div"), this.resizeHandle.className = "resize-handle", this.resizeHandle.style.cssText = `
      position: absolute;
      top: 0;
      right: -4px;
      width: 8px;
      height: 100%;
      cursor: col-resize;
      background: transparent;
      z-index: 400;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `;
    const t = document.createElement("div");
    t.style.cssText = `
      position: absolute;
      top: 50%;
      right: 2px;
      transform: translateY(-50%);
      width: 2px;
      height: 20px;
      background: rgba(100, 100, 100, 0.5);
      border-radius: 1px;
    `, this.resizeHandle.appendChild(t), this.tabContainer.appendChild(this.resizeHandle), this.setupResizeEvents(), this.log("📏 拖拽调整宽度已启用，拖拽右侧边缘调整宽度");
  }
  /**
   * 设置拖拽调整大小事件
   */
  setupResizeEvents() {
    if (!this.resizeHandle || !this.tabContainer) return;
    let t = 0, e = 0;
    const n = (s) => {
      s.preventDefault(), s.stopPropagation(), this.isResizing = !0, t = s.clientX, e = this.verticalWidth, document.body.style.cursor = "col-resize", document.body.style.userSelect = "none", document.addEventListener("mousemove", a), document.addEventListener("mouseup", i);
    }, a = (s) => {
      if (!this.isResizing || !this.tabContainer) return;
      s.preventDefault();
      const o = s.clientX - t, l = Math.max(120, Math.min(400, e + o));
      this.verticalWidth = l, this.tabContainer.style.width = `${l}px`;
    }, i = async (s) => {
      if (this.isResizing) {
        this.isResizing = !1, document.body.style.cursor = "", document.body.style.userSelect = "", document.removeEventListener("mousemove", a), document.removeEventListener("mouseup", i);
        try {
          await orca.plugins.setSettings("app", "orca-tabs-plugin", {
            verticalWidth: this.verticalWidth
          }), this.log(`📏 宽度已调整为: ${this.verticalWidth}px`);
        } catch (o) {
          this.error("保存宽度设置失败:", o);
        }
      }
    };
    this.resizeHandle.addEventListener("mousedown", n);
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
    const a = orca.state.themeMode === "dark";
    let i = a ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", s = a ? "#ffffff" : "#333", o = "normal";
    t.color && (i = this.applyOklchFormula(t.color, "background"), s = this.applyOklchFormula(t.color, "text"), o = "600");
    const l = this.isVerticalMode ? `
      background: ${i};
      color: ${s};
      font-weight: ${o};
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
      font-weight: ${o};
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
    e.style.cssText = l;
    const c = document.createElement("div");
    c.style.cssText = `
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      gap: 4px;
    `;
    const u = document.createElement("div");
    u.style.cssText = `
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    `;
    let h = t.title;
    if (t.icon && (h = `${t.icon} ${t.title}`), u.textContent = h, c.appendChild(u), t.isPinned) {
      const d = document.createElement("span");
      d.textContent = "📌", d.style.cssText = `
        flex-shrink: 0;
        font-size: 10px;
        opacity: 0.8;
      `, c.appendChild(d);
    }
    e.appendChild(c), this.isVerticalMode && !this.resizeHandle && this.enableDragResize();
    let g = t.title;
    return t.isPinned && (g += " (已固定)"), e.title = g, e.addEventListener("click", (d) => {
      var b;
      console.log(`🖱️ 标签点击事件触发: ${t.title} (ID: ${t.blockId})`), d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation(), this.log(`🖱️ 点击标签: ${t.title} (ID: ${t.blockId})`);
      const f = (b = this.tabContainer) == null ? void 0 : b.querySelectorAll(".orca-tab");
      f == null || f.forEach((p) => p.removeAttribute("data-focused")), e.setAttribute("data-focused", "true"), this.switchToTab(t);
    }), e.addEventListener("mousedown", (d) => {
      console.log(`🖱️ 标签mousedown事件触发: ${t.title} (ID: ${t.blockId})`);
    }), e.addEventListener("dblclick", (d) => {
      d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation(), this.toggleTabPinStatus(t);
    }), e.addEventListener("auxclick", (d) => {
      d.button === 1 && (d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation(), this.closeTab(t));
    }), e.addEventListener("keydown", (d) => {
      (d.target === e || e.contains(d.target)) && (d.key === "F2" ? (d.preventDefault(), d.stopPropagation(), this.renameTab(t)) : d.ctrlKey && d.key === "p" ? (d.preventDefault(), d.stopPropagation(), this.toggleTabPinStatus(t)) : d.ctrlKey && d.key === "w" && (d.preventDefault(), d.stopPropagation(), this.closeTab(t)));
    }), this.addOrcaContextMenu(e, t), e.draggable = !0, e.addEventListener("dragstart", (d) => {
      var b;
      if (d.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        d.preventDefault();
        return;
      }
      d.dataTransfer.effectAllowed = "move", (b = d.dataTransfer) == null || b.setData("text/plain", t.blockId), this.draggingTab = t, this.lastSwapTarget = null, e.setAttribute("data-dragging", "true"), e.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true");
    }), e.addEventListener("dragend", (d) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDragVisualFeedback(), setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 50), this.log(`🔄 结束拖拽标签: ${t.title}`);
    }), e.addEventListener("dragover", (d) => {
      d.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== t.blockId && (d.preventDefault(), d.dataTransfer.dropEffect = "move", this.addDragOverEffect(e), this.debouncedSwapTab(t, this.draggingTab));
    }), e.addEventListener("dragenter", (d) => {
      d.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== t.blockId && (d.preventDefault(), this.addDragOverEffect(e));
    }), e.addEventListener("dragleave", (d) => {
      const f = e.getBoundingClientRect(), b = d.clientX, p = d.clientY;
      (b < f.left || b > f.right || p < f.top || p > f.bottom) && this.removeDragOverEffect(e);
    }), e.addEventListener("drop", (d) => {
      var b;
      d.preventDefault();
      const f = (b = d.dataTransfer) == null ? void 0 : b.getData("text/plain");
      this.log(`🔄 拖拽放置: ${f} -> ${t.blockId}`);
    }), e.addEventListener("mouseenter", () => {
      e.style.transform = "scale(1.05)", e.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
    }), e.addEventListener("mouseleave", () => {
      e.style.transform = "scale(1)", e.style.boxShadow = "none";
    }), e;
  }
  hexToRgba(t, e) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (n) {
      const a = parseInt(n[1], 16), i = parseInt(n[2], 16), s = parseInt(n[3], 16);
      return `rgba(${a}, ${i}, ${s}, ${e})`;
    }
    return `rgba(200, 200, 200, ${e})`;
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(t) {
    const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (e) {
      const n = parseInt(e[1], 16), a = parseInt(e[2], 16), i = parseInt(e[3], 16);
      return (0.299 * n + 0.587 * a + 0.114 * i) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(t, e) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (n) {
      let a = parseInt(n[1], 16), i = parseInt(n[2], 16), s = parseInt(n[3], 16);
      a = Math.floor(a * (1 - e)), i = Math.floor(i * (1 - e)), s = Math.floor(s * (1 - e));
      const o = a.toString(16).padStart(2, "0"), l = i.toString(16).padStart(2, "0"), c = s.toString(16).padStart(2, "0");
      return `#${o}${l}${c}`;
    }
    return t;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(t, e, n) {
    const a = t / 255, i = e / 255, s = n / 255, o = (Y) => Y <= 0.04045 ? Y / 12.92 : Math.pow((Y + 0.055) / 1.055, 2.4), l = o(a), c = o(i), u = o(s), h = l * 0.4124564 + c * 0.3575761 + u * 0.1804375, g = l * 0.2126729 + c * 0.7151522 + u * 0.072175, d = l * 0.0193339 + c * 0.119192 + u * 0.9503041, f = 0.2104542553 * h + 0.793617785 * g - 0.0040720468 * d, b = 1.9779984951 * h - 2.428592205 * g + 0.4505937099 * d, p = 0.0259040371 * h + 0.7827717662 * g - 0.808675766 * d, v = Math.cbrt(f), x = Math.cbrt(b), S = Math.cbrt(p), _ = 0.2104542553 * v + 0.793617785 * x + 0.0040720468 * S, M = 1.9779984951 * v - 2.428592205 * x + 0.4505937099 * S, E = 0.0259040371 * v + 0.7827717662 * x - 0.808675766 * S, D = Math.sqrt(M * M + E * E), z = Math.atan2(E, M) * 180 / Math.PI, lt = z < 0 ? z + 360 : z;
    return { l: _, c: D, h: lt };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(t, e, n) {
    const a = n * Math.PI / 180, i = e * Math.cos(a), s = e * Math.sin(a), o = t, l = i, c = s, u = o * o * o, h = l * l * l, g = c * c * c, d = 1.0478112 * u + 0.0228866 * h - 0.050217 * g, f = 0.0295424 * u + 0.9904844 * h + 0.0170491 * g, b = -92345e-7 * u + 0.0150436 * h + 0.7521316 * g, p = 3.2404542 * d - 1.5371385 * f - 0.4985314 * b, v = -0.969266 * d + 1.8760108 * f + 0.041556 * b, x = 0.0556434 * d - 0.2040259 * f + 1.0572252 * b, S = (D) => D <= 31308e-7 ? 12.92 * D : 1.055 * Math.pow(D, 1 / 2.4) - 0.055, _ = Math.max(0, Math.min(255, Math.round(S(p) * 255))), M = Math.max(0, Math.min(255, Math.round(S(v) * 255))), E = Math.max(0, Math.min(255, Math.round(S(x) * 255)));
    return { r: _, g: M, b: E };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(t, e) {
    const n = orca.state.themeMode === "dark", a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (!a) return t;
    const i = parseInt(a[1], 16), s = parseInt(a[2], 16), o = parseInt(a[3], 16);
    if (e === "text") {
      const l = (i + s + o) / 3;
      if (n)
        if (l < 80) {
          const u = Math.min(255, Math.round(i * 1.6)), h = Math.min(255, Math.round(s * 1.6)), g = Math.min(255, Math.round(o * 1.6));
          return `rgb(${u}, ${h}, ${g})`;
        } else if (l < 150) {
          const u = Math.min(255, Math.round(i * 1.3)), h = Math.min(255, Math.round(s * 1.3)), g = Math.min(255, Math.round(o * 1.3));
          return `rgb(${u}, ${h}, ${g})`;
        } else {
          const u = Math.min(255, Math.round(i * 1.1)), h = Math.min(255, Math.round(s * 1.1)), g = Math.min(255, Math.round(o * 1.1));
          return `rgb(${u}, ${h}, ${g})`;
        }
      else if (l > 200) {
        const u = Math.max(0, Math.round(i * 0.4)), h = Math.max(0, Math.round(s * 0.4)), g = Math.max(0, Math.round(o * 0.4));
        return `rgb(${u}, ${h}, ${g})`;
      } else if (l > 150) {
        const u = Math.max(0, Math.round(i * 0.6)), h = Math.max(0, Math.round(s * 0.6)), g = Math.max(0, Math.round(o * 0.6));
        return `rgb(${u}, ${h}, ${g})`;
      } else {
        const u = Math.max(0, Math.round(i * 0.8)), h = Math.max(0, Math.round(s * 0.8)), g = Math.max(0, Math.round(o * 0.8));
        return `rgb(${u}, ${h}, ${g})`;
      }
    } else
      return n ? this.hexToRgba(t, 0.25) : this.hexToRgba(t, 0.35);
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
          let a = null;
          if (console.log(`🔍 检查日期块标题: ${t.title}`), t.title.includes("今天") || t.title.includes("Today")) {
            console.log("📅 使用原生命令跳转到今天");
            try {
              await orca.commands.invokeCommand("core.goToday"), console.log("✅ 今天导航成功");
              return;
            } catch (i) {
              console.log("❌ 今天导航失败:", i), a = /* @__PURE__ */ new Date(), console.log(`📅 回退到日期格式: ${a.toISOString()}`);
            }
          } else if (t.title.includes("昨天") || t.title.includes("Yesterday")) {
            console.log("📅 使用原生命令跳转到昨天");
            try {
              await orca.commands.invokeCommand("core.goYesterday"), console.log("✅ 昨天导航成功");
              return;
            } catch (i) {
              console.log("❌ 昨天导航失败:", i), a = /* @__PURE__ */ new Date(), a.setDate(a.getDate() - 1), console.log(`📅 回退到日期格式: ${a.toISOString()}`);
            }
          } else if (t.title.includes("明天") || t.title.includes("Tomorrow")) {
            console.log("📅 使用原生命令跳转到明天");
            try {
              await orca.commands.invokeCommand("core.goTomorrow"), console.log("✅ 明天导航成功");
              return;
            } catch (i) {
              console.log("❌ 明天导航失败:", i), a = /* @__PURE__ */ new Date(), a.setDate(a.getDate() + 1), console.log(`📅 回退到日期格式: ${a.toISOString()}`);
            }
          } else {
            const i = t.title.match(/(\d{4}-\d{2}-\d{2})/);
            if (i) {
              const s = i[1];
              a = /* @__PURE__ */ new Date(s + "T00:00:00.000Z"), isNaN(a.getTime()) ? (console.log(`❌ 无效的日期格式: ${s}`), a = null) : console.log(`📅 从标题提取日期: ${s} -> ${a.toISOString()}`);
            } else {
              console.log(`🔍 尝试从块信息中获取原始日期: ${t.blockId}`);
              try {
                const s = await orca.invokeBackend("get-block", parseInt(t.blockId));
                if (s) {
                  const o = this.extractJournalInfo(s);
                  o && !isNaN(o.getTime()) ? (a = o, console.log(`📅 从块信息获取日期: ${o.toISOString()}`)) : console.log("❌ 块信息中未找到有效日期信息");
                } else
                  console.log("❌ 无法获取块信息");
              } catch (s) {
                console.log("❌ 获取块信息失败:", s), this.warn("无法获取块信息:", s);
              }
            }
          }
          if (a) {
            console.log(`📅 使用日期导航: ${a.toISOString().split("T")[0]}`), this.log(`📅 使用日期导航: ${a.toISOString().split("T")[0]}`);
            try {
              if (isNaN(a.getTime()))
                throw new Error("Invalid date");
              console.log(`📅 使用简单日期格式: ${a.toISOString()}`), await orca.nav.goTo("journal", { date: a }, n), console.log("✅ 日期导航成功");
            } catch (i) {
              console.log("❌ 日期导航失败:", i);
              try {
                console.log("🔄 尝试 Orca 日期格式");
                const s = {
                  t: 2,
                  // 2 for full/absolute date
                  v: a.getTime()
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
            } catch (i) {
              throw console.log("❌ 块ID导航失败:", i), i;
            }
          }
        } else
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${t.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(t.blockId) }, n);
        this.log("✅ orca.nav.goTo 导航成功");
      } catch (a) {
        this.warn("导航失败，尝试备用方法:", a);
        const i = document.querySelector(`[data-block-id="${t.blockId}"]`);
        if (i)
          this.log(`🔄 使用备用方法点击块元素: ${t.blockId}`), i.click();
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
    const a = n.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    return a ? a.getAttribute("data-block-id") === t.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(t) {
    const e = this.firstPanelTabs.findIndex((a) => a.blockId === t.blockId);
    if (e === -1) {
      this.log("未找到要关闭的标签页");
      return;
    }
    let n = -1;
    if (e === 0 ? n = 1 : e === this.firstPanelTabs.length - 1 ? n = e - 1 : n = e + 1, n >= 0 && n < this.firstPanelTabs.length) {
      const a = this.firstPanelTabs[n];
      this.log(`🔄 自动切换到相邻标签: "${a.title}" (位置: ${n})`);
      const i = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(a.blockId) }, i);
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
        }
      };
      await orca.plugins.setSettingsSchema("orca-tabs-plugin", e);
      const n = (t = orca.state.plugins["orca-tabs-plugin"]) == null ? void 0 : t.settings;
      n != null && n.homePageBlockId && (this.homePageBlockId = n.homePageBlockId, this.log(`🏠 主页块ID: ${this.homePageBlockId}`)), this.log("✅ 插件设置已注册");
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
          const a = window.React;
          return !a || !orca.components.MenuText ? null : a.createElement(orca.components.MenuText, {
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
        const a = this.getCurrentActiveTab();
        let i = this.firstPanelTabs.length;
        if (a) {
          const o = this.firstPanelTabs.findIndex((l) => l.blockId === a.blockId);
          o !== -1 && (i = o + 1, this.log(`🎯 将在聚焦标签 "${a.title}" 后面插入新标签: "${n.title}"`));
        } else
          this.log("🎯 没有聚焦标签，将添加到末尾");
        if (this.firstPanelTabs.length >= this.maxTabs) {
          this.firstPanelTabs.splice(i, 0, n), this.verboseLog(`➕ 在位置 ${i} 插入新标签: ${n.title}`);
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
          this.firstPanelTabs.splice(i, 0, n), this.verboseLog(`➕ 在位置 ${i} 插入新标签: ${n.title}`);
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
      } catch (a) {
        this.warn("备用方法也失败:", a);
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
      const i = orca.state.blocks[parseInt(t)];
      if (!i)
        return this.warn(`无法找到块 ${t}`), !1;
      const s = {
        blockId: t,
        panelId: this.panelIds[0],
        title: i.text || `块 ${t}`,
        isPinned: !1,
        order: this.firstPanelTabs.length
      };
      let o = this.firstPanelTabs.length, l = !1;
      if (e === "replace") {
        const c = this.getCurrentActiveTab();
        if (!c)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const u = this.firstPanelTabs.findIndex((h) => h.blockId === c.blockId);
        if (u === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        c.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), o = u + 1, l = !1) : (o = u, l = !0);
      } else if (e === "after") {
        const c = this.getCurrentActiveTab();
        if (c) {
          const u = this.firstPanelTabs.findIndex((h) => h.blockId === c.blockId);
          u !== -1 && (o = u + 1, this.log("📌 在聚焦标签后面插入新标签"));
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
            const u = this.firstPanelTabs.findIndex((h) => h.blockId === s.blockId);
            if (u !== -1)
              return this.firstPanelTabs.splice(u, 1), !1;
          }
        }
      else
        l ? this.firstPanelTabs[o] = s : this.firstPanelTabs.splice(o, 0, s);
      if (await this.saveFirstPanelTabs(), await this.updateTabsUI(), n) {
        const c = this.panelIds[0];
        await orca.nav.goTo("block", { blockId: parseInt(t) }, c);
      }
      return !0;
    } catch (a) {
      return this.error("添加标签页时出错:", a), !1;
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
      let a = t;
      for (; a && a !== document.body; ) {
        const i = a.classList;
        if (i.contains("orca-ref") || i.contains("block-ref") || i.contains("block-reference") || i.contains("orca-fragment-r") || i.contains("fragment-r") || i.contains("orca-block-reference") || a.tagName.toLowerCase() === "a" && ((e = a.getAttribute("href")) != null && e.startsWith("#"))) {
          const o = a.getAttribute("data-block-id") || a.getAttribute("data-ref-id") || a.getAttribute("data-blockid") || a.getAttribute("data-target-block-id") || a.getAttribute("data-fragment-v") || a.getAttribute("data-v") || ((n = a.getAttribute("href")) == null ? void 0 : n.replace("#", "")) || a.getAttribute("data-id");
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从元素中提取到块引用ID: ${o}`), o;
        }
        const s = a.dataset;
        for (const [o, l] of Object.entries(s))
          if ((o.toLowerCase().includes("block") || o.toLowerCase().includes("ref")) && l && !isNaN(parseInt(l)))
            return this.log(`🔗 从data属性 ${o} 中提取到块引用ID: ${l}`), l;
        a = a.parentElement;
      }
      if (t.textContent) {
        const i = t.textContent.trim(), s = i.match(/\[\[(?:块)?(\d+)\]\]/) || i.match(/block[:\s]*(\d+)/i);
        if (s && s[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${s[1]}`), s[1];
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
      for (let i = e.length - 1; i >= 0; i--) {
        const s = e[i];
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
        const i = document.createElement("div");
        i.className = "orca-tabs-ref-menu-separator", i.style.cssText = `
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 4px 8px;
        `, n.appendChild(i);
      }
      this.log(`✅ 成功为块引用 ${t} 添加菜单项`);
    } catch (e) {
      this.error("增强块引用右键菜单时出错:", e);
    }
  }
  /**
   * 创建上下文菜单项
   */
  createContextMenuItem(t, e, n, a) {
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
    const o = document.createElement("span");
    if (o.textContent = t, o.style.cssText = `
      flex: 1;
      color: #333;
    `, i.appendChild(s), i.appendChild(o), n && n.trim() !== "") {
      const l = document.createElement("span");
      l.textContent = n, l.style.cssText = `
        font-size: 12px;
        color: #999;
        margin-left: 12px;
      `, i.appendChild(l);
    }
    return i.addEventListener("mouseenter", () => {
      i.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    }), i.addEventListener("mouseleave", () => {
      i.style.backgroundColor = "transparent";
    }), i.addEventListener("click", (l) => {
      l.preventDefault(), l.stopPropagation(), a();
      const c = i.closest('.orca-context-menu, .context-menu, [role="menu"]');
      c && (c.style.display = "none", c.remove());
    }), i;
  }
  /**
   * 记录当前标签的滚动位置
   */
  async recordScrollPosition(t) {
    try {
      const e = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(e, orca.state.panels);
      if (n && n.viewState) {
        let a = null;
        const i = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (i) {
          const s = i.closest(".orca-panel");
          s && (a = s.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!a) {
          const s = document.querySelector(".orca-panel.active");
          s && (a = s.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (a || (a = document.body.scrollTop > 0 ? document.body : document.documentElement), a) {
          const s = {
            x: a.scrollLeft || 0,
            y: a.scrollTop || 0
          };
          n.viewState.scrollPosition = s;
          const o = this.firstPanelTabs.findIndex((l) => l.blockId === t.blockId);
          o !== -1 && (this.firstPanelTabs[o].scrollPosition = s, await this.saveFirstPanelTabs()), this.log(`📝 记录标签 "${t.title}" 滚动位置到viewState:`, s, "容器:", a.className);
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
      const n = this.panelIds[this.currentPanelIndex], a = orca.nav.findViewPanel(n, orca.state.panels);
      if (a && a.viewState && a.viewState.scrollPosition && (e = a.viewState.scrollPosition, this.log(`🔄 从viewState恢复标签 "${t.title}" 滚动位置:`, e)), !e && t.scrollPosition && (e = t.scrollPosition, this.log(`🔄 从标签信息恢复标签 "${t.title}" 滚动位置:`, e)), !e) return;
      const i = (s = 1) => {
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
        o || (o = document.body.scrollTop > 0 ? document.body : document.documentElement), o ? (o.scrollLeft = e.x, o.scrollTop = e.y, this.log(`🔄 恢复标签 "${t.title}" 滚动位置:`, e, "容器:", o.className, `尝试${s}`)) : setTimeout(() => i(s + 1), 200 * s);
      };
      i(), setTimeout(() => i(2), 100), setTimeout(() => i(3), 300);
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
    ].forEach((i) => {
      document.querySelectorAll(i).forEach((o, l) => {
        const c = o;
        (c.scrollTop > 0 || c.scrollLeft > 0) && this.log(`容器 ${i}[${l}]:`, {
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
      const a = n.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
      return a ? a.getAttribute("data-block-id") === t.blockId : !1;
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
    const a = n.getAttribute("data-block-id");
    return a && this.firstPanelTabs.find((i) => i.blockId === a) || null;
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
      const n = this.getCurrentActiveTab(), a = n && n.blockId === t.blockId, i = a ? this.getAdjacentTab(t) : null;
      this.closedTabs.add(t.blockId), this.firstPanelTabs.splice(e, 1), this.debouncedUpdateTabsUI(), await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 标签 "${t.title}" 已关闭，已添加到关闭列表`), a && i ? (this.log(`🔄 自动切换到相邻标签: "${i.title}"`), await this.switchToTab(i)) : a && !i && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  async closeAllTabs() {
    if (this.currentPanelIndex !== 0) return;
    this.firstPanelTabs.filter((a) => !a.isPinned).forEach((a) => {
      this.closedTabs.add(a.blockId);
    });
    const e = this.firstPanelTabs.filter((a) => a.isPinned), n = this.firstPanelTabs.length - e.length;
    this.firstPanelTabs = e, this.debouncedUpdateTabsUI(), await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 已关闭 ${n} 个标签，保留了 ${e.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  async closeOtherTabs(t) {
    if (this.currentPanelIndex !== 0) return;
    const e = this.firstPanelTabs.filter(
      (i) => i.blockId === t.blockId || i.isPinned
    );
    this.firstPanelTabs.filter(
      (i) => i.blockId !== t.blockId && !i.isPinned
    ).forEach((i) => {
      this.closedTabs.add(i.blockId);
    });
    const a = this.firstPanelTabs.length - e.length;
    this.firstPanelTabs = e, this.debouncedUpdateTabsUI(), await this.saveFirstPanelTabs(), await this.saveClosedTabs(), this.log(`🗑️ 已关闭其他 ${a} 个标签，保留了当前标签和固定标签`);
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
    const a = e.textContent, i = e.style.cssText, s = document.createElement("input");
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
    const u = async () => {
      const g = s.value.trim();
      if (g && g !== t.title) {
        await this.updateTabTitle(t, g);
        return;
      }
      e.textContent = a, e.style.cssText = i;
    }, h = () => {
      e.textContent = a, e.style.cssText = i;
    };
    s.addEventListener("blur", u), s.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), u()) : g.key === "Escape" && (g.preventDefault(), h());
    }), s.addEventListener("click", (g) => {
      g.stopPropagation();
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
    const i = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    let s = { x: "50%", y: "50%" };
    if (i) {
      const h = i.getBoundingClientRect(), g = window.innerWidth, d = window.innerHeight, f = 300, b = 100, p = 20;
      let v = h.left, x = h.top - b - 10;
      v + f > g - p && (v = g - f - p), v < p && (v = p), x < p && (x = h.bottom + 10, x + b > d - p && (x = (d - b) / 2)), x + b > d - p && (x = d - b - p), v = Math.max(p, Math.min(v, g - f - p)), x = Math.max(p, Math.min(x, d - b - p)), s = { x: `${v}px`, y: `${x}px` };
    }
    const o = orca.components.InputBox, l = e.createElement(o, {
      label: "重命名标签",
      defaultValue: t.title,
      onConfirm: (h, g, d) => {
        h && h.trim() && h.trim() !== t.title && this.updateTabTitle(t, h.trim()), d();
      },
      onCancel: (h) => {
        h();
      }
    }, (h) => e.createElement("div", {
      style: {
        position: "absolute",
        left: s.x,
        top: s.y,
        pointerEvents: "auto"
      },
      onClick: h
    }, ""));
    n.render(l, a), setTimeout(() => {
      const h = a.querySelector("div");
      h && h.click();
    }, 0);
    const c = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(a), a.remove();
      }, 100);
    }, u = (h) => {
      h.key === "Escape" && (c(), document.removeEventListener("keydown", u));
    };
    document.addEventListener("keydown", u);
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
    const a = document.createElement("input");
    a.type = "text", a.value = t.title, a.style.cssText = `
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: #333;
      width: 100%;
      padding: 4px 0;
    `;
    const i = document.createElement("div");
    i.style.cssText = `
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
    }), i.appendChild(s), i.appendChild(o), n.appendChild(a), n.appendChild(i);
    const l = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    if (l) {
      const g = l.getBoundingClientRect();
      n.style.left = `${g.left}px`, n.style.top = `${g.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), a.focus(), a.select();
    const c = () => {
      const g = a.value.trim();
      g && g !== t.title && this.updateTabTitle(t, g), n.remove();
    }, u = () => {
      n.remove();
    };
    s.addEventListener("click", c), o.addEventListener("click", u), a.addEventListener("keydown", (g) => {
      g.key === "Enter" ? (g.preventDefault(), c()) : g.key === "Escape" && (g.preventDefault(), u());
    });
    const h = (g) => {
      n.contains(g.target) || (u(), document.removeEventListener("click", h));
    };
    setTimeout(() => {
      document.addEventListener("click", h);
    }, 100);
  }
  /**
   * 更新标签标题
   */
  async updateTabTitle(t, e) {
    try {
      const n = this.firstPanelTabs.findIndex((a) => a.blockId === t.blockId);
      n !== -1 && (this.firstPanelTabs[n].title = e, await this.saveFirstPanelTabs(), await this.updateTabsUI(), this.log(`📝 标签重命名: "${t.title}" -> "${e}"`));
    } catch (n) {
      this.error("重命名标签失败:", n);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(t, e) {
    const n = window.React, a = window.ReactDOM;
    if (!n || !a || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      setTimeout(() => {
        const i = window.React, s = window.ReactDOM;
        !i || !s || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText ? t.addEventListener("contextmenu", (o) => {
          o.preventDefault(), o.stopPropagation(), o.stopImmediatePropagation(), this.showTabContextMenu(o, e);
        }) : this.createOrcaContextMenu(t, e);
      }, 100);
      return;
    }
    this.createOrcaContextMenu(t, e);
  }
  createOrcaContextMenu(t, e) {
    const n = window.React, a = window.ReactDOM, i = document.createElement("div");
    i.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, t.appendChild(i);
    const s = orca.components.ContextMenu, o = orca.components.Menu, l = orca.components.MenuText, c = orca.components.MenuSeparator, u = n.createElement(s, {
      menu: (d) => n.createElement(o, {}, [
        n.createElement(l, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            d(), this.renameTab(e);
          }
        }),
        n.createElement(l, {
          key: "pin",
          title: e.isPinned ? "取消固定" : "固定标签",
          preIcon: e.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          shortcut: "Ctrl+P",
          onClick: () => {
            d(), this.toggleTabPinStatus(e);
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
            d(), this.closeTab(e);
          }
        }),
        n.createElement(l, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            d(), this.closeOtherTabs(e);
          }
        }),
        n.createElement(l, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            d(), this.closeAllTabs();
          }
        })
      ])
    }, (d, f) => n.createElement("div", {
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
        p.preventDefault(), p.stopPropagation(), d(p);
      }
    }));
    a.render(u, i);
    const h = () => {
      a.unmountComponentAtNode(i), i.remove();
    }, g = new MutationObserver((d) => {
      d.forEach((f) => {
        f.removedNodes.forEach((b) => {
          b === t && (h(), g.disconnect());
        });
      });
    });
    g.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(t, e) {
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const a = document.createElement("div");
    a.className = "tab-context-menu", a.style.cssText = `
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
    `, [
      {
        text: "重命名标签",
        action: () => this.renameTab(e)
      },
      {
        text: e.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(e)
      },
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
    ].forEach((o) => {
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
        o.action(), a.remove();
      })), a.appendChild(l);
    }), document.body.appendChild(a);
    const s = (o) => {
      a.contains(o.target) || (a.remove(), document.removeEventListener("click", s));
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
      await this.storageService.saveConfig(w.FIRST_PANEL_TABS, this.firstPanelTabs), this.log("💾 保存标签数据到API配置");
    } catch (t) {
      this.warn("无法保存第一个面板标签数据:", t);
    }
  }
  /**
   * 保存已关闭标签列表到持久化存储（使用API）
   */
  async saveClosedTabs() {
    try {
      await this.storageService.saveConfig(w.CLOSED_TABS, Array.from(this.closedTabs)), this.log("💾 保存已关闭标签列表到API配置");
    } catch (t) {
      this.warn("无法保存已关闭标签列表:", t);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（使用API）
   */
  async restoreFirstPanelTabs() {
    try {
      const t = await this.storageService.getConfig(w.FIRST_PANEL_TABS, "orca-tabs-plugin", []);
      t && Array.isArray(t) ? (this.firstPanelTabs = t, this.log(`📂 从API配置恢复了 ${this.firstPanelTabs.length} 个标签页`)) : (this.firstPanelTabs = [], this.log("📂 没有找到持久化的标签数据，初始化为空数组"));
    } catch (t) {
      this.warn("无法恢复第一个面板标签数据:", t), this.firstPanelTabs = [];
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表（使用API）
   */
  async restoreClosedTabs() {
    try {
      const t = await this.storageService.getConfig(w.CLOSED_TABS, "orca-tabs-plugin", []);
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
      const a = t.charCodeAt(n);
      e = (e << 5) - e + a, e = e & e;
    }
    return Math.abs(e).toString(36);
  }
  startDrag(t) {
    t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.isDragging = !0;
    const e = this.isVerticalMode ? this.verticalPosition : this.position;
    this.dragStartX = t.clientX - e.x, this.dragStartY = t.clientY - e.y;
    const n = (i) => {
      this.isDragging && (i.preventDefault(), i.stopPropagation(), this.drag(i));
    }, a = (i) => {
      document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", a), this.stopDrag();
    };
    document.addEventListener("mousemove", n), document.addEventListener("mouseup", a), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(t) {
    if (!this.isDragging || !this.tabContainer) return;
    t.preventDefault(), this.isVerticalMode ? (this.verticalPosition.x = t.clientX - this.dragStartX, this.verticalPosition.y = t.clientY - this.dragStartY) : (this.position.x = t.clientX - this.dragStartX, this.position.y = t.clientY - this.dragStartY);
    const e = this.tabContainer.getBoundingClientRect(), n = 5, a = window.innerWidth - e.width - 5, i = 5, s = window.innerHeight - e.height - 5;
    this.isVerticalMode ? (this.verticalPosition.x = Math.max(n, Math.min(a, this.verticalPosition.x)), this.verticalPosition.y = Math.max(i, Math.min(s, this.verticalPosition.y))) : (this.position.x = Math.max(n, Math.min(a, this.position.x)), this.position.y = Math.max(i, Math.min(s, this.position.y)));
    const o = this.isVerticalMode ? this.verticalPosition : this.position;
    this.tabContainer.style.left = o.x + "px", this.tabContainer.style.top = o.y + "px", this.ensureClickableElements();
  }
  async stopDrag() {
    this.isDragging = !1, this.tabContainer && (this.tabContainer.style.cursor = "default", this.tabContainer.style.userSelect = "", this.tabContainer.style.pointerEvents = "auto", this.tabContainer.style.touchAction = ""), document.body.style.cursor = "", document.body.style.userSelect = "", document.body.style.pointerEvents = "", document.body.style.touchAction = "", document.documentElement.style.cursor = "", document.documentElement.style.userSelect = "", document.documentElement.style.pointerEvents = "", this.resetAllElements(), this.ensureClickableElements(), this.log("🔄 拖拽结束，清理所有拖拽状态"), this.isVerticalMode ? await this.saveLayoutMode() : await this.savePosition();
  }
  async savePosition() {
    try {
      await this.storageService.saveConfig(w.TABS_POSITION, this.position);
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
        verticalPosition: this.verticalPosition
      };
      await this.storageService.saveConfig(w.LAYOUT_MODE, t), this.log(`💾 布局模式已保存: ${this.isVerticalMode ? "垂直" : "水平"}, 宽度: ${this.verticalWidth}px, 位置: (${this.verticalPosition.x}, ${this.verticalPosition.y})`);
    } catch {
      this.warn("无法保存布局模式");
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
      const t = await this.storageService.getConfig(w.TABS_POSITION, "orca-tabs-plugin", { x: 20, y: 20 });
      t && (this.position = t, this.constrainPosition());
    } catch {
      this.warn("无法恢复标签位置");
    }
  }
  /**
   * 从API配置恢复布局模式
   */
  async restoreLayoutMode() {
    try {
      const t = await this.storageService.getConfig(w.LAYOUT_MODE, "orca-tabs-plugin", {
        isVerticalMode: !1,
        verticalWidth: 200,
        verticalPosition: { x: 20, y: 20 }
      });
      t ? (this.isVerticalMode = t.isVerticalMode || !1, this.verticalWidth = t.verticalWidth || 200, this.verticalPosition = t.verticalPosition || { x: 20, y: 20 }, this.log(`📐 布局模式已恢复: ${this.isVerticalMode ? "垂直" : "水平"}, 宽度: ${this.verticalWidth}px, 位置: (${this.verticalPosition.x}, ${this.verticalPosition.y})`)) : (this.isVerticalMode = !1, this.verticalWidth = 200, this.verticalPosition = { x: 20, y: 20 }, this.log("📐 布局模式: 水平 (默认)"));
    } catch {
      this.warn("无法恢复布局模式，使用默认值"), this.isVerticalMode = !1, this.verticalWidth = 200, this.verticalPosition = { x: 20, y: 20 };
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const a = window.innerWidth - 400, i = 0, s = window.innerHeight - 40;
    this.position.x = Math.max(0, Math.min(a, this.position.x)), this.position.y = Math.max(i, Math.min(s, this.position.y));
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
    var u, h, g;
    const t = this.panelIds[0], e = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!e) return;
    const n = e.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) {
      this.log("第一个面板中没有找到激活的块编辑器");
      return;
    }
    const a = n.getAttribute("data-block-id");
    if (!a) {
      this.log("激活的块编辑器没有blockId");
      return;
    }
    const i = this.firstPanelTabs.find((d) => d.blockId === a);
    if (i) {
      this.verboseLog(`📋 当前激活页面已存在: "${i.title}"`);
      const d = (u = this.tabContainer) == null ? void 0 : u.querySelectorAll(".orca-tab");
      d == null || d.forEach((b) => b.removeAttribute("data-focused"));
      const f = (h = this.tabContainer) == null ? void 0 : h.querySelector(`[data-tab-id="${a}"]`);
      f && (f.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${i.title}"`)), this.debouncedUpdateTabsUI();
      return;
    }
    let s = this.firstPanelTabs.length, o = !1;
    const l = (g = this.tabContainer) == null ? void 0 : g.querySelector('.orca-tab[data-focused="true"]');
    if (l) {
      const d = l.getAttribute("data-tab-id");
      if (d) {
        const f = this.firstPanelTabs.findIndex((b) => b.blockId === d);
        f !== -1 ? this.firstPanelTabs[f].isPinned ? (s = f + 1, o = !1, this.log("📌 聚焦标签是固定的，将在其后面插入新标签")) : (s = f, o = !0, this.log("🎯 聚焦标签不是固定的，将替换聚焦标签")) : this.log("🎯 聚焦的标签不在数组中，插入到末尾");
      } else
        this.log("🎯 聚焦的标签没有data-tab-id，插入到末尾");
    } else
      this.log("🎯 没有找到聚焦的标签，将替换最后一个非固定标签");
    this.log(`🎯 最终计算的insertIndex: ${s}, 是否替换聚焦标签: ${o}`);
    const c = await this.getTabInfo(a, t, this.firstPanelTabs.length);
    if (c) {
      if (this.verboseLog(`📋 检测到新的激活页面: "${c.title}"`), this.firstPanelTabs.length >= this.maxTabs)
        if (o && s < this.firstPanelTabs.length) {
          const d = this.firstPanelTabs[s];
          this.firstPanelTabs[s] = c, this.log(`🔄 替换聚焦标签: "${d.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((f, b) => `${b}:${f.title}`));
        } else if (s < this.firstPanelTabs.length) {
          this.log("🎯 插入前数组:", this.firstPanelTabs.map((f, b) => `${b}:${f.title}`)), this.firstPanelTabs.splice(s + 1, 0, c), this.log(`➕ 在位置 ${s + 1} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((f, b) => `${b}:${f.title}`));
          const d = this.findLastNonPinnedTabIndex();
          if (d !== -1) {
            const f = this.firstPanelTabs[d];
            this.firstPanelTabs.splice(d, 1), this.log(`🗑️ 删除末尾的非固定标签: "${f.title}" 来保持数量限制`), this.log("🎯 最终数组:", this.firstPanelTabs.map((b, p) => `${p}:${b.title}`));
          } else {
            const f = this.firstPanelTabs.findIndex((b) => b.blockId === c.blockId);
            if (f !== -1) {
              this.firstPanelTabs.splice(f, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
              return;
            }
          }
        } else {
          const d = this.findLastNonPinnedTabIndex();
          if (d !== -1) {
            const f = this.firstPanelTabs[d];
            this.firstPanelTabs[d] = c, this.log(`🔄 没有聚焦标签，替换最后一个非固定标签: "${f.title}" -> "${c.title}"`);
          } else {
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${c.title}"`);
            return;
          }
        }
      else if (o && s < this.firstPanelTabs.length) {
        const d = this.firstPanelTabs[s];
        this.firstPanelTabs[s] = c, this.log(`🔄 替换聚焦标签: "${d.title}" -> "${c.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((f, b) => `${b}:${f.title}`));
      } else
        this.firstPanelTabs.splice(s, 0, c), this.verboseLog(`➕ 在位置 ${s} 插入新标签: ${c.title}`), this.verboseLog("🎯 插入后数组:", this.firstPanelTabs.map((d, f) => `${f}:${d.title}`));
      this.closedTabs.has(a) && (this.closedTabs.delete(a), await this.saveClosedTabs(), this.log(`🔄 标签 "${c.title}" 重新显示，从已关闭列表中移除`)), await this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI();
    } else
      this.log("无法获取激活页面的标签信息");
  }
  observeChanges() {
    new MutationObserver(async (e) => {
      let n = !1, a = !1, i = !1, s = this.currentPanelIndex;
      e.forEach((o) => {
        if (o.type === "childList") {
          const l = o.target;
          if ((l.classList.contains("orca-panels-row") || l.closest(".orca-panels-row")) && (this.verboseLog("🔍 检测到面板行变化，检查新面板..."), a = !0), o.addedNodes.length > 0 && l.closest(".orca-panel")) {
            for (const u of o.addedNodes)
              if (u.nodeType === Node.ELEMENT_NODE) {
                const h = u;
                if (h.classList.contains("orca-block-editor") || h.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        o.type === "attributes" && o.attributeName === "class" && o.target.classList.contains("orca-panel") && (i = !0);
      }), i && (await this.updateCurrentPanelIndex(), s !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${s} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), a && setTimeout(async () => {
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
      const n = e[0], a = this.panelIds[0];
      n && a && n !== a && (this.log(`🔄 第一个面板已变更: ${n} -> ${a}`), await this.handleFirstPanelChange(n, a)), this.currentPanelId && !this.panelIds.includes(this.currentPanelId) && (this.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0]), await this.createTabsUI();
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
      const n = t.target, a = this.getBlockRefId(n);
      if (a) {
        t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.log(`🔗 检测到 Ctrl+点击 块引用: ${a}，将在后台新建标签页`), await this.openInNewTab(a);
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
    const n = e.length !== this.panelIds.length || !e.every((i, s) => i === this.panelIds[s]);
    if (n) {
      this.log(`📋 面板列表发生变化: ${e.length} -> ${this.panelIds.length}`), this.log(`📋 旧面板列表: [${e.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const i = e[0], s = this.panelIds[0];
      i && s && i !== s && (this.log(`🔄 第一个面板已变更: ${i} -> ${s}`), this.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), await this.handleFirstPanelChange(i, s), this.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`));
    }
    const a = document.querySelector(".orca-panel.active");
    if (a) {
      const i = a.getAttribute("data-panel-id");
      if (i && (i !== this.currentPanelId || n)) {
        const s = this.currentPanelIndex, o = this.panelIds.indexOf(i);
        o !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${i} (索引: ${s} -> ${o})`), this.currentPanelIndex = o, this.currentPanelId = i, this.debouncedUpdateTabsUI());
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
    this.tabContainer && (this.tabContainer.style.left = this.position.x + "px", this.tabContainer.style.top = this.position.y + "px");
  }
  /**
   * 重置插件缓存
   */
  async resetCache() {
    this.log("🔄 开始重置插件缓存..."), this.firstPanelTabs = [], this.closedTabs.clear();
    try {
      await this.storageService.removeConfig(w.FIRST_PANEL_TABS), await this.storageService.removeConfig(w.CLOSED_TABS), this.log("🗑️ 已删除API配置缓存: 标签页数据和已关闭标签列表");
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
let T = null;
async function Se(r) {
  W = r, ht(orca.state.locale, { "zh-CN": ut }), T = new Pe(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => T == null ? void 0 : T.init(), 500);
  }) : setTimeout(() => T == null ? void 0 : T.init(), 500), orca.commands.registerCommand(
    `${W}.resetCache`,
    async () => {
      T && await T.resetCache();
    },
    "重置插件缓存"
  ), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && (console.log(N("标签页插件已启动")), console.log(`${W} loaded.`));
}
async function Ce() {
  T && (T.unregisterHeadbarButton(), T.destroy(), T = null), orca.commands.unregisterCommand(`${W}.resetCache`);
}
export {
  Se as load,
  Ce as unload
};
