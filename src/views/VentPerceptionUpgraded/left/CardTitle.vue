<template>
    <div class="card-title">
        <div class="title">
            {{ title || '' }}
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps({
    title: {
        type: String,
        default: ''
    }
});
</script>
<style lang="less" scoped>
.card-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    .title {
        color: var(--gray-800, #2e3742);
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 28px; /* 144.444% */
    }
}
</style>
