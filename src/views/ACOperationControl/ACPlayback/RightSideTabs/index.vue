<template>
    <div ref="containerRef" class="right-side-tabs-container">
        <div class="container">
            <div class="tabs-wrapper">
                <m-tabs v-model="curTab" :data="tabItems" size="large" type="segment"> </m-tabs>
            </div>
            <div v-if="playbackLoading" class="playback-loading-container"></div>
            <template v-else>
                <m-scrollbar v-if="curTab === ENV_ATTR_KEYS.TEMPERATURE" box-class="tab-content" :style="{ 'padding-top': isRightSmallSize ? '12px' : '20px' }">
                    <div
                        key="temperature"
                        :class="['content-wrapper', isPieDataEmpty && isValueSelectionEmpty ? 'empty-container' : '']"
                        :style="{ rowGap: isRightSmallSize ? '12px' : '20px', '--parent-container-height': `${height - 80}px` }"
                    >
                        <PieChartStatistic v-if="!isPieDataEmpty" :space-statistics="pieData" />
                        <ValueChoice v-if="!isValueSelectionEmpty" :value-selection="valueSelectionData" />
                        <Empty v-if="isPieDataEmpty && isValueSelectionEmpty" />
                    </div>
                </m-scrollbar>
                <m-scrollbar v-if="curTab === ENV_ATTR_KEYS.CO2" box-class="tab-content" :style="{ 'padding-top': isRightSmallSize ? '12px' : '20px' }">
                    <div
                        key="co2"
                        :class="['content-wrapper', isPieDataEmpty && isValueSelectionEmpty ? 'empty-container' : '']"
                        :style="{ rowGap: isRightSmallSize ? '12px' : '20px', '--parent-container-height': `${height - 80}px` }"
                    >
                        <PieChartStatistic v-if="!isPieDataEmpty" :space-statistics="pieData" />
                        <ValueChoice v-if="!isValueSelectionEmpty" :value-selection="valueSelectionData" />
                        <Empty v-if="isPieDataEmpty && isValueSelectionEmpty" />
                    </div>
                </m-scrollbar>
            </template>
        </div>
    </div>
</template>

<script setup>
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';
import { MLoading } from 'meri-plus';
import { ENV_TABS, ENV_ATTR_KEYS } from '../../constants/constant';
import { currentEnvParamInjectKey, isRightSmallSizeInjectKey, currentPlayingDataInjectKey, playbackLoadingInjectKey } from '../constant/injectKey';
import PieChartStatistic from './PieChartStatistic.vue';
import ValueChoice from './ValueChoice.vue';
import Empty from '@/components/common/Empty.vue';

const containerRef = ref(null);
const curTab = inject(currentEnvParamInjectKey);
const isRightSmallSize = inject(isRightSmallSizeInjectKey);
const playbackLoading = inject(playbackLoadingInjectKey);
const currentPlayingData = inject(currentPlayingDataInjectKey);

const loadingInstance = ref();
let tabItems = reactive(ENV_TABS);

const { width, height } = useQiankunElementSize(containerRef);

watchEffect(() => {
    if (!width?.value) {
        return;
    }
    if (width.value < 400) {
        isRightSmallSize.value = true;
    } else {
        isRightSmallSize.value = false;
    }
});

watch(
    () => playbackLoading?.value,
    curLoading => {
        if (curLoading) {
            loadingInstance.value = MLoading.service({
                target: '.playback-loading-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            loadingInstance.value?.destroy?.();
        }
    },
    {
        immediate: true
    }
);

const pieData = computed(() => {
    return currentPlayingData?.value?.spaceStatistics;
});

const valueSelectionData = computed(() => {
    return currentPlayingData?.value?.valueSelection;
});

const isPieDataEmpty = computed(() => {
    return !Object.keys(pieData.value || {})?.length;
});

const isValueSelectionEmpty = computed(() => {
    const isValEmpty = !Object.keys(valueSelectionData.value || {})?.length;
    const isFillRateEmpty = !(valueSelectionData.value?.fillRate || [])?.length;
    const isValSelectEmpty = !valueSelectionData.value?.valueSelectType;
    const isLineEmpty = !(valueSelectionData.value?.elecDataList || [])?.length;
    return isValEmpty || (isFillRateEmpty && isValSelectEmpty && isLineEmpty);
});
</script>

<style lang="less" scoped>
.right-side-tabs-container {
    padding: 16px;
    padding-left: 0px;
    height: 100%;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: 16px;

    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 8px 10px 0px rgba(27, 33, 41, 0.03);
}

.tabs-wrapper {
    padding-inline: 16px;

    :deep(.m-tabs.m-tabs-segment) {
        width: 100%;
        .m-tabs-list {
            .m-tabs-item {
                flex: 1;
            }
        }
    }
}

.content-wrapper {
    display: flex;
    flex-direction: column;
    padding-inline: 16px;
    padding-bottom: 16px;
}

.playback-loading-container {
    flex: 1;
    position: relative;
    margin-bottom: 16px;
}

.empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: var(--parent-container-height);
}
</style>
