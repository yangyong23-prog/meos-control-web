---
name: switch
description: "Meri UI switch 组件技能。适用于查阅 switch 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-switch

用途:
- 开关切换。

API 要点:
- 属性:
| 名称     | 类型    | 可选值        | 默认值    | 说明
| :------- | :----- | :------------| :-------- | :-------- |
| v-model(modelValue)  | String | checked / uncheck|  uncheck | 绑定的值
| size     | String | default / small|  default | 大小
| loading  | Boolean | true / false|  false | 加载中
| disabled  | Boolean | true / false|  false | 禁用
| beforeChange | function | 无 | 无 | switch状态改变前的钩子， 返回false或者返回Promise 且被reject则停止切换

- 事件:
| 名称              | 参数               | 说明         |
| :---------------- | :----------------- | :----------- |
| change            | (s:State,e: Event) | 切换成功后的回调 |

示例用法:
```vue
<template>
  <m-switch v-model="value1"></m-switch>
  <m-switch v-model="value2" size="small"></m-switch>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const value1 = ref('uncheck');
    const value2 = ref('uncheck');
    return { value1,value2 };
  },
});
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 布尔开关
- 真实业务场景+推荐组合: 开关配置（Switch + FormItem + Tips）
- 常用用法: `v-model` + `disabled`
- 高级用法: 加载态与自定义文案
- 主题与样式: 尺寸与颜色
- 兼容性: 与表单校验联动
- 性能建议: 频繁切换时注意防抖
- 迁移提示: 值类型（true/false）需统一
- 故障排查: 无法切换多为 disabled 或 v-model 绑定错误

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/switch/index.ts
- packages/components/switch/index.md
- packages/components/switch/test/size.vue
