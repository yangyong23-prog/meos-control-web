import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';

// const INTERFACE_PREFIX_MEOS = 'https://mock.apifox.cn/m1/5429415-5104228-default';

export const querySpaceList = params => {
    return http.get(INTERFACE_PREFIX_MEOS + '/computerRoomSecurity/spaceList', params);
};
export const querySpace = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/dashboardGridChart/querySpace', params);
};
export const querySpaceV2 = params => {
    return http.get(INTERFACE_PREFIX_MEOS + '/dashboardGridChart/querySpace/computerRoomSecurity', params, { headers: { mergeParams: false } });
};
export const queryAbnormalData = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/abnormalEvent/listAbnormalEventBySpaceWithEquipments', params);
};

export const listInfoCodeConfigsByObject = params => {
    return http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listInfoCodeConfigsByObject', params);
};

export const computerRoomSecurity = (params, config) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/instance/listEquipments/COMPUTER_ROOM_SECURITY', params, config);
};

export const getObjectsInFloor = (params, signal) => {
    return http.get(INTERFACE_PREFIX_MEOS + '/instance/listSpaceAndEquipmentInByFloorId/computerRoomSecurity', params, { signal, headers: { mergeParams: false } });
};
