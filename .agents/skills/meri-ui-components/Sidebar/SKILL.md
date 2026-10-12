---
name: sidebar
description: "Meri UI Sidebar 组件技能。适用于查阅 Sidebar 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-Sidebar

用途:
- 侧边栏导航。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
    <div class="container">
      <m-sidebar v-model:width="width" :changeSize="false" v-model:show="show" :resident="true">
      </m-sidebar>
    </div>
  </template>

<script lang="ts" setup>
import { ref } from "vue"

const width = ref(400);
const show = ref(true);
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 侧边栏导航
- 真实业务场景+推荐组合: 后台导航（Sidebar + Icon + Badge）
- 常用用法: 展开/收起与选中项
- 高级用法: 多级菜单与图标
- 主题与样式: 宽度与主题色
- 兼容性: 与路由联动
- 性能建议: 菜单项过多时懒加载
- 迁移提示: 数据结构字段需适配
- 故障排查: 选中不高亮多为 key 不一致

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/Sidebar/index.ts
- packages/components/Sidebar/index.md
- packages/components/Sidebar/test/resident.vue
