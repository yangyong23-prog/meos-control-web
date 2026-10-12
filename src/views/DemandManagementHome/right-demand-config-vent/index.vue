<template>
    <div class="right-demand-config-container">
        <div class="header">
            <div class="header-left">
                <div class="self-title">
                    <span :class="['base-title']">{{ i18n.global.t('meos_control_web.demand_config') }}</span>
                    <span v-if="instanceTitle" class="line">-</span>
                    <span v-if="instanceTitle" v-ellipsis :class="['obj-title', 'm-ellipsis']">{{ instanceTitle || '--' }}</span>
                </div>
            </div>
            <div v-if="!editDataToRender && !isHideAction" class="header-right">
                <m-button v-if="showRecoverDefault" type="link" size="small" @click="onRecoverDefault">{{ i18n.global.t('meos_control_web.restore_default') }}</m-button>
                <m-button
                    v-else-if="showClearConfigNotProject"
                    type="link"
                    size="small"
                    @click="onClearConfig(isSpace, i18n.global.t('meos_control_web.clear_configuration_success'))"
                    >{{ i18n.global.t('meos_control_web.clear_configuration') }}</m-button
                >
                <div v-if="showRecoverDefault || showClearConfigNotProject" class="divider"></div>
                <m-button type="link" size="small" @click="onSwitchToEdit(true)">{{ i18n.global.t('common.edit') }}</m-button>
            </div>
        </div>
        <template v-if="!!editDataToRender">
            <AddEditConfigItem
                :config-items="editDataToRender"
                :is-project="isProject"
                :is-saving="isSaving"
                @config-cancel="onSwitchToEdit(false)"
                @config-save="editConfigConfirm"
            />
        </template>
        <template v-else>
            <ConfigList :info-data="configListData" :info-loading="listLoading" />
        </template>

        <m-modal
            v-model:visible="showClearModal"
            :append-to="$modalAppendTo"
            type="default"
            :title="i18n.global.t('meos_control_web.clear_configuration')"
            :modal-class-name="'clear-model-wrapper-container'"
            :content-class-name="'clear-modal-content-container'"
            :width="420"
            @close="showClearModal = false"
        >
            <template #content>
                <div class="center-wrapper">
                    <m-banner type="info" :message="i18n.global.t('meos_control_web.clear_config_inherit_or_empty')"></m-banner>
                    <div class="custom-clear-container">
                        <div class="radio-tips">{{ i18n.global.t('meos_control_web.confirm_clear_scope') }}</div>
                        <div class="radios-container">
                            <m-radio-group v-model="clearRadioVal">
                                <m-radio v-for="item in clearRadioOptions" :key="item.value" :label="item.value" :size="16"> {{ item.label }}</m-radio>
                            </m-radio-group>
                        </div>
                    </div>
                </div>
            </template>
            <template #footer>
                <m-button @click="showClearModal = false">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="danger" :loading="clearRadioSubmitLoading" @click="clearRadioSubmit">{{ i18n.global.t('meos_control_web.clear') }}</m-button>
            </template>
        </m-modal>
    </div>
</template>

<script setup>
import { MMessageBox, $Message } from 'meri-plus';
import Decimal from 'decimal.js';
import emitter from '@/utils/bus';
import useRightConfigList from '../hooks/useRightConfigList';
import useRightModal from '../hooks/useRightModal';
import useRightDemandConfig from '../hooks/useRightDemandConfig';
import ConfigList from './components/ConfigList.vue';
import AddEditConfigItem from './components/AddEditConfigItem.vue';
import { instanceIdInjectKey, templateIdInjectKey, isHideActionKey } from '../constant/injectKey';
import { removeInstanceConfig } from '@/apis/DemandManagementHome';
import { ventTimeRangeConfig, ventTimeRangeConfigMap } from '../constant/config';
import i18n from '@/localization';

const instanceId = inject(instanceIdInjectKey);
const templateId = inject(templateIdInjectKey);
const templateType = inject('templateType');
// 历史日期配置只读，隐藏恢复默认/清除配置/编辑操作
const isHideAction = inject(isHideActionKey);

const isSaving = ref(false);

const { fetchConfigList, configListData, listLoading, instanceTitle, isSpace, isProject, showClearConfig } = useRightConfigList();
const { editVentConfigSave, onSwitchToEdit, editDataToRender } = useRightDemandConfig({
    fetchConfigList,
    configListData
});
const { showClearModal, clearRadioOptions, clearRadioVal, clearRadioSubmitLoading, clearRadioSubmit, onClearConfig } = useRightModal({ fetchConfigList });

const selfConfigData = computed(() => {
    const res = configListData?.value?.[0]?.config?.globalConfig || {};
    return res;
});

const parentConfigData = computed(() => {
    return configListData?.value?.[0]?.parentConfig?.globalConfig || {};
});

const showRecoverDefault = computed(() => {
    const res = isProject.value && Object.keys(selfConfigData.value).length > 0;
    return res;
});

const showClearConfigNotProject = computed(() => {
    const res = !isProject.value && showClearConfig.value;
    return res;
});

const onRecoverDefault = () => {
    MMessageBox({
        type: 'danger',
        confirmButtonClass: 'demand-manage-action-box-confirm-class',
        title: i18n.global.t('meos_control_web.confirm_restore_default'),
        confirmButtonText: i18n.global.t('meos_control_web.restore_default'),
        message: `${i18n.global.t('meos_control_web.configured_content_cannot_be_restored')}`
    })
        .then(async () => {
            const params = {
                instanceType: 'PROJECT',
                instanceId: instanceId.value,
                templateId: templateId.value,
                clearRange: 'CURRENT'
            };
            const res = await removeInstanceConfig(params).finally(() => {});
            if (res?.code === '00000') {
                $Message.success({ title: `${i18n.global.t('meos_control_web.restore_default_success')}` });
                fetchConfigList?.value?.();
                emitter.emit('refreshTree', { id: instanceId.value });
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
            }
        })
        .catch(() => {});
};

const editConfigConfirm = async saveData => {
    isSaving.value = true;
    const { extraData, allRangeData = [] } = saveData;
    const allTimesConfigObj = allRangeData
        ?.map(v => v?.data)
        ?.flat()
        ?.filter(v => v?.start?.val && v?.end?.val)
        .reduce((acc, cur) => {
            const { rangeType, start, end } = cur || {};
            const curTimeItem = {
                beginTime: { timeType: 'ABSOLUTE', absoluteTime: start?.val + ':00' },
                endTime: {
                    timeType: 'ABSOLUTE',
                    absoluteTime: end?.val + ':00'
                },
                acrossDay: end?.date !== 'current'
            };
            let temArr = { ...acc };
            if (!Array.isArray(temArr?.[rangeType])) {
                temArr[rangeType] = [];
            }
            temArr[rangeType].push(curTimeItem);
            return temArr;
        }, {});

    // 时间段为引用值或空数组，即引用值，传undefined;
    // 时间段为过滤了开始结束时间后的空数组，即自定义值，传空数组；
    // 时间段为过滤了开始结束时间的非空数组，即自定义值，传自定义值；
    // 时间段字段按场景配置映射：穹顶含自然通风需求时间（naturalVentilationTimeIntervals），其余场景为排风/送风
    const timeRangeConfigs = ventTimeRangeConfigMap[templateType?.value || ''] || ventTimeRangeConfig;
    const labelKeysArr = timeRangeConfigs.map(v => v?.code);
    allRangeData.forEach((item, index) => {
        // 优先使用每行自带的 rangeType 映射字段，位置下标仅作兜底；两者都取不到时跳过，防止字段错写
        const labelKey = item?.rangeType || labelKeysArr[index];
        if (!labelKey) {
            return;
        }

        if (item?.isSameDefault) {
            allTimesConfigObj[labelKey] = undefined;
        } else if (!item?.data?.filter(v => v?.start?.val && v?.end?.val)?.length) {
            allTimesConfigObj[labelKey] = [];
        }
    });

    const feedbackMap = {
        yes: true,
        no: false,
        noFromParent: false,
        yesFromParent: true
    };
    const { participateFeedbackAdjust, o2Target, ...rest } = extraData || {};
    let tempConfig = {
        ...allTimesConfigObj,
        ...rest,
        participateFeedbackAdjust: feedbackMap[participateFeedbackAdjust],
        ...(o2Target?.toString() ? { o2Target: new Decimal(o2Target).div(new Decimal(100)).toNumber() } : {})
    };

    Object.entries(extraData).forEach(([key, val]) => {
        if (key === 'participateFeedbackAdjust') {
            return;
        }
        if (!val?.toString() || tempConfig[key] === null) {
            tempConfig[key] = undefined;
        }
    });

    // 非项目级编辑
    // 当所有都为引用状态，保存后为【引用上级配置】
    // 当有一项为非引用状态，保存后为【特殊配置】
    if (!isProject.value) {
        const isReferenceRadio = ['noFromParent', 'yesFromParent'].includes(participateFeedbackAdjust);
        if (isReferenceRadio) {
            tempConfig.participateFeedbackAdjust = undefined;
        }
    } else {
        const { participateFeedbackAdjust: parentFeedback } = parentConfigData.value;
        const isSameRadio = parentFeedback === tempConfig.participateFeedbackAdjust;

        if (isSameRadio) {
            tempConfig.participateFeedbackAdjust = undefined;
        }
    }
    const filterConfig = JSON.parse(JSON.stringify(tempConfig));
    try {
        if (Object.keys(filterConfig).length === 0) {
            await onClearConfig?.value?.(isSpace.value, i18n.global.t('common.edit_success'), {
                noConfirm: true,
                successCallback: () => {
                    editDataToRender.value = null;
                }
            });
        } else {
            await editVentConfigSave.value?.({ globalConfig: tempConfig }, () => {
                editDataToRender.value = null;
            });
        }
    } catch (err) {
        // 保存失败时保留编辑面板，便于用户重试
    } finally {
        isSaving.value = false;
    }
};
</script>

<style lang="less">
.m-modal-bg.clear-model-wrapper-container {
    .m-modal-main-content.clear-modal-content-container {
        padding: 0;
    }
}
</style>

<style lang="less" scoped>
.right-demand-config-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    justify-content: space-between;
    column-gap: 4px;
    border-bottom: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}

.header-left {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;

    .self-title {
        display: flex;
        align-items: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        color: @grey-800;
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px;

        .base-title {
            flex-shrink: 0;
        }

        .line,
        .obj-title {
            font-weight: var(--platform-font-weight);
        }
    }
}

.header-right {
    display: flex;
    align-items: center;

    .divider {
        width: 1px;
        height: 12px;
        background: #d9d9d9;
        margin-inline: 4px;
    }

    :deep(.m-button.small) {
        height: 24px;
    }
}

.center-wrapper {
    display: flex;
    flex-direction: column;

    .radio-tips {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 12px;
    }

    .custom-clear-container {
        padding: 0px 24px 20px 24px;
    }

    .m-banner {
        max-width: 100% !important;
        width: 100%;
        padding: 9px 12px 9px 16px;
        margin-bottom: 20px;
        border-radius: 0;
    }

    :deep(.m-banner-message) {
        padding-right: 0px;
    }

    .radios-container {
        display: flex;
        align-items: center;
    }

    :deep(.m-radio) {
        display: flex;
        align-items: center;
        width: max-content;
    }

    :deep(.m-radio-label) {
        color: @grey-900;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
}
</style>
<style lang="less">
.demand-manage-action-box-confirm-class {
    width: fit-content !important;
}
</style>
