import i18n from '@/localization';
import { uniqBy } from 'lodash';
import { CONFIG_OBJECT_TYPE_SORT_ORDER, GENERAL_LIGHTING_FUNC_TYPE, NOT_CONFIGURED, SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_OPEN, SMD_CLOSE } from '../constant/index';
import treeBuildFloorStore from '@/store/treeBuildFloor';

export const formatterConfigTree = data => {
    const treeMap = new Map(); // 用于存储树节点

    // 遍历数据，按 objectType 分组
    data.forEach(item => {
        if (!treeMap.has(item.objectType)) {
            // 如果该 objectType 的节点不存在，则创建
            treeMap.set(item.objectType, {
                open: true,
                objectType: item.objectType,
                relInstanceIds: [],
                children: []
            });
        }
        const relInstances = item.relInstances || [];
        const relInstanceIds = relInstances.length > 0 ? relInstances.map(e => e.instanceId) : [];

        treeMap.get(item.objectType).relInstanceIds.push(...relInstanceIds);

        let instanceNames = '';
        if (relInstances.length > 0) {
            const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
            const sortedRelInstances = relInstances.toSorted((a, b) => {
                return collator.compare(b?.instanceName, a?.instanceName);
            });
            const result = Object.groupBy(sortedRelInstances, ({ buildingName }) => buildingName);
            const arr = Object.entries(result)?.map(([key, v]) => {
                if (key === 'undefined') {
                    return `${v.map(obj => obj.instanceName).join('、')}`;
                } else {
                    return `${v.map(obj => obj.instanceName).join('/')}(${key})`;
                }
            });
            instanceNames = arr.join('、');
        } else {
            instanceNames = '';
        }
        // 将当前 item 添加到对应 objectType 的 children 中
        if (item.groupName) {
            treeMap.get(item.objectType).children.push({
                ...item,
                relInstances,
                relInstanceIds,
                instanceNames,
                objectType: item.objectType,
                groupId: item.groupId,
                groupName: item.objectType === 'PROJECT' ? i18n.global.t('meos_control_web.global_configuration') : item.groupName
            });
            // 按 createTime 倒序排序 children 数组
            treeMap.get(item.objectType).children.sort((a, b) => {
                const timeA = a.createTime ? new Date(a.createTime) : new Date(0);
                const timeB = b.createTime ? new Date(b.createTime) : new Date(0);
                return timeB - timeA; // 倒序排序
            });
        }
    });
    // 将 treeMap 转换为数组形式并排序
    return [...treeMap.values()].toSorted((a, b) => {
        return CONFIG_OBJECT_TYPE_SORT_ORDER.indexOf(a.objectType) - CONFIG_OBJECT_TYPE_SORT_ORDER.indexOf(b.objectType);
    });
};

export const getScrollTopHeight = () => {
    const activeItems = document.querySelectorAll('.activeItem');
    const isActiveItems = document.querySelectorAll('.isActive');
    const rectChild = activeItems[0].getBoundingClientRect();
    const offsetTopChild = rectChild.top + window.scrollY;
    const rectParent = isActiveItems[0].getBoundingClientRect();
    const offsetHeightParent = isActiveItems[0].offsetHeight;
    const offsetTopParent = rectParent.top + window.scrollY;
    let viewportHeight = window.innerHeight,
        height = 0;

    if (viewportHeight - 100 > offsetTopChild) {
        height = 0;
    } else {
        if (offsetHeightParent > viewportHeight) {
            height = offsetTopChild - (offsetHeightParent - viewportHeight);
        } else {
            height = offsetTopParent - 40;
        }
    }
    return height;
};

export const setSpaceTreeData = spaceList => {
    const spaceIdSet = new Set();
    const floorsMap = new Map();
    const buildsMap = new Map();

    spaceList.forEach(space => {
        const floorInfo = treeBuildFloorStore().getBuildOrFloor(space.floorId) || {};
        const buildingInfo = treeBuildFloorStore().getBuildOrFloor(floorInfo.buildingId) || {};
        floorsMap.set(space.floorId, { ...floorInfo, name: floorInfo?.localName, children: [] });
        buildsMap.set(floorInfo.buildingId, { ...buildingInfo, name: buildingInfo?.localName, children: [] });
    });

    spaceList.forEach(space => {
        const floorInfo = floorsMap.get(space.floorId) || {};
        if (floorInfo && !spaceIdSet.has(space.id)) {
            floorInfo.children.push(space);
            spaceIdSet.add(space.id);
        }
    });

    [...floorsMap.values()]
        .toSorted((a, b) => b.floorSequenceId - a.floorSequenceId)
        .forEach(floor => {
            const buildingInfo = buildsMap.get(floor.buildingId) || {};
            if (buildingInfo) {
                buildingInfo.children.push(floor);
            }
        });

    return [...buildsMap.values()].map(b => ({ ...b, open: buildsMap.size === 1 }));
};

export const setModuleTreeData = moduleList => {
    const moduleIdSet = new Set();
    const spacesMap = new Map();
    const floorsMap = new Map();
    const buildsMap = new Map();

    moduleList.forEach(m => {
        const floorInfo = treeBuildFloorStore().getBuildOrFloor(m.floorId) || {};
        const buildingInfo = treeBuildFloorStore().getBuildOrFloor(floorInfo.buildingId) || {};
        floorsMap.set(m.floorId, { ...floorInfo, name: floorInfo?.localName, children: [] });
        buildsMap.set(floorInfo.buildingId, { ...buildingInfo, name: buildingInfo?.localName, children: [] });
        const { relSpace } = m;
        spacesMap.set(relSpace.id, { ...relSpace, name: relSpace?.localName, children: [] });
    });

    moduleList.forEach(m => {
        const { relSpace } = m;
        const space = spacesMap.get(relSpace.id) || {};
        if (space && !moduleIdSet.has(m.id)) {
            space.children.push(m);
            moduleIdSet.add(m.id);
        }

        const floorInfo = floorsMap.get(space.floorId) || {};
        if (floorInfo) {
            floorInfo.children.push(space);
        }
        floorInfo.children = uniqBy(floorInfo.children);
    });

    [...floorsMap.values()]
        .toSorted((a, b) => b.floorSequenceId - a.floorSequenceId)
        .forEach(floor => {
            const buildingInfo = buildsMap.get(floor.buildingId) || {};
            if (buildingInfo) {
                buildingInfo.children.push(floor);
            }
        });
    return [...buildsMap.values()];
};

export const getLoopTreeIds = loopList => {
    const buildingIdsSet = new Set();
    const floorIdsSet = new Set();
    const roomFuncTypeIdsSet = new Set();

    const spaceInfoMap = new Map();
    loopList.forEach(item => {
        (item?.relSpace || []).forEach(space => {
            const newSpace = { ...space, funcTypes: [item.funcType] };
            // 服务空间的回路可能有多个，回路对应的功能类型也可能有多个
            if (!spaceInfoMap.has(space.id)) {
                spaceInfoMap.set(space.id, newSpace);
            } else {
                const preInfo = spaceInfoMap.get(space.id);
                const preInfoFuncTypes = preInfo.funcTypes || [];
                const noRepeatFuncTypes = new Set([...preInfoFuncTypes, item.funcType]);
                spaceInfoMap.set(space.id, { ...preInfo, funcTypes: [...noRepeatFuncTypes] });
            }

            if (space.roomFuncType) {
                roomFuncTypeIdsSet.add(space.roomFuncType);
            }
            if (space.floorId) {
                floorIdsSet.add(space.floorId);

                const floorInfo = treeBuildFloorStore().getBuildOrFloor(space.floorId) || {};
                if (floorInfo.buildingId) {
                    buildingIdsSet.add(floorInfo.buildingId);
                }
            }
        });
    });
    return {
        buildingIds: [...buildingIdsSet],
        floorIds: [...floorIdsSet],
        roomFuncTypeIds: [...roomFuncTypeIdsSet],
        spaceIds: [...spaceInfoMap.keys()],
        spacesInfo: [...spaceInfoMap.values()]
    };
};

export const handleTreeParentIdWithModify = (tree, idKey = 'id', nameKey = 'name') => {
    if (Array.isArray(tree)) {
        tree.forEach(item => {
            item.id = item[idKey];
            item.name = item[nameKey];
            item.parentId = tree[idKey];
            handleTreeParentIdWithModify(item, idKey, nameKey);
        });
    } else if (tree?.children?.length) {
        tree.children.forEach(item => {
            item.id = item[idKey];
            item.name = item[nameKey];
            item.parentId = tree[idKey];
            handleTreeParentIdWithModify(item, idKey, nameKey);
        });
    }
};

export const flattenTree = (root, idKey = 'id') => {
    if (!root) return [];
    const flattened = [];
    const stack = [root];
    while (stack.length > 0) {
        const node = stack.pop();
        flattened.push(node);

        if (node?.children?.length) {
            for (let i = node.children.length - 1; i >= 0; i--) {
                const newNode = node.children[i] || {};
                stack.push({ ...newNode, parentId: node[idKey] });
            }
        }
    }
    return flattened;
};

// 只展示部分树节点，包括非叶子节点和叶子节点，若过滤ids中有某个节点，则展示该节点直到根节点
export const filterTreeByNodeIds = (treeData, flattenArr, ids, idKey = 'id') => {
    const requiredIds = new Set();
    ids.forEach(id => {
        let currentId = id;
        while (currentId) {
            requiredIds.add(currentId);
            currentId = flattenArr.find(v => v[idKey] === currentId)?.parentId;
        }
    });

    const filterNodes = nodes => {
        return nodes
            .filter(node => requiredIds.has(node[idKey]))
            .map(node => ({
                ...node,
                children: node.children ? filterNodes(node.children) : []
            }));
    };

    return filterNodes(treeData);
};

export const setRoomFuncTypeTree = (treeData, roomFuncTypes) => {
    const cloneTreeData = structuredClone(treeData);
    const treeRoot = { children: cloneTreeData, funcType: 'root', id: 'root', name: 'root' };
    handleTreeParentIdWithModify(treeRoot, 'funcType', 'funcTypeName');

    // 过滤仅回路服务空间的空间功能类型
    const flattenArray = flattenTree(treeRoot, 'funcType');
    const filterFlattenIds = flattenArray.filter(v => roomFuncTypes.includes(v?.funcType)).map(v => v.funcType);
    const newTreeData = filterTreeByNodeIds(cloneTreeData, flattenArray, filterFlattenIds, 'funcType');
    return newTreeData;
};

export const isSpaceLightFeedBack = (spaceInfo, spaceWithWorkPlaneLux = false, projectWithOutdoorIlluminance = false) => {
    // 1、空间对象的静态信息点“被自然采光替代程”replacedByNatLighting=1或2；
    // 2、服务该空间的回路中包含“功能类型=1 普通照明”的回路
    // 3、具备照度反馈条件：该空间“参考面照度（workPlaneLux）”有实例化规则 或 项目的“室外照度（outdoorIlluminance）”有实例化规则
    const withLight = ['1', '2'].includes(spaceInfo?.replacedByNatLighting?.toString());
    const isNormalFuncType = spaceInfo?.funcTypes?.some(v => v === GENERAL_LIGHTING_FUNC_TYPE);
    return withLight && isNormalFuncType && (spaceWithWorkPlaneLux || projectWithOutdoorIlluminance);
};

// 不同楼层按楼层顺序从高到底降序排序，同一楼层时按回路名称升序排序
export const sortWithFloorList = (floorList, isQuery = true) => {
    const collator = new Intl.Collator('zh-CN', { sensitivity: 'case', numeric: true });
    return floorList.toSorted((a, b) => {
        const aFloorInfo = isQuery ? treeBuildFloorStore().getBuildOrFloor(a.floorId) : a;
        const bFloorInfo = isQuery ? treeBuildFloorStore().getBuildOrFloor(b.floorId) : a;
        const aOrder = aFloorInfo?.floorSequenceId ?? 0;
        const bOrder = bFloorInfo?.floorSequenceId ?? 0;
        const aLocalName = a?.localName || '';
        const bLocalName = b?.localName || '';
        if (aOrder === bOrder) {
            return collator.compare(aLocalName, bLocalName);
        } else {
            return bOrder - aOrder;
        }
    });
};

// 获取重复的回路配置，根据分组, 并计算回路统计
export const getRepeatLoopsConfigByGroup = (loopList, groupList) => {
    const allLoopListIds = loopList.map(v => v?.id);
    const configuredGroups = groupList.filter(item => item.settingMode && item.settingMode !== NOT_CONFIGURED);
    const allConfigLoopListByGroup =
        configuredGroups.flatMap(item => (item.relObjects || []).map(v => ({ ...v, groupName: item.name, groupId: item.id, settingMode: item.settingMode }))) || [];

    const loopByGroupMap = new Map();
    allConfigLoopListByGroup.forEach(loop => {
        if (loopByGroupMap.has(loop.id)) {
            const preLoop = loopByGroupMap.get(loop.id);
            // 重复编组中至少一个编组配置为全开，则该回路为开启
            if (preLoop.settingMode === SMD_ALL_OPEN || loop.settingMode === SMD_ALL_OPEN) {
                loopByGroupMap.get(loop.id).settingMode = SMD_ALL_OPEN;
            }
            loopByGroupMap.get(loop.id).groupIds.push(loop.groupId);
            loopByGroupMap.get(loop.id).groupNames.push(loop.groupName);
        } else {
            loopByGroupMap.set(loop.id, { loopId: loop.id, loopName: loop.localName, groupIds: [loop.groupId], groupNames: [loop.groupName], settingMode: loop.settingMode });
        }
    });
    const repeatItems = [...loopByGroupMap.values()].filter(loop => loop.groupIds.length > 1);
    const repeatLoopIds = repeatItems.map(item => item.loopId);

    let repeatOpenCount = 0,
        repeatCloseCount = 0;
    if (Array.isArray(repeatItems) && repeatItems.length) {
        repeatItems.forEach(item => {
            // 仅统计回路列表中的重复回路
            if (allLoopListIds.includes(item.loopId)) {
                if (item.settingMode === SMD_ALL_OPEN) {
                    repeatOpenCount++;
                }
                if (item.settingMode === SMD_ALL_CLOSE) {
                    repeatCloseCount++;
                }
            }
        });
    }

    const filterConfigLoopList = allConfigLoopListByGroup.filter(item => {
        if (repeatLoopIds?.length) {
            return !repeatLoopIds.includes(item.id);
        }
        return true;
    });

    const filterLoopListIds = allLoopListIds.filter(itemId => {
        if (repeatLoopIds?.length) {
            return !repeatLoopIds.includes(itemId);
        }
        return true;
    });
    const filterOpenCount = filterConfigLoopList.filter(item => filterLoopListIds.includes(item.id) && [SMD_OPEN, SMD_ALL_OPEN].includes(item.settingMode)).length;
    const filterCloseCount = filterConfigLoopList.filter(item => filterLoopListIds.includes(item.id) && [SMD_CLOSE, SMD_ALL_CLOSE].includes(item.settingMode)).length;
    const openCount = filterOpenCount + repeatOpenCount;
    const closeCount = filterCloseCount + repeatCloseCount;
    const unConfigCount = loopList.length - (openCount + closeCount);
    return { configuredGroups, repeatItems, openCount, closeCount, unConfigCount };
};
