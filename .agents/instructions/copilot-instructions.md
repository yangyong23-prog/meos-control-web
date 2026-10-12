---
description: "在 meos-control-web 根应用中处理 Figma 转代码、页面组件实现与设计系统落地时使用。提供总览级规则：组件优先映射 Meri Plus、遵循根应用 i18n/样式/资产/图标/微前端约束，并引导代理配合更细分的 instructions 文件。"
name: "Root Design-to-Code Overview"
applyTo: "src/**/*.vue, src/**/*.ts, src/**/*.js, src/**/*.less, src/**/*.css"
---

# 根应用设计系统与 Figma 转代码总览

这份文件只保留**总览级规则**。更细的规则已拆分到独立 instructions 文件中，避免继续把所有内容堆在一个文件里。

## 使用范围

- 主要面向根应用 `src/`
- 适用于 Figma 转代码、页面组件实现、设计系统映射
- 更细分的规则请配合以下文件一起使用：
    - 组件映射：`design-system-components.instructions.md`
    - 设计令牌：`design-tokens.instructions.md`
    - 国际化：`design-i18n.instructions.md`
    - 样式落地：`style.instructions.md`
    - 状态管理：`pinia.instructions.md`
    - API 请求：`api-http.instructions.md`

## 总原则

- 先看当前文件是否属于根应用 `src/`
- 先复用现有组件、样式变量、国际化文案和公共组件
- Figma 设计中的基础组件优先映射到 `meri-plus`
- 不要把 design-to-code 任务顺手改造成大范围重构

## 组件映射总规则

- Figma 中的按钮、复选框、下拉、树、输入框、标签、表单等基础交互组件，优先使用 `meri-plus`
- 优先通过 MCP 能力查看 Meri Plus 组件：
    1. `list_components`
    2. `get_component_doc`
    3. `get_component_code`
    4. `get_component_style`
- 根应用已有公共组件也应优先复用，例如：
    - `src/components/I18nSlot.vue`
    - `src/components/common/Empty.vue`
    - `src/components/common/FloorSelect.vue`
    - `src/components/common/SvgIcon.vue`
    - `src/components/common/SetButton.vue`
    - `src/components/common/SetDiv.vue`
    - `src/components/common/SetRadio.vue`

## 根应用开发约定

- 组件优先使用 Vue 3 Composition API
- 样式默认使用 `<style lang="less" scoped>`
- 跨组件状态优先按 Pinia 规范处理，不要把所有状态都塞进组件内，也不要把局部状态误提到全局
- 路由跳转不要使用绝对路径或 `window.location`，优先使用 `vue-router`
- 注意根应用同时支持独立运行和 Qiankun 容器运行，不要破坏微前端兼容性

## 资产与图标总规则

- 图片、字体、SVG 等静态资源优先复用 `src/assets/`
- 使用 `@` 别名引用资源
- 图标优先检查：
    - 项目 SVG 资源
    - Meri Icon
    - 已有 `SvgIcon` 组件能力
- 新增 SVG 图标时，优先沿用现有图标接入方式，不要随意引入另一套图标方案

## Figma 转代码最小检查清单

1. 是否优先使用了 `meri-plus` 或项目已有公共组件
2. 是否遵循了根应用 i18n 约定，而不是直接硬编码文案
3. 是否优先复用了现有 CSS 变量 / 设计令牌，而不是硬编码颜色与尺寸
4. 是否将样式写在正确位置（局部 / 模块 / 全局）
5. 是否保持了 Qiankun 场景下的路由与运行兼容性

## 明确避免

- 不要继续引用或扩展 `@/assets/less/variables.less` 旧变量体系
- 不要在一个文件里同时塞入组件映射、i18n、颜色体系、图标规范、状态管理、API 规则全部细节
- 不要把根应用设计系统规则直接强套到其它子应用
