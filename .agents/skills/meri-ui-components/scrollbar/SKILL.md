---
name: scrollbar
description: "Meri UI scrollbar 组件技能。适用于查阅 scrollbar 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-scrollbar

用途:
- 自定义滚动条。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<h3>基础用法</h3>
	<m-scrollbar height="300px">
		<m-list-skeleton v-for="i in number" />
	</m-scrollbar>
	<h3>自定义用法</h3>
	<m-scrollbar :container="() => container" :content="() => content">
		<div ref="container" class="scrollbar-container">
			<div ref="content" class="scrollbar-container-content">
				<m-list-skeleton v-for="i in number * 2" />
			</div>
		</div>
	</m-scrollbar>
	<m-button @click="add">+</m-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const number = ref(1)
const add = () => {
	number.value += 1
}
const container = ref<HTMLElement>()
const content = ref<HTMLElement>()
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 自定义滚动条与容器滚动
- 真实业务场景+推荐组合: 固定高度列表（Scrollbar + Table/Tree）
- 常用用法: 包裹内容并设置高度
- 高级用法: 始终显示、横向滚动
- 主题与样式: 滚动条颜色与尺寸
- 兼容性: 容器高度必须明确
- 性能建议: 避免频繁强制刷新
- 迁移提示: 原生滚动替换需要布局调整
- 故障排查: 无滚动条多为高度未设置

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/scrollbar/index.ts
- packages/components/scrollbar/index.md
- packages/components/scrollbar/test/default.vue
