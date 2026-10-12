<template>
    <div class="run-analysis-energy wh100">
        <Header />
        <div class="energy-main">
            <Left :loading="loadingStatistics" v-bind="{ ...statistics }" />
            <Right
                :loading="loading"
                :analysis-type-list="analysisTypeList"
                :energy-echart-data="energyEchartData"
                :legend-object="legendObject"
                :cold-and-heat-storage="coldAndHeatStorage"
                :no-data="noData"
            />
        </div>
    </div>
</template>

<script setup>
import { useEnergyHook } from '../hooks/useEnergyHook';
import Header from './Header.vue';
import Left from './left/Left.vue';
import Right from './right/Right.vue';
import { globalTimeKey } from '../injectionKey';
defineProps({
    analysisTypeList: {
        type: Array,
        default: () => []
    }
});
const globalTime = inject(globalTimeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const { loadingStatistics, statistics, loading, energyEchartData, legendObject, noData, coldAndHeatStorage } = useEnergyHook(globalTime.value);
</script>
<style lang="less" scoped>
.energy-main {
    height: calc(100% - 48px);
    display: flex;
}
</style>

<style lang="less">
.energy-main {
    .bg-box {
        background: rgba(244, 248, 255, 0.97);
        border-radius: 4px;
    }
}
</style>
