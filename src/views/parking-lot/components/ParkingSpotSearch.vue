<template>
    <div class="parking-spot-search-container">
        <m-select v-model="selectValue" clearable searchable :placeholder="i18n.global.t('meos_control_web.search_parking_space_name')" @change="handleChange" @search="handleSearch">
            <template #prefix> <IconMeriActionSearch class="prefix-icon" /></template>
            <CustomVirtualList :all-list="allFilterItems?.length ? allFilterItems : flattenItems" :cur-floor-id="props?.curFloorId" :search-value="searchValue" />
        </m-select>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { IconMeriActionSearch } from 'meri-icon';
import { MSearch } from 'meri-plus';
// import SearchOptionItem from './SearchOptionItem.vue';
import CustomVirtualList from './CustomVirtualList.vue';

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    },
    curBuildingId: {
        type: String,
        default: ''
    },
    curFloorId: {
        type: String,
        default: ''
    }
});

const emits = defineEmits(['parking-spot-search']);

const selectValue = ref();

const searchValue = ref('');

const flattenItems = computed(() => {
    if (props?.list?.length) {
        const curFloorId = props?.curFloorId;
        const curBuildingId = props?.curBuildingId;
        const res = props?.list
            ?.filter(v => v?.buildingId === curBuildingId)
            ?.toSorted((a, b) => {
                // 先按照 floorId 排序
                if (a.floorId === curFloorId && b.floorId !== curFloorId) return -1;
                if (a.floorId !== curFloorId && b.floorId === curFloorId) return 1;

                // 再按照 floorSequenceId 降序排序
                return b.floorSequenceId - a.floorSequenceId;
            });
        return res;
    }
    return [];
});

const allFilterItems = ref([]);

watch(
    () => flattenItems.value,
    val => {
        allFilterItems.value = val;
    },
    {
        immediate: true
    }
);

const handleChange = computed(() => val => {
    const currentItem = flattenItems?.value?.find(v => v?.id === val) || {};
    emits('parking-spot-search', currentItem);
});

const handleSearch = computed(() => val => {
    setTimeout(() => {
        searchValue.value = val;
        allFilterItems.value = flattenItems?.value?.filter(v => v?.localName?.includes(val))?.toSorted(a => (a.floorId === props?.curFloorId ? -1 : 0)) || [];
    }, 500);
});

const clearSelectSpot = () => {
    selectValue.value = undefined;
};

defineExpose({ clearSelectSpot });
</script>

<style lang="less" scoped>
:deep(.prefix-icon) {
    margin-right: 8px;
}

:deep(.m-select-menu-item-name) {
    height: 100%;
    display: inline-flex;
    align-items: center;
}

:deep(.m-select-inner) {
    cursor: default;
}
:deep(.m-select-icon) {
    display: none;
}
</style>
