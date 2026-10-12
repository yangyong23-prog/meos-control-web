<template>
    <div
        class="wh100"
        style="background: #f1f4f6"
    >
        <SystemAndControl
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
            :space-map-props="{
                sortSpacesByClassCodes,
                findDefaultSpace,
                queryEquipsParams
            }"
            @class-code-equip-ids-map="getClassCodeEquipIdsMap"
            @object-id-and-info-codes="getObjectIdAndInfoCodes"
            @open-equipment="getOpenEquipment"
            @close-equipment="getCloseEquipment"
        >
            <template #right-content="{ mapSpaceList, currentMapSpaceId, handleEquipInit, handleEquipAllChange, handleEquipSelectChange, handleSpaceSelectChange }">
                <HeaderRight
                    v-show="viewMode === ViewModeEnum.MAP_VIEW"
                    :system-id="systemId"
                    :space-id="currentMapSpaceId"
                    :map-space-list="mapSpaceList"
                    @equip-init="handleEquipInit"
                    @equip-all-change="handleEquipAllChange"
                    @equip-select-change="handleEquipSelectChange"
                    @space-select-change="handleSpaceSelectChange"
                ></HeaderRight>
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
        </SystemAndControl>
    </div>
</template>

<script setup>
import SystemAndControl from '@/views/Common/SystemsAndControl/index.vue';
import AbnormalEventList from '../Common/SystemsAndControl/AbnormalEventList.vue';
import { useAbnormalEventHook } from '../Common/SystemsAndControl/hooks/useAbnormalEventHook';
import { ViewModeEnum } from '../Common/SystemsAndControl/types';
import HeaderRight from './HeaderRight.vue';
// import { sortBy } from 'lodash';

const RUNNING_MONITOR_TYPE = 'WATER_SUPPLY';
const SUBSCRIBE_TYPE = 'WATER_SUPPLY';
const MENU_CODE = 'WS';
const EQUIPS_CLASS_CODE_MAP = [
    { classCode: 'WSDHHP', order: 1, from: 'WSDH' }, //classCodeName: '生活热水水泵',
    { classCode: 'WSDHSU', order: 1, from: 'WSDH' }, //classCodeName: '生活热水供水机组',
    { classCode: 'WSDHAH', order: 2, from: 'WSDH' }, //classCodeName: '生活热水空气源热泵',
    { classCode: 'WSDHEB', order: 2, from: 'WSDH' }, // classCodeName: '生活热水电锅炉',
    { classCode: 'WSDHFB', order: 2, from: 'WSDH' }, //classCodeName: '生活热水燃油锅炉'
    { classCode: 'WSDHGB', order: 2, from: 'WSDH' }, // classCodeName: '生活热水燃气锅炉'
    { classCode: 'ACGEHE', order: 2, from: 'WSDH' }, // classCodeName: '换热器'
    { classCode: 'WSDHWT', order: 2, from: 'WSDH' }, // classCodeName: '生活热水储水箱'

    { classCode: 'WSDWPP', order: 1, from: 'WSGECN' }, // classCodeName: '生活给水水泵'
    { classCode: 'WSDWSU', order: 1, from: 'WSGECN' }, // classCodeName: '生活给水供水机组'
    { classCode: 'WSDWWT', order: 2, from: 'WSGECN' }, // classCodeName: '生活给水储水箱',

    { classCode: 'WSRWPP', order: 1, from: 'WSRW' }, // classCodeName: '中水水泵'
    { classCode: 'WSRWSU', order: 1, from: 'WSRW' }, // classCodeName: '中水供水机组'
    { classCode: 'WSRWTU', order: 1, from: 'WSRW' } // classCodeName: '中水处理机组'
];

const viewMode = ref(ViewModeEnum.GRAPH_CODE);
const systemId = ref('');
const systemClassCode = ref('');

const chartClassCodesData = ref({});
const spaceMapClassCodesData = ref({});
const classCodeEquipIdsMap = ref({});
const { equipmentIds, abnormalEventList, abnormalEventListLoadedTime, abnormalEventListLoading, abnormalEventListUpdateTime, getAbnormalEventList } = useAbnormalEventHook(
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
    console.log('objectIdAndInfoCodes', data);
};
const getOpenEquipment = data => {
    console.log('openEquipment', data);
};
const getCloseEquipment = data => {
    console.log('closeEquipment', data);
};
const queryEquipsParams = curSystem => {
    const { classCode, systemId: curSystemId } = curSystem || {};
    const fromSystemData = classCode ? EQUIPS_CLASS_CODE_MAP.filter(v => v.from === classCode) : EQUIPS_CLASS_CODE_MAP;
    const classCodes = fromSystemData.map(v => v.classCode);

    const takeValueLogic = {
        queryInSpaces: true,
        queryParam: {
            classCode: classCodes,
            relationTo: {
                graphCode: 'MechSubset',
                relCode: 'Sy2Eq',
                objFrom: [curSystemId]
            },
            withColumns: ['id', 'localName', 'classCode', 'floorId']
        },
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
</script>
<style lang="less" scoped></style>
