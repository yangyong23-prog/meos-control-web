<template>
    <div class="temperature">
        <div :class="['temperature-item', rightConfigExpand ? 'f mh96 w70' : 'mh96 w100']">
            <div v-if="rightConfigExpand && isName" style="width: 100px">{{ i18n.global.t('meos_control_web.co2_standard') }}</div>
            <CO2Bar :list="CO2BarList" :right-config-expand="rightConfigExpand" />
        </div>
        <slot></slot>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { rightConfigExpandInjectKey } from '../constant/injectKey';
import CO2Bar from './CO2Bar.vue';
const rightConfigExpand = inject(rightConfigExpandInjectKey);

const props = defineProps({
    dataObj: {
        type: Object,
        default: () => {}
    },
    isName: {
        type: Boolean,
        default: true
    }
});

const CO2BarList = computed(() => {
    return [
        {
            name: `CO<sub>2</sub>${i18n.global.t('meos_control_web.comfort_zone_upper')}`,
            value: props.dataObj.carbonDioxideLimitValue
        },
        {
            name: `CO<sub>2</sub>${i18n.global.t('meos_control_web.high_threshold')}`,
            value: props.dataObj.carbonDioxideUpperLimitValue
        }
    ];
});
</script>
<style lang="less" scoped>
.temperature {
    background: var(--gray-50, #f7f9fa);
    padding: 0px 12px;
    .box-line {
        position: relative;
        &-item {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background-color: transparent;
            z-index: 2;
        }
    }
    .temperature-item {
        // width: 100%;
        padding: 12px 0px;
        flex: 1;
    }
    .w70 {
        width: 70%;
    }
    .w100 {
        width: 100%;
    }
    .mh96 {
        min-height: 96px;
    }
    .mh128 {
        min-height: 128px;
    }
    .temperature-item:not(:last-child) {
        border-bottom: 1px dashed #e1e5eb;
    }
    .temperature-bar {
        width: 100%;
        height: 12px;
        border-radius: 4px;
        background: linear-gradient(90deg, #8edbab 0%, #8edbab 15.12%, #f55047 61.84%);
        position: relative;
    }
    .get-line-box {
        width: 100%;
        height: 100%;
    }
    .get-line-white {
        height: 8px;
        width: 2px;
        background-color: white;
        border-radius: 4px;
    }
    .h64 {
        height: 64px;
    }
}
</style>
