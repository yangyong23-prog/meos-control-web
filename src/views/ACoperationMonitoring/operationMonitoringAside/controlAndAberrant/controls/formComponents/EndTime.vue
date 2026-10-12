<template>
    <m-form-item
        :label="i18n.global.t('meos_control_web.deadline')"
        prop="time"
        :rules="[
      { required: true, message: EMPTYTEXT, trigger: 'change' },
      { validator:
        (value: any, rule: any, callback: any) => validateLessNow(params.time, callback), trigger: 'change' }
    ]"
    >
        <m-date-picker
            v-model="params.time"
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
import { Ref } from 'vue';
const params: Ref<{ time: string }> = inject('params', ref({ time: '' }));
const scope = ref(`${setScope(5)}-${getDayjsTz().add(2, 'day').format('YYYY.MM.DD 00:00:00')}`);

const changeDate = () => {
    const da = dayjsIsAfter(dayjs(params.value?.time), getDayjsTz().add(2, 'day').format('YYYY-MM-DD 00:00:00'));
    if (da && params.value) {
        params.value.time = getDayjsTz().add(2, 'day').format('YYYY.MM.DD 00:00');
    }
};
</script>
<style lang="less" scoped></style>
