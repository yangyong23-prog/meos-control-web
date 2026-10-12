---
name: operation-monitoring-running-params
description: '为 meos-control-web 根应用告诉 AI 如何在 OperationMonitoring 中接入运行参数与技术参数展示的技能。适用于 runningParameter、techniqueParameter、x1stTag3、x1stTag5、轻量运行参数区、设备/空间详情中的参数展示场景，帮助 AI 优先复用现有 RunningParams / RunnigParamsNew，而不是自己重写参数列表和分组遍历。触发词：runningParameter、techniqueParameter、x1stTag3、x1stTag5、运行参数、技术参数、参数展示、轻量运行监控。'
argument-hint: '说明目标页面、对象类型、runningMonitorType、模板数据来源，以及这次要展示 runningParameter、techniqueParameter、x1stTag3、x1stTag5 中的哪些分组'
---

# OperationMonitoring 运行参数技能

## 技能目标

在 `OperationMonitoring` 中处理运行参数与技术参数展示时，帮助代理优先复用现有参数展示组件，并正确完成：

- `runningParameter` 接入
- `techniqueParameter` 接入
- `x1stTag3` / `x1stTag5` 新参数组接入
- 轻量运行参数区装配

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里只要展示运行参数”
- “空间详情里补一块技术参数”
- “设备详情抽屉里接入运行参数区，不需要控制台”
- “x1stTag3 / x1stTag5 这种新参数组怎么接”
- “不要重写参数列表，直接复用现有运行参数组件”

默认优先检查：

- `src/components/ObjectInfoComponents/OperationMonitoring/config.ts`
- `src/components/ObjectInfoComponents/RunningParams/index.vue`
- `src/components/ObjectInfoComponents/RunningParams/new/index.vue`
- `src/views/WSSewageTreatment/left/index.vue`
- `src/views/Common/SystemsAndControl/index.vue`

## 使用原则

### 1. 只展示参数时，优先最小化 `groupCodes`

如果页面只需要参数展示区，不要把控制类分组一起塞进来。优先只传需要的参数组：

- `runningParameter`
- `techniqueParameter`
- `x1stTag3`
- `x1stTag5`

### 2. 旧参数组与新参数组分开理解

当前默认映射中：

- `runningParameter` / `techniqueParameter` → `RunningParams`
- `x1stTag3` / `x1stTag5` → `RunnigParamsNew`

也就是说，新旧参数组已经有不同的标准承载组件，不要混成一套自己重写。

### 3. 参数区通常不需要额外覆写

大多数参数展示场景，直接通过 `groupCodes` 控制范围即可，不需要：

- `customControlComponent`
- 具名插槽

除非某个参数组有明确业务特化需求。

## 最小使用示例

### 1. 轻量运行参数区

```vue
<OperatingMonitoring
	:id="selectObj?.id"
	:select-obj="selectObj"
	:running-monitor-type="RUNNING_MONITOR_TYPE"
	:res="templateData"
	:group-codes="['runningParameter']"
/>
```

### 2. 运行参数 + 技术参数

```vue
<OperationMonitoring
	:id="selectObj.id"
	:select-obj="selectObj"
	:running-monitor-type="RUNNING_MONITOR_TYPE"
	:res="templateData"
	:group-codes="[
		GROUP_CODE_KEY_MAP.runningParameter,
		GROUP_CODE_KEY_MAP.techniqueParameter
	]"
/>
```

### 3. 新参数组接入

```vue
<OperationMonitoring
	:id="selectObj.id"
	:select-obj="selectObj"
	:running-monitor-type="RUNNING_MONITOR_TYPE"
	:res="templateData"
	:group-codes="[
		GROUP_CODE_KEY_MAP.x1stTag3,
		GROUP_CODE_KEY_MAP.x1stTag5
	]"
/>
```

## AI 使用规则

- 只做参数展示时，不要顺手把控制区一起接进来
- 先确定展示哪些参数组，再决定 `groupCodes` 顺序
- 旧参数组继续走 `RunningParams`，新参数组继续走 `RunnigParamsNew`
- 没有明确业务要求时，不要为参数区额外加插槽或自定义模板

## 容易写错的地方

- 只想显示运行参数，却把 `controlledParameterSet` 也带进来
- 没区分 `runningParameter` 与 `x1stTag3` 两套参数组件
- 为普通参数展示场景额外重写列表结构

## 完成标准

- AI 已知道运行参数区应优先复用现有参数组件
- AI 已知道通过 `groupCodes` 控制参数展示范围与顺序
- AI 已知道旧参数组与新参数组使用不同承载组件
