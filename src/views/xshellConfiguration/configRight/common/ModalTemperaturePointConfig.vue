<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        type="default"
        :title="props.title"
        :width="420"
        :height="560"
        :max-height="560"
        :auto-close="false"
        @close="closeModal"
        @cancel="closeModal"
        @submit="submitModal"
    >
        <template #content>
            <div v-loading="getTdbSpacesLoading" class="with-loading-container" element-loading-lottiename="circle">
                <div v-show="!getTdbSpacesLoading && allSpaceIdsSet?.size" class="tree-container">
                    <m-input v-model="keyword" :width="372" prefix-icon="IconMeriActionSearch" :placeholder="i18n.global.t('meos_control_web.search')"> </m-input>
                    <m-tree v-model="treeSelected" :data="treeData" :filter-value="keyword" multiple> </m-tree>
                </div>
                <Empty v-show="!getTdbSpacesLoading && !allSpaceIdsSet?.size" class="empty-wrap" />
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import { spaceListWithTdbInjectKey, getTdbSpacesLoadingInjectKey } from '../../constants/injectKey';
import { generateSpaceTreeData } from '../../utils/index';
import { $Message } from 'meri-plus';
import i18n from '@/localization';
import { isEqual } from 'lodash';
import Empty from '@/components/common/Empty.vue';

const props = defineProps({
    title: {
        type: String,
        default: ''
    }
});
const spaceListWithTdb = inject(spaceListWithTdbInjectKey);
const getTdbSpacesLoading = inject(getTdbSpacesLoadingInjectKey);

const modalValue = defineModel('data', { type: String, default: '' });
const showModal = defineModel('show', { type: Boolean, default: false });
const nodeChecked = defineModel('checked', { type: String, default: 'uncheck' });
const keyword = ref('');

const treeSelected = ref([]);
const treeData = ref([]);

const closeModal = () => {
    nextTick(() => {
        showModal.value = false;
    });
};

const submitModal = () => {
    if (nodeChecked.value === 'checked' && treeData.value?.length && !treeSelected.value?.length) {
        $Message.error({ title: `${i18n.global.t('meos_control_web.please_config')}「${props.title}」` });
        return;
    }

    const allDataStr = JSON.stringify({ spaces: treeSelected.value });
    modalValue.value = allDataStr;
    closeModal();
};

const modalSelected = computed(() => {
    let curString = '';
    try {
        const jsonObj = JSON.parse(modalValue.value || '{}');
        const { spaces } = jsonObj;

        if (Array.isArray(spaces)) {
            return spaces;
        }
        curString = 'JSON-PARSE-ERROR';
    } catch (err) {
        curString = 'JSON-PARSE-ERROR';
    }
    return curString;
});

const modalSelectedSet = computed(() => {
    if (Array.isArray(modalSelected.value)) {
        return new Set(modalSelected.value);
    }
    return new Set();
});

const allSpaceIdsSet = computed(() => {
    const arr = (spaceListWithTdb?.value || [])?.map(item => item.id);
    return new Set(arr);
});

const treeAllData = computed(() => {
    const res = generateSpaceTreeData(spaceListWithTdb?.value || []);
    return res;
});

watch([() => treeAllData.value, () => showModal.value], () => {
    if (treeAllData.value?.length) {
        treeData.value = treeAllData.value.map(v => ({ ...v, open: true }));
    }
});

watch(
    () => showModal.value,
    () => {
        if (!showModal.value) {
            keyword.value = '';
        }
    }
);

watch([() => showModal.value, () => nodeChecked.value, () => modalSelectedSet.value, () => allSpaceIdsSet.value], async () => {
    if (Array.isArray(modalSelected.value) && allSpaceIdsSet.value?.size && nodeChecked.value === 'checked') {
        if (!modalSelected.value.length) {
            // 勾选生效时，且当前无选择时，默认全选空间
            nextTick(() => {
                treeSelected.value = Array.from(allSpaceIdsSet.value);
            });
            // 设置提交的数据
            nextTick(() => {
                const allDataStr = JSON.stringify({ spaces: Array.from(allSpaceIdsSet.value) });
                modalValue.value = allDataStr;
            });
        } else {
            const isPreSame = isEqual(modalSelected.value, treeSelected.value);
            if (!isPreSame) {
                nextTick(() => {
                    treeSelected.value = modalSelected.value;
                });
            }
        }
    }
    // 取消勾选时，且当前无选择时，清空选择
    if (nodeChecked.value !== 'checked' && !modalSelected.value.length) {
        nextTick(() => {
            treeSelected.value = [];
        });
    }
});
</script>

<style lang="less" scoped>
.tree-container {
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;

    row-gap: 12px;
}
.with-loading-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.empty-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
