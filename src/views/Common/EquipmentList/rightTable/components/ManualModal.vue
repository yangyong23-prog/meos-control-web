<template>
    <PopoverWrap :visible="props.visible" :disabled="props.disabled">
        <template #content>
            <div class="manual-custom-wrap">
                <div v-if="type !== 'edit'" class="edit-title mb16">{{ i18n.global.t('meos_control_web.switch_to_manual_mode_dup') }}</div>
                <span class="text-wrap mb8">{{ i18n.global.t('meos_control_web.deadline') }}</span>
                <m-date-picker
                    v-model="pickerTime"
                    :width="280"
                    :error-info="showError && pickerTimeError"
                    type="datetime"
                    :scope="scopeTime"
                    :time-picker="{
                        format: 'hm'
                    }"
                    @change="timeChange"
                ></m-date-picker>
                <span class="text-wrap mb8 mt16">{{ i18n.global.t('meos_control_web.reason') }}</span>
                <m-input
                    v-model="areaValue"
                    :type="'textarea'"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                    :maxlength="100"
                    :width="100"
                    :height="140"
                    show-word-limit
                    style="resize: none"
                    :error-text="showError && !areaValue ? i18n.global.t('meos_control_web.input_required_check_error_4') : ''"
                >
                </m-input>
                <section class="fend">
                    <m-button type="default" size="small" @click="closePop">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button
                        type="primary"
                        size="small"
                        :loading="textLoading"
                        @click="
                            changeManualAutoStatus({
                                objectIds: props.objectIds,
                                model: 0,
                                objectType: OBJ_TYPE.EQUIPMENT,
                                type: type
                            })
                        "
                        >{{ i18n.global.t('common.confirm') }}</m-button
                    >
                </section>
            </div>
        </template>
        <slot></slot>
    </PopoverWrap>
</template>
<script setup>
import PopoverWrap from './PopoverWrap.vue';
import { getFormatDate } from '../../utils';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    objectIds: {
        type: Array,
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    },
    // 类型 切换手动switch  修改时间 edit
    type: {
        type: String,
        default: 'switch'
    },
    expireTime: {
        type: String,
        default: ''
    }
});

const closePop = inject('closePop');
const scopeTime = inject('scopeTime');
const textLoading = inject('textLoading');
const showError = inject('showError');
const pickerTimeError = inject('pickerTimeError');
const timeChange = inject('timeChange');
const areaValue = inject('areaValue');
const pickerTime = inject('pickerTime');
const changeManualAutoStatus = inject('changeManualAutoStatus');
watchEffect(() => {
    if (props?.expireTime) {
        pickerTime.value = getFormatDate(props.expireTime);
    }
});
</script>
<style lang="less" scoped>
.manual-custom-wrap {
    padding: 16px 20px;
    width: 320px;
    .edit-title {
        color: #1b2129;

        height: 24px;
        font-size: 16px;
        font-weight: 700;
        line-height: 24px;
    }
    .text-wrap {
        display: inline-block;
        color: #646a73;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        position: relative;
        height: 22px;
        line-height: 22px;
        &::before {
            position: absolute;
            right: -10px;
            top: -1px;
            content: '*';
            color: #f55047;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            height: 22px;
            line-height: 22px;
        }
    }
    .error-text {
        color: #f55047;
        font-size: 12px;
    }
    .fend {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 16px;
    }
}
</style>
