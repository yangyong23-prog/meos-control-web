<template>
    <div class="relation-chart-editor-wrap">
        <template v-if="!loading">
            <div v-if="treeData?.length === 0" class="relation-chart-editor-empty">
                <m-illustration title="暂无内容" type="noContent" />
            </div>
            <template v-if="treeData?.length">
                <!-- 左侧树 -->
                <Left v-model="currentSelectedIds" :tree-data="treeData" @change="handleChangeNode" />

                <div class="relation-chart-editor-container">
                    <template v-if="!relationChartLoading">
                        <div v-if="tabList?.length === 0" class="relation-chart-editor-empty">
                            <m-illustration title="获取最新的图纸进行编辑" type="noContent">
                                <template #footer>
                                    <m-button type="primary" @click="initOriginChart">获取图纸</m-button>
                                </template>
                            </m-illustration>
                        </div>
                        <template v-if="tabList?.length">
                            <Header
                                v-model="graphId"
                                :tab-list="tabList"
                                :get-chart-size-info="getChartSizeInfo"
                                @change="handleChangeTab"
                            />
                            <ChartEditContainer ref="chartEditCom"></ChartEditContainer>
                        </template>
                    </template>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Left from './Left.vue';
import ChartEditContainer from './ChartEditContainer.vue';
import Header from './Header.vue';
import useLeftTreeData from './hooks/useLeftTreeData';
import useRelationChartData from './hooks/useRelationChartData';
import useGlobalData from './hooks/useGlobalData';

const chartEditCom = ref();

const { graphId, graphHeaderData } = useGlobalData(); // 全局数据注入
const { loading, currentSelectedIds, treeData, currentTemplateObject, handleChangeNode } = useLeftTreeData();

const { relationChartLoading, tabList, handleChangeTab, initOriginChart } = useRelationChartData(
    currentTemplateObject,
    graphId,
    graphHeaderData,
    chartEditCom
);
const getChartSizeInfo = () => {
    return chartEditCom.value?.getChartSizeInfo();
};
</script>
<style lang="scss" scoped>
.relation-chart-editor-wrap {
    display: flex;
    min-width: 1366px;
    user-select: none;

    @include wh(100%, 100%);

    background: var(--grey-100, #f1f4f6);
    .relation-chart-editor-empty {
        @include wh(100%, 100%);

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .relation-chart-editor-container {
        @include wh(100%, 100%);

        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        :deep(.m-loading-load) {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
}
</style>
