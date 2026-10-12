<template>
    <div class="ac-container">
        <div class="ac-container-left">
            <Left ref="leftRef" :is-hide-template-manage="isHideTemplateManage" />
            <div v-if="base.hasAuth('editingStandards') && !treeLoading && !isHideTemplateManage" class="ac-container-left-footer">
                <m-popover :content="i18n.global.t('meos_control_web.already_editing_cannot_add')" theme="darkTransparent" :show-arrow="false" :disabled="!isAcEdit && !isAcAdd">
                    <m-button type="link" size="medium" icon="IconMeriComponentButtonAdd" :disabled="isAcEdit || isAcAdd" @click="addStatus">{{
                        i18n.global.t('meos_control_web.add_special_config')
                    }}</m-button>
                </m-popover>
            </div>
        </div>
        <div class="ac-container-right">
            <div class="ac-container-right-top">
                <div class="ac-container-right-top-title">
                    <template v-if="currentConfigObj?.objectType === 'special'">{{ i18n.global.t('meos_control_web.add_special_config') }}</template>
                    <div v-else class="title-default">
                        {{ i18n.global.t('meos_control_web.operation_standard_configuration_dash') }}<span v-ellipsis class="title-value">{{ currentConfigItem?.groupName }}</span>
                    </div>
                </div>
                <div v-if="currentConfigObj?.objectType !== 'special' && !listLoading" v-show="!isAcEdit && !isAcAdd" class="ac-container-right-top-btn ml20">
                    <m-button
                        v-if="base.hasAuth('editingStandards') && currentConfigObj?.objectType === 'PROJECT' && !isHideTemplateManage"
                        type="default"
                        size="medium"
                        class="mr8"
                        style="margin-right: 8px"
                        @click="onDefault"
                        >{{ i18n.global.t('meos_control_web.restore_default') }}</m-button
                    >
                    <m-button
                        v-if="base.hasAuth('editingStandards') && currentConfigObj?.objectType !== 'PROJECT' && !isHideTemplateManage"
                        type="default"
                        size="medium"
                        class="mr8"
                        style="margin-right: 8px"
                        @click="onDel"
                        >{{ i18n.global.t('common.delete') }}</m-button
                    >
                    <m-button v-if="base.hasAuth('editingStandards') && !isHideTemplateManage" type="primary" size="medium" @click="changeStatus">
                        {{ i18n.global.t('common.edit') }}
                    </m-button>
                </div>
            </div>
            <Right class="ac-container-right-bottom" @refresh-left-list="refreshLeftList" />
        </div>
    </div>
</template>

<script setup>
import Left from './Left/index.vue';
import Right from './Right/index.vue';
import useAcCommon from '../hooks/useAcCommon';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';

const base = baseStore();
const {
    isAcEdit,
    isAcAdd,
    changeStatus,
    addStatus,
    onDefault,
    onDel,
    currentConfigItem,
    currentConfigObj,
    treeLoading,
    hideRemoveButton,
    listLoading,
    leftRef,
    refreshLeftList,
    isHideTemplateManage
} = useAcCommon();

defineExpose({
    refreshLeftList
});
</script>

<style lang="less" scoped>
.ac-container {
    display: flex;
    width: 100%;
    height: 100%;
    min-width: 1280px;
    overflow: hidden;
    // background-color: #d6dde5;
    position: relative;
    // background-size: cover;
    // background-image: url(@/assets/imgs/page_bg.png);
    &-left {
        width: 336px;
        min-width: 336px;
        max-width: 336px;
        overflow: hidden;
        border-right: 1px solid var(--gray-300, #e1e5eb);
        background: rgba(255, 255, 255, 0.8);
        position: relative;
        &-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 60px;
            line-height: 60px;
            text-align: center;
            width: 336px;
            border-top: 1px solid var(--gray-300, #e1e5eb);
        }
    }
    &-right {
        flex: 1;
        padding: 0 16px 16px;
        position: relative;
        max-width: calc(100% - 336px);
        &-top {
            padding: 12px 0;
            display: flex;
            min-width: 0px;
            justify-content: space-between;
            align-items: center;
            height: 56px;
            &-title {
                flex: 1;
                color: var(--gray-900, #1b2129);
                font-size: 16px;
                font-weight: 700;
                line-height: 22px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                .title-default {
                    display: flex;
                    flex-shrink: 0;
                    flex-grow: 0;
                    align-content: center;
                }
                .title-value {
                    font-weight: var(--platform-font-weight);
                    display: inline-block;
                    width: calc(100% - 110px);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            &-btn {
                flex-shrink: 0;
                white-space: nowrap;
            }
        }
        &-bottom {
            width: 100%;
            height: calc(100% - 56px);
            overflow: hidden;
            border-radius: 8px;
            background: #fff;
        }
    }
}
</style>
