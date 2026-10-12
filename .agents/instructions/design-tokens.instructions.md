---
description: "在 meos-control-web 根应用中编写或修改样式令牌、颜色、字体、间距与 Figma 设计 token 映射时使用。涵盖优先使用 CSS 运行时变量、字体/间距入口、避免使用旧 Less 变量体系以及颜色优先 CSS 变量。"
name: "Root Design Tokens Guidelines"
applyTo: "src/**/*.vue, src/**/*.less, src/**/*.css, src/styles/**"
---

# 根应用设计令牌规范

在根应用处理 Figma 设计 token 或样式值映射时，优先复用当前项目已经落地的 CSS 运行时变量和样式入口。

## 总规则

- 不使用 `@/assets/less/variables.less` 旧变量体系
- 颜色优先使用 CSS 变量 `var(--...)`
- 字体与间距优先复用 `src/styles/` 下现有规则
- 不要直接把 Figma 的十六进制颜色、字号、间距原样硬编码到页面

## 颜色规则

- 优先语义变量，再考虑灰阶 / 色板变量
- 常见颜色 token 包括：
  - `--primary-color`
  - `--success-color`
  - `--danger-color`
  - `--warning-color`
  - `--gray-*`
  - `--blue-*`
  - `--red-*`
  - `--orange-*`
  - `--alpha-30`
- 优先写：
  - `color: var(--gray-600);`
  - `background: var(--blue-500);`
- 不要默认写裸 `#hex`

## 字体与间距

- 字体相关入口：`src/styles/font.less`
- 间距相关入口：`src/styles/gap.less`
- 全局样式汇总入口：`src/styles/index.less`

能复用现有工具类或设计令牌时，优先复用，不要随意再造一套局部尺寸体系。

## 修改后自检

- 是否避免了旧 Less 变量体系
- 是否优先使用了 CSS 变量
- 是否复用了现有字体/间距入口
- 是否避免把 Figma 原始 token 直接硬编码进页面