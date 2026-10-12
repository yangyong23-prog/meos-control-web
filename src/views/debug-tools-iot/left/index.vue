<template>
    <div class="left-wrapper">
        <div class="search-wrapper" :style="{ '--left-wrapper-width': `${leftWrapperWidth}px` }">
            <m-select
                v-model="currentSystem"
                :options="systemsOptions"
                :size="leftWrapperWidth"
                :prefix="i18n.global.t('meos_control_web.select_sensing_system_colon')"
                :panel-search-placeholder="i18n.global.t('meos_control_web.search')"
                panel-searchable
            >
            </m-select>
            <m-select
                v-model="currentInstanceType"
                :options="instanceTypesOptionsFlatten"
                :size="leftWrapperWidth"
                :prefix="i18n.global.t('meos_control_web.object_class_colon')"
                :panel-search-placeholder="i18n.global.t('meos_control_web.search_name_code')"
                panel-searchable
            >
                <m-option-group v-for="item in instanceTypesOptions" :key="item.id" :label="item.name" :options="item.children">
                    <m-option v-for="el in item.children" :key="el.id" :value="el.id" :label="el.name"></m-option>
                </m-option-group>
            </m-select>
            <m-input
                v-model="searchKeywords"
                :clearable="true"
                prefix-icon="IconMeriActionSearch"
                :placeholder="i18n.global.t('meos_control_web.press_enter_search_instance_name')"
                :width="leftWrapperWidth"
            >
            </m-input>
        </div>
        <template v-if="isLeftListLoading">
            <div class="loading-list"><m-list-skeleton /></div>
        </template>
        <div v-else class="list-wrapper">
            <template v-if="!renderList?.length">
                <div class="empty-container">{{ i18n.global.t('meos_control_web.search_no_content_yet') }}</div>
            </template>
            <m-virtual-list v-else ref="virtualListRef" style="max-height: 100%" :item-size="44" :padding-bottom="16" :items="renderList">
                <template #default="{ item }">
                    <div :id="`virtual-item-${item.id}`" :key="item.id" :class="['list-item', currentInstance?.id === item?.id ? 'selected' : '']" @click="selectInstance(item)">
                        <span v-ellipsis :class="['m-ellipsis']" v-html="computedHtml(item?.name)"></span>
                    </div>
                </template>
            </m-virtual-list>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import {
    systemsOptionsInjectKey,
    currentSystemInjectKey,
    instanceTypesOptionsInjectKey,
    currentInstanceTypeInjectKey,
    instancesListInjectKey,
    currentInstanceInjectKey,
    leftSidebarWidthInjectKey,
    searchKeywordsInjectKey,
    isLeftListLoadingInjectKey,
    staticInstanceListInjectKey
} from '../hooks/useDebugToolsGlobal';

const systemsOptions = inject(systemsOptionsInjectKey);
const currentSystem = inject(currentSystemInjectKey);
const instanceTypesOptions = inject(instanceTypesOptionsInjectKey);
const currentInstanceType = inject(currentInstanceTypeInjectKey);
const instancesList = inject(instancesListInjectKey);
const currentInstance = inject(currentInstanceInjectKey);
const staticInstanceList = inject(staticInstanceListInjectKey);

const leftSidebarWidth = inject(leftSidebarWidthInjectKey);
const leftWrapperWidth = computed(() => {
    return leftSidebarWidth.value - 32;
});

const searchKeywords = inject(searchKeywordsInjectKey);
const isLeftListLoading = inject(isLeftListLoadingInjectKey);
const virtualListRef = ref();

const instanceTypesOptionsFlatten = computed(() => {
    return instanceTypesOptions?.value?.flatMap(item => item.children);
});

const hasSearch = computed(() => {
    return !!searchKeywords?.value?.toString()?.trim()?.length;
});

const renderList = computed(() => {
    return hasSearch?.value ? instancesList?.value : staticInstanceList?.value;
});

const computedHtml = computed(() => title => {
    if (!hasSearch?.value) {
        return `<span>${title || '--'}</span>`;
    }
    const res = title?.replaceAll(searchKeywords?.value, `<span style="color:var(--primary-color)">${searchKeywords?.value}</span>`) || '--';
    return res;
});

const selectInstance = item => {
    const preHasSearch = searchKeywords.value;
    currentInstance.value = item;
    searchKeywords.value = '';
    if (preHasSearch) {
        nextTick(() => {
            virtualListRef.value?.scrollTo({ top: currentInstance.value.index * 44, left: 0, behavior: 'smooth' });
        });
    }
};
</script>

<style lang="less" scoped>
.left-wrapper {
    height: 100%;
    background: var(--gray-100, #f1f4f6);
    display: flex;
    flex-direction: column;

    :deep(.m-select) {
        width: 100%;
    }
    :deep(.m-search) {
        width: var(--left-wrapper-width);
    }

    .search-wrapper {
        display: flex;
        flex-direction: column;
        row-gap: 12px;
        padding: 16px;
        padding-bottom: 12px;
    }

    .list-wrapper {
        width: 100%;
        height: calc(100% - 148px);
    }
}

.loading-list {
    padding-inline: 16px;
}

.empty-container {
    display: flex;
    height: 239px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-inline: 16px;

    color: @grey-600;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}

.list-item {
    display: flex;
    height: 44px;
    padding: 13px 8px;
    margin-inline: 16px;

    align-items: center;
    gap: 10px;

    color: @grey-900;

    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    cursor: pointer;

    &:hover {
        border-radius: 4px;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}
.list-item.selected {
    border-radius: 4px;
    background: var(--blue-100, #d9ebff);

    color: @blue-500;
    font-weight: 700;
}
</style>
