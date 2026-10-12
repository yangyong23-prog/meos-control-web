---
name: icon
description: "Meri UI icon 组件技能。适用于查阅 icon 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-icon

用途:
- 图标组件。

API 要点:
- 属性:
| 名称   | 类型    | 可选值     | 默认值     | 说明        |
| :----- | :------ | :--------- | :--------- | :---------- |
| type   | String  | 如图上所示 | iconcreate | Icon 的类型 |
| rotate | Boolean | Boolean    | false      | 是否旋转    |

示例用法:
```vue
<template>
  <span class="item" v-for="item in icons" :key="item.icon_id"
    ><m-icon :type="item.font_class"></m-icon>
    <span class="name" v-text="item.name"></span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const icons = [
    {
      "icon_id": "26993124",
      "name": "IconUp",
      "font_class": "IconUp",
      "unicode": "e6f1",
      "unicode_decimal": 59121
    },
    {
      "icon_id": "26464950",
      "name": "IconTransfer",
      "font_class": "IconTransfer",
      "unicode": "e6e9",
      "unicode_decimal": 59113
    },
    {
      "icon_id": "26464665",
      "name": "IconEdit",
      "font_class": "IconEdit",
      "unicode": "e6e1",
      "unicode_decimal": 59105
    },
    {
      "icon_id": "26459778",
      "name": "IconAnalysis",
      "font_class": "IconAnalysis1",
      "unicode": "e71b",
      "unicode_decimal": 59163
    },
    {
      "icon_id": "26459779",
      "name": "IconMonitor",
      "font_class": "IconMonitor2",
      "unicode": "e71c",
      "unicode_decimal": 59164
    },
    {
      "icon_id": "26459504",
      "name": "IconStrategy",
      "font_class": "IconStrategy",
      "unicode": "e70f",
      "unicode_decimal": 59151
    },
    {
      "icon_id": "26459505",
      "name": "IconYearerlier",
      "font_class": "IconYearerlier",
      "unicode": "e710",
      "unicode_decimal": 59152
    },
    {
      "icon_id": "26459506",
      "name": "IconReply",
      "font_class": "IconReply1",
      "unicode": "e711",
      "unicode_decimal": 59153
    },
    {
      "icon_id": "26459507",
      "name": "IconRelation",
      "font_class": "IconRelation",
      "unicode": "e712",
      "unicode_decimal": 59154
    },
    {
      "icon_id": "26459508",
      "name": "IconSubitem",
      "font_class": "IconSubitem",
      "unicode": "e713",
      "unicode_decimal": 59155
    },
    {
      "icon_id": "26459509",
      "name": "IconWarningPolice",
      "font_class": "IconWarningPolice",
      "unicode": "e714",
      "unicode_decimal": 59156
    },
    {
      "icon_id": "26459510",
      "name": "IconAudit",
      "font_class": "IconAudit",
      "unicode": "e715",
      "unicode_decimal": 59157
    },
    {
      "icon_id": "26459511",
      "name": "IconWeather",
      "font_class": "IconWeather",
      "unicode": "e716",
      "unicode_decimal": 59158
    },
    {
      "icon_id": "26459512",
      "name": "IconFastforward",
      "font_class": "IconFastforward1",
      "unicode": "e717",
      "unicode_decimal": 59159
    },
    {
      "icon_id": "26459513",
      "name": "IconTimetable",
      "font_class": "IconTimetable",
      "unicode": "e718",
      "unicode_decimal": 59160
    },
    {
      "icon_id": "26459514",
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 图标展示
- 真实业务场景+推荐组合: 操作图标（Icon + Button/Tooltip）
- 常用用法: 指定 icon 名称
- 高级用法: 自定义大小/颜色
- 主题与样式: 统一图标色
- 兼容性: 依赖 iconfont 资源
- 性能建议: 避免渲染大量图标
- 迁移提示: 图标名与旧库不同
- 故障排查: 图标不显示多为字体未加载

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/icon/index.ts
- packages/components/icon/index.md
- packages/components/icon/test/type.vue
