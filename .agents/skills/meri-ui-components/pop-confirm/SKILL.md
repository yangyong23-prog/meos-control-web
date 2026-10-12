---
name: pop-confirm
description: "Meri UI popConfirm 组件技能。适用于查阅 popConfirm 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-popConfirm

用途:
- 气泡确认。

API 要点:
- 属性:
| **名称**            | **类型**                                 | **可选值**                   | **默认值** | **说明**                                |
| ------------------- | ---------------------------------------- | ---------------------------- | ---------- | --------------------------------------- |
| content             | string                                   | -                            | -          | 弹出框的显示内容                        |
| confirm-button-text | string                                  | -                            | `确定`     | 确认按钮文字                            |
| cancel-button-text  | string                                   | -                            | `取消 `    | 取消按钮文字                            |
| confirm-button-id  | string                                   | -                            |   -  | 确认按钮Id                            |
| cancel-button-id  | string                                   | -                            |   -  | 取消按钮Id                            |
| confirm-button-class  | string                                   | -                            |  -   | 确认按钮class                            |
| cancel-button-class  | string                                   | -                            | -   | 取消按钮class                            |
| status              | string                                   | default \| danger \| primary | `default`  | 二次确认框状态，`default`下没有图标     |
| before-cancel       | function(done)，done 用于关闭 Popconfirm | -                            | -          | 取消前的回调，会暂停 `Popconfirm`的关闭 |
| before-confirm      | function(done)，done 用于关闭 Popconfirm | -                            | -          | 确定前的回调，会暂停 `Popconfirm`的关闭 |
| triggter            | string                                   | click \| hover \| manually   | `click`    | 触发方式                                |

| 名称名  | 类型 | 说明               |
| :------ | :--- | :----------------- |
| cancel  | -    | 点击取消按钮时触发 |
| confirm | -    | 点击确认按钮时触发 |

- 插槽:
| 名称名 | 说明                      |
| :----- | :------------------------ |
| main   | Popconfirm 显示的元素内容 |
| footer | 按钮区域显示的元素内容    |

示例用法:
```vue
<template>
	<m-popconfirm content="确定删除“工作日晴天夏季”？" @cancel="cancel" @confirm="confirm">
		<m-button>click</m-button>
	</m-popconfirm>
	<m-popconfirm
		content="确定删除“工作日晴天夏季”？确定删除“工作日晴天夏季”？确定删除“工作日晴天夏季”？确定删除“工作日晴天夏季”？"
		@cancel="cancel"
		@confirm="confirm"
		status="danger"
    confirm-button-text="删除"
    cancel-button-text="不要"
		:beforeCancel="beforeCancel"
		:shiftOffset="10"
	>
		<m-button>二次取消确认</m-button>
	</m-popconfirm>
	<m-popconfirm
		content="确定删除“工作日晴天夏季”？"
		@cancel="cancel"
		@confirm="confirm"
    status="primary"
		:beforeConfirm="beforeConfirm"
    cancel-button-text="no"
    confirm-button-text="yes"
	>
		<m-button>二次确认</m-button>
	</m-popconfirm>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { $Message } from '../../message'

export default defineComponent({
	setup() {
		const isOpen = ref<boolean>(false)

		return {
			isOpen,
			cancel() {
				$Message.success({ title: '取消' })
			},
			confirm() {
				$Message.success({ title: '确定' })
			},
			beforeCancel(done: () => void) {
				window.alert('是否关闭')
				done()
			},
			beforeConfirm(done: () => void) {
				window.alert('是否提交')
				done()
			}
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
- 适用场景: 轻量级二次确认
- 真实业务场景+推荐组合: 删除确认（PopConfirm + Button + Message）
- 常用用法: 绑定确认/取消回调
- 高级用法: 自定义内容与按钮样式
- 主题与样式: 主题色与按钮对齐
- 兼容性: 触发器必须有可测量尺寸
- 性能建议: 多实例时控制同时打开数量
- 迁移提示: 与 modal/MessageBox 的差异
- 故障排查: 位置不对多为容器滚动影响

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/popConfirm/index.ts
- packages/components/popConfirm/index.md
- packages/components/popConfirm/test/default.vue
