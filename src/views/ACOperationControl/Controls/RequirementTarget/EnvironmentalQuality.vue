<template>
    <div class="standard-container">
        <div class="title">
            <span>{{ i18n.global.t('meos_control_web.temp_criterion') }}</span>
            <PopoverIcon :type="'target'" :name="'temperature'" :theme="'darkTransparent'" :width="'336px'" />
        </div>
        <TemperatureOrRH :data="tQuality" :type="'tdb'" />
        <div class="title">
            <span>CO<sub>2</sub>{{ i18n.global.t('meos_control_web.standard') }}</span>
            <PopoverIcon :type="'target'" :name="'co2'" :theme="'darkTransparent'" :width="'336px'" />
        </div>
        <CO2 :quality="quality" />
        <div v-if="showRhData" class="title">
            <span>{{ i18n.global.t('meos_control_web.humidity_standard') }}</span>
            <PopoverIcon :type="'target'" :name="'rh'" :theme="'darkTransparent'" :width="'336px'" />
        </div>
        <TemperatureOrRH v-if="showRhData" :data="rhDataQuality" :type="'rh'" />

        <div v-if="showPressureDiff" class="title">
            <span>{{ i18n.global.t('meos_control_web.pressure_diff_standard') }}</span>
            <PopoverIcon :type="'target'" :name="'pressureDiff'" :theme="'darkTransparent'" :width="'336px'" />
        </div>
        <PressureDiff v-if="showPressureDiff" :data="pressureDiffQualityData" />

        <div class="title mt20">{{ i18n.global.t('meos_control_web.dispatch_standard') }}</div>
        <Dispatch :environment-quality="environmentQuality" />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import TemperatureOrRH from './Standard/TemperatureOrRH.vue';
import CO2 from './Standard/CO2.vue';
import Dispatch from './Standard/Dispatch.vue';
import PopoverIcon from './popoverIcon.vue';
import PressureDiff from './Standard/PressureDiff.vue';

const props = defineProps({
    environmentQuality: {
        type: Object,
        default: () => {}
    }
});
const quality = ref({});
const tQuality = ref({});
const rhDataQuality = ref({});
const showRhData = ref(false);

// 压差
const showPressureDiff = ref(false);
const pressureDiffQualityData = ref({});

watchEffect(() => {
    const { co2Quality, tdbQuality, rhQuality, isRhQualityEnabled, isPressureDiffQualityEnabled, pressureDiffQuality } = props.environmentQuality;
    quality.value = co2Quality;
    tQuality.value = tdbQuality;
    rhDataQuality.value = rhQuality;
    showRhData.value = isRhQualityEnabled;
    showPressureDiff.value = isPressureDiffQualityEnabled;
    pressureDiffQualityData.value = {
        lowerLimitValue: pressureDiffQuality?.lowerLimitValue,
        upperLimitValue: pressureDiffQuality?.upperLimitValue
    };
});
</script>

<style lang="less" scoped>
.standard-container {
    margin-top: 12px;
    .title {
        display: flex;
        align-items: center;
        padding-left: 12px;
        margin-bottom: 8px;
        color: #626c78;
        font-size: 14px;
        font-weight: 700;
        line-height: 22px;
        span {
            margin-right: 4px;
        }
    }
}
</style>
