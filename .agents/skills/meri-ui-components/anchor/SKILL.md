---
name: anchor
description: "Meri UI anchor 组件技能。适用于查阅 anchor 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-anchor

用途:
- 锚点导航。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<div class="anchor-demo">
		自定义宽度：<m-input-number
			v-model="dataVal"
			placeholder="输入数字"
			controls="operator"
			:step="2"
		></m-input-number>
		<m-anchor :sections="sections" :width="dataVal + 'px'" style="margin-right: 50px;margin-top: 20px;"> </m-anchor>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
	setup() {
		const state = reactive({
			sections: [
				{
					label: '基础用法测试超出隐藏tip显示',
					id: '基础用法'
				},
				{ label: '固定位置' },

				{ label: '大小层级设置' },
				{ label: '悬浮主题设置' },
				{ label: '显示背景' },
				{ label: '取消侧面的轨道' },
				{ label: '滚动到' }
			],
			dataVal: 82
		})
		return { ...toRefs(state) }
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
- 适用场景: 长页面锚点导航
- 真实业务场景+推荐组合: 文档导航（Anchor + Tabs/Scroll）
- 常用用法: 目录与页面锚点对应
- 高级用法: 滚动容器监听与偏移
- 主题与样式: 高亮样式
- 兼容性: 自定义滚动容器需配置
- 性能建议: 监听滚动注意节流
- 迁移提示: offset 规则可能不同
- 故障排查: 无法定位多为 anchor id 不匹配

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/anchor/index.ts
- packages/components/anchor/index.md
- packages/components/anchor/test/default.vue
