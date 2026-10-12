<template>
    <div class="content-wrap">
        <template v-if="isTreeEmpty">
            <Empty :text="props?.emptyText" width="90px" height="76px" />
        </template>
        <template v-else>
            <LeftTreeSelect
                :show-modal="true"
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
            <RightMapSelect ref="mapRef" :tree-data-loading="treeDataLoading" :use-tree-space-data-for-map="props.useTreeSpaceDataForMap"></RightMapSelect>
        </template>
    </div>

    <div v-if="props.withOnlyLookSelected" class="footer-layout">
        <div class="footer-btn-group">
            <template v-if="!treeDataLoading && isTreeEmpty">
                <div class="left-hide"></div>
            </template>
            <template v-else-if="!treeDataLoading && !isTreeEmpty">
                <m-checkbox v-model="onlyLookSelected" :size="14">{{ `${i18n.global.t('meos_control_web.show_selected_only')}${selectedCount ? '(' + selectedCount + ')' : ''}` }}</m-checkbox>
            </template>
            <div class="btns">
                <slot name="buttons" :btns="{ confirm, clearCheckedAndKeyword }"></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { $Message } from 'meri-plus';
import Empty from '@/components/common/Empty.vue';
import LeftTreeSelect from './LeftTreeSelect.vue';
import RightMapSelect from './RightMapSelect.vue';
import useGlobalData from './hooks/useGlobalData';
import i18n from '@/localization';

const props = defineProps({
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
    // 是否附加仅看已选的footer
    withOnlyLookSelected: {
        type: Boolean,
        default: true
    },
    // 地图是否直接使用树数据中的空间数据
    useTreeSpaceDataForMap: {
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
    isAllCheckable: {
        type: Boolean,
        default: false
    }
});
const mapRef = ref(null);

const emits = defineEmits(['submit']);
const { onlyLookSelected, selectedCount, selectedSpaces, buildingFloorSpaceIdsMap, clearCheckedAndKeyword } = useGlobalData(props);
const isTreeEmpty = computed(() => {
    return !props.treeDataLoading && !props.treeData?.length;
});

const hoverSpace = id => {
    mapRef.value?.hoverMapObj(id);
};
const unhoverSpace = id => {
    mapRef.value?.unhoverMapObj(id);
};

const confirm = () => {
    // 加载中确定, 返回
    if (props?.treeDataLoading) {
        return;
    }
    const successCallback = (okMsg = '') => {
        if (okMsg) {
            $Message.success({ title: okMsg });
        }
    };
    const failCallback = (errMsg = '') => {
        if (errMsg) {
            $Message.error({ title: errMsg });
        }
    };

    const relatedNodes = selectedSpaces.value?.map(spaceId => {
        const { name: spaceName, floorId } = buildingFloorSpaceIdsMap.value?.get?.(spaceId) || {};
        const { name: floorName, buildingId } = buildingFloorSpaceIdsMap.value?.get?.(floorId) || {};
        const { name: buildingName } = buildingFloorSpaceIdsMap.value?.get?.(buildingId) || {};
        return { spaceId, spaceName, floorId, floorName, buildingName };
    });
    emits('submit', selectedSpaces, relatedNodes, { successCallback, failCallback });
};

defineExpose({
    confirm,
    getOnlyLookSelected: () => onlyLookSelected.value,
    setOnlyLookSelected: val => {
        const checkboxOptions = ['uncheck', 'checked'];
        if (checkboxOptions.includes(val)) {
            onlyLookSelected.value = val;
        }
    },
    getSelectedCount: () => selectedCount.value
});
</script>

<style lang="less" scoped>
.content-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 622px;
    padding-bottom: 20px;
}

.footer-layout {
    width: 100%;
    height: 36px;
    position: relative;
}

.footer-btn-group {
    position: absolute;
    top: 0px;
    left: -24px;
    right: -24px;
    bottom: -20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-top: 1px solid var(--Grey-Grey-Dividers, #e1e5eb);

    .left-checkbox {
        width: fit-content;
    }
    .left-hide {
        visibility: hidden;
        width: 100px;
    }

    .btns {
        margin-left: auto;
        display: flex;
        align-items: center;
    }
}
</style>
