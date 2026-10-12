<template>
    <div class="right-container wh100">
        <div class="right-content wh100">
            <div v-if="(controlTabs?.length ?? 0) > 1" class="control-tabs">
                <m-tabs v-model="controlData" :data="controlTabs" type="segment" size="large">
                    <template #abnormal>
                        <div class="fcc" style="display: flex; gap: 2px">
                            <span class="m-tabs-name">{{ i18n.global.t('meos_control_web.abnormal_event') }}</span>
                            <div v-if="abnormalCount && !abnormalEventListLoading" class="abnormal-total fcc fs12">{{ abnormalCount > 99 ? '99+' : abnormalCount }}</div>
                        </div>
                    </template>
                </m-tabs>
            </div>
            <div class="control-main">
                <Control v-if="controlData === CONTROL_TABS.OPERATING_CONTROL" />
                <Abnormal v-else :is-sub-panel="(controlTabs?.length ?? 0) > 1" />
            </div>
        </div>
        <div v-if="hasNotifyList" class="notify-list">
            <CommonNotify :notify-list="notifyList" :page-broadcast-s-s-e-client="pageBroadcastSSEClient" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Abnormal from './abnormal/index.vue';
import Control from './control/index.vue';
import { CONTROL_TABS } from '@/views/System/constant/variables';
import useRightHook from '../hooks/useRightHook';
import { abnormalEventListKey, abnormalEventListLoadingKey } from '@/views/System/hooks/useAbnormalHook';

import { hasNotifyListKey, pageBroadcastSSEClientKey, notifyListKey } from '../hooks/useStateHook';
import CommonNotify from '../components/commonNotify/index.vue';

const hasNotifyList = inject(hasNotifyListKey);
const pageBroadcastSSEClient = inject(pageBroadcastSSEClientKey);
const notifyList = inject(notifyListKey);
const { controlTabs, controlData } = useRightHook();
const abnormalEventList = inject(abnormalEventListKey);
const abnormalCount = computed(() => abnormalEventList?.value?.length ?? 0);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey);
</script>
<style lang="less" scoped>
.right-container {
    background-color: transparent;
    padding: 16px;
    .right-content {
        background-color: var(--gray-0);
        border-radius: 8px;
    }
    :deep(.m-tabs.m-tabs-segment) {
        width: 100%;
        .m-tabs-item {
            flex: 1;
        }
    }
    .control-main {
        height: calc(100% - 58px);
        padding-top: 6px;
    }
}
.control-tabs {
    padding: 16px 16px 0;
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
</style>
