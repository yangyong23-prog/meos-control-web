---
name: popover
description: "Meri UI popover 组件技能。适用于查阅 popover 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-popover

用途:
- 气泡弹层。

API 要点:
- 属性:
| **名称**          | **类型**                  | **可选值**                                                   | **默认值** | **说明**                                                     |
| ----------------- | ------------------------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| content           | string                    | -                                                            | -          | 弹出框的显示内容                                             |
| is-open           | boolean                   | true \| false                                                | `false`    | 手动控制弹出状态                                             |
| trigger           | string                    | click \| hover \| manually                                   | `hover `   | 弹框触发方式                                                 |
| placement         | string                    | 'top'   \| 'right'   \| 'bottom'   \| 'left'   \| 'top-start'   \| 'top-end'   \| 'right-start'   \| 'right-end'   \| 'bottom-start'   \| 'bottom-end'   \| 'left-start'   \| 'left-end' | `bottom`   | 控制弹框出现的方向                                           |
| offset            | number                    | -                                                            | `8`        | 指定相对触发元素的偏移距离                                   |
| show-animation    | boolean                   | true \| false                                                | `true `    | 是否显示动画                                                 |
| mouse-enter-delay | number                    | -                                                            | `150`      | 仅在 `trigger` 为 `hover` 的时候，设置鼠标移入后延时多久才显示 `Popover`，单位是 `ms` |
| mouse-leave-delay | number                    | -                                                            | `100`      | 仅在 `trigger` 为 `hover` 的时候，设置鼠标移出后延时多久才隐藏 `popover`，单位是 `ms` |
| disabled          | string                    | -                                                            | -          | `Popover` 是否可用                                           |
| popover-class     | string \| array \| object | -                                                            | -          | 为 `Popover` 添加自定义类名                                  |
| display-directive | string  | show \| if                                                            | if          | 条件渲染使用的指令，if 会让内容被使用 v-if 渲染，show 会让内容被使用 v-show 渲染                                 |
| show-arrow | boolean  | true \| false                                                            | true          | 是否显示箭头                                 |
| width | string  | -                                                            |      -     | 自定义宽度                                 |
| virtual-triggering | boolean | true \|false | false | 用来标识虚拟触发是否被启用 |
| virtual-ref | HTMLElement \| templateRef | - | - | 标识虚拟触发时的触发元素 |
| observer-dom | HTMLElement \| templateRef | - | - | 需要额外监听的元素 |
| mutation-observer-dom | HTMLElement \| templateRef | - | - | 需要额外监听DOM树变化的元素 |
| auto-update-position | boolean | - | true | 当触发元素或者popover弹框变化时是否需要自动更新popover位置 |
| arrow-overflow| boolean | - | false | 是否允许内容超出屏幕 |
| main-axis | boolean | - | true | 是否允许沿主轴方向移动 |
| enterable | boolean | - | true | 鼠标是否可移入popover |
| append-to | string | - | body | Popover 挂载到哪个 DOM 元素 |
| z-index | number | - | - | Popover 自定义层级 |

| 名称 | 类型 | 说明                   |
| :----- | :--- | :--------------------- |
| show   | -    | Popover 显示后触发事件 |
| hide   | -    | Popover 隐藏后触发事件 |
| clickEvent   | (e: Event, type: boolean) => void    | Popover 的点击事件，e当前点击项，type点击区域是否和当前组件相关 |
| mouseEnter   | (e: Event) => void    | Popover 的鼠标移入事件 |
| mouseLeave   | (e: Event) => void    | Popover 的鼠标移出事件 |
| scroll   | (e: Event) => void    | Popover 的上级滚动事件 |

| 名称 | 类型 | 说明                   |
| :----- | :--- | :--------------------- |
| manuallyHide   | -    | 手动隐藏Popover |
| manuallyOpen   | -    | 手动展开Popover |
| popoverRef   | -    | Popover的ref(updatePosition等方法) |

| **名称**          | **类型**                  | **可选值**                                                   | **默认值** | **说明**                                                     |
| ----------------- | ------------------------- | ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| ellipsis-disabled | boolean | - | false | 是否禁用(需写在绑定元素上) |
| theme | string | 'dark' \| 'light' \| 'darkTransparent' | 'darkTransparent' | 主题 |
| title | string | - | innerHTML | 显示的内容 |
| enterable | boolean | - | true | 鼠标是否可移入tips |
| time | munber | - | 300 | 延迟的时间 |
| class | string[] | - | [] | 自定义class |
| y | boolean | - | false | 禁用y轴溢出 |

- 插槽:
| 名称  | 说明                        |
| :------ | :-------------------------- |
| default | 触发 Popover 显示的元素内容 |
| content | 自定义弹出内容              |

示例用法:
```vue
<template>
	<m-tips content="我是提示文字" trigger="click">
		<template #content>
			<div class="tip-pop-bg">
				<div class="tip-pop-item">
					<div class="box"></div>
					供冷季：03.12-04.20
				</div>
				<div class="tip-pop-item">
					<div class="box box1"></div>
					过渡季：04.21-06.20、04.21-06.20
				</div>
				<div class="tip-pop-item">
					<div class="box box2"></div>
					供暖季：04.21-06.20、04.21-06.20
				</div>
			</div>
		</template>
		<m-button>白底</m-button>
	</m-tips>
	<m-tips content="我是提示文字" theme="darkTransparent" placement="right-start" trigger="click">
		<template #content>
			<div class="tip-pop">
				<div class="popover-title">空调</div>
				<div class="popover-main">
					<div class="popover-left">
						<div class="popover-left-item">
							<div class="popover-left-item-text">已发布策略</div>
							<div class="popover-left-item-number">54</div>
						</div>
						<div>
							<div class="popover-left-item-text">已发布策略</div>
							<div class="popover-left-item-number">54</div>
						</div>
					</div>
					<div class="popover-right">
						<div class="popover-right-item">品质优先&nbsp;36</div>
						<div class="popover-right-item">品质优先&nbsp;36</div>
						<div class="popover-right-item">品质优先&nbsp;36</div>
						<div class="popover-right-item">品质优先&nbsp;36</div>
					</div>
				</div>
			</div>
		</template>
		<m-button>透明黑底</m-button>
	</m-tips>
</template>
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 悬停/点击提示内容
- 真实业务场景+推荐组合: 字段解释提示（Popover + Icon + Text）
- 常用用法: `trigger` + `placement`
- 高级用法: 复杂内容插槽、延迟显示
- 主题与样式: 箭头/阴影/主题色
- 兼容性: 依赖浮层定位与滚动容器
- 性能建议: 大量实例时避免全局监听
- 迁移提示: 与 tooltip 的语义区别
- 故障排查: 无法显示多为触发器 slot 结构

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/popover/index.ts
- packages/components/popover/index.md
- packages/components/popover/test/themeTip.vue
