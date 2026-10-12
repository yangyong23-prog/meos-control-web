<template>
    <div class="dashboard" :style="{ gridTemplateColumns: `repeat(${dataList.length},  minmax(0, 1fr))` }">
        <div v-for="item in dataList" :key="item.name" class="dashboard-item">
            <RunEfficiency :pie-data="item.pieData" :data="item" />
        </div>
    </div>
</template>

<script setup>
import RunEfficiency from './RunEfficiency.vue';

defineProps({
    dataList: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.dashboard {
    height: 192px;
    background-color: #ffffff70;
    border-radius: 8px;
    display: flex;
    .dashboard-item {
        height: 100%;
        flex: 1;
    }
}
@media screen and (max-width: 1700px) {
    .dashboard {
        height: 135px;
    }
}
</style>
