import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 本地联调url:'http://172.16.3.216:18089'
const prefixUrl = INTERFACE_PREFIX_MEOS;

/**
 * 查询空间关联的设备
 * 机房内的全部设备、系统下的设备、系统关联的设备
 * @param {*} params
 * @param {*} config
 * @returns
 */
export const getListEquipmentsToModuleView = (type, params, config) => {
    return http.post(prefixUrl + '/waterSupply/listEquipmentsToModuleView/' + type, params, config);
};

// export const getListModelViewObjects = (params, config) => {
//     return http.post(INTERFACE_PREFIX_MEOS + '/waterSupply/listModieViewObjects', params, config);
// };
