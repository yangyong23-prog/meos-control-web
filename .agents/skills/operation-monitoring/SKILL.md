---
name: operation-monitoring
description: '为 meos-control-web 根应用告诉 AI 如何正确使用和接入运行监控控制台组件的技能。适用于设备详情、空间详情、CommonDrawer 抽屉、对象详情面板中的 OperationMonitoring / OperatingMonitoring 接入，帮助 AI 优先复用 src/components/ObjectInfoComponents/OperationMonitoring/index.vue，通过 groupCodes、customControlComponent、具名插槽和 componentAttrs 组装运行控制台，而不是自己重写分组渲染、参数区和控制区。触发词：OperationMonitoring、OperatingMonitoring、运行监控、运行控制台、设备运行监控、空间运行监控、运行参数、技术参数、controlledParameterSet、equipParameterSet、groupCodes。'
argument-hint: '说明目标页面、对象类型（设备/空间/系统关联对象）、runningMonitorType、模板数据来源（通常是 useObjectInfoDataByTemplateHook）、需要展示的 groupCodes，以及是否要自定义控制组件或按 groupCode 插槽覆写'
---

# meos-control-web 运行监控控制台技能

## 技能目标

在根应用 `src/` 中处理设备或空间的运行监控控制台时，帮助代理优先复用现有 `OperationMonitoring` 容器，并正确完成：

- 运行监控面板接入
- `groupCodes` 选择与排序
- 默认分组组件映射
- 通过具名插槽覆写特殊分组
- 通过 `customControlComponent` / `componentAttrs` 扩展控制台行为

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里需要一个设备运行监控/运行控制台”
- “空间详情里要展示运行参数或控制参数”
- “对象详情抽屉里接入运行监控 tab”
- “按 groupCode 展示运行参数、技术参数、控制参数”
- “不要重写运行监控面板，尽量复用现有容器”
- “某几个 groupCode 想换成自定义展示组件”

默认优先检查：

- `src/components/ObjectInfoComponents/OperationMonitoring/index.vue`
- `src/components/ObjectInfoComponents/OperationMonitoring/config.ts`
- `src/views/Common/SystemsAndControl/index.vue`
- `src/views/ACAC/left/index.vue`
- `src/views/WSSewageTreatment/left/index.vue`

## 使用原则

### 1. 默认优先整体复用 `OperationMonitoring`

如果需求本质上是“把对象模板里的若干信息组渲染成运行控制台”，优先直接使用：

- `src/components/ObjectInfoComponents/OperationMonitoring/index.vue`

而不是在页面里重新遍历 `relInfoCodeGroupConfigs` 自己拼面板。

### 2. 先确认数据前提，再决定怎么装配

这个组件不是独立取数组件，它依赖外部已经拿到的模板数据。最常见前提是：

- `res.relInfoCodeGroupConfigs` 是数组
- 每个分组都有 `groupCode`
- 页面已经知道当前对象 `id`
- 如果要传完整对象上下文，优先传 `selectObj`

通常模板数据来自：

- `useObjectInfoDataByTemplateHook(selectObj)`

### 3. 先用 `groupCodes` 控制范围，再决定是否覆写

大多数接入场景不需要理解内部细节，先决定显示哪些组：

- 设备控制台：常见是 `controlledParameterSet`、`runningParameter`、`techniqueParameter`
- 空间/轻量详情：常见只放 `runningParameter`
- 特殊系统：再补串联系统控制组、风机/阀门关联组等

只有某个 `groupCode` 默认渲染不满足需求时，再用：

- `customControlComponent`
- 对应 `groupCode` 的具名插槽

### 4. 优先复用现有分组映射，不要自己重新定义一套

`config.ts` 已经内置了常用分组到组件的映射。接入时先复用现成规则，再做最小扩展。

### 5. 总技能负责分流，细节优先命中子技能

如果需求只落在某一个明确子域，优先交给对应子技能：

- 运行参数 / 技术参数展示 → `operation-monitoring-running-params`
- 控制模板切换 / `customControlComponent` → `operation-monitoring-control-template`
- 按 `groupCode` 做具名插槽覆写 → `operation-monitoring-slot-overrides`

只有当需求是“整块运行监控控制台接入”或同时横跨多个子域时，再使用本总技能统筹。

## 组件入口

直接使用：

- `src/components/ObjectInfoComponents/OperationMonitoring/index.vue`

分组映射入口：

- `src/components/ObjectInfoComponents/OperationMonitoring/config.ts`

## 子技能速查

### `operation-monitoring-running-params`

适合：

- 只展示 `runningParameter` / `techniqueParameter`
- 轻量运行参数区
- 运行参数与技术参数的最小接入

### `operation-monitoring-control-template`

适合：

- `controlledParameterSet` / `equipParameterSet` 接入
- `customControlComponent` 切换控制模板
- 通过 `componentAttrs` 统一补充控制上下文

### `operation-monitoring-slot-overrides`

适合：

- `coolingTowerFanInfo` 等未内置映射分组
- 特殊业务组用 `#[groupCode]` 改写渲染
- 只改个别分组，而不是重写整块面板

## Props / 插槽说明

### 高频 props

#### `id`

- 用途：当前对象 ID
- 兜底行为：如果没有有效 `selectObj.id`，内部会使用 `{ id }` 作为 `select-obj`

#### `res`

- 用途：运行监控模板数据对象
- 关键前提：需要包含 `relInfoCodeGroupConfigs`
- 常见来源：`useObjectInfoDataByTemplateHook(...)` 返回的模板数据

#### `runningMonitorType`

- 用途：当前运行监控类型
- 虽然容器本身不直接消费太多逻辑，但下层组件通常需要它作为业务上下文

#### `selectObj`

- 用途：当前选中的设备/空间对象
- 适合场景：下层组件需要对象完整信息，而不只是 `id`

#### `groupCodes`

- 用途：决定展示哪些分组、以及展示顺序
- 默认值：
  - `GROUP_CODE_KEY_MAP.equipParameterSet`
  - `GROUP_CODE_KEY_MAP.runningParameter`

#### `stratification`

- 用途：是否按分层方式展示
- 默认值：`true`

#### `componentAttrs`

- 用途：统一透传给内部动态组件的附加属性
- 适合场景：给控制模板补 `systemId`、原因选项、控制行为配置等

### 扩展 props

#### `customControlComponent`

- 类型：`(groupCode: string) => Component`
- 用途：覆写设备控制类分组的组件映射
- 当前行为：`equipParameterSet`、`controlledParameterSet` 会优先用它返回的组件，否则回退到默认控制模板

### 具名插槽

可以按 `groupCode` 提供具名插槽，完全接管某个分组的渲染。

插槽名称规则：

- `#[groupCode]`

插槽可拿到：

- `id`：当前分组 code
- `value`：当前分组对象

适合场景：

- 某个分组要换成关联设备面板
- 某个分组不是标准参数列表，而是业务特化视图

## 默认分组映射速查

以下映射来自 `src/components/ObjectInfoComponents/OperationMonitoring/config.ts`：

### 控制类分组

- `equipParameterSet` → 默认控制模板（可被 `customControlComponent` 覆写）
- `controlledParameterSet` → 默认控制模板（可被 `customControlComponent` 覆写）

### 特殊控制类分组

- `controlGroupOfTheSeriesConnectedChiller` → `TemplateFive`

### 参数展示类分组

- `runningParameter` → `RunningParams`
- `techniqueParameter` → `RunningParams`
- `x1stTag3` → `RunnigParamsNew`
- `x1stTag5` → `RunnigParamsNew`

### 未命中的分组

- 返回 `null`
- 控制台会打印“暂无该组件”日志
- 这类场景优先考虑补插槽，而不是在页面里另起一套循环逻辑

## 最小使用示例

### 1. 轻量设备/空间详情：只展示运行参数

```vue
<OperatingMonitoring
	:id="selectObj?.id"
	:running-monitor-type="RUNNING_MONITOR_TYPE"
	:res="templateData"
	:group-codes="['runningParameter']"
/>
```

适合场景：

- 轻量抽屉
- 只看实时运行参数
- 不需要控制台交互

### 2. 常规设备运行监控：控制参数 + 运行参数 + 技术参数

```vue
<OperationMonitoring
	:id="selectObj.id"
	:select-obj="selectObj"
	:running-monitor-type="RUNNING_MONITOR_TYPE"
	:res="templateData"
	:group-codes="[
		GROUP_CODE_KEY_MAP.controlledParameterSet,
		GROUP_CODE_KEY_MAP.runningParameter,
		GROUP_CODE_KEY_MAP.techniqueParameter
	]"
/>
```

适合场景：

- 设备详情抽屉中的标准“运行监控” tab
- 已有模板数据，只需要按默认映射渲染

### 3. 特殊控制模板：统一切换控制组件

```vue
<OperationMonitoring
	:id="selectObj.id"
	:select-obj="selectObj"
	:running-monitor-type="RUNNING_MONITOR_TYPE"
	:res="templateData"
	:group-codes="[
		GROUP_CODE_KEY_MAP.controlGroupOfTheSeriesConnectedChiller,
		GROUP_CODE_KEY_MAP.controlledParameterSet,
		GROUP_CODE_KEY_MAP.runningParameter,
		GROUP_CODE_KEY_MAP.techniqueParameter
	]"
	:custom-control-component="() => getComponent(4)"
	:component-attrs="{
		systemId,
		reasonOptions
	}"
/>
```

适合场景：

- ACAC 等特殊系统
- 控制区要统一切换到另一套模板
- 需要给控制区额外传业务参数

### 4. 某个分组改用具名插槽覆写

```vue
<OperationMonitoring
	:id="selectObj.id"
	:select-obj="selectObj"
	:running-monitor-type="RUNNING_MONITOR_TYPE"
	:res="templateData"
	:group-codes="[
		GROUP_CODE_KEY_MAP.controlledParameterSet,
		GROUP_CODE_KEY_MAP.coolingTowerFanInfo,
		GROUP_CODE_KEY_MAP.runningParameter
	]"
>
	<template #[GROUP_CODE_KEY_MAP.coolingTowerFanInfo]="{ value }">
		<AssociatedDevicesNew
			v-if="value"
			:select-obj="selectObj"
			:basic-data="[value]"
			:running-monitor-type="RUNNING_MONITOR_TYPE"
			:res="templateData"
			collapse
			can-jump
		/>
	</template>
</OperationMonitoring>
```

适合场景：

- 默认映射里没有该分组
- 该分组需要关联设备式展示
- 只想覆写个别分组，不想改其它分组

## AI 最该知道的使用结论

### 1. `OperationMonitoring` 是“分组装配容器”，不是简单静态卡片

它的职责是：

- 从 `res.relInfoCodeGroupConfigs` 取组
- 按 `groupCodes` 过滤和排序
- 按 `groupCode` 选择内部组件
- 给特例分组留插槽覆写口

### 2. 大多数页面只需要关心三件事

优先先确认：

- 当前对象是谁（`id` / `selectObj`）
- 模板数据从哪里来（`res`）
- 需要显示哪些组（`groupCodes`）

### 3. 特殊分组优先插槽覆写，控制类差异优先 `customControlComponent`

这两个扩展点是现有标准入口，不要在页面里重写整套容器逻辑。

### 4. 没数据时容器自带空态

如果 `relInfoCodeGroupConfigs` 不存在或没有有效组，容器会显示 `m-illustration` 空态，不需要页面再重复包一层“无数据”。

### 5. 单一问题优先走子技能，整块装配再走总技能

这样能减少无关上下文，提升命中率，也能避免 AI 把局部改动写成“大修工程”。

## AI 使用时的规则

### 1. 不要一上来就直接遍历 `relInfoCodeGroupConfigs`

优先顺序应该是：

1. 先看能不能直接用 `OperationMonitoring`
2. 再决定 `groupCodes`
3. 再决定是否需要插槽覆写或换控制模板

### 2. 不要把所有分组都当成同一类组件处理

控制组、运行参数组、技术参数组、特殊业务组的展示方式并不一样。

### 3. 优先传业务上下文，不要传内部实现猜测

应该优先传：

- `id`
- `selectObj`
- `runningMonitorType`
- `res`
- `groupCodes`
- `componentAttrs`

### 4. 页面只是接入时，不要复制内部模板映射

`config.ts` 已经是标准映射入口；如有新分组，优先补插槽或扩映射，而不是在调用页手写第二套判断树。

## 特别容易写错的地方

### 1. 漏传 `res` 或 `res.relInfoCodeGroupConfigs`

这样组件只能走空态。

### 2. 明明只想换一个分组，却把整个运行控制台重写了

这是最常见跑偏方式。

### 3. 没有按 `groupCodes` 明确顺序，导致展示顺序失控

这个组件的展示顺序通常应该由页面明确控制。

### 4. 误以为所有自定义都应该走 prop

当前实现里，最稳定的扩展方式仍然是：

- `customControlComponent`
- `componentAttrs`
- `#[groupCode]` 具名插槽

如果只是某一组要换展示，优先插槽覆写。

### 5. 忽略“未知 groupCode 无默认组件”这件事

遇到未映射分组时，不要假设容器会自动渲染出来。

## 完成标准

满足以下条件才算完成：

- AI 已知道什么时候直接复用 `OperationMonitoring`
- AI 已知道 `id`、`res`、`groupCodes` 是最核心接入参数
- AI 已知道哪些分组已有默认组件映射
- AI 已知道什么时候用 `customControlComponent`，什么时候用具名插槽
- AI 不会为了接一个运行监控面板而重写整个分组渲染逻辑

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 这次展示了哪些 `groupCodes`
2. 模板数据来自哪里
3. 是否使用了 `customControlComponent` 或具名插槽
4. 是标准默认渲染，还是对某些分组做了特化
