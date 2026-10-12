---
name: pagination
description: "Meri UI pagination 组件技能。适用于查阅 pagination 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-pagination

用途:
- 分页控制。

API 要点:
- 属性:
| **名称** | **类型** | **可选值**                                                   | **默认值**                    | **说明**     |
| -------- | -------- | ------------------------------------------------------------ | ----------------------------- | ------------ |
| total | string \| number | -                                                            | -                             | 总数 |
| page-num / v-model:page-num | number | -                                                      | - | 当前页数 |
| default-page-number | number | - | `1` | 默认页数 |
| page-size | string \| number | - | `10`                                        | 每页显示条数                 |
| sizes-list | array  | -                                                            | `[ 10, 20, 50, 100 ]` | 每页显示条数的选项设置 |
| pager-count | string \| number | - | `7`                                              | 最大页码数，须为大于等于 5 且小于等于 21 的奇数 |
| disabled | boolean  | -                                                            | `false`                   | 是否禁用     |
| layout | string | totalPages \| total \| prev \| pager \| next \| jumper \| sizes | `total,prev,pager,next` | 自定义组件布局 |
| prev-text | string | - | - | 替代图标显示的上一页文案 |
| next-text | string | - | - | 替代图标显示的上一页文案 |
| total-tmp-string | string | - | `共 {total} 条` | 替代总数文案模板 |
| pages-tmp-string | string | - | `共 {totalPages} 页` | 替代总页数文案模板 |
| sizes-tmp-string | string | - | `{value}条/页` | 替代每页显示条数选项文案模板 |
| background | boolean | - | `true` | 是否添加背景色 |
| simple | boolean | - | `false` | 是否渲染成简洁分页 |
| hide-on-single-page | boolean | - | `false` | 只有一页时隐藏 |

- 事件:
| 名称    | 参数       | 说明         |
| :------ | :--------- | :----------- |
| page-change | pageNum | 页码切换时触发 |
| size-change | pageSize | 每页条数切换时触发 |

示例用法:
```vue
<template>
	<div>
		<m-pagination
			background
			v-model:page-num="pageNum"
			:total="total"
			:page-size="pageSize"
			layout="total,prev,pager,next,sizes"
			@pageChange="pageChange"
			@sizeChange="sizeChange"
		></m-pagination>
		<m-button @click="changePageNum">改变页码</m-button>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
	setup() {
		const state = reactive({
			pageNum: 3,
			pageSize: 10,
			total: 10000
		})
		const changePageNum = () => {
			state.pageNum = 7
			state.pageSize = 20
			// state.total = state.total - 10
		}
		const pageChange = (value: any) => {
			console.log(1111)
			console.log(value)
		}
		const sizeChange = (a) => {
			state.pageSize = a
		}

		return { ...toRefs(state), changePageNum, pageChange, sizeChange }
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
- 真实业务场景+推荐组合: 列表分页（Pagination + Table + Search）
- 常用用法: 最常见的 1-2 种写法
- 高级用法: 与 Form/Modal/Table 等组合
- 主题与样式: 关键样式与主题变量
- 兼容性: Teleport/SSR/浏览器注意事项
- 性能建议: 大数据量/频繁更新优化
- 迁移提示: 与旧版本/其他库差异
- 故障排查: 最常见错误与定位路径

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/pagination/index.ts
- packages/components/pagination/index.md
- packages/components/pagination/test/default.vue
