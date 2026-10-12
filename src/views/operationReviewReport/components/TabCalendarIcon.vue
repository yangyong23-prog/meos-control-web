<template>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
            d="M13.9997 1.88892C14.7359 1.88892 15.3335 2.48569 15.3336 3.22192L15.3336 14.0002C15.3335 14.7365 14.736 15.3333 13.9997 15.3333L1.99966 15.3333C1.26351 15.3331 0.666774 14.7364 0.666656 14.0002L0.666656 3.22192C0.666832 2.4858 1.26354 1.88909 1.99966 1.88892L13.9997 1.88892ZM1.99966 14.0002L13.9997 14.0002L13.9997 3.22192L1.99966 3.22192L1.99966 14.0002Z"
            :fill="colorTwo"
        />
        <rect x="3.7222" y="0.666687" width="1.33333" height="3.66667" rx="0.666667" :fill="colorTwo" />
        <rect x="11.0555" y="0.666687" width="1.33333" height="3.66667" rx="0.666667" :fill="colorTwo" />
        <rect x="3.11111" y="6.77777" width="4.27778" height="1.33333" rx="0.666667" :fill="colorOne" />
        <rect x="3.11111" y="9.83331" width="4.27778" height="1.33333" rx="0.666667" :fill="colorOne" />
        <rect x="8.61111" y="6.77777" width="4.27778" height="1.33333" rx="0.666667" :fill="colorOne" />
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
