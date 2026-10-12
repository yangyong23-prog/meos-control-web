<template>
    <div class="wh100 toilet-right">
        <m-tabs v-model="controlData" :data="controlTabs" type="segment" size="large">
            <template #abnormal>
                <div class="fcc" style="display: flex; gap: 2px">
                    <span class="m-tabs-name">{{ variable.ABNORMAL_EVENT.name }}</span>
                    <div v-if="total" class="abnormal-total fcc fs12">{{ total > 99 ? '99+' : total }}</div>
                </div>
            </template>
        </m-tabs>
        <div class="console-content">
            <OperatingControl v-show="controlData === variable.OPERATING_CONTROL.id" />
            <AbnormalList
                v-show="controlData === variable.ABNORMAL_EVENT.id"
                :abnormal-event-list="abnormalEventListComputed"
                :abnormal-event-list-loading="abnormalEventListLoading"
                :abnormal-event-list-update-time="abnormalEventListUpdateTime"
                :abnormal-event-list-loaded-time="abnormalEventListLoadedTime"
                @total-amount-change="totalAmountChange"
            />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import AbnormalList from '@/views/Common/AbnormalListPlus/index.vue';
import DockSingleton from '@/hooks/responsiveDock';
import OperatingControl from './OperatingControl.vue';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import { abnormalEventListLoadingKey, abnormalEventListUpdateTimeKey, abnormalEventListLoadedTimeKey, curAbnormalIdsKey } from '../hooks/useBaseHook';
import { uniqBy } from 'lodash';
const abnormalEventListLoading = inject(abnormalEventListLoadingKey, false);
const abnormalEventListUpdateTime = inject(abnormalEventListUpdateTimeKey, 0);
const abnormalEventListLoadedTime = inject(abnormalEventListLoadedTimeKey);
const curAbnormalIds = inject(curAbnormalIdsKey);
// const emits = defineEmits(['total-amount-change']);
const total = ref(0);
const totalAmountChange = num => {
    total.value = num;
};
const { getAbnormalEventsList } = DockSingleton.getInstance();

const abnormalEventListComputed = computed(() => {
    // 获取当前视角设备ID
    const list = getAbnormalEventsList(curAbnormalIds.value);
    return uniqBy(list, 'exceptionEventId');
});

// ----
const variable = window[GET_MENU_CONFIG]();
const controlData = ref(variable.OPERATING_CONTROL.id);
const controlTabs = ref([
    variable.OPERATING_CONTROL,
    {
        ...variable.ABNORMAL_EVENT,
        slotName: 'abnormal'
    }
]);
</script>
<style lang="less" scoped>
.toilet-right {
    width: 100%;
    height: 100%;
    padding: 16px;
    padding-right: 0;
    background-color: #fff;
    border-radius: 8px;
    :deep(.m-tabs.m-tabs-segment) {
        width: calc(100% - 16px);
        .m-tabs-item {
            flex: 1;
            &.m-tabs-item--active {
                .m-badge {
                    span {
                        font-weight: 700;
                    }
                }
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
    .console-content {
        height: calc(100% - 42px);
        padding-top: 16px;
    }
}
</style>
