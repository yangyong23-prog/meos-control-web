<template>
    <div class="operation-criterion-header">
        <div class="operation-criterion-header-title">{{ title }} {{ i18n.global.t('meos_control_web.project_operation_standard') }}</div>
        <div class="operation-criterion-header-divider" />
        <m-date-picker
            v-model="selectDate"
            simple-style
            :clearable="false"
            class="operation-criterion-header-datepicker"
            :scope="scope"
            :placeholder="i18n.global.t('meos_control_web.switch_date')"
            @change="dateChange"
        >
        </m-date-picker>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { defineEmits, ref, computed, defineProps } from 'vue';

const props = defineProps({
    date: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['dateChange']);
const selectDate = ref(props.date);
const title = computed(() => {
    if (selectDate.value) {
        return dayjs(selectDate.value).format('YYYY/MM/DD');
    }
    return getDayjsTz().format('YYYY/MM/DD');
});
const dateChange = val => {
    emit('dateChange', dayjs(val).format('YYYY-MM-DD'));
};
const scope = computed(() => {
    return `${getDayjsTz().subtract(30, 'day').format('YYYY.MM.DD')}-${getDayjsTz().add(30, 'day').format('YYYY.MM.DD')}`;
});
</script>
<style lang="less" scoped>
.operation-criterion-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: var(--header-height);
    white-space: nowrap;
    gap: 12px;
    .operation-criterion-header-title {
        font-size: 24px;
        font-weight: 700;
        line-height: 28.8px;
        text-align: right;
    }
    .operation-criterion-header-divider {
        width: 1px;
        height: 24px;
        background-color: #c4c9cf;
        display: block;
    }
}
</style>
<style lang="less">
.operation-criterion-header .operation-criterion-header-datepicker.m-date-picker {
    width: 140px;
    .m-date-picker__result.simple {
        flex-grow: 0;
        flex-shrink: 0;
        width: 100% !important;
        > svg {
            width: 16px !important;
            --svg-color: #246fe5 !important;
            --svg-hover-color: #246fe5 !important;
        }
    }
    .m-date-picker__result_text {
        width: 71px;
        display: inline-block;
        color: var(--blue-500, #246fe5) !important;
    }
    .m-date-picker__result.simple.clear {
        padding-right: 0;
    }
    .m-date-picker__result_text {
        color: var(--blue-500, #246fe5) !important;
    }
}
</style>
