<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="default"
        :title="props.title"
        :width="420"
        :height="560"
        :auto-close="false"
        @close="closeModal"
        @cancel="closeModal"
        @submit="submitModal"
    >
        <template #content>
            <div class="all-content">
                <div v-show="isLoading" class="loading-container"></div>
                <Empty v-if="!isLoading && !loadedData?.length" class="empty-custom-container" :text="i18n.global.t('meos_control_web.no_energy_consumption_model')" />
                <div v-show="!isLoading && loadedData?.length">
                    <m-select v-model="selectModelId" :size="372" :options="listOptions" :style="{ marginBottom: '8px' }"> </m-select>
                    <div v-show="isLoadingSub" class="loading-sub-container"></div>
                    <m-tree
                        v-show="!isLoadingSub"
                        v-model="treeSelected"
                        :data="treeData"
                        :props="{ label: 'itemName', children: 'treeSourceNodeChildren' }"
                        multiple
                        check-strictly
                    >
                        <template #rowSuffix="node">
                            <m-tips :disabled="!node?.disabled" :content="i18n.global.t('meos_control_web.only_same_first_level_item_selection_allowed')" theme="darkTransparent">
                                <div v-if="node?.disabled" class="row-full-container"></div>
                            </m-tips>
                        </template>
                    </m-tree>
                </div>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import i18n from '@/localization';
import { useFetchAbortController } from '@/hooks/useFetchAbortController';
import { getEnergyModelsOptions, getEnergyModelsSubOptions } from '@/apis/xshellConfiguration';
import useStore from '@/store';
import Empty from '@/components/common/Empty.vue';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { findRootNode, disableRootAndChildren, enableTreeNodes, setOpenAllNodes } from '../../utils/index';
import { $Message } from 'meri-plus';

const props = defineProps({
    title: {
        type: String,
        default: ''
    }
});
const modalValue = defineModel('data', { type: String, default: '' });
const showModal = defineModel('show', { type: Boolean, default: false });
const nodeChecked = defineModel('checked', { type: String, default: 'uncheck' });

const { base } = useStore();

const listOptions = ref([]);
const selectModelId = ref('');
const treeSelected = ref([]);
const firstLevelTreeIds = ref([]);
const selectModelToSubIdsMap = ref(new Map());
const tempModelToSubIdsMap = ref(new Map());

const { startRequest, loadedData, isLoading, startLoading, endLoading } = useFetchAbortController({
    request: getEnergyModelsOptions,
    params: { projectId: base.projectId, userId: 'systemId' },
    initData: []
});
const {
    startRequest: startRequestSub,
    isLoading: isLoadingSub,
    startLoading: startLoadingSub,
    endLoading: endLoadingSub
} = useFetchAbortController({
    request: getEnergyModelsSubOptions,
    params: { energyModelId: '', userId: 'systemId' },
    initData: []
});

const treeData = ref([]);

const closeModal = () => {
    nextTick(() => {
        showModal.value = false;
    });
};

function pickTreeInfo(node) {
    if (!node) return;

    // 只保留指定的属性
    const { checked, id, itemName, itemCode, rwdId, treeSourceNodeChildren } = node;
    const cloneNode = { checked, id, itemName, itemCode, rwdId, ...(treeSourceNodeChildren?.length ? { treeSourceNodeChildren } : {}) };

    // 如果节点有子节点，则继续遍历
    if (cloneNode.treeSourceNodeChildren && Array.isArray(cloneNode.treeSourceNodeChildren)) {
        cloneNode.treeSourceNodeChildren = cloneNode.treeSourceNodeChildren.map(pickTreeInfo);
    }
    return cloneNode;
}

const submitModal = () => {
    let cloneTree = structuredClone(treeData.value);
    if (cloneTree?.length) {
        cloneTree = cloneTree.map(pickTreeInfo).filter(v => !!v);
    }
    const allData = { selectedModelId: selectModelId.value, selectedTreeIds: treeSelected.value, treeData: cloneTree };

    if (nodeChecked.value === 'checked' && !treeSelected.value?.length) {
        $Message.error({ title: `${i18n.global.t('meos_control_web.please_config')}「${props.title}」` });
        return;
    }

    const allDataStr = JSON.stringify(allData);
    console.log('allDataStr', allData);
    modalValue.value = allDataStr;
    $Message.success({ title: i18n.global.t('meos_control_web.configuration_success') });
    closeModal();
};

watch(
    () => showModal.value,
    val => {
        if (val) {
            startRequest();
        }
    }
);

watch(
    () => isLoading.value,
    async cur => {
        if (cur) {
            startLoading?.({ className: '.loading-container' });
        } else {
            await nextTick();
            endLoadingSub?.();
        }
    }
);

watch(
    () => isLoadingSub.value,
    async cur => {
        if (cur) {
            startLoadingSub?.({ className: '.loading-sub-container' });
        } else {
            await nextTick();
            endLoading?.();
        }
    }
);

watch(
    () => loadedData.value,
    () => {
        if (Array.isArray(loadedData.value) && loadedData.value.length) {
            const listArr = [];
            for (const item of loadedData.value) {
                const { qualityList = [], models = [], id } = item || {};
                if (id === 1) {
                    const qualityListModels = (qualityList || []).flatMap(v => v?.models || []);
                    const allArr = [...qualityListModels, ...(models || [])];
                    for (const model of allArr) {
                        if (model.id && model.modelName) {
                            listArr.push({
                                id: model.id,
                                modelCode: model.modelCode,
                                modelName: model.modelName,
                                name: model.modelName
                            });
                        }
                    }
                }
            }
            listOptions.value = listArr;
        }
    }
);

watch([() => selectModelId.value, () => listOptions.value], () => {
    if (selectModelId.value) {
        selectModelToSubIdsMap.value.set(selectModelId.value, { ids: [] });
        treeData.value = [];
        startRequestSub({ energyModelId: selectModelId.value }).then(res => {
            if (res?.code === SUCCESSCODE) {
                const resData = res?.data || [];
                const openTreeData = setOpenAllNodes(resData);
                treeData.value = openTreeData;
                firstLevelTreeIds.value = resData.map(v => v.id).filter(v => !!v);
                const echoIds = tempModelToSubIdsMap.value.get(selectModelId.value)?.ids;
                if (Array.isArray(echoIds)) {
                    treeSelected.value = echoIds;
                }
            }
        });
    } else if (listOptions.value?.[0]?.id) {
        selectModelId.value = listOptions.value?.[0]?.id;
    }
});

watch(
    () => treeSelected.value,
    cur => {
        if (selectModelToSubIdsMap.value.has(selectModelId.value)) {
            selectModelToSubIdsMap.value.get(selectModelId.value).ids = cur || [];
        }
        if (cur?.length) {
            const firstSelectNodeId = cur[0];
            const firstParentNode = findRootNode(treeData.value, firstSelectNodeId);
            const disableRootIds = firstLevelTreeIds.value.filter(v => v !== firstParentNode?.id);
            disableRootAndChildren(treeData.value, disableRootIds);
        } else {
            enableTreeNodes(treeData.value);
        }
    }
);

watch([() => modalValue.value, () => showModal.value], () => {
    if (!showModal.value) {
        return;
    }
    try {
        const jsonObj = JSON.parse(modalValue.value || '{}');
        const { selectedModelId, selectedTreeIds } = jsonObj;
        if (selectedModelId) {
            tempModelToSubIdsMap.value.set(selectedModelId, { ids: null });
            if (Array.isArray(selectedTreeIds)) {
                tempModelToSubIdsMap.value.get(selectedModelId).ids = selectedTreeIds;
            }

            selectModelId.value = selectedModelId;
        }
    } catch (err) {
        return;
    }
});
</script>

<style lang="less" scoped>
.all-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.empty-custom-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.loading-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
}
.loading-sub-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
}
.row-full-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
}
</style>
