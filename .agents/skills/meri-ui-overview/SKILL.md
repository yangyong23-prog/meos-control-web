---
name: meri-ui-overview
description: "Meri UI 总览技能。适用于快速理解 meri-plus 组件库的项目结构、构建流程、文档入口与本地调试方式。"
---

# meri-ui-overview

用途:
- 快速理解 meri-plus (Vue 3 组件库) 的项目结构、构建流程、文档与本地调试方式。

适用场景:
- 需要在项目里定位入口/组件目录/主题样式/文档站点。
- 需要快速回答“怎么跑起来/怎么构建/怎么发布”的问题。

核心入口与目录:
- 组件汇总导出: packages/components/components.ts
- 组件库安装入口: packages/components/index.ts
- 组件源码: packages/components/<component>/src
- 组件样式: packages/components/<component>/styles/index.less
- 文档(组件级): packages/components/<component>/index.md
- 主题样式: packages/theme/index.less, packages/theme/styles/*.less, packages/theme/theme.css
- 构建脚本: build/index.ts (gulp tasks)
- 文档站点: guide/*.md 与根目录 index.md
- 演示/调试: play/

常用命令:
- 文档本地开发: pnpm run doc:dev
- 文档构建: pnpm run build:docs
- 开发调试(演示项目): pnpm run dev
- 构建组件库: pnpm run build

组件分类概览(根据 components.ts):
- 基础: avatar, button, badge, banner, icon, tag, tips
- 表单: checkbox, checkBoxGroup, radio, radioGroup, input, inputNum, inputNumber, select, selectCreate, cascader, datePicker, timepicker, monthDayPicker, form, formItem, switch
- 数据展示: table, tree, treeSelect, transfer, steps/step, pagination, listSkeleton, virtualList
- 导航/布局: breadcrumb, anchor, tabs, collapse, drawer, sidebar/SidebarCustom
- 反馈/提示: message, messageBox, notification, modal, popConfirm, popover, popup, loading
- 其他: guide, illustration, search, dropdown, scrollbar

工作方式:
1) 先检查 packages/components/components.ts 与 packages/components/index.ts 了解导出与安装逻辑。
2) 若涉及样式，查看 packages/theme 与组件 styles/index.less。
3) 若涉及文档，查看 guide/*.md 与 packages/components/<component>/index.md。
4) 若涉及构建与发布，查看 build/*.ts 与 package.json scripts。

参考文件:
- README.md
- package.json
- packages/components/components.ts
- packages/components/index.ts
- build/index.ts
- guide/quickstart.md
