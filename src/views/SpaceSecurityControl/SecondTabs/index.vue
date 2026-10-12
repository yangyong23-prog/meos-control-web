<template>
    <div class="second-tabs">
        <m-tabs v-model="curModel" class="tabs" :data="type === 'space' ? SECOND_BAR_TABS_SPACE : SECOND_BAR_TABS" size="large"> </m-tabs>
    </div>
</template>

<script setup>
import { SECOND_BAR_TABS, SECOND_BAR_TABS_SPACE } from '../constants/index';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['update:modelValue', 'change']);
const curModel = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});
</script>

<style lang="less" scoped>
.second-tabs {
    position: absolute;
    bottom: -1px;
    left: 12px;
}
</style>
