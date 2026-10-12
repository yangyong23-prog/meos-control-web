---
name: dropdown
description: "Meri UI dropdown 组件技能。适用于查阅 dropdown 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-dropdown

用途:
- 下拉菜单。

API 要点:
- 属性:
| 名称       | 类型   | 可选值            | 默认值  | 说明 |
| :--------- | :----- | :---------------- | :------ | :------------- |
| options | Array | [] | [] | 数据列表 |
| text | String | any | - | 触发下拉菜单的文字内容 |
| type | String | text \| button | text | 触发下拉菜单的类型，默认text |
| trigger | String | hover \| click | hover | 触发的方式, 默认hover |
| showArrow | Boolean | true \| false | false | 下拉框是否显示箭头 |
| showSearch | Boolean | true \| false | false | 是否有可搜索下拉框 |
| search \| v-model:search | String \| Number | - | '' | 搜索框绑定的值 |
| modelValue \| v-model | Boolean | true \| false | false | 手动触发绑定的值 |
| open \| v-open | Boolean | true \| false | false | 手动控制显示隐藏时绑定的值 |

| 参数       | 类型   | 说明 |
| :--------- | :----- | :---------------- |
| label | String | 下拉操作项内容 (必须)|
| key | String | 下拉操作项唯一标识(必须) |
| disabled | Boolean | 下拉操作项是否禁用 |
| type | String | 分组下拉的类型（可选值divider） |
| divider | Boolean | 是否展示分割线 |
| slotName | String | 每项插槽的名称 |

| 名称     | 类型                 | 说明                   |
| -------- | -------------------- | ---------------------- |
| show | (status: boolean) => void | 下拉菜单展开的回调 |
| close | (status: boolean) => void | 下拉菜单关闭的回调 |
| change | (value: string, option: OptionType) => void | 选中值发生变化时触发 |
| optionClick | (value: string, option: OptionType) => void | 选项点击时触发 |
| btnClick | (e:MouseEvent) => void | 按钮类型按钮点击时触发 |

- 插槽:
| 名称名  | 说明                        |
| :------ | :-------------------------- |
| empty | 空状态 |
| slotName | 每项插槽的名称 |

示例用法:
```vue
<template>
	<div>
		<m-dropdown :options="options" :disabled="true" text="Dropdown List" @optionClick="optionClick"> </m-dropdown>&nbsp;
		<m-dropdown type="button" :disabled="true" :options="options" text="Dropdown List" @optionClick="optionClick"> </m-dropdown>
	</div>
	<div>
		<m-dropdown
			:options="options"
			text="Dropdown List"
			type="button"
			trigger="click"
			@change="change"
			@optionClick="optionClick"
			placement="bottom-end"
			v-model="data"
		>
			<m-tips content="包含岗位实例不支持添加" theme="darkTransparent"> <div>123</div> </m-tips>
		</m-dropdown>
		<m-button @click="changeData">修改</m-button>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { OptionType } from '../src/props'
import { $Message } from '../../message'
export default defineComponent({
	setup() {
		const state = reactive({
			options: [
				{
					label: '他知，大海无量。',
					key: '1'
				},
				{
					label: '流年',
					key: "brown's hotel, london"
				},
				{
					label: '袭月',
					key: 'atlantis nahamas, nassau'
				},
				{
					label: '只有',
					key: 'the beverly hills hotel, los angeles'
				},
				{
					label: '他知，大海无量',
					key: 'marina bay sands2'
				},
				{
					label: '流年',
					key: "brown's hotel, london2"
				},
				{
					label: '袭月',
					key: 'atlantis nahamas, nassau2'
				},
				{
					label: '只有',
					key: 'the beverly hills hotel, los angeles2'
				},
				{
					label: '他知，大海无量',
					key: 'marina bay sands3'
				},
				{
					label: '流年',
					key: "brown's hotel, london23"
				},
				{
					label: '袭月',
					key: 'atlantis nahamas, nassau23'
				},
				{
					label: '只有',
					key: 'the beverly hills hotel, los angeles23'
				},
				{
					label: '他知，大海无量',
					key: 'marina bay sands24'
				},
				{
					label: '流年',
					key: "brown's hotel, london24"
				},
				{
					label: '袭月',
					key: 'atlantis nahamas, nassau24'
				},
				{
					label: '只有',
					key: '2'
				}
			],
			data: '2'
		})
		const arr = [1, 2, 3, 4, 5, 6, 7, 8]

		return {
			...toRefs(state),
			change(data: string, obj: OptionType) {
				$Message.success({ title: obj.label })
			},
			changeData() {
				state.data = '1'
			},
			optionClick() {
				console.log(111111)
			}
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
- 适用场景: 操作菜单与更多项
- 真实业务场景+推荐组合: 更多操作（Dropdown + Button + Icon）
- 常用用法: 触发器 + menu 项
- 高级用法: 搜索、分组、禁用项
- 主题与样式: 菜单宽度与高亮项
- 兼容性: 触发器需有可点击区域
- 性能建议: 菜单项过多时用搜索
- 迁移提示: 事件名称可能不同
- 故障排查: 无法展开多为触发器 slot 结构问题

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/dropdown/index.ts
- packages/components/dropdown/index.md
- packages/components/dropdown/test/default.vue
