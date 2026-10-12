---
name: message-box
description: "Meri UI messageBox 组件技能。适用于查阅 messageBox 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-messageBox

用途:
- 消息确认/输入弹窗。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<div>
		<m-button type="primary" @click="openModal">默认info弹框</m-button>
		<m-button type="primary" @click="openModalError" style="margin-left: 20px">默认error弹框</m-button>
		<m-button type="primary" @click="openModal1" style="margin-left: 20px">没有内容，只有标题</m-button>
		<m-button type="primary" @click="openModal2" style="margin-left: 20px">没有标题，只有内容</m-button>
	</div>
</template>

<script lang="ts" setup>
import MMessageBox from '../index'
const openModal = () => {
	MMessageBox({
		title: '我是一个小弹窗',
		customClass: 'customClass',
		message: `This is a message. 弹窗最小高度144px，最大高度166px (即3行文字，文案最多不超过3行)his is a message. 弹窗最小高度144px，最大高度166px (即3行文字，文案最多不超过3行)`
	})
		.then(() => {})
		.catch(() => {})
}

const openModalError = () => {
	MMessageBox({
		type: 'danger',
		title: '默认的警告弹窗',
		customClass: 'customClass',
		confirmButtonText: '删除',
		message: `警告警告...`
	})
		.then(() => {})
		.catch(() => {})
}

const openModal1 = () => {
  MMessageBox({
		title: '只有标题',
		customClass: 'customClass',
		message: ``
	})
		.then(() => {})
		.catch(() => {})
}
const openModal2 = () => {
  MMessageBox({
		title: '',
		customClass: 'customClass',
		message: `这个弹窗没有标题，只有内容`
	})
		.then(() => {})
		.catch(() => {})
}
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css
- 服务型组件通常通过方法调用，不作为全局组件渲染

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 阻断式确认/输入
- 真实业务场景+推荐组合: 危险操作确认（MessageBox + Icon + Button）
- 常用用法: `confirm`/`prompt` 模式
- 高级用法: 自定义内容与校验
- 主题与样式: 标题/按钮样式
- 兼容性: 服务式调用需挂载到全局
- 性能建议: 避免在循环中大量调用
- 迁移提示: 与 modal 的 API 不同
- 故障排查: 不显示多为未引入样式或未挂载

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/messageBox/index.ts
- packages/components/messageBox/index.md
- packages/components/messageBox/test/model.vue
