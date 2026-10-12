<template>
    <div
        v-if="municipalhotTopData?.length"
        class="chart-line-container"
        :class="{
            'chart-line-container-3': municipalhotTopData?.length === 3,
            'chart-line-container-2': municipalhotTopData?.length === 2,
            'chart-line-container-1': municipalhotTopData?.length === 1
        }"
    >
        <div v-for="item in municipalhotTopData" :key="item" class="chart-line-container-item">
            <LineFillCharts :is-shows="isShows" :series-data="item.data" :title="item.title" :unit="item.unit" :generate-array="generateArray" />
        </div>
    </div>
    <div v-if="municipalhotCenterData?.length" class="chart-line-container chart-line-container-2">
        <div v-for="(item, index) in municipalhotCenterData" :key="item" class="chart-line-container-item">
            <tab-title :modal-on="item?.defaultArr?.id" :title="item?.defaultArr?.title" :tab-data="item" @change-tab="changeTab" />
            <div ref="legendBox" class="chart-line-container-item-legend">
                <div ref="legendContainer" class="legend-container">
                    <span v-for="child in item.legendData" :key="child" class="legend-item">
                        <i class="icon" :style="{ background: child.color }"></i><span class="name">{{ child.name }}</span>
                    </span>
                </div>
                <legend-popover v-if="item.legendData?.length && ((index === 0 && isShowLegendLeft) || (index === 1 && isShowLegendRight))" :legend-data="item.legendData">
                    <div class="btn">{{ i18n.global.t('meos_control_web.view_legend') }}</div>
                </legend-popover>
            </div>
            <LineCharts :is-shows="isShows" :series-data="item?.echartData" :gas-name="item[0]?.aliseName" :unit="'℃'" :generate-array="generateArray" />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import LineCharts from './lineCharts.vue';
import LineFillCharts from './lineFillCharts.vue';
import TabTitle from './tabTitle.vue';
import LegendPopover from './legendPopover.vue';
import { toNumber } from 'lodash';
import dayjs from 'dayjs';

const props = defineProps({
    isShows: {
        type: Boolean,
        default: true
    },
    municipalhotTopData: {
        type: Array,
        default: () => []
    },
    municipalhotCenterData: {
        type: Array,
        default: () => []
    },
    coloredArray: {
        type: Array,
        default: () => []
    },
    generateArray: {
        type: Function,
        default: () => {}
    }
});
const curTabs = ref({});
const changeTab = data => {
    curTabs.value = data;
};
const legendBox = ref(null);
const legendContainer = ref(null);
const isShowLegendLeft = ref(false);
const isShowLegendRight = ref(false);

const formatterCenterData = () => {
    props.municipalhotCenterData.forEach((item, index) => {
        item?.forEach(child => {
            if (curTabs?.value?.id) {
                const { id } = curTabs.value;
                const { title } = curTabs.value;
                if (['lowDetaTemp', 'lowOutTemp'].includes(id) && index === 0) {
                    item.defaultArr = item.filter(thrid => {
                        return title === thrid?.title && id === thrid?.id;
                    })[0];
                }
                if (['highDetaTemp', 'highOutTemp'].includes(id) && index === 1) {
                    item.defaultArr = item.filter(thrid => {
                        return title === thrid?.title && id === thrid?.id;
                    })[0];
                }
            } else {
                item.defaultArr = Array.isArray(item) && item.length > 0 ? item[0] : {};
            }
            item.legendData = child?.data.map((legend, legendIndex) => {
                legend.color = props.coloredArray[legendIndex];
                return {
                    id: legend.objectId,
                    name: legend.objectName,
                    color: legend.color
                };
            });
            const data = item.defaultArr?.data;
            item.echartData = data?.map(echart => {
                const generateArray = props.generateArray();
                if (!Array.isArray(generateArray)) {
                    echart.showData = [];
                } else {
                    echart.showData = generateArray.map(time => {
                        const matchedData = echart?.data?.find(d => dayjs(d.time).format('HH:mm') === time);
                        return {
                            time: time,
                            value: matchedData ? toNumber(matchedData.ipValue).toFixed(2) || null : null
                        };
                    });
                }
                return {
                    smooth: false,
                    showSymbol: false,
                    data: echart.showData,
                    name: echart.objectName,
                    type: 'line',
                    lineStyle: {
                        width: 1.5,
                        color: echart.color
                    },
                    itemStyle: {
                        normal: {
                            color: echart.color
                        }
                    }
                };
            });
        });
    });
};
watchEffect(() => {
    if (props.municipalhotTopData?.length) {
        props.municipalhotTopData.forEach(data => {
            data?.data.forEach(child => {
                child?.data.map(echart => {
                    const generateArray = props.generateArray();
                    if (!Array.isArray(generateArray)) {
                        echart.showData = [];
                    } else {
                        echart.showData = generateArray.map(time => {
                            const matchedData = echart?.data.find(d => dayjs(d.time).format('HH:mm') === time);
                            return {
                                time: time,
                                value: matchedData ? toNumber(matchedData.ipValue).toFixed(2) || null : null
                            };
                        });
                    }
                });
            });
        });
    }
    if (props.municipalhotCenterData?.length) {
        formatterCenterData();
    }
    if (legendBox?.value && legendContainer?.value) {
        if (legendContainer?.value[0].clientWidth > legendBox?.value[0].clientWidth) {
            isShowLegendLeft.value = true;
        } else {
            isShowLegendLeft.value = false;
        }
        if (legendContainer?.value[1]?.clientWidth > legendBox?.value[1]?.clientWidth) {
            isShowLegendRight.value = true;
        } else {
            isShowLegendRight.value = false;
        }
    }
});
</script>
