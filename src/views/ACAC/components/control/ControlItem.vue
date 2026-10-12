<template>
    <div class="control-item" :class="classArr">
        <div class="control-item-box fc">
            <div v-if="showArtificialOrAuto" class="control-item-icon">
                <!-- 运行状态不需要显示自动人工 -->
                <ArtificialOrAuto v-if="data.infoCode !== 'runStatus'" :is-auto="manualAutoSetData === IS_AUTO" />
            </div>
            <div class="control-item-main">
                <slot :manual-auto-set-data="manualAutoSetData" />
            </div>
        </div>
        <slot name="time">
            <InterfereTime v-if="interfereEndTime && manualAutoSetData === IS_MANUAL" :time="interfereEndTime" :data="data" />
        </slot>
        <slot name="footer"></slot>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import ArtificialOrAuto from './ArtificialOrAuto.vue';
import { INFO_EXTEND, IS_AUTO, IS_MANUAL } from '@/views/ACAC/variables';
import InterfereTime from './InterfereTime.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { isNil, toString } from 'lodash';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    },
    noBg: {
        type: Boolean,
        default: false
    },
    showArtificialOrAuto: {
        type: Boolean,
        default: true
    }
});
const classArr = computed(() => {
    const arr = [props.data?.type, props.data?.isGroup ? 'isGroup' : ''];
    if (props.noBg) {
        arr.push('no-bg');
    }
    return arr;
});
const { getInfoExtend } = DockSingleton.getInstance();
const manualAutoSetData = computed(() => {
    const obj = getInfoExtend(props.data.id, props.data.infoCode, INFO_EXTEND);
    let manual = obj.manualAutoSet;
    if (props.data.infoCode === 'BASE_DUAL' && props.data.consoleType) {
        manual = obj[props.data.consoleType].manualAutoSet;
    }
    if (!isNil(manual)) {
        return toString(manual);
    }
    return manual;
});
const interfereEndTime = computed(() => {
    const obj = getInfoExtend(props.data.id, props.data.infoCode, INFO_EXTEND);
    let time = obj.interfereEndTime;
    if (props.data.infoCode === 'BASE_DUAL' && props.data.consoleType) {
        time = obj[props.data.consoleType].interfereEndTime;
    }
    return time;
});
</script>
<style lang="less" scoped>
.control-item {
    background-color: var(--gray-50);
    border-radius: 8px;
    padding: 8px;
    &.coolingSupplySwitchSet {
        background-color: var(--gray-100);
    }
    &.coolingStorageSwitchSet {
        background-color: var(--gray-100);
    }
    &.airConditionDemand {
        background-color: var(--gray-100);
    }
    &.no-bg {
        background-color: transparent;
    }

    & + .control-item {
        margin-top: 8px;
    }
    &.isGroup {
        position: relative;
        &::before {
            position: absolute;
            content: '';
            display: block;
            width: calc(100% - 16px);
            height: 1px;
            background-color: var(--gray-200);
            left: 8px;
            bottom: 0;
        }
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }
    &.manualAutoSet {
        & + .control-item.manualAutoSet {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            margin-top: 0;
        }
    }
    &.enableCtrl {
        & + .control-item.enableCtrl {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            margin-top: 0;
        }
    }
    &.CoolerControl {
        & + .control-item.CoolerControl {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            margin-top: 0;
        }
    }
    &.InputControl {
        & + .control-item.InputControl {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            margin-top: 0;
        }
    }
    &.SwitchControl {
        &::before {
            display: none;
        }
    }
    &-icon {
        padding-top: 2px;
        align-self: start;
        margin-right: 4px;
    }
    &-box {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    &-main {
        width: calc(100% - 36px);
        flex: 1;
        min-width: 0;
    }
}
</style>
