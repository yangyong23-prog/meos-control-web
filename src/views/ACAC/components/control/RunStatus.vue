<template>
    <div class="run-status-control">
        <div v-ellipsis class="run-status-control-title m-ellipsis">{{ data.infoCodeName }}</div>
    </div>
</template>

<script setup>
defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
</script>
<style lang="less" scoped>
.run-status-control {
    &-title {
        height: 24px;
        line-height: 24px;
    }
    &-times {
        background-color: var(--gray-200);
        border-radius: 4px;
        padding: 2px 4px;
        color: var(--gray-600);
        margin-left: 4px;
    }
}
</style>
