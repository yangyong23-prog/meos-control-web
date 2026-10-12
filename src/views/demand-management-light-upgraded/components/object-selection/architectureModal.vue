<template>
    <m-modal v-model:visible="showArchitecture" :append-to="$modalAppendTo" :escable="false" type="default" :title="name" height="200" width="420" @close="close">
        <template #content>
            <div v-if="dataTree.length" class="tree-wrap">
                <m-tree ref="tree" v-model="temporarily" :default-expand-all="true" :data="dataTree" multiple @change="architectureTreeChange"> </m-tree>
            </div>
            <div v-else-if="dataTree.length === 0 && !modalLoading" class="no-data">
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
import { curMenuIdKey, globalLoopListKey } from '../../hooks/useGlobalData';
import { getLoopTreeIds } from '../../utils/index';
import { leftTreeListKey, leftTreeRemoveCurrentIdsKey } from '../../hooks/useConfigCommonHook';
import { OBJECT_SELECT_TYPE } from '../../constant/index';
import useStore from '@/store';
import i18n from '@/localization';

const globalLoopList = inject(globalLoopListKey);
const templateType = inject(curMenuIdKey);
const leftTreeList = inject(leftTreeListKey);
const leftTreeRemoveCurrentIds = inject(leftTreeRemoveCurrentIdsKey);
const showArchitecture = ref(false);
const nameArr = ref([]);
const temporarily = ref([]);
const modalLoading = ref(false);
const props = defineProps({
    name: {
        type: String,
        default: i18n.global.t('meos_control_web.select_object_building')
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
const dataTree = ref([]);
const emits = defineEmits(['close', 'nameObjFun']);
watchEffect(() => {
    temporarily.value = [...props.ids];
});
const close = () => {
    showArchitecture.value = false;
    nextTick(() => {
        emits('close');
    });
};
const sureArchitecture = () => {
    if (modalLoading.value) {
        return;
    }
    if (dataTree.value.length === 0) {
        close();
        return;
    }

    if (temporarily.value && temporarily.value.length) {
        nameArr.value = findMatchingNodes(dataTree.value, temporarily.value);
    }
    if (!nameArr.value?.length) {
        $Message.error({ title: i18n.global.t('meos_control_web.please_select_at_least_one_object') });
        return;
    }
    const obj = {
        arr: nameArr.value,
        type: 'architecture'
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
    getTreeBuildingFloorSpace({
        templateType: templateType.value,
        queryFloor: false,
        querySpace: false
    })
        .then(res => {
            const { code } = res;
            // 过滤仅回路服务空间的建筑
            const { buildingIds } = getLoopTreeIds(globalLoopList.value);
            const data = res?.data?.filter(item => buildingIds.includes(item.id));
            if (code === '00000') {
                let cloneData;
                //新增过滤掉左侧存在的数据  编辑过滤除选中以外的数据
                if (props.type === 'edit') {
                    cloneData = filterTreeFuc(data, temporarily.value, leftTreeRemoveCurrentIds.value);
                } else {
                    const filteredArray = leftTreeList.value?.filter(item => item.objectType === OBJECT_SELECT_TYPE.BUILDING) || [];
                    cloneData = filterTree(data, filteredArray?.[0]?.relInstanceIds || []);
                }
                // 添加项目树根节点
                if (Array.isArray(cloneData) && cloneData?.length) {
                    dataTree.value = [
                        {
                            id: projectId || 'projectId',
                            name: projectName || i18n.global.t('meos_control_web.project_name'),
                            children: cloneData,
                            instanceType: 'PROJECT',
                            open: true
                        }
                    ];
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
    showArchitecture.value = true;
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
.tree-wrap {
    padding-bottom: 12px;
}
</style>
