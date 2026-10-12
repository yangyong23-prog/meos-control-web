<template>
    <div class="chart-legend wh100 fcb">
        <div ref="chartBox" class="chart-box fc">
            <div
                v-for="(item, index) in legendList"
                :key="item.code"
                class="chart-legend-item fc"
                :class="{ 'no-show': item.legendShow === false }"
                @click="$emit('clickItem', item)"
            >
                <div class="legend-icon" :class="[item.type]" :style="style(item.lineStyle, index)"></div>
                <div v-ellipsis class="legend-name m-ellipsis">{{ item[nameKey]?.name || item.name }}</div>
            </div>
        </div>
        <m-popover v-if="showMore" trigger="click">
            <template #content>
                <m-scrollbar max-height="360px">
                    <div
                        v-for="(item, index) in legendList"
                        :key="item.code"
                        class="chart-legend-item popover-legend-item fc"
                        :class="{ 'no-show': item.legendShow === false }"
                        @click="$emit('clickItem', item)"
                    >
                        <div class="legend-icon" :class="[item.type]" :style="style(item.lineStyle, index)"></div>
                        <div v-ellipsis class="legend-name m-ellipsis">{{ item[nameKey]?.name || item.name }}</div>
                    </div>
                </m-scrollbar>
            </template>
            <div v-if="showMore" class="chart-legend-more">{{ i18n.global.t('meos_control_web.view_legend') }}</div>
        </m-popover>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';

const props = defineProps({
    legends: {
        type: Array,
        default: () => []
    },
    nameKey: {
        type: String,
        default: ''
    },
    customColorFn: {
        type: Function,
        default: null
    }
});
const chartBox = ref(null);
const showMore = ref(false);
const legendList = ref([]);
const hasOverflow = () => {
    useResizeObserver(chartBox.value, () => {
        if (chartBox.value.scrollWidth > chartBox.value.offsetWidth) {
            showMore.value = true;
        } else {
            showMore.value = false;
        }
    });
};
const style = (lineStyle, i) => {
    // background: repeating-linear-gradient(90deg, #7188a6, #7188a6 3px, var(--gray-0) 3px, var(--gray-0) 5px);
    const color = props.customColorFn ? props.customColorFn(lineStyle, i) : lineStyle.color;
    const icon = {
        bar: { backgroundColor: color },
        solid: { backgroundColor: color },
        rect: { backgroundColor: color },
        dashed: { background: `repeating-linear-gradient(90deg, ${color}, ${color} 2px, var(--gray-0) 2px, var(--gray-0) 4px)` }
    };
    return icon[lineStyle.type];
};
const init = () => {
    legendList.value = props.legends.map(item => ({
        ...item,
        legendShow: true
    }));
};
watch(
    () => props.legends,
    () => {
        init();
    },
    { immediate: true }
);

onMounted(() => {
    hasOverflow();
});
defineExpose({
    init
});
</script>
<style lang="less" scoped>
.chart-legend {
    .chart-box {
        overflow: hidden;
        gap: 12px;
    }
    &-item {
        gap: 4px;
        cursor: pointer;
        min-width: fit-content;
        &.no-show {
            .legend-icon {
                background-color: var(--gray-400) !important;
            }
            .legend-name {
                color: var(--gray-400);
            }
        }
        .legend-icon {
            &.line {
                width: 16px;
                height: 3px;
            }
            &.rect {
                width: 14px;
                height: 14px;
                border-radius: 2px;
            }
            &.bar {
                width: 6px;
                height: 14px;
                border-radius: 1px;
            }
            &.dashed {
                width: 16px;
                height: 3px;
            }
        }
        .legend-name {
            color: var(--gray-600);
            max-width: 200px;
        }
    }
    &-more {
        flex: 0 0 64px;
        cursor: pointer;
        color: var(--blue-500);
        padding: 7px 0 7px 8px;
        box-shadow: -4px 0px 4px -4px #00000029;
    }
}
.popover-legend-item {
    max-width: 216px;
    min-width: auto;
}
.popover-legend-item + .popover-legend-item {
    margin-top: 12px;
}
</style>
