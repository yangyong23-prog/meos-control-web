import http from '@/utils/http';
import { HttpResponse } from '@/types/common';

/**
 * @description: 查询供冷系统列表
 * @return {*}
 */
export const coolingSystemList = (): HttpResponse<unknown> => http.post('/running-control-saas/system/querySystemListData', { criteria: { classCode: 'ACCC' } });

/**
 * @description: 查询专家规则列表
 * @return {*}
 */
export const queryAIStrategicGenerateList = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/queryAIStrategicGenerateList', data);

/**
 * @description: 启动算法计算
 * @return {*}
 */
export const startAlgorithmCalculation = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/startAlgorithmCalculation', data);

/**
 * @description: 查询上次操作记录
 * @return {*}
 */
export const queryLastStartRecord = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/queryLastStartRecord', data);

/**
 * @description: 获取冷机数量
 * @return {*}
 */
export const getCooler = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/getCooler', data);

/**
 * @description: 校验时间段
 * @return {*}
 */
export const checkDate = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/checkDate', data);

/**
 * @description: 添加策略
 * @return {*}
 */
export const addAIStrategicGenerate = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/addAIStrategicGenerate', data);

/**
 * @description: 编辑策略
 * @return {*}
 */
export const editAIStrategicGenerate = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/editAIStrategicGenerate', data);

/**
 * @description: 删除策略
 * @return {*}
 */
export const deleteAIStrategicGenerate = (data: any): HttpResponse<unknown> => http.post('/running-control-saas/aiStrategic/deleteAIStrategicGenerate', data);
