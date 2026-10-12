import { shallowRef, triggerRef, computed, provide, onUnmounted } from 'vue';
import DockSingleton from '@/hooks/responsiveDock';
import { DASHBOARD_ENV_BELONG_IDS } from '../constants/constant';
import { getSpaceEnvStatus, getSpaceScheduleInfo } from '../utils/spaceStatus';

const EMPTY_STATUS = '';
const UNKNOWN_SCHEDULE_STATUS = '--';

// 环境/调度状态簇：空间维度下各环境参数的状态映射、状态分组统计、调度状态分组。
export const tdbEnvStatusMapKey = Symbol('tdbEnvStatusMapKey');
export const co2EnvStatusMapKey = Symbol('co2EnvStatusMapKey');
export const rhEnvStatusMapKey = Symbol('rhEnvStatusMapKey');
export const tdbStatusStatisticsInjectKey = Symbol('tdbStatusStatisticsInjectKey');
export const co2StatusStatisticsInjectKey = Symbol('co2StatusStatisticsInjectKey');
export const rhStatusStatisticsInjectKey = Symbol('rhStatusStatisticsInjectKey');
export const pressureDiffEnvStatusMapKey = Symbol('pressureDiffEnvStatusMapKey');
export const pressureDiffStatisticsInjectKey = Symbol('pressureDiffStatisticsInjectKey');
export const tdbScheduleStatusGroupKey = Symbol('tdbScheduleStatusGroupKey');
export const cO2ScheduleStatusGroupKey = Symbol('cO2ScheduleStatusGroupKey');

const { getIotData, getCustomInfo } = DockSingleton.getInstance();

// 环境参数看板状态 store：持有 tdb/co2/rH/压差 四类环境状态映射与调度状态映射，
// 并提供基于空间 id 批量刷新的 updateSpaceEnvStatus。
// flattenedSpacesMap 由 useFlattenedSpaces 提供，用于读取空间静态信息，故作为参数注入。
export const useDashboardEnvStatus = flattenedSpacesMap => {
    // shallowRef: 避免每次 SSE 更新时整体展开拷贝大对象
    // 配合 Object.assign + triggerRef 实现就地突变 + 精确触发
    const tdbEnvStatusMap = shallowRef({});
    const co2EnvStatusMap = shallowRef({});
    const rhEnvStatusMap = shallowRef({});
    const pressureDiffEnvStatusMap = shallowRef({});
    const tdbScheduleStatusMap = shallowRef({});
    const co2ScheduleStatusMap = shallowRef({});

    const groupByStatus = statusObj => {
        const statusGroup = {};
        for (const key in statusObj) {
            const val = statusObj[key];
            (statusGroup[val] ||= []).push(key);
        }
        return statusGroup;
    };

    // 环境状态分组-空间ids
    const tdbStatusStatistics = computed(() => groupByStatus(tdbEnvStatusMap.value || {}));
    const co2StatusStatistics = computed(() => groupByStatus(co2EnvStatusMap.value || {}));
    const rhStatusStatistics = computed(() => groupByStatus(rhEnvStatusMap.value || {}));
    const pressureDiffStatistics = computed(() => groupByStatus(pressureDiffEnvStatusMap.value || {}));

    // 调度状态分组-空间ids
    const tdbScheduleStatusGroup = computed(() => groupByStatus(tdbScheduleStatusMap.value || {}));
    const cO2ScheduleStatusGroup = computed(() => groupByStatus(co2ScheduleStatusMap.value || {}));

    provide(tdbEnvStatusMapKey, tdbEnvStatusMap);
    provide(co2EnvStatusMapKey, co2EnvStatusMap);
    provide(rhEnvStatusMapKey, rhEnvStatusMap);
    provide(tdbStatusStatisticsInjectKey, tdbStatusStatistics);
    provide(co2StatusStatisticsInjectKey, co2StatusStatistics);
    provide(rhStatusStatisticsInjectKey, rhStatusStatistics);
    provide(tdbScheduleStatusGroupKey, tdbScheduleStatusGroup);
    provide(cO2ScheduleStatusGroupKey, cO2ScheduleStatusGroup);
    provide(pressureDiffEnvStatusMapKey, pressureDiffEnvStatusMap);
    provide(pressureDiffStatisticsInjectKey, pressureDiffStatistics);

    const getScheduleStatus = (spaceId, env) => {
        const spaceInfo = flattenedSpacesMap.value?.get(spaceId) || {};
        const { scheduleObj } = getSpaceScheduleInfo(spaceId, spaceInfo, env, getCustomInfo);
        if (!scheduleObj) return EMPTY_STATUS;
        const { dataSource, dataValue } = scheduleObj;
        if (dataValue) {
            const { code } = dataSource.find(item => item.code === dataValue) || {};
            return code;
        }
        return UNKNOWN_SCHEDULE_STATUS;
    };

    const statusHelpers = { getIotData, getCustomInfo };

    const updateSpaceEnvStatus = spaceIds => {
        const total = spaceIds.length;
        if (!total) return;

        // 统一收集所有更新，末尾一次性 triggerRef
        const tdbUpdates = {};
        const co2Updates = {};
        const rhUpdates = {};
        const pressureDiffUpdates = {};
        const tdbScheduleUpdates = {};
        const co2ScheduleUpdates = {};

        // 布尔标志替代 Object.keys().length，避免创建临时数组
        let hasTdb = false,
            hasCo2 = false,
            hasRh = false,
            hasPressureDiff = false,
            hasTdbSchedule = false,
            hasCo2Schedule = false;

        for (let i = 0; i < total; i++) {
            const spaceId = spaceIds[i];

            const tdbObj = getIotData(spaceId, DASHBOARD_ENV_BELONG_IDS.TDB);
            if (tdbObj?.existsIotRule) {
                tdbUpdates[spaceId] = getSpaceEnvStatus(spaceId, DASHBOARD_ENV_BELONG_IDS.TDB, statusHelpers);
                hasTdb = true;
            }

            const co2Obj = getIotData(spaceId, DASHBOARD_ENV_BELONG_IDS.CO2);
            if (co2Obj?.existsIotRule) {
                co2Updates[spaceId] = getSpaceEnvStatus(spaceId, DASHBOARD_ENV_BELONG_IDS.CO2, statusHelpers);
                hasCo2 = true;
            }

            const rhObj = getIotData(spaceId, DASHBOARD_ENV_BELONG_IDS.RH);
            if (rhObj?.existsIotRule) {
                rhUpdates[spaceId] = getSpaceEnvStatus(spaceId, DASHBOARD_ENV_BELONG_IDS.RH, statusHelpers);
                hasRh = true;
            }

            const pressureDiffObj = getIotData(spaceId, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF);
            if (pressureDiffObj?.existsIotRule) {
                pressureDiffUpdates[spaceId] = getSpaceEnvStatus(spaceId, DASHBOARD_ENV_BELONG_IDS.PRESSURE_DIFF, statusHelpers);
                hasPressureDiff = true;
            }

            const tdbSchedule = getScheduleStatus(spaceId, DASHBOARD_ENV_BELONG_IDS.TDB);
            if (tdbSchedule) {
                tdbScheduleUpdates[spaceId] = tdbSchedule;
                hasTdbSchedule = true;
            }

            const co2Schedule = getScheduleStatus(spaceId, DASHBOARD_ENV_BELONG_IDS.CO2);
            if (co2Schedule) {
                co2ScheduleUpdates[spaceId] = co2Schedule;
                hasCo2Schedule = true;
            }
        }

        // 统一提交：每个 map 只 triggerRef 一次
        if (hasTdb && tdbEnvStatusMap.value) {
            Object.assign(tdbEnvStatusMap.value, tdbUpdates);
            triggerRef(tdbEnvStatusMap);
        }
        if (hasCo2 && co2EnvStatusMap.value) {
            Object.assign(co2EnvStatusMap.value, co2Updates);
            triggerRef(co2EnvStatusMap);
        }
        if (hasRh && rhEnvStatusMap.value) {
            Object.assign(rhEnvStatusMap.value, rhUpdates);
            triggerRef(rhEnvStatusMap);
        }
        if (hasPressureDiff && pressureDiffEnvStatusMap.value) {
            Object.assign(pressureDiffEnvStatusMap.value, pressureDiffUpdates);
            triggerRef(pressureDiffEnvStatusMap);
        }
        if (hasTdbSchedule && tdbScheduleStatusMap.value) {
            Object.assign(tdbScheduleStatusMap.value, tdbScheduleUpdates);
            triggerRef(tdbScheduleStatusMap);
        }
        if (hasCo2Schedule && co2ScheduleStatusMap.value) {
            Object.assign(co2ScheduleStatusMap.value, co2ScheduleUpdates);
            triggerRef(co2ScheduleStatusMap);
        }
    };

    onUnmounted(() => {
        tdbEnvStatusMap.value = null;
        co2EnvStatusMap.value = null;
        rhEnvStatusMap.value = null;
        pressureDiffEnvStatusMap.value = null;
        tdbScheduleStatusMap.value = null;
        co2ScheduleStatusMap.value = null;
    });

    return {
        tdbEnvStatusMap,
        co2EnvStatusMap,
        rhEnvStatusMap,
        pressureDiffEnvStatusMap,
        updateSpaceEnvStatus
    };
};
