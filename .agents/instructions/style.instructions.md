---
description: "在 meos-control-web 中编写或修改 Vue 组件样式、全局样式文件、stylelint 配置与样式覆盖逻辑时使用。涵盖多应用样式语言识别、scoped 与 :deep() 取舍、局部/全局样式放置、stylelint 入口判断以及避免把 Vue 样式规则强套到 meos-daily-report-web。"
name: "Style Guidelines"
applyTo: "src/**/*.vue, src/**/*.less, src/**/*.scss, src/**/*.css, .stylelintrc.js, operation-duty-homepage/src/**/*.vue, operation-duty-homepage/src/**/*.less, operation-duty-homepage/src/**/*.css, meoi-aim-rcrm-web/src/**/*.vue, meoi-aim-rcrm-web/src/**/*.scss, meoi-aim-rcrm-web/src/**/*.less, meoi-aim-rcrm-web/src/**/*.css, meoi-aim-rcrm-web/.stylelintrc.js"
---

# 样式规范

在当前仓库中处理样式相关修改时，先判断所属应用，再复用该应用已有的样式语言、样式入口和覆盖方式，不要跨应用硬套一套统一模板。

## 先判断所属应用

- 根应用 `src/`：以 `less` + Vue SFC `scoped` 为主，全局样式入口是 `src/styles/index.less`
- `operation-duty-homepage/`：以 `less` + Vue SFC `scoped` 为主，全局样式入口是 `operation-duty-homepage/src/styles/index.less`
- `meoi-aim-rcrm-web/`：以 `scss` + Vue SFC `scoped` 为主，全局样式入口是 `meoi-aim-rcrm-web/src/styles/global.scss`
- `meos-daily-report-web` 不属于当前这份样式指令的目标范围，不要把这里的 Vue 样式规则直接强套过去

默认先看当前文件路径，再决定用 `less` 还是 `scss`、样式写在局部还是全局，以及是否存在可运行的 `stylelint` 入口。

## 样式放置规则

- 组件局部样式，优先写在当前组件的 `<style scoped>` 中
- 同一业务模块反复复用的样式，再评估抽到模块附近公共样式文件
- 只有明确属于应用级基础样式、工具类或广泛复用规则时，才放入 `src/styles/**` 或对应子应用的全局样式入口

不要为了修一个局部布局问题，就把规则塞进全局样式入口。

## 样式语言规则

- 根应用：优先延续 `less`
- `operation-duty-homepage`：优先延续 `less`
- `meoi-aim-rcrm-web`：优先延续 `scss`

修改现有文件时优先保持当前文件已有的样式语言；没有明确收益时，不主动切换样式语言。

## scoped 与 :deep() 规则

- 默认优先使用 `scoped`
- 覆盖 Meri UI / 第三方组件内部类名时，必要时使用 `:deep()`
- 优先把 `:deep()` 限制在当前组件根类作用域下，避免污染范围过大
- 仓库里存在历史 `/deep/` 写法；修改旧文件时优先保持最小改动，不要为了统一语法批量重写

不要把整页大面积样式都塞进 `:deep()`，也不要在全局样式里无边界覆写 `.m-*` 类名。

## stylelint 规则

- 根应用有 `/.stylelintrc.js`，常规命令是 `pnpm stylelint`
- `meoi-aim-rcrm-web` 有自己的 `.stylelintrc.js`，应在子应用目录执行 `pnpm stylelint`
- `operation-duty-homepage` 当前未确认独立 `stylelint` 配置与脚本，不要直接声称“可以跑 stylelint”

在需要修 stylelint 报错时，先确认当前应用是否真的接入了对应配置和命令。

## 当前仓库已确认的样式倾向

- 4 空格缩进
- 字符串优先单引号
- 十六进制颜色优先小写长格式
- 选择器命名优先 kebab-case / 局部 BEM 风格
- 组件库覆盖优先局部、谨慎、最小范围

## 国际化长文本样式考虑

处理界面样式时，默认要考虑国际化切换后文本长度变长，不要只按中文文案长度设计宽高。

- 若需求方未指定展示方式，需提供两个可选方案，而不是默认忽略：
	- **单行省略号**：适用于空间固定、强调整齐度的区域
	- **自动换行**：适用于允许高度增长、强调信息完整展示的区域
- 单行省略优先使用项目内的 `v-ellipsis` 指令，并同时补上 `m-ellipsis` class；只有明确不适用时，再评估是否手写省略样式
- 自动换行通常至少需要：`white-space: normal`，并结合 `word-break: break-word` 或 `overflow-wrap: anywhere`
- 在 flex 布局中，如果文本容器不生效，优先检查父子项是否需要 `min-width: 0`
- 避免通过写死高度、写死行高容器或强裁切的方式掩盖国际化超长文本问题

## 避免这些做法

- 把局部样式错误放进全局入口
- 为了“统一风格”跨应用切换 less / scss
- 无边界重写 Meri UI 内部类名
- 假定所有子应用都已接入 stylelint
- 为了统一语法批量改动历史 `/deep/` 样式

## 修改后自检

- 是否先判断了当前文件属于哪个应用
- 是否使用了该应用真实存在的样式语言和样式入口
- 是否把样式放在了正确位置（局部 / 模块 / 全局）
- 是否在需要时才使用 `:deep()`
- 是否意外扩大了样式作用域
- 是否对有 lint 入口的应用按真实命令进行了验证