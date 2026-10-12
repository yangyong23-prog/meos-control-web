import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 查询-需求实例树-静态数据
export const getDemandInstanceTreeStaticData = (postData, signal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/treeDemandInstance', postData, {
        signal
    });

// 查询黑名单和屏蔽空间树
export const getBlackListAndShieldSpacesTree = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/listInstanceConfig', postData, {
        signal
    });
};

// 查询项目下所有自定义配置实例对象
export const getAllCustomConfigObjects = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/listCustomizedConfigInstance', postData, {
        signal
    });
};

// 查询-需求实例-楼层下动态空间数据
export const getListDemandSpacesDynamicData = (postData, signal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/demand/listDemandSpaceInFloor', postData, {
        signal
    });

// 查询空间实例是否有引用上级的关系
export const getReferenceParentSpaceByFloor = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/listDemandReferenceParentSpaceByInFloor', postData, {
        signal
    });
};

// 查询冷热源系统树
export const getColdHeatSystemTree = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/treeColdHotSystem', postData, {
        signal
    });
};

// 查询-建筑楼层空间树
export const getTreeBuildingFloorSpace = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/treeBuildingFloorSpace', postData, {
        signal
    });
};

// 查询-自定义配置实例接口
export const listConfigGroups = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/config/listConfigGroups', postData, { signal });
};

// 查询-左侧配置分组
export const listConfigGroupsNew = (postData, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/config/listConfigGroups', postData, config);
};

// 查询-右侧配置详情
export const listConfigsByInstanceNew = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/demand/config/listConfigsByInstance`, postData, config);

// 查询-查询黑名单规则
export const getBlacklist = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/blacklist/query', postData, {
        signal
    });
};

// 查询-新增根据规则查询黑名单空间ID接口
export const getListSpaceIdsByRule = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/blacklist/listSpaceIdsByRule', postData, {
        signal
    });
};

// 查询-新增根据规则查询黑名单空间ID接口
export const addRules = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/blacklist/addRules', postData, {
        signal
    });
};

// 查询-新增根据规则查询黑名单空间ID接口
export const treeSpaceRoomFuncTypes = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/treeSpaceRoomFuncTypes', postData, {
        signal
    });
};
// 查询-需求管理空间功能类型树
export const getTreeSpaceRoomFuncTypes = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/treeSpaceRoomFuncTypes', postData, {
        signal
    });
};

// 查询-需求管理空间功能类型树
export const getTreeSpaceRoomFuncTypesNew = (postData, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/treeSpaceRoomFuncTypes', postData, config);
};

// 查询-特殊配置名称
export const checkConfigGroupNameExists = (postData, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/demand/checkConfigGroupNameExists', postData, {
        signal
    });
};

export const getLightLoopConfigResults = (postData, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/lighting/listCircuitConfigResults', postData, config);
};
