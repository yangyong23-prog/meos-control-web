<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <ellipse cx="1.84119" cy="3.34125" rx="1" ry="1" :fill="colorOne" />
        <ellipse cx="1.80823" cy="7.95477" rx="1" ry="1" :fill="colorOne" />
        <circle cx="1.80823" cy="12.6588" r="1" :fill="colorOne" />
        <rect x="3.85852" y="2.66229" width="11.3333" height="1.33333" rx="0.666667" :fill="colorTwo" />
        <rect x="3.85852" y="7.32892" width="11.3333" height="1.33333" rx="0.666667" :fill="colorTwo" />
        <rect x="3.85852" y="11.9956" width="11.3333" height="1.33333" rx="0.666667" :fill="colorTwo" />
    </svg>
</template>

<script setup>
const props = defineProps({
    active: { type: Object, default: () => {} }
});
const colorOne = computed(() => {
    return props.active?.value ? '#246fe5' : '#8B949E';
});
const colorTwo = computed(() => {
    return props.active?.value ? '#246fe5' : '#1B2129';
});
</script>

<style lang="less" scoped></style>
