<template>
    <Bubble>
        <div v-loading="loading" element-loading-lottiename="circle" class="loading-content">
            <div v-if="!loading" class="bubble-card">
                <div class="bubble-title">
                    {{ data.localName ?? '--' }}
                </div>
                <div v-if="rows.length > 0" class="bubble-line"></div>
                <div class="rows">
                    <div v-for="(item, idx) in rows" :key="idx" class="row">
                        <span class="label">{{ item.title + '：' }}</span>
                        <span class="value">{{ item.value }}</span>
                    </div>
                </div>
            </div>
        </div>
    </Bubble>
</template>

<script setup>
import Bubble from '@/components/3dEngineElements/Bubble.vue';
// removed unused dateAirSearonMapKey
import { curSelectedTimeKey } from '../../hooks/useSpacePerdiction';
import { getOriginalTimeKey } from '../../injectionKey';
import dayjs from 'dayjs';
import { getAcQuarter, listConfigsByInstance } from '@/apis/AI';
import baseStore from '@/store/baseStore';
import { AIR_SEASON } from '../../variable';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import i18n from '@/localization';
import { isEmpty } from 'lodash';

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    },
    type: {
        type: String,
        default: ''
    }
});

const loading = ref(false);
const curSelectedTime = inject(curSelectedTimeKey);
const getOriginalTime = inject(getOriginalTimeKey);

const dateTime = computed(() => {
    return curSelectedTime?.value ? dayjs(getOriginalTime(curSelectedTime.value)).format('YYYY-MM-DD') : null;
});

const { cancelQuest: cancelQuestA, cancelToken: cancelTokenA } = UseCancelTokenHooks();
const fetchAcQuarter = () => {
    const params = {
        objId: baseStore().projectId,
        beginDate: dateTime.value,
        endDate: dateTime.value
    };
    return getAcQuarter(params, { cancelToken: cancelTokenA() });
};

const { cancelQuest: cancelQuestD, cancelToken: cancelTokenD } = UseCancelTokenHooks();
const fetchDemandConfig = () => {
    const param = {
        templateType: 'AIRCONDITIONING',
        date: dateTime.value,
        instanceType: 'SPACE',
        instanceIds: [props.data.id],
        withColumns: ['instanceId', 'finalConfig']
    };
    return listConfigsByInstance(param, { cancelToken: cancelTokenD() });
};

const rows = ref([]);

watch(
    dateTime,
    () => {
        if (isEmpty(dateTime.value)) return;
        loading.value = true;
        Promise.allSettled([fetchAcQuarter(), fetchDemandConfig()])
            .then(res => {
                if (res.every(({ value }) => value.code === SUCCESSCODE)) {
                    // 空调季
                    let airSeason = '',
                        list = [];
                    res[0].value?.data?.forEach(item => {
                        const currentDay = item?.currentDay?.split(' ')[0];
                        currentDay &&
                            item?.tagList?.forEach(tag => {
                                if (AIR_SEASON[tag]) {
                                    airSeason = tag;
                                }
                            });
                    });

                    // 配置
                    const { tdbQuality, co2Quality, rhQuality, isRhQualityEnabled } = res[1].value?.data?.[0]?.finalConfig?.globalConfig?.environmentQuality || {};

                    if (props.type === 'SapcetypeTemperature') {
                        const item = tdbQuality.seasonQuality.find(s => s.airSeason === airSeason);

                        list = [
                            {
                                title: i18n.global.t('meos_control_web.actual_value'),
                                value: showValue(props.data.extraData?.tdb) + '°C'
                            },
                            {
                                title: i18n.global.t('meos_control_web.over_cooled_threshold'),
                                value: showValue(item.underCoolingSeasonLimitValue) + '°C'
                            },
                            {
                                title: i18n.global.t('meos_control_web.comfort_zone_lower'),
                                value: showValue(item.lowerComfortSeasonLimitValue) + '°C'
                            },
                            {
                                title: i18n.global.t('meos_control_web.comfort_zone_upper'),
                                value: showValue(item.upperComfortSeasonLimitValue) + '°C'
                            },
                            {
                                title: i18n.global.t('meos_control_web.over_heat_threshold'),
                                value: showValue(item.overHeatingSeasonLimitValue) + '°C'
                            }
                        ];
                    }

                    if (props.type === 'SapcetypeCO2') {
                        list = [
                            {
                                title: i18n.global.t('meos_control_web.actual_value'),
                                value: showValue(props.data.extraData?.cO2 ?? props.data.extraData?.co2) + 'ppm'
                            },
                            {
                                title: i18n.global.t('meos_control_web.comfort_zone_upper'),
                                value: showValue(co2Quality.carbonDioxideLimitValue) + 'ppm'
                            },
                            {
                                title: i18n.global.t('meos_control_web.high_threshold'),
                                value: showValue(co2Quality.carbonDioxideUpperLimitValue) + 'ppm'
                            }
                        ];
                    }

                    if (props.type === 'SpaceTypeHumidity') {
                        const item = (rhQuality?.seasonQuality || []).find(s => s.airSeason === airSeason);
                        const tempArr = [];
                        if (props.data?.extraData?.rh?.toString()) {
                            tempArr.push({
                                title: i18n.global.t('meos_control_web.actual_value'),
                                value: showValue(props.data.extraData?.rh) + '%RH'
                            });
                        }
                        if (isRhQualityEnabled && item) {
                            const standardArr = [
                                {
                                    title: i18n.global.t('meos_control_web.low_threshold'),
                                    value: showValue(item.underCoolingSeasonLimitValue) + '%RH'
                                },
                                {
                                    title: i18n.global.t('meos_control_web.comfort_zone_lower'),
                                    value: showValue(item.lowerComfortSeasonLimitValue) + '%RH'
                                },
                                {
                                    title: i18n.global.t('meos_control_web.comfort_zone_upper'),
                                    value: showValue(item.upperComfortSeasonLimitValue) + '%RH'
                                },
                                {
                                    title: i18n.global.t('meos_control_web.high_threshold'),
                                    value: showValue(item.overHeatingSeasonLimitValue) + '%RH'
                                }
                            ];
                            tempArr.push(...standardArr);
                        }

                        list = tempArr;
                    }

                    rows.value = list;
                }
            })
            .finally(() => {
                loading.value = false;
            });
    },
    {
        immediate: true
    }
);

const showValue = v => {
    return v === undefined || v === null || v === '' ? '--' : Math.round(v * 10) / 10;
};

onBeforeUnmount(() => {
    cancelQuestA();
    cancelQuestD();
});
</script>

<style lang="less" scoped>
:deep(.circular) {
    width: 28px !important;
    height: 28px !important;

    circle {
        stroke: #626c78 !important;
    }
}

:deep(.el-loading-spinner) {
    margin-top: -14px !important;
}

.loading-content {
    width: 250px;
    min-height: 32px;
    background-color: white;
    overflow: hidden;
}

.bubble-card {
    width: 250px;
    padding: 6px 12px;
}
.bubble-title {
    color: #1b2129;
}
.bubble-line {
    height: 1px;
    background: #e8ecf0;
    margin: 8px 0;
}
.rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.row {
    display: flex;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
}
.label {
    color: #626c78;
    font-size: 14px;
}
.value {
    color: #1b2129;
    font-size: 14px;
}
</style>
