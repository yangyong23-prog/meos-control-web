<template>
    <m-form-item :label="data.infoCodeName" :prop="data.infoCode" :rules="rules">
        <m-date-picker
            v-model="params[data.infoCode]"
            clearable
            type="datetime"
            :placeholder="i18n.global.t('meos_control_web.select_date')"
            :scope="space"
            :scope-disabled-tips-text="tips"
            :time-picker="{
                stepM: 5,
                format: 'hm'
            }"
        ></m-date-picker>
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT, getDayjsTz } from '@/utils/globalVariables';
import { paramsKey } from '@/views/ACAC/hooks/useSetFormHook';
import { INFO_EXTEND, IS_AUTO } from '@/views/ACAC/variables';
import dayjs from 'dayjs';
import DockSingleton from '@/hooks/responsiveDock';
import { getNextFiveMinutePoint, validateLessNow } from '@/utils/tools';
import { computed } from 'vue';
const { getInfoExtend } = DockSingleton.getInstance();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    id: {
        type: String,
        default: ''
    },
    currentInfoCode: {
        type: String,
        default: ''
    },
    isClear: {
        type: Boolean,
        default: false
    },
    unlimitTimeRange: {
        type: Boolean,
        default: false
    },
    selectData: {
        type: Object,
        default: () => ({})
    }
});

const space = ref('');
const params = inject(paramsKey);
const rules = ref([
    { required: true, message: EMPTYTEXT, trigger: [] },
    {
        validator: (_value, _rule, callback) => validateLessNow(params.value[props.data.infoCode], callback, i18n.global.t('meos_control_web.past_connot_sel')),
        trigger: []
    }
]);

const tips = computed(() => {
    if (props.unlimitTimeRange) {
        return i18n.global.t('meos_control_web.future_time_only');
    } else {
        return i18n.global.t('meos_control_web.only_3_days_range_allowed');
    }
});

onMounted(() => {
    const obj = getInfoExtend(props.id, props.currentInfoCode, INFO_EXTEND);
    let time = props.selectData.time || obj.interfereEndTime;
    if (props.data.infoCode === 'BASE_DUAL' && props.data.consoleType) {
        time = obj[props.data.consoleType].interfereEndTime;
    }
    params.value[props.data.infoCode] = props.isClear ? '' : time ? dayjs(time).format('YYYY.MM.DD HH:mm') : '';
    if (props.unlimitTimeRange) {
        space.value = `${getNextFiveMinutePoint()}-${getDayjsTz().add(99, 'year').format('YYYY.MM.DD 00:00:00')}`;
    } else {
        space.value = `${getNextFiveMinutePoint()}-${getDayjsTz().add(2, 'day').format('YYYY.MM.DD 00:00:00')}`;
    }
});
</script>
<style lang="less" scoped></style>
