<template>
    <div class="operation-overview">
        <!--时间轴-->
        <time-card
            v-model:selected-time="selectedTime"
            :current-time="currentTime"
            :temporary-switch-circuit-task-time="temporarySwitchCircuitTaskTime"
            :operation-standard="operationStandard"
        ></time-card>

        <!--当前运行标准-->
        <div class="meos-group-title-2">{{ i18n.global.t('meos_control_web.current_operation_standard') }}</div>
        <template v-if="hasCurrentOperationStandard">
            <div class="current-operation-standard background-card">
                {{ currentOperationStandardlabel }}
            </div>
        </template>
        <template v-else>
            <div class="background-card no-data meos-flex-center">{{ i18n.global.t('meos_control_web.no_content') }}</div>
        </template>

        <!--指定时刻回路开关需求统计-->
        <div class="circuit-header">
            <div v-ellipsis class="meos-group-title-2 circuit-header-title meos-ellipsis-line">
                {{ i18n.global.t('meos_control_web.circuit_switch_demand_at_time', { time: selectedTimeLabel }) }}
            </div>
            <div class="meos-text-link" @click="viewFullScreenModal">{{ i18n.global.t('meos_control_web.view_loop_detail') }}</div>
        </div>
        <template v-if="selectedTimeSwitchCircuitStatistic.length > 0">
            <div v-for="item in selectedTimeSwitchCircuitStatistic" :key="item.funcTypeName" class="circuit-demand-item background-card">
                <div class="func-type-name">
                    {{ item.funcTypeName }}
                    <span class="total">({{ i18n.global.t('common.total_count') }}:{{ item.total.toLocaleString() }})</span>
                </div>
                <div class="meos-flex-center">
                    <div class="status-item meos-flex-ai-center">
                        <div v-ellipsis class="status-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.switch_on') }}</div>
                        <div v-ellipsis class="status-value meos-ellipsis-line">{{ item.open.toLocaleString() }}</div>
                    </div>
                    <div class="status-item meos-flex-ai-center">
                        <div v-ellipsis class="status-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.switch_off') }}</div>
                        <div v-ellipsis class="status-value meos-ellipsis-line">{{ item.close.toLocaleString() }}</div>
                    </div>
                    <div class="status-item meos-flex-ai-center" :style="{ visibility: item.feedback > 0 ? 'visible' : 'hidden' }">
                        <div v-ellipsis class="status-label meos-ellipsis-line">{{ i18n.global.t('meos_control_web.feedback_adjustment') }}</div>
                        <div v-ellipsis class="status-value meos-ellipsis-line">{{ item.feedback.toLocaleString() }}</div>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="background-card no-data meos-flex-center">{{ i18n.global.t('meos_control_web.no_content') }}</div>
        </template>

        <!--临时开关回路-->
        <div class="meos-group-title-2">{{ i18n.global.t('meos_control_web.temporary_switch_circuit') }}</div>
        <template v-if="temporarySwitchCircuit.length > 0">
            <TaskListView :list="temporarySwitchCircuit" />
        </template>
        <template v-else>
            <div class="background-card no-data meos-flex-center">{{ i18n.global.t('meos_control_web.no_content') }}</div>
        </template>
    </div>
    <LoopDetailFullScreen v-model:show="showFullScreen" v-model:current-time="detailSelectedTime" />
</template>

<script setup>
import i18n from '@/localization';
import { computed, ref, inject, watchEffect } from 'vue';
import TimeCard from './timeCard.vue';
import LoopDetailFullScreen from '../../loopDetailFullScreen/index.vue';
import TaskListView from './TaskListView.vue';
import dayjs from 'dayjs';
import {
    equipmentTargetSelectedTimeInjectKey,
    equipmentTargetCurrentTimeInjectKey,
    equipmentTargetSelectedTimeSwitchCircuitStatisticInjectKey,
    equipmentTargetTemporarySwitchCircuitInjectKey,
    equipmentTargetRunningMonitorSecondTypeInjectKey,
    equipmentTargetTemporarySwitchCircuitTaskTimeInjectKey,
    equipmentTargetOperationStandardInjectKey,
    equipmentTargetCurrentOperationStandardInjectKey
} from '@/views/IndoorLighting/hooks/useEquipmentTarget';

const selectedTime = inject(equipmentTargetSelectedTimeInjectKey);
const selectedTimeSwitchCircuitStatistic = inject(equipmentTargetSelectedTimeSwitchCircuitStatisticInjectKey);
const temporarySwitchCircuit = inject(equipmentTargetTemporarySwitchCircuitInjectKey);
const temporarySwitchCircuitTaskTime = inject(equipmentTargetTemporarySwitchCircuitTaskTimeInjectKey);
const runningMonitorSecondType = inject(equipmentTargetRunningMonitorSecondTypeInjectKey);
const currentTime = inject(equipmentTargetCurrentTimeInjectKey);
const operationStandard = inject(equipmentTargetOperationStandardInjectKey);
const currentOperationStandard = inject(equipmentTargetCurrentOperationStandardInjectKey);

const showFullScreen = ref(false);
const detailSelectedTime = ref('12:00');

watchEffect(() => {
    if (selectedTime.value) {
        const timeStr = dayjs(selectedTime.value).format('HH:mm');
        if (selectedTime.value >= currentTime.value && timeStr === '00:00') {
            detailSelectedTime.value = '23:59';
        } else {
            detailSelectedTime.value = timeStr;
        }
    }
});
const viewFullScreenModal = () => {
    showFullScreen.value = true;
};

const selectedTimeLabel = computed(() => {
    if (selectedTime.value) {
        const timeStr = dayjs(selectedTime.value).format('HH:mm');
        if (selectedTime.value >= currentTime.value && timeStr === '00:00') {
            return '24:00';
        }
        return timeStr;
    }
    return '--';
});

const hasCurrentOperationStandard = computed(() => {
    return Object.keys(currentOperationStandard.value).length > 0;
});

const currentOperationStandardlabel = computed(() => {
    let start = dayjs(currentOperationStandard.value.beginDateTime).format('HH:mm') || '--',
        end = dayjs(currentOperationStandard.value.endDateTime).format('HH:mm') || '--';
    if (end === '00:00') {
        end = '24:00';
    }
    return `${currentOperationStandard.value.name || '--'}: ${start}～${end}`;
});
</script>

<style lang="less" scoped>
.operation-overview {
    .background-card {
        border-radius: 4px;
        background-color: var(--gray-50);
        padding: 12px;
    }
    .current-operation-standard {
        gap: 10px;
    }

    .circuit-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .circuit-header-title {
            flex: 1;
            margin-right: 8px;
        }
    }

    .circuit-demand-item {
        padding: 8px 12px;
        .func-type-name {
            color: var(--gray-900);
            margin-bottom: 8px;

            .total {
                color: var(--gray-600);
            }
        }
        .status-label {
            color: var(--gray-600);
            margin-right: 4px;
            flex-shrink: 0;
            max-width: 50%;
        }
        .status-value {
            font-size: 16px;
            color: var(--gray-900);
            font-weight: 600;
        }

        .status-item {
            flex: 1 0 0;
            min-width: 0;
        }

        .status-item:not(:last-child) {
            margin-right: 8px;
        }
    }
    .circuit-demand-item:not(:last-child) {
        margin-bottom: 12px;
    }

    .no-data {
        color: var(--gray-600);
    }
}
</style>
