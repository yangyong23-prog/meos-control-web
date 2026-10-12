<template>
    <m-scrollbar
        v-if="abnormalEventList.length || equipmentsWithStatus.length || danegerEventList.length"
        ref="scrollbarRef"
        box-class="control-console-box-abnormallist-scrollbar"
        @scroll="onScroll"
    >
        <div class="space-abnormal-wrap">
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
        <div class="unknown-status">
            <div class="title">
                <span>{{ i18n.global.t('meos_control_web.equipment_risk_in_machine_room') }}</span>
            </div>
            <div class="space-danger-event-title fw700 mb12">{{ i18n.global.t('meos_control_web.equipment_risk_in_machine_room') }}</div>
            <RiskTable v-if="riskCount > 0" :risk-list="equipmentsWithStatus" />
            <div v-else class="no-data">
                <SuccessCircle class="no-data-icon" />
                {{ i18n.global.t('meos_control_web.current') }}<span class="no-data-text">{{ i18n.global.t('meos_control_web.no_unknown_status_risk') }}</span>
            </div>
        </div>
        <div class="space-danger-event">
            <div class="space-danger-event-title fw700 mb12">{{ i18n.global.t('meos_control_web.machine_room_inherent_risk') }}</div>
            <m-tips v-for="item in danegerEventList" :key="item.id" :content="i18n.global.t('meos_control_web.open_new_tab_risk_hazard_tree')" theme="darkTransparent">
                <div class="space-danger-event-item" :class="{ followMark: hasFollowMark }" @click="riskInfo(item)">
                    <div class="space-danger-event-item-title fc" style="word-break: break-all">
                        <div v-if="item.followMark" style="width: 18px; height: 18px; align-self: start" class="fcc space-danger-event-item-follow-mark"><Interest /></div>
                        {{ item.instancesName || item.name }}
                    </div>
                    <div class="space-danger-event-item-time">
                        {{ i18n.global.t('meos_control_web.update_time_colon') }}{{ dayjs(item.exceptionStartTime || item.updateTime).format('YYYY.MM.DD HH:mm') }}
                    </div>
                </div>
            </m-tips>
        </div>
    </m-scrollbar>
    <div v-else class="no-data-vacant">
        <div>
            <img class="no-data-vacant-img" src="@/assets/imgs/completescene.png" @click.stop="goBack" />
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
import SuccessCircle from '@/assets/images/common/success_circle.svg';
import RiskTable from '../RiskTable/index.vue';
import FoldWrap from '@/components/common/FoldWrap.vue';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import AbnormalHeader from '@/views/Common/AbnormalListPlus/header.vue';
import { SORT_OPTION_ENUM } from '@/views/Common/AbnormalListPlus/config';
import SvgIcon from '@/components/common/SvgIcon.vue';
import useEquipInfoSSEHandle from '@/components/hooks/useEquipInfoSSEHandle';
import { SPACE_STATUS } from '../variable';
import { orderBy } from 'lodash';
import DockSingleton from '@/hooks/responsiveDock';
import { isPipe, isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import dayjs from 'dayjs';
import Interest from '@/assets/svg/interest.svg';
import { riskJumpFun } from '@/utils/envUtils';
import { DETAIL, getDayjsTz } from '@/utils/globalVariables';

const { getAbnormalEventsList, getObjectDanegerEventsList } = DockSingleton.getInstance();

const commonDrawerRoot = inject(commonDrawerRootContextKey);
const props = defineProps({
    runningMonitorType: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    sseClient: {
        type: Object,
        default: null
    },
    abnormalEventListUpdateTime: {
        type: String,
        default: ''
    },
    abnormalEventListLoadedTime: {
        type: String,
        default: ''
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

const equipmentsWithStatus = computed(() => {
    if (!props.selectObj || !props.selectObj.equipmentsInSpace || props.selectObj.equipmentsInSpace.length === 0) {
        return [];
    }
    const equipmentsInClassCode = new Map();

    props.selectObj.equipmentsInSpace
        .filter(equip => {
            return !isPipe(equip.classCode) && !isMachineRoomCF(equip.classCode);
        })
        .forEach(item => {
            item.danegerEventList = getObjectDanegerEventsList(item.id) || [];
            if (item.danegerEventList.length && item.danegerEventList.find(val => val.status === SPACE_STATUS.UNKNOWN.id)) {
                if (item.danegerEventList.find(val => val.followMark)) {
                    item.followMark = true;
                }
                if (equipmentsInClassCode.get(item.classCode)) {
                    const obj = equipmentsInClassCode.get(item.classCode);
                    if (item.followMark) {
                        obj.followMark = true;
                    }
                    obj.danegerEventListLength += item.danegerEventList.length;
                    obj.equipments.push(item);
                } else {
                    equipmentsInClassCode.set(item.classCode, {
                        classCode: item.classCode,
                        classCodeName: item.classCodeName,
                        followMark: item.followMark || false,
                        danegerEventListLength: item.danegerEventList.length,
                        equipments: [item]
                    });
                }
            }
        });
    const arr = Array.from(equipmentsInClassCode.values());
    return orderBy(arr, ['followMark', 'danegerEventListLength'], ['desc', 'desc']);
});
const riskCount = computed(() => {
    if (!equipmentsWithStatus.value || !Array.isArray(equipmentsWithStatus.value)) {
        return 0;
    }
    return equipmentsWithStatus.value.reduce((acc, item) => {
        if (item.danegerEventListLength != null && typeof item.danegerEventListLength === 'number') {
            return acc + item.danegerEventListLength;
        }
        return acc;
    }, 0);
});
const _abnormalEventList = ref([]);
const proxyAbnormalEventList = ref([]);

// const inspectionInformationObj = ref({});
const equipmentId = computed(() => {
    return props.selectObj.id;
});

let propsSseClient = props.sseClient || commonDrawerRoot?.demandSseClient;

useEquipInfoSSEHandle(
    equipmentId,
    {
        RISK_EVENT_DETAIL: _abnormalEventList
    },
    true,
    DETAIL,
    propsSseClient
);
const isScroll = ref(false);
provide('isScroll', isScroll);
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

const danegerEventList = computed(() => {
    return getObjectDanegerEventsList(props?.selectObj?.id) || [];
});
const hasFollowMark = computed(() => {
    return !!danegerEventList.value.find(danger => danger.followMark);
});
const onScroll = () => {
    isScroll.value = true;
};
const riskInfo = value => {
    riskJumpFun(Object.assign(value, { localName: value.localName || value.name }));
};
</script>
<style lang="less" scoped>
:deep(.control-console-box-abnormallist-scrollbar) {
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
.settings {
    width: 100%;
    padding: 8px 0px;
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
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
    &-icon {
        width: 22px;
        margin-right: 9px;
    }
}
.no-data-vacant {
    height: 100%;
    padding: 12px 20px;
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
.unknown-status {
    margin: 24px 24px 16px 0;
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        line-height: 22px;
        margin-bottom: 12px;
        position: -webkit-sticky;
        position: sticky;
        top: 0px;
        z-index: 1;
        background-color: white;
        .unit {
            color: var(--gray-600, #626c78);
            font-size: 12px;
            font-weight: var(--platform-font-weight);
        }
    }
    .no-data {
        padding: 12px 20px;
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
}

.space-abnormal-wrap {
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

.space-danger-event {
    padding-top: 4px;
    padding-right: 24px;
    &-title {
        background: linear-gradient(90deg, #f1f4f6 0%, rgba(241, 244, 246, 0) 100%);
        padding: 5px 12px;
        border-radius: 4px;
    }
    &-item {
        padding: 12px 0;
        border-radius: 4px;
        cursor: pointer;
        &.followMark {
            .space-danger-event-item-title {
                padding: 0 18px;
            }
            .space-danger-event-item-follow-mark {
                margin-left: -18px;
            }
            .space-danger-event-item-time {
                padding: 0 18px;
            }
        }
        &-title {
            padding: 0 8px;
            margin-bottom: 4px;
        }
        &-time {
            padding: 0 8px;
            color: var(--gray-600);
        }
        &:hover {
            background-color: var(--alpha-30);
        }
    }
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
