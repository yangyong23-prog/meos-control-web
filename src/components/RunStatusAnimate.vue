<template>
    <div class="run-status-animate" :style="style">
        <img v-if="imgType === 'png'" src="@/assets/images/common/equip-run-animate.png" alt="" />
        <RunStatusAnimateSvg v-if="imgType === 'svg'"></RunStatusAnimateSvg>
    </div>
</template>
<script setup>
import RunStatusAnimateSvg from '@/assets/svg/run-status-animate.svg';
const props = defineProps({
    imgType: {
        type: String,
        default: 'png'
    },
    width: {
        type: Number,
        default: 16
    },
    height: {
        type: Number,
        default: 16
    },
    bottom: {
        type: Number,
        default: -12
    },
    right: {
        type: Number,
        default: -12
    }
});
const style = computed(() => ({
    width: `${props.width}px`,
    height: `${props.height}px`,
    bottom: `${props.bottom}px`,
    right: `${props.right}px`
}));
</script>
<style scoped lang="scss">
.run-status-animate {
    position: absolute;
    bottom: -12px;
    right: -12px;
    transform: translate(-50%, -50%);
    pointer-events: none;

    img,
    svg {
        display: block;
        width: 100%;
        height: 100%;
        transform-origin: center;
        will-change: transform, opacity;
        transform: translateZ(0);
        animation: run-status-rotate 2s linear infinite;
        opacity: 1;
    }
}

@keyframes run-status-rotate {
    0% {
        transform: rotate(0deg);
        opacity: 0.98;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: rotate(360deg);
        opacity: 0.98;
    }
}
</style>
