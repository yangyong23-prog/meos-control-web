import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
// const INTERFACE_PREFIX_MEOS = 'https://br-tyxn.yushu.cloud/meos-control-server-edge';

// 查询-消防电dashboard
export const queryEquipment = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listDashboardSystems/FIRE_FIGHTING_ELECTRICITY', params);
};
