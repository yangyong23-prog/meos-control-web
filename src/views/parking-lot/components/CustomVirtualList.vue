<template>
    <div v-bind="containerProps" class="custom-virtual-list">
        <div v-bind="wrapperProps">
            <template v-for="item in list" :key="item?.data?.id">
                <div v-if="item?.data?.type === 'option-group'" class="option-group-item">
                    <div class="group-name">{{ item?.data?.name }}</div>
                </div>
                <m-option v-else :value="item?.data?.id" :label="item?.data?.localName ?? '--'">
                    <search-option-item :el="item?.data" :cur-floor-id="props?.curFloorId" :search-value="props?.searchValue" />
                </m-option>
            </template>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useVirtualList } from '@vueuse/core';
import SearchOptionItem from './SearchOptionItem.vue';

const props = defineProps({
    allList: {
        type: Array,
        default: () => []
    },
    curFloorId: {
        type: String,
        default: ''
    },
    searchValue: {
        type: String,
        default: ''
    }
});

const filteredList = computed(() => {
    let res = [];
    const groups = new Set();
    if (Array.isArray(props?.allList) && props?.allList?.length > 0) {
        props?.allList?.forEach(item => {
            if (item?.floorId === props?.curFloorId) {
                if (!groups.has('current')) {
                    groups.add('current');
                    res.push({ id: 'current', name: i18n.global.t('meos_control_web.current_floor'), type: 'option-group' });
                }
            } else {
                if (!groups.has('other')) {
                    groups.add('other');
                    res.push({ id: 'other', name: i18n.global.t('meos_control_web.other_floors'), type: 'option-group' });
                }
            }
            res.push(item);
        });
    }
    return res;
});

const { list, containerProps, wrapperProps } = useVirtualList(filteredList, {
    itemHeight: 40
});
</script>

<style lang="less" scoped>
.custom-virtual-list {
    height: 308px;
}
.option-group-item {
    height: 40px;
    padding-inline: 4px;
}

.group-name {
    height: 40px;
    color: #626c78;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e1e5eb;
}
</style>
