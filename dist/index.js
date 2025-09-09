var G = Object.defineProperty;
var Z = (a, e, t) => e in a ? G(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var g = (a, e, t) => Z(a, typeof e != "symbol" ? e + "" : e, t);
let X = "en", _ = {};
function ee(a, e) {
  X = a, _ = e;
}
function $(a, e, t) {
  var r;
  return ((r = _[t ?? X]) == null ? void 0 : r[a]) ?? a;
}
const te = {
  标签页插件已启动: "标签页插件已启动",
  "your plugin code starts here": "您的插件代码从这里开始",
  今天: "今天",
  昨天: "昨天",
  明天: "明天"
}, j = 6048e5, ne = 864e5, N = Symbol.for("constructDateFrom");
function w(a, e) {
  return typeof a == "function" ? a(e) : a && typeof a == "object" && N in a ? a[N](e) : a instanceof Date ? new a.constructor(e) : new Date(e);
}
function x(a, e) {
  return w(e || a, a);
}
function z(a, e, t) {
  const n = x(a, t == null ? void 0 : t.in);
  return isNaN(e) ? w(a, NaN) : (e && n.setDate(n.getDate() + e), n);
}
let ae = {};
function O() {
  return ae;
}
function S(a, e) {
  var o, c, l, u;
  const t = O(), n = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((u = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : u.weekStartsOn) ?? 0, r = x(a, e == null ? void 0 : e.in), s = r.getDay(), i = (s < n ? 7 : 0) + s - n;
  return r.setDate(r.getDate() - i), r.setHours(0, 0, 0, 0), r;
}
function D(a, e) {
  return S(a, { ...e, weekStartsOn: 1 });
}
function K(a, e) {
  const t = x(a, e == null ? void 0 : e.in), n = t.getFullYear(), r = w(t, 0);
  r.setFullYear(n + 1, 0, 4), r.setHours(0, 0, 0, 0);
  const s = D(r), i = w(t, 0);
  i.setFullYear(n, 0, 4), i.setHours(0, 0, 0, 0);
  const o = D(i);
  return t.getTime() >= s.getTime() ? n + 1 : t.getTime() >= o.getTime() ? n : n - 1;
}
function Y(a) {
  const e = x(a), t = new Date(
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
function J(a, ...e) {
  const t = w.bind(
    null,
    e.find((n) => typeof n == "object")
  );
  return e.map(t);
}
function M(a, e) {
  const t = x(a, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function re(a, e, t) {
  const [n, r] = J(
    t == null ? void 0 : t.in,
    a,
    e
  ), s = M(n), i = M(r), o = +s - Y(s), c = +i - Y(i);
  return Math.round((o - c) / ne);
}
function se(a, e) {
  const t = K(a, e), n = w(a, 0);
  return n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), D(n);
}
function F(a) {
  return w(a, Date.now());
}
function W(a, e, t) {
  const [n, r] = J(
    t == null ? void 0 : t.in,
    a,
    e
  );
  return +M(n) == +M(r);
}
function ie(a) {
  return a instanceof Date || typeof a == "object" && Object.prototype.toString.call(a) === "[object Date]";
}
function oe(a) {
  return !(!ie(a) && typeof a != "number" || isNaN(+x(a)));
}
function ce(a, e) {
  const t = x(a, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const le = {
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
}, de = (a, e, t) => {
  let n;
  const r = le[a];
  return typeof r == "string" ? n = r : e === 1 ? n = r.one : n = r.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + n : n + " ago" : n;
};
function L(a) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : a.defaultWidth;
    return a.formats[t] || a.formats[a.defaultWidth];
  };
}
const ue = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, he = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, fe = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, ge = {
  date: L({
    formats: ue,
    defaultWidth: "full"
  }),
  time: L({
    formats: he,
    defaultWidth: "full"
  }),
  dateTime: L({
    formats: fe,
    defaultWidth: "full"
  })
}, me = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, be = (a, e, t, n) => me[a];
function k(a) {
  return (e, t) => {
    const n = t != null && t.context ? String(t.context) : "standalone";
    let r;
    if (n === "formatting" && a.formattingValues) {
      const i = a.defaultFormattingWidth || a.defaultWidth, o = t != null && t.width ? String(t.width) : i;
      r = a.formattingValues[o] || a.formattingValues[i];
    } else {
      const i = a.defaultWidth, o = t != null && t.width ? String(t.width) : a.defaultWidth;
      r = a.values[o] || a.values[i];
    }
    const s = a.argumentCallback ? a.argumentCallback(e) : e;
    return r[s];
  };
}
const pe = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, ye = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, we = {
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
}, xe = {
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
}, Te = {
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
}, Pe = {
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
}, ve = (a, e) => {
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
}, Ie = {
  ordinalNumber: ve,
  era: k({
    values: pe,
    defaultWidth: "wide"
  }),
  quarter: k({
    values: ye,
    defaultWidth: "wide",
    argumentCallback: (a) => a - 1
  }),
  month: k({
    values: we,
    defaultWidth: "wide"
  }),
  day: k({
    values: xe,
    defaultWidth: "wide"
  }),
  dayPeriod: k({
    values: Te,
    defaultWidth: "wide",
    formattingValues: Pe,
    defaultFormattingWidth: "wide"
  })
};
function C(a) {
  return (e, t = {}) => {
    const n = t.width, r = n && a.matchPatterns[n] || a.matchPatterns[a.defaultMatchWidth], s = e.match(r);
    if (!s)
      return null;
    const i = s[0], o = n && a.parsePatterns[n] || a.parsePatterns[a.defaultParseWidth], c = Array.isArray(o) ? Ce(o, (d) => d.test(i)) : (
      // [TODO] -- I challenge you to fix the type
      ke(o, (d) => d.test(i))
    );
    let l;
    l = a.valueCallback ? a.valueCallback(c) : c, l = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(l)
    ) : l;
    const u = e.slice(i.length);
    return { value: l, rest: u };
  };
}
function ke(a, e) {
  for (const t in a)
    if (Object.prototype.hasOwnProperty.call(a, t) && e(a[t]))
      return t;
}
function Ce(a, e) {
  for (let t = 0; t < a.length; t++)
    if (e(a[t]))
      return t;
}
function Se(a) {
  return (e, t = {}) => {
    const n = e.match(a.matchPattern);
    if (!n) return null;
    const r = n[0], s = e.match(a.parsePattern);
    if (!s) return null;
    let i = a.valueCallback ? a.valueCallback(s[0]) : s[0];
    i = t.valueCallback ? t.valueCallback(i) : i;
    const o = e.slice(r.length);
    return { value: i, rest: o };
  };
}
const $e = /^(\d+)(th|st|nd|rd)?/i, Ee = /\d+/i, De = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Me = {
  any: [/^b/i, /^(a|c)/i]
}, Oe = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, Le = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, Fe = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, We = {
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
}, Ne = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, Ye = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Ae = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, qe = {
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
}, Ue = {
  ordinalNumber: Se({
    matchPattern: $e,
    parsePattern: Ee,
    valueCallback: (a) => parseInt(a, 10)
  }),
  era: C({
    matchPatterns: De,
    defaultMatchWidth: "wide",
    parsePatterns: Me,
    defaultParseWidth: "any"
  }),
  quarter: C({
    matchPatterns: Oe,
    defaultMatchWidth: "wide",
    parsePatterns: Le,
    defaultParseWidth: "any",
    valueCallback: (a) => a + 1
  }),
  month: C({
    matchPatterns: Fe,
    defaultMatchWidth: "wide",
    parsePatterns: We,
    defaultParseWidth: "any"
  }),
  day: C({
    matchPatterns: Ne,
    defaultMatchWidth: "wide",
    parsePatterns: Ye,
    defaultParseWidth: "any"
  }),
  dayPeriod: C({
    matchPatterns: Ae,
    defaultMatchWidth: "any",
    parsePatterns: qe,
    defaultParseWidth: "any"
  })
}, Be = {
  code: "en-US",
  formatDistance: de,
  formatLong: ge,
  formatRelative: be,
  localize: Ie,
  match: Ue,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Re(a, e) {
  const t = x(a, e == null ? void 0 : e.in);
  return re(t, ce(t)) + 1;
}
function He(a, e) {
  const t = x(a, e == null ? void 0 : e.in), n = +D(t) - +se(t);
  return Math.round(n / j) + 1;
}
function Q(a, e) {
  var u, d, f, m;
  const t = x(a, e == null ? void 0 : e.in), n = t.getFullYear(), r = O(), s = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((d = (u = e == null ? void 0 : e.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? r.firstWeekContainsDate ?? ((m = (f = r.locale) == null ? void 0 : f.options) == null ? void 0 : m.firstWeekContainsDate) ?? 1, i = w((e == null ? void 0 : e.in) || a, 0);
  i.setFullYear(n + 1, 0, s), i.setHours(0, 0, 0, 0);
  const o = S(i, e), c = w((e == null ? void 0 : e.in) || a, 0);
  c.setFullYear(n, 0, s), c.setHours(0, 0, 0, 0);
  const l = S(c, e);
  return +t >= +o ? n + 1 : +t >= +l ? n : n - 1;
}
function Xe(a, e) {
  var o, c, l, u;
  const t = O(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((c = (o = e == null ? void 0 : e.locale) == null ? void 0 : o.options) == null ? void 0 : c.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((u = (l = t.locale) == null ? void 0 : l.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, r = Q(a, e), s = w((e == null ? void 0 : e.in) || a, 0);
  return s.setFullYear(r, 0, n), s.setHours(0, 0, 0, 0), S(s, e);
}
function _e(a, e) {
  const t = x(a, e == null ? void 0 : e.in), n = +S(t, e) - +Xe(t, e);
  return Math.round(n / j) + 1;
}
function h(a, e) {
  const t = a < 0 ? "-" : "", n = Math.abs(a).toString().padStart(e, "0");
  return t + n;
}
const T = {
  // Year
  y(a, e) {
    const t = a.getFullYear(), n = t > 0 ? t : 1 - t;
    return h(e === "yy" ? n % 100 : n, e.length);
  },
  // Month
  M(a, e) {
    const t = a.getMonth();
    return e === "M" ? String(t + 1) : h(t + 1, 2);
  },
  // Day of the month
  d(a, e) {
    return h(a.getDate(), e.length);
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
    return h(a.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(a, e) {
    return h(a.getHours(), e.length);
  },
  // Minute
  m(a, e) {
    return h(a.getMinutes(), e.length);
  },
  // Second
  s(a, e) {
    return h(a.getSeconds(), e.length);
  },
  // Fraction of second
  S(a, e) {
    const t = e.length, n = a.getMilliseconds(), r = Math.trunc(
      n * Math.pow(10, t - 3)
    );
    return h(r, e.length);
  }
}, I = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, A = {
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
      const n = a.getFullYear(), r = n > 0 ? n : 1 - n;
      return t.ordinalNumber(r, { unit: "year" });
    }
    return T.y(a, e);
  },
  // Local week-numbering year
  Y: function(a, e, t, n) {
    const r = Q(a, n), s = r > 0 ? r : 1 - r;
    if (e === "YY") {
      const i = s % 100;
      return h(i, 2);
    }
    return e === "Yo" ? t.ordinalNumber(s, { unit: "year" }) : h(s, e.length);
  },
  // ISO week-numbering year
  R: function(a, e) {
    const t = K(a);
    return h(t, e.length);
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
    return h(t, e.length);
  },
  // Quarter
  Q: function(a, e, t) {
    const n = Math.ceil((a.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(n);
      case "QQ":
        return h(n, 2);
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
        return h(n, 2);
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
        return T.M(a, e);
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
        return h(n + 1, 2);
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
    const r = _e(a, n);
    return e === "wo" ? t.ordinalNumber(r, { unit: "week" }) : h(r, e.length);
  },
  // ISO week of year
  I: function(a, e, t) {
    const n = He(a);
    return e === "Io" ? t.ordinalNumber(n, { unit: "week" }) : h(n, e.length);
  },
  // Day of the month
  d: function(a, e, t) {
    return e === "do" ? t.ordinalNumber(a.getDate(), { unit: "date" }) : T.d(a, e);
  },
  // Day of year
  D: function(a, e, t) {
    const n = Re(a);
    return e === "Do" ? t.ordinalNumber(n, { unit: "dayOfYear" }) : h(n, e.length);
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
    const r = a.getDay(), s = (r - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(s);
      case "ee":
        return h(s, 2);
      case "eo":
        return t.ordinalNumber(s, { unit: "day" });
      case "eee":
        return t.day(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "eeeee":
        return t.day(r, {
          width: "narrow",
          context: "formatting"
        });
      case "eeeeee":
        return t.day(r, {
          width: "short",
          context: "formatting"
        });
      case "eeee":
      default:
        return t.day(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function(a, e, t, n) {
    const r = a.getDay(), s = (r - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(s);
      case "cc":
        return h(s, e.length);
      case "co":
        return t.ordinalNumber(s, { unit: "day" });
      case "ccc":
        return t.day(r, {
          width: "abbreviated",
          context: "standalone"
        });
      case "ccccc":
        return t.day(r, {
          width: "narrow",
          context: "standalone"
        });
      case "cccccc":
        return t.day(r, {
          width: "short",
          context: "standalone"
        });
      case "cccc":
      default:
        return t.day(r, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function(a, e, t) {
    const n = a.getDay(), r = n === 0 ? 7 : n;
    switch (e) {
      case "i":
        return String(r);
      case "ii":
        return h(r, e.length);
      case "io":
        return t.ordinalNumber(r, { unit: "day" });
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
    const r = a.getHours() / 12 >= 1 ? "pm" : "am";
    switch (e) {
      case "a":
      case "aa":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return t.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return t.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function(a, e, t) {
    const n = a.getHours();
    let r;
    switch (n === 12 ? r = I.noon : n === 0 ? r = I.midnight : r = n / 12 >= 1 ? "pm" : "am", e) {
      case "b":
      case "bb":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return t.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return t.dayPeriod(r, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function(a, e, t) {
    const n = a.getHours();
    let r;
    switch (n >= 17 ? r = I.evening : n >= 12 ? r = I.afternoon : n >= 4 ? r = I.morning : r = I.night, e) {
      case "B":
      case "BB":
      case "BBB":
        return t.dayPeriod(r, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return t.dayPeriod(r, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return t.dayPeriod(r, {
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
    return T.h(a, e);
  },
  // Hour [0-23]
  H: function(a, e, t) {
    return e === "Ho" ? t.ordinalNumber(a.getHours(), { unit: "hour" }) : T.H(a, e);
  },
  // Hour [0-11]
  K: function(a, e, t) {
    const n = a.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(n, { unit: "hour" }) : h(n, e.length);
  },
  // Hour [1-24]
  k: function(a, e, t) {
    let n = a.getHours();
    return n === 0 && (n = 24), e === "ko" ? t.ordinalNumber(n, { unit: "hour" }) : h(n, e.length);
  },
  // Minute
  m: function(a, e, t) {
    return e === "mo" ? t.ordinalNumber(a.getMinutes(), { unit: "minute" }) : T.m(a, e);
  },
  // Second
  s: function(a, e, t) {
    return e === "so" ? t.ordinalNumber(a.getSeconds(), { unit: "second" }) : T.s(a, e);
  },
  // Fraction of second
  S: function(a, e) {
    return T.S(a, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(a, e, t) {
    const n = a.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (e) {
      case "X":
        return U(n);
      case "XXXX":
      case "XX":
        return v(n);
      case "XXXXX":
      case "XXX":
      default:
        return v(n, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function(a, e, t) {
    const n = a.getTimezoneOffset();
    switch (e) {
      case "x":
        return U(n);
      case "xxxx":
      case "xx":
        return v(n);
      case "xxxxx":
      case "xxx":
      default:
        return v(n, ":");
    }
  },
  // Timezone (GMT)
  O: function(a, e, t) {
    const n = a.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + q(n, ":");
      case "OOOO":
      default:
        return "GMT" + v(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(a, e, t) {
    const n = a.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + q(n, ":");
      case "zzzz":
      default:
        return "GMT" + v(n, ":");
    }
  },
  // Seconds timestamp
  t: function(a, e, t) {
    const n = Math.trunc(+a / 1e3);
    return h(n, e.length);
  },
  // Milliseconds timestamp
  T: function(a, e, t) {
    return h(+a, e.length);
  }
};
function q(a, e = "") {
  const t = a > 0 ? "-" : "+", n = Math.abs(a), r = Math.trunc(n / 60), s = n % 60;
  return s === 0 ? t + String(r) : t + String(r) + e + h(s, 2);
}
function U(a, e) {
  return a % 60 === 0 ? (a > 0 ? "-" : "+") + h(Math.abs(a) / 60, 2) : v(a, e);
}
function v(a, e = "") {
  const t = a > 0 ? "-" : "+", n = Math.abs(a), r = h(Math.trunc(n / 60), 2), s = h(n % 60, 2);
  return t + r + e + s;
}
const B = (a, e) => {
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
}, V = (a, e) => {
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
}, je = (a, e) => {
  const t = a.match(/(P+)(p+)?/) || [], n = t[1], r = t[2];
  if (!r)
    return B(a, e);
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
  return s.replace("{{date}}", B(n, e)).replace("{{time}}", V(r, e));
}, ze = {
  p: V,
  P: je
}, Ke = /^D+$/, Je = /^Y+$/, Qe = ["D", "DD", "YY", "YYYY"];
function Ve(a) {
  return Ke.test(a);
}
function Ge(a) {
  return Je.test(a);
}
function Ze(a, e, t) {
  const n = et(a, e, t);
  if (console.warn(n), Qe.includes(a)) throw new RangeError(n);
}
function et(a, e, t) {
  const n = a[0] === "Y" ? "years" : "days of the month";
  return `Use \`${a.toLowerCase()}\` instead of \`${a}\` (in \`${e}\`) for formatting ${n} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const tt = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, nt = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, at = /^'([^]*?)'?$/, rt = /''/g, st = /[a-zA-Z]/;
function R(a, e, t) {
  var u, d, f, m;
  const n = O(), r = n.locale ?? Be, s = n.firstWeekContainsDate ?? ((d = (u = n.locale) == null ? void 0 : u.options) == null ? void 0 : d.firstWeekContainsDate) ?? 1, i = n.weekStartsOn ?? ((m = (f = n.locale) == null ? void 0 : f.options) == null ? void 0 : m.weekStartsOn) ?? 0, o = x(a, t == null ? void 0 : t.in);
  if (!oe(o))
    throw new RangeError("Invalid time value");
  let c = e.match(nt).map((p) => {
    const b = p[0];
    if (b === "p" || b === "P") {
      const P = ze[b];
      return P(p, r.formatLong);
    }
    return p;
  }).join("").match(tt).map((p) => {
    if (p === "''")
      return { isToken: !1, value: "'" };
    const b = p[0];
    if (b === "'")
      return { isToken: !1, value: it(p) };
    if (A[b])
      return { isToken: !0, value: p };
    if (b.match(st))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + b + "`"
      );
    return { isToken: !1, value: p };
  });
  r.localize.preprocessor && (c = r.localize.preprocessor(o, c));
  const l = {
    firstWeekContainsDate: s,
    weekStartsOn: i,
    locale: r
  };
  return c.map((p) => {
    if (!p.isToken) return p.value;
    const b = p.value;
    (Ge(b) || Ve(b)) && Ze(b, e, String(a));
    const P = A[b[0]];
    return P(o, b, r.localize, l);
  }).join("");
}
function it(a) {
  const e = a.match(at);
  return e ? e[1].replace(rt, "'") : a;
}
function ot(a, e) {
  return W(
    w(a, a),
    F(a)
  );
}
function ct(a, e) {
  return W(
    a,
    z(F(a), 1),
    e
  );
}
function lt(a, e, t) {
  return z(a, -1, t);
}
function dt(a, e) {
  return W(
    w(a, a),
    lt(F(a))
  );
}
const H = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
}, ut = {
  JSON: 0,
  Text: 1
};
let E;
class ht {
  constructor() {
    g(this, "firstPanelTabs", []);
    // 只存储第一个面板的标签数据
    g(this, "currentPanelId", "");
    g(this, "panelIds", []);
    // 所有面板ID列表
    g(this, "currentPanelIndex", 0);
    // 当前面板索引
    g(this, "tabContainer", null);
    g(this, "cycleSwitcher", null);
    g(this, "isDragging", !1);
    g(this, "dragStartX", 0);
    g(this, "dragStartY", 0);
    g(this, "maxTabs", 10);
    // 默认值，会从设置中读取
    g(this, "position", { x: 50, y: 50 });
    g(this, "monitoringInterval", null);
    g(this, "clickListener", null);
    g(this, "keyListener", null);
    g(this, "updateDebounceTimer", null);
    // 防抖计时器
    g(this, "lastUpdateTime", 0);
    // 上次更新时间
    g(this, "isUpdating", !1);
    // 是否正在更新
    g(this, "isInitialized", !1);
    // 是否已完成初始化
    // 拖拽状态管理
    g(this, "draggingTab", null);
    // 当前正在拖拽的标签
    g(this, "dragEndListener", null);
    // 全局拖拽结束监听器
    g(this, "swapDebounceTimer", null);
    // 拖拽交换防抖计时器
    g(this, "lastSwapTarget", null);
    // 上次交换的目标标签ID，防止重复交换
    g(this, "dragOverTimer", null);
    // 拖拽悬停计时器
    g(this, "isDragOverActive", !1);
    // 是否正在拖拽悬停状态
    // 已关闭标签页跟踪
    g(this, "closedTabs", /* @__PURE__ */ new Set());
  }
  // 已关闭的标签页blockId集合
  async init() {
    try {
      this.maxTabs = orca.state.settings[H.CachedEditorNum] || 10;
    } catch {
      console.warn("无法读取最大标签数设置，使用默认值10");
    }
    this.restorePosition(), this.discoverPanels(), this.restoreFirstPanelTabs(), this.restoreClosedTabs(), this.firstPanelTabs.length > 0 ? console.log("检测到持久化数据，使用固化的标签页状态") : (console.log("首次使用，扫描第一个面板创建标签页"), await this.scanFirstPanel()), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.isInitialized = !0, console.log("✅ 插件初始化完成");
  }
  /**
   * 设置全局拖拽结束监听器
   */
  setupDragEndListener() {
    this.dragEndListener = () => {
      this.draggingTab = null, this.clearDragVisualFeedback(), console.log("🔄 全局拖拽结束，清除拖拽状态");
    }, document.addEventListener("dragend", this.dragEndListener);
  }
  /**
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    this.tabContainer && (this.tabContainer.querySelectorAll(".orca-tab").forEach((t) => {
      t.removeAttribute("data-dragging"), t.removeAttribute("data-drag-over"), t.classList.remove("dragging", "drag-over");
    }), this.tabContainer.removeAttribute("data-dragging"));
  }
  /**
   * 添加拖拽悬停效果（优化版）
   */
  addDragOverEffect(e) {
    e.getAttribute("data-drag-over") !== "true" && (e.setAttribute("data-drag-over", "true"), e.classList.add("drag-over"), this.dragOverTimer && clearTimeout(this.dragOverTimer));
  }
  /**
   * 移除拖拽悬停效果（优化版）
   */
  removeDragOverEffect(e) {
    e.getAttribute("data-drag-over") === "true" && (e.removeAttribute("data-drag-over"), e.classList.remove("drag-over"), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null));
  }
  /**
   * 防抖的标签交换函数（修复版）
   */
  debouncedSwapTab(e, t) {
    this.lastSwapTarget !== e.blockId && (this.swapTab(e, t), this.lastSwapTarget = e.blockId);
  }
  /**
   * 交换两个标签的位置（优化版）
   */
  swapTab(e, t) {
    if (this.currentPanelIndex !== 0) {
      console.log("只有第一个面板支持拖拽排序");
      return;
    }
    const n = this.firstPanelTabs.findIndex((s) => s.blockId === e.blockId), r = this.firstPanelTabs.findIndex((s) => s.blockId === t.blockId);
    if (n !== -1 && r !== -1 && n !== r) {
      const s = r < n;
      if (s) {
        const i = this.firstPanelTabs.splice(r, 1)[0], o = n > r ? n - 1 : n;
        this.firstPanelTabs.splice(o + 1, 0, i);
      } else {
        const i = this.firstPanelTabs.splice(r, 1)[0];
        this.firstPanelTabs.splice(n, 0, i);
      }
      this.firstPanelTabs.forEach((i, o) => {
        i.order = o;
      }), console.log(`🔄 标签交换: ${t.title} -> ${e.title} (${s ? "右移" : "左移"})`), this.sortTabsByPinStatus(), this.saveFirstPanelTabs(), this.draggingTab || this.debouncedUpdateTabsUI();
    }
  }
  /**
   * 发现所有面板
   */
  discoverPanels() {
    console.log("🔍 开始发现面板...");
    const e = document.querySelector("section#main");
    if (!e) {
      console.warn("❌ 未找到 section#main");
      return;
    }
    console.log("✅ 找到 section#main");
    const t = e.querySelector(".orca-panels-row");
    if (!t) {
      console.warn("❌ 未找到 .orca-panels-row");
      return;
    }
    console.log("✅ 找到 .orca-panels-row");
    const n = document.querySelectorAll(".orca-panel");
    console.log(`🔍 在整个文档中找到 ${n.length} 个 .orca-panel 元素`);
    const r = t.querySelectorAll(".orca-panel");
    if (this.panelIds = [], console.log(`🔍 在 .orca-panels-row 中找到 ${r.length} 个 .orca-panel 元素`), r.forEach((s, i) => {
      const o = s.getAttribute("data-panel-id"), c = s.classList.contains("active"), l = s.offsetParent !== null, u = s.getBoundingClientRect(), d = this.isMenuPanel(s);
      console.log(`面板 ${i + 1}: ID=${o}, 激活=${c}, 可见=${l}, 菜单=${d}, 位置=(${u.left}, ${u.top})`), o && !d ? this.panelIds.push(o) : d ? console.log(`🚫 跳过菜单面板: ${o}`) : console.warn(`❌ 面板 ${i + 1} 没有 data-panel-id 属性`);
    }), r.length < 2 && n.length >= 2 && (console.log("⚠️ 在 .orca-panels-row 中面板不足，尝试从整个文档中查找..."), n.forEach((s, i) => {
      const o = s.getAttribute("data-panel-id"), c = this.isMenuPanel(s);
      o && !this.panelIds.includes(o) && !c ? (this.panelIds.push(o), console.log(`➕ 从文档中找到额外面板: ID=${o}`)) : c && console.log(`🚫 跳过菜单面板: ${o}`);
    })), this.panelIds.length > 0) {
      const s = document.querySelector(".orca-panel.active");
      if (s) {
        const i = s.getAttribute("data-panel-id"), o = this.panelIds.indexOf(i || "");
        o !== -1 ? (this.currentPanelId = i || "", this.currentPanelIndex = o) : (this.currentPanelId = this.panelIds[0], this.currentPanelIndex = 0);
      } else
        this.currentPanelId = this.panelIds[0], this.currentPanelIndex = 0;
    }
    console.log(`🎯 最终发现 ${this.panelIds.length} 个面板，面板ID列表:`, this.panelIds), console.log(`🎯 当前面板: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`), this.panelIds.length === 1 ? console.log("ℹ️ 只有一个面板，不会显示切换按钮") : this.panelIds.length > 1 && console.log(`✅ 发现 ${this.panelIds.length} 个面板，将创建循环切换器`);
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
      console.log("第一个面板中没有找到激活的块编辑器");
      return;
    }
    const r = n.getAttribute("data-block-id");
    if (!r) {
      console.log("激活的块编辑器没有blockId");
      return;
    }
    const s = await this.getTabInfo(r, e, 0);
    s ? (console.log(`📋 扫描第一个面板，找到激活页面: "${s.title}"`), this.firstPanelTabs = [s], this.saveFirstPanelTabs(), await this.updateTabsUI()) : console.log("无法获取激活页面的标签信息");
  }
  /**
   * 合并第一个面板的标签页（现在只处理单个标签页）
   */
  mergeFirstPanelTabs(e) {
    e.length > 0 && (console.log(`📋 合并标签页: ${e.length} 个标签页`), this.sortTabsByPinStatus());
  }
  /**
   * 按固定状态排序标签（固定标签在前，非固定在后）
   */
  sortTabsByPinStatus() {
    this.firstPanelTabs.sort((e, t) => e.isPinned && !t.isPinned ? -1 : !e.isPinned && t.isPinned ? 1 : e.order - t.order);
  }
  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex() {
    for (let e = this.firstPanelTabs.length - 1; e >= 0; e--)
      if (!this.firstPanelTabs[e].isPinned)
        return e;
    return -1;
  }
  /**
   * 专门格式化日记日期（用于标签显示）
   */
  formatJournalDate(e) {
    try {
      let t = orca.state.settings[H.JournalDateFormat];
      return (!t || typeof t != "string") && (t = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), ot(e) ? $("今天") : dt(e) ? $("昨天") : ct(e) ? $("明天") : this.formatDateWithPattern(e, t);
    } catch (t) {
      return console.warn("日期格式化失败:", t), this.formatDateWithPattern(e, "yyyy-MM-dd");
    }
  }
  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(e) {
    if (!e || e.length === 0) return "";
    let t = "";
    for (const n of e)
      if (n.t === "t" && n.v)
        t += n.v;
      else if (n.t === "r")
        if (n.u)
          n.v ? t += n.v : t += n.u;
        else if (n.v && (typeof n.v == "number" || typeof n.v == "string"))
          try {
            const r = n.v.toString(), s = await this.getTabInfo(r, "", 0);
            s && s.title ? t += s.title : t += `[[块${r}]]`;
          } catch (r) {
            console.warn("处理r类型块引用失败:", r), t += "[[块引用]]";
          }
        else n.v && (t += n.v);
      else if (n.t === "br" && n.v)
        try {
          const r = n.v.toString(), s = await this.getTabInfo(r, "", 0);
          s && s.title ? t += s.title : t += `[[块${r}]]`;
        } catch (r) {
          console.warn("处理块引用失败:", r), t += "[[块引用]]";
        }
      else n.t && n.t.includes("math") && n.v ? t += `[数学: ${n.v}]` : (n.t && n.t.includes("code") && n.v || n.v && typeof n.v == "string") && (t += n.v);
    return t.trim();
  }
  /**
   * 使用BlockProperty API提取日期块信息
   */
  extractJournalInfo(e) {
    try {
      const t = this.findProperty(e, "_repr");
      if (!t || t.type !== ut.JSON || !t.value)
        return null;
      const n = typeof t.value == "string" ? JSON.parse(t.value) : t.value;
      return n.type === "journal" && n.date ? new Date(n.date) : null;
    } catch {
      return null;
    }
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
      return R(e, t);
    } catch {
      const r = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const s of r)
        try {
          return R(e, s);
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
      const r = await orca.invokeBackend("get-block", parseInt(e));
      if (!r) return null;
      let s = "", i = "", o = "", c = !1;
      try {
        if (r.aliases && r.aliases.length > 0)
          s = r.aliases[0];
        else if (r.content && r.content.length > 0)
          s = (await this.extractTextFromContent(r.content)).substring(0, 50);
        else if (r.text)
          s = r.text.substring(0, 50);
        else {
          const l = this.extractJournalInfo(r);
          l ? (c = !0, s = `📅 ${this.formatJournalDate(l)}`) : s = `块 ${e}`;
        }
      } catch (l) {
        console.warn("获取标题失败:", l), s = `块 ${e}`;
      }
      try {
        const l = this.findProperty(r, "_color"), u = this.findProperty(r, "_icon");
        l && l.type === 1 && (i = l.value), u && u.type === 1 && (o = u.value);
      } catch (l) {
        console.warn("获取属性失败:", l);
      }
      return {
        blockId: e,
        panelId: t,
        title: s || `块 ${e}`,
        color: i,
        icon: o,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: n
      };
    } catch (r) {
      return console.error("获取标签信息失败:", r), null;
    }
  }
  async createTabsUI() {
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), console.log(`🎨 创建UI: 面板数=${this.panelIds.length}, 位置=(${this.position.x}, ${this.position.y})`), console.log("📱 使用自动切换模式，不创建面板切换器"), this.tabContainer = document.createElement("div"), this.tabContainer.className = "orca-tabs-container", this.tabContainer.style.cssText = `
      position: fixed;
      top: ${this.position.y}px;
      left: ${this.position.x}px;
      z-index: 300;
      display: flex;
      gap: 2px;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      user-select: none;
      max-width: 80vw;
      flex-wrap: wrap;
      pointer-events: auto;
      -webkit-app-region: no-drag;
      app-region: no-drag;
    `, this.tabContainer.addEventListener("mousedown", (t) => {
      t.stopPropagation();
    }), this.tabContainer.addEventListener("click", (t) => {
      t.stopPropagation();
    });
    const e = document.createElement("div");
    e.className = "drag-handle", e.style.cssText = `
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
    `, e.innerHTML = "⋮⋮", e.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(e), document.body.appendChild(this.tabContainer), this.addDragStyles(), console.log(`✅ 标签容器已创建，位置: (${this.position.x}, ${this.position.y})`), await this.updateTabsUI();
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
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        will-change: transform, box-shadow, background;
      }

      /* 拖拽悬停效果 */
      .orca-tab:hover:not([data-dragging="true"]):not([data-drag-over="true"]) {
        transform: scale(1.02) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      }

      /* 拖拽时的光标样式 */
      .orca-tab[draggable="true"] {
        cursor: grab !important;
      }

      .orca-tab[draggable="true"]:active {
        cursor: grabbing !important;
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
    `, document.head.appendChild(e), console.log("✅ 拖拽样式已添加");
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
    const e = Date.now();
    if (e - this.lastUpdateTime < 50) {
      this.isUpdating = !1;
      return;
    }
    this.lastUpdateTime = e;
    const t = this.tabContainer.querySelector(".drag-handle");
    this.tabContainer.innerHTML = "", t && this.tabContainer.appendChild(t);
    const n = this.panelIds.length > 0 && document.querySelector(`.orca-panel[data-panel-id="${this.panelIds[0]}"]`), r = this.currentPanelIndex === 0;
    n && r ? (console.log("📋 显示第一个面板的固化标签页"), this.sortTabsByPinStatus(), this.firstPanelTabs.forEach((s, i) => {
      var c;
      const o = this.createTabElement(s);
      (c = this.tabContainer) == null || c.appendChild(o);
    })) : (console.log(`📋 显示面板 ${this.currentPanelIndex + 1} 的实时标签页`), await this.showCurrentPanelTabsSync()), this.isUpdating = !1;
  }
  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || !this.tabContainer) return;
    const e = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!e) {
      console.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }
    console.log(`🔍 扫描面板 ${this.currentPanelIndex + 1} 的实时标签页...`);
    const t = e.querySelectorAll(".orca-hideable"), n = [];
    let r = 0;
    for (const i of t) {
      const o = i.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId, r++);
      l && (n.push(l), console.log(`📝 块 ${c} 标题: "${l.title}"`));
    }
    console.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
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
    const e = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!e) {
      console.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }
    console.log(`🔍 扫描面板 ${this.currentPanelIndex + 1} 的实时标签页...`);
    const t = e.querySelectorAll(".orca-hideable"), n = [];
    let r = 0;
    for (const i of t) {
      const o = i.querySelector(".orca-block-editor");
      if (!o) continue;
      const c = o.getAttribute("data-block-id");
      if (!c) continue;
      const l = await this.getTabInfo(c, this.currentPanelId, r++);
      l && n.push(l);
    }
    console.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
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
   * 创建标签元素
   */
  createTabElement(e) {
    const t = document.createElement("div");
    t.className = "orca-tab", t.setAttribute("data-tab-id", e.blockId);
    let n = "rgba(200, 200, 200, 0.6)", r = "#333", s = "normal";
    e.color && (n = this.hexToRgba(e.color, 0.25), r = this.darkenColor(e.color, 0.3), s = "600"), t.style.cssText = `
      background: ${n};
      color: ${r};
      font-weight: ${s};
      padding: 6px 12px;
      border-radius: 6px;
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
    let i = e.title;
    e.icon && (i = `${e.icon} ${e.title}`), e.isPinned && (i = `📌 ${i}`), t.textContent = i;
    let o = e.title;
    return e.isPinned && (o += " (已固定)"), t.title = o, t.addEventListener("click", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.switchToTab(e);
    }), t.addEventListener("dblclick", (c) => {
      c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (c) => {
      c.button === 1 && (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation(), this.closeTab(e));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (c) => {
      var l;
      c.dataTransfer.effectAllowed = "move", (l = c.dataTransfer) == null || l.setData("text/plain", e.blockId), this.draggingTab = e, this.lastSwapTarget = null, t.setAttribute("data-dragging", "true"), t.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), console.log(`🔄 开始拖拽标签: ${e.title} (${e.blockId})`);
    }), t.addEventListener("dragend", (c) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDragVisualFeedback(), setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 50), console.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (c) => {
      this.draggingTab && this.draggingTab.blockId !== e.blockId && (c.preventDefault(), c.dataTransfer.dropEffect = "move", this.addDragOverEffect(t), this.debouncedSwapTab(e, this.draggingTab));
    }), t.addEventListener("dragenter", (c) => {
      this.draggingTab && this.draggingTab.blockId !== e.blockId && (c.preventDefault(), this.addDragOverEffect(t));
    }), t.addEventListener("dragleave", (c) => {
      const l = t.getBoundingClientRect(), u = c.clientX, d = c.clientY;
      (u < l.left || u > l.right || d < l.top || d > l.bottom) && this.removeDragOverEffect(t);
    }), t.addEventListener("drop", (c) => {
      var u;
      c.preventDefault();
      const l = (u = c.dataTransfer) == null ? void 0 : u.getData("text/plain");
      console.log(`🔄 拖拽放置: ${l} -> ${e.blockId}`);
    }), t.addEventListener("mouseenter", () => {
      t.style.transform = "scale(1.05)", t.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
    }), t.addEventListener("mouseleave", () => {
      t.style.transform = "scale(1)", t.style.boxShadow = "none";
    }), t;
  }
  hexToRgba(e, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (n) {
      const r = parseInt(n[1], 16), s = parseInt(n[2], 16), i = parseInt(n[3], 16);
      return `rgba(${r}, ${s}, ${i}, ${t})`;
    }
    return `rgba(200, 200, 200, ${t})`;
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const n = parseInt(t[1], 16), r = parseInt(t[2], 16), s = parseInt(t[3], 16);
      return (0.299 * n + 0.587 * r + 0.114 * s) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (n) {
      let r = parseInt(n[1], 16), s = parseInt(n[2], 16), i = parseInt(n[3], 16);
      r = Math.floor(r * (1 - t)), s = Math.floor(s * (1 - t)), i = Math.floor(i * (1 - t));
      const o = r.toString(16).padStart(2, "0"), c = s.toString(16).padStart(2, "0"), l = i.toString(16).padStart(2, "0");
      return `#${o}${c}${l}`;
    }
    return e;
  }
  async switchToTab(e) {
    try {
      const t = this.panelIds[this.currentPanelIndex];
      this.currentPanelIndex === 0 ? await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, t) : await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, t), console.log(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`);
    } catch (t) {
      console.error("切换标签失败:", t);
    }
  }
  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(e) {
    const t = this.panelIds[0], n = document.querySelector(`.orca-panel[data-panel-id="${t}"]`);
    if (!n) return !1;
    const r = n.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    return r ? r.getAttribute("data-block-id") === e.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(e) {
    const t = this.firstPanelTabs.findIndex((r) => r.blockId === e.blockId);
    if (t === -1) {
      console.log("未找到要关闭的标签页");
      return;
    }
    let n = -1;
    if (t === 0 ? n = 1 : t === this.firstPanelTabs.length - 1 ? n = t - 1 : n = t + 1, n >= 0 && n < this.firstPanelTabs.length) {
      const r = this.firstPanelTabs[n];
      console.log(`🔄 自动切换到相邻标签: "${r.title}" (位置: ${n})`);
      const s = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(r.blockId) }, s);
    } else
      console.log("没有可切换的相邻标签页");
  }
  /**
   * 切换标签固定状态
   */
  toggleTabPinStatus(e) {
    if (this.currentPanelIndex !== 0) return;
    const t = this.firstPanelTabs.findIndex((n) => n.blockId === e.blockId);
    if (t !== -1) {
      this.firstPanelTabs[t].isPinned = !this.firstPanelTabs[t].isPinned, this.sortTabsByPinStatus(), this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs();
      const n = this.firstPanelTabs[t].isPinned ? "固定" : "取消固定";
      console.log(`📌 标签 "${e.title}" 已${n}`);
    }
  }
  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab() {
    if (this.currentPanelIndex !== 0 || this.firstPanelTabs.length === 0) return null;
    const e = this.panelIds[0], t = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!t) return null;
    const n = t.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) return null;
    const r = n.getAttribute("data-block-id");
    return r && this.firstPanelTabs.find((s) => s.blockId === r) || null;
  }
  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(e) {
    if (this.currentPanelIndex !== 0) return null;
    const t = this.firstPanelTabs.findIndex((n) => n.blockId === e.blockId);
    return t === -1 || this.firstPanelTabs.length <= 1 ? null : t < this.firstPanelTabs.length - 1 ? this.firstPanelTabs[t + 1] : t > 0 ? this.firstPanelTabs[t - 1] : t === 0 && this.firstPanelTabs.length > 1 ? this.firstPanelTabs[1] : null;
  }
  /**
   * 关闭标签页
   */
  async closeTab(e) {
    if (this.currentPanelIndex !== 0) return;
    if (this.firstPanelTabs.length <= 1) {
      console.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    e.isPinned && console.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
    const t = this.firstPanelTabs.findIndex((n) => n.blockId === e.blockId);
    if (t !== -1) {
      const n = this.getCurrentActiveTab(), r = n && n.blockId === e.blockId, s = r ? this.getAdjacentTab(e) : null;
      this.closedTabs.add(e.blockId), this.firstPanelTabs.splice(t, 1), this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), console.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), r && s ? (console.log(`🔄 自动切换到相邻标签: "${s.title}"`), await this.switchToTab(s)) : r && !s && console.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
    }
  }
  /**
   * 关闭全部标签页（保留固定标签）
   */
  closeAllTabs() {
    if (this.currentPanelIndex !== 0) return;
    this.firstPanelTabs.filter((r) => !r.isPinned).forEach((r) => {
      this.closedTabs.add(r.blockId);
    });
    const t = this.firstPanelTabs.filter((r) => r.isPinned), n = this.firstPanelTabs.length - t.length;
    this.firstPanelTabs = t, this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), console.log(`🗑️ 已关闭 ${n} 个标签，保留了 ${t.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  closeOtherTabs(e) {
    if (this.currentPanelIndex !== 0) return;
    const t = this.firstPanelTabs.filter(
      (s) => s.blockId === e.blockId || s.isPinned
    );
    this.firstPanelTabs.filter(
      (s) => s.blockId !== e.blockId && !s.isPinned
    ).forEach((s) => {
      this.closedTabs.add(s.blockId);
    });
    const r = this.firstPanelTabs.length - t.length;
    this.firstPanelTabs = t, this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), console.log(`🗑️ 已关闭其他 ${r} 个标签，保留了当前标签和固定标签`);
  }
  /**
   * 重命名标签（使用Orca原生InputBox）
   */
  renameTab(e) {
    if (this.currentPanelIndex !== 0) return;
    const t = document.querySelector(".tab-context-menu");
    t && t.remove(), this.showOrcaRenameInput(e);
  }
  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(e) {
    const t = window.React, n = window.ReactDOM;
    if (!t || !n || !orca.components.InputBox) {
      console.warn("Orca组件不可用，回退到原生实现"), this.showRenameInput(e);
      return;
    }
    const r = document.createElement("div");
    r.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      pointer-events: none;
    `, document.body.appendChild(r);
    const s = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let i = { x: "50%", y: "50%" };
    if (s) {
      const d = s.getBoundingClientRect(), f = window.innerWidth, m = window.innerHeight;
      let p = d.left, b = d.top - 80;
      p + 300 > f && (p = f - 320), p < 20 && (p = 20), b < 20 && (b = d.bottom + 10), b + 100 > m && (b = m - 120), i = { x: `${p}px`, y: `${b}px` };
    }
    const o = orca.components.InputBox, c = t.createElement(o, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (d, f, m) => {
        d && d.trim() && d.trim() !== e.title && this.updateTabTitle(e, d.trim()), m();
      },
      onCancel: (d) => {
        d();
      }
    }, (d) => t.createElement("div", {
      style: {
        position: "absolute",
        left: i.x,
        top: i.y,
        pointerEvents: "auto"
      },
      onClick: d
    }, ""));
    n.render(c, r), setTimeout(() => {
      const d = r.querySelector("div");
      d && d.click();
    }, 0);
    const l = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(r), r.remove();
      }, 100);
    }, u = (d) => {
      d.key === "Escape" && (l(), document.removeEventListener("keydown", u));
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
    const r = document.createElement("input");
    r.type = "text", r.value = e.title, r.style.cssText = `
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
    }), s.appendChild(i), s.appendChild(o), n.appendChild(r), n.appendChild(s);
    const c = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (c) {
      const f = c.getBoundingClientRect();
      n.style.left = `${f.left}px`, n.style.top = `${f.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), r.focus(), r.select();
    const l = () => {
      const f = r.value.trim();
      f && f !== e.title && this.updateTabTitle(e, f), n.remove();
    }, u = () => {
      n.remove();
    };
    i.addEventListener("click", l), o.addEventListener("click", u), r.addEventListener("keydown", (f) => {
      f.key === "Enter" ? (f.preventDefault(), l()) : f.key === "Escape" && (f.preventDefault(), u());
    });
    const d = (f) => {
      n.contains(f.target) || (u(), document.removeEventListener("click", d));
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
      const n = this.firstPanelTabs.findIndex((r) => r.blockId === e.blockId);
      n !== -1 && (this.firstPanelTabs[n].title = t, this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI(), console.log(`📝 标签重命名: "${e.title}" -> "${t}"`));
    } catch (n) {
      console.error("重命名标签失败:", n);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(e, t) {
    const n = window.React, r = window.ReactDOM;
    if (!n || !r || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      console.warn("Orca组件不可用，回退到原生右键菜单"), e.addEventListener("contextmenu", (m) => {
        m.preventDefault(), m.stopPropagation(), m.stopImmediatePropagation(), this.showTabContextMenu(m, t);
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
    `, e.appendChild(s);
    const i = orca.components.ContextMenu, o = orca.components.Menu, c = orca.components.MenuText, l = orca.components.MenuSeparator, u = n.createElement(i, {
      menu: (m) => n.createElement(o, {}, [
        n.createElement(c, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          onClick: () => {
            m(), this.renameTab(t);
          }
        }),
        n.createElement(c, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          onClick: () => {
            m(), this.toggleTabPinStatus(t);
          }
        }),
        n.createElement(l, { key: "separator1" }),
        n.createElement(c, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            m(), this.closeTab(t);
          }
        }),
        n.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            m(), this.closeOtherTabs(t);
          }
        }),
        n.createElement(c, {
          key: "closeAll",
          title: "关闭全部标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            m(), this.closeAllTabs();
          }
        })
      ])
    }, (m, p) => n.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        background: "transparent"
      },
      onContextMenu: (P) => {
        P.preventDefault(), P.stopPropagation(), m(P);
      }
    }));
    r.render(u, s);
    const d = () => {
      r.unmountComponentAtNode(s), s.remove();
    }, f = new MutationObserver((m) => {
      m.forEach((p) => {
        p.removedNodes.forEach((b) => {
          b === e && (d(), f.disconnect());
        });
      });
    });
    f.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const r = document.createElement("div");
    r.className = "tab-context-menu", r.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
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
        action: () => this.renameTab(t)
      },
      {
        text: t.isPinned ? "取消固定" : "固定标签",
        action: () => this.toggleTabPinStatus(t)
      },
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
        o.action(), r.remove();
      })), r.appendChild(c);
    }), document.body.appendChild(r);
    const i = (o) => {
      r.contains(o.target) || (r.remove(), document.removeEventListener("click", i));
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
      const e = this.getStorageKey();
      localStorage.setItem(e, JSON.stringify(this.firstPanelTabs)), console.log(`💾 保存标签数据到: ${e}`);
    } catch (e) {
      console.warn("无法保存第一个面板标签数据:", e);
    }
  }
  /**
   * 保存已关闭标签列表到持久化存储
   */
  saveClosedTabs() {
    try {
      const e = this.getClosedTabsStorageKey();
      localStorage.setItem(e, JSON.stringify(Array.from(this.closedTabs))), console.log(`💾 保存已关闭标签列表到: ${e}`);
    } catch (e) {
      console.warn("无法保存已关闭标签列表:", e);
    }
  }
  /**
   * 从持久化存储恢复第一个面板的标签数据（按库分别恢复）
   */
  restoreFirstPanelTabs() {
    try {
      const e = this.getStorageKey(), t = localStorage.getItem(e);
      t ? (this.firstPanelTabs = JSON.parse(t), console.log(`📂 从 ${e} 恢复了 ${this.firstPanelTabs.length} 个标签页`)) : (this.firstPanelTabs = [], console.log(`📂 ${e} 没有保存的标签页数据`));
    } catch (e) {
      console.warn("无法恢复第一个面板标签数据:", e), this.firstPanelTabs = [];
    }
  }
  /**
   * 从持久化存储恢复已关闭标签列表
   */
  restoreClosedTabs() {
    try {
      const e = this.getClosedTabsStorageKey(), t = localStorage.getItem(e);
      t ? (this.closedTabs = new Set(JSON.parse(t)), console.log(`📂 从 ${e} 恢复了 ${this.closedTabs.size} 个已关闭标签`)) : (this.closedTabs = /* @__PURE__ */ new Set(), console.log(`📂 ${e} 没有保存的已关闭标签数据`));
    } catch (e) {
      console.warn("无法恢复已关闭标签列表:", e), this.closedTabs = /* @__PURE__ */ new Set();
    }
  }
  /**
   * 获取当前库的存储键（基于repo ID）
   */
  getStorageKey() {
    try {
      const e = orca.state.repo;
      if (e && typeof e == "string")
        return console.log(`📦 使用repo作为存储键: ${e}`), `orca-first-panel-tabs-repo-${e}`;
    } catch (e) {
      console.warn("无法获取repo信息:", e);
    }
    try {
      const e = window.location.href, t = e.match(/\/repo\/([^\/]+)/);
      if (t && t[1]) {
        const r = t[1];
        return console.log(`📦 从URL提取repo标识: ${r}`), `orca-first-panel-tabs-repo-${r}`;
      }
      const n = this.hashString(e);
      return console.log(`📦 使用URL哈希作为备选: ${n}`), `orca-first-panel-tabs-url-${n}`;
    } catch (e) {
      console.warn("无法从URL提取repo信息:", e);
    }
    try {
      const e = document.title || "default", t = this.hashString(e);
      return console.log(`📦 使用页面标题作为最后备选: ${t}`), `orca-first-panel-tabs-title-${t}`;
    } catch (e) {
      console.warn("无法获取页面标题:", e);
    }
    return console.log("📦 使用默认存储键"), "orca-first-panel-tabs-default";
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
  hashString(e) {
    let t = 0;
    for (let n = 0; n < e.length; n++) {
      const r = e.charCodeAt(n);
      t = (t << 5) - t + r, t = t & t;
    }
    return Math.abs(t).toString(36);
  }
  startDrag(e) {
    e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.isDragging = !0, this.dragStartX = e.clientX - this.position.x, this.dragStartY = e.clientY - this.position.y;
    const t = (r) => {
      r.preventDefault(), r.stopPropagation(), this.drag(r);
    }, n = (r) => {
      r.preventDefault(), r.stopPropagation(), document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n), this.stopDrag();
    };
    document.addEventListener("mousemove", t, { capture: !0 }), document.addEventListener("mouseup", n, { capture: !0 }), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.position.x = e.clientX - this.dragStartX, this.position.y = e.clientY - this.dragStartY;
    const t = this.tabContainer.getBoundingClientRect(), n = 10, r = window.innerWidth - t.width - 10, s = 10, i = window.innerHeight - t.height - 10;
    this.position.x = Math.max(n, Math.min(r, this.position.x)), this.position.y = Math.max(s, Math.min(i, this.position.y)), this.tabContainer.style.left = this.position.x + "px", this.tabContainer.style.top = this.position.y + "px";
  }
  stopDrag() {
    this.isDragging = !1, this.tabContainer && (this.tabContainer.style.cursor = "default"), this.savePosition();
  }
  savePosition() {
    try {
      localStorage.setItem("orca-tabs-position", JSON.stringify(this.position));
    } catch {
      console.warn("无法保存标签位置");
    }
  }
  restorePosition() {
    try {
      const e = localStorage.getItem("orca-tabs-position");
      e && (this.position = JSON.parse(e), this.constrainPosition());
    } catch {
      console.warn("无法恢复标签位置");
    }
  }
  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    const r = window.innerWidth - 400 - 10, s = 10, i = window.innerHeight - 40 - 10;
    this.position.x = Math.max(10, Math.min(r, this.position.x)), this.position.y = Math.max(s, Math.min(i, this.position.y));
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
    const e = this.panelIds[0], t = document.querySelector(`.orca-panel[data-panel-id="${e}"]`);
    if (!t) return;
    const n = t.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!n) {
      console.log("第一个面板中没有找到激活的块编辑器");
      return;
    }
    const r = n.getAttribute("data-block-id");
    if (!r) {
      console.log("激活的块编辑器没有blockId");
      return;
    }
    const s = this.firstPanelTabs.find((o) => o.blockId === r);
    if (s) {
      console.log(`📋 当前激活页面已存在: "${s.title}"`);
      return;
    }
    const i = await this.getTabInfo(r, e, this.firstPanelTabs.length);
    if (i) {
      if (console.log(`📋 检测到新的激活页面: "${i.title}"`), this.firstPanelTabs.length >= this.maxTabs) {
        const o = this.findLastNonPinnedTabIndex();
        if (o !== -1) {
          const c = this.firstPanelTabs[o];
          this.firstPanelTabs[o] = i, console.log(`🔄 标签页达到上限，替换最后一个标签: "${c.title}" -> "${i.title}"`);
        } else {
          console.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${i.title}"`);
          return;
        }
      } else
        this.firstPanelTabs.push(i), console.log(`➕ 添加新标签: ${i.title} (ID: ${r})`);
      this.closedTabs.has(r) && (this.closedTabs.delete(r), this.saveClosedTabs(), console.log(`🔄 标签 "${i.title}" 重新显示，从已关闭列表中移除`)), this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI();
    } else
      console.log("无法获取激活页面的标签信息");
  }
  observeChanges() {
    new MutationObserver(async (t) => {
      let n = !1, r = !1, s = !1, i = this.currentPanelIndex;
      t.forEach((o) => {
        if (o.type === "childList") {
          const c = o.target;
          if ((c.classList.contains("orca-panels-row") || c.closest(".orca-panels-row")) && (console.log("🔍 检测到面板行变化，检查新面板..."), r = !0), o.addedNodes.length > 0 && c.closest(".orca-panel")) {
            for (const u of o.addedNodes)
              if (u.nodeType === Node.ELEMENT_NODE) {
                const d = u;
                if (d.classList.contains("orca-block-editor") || d.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        o.type === "attributes" && o.attributeName === "class" && o.target.classList.contains("orca-panel") && (s = !0);
      }), s && (await this.updateCurrentPanelIndex(), i !== this.currentPanelIndex && (console.log(`🔄 面板切换: ${i} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), r && setTimeout(async () => {
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
      console.log(`🎉 发现新面板！从 ${e} 个增加到 ${this.panelIds.length} 个`), await this.createTabsUI();
    else if (this.panelIds.length < e) {
      console.log(`📉 面板数量减少！从 ${e} 个减少到 ${this.panelIds.length} 个`), console.log(`📋 旧面板列表: [${t.join(", ")}]`), console.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const n = t[0], r = this.panelIds[0];
      n && r && n !== r && (console.log(`🔄 第一个面板已变更: ${n} -> ${r}`), await this.handleFirstPanelChange(n, r)), this.currentPanelId && !this.panelIds.includes(this.currentPanelId) && (console.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0]), await this.createTabsUI();
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
    }, 500), this.clickListener = async (e) => {
      setTimeout(() => {
        this.debouncedCheckPanelStatus();
      }, 100);
    }, document.addEventListener("click", this.clickListener), this.keyListener = async (e) => {
      const t = (e.ctrlKey || e.metaKey) && e.key === "w", n = e.key === "Escape";
      t || n ? (console.log(`⌨️ 检测到可能关闭面板的快捷键: ${e.key} (Ctrl/Cmd: ${e.ctrlKey || e.metaKey})`), setTimeout(() => {
        this.debouncedCheckPanelStatus();
      }, 50)) : setTimeout(() => {
        this.debouncedCheckPanelStatus();
      }, 200);
    }, document.addEventListener("keydown", this.keyListener);
  }
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
    const e = [...this.panelIds];
    this.discoverPanels();
    const t = e.length !== this.panelIds.length || !e.every((r, s) => r === this.panelIds[s]);
    if (t) {
      console.log(`📋 面板列表发生变化: ${e.length} -> ${this.panelIds.length}`), console.log(`📋 旧面板列表: [${e.join(", ")}]`), console.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const r = e[0], s = this.panelIds[0];
      r && s && r !== s && (console.log(`🔄 第一个面板已变更: ${r} -> ${s}`), console.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), await this.handleFirstPanelChange(r, s), console.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`));
    }
    const n = document.querySelector(".orca-panel.active");
    if (n) {
      const r = n.getAttribute("data-panel-id");
      if (r && (r !== this.currentPanelId || t)) {
        const s = this.currentPanelIndex, i = this.panelIds.indexOf(r);
        i !== -1 && (console.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${r} (索引: ${s} -> ${i})`), this.currentPanelIndex = i, this.currentPanelId = r, this.debouncedUpdateTabsUI());
      }
    }
  }
  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(e, t) {
    console.log(`🔄 处理第一个面板变更: ${e} -> ${t}`), console.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), console.log(`🗑️ 清空旧面板 ${e} 的固化标签数据`), this.firstPanelTabs = [], console.log(`🔍 为新的第一个面板 ${t} 创建固化标签`), await this.scanFirstPanel(), this.saveFirstPanelTabs(), console.log("🎨 立即更新UI显示新的固化标签"), await this.updateTabsUI(), console.log(`✅ 第一个面板变更处理完成，新建了 ${this.firstPanelTabs.length} 个固化标签`), console.log("✅ 新的固化标签:", this.firstPanelTabs.map((n) => `${n.title}(${n.blockId})`));
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
    console.log("🔄 开始重置插件缓存..."), this.firstPanelTabs = [], this.closedTabs.clear();
    try {
      const e = this.getStorageKey(), t = this.getClosedTabsStorageKey();
      localStorage.removeItem(e), localStorage.removeItem(t), console.log(`🗑️ 已删除localStorage缓存: ${e}`), console.log(`🗑️ 已删除已关闭标签缓存: ${t}`);
    } catch (e) {
      console.warn("删除localStorage缓存失败:", e);
    }
    this.panelIds.length > 0 && (console.log("🔍 重新扫描第一个面板..."), await this.scanFirstPanel(), this.saveFirstPanelTabs()), await this.updateTabsUI(), console.log("✅ 插件缓存重置完成");
  }
  destroy() {
    this.tabContainer && (this.tabContainer.remove(), this.tabContainer = null), this.cycleSwitcher && (this.cycleSwitcher.remove(), this.cycleSwitcher = null);
    const e = document.getElementById("orca-tabs-drag-styles");
    e && e.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.clickListener && (document.removeEventListener("click", this.clickListener), this.clickListener = null), this.keyListener && (document.removeEventListener("keydown", this.keyListener), this.keyListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.draggingTab = null;
  }
}
let y = null;
async function gt(a) {
  E = a, ee(orca.state.locale, { "zh-CN": te }), y = new ht(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => y == null ? void 0 : y.init(), 500);
  }) : setTimeout(() => y == null ? void 0 : y.init(), 500), orca.commands.registerCommand(
    `${E}.resetCache`,
    async () => {
      y && (await y.resetCache(), orca.notify("success", "插件缓存已重置", {
        title: "Orca Tabs Plugin"
      }));
    },
    "重置插件缓存"
  ), console.log($("标签页插件已启动")), console.log(`${E} loaded.`);
}
async function mt() {
  y && (y.destroy(), y = null), orca.commands.unregisterCommand(`${E}.resetCache`);
}
export {
  gt as load,
  mt as unload
};
