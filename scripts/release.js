#!/usr/bin/env node

/**
 * 自动发布脚本
 * 用法: npm run release [major|minor|patch]
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const releaseType = process.argv[2] || 'patch';

if (!['major', 'minor', 'patch'].includes(releaseType)) {
  console.error('❌ 发布类型必须是: major, minor, 或 patch');
  process.exit(1);
}

try {
  console.log(`🚀 开始 ${releaseType} 版本发布...`);

  // 检查工作目录是否干净
  try {
    execSync('git diff-index --quiet HEAD --', { stdio: 'ignore' });
  } catch {
    console.error('❌ 工作目录不干净，请先提交所有更改');
    process.exit(1);
  }

  // 确保在主分支
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (!['main', 'master'].includes(currentBranch)) {
    console.warn(`⚠️  当前在分支 ${currentBranch}，建议在主分支发布`);
  }

  // 拉取最新代码
  console.log('📥 拉取最新代码...');
  execSync('git pull origin ' + currentBranch, { stdio: 'inherit' });

  // 运行测试和构建
  console.log('🧪 运行测试...');
  execSync('npm test --if-present', { stdio: 'inherit' });

  console.log('🔨 构建项目...');
  execSync('npm run build', { stdio: 'inherit' });

  // 更新版本号
  console.log(`📝 更新版本号 (${releaseType})...`);
  const versionOutput = execSync(`npm version ${releaseType} --no-git-tag-version`, { encoding: 'utf8' });
  const newVersion = versionOutput.trim().substring(1); // 移除 'v' 前缀

  console.log(`✅ 新版本: ${newVersion}`);

  // 提交更改
  console.log('💾 提交更改...');
  execSync(`git add .`, { stdio: 'inherit' });
  execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: 'inherit' });

  // 创建标签
  console.log('🏷️  创建版本标签...');
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });

  // 推送到远程仓库
  console.log('📤 推送到远程仓库...');
  execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' });
  execSync(`git push origin v${newVersion}`, { stdio: 'inherit' });

  console.log(`🎉 版本 v${newVersion} 发布成功！`);
  console.log('📦 GitHub Actions 将自动构建和发布到 npm');

} catch (error) {
  console.error('❌ 发布失败:', error.message);
  process.exit(1);
}
