<template>
    <div ref="configPreview" class="config-preview-container">
        <PreviewHeader @go-back="goBack"></PreviewHeader>
        <div class="config-preview-content">
            <template v-if="['PUBLIC_AREA_LIGHTING', 'PARKING_LOT_LIGHTING'].includes(curMenuId)">
                <m-sidebar v-model:width="sidebarWidth" v-model:show="showSidebar" :change-size="false" :resident="true" @on-update="onUpdate">
                    <Left v-show="showSidebar" />
                </m-sidebar>
            </template>
            <Graph />
            <Right :width="rightWidth" />
        </div>
    </div>
</template>
<script setup>
import Left from './left.vue';
import Right from './right.vue';
import Graph from './Graph/index.vue';
import PreviewHeader from './preview-header.vue';
import { useConfigPreviewData } from '../../hooks/useConfigPreviewHook';
import { curMenuIdKey } from '../../hooks/useGlobalData';
import { useElementSize } from '@vueuse/core';
import { computed } from 'vue';
const configPreview = ref();
const { width } = useElementSize(configPreview);
const curMenuId = inject(curMenuIdKey);
const emits = defineEmits(['goBack']);
const rightWidth = computed(() => {
    if (width.value > 1440) {
        return 560;
    } else {
        return 460;
    }
});
const goBack = () => {
    emits('goBack');
};

const { loading, sidebarWidth, showSidebar } = useConfigPreviewData();
</script>
<style lang="less" scoped>
.config-preview-container {
    width: 100%;
    height: 100%;
}
.config-preview-content {
    height: calc(100% - 48px);
    background-color: #d6dde5;
    display: flex;
}
</style>
