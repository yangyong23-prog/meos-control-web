<template>
    <m-form-item v-if="show" :label="data.name" :prop="data.infoCode" :rules="rules">
        <m-input v-model="params[data.infoCode]" v-bind="data.componentAttrs" />
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
const rules = ref(props.data.rules || [{ required: props.data.required, message: EMPTYTEXT, trigger: [] }]);
</script>
<style lang="less" scoped></style>
