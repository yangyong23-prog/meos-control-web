<template>
    <div class="left-tree">
        <div class="left-tree-keyword">
            <m-search
                v-model="keyword"
                :placeholder="publicAreaVisible ? i18n.global.t('meos_control_web.search_building_floor_module') : i18n.global.t('meos_control_web.search_control_module')"
            />
        </div>
        <m-scrollbar height="calc(100% - 38px)">
            <div class="tree-container">
                <m-tree v-model="treeIds" :data="treeData" searchable search-as-tree :filter-value="keyword" @node-click="nodeClick">
                    <template #rowSuffix="node">
                        <span v-if="getSelectedNumber(node)" class="fw500 fs12" style="color: var(--gray-500)"
                            >{{ i18n.global.t('meos_control_web.selected') }}{{ node.selectedNum }}</span
                        >
                    </template>
                </m-tree>
            </div>
        </m-scrollbar>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { uniqBy } from 'lodash';
import {
    getLoopListByFloorIdKey,
    moduleIdsKey,
    getAllLoopListKey,
    activeLoopListKey,
    getLoopListByModuleIdKey,
    getModuleListByFloorIdKey,
    viewSelectKey,
    activeTreeNodeKey,
    moduleListMapKey
} from '../../hooks/useAddGroupHook';
import { publicAreaVisibleKey } from '../../hooks/useGlobalData';
import baseStore from '@/store/baseStore';
const props = defineProps({
    gridData: {
        type: Array,
        default: () => []
    },
    maxHeight: {
        type: String,
        default: ''
    }
});
const keyword = ref('');
const treeIds = inject(moduleIdsKey, ref([]));
const treeData = ref([]);
const viewSelect = inject(viewSelectKey);
const getLoopListByFloorId = inject(getLoopListByFloorIdKey);
const getModuleListByFloorId = inject(getModuleListByFloorIdKey);
const getLoopListByModuleId = inject(getLoopListByModuleIdKey);
const getAllLoopList = inject(getAllLoopListKey);
const activeLoopList = inject(activeLoopListKey, ref([]));
const originalTreeData = ref([]);
const activeTreeNode = inject(activeTreeNodeKey);
const publicAreaVisible = inject(publicAreaVisibleKey);
const moduleListMap = inject(moduleListMapKey);

const nodeClick = node => {
    let loops = [];
    if (node.type === 'PROJECT') {
        loops = getAllLoopList();
    }
    if (node.type === 'BUILDING') {
        node.children.forEach(floor => {
            loops = [...loops, ...getLoopListByFloorId(floor.id)];
        });
    }
    if (node.type === 'FLOOR') {
        loops = getLoopListByFloorId(node.id);
    }
    if (node.type === 'CIRCUIT') {
        loops = getLoopListByModuleId(node.id);
    }
    activeLoopList.value = loops;
    activeTreeNode.value = node;
};
/**
 * 构建树形结构数据
 *
 * 功能说明：
 * 1. 创建一个包含项目节点的初始树结构
 * 2. 遍历props.gridData中的每个建筑数据，构建建筑-楼层-模块的三级树形结构
 * 3. 使用getLoopListByFloorId和getModuleListByLoopId获取楼层和模块数据
 * 4. 对模块数据进行去重处理
 * 5. 最终将构建好的树形数据赋值给treeData响应式变量
 *
 * 数据结构说明：
 * - 顶层为项目节点
 * - 二级节点为建筑节点
 * - 三级节点为楼层节点
 * - 四级节点为模块节点
 */
const setTreeData = isNotPublicArea => {
    activeTreeNode.value = { id: baseStore().projectId, name: i18n.global.t('meos_control_web.project'), type: 'PROJECT' };
    // 初始化树结构，包含一个项目根节点
    const project = {
        ...activeTreeNode.value,
        selectedNum: 0,
        children: []
    };

    const arr = [project];

    // 遍历gridData中的每个建筑数据，构建树形结构
    props.gridData.forEach(item => {
        // 构建建筑节点及其楼层子节点
        const build = {
            id: item.id,
            name: item.name,
            type: 'BUILDING',
            open: props.gridData.length === 1, // 如果只有一个建筑，则默认展开
            selectedNum: 0,
            children: item.floors.map(v => {
                // 构建楼层节点
                const floor = {
                    id: v.id,
                    name: v.localName,
                    type: 'FLOOR',
                    selectedNum: 0,
                    children: []
                };

                // 获取该楼层下的所有回路，并收集所有模块
                let modules = getModuleListByFloorId(floor.id, true);

                // 对模块进行去重处理
                modules = uniqBy(modules, 'id');

                // 构建模块子节点
                floor.children = modules.map(module => {
                    return {
                        id: module.id,
                        name: module.localName,
                        type: 'CIRCUIT',
                        ...module
                    };
                });
                floor.children = floor.children.sort((a, b) =>
                    a.name?.localeCompare(b.name, 'zh', {
                        numeric: true,
                        sensitivity: 'base'
                    })
                );
                return floor;
            })
        };
        arr.push(build);
    });

    if (!props.gridData?.length && isNotPublicArea) {
        const allModuleList = [...moduleListMap.value.values()]
            .map(module => {
                return {
                    id: module.id,
                    name: module.localName,
                    type: 'CIRCUIT',
                    ...module
                };
            })
            .toSorted((a, b) =>
                a.name?.localeCompare(b.name, 'zh', {
                    numeric: true,
                    sensitivity: 'base'
                })
            );
        allModuleList.forEach(module => {
            arr.push(module);
        });
    }

    // 将构建好的树形数据赋值给响应式变量
    treeData.value = arr;
    originalTreeData.value = structuredClone(arr);
    filterViewSelect();
};
const getSelectedNumber = (node, type) => {
    let loops = [];
    if (node.type === 'PROJECT') {
        loops = getAllLoopList();
    }
    if (node.type === 'BUILDING') {
        node.children.forEach(floor => {
            loops = [...loops, ...getLoopListByFloorId(floor.id)];
        });
    }
    if (node.type === 'FLOOR') {
        loops = getLoopListByFloorId(node.id);
    }
    if (!publicAreaVisible.value) {
        if (node.type === 'CIRCUIT') {
            loops = [...moduleListMap.value.values()].filter(cur => cur?.id === node.id);
        }
    }

    loops = loops?.filter(loop => loop.isSelected) || [];
    loops = uniqBy(loops, 'id');
    const number = loops?.length || 0;
    node.selectedNum = number;
    return number;
};
const filterViewSelect = () => {
    if (viewSelect.value === 'uncheck') {
        treeData.value = structuredClone(originalTreeData.value);
        return;
    }
    let arr = structuredClone(treeData.value);
    arr.map(item => {
        item?.children?.map(floor => {
            getSelectedNumber(floor);
        });
        getSelectedNumber(item);
    });
    if (publicAreaVisible.value) {
        arr = arr.filter(item => item.selectedNum);
    }

    arr.forEach(item => {
        item.open = true; // 展开所有建筑节点
        if (!item?.children) {
            return;
        }
        item.children.forEach(v => {
            delete v.parent;
            console.log(getLoopListByFloorId(v.id));

            v.children.forEach(mo => {
                delete mo.parent;
            });
        });
        item.children = item.children.filter(floor => floor.selectedNum);
        item.children.forEach(floor => {
            floor.children.forEach(module => {
                const loops = getLoopListByModuleId(module.id);
                module.hasSelectedLoop = loops.some(loop => loop.isSelected);
            });
            floor.children = floor.children.filter(module => module.hasSelectedLoop);
        });
    });
    treeData.value = arr;
};
const treeheight = computed(() => {
    return `calc(${props.maxHeight} - 136px)`;
});
watch(
    () => props.gridData,
    val => {
        if (val.length) {
            setTreeData();
        } else if (!publicAreaVisible.value) {
            setTreeData(true);
        }
    },
    { immediate: true }
);
watch(
    () => viewSelect.value,
    val => {
        if (val) {
            filterViewSelect();
        }
    },
    { immediate: true }
);
</script>
<style lang="less" scoped>
.left-tree {
    flex: 0 0 280px;
    padding: 16px 0;
    height: 100%;
    background-color: var(--gray-50);
    border-right: 1px solid var(--gray-300);
    .left-tree-keyword {
        padding: 0 16px;
        margin-bottom: 8px;
        & > div {
            width: 100%;
        }
    }
    .tree-container {
        width: 280px;
        padding: 0 12px;
        min-height: v-bind(treeheight);

        :deep(.m-tree) {
            width: 256px;
        }
    }

    :deep(.m-scrollbar .m-scrollbar__bar.is-horizontal) {
        height: 6px;
    }
}
</style>
