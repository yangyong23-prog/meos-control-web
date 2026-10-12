---
name: collapse
description: "Meri UI collapse 组件技能。适用于查阅 collapse 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-collapse

用途:
- 折叠面板。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<div style="width: 100%">
		<m-collapse v-model="data" onlyIconClick>
			<m-collapse-item title="黑铁" id="1">
				<div class="text">坚韧黑铁</div>
			</m-collapse-item>
			<m-collapse-item title="青铜" id="2" >
				<div class="text">英勇黄铜</div>
			</m-collapse-item>
			<m-collapse-item title="白银" id="3">
				<div class="text">不屈白银</div>
			</m-collapse-item>
			<m-collapse-item title="黄金" id="4">
				<div class="text">荣耀黄金</div>
			</m-collapse-item>
		</m-collapse>
		<br/>
		<m-collapse v-model="data1" :hoverStyle="false">
			<m-collapse-item title="黑铁" id="1">
				<div class="text">坚韧黑铁</div>
			</m-collapse-item>
			<m-collapse-item title="青铜" id="2" >
				<div class="text">英勇黄铜</div>
			</m-collapse-item>
			<m-collapse-item title="白银" id="3">
				<div class="text">不屈白银</div>
			</m-collapse-item>
			<m-collapse-item title="黄金" id="4">
				<div class="text">荣耀黄金</div>
			</m-collapse-item>
		</m-collapse>
	</div>
</template>

<script setup>
import { ref } from 'vue'
const data = ref(['1'])
const data1 = ref(['1'])
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 内容折叠/展开
- 真实业务场景+推荐组合: 高级筛选（Collapse + Form）
- 常用用法: 手风琴模式
- 高级用法: 自定义标题与禁用项
- 主题与样式: header 样式与间距
- 兼容性: 动态项需稳定 key
- 性能建议: 大内容建议懒加载
- 迁移提示: activeKey 命名可能不同
- 故障排查: 无法展开多为 value 不匹配

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/collapse/index.ts
- packages/components/collapse/index.md
- packages/components/collapse/test/default.vue
