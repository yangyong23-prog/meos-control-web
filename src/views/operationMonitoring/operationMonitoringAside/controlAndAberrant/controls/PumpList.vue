<template>
    <div v-for="item in listFixedTimeStrategyList" :key="item.id" class="pump-list-item" @mouseover="mouseShow(item)" @mouseleave="e => mouseHide(e, item)">
        <div v-ellipsis class="pump-list-item-title m-ellipsis">{{ item.name }}</div>
        <div class="pump-list-item-content">
            <div v-for="val in item.infoCodes" :key="val.infoCode" class="pump-list-item-content-box">
                <SetTitle :control-item="val" info-code="enableCtrl" />
                <SetValue
                    v-if="val.infoCode !== 'enableCtrl'"
                    :control-item="val"
                    :content="i18n.global.t('meos_control_web.pump_group_off_cannot_edit')"
                    actual-value-width="130px"
                    setting-value-width="110px"
                />
                <SetExtend v-if="val.extend && hasControls" :control-item="val" />
                <SetTime v-if="val.dataTime && hasControls" :control-item="val" />
            </div>
        </div>
    </div>
    <Empty v-if="listFixedTimeStrategyList.length === 0" :text="i18n.global.t('common.no_data')" width="90px" height="76px" />
    <Popover ref="PopoverRef" @cancel="(type: any) => emits('cancel', type)" />
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import Empty from '@/components/common/Empty.vue';
import { IOTObject, Strategy } from './types';
import Popover from './Popover.vue';
import SetTitle from './controlComponents/SetTitle.vue';
import SetValue from './controlComponents/SetValue.vue';
import SetTime from './controlComponents/SetTime.vue';
import SetExtend from './controlComponents/SetExtend.vue';
import i18n from '@/localization';

defineProps({
    listFixedTimeStrategyList: {
        type: Array as PropType<Strategy[]>,
        default: () => []
    },
    type: Boolean
});
const hasControls: any = inject('hasControls');
const emits = defineEmits(['cancel']);
const PopoverRef = ref();
const timer = ref<any>(null);
const relationChartComponent: any = inject('relationChartComponent');
const openControlPop = (e: { target: any }, item: IOTObject) => {
    if (PopoverRef.value) {
        PopoverRef.value.openControlPop(e, item);
    }
};
const mouseShow = (item: any) => {
    const arr: any = [];
    clearTimeout(timer.value);
    item.runningPlan?.equipmentList?.forEach((i: any) => {
        arr.push(i.id);
    });
    timer.value = setTimeout(() => {
        relationChartComponent.value?.shakeName(arr);
    }, 500);
};
const mouseHide = (e: Event, item: any) => {
    clearTimeout(timer.value);
    timer.value = null;
    relationChartComponent.value?.clearShakeName();
};
provide('openControlPop', openControlPop);
provide('TempTimeStrategy', 'TempTimeStrategy');
</script>
<style lang="less" scoped>
.pump-list-item {
    &:first-child {
        margin-top: 0;
    }
    &:last-child {
        margin-bottom: 16px;
    }
    &-title {
        font-weight: 700;
    }
    &-content {
        width: 100%;
        &-box {
            max-height: 98px;
            padding: 12px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            & + .pump-list-item-content-box {
                border-top: 1px dashed var(--gray-300);
            }
        }
    }
}
.pump-list-item:hover {
    border: 1px solid var(--blue-500, #246fe5) !important;
}
</style>
