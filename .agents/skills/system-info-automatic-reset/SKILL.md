---
name: system-info-automatic-reset
description: '为 meos-control-web 根应用告诉 AI 如何正确接入 systemInfo/AutomaticReset 组件的技能。适用于累计运行时清零、分类清零、AutomaticReset 组件接入，并让 AI 优先通过 systemId、systemClassCode、runningMonitorType 和 loadFinally 事件完成接入，而不是自己重写清零列表。触发词：AutomaticReset、累计运行时清零、运行时清零、清零、reset to zero、系统清零。'
argument-hint: '说明目标页面、systemId、systemClassCode，以及是单独接入清零区，还是放进系统设置抽屉中'
---

# AutomaticReset 接入技能

## 技能目标

在根应用 `src/` 中处理累计运行时清零能力时，帮助代理优先复用现有 `AutomaticReset`，并正确完成：

- 组件接入
- 高频 props 传递
- `loadFinally` 事件处理
- 清零区的最小使用方式

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里需要累计运行时清零”
- “把可清零分类列出来”
- “清零完成后要刷新列表”
- “不要重写清零按钮和确认逻辑”

默认优先检查：

- `src/components/systemInfo/AutomaticReset/AutomaticReset.vue`

## 使用原则

### 1. 默认优先整体使用 `AutomaticReset`

如果页面要的是完整清零区体验，优先直接挂该组件。

### 2. 关键是系统上下文参数，不是内部逻辑

大多数页面接入时，只需要把系统 ID、系统分类和运行监控类型传进去。

### 3. `@load-finally` 用于收口父级 loading

如果父组件有 loading，优先通过 `@load-finally` 收口。

## 组件入口

直接使用：

`src/components/systemInfo/AutomaticReset/AutomaticReset.vue`

## Props / 事件说明

### 高频 props

#### `systemId`

- 用途：当前系统 ID

#### `systemClassCode`

- 用途：当前系统分类编码

#### `runningMonitorType`

- 用途：当前运行监控类型

### 事件

#### `loadFinally`

- 用途：列表请求结束后通知父组件收口 loading

## 最小使用示例

### 1. 作为独立清零区接入

```vue
<AutomaticReset
    :system-id="systemId"
    :system-class-code="systemClassCode"
    :running-monitor-type="runningMonitorType"
    @load-finally="loadingAutomaticReset = false"
/>
```

适合场景：

- 系统设置抽屉中的清零模块
- 单独的系统清零区域

### 2. 典型父级状态组织方式

```js
const loadingAutomaticReset = ref(true);

const openPanel = () => {
    loadingAutomaticReset.value = true;
};
```

适合场景：

- 父级打开面板后等待清零列表加载完成
- 通过 `loadFinally` 统一结束 loading

## AI 最该知道的使用结论

### 1. 大多数场景只需要传 3 个 props

- `systemId`
- `systemClassCode`
- `runningMonitorType`

### 2. 如果父级有 loading，就接 `loadFinally`

这是最常见的配套接法。

### 3. 不要为了接入清零区去重写列表和按钮

已有组件已经包含清零入口和刷新链路。

## AI 使用时的规则

### 1. 不要在业务页自己重写清零列表

优先直接复用 `AutomaticReset`。

### 2. 不要漏掉系统 ID 和系统分类编码

这两个参数通常决定能否正确查到清零分类。

### 3. 不要忘记父级 loading 收口

如果页面有 loading，记得处理 `loadFinally`。

## 特别容易写错的地方

### 1. 只传了 `systemId`，漏传 `systemClassCode`

这样容易让清零列表查不全或上下文不完整。

### 2. 组件接进去了，但父级 loading 没收口

结果就是 UI 一直转圈。

### 3. 想做“清零区”，却自己复制查询 + 刷新逻辑

这属于重复造轮子。

## 完成标准

满足以下条件才算完成：

- AI 已知道 `AutomaticReset` 该怎么直接接入
- AI 已知道关键 props 和 `loadFinally` 怎么用
- AI 不会因为只想做清零区而重写一整套清零列表

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 这次是否直接复用了 `AutomaticReset`
2. 传了哪些关键 props
3. 是否处理了 `loadFinally` 来收口父级 loading
