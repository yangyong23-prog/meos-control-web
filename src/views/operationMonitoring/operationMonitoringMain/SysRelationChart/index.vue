<template>
    <div class="relation-chart-warp xxx-relation-chart-mark">
        <RelationChart
            v-bind="$attrs"
            ref="relationChartComponent"
            :chart-attr="chartAttr"
            :is-s-e="majorCode === 'SE'"
            :running-monitor-type="runningMonitorType"
            :need-line-flow="needLineFlow"
            :cur-system-id="selectedSystemObj?.systemId"
            @click-node="clickNode"
            @clear-click-node="clearClickNode"
            @switch-relation-chart="switchRelationChart"
            @before-load-chart="beforeLoadChart"
            @after-load-chart="afterLoadChart"
        >
            <Legend
                v-if="majorCode === 'SE'"
                :show-se-switching-state="true"
                :equipment-data="seLengendData.equipmentData"
                :switch-data="seLengendData.switchData"
                :pipeline-data="[]"
            />
            <Legend v-else :equipment-data="equipmentData" :switch-data="switchLegendData" :pipeline-data="pipelineLegendData" />
        </RelationChart>
        <div v-if="selectedSystemObj?.isSub && isCoolHotSystemCode" class="back-wrap">
            <div class="back-label" @click="backToGrapg">
                <IconMeriComponentChevronLeft :size="16" color="#8B949E"></IconMeriComponentChevronLeft>{{ i18n.global.t('meos_control_web.back_to_main_view') }}
            </div>
            <div class="split-line"></div>
            <div class="sub-graph-name">{{ selectedSystemObj.localName }}</div>
        </div>
    </div>
</template>
<script setup>
import DockSingleton from '@/hooks/responsiveDock';
import { IconMeriComponentChevronLeft } from 'meri-icon';
import switchOpen from '@/assets/images/operateMonitoring/switch-open.png';
import switchClose from '@/assets/images/operateMonitoring/switch-close.png';
import switchNoData from '@/assets/images/operateMonitoring/switch-nodata.png';
import switchNoIot from '@/assets/images/operateMonitoring/switch-no-iot.png';
import RelationChart from '@/components/RelationChart/index.vue';
import Legend from '../components/legend.vue';

import baseStore from '@/store/baseStore';
import emitter from '@/utils/bus';
import { setRunningMonitorType } from '@/views/operationMonitoring/use-utils';
import { sysChartClassCodeEquipIdMapKey, isAbnormalIdsAllLoadedKey } from '../../hooks/useCommonConfig';
import i18n from '@/localization';

const { getIotData, clearOneObjectInfo } = DockSingleton.getInstance();
const relationChartComponent = inject('relationChartComponent');

const selectedSystemObj = inject('selectedSystemObj');
const abnormalEventList = inject('abnormalEventList');
const noRelationChartData = inject('noRelationChartData');

const showEquipmentFun = inject('showEquipmentFun'); // 打开测弹窗
const closeEquipmentiInfo = inject('closeEquipmentiInfo'); // 关闭测弹窗

const majorCode = inject('majorCode');
const equipmentNodeVosList = inject('equipmentNodeVosList');

const runningMonitorType = inject('runningMonitorType');
const sysChartClassCodeEquipIdMap = inject(sysChartClassCodeEquipIdMapKey);
const isAbnormalIdsAllLoaded = inject(isAbnormalIdsAllLoadedKey);

const lastSelectedSystemObj = ref();

const seLengendData = {
    equipmentData: [
        {
            id: 'abnormal',
            name: i18n.global.t('meos_control_web.abnormal'),
            bgColor: '#ffffff',
            color: '#F55047'
        },
        {
            id: 'offline',
            name: i18n.global.t('meos_control_web.offline'),
            bgColor: '#ffffff',
            color: '#C4C9CF'
        }
    ],
    switchData: []
};

const isCoolHotSystemCode = computed(() => {
    return majorCode?.value === 'ACCI';
});

const triggerClose = () => {
    relationChartComponent.value?.removeChoose();
};

onMounted(() => {
    emitter.on('monitorCloseEquipmentiInfo', triggerClose);
});

onUnmounted(() => {
    emitter.off('monitorCloseEquipmentiInfo', triggerClose);
});

const equipmentData = [
    { id: 'abnormal', name: i18n.global.t('meos_control_web.abnormal'), bgColor: '#ffffff', color: '#F55047' },
    { id: 'mismatch', name: i18n.global.t('meos_control_web.control_feedback_mismatch'), bgColor: '#ffffff', color: '#FFB800' },
    { id: 'power_outage', name: i18n.global.t('meos_control_web.power_off'), bgColor: '#ffffff', color: '#B5A777' },
    { id: 'offline', name: i18n.global.t('meos_control_web.offline'), bgColor: '#ffffff', color: '#C4C9CF' }
];

const chartAttr = ref(null);

const needLineFlow = computed(() => {
    return majorCode?.value === 'ACCI' && !selectedSystemObj?.value?.isSub;
});

watch(
    selectedSystemObj,
    () => {
        if (!selectedSystemObj.value) {
            chartAttr.value = null;
        } else {
            // 若切换的是主系统图
            if (!selectedSystemObj.value.isSub) {
                lastSelectedSystemObj.value = null;
            }
            baseStore().isCoolHotSystem = majorCode?.value === 'ACCI';

            if (selectedSystemObj.value.diagramBaseObject === 'project') {
                chartAttr.value = {
                    systemObjectId: baseStore().projectId,
                    classCode: 'project',
                    graphTypeCode: selectedSystemObj.value.graphTypeCode
                    // imageOrProductName: selectedSystemObj.value.imageOrProductName
                };
            } else {
                chartAttr.value = {
                    systemObjectId: selectedSystemObj.value.systemId,
                    classCode: selectedSystemObj.value.classCode,
                    graphTypeCode: selectedSystemObj.value.graphTypeCode
                    // imageOrProductName: selectedSystemObj.value.imageOrProductName
                };
            }
        }
    },
    {
        immediate: true
    }
);

const clickNode = data => {
    const postData = {
        ...data,
        systemObjectId: chartAttr.value.systemObjectId,
        systemClassCode: chartAttr.value.classCode
    };
    showEquipmentFun(postData);
};

const clearClickNode = () => {
    closeEquipmentiInfo();
};

// 从图中跳转
const switchRelationChart = data => {
    if (!data) return;
    setRunningMonitorType(data.interactiveObjectCode);
    if (!lastSelectedSystemObj.value) {
        lastSelectedSystemObj.value = unref(selectedSystemObj.value);
    }
    selectedSystemObj.value = {
        // 返回用辅助字段
        isSub: true,
        // 用主图字段，控制台显隐使用
        isControl: lastSelectedSystemObj.value?.isControl,
        systemId: data.systemObjectId,
        classCode: data.interactiveObjectCode,
        originGraphTypeCode: lastSelectedSystemObj.value?.graphTypeCode,
        graphTypeCode: data.graphTypeCode,
        // 如果没有jumpTarget，则用主图上字段
        imageOrProductName: data.jumpTarget || lastSelectedSystemObj.value?.imageOrProductName,
        localName: data.graphName,
        key: data.systemObjectId
    };
};

const backToGrapg = () => {
    if (lastSelectedSystemObj.value) {
        selectedSystemObj.value = unref(lastSelectedSystemObj.value);
        lastSelectedSystemObj.value = null;
    }
};

const allSwitchData = [
    {
        id: 'noIot',
        name: i18n.global.t('meos_control_web.no_iot_status'),
        imgSrc: switchNoIot
    },
    {
        id: 'statusOpen',
        name: i18n.global.t('meos_control_web.on'),
        imgSrc: switchOpen
    },
    {
        id: 'statusClose',
        name: i18n.global.t('meos_control_web.off'),
        imgSrc: switchClose
    },
    {
        id: 'noData',
        name: i18n.global.t('meos_control_web.no_data1'),
        imgSrc: switchNoData
    }
];
const omitNoIotSwitchData = allSwitchData.filter(item => item.name !== i18n.global.t('meos_control_web.no_iot_status'));
const switchLegendData = ref();
const pipelineLegendData = ref([]);
onUnmounted(() => {
    pipelineLegendData.value = [];
});

const getEquipOpenCloseStatus = ({ equipId, filterStatus, parentId, parentFilterStatus, classCode }) => {
    const runStatusInfoCodeObj = getIotData(equipId, filterStatus);
    let runStatusDataValue = runStatusInfoCodeObj?.dataValue ?? '';
    if (classCode === 'ACCCAH' && parentId && parentFilterStatus && !runStatusDataValue) {
        const parentRunStatusInfoCodeObj = getIotData(parentId, parentFilterStatus);
        runStatusDataValue = parentRunStatusInfoCodeObj?.dataValue ?? '';
    }

    // 无数据
    if (filterStatus && !runStatusDataValue) {
        return 'noData';
    }

    // 关闭
    if (['0', '2'].includes(runStatusDataValue)) {
        return 'close';
    } else if (runStatusDataValue === '1') {
        // 开启
        return 'open';
    }
};

const beforeLoadChart = () => {
    closeEquipmentiInfo();
};

const computeLegendsShow = ({ data, classCodeEquipIdsMap }) => {
    const openCloseStatusSet = new Set();
    const allEquipIds = Object.values(classCodeEquipIdsMap)?.flat() || [];
    const allEquipNodes =
        data?.equipmentNodeVos?.map(v => {
            return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
        }) || [];
    const allGroupNodes =
        data?.groupVos?.map(v => {
            return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
        }) || [];
    const allPassByNodes =
        data?.passByVos?.map(v => {
            return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
        }) || [];
    const allNodesMap = [...allEquipNodes, ...allGroupNodes, ...allPassByNodes];
    try {
        allEquipIds?.forEach(eqId => {
            const { dataObject, filterStatus, filterStatusVO } = allNodesMap.find(v => v?.dataObjectId === eqId) || {};
            const { relObjIds, classCode } = dataObject || {};
            const parentId = relObjIds ? relObjIds[0] : '';
            const { filterStatus: parentFilterStatus, filterStatusVO: parentFilterStatusVO } = parentId ? allNodesMap?.find(v => v?.dataObjectId === parentId) || {} : {};
            const status = getEquipOpenCloseStatus({
                equipId: eqId,
                filterStatus: filterStatus || filterStatusVO?.infoCode,
                parentId,
                parentFilterStatus: parentFilterStatus || parentFilterStatusVO?.infoCode,
                classCode
            });

            // 无孪生数据-IOT状态
            if (typeof filterStatusVO === 'object' && filterStatusVO?.existsIotRule === false) {
                openCloseStatusSet.add('noIot');
            } else if (typeof filterStatusVO === 'object' && Object.keys(filterStatusVO).length === 0) {
                // 无滤镜
                openCloseStatusSet.add('noFilter');
            } else if (status) {
                openCloseStatusSet.add(status);
            }
        });
    } catch (error) {
        console.log('afterLoadChart-getEquipOpenCloseStatus 出错', error);
    }

    if (openCloseStatusSet.has('noIot') && [...openCloseStatusSet].some(v => v !== 'noIot' && v !== 'noFilter')) {
        switchLegendData.value = allSwitchData;
    } else if (openCloseStatusSet.size && [...openCloseStatusSet].some(v => v !== 'noIot' && v !== 'noFilter')) {
        switchLegendData.value = omitNoIotSwitchData;
    } else {
        switchLegendData.value = [];
    }
};

const afterLoadChart = ({ data, legendData, classCodeEquipIdsMap }) => {
    equipmentNodeVosList.value = data?.equipmentNodeVos;

    computeLegendsShow({ data, classCodeEquipIdsMap });

    // currentSceneIds.value = classCodeEquipIdsMap;
    sysChartClassCodeEquipIdMap.value = classCodeEquipIdsMap;
    if (isAbnormalIdsAllLoaded) {
        isAbnormalIdsAllLoaded.system = true;
    }

    console.log('classCodeEquipIdsMap: ', classCodeEquipIdsMap);

    noRelationChartData.value = !data;

    // 设置图例数据
    pipelineLegendData.value = legendData.map(it => {
        return {
            name: it.lineNames[0],
            color: it.style.backgroundColor
        };
    });

    setTimeout(() => {
        relationChartComponent.value?.updateAbnormalData(abnormalEventList.value || []);
    });
};

watch(abnormalEventList, () => {
    relationChartComponent.value?.updateAbnormalData(abnormalEventList.value);
});

defineExpose({ triggerClose });
</script>

<style lang="scss" scoped>
.relation-chart-warp {
    width: 100%;
    height: 100%;
    :deep(.relation-chart-com) {
        .tools-container {
            z-index: 52;
            right: 16px;
        }
    }
    .back-wrap {
        position: absolute;
        left: 16px;
        top: 60px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        z-index: 20;
        .back-label {
            display: flex;
            padding: 5px 8px 5px 4px;
            justify-content: center;
            align-items: center;
            gap: 2px;
            cursor: pointer;
            &:hover {
                border-radius: 4px;
                background: rgb(196 201 207 / 30%);
            }
        }
        .split-line {
            width: 1px;
            height: 16px;
            background: #c4c9cf;
        }
        .sub-graph-name {
            color: var(--gray-900, #1b2129);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px; /* 150% */
        }
    }
}
</style>
