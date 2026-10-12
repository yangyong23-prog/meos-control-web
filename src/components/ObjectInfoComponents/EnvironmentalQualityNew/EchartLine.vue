<template>
    <div ref="boxWrapRef" class="cool-run">
        <div class="fb">
            <div class="left fc">
                <span class="f14">{{ curvesData.name ?? '' }}</span>
                <div v-if="currentInfo" class="fc temperature ml4 f12">
                    <div class="fc">
                        <span v-ellipsis class="ft mr4 m-ellipsis title-name" style="display: inline-block">{{ i18n.global.t('meos_control_web.current_value_colon') }}</span>
                        <template v-if="currentInfo?.dataValue">
                            <m-popover v-if="currentInfo.infoCodeType == IOT_RUNNING" :enterable="false" theme="darkTransparent" :show-arrow="false">
                                <template #content>
                                    <p style="font-size: 14px">
                                        {{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ dayjs(currentInfo.dataTime).format('YYYY.MM.DD HH:mm:ss') }}
                                    </p>
                                    <p style="color: #c4c9cf; font-size: 12px">({{ i18n.global.t('meos_control_web.click_jump_data_analysis') }})</p>
                                </template>
                                <span class="flight cp" @click="itemInfo(currentInfo)">{{ currentInfo.dataValue }}{{ currentInfo.unit }}</span>
                            </m-popover>
                            <span v-else>{{ currentInfo.dataValue }}{{ currentInfo.unit }}</span>
                        </template>
                        <span v-else>--</span>
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="expand-wrap fc" @click.stop="emits('openItem', curvesData.groupCode)">
                    {{ isOpen ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}
                    <IconMeriComponentChevronUp v-if="isOpen" :size="16"></IconMeriComponentChevronUp>
                    <IconMeriComponentChevronDown v-else :size="16"></IconMeriComponentChevronDown>
                </div>
            </div>
        </div>

        <div v-show="isOpen" ref="chartDom" class="chart"></div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import * as echarts from 'echarts';
// import Legend from './Legend.vue';
import { useResizeObserver } from '@vueuse/core';
import { IconMeriComponentChevronDown, IconMeriComponentChevronUp } from 'meri-icon';
import dayjs from 'dayjs';
import { isEdge, jumpToAnalysis } from '@/utils/envUtils';
import DockSingleton from '@/hooks/responsiveDock';
import { debounce } from 'lodash';
import { IOT_RUNNING } from '@/utils/globalVariables';
const { getIotData } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    unit: {
        type: String,
        default: ''
    },
    xAxisData: {
        type: Array,
        default: () => []
    },
    curvesData: {
        type: Object,
        default: () => {}
    },
    legend: {
        type: Array,
        default: () => []
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    dashed: Boolean
});
const emits = defineEmits(['openItem']);
const min = ref(null);
const max = ref(null);
const boxWrapRef = ref(null);

const currentInfo = computed(() => {
    if (props.curvesData) {
        const { objectId, iotRunningData } = props.curvesData;
        return getIotData(objectId, iotRunningData?.infoCode);
    }
    return {};
});
watch(
    () => props.curvesData,
    () => {
        const hasData = props.data.find(item => item.data.length);
        if (!hasData) {
            max.value = 30;
            min.value = 0;
        }
    },
    { immediate: true }
);
const uniqueItems = computed(() => [...new Set(props.xAxisData)]);
let myChart = null,
    resizeObserver;
const chartDom = ref(null);

const color = ref(['#2481F2', '#33D4D2', '#FFD873', '#B286F5', '#7188A6', '#9FC9FB', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FFB800', '#FA9B96']);
const initChart = () => {
    if (!chartDom.value) {
        return;
    }
    if (!myChart) {
        myChart = echarts.init(chartDom.value);
        resizeObserver = useResizeObserver(boxWrapRef.value, debounce(resizeEcharts, 50));
    }
    let hasValue = false;
    const seriesList =
        props.data?.map((item, i) => {
            if (item.data?.length > 0) {
                hasValue = item.data?.some(v => v !== undefined);
            }
            const obj = { ...item, type: 'line', color: color.value[i], showSymbol: false, connectNulls: true };
            return obj;
        }) || [];

    max.value = hasValue ? null : 30;
    min.value = hasValue ? null : 0;

    const option = {
        color: color.value,
        title: {
            show: true,
            text: props.unit,
            textStyle: {
                fontWeight: 'normal',
                fontSize: '14px'
            }
        },
        tooltip: {
            trigger: 'axis',
            confine: true,
            formatter(arr) {
                const time = `${dayjs(arr[0].axisValue).format(i18n.global.t('meos_control_web.date_format1'))} ${arr[0].axisValue.split(' ')[1]} `;
                return `
            <div style="margin-bottom: 10px;color: #1F2429;">${time}</div>
            ${arr
                .map((params, i) => {
                    const number = params.data || params.data === 0 ? `${params.data}${props.unit}` : '--';
                    return `
                <div class="fc" style="display: flex;margin-bottom: ${i === arr.length - 1 ? 0 : 14}px;color: #1F2429;">
                    <div style="width:16px;border-top:2px ${i > 1 && !params.seriesName.includes(i18n.global.t('meos_control_web.chiller')) && props.dashed ? 'dashed' : 'solid'} ${
                        params.color
                    };margin-right: 8px;"></div>
                    <div style="align-self: start;flex: 1">${params.seriesName}</div>
                    <div style="margin-left: 32px;">${number}</div>
                </div>
                `;
                })
                .join('')}
            `;
            }
        },
        legend: {
            show: false
        },
        grid: {
            left: 0,
            right: isEdge() ? 0 : 20,
            top: '31px',
            bottom: 30,
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: uniqueItems.value,
            offset: 5,
            axisLabel: {
                interval: isEdge() ? 4 : 55,
                fontSize: 12,
                padding: isEdge() ? [0, 0, 0, 20] : [0, 0, 0, 0],
                formatter: function (value, index) {
                    return `${dayjs(value).format('HH:mm \n ' + i18n.global.t('meos_control_web.date_format1'))}`;
                    // return '<span style="padding-left:20px">' + value + '</span>';
                }
                // showMaxLabel: true
            },
            axisTick: {
                show: false // 设置 X 轴刻度不显示
            },
            axisLine: {
                lineStyle: {
                    color: '#8D9399'
                }
            }
        },
        yAxis: {
            type: 'value',
            min: min.value,
            max: max.value,
            splitNumber: 3,
            splitLine: {
                lineStyle: {
                    color: '#E4E5E7',
                    type: 'dashed'
                }
            }
        },
        series: seriesList
    };

    myChart.clear();
    option && myChart.setOption(option);
    resizeEcharts();
};
const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: props.curvesData?.objectId
    };
    jumpToAnalysis(jumpParams);
};
const resizeEcharts = () => {
    myChart.resize();
    // initChart()
};
onMounted(() => {
    nextTick(() => {
        initChart();
    });
});
onUnmounted(() => {
    resizeObserver?.stop();
});
watch(
    () => props.data,
    () => initChart(),
    { deep: true }
);
watch(
    () => props.isOpen,
    () => {
        if (props.isOpen) {
            nextTick(() => {
                resizeEcharts();
            });
        }
    }
);
</script>
<style lang="less" scoped>
@media screen and (max-width: 1600px) {
    .title-name {
        max-width: 95px;
    }
}
.cool-run {
    height: 100%;
    width: 100%;
    position: relative;
    & > .chart {
        height: 196px;
        width: 100%;
    }
    .temperature {
        border-radius: 4px;
        background: var(--blue-50, #ebf6ff);
        padding: 4px;
    }
    .get-line {
        width: 1px;
        height: 10px;
        background: var(--blue-100, #d9ebff);
    }
}
.right {
    display: flex;

    justify-content: center;
    align-items: center;

    .expand-wrap {
        display: flex;
        padding: 2px 4px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }

        color: var(--gray-500, #8b949e);
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
}
</style>
