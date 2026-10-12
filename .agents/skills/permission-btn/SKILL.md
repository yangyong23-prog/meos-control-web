---
name: permission-btn
description: '为 meos-control-web 根应用处理权限按钮、权限单选、权限点击容器的技能。适用于根据权限/边云环境包装交互入口、选择 SetButton / SetRadio / SetDiv、为禁用态补充提示文案、复用 permission 与 showTip 约定、以及避免直接裸写 m-button、m-radio 或可点击 div。触发词：SetButton、SetRadio、SetDiv、权限按钮、权限单选、权限点击容器、permission、showTip、云端不支持、无操作权限。'
argument-hint: '说明目标页面/组件，以及要新增或替换的是按钮、radio 还是 div 点击区域'
---

# meos-control-web 权限按钮技能

## 技能目标

在根应用 `src/` 中处理“需要权限控制、边云限制提示、禁用态提示”的交互入口时，帮助代理稳定完成以下事项：

- 优先复用现有权限包装组件，而不是直接裸写 `m-button`、`m-radio` 或可点击 `div`。
- 根据交互形态正确选择 `SetButton`、`SetRadio`、`SetDiv`。
- 保持项目现有的权限判定、云端不可操作提示、无权限提示、禁用态提示行为一致。
- 在不破坏现有插槽和事件用法的前提下，交付可维护、行为统一的权限交互组件代码。

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里加一个有权限控制的按钮”
- “这个 radio 要受权限控制”
- “这块点击区域没权限时要禁用并提示”
- “云平台下不允许操作，要提示去边缘端”
- “无权限时统一显示无操作权限提示”
- “把裸写的 m-button / m-radio / div 改成项目权限组件”

如果目标交互同时满足“需要操作权限”与“需要边云环境限制提示”，默认优先检查这三个组件：

- `src/components/common/SetButton.vue`
- `src/components/common/SetRadio.vue`
- `src/components/common/SetDiv.vue`

## 先判断该选哪个组件

### 1. 普通按钮操作 → `SetButton`

适用于：

- 提交、切换、执行、确认、打开弹窗等按钮交互
- 原本准备写 `m-button`
- 需要透出按钮禁用态到插槽时

特点：

- 内部包裹 `m-button`
- 插槽会透出 `disabled`
- `click` 事件会返回 `btn.value.$el` 和原始事件对象

优先选它的场景：

- 你本来就想写按钮
- 你需要保留 Meri Button 的外观和属性
- 你希望禁用态时插槽内容能感知到 `disabled`

### 2. 单选/互斥项 → `SetRadio`

适用于：

- 原本准备写 `m-radio`
- 单选项、模式切换项、互斥勾选项

特点：

- 内部包裹 `m-radio`
- 固定传入 `:size="14"`
- `click` 事件只返回 `btn.value.$el`

优先选它的场景：

- 交互语义就是 radio
- 需要复用项目里统一的权限/边云提示行为

### 3. 非按钮型点击区域 → `SetDiv`

适用于：

- 文本按钮
- 图标 + 文本的轻量点击区域
- 自定义布局块，需要点击但不适合用 `m-button`

特点：

- 内部包裹普通 `div`
- 插槽透出：`has-permission`、`is-edge`、`disabled`
- `click` 时会显式拦截 `disabled`、非边缘端、无权限三类场景
- 支持 `noHeight` 控制高度样式

优先选它的场景：

- 需要灵活布局
- 不希望用按钮视觉样式
- 插槽里要根据权限/边云状态自定义渲染

## 三个组件的共同行为约定

这三个组件都遵循同一套权限与提示逻辑：

### 1. 有权限时才允许进入正常交互分支

- `permission` 未传时，默认视为有权限
- `permission` 已传时，使用 `base.hasAuth(props.permission)` 判断

### 2. 非边缘端时显示“云平台不支持操作”提示

当 `!isEdge()` 时：

- 组件呈现禁用态
- tip 文案为：`meos_control_web.cloud_platform_operation_not_supported_please_use_edge`

### 3. 无权限时显示“无操作权限”提示

当 `hasPermission()` 为 `false` 时：

- 组件呈现禁用态
- tip 文案为：`meos_control_web.no_operation_permission_contact_admin_for_adding`

### 4. 业务禁用态可通过 `content + showTip` 控制提示

当业务层传入：

- `disabled`
- `content`
- `showTip`

则在边缘端、有权限场景下：

- `disabled` 控制是否禁用
- `content` 作为禁用提示文案
- `showTip` 决定禁用态是否显示 tip

## 标准使用方式

### `SetButton`

```vue
<SetButton
	permission="xxx"
	:disabled="disabled"
	:show-tip="showTip"
	:content="tipText"
	@click="handleClick"
>
	<template #default="{ disabled }">
		{{ disabled ? '不可操作' : '执行操作' }}
	</template>
</SetButton>
```

### `SetRadio`

```vue
<SetRadio
	permission="xxx"
	:disabled="disabled"
	:show-tip="showTip"
	:content="tipText"
	@click="handleClick"
/>
```

### `SetDiv`

```vue
<SetDiv
	permission="xxx"
	:disabled="disabled"
	:show-tip="showTip"
	:content="tipText"
	:no-height="true"
	@click="handleClick"
>
	<template #default="{ disabled, hasPermission, isEdge }">
		<span>{{ disabled || !hasPermission || !isEdge ? '不可操作' : '去执行' }}</span>
	</template>
</SetDiv>
```

## 决策流程

按下面步骤选择和实现：

```text
1. 判断交互形态 → verify: 是 button、radio 还是自定义点击区域
2. 选择 SetButton / SetRadio / SetDiv → verify: 与目标视觉和事件语义一致
3. 补齐 permission / disabled / content / showTip → verify: 权限、禁用、提示行为完整
4. 检查边缘端与云端分支 → verify: 云端禁用提示符合项目文案
5. 检查无权限分支 → verify: 无权限时呈现统一提示且不可操作
```

## 代码实现规则

### 1. 不要重复实现权限判断

避免在业务组件里重复写：

- `base.hasAuth(...)`
- `isEdge()`
- tip 文案三元表达式
- “无权限则禁用”分支

能用这三个组件时，优先直接复用。

### 2. 不要把云端限制和业务禁用混成一套逻辑

项目里已有明确分层：

- 非边缘端：平台能力限制
- 无权限：权限限制
- `disabled`：业务态限制

不要把这三者合并成一个模糊的 `disabled` 来源。

### 3. 默认沿用现有 props 约定

除非用户明确要求，不要额外发明新的 props 命名。优先复用：

- `permission`
- `disabled`
- `content`
- `showTip`
- `noHeight`（仅 `SetDiv`）

### 4. 保持现有事件语义

- `SetButton`：`click` 返回 `btn.value.$el, e`
- `SetRadio`：`click` 返回 `btn.value.$el`
- `SetDiv`：`click` 返回 `btn.value, e`

如果业务方依赖这些参数，不要擅自统一成另一种签名。

## 完成标准

满足以下条件才算完成：

- 已根据交互类型正确选择 `SetButton`、`SetRadio` 或 `SetDiv`
- 没有在业务文件里重复实现现有权限/边云提示逻辑
- `permission`、`disabled`、`content`、`showTip` 的使用与项目约定一致
- 云端限制和无权限提示文案保持项目现有 key，不硬编码新文案
- 事件参数没有被无故改坏

## 常见错误

- 明明是权限按钮，却继续裸写 `m-button`
- 非边缘端禁用逻辑写在业务页面里，和项目组件行为不一致
- `disabled` 只处理业务态，却漏掉权限或边云限制
- 把 `SetDiv` 当成普通包裹层，却忽略它的点击拦截语义
- 自己重新写一套“无权限提示”文案，而不是复用现有 i18n key

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 选用了哪个权限组件，以及原因
2. 是否复用了现有 `permission` / `showTip` / `content` 约定
3. 是否保留了云端不支持操作与无权限提示分支
4. 是否保持了原有插槽与事件参数语义

## 本技能沉淀出的项目经验

1. `SetButton.vue` 适合包裹 `m-button`，并通过插槽透出 `disabled`。
2. `SetRadio.vue` 适合包裹 `m-radio`，是最轻量的权限单选包装。
3. `SetDiv.vue` 适合“文本按钮/图标区/自定义布局块”这类非按钮型交互区域。
4. 这三个组件都统一依赖 `baseStore().hasAuth`、`isEdge()` 与 `GET_MENU_CONFIG().PERMISSION`。
5. 在 meos-control-web 根应用里，权限交互优先复用这三个组件，比在业务页面裸写判断更稳、更一致。
