<template>
    <div class="equip-list-sidebar">
        <div style="width: 100%; padding-right: 20px" class="mt12 mb12">
            <m-search v-model="searchQuery" class="search" :placeholder="i18n.global.t('meos_control_web.search_device')" @change="handleChange" @clear="clearChange" />
        </div>
        <div v-if="equipListSidebarLoading && !filteredList.length" style="padding-right: 24px">
            <m-list-skeleton />
        </div>
        <template v-else-if="!equipListSidebarLoading && filteredList.length">
            <m-virtual-list v-if="showFilteredList" style="height: calc(100% - 44px)" :item-resizable="true" :item-size="40" :items="filteredList">
                <template #default="{ item }">
                    <div v-if="item.classCode" class="title-item f16 fb7 mb12">{{ item.classCodeName }} ({{ item.count }})</div>
                    <div v-else-if="!item.floorId" class="f14 ft1 mb4 ml12 mt12">{{ item.buildingLocalName }}</div>
                    <div v-else-if="item.floorId" :key="item.key">
                        <div class="fb list-item cp" @click.stop="EntryFloor(item)">
                            <div>
                                <template v-if="item.spaceIds?.length">
                                    <m-tips :content="`${i18n.global.t('meos_control_web.jump_to_device_space')}`" theme="darkTransparent" placement="top">
                                        <span class="title mr4 cp" @click.stop="EntryFloor(item)" v-html="highlightLocalName(item.localName)"></span>
                                    </m-tips>
                                </template>
                                <template v-else>
                                    <m-tips :content="`${i18n.global.t('meos_control_web.device_not_interacting_with_space')}`" theme="darkTransparent" placement="top">
                                        <span class="mr4" v-html="highlightLocalName(item.localName)"></span>
                                    </m-tips>
                                </template>
                                <m-tag class="tag-item" color="#1B4ACC" bg-color="#D9EBFF" size="small"> {{ item.floorLocalName }} </m-tag>
                                <m-tag v-if="item?.abnormalOrNot" class="tag-item" color="#FFF" bg-color="#F55047" size="small">
                                    {{ i18n.global.t('meos_control_web.abnormal') }}
                                </m-tag>
                                <m-tag v-if="item?.alarmMessageObj" class="tag-item" color="#FFF" bg-color="#FE8F3C" size="small">{{
                                    i18n.global.t('meos_control_web.alarm_signal')
                                }}</m-tag>
                                <m-tag v-if="item?.faultStatusObj" class="tag-item" color="#FFF" bg-color="#EABF00" size="small">{{
                                    i18n.global.t('meos_control_web.fault_signal')
                                }}</m-tag>
                            </div>
                            <div class="display-n cp">
                                <m-tips :content="`${i18n.global.t('meos_control_web.open_new_tab_jump_to_details_2')}`" theme="darkTransparent" placement="top">
                                    <div class="icon-link fcc bgc-hover" @click.stop="itemInfo(item)">
                                        <SvgIcon name="detail" />
                                    </div>
                                </m-tips>
                            </div>
                        </div>
                    </div>
                </template>
            </m-virtual-list>
        </template>
        <div v-else class="no-data">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" />
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import { getAuthParamsString } from '@/utils/envUtils';
import { selectModuleInfoInjectKey, currentFloorObjInjectKey, equipListSidebarLoadingKey } from '../hooks/useCommonConfig';
// cspell:ignore dompurify
// eslint-disable-next-line import/no-extraneous-dependencies
import DOMPurify from 'dompurify';

const selectModuleInfo = inject(selectModuleInfoInjectKey);
const equipListSidebarLoading = inject(equipListSidebarLoadingKey);
const filteredList = ref(selectModuleInfo.value.dataList);
const currentFloorObj = inject(currentFloorObjInjectKey);
const showFilteredList = ref(true);
const emits = defineEmits(['close']);
const itemInfo = item => {
    // if (!selectModuleInfo?.value.id) return;
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${item?.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
// 搜索关键词
const searchQuery = ref('');

const flattenTree = tree => {
    const result = [];
    function traverse(node) {
        result.push(node);
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                traverse(child);
            });
        }
        // delete node.children;
    }
    tree?.forEach(rootNode => {
        traverse(rootNode);
    });
    return result;
};
watch(
    () => selectModuleInfo.value,
    () => {
        filteredList.value = flattenTree(selectModuleInfo.value.dataList);
    },
    { immediate: true }
);
const EntryFloor = item => {
    currentFloorObj.value = {
        id: item.floorId,
        localName: item.floorLocalName,
        buildingLocalName: item.buildingLocalName,
        inSpaceId: item.spaceIds ? item.spaceIds[0] : ''
    };
    emits('close');
};
const handleChange = () => {
    if (searchQuery.value === '') {
        // 若搜索关键词为空，显示原始树结构
        filteredList.value = flattenTree(selectModuleInfo.value.dataList || []);
    } else {
        let arr = [];
        const clonedData = structuredClone(selectModuleInfo.value.dataList);
        const traverse = node => {
            let matchCount = 0;
            if (node.localName && node.localName.toLowerCase().includes(searchQuery.value.toLowerCase())) {
                matchCount++;
            }
            if (node.children) {
                const newChildren = [];
                for (const child of node.children) {
                    const childResult = traverse(child);
                    matchCount += childResult.count;
                    if (childResult.count > 0) {
                        newChildren.push({ ...child, children: childResult.children });
                    }
                }
                node.children = newChildren;
            }
            console.log(node.children, 'arr');
            return { ...node, count: matchCount };
        };
        const newData = clonedData.map(item => traverse(item));
        arr = flattenTree(newData);
        filteredList.value = arr.filter(item => item.count !== 0);
    }

    showFilteredList.value = false;
    nextTick(() => {
        showFilteredList.value = true;
    });
};
const clearChange = () => {
    searchQuery.value === '';
    filteredList.value = flattenTree(selectModuleInfo.value.dataList);
    // console.log(selectModuleInfo.value.dataList);
    // showFilteredList.value=true
};
const highlightLocalName = localName => {
    // const regex = new RegExp(searchQuery.value, 'gi');
    // return localName.replace(regex, match => `<span style="color:#246FE5">${match}</span>`);
    if (!searchQuery.value) {
        return localName;
    }
    const cleanSearchValue = DOMPurify.sanitize(searchQuery.value);
    const regex = new RegExp(cleanSearchValue, 'gi');
    return localName.replace(regex, match => `<span style="color:#246FE5">${match}</span>`);
};
</script>
<style lang="less" scoped>
.search {
    width: 100%;
}
:deep(.v-vl-items) {
    padding-right: 24px !important;
    // padding-bottom: 30px !important;
}
.title-item {
    position: relative;
    margin-left: 10px;

    &::before {
        position: absolute;
        width: 3px;
        height: 14px;
        background: #246fe5;
        left: -10px;
        top: 4px;
        content: '';
    }
}
.title-item:not(:first-of-type) {
    margin-top: 12px;
}
.equip-list-sidebar {
    padding: 0 0 24px 24px;
    height: 100%;
    overflow: hidden;
    &-scrollbar {
        padding-right: 24px;
        padding-bottom: 30px;
    }

    .title:hover {
        color: #246fe5;
    }
    .list-item {
        padding: 12px;
        border-radius: 4px;
        border-bottom: 1px solid var(--gray-200, #e8ecf0);
        .display-n {
            display: none;
        }
        .tag-item {
            margin-left: 0px;
            margin-right: 4px;
        }
    }
    .list-item:hover {
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        .display-n {
            display: flex;
        }
        .title {
            color: #246fe5;
        }
    }
    .bgc-hover {
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 20px;
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    .no-data {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
