<template>
    <m-form-item :label="currentInfoCodeObject.paramsSetName || currentInfoCodeObject.name" prop="data" :rules="rules">
        <m-radio-group v-model="params.data">
            <div class="fc">
                <m-radio label="1" :size="14">{{ i18n.global.t('meos_control_web.cooling_mode') }}</m-radio>
                <m-radio label="2" :size="14">{{ i18n.global.t('meos_control_web.heating_mode') }}</m-radio>
            </div>
        </m-radio-group>
    </m-form-item>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';
import { decimalsForJudgment } from '@/utils/tools';
// 当前选中的信息点对象
const currentInfoCodeObject: any = inject('currentInfoCodeObject');
const params: any = inject('params');
const rules = ref<any[]>([]);
const validateNumber = (rule: any, value: number | string, callback: any) => {
    // eslint-disable-next-line prefer-template
    if (value === null || value === '') {
        callback(new Error(EMPTYTEXT));
    } else {
        if (decimalsForJudgment(value as number) > 2) {
            callback(new Error(i18n.global.t('meos_control_web.max_two_decimals_allowed')));
        } else {
            callback();
        }
    }
};

rules.value = [{ required: true, validator: validateNumber, trigger: ['blur', 'change'] }];
</script>
<style lang="less" scoped></style>
