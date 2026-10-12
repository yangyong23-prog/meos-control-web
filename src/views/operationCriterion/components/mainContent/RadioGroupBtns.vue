<template>
    <div class="ocg-radio-group-btns">
        <RadioGroupBtn
            v-for="(rule, index) in rules"
            :key="index"
            :rule="rule"
            :selected="hasChartData ? selectValue === index : false"
            :selectable="hasChartData"
            :show-title="showTitle"
            :type="type"
            @click="hasChartData ? onSelectChange(index) : null"
        />
    </div>
</template>
<script setup>
import { hasChartDataKey } from '../../constant';
import RadioGroupBtn from './RadioGroupBtn.vue';

const hasChartData = inject(hasChartDataKey);
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
    rules: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: ''
    },
    showTitle: {
        type: Boolean,
        default: true
    }
});
const selectValue = ref(0);
watch(
    () => props.modelValue,
    newValue => {
        selectValue.value = newValue;
    }
);
const onSelectChange = item => {
    console.log(item, selectValue.value);
    if (item === selectValue.value) {
        emit('change', null);
        emit('update:modelValue', null);
        selectValue.value = null;
    } else {
        emit('change', item);
        emit('update:modelValue', item);
        selectValue.value = item;
    }
};
</script>
<style lang="less" scoped>
.ocg-radio-group-btns {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    flex-direction: row;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
</style>
