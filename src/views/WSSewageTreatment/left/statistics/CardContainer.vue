<template>
    <div
        :style="`
            width: calc(${100 / props.columnsNumber}% - ${(12 * (props.columnsNumber - 1)) / props.columnsNumber}px);
            margin-left: ${index % props.columnsNumber === 0 ? 0 : 12}px;
            margin-top: ${index > props.columnsNumber - 1 ? 12 : 0}px;
        `"
        class="card-container"
    >
        <div class="card-title">
            <span class="title">{{ $attrs['card-title'] || '--' }}</span>
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    columnsNumber: {
        type: Number,
        default: () => 3
    },
    index: {
        type: Number,
        default: 0
    }
});
</script>
<style lang="less" scoped>
.card-container {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 16px 20px 16px;
    min-width: 348px;
    border-radius: 8px;
    gap: 16px;
    background: rgba(255, 255, 255, 0.8);
}
.card-title {
    display: flex;
    column-gap: 8px;
    .title {
        color: @grey-800;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: 26px;
    }

    .sub-title {
        display: flex;
        align-items: flex-end;

        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;

        .highlight-count {
            color: @red-500;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
        }
    }
}
</style>
