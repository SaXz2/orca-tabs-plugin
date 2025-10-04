/**
 * Tooltip 使用示例
 * 展示如何使用新的 tooltip 工具函数
 */

import { addTooltip, createButtonTooltip, createStatusTooltip, createTabTooltip } from '../utils/tooltipUtils';

// 示例 1: 基本使用
export function basicTooltipExample() {
  // 假设有一个现有的 DOM 元素
  const button = document.querySelector('#my-button') as HTMLElement;
  
  if (button) {
    // 调用工具函数
    addTooltip(button, {
      text: "保存当前内容",
      shortcut: "Ctrl+S",
      delay: 300
    });
  }
}

// 示例 2: 使用预定义的配置函数
export function predefinedTooltipExample() {
  const saveButton = document.querySelector('#save-button') as HTMLElement;
  const statusElement = document.querySelector('#status') as HTMLElement;
  const tabElement = document.querySelector('#tab') as HTMLElement;
  
  if (saveButton) {
    addTooltip(saveButton, createButtonTooltip('保存文件', 'Ctrl+S'));
  }
  
  if (statusElement) {
    addTooltip(statusElement, createStatusTooltip('当前状态：已保存'));
  }
  
  if (tabElement) {
    const tabInfo = { title: 'main.ts', blockId: 'block-123' };
    addTooltip(tabElement, createTabTooltip(tabInfo));
  }
}

// 示例 3: 批量初始化
export function batchTooltipExample() {
  // 为多个按钮添加 tooltip
  const buttons = document.querySelectorAll('.action-button');
  buttons.forEach((button, index) => {
    addTooltip(button as HTMLElement, {
      text: `执行操作 ${index + 1}`,
      delay: 200,
      defaultPlacement: 'top'
    });
  });
}

// 示例 4: 动态添加 tooltip
export function dynamicTooltipExample() {
  // 创建一个新按钮
  const newButton = document.createElement('button');
  newButton.textContent = '新按钮';
  newButton.id = 'dynamic-button';
  
  // 添加到页面
  document.body.appendChild(newButton);
  
  // 添加 tooltip
  addTooltip(newButton, {
    text: '这是一个动态创建的按钮',
    delay: 500,
    defaultPlacement: 'bottom'
  });
}

// 示例 5: 使用 data 属性初始化
export function dataAttributeExample() {
  // 在 HTML 中添加这些属性：
  // <button data-tooltip="true" data-tooltip-text="点击保存" data-tooltip-shortcut="Ctrl+S">保存</button>
  // <div data-tooltip="true" data-tooltip-text="状态信息" data-tooltip-delay="1000">状态</div>
  
  // 这些元素会在 initializeTooltips() 调用时自动初始化
  // 在 main.ts 的 init() 函数中已经调用了 initializeTooltips()
}

// 示例 6: 自定义样式
export function customStyleExample() {
  const customButton = document.querySelector('#custom-button') as HTMLElement;
  
  if (customButton) {
    addTooltip(customButton, {
      text: '自定义样式的提示',
      className: 'custom-tooltip',
      delay: 100,
      defaultPlacement: 'right'
    });
  }
}

// 示例 7: 移除 tooltip
export function removeTooltipExample() {
  const button = document.querySelector('#remove-tooltip-button') as HTMLElement;
  
  if (button) {
    // 添加 tooltip
    addTooltip(button, createButtonTooltip('这个提示将被移除'));
    
    // 5秒后移除 tooltip
    setTimeout(() => {
      const { removeTooltip } = require('../utils/tooltipUtils');
      removeTooltip(button);
    }, 5000);
  }
}

// 全局使用示例（在浏览器控制台中）
export function globalUsageExample() {
  // 在浏览器控制台中可以直接使用：
  // window.addTooltip(document.querySelector('#my-button'), {
  //   text: "这是一个全局调用的示例",
  //   shortcut: "F1",
  //   delay: 200
  // });
  
  console.log('可以在浏览器控制台中使用 window.addTooltip() 来添加 tooltip');
}
