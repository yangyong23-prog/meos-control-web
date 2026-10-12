<template>
    <div class="relation-chart-com">
        <div :id="relationChartId" ref="chartWarp" class="konva-container" :style="{ visibility: showLoading ? 'hidden' : 'visible' }">
            <div v-show="!noData" ref="domLayer">
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
                        :support-status-codes="supportStatusCodes"
                        @click-name="handleClick(item)"
                        @un-hover-name="handleNameUnHover(item)"
                        @hover-name="handleHover(item)"
                        @switch-relation-chart="switchRelationChart"
                    ></NodeInfo>

                    <InfoCardGraphDom v-for="item in infoDetails" :key="item.id" :data="item.data" :legend-scale-ratio="legendScaleRatio"></InfoCardGraphDom>
                </template>
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
            :use-new-api="useHoverNewApi"
            @click-more-info="onClickMoreInfo"
        ></BuildingFloorMapPopupTips>
        <GroupHoverPanel
            :can-hover-group-select="canHoverGroupSelect"
            :pos="popPosition"
            :equips="popupGruopIds"
            :running-monitor-type="runningMonitorType"
            @click-item="onClickItem"
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
import { MLoading, $Message } from 'meri-plus';
import useStageOperate from './hooks/useStageOperate';
import useChartLoadOption from './hooks/useChartLoadOption';
import useInfoCard from './hooks/useInfoCard';
import useLineFlow from './hooks/useLineFlow';
import useShellConfig from './hooks/useShellConfig';
import BuildingFloorMapPopupTips from '@/components/BuildingFloorMapPopupTips.vue';
import SwitchCard from './SwitchCard.vue';
import RealSize from '@/assets/svg/real-size.svg';
import Moren from '@/assets/svg/moren.svg';
import useDomContainDataHandle from './hooks/useDomContainDataHandle';
import useDropDown from './hooks/useDropDown';
import useChartViewOperate from './hooks/useChartViewOperate';
import { getNameWarpRect } from './utils/relaitonChartUtils';
import { OBJ_TYPE } from '@/utils/globalVariables';
import InfoCardGraphDom from './InfoCardGraphDom/index.vue';
import NodeInfo from './InfoCardGraphDom/NodeInfo.vue';
import SEInfoGraphDom from './SEInfoGraphDom/index.vue';
import { getEquipsByInGroupKey, rectCanSelectKey, rectCanActiveKey } from './constants/injectKey';
import { LINE_FLOW_CONFIGS } from './constants/common';
import { onBeforeUnmount } from 'vue';
import GroupHoverPanel from '@/components/groupHoverPanel/index.vue';

const NOVER_POPUP_GROUP_CLASSCODES = ['ACOTU'];
const popupGruopIds = ref([]);
const popupQueryData = ref(null);
const props = defineProps({
    handleDataHook: {
        type: Function,
        default: a => a
    },
    shouldHadSubGraph: {
        type: Function,
        default: null
    },
    equipGroupCannotSelect: {
        type: Function,
        default: null
    },
    enableHoverGroup: {
        type: Function,
        default: null
    },
    enableSelect: {
        type: Function,
        default: null
    },
    chartAttr: {
        type: Object,
        default: null
    },
    equipGroupInfo: {
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
    canHoverGroupSelect: {
        type: Boolean,
        default: false
    },
    // 支持表达的状态编码
    supportStatusCodes: {
        type: Array,
        default: () => []
    },
    // hover卡片用新API
    useHoverNewApi: {
        type: Boolean,
        default: false
    },
    // 需要关系流动
    needLineFlow: {
        type: Boolean,
        default: false
    },
    curSystemId: {
        type: String,
        default: ''
    },
    cancelLoading: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: true
    },
    // 线条流动配置
    lineFlowConfig: {
        type: Object,
        default: () => {}
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

let curHoverGraphModel = null,
    loadingInstance = null;
const queryShellConfigPromise = props.needLineFlow ? queryShellConfig() : null;

// 缩放恢复默认
const chartWarp = ref();
provide('chartWarp', chartWarp);

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

const handleClick = modelData => {
    console.log(11222);

    popupQueryData.value = null;
    const modal = chart.value.findById(modelData.id);
    const modalData = modal.getModelData();
    if (!rectCanActive(modalData)) return;
    if (!rectCanSelect(modalData)) return;
    removeChoose();

    // 应该有子视图，但没有的
    if (props.shouldHadSubGraph && props.shouldHadSubGraph(modalData.dataObject) && !modelData?.interactiveConfigVo?.canJump) {
        $Message.error({
            title: i18n.global.t('meos_control_web.sub_view_missing_check_diagram_published'),
            className: 'acac-cannot-jump-subgraph-err'
        });

        return;
    }
    if (!modelData.interactiveConfigVo || !modelData.interactiveConfigVo.canJump) {
        bubbleChartModal.value = modal;
        bubbleChartModal.value?.setState('selected', true);
        hightLightLines(modalData.dataObject);
        chooseDomItem(modalData.id);
        // 直接打开详情
        emit('clickNode', modalData.dataObject, modalData);
        bubbleShowName.value = true;
    } else {
        toRelationChart(modal);
    }
};

const getEquipsByInGroup = equipGroupId => {
    if (props.equipGroupInfo) {
        return props.equipGroupInfo[equipGroupId];
    }
};
const openDetail = dataObject => {
    emit('clickNode', dataObject);
};

const onClickMoreInfo = dataObject => {
    const chartModel = chart.value.findOneModel(model => model.getModelData()?.dataObject?.id === dataObject.id);
    if (chartModel) {
        const modalData = chartModel.getModelData();
        bubbleChartModal.value = chartModel;
        bubbleChartModal.value?.setState('selected', true);
        chooseDomItem(modalData.id);
        // 直接打开详情
        emit('clickNode', modalData.dataObject, modalData);
        bubbleShowName.value = true;
        popuptipsRef.value?.hideTipsNow();
        popupQueryData.value = null;
    }
};
const onClickItem = dataObject => {
    removeChoose();
    emit('clickNode', dataObject);
};
const rectCanSelect = modelData => {
    if (!modelData) return false;
    const data = modelData;
    const { dataObject } = data;
    if (dataObject?.objType === OBJ_TYPE.EQUIPGROUP) {
        if (props.equipGroupCannotSelect) {
            return !props.equipGroupCannotSelect(dataObject);
        }
    }
    if (props.enableSelect) {
        return props.enableSelect(data);
    }
    return true;
};
const rectCanActive = modelData => {
    if (!modelData) return false;
    const data = modelData;
    const { dataObject } = data;
    if (props.enableHoverGroup && props.enableHoverGroup(data)) {
        return true;
    }
    return dataObject?.objType === OBJ_TYPE.EQUIPMENT || dataObject?.objType === OBJ_TYPE.EQUIPMENTNODE || dataObject?.objType === OBJ_TYPE.EQUIPGROUP;
};

const _handleHoverModal = targetModel => {
    popupQueryData.value = null;
    popupGruopIds.value = [];
    removeHoverDomItem();
    if (!targetModel) return;
    const modelData = targetModel.getModelData();
    if (!rectCanActive(modelData)) {
        return;
    }
    targetModel.setState('hover', true);
    const data = targetModel.getModelData();
    const { dataObject } = data;
    if (chartWarp.value && rectCanSelect(modelData)) {
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
    if (data.dataObject.objType === OBJ_TYPE.EQUIPGROUP && !NOVER_POPUP_GROUP_CLASSCODES.includes(data.dataObject?.classCode)) {
        popupGruopIds.value = props.equipGroupInfo[data?.dataObject?.id] || [];
    } else if (props.enableHoverGroup && props.enableHoverGroup(data)) {
        popupGruopIds.value = props.enableHoverGroup(data);
    } else {
        popupQueryData.value = {
            ...unref(props).chartAttr,
            ...unref(dataObject),
            objType: OBJ_TYPE.EQUIPMENT,
            graphTypeCode: props.chartAttr?.imageOrProductName
        };
    }
};

const _handleUnHoverModal = targetModel => {
    if (!rectCanActive(targetModel?.getModelData())) return;
    removeHoverDomItem();
    targetModel.setState('hover', false);
    if (chartWarp.value) {
        chartWarp.value.style.cursor = 'default';
    }
    popupQueryData.value = null;
    popupGruopIds.value = [];
};

const handleHover = data => {
    const modal = chart.value?.findById(data.id);
    if (modal) {
        _handleHoverModal(modal);
    }
};

const handleNameUnHover = data => {
    if (curHoverGraphModel && curHoverGraphModel.getModelData()?.id === data?.id) {
        return;
    }
    removeHoverDomItem();
    const modal = chart.value?.findById(data.id);
    if (modal) {
        _handleUnHoverModal(modal);
    }
};

const switchRelationChart = data => {
    popupQueryData.value = null;
    popupGruopIds.value = [];

    popuptipsRef.value?.hideTipsNow();
    emit('switchRelationChart', data);
};

const initChartEvents = () => {
    chart.value.on('dragstart', () => {});

    chart.value.on('dragend', () => {});

    chart.value.on('hover', event => {
        const { targetModel } = event;
        curHoverGraphModel = targetModel;
        _handleHoverModal(targetModel);
    });

    chart.value.on('unhover', event => {
        const { targetModel } = event;
        curHoverGraphModel = null;
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
} = useChartLoadOption(initChartEvents, unref(props).handleDataHook, props, idMapInfoCodes, rectCanSelect);

const { resize, restoreDefault, transformToRealSize, realSize, defaultSize, invisibleRequireSized } = useStageOperate(chart, chartOriginData);

const { renderDomList, clearDomList } = useDomContainDataHandle(domDataRef, chart);

const { infoDetails, loadInfoDetails, abortLoadInfoDetails, bindChartEffect } = useInfoCard(chart, classCodeEquipIdsMap, idMapInfoCodes, chartOriginData);

// 图元视图变动操作hook
const { shakeName, clearShakeName, chooseDomItem, removeDomItemChoose, updateAbnormalData, hoverDomItem, removeHoverDomItem } = useChartViewOperate(renderDomList, infoPlanes);

const curLineFlowConfig = LINE_FLOW_CONFIGS[props.runningMonitorType] || props.lineFlowConfig;

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
    const idMapCodes = {};
    Object.keys(idMapInfoCodes.value || {}).forEach(id => {
        const arr = Object.keys(idMapInfoCodes.value[id] || {});
        idMapCodes[id] = [...new Set(arr)];
    });
    emit('afterLoadChart', {
        data,
        renderDomList: renderDomList.value,
        legendData,
        idMapInfoCodes: idMapCodes,
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

        const detailPromise = loadInfoDetails(systemGraphDuplicateId, loadGraphPrimse);

        data = await loadGraphPrimse;
        if (chartWarp.value) {
            chartWarp.value.style.cursor = 'default';
        }
        prepareLineFlow(data);
        nextTick(() => {
            chart.value.bindDomLayer(domLayer.value);

            resize();
            restoreDefault();
            realSize.value = false;
            defaultSize.value = true;
            bindChartEffect();
            bindLineEffect();
        });
        graphDataloading.value = false;
        noRelationData.value = !data;
        await detailPromise;
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
    idMapInfoCodes.value = {};
    chartOriginData.value = {};
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
    popupQueryData.value = null;
    popupGruopIds.value = [];
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

const templateTypeAllLoading = inject('templateTypeAllLoading', ref());

watch(
    [() => showLoading.value, () => props.cancelLoading],
    () => {
        if (props.cancelLoading) {
            loadingInstance?.destroy();
            templateTypeAllLoading.value = false;
            return;
        }
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

provide(getEquipsByInGroupKey, getEquipsByInGroup);
provide(rectCanSelectKey, rectCanSelect);
provide(rectCanActiveKey, rectCanActive);

defineExpose({ updateAbnormalData, removeChoose, shakeName, clearShakeName, getEquipsByInGroup, systemGraphDuplicateId: systemGraphDuplicateId, graphDataloading });
</script>
<style lang="less">
.acac-cannot-jump-subgraph-err {
    &.message-item {
        padding-right: 10px;
    }
}
</style>
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
        height: calc(100% - 50px);
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 10;
        background-color: transparent;
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
