---
name: form
description: "Meri UI form 组件技能。适用于查阅 form 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-form

用途:
- 表单容器与校验。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<div class="form-box">
		<m-form ref="Mform" labelWidth="100px">
			<m-form-item label="用户名">
				<m-input v-model="params.username"></m-input>
			</m-form-item>
			<m-form-item label="年龄">
				<m-input-number v-model="params.age" style="width:200px"></m-input-number>
			</m-form-item>
			<m-form-item label="性别">
				<m-select v-model="params.sex" :options="list" :size="200"> </m-select>
			</m-form-item>
      <m-form-item label="电话">
				<m-input v-model="params.phone"></m-input>
			</m-form-item>
      <m-form-item label="邮箱">
				<m-input v-model="params.email"></m-input>
			</m-form-item>
			<m-form-item>
				<m-button type="primary">提交</m-button>
				<m-button>取消</m-button>
			</m-form-item>
		</m-form>


	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
export default defineComponent({
	setup() {
		const params = ref({
			username: '',
			phone: '',
			age: 18,
			sex: ''
		})
		const list = ref([
			{
				id: '0',
				name: '保密'
			},
			{
				id: '1',
				name: '男'
			},
			{
				id: '2',
				name: '女'
			}
		])
		return { params, list }
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
- 适用场景: 表单收集、校验与布局
- 真实业务场景+推荐组合: 新建设备表单（Form + Input/Select/Switch + Button）
- 常用用法: `rules` + `model` + `labelPosition`
- 高级用法: 动态表单、异步校验、表单联动
- 主题与样式: label 宽度、错误提示样式
- 兼容性: 依赖 async-validator 规则格式
- 性能建议: 避免频繁全量校验，局部校验更高效
- 迁移提示: 规则格式与其他库可能不同
- 故障排查: 校验不触发多为 model 未绑定或 prop 不匹配

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/form/index.ts
- packages/components/form/index.md
- packages/components/form/test/default.vue
