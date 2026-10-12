---
name: style
description: '为 meos-control-web 工作区处理样式 / CSS / Less / SCSS / stylelint / Vue SFC `<style>` 规则的技能。适用于新增或修改组件样式、判断当前应用应使用 less 还是 scss、决定样式应放在 scoped 块还是全局样式入口、处理 `:deep()` / `/deep/` 覆盖 Meri UI 组件、运行根应用或 legacy 子应用的 stylelint、以及说明哪些子应用当前没有独立 stylelint 入口。触发词：style、样式、css、less、scss、stylelint、scoped、:deep、/deep/、全局样式、组件样式、Meri UI 样式覆盖。'
argument-hint: '说明目标应用/文件，以及是要新增样式、修 stylelint、调整组件样式覆盖，还是梳理当前项目的样式规范'
---

# meos-control-web 样式规则使用技能

## 技能目标

在当前多应用工作区中处理样式相关任务时，帮助代理稳定完成以下事项：

- 先识别当前代码属于哪个应用，再复用该应用已有的样式语言、样式入口和覆盖方式。
- 区分局部样式、组件库覆盖样式、全局样式入口，避免把样式改动放错位置。
- 在根应用和 legacy 子应用中使用真实存在的 `stylelint` 配置与脚本验证结果；对未接入样式检查的子应用，不虚构命令。
- 在 Vue SFC 中正确使用 `scoped`、`:deep()`、必要的全局样式，避免无边界污染。
- 修改样式时保持与周边文件的语言、缩进、选择器命名和覆盖习惯一致。
- 涉及颜色时，优先使用现有 CSS 变量，不直接硬编码十六进制颜色。

本技能默认聚焦**代码侧样式规则**：样式语言、样式放置位置、组件库覆盖方式、stylelint 与 scoped / `:deep()` 约定；不把颜色、间距、视觉稿一致性等设计规范作为默认主线。

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “帮我改这个组件样式”
- “这个样式应该放全局还是放当前组件里”
- “当前项目样式应该写 less 还是 scss”
- “为什么这个 Meri UI / 第三方组件样式覆盖不生效”
- “这个 stylelint 报错怎么修”
- “当前仓库样式规范是什么”
- “`:deep()` / `/deep/` 在这里怎么用”

默认覆盖当前工作区里的 Vue 样式任务，但执行时必须先识别目标应用，再进入对应的样式语言、样式入口和 lint 规则。

## 先判断目标应用

这个仓库是多应用工作区，不同应用的样式体系并不完全相同。

### 根应用 `src/`

- 全局样式入口：`src/styles/index.less`
- 主入口引入：`src/main.ts`
- 常见样式语言：`less`
- Vue 组件里常见写法：`<style lang="less" scoped>`
- 有独立 stylelint 配置：`/.stylelintrc.js`
- 有独立样式检查命令：`pnpm stylelint`

### 子应用 `operation-duty-homepage/`

- 全局样式入口：`operation-duty-homepage/src/styles/index.less`
- 主入口引入：`operation-duty-homepage/src/main.js`
- 常见样式语言：`less`
- Vue 组件里常见写法：`<style lang="less" scoped>`
- 当前未检索到独立 `.stylelintrc*`
- 当前 `package.json` 未提供独立 `stylelint` 脚本

### legacy 子应用 `meoi-aim-rcrm-web/`

- 全局样式入口：`meoi-aim-rcrm-web/src/styles/global.scss`
- 常见样式语言：`scss`
- Vue 组件里常见写法：`<style lang="scss" scoped>`
- 有独立 stylelint 配置：`meoi-aim-rcrm-web/.stylelintrc.js`
- 有独立样式检查命令：在子应用目录执行 `pnpm stylelint`

### `meos-daily-report-web/`

- 当前明确不纳入这份技能的默认目标范围
- 它有独立的 React + CSS 体系，不要把当前 Vue + Less / SCSS 规则直接强套过去

### 总规则

1. 先根据路径判断属于哪个应用。
2. 再复用该应用已有的样式语言、样式入口和 lint 方式。
3. 没有明确需求时，不跨应用统一样式架构。
4. 不为了“看起来统一”而把 less / scss / 全局入口 / lint 方式强行改成一套。

## 根应用样式规则现状

### 1. 根应用默认以 Less + Scoped SFC 为主

当前根应用大量 Vue 文件使用：

```vue
<style lang="less" scoped>
```

因此默认策略是：

- 修改现有组件样式时，优先沿用当前文件已有的样式语言
- 新增根应用 Vue 组件样式时，若附近文件都是 `less`，优先继续保持 `less`
- 不要无故把单个根应用组件改成另一种样式语言

### 2. 全局样式入口已经存在

根应用 `src/main.ts` 已引入：

- `meri-plus/theme/index.css`
- `meri-icon/lib/style.css`
- `yushu-component-web/dist/style.css`
- `@/styles/index`

而 `src/styles/index.less` 继续汇总：

- `var.less`
- `common.css`
- `utils.less`
- `components.less`
- `grid.less`
- `calendar.less`
- `font.less`
- `gap.less`

因此：

- 组件局部样式优先写在当前 SFC 的 `<style scoped>` 中
- 真正全局复用的样式，才放入 `src/styles/**`
- 不要为了改一个局部布局问题就把规则塞进全局入口

### 3. 对组件库样式覆盖时优先使用 `:deep()`

根应用里大量存在 Meri UI 组件覆盖，例如：

- `:deep(.m-form-item__label)`
- `:deep(.m-tabs)`
- `:deep(.m-input-number-rightButton)`

当前仓库里也能看到历史 `/deep/` 写法。默认策略：

- 修改旧代码时，优先保持局部最小改动
- 新增深层覆盖时，优先使用 `:deep()`
- 不要为了统一语法而批量重写整个文件的历史 `/deep/`

### 5. 涉及颜色时优先使用 CSS 变量

当前仓库三个 Vue 应用都已经广泛使用 `var(--...)` 颜色变量，例如：

- `var(--gray-600)`
- `var(--blue-500)`
- `var(--red-500)`
- `var(--alpha-30)`
- `var(--token, #fallback)`

因此默认策略是：

- 优先使用已有 CSS 变量，而不是直接写十六进制颜色
- 若附近代码已使用 `var(--token, #fallback)`，优先保持一致
- 默认先不要新增全局颜色变量；只有在明确存在复用价值时才评估新增 token

### 4. 样式应先就近放置

默认顺序：

1. 先放当前组件的 `<style scoped>`
2. 若是同一业务模块反复复用的样式，再评估抽到附近公共样式文件
3. 只有明确属于全局基础样式或广泛复用 token/工具类时，再进入 `src/styles/**`

## 子应用样式规则现状

### `operation-duty-homepage/`

- 以 `less` + `scoped` 为主
- 主入口引入 `@/styles/index.less`
- 当前没有确认到独立 `stylelint` 配置或脚本

默认策略：

- 在该应用里继续沿用 `less` 和当前局部样式组织方式
- 需要样式检查时，先明确说明“当前未接入独立 stylelint 流程”
- 不要假定它能直接复用根应用 `pnpm stylelint`

### `meoi-aim-rcrm-web/`

- 以 `scss` + `scoped` 为主
- 有自己的 `global.scss` 和 `.stylelintrc.js`
- 有自己的 `stylelint` 脚本

默认策略：

- 保持当前 `scss` 风格
- 在该目录改样式时，优先使用该子应用自己的 stylelint 配置和脚本
- 不要把根应用的 less 假设强加过去

## stylelint 规则现状

### 根应用

根应用 `/.stylelintrc.js` 当前可确认的规则特征包括：

- `indentation: 4`
- `string-quotes: 'single'`
- `color-hex-case: 'lower'`
- `color-hex-length: 'long'`
- 允许 `:deep` 作为伪类
- 允许 `transparentize`
- `selector-class-pattern` 倾向 kebab-case / BEM 风格

常规验证命令：

```bash
pnpm stylelint
```

### `meoi-aim-rcrm-web`

该子应用 `.stylelintrc.js` 同样使用 4 空格缩进、单引号、长小写 hex，并通过 `postcss-scss` / `postcss-html` 处理 `.vue` 与 `scss`。

常规验证命令：在子应用目录执行：

```bash
pnpm stylelint
```

### `operation-duty-homepage`

- 当前未检索到独立 `.stylelintrc*`
- 当前未提供 `stylelint` 脚本

因此：

- 不要直接声称“可以跑 stylelint”
- 如果用户要求给它补样式 lint，需要单独设计方案，而不是默认它已接入

## Vue SFC 样式书写规则

### 1. 默认优先 `scoped`

当前三个 Vue 应用的大多数组件样式都放在 `scoped` 块中，因此默认策略：

- 组件样式优先使用 `scoped`
- 只有确实需要全局生效时，才使用非 `scoped` 块或全局样式入口

### 2. 覆盖第三方 / 组件库内部样式时使用 `:deep()`

适用场景：

- 覆盖 Meri UI 内部类名
- 覆盖图表 / 第三方渲染出的内部节点
- scoped 环境下需要向子层穿透

但要注意：

- 优先限制在当前组件根类下，避免覆盖范围过大
- 不要把整页大面积样式都塞进 `:deep()`
- 只在确实需要穿透时使用，不要把 `:deep()` 当默认写法

### 3. 内联样式不是默认方案

除非是：

- 很小的动态样式
- CSS 变量注入
- 单次渲染条件下更清晰的表达

否则优先放入样式块，而不是在模板里堆大量 `style="..."`。

## 选择器与命名建议

仓库当前类名大多是：

- kebab-case
- 业务语义命名
- 局部 BEM 风格（如 `block__element--modifier`）

默认策略：

- 优先复用现有根类和业务语义命名
- 不要为了“炫技”引入另一套复杂命名体系
- 修改已有文件时，跟随该文件现有命名风格即可

## 核心决策规则

### 1. 先判断应该改哪里

默认顺序：

1. 当前组件 `<style scoped>`
2. 当前业务模块附近公共样式
3. 应用级全局样式入口

不要一上来就改全局样式。

### 2. 先复用当前应用样式语言

- 根应用和 `operation-duty-homepage`：优先 `less`
- `meoi-aim-rcrm-web`：优先 `scss`

没有明确收益时，不主动切换样式语言。

### 3. 先修局部，不做无关样式大重排

避免以下行为：

- 为了修一个 spacing 问题，顺手重排整段 CSS
- 为了看起来更“现代”，批量替换历史 `/deep/`
- 为了统一而改动无关选择器命名

### 4. 样式覆盖应尊重组件库边界

对于 Meri UI / 第三方组件：

- 优先通过组件现有 API、class、slot 解决
- 只有 API 不足时，再用 `:deep()` 做必要覆盖
- 不要在全局样式里无边界覆写 `.m-*` 类名

## 标准工作流

### 第 1 步：定位所属应用与样式入口

1. 根据路径判断当前属于哪个应用。
2. 找到该应用的主入口样式文件与样式语言。
3. 确认是否有自己的 `stylelint` 配置与脚本。

### 第 2 步：判断样式归属

1. 这是组件局部样式、组件库覆盖样式，还是全局复用样式？
2. 若只是局部布局或视觉调整，优先留在当前组件。
3. 若必须全局复用，再决定是否抽到应用级样式目录。

### 第 3 步：按现有风格实现

1. 沿用当前文件的样式语言与缩进风格。
2. 在 scoped 下优先本地类名，必要时再 `:deep()`。
3. 不顺手重构无关样式块。

### 第 4 步：验证与回归

至少检查以下内容：

1. 修改是否放在正确位置。
2. 是否意外扩大了作用域。
3. 是否破坏了 Meri UI / 第三方组件样式。
4. 有 lint 入口的应用是否通过 stylelint。
5. 没有 lint 入口的应用，是否清楚说明现状。

## 完成标准

满足以下条件才算完成：

- 已确认当前任务使用的是目标应用真实存在的样式语言和样式入口。
- 修改位置正确：局部样式未误入全局入口，全局规则未误塞入局部组件。
- 对组件库样式覆盖范围可控，没有无边界污染。
- 若目标应用有 stylelint，已按其真实配置验证；若没有，已明确说明。
- 修改与周边文件的命名、缩进、样式组织方式保持一致。

## 回答用户时的建议输出结构

处理样式任务后，建议按以下顺序反馈：

1. 当前文件所属应用与样式语言
2. 样式为什么放在当前文件 / 当前样式入口
3. 是否使用了 `scoped`、`:deep()`、全局样式或组件库覆盖
4. 是否运行了 stylelint，以及结果如何
5. 是否还有视觉或组件库边界需要回归确认

## 本技能沉淀出的项目经验

1. 根应用样式以 `less` + `scoped` Vue SFC 为主，并通过 `src/main.ts` 引入 `@/styles/index` 与多个第三方样式入口。
2. 根应用存在真实可运行的 `pnpm stylelint` 和 `/.stylelintrc.js`，其中使用 4 空格缩进、单引号、长小写 hex，并允许 `:deep` 相关场景。
3. `operation-duty-homepage` 也以 `less` + `scoped` 为主，但当前未确认独立 `stylelint` 配置与脚本，不能假定它已接入样式检查流程。
4. `meoi-aim-rcrm-web` 主要使用 `scss` + `scoped`，并有独立的 `global.scss`、`.stylelintrc.js` 与 `pnpm stylelint`。
5. 仓库里同时存在 `:deep()` 和历史 `/deep/` 写法；新增代码优先使用 `:deep()`，但不应为了统一语法而大面积重写旧样式。
