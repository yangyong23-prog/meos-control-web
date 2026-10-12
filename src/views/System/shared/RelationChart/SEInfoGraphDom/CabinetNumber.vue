<template>
    <div class="cabinet-number-warp" :style="style">
        <span class="cabinet-number" @click="showDeatil">{{ data.dataValueName || data.dataValue || '--' }}</span>
    </div>
</template>
<script setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});

const emits = defineEmits(['clickName']);

const style = computed(() => {
    const { x, y, w } = props.data || {};
    return {
        top: `${y}px`,
        left: `${x}px`,
        width: `${w}px`
    };
});

const showDeatil = () => {
    emits('clickName', props.data.relObj);
};
</script>
<style lang="less" scoped>
.cabinet-number-warp {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    .cabinet-number {
        display: inline-block;
        padding: 0 2px;
        border-radius: 1px;
        background: rgba(232, 236, 240, 0.8);
        cursor: pointer;
        font-size: 24px;
        line-height: 1;
    }
}
</style>
