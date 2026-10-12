<template>
    <div v-if="seasonQualityList?.length" class="temp-container">
        <div v-for="(item, index) in seasonQualityList" :key="item" class="temp-item">
            <div class="title">{{ item.airSeason }}</div>
            <div class="temp-box">
                <div class="bar-container">
                    <div class="bar"></div>
                    <div class="bar-list">
                        <div v-for="(child, subIndex) in item.list" :key="child" class="bar-item" :style="{ left: `${percentPositions[subIndex]}` }">
                            <div v-ellipsis class="title">{{ child.title }}</div>
                            <div class="line"></div>
                            <div class="value">{{ child.value || '--' }}{{ type === 'tdb' ? '℃' : '%RH' }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="index !== seasonQualityList.length - 1" class="temp-line"></div>
        </div>
    </div>
    <div v-else class="no-data">
        {{
            props.type === 'tdb'
                ? i18n.global.t('meos_control_web.no_cooling_season_cannot_configure_temperature_standard')
                : i18n.global.t('meos_control_web.no_cooling_season_cannot_configure_humidity_standard')
        }}
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { seasonTagCodesKey } from '@/views/ACOperationControl/injectKeys';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    type: {
        type: String,
        default: 'tdb' //'tdb' or 'rh'
    }
});
const percentPositions = ['11%', '37%', '63%', '89%'];
const airSeason = {
    AirSummer: i18n.global.t('meos_control_web.summer'),
    AirSummerPeak: i18n.global.t('meos_control_web.summer_peak'),
    AirWinter: i18n.global.t('meos_control_web.winter'),
    AirSeasonSpring: i18n.global.t('meos_control_web.transition_spring_alt'),
    AirSeasonAutumn: i18n.global.t('meos_control_web.transition_autumn')
};
const tdbLimitTitleMap = {
    underCoolingSeasonLimitValue: i18n.global.t('meos_control_web.over_cooled_threshold'),
    lowerComfortSeasonLimitValue: i18n.global.t('meos_control_web.comfort_zone_lower'),
    upperComfortSeasonLimitValue: i18n.global.t('meos_control_web.comfort_zone_upper'),
    overHeatingSeasonLimitValue: i18n.global.t('meos_control_web.over_heat_threshold')
};

const rhLimitTitleMap = {
    underCoolingSeasonLimitValue: i18n.global.t('meos_control_web.low_threshold'),
    lowerComfortSeasonLimitValue: i18n.global.t('meos_control_web.comfort_zone_lower'),
    upperComfortSeasonLimitValue: i18n.global.t('meos_control_web.comfort_zone_upper'),
    overHeatingSeasonLimitValue: i18n.global.t('meos_control_web.high_threshold')
};

const seasonQualityList = ref([]);
const seasonTagCodes = inject(seasonTagCodesKey);
watch(
    [() => props.data?.seasonQuality, () => props.type, seasonTagCodes],
    () => {
        const newSeasonQuality = props.data?.seasonQuality;
        if (!newSeasonQuality || !Array.isArray(newSeasonQuality)) {
            seasonQualityList.value = [];
            return;
        }
        const limitTitleMap = props.type === 'tdb' ? tdbLimitTitleMap : rhLimitTitleMap;

        seasonQualityList.value = newSeasonQuality
            .filter(v => {
                if (Array.isArray(seasonTagCodes?.value) && seasonTagCodes?.value?.length) {
                    return seasonTagCodes.value.includes(v.airSeason);
                } else {
                    return false;
                }
            })
            .map(item => {
                const airSeasonValue = airSeason[item.airSeason] || '--';

                return {
                    airSeason: airSeasonValue,
                    list: [
                        {
                            title: limitTitleMap.underCoolingSeasonLimitValue,
                            value: item.underCoolingSeasonLimitValue,
                            width: '56px'
                        },
                        {
                            title: limitTitleMap.lowerComfortSeasonLimitValue,
                            value: item.lowerComfortSeasonLimitValue,
                            width: '70px'
                        },
                        {
                            title: limitTitleMap.upperComfortSeasonLimitValue,
                            value: item.upperComfortSeasonLimitValue,
                            width: '70px'
                        },
                        {
                            title: limitTitleMap.overHeatingSeasonLimitValue,
                            value: item.overHeatingSeasonLimitValue,
                            width: '56px'
                        }
                    ]
                };
            });
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.temp-container {
    padding: 8px 12px;
    margin-bottom: 20px;
    background: #f7f9fa;
    font-size: 14px;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    .temp-item {
        .title {
            color: #1b2129;
        }
        .temp-box {
            .bar-container {
                height: 88px;
                position: relative;
                .bar {
                    position: absolute;
                    top: calc(50% - 6px);
                    width: 100%;
                    height: 12px;
                    border-radius: 4px;
                    background: linear-gradient(
                        90deg,
                        #68b2e8 0%,
                        #68b2e8 calc(11% - 1px),
                        white calc(11% - 1px),
                        white calc(11% + 1px),
                        #6bcfdd calc(11% + 1px),
                        #6bcfdd calc(37% - 1px),
                        white calc(37% - 1px),
                        white calc(37% + 1px),
                        #8ad1a6 calc(37% + 1px),
                        #8ad1a6 calc(63% - 1px),
                        white calc(63% - 1px),
                        white calc(63% + 1px),
                        #edc578 calc(63% + 1px),
                        #edc578 calc(89% - 1px),
                        white calc(89% - 1px),
                        white calc(89% + 1px),
                        #ef9b96 calc(89% + 1px),
                        #ef9b96 100%
                    );
                }
                .bar-list {
                    display: flex;
                    position: relative;
                    .bar-item {
                        display: flex;
                        position: absolute;
                        transform: translateX(-50%);
                        flex-direction: column;
                        padding-top: 12px;
                        width: 22%;
                        .title {
                            color: #626c78;
                            font-size: 14px;
                            font-weight: var(--platform-font-weight);
                            line-height: 22px;
                            width: 100%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .line {
                            width: 2px;
                            height: 10px;
                            margin-top: 5px;
                            margin-bottom: 5px;
                            margin-left: calc(50% - 1px);
                        }
                        .value {
                            color: #1b2129;
                            font-size: 14px;
                            font-weight: var(--platform-font-weight);
                            line-height: 22px;
                            text-align: center;
                        }
                    }
                }
            }
        }
        .temp-line {
            margin: 12px 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(to left, transparent 0%, transparent 50%, #c4c9cf 50%, #c4c9cf 100%);
            background-size: 10px 1px;
            background-repeat: repeat-x;
        }
    }
}
.no-data {
    width: 100%;
    background-color: #f7f9fa;
    padding: 12px;
    color: #626c78;
}
</style>
