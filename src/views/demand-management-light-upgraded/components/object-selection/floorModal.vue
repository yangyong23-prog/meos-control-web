<template>
    <m-modal v-model:visible="showFloor" :append-to="$modalAppendTo" :escable="false" type="default" :title="name" height="400" width="420" @close="close">
        <template #content>
            <div v-if="floorDataTree.length" :style="{ paddingBottom: '12px' }">
                <m-tree ref="treeRef" v-model="temporarily" :data="floorDataTree" multiple @change="architectureTreeChange"> </m-tree>
            </div>
            <div v-else-if="floorDataTree.length === 0 && !modalLoading" class="no-data">
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
import { MLoading, $Message } from 'meri-plus';
import { getTreeBuildingFloorSpace } from '@/apis/DemandManagementHomeNew';
import { filterTree, findMatchingNodes, filterTreeFuc } from '@/utils/viewUtils';
import { handleTreeNodeOpen } from '@/utils/index';
import { getLoopTreeIds } from '../../utils/index';
import { curMenuIdKey, globalLoopListKey } from '../../hooks/useGlobalData';
import { leftTreeListKey, leftTreeRemoveCurrentIdsKey } from '../../hooks/useConfigCommonHook';
import { OBJECT_SELECT_TYPE } from '../../constant/index';
import useStore from '@/store';
import i18n from '@/localization';

const globalLoopList = inject(globalLoopListKey);
const templateType = inject(curMenuIdKey);
const leftTreeList = inject(leftTreeListKey);
const leftTreeRemoveCurrentIds = inject(leftTreeRemoveCurrentIdsKey);
const showFloor = ref(false);
const nameArr = ref([]);
const temporarily = ref([]);
const props = defineProps({
    name: {
        type: String,
        default: i18n.global.t('meos_control_web.select_object_floor')
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

const treeRef = ref();
const floorDataTree = ref([]);
const modalLoading = ref(false);
const listData = ref([]);
const emits = defineEmits(['close', 'nameObjFun']);
watchEffect(() => {
    temporarily.value = [...props.ids];
});
const close = () => {
    showFloor.value = false;
    nextTick(() => {
        emits('close');
    });
};

const sureArchitecture = () => {
    if (modalLoading.value) {
        return;
    }
    if (floorDataTree.value.length === 0) {
        close();
        return;
    }

    if (temporarily.value && temporarily.value.length) {
        nameArr.value = findMatchingNodes(floorDataTree.value, temporarily.value);
    }
    if (!nameArr.value?.length) {
        $Message.error({ title: i18n.global.t('meos_control_web.please_select_at_least_one_object') });
        return;
    }
    console.log(nameArr.value, floorDataTree.value);
    const obj = {
        arr: nameArr.value,
        listData: listData.value,
        floorDataTree: floorDataTree.value,
        type: 'floor'
    };
    emits('nameObjFun', obj);
    close();
};
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
    getTreeBuildingFloorSpace({
        templateType: templateType.value,
        querySpace: false
    })
        .then(res => {
            const { code } = res;
            // 过滤仅回路服务空间的建筑、楼层
            const { buildingIds, floorIds } = getLoopTreeIds(globalLoopList.value);
            let cloneResData = res?.data?.filter(item => buildingIds.includes(item.id));
            cloneResData.forEach(building => {
                building.children = building.children.filter(floor => floorIds.includes(floor.id));
            });

            if (code === '00000') {
                listData.value = cloneResData;
                let cloneData;
                if (props.type === 'edit') {
                    cloneData = filterTreeFuc(cloneResData, temporarily.value, leftTreeRemoveCurrentIds.value);
                } else {
                    const filteredArray = leftTreeList.value?.filter(item => item.objectType === OBJECT_SELECT_TYPE.FLOOR) || [];
                    cloneData = filterTree(cloneResData, filteredArray?.[0]?.relInstanceIds || []);
                    // 去除无children的建筑
                    cloneData = cloneData.filter(v => v?.children?.length);
                }
                // 添加项目树根节点
                if (Array.isArray(cloneData) && cloneData?.length) {
                    floorDataTree.value = [
                        {
                            id: projectId || 'projectId',
                            name: projectName || i18n.global.t('meos_control_web.project_name'),
                            children: cloneData,
                            instanceType: 'PROJECT',
                            open: true
                        }
                    ];
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
    showFloor.value = true;
    getTreeBuildingFloorSpaceFuc(true);
});
</script>
<style lang="css" scoped>
.no-data {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
