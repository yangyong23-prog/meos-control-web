import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 所有停车场车位类型统计
 */
export const parkingSpaceStatistics = postData => http.post(`${INTERFACE_PREFIX_MEOS}/parking/parkingSpace/statistics`, postData);
/**
 * 停车场设备统计
 */
export const parkingEquipmentStatistics = postData => http.post(`${INTERFACE_PREFIX_MEOS}/parking/equipment/statistics`, postData);
/**
 * 楼层的车位统计
 */
export const floorParkingSpaceStatistics = postData => http.post(`${INTERFACE_PREFIX_MEOS}/parking/floor/parkingSpace/statistics`, postData);
/**
 * 车位网格图统计
 */
export const parkingSpaceGridStatistics = postData => http.post(`${INTERFACE_PREFIX_MEOS}/parking/parkingSpace/grid/statistics`, postData);

/**
 * 异常事件列表
 * @returns
 */
export const getAbnormalDataList = postData => http.post(`${INTERFACE_PREFIX_MEOS}/abnormalEvent/getAbnormalDataListDivideSystem`, postData);

/**
 * 设备信息点配置
 * @returns
 */
export const listInfoCodeConfigsByObject = postData => http.post(`${INTERFACE_PREFIX_MEOS}/equipment/infoCodeConfig/listInfoCodeConfigsByObject`, postData);
