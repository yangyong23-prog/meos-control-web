<template>
    <div v-if="isLoading || abnormalEventListLoading">
        <div class="loading-header">{{ i18n.global.t('meos_control_web.abnormal_event_list') }}</div>
        <m-list-skeleton class="skeleton" />
    </div>
    <div v-else-if="renderList?.length || equipmentsWithStatus?.length" class="right-container">
        <div class="header-container">
            <AbnormalHeader
                v-model="selectedSort"
                :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                :hide-filter="abnormalEventListLoadedTime && !renderList?.length"
                :total-amount="isEmpty(renderList?.length)"
            ></AbnormalHeader>
        </div>
        <m-scrollbar ref="scrollbarRef" box-class="machine-aside-scrollbar" :style="{ height: 'calc(100% - 44px)' }" @scroll="handleScroll">
            <div class="exception-list">
                <FoldWrap v-model="proxyAbnormalEventList" :data="abnormalEventList" :btn-enable-num="5" :filter-ids="filterIds" @toggle="handleToggle">
                    <AbnormalList
                        v-model="selectedSort"
                        class="abnormal-list-warp"
                        :hide-header="true"
                        :with-scroll="false"
                        :abnormal-event-list="proxyAbnormalEventList"
                        :abnormal-event-list-loading="abnormalEventListLoading"
                        :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                        :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                        :filter-ids="filterIds"
                    >
                        <template #empty>
                            <div class="empty-wrap">
                                <SvgIcon name="good" />
                                <span>{{ i18n.global.t('meos_control_web.no_abnormal_event1') }}</span>
                            </div>
                        </template>
                    </AbnormalList>
                </FoldWrap>
                <UnknownStatus />
            </div>
        </m-scrollbar>
    </div>
    <div v-else-if="renderList?.length === 0 && equipmentsWithStatus?.length === 0 && !isLoading" class="aside-center">
        <GoodStatusSvg></GoodStatusSvg>
        <p class="good-status-text">{{ i18n.global.t('meos_control_web.no_abnormal_event_or_unknown_risk') }}</p>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { isEmpty } from '@/utils/tools';
import SvgIcon from '@/components/common/SvgIcon.vue';
import FoldWrap from '@/components/common/FoldWrap.vue';
import UnknownStatus from './UnknownStatus.vue';
import GoodStatusSvg from '@/assets/images/operateMonitoring/goodStatus.svg';
import UseAsideData from '../hooks/useAsideData';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import AbnormalHeader from '@/views/Common/AbnormalListPlus/header.vue';
import { SORT_OPTION_ENUM } from '@/views/Common/AbnormalListPlus/config';

defineProps({
    isLoading: {
        type: Boolean,
        default: true
    }
});
const {
    abnormalEventList,
    abnormalEventListUpdateTime,
    abnormalEventListLoadedTime,
    abnormalEventListLoading,
    proxyAbnormalEventList,
    equipmentsWithStatus,
    filterIds,
    renderList,
    handleScroll
} = UseAsideData();

const selectedSort = ref(SORT_OPTION_ENUM.BY_LEVEL);
const scrollbarRef = ref();
const handleToggle = open => {
    if (!open) {
        nextTick(() => {
            scrollbarRef?.value?.setScrollTop?.(0);
        });
    }
};
</script>
<style lang="less" scoped>
.right-container {
    height: 100%;
}
.header-container {
    padding-bottom: 12px;
}
:deep(.machine-aside-scrollbar) {
    .option-btn-wrap {
        padding-right: 16px;
    }
}
.loading-header {
    color: var(--gray-800, #2e3742);
    font-size: 16px;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 24px;
}
.skeleton {
    margin-right: 16px;
}
.exception-list {
    /deep/.equipment-good {
        margin-right: 32px;
    }
    /deep/ .abnormal-wrap {
        margin-top: 0;
    }
}
.aside-center {
    height: 100%;
    display: flex;
    align-items: center;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    .good-status-text {
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        text-align: center;
        margin-top: 14px;
    }
}
.empty-wrap {
    width: calc(100% - 16px);
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
