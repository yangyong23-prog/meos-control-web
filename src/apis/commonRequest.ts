import http from '@/utils/http';
import { INTERFACE_PREFIX_DMP_ALARM } from '@/config';

export const queryObjSummary = (params: any) => http.get(INTERFACE_PREFIX_DMP_ALARM + '/alarm_items/query', params);

// 对象摘要信息(新接口)
// 文档地址：http://82.157.151.167/swagger/doc.html#/apm-aim-%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83/sprint6/querySystemGraphObjSummaryUsingGET
// export const queryObjSummary = (params, cancelTokenCallBack) => RequestAim({
//   method: 'get',
//   url: '/object/query-obj-summary',
//   params,
//   cancelToken: new axios.CancelToken((c) => {
//       if (cancelTokenCallBack && typeof cancelTokenCallBack === 'function') {
//           cancelTokenCallBack(c);
//       }
//   })
// });
