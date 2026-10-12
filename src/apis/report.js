import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 报告相关API文档：https://app.apifox.com/project/6273250

// 获取运行复盘报告列表
export const getReportList = (params, config) => http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/report/list', params, config);

// 生成报告
export const generateReport = params => http.post(INTERFACE_PREFIX_MEOS + '/runAnalysis/report/build', params, { autoHandleError: false });
