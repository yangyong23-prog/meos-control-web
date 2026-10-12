<template>
    <m-form-item :label="data.infoCodeName" :prop="data.infoCode" :rules="rules">
        <m-input-number
            v-model="params[data.infoCode]"
            text-align="left"
            :placeholder="i18n.global.t('common.placeholder_input')"
            controls="rightButton"
            :precision="data.precision || 1"
            :min="min"
            :max="max"
            style="--width: 100%"
        >
            <template #suffix> {{ data.unit ?? itemData?.unit ?? unit }} </template>
        </m-input-number>
    </m-form-item>
</template>

<script setup>
import i18n from '@/localization';
import { EMPTYTEXT } from '@/utils/globalVariables';
import { paramsKey } from '@/views/ACAC/hooks/useSetFormHook';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    controlListData: {
        type: Array,
        default: () => []
    },
    unit: {
        type: String,
        default: ''
    },
    noRequired: {
        type: Boolean,
        default: false
    },
    min: {
        type: Number,
        default: undefined
    },
    max: {
        type: Number,
        default: undefined
    },
    precision: {
        type: Number,
        default: 1
    }
});
const itemData = computed(() => {
    return props.controlListData.find(item => item.infoCode === props.data.infoCode) || {};
});
const params = inject(paramsKey);
const rules = ref([{ type: 'number', required: props.data.noRequired ? false : true, message: EMPTYTEXT, trigger: [] }]);
</script>
<style lang="less" scoped></style>
