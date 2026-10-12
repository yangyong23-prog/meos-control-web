<template>
    <m-scrollbar class="control-main-board">
        <template v-if="showControl">
            <Control v-if="consoleTypesTabs.length" v-bind="$attrs" :console-types-tabs="consoleTypesTabs" />
            <SystemParams
                :key="systemId"
                :data="systemParams"
                :charts-data="chartsData"
                :charts-data-by-space-scope="chartsDataBySpaceScope"
                :all-chart-spaces-count="allChartSpacesCount"
            />
            <Weather :weather-list="weatherList" />
        </template>
        <template v-else>
            <m-list-skeleton style="margin-top: 14px" />
        </template>
    </m-scrollbar>
</template>

<script setup>
import SystemParams from './systemData/index.vue';
import Weather from './Weather.vue';
import Control from './Control.vue';
import { systemIdKey } from '../../hooks/useBaseHook';
const systemId = inject(systemIdKey);
defineProps({
    showControl: {
        type: Boolean,
        default: false
    },
    weatherList: {
        type: Array,
        default: () => []
    },
    consoleTypesTabs: {
        type: Array,
        default: () => []
    },
    systemParams: {
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
</script>
<style lang="less" scoped>
.control-main-board {
    :deep(.m-scrollbar__content) {
        padding: 0 16px 16px 16px;
    }
}
</style>
