---
name: system-info-system-auto-set
description: '为 meos-control-web 根应用告诉 AI 如何正确接入 systemInfo/SystemAutoSet 及相关子组件的技能。适用于一键手动、一键自动、SystemAutoSet 入口接入，并让 AI 优先通过 systemId、runningMonitorType、PERMISSION 完成接入，而不是自己重写手自动切换入口、弹窗和失败列表。触发词：SystemAutoSet、EquipmentAutoSet、ErrorList、一键手动、一键自动、手自动切换、manual auto control。'
argument-hint: '说明目标页面、systemId、runningMonitorType、权限点，以及是只接入口组件还是需要理解 EquipmentAutoSet / ErrorList 配套链路'
---

# SystemAutoSet 接入技能

## 技能目标

在根应用 `src/` 中处理系统级一键手动 / 一键自动能力时，帮助代理优先复用现有 `SystemAutoSet`，并正确完成：

- 入口组件接入
- 关键 props 传递
- 失败列表链路理解
- 手自动入口的最小使用方式

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里要加一键手动 / 一键自动”
- “系统级手自动切换入口该怎么接”
- “要保留设备范围弹窗和失败列表”
- “云端或无权限时要禁用入口”
- “不要重写这套手自动切换能力”

默认优先检查：

- `src/components/systemInfo/SystemAutoSet/SystemAutoSet.vue`
- `src/components/systemInfo/SystemAutoSet/EquipmentAutoSet.vue`
- `src/components/systemInfo/SystemAutoSet/ErrorList.vue`

## 使用原则

### 1. 默认优先整体使用 `SystemAutoSet`

如果页面只需要系统级手自动入口，优先直接挂 `SystemAutoSet`。

### 2. 大多数页面只需要关心入口 props

通常不需要直接在页面里自己接 `EquipmentAutoSet` 和 `ErrorList`。

### 3. `PERMISSION` 是常见可选增强参数

如果页面已有明确权限点，优先显式传入。

## 组件入口

直接使用：

`src/components/systemInfo/SystemAutoSet/SystemAutoSet.vue`

## Props / 事件说明

### 高频 props

#### `systemId`

- 用途：当前系统 ID

#### `runningMonitorType`

- 用途：当前运行监控类型

#### `PERMISSION`

- 用途：控制入口权限
- 默认值：当前菜单配置中的 `PERMISSION`

### 事件

#### `close`

- 用途：关闭内部弹窗后通知父组件
- 适合场景：父级需要在某些场景下同步状态

## 最小使用示例

### 1. 直接接入一键手自动入口

```vue
<SystemAutoSet
    :system-id="systemId"
    :running-monitor-type="runningMonitorType"
    :PERMISSION="permission"
/>
```

适合场景：

- 系统设置抽屉中的一键手自动区域
- 系统详情里的手自动控制入口

### 2. 需要感知关闭时的接法

```vue
<SystemAutoSet
    :system-id="systemId"
    :running-monitor-type="runningMonitorType"
    @close="handleClose"
/>
```

适合场景：

- 父级需要在内部弹窗关闭后同步自身状态

## AI 最该知道的使用结论

### 1. 页面层通常只需要接 `SystemAutoSet`

`EquipmentAutoSet` 和 `ErrorList` 通常由 `SystemAutoSet` 内部拉起。

### 2. 最核心的是 `systemId` 和 `runningMonitorType`

这两个参数是手自动入口最基础的上下文。

### 3. 如果有权限点，优先显式传 `PERMISSION`

这样页面上的权限语义更清晰。

### 4. 不要为了做手自动入口去重写弹窗和失败列表

已有组件已经带着这条链路。

## AI 使用时的规则

### 1. 不要直接在业务页重写 radio 入口

优先复用 `SystemAutoSet`。

### 2. 不要把 `EquipmentAutoSet` 当页面直接入口

大多数接入场景下，它是 `SystemAutoSet` 内部弹出的表单组件。

### 3. 不要忘记权限和运行监控类型上下文

至少要确认：

- `systemId`
- `runningMonitorType`
- `PERMISSION`（如有）

## 特别容易写错的地方

### 1. 只想接一个入口，却自己把入口、弹窗、失败列表重写一遍

这是典型重复造轮子。

### 2. 漏传 `systemId` 或 `runningMonitorType`

这样手自动切换上下文通常不完整。

### 3. 明明有权限点，却完全不传 `PERMISSION`

结果会让入口权限行为不够明确。

### 4. 错把 `EquipmentAutoSet` 当成页面一级组件直接用

多数情况下不需要这么接。

## 完成标准

满足以下条件才算完成：

- AI 已知道 `SystemAutoSet` 怎么直接接入
- AI 已知道 `systemId`、`runningMonitorType`、`PERMISSION` 的基本用法
- AI 不会为了做一键手自动入口去重写弹窗和失败列表链路

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 是否直接复用了 `SystemAutoSet`
2. 传了哪些关键 props
3. 是否还需要父级处理 `close` 事件
