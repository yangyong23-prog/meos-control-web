<template>
    <div
        :class="{
            'parking-spot': true,
            occupied: status === 'occupied',
            free: status === 'free',
            unknown: status === 'unknown',
            abnormal: status === 'abnormal'
        }"
    ></div>
</template>

<script setup>
const props = defineProps({
    status: {
        type: String,
        default: ''
    }
});
const status = computed(() => props?.status);
</script>

<style lang="less" scoped>
.parking-spot {
    width: 9px;
    height: 14px;
}

.parking-spot.occupied {
    border-radius: none;
    border: 1px solid #92a0b0;
    background: #cbd9ea;
}

.parking-spot.free {
    border-radius: 1px;
    border: 1px solid #3c945f;
    background: #85e1a4;
}

.parking-spot.unknown {
    border-radius: none;
    border: 1px solid #d0d7e0;
    background: #ebeff4;
}

.parking-spot.abnormal {
    border-radius: 1px;
    border: 1px solid #f55047;
    background: transparent;
}

.abnormal-icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
