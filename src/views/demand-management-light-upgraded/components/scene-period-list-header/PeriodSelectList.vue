<template>
    <div class="scene-select-container">
        <m-select v-if="periodOptionList.length > 1" v-model="curSelectedPeriodId" :size="216" class="period-sel" noborder :options="periodOptionList" :label-key="'hoverText'">
            <template #nodeSlot="node">
                <span v-ellipsis class="m-ellipsis">{{ node.name }}</span>
            </template>
        </m-select>
        <div v-if="periodOptionList.length === 1" class="single-scene-title">
            <span v-ellipsis class="scene-title m-ellipsis"> {{ periodOptionList[0]?.hoverText || '' }}</span>
        </div>
    </div>
</template>

<script setup>
import { getSceneTimeTitle } from '../../utils/getSceneTimeConfig';
import { scenePeriodListKey, curSelectedPeriodIdKey } from '../../hooks/useGlobalData';

const scenePeriodList = inject(scenePeriodListKey);
const curSelectedPeriodId = inject(curSelectedPeriodIdKey);

const periodOptionList = computed(() => {
    const result = scenePeriodList?.value?.map(obj => {
        const timeText = getSceneTimeTitle(obj);
        return {
            name: obj.sceneName,
            id: obj.id,
            timeText,
            timeTextMore: `(${timeText})`,
            hoverText: `${obj.sceneName || ''}(${timeText})`
        };
    });
    return result || [];
});
</script>

<style lang="less" scoped>
.scene-select-container {
    position: relative;
    width: 216px;
    :deep(.m-select-inner-value) {
        order: 1;
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        margin-right: 4px;
        max-width: fit-content;
    }

    :deep(.m-select-inner-prefix) {
        order: 2;
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }
}

.single-scene-title {
    max-width: 216px;
    padding: 0 8px 0 12px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    .scene-title {
        color: var(--gray-900, #1b2129);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        white-space: nowrap;
    }
    .scene-time {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-left: 4px;
        white-space: nowrap;
    }
}
</style>
