import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 查询-照明-需求偏离空间列表
export const getDemandDeviationSpaceList = (postData, signal) =>
    http.post(INTERFACE_PREFIX_MEOS + '/lighting/listLightLoopTotal', postData, {
        signal
    });
