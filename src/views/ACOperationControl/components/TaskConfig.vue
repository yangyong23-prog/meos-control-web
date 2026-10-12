<template>
    <div class="config-data-custom">
        <div class="column">
            <div style="margin-bottom: 4px; font-size: 16px; height: 22px">
                {{ task.configData[0].switchSet ? i18n.global.t('common.yes') : i18n.global.t('common.no') }}
            </div>
            <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.is_open_air_conditioning') }}</div>
        </div>
        <div v-if="finalTdb" class="column">
            <div style="margin-bottom: 4px; height: 22px">
                <span class="ffCP" style="font-size: 16px; font-weight: 600">{{ !finalTdb ? '--' : finalTdb }}</span
                >℃
            </div>
            <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.temperature_setting_value') }}</div>
        </div>
        <div v-if="finalCo2" class="column">
            <div style="margin-bottom: 4px; height: 22px">
                <span class="ffCP" style="font-size: 16px; font-weight: 600">{{ !finalCo2 ? '--' : finalCo2 }}</span
                >ppm
            </div>
            <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.co2_setting_value') }}</div>
        </div>
        <div v-if="finalRhQuality && isRhQualityEnabled" class="column">
            <div style="margin-bottom: 4px; height: 22px">
                <span class="ffCP" style="font-size: 16px; font-weight: 600">{{ !finalRhQuality ? '--' : finalRhQuality }}</span
                >%RH
            </div>
            <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.humidity_setting_value') }}</div>
        </div>
        <div v-if="finalPressureDiff && isPressureDiffEnabled" class="column">
            <div style="margin-bottom: 4px; height: 22px">
                <span class="ffCP" style="font-size: 16px; font-weight: 600">{{ !finalPressureDiff ? '--' : finalPressureDiff }}</span
                >Pa
            </div>
            <div style="color: var(--gray-600)">{{ i18n.global.t('meos_control_web.pressure_diff_setpoint_value') }}</div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { isNil } from 'lodash';
import { isRhQualityEnabledKey, isPressureDiffEnabledKey } from '../hooks/useDashboard';
const props = defineProps({
    task: {
        type: Object,
        default: () => ({ configData: [{}] })
    }
});
const isRhQualityEnabled = inject(isRhQualityEnabledKey);
const isPressureDiffEnabled = inject(isPressureDiffEnabledKey);

const finalTdb = computed(() => {
    return props?.task?.configData?.[0]?.tdbTarget?.toString();
});
const finalCo2 = computed(() => {
    return props?.task?.configData?.[0]?.CO2Target?.toString();
});
const finalRhQuality = computed(() => {
    return props?.task?.configData?.[0]?.rhTarget?.toString();
});
const finalPressureDiff = computed(() => {
    return props?.task?.configData?.[0]?.pressureDiffQualityTarget?.toString();
});
</script>
<style lang="less" scoped>
.config-data-custom {
    background-color: var(--alpha-30);
    border-radius: 4px;
    padding: 12px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
}
</style>
