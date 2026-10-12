<template>
    <div class="fence-layout-item" :style="itemStyle">
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    span: {
        type: Number,
        default: 1
    }
});

const itemStyle = computed(() => {
    return {
        gridColumnEnd: `span ${props.span}`
    };
});
</script>

<style scoped>
.fence-layout-item {
    display: flex;
}
</style>
