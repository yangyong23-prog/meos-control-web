---
name: system-info-system-params
description: '为 meos-control-web 根应用告诉 AI 如何正确接入 systemInfo/SystemParams 组件的技能。适用于系统参数展示、参数编辑、特殊信息编码处理、SystemParams 组件接入，并让 AI 优先通过 systemId、runningMonitorType、specialInfoCodes、handleSpecialSubmitFn、sseConsoleClient 完成接入，而不是自己重写参数网格和编辑弹层。触发词：SystemParams、RelInfoCodeConfigs、系统参数、参数编辑、specialInfoCodes、ControlForm、INFO_EXTEND_SET。'
argument-hint: '说明目标页面、systemId、runningMonitorType、是否存在特殊信息编码，以及是否需要 SSE 回填和父级刷新控制'
---

# SystemParams 接入技能

## 技能目标

在根应用 `src/` 中处理系统参数展示与编辑能力时，帮助代理优先复用现有 `SystemParams`，并正确完成：

- 组件接入
- 常用 props 选择与传递
- `loadFinally` 事件处理
- 参数区的最小使用方式

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里需要系统参数展示区”
- “参数项要支持点击编辑”
- “某些信息编码要走特殊处理”
- “参数修改后要支持回填刷新”
- “不要重写参数网格和编辑弹层”

默认优先检查：

- `src/components/systemInfo/SystemParams/index.vue`
- `src/components/systemInfo/SystemParams/RelInfoCodeConfigs.vue`

## 使用原则

### 1. 默认优先整体使用 `SystemParams`

如果页面要的是完整系统参数区体验，优先直接挂该组件。

### 2. 先传基础参数，再按场景补特殊能力

大多数场景先传：

- `systemId`
- `runningMonitorType`

然后再按需要补：

- `specialInfoCodes`
- `handleSpecialInfoCodes`
- `handleSpecialSubmitFn`
- `optionsObj`
- `maxAndMin`
- `sseConsoleClient`

### 3. `loadFinally` 和 `getTemplateInfoCodes` 是常见配套能力

- `loadFinally`：父级 loading 收口
- `getTemplateInfoCodes`：父级主动刷新参数区

## 组件入口

直接使用：

`src/components/systemInfo/SystemParams/index.vue`

## Props / 事件说明

### 高频 props

#### `systemId`

- 用途：当前系统 ID

#### `runningMonitorType`

- 用途：当前运行监控类型

#### `specialInfoCodes`

- 用途：声明需要走特殊编辑逻辑的信息编码列表

### 常用增强 props

#### `handleSpecialInfoCodes`

- 用途：生成特殊信息编码对应的表单项

#### `handleSpecialSubmitFn`

- 用途：接管特殊信息编码的提交逻辑

#### `optionsObj`

- 用途：给某些信息编码补充选项

#### `maxAndMin`

- 用途：给数值输入项补充上下限

#### `sseConsoleClient`

- 用途：接入 SSE 客户端，支持扩展设置回填

### 事件与暴露方法

#### `loadFinally`

- 用途：模板加载结束后通知父组件收口 loading

#### `getTemplateInfoCodes()`

- 用途：父级主动刷新系统参数模板
- 使用方式：通过 `ref` 调用

## 最小使用示例

### 1. 最小参数区接入

```vue
<SystemParams
    :system-id="systemId"
    :running-monitor-type="runningMonitorType"
    @load-finally="loadingSystemParams = false"
/>
```

适合场景：

- 只需要常规系统参数展示与编辑

### 2. 带特殊信息编码处理的接法

```vue
<SystemParams
    ref="systemParamsRef"
    :system-id="systemId"
    :running-monitor-type="runningMonitorType"
    :special-info-codes="specialInfoCodes"
    :handle-special-info-codes="handleSpecialInfoCodes"
    :handle-submit-fn="handleSpecialSubmitFn"
    :options-obj="optionsObj"
    :max-and-min="maxAndMin"
    :sse-console-client="sseConsoleClient"
    @load-finally="loadingSystemParams = false"
/>
```

适合场景：

- 存在特殊信息编码
- 需要自定义表单或提交逻辑
- 需要 SSE 回填能力

### 3. 父级主动刷新的典型方式

```js
const systemParamsRef = ref(null);

const refreshSystemParams = () => {
    systemParamsRef.value?.getTemplateInfoCodes();
};
```

适合场景：

- 特殊参数提交成功后主动刷新参数区
- 父级在某些操作后要求重新拉模板

## AI 最该知道的使用结论

### 1. 大多数页面先接 `SystemParams`，不要自己拼参数网格

已有组件已经包含参数展示和编辑入口。

### 2. 最基础的上下文是 `systemId` 和 `runningMonitorType`

大多数场景先把这两个传对。

### 3. 特殊信息编码场景再补 `specialInfoCodes` 与提交处理函数

不要一上来就把所有参数都当特殊参数处理。

### 4. 父级如有 loading 或主动刷新需求，记得配 `loadFinally` 和 `ref`

这是最常见的接法。

## AI 使用时的规则

### 1. 不要在页面里手写参数列表和编辑弹层

优先直接复用 `SystemParams`。

### 2. 不要把所有参数都按同一套特殊逻辑处理

只有 `specialInfoCodes` 命中的参数才需要额外接管。

### 3. 优先传业务配置，而不是搬内部实现细节

重点是：

- 系统 ID
- 运行监控类型
- 特殊参数配置
- 表单与提交扩展函数

## 特别容易写错的地方

### 1. 漏传 `systemId` 或 `runningMonitorType`

这样参数模板上下文通常不完整。

### 2. 想改参数区，却自己重写参数网格

这会脱离现有标准用法。

### 3. 需要特殊参数处理，却没有传 `specialInfoCodes` / `handleSpecialSubmitFn`

这样很容易把特殊参数误走默认链路。

### 4. 父级需要刷新，却没有留 `ref`

这样后续就没法方便地调用 `getTemplateInfoCodes()`。

## 完成标准

满足以下条件才算完成：

- AI 已知道 `SystemParams` 怎么直接接入
- AI 已知道常用 props、`loadFinally` 和 `getTemplateInfoCodes()` 怎么用
- AI 不会为了做系统参数区而重写参数网格和编辑弹层

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 是否直接复用了 `SystemParams`
2. 传了哪些关键 props
3. 是否处理了 `loadFinally` 和父级刷新 `ref`
4. 是否存在特殊信息编码处理逻辑
