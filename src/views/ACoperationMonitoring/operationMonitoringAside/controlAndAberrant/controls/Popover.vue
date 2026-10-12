<template>
    <m-popover virtual-triggering :virtual-ref="controlTimePopRef" class="control-time-pop" trigger="manually" placement="left" :is-open="showControlTimePop">
        <template #content> <FormTime @cancel="closeControlTimePop" /> </template>
    </m-popover>
    <m-popover virtual-triggering :virtual-ref="controlPopRef" class="control-pop" trigger="manually" placement="left" :is-open="showControlPop">
        <template #content> <FormControl @cancel="closeControlPop" /> </template>
    </m-popover>
</template>

<script lang="ts" setup>
import FormControl from './FormControl.vue';
import FormTime from './FormTime.vue';
import { useControl } from './use-control';
const emits = defineEmits(['cancel']);
const { currentInfoCodeObject, controlPopRef, showControlPop, controlTimePopRef, showControlTimePop, openControlPop, closeControlPop, openControlTimePop, closeControlTimePop } =
    useControl(emits);
defineExpose({ openControlPop, openControlTimePop });
provide('currentInfoCodeObject', currentInfoCodeObject);
</script>
<style lang="less" scoped></style>
