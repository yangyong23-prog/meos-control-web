---
name: meri-ui-component-authoring
description: "Meri UI 组件编写技能。适用于在 meri-plus 中新增或改造组件、补齐导出、样式、文档与本地验证闭环。"
---

# meri-ui-component-authoring

用途:
- 在 meri-plus 中新增/修改组件的标准流程与检查清单。

适用场景:
- 新增组件、改造组件 API、补齐导出与文档。

新增组件流程(最小闭环):
1) 创建目录结构:
   - packages/components/<name>/src
   - packages/components/<name>/styles
2) 组件实现:
   - packages/components/<name>/src/<Component>.tsx
   - packages/components/<name>/src/<Component>Props.ts
3) 入口与样式:
   - packages/components/<name>/index.ts (withInstall 导出)
   - packages/components/<name>/styles/index.less
4) 文档:
   - packages/components/<name>/index.md
5) 汇总导出:
   - packages/components/components.ts
6) 如需全局样式/主题变量:
   - packages/theme/index.less 或 packages/theme/styles/*.less

导出模板(参考现有组件):
- packages/components/<name>/index.ts 使用 withInstall + export * from './src/<Component>'
- packages/components/components.ts 添加 export * from './<name>'

本地验证建议:
- 用 play/ 演示项目写最小 Demo
- 或在 packages/components/<name>/test/ 下补 demo
- 启动: pnpm run dev

常见注意事项:
- 组件命名与前缀: install(app, prefix = 'M')
- Message 等服务型组件通常不注册全局组件
- 样式按需: 组件 styles/index.less + 主题 theme/index.less

参考文件:
- README.md (新建组件步骤)
- packages/components/utils/with-intall.ts
- packages/components/components.ts
- packages/components/index.ts
