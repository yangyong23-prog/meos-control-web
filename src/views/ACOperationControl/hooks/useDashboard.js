import { useDashboardEnvStatus } from './useDashboardEnvStatus';
import { useDashboardFilterState } from './useDashboardFilterState';
import { useFlattenedSpaces } from './useFlattenedSpaces';

// 保持原有注入 key 的导入路径不变：组件仍从 '../hooks/useDashboard' 取 key
// 注意：只 re-export 注入键（Symbol），不导出 composable 函数，防止被直接调用绕过 facade
export {
    tdbEnvStatusMapKey,
    co2EnvStatusMapKey,
    rhEnvStatusMapKey,
    tdbStatusStatisticsInjectKey,
    co2StatusStatisticsInjectKey,
    rhStatusStatisticsInjectKey,
    pressureDiffEnvStatusMapKey,
    pressureDiffStatisticsInjectKey,
    tdbScheduleStatusGroupKey,
    cO2ScheduleStatusGroupKey
} from './useDashboardEnvStatus';
export {
    dashboardOnlyShowIOTMonitorSpaceInjectKey,
    dashboardScheduleValueFilterInjectKey,
    dashboardAbnormalSpaceFilterInjectKey,
    dashboardCurrentEnvInjectKey,
    dashboardCurrentEnvWithScopeInjectKey,
    dashboardCurrentBuildingObjInjectKey,
    dashboardCurrentBuildingFloorObjInjectKey,
    dashboardEnvTabsInjectKey,
    dashboardFilterEnvStatusInjectKey,
    curDashboardStaticsEnvParamKey,
    isRhQualityEnabledKey,
    isPressureDiffEnabledKey,
    currentItemTitleInjectKey
} from './useDashboardFilterState';
export { flattenedSpacesInjectKey, flattenedSpacesMapInjectKey } from './useFlattenedSpaces';

// 看板状态门面：组合三个聚焦深模块（环境/调度状态、过滤/选择状态、拍平空间），
// 各自 provide 自己的注入 key，组件消费方无需改动。
export default () => {
    const flattenedApi = useFlattenedSpaces();
    const filterApi = useDashboardFilterState();
    const envStatusApi = useDashboardEnvStatus(flattenedApi.flattenedSpacesMap);

    return {
        dashboardCurrentEnv: filterApi.dashboardCurrentEnv,
        dashboardOnlyShowIOTMonitorSpace: filterApi.dashboardOnlyShowIOTMonitorSpace,
        dashboardEnvTabs: filterApi.dashboardEnvTabs,
        dashboardCurrentBuildingObj: filterApi.dashboardCurrentBuildingObj,
        flattenedSpaces: flattenedApi.flattenedSpaces,
        flattenedSpacesMap: flattenedApi.flattenedSpacesMap,
        tdbEnvStatusMap: envStatusApi.tdbEnvStatusMap,
        co2EnvStatusMap: envStatusApi.co2EnvStatusMap,
        rhEnvStatusMap: envStatusApi.rhEnvStatusMap,
        pressureDiffEnvStatusMap: envStatusApi.pressureDiffEnvStatusMap,
        updateSpaceEnvStatus: envStatusApi.updateSpaceEnvStatus
    };
};
