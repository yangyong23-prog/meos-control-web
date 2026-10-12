import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 查询-统计信息
 * @param params
 * @returns
 */
export const getStatisticsAxios = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/statistics', params, config);

/**
 * 批量查询分精度数据
 * 开始时间，yyyy-MM-dd HH:mm:ss
 * beginDate: string;
 * 结束时间，yyyy-MM-dd HH:mm:ss
 * endDate: string;
 * 数据时间类型
 * enumTime: string;
 * 查询信息点列表
 * infoCodes: string[];
 * 对象 ID 列表
 * objectIds: string[];
 */
export const getBatchQueryPeriodDataAxios = (params, config) => http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/batchQueryPeriodData`, params, config);

/**
 * @description: 查询-获取分析数据树
 * @param {*} analysisType FREEZE_SIDE、COOLING_SIDE、END_PUMP_GROUP
 * @return {*}
 */
// export const getAnalysisDataTreeAxios = (data, config) => http.post(`http://172.16.2.165:8089/runAnalysis/getAnalysisDataTree`, data, config);
export const getAnalysisDataTreeAxios = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS}/runAnalysis/getAnalysisDataTree`, data, config);

/**
 * 查询-运行日志列表
 */
// export const listRunningLogByDate = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/runningLog/listRunningLogByDate', params, config);
// 因不支持分页新换接口
export const queryLogListByPage = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/runningLog/queryListByPage', params, config);

/**
 * 查询-某一级菜单下的所有二级菜单
 */
export const listSecondLevelCategory = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/runningLog/listSecondLevelCategory', params, config);

/**
 * @description: 查询-获取分析类型
 * @param {*}
 * @return {*}
 */
export const getListAnalysisTypeAxios = time => http.get(`${INTERFACE_PREFIX_MEOS}/runAnalysis/listAnalysisType/${time}`);
// export const getListAnalysisTypeAxios = time => http.get(`http://172.16.2.165:8089/runAnalysis/listAnalysisType/${time}`);

/**
 * @description: 查询-能耗曲线数据
 * @param {*} queryDate 查询日期
 * @param {*} valueSelectionType 值选择类型 VALUE_SELECT_LOWEST_CAST VALUE_SELECT_LOWEST_CARBON_EMISSIONS VALUE_SELECT_LOWEST_ENERGY VALUE_SELECT_QUALITY_FIRST
 * @return {*}
 */
export const getListEnergyCurveDataAxios = (params, config) => http.post(`${INTERFACE_PREFIX_MEOS}/runAnalysis/listEnergyCurveData`, params, config);

/**
 * @description: 查询-根据设备类编码获取系统列表
 * @param {*} clasCode 设备类编码
 * @return {*}
 */
export const getListSystemByClassCodeAxios = clasCode => http.get(`${INTERFACE_PREFIX_MEOS}/system/listSystemByClassCode/${clasCode}`);

// 查询末端空间记录数据
export const getAirSpaceRecord = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/airConditioner/querySpaceList', params, config);
};
// 根据空间ID查询空间
export const getSpaceListByIds = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listSpaces', params, config);
};

// 根据classCode查询 末端设备列表
export const getAirEquipListByClassCode = (params, config) => {
    return http.post(`${INTERFACE_PREFIX_MEOS}/runAnalysis/listEquip`, params, config);
};
// 根据设备ID查询信息点
export const getInfoCodeListByEquipIds = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/listInfoCode', params, config);
};

/**
 * 获取空间详情
 *
 * @param {Object} params - 请求参数对象，包含需要传递给服务器的数据
 * @param {Object} config - Axios配置对象，用于设置请求的配置信息
 * @returns {Promise} 返回一个Promise对象，用于处理异步请求的结果
 */
export const getSpaceDetailAxios = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/spaceDetail', params, config);
};

/**
 * @description: 查询-信息点配置-按对象
 * @param {} params
 * @return {*}
 */
export const listInfoCodeConfigsByObject = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', params, config);
};
/**
 * @description: 查询-设备分析-设备类
 * @param {} params
 * @return {*}
 */
export const listTerminalClassCode = (secondType, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + `/runAnalysis/listTerminalClassCode/${secondType}`, null, config);
};
