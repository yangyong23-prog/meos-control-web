<template>
    <div class="unknown-status">
        <div class="title">
            <span>{{ i18n.global.t('meos_control_web.status_unknown_risk') }}</span>
            <span
                >{{ riskCount }}<span class="unit">{{ i18n.global.t('common.unit') }}</span></span
            >
        </div>
        <template v-if="props.isLoading || loadingDangerEvents">
            <m-list-skeleton />
        </template>
        <template v-else>
            <RiskTable v-if="riskCount > 0" :risk-list="equipmentsWithStatus" />
            <div v-else class="no-data">
                <SuccessCircle class="no-data-icon" />
                {{ i18n.global.t('meos_control_web.no_unknown_risk') }}
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import RiskTable from '../RiskTable/index.vue';
import SuccessCircle from '@/assets/images/common/success_circle.svg';
import { equipmentsWithStatusKey, loadingDangerEventsKey } from '../hooks/useBaseDataHook';
const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
});

const equipmentsWithStatus = inject(equipmentsWithStatusKey);
const loadingDangerEvents = inject(loadingDangerEventsKey);
const riskCount = computed(() => {
    if (!equipmentsWithStatus.value || !Array.isArray(equipmentsWithStatus.value)) {
        return 0;
    }
    return equipmentsWithStatus.value.reduce((acc, item) => {
        if (item.danegerEventListLength != null && typeof item.danegerEventListLength === 'number') {
            return acc + item.danegerEventListLength;
        }
        return acc;
    }, 0);
});
</script>
<style lang="less" scoped>
.unknown-status {
    margin: 24px 16px 16px 0;
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        line-height: 22px;
        margin-bottom: 12px;
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        z-index: 2;
        background-color: white;
        .unit {
            color: var(--gray-600, #626c78);
            font-size: 12px;
            font-weight: var(--platform-font-weight);
        }
    }
    .no-data {
        padding: 12px 20px;
        background: var(--gray-50, #f7f9fa);
        color: #000;
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        &-icon {
            width: 22px;
            margin-right: 9px;
        }
        &-text {
            color: #2bb462;
            font-weight: 700;
            margin-left: 2px;
        }
    }
}
</style>
