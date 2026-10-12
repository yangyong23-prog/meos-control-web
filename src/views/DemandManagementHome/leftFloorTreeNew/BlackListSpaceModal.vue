<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="default"
        modal-class-name="black-list-space-modal"
        :width="1260"
        :height="770"
        :max-height="658"
        :title="i18n.global.t('meos_control_web.space_scope_config')"
        :footer="false"
        @close="close"
    >
        <template #content>
            <div ref="filterRef" class="filter-container">
                <m-tree-select
                    v-model="notColdHeatModel"
                    :size="320"
                    :max-scroll-height="362"
                    :data="notColdHeatOptions"
                    multiple
                    searchable
                    virtual
                    :height="362"
                    panel-searchable
                    :teleport="filterRef"
                    :placeholder="i18n.global.t('meos_control_web.un_selected')"
                    :prefix="i18n.global.t('meos_control_web.spaces_not_served_by_cold_heat_source')"
                    @change="val => handleFilter(val, hasTempIotModel, spaceTypeModel)"
                >
                </m-tree-select>
                <m-select
                    v-model="hasTempIotModel"
                    :size="342"
                    :options="hasTempIotOptions"
                    :max-scroll-height="362"
                    :placeholder="i18n.global.t('meos_control_web.un_selected')"
                    :prefix="i18n.global.t('meos_control_web.has_temp_iot_monitoring')"
                    @change="val => handleFilter(notColdHeatModel, val, spaceTypeModel)"
                ></m-select>
                <m-select
                    v-model="spaceTypeModel"
                    :size="237"
                    :max-scroll-height="362"
                    :options="spaceTypeOptions"
                    searchable
                    :placeholder="i18n.global.t('meos_control_web.un_selected')"
                    :panel-search-placeholder="i18n.global.t('common.placeholder_input')"
                    multiple
                    panel-searchable
                    clearable
                    :prefix="i18n.global.t('meos_control_web.space_type_colon')"
                    @change="val => handleFilter(notColdHeatModel, hasTempIotModel, val)"
                >
                </m-select>
            </div>
            <div class="transfer-container">
                <m-transfer ref="transferTreeInstance" v-model="transferTreeData.selectedIds" :data="transferTreeData.treeData" virtual :props="{ label: 'localName' }">
                    <template #nodeSuffix="node">
                        <template v-for="(item, i) in tags" :key="i">
                            <m-tag
                                v-if="item?.show(node, { notColdHeatModel, hasTempIotModel, spaceTypeModel })"
                                size="small"
                                :color="item?.color"
                                :bg-color="item?.bg"
                                :style="{ marginLeft: '8px' }"
                                >{{ item.txt(node, { notColdHeatModel, hasTempIotModel, spaceTypeModel }) }}
                            </m-tag>
                        </template>
                    </template>
                    <template #selectedCount>
                        <div class="selected-count-row">
                            <span>{{ i18n.global.t('meos_control_web.already_selected') }}</span>
                            <span>{{ ` (${transferTreeData.selectedIds.filter(v => v[0] === 'S').length})` }}</span>
                        </div>
                        <div class="selected-tips">{{ i18n.global.t('meos_control_web.selected_space_excluded_from_control') }}</div>
                    </template>
                </m-transfer>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import { useElementVisibility } from '@vueuse/core';
import emitter from '@/utils/bus';
import { addInstanceConfig } from '@/apis/DemandManagementHome';
import { getColdHeatSystemTree } from '@/apis/DemandManagementHomeNew';
import useMessage from '@/components/hooks/useMessage';
import { debounce } from 'lodash';
import { blackListSpaceIdsInjectKey, blackListInitTreeDataInjectKey, blackListSpaceTypeListInjectKey } from '../constant/injectKey';
import i18n from '@/localization';

const { useSuccessMessage } = useMessage();

const templateType = inject('templateType');
const blackListSpaceIds = inject(blackListSpaceIdsInjectKey);
const initStaticTree = inject(blackListInitTreeDataInjectKey);
const blackListSpaceTypeList = inject(blackListSpaceTypeListInjectKey);

const filterRef = ref(null);
const transferTreeInstance = ref(null);
const targetIsVisible = useElementVisibility(transferTreeInstance);

const tags = [
    {
        show: (node, config) => {
            const curFunType = tempCacheData.allSpaces.find(v => v?.id === node?.id)?.roomFuncType;

            const isCurSelectFunType = config.spaceTypeModel.includes(curFunType);

            return isCurSelectFunType;
        },
        txt: node => {
            const curFunType = tempCacheData.allSpaces.find(v => v?.id === node?.id)?.roomFuncType;
            const curFunName = tempCacheData.allSpaceTypes.find(v => v?.id === curFunType)?.name;
            return curFunName;
        },
        color: '#1B2129',
        bg: '#E8ECF0'
    },
    {
        show: (node, config) => {
            if (config.hasTempIotModel === 'all') {
                return false;
            }
            const hasFilter = config.hasTempIotModel === 'hasIot' ? tempCacheData.hasIot.includes(node?.id) : tempCacheData.noIot.includes(node?.id);
            return hasFilter;
        },
        txt: (node, config) => {
            if (config.hasTempIotModel === 'all') {
                return '';
            }
            return config.hasTempIotModel === 'hasIot' ? i18n.global.t('meos_control_web.has_iot') : i18n.global.t('meos_control_web.no_iot');
        },
        color: '#E68600',
        bg: '#FFF0CC'
    },
    {
        show: (node, config) => {
            const filterSystemIds = config.notColdHeatModel;
            const nodeItem = tempCacheData.allSpaces.find(v => v?.id === node?.id);

            if (nodeItem?.objType !== 'space' || !filterSystemIds?.length) {
                return false;
            }

            if (nodeItem?.serviceColdHeatSystemIds?.length) {
                // TODO 反向过滤
                const hasService = filterSystemIds?.some(v => nodeItem?.serviceColdHeatSystemIds?.includes(v));
                return !hasService;
            }
            return true;
        },
        txt: () => i18n.global.t('meos_control_web.no_service_relation'),
        color: '#D72824',
        bg: '#FFE6E5'
    }
];

const showModal = defineModel({ type: Boolean, default: false });

let transferTreeData = reactive({
        treeData: [],
        selectedIds: []
    }),
    tempCacheData = {
        allTreeSelect: [],
        allColdHeat: [],
        allNotColdHeat: [],
        hasIot: [],
        noIot: [],
        allSpaceTypes: [],
        allSpaces: []
    };
const notColdHeatModel = ref([]);
const notColdHeatOptions = ref([]);
const hasTempIotModel = ref('all');
const hasTempIotOptions = ref([
    { id: 'all', name: i18n.global.t('common.all') },
    { id: 'hasIot', name: i18n.global.t('meos_control_web.has_iot_monitoring') },
    { id: 'noIot', name: i18n.global.t('meos_control_web.no_iot_monitoring') }
]);
const spaceTypeModel = ref([]);
const spaceTypeOptions = ref([]);

const resetTempCacheData = () => {
    tempCacheData = {
        allTreeSelect: [],
        allColdHeat: [],
        allNotColdHeat: [],
        hasIot: [],
        noIot: [],
        allSpaceTypes: [],
        allSpaces: []
    };
};

const resetFilterData = () => {
    notColdHeatModel.value = [];
    hasTempIotModel.value = 'all';
    spaceTypeModel.value = [];
};

const resetTreeData = () => {
    transferTreeData.treeData = [];
    transferTreeData.selectedIds = [];
};

const resetData = () => {
    resetTempCacheData();
    resetFilterData();
    resetTreeData();
};

const close = () => {
    nextTick(() => {
        showModal.value = false;
    });
};

const handleTreeCheck = (list, blackListIds) => {
    list.forEach((item, index) => {
        // XXX: 组件回显时树节点展开有问题
        // item.open = item?.children?.length && index === 0;
        item.name = item.localName ?? '--';
        const isInBlackList = item.objType === 'space' && blackListIds.includes(item.id);
        item.checked = isInBlackList ? 'checked' : 'uncheck';

        if (isInBlackList) {
            tempCacheData.allTreeSelect.push(item.id);
        }

        if (item.objType === 'space') {
            tempCacheData.allSpaces.push(item);

            if (item?.serviceColdHeatSystemIds?.length) {
                tempCacheData.allColdHeat.push(item.id);
            } else {
                tempCacheData.allNotColdHeat.push(item.id);
            }
            if (item?.existTabIotInfoCodeRule) {
                tempCacheData.hasIot.push(item.id);
            } else {
                tempCacheData.noIot.push(item.id);
            }
        }

        if (item?.children?.length) {
            item?.children?.sort((a, b) => (b?.floorSequenceID ?? 0) - (a?.floorSequenceID ?? 0));
            handleTreeCheck(item.children, blackListIds);
        }
    });
};

const filterTreeByLeafIds = (tree, leafIds) => {
    // 深拷贝树以避免修改原始数据
    const filterNode = node => {
        // 如果是叶子节点（空间节点）
        if (node.objType === 'space') {
            return leafIds.includes(node.id);
        }

        // 如果有子节点，递归过滤
        if (node.children?.length) {
            const filteredChildren = node.children.map(child => ({ ...child })).filter(child => filterNode(child));

            // 如果过滤后还有子节点，保留该节点
            if (filteredChildren.length) {
                node.children = filteredChildren;
                return true;
            }
        }

        return false;
    };

    return tree.map(node => ({ ...node })).filter(node => filterNode(node));
};

const finalFilterSpaceIds = (a, b, c) => {
    const allSpaceIds = tempCacheData.allSpaces.map(v => v.id);

    // 获取非冷热源系统服务的空间IDs
    const aFilterSpaceIds = a?.length
        ? tempCacheData.allSpaces
              .filter(space => {
                  const { serviceColdHeatSystemIds = [] } = space || {};
                  const hasService = a?.some(v => serviceColdHeatSystemIds?.includes(v));
                  return !hasService;
              })
              ?.map(v => v?.id)
        : allSpaceIds;

    // 获取IOT监测状态筛选的空间IDs
    const bFilterSpaceIds = b === 'all' ? allSpaceIds : b === 'hasIot' ? tempCacheData.hasIot : tempCacheData.noIot;

    // 获取空间类型筛选的空间IDs
    const cFilterSpaceIds = c?.length ? tempCacheData.allSpaces.filter(v => c?.includes(v?.roomFuncType))?.map(v => v?.id) : allSpaceIds;

    // 计算三个筛选条件的交集
    return aFilterSpaceIds.filter(id => bFilterSpaceIds.includes(id) && cFilterSpaceIds.includes(id));
};

// 初始化非冷热源系统服务的实例树
const handleColdHeatTreeInit = list => {
    if (!list?.length) {
        return;
    }
    const tempData = list.map(v => {
        const instances = v?.systems?.map(instance => ({ id: instance?.id, name: instance?.localName ?? '--' }));
        return { id: v?.classCode, name: v?.classCodeName, children: instances };
    });
    notColdHeatOptions.value = tempData;
};

const handleSpaceTypeInit = () => {
    const finalData = blackListSpaceTypeList.value;
    if (finalData?.length) {
        spaceTypeOptions.value = finalData;
        tempCacheData.allSpaceTypes = finalData;
    }
};

const handleTreeInit = (list, blackListIds = []) => {
    const tempBlackListIds = [...blackListIds];
    if (list?.length) {
        resetTempCacheData();
        handleTreeCheck(list, tempBlackListIds);

        // handleColdHeatTreeInit(list);

        handleSpaceTypeInit();

        nextTick(() => {
            // HACK：同时设置值，否则渲染不上
            transferTreeData.treeData = list;
            transferTreeData.selectedIds = tempCacheData.allTreeSelect;
            // console.log('targetIsVisible', targetIsVisible.value);
        });
    }
};

onMounted(() => {
    getColdHeatSystemTree({
        withColumns: ['id', 'localName', 'classCode']
    }).then(res => {
        if (res?.code === '00000') {
            const resData = res?.data;
            handleColdHeatTreeInit(resData);
        }
    });
});

watch(
    [() => showModal.value, () => blackListSpaceIds?.value, () => initStaticTree?.value],
    ([show, curBlack, curTree]) => {
        if (show && curTree?.length) {
            handleTreeInit(curTree, curBlack);
        }
        if (!show || !curTree?.length) {
            resetData();
        }
    },
    {
        immediate: true
    }
);

// 优化后的handleFilter函数
const handleFilter = debounce((a, b, c) => {
    const filterSpaceIds = finalFilterSpaceIds(a, b, c);

    // 使用requestIdleCallback在浏览器空闲时更新树
    const updateTree = () => {
        console.time('getFilterTree');
        const filteredTree = filterTreeByLeafIds(initStaticTree.value, filterSpaceIds);
        console.timeEnd('getFilterTree');
        transferTreeData.treeData = filteredTree;
        // 不清空过滤之前选中的节点，左侧树选中和右侧展示的数据不是双向绑定的关系
        // nextTick(() => {
        //     transferTreeData.selectedIds = transferTreeData.selectedIds.filter(id => filterSpaceIds.includes(id));
        // });
    };

    // 兼容性处理
    if (window.requestIdleCallback) {
        requestIdleCallback(() => updateTree(), { timeout: 1000 });
    } else {
        setTimeout(updateTree, 0);
    }
}, 1000);

const confirm = async () => {
    const preSelectedIds = tempCacheData.allTreeSelect;
    const inBlackListIds = transferTreeData.selectedIds;
    const notInBlackListIds = preSelectedIds?.filter(id => !inBlackListIds?.includes(id));

    let requestArr = [],
        floorIds = [];
    if (inBlackListIds?.length) {
        const tempIds = tempCacheData.allSpaces.filter(v => inBlackListIds?.includes(v?.id))?.map(v => v.floorId) || [];
        floorIds = [...floorIds, ...tempIds];
        requestArr.push(
            addInstanceConfig({
                templateType: templateType.value,
                instanceType: 'SPACE',
                instanceIds: inBlackListIds,
                config: { inBlacklisted: true }
            })
        );
    }
    if (notInBlackListIds?.length) {
        const tempIds = tempCacheData.allSpaces.filter(v => notInBlackListIds?.includes(v?.id))?.map(v => v.floorId) || [];
        floorIds = [...floorIds, ...tempIds];
        requestArr.push(
            addInstanceConfig({
                templateType: templateType.value,
                instanceType: 'SPACE',
                instanceIds: notInBlackListIds,
                config: { inBlacklisted: false }
            })
        );
    }
    floorIds = [...new Set(floorIds)];

    Promise.all(requestArr).then(([res1, res2]) => {
        if (res1?.data || res2?.data) {
            useSuccessMessage(i18n.global.t('common.operation_success'));
            close();
            const treeNodeConfig = { cancelSelectTreeNode: true };
            emitter.emit('updateShieldAndBlackList', { floorIds, treeNodeConfig });
        }
    });
};
</script>
<style lang="less">
.black-list-space-modal.m-modal-bg {
    .m-modal-main .m-modal-main-content {
        padding: 0;
    }

    .m-modal-main .m-main-handle {
        padding-block: 12px;
    }

    .m-main-handle-line {
        border-top: 1px solid @grey-200;
    }
}
</style>
<style lang="less" scoped>
.loading-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
    position: relative;
}
.filter-container {
    display: flex;
    align-items: center;
    column-gap: 8px;

    padding: 12px 24px;

    :deep(.m-select-placeholder) {
        color: @grey-900;
    }

    // border-bottom: 1px solid @grey-200;
}

.transfer-container {
    width: 100%;
    height: 602px;

    :deep(.m-transfer) {
        width: 100%;
        height: 100%;

        .m-transfer-main {
            height: 100%;
            border-left: none;
            border-right: none;
            border-bottom: none;
            border-radius: 0px;
            border-top: 1px solid @grey-200;

            .m-transfer-right {
                border-right: none;
                border-top: none;
                padding: 12px 16px 12px 12px;
                background-color: @grey-50;

                .m-transfer-right-header {
                    padding: 0;
                    padding-left: 12px;
                    height: 42px;
                    border-bottom: none;
                    position: relative;
                    align-items: flex-start;

                    .m-button {
                        position: absolute;
                        top: -5px;
                        right: 0;
                    }
                }

                .m-transfer-right-header-text {
                    color: @grey-800;
                    font-size: 14px;
                    font-weight: 700;
                    position: relative;
                }

                .m-transfer-selected-body {
                    padding-inline: 0px;

                    .m-transfer-selected-item {
                        padding-inline: 12px;
                    }
                }
            }
        }

        .m-transfer-left {
            border-left: none;
            border-top: none;
            padding: 12px 16px 12px 24px;
            border-right: 1px solid @grey-200;
        }

        .m-transfer-left-input {
            padding: 0;
            height: 32px;
            display: none;
        }
    }
}

.selected-count-row {
    color: @grey-800;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}

.selected-tips {
    color: @grey-600;
    font-size: 12px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    margin-top: 4px;
}

:deep(.m-tree-node__content) {
    .suffix {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
    }
}
</style>
