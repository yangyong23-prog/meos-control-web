import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
/**
 * 查询-dashboard空间列表
 * {

    "runningMonitorType": "AIR_TERMINAL",
    "instance": {
        "instanceType": "PROJECT",
         "instanceId": "ProjectId"
    }
}
 */
export const queryDashboardGridChartSpace = postData => http.post(`${INTERFACE_PREFIX_MEOS}/dashboardGridChart/querySpace`, postData);

export const queryDashboardListAbnormalState = postData => http.post(`${INTERFACE_PREFIX_MEOS}/dashboard/listAbnormalState`, postData);
