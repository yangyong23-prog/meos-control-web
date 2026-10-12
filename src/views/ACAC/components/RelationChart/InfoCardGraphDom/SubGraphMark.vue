<template>
    <div class="sub-graph-label-warp" :style="warpStyle">
        <div class="label-container" :style="{ transform: `scale(${legendScaleRatio})` }">
            {{ i18n.global.t('meos_control_web.sub_view') }}
            <IconMeriComponentChevronRight class="tips-icon" color="#ffffff" size="24" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { IconMeriComponentChevronRight } from 'meri-icon';
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

const baseStyle = computed(() => {
    const { absoluteLocation } = props.data;
    return {
        top: `${absoluteLocation.y}px`,
        left: `${absoluteLocation.x}px`
    };
});
watchEffect(() => {
    const { data } = props;
    const { legendNode, scale = 1, absoluteLocation, size: nodeSize } = data;
    console.log('scale: ', scale);
    if (legendNode) {
        const { location, size } = legendNode;

        warpStyle.value = {
            left: `${absoluteLocation.x + (location?.x ?? 0) + size?.x ?? 0}px`,
            top: `${absoluteLocation.y + (location?.y ?? 0)}px`
        };
    }
});
</script>
<style lang="less" scoped>
.sub-graph-label-warp {
    position: absolute;
    pointer-events: none;
    white-space: nowrap;
    transform: translateX(-100%);
    .label-container {
        display: flex;
        height: 28px;
        padding-left: 8px;
        align-items: center;
        border-radius: 0 4px;
        background: var(--blue-500, #246fe5);

        color: #fff;
        font-size: 20px;
        font-weight: 400;
        line-height: 24px; /* 120% */
    }
}
</style>
