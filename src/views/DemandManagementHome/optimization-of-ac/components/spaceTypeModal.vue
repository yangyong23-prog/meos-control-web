<template>
    <m-modal
        v-model:visible="showSpaceType"
        :append-to="$modalAppendTo"
        :escable="false"
        type="default"
        modal-class-name="space-funcType-modal"
        :content-class-name="'space-funcType-content-modal'"
        :title="name"
        width="420"
        height="500"
        @close="close"
    >
        <template #content>
            <div v-if="spaceDataTree.length" class="content-container">
                <m-input
                    v-model="keyword"
                    :clearable="true"
                    prefix-icon="IconMeriActionSearch"
                    class="search-input"
                    :width="388"
                    :placeholder="i18n.global.t('meos_control_web.search')"
                >
                </m-input>

                <m-scrollbar max-height="430px">
                    <m-tree
                        ref="treeRef"
                        v-model="temporarily"
                        :search-as-tree="true"
                        :data="spaceDataTree"
                        multiple
                        check-strictly
                        last-stage
                        class="tree-container"
                        :filter-node-method="filterNodeMethod"
                        :filter-value="keyword"
                        @change="architectureTreeChange"
                    >
                    </m-tree>
                </m-scrollbar>
            </div>
            <div v-else-if="spaceDataTree.length === 0 && !modalLoading" class="no-data">
                <m-illustration :title="i18n.global.t('meos_control_web.no_configurable_content')" type="noContent" content=""> </m-illustration>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-tips theme="darkTransparent" :disabled="!modalLoading" :content="i18n.global.t('meos_control_web.loading_please_wait_alt')" placement="top">
                <m-button type="primary" :disabled="modalLoading" @click.stop="sureArchitecture">{{ i18n.global.t('common.confirm') }}</m-button>
            </m-tips>
        </template>
    </m-modal>
</template>
<script setup>
import { $Message, MLoading } from 'meri-plus';
import { getTreeSpaceRoomFuncTypes } from '@/apis/DemandManagementHomeNew';
import { filterTree, findMatchingNodes, filterTreeFuc } from '@/utils/viewUtils';
import { filterTreeByLeafIds, handleTreeNodeOpen } from '@/utils/index';
import { leftTreeListKey, leftTreeRemoveCurrentIdsKey } from '../../hooks/useAcCommon';
import useStore from '@/store';
import i18n from '@/localization';

const leftTreeList = inject(leftTreeListKey);
const leftTreeRemoveCurrentIds = inject(leftTreeRemoveCurrentIdsKey);
const showSpaceType = ref(false);
const nameArr = ref([]);
const treeRef = ref(null);
const isFound = ref(false);
const temporarily = ref([]);
const modalLoading = ref(false);
const props = defineProps({
    name: {
        type: String,
        default: i18n.global.t('meos_control_web.select_object_space_type')
    },
    ids: {
        type: Array,
        default: () => []
    },
    type: {
        type: String,
        default: ''
    }
});
const { base } = useStore();
const { projectId, projectName } = base;
const spaceDataTree = ref([]);
const emits = defineEmits(['close', 'nameObjFun']);
const keyword = ref('');
const highlight = node => {
    const { funcTypeName = '', name } = node || {};
    const showText = (name || funcTypeName)?.replace(new RegExp(keyword.value, 'g'), `<span>${keyword.value}</span>`);
    return showText;
};
watchEffect(() => {
    temporarily.value = [...props.ids];
});
const close = () => {
    showSpaceType.value = false;
    nextTick(() => {
        emits('close');
    });
};
// const architectureTreeChange = (selectedList, selected) => {
//     nameArr.value = selectedList;
// };
const filterNodeMethod = (node, nodes, searchString) => {
    console.log(node, nodes, searchString);
    const { funcTypeName = '', name } = node || {};
    return (name || funcTypeName)?.includes(searchString);
};
const sureArchitecture = () => {
    if (modalLoading.value) {
        return;
    }
    if (spaceDataTree.value.length === 0) {
        close();
        return;
    }
    if (temporarily.value && temporarily.value.length) {
        // $Message.success({ title: '操作成功' });
        nameArr.value = findMatchingNodes(spaceDataTree.value, temporarily.value);
    }
    if (!nameArr.value?.length) {
        $Message.error({ title: i18n.global.t('meos_control_web.please_select_at_least_one_object') });
        return;
    }
    const obj = {
        arr: nameArr.value,
        type: 'spaceType'
    };
    emits('nameObjFun', obj);
    close();
};

//查询建筑楼层空间树
const getTreeBuildingFloorSpaceFuc = loading => {
    let Mloading = null;
    if (loading) {
        modalLoading.value = true;
        Mloading = MLoading.service({
            target: '.m-modal-main-content',
            fullscreen: false,
            duration: 30000,
            lottieName: 'ball',
            loadIconStyle: {
                width: '100px',
                height: '100px'
            },
            background: 'transparent'
        });
    }
    getTreeSpaceRoomFuncTypes({
        templateType: 'AIRCONDITIONING'
    })
        .then(res => {
            const { data, code } = res;
            if (code === '00000') {
                let cloneData;
                const filteredArray = leftTreeList?.value.filter(item => item.objectType === 'ROOM_FUNC_TYPE');

                if (props.type === 'edit') {
                    const filterIds = filteredArray[0]?.relInstanceIds?.filter(v => !temporarily.value.includes(v)) || [];
                    const cacheTree = filterTreeByLeafIds(data, {
                        leafIds: filterIds,
                        isExclude: true,
                        matchMap: [
                            ['funcType', 'id'],
                            ['funcTypeName', 'name']
                        ],
                        idKey: 'funcType'
                    });

                    cloneData = cacheTree;
                    // cloneData = filterTreeFuc(data, temporarily.value, leftTreeRemoveCurrentIds.value);
                } else {
                    const filterIds = filteredArray[0]?.relInstanceIds || [];
                    // const tempTree = filterTree(data, filteredArray[0]?.relInstanceIds);
                    const cacheTree = filterTreeByLeafIds(data, {
                        leafIds: filterIds,
                        isExclude: true,
                        matchMap: [
                            ['funcType', 'id'],
                            ['funcTypeName', 'name']
                        ],
                        idKey: 'funcType'
                    });
                    cloneData = cacheTree;
                }
                // 添加项目树根节点
                if (Array.isArray(cloneData) && cloneData?.length) {
                    spaceDataTree.value = [
                        {
                            id: projectId || 'projectId',
                            name: projectName || i18n.global.t('meos_control_web.project_name'),
                            children: cloneData,
                            instanceType: 'PROJECT'
                        }
                    ];
                    isFound.value = false;
                    nextTick(() => {
                        if (Array.isArray(treeRef.value?.data)) {
                            // 默认展开层级为1的节点
                            treeRef.value?.data?.forEach(item => {
                                handleTreeNodeOpen(item, { lv: 0 });
                            });
                        }
                    });
                }
            }
            Mloading?.destroy();
            modalLoading.value = false;
        })
        .finally(() => {
            Mloading?.destroy();
            modalLoading.value = false;
        });
};
onMounted(() => {
    showSpaceType.value = true;
});

watch(
    showSpaceType,
    curShow => {
        if (curShow) {
            getTreeBuildingFloorSpaceFuc(true);
        }
    },
    {
        immediate: true
    }
);
</script>
<style lang="less">
.space-funcType-modal {
    .m-tree {
        min-height: 400px;
        padding: 0px;
    }

    .search-input {
        margin-bottom: 4px;
    }

    .space-funcType-content-modal.m-modal-main-content {
        min-height: 400px;
        padding-right: 0px !important;
        padding-left: 16px !important;
        padding-block: 16px !important;
        .tree-container {
            padding-right: 16px;
        }
    }
}
</style>
<style lang="less" scoped>
.highlight {
    width: 270px;
    ::v-deep span {
        color: var(--primary-color);
    }
}

.no-data {
    min-height: 400px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
