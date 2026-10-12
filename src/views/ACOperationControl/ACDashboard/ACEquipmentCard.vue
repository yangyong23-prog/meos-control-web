<template>
    <div v-if="currentItem" class="acequip-card-wrap">
        <EquipmentCardItem :item="currentItem" />
        <div v-if="!sideLayout" class="ac-paginator-wrap">
            <Paginator v-model="currentIndex" :total-pages="equipmentStatusStatisticsList.length" />
        </div>
    </div>
</template>
<script setup>
import Paginator from './Paginator.vue';
import { equipmentStatusStatisticsListKey } from '../hooks/useACGlobalData';
import EquipmentCardItem from '../components/equipment-card-item.vue';
const equipmentStatusStatisticsList = inject(equipmentStatusStatisticsListKey);
const currentIndex = ref(0);
const currentItem = computed(() => {
    if (equipmentStatusStatisticsList && equipmentStatusStatisticsList.value) {
        return equipmentStatusStatisticsList.value[currentIndex.value];
    }
    return null;
});
</script>
<style lang="less" scoped>
.acequip-card-wrap {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    &.acequip-side-layout {
        .aceuip-card-bottom {
            grid-template-columns: repeat(3, 132px);
        }
    }

    .ac-paginator-wrap {
        display: flex;
        margin-top: auto;
        flex-direction: row;
        justify-content: flex-end;
    }
}

.loading-wrap {
    margin-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
}
</style>
