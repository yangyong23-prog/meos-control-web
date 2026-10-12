---
name: modal
description: "Meri UI modal 组件技能。适用于查阅 modal 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-modal

用途:
- 对话框。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<div>
		<m-modal type="info" :zIndex="3000" v-model:visible="show" :title="'我是一个小弹窗'"
			:content="' This is a message. 弹窗最小高度144px，最大高度166px (该对话框仅用于删除)111111111111111111111111111111111111111111111111111111'">
		</m-modal>
		<m-modal type="error" v-model:visible="showError" :title="'默认的警告弹窗'" :content="'底部样式可以自定义，标题可以没有，只有内容'">
		</m-modal>
		<m-modal type="error" v-model:visible="show2" :title="'这个弹窗只有有标题，没有内容。'"></m-modal>
		<m-modal type="info" v-model:visible="show1" :content="'这个弹窗没有标题，只有内容'"> </m-modal>
		<div class="content">
			<m-button type="primary" @click="show = true">默认info弹框</m-button>
			<m-button type="primary" @click="showError = true">默认error弹框</m-button>
			<m-button type="primary" @click="show2 = true">没有内容，只有标题</m-button>
			<m-button type="primary" @click="show1 = true">没有标题，只有内容</m-button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	setup() {
		const show = ref(false)
		const show1 = ref(false)
		const show2 = ref(false)
		const showError = ref(false)

		return {
			show,
			show1,
			show2,
			showError,
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
- 适用场景: 操作确认、表单弹窗
- 真实业务场景+推荐组合: 编辑弹窗（Modal + Form + Button）
- 常用用法: `visible` 控制 + footer 操作
- 高级用法: 自定义头/脚、嵌套表单
- 主题与样式: 宽度/圆角/遮罩
- 兼容性: teleport 到 body，需关注样式隔离
- 性能建议: 频繁打开时复用组件实例
- 迁移提示: 与 MessageBox 的职责不同
- 故障排查: 打开后不可滚动多为锁屏配置

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/modal/index.ts
- packages/components/modal/index.md
- packages/components/modal/test/type1.vue
