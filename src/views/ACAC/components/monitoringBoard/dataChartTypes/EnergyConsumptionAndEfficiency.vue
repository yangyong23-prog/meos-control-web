<template>
    <CardContainer>
        <CardContainerItem v-for="(item, index) in echartDatas" :key="item.name" :span="span(index + 1)" :style="{ height: `${height}px` }">
            <EnergyConsumptionAndEfficiencyCard :item="item" :run-efficiency-data="runEfficiencyData" :height="height" :current-operating-mode-data="currentOperatingModeData2" />
        </CardContainerItem>
    </CardContainer>
</template>

<script setup>
import CardContainer from '../cardContainer/index.vue';
import CardContainerItem from '../cardContainer/CardContainerItem.vue';
import CardBox from '../components/CardBox.vue';
import EnergyConsumptionAndEfficiencyCard from './EnergyConsumptionAndEfficiencyCard.vue';
import EchartsPieAndLineBox from '@/components/echarts/EchartsPieAndLineBox.vue';
const props = defineProps({
    echartDatas: {
        type: Array,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    runEfficiencyData: {
        type: Array,
        default: () => []
    },
    currentOperatingModeData: {
        type: Array,
        default: () => []
    },
    currentOperatingModeData2: {
        type: Array,
        default: () => []
    },
    outdoorWeather: {
        type: Object,
        default: () => ({})
    }
});
const span = i => {
    const { length } = props.echartDatas;
    if (i === length && i % 2 !== 0) {
        return 12;
    }
    return 6;
};
</script>
<style lang="less" scoped></style>
