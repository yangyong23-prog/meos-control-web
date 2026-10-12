---
name: tabs
description: "Meri UI tabs 组件技能。适用于查阅 tabs 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-tabs

用途:
- 标签页切换。

API 要点:
- 属性:
| 名称                  | 类型   | 可选值                                                                                                | 默认值 | 说明                                             |
| :-------------------- | :----- | :---------------------------------------------------------------------------------------------------- | :----- | :----------------------------------------------- |
| model-value / v-model | String | -                                                                                                     | -      | 选中的对象 ID                                    |
| data                  | [ ]    | -                                                                                                     | [ ]    | 选项集合 详细解释如下                            |
| type                  | string | `line` - `segment` - `border`                                                                         | line   | 类型                                             |
| backgroundColor       | string | CSS ColorValue                                                                                        | ''     | 背景颜色                                         |
| size                  | string | `large` - `medium` - `small`                                                                          | medium | tabs 大小，line 模式下只有`large` - `medium`可选 |
| scrollPosition        | string | `start` - `end`                                                                                       | start  | Tab 较多的时候，选中滑块滚动最终停留的位置       |
| item-width            | string | -                                                                                                     | -      | 每一个 tabs-item 的 width 设置                   |
| renderSlot            | object | ` {component:component,html:string,style:object}`                                                     | -      | item 中的插槽渲染                                |
| renderPreSlot         | object | ` {component:component,html:string,style:object,iconName: string,iconSize: number,iconColor: string}` | -      | item 中的前置插槽渲染                            |

| 名称   | 类型                                 | 可选值 | 默认值 | 说明         |
| :----- | :----------------------------------- | :----- | :----- | :----------- |
| change | function(item: object, event: Event) | -      | -      | 点击回调事件 |

| 名称        | 类型 | 说明          |
| :---------- | :--- | :------------ |
| setBarStyle | -    | 计算 tab 宽度 |

示例用法:
```vue
<template>
	<div style="width: 100%">
		<span style="color: #ffa53d">size：medium + 设置长度显示左右箭头：</span>
		<m-tabs :data="items1" :style="{ width: '375px' }" :scrollPosition="'end'" v-model="on" @change="tabChange" />
	</div>

	<div style="width: 100%">
		<span style="color: #ffa53d">size：large + 插槽长：</span>
		<m-tabs :data="items2" size="large" v-model="on">
			<template #name="{ item, index }"><del style="color: red;font-weight: 700;">{{ item.name  + index}}</del></template>
		</m-tabs>
	</div>

  <div class="page-box">
    <div class="tab-box">
      <m-tabs :data="items3" :style="{ width: '100%' }" size="large"  :scrollPosition="'end'" v-model="on" />
    </div>
    <div class="remind-text">size：medium + 左右箭头</div>
	</div>
</template>

<script setup lang="ts">
import { ref, h, render } from 'vue'
import MBadge from '../../badge'

const on = ref('6')

const items1 = ref<any[]>([
	{
		id: '1',
		name: `页签一`,
		disabled: false,

	},
	{
		id: '2',
		name: `页签二`,
		disabled: true,
	},
	{
		id: '3',
		name: `页签三322`,
		disabled: false
		// renderSlot: {
		//   html: `<div>(<span style="color: red">23</span>/100)</div>`,
		// }
		// renderSlot: {
		//   component: h(MLogo, {count: 10, show: true}),
		//   style: {
		//     margin: '-7px 0px 4px 16px'
		//   }
		// },
	},
	{
		id: '4',
		name: `页签四`,
		disabled: false
	},
	{
		id: '5',
		name: `页签五`
	},
	{
		id: '6',
    name: `页签六333`,
    renderSlot: {
			component: h(MBadge, { count: 100, show: true }),
			style: {
				margin: '-10px 0px 4px 16px'
			}
		}
	},
	{
		id: '7',
		name: `页签七`
	}
])

const items2 = ref<any[]>([
	{
		id: '1',
		name: `页签一`,
		disabled: false,
    slotName: 'name'
	},
	{
		id: '2',
		name: `页签二`,
		disabled: true
	},
	{
		id: '3',
		name: `页签三322`,
		disabled: false,
		renderSlot: {
			component: h(MBadge, { count: 100, show: true }),
			style: {
				margin: '-7px 0px 4px 16px'
			}
		}
	},
	{
		id: '4',
		name: `页签四`,
		disabled: false
	},
	{
		id: '5',
		name: `页签五`,
		renderSlot: {
			html: `<div>(<span style="color: red">23</span>/100)</div>`
		}
	},
	{
		id: '6',
		name: `页签六333`
	}
])
const items3 = ref<any[]>([
	{
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 内容分组切换
- 真实业务场景+推荐组合: 详情页分区（Tabs + Table + Form）
- 常用用法: `value` 控制当前 tab
- 高级用法: 可关闭、图标、分段样式
- 主题与样式: 线型/卡片型/分段型
- 兼容性: 动态 tab 需稳定 key
- 性能建议: 大内容可懒加载
- 迁移提示: 与旧组件的 key/value 不同
- 故障排查: 切换不生效多为 value 不一致

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/tabs/index.ts
- packages/components/tabs/index.md
- packages/components/tabs/test/line.vue
