// @ts-ignore
import i18n from '@/localization';
import { useRoute } from 'vue-router';

import { GeneralZone, getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { getIllumInfo, getInfoCode, getLightingEquipmentList, sunRiseAndSet } from '@/apis/IndoorLighting';
import { useAbnormalSSE } from './useAbnormalSSE';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import DockSingleton from '@/hooks/responsiveDock';
import { FIXED_INFOCODE, INFOCODE, LOOP, MODULE, PARKING, PUBLIC, RUNNING_MONITOR_TYPE, SPACE_STATUS_TEMPLATES } from '../variables';
import treeBuildFloor from '@/store/treeBuildFloor';
import { listObjectsByTackValueLogic } from '@/apis/public';
import { orderBy, uniq, uniqBy } from 'lodash';
import useLoading from '@/hooks/useLoading';
import dataDockHandling from '@/hooks/dataDockHandling';
import { useDashboardSSE } from './useDashboardSSE';
import UseNotify from '@/components/commonNotify/hooks/useNotify';
import { additionalFloorInfo } from '@/apm-3d/utils/buildingTools';
import useLoopDyncInfoLoad from './useLoopDyncInfoLoad';
import baseStore from '@/store/baseStore';

export const sceneDataKey = Symbol('sceneDataKey');
export const exceptionScreenKey = Symbol('exceptionScreenKey');
export const exceptionScreenListKey = Symbol('exceptionScreenListKey');
export const currentFloorObjInjectKey = Symbol('currentFloorObjInjectKey');
export const mapBgColorKey = Symbol('mapBgColorKey');
export const dashboardFloorIdsKey = Symbol('dashboardFloorIdsKey');
export const gridDataKey = Symbol('gridDataKey');
export const dashboardDataKey = Symbol('dashboardDataKey'); // dashboard数据
export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey'); // 异常事件列表更新时间
export const buildingFloorPromiseKey = Symbol('buildingFloorPromiseKey'); // 异常事件列表更新时间
export const getLoopListByFloorIdKey = Symbol('getLoopListByFloorIdKey'); // 获取楼层回路列表
export const getModuleListByFloorIdKey = Symbol('getModuleListByFloorIdKey'); // 获取楼层模块和DDC列表
export const getModuleListByLoopIdKey = Symbol('getModuleListByLoopIdKey'); // 获取模块和DDC列表
export const curStaticLoopCountKey = Symbol('curStaticLoopCountKey'); //
export const getLoopListByBuildingIdKey = Symbol('getLoopListByBuildingIdKey'); // 获取建筑回路列表
export const getAbnormalIdsBySpaceIdKey = Symbol('getAbnormalIdsBySpaceIdKey'); // 获取楼层异常事件ID列表
export const getAbnormalIdsByFloorIdKey = Symbol('getAbnormalIdsByFloorIdKey'); // 获取楼层异常事件ID列表
export const getAbnormalIdsByProjectKey = Symbol('getAbnormalIdsByProjectKey'); // 获取项目异常事件ID列表
export const getAbnormalIdsByBuildingIdKey = Symbol('getAbnormalIdsByBuildingIdKey'); // 获取建筑异常事件ID列表
export const getStatusListBySpaceIdKey = Symbol('getStatusListBySpaceIdKey'); // 获取空间状态列表
export const getLoopListBySpaceIdKey = Symbol('getLoopListBySpaceIdKey'); // 获取空间回路列表
export const getModuleListBySpaceIdKey = Symbol('getModuleListBySpaceIdKey'); // 获取空间模块和DDC列表
export const getLoopListByModuleIdKey = Symbol('getLoopListByModuleIdKey'); // 根据模块ID获取回路
export const getSpaceListByFloorIdKey = Symbol('getSpaceListByFloorIdKey'); // 获取楼层空间列表
export const loopListKey = Symbol('loopListKey'); // 回路列表
export const funcTypeInLoopListKey = Symbol('funcTypeInLoopListKey'); // 回路列表中包含的功能类型
export const moduleListKey = Symbol('moduleListKey'); // 模块和DDC列表
export const spaceListKey = Symbol('spaceListKey'); // 空间列表
export const inSpaceListKey = Symbol('inSpaceListKey'); // 所在空间列表
export const serveSpaceListKey = Symbol('serveSpaceListKey'); // 服务空间列表
export const notifyListKey = Symbol('notifyListKey'); // 通知列表
export const roomFuncTypeListSetKey = Symbol('roomFuncTypeListSetKey'); // 房间功能类型集合
export const roomFuncTypeMapKey = Symbol('roomFuncTypeMapKey'); // 房间功能类型Map
export const sceneListKey = Symbol('sceneListKey'); // 场景列表

export const showCircuitsAndControlerKey = Symbol('showCircuitsAndControlerKey');

export const floorLoopListKey = Symbol('floorLoopListKey'); // 楼层回路列表
export const getAbnormalIdsByModuleIdKey = Symbol('getAbnormalIdsByModuleIdKey'); // 根据模块ID获取异常事件ID列表
export const loopIdMapInfoConfigsKey = Symbol('loopIdMapInfoConfigsKey');
export const TemporaryRequirementRefKey = Symbol('TemporaryRequirementRefKey');
export const dashboardBaseFloorIdsKey = Symbol('dashboardBaseFloorIdsKey');

export const useBaseHook = () => {
    const route = useRoute();

    const TemporaryRequirementRef = ref();
    const { loadBatchQueryInfoCodeIotHandling } = dataDockHandling();
    const { clearAllObjectInfo, getIotData, setIotData, getAbnormalEventsList, setAbnormalEventStrategy, AbnormalEventStrategy } = DockSingleton.getInstance();
    // 加载动画相关
    const { loading, openLoading, closeLoading } = useLoading(
        'dashboard-content',
        '#ebf6ff',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );
    // 临时控制tab等待数据
    const isRightPanelTempControlLoading = ref(true);
    // 场景数据
    const sceneData = ref(PUBLIC.id);
    // 场景列表
    const sceneList = ref([]);
    const exceptionScreen = ref('');
    const exceptionScreenList = ref([
        { ...INFOCODE.localRemoteStatus0, list: [], rule: true },
        { ...INFOCODE.controlDeviationStatus1, list: [] },
        { ...INFOCODE.controlDeviationStatus2, list: [] },
        { ...INFOCODE.runStatusNull, list: [] },
        { ...INFOCODE.abnormalEvent, list: [] }
    ]);
    const currentFloorObj = ref();
    const mapBgColor = ref();
    const dashboardFloorIds = ref([]);
    const gridData = ref([]);
    const abnormalList = ref([]); // 用于存储异常事件的对象
    const loopList = ref(new Map()); // 回路列表
    const moduleList = ref(new Map()); // 模块和DDC列表
    const floorLoopList = ref(new Map()); // 楼层列表
    const spaceList = ref(new Map()); // 空间列表
    const inSpaceList = ref(new Map()); // 所在空间列表
    const serveSpaceList = ref(new Map()); // 服务空间列表
    const roomFuncTypeMap = ref(new Map());
    const roomFuncTypeListSet = ref(new Set());
    const showCircuitsAndControler = ref(false);
    const loopIdMapInfoConfigs = ref({});
    const abnormalIds = computed(() => {
        return abnormalList.value.map(item => item.id);
    });
    const curStaticLoopCount = ref(); // 当前统计详情回路数量
    const lightingSidebarSensorInfoVO = ref([]); // 侧边栏传感器信息
    const sunRiseAndSetData = ref({
        // 日出日落时间数据
        today: {
            sunRise: '',
            sunSet: ''
        },
        morrow: {
            sunRise: '',
            sunSet: ''
        }
    });

    const dashboardBaseFloorIds = computed(() => {
        const floorIdMap = {};
        gridData.value.forEach(item => {
            const obj = structuredClone(item);
            obj.floors.forEach(floor => {
                if (floorIdMap[floor.id]) return;
                const loops = getLoopListByFloorId(floor.id);
                if (loops?.length > 0) {
                    floorIdMap[floor.id] = true;
                }
            });
        });
        return Object.keys(floorIdMap);
    });

    const dashboardData = ref([]);

    const calculateDashboardData = () => {
        let arr = gridData.value.map(item => {
            const obj = structuredClone(item);
            obj.floors.forEach(floor => {
                floor.loops = getLoopListByFloorId(floor.id);
            });
            obj.cards = obj.floors.filter(floor => floor.loops.length > 0);
            obj.cards = orderBy(obj.cards, ['floorSequenceId'], ['desc']);
            if (exceptionScreen.value.length) {
                obj.cards = obj.cards.filter(floor => {
                    let showNum = exceptionScreen.value.length;
                    exceptionScreen.value.forEach(v => {
                        if (floorLoopList.value.get(floor.id)[v] === 0) {
                            showNum--;
                        }
                    });
                    return showNum !== 0;
                });
            }
            return obj;
        });
        arr = arr.filter(item => item.cards.length > 0);
        return arr;
    };

    // 手动在依赖变化时才更新
    watch(
        () => [
            gridData.value,
            sceneData.value,
            exceptionScreen.value
            // 仅当真正影响展示时才触发
        ],
        () => {
            dashboardData.value = calculateDashboardData();
        }
    );

    const loopListComputed = computed(() => {
        return [...loopList.value.values()];
    });
    const { getInfoCodeConfigByObjectId } = useLoopDyncInfoLoad(loopIdMapInfoConfigs);

    const { abnormalSSEClient, setAbnormalSSEClientOption } = useAbnormalSSE();
    const { setDashboardSSEClientOption } = useDashboardSSE();

    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        sseClient: abnormalSSEClient,
        objectIds: abnormalIds
    });
    /**
     * 根据楼层ID获取回路列表
     *
     * 此函数旨在从一个楼层回路列表中，根据特定的楼层ID，找到并返回该楼层对应的回路列表
     * 如果指定的楼层ID不存在于列表中，则返回一个空数组
     *
     * @param {string} floorId - 楼层ID，用于标识特定的楼层
     * @param {string} data - 可选参数，用于指定服务区域类型（如公共照明或停车场照明）
     * @returns {Array} 返回该楼层对应的回路列表，如果找不到则返回空数组
     */
    const getLoopListByFloorId = (floorId, data) => {
        let loops = floorLoopList.value.get(floorId).loops || [];
        loops = loops.filter(loop => loop.serviceAreaType === (data || sceneData.value));
        return uniqBy(loops, 'id');
    };
    /**
     * 根据建筑ID获取所有回路
     * @param {string} buildingId - 建筑ID
     * @returns {Array} 所有回路的数组
     */
    const getLoopListByBuildingId = buildingId => {
        // 查找与给定建筑ID匹配的建筑对象
        const build = gridData.value.find(item => item.id === buildingId);
        const list = [];
        // 遍历建筑楼层，收集每个楼层的回路ID
        build?.floors.forEach(card => {
            list.push(...getLoopListByFloorId(card.id));
        });
        // 返回去重后的回路ID数组
        return uniqBy(list, 'id');
    };
    /**
     * 根据模块ID获取回路列表
     *
     * 此函数用于从一个回路列表中过滤出与给定模块ID相关联的回路列表
     * 它通过比较回路中的relModuleId与给定的moduleId来筛选结果
     *
     * @param {string} moduleId - 模块ID，用于筛选回路列表
     * @param {boolean} type - 默认区分公区和停车场
     * @returns {Array} 返回一个数组，包含所有与给定模块ID相关联的回路对象
     */
    const getLoopListByModuleId = (moduleId, type = true) => {
        if (type) {
            return Array.from(loopList.value.values()).filter(loop => loop.relModuleId === moduleId && loop.serviceAreaType === sceneData.value);
        }
        return Array.from(loopList.value.values()).filter(loop => loop.relModuleId === moduleId);
    };

    const spaceLoopMapCurScene = computed(() => {
        const idMap = {};
        Array.from(loopList.value.values()).filter(loop => {
            if (loop.serviceAreaType === sceneData.value) {
                loop.relSpace?.forEach(space => {
                    if (!idMap[space.id]) {
                        idMap[space.id] = [];
                    }
                    idMap[space.id].push(loop);
                });
            }
        });
        return idMap;
    });

    /**
     * 根据空间ID获取回路列表
     *
     * 此函数从现有的回路列表中过滤出与指定空间ID相关联的回路项目，并确保它们的服务区域类型与当前场景数据匹配
     * 它首先将回路列表转换为数组，然后使用过滤器方法进行筛选，以找到匹配的空间ID和场景数据
     *
     * @param {string} spaceId - 需要匹配的空间ID
     * @returns {Array} - 过滤后的回路列表，其中包含与指定空间ID相关联的回路项目
     */
    const getLoopListBySpaceId = spaceId => {
        return spaceLoopMapCurScene.value[spaceId] ?? [];
        // return Array.from(loopList.value.values()).filter(loop => loop.relSpace.some(space => space.id === spaceId) && loop.serviceAreaType === sceneData.value);
    };
    /**
     * 根据模块ID获取所有相关的异常事件ID（包括模块本身和其下所有回路的异常事件ID）
     * @param {string|number} moduleId - 控制模块的唯一标识符
     * @returns {Array} 包含模块ID及其所有回路ID的去重数组
     */
    const getAbnormalIdsByModuleId = moduleId => {
        // 初始化结果数组，包含模块ID作为第一个元素
        const arr = [moduleId];

        // 获取该模块下的所有回路列表，并提取回路ID数组
        const loops = getLoopListByModuleId(moduleId);
        const loopIds = loops.map(loop => loop.id);

        // 合并回路ID数组到结果数组并进行去重处理
        arr.push(...loopIds);
        return uniq(arr);
    };
    /**
     * 获取指定空间ID下所有异常ID集合（包括空间ID、模块ID和回路ID）
     * @param {string|number} spaceId - 要查询的空间ID
     * @returns {Array} 包含所有唯一ID的数组（空间ID、模块ID和回路ID的去重集合）
     */
    const getAbnormalIdsBySpaceId = spaceId => {
        // 1.空间本身的异常事件
        // 初始化结果数组，包含初始空间ID
        const arr = [spaceId];
        // 2.空间下照明控制模块的异常事件
        // 获取该空间下的所有模块和DDC列表
        const modules = getModuleListBySpaceId(spaceId);
        const loops = [];
        // 3.空间下照明控制模块下所有回路的异常事件：先查询出空间下的控制模块，再查询出每个控制模块下的照明回路，查询照明回路的异常事件
        // 遍历每个模块，收集模块ID及其关联的回路ID
        modules.forEach(module => {
            arr.push(module.id);
            loops.push(...getLoopListByModuleId(module.id).map(loop => loop.id));
        });

        // 合并回路ID到结果数组并去重
        arr.push(...loops);
        return uniq(arr);
    };
    const getAbnormalIdsByFloorId = floorId => {
        if (!floorId) {
            return [];
        }
        const abnormalListIds = [];
        const modules = getModuleListByFloorId(floorId);
        /**
         * 楼层的异常事件：根据选中的是公共照明/停车场照明分别统计，根据楼层过滤数据，
         * 仅展示在该楼层的“控制模块所在空间”、以及这些空间下的照明控制模块以及控制模块下的回路关联的异常事件
         */
        // 1.控制模块所在空间
        let spaces = modules.map(module => module.relSpace);

        spaces = spaces.filter(space => space?.floorId === floorId);
        const spacesIds = spaces.map(space => space.id);
        // 2.空间下的照明控制模块Ids
        const moduleIds = [];
        spaces.forEach(space => {
            moduleIds.push(...space.relObjIds);
        });
        // 3.控制模块下的回路关联Ids
        const loopIds = [];
        modules.forEach(module => {
            loopIds.push(...getLoopListByModuleId(module.id).map(loop => loop.id));
        });

        abnormalListIds.push(...spacesIds, ...moduleIds, ...loopIds);

        return uniq(abnormalListIds);
    };
    /**
     * 根据建筑ID获取所有异常ID
     * @param {string} buildingId - 建筑ID
     * @returns {Array} 所有异常ID的数组
     */
    const getAbnormalIdsByBuildingId = buildingId => {
        // 查找与给定建筑ID匹配的建筑对象
        const build = gridData.value.find(item => item.id === buildingId);
        const ids = [];
        // 遍历建筑楼层，收集每个楼层的异常ID
        build?.floors.forEach(card => {
            ids.push(...getAbnormalIdsByFloorId(card.id));
        });
        // 返回去重后的异常ID数组
        return uniq(ids);
    };
    /**
     * 根据项目获取异常ID
     *
     * 此函数用于获取当前项目中的异常ID列表
     * 它直接返回预定义的异常ID列表，而不进行任何计算或数据操作
     *
     * @returns {Array} 异常ID列表
     */
    const getAbnormalIdsByProject = () => {
        return abnormalIds.value;
    };
    /**
     * 根据回路ID获取模块和DDC列表
     *
     * 此函数旨在通过特定的回路ID来获取与其关联的模块和DDC列表这些模块是根据回路ID在回路列表中找到的
     * 如果没有找到关联的控制器，或者关联的控制器未定义，函数将返回一个空数组
     *
     * @param {string} loopId - 回路ID，用于在回路列表中查找特定的回路对象
     * @returns {Array} - 与特定回路ID关联的模块和DDC列表如果找不到关联的控制器，则返回空数组
     */
    const getModuleListByLoopId = loopId => {
        const { relController } = loopList.value.get(loopId) || {};

        return relController.map(module => moduleList.value.get(module.id));
    };
    /**
     * 根据楼层ID获取模块和DDC列表
     *
     * 此函数从模块和DDC列表中筛选出属于特定楼层的模块它通过比较模块的floorId属性与给定的楼层ID来过滤模块
     * 使用Array.from和filter方法确保只选取匹配的项，并返回一个新的数组
     *
     * @param {string} floorId - 楼层ID，用于筛选模块
     * @returns {Array} - 匹配给定楼层ID的模块数组
     */
    const getModuleListByFloorId = floorId => {
        return Array.from(moduleList.value.values()).filter(item => item.floorId === floorId && item.serviceAreaTypes?.has(sceneData.value));
    };
    const getModuleListBySpaceId = spaceId => {
        // 从模块和DDC列表中筛选出与指定空间ID相关联的模块
        return Array.from(moduleList.value.values()).filter(module => {
            return module.relSpace?.id === spaceId;
        });
    };
    const getSpaceListByFloorId = floorId => {
        return Array.from(spaceList.value.values()).filter(space => space.floorId === floorId);
    };
    /**
     * 根据空间ID获取状态列表
     * 此函数旨在汇总给定空间内所有回路（loop）的运行状态和控制偏差状态
     * 它通过检查每个回路的运行状态和控制偏差状态来确定空间内设备的整体状态
     *
     * @param {string} spaceId - 空间ID，用于识别特定的空间
     * @returns {Array} 返回一个包含各种状态的对象数组，每个对象描述了一种特定的状态
     */
    const getStatusListBySpaceId = spaceId => {
        // 获取指定空间ID下的所有回路列表
        const loops = getLoopListBySpaceId(spaceId);
        // 初始化变量以跟踪所有回路的状态
        let allOpen = true,
            allClose = true,
            closeNumber = 0,
            runStatusNullNumber = 0,
            localNumber = 0,
            controlDeviationStatus1Number = 0,
            controlDeviationStatus2Number = 0;

        // 遍历每个回路以检查其状态
        loops.forEach(loop => {
            // 获取回路的运行状态和控制偏差状态
            const runStatus = getIotData(loop.id, INFOCODE.runStatus1.infoCode);
            const controlDeviationStatus = getIotData(loop.id, INFOCODE.controlDeviationStatus1.infoCode);

            const local = getIotData(loop.id, 'localRemoteStatus').dataValue === '0';

            // 根据运行状态更新allOpen和allClose变量
            if (runStatus?.dataValue !== INFOCODE.runStatus1.dataValue) {
                allOpen = false;
                closeNumber++;
            }
            // 如果运行状态为null，增加计数器
            if (INFOCODE.runStatusNull.checkDataValue(runStatus.dataValue)) {
                runStatusNullNumber++;
            }
            // 根据控制偏差状态更新对应的计数器
            if (controlDeviationStatus?.dataValue === INFOCODE.controlDeviationStatus1.dataValue) {
                controlDeviationStatus1Number++;
            } else if (controlDeviationStatus?.dataValue === INFOCODE.controlDeviationStatus2.dataValue) {
                controlDeviationStatus2Number++;
            }
            if (local) {
                localNumber++;
            }
        });
        if (closeNumber !== loops.length) {
            allClose = false;
        }
        // 如果没有回路，则设置所有状态为false
        if (loops.length === 0) {
            allOpen = false;
            allClose = false;
        }
        const partOpen = loops.length > 0 && !allClose && !allOpen;
        const spaceAbnormalIds = getAbnormalIdsBySpaceId(spaceId);
        const switchNormal = localNumber === 0 && controlDeviationStatus1Number === 0 && controlDeviationStatus2Number === 0 && runStatusNullNumber === 0;

        // 构建并返回状态列表

        return [
            { ...SPACE_STATUS_TEMPLATES.abnormalEvent, value: getAbnormalEventsList(spaceAbnormalIds)?.length > 0 },
            { ...SPACE_STATUS_TEMPLATES.switchNormal, value: switchNormal },
            { ...SPACE_STATUS_TEMPLATES.switchAbnormal, value: !switchNormal },
            { ...SPACE_STATUS_TEMPLATES.controlDeviation1, value: controlDeviationStatus1Number !== 0, number: controlDeviationStatus1Number },
            { ...SPACE_STATUS_TEMPLATES.controlDeviation2, value: controlDeviationStatus2Number !== 0, number: controlDeviationStatus2Number },
            { ...SPACE_STATUS_TEMPLATES.runStatusNull, value: runStatusNullNumber !== 0, number: runStatusNullNumber },
            { ...SPACE_STATUS_TEMPLATES.localRemote, value: localNumber !== 0, number: localNumber }
        ];
    };
    const handleTreeBuildingFloorData = async () => await treeBuildFloor().handleTreeBuildingFloorData();
    const treeBuildFloorStorePromise = handleTreeBuildingFloorData();
    const getDashboardData = async () => {
        isRightPanelTempControlLoading.value = true;
        await treeBuildFloorStorePromise;
        const serviceAreaTypeSet = new Set();
        setAbnormalEventStrategy(AbnormalEventStrategy.Related);
        try {
            let { data, code } = await getLightingEquipmentList({
                withColumns: ['id', 'buildingId', 'funcType', 'lampFuncType', 'serviceAreaType', 'localName', 'floorId', 'classCode'],
                runningMonitorSecondTypes: ['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING']
            });
            const treeData = new Map();
            if (code === SUCCESSCODE) {
                const floorInfoCache = {};

                // 设置设备数据
                data.forEach(item => {
                    serviceAreaTypeSet.add(item.serviceAreaType);
                    // 1.获取“照明回路”的全量异常事件：回路的管理范围
                    abnormalList.value.push(item);
                    item.relSpace = item.relSpace || [];
                    item.relSpace = item.relSpace.filter(v => v.floorId);
                    item.serviceSpaceInFloorIds = item.relSpace.map(v => {
                        // 仅是回路服务的空间：此版本暂时没有，后续会新增且会根据一级/二级风控目标过滤
                        // abnormalList.value.push(v);
                        spaceList.value.set(v.id, v);
                        serveSpaceList.value.set(v.id, v);
                        if (floorLoopList.value.get(v.floorId)) {
                            floorLoopList.value.get(v.floorId).loops.push(item.id, item);
                        } else {
                            const obj = treeBuildFloor().getBuildOrFloor(v.floorId);
                            const floorObj = { id: v.floorId, localName: obj.localName, name: obj.localName, floorSequenceId: obj.floorSequenceId, loops: [item] };
                            exceptionScreenList.value.forEach(a => {
                                floorObj[a.id] = 0;
                            });
                            floorLoopList.value.set(v.floorId, floorObj);
                        }
                        return v.floorId;
                    });
                    item.type = LOOP;
                    loopList.value.set(item.id, item);
                    // 给对象附加楼层信息（楼层名称等）
                    additionalFloorInfo(item, floorInfoCache);
                    item.relController = item.relController || [];
                    if (item.relDDC?.length) {
                        item.relController.push(...item.relDDC.map(ddc => ({ isDDC: true, ...ddc })));
                    }
                    item.relController?.forEach(v => {
                        // 2.获取“照明控制模块”的全量异常事件：根据管理范围内的回路查询关联的照明控制模块，查询控制模块的全量异常事件
                        abnormalList.value.push(v);
                        v.type = MODULE;
                        // 给对象附加楼层信息（楼层名称等）
                        additionalFloorInfo(v, floorInfoCache);
                        item.relModuleId = item.relModuleId || v.id;
                        item.relModuleName = item.relModuleName || v.localName;
                        if (moduleList.value.get(v.id)) {
                            moduleList.value.get(v.id).serviceAreaTypes.add(item.serviceAreaType);
                        } else {
                            moduleList.value.set(v.id, v);
                            // 模块可能同时在多个区域
                            moduleList.value.get(v.id).serviceAreaTypes = new Set([item.serviceAreaType]);
                        }
                    });
                });
                // 主页按楼层统计回路时，统计的逻辑是根据通过“照明回路服务空间、空间所属楼层”的关系查询出服务这一楼层的回路（一条回路服务两个楼层，则会在两个楼层均会统计该回路）
                data.forEach(item => {
                    item.relSpace.forEach(space => {
                        const floor = treeBuildFloor().getBuildOrFloor(space.floorId);
                        if (treeData.get(floor.buildingId)) {
                            treeData.get(floor.buildingId).floors.set(floor.id, floor);
                        } else {
                            const obj = treeBuildFloor().getBuildOrFloor(floor.buildingId);
                            treeData.set(floor.buildingId, {
                                id: floor.buildingId,
                                localName: obj.localName,
                                name: obj.localName,
                                isShow: true,
                                floors: new Map([[floor.id, floor]])
                            });
                        }
                    });
                });
                gridData.value = [...treeData.values().map(item => ({ ...item, floors: [...item.floors.values()] }))];
                serviceAreaTypeSet.forEach(item => {
                    if (item === PUBLIC.id) {
                        sceneList.value.push(PUBLIC);
                    }
                    if (item === PARKING.id) {
                        sceneList.value.push(PARKING);
                    }
                });
                sceneList.value = orderBy(sceneList.value, ['id'], ['asc']);
                // 外部url带参跳转时，优先使用url参数中的demandType作为场景数据
                // 确保demandType在场景列表中存在，避免无效参数导致的问题，对应的是场景列表中的code
                const urlDemandType = route.query?.demandType;
                const matchedScene = urlDemandType ? sceneList.value.find(scene => scene.code === urlDemandType) : null;
                sceneData.value = matchedScene?.id ?? sceneList.value?.[0]?.id;
                await getSpaceByModule();
            }
        } catch (error) {
            isRightPanelTempControlLoading.value = false;
            closeLoading();
            console.error('获取照明设备列表失败:', error);
        }
    };
    const getSpaceByModule = async () => {
        const moduleIds = [...moduleList.value.keys()];
        if (!moduleIds.length) {
            isRightPanelTempControlLoading.value = false;
            closeLoading();
            return;
        }
        const res = await listObjectsByTackValueLogic({
            runningMonitorType: RUNNING_MONITOR_TYPE,
            takeValueLogic: {
                queryParam: {
                    classCode: GeneralZone,
                    relationTo: {
                        graphCode: 'MechInArch',
                        relCode: 'Eq2Sp',
                        objFrom: moduleIds
                    },
                    withColumns: ['id', 'localName', 'relObjIds', 'roomFuncType', 'classCode', 'floorId'],
                    valid: 1
                }
            }
        });
        // 处理返回结果,模块关联的空间
        if (res.code === SUCCESSCODE) {
            res.data.forEach(item => {
                if (roomFuncTypeListSet.value.has(item.roomFuncType)) {
                    // 3.“照明控制模块所在空间”的空间异常事件：当控制模块所在空间的空间功能类型为“设备竖井SFT-02.02.00及其所有的下级”才获取这些空间的全量异常事件（不按一级/二级风控目标过滤），否则不获取 ；
                    abnormalList.value.push(item);
                    spaceList.value.set(item.id, item);
                    inSpaceList.value.set(item.id, item);
                }
                item.relObjIds.forEach(objId => {
                    // 照明控制模块关联多个空间时，取第一个
                    moduleList.value.get(objId) && !moduleList.value.get(objId).relSpace && (moduleList.value.get(objId).relSpace = item);
                    // 建立关系
                    // 1.空间下照明控制模块的异常事件
                    // 不需要建立关系
                    // setObject2RelatedObject(item.id, objId);
                    // 2.空间下照明控制模块下所有回路的异常事件：先查询出空间下的控制模块，再查询出每个控制模块下的照明回路，查询照明回路的异常事件
                    // getLoopListByModuleId(objId, false).forEach(loop => {
                    //     setObject2RelatedObject(item.id, loop.id);
                    // });
                });
                abnormalList.value = uniqBy(abnormalList.value, 'id');
            });
            isRightPanelTempControlLoading.value = false;
            await getIotDataAndAbnormalData();
        } else {
            isRightPanelTempControlLoading.value = false;
        }
    };

    const getIotDataAndAbnormalData = async () => {
        const loopListArray = Array.from(loopList.value.values()).map(loop => ({ objectId: loop.id, infoCodes: FIXED_INFOCODE, classCode: loop.classCode }));
        const moduleListArray = Array.from(moduleList.value.values()).map(module => ({
            objectId: module.id,
            classCode: module.classCode,
            infoCodes: [INFOCODE.onlineStatus0.infoCode, INFOCODE.faultStatus1.infoCode]
        }));
        const spaceListArray = Array.from(spaceList.value.values()).map(space => ({
            objectId: space.id,
            classCode: space.classCode,
            infoCodes: ['workPlaneLux']
        }));
        const params = {
            queryInfoCodeRule: true,
            queryInfoCodeDefine: true,
            queryInfoCodeRecoverTime: ['equipSwitchSet'],
            object: [...loopListArray, ...moduleListArray, ...spaceListArray]
        };
        await loadBatchQueryInfoCodeIotHandling(params);
        closeLoading();
        getInfoCodeConfigByObjectId(loopList);
        setAbnormalHandle();
        setDashboardSSE(params.object);
    };
    const setAbnormalHandle = () => {
        onQueryAbnormalEventList(
            {
                instanceIds: abnormalIds.value,
                runningMonitorType: RUNNING_MONITOR_TYPE
            },
            true
        );
        const classObject = {};
        abnormalList.value.forEach(item => {
            if (classObject[item.classCode]) {
                classObject[item.classCode].push(item.id);
            } else {
                classObject[item.classCode] = [item.id];
            }
        });
        setAbnormalSSEClientOption(classObject);
    };
    const setDashboardSSE = objects => {
        const objectIdAndInfoCodes = {};
        objects.forEach(item => {
            objectIdAndInfoCodes[item.objectId] = item.infoCodes;
        });
        const classObject = {};
        [...loopList.value.values(), ...moduleList.value.values(), ...spaceList.value.values(), ...lightingSidebarSensorInfoVO.value].forEach(item => {
            if (classObject[item.classCode]) {
                classObject[item.classCode].push(item.id);
            } else {
                classObject[item.classCode] = [item.id];
            }
        });
        setDashboardSSEClientOption(classObject, objectIdAndInfoCodes);
    };
    const getHeaderData = async () => {
        const illumRes = await getIllumInfo();
        setIotData(baseStore().projectId, 'outdoorIlluminance', {
            infoCode: 'outdoorIlluminance',
            dataValue: illumRes.data?.outdoorIlluminance,
            id: baseStore().projectId,
            unit: illumRes.data?.unit
        });
        lightingSidebarSensorInfoVO.value =
            illumRes.data?.lightingSidebarSensorInfoVO?.map(item => {
                const obj = {
                    ...item,
                    infoCode: item.infoCode || 'illum',
                    dataValue: item.illum,
                    id: item.instanceId,
                    localName: item.instanceName
                };
                setIotData(obj.id, obj.infoCode, obj);
                return obj;
            }) || [];
        sunRiseAndSet({
            startTime: getDayjsTz().format('YYYY-MM-DD'),
            endTime: getDayjsTz().add(2, 'day').format('YYYY-MM-DD')
        }).then(res => {
            console.log(res);
            const today = res.data?.[0];
            const morrow = res.data?.[1];
            sunRiseAndSetData.value.today = today || {};
            sunRiseAndSetData.value.morrow = morrow || {};
        });
    };
    const { notifyList, getNotifyList } = UseNotify();

    const getSpaceType = async () => {
        try {
            const res = await getInfoCode({
                classCode: GeneralZone,
                infoCode: 'roomFuncType'
            });
            res.data?.dataSources?.forEach(item => {
                roomFuncTypeMap.value.set(item.code, item.name);
            });
            const spaceTypeList = res.data?.dataSources?.filter(item => item.parentCode === 'SFT-02.02.00' || item.code === 'SFT-02.02.00') || [];
            spaceTypeList?.forEach(item => {
                roomFuncTypeListSet.value.add(item.code);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const funcTypeInLoopList = computed(() => {
        const funcTypeMap = new Map();
        // 遍历 loopList 中的所有元素
        Array.from(loopList.value.values()).forEach(loop => {
            if (loop.funcType && !funcTypeMap.has(loop.funcType)) {
                funcTypeMap.set(loop.funcType, {
                    funcType: loop.funcType,
                    funcTypeName: loop.funcTypeName
                });
            }
        });
        // 返回去重后的 Map 对象
        return funcTypeMap;
    });

    const init = async () => {
        openLoading();
        await getSpaceType();
        getHeaderData();
        getDashboardData();
    };
    provide(floorLoopListKey, floorLoopList);
    provide(sceneDataKey, sceneData);
    provide(sceneListKey, sceneList);
    provide(gridDataKey, gridData);
    provide(dashboardDataKey, dashboardData);
    provide(exceptionScreenKey, exceptionScreen);
    provide(exceptionScreenListKey, exceptionScreenList);
    provide(currentFloorObjInjectKey, currentFloorObj);
    provide('currentFloorObj', currentFloorObj);
    provide(mapBgColorKey, mapBgColor);
    provide(dashboardFloorIdsKey, dashboardFloorIds);
    provide(abnormalEventListKey, abnormalEventList);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    provide(loopListKey, loopList);
    provide(funcTypeInLoopListKey, funcTypeInLoopList);
    provide(moduleListKey, moduleList);
    provide(spaceListKey, spaceList);
    provide(inSpaceListKey, inSpaceList);
    provide(serveSpaceListKey, serveSpaceList);
    provide(notifyListKey, notifyList);
    provide(curStaticLoopCountKey, curStaticLoopCount);
    provide(buildingFloorPromiseKey, treeBuildFloorStorePromise);
    provide(roomFuncTypeListSetKey, roomFuncTypeListSet);
    provide(roomFuncTypeMapKey, roomFuncTypeMap);
    provide(getLoopListByFloorIdKey, getLoopListByFloorId);
    provide(getLoopListByBuildingIdKey, getLoopListByBuildingId);
    provide(getModuleListByLoopIdKey, getModuleListByLoopId);
    provide(getModuleListByFloorIdKey, getModuleListByFloorId);
    provide(getAbnormalIdsBySpaceIdKey, getAbnormalIdsBySpaceId);
    provide(getAbnormalIdsByFloorIdKey, getAbnormalIdsByFloorId);
    provide(getAbnormalIdsByProjectKey, getAbnormalIdsByProject);
    provide(getAbnormalIdsByBuildingIdKey, getAbnormalIdsByBuildingId);
    provide(getStatusListBySpaceIdKey, getStatusListBySpaceId);
    provide(getLoopListBySpaceIdKey, getLoopListBySpaceId);
    provide(getModuleListBySpaceIdKey, getModuleListBySpaceId);
    provide(getLoopListByModuleIdKey, getLoopListByModuleId);
    provide(getSpaceListByFloorIdKey, getSpaceListByFloorId);
    provide(getAbnormalIdsByModuleIdKey, getAbnormalIdsByModuleId);
    provide(showCircuitsAndControlerKey, showCircuitsAndControler);
    provide(loopIdMapInfoConfigsKey, loopIdMapInfoConfigs);
    provide(TemporaryRequirementRefKey, TemporaryRequirementRef);
    provide(dashboardBaseFloorIdsKey, dashboardBaseFloorIds);
    onMounted(() => {
        init();
        getNotifyList();
    });
    onBeforeUnmount(() => {
        clearAllObjectInfo();
    });
    return {
        isRightPanelTempControlLoading,
        loading,
        sceneList,
        spaceList,
        inSpaceList,
        serveSpaceList,
        exceptionScreenList,
        sceneData,
        exceptionScreen,
        currentFloorObj,
        mapBgColor,
        sceneDataKey,
        curStaticLoopCount,
        sunRiseAndSetData,
        roomFuncTypeMap,
        lightingSidebarSensorInfoVO,
        loopList,
        funcTypeInLoopList,
        loopListComputed,
        TemporaryRequirementRef,
        getStatusListBySpaceId,
        getLoopListBySpaceId,
        getAbnormalIdsByModuleId,
        getAbnormalIdsBySpaceId
    };
};
