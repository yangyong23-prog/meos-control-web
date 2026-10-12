<template>
    <div class="space-label-wrap" :class="{ hide: !show }" :style="{ opacity: opacityRef }">
        <div class="icon-text-container">
            <div class="mid-wrap">
                <div class="eq-count-desc">{{ i18n.global.t('meos_control_web.aggregate_devices', { equipCount: equipCounts }) }}</div>
                <div class="space-name-text" :style="{ color, fontWeight }">
                    {{ labelName }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
// 标签状态
// 正常 normal 异常 abnormal 干预 intervene 鼠标悬浮 hover 选中 selected
const props = defineProps({
    model: {
        type: Object,
        default: () => ({})
    },
    currentStyle: {
        type: Object,
        default: () => ({})
    }
});
const emits = defineEmits(['clickItem']);
const hover = ref(false);

const labelName = ref(props.model?.data?.localName || '--');
const equipCounts = ref(props.model?.data?.equipCounts ?? 0);

// #当前图元的叠加样式集合
const currentStyle = ref(props?.model?.caclCurrentStyle() || {});

const color = computed(() => currentStyle.value.color || '#000000');

const show = computed(() => currentStyle.value?.show);

const fontWeight = computed(() => currentStyle.value?.fontWeight || 400);

const opacityRef = computed(() => currentStyle.value?.opacity || 1);

const workPlaneLuxText = ref('');

props.model.addObserver('ChangeState', e => {
    currentStyle.value = props?.model?.caclCurrentStyle() || {};
    workPlaneLuxText.value = props.model?.workPlaneLuxText || '';
});
</script>
<style lang="less" scoped>
.space-label-wrap {
    position: relative;
    cursor: pointer;

    .mid-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;

        .eq-count-desc,
        .space-name-text {
            pointer-events: auto;
            font-size: 12px;
            text-align: center;
            color: #1b2129;
            line-height: 15px;
            white-space: nowrap;
            text-shadow: 1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff;
        }
    }
    // .space-name-text {
    // }

    &.hide {
        display: none;
    }
}

.icon-text-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);

    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
}
</style>
