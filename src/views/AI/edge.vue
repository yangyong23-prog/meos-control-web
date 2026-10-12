<template>
    <div class="AI-container wh100">
        <!-- 数据加载 -->
        <LoadingView v-if="viewLoading" @loaded="loaded"></LoadingView>
        <!-- 暂无数据 -->
        <img v-if="!viewLoading && AISystemNoData" width="90" height="106" class="noData-icon" src="@/assets/imgs/noData.png" />
        <!-- 首页 -->
        <HomeView v-show="showHomeView"></HomeView>
        <SpaceStrategy v-if="showSpaceStrategy" :select-code="selectCode" :stgy-code-list="stgyCodeList" @back="showSpaceStrategy = false" />
        <StrategyEvaluation v-if="showStrategyEvaluation" :select-code="selectCode" :stgy-code-list="stgyCodeList" :start-time="startTime" @back="showStrategyEvaluation = false" />
        <SpacePrediction
            v-if="showSpacePrediction"
            :prediction-type="predictionType"
            :select-code="selectCode"
            :stgy-code-list="stgyCodeList"
            :chart-type="predictionClodChartType"
            :space-type="predictionSpaceChartType"
            :fix-type="fixType"
            :is-dis-content="isDisContent"
            :space-ids="spaceIds"
            @back="showSpacePrediction = false"
        />
    </div>
</template>

<script setup>
import i18n from '@/localization';
// import { MLoading } from 'meri-plus';
import LoadingView from './components/loading.vue';
import HomeView from './components/home/index.vue';
import { useStaticDataHook } from './hooks/useStaticData';
import SpaceStrategy from './SpaceStrategy/index.vue';
import SpacePrediction from './SpacePrediction/index.vue';
import StrategyEvaluation from './StrategyEvaluation/index.vue';
import treeBuildFloorStore from '../../store/treeBuildFloor';
import { showHomeViewKey } from './injectionKey';
import { CHART_TYPE, TEMPERATURE, SAPCETYPE, CO2 } from './variable';
import emitter from '@/utils/bus';
import dayjs from 'dayjs';
import baseStore from '@/store/baseStore';

const {
    AISystemLoading,
    AISystemNoData,
    showSpaceStrategy,
    showSpacePrediction,
    showStrategyEvaluation,
    strategyOverview,
    viewLoading,
    currentSystemId,
    getHumidityStandardConfig,
    hasSomeEnableHumidity,
    humidityDataMap
} = useStaticDataHook();

const predictionClodChartType = ref(CHART_TYPE.CoolingCapacityView);
const predictionSpaceChartType = ref(TEMPERATURE);
const fixType = ref(false);
const isDisContent = ref(false);
const spaceIds = ref(undefined);

onMounted(() => {
    treeBuildFloorStore().handleTreeBuildingFloorData();
});

const getSelectedStartTime = detail => {
    const systemId = currentSystemId.value;
    const { content } = detail || {};
    const predACAC = content?.data?.[0]?.predACAC;
    if (predACAC && systemId && predACAC[systemId]?.length > 0) {
        const timeStr = predACAC[systemId][0].time;
        return dayjs(timeStr).format('YYYY-MM-DD');
    }
    return null;
};

const fetchHumidity = data => {
    const { stgyIndex, stgyCodeIndex } = data;
    const tempData = structuredClone(strategyOverview.value[stgyIndex].stgyCodeList);
    const detail = tempData[stgyCodeIndex];
    const selectedStartTime = getSelectedStartTime(detail);

    const itemKey = `${baseStore().projectId}-${selectedStartTime}`;
    if (selectedStartTime && humidityDataMap.value.has(itemKey)) {
        hasSomeEnableHumidity.value = humidityDataMap.value.get(itemKey);
    } else {
        hasSomeEnableHumidity.value = false;
        getHumidityStandardConfig(selectedStartTime);
    }
};

const showHomeView = computed(() => {
    return !viewLoading.value && !AISystemNoData.value && !showSpaceStrategy.value && !showSpacePrediction.value && !showStrategyEvaluation.value;
});

watch(showSpacePrediction, value => {
    if (!value) {
        predictionSpaceChartType.value = TEMPERATURE;
        predictionClodChartType.value = CHART_TYPE.CoolingCapacityView;
        fixType.value = false;
        spaceIds.value = undefined;
        isDisContent.value = false;
    }
});

const selectCode = ref('');
const startTime = ref('');
const stgyCodeList = ref([]);
const predictionType = ref('');

// 监听策略模生成发来的数据 切换页面
emitter.off('PG-item-click');
emitter.on('PG-item-click', data => {
    fetchHumidity(data);
    const { stgyIndex, stgyCodeIndex } = data;
    showSpaceStrategy.value = true;
    stgyCodeList.value = structuredClone(strategyOverview.value[stgyIndex].stgyCodeList);
    selectCode.value = strategyOverview.value[stgyIndex].stgyCodeList[stgyCodeIndex].code;
});

// 监听策略模预测发来的数据 切换页面
emitter.off('PP-item-click');
emitter.on('PP-item-click', data => {
    fetchHumidity(data);
    const { stgyIndex, stgyCodeIndex, type } = data;
    showSpacePrediction.value = true;
    stgyCodeList.value = structuredClone(strategyOverview.value[stgyIndex].stgyCodeList);
    selectCode.value = strategyOverview.value[stgyIndex].stgyCodeList[stgyCodeIndex].code;
    predictionType.value = type;
});

// 监听策略评价发来的数据 切换页面
emitter.off('PE-item-click');
emitter.on('PE-item-click', data => {
    fetchHumidity(data);
    const { stgyIndex, stgyCodeIndex } = data;
    showStrategyEvaluation.value = true;
    stgyCodeList.value = structuredClone(strategyOverview.value[stgyIndex].stgyCodeList);
    const stra = strategyOverview.value[stgyIndex];
    startTime.value = stra.startTime;
    selectCode.value = stra.stgyCodeList[stgyCodeIndex]?.code ?? null;
});

// 策略评价进入详情界面后点击事件
emitter.off('PE-detail-click');
emitter.on('PE-detail-click', data => {
    const { code, type, systemId } = data;
    showSpacePrediction.value = true;
    selectCode.value = code;
    predictionType.value = type;
    predictionSpaceChartType.value = systemId;
    predictionClodChartType.value = systemId;
    fixType.value = true;
    isDisContent.value = data.isDisContent ? true : false;
    const stgy = stgyCodeList.value.find(item => code === item.code);

    if (stgy) {
        const selectedStartTime = getSelectedStartTime(stgy);
        const itemKey = `${baseStore().projectId}-${selectedStartTime}`;
        if (selectedStartTime && humidityDataMap.value.has(itemKey)) {
            hasSomeEnableHumidity.value = humidityDataMap.value.get(itemKey);
        } else {
            hasSomeEnableHumidity.value = false;
            getHumidityStandardConfig(selectedStartTime);
        }
    }
    if (isDisContent.value && stgy && stgy.content.data[0].stgyIndicator.rigidUnsatisfiedSpaceIds) {
        spaceIds.value = stgy.content.data[0].stgyIndicator.rigidUnsatisfiedSpaceIds;
    }
});

provide(showHomeViewKey, showHomeView);
</script>

<style lang="less" scoped>
.AI-container {
    position: relative;
    overflow: hidden;
    min-width: 1440px;
    overflow-x: auto;
    background-color: #f6faff;
    .noData-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transition: all;
        transform: translateX(-50%) translateY(-50%);
    }
}
</style>
