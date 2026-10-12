<template>
    <div class="tree-graph-main-wrap">
        <div
            id="container"
            ref="treeGraphDom"
            class="graph-container"
        ></div>
    </div>
</template>
<script setup>
// eslint-disable-next-line import/no-extraneous-dependencies
import { PackNodeTreeGraph, NodeEvent, CanvasEvent } from '@yushu/tree-graph';
import { pruneTreeByNodeIdKey, staticTreeDataKey, equipDyncInfoListKey, graphUpdatingKey, selectModuleInfoInjectKey } from '../hooks/useCommonConfig';
import { debounce, isEmpty, throttle } from 'lodash';
import { INFO_TAG_DEFINE } from '@/utils/infoTemplate';
import { useResizeObserver } from '@vueuse/core';
import DockSingleton from '@/hooks/responsiveDock';
import { collectSubTreeNodeIds, createDelayedCallback } from '../utils/index';
import i18n from '@/localization';

const { getAbnormalEventsList } = DockSingleton.getInstance();
const emit = defineEmits(['hoverNode', 'selectedNode']);

const nodeSize = [224, 60];
const VIRTUAL_NODE_SIZE = nodeSize; // 先使用一样的值
// 聚合配置常量
const BUNDLE_THRESHOLD = 30; // 子节点数量阈值，超过此数量时进行聚合
const BUNDLE_SIZE = 20; // 每个聚合卡片包含的节点数量

let treeGraph = null,
    resizeObserver = null,
    id2Data = {};
const treeGraphDom = ref({});
const viewportPosition = ref(null);
const selectedNodeId = ref('');
const hoverNodeId = ref('');
const rootNodeId = ref('');
const idMapSubTreeIds = ref();
const pruneTreeByNodeId = inject(pruneTreeByNodeIdKey);
const staticTreeData = inject(staticTreeDataKey);
const equipDyncInfoList = inject(equipDyncInfoListKey);
const graphUpdating = inject(graphUpdatingKey);

// const activeNodeId = ref('');
const selectModuleInfo = inject(selectModuleInfoInjectKey);
// watch(selectModuleInfo, (newVal, oldVal) => {
//     // 更新 active 状态
//     if (activeNodeId.value) {
//         treeGraph?.setElState(activeNodeId.value, 'active', false);
//         activeNodeId.value = '';
//     }
//     if (newVal?.id) {
//         activeNodeId.value = newVal?.id;
//         treeGraph?.setElState(newVal?.id, 'active', true);
//     }
// });

// 创建延迟清空选中状态的函数
const handleDelayedUnselect = createDelayedCallback(
    (newVal, oldVal) => {
        // 当从有值变为 null 时，需要延迟判断
        return oldVal !== null && oldVal !== undefined && !newVal;
    },
    () => {
        // 延迟后执行清空选中状态
        unselectNode();
    },
    100,
    () => selectModuleInfo.value // 获取当前最新值
);

watch(selectModuleInfo, (newVal, oldVal) => {
    // console.log('selectModuleInfo', newVal, oldVal);
    handleDelayedUnselect(newVal, oldVal);
});

watch(staticTreeData, () => {
    if (!isEmpty(staticTreeData.value)) {
        rootNodeId.value = staticTreeData.value.id;
        if (!treeGraph) {
            initTree();
        } else {
            selectedNodeId.value = '';
            selectNode(rootNodeId.value, false, true, { isTopNode: true });
        }
    }
});

watch(viewportPosition, () => {
    emit('hoverNode', {
        ...id2Data[hoverNodeId.value],
        id: hoverNodeId.value,
        center: viewportPosition.value,
        size: [treeGraph.getZoom() * nodeSize[0], treeGraph.getZoom() * nodeSize[1]],
        ...otherInfo
    });
});

watchEffect(() => {
    if (idMapSubTreeIds.value) {
        Object.keys(idMapSubTreeIds.value).forEach(targetId => {
            const ids = idMapSubTreeIds.value[targetId];
            const childHasAbnormal = ids && getAbnormalEventsList(ids)?.length > 0;
            treeGraph.setSubElState(targetId, 'childrenBar', 'childAbnormal', childHasAbnormal);
        });
    }
});

const initTree = async () => {
    const tagStyles = {};
    Object.entries(INFO_TAG_DEFINE.base).forEach(([infoCode, obj]) => {
        Object.entries(obj).forEach(([dataValue, { name, color }]) => {
            tagStyles[infoCode + '-' + dataValue] = { name, bgColor: color };
        });
    });
    // 边配置
    // const edge = {
    //     type: 'polyline',
    //     style: {
    //         radius: 16,
    //         lineWidth: 2,
    //         stroke: '#8B949E',
    //         sourcePort: 'right',
    //         targetPort: 'left',
    //         router: {
    //             type: 'orth',
    //             padding: 30
    //         }
    //     }
    // };
    const options = {
        containerId: 'container',
        animation: { duration: 500 },
        expandCollapsAnimation: { animation: { duration: 300 }, align: true },
        autoResize: false,
        bundleOption: { padding: 12, vGap: 8, hGap: 8, columnNum: 5, cellSize: nodeSize },
        edge: {
            type: 'cubic-horizontal',
            state: {
                visible: {
                    opacity: 1
                }
            },
            style: { opacity: 1 }
        },
        node: {
            style: node => {
                if (node.isVirtual) {
                    return {
                        size: VIRTUAL_NODE_SIZE,
                        cursor: 'default',
                        fill: '#EBF6FF',
                        lineWidth: 1,
                        lineDash: [6, 4],
                        stroke: '#64A6F7'
                    };
                }
                return { size: nodeSize, cursor: 'pointer' };
            },
            state: {
                active: {
                    fill: '#D9EBFF',
                    lineWidth: 1,
                    stroke: '#246FE5',
                    priority: 101
                },
                selected: {
                    fill: '#2481f2'
                }
            },
            tagStyles,
            childrenBarStates: {
                childAbnormal: {
                    collapsed: {
                        stroke: '#ffffff',
                        textColor: '#ffffff',
                        fontWeight: 600,
                        fill: '#ff0000'
                    },
                    priority: 100
                },
                childAbnormalHover: {
                    // textColor: '#ffffff',
                    // stroke: '#ffffff',
                    // fill: '#F8766F',
                    collapsed: {
                        stroke: '#ffffff',
                        textColor: '#ffffff',
                        fontWeight: 600,
                        fill: '#F8766F'
                    },
                    priority: 200
                }
            }
        },
        calcChildCountsFilter: node => {
            return !node.isVirtual;
        }
    };

    const pruneTree = initDataByTreeNode(rootNodeId.value);
    console.log('pruneTree', pruneTree);

    treeGraph = new PackNodeTreeGraph(pruneTree, options);
    _bindEvent();

    graphUpdating.value = false;

    await treeGraph.updateTreeData(pruneTree);
    await selectNode(rootNodeId.value, false);

    const func = throttle(() => {
        const id2DyncInfo = {};
        equipDyncInfoList.value.forEach(({ id, tags }) => {
            id2DyncInfo[id] = tags;
        });
        const nodes = treeGraph.getNodeData();
        nodes.forEach(node => {
            if (node.data?.bundles?.length > 0) {
                node.data?.bundles.forEach(b => {
                    b.tags = id2DyncInfo[b.id];
                });
                treeGraph.updateDrawNode(node.id);
            } else {
                node.tags = id2DyncInfo[node.id];
                treeGraph.updateDrawNode(node.id);
            }
        });
    }, 500);

    watch(equipDyncInfoList, func, { immediate: true });
};

onMounted(() => {
    const func = debounce(() => {
        treeGraph?.resize();
    }, 100);
    resizeObserver = useResizeObserver(treeGraphDom.value, func);
});

onUnmounted(() => {
    resizeObserver.stop();
});

// eslint-disable-next-line one-var
let otherInfo = {};
const hoverBundleNode = node => {
    const handle = () => {
        const getChildrenInfo = ids => {
            return ids.map(id => id2Data[id]);
        };
        otherInfo = {
            childrenInfo: getChildrenInfo(node.children),
            isBundleCard: true
        };
    };
    hoverNode(node.id, handle, true);
};

const initDataByTreeNode = rootNodeId => {
    const pruneTree = pruneTreeByNodeId(rootNodeId);

    // 组装树数据
    _iteratTreeConvert(pruneTree, rootNodeId);

    const idMap = collectSubTreeNodeIds(pruneTree);
    idMapSubTreeIds.value = idMap;

    return pruneTree;
};

const hoverNode = (id, formOtherInfoFn) => {
    if (graphUpdating.value) return;

    treeGraph.setElState(id, 'hover', true);

    if (formOtherInfoFn) {
        formOtherInfoFn();
    }
    viewportPosition.value = treeGraph.getElementViewPortPosition(id);
    hoverNodeId.value = id;
};

const unhoverNode = () => {
    if (graphUpdating.value) return;
    if (hoverNodeId.value) {
        treeGraph.setElState(hoverNodeId.value, 'hover', false);
        hoverNodeId.value = null;
        viewportPosition.value = null;
        otherInfo = {};
    }
};

const selectNode = async (id, emitEvent = true, setDefault = false, options = {}) => {
    if (graphUpdating.value) return;
    if (selectedNodeId.value === id && !setDefault) return;
    // activeNodeId.value = '';
    unhoverNode();
    unselectNode();
    graphUpdating.value = true;
    // 剪枝

    if (options.isTopNode || setDefault) {
        const pruneTree = initDataByTreeNode(id);
        // 更新树数据
        await treeGraph.updateTreeData(pruneTree);
    }
    // 更新节点状态
    treeGraph.setElState(id, 'selected', true);

    // const edges = treeGraph.getEdgeData();
    // const config = {};
    // edges.forEach(edge => {
    //     config[edge.id] = 'visible';
    // });
    // await treeGraph.setElementState(config, true);

    selectedNodeId.value = id;
    graphUpdating.value = false;

    if (emitEvent) {
        emit('selectedNode', {
            id,
            ...id2Data[id]
        });
    }
};

const unselectNode = () => {
    if (graphUpdating.value) return;
    if (selectedNodeId.value) {
        treeGraph.setElState(selectedNodeId.value, 'selected', false);
        selectedNodeId.value = '';
    }
};

const setDefault = async () => {
    await selectNode(rootNodeId.value, false, true);
};

const set1To1Size = () => {
    treeGraph.set1To1Size();
};

const setPostion = async id => {
    await treeGraph.setPosition(id);
};

// 根据设备ID选中节点（支持聚合卡片和常规节点）
const selectNodeByEquipId = async equipId => {
    if (!equipId || !treeGraph) return;
    // 选中节点并居中显示
    await selectNode(equipId, true);
    await setPostion(equipId);
};

const flickerAnimate = id => {
    treeGraph?.flickerAnimate(id);
};

function _convertLocalName(root) {
    id2Data = {};
    const stack = [root];
    while (stack.length) {
        const node = stack.pop();
        if (node) {
            id2Data[root.id] = { ...root };
            root.name = root.localName ?? '--';
            node.children?.forEach(n => {
                id2Data[n.id] = { ...n };
                n.name = n.localName ?? '--';
                stack.push(n);
            });
        }
    }
}

const _iteratTreeConvert = (root, selId) => {
    _convertLocalName(root);
    root.level = 0;
    root.defaultCollapse = false;
    const stack = [root];
    while (stack.length) {
        const node = stack.pop();
        if (node) {
            // 当子节点数量达到阈值时，按指定大小进行聚合
            if (node.children?.length >= BUNDLE_THRESHOLD) {
                const bundleNodes = [];
                const { children } = node;

                // 将子节点按指定大小进行分组
                for (let i = 0; i < children.length; i += BUNDLE_SIZE) {
                    const bundleGroup = children.slice(i, i + BUNDLE_SIZE);
                    const firstNodeName = bundleGroup[0]?.name || bundleGroup[0]?.localName || '--';
                    const bundleNode = {
                        id: `${node.id}-bundle-${Math.floor(i / BUNDLE_SIZE)}`,
                        name: i18n.global.t('meos_control_web.bundle_node_name', {
                            count: bundleGroup.length,
                            name: firstNodeName
                        }),
                        // data: { bundles: bundleGroup },
                        children: bundleGroup,
                        level: node.level + 1,
                        defaultCollapse: true,
                        isVirtual: true
                    };
                    bundleNodes.push(bundleNode);
                }

                delete node.children;
                node.children = bundleNodes;
            } else {
                node.children?.forEach(n => {
                    n.level = node.level + 1;
                    if (selId === rootNodeId.value) {
                        if (n.level === 3) {
                            n.defaultCollapse = true;
                        } else {
                            n.defaultCollapse = false;
                        }
                    } else if (node.id === selId) {
                        n.defaultCollapse = true;
                    } else {
                        n.defaultCollapse = false;
                    }

                    stack.push(n);
                });
            }
        }
    }
};

const _bindEvent = () => {
    treeGraph.on(NodeEvent.ELEMENT_CLICK, evt => {
        // 聚合卡片不支持点击
        if (evt.targetInfo.isVirtual) {
            return;
        }
        const cId = evt.targetInfo.id;
        selectNode(cId);
    });
    treeGraph.on(CanvasEvent.CANVAS_CHANGE, () => {
        if (hoverNodeId.value) {
            viewportPosition.value = treeGraph.getElementViewPortPosition(hoverNodeId.value);
        }
    });
    treeGraph.on(NodeEvent.ELEMENT_HOVER, evt => {
        const cId = evt.targetInfo.id;
        if (evt.targetInfo.isVirtual) {
            hoverBundleNode(evt.targetInfo);
        } else {
            hoverNode(cId);
        }
    });
    treeGraph.on(NodeEvent.ELEMENT_UNHOVER, () => {
        unhoverNode();
    });
    treeGraph.on(NodeEvent.CHILD_BAR_HOVER, evt => {
        const cId = evt?.targetInfo?.id;
        if (cId) {
            if (treeGraph.getSubElState(cId, 'childrenBar', 'childAbnormal')) {
                treeGraph.setSubElState(cId, 'childrenBar', 'childAbnormalHover', true);
            }
        }
    });
    treeGraph.on(NodeEvent.CHILD_BAR_UNHOVER, evt => {
        const cId = evt?.targetInfo?.id;
        if (cId) {
            if (treeGraph.getSubElState(cId, 'childrenBar', 'childAbnormalHover')) {
                treeGraph.setSubElState(cId, 'childrenBar', 'childAbnormalHover', false);
            }
        }
    });

    treeGraph.on(NodeEvent.CHILDREN_NUM_CLICK, evt => {
        const cId = evt.targetInfo.id;
        selectNode(cId);
    });
};

defineExpose({
    hoverNode,
    unhoverNode,
    selectNode,
    unselectNode,
    setDefault,
    setPostion,
    set1To1Size,
    flickerAnimate,
    selectNodeByEquipId
});
</script>

<style lang="less" scoped>
.tree-graph-main-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    .graph-container {
        width: 100%;
        height: 100%;
    }
}
</style>
