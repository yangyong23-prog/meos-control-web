<template>
    <div class="loading-warp" :style="warpStyle">
        <div class="loading-status" :style="{ transform: `scale(${legendScaleRatio})` }">
            <span>{{ text }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    status: {
        type: String,
        default: ''
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

const text = ref('');

let index = 1,
    timer = null;

const handleAnimation = () => {
    let s = props.status === 'opening' ? i18n.global.t('meos_control_web.enabling') : i18n.global.t('meos_control_web.closing');
    s = s + '.'.repeat(index);

    text.value = s;

    index++;
    if (index > 3) {
        index = 1;
    }
};

onMounted(() => {
    timer = setInterval(handleAnimation, 1000);
});
onUnmounted(() => {
    clearInterval(timer);
});
</script>
<style lang="less" scoped>
.loading-warp {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    .loading-status {
        width: 80px;
        height: 28px;
        flex-shrink: 0;
        border-radius: 4px;
        background: #fffefe;
        box-shadow: 0px 16.364px 19.636px 0px rgba(214, 214, 214, 0.1);
        line-height: 28px;
        padding: 0 12px;
    }
}
</style>
