// @ts-ignore
import i18n from '@/localization';
import { computerRoomSecurity, querySpace, getObjectsInFloor, querySpaceV2 } from '@/apis/machineRoomSafety';
import dataDockHandling from '@/hooks/dataDockHandling';
import DockSingleton from '@/hooks/responsiveDock';
import useLoading from '@/hooks/useLoading';
import { RUNNING_MONITOR_TYPE, SPACE_STATUS, FLOOR_MAP_CLASSCODES } from '../variable';
import useStore from '@/store';
import { SSEHook } from './useSSEHook';
import { iterateObjct4InstanceInfo } from '@/utils';
import xplantindoorenvStore from '@/store/xplantindoorenv';
import { uniq, uniqBy } from 'lodash';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { getListTreeBuildingFloorSpace } from '@/apis/xplantindoorenv3d';
import { GeneralZone, GRID, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { listInfoCodeConfigsByObjectIdCommon, listObjectsByTackValueLogic } from '@/apis/public';
import { getBuildingInfoByFloorId } from '@/utils/buildingFloorTreeUtils';
import useRewriteSingletonDanegerEventFn from './useRewriteSingletonDanegerEventFn';
import useRewriteSingletonAbnormalEventFn from './useRewriteSingletonAbnormalEventFn';
import { sortEquipByLevelAndName, sortDangerEventByTagAndName, sortDangerEventByStatus } from '../utils';
import { onlyMachineRoomInjectKey, curSelectedRoomTypesInjectKey } from '../constant/injectKey';
import { getAbnormalListByObjIdsV2 } from '@/apis/common';

/**
 * 定义应用中使用的各种Symbol键，用于在状态管理或上下文中唯一标识不同的数据类型和状态
 * 这些Symbol键主要用于避免字符串键可能引起的命名冲突问题
 */

// 房间类型相关键
export const roomTypesKey = Symbol('roomTypesKey');
export const roomTypeModelKey = Symbol('roomTypeModelKey');

// 空间状态相关键
export const spaceStatusKey = Symbol('spaceStatusKey');
export const spaceStatusModelKey = Symbol('spaceStatusModelKey');

// 视图视角相关键
export const viewPerspectiveKey = Symbol('viewPerspectiveKey');
export const viewPerspectiveModelKey = Symbol('viewPerspectiveModelKey');

// 异常事件列表相关键
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey');
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey');
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey');
export const abnormalEventListKey = Symbol('abnormalEventListKey');

// 当前空间和楼层信息相关键
export const currentSpaceIdKey = Symbol('currentSpaceIdKey');
export const curDashboardFilterIdKey = Symbol('curDashboardFilterIdKey');
export const currentFloorInfoKey = Symbol('currentFloorInfoKey');
export const currentFloorSpacesKey = Symbol('currentFloorSpacesKey');

// 设备状态和楼层数据相关键
export const equipmentsWithStatusKey = Symbol('equipmentsWithStatusKey');
export const dashboardFloorIdsKey = Symbol('dashboardFloorIdsKey');
export const allBuildingDataKey = Symbol('allBuildingDataKey');

// 地图和加载状态相关键
export const mapBgColorKey = Symbol('mapBgColorKey');
export const isWaitBuildingLoadingKey = Symbol('isWaitBuildingLoadingKey');
export const loadingDangerEventsKey = Symbol('loadingDangerEventsKey');

// 动态数据和功能函数相关键
export const idDynaDataKey = Symbol('idDynaDataKey');
export const openPlayerFnKey = Symbol('openPlayerFnKey');

// 加载状态相关键
export const isAllSpacesLoadedKey = Symbol('isAllSpacesLoadedKey');
export const activeOnlyMagRiskModelKey = Symbol('activeOnlyMagRiskModelKey'); // 仅主动管理的风险,组件model key
export const isActiveOnlyMagRiskKey = Symbol('isActiveOnlyMagRiskKey'); // 是否仅主动管理的风险,布尔值 key
export const targetSpaceEquipIdsKey = Symbol('targetSpaceEquipIdsKey'); //
export const currentFloorSpacesWithEquipIdsKey = Symbol('currentFloorSpacesWithEquipIdsKey'); //

// 机房空间相关键
export const currentFloorMachineRoomSpacesKey = Symbol('currentFloorMachineRoomSpacesKey');

export const loadingFloorDataKey = Symbol('loadingFloorDataKey'); // 楼层空间加载中

export const rightUnknownRiskEventListKey = Symbol('rightUnknownRiskEventListKey');

export const abnormalIdleLoadingKey = Symbol('abnormalIdleLoadingKey');
export const riskEventIdleLoadingKey = Symbol('riskEventIdleLoadingKey');

export const useBaseDataHook = (callToggleWidth, closeDetailDrawer) => {
    /**
     * 从全局状态中获取基础信息，如 projectId。
     * 如果 base 不存在，则 projectId 为 undefined。
     */
    const { base } = useStore();
    const { projectId } = base || {};

    /**
     * 存储当前选中的对象 ID 列表。
     */
    const objectIds = ref([]);

    /**
     * 控制播放器打开行为的引用对象，默认提供一个空的 open 方法。
     */
    const openPlayerFn = ref({ open: () => {} });

    /**
     * 数据对接处理相关函数和响应式数据。
     * 包括：
     * - loadDynaDataWithIotHandling: 加载动态数据并进行 IoT 处理
     * - idDynaData: 动态数据映射
     * - loadDangerEventsListWithHandling: 加载风险事件列表并处理
     */
    const { loadDynaDataWithIotHandling, idDynaData, loadDangerEventsListWithHandling, initDangerEventIds } = dataDockHandling();
    const riskEventIdleLoading = ref(false);

    /**
     * 使用 loading 管理工具初始化加载状态控制器。
     * 参数说明：
     * - containerId: 容器 ID
     * - backgroundColor: 背景颜色
     * - type: 加载动画类型
     * - style: 样式配置对象
     * - delay: 延迟显示时间（毫秒）
     *
     * 返回值：
     * - openLoading: 开启加载状态的方法
     * - closeLoading: 关闭加载状态的方法
     * - loading: 当前加载状态的响应式变量
     */
    const { openLoading, closeLoading, loading } = useLoading(
        'loading-main-machine-room-container',
        '#ffffff00',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );

    /**
     * 初始化 SSE 相关钩子，用于实时数据订阅。
     * 返回值：
     * - claasCode2objectIds: 类别编码到对象 ID 的映射
     * - sseClient: SSE 客户端实例
     */
    const { claasCode2objectIds, sseClient } = SSEHook(initDangerEventIds);

    /**
     * 表示是否正在加载风险事件数据。
     */
    const loadingDangerEvents = ref(false);

    /**
     * 当前空间 ID。
     */
    const currentSpaceId = ref('');

    /**
     * 当前楼层信息。
     */
    const currentFloorInfo = ref(null);

    /**
     * 楼层 ID 到空间对象的映射。
     */
    const floorIdMapSpacesObj = ref({});

    /**
     * 楼层 ID 到设备对象的映射
     */
    const floorIdToEquipsMap = ref(new Map());

    /**
     * 当前楼层下的所有对象 ID。
     */
    const floorAllObjectIds = ref([]);

    /**
     * 所有对象 ID 的计算属性，合并 objectIds 和 floorAllObjectIds 并去重。
     */
    const allObjectIds = computed(() => {
        const ids = [...objectIds.value, ...floorAllObjectIds.value];
        return uniq(ids);
    });

    const activeOnlyMagRiskModel = ref('checked');
    const isActiveOnlyMagRisk = computed(() => {
        return activeOnlyMagRiskModel.value === 'checked';
    });

    // 重新池子异常，风险相关API
    useRewriteSingletonDanegerEventFn(isActiveOnlyMagRisk);
    useRewriteSingletonAbnormalEventFn(isActiveOnlyMagRisk);

    /**
     * 从单例中获取与对象关联、危险状态查询、异常事件处理等相关方法。
     * 包括：
     * - setObject2RelatedObject: 设置对象之间的关联关系
     * - getObjectDanegerStatus: 获取对象的危险状态
     * - getObjectDanegerEventsList: 获取对象的风险事件列表
     * - AbnormalEventStrategy: 异常事件策略管理器
     * - setAbnormalEventStrategy: 设置异常事件策略
     */
    const {
        setObject2RelatedObject,
        getRelatedObjects,
        getObjectDanegerStatus,
        getObjectDanegerEventsList,
        getObjectAndRelatedDanegerList,
        AbnormalEventStrategy,
        setAbnormalEventStrategy
    } = DockSingleton.getInstance();

    /**
     * 使用 SSE 实时获取异常事件列表及相关状态。
     * 参数：
     * - sseClient: SSE 客户端实例
     * - objectIds: 对象 ID 列表
     *
     * 返回值包括：
     * - onQueryAbnormalEventList: 查询异常事件列表的方法
     * - abnormalEventListLoading: 异常事件列表加载状态
     * - abnormalEventListUpdateTime: 最后更新时间戳
     * - abnormalEventListLoadedTime: 数据加载完成时间戳
     * - abnormalEventList: 异常事件列表数据
     */
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        customRequest: getAbnormalListByObjIdsV2,
        sseClient: sseClient,
        objectIds: allObjectIds
    });
    const abnormalIdleLoading = ref(false);
    const curDashboardFilterId = ref([]);
    const roomTypes = ref([]);

    /**
     * 空间状态筛选条件，默认包含正常、未知、潜在风险、异常四种状态。
     */
    const spaceStatus = ref([SPACE_STATUS.NORMAL, SPACE_STATUS.UNKNOWN, SPACE_STATUS.POTENTIAL, SPACE_STATUS.EXCEPTION]);

    /**
     * 视图视角选项，包括建筑楼层和空间类型两种模式。
     */
    const viewPerspective = ref([
        { id: 'build', name: i18n.global.t('meos_control_web.building_floors') },
        { id: 'space', name: i18n.global.t('meos_control_web.space_type') }
    ]);

    /**
     * 当前选中的房间类型模型。
     */
    const roomTypeModel = ref([]);

    /**
     * 当前选中的空间状态模型。
     */
    const spaceStatusModel = ref([]);

    /** 仅看机房 */
    const onlyMachineRoom = ref('checked');
    /** 选择的机房类型 */
    const curSelectedRoomTypes = ref([]);

    /**
     * 当前视图视角模型，默认为建筑楼层视图。
     */
    const viewPerspectiveModel = ref('build');
    // 基础所有的空间（接口查回来的所有）
    const baseAllSpaces = ref([]);
    /**
     * 是否所有空间数据已加载完成。
     */
    const isAllSpacesLoaded = ref(false);

    /**
     * dashboard中空间内的设备列表。
     */
    const dashboardEquipmentsInSpace = ref([]);

    /**
     * dashboard楼层 ID 到空间对象的映射。
     */
    const dashboardFloorIdMapSpaces = ref({});

    /**
     * 所有建筑数据。
     */
    const allBuildingsData = ref([]);

    /**
     * 构建楼层映射表。
     */
    let buildFloorMap = new Map();
    const spaces = computed(() => {
        return baseAllSpaces.value.filter(spaceItem => {
            let isOk = true;
            if (roomTypeModel.value.length > 0) {
                isOk = roomTypeModel.value.includes(spaceItem.roomFuncType);
            }
            if (isOk && isActiveOnlyMagRisk.value) {
                isOk = getObjectAndRelatedDanegerList([spaceItem.id])?.length > 0;
            }
            return isOk;
        });
    });

    /**
     * 构建楼层空间树结构的计算属性。如果空间数据为空则返回空数组。
     */
    const buildFloorSapceTree = computed(() => {
        if (spaces.value.length === 0) {
            return [];
        }
        return convertToTree(spaces.value);
    });

    /**
     * dashboard空间映射。
     */
    const dashboardSpaceMap = ref({});

    /**
     * dashboard中的楼层 ID 列表。
     */
    const dashboardFloorIds = ref([]);

    /**
     * 是否等待建筑数据加载完成。
     */
    const isWaitBuildingLoading = ref(false);

    /**
     * dashboard中类别编码到对象 ID 的映射。
     */
    const dashboardClassCode2objectIds = ref({});

    /**
     * 计算当前楼层的空间列表
     *
     * @returns {Array} 返回当前楼层对应的空间数组，如果未找到则返回空数组
     */
    const currentFloorSpaces = computed(() => {
        // 获取当前楼层的ID，优先使用id字段，其次使用floorId字段
        const curFloorId = currentFloorInfo.value?.id || currentFloorInfo.value?.floorId || '';

        // 如果存在楼层ID，则从映射对象中获取对应的空间列表,设备列表
        if (curFloorId) {
            console.log('floorIdMapSpacesObj.value: ', floorIdMapSpacesObj.value);
            return floorIdMapSpacesObj.value[curFloorId] || { spaces: [], equipments: [] };
        }

        // 默认返回空数组
        return { spaces: [], equipments: [] };
    });

    const currentFloorEquips = computed(() => {
        // 获取当前楼层的ID，优先使用id字段，其次使用floorId字段
        const curFloorId = currentFloorInfo.value?.id || currentFloorInfo.value?.floorId || '';

        // 如果存在楼层ID，则从映射对象中获取对应的设备列表
        if (curFloorId) {
            const res = floorIdToEquipsMap.value.get(curFloorId)?.values() || [];
            return res;
        }

        // 默认返回空数组
        return [];
    });

    /**
     * 所有空间内设备的计算属性，合并dashboard和楼层设备并根据 ID 去重。
     */
    const allEquipmentsInSapce = computed(() => {
        const noRepeatArr = uniqBy([...dashboardEquipmentsInSpace.value, ...currentFloorEquips.value], 'id');
        return noRepeatArr.toSorted(sortEquipByLevelAndName);
    });

    const targetSpaceEquipIds = computed(() => {
        const idSet = new Set();
        spaces.value.forEach(item => {
            idSet.add(item.id);
            item.equipmentsInSpace?.forEach(obj => {
                idSet.add(obj.id);
            });
        });

        return [...idSet];
    });

    /**
     * 计算当前楼层的机房空间列表
     * @returns {Object} 返回当前楼层中标识为机房空间数组，如果无匹配数据则返回空数组
     */
    const currentFloorMachineRoomSpaces = computed(() => {
        // 获取当前楼层ID，优先使用id字段，其次使用floorId字段
        const curFloorId = currentFloorInfo.value?.id || currentFloorInfo.value?.floorId || '';

        // 如果当前楼层ID存在，则筛选出该楼层下所有机房空间
        if (curFloorId) {
            const res = dashboardFloorIdMapSpaces.value[curFloorId] || [];
            return res;
        }

        // 默认返回空数组
        return [];
    });
    const currentFloorSpacesWithEquipIds = computed(() => {
        const idSet = new Set();
        currentFloorSpaces.value.spaces.forEach(obj => {
            idSet.add(obj.id);
            obj.equipmentsInSpace?.forEach(eq => {
                idSet.add(eq.id);
            });
        });

        return [...idSet];
    });
    const convertToTree = data => {
        const buildingMap = new Map();

        data.forEach(item => {
            item.spaceStatus = getObjectDanegerStatus(item.id).code;
            // 处理建筑层级
            if (!buildingMap.has(item.buildingId)) {
                buildingMap.set(item.buildingId, {
                    id: item.buildingId,
                    name: item.buildingName,
                    children: new Map()
                });
            }

            const building = buildingMap.get(item.buildingId);
            if (viewPerspectiveModel.value === 'build') {
                // 处理楼层层级
                if (!building.children.has(item.floorId)) {
                    building.children.set(item.floorId, {
                        id: item.floorId,
                        name: item.floorName,
                        order: item.floorOrder,
                        children: []
                    });
                }
            } else {
                // 处理楼层层级
                if (!building.children.has(item.roomFuncType)) {
                    building.children.set(item.roomFuncType, {
                        id: item.roomFuncType,
                        name: item.roomFuncTypeName,
                        children: []
                    });
                }
            }
            const id = viewPerspectiveModel.value === 'build' ? item.floorId : item.roomFuncType;
            const spaceItem = {
                ...item,
                id: item.id,
                name: item.localName ?? '--',
                classCode: item.classCode,
                localName: item.localName ?? '--',
                spaceStatus: getObjectDanegerStatus(item.id).code
            };
            // 缓存子节点
            const children = building.children.get(id)?.children;

            // 确保 children 存在且为数组
            if (!Array.isArray(children)) {
                console.error('Invalid children array for id:', id);
                return;
            }

            // 定义是否满足条件的布尔表达式
            // const shouldPush =
            //     (!roomTypeModel.value.length && !spaceStatusModel.value.length) ||
            //     (spaceStatusModel.value.includes(spaceItem.spaceStatus) && roomTypeModel.value.includes(spaceItem.roomFuncType)) ||
            //     (!spaceStatusModel.value.length && roomTypeModel.value.length && roomTypeModel.value.includes(spaceItem.roomFuncType)) ||
            //     (!roomTypeModel.value.length && spaceStatusModel.value.length && spaceStatusModel.value.includes(spaceItem.spaceStatus));
            const spaceStatusFilter = !spaceStatusModel.value.length || (spaceStatusModel.value.length && spaceStatusModel.value.includes(spaceItem.spaceStatus));
            const buildingFloorFilter =
                curDashboardFilterId.value.length === 0 || curDashboardFilterId.value.includes(spaceItem.floorId) || curDashboardFilterId.value.includes(spaceItem.buildingId);
            const shouldPush = viewPerspectiveModel.value === 'space' ? spaceStatusFilter : spaceStatusFilter && buildingFloorFilter;

            // 如果满足条件，则推送 spaceItem
            if (shouldPush) {
                children.push(spaceItem);
            }
            // 添加设备间
        });
        const treeData = Array.from(buildingMap.values()).map(building => {
            let floors = Array.from(building.children.values());
            floors = floors.filter(item => item.children.length);
            floors = floors.sort((a, b) => a.order - b.order);
            return {
                ...building,
                children: floors
            };
        });

        // 转换为树形结构
        return treeData;
    };

    const curFloorSpaces = computed(() => {
        const res = currentFloorSpaces.value?.spaces || [];
        return res;
    });

    const drawerSpaces = computed(() => {
        if (!currentFloorInfo.value?.id) {
            return spaces.value;
        } else {
            return curFloorSpaces.value;
        }
    });

    const rightBaseSpaces = computed(() => {
        if (!currentFloorInfo.value?.id) {
            return baseAllSpaces.value;
        } else {
            return curFloorSpaces.value;
            // return curFloorSpaces.value.filter(spaceItem => {
            //     let isOk = true;
            //     if (roomTypeModel.value.length > 0) {
            //         isOk = roomTypeModel.value.includes(spaceItem.roomFuncType);
            //     }
            //     if (isOk && isActiveOnlyMagRisk.value) {
            //         isOk = getObjectAndRelatedDanegerList([spaceItem.id])?.length > 0;
            //     }
            //     if (isOk && onlyMachineRoom.value === 'checked') {
            //         isOk = spaceItem.isDashboardSpace;

            //         if (isOk && curSelectedRoomTypes.value?.length) {
            //             isOk = curSelectedRoomTypes.value.includes(spaceItem.roomFuncType);
            //         }
            //     }

            //     return isOk;
            // });
        }
    });

    const getRiskListNameViewByInstance = ({ spaceId }) => {
        const allDangerListMap = new Map();
        if (spaceId) {
            drawerSpaces.value.forEach(item => {
                if (item?.id === spaceId) {
                    const dangerEventList = getObjectDanegerEventsList(spaceId) || [];
                    if (Array.isArray(dangerEventList) && dangerEventList.length) {
                        dangerEventList.forEach(dangerItem => {
                            const cloneItem = structuredClone(dangerItem);
                            const instanceItem = {
                                id: item.id,
                                key: `${item.id}-${dangerItem.dangerEventId}`,
                                localName: item?.localName,
                                isSpace: true,
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark
                            };
                            allDangerListMap.set(dangerItem.dangerEventId, {
                                dangerEventId: dangerItem.dangerEventId,
                                dangerEventName: dangerItem?.name ?? '--',
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark,
                                instances: [instanceItem]
                            });
                        });
                    }
                }
            });
        }
        allEquipmentsInSapce.value.forEach(item => {
            const filterCondition = spaceId ? getRelatedObjects(spaceId)?.includes(item.id) : true;
            if (filterCondition) {
                // const dangerEventList = mockRiskEvent.data.slice(0, 20);
                const dangerEventList = getObjectDanegerEventsList(item.id) || [];
                if (Array.isArray(dangerEventList) && dangerEventList.length) {
                    dangerEventList.forEach(dangerItem => {
                        const cloneItem = structuredClone(dangerItem);
                        cloneItem.equipCriticalLevel = item.equipCriticalLevel;
                        cloneItem.equipLocalName = item.localName;
                        if (allDangerListMap.get(dangerItem.dangerEventId)) {
                            const obj = allDangerListMap.get(dangerItem.dangerEventId);
                            const instanceItem = {
                                id: item.id,
                                key: `${item.id}-${dangerItem.dangerEventId}`,
                                localName: item?.localName,
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark
                            };
                            obj.instances.push(instanceItem);
                        } else {
                            const instanceItem = {
                                id: item.id,
                                key: `${item.id}-${dangerItem.dangerEventId}`,
                                localName: item?.localName,
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark
                            };
                            allDangerListMap.set(dangerItem.dangerEventId, {
                                dangerEventId: dangerItem.dangerEventId,
                                dangerEventName: dangerItem?.name ?? '--',
                                dangerItem: cloneItem,
                                followMark: cloneItem?.followMark,
                                instances: [instanceItem]
                            });
                        }
                    });
                }
            }
        });
        const arr = Array.from(allDangerListMap.values());
        const tempArr = arr.toSorted((a, b) => {
            return sortDangerEventByStatus(a.dangerItem, b.dangerItem);
        });
        const groupArr = [...new Set(tempArr.map(v => v?.dangerEventId))];
        const final = groupArr.map(key => {
            return allDangerListMap.get(key);
        });
        return final;
    };

    const getRiskListByInstance = ({ spaceId, equipId, filterStatusId }) => {
        const riskListMap = new Map();
        const spaceDangerEventList = [];
        const spaceArr = [];
        if (spaceId) {
            drawerSpaces.value.forEach(item => {
                if (item?.id === spaceId) {
                    const cloneItem = structuredClone({ ...item });
                    cloneItem.danegerEventList = (getObjectDanegerEventsList(item.id) || []).toSorted(sortDangerEventByTagAndName);
                    const list = filterStatusId ? cloneItem.danegerEventList.filter(v => v.status === filterStatusId) : cloneItem.danegerEventList;
                    cloneItem.danegerEventList = list;

                    if (list.length) {
                        spaceDangerEventList.push(...list);
                        spaceArr.push(cloneItem);
                    }
                }
            });
        }

        spaceDangerEventList.length &&
            riskListMap.set(GeneralZone, {
                classCode: GeneralZone,
                classCodeName: i18n.global.t('common.space'),
                isSpace: true,
                followMark: spaceDangerEventList.find(val => val.followMark) ? true : false,
                danegerEventListLength: spaceDangerEventList.length,
                equipments: spaceArr
            });

        allEquipmentsInSapce.value.forEach(item => {
            const filterCondition = spaceId ? getRelatedObjects(spaceId)?.includes(item.id) : equipId ? item.id === equipId : true;
            if (filterCondition) {
                const cloneItem = structuredClone({ ...item });
                cloneItem.danegerEventList = (getObjectDanegerEventsList(item.id) || []).toSorted(sortDangerEventByTagAndName);
                cloneItem.danegerEventList = filterStatusId ? cloneItem.danegerEventList.filter(v => v.status === filterStatusId) : cloneItem.danegerEventList;
                if (cloneItem.danegerEventList.length) {
                    if (cloneItem.danegerEventList.find(val => val.followMark)) {
                        cloneItem.followMark = true;
                    }
                    if (riskListMap.get(item.classCode)) {
                        const obj = riskListMap.get(item.classCode);
                        if (cloneItem.followMark) {
                            obj.followMark = true;
                        }
                        obj.danegerEventListLength += cloneItem.danegerEventList.length;
                        obj.equipments.push(cloneItem);
                    } else {
                        // TODO 排序
                        riskListMap.set(item.classCode, {
                            classCode: item.classCode,
                            classCodeName: item.classCodeName ?? '--',
                            followMark: cloneItem.followMark || false,
                            danegerEventListLength: cloneItem.danegerEventList.length,
                            equipments: [cloneItem]
                        });
                    }
                }
            }
        });
        const arr = Array.from(riskListMap.values());
        return arr;
    };

    const equipmentsWithStatus = computed(() => {
        const equipmentsInClassCode = new Map();
        const spaceDanegerEventList = [];
        const spaceArr = [];
        spaces.value.forEach(item => {
            if (!currentFloorInfo.value?.id || item.floorId === currentFloorInfo.value?.id) {
                item.danegerEventList = (getObjectDanegerEventsList(item.id) || []).toSorted(sortDangerEventByTagAndName);
                const list = item.danegerEventList.filter(v => v.status === SPACE_STATUS.UNKNOWN.id);
                item.danegerEventList = list;
                if (list.length) {
                    spaceDanegerEventList.push(...list);
                    spaceArr.push(item);
                }
            }
        });

        spaceDanegerEventList.length &&
            equipmentsInClassCode.set(GeneralZone, {
                classCode: GeneralZone,
                classCodeName: i18n.global.t('common.space'),
                isSapce: true,
                followMark: spaceDanegerEventList.find(val => val.followMark) ? true : false,
                danegerEventListLength: spaceDanegerEventList.length,
                equipments: spaceArr
            });
        dashboardEquipmentsInSpace.value.forEach(item => {
            if (!currentFloorInfo.value?.id || item.floorId === currentFloorInfo.value?.id) {
                item.danegerEventList = getObjectDanegerEventsList(item.id) || [];
                // item.danegerEventList = mockRiskEvent.data.slice(0, 20);
                item.danegerEventList = item.danegerEventList.filter(v => v.status === SPACE_STATUS.UNKNOWN.id).toSorted(sortDangerEventByTagAndName);
                if (item.danegerEventList.length) {
                    if (item.danegerEventList.find(val => val.followMark)) {
                        item.followMark = true;
                    }
                    if (equipmentsInClassCode.get(item.classCode)) {
                        const obj = equipmentsInClassCode.get(item.classCode);
                        if (item.followMark) {
                            obj.followMark = true;
                        }
                        obj.danegerEventListLength += item.danegerEventList.length;
                        obj.equipments.push(item);
                    } else {
                        equipmentsInClassCode.set(item.classCode, {
                            classCode: item.classCode,
                            classCodeName: item.classCodeName,
                            followMark: item.followMark || false,
                            danegerEventListLength: item.danegerEventList.length,
                            equipments: [item]
                        });
                    }
                }
            }
        });
        const arr = Array.from(equipmentsInClassCode.values());
        return arr;
    });

    const rightUnknownRiskEventList = computed(() => {
        const equipmentsInClassCode = new Map();
        const spaceDanegerEventList = [];
        const spaceArr = [];
        rightBaseSpaces.value.forEach(item => {
            if (!currentFloorInfo.value?.id || item.floorId === currentFloorInfo.value?.id) {
                item.danegerEventList = (getObjectDanegerEventsList(item.id) || []).toSorted(sortDangerEventByTagAndName);
                const list = item.danegerEventList.filter(v => v.status === SPACE_STATUS.UNKNOWN.id);
                item.danegerEventList = list;
                if (list.length) {
                    spaceDanegerEventList.push(...list);
                    spaceArr.push(item);
                }
            }
        });

        spaceDanegerEventList.length &&
            equipmentsInClassCode.set(GeneralZone, {
                classCode: GeneralZone,
                classCodeName: i18n.global.t('common.space'),
                isSapce: true,
                followMark: spaceDanegerEventList.find(val => val.followMark) ? true : false,
                danegerEventListLength: spaceDanegerEventList.length,
                equipments: spaceArr
            });
        allEquipmentsInSapce.value.forEach(item => {
            if (!currentFloorInfo.value?.id || item.floorId === currentFloorInfo.value?.id) {
                item.danegerEventList = getObjectDanegerEventsList(item.id) || [];
                // item.danegerEventList = mockRiskEvent.data.slice(0, 20);
                item.danegerEventList = item.danegerEventList.filter(v => v.status === SPACE_STATUS.UNKNOWN.id).toSorted(sortDangerEventByTagAndName);
                if (item.danegerEventList.length) {
                    if (item.danegerEventList.find(val => val.followMark)) {
                        item.followMark = true;
                    }
                    if (equipmentsInClassCode.get(item.classCode)) {
                        const obj = equipmentsInClassCode.get(item.classCode);
                        if (item.followMark) {
                            obj.followMark = true;
                        }
                        obj.danegerEventListLength += item.danegerEventList.length;
                        obj.equipments.push(item);
                    } else {
                        equipmentsInClassCode.set(item.classCode, {
                            classCode: item.classCode,
                            classCodeName: item.classCodeName,
                            followMark: item.followMark || false,
                            danegerEventListLength: item.danegerEventList.length,
                            equipments: [item]
                        });
                    }
                }
            }
        });
        const arr = Array.from(equipmentsInClassCode.values());
        return arr;
    });
    const isDataEmpty = computed(() => {
        let flag = true;
        for (let i = 0; i < buildFloorSapceTree.value.length; i++) {
            if (buildFloorSapceTree.value[i].children.length) {
                flag = false;
                break;
            }
        }
        return flag;
    });
    const handleTreeBuildingFloorData = async () => {
        buildFloorMap = new Map();
        const parasm = {
            projectId: base.projectId,
            isQuerySpace: false
        };
        const { data, code } = await getListTreeBuildingFloorSpace(parasm);

        if (code === SUCCESSCODE) {
            data.forEach(element => {
                buildFloorMap.set(element.id, element);
                element.floors.forEach((floor, i) => {
                    floor.order = i;
                    floor.buildingName = element.localName ?? '--';
                    buildFloorMap.set(floor.id, floor);
                });
            });
            xplantindoorenvStore().setBuildingData(data);
            xplantindoorenvStore().setBuildingFloorData(data);
            allBuildingsData.value = data;
        }
    };
    const getBuildFloorSapceTree = async () => {
        openLoading();
        isWaitBuildingLoading.value = true;
        try {
            loadingDangerEvents.value = true;
            isAllSpacesLoaded.value = false;
            const [, spaceRes] = await Promise.all([
                handleTreeBuildingFloorData(),
                querySpaceV2()
                // querySpace({
                //     runningMonitorType: RUNNING_MONITOR_TYPE,
                //     runningMonitorSecondType: RUNNING_MONITOR_TYPE,
                //     instance: { instanceType: 'PROJECT', instanceId: projectId },
                //     withColumns: ['floorId', 'localName', 'roomFuncType', 'roomFuncTypeName', 'classCode', 'buildingId', 'objType']
                // })
            ]);
            const { data } = spaceRes || {};
            handleSpaceData(data);
            isWaitBuildingLoading.value = false;
        } catch (error) {
            console.log(error);
            closeLoading();
            isWaitBuildingLoading.value = false;
        }
    };
    const handleSpaceData = async data => {
        const spaceIds = [];
        const roomFuncTypes = [];
        const allFloorIds = new Set();
        data.forEach(item => {
            if (item.floorId) {
                allFloorIds.add(item.floorId);
            }
            if (dashboardFloorIdMapSpaces.value[item.floorId]) {
                dashboardFloorIdMapSpaces.value[item.floorId].push(item);
            } else {
                dashboardFloorIdMapSpaces.value[item.floorId] = [item];
            }
            const floor = buildFloorMap.get(item.floorId);
            item.floorName = floor.localName ?? '--';
            item.floorOrder = floor.order;
            item.buildingId = floor.buildingId;
            item.buildingName = floor.buildingName;
            if (item.roomFuncType && item.roomFuncTypeName) {
                roomFuncTypes.push({ id: item.roomFuncType, name: item.roomFuncTypeName });
            }
            spaceIds.push(item.id);
            item.equipmentsInSpace?.forEach(eq => {
                eq.floorId = item.floorId;
                dashboardEquipmentsInSpace.value.push(eq);
                setObject2RelatedObject(item.id, eq.id);
            });
            dashboardSpaceMap.value[item.id] = item;
        });
        baseAllSpaces.value = structuredClone(data);
        // spaces.value = structuredClone(data);
        isAllSpacesLoaded.value = true;
        roomTypes.value = uniqBy(roomFuncTypes, 'id');
        dashboardFloorIds.value = [...allFloorIds];
        dashboardEquipmentsInSpace.value = uniqBy(dashboardEquipmentsInSpace.value, 'id');
        dashboardEquipmentsInSpace.value = dashboardEquipmentsInSpace.value.toSorted(sortEquipByLevelAndName);
        const { classCodeIds, instanceIds } = iterateObjct4InstanceInfo(data);
        dashboardClassCode2objectIds.value = classCodeIds;
        claasCode2objectIds.value = structuredClone(dashboardClassCode2objectIds.value);
        objectIds.value = structuredClone(instanceIds);
        // 建立关系
        loadDynaDataWithIotHandling(
            {
                templateCode: GRID,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds: spaceIds
            },
            listInfoCodeConfigsByObjectIdCommon
        );
        try {
            await loadDangerEventsListWithHandling({
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds: objectIds.value
            });
        } finally {
            closeLoading();
        }

        loadingDangerEvents.value = false;
        if (objectIds?.value?.length) {
            await onQueryAbnormalEventList(
                {
                    projectId: projectId,
                    instanceIds: uniq(objectIds.value),
                    runningMonitorType: RUNNING_MONITOR_TYPE
                },
                true
            );
        }

        handleCallToggleWidth();
    };
    const handleCallToggleWidth = () => {
        let _t = null;
        clearTimeout(_t);
        _t = setTimeout(() => {
            callToggleWidth(abnormalEventList.value?.length > 0 || equipmentsWithStatus.value?.length > 0);
            clearTimeout(_t);
        }, 1000);
    };
    const init = () => {
        roomTypes.value = [];
        baseAllSpaces.value = [];
        // spaces.value = [];
        buildFloorSapceTree.value = [];
        dashboardEquipmentsInSpace.value = [];
        objectIds.value = [];
        roomTypes.value = [];
        getBuildFloorSapceTree();
    };
    const loadingFloorData = ref(false);
    const floorRequestController = ref(null);
    /**
     * 根据楼层ID设置空间数据
     * @param {string|number} floorId - 楼层ID
     * @returns {Promise<void>} 无返回值的异步函数
     */
    const setSpacesByFloorId = async floorId => {
        if (!floorId) {
            floorAllObjectIds.value = [];
            claasCode2objectIds.value = structuredClone(dashboardClassCode2objectIds.value);
            // 查询异常事件列表
            onQueryAbnormalEventList(
                {
                    projectId: projectId,
                    instanceIds: objectIds.value,
                    runningMonitorType: RUNNING_MONITOR_TYPE
                },
                true
            );
            return;
        }
        riskEventIdleLoading.value = true;
        abnormalIdleLoading.value = true;

        // 取消上次楼层请求（切换楼层场景）
        floorRequestController.value?.abort();
        floorRequestController.value = new AbortController();
        const { signal } = floorRequestController.value;

        // 如果当前楼层尚未加载空间数据，则发起HTTP请求获取数据
        if (!floorIdMapSpacesObj.value[floorId]) {
            loadingFloorData.value = true;
            try {
                const spacesObj = {};
                const equipmentsObj = {};
                const floorEquipsMap = new Map();

                // 在楼层图要展示的设备的classCode
                const equipClassCodeMapInFloorMap = FLOOR_MAP_CLASSCODES?.reduce((pre, cur) => {
                    pre[cur] = true;
                    return pre;
                }, {});

                const res = await getObjectsInFloor({ floorId }, signal);
                const equips = res.data?.filter(item => {
                    if (item.objType === OBJ_TYPE.SPACE) {
                        item.equipmentsInSpace = [];
                        if (dashboardSpaceMap.value[item.id]) {
                            item.isDashboardSpace = true;
                            item.roomFuncTypeName = dashboardSpaceMap.value[item.id].roomFuncTypeName;
                        }
                        spacesObj[item.id] = item;
                        return false;
                    } else {
                        // 为门时需要过滤可监可控状态为2或3
                        if (['CFCSDR', 'CFCSFR', 'SPEGFG'].includes(item.classCode)) {
                            return item.monitoringSurveillanceStatus === '2' || item.monitoringSurveillanceStatus === '3';
                        } else {
                            return true;
                        }
                    }
                });
                equips?.forEach(item => {
                    if (item.objType === 'equipment') {
                        const spaceId = item.relObjIds?.find(() => true);
                        if (spaceId && spacesObj[spaceId]) {
                            spacesObj[spaceId].equipmentsInSpace.push(item);
                            setObject2RelatedObject(spaceId, item.id);
                        }
                        floorEquipsMap.set(item.id, item);
                        if (equipClassCodeMapInFloorMap[item.classCode]) {
                            equipmentsObj[item.id] = item;
                        }
                    }
                });

                floorIdToEquipsMap.value.set(floorId, floorEquipsMap);
                floorIdMapSpacesObj.value[floorId] = {
                    spaces: Object.values(spacesObj),
                    equipments: Object.values(equipmentsObj)
                };
            } catch (error) {
                // 切换楼层导致请求取消，不视为错误
                if (error?.name === 'AbortError' || error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
                console.log(error);
                riskEventIdleLoading.value = false;
                abnormalIdleLoading.value = false;
            } finally {
                loadingFloorData.value = false;
            }
        }
        const arr = [...floorIdMapSpacesObj.value[floorId].spaces, ...floorIdMapSpacesObj.value[floorId].equipments];
        const { classCodeIds, instanceIds } = iterateObjct4InstanceInfo(arr);
        claasCode2objectIds.value = classCodeIds;
        floorAllObjectIds.value = instanceIds;
        riskEventIdleLoading.value = false;
        abnormalIdleLoading.value = false;
        // 切换楼层导致请求取消，跳过风险/异常事件加载
        if (signal.aborted) return;
        //  加载风险事件、异常事件列表并处理（传入 signal 以支持切换楼层时终止）
        Promise.all([
            loadDangerEventsListWithHandling({ runningMonitorType: RUNNING_MONITOR_TYPE, objectIds: instanceIds }, undefined, signal),
            onQueryAbnormalEventList(
                {
                    projectId: projectId,
                    instanceIds: instanceIds,
                    runningMonitorType: RUNNING_MONITOR_TYPE
                },
                true,
                true,
                signal
            )
        ]);
    };
    onMounted(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Related);
        init();
    });
    onBeforeUnmount(() => {
        setAbnormalEventStrategy(AbnormalEventStrategy.Single);
    });
    onUnmounted(() => {});
    watch(
        () => [roomTypeModel.value, spaceStatusModel.value, viewPerspectiveModel.value],
        () => {
            currentSpaceId.value = '';
            closeDetailDrawer();
        }
    );
    watch(
        () => currentFloorInfo.value?.id,
        () => {
            setSpacesByFloorId(currentFloorInfo.value?.id);
        }
    );

    provide(openPlayerFnKey, openPlayerFn);
    const mapBgColorRef = ref('#e8edf3');

    provide(curDashboardFilterIdKey, curDashboardFilterId);
    provide(mapBgColorKey, mapBgColorRef);
    provide(roomTypesKey, roomTypes);
    provide(spaceStatusKey, spaceStatus);
    provide(viewPerspectiveKey, viewPerspective);
    provide(roomTypeModelKey, roomTypeModel);
    provide(spaceStatusModelKey, spaceStatusModel);
    provide(viewPerspectiveModelKey, viewPerspectiveModel);
    provide(idDynaDataKey, idDynaData);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    provide(abnormalEventListKey, abnormalEventList);
    provide(currentFloorInfoKey, currentFloorInfo);
    provide(currentSpaceIdKey, currentSpaceId);
    provide(equipmentsWithStatusKey, equipmentsWithStatus);
    provide(dashboardFloorIdsKey, dashboardFloorIds);
    provide(currentFloorSpacesKey, currentFloorSpaces);
    provide(currentFloorSpacesWithEquipIdsKey, currentFloorSpacesWithEquipIds);
    provide(isWaitBuildingLoadingKey, isWaitBuildingLoading);
    provide(loadingDangerEventsKey, loadingDangerEvents);
    provide(allBuildingDataKey, allBuildingsData);
    provide(isAllSpacesLoadedKey, isAllSpacesLoaded);
    provide(activeOnlyMagRiskModelKey, activeOnlyMagRiskModel);
    provide(isActiveOnlyMagRiskKey, isActiveOnlyMagRisk);
    provide(targetSpaceEquipIdsKey, targetSpaceEquipIds);
    provide(currentFloorMachineRoomSpacesKey, currentFloorMachineRoomSpaces);
    provide(loadingFloorDataKey, loadingFloorData);
    provide(onlyMachineRoomInjectKey, onlyMachineRoom);
    provide(curSelectedRoomTypesInjectKey, curSelectedRoomTypes);
    provide(rightUnknownRiskEventListKey, rightUnknownRiskEventList);
    provide(riskEventIdleLoadingKey, riskEventIdleLoading);
    provide(abnormalIdleLoadingKey, abnormalIdleLoading);
    return {
        spaces,
        buildFloorSapceTree,
        roomTypes,
        spaceStatus,
        viewPerspective,
        roomTypeModel,
        spaceStatusModel,
        viewPerspectiveModel,
        equipmentsWithStatus,
        isDataEmpty,
        loading,
        loadingDangerEvents,
        idDynaData,
        currentFloorInfo,
        mapBgColorRef,
        currentSpaceId,
        openPlayerFn,
        getRiskListByInstance,
        getRiskListNameViewByInstance
    };
};
