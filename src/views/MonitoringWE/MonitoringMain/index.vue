<template>
    <div class="monitoring-main">
        <template v-if="systemList?.length">
            <Header @selected-node="selectNode" />
            <TreeGraph
                ref="treeGraph"
                class="tree-graph"
                @hover-node="handleHoverNode"
                @selected-node="selectedNode"
            />
            <BundleCardHoverTips
                :list-data="listData"
                to=".monitoring-we-warp"
                :pos="cardPosition"
                @hide="handleHide"
            ></BundleCardHoverTips>
            <Tools
                @to-transform-to-real-size="toTransformToRealSize"
                @to-restore-default="toRestoreDefault"
            />
            <div class="bottom-wrap">
                <Legend></Legend>
            </div>
        </template>
        <Empty
            v-else
            class="empty"
            :text="i18n.global.t('meos_control_web.no_content')"
            width="90px"
            height="76px"
        />
    </div>
</template>
<script setup>
import i18n from '@/localization';
import Header from './header.vue';
import TreeGraph from '../TreeGraph/index.vue';
import Empty from '@/components/common/Empty.vue';
import Tools from './tools.vue';
import Legend from './legend.vue';
import useMonitoringMain from '../hooks/useMonitoringMain';
import { curHoverInfoKey, systemListKey } from '../hooks/useCommonConfig';
// import { closeDetailDrawerInjectKey } from '../hooks/useDrawerCommon';
import BundleCardHoverTips from '@/components/BundleCardHoverTips.vue';

const emits = defineEmits(['selectedNode']);

const treeGraph = ref({});
const { toTransformToRealSize, toRestoreDefault } = useMonitoringMain(treeGraph);
// const closeDetailDrawer = inject(closeDetailDrawerInjectKey);
const curHoverInfo = inject(curHoverInfoKey);
const systemList = inject(systemListKey);
const selectNode = id => {
    treeGraph?.value.selectNodeByEquipId(id);
};
const selectedNode = node => {
    emits('selectedNode', node);
};

const listData = ref(null);
const cardPosition = ref({});

const handleHoverNode = ({ id, center, size, localName, classCode, isBundleCard, childrenInfo, ...rest }) => {
    if (isBundleCard) {
        // childrenInfo[0].localName = localName + '路上的风景都是见风使舵离开减肥开始了福建老家了';
        listData.value = {
            id,
            children: childrenInfo
        };
        // console.log('center: ', center, size, childrenInfo);
        cardPosition.value = center
            ? {
                  left: center[0],
                  top: center[1] + size[1] * 0.5
              }
            : {};
    } else {
        curHoverInfo.value = {
            popupQueryData: id ? { id, localName, classCode } : {},
            cardPosition: center ? { left: center[0], top: center[1] - size[1] * 0.5 } : {}
        };

        // 清空listData
        listData.value = null;
    }
};

// 保证位置不飘动
const handleHide = () => {
    cardPosition.value = {};
};

provide('treeGraph', treeGraph);
</script>

<style lang="less" scoped>
.monitoring-main {
    width: 100%;
    height: 100%;
    position: relative;
    .tree-graph {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
    }
    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .bottom-wrap {
        position: absolute;
        width: fit-content;
        z-index: 2;
        bottom: 0;
        left: 50%;
        padding-inline: 64px;
        padding-left: 114px;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
    }
}
</style>
