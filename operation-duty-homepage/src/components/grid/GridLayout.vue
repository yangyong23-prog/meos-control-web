<template>
    <div class="grid-layout" :style="layoutStyle">
        <slot></slot>
    </div>
</template>

<script setup>
const props = defineProps({
    gutter: {
        type: Number,
        default: 3
    },
    gap: {
        type: Number,
        default: 8
    }
});
const layoutStyle = ref({});
watchEffect(() => {
    layoutStyle.value = {
        gridTemplateColumns: `repeat(${props.gutter}, minmax(0px, 1fr))`,
        gap: props.gap + 'px'
    };
});
</script>

<style scoped>
.grid-layout {
    display: grid;
}
</style>
