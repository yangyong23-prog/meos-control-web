<template>
    <div class="risk-row">
        <div class="risk-row-label">{{ i18n.global.t('meos_control_web.risk_event_colon') }}</div>
        <div>
            <span class="risk-detail-name">{{ props.dangerItem.name || '--' }}</span>
            <m-tag v-if="showHigh" color="#fff" bg-color="#FF3C3C" size="small">{{ i18n.global.t('meos_control_web.high') }}</m-tag>
            <m-tag v-if="showMid" color="#fff" bg-color="#FF943C" size="small">{{ i18n.global.t('common.mid') }}</m-tag>
            <m-tag v-if="showLow" color="#fff" bg-color="#246FE5" size="small">{{ i18n.global.t('meos_control_web.low') }}</m-tag>
        </div>
    </div>
    <!-- 策略覆盖度、风险点监测，没有则不展示 -->
    <div v-if="props.dangerItem.strategyCoverRatio?.toString()" class="risk-row">
        <div class="risk-row-label">{{ i18n.global.t('meos_control_web.strategy_coverage_colon') }}</div>
        <div>{{ renderPercent() }}</div>
    </div>
    <div v-if="renderMonitorStatus()" class="risk-row">
        <div class="risk-row-label">
            {{ i18n.global.t('meos_control_web.risk_point_monitoring_colon') }}
        </div>
        <div>{{ renderMonitorStatus() }}</div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { numberFormatPercent } from '@/utils/index';
import { RISK_EVENT_MONITOR_STATUS_MAP } from '../variable';
import { DANGER_EVENT_MONITORING_SITUATION } from '@/utils/SSEEventTypes';
import DockSingleton from '@/hooks/responsiveDock';

const props = defineProps({
    dangerItem: {
        type: Object,
        default: () => ({})
    }
});

const { getCustomInfo } = DockSingleton.getInstance();

const showHigh = computed(() => {
    return props.dangerItem?.exceptionValueLevel?.code === 'High' || props.dangerItem?.symptomaticValueLevel?.code === 'High';
});

const showMid = computed(() => {
    if (showHigh.value) {
        return false;
    }
    return props.dangerItem?.exceptionValueLevel?.code === 'Mid' || props.dangerItem?.symptomaticValueLevel?.code === 'Mid';
});

const showLow = computed(() => {
    if (showHigh.value || showMid.value) {
        return false;
    }
    return props.dangerItem?.exceptionValueLevel?.code === 'Low' || props.dangerItem?.symptomaticValueLevel?.code === 'Low';
});

const renderPercent = () => {
    const numberCount = Number(props.dangerItem?.strategyCoverRatio);
    if (isNaN(numberCount)) {
        return '--';
    } else if (numberCount === 0) {
        return i18n.global.t('meos_control_web.no_strategy');
    } else if (numberCount < 0.01) {
        return i18n.global.t('meos_control_web.less_than_1_percent');
    } else {
        return numberFormatPercent(numberCount);
    }
};
const renderMonitorStatus = () => {
    // const initData = props.dangerItem?.monitoringSituations || [];
    const dynamicData = getCustomInfo(props.dangerItem?.dangerEventId, DANGER_EVENT_MONITORING_SITUATION);
    const listArr = dynamicData?.newMonitoringSituations?.length ? dynamicData?.newMonitoringSituations : [];
    if (listArr.length === 0) {
        return '';
    }
    const name = listArr
        .map(v => {
            return RISK_EVENT_MONITOR_STATUS_MAP[v]?.NAME || '';
        })
        .filter(Boolean)
        .join('、');

    return name;
};
</script>

<style lang="less" scoped>
.risk-row {
    display: flex;
    color: var(--Grey-Grey-900, #1b2129);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    .risk-row-label {
        width: 84px;
        flex-shrink: 0;
        color: var(--Grey-Grey-600, #626c78);
    }

    .risk-detail-name {
        margin-right: 4px;
    }
}
</style>
