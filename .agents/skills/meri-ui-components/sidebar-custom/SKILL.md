---
name: sidebar-custom
description: "Meri UI SidebarCustom 组件技能。适用于查阅 SidebarCustom 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-SidebarCustom

用途:
- 自定义侧边栏。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
    <m-sidebar-custom width="400" :changeSize="true" :show="true">
    </m-sidebar-custom>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 自定义侧边栏布局
- 真实业务场景+推荐组合: 可定制菜单（SidebarCustom + Drag/Config）
- 常用用法: 自定义插槽结构
- 高级用法: 复杂交互与拖拽
- 主题与样式: 自定义布局样式
- 兼容性: 注意插槽结构与事件绑定
- 性能建议: 复杂菜单项按需渲染
- 迁移提示: 结构与 Sidebar 不同
- 故障排查: 交互异常多为 slot 结构不匹配

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/SidebarCustom/index.ts
- packages/components/SidebarCustom/index.md
- packages/components/SidebarCustom/test/resident.vue
