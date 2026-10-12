<template>
    <m-form ref="Mform" label-width="200px" :model="params" label-position="top" require-asterisk-position="right">
        <m-form-item v-if="!currentInfoCodeObject.components" prop="data" :rules="rules" require-asterisk-position="none">
            <template #label>
                <m-tag size="small" color="#E68600" bg-color="#FFF0CC">{{ i18n.global.t('meos_control_web.manual1') }}</m-tag>
                &nbsp;{{ currentInfoCodeObject.name }}
            </template>
            <m-input-number
                v-model="params.data"
                text-align="left"
                :placeholder="i18n.global.t('common.placeholder_input')"
                controls="rightButton"
                class="has-btn-input-number"
                style="--width: 100%"
            >
                <template #suffix> {{ currentInfoCodeObject?.unit }} </template>
            </m-input-number>
        </m-form-item>
        <template v-for="item in currentInfoCodeObject.components" :key="item">
            <component :is="components[item]" :current-info-code-object="currentInfoCodeObject" />
        </template>
        <div style="text-align: left; padding-top: 6px">
            <m-button type="primary" size="small" :disabled="disabled" @click="sumbit"> {{ i18n.global.t('common.save') }} </m-button>
        </div>
    </m-form>
</template>

<script setup>
import i18n from '@/localization';
import { setOperatingParameters } from '@/apis/systemDiagram';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage, useErrorMessage } from '@/utils/tools';
import { getSystemRunningConditionInfo } from '@/views/ACoperationMonitoring/use-utils';
import EndTime from '../formComponents/EndTime.vue';
import ParamsRadio from '../formComponents/ParamsRadio.vue';
import Reason from '../formComponents/Reason.vue';
import { changeSystemRunningModel } from '@/apis/coolHot';
import { checkSystemRunningModelStatus } from '@/apis/systemDiagram';
import dayjs from 'dayjs';
const props = defineProps({
    currentInfoCodeObject: {
        type: Object,
        default: () => ({})
    },
    expireTime: String
});
const params = ref({
    data: unref(props).currentInfoCodeObject.dataValue,
    time: unref(props).currentInfoCodeObject.dataTime,
    reason: '',
    content: ''
});
const oldParams = ref({
    data: unref(props).currentInfoCodeObject.dataValue,
    time: unref(props).currentInfoCodeObject.dataTime,
    reason: '',
    content: ''
});
const components = ref({ Reason, EndTime, ParamsRadio });
const Mform = ref();
const rules = ref([]);
const emits = defineEmits(['close']);
const refreshSystemFun = inject('refreshSystemFun');
const disabled = computed(() => {
    return JSON.stringify(params.value) === JSON.stringify(oldParams.value);
});
const validateNumber = (rule, value, callback) => {
    // eslint-disable-next-line prefer-template
    if (value === null || value === '') {
        callback(new Error(EMPTYTEXT));
    } else {
        callback();
    }
};

rules.value = [{ required: true, validator: validateNumber, trigger: ['blur', 'change'] }];
const sumbit = () => {
    Mform.value.validate(valid => {
        if (valid) {
            if (props.currentInfoCodeObject.infoCode === 'hotCoolModel') {
                checkSystemRunningModelStatus({ systemId: systemId.value }).then(res => {
                    if (res.code === SUCCESSCODE && res.data) {
                        changeSystemRunningModel({
                            systemId: systemId.value,
                            model: params.value.data,
                            expireTime: dayjs(params.value.time).format('YYYYMMDDHHmmss'),
                            operateType: params.value.reason,
                            contentInfo: params.value.content
                        }).then(res => {
                            if (res.code === SUCCESSCODE) {
                                useSuccessMessage(i18n.global.t('meos_control_web.switch_success'));
                                emits('close');
                                refreshSystemFun();
                            }
                        });
                    } else {
                        useErrorMessage(i18n.global.t('meos_control_web.switch_fail'));
                    }
                });
            } else {
                updateRuningOperationFun();
            }
        }
    });
};
// 系统id
const systemId = inject('systemId', ref(''));
const systemRunningConditionInfo = inject('systemRunningConditionInfo');
const updateRuningOperationFun = () => {
    const data = {
        objectId: systemId.value,
        systemId: systemId.value,
        pointInfos: [
            {
                value: params.value.data,
                content: params.value.reason,
                infoCode: props.currentInfoCodeObject.infoCode,
                beforeModify: props.currentInfoCodeObject.dataValue
            }
        ]
    };
    setOperatingParameters(data).then(res => {
        if (res.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('meos_control_web.settings_saved_success'));
            getSystemRunningConditionInfo(systemId.value, systemId.value, val => {
                systemRunningConditionInfo.value = val;
            });
            emits('close');
        }
    });
};
provide('currentInfoCodeObject', unref(props).currentInfoCodeObject);
provide('params', params);
watch(
    () => [props.currentInfoCodeObject.dataTime, props.currentInfoCodeObject.dataValue],
    () => {
        params.value.time = props.currentInfoCodeObject.dataTime;
        oldParams.value.time = props.currentInfoCodeObject.dataTime;
        params.value.data = props.currentInfoCodeObject.dataValue;
        oldParams.value.data = props.currentInfoCodeObject.dataValue;
    }
);
</script>
<style lang="less" scoped></style>
