<template>
    <div class="tabs-box">
        <m-tabs v-model="curTab" size="large" :data="tabItems" type="segment">
            <template #abnormal>
                <div class="fcc" style="display: flex; gap: 2px">
                    <span class="m-tabs-name">{{ i18n.global.t('meos_control_web.abnormal_event') }}</span>
                    <div v-if="renderList?.length" class="abnormal-total fcc fs12">
                        {{ (renderList?.length ?? 0) > 99 ? '99+' : renderList?.length ?? 0 }}
                    </div>
                </div>
            </template>
        </m-tabs>
    </div>

    <AbnormalList
        v-if="curTab === 'abnormal'"
        class="abnormal-list-warp"
        :show-type="'subPanel'"
        :abnormal-event-list="renderList"
        :abnormal-event-list-loading="abnormalIdleLoading || abnormalEventListLoading"
        :abnormal-event-list-update-time="abnormalEventListUpdateTime"
        :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
    />
    <UnknownRiskList
        v-if="curTab === 'risk'"
        class="unknown-list-warp"
        :is-loading="isLoading || riskEventIdleLoading"
        :loading-danger-events="loadingDangerEvents"
        :risk-list="rightUnknownRiskEventList"
    />
</template>

<script setup>
import i18n from '@/localization';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import UnknownRiskList from '../components/UnknownRiskList.vue';
import useAsideData from '../hooks/useAsideData';
import { loadingDangerEventsKey, abnormalIdleLoadingKey, riskEventIdleLoadingKey } from '../hooks/useBaseDataHook';

defineProps({
    isLoading: {
        type: Boolean,
        default: true
    }
});

const abnormalIdleLoading = inject(abnormalIdleLoadingKey);
const riskEventIdleLoading = inject(riskEventIdleLoadingKey);

const tabItems = ref([
    {
        id: 'abnormal',
        name: i18n.global.t('meos_control_web.abnormal_event'),
        slotName: 'abnormal'
    },
    {
        id: 'risk',
        name: i18n.global.t('meos_control_web.status_unknown_risk')
    }
]);
const curTab = ref('abnormal');

const loadingDangerEvents = inject(loadingDangerEventsKey);

const { abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventListLoading, renderList, rightUnknownRiskEventList } = useAsideData();
</script>

<style lang="less" scoped>
.tabs-box {
    width: calc(100% - 16px);
    margin-right: 16px;
    overflow: hidden;
    :deep(.m-tabs.m-tabs-segment) {
        width: 100% !important;
        margin-right: 16px;
        .m-tabs-item {
            flex: 1;
        }
        .m-tabs-body {
            padding-right: 0 !important;

            .m-tabs-trigger {
                display: none !important;
            }
        }
    }
    :deep(.m-tabs-item) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
    }
}
.abnormal-total {
    border-radius: 9px;
    height: 18px;
    padding: 0 6px;
    width: fit-content;
    background-color: var(--red-500);
    color: var(--gray-0);
    font-family: Arial;
}
.abnormal-list-warp {
    height: calc(100% - 42px);
    padding-top: 11px;
    padding-bottom: 8px;
}
.unknown-list-warp {
    height: calc(100% - 42px);
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
</style>
