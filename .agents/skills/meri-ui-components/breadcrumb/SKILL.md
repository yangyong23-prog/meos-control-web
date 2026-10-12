---
name: breadcrumb
description: "Meri UI breadcrumb 组件技能。适用于查阅 breadcrumb 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-breadcrumb

用途:
- 面包屑导航。

API 要点:
- 属性:
| **名称**         | **类型** | **可选值** | **默认值** | **说明**            |
|----------------|--------|---------|---------|-------------------|
| separator      | string | -       | >       | 默认文字分隔符           |
| separator-icon | string | -       | -       | meri-icon 图标库名称   |
| nameKey        | string | -       | name    | item渲染对象的取值key    |
| itemNum        | number | -       | 10      | 中间item超过显示省略号，下拉框 |
| data           | Array  | -       | []      | 数据列表，格式参照以下       |
| nameWidth      | number  | -      |         | 面包屑单个宽度，默认自适应     |
| popWidth       | number  | -      |         | 弹出框宽度，默认自适应，限制最小96px     |
| widthAuto      | boolean| true/false   | false| 面包屑宽度是否要自适应    |

示例用法:
```vue
<template>
  <m-breadcrumb @change="change" :data="data"/>
</template>

<script lang="ts" setup>
import {reactive} from "vue";

const data = reactive([
  {
    name: "全部",
    url: "/"
  },
  {
    name: "强电专业",
    url: "/"
  },
  {
    name: "变配电系统超长超长超长超长超长超长超长超长超长超长超长超长超长超长",
    url: "/"
  },
  {
    name: "配电箱",
  }
]);


const change = (item: object, i: number) => {
  console.log(item, i);
}

</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 页面导航路径
- 真实业务场景+推荐组合: 页面层级（Breadcrumb + Icon）
- 常用用法: 逐级渲染菜单
- 高级用法: 自定义分隔符与图标
- 主题与样式: 分隔符样式
- 兼容性: 与路由配合
- 性能建议: 路径较长时考虑折叠
- 迁移提示: slot 结构可能不同
- 故障排查: 分隔符不显示多为 slot 未传

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/breadcrumb/index.ts
- packages/components/breadcrumb/index.md
- packages/components/breadcrumb/test/demo.vue
