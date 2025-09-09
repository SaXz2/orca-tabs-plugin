var ce = Object.defineProperty;
var le = (r, e, t) => e in r ? ce(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var m = (r, e, t) => le(r, typeof e != "symbol" ? e + "" : e, t);
let Z = "en", ee = {};
function de(r, e) {
  Z = r, ee = e;
}
function F(r, e, t) {
  var a;
  return ((a = ee[t ?? Z]) == null ? void 0 : a[r]) ?? r;
}
const ue = {
  标签页插件已启动: "标签页插件已启动",
  "your plugin code starts here": "您的插件代码从这里开始",
  今天: "今天",
  昨天: "昨天",
  明天: "明天"
}, te = 6048e5, he = 864e5, z = Symbol.for("constructDateFrom");
function P(r, e) {
  return typeof r == "function" ? r(e) : r && typeof r == "object" && z in r ? r[z](e) : r instanceof Date ? new r.constructor(e) : new Date(e);
}
function v(r, e) {
  return P(e || r, r);
}
function ne(r, e, t) {
  const n = v(r, t == null ? void 0 : t.in);
  return isNaN(e) ? P(r, NaN) : (e && n.setDate(n.getDate() + e), n);
}
let fe = {};
function q() {
  return fe;
}
function O(r, e) {
  var i, c, d, l;
  const t = q(), n = (e == null ? void 0 : e.weekStartsOn) ?? ((c = (i = e == null ? void 0 : e.locale) == null ? void 0 : i.options) == null ? void 0 : c.weekStartsOn) ?? t.weekStartsOn ?? ((l = (d = t.locale) == null ? void 0 : d.options) == null ? void 0 : l.weekStartsOn) ?? 0, a = v(r, e == null ? void 0 : e.in), o = a.getDay(), s = (o < n ? 7 : 0) + o - n;
  return a.setDate(a.getDate() - s), a.setHours(0, 0, 0, 0), a;
}
function A(r, e) {
  return O(r, { ...e, weekStartsOn: 1 });
}
function ae(r, e) {
  const t = v(r, e == null ? void 0 : e.in), n = t.getFullYear(), a = P(t, 0);
  a.setFullYear(n + 1, 0, 4), a.setHours(0, 0, 0, 0);
  const o = A(a), s = P(t, 0);
  s.setFullYear(n, 0, 4), s.setHours(0, 0, 0, 0);
  const i = A(s);
  return t.getTime() >= o.getTime() ? n + 1 : t.getTime() >= i.getTime() ? n : n - 1;
}
function X(r) {
  const e = v(r), t = new Date(
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
function re(r, ...e) {
  const t = P.bind(
    null,
    e.find((n) => typeof n == "object")
  );
  return e.map(t);
}
function N(r, e) {
  const t = v(r, e == null ? void 0 : e.in);
  return t.setHours(0, 0, 0, 0), t;
}
function ge(r, e, t) {
  const [n, a] = re(
    t == null ? void 0 : t.in,
    r,
    e
  ), o = N(n), s = N(a), i = +o - X(o), c = +s - X(s);
  return Math.round((i - c) / he);
}
function me(r, e) {
  const t = ae(r, e), n = P(r, 0);
  return n.setFullYear(t, 0, 4), n.setHours(0, 0, 0, 0), A(n);
}
function _(r) {
  return P(r, Date.now());
}
function H(r, e, t) {
  const [n, a] = re(
    t == null ? void 0 : t.in,
    r,
    e
  );
  return +N(n) == +N(a);
}
function be(r) {
  return r instanceof Date || typeof r == "object" && Object.prototype.toString.call(r) === "[object Date]";
}
function pe(r) {
  return !(!be(r) && typeof r != "number" || isNaN(+v(r)));
}
function ye(r, e) {
  const t = v(r, e == null ? void 0 : e.in);
  return t.setFullYear(t.getFullYear(), 0, 1), t.setHours(0, 0, 0, 0), t;
}
const we = {
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
}, xe = (r, e, t) => {
  let n;
  const a = we[r];
  return typeof a == "string" ? n = a : e === 1 ? n = a.one : n = a.other.replace("{{count}}", e.toString()), t != null && t.addSuffix ? t.comparison && t.comparison > 0 ? "in " + n : n + " ago" : n;
};
function R(r) {
  return (e = {}) => {
    const t = e.width ? String(e.width) : r.defaultWidth;
    return r.formats[t] || r.formats[r.defaultWidth];
  };
}
const Te = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
}, Pe = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
}, ve = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
}, Ie = {
  date: R({
    formats: Te,
    defaultWidth: "full"
  }),
  time: R({
    formats: Pe,
    defaultWidth: "full"
  }),
  dateTime: R({
    formats: ve,
    defaultWidth: "full"
  })
}, ke = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
}, Ce = (r, e, t, n) => ke[r];
function D(r) {
  return (e, t) => {
    const n = t != null && t.context ? String(t.context) : "standalone";
    let a;
    if (n === "formatting" && r.formattingValues) {
      const s = r.defaultFormattingWidth || r.defaultWidth, i = t != null && t.width ? String(t.width) : s;
      a = r.formattingValues[i] || r.formattingValues[s];
    } else {
      const s = r.defaultWidth, i = t != null && t.width ? String(t.width) : r.defaultWidth;
      a = r.values[i] || r.values[s];
    }
    const o = r.argumentCallback ? r.argumentCallback(e) : e;
    return a[o];
  };
}
const Me = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
}, Se = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
}, $e = {
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
}, Ee = {
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
}, De = {
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
}, Le = {
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
}, Oe = (r, e) => {
  const t = Number(r), n = t % 100;
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
}, Fe = {
  ordinalNumber: Oe,
  era: D({
    values: Me,
    defaultWidth: "wide"
  }),
  quarter: D({
    values: Se,
    defaultWidth: "wide",
    argumentCallback: (r) => r - 1
  }),
  month: D({
    values: $e,
    defaultWidth: "wide"
  }),
  day: D({
    values: Ee,
    defaultWidth: "wide"
  }),
  dayPeriod: D({
    values: De,
    defaultWidth: "wide",
    formattingValues: Le,
    defaultFormattingWidth: "wide"
  })
};
function L(r) {
  return (e, t = {}) => {
    const n = t.width, a = n && r.matchPatterns[n] || r.matchPatterns[r.defaultMatchWidth], o = e.match(a);
    if (!o)
      return null;
    const s = o[0], i = n && r.parsePatterns[n] || r.parsePatterns[r.defaultParseWidth], c = Array.isArray(i) ? Ae(i, (u) => u.test(s)) : (
      // [TODO] -- I challenge you to fix the type
      We(i, (u) => u.test(s))
    );
    let d;
    d = r.valueCallback ? r.valueCallback(c) : c, d = t.valueCallback ? (
      // [TODO] -- I challenge you to fix the type
      t.valueCallback(d)
    ) : d;
    const l = e.slice(s.length);
    return { value: d, rest: l };
  };
}
function We(r, e) {
  for (const t in r)
    if (Object.prototype.hasOwnProperty.call(r, t) && e(r[t]))
      return t;
}
function Ae(r, e) {
  for (let t = 0; t < r.length; t++)
    if (e(r[t]))
      return t;
}
function Ne(r) {
  return (e, t = {}) => {
    const n = e.match(r.matchPattern);
    if (!n) return null;
    const a = n[0], o = e.match(r.parsePattern);
    if (!o) return null;
    let s = r.valueCallback ? r.valueCallback(o[0]) : o[0];
    s = t.valueCallback ? t.valueCallback(s) : s;
    const i = e.slice(a.length);
    return { value: s, rest: i };
  };
}
const qe = /^(\d+)(th|st|nd|rd)?/i, Ye = /\d+/i, Be = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
}, Ue = {
  any: [/^b/i, /^(a|c)/i]
}, Re = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
}, _e = {
  any: [/1/i, /2/i, /3/i, /4/i]
}, He = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
}, ze = {
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
}, Xe = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
}, je = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
}, Ke = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
}, Je = {
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
}, Ge = {
  ordinalNumber: Ne({
    matchPattern: qe,
    parsePattern: Ye,
    valueCallback: (r) => parseInt(r, 10)
  }),
  era: L({
    matchPatterns: Be,
    defaultMatchWidth: "wide",
    parsePatterns: Ue,
    defaultParseWidth: "any"
  }),
  quarter: L({
    matchPatterns: Re,
    defaultMatchWidth: "wide",
    parsePatterns: _e,
    defaultParseWidth: "any",
    valueCallback: (r) => r + 1
  }),
  month: L({
    matchPatterns: He,
    defaultMatchWidth: "wide",
    parsePatterns: ze,
    defaultParseWidth: "any"
  }),
  day: L({
    matchPatterns: Xe,
    defaultMatchWidth: "wide",
    parsePatterns: je,
    defaultParseWidth: "any"
  }),
  dayPeriod: L({
    matchPatterns: Ke,
    defaultMatchWidth: "any",
    parsePatterns: Je,
    defaultParseWidth: "any"
  })
}, Qe = {
  code: "en-US",
  formatDistance: xe,
  formatLong: Ie,
  formatRelative: Ce,
  localize: Fe,
  match: Ge,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function Ve(r, e) {
  const t = v(r, e == null ? void 0 : e.in);
  return ge(t, ye(t)) + 1;
}
function Ze(r, e) {
  const t = v(r, e == null ? void 0 : e.in), n = +A(t) - +me(t);
  return Math.round(n / te) + 1;
}
function oe(r, e) {
  var l, u, h, f;
  const t = v(r, e == null ? void 0 : e.in), n = t.getFullYear(), a = q(), o = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((u = (l = e == null ? void 0 : e.locale) == null ? void 0 : l.options) == null ? void 0 : u.firstWeekContainsDate) ?? a.firstWeekContainsDate ?? ((f = (h = a.locale) == null ? void 0 : h.options) == null ? void 0 : f.firstWeekContainsDate) ?? 1, s = P((e == null ? void 0 : e.in) || r, 0);
  s.setFullYear(n + 1, 0, o), s.setHours(0, 0, 0, 0);
  const i = O(s, e), c = P((e == null ? void 0 : e.in) || r, 0);
  c.setFullYear(n, 0, o), c.setHours(0, 0, 0, 0);
  const d = O(c, e);
  return +t >= +i ? n + 1 : +t >= +d ? n : n - 1;
}
function et(r, e) {
  var i, c, d, l;
  const t = q(), n = (e == null ? void 0 : e.firstWeekContainsDate) ?? ((c = (i = e == null ? void 0 : e.locale) == null ? void 0 : i.options) == null ? void 0 : c.firstWeekContainsDate) ?? t.firstWeekContainsDate ?? ((l = (d = t.locale) == null ? void 0 : d.options) == null ? void 0 : l.firstWeekContainsDate) ?? 1, a = oe(r, e), o = P((e == null ? void 0 : e.in) || r, 0);
  return o.setFullYear(a, 0, n), o.setHours(0, 0, 0, 0), O(o, e);
}
function tt(r, e) {
  const t = v(r, e == null ? void 0 : e.in), n = +O(t, e) - +et(t, e);
  return Math.round(n / te) + 1;
}
function b(r, e) {
  const t = r < 0 ? "-" : "", n = Math.abs(r).toString().padStart(e, "0");
  return t + n;
}
const I = {
  // Year
  y(r, e) {
    const t = r.getFullYear(), n = t > 0 ? t : 1 - t;
    return b(e === "yy" ? n % 100 : n, e.length);
  },
  // Month
  M(r, e) {
    const t = r.getMonth();
    return e === "M" ? String(t + 1) : b(t + 1, 2);
  },
  // Day of the month
  d(r, e) {
    return b(r.getDate(), e.length);
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
    return b(r.getHours() % 12 || 12, e.length);
  },
  // Hour [0-23]
  H(r, e) {
    return b(r.getHours(), e.length);
  },
  // Minute
  m(r, e) {
    return b(r.getMinutes(), e.length);
  },
  // Second
  s(r, e) {
    return b(r.getSeconds(), e.length);
  },
  // Fraction of second
  S(r, e) {
    const t = e.length, n = r.getMilliseconds(), a = Math.trunc(
      n * Math.pow(10, t - 3)
    );
    return b(a, e.length);
  }
}, M = {
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
}, j = {
  // Era
  G: function(r, e, t) {
    const n = r.getFullYear() > 0 ? 1 : 0;
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
  y: function(r, e, t) {
    if (e === "yo") {
      const n = r.getFullYear(), a = n > 0 ? n : 1 - n;
      return t.ordinalNumber(a, { unit: "year" });
    }
    return I.y(r, e);
  },
  // Local week-numbering year
  Y: function(r, e, t, n) {
    const a = oe(r, n), o = a > 0 ? a : 1 - a;
    if (e === "YY") {
      const s = o % 100;
      return b(s, 2);
    }
    return e === "Yo" ? t.ordinalNumber(o, { unit: "year" }) : b(o, e.length);
  },
  // ISO week-numbering year
  R: function(r, e) {
    const t = ae(r);
    return b(t, e.length);
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
    return b(t, e.length);
  },
  // Quarter
  Q: function(r, e, t) {
    const n = Math.ceil((r.getMonth() + 1) / 3);
    switch (e) {
      case "Q":
        return String(n);
      case "QQ":
        return b(n, 2);
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
  q: function(r, e, t) {
    const n = Math.ceil((r.getMonth() + 1) / 3);
    switch (e) {
      case "q":
        return String(n);
      case "qq":
        return b(n, 2);
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
  M: function(r, e, t) {
    const n = r.getMonth();
    switch (e) {
      case "M":
      case "MM":
        return I.M(r, e);
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
  L: function(r, e, t) {
    const n = r.getMonth();
    switch (e) {
      case "L":
        return String(n + 1);
      case "LL":
        return b(n + 1, 2);
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
  w: function(r, e, t, n) {
    const a = tt(r, n);
    return e === "wo" ? t.ordinalNumber(a, { unit: "week" }) : b(a, e.length);
  },
  // ISO week of year
  I: function(r, e, t) {
    const n = Ze(r);
    return e === "Io" ? t.ordinalNumber(n, { unit: "week" }) : b(n, e.length);
  },
  // Day of the month
  d: function(r, e, t) {
    return e === "do" ? t.ordinalNumber(r.getDate(), { unit: "date" }) : I.d(r, e);
  },
  // Day of year
  D: function(r, e, t) {
    const n = Ve(r);
    return e === "Do" ? t.ordinalNumber(n, { unit: "dayOfYear" }) : b(n, e.length);
  },
  // Day of week
  E: function(r, e, t) {
    const n = r.getDay();
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
  e: function(r, e, t, n) {
    const a = r.getDay(), o = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "e":
        return String(o);
      case "ee":
        return b(o, 2);
      case "eo":
        return t.ordinalNumber(o, { unit: "day" });
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
  c: function(r, e, t, n) {
    const a = r.getDay(), o = (a - n.weekStartsOn + 8) % 7 || 7;
    switch (e) {
      case "c":
        return String(o);
      case "cc":
        return b(o, e.length);
      case "co":
        return t.ordinalNumber(o, { unit: "day" });
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
    const n = r.getDay(), a = n === 0 ? 7 : n;
    switch (e) {
      case "i":
        return String(a);
      case "ii":
        return b(a, e.length);
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
    const n = r.getHours();
    let a;
    switch (n === 12 ? a = M.noon : n === 0 ? a = M.midnight : a = n / 12 >= 1 ? "pm" : "am", e) {
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
    const n = r.getHours();
    let a;
    switch (n >= 17 ? a = M.evening : n >= 12 ? a = M.afternoon : n >= 4 ? a = M.morning : a = M.night, e) {
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
      let n = r.getHours() % 12;
      return n === 0 && (n = 12), t.ordinalNumber(n, { unit: "hour" });
    }
    return I.h(r, e);
  },
  // Hour [0-23]
  H: function(r, e, t) {
    return e === "Ho" ? t.ordinalNumber(r.getHours(), { unit: "hour" }) : I.H(r, e);
  },
  // Hour [0-11]
  K: function(r, e, t) {
    const n = r.getHours() % 12;
    return e === "Ko" ? t.ordinalNumber(n, { unit: "hour" }) : b(n, e.length);
  },
  // Hour [1-24]
  k: function(r, e, t) {
    let n = r.getHours();
    return n === 0 && (n = 24), e === "ko" ? t.ordinalNumber(n, { unit: "hour" }) : b(n, e.length);
  },
  // Minute
  m: function(r, e, t) {
    return e === "mo" ? t.ordinalNumber(r.getMinutes(), { unit: "minute" }) : I.m(r, e);
  },
  // Second
  s: function(r, e, t) {
    return e === "so" ? t.ordinalNumber(r.getSeconds(), { unit: "second" }) : I.s(r, e);
  },
  // Fraction of second
  S: function(r, e) {
    return I.S(r, e);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function(r, e, t) {
    const n = r.getTimezoneOffset();
    if (n === 0)
      return "Z";
    switch (e) {
      case "X":
        return J(n);
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
  x: function(r, e, t) {
    const n = r.getTimezoneOffset();
    switch (e) {
      case "x":
        return J(n);
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
  O: function(r, e, t) {
    const n = r.getTimezoneOffset();
    switch (e) {
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + K(n, ":");
      case "OOOO":
      default:
        return "GMT" + C(n, ":");
    }
  },
  // Timezone (specific non-location)
  z: function(r, e, t) {
    const n = r.getTimezoneOffset();
    switch (e) {
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + K(n, ":");
      case "zzzz":
      default:
        return "GMT" + C(n, ":");
    }
  },
  // Seconds timestamp
  t: function(r, e, t) {
    const n = Math.trunc(+r / 1e3);
    return b(n, e.length);
  },
  // Milliseconds timestamp
  T: function(r, e, t) {
    return b(+r, e.length);
  }
};
function K(r, e = "") {
  const t = r > 0 ? "-" : "+", n = Math.abs(r), a = Math.trunc(n / 60), o = n % 60;
  return o === 0 ? t + String(a) : t + String(a) + e + b(o, 2);
}
function J(r, e) {
  return r % 60 === 0 ? (r > 0 ? "-" : "+") + b(Math.abs(r) / 60, 2) : C(r, e);
}
function C(r, e = "") {
  const t = r > 0 ? "-" : "+", n = Math.abs(r), a = b(Math.trunc(n / 60), 2), o = b(n % 60, 2);
  return t + a + e + o;
}
const G = (r, e) => {
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
}, se = (r, e) => {
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
}, nt = (r, e) => {
  const t = r.match(/(P+)(p+)?/) || [], n = t[1], a = t[2];
  if (!a)
    return G(r, e);
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
  return o.replace("{{date}}", G(n, e)).replace("{{time}}", se(a, e));
}, at = {
  p: se,
  P: nt
}, rt = /^D+$/, ot = /^Y+$/, st = ["D", "DD", "YY", "YYYY"];
function it(r) {
  return rt.test(r);
}
function ct(r) {
  return ot.test(r);
}
function lt(r, e, t) {
  const n = dt(r, e, t);
  if (console.warn(n), st.includes(r)) throw new RangeError(n);
}
function dt(r, e, t) {
  const n = r[0] === "Y" ? "years" : "days of the month";
  return `Use \`${r.toLowerCase()}\` instead of \`${r}\` (in \`${e}\`) for formatting ${n} to the input \`${t}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`;
}
const ut = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g, ht = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g, ft = /^'([^]*?)'?$/, gt = /''/g, mt = /[a-zA-Z]/;
function Q(r, e, t) {
  var l, u, h, f;
  const n = q(), a = n.locale ?? Qe, o = n.firstWeekContainsDate ?? ((u = (l = n.locale) == null ? void 0 : l.options) == null ? void 0 : u.firstWeekContainsDate) ?? 1, s = n.weekStartsOn ?? ((f = (h = n.locale) == null ? void 0 : h.options) == null ? void 0 : f.weekStartsOn) ?? 0, i = v(r, t == null ? void 0 : t.in);
  if (!pe(i))
    throw new RangeError("Invalid time value");
  let c = e.match(ht).map((p) => {
    const g = p[0];
    if (g === "p" || g === "P") {
      const y = at[g];
      return y(p, a.formatLong);
    }
    return p;
  }).join("").match(ut).map((p) => {
    if (p === "''")
      return { isToken: !1, value: "'" };
    const g = p[0];
    if (g === "'")
      return { isToken: !1, value: bt(p) };
    if (j[g])
      return { isToken: !0, value: p };
    if (g.match(mt))
      throw new RangeError(
        "Format string contains an unescaped latin alphabet character `" + g + "`"
      );
    return { isToken: !1, value: p };
  });
  a.localize.preprocessor && (c = a.localize.preprocessor(i, c));
  const d = {
    firstWeekContainsDate: o,
    weekStartsOn: s,
    locale: a
  };
  return c.map((p) => {
    if (!p.isToken) return p.value;
    const g = p.value;
    (ct(g) || it(g)) && lt(g, e, String(r));
    const y = j[g[0]];
    return y(i, g, a.localize, d);
  }).join("");
}
function bt(r) {
  const e = r.match(ft);
  return e ? e[1].replace(gt, "'") : r;
}
function pt(r, e) {
  return H(
    P(r, r),
    _(r)
  );
}
function yt(r, e) {
  return H(
    r,
    ne(_(r), 1),
    e
  );
}
function wt(r, e, t) {
  return ne(r, -1, t);
}
function xt(r, e) {
  return H(
    P(r, r),
    wt(_(r))
  );
}
const V = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
}, Tt = {
  JSON: 0,
  Text: 1
};
let W;
class Pt {
  constructor() {
    m(this, "firstPanelTabs", []);
    // 只存储第一个面板的标签数据
    m(this, "currentPanelId", "");
    m(this, "panelIds", []);
    // 所有面板ID列表
    m(this, "currentPanelIndex", 0);
    // 当前面板索引
    m(this, "tabContainer", null);
    m(this, "cycleSwitcher", null);
    m(this, "isDragging", !1);
    m(this, "dragStartX", 0);
    m(this, "dragStartY", 0);
    m(this, "maxTabs", 10);
    // 默认值，会从设置中读取
    m(this, "position", { x: 50, y: 50 });
    m(this, "monitoringInterval", null);
    m(this, "clickListener", null);
    m(this, "keyListener", null);
    m(this, "updateDebounceTimer", null);
    // 防抖计时器
    m(this, "lastUpdateTime", 0);
    // 上次更新时间
    m(this, "isUpdating", !1);
    // 是否正在更新
    m(this, "isInitialized", !1);
    // 是否已完成初始化
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
  }
  // 已关闭的标签页blockId集合
  async init() {
    try {
      this.maxTabs = orca.state.settings[V.CachedEditorNum] || 10;
    } catch {
      console.warn("无法读取最大标签数设置，使用默认值10");
    }
    this.restorePosition(), this.discoverPanels(), this.restoreFirstPanelTabs(), this.restoreClosedTabs(), this.firstPanelTabs.length > 0 ? console.log("检测到持久化数据，使用固化的标签页状态") : (console.log("首次使用，扫描第一个面板创建标签页"), await this.scanFirstPanel()), await this.createTabsUI(), this.observeChanges(), this.observeWindowResize(), this.startActiveMonitoring(), this.setupDragEndListener(), this.setupThemeChangeListener(), this.setupScrollListener(), this.isInitialized = !0, console.log("✅ 插件初始化完成");
  }
  /**
   * 设置主题变化监听器
   */
  setupThemeChangeListener() {
    this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null);
    const e = (o) => {
      console.log("检测到主题变化，重新渲染标签页颜色:", o), console.log("当前主题模式:", orca.state.themeMode), setTimeout(() => {
        console.log("开始重新渲染标签页，当前主题:", orca.state.themeMode), this.debouncedUpdateTabsUI();
      }, 200);
    };
    try {
      orca.broadcasts.registerHandler("core.themeChanged", e), console.log("主题变化监听器注册成功");
    } catch (o) {
      console.error("主题变化监听器注册失败:", o);
    }
    let t = orca.state.themeMode;
    const a = setInterval(() => {
      const o = orca.state.themeMode;
      o !== t && (console.log("备用检测：主题从", t, "切换到", o), t = o, setTimeout(() => {
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
    const n = this.firstPanelTabs.findIndex((o) => o.blockId === e.blockId), a = this.firstPanelTabs.findIndex((o) => o.blockId === t.blockId);
    if (n !== -1 && a !== -1 && n !== a) {
      const o = a < n;
      if (o) {
        const s = this.firstPanelTabs.splice(a, 1)[0], i = n > a ? n - 1 : n;
        this.firstPanelTabs.splice(i + 1, 0, s);
      } else {
        const s = this.firstPanelTabs.splice(a, 1)[0];
        this.firstPanelTabs.splice(n, 0, s);
      }
      this.firstPanelTabs.forEach((s, i) => {
        s.order = i;
      }), console.log(`🔄 标签交换: ${t.title} -> ${e.title} (${o ? "右移" : "左移"})`), this.sortTabsByPinStatus(), this.saveFirstPanelTabs(), this.draggingTab || this.debouncedUpdateTabsUI();
    }
  }
  /**
   * 发现所有面板
   */
  discoverPanels() {
    const e = Date.now();
    if (e - this.lastPanelDiscoveryTime < 1e3 && this.panelDiscoveryCache && e - this.panelDiscoveryCache.timestamp < 1e3) {
      this.panelIds = [...this.panelDiscoveryCache.panelIds], console.log("📋 使用面板发现缓存，面板ID列表:", this.panelIds);
      return;
    }
    console.log("🔍 开始发现面板..."), this.lastPanelDiscoveryTime = e;
    const t = document.querySelector("section#main");
    if (!t) {
      console.warn("❌ 未找到 section#main");
      return;
    }
    console.log("✅ 找到 section#main");
    const n = t.querySelector(".orca-panels-row");
    if (!n) {
      console.warn("❌ 未找到 .orca-panels-row");
      return;
    }
    console.log("✅ 找到 .orca-panels-row");
    const a = document.querySelectorAll(".orca-panel");
    console.log(`🔍 在整个文档中找到 ${a.length} 个 .orca-panel 元素`);
    const o = n.querySelectorAll(".orca-panel");
    if (this.panelIds = [], console.log(`🔍 在 .orca-panels-row 中找到 ${o.length} 个 .orca-panel 元素`), o.forEach((s, i) => {
      const c = s.getAttribute("data-panel-id"), d = s.classList.contains("active"), l = s.offsetParent !== null, u = s.getBoundingClientRect(), h = this.isMenuPanel(s);
      console.log(`面板 ${i + 1}: ID=${c}, 激活=${d}, 可见=${l}, 菜单=${h}, 位置=(${u.left}, ${u.top})`), c && !h ? this.panelIds.push(c) : h ? console.log(`🚫 跳过菜单面板: ${c}`) : console.warn(`❌ 面板 ${i + 1} 没有 data-panel-id 属性`);
    }), o.length < 2 && a.length >= 2 && (console.log("⚠️ 在 .orca-panels-row 中面板不足，尝试从整个文档中查找..."), a.forEach((s, i) => {
      const c = s.getAttribute("data-panel-id"), d = this.isMenuPanel(s);
      c && !this.panelIds.includes(c) && !d ? (this.panelIds.push(c), console.log(`➕ 从文档中找到额外面板: ID=${c}`)) : d && console.log(`🚫 跳过菜单面板: ${c}`);
    })), this.panelIds.length > 0) {
      const s = document.querySelector(".orca-panel.active");
      if (s) {
        const i = s.getAttribute("data-panel-id"), c = this.panelIds.indexOf(i || "");
        c !== -1 ? (this.currentPanelId = i || "", this.currentPanelIndex = c) : (this.currentPanelId = this.panelIds[0], this.currentPanelIndex = 0);
      } else
        this.currentPanelId = this.panelIds[0], this.currentPanelIndex = 0;
    }
    console.log(`🎯 最终发现 ${this.panelIds.length} 个面板，面板ID列表:`, this.panelIds), console.log(`🎯 当前面板: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`), this.panelDiscoveryCache = {
      panelIds: [...this.panelIds],
      timestamp: e
    }, this.panelIds.length === 1 ? console.log("ℹ️ 只有一个面板，不会显示切换按钮") : this.panelIds.length > 1 && console.log(`✅ 发现 ${this.panelIds.length} 个面板，将创建循环切换器`);
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
    const a = n.getAttribute("data-block-id");
    if (!a) {
      console.log("激活的块编辑器没有blockId");
      return;
    }
    const o = await this.getTabInfo(a, e, 0);
    o ? (console.log(`📋 扫描第一个面板，找到激活页面: "${o.title}"`), this.firstPanelTabs = [o], this.saveFirstPanelTabs(), await this.updateTabsUI()) : console.log("无法获取激活页面的标签信息");
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
      let t = orca.state.settings[V.JournalDateFormat];
      return (!t || typeof t != "string") && (t = (orca.state.locale || "zh-CN").startsWith("zh") ? "yyyy年MM月dd日" : "yyyy-MM-dd"), pt(e) ? F("今天") : xt(e) ? F("昨天") : yt(e) ? F("明天") : this.formatDateWithPattern(e, t);
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
            const a = n.v.toString(), o = await this.getTabInfo(a, "", 0);
            o && o.title ? t += o.title : t += `[[块${a}]]`;
          } catch (a) {
            console.warn("处理r类型块引用失败:", a), t += "[[块引用]]";
          }
        else n.v && (t += n.v);
      else if (n.t === "br" && n.v)
        try {
          const a = n.v.toString(), o = await this.getTabInfo(a, "", 0);
          o && o.title ? t += o.title : t += `[[块${a}]]`;
        } catch (a) {
          console.warn("处理块引用失败:", a), t += "[[块引用]]";
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
      if (!t || t.type !== Tt.JSON || !t.value)
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
      return Q(e, t);
    } catch {
      const a = ["yyyy-MM-dd", "MM/dd/yyyy", "dd/MM/yyyy", "yyyy年MM月dd日"];
      for (const o of a)
        try {
          return Q(e, o);
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
      let o = "", s = "", i = "", c = !1;
      try {
        if (a.aliases && a.aliases.length > 0)
          o = a.aliases[0];
        else if (a.content && a.content.length > 0)
          o = (await this.extractTextFromContent(a.content)).substring(0, 50);
        else if (a.text)
          o = a.text.substring(0, 50);
        else {
          const d = this.extractJournalInfo(a);
          d ? (c = !0, o = `📅 ${this.formatJournalDate(d)}`) : o = `块 ${e}`;
        }
      } catch (d) {
        console.warn("获取标题失败:", d), o = `块 ${e}`;
      }
      try {
        const d = this.findProperty(a, "_color"), l = this.findProperty(a, "_icon");
        d && d.type === 1 && (s = d.value), l && l.type === 1 && (i = l.value);
      } catch (d) {
        console.warn("获取属性失败:", d);
      }
      return {
        blockId: e,
        panelId: t,
        title: o || `块 ${e}`,
        color: s,
        icon: i,
        isJournal: c,
        isPinned: !1,
        // 新标签默认不固定
        order: n
      };
    } catch (a) {
      return console.error("获取标签信息失败:", a), null;
    }
  }
  async createTabsUI() {
    this.tabContainer && this.tabContainer.remove(), this.cycleSwitcher && this.cycleSwitcher.remove(), console.log(`🎨 创建UI: 面板数=${this.panelIds.length}, 位置=(${this.position.x}, ${this.position.y})`), console.log("📱 使用自动切换模式，不创建面板切换器"), this.tabContainer = document.createElement("div"), this.tabContainer.className = "orca-tabs-container";
    const t = orca.state.themeMode === "dark" ? "transparent" : "rgba(255, 255, 255, 0.1)";
    this.tabContainer.style.cssText = `
      position: fixed;
      top: ${this.position.y}px;
      left: ${this.position.x}px;
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
      height: 28px;
      align-items: center;
      app-region: no-drag;
    `, this.tabContainer.addEventListener("mousedown", (a) => {
      a.stopPropagation();
    }), this.tabContainer.addEventListener("click", (a) => {
      a.stopPropagation();
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
    `, n.innerHTML = "⋮⋮", n.addEventListener("mousedown", this.startDrag.bind(this)), this.tabContainer.appendChild(n), document.body.appendChild(this.tabContainer), this.addDragStyles(), console.log(`✅ 标签容器已创建，位置: (${this.position.x}, ${this.position.y})`), await this.updateTabsUI();
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
    const n = this.panelIds.length > 0 && document.querySelector(`.orca-panel[data-panel-id="${this.panelIds[0]}"]`), a = this.currentPanelIndex === 0;
    n && a ? (console.log("📋 显示第一个面板的固化标签页"), this.sortTabsByPinStatus(), this.firstPanelTabs.forEach((o, s) => {
      var c;
      const i = this.createTabElement(o);
      (c = this.tabContainer) == null || c.appendChild(i);
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
    let a = 0;
    for (const s of t) {
      const i = s.querySelector(".orca-block-editor");
      if (!i) continue;
      const c = i.getAttribute("data-block-id");
      if (!c) continue;
      const d = await this.getTabInfo(c, this.currentPanelId, a++);
      d && (n.push(d), console.log(`📝 块 ${c} 标题: "${d.title}"`));
    }
    console.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const o = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((s, i) => {
        const c = this.createTabElement(s);
        o.appendChild(c);
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
      const i = this.currentPanelIndex + 1;
      s.textContent = `面板 ${i}（无标签页）`, s.title = `当前在面板 ${i}，该面板没有标签页`, o.appendChild(s);
    }
    this.tabContainer.appendChild(o);
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
    let a = 0;
    for (const s of t) {
      const i = s.querySelector(".orca-block-editor");
      if (!i) continue;
      const c = i.getAttribute("data-block-id");
      if (!c) continue;
      const d = await this.getTabInfo(c, this.currentPanelId, a++);
      d && n.push(d);
    }
    console.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${n.length} 个标签页`);
    const o = document.createDocumentFragment();
    if (n.length > 0)
      n.forEach((s, i) => {
        const c = this.createTabElement(s);
        o.appendChild(c);
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
      const i = this.currentPanelIndex + 1;
      s.textContent = `面板 ${i}（无标签页）`, s.title = `当前在面板 ${i}，该面板没有标签页`, o.appendChild(s);
    }
    this.tabContainer.appendChild(o);
  }
  /**
   * 创建标签元素
   */
  createTabElement(e) {
    const t = document.createElement("div");
    t.className = "orca-tab", t.setAttribute("data-tab-id", e.blockId), this.isTabActive(e) && t.setAttribute("data-focused", "true");
    const a = orca.state.themeMode === "dark";
    let o = a ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", s = a ? "#ffffff" : "#333", i = "normal";
    e.color && (o = this.applyOklchFormula(e.color, "background"), s = this.applyOklchFormula(e.color, "text"), i = "600"), t.style.cssText = `
      background: ${o};
      color: ${s};
      font-weight: ${i};
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
    let c = e.title;
    e.icon && (c = `${e.icon} ${e.title}`), e.isPinned && (c = `📌 ${c}`), t.textContent = c;
    let d = e.title;
    return e.isPinned && (d += " (已固定)"), t.title = d, t.addEventListener("click", (l) => {
      var h;
      l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation();
      const u = (h = this.tabContainer) == null ? void 0 : h.querySelectorAll(".orca-tab");
      u == null || u.forEach((f) => f.removeAttribute("data-focused")), t.setAttribute("data-focused", "true"), this.switchToTab(e);
    }), t.addEventListener("dblclick", (l) => {
      l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.toggleTabPinStatus(e);
    }), t.addEventListener("auxclick", (l) => {
      l.button === 1 && (l.preventDefault(), l.stopPropagation(), l.stopImmediatePropagation(), this.closeTab(e));
    }), t.addEventListener("keydown", (l) => {
      (l.target === t || t.contains(l.target)) && (l.key === "F2" ? (l.preventDefault(), l.stopPropagation(), this.renameTab(e)) : l.ctrlKey && l.key === "p" ? (l.preventDefault(), l.stopPropagation(), this.toggleTabPinStatus(e)) : l.ctrlKey && l.key === "w" && (l.preventDefault(), l.stopPropagation(), this.closeTab(e)));
    }), this.addOrcaContextMenu(t, e), t.draggable = !0, t.addEventListener("dragstart", (l) => {
      var u;
      l.dataTransfer.effectAllowed = "move", (u = l.dataTransfer) == null || u.setData("text/plain", e.blockId), this.draggingTab = e, this.lastSwapTarget = null, t.setAttribute("data-dragging", "true"), t.classList.add("dragging"), this.tabContainer && this.tabContainer.setAttribute("data-dragging", "true"), console.log(`🔄 开始拖拽标签: ${e.title} (${e.blockId})`);
    }), t.addEventListener("dragend", (l) => {
      this.draggingTab = null, this.lastSwapTarget = null, this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.dragOverTimer && (clearTimeout(this.dragOverTimer), this.dragOverTimer = null), this.clearDragVisualFeedback(), setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 50), console.log(`🔄 结束拖拽标签: ${e.title}`);
    }), t.addEventListener("dragover", (l) => {
      this.draggingTab && this.draggingTab.blockId !== e.blockId && (l.preventDefault(), l.dataTransfer.dropEffect = "move", this.addDragOverEffect(t), this.debouncedSwapTab(e, this.draggingTab));
    }), t.addEventListener("dragenter", (l) => {
      this.draggingTab && this.draggingTab.blockId !== e.blockId && (l.preventDefault(), this.addDragOverEffect(t));
    }), t.addEventListener("dragleave", (l) => {
      const u = t.getBoundingClientRect(), h = l.clientX, f = l.clientY;
      (h < u.left || h > u.right || f < u.top || f > u.bottom) && this.removeDragOverEffect(t);
    }), t.addEventListener("drop", (l) => {
      var h;
      l.preventDefault();
      const u = (h = l.dataTransfer) == null ? void 0 : h.getData("text/plain");
      console.log(`🔄 拖拽放置: ${u} -> ${e.blockId}`);
    }), t.addEventListener("mouseenter", () => {
      t.style.transform = "scale(1.05)", t.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.2)";
    }), t.addEventListener("mouseleave", () => {
      t.style.transform = "scale(1)", t.style.boxShadow = "none";
    }), t;
  }
  hexToRgba(e, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (n) {
      const a = parseInt(n[1], 16), o = parseInt(n[2], 16), s = parseInt(n[3], 16);
      return `rgba(${a}, ${o}, ${s}, ${t})`;
    }
    return `rgba(200, 200, 200, ${t})`;
  }
  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(e) {
    const t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (t) {
      const n = parseInt(t[1], 16), a = parseInt(t[2], 16), o = parseInt(t[3], 16);
      return (0.299 * n + 0.587 * a + 0.114 * o) / 255 > 0.5 ? "#000000" : "#FFFFFF";
    }
    return "#333333";
  }
  /**
   * 加深颜色
   */
  darkenColor(e, t) {
    const n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (n) {
      let a = parseInt(n[1], 16), o = parseInt(n[2], 16), s = parseInt(n[3], 16);
      a = Math.floor(a * (1 - t)), o = Math.floor(o * (1 - t)), s = Math.floor(s * (1 - t));
      const i = a.toString(16).padStart(2, "0"), c = o.toString(16).padStart(2, "0"), d = s.toString(16).padStart(2, "0");
      return `#${i}${c}${d}`;
    }
    return e;
  }
  /**
   * RGB转OKLCH颜色空间
   */
  rgbToOklch(e, t, n) {
    const a = e / 255, o = t / 255, s = n / 255, i = (U) => U <= 0.04045 ? U / 12.92 : Math.pow((U + 0.055) / 1.055, 2.4), c = i(a), d = i(o), l = i(s), u = c * 0.4124564 + d * 0.3575761 + l * 0.1804375, h = c * 0.2126729 + d * 0.7151522 + l * 0.072175, f = c * 0.0193339 + d * 0.119192 + l * 0.9503041, p = 0.2104542553 * u + 0.793617785 * h - 0.0040720468 * f, g = 1.9779984951 * u - 2.428592205 * h + 0.4505937099 * f, y = 0.0259040371 * u + 0.7827717662 * h - 0.808675766 * f, x = Math.cbrt(p), w = Math.cbrt(g), k = Math.cbrt(y), Y = 0.2104542553 * x + 0.793617785 * w + 0.0040720468 * k, S = 1.9779984951 * x - 2.428592205 * w + 0.4505937099 * k, $ = 0.0259040371 * x + 0.7827717662 * w - 0.808675766 * k, E = Math.sqrt(S * S + $ * $), B = Math.atan2($, S) * 180 / Math.PI, ie = B < 0 ? B + 360 : B;
    return { l: Y, c: E, h: ie };
  }
  /**
   * OKLCH转RGB颜色空间
   */
  oklchToRgb(e, t, n) {
    const a = n * Math.PI / 180, o = t * Math.cos(a), s = t * Math.sin(a), i = e, c = o, d = s, l = i * i * i, u = c * c * c, h = d * d * d, f = 1.0478112 * l + 0.0228866 * u - 0.050217 * h, p = 0.0295424 * l + 0.9904844 * u + 0.0170491 * h, g = -92345e-7 * l + 0.0150436 * u + 0.7521316 * h, y = 3.2404542 * f - 1.5371385 * p - 0.4985314 * g, x = -0.969266 * f + 1.8760108 * p + 0.041556 * g, w = 0.0556434 * f - 0.2040259 * p + 1.0572252 * g, k = (E) => E <= 31308e-7 ? 12.92 * E : 1.055 * Math.pow(E, 1 / 2.4) - 0.055, Y = Math.max(0, Math.min(255, Math.round(k(y) * 255))), S = Math.max(0, Math.min(255, Math.round(k(x) * 255))), $ = Math.max(0, Math.min(255, Math.round(k(w) * 255)));
    return { r: Y, g: S, b: $ };
  }
  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  applyOklchFormula(e, t) {
    const n = orca.state.themeMode === "dark", a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
    if (!a) return e;
    const o = parseInt(a[1], 16), s = parseInt(a[2], 16), i = parseInt(a[3], 16);
    if (t === "text") {
      const c = (o + s + i) / 3;
      if (n)
        if (c < 80) {
          const l = Math.min(255, Math.round(o * 1.6)), u = Math.min(255, Math.round(s * 1.6)), h = Math.min(255, Math.round(i * 1.6));
          return `rgb(${l}, ${u}, ${h})`;
        } else if (c < 150) {
          const l = Math.min(255, Math.round(o * 1.3)), u = Math.min(255, Math.round(s * 1.3)), h = Math.min(255, Math.round(i * 1.3));
          return `rgb(${l}, ${u}, ${h})`;
        } else {
          const l = Math.min(255, Math.round(o * 1.1)), u = Math.min(255, Math.round(s * 1.1)), h = Math.min(255, Math.round(i * 1.1));
          return `rgb(${l}, ${u}, ${h})`;
        }
      else if (c > 200) {
        const l = Math.max(0, Math.round(o * 0.4)), u = Math.max(0, Math.round(s * 0.4)), h = Math.max(0, Math.round(i * 0.4));
        return `rgb(${l}, ${u}, ${h})`;
      } else if (c > 150) {
        const l = Math.max(0, Math.round(o * 0.6)), u = Math.max(0, Math.round(s * 0.6)), h = Math.max(0, Math.round(i * 0.6));
        return `rgb(${l}, ${u}, ${h})`;
      } else {
        const l = Math.max(0, Math.round(o * 0.8)), u = Math.max(0, Math.round(s * 0.8)), h = Math.max(0, Math.round(i * 0.8));
        return `rgb(${l}, ${u}, ${h})`;
      }
    } else
      return n ? this.hexToRgba(e, 0.25) : this.hexToRgba(e, 0.35);
  }
  async switchToTab(e) {
    try {
      const t = this.getCurrentActiveTab();
      t && t.blockId !== e.blockId && this.recordScrollPosition(t);
      const n = this.panelIds[this.currentPanelIndex];
      this.currentPanelIndex === 0 ? await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, n) : await orca.nav.goTo("block", { blockId: parseInt(e.blockId) }, n), console.log(`🔄 切换到标签: ${e.title} (面板 ${this.currentPanelIndex + 1})`), this.restoreScrollPosition(e), setTimeout(() => {
        this.debugScrollPosition(e);
      }, 500);
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
    const a = n.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    return a ? a.getAttribute("data-block-id") === e.blockId : !1;
  }
  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(e) {
    const t = this.firstPanelTabs.findIndex((a) => a.blockId === e.blockId);
    if (t === -1) {
      console.log("未找到要关闭的标签页");
      return;
    }
    let n = -1;
    if (t === 0 ? n = 1 : t === this.firstPanelTabs.length - 1 ? n = t - 1 : n = t + 1, n >= 0 && n < this.firstPanelTabs.length) {
      const a = this.firstPanelTabs[n];
      console.log(`🔄 自动切换到相邻标签: "${a.title}" (位置: ${n})`);
      const o = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(a.blockId) }, o);
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
   * 记录当前标签的滚动位置
   */
  recordScrollPosition(e) {
    try {
      const t = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(t, orca.state.panels);
      if (n && n.viewState) {
        let a = null;
        const o = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (o) {
          const s = o.closest(".orca-panel");
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
          const i = this.firstPanelTabs.findIndex((c) => c.blockId === e.blockId);
          i !== -1 && (this.firstPanelTabs[i].scrollPosition = s, this.saveFirstPanelTabs()), console.log(`📝 记录标签 "${e.title}" 滚动位置到viewState:`, s, "容器:", a.className);
        } else
          console.warn(`未找到标签 "${e.title}" 的滚动容器`);
      } else
        console.warn(`未找到面板 ${t} 或viewState`);
    } catch (t) {
      console.warn("记录滚动位置时出错:", t);
    }
  }
  /**
   * 恢复标签的滚动位置
   */
  restoreScrollPosition(e) {
    try {
      let t = null;
      const n = this.panelIds[this.currentPanelIndex], a = orca.nav.findViewPanel(n, orca.state.panels);
      if (a && a.viewState && a.viewState.scrollPosition && (t = a.viewState.scrollPosition, console.log(`🔄 从viewState恢复标签 "${e.title}" 滚动位置:`, t)), !t && e.scrollPosition && (t = e.scrollPosition, console.log(`🔄 从标签信息恢复标签 "${e.title}" 滚动位置:`, t)), !t) return;
      const o = (s = 1) => {
        if (s > 5) {
          console.warn(`恢复标签 "${e.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        let i = null;
        const c = document.querySelector(`.orca-block-editor[data-block-id="${e.blockId}"]`);
        if (c) {
          const d = c.closest(".orca-panel");
          d && (i = d.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        if (!i) {
          const d = document.querySelector(".orca-panel.active");
          d && (i = d.querySelector(".orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container"));
        }
        i || (i = document.body.scrollTop > 0 ? document.body : document.documentElement), i ? (i.scrollLeft = t.x, i.scrollTop = t.y, console.log(`🔄 恢复标签 "${e.title}" 滚动位置:`, t, "容器:", i.className, `尝试${s}`)) : setTimeout(() => o(s + 1), 200 * s);
      };
      o(), setTimeout(() => o(2), 100), setTimeout(() => o(3), 300);
    } catch (t) {
      console.warn("恢复滚动位置时出错:", t);
    }
  }
  /**
   * 调试滚动位置信息
   */
  debugScrollPosition(e) {
    console.log(`🔍 调试标签 "${e.title}" 滚动位置:`), console.log("标签保存的滚动位置:", e.scrollPosition);
    const t = this.panelIds[this.currentPanelIndex], n = orca.nav.findViewPanel(t, orca.state.panels);
    n && n.viewState ? (console.log("viewState中的滚动位置:", n.viewState.scrollPosition), console.log("完整viewState:", n.viewState)) : console.log("未找到viewState"), [
      ".orca-panel-content",
      ".orca-editor-content",
      ".scroll-container",
      ".orca-scroll-container",
      ".orca-panel",
      "body",
      "html"
    ].forEach((o) => {
      document.querySelectorAll(o).forEach((i, c) => {
        const d = i;
        (d.scrollTop > 0 || d.scrollLeft > 0) && console.log(`容器 ${o}[${c}]:`, {
          scrollTop: d.scrollTop,
          scrollLeft: d.scrollLeft,
          className: d.className,
          id: d.id
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
      const n = t.querySelector(".orca-block-editor[data-block-id]");
      return n ? n.getAttribute("data-block-id") === e.blockId : !1;
    } catch (t) {
      return console.warn("检查标签激活状态时出错:", t), !1;
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
    const a = n.getAttribute("data-block-id");
    return a && this.firstPanelTabs.find((o) => o.blockId === a) || null;
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
      const n = this.getCurrentActiveTab(), a = n && n.blockId === e.blockId, o = a ? this.getAdjacentTab(e) : null;
      this.closedTabs.add(e.blockId), this.firstPanelTabs.splice(t, 1), this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), console.log(`🗑️ 标签 "${e.title}" 已关闭，已添加到关闭列表`), a && o ? (console.log(`🔄 自动切换到相邻标签: "${o.title}"`), await this.switchToTab(o)) : a && !o && console.log("⚠️ 关闭了激活标签但没有相邻标签可切换");
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
    const t = this.firstPanelTabs.filter((a) => a.isPinned), n = this.firstPanelTabs.length - t.length;
    this.firstPanelTabs = t, this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), console.log(`🗑️ 已关闭 ${n} 个标签，保留了 ${t.length} 个固定标签`);
  }
  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  closeOtherTabs(e) {
    if (this.currentPanelIndex !== 0) return;
    const t = this.firstPanelTabs.filter(
      (o) => o.blockId === e.blockId || o.isPinned
    );
    this.firstPanelTabs.filter(
      (o) => o.blockId !== e.blockId && !o.isPinned
    ).forEach((o) => {
      this.closedTabs.add(o.blockId);
    });
    const a = this.firstPanelTabs.length - t.length;
    this.firstPanelTabs = t, this.debouncedUpdateTabsUI(), this.saveFirstPanelTabs(), this.saveClosedTabs(), console.log(`🗑️ 已关闭其他 ${a} 个标签，保留了当前标签和固定标签`);
  }
  /**
   * 重命名标签（内联编辑）
   */
  renameTab(e) {
    if (this.currentPanelIndex !== 0) return;
    const t = document.querySelector(".tab-context-menu");
    t && t.remove(), this.showInlineRenameInput(e);
  }
  /**
   * 显示内联重命名输入框
   */
  showInlineRenameInput(e) {
    const t = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (!t) {
      console.warn("找不到对应的标签元素");
      return;
    }
    const n = t.querySelector(".inline-rename-input");
    n && n.remove();
    const a = t.textContent, o = t.style.cssText, s = document.createElement("input");
    s.type = "text", s.value = e.title, s.className = "inline-rename-input";
    const i = orca.state.themeMode === "dark";
    let c = i ? "rgba(255, 255, 255, 0.1)" : "rgba(200, 200, 200, 0.6)", d = i ? "#ffffff" : "#333";
    e.color && (c = this.applyOklchFormula(e.color, "background"), d = this.applyOklchFormula(e.color, "text")), s.style.cssText = `
      background: ${c};
      color: ${d};
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
    `, t.textContent = "", t.appendChild(s), t.style.padding = "2px 8px", s.focus(), s.select();
    const l = () => {
      const h = s.value.trim();
      h && h !== e.title && this.updateTabTitle(e, h), t.textContent = a, t.style.cssText = o;
    }, u = () => {
      t.textContent = a, t.style.cssText = o;
    };
    s.addEventListener("blur", l), s.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), l()) : h.key === "Escape" && (h.preventDefault(), u());
    }), s.addEventListener("click", (h) => {
      h.stopPropagation();
    });
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
    const o = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    let s = { x: "50%", y: "50%" };
    if (o) {
      const u = o.getBoundingClientRect(), h = window.innerWidth, f = window.innerHeight, p = 300, g = 100, y = 20;
      let x = u.left, w = u.top - g - 10;
      x + p > h - y && (x = h - p - y), x < y && (x = y), w < y && (w = u.bottom + 10, w + g > f - y && (w = (f - g) / 2)), w + g > f - y && (w = f - g - y), x = Math.max(y, Math.min(x, h - p - y)), w = Math.max(y, Math.min(w, f - g - y)), s = { x: `${x}px`, y: `${w}px` };
    }
    const i = orca.components.InputBox, c = t.createElement(i, {
      label: "重命名标签",
      defaultValue: e.title,
      onConfirm: (u, h, f) => {
        u && u.trim() && u.trim() !== e.title && this.updateTabTitle(e, u.trim()), f();
      },
      onCancel: (u) => {
        u();
      }
    }, (u) => t.createElement("div", {
      style: {
        position: "absolute",
        left: s.x,
        top: s.y,
        pointerEvents: "auto"
      },
      onClick: u
    }, ""));
    n.render(c, a), setTimeout(() => {
      const u = a.querySelector("div");
      u && u.click();
    }, 0);
    const d = () => {
      setTimeout(() => {
        n.unmountComponentAtNode(a), a.remove();
      }, 100);
    }, l = (u) => {
      u.key === "Escape" && (d(), document.removeEventListener("keydown", l));
    };
    document.addEventListener("keydown", l);
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
    const a = document.createElement("input");
    a.type = "text", a.value = e.title, a.style.cssText = `
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
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    const i = document.createElement("button");
    i.textContent = "取消", i.style.cssText = `
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
    }), i.addEventListener("mouseenter", () => {
      i.style.backgroundColor = "#4b5563";
    }), i.addEventListener("mouseleave", () => {
      i.style.backgroundColor = "#6b7280";
    }), o.appendChild(s), o.appendChild(i), n.appendChild(a), n.appendChild(o);
    const c = document.querySelector(`[data-tab-id="${e.blockId}"]`);
    if (c) {
      const h = c.getBoundingClientRect();
      n.style.left = `${h.left}px`, n.style.top = `${h.top - 60}px`;
    } else
      n.style.left = "50%", n.style.top = "50%", n.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(n), a.focus(), a.select();
    const d = () => {
      const h = a.value.trim();
      h && h !== e.title && this.updateTabTitle(e, h), n.remove();
    }, l = () => {
      n.remove();
    };
    s.addEventListener("click", d), i.addEventListener("click", l), a.addEventListener("keydown", (h) => {
      h.key === "Enter" ? (h.preventDefault(), d()) : h.key === "Escape" && (h.preventDefault(), l());
    });
    const u = (h) => {
      n.contains(h.target) || (l(), document.removeEventListener("click", u));
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
      const n = this.firstPanelTabs.findIndex((a) => a.blockId === e.blockId);
      n !== -1 && (this.firstPanelTabs[n].title = t, this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI(), console.log(`📝 标签重命名: "${e.title}" -> "${t}"`));
    } catch (n) {
      console.error("重命名标签失败:", n);
    }
  }
  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(e, t) {
    const n = window.React, a = window.ReactDOM;
    if (!n || !a || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      console.warn("Orca组件不可用，回退到原生右键菜单"), e.addEventListener("contextmenu", (f) => {
        f.preventDefault(), f.stopPropagation(), f.stopImmediatePropagation(), this.showTabContextMenu(f, t);
      });
      return;
    }
    const o = document.createElement("div");
    o.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `, e.appendChild(o);
    const s = orca.components.ContextMenu, i = orca.components.Menu, c = orca.components.MenuText, d = orca.components.MenuSeparator, l = n.createElement(s, {
      menu: (f) => n.createElement(i, {}, [
        n.createElement(c, {
          key: "rename",
          title: "重命名标签",
          preIcon: "ti ti-edit",
          shortcut: "F2",
          onClick: () => {
            f(), this.renameTab(t);
          }
        }),
        n.createElement(c, {
          key: "pin",
          title: t.isPinned ? "取消固定" : "固定标签",
          preIcon: t.isPinned ? "ti ti-pin-off" : "ti ti-pin",
          shortcut: "Ctrl+P",
          onClick: () => {
            f(), this.toggleTabPinStatus(t);
          }
        }),
        n.createElement(d, { key: "separator1" }),
        n.createElement(c, {
          key: "close",
          title: "关闭标签",
          preIcon: "ti ti-x",
          shortcut: "Ctrl+W",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            f(), this.closeTab(t);
          }
        }),
        n.createElement(c, {
          key: "closeOthers",
          title: "关闭其他标签",
          preIcon: "ti ti-x",
          disabled: this.firstPanelTabs.length <= 1,
          onClick: () => {
            f(), this.closeOtherTabs(t);
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
    }, (f, p) => n.createElement("div", {
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
    a.render(l, o);
    const u = () => {
      a.unmountComponentAtNode(o), o.remove();
    }, h = new MutationObserver((f) => {
      f.forEach((p) => {
        p.removedNodes.forEach((g) => {
          g === e && (u(), h.disconnect());
        });
      });
    });
    h.observe(document.body, { childList: !0, subtree: !0 });
  }
  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e, t) {
    const n = document.querySelector(".tab-context-menu");
    n && n.remove();
    const a = document.createElement("div");
    a.className = "tab-context-menu", a.style.cssText = `
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
    ].forEach((i) => {
      const c = document.createElement("div");
      c.textContent = i.text, c.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        color: ${i.disabled ? "#999" : "#333"};
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
      `, i.disabled || (c.addEventListener("mouseenter", () => {
        c.style.backgroundColor = "#f0f0f0";
      }), c.addEventListener("mouseleave", () => {
        c.style.backgroundColor = "transparent";
      }), c.addEventListener("click", () => {
        i.action(), a.remove();
      })), a.appendChild(c);
    }), document.body.appendChild(a);
    const s = (i) => {
      a.contains(i.target) || (a.remove(), document.removeEventListener("click", s));
    };
    setTimeout(() => {
      document.addEventListener("click", s);
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
        const a = t[1];
        return console.log(`📦 从URL提取repo标识: ${a}`), `orca-first-panel-tabs-repo-${a}`;
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
      const a = e.charCodeAt(n);
      t = (t << 5) - t + a, t = t & t;
    }
    return Math.abs(t).toString(36);
  }
  startDrag(e) {
    e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.isDragging = !0, this.dragStartX = e.clientX - this.position.x, this.dragStartY = e.clientY - this.position.y;
    const t = (a) => {
      a.preventDefault(), a.stopPropagation(), this.drag(a);
    }, n = (a) => {
      a.preventDefault(), a.stopPropagation(), document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n), this.stopDrag();
    };
    document.addEventListener("mousemove", t, { capture: !0 }), document.addEventListener("mouseup", n, { capture: !0 }), this.tabContainer && (this.tabContainer.style.cursor = "grabbing");
  }
  drag(e) {
    if (!this.isDragging || !this.tabContainer) return;
    e.preventDefault(), this.position.x = e.clientX - this.dragStartX, this.position.y = e.clientY - this.dragStartY;
    const t = this.tabContainer.getBoundingClientRect(), n = 5, a = window.innerWidth - t.width - 5, o = 5, s = window.innerHeight - t.height - 5;
    this.position.x = Math.max(n, Math.min(a, this.position.x)), this.position.y = Math.max(o, Math.min(s, this.position.y)), this.tabContainer.style.left = this.position.x + "px", this.tabContainer.style.top = this.position.y + "px";
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
    const a = window.innerWidth - 400, o = 0, s = window.innerHeight - 40;
    this.position.x = Math.max(0, Math.min(a, this.position.x)), this.position.y = Math.max(o, Math.min(s, this.position.y));
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
    const a = n.getAttribute("data-block-id");
    if (!a) {
      console.log("激活的块编辑器没有blockId");
      return;
    }
    const o = this.firstPanelTabs.find((i) => i.blockId === a);
    if (o) {
      console.log(`📋 当前激活页面已存在: "${o.title}"`);
      return;
    }
    const s = await this.getTabInfo(a, e, this.firstPanelTabs.length);
    if (s) {
      if (console.log(`📋 检测到新的激活页面: "${s.title}"`), this.firstPanelTabs.length >= this.maxTabs) {
        const i = this.findLastNonPinnedTabIndex();
        if (i !== -1) {
          const c = this.firstPanelTabs[i];
          this.firstPanelTabs[i] = s, console.log(`🔄 标签页达到上限，替换最后一个标签: "${c.title}" -> "${s.title}"`);
        } else {
          console.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${s.title}"`);
          return;
        }
      } else
        this.firstPanelTabs.push(s), console.log(`➕ 添加新标签: ${s.title} (ID: ${a})`);
      this.closedTabs.has(a) && (this.closedTabs.delete(a), this.saveClosedTabs(), console.log(`🔄 标签 "${s.title}" 重新显示，从已关闭列表中移除`)), this.saveFirstPanelTabs(), this.debouncedUpdateTabsUI();
    } else
      console.log("无法获取激活页面的标签信息");
  }
  observeChanges() {
    new MutationObserver(async (t) => {
      let n = !1, a = !1, o = !1, s = this.currentPanelIndex;
      t.forEach((i) => {
        if (i.type === "childList") {
          const c = i.target;
          if ((c.classList.contains("orca-panels-row") || c.closest(".orca-panels-row")) && (console.log("🔍 检测到面板行变化，检查新面板..."), a = !0), i.addedNodes.length > 0 && c.closest(".orca-panel")) {
            for (const l of i.addedNodes)
              if (l.nodeType === Node.ELEMENT_NODE) {
                const u = l;
                if (u.classList.contains("orca-block-editor") || u.querySelector(".orca-block-editor")) {
                  n = !0;
                  break;
                }
              }
          }
        }
        i.type === "attributes" && i.attributeName === "class" && i.target.classList.contains("orca-panel") && (o = !0);
      }), o && (await this.updateCurrentPanelIndex(), s !== this.currentPanelIndex && (console.log(`🔄 面板切换: ${s} -> ${this.currentPanelIndex}`), this.debouncedUpdateTabsUI())), a && setTimeout(async () => {
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
      const n = t[0], a = this.panelIds[0];
      n && a && n !== a && (console.log(`🔄 第一个面板已变更: ${n} -> ${a}`), await this.handleFirstPanelChange(n, a)), this.currentPanelId && !this.panelIds.includes(this.currentPanelId) && (console.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`), this.currentPanelIndex = 0, this.currentPanelId = this.panelIds[0]), await this.createTabsUI();
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
    }, 2e3), this.clickListener = async (e) => {
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
    if (document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])').length === this.panelIds.length && this.panelDiscoveryCache && Date.now() - this.panelDiscoveryCache.timestamp < 3e3) {
      console.log("📋 面板数量未变化，跳过面板发现");
      return;
    }
    const t = [...this.panelIds];
    this.discoverPanels();
    const n = t.length !== this.panelIds.length || !t.every((o, s) => o === this.panelIds[s]);
    if (n) {
      console.log(`📋 面板列表发生变化: ${t.length} -> ${this.panelIds.length}`), console.log(`📋 旧面板列表: [${t.join(", ")}]`), console.log(`📋 新面板列表: [${this.panelIds.join(", ")}]`);
      const o = t[0], s = this.panelIds[0];
      o && s && o !== s && (console.log(`🔄 第一个面板已变更: ${o} -> ${s}`), console.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`), await this.handleFirstPanelChange(o, s), console.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`));
    }
    const a = document.querySelector(".orca-panel.active");
    if (a) {
      const o = a.getAttribute("data-panel-id");
      if (o && (o !== this.currentPanelId || n)) {
        const s = this.currentPanelIndex, i = this.panelIds.indexOf(o);
        i !== -1 && (console.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${o} (索引: ${s} -> ${i})`), this.currentPanelIndex = i, this.currentPanelId = o, this.debouncedUpdateTabsUI());
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
    e && e.remove(), this.monitoringInterval && (clearInterval(this.monitoringInterval), this.monitoringInterval = null), this.updateDebounceTimer && (clearTimeout(this.updateDebounceTimer), this.updateDebounceTimer = null), this.swapDebounceTimer && (clearTimeout(this.swapDebounceTimer), this.swapDebounceTimer = null), this.clickListener && (document.removeEventListener("click", this.clickListener), this.clickListener = null), this.keyListener && (document.removeEventListener("keydown", this.keyListener), this.keyListener = null), this.dragEndListener && (document.removeEventListener("dragend", this.dragEndListener), this.dragEndListener = null), this.themeChangeListener && (this.themeChangeListener(), this.themeChangeListener = null), this.scrollListener && (this.scrollListener(), this.scrollListener = null), this.draggingTab = null;
  }
}
let T = null;
async function It(r) {
  W = r, de(orca.state.locale, { "zh-CN": ue }), T = new Pt(), document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => T == null ? void 0 : T.init(), 500);
  }) : setTimeout(() => T == null ? void 0 : T.init(), 500), orca.commands.registerCommand(
    `${W}.resetCache`,
    async () => {
      T && (await T.resetCache(), orca.notify("success", "插件缓存已重置", {
        title: "Orca Tabs Plugin"
      }));
    },
    "重置插件缓存"
  ), console.log(F("标签页插件已启动")), console.log(`${W} loaded.`);
}
async function kt() {
  T && (T.destroy(), T = null), orca.commands.unregisterCommand(`${W}.resetCache`);
}
export {
  It as load,
  kt as unload
};
