<template>
    <div class="map-search-warp">
        <m-tips trigger="manually" :is-open="isOpen && searchWord.length" placement="bottom-end" popover-class="map-search-popover" @mouse-enter="targetMouseEnter">
            <m-input
                v-model="searchWord"
                :width="width"
                :clearable="true"
                prefix-icon="IconMeriActionSearch"
                :placeholder="placeholder"
                @focus="triggerFocus"
                @blur="triggerBlur"
                @input="doSearch"
            ></m-input>
            <template #content>
                <div ref="targetRef" class="search-plane" tabindex="-1" @blur="targetBlur">
                    <div v-if="!onlyType" class="search-plane-header">
                        <m-tabs v-model="selectTab" :data="tabs" size="large" @change="doSearch" />
                    </div>
                    <m-scrollbar :max-height="maxHeight">
                        <div v-loading="searching || loading" element-loading-lottiename="circle" class="search-content-list-warp">
                            <div v-if="normalFloorResult.length" class="list-group">
                                <div v-if="currentFloorId" class="list-group-title">{{ i18n.global.t('meos_control_web.current_floor') }}</div>
                                <div
                                    v-for="item in normalFloorResult"
                                    :key="item.id"
                                    class="result-item-li"
                                    @mouseenter="hoverItem(item)"
                                    @mouseleave="unhoverItem"
                                    @click="chooseItem(item)"
                                >
                                    <div v-ellipsis="{ mouseLeaveDelay: 0 }" class="result-item-li-name" v-html="item.htmlTxt" />
                                    <div v-if="currentFloorTag" class="result-item-li-floor-name">
                                        <buildingFloorTxt v-bind="item"></buildingFloorTxt>
                                    </div>
                                </div>
                            </div>
                            <div v-if="otherFloorResult.length" class="list-group">
                                <div class="list-group-title">{{ i18n.global.t('meos_control_web.other_floors') }}</div>
                                <m-tips v-for="item in otherFloorResult" :key="item.id" theme="darkTransparent" :content="i18n.global.t('meos_control_web.jump_to_floor_to_view')">
                                    <div
                                        v-ellipsis="{ mouseLeaveDelay: 0 }"
                                        class="result-item-li"
                                        @mouseenter="hoverItem(item)"
                                        @mouseleave="unhoverItem"
                                        @click="chooseItem(item)"
                                    >
                                        <div class="result-item-li-name" v-html="item.htmlTxt" />
                                        <div class="result-item-li-floor-name"><buildingFloorTxt v-bind="item"></buildingFloorTxt></div>
                                    </div>
                                </m-tips>
                            </div>
                            <div v-if="!normalFloorResult?.length && !otherFloorResult.length && !(searching || loading)" class="empty-warp">
                                {{ i18n.global.t('meos_control_web.no_content') }}
                            </div>
                        </div>
                    </m-scrollbar>
                </div>
            </template>
        </m-tips>
    </div>
</template>
<script setup lang="jsx">
import i18n from '@/localization';
import { ref } from 'vue';
import useKeepFocusPopverOpen from './useKeepFocusPopverOpen';
import useSearchLogic from './useSearchLogic';

const searchWord = ref('');

const props = defineProps({
    spaces: {
        type: Array,
        default: () => []
    },
    equips: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    currentFloorId: {
        type: String,
        default: ''
    },
    onlyType: {
        type: String,
        default: ''
    },
    spaceFilterFn: {
        type: Function,
        default: null
    },
    equipFilterFn: {
        type: Function,
        default: null
    },
    currentFloorTag: {
        type: Boolean,
        default: true
    },
    clearChangeFloor: {
        type: Boolean,
        default: false
    },
    width: {
        type: Number,
        default: 160
    },
    maxHeight: {
        type: Number,
        default: 300
    }
});

const emits = defineEmits(['choose', 'hover-obj', 'unhover-obj']);

const tabs = ref([
    {
        id: 'equipment',
        name: `${i18n.global.t('meos_control_web.equipment')}`
    },
    {
        id: 'space',
        name: `${i18n.global.t('common.space')}`
    }
]);
const defaultTab = unref(props).onlyType || tabs.value[0].id;
const selectTab = ref(defaultTab);
const placeholder = ref(i18n.global.t('meos_control_web.search_device_space'));

const refreshPlaceholder = () => {
    if (selectTab.value === 'space') {
        placeholder.value = i18n.global.t('meos_control_web.search_space');
    } else {
        placeholder.value = i18n.global.t('meos_control_web.search_device');
    }
};
refreshPlaceholder();

const buildingFloorTxt = obj => {
    const buildingName = obj.buildingLocalName;
    const floorName = obj.floorLocalName || obj.floorLocalId;
    if (buildingName || floorName)
        return (
            <>
                <span v-ellipsis={{ mouseLeaveDelay: 0 }} className="search-building-name">
                    {buildingName}
                </span>
                -{floorName}
            </>
        );
    if (floorName) return floorName;
    if (buildingName)
        return (
            <span v-ellipsis={{ mouseLeaveDelay: 0 }} className="search-building-name">
                {buildingName}
            </span>
        );
    return '';
};

const searchList = {};

watch(
    [selectTab, () => props.spaces, () => props.equips],
    () => {
        const data = selectTab.value === 'space' ? [...unref(props).spaces] : [...unref(props).equips];

        searchList.data = data;
    },
    {
        immediate: true
    }
);

const { normalFloorResult, otherFloorResult, doSearch, searching } = useSearchLogic(searchList, searchWord, selectTab, props);
const { isOpen, targetRef, triggerBlur, triggerFocus, targetMouseEnter, targetBlur, resetStatus } = useKeepFocusPopverOpen(doSearch);

const chooseItem = obj => {
    emits('choose', obj, selectTab.value);
    searchWord.value = '';
    resetStatus();
};

const hoverItem = obj => {
    // 下拉框关闭后不执行hover
    if (!isOpen.value) {
        return;
    }
    emits('hover-obj', obj);
};

const unhoverItem = () => {
    emits('unhover-obj');
};
watch(
    () => props.onlyType,
    () => {
        if (props.onlyType) {
            selectTab.value = props.onlyType;
            refreshPlaceholder();
            doSearch();
        } else {
            selectTab.value = tabs.value[0].id;
            placeholder.value = i18n.global.t('meos_control_web.search_device_space');
            doSearch();
        }
    },
    {
        immediate: true
    }
);
watch([() => props.spaces, () => props.equips, () => props.currentFloorId], () => {
    doSearch();
});
watch(
    () => props.currentFloorId,
    () => {
        if (props.clearChangeFloor) {
            searchWord.value = '';
        }
    }
);
</script>
<style lang="less">
.map-search-popover.m-popover.m-popover__tips.m-flexible-overlay {
    padding: 0;
}
</style>
<style lang="less" scoped>
.search-plane {
    width: 292px;
    padding-top: 4px;
    :deep(.el-loading-mask) {
        background: transparent !important;
        .el-loading-spinner .path {
            stroke: #626c78;
        }
        .el-loading-spinner .circular {
            width: 28px;
            height: 28px;
        }
    }
    .search-plane-header {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid var(--gray-300);
    }
    .search-content-list-warp {
        padding: 4px;
        min-height: 80px;
        .list-group {
            width: 100%;
            .list-group-title {
                display: flex;
                padding: 9px 8px;
                justify-content: space-between;
                align-items: center;
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                color: var(--gray-500);
            }
            .result-item-li {
                display: flex;
                padding: 9px 8px;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                border-radius: 4px;
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                color: var(--gray-900);
                width: 100%;
                &:hover {
                    background-color: rgba(196, 201, 207, 0.3);
                }

                .result-item-li-name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .result-item-li-floor-name {
                    display: flex;
                    padding: 0px 4px;
                    justify-content: center;
                    align-items: center;
                    border-radius: 2px;
                    background-color: rgba(196, 201, 207, 0.3);
                    flex-shrink: 0;

                    :deep(.search-building-name) {
                        display: inline-block;
                        max-width: 80px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
        }

        .empty-warp {
            text-align: center;
            margin-top: 24px;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px;
            color: var(--gray-500);
        }
    }
}
</style>
