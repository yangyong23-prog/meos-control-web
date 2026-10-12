<template>
    <div :class="[isFloorView ? 'floor-view' : '']" style="height: 100%; flex: 1">
        <div :style="notifyList?.length ? 'height: calc(100% - 70px);' : 'height: 100%;'">
            <div v-if="isFloorView" class="right-container">
                <div class="tabs-wrapper">
                    <m-tabs v-model="curTab" :data="tabItems" size="large" type="segment"> </m-tabs>
                </div>
                <div v-show="curTab === '1'" class="run-control-wrap">
                    <div class="entry-btn">
                        <span class="entry-title">{{ i18n.global.t('meos_control_web.data_statistics') }}</span>
                        <m-button size="small" @click="openEquipmentList">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
                    </div>
                    <StatisticTab :card-statistics="cardStatistics" />
                </div>
                <div v-show="curTab === '2'" class="abnormal-all-wrap">
                    <AbnormalList
                        class="abnormal-list-warp"
                        :abnormal-event-list="abnormalEventList"
                        :abnormal-event-list-loading="abnormalEventListLoading"
                        :abnormal-event-list-update-time="abnormalEventListUpdateTime ?? ''"
                        :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                        :show-type="'subPanel'"
                        @total-amount-change="handleTotalAmountChange"
                    />
                </div>
            </div>
            <div v-else class="container">
                <AbnormalList
                    class="abnormal-list-warp"
                    :abnormal-event-list="abnormalEventList"
                    :abnormal-event-list-loading="abnormalEventListLoading || loading"
                    :abnormal-event-list-update-time="abnormalEventListUpdateTime ?? ''"
                    :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                    @total-amount-change="handleTotalAmountChange"
                />
            </div>
        </div>

        <CommonNotify v-if="notifyList?.length" :notify-list="notifyList" style="background-color: rgb(223 238 255 / 80%); border-radius: 8px; margin-top: 16px" />
    </div>
</template>

<script lang="js" setup>
import i18n from '@/localization';
import { h } from 'vue';
import { floorViewInjectKey  } from '../constant/injectKey'
import StatisticTab from "./StatisticTab.vue";
import { MBadge } from 'meri-plus';
import { isMeosFrame } from '@/utils/envUtils';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import CommonNotify from '@/components/commonNotify/index.vue';
import UseNotify from '@/components/commonNotify/hooks/useNotify';
defineProps({
    cardStatistics: {
        type: Array,
        default: () => []
    }
})
const { notifyList, getNotifyList } = UseNotify();
const isFloorView = inject(floorViewInjectKey)
const abnormalEventListLoading = inject('abnormalEventListLoading');
const abnormalEventListUpdateTime = inject('abnormalEventListUpdateTime');
const abnormalEventListLoadedTime = inject('abnormalEventListLoadedTime');
const abnormalEventList = inject('abnormalEventList');
const loading = inject('loading')
const showEquipmentList = inject('showEquipmentListKey')
const abnormalAmount = ref(0);
const handleTotalAmountChange = val => {
    abnormalAmount.value = val;
};

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
const curTab = ref('1');

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

// 打开
const openEquipmentList = () => {
    showEquipmentList.value = true;
};
onMounted(() => {
		getNotifyList();
})
</script>
<style lang="less" scoped>
.floor-view {
    border-radius: 8px;
}

.run-control-wrap {
    display: flex;
    flex-direction: column;
    height: calc(100% - 44px);
}

.abnormal-all-wrap {
    height: 100%;
    padding-left: 16px;
    margin-top: 12px;
    overflow: hidden;
}

.right-container {
    display: flex;
    padding: 16px;
    padding-inline: 0px;
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

.container {
    display: flex;
    // padding-top: 12px;
    flex-direction: column;
    height: 100%;

    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 8px 10px 0px rgba(27, 33, 41, 0.03);

    .abnormal-list-warp {
        padding-top: 16px;
        padding-left: 16px;
        padding-bottom: 12px;
        height: 100%;
    }
    :deep(.m-loading-mask) {
        border-radius: 8px;
    }
}

.entry-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 42px;
    margin: 20px 12px 8px 12px;
    border-bottom: 1px solid @grey-200;

    .entry-title {
        color: @grey-900;
        text-align: center;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
    }
}
</style>
