/* eslint-disable one-var */
import _ from 'lodash';
// import store from '@/store';
import store from '@/store/baseStore';
import xplantindoorenvStore from '../store/xplantindoorenv';

/**
 * 根据楼层id找出所在建筑的idbaseStore
 *@param {String} floorId 楼层id
 */
const getBuildingIdByFloorId = floorId => {
    const allBuildingData = store.global.buildingFloorData;
    if (!floorId) return;
    if (!allBuildingData) return;
    let buildingId = '';
    allBuildingData.forEach(building => {
        if (building.floorList && building.floorList.length > 0) {
            const item = building.floorList.find(floor => floor.id === floorId);
            if (item) {
                buildingId = building.buildId;
            }
        }
    });
    return buildingId;
};
/**
 *根据楼层id找出所在建筑的数据
 * @param {String} floorId 楼层id
 */
const getBuildingInfoByFloorId = floorId => {
    let allBuildingData = xplantindoorenvStore().buildingFloorData;
    allBuildingData = toRaw(allBuildingData);
    if (!floorId) return;
    if (!allBuildingData) return;
    let buildingInfo = '';
    allBuildingData.forEach(building => {
        if (building.floors && building.floors.length > 0) {
            const item = building.floors.find(floor => floor.id === floorId);
            if (item) {
                buildingInfo = JSON.parse(JSON.stringify(building));
            }
        }
    });
    return buildingInfo;
};
/**
 *根据楼层id找出所在建筑的所有楼层数据
 * @param {String} floorId 楼层id
 */
const getFloorListByFloorId = floorId => {
    const allBuildingData = store.state.global.buildingFloorData;
    if (!floorId) return [];
    if (!allBuildingData) return [];
    let floors = '';
    allBuildingData.forEach(building => {
        if (building.floorList && building.floorList.length > 0) {
            const item = building.floorList.find(floor => floor.id === floorId);
            if (item) {
                floors = JSON.parse(JSON.stringify(building.floorList));
            }
        }
    });
    return floors;
};
/**
 *根据楼层id找出楼层信息
 * @param {String} floorId 楼层id
 */
const getFloorInfoByFloorId = floorId => {
    let allBuildingData = xplantindoorenvStore().buildingFloorData;
    allBuildingData = toRaw(allBuildingData);
    if (!floorId) return;
    if (!allBuildingData) return;
    let floorInfo = '';
    allBuildingData.forEach(building => {
        if (building.floors && building.floors.length > 0) {
            const item = building.floors.find(floor => floor.id === floorId);
            if (item) {
                // floorInfo = JSON.parse(JSON.stringify(item));
                floorInfo = item;
            }
        }
    });
    return floorInfo;
};
/**
 *根据楼层localName找出楼层信息
 * @param {String} localName 楼层本地名
 */
const getFloorInfoByLocalName = localName => {
    let allBuildingData = xplantindoorenvStore().buildingFloorData;
    allBuildingData = toRaw(allBuildingData);
    if (!localName) return;
    if (!allBuildingData) return;
    let floorInfo = '';
    allBuildingData.forEach(building => {
        if (building.floors && building.floors.length > 0) {
            const item = building.floors.find(floor => floor.localName === localName);
            if (item) {
                // floorInfo = JSON.parse(JSON.stringify(item));
                floorInfo = item;
            }
        }
    });
    return floorInfo;
};
// localId

/**
 *根据楼层localId找出楼层信息
 * @param {String} localId 楼层localId
 */
const getFloorInfoByLocalId = localId => {
    console.log(localId);
    console.log('store', store());

    // const allBuildingData = store.state.global.buildingFloorData;
    // if (!localId) return;
    // if (!allBuildingData) return;
    // let floorInfo = '';
    // allBuildingData.forEach(building => {
    //     if (building.floorList && building.floorList.length > 0) {
    //         const item = building.floorList.find(floor => floor.localId === localId);
    //         if (item) {
    //             floorInfo = JSON.parse(JSON.stringify(item));
    //         }
    //     }
    // });
    // return floorInfo;
};
/**
 *根据楼层id列表找出楼层列表信息
 * @param StringfloorId 楼层id
 */
const getFloorInfoListByFloorIdList = floorIdList => {
    let allBuildingData = xplantindoorenvStore().buildingFloorData;
    allBuildingData = toRaw(allBuildingData);
    if (!floorIdList) return;
    if (!allBuildingData) return;
    const floorList = [];
    floorIdList.forEach(item => {
        const value = getFloorInfoByFloorId(item);
        if (value) {
            const floorInfo = value;
            floorList.push(floorInfo);
        }
    });
    return floorList;
};

/**
 *根据建筑id找出建筑的数据
 * @param {String} buildingId 建筑id
 */
const getBuildingInfoByBuildingId = buildingId => {
    const allBuildingData = store.state.global.buildingFloorData;
    if (!buildingId) return;
    if (!allBuildingData) return;
    let buildingInfo = '';
    const item = allBuildingData.find(building => building.buildId === buildingId);
    if (item) {
        // buildingInfo = JSON.parse(JSON.stringify(item));
        buildingInfo = item;
    }
    return buildingInfo;
};
/**
 *根据建筑id找出建筑下的楼层数据
 * @param {String} buildingId 建筑id
 */
const getFloorListByBuildingId = buildingId => {
    let allBuildingData = xplantindoorenvStore().buildingFloorData;
    allBuildingData = toRaw(allBuildingData);
    if (!buildingId) return;
    if (!allBuildingData) return;
    let floors = '';
    const item = allBuildingData.find(building => building.id === buildingId);
    if (item) {
        // floors = JSON.parse(JSON.stringify(item.floors));
        floors = item?.floors;
    }
    return floors;
};

const getFloorInfoByBuildingIdAndLocalId = (buildingId, localId) => {
    let allBuildingData = xplantindoorenvStore().buildingFloorData;
    allBuildingData = toRaw(allBuildingData);
    if (!buildingId) return;
    if (!allBuildingData) return;
    let floor = null;
    const item = allBuildingData.find(building => building.id === buildingId);
    if (item) {
        const floorObj = item.floors?.find(obj => obj.localId === localId);
        if (floorObj) {
            // floor = JSON.parse(JSON.stringify(floorObj));
            floor = floorObj;
        }
    }
    return floor;
};
/**
 *查询该楼层最多建筑下最低楼层Id
 */
const getLowestFloorId = () => {
    const allBuildingData = store.state.global.buildingFloorData;
    if (!allBuildingData) return;
    let floorId = '';
    const build = _.maxBy(allBuildingData, 'floorList.length');
    const floor = _.minBy(build.floorList, 'floorSequenceID');
    if (floor) {
        floorId = floor.id;
    }
    return floorId;
};

/**
 * 根据楼层类型获取找出满足类型的楼层数据
 * @param {Array} typeList
 */
const getFloorListByFloorType = typeList => {
    const allBuildingData = store.state.global.buildingFloorData;
    if (!allBuildingData) return;
    const floors = [];
    for (let i = 0; i < allBuildingData.length; i++) {
        const { floorList } = allBuildingData[i];
        for (let j = 0; j < floorList.length; j++) {
            if (typeList.includes(floorList[j].floorType)) {
                // floors.push(JSON.parse(JSON.stringify(floorList[j])));
                floors.push(floorList[j]);
            }
        }
    }
    return floors;
};
export {
    getBuildingIdByFloorId,
    getBuildingInfoByFloorId,
    getFloorListByFloorId,
    getFloorInfoByFloorId,
    getFloorInfoByLocalId,
    getFloorInfoListByFloorIdList,
    getBuildingInfoByBuildingId,
    getFloorListByBuildingId,
    getLowestFloorId,
    getFloorListByFloorType,
    getFloorInfoByBuildingIdAndLocalId,
    getFloorInfoByLocalName
};
