<template>
    <m-scrollbar
        v-if="abnormalEventList.length || (hasDangerEvent && danegerEventList.length)"
        ref="scrollbarRef"
        box-class="control-console-box-equip-abnormallist-scrollbar"
        @scroll="onScroll"
    >
        <!-- <div class="title f16 fb7 mb12 mt20">{{ i18n.global.t('meos_control_web.abnormal_event') }}</div>
        <div class="exception-list">
            <FoldWrap v-model="proxyAbnormalEventList" :data="abnormalEventList" :btn-distance-y="'4'">
                <AbnormalList class="abnormal-list-warp" :abnormal-event-list="proxyAbnormalEventList" :single-exception="true" :empty="false" :title-show="false" />
            </FoldWrap>
        </div> -->
        <div class="equip-abnormal-wrap">
            <div class="header-container">
                <AbnormalHeader
                    v-model="selectedSort"
                    :abnormal-event-list-update-time="curDateString"
                    :is-tab-show="true"
                    :padding-right="0"
                    :hide-filter="!abnormalEventList?.length"
                ></AbnormalHeader>
            </div>
            <div class="exception-list">
                <FoldWrap v-model="proxyAbnormalEventList" :data="abnormalEventList" :btn-enable-num="5" @toggle="handleToggle">
                    <AbnormalList
                        v-model="selectedSort"
                        class="abnormal-list-warp"
                        :hide-header="true"
                        :with-scroll="false"
                        :abnormal-event-list="proxyAbnormalEventList"
                        :abnormal-event-list-loading="false"
                        :abnormal-event-list-update-time="curDateString"
                        :abnormal-event-list-loaded-time="curDateString"
                        :show-type="'tab'"
                        :padding-right="24"
                        :sticky-top="36"
                    >
                        <template #empty>
                            <div class="empty-wrap">
                                <SvgIcon name="good" />
                                <span>{{ i18n.global.t('meos_control_web.no_abnormal_event1') }}</span>
                            </div>
                        </template>
                    </AbnormalList>
                </FoldWrap>
            </div>
        </div>
        <div v-if="hasDangerEvent" class="title f16 fb7 mb12 mt20">{{ i18n.global.t('meos_control_web.status_unknown_risk') }}</div>
        <div v-if="hasDangerEvent && danegerEventList.length" class="unknown-risk-list">
            <div v-for="value in danegerEventList" :key="value.id" class="unknown-risk-list-item-wrap" @click="riskInfo(value)">
                <div class="unknown-risk-list-item">
                    <Interest v-if="value.followMark" class="interest" />
                    <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_risk_event')" theme="darkTransparent">
                        <div class="unknown-risk-list-item-title f14">{{ value.name }}</div>
                    </m-tips>
                    <div class="unknown-risk-list-item-desc f14 ft">{{ i18n.global.t('meos_control_web.update_time_colon') }}{{ value.updateTime }}</div>
                </div>
            </div>
        </div>
        <div v-else-if="hasDangerEvent" class="no-data2">
            <SuccessCircle class="no-data2-icon" />
            {{ i18n.global.t('meos_control_web.current') }}<span class="no-data2-text">{{ i18n.global.t('meos_control_web.no_unknown_status_risk') }}</span>
        </div>
    </m-scrollbar>
    <div v-else class="no-data">
        <div>
            <img class="no-data-img" src="@/assets/imgs/completescene.png" @click.stop="goBack" />
        </div>
        <I18nSlot html-tag="div" name-key="meos_control_web.current_relate_equip" class="operating-status">
            <template #status>
                <span>{{ i18n.global.t('meos_control_web.operation_status_good') }}</span>
            </template>
        </I18nSlot>
    </div>
</template>
<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import Interest from '@/assets/svg/interest.svg';
import FoldWrap from '@/components/common/FoldWrap.vue';
import SuccessCircle from '@/assets/images/common/success_circle.svg';
import { riskJumpFun } from '@/utils/envUtils';
import DockSingleton from '@/hooks/responsiveDock';
import { orderBy } from 'lodash';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import dataDockHandling from '@/hooks/dataDockHandling';
import { SPACE_STATUS } from '../variable';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import AbnormalHeader from '@/views/Common/AbnormalListPlus/header.vue';
import { SORT_OPTION_ENUM } from '@/views/Common/AbnormalListPlus/config';
import SvgIcon from '@/components/common/SvgIcon.vue';
import dayjs from 'dayjs';
import { DETAIL, getDayjsTz } from '@/utils/globalVariables';

const { getAbnormalEventsList, getObjectDanegerEventsList } = DockSingleton.getInstance();

const { writeDataToResponsiveDock } = dataDockHandling();
const commonDrawerRoot = inject(commonDrawerRootContextKey);

const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    tagsValue: {
        type: Object,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    sseClient: {
        type: Object,
        default: null
    }
});

const selectedSort = ref(SORT_OPTION_ENUM.BY_LEVEL);
const scrollbarRef = ref();
const handleToggle = open => {
    if (!open) {
        nextTick(() => {
            scrollbarRef?.value?.setScrollTop?.(0);
        });
    }
};

const curDateString = computed(() => {
    return getDayjsTz().format('YYYY-MM-DD HH:mm');
});

const hasDangerEvent = computed(() => {
    if (props.tagsValue && props.tagsValue.relInfoCodeConfigs && Array.isArray(props.tagsValue.relInfoCodeConfigs)) {
        return !!props.tagsValue.relInfoCodeConfigs.find(info => info?.infoCode === 'dangerEvent');
    }
    return false;
});

const riskInfo = value => {
    riskJumpFun(Object.assign(value, { localName: value.localName || value.name }));
};

let propsSseClient = props.sseClient || commonDrawerRoot?.demandSseClient;

const _abnormalEventList = ref([]);
const proxyAbnormalEventList = ref([]);
const equipmentId = computed(() => {
    return props.selectObj.id;
});
useEquipInfoSSEHandle(
    equipmentId,
    {
        RISK_EVENT_DETAIL: _abnormalEventList
    },
    true,
    DETAIL,
    propsSseClient
);

// 解决设备详情楼层地图打开 Uncaught (in promise) Maximum recursive updates exceeded in component <Scrollbar>.的问题
const danegerEventList = computed(() => {
    if (!props.selectObj || !props.selectObj.id) {
        return [];
    }
    const eventList = getObjectDanegerEventsList(props.selectObj.id) || [];
    const list = eventList.filter(val => val.status === SPACE_STATUS.UNKNOWN.id);
    return orderBy(list, ['followMark'], ['desc']);
});

const abnormalEventList = computed(() => {
    if (commonDrawerRoot?.props.isSubscriptOnDemand) {
        return getAbnormalEventsList([props?.selectObj?.id]);
        // if (riskEventType.value === 'RISK_EVENT_DETAIL_SPACE_WITH_EQUIPMENTS') {
        //     return getAbnormalEventsList(o => o.id === props?.selectObj?.id || o.inSpaceIds?.includes(props?.selectObj?.id));
        // } else {
        //     return getAbnormalEventsList(o => o.id === props?.selectObj?.id);
        // }
    } else {
        return _abnormalEventList.value;
    }
});

const onScroll = () => {};
</script>
<style lang="less" scoped>
:deep(.control-console-box-equip-abnormallist-scrollbar) {
    padding: 0 0px 0px 24px;
}
.title {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;

    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500);
        content: '';
    }
}
.unknown-risk-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding-right: 24px;
    flex-grow: 1;
    .unknown-risk-list-item-wrap {
        padding: 12px 18px;
        width: 100%;
        border-bottom: 1px solid #e1e5eb;
        position: relative;
        &:first-of-type {
            padding-top: 12px;
        }
        &:hover {
            border-bottom: 1px solid #fff;
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            cursor: pointer;
        }
    }

    .unknown-risk-list-item-wrap + .unknown-risk-list-item-wrap {
    }
    .unknown-risk-list-item {
        cursor: pointer;
        display: flex;
        flex-direction: column;

        align-items: flex-start;
        line-height: 18px;
        justify-content: flex-start;
        gap: 4px;
        .interest {
            position: absolute;
            width: 13px;
            left: 3px;
            height: 13px;
            margin-right: 2.5px;
            margin-top: 3px;
        }
    }
}
.settings {
    width: 100%;
    padding: 8px 0px;
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
}
.no-data2 {
    padding: 12px 20px;
    margin-right: 24px;
    background: var(--gray-50, #f7f9fa);
    color: #000;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    &-icon {
        width: 22px;
        margin-right: 9px;
    }
    &-text {
        color: #2bb462;
        font-weight: 700;
        margin-left: 2px;
    }
}
.no-data {
    padding: 12px 20px;
    margin-right: 24px;
    background: #fff;
    color: #000;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &-img {
        width: 238px;
        margin-right: 9px;
    }
    .operating-status {
        margin-top: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #000;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        span {
            color: #2bb462;
        }
    }
    &-text {
        color: #2bb462;
        font-weight: 700;
        margin-left: 2px;
    }
}
.exception-list {
    &-item {
        position: relative;
        padding: 12px 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
    }
    &-title {
        padding-left: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
    }
    &-title:before {
        position: absolute;
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #f55047;
        border: 1px solid #fff;
        left: 10px;
        top: 18px;
    }
}
.exception-list-item:hover {
    cursor: pointer;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}
.equipment-good {
    width: 100%;
    padding: 12px 20px;
    background-color: #f7f9fa;
}
.abnormal-list-warp {
    :deep(.abnormal-item) {
        margin-right: 0px !important;
    }
}
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.equip-abnormal-wrap {
    padding-top: 16px;
    display: flex;
    flex-direction: column;
}

.header-container {
    position: sticky;
    top: 0px;
    z-index: 1;
    width: calc(100% - 24px);
    background-color: white;
    padding-bottom: 8px;
}
.empty-wrap {
    width: calc(100% - 24px);
    padding: 12px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: #f7f9fa;

    color: #000;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
</style>
