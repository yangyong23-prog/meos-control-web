<template>
    <div ref="relationChartHeader" class="relation-chart-header">
        <div class="tabs-warp" :style="{ width: `${tabsWidth}px` }">
            <m-tabs
                v-if="tabsWidth"
                :key="tabList.length"
                ref="headerTabsRef"
                v-model="activeTab"
                :data="tabList"
                size="large"
                :scroll-position="scrollPosition"
                @change="onChange"
            >
                <template #tabContent="{ item }">
                    <div
                        class="tab-content-warp"
                        @mouseenter.stop="mouseenterName($event, item)"
                        @mouseleave.stop="mouseleaveName($event, item)"
                    >
                        <div class="tab-content">
                            <span
                                v-ellipsis
                                class="name"
                                :class="{ 'name-mouseenter': item.isShowEdit && item.graphType === 1 }"
                            >
                                {{ item.name }}</span
                            >
                            <!-- 编辑名称icon -->
                            <div class="icon-position">
                                <EditorIcon
                                    v-if="item.isShowEdit && item.graphType === 1"
                                    :show-action-editor="showActionEditor"
                                    :rows="item"
                                    @handle="handle"
                                ></EditorIcon>
                            </div>
                        </div>
                        <m-tag
                            :color="getStatusText(item).color"
                            :bg-color="getStatusText(item).background"
                            size="small"
                            >{{ getStatusText(item).text }}
                        </m-tag>
                        <div v-if="showUpdate(item)" class="red-circle"></div>
                    </div>
                </template>
            </m-tabs>
        </div>
        <div v-if="curActiveTabItem" ref="toolWarp" class="tool-warp">
            <m-button v-if="curActiveTabItem.status === 1" type="link" size="medium" @click="offRelationChart"
                >下架图纸</m-button
            >

            <m-button
                v-if="curActiveTabItem.graphType === 1 && curActiveTabItem.status !== 1"
                class="link-red"
                type="link"
                size="medium"
                @click="deleteCopyRelationChart"
                >删除副本</m-button
            >

            <m-button
                v-if="!curActiveTabItem.isNotEdit"
                type="default"
                size="medium"
                :loading="copyLoading"
                @click="createCopyRelationChart"
                >创建副本编辑</m-button
            >

            <!-- showUpdateButton 为按下g展示 -->
            <m-button
                v-if="(curActiveTabItem.graphType === 0 && currentTemplateObject.updateFlag) || showUpdateButton"
                type="primary"
                size="medium"
                @click="initOriginChart"
                >获取最新图纸</m-button
            >

            <m-button
                v-if="curActiveTabItem.status !== 1"
                type="primary"
                size="medium"
                :loading="publishBtnLoading"
                @click="publishRelationChart"
                >发布</m-button
            >
        </div>
    </div>
    <!--编辑名称的弹框  -->
    <PopoverName
        :type="'duplicate'"
        :popover-virtual-ref="popoverVirtualRef"
        @submit-name-change="submitNameChange"
    ></PopoverName>
</template>
<script setup>
import { inject, ref, watchEffect, provide, nextTick } from 'vue';
import EditorIcon from './SidebarOperation/common/EditorIcon.vue';
import PopoverName from './SidebarOperation/common/PopoverName.vue';
import useRelationChartOperate from './hooks/useRelationChartOperate';
import { currentTemplateObjectKey, currentHeaderItemKey, initOriginChartFunKey } from '@/utils/injectionKey';
const currentTemplateObject = inject(currentTemplateObjectKey);
const initOriginChart = inject(initOriginChartFunKey);
const headerTabsRef = ref();

const emits = defineEmits([
    'update:modelValue',
    'change',
    'offSuccess',
    'deleteSuccess',
    'createCopy',
    'getNew',
    'publishSuccess'
]);
const props = defineProps({
    modelValue: {
        type: String,
        default: 'all'
    },
    tabList: {
        type: Array,
        default: () => []
    },

    getChartSizeInfo: {
        type: Function,
        default: null
    }
});
// 展示编辑icon
const mouseenterName = (event, row) => {
    row.isShowEdit = true;
};
// 移除编辑icon
const mouseleaveName = (event, row) => {
    if (showActionEditor.value && row.id === currentItem.value.id) return;
    row.isShowEdit = false;
};
const showActionEditor = ref(false);
const popoverVirtualRef = ref({});
// 点击icon当前item
const currentItem = inject(currentHeaderItemKey);
const handle = (event, row) => {
    currentItem.value = row;
    popoverVirtualRef.value = '';
    showActionEditor.value = false;
    setTimeout(() => {
        popoverVirtualRef.value = event.target;
        showActionEditor.value = true;
    });
};
const submitNameChange = () => {
    showActionEditor.value = false;
    nextTick(() => {
        headerTabsRef.value?.setBarStyle();
    });
};
provide('showActionEditor', showActionEditor);
const getStatusText = graphHeaderData => {
    if (graphHeaderData?.status === 1) {
        return {
            text: '已发布',
            color: '#1B4ACC',
            background: '#D9EBFF'
        };
    } else {
        if (graphHeaderData?.graphType === 0) {
            return {
                text: '未发布',
                color: '#626C78',
                background: '#E8ECF0'
            };
        } else {
            return {
                text: '编辑中',
                color: '#626C78',
                background: '#E8ECF0'
            };
        }
    }
};

const showUpdate = graphHeaderData => {
    return graphHeaderData.graphType === 0 && currentTemplateObject.value.updateFlag;
};

const relationChartHeader = ref(null);
const toolWarp = ref(null);
const tabsWidth = ref(null);

watchEffect(() => {
    const relationChartHeaderWidth = ref(relationChartHeader.value?.offsetWidth);
    const toolWarpWidth = ref(toolWarp.value?.offsetWidth);
    tabsWidth.value = relationChartHeaderWidth.value - 16 - toolWarpWidth.value;
});

const {
    showUpdateButton,
    activeTab,
    publishBtnLoading,
    curActiveTabItem,
    onChange,
    offRelationChart,
    deleteCopyRelationChart,
    copyLoading,
    scrollPosition,
    createCopyRelationChart,
    publishRelationChart
} = useRelationChartOperate(props, emits);
</script>

<style lang="scss" scoped>
.relation-chart-header {
    flex-shrink: 0;
    width: 100%;
    height: 52px;
    border-bottom: 1px solid var(--grey-300, #e1e5eb);
    background: var(--white, #ffffff);
    padding-right: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    position: relative;
    z-index: 2;
    .tabs-warp {
        overflow: hidden;
        flex-grow: 1;
        :deep(.m-tabs-list) {
            height: 52px;
        }
        .tab-content-warp {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 4px;

            /* min-width: 114px; */
            max-width: 240px;
            :deep(.m-tag) {
                cursor: pointer;
            }
            .tab-content {
                display: flex;
                align-items: center;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                position: relative;
                .icon-position {
                    position: absolute;
                    right: 0;
                    top: 4px;
                }
                .name {
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .name-mouseenter {
                    width: calc(100% - 16px);
                }
            }
            .red-circle {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--red-500);
            }
        }
    }
    .tool-warp {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        :deep(.link-red) {
            color: var(--red-500, #f55047);
        }
        :deep(.link) {
            margin-left: -8px;
            margin-right: -8px;
        }
    }
}
</style>
