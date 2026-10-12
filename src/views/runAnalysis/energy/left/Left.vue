<template>
    <m-scrollbar class="energy-left" height="100%">
        <template v-if="loading">
            <m-list-skeleton />
        </template>
        <template v-else>
            <ValueSelect v-bind="$attrs" />
            <EnergyStatistics v-bind="$attrs" />
            <ColdStationIndicators v-bind="$attrs" />
        </template>
    </m-scrollbar>
</template>

<script setup>
import ValueSelect from './ValueSelect.vue';
import EnergyStatistics from './EnergyStatistics.vue';
import ColdStationIndicators from './ColdStationIndicators.vue';
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
</script>
<style lang="less" scoped>
.energy-left {
    width: 340px;
    border-right: 1px solid var(--gray-300);
    :deep(.m-scrollbar__content) {
        padding: 16px;
        color: var(--gray-800);
    }
}
</style>
