<template>
    <CardContainer>
        <CardContainerItem v-for="(item, index) in finalChartData" :key="item.name" :span="span(index + 1)" :style="{ height: `${height}px` }">
            <CardBox>
                <template #title>{{ item.name }}</template>
                <template #legend>
                    <ChartLegend
                        :legends="handleLegendShow(item)"
                        :name-key="item.legendShowEquipmentInstance ? 'object' : 'infoCode'"
                        :custom-color-fn="customColorFn"
                        @click-item="data => handleLegendClick(data, index)"
                /></template>
                <template #chart>
                    <template v-if="item?.legendShowEquipmentInstance && !props.selectedEquipment?.instanceList?.length">
                        <div class="h100 fcc" :style="{ color: '#626C78' }">{{ i18n.global.t('common.no_data') }}</div>
                    </template>
                    <EchartsPieAndLineBox ref="echartsRefs" :data="handleChartData(item)" />
                </template>
            </CardBox>
        </CardContainerItem>
    </CardContainer>
</template>

<script setup>
import CardContainer from '../cardContainer/index.vue';
import CardContainerItem from '../cardContainer/CardContainerItem.vue';
import CardBox from '../components/CardBox.vue';
import ChartLegend from '@/components/echarts/ChartLegend.vue';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
import { ECHART_COLORS } from '@/utils/globalVariables';
import i18n from '@/localization';

const props = defineProps({
    echartDatas: {
        type: Array,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    selectedEquipment: {
        type: Object,
        default: () => {}
    }
});

const echartsRefs = ref(null);

const finalChartData = computed(() => {
    const arr = props.echartDatas.filter(v => {
        if (v?.legendShowEquipmentInstance) {
            // 设备组下的设备实例列表
            return props.selectedEquipment?.instanceList?.length;
        }
        return true;
    });
    return arr;
});

const span = i => {
    const { length } = props.echartDatas;
    if (i === length && i % 2 !== 0) {
        return 12;
    }
    return 6;
};
const customColorFn = (item, index) => {
    const colorIndex = index % ECHART_COLORS.length;
    const color = ECHART_COLORS[colorIndex];
    return color;
};
const handleLegendShow = item => {
    let arr = [];
    const { instanceList = [], id } = props.selectedEquipment || {};
    const instanceIds = instanceList?.map(obj => obj.id);
    if (id) {
        if (!item.legendShowEquipmentInstance) {
            arr = item.chartArr.filter(config => id === config?.object?.id);
        } else {
            arr = item.chartArr.filter(config => instanceIds.includes(config?.object?.id));
        }
    } else {
        arr = item.chartArr;
    }
    return item.legendShowEquipmentInstance ? arr : arr.slice(0, 2);
};

const handleChartData = item => {
    let arr = [];
    const { instanceList = [], id } = props.selectedEquipment || {};
    const instanceIds = instanceList?.map(obj => obj.id);
    if (id) {
        if (!item.legendShowEquipmentInstance) {
            arr = item.chartArr.filter(config => id === config?.object?.id);
        } else {
            arr = item.chartArr.filter(config => instanceIds.includes(config?.object?.id));
        }
    } else {
        arr = item.chartArr;
    }
    arr.forEach((item, index) => {
        const colorIndex = index % ECHART_COLORS.length;
        const color = ECHART_COLORS[colorIndex];
        item.lineStyle.color = color;
    });
    return arr;
};
const handleLegendClick = (item, index) => {
    item.legendShow = !item.legendShow;
    // 触发图表 legend 切换事件
    echartsRefs.value[index].legendToggleSelectFun(item.name, item.legendShow);
};
</script>
<style lang="less" scoped></style>
