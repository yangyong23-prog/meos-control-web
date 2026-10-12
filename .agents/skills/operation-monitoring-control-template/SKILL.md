---
name: operation-monitoring-control-template
description: '为 meos-control-web 根应用告诉 AI 如何在 OperationMonitoring 中切换或扩展控制模板的技能。适用于 controlledParameterSet、equipParameterSet、customControlComponent、componentAttrs、getComponent(4) 等运行控制台控制模板场景，帮助 AI 优先复用 src/components/ObjectInfoComponents/OperationMonitoring/config.ts 的映射与现有控制模板，而不是重新写一套控制卡片。触发词：customControlComponent、控制模板、controlledParameterSet、equipParameterSet、getComponent、TemplateTwo、TemplateFour、运行控制组件。'
argument-hint: '说明目标页面、需要接入的控制类 groupCodes、是否需要统一切换控制模板，以及 componentAttrs 里要补充哪些控制上下文'
---

# OperationMonitoring 控制模板技能

## 技能目标

在 `OperationMonitoring` 中处理控制类分组时，帮助代理优先复用现有控制模板映射，并正确完成：

- `controlledParameterSet` / `equipParameterSet` 接入
- `customControlComponent` 切换控制模板
- `componentAttrs` 统一透传控制上下文
- 保持控制区与现有模板体系一致

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这组控制参数要换成另一套控制模板”
- “运行监控里的控制区要统一用 TemplateFour”
- “通过 customControlComponent 切换控制组件”
- “控制区要多传 systemId、reasonOptions 之类的上下文”
- “不要重写控制卡片，直接复用现有模板”

默认优先检查：

- `src/components/ObjectInfoComponents/OperationMonitoring/config.ts`
- `src/components/ObjectInfoComponents/SingleDeviceControl/TemplateTwo.vue`
- `src/components/ObjectInfoComponents/SingleDeviceControl/TemplateFour.vue`
- `src/views/ACAC/left/index.vue`
- `src/views/Common/SystemsAndControl/index.vue`

## 使用原则

### 1. 先复用默认控制模板，再判断是否需要切换

默认情况下：

- `equipParameterSet`
- `controlledParameterSet`

都会走默认控制模板；只有明确要求另一种控制样式时，才使用 `customControlComponent` 覆写。

### 2. 统一模板差异优先走 `customControlComponent`

如果多个控制类分组都要换到同一套模板，优先：

- `:custom-control-component="() => getComponent(4)"`

而不是在每个分组里单独写分支。

### 3. 业务上下文优先走 `componentAttrs`

像这些控制区共用上下文，优先统一塞到 `componentAttrs`：

- `systemId`
- `reasonOptions`
- 控制按钮显示逻辑
- 数据源展示开关

## 最小使用示例

### 1. 标准控制区接入

```vue
<OperationMonitoring
    :id="selectObj.id"
    :select-obj="selectObj"
    :running-monitor-type="RUNNING_MONITOR_TYPE"
    :res="templateData"
    :group-codes="[GROUP_CODE_KEY_MAP.controlledParameterSet]"
/>
```

### 2. 统一切到另一套控制模板

```vue
<OperationMonitoring
    :id="selectObj.id"
    :select-obj="selectObj"
    :running-monitor-type="RUNNING_MONITOR_TYPE"
    :res="templateData"
    :group-codes="[
        GROUP_CODE_KEY_MAP.controlledParameterSet,
        GROUP_CODE_KEY_MAP.equipParameterSet
    ]"
    :custom-control-component="() => getComponent(4)"
    :component-attrs="{
        systemId,
        reasonOptions
    }"
/>
```

## AI 使用规则

- 不要为控制区单独重写新的业务组件树
- 不要把模板选择散落在多个调用点
- 先判断是不是统一模板切换；如果是，就优先 `customControlComponent`
- 需要补充控制上下文时，优先放进 `componentAttrs`

## 容易写错的地方

- 只想切换模板，却去改 `OperationMonitoring` 容器主体
- 明明是统一模板切换，却在多个分组里分别硬编码组件
- 控制区需要业务上下文，却把参数散落到不同插槽里

## 完成标准

- AI 已知道控制类分组优先复用现有模板体系
- AI 已知道统一模板切换优先用 `customControlComponent`
- AI 已知道控制区上下文优先通过 `componentAttrs` 透传
