<template>
    <m-popover virtual-triggering :virtual-ref="controlTimePopRef" class="control-time-pop" trigger="manually" placement="bottom" :is-open="showControlTimePop">
        <template #content>
            <FormTime @cancel="closeControlTimePop" />
        </template>
    </m-popover>
    <m-popover
        ref="popoverRef"
        virtual-triggering
        :virtual-ref="controlPopRef"
        class="control-pop"
        trigger="manually"
        placement="bottom"
        :is-open="showControlPop"
        @click-event="clickEvent"
    >
        <template #content>
            <FormControl @cancel="closeControlPop" />
        </template>
    </m-popover>
</template>

<script lang="ts" setup>
import FormControl from './FormControl.vue';
import FormTime from './FormTime.vue';
import { useControl } from '../../use-control';
const emits = defineEmits(['cancel']);
const {
    currentInfoCodeObject,
    controlPopRef,
    showControlPop,
    controlTimePopRef,
    showControlTimePop,
    openControlPop,
    closeControlPop,
    openControlTimePop,
    closeControlTimePop,
    dataType,
    clickEvent
} = useControl(emits);
const popoverRef = inject('popoverRef');
defineExpose({ openControlPop, openControlTimePop });
provide('currentInfoCodeObject', currentInfoCodeObject);
provide('dataType', dataType);
</script>
<style lang="less" scoped></style>
