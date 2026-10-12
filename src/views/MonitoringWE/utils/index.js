// @ts-ignore
import i18n from '@/localization';

/**
 * 创建一个延迟执行函数，用于在值变化时延迟执行回调
 * 适用于需要区分"切换值"和"真正清空"的场景
 * @param {Function} checkFn - 检查函数，接收 (newVal, oldVal) 参数，返回 true 表示需要执行回调
 * @param {Function} callback - 延迟后执行的回调函数，可以接收一个获取当前值的函数
 * @param {number} delay - 延迟时间（毫秒），默认 100ms
 * @param {Function} getCurrentValue - 获取当前值的函数，用于延迟后检查最新值
 * @returns {Function} 返回一个函数，接收 (newVal, oldVal) 参数
 */
export const createDelayedCallback = (checkFn, callback, delay = 100, getCurrentValue = null) => {
    let timer = null;

    return (newVal, oldVal) => {
        // 清除之前的定时器
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        // 如果满足条件，延迟执行回调
        if (checkFn(newVal, oldVal)) {
            timer = setTimeout(() => {
                // 延迟后再次检查，如果提供了 getCurrentValue，使用最新值检查
                const currentVal = getCurrentValue ? getCurrentValue() : newVal;
                if (checkFn(currentVal, oldVal)) {
                    callback();
                }
                timer = null;
            }, delay);
        }
    };
};

export const findIdsByTree = (root, idMapEquip) => {
    const arr = [];
    const deal = node => {
        if (!node) {
            return;
        }
        const { id, classCode, localName } = node;
        arr.push(id);
        idMapEquip[id] = { id, classCode, localName };
        node.children?.forEach(c => {
            deal(c);
        });
    };
    deal(root);
    return arr;
};

export const makeClassIds = (ids, idMapObj, systemObj) => {
    const classMapIds = {};
    ids?.forEach(id => {
        const obj = idMapObj[id];
        if (obj) {
            if (!classMapIds[obj.classCode]) {
                classMapIds[obj.classCode] = [];
            }
            classMapIds[obj.classCode].push(id);
        }
    });
    // 包括系统ID
    classMapIds[systemObj?.classCode] = [systemObj?.systemId];
    return classMapIds;
};

// 剪枝
export const pruneTreeByTargetNode = (root, targetNodeId) => {
    if (!root || !targetNodeId) {
        return;
    }

    let nodes = [],
        newTree = root;

    const deal = (node, parent, isBack = false) => {
        // isBack=true 向上回溯
        if (isBack) {
            let newNode = node;
            if (parent?.children?.some(obj => node.id === obj.id)) {
                newNode = { ...parent, children: [node] };
                newTree = newNode;
            }
            if (nodes?.length > 0) {
                deal(newNode, nodes.pop(), true);
            }
        } else {
            // 向下遍历树到目标节点为止
            if (node.id !== targetNodeId) {
                nodes.push(node);
                node?.children?.forEach(c => {
                    deal(c, node);
                });
            } else {
                if (nodes?.length > 0) {
                    newTree = node;
                    deal(node, parent, true);
                }
            }
        }
    };
    deal(root);
    return newTree;
};

// 给树数据上附加tags数据
export const addOnTreeTags = (root, idMapEquip) => {
    if (!root || !idMapEquip) {
        return;
    }
    const deal = node => {
        if (idMapEquip[node.id]) {
            node.tags = idMapEquip[node.id].tags;
        }
        node?.children?.forEach(c => {
            deal(c);
        });
    };
    deal(root);
};

export const collectSubTreeNodeIds = root => {
    const idMap = {};

    const traverse = node => {
        let ids = [];
        if (node?.children?.length > 0) {
            for (const child of node.children) {
                ids = ids.concat(traverse(child));
                ids.push(child.id);
            }
        }

        idMap[node.id] = ids; // 记录结果
        return ids;
    };

    traverse(root);
    console.log('idMap: ', idMap);
    return idMap;
};
