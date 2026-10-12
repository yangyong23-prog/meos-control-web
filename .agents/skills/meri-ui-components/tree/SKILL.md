---
name: tree
description: "Meri UI tree 组件技能。适用于查阅 tree 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-tree

用途:
- 树形数据展示/选择。

API 要点:
- 属性:
| 名称              | 类型            | 可选值/示例                                                | 默认值 | 说明                                                                                                                   |
| :---------------- | :-------------- | :--------------------------------------------------------- | :----- | :--------------------------------------------------------------------------------------------------------------------- |
| data              | Array           |                                                            | []     | 树结构数据                                                                                                             |
| v-model           | Array           |                                                            | []     | 已选中选中节点信息                                                                                                     |
| props             | Object          | 例如：`{label:"name",children:"list",class:"mytree-node"}` | {}     | 可配置节点信息，如节点显示的 label 对应字段、children 对应字段，以及节点 class 名配置                                  |
| nodeKey           | String          |                                                            | id     | 节点唯一标识                                                                                                           |
| multiple          | Boolean         | true / false                                               | false  | 是否开启多选                                                                                                           |
| defaultExpandAll  | Boolean         | true / false                                               | false  | 是否默认全部展开                                                                                                       |
| notNull           | Boolean         | true/ false                                                | true   | 是否返回半选状态的数据                                                                                                 |
| checkStrictly     | Boolean         | true/ false                                                | false  | 在多选的情况下是否严格的遵循父子不互相关联的做法                                                                       |
| returnParentNode  | Boolean         | true/ false                                                | false  | 在多选的情况下change事件中是否返回父节点已勾选数据，与checkStrictly冲突                                                                      |
| lastStage         | Boolean         | true/ false                                                | false  | 是否仅末级可选                                                                                                         |
| virtual           | Boolean         | true/ false                                                | false  | 是否启用虚拟列表                                                                                                       |
| filterNodeMethod  | Function |                                                            |        | 树筛选过滤函数                                                                                                 |
| filterValue       | String          |                                                            |        | 树筛选关键字                                                                                                           |
| detachCheckAction | Boolean         | true/ false                                                | false  | 多选状态下是否将 check 动作与行点击事件分离                                                                            |
| readonly          | Boolean         | true/ false                                                | false  | 是否只读，该树只做展示                                                                                                 |
| height            | Number          |                                                            | 0      | 默认高度 100%                                                                                                          |
| itemHeight        | Number          |                                                            | 40     | 节点默认高度，虚拟列表渲染时计算使用                                                                                   |
| indent            | Number          |                                                            | 14     | 水平缩进长度                                                                                                           |
| detachHoverAction | Boolean         | true/ false                                                | false  | 是否将hover动作分离                                                                                                    |
| widthAuto         | Boolean         | true/ false                                                | false  | 树宽度是否自适应
| selectedExpand         | Boolean         | true/ false                                                | true  | 选中项是否展开，默认展开                                   |
| multipleHighlight         | Boolean         | true/ false                                                | false  | 多选情况下行是否高亮        |
| highlightDisabled         | Boolean         | true/ false                                                | true  | 多选情况下禁用节点是否可以高亮        |
| highlightItem         | String         |                                                 | ''  | 手动定义当前高亮元素的id或者自定义nodeKey 默认是空串       |
| checkHighlight         | Boolean         | true/ false                                                | true  | 多选情况下勾选节点是否高亮当前行        |
| searchAsTree         | Boolean         | true/ false                                                | false  | 搜索面板是否以树型展示结果        |
| dataAutoSelect         | Boolean         | true/ false                                                | true  | 特殊场景适用，为false时树data节点checked状态由数据控制且不会触发自动计算关联节点勾选状态        |
| beforeClick  | Function |                                                            |        | 节点点击事件前钩子函数，会返回当前点击节点，上一个点击节点，和放行函数，若放行函数不执行则该次点击无效|
| lazy         | Boolean         | true/ false                                                | false  | 懒加载节点，需配合load属性使用,可懒加载节点通过children对应字段标记        |
| load         | Function         |  (node,done)=>done([])                                              |   | lazy为true时生效,节点展开前触发,函数形参为当前节点和回调函数，回调函数中需返回数据为当前节点的子节点数据 |

- 事件:
| 名称     | 参数                                 | 说明                                                                |
| :------- | :----------------------------------- | :------------------------------------------------------------------ |
| change | (ids:TreeNode[],selectNode:TreeNode,currentNode:TreeNode) | 选中回调，ids 为已选中节点 id 数组，selectNode 为当前选中的节点信息,currentNode 为当前操作的节点信息,如为空则该change事件非交互产生 |
| nodeClick | (currentNode:TreeNode) | 节点点击回调，currentNode 为当前操作的节点信息 |
| nodeEnter | (e:Event,currentNode:TreeNode) | 节点鼠标移入回调，currentNode 为当前的节点信息 |
| nodeLeave | (e:Event,currentNode:TreeNode) | 节点鼠标移出回调，currentNode 为当前的节点信息 |
| nodeExpand | (currentNode:TreeNode) | 节点展开事件，currentNode 为当前的节点信息 |
| nodeCollapse | (currentNode:TreeNode) | 节点收起事件，currentNode 为当前的节点信息 |

| 名称     | 参数                                 | 说明                                                                |
| :------- | :----------------------------------- | :------------------------------------------------------------------ |
| checkAll | (status:Boolean) | 多选情况下的可选节点的全选/全不选 |
| changeExpand | (status:Boolean) | 展开/收起 整颗树 |

- 插槽:
| 名称       | 说明       |
| :--------- | :--------- |
| nodePrefix | 节点前缀   |
| nodeSuffix | 节点后缀   |
| rowSuffix  | 节点行后缀 |
| nodeSlot | 节点插槽,用于自定义渲染节点 |
| searchSlot | 搜索面板插槽,用于自定义搜索结果面板 |

| 名称       | 说明       |
| :--------- | :--------- |
| id |  节点默认唯一标识 可通过配置修改字段|
| name |  节点默认label 可通过配置修改字段  |
| children  | 节点子集 |
| uncheckable | 节点是否不可选 |
| disabled | 节点是否禁用 |

示例用法:
```vue
<template>
    <div style="width:240px;">
			<m-tree
      :data="data"
      ref="tree"
      readonly
			lastStage
			:setNodeClass="() => 'aaaa'"
    >

    </m-tree>
		</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, watch } from 'vue'
import {TreeNode} from '../src/TreeProps'
export default defineComponent({
	setup() {
		const data:Ref<TreeNode[]> = ref([])
		data.value = [
			{
				id: 'SE',
				name: '强电专业',
				children: [
					{
						id: 'SESD',
						name: '强电人防系统',
						children: [
							{
								id: 'SDCU',
								obj_code: 'SDCU',
								name: '强电人防控制模块'
							}
						]
					},
					{
						id: 'SELT',
						name: '照明系统',
						children: [
							{
								id: 'LTCU',
								obj_code: 'LTCU',
								name: '照明控制模块'
							},
							{
								id: 'LTLT',
								obj_code: 'LTLT',
								name: '照明灯具'
							},
							{
								id: 'LTCC',
								obj_code: 'LTCC',
								name: '照明回路'
							},
							{
								id: 'LTLG',
								obj_code: 'LTLG',
								name: '照明灯组'
							}
						]
					}
				]
			},
			{
				id: 'LT',
				name: '照明专业',
				children: []
			},
			{
				id: 'FG',
				name: '燃气专业',
				children: []
			},

			{
				id: 'SP',
				name: '安防专业',
				children: [
					{
						id: 'SPNP',
						name: '巡更系统',
						children: [
							{
								id: 'NPCU',
								obj_code: 'NPCU',
								name: '巡更控制模块'
							},
							{
								id: 'NPPS',
								obj_code: 'NPPS',
								name: '巡更棒'
							},
							{
								id: 'NPCP',
								obj_code: 'NPCP',
								name: '巡更通讯座'
							}
						]
					},
					{
						id: 'SPVS',
						name: '视频监控系统',
						children: [
							{
								id: 'VSCM',
								obj_code: 'VSCM',
								name: '监控摄像头'
							},
							{
								id: 'VSSD',
								obj_code: 'VSSD',
								name: '监控视频存储设备 '
							},
							{
								id: 'VSCU',
								obj_code: 'VSCU',
								name: '监控控制模块'
							},
							{
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 树形数据展示、组织/目录结构
- 真实业务场景+推荐组合: 组织架构（Tree + Search + Checkbox）
- 常用用法: 基础展开/收起、单选或多选
- 高级用法: 懒加载、`checkStrictly`、自定义节点内容
- 主题与样式: 缩进、连接线、选中态样式
- 兼容性: 懒加载需返回符合节点结构的数据
- 性能建议: 大树用虚拟滚动/懒加载，减少默认展开
- 迁移提示: 节点字段名需与组件要求一致
- 故障排查: 选中不生效多为字段名或 key 不唯一

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/tree/index.ts
- packages/components/tree/index.md
- packages/components/tree/test/base-tree.vue
