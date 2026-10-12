<template>
    <m-popover virtual-triggering :virtual-ref="controlTimePopRef" class="control-time-pop" trigger="manually" placement="left" :is-open="showControlTimePop">
        <template #content> <FormTime @cancel="closeControlTimePop" /> </template>
    </m-popover>
    <m-popover virtual-triggering :virtual-ref="controlPopRef" class="control-pop" trigger="manually" placement="left" :is-open="showControlPop">
        <template #content> <FormControl @cancel="closeControlPop" /> </template>
    </m-popover>
</template>

<script setup>
import FormControl from './FormControl.vue';
import FormTime from './FormTime.vue';
import useColdHotControl from './useColdHotControl';
const emits = defineEmits(['cancel']);
const { currentInfoCodeObject, controlPopRef, showControlPop, controlTimePopRef, showControlTimePop, openControlPop, closeControlPop, openControlTimePop, closeControlTimePop } =
    useColdHotControl(emits);
defineExpose({ openControlPop, openControlTimePop });
provide('currentInfoCodeObject', currentInfoCodeObject);
</script>
<style lang="less" scoped></style>
