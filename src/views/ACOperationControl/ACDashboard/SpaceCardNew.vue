<template>
    <div v-if="isSpaceShow" :class="cardClass" :style="cardStyle" @click="chooseSpace">
        <div class="space-name-title">
            <span v-ellipsis class="m-ellipsis">{{ spaceData.localName ?? '--' }}</span>

            <div v-if="haveAbnormal" class="abnormal-tags">
                <span>{{ abnormalColon }}</span>
                <span class="highLight">
                    {{ abnormalCountString }}
                </span>
            </div>
        </div>

        <div class="space-info-content">
            <div v-if="showNoIotMonitoring" class="without-iot-item">
                {{ noIotString }}
            </div>

            <template v-else>
                <div v-if="showFirstPosition" class="column-item">
                    <div v-ellipsis class="row-value m-ellipsis">
                        <IotValueContent :space-data="spaceData" />
                    </div>
                    <div v-ellipsis class="row-title m-ellipsis">
                        {{ currentItemTitle }}
                    </div>
                </div>

                <div v-if="showScheduleStatus" class="column-item">
                    <div class="row-value">
                        <DemandTargetContent :space-data="spaceData" />
                    </div>
                    <div v-ellipsis class="row-title">
                        {{ dispatchString }}
                    </div>
                </div>

                <div v-if="showControlTarget" class="column-item">
                    <div v-ellipsis class="row-value m-ellipsis">
                        <ControlTargetContent :space-data="spaceData" />
                    </div>
                    <div v-ellipsis class="row-title">
                        {{ controlString }}
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="jsx">
import { computed, defineComponent, inject } from 'vue';
import DockSingleton from '@/hooks/responsiveDock';

import { dashboardCurrentEnvInjectKey, currentItemTitleInjectKey } from '../hooks/useDashboard';

import {
    spaceIotDataLoadingKey,
    currentSelectObjKey,
    globalValueSelectTypeKey,
    curEnvHasShellConfigScheduleStatusKey,
    curEnvHasShellConfigControlAimKey,
    spaceI18nDashboardKey
} from '../injectKeys';

import { DASHBOARD_ENV_BELONG_IDS, DEMAND_TARGET_TEXT_COLOR_MAP, NO_DATA_CARD_BG, getStatusMapForEnv } from '../constants/constant';

import { getSpaceEnvStatus } from '../utils/spaceStatus';
import { useSpaceShow } from './useSpaceShow';

const props = defineProps({
    spaceData: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['chooseSpace']);

const selectModuleInfo = inject(currentSelectObjKey);

const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);
const spaceIotDataLoading = inject(spaceIotDataLoadingKey);
const globalValueSelectType = inject(globalValueSelectTypeKey);

const curEnvHasShellConfigScheduleStatus = inject(curEnvHasShellConfigScheduleStatusKey);
const curEnvHasShellConfigControlAim = inject(curEnvHasShellConfigControlAimKey);

const { getIotData, getCustomInfo, getObjectAbnormalStatus, getAbnormalEventsList } = DockSingleton.getInstance();

const currentEnv = computed(() => dashboardCurrentEnv.value || '');
const upperEnv = computed(() => currentEnv.value.toUpperCase());

const currentSpaceEnvInfo = computed(() => {
    return props.spaceData?.[upperEnv.value] || {};
});

const isQualityFirst = computed(() => {
    return globalValueSelectType.value === 'value_select_quality_first';
});

const isEmptyValueSelectType = computed(() => {
    return !globalValueSelectType.value?.length;
});

const isSecondPositionControlTarget = computed(() => {
    return [DASHBOARD_ENV_BELONG_IDS.RH, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF].includes(currentEnv.value);
});

const cardStatusDataSource = computed(() => {
    return getStatusMapForEnv(currentEnv.value);
});

const haveNoTarget = computed(() => {
    return !cardStatusDataSource.value?.length;
});

const cardStatus = computed(() => {
    return getSpaceEnvStatus(props.spaceData.id, currentEnv.value, {
        getIotData,
        getCustomInfo
    });
});

const cardBgColor = computed(() => {
    if (spaceIotDataLoading.value || haveNoTarget.value) {
        return '#fff';
    }

    if (!hasSomeRule.value) {
        return NO_DATA_CARD_BG;
    }

    return cardStatusDataSource.value?.find(item => item?.id === cardStatus.value)?.bg || '#fff';
});

const cardClass = computed(() => {
    return {
        'space-card-ins': true,
        selected: props.spaceData.id === selectModuleInfo.value?.id,
        [cardStatus.value]: !!cardStatus.value
    };
});

const spaceColumnCount = computed(() => {
    const hideScheduleStatus = isQualityFirst.value || isEmptyValueSelectType.value || !curEnvHasShellConfigScheduleStatus.value;

    const hideControlAim = !curEnvHasShellConfigControlAim.value;

    return hideScheduleStatus || hideControlAim ? 2 : 3;
});

const cardStyle = computed(() => {
    return {
        '--space-column-count': spaceColumnCount.value,
        '--space-card-bg-color': cardBgColor.value
    };
});

const currentItemTitle = inject(currentItemTitleInjectKey);

const { isSpaceShow, hasSomeRule } = useSpaceShow(props.spaceData.id);

const showFirstPosition = computed(() => {
    return !!currentSpaceEnvInfo.value?.secondGroupFirstInfo?.existsIotRule;
});

const showSecondPosition = computed(() => {
    if (isSecondPositionControlTarget.value) {
        return false;
    }

    return !!currentSpaceEnvInfo.value?.secondGroupSecondInfo?.infoCode;
});

const showThirdPosition = computed(() => {
    if (isSecondPositionControlTarget.value) {
        return !!currentSpaceEnvInfo.value?.secondGroupSecondInfo?.existsIotRule;
    }

    return !!currentSpaceEnvInfo.value?.secondGroupThirdInfo?.existsIotRule;
});

const showNoIotMonitoring = computed(() => {
    return !hasSomeRule.value && !spaceIotDataLoading.value;
});

const showScheduleStatus = computed(() => {
    return !haveNoTarget.value && showSecondPosition.value && !isQualityFirst.value && !isEmptyValueSelectType.value && curEnvHasShellConfigScheduleStatus.value;
});

const showControlTarget = computed(() => {
    return !haveNoTarget.value && showThirdPosition.value && curEnvHasShellConfigControlAim.value;
});

const haveAbnormal = computed(() => {
    return getObjectAbnormalStatus(props.spaceData.id);
});

const abnormalCount = computed(() => {
    return getAbnormalEventsList([props.spaceData.id])?.length || 0;
});

const getIotValueNode = spaceData => {
    const iotValObj = getIotData(spaceData.id, currentEnv.value);

    if (!iotValObj?.dataValue?.toString()) {
        return <>--</>;
    }

    return (
        <>
            <span class="space-iot-val ffCustom-M">{iotValObj.dataValue || '--'}</span>
            <span class="f12">{iotValObj.unit || '--'}</span>
        </>
    );
};

const getDemandTargetNode = spaceData => {
    const { infoCode, infoCodeType } = currentSpaceEnvInfo.value?.secondGroupSecondInfo || {};

    if (!infoCode || !infoCodeType) {
        return <>--</>;
    }

    const targetLabelObj = getCustomInfo(spaceData.id, infoCodeType, infoCode);

    if (!targetLabelObj?.dataValue) {
        return <>--</>;
    }

    const labelObj = targetLabelObj.dataSource?.find(item => item.code === targetLabelObj.dataValue);

    if (!labelObj) {
        return <>--</>;
    }

    const finalName = labelObj.name === demandTargetString.value ? unScheduleString.value : labelObj.name;

    return (
        <span style={{ color: DEMAND_TARGET_TEXT_COLOR_MAP[targetLabelObj.dataValue] }} class="space-set-val">
            {finalName}
        </span>
    );
};

const getControlTargetNode = spaceData => {
    const normalControlAim = currentSpaceEnvInfo.value?.secondGroupThirdInfo?.infoCode;
    const specialControlAim = currentSpaceEnvInfo.value?.secondGroupSecondInfo?.infoCode;

    const finalControlAim = isSecondPositionControlTarget.value ? specialControlAim : normalControlAim;

    const valObj = finalControlAim ? getIotData(spaceData.id, finalControlAim) : null;

    if (!valObj?.dataValue?.toString()) {
        return <>--</>;
    }

    return (
        <>
            <span class="space-iot-val ffCustom-M">{valObj.dataValue || '--'}</span>
            <span class="f12">{valObj.unit || '--'}</span>
        </>
    );
};

const spaceI18n = inject(spaceI18nDashboardKey);
const { abnormalColon, abnormalCountString: countString, noIotString, dispatchString, controlString, demandTargetString, unScheduleString } = spaceI18n || {};
const abnormalCountString = computed(() => countString?.value?.(abnormalCount.value));

const IotValueContent = defineComponent({
    props: {
        spaceData: {
            type: Object,
            required: true
        }
    },
    setup(componentProps) {
        return () => getIotValueNode(componentProps.spaceData);
    }
});

const DemandTargetContent = defineComponent({
    props: {
        spaceData: {
            type: Object,
            required: true
        }
    },
    setup(componentProps) {
        return () => getDemandTargetNode(componentProps.spaceData);
    }
});

const ControlTargetContent = defineComponent({
    props: {
        spaceData: {
            type: Object,
            required: true
        }
    },
    setup(componentProps) {
        return () => getControlTargetNode(componentProps.spaceData);
    }
});

const chooseSpace = () => {
    emit('chooseSpace', props.spaceData);
};
</script>

<style lang="less" scoped>
.space-card-ins {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    padding: 12px 12px;
    cursor: pointer;
    background-color: var(--space-card-bg-color);

    &:hover:not(.selected) {
        position: relative;
        box-shadow: inset 0 0 0 1px #246fe5;
        background: linear-gradient(0deg, rgba(92, 92, 92, 0.05) 0%, rgba(92, 92, 92, 0.05) 100%), var(--space-card-bg-color);
    }

    &.selected {
        background: var(--blue-500, #246fe5) !important;
        box-shadow: 0px 22px 40px 0px rgba(53, 114, 189, 0.12) !important;
        border: none !important;
        .space-name-title,
        .row-value,
        .space-iot-val,
        .space-set-val,
        .row-title,
        .without-iot-item {
            color: #fff !important;
        }
        .space-name-title {
            font-weight: 600;
        }
        .abnormal-tags {
            background: linear-gradient(270deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.2) 100%);
            color: #fff;
        }
    }

    .space-name-title {
        color: @grey-800;
        font-size: 16px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
        display: flex;
        align-items: center;
        min-width: 0;

        margin-bottom: 16px;
    }

    .space-info-content {
        display: grid;
        grid-template-columns: repeat(var(--space-column-count), 1fr);
        align-items: center;
        gap: 8px;
    }

    .without-iot-item {
        height: 40px;
        color: @grey-500;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 40px;

        min-width: 0; // Fix overflow issues
        &:only-child {
            grid-column: 1 / -1; // Make single child span all columns
        }
    }

    .column-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        row-gap: 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        z-index: 10;

        min-width: 0; // Fix overflow issues
        &:only-child {
            grid-column: 1 / -1; // Make single child span all columns
        }
    }

    .row-value {
        max-width: 100%;
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
    }

    .space-iot-val {
        color: @grey-800;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
    }

    .row-title {
        max-width: 100%;
        color: @grey-500;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}

.abnormal-tags {
    display: flex;
    height: 20px;
    padding: 3px 4px;
    align-items: center;
    border-radius: 2px;
    background: linear-gradient(270deg, rgba(245, 80, 71, 0.05) 0%, rgba(245, 80, 71, 0.2) 100%);

    color: @red-500;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 20px;
    margin-left: 4px;
    flex-shrink: 0;

    .highLight {
        font-weight: 700;
    }
}
</style>
