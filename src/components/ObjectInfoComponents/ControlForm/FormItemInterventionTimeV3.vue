<template>
    <m-form-item
        :label="i18n.global.t('meos_control_web.deadline')"
        :prop="data.infoCode"
        :rules="[
      { required: true, message: EMPTYTEXT, trigger: 'change' },
      { validator:
        (value: any, rule: any, callback: any) => validateLessNow(params[data.infoCode], callback), trigger: 'change' }
    ]"
    >
        <m-date-picker
            v-model="params[data.infoCode]"
            type="datetime"
            placement="bottomRight"
            :placeholder="i18n.global.t('meos_control_web.please_select')"
            :scope="scope"
            :time-picker="{
                stepM: 5,
                format: 'hm'
            }"
            @change="changeDate"
        />
    </m-form-item>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import { dayjsIsAfter } from '@/utils/dayjsTools';
import { EMPTYTEXT, getDayjsTz } from '@/utils/globalVariables';
import { setScope, validateLessNow } from '@/utils/tools';
import dayjs from 'dayjs';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    params: {
        type: Object,
        default: () => ({})
    }
});
const scope = ref(`${setScope(5)}-${getDayjsTz().add(2, 'day').format('YYYY.MM.DD 00:00:00')}`);

const changeDate = () => {
    const da = dayjsIsAfter(dayjs(props.params[props.data.infoCode]), getDayjsTz().add(2, 'day').format('YYYY-MM-DD 00:00:00'));
    if (da && props.params) {
        props.params[props.data.infoCode] = getDayjsTz().add(2, 'day').format('YYYY.MM.DD 00:00');
    }
};
</script>
<style lang="less" scoped></style>
