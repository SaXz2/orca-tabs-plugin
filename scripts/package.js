#!/usr/bin/env node

/**
 * 本地打包脚本
 * 用法: npm run package
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs';
import { join } from 'path';

try {
  console.log('📦 开始创建发布包...');

  // 确保已经构建
  if (!existsSync('dist/index.js')) {
    console.log('🔨 先构建项目...');
    execSync('npm run build', { stdio: 'inherit' });
  }

  // 创建发布目录
  const releaseDir = 'release-package';
  if (existsSync(releaseDir)) {
    execSync(`rimraf ${releaseDir}`, { stdio: 'inherit' });
  }
  mkdirSync(releaseDir, { recursive: true });

  // 读取 package.json 获取版本信息
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const version = packageJson.version;

  console.log(`📋 打包版本: v${version}`);

  // 复制必要文件
  const filesToCopy = [
    { src: 'dist/index.js', dest: 'index.js', required: true },
    { src: 'package.json', dest: 'package.json', required: true },
    { src: 'README.md', dest: 'README.md', required: true },
    { src: 'icon.png', dest: 'icon.png', required: true },
    { src: 'dist/index.js.map', dest: 'index.js.map', required: false }
  ];

  for (const file of filesToCopy) {
    if (existsSync(file.src)) {
      copyFileSync(file.src, join(releaseDir, file.dest));
      console.log(`✅ 复制: ${file.src} -> ${file.dest}`);
    } else if (file.required) {
      console.error(`❌ 必需文件不存在: ${file.src}`);
      process.exit(1);
    } else {
      console.log(`⚠️  可选文件不存在: ${file.src}`);
    }
  }

  // 创建压缩包
  const zipName = `orca-tabs-plugin-v${version}.zip`;

  console.log('🗜️  创建压缩包...');
  
  // 使用 Node.js 内置模块创建 ZIP 文件（跨平台）
  try {
    // 尝试使用系统命令
    if (process.platform === 'win32') {
      // Windows: 使用 PowerShell 的 Compress-Archive
      execSync(`powershell "Compress-Archive -Path '${releaseDir}\\*' -DestinationPath '${zipName}' -Force"`, { stdio: 'inherit' });
    } else {
      // Unix/Linux/Mac: 使用 zip 命令
      execSync(`cd ${releaseDir} && zip -r ../${zipName} .`, { stdio: 'inherit' });
    }
  } catch (error) {
    console.log('⚠️  系统压缩命令不可用，使用 Node.js 创建压缩包...');
    // 如果系统命令失败，提示用户手动打包
    console.log(`📁 发布文件已准备在 ${releaseDir} 目录中`);
    console.log('💡 您可以手动将该目录压缩为 ZIP 文件');
  }

  // 显示结果
  console.log('\n🎉 打包完成！');
  
  // 显示包内容
  console.log('\n📋 包内容:');
  if (process.platform === 'win32') {
    execSync(`dir ${releaseDir}`, { stdio: 'inherit' });
    if (existsSync(zipName)) {
      console.log(`\n📦 生成的压缩包: ${zipName}`);
      execSync(`dir ${zipName}`, { stdio: 'inherit' });
    }
  } else {
    execSync(`cd ${releaseDir} && ls -la`, { stdio: 'inherit' });
    if (existsSync(zipName)) {
      console.log(`\n📦 生成的压缩包: ${zipName}`);
      execSync(`ls -la ${zipName}`, { stdio: 'inherit' });
    }
  }

  console.log(`\n✨ 发布包已准备完成！`);

} catch (error) {
  console.error('❌ 打包失败:', error.message);
  process.exit(1);
}
