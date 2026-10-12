/*
 * @Author: huanghao 755687004@qq.com
 * @Date: 2023-04-03 17:00:37
 * @LastEditors: huanghao@persagy.com 755687004@qq.com
 * @LastEditTime: 2023-05-13 16:45:01
 * @FilePath: \runningcontrolsaasweb\src\apis\syncData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/utils/http';

/**
 * 同步系统图
 * @param params
 * @returns
 */
export const getAndSyncData = () => http.post('/running-control-saas/system/syncSystemPic');

/**
 * 获取同步内容
 * @param params
 * @returns
 */
export const getSyncDataContent = (params: { projectId: string; tableName: string }) => http.get('/running-control-saas/system/get/syncSystemPic', params);
