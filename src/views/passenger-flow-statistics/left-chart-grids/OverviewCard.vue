<template>
    <div v-if="!props?.loading" :class="{ 'overview-card-wrapper': true, oneDoor: !props.hasSpaces && doorsCount === 1, 'no-spaces': !props.hasSpaces }">
        <div v-if="props.hasSpaces" class="has-spaces-wrapper">
            <template v-if="doorGroupDataLoading">
                <div class="doors-loading-container"></div>
            </template>
            <template v-else-if="doorsCount > 1">
                <div class="card-details-container">
                    <div class="title">{{ i18n.global.t('meos_control_web.entrance_exit_people_count') }}</div>
                    <m-scrollbar box-class="scrollbar-container" :height="`calc('100%' -42px)`">
                        <template v-for="item in computedList" :key="item.objectId">
                            <OverviewCardRowItem :item="item" :can-select="true" :is-selected="curSelected?.objectId === item.objectId" @toggle-select="handleSelect(item)" />
                        </template>
                    </m-scrollbar>
                </div>
                <div class="card-chart-container">
                    <BarChart :statistic="curSelected?.graph" />
                </div>
            </template>
            <div v-else class="card-item">
                <div v-if="computedList[0]" class="header">
                    <OverviewCardRowItem :item="computedList[0]" :size="'large'" />
                </div>
                <div v-if="computedList[0]" :class="['chart-container', 'with-padding']">
                    <BarChart :statistic="computedList[0]?.graph" />
                </div>
                <div v-if="!computedList[0]" class="empty-container">
                    <Empty />
                </div>
            </div>
        </div>

        <div v-else class="no-spaces-wrapper">
            <template v-if="doorGroupDataLoading">
                <div class="doors-loading-container"></div>
            </template>
            <div v-else-if="computedList?.length" :class="{ 'no-spaces-container': true, oneDoor: doorsCount === 1 }">
                <div v-for="item in computedList" :key="item.objectId" class="card-item">
                    <div class="header">
                        <OverviewCardRowItem :item="item" :size="'large'" />
                    </div>
                    <div class="chart-container">
                        <BarChart :statistic="item.graph" />
                    </div>
                </div>
            </div>
            <div v-else class="empty-container">
                <Empty />
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { extractAndFormatNumber } from '@/utils';
import OverviewCardRowItem from '../components/OverviewCardRowItem.vue';
import BarChart from '../components/BarChart.vue';
import { doorsGroupDataListInjectKey, doorsGroupDataLoadingInjectKey } from '../constant/injectKey';
import { MLoading } from 'meri-plus';
import Empty from '@/components/common/Empty.vue';
import useStore from '@/store';

const { base } = useStore();


const props = defineProps({
    hasSpaces: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: () => false
    }
});
const sseClient = inject('sseClient');

const doorsGroupDataList = inject(doorsGroupDataListInjectKey);
const doorGroupDataLoading = inject(doorsGroupDataLoadingInjectKey);
const doorsDataList = ref([]);

const doorsCount = computed(() => {
    return computedList.value?.length ?? 0;
});

const isProjectItem = item => base?.projectId === item?.objectId;

const computedList = computed(() => {
    const res = doorsDataList?.value
        ?.map(item => {
            const { objectId, objectName: name, outPeopleFlow, inPeopleFlow, accdOutPeopleFlow, accdInPeopleFlow, graph = [] } = item || {};
            const inItem = accdInPeopleFlow ?? inPeopleFlow;
            const outItem = accdOutPeopleFlow ?? outPeopleFlow;
            return {
                objectId,
                name,
                inCount: inItem?.toString() ? extractAndFormatNumber(inItem) : '--',
                outCount: outItem?.toString() ? extractAndFormatNumber(outItem) : '--',
                graph: graph?.map(g => ({ ...g, isDelay: isProjectItem(objectId) }))
            };
        })
        .sort((a, b) => (isProjectItem(a.objectId) ? -1 : 1));

    return res || [];
});
const curSelected = ref();
const loadingInstance = ref();

watch(
    () => doorsGroupDataList?.value,
    cur => {
        if (cur) {
            doorsDataList.value = cur;
        } else {
            doorsDataList.value = [];
        }
    },
    {
        immediate: true
    }
);

watch(
    () => computedList.value,
    cur => {
        if (Array.isArray(cur) && cur.length > 0) {
            curSelected.value = cur[0];
        } else {
            curSelected.value = undefined;
        }
    },
    {
        immediate: true
    }
);

watch(
    () => doorGroupDataLoading?.value,
    cur => {
        if (cur) {
            loadingInstance.value = MLoading.service({
                target: '.doors-loading-container',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                },
                background: 'transparent'
            });
        } else {
            loadingInstance.value?.destroy?.();
        }
    }
);

const handleHeadCountSSE = res => {
    const resData = res?.data;
    if (Array.isArray(resData)) {
        // 全部排序到前面
        doorsDataList.value = resData?.toSorted((a, b) => (isProjectItem(a.objectId) || isProjectItem(b.objectId) ? -1 : 0));
    }
};

onMounted(() => {
    sseClient?.addEventListener('PASSENGER_FLOW_HEAD_TOTAL', handleHeadCountSSE);
});

onUnmounted(() => {
    loadingInstance.value?.destroy?.();
    sseClient?.removeEventListener('PASSENGER_FLOW_HEAD_TOTAL', handleHeadCountSSE);
});

const handleSelect = item => {
    curSelected.value = item;
};
</script>

<style lang="less" scoped>
.overview-card-wrapper {
    position: relative;
    max-height: 100%;
}

.has-spaces-wrapper {
    width: 100%;
    height: 260px;
    display: flex;
    padding: 16px 24px 20px;
    padding-bottom: 0px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);

    .chart-container {
        max-width: 100%;
        flex: 1;
        position: relative;
    }

    .with-padding {
        padding-bottom: 20px;
    }

    .card-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 1px;
    }
}

.card-details-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 16px;

    .title {
        color: @grey-800;
        font-size: 18px;
        font-weight: 700;
        line-height: 26px;
    }
}

:deep(.scrollbar-container) {
    width: 327px;
    padding-right: 8px;
    margin-right: 8px;

    .m-scrollbar__content {
        margin-bottom: 40px;
    }
}

.card-chart-container {
    flex: 1;
    align-self: stretch;
    background-color: transparent;
    padding-bottom: 24px;
}

.no-spaces-wrapper {
    height: 100%;

    .no-spaces-container {
        display: flex;
        flex-direction: column;
        row-gap: 12px;

        .card-item {
            width: 100%;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.8);

            display: flex;
            height: 260px;
            padding: 16px 22px 20px 24px;
            flex-direction: column;
            gap: 1px;

            &:last-child {
                margin-bottom: 16px;
            }
        }

        .chart-container {
            max-width: 100%;
            flex: 1;
            position: relative;
        }
    }
}

.oneDoor {
    height: 100%;
    .card-item {
        flex: 1;
    }
}

.empty-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.doors-loading-container {
    width: 100%;
}

.no-spaces {
    height: 100%;
    .no-spaces-wrapper {
        height: 100%;
    }

    .doors-loading-container {
        height: 100%;
    }
}
</style>
