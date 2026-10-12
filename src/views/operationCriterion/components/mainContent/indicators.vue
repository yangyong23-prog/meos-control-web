<template>
    <div class="ocg-indicator-wrap">
        <Indicator
            :title1="seasonType"
            :info1="i18n.global.t('meos_control_web.hvac_season')"
            :title2="seasonCondition"
            :code="config?.seasonType || 'default1'"
            :info2="i18n.global.t('meos_control_web.hvac_operating_mode')"
            :show-right="true"
            :title2-color="seasonTitle2Color"
        />
        <Indicator
            :code="config?.valueSelectType || 'default2'"
            :title1="valueSelect"
            :info1="i18n.global.t('meos_control_web.value_selection')"
            bg-class="bg-org"
        />
        <Indicator
            :title1="earlyClose"
            :info1="i18n.global.t('meos_control_web.whether_early_shutdown')"
            :code="earlyCloseCode"
            title1-color="#0C9B4A"
        />
        <Indicator
            :title1="schedule"
            :info1="i18n.global.t('meos_control_web.space_scheduling')"
            :loading="loading"
            :code="participateInScheduling || 'default4'"
        />
        <Indicator
            code="xiangying"
            :title1="airConditioningDemandTimeIntervals"
            :info1="i18n.global.t('meos_control_web.hvac_demand_time')"
            class="ac-conditioning-demand-time-intervals"
            :title2="allowResponseRegulation"
            :show-right="true"
            :info2="i18n.global.t('meos_control_web.allow_response_regulation')"
            :title2-color="title2Color"
            :info3="responseRegulationTimeIntervals"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Indicator from './indicator.vue';
import { transformTimesToView } from '@/views/operationCriterion/utils';
import { useParticipateInSchedulingHook } from '../../hooks/useParticipateInSchedueHook';
import { CalendarTagsMap, valueSelectTypeMap, scheduleTypeMap } from '@/views/operationCriterion/constant';
import { currentDateKey, participateInSchedulingKey } from '@/views/operationCriterion/constant';
const props = defineProps({
    config: {
        type: Object,
        default: () => {}
    }
});
const currentDate = inject(currentDateKey);
const { getParticipateInScheduling, loading, loaded, participateInScheduling } = useParticipateInSchedulingHook();
onMounted(async () => {
    await getParticipateInScheduling(currentDate.value);
});
watch(
    () => currentDate.value,
    () => {
        getParticipateInScheduling(currentDate.value);
    }
);
const seasonType = computed(() => {
    if (props.config && props.config.seasonType) {
        return CalendarTagsMap[props.config.seasonType];
    }
    return '--';
});
const seasonCondition = computed(() => {
    if (props.config && props.config.seasonCondition) {
        return CalendarTagsMap[props.config.seasonCondition];
    }
    return '--';
});

const valueSelect = computed(() => {
    if (props.config && props.config.valueSelectType) {
        return valueSelectTypeMap[props.config.valueSelectType];
    }
    return '--';
});

const earlyClose = computed(() => {
    if (props.config && props.config.isAllowEarlyShutdown) {
        return i18n.global.t('meos_control_web.allow_early_shutdown');
    } else if (props.config && typeof props.config.isAllowEarlyShutdown === 'boolean') {
        return i18n.global.t('meos_control_web.early_shutdown_not_allowed');
    }
    return '--';
});

const earlyCloseCode = computed(() => {
    if (props.config && props.config.isAllowEarlyShutdown) {
        return 'isAllowEarlyShutdown';
    } else if (props.config && typeof props.config.isAllowEarlyShutdown === 'boolean') {
        return 'NotisAllowEarlyShutdown';
    }
    return 'default3';
});

const schedule = computed(() => {
    if (participateInScheduling.value) {
        return scheduleTypeMap[participateInScheduling.value];
    }
    if (loading.value) {
        return '';
    }
    return '--';
});

const allowResponseRegulation = computed(() => {
    if (props.config && props.config.isAllowResponseRegulation) {
        return i18n.global.t('meos_control_web.allow_response_adjustment');
    } else if (props.config && typeof props.config.isAllowResponseRegulation === 'boolean') {
        return i18n.global.t('meos_control_web.response_adjust_not_allowed');
    }
    return '--';
});
const seasonTitle2Color = computed(() => {
    if (props.config && props.config.seasonCondition === 'ACSeason-3') {
        return 'var(--gray-500, #8B949E)';
    }
    return '';
});
const title2Color = computed(() => {
    if (props.config && typeof props.config.isAllowResponseRegulation === 'boolean' && !props.config.isAllowResponseRegulation) {
        return 'var(--gray-500, #8B949E)';
    }
    return '';
});
const airConditioningDemandTimeIntervals = computed(() => {
    if (props.config && props.config.isAlgorithmCompute) {
        return i18n.global.t('meos_control_web.algorithm_auto_calculate');
    } else if (props.config?.noDemand) {
        return i18n.global.t('meos_control_web.no_demand1');
    } else if (props.config && props.config.airConditioningDemandTimeIntervals && props.config.airConditioningDemandTimeIntervals.length) {
        return transformTimesToView(props.config.airConditioningDemandTimeIntervals).join('&nbsp;&nbsp;');
    }
    return '--';
});
const responseRegulationTimeIntervals = computed(() => {
    if (props.config && props.config.responseRegulationTimeIntervals && props.config.responseRegulationTimeIntervals.length) {
        return '(' + transformTimesToView(props.config.responseRegulationTimeIntervals).join('&nbsp;&nbsp;') + ')';
    }
    return '';
});
</script>
<style lang="less" scoped>
.ocg-indicator-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .ac-conditioning-demand-time-intervals {
        // max-width: 580px;
    }
}

@media (max-width: 1600px) {
    .ocg-indicator-wrap {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .ocg-indicator-wrap > * {
        grid-column: span 1;
        max-width: 100%;
    }

    .ac-conditioning-demand-time-intervals {
        grid-column: span 2;
    }
}
@media (min-width: 1600px) {
    .ocg-indicator-wrap {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
    }

    .ocg-indicator-wrap > * {
        grid-column: span 1;
        max-width: 100%;
    }

    .ac-conditioning-demand-time-intervals {
        grid-column: span 4;
    }
}
</style>
