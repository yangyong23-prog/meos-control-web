// @ts-ignore
import i18n from '@/localization';
import { gridDataKey, loadinhGridDataKey, spaceIdMapSupplyFanIdsKey, allEqCLassCodeInfoListKey } from '../constant/injectKey';
import { GRID, SUCCESSCODE } from '@/utils/globalVariables';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import { HOOD_RANGE_CLASSCODE, RUNNING_MONITOR_TYPE } from '../constant/index';
import { listInfoCodeConfigsByObjectCommon, listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import { queryStaticGrid } from '@/apis/kitchenFumes';
import DockSingleton from '@/hooks/responsiveDock';
import { makeGridsData, makeInfoCodeMapData, getIdsAndMap } from '../utils/index';
import dataDockHandling from '@/hooks/dataDockHandling';
import { getKnowledgeListClassCodes } from '@/apis/public';

import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';

export default (spaceData, equipsForMap, currentFloorObj, curFloorSpaceList, curFloorEquipmentList) => {
    // TODO
    const gridData = ref([]);
    const buildingFloorTree = ref([]);
    const gridAllEquipIds = ref([]);
    const loadinhGridData = ref(false);
    const spaceIdMapSupplyFanIds = ref({});
    const floorIdMapClassMapShallow = shallowRef();

    const equipClassCode2objectIds = ref({});
    const allEqCLassCodeInfoList = ref(null);

    const { loadDynaDataWithIotHandling } = dataDockHandling();

    const claasCode2objectIds = computed(() => {
        const equipObj = equipClassCode2objectIds.value;
        // 空间取值：
        // ①该项目下设备类=ACKLSF，且风机定位（fanPos）=1（集中风机）；
        // ②设备有服务空间的关系：图类型“机电类服务区域关系”（MechForArch），边类型“设备服务于空间”（Eq2Sp），from设备，to空间
        // ③服务空间的信息点“是否需要排油烟（needExaustSmoke）=1(是)”的空间
        const spaceIds = spaceData?.value?.map(item => item?.id)?.filter(s => !!s) || [];
        if (spaceIds?.length) {
            return { GeneralZone: spaceIds, ...equipObj };
        }
        return equipObj;
    });
    // const infoCodeIdMap = ref({});
    // 统计接口的参数
    const allStaticParams = ref(null);

    const { setIotData, getIotData, setAbnormalEvent, getAbnormalEventsList, getObjectAbnormalStatus, clearAllObjectInfo } = DockSingleton.getInstance();

    const queryEquipClassCodeNames = async classCodes => {
        if (!classCodes?.length) {
            return {};
        }
        const res = await getKnowledgeListClassCodes({ classCodes, queryCache: false, isThrows: false });
        console.log('res: ', res);
        if (res?.code === SUCCESSCODE) {
            const d = res.data || [];
            allEqCLassCodeInfoList.value = d;
        }
        return {};
    };
    const loadGridDynaData = async equipIds => {
        if (!equipIds?.length) {
            return;
        }
        const p = {
            templateCode: GRID,
            runningMonitorType: RUNNING_MONITOR_TYPE,
            objectIds: equipIds,
            withColumns: ['bimLocation', 'buildingId', 'classCode', 'floorId', 'id', 'localName', 'objType', 'name', 'monitoringSurveillanceStatus']
        };
        const res = await loadDynaDataWithIotHandling(p, listInfoCodeConfigsByObjectIdCommon, undefined);

        if (res?.code === SUCCESSCODE) {
            const floorCache = {};
            const d = res.data;
            equipsForMap.value =
                d?.map(item => {
                    additionalFloorInfo(item, floorCache);
                    const newObj = { ...item };
                    delete newObj.relInfoCodeGroupConfigs;
                    delete newObj.equipStatus;
                    delete newObj.equipStatus;
                    return newObj;
                }) || [];
            const { classCodeIds } = iterateObjct4InstanceInfo(d);
            if (classCodeIds) {
                queryEquipClassCodeNames(Object.keys(classCodeIds));
            }

            equipClassCode2objectIds.value = classCodeIds;
        }
    };

    const loadGridsData = async () => {
        loadinhGridData.value = true;
        try {
            allStaticParams.value = null;
            const res = await queryStaticGrid();
            if (res?.code === SUCCESSCODE) {
                const rst = makeGridsData(res.data);
                loadinhGridData.value = false;
                if (rst) {
                    const { group, spaceIdSet, classMap, floorIdMapClassMap, buildingFloorTree: _buildingFloorTree, spaceIdMapSupplyFanIds: _spaceIdMapSupplyFanIds } = rst;
                    spaceIdMapSupplyFanIds.value = _spaceIdMapSupplyFanIds;
                    gridData.value = group;
                    buildingFloorTree.value = _buildingFloorTree;

                    const { ids, classKeyMapIds } = getIdsAndMap(classMap);
                    gridAllEquipIds.value = ids || [];
                    floorIdMapClassMapShallow.value = floorIdMapClassMap;

                    allStaticParams.value = classKeyMapIds;
                    loadGridDynaData(ids);
                }
            }
        } catch (e) {
            console.log('e: ', e);
            loadinhGridData.value = false;
        }
    };

    const staticParams = computed(() => {
        if (currentFloorObj.value?.id) {
            const classCodeMap = floorIdMapClassMapShallow.value?.[currentFloorObj.value?.id];
            if (!classCodeMap) {
                return null;
            }
            const { classKeyMapIds } = getIdsAndMap(classCodeMap);
            return classKeyMapIds;
        }
        return allStaticParams.value;
    });

    const abnormalParamIds = computed(() => {
        let spaceIds = [],
            equipIds = [];
        if (currentFloorObj?.value?.id) {
            spaceIds = curFloorSpaceList?.value?.map(obj => obj.id) ?? [];
            equipIds = curFloorEquipmentList?.value?.map(obj => obj.id) ?? [];
        } else {
            spaceIds = spaceData?.value?.map(item => item?.id)?.filter(s => !!s) || [];
            equipIds = gridAllEquipIds.value ?? [];
        }
        return [...spaceIds, ...equipIds];
    });

    loadGridsData();

    // 根据设备ID，infoCode 获取信息点只
    const getObjectInfoData = (id, infoCode, groupCode = 'equipStatus') => {
        // const obj = infoCodeIdMap.value[id];
        // if (obj) {
        //     return obj[groupCode]?.find(info => info.infoCode === infoCode);
        // }
        return getIotData(id, infoCode);
    };
    // 有异常事件
    const isAbnormal = id => {
        // return getObjectInfoData(id, 'alarmstatus')?.dataValue === 'alarmstatus';
        return getObjectAbnormalStatus(id);
        // return getObjectAbnormalStatus(o => o.id === id);
    };
    // 控反不一致
    const isOrderFailAlarm = id => {
        return getObjectInfoData(id, 'orderFailAlarm')?.dataValue === '1';
    };
    // 离线
    const isOffline = id => {
        return getObjectInfoData(id, 'onlineStatus')?.dataValue === '0';
    };
    // 1:异常事件，2:控反不一致，3:离线，其它：无
    const getAbnormalWeight = (id, onlyAbnormalEvent = false) => {
        let arr = [];
        if (isAbnormal(id)) {
            arr.push(1);
        }
        if (!onlyAbnormalEvent) {
            if (isOrderFailAlarm(id)) {
                arr.push(2);
            }
            if (isOffline(id)) {
                arr.push(3);
            }
        }
        return arr?.length > 0 ? arr : null;
    };

    const getRunStatusVal = id => {
        return getObjectInfoData(id, 'runStatus')?.dataValue;
    };

    const isEqListHasAbnormal = (equips, onlyAbnormalEvent = false) => {
        for (let i = 0; i < equips?.length; i++) {
            const item = equips[i];
            if (getAbnormalWeight(item.id, onlyAbnormalEvent)) {
                return true;
            }
        }
        return false;
    };
    const getSpaceRelEqHasAbnormal = (s, onlyAbnormalEvent = false) => {
        for (let i = 0; i < s?.length; i++) {
            const item = s[i];
            if (item.subitem && isEqListHasAbnormal(item.subitem, onlyAbnormalEvent)) {
                return true;
            }
        }
        return false;
    };
    const isCardHasAbnormal = (obj, onlyAbnormalEvent = false) => {
        if (getAbnormalWeight(obj.id, onlyAbnormalEvent)) {
            return true;
        }
        const { serviceSpaces, oilFumePurifiers, supplementalFans } = obj.relation;
        if (getSpaceRelEqHasAbnormal(serviceSpaces, onlyAbnormalEvent)) {
            return true;
        }
        if (oilFumePurifiers?.list && isEqListHasAbnormal(oilFumePurifiers.list, onlyAbnormalEvent)) {
            return true;
        }
        if (supplementalFans?.list && isEqListHasAbnormal(supplementalFans.list, onlyAbnormalEvent)) {
            return true;
        }
        return false;
    };
    // 楼层有异常记录
    const floorAbnormalRecord = computed(() => {
        const rst = {};
        gridData.value?.forEach(floorNode => {
            for (let i = 0; i < floorNode.list?.length; i++) {
                const item = floorNode.list[i];
                if (isCardHasAbnormal(item)) {
                    rst[item.floorId] = true;
                    break;
                }
            }
        });
        return rst;
    });
    provide(gridDataKey, gridData);
    provide(loadinhGridDataKey, loadinhGridData);
    provide('isAbnormal', isAbnormal);
    provide('getRunStatusVal', getRunStatusVal);
    provide('isOrderFailAlarm', isOrderFailAlarm);
    provide('isOffline', isOffline);
    provide('getAbnormalWeight', getAbnormalWeight);
    provide('isCardHasAbnormal', isCardHasAbnormal);
    provide('staticParams', staticParams);
    provide('abnormalParamIds', abnormalParamIds);
    provide('floorAbnormalRecord', floorAbnormalRecord);
    provide('buildingFloorTree', buildingFloorTree);

    provide('setIotData', setIotData);
    provide('getIotData', getIotData);
    provide('setAbnormalEvent', setAbnormalEvent);
    provide('getAbnormalEventsList', getAbnormalEventsList);
    provide('getObjectAbnormalStatus', getObjectAbnormalStatus);
    provide('claasCode2objectIds', claasCode2objectIds);
    provide(spaceIdMapSupplyFanIdsKey, spaceIdMapSupplyFanIds);
    provide(allEqCLassCodeInfoListKey, allEqCLassCodeInfoList);

    return { claasCode2objectIds, equipClassCode2objectIds };
};
