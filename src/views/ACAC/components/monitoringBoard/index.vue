<template>
    <div ref="monitoringBoardRef" class="monitoring-board wh100" :style="{ zIndex: zIndex }">
        <div class="monitoring-board-header fcb">
            <div class="fs20 fw600 fc" style="gap: 4px">
                <MonitoringIcon />
                <span>{{ i18n.global.t('meos_control_web.operation_monitoring_dashboard') }}</span> <span>-</span><span style="color: var(--blue-500)">{{ currentSystem.localName }}</span>
            </div>
            <div class="monitoring-board-header-close fcc" @click="$emit('close')">
                <IconMeriComponentClose size="24" />
            </div>
        </div>
        <m-scrollbar class="monitoring-board-main">
            <template v-if="!loading">
                <Dashboard v-if="runEfficiencyData.length" :data-list="runEfficiencyData" />
                <RunDataChart
                    :tabs="runDataTabs"
                    :loading="loadingRunDataTab"
                    :equipment-list="equipmentList"
                    :height="cardHeight"
                    :run-efficiency-data="runEfficiencyData"
                    :echart-datas="echartDatas"
                    :active-tab-data="activeTabData"
                    :current-operating-mode-data="CurrentOperatingModeData"
                    :current-operating-mode-data-1h="CurrentOperatingModeData1h"
                    :avg-cooling-storage-rate="AvgCoolingStorageRate"
                    :outdoor-weather-onehour="outdoorWeather"
                    :outdoor-weather="outdoorWeather5"
                />
            </template>
        </m-scrollbar>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useZIndex } from 'meri-plus';
import { IconMeriComponentClose } from 'meri-icon';
import { currentSystemKey } from '../../hooks/useBaseHook';
import MonitoringIcon from '@/assets/svg/ACAC/monitoring.svg';
import Dashboard from './Dashboard.vue';
import { useMonitoringBoard } from '../../hooks/useMonitoringBoard';
import RunDataChart from './RunDataChart.vue';
defineEmits(['close']);
const currentSystem = inject(currentSystemKey);
const zIndex = computed(() => useZIndex().nextZIndex());
const monitoringBoardRef = ref(null);
const {
    runDataTabs,
    loadingRunDataTab,
    runEfficiencyData,
    echartDatas,
    activeTabData,
    loading,
    equipmentList,
    CurrentOperatingModeData,
    CurrentOperatingModeData1h,
    AvgCoolingStorageRate,
    outdoorWeather,
    outdoorWeather5
} = useMonitoringBoard();
const cardHeight = ref(300);
const computedHeight = () => {
    let height = 257;
    if (window.innerWidth >= 1700) {
        height = 257 + 57;
    }
    cardHeight.value = monitoringBoardRef.value?.clientHeight - height;
};
onMounted(() => {
    computedHeight();
    window.addEventListener('resize', computedHeight);
});

onUnmounted(() => {
    window.removeEventListener('resize', computedHeight);
});
</script>
<style lang="less" scoped>
.monitoring-board {
    position: absolute;
    top: 0;
    left: 0;
    background: url('@/assets/imgs/page_bg.png');
    background-color: rgb(235 246 255);
    background-size: cover;
    background-repeat: no-repeat;
    padding-bottom: 16px;
    &-header {
        height: 44px;
        padding: 8px 24px 0 24px;
        &-close {
            border-radius: 4px;
            cursor: pointer;
            height: 32px;
            width: 32px;
            &:hover {
                background-color: var(--alpha-30);
            }
        }
    }
    &-main {
        height: calc(100% - 44px);
        padding: 8px 16px 0 12px;
        :deep(.m-scrollbar__bar.is-horizontal) {
            display: none !important;
        }
    }
}
</style>
