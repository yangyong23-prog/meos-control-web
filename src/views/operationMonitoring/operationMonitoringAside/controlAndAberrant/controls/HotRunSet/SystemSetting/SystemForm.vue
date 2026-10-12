<template>
    <m-form ref="Mform" :rules="rules" :model="params" require-asterisk-position="right" label-position="top" class="hot-settings-form">
        <div class="fc mb5">
            <m-tag color="#E68600" bg-color="#FFF0CC" size="small" class="mr4">{{ i18n.global.t('meos_control_web.manual1') }}</m-tag>
            <div style="position: relative">
                <p class="name">{{ currentInfoCodeObject.aliasName ? currentInfoCodeObject.aliasName : currentInfoCodeObject.name }}</p>
            </div>
        </div>
        <m-form-item prop="data">
            <m-input-number v-model="params.data" width="240px" precision="1" text-align="left" :placeholder="i18n.global.t('common.placeholder_input')" controls="rightButton">
                <template #suffix> {{ currentInfoCodeObject?.unit }} </template>
            </m-input-number>
            <!-- <m-input v-model="params.setValue"></m-input> -->
        </m-form-item>
        <div class="mt16">
            <m-button type="primary" size="small" @click="sumbit"> {{ i18n.global.t('common.save') }} </m-button>
        </div>
    </m-form>
</template>

<script setup>
import i18n from '@/localization';
import { useSuccessMessage, useErrorMessage } from '@/utils/tools';
import { setOperatingParameters } from '@/apis/systemDiagram';
import { EMPTYTEXT, SUCCESSCODE } from '@/utils/globalVariables';
import emitter from '@/utils/bus';
import { isNil, toNumber } from 'lodash';
const props = defineProps({
    currentInfoCodeObject: {
        type: Object,
        default: () => {}
    }
});
const openLoading = inject('openLoading');
const rules = ref({
    data: [{ type: 'number', required: true, message: i18n.global.t('meos_control_web.input_required_check_error_4'), trigger: ['blur'] }]
});
const params = ref({
    data: unref(props).currentInfoCodeObject.dataValue
});
watch(
    () => props?.currentInfoCodeObject,
    (newUser, oldUser) => {
        params.value.data = toNumber(newUser.dataValue);
    },
    { deep: true, immediate: true }
);
const Mform = ref(null);
// 系统id
const systemId = inject('systemId', ref(''));
const querySettingInfoCodeConfigByObjectIds = inject('querySettingInfoCodeConfigByObjectIds');
const sumbit = () => {
    Mform.value.validate(valid => {
        if (valid) {
            updateRuningOperationFun();
        } else {
            useErrorMessage(i18n.global.t('meos_control_web.input_required_check_error_4'));
        }
    });
};
const updateRuningOperationFun = () => {
    // openLoading();
    let defaultParams = {
        value: params.value.data,
        infoCode: props.currentInfoCodeObject.infoCode,
        beforeModify: props.currentInfoCodeObject.dataValue
    };
    const data = {
        objectId: systemId.value,
        systemId: systemId.value,
        pointInfos: [defaultParams]
    };
    setOperatingParameters(data).then(res => {
        if (res.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('common.save_success'));
            emitter.emit('refreshNotify', 'query');
            // querySettingInfoCodeConfigByObjectIds();
        }
    });
};
</script>
<style lang="less" scoped>
.hot-settings-form {
    padding: 8px 12px;
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    .name {
        &::before {
            display: inline-block;
            position: absolute;
            width: 7px;
            right: -8px;
            content: '*';
            color: #f55047;
            font-size: 10px;
        }
    }
}
</style>
