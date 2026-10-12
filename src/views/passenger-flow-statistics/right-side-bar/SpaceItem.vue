<template>
    <div class="space-item-container" @click="clickSpace(space)" @mouseenter="hoverSpace(space)" @mouseleave="unHoverSpace">
        <div class="name-tag-container">
            <div v-ellipsis :class="['space-name', 'm-ellipsis']">{{ space?.name }}</div>
            <m-tag v-if="isAbnormal" size="small" color="#fff" :bg-color="computeBackground(isAbnormal)">
                {{ isAbnormal ? i18n.global.t('meos_control_web.abnormal') : i18n.global.t('meos_control_web.normal') }}
            </m-tag>
        </div>
        <div class="row">
            <div class="count-item">
                <span class="label">{{ i18n.global.t('meos_control_web.passenger_flow_count') }}</span>
                <span v-ellipsis :class="['count', 'm-ellipsis']">{{ iotUpdateCount }}</span>
            </div>
            <div class="count-item">
                <span class="label">{{ i18n.global.t('meos_control_web.entry_count') }}</span>
                <span v-ellipsis :class="['count', 'm-ellipsis']">{{ inCount }}</span>
            </div>
            <div class="count-item">
                <span class="label">{{ i18n.global.t('meos_control_web.exit_people_count') }}</span>
                <span v-ellipsis :class="['count', 'm-ellipsis']">{{ outCount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { openDetailDrawerInjectKey } from '../constant/injectKey';
import { extractAndFormatNumber } from '@/utils';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import { GRID, IOT_RUNNING } from '@/utils/globalVariables';

const props = defineProps({
    space: {
        type: Object,
        required: true
    }
});
const emits = defineEmits(['click-space', 'hover-space', 'unhover-space']);

const openDetailDrawer = inject(openDetailDrawerInjectKey);
const abnormalStatus = ref();
const iotNum = ref({});
const inFlow = ref({});
const outFlow = ref({});
const space = computed(() => props.space);
const spaceId = computed(() => {
    return props.space.id;
});

const handleCount = count => {
    return count?.toString() ? extractAndFormatNumber(count) : '--';
};

const isAbnormal = computed(() => {
    const res = abnormalStatus?.value === 'alarmstatus';
    return res;
});

const iotUpdateCount = computed(() => {
    const iotItem = iotNum?.value?.relInfoCodeConfigs?.find(v => v?.infoCodeType === IOT_RUNNING && v?.infoCode === 'spExsitPeopleNum') || {};
    const res = iotItem?.dataValue;
    return handleCount(res);
});

const inCount = computed(() => {
    const inItem = inFlow?.value?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_PERSISTENCE' && v?.infoCode === 'accdInPeopleFlow') || {};
    const res = inItem?.dataValue;
    return handleCount(res);
});

const outCount = computed(() => {
    const outItem = outFlow?.value?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_PERSISTENCE' && v?.infoCode === 'accdOutPeopleFlow') || {};
    const res = outItem?.dataValue;
    return handleCount(res);
});

const computeBackground = computed(() => abnormal => {
    const bg = !abnormal ? '#3FBE72' : '#F55047';
    return bg;
});

watch(
    () => props?.space,
    curSpace => {
        if (curSpace?.id) {
            const { relInfoCodeGroupConfigs } = curSpace || {};

            const statusItem = relInfoCodeGroupConfigs?.find(v => v?.groupCode === 'spaceStatus') || {};
            const parameterItem = relInfoCodeGroupConfigs?.find(v => v?.groupCode === 'runningParameter') || {};
            const iotParameter = parameterItem?.relInfoCodeConfigs?.find(v => v?.infoCodeType === IOT_RUNNING && v?.infoCode === 'spExsitPeopleNum');
            const inParameter = parameterItem?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_PERSISTENCE' && v?.infoCode === 'accdInPeopleFlow');
            const outParameter = parameterItem?.relInfoCodeConfigs?.find(v => v?.infoCodeType === 'IOT_PERSISTENCE' && v?.infoCode === 'accdOutPeopleFlow');

            abnormalStatus.value = statusItem?.relInfoCodeConfigs[0].dataValue;
            if (iotParameter) {
                iotNum.value = {
                    relInfoCodeConfigs: [iotParameter]
                };
            }
            if (inParameter) {
                inFlow.value = {
                    relInfoCodeConfigs: [inParameter]
                };
            }
            if (outParameter) {
                outFlow.value = {
                    relInfoCodeConfigs: [outParameter]
                };
            }
        }
    },
    {
        immediate: true
    }
);

const clickSpace = obj => {
    openDetailDrawer?.(obj);
    emits('click-space', obj);
};
const hoverSpace = obj => {
    emits('hover-space', obj);
};
const unHoverSpace = () => {
    emits('unhover-space');
};

useEquipInfoSSEHandle(
    spaceId,
    {
        RISK_EVENT: abnormalStatus,
        iotParameter: iotNum,
        inParameter: inFlow,
        outParameter: outFlow
    },
    false,
    GRID
);
</script>

<style lang="less" scoped>
.space-item-container {
    width: 100%;
    display: flex;
    padding: 12px;
    flex-direction: column;
    gap: 4px;
    cursor: pointer;

    border-radius: 4px;
    background: #f4f8ff;

    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }
}

.name-tag-container {
    display: flex;
    align-items: center;
    column-gap: 4px;
}

.space-name {
    color: @grey-800;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.row {
    display: flex;
    gap: 8px;
}

.count-item {
    flex: 1;
    display: flex;
    align-items: center;
    column-gap: 4px;

    color: @grey-500;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.label {
    display: inline-flex;
    flex-shrink: 0;
}

.count {
    color: @grey-800;
    font-family: 'Persagy2.0';
}
</style>
