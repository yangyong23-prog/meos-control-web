<template>
    <div class="right-side-bar-wrapper">
        <div class="container">
            <div :key="parentTabSize" class="tabs-wrapper">
                <m-tabs v-model="curTab" :data="tabItems" :size="parentTabSize" type="segment"> </m-tabs>
            </div>
            <!-- 运行控制 -->
            <div v-show="curTab === '1'" class="tab-one-container" :style="{ marginTop: isLapTop ? '4px' : '12px' }">
                <div class="sub-tabs-wrapper">
                    <div class="tab-box">
                        <m-tabs v-model="curSubTab" :data="subTabItems" size="large">
                            <template #name="{ item }">{{ item.name }}</template>
                        </m-tabs>
                    </div>
                    <m-button v-if="isEdge()" size="small" @click="equipmentBtn">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
                </div>
                <!-- 数据统计 -->
                <div v-show="curSubTab === 'dataStatistics'" style="height: calc(100% - 56px)" :class="['mt16', 'data-analysis-container']">
                    <m-scrollbar box-class="data-control-scrollbar">
                        <dataAnalysis />
                    </m-scrollbar>
                </div>
                <!-- 需求目标 -->
                <div v-if="curSubTab === 'demandTarget'" style="height: calc(100% - 56px)" :class="['mt16', 'demand-target-container']">
                    <m-scrollbar box-class="data-control-scrollbar">
                        <DemandTargetTab :with-padding="false" :is-from-space="false" />
                    </m-scrollbar>
                </div>
            </div>
            <!-- 异常事件 -->
            <div v-show="curTab === '2'" class="abnormal-list-warp">
                <AbnormalList
                    class="abnormal-list-inner"
                    :abnormal-event-list="abnormalEventList"
                    :abnormal-event-list-loading="abnormalEventListLoading"
                    :abnormal-event-list-update-time="abnormalEventListUpdateTime ?? ''"
                    :empty="false"
                    @total-amount-change="handleTotalAmountChange"
                />
            </div>

            <!-- <div class="content">
                <AbnormalEventsList
                    :abnormal-event-list="abnormalEventList"
                    :abnormal-event-list-loading="abnormalEventListLoading"
                    :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                />
            </div> -->
        </div>
    </div>
    <EquipmentList v-if="showEquipmentList" :running-monitor-type="'VENTILATION'" :equipment-data="equipmentData" @close="close" />
</template>

<script setup>
import i18n from '@/localization';
import { h } from 'vue';
import { MBadge } from 'meri-plus';
import { useBreakpoints } from '@vueuse/core';
// import AbnormalEventsList from './abnormal-events-list/index.vue';
import { getAbnormalDataList } from '@/apis/ventilationPerception';
import useAbnormalData from '@/views/Common/AbnormalList/useAbnormalData';
import { isEdge, isMeosFrame } from '@/utils/envUtils';
import EquipmentList from '@/views/Common/EquipmentList/index.vue';
import AbnormalList from '@/views/Common/AbnormalList/index.vue';
import dataAnalysis from '../components/dataAnalysis/index.vue';
import DemandTargetTab from '../components/DemandTargetTab.vue';

const templateType = inject('templateType');
const computedInstanceId = inject('computedInstanceId');
const computedInstanceType = inject('computedInstanceType');
const curTab = ref('1');
const showEquipmentList = ref(false);
const equipmentData = ref('');
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

const subTabItems = ref([
    {
        id: 'dataStatistics',
        name: `${i18n.global.t('meos_control_web.data_statistics')}`
    },

    {
        id: 'demandTarget',
        name: `${i18n.global.t('meos_control_web.requirement_target')}`
    }
]);
const curSubTab = ref('dataStatistics');

const breakpoints = useBreakpoints({
    laptop: 0,
    desktop: 1366
});

const activeBreakpoint = breakpoints.active();
const isLapTop = computed(() => activeBreakpoint.value === 'laptop');
const parentTabSize = computed(() => {
    if (isLapTop.value) {
        return 'medium';
    } else {
        return 'large';
    }
});

const handleTotalAmountChange = val => {
    abnormalAmount.value = val;
};
const equipmentBtn = () => {
    showEquipmentList.value = true;
    equipmentData.value = i18n.global.t('meos_control_web.ventilation_list');
};
provide('equipmentData', equipmentData);
const close = () => {
    showEquipmentList.value = false;
};
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
const queryAbnormalEventListParams = computed(() => {
    if (!templateType?.value) {
        return;
    }
    if (computedInstanceType?.value === 'SPACE') {
        return;
    }
    const params = {
        ventilationType: templateType?.value,
        instanceId: computedInstanceId?.value,
        instanceType: computedInstanceType?.value
    };
    return params;
});

const { abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventList } = useAbnormalData(queryAbnormalEventListParams, getAbnormalDataList);
</script>

<style lang="less" scoped>
.right-side-bar-wrapper {
    position: relative;
    flex: 1;
    height: 100%;
}
.container {
    display: flex;
    padding: 12px 16px;
    padding-inline: 0px;
    flex-direction: column;
    height: 100%;

    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 8px 10px 0px rgba(27, 33, 41, 0.03);
}
.tab-one-container {
    height: calc(100% - 56px);
    position: relative;
    // overflow: hidden;
}
.content {
    width: 100%;
    height: 100%;
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
.control-aberrant-abnormal {
    padding-right: 0;
}
:deep(.abnormal-item) {
    margin-right: 0 !important;
}
.abnormal-list-warp {
    margin-top: 20px;
    padding-bottom: 0px;
    // padding-right: 0;
    height: calc(100% - 64px);
}
.abnormal-list-inner {
    padding-left: 16px;

    :deep(.m-scrollbar__content) {
        height: 100%;
        padding-right: 16px;
    }
}

.sub-tabs-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
    position: relative;
    padding-inline: 16px;

    .tab-box {
        transform: translateX(-12px) translateY(1px);
        height: 42px;
    }

    :deep(.m-tabs-name) {
        line-height: 20px;
    }
}

// .isNotEdge {
//     :deep(.m-tabs-list) {
//         &::before {
//             display: none;
//         }

//         .m-tabs-item {
//             cursor: default;
//         }
//     }
//     :deep(.m-tabs-name) {
//         color: @grey-900;
//         font-weight: var(--platform-font-weight);
//     }
// }

.bt-color {
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
    line-height: 42px;
}
:deep(.data-control-scrollbar) {
    .m-scrollbar__content {
        height: 100%;
    }
}
</style>
