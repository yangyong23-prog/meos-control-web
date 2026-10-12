import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 实时监测 - 历史回放
export const queryAllSpaceHistoryInfo = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/queryAllSpaceHistoryInfo', params);
// 实时监测 - 实时温度、二氧化碳分布
export const querySpaceTempDistributionByObjectId = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/querySpaceTempDistributionByObjectId', params);
// 实时监测 - 异常空间列表
export const queryRealAbnormalSpaceList = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/queryRealAbnormalSpaceList', params);
// 实时监测 - 空间运行数据/异常时段
export const querySpaceRunningInfo = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/querySpaceRunningInfo', params);
// 实时监测 - 需求配置中的目标值
export const getSpaceDeficiency = () => http.get(INTERFACE_PREFIX_MEOS + '/air-terminal/getSpaceDeficiency?id=spaceDeficiency');
// 实时监测 - 查询供冷季、供暖季
export const queryProjectSeason = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/queryProjectSeason', params);
// 调度监测 - 空间品质调度
export const querySpaceQualityCalculateStatistics = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/air-terminal/querySpaceQualityCalculateStatistics', params);
// 调度监测 - 价值选择
export const queryCurrentTempAndCarbonRate = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/valueSelection/currentTempAndCarbonRate', params);
