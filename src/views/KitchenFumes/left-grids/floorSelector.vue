<template>
    <div class="floorSelector ml16">
        <div v-for="(items, indexs) in buildingFloorTree" :key="indexs">
            <div v-ellipsis class="ft1 f14 m-ellipsis" style="text-align: right">{{ items.buildingName }}</div>
            <div class="mt12 mb12">
                <div v-for="(floor, idx) in items.children" :key="idx" class="ruler fend">
                    <div class="fcc cp" style="position: relative" @click="scrollToPosition(floor)">
                        <div class="mr2 f14 fb7" :style="[FloorId === items.buildingId + '-' + floor.floorId ? 'color:#f55047' : '']">
                            {{ floor.floorName }}
                        </div>
                        <div v-if="floorAbnormalRecord[floor.floorId]" class="get-active-line"></div>
                        <div class="get-line" :style="[FloorId === items.buildingId + '-' + floor.floorId ? 'background:#f55047' : '']"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const floorAbnormalRecord = inject('floorAbnormalRecord');
const buildingFloorTree = inject('buildingFloorTree');
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
const FloorId = ref('');
console.log(props.floors, 'props.buildingId');
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
