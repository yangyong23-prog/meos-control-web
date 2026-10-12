<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        :z-index="20"
        type="default"
        :title="props.title"
        :width="1260"
        :height="642"
        :max-height="642"
        :footer="!isTreeEmpty"
        @close="closeModal"
    >
        <template #content>
            <div class="content-wrap">
                <template v-if="isTreeEmpty">
                    <Empty :text="props?.emptyText" width="90px" height="76px" />
                </template>
                <template v-else>
                    <LeftTreeSelect
                        :show-modal="showModal"
                        :tree-data="treeData"
                        :tree-data-loading="treeDataLoading"
                        :min-tree-height="minTreeHeight"
                        :tree-filters-map="treeFiltersMap"
                        :is-all-checkable="isAllCheckable"
                        @hover-space="hoverSpace"
                        @unhover-space="unhoverSpace"
                    >
                        <slot name="search-filter"></slot>
                    </LeftTreeSelect>
                    <RightMapSelect ref="mapRef" :tree-data-loading="treeDataLoading"></RightMapSelect>
                </template>
            </div>
        </template>
        <template #footer>
            <div v-if="!treeDataLoading && !isTreeEmpty" class="footer-btn-group">
                <template v-if="isTreeEmpty">
                    <div class="left-hide"></div>
                </template>
                <m-checkbox v-else v-model="onlyLookSelected" :size="14">{{
                    `${i18n.global.t('meos_control_web.show_selected_only')}${selectedCount ? '(' + selectedCount + ')' : ''}`
                }}</m-checkbox>
                <div class="btns">
                    <m-button type="default" @click.stop="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" :loading="submitLoading" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </div>
            <div v-else class="btns">
                <m-button type="default" @click.stop="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-tips theme="darkTransparent" :disabled="!treeDataLoading" :content="i18n.global.t('meos_control_web.loading_please_wait_alt')" placement="top">
                    <m-button type="primary" :disabled="treeDataLoading" :loading="submitLoading" @click="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
                </m-tips>
            </div>
        </template>
    </m-modal>
</template>

<script setup>
import { $Message } from 'meri-plus';
import Empty from '@/components/common/Empty.vue';
import LeftTreeSelect from './LeftTreeSelect.vue';
import RightMapSelect from './RightMapSelect.vue';
import useGlobalModal from './hooks/useGlobalModal';
import i18n from '@/localization';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    treeData: {
        type: Array,
        default: () => []
    },
    treeDataLoading: {
        type: Boolean,
        default: false
    },
    defaultSelected: {
        type: Array,
        default: () => []
    },
    emptyText: {
        type: String,
        default: i18n.global.t('common.no_data')
    },
    openClearCache: {
        type: Boolean,
        default: false
    },
    openResetDefaultSelected: {
        type: Boolean,
        default: false
    },
    minTreeHeight: {
        type: Number,
        default: 566
    },
    treeFiltersMap: {
        type: Map,
        default: new Map()
    },
    beforeConfirmCallback: {
        type: Function,
        default: () => true
    },
    isAllCheckable: {
        type: Boolean,
        default: false
    }
});
const mapRef = ref(null);
const showModal = defineModel({ type: Boolean, default: false });
const { treeData, treeDataLoading, defaultSelected } = toRefs(props);

const emits = defineEmits(['submit', 'close']);
const { onlyLookSelected, selectedCount, selectedSpaces, buildingFloorSpaceIdsMap, clearCheckedAndKeyword } = useGlobalModal(props, treeData, defaultSelected, showModal);
const submitLoading = ref(false);
const isTreeEmpty = computed(() => {
    return !treeDataLoading?.value && !treeData.value?.length;
});

watch(
    () => showModal?.value,
    val => {
        if (val && props?.openClearCache) {
            nextTick(() => {
                clearCheckedAndKeyword(props.openResetDefaultSelected);
            });
        }
    },
    {
        immediate: true
    }
);

const closeModal = () => {
    submitLoading.value = false;
    showModal.value = false;
    nextTick(() => {
        emits('close');
    });
};

const hoverSpace = id => {
    mapRef.value?.hoverMapObj(id);
};
const unhoverSpace = id => {
    mapRef.value?.unhoverMapObj(id);
};

const confirm = () => {
    // 加载中确定，关闭弹窗
    if (props?.treeDataLoading) {
        showModal.value = false;
        return;
    }
    if (isTreeEmpty.value) {
        showModal.value = false;
        return;
    }
    const canClose = props?.beforeConfirmCallback?.(selectedSpaces.value);
    if (!canClose) {
        return;
    }
    submitLoading.value = true;
    const successCallback = (okMsg = '') => {
        if (okMsg) {
            $Message.success({ title: okMsg });
        }
        closeModal?.();
    };
    const failCallback = (errMsg = '') => {
        if (errMsg) {
            $Message.error({ title: errMsg });
        }
        submitLoading.value = false;
    };

    const relatedNodes = selectedSpaces.value?.map(spaceId => {
        const { name: spaceName, floorId } = buildingFloorSpaceIdsMap.value?.get?.(spaceId) || {};
        const { name: floorName, buildingId, floorSequenceId } = buildingFloorSpaceIdsMap.value?.get?.(floorId) || {};
        const { name: buildingName, buildingSequenceId } = buildingFloorSpaceIdsMap.value?.get?.(buildingId) || {};
        return { spaceId, spaceName, floorId, floorSequenceId, floorName, buildingName, buildingSequenceId };
    });
    emits('submit', selectedSpaces, relatedNodes, { successCallback, failCallback });
};
</script>

<style lang="less" scoped>
.content-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    // column-gap: 10px;
    width: 100%;
    height: 100%;
}

.footer-btn-group {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-checkbox {
        width: fit-content;
    }
    .left-hide {
        visibility: hidden;
        width: 100px;
    }

    .btns {
        display: flex;
        align-items: center;
    }
}
</style>
