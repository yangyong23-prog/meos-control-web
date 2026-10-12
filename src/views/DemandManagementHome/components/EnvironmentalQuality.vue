<template>
    <div class="environmental-quality mt24">
        <div class="title fc">
            <div class="title-item f16 fb7">{{ i18n.global.t('meos_control_web.env_quality_target') }}</div>
            <div class="get-line ml8 mr4"></div>
            <m-button type="link" size="small" @click="lookGroupStandard">{{ i18n.global.t('meos_control_web.view_group_standard') }}</m-button>
        </div>
        <div v-if="type === 'detail'">
            <div>
                <div class="fc ml12 mt16 mb8">
                    <div class="f14 fb7 ft">{{ i18n.global.t('meos_control_web.temp_criterion') }}</div>
                    <m-popover :width="336 + 'px'" :show-arrow="false" theme="darkTransparent" placement="right-start">
                        <template #content>
                            <div>
                                <div>
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_comfort_zone_upper_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.usually_per_national_or_asset_management_standard_limit') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_comfort_zone_lower_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.usually_per_national_or_asset_management_standard') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_overcold_threshold_2') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.allow_exceed_comfort_lower_for_energy_carbon_goals') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_overheat_threshold_2') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.allow_exceed_comfort_upper_for_energy_carbon_goals') }}</div>
                                </div>
                            </div>
                        </template>
                        <svg aria-hidden="true" class="row-tips-icon ml4">
                            <use :xlink:href="'#icon-info-small'" />
                        </svg>
                    </m-popover>
                </div>
                <TemperatureLineDetail :temperature-list="newArr">
                    <div v-if="!newArr.length" class="no-data ft">{{ i18n.global.t('meos_control_web.no_cooling_season_cannot_configure_temperature_standard') }}</div>
                    <dispatchDetail :data-obj="data" />
                </TemperatureLineDetail>
            </div>
            <div>
                <div class="fc ml12 mt16 mb8">
                    <div class="f14 fb7 ft">{{ i18n.global.t('meos_control_web.co2_standard') }}</div>
                    <m-popover :width="336 + 'px'" :show-arrow="false" theme="darkTransparent" placement="right-start">
                        <template #content>
                            <div>
                                <div>
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.co2_comfort_zone_upper_limit_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.co2_upper_limit_standard') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.co2_high_threshold_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.co2_upper_limit_emergency') }}</div>
                                </div>
                            </div>
                        </template>
                        <svg aria-hidden="true" class="row-tips-icon ml4">
                            <use :xlink:href="'#icon-info-small'" />
                        </svg>
                    </m-popover>
                </div>
                <Co2LineDetail :data-obj="data?.co2Quality">
                    <dispatchDetail v-if="dispatchRadio === SHOW_DISPATCH_ENUM.YES" :data-obj="data" :type="'co2'" :show-radio="false" />
                </Co2LineDetail>
            </div>
            <HumidityStandard v-if="showDetailHumidity">
                <div v-if="!originSeasonQuality.length" class="no-humidity-data ft">
                    {{ i18n.global.t('meos_control_web.no_cooling_season_cannot_configure_humidity_standard') }}
                </div>

                <HumidityLineDetail :data-list="humidityAirConditionSeasons" />
            </HumidityStandard>
            <PressureDiffStandard v-if="showDetailPressureDiff">
                <PressureDiffDetail :data="pressureDiffData" />
            </PressureDiffStandard>
        </div>
        <div v-else>
            <div>
                <div class="fc ml12 mt16 mb8">
                    <div class="f14 fb7 ft">{{ i18n.global.t('meos_control_web.temp_criterion') }}</div>
                    <m-popover :width="336 + 'px'" :show-arrow="false" theme="darkTransparent" placement="right-start">
                        <template #content>
                            <div>
                                <div>
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_comfort_zone_upper_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.usually_per_national_or_asset_management_standard_limit') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_comfort_zone_lower_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.usually_per_national_or_asset_management_standard') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_overcold_threshold_2') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.allow_exceed_comfort_lower_for_energy_carbon_goals') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.temperature_overheat_threshold_2') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.allow_exceed_comfort_upper_for_energy_carbon_goals') }}</div>
                                </div>
                            </div>
                        </template>
                        <svg aria-hidden="true" class="row-tips-icon ml4">
                            <use :xlink:href="'#icon-info-small'" />
                        </svg>
                    </m-popover>
                </div>
                <TemperatureLineEdit ref="temperatureLineEdit" :season-quality="newArr">
                    <div v-if="!newArr.length" class="no-data ft">{{ i18n.global.t('meos_control_web.no_cooling_season_cannot_configure_temperature_standard') }}</div>
                    <dispatchEdit ref="temperatureDispatchEditRef" v-model="dispatchRadio" :data-obj="data" />
                </TemperatureLineEdit>
            </div>
            <div>
                <div class="fc ml12 mt16 mb8">
                    <div class="f14 fb7 ft">{{ i18n.global.t('meos_control_web.co2_standard') }}</div>
                    <m-popover :width="336 + 'px'" :show-arrow="false" theme="darkTransparent" placement="right-start">
                        <template #content>
                            <div>
                                <div>
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.co2_comfort_zone_upper_limit_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.co2_upper_limit_standard') }}</div>
                                </div>
                                <div class="mt10">
                                    <div class="f14 fb7">{{ i18n.global.t('meos_control_web.co2_high_threshold_alt') }}</div>
                                    <div class="f14 ft subTips">{{ i18n.global.t('meos_control_web.co2_upper_limit_emergency') }}</div>
                                </div>
                            </div>
                        </template>
                        <svg aria-hidden="true" class="row-tips-icon ml4">
                            <use :xlink:href="'#icon-info-small'" />
                        </svg>
                    </m-popover>
                </div>
                <Co2LineEdit ref="cO2QualityEdit" :data-obj="data?.co2Quality" :show-divider="dispatchRadio === SHOW_DISPATCH_ENUM.YES">
                    <dispatchEdit v-show="dispatchRadio === SHOW_DISPATCH_ENUM.YES" ref="co2DispatchEditRef" v-model="dispatchRadio" :type="'co2'" :data-obj="data" />
                </Co2LineEdit>
            </div>
            <HumidityStandard v-if="showEditHumidity">
                <!-- 编辑时无空调季则不会展示表单 -->
                <div v-if="!originSeasonQuality.length" class="no-humidity-data ft">
                    {{ i18n.global.t('meos_control_web.no_cooling_season_cannot_configure_humidity_standard') }}
                </div>
                <HumidityLineEdit
                    v-else
                    ref="humidityLineEdit"
                    v-model="isHumidityEnableConfig"
                    :season-quality="humidityAirConditionSeasons"
                    :show-enable-config="showEnableConfig"
                />
            </HumidityStandard>
            <PressureDiffStandard v-if="showEditPressureDiff">
                <PressureDiffLineEdit ref="pressureDiffEdit" v-model="isPressureDiffEnableConfig" :diff-data="pressureDiffData" :show-enable-config="showEnableConfig" />
            </PressureDiffStandard>
        </div>
        <EnviornmentalGroupStandard v-model:show="show"></EnviornmentalGroupStandard>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import TemperatureLineDetail from './TemperatureLineDetail.vue';
import Co2LineDetail from './Co2LineDetail.vue';
import dispatchDetail from './dispatchDetail.vue';

import TemperatureLineEdit from './TemperatureLineEdit.vue';
import Co2LineEdit from './Co2LineEdit.vue';
import dispatchEdit from './dispatchEdit.vue';
import EnviornmentalGroupStandard from './EnviornmentalGroupStandard.vue';
import HumidityStandard from './HumidityStandard.vue';
import PressureDiffStandard from './PressureDiffStandard.vue';
import PressureDiffLineEdit from './PressureDiffEdit.vue';
import PressureDiffDetail from './PressureDiffDetail.vue';
import HumidityLineDetail from './HumidityLineDetail.vue';
import HumidityLineEdit from './HumidityLineEdit.vue';
import { SHOW_HUMIDITY_ENUM, SHOW_DISPATCH_ENUM, SHOW_PRESSURE_DIFF_ENUM } from '../constant/ac';
import { currentConfigItemKey, isProjectShowRHKey, isProjectShowPressureDiffKey } from '../hooks/useAcCommon';

const newArr = ref([]);
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    type: {
        type: String,
        // 'detail'/'edit'/'add'
        default: ''
    }
});

const currentConfigItem = inject(currentConfigItemKey);
const isProjectShowRH = inject(isProjectShowRHKey);
const isProjectShowPressureDiff = inject(isProjectShowPressureDiffKey);

const isCurrentProject = computed(() => currentConfigItem.value?.objectType === 'PROJECT');
const showEnableConfig = computed(() => {
    return isCurrentProject.value && props.type !== 'add';
});

const humidityAirConditionSeasons = ref([]);
const isHumidityEnableConfig = ref(SHOW_HUMIDITY_ENUM.NO);
const showDetailHumidity = ref(false);
const showEditHumidity = ref(false);
const originSeasonQuality = inject('seasonQuality');

const pressureDiffData = ref({});
const isPressureDiffEnableConfig = ref(SHOW_PRESSURE_DIFF_ENUM.NO);
const showDetailPressureDiff = ref(false);
const showEditPressureDiff = ref(false);

const dispatchRadio = ref(SHOW_DISPATCH_ENUM.YES);

// 临时方案 暂时隐藏夏季高峰
watch(
    () => props.data,
    () => {
        // 湿度标准默认无默认值
        const seasonQualityWithDefault = (originSeasonQuality?.value || []).map(v => {
            return {
                ...v,
                underCoolingSeasonLimitValue: '',
                lowerComfortSeasonLimitValue: '',
                upperComfortSeasonLimitValue: '',
                overHeatingSeasonLimitValue: ''
            };
        });
        const selfRHData = props.data?.rhQuality?.seasonQuality?.filter(item => item.airSeason !== 'AirSummerPeak') || [];
        humidityAirConditionSeasons.value = selfRHData?.length ? selfRHData : seasonQualityWithDefault;
        pressureDiffData.value = props?.data?.pressureDiffQuality ?? {
            lowerLimitValue: '',
            upperLimitValue: ''
        };

        newArr.value = props.data?.tdbQuality?.seasonQuality?.filter(item => item.airSeason !== 'AirSummerPeak');

        dispatchRadio.value = props.data?.isParticipateInScheduling ? SHOW_DISPATCH_ENUM.YES : SHOW_DISPATCH_ENUM.NO;
    },
    { immediate: true }
);

watchEffect(() => {
    // 始终取项目的是否启用湿度标准
    showDetailHumidity.value = isProjectShowRH.value;
    // 全局配置编辑时，始终显示湿度标准配置
    if (isCurrentProject?.value && props.type === 'edit') {
        showEditHumidity.value = true;
    } else {
        showEditHumidity.value = isProjectShowRH.value;
    }
    isHumidityEnableConfig.value = showDetailHumidity.value ? SHOW_HUMIDITY_ENUM.YES : SHOW_HUMIDITY_ENUM.NO;

    // 始终取项目的是否启用压差标准
    showDetailPressureDiff.value = isProjectShowPressureDiff.value;
    // 全局配置编辑时，始终显示压差标准配置
    if (isCurrentProject?.value && props.type === 'edit') {
        showEditPressureDiff.value = true;
    } else {
        showEditPressureDiff.value = isProjectShowPressureDiff.value;
    }
    isPressureDiffEnableConfig.value = showDetailPressureDiff.value ? SHOW_PRESSURE_DIFF_ENUM.YES : SHOW_PRESSURE_DIFF_ENUM.NO;
});

watchEffect(() => {
    const seasons = originSeasonQuality.value?.map(v => v?.airSeason);
    if (seasons?.length) {
        const preSeasons = humidityAirConditionSeasons.value || [];
        humidityAirConditionSeasons.value = preSeasons.filter(v => {
            return seasons.includes(v.airSeason);
        });
    }
});

const show = ref(false);
const temperatureLineEdit = ref();
const cO2QualityEdit = ref();
const humidityLineEdit = ref();
const pressureDiffEdit = ref();

const temperatureDispatchEditRef = ref();
const co2DispatchEditRef = ref();

const lookGroupStandard = () => {
    show.value = true;
};

const validate = async () => {
    let errorScope;
    try {
        const result = { tdbQuality: {} };
        // console.log(temperatureLineEdit.value, ' temperatureLineEdit.value ');
        const seasonQuality = temperatureLineEdit.value ? await temperatureLineEdit.value?.validate() : [];
        const co2Quality = await cO2QualityEdit.value?.validate();
        const enableRH = isHumidityEnableConfig.value === SHOW_HUMIDITY_ENUM.YES;
        // 仅启用湿度标准时才校验
        const humidityQuality = humidityLineEdit.value && enableRH ? await humidityLineEdit.value?.validate() : {};
        // 仅启用压差标准时才校验
        const enablePressureDiff = isPressureDiffEnableConfig.value === SHOW_PRESSURE_DIFF_ENUM.YES;
        const pressureDiffQuality = enablePressureDiff ? await pressureDiffEdit.value?.validate() : {};
        const temperatureDispatchData = await temperatureDispatchEditRef.value?.validate();
        const co2DispatchData = await co2DispatchEditRef.value?.validate?.();
        if (
            !seasonQuality?.errorScope &&
            !co2Quality?.errorScope &&
            !humidityQuality?.errorScope &&
            !pressureDiffQuality?.errorScope &&
            !temperatureDispatchData?.errorScope &&
            !co2DispatchData?.errorScope
        ) {
            const seasonData = seasonQuality.data;
            const co2Data = co2Quality.data;
            const dispatchFinalData = { ...(temperatureDispatchData?.data || {}), ...(co2DispatchData?.data || {}) };
            // 校验通过
            result.tdbQuality = { ...dispatchFinalData.tdbQuality, seasonQuality: seasonData };
            result.co2Quality = { ...dispatchFinalData.co2Quality, ...co2Data };
            result.isParticipateInScheduling = dispatchFinalData.isParticipateInScheduling;
            result.rhQuality = { seasonQuality: humidityQuality?.data || [] };
            result.isRhQualityEnabled = enableRH;
            result.isPressureDiffQualityEnabled = enablePressureDiff;
            result.pressureDiffQuality = pressureDiffQuality?.data || {};
            return { data: result };
        } else {
            errorScope =
                seasonQuality?.errorScope ||
                co2Quality?.errorScope ||
                humidityQuality?.errorScope ||
                temperatureDispatchData?.errorScope ||
                co2DispatchData?.errorScope ||
                pressureDiffQuality?.errorScope;
        }
        // console.log('seasonQuality----result: ', temperatureLineEdit.value);
    } catch (e) {
        // console.log('e: ', e);
    }
    return { errorScope };
};
const getFormData = async () => {
    const result = { tdbQuality: {} };
    const seasonQuality = temperatureLineEdit.value ? await temperatureLineEdit.value?.getFormData?.() : [];
    const humidityQuality = humidityLineEdit.value ? await humidityLineEdit.value?.getFormData?.() : [];
    const co2Quality = await cO2QualityEdit.value?.getFormData?.();
    const temperatureDispatchData = await temperatureDispatchEditRef.value?.getFormData();
    const co2DispatchData = await co2DispatchEditRef.value?.getFormData?.();
    const pressureDiffQuality = pressureDiffEdit.value && isPressureDiffEnableConfig.value === SHOW_PRESSURE_DIFF_ENUM.YES ? await pressureDiffEdit.value?.getFormData?.() : {};

    result.tdbQuality = { ...(temperatureDispatchData?.tdbQuality || {}), seasonQuality };
    result.co2Quality = { ...(co2DispatchData?.co2Quality || {}), ...(co2Quality || {}) };
    result.isParticipateInScheduling = temperatureDispatchData.isParticipateInScheduling;
    result.humidityQuality = { seasonQuality: humidityQuality || [] };

    const enablePressureDiff = isPressureDiffEnableConfig.value === SHOW_PRESSURE_DIFF_ENUM.YES;
    result.isPressureDiffQualityEnabled = enablePressureDiff;
    result.pressureDiffQuality = pressureDiffQuality?.data || {};
    return result;
};
defineExpose({ validate, getFormData });
</script>
<style lang="less">
.group-standard-modal {
    .m-modal-main-content {
        padding: 0px !important;

        .left {
            height: 100%;
            width: 40%;
            padding: 10px;

            &-item {
                width: 100%;
                padding: 13px 12px;
                border-radius: 4px;
            }

            .no-active:hover {
                background-color: rgba(196, 201, 207, 0.3);
            }
        }

        .right {
            height: 100%;
            width: 60%;
            padding: 12px;
            background-color: #f1f4f6;
        }
    }
}
</style>
<style lang="less" scoped>
:deep(.m-popper-trigger) {
    display: flex;
}

.row-tips-icon {
    width: 16px;
    height: 16px;
    color: @grey-500;
}

.environmental-quality {
    .title {
        .get-line {
            background: #d9d9d9;
            width: 1px;
            height: 14px;
        }
    }
}

.title-item {
    padding-left: 12px;
    position: relative;
    color: var(--gray-800, #2e3742);
    height: 22px;
    line-height: 22px;

    &::after {
        position: absolute;
        top: 4px;
        left: 0;
        width: 3px;
        height: 14px;
        background: var(--blue-500);
        content: '';
    }
}

.active {
    background-color: #d9ebff;
    color: #246fe5;
    font-weight: 700;
}

.active:hover {
    background-color: #d9ebff;
}

.no-data {
    width: 100%;
    background-color: #f7f9fa;
    padding-top: 12px;
}

.no-humidity-data {
    width: 100%;
    background-color: #f7f9fa;
    padding: 12px;
}

.subTips {
    color: @grey-200;
}
</style>
