<template>
    <ControlItem v-for="item in controlList" :key="item.infoCode" :data="item" :show-artificial-or-auto="false">
        <SwitchControl
            v-if="item.dataSource?.length"
            :style-title="item.infoCode === ENABLE_CTRL ? 'max-width: calc(100% - 116px)' : 'max-width: 100%'"
            v-bind="componentAttrs(item)"
        >
            <template #header>
                <div v-if="item.infoCode === ENABLE_CTRL" class="fc">
                    <m-tips :content="enableTip[equipmentInfo.classCode] || i18n.global.t('meos_control_web.enable_interlock_pump_cooling_tower')" theme="darkTransparent">
                        <div class="fcc info-box" style="width: 16px; height: 16px">
                            <Info style="box-sizing: content-box" />
                        </div>
                    </m-tips>
                    <SetDiv v-if="getIotData(selectObjId, 'manualAutoSet').dataValue !== '1'">
                        <template #default="{ hasPermission, isEdge }">
                            <div class="forced-switch fcc" style="color: var(--gray-600)">
                                <span>{{ i18n.global.t('meos_control_web.forced_control') }}</span>
                                <m-switch
                                    v-model="forcedModel"
                                    :disabled="!hasPermission || !isEdge"
                                    :loading="loading"
                                    size="small"
                                    :before-change="() => beforeChange(item)"
                                ></m-switch>
                            </div>
                        </template>
                    </SetDiv>
                    <m-tips v-else theme="darkTransparent" :content="i18n.global.t('meos_control_web.manual_only_controllable')" placement="top">
                        <div class="forced-switch fcc" style="color: var(--gray-600)">
                            <span>{{ i18n.global.t('meos_control_web.forced_control') }}</span> <m-switch v-model="forcedModel" :disabled="true" size="small"></m-switch>
                        </div>
                    </m-tips>
                </div>
            </template>
        </SwitchControl>
        <InputControl v-else v-bind="componentAttrs(item)"> </InputControl>
        <template #time>
            <InterfereTime
                v-if="item.infoCode === MANUAL_AUTO_SET && getinfoCodeData(item)?.additionalMapValue?.recoveryDateTime && getinfoCodeData(item)?.dataValue === IS_MANUAL"
                :time="getinfoCodeData(item)?.additionalMapValue?.recoveryDateTime"
                :data="item"
                :text="i18n.global.t('meos_control_web.restore_auto_state')"
                style="padding-left: 0"
                :release-intervention-fun="releaseInterventionFun"
            />
        </template>
        <template #footer>
            <m-collapse v-if="item.infoCode === ENABLE_CTRL && item.relInfoCodeConfigs?.length" v-model="modelForced" :class="['no-collapse-header', forcedModel]">
                <m-collapse-item id="checked" title="黑铁">
                    <div class="forced-list">
                        <ControlItem v-for="val in item.relInfoCodeConfigs" :key="val.infoCode" :data="val" :show-artificial-or-auto="false">
                            <SwitchControl v-if="val.dataSource?.length" style-title="max-width: 100%" v-bind="componentAttrs(val)">
                                <template #name> <Rectangle style="margin-right: 6px"></Rectangle>{{ val.infoCodeName }} </template>
                                <template #header></template>
                            </SwitchControl>
                            <InputControl v-else v-bind="componentAttrs(val)"> </InputControl>
                        </ControlItem>
                    </div>
                </m-collapse-item>
            </m-collapse>
        </template>
    </ControlItem>
</template>

<script setup>
import i18n from '@/localization';
import ControlItem from '@/views/ACAC/components/control/ControlItem.vue';
import { ENABLE_CTRL, IS_AUTO, IS_MANUAL, MANUAL_AUTO_SET } from '@/views/ACAC/variables';
import SwitchControl from '../control/SwitchControl.vue';
import InputControl from '../control/InputControl.vue';
import Info from '@/assets/svg/info.svg';
import Rectangle from '@/assets/svg/ACAC/Rectangle.svg';
import InterfereTime from '../control/InterfereTime.vue';
import { commandExecuteChangeManualAutoStatus, commandExecuteReleaseIntervention, editForceControlStatus } from '@/apis/ACAC';
import { GROUP_CODE_KEY_MAP, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import DockSingleton from '@/hooks/responsiveDock';
import { activeSetFormDataKey, forcedModelKey, openSetFormKey } from '../../hooks/useEquipmentInfoHook';
import { isEdge } from '@/utils/envUtils';
import SetDiv from '@/components/common/SetDiv.vue';
const enableTip = {
    ACOTU: i18n.global.t('meos_control_web.enable_interlock_cooling_tower_valves_fan')
};
const props = defineProps({
    controlList: {
        type: Array,
        default: () => []
    },
    id: {
        type: String,
        default: ''
    },
    selectObjId: {
        type: String,
        default: ''
    },
    forced: {
        type: Boolean,
        default: false
    },
    equipmentInfo: {
        type: Object,
        default: () => {
            return {};
        }
    }
});
const loading = ref(false);
const { getIotData } = DockSingleton.getInstance();
const openSetForm = inject(openSetFormKey, () => {});
const forcedModel = inject(forcedModelKey, ref(''));
const activeSetFormData = inject(activeSetFormDataKey);
const modelForced = computed(() => [forcedModel.value]);
const isAuto = computed(() => {
    const data = getIotData(props.selectObjId, 'manualAutoSet');
    return data.dataValue === IS_AUTO;
});
const noManualAutoStatus = computed(() => {
    const data = getIotData(props.selectObjId, 'manualAutoSet');
    return !data?.dataValue;
});

// 无数据 不可操作
const noLocalRemoteStatus = computed(() => {
    const data = getIotData(props.id, 'localRemoteStatus');
    return !data?.dataValue && data.existsIotRule;
});

// 无数据  ||  未交付  不可操作
const noOnlineStatus = computed(() => {
    const data = getIotData(props.id, 'onlineStatus');
    return !data?.dataValue;
});
const isLocal = computed(() => {
    const data = getIotData(props.id, 'localRemoteStatus');
    return data.dataValue === '0';
});
const offline = computed(() => {
    const data = getIotData(props.id, 'onlineStatus');
    return data.dataValue === '0';
});
const disabledFun = item => {
    const conditions = [
        // 手自动信息点都可操作
        {
            condition: item.infoCode === MANUAL_AUTO_SET,
            result: { disabled: false, disabledText: '', setValueAlways: true }
        },
        // 强制控制信息点 =》 强制控制时不可操作
        {
            condition: forcedModel.value === 'checked' && item.infoCode === ENABLE_CTRL,
            result: { disabled: true, disabledText: i18n.global.t('meos_control_web.forced_control_active_action_denied_dup'), setValueAlways: true }
        },
        // 其它控制信息点 =》 强制控制未开启不可操作
        {
            condition: forcedModel.value === 'uncheck' && item.infoCode !== ENABLE_CTRL && props.forced,
            result: { disabled: true, disabledText: i18n.global.t('meos_control_web.forced_control_disabled'), setValueAlways: true }
        },
        // 手自动状态未知不可操作
        {
            condition: noManualAutoStatus.value,
            result: { disabled: true, disabledText: i18n.global.t('meos_control_web.manual_auto_unknown_cannot_operate'), setValueAlways: true }
        },
        // 自动状态不可操作
        {
            condition: isAuto.value,
            result: { disabled: true, disabledText: i18n.global.t('meos_control_web.not_operable_in_auto_mode'), setValueAlways: true }
        },
        // 本地，离线，本地无数据，离线无数据未交付不可操作
        {
            condition: isLocal.value || offline.value || noLocalRemoteStatus.value || noOnlineStatus.value,
            result: { disabled: true, disabledText: i18n.global.t('meos_control_web.equipment_offline_local_action_denied'), setValueAlways: true }
        }
    ];

    for (const { condition, result } of conditions) {
        if (condition) return result;
    }

    return { disabled: false, disabledText: '', setValueAlways: true };
};
const componentAttrs = item => {
    return { hasActual: true, activeSetFormData: activeSetFormData.value, onOpenSetForm: e => openSetForm(e, item), data: item, ...disabledFun(item) };
};
const getinfoCodeData = item => {
    const data = getIotData(props.id, item.infoCode);
    if (data) {
        return data;
    }
    return {};
};
const releaseInterventionFun = params => {
    if (params.infoCode === MANUAL_AUTO_SET) {
        commandExecuteChangeManualAutoStatus({
            objectIds: [params.objectId],
            infoCode: params.infoCode,
            infoValue: '1'
        }).then(res => {
            if (res.code === SUCCESSCODE) {
                // 处理成功
                useSuccessMessage();
            }
        });
        return;
    }
    commandExecuteReleaseIntervention({ objectIds: [params.objectId], infoCode: params.infoCode }).then(res => {
        if (res.code === SUCCESSCODE) {
            // 处理成功
            useSuccessMessage();
        }
    });
};
const beforeChange = async data => {
    let releaseForceControlInfoCodes = [];
    if (data.relInfoCodeConfigs?.length) {
        releaseForceControlInfoCodes.push({ objectId: data.id, infoCodes: data.relInfoCodeConfigs?.map(item => item.infoCode) || [] });
    }
    const fansAndWaters = [...props.equipmentInfo.fans, ...props.equipmentInfo.waters];
    fansAndWaters.forEach(item => {
        const controlledParameterSet = item?.relInfoCodeGroupConfigs?.find(item => item.groupCode === GROUP_CODE_KEY_MAP.controlledParameterSet);
        releaseForceControlInfoCodes.push({ objectId: item.id, infoCodes: controlledParameterSet?.relInfoCodeConfigs?.map(item => item.infoCode) || [] });
    });
    releaseForceControlInfoCodes = forcedModel.value === 'checked' ? releaseForceControlInfoCodes : undefined;
    try {
        loading.value = true;
        const res = await editForceControlStatus({ objectId: props.id, status: forcedModel.value === 'checked' ? 'CLOSE' : 'OPEN', releaseForceControlInfoCodes });
        if (res.code === SUCCESSCODE) {
            // 处理成功
            // useSuccessMessage();
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        loading.value = false;
    }
};
</script>
<style lang="less" scoped>
.forced-list {
    margin-top: 4px;
    background-color: rgba(225, 229, 235, 0.8);
    padding: 0 10px;

    .control-item {
        background-color: transparent;
        padding: 12px 0;

        & + .control-item {
            margin-top: 0;
            border-top: 1px solid var(--gray-300);
        }
    }

    :deep(.set-and-actual) {
        padding-left: 15px;
    }
}
.info-box {
    margin: 0 4px;
    border-radius: 2px;
    &:hover {
        background-color: var(--gray-200);
    }
}
.forced-switch {
    padding-left: 4px;
    height: 22px;
    font-size: 12px;
    border-radius: 4px;
    padding: 2px 4px;
    padding-right: 0;
    background-color: var(--gray-200);
    display: flex;
    gap: 2px;
}
.no-collapse-header {
    margin: 0 -8px;
    margin-bottom: 0;
    transition: all 0.5s;
    &.checked {
        margin-bottom: -12px;
    }
    :deep(.m-collapse-item__header) {
        display: none;
    }
}
</style>
