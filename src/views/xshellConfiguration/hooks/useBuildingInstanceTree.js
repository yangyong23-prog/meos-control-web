import { listObjectsByTackValueLogic } from '@/apis/common';
// import { getTreeBuildingFloorSpace } from '@/apis/xshellConfiguration';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import baseStore from '@/store/baseStore';
import { AIR_TERMINAL, SUCCESSCODE } from '@/utils/globalVariables';
import i18n from '@/localization';
import { HALF_SECTION_VISIBILITY_ENUM } from '../constants/constant';

function useBuildingInstanceTree() {
    const originBuildingFloorTree = ref([]);

    const getInstanceObjectTree = async () => {
        return treeBuildFloorStore()
            .handleTreeBuildingFloorData()
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    originBuildingFloorTree.value = res.data;
                }
            });
    };

    // ACATAH ACATFU
    const ACATAHInstanceList = ref([]);
    const ACATAHInstanceTree = computed(() => {
        const tree = mergeInstanceTree(originBuildingFloorTree.value, ACATAHInstanceList.value);
        return tree;
    });
    const ACATAHInstanceTreeMap = computed(() => {
        const map = new Map();
        ACATAHInstanceList.value.forEach(building => {
            map.set(building.id, building);
        });
        return map;
    });

    const ACATFUInstanceList = ref([]);
    const ACATFUInstanceTree = computed(() => {
        const tree = mergeInstanceTree(originBuildingFloorTree.value, ACATFUInstanceList.value);
        return tree;
    });
    const ACATFUInstanceTreeMap = computed(() => {
        const map = new Map();
        ACATFUInstanceList.value.forEach(building => {
            map.set(building.id, building);
        });
        return map;
    });

    // 空调机组控制组
    const ACAHGInstanceList = ref([]);
    const ACAHGInstanceTree = computed(() => {
        if (!ACAHGInstanceList.value?.length) {
            return [];
        }
        const tree = [
            {
                id: 'acahg_root',
                name: i18n.global.t('common.all'),
                children: ACAHGInstanceList.value.map(ins => {
                    return {
                        id: ins.id,
                        name: ins.localName ?? ins.name ?? '--'
                    };
                })
            }
        ];
        return tree;
    });

    const INSTANCE_TYPE = AIR_TERMINAL;

    const getACATAHInstanceList = async () => {
        const res = await getInstanceByClassCode(HALF_SECTION_VISIBILITY_ENUM.graphHsecAcatah.classCode);
        ACATAHInstanceList.value = res;
    };

    const getACATFUInstanceList = async () => {
        const res = await getInstanceByClassCode(HALF_SECTION_VISIBILITY_ENUM.graphHsecAcatfu.classCode);
        ACATFUInstanceList.value = res;
    };

    const getACAHGInstanceList = async () => {
        const queryWithColumns = ['id', 'localName', 'classCode'];
        const res = await getInstanceByClassCode(HALF_SECTION_VISIBILITY_ENUM.graphHsecAcahg.classCode, queryWithColumns);
        ACAHGInstanceList.value = res;
    };

    const getInstanceByClassCode = async (classCode, withColumns) => {
        const instanceList = await listObjectsByTackValueLogic({
            projectId: baseStore().projectId,
            runningMonitorType: INSTANCE_TYPE,
            takeValueLogic: {
                queryParam: {
                    // ACATAH ACATFU
                    classCode,
                    withColumns: withColumns || ['id', 'localName', 'classCode', 'floorId'],
                    monitoringSurveillanceStatus: ['2', '3'],
                    orderCustoms: [
                        {
                            column: 'localName',
                            chineseOrder: true
                        }
                    ]
                }
            }
        });
        if (instanceList.code === SUCCESSCODE) {
            return instanceList.data;
        }
        return [];
    };

    const mergeInstanceTree = (buildingFloorTree, instanceList) => {
        if (!buildingFloorTree || !Array.isArray(buildingFloorTree)) {
            return [];
        }
        if (!instanceList || !Array.isArray(instanceList)) {
            return buildingFloorTree;
        }

        // 深拷贝建筑楼层树，避免修改原始数据
        const mergedTree = structuredClone(buildingFloorTree);

        // 将建筑的 floors 转换为 children，统一使用 children 字段，并统一名称使用 name
        mergedTree.forEach(building => {
            // 统一建筑名称字段为 name
            building.name = building.localName ?? building.name ?? building.dynamicName ?? '--';

            // 如果存在 floors 字段，转换为 children
            if (building.floors && Array.isArray(building.floors)) {
                building.children = building.floors;
                // 删除 floors 字段以保持结构统一
                delete building.floors;
            } else if (!building.children) {
                // 如果没有 floors 也没有 children，初始化为空数组
                building.children = [];
            }

            // 为每个楼层初始化 children 数组，并统一名称字段为 name
            building.children.forEach(floor => {
                floor.name = floor.localName ?? floor.name ?? floor.dynamicName ?? '--';
                if (!floor.children) {
                    floor.children = [];
                }
            });
        });

        // 将实例按 floorId 分组，提高查找效率
        const instanceMap = new Map();
        instanceList.forEach(instance => {
            if (instance.floorId) {
                if (!instanceMap.has(instance.floorId)) {
                    instanceMap.set(instance.floorId, []);
                }
                instanceMap.get(instance.floorId).push(instance);
            }
        });

        // 遍历树结构，将实例添加到对应楼层，并过滤掉没有实例的楼层
        mergedTree.forEach(building => {
            if (building.children && Array.isArray(building.children)) {
                // 过滤掉没有实例的楼层（剪纸）
                const newFloors = building.children.filter(floor => {
                    const instances = instanceMap.get(floor.id);
                    if (instances && instances.length > 0) {
                        // 实例节点也统一名称字段为 name
                        const instanceNodes = instances.map(instance => ({
                            ...instance,
                            name: instance.localName ?? instance.name ?? instance.dynamicName ?? '--'
                        }));

                        floor.children.push(...instanceNodes);
                        return true; // 保留有实例的楼层
                    }
                    return false; // 移除没有实例的楼层
                });
                building.children = newFloors;
            }
        });

        // 过滤掉没有楼层的建筑（如果所有楼层都被移除了）
        const filteredTree = mergedTree.filter(building => {
            return building.children && Array.isArray(building.children) && building.children.length > 0;
        });

        // 根据建筑数量设置默认展开状态
        // 若当前项目有两个建筑，树结构层级默认全部收起
        // 若当前项目只有一个建筑，树结构层级默认展开一级
        const buildingCount = filteredTree.length;
        const shouldExpand = buildingCount === 1;
        filteredTree.forEach(building => {
            // 只有一个建筑时，展开第一级（建筑节点）
            // 两个或更多建筑时，全部收起
            building.open = shouldExpand;
        });

        return filteredTree;
    };

    const initBuildingInstanceTree = async () => {
        Promise.all([getInstanceObjectTree(), getACATAHInstanceList(), getACATFUInstanceList(), getACAHGInstanceList()]);
    };

    return {
        originBuildingFloorTree,
        getInstanceObjectTree,
        getACATAHInstanceList,
        getACATFUInstanceList,
        ACATAHInstanceTree,
        ACATFUInstanceTree,
        ACAHGInstanceTree,
        initBuildingInstanceTree,
        ACATAHInstanceTreeMap,
        ACATFUInstanceTreeMap
    };
}

export default useBuildingInstanceTree;
