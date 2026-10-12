<template>
    <div class="sidebar-container">
        <div class="sidebar-tab">
            <m-tabs v-model="tabModel" :data="rightTabsData" type="segment" size="large" @change="changeMode"></m-tabs>
        </div>
        <div class="sidebar-content">
            <!-- 整体布局 -->
            <OverallLayout v-if="tabModel === OVERALL_LAYOUT" />
            <DetailAdjustment v-else />
        </div>
    </div>
</template>
<script setup>
import { ref, inject } from 'vue';
import DetailAdjustment from './DetailAdjustment.vue';
import OverallLayout from './OverallLayout.vue';
import { DETAIL_ADJUSTMENT, OVERALL_LAYOUT } from '@/utils/globalVariables';
import { editorKey, isEditDetailsKey } from '@/utils/injectionKey';
const editor = inject(editorKey);

const isEditDetails = inject(isEditDetailsKey);

const rightTabsData = ref([
    {
        id: OVERALL_LAYOUT,
        name: '整体布局调整'
    },
    {
        id: DETAIL_ADJUSTMENT,
        name: '细节调整'
    }
]);

const tabModel = ref(isEditDetails.value ? DETAIL_ADJUSTMENT : OVERALL_LAYOUT);
editor.setMode(tabModel.value);

const changeMode = data => {
    editor.setMode(data.id);
};
</script>

<style lang="scss" scoped>
.sidebar-container {
    z-index: 1;
    user-select: none;
    .sidebar-tab {
        width: 100%;
        padding: 16px 20px;
        :deep(.m-tabs.m-tabs-segment) {
            width: 100%;
            .m-tabs-item {
                flex: 1;
            }
            .m-tabs-body {
                padding-right: 0 !important;
                .m-tabs-trigger {
                    display: none !important;
                }
            }
        }
    }
    .sidebar-content {
        position: relative;
        height: calc(100% - 76px);
        .sidebar-center {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }
        .sidebar-bottom {
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
            .btn {
                width: calc(100% - 40px);
                margin: 8px 20px;
            }
        }
    }
}
</style>
