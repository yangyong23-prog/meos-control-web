import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 查询-楼层中的机器人
 * @param params
 * @returns
 */
export const robotList = params => http.get(INTERFACE_PREFIX_MEOS + '/robot/listOfFloor', params);
