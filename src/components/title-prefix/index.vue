<template>
    <div class="title-with-prefix-container">
        <div class="left" :style="{ 'column-gap': `${props.colGap}px` }">
            <div class="prefix"></div>
            <div class="title" :style="{ 'font-size': `${props?.fontSize}px`, 'line-height': props?.lineHeight ? `${props?.lineHeight}px` : 'none' }">
                <div v-if="props?.title">{{ props?.title || '' }}</div>
                <slot name="title"></slot>
            </div>
        </div>
        <div v-if="props?.showRight" class="right">
            <div class="right-wrapper">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    colGap: {
        type: Number,
        default: 9
    },
    fontSize: { type: Number, default: 16 },
    lineHeight: {
        type: Number,
        default: 0
    },
    showRight: {
        type: Boolean,
        default: false
    }
});
</script>

<style lang="less" scoped>
.title-with-prefix-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .left {
        display: flex;
        align-items: center;
        column-gap: 9px;

        position: relative;
        color: @grey-800;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        // line-height: 24px;

        max-width: 100%;
    }

    .prefix {
        width: 3px;
        height: 14px;
        background: @blue-500;
        flex-shrink: 0;
    }

    .right {
        position: relative;
    }

    .right-wrapper {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        display: flex;
        align-items: center;
    }
}
</style>
