<template>
    <m-form-item :label="data.name" :prop="data.infoCode" :rules="rules" class="FormItemRadio">
        <m-radio-group v-model="params[data.infoCode]" cancel v-bind="data.componentAttrs">
            <m-radio v-for="item in data.dataSource" :key="item.code" :label="item.code" :size="14" style="margin-right: 10px"> {{ item.name }}</m-radio>
        </m-radio-group>
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
const rules = ref(props.data.rules || [{ required: props.data.required, message: EMPTYTEXT, trigger: [] }]);
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
