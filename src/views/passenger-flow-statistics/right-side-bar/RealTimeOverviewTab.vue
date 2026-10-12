<template>
    <m-scrollbar box-class="realtime-overview-wrapper">
        <m-list-skeleton v-if="loading" />
        <template v-else-if="hasData">
            <RealTimeOverview :total-count="computedTotalCount" :line-data="computedTrendsData" />
        </template>
        <div v-else class="empty-container">
            <Empty />
        </div>
    </m-scrollbar>
</template>

<script setup>
import RealTimeOverview from '../components/RealTimeOverview.vue';
import { listInfoCodeConfigsByObject } from '@/apis/airterminalxplantrunmonitor';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import useStore from '@/store';
import Empty from '@/components/common/Empty.vue';
import { DETAIL, IOT_RUNNING, PASSENGER_FLOW } from '@/utils/globalVariables';

const { base } = useStore();
const { projectId } = base;
const targetIdRef = computed(() => projectId);

const totalCount = ref({});
const trendsData = ref({});
const loading = ref();
const hasData = ref(false);

const computedTotalCount = computed(() => {
    const iotUpdateData = totalCount.value?.relInfoCodeConfigs?.find(v => {
        return v?.infoCodeType === IOT_RUNNING && v?.infoCode === 'exsitPeopleNum';
    });
    return iotUpdateData?.dataValue;
});

const computedTrendsData = computed(() => {
    const iotUpdateData = trendsData.value?.relInfoCodeConfigs?.find(v => {
        return v?.infoCodeType === 'IOT_PERSISTENCE_TREND' && v?.infoCode === 'exsitPeopleNum';
    });
    return iotUpdateData?.dataValue || [];
});

const getData = async () => {
    totalCount.value = {};
    trendsData.value = [];
    hasData.value = false;

    loading.value = true;
    const res = await listInfoCodeConfigsByObject({
        runningMonitorType: PASSENGER_FLOW,
        objectIds: [projectId],
        templateCode: DETAIL
    }).finally(() => {
        loading.value = false;
    });
    const resData = res?.data;
    if (res?.code === '00000' && Array.isArray(resData)) {
        const currentItem = resData?.find(v => v?.id === projectId) || {};

        if (currentItem) {
            hasData.value = true;
        } else {
            hasData.value = false;
        }

        const totalItem = currentItem?.relInfoCodeGroupConfigs?.find(v => v?.groupCode === 'currentPassengerFlowStatistic') || {};
        totalCount.value = { ...totalItem, groupChildren: [] };
        const trendsItem = totalItem?.groupChildren?.find(g => g?.groupCode === 'currentPassengerFlowStatisticTrend') || {};
        trendsData.value = trendsItem;
    }
};

onMounted(() => {
    getData();
});

useEquipInfoSSEHandle(
    targetIdRef,
    {
        totalCount: totalCount,
        trendsData: trendsData
    },
    false,
    DETAIL
);
</script>

<style lang="less" scoped>
:deep(.realtime-overview-wrapper) {
    padding-top: 20px;
    padding-inline: 16px;
}

:deep(.m-scrollbar__content) {
    height: 100%;
}

.empty-container {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
}
</style>
