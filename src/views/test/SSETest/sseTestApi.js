// 运行监控  相关接口

import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

export const sendSSEData = postData => http.post(`${INTERFACE_PREFIX_MEOS}/server-event/sse/send`, postData);
