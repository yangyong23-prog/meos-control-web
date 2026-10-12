<template>
    <div v-if="valueSelection?.valueSelectionType" class="energy-left-value-select">
        <ValueChoice :value-selection="valueSelection" :show-line-chart-statistic="false" />
    </div>
</template>

<script setup>
import ValueChoice from '@/views/ACOperationControl/ACPlayback/RightSideTabs/ValueChoice.vue';
defineProps({
    valueSelection: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.energy-left-value-select {
    margin-bottom: 28px;
}
</style>
