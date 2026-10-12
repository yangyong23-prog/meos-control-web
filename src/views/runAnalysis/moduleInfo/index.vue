<template>
    <div class="module-info wh100">
        <Header v-model="showAuxiliaryLine" :analysis-type-list="analysisTypeList" :system-list="systemList" />
        <div v-if="analysisTypeList.length" class="module-info-main fc" style="position: relative; overflow: hidden">
            <Sidebar v-model="width" class="module-info-main-left">
                <template #left><Left :loading="loadingTree" :data="treeData" /></template>
                <template #main>
                    <AuxiliaryLine
                        v-if="Refresh"
                        ref="AuxiliaryLineRef"
                        v-model="time"
                        v-model:panel="showAuxiliaryLine"
                        :show="showAuxiliaryLine"
                        :times="fifteenMinuteTimes"
                        :x-positions="xPositions"
                        :default-left="0"
                        :default-right="0"
                        :default-top="24"
                    >
                        <template #panel>
                            <Panel :batch-query-period-data="batchQueryPeriodData" :time="time" />
                        </template>
                        <Chart
                            v-if="batchQueryPeriodData.length && RefreshChart"
                            ref="ChartRef"
                            :no-hover="showAuxiliaryLine"
                            :batch-query-period-data="batchQueryPeriodData"
                            @finished="finished"
                        />
                        <div v-else-if="!loading" class="fcc wh100">
                            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
                        </div>
                    </AuxiliaryLine>
                </template>
            </Sidebar>
            <LogList :key="system.id" class="module-info-main-right" @hover="hover" @unhover="unhover" />
        </div>
        <div v-else class="module-info-main fc">
            <m-illustration :title="i18n.global.t('meos_control_web.no_data_for_date')" type="noContent" content=""></m-illustration>
        </div>
    </div>
</template>

<script setup>
import Header from './Header.vue';
import Left from './left/index.vue';
import Chart from './chart/index.vue';
import Panel from './chart/Panel.vue';
import LogList from './logList/index.vue';
import Sidebar from './Sidebar.vue';
import { useQueryChartDataHook } from '../hooks/useQueryChartDataHook';
import { fifteenMinuteTimesKey } from '../injectionKey';
import AuxiliaryLine from '../components/AuxiliaryLine.vue';
import { systemKey } from '../hooks/useBaseData';
import i18n from '@/localization';

const system = inject(systemKey);
const props = defineProps({
    globalTime: {
        type: String,
        default: ''
    },
    analysisTypeList: {
        type: Array,
        default: () => []
    },
    systemList: {
        type: Array,
        default: () => []
    },
    loadingAnalysisTypeList: {
        type: Boolean,
        default: false
    }
});
const width = ref(360);
const showAuxiliaryLine = ref(false);
const AuxiliaryLineRef = ref();
const xPositions = ref([]);
const { batchQueryPeriodData, loadingTree, treeData, Refresh, RefreshChart, ChartRef, loading } = useQueryChartDataHook();
const fifteenMinuteTimes = inject(fifteenMinuteTimesKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const hover = data => {
    if (showAuxiliaryLine.value) {
        return;
    }
    const index = fifteenMinuteTimes.value.findIndex(item => item === data);
    ChartRef.value?.hoverLine({
        dataIndex: index,
        seriesIndex: 0
    });
};
watch(
    () => [loading.value, props.analysisTypeList],
    () => {
        showAuxiliaryLine.value = false;
    }
);
const unhover = () => {
    ChartRef.value?.mouseleave();
};
const time = ref('12:00');
const finished = () => {
    xPositions.value = ChartRef.value.getXPositons();
};
</script>
<style lang="less" scoped>
.module-info {
    &-main {
        height: calc(100% - 48px);
        :deep(.module-info-main-left) {
            width: calc(100% - 360px);
        }
    }
}
</style>
