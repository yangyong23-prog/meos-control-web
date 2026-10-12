<template>
    <div class="chart-box wh100">
        <AuxiliaryLine
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
                <Panel :batch-query-period-data="computedDataType.data" :time="time" />
            </template>
            <Chart
                v-if="computedDataType.data && showChart"
                ref="ChartRef"
                :no-hover="showAuxiliaryLine"
                :batch-query-period-data="[computedDataType.data]"
                :show-title="false"
                @finished="finished"
            />
            <div v-else class="fcc wh100">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
            </div>
        </AuxiliaryLine>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import AuxiliaryLine from '../components/AuxiliaryLine.vue';
import Chart from '../components/chart/index.vue';
import Panel from '../components/chart/Panel.vue';
const props = defineProps({
    dataType: {
        type: String,
        default: ''
    },
    fifteenMinuteTimes: {
        type: Array,
        default: () => []
    },
    computedDataType: {
        type: Object,
        default: () => ({})
    }
});
const showAuxiliaryLine = ref(false);
const time = ref('12:00');
const ChartRef = ref(null);
const xPositions = ref([]);
const showChart = ref(true);
const finished = () => {
    xPositions.value = ChartRef.value.getXPositons();
};
watch(
    () => props.dataType,
    () => {
        showChart.value = false;
        nextTick(() => {
            showChart.value = true;
        });
    },
    {
        immediate: true
    }
);
</script>
<style lang="less" scoped></style>
