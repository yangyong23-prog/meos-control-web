<template>
    <div class="operation-criterion-title">
        <span class="operation-criterion-title-bar"></span>
        <span class="operation-criterion-title-content">
            {{ title }}
        </span>
    </div>
</template>
<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    }
});
</script>
<style lang="less" scoped>
.operation-criterion-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 9px;
    .operation-criterion-title-bar {
        width: 4px;
        height: 16px;
        display: block;
        background: var(--blue-500, #246fe5);
    }
    .operation-criterion-title-content {
        color: var(--gray-800, #2e3742);
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 133.333% */
    }
}
</style>
