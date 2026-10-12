import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 通风，查询地图数据
export const getEquipmentsAxios = params => {
    // return http.post('https://apifoxmock.com/m1/5622601-0-default' + '/dashboardGridChart/queryEquipment', params);
    return http.post(INTERFACE_PREFIX_MEOS + '/dashboardGridChart/queryEquipment', params);
};

/**
 * @description: 查询-信息点配置-按对象
 * @param {} params
 * @return {*}
 */
export const listInfoCodeConfigsByObject = (params, config) => {
    // return http.post('https://apifoxmock.com/m1/5622601-0-default' + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', params);
    return http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', params, config);
};

/**
 * 查询地图静态数据
 * @param {*} params
 * @returns
 */
export const querySpaceEquipmentList = (params, config) => {
    // return http.post('https://apifoxmock.com/m1/3012854-2709469-default' + '/waterSupplyDrainage/querySpaceEquipmentList', params, config);
    return http.post(INTERFACE_PREFIX_MEOS + '/waterSupplyDrainage/querySpaceEquipmentList', params, config);
};
