<template>
    <div v-if="isEmpty && !loading" class="meos-flex-center h100">
        <Empty />
    </div>
    <m-scrollbar v-else class="container" bar-x-size="0px">
        <div class="container-content">
            <div class="fcb loop-switch">
                <m-dropdown
                    v-if="options.length > 1"
                    v-model="runningMonitorSecondType"
                    :options="options"
                    :text="`${i18n.global.t('meos_control_web.requirement_target')}-${label}`"
                    style="padding: 0"
                    trigger="click"
                >
                </m-dropdown>
                <div v-else class="fs16 fw700">
                    {{ `${i18n.global.t('meos_control_web.requirement_target')}-${label}` }}
                </div>
            </div>
            <div class="meos-group-title-1">{{ i18n.global.t('meos_control_web.operation_standard') }}</div>
            <operation-standard-view :data="todayOperationStandard" />
            <div class="meos-group-title-1">{{ i18n.global.t('meos_control_web.operation_overview') }}</div>
            <operation-overview-view />
        </div>
    </m-scrollbar>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import Empty from '@/components/common/Empty.vue';
import i18n from '@/localization';
import OperationStandardView from './operationStandardView.vue';
import OperationOverviewView from './OperationOverview/index.vue';
import useEquipmentTarget from '@/views/IndoorLighting/hooks/useEquipmentTarget';
import { PARKING, PUBLIC, RUNNING_MONITOR_TYPE } from '../../variables';

const props = defineProps({
    instanceObj: {
        type: Object,
        default: () => ({})
    },
    serviceAreaType: {
        type: String,
        default: ''
    },
    hasPublicLoop: {
        type: Boolean,
        default: false
    },
    hasParkingLoop: {
        type: Boolean,
        default: false
    }
});

const { loading, todayOperationStandard, runningMonitorSecondType, targetParams } = useEquipmentTarget('container');

const options = ref([]);

const label = computed(() => {
    return options.value.find(item => item.key === runningMonitorSecondType.value)?.label ?? '';
});

watch(
    () => props.instanceObj,
    newVal => {
        targetParams.value = newVal;
    },
    { immediate: true }
);

watch(
    [() => props.hasPublicLoop, () => props.hasParkingLoop],
    ([newHasPublicLoop, newHasParkingLoop]) => {
        console.log('hasPublicLoop', newHasPublicLoop, 'hasParkingLoop', newHasParkingLoop);
        options.value = [];
        if (newHasPublicLoop && props.instanceObj?.sceneData !== PARKING.id) {
            options.value.push({
                label: PUBLIC.name,
                key: PUBLIC.code,
                id: PUBLIC.id
            });
        }
        if (newHasParkingLoop && props.instanceObj?.sceneData !== PUBLIC.id) {
            options.value.push({
                label: PARKING.name,
                key: PARKING.code,
                id: PARKING.id
            });
        }
        // 如果有选项，默认选中第一个
        if (options.value.length > 0) {
            runningMonitorSecondType.value = options.value[0].key;
        }
    },
    { immediate: true }
);

const isEmpty = computed(() => !props.hasParkingLoop && !props.hasPublicLoop);
</script>

<style lang="less" scoped>
.container {
    height: calc(100% - 40px);
    margin-left: -16px;

    .container-content {
        padding-right: 16px;
        padding-left: 16px;
    }

    .loop-switch {
        :deep(.m-dropdown) {
            font-weight: 700;
            font-size: 16px;
            &.dropdown-text.open,
            &.dropdown-text:hover {
                background-color: transparent;
            }
        }
        padding-top: 12px;
    }
}
</style>
