import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
/**
 * 光伏设备列表
 * @param params
 * @returns
 */
export const listEquipments = params => http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipments/PHOTOVOLTAIC', params);
