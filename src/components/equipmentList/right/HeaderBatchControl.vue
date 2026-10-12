<template>
    <div v-show="selectedList.length > 0" class="selected-wrap">
        <div class="left">
            <span>
                {{ i18n.global.t('meos_control_web.already_selected') }}
                <i class="number">{{ selectedList.length }}</i>
                {{ i18n.global.t('meos_control_web.item') }}
            </span>
        </div>
        <div class="middle">
            <m-button v-if="params.hasIntervention" type="primary" size="small" @click="openReleaseInterventionForm">{{
                i18n.global.t('meos_control_web.release_intervention')
            }}</m-button>
            <span v-if="params.hasIntervention" class="split"></span>
            <AdaptiveMenuBar :list="btnList" :selected-list="selectedList" :params="params" class="normal-btns"></AdaptiveMenuBar>
        </div>

        <div class="right">
            <m-button type="text" size="small">
                <span class="cancel-text" @click="deselect">{{ i18n.global.t('meos_control_web.deselect') }}</span>
            </m-button>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import AdaptiveMenuBar from './components/AdaptiveMenuBar.vue';
import { clearAllDataCheckKey } from '@/components/equipmentList/hooks/useTableDataHook';
import { SUBMIT_TYPE } from '@/components/equipmentList/variables';

import { openReleaseInterventionControlFormKey, closeFormKey, curControlInfoCodeKey } from '@/components/equipmentList/hooks/useControlHook';
const clearAllDataCheck = inject(clearAllDataCheckKey);
const openReleaseInterventionControlForm = inject(openReleaseInterventionControlFormKey);
const closeForm = inject(closeFormKey);
const curControlInfoCode = inject(curControlInfoCodeKey);

const props = defineProps({
    selectedList: {
        type: Array,
        default: () => []
    },
    params: {
        type: Object,
        default: () => {}
    }
});

const infoText = i18n.global.t('meos_control_web.acknowledge_release_all_interventions');
const openReleaseInterventionForm = event => {
    openReleaseInterventionControlForm({ el: event.target, data: props.selectedList }, SUBMIT_TYPE.BATCH_RELEASE_INTERVENTION, infoText);
};
// 取消选择
const deselect = () => {
    closeForm();
    clearAllDataCheck();
};

// 监听弹窗关闭
watchEffect(() => {
    // 当前打开了解除干预弹框
    if (curControlInfoCode.value?.SUBMIT_TYPE === SUBMIT_TYPE.BATCH_RELEASE_INTERVENTION) {
        if (!props.params.hasIntervention) {
            closeForm();
        }
    } else if (curControlInfoCode.value?.SUBMIT_TYPE === SUBMIT_TYPE.BATCH_CONTROL) {
        const curCode = curControlInfoCode.value.infoCode;
        // 当前按钮里没有控制弹窗对应的信息点了
        if (curCode && !props.params.btnList?.some(obj => obj.infoCode === curCode)) {
            closeForm();
        }
    }
});
watch(
    () => props.selectedList,
    () => {
        closeForm();
    }
);
onBeforeUnmount(() => {
    closeForm();
});
</script>
<style lang="less" scoped>
.batch-control-wrap {
}
.selected-wrap {
    padding: 0 16px;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 55;
    top: -52px;
    height: 48px;
    border-radius: 4px;
    border: 1px solid #64a6f7;
    background: #d9ebff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    padding: 0 24px;
    box-shadow: 0px 22px 40px 0px rgba(98, 108, 120, 0.08), 0px 14px 26px 0px rgba(98, 108, 120, 0.04), 0px 0px 4px 0px rgba(98, 108, 120, 0.15);
    .left {
        color: var(--gray-600, #626c78);
        display: flex;
        align-items: center;
        font-family: 'PingFang SC';
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px; /* 157.143% */
        .number {
            color: var(--gray-900, #1b2129);
            font-family: 'PingFang SC';
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            margin: 0 2px;
        }
    }
    .split {
        width: 1px;
        background: var(--gray-400, #c4c9cf);
        height: 20px;
        display: inline-block;
    }
    .middle {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
        overflow: hidden;
    }
    .normal-btns {
        flex: 1;
    }
    .right {
        margin-left: 12px;
        .cancel-text {
            color: var(--gray-600, #626c78);
            text-align: center;
            font-feature-settings: 'clig' off, 'liga' off;

            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
    }
}
</style>
