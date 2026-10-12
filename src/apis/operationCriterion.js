import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 查询-某日营业时间的配置情况
 * @param params
 * @returns
 */
export const previewProjectBusinessTime = (params, config = {}) => http.post(INTERFACE_PREFIX_MEOS + '/running-standard/previewProjectBusinessTime', params, config);

/**
 * 查询-某日特殊需求配置项中引用对象列表

 * @param params
 * @returns
 */
export const previewReferenceSpaceDetail = (params, config = {}) => http.post(INTERFACE_PREFIX_MEOS + '/running-standard/previewReferenceSpaceDetail', params, config);
// export const previewReferenceSpaceDetail = params => http.post('https://apifoxmock.com/m1/5429415-5104228-default' + '/running-standard/previewReferenceSpaceDetail', params);

/**
 * 查询-某个对象得工作历引用条数
 * @param params
 * @returns
 */
// export const specialBusinessTimeQuoteCount = params => http.post('https://apifoxmock.com/m1/5429415-5104228-default' + '/running-standard/specialBusinessTimeQuoteCount', params);
export const specialBusinessTimeQuoteCount = (params, config = {}) => http.post(INTERFACE_PREFIX_MEOS + '/running-standard/specialBusinessTimeQuoteCount', params, config);

/**
 * 查询-某日空调运行标准
 * @param params
 * @returns
 */
export const previewProjectGlobalConfig = (params, config = {}) => http.post(INTERFACE_PREFIX_MEOS + '/running-standard/previewProjectGlobalConfig', params, config);

/**
 * 查询-某日空调运行标准 空间调度是否参与调度
 * @param params
 * @returns
 */
export const previewParticipateInScheduling = (params, config = {}) => http.post(INTERFACE_PREFIX_MEOS + '/running-standard/participateInScheduling', params, config);

/**
 * 查询-某日价值选择方案
 * @param params
 * @returns
 */
export const previewProjectValueSelect = (params, config = {}) => http.post(INTERFACE_PREFIX_MEOS + '/running-standard/previewProjectValueSelect', params, config);

/**
 * 查询-某日特殊需求配置项
 * @param params
 * @returns
 */
export const previewSpecialDemandConfig = (params, config = {}) => http.post(INTERFACE_PREFIX_MEOS + '/running-standard/previewSpecialDemandConfig', params, config);
