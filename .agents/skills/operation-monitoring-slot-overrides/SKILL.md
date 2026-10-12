---
name: operation-monitoring-slot-overrides
description: '为 meos-control-web 根应用告诉 AI 如何在 OperationMonitoring 中按 groupCode 做具名插槽覆写的技能。适用于 coolingTowerFanInfo、electricallyOperatedOnOffWaterValveInfo、特殊业务组、关联设备式渲染、#[groupCode] 插槽等场景，帮助 AI 只改个别分组的展示，而不是重写整个运行监控容器。触发词：具名插槽、slot override、#[groupCode]、coolingTowerFanInfo、electricallyOperatedOnOffWaterValveInfo、关联设备分组、分组覆写。'
argument-hint: '说明要覆写哪个 groupCode、当前模板数据来源、希望替换成什么组件，以及是否需要保留其它分组的默认渲染'
---

# OperationMonitoring 分组插槽覆写技能

## 技能目标

在 `OperationMonitoring` 中处理少量特殊分组时，帮助代理优先使用具名插槽按 `groupCode` 覆写渲染，并正确完成：

- `#[groupCode]` 插槽接入
- 只替换个别分组
- 保留其它分组默认渲染
- 用项目现有组件承接特殊业务组

## 何时使用

当用户提出以下需求时，应优先使用本技能：

- “这个 groupCode 要换成另一种展示”
- “coolingTowerFanInfo 要显示关联设备卡片”
- “某个分组没有默认组件，但我不想重写整个运行监控”
- “只想覆写一个 groupCode，其他继续走默认组件”

默认优先检查：

- `src/components/ObjectInfoComponents/OperationMonitoring/index.vue`
- `src/views/ACAC/left/index.vue`
- `src/views/Common/SystemsAndControl/index.vue`
- `src/components/ObjectInfoComponents/AssociatedDevicesNew/index.vue`

## 使用原则

### 1. 只改个别分组时，优先具名插槽

插槽名称就是 `groupCode`：

- `#[GROUP_CODE_KEY_MAP.coolingTowerFanInfo]`
- `#[GROUP_CODE_KEY_MAP.electricallyOperatedOnOffWaterValveInfo]`

### 2. 插槽里优先复用现有业务组件

常见替换目标优先检查：

- `AssociatedDevicesNew`
- 现有对象详情组件
- 已有参数/关联信息组件

### 3. 不要把默认映射也搬进插槽重写

插槽只处理特殊组；已有默认组件映射的组，优先继续走容器默认逻辑。

## 最小使用示例

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

## AI 使用规则

- 只替换特殊分组时，不要动 `config.ts` 的默认映射
- 只覆写一个或少量组时，不要重写整个 `OperationMonitoring`
- 插槽内优先复用项目已有组件，不要凭空新造容器
- 保留 `groupCodes` 顺序控制，不要因为插槽覆写打乱顺序

## 容易写错的地方

- 把所有分组都塞进插槽，导致容器失去意义
- 忘了把被覆写分组写进 `groupCodes`
- 插槽里重复传一堆和容器一致的无关逻辑

## 完成标准

- AI 已知道如何按 `groupCode` 做最小插槽覆写
- AI 已知道特殊业务组优先用现有业务组件承接
- AI 不会因为覆写一个分组而重写整个运行监控容器
