<template>
    <div class="cool-run">
        <div class="fc title">
            <span v-ellipsis class="f14 title-left">{{ curvesData.groupName }}</span>
            <div v-if="realTime.length" class="fc temperature ml4 f12 title-right">
                <div v-for="(item, index) in realTime" :key="index">
                    <div v-if="item.infoCodeName || item.aliasName" :class="[index == 1 ? 'ml16' : '', 'fc']">
                        <span v-ellipsis class="ft mr4 m-ellipsis title-name" style="display: inline-block">{{ item.aliasName ? item.aliasName : item.infoCodeName }}：</span>
                        <template v-if="item.dataValue">
                            <m-popover v-if="item.infoCodeType == IOT_RUNNING" :enterable="false" theme="darkTransparent" :show-arrow="false">
                                <template #content>
                                    <p style="font-size: 14px">
                                        {{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ dayjs(item.dataTime).format('YYYY.MM.DD HH:mm:ss') }}
                                    </p>
                                    <p style="color: #c4c9cf; font-size: 12px">{{ i18n.global.t('meos_control_web.click_analysis_jump') }}</p>
                                </template>
                                <span class="flight cp" @click="itemInfo(item)">{{ item.dataValue }}{{ item.unit }}</span>
                            </m-popover>
                            <span v-else>{{ item.dataValue }}{{ item.unit }}</span>
                        </template>
                        <span v-else>--</span>
                    </div>
                </div>
            </div>
        </div>
        <Legend :legends="(legend as any)" />
        <div ref="chartDom" class="chart"></div>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import * as echarts from 'echarts';
import Legend from './Legend.vue';
import { PropType } from 'vue';
import dayjs from 'dayjs';
import { isEdge, jumpToAnalysis } from '@/utils/envUtils';
import { IOT_RUNNING } from '@/utils/globalVariables';
interface EchartLineData {
    name: string;
    data: Array<number | null>;
    smooth?: boolean;
    areaStyle?: Record<string, any>;
    lineStyle?: Record<string, any>;
}
const props = defineProps({
    data: {
        type: Array as PropType<EchartLineData[]>,
        default: () => []
    },
    unit: {
        type: String,
        default: ''
    },
    xAxisData: {
        type: Array as PropType<string[]>,
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
    dashed: Boolean
});
const realTime = ref<any[]>([]);
const min = ref<any>(null);
const max = ref<any>(null);
const selectModuleInfo = inject('selectModuleInfo');
watch(
    () => props.curvesData,
    () => {
        realTime.value = [];
        props.curvesData?.relInfoCodeConfigs?.map((item: any) => {
            if (item.infoCodeType === IOT_RUNNING) {
                realTime.value.push(item);
            }
            if (item.infoCodeType === 'DEMAND_TARGET') {
                realTime.value.push(item);
            }
        });
        const hasData = props.data.find(item => item.data.length);
        if (!hasData) {
            max.value = 30;
            min.value = 0;
        }
    },
    { immediate: true }
);
const uniqueItems = computed(() => [...new Set(props.xAxisData)]);
let myChart: any = null;
const chartDom = ref(null);

const color = ref(['#2481F2', '#33D4D2', '#FFD873', '#B286F5', '#7188A6', '#9FC9FB', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FFB800', '#FA9B96']);
const initChart = () => {
    myChart = echarts.init(chartDom.value);
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
            formatter(arr: any[]) {
                const time = `${dayjs(arr[0].axisValue).format(i18n.global.t('meos_control_web.date_format1'))} ${arr[0].axisValue.split(' ')[1]} `;
                return `
            <div style="margin-bottom: 10px;color: #1F2429;">${time}</div>
            ${arr
                .map((params: { data: number; color: any; seriesName: string }, i: number) => {
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
            right: 26,
            top: 30,
            bottom: 30,
            containLabel: true
        },

        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: uniqueItems.value,
            offset: 5,
            axisLabel: {
                interval: uniqueItems.value.length > 71 ? 71 : 'auto',
                // alignMaxLabel: 'right',
                showMaxLabel: uniqueItems.value.length > 71,
                fontSize: 12,
                padding: [0, 0, 0, 0],
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
        series:
            props.data?.map((item, i) => {
                const obj = { ...item, type: 'line', color: color.value[i], showSymbol: false, connectNulls: true };
                return obj;
            }) || []
    };
    myChart.clear();
    option && myChart.setOption(option);
    window.addEventListener('resize', resizeEcharts, false);
};
const itemInfo = item => {
    const jumpParams = {
        infoCode: item.infoCode,
        id: selectModuleInfo.value.id
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
    document.body.removeEventListener('resize', resizeEcharts, false);
});
watch(
    () => props.data,
    () => initChart(),
    { deep: true }
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
        height: 100%;
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
    .title {
        flex-shrink: 0;
        width: 100%;
        overflow: hidden;
        margin-bottom: 7px;
        .title-left {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .title-right {
            min-width: 0;
        }
    }
}
</style>
