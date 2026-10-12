// @ts-ignore
import i18n from '@/localization';
import baseStore from '@/store/baseStore';
import treeBuildFloorStore from '@/store/treeBuildFloor';

import { MONITOR_SURVEILLANCE_STATUS_ENUM } from '../constant/index';

// 获取并存储建筑楼层数据
export const getStoreTreeBuildingFloor = async callback => {
    return treeBuildFloorStore()
        .handleTreeBuildingFloorData()
        .then(res => {
            const { data, code } = res;
            // eslint-disable-next-line eqeqeq
            if (code == '00000') {
                if (callback) {
                    callback?.(data);
                }
            }
        });
};

// 检测设备是否可监控
export const checkMonitorSurveillanceStatus = item => {
    return [MONITOR_SURVEILLANCE_STATUS_ENUM.MONITOR_ABLE_CONTROL_ABLE, MONITOR_SURVEILLANCE_STATUS_ENUM.MONITOR_ABLE_CONTROL_DISABLE].includes(item?.monitoringSurveillanceStatus);
};
