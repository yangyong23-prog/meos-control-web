---
name: select-header
description: "Meri UI selectHeader 组件技能。适用于查阅 selectHeader 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-selectHeader

用途:
- 选择器头部/标签展示。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<!-- <m-select-header :showSearch="false"></m-select-header>

  <m-select-header :showSearch="true"></m-select-header>

  <m-select-header :showSearch="true" :open="true"></m-select-header> -->
	<m-select-header :searchable="true"></m-select-header>

	<m-select-header searchable clearable="false"></m-select-header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	setup() {
		const open = ref(false)

		return { open }
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
- 真实业务场景+推荐组合: 业务页面组合使用（组件本身 + Form/Table/Modal 之一）
- 常用用法: 最常见的 1-2 种写法
- 高级用法: 与 Form/Modal/Table 等组合
- 主题与样式: 关键样式与主题变量
- 兼容性: Teleport/SSR/浏览器注意事项
- 性能建议: 大数据量/频繁更新优化
- 迁移提示: 与旧版本/其他库差异
- 故障排查: 最常见错误与定位路径

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/selectHeader/index.ts
- packages/components/selectHeader/index.md
- packages/components/selectHeader/test/index.vue
