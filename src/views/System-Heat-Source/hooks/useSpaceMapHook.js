import { listObjectsByTackValueLogic } from '@/apis/public';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { RUNNING_MONITOR_TYPE, BOILER_CLASSCODE, HEAT_PUMP_CLASSCODE, HEAT_EXCHANGER_CLASSCODE } from '../constant/variable';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { isPipe, isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import * as _ from 'lodash';

export const mapSpaceListKey = Symbol('mapSpaceListKey'); // 地图空间列表
export const currentMapSpaceObjKey = Symbol('currentMapSpaceObjKey'); // 当前地图空间对象
export const currentMapSpaceIdKey = Symbol('currentMapSpaceIdKey'); // 当前地图空间ID
export const curMapClassCodeMapIdsKey = Symbol('curMapClassCodeMapIdsKey'); // 当前地图分类编码与ID映射
export const curMapEquipIdsKey = Symbol('curMapEquipIdsKey'); // 当前地图视角设备ID
export const space3dSelectDataKey = Symbol('space3dSelectDataKey'); // 模型视角设备范围选中数据
export const space3dAllDataKey = Symbol('space3dAllDataKey'); // 模型视角设备范围筛选项数据

// 找默认空间
const findDefaultSpace = (spaces, idMapClassCodes) => {
    let target = null,
        boilerObj = null,
        heatExchangerObj = null;
    const boilerClasscodeMap = {};
    const exchangerClasscodeMap = {};
    BOILER_CLASSCODE.forEach(c => {
        boilerClasscodeMap[c] = true;
    });
    HEAT_EXCHANGER_CLASSCODE.forEach(c => {
        exchangerClasscodeMap[c] = true;
    });
    // 默认选中锅炉所在的空间，如果锅炉所在的空间有多个，取返回的第一个。如果没有锅炉，默认选中换热器所在的空间。如果都没有，则选中第一个空间。
    spaces?.forEach(obj => {
        let relClassCode = idMapClassCodes[obj.id] || [];
        relClassCode = [...relClassCode];
        // console.log('relClassCode: ', relClassCode);
        if (!boilerObj) {
            if (relClassCode.some(c => boilerClasscodeMap[c])) {
                boilerObj = obj;
            }
        }
        if (!boilerObj && !heatExchangerObj && relClassCode?.some(c => exchangerClasscodeMap[c])) {
            heatExchangerObj = obj;
        }
    });

    target = boilerObj || heatExchangerObj;
    if (!target && spaces?.length > 0) {
        target = spaces[0];
    }
    return target;
};
export default () => {
    // 地图空间列表
    const mapSpaceList = ref();
    // 当前地图空间ID、设备ID等
    const currentMapSpaceId = ref();
    // 当前选择的空间对象
    const currentMapSpaceObj = computed(() => mapSpaceList.value?.find(obj => obj.id === currentMapSpaceId.value));

    // 当前模型视角的设备ID
    const curMapEquipIds = ref([]);
    const curMapClassCodeMapIds = ref(); // 当前机房设备id

    const space3dSelectData = ref();
    const space3dAllData = ref();

    const { cancelQuest, cancelToken } = UseCancelTokenHooks();
    // 查询三维图空间列表
    const querySpaceList = async systemId => {
        cancelQuest();
        mapSpaceList.value = [];
        currentMapSpaceId.value = '';
        if (!systemId) {
            return;
        }
        try {
            const params = {
                runningMonitorType: RUNNING_MONITOR_TYPE,
                takeValueLogic: {
                    queryInSpaces: true,
                    queryParam: {
                        classCode: [...BOILER_CLASSCODE, ...HEAT_PUMP_CLASSCODE, ...HEAT_EXCHANGER_CLASSCODE],
                        relationTo: {
                            graphCode: 'MechSubset',
                            relCode: 'Sy2Eq',
                            objFrom: [systemId]
                        },
                        withColumns: ['id', 'localName', 'classCode', 'floorId']
                    },
                    queryInSpaceAdditionalWithColumns: ['outline', 'floorId']
                }
            };
            const res = await listObjectsByTackValueLogic(params, { cancelToken: cancelToken() });
            const { code, data } = res || {};
            // console.log('code, data: ', code, data);
            if (code === SUCCESSCODE) {
                const spaceIdMap = {};
                const spaceIdMapClassCodes = {};
                const spaceMachines = [];
                const spaceTowers = [];

                data?.forEach(equip => {
                    const { classCode, inSpaces } = equip;
                    inSpaces?.forEach(obj => {
                        obj.name = obj.localName ?? '--';
                        if (!spaceIdMap[obj.id]) {
                            spaceIdMap[obj.id] = true;
                            if (!spaceIdMapClassCodes[obj.id]) {
                                spaceIdMapClassCodes[obj.id] = new Set();
                            }
                            spaceIdMapClassCodes[obj.id].add(classCode);
                            spaceMachines.push(obj);
                        }
                    });
                });
                // 空间设备按名称排序
                mapSpaceList.value = _.sortBy(spaceMachines, ['localName']).concat(spaceTowers);

                if (mapSpaceList.value?.length > 0) {
                    currentMapSpaceId.value = findDefaultSpace(mapSpaceList.value, spaceIdMapClassCodes)?.id;
                } else {
                    currentMapSpaceId.value = null;
                }
                // console.log('mapSpaceList: ', mapSpaceList, currentMapSpaceId.value);
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    watch(currentMapSpaceId, () => {
        space3dSelectData.value = [];
        space3dAllData.value = [];
    });

    watch(space3dSelectData, () => {
        const classCodeMapIds = {};
        const ids = [];
        space3dSelectData.value?.forEach(obj => {
            const { classCode, id } = obj;
            ids.push(id);
            if (!isPipe(classCode) && !isMachineRoomCF(classCode)) {
                if (!classCodeMapIds[classCode]) {
                    classCodeMapIds[classCode] = [];
                }
                classCodeMapIds[classCode].push(id);
            }
        });
        curMapClassCodeMapIds.value = classCodeMapIds;
        curMapEquipIds.value = ids;
    });

    provide(mapSpaceListKey, mapSpaceList);
    provide(currentMapSpaceObjKey, currentMapSpaceObj);
    provide(currentMapSpaceIdKey, currentMapSpaceId);
    provide(curMapClassCodeMapIdsKey, curMapClassCodeMapIds);
    provide(curMapEquipIdsKey, curMapEquipIds);

    provide(space3dSelectDataKey, space3dSelectData);
    provide(space3dAllDataKey, space3dAllData);

    return { querySpaceList, curMapClassCodeMapIds };
};
