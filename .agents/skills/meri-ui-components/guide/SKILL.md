---
name: guide
description: "Meri UI guide 组件技能。适用于查阅 guide 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-guide

用途:
- 引导/新手提示。

API 要点:
- 属性:
| 名称     | 类型    | 可选值                                   | 默认值  | 说明                                                       |
| :------- | :------ | :--------------------------------------- | :------ | :--------------------------------------------------------- |
| visible   | Boolean  | true/false                   | true  | 显隐控制 |
| step     | String  | single / multiple | single | 步骤类型，单步/多步骤                                                   |
| title     | String |                             | ""   | 步骤标题文字 ** 传入插槽时无效                                                |
| content  | String |                             | ""   | 内容文字    ** 传入插槽时无效                                       |
| singleText  | String |                             | "我知道了"   | 单步骤按钮文字 ** 传入插槽时无效
| stepTip     | Object  |                               |    "{gi: 1,count: 1,jumptext: '跳过全部', nexttext: '下一步' }"     | 多步骤需要传入
| deviationLeft| Number  |                                          |    0     | 弹窗偏移量,上下弹出生效,正向右偏移，负向左偏移，设置后，偏移计算相对于上左或者下左
| deviationTop| Number  |                                          |    0     | 弹窗偏移量,左右弹出生效，正向下偏移。负向上偏移，设置后，偏移计算相对于左上或者右上
| deviationArrow| Number  |                                          |    0     | 弹窗三角偏移量，相对于触发器的左边或者上边位置

- 事件:
| 名称    | 参数       | 说明         |
| :------ | :--------- | :----------- |
| close | (e: Event) | 我知道了 按钮点击回调，弹窗默认不关闭，需要手动修改visible 属性控制 |
| closeall | (e: Event) | 跳过全部 按钮点击回调，弹窗默认不关闭，需要手动修改visible 属性控制 | |

- 插槽:
| 名称    | 说明             |
| :------ | :--------------- |
| default | 按钮触发器 |
| guidtitle | 自定义标题 |
| guidcontent | 自定义内容 |
| guidstep | 自定义底部操作栏 |

示例用法:
```vue
<template>
  <div class="guide">
    <m-guide title="这里是标题" flow="rightTop" :visible="visible" @close="close" singleText="自定义按钮名称"
      content="文本说明文本说明文本说明文本说明文本说明文本说明文本说明文本说明文本说明文本说明">
      <m-button type="primary" @click="show">测试按钮</m-button>
    </m-guide>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref
  } from 'vue'
  export default defineComponent({
    setup() {
      const visible = ref(true)
      const close = () => {
        visible.value = false
      }
const show = () => {
        visible.value = true
      }
      return {
        close,
        visible,
        show
      }
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
- 适用场景: 新手引导/高亮提示
- 真实业务场景+推荐组合: 新手引导（Guide + Button + Modal）
- 常用用法: 指定目标元素与步骤
- 高级用法: 自定义遮罩与文案
- 主题与样式: 高亮样式与提示框样式
- 兼容性: 需确保目标元素可定位
- 性能建议: 引导步骤过多时分批展示
- 迁移提示: 目标选择器写法需确认
- 故障排查: 不显示多为元素未渲染

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/guide/index.ts
- packages/components/guide/index.md
- packages/components/guide/test/single.vue
