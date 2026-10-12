---
name: system-info-disability-alarm-reset
description: '为 meos-control-web 根应用告诉 AI 如何正确接入 systemInfo/DisabilityAlarmReset 组件的技能。适用于失能报警复位、单个/批量复位、DisabilityAlarmReset 组件接入，并让 AI 优先通过 data、systemData、sse 完成接入，而不是自己重写报警列表。触发词：DisabilityAlarmReset、失能报警复位、报警复位、批量复位、restoration、系统报警复位。'
argument-hint: '说明目标页面、失能报警分组数据来源、systemData 和 sse 是否可用，以及是单独接入复位区还是放进系统设置面板中'
---

# DisabilityAlarmReset 接入技能

## 技能目标

在根应用 `src/` 中处理失能报警复位能力时，帮助代理优先复用现有 `DisabilityAlarmReset`，并正确完成：

- 组件接入
- 关键 props 传递
- 单个 / 批量复位区的最小使用方式
- SSE 联动场景下的标准接法

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里需要失能报警复位区”
- “要展示当前有失能报警的设备项”
- “支持单个复位和批量复位”
- “报警值要随 SSE 实时更新”
- “不要重写这块报警复位列表”

默认优先检查：

- `src/components/systemInfo/DisabilityAlarmReset/index.vue`

## 使用原则

### 1. 默认优先整体使用 `DisabilityAlarmReset`

如果页面要的是完整失能报警复位体验，优先直接挂该组件。

### 2. `data + systemData` 是最关键的接入参数

通常先保证这两项正确，再考虑是否补充 `sse`。

### 3. 有实时联动需求时再传 `sse`

如果页面已经有 SSE 客户端，优先继续复用。

## 组件入口

直接使用：

`src/components/systemInfo/DisabilityAlarmReset/index.vue`

## Props 说明

### 高频 props

#### `data`

- 用途：失能报警分组配置数据
- 常见来源：系统信息面板中拆出的某个报警配置组

#### `systemData`

- 用途：当前系统基础信息
- 结构示例：`{ systemId, classCode, localName }`

### 可选 props

#### `sse`

- 用途：SSE 客户端
- 适合场景：需要让报警值和复位列表跟随实时推送联动

## 最小使用示例

### 1. 作为独立失能报警复位区接入

```vue
<DisabilityAlarmReset
    :data="disabilityAlarmReset"
    :system-data="{
        systemId,
        classCode: systemClassCode,
        localName: currentSystem.localName
    }"
    :sse="sseConsoleClient"
/>
```

适合场景：

- 系统设置抽屉中的报警复位模块
- 单独的系统报警复位区域

### 2. 带条件显示的典型接法

```vue
<DisabilityAlarmReset
    v-if="disabilityAlarmReset?.groupCode && currentSystem"
    :data="disabilityAlarmReset"
    :system-data="{
        systemId,
        classCode: systemClassCode,
        localName: currentSystem.localName
    }"
/>
```

适合场景：

- 只有拿到配置组和系统对象后才展示该区域

## AI 最该知道的使用结论

### 1. 最核心的是 `data` 和 `systemData`

没有这两项，组件上下文通常不完整。

### 2. `sse` 是增强项，不是所有场景都必须传

但如果页面已经有 SSE，优先继续接进去。

### 3. 不要为了做报警复位区而重写分组和按钮

已有组件已经包含单个 / 批量复位入口。

## AI 使用时的规则

### 1. 不要把它当成普通静态列表

它通常不是纯展示区，而是带复位动作的系统能力区。

### 2. 优先传标准 `systemData`

建议统一传：

- `systemId`
- `classCode`
- `localName`

### 3. 有实时需求时优先接现成 `sse`

而不是重新发明一套轮询或手动刷新逻辑。

## 特别容易写错的地方

### 1. 漏传 `systemData`

这样容易导致系统上下文不完整。

### 2. 页面有 SSE，却没有传给组件

这样会丢掉实时联动能力。

### 3. 想做报警复位，却自己重写报警项列表

这会偏离已有组件的标准用法。

### 4. 没有做条件渲染就直接挂组件

在配置组尚未准备好时，容易出现空渲染或异常状态。

## 完成标准

满足以下条件才算完成：

- AI 已知道 `DisabilityAlarmReset` 怎么直接接入
- AI 已知道 `data`、`systemData`、`sse` 的基本用法
- AI 不会为了接一个失能报警复位区而重写一整套列表

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 是否直接复用了 `DisabilityAlarmReset`
2. `data` 和 `systemData` 是怎么组织的
3. 是否接入了 `sse` 实时联动
