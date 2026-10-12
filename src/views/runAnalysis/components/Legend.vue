<template>
    <div ref="contentRef" class="fc chart-legend-box" :class="{ 'is-expand': isExpand, showExpand: showExpand && !isExpand }">
        <div v-for="(item, i) in list" :key="i" class="chart-legend-item fcc" :class="{ noShow: !item[showField] }" @click="emits('itemClick', item)">
            <div class="chart-legend-item-line" :style="styleFun(item, i)"></div>
            {{ (item.localName || item.name) ?? '--' }}
        </div>
        <div v-if="showExpand || isExpand" class="chart-legend-expand item-link fc" :class="{ 'is-collapse': !isExpand }" @click="isExpand = !isExpand">
            {{ isExpand ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand') }}
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
defineProps({
    list: {
        type: Array,
        default: () => []
    },
    styleFun: {
        type: Function,
        default: () => {}
    },
    showField: {
        type: String,
        default: 'show'
    }
});
// 获取元素引用
const contentRef = ref(null);
const emits = defineEmits(['itemClick']);
const isExpand = ref(false);
const showExpand = ref(false);
useResizeObserver(contentRef, () => {
    getClient();
});
const getClient = () => {
    const { clientHeight } = contentRef.value; // 容器可视高度（不含滚动条）
    const { scrollHeight } = contentRef.value; // 容器可视高度（不含滚动条）
    showExpand.value = scrollHeight > clientHeight;
};
onMounted(() => {
    getClient();
});
</script>
<style lang="less" scoped>
.chart-legend-box {
    flex-wrap: wrap;
    gap: 4px 12px;
    height: 24px;
    overflow: hidden;
    position: relative;
    justify-content: end;
    &.showExpand {
        padding-right: 30px;
    }
    &.is-expand {
        height: auto;
    }
    .item-link {
        color: var(--blue-600);
        cursor: pointer;
        height: 20px;
        &:hover {
            color: var(--blue-700);
        }
    }
    .chart-legend-expand.is-collapse {
        position: absolute;
        right: 0;
        top: 0;
        background: #fff;
        padding-left: 12px;
    }
}
.chart-legend-item {
    cursor: pointer;
    user-select: none;
    &.noShow {
        color: #ccc;
    }
    color: var(--gray-900, #1b2129);
    font-size: 14px;
    // font-weight: 700;
    line-height: 22px;
}
.chart-legend-item-line {
    height: 4px;
    width: 12px;
    margin-right: 4px;
}
</style>
