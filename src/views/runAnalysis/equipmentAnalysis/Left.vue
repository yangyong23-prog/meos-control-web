<template>
    <div class="equip-analysis-left" :class="{ isSplitScreen: isSplitScreen }">
        <AuxiliaryLine
            ref="AuxiliaryLineRef"
            v-model="curSelectedTime"
            v-model:panel="showPanel"
            :times="fiveMinuteTimes"
            :show="data.length"
            :default-left="0"
            :default-right="0"
            :default-top="40"
            :precision="5"
            :x-positions="xPositions"
        >
            <Chart v-if="refreshChart && data.length" ref="ChartRef" :no-hover="data.length" :batch-query-period-data="data" @finished="finished">
                <template #title>
                    <m-button type="link" :disabled="showPanel" style="z-index: 10" @click="showPanel = !showPanel">{{
                        i18n.global.t('meos_control_web.display_info_board')
                    }}</m-button>
                </template>
                <template #legend>
                    <m-button v-if="!isSplitScreen" style="z-index: 10; margin-left: 12px" @click="changeSplitScreen">{{
                        i18n.global.t('meos_control_web.model_interlock')
                    }}</m-button>
                </template>
            </Chart>
            <div v-else class="fcc wh100">
                <m-illustration :title="i18n.global.t('meos_control_web.please_select_device_and_param_first')" type="noContent" content=""></m-illustration>
            </div>
            <template #panel> <PanelData :data="data" @close="showPanel = false" /> </template>
        </AuxiliaryLine>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import AuxiliaryLine from '../components/AuxiliaryLine.vue';
import { curSelectedTimeKey, fiveMinuteTimesKey, isSplitScreenKey } from '../injectionKey';
import Chart from '../moduleInfo/chart/index.vue';
import PanelData from './PanelData.vue';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    refreshChart: {
        type: Boolean,
        default: true
    }
});
const curSelectedTime = inject(curSelectedTimeKey); // => src\views\runAnalysis\hooks\useEquipAnalysis.js
const isSplitScreen = inject(isSplitScreenKey); // => src\views\runAnalysis\hooks\useEquipAnalysis.js
const fiveMinuteTimes = inject(fiveMinuteTimesKey); // => src\views\runAnalysis\hooks\useBaseData.js
const AuxiliaryLineRef = ref();
const showPanel = ref(true);
const xPositions = ref([]);
const ChartRef = ref();

const changeSplitScreen = () => {
    isSplitScreen.value = !isSplitScreen.value;
};
const finished = () => {
    xPositions.value = ChartRef.value.getXPositons();
};
watch(
    () => props.data.length,
    () => {
        showPanel.value = props.data.length !== 0;
    }
);
watch(
    () => isSplitScreen.value,
    () => {
        if (showPanel.value) {
            showPanel.value = false;

            const time = setTimeout(() => {
                showPanel.value = true;

                nextTick(() => {
                    finished();
                });
                clearTimeout(time);
            }, 350);
        }
    }
);
</script>
<style lang="less" scoped>
.equip-analysis-left {
    width: 100%;
    transition: all 0.3s;
    :deep(.chart-title) {
        background-color: var(--gray-0);
        position: sticky;
        top: 0;
        z-index: 10;
    }
    :deep(.chart-item) {
        .chart-view-name-legend {
            position: relative;
            z-index: 2;
        }
        .chart-view-name {
            justify-content: left;
        }
        .chart-view-name-text {
            margin-bottom: 0 !important;
        }
        .chart-view-name-text-name {
            display: none;
        }
    }
    &.isSplitScreen {
        width: 50%;
    }
}
</style>
