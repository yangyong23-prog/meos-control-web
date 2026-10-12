<template>
    <div class="passenger-right-side-bar-wrapper">
        <div class="container">
            <!-- <div class="tabs-wrapper">
                <m-tabs v-model="curTab" :data="tabItems" size="large" type="segment"> </m-tabs>
            </div> -->
            <!-- <div v-show="curTab === '1'" class="tab-one-container">
                <RealTimeOverviewTab v-if="!floorView" />
                <FloorSpacesStatisticTab v-else @click-space="clickSpace" @hover-space="hoverSpace" @unhover-space="unhoverSpace" />
            </div> -->
            <AbnormalList
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
// import RealTimeOverviewTab from './RealTimeOverviewTab.vue';
// import FloorSpacesStatisticTab from './FloorSpacesStatisticTab.vue';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import useAbnormalData from '@/views/Common/AbnormalListPlus/useAbnormalData';
import { getAbnormalList } from '@/apis/PassengerFlowStatistics';
import useStore from '@/store';
import { floorViewInjectKey, currentFloorObjInjectKey } from '../constant/injectKey';
import { PASSENGER_FLOW } from '@/utils/globalVariables';

const floorView = inject(floorViewInjectKey);
const currentFloorObj = inject(currentFloorObjInjectKey);
const unpackShow = inject('unpackShow');
const callToggleWidth = inject('callToggleWidth');
const emits = defineEmits(['click-space', 'hover-space', 'unhover-space']);

const { base } = useStore();
const { projectId } = base || {};
// const curTab = ref('1');
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

const queryAbnormalEventListParams = computed(() => {
    const params = {
        projectId: projectId,
        instanceId: projectId,
        instanceType: 'PROJECT',
        runningMonitorType: PASSENGER_FLOW
    };

    if (currentFloorObj?.value) {
        params.instanceId = currentFloorObj.value.floorId;
        params.instanceType = 'FLOOR';
    }

    return params;
});
const { abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalData(queryAbnormalEventListParams, getAbnormalList);

watch(
    () => floorView.value,
    cur => {
        tabItems[0].name = cur ? i18n.global.t('meos_control_web.passenger_flow_statistics') : i18n.global.t('meos_control_web.operation_control');
    },
    {
        immediate: true
    }
);

let _t = null;
watch(
    () => abnormalEventList.value,
    () => {
        if (abnormalEventList.value.length) {
            unpackShow.value = true;
            callToggleWidth(true);
        } else {
            nextTick(() => {
                clearTimeout(_t);
                _t = setTimeout(() => {
                    unpackShow.value = false;
                    callToggleWidth(false);
                }, 1000);
            });
        }
    },
    {
        once: true
    }
);
// watch(
//     () => abnormalAmount.value,
//     cur => {
//         if (cur) {
//             tabItems[1].renderSlot = {
//                 component: h(MBadge, { count: cur, show: true }),
//                 style: {
//                     margin: '-6px 0px 0px 8px'
//                 }
//             };
//         } else {
//             tabItems[1].renderSlot = undefined;
//         }
//     },
//     {
//         immediate: true
//     }
// );

const clickSpace = space => {
    emits('click-space', space);
};
const hoverSpace = space => {
    emits('hover-space', space);
};
const unhoverSpace = () => {
    emits('unhover-space');
};
</script>

<style lang="less" scoped>
.passenger-right-side-bar-wrapper {
    flex: 1;
    height: 100%;
}
.container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
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
    height: 100%;
    padding: 16px;
    padding-right: 0px;
}
:deep(.m-badge .badge.has-99) {
    height: 19px;
}
</style>
