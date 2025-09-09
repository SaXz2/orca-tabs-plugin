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
  order: number;
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
    
    // 标记初始化完成
    this.isInitialized = true;
    console.log("✅ 插件初始化完成");
  }

  /**
   * 发现所有面板
   */
  discoverPanels() {
    console.log("🔍 开始发现面板...");
    
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
   * 扫描第一个面板的标签页
   */
  async scanFirstPanel() {
    if (this.panelIds.length === 0) return;
    
    const firstPanelId = this.panelIds[0];
    const panel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!panel) return;

    const newTabs: TabInfo[] = [];
    let order = 0;
    const hideableElements = panel.querySelectorAll('.orca-hideable');
    
    for (const hideable of hideableElements) {
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId) continue;

      // 获取标签信息
      const tabInfo = await this.getTabInfo(blockId, firstPanelId, order++);
      if (tabInfo) {
        newTabs.push(tabInfo);
      }
    }
    
    // 合并到第一个面板的标签页
    this.mergeFirstPanelTabs(newTabs);
    
    // 保存到持久化存储
    this.saveFirstPanelTabs();
    
    await this.updateTabsUI();
  }

  /**
   * 合并第一个面板的标签页
   */
  mergeFirstPanelTabs(newTabs: TabInfo[]) {
    const existingBlockIds = new Set(this.firstPanelTabs.map(tab => tab.blockId));
    
    // 只添加不存在的标签，且不超过最大数量
    for (const newTab of newTabs) {
      if (!existingBlockIds.has(newTab.blockId)) {
        // 检查是否已达到最大标签数
        if (this.firstPanelTabs.length >= this.maxTabs) {
          break; // 达到上限，停止添加新标签
        }
        this.firstPanelTabs.push(newTab); // 新标签插入到末尾
      }
    }
    
    // 确保不超过最大数量（防御性编程）
    this.firstPanelTabs = this.firstPanelTabs.slice(0, this.maxTabs);
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
    this.tabContainer.style.cssText = `
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

    console.log(`✅ 标签容器已创建，位置: (${this.position.x}, ${this.position.y})`);

    await this.updateTabsUI();
  }

  /**
   * 防抖更新标签页UI（防止闪烁）
   */
  debouncedUpdateTabsUI() {
    // 清除之前的计时器
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
    }
    
    // 设置新的计时器
    this.updateDebounceTimer = setTimeout(async () => {
      await this.updateTabsUI();
    }, 100); // 100ms防抖
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
    
    // 设置样式
    let backgroundColor = 'rgba(200, 200, 200, 0.6)';
    let textColor = '#333';
    let fontWeight = 'normal';
    
    // 如果有颜色，应用颜色样式
    if (tab.color) {
      backgroundColor = this.hexToRgba(tab.color, 0.25);
      // 使用加深的颜色作为文字颜色，确保可读性
      textColor = this.darkenColor(tab.color, 0.3);
      fontWeight = '600';
    }

    tabElement.style.cssText = `
      background: ${backgroundColor};
      color: ${textColor};
      font-weight: ${fontWeight};
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

    // 设置标签文本
    let displayText = tab.title;
    if (tab.icon) {
      displayText = `${tab.icon} ${tab.title}`;
    }
    tabElement.textContent = displayText;
    tabElement.title = tab.title; // 悬停提示

    // 添加点击事件
    tabElement.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.switchToTab(tab);
    });

    // 添加标签拖拽排序功能
    tabElement.draggable = true;
    tabElement.addEventListener('dragstart', (e) => {
      e.dataTransfer?.setData('text/plain', tab.blockId);
      tabElement.style.opacity = '0.5';
    });

    tabElement.addEventListener('dragend', (e) => {
      tabElement.style.opacity = '1';
    });

    tabElement.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    tabElement.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedBlockId = e.dataTransfer?.getData('text/plain');
      if (draggedBlockId && draggedBlockId !== tab.blockId) {
        this.reorderTabs(draggedBlockId, tab.blockId);
      }
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

  async switchToTab(tab: TabInfo) {
    try {
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
    } catch (e) {
      console.error("切换标签失败:", e);
    }
  }

  /**
   * 重新排序标签（拖拽排序）- 只对第一个面板有效
   */
  async reorderTabs(draggedBlockId: string, targetBlockId: string) {
    if (this.currentPanelIndex !== 0) return; // 只有第一个面板支持排序
    
    const draggedIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === draggedBlockId);
    const targetIndex = this.firstPanelTabs.findIndex(tab => tab.blockId === targetBlockId);
    
    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      // 移动标签
      const draggedTab = this.firstPanelTabs.splice(draggedIndex, 1)[0];
      this.firstPanelTabs.splice(targetIndex, 0, draggedTab);
      
      this.debouncedUpdateTabsUI();
      this.saveFirstPanelTabs(); // 保存用户的拖拽排序
    }
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
    const minX = 10; // 留一点边距
    const maxX = window.innerWidth - containerRect.width - 10;
    const minY = 10;
    const maxY = window.innerHeight - containerRect.height - 10;
    
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
    
    const minX = 10;
    const maxX = window.innerWidth - estimatedWidth - 10;
    const minY = 10;
    const maxY = window.innerHeight - estimatedHeight - 10;
    
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
   * 检查第一个面板的新添加的块（简化版）
   */
  async checkFirstPanelBlocks() {
    const firstPanelId = this.panelIds[0];
    const firstPanel = document.querySelector(`.orca-panel[data-panel-id="${firstPanelId}"]`);
    if (!firstPanel) return;
    
    // 如果已经满了，就不检查新块了
    if (this.firstPanelTabs.length >= this.maxTabs) {
      return;
    }
    
    // 获取现有标签blockId集合
    const existingBlockIds = new Set(this.firstPanelTabs.map(tab => tab.blockId));
    
    // 只扫描新块
    const hideableElements = firstPanel.querySelectorAll('.orca-hideable');
    
    for (const hideable of hideableElements) {
      if (this.firstPanelTabs.length >= this.maxTabs) {
        console.log(`第一个面板已达到最大标签数 ${this.maxTabs}，停止添加`);
        break;
      }
      
      const blockEditor = hideable.querySelector('.orca-block-editor');
      if (!blockEditor) continue;

      const blockId = blockEditor.getAttribute('data-block-id');
      if (!blockId || existingBlockIds.has(blockId)) continue; // 跳过已存在的块
      
      // 新块：直接添加到数组末尾
      const tabInfo = await this.getTabInfo(blockId, firstPanelId, this.firstPanelTabs.length);
      if (tabInfo) {
        this.firstPanelTabs.push(tabInfo);
        console.log(`添加新标签: ${tabInfo.title} (ID: ${blockId})`);
      }
    }
    
    // 保存更新后的数组
    this.saveFirstPanelTabs();
    this.debouncedUpdateTabsUI();
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
    // 1. 定期检查面板状态（每500ms，减少频率避免闪烁）
    this.monitoringInterval = setInterval(async () => {
      await this.checkPanelStatusChange();
    }, 500);
    
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
    
    // 清空localStorage中的缓存数据
    try {
      const storageKey = this.getStorageKey();
      localStorage.removeItem(storageKey);
      console.log(`🗑️ 已删除localStorage缓存: ${storageKey}`);
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
    
    // 清理计时器
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    if (this.updateDebounceTimer) {
      clearTimeout(this.updateDebounceTimer);
      this.updateDebounceTimer = null;
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
