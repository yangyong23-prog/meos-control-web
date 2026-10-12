<template>
    <div v-if="showLegend" class="legends-layout">
        <div class="legends-container">
            <span class="env-title">{{ `${i18n.global.t('common.space')}${envTitle}：` }}</span>
            <div class="legends-list">
                <template v-for="(item, index) in iconsMap" :key="index">
                    <div class="legend-item">
                        <div class="legend-icon" :style="{ background: item.legendColor }"></div>
                        <span class="legend-name">{{ item.name }}</span>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { dashboardCurrentEnvInjectKey } from '../hooks/useDashboard';
import { getStatusMapForEnv, DASHBOARD_ENV_BELONG_IDS } from '../constants/constant';

const currentEnv = inject(dashboardCurrentEnvInjectKey);

const showLegend = computed(() => {
    return [DASHBOARD_ENV_BELONG_IDS.TDB, DASHBOARD_ENV_BELONG_IDS.CO2, DASHBOARD_ENV_BELONG_IDS.RH, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF].includes(currentEnv.value);
});

const envTitle = computed(() => {
    if (currentEnv.value === DASHBOARD_ENV_BELONG_IDS.TDB) {
        return i18n.global.t('meos_control_web.temperature');
    } else if (currentEnv.value === DASHBOARD_ENV_BELONG_IDS.CO2) {
        return i18n.global.t('meos_control_web.co2_concentration');
    } else if (currentEnv.value === DASHBOARD_ENV_BELONG_IDS.RH) {
        return i18n.global.t('meos_control_web.humidity');
    } else if (currentEnv.value === DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF) {
        return i18n.global.t('meos_control_web.differential_pressure');
    }
    return '';
});

const iconsMap = computed(() => getStatusMapForEnv(currentEnv.value));
</script>
<style scoped lang="less">
.legends-layout {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 100%;
    height: 44px;
    z-index: 10;
    padding-inline: 16px;
}
.legends-container {
    display: flex;
    width: 100%;
    height: 100%;
    padding-block: 11px;
    justify-content: center;
    align-items: center;
    background: #ebf6ff;
}

.env-title {
    color: @grey-800;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
}

.legends-list {
    display: flex;
    align-items: center;
    column-gap: 8px;
}
.legend-item {
    display: flex;
    align-items: center;
    column-gap: 6px;
}
.legend-icon {
    width: 12px;
    height: 12px;
    border-radius: 2px;
}
.legend-name {
    color: @grey-600;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 18px;
}
</style>
