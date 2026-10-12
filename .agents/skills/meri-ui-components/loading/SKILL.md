---
name: loading
description: "Meri UI loading 组件技能。适用于查阅 loading 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-loading

用途:
- 加载状态/指令/服务。

API 要点:
- 属性:
| 名称                                    | 类型       | 可选值                   | 默认值                          | 说明                                                     |
|:--------------------------------------|:---------|:----------------------|:-----------------------------|:-------------------------------------------------------|
| target                                | string   | -                     | document.body                | Loading 需要覆盖的 DOM 节点                                   |
| fullscreen                            | boolean  | -                     | true                         | 覆盖全屏                                                   |
| lock                                  | boolean  | -                     | false                        | 锁住页面禁止滚动                                               |
| background                            | string   | -                     | rgba(255, 255, 255, 1)       | 加载背景颜色                                                 |
| progressBar                           | boolean  | -                     | false                        | 是否显示进度条，`只有在服务调用才生效`                                   |
| duration                              | number   | -                     | 10                           | 加载超时时间 默认 10秒                                          |
| lottieName/element-loading-lottieName | string   | plane / ball / circle | plane                        | 动画显示 服务调用使用：lottieName 指令使用：element-loading-lottieName |
| loadTextOptions                       | Object   | -                     | `{text:"",style:{} }`        | 加载图表下面文案配置项 text 文字、 style 样式                          |
| failText                              | string   | -                     | 页面加载失败                       | 加载失败按钮下文案                                              |
| loadButton                            | Function | -                     | ()=>void                     | 加载失败按钮回调                                               |
| customClass                           | string   | -                     | -                            | 自定义class                                               |
| reload                                | Function | -                     | -                            | 重新加载                                                   |
| loadIconStyle                         | Object   | -                     | `{width:220px;height:220px}` | 加载图样式                                                  |
| setTimeoutOs               | Number   | -    |    0   | 延迟加载loading效果

示例用法:
```vue
<template>
	<m-button @click="bar(true)">有进度条</m-button>
	<m-button @click="bar(false)">无进度条</m-button>
	<m-button @click="fail()">加载失败</m-button>

	<div style="width: 100%">效果预览</div>
	<div class="test">
		<div class="t1"></div>

		<div class="t3"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import loading from '../index'

export default defineComponent({
	setup() {
		loading.service({
			target: '.t1',
			fullscreen: false,
			progressBar: true,
			duration: 300,
			zIndex: 2000
		})

		const t3 = loading.service({
			target: '.t3',
			duration: 2,
			fullscreen: false,
			setTimeoutOs: 800,
			loadButton: () => {
				t3.reload()
			}
		})

		function bar(b: boolean) {
			const l = loading.service({
				progressBar: b,
				setTimeoutOs: 2000
			})

			setTimeout(() => {
				l.destroy()
			}, 1000)
		}

		function fail() {
			const l = loading.service({
				background: 'rgba(255, 255, 255, 0.8)',
				duration: 1,
				loadButton: () => {
					// l.reload();

					l.destroy()
				}
			})
		}

		return {
			bar,
			fail
		}
	}
})
</script>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css
- 服务型组件通常通过方法调用，不作为全局组件渲染

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 区域/全局加载态
- 真实业务场景+推荐组合: 数据加载占位（Loading + Table）
- 常用用法: 指令式或服务式调用
- 高级用法: 自定义图标/文本/遮罩
- 主题与样式: 遮罩颜色与加载动画
- 兼容性: 容器需可定位以覆盖
- 性能建议: 避免频繁开关导致闪烁
- 迁移提示: 与 skeleton 的差异
- 故障排查: 不显示多为容器无定位

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/loading/index.ts
- packages/components/loading/index.md
- packages/components/loading/test/demo.vue
