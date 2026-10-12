<template>
    <div class="vent-upgraded-console">
        <template v-if="headerModelView === 'list'">
            <Abnormal @total-amount-change="totalAmountChange" />
        </template>
        <template v-else>
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
                <Abnormal v-show="controlData === variable.ABNORMAL_EVENT.id" @total-amount-change="totalAmountChange" />
            </div>
        </template>
    </div>
</template>

<script setup>
import OperatingControl from './OperatingControl.vue';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import Abnormal from './abnormal/index.vue';
import { headerModelViewKey } from '@/views/VentPerceptionUpgraded/hooks/useBaseHook';

const headerModelView = inject(headerModelViewKey);
const total = ref(0);
const variable = window[GET_MENU_CONFIG]();
console.log('variable: ', variable);
const controlData = ref(variable.OPERATING_CONTROL.id);
const controlTabs = ref([
    variable.OPERATING_CONTROL,
    {
        ...variable.ABNORMAL_EVENT,
        slotName: 'abnormal'
    }
]);
const totalAmountChange = num => {
    // Emit the total amount change event
    total.value = num;
};
</script>
<style lang="less" scoped>
.vent-upgraded-console {
    width: 100%;
    height: 100%;
    background-color: var(--gray-0);
    border-radius: 8px;
    padding: 12px 0 0 16px;

    box-shadow: 0px 8px 10px 0px #1b212908;
    &.hasNotify {
        height: calc(100% - 60px);
    }
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
        padding-top: 14px;
    }
}
</style>
