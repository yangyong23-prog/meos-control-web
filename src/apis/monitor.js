// 运行监控  相关接口

import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_AIM, MEOI_AIM_PREFIX } from '@/config';

import iotExpireManager from '@/utils/iotExpireManager';
/**
 * 菜单配置
 * @param params
 * @returns
 */
export const getMenuConfig = params => http.get(`${INTERFACE_PREFIX_MEOS}/system/graph/menu/config`, params);

/**
 * 查询-批量查询 设备的iot 信息 by ids & infoCodes
 */
export const batchQueryInfoCodeConfig = (postData, abortSignal) => {
    return new Promise((resolve, reject) => {
        http.post(`${INTERFACE_PREFIX_MEOS}/running-monitor/batchQueryInfoCodeConfig`, postData, { signal: abortSignal }).then(
            res => {
                if (res?.data) {
                    Object.entries(res?.data)?.forEach(([objectId, infos]) => {
                        infos?.forEach(info => {
                            iotExpireManager?.addIot({ ...info, objectId }, 'API');
                        });
                    });
                }
                resolve(res);
            },
            err => {
                reject(err);
            }
        );
    });
};

/**
 * 查询-批量查询对象的iot 信息 by ids & infoCodes
 */
export const batchQueryInfoCode = (postData, abortSignal) => {
    return new Promise((resolve, reject) => {
        http.post(`${INTERFACE_PREFIX_MEOS}/running-monitor/batchQueryInfoCode`, postData, { signal: abortSignal }).then(
            res => {
                if (res?.data) {
                    res.data.forEach(obj => {
                        iotExpireManager?.addIot({ ...obj }, 'API');
                    });
                    // Object.entries(res?.data)?.forEach(([objectId, infos]) => {
                    //     infos?.forEach(info => {
                    //         iotExpireManager?.addIot({ ...info, objectId }, 'API');
                    //     });
                    // });
                }
                resolve(res);
            },
            err => {
                reject(err);
            }
        );
    });
};

/**
 *
 * 根据系统查询3D下模型数据
 * @returns
 */
export const queryModelInstancesBySystemId = (postData, abortSignal) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/running-monitor/queryObjectGroupInfoBySystemId`, postData, { signal: abortSignal });

export const listInfoCodeConfigsByObjectFilters = (postData, signal) =>
    http.post(`${INTERFACE_PREFIX_MEOS}/equipment/infoCodeConfig/listInfoCodeConfigsByObjectFilters`, postData, { signal });
/**
 * 批量查询分精度数据
 */
export const batchQueryPeriodData = params => http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/batchQueryPeriodData`, params);
/**
 * 查询-是否有绑点信息
 */
export const queryObjectsExistRule = params => http.post(`${INTERFACE_PREFIX_MEOS}/knowledge/queryObjectsExistRule`, params);
