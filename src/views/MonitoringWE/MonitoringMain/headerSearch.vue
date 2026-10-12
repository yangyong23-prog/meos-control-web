<template>
    <div class="map-search-warp">
        <m-tips trigger="manually" :is-open="isOpen && searchWord.length" placement="bottom-end" popover-class="map-search-popover" @mouse-enter="targetMouseEnter">
            <m-input
                v-model="searchWord"
                width="240"
                :clearable="true"
                prefix-icon="IconMeriActionSearch"
                :placeholder="i18n.global.t('meos_control_web.search_device')"
                @focus="triggerFocus"
                @blur="triggerBlur"
                @input="doSearch"
            ></m-input>
            <template #content>
                <div ref="targetRef" class="search-plane" tabindex="-1" @blur="targetBlur">
                    <m-scrollbar max-height="308">
                        <div v-loading="searching || loading" element-loading-lottiename="circle" class="search-content-list-warp">
                            <div v-if="normalFloorResult.length" class="list-group">
                                <div
                                    v-for="item in normalFloorResult"
                                    :key="item.id"
                                    class="result-item-li"
                                    @mouseenter="hoverItem(item)"
                                    @mouseleave="unhoverItem"
                                    @click="chooseItem(item)"
                                >
                                    <div v-ellipsis="{ mouseLeaveDelay: 0 }" class="result-item-li-name" v-html="item.htmlTxt" />
                                </div>
                            </div>

                            <div v-if="!normalFloorResult?.length && !(searching || loading)" class="empty-warp">{{ i18n.global.t('meos_control_web.no_content') }}</div>
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
import useKeepFocusPopverOpen from '../hooks/useKeepFocusPopverOpen';
import useSearchLogic from '../hooks/useSearchLogic';
import { closeDetailDrawerInjectKey } from '../hooks/useDrawerCommon';
const closeDetailDrawerInject = inject(closeDetailDrawerInjectKey);
const searchWord = ref('');

const props = defineProps({
    equips: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    equipFilterFn: {
        type: Function,
        default: null
    }
});

const emits = defineEmits(['choose', 'hover-obj', 'unhover-obj']);

const searchList = {};
const { normalFloorResult, doSearch, searching } = useSearchLogic(searchList, searchWord, props);
const { isOpen, targetRef, triggerBlur, triggerFocus, targetMouseEnter, targetBlur, resetStatus } = useKeepFocusPopverOpen(doSearch);

const chooseItem = obj => {
    emits('choose', obj);
    searchWord.value = '';
    resetStatus();
};

const hoverItem = obj => {
    emits('hover-obj', obj);
};

const unhoverItem = () => {
    emits('unhover-obj');
};

watch([() => props.equips], () => {
    const data = [...unref(props).equips];
    searchList.data = data;
    doSearch();
});
watch(
    () => searchWord?.value,
    () => {
        closeDetailDrawerInject();
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
    width: 240px;
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
../hooks/useKeepFocusPopverOpen../hooks/useSearchLogic
