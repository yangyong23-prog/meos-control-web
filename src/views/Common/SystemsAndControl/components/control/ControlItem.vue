<template>
    <div class="control-item">
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
            <InterfereTime
                v-if="interfereEndTime && manualAutoSetData === IS_MANUAL"
                :time="interfereEndTime"
                :data="data"
                :system-id="systemId"
                :console-types="consoleTypes"
                :system-class-code="systemClassCode"
            />
        </slot>
        <slot name="footer"></slot>
    </div>
</template>

<script setup>
import ArtificialOrAuto from './ArtificialOrAuto.vue';
import { IS_AUTO, IS_MANUAL } from '@/views/ACAC/variables';
import InterfereTime from './InterfereTime.vue';
import DockSingleton from '@/hooks/responsiveDock';
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
    },
    systemId: {
        type: String,
        default: ''
    },
    consoleTypes: {
        type: String,
        default: ''
    },
    systemClassCode: {
        type: String,
        default: ''
    }
});
const { getCustomInfo } = DockSingleton.getInstance();

const manualAutoSetData = computed(() => {
    const obj = getCustomInfo(props.data.id, props.consoleTypes, props.data.infoCode);
    return obj.manualAutoSet;
});
const interfereEndTime = computed(() => {
    const obj = getCustomInfo(props.data.id, props.consoleTypes, props.data.infoCode);
    return obj.interfereEndTime;
});
</script>
<style lang="less" scoped>
.control-item {
    padding: 8px;
    & + .control-item {
        position: relative;
        &::after {
            position: absolute;
            top: 0;
            content: '';
            display: block;
            height: 1px;
            width: calc(100% - 16px);
            background-color: var(--gray-200);
        }
    }
    &-icon {
        padding-top: 2px;
        align-self: start;
        margin-right: 4px;
    }
    &-main {
        width: calc(100% - 36px);
    }
}
</style>
