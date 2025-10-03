# 代码重构计划 - Code Refactoring Plan

## 问题分析

当前代码存在严重的重复逻辑问题，主要体现在：

### 1. **块类型检测重复** (detectBlockType)

**现状：**
- ✅ `src/utils/blockUtils.ts` - 已实现完整的块类型检测逻辑
- ❌ `src/main.ts` (L2106-2273) - 完全重复实现了相同逻辑（168行）

**影响：**
- 维护成本翻倍：修复bug需要在两处修改
- 逻辑可能不一致：两处实现可能存在细微差异
- 代码膨胀：增加约168行重复代码

### 2. **文本内容提取重复** (extractTextFromContent)

**现状：**
- ✅ `src/utils/blockProcessingUtils.ts` - 已实现完整的内容提取逻辑
- ❌ `src/main.ts` (L2056-2058) - 调用了工具函数（✅ 这个做法是对的！）

**建议：**
- 这个方法实际上已经正确使用了工具函数，可以考虑直接内联调用

### 3. **块信息获取重复** (getTabInfo)

**现状：**
- ✅ `src/utils/blockProcessingUtils.ts::scanBlock` - 完整的块扫描功能
- ❌ `src/main.ts::getTabInfo` (L2779-2907) - 重复实现了块信息提取（129行）

**问题：**
- `getTabInfo`做了很多`scanBlock`已经做的事情：
  - 调用`detectBlockType`检测块类型
  - 提取标题（日期、别名、内容）
  - 获取图标

### 4. **导航逻辑重复**

**现状：**
- ✅ `src/utils/tabOperationsUtils.ts::performNavigation` - 统一的导航逻辑
- ❌ `src/main.ts` - 多处直接调用`orca.nav.goTo`，没有使用统一方法

**影响：**
- 日期块导航逻辑散落在多处
- 错误处理不一致

### 5. **标签操作重复**

**现状：**
- ✅ `src/utils/tabOperationsUtils.ts` - 提供了完整的标签操作工具：
  - `switchToTab` - 切换标签
  - `createTab` - 创建标签
  - `deleteTab` - 删除标签
  - `updateTab` - 更新标签
- ❌ `src/main.ts` - 在类方法中重新实现了这些逻辑

---

## 重构方案

### 阶段一：清理块类型检测重复 ✅

**目标：** 移除`main.ts`中的`detectBlockType`方法，统一使用`blockUtils.ts`

**步骤：**
1. 验证`blockUtils.ts::detectBlockType`包含所有功能
2. 删除`main.ts::detectBlockType` (L2106-2273)
3. 确保所有调用都使用导入的工具函数

**代码变更：**
```typescript
// ❌ 删除这段重复代码 (main.ts L2106-2273)
async detectBlockType(block: any): Promise<string> {
  try {
    // 168行重复逻辑...
  } catch (e) {
    return 'text';
  }
}

// ✅ 直接使用已导入的工具函数
// import { detectBlockType } from './utils/blockUtils';
// 在需要的地方直接调用 detectBlockType(block)
```

**预计节省：** ~168行代码

---

### 阶段二：重构块信息获取 ✅

**目标：** 简化`getTabInfo`，复用`blockProcessingUtils::scanBlock`

**当前问题：**
```typescript
// main.ts::getTabInfo - 129行代码做了很多重复工作
async getTabInfo(blockId: string, panelId: string, order: number): Promise<TabInfo | null> {
  // 1. 获取块
  const block = await orca.invokeBackend("get-block", parseInt(blockId));
  
  // 2. 检测类型（重复！）
  blockType = await this.detectBlockType(block);
  
  // 3. 提取标题（重复！）
  // 4. 提取图标（重复！）
  // ...
}
```

**重构后：**
```typescript
async getTabInfo(blockId: string, panelId: string, order: number): Promise<TabInfo | null> {
  try {
    // 1. 使用scanBlock获取块信息
    const block = await orca.invokeBackend("get-block", parseInt(blockId));
    if (!block) return null;
    
    const scanResult = await scanBlock(blockId, block);
    
    // 2. 转换为TabInfo格式
    return {
      blockId: scanResult.blockId,
      panelId,
      title: scanResult.title,
      icon: scanResult.icon,
      isJournal: scanResult.isJournal,
      blockType: scanResult.type,
      isPinned: false,
      order,
      color: '' // 从properties中提取
    };
  } catch (e) {
    this.error("获取标签信息失败:", e);
    return null;
  }
}
```

**预计节省：** ~100行代码

---

### 阶段三：统一导航逻辑 ✅

**目标：** 所有导航操作使用`tabOperationsUtils::performNavigation`

**查找并替换：**
```typescript
// ❌ 当前代码散落各处
await orca.nav.goTo("block", { blockId: parseInt(newBlockId) }, panelId);
await orca.nav.goTo("journal", { date: targetDate }, panelId);

// ✅ 统一使用工具函数
import { performNavigation } from './utils/tabOperationsUtils';
await performNavigation(tab, panelId, tab.isJournal);
```

**预计节省：** ~50行代码，提高一致性

---

### 阶段四：标签操作方法整合 ✅

**目标：** 将`main.ts`中的标签操作逻辑迁移到`tabOperationsUtils`或使用已有方法

**当前问题示例：**
```typescript
// main.ts - 手动实现标签切换
private async switchToTab(tab: TabInfo) {
  // 记录滚动位置
  // 更新激活状态
  // 导航
  // 保存数据
  // 更新UI
}
```

**重构建议：**
```typescript
// 使用工具函数 + 插件特定逻辑分离
private async switchToTab(tab: TabInfo) {
  // 1. 调用通用标签切换逻辑
  const result = await switchToTab(tab, this.getCurrentPanelTabs(), {
    recordScrollPosition: true,
    updateLastActive: true
  });
  
  if (!result.success) {
    this.error(result.message);
    return;
  }
  
  // 2. 执行导航
  await performNavigation(tab, this.currentPanelId || '', tab.isJournal);
  
  // 3. 插件特定的UI更新
  await this.updateTabsUI();
  await this.saveCurrentPanelTabs();
}
```

**预计节省：** ~200行代码

---

## 重构优先级

### 🔥 高优先级（建议立即执行）
1. **清理`detectBlockType`重复** - 影响大，改动风险小
2. **简化`getTabInfo`** - 代码量大，维护成本高

### ⚡ 中优先级（分步执行）
3. **统一导航逻辑** - 提高一致性和错误处理
4. **整合标签操作** - 需要仔细测试，但长期收益大

### 💡 低优先级（可选优化）
5. 清理其他小的重复工具函数调用
6. 统一错误处理模式

---

## 预期收益

### 量化指标
- **代码行数减少：** 约500-700行（main.ts从13000+行降至12500行左右）
- **文件大小减少：** 约15-20%
- **维护成本降低：** 修复bug只需改一处

### 质量提升
- ✅ **单一职责原则** - 工具函数专注单一功能
- ✅ **DRY原则** - 消除重复代码
- ✅ **可测试性** - 独立的工具函数更易测试
- ✅ **可维护性** - 逻辑集中，修改影响范围小

---

## 风险评估

### 低风险重构
- 删除`detectBlockType`重复实现 - 已有工具函数完全覆盖

### 中风险重构
- 重构`getTabInfo` - 需要确保`scanBlock`包含所有必要字段
- 统一导航逻辑 - 需要测试各种导航场景

### 建议的测试检查清单
- [ ] 日期块导航正常
- [ ] 普通块导航正常
- [ ] 标签切换无异常
- [ ] 标签创建/删除正常
- [ ] 固定标签功能正常
- [ ] 拖拽排序正常

---

## 下一步行动

建议按以下顺序执行：

1. **立即执行：** 删除`detectBlockType`重复（5分钟）
2. **短期：** 重构`getTabInfo`使用`scanBlock`（30分钟）
3. **中期：** 统一导航逻辑（1小时）
4. **长期：** 整合所有标签操作（2-3小时）

**总估计时间：** 4-5小时
**总代码减少：** 500-700行
**维护成本降低：** 30-40%

---

## 补充说明

当前`utils/`目录结构良好，工具函数已经很完善：
- ✅ `blockUtils.ts` - 块操作
- ✅ `blockProcessingUtils.ts` - 块处理
- ✅ `tabOperationsUtils.ts` - 标签操作
- ✅ `dataUtils.ts` - 数据处理

**问题在于`main.ts`没有充分利用这些工具函数，而是重新实现了很多逻辑。**

重构的核心思路是：
> **main.ts应该专注于插件的业务逻辑和UI交互，底层的数据处理、类型检测、导航逻辑等应该委托给utils工具函数。**

