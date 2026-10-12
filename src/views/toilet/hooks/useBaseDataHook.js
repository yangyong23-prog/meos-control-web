// @ts-ignore
import i18n from '@/localization';
import { getToiletEquipmentList } from '@/apis/toilet';
import dataDockHandling from '@/hooks/dataDockHandling';
import useLoading from '@/hooks/useLoading';
import treeBuildFloor from '@/store/treeBuildFloor';
import { GRID, SUCCESSCODE } from '@/utils/globalVariables';
import { orderBy } from 'lodash';
import { RUNNING_MONITOR_TYPE } from '../variables';
import DockSingleton from '@/hooks/responsiveDock';
import useAbnormalDataWithSSE from '@/views/Common/AbnormalListPlus/useAbnormalDataWithSSE';
import { useAbnormalSSEGlobal } from '@/hooks/useAbnormalSSEGlobal';
import { useObjectInfoDataByTemplateHook } from '@/hooks/useObjectInfoDataByTemplateHook';
import { useDashboardSSEGlobal } from '@/hooks/useDashboardSSEGlobal';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';

export const abnormalEventListKey = Symbol('abnormalEventListKey'); // 异常事件列表
export const abnormalEventListLoadingKey = Symbol('abnormalEventListLoadingKey'); // 异常事件列表加载状态
export const abnormalEventListUpdateTimeKey = Symbol('abnormalEventListUpdateTimeKey'); // 异常事件列表更新时间
export const abnormalEventListLoadedTimeKey = Symbol('abnormalEventListLoadedTimeKey');
export const totalListKey = Symbol('totalList');
export const dashboardDataKey = Symbol('dashboardData');
export const collapsedKeysKey = Symbol('collapsedKeys');
export const exceptionScreenKey = Symbol('exceptionScreen');
export const exceptionScreenListKey = Symbol('exceptionScreenList');
export const buildFloorFilterTreeKey = Symbol('buildFloorFilterTree');
export const buildFloorFilterDataKey = Symbol('buildFloorFilterData');
export const currentFloorObjKey = Symbol('currentFloorObj');
export const currentSelectObjKey = Symbol('currentSelectObj');
export const spaceMapKey = Symbol('spaceMapKey');
export const equipmentMapKey = Symbol('equipmentMapKey');
export const d3bgColorKey = Symbol('d3bgColorKey');
export const getSpaceIdsAndEquipmentIdsByFloorIdKey = Symbol('getSpaceIdsAndEquipmentIdsByFloorId');
export const getEquipmentIdsBySpaceIdKey = Symbol('getEquipmentIdsBySpaceId');
export const getSpaceIdsAndEquipmentIdsKey = Symbol('getSpaceIdsAndEquipmentIds');
export const countCFIDBPKey = Symbol('countCFIDBPkey');
export const buildFloorMapRefKey = Symbol('buildFloorMapRef');

export const useBaseDataHook = () => {
    const { loadDynaDataWithIotHandling } = dataDockHandling();
    const { setObject2RelatedObject, setAbnormalEventStrategy, AbnormalEventStrategy, clearAllObjectInfo } = DockSingleton.getInstance();
    // clearAllObjectInfo();

    const buildFloorMapRef = ref(null); // 用于存储楼层地图组件的引用
    setAbnormalEventStrategy(AbnormalEventStrategy.Related);
    const totalList = ref([
        { id: 'all', total: { name: i18n.global.t('meos_control_web.total_toilet_count'), num: 0 }, abnormal: { name: i18n.global.t('meos_control_web.abnormal_space'), num: 0 } },
        {
            id: 'SFT-01.06.01',
            total: { name: i18n.global.t('meos_control_web.male_restroom'), num: 0 },
            abnormal: { name: i18n.global.t('meos_control_web.abnormal_space'), num: 0 }
        },
        {
            id: 'SFT-01.06.02',
            total: { name: i18n.global.t('meos_control_web.female_restroom'), num: 0 },
            abnormal: { name: i18n.global.t('meos_control_web.abnormal_space'), num: 0 }
        },
        {
            id: 'SFT-01.06.03',
            total: { name: i18n.global.t('meos_control_web.accessible_restroom'), num: 0 },
            abnormal: { name: i18n.global.t('meos_control_web.abnormal_space'), num: 0 }
        },
        {
            id: 'SFT-01.06.05',
            total: { name: i18n.global.t('meos_control_web.gender_neutral_toilet'), num: 0 },
            abnormal: { name: i18n.global.t('meos_control_web.abnormal_space'), num: 0 }
        }
    ]);
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
    // Dashboard 相关数据
    const dashboardData = ref([]);
    const spaceMap = ref(new Map()); // 用于存储空间信息的映射
    const equipmentMap = ref(new Map()); // 用于存储设备信息的映射
    const collapsedKeys = ref([]);
    const exceptionScreen = ref('');
    // 隔间数量
    const countCFIDBP = ref(0);
    const d3bgColor = ref();
    const exceptionScreenList = ref([{ name: i18n.global.t('meos_control_web.abnormal_event'), id: 'abnormal' }]);
    const buildFloorFilterTree = ref([]);
    const buildFloorFilterData = ref([]);
    const currentFloorObj = ref({}); // 当前楼层对象
    const currentSelectObj = ref({}); // 当前空间对象
    const showCommonDrawer = ref(false); // 控制详情的显示状态
    const showExpansionCollapseNew = ref(true); // 控制展开收起组件的显示状态
    const { abnormalSSEClient, setAbnormalSSEClientOption } = useAbnormalSSEGlobal();
    const { setDashboardSSEClientOption } = useDashboardSSEGlobal();
    const { templateData, closeObjectInfoSSEClient } = useObjectInfoDataByTemplateHook(currentSelectObj);

    // 空间异常事件取数：该空间实例当前处于未解决状态的异常事件
    // 设备异常事件取数：设备实例当前处于未解决状态的异常事件
    const abnormalIds = computed(() => {
        return getSpaceIdsAndEquipmentIds(); // 返回所有空间和设备ID
    });
    // 异常事件相关数据
    const { onQueryAbnormalEventList, abnormalEventListLoading, abnormalEventListUpdateTime, abnormalEventListLoadedTime, abnormalEventList } = useAbnormalDataWithSSE({
        sseClient: abnormalSSEClient,
        objectIds: abnormalIds
    });
    const handleTreeBuildingFloorData = async () => await treeBuildFloor().handleTreeBuildingFloorData();
    const treeBuildFloorStorePromise = handleTreeBuildingFloorData();

    const fetchBaseData = async () => {
        openLoading();
        try {
            const res = await treeBuildFloorStorePromise;
            let tree = res.data.map(item => ({
                ...item,
                id: item.id,
                name: item.localName,
                isShow: true,
                children: item.floors.map(floor => ({ ...floor, id: floor.id, name: floor.localName, isShow: true, cards: [] })) // 初始化每个楼层的 cards 数组
            }));
            console.log(tree, '树形数据');
            collapsedKeys.value = res.data.map(item => item.id);
            countCFIDBP.value = 0;
            const { data, code } = await getToiletEquipmentList({
                withColumns: ['id', 'buildingId', 'localName', 'floorId', 'classCode', 'funcType', 'roomFuncType', 'objType', 'bimLocation', 'outline']
            });
            if (code === SUCCESSCODE) {
                data.forEach(item => {
                    item.equipments.forEach(equipment => {
                        // 测试代码
                        // equipment.floorId = item.floorId; // 关联楼层ID
                        // -----------------
                        equipment.relSpaceId = item.id; // 关联空间ID
                        equipment.relSpaceName = item.localName; // 关联空间名称
                        equipment.floorLocalName = treeBuildFloor().getBuildOrFloor(equipment.floorId)?.localName || ''; // 获取楼层名称
                        equipmentMap.value.set(equipment.id, equipment);
                        // 当前空间实例、空间下设备（仅有卫生间隔间）的处于未解决状态的异常事件
                        if (equipment.classCode === 'CFIDBP') {
                            setObject2RelatedObject(item.id, equipment.id);
                            countCFIDBP.value++;
                        }
                    });
                    item.abnormalNumber = 0; // 初始化异常数量
                    item.name = item.localName; // 设置空间名称
                    item.isShow = true; // 设置空间可见
                    item.infoCodeConfigs = []; // 初始化信息代码配置
                    item.outline = JSON.parse(item.outline);
                    item.floorLocalName = treeBuildFloor().getBuildOrFloor(item.floorId)?.localName || ''; // 获取楼层名称
                    spaceMap.value.set(item.id, item);
                });
                tree.forEach(build => {
                    build.children = build.children
                        .map(floor => {
                            floor.cards = Array.from(spaceMap.value.values()).filter(space => space.floorId === floor.id);
                            return floor;
                        })
                        .filter(floor => floor.cards.length > 0); // 过滤掉没有空间的楼层
                    build.children = orderBy(build.children, 'floorSequenceId', 'desc'); // 排序
                    build.floors = build.children;
                    build.floorList = build.children;
                });
                tree = tree.filter(build => build.children.length > 0); // 过滤掉没有楼层的建筑
                buildFloorFilterTree.value = structuredClone(tree.map(item => ({ open: tree.length === 1, ...item })));
                dashboardData.value = tree;
                await getInfoCodeAbnormalSapceAndEquipmentData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            closeLoading();
        }
    };
    const getInfoCodeAbnormalSapceAndEquipmentData = async () => {
        try {
            const spaceIds = Array.from(spaceMap.value.keys());
            const equipIds = Array.from(equipmentMap.value.keys());
            onQueryAbnormalEventList(
                {
                    instanceIds: getSpaceIdsAndEquipmentIds(),
                    runningMonitorType: RUNNING_MONITOR_TYPE
                },
                true
            ).then(res => {
                // 处理异常事件列表
                showExpansionCollapseNew.value = res?.data?.length > 0;
            });
            const res = await loadDynaDataWithIotHandling(
                {
                    runningMonitorType: RUNNING_MONITOR_TYPE,
                    objectIds: [...spaceIds, ...equipIds],
                    templateType: GRID
                },
                listInfoCodeConfigsByObjectIdCommon
            );
            res.data.forEach(item => {
                const data = spaceMap.value.get(item.id) || equipmentMap.value.get(item.id);
                if (data) {
                    // 递归获取所有 relInfoCodeConfigs
                    const allInfoCodeConfigs = extractRelInfoCodeConfigs(item.relInfoCodeGroupConfigs);
                    data.infoCodeConfigs = allInfoCodeConfigs;
                }
            });
        } catch (error) {
            console.error(error, '获取异常空间和设备数据失败');
        } finally {
            const spaceMapData = Array.from(spaceMap.value.values());
            const equipmentMapData = Array.from(equipmentMap.value.values());
            const classObject = {};
            const objectIdAndInfoCodes = {};
            [...spaceMapData, ...equipmentMapData].forEach(item => {
                if (item.infoCodeConfigs?.map(info => info.infoCode)?.length) {
                    objectIdAndInfoCodes[item.id] = item.infoCodeConfigs?.map(info => info.infoCode);
                }
                if (classObject[item.classCode]) {
                    classObject[item.classCode].push(item.id);
                } else {
                    classObject[item.classCode] = [item.id];
                }
            });
            setAbnormalSSEClientOption(classObject);
            setDashboardSSEClientOption(classObject, objectIdAndInfoCodes);
        }
    };
    /**
     * 递归提取所有 relInfoCodeConfigs
     * @param {Array} groups - 分组数据数组
     * @returns {Array} 所有 relInfoCodeConfigs 的平铺列表
     */
    const extractRelInfoCodeConfigs = (groups = []) => {
        const result = [];

        const traverse = groupList => {
            groupList.forEach(group => {
                // 添加当前分组的 relInfoCodeConfigs
                if (Array.isArray(group.relInfoCodeConfigs)) {
                    result.push(...group.relInfoCodeConfigs);
                }

                // 递归处理子分组
                if (Array.isArray(group.groupChildren) && group.groupChildren.length > 0) {
                    traverse(group.groupChildren);
                }
            });
        };

        traverse(groups);
        return result;
    };
    /**
     * 获取所有空间ID和特定设备ID的集合
     *
     * 该函数从空间映射表(spaceMap)中收集所有空间ID，并从设备映射表(equipmentMap)中
     * 筛选出类代码(classCode)为'CFIDBP'的设备ID，最后合并返回这两个集合
     *
     * @returns {Array} 包含所有空间ID和符合条件的设备ID的数组
     */
    const getSpaceIdsAndEquipmentIds = () => {
        const spaceIds = [];
        const equipmentIds = [];

        // 收集所有空间ID
        for (const [id, space] of spaceMap.value) {
            spaceIds.push(id);
        }

        // 筛选并收集特定类代码的设备ID
        for (const [id, equipment] of equipmentMap.value) {
            if (equipment.classCode === 'CFIDBP') {
                equipmentIds.push(id);
            }
        }

        return [...spaceIds, ...equipmentIds];
    };
    /**
     * 根据楼层ID获取该楼层下的所有空间ID和设备ID
     * @param {string} floorId - 要查询的楼层ID
     * @returns {Object} 包含两个属性的对象：
     *   - spaceIds {Array<string>} 该楼层下的所有空间ID数组
     *   - equipmentIds {Array<string>} 该楼层下的所有设备ID数组
     */
    const getSpaceIdsAndEquipmentIdsByFloorId = (floorId, includesClassCodes = []) => {
        // 初始化结果数组
        const spaceIds = [];
        const equipmentIds = [];

        // 遍历空间映射表，收集属于指定楼层的空间ID
        for (const [id, space] of spaceMap.value) {
            if (space.floorId === floorId) {
                spaceIds.push(id);
            }
        }

        // 遍历设备映射表，收集属于指定楼层的设备ID
        for (const [id, equipment] of equipmentMap.value) {
            if (equipment.floorId === floorId) {
                if (includesClassCodes.length > 0 && !includesClassCodes.includes(equipment.classCode)) {
                    continue; // 如果指定了类代码且设备不在其中，则跳过
                }
                equipmentIds.push(id);
            }
        }

        return { spaceIds, equipmentIds, allIds: [...spaceIds, ...equipmentIds] };
    };

    /**
     * 根据空间ID获取设备ID列表，可筛选指定类代码的设备
     * @param {string} spaceId - 要查询的空间ID
     * @param {Array} [includesClassCodes=[]] - 可选参数，需要包含的设备类代码数组
     * @returns {Array} 符合条件的设备ID数组
     */
    const getEquipmentIdsBySpaceId = (spaceId, includesClassCodes = []) => {
        const equipmentIds = [];
        // 从空间映射中获取指定空间信息
        const space = spaceMap.value.get(spaceId);

        if (space) {
            // 遍历空间内的所有设备
            for (let index = 0; index < space.equipments.length; index++) {
                const element = space.equipments[index];

                // 如果指定了类代码过滤条件且当前设备不符合条件，则跳过
                if (includesClassCodes.length > 0 && !includesClassCodes.includes(element.classCode)) {
                    return;
                }
                equipmentIds.push(element.id);
            }
        }
        return equipmentIds;
    };
    const closeDetailDrawer = () => {
        currentSelectObj.value = {};
        showCommonDrawer.value = false; // 关闭详情抽屉
        closeObjectInfoSSEClient();
    };
    onMounted(() => {
        fetchBaseData();
    });
    onBeforeUnmount(() => {
        clearAllObjectInfo();
    });
    watch(
        () => currentSelectObj.value.id,
        () => {
            if (currentSelectObj.value.id) {
                showCommonDrawer.value = true;
            } else {
                showCommonDrawer.value = false; // 如果没有选择空间，隐藏详情
            }
        }
    );
    watch(
        () => currentFloorObj.value.id,
        () => {
            closeDetailDrawer();
        }
    );
    // 提供所有数据
    provide(totalListKey, totalList);
    provide(dashboardDataKey, dashboardData);
    provide(collapsedKeysKey, collapsedKeys);
    provide(exceptionScreenKey, exceptionScreen);
    provide(exceptionScreenListKey, exceptionScreenList);
    provide(buildFloorFilterTreeKey, buildFloorFilterTree);
    provide(buildFloorFilterDataKey, buildFloorFilterData);
    provide(currentFloorObjKey, currentFloorObj);
    provide(currentSelectObjKey, currentSelectObj);
    provide(spaceMapKey, spaceMap);
    provide(equipmentMapKey, equipmentMap);
    provide(d3bgColorKey, d3bgColor);
    provide(countCFIDBPKey, countCFIDBP);
    provide(getSpaceIdsAndEquipmentIdsByFloorIdKey, getSpaceIdsAndEquipmentIdsByFloorId);
    provide(getEquipmentIdsBySpaceIdKey, getEquipmentIdsBySpaceId);
    provide(getSpaceIdsAndEquipmentIdsKey, getSpaceIdsAndEquipmentIds);
    provide(abnormalEventListKey, abnormalEventList);
    provide(abnormalEventListLoadingKey, abnormalEventListLoading);
    provide(abnormalEventListUpdateTimeKey, abnormalEventListUpdateTime);
    provide(abnormalEventListLoadedTimeKey, abnormalEventListLoadedTime);
    provide(buildFloorMapRefKey, buildFloorMapRef);
    return {
        d3bgColor,
        loading,
        totalList,
        dashboardData,
        collapsedKeys,
        exceptionScreen,
        exceptionScreenList,
        buildFloorFilterTree,
        buildFloorFilterData,
        showCommonDrawer,
        currentSelectObj,
        currentFloorObj,
        templateData,
        abnormalEventListUpdateTime,
        abnormalEventList,
        abnormalEventListLoading,
        buildFloorMapRef,
        showExpansionCollapseNew,
        closeDetailDrawer
    };
};
