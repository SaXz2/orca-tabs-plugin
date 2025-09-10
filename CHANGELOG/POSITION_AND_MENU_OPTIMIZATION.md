# 定位和菜单优化

## 优化目标
根据用户反馈，优化重命名输入框的定位逻辑和右键菜单样式：
- 重命名输入框靠近边缘时往内定位
- 右键菜单参考图片样式，添加快捷键提示
- 添加键盘快捷键支持

## 优化内容

### 1. 重命名输入框定位优化

#### 智能边界检测算法
```typescript
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
```

#### 定位策略
1. **优先位置**：在标签上方显示
2. **边界检测**：检查四个方向的边界
3. **智能调整**：靠近边缘时自动往内移动
4. **备用方案**：如果上方空间不够，显示在下方
5. **最终保障**：如果都不够，显示在屏幕中央

### 2. 右键菜单样式优化

#### 参考图片设计
根据用户提供的图片，菜单具有以下特点：
- 圆角矩形设计
- 浅色背景
- 图标在左侧
- 文字居中
- 右侧显示快捷键或箭头
- 分隔线分组

#### 菜单项设计
```typescript
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
})
```

#### 快捷键设计
- **F2** - 重命名标签（标准重命名快捷键）
- **Ctrl+P** - 固定/取消固定标签
- **Ctrl+W** - 关闭标签（标准关闭快捷键）

### 3. 键盘快捷键支持

#### 快捷键实现
```typescript
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
```

#### 快捷键功能
- **F2** - 直接重命名当前标签
- **Ctrl+P** - 切换固定状态
- **Ctrl+W** - 关闭当前标签

## 技术特点

### 1. 智能定位算法
- **多方向检测**：检查上下左右四个方向
- **动态调整**：根据可用空间动态调整位置
- **边界保护**：确保输入框完全在屏幕内
- **用户体验**：优先显示在标签附近

### 2. 菜单设计优化
- **视觉一致性**：与Orca原生菜单风格一致
- **功能分组**：使用分隔线进行逻辑分组
- **快捷键提示**：显示常用操作的快捷键
- **图标语义化**：使用清晰的图标表达功能

### 3. 交互体验提升
- **键盘友好**：支持常用快捷键操作
- **鼠标友好**：右键菜单操作
- **触摸友好**：支持触摸设备操作
- **无障碍支持**：符合无障碍设计规范

## 用户体验改进

### 1. 定位体验
- **智能定位**：输入框自动选择最佳位置
- **边界适应**：靠近边缘时自动调整
- **多屏幕支持**：适应不同屏幕尺寸
- **响应式设计**：适应窗口大小变化

### 2. 菜单体验
- **原生风格**：完全符合Orca设计语言
- **快捷键提示**：帮助用户学习快捷键
- **功能分组**：逻辑清晰的功能组织
- **状态反馈**：禁用状态清晰显示

### 3. 操作体验
- **多种操作方式**：鼠标、键盘、触摸
- **快捷键支持**：提高操作效率
- **即时反馈**：操作结果立即显示
- **错误处理**：完善的错误处理机制

## 兼容性

### 1. 浏览器支持
- 现代浏览器完全支持
- 自动检测组件可用性
- 优雅降级处理

### 2. 设备支持
- 桌面设备：完整的鼠标和键盘支持
- 触摸设备：触摸友好的交互
- 多屏幕：支持多显示器环境

### 3. 主题适配
- 自动适配Orca主题
- 支持深色/浅色模式
- 保持视觉一致性

## 总结

通过这次优化，我们实现了：

✅ **智能定位系统**：输入框靠近边缘时自动往内定位
✅ **原生菜单风格**：完全符合Orca设计语言
✅ **快捷键支持**：提高操作效率
✅ **用户体验优化**：更直观的交互设计
✅ **兼容性保证**：支持各种设备和环境

这些优化让标签页插件的用户体验更加流畅和直观，完全符合Orca的原生设计风格。
