<template>
    <div class="system-diagram-chart wh100">
        <div :id="chardDomId" ref="domView" class="wh100">
            <div ref="ChartBoxRef" class="system-diagram-chart-view">
                <span class="name-warp">
                    <Name
                        v-for="(item, i) in filteredEquipNames"
                        :key="'equip-' + item.dataObjectId + i"
                        :font-size="globalFontSize"
                        :data="item"
                        :legend-scale-ratio="legendScaleRatio"
                    />
                </span>
                <span class="info-point-waro">
                    <InfoPointDataDomView
                        v-for="(item, index) in infoPoints"
                        :key="'infoPoint-' + item.id + index"
                        :info-point-data="item"
                        :legend-scale-ratio="legendScaleRatio"
                    />
                </span>
                <IotGroupCard
                    v-for="plane in infoPlanes"
                    :key="plane.id"
                    :data="plane"
                    :chart-attr="chartAttr"
                    v-bind="$attrs"
                />
                <span class="plan-node-warp">
                    <PlanNode
                        v-for="(item, index) in planNodeList"
                        :key="'plan-node-' + item.id + index"
                        :legend-scale-ratio="legendScaleRatio"
                        :node-data="item"
                    />
                </span>
                <template v-for="(data, index) in textMapList" :key="`text-map-${index}`">
                    <template v-for="(item, k) in data.textMap" :key="k">
                        <TextMapItem
                            v-if="k !== 'localName'"
                            :legend-scale-ratio="legendScaleRatio"
                            :text-map-data="item"
                            v-bind="$attrs"
                        ></TextMapItem>
                    </template>
                </template>
            </div>
        </div>
        <div class="chart-operation-icon">
            <m-tips content="实际大小" theme="darkTransparent" placement="right-start">
                <div class="chart-operation-icon-item fcc" @click="viewReal()">
                    <VueSvg :path="require('@/assets/svg/1-1.svg')" />
                </div>
            </m-tips>
            <m-tips content="恢复默认" theme="darkTransparent" placement="right-start">
                <div class="chart-operation-icon-item fcc" @click="fitView()">
                    <VueSvg :path="require('@/assets/svg/default.svg')" />
                </div>
            </m-tips>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, computed } from 'vue';
import { equipNamesKey, infoPointsKey, globalFontSizeKey } from '@/utils/injectionKey';
import useChartHook from './hooks/useChartHook';
import IotGroupCard from './IotGroupCard.vue';
import Name from './Name.vue';
import VueSvg from '@/components/VueSvg.vue';
import InfoPointDataDomView from './InfoPointDataDomView.vue';
import PlanNode from '@/views/Common/component/InformationCard/PlanNode.vue';
import TextMapItem from '@/views/Common/component/InformationCard/TextMapItem.vue';

const infoPoints = inject(infoPointsKey); // 信息点数据

const equipNames = inject(equipNamesKey);

const props = defineProps({
    chardDomId: {
        type: String,
        default: 'system-diagram-chart-id'
    },
    selectChartId: {
        type: String,
        default: ''
    }
});

const globalFontSize = inject(globalFontSizeKey);

const emits = defineEmits(['onload']);
const domView = ref();
const {
    ChartBoxRef,
    legendScaleRatio,
    infoPlanes,
    fitView,
    viewReal,
    getChartSizeInfo,
    planNodeList,
    textMapList,
    loadData
} = useChartHook(props, emits);
const panelEquipmentIds = computed(() => {
    return infoPlanes.value.map(infoPlane => infoPlane.dataObjectId);
});
const filteredEquipNames = computed(() => {
    return equipNames.filter(item => panelEquipmentIds.value.indexOf(item.dataObjectId) === -1);
});
defineExpose({ fitView, viewReal, loadData, getChartSizeInfo });
</script>
<style lang="scss" scoped>
.system-diagram-chart {
    position: relative;
    overflow: hidden;
    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.m-loading-animation--lottie) {
        width: 100px !important;
        height: 100px !important;
    }
    /* stylelint-disable-next-line selector-class-pattern */
    :deep(.m-loading-mask) {
        background: transparent !important;
    }
}
.chart-operation-icon {
    position: absolute;
    height: 64px;
    border-radius: 4px;
    bottom: 16px;
    right: 16px;
    background-color: var(--gray-0);
    width: 32px;
    box-shadow: 0 3px 12px 0 #1b21291f;
    z-index: 2;
    &-item {
        height: 32px;
        cursor: pointer;
        &:hover {
            /* stylelint-disable-next-line selector-class-pattern */
            :deep(path) {
                fill: var(--blue-500);
            }
            /* stylelint-disable-next-line selector-class-pattern */
            :deep(rect) {
                fill: var(--blue-500);
            }
        }
    }
    .chart-operation-icon-item + .chart-operation-icon-item {
        border-top: 1px solid var(--gray-300);
    }
}
</style>
