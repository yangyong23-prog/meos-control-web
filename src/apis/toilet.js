import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
export const getToiletEquipmentList = (data, config) => http.post(`${INTERFACE_PREFIX_MEOS}/instance/listDashboardSpaces/TOILET`, data, config);
