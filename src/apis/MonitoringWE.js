import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 查询系统列表
export const getListSystems = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/weakPower/listSystems`, postData, config);
// export const getListSystems = (postData, config) => http.post('https://m1.apifoxmock.com/m1/4266741-3908487-default/weakPower/listSystems', postData, config);

// 获取树数据
export const getTreeEquipments = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/weakPower/treeEquipments`, postData, config);

// export const getTreeEquipments = (postData, config) => http.post('https://m1.apifoxmock.com/m1/5429415-5104228-default/weakPower/treeEquipments', postData, config);
// export const getTreeEquipments = (postData, config) => http.post('https://m1.apifoxmock.com/m1/4266741-3908487-default/weakPower/treeEquipments', postData, config);

/*
 * @description: 查询-信息点配置-按对象
 * @param {} params
 * @return {*}
 */
export const listInfoCodeConfigsByObject = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', params, config);
};
