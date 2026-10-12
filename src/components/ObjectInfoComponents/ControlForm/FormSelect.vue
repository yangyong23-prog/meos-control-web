<template>
    <m-form-item :label="data.name" :prop="data.infoCode" :rules="rules" class="FormItemRadio">
        <m-select v-model="params[data.infoCode]" :options="getOptions()" v-bind="data.componentAttrs"> </m-select>
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
const rules = ref(props.data.rules || [{ required: props.data.required, message: EMPTYTEXT, trigger: 'change' }]);
const getOptions = () => {
    if (props.data.options) {
        return props.data.options;
    }
    return props.data.dataSource.map(item => ({
        id: item.code,
        name: item.name
    }));
};
</script>
<style lang="less" scoped>
.FormItemRadio {
    :deep(.m-form-item__content) {
        padding-top: 4px;
        min-height: auto;
        gap: 8px 0;
    }
}
</style>
