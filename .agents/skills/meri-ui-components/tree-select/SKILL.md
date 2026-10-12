---
name: tree-select
description: "Meri UI treeSelect 组件技能。适用于查阅 treeSelect 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-treeSelect

用途:
- 树选择器。

API 要点:
- 属性:
| 名称           | 类型    | 可选值        | 默认值   | 说明                                       |
| :------------- | :------ | :------------ | :------- | :----------------------------------------- |
| hasConfirm     | Boolean | true/ false   | false    | 是否支持确认按钮                           |
| searchable     | Boolean | true/ false   | false    | 是否支持搜索功能                           |
| mode           | String  | tags/multiple | multiple | 选中后回显样式 multiple 为个数 tags 为标签 |
| disabled       | Boolean | true/ false   | false    | 是否禁用                                   |
| showParentName | Boolean | true/ false   | true     | 触发器是否显示子父级路径                         |
| searchShowParentName | Boolean | true/ false   | false     | 搜索面板是否显示子父级路径,默认false时回显跟随checkStrictly设置                      |
| loading        | Boolean | true/ false   | false    | tree为空时是否展示loading动画               |

- 事件:
| 名称     | 参数                                 | 说明                                                                |
| :------- | :----------------------------------- | :------------------------------------------------------------------ |
| change | (ids:TreeNode[],selectNode:TreeNode) | 选中回调，ids 为已选中节点 id 数组，selectNode 为当前选中的节点信息 |
| blur | -- | 失焦事件 |

| 名称     | 参数       | 说明             |
| :------- | :--------- | :--------------- |
| checkAll | true/false | 全选或者取消全选 |
| checkByIds |  (ids:[],status:`checked/uncheck/notNull`) | 操作树选中节点，注:仅适用于父子级不联动情况 |

示例用法:
```vue
<template>
  <m-tree-select
    :data="data"
    v-model="selected"
    @change="handleChange"
  >

  </m-tree-select>
</template>

<script lang="ts">
import { defineComponent, ref,watch,Ref } from "vue";
import {TreeNode} from '../../tree/src/TreeProps'
export default defineComponent({
  setup() {
    const data:Ref<TreeNode[]> = ref([])
    data.value = [
			{
				id: 'SE',
				name: '强电专业222',
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
								id: 'VSVM',
								obj_code: 'VSVM',
								name: '监视器'
							},
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 树形数据的选择输入控件
- 真实业务场景+推荐组合: 组织选择器（TreeSelect + FormItem + Modal）
- 常用用法: 单选/多选 + 搜索过滤
- 高级用法: `checkStrictly`、异步加载、虚拟滚动
- 主题与样式: 下拉面板宽度、标签样式
- 兼容性: 面板定位依赖容器定位/滚动上下文
- 性能建议: 大数据启用虚拟滚动，减少全量展开
- 迁移提示: `value/label/children` 字段映射需确认
- 故障排查: 搜索无结果多为过滤字段未配置

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/treeSelect/index.ts
- packages/components/treeSelect/index.md
- packages/components/treeSelect/test/base-radio.vue
