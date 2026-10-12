<template>
    <div class="data-analysis">
        <div class="content-base-info">
            <div class="box-title fw700 fs16">{{ i18n.global.t('meos_control_web.basic_information') }}</div>
            <div class="demand-box fc">
                <div class="time-box" style="display: flex; line-height: 22px">
                    <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.business_hours_colon') }}</div>
                    <div class="fc" style="flex: 1; flex-wrap: wrap">
                        <template v-if="baseInfo?.businessTimeRangeList?.length > 1">
                            <div v-for="item in baseInfo.businessTimeRangeList" :key="item" class="time-item">{{ item }}</div>
                        </template>
                        <template v-else-if="baseInfo?.businessTimeRangeList?.length > 0">
                            <div class="time-item">{{ formattedWorkTime(baseInfo?.businessTimeRangeList) }}</div>
                        </template>
                        <template v-else>--</template>
                    </div>
                </div>
                <div class="time-box" style="display: flex; line-height: 22px">
                    <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.hvac_demand_time_colon') }}</div>
                    <div class="fc" style="flex: 1; flex-wrap: wrap">
                        <template v-if="!baseInfo.isAlgorithmCompute">
                            <template v-if="baseInfo.airConditioningDemandTimeRangeList.length">
                                <div v-for="item in baseInfo.airConditioningDemandTimeRangeList" :key="item" class="time-item">{{ item }}</div>
                            </template>
                            <template v-else>--</template>
                        </template>
                        <template v-else>{{ i18n.global.t('meos_control_web.algorithm_auto_calculate') }}</template>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-chart">
            <div class="box-title fcb m-ellipsis">
                <div class="fw700 fs16" style="align-self: self-start">
                    {{ SAPCETYPE[spaceType].name }}{{ i18n.global.t('meos_control_web.data_statistics')
                    }}<span class="fw500" style="color: var(--gray-600)">（{{ SAPCETYPE[spaceType].unit }}）</span>
                </div>
                <div class="fc" style="gap: 12px; flex-wrap: wrap; justify-content: flex-end">
                    <Legend :list="legends" :style-fun="styleFun" @item-click="infoCodeClick" />
                </div>
            </div>
            <div class="chart-total fc">
                <div
                    v-for="item in totalList"
                    :key="item.name"
                    class="chart-total-item fc m-ellipsis"
                    :class="[spaceType, activeData.code === item.code ? 'is-active' : '']"
                    :style="{ width: (1 / totalList.length) * 100 + '%', backgroundColor: activeData.code === item.code ? activeData.activeColor : '' }"
                    @click="totalItem(item)"
                >
                    {{ item.name }}
                    <span class="fs20 fw600 m-ellipsis ffCP" :style="{ color: item.color }">{{ getValue(item.value) }}</span>
                </div>
            </div>
            <div class="chart-box">
                <DataAnalysisChart
                    v-if="echartDatas.length && colors.length && !loading"
                    ref="DataAnalysisChartRef"
                    :echart-datas="echartDatas"
                    :colors="colors"
                    :active-data="activeData"
                />
            </div>
            <div class="chart-time-line">
                <CoolStorage :grouped-times="groupedTimes" :handle-text="handleText" />
            </div>
        </div>
        <div class="content-te">
            <div class="box-title fw700 fs16" style="padding-bottom: 12px">
                {{
                    i18n.global.t('meos_control_web.some_citerion', {
                        name: SAPCETYPE[spaceType].name,
                        type: AIR_TYPE[airSeason] ? `（${AIR_TYPE[airSeason]}）` : ''
                    })
                }}
            </div>
            <div v-if="spaceType === TEMPERATURE">
                <TemperatureBar :list="temperatureBars" />
            </div>
            <div v-else style="height: calc(100% - 34px); padding: 12px 0">
                <CO2Bar :obj="CO2Bars" />
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { formattedWorkTime } from '@/utils/viewUtils';
import { spaceTypeKey } from '../../injectionKey';
import { AIR_SPACE_STATUS_TDB, AIR_TYPE, SAPCETYPE, TEMPERATURE } from '../../variable';
import DataAnalysisChart from './DataAnalysisChart.vue';
import Legend from '../../components/Legend.vue';
import TemperatureBar from './TemperatureBar.vue';
import CO2Bar from './CO2Bar.vue';
import { curSelectedSpaceKey } from '../../injectionKey';
import CoolStorage from '../../energy/right/CoolStorage.vue';
const curSelectedSpace = inject(curSelectedSpaceKey); // ==> src\views\runAnalysis\hooks\useSpaceAnalysis.js

const props = defineProps({
    temperatureBars: {
        type: Array,
        default: () => []
    },
    // eslint-disable-next-line vue/prop-name-casing
    CO2Bars: {
        type: Array,
        default: () => []
    },
    baseInfo: {
        type: Object,
        default: () => {}
    },
    echartDatas: {
        type: Array,
        default: () => []
    },
    proportionStatistics: {
        type: Object,
        default: () => ({})
    },
    airSeason: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: true
    }
});

const totalList = computed(() => {
    if (spaceType.value === TEMPERATURE) {
        return [
            {
                ...props.proportionStatistics.TOO_COLD,
                code: 'TOO_COLD',
                name: i18n.global.t('meos_control_web.over_cooled'),
                value: props.proportionStatistics.TOO_COLD?.value || '0.00',
                color: AIR_SPACE_STATUS_TDB.TOO_COLD.textColor,
                activeColor: AIR_SPACE_STATUS_TDB.TOO_COLD.activeColor
            },
            {
                ...props.proportionStatistics.COLD,
                code: 'COLD',
                name: i18n.global.t('meos_control_web.too_cool'),
                value: props.proportionStatistics.COLD?.value || '0.00',
                color: AIR_SPACE_STATUS_TDB.COLD.textColor,
                activeColor: AIR_SPACE_STATUS_TDB.COLD.activeColor
            },
            {
                ...props.proportionStatistics.APPROPRIATE,
                code: 'APPROPRIATE',
                name: i18n.global.t('meos_control_web.compliant'),
                value: props.proportionStatistics.APPROPRIATE?.value,
                color: AIR_SPACE_STATUS_TDB.APPROPRIATE.textColor,
                activeColor: AIR_SPACE_STATUS_TDB.APPROPRIATE.activeColor
            },
            {
                ...props.proportionStatistics.HOT,
                code: 'HOT',
                name: i18n.global.t('meos_control_web.too_warm'),
                value: props.proportionStatistics.HOT?.value || '0.00',
                color: AIR_SPACE_STATUS_TDB.HOT.textColor,
                activeColor: AIR_SPACE_STATUS_TDB.HOT.activeColor
            },
            {
                ...props.proportionStatistics.TOO_HOT,
                code: 'TOO_HOT',
                name: i18n.global.t('meos_control_web.over_heated'),
                value: props.proportionStatistics.TOO_HOT?.value || '0.00',
                color: AIR_SPACE_STATUS_TDB.TOO_HOT.textColor,
                activeColor: AIR_SPACE_STATUS_TDB.TOO_HOT.activeColor
            }
        ];
    }
    return [
        {
            ...props.proportionStatistics.APPROPRIATE,
            code: 'APPROPRIATE',
            name: i18n.global.t('meos_control_web.compliant_today'),
            value: props.proportionStatistics.APPROPRIATE?.value,
            color: AIR_SPACE_STATUS_TDB.APPROPRIATE.textColor,
            activeColor: AIR_SPACE_STATUS_TDB.APPROPRIATE.activeColor
        },
        {
            ...props.proportionStatistics.HOT,
            code: 'HOT',
            name: i18n.global.t('meos_control_web.slightly_high'),
            value: props.proportionStatistics.HOT?.value || '0.00',
            color: AIR_SPACE_STATUS_TDB.HOT.textColor,
            activeColor: AIR_SPACE_STATUS_TDB.HOT.activeColor
        },
        {
            ...props.proportionStatistics.TOO_HOT,
            code: 'TOO_HOT',
            name: i18n.global.t('meos_control_web.too_high'),
            value: props.proportionStatistics.TOO_HOT?.value || '0.00',
            color: AIR_SPACE_STATUS_TDB.TOO_HOT.textColor,
            activeColor: AIR_SPACE_STATUS_TDB.TOO_HOT.activeColor
        }
    ];
});
const activeData = ref({
    ...props.proportionStatistics.TOO_HOT,
    code: 'TOO_HOT',
    name: i18n.global.t('meos_control_web.too_high'),
    value: props.proportionStatistics.TOO_HOT,
    color: AIR_SPACE_STATUS_TDB.TOO_HOT.textColor,
    activeColor: AIR_SPACE_STATUS_TDB.TOO_HOT.activeColor
});
const spaceType = inject(spaceTypeKey, ref(''));
const legends = ref([]);
const groupedTimes = computed(() => {
    const arr = curSelectedSpace.value.businessTime.map(item => {
        const start = item.split(',')[0];
        const end = item.split(',')[1];
        const timeText = curSelectedSpace.value.businessTime.map(v => v.replace(',', '-').replace('23:59', '24:00')).join();
        return [
            {
                time: start,
                type: 'cool_storage',
                text: `{{ i18n.global.t('meos_control_web.business_hours') }} ${timeText === '00:00-24:00' ? i18n.global.t('meos_control_web.all_day') : timeText}`
            },
            { time: end, type: 'cool_storage' }
        ];
    });
    return arr;
});
const handelLegends = () => {
    const arr = [
        {
            name: spaceType.value === TEMPERATURE ? i18n.global.t('meos_control_web.actual_temperature') : i18n.global.t('meos_control_web.actual_value'),
            show: true,
            color: '#2481F2'
        },
        {
            name: spaceType.value === TEMPERATURE ? i18n.global.t('meos_control_web.target_temperature') : i18n.global.t('meos_control_web.target_value'),
            show: true,
            color: '#33D4D2'
        }
    ];
    let arr1 = [];
    if (spaceType.value === TEMPERATURE) {
        arr1 = [
            {
                name: i18n.global.t('meos_control_web.over_cooled_threshold'),
                show: true,
                color: AIR_SPACE_STATUS_TDB.TOO_COLD.color
            },
            {
                name: i18n.global.t('meos_control_web.comfort_zone_lower'),
                show: true,
                color: AIR_SPACE_STATUS_TDB.COLD.color
            },
            {
                name: i18n.global.t('meos_control_web.comfort_zone_upper'),
                show: true,
                color: AIR_SPACE_STATUS_TDB.HOT.color
            },
            {
                name: i18n.global.t('meos_control_web.over_heat_threshold'),
                show: true,
                color: AIR_SPACE_STATUS_TDB.TOO_HOT.color
            }
        ];
    } else {
        arr1 = [
            {
                name: i18n.global.t('meos_control_web.comfort_zone_upper'),
                show: true,
                color: AIR_SPACE_STATUS_TDB.COLD.color
            },
            {
                name: i18n.global.t('meos_control_web.high_threshold'),
                show: true,
                color: AIR_SPACE_STATUS_TDB.TOO_HOT.color
            }
        ];
    }
    legends.value = [...arr, ...arr1];
};
const colors = computed(() => {
    return legends.value.map(item => item.color);
});
const handleText = item => {
    if (item.start === '00:00' && item.end === '23:59') {
        return i18n.global.t('meos_control_web.business_hours') + ' ' + i18n.global.t('meos_control_web.all_day');
    }
    const finalEnd = typeof item.end === 'string' ? item.end.replace('23:59', '24:00') : '';
    return `${i18n.global.t('meos_control_web.business_hours')} ${item.start}-${finalEnd}`;
};
const DataAnalysisChartRef = ref();
const getValue = number => {
    // const value = new Decimal(number) * 100;
    return number + '%';
};
const styleFun = (item, i) => {
    if (i > 1) {
        return {
            background: item.show
                ? `repeating-linear-gradient(90deg, ${item.color}, ${item.color} 2px, var(--gray-0) 2px, var(--gray-0) 4px)`
                : 'repeating-linear-gradient(90deg, #ccc, #ccc 2px, var(--gray-0) 2px, var(--gray-0) 4px)'
        };
    }
    return {
        background: item.show ? item.color : '#ccc'
    };
};
const infoCodeClick = data => {
    data.show = !data.show;
    DataAnalysisChartRef.value.legendToggleSelect(data.name, data.show);
};
const totalItem = data => {
    activeData.value = data;
    console.log(activeData.value);
    handelLegends();
};
onMounted(() => {
    handelLegends();
});
watch(
    () => props.loading,
    () => {
        activeData.value = {
            ...props.proportionStatistics.TOO_HOT,
            code: 'TOO_HOT',
            name: i18n.global.t('meos_control_web.too_high'),
            value: props.proportionStatistics.TOO_HOT,
            color: AIR_SPACE_STATUS_TDB.TOO_HOT.textColor,
            activeColor: AIR_SPACE_STATUS_TDB.TOO_HOT.activeColor
        };
    }
);
</script>
<style lang="less" scoped>
.data-analysis {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 16px 16px;
    & > div {
        border-radius: 8px;
        background-color: var(--gray-0);
        padding: 12px 16px;
    }
    .content-base-info {
        .demand-box {
            margin-top: 12px;
            gap: 12px;
            flex-wrap: wrap;
            .time-item {
                margin-right: 16px;
            }
        }
    }
    .content-chart {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        .chart-total {
            height: 42px;
            border-radius: 4px;
            padding: 8px 0px;
            line-height: 22px;
            gap: 8px;
            .chart-total-item {
                background-color: var(--gray-100);
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                span {
                    margin-left: 8px;
                }
            }
        }
        .chart-box {
            height: calc(100% - 106px);
        }
        .chart-time-line {
            height: 26px;
            :deep(.chart-box-cool-storage) {
                margin: 0 22px 0 46px;
            }
        }
    }
    .content-te {
        height: 144px;
    }
}
</style>
