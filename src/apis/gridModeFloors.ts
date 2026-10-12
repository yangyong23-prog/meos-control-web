import http from '@/utils/http';
import { INTERFACE_PREFIX_MEOS } from '@/config';
import { DETAIL, HOVER, TABLE_LIST } from '@/utils/globalVariables';

// 网格图视角下：建筑楼层列表
interface IGridModeFloorsParams {
    buildingId: string;
    runningMonitorSecondType: string;
    templateCode: typeof HOVER | typeof DETAIL | typeof TABLE_LIST | string;
}

export const getGridModeFloors = (
    params: IGridModeFloorsParams,
    config?: {
        signal?: AbortSignal;
        [key: string]: unknown;
    }
) => {
    return http.post(INTERFACE_PREFIX_MEOS + '/equipment/infoCodeConfig/listSpaceByBuildingIdGroupFloor', params, config);
};
