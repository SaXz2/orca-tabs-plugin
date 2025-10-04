# BUG修复测试说明

## 修复的问题
修复了Ctrl+左键点击块引用打开新标签页时，导致标签页重复的BUG。

## 问题描述
- 用户在页面A上Ctrl+左键点击块引用B
- 系统创建新标签页B，但聚焦到了B页面
- 当用户点击其他页面C时，之前聚焦的页面A也变成了B页面
- 结果：标签页列表变成了 B, B, C 而不是预期的 A, B, C

## 修复方案
1. 在 `openInNewTab` 方法中保存当前聚焦的标签页信息
2. 在 `addTabToPanel` 方法中优先使用保存的聚焦标签ID来确定插入位置
3. 避免在创建新标签页后丢失原始的聚焦状态

## 测试步骤
1. 打开页面A（例如"今天"页面）
2. 在页面A上按住Ctrl+左键点击一个块引用，打开新标签页B
3. 点击页面C（任意其他页面）
4. 检查标签页列表是否正确显示为 A, B, C

## 预期结果
- 标签页列表应该正确显示为 A, B, C
- 不应该出现重复的标签页
- 新标签页B应该插入在原始聚焦标签页A的后面

## 修复的关键代码
```typescript
// 在 openInNewTab 方法中保存当前聚焦标签页
const currentFocusedTab = this.getCurrentActiveTab();
if (currentFocusedTab) {
  this.lastActiveBlockId = currentFocusedTab.blockId;
}

// 在 addTabToPanel 方法中优先使用保存的ID
if (this.lastActiveBlockId) {
  const lastActiveIndex = currentTabs.findIndex(tab => tab.blockId === this.lastActiveBlockId);
  if (lastActiveIndex !== -1) {
    insertIndex = lastActiveIndex + 1;
    this.lastActiveBlockId = null; // 使用后清除
  }
}
```
