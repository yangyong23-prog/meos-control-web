import { getDayjsTz } from '@/utils/globalVariables';
import {
    PARKING_LOT_SPACES_TYPES,
    ROADS_TYPES,
    ENTRANCE_AND_EXIT_TYPES,
    PARKING_SPOT_CLASS_CODES,
    CHARGE_STATION_CLASS_CODES,
    PARKING_CAMERA_CLASS_CODES,
    PARKING_GATES_CLASS_CODES
} from '../../constant/index';
import dayjs from 'dayjs';
import { dayjsIsAfter, dayjsIsBefore } from '@/utils/dayjsTools';

export const checkSpaceStatus = infoMap => {
    let statusMap = { abnormal: false, unknown: false, isClosed: false, isOpen: false };

    if (infoMap?.alarmstatus?.dataValue === 'alarmstatus') {
        statusMap.abnormal = true;
    }

    if (infoMap?.openTime?.dataValue?.startTime && infoMap?.openTime?.dataValue?.endTime) {
        statusMap.unknown = false;
        const currentTime = getDayjsTz();
        const { startTime, endTime } = infoMap?.openTime?.dataValue || {};
        const startTimeVal = dayjs(startTime);
        const endTimeVal = dayjs(endTime);
        if (dayjsIsBefore(currentTime, startTimeVal) || dayjsIsAfter(currentTime, endTimeVal)) {
            statusMap.isClosed = true;
        } else {
            statusMap.isOpen = true;
        }
    } else if (typeof infoMap?.openTime?.dataValue === 'string' && infoMap?.openTime?.dataValue) {
        statusMap.unknown = false;
        const [startTime, endTime] = infoMap.openTime.dataValue.split('-');
        const startTimeVal = dayjs(`${getDayjsTz().format('YYYY-MM-DD')} ${startTime}`);
        const endTimeVal = dayjs(`${getDayjsTz().format('YYYY-MM-DD')} ${endTime}`);

        if (dayjsIsBefore(getDayjsTz(), dayjs(endTimeVal)) && dayjsIsAfter(getDayjsTz(), dayjs(startTimeVal))) {
            statusMap.isOpen = true;
        } else {
            statusMap.isOpen = false;
        }
    } else {
        statusMap.unknown = true;
    }

    return statusMap;
};

export const isParkingLotSpace = type => {
    return PARKING_LOT_SPACES_TYPES.includes(type);
};

export const isRoad = type => {
    return ROADS_TYPES.includes(type);
};

export const isEntranceAndExit = type => {
    return ENTRANCE_AND_EXIT_TYPES.includes(type);
};

export const isParkingSpot = classCode => {
    return PARKING_SPOT_CLASS_CODES.includes(classCode);
};

export const isChargeStation = classCode => {
    return CHARGE_STATION_CLASS_CODES.includes(classCode);
};

export const isParkingCamera = classCode => {
    return PARKING_CAMERA_CLASS_CODES.includes(classCode);
};

export const isParkingGate = classCode => {
    return PARKING_GATES_CLASS_CODES.includes(classCode);
};
