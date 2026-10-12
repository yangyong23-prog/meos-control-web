import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_MEOS_DTP, INTERFACE_PREFIX_BDTP_KNOWLEDGE } from '@/config';
import { isEdge } from '@/utils/envUtils';
const url = () => (isEdge() ? INTERFACE_PREFIX_MEOS_DTP : INTERFACE_PREFIX_MEOS);
export const getLightingEquipmentList = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS}/instance/listEquipments/LIGHTING`, data, config);
// export const getLightingEquipmentList = (data, config) => http.post(`https://m1.apifoxmock.com/m1/5622601-5302169-default/instance/listEquipments/LIGHTING`, data, config);
// 照度监测
export const getIllumInfo = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getIllumInfo', params);
};

// 日出日落时间
export const sunRiseAndSet = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/weather/sunRiseAndSet', params);
};

// 干预任务列表查询
export const interventionTaskConfig = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/interventionTaskConfig/list', params, config);
    // return http.post('https://m1.apifoxmock.com/m1/5622601-5302169-default/interventionTaskConfig/list?apifoxApiId=401821426', params, config);
};
// 查询照明空间的回路功能类型和关联的控制模块
export const getSpaceFuncTypeCircuitController = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/interventionTaskConfig/lighting/getSpaceFuncTypeCircuitController', params, config);
};
// 干预任务配置新增or编辑接口
export const saveOrUpdateTaskConfig = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/interventionTaskConfig/saveOrUpdate', params, config);
};

// 干预任务配置删除接口
export const removeTaskConfig = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/interventionTaskConfig/remove', params, config);
};

// 知识库获取信息码
export const getInfoCode = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/knowledge/getInfoCode', params, config);
};
// 获取场景列表
export const listByInstanceIds = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/instanceGroup/listByInstanceIds', params, config);
};
// 照明目标需求查询
// 接口设计文档：https://s.apifox.cn/de50b312-408c-4b2c-bcbb-857488fa49d9/api-399013439
export const getDemandTarget = (params, signal) => {
    if (signal) {
        return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getDemandTarget', params, { signal });
    }
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/getDemandTarget', params);
};

export const manulalControl = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/interventionTaskConfig/manulalControl', params, config);
};
