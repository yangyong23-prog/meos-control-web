import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
export const getEquipmentsBySpaceId = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipmentsInBySpaceIds', params, { signal });
};
export const getEquipmentsBySpaceIdV2 = (params, signal) => {
    return http.get(INTERFACE_PREFIX_MEOS + '/instance/listEquipmentsInBySpaceIds/computerRoomSecurity', params, { signal, headers: { mergeParams: false } });
};

export const getSpaceInfoBySpaceId = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listSpaces', params, { signal });
};

export const getFloorInfo = params => http.post(INTERFACE_PREFIX_MEOS + '/instance/listFloors', params);

export const getListTemplateTypes = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listTemplateTypes', params, { signal });
};

export const getObjectsInSpace = (params, signal) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipmentsInBySpaceIds/computerRoomSecurity', params, { signal });
};
