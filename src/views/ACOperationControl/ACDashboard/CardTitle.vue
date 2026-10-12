<template>
    <div class="card-title">
        <div v-ellipsis class="title">
            {{ title || '' }}
        </div>
        <div v-if="$slots.right" class="right">
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
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 1;
    }
    .right {
        max-width: 50%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
