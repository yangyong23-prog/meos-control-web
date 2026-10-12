<template>
    <div class="next-cold-card">
        <div class="cold-card-title">
            <div v-ellipsis class="title-text meos-ellipsis-line">{{ i18n.global.t('meos_control_web.next_period_end_adjustment_strategy') }}</div>
            <div class="title-time">{{ computedStartTime }}</div>
        </div>
        <div class="dashed-line">
            <svg xmlns="http://www.w3.org/2000/svg" width="360" height="2" viewBox="0 0 360 2" fill="none">
                <path d="M0 1H616" stroke="#C4C9CF" stroke-opacity="0.6" stroke-dasharray="5 4" />
            </svg>
        </div>
        <I18nSlot html-tag="div" class="text-line" name-key="meos_control_web.spaces_scheduled_temp_above_comfort_not_overheat">
            <template #num>
                <span>{{ stgySpaceTdbTypeList.length }}</span>
            </template>
        </I18nSlot>
        <div v-if="stgySpaceTdbTypeList?.length > 0" class="space-line">
            <div v-for="item in stgySpaceTdbTypeList" :key="item.spaceId" class="space-line-item">
                <m-tips :content="stgySpaceTdbName(item.spaceId)" theme="darkTransparent" placement="top" trigger="hover">
                    <div class="space-item-label">{{ stgySpaceTdbName(item.spaceId) }}</div>
                </m-tips>
                <div v-ellipsis class="space-item-value m-ellipsis">{{ i18n.global.t('meos_control_web.temperature_colon') }}{{ tdbGoal(item.tdbGoal) }}°C</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import { strategyOverviewTempKey, objectsMapKey, currentSystemIdKey } from '../../../../../hooks/useStaticData';
import { broadcastAndComputeEndTimeKey, activeStrategyIndexKey } from '../../../../../injectionKey';
import treeBuildFloor from '@/store/treeBuildFloor';
import dayjs from 'dayjs';
import { template } from 'lodash';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import { formatAIDebugTime, getTimeSeriesSummary, logAIDebug } from '../../../../../utils/debug';

const props = defineProps({
    loading: Boolean,
    noData: Boolean
});

const strategy = inject(strategyOverviewTempKey);
const objectsMap = inject(objectsMapKey);
const broadcastAndComputeEndTime = inject(broadcastAndComputeEndTimeKey);
const activeIndex = inject(activeStrategyIndexKey);
const systemId = inject(currentSystemIdKey);
const nextEndDebugState = ref('');

const logNextEndDebug = (message, payload) => {
    const signature = JSON.stringify({ message, payload });
    if (nextEndDebugState.value === signature) {
        return;
    }
    nextEndDebugState.value = signature;
    logAIDebug('final-strategy-end', message, payload);
};

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

// 超过舒适温度空间列表
const stgySpaceTdbTypeList = computed(() => {
    if (!bestStrategy.value) return [];
    const keys = Object.keys(bestStrategy.value?.stgySpace || {});
    const nextIndex = getNextIndex(bestStrategy.value?.stgySpace?.[keys[0]]);
    if (!nextIndex && nextIndex !== 0) return [];
    if (keys.length < 1) return [];
    let list = [];
    for (let i = 0; i < keys.length; i++) {
        const item = bestStrategy.value.stgySpace[keys[i]][nextIndex];
        if (item.schedule === 1) {
            list.push({
                ...item,
                spaceId: keys[i]
            });
        }
    }
    list.sort((a, b) => {
        const buildA = treeBuildFloor().getBuildOrFloor(objectsMap.value[a.spaceId].buildingId);
        const buildB = treeBuildFloor().getBuildOrFloor(objectsMap.value[b.spaceId].buildingId);
        if (buildA.localName !== buildB.localName) {
            return buildA.localName.localeCompare(buildB.localName);
        } else {
            const floorA = treeBuildFloor().getBuildOrFloor(objectsMap.value[a.spaceId].floorId);
            const floorB = treeBuildFloor().getBuildOrFloor(objectsMap.value[b.spaceId].floorId);
            return floorB.floorSequenceId - floorA.floorSequenceId;
        }
    });
    return list;
});

const stgySpaceTdbName = computed(() => {
    return id => {
        if (!bestStrategy.value) return '--';
        if (id) {
            let floorName = '',
                buildName = '',
                spaceName = '';
            if (objectsMap.value[id]) {
                floorName = treeBuildFloor().getBuildOrFloor(objectsMap.value[id].floorId).localName;
                buildName = treeBuildFloor().getBuildOrFloor(objectsMap.value[id].buildingId).localName;
                spaceName = objectsMap.value[id].localName;
            }
            return `${buildName}-${floorName}-${spaceName} `;
        }
        return '--';
    };
});

const tdbGoal = computed(() => {
    return tdbGoal => {
        if (tdbGoal || tdbGoal === 0) {
            return Math.round(tdbGoal * 10) / 10;
        }
        return '--';
    };
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

watchEffect(() => {
    const spaceKeys = Object.keys(bestStrategy.value?.stgySpace || {});
    const sampleSpaceId = spaceKeys[0] ?? null;
    const nextIndex = getNextIndex(bestStrategy.value?.stgySpace?.[sampleSpaceId]);
    logNextEndDebug('末端调节卡片状态', {
        hasBestStrategy: Boolean(bestStrategy.value),
        currentTime: formatAIDebugTime(currentTime.value),
        bestStrategyCode: bestStrategy.value?.stgyIndicator?.strategyCode ?? null,
        predACACSummary: getTimeSeriesSummary(bestStrategy.value?.curPredACAC),
        stgySpaceKeyCount: spaceKeys.length,
        sampleSpaceId,
        sampleSpaceSummary: getTimeSeriesSummary(bestStrategy.value?.stgySpace?.[sampleSpaceId]),
        nextIndex,
        displayedSpaceCount: stgySpaceTdbTypeList.value.length
    });
});
</script>

<style lang="less" scoped>
.next-cold-card {
    padding: 12px 16px 20px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 2px 1px 0px 0px rgba(255, 255, 255, 0.6) inset;
    .cold-card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-text {
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
    .text-line {
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px; /* 200% */
        span {
            font-weight: 700;
            font-size: 18px;
        }
    }
    .space-line {
        margin-top: 12px;
        .space-line-item {
            margin-top: 8px;
            border-radius: 4px;
            background: rgba(211, 229, 251, 0.6);
            padding: 6px 8px;
            .space-item-label {
                display: inline-block;
                vertical-align: middle;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: var(--gray-900, #1b2129);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                width: calc(100% - 92px);
            }
            .space-item-value {
                display: inline-block;
                vertical-align: middle;
                width: 92px;
                color: var(--gray-600, #626c78);
                text-align: right;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
            }
        }
    }
}
</style>
