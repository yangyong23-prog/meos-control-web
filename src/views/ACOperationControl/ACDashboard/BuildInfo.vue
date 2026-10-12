<template>
    <div class="build-info-wrap">
        <span class="building-name">{{ buildingData.name }}</span>
        <span v-show="buildingEnvName" v-ellipsis class="building-info m-ellipsis">{{ computedAvg }} : {{ averageValue }}</span>
    </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import i18n, { isCurrentCn } from '@/localization';
import { dashboardCurrentEnvInjectKey, dashboardEnvTabsInjectKey } from '../hooks/useDashboard';

defineProps({
    buildingData: {
        type: Object,
        default: () => ({})
    },
    averageValue: {
        type: String,
        default: '--'
    }
});

const { t } = i18n.global;
const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);
const dashboardEnvTabs = inject(dashboardEnvTabsInjectKey);

const buildingEnvName = computed(() => {
    return dashboardEnvTabs.value?.find(item => item?.id === dashboardCurrentEnv.value)?.name;
});

const computedAvg = computed(() => {
    return `${t('meos_control_web.average')}${isCurrentCn() ? '' : ' '}${buildingEnvName.value || ''}`;
});
</script>

<style lang="less" scoped>
.build-info-wrap {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;

    .building-name {
        flex-shrink: 0;
        color: var(--gray-800);
        font-size: 18px;
        font-weight: 700;
        line-height: 22px;
    }

    .building-info {
        min-width: 0;
        color: var(--gray-600);
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
    }
}
</style>
