import { SysChartApplication } from '@yushu/relation-chart';
import { ref, onUnmounted, onMounted, inject, nextTick, watchEffect, watch } from 'vue';
import { getToken } from '@/utils/auth';
import { INTERFACE_PREFIX_MEOS } from '@/config';
import { getSELDLayoutNodes } from './seldLayout';
import { currentTemplateObjectKey } from '@/utils/injectionKey';
import { getSystemGraphData } from '@/api/RelationChartEditor';
import {
    editorKey,
    graphHeaderDataKey,
    containerBgsPostDataKey,
    graphIdKey,
    legendScaleRatioKey,
    isEditDetailsKey,
    globalFontSizeKey,
    copyCompleteKey
} from '@/utils/injectionKey';
import { useErrorMessage } from '@/utils';
import { SUCCESSCODE, LAYOUTSELD_GRAPH_CLASSCODE } from '@/utils/globalVariables';

import useLoading from '@/hooks/useLoading';
const { openLoading, closeLoading } = useLoading('relation-chart-editor-content', '#F1F4F6', 'ball');
import { useMainStore } from '@/store';
import { debounce } from 'lodash';
import { CUSTOM_CONTAINER_CLASS } from '@/utils/globalVariables';

const defaultTextSort = 'B1>T2>L1>R1>L2>R2>T1>B2>C1>C2'.split('>');
const topTextSort = 'T1>T2>T3>L1>R1>L2>R2>C1>C2>B1'.split('>');
const leftTextSort = 'L1>L2>L3>>R1>R2>R3>B1>T2>T1'.split('>');

const cancelRequestSignal = Symbol('getSystemGraphData');

const nodeStatesFun = () => {
    return {};
};

const useChartHook = (props, emits) => {
    const isEditDetails = inject(isEditDetailsKey);
    const globalFontSize = inject(globalFontSizeKey);
    const sysChartApplication = ref();
    const ChartBoxRef = ref();
    const resizeObserver = ref();
    const currentTemplateObject = inject(currentTemplateObjectKey);
    const layout = ref();
    const legendScaleRatio = inject(legendScaleRatioKey);
    const requestStartTime = ref(0);
    const requestEndTime = ref(0);
    const editor = inject(editorKey);
    const containerBgsPostData = inject(containerBgsPostDataKey);
    const graphId = inject(graphIdKey);
    const copyComplete = inject(copyCompleteKey);
    // const showLoading = ref(false);
    const isEmpty = ref(false);

    const isDefaultSize = ref(false);
    const infoPlanes = ref([]);
    const planNodeList = ref([]);
    const textMapList = ref([]);

    const graphHeaderData = inject(graphHeaderDataKey);
    // 数据处理
    const handleData = originData => {
        infoPlanes.value = [];
        containerBgsPostData.value = [];
        if (originData) {
            originData.__containerBgs = [];
        }
        if (
            graphHeaderData.value.graphType === 1 &&
            LAYOUTSELD_GRAPH_CLASSCODE.indexOf(currentTemplateObject.value?.classCode) > -1
        ) {
            const { containerBgs, infoPlanes: _infoPlanes } = getSELDLayoutNodes(originData);
            infoPlanes.value = _infoPlanes;
            containerBgsPostData.value = containerBgs.map(bg => {
                return {
                    code: bg.code,
                    objectId: bg.objectId,
                    type: bg.type,
                    data: {
                        containerBg: {
                            size: bg.size,
                            viewType: bg.viewType,
                            absoluteLocation: bg.absoluteLocation
                        }
                    }
                };
            });
            originData.__containerBgs = containerBgs;
        }
        return originData;
    };
    /**
     * 异步获取系统图表应用程序。
     * 此函数初始化一个系统图表应用实例，并配置其基本属性，如画布适应性、缩放范围和节点样式。
     * 随后，它加载指定的图表并创建图表本身。
     *
     * @returns {void}
     */
    const initChartStage = () => {
        const registerEnvParams = {
            baseUrl: INTERFACE_PREFIX_MEOS,
            projectId: useMainStore().projectId,
            groupCode: useMainStore().groupCode,
            token: getToken()
        };
        SysChartApplication.registerEnvParams(registerEnvParams);

        sysChartApplication.value?.destroy?.();
        // 首先，将sysChartApplication的值重置为undefined，确保后续赋值是全新的实例
        sysChartApplication.value = undefined;
        // 创建SysChartApplication的新实例，并配置其属性
        sysChartApplication.value = new SysChartApplication(props.chardDomId, {
            // 启用画布自动适应视图
            // fitView: true,
            // 设置最小缩放比例
            minZoom: 0.1,
            // 设置最大缩放比例
            maxZoom: 2,
            // 配置节点的默认样式
            nodeDefaultStyle: {},
            // 配置节点的状态处理函数
            nodeStates: nodeStatesFun
        });

        sysChartApplication.value.on('afterLoad', (originData, next) => {
            next(handleData(originData));
        });

        sysChartApplication.value.on('wheel', () => {
            isDefaultSize.value = false;
        });

        sysChartApplication.value.on('dragmove', () => {
            isDefaultSize.value = false;
        });

        // 安装编辑器
        if (graphHeaderData.value.graphType === 1 && graphHeaderData.value?.status !== 1) {
            editor.enable(true);
        } else {
            editor.enable(false);
        }

        sysChartApplication.value.use(editor);
    };

    /**
     * 绑定DOM层到图表应用。
     * 此函数用于将图表的DOM层与系统图表应用程序关联起来，确保图表能够正确渲染在指定的DOM元素上。
     */
    const bindDomLayer = () => {
        sysChartApplication.value?.bindDomLayer(ChartBoxRef.value);
        setResize();
    };

    const queryRelationChartData = async () => {
        const res = await getSystemGraphData(
            {
                selectChartId: graphId.value
            },
            cancelRequestSignal
        );
        if (res.code === SUCCESSCODE) {
            const originData = res?.data || {
                equipmentNodeVos: [],
                systemGraphDetailVOs,
                isUpdateDetail,
                isEmpty: true
            };

            // 获取信息面板数据
            const { equipmentNodeVos, systemGraphDetailVOs, isUpdateDetail } = originData;
            if (LAYOUTSELD_GRAPH_CLASSCODE.indexOf(currentTemplateObject.value?.classCode) === -1) {
                planNodeList.value = equipmentNodeVos
                    .map(da => {
                        if (da.panelNode) {
                            return {
                                ...da.panelNode,
                                relDataObjectId: da.dataObjectId,
                                relDataObjectName: da.dataObject.localName || ''
                            };
                        } else {
                            return undefined;
                        }
                    })
                    .filter(Boolean);
            }
            textMapList.value = equipmentNodeVos
                .map(da => {
                    if (da.textMap) {
                        return {
                            textMap: da.textMap,
                            dataObject: da.dataObject
                        };
                    } else {
                        return undefined;
                    }
                })
                .filter(Boolean);
            // 竖井和楼层 字体处理
            originData?.areaVos?.forEach(da => {
                const { localName } = da.dataObject;
                if (!localName) return;
                if (!da?.textMap) return;
                let sortList = defaultTextSort,
                    txtObj,
                    i = 0;
                if (da.type === 'shaft') {
                    sortList = topTextSort;
                }
                if (da.type === 'floor') {
                    sortList = leftTextSort;
                }
                while (!txtObj && i < sortList.length) {
                    const tag = sortList[i++];
                    txtObj = da.textMap[tag];
                }
                if (txtObj) {
                    txtObj.name = localName;
                }
            });

            // 图纸是否更新过
            isEditDetails.value = Boolean(systemGraphDetailVOs?.length) || Boolean(isUpdateDetail);
            globalFontSize.value = Number(originData.fontSize || 24);
            return originData;
        } else {
            useErrorMessage(res.message);
        }
    };

    let cc;
    const loadData = async () => {
        openLoading();
        requestStartTime.value = new Date().valueOf();
        try {
            if (cc) cc.abort();
            cc = new AbortController();
            // 加载指定ID的图表数据
            await sysChartApplication.value?.load(null, queryRelationChartData);
            // 创建图表，完成图表的初始化和显示
            sysChartApplication.value?.createChart(cc.signal);
            legendScaleRatio.value = sysChartApplication.value?.data?.legendScaleRatio || 1;
            if (sysChartApplication.value?.data?.isEmpty) {
                isEmpty.value = true;
            } else {
                isEmpty.value = false;
            }
            emits('onload');
            nextTick(() => {
                bindDomLayer();
                resize();
                fitView();
            });
            closeLoadingFun();
        } catch (error) {
            closeLoadingFun();
        }
    };

    const closeLoadingFun = () => {
        requestEndTime.value = new Date().valueOf();
        if (requestEndTime.value - requestStartTime.value < 1000) {
            const timer = setTimeout(() => {
                closeLoading();
                clearTimeout(timer);
            }, 1000);
        } else {
            closeLoading();
        }
    };

    const getChartSizeInfo = () => {
        let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
        const detailDoms = document.querySelectorAll(`.${CUSTOM_CONTAINER_CLASS}`);
        // const widthHeights = [];

        detailDoms?.forEach(el => {
            // const r = el.getBoundingClientRect();
            const testData = el.dataset;
            const posArr = testData.position?.split('_');
            if (posArr?.length > 1) {
                const posX = parseFloat(posArr[0]);
                const posY = parseFloat(posArr[1]);
                const domW = el?.clientWidth ?? 0;
                const domH = el?.clientHeight ?? 0;
                console.log('r: ', testData.position, domW);
                minX = Math.min(minX, posX);
                minY = Math.min(minY, posY);
                maxX = Math.max(maxX, posX + domW);
                maxY = Math.max(maxY, posY + domH);
            }
            // widthHeights.push({ width: el?.clientWidth, height: el?.clientHeight });
        });
        // console.log('infoPoints: ', infoPoints);

        const bound = { minX, maxX, minY, maxY };

        // console.log('v.fitToRect: ',   rect);
        const rect = sysChartApplication.value.calculateChartSize(bound);
        console.log('rect: ', rect);
        if (rect) {
            return { rect };
        }
    };

    /**
     * 设置resize观察者。
     * 通过ResizeObserver监控布局的变化，以便在布局变化时自动调整图表的大小。
     */
    const setResize = () => {
        resizeObserver.value = new ResizeObserver(() => {
            resize();
        });
        layout.value = document.querySelector(`#${props.chardDomId}`);
        layout.value && resizeObserver.value?.observe(layout.value);
    };

    /**
     * 查看实时视图。
     * 调用系统图表应用程序的viewReal方法，用于切换到实时视图模式。
     */
    const viewReal = () => {
        sysChartApplication.value?.viewReal();
    };

    /**
     * 自适应视图。
     * 调用系统图表应用程序的fitView方法，用于调整图表的视图以适应当前的显示区域。
     */
    const fitView = () => {
        // sysChartApplication.value?.fitView();
        const info = getChartSizeInfo();
        if (info) {
            const padding = {};
            sysChartApplication.value?.fitToRect({
                rect: info.rect,
                direction: info.direction,
                padding
            });
            isDefaultSize.value = true;
        }
    };

    const resizeDebounce = debounce(() => {
        // 如果是恢复默认状态的，resize容器
        if (isDefaultSize.value) {
            sysChartApplication.value?.resizeContainer();
            fitView();
        } else {
            sysChartApplication.value?.resize();
        }
    }, 20);
    /**
     * 调整图表大小。
     * 当监控到布局变化时，调用此函数来重新调整图表的大小。
     */
    const resize = () => {
        resizeDebounce();
    };

    watchEffect(() => {
        if (graphHeaderData.value?.graphType === 1 && graphHeaderData.value?.status !== 1) {
            editor.enable(true);
        } else {
            editor.enable(false);
        }
        resize();
    });

    watch(
        [graphId, copyComplete],
        () => {
            if (graphId.value) {
                sysChartApplication.value?.clearCanvas();
                nextTick(() => {
                    loadData();
                });
            } else {
                sysChartApplication.value?.clearCanvas();
            }
        },
        {
            immediate: true
        }
    );

    onMounted(() => {
        initChartStage();
    });

    /**
     * 组件卸载时的清理工作。
     * 在组件卸载时，销毁图表应用实例并停止对布局变化的观察，以避免内存泄漏。
     */
    onUnmounted(() => {
        sysChartApplication.value?.destroy();
        if (layout.value) {
            resizeObserver.value?.unobserve(layout.value);
        }
    });

    return {
        sysChartApplication,
        ChartBoxRef,
        isEmpty,
        legendScaleRatio,
        planNodeList,
        textMapList,
        infoPlanes,
        loadData,
        viewReal,
        fitView,
        resize,
        getChartSizeInfo
    };
};

export default useChartHook;
