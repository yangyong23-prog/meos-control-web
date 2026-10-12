<template>
    <div class="next-cold-card" :style="curStyle">
        <div class="cold-card-title">
            <div v-ellipsis class="title-text meos-ellipsis-line">{{ i18n.global.t('meos_control_web.next_period_name_plan', { name: systemName }) }}</div>
            <div class="title-time">{{ computedStartTime }}</div>
        </div>
        <div class="dashed-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="360" height="2" viewBox="0 0 360 2" fill="none">
                <path d="M0 1H616" stroke="#C4C9CF" stroke-opacity="0.6" stroke-dasharray="5 4" />
            </svg>
        </div>
        <div class="cold-card-content">
            <template v-if="finalStrategyList.length > 0">
                <div v-for="group in finalStrategyList" :key="group.id" class="content-item">
                    <div class="content-item-title">{{ group.name }}</div>
                    <div class="content-line-data">
                        <div v-for="item in group.items" :key="item.field" class="line-data-item">
                            <div class="line-data-value">{{ item.valText ?? '--' }}</div>
                            <div class="line-data-label">{{ item.name ?? '' }}</div>
                        </div>
                    </div>
                </div>
                <div v-if="targetHeight > 0" class="expanded-area">
                    <m-button v-if="curExpanded" type="link" size="medium" icon="IconMeriComponentChevronUp" icon-position="right" @click.stop="collapse">{{
                        i18n.global.t('meos_control_web.collapse')
                    }}</m-button>
                    <m-button v-else type="link" size="medium" icon="IconMeriComponentChevronDown" icon-position="right" @click.stop="showAll">{{
                        i18n.global.t('meos_control_web.view_more')
                    }}</m-button>
                </div>
            </template>
            <div v-else class="no-data">{{ i18n.global.t('meos_control_web.no_data') }}</div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { currentSystemIdKey, AISystemlistKey, strategyOverviewTempKey, objectsMapKey } from '../../../../../hooks/useStaticData';
import { broadcastAndComputeEndTimeKey, activeStrategyIndexKey } from '../../../../../injectionKey';
import dayjs from 'dayjs';
import { round } from 'lodash';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import useFinalStrategy from '@/views/AI/hooks/useFinalStrategy';

const props = defineProps({
    loading: Boolean,
    noData: Boolean,
    targetHeight: Number
});

const strategy = inject(strategyOverviewTempKey);
const systemId = inject(currentSystemIdKey);
const options = inject(AISystemlistKey);
const objectsMap = inject(objectsMapKey);
const broadcastAndComputeEndTime = inject(broadcastAndComputeEndTimeKey);
const activeIndex = inject(activeStrategyIndexKey);
const curExpanded = ref(false);
const collapse = () => {
    curExpanded.value = false;
};
const showAll = () => {
    curExpanded.value = true;
};

const { finalStrategyList } = useFinalStrategy();
const systemName = computed(() => {
    const item = options.value.find(item => {
        return item.key === systemId.value;
    });
    return item && item.label ? item.label : '--';
});

const currentTime = computed(() => {
    let curTime = null;
    if (broadcastAndComputeEndTime.value) {
        curTime = broadcastAndComputeEndTime.value;
    } else if (strategy?.value?.[activeIndex.value]?.endTime) {
        curTime = dayjs(strategy.value[activeIndex.value].endTime, 'YYYY-MM-DD HH:mm:ss', true);
    }
    return curTime;
});

const bestStrategy = computed(() => {
    if (!strategy?.value?.[activeIndex.value]) return null;
    const val = strategy.value[activeIndex.value].stgyCodeList.find(item => {
        return item.isBest;
    });
    const data = val && val?.content ? val?.content?.data?.[0] : {};

    return { ...data, curPredACAC: data?.predACAC?.[systemId.value] ?? [] };
});

const computedStartTime = computed(() => {
    if (!currentTime.value) return '--';
    if (!bestStrategy.value) return '--';

    const nextIndex = getNextIndex(bestStrategy.value.curPredACAC);
    if (!nextIndex && nextIndex !== 0) return '--';
    const date = dayjs(bestStrategy.value.curPredACAC[nextIndex].time, 'YYYY-MM-DD HH:mm:ss', true);
    return date.format('HH:mm');
});

const sysOpen = computed(() => {
    if (!bestStrategy.value) return '--';
    const nextIndex = getNextIndex(bestStrategy.value.stgyCSDetail);
    if (!nextIndex && nextIndex !== 0) return '--';
    const { sysOpen } = bestStrategy.value.stgyCSDetail[nextIndex];
    if (!sysOpen) {
        if (sysOpen === 0) {
            return i18n.global.t('meos_control_web.off');
        }
        return '--';
    }
    return i18n.global.t('meos_control_web.on');
});

const getNextIndex = arr => {
    if (!currentTime.value || !arr) return null;
    let nextIndex = null;
    for (let i = 0; i < arr.length; i++) {
        const nextTime = dayjs(arr[i].time, 'YYYY-MM-DD HH:mm:ss', true);
        if (dayjsIsAfter(nextTime, currentTime.value)) {
            nextIndex = i;
            break;
        }
    }
    return nextIndex;
};

const curStyle = computed(() => {
    if (props.targetHeight > 0 && !curExpanded.value) {
        return { height: props.targetHeight + 'px' };
    }
    return {};
});
</script>

<style lang="less" scoped>
.next-cold-card {
    position: relative;
    overflow: hidden;
    padding: 12px 16px 20px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.6) inset;
    .cold-card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: var(--gray-800, #2e3742);
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 150% */
        }
        .title-time {
            color: var(--gray-600, #626c78);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            min-width: fit-content;
        }
    }
    .dashed-line {
        margin: 12px 0px 12px 0px;
        height: 2px;
        position: relative;
        svg {
            width: 100%;
            position: absolute;
            top: 0px;
        }
    }
    .cold-card-content {
        .content-item {
            padding: 4px 8px;
            margin-top: 10px;
            .content-item-title {
                padding: 2px 8px;
                color: var(--gray-900, #1b2129);
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px; /* 183.333% */
                border-radius: 4px;
                background: linear-gradient(90deg, rgba(198, 216, 230, 0.5) 1.01%, rgba(198, 216, 230, 0) 93.1%);
            }
            .content-line-data {
                // height: 50px;
                padding: 4px 8px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px 8px;
                .line-data-item {
                    // width: 50%;
                    min-width: calc(50% - 5px);
                    max-width: 100%;
                    height: 100%;
                    .line-data-value {
                        color: var(--gray-800, #2e3742);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 700;
                        line-height: 24px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .line-data-label {
                        color: var(--gray-600, #626c78);
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 22px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        .line-data-label-compare {
                            padding: ;
                        }
                    }
                }
            }
        }
        .content-item:first-child {
            margin-top: 0px;
        }
        .no-data {
            color: var(--gray-500, var(--gray-500, #8a939e));
            font-size: 14px;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
    .expanded-area {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: linear-gradient(180deg, rgba(235, 237, 253, 0) 0%, #eeedfe 33.24%);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
