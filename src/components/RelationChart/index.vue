<template>
    <div class="relation-chart-com">
        <div :id="relationChartId" ref="chartWarp" class="konva-container" :style="{ visibility: showLoading ? 'hidden' : 'visible' }">
            <div ref="domLayer">
                <template v-if="isSE && !showLoading">
                    <SEInfoGraphDom
                        v-bind="$attrs"
                        :id-prefix="idPrefix"
                        :legend-scale-ratio="legendScaleRatio"
                        :link-objects="linkObjects"
                        :info-planes="infoPlanes"
                        :se-local-names="seLocalNames"
                        :cabinet-numbers="cabinetNumbers"
                        :render-dom-list="renderDomList"
                        :ct-list="ctList"
                        :chart-attr="chartAttr"
                        :select-infos="selectInfos"
                        :current-selected-info-code="currentSelectedInfoCode"
                        :web-layout="webLayout"
                        @click-name="handleClick"
                        @un-hover-name="handleNameUnHover"
                        @hover-name="handleHover"
                        @switch-info="switchInfo"
                        @open-detail="openDetail"
                        @switch-relation-chart="switchRelationChart"
                    ></SEInfoGraphDom>
                </template>
                <template v-else-if="!showLoading">
                    <NodeInfo
                        v-for="item in renderDomList"
                        v-bind="$attrs"
                        :key="item.id"
                        ref="domItmeComs"
                        :id-prefix="idPrefix"
                        :legend-scale-ratio="legendScaleRatio"
                        :data="item"
                        :global-font-size="globalFontSize"
                        @click-name="handleClick(item)"
                        @un-hover-name="handleNameUnHover(item)"
                        @hover-name="handleHover(item)"
                        @switch-relation-chart="switchRelationChart"
                    ></NodeInfo>
                </template>
                <InfoCardGraphDom v-for="item in infoDetails" :key="item.id" :data="item.data" :legend-scale-ratio="legendScaleRatio"></InfoCardGraphDom>
            </div>
        </div>
        <div v-show="showLoading" id="chart-loading" class="loading-warp" :class="{ loading: showLoading }"></div>
        <div v-show="noData" class="chart-empty">
            {{ i18n.global.t('meos_control_web.no_relationship_diagram') }}
        </div>

        <div class="tools-container">
            <m-tips :content="i18n.global.t('meos_control_web.actual_dimension')" theme="darkTransparent" placement="right" trigger="hover">
                <span class="item restore-default" @click.stop="toTransformToRealSize">
                    <RealSize style="width: 18px; height: 18px"></RealSize>
                </span>
            </m-tips>
            <span class="split"></span>
            <m-tips :content="i18n.global.t('meos_control_web.restore_default')" theme="darkTransparent" placement="right" trigger="hover">
                <span class="item restore-default" @click.stop="toRestoreDefault">
                    <Moren style="width: 18px; height: 18px"></Moren>
                </span>
            </m-tips>
        </div>

        <BuildingFloorMapPopupTips
            :pos="popPosition"
            :query-data="popupQueryData"
            :running-monitor-type="runningMonitorType"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
        <SwitchCard
            v-if="bubbleChartModal"
            ref="switchCardVm"
            :id-prefix="idPrefix"
            :chart-modal="bubbleChartModal"
            :bubble-show-name="bubbleShowName"
            @show-detail="showDetail"
            @to-relation-chart="toRelationChart"
        />
        <!-- 关系图图例及下拉菜单 -->
        <div class="bottom-legend-wrap">
            <div class="legend-slot-wrap">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { MLoading } from 'meri-plus';
import useStageOperate from './hooks/useStageOperate';
import useChartLoadOption from './hooks/useChartLoadOption';
import useInfoCard from './hooks/useInfoCard';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import SwitchCard from './SwitchCard.vue';
import RealSize from '@/assets/svg/real-size.svg';
import Moren from '@/assets/svg/moren.svg';
import useDomContainDataHandle from './hooks/useDomContainDataHandle';
import useDropDown from './hooks/useDropDown';
import useChartViewOperate from './hooks/useChartViewOperate';
import { getNameWarpRect } from './utils/relaitonChartUtils';
import InfoCardGraphDom from './InfoCardGraphDom/index.vue';
import NodeInfo from './InfoCardGraphDom/NodeInfo.vue';
import SEInfoGraphDom from './SEInfoGraphDom/index.vue';
import { OBJ_TYPE } from '@/utils/globalVariables';
import { onBeforeUnmount } from 'vue';
import useLineFlow from '@/views/System/shared/RelationChart/hooks/useLineFlow';
import useShellConfig from '@/views/System/shared/RelationChart/hooks/useShellConfig';
import { LINE_FLOW_CONFIGS } from './constants/common';

const popupQueryData = ref(null);
const props = defineProps({
    handleDataHook: {
        type: Function,
        default: a => a
    },
    chartAttr: {
        type: Object,
        default: null
    },
    isSE: {
        type: Boolean,
        default: false
    },
    runningMonitorType: {
        type: String,
        default: ''
    },
    // 需要关系流动
    needLineFlow: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: true
    },
    curSystemId: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['switchRelationChart', 'clickNode', 'clearClickNode', 'beforeLoadChart', 'afterLoadChart']);
const idPrefix = 'dom_item_';

const { queryShellConfig, openingThreshold, useFlowAnimation, flowShapeType, arrowGap } = useShellConfig();

const domLayer = shallowRef();
const popPosition = ref({});
const popuptipsRef = ref();
const switchCardVm = shallowRef();
const bubbleChartModal = shallowRef(null);
const bubbleShowName = ref(false);
const graphDataloading = ref(false);
const idMapInfoCodes = ref({});

// 缩放恢复默认
const chartWarp = ref();
provide('chartWarp', chartWarp);

const queryShellConfigPromise = props.needLineFlow ? queryShellConfig() : null;

const chartUpdateEffect = () => {
    switchCardVm.value?.updateStyle();
};

const removeChoose = () => {
    bubbleChartModal.value?.setState('selected', false);
    bubbleChartModal.value = null;
    bubbleShowName.value = false;
    hightLightLines();
    removeDomItemChoose();
    emit('clearClickNode');
};

const handleClick = (modelData, mark) => {
    popupQueryData.value = null;
    const modal = chart.value.findById(modelData.id);
    const modalData = modal.getModelData();
    // 打包节点可跳转分视图
    const packNodeCanJump = modalData?.compType === 'packNode' && modalData?.interactiveConfigVo?.canJump;
    if (packNodeCanJump) {
        toRelationChart(modal);
    }
    if (!rectCanActive(modal)) return;
    removeChoose();

    // 出卡片
    bubbleChartModal.value = modal;
    bubbleChartModal.value?.setState('selected', true);
    chooseDomItem(modalData.id);
    if (props.chartAttr?.classCode === 'SEHD' || !modelData.interactiveConfigVo || !modelData.interactiveConfigVo.canJump) {
        hightLightLines(modalData.dataObject);
        // 直接打开详情
        emit('clickNode', modalData.dataObject);
        bubbleShowName.value = true;
    }
};

const openDetail = dataObject => {
    emit('clickNode', dataObject);
};

const onClickMoreInfo = dataObject => {
    console.log('onClickMoreInfo: ', dataObject);

    const chartModel = chart.value.findOneModel(model => model.getModelData()?.dataObject?.id === dataObject.id);
    if (chartModel) {
        const modalData = chartModel.getModelData();
        bubbleChartModal.value = chartModel;
        bubbleChartModal.value?.setState('selected', true);
        chooseDomItem(modalData.id);
        // 直接打开详情
        emit('clickNode', modalData.dataObject);
        bubbleShowName.value = true;
        popuptipsRef.value?.hideTipsNow();
        popupQueryData.value = null;
    }
};

const rectCanActive = targetModel => {
    if (!targetModel?.getModelData) return false;
    const data = targetModel.getModelData();
    const { dataObject } = data;

    return dataObject?.objType === OBJ_TYPE.EQUIPMENT || dataObject?.objType === OBJ_TYPE.EQUIPMENTNODE || dataObject?.objType === OBJ_TYPE.EQUIPGROUP;
};

const _handleHoverModal = targetModel => {
    removeHoverDomItem();
    if (!targetModel) return;
    if (!rectCanActive(targetModel)) {
        return;
    }
    targetModel.setState('hover', true);
    const data = targetModel.getModelData();
    const { dataObject } = data;
    if (chartWarp.value) {
        chartWarp.value.style.cursor = 'pointer';
    }
    if (targetModel.hasState('selected')) return; // 选中状态不可hover
    hoverDomItem(data.id);
    let rect = targetModel.getModelType() === 'node' ? targetModel.getImageClientRect() : targetModel.getClientRect();
    if (!rect) {
        rect = getNameWarpRect(chartWarp.value, idPrefix, data.id);
        console.log('计算rect');
    }
    if (!rect) return;
    popPosition.value = {
        top: rect.top,
        left: rect.left + rect.width / 2
    };
    popupQueryData.value = {
        ...unref(props).chartAttr,
        ...unref(dataObject),
        objType: OBJ_TYPE.EQUIPMENT,
        graphTypeCode: props.chartAttr?.imageOrProductName
    };
};

const _handleUnHoverModal = targetModel => {
    if (!rectCanActive(targetModel)) return;
    removeHoverDomItem();
    targetModel.setState('hover', false);
    if (chartWarp.value) {
        chartWarp.value.style.cursor = 'default';
    }
    popupQueryData.value = null;
};

const handleHover = data => {
    const modal = chart.value?.findById(data.id);
    if (modal) {
        _handleHoverModal(modal);
    }
};

const handleNameUnHover = data => {
    removeHoverDomItem();
    const modal = chart.value?.findById(data.id);
    if (modal) {
        _handleUnHoverModal(modal);
    }
};

const switchRelationChart = data => {
    popupQueryData.value = null;
    popuptipsRef.value?.hideTipsNow();
    emit('switchRelationChart', data);
};

const initChartEvents = () => {
    chart.value.on('dragstart', () => {});

    chart.value.on('dragend', () => {});

    chart.value.on('hover', event => {
        const { targetModel } = event;
        console.log(targetModel.getModelData());
        _handleHoverModal(targetModel);
    });

    chart.value.on('unhover', event => {
        const { targetModel } = event;
        _handleUnHoverModal(targetModel);
    });

    chart.value.on('click', event => {
        const { targetModel, originEvt } = event;
        // 点击的konva画布
        if (originEvt?.target?.tagName?.toUpperCase() === 'CANVAS') {
            const data = targetModel.get('data');
            handleClick(data);
        }
    });

    chart.value.on('wheel', () => {
        realSize.value = false;
        defaultSize.value = false;
    });

    chart.value.on('dragmove', () => {
        realSize.value = false;
        defaultSize.value = false;
    });

    chart.value.on('clickWhite', () => {
        // removeChoose();
    });

    chart.value.on('change', () => {
        // popupQueryData.value = null;
        popuptipsRef.value?.hideTipsNow();
        chartUpdateEffect();
    });
};

const {
    chart,
    relationChartId,
    loadGraphById,
    abortLoadGraphById,
    domDataRef,
    classCodeEquipIdsMap,
    legendScaleRatio,
    chartOriginData,
    globalFontSize,
    linkObjects,
    infoPlanes,
    seLocalNames,
    cabinetNumbers,
    ctList,
    selectInfos,
    currentSelectedInfoCode,
    webLayoutm,
    systemGraphDuplicateId
} = useChartLoadOption(initChartEvents, unref(props).handleDataHook, props);

const { resize, restoreDefault, transformToRealSize, realSize, defaultSize } = useStageOperate(chart, chartOriginData);

const { renderDomList, clearDomList } = useDomContainDataHandle(domDataRef, chart);

const { infoDetails, loadInfoDetails, abortLoadInfoDetails, bindChartEffect } = useInfoCard(chart, classCodeEquipIdsMap, renderDomList, chartOriginData);

// 图元视图变动操作hook
const { shakeName, clearShakeName, chooseDomItem, removeDomItemChoose, updateAbnormalData, hoverDomItem, removeHoverDomItem } = useChartViewOperate(renderDomList, infoPlanes);

const curLineFlowConfig = LINE_FLOW_CONFIGS[props.runningMonitorType];
const { prepareLineFlow, hightLightLines, bindLineEffect } = useLineFlow(props, {
    chart,
    idMapInfoCodes,
    useFlowAnimation,
    openingThreshold,
    lineTypesInPairs: curLineFlowConfig?.lineTypesInPairs,
    graphCodeForPumps: curLineFlowConfig?.graphCodeForPumps,
    pumpClassCodes: curLineFlowConfig?.pumpClassCodes
});

const switchInfo = infoCode => {
    currentSelectedInfoCode.value = infoCode;
};

const toRestoreDefault = () => {
    restoreDefault();
    defaultSize.value = true;
    realSize.value = false;
};

const toTransformToRealSize = () => {
    transformToRealSize();
    defaultSize.value = false;
    realSize.value = true;
};

const emitBeforeLoadChart = () => {
    emit('beforeLoadChart');
};

const emitAfterLoadChart = data => {
    const legendData = chart.value?.getLineLengeds() || [];
    emit('afterLoadChart', {
        data,
        renderDomList: renderDomList.value,
        legendData,
        classCodeEquipIdsMap: classCodeEquipIdsMap.value
    });
};

const noRelationData = ref(false);
const loadRelationChart = async (id, systemGraphDuplicateId) => {
    abortChartLoad();
    emitBeforeLoadChart();
    graphDataloading.value = true;
    let data = null;
    try {
        await queryShellConfigPromise;
        chart.value.updateOption({
            lineSetting: {
                useFlowAnimation: useFlowAnimation.value,
                flowShapeType: flowShapeType.value,
                arrowGap: arrowGap.value
            }
        });
        const loadGraphPrimse = loadGraphById(id);
        loadInfoDetails(systemGraphDuplicateId, loadGraphPrimse);

        data = await loadGraphPrimse;
        props.needLineFlow && prepareLineFlow(data);
        nextTick(() => {
            chart.value.bindDomLayer(domLayer.value);
            resize();
            restoreDefault();
            realSize.value = false;
            defaultSize.value = true;
            bindChartEffect();
            props.needLineFlow && bindLineEffect();
        });
        graphDataloading.value = false;
        noRelationData.value = !data;
        emitAfterLoadChart(data);
        return data;
    } catch (e) {
        if (e?.error?.name === 'AbortError') {
            console.error(e.error);
            return null;
        } else {
            graphDataloading.value = false;
            noRelationData.value = !data;
            emitAfterLoadChart(data);
        }

        return null;
    }
};

const abortChartLoad = () => {
    abortLoadGraphById();
    abortLoadInfoDetails();
    bubbleChartModal.value = null;
    realSize.value = false;
    defaultSize.value = false;
    classCodeEquipIdsMap.value = {};
    chartOriginData.value = {};
    idMapInfoCodes.value = {};
    chart.value?.clearCanvas();
    clearDomList();
};

const showDetail = model => {
    const { dataObject } = model.getModelData();
    // 直接跳转到详情
    emit('clickNode', dataObject);
    bubbleShowName.value = true;
};

const toRelationChart = model => {
    const data = model.get('data');
    emit('switchRelationChart', data.interactiveConfigVo);
    removeChoose();
};

// # 关系图下拉菜单相关逻辑 -> 注:下拉菜单需要组件上层注入systemId
const { dropDownMeta, getInstanceSelect } = useDropDown(loadRelationChart, graphDataloading);

watch(
    () => props.chartAttr,
    async () => {
        abortChartLoad();
        emitBeforeLoadChart();
        if (props.chartAttr?.systemObjectId) {
            const options = await getInstanceSelect(props.chartAttr);
            if (!options?.length) {
                emitAfterLoadChart(null);
                noRelationData.value = true;
                graphDataloading.value = false;
            }
        } else {
            noRelationData.value = true;
        }
    },
    {
        immediate: true
    }
);

const noData = computed(() => {
    return !graphDataloading.value && (noRelationData.value || !dropDownMeta.option?.length);
});

const showLoading = computed(() => {
    if (noData.value) return false;
    return graphDataloading.value;
});

let loadingInstance = null;
const templateTypeAllLoading = inject('templateTypeAllLoading');

watch(
    showLoading,
    () => {
        if (showLoading.value) {
            templateTypeAllLoading.value = true;
            nextTick(() => {
                loadingInstance = MLoading.service({
                    target: '#chart-loading',
                    fullscreen: false,
                    duration: 30000,
                    lottieName: 'circle',
                    background: 'transparent'
                });
            });
        } else {
            loadingInstance?.destroy();
            templateTypeAllLoading.value = false;
        }
    },
    {
        immediate: true
    }
);

onBeforeUnmount(() => {
    loadingInstance?.destroy();
    abortChartLoad();
});

defineExpose({ updateAbnormalData, removeChoose, shakeName, clearShakeName, systemGraphDuplicateId: systemGraphDuplicateId });
</script>
<style lang="less" scoped>
.relation-chart-com {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .konva-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        z-index: 10;

        .warn-item {
            position: absolute;
            top: 50px;
            left: 100px;
            width: 100px;
            height: 100px;
            background-color: red;
        }
    }

    .chart-empty {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--gray-500);
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }
    .loading-warp {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        background-color: transparent;
        &.loading {
            z-index: 9999;
        }
    }
    .tools-container {
        position: absolute;
        bottom: 16px;
        right: 0px;
        text-align: center;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
        z-index: 100;
        box-shadow: 0px 3px 12px 0px rgba(27, 33, 41, 0.12), 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08);

        .split {
            width: 100%;
            height: 1px;
            background-color: var(--gray-100);
        }

        .item {
            padding: 7px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover {
                :deep(svg) {
                    path,
                    rect,
                    circle {
                        fill: var(--blue-500);
                    }
                }
            }
            &.disabled {
                cursor: no-drop;
                :deep(svg) {
                    path,
                    rect,
                    circle {
                        fill: var(--gray-300);
                    }
                }
            }
        }
    }
    .tips {
        position: absolute;
        // display: none;
        width: 250px;
        padding: 10px 10px 0px;
        z-index: 999 !important;
        transform: translate(-50%, -100%);
    }
    .bottom-legend-wrap {
        position: absolute;
        left: 0;
        z-index: 50;
        right: 0;
        bottom: 0;
        .drop-down-wrap {
            display: flex;
            justify-content: center;
            margin-bottom: 14px;
            .text-wrap {
                border-radius: 4px;
                background: @grey-alpha-40;
                padding: 5px 8px 5px 12px;
                min-height: 32px;
                align-items: center;
                display: flex;
                gap: 2px;
                // background: yellowgreen;
                &:hover {
                    background: @grey-alpha-50;
                }
            }
            :deep(.dropdown-text) {
                &.open,
                &.dropdown-text {
                    background: none;
                }
            }
            span {
                color: @grey-600;
                font-size: 14px;
                font-weight: var(--platform-font-weight);
                line-height: 22px;
                &:nth-child(2) {
                    width: 23px;
                    display: inline-block;
                    padding-left: 2px;
                }
                > i {
                    font-style: normal;
                    &:first-child {
                        color: @grey-900;
                    }
                }
            }
            .arrow {
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: transform 0.3s linear;
            }
            .rotate {
                transform: rotate(180deg);
                transition: transform 0.3s linear;
            }
        }
        .legend-slot-wrap {
            display: flex;
            justify-content: center;
        }
        // flex-direction: column;
    }
}
</style>
