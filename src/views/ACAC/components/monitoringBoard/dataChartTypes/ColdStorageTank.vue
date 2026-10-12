<template>
    <CardContainer>
        <CardContainerItem v-for="(item, index) in echartDatas" :key="item.name" :span="span(index + 1)" :style="{ height: `${height}px` }">
            <ColdStorageTankCard
                v-if="list.length"
                :item="item"
                :select-options="list"
                :height="height"
                :equipment-list="equipmentList"
                :avg-cooling-storage-rate="avgCoolingStorageRate"
                :current-operating-mode-data="currentOperatingModeData"
            />
        </CardContainerItem>
    </CardContainer>
</template>

<script setup>
import CardContainer from '../cardContainer/index.vue';
import CardContainerItem from '../cardContainer/CardContainerItem.vue';
import ColdStorageTankCard from './ColdStorageTankCard.vue';
const props = defineProps({
    echartDatas: {
        type: Array,
        default: () => []
    },
    height: {
        type: Number,
        default: 0
    },
    equipmentList: {
        type: Array,
        default: () => []
    },
    currentOperatingModeData: {
        type: Array,
        default: () => []
    },
    avgCoolingStorageRate: {
        type: Object,
        default: () => ({})
    }
});
const list = ref([]);
const span = i => {
    const { length } = props.echartDatas;
    if (i === length && i % 2 !== 0) {
        return 12;
    }
    return 6;
};
const initEquipmentTypes = () => {
    const ret = {};
    for (let i = 0; i < props.equipmentList.length; i++) {
        const equip = props.equipmentList[i];
        ret[equip.id] = {
            id: equip.id,
            name: equip.localName
        };
    }
    list.value = Object.values(ret);
};
onMounted(() => {
    initEquipmentTypes();
});
</script>
<style lang="less" scoped></style>
