// @ts-ignore
import i18n from '@/localization';
import { getAnalysisDataTreeAxios, getBatchQueryPeriodDataAxios } from '@/apis/runAnalysis';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import dayjs from 'dayjs';
import { analysisTypeKey, globalTimeKey, fifteenMinuteTimesKey, systemIdKey } from '../injectionKey';
import useLoading from '@/hooks/useLoading';
import { ECHART_COLORS, SUCCESSCODE } from '@/utils/globalVariables';
import { forIn, uniqueId } from 'lodash';
import { splitArrayIntoChunks } from '@/utils/tools';
import { infoCodeMapKey } from './useBaseData';
const { cancelQuest, cancelToken } = UseCancelTokenHooks();

export const useQueryChartDataHook = () => {
    const { openLoading, closeLoading, loading } = useLoading(
        'sidebar-box-main',
        '#ffffff',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0,
        {
            zIndex: 1
        }
    );
    const infoCodeMap = inject(infoCodeMapKey);
    const ChartRef = ref();
    const Refresh = ref(true);
    const RefreshChart = ref(true);
    // 定义一个响应式引用变量loadingTree，用于控制加载状态
    const loadingTree = ref(false);

    // 获取分析类型，以便在组件内部使用
    const analysisType = inject(analysisTypeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js

    // 获取全局时间配置，用于时间相关的处理
    const globalTime = inject(globalTimeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js

    // 获取系统ID，用于与后端交互时标识特定系统
    const systemId = inject(systemIdKey); // ==> src\views\runAnalysis\hooks\useBaseData.js

    // 获取15分钟时间间隔列表，用于特定的定时或查询功能
    const fifteenMinuteTimes = inject(fifteenMinuteTimesKey); // ==> src\views\runAnalysis\hooks\useBaseData.js

    // 定义一个响应式引用数组treeData，用于存储树形数据结构
    const treeData = ref([]);

    // 定义一个响应式引用数组treeModel，可能用于存储与treeData相关的模型或状态
    const treeModel = ref([]);

    // 定义一个响应式引用数组batchQueryPeriodData，用于存储批量查询周期的数据
    const batchQueryPeriodData = ref([]);
    /**
     * 准备参数对象，将小组数据中的信息代码和对象ID整合到参数对象中
     * @param {Object} groupData - 包含小组信息的对象，每个小组有一个信息代码列表(infoCodes)和对象列表(objects)
     * @param {Object} params - 要填充的参数对象，需包含infoCodes和objectIds数组
     */
    const prepareParams = (groupData, params) => {
        // 遍历小组数据对象的每个属性
        for (const key in groupData) {
            // 确保属性属于小组数据对象本身而非原型链
            if (Object.prototype.hasOwnProperty.call(groupData, key)) {
                const element = groupData[key];
                // 从小组数据中提取信息代码列表，如果不存在则默认为空数组
                const infoCodes = element.infoCodes?.map(val => val.infoCode) || [];
                // 将提取的信息代码添加到参数对象的infoCodes数组中
                params.infoCodes.push(...infoCodes);
                // 同时将信息代码列表赋值给小组数据中的infoCodeArr属性
                element.infoCodeArr = infoCodes;
                // 从小组数据中提取对象ID列表，如果不存在则默认为空数组
                const objectIds = element.objects?.map(val => val.objectId) || [];
                // 将提取的对象ID添加到参数对象的objectIds数组中
                params.objectIds.push(...objectIds);
                // 同时将对象ID列表赋值给小组数据中的objectIdArr属性
                element.objectIdArr = objectIds;
            }
        }
    };

    /**
     * 异步获取批量查询周期数据的函数
     * 此函数负责发起数据查询请求，处理参数准备和数据处理的逻辑
     */
    const getBatchQueryPeriodData = async () => {
        // 打开加载中的状态提示
        openLoading();
        // 取消上一次未完成的请求，以避免请求累积
        cancelQuest();
        RefreshChart.value = false;
        nextTick(() => {
            RefreshChart.value = true;
        });
        // 清空之前的查询结果
        batchQueryPeriodData.value = [];
        // 获取分组数据，用于后续的数据处理
        const groupData = getGroupData();

        // 计算结束日期，加一天以确保包含所有需要的数据
        const endDate = dayjs(globalTime.value).add(1, 'day').format('YYYYMMDD000000');
        // 初始化查询参数
        const params = {
            beginDate: dayjs(globalTime.value).format('YYYYMMDD000000'),
            endDate,
            infoCodes: [],
            objectIds: [],
            enumTime: '15min'
        };
        // 准备查询参数，根据分组数据填充params
        prepareParams(groupData, params);
        // 确保objectIds唯一，避免重复查询
        params.objectIds = [...new Set(params.objectIds)];
        // 如果没有要查询的对象ID，则直接结束函数
        if (params.objectIds.length === 0) {
            closeLoading();
            return;
        }
        try {
            // 发起数据查询请求
            const { data, code } = await getBatchQueryPeriodDataAxios(params, { cancelToken: cancelToken() });
            // 如果请求成功，则处理查询到的数据
            if (code === SUCCESSCODE) {
                processBatchQueryData(groupData, data);
                // 处理数据统计类型的信息点
                handleStatisticalValue();
            }
        } catch (error) {
            // 捕获并打印错误信息
            console.log(error);
        } finally {
            // 无论请求成功或失败，都关闭加载中的状态提示
            closeLoading();
        }
    };
    function sumByTime(arrays) {
        // 创建一个映射表，用于按sort值存储累计总和
        const sumMap = {};
        let obj = null;
        // 遍历所有子数组
        arrays.forEach(subArray => {
            // 遍历子数组中的每个对象
            subArray.forEach(item => {
                if (!obj) {
                    obj = item;
                }
                const timeKey = item.time;
                // 处理null值，视为0
                const value = item.value === null ? 0 : item.value;

                // 如果该time值已存在，则累加；否则初始化
                if (sumMap[timeKey]) {
                    sumMap[timeKey] += value;
                } else {
                    sumMap[timeKey] = value;
                }
            });
        });

        // 将映射表转换为要求的数组格式，并按sort值排序
        return Object.keys(sumMap)
            .map(timeKey => ({
                ...obj,
                dataSources: [],
                time: timeKey,
                value: sumMap[timeKey]
            }))
            .sort((a, b) => {
                // 按时间字符串排序
                return a.time.localeCompare(b.time);
            });
    }
    const handleStatisticalValue = () => {
        batchQueryPeriodData.value.forEach(item => {
            if (item.statisticalValue !== undefined) {
                item.objects = item.infoCodes.map(v => ({ localName: v.name, objectId: v.infoCode, color: ECHART_COLORS[0], ...v }));
                item.children.forEach(val => {
                    const arr = [];
                    val.echartData.forEach(v => {
                        arr.push(v.data);
                    });
                    val.objects = item.objects;
                    val.objectIdArr = item.objects.map(obj => obj.objectId);
                    const output = sumByTime(arr);
                    const echartData = { ...val.echartData[0], data: output };
                    echartData.name = echartData.infoCode + '&&' + echartData.infoCode;
                    echartData.objectId = echartData.infoCode;
                    echartData.objectName = echartData.infoName;
                    echartData.dataSources = [];
                    val.echartData = [echartData];
                });
            }
        });
    };
    /**
     * 处理批量查询数据的主要函数
     * @param {Object} groupData - 分组数据，包含需要处理的各个分组及其相关信息
     * @param {Array} data - 批量查询得到的原始数据数组
     */
    const processBatchQueryData = (groupData, data) => {
        // 遍历每个分组，对其进行数据处理
        for (const key in groupData) {
            if (Object.prototype.hasOwnProperty.call(groupData, key)) {
                const element = groupData[key];
                console.log(element);
                // 处理每个分组内的对象
                processObjects(element);
                // 处理批量查询期间的数据
                handleBatchQueryPeriodData(element);
            }
        }

        /**
         * 处理分组内的对象数据
         * @param {Object} element - 分组元素，包含需要处理的对象信息
         */
        function processObjects(element) {
            // 为每个对象分配颜色，并根据数据项处理信息代码
            element.objects.forEach((object, i) => {
                object.color = ECHART_COLORS[i % ECHART_COLORS.length];
                const objectItem = data.find(item => item.objectId === object.objectId) || { objectId: object.objectId, objectName: object.localName ?? '--', data: [] };
                if (objectItem) {
                    // 处理对象的信息代码
                    processInfoCodes(element, object, objectItem, i);
                }
            });
        }

        /**
         * 处理信息代码数据
         * @param {Object} element - 分组元素，包含需要处理的信息代码
         * @param {Object} object - 当前处理的对象
         * @param {Object} objectItem - 对象对应的数据项
         */
        function processInfoCodes(element, object, objectItem, objectIndex) {
            // 遍历每个信息代码，处理其数据并生成图表所需的数据格式
            element.infoCodes.forEach((infoCode, i) => {
                const infoCodeData = objectItem.data.find(val => val.infoCode === infoCode.infoCode) || { infpCode: infoCode.infoCode, data: [] };
                if (infoCodeData) {
                    // 处理信息代码的具体数据
                    processInfoCodeData(infoCodeData);
                    // 将处理后的数据添加到分组元素的图表数据数组中
                    element.echartData.push(handleEchartData(object, infoCode, infoCodeData, i, element, objectIndex));
                }
            });
        }

        /**
         * 处理信息代码的具体数据
         * @param {Array} infoCodeData - 信息代码对应的数据数组
         */
        function processInfoCodeData(infoCodeData) {
            // 遍历信息代码的数据，格式化时间并转换值为数字
            infoCodeData.data.forEach(item => {
                item.time = dayjs(item.time).format('HH:mm');
                item.value = +item.ipValue;
            });
        }
    };
    /**
     * 处理批量查询期间的数据
     * 该函数用于将查询到的数据根据其parentId关联到其父级项中，或者创建新的父级项并关联子数据
     * @param {Object} data - 当前要处理的数据项，包含parentId、parentName、objects、infoCodes和children等属性
     */
    const handleBatchQueryPeriodData = data => {
        // 尝试在已有的数据中找到与当前数据项的parentId匹配的父级项
        const parent = batchQueryPeriodData.value.find(val => val.id === data.parentId);
        // 如果找到了匹配的父级项，则将当前数据项添加到该父级项的子项列表中
        if (parent) {
            parent.children.push(data);
        } else {
            // 如果没有找到匹配的父级项，则创建新的父级项，并将当前数据项作为其子项添加到列表中
            batchQueryPeriodData.value.push({
                id: data.parentId,
                name: data.parentName,
                objects: data.objects,
                infoCodes: data.infoCodes,
                newClassify: data.newClassify,
                statisticalValue: data.statisticalValue,
                children: [data]
            });
        }
    };
    /**
     * 根据输入的对象和信息码生成图表数据
     * @param {Object} object - 设备或区域对象，包含localName和objectId属性
     * @param {Object} infoCode - 信息码对象，包含name和infoCode属性
     * @param {Object} infoCodeData - 信息码对应的数据，包含time和value属性
     * @param {number} i - 当前对象的索引，用于判断线型
     * @param {Object} element - 包含对象数组的元素，用于判断线型
     * @returns {Object} - 返回一个对象，包含图表绘制所需的各种配置和数据
     */
    const handleEchartData = (object, infoCode, infoCodeData, i, element, objectIndex) => {
        // 返回一个对象，其中包含了图表绘制所需的各种配置和数据
        return {
            objectName: object.localName ?? '--',
            objectId: object.objectId,
            name: infoCode.infoCode + '&&' + (object.objectId ?? '--'),
            infoCode: infoCode.infoCode,
            infoName: infoCode.name,
            dataSources: infoCodeMap.value.get(infoCode.infoCode + object.classCode)?.dataSources || [],
            // id: infoCode.infoCode + '&&' + object.objectId,
            type: 'line',
            symbol: 'none',
            show: true,
            connectNulls: true,
            // 根据当前对象的索引和对象数组的长度决定线型
            lineStyle: {
                type: element.objects.length === 1 ? 'solid' : i === 1 ? 'dashed' : 'solid',
                color: element.objects.length === 1 ? null : ECHART_COLORS[objectIndex % ECHART_COLORS.length]
            },
            // 根据时间和数据生成图表的数据点
            data: fifteenMinuteTimes.value.map(val => {
                const value = infoCodeData.data.find(dataValue => dataValue.time === val);
                const baseObj = {
                    infoCode: infoCode.infoCode,
                    dataSources: infoCodeMap.value.get(infoCode.infoCode + object.classCode)?.dataSources || [],
                    infoName: infoCode.name,
                    time: val
                };
                if (value) {
                    return {
                        value: value.value ?? null,
                        ...baseObj
                    };
                } else {
                    return {
                        ...baseObj,
                        value: null
                    };
                }
            })
        };
    };
    /**
     * 异步获取树形数据
     * 此函数旨在请求服务器获取分析数据树，更新树模型和树数据，同时管理加载状态
     * 使用Axios进行异步请求，并处理响应结果以更新前端数据结构
     */
    const getTreeData = async () => {
        // 取消之前的请求，以避免多次请求的并发
        cancelQuest();
        // 清空树模型，准备更新新的数据
        treeModel.value = [];
        try {
            // 发起异步请求获取分析数据树，携带必要的参数
            const res = await getAnalysisDataTreeAxios({ analysisType: analysisType.value, systemId: systemId.value }, { cancelToken: cancelToken() });
            res.data.forEach(item => {
                // 使用Set收集唯一objectId，避免重复遍历
                const objectMap = new Map();
                const isNewClassobjectMap = new Map();
                item.children?.forEach(v => {
                    v.children.forEach(s => {
                        s.objects.forEach(obj => {
                            if (item.newClassifyInfoCodes.includes(s.infoCode)) {
                                if (!isNewClassobjectMap.has(obj.objectId)) {
                                    isNewClassobjectMap.set(obj.objectId, obj);
                                }
                            } else {
                                if (!objectMap.has(obj.objectId)) {
                                    objectMap.set(obj.objectId, obj);
                                }
                            }
                        });
                    });
                });
                const objects = Array.from(objectMap.values());
                const isNewClassobjects = Array.from(isNewClassobjectMap.values());
                item.children?.forEach(v => {
                    v.children.forEach(s => {
                        if (item.newClassifyInfoCodes.includes(s.infoCode)) {
                            s.objects = isNewClassobjects;
                        } else {
                            s.objects = objects;
                        }
                    });
                });
            });
            // 请求成功后，根据响应码更新数据
            if (res.code === SUCCESSCODE) {
                // 遍历响应数据，为每个项目添加唯一ID，更新树模型，并处理子项和对象的显示逻辑
                res.data?.forEach(item => {
                    item.id = uniqueId('first');
                    const newId = uniqueId('first');
                    const newId2 = uniqueId('first');
                    item.select && treeModel.value.push(item.id);
                    item.children.forEach(groupItem => {
                        groupItem.children.forEach(val => {
                            val.id = uniqueId('third');
                            if (val.statisticalValue !== undefined) {
                                val.parentId = newId2;
                            } else {
                                val.parentId = item.newClassifyInfoCodes.includes(val.infoCode) ? newId : item.id;
                            }
                            val.newClassify = item.newClassifyInfoCodes.includes(val.infoCode);
                            val.parentName = item.name;
                            val.select && treeModel.value.push(val.id);
                            val.objects.forEach(object => {
                                object.show = true;
                                object.localName = object.localName || i18n.global.t('meos_control_web.system_parameter');
                            });
                            val.objects = val.objects.sort((a, b) =>
                                a.localName?.localeCompare(b.localName, 'zh', {
                                    numeric: true,
                                    sensitivity: 'base'
                                })
                            );
                        });
                    });
                });
                // 更新树数据
                treeData.value = res.data || [];
            }
        } catch (error) {
            // 捕获异常，打印错误信息
            console.log(error);
        } finally {
            // 无论请求成功或失败，最终都执行以下逻辑
            const timer = setTimeout(() => {
                // 关闭树形数据的加载状态
                loadingTree.value = false;
                // 清除设置的定时器
                clearTimeout(timer);
            }, 200);
        }
    };
    const init = async () => {
        loadingTree.value = true;
        openLoading();
        await getTreeData();
        getBatchQueryPeriodData();
    };
    /**
     * 获取分组数据
     * 此函数遍历预定义的树形结构数据，并根据模型值筛选出相关的子节点
     * 然后将这些子节点组织成一个新的对象结构，以便于后续处理
     *
     * @returns {Object} 返回一个对象，其中包含根据分组名称分类的子节点数据
     */
    const getGroupData = () => {
        // 初始化一个空数组，用于存储筛选后的子节点数据
        const childList = [];
        // 遍历树形结构数据的每个项
        treeData.value.forEach(item => {
            // 遍历每个项的子节点
            item.children.forEach(child => {
                child.children.forEach(val => {
                    // 如果当前子节点的ID在模型值中，则将其添加到childList中
                    if (treeModel.value.includes(val.id)) {
                        childList.push(val);
                    }
                });
            });
        });

        // 初始化一个空对象，用于存储按分组名称分类的子节点数据
        const groupObject = {};
        // 遍历childList中的每个项，将其组织到groupObject中
        childList.forEach(item => {
            const key = item.groupName + item.parentId + (item.unit ?? uniqueId('unit'));
            // 如果当前项的分组名称已在groupObject中存在
            if (groupObject[key]) {
                // 将当前项的名称和信息代码添加到该分组的信息代码列表中
                groupObject[key].infoCodes.push({ name: item.name, infoCode: item.infoCode, show: true });
            } else {
                // 如果当前项的分组名称在groupObject中不存在，创建一个新的分组对象
                groupObject[key] = {
                    groupName: item.groupName,
                    groupId: item.id,
                    parentId: item.parentId,
                    parentName: item.parentName,
                    objects: item.objects,
                    unit: item.unit,
                    newClassify: item.newClassify,
                    statisticalValue: item.statisticalValue,
                    // 初始化信息代码列表，包含当前项的名称和信息代码
                    infoCodes: [{ statisticalValue: item.statisticalValue, name: item.name, infoCode: item.infoCode, show: true }],
                    // 初始化echart数据列表
                    echartData: []
                };
            }
        });
        const objectConfigs = {};
        forIn(groupObject, (value, key) => {
            const infoCodes = splitArrayIntoChunks(value.infoCodes, 2);
            if (infoCodes.length > 1 && !value.objects.find(item => item.objectId === systemId.value)) {
                infoCodes.forEach(item => {
                    const _key = value.groupName + uniqueId('group');
                    objectConfigs[_key] = {
                        ...value,
                        echartData: [],
                        infoCodes: item
                    };
                });
            } else {
                objectConfigs[key] = value;
            }
        });
        // 返回组织好的分组对象
        return structuredClone(objectConfigs);
    };
    watch(
        () => [analysisType.value, systemId.value, globalTime.value],
        () => {
            Refresh.value = false;
            nextTick(() => {
                Refresh.value = true;
                init();
            });
        }
    );

    onMounted(() => {
        init();
    });
    provide('treeModel', treeModel);
    provide('getBatchQueryPeriodData', getBatchQueryPeriodData);
    return { batchQueryPeriodData, loadingTree, treeData, Refresh, RefreshChart, ChartRef, loading };
};
