<template>
    <div
        class="space-card-ins"
        :class="{
            'abnormal-card': haveAbnormal,
            selected: spaceData.id === selectModuleInfo?.id
        }"
        @click="chooseSpace"
    >
        <div v-ellipsis class="space-name-title">{{ spaceData.localName ?? '--' }}</div>
        <div class="space-info-content-row">
            <div class="space-iot-val">{{ getIotValueStr(spaceData) }}</div>
        </div>
        <div class="space-info-content-row">
            <abnormalTag></abnormalTag>
        </div>
    </div>
</template>
<script setup lang="jsx">
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { dashboardCurrentEnvInjectKey } from '../hooks/useDashboard';

const props = defineProps({
    spaceData: {
        type: Object,
        default: () => ({})
    }
});

const emits = defineEmits(['chooseSpace']);

const selectModuleInfo = inject('selectModuleInfo');

const { getIotData, getCustomInfo, getObjectAbnormalStatus } = DockSingleton.getInstance();

const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);

const getIotValueStr = spaceData => {
    const valObj = getIotData(spaceData.id, dashboardCurrentEnv.value);
    if (valObj?.dataValue) {
        return `${valObj.dataValue}${valObj.unit || ''}`;
    }
    return '--';
};

const TAG_COLOR_MAP = {
    alarmstatus: 'var(--red-500)'
};

const haveAbnormal = computed(() => {
    return getObjectAbnormalStatus(props.spaceData.id);
});

const chooseSpace = () => {
    emits('chooseSpace', props.spaceData);
};

const abnormalTag = () => {
    if (haveAbnormal.value) {
        return (
            <span className="space-card-tag" style={{ backgroundColor: TAG_COLOR_MAP.alarmstatus }}>
                {i18n.global.t('meos_control_web.abnormal')}
            </span>
        );
    }
    return <></>;
};
</script>

<style lang="less" scoped>
.space-card-ins {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    // border: 1px solid var(--red-500, #f55047);
    background: rgba(105, 205, 144, 0.24);
    padding: 10px 12px;
    cursor: pointer;

    &:hover {
        background-color: rgba(105, 205, 144, 0.7);
    }

    &.selected {
        background: var(--blue-500, #246fe5) !important;
        box-shadow: 0px 2px 24px 0px rgba(36, 111, 229, 0.4) !important;
        border: none !important;
        .space-name-title,
        .space-iot-val,
        .space-set-val {
            color: #fff !important;
        }
    }

    &.abnormal-card {
        border: 1px solid var(--red-500);
        background: rgba(255, 163, 158, 0.5);
        &:hover {
            background-color: rgba(255, 163, 158, 0.7);
        }
    }

    .space-name-title {
        color: var(--gray-900);
        font-size: 14px;
        line-height: 22px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .space-info-content-row {
        display: flex;
        margin: 4px 0;
        align-items: center;
        gap: 4px;

        .space-iot-val {
            flex: 1;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
            font-family: Persagy2.0;
            color: var(--gray-800);
        }
        .space-set-val {
            flex: 2;
            font-size: 12px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 20px;
        }

        .space-card-tag {
            padding: 0 4px;
            border-radius: 2px;
            color: #fff;
            font-size: 12px;
            line-height: 20px;
        }
    }
}
</style>
