<template>
    <CardContainer>
        <template v-if="!finalChartData.length">
            <m-illustration
                :title="i18n.global.t('meos_control_web.no_content')"
                type="noContent"
                class="fcc"
                :style="{ height: '100%', position: 'absolute', top: '0', left: '0', width: '100%' }"
            ></m-illustration>
        </template>
        <CardContainerItem v-for="(item, index) in finalChartData" v-else :key="item.name" :span="span(index + 1)" :style="{ height: `${height}px` }">
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
    // 选中的设备组下的设备实例IDs
    const instanceIds = props.selectedEquipment?.instanceList?.map(obj => obj.id);
    // 选中的设备组
    const selectId = props.selectedEquipment?.id;
    const arr = props.echartDatas.filter(v => {
        let tempArr = [];
        if (selectId) {
            if (!v.legendShowEquipmentInstance) {
                // 全量图表信息中，某个设备组的信息点规则匹配成功时，返回其图表信息
                tempArr = v.chartArr.filter(config => selectId === config?.object?.id);
            } else {
                // 全量图表信息中，某个设备组下的设备实例Ids的信息点规则匹配成功时，返回其图表信息
                tempArr = v.chartArr.filter(config => instanceIds.includes(config?.object?.id));
            }
        } else {
            tempArr = v.chartArr;
        }

        if (v?.legendShowEquipmentInstance) {
            // 设备组下的设备实例列表
            return props.selectedEquipment?.instanceList?.length && tempArr.length;
        }
        return tempArr.length;
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
    arr.forEach((arrItem, index) => {
        const colorIndex = index % ECHART_COLORS.length;
        const color = ECHART_COLORS[colorIndex];
        arrItem.lineStyle.color = color;
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
