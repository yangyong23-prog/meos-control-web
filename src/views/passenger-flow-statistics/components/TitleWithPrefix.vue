<template>
    <div class="title-with-prefix-container">
        <div class="prefix"></div>
        <div class="title">{{ props?.title || '' }}</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        default: ''
    }
});
</script>

<style lang="less" scoped>
.title-with-prefix-container {
    display: flex;
    align-items: center;
    column-gap: 9px;
    margin-bottom: 12px;

    .prefix {
        width: 3px;
        height: 14px;
        background: @blue-500;
    }

    .title {
        color: @grey-800;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;
    }
}
</style>
