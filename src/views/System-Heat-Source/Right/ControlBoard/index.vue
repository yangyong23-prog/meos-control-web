<template>
    <m-scrollbar class="control-scroll-wrapper">
        <div class="control-content-container">
            <template v-if="finalLoading"> <m-list-skeleton style="margin-top: 14px" /> </template>
            <template v-else>
                <template v-if="showConsoleAndNotify">
                    <!-- 控制台 -->
                    <ControlBox v-if="consoleTypesTabs.length" v-bind="$attrs" :console-types-tabs="consoleTypesTabs" />
                </template>

                <SystemParams
                    :key="systemId"
                    v-model:show-monitoring-board="showMonitoringBoard"
                    :data="runParams"
                    :system-id="systemId"
                    :charts-data="chartsData"
                    :charts-data-by-space-scope="chartsDataBySpaceScope"
                    :all-chart-spaces-count="allChartSpacesCount"
                />
                <Weather :weather-list="weatherList" />
            </template>
        </div>
    </m-scrollbar>
</template>
<script setup>
import i18n from '@/localization';
import Weather from './Weather.vue';
import ControlBox from '../ControlBox/index.vue';
import { weatherListKey, systemParamsKey, isSystemLoadingKey } from '../../hooks/useRightHook';
import { systemIdKey, showMonitoringBoardKey } from '../../hooks/useBaseHook';
import SystemParams from '../../components/SystemParams/index.vue';
import { isEdge } from '@/utils/envUtils';
const props = defineProps({
    showControl: {
        type: Boolean,
        default: false
    },
    showConsoleAndNotify: {
        type: Boolean,
        default: false
    },
    consoleTypesTabs: {
        type: Array,
        default: () => []
    },
    chartsData: {
        type: Array,
        default: () => []
    },
    chartsDataBySpaceScope: {
        type: Object,
        default: () => ({})
    },
    allChartSpacesCount: {
        type: Number,
        default: 0
    }
});

// 系统数据
const systemId = inject(systemIdKey);
const systemParams = inject(systemParamsKey);
const weatherList = inject(weatherListKey);
const isSystemLoading = inject(isSystemLoadingKey);

const showMonitoringBoard = inject(showMonitoringBoardKey);

const runParams = computed(() => {
    return systemParams.value?.sysRunParameter?.groupChildren || [];
});

const finalLoading = computed(() => {
    return isSystemLoading?.value || !props.showControl;
});
</script>
<style lang="less" scoped>
.control-content-container {
    width: 100%;
    height: 100%;
    padding: 12px 16px 16px 16px;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
}
</style>
