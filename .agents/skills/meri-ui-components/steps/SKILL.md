---
name: steps
description: "Meri UI steps 组件技能。适用于查阅 steps 组件的用途、API、示例、注意事项与常见坑。"
---

# meri-ui-steps

用途:
- 步骤条。

API 要点:
- 属性:
| 名称         | 类型              | 可选值                    | 默认值                 | 说明                                       | 必须 |
| :----------- | :---------------- | :------------------------ | :--------------------- | :----------------------------------------- | :--- |
| v-model      | String            | null                      | null                   | 带交互时当前交互节点                       | No   |
| size         | String            | medium \| small           | medium                 | 每个 step 的间距，不填写将默认 20。        | No   |
| space        | Number \| string  | -                         | 20                     | 当前步骤条标题文字大小                     | No   |
| layout       | String            | vertical                  | horizontal \| vertical | 当前步骤条显示方向                         | No   |
| lineType     | String            | solid \| dashed           | solid                  | 当前步骤条线条类型                         | No   |
| category     | String            | default \| number \| icon | default                | 是否带序号，默认不带序号无交互             | No   |
| defaultColor | Boolean \| String | true \| false             | true                   | 当前节点默认颜色（未单独展示，可参考类别） | No   |
| readonly     | Boolean \| String | false \| true             | false                  | 当前步骤条状态是否可编辑                   | No   |
| defaultSet   | Boolean \| String | false \| true             | true                   | 当前步骤条状态是否默认设置                   | No   |

| 参数        | 类型             | 说明                                                                                               |
| :---------- | :--------------- | :------------------------------------------------------------------------------------------------- |
| index       | Number \| string | 索引 (必须)                                                                                        |
| title       | String           | 标题文字(必须)                                                                                     |
| description | String           | 辅助文字(必须)                                                                                     |
| icon        | String           | 当前 icon 名称，category 为 icon 时为必填项                                                        |
| status      | String           | 当前节点状态 (可配置项 finish/error/success,优先级高于 color, 需要配置其他颜色使用 color 字段定义) |
| color       | String           | 定义当前节点背景色，defaultColor 为 false 时为必填项                                               |

| 类型   | 参数                                         | 说明                                |
| :----- | :------------------------------------------- | :---------------------------------- |
| change | (current: any, context?: { e?: MouseEvent }) | 当前事件发生变化时触发 返回当前对象 |

- 插槽:
| 名称        | 说明               |
| :---------- | :----------------- |
| title       | 标题文字填充的内容 |
| description | 辅助文字填充的内容 |
| defaultImg | 自定义图片默认（category为icon生效） |
| activeImg | 自定义图片激活（category为icon生效） |

示例用法:
```vue
<template>
	<div class="container">
		<div style="margin: 0 auto">
			<m-steps
				v-if="tipsValue == 'true'"
				:style="{ marginTop: layoutValue == 'horizontal' ? '100px' : '0px' }"
				:size="sizeValue"
				:layout="layoutValue"
				:lineType="lineTypeValue"
				:space="spaceValue"
				:defaultColor="defaultColorValue"
			>
				<m-step
					:index="0"
					:description="'提示文字提示文字提示文字提示文字提示文字提示文字'"
					:title="'第一次验收第一次验收第一次验收'"
				></m-step>
				<m-step
					:index="1"
					:description="'提示文字提示文字提示文字提示文字提示文字提示文字'"
					:title="'第二次验收'"
				></m-step>
				<m-step
					:index="2"
					:description="'提示文字提示文字提示文字提示文字提示文字提示文字'"
					:title="'第二次验收'"
				></m-step>
			</m-steps>
			<m-steps
				v-else
				:style="{ marginTop: layoutValue == 'horizontal' ? '100px' : '0px' }"
				:size="sizeValue"
				:layout="layoutValue"
				:lineType="lineTypeValue"
				:space="spaceValue"
				:defaultColor="defaultColorValue"
			>
				<m-step :index="0" :title="'第一次验收第一次验收第一次验收'"></m-step>
				<m-step :index="1" :title="'第二次验收'"></m-step>
				<m-step :index="2" :title="'第二次验收'"></m-step>
			</m-steps>
		</div>
		<div class="btn">
			<b>配置项</b>
			<p>
				<b>size：</b>
				<m-dropdown
					:options="sizeList"
					:text="sizeValue"
					type="button"
					trigger="click"
					@change="change"
					placement="bottom-end"
				></m-dropdown>
			</p>
			<p>
				<b>space：</b>
				<m-dropdown
					:options="spaceList"
					:text="spaceValue"
					type="button"
					trigger="click"
					@change="change3"
					placement="bottom-end"
				></m-dropdown>
			</p>
			<p>
				<b>layout：</b>
				<m-dropdown
					:options="layoutList"
					:text="layoutValue"
					type="button"
					trigger="click"
					@change="change0"
					placement="bottom-end"
				></m-dropdown>
			</p>
			<p>
				<b>lineType：</b>
				<m-dropdown
					:options="lineTypeList"
					:text="lineTypeValue"
					type="button"
					trigger="click"
					@change="change1"
					placement="bottom-end"
				></m-dropdown>
			</p>
			<p>
				<b>defaultColor：</b>
				<m-dropdown
					:options="defaultColorList"
					:text="defaultColorValue"
					type="button"
					trigger="click"
					@change="change4"
					placement="bottom-end"
				></m-dropdown>
			</p>
			<p>
				<b>展示辅助文字：</b>
				<m-dropdown
					:options="tipsList"
					:text="tipsValue"
					type="button"
					trigger="click"
					@change="change5"
					placement="bottom-end"
				></m-dropdown>
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'

export default defineComponent({
	setup() {
		const spaceList = [
...
```

注意事项:
- 组件样式按需加载，确保引入 theme/index.css

常见坑:
- 未引入主题样式导致样式缺失
- 按需注册忘记 app.use(...) 导致组件不渲染

使用者视角扩展:
- 适用场景: 流程进度展示
- 真实业务场景+推荐组合: 上线流程（Steps + Form + Button）
- 常用用法: `active` 当前步骤
- 高级用法: 自定义图标与状态
- 主题与样式: 线性/竖向样式
- 兼容性: 与 step 子组件配合使用
- 性能建议: 步骤过多时简化展示
- 迁移提示: 状态值与旧组件不同
- 故障排查: 状态样式不生效多为 status 传值错误

参考文件:
- 说明: 以下路径仅在源码仓库存在，构建产物中不包含
- packages/components/steps/index.ts
- packages/components/steps/index.md
- packages/components/steps/test/default.vue
