<template>
    <div class="temperature">
        <div v-for="(item, indexs) in props.temperatureList" :key="indexs" :class="['temperature-item', rightConfigExpand ? 'f mh96 w100' : 'mh128 w100']">
            <div style="width: 100px">{{ enumSeason[item.airSeason] }}</div>
            <TemperatureBar :list="itemConvert(item)" />
        </div>
        <slot></slot>
    </div>
</template>
<script setup>
import { rightConfigExpandInjectKey } from '../constant/injectKey';
import TemperatureBar from './TemperatureBar.vue';
import i18n from '@/localization';
const rightConfigExpand = inject(rightConfigExpandInjectKey);

const enumSeason = {
    AirSummer: i18n.global.t('meos_control_web.summer'),
    AirSummerPeak: i18n.global.t('meos_control_web.summer_peak'),
    AirWinter: i18n.global.t('meos_control_web.winter'),
    AirSeasonSpring: i18n.global.t('meos_control_web.transition_spring_alt'),
    AirSeasonAutumn: i18n.global.t('meos_control_web.transition_autumn')
};

const itemConvert = item => [
    { name: i18n.global.t('meos_control_web.temperature_overcold_threshold'), value: item.underCoolingSeasonLimitValue },
    { name: i18n.global.t('meos_control_web.temperature_comfort_zone_lower'), value: item.lowerComfortSeasonLimitValue },
    { name: i18n.global.t('meos_control_web.temperature_comfort_zone_upper'), value: item.upperComfortSeasonLimitValue },
    { name: i18n.global.t('meos_control_web.temperature_overheat_threshold'), value: item.overHeatingSeasonLimitValue }
];

const props = defineProps({
    temperatureList: {
        type: Array,
        default: () => []
    },
    isType: {
        type: Boolean,
        default: false
    }
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
            width: 100%;
            height: 100%;
            background-color: transparent;
            z-index: 2;
        }
    }
    .temperature-item {
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
        background: linear-gradient(90deg, #246fe5 6.88%, #8edbab 37.44%, #8edbab 63.8%, #f55047 93.17%);
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
