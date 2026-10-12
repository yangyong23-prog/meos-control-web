---
name: table
description: "Meri UI table 组件技能。适用于查阅 table 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-table

用途:
- 表格数据展示。

API 要点:
- 属性:
| 名称                 | 类型                                                                                                                   | 可选值/示例                          | 默认值    | 说明                                                            |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :----------------------------------- | :-------- | :-------------------------------------------------------------- |
| checkbox             | Boolean                                                                                                                |                                      | false     | 表格允许复选                                                    |
| evenColor            | Boolean                                                                                                                |                                      | false     | 是否开启奇偶行变色                                              |
| setting              | Boolean                                                                                                                |                                      | false     | 设置对应的列展示                                                |
| columns              | Column[]                                                                                                               | 例如：`{dataIndex:"1",title:"标题"}` | {}        | 列信息                                                          |
| dataSource           | Row                                                                                                                    | 例如：`{id:"1"}`                     | {}        | 节点唯一标识                                                    |
| size                 | string                                                                                                                 | medium / small                       | medium    | 表格尺寸                                                        |
| colunmMinWidth       | number                                                                                                                 | 100                                  | 89        | 最小宽                                                          |
| mergeMethod          | `(row: Row, col: Column, rowIndex: number, colIndex: number,isCheckbox:boolean) => { rowspan: number,colspan: number}` |                                      | undefined | 合并行的回调                                                    |
| columnLine           | Boolean                                                                                                                | true/ false                          | false     | 是否显示列的竖线                                                |
| resizable            | Boolean                                                                                                                | true/ false                          | false     | 是否可以通过设置面板拖拽列的排序（合并表头的情况下无效）        |
| disableSelectAll     | Boolean                                                                                                                | true/ false                          | false     | 禁用全选 CheckBox                                               |
| rowClassName         | `(row: Row, rowIndex: number) => string`                                                                               |                                      | undefined | 自定义行样式                                                    |
| activeRows           | String[]                                                                                                               | 例如：`["id-1"]`                     | undefined | 需要高亮显示的行                                                |
| treeLinkage          | Boolean                                                                                                                | true/ false                          | true      | 树形表格复选的时候是否联动（默认上下级联动）                    |
| emptyText            | String                                                                                                                 | "--"                                 | ""        | 当值不为空时，单元格 null/undefined/空字符串，自动转为传入值    |
| cellClassNameFn      | `(row: Row, col: Column) => string[]`                                                                                  |                                      | undefined | 单元格 Td 的样式类回调                                          |
| cellIdFn             | `(row: Row, col: Column) => string`                                                                                    |                                      | undefined | 单元格 Td 的 Id 回调                                            |
| cellStyleFn          | `(row: Row, col: Column) => object`                                                                                    |                                      | undefined | 单元格 Td 的内联样式回调                                        |
| tooltipPosition      | string                                                                                                                 | absolute/fixed                       | undefined | tooltip 的渲染方式                                              |
| showHeaderCheckbox   | boolean                                                                                                                | true/ false                          | true      | checkbox 设置为 true 的是否，该属性可以控制是否隐藏头部的复选框 |
| settingAllExpand     | boolean                                                                                                                | true/ false                          | false     | 列设置弹窗中是否出现全部展开的复选框                            |
| settingConfirmText   | string                                                                                                                 | ""                                   | "确定"    | 列设置弹窗中确定按钮的文本                                      |
| settingCancelText    | string                                                                                                                 | ""                                   | "取消"    | 列设置弹窗中取消按钮的文本                                      |
| disableSelectAllText | string                                                                                                                 | ""                                   | ""        | disableSelectAll 设置为 true 时，hover 显示的提示文字           |
| lastStageGray        | Boolean                                                                                                                | true/ false                          | fales     | 将树形表格中，层级为非顶级节点的最末级行底色修改为--gray-50     |

| 名称            | 类型                                                                  | 可选值/示例                          | 默认值  | 说明                                                                                                            |
| :-------------- | :-------------------------------------------------------------------- | :----------------------------------- | :------ | :-------------------------------------------------------------------------------------------------------------- |
| title           | string                                                                |                                      |         | （必填）列头显示文字                                                                                            |
| dataIndex       | string                                                                |                                      |         | （必填）列数据在数据项中对应的 Key                                                                              |
| sorter          | boolean                                                               |                                      | false   | 是否的进行排序                                                                                                  |
| sortOrder       | string                                                                | ascend\|descend\|default             | default | 默认排序顺序                                                                                                    |
| fixed           | string\|boolean                                                       | left \ center \ right \ true \ false | false   | 列是否固定,可选 true(等效于 left) 'left' 'right'                                                                |
| resizable       | boolean                                                               | false                                | false   | 是否可拖动调整宽度，此时                                                                                        |
| children        | Column[]                                                              | []                                   | []      | 子列，合并表头时进行使用                                                                                        |
| desc            | string                                                                |                                      | false   | 描述信息                                                                                                        |
| descIcon        | string                                                                |                                      | false   | 描述信息的图标                                                                                                  |
| onlyShow        | boolean                                                               | true/ false                          | false   | 强制显示，不可通过设置弹窗取消选中                                                                              |
| checked         | string                                                                | `checked`/ `uncheck` / `notNull`     | uncheck | 当前列是否显示，可以通过设置弹窗进行修改                                                                        |
| align           | string                                                                | 'left' / 'right' / 'center'          | left    | 文字对其方式                                                                                                    |
| ellipsis        | boolean                                                               | true/ false                          | false   | 超过宽度将自动省略。                                                                                            |
| width           | number                                                                |                                      | 0       | 列宽度                                                                                                          |
| minWidth        | number                                                                |                                      | 89      | 拖动列最小宽度，会受到表格自动调整分配宽度影响                                                                  |
| maxWidth        | number                                                                |                                      |         | 拖动列最大宽度                                                                                                  |
| weight          | number                                                                |                                      | 1       | 按照权重进行列宽度进行划分(相对于其他列的宽度进行比较，weight 和 width 同时设置时，weight 优先级更高，默认为 1) |
| sortCallBack    | (col: Column, state: SortOrder, rows: Row[]) => Row[]                 |                                      |         | 当前列的排序方法（只需要排序相同级，树形菜单会进行递归调用）                                                    |
| formatter       | (row: Row, col: Column, rowIndex: number, colIndex: number) => string |                                      |         | 表格体中每个单元格中显示的文本获取回调函数,入参包括行信息，列信息，返回值必须为字符串。并将文本渲染到单元格中   |
| textNotEllipsis | boolean                                                               | true/ false                          | false   | 开启后表格 body 内部的对应列不会进行超出省略。                                                                  |
| onlyShowText    | string                                                                | ""                                   | ""      | onlyShow 设置为 true 时，hover 提示的文字                                                                       |

| 名称               | 类型     | 可选值/示例  | 默认值 | 说明                                                                                                        |
| :----------------- | :------- | :----------- | :----- | :---------------------------------------------------------------------------------------------------------- |
| id                 | string   |              |        | （必填）当前行 Id                                                                                           |
| children           | Row[]    |              |        | 树形表格使用                                                                                                |
| checked            | boolean  |              | false  | 当前行是否被选中(设置复现框的时候可以附加默认值)                                                            |
| disable            | boolean  |              | false  | 当前行是否被禁用选中(设置复现框的时候可以附加默认值)                                                        |
| checkbox           | boolean  |              | false  | 在第一列的表格中显示复选框（树形菜单使用）                                                                  |
| open               | boolean  | true \ false | false  | 当前行是否展开（树形菜单使用）                                                                              |
| loading            | boolean  | true \ false | false  | 用于是否在远程加载数据，修改当前加载的状态                                                                  |
| slot               | boolean  | true \ false | true   | 是否通过 row:slot 插槽对该行信息的渲染                                                                      |
| children           | Column[] | []           | []     | 子行，树形菜单使用                                                                                          |
| checkDisableTip    | string   | ""           | ""     | disable 为 true 时，hover 显示的提示文字                                                                    |
| [propName: string] | any      |              | false  | 在 Colum 的 dataIndex 都必须包含在该行信息中（合并表头的单元格最末级列的 dataIndex 必须包含在当前的表格中） |

| 名称          | 类型                          | 可选值/示例 | 默认值 | 说明                                       |
| :------------ | :---------------------------- | :---------- | :----- | :----------------------------------------- |
| tooltip       | `({checkeds:Row[]}) => Vnode` |             | null   | 选中后头部弹窗的插槽                       |
| col.dataIndex | `(Row) => Vnode`              |             | null   | 表格数据中 col.dataIndex 对应列的渲染插槽  |
| row           | `({ Row, Index })=>Vnode`     |             | null   | 当 Row.slot 为 true 时会通过该插槽进行渲染 |
| nodata        | `()=>Vnode`                   |             | null   | 通过 nodata 插槽自定义暂无数据时的配图     |

| 名称           | 类型                                             | 可选值/示例 | 默认值 | 说明                                                                                                                 |
| :------------- | :----------------------------------------------- | :---------- | :----- | :------------------------------------------------------------------------------------------------------------------- |
| checkedChange  | `({items:Row[],selecteds:Row[]}) => void`        |             | null   | items 当前操作的行，以及影响的行例如：树形菜单取消选中第二级会把第一级和其子集都返回，selecteds 当前列表已经选中的行 |
| sortChange     | `({col:Column,state:string}) => void`            |             | null   | 排序点击事件                                                                                                         |
| rowClick       | `(e: Event, row: Row) => void`                   |             | null   | 行点击事件                                                                                                           |
| expandChange   | `(e: Event, openState:boolean,row: Row) => void` |             | false  | 树形展开收起的回调                                                                                                   |
| tableSetCancel | `(columns: Column[]) => void`                    |             |        | 表格列设置弹窗确定回调                                                                                               |
| tableSetSumit  | `(columns: Column[]) => void`                    |             |        | 表格列设置弹窗取消回调                                                                                               |
| tableSetReset  | `(columns: Column[]) => void`                    |             |        | 表格列设置弹窗重置回调                                                                                               |

| 名称           | 说明                   | 类型                  |
| :------------- | :--------------------- | :-------------------- |
| resetScrollbar | 恢复滚动条的位置       | `() => void`          |
| refScrollbar   | 滚动条的 ref 对象      | `Ref<HTMLDivElement>` |
| scrollToById   | 将表格内容滚动至对应行 | `(id:string)=>void`   |

示例用法:
```vue
<template>
	<div class="container">
		<m-table :columns="list" :dataSource="data" :setting="true" :checkbox="true">
			<template #right>123</template>
		</m-table>
		<m-button @click="add" style="width: 100%">add</m-button>
	</div>
</template>

<script lang="ts">
import { defineComponent, h, reactive, ref } from 'vue'
import _ from 'lodash'
export default defineComponent({
	components: {},
	setup() {
		const data = ref(
			_.range(20).map(index => {
				return {
					id: `id-${index}`,
					'0': index,
					'1': 100 - index,
					'2': `占位文字-${index}`,
					'3': `占位文字-${index}`,
					'4': `占位文字-${index}`,
					'5': `占位文字`,
					'6': `占位文字-${index}`,
					'7': `占位文字`,
					'8': `占位文字-${index}`
				}
			})
		)

		const list = ref([
			{
				dataIndex: '0',
				title: '序号',
				weight: 1
			},
			{
				dataIndex: '1',
				title: '大小'
			},
			{
				dataIndex: '2',
				title: `右对齐`,
				weight: 1,
				headerSlot: 'right'
			}
		])
		const add = () => {
			const index = data.value.length
			data.value.push({
				id: `id-${index}`,
				'0': index,
				'1': 100 - index,
				'2': `占位文字-${index}`,
				'3': `占位文字-${index}`,
				'4': `占位文字-${index}`,
				'5': `占位文字`,
				'6': `占位文字-${index}`,
				'7': `占位文字`,
				'8': `占位文字-${index}`
			})
		}
		return { list, data, add }
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
- 适用场景: 大量结构化数据展示、固定列与树形表格
- 真实业务场景+推荐组合: 设备清单（Table + Pagination + Search + Drawer 详情）
- 常用用法: `columns` + `data` + `rowKey` 的基础表格
- 高级用法: 固定列/表头、合并单元格、可拖拽列、树形/虚拟滚动
- 主题与样式: 行高/斑马纹/表头样式与列宽统一控制
- 兼容性: 固定列需明确列宽，容器需有确定宽度
- 性能建议: 大数据量用虚拟滚动/分页，避免深层响应式
- 迁移提示: 与其他表格组件的列配置字段可能不同
- 故障排查: 表格空白多为 `rowKey`/数据字段不匹配

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/table/index.ts
- packages/components/table/index.md
- packages/components/table/test/BaseTable.vue
