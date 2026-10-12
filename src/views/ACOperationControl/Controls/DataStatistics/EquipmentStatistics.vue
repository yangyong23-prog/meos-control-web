<template>
    <div class="data-analysis">
        <EquipmentCardItem v-for="(item, index) in list" :key="index" :side-layout="true" :item="item"> </EquipmentCardItem>
    </div>
</template>
<script setup>
import EquipmentCardItem from '../../components/equipment-card-item.vue';
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.data-analysis {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    &-item {
        border-radius: 4px;
        border: 1px solid var(--gray-200, #e8ecf0);
        padding: 12px;
    }
    .left-icon {
        border-radius: 8px;
        background: var(--turquoise-50, #e6fcf7);
        padding: 9px;
    }
    .legend-bar {
        height: 5px;
        background: #e8ecf0;
        .bar-item {
            height: 100%;
            // border-radius: 2px;
        }
    }
    .flex-gap {
        gap: 16px;
    }
    .statistics-buttom {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        .statistics {
            border-radius: 4px;
            background: var(--gray-50, #f7f9fa);
            padding: 4px;
        }
    }
}
.mark-icon {
    display: inline-block;
    width: 44px;
    height: 44px;
}
</style>
