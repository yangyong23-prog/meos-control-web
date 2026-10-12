<template>
    <div v-if="style !== 'left:0;top:0;'" class="detail-card" :style="style" @click.stop>
        <template v-if="bubbleShowName">
            <div class="detail">{{ localName }}</div>
        </template>
        <template v-else>
            <div class="detail" @click="toRelationChart">{{ i18n.global.t('meos_control_web.view_relation_graph') }}</div>
            <div class="split" />
            <div class="detail" @click="clickDetail">{{ i18n.global.t('meos_control_web.details') }}</div>
        </template>
        <div class="card-before" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getNameWarpRect } from './utils/relaitonChartUtils';

const props = defineProps({
    chartModal: {
        type: Object,
        default: null
    },
    idPrefix: {
        type: String,
        default: ''
    },
    bubbleShowName: {
        type: Boolean,
        default: false
    }
});

const chartWarp = inject('chartWarp');

const emit = defineEmits(['showDetail', 'toRelationChart']);

const style = ref('left:0;top:0;');

const showRelationBtn = ref(false);

const localName = ref('');

const updateStyle = () => {
    if (props.chartModal) {
        const data = props.chartModal?.getModelData();
        if (data?.interactiveConfigVo?.canJump) {
            showRelationBtn.value = true;
        } else {
            showRelationBtn.value = false;
        }
        localName.value = data?.dataObject?.localName ?? '--';
        const objRect = props.chartModal.getModelType() === 'node' ? props.chartModal.getImageClientRect() : props.chartModal.getClientRect();
        if (objRect) {
            const { left, top, width } = objRect;
            style.value = `left:${left + width / 2}px;top:${top - 52}px`;
        } else {
            nextTick(() => {
                const rect = getNameWarpRect(chartWarp.value, props.idPrefix, data.id);
                if (rect) {
                    style.value = `left:${rect.left + rect.width / 2}px;top:${rect.top - 52}px`;
                }
            });
        }
    }
};

const clickDetail = () => {
    emit('showDetail', props.chartModal);
};

const toRelationChart = () => {
    emit('toRelationChart', props.chartModal);
};

watch(
    [() => props.chartModal],
    () => {
        updateStyle();
    },
    { immediate: true }
);

defineExpose({
    updateStyle
});
</script>
<style lang="less" scoped>
.detail-card {
    display: inline-flex;
    align-items: center;
    position: absolute;
    white-space: nowrap;
    top: 0;
    left: 0;
    transform: translateX(-50%);
    color: #fff;
    opacity: 0.8;
    background: var(--gray-900);
    box-shadow: 0 2px 10px 0 rgba(31, 36, 41, 0.1);
    box-sizing: border-box;
    border-radius: 4px;
    z-index: 10;
    cursor: pointer;
    font-size: 14px;
    padding: 5px 4px;

    &:hover {
        opacity: 1;
    }

    .detail {
        padding: 4px 8px;
        display: flex;
        position: relative;
        line-height: 22px;
        border-radius: 4px;

        .disabled-txt {
            position: absolute;
            bottom: calc(100% + 4px);
            left: 50%;
            transform: translateX(-50%);
            border-radius: 4px;
            border: 1px solid var(--gray-300);
            background: rgba(27, 33, 41, 0.8);
            padding: 8px 12px;
            display: none;
        }

        &:hover {
            background-color: rgba(255, 255, 255, 0.14);

            .disabled-txt {
                display: inline-block;
            }
        }
    }

    .split {
        width: 1px;
        height: 14px;
        background-color: var(--gray-400);
        margin: 0 4px;
    }

    .card-before {
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%) rotateZ(45deg);
        z-index: 1;
        height: 8px;
        width: 8px;
        border-left: 4px solid transparent;
        border-top: 4px solid transparent;
        border-bottom: 4px solid var(--gray-900);
        border-right: 4px solid var(--gray-900);
    }
}
</style>
