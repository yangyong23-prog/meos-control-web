<template>
    <m-form-item v-if="show" :label="data.name" :prop="data.infoCode" :rules="hideDom ? [] : rules">
        <m-input-number v-model="params[data.infoCode]" text-align="left" controls="rightButton" width="100%" :class="{ noUnit: !data.unit }" v-bind="data.componentAttrs">
            <template #suffix> {{ data.unit }} </template>
        </m-input-number>
    </m-form-item>
</template>

<script setup>
import { EMPTYTEXT } from '@/utils/globalVariables';
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
const show = computed(() => {
    if (props.data.showFilter) {
        return props.data.showFilter(props.params);
    }
    return true;
});
const rules = ref(props.data.rules || [{ type: 'number', required: props.data.required, message: EMPTYTEXT, trigger: [] }]);
</script>
<style lang="less">
.m-input-number.noUnit .suffix-text {
    display: none;
}
</style>
