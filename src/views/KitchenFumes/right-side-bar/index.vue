<template>
    <div class="parking-right-side-bar-wrapper">
        <div class="container">
            <!-- <template v-if="isEdge()"> -->
            <div class="tabs-wrapper">
                <m-tabs v-model="curTab" :data="tabItems" size="large" type="segment"> </m-tabs>
            </div>
            <div v-show="curTab === '1'" class="tab-one-container">
                <Controls />
            </div>
            <AbnormalList
                v-show="curTab === '2'"
                class="abnormal-list-warp isEdge"
                :abnormal-event-list="abnormalEventList"
                :abnormal-event-list-loading="abnormalEventListLoading"
                :abnormal-event-list-update-time="abnormalEventListUpdateTime ?? ''"
                :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                :show-type="'subPanel'"
                @total-amount-change="handleTotalAmountChange"
            />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { h } from 'vue';
import { MBadge } from 'meri-plus';
import _ from 'lodash';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import useStore from '@/store';
import { isEdge, isMeosFrame } from '@/utils/envUtils';
import Controls from '../Controls/index.vue';
import { currentFloorObjInjectKey } from '../constant/injectKey';
import { RUNNING_MONITOR_TYPE } from '../constant/index';

import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { ABNORMAL_EVENT } from '@/utils/SSEEventTypes';

const { base } = useStore();
const { projectId } = base || {};

const currentFloorObj = inject(currentFloorObjInjectKey);
const abnormalParamIds = inject('abnormalParamIds');
const claasCode2objectIds = inject('claasCode2objectIds');

const { sseClient, setSSEClientOption } = useSinglePOSTSSEClient(RUNNING_MONITOR_TYPE);

const curTab = ref('1');
onMounted(() => {
    // isEdge() ? (curTab.value = '1') : (curTab.value = '2');
});
const baseTabItems = [
    {
        id: '1',
        name: i18n.global.t('meos_control_web.operation_control')
    },
    {
        id: '2',
        name: i18n.global.t('meos_control_web.abnormal_event')
    }
];
const tabItems = reactive(baseTabItems);

const abnormalAmount = ref(0);
const handleTotalAmountChange = val => {
    abnormalAmount.value = val;
};

const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime } = useAbnormalDataWithSSE({
    sseClient,
    objectIds: abnormalParamIds
});

watch(
    () => claasCode2objectIds?.value,
    () => {
        if (claasCode2objectIds?.value && !_.isEmpty(claasCode2objectIds.value)) {
            setSSEClientOption({ claasCode2objectIds: claasCode2objectIds.value, eventType: [ABNORMAL_EVENT] });
        } else if (abnormalEventListLoading) {
            abnormalEventListLoading.value = false;
            abnormalEventListLoadedTime.value = new Date().toISOString();
        }
    }
);

watch(
    () => abnormalParamIds?.value,
    () => {
        if (abnormalParamIds?.value?.length > 0) {
            const params = {
                projectId: projectId,
                instanceIds: abnormalParamIds.value,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                // 二级风控目标过滤，E5"空气质量差"，E34"偏冷",E35"偏热"
                riskMeasureAimLevel2: ['E5', 'E34', 'E35']
            };
            onQueryAbnormalEventList(params);
        } else if (abnormalEventListLoading) {
            abnormalEventListLoading.value = false;
            abnormalEventListLoadedTime.value = new Date().toISOString();
        }
    }
);

watch(
    () => abnormalAmount.value,
    cur => {
        if (cur) {
            tabItems[1].renderSlot = {
                component: h(MBadge, { count: cur, show: true }),
                style: {
                    margin: '-6px 0px 0px 8px',
                    // 仅在 meos-frame 下补齐徽标插槽高度。
                    minHeight: isMeosFrame() ? '16px' : undefined
                }
            };
        } else {
            tabItems[1].renderSlot = undefined;
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.parking-right-side-bar-wrapper {
    flex: 1;
    height: 100%;
}
.container {
    display: flex;
    padding-top: 12px;
    flex-direction: column;
    height: 100%;

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

.abnormal-list-warp {
    margin-top: 12px;
    padding-left: 16px;
    padding-bottom: 12px;
    height: 100%;
}
.tab-one-container {
    height: calc(100% - 44px);
}
.isEdge {
    height: calc(100% - 64px);
}
.abnormal-title-cloud {
    margin: 0 16px;
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
    padding-bottom: 10px;
    height: 42px;
}
</style>
