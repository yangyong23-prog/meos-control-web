// @ts-ignore
import i18n from '@/localization';
import { SysChartApplication } from '@yushu/relation-chart';
import baseStore from '@/store/baseStore';
import { INTERFACE_PREFIX_MEOS } from '@/config';
import { SHOW_DOM_COM_MAP, SHOW_LIQUID_CLASSCODE } from '../constants/common';
import { getSELayoutNodes } from './seLayout';
import useStore from '@/store';
import { isEdge } from '@/utils/envUtils';
import DockSingleton from '@/hooks/responsiveDock';
import { OBJ_TYPE } from '@/utils/globalVariables';

const LAYOUT_GRAPH_CLASSCODE = ['SEHD', 'SELD'];

const defaultTextSort = 'localName>B1>T2>L1>R1>L2>R2>T1>B2>C1>C2'.split('>');
const centerTextSort = 'localName>C2>C1>C3>B1>T2>L1>R1>L2>R2>T1'.split('>');
const topTextSort = 'localName>T1>T2>T3>L1>R1>L2>R2>C1>C2>B1'.split('>');
const leftTextSort = 'localName>L1>L2>L3>>R1>R2>R3>B1>T2>T1'.split('>');

const rectDefaultStyleFn = data => {
    const { dataObject } = data;
    if (dataObject.objType === OBJ_TYPE.EQUIPMENT) {
        return {
            stroke: '#ffffff',
            strokeWidth: 2,
            borderRadius: 8,
            fillColor: '#E1EBF7'
        };
    } else if (dataObject.objType === OBJ_TYPE.EQUIPGROUP) {
        return {
            stroke: '#ffffff',
            strokeWidth: 2,
            borderRadius: 8,
            fillColor: '#E1EBF7'
        };
    } else if (dataObject.objType === OBJ_TYPE.SPACE) {
        return {
            stroke: '#C4C9CF',
            strokeWidth: 1,
            borderRadius: 8,
            fillColor: '#ffffff'
        };
    }
};

const rectStatesFn = nodeData => {
    // WSSTCP
    if (nodeData.dataObject && SHOW_LIQUID_CLASSCODE.includes(nodeData.dataObject.classCode)) {
        return {
            // 超高液位
            superHightLiquid: {
                stroke: '#E63C35',
                gradientFillColor: '0 #FFF5F5 0.1 #FFF5F5 0.1 #FFC8C8 1 #ffffff',
                priority: 5
            },
            // 高液位
            hightLiquid: {
                stroke: '#F29F00',
                gradientFillColor: '0 #FFFBE6 0.2 #FFFBE6 0.2 #FFD990 1 #ffffff',
                priority: 4
            },
            // 正常液位
            normalLiquid: {
                stroke: '#215DD9',
                gradientFillColor: '0 #E8F3FF 0.3 #E8F3FF 0.3 #9FC9FB 1 #ffffff',
                priority: 3
            }
        };
    } else {
        return {};
    }
};
const lineStates = {
    hightLight: {
        strokeWidth: 26,
        backgroundWidth: 20,
        priority: 10
    },

    flowFoward: {
        // backgroundColor: '#246FE5',
        wireCoreColor: '#ffffff',
        wireCoreWidth: 6,
        strokeColor: '#246FE5',
        // strokeWidth: 26,
        toZTop: true,
        animate: true,
        dash: true,
        showArrow: true,
        dashOffset: -30,
        flowSpeed: 40,
        // renderOrder: 20,

        direction: 'F',
        priority: 6
    },
    higherOrder: {
        renderOrder: 20,
        priority: 6
    },
    lowerOrder: {
        renderOrder: 5,
        priority: 6
    },
    flowBack: {
        // backgroundColor: '#246FE5',
        wireCoreColor: '#ffffff',
        wireCoreWidth: 6,
        strokeColor: '#246FE5',
        toZTop: true,
        animate: true,
        dash: true,
        showArrow: true,
        dashOffset: 30,
        flowSpeed: 40,
        // renderOrder: 20,

        direction: 'T',
        priority: 6
    },
    mismatchedCond: {
        backgroundColor: '#C4C9CF',
        wireCoreColor: '#C4C9CF',
        strokeWidth: 1,
        toZTop: false,
        animate: false,
        showArrow: false,
        dash: false,
        // renderOrder: 5,

        priority: 10
    }
};
export default (initChartEvents, handleDataHook = a => a, props, idMapInfoCodes, rectCanSelect) => {
    const { setIotData: _setIotData } = DockSingleton.getInstance();
    const chartRendered = ref(false);
    const chart = shallowRef();
    const relationChartId = 'RELATION_CHART_ID';
    const domDataRef = ref([]);
    const legendScaleRatio = ref(1);
    const classCodeEquipIdsMap = ref({});
    const globalFontSize = ref();
    const chartOriginData = shallowRef({});
    const linkObjects = shallowRef([]);
    const infoPlanes = ref([]);
    const cabinetNumbers = ref([]);
    const ctList = ref([]);
    const selectInfos = ref([]);
    const currentSelectedInfoCode = ref('');
    const webLayout = ref(false);
    const systemGraphDuplicateId = ref(''); // 记录当前系统图的id

    const nodesWithSubGraph = ref([]); // 有子图的打包节点

    let cancelCreateChartView = null,
        cancelChartLoad = null;
    // cancelChartLoadFn = null;

    const liquidObjs = ref([]); // 需要显示液位的数据
    // 定义图请求参数
    SysChartApplication.registerEnvParams({
        // TEST TODO
        baseUrl: INTERFACE_PREFIX_MEOS,
        // baseUrl: 'http://172.16.2.165:8089' || INTERFACE_PREFIX_MEOS,
        projectId: baseStore().projectId,
        groupCode: baseStore().groupCode,
        token: baseStore().token || ''
    });

    // 样式处理
    const nodeStatesFn = nodeData => {
        // const { iconVoList } = nodeData?.legendUrlVo ? nodeData.legendUrlVo[0] : {};
        // const statusObj = {};
        // iconVoList?.forEach(icon => {
        //     const conditionObj = sortMapByKey(JSON.parse(icon.condition));
        //     icon.condition = JSON.stringify(conditionObj);
        //     statusObj[icon.condition] = {
        //         fileUrl: icon.fileUrl
        //     };
        // });

        const infoValues = nodeData?.legendNode?.legendIcon?.infoValues || [];
        const statusObj = {};
        infoValues.forEach(info => {
            if (info.fileUrl) {
                statusObj[info.infoValue] = { fileUrl: info.fileUrl };
            }
        });
        const nodeStateStyleOption = {
            valveClose: {
                // 电动通断水阀 关闭状态
                filterParameter: 'grayscale(1)',
                priority: 1
            },
            close: {
                // filterCode: ['grey'],
                filterParameter: 'contrast(1.01) saturate(0) ',
                priority: 1
            },
            noIotRule: {
                filterParameter: 'sepia(0.35) hue-rotate(56deg)',
                priority: 4
            },
            noData: {
                filterParameter: 'grayscale(1) brightness(0.9) opacity(30%)',
                priority: 2
            },
            offline: {
                filterCode: ['grey'],
                priority: 3
            },
            open: {
                filterCode: [],
                priority: 4
            },
            hover: {
                complexFilterCode: ['shadow'],
                anchorTextColor: '#246FE5',
                priority: 5
            },
            selected: {
                complexFilterCode: ['dark'],
                anchorTextColor: '#246FE5',
                priority: 6
            },
            loading: {
                complexFilterParameter: 'opacity(0.2)',
                priority: 7
            }
        };
        if (rectCanSelect && !rectCanSelect(nodeData)) {
            nodeStateStyleOption.selected = {};
        }

        if (Object.keys(statusObj).length) {
            return { ...nodeStateStyleOption, ...statusObj };
        }
        return nodeStateStyleOption;
    };

    const staticInfoCodes = {
        localName: true
    };

    const setIotData = (id, infoCode, obj) => {
        if (id && !staticInfoCodes[infoCode] && idMapInfoCodes?.value) {
            if (!idMapInfoCodes.value[id]) {
                idMapInfoCodes.value[id] = {};
            }
            idMapInfoCodes.value[id][infoCode] = true;
        }
        _setIotData(id, infoCode, obj);
    };

    const recordEquipIds = (equipObj, infoCodeItems) => {
        if (!equipObj) {
            return;
        }
        const { classCode } = equipObj;

        if (!classCodeEquipIdsMap.value[classCode]) {
            classCodeEquipIdsMap.value[classCode] = [];
        }

        const eqIds = classCodeEquipIdsMap.value[classCode];
        if (eqIds.indexOf(equipObj.id) === -1) {
            eqIds.push(equipObj.id);
        }

        infoCodeItems?.forEach(obj => {
            setIotData(equipObj.id, obj.infoCode, obj);
        });
    };

    const handleTextMap = da => {
        if (da.textMap) {
            const textMapInfoCodes = Object.keys(da.textMap)
                .filter(tKey => {
                    const tmObj = da.textMap[tKey];
                    if (tmObj.infoDetail) {
                        return true;
                    }
                    return false;
                })
                .map(tKey => {
                    // console.log('tKey: ', tKey);
                    const tmObj = da.textMap[tKey];
                    tmObj.infoCode = tKey;
                    return {
                        ...tmObj,
                        ...da.infoDetail,
                        infoCode: tKey
                    };
                });
            if (textMapInfoCodes?.length > 0) {
                recordEquipIds(da.dataObject, textMapInfoCodes);
            }
        }
    };

    // 数据处理
    const handleData = originData => {
        // 需要在这里抽象出一些需要绘制的文本框
        const showList = [];
        legendScaleRatio.value = originData?.legendScaleRatio || 1;
        globalFontSize.value = originData?.fontSize || 24;

        const liquidObjsTemp = []; // 需要显示液位的数据
        const _nodesWithSubGraph = [];

        originData?.equipmentNodeVos?.forEach(da => {
            const { localName, objType } = da.dataObject;
            if (!localName) return;
            if (!da?.textMap) return;
            let sortList = defaultTextSort,
                txtObj,
                i = 0;

            if (da?.compType === 'packNode') {
                sortList = centerTextSort;
                while (!txtObj && i < sortList.length) {
                    const tag = sortList[i++];
                    txtObj = da.textMap[tag];
                }
                if (txtObj) {
                    txtObj.name = localName;
                }
                // 打包节点，且能跳转子图的
                if (da.interactiveConfigVo?.canJump) {
                    _nodesWithSubGraph.push(da);
                }
                da.dataObject.isPackNode = true;
                da.dataObject.objType = 'packNode';
            } else if (objType === OBJ_TYPE.EQUIPMENT || objType === OBJ_TYPE.SYSTEM || da.compType === 'packNode' || objType === OBJ_TYPE.EQUIPGROUP) {
                recordEquipIds(da.dataObject, da.fixedInfoCodes);
                if (da.drawerAllInfoCodes) {
                    recordEquipIds(da.dataObject, da.drawerAllInfoCodes);
                }
                if (da.panelNode?.infoCodes) {
                    recordEquipIds(da.dataObject, da.panelNode.infoCodes);
                }

                handleTextMap(da);
                showList.push(da);
                da.__showComs = [SHOW_DOM_COM_MAP.Name, SHOW_DOM_COM_MAP.IotList, SHOW_DOM_COM_MAP.LoadingStatus, SHOW_DOM_COM_MAP.PorwerDown];
            } else if (objType === OBJ_TYPE.SPACE) {
                showList.push(da);
                da.__showComs = [SHOW_DOM_COM_MAP.Name];
            }
        });

        // 处理groupViews  设备组
        originData?.groupVos?.forEach(da => {
            if (!da.id) {
                da.id = 'group_' + da.dataObject.id;
            }
            recordEquipIds(da.dataObject, da.fixedInfoCodes);
            handleTextMap(da);
            showList.push(da);
            if (SHOW_LIQUID_CLASSCODE.includes(da.dataObject.classCode)) {
                liquidObjsTemp.push(da);
            }
            da.__showComs = [SHOW_DOM_COM_MAP.Name, SHOW_DOM_COM_MAP.IotList, SHOW_DOM_COM_MAP.LoadingStatus, SHOW_DOM_COM_MAP.PorwerDown];
        });

        originData?.passByVos?.forEach(da => {
            recordEquipIds(da.dataObject, da.fixedInfoCodes);
            handleTextMap(da);
            da.__showComs = [SHOW_DOM_COM_MAP.NodeMark, SHOW_DOM_COM_MAP.IotList, SHOW_DOM_COM_MAP.LoadingStatus];
            showList.push(da);
        });

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
        const graphClassCode = props.chartAttr?.classCode;
        if (LAYOUT_GRAPH_CLASSCODE.indexOf(graphClassCode) > -1) {
            webLayout.value = true;
            const {
                containerBgs,
                linkObjects: _linkObjects,
                infoPlanes: _infoPlanes,
                cabinetNumbers: _cabinetNumbers,
                leftInfoPoints,
                infosSelectDatas
            } = getSELayoutNodes(originData);
            originData.__containerBgs = containerBgs;
            linkObjects.value = _linkObjects;
            infoPlanes.value = _infoPlanes;
            cabinetNumbers.value = _cabinetNumbers;
            ctList.value = leftInfoPoints;
            selectInfos.value = infosSelectDatas;
            currentSelectedInfoCode.value = selectInfos.value?.[0]?.options[0]?.infoCode || '';
        } else {
            webLayout.value = false;
            linkObjects.value = [];
            infoPlanes.value = [];
            cabinetNumbers.value = [];
            ctList.value = [];
            selectInfos.value = [];
            currentSelectedInfoCode.value = '';
        }
        // 如果名字已在卡片中显示，则不在其他部分显示
        infoPlanes.value.forEach(infoPlane => {
            const item = showList.find(item => item.id === infoPlane.relObj.id);
            if (item) {
                const index = item.__showComs.indexOf(SHOW_DOM_COM_MAP.Name);
                if (index >= 0) {
                    item.__showComs.splice(index, 1);
                }
            }
        });
        domDataRef.value = structuredClone(showList);
        liquidObjs.value = structuredClone(liquidObjsTemp);

        chartOriginData.value = originData;
        nodesWithSubGraph.value = _nodesWithSubGraph;
        handleDataHook(originData || []);

        return originData;
    };

    const initChart = () => {
        if (chart.value) return;
        chart.value = new SysChartApplication(relationChartId, {
            fitView: true,
            minZoom: 0.1,
            maxZoom: 2,
            nodeStates: nodeStatesFn,
            rectStates: rectStatesFn,
            rectDefaultStyle: rectDefaultStyleFn,
            lineDefaultStyle: {
                renderOrder: 10
            },
            lineStates,
            lineSetting: {
                isInteractive: false,
                useFlowAnimation: false,
                // flowShapeType: 'DASH',
                flowShapeType: 'ARROW',
                arrowGap: 150
            }
        });
        chart.value.on('beforeLoad', (queryData, next) => {
            // console.log('aaaa queryData', queryData);
            systemGraphDuplicateId.value = queryData.id;
        });

        chart.value.on('afterLoad', (originData, next) => {
            next(handleData(originData));
        });

        initChartEvents();
    };

    const initNodeState = () => {
        const liquidIds = liquidObjs.value?.map(da => da.dataObjectId) || [];
        chart.value?.traverseModels(model => {
            const modelData = model.getModelData();
            if (liquidIds.indexOf(modelData.dataObjectId) > -1) {
                model.setState('normalLiquid', true);
            }
        });
    };

    onMounted(() => {
        initChart();
    });

    onBeforeUnmount(() => {
        abortLoadGraphById();
        chart.value?.destroy();
        chart.value = null;
    });

    const abortLoadGraphById = () => {
        cancelChartLoad?.abort();
        cancelCreateChartView?.abort();
        cancelChartLoad = null;
        cancelCreateChartView = null;
    };

    // eslint-disable-next-line one-var
    let timer;
    const loadGraphById = async id => {
        abortLoadGraphById();
        cancelChartLoad = new AbortController();

        let exportData = null;
        // 加载系统图数据
        const { base } = useStore();
        const { runningMonitorType = '', IPType = '', startTime = '', endTime = '' } = base.headerConfig;
        timer && clearTimeout(timer);
        const chartHeaders = !isEdge()
            ? {
                  ...(runningMonitorType
                      ? {
                            runningMonitorType,
                            IPType,
                            IPDataStartTime: startTime,
                            IPDataEndTime: endTime
                        }
                      : {}),
                  ...(base.precisionCurrentRule ? { removeDefaultIpType: 'true' } : {})
              }
            : {};
        exportData = await chart.value.load({
            id,
            signal: cancelChartLoad.signal,
            headers: chartHeaders
        });

        cancelCreateChartView = new AbortController();
        await chart.value.createChart(cancelCreateChartView.signal);
        chartRendered.value = true;
        timer = setTimeout(() => {
            initNodeState();
        }, 1000);
        return exportData;
    };

    return {
        relationChartId,
        chart,
        chartRendered,
        loadGraphById,
        abortLoadGraphById,
        legendScaleRatio,
        globalFontSize,
        chartOriginData,
        domDataRef,
        classCodeEquipIdsMap,
        linkObjects,
        infoPlanes,
        cabinetNumbers,
        ctList,
        selectInfos,
        currentSelectedInfoCode,
        webLayout,
        systemGraphDuplicateId,
        nodesWithSubGraph
    };
};
