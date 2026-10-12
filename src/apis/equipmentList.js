import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

/**
 * 设备类列表
 */
export const getClassCodeList = data => http.post(`${INTERFACE_PREFIX_MEOS}/infoCodeConfig/listTemplateTypes`, data);

/**
 * 表头数据
 */
export const getTableHeader = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS}/instanceConfig/queryConfigEquipmentListHeader`, data, config);

/**
 * 保存设备列表的自定义表头配置
 */
export const saveTableHeader = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS}/instanceConfig/saveConfigEquipmentListHeader`, data, config);

/**
 * 设备列表数据
 */
export const getTableData = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS}/infoCodeConfig/listInfoCodeConfigsByTemplateId`, data, config);

/**
 * 查询-模版类型树结构
 */
export const treeTemplateType = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS}/infoCodeConfig/treeTemplateType`, data, config);
