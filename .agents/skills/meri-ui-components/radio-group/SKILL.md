---
name: radio-group
description: "Meri UI radioGroup 组件技能。适用于查阅 radioGroup 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-radioGroup

用途:
- 单选组选项管理。

API 要点:
- 属性:
| 名称       | 类型             | 可选值        | 默认值   | 说明             |
| ---------- | ---------------- | ------------- | -------- | ---------------- |
| modelValue | String \| Number | String/Number | undefind | 选中属性         |
| cancel     | Boolean          | Boolean       | false    | 是否可以取消选中 |

- 事件:
| 名称              | 参数                               | 说明             |
| :---------------- | :--------------------------------- | :--------------- |
| change            | (selected:String \| Number )=>void | 单选框改变的回调 |
| update:modelValue | (selected:String \| Number )=>void | 单选框改变的回调 |

示例用法:
```vue
<template>
    <div>
        <m-radio-group v-model="value">
            <div class="list">
                <m-radio v-for="item in options" :label="item.value"> 名称：{{ item.label }}，值：{{ item.value }}</m-radio>
            </div>
            当前选中的值为：{{ value }}
        </m-radio-group>
    </div>
</template>

<script lang="ts">
import { defineComponent, h, reactive, ref } from 'vue'
import _ from 'lodash'
export default defineComponent({
    components: {},
    setup() {
        const options = ref([
            {
                label: 'A',
                value: 1
            },
            {
                label: 'B',
                value: 2
            },
            {
                label: 'C',
                value: 3
            },
            {
                label: 'D',
                value: 4
            }
        ])

        const value = ref(1);

        return { options, value }
    }
})
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 典型业务场景与推荐组合
- 真实业务场景+推荐组合: 业务页面组合使用（组件本身 + Form/Table/Modal 之一）
- 常用用法: 最常见的 1-2 种写法
- 高级用法: 与 Form/Modal/Table 等组合
- 主题与样式: 关键样式与主题变量
- 兼容性: Teleport/SSR/浏览器注意事项
- 性能建议: 大数据量/频繁更新优化
- 迁移提示: 与旧版本/其他库差异
- 故障排查: 最常见错误与定位路径

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/radioGroup/index.ts
- packages/components/radioGroup/index.md
- packages/components/radioGroup/test/base.vue
