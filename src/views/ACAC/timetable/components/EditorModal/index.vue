<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="default"
        modal-class-name="timetable-editor-modal"
        content-class-name="timetable-editor-modal-content"
        :width="1260"
        :height="'60%'"
        :footer="!loading"
        @close="close"
    >
        <template #header>
            <div class="header-wrap">
                <div class="editor-title">{{ title }}</div>
                <m-tips content="" width="420px" theme="darkTransparent" placement="bottom-start" trigger="hover">
                    <template #content>
                        {{ i18n.global.t('meos_control_web.ai_tips1') }}<br />
                        {{ i18n.global.t('meos_control_web.ai_tips2') }}<br />
                        {{ i18n.global.t('meos_control_web.ai_tips3') }}
                    </template>
                    <div class="editor-desc">
                        <IconMeriComponentDialogLinear color="#246FE5"></IconMeriComponentDialogLinear>
                        {{ i18n.global.t('meos_control_web.fill_instructions') }}
                    </div>
                </m-tips>
            </div>
        </template>
        <template #content>
            <div class="content-wrap">
                <div class="left">
                    <m-scrollbar>
                        <m-form ref="formRef" class="form" label-width="200px" label-position="left" :model="formModel" require-asterisk-position="right">
                            <div class="inline">
                                <div class="item-vertical">
                                    <div class="title-lv1">{{ i18n.global.t('meos_control_web.schedule_object') }}<span class="item-label-required">*</span></div>
                                    <m-form-item
                                        v-if="consoleType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id"
                                        :ref="el => (normalRefs['objectId'] = el)"
                                        prop="objectId"
                                        label-width="0px"
                                        :rules="{
                                            message: EMPTYTEXT,
                                            trigger: 'none',
                                            validator: (value, rule, callback) => validateRequired(baseData.objectId, callback)
                                        }"
                                        style="--m-form-item-margin: 0"
                                    >
                                        <m-select v-model="baseData.objectId" :max-width="110" :disabled="isEdit" :size="240" :options="spaceZones" :clearable="false"></m-select>
                                    </m-form-item>
                                    <div v-else style="height: 32px">{{ currentSystem.localName ?? '--' }}</div>
                                </div>
                                <div v-if="!isEdit" class="item-vertical">
                                    <div class="title-lv1">{{ i18n.global.t('meos_control_web.effective_start_date') }}<span class="item-label-required">*</span></div>
                                    <m-form-item
                                        :ref="el => (normalRefs['validateDateRange'] = el)"
                                        prop="validateDateRange"
                                        label-width="0px"
                                        style="--m-form-item-margin: 0"
                                        :rules="{
                                            message: EMPTYTEXT,
                                            trigger: 'none',
                                            validator: (value, rule, callback) => validateRequired(validateDateRange, callback)
                                        }"
                                    >
                                        <m-date-picker
                                            v-model="validateDateRange"
                                            :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                            :width="240"
                                            type="daterange"
                                            :clearable="false"
                                            :scope="scopeTime"
                                            @change="handleValidateDateChange"
                                        ></m-date-picker>
                                    </m-form-item>
                                </div>
                            </div>
                            <div
                                v-if="consoleType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id && baseData.objectId && currentSpace.classCode == 'ACZone'"
                                class="view_selected_partition_associated_space"
                                style="position: relative; width: 300px; height: 20px"
                            >
                                <m-popover width="auto" style="--m-popover-padding: 0" placement="bottom-start">
                                    <template #content>
                                        <SpaceList class="pop-space-list" :data="currentSpace" max-height="400px" lottie-name="circle" style="padding: 4px 8px" />
                                    </template>
                                    <SpaceIcon no-click no-tip style="margin-left: 0"> {{ i18n.global.t('meos_control_web.view_selected_partition_associated_space') }}</SpaceIcon>
                                </m-popover>
                            </div>
                            <div v-if="!isEdit" class="copy-container">
                                <div class="title-lv1">{{ i18n.global.t('meos_control_web.copy_time_table') }}：</div>
                                <m-tips :content="disableCopyDateTips" :disabled="!disableCopyDate" trigger="hover" theme="darkTransparent">
                                    <m-date-picker
                                        v-model="dateForCopy"
                                        :scope-disabled-tips-text="i18n.global.t('meos_control_web.select_only_this_and_next_year')"
                                        :width="240"
                                        type="date"
                                        :disabled-tips-text="disableCopyDateTips"
                                        :disabled="disableCopyDate"
                                        :placeholder="i18n.global.t('meos_control_web.select_date')"
                                        :scope="scopeTimeForCopy"
                                    ></m-date-picker>
                                </m-tips>
                                <div>
                                    <m-tips :content="copyAndOverwriteTipsContent" :disabled="copyAndOverwriteTipsDisabled" trigger="hover" theme="darkTransparent">
                                        <m-button :disabled="copyAndOverwriteBtnDisabled" type="link" size="medium" @click="doCopy">{{
                                            i18n.global.t('meos_control_web.copy_and_overwrite_cfg')
                                        }}</m-button>
                                    </m-tips>
                                    <span class="copy-op-desc">{{ copyOpDesc }}</span>
                                </div>
                            </div>
                            <div v-if="!isEdit" class="item-vertical">
                                <div class="title-lv1">{{ i18n.global.t('meos_control_web.configuration_method') }}<span class="item-label-required">*</span></div>
                                <m-radio-group v-model="extendInfo.effectDateType" :cancel="false" @change="onEffectDateTypeChange">
                                    <div class="check-list">
                                        <m-radio v-for="item in dateTypeOptions" :key="item.value" :label="item.value">
                                            <span class="radio-group-label">
                                                {{ item.label }}
                                            </span>
                                        </m-radio>
                                    </div>
                                </m-radio-group>
                                <m-form-item
                                    v-if="extendInfo.effectDateType !== EFFECT_DATE_TYPES.GENERAL.id"
                                    :ref="el => (normalRefs['effectDateType'] = el)"
                                    prop="effectDateType"
                                    label-width="0px"
                                    :rules="{
                                        message: EMPTYTEXT,
                                        trigger: 'none',
                                        validator: (value, rule, callback) =>
                                            validateRequired(extendInfo.effectDateType === EFFECT_DATE_TYPES.WEEK_TAG.id ? weekEffectDateData : extendInfo.effectDateData, callback)
                                    }"
                                >
                                    <m-checkbox-group v-if="extendInfo.effectDateType === EFFECT_DATE_TYPES.WEEK_TAG.id" v-model="weekEffectDateData">
                                        <div class="check-list">
                                            <m-checkbox v-for="item in weekOptions" :key="item.value" :label="item.value"> {{ item.label }} </m-checkbox>
                                        </div>
                                    </m-checkbox-group>
                                    <m-radio-group v-if="extendInfo.effectDateType === EFFECT_DATE_TYPES.WORK_TAG.id" v-model="extendInfo.effectDateData" cancel>
                                        <div class="check-list">
                                            <m-radio v-for="item in weekTagOptions" :key="item.value" :label="item.value">
                                                <span class="radio-group-label">
                                                    {{ item.label }}
                                                </span>
                                            </m-radio>
                                        </div>
                                    </m-radio-group>
                                </m-form-item>
                            </div>
                            <div class="item-vertical time-areas">
                                <div class="title-lv1">{{ i18n.global.t('meos_control_web.operation_schedule') }}<span class="item-label-required">*</span></div>
                                <TimeAreaEdit
                                    v-for="(item, idx) in timeAreaDatas"
                                    :key="item.sign"
                                    :ref="el => (timeAreaRefs[item.sign] = el)"
                                    :index="idx"
                                    :data="item"
                                    :console-type="consoleType"
                                    :show-del="timeAreaDatas?.length > 1"
                                    @delete="deleteTimeItem(idx)"
                                ></TimeAreaEdit>

                                <div class="add-item" @click="addTimeItem">
                                    <IconMeriComponentButtonAdd color="#246FE5"></IconMeriComponentButtonAdd>{{ i18n.global.t('meos_control_web.add_time') }}
                                </div>
                            </div>
                        </m-form>
                    </m-scrollbar>
                </div>

                <Right :is-edit="isEdit" :loading="loading" :console-type="consoleType" :object-id="objectId"></Right>
            </div>
        </template>
        <template #footer>
            <m-button type="default" :disabled="isSaving" @click="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" :loading="isSaving" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
    <m-modal
        v-model:visible="confirmForSaveShow"
        :append-to="$modalAppendTo"
        type="info"
        :z-index="Z_INDEX.modalConfirm"
        :title="''"
        :content="i18n.global.t('meos_control_web.confirm_new_policy_future_override')"
        @submit="doSave"
    >
    </m-modal>
</template>
<script setup>
import dayjs from 'dayjs';
import { Z_INDEX } from '@/constants/zIndex';
import { EMPTYTEXT } from '@/views/ACAC/variables';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import useTimetableEditor from '@/views/ACAC/hooks/useTimetableEditor';
import { EFFECT_DATE_TYPES, CONSOLE_TYPES } from '@/views/ACAC/variables';
import TimeAreaEdit from './TimeAreaEdit.vue';
import { IconMeriComponentButtonAdd } from 'meri-icon';
import Right from './Right.vue';
import { useErrorMessage, useSuccessMessage } from '@/utils/tools';
import { isEmptyNoReturn } from '@/utils/tools';
import i18n from '@/localization';
import SpaceIcon from '@/views/ACAC/components/SpaceIcon.vue';
import SpaceList from '@/views/ACAC/components/SpaceList.vue';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayTz } from '@/utils/dayjsTools';
const props = defineProps({
    consoleType: {
        type: String,
        default: ''
    },
    systemType: {
        type: String,
        default: ''
    },
    objectId: {
        type: String,
        default: ''
    },
    currentDate: {
        type: String,
        default: ''
    }
});

const showModal = defineModel({ type: Boolean, default: false });
const confirmForSaveShow = ref(false);
const emits = defineEmits(['afterSaved']);

const {
    addTimeItem,
    deleteTimeItem,
    handleValidateDateChange,
    saveData,
    validDateContainCurDay,
    isPastTime,
    onEffectDateTypeChange,
    applyOverwriteStrategys,
    normalRefs,
    timeAreaRefs,
    loading,
    baseData,
    spaceZones,
    currentSystem,
    isSaving,
    isEdit,
    title,
    validateDateRange,
    dateTypeOptions,
    weekOptions,
    extendInfo,
    weekEffectDateData,
    weekTagOptions,
    timeAreaDatas,
    formRef,
    dateForCopy,
    copyOpDesc,
    disableCopyDate,
    disableCopyDateTips,
    copyAndOverwriteBtnDisabled,
    copyAndOverwriteTipsDisabled,
    copyAndOverwriteTipsContent,
    strategyCopeValidData
} = useTimetableEditor(props, showModal);
const currentSpace = computed(() => {
    return spaceZones.value.find(item => item.id === baseData.value?.objectId) || {};
});
const formModel = ref({});

//可选择日期
const scopeTime = computed(() => {
    const dayjsTz = getDayjsTz();
    const bTime = dayjsTz.format('YYYY.MM.DD'),
        eTime = dayjsTz.add(1, 'year').format('YYYY.MM.DD');
    return `${bTime}-${eTime}`;
});
const close = () => {
    nextTick(() => {
        showModal.value = false;
    });
};

const scopeTimeForCopy = computed(() => {
    const bTime = dayTz().add(-1, 'year').month(0).date(1).format('YYYY.MM.DD'),
        eTime = dayTz().month(11).date(31).format('YYYY.MM.DD');
    // console.log('bTime: ', bTime, eTime);
    return `${bTime}-${eTime}`;
});

const validateRequired = (val, callback) => {
    if (Array.isArray(val)) {
        if (val.length === 0) {
            callback(new Error(EMPTYTEXT));
            return;
        }
    }
    if (isEmptyNoReturn(val)) {
        callback(new Error(EMPTYTEXT));
        return;
    }
    callback();
};
const validator = async () => {
    // console.log('validator: ', validateDateRange.value);
    let errRst = null;
    for (let k in normalRefs.value) {
        const obj = normalRefs.value[k];
        if (obj?.validate) {
            const rst = await obj
                .validate()
                .then(() => {
                    return { status: true };
                })
                .catch(e => {
                    const error = e.errors?.find(() => true);
                    return { status: false, errorMsg: error.message ?? '' };
                });
            if (!errRst && !rst?.status) {
                errRst = { ...rst, errProp: k };
            }
            // console.log('normalRefs--rst: ', rst);
        }
    }
    for (let k in timeAreaRefs.value) {
        const obj = timeAreaRefs.value[k];
        // console.log('k,obj: ', k, obj);
        if (obj?.validator) {
            try {
                const rst = await obj.validator();
                // console.log('index-validator-rst: ', rst);
                if (!errRst && !rst?.status) {
                    errRst = rst;
                }
            } catch (e) {
                console.log('e: ', e);
            }
        }
    }
    if (errRst) {
        formRef.value?.scrollToField(errRst.errProp);
        console.log('errRst: ', errRst);
        useErrorMessage(errRst.errorMsg ?? '');
        return false;
    }
    return true;
};
const getStrategyPlansValue = () => {
    const strategyPlans = [];
    for (let k in timeAreaRefs.value) {
        const obj = timeAreaRefs.value[k];
        if (obj?.getValue) {
            const areaData = obj.getValue();
            if (isEdit?.value && isPastTime(areaData.strategyTime)) {
                continue;
            }
            strategyPlans.push(areaData);
        }
    }

    return strategyPlans;
};

const doCopy = () => {
    if (strategyCopeValidData.value?.executeDetail) {
        applyOverwriteStrategys();
        useSuccessMessage(i18n.global.t('meos_control_web.duplicate_success'));
    }
};
const doSave = async () => {
    // const isValidat = await validator();
    // if (isValidat) {
    // }
    const strategyPlans = getStrategyPlansValue();
    const dataForSave = await saveData(strategyPlans);
    // console.log('dataForSave: ', dataForSave);
    if (dataForSave) {
        useSuccessMessage(i18n.global.t('common.save_success'));
        emits('afterSaved');
        nextTick(() => {
            showModal.value = false;
        });
    }
};
const confirm = async () => {
    if (isSaving?.value) {
        return;
    }
    const isValidat = await validator();
    if (isValidat) {
        if (validDateContainCurDay()) {
            confirmForSaveShow.value = true;
        } else {
            await doSave();
        }
    }
};
</script>
<style>
.timetable-editor-modal-content {
    padding: 0 !important;
}
</style>
<style lang="less" scoped>
.view_selected_partition_associated_space {
    :deep(.guan-lian) {
        left: 0;
        width: fit-content;
        color: var(--blue-500);
        cursor: default;
        svg {
            margin-right: 4px;
        }
        &:hover {
            background-color: transparent;
            color: var(--blue-700);
        }
    }
}
.header-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    .editor-title {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-weight: 700;
        line-height: 24px; /* 150% */
    }
    .editor-desc {
        display: flex;
        padding: 3px 4px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        color: #246fe5;
        text-align: center;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        cursor: default;
        &:hover {
            border-radius: 4px;
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
}
.content-wrap {
    // min-height: 437px;
    height: 100%;
    display: flex;
    width: 100%;
    align-items: flex-start;
    .left {
        flex: 1 0 0;
        height: 100%;
    }
    .form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        padding: 16px 16px 16px 24px;

        .inline {
            display: flex;
            gap: 48px;
        }
        .item-vertical {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 12px;
        }
        .item-label-required {
            color: #f55047;
            font-weight: normal;
        }
        .title-lv1 {
            color: var(--gray-800, #2e3742);
            font-size: 14px;
            font-weight: 700;
            line-height: 22px;
        }
        .check-list {
            display: flex;
            height: 32px;
            align-items: center;
            gap: 16px;
        }

        .radio-group-label {
            color: #1b2129;
            font-size: 14px;
            font-weight: 400;
            line-height: 16px;
        }
        .time-areas {
            width: 100%;
        }
        .add-item {
            display: inline-flex;
            padding: 5px 8px;
            justify-content: center;
            align-items: center;
            gap: 12px;
            border-radius: 4px;

            &:hover {
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }

            cursor: pointer;
            color: var(--blue-500, #246fe5);
            text-align: center;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
        .copy-container {
            display: flex;
            width: 100%;
            padding: 8px 12px;
            align-items: center;
            gap: 8px;
            border-radius: 4px;
            background: var(--Grey-Grey-100, #f1f4f6);
        }
        .copy-op-desc {
            color: var(--Palette-Orange-700, #e68600);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
    }
}
</style>
