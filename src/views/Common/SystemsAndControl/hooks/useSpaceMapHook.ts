import { listObjectsByTackValueLogic } from '@/apis/public';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { isPipe, isMachineRoomCF } from '@/views/GraphMVC/utils/classCodeJudge';
import { SpaceMapProps } from '../types/props';
import { ViewModeEnum } from '../types/index';
import * as _ from 'lodash';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';

// 锅炉
const BOILER_CLASS_CODE = ['ACCHEB', 'ACCHCB', 'ACCHGB', 'ACCHFB'];
// 热泵
const HEAT_PUMP_CLASS_CODE = ['ACCCAH', 'ACCCWH', 'ACCCGH'];
// 换热器
const HEAT_EXCHANGER_CLASS_CODE = ['ACGEHE'];

export const mapSpaceListKey = Symbol('mapSpaceListKey'); // 地图空间列表
export const currentMapSpaceObjKey = Symbol('currentMapSpaceObjKey'); // 当前地图空间对象
export const currentMapSpaceIdKey = Symbol('currentMapSpaceIdKey'); // 当前地图空间ID
export const curMapClassCodeMapIdsKey = Symbol('curMapClassCodeMapIdsKey'); // 当前地图分类编码与ID映射
export const curMapEquipIdsKey = Symbol('curMapEquipIdsKey'); // 当前地图视角设备ID
export const space3dSelectDataKey = Symbol('space3dSelectDataKey'); // 模型视角设备范围选中数据
export const space3dAllDataKey = Symbol('space3dAllDataKey'); // 模型视角设备范围筛选项数据

const boilerClassCodeMap = Object.fromEntries(BOILER_CLASS_CODE.map(c => [c, true]));
const exchangerClassCodeMap = Object.fromEntries(HEAT_EXCHANGER_CLASS_CODE.map(c => [c, true]));

const findDefaultSpace = (spaces: Array<Record<string, any>>, idMapClassCodes: Record<string, Set<string>>) => {
    if (!Array.isArray(spaces)) return null;

    let boilerObj = null,
        heatExchangerObj = null;

    for (const obj of spaces) {
        const relClassCode = [...(idMapClassCodes[obj.id] ?? [])];
        if (!Array.isArray(relClassCode)) continue;

        if (!boilerObj && relClassCode.some(c => boilerClassCodeMap[c])) {
            boilerObj = obj;
        } else if (!boilerObj && !heatExchangerObj && relClassCode.some(c => exchangerClassCodeMap[c])) {
            heatExchangerObj = obj;
        }

        if (boilerObj && heatExchangerObj) break;
    }

    // 默认选中锅炉所在的空间，如果锅炉所在的空间有多个，取返回的第一个。如果没有锅炉，默认选中换热器所在的空间。如果都没有，则选中第一个空间。
    const target = boilerObj || heatExchangerObj || spaces[0] || null;
    return target;
};

export const useSpaceMapHook = (props: SpaceMapProps) => {
    // 地图空间列表
    const mapSpaceList = ref();
    // 当前地图空间ID、设备ID等
    const currentMapSpaceId = ref();
    // 当前选择的空间对象
    const currentMapSpaceObj = computed(() => mapSpaceList.value?.find((obj: Record<string, any>) => obj.id === currentMapSpaceId.value));

    // 当前模型视角的设备ID
    const curMapEquipIds = ref<string[]>([]);
    const curMapClassCodeMapIds = ref(); // 当前机房设备id

    const space3dSelectData = ref();
    const space3dAllData = ref();
    const querySpaceLoading = ref(false);

    const { cancelQuest, cancelToken } = UseCancelTokenHooks();
    // 查询三维图空间列表
    const querySpaceList = async (systemId: string, curSystem: Record<string, any>, equipsClassCodes?: Record<string, string[]>) => {
        cancelQuest();
        mapSpaceList.value = [];
        currentMapSpaceId.value = '';
        if (!systemId) {
            return;
        }
        querySpaceLoading.value = true;
        try {
            const takeValueLogic = {
                queryInSpaces: true,
                queryParam: {
                    classCode: [...BOILER_CLASS_CODE, ...HEAT_PUMP_CLASS_CODE, ...HEAT_EXCHANGER_CLASS_CODE],
                    relationTo: {
                        graphCode: 'MechSubset',
                        relCode: 'Sy2Eq',
                        objFrom: [systemId]
                    },
                    withColumns: ['id', 'localName', 'classCode', 'floorId']
                },
                queryInSpaceAdditionalWithColumns: ['outline', 'floorId']
            };
            const params = {
                runningMonitorType: props.runningMonitorType,
                takeValueLogic
            };
            // 查询设备的参数，包括当前选中的关系图、关系图下的设备ids与classCode编码映射
            const finalParams = props?.queryEquipsParams ? props?.queryEquipsParams?.(curSystem, equipsClassCodes) || {} : params;
            const fetchApi = props?.queryEquipsApi ? props?.queryEquipsApi : listObjectsByTackValueLogic;
            const res = await fetchApi?.(finalParams, { cancelToken: cancelToken() }).finally(() => {
                querySpaceLoading.value = false;
            });
            const { code } = res || {};
            const data = res?.data || {};
            if (code === SUCCESSCODE) {
                const spaceIdMapClassCodes: Record<string, Set<string>> = {};
                const spaceMachines: Array<Record<string, any>> = [];
                const spaceSet = new Set();

                if (Array.isArray(data)) {
                    for (const equip of data) {
                        const { classCode, inSpaces } = equip;
                        if (Array.isArray(inSpaces)) {
                            inSpaces?.forEach((obj: Record<string, any>) => {
                                const tempObj = { ...(obj || {}) };
                                tempObj.name = tempObj.localName ?? '--';

                                if (spaceSet.has(obj.id)) {
                                    spaceIdMapClassCodes[obj.id].add(classCode);
                                } else {
                                    spaceSet.add(obj.id);
                                    spaceIdMapClassCodes[obj.id] = new Set();
                                    spaceIdMapClassCodes[obj.id].add(classCode);

                                    spaceMachines.push(tempObj);
                                }
                            });
                        }
                    }
                }
                const funcParams = {
                    data,
                    spaces: spaceMachines,
                    spaceIdMapClassCodes
                };

                // 空间设备按名称排序
                const allSpaces = _.sortBy(spaceMachines, ['localName']);
                mapSpaceList.value = props?.sortSpacesByClassCodes ? props?.sortSpacesByClassCodes(funcParams) : allSpaces;

                if (mapSpaceList.value?.length > 0) {
                    currentMapSpaceId.value = props?.findDefaultSpace
                        ? props?.findDefaultSpace(mapSpaceList.value, spaceIdMapClassCodes)?.id
                        : findDefaultSpace(mapSpaceList.value, spaceIdMapClassCodes)?.id;
                } else {
                    currentMapSpaceId.value = null;
                }
                // console.log('mapSpaceList: ', mapSpaceList, currentMapSpaceId.value);
            }
        } catch (e) {
            console.log('e: ', e);
        }
    };

    useWatchWithCleanup(currentMapSpaceId, () => {
        space3dSelectData.value = [];
        space3dAllData.value = [];
    });

    useWatchWithCleanup(space3dSelectData, () => {
        const classCodeMapIds: Record<string, string[]> = {};
        const ids: string[] = [];
        space3dSelectData.value?.forEach((obj: Record<string, any>) => {
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
        props?.getClassCodeEquipIdsMap(classCodeMapIds, ViewModeEnum.MAP_VIEW);
        curMapEquipIds.value = ids;
    });

    provide(mapSpaceListKey, mapSpaceList);
    provide(currentMapSpaceObjKey, currentMapSpaceObj);
    provide(currentMapSpaceIdKey, currentMapSpaceId);
    provide(curMapClassCodeMapIdsKey, curMapClassCodeMapIds);
    provide(curMapEquipIdsKey, curMapEquipIds);

    provide(space3dSelectDataKey, space3dSelectData);
    provide(space3dAllDataKey, space3dAllData);

    return { querySpaceList, querySpaceLoading, mapSpaceList, currentMapSpaceObj, currentMapSpaceId, curMapClassCodeMapIds, space3dSelectData, space3dAllData };
};
