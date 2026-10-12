<template>
    <div :class="{ 'se-container': true }">
        <ExpansionCollapse ref="toggleWidthDivRef" :is-unpack="unpackShow">
            <template #left>
                <Left />
            </template>
            <template #right>
                <Right />
            </template>
        </ExpansionCollapse>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import DockSingleton from '@/hooks/responsiveDock';
import { isEmpty } from 'lodash';
import ExpansionCollapse from '@/components/expansionCollapseAssembly/index.vue';
import Left from './LeftMain/index.vue';
import Right from './RightPanel/index.vue';
import useGlobalData from './hooks/useGlobalData';
import useSSE from './hooks/useSSE';
import useAbnormalList from './hooks/useAbnormalList';
import { MENU_CODE } from './constant/index';

const { toggleWidthDivRef, unpackShow, abnormalTargetObjIds, classCode2ObjectIds } = useGlobalData();
const { sseClient, setSSEClientOptionUtil } = useSSE();
useAbnormalList(sseClient, abnormalTargetObjIds, toggleWidthDivRef);

watch(classCode2ObjectIds, cur => {
    if (isEmpty(cur)) {
        sseClient.close();
    } else {
        setSSEClientOptionUtil(cur, MENU_CODE);
    }
});

const { clearAllObjectInfo } = DockSingleton.getInstance();

onBeforeUnmount(() => {
    // 清理响应式池子
    clearAllObjectInfo();
});
</script>

<style lang="less" scoped>
.se-container {
    width: 100%;
    height: 100%;
    min-width: 1280px;
    overflow: hidden;
    background-color: #d6dde5;
    position: relative;
    background-size: cover;
    background-image: url(@/assets/imgs/page_bg.png);
}
</style>
