// @ts-ignore
import i18n from '@/localization';
import {
    isShaft,
    isStraightLadder,
    isEscalator,
    isEntranceAndExit,
    isTraction,
    isDoorGroup,
    isToilet,
    getInSpaceIds,
    getStraightLadderRelShaftId,
    getRelObjectIds,
    additionalFloorInfo
} from '@/views/elevatorSystem/utils';
import useStore from '@/store';
import _ from 'lodash';

import { listInfoCodeConfigsByObjectFilters } from '@/apis/monitor';
import { MODEL_VIEW, OBJ_TYPE } from '@/utils/globalVariables';

export const currentBuildingNumKey = Symbol('currentBuildingNumKey');

export default () => {
    const currentFloorObj = ref(); // 当前楼层对象
    const currentBuildingObj = ref(); // 当前建筑对象
    const currentBuildingNum = ref(0); // 当前建筑数量

    // 直梯列表
    const _straightLadderList = ref();

    const straightLadderList = computed(() => {
        return _straightLadderList.value?.filter(obj => {
            if (currentFloorObj.value?.id) {
                return obj.serviceSpaces?.some(space => space.floorId === currentFloorObj.value?.id);
            }
            return true;
        });
    });
    // 扶梯列表
    // const escalatorList = ref();

    // 扶梯列表树用的搜索下拉树数据
    const buildingFloorTree = ref();
    // 扶梯列表树选中的数据
    const buildingFloorTreeItem = ref({});

    const originDataList = ref();
    const mapDataInfo = ref();
    const usedFloorIds = ref();
    // 地图业务数据请求加载状态
    const mapBusiDataLoading = ref(false);

    const { base } = useStore();

    let cancelChartLoad = null;

    const escalatorList = computed(() => {
        return mapDataInfo.value?.escalators || [];
    });
    // 扶梯，按楼层结构
    const escalatorsInTree = computed(() => {
        const floorRecord = {};
        escalatorList.value?.forEach(obj => {
            if (!obj.floorId) {
                return;
            }
            if (currentFloorObj.value?.id) {
                if (obj.floorId === currentFloorObj.value?.id) {
                    if (!floorRecord[obj.floorId]) {
                        floorRecord[obj.floorId] = [];
                    }
                    floorRecord[obj.floorId].push(obj);
                }
            } else {
                if (Object.keys(buildingFloorTreeItem.value).length === 0) {
                    if (!floorRecord[obj.floorId]) {
                        floorRecord[obj.floorId] = [];
                    }
                    floorRecord[obj.floorId].push(obj);
                } else if (obj.floorId === buildingFloorTreeItem?.value?.id) {
                    if (!floorRecord[obj.floorId]) {
                        floorRecord[obj.floorId] = [];
                    }
                    floorRecord[obj.floorId].push(obj);
                }
            }
        });
        const floorArr = Object.keys(floorRecord).map(floorId => {
            const arr = floorRecord[floorId];
            const obj = arr[0];
            return {
                floorId: obj.floorId,
                floorSequenceId: obj.floorSequenceId,
                floorLocalName: obj.floorLocalName,
                buildingId: obj.buildingId,
                projectName: buildingFloorTree.value.find(item => item.id === obj.buildingId)?.name || '',
                children: arr
            };
        });
        // 按建筑实际顺序排序
        const sortedFloorArr = floorArr.toSorted((a, b) => {
            const aBuildIndex = buildingFloorTree?.value.findIndex(item => item.id === a.buildingId) || -1;
            const bBuildIndex = buildingFloorTree?.value.findIndex(item => item.id === b.buildingId) || -1;
            return aBuildIndex - bBuildIndex;
        });
        // console.log('escalatorsInTree:effect ', floorArr, escalatorList.value);
        const groupedBuilding = _(sortedFloorArr)
            .groupBy('buildingId')
            .mapValues(categoryItems => _.orderBy(categoryItems, 'floorSequenceId')) // 在每个分组内部按quantity排序
            .value();
        const rst = Object.values(groupedBuilding || {}).reduce((pre, cur) => {
            return pre.concat(cur);
        }, []);

        return rst;
    });

    watchEffect(() => {
        // 直梯
        let straightLadders = [],
            shafts = [];
        // 扶梯
        const escalators = [];

        const tractions = [];
        const entranceAndExits = [];
        const doorGroups = [];
        const inSpaces = [];

        const _spaceIdMap = {};
        const _shaftIdMap = {};
        const floorRecord = {};

        const _usedFloorIdSet = new Set();
        originDataList.value?.forEach(obj => {
            additionalFloorInfo(obj, floorRecord);
            const { classCode } = obj;
            if (obj.objType === OBJ_TYPE.SPACE) {
                _spaceIdMap[obj.id] = obj;
            }
            if (isShaft(classCode)) {
                shafts.push(obj);
                // _shaftIdMap[obj.id] = obj;
                obj.relSpaceIds = getInSpaceIds(obj.relInfoCodeGroupConfigs);
            } else if (isEscalator(classCode)) {
                // mockEquipStatus(obj);
                // obj.inSpaceIds = getInSpaceIds(obj.relInfoCodeGroupConfigs);
                escalators.push(obj);

                _usedFloorIdSet.add(obj.floorId);
                // console.log('_usedFloorIdSet--obj.floorId: ', obj.floorId);
            } else if (isStraightLadder(classCode)) {
                obj.serviceSpaceIds = getRelObjectIds(obj.relInfoCodeGroupConfigs, 'serviceSpace');
                obj.serviceFloorIds = getRelObjectIds(obj.relInfoCodeGroupConfigs, 'serviceFloor');
                obj.relShaftId = getStraightLadderRelShaftId(obj.relInfoCodeGroupConfigs);
                // mockEquipStatus(obj);
                straightLadders.push(obj);
            } else if (isTraction(classCode)) {
                obj.inSpaceIds = getInSpaceIds(obj.relInfoCodeGroupConfigs);
                tractions.push(obj);
                _usedFloorIdSet.add(obj.floorId);
            } else if (isDoorGroup(classCode)) {
                if (obj.bimLocation) {
                    doorGroups.push(obj);
                    _usedFloorIdSet.add(obj.floorId?.find(fId => !!fId));
                }
            }
            // else if (isEntranceAndExit(obj.roomFuncType)) {
            //     entranceAndExits.push(obj);
            //     _usedFloorIdSet.add(obj.floorId);
            // }
        });

        shafts = shafts
            .map(obj => {
                obj.shaftSpaceList = obj.relSpaceIds
                    ?.map(id => {
                        return _spaceIdMap[id];
                    })
                    .filter(Boolean);
                return obj;
            })
            .filter(obj => obj.shaftSpaceList?.length > 0);
        shafts?.forEach(obj => {
            _shaftIdMap[obj.id] = obj;
        });
        straightLadders = straightLadders.filter(obj => {
            if (obj.relShaftId && _shaftIdMap[obj.relShaftId]) {
                obj.relShaft = _shaftIdMap[obj.relShaftId];
                obj.serviceSpaces = obj.serviceSpaceIds
                    ?.map(id => {
                        const space = _spaceIdMap[id];
                        _usedFloorIdSet.add(space?.floorId);
                        return space;
                    })
                    .filter(Boolean);

                return obj;
            }
            return false;
        });
        shafts = straightLadders?.map(obj => obj.relShaft);
        // 扶梯所在空间
        // escalators.forEach(obj => {
        //     const inSpaceId = obj.inSpaceIds?.length > 0 ? obj.inSpaceIds[0] : null;
        //     const s = _spaceIdMap[inSpaceId];
        //     if (inSpaceId && s) {
        //         // 空间包含扶梯
        //         s.isContainEscalator = true;
        //         inSpaces.push(_spaceIdMap[inSpaceId]);
        //     }
        // });
        // 曳引机所在空间
        tractions.forEach(obj => {
            const inSpaceId = obj.inSpaceIds?.length > 0 ? obj.inSpaceIds[0] : null;
            const s = _spaceIdMap[inSpaceId];
            if (inSpaceId && s) {
                // 空间包含曳引机
                s.isContainTraction = true;
                inSpaces.push(_spaceIdMap[inSpaceId]);
            }
        });
        if (originDataList.value?.length > 0) {
            usedFloorIds.value = [..._usedFloorIdSet].filter(Boolean);
            // console.log('inSpaces: ', inSpaces);
            // console.log('entranceAndExits: ', entranceAndExits);
            // console.log('doorGroups: ', doorGroups);
            // console.log('escalators: ', escalators, straightLadders);
            // console.log('shafts: ', shafts);
            _straightLadderList.value = straightLadders;

            mapDataInfo.value = {
                straightLadders,
                escalators,
                shafts,
                tractions,
                entranceAndExits,
                doorGroups,
                spaces: inSpaces
            };
        }
    });

    const queryMapData = async () => {
        if (cancelChartLoad) {
            cancelChartLoad?.abort();
        }
        cancelChartLoad = new AbortController();
        usedFloorIds.value = [];

        mapBusiDataLoading.value = true;
        const p = {
            projectId: base.projectId,
            runningMonitorType: 'ELEVATOR',
            templateCode: MODEL_VIEW,
            orders: [{ column: 'localName', chineseOrder: true }]
        };

        try {
            const res = await listInfoCodeConfigsByObjectFilters(p, cancelChartLoad.signal);
            // console.log('res=======: ', res);

            mapBusiDataLoading.value = false;
            if (res.code === '00000' && res.data) {
                originDataList.value = res.data;
            }
        } catch (e) {
            mapBusiDataLoading.value = false;
            console.log('e: ', e);
        }
    };

    queryMapData();

    provide('currentFloorObj', currentFloorObj);
    provide('currentBuildingObj', currentBuildingObj);
    provide(currentBuildingNumKey, currentBuildingNum);
    provide('straightLadderList', straightLadderList);
    provide('escalatorList', escalatorList);
    provide('escalatorsInTree', escalatorsInTree);
    provide('buildingFloorTree', buildingFloorTree);
    provide('buildingFloorTreeItem', buildingFloorTreeItem);
    provide('mapDataInfo', mapDataInfo);
    provide('usedFloorIds', usedFloorIds);
    provide('mapBusiDataLoading', mapBusiDataLoading);
    return { currentFloorObj, escalatorsInTree, straightLadderList, mapBusiDataLoading, originDataList };
};
