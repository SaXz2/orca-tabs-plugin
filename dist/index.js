let N = "en", M = {};
function D(t, e) {
  N = t, M = e;
}
function j(t, e, n) {
  var i;
  return ((i = M[N]) == null ? void 0 : i[t]) ?? t;
}
const J = {};
let f;
async function dt(t) {
  var e, n;
  f = t, D(orca.state.locale, { "zh-CN": J }), console.log(j("your plugin code starts here"));
  try {
    await ((n = (e = orca.plugins) == null ? void 0 : e.setSettingsSchema) == null ? void 0 : n.call(e, f, {
      resetBarPosition: {
        label: "重置标签栏位置",
        description: "将标签栏恢复到默认位置（左上角）",
        type: "button",
        onClick: async () => {
          await ct();
        }
      }
    }));
  } catch {
  }
  V(), console.log(`${f} loaded.`);
}
async function ut() {
  G(), st();
}
function k(t) {
  var e;
  return !!((e = t == null ? void 0 : t.closest) != null && e.call(t, ".orca-popup"));
}
function A() {
  const t = Array.from(document.querySelectorAll(".orca-panel.active"));
  for (const e of t)
    if (!k(e)) return e;
  return null;
}
function z() {
  return Array.from(document.querySelectorAll(".orca-panel")).filter((t) => !k(t));
}
function R() {
  return Array.from(document.querySelectorAll(".windows .orca-panel")).filter((t) => !k(t));
}
function x(t) {
  return t ? Array.from(t.querySelectorAll(".orca-hideable")).filter(
    (n) => !!n.querySelector(
      ".orca-block-editor[data-block-id]"
    )
  ) : [];
}
function W(t) {
  const e = t.querySelector(
    ".orca-block-editor[data-block-id]"
  );
  if (!e) return null;
  const n = e.getAttribute("data-block-id");
  if (!n || !/^\d+$/.test(n)) return null;
  const o = parseInt(n, 10);
  return Number.isFinite(o) ? o : null;
}
async function O(t) {
  const e = t ?? A();
  let o = x(e).map((a) => ({
    element: a,
    blockId: W(a)
  })).filter((a) => a.blockId != null);
  const i = o.map((a) => a.blockId).filter((a) => typeof a == "number");
  if (i.length > 0)
    try {
      const a = await orca.invokeBackend(
        "get-blocks",
        i
      ), c = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Set();
      a == null || a.forEach((r) => {
        if (r && typeof r.id == "number") {
          const l = _(r.text ?? ""), u = q(r.content);
          c.set(r.id, u || l), d.set(r.id, r.created), s.add(r.id);
        }
      }), o.forEach((r) => {
        if (r.blockId != null) {
          const l = a.find((u) => (u == null ? void 0 : u.id) === r.blockId);
          if (l && (l.aliases && l.aliases.length > 0 ? r.title = l.aliases[0] : r.title = c.get(r.blockId) || void 0, l.properties)) {
            const u = l.properties.find((b) => b.name === "_color" && b.type === 1);
            u && (r.color = u.value);
            const p = l.properties.find((b) => b.name === "_icon" && b.type === 1);
            p && (r.icon = p.value);
          }
        }
      }), o = o.filter((r) => r.blockId != null && s.has(r.blockId));
      for (const r of o) {
        if (!r.blockId || r.title && r.title.trim()) continue;
        const l = r.element.querySelector(
          ".orca-block.orca-container"
        );
        if ((l == null ? void 0 : l.getAttribute("data-type")) === "journal") {
          const p = P(l);
          p && (r.title = p);
        }
      }
    } catch (a) {
      console.warn("get-blocks failed, fallback to single fetches", a);
      const c = [];
      for (const d of o)
        if (d.blockId != null)
          try {
            const s = await orca.invokeBackend(
              "get-block",
              d.blockId
            );
            let r = q(s == null ? void 0 : s.content);
            if (r || (r = _((s == null ? void 0 : s.text) ?? "")), !r) {
              const l = d.element.querySelector(
                ".orca-block.orca-container"
              );
              (l == null ? void 0 : l.getAttribute("data-type")) === "journal" && (r = P(l) || "");
            }
            d.title = r || void 0, c.push(d);
          } catch {
          }
      o = c;
    }
  return o;
}
async function H() {
  await orca.commands.invokeCommand("core.switchToNextPanel");
}
async function X() {
  await orca.commands.invokeCommand("core.switchToPreviousPanel");
}
async function Y() {
  await orca.commands.invokeCommand("core.closeOtherPanels");
}
async function U(t) {
  const e = R();
  if (t < 0 || t >= e.length) return;
  const o = e[t].getAttribute("data-panel-id") || String(t);
  try {
    await orca.commands.invokeCommand("core.switchToPanel", { panelId: o });
  } catch (i) {
    console.warn("Failed to switch to panel:", i), e.forEach((a, c) => {
      c === t ? a.classList.add("active") : a.classList.remove("active");
    }), C();
  }
}
const F = [];
function S(t, e) {
  orca.commands.registerCommand(t, e, t), F.push(t);
}
function V() {
  S(`${f}.tabs.list`, async () => {
    const t = A();
    return (await O(t)).map((n, o) => ({ index: o, blockId: n.blockId, title: n.title }));
  }), S(`${f}.tabs.closeOthers`, async () => {
    await Y();
  }), S(`${f}.tabs.switchNext`, async () => {
    await H();
  }), S(`${f}.tabs.switchPrev`, async () => {
    await X();
  });
}
function G() {
  for (const t of F)
    try {
      orca.commands.unregisterCommand(t);
    } catch {
    }
}
const h = "data-orca-tabs-bar", g = "orca-tabs-bar", m = "orca-tab", y = "is-active", K = "orca-tab-close";
let w = null, E = !1;
const L = /* @__PURE__ */ new WeakMap(), v = "tabsBarPosition";
let $ = null;
function Q() {
  try {
    return Array.from(document.querySelectorAll(".orca-panel")).filter((e) => !k(e)).length <= 1;
  } catch {
    return !0;
  }
}
function Z(t) {
  let e = document.querySelector(`[${h}="true"]`);
  return e || (e = document.createElement("div"), e.setAttribute(h, "true"), e.classList.add(g), e.style.display = "flex", e.style.gap = "6px", e.style.alignItems = "center", e.style.position = "fixed", e.style.top = "12px", e.style.left = "12px", e.style.zIndex = "300", e.style.userSelect = "none", e.style.cursor = "grab", e.style["-webkit-app-region"] = "no-drag", document.body.appendChild(e), nt(e).catch(() => {
  }), rt(e)), e;
}
function tt(t, e) {
  const n = parseInt(t.slice(1, 3), 16), o = parseInt(t.slice(3, 5), 16), i = parseInt(t.slice(5, 7), 16);
  return `rgba(${n}, ${o}, ${i}, ${e})`;
}
function P(t) {
  const e = t.querySelector(
    ".orca-repr-main-content"
  );
  if (!e) return "";
  const n = e.querySelector(".ti.ti-calendar.orca-repr-journal-calendar");
  let o = "";
  if (n && n.parentNode) {
    let i = n.nextSibling;
    for (; i; ) {
      if (i.nodeType === Node.TEXT_NODE) {
        const a = (i.textContent || "").trim();
        if (a) {
          o = a;
          break;
        }
      }
      if (i.nodeType === Node.ELEMENT_NODE) {
        const a = i;
        if (a.matches(".orca-button.plain.orca-repr-journal-btn")) {
          i = i.nextSibling;
          continue;
        }
        const c = (a.textContent || "").trim();
        if (c) {
          o = c;
          break;
        }
      }
      i = i.nextSibling;
    }
  }
  return n && o ? `📅 ${o}` : o || "";
}
function _(t) {
  const e = document.createElement("div");
  return e.innerHTML = t || "", (e.textContent || "").trim();
}
function q(t) {
  if (!t) return "";
  const e = [], n = (o) => {
    if (o) {
      if (Array.isArray(o)) {
        for (const i of o) n(i);
        return;
      }
      if (typeof o == "object" && o.t === "t" && typeof o.v == "string") {
        e.push(o.v);
        return;
      }
      typeof o == "object" && o.content && n(o.content);
    }
  };
  return n(t), e.join("").trim();
}
function et(t, e) {
  const n = Z();
  for (; n.firstChild; ) n.removeChild(n.firstChild);
  const o = R();
  if (o.length > 1) {
    const c = document.createElement("button");
    c.type = "button", c.textContent = "🪟", c.title = "切换窗口面板", c.style.padding = "4px 8px", c.style.marginRight = "8px", c.style.cursor = "pointer", c.style.borderRadius = "8px", c.style.border = "none", c.style.backgroundColor = "rgba(0,0,0,0.1)", c.addEventListener("click", async () => {
      const s = (o.findIndex((r) => r.classList.contains("active")) + 1) % o.length;
      await U(s);
    }), n.appendChild(c);
  }
  let a = x(t).findIndex((c) => !c.classList.contains("orca-hideable-hidden"));
  a < 0 && (a = -1), e.length, e.forEach((c, d) => {
    const s = document.createElement("button");
    s.type = "button";
    const r = document.createElement("span");
    if (r.style.display = "flex", r.style.alignItems = "center", r.style.gap = "4px", c.icon) {
      const u = document.createElement("span");
      u.textContent = c.icon.startsWith("ti ") ? "" : c.icon, u.style.fontSize = "14px", u.style.marginRight = "auto", r.appendChild(u);
    }
    const l = document.createTextNode(c.title && c.title.trim().length > 0 ? c.title : `未命名 ${c.blockId ?? ""}`);
    r.appendChild(l), s.appendChild(r), s.title = c.title || "", s.classList.add(m), s.style.padding = "4px 8px", c.color ? (s.style.backgroundColor = tt(c.color, 0.2), s.style.color = c.color, s.style.fontWeight = "700") : (s.style.backgroundColor = "", s.style.color = "", s.style.fontWeight = ""), d === a ? s.classList.add(y) : s.classList.remove(y), s.style.cursor = "pointer", s.addEventListener("click", () => {
      try {
        Array.from(n.querySelectorAll(`.${m}`)).forEach((p, b) => {
          b === d ? p.classList.add(y) : p.classList.remove(y);
        }), T(t, d);
      } catch (u) {
        console.warn("Failed to switch tab", u);
      }
    }), n.appendChild(s);
  });
}
async function ot(t) {
  var e, n;
  try {
    await ((n = (e = orca.plugins) == null ? void 0 : e.setData) == null ? void 0 : n.call(e, f, v, t));
  } catch {
  }
  try {
    localStorage.setItem(`${f}:${v}`, JSON.stringify(t));
  } catch {
  }
}
async function nt(t) {
  var e, n;
  try {
    try {
      const i = localStorage.getItem(`${f}:${v}`);
      if (i) {
        const a = JSON.parse(i);
        a && typeof a.left == "number" && typeof a.top == "number" && I(t, a.left, a.top);
      }
    } catch {
    }
    const o = await ((n = (e = orca.plugins) == null ? void 0 : e.getData) == null ? void 0 : n.call(e, f, v));
    o && typeof o.left == "number" && typeof o.top == "number" && I(t, o.left, o.top), B();
  } catch {
  }
}
function I(t, e, n) {
  const o = window.innerWidth, i = window.innerHeight, a = t.getBoundingClientRect(), c = Math.min(Math.max(0, e), Math.max(0, o - a.width)), d = Math.min(Math.max(0, n), Math.max(0, i - a.height));
  t.style.left = `${c}px`, t.style.top = `${d}px`;
}
function rt(t) {
  let e = 0, n = 0, o = 0, i = 0, a = !1;
  const c = (r) => {
    if (r.button !== 0) return;
    a = !0;
    const l = t.getBoundingClientRect();
    e = r.clientX, n = r.clientY, o = l.left, i = l.top, document.addEventListener("mousemove", d), document.addEventListener("mouseup", s), r.preventDefault();
  }, d = (r) => {
    if (!a) return;
    const l = r.clientX - e, u = r.clientY - n;
    t.style.left = `${o + l}px`, t.style.top = `${i + u}px`;
  }, s = async () => {
    if (!a) return;
    a = !1, document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", s);
    const r = t.getBoundingClientRect();
    await ot({ left: r.left, top: r.top });
  };
  t.addEventListener("mousedown", c), $ = () => {
    t.removeEventListener("mousedown", c), document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", s);
  };
}
function B() {
  const t = document.querySelector(`[${h}="true"]`);
  if (!t) return;
  const e = t.getBoundingClientRect();
  I(t, e.left, e.top);
}
async function ct() {
  var e, n;
  try {
    await ((n = (e = orca.plugins) == null ? void 0 : e.removeData) == null ? void 0 : n.call(e, f, v));
  } catch {
  }
  const t = document.querySelector(`[${h}="true"]`);
  t && (t.style.left = "12px", t.style.top = "12px");
}
function T(t, e) {
  const n = x(t);
  if (!(e < 0 || e >= n.length)) {
    for (let o = 0; o < n.length; o++) {
      const i = n[o];
      o === e ? i.classList.remove("orca-hideable-hidden") : i.classList.add("orca-hideable-hidden");
    }
    C();
  }
}
async function at() {
  const t = z();
  if (!Q()) {
    t.forEach((o) => {
      o.querySelectorAll(`[${h}="true"]`).forEach((i) => i.remove());
    });
    return;
  }
  const e = A(), n = e ? [e] : t;
  await Promise.all(
    n.map(async (o) => {
      const i = await O(o);
      et(o, i);
      const a = L.get(o);
      if (typeof a == "number") {
        const c = x(o), d = Math.max(0, Math.min(a, c.length - 1));
        c.length > 0 && T(o, d), L.delete(o);
      } else {
        const c = x(o);
        !c.some((s) => !s.classList.contains("orca-hideable-hidden")) && c.length > 0 && T(o, 0);
      }
    })
  );
}
function C() {
  E || (E = !0, setTimeout(async () => {
    try {
      await at();
    } finally {
      E = !1;
    }
  }, 50));
}
function it() {
  lt(), C(), w = new MutationObserver((t) => {
    for (const e of t) {
      const n = e.target || null;
      if (n && k(n))
        return;
    }
    C();
  }), w.observe(document.body || document.documentElement, {
    childList: !0,
    subtree: !0,
    attributes: !0,
    attributeFilter: ["class"]
  }), window.addEventListener("resize", B, { passive: !0 }), window.addEventListener("beforeunload", () => {
    const t = document.querySelector(`[${h}="true"]`);
    if (!t) return;
    const e = t.getBoundingClientRect();
    try {
      localStorage.setItem(`${f}:${v}`, JSON.stringify({ left: e.left, top: e.top }));
    } catch {
    }
  });
}
function st() {
  w == null || w.disconnect(), w = null, document.querySelectorAll(`[${h}="true"]`).forEach((e) => e.remove());
  const t = document.getElementById("orca-tabs-global-style");
  if (t == null || t.remove(), window.removeEventListener("resize", B), $) {
    try {
      $();
    } catch {
    }
    $ = null;
  }
}
it();
function lt() {
  if (document.getElementById("orca-tabs-global-style")) return;
  const t = document.createElement("style");
  t.id = "orca-tabs-global-style", t.textContent = `
/* 行内布局容器微调 */
.orca-panels-row { overflow: hidden; }

/* 标签栏通用样式（不设置背景色，跟随主题） */
.${g} { }
.${m} { color: inherit; border-radius: 8px; border: none; backdrop-filter: blur(2px); }
.${m}.${y} { }
.${K} { }

/* 漂浮栏交互提示（拖拽） */
.${g}:hover { cursor: move; }

/* 浅色模式 */
@media (prefers-color-scheme: light) {
  .${g} { border-bottom: 1px solid transparent; padding: 0; }
  .${m} { color: #111; background: rgba(0,0,0,0.06); max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; backdrop-filter: blur(2px); }
  .${m}.${y} { background: #e5e7eb; backdrop-filter: blur(2px); }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .${g} { border-bottom: 1px solid transparent; padding: 0; }
  .${m} { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.06); max-width: 170px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; backdrop-filter: blur(2px); }
  .${m}.${y} { background: rgba(255,255,255,0.12); backdrop-filter: blur(2px); }
}

/* 当宿主定义 --ocla-bg == #26272B 或 body 背景为 #26272B 时的适配 */
body[style*="#26272B"],
body:has([style*="--ocla-bg:#26272B"]) .${g} {
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
body[style*="#26272B"],
body:has([style*="--ocla-bg:#26272B"]) .${m} {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(2px);
}
body[style*="#26272B"],
body:has([style*="--ocla-bg:#26272B"]) .${m}.${y} {
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(2px);
}
`, document.head.appendChild(t);
}
export {
  dt as load,
  ut as unload
};
