---
name: eslint
description: '为 meos-control-web 工作区处理 ESLint / lint / 代码规范问题的技能。适用于定位当前文件应使用哪套 ESLint 配置、运行根应用 `lint:fix` 或 legacy 子应用 `lint`、解释 `.eslintrc.js` 规则、修复 ESLint 报错、评估是否应该改规则还是改代码、识别哪些子应用当前没有独立 lint 命令或配置。触发词：eslint、lint、lint:fix、.eslintrc.js、代码规范、静态检查、prettier、import 规则、typescript-eslint、vue lint。'
argument-hint: '说明目标应用/文件，以及是要修报错、解释规则、还是新增/调整 ESLint 规则'
---

# meos-control-web ESLint 使用技能

## 技能目标

在当前多应用工作区中处理 ESLint 相关任务时，帮助代理稳定完成以下事项：

- 先识别当前代码属于哪个应用，再选择对应的 lint 配置与命令。
- 判断报错来自真实生效规则，还是来自未接入的“候选规则文件”。
- 区分“应该修代码”与“应该调规则”的场景，避免为了过 lint 乱松规则。
- 在修改后使用最贴近目标应用的 lint 命令验证结果。
- 对没有独立 ESLint 配置的子应用，不擅自发明 lint 入口。

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这个 ESLint 报错怎么修”
- “当前项目 lint 应该怎么跑”
- “帮我解释一下这条 `.eslintrc.js` 规则”
- “要不要放开某条 ESLint 规则”
- “帮我清理一批 lint 问题”
- “这个文件到底走哪套 lint 配置”
- “为什么自动修复后还是报错”

默认覆盖整个工作区内的 ESLint 任务，但执行时必须先判断目标应用与实际生效的配置文件。

## 先判断目标应用与实际配置

这个仓库是多应用工作区，不同目录的 lint 现状并不一致。

### 根应用 `src/`

- 配置文件：`/.eslintrc.js`
- 忽略文件：`/.eslintignore`
- 常用命令：`pnpm lint:fix`
- 命令内容：`eslint --fix --ext .js,.ts,.jsx,.tsx,.vue src --quiet`
- 适用范围：根应用 `src/` 下代码
- 额外事实：`lint-staged` 会对非 `meos-daily-report-web` 的 JS/TS/Vue 文件执行 `prettier --write` + `eslint --fix`

### legacy 子应用 `meoi-aim-rcrm-web/`

- 配置文件：`meoi-aim-rcrm-web/.eslintrc.js`
- 命令：`pnpm lint`
- 命令内容：`eslint src --fix --ext .ts,.tsx,.vue,.js,.jsx`
- 构建体系：webpack 5，不要套用根应用 Vite 的假设

### 子应用 `operation-duty-homepage/`

- 当前 `package.json` 中未提供独立 lint 脚本
- 当前未检索到独立 `.eslintrc*` 文件
- 处理该目录时，不要擅自声称“可以直接跑 lint”
- 若用户要求补 lint，需要单独设计方案，而不是假定复用根应用配置

### 子应用 `meos-daily-report-web/`

- 当前 `package.json` 中未提供独立 lint 脚本
- 当前未检索到独立 `.eslintrc*` 文件
- 且根应用 `lint-staged` 显式排除了 `meos-daily-report-web`
- 因此不要假定它已接入当前仓库的 ESLint 流程

### 总规则

1. 先看当前文件路径属于哪个应用目录。
2. 再定位该目录是否存在自己的 `.eslintrc*` 与 lint 脚本。
3. 只对已经存在的 lint 入口给出运行建议。
4. 没有配置或脚本时，明确说明现状，不要脑补，也不要虚构可运行命令。

## 根应用规则现状

根应用的 `/.eslintrc.js` 当前是“Vue 3 + TypeScript + Prettier”的组合，核心特点：

- `extends` 包含：
	- `eslint:recommended`
	- `plugin:vue/vue3-recommended`
	- `plugin:@typescript-eslint/recommended`
	- `prettier`
	- `plugin:prettier/recommended`
- `.vue` 文件通过 `vue-eslint-parser` 解析
- 对 TypeScript 相关规则整体较务实，不是极致保守风格
- 许多高摩擦规则已关闭或降级，例如：
	- `@typescript-eslint/no-explicit-any: off`
	- `@typescript-eslint/explicit-function-return-type: off`
	- `@typescript-eslint/no-non-null-assertion: off`
	- `no-console` / `no-debugger` 在生产环境仅 `warn`
- 仍保留若干较强约束，例如：
	- `camelcase: error`
	- `complexity: [error, 40]`
	- `prefer-destructuring: error`
	- `no-param-reassign: error`（但 `props: false`）
	- `no-var: error`

## 关于 `/.eslint-custom-rules.cjs`

仓库根目录存在 `/.eslint-custom-rules.cjs`，其中定义了一套更严格的候选规则集合。

但当前检查结果显示：

- 根应用 `/.eslintrc.js` 未直接引入它
- 现有脚本中也未发现显式加载它

因此默认判断为：

- 它是“可参考规则源”或“候选增强规则”，不是当前已确认生效的默认规则
- 除非用户明确要求接入，或你确认配置链已引用它，否则不要把其中规则当作当前报错来源

## 核心决策规则

### 1. 先确认报错来源是否真实生效

遇到 ESLint 报错时，先确认：

1. 当前文件属于哪个应用。
2. 该应用是否有自己的 `.eslintrc*`。
3. 报错规则是否存在于真实生效的配置链中。
4. 是否只是编辑器插件读取了别的配置，或用户引用了未接入的规则文件。

### 2. 优先修代码，不优先改规则

默认策略：

- 如果报错是局部代码问题，优先修代码
- 只有当规则与项目既有风格、业务约束或大面积历史代码明显冲突时，才考虑调规则

适合修代码的情况：

- 未使用变量
- 命名不符合现有约束
- 简单解构可补齐
- 明显的格式/分号/导入顺序/布尔判断问题

适合评估调规则的情况：

- 规则与仓库大面积历史代码冲突
- 规则会导致大量低价值重构
- 规则影响现有公开 API 或业务可读性
- 用户明确是在建设或收敛 lint 规范

### 3. 不为了“过 lint”牺牲项目约定

避免以下行为：

- 直接全局关闭规则，却不解释原因与影响范围
- 为了消除一个告警而引入更复杂、更难维护的代码
- 在多应用工作区里把一个应用的 lint 假设强加给另一个应用
- 把未接入的严格规则文件当作“当前必须遵守”的标准

### 4. 修复后要用最贴近的命令验证

- 根应用：优先 `pnpm lint:fix`
- `meoi-aim-rcrm-web`：优先该目录下的 `pnpm lint`
- 没有脚本的子应用：说明现状，并给出“需先补 lint 基础设施”的建议

## 标准工作流

### 第 1 步：定位当前文件归属

1. 根据路径确认属于根应用、legacy 子应用，还是未接入 lint 的子应用。
2. 找到最邻近的 `package.json`、`.eslintrc*`、`.eslintignore`。
3. 确认可执行的 lint 命令。

### 第 2 步：确认规则来源

1. 查看真实生效的 `.eslintrc*`。
2. 如存在额外规则文件（如 `/.eslint-custom-rules.cjs`），先确认是否被引用。
3. 只基于已生效规则给出修复建议。

### 第 3 步：决定“修代码”还是“调规则”

优先顺序：

1. 局部修代码
2. 局部禁用并附原因（仅当合理）
3. 调整规则级别或选项
4. 新增/接入更严格规则

如果要改规则，必须说明：

- 为什么代码层修复不合适
- 影响范围
- 是否会影响历史代码
- 是否会影响预提交或团队协作体验

### 第 4 步：实施最小改动

1. 尽量做小范围、可验证的修改。
2. 避免顺手重排无关代码。
3. 若同一问题可自动修复，优先使用现有 lint 命令验证结果。

### 第 5 步：验证与回归

至少检查以下内容：

1. 修改文件 lint 是否通过。
2. 是否引入新的 TypeScript 或构建错误。
3. 是否因规则修复导致可读性或逻辑退化。
4. 若改了规则文件，是否说明了对其他应用/目录的影响。

## 完成标准

满足以下条件才算完成：

- 已确认当前任务所使用的 ESLint 配置与命令来源。
- 修复方案与仓库现有风格一致。
- 没有把未接入的候选规则误当成现网规则。
- 对无独立 lint 配置的子应用，没有虚构命令或配置。
- 如有规则调整，已明确说明原因、范围和风险。

## 回答用户时的建议输出结构

处理 ESLint 任务后，建议按以下顺序反馈：

1. 当前文件所属应用与使用的配置文件
2. 报错或规则的真实来源
3. 采取的是“修代码”还是“调规则”
4. 运行了什么验证，结果如何
5. 若该目录尚未接入 lint，需补什么基础设施

## 本技能沉淀出的项目经验

1. 根应用使用 `/.eslintrc.js`，常规验证命令是 `pnpm lint:fix`，范围主要是根应用 `src/`。
2. `meoi-aim-rcrm-web` 有自己独立的 `.eslintrc.js` 与 `pnpm lint`，不能直接套根应用命令。
3. `operation-duty-homepage` 与 `meos-daily-report-web` 当前未检索到独立 ESLint 配置或 lint 脚本，不能假定它们已接入。
4. 根目录存在更严格的 `/.eslint-custom-rules.cjs`，但当前未确认被正式接入，默认只能作为参考，不应直接视为生效规则。
