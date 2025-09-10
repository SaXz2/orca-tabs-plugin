# 标签页重命名功能

## 功能描述
为标签页添加重命名功能，用户可以通过右键菜单重命名标签，提供更好的标签管理体验。

## 功能特性

### 🎯 核心功能
- **右键重命名**：通过右键菜单选择"重命名标签"
- **实时编辑**：弹出输入框进行实时编辑
- **智能定位**：输入框自动定位到标签附近
- **键盘支持**：支持回车确认、ESC取消
- **点击外部关闭**：点击输入框外部自动取消

### 🎨 用户界面
- **美观的输入框**：半透明背景，蓝色边框，圆角设计
- **按钮操作**：确认和取消按钮，带悬停效果
- **自动聚焦**：输入框自动聚焦并选中文本
- **响应式定位**：根据标签位置智能定位输入框

### ⌨️ 交互方式
1. **右键菜单**：右键点击标签 → 选择"重命名标签"
2. **键盘操作**：
   - `Enter`：确认重命名
   - `Escape`：取消重命名
3. **鼠标操作**：
   - 点击"确认"按钮：保存重命名
   - 点击"取消"按钮：取消重命名
   - 点击外部区域：取消重命名

## 实现细节

### 1. 右键菜单集成
在现有的右键菜单中添加重命名选项：
```typescript
const menuItems = [
  {
    text: '重命名标签',
    action: () => this.renameTab(tab)
  },
  // ... 其他菜单项
];
```

### 2. 重命名输入框
创建美观的重命名输入框：
```typescript
showRenameInput(tab: TabInfo) {
  // 创建输入框容器
  const inputContainer = document.createElement('div');
  inputContainer.className = 'tab-rename-input';
  
  // 设置样式：半透明背景、蓝色边框、阴影效果
  inputContainer.style.cssText = `
    position: fixed;
    z-index: 2000;
    background: rgba(255, 255, 255, 0.98);
    border: 2px solid #3b82f6;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    // ... 更多样式
  `;
}
```

### 3. 智能定位
根据标签位置智能定位输入框：
```typescript
// 定位输入框
const tabElement = document.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
if (tabElement) {
  const rect = tabElement.getBoundingClientRect();
  inputContainer.style.left = `${rect.left}px`;
  inputContainer.style.top = `${rect.top - 60}px`;
} else {
  // 如果找不到标签元素，使用屏幕中心
  inputContainer.style.left = '50%';
  inputContainer.style.top = '50%';
  inputContainer.style.transform = 'translate(-50%, -50%)';
}
```

### 4. 事件处理
完整的键盘和鼠标事件处理：
```typescript
// 键盘事件
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
```

### 5. 数据更新
更新标签数据并保存：
```typescript
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
    }
  } catch (e) {
    console.error("重命名标签失败:", e);
  }
}
```

## 技术特点

### 🔧 技术实现
- **DOM操作**：动态创建输入框和按钮
- **事件管理**：完整的键盘和鼠标事件处理
- **状态管理**：正确管理重命名状态
- **数据持久化**：自动保存重命名结果

### 🎨 用户体验
- **直观操作**：右键菜单集成，操作简单
- **视觉反馈**：美观的输入框设计
- **键盘友好**：支持常用键盘快捷键
- **错误处理**：完善的错误处理机制

### 🚀 性能优化
- **防抖更新**：使用防抖机制更新UI
- **事件清理**：正确清理事件监听器
- **内存管理**：及时移除DOM元素

## 使用场景

### 1. 标签管理
- 为标签设置更有意义的名称
- 区分相似的标签内容
- 个性化标签显示

### 2. 工作流程
- 项目标签重命名
- 任务标签分类
- 笔记标签整理

### 3. 团队协作
- 统一标签命名规范
- 提高标签可读性
- 便于标签搜索和识别

## 限制说明

### 当前限制
- **仅第一个面板支持**：只有第一个面板的标签支持重命名
- **本地重命名**：重命名只影响插件内的标签显示，不影响Orca中的块标题
- **单次重命名**：一次只能重命名一个标签

### 未来扩展
- 支持所有面板的标签重命名
- 同步更新Orca中的块别名
- 批量重命名功能
- 重命名历史记录

## 测试验证

### 测试场景
1. **基本重命名**：右键菜单 → 重命名标签 → 输入新名称 → 确认
2. **取消重命名**：开始重命名 → 按ESC或点击取消
3. **键盘操作**：使用Enter确认，ESC取消
4. **外部点击**：点击输入框外部取消重命名
5. **边界情况**：空名称、超长名称、特殊字符

### 预期结果
- 重命名操作流畅
- 输入框定位准确
- 键盘操作正常
- 数据保存正确
- UI更新及时

## 总结

标签重命名功能为插件增加了重要的标签管理能力：

✅ **完整的重命名流程**：从右键菜单到数据保存
✅ **美观的用户界面**：现代化的输入框设计
✅ **丰富的交互方式**：键盘、鼠标、触摸支持
✅ **智能的定位系统**：自动定位到标签附近
✅ **可靠的数据管理**：自动保存和UI更新

这个功能大大提升了标签页插件的实用性，让用户可以更好地管理和组织他们的标签。
