<template>
    <CardContainer>
        <CardContainerItem v-for="(item, index) in chartDatas" :key="item.name" :span="span(index + 1)" :style="{ height: `${height}px` }">
            <CoolingSideCard
                v-if="list.length"
                :item="item"
                :select-options="list"
                :height="height"
                :equipment-list="equipmentList"
                :outdoor-weather="outdoorWeather"
                :current-operating-mode-data="currentOperatingModeData"
            />
        </CardContainerItem>
    </CardContainer>
</template>

<script setup>
import DockSingleton from '@/hooks/responsiveDock';
import CoolingSideCard from './CoolingSideCard.vue';
import CardContainer from '../cardContainer/index.vue';
import { systemIdKey } from '@/views/ACAC/hooks/useBaseHook';
import { IS_COOL_STORE } from '@/views/ACAC/variables';
import CardContainerItem from '../cardContainer/CardContainerItem.vue';
const { getIotData } = DockSingleton.getInstance();
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
    outdoorWeather: {
        type: Object,
        default: () => ({})
    }
});
const list = ref([]);

const systemId = inject(systemIdKey);
const chartDatas = computed(() => {
    const hasCoolStore = getIotData(systemId.value, IS_COOL_STORE);
    const ret = [];
    props.echartDatas.forEach(dat => {
        const validArr = [];
        dat.chartArr.forEach(arr => {
            if (arr.infoCode.id === 'coolingTowerOutTempSet' || arr.infoCode.id === 'coolWaterDetaTempSet') {
                if (hasCoolStore.dataValue !== '1') {
                    validArr.push(arr);
                }
            } else if (
                arr.infoCode.id === 'coolingTowerOutTempStorageSet' ||
                arr.infoCode.id === 'coolingWaterSupplyReturnDiffStorageSet' ||
                arr.infoCode.id === 'coolingTowerOutTempCoolingSet' ||
                arr.infoCode.id === 'coolingWaterSupplyReturnDiffCoolingSet'
            ) {
                if (hasCoolStore.dataValue === '1') {
                    validArr.push(arr);
                }
            } else {
                validArr.push(arr);
            }
        });
        if (validArr.length) {
            ret.push(dat);
        }
    });
    return ret;
});
const span = i => {
    const { length } = chartDatas.value;
    if (i === length && i % 2 !== 0) {
        return 12;
    }
    return 6;
};
onMounted(() => {
    initEquipmentTypes();
});
const initEquipmentTypes = () => {
    const ret = {};
    for (let i = 0; i < props.equipmentList.length; i++) {
        const equip = props.equipmentList[i];
        if (equip.parentId) {
            if (ret[equip.parentId]) {
                const find = ret[equip.parentId].children.find(child => child.id === equip.id);
                if (!find) {
                    ret[equip.parentId].children.push({
                        id: equip.id,
                        name: equip.localName
                    });
                }
            } else {
                ret[equip.parentId] = {
                    id: equip.parentId,
                    name: equip.parentName,
                    children: [
                        {
                            id: equip.id,
                            name: equip.localName
                        }
                    ]
                };
            }
        } else {
            ret[equip.id] = {
                id: equip.id,
                name: equip.localName
            };
        }
    }
    list.value = Object.values(ret);
};
</script>
<style lang="less" scoped></style>
