<template>
    <template v-if="isCardsLoading">
        <m-list-skeleton class="loading-wrap" :item-num="6" />
    </template>
    <!-- 折叠内容 -->
    <FoldWrap
        v-else
        v-model="proxyList"
        :data="foldDataList"
        :btn-enable-num="cardSize"
        :expand-text="i18n.global.t('meos_control_web.expand_all')"
        :btn-distance-y="'4'"
        :btn-distance-bottom-y="'4'"
        :type="'dashboard'"
    >
        <div ref="contentElementRef" :style="pjStatisticsCardColumn" :class="['cards-statistics-container']">
            <template v-for="item in proxyList" :key="item.id">
                <div v-if="item.id === DASHBOARD_CARD_IDS.TDB_STATUS_STATISTICS" class="card-item">
                    <CardTitle :title="i18n.global.t('meos_control_web.temperature_distribution')">
                        <template #right>
                            <div
                                v-if="showScheduleStatus(DASHBOARD_ENV_BELONG_IDS.TDB)"
                                :class="['right-operate-btn', tdbScheduleStatusGroupCount ? '' : 'disabled', modalIdTitle.id === DASHBOARD_ENV_BELONG_IDS.TDB ? 'selected' : '']"
                                @click="openModal(DASHBOARD_ENV_BELONG_IDS.TDB, tdbScheduleStatusGroupCount)"
                            >
                                <span v-ellipsis class="title">{{ i18n.global.t('meos_control_web.space_scheduling_count') }}:</span
                                ><span class="amount">{{ tdbScheduleStatusGroupCount }}</span>
                                <svg v-if="tdbScheduleStatusGroupCount" class="icon" aria-hidden="true" style="height: 20px; width: 20px">
                                    <use xlink:href="#icon-you" />
                                </svg>
                            </div>
                        </template>
                    </CardTitle>
                    <PieChartStatistic :type="DASHBOARD_ENV_BELONG_IDS.TDB" :data-statistics="tdbStatusCount" :select-item="curDashboardStaticsEnvParam" @click-item="clickItem" />
                </div>
                <div v-if="item.id === DASHBOARD_CARD_IDS.CO2_STATUS_STATISTICS" class="card-item">
                    <CardTitle :title="i18n.global.t('meos_control_web.co2_concentration_distribution')">
                        <template #right>
                            <div
                                v-if="showScheduleStatus(DASHBOARD_ENV_BELONG_IDS.CO2)"
                                :class="['right-operate-btn', cO2ScheduleStatusGroupCount ? '' : 'disabled', modalIdTitle.id === DASHBOARD_ENV_BELONG_IDS.CO2 ? 'selected' : '']"
                                @click="openModal(DASHBOARD_ENV_BELONG_IDS.CO2, cO2ScheduleStatusGroupCount)"
                            >
                                <span v-ellipsis class="title">{{ i18n.global.t('meos_control_web.space_scheduling_count') }}:</span>
                                <span class="amount">{{ cO2ScheduleStatusGroupCount }}</span>
                                <svg v-if="cO2ScheduleStatusGroupCount" class="icon" aria-hidden="true" style="height: 16px; width: 16px">
                                    <use xlink:href="#icon-you" />
                                </svg>
                            </div>
                        </template>
                    </CardTitle>
                    <PieChartStatistic :type="DASHBOARD_ENV_BELONG_IDS.CO2" :select-item="curDashboardStaticsEnvParam" :data-statistics="co2StatusCount" @click-item="clickItem" />
                </div>
                <div v-if="item.id === DASHBOARD_CARD_IDS.RH_STATUS_STATISTICS && isRhQualityEnabled" class="card-item">
                    <CardTitle :title="i18n.global.t('meos_control_web.humidity_distribution')"> </CardTitle>
                    <PieChartStatistic :type="DASHBOARD_ENV_BELONG_IDS.RH" :select-item="curDashboardStaticsEnvParam" :data-statistics="rhStatusCount" @click-item="clickItem" />
                </div>
                <div v-if="item.id === DASHBOARD_CARD_IDS.PRESSURE_DIFF_STATISTICS && isPressureDiffEnabled" class="card-item">
                    <CardTitle :title="i18n.global.t('meos_control_web.pressure_diff_distribution')"> </CardTitle>
                    <PieChartStatistic
                        :type="DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF"
                        :select-item="curDashboardStaticsEnvParam"
                        :data-statistics="pressureDiffCount"
                        @click-item="clickItem"
                    />
                </div>
                <div v-if="item.id === DASHBOARD_CARD_IDS.EQUIP_STATISTIC_CARD" class="card-item">
                    <CardTitle :title="i18n.global.t('common.end_equipment')">
                        <template #right>
                            <m-button v-if="showRunningStatistics" type="default" size="small" style="margin-right: 10px" @click="openRunningStatistics">{{
                                i18n.global.t('meos_control_web.run_total')
                            }}</m-button>
                            <m-button type="default" size="small" @click="equipmentBtn">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
                        </template>
                    </CardTitle>
                    <ACEquipmentCard />
                </div>
            </template>
        </div>
    </FoldWrap>
    <SpaceScheduleModalList v-model="showModal" :env="modalIdTitle.id" :title="modalIdTitle.title" :data="modalData" />
</template>
<script setup>
import i18n from '@/localization';
import CardTitle from './CardTitle.vue';
import ACEquipmentCard from './ACEquipmentCard.vue';
import { useResizeObserver } from '@vueuse/core';
import { useQiankunElementSize } from '@/hooks/useQiankunElementSize';
import PieChartStatistic from './PieChartStatistic.vue';
import SpaceScheduleModalList from '../components/SpaceScheduleModalList.vue';
import { equipLoadedEmptyKey, equipLoadingKey, floorToSpaceIdsMapKey } from '../hooks/useACGlobalData';
import {
    tdbStatusStatisticsInjectKey,
    co2StatusStatisticsInjectKey,
    rhStatusStatisticsInjectKey,
    dashboardFilterEnvStatusInjectKey,
    curDashboardStaticsEnvParamKey,
    isRhQualityEnabledKey,
    isPressureDiffEnabledKey,
    pressureDiffStatisticsInjectKey
} from '../hooks/useDashboard';
import { DASHBOARD_ENV_BELONG_IDS, DASHBOARD_CARD_IDS } from '../constants/constant';
import { currentFloorObjKey, spaceIotDataLoadingKey, spaceStaticDataLoadingKey, envParamShellConfigKey } from '../injectKeys';
import FoldWrap from '@/components/common/FoldWrap.vue';
import { debounce } from 'lodash';
import { useTemplateRef } from 'vue';
import { dashboardEquipment } from '@/apis/ACOperationControl';
import { SPACE_GRID_PREFIX, envToScheduleStatusMap } from '../variables';
import { useEnvStatusCounts } from './useEnvStatusCounts';
import { useScheduleStatusModal } from './useScheduleStatusModal';
import { AIR_TERMINAL, TABLE_LIST, OBJ_TYPE } from '@/utils/globalVariables';

const hasData = dataStatistics => {
    return Object.values(dataStatistics).reduce((partialSum, a) => partialSum + a, 0);
};
const equipLoadedEmpty = inject(equipLoadedEmptyKey);
const curDashboardStaticsEnvParam = inject(curDashboardStaticsEnvParamKey);
const isRhQualityEnabled = inject(isRhQualityEnabledKey);
const isPressureDiffEnabled = inject(isPressureDiffEnabledKey);
const contentElementRef = useTemplateRef('contentElementRef');
const { width: contentElementWidth } = useQiankunElementSize(contentElementRef);
const proxyList = ref([]);

// 卡片列表
const foldDataList = computed(() => {
    const list = [];

    if (hasData(tdbStatusStatistics.value || {})) {
        list.push({
            id: DASHBOARD_CARD_IDS.TDB_STATUS_STATISTICS,
            type: DASHBOARD_CARD_IDS.TDB_STATUS_STATISTICS
        });
    }
    if (hasData(co2StatusStatistics.value || {})) {
        list.push({
            id: DASHBOARD_CARD_IDS.CO2_STATUS_STATISTICS,
            type: DASHBOARD_CARD_IDS.CO2_STATUS_STATISTICS
        });
    }
    if (hasData(rhStatusStatistics.value || {}) && isRhQualityEnabled.value) {
        list.push({
            id: DASHBOARD_CARD_IDS.RH_STATUS_STATISTICS,
            type: DASHBOARD_CARD_IDS.RH_STATUS_STATISTICS
        });
    }
    if (hasData(pressureDiffStatistics.value || {}) && isPressureDiffEnabled.value) {
        list.push({
            id: DASHBOARD_CARD_IDS.PRESSURE_DIFF_STATISTICS,
            type: DASHBOARD_CARD_IDS.PRESSURE_DIFF_STATISTICS
        });
    }
    if (!equipLoadedEmpty.value) {
        list.push({
            id: DASHBOARD_CARD_IDS.EQUIP_STATISTIC_CARD,
            type: DASHBOARD_CARD_IDS.EQUIP_STATISTIC_CARD
        });
    }

    return list;
});

const tdbStatusStatistics = inject(tdbStatusStatisticsInjectKey);
const co2StatusStatistics = inject(co2StatusStatisticsInjectKey);
const rhStatusStatistics = inject(rhStatusStatisticsInjectKey);
const pressureDiffStatistics = inject(pressureDiffStatisticsInjectKey);
const filterEnvScope = inject(dashboardFilterEnvStatusInjectKey);

const currentFloorObj = inject(currentFloorObjKey);
const floorToSpaceIdsMap = inject(floorToSpaceIdsMapKey);
const emits = defineEmits(['openEquipmentList', 'openSpaceScheduleModal', 'openRunningStatistics']);

const equipLoading = inject(equipLoadingKey);
const spaceIotDataLoading = inject(spaceIotDataLoadingKey);
const spaceStaticDataLoading = inject(spaceStaticDataLoadingKey);
const isCardsLoading = computed(() => {
    return spaceStaticDataLoading.value || spaceIotDataLoading.value || equipLoading.value;
});

const clickItem = item => {
    filterEnvScope?.(item);
};
const openRunningStatistics = () => {
    emits('openRunningStatistics');
};
const equipmentBtn = () => {
    emits('openEquipmentList');
};
// 各环境参数状态计数（4 份重复逻辑已收进 useEnvStatusCounts）
const { tdbStatusCount, co2StatusCount, rhStatusCount, pressureDiffCount } = useEnvStatusCounts({
    statusStatistics: {
        [DASHBOARD_ENV_BELONG_IDS.TDB]: tdbStatusStatistics,
        [DASHBOARD_ENV_BELONG_IDS.CO2]: co2StatusStatistics,
        [DASHBOARD_ENV_BELONG_IDS.RH]: rhStatusStatistics,
        [DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF]: pressureDiffStatistics
    },
    currentFloorObj,
    floorToSpaceIdsMap
});

// 调度状态弹窗（拼装与开关状态已收进 useScheduleStatusModal）
const { showModal, modalIdTitle, modalData, tdbScheduleStatusGroupCount, cO2ScheduleStatusGroupCount, openModal } = useScheduleStatusModal({
    currentFloorObj,
    floorToSpaceIdsMap,
    emits
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

const cardSize = ref(3);
const pjStatisticsCardColumn = ref(1);

watch([foldDataList, contentElementWidth], () => {
    const cardLength = foldDataList.value?.length ?? 0;

    if (cardLength < 3) {
        cardSize.value = cardLength;
        pjStatisticsCardColumn.value = `margin-bottom: 24px;--system-repeat: repeat(${cardLength},  minmax(0, 1fr))`;
        return;
    } else {
        cardSize.value = 3;
        pjStatisticsCardColumn.value = 'margin-bottom: 24px;--system-repeat: repeat(3,  minmax(0, 1fr));';
        // const width = contentElementRef.value?.clientWidth ?? 0;
        if (contentElementWidth.value < 1080) {
            cardSize.value = 2;
            pjStatisticsCardColumn.value = '--system-repeat: repeat(2,  minmax(0, 1fr))';
        }
    }
});
const showRunningStatistics = ref(false);
const getEquipmentVisible = () => {
    dashboardEquipment({
        runningMonitorType: AIR_TERMINAL,
        templateType: TABLE_LIST,
        objectType: OBJ_TYPE.EQUIPMENT
    })
        .then(res => {
            const resData = res?.data || [];
            showRunningStatistics.value = !!resData?.length;
        })
        .catch(err => {
            console.log('showRunningStatistics', err);
            showRunningStatistics.value = false;
        });
};
onMounted(() => {
    getEquipmentVisible();
});
</script>
<style scoped lang="less">
.cards-statistics-container {
    user-select: none;
    grid-template-columns: var(--system-repeat);
    display: grid;
    gap: 12px;
    align-items: stretch;
    position: relative;
    // padding-top: 16px;
    padding-left: 16px;
    padding-right: 16px;
}

.loading-wrap {
    height: 272px;
    padding: 12px 16px 12px 16px;
}

.card-item {
    min-height: 284px;
    min-width: 300px;
    flex: 1;
    height: 302px;
    align-self: stretch;
    padding: 12px 16px 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);

    .right-operate-btn {
        display: flex;
        padding: 3px 4px 3px 8px;
        align-items: center;
        justify-content: space-between;
        color: var(--gray-600, #626c78);
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
        background: rgba(241, 244, 246, 1);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
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

        &.selected {
            background: var(--blue-500, #246fe5);
            color: var(--Grey-Grey-0, #fff);

            .amount {
                color: var(--Grey-Grey-0, #fff);
            }

            .icon {
                fill: #fff;
            }
        }

        &:hover:not(.disabled):not(.selected) {
            background-color: rgba(196, 201, 207, 0.3);
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
</style>
