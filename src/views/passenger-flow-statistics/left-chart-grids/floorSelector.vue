<template>
    <div class="floorSelector">
        <div v-for="(items, indexs) in data" :key="indexs">
            <div v-ellipsis class="ft1 f14 m-ellipsis" style="text-align: right">{{ items.buildingLocalName }}</div>
            <div class="mt12 mb12">
                <div v-for="(floor, idx) in items?.floors" :key="idx" class="ruler fend" @click="scrollToPosition(floor)">
                    <div class="fcc cp" style="position: relative">
                        <div class="mr2 f14 fb7" :style="[floor?.abnormal ? 'color:#f55047' : '']">
                            {{ floor.floorLocalId }}
                        </div>
                        <div v-if="floor?.abnormal" class="get-active-line"></div>
                        <div class="get-line" :style="[floor?.abnormal ? 'background:#f55047' : '']"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {
    spacePassengerFlowDataInjectKey,
    closeDetailDrawerInjectKey,
    openDetailDrawerInjectKey,
    currentFloorObjInjectKey,
    doorsGroupDataListInjectKey,
    doorsGroupDataLoadingInjectKey
} from '../constant/injectKey';
import DockSingleton from '@/hooks/responsiveDock';
const { getObjectAbnormalStatus } = DockSingleton.getInstance();
const emit = defineEmits(['floor-select']);
const props = defineProps({
    floors: {
        type: Array,
        default: () => []
    },
    abnormalFloors: {
        type: Array,
        default: () => []
    }
});
const floorAbnormalRecord = inject('floorAbnormalRecord');
const buildingFloorTree = inject(spacePassengerFlowDataInjectKey);
const data = computed(() => {
    buildingFloorTree.value.forEach(item => {
        item.floors.forEach(floor => {
            floor.spaces.forEach(space => {
                space.abnormal = getObjectAbnormalStatus(space.id);
            });
        });
    });
    return buildingFloorTree.value;
});
const FloorId = ref('');
const scrollToPosition = items => {
    FloorId.value = items.buildingId + '-' + items.floorId;
    window.scrollTo({
        top: 200,
        behavior: 'smooth'
    });
    const data = {
        unitId: items.buildingId,
        floorId: items.floorId
    };
    emit('floor-select', data);
};
</script>
<style lang="less" scoped>
.floorSelector {
    width: 52px;
    margin-top: 16px;
    margin-right: 2px;
    .ruler {
        width: 100%;
        height: 48px;
        border-right: 1px solid #c4c9cf;
        .get-line {
            width: 12px;
            height: 1px;
            background-color: #c4c9cf;
        }
        .colorRed {
            background-color: #f55047;
        }
        .get-active-line {
            width: 4px;
            height: 4px;
            background-color: #f55047;
            border-radius: 50%;
            position: absolute;
            top: 53%;
            left: 65%;
            transform: translate(-59%, -59%);
        }
    }
    .ruler:hover {
        color: #246fe5;
        .get-line {
            background-color: #246fe5;
        }
    }
}
</style>
