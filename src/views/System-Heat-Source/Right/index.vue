<template>
    <div class="right-container wh100">
        <div class="right-content" :style="{ height: notifyList.length ? 'calc(100% - 70px)' : 'calc(100%)' }">
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
                <ControlBoard
                    v-if="controlData === CONTROL_TABS.OPERATING_CONTROL"
                    :console-types-tabs="consoleTypesTabs"
                    :control-list-data="controlListData"
                    :show-control="showControl"
                    :show-console-and-notify="showConsoleAndNotify"
                    :charts-data="chartsData"
                    :charts-data-by-space-scope="chartsDataBySpaceScope"
                    :all-chart-spaces-count="allChartSpacesCount"
                />
                <Abnormal v-else :is-sub-panel="(controlTabs?.length ?? 0) > 1" />
            </div>
        </div>
        <div v-if="notifyList?.length" class="notify-list">
            <CommonNotify :notify-list="notifyList" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Abnormal from './AbnormalWrapper.vue';
import ControlBoard from './ControlBoard/index.vue';
import { CONTROL_TABS } from '../constant/variable';

import { useRightHook } from '../hooks/useRightHook';
import { abnormalEventListKey, abnormalEventListLoadingKey } from '../hooks/useAbnormalHook';
import CommonNotify from '@/components/commonNotify/index.vue';

import UseNotify from '@/components/commonNotify/hooks/useNotify';
import { systemIdKey } from '../hooks/useBaseHook';
const props = defineProps({
    setSseConsoleClient: {
        type: Function,
        default: null
    }
});
const systemId = inject(systemIdKey);
const { notifyList, getNotifyList } = UseNotify(systemId);
const { controlTabs, controlData, showControl, controlListData, consoleTypesTabs, showConsoleAndNotify, chartsData, chartsDataBySpaceScope, allChartSpacesCount } =
    useRightHook(props);
const abnormalEventList = inject(abnormalEventListKey);
const abnormalCount = computed(() => abnormalEventList?.value?.length ?? 0);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey);
watch(
    () => systemId.value,
    () => {
        getNotifyList();
    }
);
onMounted(() => {
    getNotifyList();
});
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
    }
}
.control-tabs {
    padding: 16px 16px 0;
}
.notify-list {
    border-radius: 8px;
    margin-top: 16px;
    background: #dfeeffcc;
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
