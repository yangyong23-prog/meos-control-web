<template>
    <UnknownRiskList :is-loading="props.isLoading" :loading-danger-events="props.loadingDangerEvents" :risk-list="riskList" :show-type="'tab'" />
</template>

<script setup>
import UnknownRiskList from './UnknownRiskList.vue';

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    },
    loadingDangerEvents: {
        type: Boolean,
        default: false
    },
    riskList: {
        type: Array,
        default: () => []
    }
});
</script>

<style lang="less" scoped></style>
