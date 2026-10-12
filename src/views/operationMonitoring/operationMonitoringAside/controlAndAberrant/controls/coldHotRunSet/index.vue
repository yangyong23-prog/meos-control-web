<template>
    <div v-for="item in runSet" :key="item.infoCode" class="set-item">
        <SetTitle :control-item="item" info-code="sysSwitchSet" />
        <SetValue v-if="item.infoCode !== 'sysSwitchSet'" :control-item="item" :content="i18n.global.t('meos_control_web.switch_setpoint_not_editable_when_off_or_no_data')" />
        <SetExtend v-if="item.extend && hasControls" :control-item="item" />
        <SetTime v-if="item.dataTime && hasControls" :control-item="item" />
    </div>
    <Popover ref="PopoverRef" @cancel="type => emits('cancel', type)" />
</template>

<script setup>
import i18n from '@/localization';
import Popover from './Popover.vue';
import SetTitle from './controlComponents/SetTitle.vue';
import SetValue from './controlComponents/SetValue.vue';
import SetExtend from './controlComponents/SetExtend.vue';
import SetTime from './controlComponents/SetTime.vue';

const PopoverRef = ref();
const hasControls = inject('hasControls');
const props = defineProps({
    runSet: {
        type: Array,
        default: () => []
    },
    isAiStrategy: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['cancel']);
const openControlPop = (e, item) => {
    if (PopoverRef.value) {
        PopoverRef.value.openControlPop(e, item);
    }
};
const runSets = ref(unref(props).runSet);

watch(
    () => props.runSet,
    () => {
        runSets.value = props.runSet;
    }
);
provide('runSet', runSets);
provide('openControlPop', openControlPop);
provide('TempTimeStrategy', 'ChillerTempTimeStrategy');
</script>
<style lang="less" scoped>
.set-item {
    max-height: 98px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 8px 0;
    & + .set-item {
        border-top: 1px dashed var(--gray-300);
    }
}
</style>
<style lang="less">
.control-time-pop.m-popover.m-flexible-overlay {
    --m-popover-padding: 20px 28px;
    --m-popover-border-radius: 8px;
}
</style>
