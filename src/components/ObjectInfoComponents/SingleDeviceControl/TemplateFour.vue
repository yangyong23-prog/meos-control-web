<template>
    <div class="template-four-container">
        <ManualAotoSet v-if="manualAutoSet" :id="id" :data="manualAutoSet" :reason-options="reasonOptions" :system-id="systemId" class="mb16" />
        <ControlSet2
            :info-codes="controlledParameterSet"
            :object-id="id"
            :set-conditions="controlledParameterSetCondition"
            :forced-control-fn="forcedControlFn"
            :forced-model="forcedModel"
            :system-id="systemId"
            v-bind="$attrs"
        ></ControlSet2>
    </div>
</template>

<script setup>
import ControlSet2 from '@/components/ObjectInfoComponents/ControlSet2/index.vue';
import ManualAotoSet from '../ManualAotoSet/index.vue';
import { editForceControlStatus, getForceControlStatus } from '@/apis/common';
import i18n from '@/localization';
import { OTHER_REASON, SUCCESSCODE } from '@/utils/globalVariables';
import { MANUAL_AUTO_SET } from '../ManualAotoSet/config';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => ({})
    },
    forcedControlFn: {
        type: Function,
        default: editForceControlStatus
    },
    systemId: {
        type: String,
        default: ''
    },
    reasonOptions: {
        type: Array,
        default: () => [
            {
                id: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation'),
                name: i18n.global.t('meos_control_web.manual_emergency_operation_for_abnormal_operation')
            },
            { id: i18n.global.t('meos_control_web.device_maintenance_or_commissioning'), name: i18n.global.t('meos_control_web.device_maintenance_or_commissioning') },
            { id: i18n.global.t('meos_control_web.equipment_fault_isolation'), name: i18n.global.t('meos_control_web.equipment_fault_isolation') },
            { id: i18n.global.t('meos_control_web.heating_demand_change'), name: i18n.global.t('meos_control_web.heating_demand_change') },
            { id: i18n.global.t('meos_control_web.adjust_equipment_params'), name: i18n.global.t('meos_control_web.adjust_equipment_params') },
            { id: OTHER_REASON, name: i18n.global.t('meos_control_web.others') }
        ]
    }
});
const controlledParameterSet = computed(() => {
    return props.data?.relInfoCodeConfigs || [];
});
const controlledParameterSetCondition = computed(() => {
    return props.data?.groupChildren?.[0]?.relInfoCodeConfigs?.map(item => item.infoCode) || [];
});
const manualAutoSet = computed(() => {
    return (controlledParameterSet.value || []).find(i => i.infoCode === MANUAL_AUTO_SET);
});
const forcedModel = ref('uncheck');
const getForceControl = () => {
    getForceControlStatus({ objectId: props.id }).then(res => {
        if (res.code === SUCCESSCODE) {
            forcedModel.value = res.data.status === 'OPEN' ? 'checked' : 'uncheck';
        }
    });
};
useWatchWithCleanup(
    () => props.id,
    () => {
        getForceControl();
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.template-four-container {
    :deep(.control-set) {
        .control-set-box {
            border-radius: 8px;
            background-color: var(--gray-50);
        }
        .control-set-item {
            padding: 8px 12px;
            position: relative;
            display: flex;
            flex-direction: row;
            &::after {
                content: '';
                position: absolute;
                top: 0;
                width: calc(100% - 24px);
                left: 12px;
                border-bottom: 1px solid var(--gray-200);
            }
            &:first-child::after {
                display: none;
            }
            &[type='is-manual-auto-set'] {
                margin-bottom: 12px;
                border-radius: 8px;
                &::after {
                    display: none;
                }
            }
            .control-set-item-name {
                display: flex;
            }
        }
    }
}
</style>
