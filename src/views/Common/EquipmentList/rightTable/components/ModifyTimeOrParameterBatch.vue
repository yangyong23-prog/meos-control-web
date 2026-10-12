<template>
    <div class="manual-custom-wrap">
        <div v-if="!isEnum" style="margin-bottom: 16px">
            <div class="text-wrap">
                <span>{{ props?.data.infoCodeName || '--' }}</span>
                <span class="icon"> *</span>
            </div>
            <div class="input-list-wrap">
                <m-input-number
                    v-model="inputValue"
                    :width="280"
                    controls="rightButton"
                    :error-text="showError && !inputValue && inputValue !== 0 ? i18n.global.t('meos_control_web.input_required_check_error_4') : ''"
                    text-align="left"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                >
                    <template #suffix>{{ props?.data.unit || '--' }}</template>
                </m-input-number>
            </div>
        </div>
        <div v-if="isEnum">
            <div class="text-wrap">
                <span>{{ props?.data.infoCodeName || '--' }}</span>
                <span class="icon"> *</span>
            </div>
            <div class="radio-group-list">
                <m-radio-group v-model="radioValue">
                    <div class="radio-list">
                        <m-radio v-for="item in radioOptions" :key="item.label" :label="item.value" :size="14">
                            {{ item.label }}
                        </m-radio>
                    </div>
                </m-radio-group>
            </div>
        </div>
        <div v-if="model === '1' || model === 'all'" style="margin-bottom: 16px">
            <div class="text-wrap">
                <span>{{ i18n.global.t('meos_control_web.deadline') }}</span>
                <span class="icon"> *</span>
                <span v-if="showTips" class="tip">{{ i18n.global.t('meos_control_web.only_effective_for_auto_controlled_devices') }}</span>
            </div>
            <m-date-picker
                v-model="time"
                :width="280"
                :error-info="showError && pickerTimeError"
                type="datetime"
                :scope="scopeTime"
                :time-picker="{
                    stepM: 15,
                    format: 'hm'
                }"
                @change="timeChange"
            ></m-date-picker>
        </div>
        <div class="text-wrap">
            <span>{{ i18n.global.t('meos_control_web.reason') }}</span>
            <span class="icon"> *</span>
        </div>
        <m-input
            v-model="reasonValue"
            :type="'textarea'"
            :placeholder="i18n.global.t('common.placeholder_input')"
            :maxlength="100"
            :width="100"
            :height="140"
            show-word-limit
            style="resize: none"
            :error-text="showError && !reasonValue ? i18n.global.t('meos_control_web.input_required_check_error_4') : ''"
        >
        </m-input>
        <section class="btn-wrap">
            <m-button type="default" size="small" style="margin-right: 12px" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" size="small" :loading="loading" @click="save">{{ i18n.global.t('common.confirm') }}</m-button>
        </section>
    </div>
</template>
<script setup>
import { $Message } from 'meri-plus';
import dayjs from 'dayjs';
import { batchSetOperatingParameters } from '@/apis/common';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { getInputValue } from '../../utils';
import { NEW_CONTROL_SYSTEM } from '@/views/Common/EquipmentList/constants';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';

const emit = defineEmits(['cancel', 'save']);
const runningMonitorType = inject('runningMonitorType');
const { controlFn } = useGeneralControl();
const base = baseStore();

const props = defineProps({
    // 黄色提示文字
    showTips: {
        type: Boolean,
        default: () => false
    },
    objectIds: {
        type: Array,
        default: () => []
    },
    btnList: {
        type: Array,
        default: () => []
    },
    data: {
        type: Object,
        default: () => ({})
    },
    model: {
        type: String,
        default: ''
    }
});

const scopeTime = computed(() => {
    const dayjsTz = getDayjsTz();
    let bTime = dayjsTz.add(1, 'minute').format('YYYY.MM.DD HH:mm:ss');
    return bTime + '-3000.01.01';
});

// 时间
const time = ref('');

// 非枚举值参数
const inputValue = ref('');

// #是否枚举值
const isEnum = computed(() => {
    if (props.btnList?.length > 0) {
        const findItem = props.btnList.find(res => res.infoCode === props.data.infoCode);
        if (findItem) return findItem.isEnum;
        return false;
    }
    return false;
});

// eslint-disable-next-line vue/no-setup-props-destructure
const radioValue = ref(getInputValue(props?.data));

const radioOptions = computed(() => {
    let options = [];
    if (props.data?.dataSource?.length > 0) {
        options = props.data.dataSource.map(res => {
            return {
                label: res.name || res.infoCodeName,
                value: res.code
            };
        });
        return options;
    }
    if (options.length === 0 && props.data?.relInfoCodeConfigs?.dataSource?.length > 0) {
        options = props.data?.relInfoCodeConfigs?.dataSource?.map(res => {
            return {
                label: res.name || res.infoCodeName,
                value: res.code
            };
        });
        return options;
    }
    return options;
});
watch(
    radioOptions,
    v => {
        if (v?.length > 0) {
            radioValue.value = v[0].value;
        }
    },
    { immediate: true }
);

const loading = ref(false);

const showError = ref(false);
const pickerTimeError = ref('');
const reasonValue = ref('');

const timeChange = value => {
    if (!value) {
        showError.value = true;
    }
};
const formatTime = timeStr => {
    const newString = timeStr.replaceAll('.', '').replaceAll(':', '').replaceAll(' ', '').replaceAll('-', '');
    return newString.length === 14 ? newString : newString + '00';
};
const save = async () => {
    showError.value = true;
    if (!isEnum.value && !inputValue.value && inputValue.value !== 0) {
        return $Message.error({ title: i18n.global.t('meos_control_web.input_required_check_error_4') });
    }
    if (props.model === '1' || props.model === 'all') {
        if (!time.value) {
            pickerTimeError.value = i18n.global.t('meos_control_web.input_required_check_error_4');
            return $Message.error({ title: i18n.global.t('meos_control_web.input_required_check_error_4') });
        } else {
            if (dayjs(time.value).format('YYYY-MM-DD HH:mm') <= getDayjsTz().format('YYYY-MM-DD HH:mm')) {
                pickerTimeError.value = i18n.global.t('meos_control_web.date_check_error_1');
                return $Message.error({
                    title: i18n.global.t('meos_control_web.please_input_required')
                });
            } else {
                pickerTimeError.value = '';
            }
        }
    }
    if (!reasonValue.value) {
        return $Message.error({ title: i18n.global.t('meos_control_web.input_required_check_error_4') });
    }
    loading.value = true;
    const obj = {
        // 对象ID集合
        objectIds: props.objectIds,
        // 操作原因
        content: reasonValue.value
    };
    // 设定信息点编码
    if (isEnum.value) {
        obj.infoValue = radioValue.value;
        obj.infoCode = props.data?.relInfoCodeConfig?.infoCode ?? props.data?.infoCode;
    } else {
        obj.infoCode = props.data?.relInfoCodeConfig?.infoCode ?? props.data?.infoCode;
        // 设定值
        obj.infoValue = inputValue.value;
    }
    // 截止时间
    if (props.model === '1' || props.model === 'all' || props.data?.relInfoCodeConfig?.additionalMapValue?.recoveryDateTime) {
        obj.expireTime = formatTime(time.value);
    }
    try {
        loading.value = true;
        let responseData;
        if (NEW_CONTROL_SYSTEM.includes(runningMonitorType)) {
            await controlFn({
                data: {
                    projectId: base.projectId,
                    objectIds: obj.objectIds,
                    infoCode: obj.infoCode,
                    infoValue: obj.infoValue,
                    expireTime: obj.expireTime,
                    content: obj.content
                },
                callback: res => {
                    responseData = res;
                }
            });
        } else {
            responseData = await batchSetOperatingParameters(obj);
        }
        if (responseData.code === '00000') {
            $Message.success({ title: `${i18n.global.t('common.operation_success')}` });
            emit('save');
        } else {
            emit('save');
        }
    } catch (err) {
        loading.value = false;
    } finally {
        loading.value = false;
    }
};
const cancel = () => {
    emit('cancel');
};
</script>
<style lang="less" scoped>
.error-text {
    color: var(--red-500);
    font-size: 12px;
}
.manual-custom-wrap {
    padding: 16px 20px;
    .edit-title {
        color: var(--gray-900, #1b2129);
        font-feature-settings: 'clig' off, 'liga' off;

        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 24px; /* 150% */
        margin-bottom: 16px;
    }
    .input-list-wrap {
        width: 280px;
        .m-input-number {
            :deep(.suffix-text) {
                width: 76px;
                text-align: center;
            }
        }
    }
    .text-wrap {
        color: #646a73;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        margin-bottom: 8px;
        .icon {
            color: @red-500;
        }
        .tip {
            color: var(--orange-700, #e68600);
            font-feature-settings: 'clig' off, 'liga' off;
            font-family: 'Microsoft YaHei';
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            margin-left: 8px;
        }
    }
    .radio-group-list {
        width: 280px;
        margin-bottom: 4px;
        display: flex;
        .radio-list {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            .m-radio {
                margin-bottom: 12px;
            }
        }
    }
    .btn-wrap {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
</style>
