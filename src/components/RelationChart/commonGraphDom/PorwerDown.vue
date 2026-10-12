<template>
    <div class="prower-down-warp" :style="warpStyle">
        <powerOutage class="power-icon" @click.stop="clickName" @mousemove.stop="() => {}" @mouseenter.stop="hoverName" @mouseleave.stop="unHoverName" />
    </div>
</template>
<script setup>
import powerOutage from '@/assets/svg/powerOutage.svg';
const emit = defineEmits(['clickName', 'hoverName', 'unHoverName']);
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    legendScaleRatio: {
        type: Number,
        default: 1
    }
});

const warpStyle = ref({
    left: '0',
    top: '0',
    width: '0',
    height: '0'
});
const clickName = () => {
    emit('clickName');
};

const hoverName = () => {
    emit('hoverName');
};
const unHoverName = () => {
    emit('unHoverName');
};
watchEffect(() => {
    const { data } = props;
    const { legendNode } = data;
    if (legendNode) {
        const { location, size } = legendNode;
        warpStyle.value = {
            left: `${location.x}px`,
            top: `${location.y}px`,
            width: `${size.x}px`,
            height: `${size.y}px`
        };
    }
});
</script>
<style lang="less" scoped>
.prower-down-warp {
    display: inline-block;
    position: absolute;
    .power-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
