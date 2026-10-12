---
name: systems-and-control
description: 为 meos-control-web 根应用告诉 AI 如何正确对接 SystemsAndControl 组件的技能。适用于新增系统监控页面、接入关系图与空间地图双视图、集成异常事件与 SSE 实时推送、配置控制面板与系统参数设置，帮助 AI 优先复用 src/views/Common/SystemsAndControl/index.vue 及其配套 hooks，而不是自己重写系统监控框架。触发词：SystemsAndControl、SystemAndControl、系统监控页面、新系统接入、关系图、空间地图、异常事件、控制面板、SSE 订阅、useAbnormalEventHook、useRelationChartSSEHook、useSystemDetailSSEHook、subscribeType、runningMonitorType、menuCode。
---

# SystemsAndControl 组件接入指南

## 组件概述

`SystemsAndControl` 是系统监测与控制的核心容器组件，路径 `src/views/Common/SystemsAndControl/index.vue`。集成关系图、3D 空间地图、控制面板、异常事件等模块，支持 `GRAPH_CODE`（关系图）和 `MAP_VIEW`（空间地图）两种视图模式。

## 接入前必读

1. **先确认系统类型**：每个系统页面对应一个 `systemClassCode`（如 `ACAC`、`ACAI`、`WSDW`）
2. **准备常量文件**：新页面需在 `constant/` 或 `variables.ts` 中定义 `MENU_CODE`、`SUBSCRIBE_TYPE`、`RUNNING_MONITOR_TYPE`、`EQUIPS_CLASS_CODE_MAP`
3. **准备 SSE Hook**：在 `hooks/useSSEHook.ts` 中创建 `useRelationChartSSEHook` 和 `useSystemDetailSSEHook`
4. **完整 API 参考**：见 [reference.md](reference.md)

## 接入模式一：无控制面板（最小接入）

适用于只需关系图 + 空间地图 + 异常事件的场景（参考 WaterSupply）。

### 目录结构

```
src/views/YourSystem/
├── index.vue                # 主页面
├── constant/index.ts        # 常量定义
├── hooks/useSSEHook.ts      # SSE Hook
├── utils/index.ts           # 工具函数
└── components/
    └── HeaderRight.vue      # 右侧头部（空间地图视图的设备筛选）
```

### 步骤 1：定义常量

```ts
// constant/index.ts
export const MENU_CODE = 'yourMenuCode';
export const SUBSCRIBE_TYPE = 'yourSubscribeType';
export const RUNNING_MONITOR_TYPE = 'yourRunningMonitorType';
export const EQUIPS_CLASS_CODE_MAP = [
    { classCode: 'XXXX', order: 1 },
    { classCode: 'YYYY', order: 2 }
];
```

### 步骤 2：创建 SSE Hook

```ts
// hooks/useSSEHook.ts
import { useSSEHook } from '@/hooks/useSSEHook';

export const useRelationChartSSEHook = (subscribeType) => {
    const { sseClient, setSSEClientOption } = useSSEHook(subscribeType);
    const setRelationChartSSEClientOption = (classCodesData, objectIdAndInfoCodes) => {
        setSSEClientOption(classCodesData, objectIdAndInfoCodes);
    };
    return { setRelationChartSSEClientOption };
};

export const useSystemDetailSSEHook = (subscribeType) => {
    const { sseClient, setSSEClientOption } = useSSEHook(subscribeType);
    const setSystemDetailSSEClientOption = (data) => {
        setSSEClientOption(data);
    };
    return { sseClient, setSystemDetailSSEClientOption };
};
```

### 步骤 3：主页面接入模板

```vue
<template>
    <div class="your-system-container">
        <SystemAndControl
            ref="systemInstance"
            v-model="systemId"
            v-model:view-mode="viewMode"
            v-model:system-class-code="systemClassCode"
            use-default-chart
            use-default-space-map
            hide-icon
            no-system-cotrol-panel
            :menu-code="MENU_CODE"
            :subscribe-type="SUBSCRIBE_TYPE"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :abnormal-event-list="abnormalEventList"
            :chart-props="{
                beforeClickNode,
                canHoverGroupSelect: true,
                enableSelect
            }"
            :space-map-props="{
                sortSpacesByClassCodes,
                findDefaultSpace,
                queryEquipsParams,
                querySpacesByChartObjType: true
            }"
            @class-code-equip-ids-map="getClassCodeEquipIdsMap"
            @object-id-and-info-codes="getObjectIdAndInfoCodes"
            @system-detail-loaded="getSystemDetail"
            @after-chart-equips-loaded="afterChartEquipsLoaded"
        >
            <!-- 右侧头部：空间地图设备筛选 -->
            <template #right-content="{ mapSpaceList, currentMapSpaceId, externalDataLoading, isChartBaseSystem, handleEquipInit, handleEquipAllChange, handleEquipSelectChange, handleSpaceSelectChange }">
                <template v-if="!externalDataLoading">
                    <HeaderRight
                        v-show="viewMode === ViewModeEnum.MAP_VIEW"
                        :system-id="systemId"
                        :space-id="currentMapSpaceId"
                        :map-space-list="mapSpaceList"
                        :system-equips-ids="systemEquipsIds"
                        :is-chart-base-system="isChartBaseSystem"
                        @equip-init="handleEquipInit"
                        @equip-all-change="handleEquipAllChange"
                        @equip-select-change="handleEquipSelectChange"
                        @space-select-change="handleSpaceSelectChange"
                    />
                </template>
            </template>

            <!-- 异常事件 -->
            <template #abnormal="{ controlTabs }">
                <AbnormalEventList
                    :is-sub-panel="controlTabs?.length > 1"
                    :abnormal-event-list="abnormalEventList"
                    :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                    :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                    :abnormal-event-list-loading="abnormalEventListLoading"
                />
            </template>
        </SystemAndControl>
    </div>
</template>

<script setup>
import SystemAndControl from '@/views/Common/SystemsAndControl/index.vue';
import AbnormalEventList from '@/views/Common/SystemsAndControl/AbnormalEventList.vue';
import { useAbnormalEventHook } from '@/views/Common/SystemsAndControl/hooks/useAbnormalEventHook';
import { CompTypeEnum, ViewModeEnum } from '@/views/Common/SystemsAndControl/types';
import HeaderRight from './components/HeaderRight.vue';
import { RUNNING_MONITOR_TYPE, SUBSCRIBE_TYPE, MENU_CODE, EQUIPS_CLASS_CODE_MAP } from './constant/index';
import { useRelationChartSSEHook, useSystemDetailSSEHook } from './hooks/useSSEHook';

// === 1. 基础状态 ===
const viewMode = ref(ViewModeEnum.GRAPH_CODE);
const systemId = ref('');
const systemClassCode = ref('');
const systemInstance = ref(null);

// === 2. 设备分类数据（双视图各维护一份） ===
const chartClassCodesData = ref({});
const spaceMapClassCodesData = ref({});
const classCodeEquipIdsMap = ref({});
const objectIdAndInfoCodes = ref({});

// === 3. SSE Hook ===
const { setRelationChartSSEClientOption } = useRelationChartSSEHook(SUBSCRIBE_TYPE);
const { setSystemDetailSSEClientOption } = useSystemDetailSSEHook(SUBSCRIBE_TYPE);

// === 4. 异常事件 ===
const { equipmentIds, abnormalEventList, abnormalEventListLoadedTime, abnormalEventListLoading, abnormalEventListUpdateTime } =
    useAbnormalEventHook({ subscribeType: SUBSCRIBE_TYPE, runningMonitorType: RUNNING_MONITOR_TYPE }, systemId, classCodeEquipIdsMap);

// === 5. 视图模式切换时更新设备范围 ===
const finalClassCodeData = computed(() =>
    viewMode.value === ViewModeEnum.GRAPH_CODE ? chartClassCodesData.value : spaceMapClassCodesData.value
);

watch(() => finalClassCodeData.value, cur => {
    if (!Object.keys(cur).length) return;
    equipmentIds.value = [...new Set(Object.values(cur).flat())];
    classCodeEquipIdsMap.value = cur;
});

// === 6. 事件处理函数（必须实现） ===
const getClassCodeEquipIdsMap = (data, type) => {
    if (!Object.keys(data).length) return;
    const cloneData = structuredClone(data);
    if (systemClassCode.value && systemId.value && !cloneData[systemClassCode.value]) {
        cloneData[systemClassCode.value] = [systemId.value];
    }
    if (type === ViewModeEnum.MAP_VIEW) {
        spaceMapClassCodesData.value = cloneData;
    } else {
        chartClassCodesData.value = cloneData;
    }
};

const getObjectIdAndInfoCodes = data => {
    const cloneData = structuredClone(data || {});
    for (const key in cloneData) {
        if (!Object.hasOwn(cloneData, key)) continue;
        cloneData[key].push('rcRunStatus');
    }
    objectIdAndInfoCodes.value = { ...cloneData, ...objectIdAndInfoCodes.value };
};

const getSystemDetail = data => {
    if (data?.id) setSystemDetailSSEClientOption({ [data.classCode]: [data.id] });
};

// === 7. 关系图回调 ===
const enableSelect = modalData => modalData.compType !== CompTypeEnum.PACK_NODE;

const isRelationChartBaseSystem = curSystem => {
    const { objType, systemId: curSystemId } = curSystem || {};
    const isSystem = objType ? objType?.toUpperCase() === 'SYSTEM' : undefined;
    return isSystem ?? curSystemId?.toUpperCase()?.startsWith('SY');
};

const afterChartEquipsLoaded = async data => {
    const { systemInfo, equipsClassCodes } = data || {};
    if (!isRelationChartBaseSystem(systemInfo)) {
        await systemInstance?.value?.querySpaceList?.(systemInfo?.systemId, systemInfo, equipsClassCodes);
    }
};

// === 8. 空间地图配置 ===
const systemEquipsIds = computed(() => {
    const data = chartClassCodesData.value || {};
    if (!Object.keys(data).length) return;
    return [...new Set(Object.values(data).flat())];
});

const queryEquipsParams = (curSystem, equipsClassCodes) => {
    const { classCode, systemId: curSystemId } = curSystem || {};
    const classCodes = EQUIPS_CLASS_CODE_MAP.map(v => v.classCode);
    const queryParam = { withColumns: ['id', 'localName', 'classCode', 'floorId'] };

    if (isRelationChartBaseSystem(curSystem)) {
        queryParam.classCode = classCodes;
        queryParam.relationTo = { graphCode: 'MechSubset', relCode: 'Sy2Eq', objFrom: [curSystemId] };
    } else {
        queryParam.id = [...new Set(Object.values(equipsClassCodes || {}).flat())];
    }
    return {
        runningMonitorType: RUNNING_MONITOR_TYPE,
        takeValueLogic: { queryInSpaces: true, queryParam, queryInSpaceAdditionalWithColumns: ['outline', 'floorId'] }
    };
};

const sortSpacesByClassCodes = ({ spaces, spaceIdMapClassCodes }) => {
    const sortedClassCodes = EQUIPS_CLASS_CODE_MAP.toSorted((a, b) => a.order - b.order);
    const newSpaces = spaces.map(space => ({
        ...space,
        spaceOrder: sortedClassCodes.find(item => [...(spaceIdMapClassCodes[space.id] ?? [])].includes(item?.classCode))?.order ?? Number.MAX_SAFE_INTEGER
    }));
    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
    return newSpaces.toSorted((a, b) =>
        a.spaceOrder === b.spaceOrder ? collator.compare(a.localName || '', b.localName || '') : a.spaceOrder - b.spaceOrder
    );
};

const findDefaultSpace = spaces => spaces[0];

// === 9. SSE 监听 ===
watch(() => [chartClassCodesData.value, objectIdAndInfoCodes.value], () => {
    setRelationChartSSEClientOption(chartClassCodesData.value, objectIdAndInfoCodes.value);
});
</script>

<style lang="less" scoped>
.your-system-container {
    width: 100%;
    height: 100%;
    background: #f1f4f6;
}
</style>
```

## 接入模式二：完整功能（含控制面板）

在模式一基础上增加以下配置（参考 ACAI）：

### 额外常量

```ts
// variables.ts
export const SYSTEM_CLASSCODE = 'ACAI';
export const CONSOLE_TYPE_MAP = {
    COOL_SUPPLY: { id: 'COOL_SUPPLY', name: '供冷', timeTableName: '供冷时间表', code: [...], show: false },
    HEAT_SUPPLY: { id: 'HEAT_SUPPLY', name: '供热', timeTableName: '供热时间表', code: [...], show: false },
    AIR_TERMINAL_ZONE: { id: 'AIR_TERMINAL_ZONE', name: '空调分区', code: [...], show: true }
};
export const GROUP_KEY_MAP = { /* 分组key映射 */ };
export const USE_COMPONENT_BY_INFOCODE = { /* 信息编码→控制组件映射 */ };
export const SORT_BY_INFOCODE = { /* 信息编码排序 */ };
```

### 额外 Props

```vue
<SystemAndControl
    <!-- ...基础 props 同上，但去掉 no-system-cotrol-panel -->
    has-indoor-temperature
    has-outdoor-temperature
    has-notify
    :system-class-code="SYSTEM_CLASSCODE"
    :console-type-map="CONSOLE_TYPE_MAP"
    :sort-by-info-code="SORT_BY_INFOCODE"
    :custom-control-params="customControlParams"
    :handle-special-info-codes-data-sources-fn="handleSpecialInfoCodesDataSourcesFn"
    :control-panel-props="{
        useComponent: USE_COMPONENT_BY_INFOCODE,
        groupKeyMap: GROUP_KEY_MAP,
        openTimeTable
    }"
    :system-params-set-props="{
        sseConsoleClient: sseSystemDetail,
        maxAndMin: { coolWaterReturnTempSet: { max: 50, min: 0 } },
        optionsObj: { coolWaterReturnTempSet: OPTIONS_ONE },
        specialInfoCodes: ['ZDYairConditioningCapacitySet', 'runModeSet'],
        specialInfoCodeKey: { ZDYairConditioningCapacitySet: 'airConditioningCapacitySet' }
    }"
    :run-param-key="GROUP_CODE_KEY_MAP.x1stTag3"
    :disability-alarm-reset-key="GROUP_CODE_KEY_MAP.disabilityAlarmReset"
    @control-list-loaded="getSystemDeatilAndContrilClassCodesMap"
/>
```

### 额外事件处理

```ts
// 控制列表加载完成 → 更新 SSE 订阅
const systemDeatilAndContrilClassCodesMap = ref({});

const getSystemDetail = data => {
    if (data?.id) {
        systemDeatilAndContrilClassCodesMap.value[data.classCode] = [data.id];
    } else {
        systemDeatilAndContrilClassCodesMap.value[SYSTEM_CLASSCODE] = [systemId.value];
    }
};

const getSystemDeatilAndContrilClassCodesMap = data => {
    systemDeatilAndContrilClassCodesMap.value = { ...systemDeatilAndContrilClassCodesMap.value, ...data };
};

// SSE 需要监听合并后的映射
useWatchWithCleanup(() => systemDeatilAndContrilClassCodesMap.value, () => {
    setSystemDetailSSEClientOption(systemDeatilAndContrilClassCodesMap.value);
}, { deep: true });
```

## 高级扩展

### 动态控制台切换（customControlParams）

当控制台页签需要根据 IOT 数据动态显隐时使用：

```ts
const customControlParams = consoleTypesData => {
    useWatchWithCleanup(
        () => getIotData(systemId.value, 'runModeSet').dataValue,
        val => {
            const data = systemInstance.value?.consoleTypesData;
            if (!Array.isArray(data)) return;
            data.forEach(item => {
                if (item.id === 'COOL_SUPPLY') item.show = val === '1';
                if (item.id === 'HEAT_SUPPLY') item.show = val === '2';
            });
        }
    );
};
```

### 自定义系统树请求（getDataFn / customFetchMenuConfigFn）

当系统列表数据源非标准接口时：

```ts
:get-data-fn="() => customApi.getSystemList()"
:custom-fetch-menu-config-fn="(data) => ({
    systemList: data.filter(v => v.type === 'target'),
    currentSystem: data[0]
})"
```

### 自定义页签显隐（customVisibilityRulesFn）

控制运行控制面板中哪些 tab 可见：

```ts
:custom-visibility-rules-fn="(tabs, status) => {
    if (status.value === '1') {
        tabs.value = tabs.value.filter(t => t.id !== 'HEAT_SUPPLY');
    }
}"
```

### 设备抽屉额外标签页（extra-panes slot）

在设备详情抽屉中添加自定义标签页：

```vue
<template #extra-panes="{ selectObj, res }">
    <DrawerPane v-if="selectObj.classCode === 'XXXX'" label="关联信息" name="relInfo">
        <YourCustomComponent :data="res?.independenceRelEquipment" />
    </DrawerPane>
</template>
```

## 关键数据流

```
关系图加载完成
  → @class-code-equip-ids-map → chartClassCodesData / spaceMapClassCodesData
  → finalClassCodeData(computed) → classCodeEquipIdsMap
  → useAbnormalEventHook 自动查询异常事件
  → setRelationChartSSEClientOption 更新 SSE 订阅

系统详情加载
  → @system-detail-loaded → setSystemDetailSSEClientOption

控制列表加载（完整模式）
  → @control-list-loaded → systemDeatilAndContrilClassCodesMap
  → setSystemDetailSSEClientOption（合并系统详情 + 控制列表的 classCode 映射）
```

## 常见坑

1. **`no-system-cotrol-panel` 拼写**：注意是 `cotrol` 不是 `control`，这是组件原始拼写
2. **`useWatchWithCleanup` vs `watch`**：完整模式下 SSE 监听必须用 `useWatchWithCleanup` 确保卸载时清理
3. **双视图数据隔离**：`chartClassCodesData` 和 `spaceMapClassCodesData` 必须分开维护，通过 `finalClassCodeData` computed 切换
4. **系统实例补充**：`getClassCodeEquipIdsMap` 中需检查并补充 `systemClassCode → systemId` 映射，否则系统实例的异常事件会丢失
5. **`isRelationChartBaseSystem` 判断**：关系图基准对象可能是系统或设备，需判断后决定是否手动调用 `querySpaceList`

## 完整 API 参考

详见 [reference.md](reference.md)
