<template>
    <div class="right-demand-config-container">
        <div class="header">
            <div class="header-left">
                <div class="self-title">
                    <span :class="['base-title']">{{ i18n.global.t('meos_control_web.demand_config') }}</span>
                    <span v-if="instanceTitle" class="line">-</span>
                    <span v-if="instanceTitle" v-ellipsis :class="['obj-title', 'm-ellipsis']">{{ instanceTitle || '--' }}</span>
                </div>
                <div v-if="referenceTitle && !showAddEditSpaceTypeConfig" :class="['reference-title']">
                    <span>{{ `(` }}</span>
                    <div v-ellipsis :class="['inheritance-title', 'm-ellipsis']">{{ i18n.global.t('meos_control_web.accord_to_name', { name: referenceTitle || '--' }) }}</div>
                    <span>{{ `)` }}</span>
                </div>
            </div>
            <div v-if="!showAddEditSpaceTypeConfig" class="header-right">
                <m-tips :disabled="!isShield" :content="i18n.global.t('meos_control_web.please_unshield_before_operation')" theme="darkTransparent" trigger="hover">
                    <m-button v-if="showCancelReference" type="link" size="small" :disabled="isShield" @click="onCancelReference">{{
                        i18n.global.t('meos_control_web.cancel_reference')
                    }}</m-button>
                </m-tips>
                <div v-if="showCancelReference && showClearConfig" class="divider"></div>
                <m-tips :disabled="!isShield" :content="i18n.global.t('meos_control_web.please_unshield_before_operation')" theme="darkTransparent" trigger="hover">
                    <m-button v-if="showClearConfig" type="link" size="small" :disabled="isShield" @click="onClearConfig(isSpace)">{{
                        i18n.global.t('meos_control_web.clear_configuration')
                    }}</m-button>
                </m-tips>
            </div>
        </div>
        <template v-if="showAddEditSpaceTypeConfig">
            <AddEditConfigItem
                :is-edit="isEdit"
                :is-saving="spaceTypeConfigSaving"
                :config-item="currentSpaceTypeConfig"
                @space-type-config-cancel="spaceTypeConfigCancel"
                @space-type-config-save="spaceTypeConfigSave"
            />
        </template>
        <template v-else>
            <ConfigList
                :config-list-data="configListData"
                :list-loading="listLoading"
                :has-reference="showCancelReference"
                :is-shield="isShield"
                @edit-config="editConfigConfirm"
                @refresh-config-list="fetchConfigList"
            />
            <div class="footer">
                <m-button v-if="!isSpace" type="link" icon="IconMeriComponentButtonAdd" size="small" @click="spaceTypeConfig('add')">{{
                    i18n.global.t('meos_control_web.add_space_function_config')
                }}</m-button>
                <m-button v-else type="link" size="small" @click="shieldSpaceConfirm(isShield)">
                    <div class="shield-txt">
                        <shieldSvg /> {{ isShield ? `${i18n.global.t('meos_control_web.unmask')}` : `${i18n.global.t('meos_control_web.shield_this_zone')}` }}
                    </div>
                </m-button>
            </div>
        </template>

        <m-modal
            v-model:visible="showCancelModal"
            :append-to="$modalAppendTo"
            type="default"
            :title="i18n.global.t('meos_control_web.cancel_reference')"
            :width="420"
            @close="showCancelModal = false"
        >
            <template #content>
                <div class="center-wrapper">
                    <div class="radio-tips">{{ i18n.global.t('meos_control_web.confirm_keep_inherited_config') }}</div>
                    <div class="radios-container">
                        <m-radio-group v-model="cancelRadioVal">
                            <m-radio v-for="item in cancelRadioOptions" :key="item.value" :label="item.value" :size="16"> {{ item.label }}</m-radio>
                        </m-radio-group>
                    </div>
                </div>
            </template>
            <template #footer>
                <m-button @click="showCancelModal = false">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" :loading="cancelRadioSubmitLoading" @click="cancelRadioSubmit">{{ i18n.global.t('common.confirm') }}</m-button>
            </template>
        </m-modal>

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
import shieldSvg from '@/assets/svg/shield.svg';
import AddEditConfigItem from './components/AddEditConfigItem.vue';
import ConfigList from './components/ConfigList.vue';
import useRightDemandConfig from '../hooks/useRightDemandConfig';
import useRightModal from '../hooks/useRightModal';
import useRightConfigList from '../hooks/useRightConfigList';
import i18n from '@/localization';

const { fetchConfigList, configListData, listLoading, instanceTitle, referenceTitle, isSpace, isShield, showCancelReference, showClearConfig, shieldSpaceConfirm } =
    useRightConfigList();
const { isEdit, currentSpaceTypeConfig, editConfigConfirm, spaceTypeConfig, spaceTypeConfigCancel, spaceTypeConfigSave, spaceTypeConfigSaving, showAddEditSpaceTypeConfig } =
    useRightDemandConfig({
        fetchConfigList,
        configListData,
        showCancelReference
    });

const {
    showCancelModal,
    cancelRadioOptions,
    cancelRadioVal,
    cancelRadioSubmitLoading,
    showClearModal,
    clearRadioOptions,
    clearRadioVal,
    clearRadioSubmitLoading,
    cancelRadioSubmit,
    clearRadioSubmit,
    onCancelReference,
    onClearConfig
} = useRightModal({ fetchConfigList });
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

    .reference-title {
        flex-shrink: 0;
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;

        display: flex;
    }

    .inheritance-title {
        max-width: 130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}

.header-right {
    display: flex;
    align-items: center;

    .divider {
        width: 1px;
        height: 12px;
        background: #d9d9d9;
    }
}

.footer {
    position: relative;
    left: 0;
    bottom: 0;
    display: flex;
    height: 64px;
    padding: 16px;
    justify-content: center;
    align-items: center;

    border-top: 1px solid var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}

.shield-txt {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    svg {
        width: 14px;
        height: 14px;
        margin-right: 4px;
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
