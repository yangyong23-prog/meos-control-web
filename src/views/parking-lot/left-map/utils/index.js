// @ts-ignore
import i18n from '@/localization';
import { RenderOrder } from '@/views/GraphMVC/graphScene/GraphSceneDefine';
import { baseColors } from '@/constants/baseColors';
import * as THREE from '@yushu/three-base';
import Space from '@/views/GraphMVC/graphScene/Space/Space';
import SpaceIconInfoCommon from '@/views/GraphMVC/graphScene/SpaceIconInfoCommon/SpaceIconInfoCommon';

import PLEquipIconInfo from '../graph/PLEquipIconInfo/PLEquipIconInfo';
import ParkingPlace from '../graph/ParkingPlace/ParkingPlace';
import ParkingPlaceName from '../graph/ParkingPlaceName/ParkingPlaceName';
import ChargingStation from '../graph/ChargingStation/ChargingStation';
import dayjs from 'dayjs';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { checkSpaceStatus, isParkingGate, isParkingLotSpace, isRoad, isEntranceAndExit, isParkingCamera } from './check';
import DockSingleton from '@/hooks/responsiveDock';

const { M2FOOT } = THREE.baseUtils;
import { getFloorInfoByFloorId } from '@/utils/buildingUtils';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsBetween } from '@/utils/dayjsTools';

export const createSpaceModel = (objData, floorHeight) => {
    const { _infoMap } = objData;
    const spaceModel = new Space(objData, 0, floorHeight, 0.01);

    const isRoadItem = isRoad(objData.roomFuncType);
    const isEntranceAndExitItem = isEntranceAndExit(objData.roomFuncType);

    spaceModel.setStateStyles({
        normal: {
            ...spaceModel.defineStyles.normal,
            // 默认道路和出入口渲染白色，未知渲染灰色
            color: isRoadItem || isEntranceAndExitItem ? '#FFFFFF' : '#C0CFE1',
            renderOrder: RenderOrder.space,
            priority: 1
        },
        hover: {
            show: true,
            // color: isRoadItem || isEntranceAndExitItem ? '#EEEEEE' : '#A2B59C',
            colorMode: 'dark',
            renderOrder: RenderOrder.hover,
            priority: 4
        },
        selected: {
            show: true,
            color: '#246FE5',
            renderOrder: RenderOrder.selected,
            priority: 8
        },
        // 营业中
        openForBusiness: {
            show: true,
            color: '#D7EDD1',
            renderOrder: RenderOrder.space,
            priority: 3
        },

        // 非营业
        closedForBusiness: {
            show: true,
            color: '#C0CFE1',
            renderOrder: RenderOrder.space,
            priority: 3
        },

        // 异常
        abnormal: {
            color: '#FDC1BE',
            renderOrder: RenderOrder.space + 1,
            priority: 5
        },

        filterHide: {
            show: false,
            priority: 50
        }
    });

    // const isParkingLotSpaceItem = isParkingLotSpace(objData.roomFuncType);
    // if (!isParkingLotSpaceItem) {
    //     return spaceModel;
    // }
    const statusMap = checkSpaceStatus(_infoMap);
    const { abnormal } = statusMap;

    spaceModel.setState('abnormal', abnormal);

    // 取dashboard注入的自定义信息点数据，判断空间营业时间
    const { getCustomInfo } = DockSingleton.getInstance();
    const calendarObj = getCustomInfo(objData.id, 'CALENDAR_WORK_TIME_SELF', 'calendarWorkTimeSelf');
    const calendarWorkTimeValue = calendarObj?.dataValue ?? [];
    if (Array.isArray(calendarWorkTimeValue) && calendarWorkTimeValue?.length) {
        const isWorkTime = calendarWorkTimeValue.some(time => {
            const isInTimeRange = isWithinTimeRange(time);
            return isInTimeRange;
        });
        if (isWorkTime) {
            spaceModel.setState('openForBusiness', true);
        } else {
            spaceModel.setState('closedForBusiness', true);
        }
    }

    return spaceModel;
};

export const createSpaceLabelInfoModel = (objData, floorHeight) => {
    const isEntranceAndExitItem = isEntranceAndExit(objData.roomFuncType);
    // const isParkingLotSpaceItem = isParkingLotSpace(objData.roomFuncType);

    const model = new SpaceIconInfoCommon(objData, { floorHeight, namePointerNone: true });

    const gateStyle = {
        show: true,
        iconShow: true,
        textShow: false,
        cssName: 'space-info-container',
        textColor: '#626c78',
        iconbgColor: '#ffffff',
        width: 18,
        height: 18,
        renderOrder: RenderOrder.space,
        priority: 0
    };

    model.setStateStyles({
        normal: {
            ...model.defineStyles.normal,
            show: false,
            iconShow: false,
            ...(isEntranceAndExitItem ? gateStyle : {})
        },
        hover: {
            show: true,
            textShow: true,
            iconShow: isEntranceAndExitItem,
            cssName: 'hover',
            textColor: '#1B2129',
            renderOrder: RenderOrder.hover
        },
        filterHide: {
            show: false,
            priority: 500
        },
        hide: {
            show: false,
            priority: Infinity
        }
    });
    return model;
};

export const createParkingPlaceModel = objData => {
    const floorHeight = M2FOOT * Number(objData.floorElevation || 0);
    const m = new ParkingPlace(objData, { floorHeight });
    return m;
};
// 车位名称
export const createParkingPlaceNameModel = (objData, relationModel) => {
    const m = new ParkingPlaceName(objData, { relationModel });
    return m;
};

export const createChargingStationModel = (objData, relationModel) => {
    const m = new ChargingStation(objData, { relationModel });
    return m;
};

export const createCamerasOrGatesModel = objData => {
    const { bimLocation } = objData;
    if (!bimLocation) return;
    const equipIconInfo = new PLEquipIconInfo(objData, { isSmallIcon: true });
    const normalStyle = equipIconInfo.defineStyles?.normal || {};
    const renderOrder = RenderOrder.groupEquip;

    const textShow = isParkingGate(objData?.classCode);
    equipIconInfo.setStateStyles({
        normal: {
            ...normalStyle,
            show: true, // 是否显示

            iconBgColor: '#C4C9CF',
            iconColor: '#8B949E',
            iconBorderColor: '#8B949E',
            showText: textShow,
            renderOrder,
            priority: 1
        },
        noData: {
            iconBgColor: '#FCF5FF',
            iconBorderColor: '#C4C9CF',
            iconColor: '#C4C9CF',
            renderOrder: renderOrder + 1,
            priority: 2
        },

        abnormal: {
            dotColor: `${baseColors['$red-500']}`,
            renderOrder: renderOrder + 4,
            priority: 4
        },
        hover: {
            show: true,
            // iconBgColor: '#FCF5FF',
            // iconBorderColor: '#8252E3',
            // iconColor: '#8252E3',
            showText: true,
            textColor: '#ffffff', // 字体颜色
            textShadow: '', // 字体描边
            textBgColor: '#246FE5', // 文字背景
            textBorder: '1px solid #fff',
            showMark: false, // 显示标记
            renderOrder: RenderOrder.hover,
            priority: 5
        },
        offline: {
            iconBgColor: '#C4C9CF',
            iconBorderColor: '#8B949E',
            iconColor: '#8B949E',
            renderOrder: renderOrder + 2,
            priority: 3
        },
        online: {
            iconBgColor: '#ffffff',
            iconBorderColor: '#8252E3',
            iconColor: '#8252E3',
            renderOrder: renderOrder + 2,
            priority: 3
        },

        selected: {
            show: true,
            iconBgColor: '#246FE5',
            iconBorderColor: '#246FE5',
            iconColor: '#fff',
            showText: true,
            textColor: '#ffffff', // 字体颜色
            textShadow: '', // 字体描边
            textBgColor: '#246FE5', // 文字背景
            textBorder: '1px solid #fff',
            showMark: true, // 显示标记
            renderOrder: RenderOrder.selected,
            priority: 6
        },
        filterHide: {
            show: false,
            priority: 50
        }
    });

    return equipIconInfo;
};

// 获取groups里关联设备ID
export const getRelEquipmentIds = groups => {
    return groups
        ?.find(g => g.groupCode === 'relEquipment')
        ?.relInfoCodeConfigs?.find(rel => rel.infoCode === 'relEquipment')
        ?.dataValue?.map(obj => {
            return obj.id;
        });
};

export const isWithinTimeRange = (workTime, nowTime = Date.now()) => {
    if (workTime) {
        const arr = workTime.split('-');
        if (arr.length > 1) {
            const startTime = dayjs(`${getDayjsTz().format('YYYY-MM-DD')} ${arr[0]}`);
            const endTime = dayjs(`${getDayjsTz().format('YYYY-MM-DD')} ${arr[1]}`);
            const now = dayjs(nowTime);
            return dayjsIsBetween(now, startTime, endTime);
        }
    }
};

export const additionalFloorInfo = (item, cachedFloorInfo) => {
    if (!item.floorId) {
        return;
    }
    if (!cachedFloorInfo[item.floorId]) {
        const floorInfo = getFloorInfoByFloorId(item.floorId);
        cachedFloorInfo[item.floorId] = floorInfo;

        item.floorLocalId = floorInfo?.localId;
    }
    const floorInfo = cachedFloorInfo[item.floorId];

    item.buildingId = floorInfo.buildingId;
    item.floorLocalId = floorInfo.localId;
    item.floorLocalName = floorInfo.localName ?? '--';
    item.floorElevation = floorInfo.floorElevation;
    item.floorSequenceId = floorInfo.floorSequenceId;
    item.height = floorInfo.height;
};

export const filterBuildFloors = (_floorList, allBuildings) => {
    if (!_floorList?.length) {
        return [];
    }

    let allBuildingData = allBuildings?.length ? allBuildings : xplantindoorenvStore().buildingData;
    allBuildingData = allBuildingData
        ?.map(b => {
            const building = { ...b, name: b?.localName };
            building.floorList = b.floors
                ?.map(f => ({ ...f, name: f?.localName }))
                .filter(f => _floorList?.includes(f.id))
                .sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
            return building;
        })
        .filter(building => building.floorList?.length)
        .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

    return allBuildingData;
};
