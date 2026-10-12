<template>
    <div v-if="equipments.length" class="template-five-container" :class="{ 'can-click': canClick }">
        <div class="header-section" :style="{ marginBottom: (needManualAotoSet && manualAutoSet) || controlledParameterSet.length ? '16px' : '0px' }">
            <div class="desc-row" @click="emits('clickName', equipmentData)">{{ serialUnitContainsText }}</div>
        </div>
        <ManualAotoSet
            v-if="needManualAotoSet && manualAutoSet"
            :id="objectId"
            :data="manualAutoSet"
            :reason-options="reasonOptions"
            :system-id="systemId"
            :select-obj="selectObj"
            class="mb16 manual-auto-comp"
        />
        <ControlSet2
            v-if="controlledParameterSet.length"
            :info-codes="controlledParameterSet"
            :object-id="objectId"
            :set-conditions="controlledParameterSetCondition"
            :system-id="systemId"
            :select-obj="selectObj"
            :filter-info-codes="filterInfoCodes"
            :enable-ctrl-actual-info-code="enableCtrlActualInfoCode"
            :alawys-show-set-buttons="alawysShowSetButtons"
        ></ControlSet2>
    </div>
</template>

<script setup>
import ControlSet2 from '@/components/ObjectInfoComponents/ControlSet2/index.vue';
import ManualAotoSet from '../ManualAotoSet/index.vue';
import { editForceControlStatus } from '@/apis/common';
import i18n from '@/localization';
import { GROUP_CODE_KEY_MAP, INFO_CODE, OTHER_REASON } from '@/utils/globalVariables';
import { MANUAL_AUTO_SET } from '../ManualAotoSet/config';
const props = defineProps({
    id: {
        type: String,
        default: ''
    },
    selectObj: {
        type: Object,
        default: () => ({})
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
    },
    groupCode: {
        type: String,
        default: GROUP_CODE_KEY_MAP.controlledParameterSet
    },
    showHeaderSection: {
        type: Boolean,
        default: true
    },
    serialUnitContainsTextFn: Function,
    canClick: {
        type: Boolean,
        default: false
    },
    filterInfoCodes: {
        type: Array,
        default: () => [INFO_CODE.manualAutoSet.infoCode]
    },
    enableCtrlActualInfoCode: {
        type: String,
        default: INFO_CODE.enableCtrl.infoCode
    },
    alawysShowSetButtons: {
        type: Boolean,
        default: false
    },
    needManualAotoSet: {
        type: Boolean,
        default: true
    }
});
const emits = defineEmits(['clickName']);
const objectId = computed(() => equipmentData.value.id || props.id);
const configData = computed(() => {
    return props.data?.relInfoCodeConfigs?.[0]?.dataValue?.[0]?.relInfoCodeGroupConfigs?.find(item => item.groupCode === props.groupCode) || {};
});
const equipments = computed(() => {
    return props.data?.relInfoCodeConfigs?.[0]?.dataValue || [];
});
const relObjects = computed(() => {
    return equipments.value?.[0]?.relObjects || [];
});
const relatedObjectNames = computed(() => {
    const separator = i18n.global.locale === 'en' ? ', ' : '、';
    return relObjects.value.map(item => item.localName).join(separator);
});
const serialUnitContainsText = computed(() => {
    if (props.serialUnitContainsTextFn) {
        return props.serialUnitContainsTextFn(equipments.value);
    }
    return i18n.global.t('meos_control_web.serial_unit_contains', {
        names: relatedObjectNames.value
    });
});
const equipmentData = computed(() => {
    return equipments.value?.[0] || {};
});
const controlledParameterSet = computed(() => {
    return configData.value?.relInfoCodeConfigs || [];
});
const controlledParameterSetCondition = computed(() => {
    return configData.value?.groupChildren?.[0]?.relInfoCodeConfigs?.map(item => item.infoCode) || [];
});
const manualAutoSet = computed(() => {
    return (controlledParameterSet.value || []).find(i => i.infoCode === MANUAL_AUTO_SET);
});
</script>
<style lang="less" scoped>
.template-five-container {
    &.can-click {
        &:hover {
            .desc-row {
                color: var(--blue-500);
                cursor: pointer;
            }
        }
    }
    .header-section {
        display: flex;
        flex-direction: column;
        gap: 4px;
        align-items: flex-start;
        margin-bottom: 16px;
        margin-top: -8px;

        .title-row {
            display: flex;
            align-items: center;
            gap: 9px;

            .blue-bar {
                width: 3px;
                height: 14px;
                background: #246fe5;
                flex-shrink: 0;
            }
            .title-text {
                color: #2e3742;
                font-family: 'Microsoft YaHei UI';
                font-size: 16px;
                font-style: normal;
                font-weight: 700;
                line-height: normal;
            }
        }

        .desc-row {
            padding-left: 12px;
            color: #626c78;
            font-family: 'Microsoft YaHei UI';
            font-size: 12px;
            font-style: normal;
            font-weight: 400;
            line-height: 20px;
        }
    }
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
