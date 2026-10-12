<template>
    <div class="water-supply-container">
        <Timetable
            v-if="isShowTimeTable"
            :system-type="SYSTEM_CLASSCODE_WSDH"
            :cur-console-type="curConsoleType"
            :current-system="currentSystem"
            :system-instance="systemInstance"
            :enable-console-types="enableConsoleTypes"
            @go-back="isShowTimeTable = false"
        >
        </Timetable>
        <SystemAndControl
            ref="systemInstance"
            v-model="systemId"
            v-model:view-mode="viewMode"
            v-model:system-class-code="systemClassCode"
            use-default-chart
            use-default-space-map
            hide-icon
            :menu-code="MENU_CODE"
            :subscribe-type="SUBSCRIBE_TYPE"
            :running-monitor-type="RUNNING_MONITOR_TYPE"
            :abnormal-event-list="abnormalEventList"
            :header-props="{
                showUpdateTime: false
            }"
            :no-system-cotrol-panel="systemClassCode !== SYSTEM_CLASSCODE_WSDH"
            :console-type-map="CONSOLE_TYPE_MAP"
            :sort-by-info-code="SORT_BY_INFOCODE"
            :show-control-intervention-time="false"
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
            :control-panel-props="{
                useComponent: USE_COMPONENT_BY_INFOCODE,
                groupKeyMap: GROUP_KEY_MAP,
                openTimeTable
            }"
            :system-params-set-props="{
                sseConsoleClient: sseSystemDetail
            }"
            :perating-monitoring-component-attrs="{
                reasonOptions: [
                    {
                        id: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation'),
                        name: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation')
                    },
                    {
                        id: i18n.global.t('meos_control_web.device_maintenance_or_commissioning'),
                        name: i18n.global.t('meos_control_web.device_maintenance_or_commissioning')
                    },
                    { id: i18n.global.t('meos_control_web.equipment_fault_isolation'), name: i18n.global.t('meos_control_web.equipment_fault_isolation') },
                    { id: i18n.global.t('meos_control_web.adjust_equipment_params'), name: i18n.global.t('meos_control_web.adjust_equipment_params') },
                    { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
                ]
            }"
            :system-auto-set-props="{ reasonType: 'input' }"
            @class-code-equip-ids-map="getClassCodeEquipIdsMap"
            @object-id-and-info-codes="getObjectIdAndInfoCodes"
            @system-detail-loaded="getSystemDetail"
            @control-list-loaded="getSystemDeatilAndContrilClassCodesMap"
            @after-chart-equips-loaded="afterChartEquipsLoaded"
        >
            <template
                #right-content="{
                    mapSpaceList,
                    currentMapSpaceId,
                    externalDataLoading,
                    isChartBaseSystem,
                    handleEquipInit,
                    handleEquipAllChange,
                    handleEquipSelectChange,
                    handleSpaceSelectChange
                }"
            >
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
                    ></HeaderRight>
                </template>
            </template>

            <template #abnormal="{ controlTabs }">
                <AbnormalEventList
                    :is-sub-panel="controlTabs?.length > 1"
                    :abnormal-event-list="abnormalEventList"
                    :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                    :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                    :abnormal-event-list-loading="abnormalEventListLoading"
                />
            </template>
            <template #extra-panes="{ selectObj, res }">
                <DrawerPane v-if="selectObj.classCode === WSDWSU" :label="i18n.global.t('meos_control_web.related_info')" name="equipServiceSpace">
                    <AngleViewByBuilding
                        :select-obj="selectObj"
                        :extra-equipment-group-codes="['relRunningParameter']"
                        :group-list="processedDataFn(res?.independenceRelEquipment)"
                    >
                    </AngleViewByBuilding>
                </DrawerPane>
            </template>
        </SystemAndControl>
    </div>
</template>

<script setup>
import SystemAndControl from '@/views/Common/SystemsAndControl/index.vue';
import AbnormalEventList from '@/views/Common/SystemsAndControl/AbnormalEventList.vue';
import { useAbnormalEventHook } from '@/views/Common/SystemsAndControl/hooks/useAbnormalEventHook';
import { CompTypeEnum, ViewModeEnum } from '@/views/Common/SystemsAndControl/types';
import DrawerPane from '@/components/common/CommonDrawer/DrawerPane.vue';
import HeaderRight from './components/HeaderRight.vue';
import {
    RUNNING_MONITOR_TYPE,
    SUBSCRIBE_TYPE,
    MENU_CODE,
    EQUIPS_CLASS_CODE_MAP,
    WSDWSU,
    SYSTEM_CLASSCODE_WSDH,
    CONSOLE_TYPE_MAP,
    SORT_BY_INFOCODE,
    GROUP_KEY_MAP,
    USE_COMPONENT_BY_INFOCODE
} from './constant/index';
import { filterEquipsClassCodes } from './utils/index';
import { useRelationChartSSEHook, useSystemDetailSSEHook } from './hooks/useSSEHook';
import AngleViewByBuilding from '@/components/ObjectInfoComponents/AssociatedDevicesNew/AngleViewByBuilding.vue';
import i18n from '@/localization';
import Timetable from './components/timetable/index.vue';
import emitter from '@/utils/bus';
import { CLOSE_CONTROL_FORM, OTHER_REASON } from '@/utils/globalVariables';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { codeDefineKey } from './injectKeys';

const { setRelationChartSSEClientOption } = useRelationChartSSEHook(SUBSCRIBE_TYPE);
const { sseClient: sseSystemDetail, setSystemDetailSSEClientOption } = useSystemDetailSSEHook(SUBSCRIBE_TYPE);
const viewMode = ref(ViewModeEnum.GRAPH_CODE);
const systemId = ref('');
const systemClassCode = ref('');
const systemInstance = ref(null);

const chartClassCodesData = ref({});
const spaceMapClassCodesData = ref({});
const classCodeEquipIdsMap = ref({});
const objectIdAndInfoCodes = ref({});
const systemDeatilAndContrilClassCodesMap = ref({});
const isShowTimeTable = ref(false);
const currentSystem = computed(() => {
    return systemInstance?.value?.currentSystem || {};
});
const curConsoleType = computed(() => {
    return systemInstance?.value?.currentConsoleTypeId || '';
});
const enableConsoleTypes = computed(() => {
    return Object.keys(CONSOLE_TYPE_MAP);
});
const { equipmentIds, abnormalEventList, abnormalEventListLoadedTime, abnormalEventListLoading, abnormalEventListUpdateTime } = useAbnormalEventHook(
    {
        subscribeType: SUBSCRIBE_TYPE,
        runningMonitorType: RUNNING_MONITOR_TYPE
    },
    systemId,
    classCodeEquipIdsMap
);

const getEquipsAndClassCodes = data => {
    if (!Object.keys(data).length) {
        return;
    }
    const arrIds = Object.values(data).flat();

    equipmentIds.value = [...new Set(arrIds)];
    classCodeEquipIdsMap.value = data;
};

// 关系图基准对象是设备，则获取关系图中的设备，不需要再按 classCode 过滤
const systemEquipsIds = computed(() => {
    const data = chartClassCodesData.value || {};
    if (!Object.keys(data).length) {
        return;
    }
    const arrIds = Object.values(data).flat();
    return [...new Set(arrIds)];
});

const processedDataFn = data => {
    if (!data) {
        return [];
    }
    if (data.relInfoCodeConfigs) {
        return [
            {
                ...data,
                groupName: i18n.global.t('meos_control_web.sub_devices_under_device'),
                equipments: data.relInfoCodeConfigs?.[0]?.dataValue || []
            }
        ];
    } else {
        return [];
    }
};

const finalClassCodeData = computed(() => {
    if (viewMode.value === ViewModeEnum.GRAPH_CODE) {
        return chartClassCodesData.value;
    } else {
        return spaceMapClassCodesData.value;
    }
});

watch(
    () => finalClassCodeData.value,
    cur => {
        getEquipsAndClassCodes(cur);
    }
);

const getClassCodeEquipIdsMap = (data, type) => {
    if (Object.keys(data).length === 0) {
        return;
    }

    const cloneData = structuredClone(data);
    //  关系图视角：获取系统实例+系统图中包括的设备的异常事件
    //  模型视角：根据左侧选择的设备范围，获取设备的异常事件；系统实例的异常事件
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
    console.log(data);

    if (data && data.id) {
        systemDeatilAndContrilClassCodesMap.value[data.classCode] = [data.id];
    } else {
        systemDeatilAndContrilClassCodesMap.value[SYSTEM_CLASSCODE_WSDH] = [systemId.value];
    }
};
const getSystemDeatilAndContrilClassCodesMap = data => {
    systemDeatilAndContrilClassCodesMap.value = {
        ...systemDeatilAndContrilClassCodesMap.value,
        ...data
    };
};
const openTimeTable = consoleType => {
    emitter.emit(CLOSE_CONTROL_FORM, { needClose: true });
    isShowTimeTable.value = true;
};
/**
 * 判断是否启用选择功能
 * 根据模态框数据的组件类型来决定是否允许选择
 * @param {Object} modalData - 模态框数据对象
 * @param {string} modalData.compType - 组件类型
 * @returns {boolean} 返回是否启用选择功能，如果是包节点类型则返回false，否则返回true
 */
const enableSelect = modalData => {
    if (modalData.compType === CompTypeEnum.PACK_NODE) {
        return false;
    }
    return true;
};

const codeDefine = computed(() => {
    return systemInstance?.value?.codeDefine || {};
});
const isRelationChartBaseSystem = curSystem => {
    const { objType, systemId: curSystemId } = curSystem || {};
    const isSystem = objType ? objType?.toUpperCase() === 'SYSTEM' : undefined;
    const isStartsWithSY = curSystemId?.toUpperCase()?.startsWith('SY');
    return isSystem ?? isStartsWithSY;
};

const afterChartEquipsLoaded = async data => {
    const { systemInfo, equipsClassCodes } = data || {};
    const { systemId: curSystemId } = systemInfo || {};
    if (!isRelationChartBaseSystem(systemInfo)) {
        // 关系图基准对象是设备，则首先获取关系图中的设备，再根据classCode请求模型图空间数据
        const finalClassCodes = filterEquipsClassCodes(equipsClassCodes);
        await systemInstance?.value?.querySpaceList?.(curSystemId, systemInfo, finalClassCodes);
    }
};
const queryEquipsParams = (curSystem, equipsClassCodes) => {
    const { classCode, systemId: curSystemId } = curSystem || {};

    const fromSystemData = classCode ? EQUIPS_CLASS_CODE_MAP.filter(v => v.from === classCode) : EQUIPS_CLASS_CODE_MAP;
    const classCodes = fromSystemData.map(v => v.classCode);
    const queryParam = {
        withColumns: ['id', 'localName', 'classCode', 'floorId']
    };
    if (isRelationChartBaseSystem(curSystem)) {
        // 关系图基准对象是系统，则根据系统实例查询系统下的设备,再找到系统的空间
        queryParam.classCode = classCodes;
        queryParam.relationTo = {
            graphCode: 'MechSubset',
            relCode: 'Sy2Eq',
            objFrom: [curSystemId]
        };
    } else {
        // 关系图基准对象是设备，则获取关系图中的设备，,再找到系统的空间
        const arrIds = Object.values(equipsClassCodes || {}).flat();
        queryParam.id = [...new Set(arrIds)];
    }

    const takeValueLogic = {
        queryInSpaces: true,
        queryParam: queryParam,
        queryInSpaceAdditionalWithColumns: ['outline', 'floorId']
    };
    const params = {
        runningMonitorType: RUNNING_MONITOR_TYPE,
        takeValueLogic
    };
    return params;
};
const sortSpacesByClassCodes = ({ spaces, spaceIdMapClassCodes }) => {
    const sortedClassCodes = EQUIPS_CLASS_CODE_MAP.toSorted((a, b) => {
        return a.order - b.order;
    });
    const newSpaces = spaces.map(space => {
        const spaceId = space.id;
        // 一个空间可能对应多个设备，优先取空间中设备排序在前的当作该空间的优先级
        const classCodes = [...(spaceIdMapClassCodes[spaceId] ?? [])];
        const spaceOrder = sortedClassCodes.find(item => classCodes.includes(item?.classCode))?.order ?? Number.MAX_SAFE_INTEGER;
        return { ...space, spaceOrder };
    });
    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });

    const result = newSpaces.toSorted((a, b) => {
        // 当同一类优先级有多个空间时，按空间名称升序排列
        if (a.spaceOrder === b.spaceOrder) {
            const aName = a.localName || '';
            const bName = b.localName || '';
            return collator.compare(aName, bName);
        }
        return a.spaceOrder - b.spaceOrder;
    });
    // const result = sortBy(newSpaces, ['spaceOrder', 'localName']);
    return result;
};
// 默认选中排序后的第一个空间
const findDefaultSpace = spaces => {
    return spaces[0];
};
// 监听 chartClassCodesData 和 objectIdAndInfoCodes 的变化，更新 SSE 客户端选项
useWatchWithCleanup(
    () => [chartClassCodesData.value, objectIdAndInfoCodes.value],
    () => {
        setRelationChartSSEClientOption(chartClassCodesData.value, objectIdAndInfoCodes.value);
    }
);
useWatchWithCleanup(
    () => systemDeatilAndContrilClassCodesMap.value,
    () => {
        setSystemDetailSSEClientOption(systemDeatilAndContrilClassCodesMap.value);
    },
    {
        deep: true
    }
);

provide(codeDefineKey, codeDefine);
</script>
<style lang="less" scoped>
.water-supply-container {
    width: 100%;
    height: 100%;
    background: #f1f4f6;
    :deep(.relation-chart-com) {
        .tools-container {
            z-index: 52;
        }
    }
}
</style>
