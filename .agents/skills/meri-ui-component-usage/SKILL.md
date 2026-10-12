---
name: meri-ui-component-usage
description: "Meri UI 组件使用技能。适用于说明 meri-plus 的安装、全局注册、按需使用、主题样式与 teleport scope 设置。"
---

# meri-ui-component-usage

用途:
- 统一回答 meri-plus 的安装与使用方式、全局/局部注册、主题与 teleport scope。

适用场景:
- 用户询问如何在 Vue 3 项目中引入 meri-plus 或单独组件。

安装:
- npm install meri-plus -S
- pnpm install meri-plus -S

全局注册:
- import Meri from 'meri-plus'
- app.use(Meri).mount('#app')
- 引入样式: import 'meri-plus/theme/index.css'

按需/部分注册:
- import { Button, message } from 'meri-plus'
- app.use(Button)
- app.config.globalProperties.$message = message

teleport 样式范围:
- import { setTeleportScopeClass } from 'meri-plus'
- setTeleportScopeClass('your-scope-class')

局部注册(不推荐):
- 在单组件内 components: { MButton }

参考文件:
- guide/quickstart.md
- packages/components/index.ts
