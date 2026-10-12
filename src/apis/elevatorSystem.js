import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 查询-电梯运行控制统计-直梯
 */
export const statisticsVerticalRunningData = postData => http.post(`${INTERFACE_PREFIX_MEOS}/elevator/statisticsVerticalRunningData`, postData);
/**
 * 查询-电梯运行控制统计-扶梯
 */
export const statisticsEscalatorRunningData = postData => http.post(`${INTERFACE_PREFIX_MEOS}/elevator/statisticsEscalatorRunningData`, postData);

/**
 * 异常事件列表
 * @returns
 */
export const getAbnormalDataList = postData => http.post(`${INTERFACE_PREFIX_MEOS}/abnormalEvent/getAbnormalDataListDivideSystem`, postData);
