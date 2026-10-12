# 基于 Vite3 + Vue3 + TypeScript 项目模版

## 环境要求

- Node.js >= 20.0.0
- pnpm >= 8.0.0

> **注意**: 项目需要 Node.js 20 或更高版本才能正常运行。如果使用 nvm，可以运行 `nvm use` 自动切换到正确的版本。

## 运行

- 初始化 git: git init (否则 husky 会报错, 后期修复)
- 安装依赖：pnpm install
- 本地运行：`pnpm run dev` 或 `pnpm run dev:check`（自动切换到 Node 20）
- 打包： pnpm run build
- 修复: pnpm run lint:fix
- 打包分析: pnpm run report

### 自动切换 Node 版本

运行 `pnpm run dev:check` 可以自动切换到 Node.js 20 版本并启动开发服务器。该命令会：
1. 自动检测并切换到 `.nvmrc` 中指定的 Node 版本（需要安装 nvm）
2. 验证 Node 版本是否符合要求（>= 20）
3. 启动开发服务器

如果未安装 nvm 或切换失败，会显示相应的错误提示。
