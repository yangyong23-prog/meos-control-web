// @ts-ignore
import i18n from '@/localization';
import * as _ from 'lodash';
import {
    CONCENTRATED_FAN_CLASSCODE,
    HOOD_RANGE_CLASSCODE,
    FRESH_AIR_UNIT_CLASSCODE,
    VENTILATION_FAN_CLASSCODE,
    OIL_FUME_PURIFIER_CLASSCODE,
    SERVICE_SPACE_KEY,
    IOT_CODE_TYPE
} from '../constant/index';

import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';

const getArrByKeys = (srcObj, keys = []) => {
    let arr = [];
    keys?.forEach(k => {
        const target = srcObj[k];
        if (target) {
            target.forEach(obj => {
                obj.classCode = k;
            });
            arr = arr.concat(target);
        }
    });
    return arr;
};

// 收集小风机设备ID
const collectOverlapEquipIds = (overlap, classMap, floorIdMapClassMap) => {
    // if (!classMap[HOOD_RANGE_CLASSCODE]) {
    //     classMap[HOOD_RANGE_CLASSCODE] = new Set();
    // }
    const floorCache = {};
    overlap?.forEach(space => {
        space.subItem?.forEach(obj => {
            // classMap[HOOD_RANGE_CLASSCODE].add(obj.id);
            fillClassMap(classMap, HOOD_RANGE_CLASSCODE, obj.id);
            if (!floorIdMapClassMap[obj.floorId]) {
                floorIdMapClassMap[obj.floorId] = {};
            }
            fillClassMap(floorIdMapClassMap[obj.floorId], HOOD_RANGE_CLASSCODE, obj.id);
            additionalFloorInfo(obj, floorCache);
        });
    });
};
// 将对象数组转换为list树
const makeBuildFloorGroup = arr => {
    arr?.forEach(obj => {
        obj.name = obj.localName ?? '--';
    });
    const hasMultBuilding = _.groupBy(arr, obj => obj.buildingId)?.length > 1;

    const g = _.groupBy(_.orderBy(arr, ['buildingId', 'floorName']), obj => `${obj.buildingId}-${obj.floorId}`);

    return Object.keys(g).map(k => {
        let bfInfo = null;
        const _list = g[k];
        if (_list?.length > 0) {
            bfInfo = _list[0];
        }
        if (bfInfo) {
            const { buildingName, floorName, buildingId, floorId } = bfInfo;
            return {
                buildingName,
                floorName,
                buildingId,
                floorId,
                id: floorId,
                name: hasMultBuilding ? `${buildingName || ''}-${floorName || ''}` : floorName,
                list: _list
            };
        }
    });
};
const fillClassMap = (classMap, classCode, id) => {
    if (!classMap[classCode]) {
        classMap[classCode] = new Set();
    }
    classMap[classCode].add(id);
};
export const makeGridsData = originData => {
    if (!originData) {
        return;
    }
    const arr = originData?.filter(item => item.aggregate && item.aggregate[SERVICE_SPACE_KEY]?.length > 0);

    const group = makeBuildFloorGroup(arr);
    const spaceIdSet = new Set();
    const spaceIdMapSupplyFanIds = {};
    const classMap = {};
    const floorIdMapClassMap = {};
    const buildingFloorTree = [];

    const floorCache = {};

    const buildingSet = new Set();
    group?.forEach(item => {
        if (!buildingSet.has(item.buildingId)) {
            buildingFloorTree.push({
                buildingId: item.buildingId,
                buildingName: item.buildingName,
                children: []
            });
            buildingSet.add(item.buildingId);
        }
        const curBuildingObj = buildingFloorTree.find(obj => obj.buildingId === item.buildingId);
        item.list = item.list?.map(obj => {
            if (!curBuildingObj?.children.some(it => it.floorId === obj.floorId)) {
                curBuildingObj?.children.push({
                    floorId: obj.floorId,
                    floorName: obj.floorName,
                    buildingId: item.buildingId
                });
            }
            // 大风机
            fillClassMap(classMap, CONCENTRATED_FAN_CLASSCODE, obj.id);
            // if (!classMap[CONCENTRATED_FAN_CLASSCODE]) {
            //     classMap[CONCENTRATED_FAN_CLASSCODE] = new Set();
            // }
            // classMap[CONCENTRATED_FAN_CLASSCODE].add(obj.id);
            additionalFloorInfo(obj, floorCache);

            if (!floorIdMapClassMap[obj.floorId]) {
                floorIdMapClassMap[obj.floorId] = {};
            }
            fillClassMap(floorIdMapClassMap[obj.floorId], CONCENTRATED_FAN_CLASSCODE, obj.id);

            const _obj = { ...obj };
            delete _obj.aggregate;
            const { aggregate = {} } = obj;
            // 补风机
            const supplementalFans = getArrByKeys(aggregate, [FRESH_AIR_UNIT_CLASSCODE, VENTILATION_FAN_CLASSCODE]);
            // 油烟净化器
            const oilFumePurifiers = getArrByKeys(aggregate, [OIL_FUME_PURIFIER_CLASSCODE]);

            supplementalFans?.forEach(eq => {
                // if (!classMap[eq.classCode]) {
                //     classMap[eq.classCode] = new Set();
                // }
                // classMap[eq.classCode].add(eq.id);
                fillClassMap(classMap, eq.classCode, eq.id);
                if (!floorIdMapClassMap[eq.floorId]) {
                    floorIdMapClassMap[eq.floorId] = {};
                }
                fillClassMap(floorIdMapClassMap[eq.floorId], eq.classCode, eq.id);
                additionalFloorInfo(eq, floorCache);
            });
            oilFumePurifiers?.forEach(eq => {
                // if (!classMap[eq.classCode]) {
                //     classMap[eq.classCode] = new Set();
                // }
                // classMap[eq.classCode].add(eq.id);
                fillClassMap(classMap, eq.classCode, eq.id);
                if (!floorIdMapClassMap[eq.floorId]) {
                    floorIdMapClassMap[eq.floorId] = {};
                }
                fillClassMap(floorIdMapClassMap[eq.floorId], eq.classCode, eq.id);
                additionalFloorInfo(eq, floorCache);
            });

            let serviceSpaces = aggregate.overlap || [];
            collectOverlapEquipIds(serviceSpaces, classMap, floorIdMapClassMap);
            if (aggregate[SERVICE_SPACE_KEY]) {
                aggregate[SERVICE_SPACE_KEY].forEach(space => {
                    if (!serviceSpaces.some(it => it.id === space.id)) {
                        serviceSpaces.push(space);
                    }
                });
            }

            serviceSpaces.forEach(s => {
                spaceIdSet.add(s.id);
                if (!spaceIdMapSupplyFanIds[s.id]) {
                    spaceIdMapSupplyFanIds[s.id] = [];
                }
                spaceIdMapSupplyFanIds[s.id].push(obj.id);
                additionalFloorInfo(s, floorCache);
            });
            const relation = { serviceSpaces, serviceSpacesTree: makeBuildFloorGroup(serviceSpaces) };
            if (supplementalFans?.length) {
                // 补风机
                relation.supplementalFans = {
                    id: `${FRESH_AIR_UNIT_CLASSCODE}-${VENTILATION_FAN_CLASSCODE}`,
                    name: i18n.global.t('meos_control_web.make_up_air_unit'),
                    list: supplementalFans
                };
            }
            if (oilFumePurifiers?.length) {
                // 油烟净化器
                relation.oilFumePurifiers = {
                    id: OIL_FUME_PURIFIER_CLASSCODE,
                    name: i18n.global.t('meos_control_web.oil_fume_purifier'),
                    list: oilFumePurifiers
                };
            }
            return {
                ..._obj,
                relation
            };
        });
    });
    console.log('buildingFloorTree: ', buildingFloorTree, spaceIdMapSupplyFanIds);
    return { group, spaceIdSet, classMap, floorIdMapClassMap, buildingFloorTree, spaceIdMapSupplyFanIds };
};

export const makeInfoCodeMapData = (originData, setIotData) => {
    originData?.forEach(obj => {
        obj.relInfoCodeGroupConfigs?.forEach(group => {
            // console.log('group: ', group);
            obj[group.groupCode] = group.relInfoCodeConfigs;
            group.relInfoCodeConfigs?.forEach(info => {
                if (IOT_CODE_TYPE[info.infoCodeType]) {
                    setIotData(obj.id, info.infoCode, info);
                }
            });
        });
    });
};

export const getStaticisParamsKey = classCode => {
    if (classCode) {
        return `${classCode.toLowerCase()}ObjIds`;
    }
};

export const getIdsAndMap = classMapSet => {
    let ids = [];
    const classKeyMapIds = {};
    Object.entries(classMapSet).forEach(([k, val]) => {
        ids = ids.concat([...val]);
        // 统计只包排油烟风机（指排油烟风机-集中风机）、补风机和油烟机净化器
        // 即除小风机之外的
        if (k !== HOOD_RANGE_CLASSCODE) {
            classKeyMapIds[getStaticisParamsKey(k)] = [...val];
        }
    });
    return { ids, classKeyMapIds };
};
