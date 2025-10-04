/**
 * Tooltip 换行测试
 * 用于验证多行 tooltip 是否正确显示
 */

import { addTooltip, createTabTooltip } from '../utils/tooltipUtils';

/**
 * 测试多行 tooltip 显示
 */
export function testMultilineTooltip() {
  // 创建一个测试按钮
  const testButton = document.createElement('button');
  testButton.textContent = '测试多行 Tooltip';
  testButton.style.cssText = `
    position: fixed;
    top: 50px;
    left: 50px;
    padding: 10px 20px;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10001;
  `;
  
  document.body.appendChild(testButton);
  
  // 测试数据
  const testTab = {
    title: '狂测5万次! DLSS增加延迟? 帧生成延迟爆炸? 让数据来说话! 超详细DLSS帧生成全链路延迟测试',
    blockId: 'block-123',
    panelId: 'panel-1',
    blockType: 'video',
    isPinned: true,
    isJournal: false
  };
  
  // 添加 tooltip
  addTooltip(testButton, createTabTooltip(testTab));
  
  console.log('多行 tooltip 测试已创建');
  console.log('预期显示效果：');
  console.log('第一行：狂测5万次! DLSS增加延迟? 帧生成延迟爆炸? 让数据来说话! 超详细DLSS帧生成全链路延迟测试');
  console.log('第二行：ID: block-123 | 面板: panel-1 | 类型: video | 📌 已固定');
}

/**
 * 测试简单换行
 */
export function testSimpleMultiline() {
  const testButton2 = document.createElement('button');
  testButton2.textContent = '测试简单换行';
  testButton2.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50px;
    padding: 10px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 10001;
  `;
  
  document.body.appendChild(testButton2);
  
  // 直接测试换行
  addTooltip(testButton2, {
    text: '第一行\n第二行\n第三行',
    delay: 200
  });
  
  console.log('简单换行测试已创建');
}

// 全局暴露测试函数
if (typeof window !== 'undefined') {
  (window as any).testMultilineTooltip = testMultilineTooltip;
  (window as any).testSimpleMultiline = testSimpleMultiline;
}
