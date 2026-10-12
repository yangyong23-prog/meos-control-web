<template>
    <div class="pie-chart-statistic-container">
        <TitleWithPrefix :title="i18n.global.t('meos_control_web.dispatch_statistics')" />
        <div class="content-wrapper">
            <div ref="pieChartContainer" class="left-container">
                <div ref="pieChart" class="chart-dom"></div>
            </div>
            <div class="right-container">
                <div v-for="(item, index) in chartData" :key="index" class="row-item">
                    <div class="row-left">
                        <div class="legend" :style="{ backgroundColor: item?.color }"></div>
                        <div class="label">{{ `${item?.demandStatusName}：` }}</div>
                        <div v-ellipsis :class="['val-show', 'm-ellipsis']">{{ item?.demandCount ?? '--' }}</div>
                    </div>
                    <div v-if="item?.demandCount?.toString()" class="percent-show">{{ `${item?.demandRatio ?? '0'}%` }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
import * as echarts from 'echarts';
import TitleWithPrefix from '@/components/title-prefix/index.vue';
import { currentEnvParamInjectKey } from '../constant/injectKey';
import { ENV_ATTR_KEYS } from '../../constants/constant';
import { useBreakpoints } from '@vueuse/core';

const props = defineProps({
    spaceStatistics: {
        type: Object,
        default: () => {}
    }
});

const breakpoints = useBreakpoints({
    laptop: 0,
    desktop: 1600
});
const activeBreakpoint = breakpoints.active();
const isDesktop = computed(() => activeBreakpoint.value === 'desktop');

const pieChartContainer = ref(null);
const pieChart = ref(null);
let chartInstance = null;
const chartSize = ref({ width: 0, height: 0 });

const isSmallChart = computed(() => {
    return !isDesktop.value;
});

const demandStatusToColorMap = {
    TARGET_VALUE: '#A3D4B6', // 目标值
    UPPER_LIMIT_VALUE: '#F2B8A5', // 上限值
    COLD_STORAGE_VALUE: '#A1C8E5', // 蓄冷值
    LOWER_LIMIT_VALUE: '#A1C8E5', // 下限值
    HEAT_STORAGE_VALUE: '#F2B8A5' // 蓄热值
};

const curEnvParam = inject(currentEnvParamInjectKey);
const chartData = ref([]);

watch(
    [() => props?.spaceStatistics, () => curEnvParam?.value],
    ([curData, curEnv]) => {
        if (curData && curEnv) {
            if (curEnv === ENV_ATTR_KEYS.TEMPERATURE) {
                chartData.value = curData.tdb?.map(v => ({ ...v, color: demandStatusToColorMap[v?.demandStatus] }));
            } else {
                chartData.value = curData.cO2?.map(v => ({ ...v, color: demandStatusToColorMap[v?.demandStatus] }));
            }
        }
    },
    {
        immediate: true
    }
);

const { stop } = useResizeObserver(pieChartContainer, entries => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;

    chartSize.value = {
        width,
        height
    };

    chartInstance?.resize({
        width,
        height
    });
});

const initChart = (arr = []) => {
    if (!pieChart.value) {
        return;
    }
    if (!chartInstance) {
        chartInstance = echarts.init(pieChart.value);
    }

    const totalData = arr[0]?.demandTotal ?? 0;
    const isEmpty = totalData === 0;

    const option = {
        tooltip: {
            show: true
        },
        title: {
            text: isEmpty ? '--' : `${totalData}`,
            subtext: `${i18n.global.t('meos_control_web.total_space_count')}`,
            itemGap: 4,
            top: isSmallChart.value ? '34px' : '43px',
            left: 'center',
            textStyle: {
                fontSize: isSmallChart.value ? 18 : 24,
                fontWeight: 700,
                color: '#1F2329',
                width: 110,
                lineHeight: isSmallChart.value ? 22 : 29,
                overflow: 'truncate'
            },
            subtextStyle: {
                fontSize: isSmallChart.value ? 12 : 14,
                fontWeight: 400,
                color: '#626C78'
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['83.63%', '100%'],
                silent: isEmpty || true,
                hoverAnimation: false,
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: isEmpty
                    ? [
                          {
                              name: i18n.global.t('meos_control_web.target_value'),
                              value: 0,
                              itemStyle: {
                                  color: '#E1E5EB'
                              }
                          }
                      ]
                    : arr.map(v => {
                          return {
                              ...v,
                              itemStyle: {
                                  color: !v.value ? '#E1E5EB' : v.color
                              }
                          };
                      }),
                emphasis: {
                    scale: false,
                    label: {
                        show: false
                    }
                }
            }
        ]
    };
    chartInstance?.setOption(option);
};

watchEffect(() => {
    const newArr = chartData.value?.map(v => ({ ...v, name: v?.demandStatusName, value: v?.demandCount }));
    nextTick(() => {
        initChart(newArr);
    });
});
onBeforeUnmount(() => {
    stop?.();
    chartInstance?.dispose?.();
    chartInstance = null;
});
</script>

<style lang="less" scoped>
.pie-chart-statistic-container {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.content-wrapper {
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.left-container {
    height: 100%;
    position: relative;
    flex-shrink: 0;

    .chart-dom {
        position: absolute;
        width: 100%;
        height: 100%;
    }
}

.right-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    row-gap: 16px;
    height: 100%;
    max-width: 100%;

    .row-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        column-gap: 6px;
        min-width: 0;
    }

    .row-left {
        display: flex;
        align-items: center;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .legend {
        width: 14px;
        height: 14px;
        border-radius: 2px;
        background: transparent;
        margin-right: 4px;
        flex-shrink: 0;
    }

    .label {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        flex-shrink: 0;
    }

    .val-show {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
    }

    .percent-show {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 18px;
        flex-shrink: 0;
    }
}

@media (max-width: 1600px) {
    .content-wrapper {
        height: 110px;
        padding-inline: 12px;
        column-gap: 16px;

        .left-container {
            width: 110px;
        }

        .right-container {
            width: calc(100% - 126px);
        }
    }
}
@media (min-width: 1600px) {
    .content-wrapper {
        height: 140px;
        padding-inline: 24px;
        column-gap: 40px;

        .left-container {
            width: 140px;
        }

        .right-container {
            width: calc(100% - 180px);
        }
    }
}
</style>
