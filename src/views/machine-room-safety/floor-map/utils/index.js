// @ts-ignore
import i18n from '@/localization';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import baseStore from '@/store/baseStore';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import { CAMERA_CLASS_CODES } from '@/constants/camera';

// 获取并存储建筑楼层数据
export const getStoreTreeBuildingFloor = async callback => {
    const allBuildingData = xplantindoorenvStore().buildingData;
    if (allBuildingData) {
        if (callback) {
            callback?.(allBuildingData);
        }
        return;
    }
    const params = {
        projectId: baseStore().projectId,
        isQuerySpace: false
    };
    return getListTreeBuildingFloorSpace(params).then(res => {
        const { data, code } = res;
        if (code === '00000') {
            if (callback) {
                callback?.(data);
            }
            xplantindoorenvStore().setBuildingData(data);
            xplantindoorenvStore().setBuildingFloorData(data);
        }
    });
};

export const getFloorInfoByFloorId = floorId => {
    const allBuildingData = xplantindoorenvStore().buildingData;
    if (!floorId || !allBuildingData || !Array.isArray(allBuildingData)) return;

    const flattenFloors = allBuildingData.flatMap(building => {
        const buildingLocalName = building?.localName ?? '--';
        if (Array.isArray(building.floors) && building.floors.length > 0) {
            return building.floors.filter(floor => floor?.id === floorId)?.map(v => ({ ...v, buildingLocalName }));
        }
        return [];
    });
    return flattenFloors.length > 0 ? flattenFloors[0] : undefined;
};

export const getFloorInfoListByFloorIds = floorIds => {
    const allBuildingData = xplantindoorenvStore().buildingData;
    if (!floorIds || !Array.isArray(floorIds) || !allBuildingData || !Array.isArray(allBuildingData)) return;

    const flattenFloors = allBuildingData.flatMap(building => {
        if (Array.isArray(building.floors) && building.floors.length > 0) {
            return building.floors.filter(floor => floorIds.includes(floor?.id));
        }
        return [];
    });

    return flattenFloors;
};

export const getBuildingInfoByFloorId = floorId => {
    const allBuildingData = xplantindoorenvStore().buildingData;
    if (!floorId || !allBuildingData || !Array.isArray(allBuildingData)) return;

    const buildingInfo = allBuildingData.find(building => {
        if (Array.isArray(building.floors) && building.floors.length > 0) {
            return building.floors.some(floor => floor.id === floorId);
        }
        return false;
    });
    return buildingInfo;
};

export const generateBuildFloors = floorList => {
    const result = [];
    const floorDataArr = getFloorInfoListByFloorIds(floorList);
    const buildDict = {};

    floorDataArr.forEach(floorData => {
        if (buildDict[floorData.buildingId]) {
            buildDict[floorData.buildingId].floorList.push(floorData);
        } else {
            const buildInfo = getBuildingInfoByFloorId(floorData.id);
            buildDict[floorData.buildingId] = {
                floorList: [floorData],
                ...buildInfo
            };
        }
    });

    for (const item in buildDict) {
        buildDict[item].floorList = buildDict[item].floorList.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
        result.push(buildDict[item]);
    }

    return result;
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

// 从空间对象里提取楼层数据(参考additionalFloorInfo)
export const extractFloorDataFromSpace = spaceObj => {
    return {
        id: spaceObj?.floorId,
        buildingId: spaceObj?.buildingId,
        localName: spaceObj?.floorLocalName,
        localId: spaceObj?.floorLocalId
    };
};

export const addFloorInfoToSpace = (item, cachedFloorInfo) => {
    if (!item.floorId) {
        return;
    }
    if (!cachedFloorInfo[item.floorId]) {
        const floorInfo = getFloorInfoByFloorId(item.floorId);
        cachedFloorInfo[item.floorId] = floorInfo;

        item.floorLocalId = floorInfo?.localId;
    }
    const floorInfo = cachedFloorInfo[item.floorId];
    if (floorInfo) {
        item.floorLocalId = floorInfo.localId;
        item.floorLocalName = floorInfo.localName ?? '--';
        item.floorElevation = floorInfo.floorElevation;
        item.floorSequenceId = floorInfo.floorSequenceID;
        item.floorId = floorInfo.id;
        item.height = floorInfo.height;
    }
};

export const getFloorDataFromSpace = spaceObj => {
    const floorInfo = getFloorInfoByFloorId(spaceObj?.floorId);
    return {
        ...(floorInfo || {}),
        id: spaceObj?.floorId,
        floorId: spaceObj?.floorId,
        buildingId: spaceObj?.buildingId,
        localName: floorInfo?.localName ?? '--',
        localId: floorInfo?.localId
    };
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
                ?.filter(f => _floorList?.includes(f.id))
                .sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
            return building;
        })
        .filter(building => building.floorList?.length)
        .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

    return allBuildingData;
};

export const isCamera = classCode => ['SPVSCM'].includes(classCode);
export const isDoor = classCode => ['CFCSDR', 'CFCSFR', 'SPEGFG'].includes(classCode);
