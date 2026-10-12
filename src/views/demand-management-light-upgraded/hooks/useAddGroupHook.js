// @ts-ignore
import i18n from '@/localization';
import { getLightingEquipmentList } from '@/apis/IndoorLighting';
import { listObjectsByTackValueLogic } from '@/apis/public';
import useLoading from '@/hooks/useLoading';
import baseStore from '@/store/baseStore';
import treeBuildFloor from '@/store/treeBuildFloor';
import { GeneralZone, SUCCESSCODE } from '@/utils/globalVariables';
import { uniqBy } from 'lodash';
import { loopsDataKey } from './useLoopGroupHook';
import { publicAreaVisibleKey } from './useGlobalData';
export const getModuleListByFloorIdKey = Symbol('getModuleListByFloorId');
export const getLoopListByFloorIdKey = Symbol('getLoopListByFloorId');
export const getLoopListByModuleIdKey = Symbol('getLoopListByModuleId');
export const getModuleListByLoopIdKey = Symbol('getModuleListByLoopId');

export const getAllLoopListKey = Symbol('getAllLoopList');
export const moduleIdsKey = Symbol('moduleIds');
export const activeTreeNodeKey = Symbol('activeTreeNode');
export const loopListMapKey = Symbol('loopListMap');
export const moduleListMapKey = Symbol('moduleListMap');
export const setLoopSelectStatusKey = Symbol('setLoopSelectStatusKey');
export const getLoopSelectStatusKey = Symbol('getLoopSelectStatus');
export const activeLoopListKey = Symbol('activeLoopList');

export const viewSelectKey = Symbol('viewSelect');

// { templateType, defaultLoopIds, tag }
export const useAddGroup = props => {
    // 加载动画相关
    const { openLoading, closeLoading } = useLoading(
        'light-group-new-content',
        '#F1F4F6',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    const loopsData = inject(loopsDataKey, ref([])); // 用于存储回路数据
    const publicAreaVisible = inject(publicAreaVisibleKey);
    const moduleIds = ref([baseStore().projectId]);
    const activeTreeNode = ref();
    const gridData = ref([]);
    const loopListMap = ref(new Map());
    const moduleListMap = ref(new Map());
    const floorLoopListMap = ref(new Map());
    const activeLoopList = ref([]);
    const viewSelect = ref('uncheck');
    const serviceAreaTypeObj = {
        PUBLIC_AREA_LIGHTING: '1',
        PARKING_LOT_LIGHTING: '2',
        BUILDING_LIGHTING: '3',
        LANDSCAPE_LIGHTING: '4',
        SIGN_LIGHTING: '5'
    };
    const getLoopListFn = async () => {
        let res = {};
        if (loopsData.value.length > 0) {
            res = {
                code: SUCCESSCODE,
                data: loopsData.value
            };
            await handleData(res);
        } else {
            openLoading();
            try {
                res = await getLightingEquipmentList({
                    withColumns: ['id', 'buildingId', 'funcType', 'lampFuncType', 'serviceAreaType', 'localName', 'floorId', 'classCode'],
                    runningMonitorSecondType: props.templateType
                });
                const serviceAreaType = serviceAreaTypeObj[props.templateType] || '1';
                const newResData = res.data.filter(item => {
                    if (publicAreaVisible.value) {
                        const hasControl = item?.relController?.length || item?.relDDC?.length;
                        return item.serviceAreaType === serviceAreaType && hasControl;
                    }
                    return item.serviceAreaType === serviceAreaType;
                });
                await handleData({ code: SUCCESSCODE, data: newResData });
            } catch (error) {
                console.error(error);
                loopListMap.value = new Map();
            } finally {
                closeLoading();
            }
        }
    };
    const handleData = async res => {
        let arr = [];
        const { code, data } = res;
        arr = data;
        if (props.tag) {
            arr = data.filter(item => item.funcType === props.tag); // 过滤掉没有控制器的回路
        }
        const treeData = new Map();
        if (code === SUCCESSCODE) {
            // 设置设备数据
            // 主页按楼层统计回路时，统计的逻辑是根据通过“照明回路服务空间、空间所属楼层”的关系查询出服务这一楼层的回路（一条回路服务两个楼层，则会在两个楼层均会统计该回路）
            arr?.forEach(item => {
                item.isSelected = false;
                if (props.defaultLoopIds.includes(item.id)) {
                    item.isSelected = true; // 默认选中传入的回路ID
                }

                loopListMap.value.set(item.id, item);

                if (Array.isArray(item.relController) || Array.isArray(item.relDDC)) {
                    const relDDC = (item?.relDDC || []).map(v => {
                        return { ...v, floorId: v?.floorId || item?.floorId || item?.relController[0]?.floorId || item?.relSpace?.[0]?.floorId };
                    });
                    const relController = item?.relController || [];
                    const allItems = [...relController, ...relDDC];
                    item.relController = uniqBy(allItems, 'id');
                }
                item.relController?.forEach(v => {
                    item.relModuleId = v.id;
                    moduleListMap.value.set(v.id, v);
                });

                (item.relSpace || []).forEach(space => {
                    const floor = treeBuildFloor().getBuildOrFloor(space.floorId);

                    if (floorLoopListMap.value.get(space.floorId)) {
                        floorLoopListMap.value.get(space.floorId).loops.push(item);
                    } else {
                        const floorObj = { id: space.floorId, localName: floor.localName, name: floor.localName, floorSequenceId: floor.floorSequenceId, loops: [item] };
                        floorLoopListMap.value.set(space.floorId, floorObj);
                    }
                    if (treeData.get(floor.buildingId)) {
                        treeData.get(floor.buildingId).floors.set(floor.id, floor);
                    } else {
                        const obj = treeBuildFloor().getBuildOrFloor(floor.buildingId);
                        treeData.set(floor.buildingId, {
                            id: floor.buildingId,
                            localName: obj.localName,
                            name: obj.localName,
                            floors: new Map([[floor.id, floor]])
                        });
                    }
                });
            });
            await getSpaceByModule();
            gridData.value = [...treeData.values().map(item => ({ ...item, floors: [...item.floors.values()] }))];
            gridData.value.forEach(item => {
                item.floors = item.floors.sort((a, b) => b.floorSequenceId - a.floorSequenceId);
            });
            activeLoopList.value = getAllLoopList();
        }
    };
    const getSpaceByModule = async () => {
        const res = await listObjectsByTackValueLogic({
            runningMonitorType: 'LIGHTING',
            takeValueLogic: {
                queryParam: {
                    classCode: GeneralZone,
                    relationTo: {
                        graphCode: 'MechInArch',
                        relCode: 'Eq2Sp',
                        objFrom: [...moduleListMap.value.keys()]
                    },
                    withColumns: ['id', 'localName', 'relObjIds', 'roomFuncType', 'classCode', 'floorId'],
                    valid: 1
                }
            }
        });
        // 处理返回结果,模块关联的空间
        if (res.code === SUCCESSCODE) {
            res.data.forEach(item => {
                item.relObjIds.forEach(objId => {
                    // 照明控制模块关联多个空间时，取第一个
                    moduleListMap.value.get(objId) && !moduleListMap.value.get(objId).relSpace && (moduleListMap.value.get(objId).relSpace = item);
                });
            });
            console.log('moduleListMap.value', moduleListMap.value);
        }
    };
    /**
     * 根据楼层ID获取模块列表
     *
     * 此函数从模块列表中筛选出属于特定楼层的模块它通过比较模块的floorId属性与给定的楼层ID来过滤模块
     * 使用Array.from和filter方法确保只选取匹配的项，并返回一个新的数组
     *
     * @param {string} floorId - 楼层ID，用于筛选模块
     * @returns {Array} - 匹配给定楼层ID的模块数组
     */
    const getModuleListByFloorId = (floorId, isFindRelSpace = false) => {
        const allModuleList = Array.from(moduleListMap.value.values());
        return allModuleList.filter(item => {
            const relSpaceFloorId = item?.relSpace?.floorId;
            const compareFloorId = isFindRelSpace ? relSpaceFloorId : item.floorId;
            return compareFloorId === floorId;
        });
    };
    /**
     * 根据楼层ID获取回路列表
     *
     * 此函数旨在从一个楼层回路列表中，根据特定的楼层ID，找到并返回该楼层对应的回路列表
     * 如果指定的楼层ID不存在于列表中，则返回一个空数组
     *
     * @param {string} floorId - 楼层ID，用于标识特定的楼层
     * @returns {Array} 返回该楼层对应的回路列表，如果找不到则返回空数组
     */
    const getLoopListByFloorId = floorId => {
        let loops = floorLoopListMap.value.get(floorId).loops || [];
        return uniqBy(loops, 'id');
    };
    /**
     * 根据模块ID获取回路列表
     *
     * 此函数用于从一个回路列表中过滤出与给定模块ID相关联的回路列表
     * 它通过比较回路中的relModuleId与给定的moduleId来筛选结果
     *
     * @param {string} moduleId - 模块ID，用于筛选回路列表
     * @returns {Array} 返回一个数组，包含所有与给定模块ID相关联的回路对象
     */
    const getLoopListByModuleId = moduleId => {
        return Array.from(loopListMap.value.values()).filter(loop => (loop?.relController || [])?.some(v => v?.id === moduleId));
    };
    /**
     * 根据回路ID获取模块列表
     *
     * 此函数旨在通过特定的回路ID来获取与其关联的模块列表这些模块是根据回路ID在回路列表中找到的
     * 如果没有找到关联的控制器，或者关联的控制器未定义，函数将返回一个空数组
     *
     * @param {string} loopId - 回路ID，用于在回路列表中查找特定的回路对象
     * @returns {Array} - 与特定回路ID关联的模块列表如果找不到关联的控制器，则返回空数组
     */
    const getModuleListByLoopId = loopId => {
        const { relController } = loopListMap.value.get(loopId) || {};
        return relController?.map(module => moduleListMap.value.get(module.id));
    };
    /**
     * 获取所有回路列表项
     * @returns {Array} 包含所有回路列表项的数组
     */
    const getAllLoopList = () => {
        return Array.from(loopListMap.value.values());
    };
    /**
     * 修改指定回路列表项的选择状态
     * @param {string|number} loopId - 要修改的回路列表项ID
     * @param {boolean} isSelected - 要设置的选择状态(true/false)
     */
    const setLoopSelectStatus = (loopId, isSelected) => {
        const loop = loopListMap.value.get(loopId);
        if (loop) {
            loop.isSelected = isSelected;
            loopListMap.value.set(loopId, loop);
        }
    };
    /**
     * 获取指定回路列表项的选择状态
     * @param {string|number} loopId - 要查询的回路列表项ID
     * @returns {boolean} 当前选择状态(未找到返回false)
     */
    const getLoopSelectStatus = loopId => {
        const loop = loopListMap.value.get(loopId);
        return loop ? loop.isSelected : false;
    };
    onMounted(() => {
        getLoopListFn();
    });
    provide(getModuleListByFloorIdKey, getModuleListByFloorId);
    provide(getLoopListByFloorIdKey, getLoopListByFloorId);
    provide(getLoopListByModuleIdKey, getLoopListByModuleId);
    provide(getModuleListByLoopIdKey, getModuleListByLoopId);
    provide(getAllLoopListKey, getAllLoopList);
    provide(setLoopSelectStatusKey, setLoopSelectStatus);
    provide(getLoopSelectStatusKey, getLoopSelectStatus);
    provide(activeLoopListKey, activeLoopList);
    provide(moduleIdsKey, moduleIds);
    provide(activeTreeNodeKey, activeTreeNode);
    provide(loopListMapKey, loopListMap);
    provide(moduleListMapKey, moduleListMap);
    provide(viewSelectKey, viewSelect);
    return { gridData, getLoopListFn, loopListMap, activeTreeNode, viewSelect };
};
