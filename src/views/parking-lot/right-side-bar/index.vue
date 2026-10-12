<template>
    <div class="parking-right-side-bar-wrapper">
        <div class="container">
            <div class="tabs-wrapper">
                <m-tabs v-model="curTab" :data="tabItems" size="large" type="segment"> </m-tabs>
            </div>
            <div v-show="curTab === '1'" class="tab-one-container">
                <Controls v-if="!floorView" />
                <floorConstant v-if="floorView" />
            </div>
            <AbnormalList
                v-show="curTab === '2'"
                class="abnormal-list-warp"
                :abnormal-event-list="abnormalEventList"
                :abnormal-event-list-loading="abnormalEventListLoading"
                :abnormal-event-list-update-time="abnormalEventListUpdateTime ?? ''"
                :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                @total-amount-change="handleTotalAmountChange"
            />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { h } from 'vue';
import { MBadge } from 'meri-plus';
import { isMeosFrame } from '@/utils/envUtils';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import useAbnormalData from '@/views/Common/AbnormalListPlus/useAbnormalData';
import { getAbnormalList } from '@/apis/PassengerFlowStatistics';
import useStore from '@/store';
import Controls from '../Controls/index.vue';
import floorConstant from '../floorConstant/index.vue';
import { runningMonitorSecondTypeInjectKey, currentFloorObjInjectKey, floorViewInjectKey } from '../constant/injectKey';

const { base } = useStore();
const { projectId } = base || {};

const runningMonitorType = inject(runningMonitorSecondTypeInjectKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const floorView = inject(floorViewInjectKey);

const curTab = ref('1');
const baseTabItems = [
    {
        id: '1',
        name: i18n.global.t('meos_control_web.parking_space_count')
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
const queryAbnormalEventListParams = computed(() => {
    const params = {
        projectId: projectId,
        instanceId: projectId,
        instanceType: 'PROJECT',
        runningMonitorType: runningMonitorType
    };

    if (currentFloorObj?.value?.floorId) {
        params.instanceId = currentFloorObj.value.floorId;
        params.instanceType = 'FLOOR';
    }

    return params;
});
const { abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList, abnormalEventListLoadedTime } = useAbnormalData(queryAbnormalEventListParams, getAbnormalList);

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

.tab-one-container {
    height: calc(100% - 44px);
}

.abnormal-list-warp {
    margin-top: 20px;
    height: calc(100% - 64px);
    padding-left: 16px;
    padding-bottom: 12px;
}
</style>
