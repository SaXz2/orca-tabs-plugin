import { setupL10N, t } from "./libs/l10n";
import zhCN from "./translations/zhCN";
import { format, isToday, isYesterday, isTomorrow } from 'date-fns';
import { zhCN as zhCNLocale, enUS as enUSLocale } from 'date-fns/locale';

// 定义配置常量
const AppKeys = {
  CachedEditorNum: 13,
  JournalDateFormat: 12
} as const;

// 定义属性类型常量
const PropType = {
  JSON: 0,
  Text: 1
} as const;

let pluginName: string;

interface TabInfo {
  blockId: string;
  panelId: string;
  title: string;
  color?: string;
  icon?: string;
  isJournal?: boolean;
  isPinned?: boolean;
  order: number;
  scrollPosition?: { x: number; y: number }; // 滚动位置
}

interface TabPosition {
  x: number;
  y: number;
}

interface PanelTabsData {
  tabs: TabInfo[];
  lastActive: number; // 时间戳
}

class OrcaTabsPlugin {
  private firstPanelTabs: TabInfo[] = []; // 只存储第一个面板的标签数据
  private currentPanelId: string = '';
  private panelIds: string[] = []; // 所有面板ID列表
  private currentPanelIndex = 0; // 当前面板索引
  private tabContainer: HTMLElement | null = null;
  private cycleSwitcher: HTMLElement | null = null;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private maxTabs = 10; // 默认值，会从设置中读取
  private position: TabPosition = { x: 50, y: 50 };
  private monitoringInterval: number | null = null;
  private clickListener: ((e: Event) => void) | null = null;
  private keyListener: ((e: KeyboardEvent) => void) | null = null;
  private updateDebounceTimer: number | null = null; // 防抖计时器
  private lastUpdateTime: number = 0; // 上次更新时间
  private isUpdating: boolean = false; // 是否正在更新
  private isInitialized: boolean = false; // 是否已完成初始化
  
  // 拖拽状态管理
  private draggingTab: TabInfo | null = null; // 当前正在拖拽的标签
  private dragEndListener: (() => void) | null = null; // 全局拖拽结束监听器
  private swapDebounceTimer: number | null = null; // 拖拽交换防抖计时器
  private lastSwapTarget: string | null = null; // 上次交换的目标标签ID，防止重复交换
  private dragOverTimer: number | null = null; // 拖拽悬停计时器
  private isDragOverActive = false; // 是否正在拖拽悬停状态
  private themeChangeListener: (() => void) | null = null; // 主题变化监听器
  private lastPanelDiscoveryTime = 0; // 上次面板发现时间
  private panelDiscoveryCache: { panelIds: string[], timestamp: number } | null = null; // 面板发现缓存
  private scrollListener: (() => void) | null = null; // 滚动监听器
  
  // 已关闭标签页跟踪
  private closedTabs: Set<string> = new Set(); // 已关闭的标签页blockId集合

  async init() {
    // 从设置中读取最大标签数
    try {
      this.maxTabs = orca.state.settings[AppKeys.CachedEditorNum] || 10;
    } catch (e) {
      console.warn("无法读取最大标签数设置，使用默认值10");
    }

    // 恢复保存的位置
    this.restorePosition();
    
    // 发现所有面板
    this.discoverPanels();
    
    // 面板是动态创建的，不需要延迟检查
    // 监听器会自动检测新面板的创建
    
    // 恢复第一个面板的标签页数据
    this.restoreFirstPanelTabs();
    
    // 恢复已关闭标签列表
    this.restoreClosedTabs();
    
    // 检查是否有持久化的数据
    const hasPersistentData = this.firstPanelTabs.length > 0;
    
    if (!hasPersistentData) {
      // 只有在没有持久化数据时才扫描第一个面板（首次使用）
      console.log("首次使用，扫描第一个面板创建标签页");
      await this.scanFirstPanel();
    } else {
      // 有持久化数据，使用固化的标签页状态
      console.log("检测到持久化数据，使用固化的标签页状态");
    }
    
    // 创建标签页UI
    await this.createTabsUI();
    
    // 监听DOM变化（只监听第一个面板的新增）
    this.observeChanges();
    
    // 监听窗口大小变化
    this.observeWindowResize();
    
    // 启动主动的面板状态检测
    this.startActiveMonitoring();
    
    // 设置全局拖拽结束监听器
    this.setupDragEndListener();
    
    // 监听主题变化
    this.setupThemeChangeListener();
    
    // 设置滚动监听器
    this.setupScrollListener();
    
    // 标记初始化完成
    this.isInitialized = true;
    console.log("✅ 插件初始化完成");
  }

  /**
   * 设置主题变化监听器
   */
  private setupThemeChangeListener() {
    // 移除之前的监听器
    if (this.themeChangeListener) {
      this.themeChangeListener();
      this.themeChangeListener = null;
    }

    // 使用Orca广播API监听主题变化
    const handleThemeChange = (theme: string) => {
      console.log("检测到主题变化，重新渲染标签页颜色:", theme);
      console.log("当前主题模式:", orca.state.themeMode);
      
      // 延迟执行，确保主题切换完成
      setTimeout(() => {
        console.log("开始重新渲染标签页，当前主题:", orca.state.themeMode);
        this.debouncedUpdateTabsUI();
      }, 200); // 增加延迟时间
    };

    // 注册主题变化监听器
    try {
      orca.broadcasts.registerHandler("core.themeChanged", handleThemeChange);
      console.log("主题变化监听器注册成功");
    } catch (error) {
      console.error("主题变化监听器注册失败:", error);
    }

    // 添加备用的主题检测机制
    let lastThemeMode = orca.state.themeMode;
    const checkThemeChange = () => {
      const currentThemeMode = orca.state.themeMode;
      if (currentThemeMode !== lastThemeMode) {
        console.log("备用检测：主题从", lastThemeMode, "切换到", currentThemeMode);
        lastThemeMode = currentThemeMode;
        setTimeout(() => {
          this.debouncedUpdateTabsUI();
        }, 200);
      }
    };

    // 每500ms检查一次主题变化（备用机制）
    const themeCheckInterval = setInterval(checkThemeChange, 500);

    // 保存清理函数
    this.themeChangeListener = () => {
      orca.broadcasts.unregisterHandler("core.themeChanged", handleThemeChange);
      clearInterval(themeCheckInterval);
    };
  }

  /**
   * 设置滚动监听器
   */
  private setupScrollListener() {
    // 移除之前的监听器
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }

    // 创建滚动监听器
    let scrollTimeout: number | null = null;
    const handleScroll = () => {
      // 防抖处理，避免频繁记录
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const currentActiveTab = this.getCurrentActiveTab();
        if (currentActiveTab) {
          this.recordScrollPosition(currentActiveTab);
        }
      }, 300); // 300ms防抖
    };

    // 监听所有可能的滚动容器
    const scrollContainers = document.querySelectorAll('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container, .orca-panel, body, html');
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleScroll, { passive: true });
    });

    // 保存清理函数
    this.scrollListener = () => {
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleScroll);
      });
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }

  /**
   * 设置全局拖拽结束监听器
   */
  setupDragEndListener() {
    this.dragEndListener = () => {
      this.draggingTab = null;
      this.clearDragVisualFeedback();
      console.log("🔄 全局拖拽结束，清除拖拽状态");
    };
    document.addEventListener("dragend", this.dragEndListener);
  }

  /**
   * 清除拖拽视觉反馈
   */
  clearDragVisualFeedback() {
    if (this.tabContainer) {
      // 移除所有拖拽相关的CSS类
      const tabs = this.tabContainer.querySelectorAll('.orca-tab');
      tabs.forEach(tab => {
        tab.removeAttribute('data-dragging');
        tab.removeAttribute('data-drag-over');
        tab.classList.remove('dragging', 'drag-over');
      });
      
      // 移除容器拖拽状态
      this.tabContainer.removeAttribute('data-dragging');
    }
  }

  /**
   * 添加拖拽悬停效果（优化版）
   */
  addDragOverEffect(tabElement: HTMLElement) {
    // 检查是否已经有拖拽悬停效果
    if (tabElement.getAttribute('data-drag-over') === 'true') {
      return; // 避免重复添加
    }
    
    tabElement.setAttribute('data-drag-over', 'true');
    tabElement.classList.add('drag-over');
    
    // 清除之前的定时器
    if (this.dragOverTimer) {
      clearTimeout(this.dragOverTimer);
    }
  }

  /**
   * 移除拖拽悬停效果（优化版）
   */
  removeDragOverEffect(tabElement: HTMLElement) {
    // 检查是否真的有拖拽悬停效果
    if (tabElement.getAttribute('data-drag-over') !== 'true') {
      return; // 避免重复移除
    }
    
    tabElement.removeAttribute('data-drag-over');
    tabElement.classList.remove('drag-over');
    
    // 清除定时器
    if (this.dragOverTimer) {
      clearTimeout(this.dragOverTimer);
      this.dragOverTimer = null;
    }
  }

  /**
   * 防抖的标签交换函数（修复版）
   */
  debouncedSwapTab(targetTab: TabInfo, draggingTab: TabInfo) {
    // 防止重复交换同一个目标
    if (this.lastSwapTarget === targetTab.blockId) {
      return;
    }
    
    // 立即执行交换，不使用延迟
      this.swapTab(targetTab, draggingTab);
    this.lastSwapTarget = targetTab.blockId;
  }

  /**
   * 交换两个标签的位置（优化版）
   */
  swapTab(targetTab: TabInfo, draggingTab: TabInfo) {
    if (this.currentPanelIndex !== 0) {
      console.log("只有第一个面板支持拖拽排序");
      return;
    }
    
    const targetIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === targetTab.blockId);
    const draggingIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === draggingTab.blockId);
    
    if (targetIndex !== -1 && draggingIndex !== -1 && targetIndex !== draggingIndex) {
      // 智能交换：根据拖拽方向决定交换策略
      const isMovingRight = draggingIndex < targetIndex;
      
      if (isMovingRight) {
        // 向右拖拽：将拖拽标签插入到目标标签的右边
        const draggedTab = this.firstPanelTabs.splice(draggingIndex, 1)[0];
        const newTargetIndex = targetIndex > draggingIndex ? targetIndex - 1 : targetIndex;
        this.firstPanelTabs.splice(newTargetIndex + 1, 0, draggedTab);
      } else {
        // 向左拖拽：将拖拽标签插入到目标标签的左边
        const draggedTab = this.firstPanelTabs.splice(draggingIndex, 1)[0];
        this.firstPanelTabs.splice(targetIndex, 0, draggedTab);
      }
      
      // 更新order属性
      this.firstPanelTabs.forEach((tab, index) => {
        tab.order = index;
      });
      
      console.log(`🔄 标签交换: ${draggingTab.title} -> ${targetTab.title} (${isMovingRight ? '右移' : '左移'})`);
      
      // 重新排序（保持固定标签在前）
      this.sortTabsByPinStatus();
      
      // 优化：拖拽时只保存数据，不立即更新UI（避免干扰拖拽体验）
      this.saveFirstPanelTabs();
      
      // 如果不是正在拖拽，立即更新UI；否则延迟更新
      if (!this.draggingTab) {
        this.debouncedUpdateTabsUI();
      }
    }
  }

  /**
   * 发现所有面板
   */
  discoverPanels() {
    const now = Date.now();
    
    // 如果距离上次发现不到1秒，且缓存有效，直接使用缓存
    if (now - this.lastPanelDiscoveryTime < 1000 && this.panelDiscoveryCache) {
      const cacheAge = now - this.panelDiscoveryCache.timestamp;
      if (cacheAge < 1000) { // 缓存1秒内有效
        this.panelIds = [...this.panelDiscoveryCache.panelIds];
        console.log("📋 使用面板发现缓存，面板ID列表:", this.panelIds);
        return;
      }
    }
    
    console.log("🔍 开始发现面板...");
    this.lastPanelDiscoveryTime = now;
    
    const mainSection = document.querySelector('section#main');
    if (!mainSection) {
      console.warn("❌ 未找到 section#main");
      return;
    }
    console.log("✅ 找到 section#main");

    const panelsRow = mainSection.querySelector('.orca-panels-row');
    if (!panelsRow) {
      console.warn("❌ 未找到 .orca-panels-row");
      return;
    }
    console.log("✅ 找到 .orca-panels-row");

    // 检查所有可能的面板选择器
    const allPanels = document.querySelectorAll('.orca-panel');
    console.log(`🔍 在整个文档中找到 ${allPanels.length} 个 .orca-panel 元素`);
    
    const panels = panelsRow.querySelectorAll('.orca-panel');
    this.panelIds = [];
    
    console.log(`🔍 在 .orca-panels-row 中找到 ${panels.length} 个 .orca-panel 元素`);
    
    // 详细检查每个面板
    panels.forEach((panel, index) => {
      const panelId = panel.getAttribute('data-panel-id');
      const isActive = panel.classList.contains('active');
      const isVisible = (panel as HTMLElement).offsetParent !== null; // 检查是否可见
      const rect = panel.getBoundingClientRect();
      const isMenuPanel = this.isMenuPanel(panel);
      
      console.log(`面板 ${index + 1}: ID=${panelId}, 激活=${isActive}, 可见=${isVisible}, 菜单=${isMenuPanel}, 位置=(${rect.left}, ${rect.top})`);
      
      if (panelId && !isMenuPanel) {
        this.panelIds.push(panelId);
      } else if (isMenuPanel) {
        console.log(`🚫 跳过菜单面板: ${panelId}`);
      } else {
        console.warn(`❌ 面板 ${index + 1} 没有 data-panel-id 属性`);
      }
    });
    
    // 如果面板数量不足，尝试其他方法
    if (panels.length < 2 && allPanels.length >= 2) {
      console.log("⚠️ 在 .orca-panels-row 中面板不足，尝试从整个文档中查找...");
      
      allPanels.forEach((panel, index) => {
        const panelId = panel.getAttribute('data-panel-id');
        const isMenuPanel = this.isMenuPanel(panel);
        if (panelId && !this.panelIds.includes(panelId) && !isMenuPanel) {
          this.panelIds.push(panelId);
          console.log(`➕ 从文档中找到额外面板: ID=${panelId}`);
        } else if (isMenuPanel) {
          console.log(`🚫 跳过菜单面板: ${panelId}`);
        }
      });
    }
    
    // 更新当前面板信息，但保持激活状态
    if (this.panelIds.length > 0) {
      // 检查当前激活的面板是否还在列表中
      const activePanel = document.querySelector('.orca-panel.active');
      if (activePanel) {
        const activePanelId = activePanel.getAttribute('data-panel-id');
        const activeIndex = this.panelIds.indexOf(activePanelId || '');
        
        if (activeIndex !== -1) {
          // 当前激活的面板还在列表中，保持其状态
          this.currentPanelId = activePanelId || '';
          this.currentPanelIndex = activeIndex;
        } else {
          // 当前激活的面板不在列表中，设置为第一个面板
          this.currentPanelId = this.panelIds[0];
          this.currentPanelIndex = 0;
        }
      } else {
        // 没有激活的面板，设置为第一个面板
        this.currentPanelId = this.panelIds[0];
        this.currentPanelIndex = 0;
      }
    }
    
    console.log(`🎯 最终发现 ${this.panelIds.length} 个面板，面板ID列表:`, this.panelIds);
    console.log(`🎯 当前面板: ${this.currentPanelId} (索引: ${this.currentPanelIndex})`);
    
    // 更新缓存
    this.panelDiscoveryCache = {
      panelIds: [...this.panelIds],
      timestamp: now
    };
    
    // 如果只有一个面板，显示提示
    if (this.panelIds.length === 1) {
      console.log("ℹ️ 只有一个面板，不会显示切换按钮");
    } else if (this.panelIds.length > 1) {
      console.log(`✅ 发现 ${this.panelIds.length} 个面板，将创建循环切换器`);
    }
  }

  /**
   * 检查是否为菜单面板（需要排除）
   */
  isMenuPanel(panel: Element): boolean {
    // 检查是否包含菜单类
    if (panel.classList.contains('orca-menu') || 
        panel.classList.contains('orca-recents-menu')) {
      return true;
    }
    
    // 检查父元素是否包含菜单类
    const parent = panel.parentElement;
    if (parent && (parent.classList.contains('orca-menu') || 
                   parent.classList.contains('orca-recents-menu'))) {
      return true;
    }
    
    return false;
  }

  /**
   * 扫描第一个面板的标签页（只读取当前激活的页面）
   */
  async scanFirstPanel() {
    if (this.panelIds.length === 0) return;
    
    const firstPanelId = this.panelIds[0];
    const panel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!panel) return;

    // 只获取当前激活的页面（最上面的）
    const activeBlockEditor = panel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) {
      console.log("第一个面板中没有找到激活的块编辑器");
      return;
    }

    const blockId = activeBlockEditor.getAttribute('data-block-id');
    if (!blockId) {
      console.log("激活的块编辑器没有blockId");
      return;
    }

    // 获取当前激活页面的标签信息
    const tabInfo = await this.getTabInfo(blockId, firstPanelId, 0);
    if (tabInfo) {
      console.log(`📋 扫描第一个面板，找到激活页面: "${tabInfo.title}"`);
      
      // 直接设置为第一个面板的标签页（只显示当前激活的页面）
      this.firstPanelTabs = [tabInfo];
      
      // 保存到持久化存储
      this.saveFirstPanelTabs();
      
      await this.updateTabsUI();
    } else {
      console.log("无法获取激活页面的标签信息");
    }
  }

  /**
   * 合并第一个面板的标签页（现在只处理单个标签页）
   */
  mergeFirstPanelTabs(newTabs: TabInfo[]) {
    // 由于现在只处理当前激活的页面，这个方法主要用于兼容性
    // 实际逻辑已经在scanFirstPanel和checkFirstPanelBlocks中处理
    if (newTabs.length > 0) {
      console.log(`📋 合并标签页: ${newTabs.length} 个标签页`);
      // 应用排序逻辑（固定标签在前，非固定在后）
      this.sortTabsByPinStatus();
    }
  }

  /**
   * 按固定状态排序标签（固定标签在前，非固定在后）
   */
  sortTabsByPinStatus() {
    this.firstPanelTabs.sort((a, b) => {
      // 固定标签在前
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // 相同固定状态的标签保持原有顺序
      return a.order - b.order;
    });
  }

  /**
   * 查找最后一个非固定标签页的索引
   */
  findLastNonPinnedTabIndex(): number {
    // 从后往前查找第一个非固定标签页
    for (let i = this.firstPanelTabs.length - 1; i >= 0; i--) {
      if (!this.firstPanelTabs[i].isPinned) {
        return i;
      }
    }
    return -1; // 没有找到非固定标签页
  }

  /**
   * 专门格式化日记日期（用于标签显示）
   */
  formatJournalDate(date: Date): string {
    try {
      // 获取用户的日期格式设置
      let dateFormat = orca.state.settings[AppKeys.JournalDateFormat];
      
      // 如果没有设置或设置无效，使用默认格式
      if (!dateFormat || typeof dateFormat !== 'string') {
        const locale = orca.state.locale || 'zh-CN';
        dateFormat = locale.startsWith('zh') ? 'yyyy年MM月dd日' : 'yyyy-MM-dd';
      }

      // 判断相对日期（优先显示相对日期）
      if (isToday(date)) {
        return t('今天');
      } else if (isYesterday(date)) {
        return t('昨天');
      } else if (isTomorrow(date)) {
        return t('明天');
      } else {
        // 使用用户设置的日期格式
        return this.formatDateWithPattern(date, dateFormat);
      }
    } catch (e) {
      // 如果格式化失败，使用默认格式
      console.warn("日期格式化失败:", e);
      return this.formatDateWithPattern(date, 'yyyy-MM-dd');
    }
  }

  /**
   * 从ContentFragment数组中提取纯文本
   */
  async extractTextFromContent(content: any[]): Promise<string> {
    if (!content || content.length === 0) return "";
    
    let text = "";
    for (const fragment of content) {
      // ContentFragment 结构: { t: "类型", v: "值", f?: "格式", fa?: {...} }
      
      if (fragment.t === "t" && fragment.v) {
        // 文本类型片段，v 是实际文本内容
        text += fragment.v;
      } else if (fragment.t === "r") {
        // 链接/引用类型片段
        if (fragment.u) {
          // 如果有URL，这是外部链接
          if (fragment.v) {
            text += fragment.v; // 显示文本
          } else {
            text += fragment.u; // 使用URL
          }
        } else if (fragment.v && (typeof fragment.v === "number" || typeof fragment.v === "string")) {
          // 如果v是数字或字符串且没有URL，这是块引用，使用getTabInfo方式读取
          try {
            const referencedBlockId = fragment.v.toString();
            // 使用getTabInfo方式获取块信息，这样能正确解析content
            const tabInfo = await this.getTabInfo(referencedBlockId, "", 0);
            if (tabInfo && tabInfo.title) {
              text += tabInfo.title;
            } else {
              text += `[[块${referencedBlockId}]]`;
            }
          } catch (e) {
            console.warn("处理r类型块引用失败:", e);
            text += `[[块引用]]`;
          }
        } else if (fragment.v) {
          // 其他情况，v作为显示文本
          text += fragment.v;
        }
      } else if (fragment.t === "br" && fragment.v) {
        // 块引用类型，v 通常是块ID，使用getTabInfo方式读取
        try {
          const referencedBlockId = fragment.v.toString();
          // 使用getTabInfo方式获取块信息，这样能正确解析content
          const tabInfo = await this.getTabInfo(referencedBlockId, "", 0);
          if (tabInfo && tabInfo.title) {
            text += tabInfo.title;
          } else {
            text += `[[块${referencedBlockId}]]`;
          }
        } catch (e) {
          console.warn("处理块引用失败:", e);
          text += `[[块引用]]`;
        }
      } else if (fragment.t && fragment.t.includes("math") && fragment.v) {
        // 数学公式类型，显示公式内容
        text += `[数学: ${fragment.v}]`;
      } else if (fragment.t && fragment.t.includes("code") && fragment.v) {
        // 代码类型，显示代码内容
        text += fragment.v;
      } else if (fragment.v && typeof fragment.v === "string") {
        // 其他类型的片段，如果 v 是字符串就添加
        text += fragment.v;
      }
    }
    return text.trim();
  }

  /**
   * 使用BlockProperty API提取日期块信息
   */
  extractJournalInfo(block: any): Date | null {
    try {
      // 查找_repr属性（类型应该是PropType.JSON = 0）
      const reprProp = this.findProperty(block, '_repr');
      if (!reprProp || reprProp.type !== PropType.JSON || !reprProp.value) {
        return null;
      }

      // 解析JSON类型的属性值
      const reprData = typeof reprProp.value === 'string' 
        ? JSON.parse(reprProp.value) 
        : reprProp.value;

      // 检查是否是journal类型的日期块
      if (reprData.type === 'journal' && reprData.date) {
        return new Date(reprData.date);
      }

      return null;
    } catch (e) {
      // JSON解析失败或其他错误
      return null;
    }
  }

  /**
   * 获取块文本标题（最低优先级）
   */
  getBlockTextTitle(block: any): string {
    // 使用块的文本内容
    if (block.text) {
      return block.text.substring(0, 50);
    }
    
    // 最后备选
    return `块 ${block.id}`;
  }

  /**
   * 使用指定模式格式化日期
   */
  formatDateWithPattern(date: Date, pattern: string): string {
    try {
      return format(date, pattern);
    } catch (e) {
      // 如果用户设置的格式无效，尝试常见格式
      const fallbackFormats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'yyyy年MM月dd日'];
      
      for (const fallbackFormat of fallbackFormats) {
        try {
          return format(date, fallbackFormat);
        } catch (fallbackError) {
          continue;
        }
      }
      
      // 最后的备选方案
      return date.toISOString().split('T')[0];
    }
  }


  /**
   * 在块的properties中查找指定名称的属性
   */
  findProperty(block: any, propertyName: string): any {
    if (!block.properties || !Array.isArray(block.properties)) {
      return null;
    }
    
    return block.properties.find((prop: any) => prop.name === propertyName);
  }

  /**
   * 检查字符串是否是日期格式
   */
  isDateString(str: string): boolean {
    // 检查常见的日期格式
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,        // YYYY-MM-DD
      /^\d{4}\/\d{2}\/\d{2}$/,      // YYYY/MM/DD
      /^\d{2}\/\d{2}\/\d{4}$/,      // MM/DD/YYYY
      /^\d{4}-\d{2}-\d{2}T/,        // ISO format start
    ];
    
    return datePatterns.some(pattern => pattern.test(str));
  }

  async getTabInfo(blockId: string, panelId: string, order: number): Promise<TabInfo | null> {
    try {
      // 获取块信息
      const block = await orca.invokeBackend("get-block", parseInt(blockId));
      if (!block) return null;

      let title = "";
      let color = "";
      let icon = "";
      let isJournal = false;

      // 获取标题：优先级 BlockAlias > content内容 > text内容 > _repr日期块
      try {
        // 最高优先级：检查是否有别名（性能最好）
        if (block.aliases && block.aliases.length > 0) {
          title = block.aliases[0];
        } else if (block.content && block.content.length > 0) {
          // 次优先级：使用content内容（最准确，不包含标签）
          title = (await this.extractTextFromContent(block.content)).substring(0, 50);
        } else if (block.text) {
          // 第三优先级：使用text内容作为备选
          title = block.text.substring(0, 50);
        } else {
          // 最低优先级：检查是否是日期块（用高效的API检查）
          const journalInfo = this.extractJournalInfo(block);
          if (journalInfo) {
            isJournal = true;
            const formattedDate = this.formatJournalDate(journalInfo);
            title = `📅 ${formattedDate}`;
          } else {
            // 不是日期块，使用块ID作为备选
            title = `块 ${blockId}`;
          }
        }
      } catch (e) {
        console.warn("获取标题失败:", e);
        title = `块 ${blockId}`;
      }

      // 获取颜色和图标 - 从块的properties数组中查找
      try {
        const colorProp = this.findProperty(block, '_color');
        const iconProp = this.findProperty(block, '_icon');
        
        if (colorProp && colorProp.type === 1) {
          color = colorProp.value;
        }
        if (iconProp && iconProp.type === 1) {
          icon = iconProp.value;
        }
      } catch (e) {
        console.warn("获取属性失败:", e);
      }

      return {
        blockId,
        panelId,
        title: title || `块 ${blockId}`,
        color,
        icon,
        isJournal,
        isPinned: false, // 新标签默认不固定
        order
      };
    } catch (e) {
      console.error("获取标签信息失败:", e);
      return null;
    }
  }

  async createTabsUI() {
    // 移除现有的标签容器和循环切换器
    if (this.tabContainer) {
      this.tabContainer.remove();
    }
    if (this.cycleSwitcher) {
      this.cycleSwitcher.remove();
    }

    console.log(`🎨 创建UI: 面板数=${this.panelIds.length}, 位置=(${this.position.x}, ${this.position.y})`);

    // 不再创建循环切换器，因为标签页会自动切换
    console.log("📱 使用自动切换模式，不创建面板切换器");

    // 创建标签容器
    this.tabContainer = document.createElement('div');
    this.tabContainer.className = 'orca-tabs-container';
    // 不再需要为切换器预留空间
    // 根据主题模式设置背景
    const isDarkMode = orca.state.themeMode === 'dark';
    const backgroundColor = isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.1)';
    
    this.tabContainer.style.cssText = `
      position: fixed;
      top: ${this.position.y}px;
      left: ${this.position.x}px;
      z-index: 300;
      display: flex;
      gap: 4px;
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      background: ${backgroundColor};
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
    
    // 添加事件监听，阻止窗口拖拽
    this.tabContainer.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    
    this.tabContainer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 创建拖拽手柄
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.style.cssText = `
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
    `;
    dragHandle.innerHTML = '⋮⋮';

    // 添加拖拽事件
    dragHandle.addEventListener('mousedown', this.startDrag.bind(this));

    this.tabContainer.appendChild(dragHandle);
    document.body.appendChild(this.tabContainer);

    // 添加拖拽相关的CSS样式
    this.addDragStyles();

    console.log(`✅ 标签容器已创建，位置: (${this.position.x}, ${this.position.y})`);

    await this.updateTabsUI();
  }

  /**
   * 添加拖拽相关的CSS样式
   */
  addDragStyles() {
    // 检查是否已经添加过样式
    if (document.getElementById('orca-tabs-drag-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'orca-tabs-drag-styles';
    style.textContent = `
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
    `;
    
    document.head.appendChild(style);
    console.log("✅ 拖拽样式已添加");
  }

  /**
   * 防抖更新标签页UI（防止闪烁，优化版）
   */
  debouncedUpdateTabsUI() {
    // 如果正在拖拽，延迟更新UI以避免干扰拖拽体验
    if (this.draggingTab) {
    // 清除之前的计时器
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }
    
      // 设置新的计时器，拖拽时使用更长的延迟
    this.updateDebounceTimer = setTimeout(async () => {
      await this.updateTabsUI();
      }, 200); // 拖拽时200ms防抖
    } else {
      // 正常情况下的防抖
      if (this.updateDebounceTimer) {
        clearTimeout(this.updateDebounceTimer);
      }
      
      this.updateDebounceTimer = setTimeout(async () => {
        await this.updateTabsUI();
      }, 100); // 正常情况100ms防抖
    }
  }

  async updateTabsUI() {
    if (!this.tabContainer || this.isUpdating) return;
    
    // 防止重复更新
    this.isUpdating = true;
    const now = Date.now();
    
    // 限制更新频率（最小间隔50ms）
    if (now - this.lastUpdateTime < 50) {
      this.isUpdating = false;
      return;
    }
    
    this.lastUpdateTime = now;

    // 清除现有标签（保留拖拽手柄）
    const dragHandle = this.tabContainer.querySelector('.drag-handle');
    this.tabContainer.innerHTML = '';
    if (dragHandle) {
      this.tabContainer.appendChild(dragHandle);
    }

    // 检查第一个面板是否仍然存在
    const firstPanelExists = this.panelIds.length > 0 && document.querySelector(`.orca-panel[data-panel-id="${this.panelIds[0]}"]`);
    
    // 检查当前激活的面板是否是第一个面板
    const isFirstPanelActive = this.currentPanelIndex === 0;

    if (firstPanelExists && isFirstPanelActive) {
      // 第一个面板存在且激活时，显示固化标签页
      console.log("📋 显示第一个面板的固化标签页");
      // 确保标签按固定状态排序
      this.sortTabsByPinStatus();
      this.firstPanelTabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        this.tabContainer?.appendChild(tabElement);
      });
    } else {
      // 其他情况：显示当前激活面板的实时标签页
      console.log(`📋 显示面板 ${this.currentPanelIndex + 1} 的实时标签页`);
      await this.showCurrentPanelTabsSync();
    }
    
    // 释放更新锁
    this.isUpdating = false;
  }

  /**
   * 同步显示当前面板的实时标签页（避免闪烁）
   */
  async showCurrentPanelTabsSync() {
    if (!this.currentPanelId || !this.tabContainer) return;

    const panel = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!panel) {
      console.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }

    console.log(`🔍 扫描面板 ${this.currentPanelIndex + 1} 的实时标签页...`);

    const hideableElements = panel.querySelectorAll('.orca-hideable');
    const tabs: TabInfo[] = [];
    let order = 0;
    
    // 使用与面板1相同的完整逻辑获取标签信息
    for (const hideable of hideableElements) {
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 使用完整的getTabInfo方法，与面板1保持一致
      const tabInfo = await this.getTabInfo(blockId, this.currentPanelId, order++);
      if (tabInfo) {
        tabs.push(tabInfo);
        console.log(`📝 块 ${blockId} 标题: "${tabInfo.title}"`);
      }
    }

    console.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${tabs.length} 个标签页`);

    // 一次性更新DOM
    const fragment = document.createDocumentFragment();
    
    if (tabs.length > 0) {
      // 显示标签页
      tabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        fragment.appendChild(tabElement);
      });
    } else {
      // 显示提示
      const statusElement = document.createElement('div');
      statusElement.className = 'panel-status';
      statusElement.style.cssText = `
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
      
      const panelNumber = this.currentPanelIndex + 1;
      statusElement.textContent = `面板 ${panelNumber}（无标签页）`;
      statusElement.title = `当前在面板 ${panelNumber}，该面板没有标签页`;
      
      fragment.appendChild(statusElement);
    }
    
    // 一次性替换内容
    this.tabContainer.appendChild(fragment);
  }


  /**
   * 显示当前面板的实时标签页
   */
  async showCurrentPanelTabs() {
    if (!this.currentPanelId || !this.tabContainer) return;

    const panel = document.querySelector(`.orca-panel[data-panel-id="${this.currentPanelId}"]`);
    if (!panel) {
      console.warn(`❌ 未找到面板: ${this.currentPanelId}`);
      return;
    }

    console.log(`🔍 扫描面板 ${this.currentPanelIndex + 1} 的实时标签页...`);

    const hideableElements = panel.querySelectorAll('.orca-hideable');
    const tabs: TabInfo[] = [];
    let order = 0;
    
    // 同步获取标签信息，避免异步导致的闪烁
    for (const hideable of hideableElements) {
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 获取标签信息
      const tabInfo = await this.getTabInfo(blockId, this.currentPanelId, order++);
      if (tabInfo) {
        tabs.push(tabInfo);
      }
    }

    console.log(`📋 面板 ${this.currentPanelIndex + 1} 找到 ${tabs.length} 个标签页`);

    // 一次性更新DOM，避免闪烁
    const fragment = document.createDocumentFragment();
    
    if (tabs.length > 0) {
      // 显示标签页
      tabs.forEach((tab, index) => {
        const tabElement = this.createTabElement(tab);
        fragment.appendChild(tabElement);
      });
    } else {
      // 显示提示
      const statusElement = document.createElement('div');
      statusElement.className = 'panel-status';
      statusElement.style.cssText = `
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
      
      const panelNumber = this.currentPanelIndex + 1;
      statusElement.textContent = `面板 ${panelNumber}（无标签页）`;
      statusElement.title = `当前在面板 ${panelNumber}，该面板没有标签页`;
      
      fragment.appendChild(statusElement);
    }
    
    // 一次性替换内容
    this.tabContainer.appendChild(fragment);
  }

  /**
   * 创建标签元素
   */
  createTabElement(tab: TabInfo): HTMLElement {
    const tabElement = document.createElement('div');
    tabElement.className = 'orca-tab';
    tabElement.setAttribute('data-tab-id', tab.blockId); // 添加data属性用于重命名定位
    
    // 检查是否为当前激活的标签
    const isActive = this.isTabActive(tab);
    if (isActive) {
      tabElement.setAttribute('data-focused', 'true');
    }
    
    // 设置样式
    const isDarkMode = orca.state.themeMode === 'dark';
    let backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(200, 200, 200, 0.6)';
    let textColor = isDarkMode ? '#ffffff' : '#333';
    let fontWeight = 'normal';
    
    // 如果有颜色，应用颜色样式
    if (tab.color) {
      // 使用OKLCH公式处理颜色（仅限暗色模式）
      backgroundColor = this.applyOklchFormula(tab.color, 'background');
      textColor = this.applyOklchFormula(tab.color, 'text');
      fontWeight = '600';
    }

    tabElement.style.cssText = `
      background: ${backgroundColor};
      color: ${textColor};
      font-weight: ${fontWeight};
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

    // 设置标签文本
    let displayText = tab.title;
    if (tab.icon) {
      displayText = `${tab.icon} ${tab.title}`;
    }
    // 如果是固定标签，添加固定图标
    if (tab.isPinned) {
      displayText = `📌 ${displayText}`;
    }
    tabElement.textContent = displayText;
    
    // 设置悬停提示
    let tooltip = tab.title;
    if (tab.isPinned) {
      tooltip += " (已固定)";
    }
    tabElement.title = tooltip;

    // 添加点击事件
    tabElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // 移除其他标签的聚焦状态
      const allTabs = this.tabContainer?.querySelectorAll('.orca-tab');
      allTabs?.forEach(t => t.removeAttribute('data-focused'));
      
      // 设置当前标签为聚焦状态
      tabElement.setAttribute('data-focused', 'true');
      
      // 普通点击切换标签
      this.switchToTab(tab);
    });

    // 添加双击事件切换固定状态
    tabElement.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.toggleTabPinStatus(tab);
    });

    // 添加中键点击事件
    tabElement.addEventListener('auxclick', (e) => {
      if (e.button === 1) { // 中键
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.closeTab(tab);
      }
    });

    // 添加键盘快捷键支持
    tabElement.addEventListener('keydown', (e) => {
      if (e.target === tabElement || tabElement.contains(e.target as Node)) {
        if (e.key === 'F2') {
      e.preventDefault();
      e.stopPropagation();
          this.renameTab(tab);
        } else if (e.ctrlKey && e.key === 'p') {
          e.preventDefault();
          e.stopPropagation();
          this.toggleTabPinStatus(tab);
        } else if (e.ctrlKey && e.key === 'w') {
          e.preventDefault();
          e.stopPropagation();
          this.closeTab(tab);
        }
      }
    });

    // 添加右键菜单事件（使用Orca原生ContextMenu）
    this.addOrcaContextMenu(tabElement, tab);

    // 添加标签拖拽排序功能
    tabElement.draggable = true;
    
    // 拖拽开始事件（优化版）
    tabElement.addEventListener('dragstart', (e) => {
      e.dataTransfer!.effectAllowed = 'move'; // 声明拖拽类型为"移动"
      e.dataTransfer?.setData('text/plain', tab.blockId);
      
      // 记录当前被拖拽的标签
      this.draggingTab = tab;
      this.lastSwapTarget = null; // 重置上次交换目标
      
      // 设置拖拽视觉反馈
      tabElement.setAttribute('data-dragging', 'true');
      tabElement.classList.add('dragging');
      
      // 设置容器拖拽状态
      if (this.tabContainer) {
        this.tabContainer.setAttribute('data-dragging', 'true');
      }
      
      console.log(`🔄 开始拖拽标签: ${tab.title} (${tab.blockId})`);
    });

    // 拖拽结束事件（修复版）
    tabElement.addEventListener('dragend', (e) => {
      // 清除所有拖拽状态
      this.draggingTab = null;
      this.lastSwapTarget = null;
      
      // 清除所有拖拽相关的定时器
      if (this.swapDebounceTimer) {
        clearTimeout(this.swapDebounceTimer);
        this.swapDebounceTimer = null;
      }
      if (this.dragOverTimer) {
        clearTimeout(this.dragOverTimer);
        this.dragOverTimer = null;
      }
      
      // 清除视觉反馈
      this.clearDragVisualFeedback();
      
      // 拖拽结束后更新UI
      setTimeout(() => {
        this.debouncedUpdateTabsUI();
      }, 50);
      
      console.log(`🔄 结束拖拽标签: ${tab.title}`);
    });

    // 拖拽经过事件（修复版）
    tabElement.addEventListener('dragover', (e) => {
      if (this.draggingTab && this.draggingTab.blockId !== tab.blockId) {
        e.preventDefault(); // 允许放置（必须调用，否则无法触发后续逻辑）
        e.dataTransfer!.dropEffect = 'move';
        
        // 添加拖拽悬停效果
        this.addDragOverEffect(tabElement);
        
        // 调用交换函数（已优化防抖）
        this.debouncedSwapTab(tab, this.draggingTab);
      }
    });

    // 拖拽进入事件
    tabElement.addEventListener('dragenter', (e) => {
      if (this.draggingTab && this.draggingTab.blockId !== tab.blockId) {
        e.preventDefault();
        // 添加拖拽悬停效果
        this.addDragOverEffect(tabElement);
      }
    });

    // 拖拽离开事件
    tabElement.addEventListener('dragleave', (e) => {
      // 检查是否真的离开了元素（而不是进入子元素）
      const rect = tabElement.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        // 移除拖拽悬停效果
        this.removeDragOverEffect(tabElement);
      }
    });

    // 拖拽放置事件（保留作为备用）
    tabElement.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedBlockId = e.dataTransfer?.getData('text/plain');
      console.log(`🔄 拖拽放置: ${draggedBlockId} -> ${tab.blockId}`);
      // 这个事件现在主要用于调试，实际交换逻辑在dragover中处理
    });

    // 添加悬停效果
    tabElement.addEventListener('mouseenter', () => {
      tabElement.style.transform = 'scale(1.05)';
      tabElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    });

    tabElement.addEventListener('mouseleave', () => {
      tabElement.style.transform = 'scale(1)';
      tabElement.style.boxShadow = 'none';
    });

    return tabElement;
  }

  hexToRgba(hex: string, alpha: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return `rgba(200, 200, 200, ${alpha})`;
  }

  /**
   * 根据背景颜色计算合适的文字颜色
   */
  getContrastColor(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      const r = parseInt(result[1], 16);
      const g = parseInt(result[2], 16);
      const b = parseInt(result[3], 16);
      
      // 计算相对亮度 (WCAG 标准)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      // 如果背景较暗，使用白色文字；如果背景较亮，使用深色文字
      return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
    return '#333333';
  }

  /**
   * 加深颜色
   */
  darkenColor(hex: string, factor: number): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      let r = parseInt(result[1], 16);
      let g = parseInt(result[2], 16);
      let b = parseInt(result[3], 16);
      
      // 按比例减少RGB值来加深颜色
      r = Math.floor(r * (1 - factor));
      g = Math.floor(g * (1 - factor));
      b = Math.floor(b * (1 - factor));
      
      // 转换回十六进制
      const rHex = r.toString(16).padStart(2, '0');
      const gHex = g.toString(16).padStart(2, '0');
      const bHex = b.toString(16).padStart(2, '0');
      
      return `#${rHex}${gHex}${bHex}`;
    }
    return hex; // 如果解析失败，返回原颜色
  }

  /**
   * RGB转OKLCH颜色空间
   */
  private rgbToOklch(r: number, g: number, b: number): { l: number; c: number; h: number } {
    // 将RGB转换为线性RGB
    const linearR = r / 255;
    const linearG = g / 255;
    const linearB = b / 255;

    // 应用sRGB到线性RGB的转换
    const srgbToLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    
    const rLinear = srgbToLinear(linearR);
    const gLinear = srgbToLinear(linearG);
    const bLinear = srgbToLinear(linearB);

    // 转换为XYZ颜色空间
    const x = rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375;
    const y = rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.0721750;
    const z = rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041;

    // 转换为OKLCH
    const l = 0.2104542553 * x + 0.7936177850 * y - 0.0040720468 * z;
    const m = 1.9779984951 * x - 2.4285922050 * y + 0.4505937099 * z;
    const s = 0.0259040371 * x + 0.7827717662 * y - 0.8086757660 * z;

    const l_ = Math.cbrt(l);
    const m_ = Math.cbrt(m);
    const s_ = Math.cbrt(s);

    const l_oklch = 0.2104542553 * l_ + 0.7936177850 * m_ + 0.0040720468 * s_;
    const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
    const b_oklch = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

    const c = Math.sqrt(a * a + b_oklch * b_oklch);
    const h = Math.atan2(b_oklch, a) * 180 / Math.PI;
    const h_normalized = h < 0 ? h + 360 : h;

    return { l: l_oklch, c, h: h_normalized };
  }

  /**
   * OKLCH转RGB颜色空间
   */
  private oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
    const h_rad = h * Math.PI / 180;
    const a = c * Math.cos(h_rad);
    const b_oklch = c * Math.sin(h_rad);

    const l_ = l;
    const m_ = a;
    const s_ = b_oklch;

    const l_cubed = l_ * l_ * l_;
    const m_cubed = m_ * m_ * m_;
    const s_cubed = s_ * s_ * s_;

    const x = 1.0478112 * l_cubed + 0.0228866 * m_cubed - 0.0502170 * s_cubed;
    const y = 0.0295424 * l_cubed + 0.9904844 * m_cubed + 0.0170491 * s_cubed;
    const z = -0.0092345 * l_cubed + 0.0150436 * m_cubed + 0.7521316 * s_cubed;

    const rLinear = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    const gLinear = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
    const bLinear = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

    const linearToSrgb = (c: number) => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1/2.4) - 0.055;

    const r = Math.max(0, Math.min(255, Math.round(linearToSrgb(rLinear) * 255)));
    const g = Math.max(0, Math.min(255, Math.round(linearToSrgb(gLinear) * 255)));
    const b = Math.max(0, Math.min(255, Math.round(linearToSrgb(bLinear) * 255)));

    return { r, g, b };
  }

  /**
   * 应用颜色调整（支持亮色和暗色模式）
   * 优先使用简单的RGB调整，避免OKLCH偏色问题
   */
  private applyOklchFormula(hex: string, type: 'text' | 'background'): string {
    // 使用Orca API检查是否为暗色模式
    const isDarkMode = orca.state.themeMode === 'dark';
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    if (type === 'text') {
      // 文字颜色：根据模式调整对比度
      const brightness = (r + g + b) / 3;
      
      if (isDarkMode) {
        // 暗色模式：增亮文字
        if (brightness < 80) {
          // 暗色：适度增亮
          const factor = 1.6;
          const newR = Math.min(255, Math.round(r * factor));
          const newG = Math.min(255, Math.round(g * factor));
          const newB = Math.min(255, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else if (brightness < 150) {
          // 中等亮度：轻微增亮
          const factor = 1.3;
          const newR = Math.min(255, Math.round(r * factor));
          const newG = Math.min(255, Math.round(g * factor));
          const newB = Math.min(255, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else {
          // 亮色：保持原色或轻微增亮
          const factor = 1.1;
          const newR = Math.min(255, Math.round(r * factor));
          const newG = Math.min(255, Math.round(g * factor));
          const newB = Math.min(255, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        }
      } else {
        // 亮色模式：变暗文字以提高对比度
        if (brightness > 200) {
          // 很亮的颜色：大幅变暗
          const factor = 0.4;
          const newR = Math.max(0, Math.round(r * factor));
          const newG = Math.max(0, Math.round(g * factor));
          const newB = Math.max(0, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else if (brightness > 150) {
          // 中等亮度：适度变暗
          const factor = 0.6;
          const newR = Math.max(0, Math.round(r * factor));
          const newG = Math.max(0, Math.round(g * factor));
          const newB = Math.max(0, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        } else {
          // 暗色：轻微变暗
          const factor = 0.8;
          const newR = Math.max(0, Math.round(r * factor));
          const newG = Math.max(0, Math.round(g * factor));
          const newB = Math.max(0, Math.round(b * factor));
          return `rgb(${newR}, ${newG}, ${newB})`;
        }
      }
    } else {
      // 背景颜色：根据模式调整透明度
      if (isDarkMode) {
        return this.hexToRgba(hex, 0.25);
      } else {
        return this.hexToRgba(hex, 0.35);
      }
    }
  }

  async switchToTab(tab: TabInfo) {
    try {
      // 记录当前激活标签的滚动位置
      const currentActiveTab = this.getCurrentActiveTab();
      if (currentActiveTab && currentActiveTab.blockId !== tab.blockId) {
        this.recordScrollPosition(currentActiveTab);
      }
      
      // 根据当前面板索引决定在哪个面板打开
      const targetPanelId = this.panelIds[this.currentPanelIndex];
      
      if (this.currentPanelIndex === 0) {
        // 第一个面板：使用固化标签页，在第一个面板打开
        await orca.nav.goTo("block", { blockId: parseInt(tab.blockId) }, targetPanelId);
      } else {
        // 其他面板：在当前面板打开对应的块
        await orca.nav.goTo("block", { blockId: parseInt(tab.blockId) }, targetPanelId);
      }
      
      console.log(`🔄 切换到标签: ${tab.title} (面板 ${this.currentPanelIndex + 1})`);
      
      // 恢复目标标签的滚动位置
      this.restoreScrollPosition(tab);
      
      // 调试信息
      setTimeout(() => {
        this.debugScrollPosition(tab);
      }, 500);
    } catch (e) {
      console.error("切换标签失败:", e);
    }
  }

  /**
   * 检查是否为当前激活的标签页
   */
  isCurrentActiveTab(tab: TabInfo): boolean {
    const firstPanelId = this.panelIds[0];
    const firstPanel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!firstPanel) return false;
    
    // 获取当前激活的块编辑器
    const activeBlockEditor = firstPanel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) return false;
    
    const activeBlockId = activeBlockEditor.getAttribute('data-block-id');
    return activeBlockId === tab.blockId;
  }

  /**
   * 切换到相邻标签页
   */
  async switchToAdjacentTab(closedTab: TabInfo) {
    const currentIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === closedTab.blockId);
    if (currentIndex === -1) {
      console.log("未找到要关闭的标签页");
      return;
    }
    
    let targetIndex = -1;
    
    // 根据位置决定切换到哪个相邻标签
    if (currentIndex === 0) {
      // 最左边：切换到右边
      targetIndex = 1;
    } else if (currentIndex === this.firstPanelTabs.length - 1) {
      // 最右边：切换到左边
      targetIndex = currentIndex - 1;
    } else {
      // 中间：优先切换到右边
      targetIndex = currentIndex + 1;
    }
    
    // 检查目标索引是否有效
    if (targetIndex >= 0 && targetIndex < this.firstPanelTabs.length) {
      const targetTab = this.firstPanelTabs[targetIndex];
      console.log(`🔄 自动切换到相邻标签: "${targetTab.title}" (位置: ${targetIndex})`);
      
      // 导航到目标标签页（在第一个面板中打开）
      const firstPanelId = this.panelIds[0];
      await orca.nav.goTo("block", { blockId: parseInt(targetTab.blockId) }, firstPanelId);
    } else {
      console.log("没有可切换的相邻标签页");
    }
  }

  /**
   * 切换标签固定状态
   */
  toggleTabPinStatus(tab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持固定功能
    
    const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex !== -1) {
      // 切换固定状态
      this.firstPanelTabs[tabIndex].isPinned = !this.firstPanelTabs[tabIndex].isPinned;
      
      // 重新排序
      this.sortTabsByPinStatus();
      
      // 更新UI和保存数据
      this.debouncedUpdateTabsUI();
      this.saveFirstPanelTabs();
      
      const status = this.firstPanelTabs[tabIndex].isPinned ? '固定' : '取消固定';
      console.log(`📌 标签 "${tab.title}" 已${status}`);
    }
  }


  /**
   * 记录当前标签的滚动位置
   */
  private recordScrollPosition(tab: TabInfo) {
    try {
      // 使用Orca的viewState API来保存滚动位置
      const panelId = this.panelIds[this.currentPanelIndex];
      const panel = orca.nav.findViewPanel(panelId, orca.state.panels);
      
      if (panel && panel.viewState) {
        // 尝试多种方式找到滚动容器
        let scrollContainer: HTMLElement | null = null;
        
        // 方法1: 通过block元素查找
        const blockElement = document.querySelector(`.orca-block-editor[data-block-id="${tab.blockId}"]`);
        if (blockElement) {
          const panelElement = blockElement.closest('.orca-panel');
          if (panelElement) {
            scrollContainer = panelElement.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法2: 直接查找当前激活面板的滚动容器
        if (!scrollContainer) {
          const activePanel = document.querySelector('.orca-panel.active');
          if (activePanel) {
            scrollContainer = activePanel.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法3: 查找body或documentElement的滚动
        if (!scrollContainer) {
          scrollContainer = document.body.scrollTop > 0 ? document.body : document.documentElement;
        }
        
        if (scrollContainer) {
          const scrollPosition = {
            x: scrollContainer.scrollLeft || 0,
            y: scrollContainer.scrollTop || 0
          };
          
          // 保存到Orca的viewState中
          panel.viewState.scrollPosition = scrollPosition;
          
          // 同时保存到标签信息中作为备份
          const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
          if (tabIndex !== -1) {
            this.firstPanelTabs[tabIndex].scrollPosition = scrollPosition;
            this.saveFirstPanelTabs();
          }
          
          console.log(`📝 记录标签 "${tab.title}" 滚动位置到viewState:`, scrollPosition, '容器:', scrollContainer.className);
        } else {
          console.warn(`未找到标签 "${tab.title}" 的滚动容器`);
        }
      } else {
        console.warn(`未找到面板 ${panelId} 或viewState`);
      }
    } catch (error) {
      console.warn('记录滚动位置时出错:', error);
    }
  }

  /**
   * 恢复标签的滚动位置
   */
  private restoreScrollPosition(tab: TabInfo) {
    try {
      // 优先从Orca的viewState中获取滚动位置
      let scrollPosition = null;
      
      // 方法1: 从viewState获取
      const panelId = this.panelIds[this.currentPanelIndex];
      const panel = orca.nav.findViewPanel(panelId, orca.state.panels);
      if (panel && panel.viewState && panel.viewState.scrollPosition) {
        scrollPosition = panel.viewState.scrollPosition;
        console.log(`🔄 从viewState恢复标签 "${tab.title}" 滚动位置:`, scrollPosition);
      }
      
      // 方法2: 从标签信息获取（备份）
      if (!scrollPosition && tab.scrollPosition) {
        scrollPosition = tab.scrollPosition;
        console.log(`🔄 从标签信息恢复标签 "${tab.title}" 滚动位置:`, scrollPosition);
      }
      
      if (!scrollPosition) return;
      
      // 多次尝试恢复，确保DOM已更新
      const attemptRestore = (attempt: number = 1) => {
        if (attempt > 5) {
          console.warn(`恢复标签 "${tab.title}" 滚动位置失败，已尝试5次`);
          return;
        }
        
        // 尝试多种方式找到滚动容器
        let scrollContainer: HTMLElement | null = null;
        
        // 方法1: 通过block元素查找
        const blockElement = document.querySelector(`.orca-block-editor[data-block-id="${tab.blockId}"]`);
        if (blockElement) {
          const panelElement = blockElement.closest('.orca-panel');
          if (panelElement) {
            scrollContainer = panelElement.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法2: 直接查找当前激活面板的滚动容器
        if (!scrollContainer) {
          const activePanel = document.querySelector('.orca-panel.active');
          if (activePanel) {
            scrollContainer = activePanel.querySelector('.orca-panel-content, .orca-editor-content, .scroll-container, .orca-scroll-container') as HTMLElement;
          }
        }
        
        // 方法3: 查找body或documentElement的滚动
        if (!scrollContainer) {
          scrollContainer = document.body.scrollTop > 0 ? document.body : document.documentElement;
        }
        
        if (scrollContainer) {
          scrollContainer.scrollLeft = scrollPosition.x;
          scrollContainer.scrollTop = scrollPosition.y;
          console.log(`🔄 恢复标签 "${tab.title}" 滚动位置:`, scrollPosition, '容器:', scrollContainer.className, `尝试${attempt}`);
        } else {
          // 如果没找到容器，延迟重试
          setTimeout(() => attemptRestore(attempt + 1), 200 * attempt);
        }
      };
      
      // 立即尝试一次，然后延迟尝试
      attemptRestore();
      setTimeout(() => attemptRestore(2), 100);
      setTimeout(() => attemptRestore(3), 300);
    } catch (error) {
      console.warn('恢复滚动位置时出错:', error);
    }
  }

  /**
   * 调试滚动位置信息
   */
  private debugScrollPosition(tab: TabInfo) {
    console.log(`🔍 调试标签 "${tab.title}" 滚动位置:`);
    console.log('标签保存的滚动位置:', tab.scrollPosition);
    
    // 检查viewState中的滚动位置
    const panelId = this.panelIds[this.currentPanelIndex];
    const panel = orca.nav.findViewPanel(panelId, orca.state.panels);
    if (panel && panel.viewState) {
      console.log('viewState中的滚动位置:', panel.viewState.scrollPosition);
      console.log('完整viewState:', panel.viewState);
    } else {
      console.log('未找到viewState');
    }
    
    // 查找所有可能的滚动容器
    const containers = [
      '.orca-panel-content',
      '.orca-editor-content', 
      '.scroll-container',
      '.orca-scroll-container',
      '.orca-panel',
      'body',
      'html'
    ];
    
    containers.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, index) => {
        const element = el as HTMLElement;
        if (element.scrollTop > 0 || element.scrollLeft > 0) {
          console.log(`容器 ${selector}[${index}]:`, {
            scrollTop: element.scrollTop,
            scrollLeft: element.scrollLeft,
            className: element.className,
            id: element.id
          });
        }
      });
    });
  }

  /**
   * 检查标签是否为当前激活状态
   */
  private isTabActive(tab: TabInfo): boolean {
    try {
      // 获取当前激活的面板
      const activePanel = document.querySelector('.orca-panel.active');
      if (!activePanel) return false;

      // 获取当前激活的块编辑器
      const activeBlock = activePanel.querySelector('.orca-block-editor[data-block-id]');
      if (!activeBlock) return false;

      const activeBlockId = activeBlock.getAttribute('data-block-id');
      return activeBlockId === tab.blockId;
    } catch (error) {
      console.warn('检查标签激活状态时出错:', error);
      return false;
    }
  }

  /**
   * 获取当前激活的标签
   */
  getCurrentActiveTab(): TabInfo | null {
    if (this.currentPanelIndex !== 0) return null; // 只有第一个面板支持
    
    if (this.firstPanelTabs.length === 0) return null;
    
    // 获取第一个面板中当前激活的块编辑器
    const firstPanelId = this.panelIds[0];
    const panel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!panel) return null;
    
    const activeBlockEditor = panel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) return null;
    
    const blockId = activeBlockEditor.getAttribute('data-block-id');
    if (!blockId) return null;
    
    // 在固化标签中查找对应的标签
    return this.firstPanelTabs.find(tab => tab.blockId === blockId) || null;
  }

  /**
   * 获取相邻标签（用于关闭当前标签后自动切换）
   */
  getAdjacentTab(currentTab: TabInfo): TabInfo | null {
    if (this.currentPanelIndex !== 0) return null; // 只有第一个面板支持
    
    const currentIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === currentTab.blockId);
    if (currentIndex === -1) return null;
    
    // 如果只有一个标签，返回null（无法切换）
    if (this.firstPanelTabs.length <= 1) return null;
    
    // 如果当前标签在中间位置，优先选择右边的标签
    if (currentIndex < this.firstPanelTabs.length - 1) {
      return this.firstPanelTabs[currentIndex + 1];
    }
    
    // 如果当前标签在最右边，选择左边的标签
    if (currentIndex > 0) {
      return this.firstPanelTabs[currentIndex - 1];
    }
    
    // 如果当前标签在最左边且只有一个其他标签，选择右边的标签
    if (currentIndex === 0 && this.firstPanelTabs.length > 1) {
      return this.firstPanelTabs[1];
    }
    
    return null;
  }

  /**
   * 关闭标签页
   */
  async closeTab(tab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持关闭功能
    
    // 检查是否只有一个标签
    if (this.firstPanelTabs.length <= 1) {
      console.log("⚠️ 只有一个标签，无法关闭");
      return;
    }
    
    // 检查是否是固定标签
    if (tab.isPinned) {
      console.log("⚠️ 固定标签默认不可关闭，需要强制关闭");
      // 这里可以添加确认对话框，暂时直接关闭
    }
    
    const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
    if (tabIndex !== -1) {
      // 检查当前关闭的标签是否是激活的标签
      const currentActiveTab = this.getCurrentActiveTab();
      const isClosingActiveTab = currentActiveTab && currentActiveTab.blockId === tab.blockId;
      
      // 获取相邻标签（在移除当前标签之前）
      const adjacentTab = isClosingActiveTab ? this.getAdjacentTab(tab) : null;
      
      // 将标签添加到已关闭列表
      this.closedTabs.add(tab.blockId);
      
      // 移除标签
      this.firstPanelTabs.splice(tabIndex, 1);
      
      // 更新UI和保存数据
      this.debouncedUpdateTabsUI();
      this.saveFirstPanelTabs();
      this.saveClosedTabs();
      
      console.log(`🗑️ 标签 "${tab.title}" 已关闭，已添加到关闭列表`);
      
      // 如果关闭的是当前激活的标签，自动切换到相邻标签
      if (isClosingActiveTab && adjacentTab) {
        console.log(`🔄 自动切换到相邻标签: "${adjacentTab.title}"`);
        await this.switchToTab(adjacentTab);
      } else if (isClosingActiveTab && !adjacentTab) {
        console.log(`⚠️ 关闭了激活标签但没有相邻标签可切换`);
      }
    }
  }


  /**
   * 关闭全部标签页（保留固定标签）
   */
  closeAllTabs() {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持关闭功能
    
    // 将非固定标签添加到已关闭列表
    const nonPinnedTabs = this.firstPanelTabs.filter(tab => !tab.isPinned);
    nonPinnedTabs.forEach(tab => {
      this.closedTabs.add(tab.blockId);
    });
    
    // 只保留固定标签
    const pinnedTabs = this.firstPanelTabs.filter(tab => tab.isPinned);
    const closedCount = this.firstPanelTabs.length - pinnedTabs.length;
    
    this.firstPanelTabs = pinnedTabs;
    
    // 更新UI和保存数据
    this.debouncedUpdateTabsUI();
    this.saveFirstPanelTabs();
    this.saveClosedTabs();
    
    console.log(`🗑️ 已关闭 ${closedCount} 个标签，保留了 ${pinnedTabs.length} 个固定标签`);
  }

  /**
   * 关闭其他标签页（保留当前标签和固定标签）
   */
  closeOtherTabs(currentTab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持关闭功能
    
    // 保留当前标签和所有固定标签
    const keepTabs = this.firstPanelTabs.filter(tab => 
      tab.blockId === currentTab.blockId || tab.isPinned
    );
    
    // 将其他标签添加到已关闭列表
    const otherTabs = this.firstPanelTabs.filter(tab => 
      tab.blockId !== currentTab.blockId && !tab.isPinned
    );
    otherTabs.forEach(tab => {
      this.closedTabs.add(tab.blockId);
    });
    
    const closedCount = this.firstPanelTabs.length - keepTabs.length;
    this.firstPanelTabs = keepTabs;
    
    // 更新UI和保存数据
    this.debouncedUpdateTabsUI();
    this.saveFirstPanelTabs();
    this.saveClosedTabs();
    
    console.log(`🗑️ 已关闭其他 ${closedCount} 个标签，保留了当前标签和固定标签`);
  }

  /**
   * 重命名标签（使用Orca原生InputBox）
   */
  renameTab(tab: TabInfo) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持重命名功能
    
    // 移除现有的右键菜单
    const existingMenu = document.querySelector('.tab-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    // 使用Orca原生InputBox进行重命名
    this.showOrcaRenameInput(tab);
  }

  /**
   * 使用Orca原生InputBox显示重命名输入框
   */
  showOrcaRenameInput(tab: TabInfo) {
    // 创建临时的React元素来使用Orca组件
    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;
    
    if (!React || !ReactDOM || !orca.components.InputBox) {
      console.warn("Orca组件不可用，回退到原生实现");
      this.showRenameInput(tab);
      return;
    }

    // 创建容器元素
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      pointer-events: none;
    `;
    document.body.appendChild(container);

    // 计算输入框位置（优化版：靠近边缘时往内定位）
    const tabElement = document.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
    let inputPosition = { x: '50%', y: '50%' };
    
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const inputWidth = 300; // 输入框预估宽度
      const inputHeight = 100; // 输入框预估高度
      const margin = 20; // 边距
      
      // 计算最佳位置，优先在标签上方显示
      let x = rect.left;
      let y = rect.top - inputHeight - 10; // 在标签上方显示
      
      // 智能边界检测和调整
      // 检查右边界 - 如果太靠近右边缘，往左移动
      if (x + inputWidth > viewportWidth - margin) {
        x = viewportWidth - inputWidth - margin;
      }
      
      // 检查左边界 - 如果太靠近左边缘，往右移动
      if (x < margin) {
        x = margin;
      }
      
      // 检查上边界 - 如果上方空间不够，显示在下方
      if (y < margin) {
        y = rect.bottom + 10;
        
        // 如果下方也不够，调整到屏幕中央
        if (y + inputHeight > viewportHeight - margin) {
          y = (viewportHeight - inputHeight) / 2;
        }
      }
      
      // 检查下边界 - 如果下方空间不够，调整位置
      if (y + inputHeight > viewportHeight - margin) {
        y = viewportHeight - inputHeight - margin;
      }
      
      // 最终边界检查，确保完全在屏幕内
      x = Math.max(margin, Math.min(x, viewportWidth - inputWidth - margin));
      y = Math.max(margin, Math.min(y, viewportHeight - inputHeight - margin));
      
      inputPosition = { x: `${x}px`, y: `${y}px` };
    }

    // 创建InputBox组件
    const InputBox = orca.components.InputBox;
    const inputBoxElement = React.createElement(InputBox, {
      label: "重命名标签",
      defaultValue: tab.title,
      onConfirm: (value: string | undefined, e: any, close: () => void) => {
        if (value && value.trim() && value.trim() !== tab.title) {
          this.updateTabTitle(tab, value.trim());
        }
        close();
      },
      onCancel: (close: () => void) => {
        close();
      }
    }, (open: () => void) => {
      // 创建一个触发按钮，但立即触发
      const trigger = React.createElement('div', {
        style: {
          position: 'absolute',
          left: inputPosition.x,
          top: inputPosition.y,
          pointerEvents: 'auto'
        },
        onClick: open
      }, '');
      return trigger;
    });

    // 渲染组件
    ReactDOM.render(inputBoxElement, container);

    // 立即触发打开
    setTimeout(() => {
      const triggerElement = container.querySelector('div');
      if (triggerElement) {
        triggerElement.click();
      }
    }, 0);

    // 清理函数
    const cleanup = () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(container);
        container.remove();
      }, 100);
    };

    // 监听ESC键关闭
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cleanup();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
  }

  /**
   * 显示重命名输入框（原生实现，作为备选）
   */
  showRenameInput(tab: TabInfo) {
    // 移除现有的重命名输入框
    const existingInput = document.querySelector('.tab-rename-input');
    if (existingInput) {
      existingInput.remove();
    }

    // 创建重命名输入框容器
    const inputContainer = document.createElement('div');
    inputContainer.className = 'tab-rename-input';
    inputContainer.style.cssText = `
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

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.value = tab.title;
    input.style.cssText = `
      border: none;
      outline: none;
      background: transparent;
      font-size: 14px;
      color: #333;
      width: 100%;
      padding: 4px 0;
    `;

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 8px;
      margin-top: 8px;
      justify-content: flex-end;
    `;

    // 创建确认按钮
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '确认';
    confirmBtn.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    // 创建取消按钮
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = '取消';
    cancelBtn.style.cssText = `
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    `;

    // 添加按钮悬停效果
    confirmBtn.addEventListener('mouseenter', () => {
      confirmBtn.style.backgroundColor = '#2563eb';
    });
    confirmBtn.addEventListener('mouseleave', () => {
      confirmBtn.style.backgroundColor = '#3b82f6';
    });

    cancelBtn.addEventListener('mouseenter', () => {
      cancelBtn.style.backgroundColor = '#4b5563';
    });
    cancelBtn.addEventListener('mouseleave', () => {
      cancelBtn.style.backgroundColor = '#6b7280';
    });

    // 组装元素
    buttonContainer.appendChild(confirmBtn);
    buttonContainer.appendChild(cancelBtn);
    inputContainer.appendChild(input);
    inputContainer.appendChild(buttonContainer);

    // 定位输入框
    const tabElement = document.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
    if (tabElement) {
      const rect = tabElement.getBoundingClientRect();
      inputContainer.style.left = `${rect.left}px`;
      inputContainer.style.top = `${rect.top - 60}px`;
    } else {
      // 如果找不到标签元素，使用鼠标位置
      inputContainer.style.left = '50%';
      inputContainer.style.top = '50%';
      inputContainer.style.transform = 'translate(-50%, -50%)';
    }

    document.body.appendChild(inputContainer);

    // 自动聚焦并选中文本
    input.focus();
    input.select();

    // 确认重命名
    const confirmRename = () => {
      const newTitle = input.value.trim();
      if (newTitle && newTitle !== tab.title) {
        this.updateTabTitle(tab, newTitle);
      }
      inputContainer.remove();
    };

    // 取消重命名
    const cancelRename = () => {
      inputContainer.remove();
    };

    // 绑定事件
    confirmBtn.addEventListener('click', confirmRename);
    cancelBtn.addEventListener('click', cancelRename);

    // 回车确认，ESC取消
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        confirmRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelRename();
      }
    });

    // 点击外部关闭
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (!inputContainer.contains(e.target as Node)) {
        cancelRename();
        document.removeEventListener('click', closeOnOutsideClick);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeOnOutsideClick);
    }, 100);
  }

  /**
   * 更新标签标题
   */
  async updateTabTitle(tab: TabInfo, newTitle: string) {
    try {
      // 更新本地标签数据
      const tabIndex = this.firstPanelTabs.findIndex(t => t.blockId === tab.blockId);
      if (tabIndex !== -1) {
        this.firstPanelTabs[tabIndex].title = newTitle;
        
        // 保存数据
        this.saveFirstPanelTabs();
        
        // 更新UI
        this.debouncedUpdateTabsUI();
        
        console.log(`📝 标签重命名: "${tab.title}" -> "${newTitle}"`);
        
        // 可选：同时更新块的别名（如果需要同步到Orca）
        // await this.updateBlockAlias(tab.blockId, newTitle);
      }
    } catch (e) {
      console.error("重命名标签失败:", e);
    }
  }

  /**
   * 为标签添加Orca原生ContextMenu
   */
  addOrcaContextMenu(tabElement: HTMLElement, tab: TabInfo) {
    // 检查Orca组件是否可用
    const React = (window as any).React;
    const ReactDOM = (window as any).ReactDOM;
    
    if (!React || !ReactDOM || !orca.components.ContextMenu || !orca.components.Menu || !orca.components.MenuText) {
      console.warn("Orca组件不可用，回退到原生右键菜单");
      // 回退到原生实现
      tabElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.showTabContextMenu(e, tab);
      });
      return;
    }

    // 创建ContextMenu容器
    const menuContainer = document.createElement('div');
    menuContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    `;
    tabElement.appendChild(menuContainer);

    // 创建ContextMenu组件
    const ContextMenu = orca.components.ContextMenu;
    const Menu = orca.components.Menu;
    const MenuText = orca.components.MenuText;
    const MenuSeparator = orca.components.MenuSeparator;

    const contextMenuElement = React.createElement(ContextMenu, {
      menu: (close: () => void) => {
        return React.createElement(Menu, {}, [
          React.createElement(MenuText, {
            key: 'rename',
            title: '重命名标签',
            preIcon: 'ti ti-edit',
            shortcut: 'F2',
            onClick: () => {
              close();
              this.renameTab(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'pin',
            title: tab.isPinned ? '取消固定' : '固定标签',
            preIcon: tab.isPinned ? 'ti ti-pin-off' : 'ti ti-pin',
            shortcut: 'Ctrl+P',
            onClick: () => {
              close();
              this.toggleTabPinStatus(tab);
            }
          }),
          React.createElement(MenuSeparator, { key: 'separator1' }),
          React.createElement(MenuText, {
            key: 'close',
            title: '关闭标签',
            preIcon: 'ti ti-x',
            shortcut: 'Ctrl+W',
            disabled: this.firstPanelTabs.length <= 1,
            onClick: () => {
              close();
              this.closeTab(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'closeOthers',
            title: '关闭其他标签',
            preIcon: 'ti ti-x',
            disabled: this.firstPanelTabs.length <= 1,
            onClick: () => {
              close();
              this.closeOtherTabs(tab);
            }
          }),
          React.createElement(MenuText, {
            key: 'closeAll',
            title: '关闭全部标签',
            preIcon: 'ti ti-x',
            disabled: this.firstPanelTabs.length <= 1,
            onClick: () => {
              close();
              this.closeAllTabs();
            }
          })
        ]);
      }
    }, (openMenu: (e: React.UIEvent) => void, closeMenu: () => void) => {
      // 创建一个透明的覆盖层来捕获右键事件
      const overlay = React.createElement('div', {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto',
          background: 'transparent'
        },
        onContextMenu: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          openMenu(e);
        }
      });
      return overlay;
    });

    // 渲染ContextMenu
    ReactDOM.render(contextMenuElement, menuContainer);

    // 清理函数
    const cleanup = () => {
      ReactDOM.unmountComponentAtNode(menuContainer);
      menuContainer.remove();
    };

    // 在标签元素被移除时清理
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
          if (node === tabElement) {
            cleanup();
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * 显示标签右键菜单（原生实现，作为备选）
   */
  showTabContextMenu(e: MouseEvent, tab: TabInfo) {
    // 移除现有的右键菜单
    const existingMenu = document.querySelector('.tab-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // 创建右键菜单
    const menu = document.createElement('div');
    menu.className = 'tab-context-menu';
    menu.style.cssText = `
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
    `;

    // 菜单项
    const menuItems = [
      {
        text: '重命名标签',
        action: () => this.renameTab(tab)
      },
      {
        text: tab.isPinned ? '取消固定' : '固定标签',
        action: () => this.toggleTabPinStatus(tab)
      },
      {
        text: '关闭标签',
        action: () => this.closeTab(tab),
        disabled: this.firstPanelTabs.length <= 1
      },
      {
        text: '关闭其他标签',
        action: () => this.closeOtherTabs(tab),
        disabled: this.firstPanelTabs.length <= 1
      },
      {
        text: '关闭全部标签',
        action: () => this.closeAllTabs(),
        disabled: this.firstPanelTabs.length <= 1
      }
    ];

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.cssText = `
        padding: 8px 12px;
        cursor: pointer;
        font-size: 12px;
        color: ${item.disabled ? '#999' : '#333'};
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
      `;
      
      if (!item.disabled) {
        menuItem.addEventListener('mouseenter', () => {
          menuItem.style.backgroundColor = '#f0f0f0';
        });
        menuItem.addEventListener('mouseleave', () => {
          menuItem.style.backgroundColor = 'transparent';
        });
        menuItem.addEventListener('click', () => {
          item.action();
          menu.remove();
        });
      }
      
      menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    // 点击其他地方关闭菜单
    const closeMenu = (event: MouseEvent) => {
      if (!menu.contains(event.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 100);
  }



  /**
   * 保存第一个面板的标签数据到持久化存储（按库分别存储）
   */
  saveFirstPanelTabs() {
    try {
      const storageKey = this.getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(this.firstPanelTabs));
      console.log(`💾 保存标签数据到: ${storageKey}`);
    } catch (e) {
      console.warn("无法保存第一个面板标签数据:", e);
    }
  }

  /**
   * 保存已关闭标签列表到持久化存储
   */
  saveClosedTabs() {
    try {
      const storageKey = this.getClosedTabsStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(Array.from(this.closedTabs)));
      console.log(`💾 保存已关闭标签列表到: ${storageKey}`);
    } catch (e) {
      console.warn("无法保存已关闭标签列表:", e);
    }
  }

  /**
   * 从持久化存储恢复第一个面板的标签数据（按库分别恢复）
   */
  restoreFirstPanelTabs() {
    try {
      const storageKey = this.getStorageKey();
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        this.firstPanelTabs = JSON.parse(saved);
        console.log(`📂 从 ${storageKey} 恢复了 ${this.firstPanelTabs.length} 个标签页`);
      } else {
        this.firstPanelTabs = [];
        console.log(`📂 ${storageKey} 没有保存的标签页数据`);
      }
    } catch (e) {
      console.warn("无法恢复第一个面板标签数据:", e);
      this.firstPanelTabs = [];
    }
  }

  /**
   * 从持久化存储恢复已关闭标签列表
   */
  restoreClosedTabs() {
    try {
      const storageKey = this.getClosedTabsStorageKey();
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        this.closedTabs = new Set(JSON.parse(saved));
        console.log(`📂 从 ${storageKey} 恢复了 ${this.closedTabs.size} 个已关闭标签`);
      } else {
        this.closedTabs = new Set();
        console.log(`📂 ${storageKey} 没有保存的已关闭标签数据`);
      }
    } catch (e) {
      console.warn("无法恢复已关闭标签列表:", e);
      this.closedTabs = new Set();
    }
  }

  /**
   * 获取当前库的存储键（基于repo ID）
   */
  getStorageKey(): string {
    try {
      // 尝试获取当前库的repo信息
      const repo = orca.state.repo;
      if (repo && typeof repo === 'string') {
        console.log(`📦 使用repo作为存储键: ${repo}`);
        return `orca-first-panel-tabs-repo-${repo}`;
      }
    } catch (e) {
      console.warn("无法获取repo信息:", e);
    }
    
    // 备选方案：尝试从URL提取repo信息
    try {
      const url = window.location.href;
      // 尝试从URL中提取可能的repo标识
      const urlMatch = url.match(/\/repo\/([^\/]+)/);
      if (urlMatch && urlMatch[1]) {
        const repoFromUrl = urlMatch[1];
        console.log(`📦 从URL提取repo标识: ${repoFromUrl}`);
        return `orca-first-panel-tabs-repo-${repoFromUrl}`;
      }
      
      // 如果没有明确的repo信息，使用URL哈希
      const urlHash = this.hashString(url);
      console.log(`📦 使用URL哈希作为备选: ${urlHash}`);
      return `orca-first-panel-tabs-url-${urlHash}`;
    } catch (e) {
      console.warn("无法从URL提取repo信息:", e);
    }
    
    // 最后备选：使用页面标题
    try {
      const title = document.title || 'default';
      const titleHash = this.hashString(title);
      console.log(`📦 使用页面标题作为最后备选: ${titleHash}`);
      return `orca-first-panel-tabs-title-${titleHash}`;
    } catch (e) {
      console.warn("无法获取页面标题:", e);
    }
    
    // 最后的最后备选：使用默认键
    console.log("📦 使用默认存储键");
    return 'orca-first-panel-tabs-default';
  }

  /**
   * 获取已关闭标签列表的存储键
   */
  getClosedTabsStorageKey(): string {
    const baseKey = this.getStorageKey();
    return baseKey.replace('orca-first-panel-tabs-', 'orca-closed-tabs-');
  }

  /**
   * 简单的字符串哈希函数
   */
  hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString(36);
  }






  startDrag(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation(); // 强制阻止窗口拖拽
    
    this.isDragging = true;
    this.dragStartX = e.clientX - this.position.x;
    this.dragStartY = e.clientY - this.position.y;

    // 使用箭头函数绑定this
    const handleMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      this.drag(event);
    };
    
    const handleMouseUp = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      this.stopDrag();
    };

    document.addEventListener('mousemove', handleMouseMove, { capture: true });
    document.addEventListener('mouseup', handleMouseUp, { capture: true });
    
    if (this.tabContainer) {
      this.tabContainer.style.cursor = 'grabbing';
    }
  }

  drag(e: MouseEvent) {
    if (!this.isDragging || !this.tabContainer) return;

    e.preventDefault();
    
    this.position.x = e.clientX - this.dragStartX;
    this.position.y = e.clientY - this.dragStartY;

    // 获取容器的实际尺寸
    const containerRect = this.tabContainer.getBoundingClientRect();
    
    // 限制在窗口范围内，考虑实际容器大小
    const minX = 5; // 留一点边距
    const maxX = window.innerWidth - containerRect.width - 5;
    const minY = 5;
    const maxY = window.innerHeight - containerRect.height - 5;
    
    this.position.x = Math.max(minX, Math.min(maxX, this.position.x));
    this.position.y = Math.max(minY, Math.min(maxY, this.position.y));

    // 只移动标签容器
    this.tabContainer.style.left = this.position.x + 'px';
    this.tabContainer.style.top = this.position.y + 'px';
  }

  stopDrag() {
    this.isDragging = false;
    
    if (this.tabContainer) {
      this.tabContainer.style.cursor = 'default';
    }

    // 保存位置
    this.savePosition();
  }

  savePosition() {
    try {
      localStorage.setItem('orca-tabs-position', JSON.stringify(this.position));
    } catch (e) {
      console.warn("无法保存标签位置");
    }
  }

  restorePosition() {
    try {
      const saved = localStorage.getItem('orca-tabs-position');
      if (saved) {
        this.position = JSON.parse(saved);
        // 确保恢复的位置在有效范围内
        this.constrainPosition();
      }
    } catch (e) {
      console.warn("无法恢复标签位置");
    }
  }

  /**
   * 将位置限制在窗口边界内
   */
  constrainPosition() {
    // 保守估计容器大小（如果还没有创建）
    const estimatedWidth = 400;
    const estimatedHeight = 40;
    
    const minX = 0; // 允许紧靠左边缘
    const maxX = window.innerWidth - estimatedWidth;
    const minY = 0; // 允许紧靠上边缘
    const maxY = window.innerHeight - estimatedHeight;
    
    this.position.x = Math.max(minX, Math.min(maxX, this.position.x));
    this.position.y = Math.max(minY, Math.min(maxY, this.position.y));
  }

  /**
   * 检查新添加的块
   */
  async checkForNewBlocks() {
    if (this.panelIds.length === 0 || !this.isInitialized) return;
    
    // 如果是第一个面板，更新固化标签页
    if (this.currentPanelIndex === 0) {
      await this.checkFirstPanelBlocks();
    } else {
      // 如果是其他面板，更新实时显示
      this.debouncedUpdateTabsUI();
    }
  }

  /**
   * 检查第一个面板的当前激活页面
   */
  async checkFirstPanelBlocks() {
    const firstPanelId = this.panelIds[0];
    const firstPanel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!firstPanel) return;
    
    // 只获取当前激活的页面（最上面的）
    const activeBlockEditor = firstPanel.querySelector('.orca-hideable:not([style*="display: none"]) .orca-block-editor[data-block-id]');
    if (!activeBlockEditor) {
      console.log("第一个面板中没有找到激活的块编辑器");
      return;
    }

    const blockId = activeBlockEditor.getAttribute('data-block-id');
    if (!blockId) {
      console.log("激活的块编辑器没有blockId");
      return;
    }

    // 检查是否已经存在这个标签页
    const existingTab = this.firstPanelTabs.find(tab => tab.blockId === blockId);
    if (existingTab) {
      // 如果已经存在，不需要添加
      console.log(`📋 当前激活页面已存在: "${existingTab.title}"`);
      return;
    }

    // 获取当前激活页面的标签信息
    const tabInfo = await this.getTabInfo(blockId, firstPanelId, this.firstPanelTabs.length);
    if (tabInfo) {
      console.log(`📋 检测到新的激活页面: "${tabInfo.title}"`);
      
      if (this.firstPanelTabs.length >= this.maxTabs) {
        // 达到上限，替换最后一个非固定标签页
        const lastNonPinnedIndex = this.findLastNonPinnedTabIndex();
        if (lastNonPinnedIndex !== -1) {
          const replacedTab = this.firstPanelTabs[lastNonPinnedIndex];
          this.firstPanelTabs[lastNonPinnedIndex] = tabInfo;
          console.log(`🔄 标签页达到上限，替换最后一个标签: "${replacedTab.title}" -> "${tabInfo.title}"`);
        } else {
          // 如果所有标签都是固定的，则跳过新标签
          console.log(`⚠️ 所有标签都是固定的，无法添加新标签: "${tabInfo.title}"`);
          return;
        }
      } else {
        // 未达到上限，直接添加
        this.firstPanelTabs.push(tabInfo);
        console.log(`➕ 添加新标签: ${tabInfo.title} (ID: ${blockId})`);
      }
      
      // 如果标签页重新显示，从已关闭列表中移除
      if (this.closedTabs.has(blockId)) {
        this.closedTabs.delete(blockId);
        this.saveClosedTabs();
        console.log(`🔄 标签 "${tabInfo.title}" 重新显示，从已关闭列表中移除`);
      }
      
      // 保存更新后的数组
      this.saveFirstPanelTabs();
      this.debouncedUpdateTabsUI();
    } else {
      console.log("无法获取激活页面的标签信息");
    }
  }

  observeChanges() {
    // 监听DOM变化以更新标签和面板
    const observer = new MutationObserver(async (mutations) => {
      let shouldCheckNewBlocks = false;
      let shouldCheckNewPanels = false;
      
      let needsCurrentPanelUpdate = false;
      let oldIndex = this.currentPanelIndex;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const target = mutation.target as Element;
          
          // 检查是否有新的面板添加
          if (target.classList.contains('orca-panels-row') || 
              target.closest('.orca-panels-row')) {
            console.log("🔍 检测到面板行变化，检查新面板...");
            shouldCheckNewPanels = true;
          }
          
          // 检查是否有新的块编辑器添加到任何面板
          if (mutation.addedNodes.length > 0) {
            // 检查是否在任何面板内
            const isInAnyPanel = target.closest('.orca-panel');
            
            if (isInAnyPanel) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  // 检查是否添加了新的块编辑器
                  if (element.classList.contains('orca-block-editor') || 
                      element.querySelector('.orca-block-editor')) {
                    shouldCheckNewBlocks = true;
                    break;
                  }
                }
              }
            }
          }
        }
        
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // 检查面板激活状态变化，更新当前面板索引
          const target = mutation.target as Element;
          if (target.classList.contains('orca-panel')) {
            needsCurrentPanelUpdate = true;
          }
        }
      });

      // 处理面板切换
      if (needsCurrentPanelUpdate) {
        await this.updateCurrentPanelIndex();
        
        // 如果面板索引发生变化，立即更新标签页显示
        if (oldIndex !== this.currentPanelIndex) {
          console.log(`🔄 面板切换: ${oldIndex} -> ${this.currentPanelIndex}`);
          this.debouncedUpdateTabsUI();
        }
      }

      if (shouldCheckNewPanels) {
        // 检查新面板
        setTimeout(async () => {
          await this.checkForNewPanels();
        }, 100);
      }


      if (shouldCheckNewBlocks) {
        // 仅检查第一个面板的新增块
        setTimeout(async () => {
          await this.checkForNewBlocks();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /**
   * 检查新添加的面板
   */
  async checkForNewPanels() {
    const oldPanelCount = this.panelIds.length;
    const oldPanelIds = [...this.panelIds]; // 保存旧的面板ID列表
    const oldCurrentPanelId = this.currentPanelId;
    
    this.discoverPanels();
    
    if (this.panelIds.length > oldPanelCount) {
      console.log(`🎉 发现新面板！从 ${oldPanelCount} 个增加到 ${this.panelIds.length} 个`);
      
      // 重新创建UI以显示循环切换器
      await this.createTabsUI();
    } else if (this.panelIds.length < oldPanelCount) {
      console.log(`📉 面板数量减少！从 ${oldPanelCount} 个减少到 ${this.panelIds.length} 个`);
      console.log(`📋 旧面板列表: [${oldPanelIds.join(', ')}]`);
      console.log(`📋 新面板列表: [${this.panelIds.join(', ')}]`);
      
      // 检查第一个面板是否发生了变化
      const oldFirstPanelId = oldPanelIds[0];
      const newFirstPanelId = this.panelIds[0];
      
      if (oldFirstPanelId && newFirstPanelId && oldFirstPanelId !== newFirstPanelId) {
        console.log(`🔄 第一个面板已变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
        await this.handleFirstPanelChange(oldFirstPanelId, newFirstPanelId);
      }
      
      // 检查当前面板是否还存在
      if (this.currentPanelId && !this.panelIds.includes(this.currentPanelId)) {
        console.log(`🔄 当前面板 ${this.currentPanelId} 已关闭，切换到第一个面板`);
        this.currentPanelIndex = 0;
        this.currentPanelId = this.panelIds[0];
      }
      
      // 重新创建UI
      await this.createTabsUI();
    }
  }

  /**
   * 更新当前面板索引
   */
  async updateCurrentPanelIndex() {
    const activePanel = document.querySelector('.orca-panel.active');
    if (activePanel) {
      const panelId = activePanel.getAttribute('data-panel-id');
      if (panelId) {
        const index = this.panelIds.indexOf(panelId);
        if (index !== -1) {
          this.currentPanelIndex = index;
          this.currentPanelId = panelId;
          this.debouncedUpdateTabsUI();
        }
      }
    }
  }

  /**
   * 监听窗口大小变化
   */
  observeWindowResize() {
    window.addEventListener('resize', () => {
      // 延迟一点，确保窗口大小已经更新
      setTimeout(() => {
        this.constrainPosition();
        this.updateUIPositions();
      }, 100);
    });
  }

  /**
   * 启动主动的面板状态监控
   */
  startActiveMonitoring() {
    // 1. 定期检查面板状态（每2秒，大幅减少频率）
    this.monitoringInterval = setInterval(async () => {
      await this.checkPanelStatusChange();
    }, 2000);
    
    // 2. 监听全局点击事件，可能触发面板切换（使用防抖）
    this.clickListener = async (e: Event) => {
      // 使用防抖，避免频繁触发
      setTimeout(() => {
        this.debouncedCheckPanelStatus();
      }, 100);
    };
    document.addEventListener('click', this.clickListener);
    
    // 3. 监听键盘事件，可能有快捷键切换或关闭面板
    this.keyListener = async (e: KeyboardEvent) => {
      // 特别关注可能关闭面板的快捷键
      const isPanelCloseKey = (e.ctrlKey || e.metaKey) && e.key === 'w';
      const isEscapeKey = e.key === 'Escape';
      
      
      if (isPanelCloseKey || isEscapeKey) {
        console.log(`⌨️ 检测到可能关闭面板的快捷键: ${e.key} (Ctrl/Cmd: ${e.ctrlKey || e.metaKey})`);
        // 重要操作立即检查
        setTimeout(() => {
          this.debouncedCheckPanelStatus();
        }, 50);
      } else {
        // 其他键盘事件延迟检查
        setTimeout(() => {
          this.debouncedCheckPanelStatus();
        }, 200);
      }
    };
    document.addEventListener('keydown', this.keyListener);
  }


  /**
   * 防抖的面板状态检查
   */
  debouncedCheckPanelStatus() {
    // 清除之前的计时器
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }
    
    // 设置新的计时器
    this.updateDebounceTimer = setTimeout(async () => {
      await this.checkPanelStatusChange();
    }, 50); // 50ms防抖
  }

  /**
   * 检查面板状态是否发生变化
   */
  async checkPanelStatusChange() {
    // 快速检查面板数量是否变化
    const currentPanelCount = document.querySelectorAll('.orca-panel:not([data-menu-panel="true"])').length;
    
    // 如果面板数量没有变化，跳过完整发现
    if (currentPanelCount === this.panelIds.length && this.panelDiscoveryCache) {
      const cacheAge = Date.now() - this.panelDiscoveryCache.timestamp;
      if (cacheAge < 3000) { // 缓存3秒内有效
        console.log("📋 面板数量未变化，跳过面板发现");
        return;
      }
    }
    
    // 首先重新扫描面板，检查是否有面板被关闭
    const oldPanelIds = [...this.panelIds];
    this.discoverPanels();
    
    // 检查面板列表是否发生变化
    const panelListChanged = oldPanelIds.length !== this.panelIds.length || 
      !oldPanelIds.every((id, index) => id === this.panelIds[index]);
    
    if (panelListChanged) {
      console.log(`📋 面板列表发生变化: ${oldPanelIds.length} -> ${this.panelIds.length}`);
      console.log(`📋 旧面板列表: [${oldPanelIds.join(', ')}]`);
      console.log(`📋 新面板列表: [${this.panelIds.join(', ')}]`);
      
      // 检查第一个面板是否被关闭
      const oldFirstPanelId = oldPanelIds[0];
      const newFirstPanelId = this.panelIds[0];
      
      if (oldFirstPanelId && newFirstPanelId && oldFirstPanelId !== newFirstPanelId) {
        console.log(`🔄 第一个面板已变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
        console.log(`🔄 变更前状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`);
        // 将新的第一个面板设置为固化面板，并迁移/清空原有数据
        await this.handleFirstPanelChange(oldFirstPanelId, newFirstPanelId);
        console.log(`🔄 变更后状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`);
      }
    }
    
    const activePanel = document.querySelector('.orca-panel.active');
    if (activePanel) {
      const panelId = activePanel.getAttribute('data-panel-id');
      if (panelId && (panelId !== this.currentPanelId || panelListChanged)) {
        // 面板发生了切换或面板列表发生变化
        const oldIndex = this.currentPanelIndex;
        const newIndex = this.panelIds.indexOf(panelId);
        
        if (newIndex !== -1) {
          console.log(`🔄 检测到面板切换: ${this.currentPanelId} -> ${panelId} (索引: ${oldIndex} -> ${newIndex})`);
          
          this.currentPanelIndex = newIndex;
          this.currentPanelId = panelId;
          
          // 更新UI（使用防抖）
          this.debouncedUpdateTabsUI();
        }
      }
    }
  }

  /**
   * 处理第一个面板变更（当原第一个面板被关闭时）
   */
  async handleFirstPanelChange(oldFirstPanelId: string, newFirstPanelId: string) {
    console.log(`🔄 处理第一个面板变更: ${oldFirstPanelId} -> ${newFirstPanelId}`);
    console.log(`🔄 当前面板状态: currentPanelId=${this.currentPanelId}, currentPanelIndex=${this.currentPanelIndex}`);
    
    // 清空旧的固化标签数据（因为对应的面板已经不存在了）
    console.log(`🗑️ 清空旧面板 ${oldFirstPanelId} 的固化标签数据`);
    this.firstPanelTabs = [];
    
    // 扫描新的第一个面板，创建新的固化标签
    console.log(`🔍 为新的第一个面板 ${newFirstPanelId} 创建固化标签`);
    await this.scanFirstPanel();
    
    // 保存新的固化标签数据
    this.saveFirstPanelTabs();
    
    // 立即更新UI显示新的固化标签
    console.log(`🎨 立即更新UI显示新的固化标签`);
    await this.updateTabsUI();
    
    console.log(`✅ 第一个面板变更处理完成，新建了 ${this.firstPanelTabs.length} 个固化标签`);
    console.log(`✅ 新的固化标签:`, this.firstPanelTabs.map(tab => `${tab.title}(${tab.blockId})`));
  }

  /**
   * 更新UI元素位置
   */
  updateUIPositions() {
    if (this.tabContainer) {
      this.tabContainer.style.left = this.position.x + 'px';
      this.tabContainer.style.top = this.position.y + 'px';
    }
  }

  /**
   * 重置插件缓存
   */
  async resetCache() {
    console.log("🔄 开始重置插件缓存...");
    
    // 清空固化标签数据
    this.firstPanelTabs = [];
    
    // 清空已关闭标签列表
    this.closedTabs.clear();
    
    // 清空localStorage中的缓存数据
    try {
      const storageKey = this.getStorageKey();
      const closedTabsKey = this.getClosedTabsStorageKey();
      localStorage.removeItem(storageKey);
      localStorage.removeItem(closedTabsKey);
      console.log(`🗑️ 已删除localStorage缓存: ${storageKey}`);
      console.log(`🗑️ 已删除已关闭标签缓存: ${closedTabsKey}`);
    } catch (e) {
      console.warn("删除localStorage缓存失败:", e);
    }
    
    // 重新扫描第一个面板
    if (this.panelIds.length > 0) {
      console.log("🔍 重新扫描第一个面板...");
      await this.scanFirstPanel();
      this.saveFirstPanelTabs();
    }
    
    // 更新UI
    await this.updateTabsUI();
    
    console.log("✅ 插件缓存重置完成");
  }

  destroy() {
    // 清理UI元素
    if (this.tabContainer) {
      this.tabContainer.remove();
      this.tabContainer = null;
    }
    if (this.cycleSwitcher) {
      this.cycleSwitcher.remove();
      this.cycleSwitcher = null;
    }
    
    // 清理拖拽样式
    const dragStyles = document.getElementById('orca-tabs-drag-styles');
    if (dragStyles) {
      dragStyles.remove();
    }
    
    // 清理计时器
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
      this.updateDebounceTimer = null;
    }
    if (this.swapDebounceTimer) {
      clearTimeout(this.swapDebounceTimer);
      this.swapDebounceTimer = null;
    }
    
    // 清理监听器
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
      this.clickListener = null;
    }
    if (this.keyListener) {
      document.removeEventListener('keydown', this.keyListener);
      this.keyListener = null;
    }
    if (this.dragEndListener) {
      document.removeEventListener('dragend', this.dragEndListener);
      this.dragEndListener = null;
    }
    if (this.themeChangeListener) {
      this.themeChangeListener();
      this.themeChangeListener = null;
    }
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
    
    // 清理拖拽状态
    this.draggingTab = null;
  }
}

let tabsPlugin: OrcaTabsPlugin | null = null;

export async function load(_name: string) {
  pluginName = _name;

  setupL10N(orca.state.locale, { "zh-CN": zhCN });

  // 初始化标签页插件
  tabsPlugin = new OrcaTabsPlugin();
  
  // 等待DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => tabsPlugin?.init(), 500);
    });
  } else {
    setTimeout(() => tabsPlugin?.init(), 500);
  }

  // 注册重置缓存命令
  orca.commands.registerCommand(
    `${pluginName}.resetCache`,
    async () => {
      if (tabsPlugin) {
        await tabsPlugin.resetCache();
        orca.notify("success", "插件缓存已重置", {
          title: "Orca Tabs Plugin"
        });
      }
    },
    "重置插件缓存"
  );

  console.log(t("标签页插件已启动"));
  console.log(`${pluginName} loaded.`);
}

export async function unload() {
  // Clean up any resources used by the plugin here.
  if (tabsPlugin) {
    tabsPlugin.destroy();
    tabsPlugin = null;
  }
  
  // 注销重置缓存命令
  orca.commands.unregisterCommand(`${pluginName}.resetCache`);
}
