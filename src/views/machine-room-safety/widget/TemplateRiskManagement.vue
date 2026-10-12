<template>
    <div class="risk-row risk-management">
        <div class="risk-row-label">{{ i18n.global.t('meos_control_web.risk_event_colon') }}</div>
        <div>
            <span class="risk-detail-name">{{ props.dangerItem.name || '--' }}</span>
            <Interest v-if="dangerItem.followMark" class="interest" />
            <m-tag v-if="dangerItem.status === RISK_EVENT_STATUS_MAP.EXCEPTION" color="#fff" bg-color="#F55047" size="small">
                {{ i18n.global.t('meos_control_web.risk_occurred') }}
            </m-tag>
            <m-tag v-if="dangerItem.status === RISK_EVENT_STATUS_MAP.CONJECTURE_EXCEPTION" color="#fff" bg-color="#F55047" size="small">
                {{ i18n.global.t('meos_control_web.presumed_occurrence') }}
            </m-tag>
            <m-tag v-if="dangerItem.status === RISK_EVENT_STATUS_MAP.POTENTIAL" color="#fff" bg-color="#FF9D2D" size="small">
                {{ i18n.global.t('meos_control_web.potential_risk') }}
            </m-tag>
            <m-tag v-if="dangerItem.status === RISK_EVENT_STATUS_MAP.UNKNOWN" color="#fff" bg-color="#8252E3" size="small">
                {{ i18n.global.t('meos_control_web.status_unknown') }}
            </m-tag>
            <m-tag v-if="dangerItem.status === RISK_EVENT_STATUS_MAP.GENERAL_NORMAL" color="#fff" bg-color="#15AE55" size="small">
                {{ i18n.global.t('meos_control_web.generally_normal') }}
            </m-tag>
            <m-tag v-if="dangerItem.status === RISK_EVENT_STATUS_MAP.NORMAL" color="#fff" bg-color="#15AE55" size="small">
                {{ i18n.global.t('meos_control_web.normal') }}
            </m-tag>
        </div>
    </div>
    <div class="risk-row risk-management">
        <div class="risk-row-label">{{ i18n.global.t('meos_control_web.update_time_colon') }}</div>
        <div>{{ dangerItem.updateTime || '--' }}</div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Interest from '@/assets/svg/interest.svg';
import { RISK_EVENT_STATUS_MAP } from '../variable';
const props = defineProps({
    dangerItem: {
        type: Object,
        default: () => ({})
    }
});
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

.risk-management {
    .risk-row-label {
        width: 70px;
        flex-shrink: 0;
        color: var(--Grey-Grey-600, #626c78);
    }
}

.interest {
    margin-left: 4px;
    margin-right: 8px;
}
</style>
