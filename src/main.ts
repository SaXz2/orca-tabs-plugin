import { setupL10N, t } from "./libs/l10n";
import zhCN from "./translations/zhCN";

let pluginName: string;

export async function load(_name: string) {
  pluginName = _name;

  setupL10N(orca.state.locale, { "zh-CN": zhCN });

  // Your plugin code goes here.
  console.log(t("your plugin code starts here"));
  // 注册设置页：仅一个“重置标签栏位置”按钮
  try {
    await (orca as any).plugins?.setSettingsSchema?.(pluginName, {
      resetBarPosition: {
        label: "重置标签栏位置",
        description: "将标签栏恢复到默认位置（左上角）",
        type: "button",
        onClick: async () => {
          await resetBarPosition();
        },
      },
    });
  } catch {}
  registerTabCommands();

  console.log(`${pluginName} loaded.`);
}

export async function unload() {
  // Clean up any resources used by the plugin here.
  unregisterTabCommands();
  teardownTabUI();
}

// ------------------------------
// Tabs helpers and commands
// ------------------------------

type OpenTabInfo = {
  element: Element;
  blockId: number | null;
  title?: string;
};

function formatDateYMD(d: Date | string | undefined | null): string {
  if (!d) return "";
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

function isInsidePopup(el: Element | null): boolean {
  return !!el?.closest?.(".orca-popup");
}

function getActivePanelRoot(): Element | null {
  // 仅返回不在 .orca-popup 内的激活面板
  const candidates = Array.from(document.querySelectorAll(".orca-panel.active"));
  for (const el of candidates) {
    if (!isInsidePopup(el)) return el as Element;
  }
  return null;
}

function getAllPanels(): Element[] {
  // 仅返回页面主区域的面板，忽略悬浮窗(.orca-popup)里的 .orca-panel
  return Array.from(document.querySelectorAll(".orca-panel")).filter((el) => !isInsidePopup(el));
}

function queryOpenHideables(panelRoot: Element | null): Element[] {
  if (!panelRoot) return [];
  // Both editing and non-editing cached pages are under .orca-panel.active
  // .orca-hideable (editing) and .orca-hideable.orca-hideable-hidden (non-editing)
  const all = Array.from(panelRoot.querySelectorAll(".orca-hideable"));
  // 只保留包含有效编辑器且带有 data-block-id 的缓存页
  return all.filter((el) =>
    !!(el.querySelector(
      ".orca-block-editor[data-block-id]"
    ) as HTMLElement | null)
  );
}

function extractBlockIdFromHideable(hideable: Element): number | null {
  // Find an editor node that carries data-block-id
  const editor = hideable.querySelector(
    ".orca-block-editor[data-block-id]"
  ) as HTMLElement | null;
  if (!editor) return null;
  const raw = editor.getAttribute("data-block-id");
  if (!raw) return null;
  // 仅接受纯数字 ID，避免空串/NaN 等情况
  if (!/^\d+$/.test(raw)) return null;
  const id = parseInt(raw, 10);
  return Number.isFinite(id) ? id : null;
}

async function readOpenTabs(panelRoot?: Element | null): Promise<OpenTabInfo[]> {
  const root = panelRoot ?? getActivePanelRoot();
  const hideables = queryOpenHideables(root);
  let infos: OpenTabInfo[] = hideables
    .map((el) => ({
      element: el,
      blockId: extractBlockIdFromHideable(el),
    }))
    .filter((i) => i.blockId != null);

  const ids = infos
    .map((i) => i.blockId)
    .filter((v): v is number => typeof v === "number");

  if (ids.length > 0) {
    try {
      // Prefer batch fetch when available
      const blocks: Array<{ id: number; text?: string; content?: any; created?: Date | string } | null> = await orca.invokeBackend(
        "get-blocks" as any,
        ids
      );
      const idToTitle = new Map<number, string>();
      const idToCreated = new Map<number, Date | string | undefined>();
      const validIds = new Set<number>();
      blocks?.forEach((blk) => {
        if (blk && typeof blk.id === "number") {
          const plainFromText = toPlainText(blk.text ?? "");
          const fromContent = extractTextFromContent(blk.content);
          idToTitle.set(blk.id, (fromContent || plainFromText));
          idToCreated.set(blk.id, blk.created);
          validIds.add(blk.id);
        }
      });
      infos.forEach((info) => {
        if (info.blockId != null) {
          info.title = idToTitle.get(info.blockId) || undefined;
        }
      });
      // 仅保留后端确认存在的块，避免幽灵标签
      infos = infos.filter((info) => info.blockId != null && validIds.has(info.blockId));

      // 日志块标题：若 text 为空，则从 DOM 中读取日历图标与紧随其后的文本
      for (const info of infos) {
        if (!info.blockId) continue;
        if (info.title && info.title.trim()) continue;
        const container = info.element.querySelector(
          ".orca-block.orca-container"
        ) as HTMLElement | null;
        const isJournal = container?.getAttribute("data-type") === "journal";
        if (isJournal) {
          const titleFromDom = extractJournalTitleFromDOM(container);
          if (titleFromDom) info.title = titleFromDom;
        }
      }
    } catch (e) {
      console.warn("get-blocks failed, fallback to single fetches", e);
      const kept: OpenTabInfo[] = [];
      for (const info of infos) {
        if (info.blockId != null) {
          try {
            const blk: { text?: string; content?: any } = await orca.invokeBackend(
              "get-block" as any,
              info.blockId
            );
            let title = extractTextFromContent(blk?.content);
            if (!title) title = toPlainText(blk?.text ?? "");
            if (!title) {
              const container = info.element.querySelector(
                ".orca-block.orca-container"
              ) as HTMLElement | null;
              const isJournal = container?.getAttribute("data-type") === "journal";
              if (isJournal) {
                title = extractJournalTitleFromDOM(container) || "";
              }
            }
            info.title = title || undefined;
            // 只有成功取到块的保留
            kept.push(info);
          } catch (err) {
            // 跳过失败项，避免未命名幽灵标签
          }
        }
      }
      infos = kept;
    }
  }

  return infos;
}

function removeHideableAt(index: number, panelRoot?: Element | null): boolean {
  const root = panelRoot ?? getActivePanelRoot();
  const hideables = queryOpenHideables(root);
  // 不允许关闭最后一个标签
  if (hideables.length <= 1) return false;
  if (index < 0 || index >= hideables.length) return false;
  const el = hideables[index];
  el.parentElement?.removeChild(el);
  return true;
}

async function switchToNextPanel(): Promise<void> {
  await orca.commands.invokeCommand("core.switchToNextPanel");
}

async function switchToPreviousPanel(): Promise<void> {
  await orca.commands.invokeCommand("core.switchToPreviousPanel");
}

async function closeOtherPanels(): Promise<void> {
  await orca.commands.invokeCommand("core.closeOtherPanels");
}

// Registered commands
const registeredCommandIds: string[] = [];

function register(id: string, fn: (...args: any[]) => any) {
  // Provide a label as required by API signature
  orca.commands.registerCommand(id, fn, id);
  registeredCommandIds.push(id);
}

function registerTabCommands() {
  // List open tabs with titles and blockIds
  register(`${pluginName}.tabs.list`, async () => {
    const active = getActivePanelRoot();
    const tabs = await readOpenTabs(active);
    return tabs.map((t, i) => ({ index: i, blockId: t.blockId, title: t.title }));
  });

  // tabs.closeAt 已移除（按用户要求关闭标签删除功能）

  // Convenience: close others via core API
  register(`${pluginName}.tabs.closeOthers`, async () => {
    await closeOtherPanels();
  });

  // Switch
  register(`${pluginName}.tabs.switchNext`, async () => {
    await switchToNextPanel();
  });
  register(`${pluginName}.tabs.switchPrev`, async () => {
    await switchToPreviousPanel();
  });
}

function unregisterTabCommands() {
  for (const id of registeredCommandIds) {
    try {
      orca.commands.unregisterCommand(id);
    } catch {}
  }
}

// ------------------------------
// UI: Render tabs bar for each panel
// ------------------------------

const TAB_BAR_ATTR = "data-orca-tabs-bar";
const TAB_BAR_CLASS = "orca-tabs-bar";
const TAB_ITEM_CLASS = "orca-tab";
const TAB_ITEM_ACTIVE_CLASS = "is-active";
const TAB_CLOSE_CLASS = "orca-tab-close";
const DEBUG_LOG = false;
let panelObserver: MutationObserver | null = null;
let refreshScheduled = false;
const desiredActiveIndex = new WeakMap<Element, number>();
const STORAGE_KEY_BAR_POS = "tabsBarPosition";
let dragCleanup: (() => void) | null = null;

function isTabsFeatureEnabled(): boolean {
  // 当 .orca-panel 超过一个时不启用标签功能
  try {
    // 忽略 .orca-popup 下的面板，仅统计主界面面板
    const count = Array.from(document.querySelectorAll(".orca-panel")).filter((el) => !isInsidePopup(el)).length;
    return count <= 1;
  } catch {
    return true;
  }
}

function ensureTabBar(panel: Element): HTMLElement {
  // 全局唯一的漂浮标签栏，固定在窗口内可拖拽
  let bar = document.querySelector(`[${TAB_BAR_ATTR}="true"]`) as HTMLElement | null;
  if (!bar) {
    bar = document.createElement("div");
    bar.setAttribute(TAB_BAR_ATTR, "true");
    bar.classList.add(TAB_BAR_CLASS);
    bar.style.display = "flex";
    bar.style.gap = "6px";
    bar.style.alignItems = "center";
    // 漂浮定位 & 拖拽
    bar.style.position = "fixed";
    bar.style.top = "12px";
    bar.style.left = "12px";
    bar.style.zIndex = "9999";
    bar.style.userSelect = "none";
    bar.style.cursor = "default";
    (bar.style as any)["-webkit-app-region"] = "no-drag";
    document.body.appendChild(bar);
    // 载入已保存位置
    restoreBarPosition(bar).catch(() => {});
    // 启用拖拽
    enableDrag(bar);
  }
  return bar;
}

function extractJournalTitleFromDOM(container: HTMLElement): string {
  // 目标结构示例：
  // <div class="orca-repr-main-content" contenteditable="false">
  //   <button class="orca-button plain orca-repr-journal-btn" ...>...</button>
  //   <i class="ti ti-calendar orca-repr-journal-calendar"></i>
  //   2025年9月11日
  //   <button class="orca-button plain orca-repr-journal-btn" ...>...</button>
  // </div>
  const main = container.querySelector(
    ".orca-repr-main-content"
  ) as HTMLElement | null;
  if (!main) return "";
  const iconEl = main.querySelector(".ti.ti-calendar.orca-repr-journal-calendar") as HTMLElement | null;
  // 寻找紧随图标后的第一个文本节点
  let text = "";
  if (iconEl && iconEl.parentNode) {
    let n: ChildNode | null = iconEl.nextSibling;
    while (n) {
      if (n.nodeType === Node.TEXT_NODE) {
        const v = (n.textContent || "").trim();
        if (v) { text = v; break; }
      }
      if (n.nodeType === Node.ELEMENT_NODE) {
        const el = n as Element;
        // 跳过左右切换按钮
        if (el.matches(".orca-button.plain.orca-repr-journal-btn")) {
          n = n.nextSibling;
          continue;
        }
        // 若遇到其它元素，尝试其内部第一个文本
        const innerText = (el.textContent || "").trim();
        if (innerText) { text = innerText; break; }
      }
      n = n.nextSibling;
    }
  }
  if (iconEl && text) return `📅 ${text}`;
  return text || "";
}

// 文本提取：忽略内联/标签内容，仅取纯文本
function toPlainText(input: string): string {
  const div = document.createElement("div");
  div.innerHTML = input || "";
  return (div.textContent || "").trim();
}

// 从 content 结构中提取可读文本（仅取普通文本片段）
function extractTextFromContent(content: any): string {
  if (!content) return "";
  const pieces: string[] = [];
  const walk = (node: any) => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const n of node) walk(n);
      return;
    }
    // 常见文本片段：{ t: "t", v: "..." }
    if (typeof node === "object" && node.t === "t" && typeof node.v === "string") {
      pieces.push(node.v);
      return;
    }
    // 其它片段忽略（如标签、引用等）
    if (typeof node === "object" && node.content) walk(node.content);
  };
  walk(content);
  return pieces.join("").trim();
}

function renderTabsForPanel(panel: Element, tabs: OpenTabInfo[]) {
  const bar = ensureTabBar(panel);
  // Clear existing
  while (bar.firstChild) bar.removeChild(bar.firstChild);

  const hideables = queryOpenHideables(panel);
  let activeIndex = hideables.findIndex((h) => !h.classList.contains("orca-hideable-hidden"));
  // 不再强制默认第一个为激活，避免无内容的幽灵标签被点亮
  if (activeIndex < 0) activeIndex = -1;
  const totalTabs = tabs.length;

  tabs.forEach((tab, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = tab.title && tab.title.trim().length > 0 ? tab.title : `未命名 ${tab.blockId ?? ""}`;
    btn.title = tab.title || "";
    btn.classList.add(TAB_ITEM_CLASS);
    btn.style.padding = "4px 8px";
    // 外观交由 CSS 控制，避免被主题覆盖
    if (index === activeIndex) btn.classList.add(TAB_ITEM_ACTIVE_CLASS);
    else btn.classList.remove(TAB_ITEM_ACTIVE_CLASS);
    btn.style.cursor = "pointer";

    btn.addEventListener("click", () => {
      try {
        switchTabInPanel(panel, index);
      } catch (e) {
        console.warn("Failed to switch tab", e);
      }
    });

    // 已移除关闭按钮（按用户要求）
    bar.appendChild(btn);
  });
}

// ------------------------------
// Draggable floating bar helpers
// ------------------------------

async function saveBarPosition(pos: { left: number; top: number }) {
  try { await (orca as any).plugins?.setData?.(pluginName, STORAGE_KEY_BAR_POS, pos); } catch {}
  try { localStorage.setItem(`${pluginName}:${STORAGE_KEY_BAR_POS}`, JSON.stringify(pos)); } catch {}
}

async function restoreBarPosition(bar: HTMLElement) {
  try {
    // 先用本地存储（同步）快速恢复，避免闪到左上角
    try {
      const raw = localStorage.getItem(`${pluginName}:${STORAGE_KEY_BAR_POS}`);
      if (raw) {
        const lp = JSON.parse(raw);
        if (lp && typeof lp.left === "number" && typeof lp.top === "number") {
          applyBarPosition(bar, lp.left, lp.top);
        }
      }
    } catch {}
    // 再尝试插件数据（异步），若存在则覆盖
    const pos = await (orca as any).plugins?.getData?.(pluginName, STORAGE_KEY_BAR_POS);
    if (pos && typeof pos.left === "number" && typeof pos.top === "number") {
      applyBarPosition(bar, pos.left, pos.top);
    }
    // 无任何记录则夹取默认
    clampBarPositionOnResize();
  } catch {}
}

function applyBarPosition(bar: HTMLElement, left: number, top: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const rect = bar.getBoundingClientRect();
  const cl = Math.min(Math.max(0, left), Math.max(0, vw - rect.width));
  const ct = Math.min(Math.max(0, top), Math.max(0, vh - rect.height));
  bar.style.left = `${cl}px`;
  bar.style.top = `${ct}px`;
}

function enableDrag(bar: HTMLElement) {
  let startX = 0, startY = 0, origLeft = 0, origTop = 0, dragging = false;
  const onDown = (e: MouseEvent) => {
    if (e.button !== 0) return;
    dragging = true;
    const rect = bar.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    origLeft = rect.left; origTop = rect.top;
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    e.preventDefault();
  };
  const onMove = (e: MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    applyBarPosition(bar, origLeft + dx, origTop + dy);
  };
  const onUp = async () => {
    if (!dragging) return;
    dragging = false;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
    const rect = bar.getBoundingClientRect();
    await saveBarPosition({ left: rect.left, top: rect.top });
  };
  bar.addEventListener("mousedown", onDown);
  dragCleanup = () => {
    bar.removeEventListener("mousedown", onDown);
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onUp);
  };
}

function clampBarPositionOnResize() {
  const bar = document.querySelector(`[${TAB_BAR_ATTR}="true"]`) as HTMLElement | null;
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  applyBarPosition(bar, rect.left, rect.top);
}

async function resetBarPosition() {
  try {
    await (orca as any).plugins?.removeData?.(pluginName, STORAGE_KEY_BAR_POS);
  } catch {}
  const bar = document.querySelector(`[${TAB_BAR_ATTR}="true"]`) as HTMLElement | null;
  if (bar) {
    bar.style.left = "12px";
    bar.style.top = "12px";
  }
}

function switchTabInPanel(panel: Element, index: number) {
  const hideables = queryOpenHideables(panel);
  if (index < 0 || index >= hideables.length) return;
  // 只切换属于该 panel 的有效 hideable
  for (let i = 0; i < hideables.length; i++) {
    const el = hideables[i];
    if (i === index) el.classList.remove("orca-hideable-hidden");
    else el.classList.add("orca-hideable-hidden");
  }
  scheduleRefresh();
}

// 关闭功能已停用，保留函数但不再被调用
function findInternalCloseButton(hideable: Element): HTMLElement | null {
  const candidates = [
    "button[title*='关闭']",
    "button[aria-label*='关闭']",
    "button[title*='close' i]",
    "button[aria-label*='close' i]",
    "[data-action*='close' i]",
    "[data-cmd*='close' i]",
    "[data-orca-action*='close' i]",
    "button.orca-editor-close",
    ".close",
    "i.ti.ti-x",
  ];
  // 在 hideable 内与其上层（到 panel）范围内尝试查找
  let scope: Element | null = hideable;
  while (scope) {
    for (const sel of candidates) {
      const el = scope.querySelector(sel) as HTMLElement | null;
      if (el) {
        if (el.tagName !== "BUTTON") {
          const btn = el.closest("button") as HTMLElement | null;
          if (btn) return btn;
        }
        return el;
      }
    }
    if (scope.classList.contains("orca-panel")) break;
    scope = scope.parentElement;
  }
  return null;
}

// 关闭功能已停用，保留函数但不再被调用
function closeTabViaApp(panel: Element, index: number): boolean {
  const hideables = queryOpenHideables(panel);
  if (hideables.length <= 1) return false;
  if (index < 0 || index >= hideables.length) return false;
  // 记录期望的下一个激活页
  const nextIndex = index < hideables.length - 1 ? index : Math.max(0, hideables.length - 2);
  desiredActiveIndex.set(panel, nextIndex);
  const target = hideables[index];
  // 优先在不切换的情况下寻找关闭控件
  let btn = findInternalCloseButton(target);
  if (!btn) {
    // 找不到则再激活后重试一次
    switchTabInPanel(panel, index);
    btn = findInternalCloseButton(target);
  }
  if (btn) {
    // 仅点击内置关闭控件，避免破坏内部状态
    btn.click();
    setTimeout(() => scheduleRefresh(), 120);
    return true;
  }
  // 找不到内置关闭控制则不做任何删除，避免状态不同步导致崩溃
  if (DEBUG_LOG) console.warn("No internal close control found; skip close.");
  return false;
}

async function refreshAllPanels() {
  const panels = getAllPanels();
  if (!isTabsFeatureEnabled()) {
    // 功能关闭：清理所有已渲染的标签栏
    panels.forEach((panel) => {
      panel.querySelectorAll(`[${TAB_BAR_ATTR}="true"]`).forEach((el) => el.remove());
    });
    return;
  }
  const activePanel = getActivePanelRoot();
  const targets = activePanel ? [activePanel] : panels;
  await Promise.all(
    targets.map(async (panel) => {
      const tabs = await readOpenTabs(panel);
      renderTabsForPanel(panel, tabs);
      // 若存在期望激活索引，则在渲染后应用
      const desired = desiredActiveIndex.get(panel);
      if (typeof desired === "number") {
        const hideables = queryOpenHideables(panel);
        const clamped = Math.max(0, Math.min(desired, hideables.length - 1));
        if (hideables.length > 0) switchTabInPanel(panel, clamped);
        desiredActiveIndex.delete(panel);
      } else {
        // 确保至少有一个显示的页
        const hideables = queryOpenHideables(panel);
        const anyVisible = hideables.some((h) => !h.classList.contains("orca-hideable-hidden"));
        if (!anyVisible && hideables.length > 0) switchTabInPanel(panel, 0);
      }
    })
  );
}

function scheduleRefresh() {
  if (refreshScheduled) return;
  refreshScheduled = true;
  setTimeout(async () => {
    try {
      await refreshAllPanels();
    } finally {
      refreshScheduled = false;
    }
  }, 50);
}

function setupTabUI() {
  // Initial render
  injectGlobalStyles();
  scheduleRefresh();
  // Observe document for panel or hideable changes
  panelObserver = new MutationObserver((mutations) => {
    // 若变化发生在 .orca-popup 内，忽略之，避免悬浮内容触发重绘
    for (const m of mutations) {
      const target = (m.target as Element) || null;
      if (target && isInsidePopup(target)) {
        return;
      }
    }
    scheduleRefresh();
  });
  panelObserver.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("resize", clampBarPositionOnResize, { passive: true });
  window.addEventListener("beforeunload", () => {
    const bar = document.querySelector(`[${TAB_BAR_ATTR}="true"]`) as HTMLElement | null;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    try { localStorage.setItem(`${pluginName}:${STORAGE_KEY_BAR_POS}`, JSON.stringify({ left: rect.left, top: rect.top })); } catch {}
  });
}

function teardownTabUI() {
  panelObserver?.disconnect();
  panelObserver = null;
  // Remove all tab bars
  document.querySelectorAll(`[${TAB_BAR_ATTR}="true"]`).forEach((el) => el.remove());
  // Remove injected style
  const style = document.getElementById("orca-tabs-global-style");
  style?.remove();
  window.removeEventListener("resize", clampBarPositionOnResize);
  if (dragCleanup) { try { dragCleanup(); } catch {} dragCleanup = null; }
}

// Kick off UI after plugin starts
setupTabUI();

function injectGlobalStyles() {
  if (document.getElementById("orca-tabs-global-style")) return;
  const style = document.createElement("style");
  style.id = "orca-tabs-global-style";
  style.textContent = `
/* 行内布局容器微调 */
.orca-panels-row { overflow: hidden; }

/* 标签栏通用样式（不设置背景色，跟随主题） */
.${TAB_BAR_CLASS} { }
.${TAB_ITEM_CLASS} { color: inherit; border-radius: 8px; border: none ; }
.${TAB_ITEM_CLASS}.${TAB_ITEM_ACTIVE_CLASS} { }
.${TAB_CLOSE_CLASS} { }

/* 漂浮栏交互提示（拖拽） */
.${TAB_BAR_CLASS}:hover { cursor: move; }

/* 浅色模式 */
@media (prefers-color-scheme: light) {
  .${TAB_BAR_CLASS} { border-bottom: 1px solid transparent; padding: 0; }
  .${TAB_ITEM_CLASS} { color: #111; background: rgba(0,0,0,0.06); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .${TAB_ITEM_CLASS}.${TAB_ITEM_ACTIVE_CLASS} { background: #e5e7eb; }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .${TAB_BAR_CLASS} { border-bottom: 1px solid transparent; padding: 0; }
  .${TAB_ITEM_CLASS} { color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.06); max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .${TAB_ITEM_CLASS}.${TAB_ITEM_ACTIVE_CLASS} { background: rgba(255,255,255,0.12); }
}

/* 当宿主定义 --ocla-bg == #26272B 或 body 背景为 #26272B 时的适配 */
body[style*="#26272B"],
body:has([style*="--ocla-bg:#26272B"]) .${TAB_BAR_CLASS} {
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
body[style*="#26272B"],
body:has([style*="--ocla-bg:#26272B"]) .${TAB_ITEM_CLASS} {
  background: rgba(255,255,255,0.06);
}
body[style*="#26272B"],
body:has([style*="--ocla-bg:#26272B"]) .${TAB_ITEM_CLASS}.${TAB_ITEM_ACTIVE_CLASS} {
  background: rgba(255,255,255,0.12);
}
`;
  document.head.appendChild(style);
}
