<template>
    <div :id="outId" class="final-selection">
        <div class="selection-header">
            <div :id="titleId" v-ellipsis class="selection-header-title meos-ellipsis-line">{{ i18n.global.t('meos_control_web.final_strategy_selection') }}</div>
            <div v-ellipsis class="selection-header-code">
                <span>{{ i18n.global.t('meos_control_web.strategy_code_colon') }}{{ code }}</span>
            </div>
        </div>
        <div ref="selectionContentRef" class="selection-content" :class="isDEV ? '' : 'in-frame-height'">
            <LNCard :loading="strategyLoading" :no-data="strategyOverviewNoData"></LNCard>
            <NCCard v-if="!strategyLoading && !strategyOverviewNoData" ref="nextColdCardRef" :target-height="targetNextCardHeight" :style="opacityStrategy ? '' : `opacity: 0`">
            </NCCard>
            <NECard v-if="!strategyLoading && !strategyOverviewNoData" ref="nextEndCardRef" :style="opacityStrategy ? '' : `opacity: 0`" class="NE-card"> </NECard>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ref } from 'vue';
import LNCard from './loading_noData.vue';
import NCCard from './nextColdCard.vue';
import NECard from './nextEndCard.vue';
import emitter from '@/utils/bus';
import { strategyLoadingKey, strategyOverviewNoDataKey, strategyOverviewTempKey, opacityStrategyKey } from '../../../../../hooks/useStaticData';
import { uuid } from 'yushu-js-utils';
import { activeStrategyIndexKey } from '../../../../../injectionKey';
import { useElementSize } from '@vueuse/core';
import { debounce } from 'lodash';

const strategyLoading = inject(strategyLoadingKey);
const strategyOverviewNoData = inject(strategyOverviewNoDataKey);
const strategy = inject(strategyOverviewTempKey);
const opacityStrategy = inject(opacityStrategyKey);
const activeIndex = inject(activeStrategyIndexKey);

const outId = ref('FSCard_outId_' + uuid(5));
const titleId = ref('FSCard_titleId_' + uuid(5));

const selectionContentRef = ref(null);
const nextColdCardRef = ref(null);
const nextEndCardRef = ref(null);
const targetNextCardHeight = ref(-1);
const selectionContentSize = useElementSize(selectionContentRef, {
    windowResize: false
});
const { height: selectionContentHeight } = selectionContentSize;
const bestStrategy = computed(() => {
    if (!strategy?.value?.[activeIndex.value] || !strategy?.value?.[activeIndex.value]?.stgyCodeList) return {};
    const val = strategy.value[activeIndex.value].stgyCodeList.find(item => {
        return item.isBest;
    });
    return val && val.content ? val.content.data[0] : {};
});

const isDEV = import.meta.env.DEV;

const code = computed(() => {
    if (!strategyLoading?.value && !strategyOverviewNoData?.value) {
        if (bestStrategy.value?.stgyIndicator && bestStrategy.value?.stgyIndicator?.strategyCode) {
            return bestStrategy.value.stgyIndicator.strategyCode;
        }
    }
    return '--';
});

const initCardStyle = debounce(async () => {
    if (selectionContentRef.value && nextColdCardRef.value && nextEndCardRef.value) {
        const maxEndCardHeight = 220;
        const gap = 12;
        const nextHeight = nextColdCardRef.value?.$el?.scrollHeight;
        const endCardHeight = nextEndCardRef.value?.$el?.scrollHeight;
        // console.log('nextColdCardRef.value: ',  nextHeight, selectionContentHeight.value, endCardHeight);

        if (nextHeight + endCardHeight + gap > selectionContentHeight.value) {
            let targetNextCardH = selectionContentHeight.value - maxEndCardHeight - gap;
            if (endCardHeight < maxEndCardHeight) {
                targetNextCardH = selectionContentHeight.value - endCardHeight - gap;
            }
            targetNextCardHeight.value = targetNextCardH;

            targetNextCardHeight.value = targetNextCardH;
            // 延迟赋值，避开当前响应式周期
            setTimeout(() => {
                selectionContentSize.stop(); // 10ms后恢复监听
            }, 0);
        }
    }
}, 20);
watchEffect(() => {
    if (selectionContentHeight.value) {
        initCardStyle();
    }
});
onMounted(() => {
    nextTick(() => {
        emitter.emit('FSCard', {
            outId: outId.value,
            titleId: titleId.value
        });
    });
});
</script>

<style lang="less" scoped>
.final-selection {
    position: relative;
    padding: 12px 6px 8px 6px;
    .selection-header {
        height: 32px;
        padding: 0px 8px;
        // display: flex;
        // justify-content: space-between;
        // align-items: center;
        margin-bottom: 7px;
        .selection-header-title {
            display: inline-block;
            vertical-align: middle;
            width: 132px;
            color: #5958f2;
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 32px; /* 120% */
            height: 100%;
        }
        .selection-header-code {
            box-sizing: border-box;
            display: inline-block;
            vertical-align: middle;
            width: calc(100% - 132px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 28px;
            color: var(--Grey-Grey-0, #fff);
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 28px; /* 142.857% */
            border-radius: 4px;
            span {
                border-radius: 4px;
                padding: 5px 6px 6px 6px;
                background: linear-gradient(135deg, #22d1da -14.58%, #7d84ff 44.79%, #e67dff 104.17%);
                box-shadow: 0px 4px 8px 0px rgba(99, 148, 230, 0.32);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .selection-content {
        padding: 0px 0px 8px 0px;
        max-height: calc(100vh - 192px);
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0 !important;
        }
        // 48px 当在frame中的应该显示的高度
        &.in-frame-height {
            max-height: calc(100vh - 192px - 48px) !important;
        }
        /* 隐藏水平滚动条 */
        &::-webkit-scrollbar {
            height: 0 !important;
        }
    }

    .NE-card {
        margin-top: 12px;
    }
}
</style>
