<template>
    <div class="sider-cards-statistics-container">
        <div v-if="hasData(tdbStatusCount || {})" class="card-item">
            <CardTitle :title="i18n.global.t('meos_control_web.temperature_distribution')" class="title-bg">
                <template #right>
                    <div
                        v-if="showScheduleStatus(DASHBOARD_ENV_BELONG_IDS.TDB)"
                        :class="['right-operate-btn', tdbScheduleStatusGroupCount ? '' : 'disabled']"
                        @click="openModal('tdb', tdbScheduleStatusGroupCount)"
                    >
                        <span v-ellipsis class="title">{{ i18n.global.t('meos_control_web.space_scheduling_count') }}:</span
                        ><span class="amount">&nbsp;{{ tdbScheduleStatusGroupCount }}</span>
                        <svg v-if="tdbScheduleStatusGroupCount" class="icon" aria-hidden="true" style="height: 20px; width: 20px">
                            <use xlink:href="#icon-you" />
                        </svg>
                    </div>
                </template>
            </CardTitle>
            <PieChartStatistic :type="DASHBOARD_ENV_BELONG_IDS.TDB" :disable-interactive="true" class="card-item-chart" :data-statistics="tdbStatusCount" @click-item="clickItem" />
        </div>
        <div v-if="hasData(co2StatusCount || {})" class="card-item">
            <CardTitle :title="i18n.global.t('meos_control_web.co2_concentration_distribution')" class="title-bg">
                <template #right>
                    <div
                        v-if="showScheduleStatus(DASHBOARD_ENV_BELONG_IDS.CO2)"
                        :class="['right-operate-btn', cO2ScheduleStatusGroupCount ? '' : 'disabled']"
                        @click="openModal('cO2', cO2ScheduleStatusGroupCount)"
                    >
                        <span v-ellipsis class="title"> {{ i18n.global.t('meos_control_web.space_scheduling_count') }}:</span
                        ><span class="amount">&nbsp;{{ cO2ScheduleStatusGroupCount }}</span>
                        <svg v-if="cO2ScheduleStatusGroupCount" class="icon" aria-hidden="true" style="height: 20px; width: 20px">
                            <use xlink:href="#icon-you" />
                        </svg>
                    </div>
                </template>
            </CardTitle>
            <PieChartStatistic class="card-item-chart" :disable-interactive="true" :type="DASHBOARD_ENV_BELONG_IDS.CO2" :data-statistics="co2StatusCount" @click-item="clickItem" />
        </div>
        <div v-if="hasData(rhStatusCount || {}) && isRhQualityEnabled" class="card-item">
            <CardTitle :title="i18n.global.t('meos_control_web.humidity_distribution')" class="title-bg"> </CardTitle>
            <PieChartStatistic class="card-item-chart" :disable-interactive="true" :type="DASHBOARD_ENV_BELONG_IDS.RH" :data-statistics="rhStatusCount" @click-item="clickItem" />
        </div>
        <div v-if="hasData(pressureDiffCount || {}) && isPressureDiffEnabled" class="card-item">
            <CardTitle :title="i18n.global.t('meos_control_web.pressure_diff_distribution')" class="title-bg"> </CardTitle>
            <PieChartStatistic
                class="card-item-chart"
                :disable-interactive="true"
                :type="DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF"
                :data-statistics="pressureDiffCount"
                @click-item="clickItem"
            />
        </div>
    </div>
    <SpaceScheduleModalList v-model="showModal" :env="modalIdTitle.id" :title="modalIdTitle.title" :data="modalData" :is-model-view="true" />
</template>
<script setup>
import i18n from '@/localization';
import CardTitle from '@/views/ACOperationControl/ACDashboard/CardTitle.vue';
import PieChartStatistic from '@/views/ACOperationControl/ACDashboard/PieChartStatistic.vue';
import SpaceScheduleModalList from '@/views/ACOperationControl/components/SpaceScheduleModalList.vue';
import {
    tdbStatusStatisticsInjectKey,
    co2StatusStatisticsInjectKey,
    rhStatusStatisticsInjectKey,
    pressureDiffStatisticsInjectKey,
    tdbScheduleStatusGroupKey,
    cO2ScheduleStatusGroupKey,
    flattenedSpacesMapInjectKey,
    isRhQualityEnabledKey,
    isPressureDiffEnabledKey
} from '@/views/ACOperationControl/hooks/useDashboard';
import {
    DASHBOARD_CARD_TEMPERATURE_STATUS_MAP,
    DASHBOARD_CARD_CO2_STATUS_MAP,
    DASHBOARD_CARD_RH_STATUS_MAP,
    DASHBOARD_ENV_BELONG_IDS,
    DASHBOARD_STATUS_IDS,
    DASHBOARD_COMMON_VALUES,
    DASHBOARD_CARD_PRESSURE_DIFF_STATUS_MAP
} from '@/views/ACOperationControl/constants/constant';
import { floorToSpaceIdsMapKey } from '@/views/ACOperationControl/hooks/useACGlobalData';
import { currentFloorObjKey, envParamShellConfigKey } from '@/views/ACOperationControl/injectKeys';
import DockSingleton from '@/hooks/responsiveDock';
import { SPACE_GRID_PREFIX, envToScheduleStatusMap } from '../../variables';

const hasData = dataStatistics => {
    return Object.values(dataStatistics).reduce((partialSum, a) => partialSum + a, 0);
};
const showModal = ref(false);
const modalIdTitle = ref({ id: '', title: '' });
const modalData = ref([]);

const emits = defineEmits(['openSpaceScheduleModal']);
const isRhQualityEnabled = inject(isRhQualityEnabledKey);
const isPressureDiffEnabled = inject(isPressureDiffEnabledKey);
const tdbStatusStatistics = inject(tdbStatusStatisticsInjectKey);
const co2StatusStatistics = inject(co2StatusStatisticsInjectKey);
const rhStatusStatistics = inject(rhStatusStatisticsInjectKey);
const pressureDiffStatusStatistics = inject(pressureDiffStatisticsInjectKey);

const currentFloorObj = inject(currentFloorObjKey);
const tdbScheduleStatusGroup = inject(tdbScheduleStatusGroupKey);
const cO2ScheduleStatusGroup = inject(cO2ScheduleStatusGroupKey);
const floorToSpaceIdsMap = inject(floorToSpaceIdsMapKey);

const flattenedSpacesMap = inject(flattenedSpacesMapInjectKey);
const { getIotData, getCustomInfo } = DockSingleton.getInstance();
const clickItem = item => {
    if (item?.belong && item?.id) {
        //  filterEnvScope?.(item.belong, item.id);
    }
};
const statusMap = {
    [DASHBOARD_ENV_BELONG_IDS.TDB]: DASHBOARD_CARD_TEMPERATURE_STATUS_MAP,
    [DASHBOARD_ENV_BELONG_IDS.CO2]: DASHBOARD_CARD_CO2_STATUS_MAP,
    [DASHBOARD_ENV_BELONG_IDS.RH]: DASHBOARD_CARD_RH_STATUS_MAP,
    [DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF]: DASHBOARD_CARD_PRESSURE_DIFF_STATUS_MAP
};
const getCountByGroup = (filterIds, originalObject, type) => {
    const mapData = statusMap[type] || [];
    const mapIds = mapData.map(item => item.id);
    let statusCount = {};
    mapIds.forEach(key => {
        let spaceIds = originalObject[key] || [];
        if (filterIds?.length) {
            spaceIds = spaceIds.filter(v => filterIds.includes(v));
        }
        const finalCount = spaceIds?.length ?? 0;
        // 无数据项有值才展示,屏蔽项有值才展示, 无标准项不展示，空间总数过滤无标准项
        if ((key === DASHBOARD_STATUS_IDS.NO_DATA && !finalCount) || (key === DASHBOARD_STATUS_IDS.IS_SHIELD && !finalCount) || key === DASHBOARD_STATUS_IDS.NO_STANDARD) {
            return;
        }
        statusCount[key] = finalCount;
    });

    return statusCount;
};

const filterSpaceIdsList = (filterIds, originalObject) => {
    const result = Object.entries(originalObject || {}).flatMap(([status, spaceIds]) => {
        // status 可能为 --
        if (status && status !== DASHBOARD_COMMON_VALUES.TARGET_VALUE && status !== DASHBOARD_COMMON_VALUES.UNKNOWN) {
            return spaceIds.filter(v => (filterIds?.length ? filterIds?.includes(v) : true))?.map(spaceId => ({ spaceId, status }));
        }
        return [];
    });
    return result;
};

const tdbStatusCount = computed(() => {
    const isFloorView = !!currentFloorObj?.value?.id;
    const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
    const groupCount = getCountByGroup(curFloorSpaceIds, tdbStatusStatistics.value, 'tdb');
    return groupCount;
});

const co2StatusCount = computed(() => {
    const isFloorView = !!currentFloorObj?.value?.id;
    const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
    const groupCount = getCountByGroup(curFloorSpaceIds, co2StatusStatistics.value, 'cO2');
    return groupCount;
});

const rhStatusCount = computed(() => {
    const isFloorView = !!currentFloorObj?.value?.id;
    const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
    const groupCount = getCountByGroup(curFloorSpaceIds, rhStatusStatistics.value, 'rH');
    return groupCount;
});

const pressureDiffCount = computed(() => {
    const isFloorView = !!currentFloorObj?.value?.id;
    const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
    const groupCount = getCountByGroup(curFloorSpaceIds, pressureDiffStatusStatistics.value, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF);
    return groupCount;
});

const tdbScheduleStatusSpaceList = computed(() => {
    const isFloorView = !!currentFloorObj?.value?.id;
    const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
    const newList = filterSpaceIdsList(curFloorSpaceIds, tdbScheduleStatusGroup.value);
    return newList;
});

const tdbScheduleStatusGroupCount = computed(() => {
    return tdbScheduleStatusSpaceList.value?.length ?? 0;
});

const cO2ScheduleStatusSpaceList = computed(() => {
    const isFloorView = !!currentFloorObj?.value?.id;
    const curFloorSpaceIds = isFloorView ? floorToSpaceIdsMap?.value?.[currentFloorObj?.value?.id] || [] : [];
    const newList = filterSpaceIdsList(curFloorSpaceIds, cO2ScheduleStatusGroup.value);
    return newList;
});

const cO2ScheduleStatusGroupCount = computed(() => {
    return cO2ScheduleStatusSpaceList.value?.length ?? 0;
});

const envParamShellConfig = inject(envParamShellConfigKey);

const showScheduleStatus = currentEnv => {
    const envParamShellConfigArr = envParamShellConfig.value || [];
    const upperEnvCodeItem = envParamShellConfigArr.find(v => {
        return v.code?.replace?.(SPACE_GRID_PREFIX, '')?.toUpperCase() === currentEnv?.toUpperCase();
    });

    // 默认无壳配置的时候，都需要展示
    if (!envParamShellConfig.value?.length) {
        return true;
    }
    return (upperEnvCodeItem?.value || []).includes(envToScheduleStatusMap[currentEnv]);
};

const openModal = (type, count) => {
    if (!count) {
        return;
    }
    emits('openSpaceScheduleModal');
    modalIdTitle.value.id = type;
    modalIdTitle.value.title = `${i18n.global.t('meos_control_web.space_scheduling')} - ${
        type === DASHBOARD_ENV_BELONG_IDS.TDB
            ? i18n.global.t('meos_control_web.temperature')
            : type === DASHBOARD_ENV_BELONG_IDS.CO2
            ? i18n.global.t('meos_control_web.co2_concentration')
            : ''
    }`;

    // 仅温度和二氧化碳才有调度状态
    const filterTargetScheduleList =
        type === DASHBOARD_ENV_BELONG_IDS.TDB ? tdbScheduleStatusSpaceList.value : type === DASHBOARD_ENV_BELONG_IDS.CO2 ? cO2ScheduleStatusSpaceList.value : [];

    modalData.value = filterTargetScheduleList
        .map(v => {
            const { spaceId, status } = v || {};
            const spaceData = flattenedSpacesMap.value?.get(spaceId) || {};
            const { id, localName: spaceName, floorSequenceId, floorId, floorLocalId, buildingId, buildingLocalName } = spaceData;

            const upperEnv = type.toUpperCase();
            const curSpaceUpperEnv = spaceData?.[upperEnv] || {};
            const { infoCode, infoCodeType } = curSpaceUpperEnv?.secondGroupSecondInfo || {};

            const scheduleObj = getCustomInfo(spaceId, infoCodeType, infoCode);
            const controlAim = curSpaceUpperEnv?.secondGroupThirdInfo?.infoCode;
            const targetValObj = controlAim ? getIotData(spaceId, controlAim) : null;
            const iotValObj = getIotData(spaceId, type);
            const limitRangeObj = getCustomInfo(spaceId, 'DEMAND_CONFIG', type);
            const commonUnit = iotValObj?.unit || targetValObj?.unit || '--';

            const { lowerComfortSeasonLimitValue, upperComfortSeasonLimitValue, carbonDioxideLimitValue, carbonDioxideUpperLimitValue } = limitRangeObj?.dataValue || {};

            return {
                id,
                spaceId: id,
                spaceName,
                localName: spaceName,
                floorId,
                floorLocalId,
                floorSequenceId,
                buildingId,
                buildingName: buildingLocalName,
                curSpaceUpperEnv,
                // TODO 不动态的数据
                scheduleStatus: status || scheduleObj?.dataValue || '',
                showTargetValue: !!targetValObj?.existsIotRule,
                targetValue: targetValObj?.dataValue ? targetValObj?.dataValue + commonUnit : '',
                showIotValue: !!iotValObj?.existsIotRule,
                iotValue: iotValObj?.dataValue ? iotValObj?.dataValue + iotValObj?.unit : '',
                unit: iotValObj?.unit || commonUnit,
                showComfortableValue: !!limitRangeObj?.infoCode,
                lowerValue:
                    type === DASHBOARD_ENV_BELONG_IDS.TDB
                        ? lowerComfortSeasonLimitValue
                        : type === DASHBOARD_ENV_BELONG_IDS.CO2
                        ? carbonDioxideLimitValue
                        : lowerComfortSeasonLimitValue,
                higherValue:
                    type === DASHBOARD_ENV_BELONG_IDS.TDB
                        ? upperComfortSeasonLimitValue
                        : type === DASHBOARD_ENV_BELONG_IDS.CO2
                        ? carbonDioxideUpperLimitValue
                        : upperComfortSeasonLimitValue
            };
        })
        .toSorted((a, b) => a.floorSequenceId - b.floorSequenceId);

    showModal.value = true;
};

watch(
    () => showModal.value,
    cur => {
        if (!cur) {
            modalIdTitle.value.id = '';
            modalIdTitle.value.title = '';
            modalData.value = [];
        }
    }
);
</script>
<style scoped lang="less">
.sider-cards-statistics-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 24px;
    padding-bottom: 24px;
    .card-item {
        min-width: 300px;
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.8);
        .card-item-chart {
            padding-left: 12px;
            ::v-deep .right-container .row-item {
                &:hover,
                &.active {
                    background: transparent;
                }
            }
        }
        .right-operate-btn {
            width: 100%;
            display: flex;
            padding: 3px 4px 3px 8px;
            justify-content: center;
            color: var(--gray-600, #626c78);
            align-items: center;
            border-radius: 4px;
            cursor: pointer;
            background: #c4c9cf4d;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            .amount {
                color: var(--blue-500, #246fe5);
                font-weight: 700;
                flex-shrink: 0;
            }
            .title {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .icon {
                fill: #8b949e;
                flex-shrink: 0;
            }
            &:hover:not(.disabled) {
                background: var(--blue-500, #246fe5);
                color: var(--Grey-Grey-0, #fff);
                .amount {
                    color: var(--Grey-Grey-0, #fff);
                }
                .icon {
                    fill: #fff;
                }
            }

            &.disabled {
                background-color: #e8ecf0;
                cursor: not-allowed;
                .amount {
                    color: var(--gray-400, #c4c9cf);
                }
            }
        }
    }
    .title-bg {
        padding-left: 12px;
        &::before {
            position: absolute;
            content: '';
            top: 7px;
            left: 0;
            width: 3px;
            height: 14px;
            background-color: var(--blue-500, #246fe5);
        }
    }

    .card-item-btn {
        cursor: pointer;
        display: flex;
        width: fit-content;
        padding: 3px 8px;
        justify-content: center;
        align-items: center;

        border-radius: 4px;
        background: @grey-100;

        &:hover:not(.btn-selected) {
            background: @grey-200;
        }

        .card-item-btn-text {
            color: @grey-600;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
        }

        .btn-count {
            color: @blue-500;
            font-weight: 700;
        }
    }

    .btn-selected {
        background: @blue-500;

        .card-item-btn-text,
        .btn-count {
            color: white;
        }
    }

    .btn-disabled {
        background: @grey-200 !important;
        cursor: not-allowed;

        .btn-count {
            color: @grey-400;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
        }
    }
}
</style>
