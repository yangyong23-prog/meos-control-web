<template>
    <m-drawer
        :append-to="$drawerAppendTo"
        :show="show"
        :title="i18n.global.t('meos_control_web.system_settings')"
        :shadow="false"
        :shadow-click="false"
        width="480px"
        :z-index="Z_INDEX.commonSystemSetDrawer"
        :drawer-class="`cold-system-drawer noIframe`"
        @close="close"
    >
        <template #content>
            <div class="cold-system-drawer-item">
                <m-scrollbar box-class="cold-system-scrollbar" :height="'100%'">
                    <div v-for="(items, indexs) in infoDatas" :key="indexs">
                        <div class="title-name mb12">{{ items.groupName }}</div>
                        <div class="content mb16">
                            <div
                                v-for="(item, index) in items.relInfoCodeConfigs"
                                :key="index"
                                class="content-item"
                                :class="getManualAutoConfigValue(item.manualAutoConfig).manualAutoSet === 1 ? 'single-row' : 'double-row'"
                            >
                                <m-tag v-if="getManualAutoConfigValue(item.manualAutoConfig).manualAutoSet === 0" color="#E68600" bg-color="#FFF0CC" size="small">{{
                                    i18n.global.t('meos_control_web.manual1')
                                }}</m-tag>
                                <m-tag v-if="getManualAutoConfigValue(item.manualAutoConfig).manualAutoSet === 1" color="#683BD6" bg-color="#F1E5FE" size="small">
                                    {{ i18n.global.t('meos_control_web.auto') }}
                                </m-tag>
                                <div v-ellipsis class="f14 ft mt4 mb4 m-ellipsis">{{ item.infoCodeName }}</div>
                                <div>
                                    <span class="f18 fb7 ffCustom-M mr4">{{ getIotData(currentSystem.systemId, item.infoCode).dataValue || '--' }}</span>
                                    <span class="f14 ft">{{ item.unit }}</span>
                                    <SetButton
                                        :class="{ 'is-active': activeSetFormData?.infoCode === item.infoCode }"
                                        type="link"
                                        size="small"
                                        class="ml8 button-display"
                                        @click="e => editBtnDialog(e, item)"
                                    >
                                        {{ i18n.global.t('common.edit') }}
                                    </SetButton>
                                </div>
                                <div v-if="getManualAutoConfigValue(item.manualAutoConfig).manualAutoSet === 1" class="auto-item">
                                    <div class="f14 ffCP ft">
                                        {{ getCoolingTowerAutoTitle(item.infoCode, 'heatDissipationTemperatureDifference') }}
                                        {{ getManualAutoConfigValue(item.manualAutoConfig).heatDissipationTemperatureDifference || '--' }}{{ item.unit }}
                                    </div>
                                    <div class="f14 ffCP ft">
                                        {{ getCoolingTowerAutoTitle(item.infoCode, 'coolWaterReturnTempMinValue') }}：
                                        {{ getManualAutoConfigValue(item.manualAutoConfig).coolWaterReturnTempMinValue || '--' }}{{ item.unit }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <SystemOther :automatic-reset-arr="automaticResetArr" :disability-alarm-reset="disabilityAlarmReset" :current-system="currentSystem" />
                    <m-popover
                        virtual-triggering
                        :content="i18n.global.t('meos_control_web.i_am_hint_text')"
                        :virtual-ref="setFormBtn"
                        trigger="manually"
                        :is-open="isOpenSetForm"
                        placement="bottom"
                        style="--m-popover-padding: 0; --m-popover-border-radius: 8px"
                    >
                        <template #content>
                            <SetForm :data="activeSetFormData" can-change :identify-local-or-remote="identifyLocalOrRemote" @submit="submit" @close="closeForm" />
                        </template>
                    </m-popover>
                </m-scrollbar>
            </div>
        </template>
    </m-drawer>
</template>
<script setup>
import i18n from '@/localization';
import { Z_INDEX } from '@/constants/zIndex';
import { ReasonComponent } from '@/views/ACAC/hooks/config';
import SetForm from '@/views/ACAC/components/setForm/index.vue';
import InputSet from '@/views/ACAC/components/setForm/InputSet.vue';
import RadioSet from '@/views/ACAC/components/setForm/RadioSet.vue';
import { IS_AUTO, IS_MANUAL, SYSTEM_OPTIONS, LIMITATION } from '@/views/ACAC/variables';
import TextSet from '@/views/ACAC/components/setForm/TextSet.vue';
import useSystemSetHook from '../../../hooks/useSystemSetHook';
import DockSingleton from '@/hooks/responsiveDock';
import { currentSystemKey } from '../../../hooks/useBaseHook';
import { extendInfoCodeValueConfig, commandSend } from '@/apis/ACAC';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { $Message } from 'meri-plus';
import { isNil } from 'lodash';
import baseStore from '@/store/baseStore';
import SystemOther from './SystemOther.vue';
import { OTHER_REASON } from '@/views/ACAC/variables';
import SetButton from '@/components/common/SetButton.vue';
const currentSystem = inject(currentSystemKey, ref({}));

const { infoDatas, automaticResetArr, disabilityAlarmReset } = useSystemSetHook();
const { getIotData, getCustomInfo } = DockSingleton.getInstance();
const show = ref(false);
const emit = defineEmits(['close']);
const isOpenSetForm = ref(false);
const setFormBtn = ref();
const activeSetFormData = ref({});
const coolingTowerAutoTitleKeyMap = {
    coolingTowerOutTempSet: {
        heatDissipationTemperatureDifference: 'meos_control_web.cooling_tower_heat_dissipation_temp_diff',
        coolWaterReturnTempMinValue: 'meos_control_web.cooling_tower_out_temp_min_value'
    },
    coolingTowerOutTempCoolingSet: {
        heatDissipationTemperatureDifference: 'meos_control_web.cooling_condition_cooling_tower_heat_dissipation_temp_diff',
        coolWaterReturnTempMinValue: 'meos_control_web.cooling_condition_cooling_tower_out_temp_min_value'
    },
    coolingTowerOutTempStorageSet: {
        heatDissipationTemperatureDifference: 'meos_control_web.storage_condition_cooling_tower_heat_dissipation_temp_diff',
        coolWaterReturnTempMinValue: 'meos_control_web.storage_condition_cooling_tower_out_temp_min_value'
    }
};
const getCoolingTowerAutoTitle = (infoCode, titleType) => {
    const defaultTitleKeyMap = coolingTowerAutoTitleKeyMap.coolingTowerOutTempSet;
    return i18n.global.t(coolingTowerAutoTitleKeyMap[infoCode]?.[titleType] || defaultTitleKeyMap[titleType]);
};
const identifyLocalOrRemote = (formItemList, dataValue, FormConfig) => {
    const info = {
        infoCode: activeSetFormData.value.infoCode, // 字段标识
        infoCodeName: activeSetFormData.value.infoCodeName // 字段名称
    };
    const reasonComponent = ReasonComponent();
    reasonComponent.options = SYSTEM_OPTIONS[info.infoCode];
    const dataSource = [
        { code: IS_MANUAL, name: i18n.global.t('meos_control_web.manual1') },
        { code: IS_AUTO, name: i18n.global.t('meos_control_web.auto') }
    ];
    const manualAutoConfig = activeSetFormData.value?.manualAutoConfig;
    const manualAutoConfigDataValue = getManualAutoConfigValue(manualAutoConfig);
    const Config = {
        default: [
            {
                ...info,
                component: InputSet,
                unit: activeSetFormData.value.unit,
                min: LIMITATION[info.infoCode] ? LIMITATION[info.infoCode].min : undefined,
                max: LIMITATION[info.infoCode] ? LIMITATION[info.infoCode].max : undefined,
                precision: activeSetFormData.value.scale || 1
            },
            reasonComponent.options ? reasonComponent : ''
        ],
        0: [
            {
                ...info,
                infoCode: activeSetFormData.value?.manualAutoConfig?.infoCode,
                component: RadioSet,
                dataSource,
                defaultValue: manualAutoConfigDataValue?.manualAutoSet + ''
            },
            {
                infoCode: info.infoCode,
                infoCodeName: '',
                component: InputSet,
                unit: activeSetFormData.value.unit,
                min: LIMITATION[info.infoCode] ? LIMITATION[info.infoCode].min : undefined,
                max: LIMITATION[info.infoCode] ? LIMITATION[info.infoCode].max : undefined
            },
            reasonComponent
        ],
        1: [
            {
                ...info,
                infoCode: activeSetFormData.value?.manualAutoConfig?.infoCode,
                component: RadioSet,
                dataSource,
                defaultValue: manualAutoConfigDataValue?.manualAutoSet + ''
            },
            {
                ...info,
                component: TextSet,
                unit: activeSetFormData.value.unit
            },
            {
                infoCode: 'heatDissipationTemperatureDifference',
                infoCodeName: getCoolingTowerAutoTitle(activeSetFormData.value.infoCode, 'heatDissipationTemperatureDifference'),
                component: InputSet,
                unit: activeSetFormData.value.unit,
                defaultValue: manualAutoConfigDataValue?.heatDissipationTemperatureDifference + ''
            },
            {
                infoCode: 'coolWaterReturnTempMinValue',
                infoCodeName: getCoolingTowerAutoTitle(activeSetFormData.value.infoCode, 'coolWaterReturnTempMinValue'),
                component: InputSet,
                unit: activeSetFormData.value.unit,
                defaultValue: manualAutoConfigDataValue?.coolWaterReturnTempMinValue + ''
            },
            reasonComponent
        ]
    };
    console.log(manualAutoConfigDataValue);
    if (!isNil(manualAutoConfigDataValue?.manualAutoSet)) {
        FormConfig.value = {
            0: Config[0],
            1: Config[1]
        };
        formItemList.value = FormConfig.value[manualAutoConfigDataValue?.manualAutoSet || '0'];
    } else {
        FormConfig.value = {
            default: Config.default
        };
        formItemList.value = FormConfig.value.default;
    }
};
const editBtnDialog = (e, item) => {
    if (isOpenSetForm.value) {
        isOpenSetForm.value = false;
    }
    setFormBtn.value = e;
    activeSetFormData.value = structuredClone(item);
    activeSetFormData.value.id = currentSystem.value.systemId;
    nextTick(() => {
        isOpenSetForm.value = true;
    });
};
const submit = (val, loadingRef) => {
    console.log(val, val[activeSetFormData?.value?.manualAutoConfig?.infoCode], loadingRef, activeSetFormData.value);
    if (activeSetFormData?.value?.manualAutoConfig) {
        const params = {
            classCode: currentSystem.value.classCode,
            systemId: currentSystem.value.systemId,
            infoCode: activeSetFormData.value.infoCode,
            infoValue: val[activeSetFormData.value.infoCode], //信息点设定值 自动下不填写
            beforeValue: activeSetFormData.value.dataValue, //修改前的设定值 冷却塔出水温度设定值
            content: val.operateReason || (val.operateType === OTHER_REASON ? '' : val.operateType), //原因
            extendSetting: {
                coolWaterReturnTempMinValue: val.coolWaterReturnTempMinValue, //冷却塔出水温度最小值
                manualAutoSet: val[activeSetFormData?.value?.manualAutoConfig?.infoCode], //手自动状态 0-人工 1-自动
                heatDissipationTemperatureDifference: val.heatDissipationTemperatureDifference //冷却塔散热趋近温差ΔT
            }
        };
        extendInfoCodeValueConfig(params)
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    $Message.success(i18n.global.t('common.operation_success'));
                }
            })
            .finally(() => {
                isOpenSetForm.value = false;
                loadingRef.value = false;
            });
    } else {
        const params = {
            projectId: baseStore().projectId,
            systemId: currentSystem.value.systemId,
            objectId: currentSystem.value.systemId,
            infoCode: activeSetFormData.value.infoCode,
            infoValue: val[activeSetFormData.value.infoCode], //信息点设定值 自动下不填写
            beforeValue: activeSetFormData.value.dataValue, //修改前的设定值 冷却塔出水温度设定值
            content: val.operateReason || (val.operateType === OTHER_REASON ? '' : val.operateType) //原因
        };
        commandSend(params)
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    $Message.success(i18n.global.t('common.operation_success'));
                }
            })
            .finally(() => {
                isOpenSetForm.value = false;
                loadingRef.value = false;
            });
    }
};
const close = () => {
    show.value = false;
    nextTick(() => {
        emit('close');
    });
};
const closeForm = () => {
    isOpenSetForm.value = false;
    setFormBtn.value = null;
    activeSetFormData.value = {};
};
const getManualAutoConfigValue = item => {
    return (item && getCustomInfo(currentSystem.value.systemId, item.infoCodeType, item.infoCode)?.dataValue) || {};
};
onMounted(() => {
    show.value = true;
});
</script>
<style lang="less" scoped>
:deep(.cold-system-scrollbar) {
    padding-right: 20px;
}
.cold-system-drawer {
    &-item {
        padding: 16px 0px 16px 20px;
        height: 100%;
    }
    .content {
        border-radius: 8px;
        background: var(--gray-50, #f7f9fa);
        padding: 8px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        .single-row {
            grid-column: 1 / -1; /* 占据整行 */
        }
        .auto-item {
            border-radius: 4px;
            background: var(--gray-100, #f1f4f6);
            padding: 4px 8px;
        }
        &-item {
            padding: 8px;
            :deep(.button-display) {
                opacity: 0;
                transition: opacity 0.3s;
                &.is-active {
                    opacity: 1;
                    background: var(--alpha-30);
                }
            }
        }
        &-item:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            :deep(.button-display) {
                opacity: 1;
            }
        }
    }
    .title-name {
        padding-left: 12px;
        position: relative;
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        height: 22px;
        line-height: 22px;
        &::after {
            position: absolute;
            top: 4px;
            left: 0;
            width: 3px;
            height: 14px;
            background: var(--blue-500, #246fe5);
            content: '';
        }
    }
}
</style>
<style lang="less">
.cold-system-drawer {
    .m-drawer-mask {
        background-color: transparent;
    }
    .m-drawer-container-content {
        width: 100%;
        padding: 0px;
    }
}
@media screen and (min-width: 1600px) {
    .cold-system-drawer {
        .m-drawer-container {
            width: 480px !important;
        }
    }
}
@media screen and (max-width: 1600px) {
    .cold-system-drawer {
        .m-drawer-container {
            width: 400px !important;
        }
    }
}

.cold-system-drawer {
    .m-drawer-mask,
    .m-drawer-container {
        top: 48px;
        z-index: 1;
    }
    .m-drawer-container {
        height: calc(100% - 48px) !important;
    }

    .m-drawer-container-content.draw_fixed {
        width: 100%;
        padding: 0;
        height: 100%;
    }

    .drawer-tabs-box {
        .m-tabs-list {
            height: 45px;
            line-height: 1;
        }
        .m-tabs-name {
            line-height: 1;
        }
    }
}
</style>
