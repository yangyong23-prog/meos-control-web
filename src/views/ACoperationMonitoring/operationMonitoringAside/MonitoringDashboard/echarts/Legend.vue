<template>
    <div ref="legend" class="chart-legend">
        <div class="chart-legend-box fc" :style="{ transform: `translateX(${translateX}px)`, lineHeight: '20px' }">
            <div v-for="(item, i) in props.legends" :key="item.name" class="chart-legend-item fcc">
                <div
                    class="legend-icon"
                    :class="[item?.lineStyle?.type]"
                    :style="{
                        borderColor: color[i]
                    }"
                ></div>
                <div class="legend-name">{{ item.name }}</div>
            </div>
        </div>

        <m-popover placement="right" class="legend-popover">
            <template #content>
                <div v-for="(item, i) in legends" :key="item.name" class="chart-legend-item fc">
                    <div class="legend-icon" :style="{ borderColor: color[i] }"></div>
                    <div class="legend-name">{{ item.name }}</div>
                </div>
            </template>
            <div v-if="showMore" class="chart-legend-more">{{ i18n.global.t('meos_control_web.view_legend') }}</div>
        </m-popover>
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { PropType } from 'vue';

const props = defineProps({
    legends: {
        type: Array as PropType<{ name: string; type: string; color: string; lineStyle: any }[]>,
        default: () => []
    }
});
const color = ref(['#2481F2', '#33D4D2', '#FFD873', '#B286F5', '#7188A6', '#9FC9FB', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FFB800', '#FA9B96']);
const showMore = ref(false);
const legend = ref();
const translateX = ref(0);
const resizeEcharts = () => {
    showMore.value = legend.value.scrollWidth > legend.value.clientWidth;
    if (showMore.value) {
        const items: any[] = legend.value.querySelectorAll('.chart-legend-item');
        let sum = 0;
        for (let index = 0; index < items.length; index++) {
            const element = items[index];
            sum = sum + element.clientWidth;
            if (sum > legend.value.clientWidth) {
                translateX.value = items[index].clientWidth - (sum - legend.value.clientWidth);
                return;
            }
            translateX.value = 0;
        }
    }
};
onMounted(() => {
    resizeEcharts();
    window.addEventListener('resize', resizeEcharts, false);
});
onUnmounted(() => {
    window.removeEventListener('resize', resizeEcharts, false);
});
</script>
<style lang="less" scoped>
.chart-legend {
    position: absolute;
    max-width: calc(100% - 40px);
    right: 4px;
    z-index: 2;
    overflow-x: hidden;
    height: 20px;
    .legend-icon {
        border-top: 3px solid;
        width: 16px;
        margin-right: 8px;
        position: relative;
        &.dashed {
            border-top: 2px dashed;

            width: 30px;
            &::after {
                content: '';
                width: 3px;
                height: 2px;
                background-color: #fff;
                position: absolute;
                left: 0;
                top: -2px;
            }
            &::before {
                content: '';
                width: 3px;
                height: 2px;
                background-color: #fff;
                position: absolute;
                right: 0;
                top: -2px;
            }
        }
    }
    .legend-name {
        width: max-content;
    }
    &-box {
        height: 100%;
    }
    .chart-legend-item + .chart-legend-item {
        padding-left: 12px;
    }
    .chart-legend-more {
        position: absolute;
        right: 0;
        color: var(--blue-500);
        cursor: pointer;
        width: 64px;
        text-align: right;
        background-color: #fff;
        top: 10px;
        transform: translateY(-50%);
    }
}
</style>

<style lang="less">
.legend-popover {
    .chart-legend-item + .chart-legend-item {
        margin-top: 12px;
    }
    .legend-icon {
        border-top: 3px solid;
        width: 16px;
        margin-right: 8px;
    }
}
</style>
