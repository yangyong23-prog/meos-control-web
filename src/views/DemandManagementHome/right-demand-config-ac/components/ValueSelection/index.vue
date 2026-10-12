<template>
    <div class="value-sel-container">
        <ValueSelectionItem v-for="(code, idx) in itemList" :key="idx" :code="code" :is-edit="isEdit" :selected="isEdit && selectedCode === code" @select-item="selectItem(code)">
        </ValueSelectionItem>
    </div>
</template>

<script setup>
import i18n from '@/localization';
// 价值选择组件
import ValueSelectionItem from './ValueSelectionItem.vue';
import { VALUE_SELECTION_CODE } from '@/views/DemandManagementHome/constant/ac';

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    curSelect: {
        type: String,
        default: ''
    }
});

const selectedCode = ref('');

const itemList = computed(() => {
    if (props.isEdit) {
        return [VALUE_SELECTION_CODE.LOWEST_CAST, VALUE_SELECTION_CODE.LOWEST_CARBON_EMISSIONS, VALUE_SELECTION_CODE.LOWEST_ENERGY, VALUE_SELECTION_CODE.QUALITY_FIRST];
    } else {
        return [props.curSelect];
    }
});
const selectItem = code => {
    selectedCode.value = code;
};
const validate = () => {
    return {
        data: {
            valueSelectType: selectedCode.value
        }
    };
};
const getFormData = () => {
    return {
        valueSelectType: selectedCode.value
    };
};
onMounted(() => {
    selectedCode.value = props.isEdit ? props.curSelect || VALUE_SELECTION_CODE.QUALITY_FIRST : props.curSelect;
});

defineExpose({
    validate,
    getFormData
});
</script>

<style lang="less" scoped>
.value-sel-container {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    flex-wrap: wrap;
}
</style>
