# 日志级别修复文档

## 更新日期
2025年10月8日

## 问题描述

用户关闭了调试模式，但控制台仍然输出大量与长按显示切换历史记录相关的日志信息，包括：

- 🖱️ 开始长按标签
- ⏰ 长按触发，开始检查切换历史
- 📋 全局切换历史记录
- 📍 计算悬浮位置
- 📊 标签尺寸
- 🎨 开始创建悬浮标签列表
- ✅ 悬浮标签列表创建完成
- 🖱️ 点击悬浮标签
- 📝 更新全局切换历史

这些日志使用了 `this.log()`，在 INFO 级别就会输出，导致即使关闭调试模式也会显示。

## 解决方案

将所有与长按显示切换历史记录相关的日志从 `this.log()` 改为 `this.verboseLog()`，使其只在 DEBUG 模式下输出。

### 修改的文件

#### 1. `src/main.ts`

修改了 `addLongPressTabListEvents` 方法中的所有日志输出：

```typescript
// 修改前
this.log(`🖱️ 开始长按标签: ${tab.title}`);
this.log(`⏰ 长按触发，开始检查切换历史`);
this.log(`📋 全局切换历史记录: ${globalHistory ? globalHistory.recentTabs.length : 0} 个记录`);
// ... 等等

// 修改后
this.verboseLog(`🖱️ 开始长按标签: ${tab.title}`);
this.verboseLog(`⏰ 长按触发，开始检查切换历史`);
this.verboseLog(`📋 全局切换历史记录: ${globalHistory ? globalHistory.recentTabs.length : 0} 个记录`);
// ... 等等
```

修改了以下日志：
- 开始长按标签
- 拖拽中取消显示悬浮列表
- 长按触发检查切换历史
- 全局切换历史记录数量
- 去重后的历史记录数量
- 没有历史记录的提示
- 计算悬浮位置
- 标签尺寸
- 创建悬浮标签列表
- 悬浮标签列表创建完成
- 点击悬浮标签
- 点击悬浮标签切换
- 删除标签切换历史记录
- 所有带 `[DEBUG]` 标记的日志（约50+处）
- 检测到块类型
- 别名块详细信息
- 替换当前激活标签页
- 面板检查防抖

#### 2. `src/services/tabStorage.ts`

修改了 `TabStorageService` 中与切换历史相关的日志：

```typescript
// 修改前
this.log(`📂 从API配置恢复了 ${Object.keys(saved).length} 个标签的切换历史`);
this.log(`📝 更新全局切换历史: ${fromTabId} -> ${toTab.title} (历史记录数量: ${history.recentTabs.length})`);
// ... 等等

// 修改后
this.verboseLog(`📂 从API配置恢复了 ${Object.keys(saved).length} 个标签的切换历史`);
this.verboseLog(`📝 更新全局切换历史: ${fromTabId} -> ${toTab.title} (历史记录数量: ${history.recentTabs.length})`);
// ... 等等
```

修改了以下日志：
- 从API配置恢复切换历史
- 更新全局切换历史
- 获取标签切换历史
- 标签没有切换历史记录
- 删除标签切换历史记录

## 日志级别说明

### LogLevel.INFO（默认）
- 显示重要的操作信息
- 用户可见的状态变化
- 错误和警告信息

### LogLevel.DEBUG（调试模式）
- 显示所有 INFO 级别的日志
- 显示详细的调试信息
- 显示内部状态变化
- 显示性能相关信息

### 使用建议

- **日常使用**：关闭调试模式（INFO 级别），只显示重要信息
- **问题排查**：开启调试模式（DEBUG 级别），查看详细日志
- **性能分析**：开启调试模式，查看性能相关日志

## 效果

### 修改前（关闭调试模式）
```
[OrcaPlugin] 🖱️ 开始长按标签: 明明只是暗杀者，我的面板数值却比勇者还要强
[OrcaPlugin] ⏰ 长按触发，开始检查切换历史
[OrcaPlugin] 📂 从API配置恢复了 9 个标签的切换历史
[OrcaPlugin] 📋 全局切换历史记录: 10 个记录
[OrcaPlugin] 📋 去重后的历史记录: 10 个记录
[OrcaPlugin] 📍 计算悬浮位置: x=255.3, y=78.76
[OrcaPlugin] 📊 标签尺寸: width=127.4, height=23.52
[OrcaPlugin] 🎨 开始创建悬浮标签列表
[OrcaPlugin] ✅ 悬浮标签列表创建完成
[OrcaPlugin] 🖱️ 点击悬浮标签: 无敌的我是英雄爸爸和精灵妈妈的女儿
[OrcaPlugin] 📝 更新全局切换历史: 218 -> 无敌的我是英雄爸爸和精灵妈妈的女儿 (历史记录数量: 10)
[OrcaPlugin] 🔍 面板检查防抖：距离上次检查 5183ms
[OrcaPlugin] 🔍 检测到块类型: tag (块ID: 91)
[OrcaPlugin] 🏷️ 别名块详细信息: blockId=91, aliases=["🗃️卡盒"], 检测到的类型=tag
[OrcaPlugin] 🔍 [DEBUG] ========== handleNewBlockInPanel 开始 ==========
[OrcaPlugin] 🔍 [DEBUG] 参数: blockId=235, panelId=FHloAYXeM0
[OrcaPlugin] 🔍 [DEBUG] 当前标签页数量: 2
[OrcaPlugin] 🔍 [DEBUG] ❌ 标签 235 不存在，准备创建新标签
[OrcaPlugin] 🔄 替换当前激活标签页: "🗃️卡盒" -> "😶全局中性词"
... (大量日志)
```

### 修改后（关闭调试模式）
```
[OrcaPlugin] 📊 日志级别已设置为: INFO
[OrcaPlugin] 🎯 刷新后恢复聚焦标签页: 关闭
[OrcaPlugin] ✅ 插件设置已注册
[OrcaPlugin] ✅ 已注册块菜单命令: 在新标签页打开
[OrcaPlugin] ✅ 已注册块菜单命令: 添加到已有标签组
[OrcaPlugin] 📁 已加载 1 个工作区
[OrcaPlugin] ✅ 插件初始化完成
```

### 修改后（开启调试模式）
```
[OrcaPlugin] 📊 日志级别已设置为: DEBUG
[OrcaPlugin] 🖱️ 开始长按标签: 明明只是暗杀者，我的面板数值却比勇者还要强
[OrcaPlugin] ⏰ 长按触发，开始检查切换历史
[OrcaPlugin] 📂 从API配置恢复了 9 个标签的切换历史
[OrcaPlugin] 📋 全局切换历史记录: 10 个记录
... (所有详细日志)
```

## 相关代码位置

- `src/main.ts` 第 7337-7417 行：`addLongPressTabListEvents` 方法
- `src/main.ts` 第 7488-7668 行：`addHoverTabListEvents` 方法
- `src/main.ts` 第 7682-7750 行：`addScrollEvents` 方法
- `src/main.ts` 第 2562, 2566 行：块类型检测日志
- `src/main.ts` 第 6727-6920 行：`addTabToPanel` 方法中的 DEBUG 日志
- `src/main.ts` 第 6965-7029 行：`openInNewTab` 方法中的 DEBUG 日志
- `src/main.ts` 第 9682-9757 行：`handleNewBlockInPanel` 方法中的 DEBUG 日志
- `src/main.ts` 第 10264, 10721-10752 行：其他 DEBUG 日志
- `src/services/tabStorage.ts` 第 492, 543, 558, 561, 638 行：切换历史相关日志

## 测试建议

1. **关闭调试模式测试**
   - 在插件设置中关闭"显示顶部工具栏按钮"
   - 长按标签显示切换历史
   - 验证控制台不再显示详细日志

2. **开启调试模式测试**
   - 在插件设置中开启"显示顶部工具栏按钮"
   - 长按标签显示切换历史
   - 验证控制台显示所有详细日志

## 后续优化建议

1. **日志分类**：将日志按功能模块分类，便于过滤
2. **日志过滤**：添加日志过滤功能，允许用户选择显示哪些模块的日志
3. **日志导出**：添加日志导出功能，便于问题排查
4. **性能日志**：将性能相关日志单独分类，便于性能分析

---

## 相关文档

- [拖拽和滚动改进文档](./drag-and-scroll-improvements.md)
- [悬浮标签列表功能文档](./hover-tab-list-feature.md)
