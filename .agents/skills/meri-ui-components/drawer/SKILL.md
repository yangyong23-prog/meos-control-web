---
name: drawer
description: "Meri UI drawer 组件技能。适用于查阅 drawer 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-drawer

用途:
- 抽屉面板。

API 要点:
- 文档缺失/格式异常
示例用法:
```vue
<template>
	<m-button type="primary" @click="openDrawer" class="testClose">底部跟随</m-button>
	<m-drawer
		:show="drawerStatus"
		customCloseClassName="testClose"
		@close="closeDrawer"
		shadowClick="{true}"
		:footFixed="false"
	>
		<template #title>
			标题111
			<!-- <m-button type="default" size="small">默认按钮</m-button> -->
			<m-input v-model="inputValue"> </m-input>
		</template>
		<template #content>
			<div style="font-size: 20px; width: 500px; margin: 16px 0">标题11122</div>
		</template>
		<template #handle>
			<m-button type="primary" size="medium">主要按钮</m-button>
			<m-button type="default" size="medium">主要按钮</m-button>
		</template>
	</m-drawer>

	<m-button type="primary" @click="openDrawer2">底部固定+mask高度</m-button>
	<m-drawer
		:show="drawerStatus2"
		@close="closeDrawer2"
		shadowClick="{true}"
		customCloseClassName="testClose"
		shadow="{true}"
		height="calc(100vh - 60px)"
	>
		<template #title>
			标题222
			<!-- <m-button type="default" size="small">默认按钮</m-button> -->
		</template>
		<template #content>
			<div style="font-size: 20px; width: 500px; height: 100vh">标题222</div>
		</template>
		<template #handle>
			<m-button type="primary" size="medium">主要按钮</m-button>
			<m-button type="default" size="medium">主要按钮</m-button>
		</template>
	</m-drawer>

	<m-button type="primary" @click="openDrawer3">无蒙层</m-button>
	<m-drawer :show="drawerStatus3" @close="closeDrawer3" shadowClick="{true}">
		<template #title>
			标题222
			<!-- <m-button type="default" size="small">默认按钮</m-button> -->
		</template>
		<template #content>
			<div style="font-size: 20px; width: 500px; height: 100vh">标题222</div>
		</template>
		<template #handle>
			<m-button type="primary" size="medium">主要按钮</m-button>
			<m-button type="default" size="medium">主要按钮</m-button>
		</template>
	</m-drawer>
	<m-button type="primary" @click="openDrawer4">无底部</m-button>
	<m-drawer :show="drawerStatus4" @close="closeDrawer4" shadowClick="{true}">
		<template #title>
			标题222
			<!-- <m-button type="default" size="small">默认按钮</m-button> -->
		</template>
		<template #content>
			<div style="font-size: 20px; width: 500px; height: 100vh">标题444</div>
		</template>
	</m-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Drawer from '../index'

export default defineComponent({
	components: { Drawer },
	setup() {
		const inputValue = ref<string>('')
		const drawerStatus = ref<boolean>(false)
		const drawerStatus2 = ref<boolean>(false)
		const drawerStatus3 = ref<boolean>(false)
		const drawerStatus4 = ref<boolean>(false)
		const openDrawer = () => {
			drawerStatus.value = true
		}
		const closeDrawer = () => {
			drawerStatus.value = false
		}

		const openDrawer2 = () => {
			drawerStatus2.value = true
		}
		const closeDrawer2 = () => {
			drawerStatus2.value = false
		}

		const openDrawer4 = () => {
			drawerStatus4.value = true
		}
		const closeDrawer4 = () => {
			drawerStatus4.value = false
		}
		const openDrawer3 = () => {
			drawerStatus3.value = true
		}
		const closeDrawer3 = () => {
			drawerStatus3.value = false
		}
		return {
			inputValue,
			openDrawer,
			drawerStatus,
			closeDrawer,
			openDrawer2,
			closeDrawer2,
			drawerStatus2,
			drawerStatus3,
			drawerStatus4,
			closeDrawer3,
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 侧边/底部抽屉式编辑与详情
- 真实业务场景+推荐组合: 侧边详情（Drawer + Table + Descriptions）
- 常用用法: `placement` + `visible`
- 高级用法: 自定义尺寸、嵌套内容滚动
- 主题与样式: 遮罩与抽屉宽度
- 兼容性: teleport 到 body，需注意层级
- 性能建议: 长列表内容启用内部滚动
- 迁移提示: 与 modal 的场景区分
- 故障排查: 位置异常多为容器样式影响

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/drawer/index.ts
- packages/components/drawer/index.md
- packages/components/drawer/test/drawer.vue
