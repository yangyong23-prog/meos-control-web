import xplantindoorenvStore from '@/store/xplantindoorenv';

export const getFloorInfoByFloorId = floorId => {
    const allBuildingData = xplantindoorenvStore().buildingData;
    if (!floorId || !allBuildingData || !Array.isArray(allBuildingData)) return;

    const flattenFloors = allBuildingData.flatMap(building => {
        const { localName: buildingLocalName } = building || {};
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

export const filterBuildFloors = (_floorList, allBuildings) => {
    if (!_floorList?.length) {
        return [];
    }

    let allBuildingData = allBuildings?.length ? allBuildings : xplantindoorenvStore().buildingData;
    allBuildingData = allBuildingData
        ?.map(b => {
            const building = { ...b, name: b?.localName };
            building.floorList = (b?.floors || [])
                .map(f => ({ ...f, name: f?.localName }))
                .filter(f => _floorList?.includes(f.id))
                .sort((_a, _b) => _b.floorSequenceId - _a.floorSequenceId);
            return building;
        })
        .filter(building => building.floorList?.length)
        .sort((a, b) => b.floorSequenceId - a.floorSequenceId);

    return allBuildingData;
};
