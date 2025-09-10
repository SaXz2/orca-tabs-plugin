var ct = Object.defineProperty;
var lt = (r, t, e) => t in r ? ct(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var b = (r, t, e) => lt(r, typeof t != "symbol" ? t + "" : t, e);
let Z = "en", tt = {};
function dt(r, t) {
  Z = r, tt = t;
}
function N(r, t, e) {
  var a;
  return ((a = tt[e ?? Z]) == null ? void 0 : a[r]) ?? r;
}
const ut = {
  标签页插件已启动: "标签页插件已启动",
  "your plugin code starts here": "您的插件代码从这里开始",
  今天: "今天",
  昨天: "昨天",
  明天: "明天"
}, et = 6048e5, ht = 864e5, j = Symbol.for("constructDateFrom");
function I(r, t) {
  return typeof r == "function" ? r(t) : r && typeof r == "object" && j in r ? r[j](t) : r instanceof Date ? new r.constructor(t) : new Date(t);
}
function P(r, t) {
  return I(t || r, r);
}
function nt(r, t, e) {
  const n = P(r, e == null ? void 0 : e.in);
  return isNaN(t) ? I(r, NaN) : (t && n.setDate(n.getDate() + t), n);
}
let ft = {};
function W() {
  return ft;
}
function L(r, t) {
  var o, c, l, d;
  const e = W(), n = (t == null ? void 0 : t.weekStartsOn) ?? ((c = (o = t == null ? void 0 : t.locale) == null ? void 0 : o.options) == null ? void 0 : c.weekStartsOn) ?? e.weekStartsOn ?? ((d = (l = e.locale) == null ? void 0 : l.options) == null ? void 0 : d.weekStartsOn) ?? 0, a = P(r, t == null ? void 0 : t.in), s = a.getDay(), i = (s < n ? 7 : 0) + s - n;
  return a.setDate(a.getDate() - i), a.setHours(0, 0, 0, 0), a;
}
function F(r, t) {
  return L(r, { ...t, weekStartsOn: 1 });
}
function at(r, t) {
  const e = P(r, t == null ? void 0 : t.in), n = e.getFullYear(), a = I(e, 0);
  a.setFullYear(n + 1, 0, 4), a.setHours(0, 0, 0, 0);
  const s = F(a), i = I(e, 0);
  i.setFullYear(n, 0, 4), i.setHours(0, 0, 0, 0);
  const o = F(i);
  return e.getTime() >= s.getTime() ? n + 1 : e.getTime() >= o.getTime() ? n : n - 1;
}
function X(r) {
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
function q(r, t) {
  const e = P(r, t == null ? void 0 : t.in);
  return e.setHours(0, 0, 0, 0), e;
}
function gt(r, t, e) {
  const [n, a] = rt(
    e == null ? void 0 : e.in,
    r,
    t
  ), s = q(n), i = q(a), o = +s - X(s), c = +i - X(i);
  return Math.round((o - c) / ht);
}
function mt(r, t) {
  const e = at(r, t), n = I(r, 0);
  return n.setFullYear(e, 0, 4), n.setHours(0, 0, 0, 0), F(n);
}
function _(r) {
  return I(r, Date.now());
}
function H(r, t, e) {
  const [n, a] = rt(
    e == null ? void 0 : e.in,
    r,
    t
  );
  return +q(n) == +q(a);
}
function bt(r) {
  return r instanceof Date || typeof r == "object" && Object.prototype.toString.call(r) === "[object Date]";
}
function pt(r) {
  return !(!bt(r) && typeof r != "number" || isNaN(+P(r)));
}
function yt(r, t) {
  const e = P(r, t == null ? void 0 : t.in);
  return e.setFullYear(e.getFullYear(), 0, 1), e.setHours(0, 0, 0, 0), e;
}
const Tt = {
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
}, wt = (r, t, e) => {
  let n;
  const a = Tt[r];
  return typeof a == "string" ? n = a : t === 1 ? n = a.one : n = a.other.replace("{{count}}", t.toString()), e != null && e.addSuffix ? e.comparison && e.comparison > 0 ? "in " + n : n + " ago" : n;
};
function z(r) {
  return (t = {}) => {
    const e = t.width ? String(t.width) : r.defaultWidth;
    return r.formats[e] || r.formats[r.defaultWidth];
  };
}
const xt = {
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
}, vt = {
  date: z({
    formats: xt,
    defaultWidth: "full"
  }),
  time: z({
    formats: It,
    defaultWidth: "full"
  }),
  dateTime: z({
    formats: Pt,
    defaultWidth: "full"
  })
}, kt = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ct = (r, t, e, n) => kt[r];
function D(r) {
  return (t, e) => {
    const n = e != null && e.context ? String(e.context) : "standalone";
    let a;
    if (n === "formatting" && r.formattingValues) {
      const i = r.defaultFormattingWidth || r.defaultWidth, o = e != null && e.width ? String(e.width) : i;
      a = r.formattingValues[o] || r.formattingValues[i];
    } else {
      const i = r.defaultWidth, o = e != null && e.width ? String(e.width) : r.defaultWidth;
      a = r.values[o] || r.values[i];
    }
    const s = r.argumentCallback ? r.argumentCallback(t) : t;
    return a[s];
  };
}
const $t = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, St = {
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
}, Lt = (r, t) => {
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
}, At = {
  ordinalNumber: Lt,
  era: D({
    values: $t,
    defaultWidth: "wide"
  }),
  quarter: D({
    values: St,
    defaultWidth: "wide",
    argumentCallback: (r) => r - 1
  }),
  month: D({
    values: Et,
    defaultWidth: "wide"
  }),
  day: D({
    values: Mt,
    defaultWidth: "wide"
  }),
  dayPeriod: D({
    values: Dt,
    defaultWidth: "wide",
    formattingValues: Ot,
    defaultFormattingWidth: "wide"
  })
};
function O(r) {
  return (t, e = {}) => {
    const n = e.width, a = n && r.matchPatterns[n] || r.matchPatterns[r.defaultMatchWidth], s = t.match(a);
    if (!s)
      return null;
    const i = s[0], o = n && r.parsePatterns[n] || r.parsePatterns[r.defaultParseWidth], c = Array.isArray(o) ? Bt(o, (u) => u.test(i)) : (
      // [TODO] -- I challenge you to fix the type
      Nt(o, (u) => u.test(i))
    );
    let l;
    l = r.valueCallback ? r.valueCallback(c) : c, l = e.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      e.valueCallback(l)
    ) : l;
    const d = t.slice(i.length);
    return { value: l, rest: d };
  };
}
function Nt(r, t) {
  for (const e in r)
    if (Object.prototype.hasOwnProperty.call(r, e) && t(r[e]))
      return e;
}
function Bt(r, t) {
  for (let e = 0; e < r.length; e++)
    if (t(r[e]))
      return e;
}
function Ft(r) {
  return (t, e = {}) => {
    const n = t.match(r.matchPattern);
    if (!n) return null;
    const a = n[0], s = t.match(r.parsePattern);
    if (!s) return null;
    let i = r.valueCallback ? r.valueCallback(s[0]) : s[0];
    i = e.valueCallback ? e.valueCallback(i) : i;
    const o = t.slice(a.length);
    return { value: i, rest: o };
  };
}
const qt = /^(\d+)(th|st|nd|rd)?/i, Wt = /\d+/i, Yt = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Rt = {
  any: [/^b/i, /^(a|c)/i]
}, Ut = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, zt = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, _t = {
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
}, jt = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, Xt = {
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
    matchPattern: qt,
    parsePattern: Wt,
    valueCallback: (r) => parseInt(r, 10)
  }),
  era: O({
    matchPatterns: Yt,
    defaultMatchWidth: "wide",
    parsePatterns: Rt,
    defaultParseWidth: "any"
  }),
  quarter: O({
    matchPatterns: Ut,
    defaultMatchWidth: "wide",
    parsePatterns: zt,
    defaultParseWidth: "any",
    valueCallback: (r) => r + 1
  }),
  month: O({
    matchPatterns: _t,
    defaultMatchWidth: "wide",
    parsePatterns: Ht,
    defaultParseWidth: "any"
  }),
  day: O({
    matchPatterns: jt,
    defaultMatchWidth: "wide",
    parsePatterns: Xt,
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
  formatDistance: wt,
  formatLong: vt,
  formatRelative: Ct,
  localize: At,
  match: Kt,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Vt(r, t) {
  const e = P(r, t == null ? void 0 : t.in);
  return gt(e, yt(e)) + 1;
}
function Zt(r, t) {
  const e = P(r, t == null ? void 0 : t.in), n = +F(e) - +mt(e);
  return Math.round(n / et) + 1;
}
function st(r, t) {
  var d, u, h, f;
  const e = P(r, t == null ? void 0 : t.in), n = e.getFullYear(), a = W(), s = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((u = (d = t == null ? void 0 : t.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? a.firstWeekContainsDate ?? ((f = (h = a.locale) == null ? void 0 : h.options) == null ? void 0 : f.firstWeekContainsDate) ?? 1, i = I((t == null ? void 0 : t.in) || r, 0);
  i.setFullYear(n + 1, 0, s), i.setHours(0, 0, 0, 0);
  const o = L(i, t), c = I((t == null ? void 0 : t.in) || r, 0);
  c.setFullYear(n, 0, s), c.setHours(0, 0, 0, 0);
  const l = L(c, t);
  return +e >= +o ? n + 1 : +e >= +l ? n : n - 1;
}
function te(r, t) {
  var o, c, l, d;
  const e = W(), n = (t == null ? void 0 : t.firstWeekContainsDate) ?? ((c = (o = t == null ? void 0 : t.locale) == null ? void 0 : o.options) == null ? void 0 : c.firstWeekContainsDate) ?? e.firstWeekContainsDate ?? ((d = (l = e.locale) == null ? void 0 : l.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, a = st(r, t), s = I((t == null ? void 0 : t.in) || r, 0);
  return s.setFullYear(a, 0, n), s.setHours(0, 0, 0, 0), L(s, t);
}
function ee(r, t) {
  const e = P(r, t == null ? void 0 : t.in), n = +L(e, t) - +te(e, t);
  return Math.round(n / et) + 1;
}
function p(r, t) {
  const e = r < 0 ? "-" : "", n = Math.abs(r).toString().padStart(t, "0");
  return e + n;
}
const v = {
  // Year
  y(r, t) {
    const e = r.getFullYear(), n = e > 0 ? e : 1 - e;
    return p(t === "yy" ? n % 100 : n, t.length);
  },
  // Month
  M(r, t) {
    const e = r.getMonth();
    return t === "M" ? String(e + 1) : p(e + 1, 2);
  },
  // Day of the month
  d(r, t) {
    return p(r.getDate(), t.length);
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
    return p(r.getHours() % 12 || 12, t.length);
  },
  // Hour [0-23]
  H(r, t) {
    return p(r.getHours(), t.length);
  },
  // Minute
  m(r, t) {
    return p(r.getMinutes(), t.length);
  },
  // Second
  s(r, t) {
    return p(r.getSeconds(), t.length);
  },
  // Fraction of second
  S(r, t) {
    const e = t.length, n = r.getMilliseconds(), a = Math.trunc(
      n * Math.pow(10, e - 3)
    );
    return p(a, t.length);
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
    return v.y(r, t);
  },
  // Local week-numbering year
  Y: function(r, t, e, n) {
    const a = st(r, n), s = a > 0 ? a : 1 - a;
    if (t === "YY") {
      const i = s % 100;
      return p(i, 2);
    }
    return t === "Yo" ? e.ordinalNumber(s, { unit: "year" }) : p(s, t.length);
  },
  // ISO week-numbering year
  R: function(r, t) {
    const e = at(r);
    return p(e, t.length);
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
    return p(e, t.length);
  },
  // Quarter
  Q: function(r, t, e) {
    const n = Math.ceil((r.getMonth() + 1) / 3);
    switch (t) {
      case "Q":
        return String(n);
      case "QQ":
        return p(n, 2);
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
        return p(n, 2);
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
        return v.M(r, t);
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
        return p(n + 1, 2);
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
    const a = ee(r, n);
    return t === "wo" ? e.ordinalNumber(a, { unit: "week" }) : p(a, t.length);
  },
  // ISO week of year
  I: function(r, t, e) {
    const n = Zt(r);
    return t === "Io" ? e.ordinalNumber(n, { unit: "week" }) : p(n, t.length);
  },
  // Day of the month
  d: function(r, t, e) {
    return t === "do" ? e.ordinalNumber(r.getDate(), { unit: "date" }) : v.d(r, t);
  },
  // Day of year
  D: function(r, t, e) {
    const n = Vt(r);
    return t === "Do" ? e.ordinalNumber(n, { unit: "dayOfYear" }) : p(n, t.length);
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
    const a = r.getDay(), s = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "e":
        return String(s);
      case "ee":
        return p(s, 2);
      case "eo":
        return e.ordinalNumber(s, { unit: "day" });
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
    const a = r.getDay(), s = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (t) {
      case "c":
        return String(s);
      case "cc":
        return p(s, t.length);
      case "co":
        return e.ordinalNumber(s, { unit: "day" });
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
        return p(a, t.length);
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
    return v.h(r, t);
  },
  // Hour [0-23]
  H: function(r, t, e) {
    return t === "Ho" ? e.ordinalNumber(r.getHours(), { unit: "hour" }) : v.H(r, t);
  },
  // Hour [0-11]
  K: function(r, t, e) {
    const n = r.getHours() % 12;
    return t === "Ko" ? e.ordinalNumber(n, { unit: "hour" }) : p(n, t.length);
  },
  // Hour [1-24]
  k: function(r, t, e) {
    let n = r.getHours();
    return n === 0 && (n = 24), t === "ko" ? e.ordinalNumber(n, { unit: "hour" }) : p(n, t.length);
  },
  // Minute
  m: function(r, t, e) {
    return t === "mo" ? e.ordinalNumber(r.getMinutes(), { unit: "minute" }) : v.m(r, t);
  },
  // Second
  s: function(r, t, e) {
    return t === "so" ? e.ordinalNumber(r.getSeconds(), { unit: "second" }) : v.s(r, t);
  },
  // Fraction of second
  S: function(r, t) {
    return v.S(r, t);
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
    return p(n, t.length);
  },
  // Milliseconds timestamp
  T: function(r, t, e) {
    return p(+r, t.length);
  }
};
function J(r, t = "") {
  const e = r > 0 ? "-" : "+", n = Math.abs(r), a = Math.trunc(n / 60), s = n % 60;
  return s === 0 ? e + String(a) : e + String(a) + t + p(s, 2);
}
function K(r, t) {
  return r % 60 === 0 ? (r > 0 ? "-" : "+") + p(Math.abs(r) / 60, 2) : C(r, t);
}
function C(r, t = "") {
  const e = r > 0 ? "-" : "+", n = Math.abs(r), a = p(Math.trunc(n / 60), 2), s = p(n % 60, 2);
  return e + a + t + s;
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
}, it = (r, t) => {
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
}, ne = (r, t) => {
  const e = r.match(/(P+)(p+)?/) || [], n = e[1], a = e[2];
  if (!a)
    return Q(r, t);
  let s;
  switch (n) {
    case "P":
      s = t.dateTime({ width: "short" });
      break;
    case "PP":
      s = t.dateTime({ width: "medium" });
      break;
    case "PPP":
      s = t.dateTime({ width: "long" });
      break;
    case "PPPP":
    default:
      s = t.dateTime({ width: "full" });
      break;
  }
  return s.replace("{{date}}", Q(n, t)).replace("{{time}}", it(a, t));
}, ae = {
  p: it,
  P: ne
}, re = /^D+$/, se = /^Y+$/, ie = ["D", "DD", "YY", "YYYY"];
function oe(r) {
  return re.test(r);
}
function ce(r) {
  return se.test(r);
}
function le(r, t, e) {
  const n = de(r, t, e);
  if (console.warn(n), ie.includes(r)) throw new RangeError(n);
}
function de(r, t, e) {
  const n = r[0] === "Y" ? "years" : "days of the month";
  return `Use \`${r.toLowerCase()}\` instead of \`${r}\` (in \`${t}\`) for formatting ${n} to the input \`${e}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const ue = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, he = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, fe = /^'([^]*?)'?$/, ge = /''/g, me = /[a-zA-Z]/;
function A(r, t, e) {
  var d, u, h, f;
  const n = W(), a = n.locale ?? Qt, s = n.firstWeekContainsDate ?? ((u = (d = n.locale) == null ? void 0 : d.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, i = n.weekStartsOn ?? ((f = (h = n.locale) == null ? void 0 : h.options) == null ? void 0 : f.weekStartsOn) ?? 0, o = P(r, e == null ? void 0 : e.in);
  if (!pt(o))
    throw new RangeError("Invalid time value");
  let c = t.match(he).map((g) => {
    const m = g[0];
    if (m === "p" || m === "P") {
      const y = ae[m];
      return y(g, a.formatLong);
    }
    return g;
  }).join("").match(ue).map((g) => {
    if (g === "''")
      return { isToken: !1, value: "'" };
    const m = g[0];
    if (m === "'")
      return { isToken: !1, value: be(g) };
    if (G[m])
      return { isToken: !0, value: g };
    if (m.match(me))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + m + "`"
      );
    return { isToken: !1, value: g };
  });
  a.localize.preprocessor && (c = a.localize.preprocessor(o, c));
  const l = {
    firstWeekContainsDate: s,
    weekStartsOn: i,
    locale: a
  };
  return c.map((g) => {
    if (!g.isToken) return g.value;
    const m = g.value;
    (ce(m) || oe(m)) && le(m, t, String(r));
    const y = G[m[0]];
    return y(o, m, a.localize, l);
  }).join("");
}
function be(r) {
  const t = r.match(fe);
  return t ? t[1].replace(ge, "'") : r;
}
function pe(r, t) {
  return H(
    I(r, r),
    _(r)
  );
}
function ye(r, t) {
  return H(
    r,
    nt(_(r), 1),
    t
  );
}
function Te(r, t, e) {
  return nt(r, -1, e);
}
function we(r, t) {
  return H(
    I(r, r),
    Te(_(r))
  );
}
const V = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
}, xe = {
  JSON: 0,
  Text: 1
};
let B;
class Ie {
  constructor() {
    b(this, "firstPanelTabs", []);
    // 只存储第一个面板的标签数据
    b(this, "currentPanelId", "");
    b(this, "panelIds", []);
    // 所有面板ID列表
    b(this, "currentPanelIndex", 0);
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
  }
  // 当前面板索引
  // 调试日志（开发模式）
  log(...t) {
    typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && console.log(...t);
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
      this.maxTabs = orca.state.settings[V.CachedEditorNum] || 10;
    } catch {
      this.warn("无法读取最大标签数设置，使用默认值10");
    }
    await this.registerPluginSettings(), this.registerBlockMenuCommands(), this.restorePosition(), this.discoverPanels(), this.restoreFirstPanelTabs(), this.restoreClosedTabs(), this.firstPanelTabs.length > 0 ? this.log("检测到持久化数据，使用固化的标签页状态") : (this.log("首次使用，扫描第一个面板创建标签页"), await this.scanFirstPanel()), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.isInitialized = !0, this.log("✅ 插件初始化完成");
  }
  /**
   * 设置主题变化监听器
   */
  setupThemeChangeListener() {
    this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null);
    const t = (s) => {
      this.log("检测到主题变化，重新渲染标签页颜色:", s), this.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        this.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", t), this.log("主题变化监听器注册成功");
    } catch (s) {
      this.error("主题变化监听器注册失败:", s);
    }
    let e = orca.state.themeMode;
    const a = setInterval(() => {
      const s = orca.state.themeMode;
      s !== e && (this.log("备用检测：主题从", e, "切换到", s), e = s, setTimeout(() => {
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
  debouncedSwapTab(t, e) {
    this.lastSwapTarget !== t.blockId && (this.swapTab(t, e), this.lastSwapTarget = t.blockId);
  }
  /**
   * 交换两个标签的位置（优化版）
   */
  swapTab(t, e) {
    if (this.currentPanelIndex !== 0) {
      this.log("只有第一个面板支持拖拽排序");
      return;
    }
    const n = this.firstPanelTabs.findIndex((s) => s.blockId === t.blockId), a = this.firstPanelTabs.findIndex((s) => s.blockId === e.blockId);
    if (n !== -1 && a !== -1 && n !== a) {
      if (a < n) {
        const i = this.firstPanelTabs.splice(a, 1)[0], o = n > a ? n - 1 : n;
        this.firstPanelTabs.splice(o + 1, 0, i);
      } else {
        const i = this.firstPanelTabs.splice(a, 1)[0];
        this.firstPanelTabs.splice(n, 0, i);
      }
      this.firstPanelTabs.forEach((i, o) => {
        i.order = o;
      }), this.sortTabsByPinStatus(), this.saveFirstPanelTabs(), this.draggingTab || this.debouncedUpdateTabsUI();
    }
  }
  /**
   * 发现所有面板
   */
  discoverPanels() {
    const t = Date.now();
    if (t - this.lastPanelDiscoveryTime < 1e3 && this.panelDiscoveryCache && t - this.panelDiscoveryCache.timestamp < 1e3) {
      this.panelIds = [...this.panelDiscoveryCache.panelIds], this.log("📋 使用面板发现缓存，面板ID列表:", this.panelIds);
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
    const a = document.querySelectorAll(".orca-panel"), s = n.querySelectorAll(".orca-panel");
    if (this.panelIds = [], s.forEach((i, o) => {
      const c = i.getAttribute("data-panel-id"), l = i.classList.contains("active"), d = i.offsetParent !== null, u = i.getBoundingClientRect(), h = this.isMenuPanel(i);
      this.log(`面板 ${o + 1}: ID=${c}, 激活=${l}, 可见=${d}, 菜单=${h}, 位置=(${u.left}, ${u.top})`), c && !h ? this.panelIds.push(c) : h ? this.log(`🚫 跳过菜单面板: ${c}`) : this.warn(`❌ 面板 ${o + 1} 没有 data-panel-id 属性`);
    }), s.length < 2 && a.length >= 2 && (this.log("⚠️ 在 .orca-panels-row 中面板不足，尝试从整个文档中查找..."), a.forEach((i, o) => {
      const c = i.getAttribute("data-panel-id"), l = this.isMenuPanel(i);
      c && !this.panelIds.includes(c) && !l ? (this.panelIds.push(c), this.log(`➕ 从文档中找到额外面板: ID=${c}`)) : l && this.log(`🚫 跳过菜单面板: ${c}`);
    })), this.panelIds.length > 0) {
      const i = document.querySelector(".orca-panel.active");
      if (i) {
        const o = i.getAttribute("data-panel-id"), c = this.panelIds.indexOf(o || "");
        c !== -1 ? (this.currentPanelId = o || "", this.currentPanelIndex = c) : (this.currentPanelId = this.panelIds[0], this.currentPanelIndex = 0);
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
    const s = await this.getTabInfo(a, t, 0);
    s ? (this.firstPanelTabs = [s], this.saveFirstPanelTabs(), await this.updateTabsUI()) : this.log("无法获取激活页面的标签信息");
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
      let e = orca.state.settings[V.JournalDateFormat];
      return (!e || typeof e != "string") && (e = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), pe(t) ? N("今天") : we(t) ? N("昨天") : ye(t) ? N("明天") : this.formatDateWithPattern(t, e);
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
            const a = n.v.toString(), s = await this.getTabInfo(a, "", 0);
            s && s.title ? e += s.title : e += `[[块${a}]]`;
          } catch (a) {
            this.warn("处理r类型块引用失败:", a), e += "[[块引用]]";
          }
        else n.v && (e += n.v);
      else if (n.t === "br" && n.v)
        try {
          const a = n.v.toString(), s = await this.getTabInfo(a, "", 0);
          s && s.title ? e += s.title : e += `[[块${a}]]`;
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
      if (!e || e.type !== xe.JSON || !e.value)
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
          const a = t.getDay(), i = ["日", "一", "二", "三", "四", "五", "六"][a], o = e.replace(/E/g, i);
          return A(t, o);
        } else
          return A(t, e);
      else
        return A(t, e);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const s of a)
        try {
          return A(t, s);
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
      let s = "", i = "", o = "", c = !1;
      try {
        if (a.aliases && a.aliases.length > 0)
          s = a.aliases[0];
        else if (a.content && a.content.length > 0)
          s = (await this.extractTextFromContent(a.content)).substring(0, 50);
        else if (a.text)
          s = a.text.substring(0, 50);
        else {
          const l = this.extractJournalInfo(a);
          console.log(`🔍 检查块 ${t} 是否为日期块:`, l), l ? (c = !0, s = `📅 ${this.formatJournalDate(l)}`, console.log(`📅 识别为日期块: ${s}, 原始日期: ${l.toISOString()}`)) : (s = `块 ${t}`, console.log(`❌ 不是日期块: ${t}`));
        }
      } catch (l) {
        this.warn("获取标题失败:", l), s = `块 ${t}`;
      }
      try {
        const l = this.findProperty(a, "_color"), d = this.findProperty(a, "_icon");
        l && l.type === 1 && (i = l.value), d && d.type === 1 && (o = d.value);
      } catch (l) {
        this.warn("获取属性失败:", l);
      }
      return {
        blockId: t,
        panelId: e,
        title: s || `块 ${t}`,
        color: i,
        icon: o,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: n
      };
    } catch (a) {
      return this.error("获取标签信息失败:", a), null;
    }
  }
  async createTabsUI() {
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), this.log("📱 使用自动切换模式，不创建面板切换器"), this.tabContainer = document.createElement("div"), this.tabContainer.className = "orca-tabs-container";
    const e = orca.state.themeMode === "dark" ? "transparent" : "rgba(255, 255, 255, 0.1)";
    this.tabContainer.style.cssText = `
      position: fixed;
      top: ${this.position.y}px;
      left: ${this.position.x}px;
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
    `, this.tabContainer.addEventListener("mousedown", (a) => {
      const s = a.target;
      s.closest(".orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && a.stopPropagation();
    }), this.tabContainer.addEventListener("click", (a) => {
      const s = a.target;
      s.closest(".orca-tab, .new-tab-button, .drag-handle") && !s.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu") && (a.stopPropagation(), console.log(`🖱️ 标签栏容器点击事件被阻止: ${s.className}`));
    });
    const n = document.createElement("div");
    n.className = "drag-handle", n.style.cssText = `
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
    `, n.innerHTML = "⋮⋮", n.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(n), document.body.appendChild(this.tabContainer), this.addDragStyles(), await this.updateTabsUI();
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
    n && a ? (this.log("📋 显示第一个面板的固化标签页"), this.sortTabsByPinStatus(), this.firstPanelTabs.forEach((s, i) => {
      var c;
      const o = this.createTabElement(s);
      (c = this.tabContainer) == null || c.appendChild(o);
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
    for (const i of e) {
      const o = i.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId, a++);
      l && n.push(l);
    }
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const s = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((i, o) => {
        const c = this.createTabElement(i);
        s.appendChild(c);
      });
    else {
      const i = document.createElement("div");
      i.className = "panel-status", i.style.cssText = `
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
      i.textContent = `面板 ${o}（无标签页）`, i.title = `当前在面板 ${o}，该面板没有标签页`, s.appendChild(i);
    }
    this.tabContainer.appendChild(s);
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
    for (const i of e) {
      const o = i.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId, a++);
      l && n.push(l);
    }
    this.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const s = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((i, o) => {
        const c = this.createTabElement(i);
        s.appendChild(c);
      });
    else {
      const i = document.createElement("div");
      i.className = "panel-status", i.style.cssText = `
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
      i.textContent = `面板 ${o}（无标签页）`, i.title = `当前在面板 ${o}，该面板没有标签页`, s.appendChild(i);
    }
    this.tabContainer.appendChild(s);
  }
  /**
   * 添加新建标签页按钮
   */
  addNewTabButton() {
    if (!this.tabContainer || this.tabContainer.querySelector(".new-tab-button")) return;
    const e = document.createElement("div");
    e.className = "new-tab-button", e.style.cssText = `
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
    `, e.innerHTML = "+", e.title = "新建标签页", e.addEventListener("mouseenter", () => {
      e.style.background = "rgba(0, 0, 0, 0.1)", e.style.color = "#333";
    }), e.addEventListener("mouseleave", () => {
      e.style.background = "transparent", e.style.color = "#666";
    }), e.addEventListener("click", async (n) => {
      n.preventDefault(), n.stopPropagation(), this.log("🆕 点击新建标签页按钮"), await this.createNewTab();
    }), this.tabContainer.appendChild(e);
  }
  /**
   * 创建标签元素
   */
  createTabElement(t) {
    console.log(`🔧 创建标签元素: ${t.title} (ID: ${t.blockId})`);
    const e = document.createElement("div");
    e.className = "orca-tab", e.setAttribute("data-tab-id", t.blockId), this.isTabActive(t) && e.setAttribute("data-focused", "true");
    const a = orca.state.themeMode === "dark";
    let s = a ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", i = a ? "#ffffff" : "#333", o = "normal";
    t.color && (s = this.applyOklchFormula(t.color, "background"), i = this.applyOklchFormula(t.color, "text"), o = "600"), e.style.cssText = `
      background: ${s};
      color: ${i};
      font-weight: ${o};
      padding: 2px 8px;
      border-radius: 4px;
      height: 24px;
      max-height: 24px;
      line-height: 20px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.2s ease;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      -webkit-app-region: no-drag;
      app-region: no-drag;
      pointer-events: auto;
    `;
    let c = t.title;
    t.icon && (c = `${t.icon} ${t.title}`), t.isPinned && (c = `${c} 📌`), e.textContent = c;
    let l = t.title;
    return t.isPinned && (l += " (已固定)"), e.title = l, e.addEventListener("click", (d) => {
      var h;
      console.log(`🖱️ 标签点击事件触发: ${t.title} (ID: ${t.blockId})`), d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation(), this.log(`🖱️ 点击标签: ${t.title} (ID: ${t.blockId})`);
      const u = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tab");
      u == null || u.forEach((f) => f.removeAttribute("data-focused")), e.setAttribute("data-focused", "true"), this.switchToTab(t);
    }), e.addEventListener("mousedown", (d) => {
      console.log(`🖱️ 标签mousedown事件触发: ${t.title} (ID: ${t.blockId})`);
    }), e.addEventListener("dblclick", (d) => {
      d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation(), this.toggleTabPinStatus(t);
    }), e.addEventListener("auxclick", (d) => {
      d.button === 1 && (d.preventDefault(), d.stopPropagation(), d.stopImmediatePropagation(), this.closeTab(t));
    }), e.addEventListener("keydown", (d) => {
      (d.target === e || e.contains(d.target)) && (d.key === "F2" ? (d.preventDefault(), d.stopPropagation(), this.renameTab(t)) : d.ctrlKey && d.key === "p" ? (d.preventDefault(), d.stopPropagation(), this.toggleTabPinStatus(t)) : d.ctrlKey && d.key === "w" && (d.preventDefault(), d.stopPropagation(), this.closeTab(t)));
    }), this.addOrcaContextMenu(e, t), e.draggable = !0, e.addEventListener("dragstart", (d) => {
      var h;
      if (d.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]")) {
        d.preventDefault();
        return;
      }
      d.dataTransfer.effectAllowed = "move", (h = d.dataTransfer) == null || h.setData("text/plain", t.blockId), this.draggingTab = t, this.lastSwapTarget = null, e.setAttribute("data-dragging", "true"), e.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true");
    }), e.addEventListener("dragend", (d) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDragVisualFeedback(), setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 50), this.log(`🔄 结束拖拽标签: ${t.title}`);
    }), e.addEventListener("dragover", (d) => {
      d.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== t.blockId && (d.preventDefault(), d.dataTransfer.dropEffect = "move", this.addDragOverEffect(e), this.debouncedSwapTab(t, this.draggingTab));
    }), e.addEventListener("dragenter", (d) => {
      d.target.closest(".sidebar, .side-panel, .panel-resize, .resize-handle, .orca-sidebar, .orca-panel, .orca-menu, .orca-recents-menu, [data-panel-id]") || this.draggingTab && this.draggingTab.blockId !== t.blockId && (d.preventDefault(), this.addDragOverEffect(e));
    }), e.addEventListener("dragleave", (d) => {
      const u = e.getBoundingClientRect(), h = d.clientX, f = d.clientY;
      (h < u.left || h > u.right || f < u.top || f > u.bottom) && this.removeDragOverEffect(e);
    }), e.addEventListener("drop", (d) => {
      var h;
      d.preventDefault();
      const u = (h = d.dataTransfer) == null ? void 0 : h.getData("text/plain");
      this.log(`🔄 拖拽放置: ${u} -> ${t.blockId}`);
    }), e.addEventListener("mouseenter", () => {
      e.style.transform = "scale(1.05)", e.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
    }), e.addEventListener("mouseleave", () => {
      e.style.transform = "scale(1)", e.style.boxShadow = "none";
    }), e;
  }
  hexToRgba(t, e) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (n) {
      const a = parseInt(n[1], 16), s = parseInt(n[2], 16), i = parseInt(n[3], 16);
      return `rgba(${a}, ${s}, ${i}, ${e})`;
    }
    return `rgba(200, 200, 200, ${e})`;
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(t) {
    const e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (e) {
      const n = parseInt(e[1], 16), a = parseInt(e[2], 16), s = parseInt(e[3], 16);
      return (0.299 * n + 0.587 * a + 0.114 * s) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(t, e) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (n) {
      let a = parseInt(n[1], 16), s = parseInt(n[2], 16), i = parseInt(n[3], 16);
      a = Math.floor(a * (1 - e)), s = Math.floor(s * (1 - e)), i = Math.floor(i * (1 - e));
      const o = a.toString(16).padStart(2, "0"), c = s.toString(16).padStart(2, "0"), l = i.toString(16).padStart(2, "0");
      return `#${o}${c}${l}`;
    }
    return t;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(t, e, n) {
    const a = t / 255, s = e / 255, i = n / 255, o = (U) => U <= 0.04045 ? U / 12.92 : Math.pow((U + 0.055) / 1.055, 2.4), c = o(a), l = o(s), d = o(i), u = c * 0.4124564 + l * 0.3575761 + d * 0.1804375, h = c * 0.2126729 + l * 0.7151522 + d * 0.072175, f = c * 0.0193339 + l * 0.119192 + d * 0.9503041, g = 0.2104542553 * u + 0.793617785 * h - 0.0040720468 * f, m = 1.9779984951 * u - 2.428592205 * h + 0.4505937099 * f, y = 0.0259040371 * u + 0.7827717662 * h - 0.808675766 * f, w = Math.cbrt(g), T = Math.cbrt(m), k = Math.cbrt(y), Y = 0.2104542553 * w + 0.793617785 * T + 0.0040720468 * k, S = 1.9779984951 * w - 2.428592205 * T + 0.4505937099 * k, E = 0.0259040371 * w + 0.7827717662 * T - 0.808675766 * k, M = Math.sqrt(S * S + E * E), R = Math.atan2(E, S) * 180 / Math.PI, ot = R < 0 ? R + 360 : R;
    return { l: Y, c: M, h: ot };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(t, e, n) {
    const a = n * Math.PI / 180, s = e * Math.cos(a), i = e * Math.sin(a), o = t, c = s, l = i, d = o * o * o, u = c * c * c, h = l * l * l, f = 1.0478112 * d + 0.0228866 * u - 0.050217 * h, g = 0.0295424 * d + 0.9904844 * u + 0.0170491 * h, m = -92345e-7 * d + 0.0150436 * u + 0.7521316 * h, y = 3.2404542 * f - 1.5371385 * g - 0.4985314 * m, w = -0.969266 * f + 1.8760108 * g + 0.041556 * m, T = 0.0556434 * f - 0.2040259 * g + 1.0572252 * m, k = (M) => M <= 31308e-7 ? 12.92 * M : 1.055 * Math.pow(M, 1 / 2.4) - 0.055, Y = Math.max(0, Math.min(255, Math.round(k(y) * 255))), S = Math.max(0, Math.min(255, Math.round(k(w) * 255))), E = Math.max(0, Math.min(255, Math.round(k(T) * 255)));
    return { r: Y, g: S, b: E };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(t, e) {
    const n = orca.state.themeMode === "dark", a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    if (!a) return t;
    const s = parseInt(a[1], 16), i = parseInt(a[2], 16), o = parseInt(a[3], 16);
    if (e === "text") {
      const c = (s + i + o) / 3;
      if (n)
        if (c < 80) {
          const d = Math.min(255, Math.round(s * 1.6)), u = Math.min(255, Math.round(i * 1.6)), h = Math.min(255, Math.round(o * 1.6));
          return `rgb(${d}, ${u}, ${h})`;
        } else if (c < 150) {
          const d = Math.min(255, Math.round(s * 1.3)), u = Math.min(255, Math.round(i * 1.3)), h = Math.min(255, Math.round(o * 1.3));
          return `rgb(${d}, ${u}, ${h})`;
        } else {
          const d = Math.min(255, Math.round(s * 1.1)), u = Math.min(255, Math.round(i * 1.1)), h = Math.min(255, Math.round(o * 1.1));
          return `rgb(${d}, ${u}, ${h})`;
        }
      else if (c > 200) {
        const d = Math.max(0, Math.round(s * 0.4)), u = Math.max(0, Math.round(i * 0.4)), h = Math.max(0, Math.round(o * 0.4));
        return `rgb(${d}, ${u}, ${h})`;
      } else if (c > 150) {
        const d = Math.max(0, Math.round(s * 0.6)), u = Math.max(0, Math.round(i * 0.6)), h = Math.max(0, Math.round(o * 0.6));
        return `rgb(${d}, ${u}, ${h})`;
      } else {
        const d = Math.max(0, Math.round(s * 0.8)), u = Math.max(0, Math.round(i * 0.8)), h = Math.max(0, Math.round(o * 0.8));
        return `rgb(${d}, ${u}, ${h})`;
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
            } catch (s) {
              console.log("❌ 今天导航失败:", s), a = /* @__PURE__ */ new Date(), console.log(`📅 回退到日期格式: ${a.toISOString()}`);
            }
          } else if (t.title.includes("昨天") || t.title.includes("Yesterday")) {
            console.log("📅 使用原生命令跳转到昨天");
            try {
              await orca.commands.invokeCommand("core.goYesterday"), console.log("✅ 昨天导航成功");
              return;
            } catch (s) {
              console.log("❌ 昨天导航失败:", s), a = /* @__PURE__ */ new Date(), a.setDate(a.getDate() - 1), console.log(`📅 回退到日期格式: ${a.toISOString()}`);
            }
          } else if (t.title.includes("明天") || t.title.includes("Tomorrow")) {
            console.log("📅 使用原生命令跳转到明天");
            try {
              await orca.commands.invokeCommand("core.goTomorrow"), console.log("✅ 明天导航成功");
              return;
            } catch (s) {
              console.log("❌ 明天导航失败:", s), a = /* @__PURE__ */ new Date(), a.setDate(a.getDate() + 1), console.log(`📅 回退到日期格式: ${a.toISOString()}`);
            }
          } else {
            const s = t.title.match(/(\d{4}-\d{2}-\d{2})/);
            if (s) {
              const i = s[1];
              a = /* @__PURE__ */ new Date(i + "T00:00:00.000Z"), isNaN(a.getTime()) ? (console.log(`❌ 无效的日期格式: ${i}`), a = null) : console.log(`📅 从标题提取日期: ${i} -> ${a.toISOString()}`);
            } else {
              console.log(`🔍 尝试从块信息中获取原始日期: ${t.blockId}`);
              try {
                const i = await orca.invokeBackend("get-block", parseInt(t.blockId));
                if (i) {
                  const o = this.extractJournalInfo(i);
                  o && !isNaN(o.getTime()) ? (a = o, console.log(`📅 从块信息获取日期: ${o.toISOString()}`)) : console.log("❌ 块信息中未找到有效日期信息");
                } else
                  console.log("❌ 无法获取块信息");
              } catch (i) {
                console.log("❌ 获取块信息失败:", i), this.warn("无法获取块信息:", i);
              }
            }
          }
          if (a) {
            console.log(`📅 使用日期导航: ${a.toISOString().split("T")[0]}`), this.log(`📅 使用日期导航: ${a.toISOString().split("T")[0]}`);
            try {
              if (isNaN(a.getTime()))
                throw new Error("Invalid date");
              console.log(`📅 使用简单日期格式: ${a.toISOString()}`), await orca.nav.goTo("journal", { date: a }, n), console.log("✅ 日期导航成功");
            } catch (s) {
              console.log("❌ 日期导航失败:", s);
              try {
                console.log("🔄 尝试 Orca 日期格式");
                const i = {
                  t: 2,
                  // 2 for full/absolute date
                  v: a.getTime()
                  // 使用时间戳
                };
                console.log("📅 使用 Orca 日期格式:", i), await orca.nav.goTo("journal", { date: i }, n), console.log("✅ Orca 日期导航成功");
              } catch (i) {
                throw console.log("❌ Orca 日期导航也失败:", i), i;
              }
            }
          } else {
            console.log("⚠️ 未找到日期信息，尝试使用块ID导航"), this.log("⚠️ 未找到日期信息，尝试使用块ID导航");
            try {
              await orca.nav.goTo("block", { blockId: parseInt(t.blockId) }, n), console.log("✅ 块ID导航成功");
            } catch (s) {
              throw console.log("❌ 块ID导航失败:", s), s;
            }
          }
        } else
          this.log(`🚀 尝试使用 orca.nav.goTo 导航到块 ${t.blockId}`), await orca.nav.goTo("block", { blockId: parseInt(t.blockId) }, n);
        this.log("✅ orca.nav.goTo 导航成功");
      } catch (a) {
        this.warn("导航失败，尝试备用方法:", a);
        const s = document.querySelector(`[data-block-id="${t.blockId}"]`);
        if (s)
          this.log(`🔄 使用备用方法点击块元素: ${t.blockId}`), s.click();
        else {
          this.error("无法找到目标块元素:", t.blockId);
          const i = document.querySelector(`[data-block-id="${t.blockId}"]`) || document.querySelector(`#block-${t.blockId}`) || document.querySelector(`.block-${t.blockId}`);
          i ? (this.log("🔄 找到备用块元素，尝试点击"), i.click()) : this.error("完全无法找到目标块元素");
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
      const s = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(a.blockId) }, s);
    } else
      this.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  toggleTabPinStatus(t) {
    if (this.currentPanelIndex !== 0) return;
    const e = this.firstPanelTabs.findIndex((n) => n.blockId === t.blockId);
    if (e !== -1) {
      this.firstPanelTabs[e].isPinned = !this.firstPanelTabs[e].isPinned, this.sortTabsByPinStatus(), this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs();
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
        let s = this.firstPanelTabs.length;
        if (a) {
          const o = this.firstPanelTabs.findIndex((c) => c.blockId === a.blockId);
          o !== -1 && (s = o + 1, this.log(`🎯 将在聚焦标签 "${a.title}" 后面插入新标签: "${n.title}"`));
        } else
          this.log("🎯 没有聚焦标签，将添加到末尾");
        if (this.firstPanelTabs.length >= this.maxTabs) {
          this.firstPanelTabs.splice(s, 0, n), this.log(`➕ 在位置 ${s} 插入新标签: ${n.title}`);
          const o = this.findLastNonPinnedTabIndex();
          if (o !== -1) {
            const c = this.firstPanelTabs[o];
            this.firstPanelTabs.splice(o, 1), this.log(`🗑️ 删除末尾的非固定标签: "${c.title}" 来保持数量限制`);
          } else {
            const c = this.firstPanelTabs.findIndex((l) => l.blockId === n.blockId);
            if (c !== -1) {
              this.firstPanelTabs.splice(c, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${n.title}"`);
              return;
            }
          }
        } else
          this.firstPanelTabs.splice(s, 0, n), this.log(`➕ 在位置 ${s} 插入新标签: ${n.title}`);
        this.saveFirstPanelTabs(), await this.updateTabsUI();
        const i = this.panelIds[0];
        await orca.nav.goTo("block", { blockId: parseInt(t) }, i), this.log(`🔄 导航到块: ${t}`), this.log(`✅ 成功创建新标签页: "${n.title}"`);
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
      if (this.firstPanelTabs.find((l) => l.blockId === t)) {
        if (this.log(`📋 块 ${t} 已存在于标签页中`), n) {
          const l = this.panelIds[0];
          await orca.nav.goTo("block", { blockId: parseInt(t) }, l);
        }
        return !0;
      }
      const s = orca.state.blocks[parseInt(t)];
      if (!s)
        return this.warn(`无法找到块 ${t}`), !1;
      const i = {
        blockId: t,
        panelId: this.panelIds[0],
        title: s.text || `块 ${t}`,
        isPinned: !1,
        order: this.firstPanelTabs.length
      };
      let o = this.firstPanelTabs.length, c = !1;
      if (e === "replace") {
        const l = this.getCurrentActiveTab();
        if (!l)
          return this.warn("没有找到当前聚焦的标签"), !1;
        const d = this.firstPanelTabs.findIndex((u) => u.blockId === l.blockId);
        if (d === -1)
          return this.warn("无法找到聚焦标签在数组中的位置"), !1;
        l.isPinned ? (this.log("📌 聚焦标签是固定的，拒绝替换操作，改为在其后面插入"), o = d + 1, c = !1) : (o = d, c = !0);
      } else if (e === "after") {
        const l = this.getCurrentActiveTab();
        if (l) {
          const d = this.firstPanelTabs.findIndex((u) => u.blockId === l.blockId);
          d !== -1 && (o = d + 1, this.log("📌 在聚焦标签后面插入新标签"));
        }
      }
      if (this.firstPanelTabs.length >= this.maxTabs)
        if (c)
          this.firstPanelTabs[o] = i;
        else {
          this.firstPanelTabs.splice(o, 0, i);
          const l = this.findLastNonPinnedTabIndex();
          if (l !== -1)
            this.firstPanelTabs.splice(l, 1);
          else {
            const d = this.firstPanelTabs.findIndex((u) => u.blockId === i.blockId);
            if (d !== -1)
              return this.firstPanelTabs.splice(d, 1), !1;
          }
        }
      else
        c ? this.firstPanelTabs[o] = i : this.firstPanelTabs.splice(o, 0, i);
      if (this.saveFirstPanelTabs(), await this.updateTabsUI(), n) {
        const l = this.panelIds[0];
        await orca.nav.goTo("block", { blockId: parseInt(t) }, l);
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
        const s = a.classList;
        if (s.contains("orca-ref") || s.contains("block-ref") || s.contains("block-reference") || s.contains("orca-fragment-r") || s.contains("fragment-r") || s.contains("orca-block-reference") || a.tagName.toLowerCase() === "a" && ((e = a.getAttribute("href")) != null && e.startsWith("#"))) {
          const o = a.getAttribute("data-block-id") || a.getAttribute("data-ref-id") || a.getAttribute("data-blockid") || a.getAttribute("data-target-block-id") || a.getAttribute("data-fragment-v") || a.getAttribute("data-v") || ((n = a.getAttribute("href")) == null ? void 0 : n.replace("#", "")) || a.getAttribute("data-id");
          if (o && !isNaN(parseInt(o)))
            return this.log(`🔗 从元素中提取到块引用ID: ${o}`), o;
        }
        const i = a.dataset;
        for (const [o, c] of Object.entries(i))
          if ((o.toLowerCase().includes("block") || o.toLowerCase().includes("ref")) && c && !isNaN(parseInt(c)))
            return this.log(`🔗 从data属性 ${o} 中提取到块引用ID: ${c}`), c;
        a = a.parentElement;
      }
      if (t.textContent) {
        const s = t.textContent.trim(), i = s.match(/\[\[(?:块)?(\d+)\]\]/) || s.match(/block[:\s]*(\d+)/i);
        if (i && i[1])
          return this.log(`🔗 从文本内容中解析到块引用ID: ${i[1]}`), i[1];
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
      for (let s = e.length - 1; s >= 0; s--) {
        const i = e[s];
        if (i.offsetParent !== null && getComputedStyle(i).display !== "none") {
          n = i;
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
        const s = document.createElement("div");
        s.className = "orca-tabs-ref-menu-separator", s.style.cssText = `
          height: 1px;
          background: rgba(0, 0, 0, 0.1);
          margin: 4px 8px;
        `, n.appendChild(s);
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
    const s = document.createElement("div");
    s.className = "orca-tabs-ref-menu-item", s.setAttribute("role", "menuitem"), s.style.cssText = `
      display: flex;
      align-items: center;
      padding: 8px 12px;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease;
      font-size: 14px;
      line-height: 1.4;
    `;
    const i = document.createElement("i");
    i.className = e, i.style.cssText = `
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
    `, s.appendChild(i), s.appendChild(o), n && n.trim() !== "") {
      const c = document.createElement("span");
      c.textContent = n, c.style.cssText = `
        font-size: 12px;
        color: #999;
        margin-left: 12px;
      `, s.appendChild(c);
    }
    return s.addEventListener("mouseenter", () => {
      s.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
    }), s.addEventListener("mouseleave", () => {
      s.style.backgroundColor = "transparent";
    }), s.addEventListener("click", (c) => {
      c.preventDefault(), c.stopPropagation(), a();
      const l = s.closest('.orca-context-menu, .context-menu, [role="menu"]');
      l && (l.style.display = "none", l.remove());
    }), s;
  }
  /**
   * 记录当前标签的滚动位置
   */
  recordScrollPosition(t) {
    try {
      const e = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(e, orca.state.panels);
      if (n && n.viewState) {
        let a = null;
        const s = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (s) {
          const i = s.closest(".orca-panel");
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
          const o = this.firstPanelTabs.findIndex((c) => c.blockId === t.blockId);
          o !== -1 && (this.firstPanelTabs[o].scrollPosition = i, this.saveFirstPanelTabs()), this.log(`📝 记录标签 "${t.title}" 滚动位置到viewState:`, i, "容器:", a.className);
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
      const s = (i = 1) => {
        if (i > 5) {
          this.warn(`恢复标签 "${t.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let o = null;
        const c = document.querySelector(`.orca-block-editor[data-block-id="${t.blockId}"]`);
        if (c) {
          const l = c.closest(".orca-panel");
          l && (o = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!o) {
          const l = document.querySelector(".orca-panel.active");
          l && (o = l.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        o || (o = document.body.scrollTop > 0 ? document.body : document.documentElement), o ? (o.scrollLeft = e.x, o.scrollTop = e.y, this.log(`🔄 恢复标签 "${t.title}" 滚动位置:`, e, "容器:", o.className, `尝试${i}`)) : setTimeout(() => s(i + 1), 200 * i);
      };
      s(), setTimeout(() => s(2), 100), setTimeout(() => s(3), 300);
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
    ].forEach((s) => {
      document.querySelectorAll(s).forEach((o, c) => {
        const l = o;
        (l.scrollTop > 0 || l.scrollLeft > 0) && this.log(`容器 ${s}[${c}]:`, {
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
    return a && this.firstPanelTabs.find((s) => s.blockId === a) || null;
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
      const n = this.getCurrentActiveTab(), a = n && n.blockId === t.blockId, s = a ? this.getAdjacentTab(t) : null;
      this.closedTabs.add(t.blockId), this.firstPanelTabs.splice(e, 1), this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), this.log(`🗑️ 标签 "${t.title}" 已关闭，已添加到关闭列表`), a && s ? (this.log(`🔄 自动切换到相邻标签: "${s.title}"`), await this.switchToTab(s)) : a && !s && this.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  closeAllTabs() {
    if (this.currentPanelIndex !== 0) return;
    this.firstPanelTabs.filter((a) => !a.isPinned).forEach((a) => {
      this.closedTabs.add(a.blockId);
    });
    const e = this.firstPanelTabs.filter((a) => a.isPinned), n = this.firstPanelTabs.length - e.length;
    this.firstPanelTabs = e, this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), this.log(`🗑️ 已关闭 ${n} 个标签，保留了 ${e.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  closeOtherTabs(t) {
    if (this.currentPanelIndex !== 0) return;
    const e = this.firstPanelTabs.filter(
      (s) => s.blockId === t.blockId || s.isPinned
    );
    this.firstPanelTabs.filter(
      (s) => s.blockId !== t.blockId && !s.isPinned
    ).forEach((s) => {
      this.closedTabs.add(s.blockId);
    });
    const a = this.firstPanelTabs.length - e.length;
    this.firstPanelTabs = e, this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), this.log(`🗑️ 已关闭其他 ${a} 个标签，保留了当前标签和固定标签`);
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
    const a = e.textContent, s = e.style.cssText, i = document.createElement("input");
    i.type = "text", i.value = t.title, i.className = "inline-rename-input";
    const o = orca.state.themeMode === "dark";
    let c = o ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", l = o ? "#ffffff" : "#333";
    t.color && (c = this.applyOklchFormula(t.color, "background"), l = this.applyOklchFormula(t.color, "text")), i.style.cssText = `
      background: ${c};
      color: ${l};
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
    `, e.textContent = "", e.appendChild(i), e.style.padding = "2px 8px", i.focus(), i.select();
    const d = async () => {
      const h = i.value.trim();
      if (h && h !== t.title) {
        await this.updateTabTitle(t, h);
        return;
      }
      e.textContent = a, e.style.cssText = s;
    }, u = () => {
      e.textContent = a, e.style.cssText = s;
    };
    i.addEventListener("blur", d), i.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), d()) : h.key === "Escape" && (h.preventDefault(), u());
    }), i.addEventListener("click", (h) => {
      h.stopPropagation();
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
    const s = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    let i = { x: "50%", y: "50%" };
    if (s) {
      const u = s.getBoundingClientRect(), h = window.innerWidth, f = window.innerHeight, g = 300, m = 100, y = 20;
      let w = u.left, T = u.top - m - 10;
      w + g > h - y && (w = h - g - y), w < y && (w = y), T < y && (T = u.bottom + 10, T + m > f - y && (T = (f - m) / 2)), T + m > f - y && (T = f - m - y), w = Math.max(y, Math.min(w, h - g - y)), T = Math.max(y, Math.min(T, f - m - y)), i = { x: `${w}px`, y: `${T}px` };
    }
    const o = orca.components.InputBox, c = e.createElement(o, {
      label: "重命名标签",
      defaultValue: t.title,
      onConfirm: (u, h, f) => {
        u && u.trim() && u.trim() !== t.title && this.updateTabTitle(t, u.trim()), f();
      },
      onCancel: (u) => {
        u();
      }
    }, (u) => e.createElement("div", {
      style: {
        position: "absolute",
        left: i.x,
        top: i.y,
        pointerEvents: "auto"
      },
      onClick: u
    }, ""));
    n.render(c, a), setTimeout(() => {
      const u = a.querySelector("div");
      u && u.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(a), a.remove();
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
    const s = document.createElement("div");
    s.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;
    const i = document.createElement("button");
    i.textContent = "确认", i.style.cssText = `
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
    `, i.addEventListener("mouseenter", () => {
      i.style.backgroundColor = "#2563eb";
    }), i.addEventListener("mouseleave", () => {
      i.style.backgroundColor = "#3b82f6";
    }), o.addEventListener("mouseenter", () => {
      o.style.backgroundColor = "#4b5563";
    }), o.addEventListener("mouseleave", () => {
      o.style.backgroundColor = "#6b7280";
    }), s.appendChild(i), s.appendChild(o), n.appendChild(a), n.appendChild(s);
    const c = document.querySelector(`[data-tab-id="${t.blockId}"]`);
    if (c) {
      const h = c.getBoundingClientRect();
      n.style.left = `${h.left}px`, n.style.top = `${h.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), a.focus(), a.select();
    const l = () => {
      const h = a.value.trim();
      h && h !== t.title && this.updateTabTitle(t, h), n.remove();
    }, d = () => {
      n.remove();
    };
    i.addEventListener("click", l), o.addEventListener("click", d), a.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), d());
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
  async updateTabTitle(t, e) {
    try {
      const n = this.firstPanelTabs.findIndex((a) => a.blockId === t.blockId);
      n !== -1 && (this.firstPanelTabs[n].title = e, this.saveFirstPanelTabs(), await this.updateTabsUI(), this.log(`📝 标签重命名: "${t.title}" -> "${e}"`));
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
      this.warn("Orca组件不可用，回退到原生右键菜单"), t.addEventListener("contextmenu", (f) => {
        f.preventDefault(), f.stopPropagation(), f.stopImmediatePropagation(), this.showTabContextMenu(f, e);
      });
      return;
    }
    const s = document.createElement("div");
    s.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, t.appendChild(s);
    const i = orca.components.ContextMenu, o = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, d = n.createElement(i, {
      menu: (f) => n.createElement(o, {}, [
        n.createElement(c, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            f(), this.renameTab(e);
          }
        }),
        n.createElement(c, {
          key: "pin",
          title: e.isPinned ? "取消固定" : "固定标签",
          preIcon: e.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          shortcut: "Ctrl+P",
          onClick: () => {
            f(), this.toggleTabPinStatus(e);
          }
        }),
        n.createElement(l, { key: "separator1" }),
        n.createElement(c, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            f(), this.closeTab(e);
          }
        }),
        n.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            f(), this.closeOtherTabs(e);
          }
        }),
        n.createElement(c, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            f(), this.closeAllTabs();
          }
        })
      ])
    }, (f, g) => n.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        background: "transparent"
      },
      onContextMenu: (y) => {
        y.preventDefault(), y.stopPropagation(), f(y);
      }
    }));
    a.render(d, s);
    const u = () => {
      a.unmountComponentAtNode(s), s.remove();
    }, h = new MutationObserver((f) => {
      f.forEach((g) => {
        g.removedNodes.forEach((m) => {
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
      const c = document.createElement("div");
      c.textContent = o.text, c.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        color: ${o.disabled ? "#999" : "#333"};
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
      `, o.disabled || (c.addEventListener("mouseenter", () => {
        c.style.backgroundColor = "#f0f0f0";
      }), c.addEventListener("mouseleave", () => {
        c.style.backgroundColor = "transparent";
      }), c.addEventListener("click", () => {
        o.action(), a.remove();
      })), a.appendChild(c);
    }), document.body.appendChild(a);
    const i = (o) => {
      a.contains(o.target) || (a.remove(), document.removeEventListener("click", i));
    };
    setTimeout(() => {
      document.addEventListener("click", i);
    }, 100);
  }
  /**
   * 保存第一个面板的标签数据到持久化存储（按库分别存储）
   */
  saveFirstPanelTabs() {
    try {
      const t = this.getStorageKey();
      localStorage.setItem(t, JSON.stringify(this.firstPanelTabs)), this.log(`💾 保存标签数据到: ${t}`);
    } catch (t) {
      this.warn("无法保存第一个面板标签数据:", t);
    }
  }
  /**
   * 保存已关闭标签列表到持久化存储
   */
  saveClosedTabs() {
    try {
      const t = this.getClosedTabsStorageKey();
      localStorage.setItem(t, JSON.stringify(Array.from(this.closedTabs))), this.log(`💾 保存已关闭标签列表到: ${t}`);
    } catch (t) {
      this.warn("无法保存已关闭标签列表:", t);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（按库分别恢复）
   */
  restoreFirstPanelTabs() {
    try {
      const t = this.getStorageKey(), e = localStorage.getItem(t);
      e ? (this.firstPanelTabs = JSON.parse(e), this.log(`📂 从 ${t} 恢复了 ${this.firstPanelTabs.length} 个标签页`)) : (this.firstPanelTabs = [], this.log(`📂 ${t} 没有保存的标签页数据`));
    } catch (t) {
      this.warn("无法恢复第一个面板标签数据:", t), this.firstPanelTabs = [];
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  restoreClosedTabs() {
    try {
      const t = this.getClosedTabsStorageKey(), e = localStorage.getItem(t);
      e ? (this.closedTabs = new Set(JSON.parse(e)), this.log(`📂 从 ${t} 恢复了 ${this.closedTabs.size} 个已关闭标签`)) : (this.closedTabs = /* @__PURE__ */ new Set(), this.log(`📂 ${t} 没有保存的已关闭标签数据`));
    } catch (t) {
      this.warn("无法恢复已关闭标签列表:", t), this.closedTabs = /* @__PURE__ */ new Set();
    }
  }
  /**
   * 获取当前库的存储键（基于repo ID）
   */
  getStorageKey() {
    try {
      const t = orca.state.repo;
      if (t && typeof t == "string")
        return this.log(`📦 使用repo作为存储键: ${t}`), `orca-first-panel-tabs-repo-${t}`;
    } catch (t) {
      this.warn("无法获取repo信息:", t);
    }
    try {
      const t = window.location.href, e = t.match(/\/repo\/([^\/]+)/);
      if (e && e[1]) {
        const a = e[1];
        return this.log(`📦 从URL提取repo标识: ${a}`), `orca-first-panel-tabs-repo-${a}`;
      }
      const n = this.hashString(t);
      return this.log(`📦 使用URL哈希作为备选: ${n}`), `orca-first-panel-tabs-url-${n}`;
    } catch (t) {
      this.warn("无法从URL提取repo信息:", t);
    }
    try {
      const t = document.title || "default", e = this.hashString(t);
      return this.log(`📦 使用页面标题作为最后备选: ${e}`), `orca-first-panel-tabs-title-${e}`;
    } catch (t) {
      this.warn("无法获取页面标题:", t);
    }
    return this.log("📦 使用默认存储键"), "orca-first-panel-tabs-default";
  }
  /**
   * 获取已关闭标签列表的存储键
   */
  getClosedTabsStorageKey() {
    return this.getStorageKey().replace("orca-first-panel-tabs-", "orca-closed-tabs-");
  }
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
    t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), this.isDragging = !0, this.dragStartX = t.clientX - this.position.x, this.dragStartY = t.clientY - this.position.y;
    const e = (a) => {
      this.isDragging && (a.preventDefault(), a.stopPropagation(), this.drag(a));
    }, n = (a) => {
      document.removeEventListener("mousemove", e), document.removeEventListener("mouseup", n), this.stopDrag();
    };
    document.addEventListener("mousemove", e), document.addEventListener("mouseup", n), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(t) {
    if (!this.isDragging || !this.tabContainer) return;
    t.preventDefault(), this.position.x = t.clientX - this.dragStartX, this.position.y = t.clientY - this.dragStartY;
    const e = this.tabContainer.getBoundingClientRect(), n = 5, a = window.innerWidth - e.width - 5, s = 5, i = window.innerHeight - e.height - 5;
    this.position.x = Math.max(n, Math.min(a, this.position.x)), this.position.y = Math.max(s, Math.min(i, this.position.y)), this.tabContainer.style.left = this.position.x + "px", this.tabContainer.style.top = this.position.y + "px", this.ensureClickableElements();
  }
  stopDrag() {
    this.isDragging = !1, this.tabContainer && (this.tabContainer.style.cursor = "default", this.tabContainer.style.userSelect = "", this.tabContainer.style.pointerEvents = "auto", this.tabContainer.style.touchAction = ""), document.body.style.cursor = "", document.body.style.userSelect = "", document.body.style.pointerEvents = "", document.body.style.touchAction = "", document.documentElement.style.cursor = "", document.documentElement.style.userSelect = "", document.documentElement.style.pointerEvents = "", this.resetAllElements(), this.ensureClickableElements(), this.log("🔄 拖拽结束，清理所有拖拽状态"), this.savePosition();
  }
  savePosition() {
    try {
      localStorage.setItem("orca-tabs-position", JSON.stringify(this.position));
    } catch {
      this.warn("无法保存标签位置");
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
  restorePosition() {
    try {
      const t = localStorage.getItem("orca-tabs-position");
      t && (this.position = JSON.parse(t), this.constrainPosition());
    } catch {
      this.warn("无法恢复标签位置");
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const a = window.innerWidth - 400, s = 0, i = window.innerHeight - 40;
    this.position.x = Math.max(0, Math.min(a, this.position.x)), this.position.y = Math.max(s, Math.min(i, this.position.y));
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
    var d, u, h;
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
    const s = this.firstPanelTabs.find((f) => f.blockId === a);
    if (s) {
      this.log(`📋 当前激活页面已存在: "${s.title}"`);
      const f = (d = this.tabContainer) == null ? void 0 : d.querySelectorAll(".orca-tab");
      f == null || f.forEach((m) => m.removeAttribute("data-focused"));
      const g = (u = this.tabContainer) == null ? void 0 : u.querySelector(`[data-tab-id="${a}"]`);
      g && (g.setAttribute("data-focused", "true"), this.log(`🎯 更新聚焦状态到已存在的标签: "${s.title}"`)), this.debouncedUpdateTabsUI();
      return;
    }
    let i = this.firstPanelTabs.length, o = !1;
    const c = (h = this.tabContainer) == null ? void 0 : h.querySelector('.orca-tab[data-focused="true"]');
    if (c) {
      const f = c.getAttribute("data-tab-id");
      if (f) {
        const g = this.firstPanelTabs.findIndex((m) => m.blockId === f);
        g !== -1 ? this.firstPanelTabs[g].isPinned ? (i = g + 1, o = !1, this.log("📌 聚焦标签是固定的，将在其后面插入新标签")) : (i = g, o = !0, this.log("🎯 聚焦标签不是固定的，将替换聚焦标签")) : this.log("🎯 聚焦的标签不在数组中，插入到末尾");
      } else
        this.log("🎯 聚焦的标签没有data-tab-id，插入到末尾");
    } else
      this.log("🎯 没有找到聚焦的标签，将替换最后一个非固定标签");
    this.log(`🎯 最终计算的insertIndex: ${i}, 是否替换聚焦标签: ${o}`);
    const l = await this.getTabInfo(a, t, this.firstPanelTabs.length);
    if (l) {
      if (this.log(`📋 检测到新的激活页面: "${l.title}"`), this.firstPanelTabs.length >= this.maxTabs)
        if (o && i < this.firstPanelTabs.length) {
          const f = this.firstPanelTabs[i];
          this.firstPanelTabs[i] = l, this.log(`🔄 替换聚焦标签: "${f.title}" -> "${l.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((g, m) => `${m}:${g.title}`));
        } else if (i < this.firstPanelTabs.length) {
          this.log("🎯 插入前数组:", this.firstPanelTabs.map((g, m) => `${m}:${g.title}`)), this.firstPanelTabs.splice(i + 1, 0, l), this.log(`➕ 在位置 ${i + 1} 插入新标签: ${l.title}`), this.log("🎯 插入后数组:", this.firstPanelTabs.map((g, m) => `${m}:${g.title}`));
          const f = this.findLastNonPinnedTabIndex();
          if (f !== -1) {
            const g = this.firstPanelTabs[f];
            this.firstPanelTabs.splice(f, 1), this.log(`🗑️ 删除末尾的非固定标签: "${g.title}" 来保持数量限制`), this.log("🎯 最终数组:", this.firstPanelTabs.map((m, y) => `${y}:${m.title}`));
          } else {
            const g = this.firstPanelTabs.findIndex((m) => m.blockId === l.blockId);
            if (g !== -1) {
              this.firstPanelTabs.splice(g, 1), this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${l.title}"`);
              return;
            }
          }
        } else {
          const f = this.findLastNonPinnedTabIndex();
          if (f !== -1) {
            const g = this.firstPanelTabs[f];
            this.firstPanelTabs[f] = l, this.log(`🔄 没有聚焦标签，替换最后一个非固定标签: "${g.title}" -> "${l.title}"`);
          } else {
            this.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${l.title}"`);
            return;
          }
        }
      else if (o && i < this.firstPanelTabs.length) {
        const f = this.firstPanelTabs[i];
        this.firstPanelTabs[i] = l, this.log(`🔄 替换聚焦标签: "${f.title}" -> "${l.title}"`), this.log("🎯 替换后数组:", this.firstPanelTabs.map((g, m) => `${m}:${g.title}`));
      } else
        this.firstPanelTabs.splice(i, 0, l), this.log(`➕ 在位置 ${i} 插入新标签: ${l.title}`), this.log("🎯 插入后数组:", this.firstPanelTabs.map((f, g) => `${g}:${f.title}`));
      this.closedTabs.has(a) && (this.closedTabs.delete(a), this.saveClosedTabs(), this.log(`🔄 标签 "${l.title}" 重新显示，从已关闭列表中移除`)), this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI();
    } else
      this.log("无法获取激活页面的标签信息");
  }
  observeChanges() {
    new MutationObserver(async (e) => {
      let n = !1, a = !1, s = !1, i = this.currentPanelIndex;
      e.forEach((o) => {
        if (o.type === "childList") {
          const c = o.target;
          if ((c.classList.contains("orca-panels-row") || c.closest(".orca-panels-row")) && (this.log("🔍 检测到面板行变化，检查新面板..."), a = !0), o.addedNodes.length > 0 && c.closest(".orca-panel")) {
            for (const d of o.addedNodes)
              if (d.nodeType === Node.ELEMENT_NODE) {
                const u = d;
                if (u.classList.contains("orca-block-editor") || u.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        o.type === "attributes" && o.attributeName === "class" && o.target.classList.contains("orca-panel") && (s = !0);
      }), s && (await this.updateCurrentPanelIndex(), i !== this.currentPanelIndex && (this.log(`🔄 面板切换: ${i} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), a && setTimeout(async () => {
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
      this.log("📋 面板数量未变化，跳过面板发现");
      return;
    }
    const e = [...this.panelIds];
    this.discoverPanels();
    const n = e.length !== this.panelIds.length || !e.every((s, i) => s === this.panelIds[i]);
    if (n) {
      this.log(`📋 面板列表发生变化: ${e.length} -> ${this.panelIds.length}`), this.log(`📋 旧面板列表: [${e.join(", ")}]`), this.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const s = e[0], i = this.panelIds[0];
      s && i && s !== i && (this.log(`🔄 第一个面板已变更: ${s} -> ${i}`), this.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), await this.handleFirstPanelChange(s, i), this.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`));
    }
    const a = document.querySelector(".orca-panel.active");
    if (a) {
      const s = a.getAttribute("data-panel-id");
      if (s && (s !== this.currentPanelId || n)) {
        const i = this.currentPanelIndex, o = this.panelIds.indexOf(s);
        o !== -1 && (this.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${s} (索引: ${i} -> ${o})`), this.currentPanelIndex = o, this.currentPanelId = s, this.debouncedUpdateTabsUI());
      }
    }
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(t, e) {
    this.log(`🔄 处理第一个面板变更: ${t} -> ${e}`), this.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), this.log(`🗑️ 清空旧面板 ${t} 的固化标签数据`), this.firstPanelTabs = [], this.log(`🔍 为新的第一个面板 ${e} 创建固化标签`), await this.scanFirstPanel(), this.saveFirstPanelTabs(), this.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), this.log(`✅ 第一个面板变更处理完成，新建了 ${this.firstPanelTabs.length} 个固化标签`), this.log("✅ 新的固化标签:", this.firstPanelTabs.map((n) => `${n.title}(${n.blockId})`));
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
      const t = this.getStorageKey(), e = this.getClosedTabsStorageKey();
      localStorage.removeItem(t), localStorage.removeItem(e), this.log(`🗑️ 已删除localStorage缓存: ${t}`), this.log(`🗑️ 已删除已关闭标签缓存: ${e}`);
    } catch (t) {
      this.warn("删除localStorage缓存失败:", t);
    }
    this.panelIds.length > 0 && (this.log("🔍 重新扫描第一个面板..."), await this.scanFirstPanel(), this.saveFirstPanelTabs()), await this.updateTabsUI(), this.log("✅ 插件缓存重置完成");
  }
  destroy() {
    this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
    const t = document.getElementById("orca-tabs-drag-styles");
    t && t.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.globalEventListener && (document.removeEventListener("click", this.globalEventListener), document.removeEventListener("contextmenu", this.globalEventListener), this.globalEventListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null;
  }
}
let x = null;
async function ve(r) {
  B = r, dt(orca.state.locale, { "zh-CN": ut }), x = new Ie(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => x == null ? void 0 : x.init(), 500);
  }) : setTimeout(() => x == null ? void 0 : x.init(), 500), orca.commands.registerCommand(
    `${B}.resetCache`,
    async () => {
      x && await x.resetCache();
    },
    "重置插件缓存"
  ), typeof window < "u" && window.DEBUG_ORCA_TABS !== !1 && (console.log(N("标签页插件已启动")), console.log(`${B} loaded.`));
}
async function ke() {
  x && (x.destroy(), x = null), orca.commands.unregisterCommand(`${B}.resetCache`);
}
export {
  ve as load,
  ke as unload
};
