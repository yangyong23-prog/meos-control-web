<template>
    <div id="eneryChart" class="energy-right">
        <ModuleLists :analysis-type-list="analysisTypeList" />
        <template v-if="noData">
            <div class="fcc" style="height: calc(100% - 72px)">
                <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" content=""></m-illustration>
            </div>
        </template>
        <div v-else class="chart-box">
            <div class="chart-box-container">
                <div class="chart-box-title fs16 fw707 fcb">
                    <div style="min-width: max-content">{{ i18n.global.t('meos_control_web.energy_consumption') }}</div>
                    <div class="fc fs14 fw500" style="gap: 12px">
                        <Legend
                            :list="energyEchartData"
                            show-field="showLegend"
                            :style-fun="
                                (item, i) => ({
                                    backgroundColor: item.showLegend ? COLORS[i] : '#ccc',
                                    height: item.type === 'bar' ? '12px' : '4px',
                                    borderRadius: item.type === 'bar' ? '2px' : '0px'
                                })
                            "
                            @item-click="objectClick"
                        />
                    </div>
                </div>
                <div class="chart-box-model">
                    <div v-if="isHover" class="chart-box-model-item" :style="style"></div>
                </div>
                <m-tips
                    v-if="noSelectChart"
                    :content="i18n.global.t('meos_control_web.switch_to_name', { name: noSelectChart?.yName || noSelectChart?.name })"
                    theme="darkTransparent"
                >
                    <div class="data-change fcc" @click="changeChart">{{ selectChart?.unit }} &nbsp;<ChangeSvg /></div>
                </m-tips>
                <div v-else class="no-data-change fcc">{{ selectChart?.unit }}</div>
                <Chart v-if="!loading" ref="ChartRef" :data="energyEchartData" :select-chart="selectChart" />
            </div>
            <CoolStorage :grouped-times="groupedTimes" @hover="handleHover" />
            <m-popover virtual-triggering :virtual-ref="virtualRef" trigger="manually" :is-open="isOpen" theme="darkTransparent" :show-arrow="false">
                <template #content>
                    <div>{{ COOL_THERMAL_STORAGE[HoverData.type].name }}{{ i18n.global.t('meos_control_web.time_period') }}</div>
                    <div class="fcc" style="margin-top: 4px">{{ HoverData.start }} - {{ HoverData.end }}</div>
                </template>
            </m-popover>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ModuleLists from './ModuleLists.vue';
import Chart from './Chart.vue';
import Legend from '../../components/Legend.vue';
import ChangeSvg from '@/assets/svg/change.svg';
import CoolStorage from './CoolStorage.vue';
import { THERMAL_STORAGE, COOL_THERMAL_STORAGE, COOL_STORAGE } from '../../variable';
import { groupTimeIntervals } from '../../hooks/useEnergyHook';
const isHover = ref(false);
const style = ref({});
const COLORS = [
    '#2481F2',
    '#33D4D2',
    '#FFD873',
    '#B286F5',
    '#2481F2',
    '#33D4D2',
    '#B286F5',
    '#7188A6',
    '#9FC9FB',
    '#E9A8E6',
    '#E6D1FF',
    '#D3B2FF',
    '#FCEF7E',
    '#FFB807',
    '#FA9B96'
];
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    energyEchartData: {
        type: Array,
        default: () => []
    },
    analysisTypeList: {
        type: Array,
        default: () => []
    },
    coldAndHeatStorage: {
        type: Array,
        default: () => []
    },
    noData: {
        type: Boolean,
        default: false
    }
});
const ChartRef = ref();
const HoverData = ref();
const virtualRef = ref();
const isOpen = ref(false);
const handleHover = (styleData, e, data) => {
    HoverData.value = data || {};
    if (styleData) {
        isHover.value = true;
        isOpen.value = true;
        style.value = { ...styleData, backgroundColor: COOL_THERMAL_STORAGE[data.type].color + '66' };
        virtualRef.value = e.target;
    } else {
        isHover.value = false;
        isOpen.value = false;
        virtualRef.value = null;
        style.value = {};
    }
};

const groupedTimes = computed(() => groupTimeIntervals(structuredClone(props.coldAndHeatStorage)));
const selectChart = computed(() => {
    return props.energyEchartData.find(item => item.select === true);
});
const noSelectChart = computed(() => {
    return props.energyEchartData.find(item => item.select === false);
});
const objectClick = data => {
    data.showLegend = !data.showLegend;
    ChartRef.value?.legendToggleSelect(data.name, data.showLegend);
};
const changeChart = () => {
    const select = props.energyEchartData.find(item => item.select === true);
    const noselect = props.energyEchartData.find(item => item.select === false);
    select.select = false;
    noselect.select = true;
    props.energyEchartData.forEach(item => {
        item.showLegend = true;
    });
};
</script>
<style lang="less" scoped>
.chart-legend {
    padding: 8px 0;
    height: 38px;
    gap: 16px;
    min-width: max-content;
    .chart-legend-item {
        cursor: pointer;
        &.noShow {
            color: #ccc;
        }
    }
    .chart-legend-item-line {
        height: 4px;
        width: 12px;
        margin-right: 4px;
    }
    .chart-legend-item-bar {
        height: 12px;
        width: 12px;
        margin-right: 4px;
        border-radius: 4px;
        margin-top: 2px;
    }
}
.energy-right {
    width: calc(100% - 340px);
    .chart-box {
        height: calc(100% - 72px);
        padding-bottom: 24px;
        &.noAnalysisTypeList {
            height: 100%;
        }
        .chart-box-container {
            height: calc(100% - 26px);
            position: relative;
            .chart-box-title {
                height: 48px;
                padding: 12px 24px;
                overflow: hidden;
            }
            .chart-box-model {
                position: absolute;
                top: 77px;
                left: 48px;
                width: calc(100% - 96px);
                height: calc(100% - 77px);
                padding: 0 48px;
                &-item {
                    position: absolute;
                    top: 0;
                    height: 100%;
                }
            }
            .data-change,
            .no-data-change {
                top: 44px;
                right: 20px;
                position: absolute;
                background-color: var(--gray-100);
                border-radius: 4px;
                height: 22px;
                padding: 0 4px;
                cursor: default;
                z-index: 2;
            }
            .data-change {
                cursor: pointer;
                &:hover {
                    background-color: var(--blue-100);
                }
            }
        }
    }
}
</style>
