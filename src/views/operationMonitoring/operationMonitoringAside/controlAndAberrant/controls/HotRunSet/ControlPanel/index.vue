<template>
    <div v-for="item in runSet" :key="item.infoCode" class="set-item">
        <SetTitle :control-item="item" info-code="sysSwitchSet" />
        <SetValue v-if="item.infoCode !== 'sysSwitchSet'" :control-item="item" :content="i18n.global.t('meos_control_web.heat_station_switch_must_be_on')" />
        <SetExtend v-if="item.extend" :control-item="item" />
        <SetTime v-if="item.dataTime && hasControls" :control-item="item" />
    </div>
    <Popover ref="PopoverRef" @cancel="type => emits('cancel', type)" />
</template>

<script setup>
import i18n from '@/localization';
import SetTitle from '../../hotControlComponents/SetTitle.vue';
import SetValue from '../../hotControlComponents/SetValue.vue';
import SetTime from '../../hotControlComponents/SetTime.vue';
import SetExtend from '../../hotControlComponents/SetExtend.vue';
import Popover from './Popover.vue';

const PopoverRef = ref();
const hasControls = inject('hasControls');
const props = defineProps({
    runSet: {
        type: Array,
        default: () => []
    }
});

const openControlPop = (e, item, type) => {
    if (PopoverRef.value) {
        PopoverRef.value.openControlPop(e, item, type);
    }
};

provide('openControlPop', openControlPop);
</script>
<style lang="less" scoped>
.set-item {
    &:first-child {
        // padding-top: 0;
    }
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
