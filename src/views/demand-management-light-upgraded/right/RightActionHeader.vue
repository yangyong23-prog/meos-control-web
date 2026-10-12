<template>
    <div class="right-action-header">
        <div class="top-title">
            <template v-if="currentConfigObj?.objectType === 'special'">{{ i18n.global.t('meos_control_web.add_special_config') }}</template>
            <div v-show="currentConfigObj?.objectType !== 'special'" class="title-default" :style="{ '--left-gap': width + 7 + 'px' }">
                <span ref="leftGroupName">{{ curSelectedPeriodName || i18n.global.t('meos_control_web.operation_standard_configuration') }}</span>
                <span v-if="currentConfigItem?.groupName">-</span>
                <span v-ellipsis class="title-value">{{ currentConfigItem?.groupName }}</span>
            </div>
        </div>
        <div
            v-if="!isHideRightBtns && currentConfigObj?.objectType !== 'special' && !isLeftAndRightConfigLoading"
            v-show="!isRightConfigEdit && !isRightConfigAdd"
            class="action-btns"
        >
            <m-button v-if="isAbleAuth && !isHideTemplateManage && !hideRemoveButton" type="default" size="medium" @click="onDel"> {{ i18n.global.t('common.delete') }} </m-button>
            <m-button v-if="isAbleAuth && !isHideTemplateManage" type="primary" size="medium" @click="editConfig">{{ i18n.global.t('common.edit') }}</m-button>
        </div>
    </div>
</template>

<script setup>
import baseStore from '@/store/baseStore';
import {
    useConfigRightAction,
    isLeftAndRightConfigLoadingKey,
    isRightConfigAddKey,
    isRightConfigEditKey,
    curLeftConfigObjKey,
    curLeftConfigObjItemKey,
    hideRemoveButtonKey
} from '../hooks/useConfigCommonHook';
import { curSelectedPeriodNameKey } from '../hooks/useGlobalData';
import { useElementSize } from '@vueuse/core';
import i18n from '@/localization';

const props = defineProps({
    isHideTemplateManage: {
        type: Boolean,
        default: false
    },
    useAuth: {
        type: Boolean,
        default: false
    },
    isHideRightBtns: {
        type: Boolean,
        default: false
    }
});
const hideRemoveButton = inject(hideRemoveButtonKey);
const base = baseStore();
const isAbleAuth = computed(() => {
    if (props.useAuth) {
        return base.hasAuth('editingStandards');
    }
    return true;
});
const leftGroupName = ref();
const { width } = useElementSize(leftGroupName);
const curSelectedPeriodName = inject(curSelectedPeriodNameKey);
const isLeftAndRightConfigLoading = inject(isLeftAndRightConfigLoadingKey);
const isRightConfigAdd = inject(isRightConfigAddKey);
const isRightConfigEdit = inject(isRightConfigEditKey);
const currentConfigObj = inject(curLeftConfigObjKey);
const currentConfigItem = inject(curLeftConfigObjItemKey);

const { editConfig, onDefault, onDel } = useConfigRightAction();
</script>

<style lang="less" scoped>
.right-action-header {
    width: 100%;
    padding: 12px 0;
    display: flex;
    min-width: 0px;
    justify-content: space-between;
    align-items: center;
    height: 56px;

    .top-title {
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
            align-items: center;
            flex-shrink: 0;
            flex-grow: 0;
            height: 32px;
        }
        .title-value {
            font-weight: var(--platform-font-weight);
            display: inline-block;
            width: calc(100% - var(--left-gap));
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
    .action-btns {
        margin-left: 20px;
        flex-shrink: 0;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 8px;
    }
}
</style>
