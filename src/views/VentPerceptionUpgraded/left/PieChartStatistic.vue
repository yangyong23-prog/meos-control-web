<template>
    <div ref="contentElementRef" :class="['acdash-pie-chart-statistic-container', width > 328 ? 'larger' : 'smaller']">
        <div class="content-wrapper">
            <div ref="pieChartContainer" class="left-container">
                <div class="pie-title">
                    <div v-ellipsis="{ y: true }" class="pie-title-text m-ellipsis">{{ extractAndFormatNumber(totalSpaces) }}</div>
                    <div class="pie-title-subtext">{{ i18n.global.t('meos_control_web.space_quantity') }}</div>
                </div>
                <div ref="pieChart" class="chart-dom"></div>
            </div>
            <div class="right-container">
                <div
                    v-for="(item, index) in statisData"
                    :key="index"
                    :class="['row-item', currentMouseOver == item.id ? 'active' : '', item.id === selectItemId ? 'selected' : '']"
                    @mouseover="handeLegendMouseOver(item, true)"
                    @mouseout="handeLegendMouseOver(item, false)"
                    @click="handleItemClick(item)"
                >
                    <div class="row-left">
                        <div class="legend" :style="{ backgroundColor: item?.color }"></div>
                        <div v-ellipsis class="label">{{ `${item?.name}` }}</div>
                        <m-tips v-if="item.tips" theme="darkTransparent" popover-class="tips" placement="top">
                            <template #content> {{ item.tips }} </template>
                            <IconMeriComponentDialogLinear class="icon" :size="14" color="#8B949E" />
                        </m-tips>
                        <div v-ellipsis="{ y: true }" :class="['val-show', 'm-ellipsis']">{{ item?.count ?? '--' }}</div>
                    </div>
                    <div v-if="item?.ratio" class="percent-show">({{ `${item?.ratio ?? '0'}` }})</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import * as echarts from 'echarts';
import { isNumber } from 'lodash';
import { useElementSize } from '@vueuse/core';
import { extractAndFormatNumber } from '@/utils';
// import { DASHBOARD_CARD_TEMPERATURE_STATUS_MAP, DASHBOARD_CARD_CO2_STATUS_MAP } from '../constants/constant';
const contentElementRef = ref();
const props = defineProps({
    dataStatistics: {
        type: Object,
        default: () => {}
    },
    disableInteractive: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: ''
    },
    selectItemId: {
        type: String,
        default: ''
    }
});
const currentMouseOver = ref('');
const pieChartContainer = ref(null);
const pieChart = ref(null);
let chartInstance = null;
const chartSize = ref({ width: 0, height: 0 });
const { width } = useElementSize(contentElementRef);
const totalSpaces = computed(() => {
    // return Object.values(props.dataStatistics).reduce((partialSum, a) => partialSum + a, 0);

    return props.dataStatistics?.total ?? 0;
});
const emits = defineEmits(['clickItem']);
const handleItemClick = item => {
    emits('clickItem', item);
};
const getRatioStr = ratio => {
    if (isNumber(ratio)) {
        return totalSpaces.value > 0 ? ((ratio / totalSpaces.value) * 100).toFixed(1) + '%' : '--';
    }
    return '';
};
const statisData = computed(() => {
    if (!props.dataStatistics) {
        return [];
    }
    const result = [];
    props.dataStatistics?.statusList?.forEach(obj => {
        result.push({
            ...obj,
            color: obj.legendColor,
            ratio: getRatioStr(obj.count)
        });
    });

    return result;
});
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
const handeLegendMouseOver = (item, mousein) => {
    if (props.disableInteractive) return;
    if (mousein) {
        currentMouseOver.value = item.id;
        chartInstance?.dispatchAction({
            type: 'downplay',
            seriesName: 'pieData'
        });
        chartInstance?.dispatchAction({
            type: 'highlight',
            seriesName: 'pieData',
            name: item.name
        });
    } else {
        currentMouseOver.value = '';
        chartInstance?.dispatchAction({
            type: 'downplay',
            seriesName: 'pieData'
        });
    }
};
const initChart = (arr = []) => {
    if (!pieChart.value) {
        return;
    }
    if (!chartInstance) {
        chartInstance = echarts.init(pieChart.value, null, { renderer: 'svg' });
        chartInstance.on('mouseover', { seriesName: 'pieData' }, function (params) {
            if (props.disableInteractive) return;
            currentMouseOver.value = params.data.id;
        });
        chartInstance.on('mouseout', { seriesName: 'pieData' }, function () {
            currentMouseOver.value = '';
        });
        chartInstance.on('click', { seriesName: 'pieData' }, function (params) {
            if (props.disableInteractive) return;
            handleItemClick(params.data);
        });
    }
    const option = {
        tooltip: {
            show: true,
            className: 'acdash-pie-chart-tooltip-container',
            extraCssText: 'z-index: 50',
            position: function (point) {
                // 固定在顶部
                return [point[0] - 10, point[1] - 40];
            },
            backgroundColor: 'transparant',
            borderColor: 'transparent',
            padding: 0,
            borderWidth: 0,
            formatter: item => {
                return `<div class="acdash-pctc-tooltip">
          <div class="acdash-pctc-rect" style="width:14px; height:14px; background: ${item.data.color}; border-radius: 2px;"></div>
          <span class="acdash-pctc-name">${item.data.name}</span>
          <span class="acdash-pctc-val">${item.data.count}</span>
          <span class="acdash-pctc-ratio">(${item.data.ratio})</span>
        </div>`;
            }
        },
        title: {
            show: false
        },
        series: [
            {
                name: 'pieData',
                type: 'pie',
                left: 8,
                right: 8,
                radius: ['82%', '100%'],
                silent: false,
                clockwise: true,
                cursor: props.disableInteractive ? 'default' : 'pointer',
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                emphasis: {
                    disabled: props.disableInteractive,
                    itemStyle: {
                        color: 'inherit'
                    }
                },
                select: {
                    disabled: props.disableInteractive
                },
                data: arr.map(v => {
                    return {
                        ...v,
                        value: v.count,
                        itemStyle: {
                            color: v.color
                        }
                    };
                })
            }
        ]
    };
    chartInstance?.setOption(option, true);
};
watchEffect(() => {
    const newArr = statisData.value?.map(v => ({ ...v }));
    nextTick(() => {
        initChart(newArr);
    });
});

onBeforeUnmount(() => {
    stop?.();
    chartInstance?.off?.('mouseover');
    chartInstance?.off?.('mouseout');
    chartInstance?.off?.('click');
    chartInstance?.dispose?.();
    chartInstance = null;
});
</script>

<style lang="less" scoped>
.acdash-pie-chart-statistic-container {
    width: 100%;
    display: flex;
    align-self: stretch;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    &.smaller {
        .left-container {
            width: 126px;
            height: 126px;
            .pie-title {
                .pie-title-text {
                    font-size: 14px;
                    line-height: 14px;
                    margin-bottom: 6px;
                }
                .pie-title-subtext {
                    font-size: 12px;
                    line-height: 12px;
                }
            }
        }
        .right-container {
            margin-left: 2px;
            .row-item {
                column-gap: 4px;
            }
        }
    }
}
.content-wrapper {
    display: flex;
    align-items: center;
}
.left-container {
    position: relative;
    flex-shrink: 0;
    display: flex;
    width: 172px;
    height: 172px;
    margin-left: -8px;
    .pie-title {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 5;
        transform: translate(-50%, -50%);
        text-align: center;
        white-space: nowrap;
        display: flex;
        flex-direction: column;
        align-items: center;
        .pie-title-text {
            font-family: PersagyBold;
            font-weight: 700;
            font-size: 20px;
            color: var(--gray-800, #2e3742);
            line-height: 20px;
            margin-bottom: 8px;
            max-width: 72px;
            width: 100%;
        }
        .pie-title-subtext {
            text-align: center;
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 14px;
            gap: 2px;
            display: flex;
            flex-direction: row;
            cursor: default;
            align-items: center;
        }
    }
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
    row-gap: 0px;
    margin-left: 24px;
    height: 100%;
    max-width: 100%;
    overflow: hidden;
    .row-item {
        display: flex;
        align-items: center;
        column-gap: 8px;
        padding: 6px 2px 6px 2px;
        border-radius: 4px;
        min-width: 0;

        &.active {
            cursor: pointer;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
        &.selected {
            background: var(--blue-100, #d9ebff);
        }
    }

    .row-left {
        display: flex;
        align-items: center;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        .icon {
            display: flex;
            align-self: center;
            justify-self: center;
            margin-left: 4px;
            svg {
                fill: #8b949e;
            }
            .icon-linear {
                fill: #8b949e;
            }
        }
    }

    .legend {
        width: 12px;
        height: 12px;
        border-radius: 2px;
        background: transparent;
        margin-right: 6px;
        flex-shrink: 0;
    }

    .label {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .val-show {
        margin-left: 8px;
        color: @grey-800;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        font-family: PersagyMedium;
        font-weight: 600;
        line-height: 18px;
        flex-shrink: 0;
    }

    .percent-show {
        color: @grey-500;
        font-size: 14px;
        font-family: PersagyMedium;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        flex-shrink: 0;
    }
}
</style>
<style lang="less">
.acdash-pie-chart-tooltip-container {
    background-color: none !important;
    border: none !important;
}
.acdash-pctc-tooltip {
    height: 32;
    border-radius: 4px;
    padding-top: 7px;
    padding-right: 12px;
    padding-bottom: 7px;
    padding-left: 12px;
    gap: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0px 0.5px 3px 0px #1b212914;
    box-shadow: 0px 3px 12px 0px #1b21291f;
    .acdash-pctc-name {
        font-weight: var(--platform-font-weight);
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #646c73;
    }
    .acdash-pctc-val {
        font-family: PersagyMedium;
        font-weight: 600;
        font-size: 14px;
        line-height: 100%;
        letter-spacing: 0px;
        color: #1f2329;
    }
    .acdash-pctc-ratio {
        font-family: PersagyMedium;
        font-weight: var(--platform-font-weight);
        font-size: 14px;
        line-height: 18px;
        letter-spacing: 0px;
        vertical-align: middle;
        color: #8b949e;
    }
}
</style>
