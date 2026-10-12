<template>
    <div class="air-cold-right">
        <div class="air-cold-right-main wh100" :style="{ height: hasNotifyList ? 'calc(100% - 70px)' : '100%' }">
            <div v-if="controlTabs.length > 1" style="padding: 16px 16px 0">
                <m-tabs v-model="controlData" :data="controlTabs" type="segment" size="large">
                    <template #abnormal>
                        <div class="fcc" style="display: flex; gap: 2px">
                            <span class="m-tabs-name">{{ i18n.global.t('meos_control_web.abnormal_event') }}</span>
                            <div v-if="abnormalCount && !abnormalEventListLoading" class="abnormal-total fcc fs12">{{ abnormalCount > 99 ? '99+' : abnormalCount }}</div>
                        </div>
                    </template>
                </m-tabs>
            </div>
            <div class="control-main" :class="{ 'no-console': controlTabs.length === 1 }">
                <ControlBoard
                    v-if="controlData === OPERATING_CONTROL"
                    :console-types-tabs="consoleTypesTabs"
                    :control-list-data="controlListData"
                    :show-control="showControl"
                    :weather-list="weatherList"
                    :system-params="systemParams"
                    :charts-data="chartsData"
                    :charts-data-by-space-scope="chartsDataBySpaceScope"
                    :all-chart-spaces-count="allChartSpacesCount"
                />
                <Abnormal v-else :is-sub-panel="controlTabs.length > 1" />
            </div>
        </div>
        <div v-if="hasNotifyList" class="notify-list">
            <CommonNotify :notify-list="notifyList" :page-broadcast-s-s-e-client="pageBroadcastSSEClient" />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import useRightHook from '../hooks/useRightHook';
import ControlBoard from './controlBoard/index.vue';
import Abnormal from './abnormal/index.vue';
import CommonNotify from '../components/commonNotify/index.vue';
import { OPERATING_CONTROL } from '../variables';
import { currentSystemKey, abnormalEventListKey, abnormalEventListLoadingKey } from '../hooks/useBaseHook';

const props = defineProps({
    notifyList: {
        type: Array,
        default: () => []
    },
    pageBroadcastSSEClient: {
        type: Object,
        default: () => null
    }
});
const currentSystem = inject(currentSystemKey);

const hasNotifyList = computed(() => {
    return props.notifyList.length > 0 && currentSystem.value?.monitoringSurveillanceStatus === '3';
});
const {
    controlTabs,
    controlData,
    showControl,
    consoleTypesTabs,
    controlListData,
    weatherList,
    systemParams,
    chartsData,
    chartsDataBySpaceScope,
    closeSetForm,
    allChartSpacesCount
} = useRightHook();
const abnormalEventList = inject(abnormalEventListKey);
const abnormalEventListLoading = inject(abnormalEventListLoadingKey);
const abnormalCount = computed(() => abnormalEventList?.value?.length ?? 0);
defineExpose({
    closeSetForm
});
</script>
<style lang="less" scoped>
.air-cold-right {
    background-color: transparent;
    padding: 16px;
    .air-cold-right-main {
        background-color: var(--gray-0);
        border-radius: 8px;
    }
    .notify-list {
        margin-top: 16px;
        background: #dfeeffcc;
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
        &.no-console {
            height: 100%;
            padding-top: 0;
        }
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
</style>
