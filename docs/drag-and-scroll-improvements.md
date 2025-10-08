# 拖拽和滚动改进文档

## 更新日期
2025年10月8日

## 改进内容

### 1. 🎯 拖拽时自动关闭悬浮历史列表

#### 问题描述
之前在拖拽标签时，如果长按显示的切换历史记录悬浮列表已经打开，它不会自动关闭，导致界面混乱和交互冲突。

#### 解决方案
- **拖拽开始时自动隐藏**：在标签拖拽开始（`dragstart` 事件）时，自动调用 `hideHoverTabList()` 隐藏悬浮列表
- **长按检测拖拽状态**：在长按事件触发时，检查 `this.draggingTab` 状态，如果正在拖拽则不显示悬浮列表

#### 代码位置
- `src/main.ts` 第 5605 行：拖拽开始时隐藏悬浮列表
- `src/main.ts` 第 7344-7347 行：长按事件中检查拖拽状态

#### 效果
✅ 拖拽时悬浮列表会立即关闭，避免界面混乱
✅ 拖拽过程中不会触发长按显示悬浮列表
✅ 提升用户体验，减少交互冲突

---

### 2. 🎨 优化悬浮列表滚动体验

#### 问题描述
之前的滚动实现是每次滚动固定移动一个条目，在快速滚动时不够流畅，用户体验不佳。

#### 解决方案
采用**累积滚动增量 + requestAnimationFrame**的方式实现平滑滚动：

1. **累积滚动增量**
   - 使用 `accumulatedDelta` 变量累积鼠标滚轮的滚动量
   - 不再每次滚动事件都立即更新，而是累积到一定程度再更新

2. **requestAnimationFrame 优化**
   - 使用 `requestAnimationFrame` 确保滚动更新与浏览器刷新率同步
   - 取消之前的动画帧，避免重复更新

3. **动态计算滚动步长**
   - 根据累积的滚动量动态计算应该滚动多少个条目
   - 每 32 像素（一个标签项的高度）滚动一个条目
   - 支持快速滚动时一次滚动多个条目

4. **保持键盘操作的精确性**
   - 键盘上下箭头键保持原有的一次一个条目的行为
   - 确保精确控制的需求

#### 代码位置
`src/main.ts` 第 7682-7750 行：`addScrollEvents` 方法

#### 技术细节

```typescript
// 累积滚动增量
let accumulatedDelta = 0;
let scrollAnimationFrame: number | null = null;

scrollContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  
  // 累积滚动增量
  accumulatedDelta += e.deltaY;
  
  // 如果已经有动画帧在等待，取消它
  if (scrollAnimationFrame !== null) {
    cancelAnimationFrame(scrollAnimationFrame);
  }
  
  // 使用 requestAnimationFrame 实现平滑滚动
  scrollAnimationFrame = requestAnimationFrame(() => {
    // 计算滚动步长（每32像素滚动一个条目）
    const itemHeight = 32;
    const scrollSteps = Math.round(accumulatedDelta / itemHeight);
    
    if (scrollSteps !== 0) {
      // 更新滚动位置
      const newOffset = Math.max(0, Math.min(scrollOffset + scrollSteps, tabs.length - config.maxDisplayCount));
      
      if (newOffset !== scrollOffset) {
        scrollOffset = newOffset;
        updateHoverTabList(container, tabs, config, onClick, isVerticalMode, scrollOffset);
      }
      
      // 重置累积增量
      accumulatedDelta = 0;
    }
    
    scrollAnimationFrame = null;
  });
});
```

#### 效果
✅ **平滑滚动**：滚动更加流畅自然，没有卡顿感
✅ **快速响应**：快速滚动时可以一次滚动多个条目
✅ **性能优化**：使用 requestAnimationFrame 避免过度渲染
✅ **精确控制**：键盘操作保持精确的一次一个条目

---

## 用户体验提升

### 拖拽场景
- **之前**：拖拽时悬浮列表不关闭，界面混乱
- **现在**：拖拽自动关闭悬浮列表，交互清晰

### 滚动场景
- **之前**：每次只能滚动一个条目，快速滚动不流畅
- **现在**：根据滚动速度动态调整，快速滚动时丝滑流畅

---

## 兼容性

- ✅ 支持所有现代浏览器
- ✅ 兼容水平和垂直布局模式
- ✅ 不影响其他标签页功能
- ✅ 向后兼容，不破坏现有功能

---

## 测试建议

### 拖拽测试
1. 长按标签显示悬浮历史列表
2. 在悬浮列表显示时开始拖拽标签
3. 验证悬浮列表是否自动关闭
4. 验证拖拽过程中长按不会显示悬浮列表

### 滚动测试
1. 长按标签显示悬浮历史列表（确保有超过5个历史记录）
2. 慢速滚动鼠标滚轮，验证是否平滑滚动
3. 快速滚动鼠标滚轮，验证是否能快速浏览
4. 使用键盘上下箭头键，验证是否精确移动一个条目

---

## 性能优化

### Passive Event Listener 修复

**问题：**
浏览器警告 `[Violation] Added non-passive event listener to a scroll-blocking 'wheel' event`

**原因：**
- 在 `wheel` 事件监听器中调用了 `e.preventDefault()`
- 默认情况下，浏览器期望滚动事件是 passive 的（不阻止默认行为）
- 当我们需要阻止默认行为时，必须显式声明 `passive: false`

**解决方案：**
```typescript
scrollContainer.addEventListener('wheel', (e) => {
  e.preventDefault();
  // ... 滚动处理逻辑
}, { passive: false }); // 显式设置 passive: false
```

**效果：**
- ✅ 消除浏览器警告
- ✅ 明确告知浏览器我们需要阻止默认行为
- ✅ 保持滚动功能正常工作

---

## 后续优化建议

1. **滚动指示器**：添加滚动条或指示器显示当前位置
2. **滚动惯性**：添加滚动惯性效果，更接近原生滚动体验
3. **触摸支持**：为触摸设备添加滑动手势支持
4. **可配置性**：将滚动灵敏度作为配置项，允许用户自定义

---

## 相关文件

- `src/main.ts` - 主要实现文件
- `src/utils/uiCreationUtils.ts` - UI创建工具函数
- `docs/hover-tab-list-feature.md` - 悬浮标签列表功能文档
- `docs/log-level-fix.md` - 日志级别修复文档
