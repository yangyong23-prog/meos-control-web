import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// 设备服务空间
export const getEquipmentServiceSpaceData = (params: any) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/commonSpace/listEquipmentServiceSpaceByEquipmentId', params);
};
