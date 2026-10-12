// @ts-ignore
import i18n from '@/localization';
import { ALG_NO_DEFAULT_VALUE } from '../constants/constant';
import treeBuildFloorStore from '@/store/treeBuildFloor';
export const getType = value => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
export const stringifyVal = val => {
    const hasNumber = /\d+/g.test(val);
    return ['object', 'array'].includes(getType(val))
        ? JSON.stringify(val ?? '')
        : ['null', 'undefined'].includes(getType(val))
        ? getType(val)
        : hasNumber
        ? parseFloat(`${val ?? ''}`)
        : val;
};

export const checkValidStatus = (arr, valid, validStr) => {
    arr.forEach(item => {
        if (item.id === validStr) {
            item.isValid = valid;
        }
    });
};

export const checkGlobalModify = (val, item, leftOrRight, preSavedItems) => {
    const preSavedItem = preSavedItems?.find(v => v?.code === item?.code && (v?.objectId === item?.objectId || !v?.objectId));

    const cloneItem = structuredClone(item);
    // 忽略无默认值
    const isNoDefault = ALG_NO_DEFAULT_VALUE.includes(item.code);
    if (leftOrRight === 'left') {
        const stringVal = stringifyVal(val);
        const stringDefault = stringifyVal(item.defaultValueLeft);
        const preSavedLeftVal = stringifyVal(preSavedItem?.valueInputLeft);
        const modifyItem = {
            id: cloneItem?.code + '|' + 'left' + '|' + (cloneItem?.objectId || '') + '|' + (cloneItem?.tabObjectName || ''),
            isNotDefault: isNoDefault ? false : stringVal !== stringDefault,
            isNotPreSaved: preSavedLeftVal !== stringVal,
            curValue: val,
            defaultValue: structuredClone(item.defaultValueLeft),
            preSavedValue: structuredClone(preSavedItem?.valueInputLeft),
            leftOrRight,
            cloneItem
        };
        return modifyItem;
    } else {
        const stringVal = stringifyVal(val);
        const stringDefault = stringifyVal(item.defaultValueRight);
        const preSavedLRightVal = stringifyVal(preSavedItem?.valueInputRight);
        const modifyItem = {
            id: cloneItem?.code + '|' + 'right' + '|' + (cloneItem?.objectId || '') + '|' + (cloneItem?.tabObjectName || ''),
            isNotDefault: isNoDefault ? false : stringVal !== stringDefault,
            isNotPreSaved: preSavedLRightVal !== stringVal,
            curValue: val,
            defaultValue: structuredClone(item.defaultValueRight),
            preSavedValue: structuredClone(preSavedItem?.valueInputRight),
            leftOrRight,
            cloneItem
        };
        return modifyItem;
    }
};

/**
 * 查找树形结构中所有在 node.data 中包含指定属性的节点
 * @param {Array|Object} treeData - 树形数据，可以是单个节点或节点数组
 * @param {string} propertyName - 要查找的属性名
 * @param {string} [propertyValue] - 属性值，可选
 * @returns {Array} 返回所有在 node.data 中包含指定属性的节点数组
 */
export function findNodesWithDataProperty(treeData, propertyName, propertyValue) {
    const result = [];

    function traverse(node) {
        if (!node) return;

        // 检查当前节点的 data 中是否包含指定属性
        if (node.data && node.data.hasOwnProperty(propertyName)) {
            if (propertyValue === undefined || node.data[propertyName] === propertyValue) {
                result.push(node);
            }
        }

        // 如果节点有子节点，则继续遍历
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(traverse);
        }
    }

    if (Array.isArray(treeData)) {
        treeData.forEach(traverse);
    } else {
        traverse(treeData);
    }

    return result;
}

/**
 * 根据节点ID查找根节点（顶级父节点）
 * @param {Array} treeData - 树形数据
 * @param {String|Number} nodeId - 要查找的节点ID
 * @returns {Object|null} 找到的根节点，如果没有找到则返回null
 */
export function findRootNode(treeData, nodeId) {
    if (!treeData || !Array.isArray(treeData)) {
        return null;
    }

    // 辅助函数：查找节点并返回完整路径
    function findNodePath(nodes, targetId, path = []) {
        for (const node of nodes) {
            const currentPath = [...path, node];
            if (node.id === targetId) {
                return currentPath;
            }

            const children = node.treeSourceNodeChildren;
            if (children && Array.isArray(children)) {
                const result = findNodePath(children, targetId, currentPath);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    const path = findNodePath(treeData, nodeId);
    return path && path.length > 0 ? path[0] : null; // 返回路径的第一个节点（根节点）
}

/**
 * 根据多个节点ID查找它们的根节点（顶级父节点）
 * @param {Array} treeData - 树形数据
 * @param {Array} nodeIds - 要查找的节点ID数组
 * @returns {Array} 包含所有找到的根节点的数组，去重处理
 */
export function findRootNodes(treeData, nodeIds) {
    if (!treeData || !Array.isArray(treeData) || !nodeIds || !Array.isArray(nodeIds)) {
        return [];
    }

    const rootNodes = [];
    const processedRoots = new Set(); // 避免重复添加相同的根节点

    for (const nodeId of nodeIds) {
        const rootNode = findRootNode(treeData, nodeId);

        if (rootNode && !processedRoots.has(rootNode.id)) {
            rootNodes.push(rootNode);
            processedRoots.add(rootNode.id);
        }
    }

    return rootNodes;
}

/**
 * 禁用树形结构中的指定根节点及其子节点
 * @param {Array} treeData - 树形数据
 * @param {Array} disabledRootIds - 要禁用的根节点ID数组
 */
export function disableRootAndChildren(treeData, disabledRootIds = []) {
    if (!treeData || !Array.isArray(treeData)) {
        return;
    }

    // 递归函数，用于将节点及其所有子节点设置为禁用
    function disableNodeAndChildren(node) {
        if (!node) return;

        // 设置当前节点为禁用
        node.disabled = true;

        // 如果节点有子节点，则递归处理所有子节点
        if (node.treeSourceNodeChildren && Array.isArray(node.treeSourceNodeChildren)) {
            for (const child of node.treeSourceNodeChildren) {
                disableNodeAndChildren(child);
            }
        }
    }
    for (const child of treeData) {
        if (disabledRootIds.some(v => v === child.id)) {
            disableNodeAndChildren(child);
        } else {
            continue;
        }
    }
}

/**
 * 启用树形结构中的所有节点
 * @param {Array} treeData - 树形数据
 */
export function enableTreeNodes(treeData) {
    if (!treeData || !Array.isArray(treeData)) {
        return;
    }

    function enableNodeAndChildren(node) {
        if (!node) return;

        node.disabled = false;

        // 如果节点有子节点，则递归处理所有子节点
        if (node.treeSourceNodeChildren && Array.isArray(node.treeSourceNodeChildren)) {
            for (const child of node.treeSourceNodeChildren) {
                enableNodeAndChildren(child);
            }
        }
    }
    for (const child of treeData) {
        enableNodeAndChildren(child);
    }
}

/**
 * 生成空间树形结构数据
 * @param {Array} spaceList - 空间列表数据
 * @returns {Array} 生成的空间树形结构数据
 */
export const generateSpaceTreeData = spaceList => {
    const spaceIdSet = new Set();
    const floorsMap = new Map();
    const buildsMap = new Map();

    spaceList.forEach(space => {
        const { id, floorId } = space || {};
        if (!id || !floorId) return;
        const floorInfo = treeBuildFloorStore().getBuildOrFloor(floorId) || {};
        const { buildingId } = floorInfo;
        const buildingInfo = buildingId ? treeBuildFloorStore().getBuildOrFloor(buildingId) || {} : {};

        if (!floorsMap.has(floorId)) {
            if (floorInfo?.id) {
                floorsMap.set(floorId, { ...floorInfo, name: floorInfo?.localName, children: [] });
            }
        }

        if (!spaceIdSet.has(id)) {
            spaceIdSet.add(id);
            const cloneSpace = { ...space, name: space?.localName, objType: 'space' };
            floorsMap.get(floorId).children.push(cloneSpace);
        }

        if (!buildsMap.has(buildingId)) {
            if (buildingInfo?.id) {
                buildsMap.set(buildingId, { ...buildingInfo, name: buildingInfo?.localName, children: [] });
            }
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
    const treeData = [...buildsMap.values()].map(b => ({ ...b, open: true }));
    return treeData;
};

/**
 * 将configData转换成configTreeData的格式
 * @param {Array} configData - 扁平化的配置数据
 * @returns {Array} 树形结构数据
 */
/**
 * 将configData转换成configTreeData的格式
 * @param {Array} configData - 扁平化的配置数据
 * @returns {Array} 树形结构数据（支持多层级）
 */
export function convertConfigDataToTree(configData) {
    if (!configData || !Array.isArray(configData)) {
        return [];
    }

    // 创建一个映射，便于通过code快速查找数据
    const dataMap = new Map();
    for (const item of configData) {
        // 解析shellConfigValue
        let parsedValue = {},
            defaultValue = {};
        try {
            parsedValue = JSON.parse(item.shellConfigValue);
            defaultValue = JSON.parse(item.defaultValues || '{}');
        } catch (e) {
            parsedValue = {
                name: item.name,
                code: item.code
            };
        }

        const finalKey = item?.objectId ? `${item.objectId}~${item.code}` : item.code;

        // 构建节点的基本结构
        dataMap.set(finalKey, {
            name: parsedValue.name || item.name,
            defaultName: defaultValue?.name,
            code: finalKey,
            shellConfigValue: item.shellConfigValue,
            parentCode: parsedValue.parent, // 保存父节点code以便后续构建树形结构
            sort: parsedValue.sort || 0, // 保存排序值
            data: {
                alias: '',
                checked: parsedValue?.checked,
                ...(item.desc ? { linkButton: item.desc } : {}),
                ...(item.desc ? { modalValue: item.shellConfigValue } : {})
            }
        });
    }

    // 创建结果数组
    const result = [];

    // 遍历数据，构建完整的树形结构（支持多层级）
    for (const item of configData) {
        const finalKey = item?.objectId ? `${item.objectId}~${item.code}` : item.code;
        const node = dataMap.get(finalKey);

        // 如果是根节点（没有父节点），则加入结果数组
        if (!node.parentCode) {
            result.push(node);
        } else {
            // 如果不是根节点，则找到其父节点并添加为子节点。父节点无 objectId
            const parentNode = findNodeByCode(result, node.parentCode, 'code');
            if (parentNode) {
                if (!parentNode.children) {
                    parentNode.children = [];
                }

                parentNode.children.push(node);
            }
        }
    }

    // 对所有层级的节点进行排序
    sortTreeNodes(result);

    return result;
}

// 辅助函数：根据code查找节点
function findNodeByCode(nodes, targetCode, codeProperty) {
    for (const node of nodes) {
        if (node[codeProperty] === targetCode) {
            return node;
        }

        // 如果有子节点，递归搜索
        if (node.children) {
            const found = findNodeByCode(node.children, targetCode, codeProperty);
            if (found) {
                return found;
            }
        }
    }

    return null;
}

// 辅助函数：对树的所有层级节点进行排序
function sortTreeNodes(nodes) {
    // 对当前层级节点排序
    nodes.sort((a, b) => a.sort - b.sort);

    // 递归对子节点进行排序
    for (const node of nodes) {
        if (node.children) {
            sortTreeNodes(node.children);
        }
    }
}

/**
 * 根据configTreeData中的节点顺序和data属性值来更新configData中的sort和shellConfigValue
 * @param {Array} configData - 原始扁平化数据
 * @param {Array} configTreeData - 树形结构数据
 * @returns {Array} 更新后的configData
 */
export function updateConfigDataFromTree(configData, configTreeData) {
    if (!configData || !Array.isArray(configData) || !configTreeData || !Array.isArray(configTreeData)) {
        return configData;
    }

    // 创建一个configData的映射，以提高查找效率
    const configDataMap = new Map();
    configData.forEach(item => {
        const finalKey = item?.objectId ? `${item.objectId}~${item.code}` : item.code;
        configDataMap.set(finalKey, item);
    });

    // 创建结果数组，避免修改原始数据
    const result = [];

    // 递归遍历树形结构，更新configData中对应项的sort、name、shellConfigValue
    function traverseTree(nodes, parentCode = null, level = 0) {
        nodes.forEach((node, index) => {
            // 从映射中查找对应的configData项
            const finalKey = node?.objectId ? `${node.objectId}~${node.code}` : node.code;
            const configItem = configDataMap.get(finalKey);

            if (configItem) {
                // 创建副本，避免修改原始数据
                const updatedItem = { ...configItem };

                // 解析现有的shellConfigValue或defaultValues
                let parsedConfig = {};
                try {
                    parsedConfig = JSON.parse(updatedItem.shellConfigValue || updatedItem.defaultValues || '{}');
                } catch (e) {
                    // 如果解析失败，使用空对象
                    parsedConfig = {};
                }

                // 更新排序值、名称、是否勾选、实例id
                parsedConfig.sort = index + 1;
                parsedConfig.name = node.data?.alias || node.name;
                parsedConfig.checked = node.data?.checked;
                if (updatedItem?.objectId) {
                    parsedConfig.objectId = updatedItem.objectId;
                }

                // 如果有父节点，更新parent字段；否则删除parent字段
                if (parentCode) {
                    parsedConfig.parent = parentCode;
                } else {
                    delete parsedConfig.parent;
                }

                if (parsedConfig.checked === 'checked') {
                    // 合并data中的属性，保留非空值
                    if (node.data.linkButton && node.data.modalValue !== undefined) {
                        try {
                            const modalValue = JSON.parse(node.data.modalValue || '{}');
                            Object.keys(modalValue).forEach(key => {
                                // 排除排序值、名称、是否勾选
                                if (['name', 'sort', 'checked'].includes(key)) {
                                    return;
                                }
                                if (modalValue[key] !== null && modalValue[key] !== undefined) {
                                    parsedConfig[key] = modalValue[key];
                                }
                            });
                        } catch (error) {
                            console.error('Error parsing modalValue:', error);
                        }
                    }
                }

                // 更新shellConfigValue
                updatedItem.shellConfigValue = JSON.stringify(parsedConfig);

                // 添加到结果数组
                result.push(updatedItem);
            }

            // 递归处理子节点
            if (node.children && Array.isArray(node.children) && node.children.length > 0) {
                traverseTree(node.children, node.code, level + 1);
            }
        });
    }

    // 开始遍历
    traverseTree(configTreeData);

    return result;
}

/**
 * 只将第一层级和第二层级的node属性设置为open
 * @param {Array|Object} treeData - 树形数据，可以是单个节点或节点数组
 * @param {number} maxLevel - 最大层级数，默认为1（即前两级：第0层和第1层）
 */
export function setOpenAllNodes(treeData, maxLevel = 1) {
    function traverse(node, level = 0) {
        if (!node || level > maxLevel) return; // 只处理前两级（level 0 和 1）

        // 设置当前节点的open属性为true
        node.open = true;

        // 如果节点有子节点，并且当前级别小于最大级别，则继续遍历下一级
        if (node.treeSourceNodeChildren && Array.isArray(node.treeSourceNodeChildren) && level < maxLevel) {
            node.treeSourceNodeChildren.forEach(child => traverse(child, level + 1));
        }
    }

    if (Array.isArray(treeData)) {
        treeData.forEach(node => traverse(node, 0));
    } else {
        traverse(treeData, 0);
    }

    return treeData;
}
