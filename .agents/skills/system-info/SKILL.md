---
name: system-info
description: '为 meos-control-web 根应用告诉 AI 如何正确接入系统信息区域的技能。适用于在页面中组合 src/components/systemInfo 下的 SystemParams、SystemAutoSet、AutomaticReset、DisabilityAlarmReset，并让 AI 先选择合适子组件再完成接入，而不是自己重写系统信息面板。触发词：systemInfo、系统信息、系统设置抽屉、SystemParams、SystemAutoSet、AutomaticReset、DisabilityAlarmReset、系统参数、系统信息接入。'
argument-hint: '说明目标页面、systemId / runningMonitorType / systemClassCode，以及这次需要的是系统参数、一键手自动、累计运行时清零、失能报警复位，还是整块系统信息面板'
---

# meos-control-web 系统信息技能

## 技能目标

在根应用 `src/` 中处理系统信息区域时，帮助代理优先复用现有 `systemInfo` 组件组合，并正确完成：

- 先判断该用哪个 `system-info-*` 子技能
- 按现有组件组合接入系统信息区域
- 明确每块能力需要的关键 props
- 给出页面中的最小装配示例

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这里需要一个系统信息 / 系统设置面板”
- “系统参数、一键手自动、清零、报警复位要放在一起”
- “帮我接入现有 systemInfo 这套能力”
- “不要重写系统信息抽屉，尽量复用已有组件”
- “系统设置区域该怎么拼”

默认优先检查：

- `src/views/Common/SystemsAndControl/components/SystemSet.vue`
- `src/components/systemInfo/SystemParams/index.vue`
- `src/components/systemInfo/SystemAutoSet/SystemAutoSet.vue`
- `src/components/systemInfo/AutomaticReset/AutomaticReset.vue`
- `src/components/systemInfo/DisabilityAlarmReset/index.vue`

## 使用原则

### 1. 总技能先做分流，不直接替代子技能

如果需求只落在一个组件域，优先直接命中对应子技能：

- 系统参数 → `system-info-system-params`
- 一键手自动 → `system-info-system-auto-set`
- 累计运行时清零 → `system-info-automatic-reset`
- 失能报警复位 → `system-info-disability-alarm-reset`

### 2. 只有整块系统信息区域接入时，再使用本技能统筹

如果页面需要把多块能力一起接进去，再把本技能当作“装配指南”。

### 3. 默认优先组合现有组件，不要自己重写整块面板

也就是优先：

- `SystemParams`
- `SystemAutoSet`
- `AutomaticReset`
- `DisabilityAlarmReset`

## 子技能速查

### `system-info-system-params`

适合：系统参数展示、参数编辑、特殊信息编码处理。

### `system-info-system-auto-set`

适合：一键手动 / 一键自动入口、设备范围弹窗、失败列表。

### `system-info-automatic-reset`

适合：累计运行时分类清零。

### `system-info-disability-alarm-reset`

适合：失能报警项展示、单个/批量复位、SSE 联动刷新。

## 组件入口

常见整块系统信息区域由以下组件组成：

- `src/components/systemInfo/SystemParams/index.vue`
- `src/components/systemInfo/SystemAutoSet/SystemAutoSet.vue`
- `src/components/systemInfo/AutomaticReset/AutomaticReset.vue`
- `src/components/systemInfo/DisabilityAlarmReset/index.vue`

## 整体接入时最常用的参数

### 全局高频参数

- `systemId`：当前系统 ID
- `runningMonitorType`：当前运行监控类型
- `systemClassCode`：当前系统分类编码

### 按模块补充的参数

- `specialInfoCodes`：系统参数中的特殊信息编码
- `handleSpecialInfoCodes`：特殊参数表单生成逻辑
- `handleSubmitFn`：特殊参数提交逻辑
- `PERMISSION`：一键手自动权限点
- `disabilityAlarmReset`：失能报警配置组数据
- `currentSystem`：失能报警区域需要的系统基础信息
- `sseConsoleClient / sse`：需要实时联动时传入 SSE 客户端

## 最小装配示例

### 1. 把系统信息能力组合到一个面板里

```vue
<SystemParams
    :system-id="systemId"
    :running-monitor-type="runningMonitorType"
    @load-finally="loadingSystemParams = false"
/>

<SystemAutoSet
    :system-id="systemId"
    :running-monitor-type="runningMonitorType"
/>

<AutomaticReset
    :system-id="systemId"
    :system-class-code="systemClassCode"
    :running-monitor-type="runningMonitorType"
    @load-finally="loadingAutomaticReset = false"
/>

<DisabilityAlarmReset
    v-if="disabilityAlarmReset?.groupCode && currentSystem"
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

- 系统设置抽屉
- 系统详情侧边栏
- 需要把多块 systemInfo 能力集中展示

### 2. 先选子技能，再接入对应组件

```text
1. 先判断需求属于参数、手自动、清零、报警复位中的哪一类
2. 命中对应 system-info-* 子技能
3. 按子技能里的 props 与示例接入对应组件
4. 只有整块面板装配时，再回到本技能做组合
```

## AI 最该知道的使用结论

### 1. `system-info` 是装配入口，不是“大一统替代品”

优先先选子技能，再选组件。

### 2. 整块系统信息面板通常是四块能力的组合

最常见组合就是：

- `SystemParams`
- `SystemAutoSet`
- `AutomaticReset`
- `DisabilityAlarmReset`

### 3. 接入时优先传系统级上下文参数

最先确认：

- `systemId`
- `runningMonitorType`
- `systemClassCode`

### 4. 不要为了“接入”而复制整个系统信息面板

已有现成组合时，优先复用而不是重写。

## AI 使用时的规则

### 1. 单一需求优先命中单一子技能

不要只改一个模块，却一直抱着整份总技能不放。

### 2. 组合面板时优先保留模块边界

- `SystemParams` 负责参数区
- `SystemAutoSet` 负责一键手自动
- `AutomaticReset` 负责清零
- `DisabilityAlarmReset` 负责报警复位

### 3. 优先传业务上下文，不要传内部实现假设

重点是系统 ID、运行监控类型、权限、特殊参数配置，而不是内部 hook 细节。

## 特别容易写错的地方

### 1. 明明只改系统参数，却把整个 systemInfo 都重写了

这是最常见跑偏方式。

### 2. 只会写总览，不会继续往子技能分流

结果会让 AI 一次性背过多上下文，反而更容易写偏。

### 3. 组合接入时漏传系统级参数

最常漏的是：

- `systemId`
- `runningMonitorType`
- `systemClassCode`

### 4. 失能报警复位接入时漏掉 `systemData` 或 `sse`

这样很容易导致展示不完整或实时联动缺失。

## 完成标准

满足以下条件才算完成：

- AI 已知道什么时候用总技能、什么时候直接用子技能
- AI 已知道 systemInfo 区域通常由哪些组件组成
- AI 已知道整块装配时的关键 props 和示例
- AI 不会因为接入 systemInfo 就去重写一整套系统设置面板

## 给用户回复时建议说明

完成相关任务后，建议反馈：

1. 这次命中了哪个 `system-info-*` 子技能
2. 最终接入了哪些 systemInfo 组件
3. 传了哪些系统级关键参数
4. 是否是整块装配，还是只接入其中一块能力
