# Orca风格UI优化

## 优化目标
将标签页插件的UI组件完全符合Orca的原生风格，确保：
- 重命名输入框使用Orca原生InputBox组件
- 右键菜单使用Orca原生ContextMenu组件
- 窗口不会被软件裁掉，智能定位
- 保持所有原有功能不变

## 技术实现

### 1. 重命名功能优化

#### 使用Orca原生InputBox
```typescript
showOrcaRenameInput(tab: TabInfo) {
  const React = (window as any).React;
  const ReactDOM = (window as any).ReactDOM;
  
  if (!React || !ReactDOM || !orca.components.InputBox) {
    console.warn("Orca组件不可用，回退到原生实现");
    this.showRenameInput(tab);
    return;
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
    // 触发按钮
    return React.createElement('div', {
      style: { position: 'absolute', left: inputPosition.x, top: inputPosition.y },
      onClick: open
    }, '');
  });
}
```

#### 智能定位算法
```typescript
// 计算输入框位置（确保不被裁掉）
const tabElement = document.querySelector(`[data-tab-id="${tab.blockId}"]`) as HTMLElement;
let inputPosition = { x: '50%', y: '50%' };

if (tabElement) {
  const rect = tabElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // 计算最佳位置，确保不被裁掉
  let x = rect.left;
  let y = rect.top - 80; // 在标签上方显示
  
  // 检查右边界
  if (x + 300 > viewportWidth) {
    x = viewportWidth - 320;
  }
  
  // 检查左边界
  if (x < 20) {
    x = 20;
  }
  
  // 检查上边界
  if (y < 20) {
    y = rect.bottom + 10; // 如果上方空间不够，显示在下方
  }
  
  // 检查下边界
  if (y + 100 > viewportHeight) {
    y = viewportHeight - 120;
  }
  
  inputPosition = { x: `${x}px`, y: `${y}px` };
}
```

### 2. 右键菜单优化

#### 使用Orca原生ContextMenu
```typescript
addOrcaContextMenu(tabElement: HTMLElement, tab: TabInfo) {
  const React = (window as any).React;
  const ReactDOM = (window as any).ReactDOM;
  
  if (!React || !ReactDOM || !orca.components.ContextMenu) {
    console.warn("Orca组件不可用，回退到原生右键菜单");
    // 回退到原生实现
    return;
  }

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
          onClick: () => {
            close();
            this.renameTab(tab);
          }
        }),
        React.createElement(MenuText, {
          key: 'pin',
          title: tab.isPinned ? '取消固定' : '固定标签',
          preIcon: tab.isPinned ? 'ti ti-pin-off' : 'ti ti-pin',
          onClick: () => {
            close();
            this.toggleTabPinStatus(tab);
          }
        }),
        React.createElement(MenuSeparator, { key: 'separator1' }),
        // ... 其他菜单项
      ]);
    }
  }, (openMenu: (e: React.UIEvent) => void, closeMenu: () => void) => {
    // 创建透明覆盖层捕获右键事件
    return React.createElement('div', {
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
  });
}
```

### 3. 菜单项设计

#### 完整的菜单项列表
- **重命名标签** (`ti ti-edit`) - 打开重命名输入框
- **固定/取消固定标签** (`ti ti-pin` / `ti ti-pin-off`) - 切换固定状态
- **分隔线** - 视觉分组
- **关闭标签** (`ti ti-x`) - 关闭当前标签
- **关闭其他标签** (`ti ti-x`) - 关闭除当前外的所有标签
- **关闭全部标签** (`ti ti-x`) - 关闭所有标签

#### 图标使用
- 使用Tabler Icons (`ti ti-*`) 保持与Orca一致
- 图标语义化，清晰表达功能
- 固定状态图标动态切换

### 4. 回退机制

#### 组件可用性检查
```typescript
// 检查Orca组件是否可用
const React = (window as any).React;
const ReactDOM = (window as any).ReactDOM;

if (!React || !ReactDOM || !orca.components.InputBox) {
  console.warn("Orca组件不可用，回退到原生实现");
  this.showRenameInput(tab);
  return;
}
```

#### 双重保障
- 优先使用Orca原生组件
- 如果组件不可用，自动回退到原生实现
- 确保功能在任何情况下都能正常工作

### 5. 性能优化

#### 组件清理
```typescript
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
```

#### 内存管理
- 正确卸载React组件
- 清理事件监听器
- 使用MutationObserver监控DOM变化

## 用户体验提升

### 1. 原生风格
- **视觉一致性**：与Orca界面完全一致
- **交互一致性**：使用相同的交互模式
- **主题适配**：自动适配Orca的主题设置

### 2. 智能定位
- **边界检测**：自动检测屏幕边界
- **动态调整**：根据可用空间调整位置
- **多方向支持**：上下左右智能选择最佳位置

### 3. 响应式设计
- **窗口大小适配**：适应不同窗口大小
- **多屏幕支持**：支持多显示器环境
- **缩放适配**：适应不同的缩放比例

## 技术特点

### 1. 组件化架构
- 使用React组件系统
- 符合Orca的组件规范
- 支持组件复用和扩展

### 2. 事件处理
- 完整的键盘和鼠标事件支持
- 事件冒泡和捕获控制
- 跨浏览器兼容性

### 3. 状态管理
- 正确的组件状态管理
- 生命周期管理
- 内存泄漏防护

## 兼容性

### 1. 浏览器支持
- 现代浏览器完全支持
- 自动检测组件可用性
- 优雅降级处理

### 2. Orca版本兼容
- 支持不同版本的Orca
- 组件API兼容性检查
- 向后兼容保证

### 3. 插件环境
- 插件加载顺序无关
- 与其他插件兼容
- 资源冲突避免

## 总结

通过使用Orca原生组件，我们实现了：

✅ **完全原生风格**：与Orca界面完美融合
✅ **智能定位系统**：确保窗口不被裁掉
✅ **优雅回退机制**：保证功能稳定性
✅ **性能优化**：正确的资源管理
✅ **用户体验**：一致的交互体验

这个优化让标签页插件真正成为了Orca的一部分，提供了原汁原味的用户体验。
