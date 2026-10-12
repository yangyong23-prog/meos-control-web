---
description: "在 meos-control-web 根应用中根据设计稿实现页面组件、表单、图表、权限控件与公共 UI 结构时使用。涵盖 Meri Plus 组件优先、项目公共组件复用、图标/权限组件选择以及 Figma 基础组件映射策略。"
name: "Root Design System Components Guidelines"
applyTo: "src/**/*.vue, src/components/**/*.vue, src/views/**/*.vue"
---

# 根应用组件映射规范

在根应用根据设计稿实现 UI 时，优先复用 `meri-plus` 与项目已有公共组件，不要凭空新造基础组件。

## Meri Plus 优先

Figma 中出现的基础组件，如：

- 按钮
- 输入框
- 下拉选择
- 复选框 / 单选框
- Tabs
- Tag
- 树形
- 表单

优先映射到 `meri-plus`。

如需了解组件，优先通过 MCP 顺序查看：

1. `list_components`
2. `get_component_doc`
3. `get_component_code`
4. `get_component_style`

## 项目公共组件优先复用

在根应用中，优先检查并复用：

- `src/components/I18nSlot.vue`
- `src/components/common/Empty.vue`
- `src/components/common/FloorSelect.vue`
- `src/components/common/SvgIcon.vue`
- `src/components/common/SetButton.vue`
- `src/components/common/SetDiv.vue`
- `src/components/common/SetRadio.vue`

图表相关组件优先检查：

- `src/components/echarts/`

## 图标与权限控件

- 图标优先复用现有 `SvgIcon` 或 Meri Icon
- 需要权限控制的按钮/可点击区域，优先复用 `SetButton` / `SetDiv` / `SetRadio`

## 避免这些做法

- 设计稿里只是普通按钮，却新写一个业务按钮组件
- 已有公共组件能满足需求，却重复造轮子
- 忽略权限组件，直接裸写按钮交互
- 为了一个图标单独引入新图标方案

## 修改后自检

- 是否优先复用了 `meri-plus`
- 是否检查了项目已有公共组件
- 是否在需要权限控制时使用了对应权限组件
- 是否保持了项目现有组件风格与目录习惯