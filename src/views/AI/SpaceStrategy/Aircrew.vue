<template>
    <div class="aircrew">
        <div v-if="isEmpty" class="is-empty fcc">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent"> </m-illustration>
        </div>

        <div v-if="!isEmpty" class="aircrew-left">
            <div class="aircrew-header fcb">
                <m-tabs v-model="aircrewData" :data="options" type="segment" size="small"></m-tabs>
                <m-checkbox v-if="chartData" v-model="value">{{ i18n.global.t('meos_control_web.info_card') }}</m-checkbox>
            </div>
            <div v-if="!isChartLoading && chartData" class="aircrew-content">
                <AuxiliaryLine
                    ref="AuxiliaryLineRef"
                    :key="aircrewData + currentEquipmentId + currentFloorId"
                    v-model="curSelectedTime"
                    v-model:panel="showAuxiliaryLine"
                    :show="chartData?.children?.length"
                    :times="fifteenMinuteTimes"
                    :x-positions="xPositions"
                    :default-left="0"
                    :default-right="0"
                    :default-top="0"
                >
                    <template #panel>
                        <Panel :time="curSelectedTime" :batch-query-period-data="[chartData]" />
                    </template>
                    <Chart
                        v-if="showChart && chartData?.children?.length"
                        ref="ChartRef"
                        :no-hover="showAuxiliaryLine"
                        :batch-query-period-data="[chartData]"
                        :show-title="false"
                        :custom-formatter="customFormatter"
                        @finished="finished"
                    >
                        <div>
                            <div>
                                <b>{{ curSelectedFloorObj.buildingName }}</b>
                            </div>
                            <div class="fc">
                                <b>{{ curSelectedFloorObj.localName }}</b
                                >&nbsp;
                                <div style="height: 2px; flex: 1; background-color: var(--gray-300)"></div>
                            </div>
                        </div>
                    </Chart>
                    <div v-else class="fcc wh100">
                        <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
                    </div>
                </AuxiliaryLine>
            </div>
            <div v-show="isChartLoading" class="chart-loading-container"></div>
        </div>
        <FloorMap
            v-if="!isEmpty"
            v-model:map-loading="mapLoading"
            v-model="currentFloorId"
            class="aircrew-right"
            :type="aircrewData"
            :spaces="floorMapSpaces"
            :equips="floorMapEquips"
            :time="dateTime"
        ></FloorMap>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import AuxiliaryLine from '../components/AuxiliaryLine.vue';
import Chart from '../components/chart/index.vue';
import Panel from '../components/chart/Panel.vue';
import { useAircrewStrategy } from '../hooks/useSpaceStrategy';
import FloorMap from '../components/floorMap/index.vue';
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { isEmpty as isEmptyFn } from '@/utils/tools';
import dayjs from 'dayjs';
import { MLoading } from 'meri-plus';

const props = defineProps({
    fifteenMinuteTimes: {
        type: Array,
        default: () => []
    },
    selectData: {
        type: Object,
        default: () => ({})
    },
    startTime: {
        type: String,
        default: ''
    },
    getOriginalTime: Function
});

const mapLoading = ref(true);
const loadingInstance = ref(null);

const {
    options,
    dateTime,
    aircrewData,
    chartData,
    curSelectedTime,
    ChartRef,
    xPositions,
    floorMapEquips,
    floorMapSpaces,
    currentEquipmentId,
    finished,
    getChartData,
    curSelectedFloorObj,
    isEmpty,
    isCurrentEquipLoaded,
    isCurrentEquipLoading,
    waitMapLoading
} = useAircrewStrategy(props);

const isChartLoading = computed(() => mapLoading.value || waitMapLoading.value || (isCurrentEquipLoading.value && !isCurrentEquipLoaded.value));

const showAuxiliaryLine = ref(true);
const showChart = ref(true);
const value = ref('checked');
const customFormatter = (arr, data) => {
    const obj = arr[0];
    const valueFn = item => {
        if (item.dataSources?.length) {
            return item.dataSources?.find(v => v.code * 1 === item.value)?.name || '--';
        }
        return isEmptyFn(item.value);
    };
    return `<div>
			<div>${dayjs(props.getOriginalTime(obj.axisValue)).format(i18n.global.t('meos_control_web.date_format2') + ' HH:mm')}</div>
			${arr
                .map(item => {
                    return `
					<div class="fc" style="margin-top: 8px;min-width: 160px;">
						<div style="display:inline-block;margin-right:4px;width:12px;height:4px;background-color:${item.data.color};"></div>
						<div style="margin-right: 8px;">${item.data.infoName}</div> <span style="color: #1B2129;">${valueFn(item.data)}&nbsp${data.unit}</span>
					</div>`;
                })
                .join('')}

	</div>`;
};
watch(
    () => value.value,
    () => {
        showAuxiliaryLine.value = value.value === 'checked';
    }
);

watch(
    () => isChartLoading.value,
    cur => {
        if (cur) {
            loadingInstance.value = MLoading.service({
                target: '.chart-loading-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            nextTick(() => {
                loadingInstance.value?.destroy?.();
            });
        }
    },
    {
        immediate: true
    }
);

const currentFloorId = ref();

watch(currentFloorId, () => {
    curSelectedFloorObj.value = getFloorInfoByFloorId(currentFloorId.value);
});

onUnmounted(() => {
    loadingInstance.value?.destroy?.();
    loadingInstance.value = null;
});
</script>
<style lang="less" scoped>
.aircrew {
    height: 100%;
    display: flex;
    position: relative;
    .aircrew-left {
        padding: 16px 20px;
        width: 50%;
        :deep(.chart-legend-item) {
            display: none;
        }
        .aircrew-header {
            margin-bottom: 8px;
            :deep(.m-tabs) {
                position: relative;
                z-index: 21;
            }
        }
    }
    .aircrew-right {
        width: 50%;
    }
    .aircrew-content {
        height: calc(100% - 36px);
    }
    .is-empty {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 20;
        background-color: white;
    }
}
.chart-loading-container {
    width: 100%;
    height: calc(100% - 36px);
}
</style>
