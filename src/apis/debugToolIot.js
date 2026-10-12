import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 查询-调试工具-模版类型和设备类
export const getDebugToolTemplateTypes = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/debugTool/listTemplateTypeAndClassCodes', params);
};

// 查询-调试工具-对象详情
export const getDebugToolObjectDetail = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/debugTool/listObjectsByClassCode', params, {
        signal
    });
};

// 查询-调试工具-对象模板信息点
export const queryObjectInfoCodes = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/debugTool/queryObjectInfoCodes', params);
};
