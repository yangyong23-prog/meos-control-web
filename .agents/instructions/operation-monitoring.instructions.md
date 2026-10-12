---
description: "在 meos-control-web 根应用中编写或修改设备/空间对象详情里的运行监控控制台时使用。适用于 OperationMonitoring、OperatingMonitoring、运行参数区、控制参数区、groupCodes、customControlComponent 与按 groupCode 的具名插槽覆写场景；要求 AI 优先复用 src/components/ObjectInfoComponents/OperationMonitoring/index.vue 及其默认映射，而不是自己重写 relInfoCodeGroupConfigs 遍历和整块控制台。"
name: "Operation Monitoring Guidelines"
---

# 运行监控控制台接入规范

在根应用处理设备或空间对象详情中的运行监控面板时，优先复用：

- `src/components/ObjectInfoComponents/OperationMonitoring/index.vue`
- `src/components/ObjectInfoComponents/OperationMonitoring/config.ts`

## 优先级

1. 先判断能否直接使用 `OperationMonitoring`
2. 再确定 `groupCodes` 展示范围与顺序
3. 再决定是否需要：
   - `customControlComponent`
   - `componentAttrs`
   - `#[groupCode]` 具名插槽覆写

## 标准接入前提

接入前应优先确认：

- 当前对象 `id`
- 当前对象 `selectObj`
- `runningMonitorType`
- 模板数据 `res`
- `res.relInfoCodeGroupConfigs` 是否存在

模板数据优先检查是否来自：

- `useObjectInfoDataByTemplateHook(selectObj)`

## 默认分组处理规则

以下分组优先使用现有默认映射：

- `equipParameterSet`
- `controlledParameterSet`
- `controlGroupOfTheSeriesConnectedChiller`
- `runningParameter`
- `techniqueParameter`
- `x1stTag3`
- `x1stTag5`

## 特殊分组处理规则

若默认映射没有目标分组，优先：

1. 只为该分组增加 `#[groupCode]` 插槽
2. 插槽内复用已有业务组件
3. 不要在页面里重写整套 `relInfoCodeGroupConfigs` 循环

## 控制模板规则

若控制类分组需要统一切换模板，优先：

- `customControlComponent`
- `componentAttrs`

不要把模板切换逻辑分散到多个分组判断中。

## 避免这些做法

- 明明只要运行参数区，却重写整块运行监控容器
- 明明只改一个特殊分组，却复制整个默认映射逻辑
- 不通过 `groupCodes` 控制顺序，导致运行监控面板顺序失控
- 把本该走 `customControlComponent` 的统一模板切换写成多个分支

## 修改后自检

- 是否优先复用了 `OperationMonitoring`
- 是否明确了 `groupCodes` 的范围与顺序
- 是否只对必要的分组使用插槽覆写
- 是否在控制模板切换场景优先使用 `customControlComponent`
