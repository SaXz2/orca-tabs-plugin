# 自动部署文档

## GitHub Actions 工作流

本项目配置了三个主要的 GitHub Actions 工作流：

### 1. 持续集成 (CI) - `.github/workflows/ci.yml`

**触发条件：**
- 推送到 `main`、`master`、`develop` 分支
- 创建 Pull Request 到这些分支

**功能：**
- 在多个 Node.js 版本（18, 20）上测试
- 运行代码检查和测试
- 构建项目并验证输出
- 上传构建产物作为临时文件

### 2. 构建和发布 - `.github/workflows/release.yml`

**触发条件：**
- 推送版本标签（如 `v1.0.0`）

**功能：**
- 运行完整的测试和构建流程
- 创建 GitHub Release
- 附加构建产物到 Release

### 3. NPM 发布 - `.github/workflows/npm-publish.yml`

**触发条件：**
- 推送版本标签（如 `v1.0.0`）

**功能：**
- 验证版本号与标签匹配
- 发布到 npm registry
- 支持预发布版本（alpha、beta、rc）

## 使用方法

### 自动发布新版本

使用内置的发布脚本：

```bash
# 发布补丁版本 (1.0.0 -> 1.0.1)
npm run release:patch

# 发布次要版本 (1.0.0 -> 1.1.0)
npm run release:minor

# 发布主要版本 (1.0.0 -> 2.0.0)
npm run release:major

# 或者简单地使用（默认为补丁版本）
npm run release
```

发布脚本会自动：
1. 检查工作目录状态
2. 拉取最新代码
3. 运行测试和构建
4. 更新版本号
5. 创建提交和标签
6. 推送到远程仓库
7. 触发 GitHub Actions 自动发布

### 手动发布

如果需要手动控制发布过程：

```bash
# 1. 更新版本号
npm version patch  # 或 minor、major

# 2. 推送标签
git push --follow-tags

# 3. GitHub Actions 会自动处理构建和发布
```

### 预发布版本

创建预发布版本：

```bash
# 创建 alpha 版本
npm version prerelease --preid=alpha
git push --follow-tags

# 创建 beta 版本
npm version prerelease --preid=beta
git push --follow-tags

# 创建 release candidate
npm version prerelease --preid=rc
git push --follow-tags
```

预发布版本会发布到 npm 的 `next` 标签下。

## 配置要求

### GitHub Secrets

需要在 GitHub 仓库设置中配置以下 Secrets：

- `NPM_TOKEN`: NPM 发布令牌（用于发布到 npm）

### NPM 令牌获取

1. 登录 npm 官网
2. 进入 Access Tokens 页面
3. 创建新的 Automation Token
4. 将令牌添加到 GitHub Secrets

## 构建产物

构建完成后，以下文件会被包含在发布中：

- `dist/index.js` - 主要构建文件
- `dist/index.js.map` - Source map 文件
- `package.json` - 包配置文件
- `README.md` - 项目文档

## 故障排除

### 构建失败

1. 检查 TypeScript 类型错误
2. 确保所有依赖已正确安装
3. 验证构建脚本配置

### 发布失败

1. 检查 npm 令牌是否有效
2. 验证版本号是否与标签匹配
3. 确保包名在 npm 上可用

### 版本冲突

如果版本号已存在：
1. 删除本地和远程标签
2. 更新到新的版本号
3. 重新推送

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```
