<template>
    <Panel :loading="loading" class="ac-operation-control-panel-wrap" :title="title" title-path="/ac-operation-control" :card-tag="data?.cardTag">
        <div v-if="!loaded" class="acterminal-row-grid"></div>
        <div v-else-if="data.childCardList?.length > 8" class="card-scroll-wrap GridLayout-great">
            <m-scrollbar :ref="setScrollViewport" class="card-scroll-viewport" @scroll="updateScrollButtons">
                <div :ref="setScrollGrid" class="card-scroll-grid">
                    <div v-for="(card, index) in data.childCardList" :key="index" class="vent-col col bc">
                        <GridCardMid :item="card" />
                    </div>
                </div>
            </m-scrollbar>
            <VueSvg v-if="hasPrePage" :path="PrePage" class="page-btn pre-page" @click="scrollCard(-1)" />
            <VueSvg v-if="hasNextPage" :path="NextPage" class="page-btn next-page" @click="scrollCard(1)" />
        </div>
        <GridLayout v-else-if="loaded && data.childCardList?.length" class="vent-row row" :class="'GridLayout-' + (data.childCardList.length > 6 ? 'great' : 'small')" :gutter="12">
            <template v-if="data.childCardList?.length <= 2">
                <GridLayoutItem v-for="(card, index) in data.childCardList" :key="index" class="vent-col col bc" :span="12">
                    <GridCardMid :item="card" />
                </GridLayoutItem>
            </template>
            <template v-else-if="data.childCardList?.length === 3">
                <GridLayoutItem class="vent-col col bc" :span="12">
                    <GridCardMid :item="data.childCardList[0]" />
                </GridLayoutItem>
                <GridLayoutItem v-for="(card, index) in data.childCardList.slice(1)" :key="index" class="vent-col col bc" :span="6">
                    <GridCardMid :item="card" />
                </GridLayoutItem>
            </template>
            <template v-else-if="data.childCardList?.length === 4">
                <GridLayoutItem v-for="(card, index) in data.childCardList" :key="index" class="vent-col col bc" :span="6">
                    <GridCard :item="card" :pie-color="'#2481F2'" />
                </GridLayoutItem>
            </template>
            <template v-else-if="data.childCardList?.length === 5 || data.childCardList?.length === 6">
                <GridLayoutItem v-for="(card, index) in data.childCardList" :key="index" class="vent-col col bc" :span="4">
                    <GridCardMid :item="card" :pie-color="'#2481F2'" />
                </GridLayoutItem>
            </template>
            <template v-else>
                <GridLayoutItem v-for="(card, index) in data.childCardList" :key="index" class="vent-col col bc" :span="3">
                    <GridCardMid :item="card" />
                </GridLayoutItem>
            </template>
        </GridLayout>
        <Empty v-else-if="loaded" :text="i18n.global.t('operation_duty_homepage.meos_home_no_content_yet')" width="90px" height="76px" />
    </Panel>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import i18n from '@/localization';
import { AIR_TERMINAL } from '@/utils/globalVariables';
import Empty from '@/components/Empty.vue';
import Panel from '../components/base/panel.vue';
import GridLayout from '@/components/grid/GridLayout.vue';
import GridCard from '../components/grid-card.vue';
import GridLayoutItem from '@/components/grid/GridLayoutItem.vue';
import GridCardMid from '../components/grid-card-mid.vue';
import { useHomeDataHook } from '@/hooks/useHomeDataHook';
import VueSvg from '@/components/VueSvg.vue';
import NextPage from '@/assets/svg/nextPage.svg';
import PrePage from '@/assets/svg/prePage.svg';
import { useResizeObserver } from '@vueuse/core';
defineProps({
    size: {
        type: String,
        default: '1*1'
    },
    title: {
        type: String,
        default: i18n.global.t('common.end_equipment')
    }
});
const { data, getDutyHomeData, startDataPolling, loaded, loading } = useHomeDataHook();
const scrollViewport = ref();
const scrollGrid = ref();
// 显式接收组件和 DOM 引用，卸载时也同步清空，避免依赖字符串 ref 的运行时映射。
const setScrollViewport = instance => {
    scrollViewport.value = instance;
};
const setScrollGrid = element => {
    scrollGrid.value = element;
};
const hasPrePage = ref(false);
const hasNextPage = ref(false);
const updateScrollButtons = () => {
    const box = scrollViewport.value?.boxRef;
    hasPrePage.value = !!box && box.scrollLeft > 1;
    hasNextPage.value = !!box && box.scrollLeft + box.clientWidth < box.scrollWidth - 1;
};
// 通过组件库的滚动接口，按实际卡片宽度加列间距平滑移动。
const scrollCard = direction => {
    const box = scrollViewport.value?.boxRef;
    const grid = scrollGrid.value;
    const card = grid?.firstElementChild;
    if (!box || !card) return;
    const distance = card.getBoundingClientRect().width + parseFloat(getComputedStyle(grid).columnGap);
    scrollViewport.value.scrollTo({ left: box.scrollLeft + direction * distance, behavior: 'smooth' });
};
// 尺寸和数据变化后重新计算首尾边界，监听随组件卸载自动清理。
useResizeObserver(scrollViewport, updateScrollButtons);
// Panel 加载完成或异步组件挂载后，等待内部 boxRef 和布局就绪再初始化按钮。
watch(
    [scrollViewport, scrollGrid, () => data.value?.childCardList?.length],
    async () => {
        await nextTick();
        updateScrollButtons();
    },
    { flush: 'post' }
);

onMounted(() => {
    // 获取末端数据
    startDataPolling({ systemList: [AIR_TERMINAL] }, '.acterminal-row-grid');
    getDutyHomeData({ systemList: [AIR_TERMINAL] }, '.acterminal-row-grid');
});
</script>
<style lang="less" scoped>
.acterminal-row-grid {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
}
.ac-operation-control-panel-wrap {
    user-select: none;
}
.ac-operation-control-panel-wrap .vent-col.bc.col {
    padding: 8px 6px 8px 8px;
}
.vent-row {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 0 12px;
    grid-auto-rows: minmax(auto, 110px);
}
.card-scroll-wrap {
    position: relative;
    flex-grow: 1;
    min-width: 0;
    min-height: 0;
    margin: 0 12px;
    .card-scroll-viewport {
        height: 100%;
        :deep(.m-scrollbar__content) {
            height: 100%;
        }
        :deep(.m-scrollbar__bar.is-horizontal) {
            display: none;
        }
    }
    .card-scroll-grid {
        display: grid;
        height: 100%;
        grid-template-rows: repeat(2, minmax(0, 110px));
        grid-auto-flow: column;
        grid-auto-columns: calc((100% - 24px) / 4);
        gap: 8px;
    }
    .page-btn {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        cursor: pointer;
        &:hover {
            :deep(path) {
                fill: var(--blue-500);
            }
            :deep(rect) {
                stroke: var(--blue-200);
            }
        }
        &.pre-page {
            left: 0;
        }
        &.next-page {
            right: 0;
        }
    }
}
.GridLayout-8,
.GridLayout-great {
    :deep(.run-number-value) {
        font-size: 20px;
    }
}
</style>
