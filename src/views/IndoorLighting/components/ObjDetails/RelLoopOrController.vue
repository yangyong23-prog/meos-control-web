<template>
    <div class="indoor-lighting-relationships w100 h100">
        <m-scrollbar class="scrollbar w100 h100" content-style="height:100%;">
            <div class="list-content wh100">
                <div v-if="targetLoopList?.length > 0" class="item-group w100">
                    <div class="class-header">
                        <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.lighting_circuit') }}</div>
                    </div>
                    <div v-if="showToolPanel" class="tool-panel">
                        <div class="row1">
                            <div class="desc">
                                {{ i18n.global.t('meos_control_web.already_selected') }} <span class="count">{{ loopCheckedIds?.length ?? 0 }}</span>
                                {{ i18n.global.t('meos_control_web.project') }}
                            </div>
                            <m-button type="text" size="small" @click="clearCheck()">{{ i18n.global.t('meos_control_web.deselect') }}</m-button>
                        </div>
                        <div class="row2">
                            <m-button v-if="loopCheckedIds?.length > 0" type="default" size="small" @click="e => openForm(e.target, getInfoCode('1'), loopCheckedIds)">{{
                                INFOCODE.runStatus1.aliasName
                            }}</m-button>
                            <m-button v-if="loopCheckedIds?.length > 0" type="default" size="small" @click="e => openForm(e.target, getInfoCode('0'), loopCheckedIds)">{{
                                INFOCODE.runStatus0.aliasName
                            }}</m-button>
                            <m-popconfirm
                                v-if="checkedInfoList.intervention?.length > 0"
                                :content="i18n.global.t('meos_control_web.confirm_resume_auto_control')"
                                status="primary"
                                placement="bottom-end"
                                :cancel-button-text="i18n.global.t('common.cancel')"
                                :confirm-button-text="i18n.global.t('common.confirm')"
                                style="--m-popover-padding: 20px; --m-popover-border-radius: 8px"
                                width="316px"
                                @confirm="batchReleaseInterventionFun(checkedInfoList.intervention)"
                            >
                                <m-button type="default" size="small">{{ i18n.global.t('meos_control_web.resume_auto_control') }}</m-button>
                            </m-popconfirm>
                        </div>
                    </div>
                    <div class="statistcal-bar">
                        <div v-for="(obj, idx) in statistcalList" :key="idx" class="item">
                            <div class="val ffCustom-M">{{ obj.count }}</div>
                            <div class="title">{{ obj.infoCodeName }}</div>
                        </div>
                    </div>
                    <div class="class-header">
                        <div class="title f14">{{ i18n.global.t('meos_control_web.loop_inventory') }}</div>
                        <div class="right">
                            <m-tree-select
                                v-model="loopTypesSel"
                                :data="cascaderOptions"
                                noborder
                                size="auto"
                                :max-width="80"
                                level="Right"
                                clearable
                                :popover-attrs="{
                                    width: '240px'
                                }"
                                @clear="selTypeItem = null"
                                @change="onTypeSelect"
                            >
                                <template #nodeSlot="node">
                                    <div class="item-container">
                                        <m-tips
                                            :content="node.disabled ? i18n.global.t('meos_control_web.please_select_function_or_lamp_type') : ''"
                                            :disabled="!node.disabled"
                                            trigger="hover"
                                            theme="darkTransparent"
                                        >
                                            {{ node.name }}
                                        </m-tips>
                                    </div>
                                </template>
                            </m-tree-select>
                            <m-tips
                                :content="!allDisabledInfo?.value ? allDisabledInfo?.text || '' : ''"
                                :disabled="allDisabledInfo?.value"
                                trigger="hover"
                                theme="darkTransparent"
                            >
                                <m-checkbox :disabled="!allDisabledInfo?.value" :model-value="allCheckedValue" @click="checkAll(allCheckedValue)">{{
                                    i18n.global.t('meos_control_web.select_all1')
                                }}</m-checkbox>
                            </m-tips>
                            <div class="split-line"></div>
                            <div class="fc unpack" @click="toggleInfoAll(!extpandInfoAll)">
                                <div class="mr4" style="user-select: none">
                                    {{ extpandInfoAll ? i18n.global.t('meos_control_web.collapse_data_points') : i18n.global.t('meos_control_web.expand_information_point') }}
                                </div>
                                <SvgIcon name="unpack" />
                            </div>
                        </div>
                    </div>

                    <LampLoopList
                        :list="lampLoopList"
                        :lamps-checked-map="lampsCheckedMap"
                        :loop-checked-map="loopCheckedMap"
                        :loop-opened-map="loopOpenedMap"
                        :loop-disabled-map="objDisabledInfo"
                        @check-lamp="clickLampCheckBox"
                        @check-loop="loop => clickLoopCheckBox(loop)"
                    ></LampLoopList>
                </div>
                <div v-if="objModuleList?.length > 0" class="item-group w100">
                    <div class="class-header">
                        <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.lighting_controller') }}</div>
                    </div>
                    <div class="moudle-list">
                        <LoopOrModuleItem
                            v-for="(obj, index) in objModuleList"
                            :key="index"
                            :tag-codes="moduleStatusMap[obj.id]"
                            :data="obj"
                            :use-check="false"
                            :hover-detail="true"
                            :has-expand="false"
                        >
                        </LoopOrModuleItem>
                    </div>
                </div>
            </div>
        </m-scrollbar>
        <ControlForm v-model="isControlOpen" width="370px" :virtual-ref="virtualRef" :form-list="formList" @submit="handleSubmit" @close="closeForm" />
        <ErrorList v-if="showErrorList" :error-list="errorList" @close="showErrorList = false" />
    </div>
</template>

<script setup>
import LampLoopList from '../LampLoopList/index.vue';
import LoopOrModuleItem from '../LoopOrModuleItem.vue';
import useRelLoopOrController from '../../hooks/useRelLoopOrController';
import useBatchControlHandler from '../../hooks/useBatchControlHandler';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import ErrorList from '@/views/IndoorLighting/components/ErrorList.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import i18n from '@/localization';
import { INFOCODE } from '@/views/IndoorLighting/variables';

const props = defineProps({
    selectObj: {
        type: Object,
        default: () => null
    }
});

const {
    targetLoopList,
    allCheckedValue,
    lampsCheckedMap,
    loopCheckedIds,
    lampLoopList,
    showToolPanel,
    statistcalList,
    objModuleList,
    loopCheckedMap,
    loopOpenedMap,
    cascaderOptions,
    selTypeItem,
    loopTypesSel,
    checkedInfoList,
    moduleStatusMap,
    extpandInfoAll,
    objDisabledInfo,
    allDisabledInfo,
    toggleInfoAll,
    clickLampCheckBox,
    clickLoopCheckBox,
    checkAll,
    clearCheck,
    onTypeSelect
} = useRelLoopOrController(props);

const equipSwitchSetItem = {
    additionalMapValue: {},
    dataSource: [
        {
            code: '0',
            name: i18n.global.t('meos_control_web.off')
        },
        {
            code: '1',
            name: i18n.global.t('meos_control_web.on')
        }
    ],
    dataValue: '0',
    infoCode: 'equipSwitchSet',
    infoCodeName: i18n.global.t('meos_control_web.equipment_switch_setting'),
    aliasName: i18n.global.t('meos_control_web.switch_setpoint'),
    existsIotRule: true,
    sequence: 3,
    unit: ''
};
const getInfoCode = dataValue => {
    return {
        ...equipSwitchSetItem,
        dataValue
    };
};
const { handleSubmit, openForm, closeForm, batchReleaseInterventionFun, isControlOpen, virtualRef, formList, showErrorList, errorList } = useBatchControlHandler();
watch(showToolPanel, () => {
    if (!showToolPanel.value) {
        isControlOpen.value = false;
    }
});
</script>
<style lang="less" scoped>
.indoor-lighting-relationships {
    // padding: 16px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex: 1 0 0;
    position: relative;

    .scrollbar {
        padding: 16px 24px;
    }
    .item-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
    .statistcal-bar {
        width: 100%;
        display: flex;
        padding: 6px 16px;
        justify-content: space-between;
        align-items: flex-start;

        border-radius: 4px;
        background: var(--gray-50, #f7f9fa);
        .item {
            display: flex;
            flex: 1;
            // padding: 4px 8px;
            flex-direction: column;
            align-items: flex-start;

            .val {
                color: #000;
                font-size: 16px;
                font-weight: 600;
            }
            .title {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-weight: 400;
            }
        }
    }
    .tool-panel {
        display: flex;
        width: calc(100% - 48px);
        padding: 10px 24px;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        position: absolute;
        left: 24px;
        top: 14px;
        border-radius: 4px;
        border: 1px solid var(--blue-300, #64a6f7);
        background: var(--blue-100, #d9ebff);
        z-index: 2;

        /* Shadow/shadow-3 */
        box-shadow: 0px 22px 40px 0px rgba(98, 108, 120, 0.08), 0px 14px 26px 0px rgba(98, 108, 120, 0.04), 0px 0px 4px 0px rgba(98, 108, 120, 0.15);
        .row1 {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            .desc {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                font-weight: 400;
                line-height: 22px; /* 157.143% */
                .count {
                    color: var(--gray-900, #1b2129);
                    font-weight: 600;
                }
            }
        }
        .row2 {
            display: flex;
            align-items: flex-start;
            // gap: 12px;
        }
    }
    .class-header {
        display: flex;
        height: 24px;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
        .right {
            display: flex;
            // width: 239px;
            justify-content: flex-end;
            align-items: center;
            gap: 4px;
            .split-line {
                width: 1px;
                height: 14px;
                background: var(--Grey-Grey-Dividers, #e1e5eb);
            }
        }
        .title {
            padding-left: 9px;
        }
        .unpack {
            padding: 4px;
            cursor: pointer;
            &:hover {
                border-radius: 4px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
    .list-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .title-item {
        position: relative;
        margin-left: 10px;

        &::before {
            position: absolute;
            width: 3px;
            height: 14px;
            background: #246fe5;
            left: -10px;
            top: 4px;
            content: '';
        }
    }
    .title-item:not(:first-of-type) {
        margin-top: 12px;
    }
    .moudle-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
</style>
