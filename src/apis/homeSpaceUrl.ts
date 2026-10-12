import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 获取3D模型 域名
 * @param params
 * @returns
 */
export const getSpaceUrl = () => http.post(INTERFACE_PREFIX_MEOS + '/persagyWeb/serviceUrl');

// /**
//  * 获取全楼信息
//  * @param params
//  * @returns
//  */
export const getTheEntireBuildinglink = (params: any) => http.post(INTERFACE_PREFIX_MEOS + '/instance/listFloors', params);
