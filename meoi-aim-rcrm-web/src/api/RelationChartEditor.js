import Xsync from '@/utils/Xsync';
import { INTERFACE_PREFIX_MEOS } from '@/config';
import { cloneDeep } from 'yushu-js-utils';

// 获取系统模板列表
export const listSystemTemplate = () =>
    Xsync({
        method: 'get',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/listSystemTemplate`
    });

// 获取副本列表
export const listSystemGraphDuplicate = (params, signal) => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/listSystemGraphDuplicate`,
        params,
        signal
    });
};

// 初始化图纸
export const initSystemGraph = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/initSystemGraph`,
        params
    });
};

// 创建副本
export const createSystemGraphDuplicate = id => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/createSystemGraphDuplicate/${id}`
    });
};

// 重新计算布局
export const recalculatePipeline = (id, params) => {
    const obj = cloneDeep(params);
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/recalculatePipeline/${params.duplicateId}`,
        params: obj,
        loadingBtnId: id
    });
};

// 获取图纸数据（包含系统图数据和细节数据）
export const getSystemGraphData = (params, signal) => {
    return Xsync({
        method: 'get',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/getSystemGraphData/${params.selectChartId}`,
        signal
    });
};

// 更新图纸
export const editSystemGraph = (systemGraphDataId, params) => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/editSystemGraph/${systemGraphDataId}`,
        params
    });
};

// 发布图纸
export const publishSystemGraph = id => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/publishSystemGraph/${id}`
    });
};

// 删除副本
export const deleteSystemGraphDuplicate = id => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/deleteSystemGraphDuplicate/${id}`
    });
};

// 下架图纸
export const offlineSystemGraph = id => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/offlineSystemGraph/${id}`
    });
};

// 清除更新标识
export const clearUpdateFlag = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/clearUpdateFlag`,
        params
    });
};

// 清除所有更新标识
export const clearAllUpdateFlag = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/clearAllUpdateFlag`,
        params
    });
};

// 图中设备已绑定的信息点全集
export const listInfoCode = (params, signal) => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/listInfoCode`,
        params,
        signal
    });
};

// 根据取值逻辑查询对象列表（设备组下设备）
export const listObjectsByTackValueLogic = (params, signal) => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/instance/listObjectsByTackValueLogic`,
        params,
        signal
    });
};

// 保存或者更新系统图细节调整
export const saveAndUpdateSystemGraphDetail = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/saveAndUpdateSystemGraphDetail`,
        params
    });
};

export const saveAndUpdateSystemGraphDetailBatch = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/saveAndUpdateSystemGraphDetailBatch`,
        params
    });
};

// 删除系统图细节调整
export const deleteSystemGraphDetail = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/deleteSystemGraphDetail`,
        params
    });
};

// 更新副本名称
export const editDuplicateName = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/editDuplicateName`,
        params
    });
};

// 更新模版名称
export const updateTemplateName = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/updateTemplateName`,
        params
    });
};

// 复制细节数据
export const copyDetailData = params => {
    return Xsync({
        method: 'post',
        url: `${INTERFACE_PREFIX_MEOS}/systemGraphEditor/copyDetailData`,
        params
    });
};
