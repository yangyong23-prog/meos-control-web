import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP } from '@/config';
// const INTERFACE_PREFIX_MEOS = '/yiheng-common-web';
// 查询-统计空间关联设备手自动状态
export const countSpaceRelatedEquipManualAutoStatus = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/running-monitor/countSpaceRelatedEquipManualAutoStatus', params);
};
// 批量-手自动模式切换
export const changeManualAutoStatusByObjectIds = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualAutoStatusByObjectIds', params);
};
// 批量-手自动模式切换（0802迭代优化新加接口）
export const changeManualAutoStatusAndEquipSwitchSetByObjectIds = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/changeManualAutoStatusAndEquipSwitchSetByObjectIds', params);
};
// 查询-空间详情
export const getSpaceDetail = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getSpaceDetail', params);
};
// 查询-模块详情
export const getControllerDetail = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getControllerDetail', params);
};
// 手自动模式修改到期时间
export const changeManualExpireTimeByObjectId = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS_DTP + '/running-monitor/changeManualExpireTimeByObjectId', params);
};
// 开启关闭
export const setOperatingParameters = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/setOperatingParameters', params);
};

// 批量开启关闭（0802迭代优化新加接口）
export const setOperatingParametersReturnInfo = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/setOperatingParametersReturnInfo', params);
};

// 干预列表查询
export const listConifgs = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/intervention/config/list', params);
};
// 解除干预
export const release = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/intervention/release', params);
};
