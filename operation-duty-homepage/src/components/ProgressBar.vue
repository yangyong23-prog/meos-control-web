<template>
    <div :class="['running-progress-bar', dashed ? 'dashed' : '']">
        <div
            class="running-progress-bar-bg"
            :style="{
                width: ratio * 100 + '%',
                backgroundColor: dashed ? '' : color
            }"
        ></div>
    </div>
</template>
<script setup>
defineProps({
    ratio: {
        type: Number,
        default: 0.5
    },
    dashed: {
        type: Boolean,
        default: true
    },
    color: {
        type: String,
        default: '#2481F2'
    }
});
</script>
<style lang="less" scoped>
.running-progress-bar {
    height: 6px;
    width: 100%;
    background-color: #d6dbe1;
    .running-progress-bar-bg {
        height: 100%;
    }
    &.dashed {
        height: 16px;
        background: repeating-linear-gradient(90deg, #d6dbe1, #d6dbe1 2px, var(--gray-0) 2px, var(--gray-0) 4px);
        .running-progress-bar-bg {
            background: repeating-linear-gradient(90deg, var(--orange-600), var(--orange-600) 2px, var(--gray-0) 2px, var(--gray-0) 4px);
        }
    }
}
</style>
