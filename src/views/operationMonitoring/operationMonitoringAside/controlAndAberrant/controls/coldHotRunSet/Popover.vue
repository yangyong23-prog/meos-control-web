<template>
    <m-popover
        virtual-triggering
        :virtual-ref="controlTimePopRef"
        :z-index="Z_INDEX.controlPop"
        class="control-time-pop"
        trigger="manually"
        placement="left-start"
        :is-open="showControlTimePop"
    >
        <template #content> <FormTime @cancel="closeControlTimePop" /> </template>
    </m-popover>
    <m-popover
        virtual-triggering
        :virtual-ref="controlPopRef"
        :z-index="Z_INDEX.controlPop"
        class="control-pop"
        trigger="manually"
        placement="left-start"
        :is-open="showControlPop"
    >
        <template #content> <FormControl @cancel="closeControlPop" /> </template>
    </m-popover>
</template>

<script setup>
import { Z_INDEX } from '@/constants/zIndex';
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
