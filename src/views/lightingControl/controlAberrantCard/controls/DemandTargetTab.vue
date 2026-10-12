<template>
    <div class="demand-target-wrapper" :style="{ '--above-height': (aboveHeight || 0) + 'px', '--total-height': (containerHeight || 0) + 'px' }">
        <div ref="timeSlotContainerRef" class="range-container">
            <RectanglesDiff
                ref="rectanglesDiffRef"
                :default-template-type="defaultTemplateType"
                :model-view="modelView"
                :diff-arr="diffData"
                :demand-arr="demandData"
                :active-time="activeTimeRef"
                @rectangle-select="setSelect"
                @rectangle-active="setActive"
            >
                <template #action>
                    <m-button type="link" size="medium" @click="showModal">{{ i18n.global.t('meos_control_web.manual_intervention1') }}</m-button>
                </template>
            </RectanglesDiff>
        </div>
        <div class="demand-active-container">
            <DemandActiveOverview
                ref="overviewContainerRef"
                :model-name="instanceName"
                :model-view="modelView"
                :overview-data="overviewData"
                :selected-item="selectedItem"
                :active-time-pool="activeTimePool"
            />
            <div v-if="hasDemands" :class="{ 'demand-data-all-container': true, 'demand-loading': loadings.demandLoading }">
                <ManualIntervention v-if="isIntervention" :data="interventionData" @refresh:list="refreshList" />
                <ConfigList v-else :data="configData" :is-space-detail="isSpaceDetail" />
            </div>
            <template v-else>
                <div v-if="!loadings.demandLoading" class="empty">
                    <SvgIcon name="empty" />
                    <div class="text">{{ i18n.global.t('meos_control_web.no_demand2') }}</div>
                </div>
            </template>
        </div>
        <manual-intervention-sidebar
            v-if="showManualListDrawer"
            :instance-type="manualListData.instanceType"
            :instance-ids="manualListData.instanceIds"
            :begin-date-time="manualListData.beginDateTime"
            :end-date-time="manualListData.endDateTime"
            :show-close="false"
            @close="closeModal"
        />
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import RectanglesDiff from './RectanglesDiff.vue';
import DemandActiveOverview from './DemandActiveOverview.vue';
import ConfigList from '../../components/config-list/index.vue';
import ManualIntervention from '../../components/manual-intervention/index.vue';
import manualInterventionSidebar from '../../components/sidebar/manualInterventionSidebar.vue';
import { Rectangle } from './types';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { LightDemandTemplateType } from './constant';
import { getInstanceConfigInfo, getInterventionList, getInterventionTimeRange, getSpaceStatistics } from '@/apis/lightingDemandIntervention';
import dayjs from 'dayjs';
import { InterventionProps } from '../../components/manual-intervention/types';
import { ConfigDataItem } from '../../components/config-list/types';
import { MLoading } from 'meri-plus';
import { useElementSize } from '@vueuse/core';

interface ManualListData {
    instanceType: string;
    instanceIds: string[];
    beginDateTime: string;
    endDateTime: string;
}

const props = defineProps({
    hasSpaces: {
        type: Boolean,
        default: true
    },
    defaultConfigItem: {
        type: Object,
        default: () => {}
    },
    defaultTemplateType: {
        type: String,
        default: ''
    },
    isSpaceDetail: {
        type: Boolean,
        default: false
    },
    containerHeight: {
        type: Number,
        default: 0
    }
});

const timeSlotContainerRef = ref(null);
const overviewContainerRef = ref(null);
const { height: topHeight } = useElementSize(timeSlotContainerRef);
const { height: overviewHeight } = useElementSize(overviewContainerRef);

const aboveHeight = computed(() => {
    return (overviewHeight.value ?? 0) + (topHeight.value ?? 0) + 20;
});

const emits = defineEmits(['refresh-time-slot']);

const rectanglesDiffRef = ref<any>(null);
const waitToSelectedConfigId = ref<string>('');

const parentTemplateType: any = inject('templateType', LightDemandTemplateType.PUBLIC_AREA);
const templateType: any = ref(LightDemandTemplateType.PUBLIC_AREA);
const instanceTypeVisible: any = inject('instanceTypeVisible');
const indIdVisible: any = inject('indIdVisible');

watch(
    [() => props.defaultTemplateType, parentTemplateType],
    ([curDefault, curParent]) => {
        if (curDefault) {
            templateType.value = curDefault;
        } else {
            templateType.value = curParent;
        }
    },
    {
        immediate: true
    }
);

const modelView = computed(() => {
    return instanceTypeVisible.value ? instanceTypeVisible.value?.toLowerCase() : 'project';
});

const instanceName = inject('instanceName', '');

const instanceParams = computed(() => {
    return {
        instanceId: indIdVisible.value,
        instanceType: instanceTypeVisible.value,
        runMonitorSecondType: templateType.value
    };
});

const activeRectangleItemParams = ref({
    configId: '',
    sceneType: '',
    beginDateTime: '',
    endDateTime: '',
    isSelect: false
});

const selectedItem = ref<Rectangle>();
const activeTimePool = ref<Rectangle[]>([]);
const activeTimeRef = ref<number>(getDayjsTz().valueOf());

const activeTimeItem = computed(() => {
    const res = activeTimePool.value[0];
    if (res?.isNone) return;
    return res;
});

function setSelect(rec?: Rectangle) {
    selectedItem.value = rec;
}
function setActive(data: Rectangle[]) {
    activeTimePool.value = data;
}

const showManualListDrawer = ref(false);
const manualListData = ref<ManualListData>({ instanceType: '', instanceIds: [], beginDateTime: '', endDateTime: '' });

const hasDemands = ref(false);
const isIntervention = ref(false);
const demandData = ref<Rectangle[]>([]);
const diffData = ref<Rectangle[][]>([]);
const overviewData = ref({});
const configData = ref({});
const interventionData = ref<InterventionProps[]>([]);

const queryTimeRangeAbortController = ref();
const loadings = reactive({
    totalLoading: false,
    demandLoading: false
});
const loadingInstance = ref();
const demandLoadingInstance = ref();

function clearEffect() {
    queryTimeRangeAbortController.value?.abort?.();
    setSelect();
    setActive([]);
    activeRectangleItemParams.value = { configId: '', sceneType: '', beginDateTime: '', endDateTime: '', isSelect: false };

    demandData.value = [];
    diffData.value = [];
    overviewData.value = {};
    configData.value = {};
    interventionData.value = [];
}

async function getTimeRangeListData(cur: Record<string, any>) {
    queryTimeRangeAbortController.value = new AbortController();
    const beginDateTime = getDayjsTz().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endDateTime = getDayjsTz().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    const params = {
        ...cur,
        beginDateTime,
        endDateTime
    };
    if (!cur.runMonitorSecondType) {
        return;
    }
    try {
        loadings.totalLoading = true;
        const res = await getInterventionTimeRange(params, {
            signal: queryTimeRangeAbortController.value.signal
        });
        if (res?.code === SUCCESSCODE) {
            const { demand, source, aggregation } = (res?.data || {}) as any;
            if (Array.isArray(demand) && demand?.length) {
                demandData.value = demand.map(v => {
                    const { configId, beginDateTime: start, endDateTime: end, configName } = v || {};
                    return {
                        configId,
                        timeRange: [start, end],
                        name: configName,
                        type: 'auto'
                    };
                });
            }

            if (Array.isArray(source) && source?.length) {
                let diffArr: Rectangle[][] = [],
                    unionArr: any[] = [];
                if (Array.isArray(aggregation) && aggregation?.length) {
                    unionArr = aggregation
                        .sort((a, b) => {
                            const aBeginTime = dayjs(a.beginDateTime).valueOf();
                            const bBeginTime = dayjs(b.beginDateTime).valueOf();
                            return aBeginTime - bBeginTime;
                        })
                        .map(v => {
                            const { configId, beginDateTime: start, endDateTime: end, instanceType } = v || {};
                            return {
                                configId,
                                timeRange: [start, end],
                                type: 'aggregation',
                                instanceType: instanceType.toString().toLowerCase()
                            };
                        });
                }
                const sourceArr: Rectangle[][] = source.map(v => {
                    const { instanceType, timeSlot } = v || {};
                    return timeSlot
                        .sort((a: any, b: any) => {
                            const aBeginTime = dayjs(a.beginDateTime).valueOf();
                            const bBeginTime = dayjs(b.beginDateTime).valueOf();
                            return aBeginTime - bBeginTime;
                        })
                        .map((item: any) => {
                            const { configId, beginDateTime: start, endDateTime: end } = item || {};
                            return { configId, timeRange: [start, end], type: instanceType.toString().toLowerCase() };
                        });
                });
                if (unionArr?.length) {
                    diffArr.push(unionArr);
                }
                if (sourceArr?.length > 1) {
                    diffArr = [...diffArr, ...sourceArr];
                } else if (sourceArr?.length === 1) {
                    diffArr = [...sourceArr];
                }

                diffData.value = diffArr;

                if (waitToSelectedConfigId.value && rectanglesDiffRef.value) {
                    nextTick(() => {
                        rectanglesDiffRef.value?.clickRectangleById?.(waitToSelectedConfigId.value);
                        waitToSelectedConfigId.value = '';
                    });
                }
            }
        }
    } catch (error) {
        loadings.totalLoading = false;
    }
}

async function getSummaryData(activeItem: Record<string, any>) {
    const { instanceId, instanceType, runMonitorSecondType, configId, sceneType } = activeItem || {};
    const params = {
        runningMonitorSecondType: runMonitorSecondType,
        instanceType,
        instanceId,
        configId,
        sceneType
    };
    const res = await getSpaceStatistics({ ...params });
    if (res?.code === SUCCESSCODE) {
        const { total, matchingCount, autoCount, interventionCount } = (res?.data || {}) as any;
        overviewData.value = {
            total,
            matchingCount,
            autoCount,
            interventionCount
        };
    }
    return res;
}

async function getCurrentInterventionListData(activeItem: Record<string, any>) {
    const { instanceId, instanceType, runMonitorSecondType, beginDateTime, endDateTime, configId, isSelect } = activeItem || {};
    const current = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
    const fiveMinutes = getDayjsTz().add(1, 'minute').format('YYYY-MM-DD HH:mm:ss');
    const params = {
        runningMonitorSecondType: runMonitorSecondType,
        instanceType,
        instanceIds: instanceId ? [instanceId] : [],
        beginDateTime: beginDateTime ?? current,
        endDateTime: endDateTime ?? fiveMinutes,
        ...(isSelect ? { configId } : {})
    };
    const res = await getInterventionList(params);
    if (res?.code === SUCCESSCODE) {
        if (Array.isArray(res?.data)) {
            const { configList } = (res?.data?.[0] || {}) as any;
            interventionData.value = configList?.map((v: any) => ({
                ...v,
                configId: v.id,
                instanceId,
                instanceType,
                runningMonitorSecondType: runMonitorSecondType
            }));
        }
    }
    return res;
}

async function getCurrentDemandConfigListData(activeItem: Record<string, any>) {
    const { instanceId, instanceType, runMonitorSecondType, configId } = activeItem || {};
    const params = {
        instanceId,
        instanceType,
        demandTemplateType: runMonitorSecondType,
        sceneId: configId
    };
    const res = await getInstanceConfigInfo(params);
    if (res?.code === SUCCESSCODE) {
        const { global, space, spaceFeedbackAdjust } = (res?.data || {}) as any;
        configData.value = { global, space, spaceFeedbackAdjust } as ConfigDataItem;
    }
    return res;
}

watch(
    () => props?.defaultConfigItem,
    cur => {
        if (cur) {
            waitToSelectedConfigId.value = cur?.configId;
            rectanglesDiffRef.value?.clickRectangleById?.(waitToSelectedConfigId.value);
        }
    },
    {
        immediate: true
    }
);

watch(
    instanceParams,
    cur => {
        if (cur) {
            clearEffect();
            showManualListDrawer.value = false;
            getTimeRangeListData(cur);
        }
    },
    {
        immediate: true
    }
);

watch(
    [selectedItem, activeTimeItem],
    ([curSelect, curActiveItem]) => {
        const { timeRange, type, isNone, configId } = curSelect ?? (curActiveItem || {});

        if (isNone || !configId) {
            loadings.totalLoading = false;
        }

        if (curSelect?.type) {
            activeRectangleItemParams.value = {
                configId: curSelect?.configId || '',
                sceneType: curSelect?.type === 'auto' ? 'AUTO' : 'INTERVENTION',
                beginDateTime: timeRange?.[0] || '',
                endDateTime: timeRange?.[1] || '',
                isSelect: true
            };
        } else {
            if (curActiveItem?.configId) {
                if (waitToSelectedConfigId.value) {
                    rectanglesDiffRef.value?.clickRectangleById?.(waitToSelectedConfigId.value);
                    waitToSelectedConfigId.value = '';
                    return;
                }
                activeRectangleItemParams.value = {
                    configId: curActiveItem?.configId || '',
                    sceneType: curActiveItem?.type === 'auto' ? 'AUTO' : 'INTERVENTION',
                    beginDateTime: timeRange?.[0] || '',
                    endDateTime: timeRange?.[1] || '',
                    isSelect: false
                };
            }
        }

        hasDemands.value = type ? !isNone : false;
        if (timeRange) {
            isIntervention.value = type !== 'auto';
        }
    },
    {
        immediate: true
    }
);

watch(
    [activeRectangleItemParams, () => props.hasSpaces],
    async ([cur, curHasSpaces]) => {
        const { configId, sceneType, beginDateTime, endDateTime, isSelect } = cur || {};
        const instanceCommon = instanceParams.value || {};
        // 需求模板类型为空时 runningMonitorSecondType 会丢失，接口返回「无效的用户输入」，此时不发起请求
        if (configId && instanceCommon.runMonitorSecondType) {
            try {
                interventionData.value = [];
                configData.value = {};
                loadings.demandLoading = true;

                if (curHasSpaces) {
                    await getSummaryData({ ...instanceCommon, configId, sceneType });
                }
                if (!sceneType) {
                    loadings.demandLoading = false;
                    loadings.totalLoading = false;
                    return;
                }
                if (sceneType !== 'AUTO') {
                    await getCurrentInterventionListData({ ...instanceCommon, beginDateTime, endDateTime, configId, isSelect }).finally(() => {
                        loadings.demandLoading = false;
                        loadings.totalLoading = false;
                    });
                } else {
                    await getCurrentDemandConfigListData({ ...instanceCommon, configId }).finally(() => {
                        loadings.demandLoading = false;
                        loadings.totalLoading = false;
                    });
                }
            } catch (error) {
                loadings.demandLoading = false;
                loadings.totalLoading = false;
            }
        } else {
            loadings.totalLoading = false;
        }
    },
    {
        immediate: true
    }
);

watch(
    () => loadings.totalLoading,
    cur => {
        if (cur) {
            loadingInstance.value = MLoading.service({
                target: '.demand-target-wrapper',
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

watch(
    [() => loadings.demandLoading, () => loadings.totalLoading],
    ([cur, curTotal]) => {
        if (curTotal) {
            demandLoadingInstance.value?.destroy?.();
        } else {
            if (cur) {
                nextTick(() => {
                    demandLoadingInstance.value = MLoading.service({
                        target: '.demand-data-all-container',
                        fullscreen: false,
                        duration: 30000,
                        lottieName: 'ball',
                        loadIconStyle: {
                            width: '100px',
                            height: '100px'
                        }
                    });
                });
            } else {
                demandLoadingInstance.value?.destroy?.();
            }
        }
    },
    {
        immediate: true
    }
);

const closeModal = () => {
    showManualListDrawer.value = false;
    clearEffect();
    activeTimeRef.value = getDayjsTz().valueOf();
    emits('refresh-time-slot', { key: new Date().toISOString(), demandTemplateType: templateType.value });
    getTimeRangeListData(instanceParams.value);
};

const showModal = () => {
    const { instanceType, instanceId } = instanceParams.value || {};
    const currentTime = getDayjsTz().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const tomorrow = getDayjsTz().add(1, 'day').set('hour', 23).set('minute', 55).set('second', 0);
    const endDateTime = tomorrow.format('YYYY-MM-DD HH:mm:ss');
    manualListData.value = {
        instanceType,
        instanceIds: [instanceId],
        beginDateTime: currentTime,
        endDateTime
    };
    showManualListDrawer.value = true;
};

const refreshList = async (item: unknown[]) => {
    if (Array.isArray(item)) {
        clearEffect();
        activeTimeRef.value = getDayjsTz().valueOf();
        emits('refresh-time-slot', { key: new Date().toISOString(), demandTemplateType: templateType.value });
        getTimeRangeListData(instanceParams.value);
    }
};

onUnmounted(() => {
    loadings.demandLoading = false;
    loadings.totalLoading = false;
    loadingInstance.value?.destroy?.();
    demandLoadingInstance.value?.destroy?.();
});
</script>

<style lang="less" scoped>
.demand-target-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    padding: 20px 16px 0px 16px;
    --top-padding: 20px;
    row-gap: 20px;
}

.demand-active-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    row-gap: 12px;
}

.demand-data-all-container {
    width: 100%;
    flex: 1;
}

.demand-data-all-container.demand-loading {
    position: absolute;
    top: calc(var(--above-height) + var(--top-padding));
    left: 0;
    width: 100%;
    height: calc(var(--total-height) - var(--above-height) - var(--top-padding));

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.empty {
    position: absolute;
    top: calc(var(--above-height) + var(--top-padding));
    left: 0;
    width: 100%;
    height: calc(var(--total-height) - var(--above-height) - var(--top-padding));

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .text {
        color: var(--gray-600, #626c78);
        text-align: center;

        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-top: 8px;
    }
}
</style>
