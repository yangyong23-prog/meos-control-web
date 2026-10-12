import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS, INTERFACE_PREFIX_BDTP_KNOWLEDGE } from '@/config';
// 查询筛选分组
export const screenConfig = postData => http.post(`${INTERFACE_PREFIX_MEOS}/security/screenConfig`, postData);

// 查询空间功能类型映射
export const querySpaceFuncTypeMap = () => http.get(`${INTERFACE_PREFIX_BDTP_KNOWLEDGE}/api/type/info/listInfo?typeCode=GeneralZone&infoCode=roomFuncType`);

// TODO 动静分离
// 查询空间安防模型视图
export const querySecurityModelView = postData => http.post(`${INTERFACE_PREFIX_MEOS}/security/querySecurityModelView`, postData);

/**
 * 查询-批量查询对象的iot 信息 by ids & infoCodes
 */
export const batchQueryInfoCode = (postData, abortSignal) => http.post(`${INTERFACE_PREFIX_MEOS}/running-monitor/batchQueryInfoCode`, postData, { signal: abortSignal });

// 查询安防-撤布防空间
export const querySecurityDeploymentSpace = (postData, signal) => http.post(`${INTERFACE_PREFIX_MEOS}/security/listDeploymentSpace`, postData, { signal });

// 查询安防-通行空间接口
export const querySecurityAccessSpace = (postData, signal) => http.post(`${INTERFACE_PREFIX_MEOS}/security/listAccessSpace`, postData, { signal });

// 查询安防-设备列表接口
export const querySecurityEquipmentList = (postData, signal) => http.post(`${INTERFACE_PREFIX_MEOS}/security/listEquipment`, postData, { signal });

// 查询-安防有哪些统计面板(安防功能最低要求)
export const querySecurityStatisticalPanels = () => http.post(`${INTERFACE_PREFIX_MEOS}/security/function`);

// 查询安防 dashboard
export const querySecurityDashboard = postData => http.post(`${INTERFACE_PREFIX_MEOS}/security/dashboard`, postData);

// 编辑监控对像编组
export const editObjectGroup = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/objectGroup/editGroup`, postData, config);

// 删除监控对像编组
export const deleteObjectGroup = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/objectGroup/deleteGroup/${postData.id}`, postData, config);

// 查询编组
export const queryObjectGroup = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/objectGroup/queryGroup`, postData, config);

// 验证编组名称是否存在
export const hasExistsGroupName = (postData, config) => http.post(`${INTERFACE_PREFIX_MEOS}/objectGroup/hasExistsGroupName`, postData, config);
