import { getEnvScope, DASHBOARD_STATUS_IDS } from '../constants/constant';
import { isSpaceEnvShielded } from './shield';

const DEMAND_CONFIG_INFO_CODE_TYPE = 'DEMAND_CONFIG';

// 计算单个空间在指定环境参数下的看板状态（返回 DASHBOARD_STATUS_IDS 中的状态 id）。
//
// 纯函数：数据源（IOT 实时值 getIotData / 自定义配置 getCustomInfo）通过 dataSource 显式注入，
// 不依赖 DockSingleton 全局单例，便于单测。与 useDashboard、SpaceCardNew、index.vue 过滤 #2 共用同一真相源。
//
// 计算规则：
// 1. 屏蔽优先：若空间该环境参数处于屏蔽区（isSpaceEnvShielded），直接返回 IS_SHIELD，不再判断区间；
// 2. 否则以空间当前 IOT 实时值（getIotData）与 DEMAND_CONFIG 配置的目标区间（getCustomInfo）为输入，
//    交由 getEnvScope 按环境类型（tdb / cO2 / rH / relativePressureDiffToOtherSpace）判定具体区间状态；
// 3. getEnvScope 内部已涵盖无数据（NO_DATA）、无标准（NO_STANDARD）等分支，无需此处再处理。
export const getSpaceEnvStatus = (spaceId, env, dataSource) => {
    const { getIotData, getCustomInfo } = dataSource;
    const limitRangeObj = getCustomInfo(spaceId, DEMAND_CONFIG_INFO_CODE_TYPE, env);
    const valObj = getIotData(spaceId, env);
    if (isSpaceEnvShielded(spaceId, valObj, getIotData)) {
        return DASHBOARD_STATUS_IDS.IS_SHIELD;
    }
    return getEnvScope(valObj?.dataValue, limitRangeObj?.dataValue, env);
};

// 取空间在指定环境下的调度配置对象（纯函数，dataSource 注入，不依赖 DockSingleton）。
// 与 useDashboardEnvStatus.getScheduleStatus / useScheduleStatusModal.openModal 共用同一来源，避免分叉。
export const getSpaceScheduleInfo = (spaceId, spaceData, env, getCustomInfo) => {
    const upperEnv = env?.toUpperCase();
    const curSpaceUpperEnv = spaceData?.[upperEnv] || {};
    const { infoCode, infoCodeType } = curSpaceUpperEnv?.secondGroupSecondInfo || {};
    if (!infoCode || !infoCodeType) {
        return { curSpaceUpperEnv, scheduleObj: null };
    }
    const scheduleObj = getCustomInfo(spaceId, infoCodeType, infoCode);
    return { curSpaceUpperEnv, scheduleObj };
};
