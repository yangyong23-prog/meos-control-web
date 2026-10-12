---
name: button
description: "Meri UI button 组件技能。适用于查阅 button 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-button

用途:
- 按钮触发交互或提交操作。

API 要点:
- 属性:
| 名称     | 类型    | 可选值                                   | 默认值  | 说明                                                       |
| :------- | :------ | :--------------------------------------- | :------ | :--------------------------------------------------------- |
| size     | String  | large / medium / small                   | medium  | 按钮大小,图标通过插槽传入图标， 需要通过图标的属性设置大小 |
| type     | String  | default / primary / danger / link /  text /icon | default | 按钮类型                                                   |
| disabled | Boolean | true /  false                            | false   | 是否禁用                                                   |
| loading  | Boolean | true /  false                            | false   | 是否正在加载中                                             |
| icon-bg  | Boolean | true/  false                             | false   | icon按钮是否添加背景颜色，只针对type=icon生效
| icon     | String  |                                          |         | 只针对type=icon生效
| icon-size| Number  |                                          |         | 只针对type=icon生效
| icon-position| String  | left/right                      |  left    | 有icon生效

- 事件:
| 名称    | 参数       | 说明         |
| :------ | :--------- | :----------- |
| onClick | (e: Event) | 按钮点击回调 |

- 插槽:
| 名称    | 说明             |
| :------ | :--------------- |
| default | 按钮中显示的内容 |
| icon | 按钮中显示的图标 |

示例用法:
```vue
<template>
  <m-button type="primary" size="medium">主要按钮</m-button>
  <m-button type="primary" size="medium" icon="IconMeriComponentButtonAdd">
    主要按钮
  </m-button>
  <m-button type="default" size="medium">默认按钮</m-button>
  <m-button type="default" size="medium" icon="IconMeriComponentButtonAdd">
    默认按钮
  </m-button>
  <m-button type="danger" size="medium">警示按钮</m-button>
  <m-button type="danger" size="medium" icon="IconMeriComponentButtonAdd">
    警示按钮
  </m-button>
  <m-button type="text" size="medium">文字按钮</m-button>
  <m-button type="text" size="medium" icon="IconMeriComponentButtonAdd">
    文字按钮
  </m-button>
  <m-button type="link" size="medium" >链接按钮</m-button>
  <m-button type="link" size="medium" icon="IconMeriComponentButtonAdd">
    链接按钮
  </m-button>
  <m-button type="icon" icon="IconMeriComponentButtonAdd" size="medium">图标按钮</m-button>
  <m-button type="icon" icon-bg icon="IconMeriComponentButtonAdd" size="medium">图标按钮</m-button>
  <br />
  <br />
  <m-button type="text" >
    <template #icon>
      <IconMeriComponentButtonAdd style="margin-right: 4px"  :size="16" :color="'#1B2129'" :hoverColor="'#1B2129'" ></IconMeriComponentButtonAdd>
    </template>
    图标按钮
  </m-button>
  <br />
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { IconMeriComponentButtonAdd } from 'meri-icon'
  import "meri-icon/lib/style.css"
  export default defineComponent({
    components:{ IconMeriComponentButtonAdd },
    setup() {
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
- 适用场景: 提交/触发操作
- 真实业务场景+推荐组合: 提交/重置（Button + Form）
- 常用用法: `type` + `size` + `loading`
- 高级用法: icon slot、link/text/icon 模式
- 主题与样式: 主题色/圆角/禁用态
- 兼容性: 与表单 submit 行为配合
- 性能建议: loading 时避免重复触发
- 迁移提示: type 值与其他库不同
- 故障排查: 点击无效多为 disabled 或事件未绑定

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/button/index.ts
- packages/components/button/index.md
- packages/components/button/test/type.vue
