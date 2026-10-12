---
name: message
description: "Meri UI message 组件技能。适用于查阅 message 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-message

用途:
- 全局消息提示。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<m-button type="primary" @click="openSuccessTitle">支持传递标题</m-button>
	<m-button type="primary" @click="openDefaultMessage">普通信息提示</m-button>
	<m-button type="primary" @click="closeAll">关闭所有</m-button>
	<m-button type="primary" @click="success">成功信息提示</m-button>
	<m-button type="default" @click="error">错误信息提示</m-button>
	<m-button type="default" @click="openInfoMessage">功能操作提示</m-button>
	<m-button type="primary" @click="openOneCustomIcon">单行自定义icon</m-button>
	<m-button type="primary" @click="openAreaDefault">多行文本</m-button>
	<m-button type="default" @click="openAreaError">多行文本错误状态</m-button>
	<m-button type="primary" @click="openCustomIcon">多行自定义icon</m-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { $Message } from '../index'
export default defineComponent({
	components: {},
	setup() {
		const openSuccessTitle = () => {
			$Message.success('仅传递标题')
		}
		const closeAll = () => {
			$Message.closeAll()
		}
		const openOneCustomIcon = () => {
			$Message.customIcon({
				title: '成功信息提示',
				duration: 3000,
				customIcon: 'IconMeriComponentShow',
				className: 'message_custom',
				defaultPadding: '200',
				button: 'default',
				buttonClick: () => {
					console.log(1111)
				}
			})
		}
		const openCustomIcon = () => {
			$Message.customIcon({
				title: '成功信息提示，且需要让用户明确该操作对产品、其他模块和任务的影响文本文本文本文本文本文本文本文本文本',
				showClose: true,
				duration: 3000,
				customIcon: 'IconMeriComponentShow',
				className: 'message_custom',
				// button: 'default',
				buttonClick: () => {
					console.log(1111)
				}
			})
		}
		const openAreaDefault = () => {
			$Message.Default({
				title: '成功信息提示，且需要让用户明确该操作对产品、其他模块和任务的影响文本文本文本文本文本文本文本文本文本',
				showClose: true,
				duration: 3000,
				className: 'message_custom',
				button: 'default',
				buttonClick: () => {
					console.log(1111)
				}
			})
		}
		const openAreaError = () => {
			$Message.error({
				title: '成功信息提示，且需要让用户明确该操作对产品、其他模块和任务的影响文本文本文本文本文本文本文本文本文本',
				showClose: true,
				duration: 3000,
				className: 'message_custom',
				button: 'error',
				buttonClick: () => {
					console.log(1111)
				}
			})
		}
		const openDefaultMessage = () => {
			$Message.Default({
				title: '成功信息提示',
				showClose: true,
				duration: 3000,
				className: 'message_custom',
				button: 'default',
				buttonClick: () => {
					console.log(1111)
				}
			})
		}
		const openInfoMessage = () => {
			$Message.Info({
				title: '成功信息提示',
				showClose: true,
				duration: 3000,
				className: 'message_custom'
				// button: 'default',
				// buttonClick: ()=>{
				//   console.log(list)
				// }
			})
		}
		const success = () => {
			// $Message.success('成功信息提示成功信息提示成功信息提示')
			$Message.success({
				title: '成功信息提示成功信息提示成功信息提示',
				showClose: true,
				duration: 3000,
				className: 'message_custom',
				button: 'default',
				buttonClick: () => {
					console.log(1111)
				}
			})
		}

		const error = () => {
			$Message.error({
				title: '错误信息提示',
				duration: 3000,
				showClose: true,
				button: 'default'
				// buttonClick: ()=>{
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css
- 服务型组件通常通过方法调用，不作为全局组件渲染

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 轻量级反馈提示
- 真实业务场景+推荐组合: 操作反馈（Message + Button）
- 常用用法: `success/error/warn` 快捷方法
- 高级用法: 自定义时长与关闭回调
- 主题与样式: 图标与颜色统一
- 兼容性: 需在应用入口挂载样式
- 性能建议: 避免高频短时间内多次调用
- 迁移提示: 与 notification 的定位不同
- 故障排查: 重叠堆叠异常多为容器样式影响

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/message/index.ts
- packages/components/message/index.md
- packages/components/message/test/message.vue
