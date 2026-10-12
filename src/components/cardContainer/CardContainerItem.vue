<template>
    <div class="card-container-item fcc" :style="{ 'grid-column-end': `span ${span}` }">
        <slot name="default">
            <span class="fs30">span</span>
        </slot>
    </div>
</template>

<script setup>
defineProps({
    span: {
        type: Number,
        default: 6
    },
    borderRadius: {
        type: String,
        default: '8px'
    }
});
</script>
<style lang="less" scoped>
.card-container-item {
    background-color: var(--gray-0);
    border-radius: var(--border-radius, 8px);
}
</style>
