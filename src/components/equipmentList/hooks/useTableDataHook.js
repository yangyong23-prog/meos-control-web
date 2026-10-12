// @ts-ignore
import i18n from '@/localization';
/**
 * 设备列表表格数据hook
 * 负责表头、表格数据、分页、选中项、表头设置弹窗、恢复时间弹窗等响应式数据和相关操作
 * 提供表格数据拉取、表头处理、分页切换、选中项管理等方法
 */

import { getTableData, getTableHeader } from '@/apis/equipmentList';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import dataDockHandling from '@/hooks/dataDockHandling';
import {
    curClassCodeObjKey,
    openLoadingKey,
    closeLoadingKey,
    commonPropsKey,
    paramsKey,
    selectTableListKey,
    spaceMapKey,
    setColumnsKey,
    isFirstFilterKey,
    filterObjectIdsKey
} from './useBaseHook';
import { useSseHook } from './useSseHook';
import { getInfoCodesObjectId, iterateObjct4InstanceInfo } from '@/utils';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { isArray, isNil, isString, orderBy, sortBy, uniqueId } from 'lodash';
import { isIotInfoType } from '@/utils/infoTemplate';
import { CONTROL_TYPE, SHOW_TYPE } from '../variables';
import { IOT_SETTING } from '@/utils/globalVariables';

// 取消请求相关方法（表头和表格数据分别管理）
const { cancelQuest: cancelQuestHeader, cancelToken: cancelTokenHeader } = UseCancelTokenHooks();
const { cancelQuest, cancelToken } = UseCancelTokenHooks();

// 依赖注入的key定义
export const searchListKey = Symbol('searchListKey'); // 搜索条件列表
export const paginationDataKey = Symbol('paginationDataKey'); // 分页数据
export const pageChangeKey = Symbol('pageChangeKey'); // 页码变化方法
export const sizeChangeKey = Symbol('sizeChangeKey'); // 每页数量变化方法
export const checkedChangeKey = Symbol('checkedChangeKey'); // 选中项变化方法
export const clearDataCheckKey = Symbol('clearDataCheckKey'); // 清除部分选中项方法
export const clearAllDataCheckKey = Symbol('clearAllDataCheckKey'); // 清除所有选中项方法

export const isOpenHeaderSetKey = Symbol('isOpenHeaderSetKey'); // 表头设置弹窗开关
export const openRecoveryDateTimeKey = Symbol('openRecoveryDateTimeKey'); // 打开恢复时间弹窗方法
export const closeRecoveryDateTimeKey = Symbol('closeRecoveryDateTimeKey'); // 关闭恢复时间弹窗方法
export const refreshTableFnKey = Symbol('refreshTableFn'); // 刷新表格数据方法
export const tableQueryParamsKey = Symbol('tableQueryParamsKey'); // 筛选参数
export const useTableDataHook = props => {
    console.log(props);

    // loading控制方法
    const openLoading = inject(openLoadingKey);
    const closeLoading = inject(closeLoadingKey);
    const commonProps = inject(commonPropsKey);
    const isFirstFilter = inject(isFirstFilterKey);
    const params = inject(paramsKey);
    const selectTableList = inject(selectTableListKey);
    const spaceMap = inject(spaceMapKey);
    const filterObjectIds = inject(filterObjectIdsKey);
    // 数据对接处理方法
    const { loadDynaTableListDataWithIotHandling } = dataDockHandling();

    // 当前分类对象
    const curClassCodeObj = inject(curClassCodeObjKey);

    // 搜索条件列表
    const searchList = ref([]);
    // 表格数据
    const tableData = ref([]);
    // 表头配置
    const columns = ref([]);
    const setColumns = inject(setColumnsKey);
    // 分页数据
    const paginationData = ref({
        pageNum: 1,
        pageSize: commonProps.pageSize,
        total: 0
    });

    // 扁平化表头
    const flattenColumns = ref([]);
    // 表头设置弹窗是否打开
    const isOpenHeaderSet = ref(false);
    // 恢复时间弹窗相关
    const recoveryDateTimeDom = ref(null); // 弹窗挂载DOM
    const recoveryDateTimeInfoCode = ref({}); // 弹窗对应数据
    const isOpenrecoveryDateTime = ref(false); // 弹窗开关
    // 表头自定义配置映射
    const columnMap = ref({});
    const refreshTableKey = ref(uniqueId('refreshTable_'));
    // 筛选参数
    const tableQueryParams = ref({
        inSpaceIds: [],
        serviceSpaceIds: []
    });
    const dynamicInfoCodeFilters = ref([]);
    const staticInfoCodeFilters = ref([]);
    // SSE推送相关
    const { setEquipmentListSSEClientOption } = useSseHook();

    /**
     * 异步获取数据函数
     * 该函数用于获取表格数据和列配置信息，初始化相关状态和参数
     * @returns {Promise<void>} 返回一个Promise，不包含具体返回值
     */
    const fetchData = async () => {
        // 设置表格查询参数中的空间ID和业务空间ID
        tableQueryParams.value.inSpaceIds = spaceMap.value.inSpaceIds || [];
        tableQueryParams.value.serviceSpaceIds = spaceMap.value.serviceSpaceIds || [];
        tableQueryParams.value.isFloorOrBuild = spaceMap.value.isFloorOrBuild;
        // 关闭头部设置面板的显示状态
        isOpenHeaderSet.value = false;

        // 开启加载状态
        openLoading();

        // 初始化表格列配置，设置默认的设备名称列
        columns.value = [{ dataIndex: 'localName', title: i18n.global.t('meos_control_web.equipment_name'), weight: 2, minWidth: 210, resizable: true, order: -1, fixed: 'left' }];

        // 初始化搜索列表
        searchList.value = [];

        try {
            if (isFirstFilter.value) {
                // 首次筛选条件依赖表头配置生成，需要串行请求
                await getColumnsData();
                await getTableDataFn();
            } else {
                await Promise.all([getColumnsData(), getTableDataFn()]);
            }
        } finally {
            // 无论成功或失败都关闭加载状态
            closeLoading();
        }
    };

    /**
     * 设置表头宽度
     * @param {Object} obj - 表头项
     * @param {Object} item - 字段配置
     */
    const setWidth = (obj, item) => {
        obj.width = 80;
        // 兼容国际化宽度
        if (item.showStyle?.showType === SHOW_TYPE.SET_VALUE_RADIO) {
            obj.width = 200;
        }
        if (item.infoCode === 'localId') {
            obj.width = 150;
        }
    };

    /**
     * 获取自定义表头配置
     * @param {Object} obj - 配置对象
     * @param {string} code - 字段code
     * @param {string} type - 配置类型
     * @returns {any} 配置值
     */
    const getCustomConfigData = (obj, code, type) => {
        if (obj && code && type && obj[code]) {
            return obj[code][type];
        }
        if (type === 'order') {
            // 没有自定义排序的放在最后
            return 9999;
        }
        // 当没有自定义时，默认为true
        return true;
    };

    /**
     * 解析表头字段的showStyle
     * @param {Object} item - 字段配置
     */
    const setShowStyle = item => {
        try {
            item.showStyle = JSON.parse(item.showStyle || '{}');
            console.log('解析showStyle', item.showStyle);
        } catch (error) {
            console.error('解析showStyle失败', item.showStyle, error);
            item.showStyle = {
                showType: item.showStyle
            };
        }
    };

    /**
     * 递归处理表头配置
     * @param {Object} infoCodeGroupVO - 表头分组对象
     * @param {boolean} isSearch - 是否为搜索表头
     */
    const handleColumns = (infoCodeGroupVO, isSearch = true) => {
        const { groupCode, groupName } = infoCodeGroupVO;
        const map = columnMap.value[groupCode];
        const groupOrder = getCustomConfigData(map, groupCode, 'order') === 9999 ? infoCodeGroupVO.groupOrder : getCustomConfigData(map, groupCode, 'order');
        const data = {
            dataIndex: groupCode,
            groupCode,
            groupName,
            order: groupOrder,
            title: groupName,
            children: infoCodeGroupVO.relInfoCodeConfigs.map(item => {
                setShowStyle(item);
                const obj = {
                    dataIndex: groupCode + '&&' + item.infoCode,
                    groupCode,
                    groupOrder,
                    title: item.infoCodeName,
                    searchName: item.infoCodeName,
                    // 只有当允许搜索且配置了搜索时，才显示在筛选项中
                    search: item.showStyle.allowSearch && getCustomConfigData(map, item.infoCode, 'search'),
                    show: getCustomConfigData(map, item.infoCode, 'show'),
                    order: getCustomConfigData(map, item.infoCode, 'order'),
                    resizable: true,
                    children: [],
                    ...item
                };
                // 处理实际值/设定值的嵌套
                if (item.relInfoCodeConfigs?.length) {
                    if (isIotInfoType(item.infoCodeType) && groupCode === 'parameterSetOperation') {
                        const config = item.relInfoCodeConfigs[0];
                        const actual = {
                            ...obj,
                            dataIndex: obj.infoCode,
                            title: i18n.global.t('meos_control_web.actual_value')
                        };
                        setShowStyle(config);
                        const set = {
                            ...config,
                            dataIndex: groupCode + '&&' + config.infoCode,
                            groupCode,
                            groupOrder,
                            search: config.showStyle.allowSearch && getCustomConfigData(map, config.infoCode, 'search'),
                            show: getCustomConfigData(map, config.infoCode, 'show'),
                            // 设定值排在实际值后面
                            order: getCustomConfigData(map, item.infoCode, 'order') + 0.1,
                            title: i18n.global.t('meos_control_web.setpoint_value'),
                            resizable: true,
                            searchName: `${obj.infoCodeName}${i18n.global.t('meos_control_web.setpoint_value')}`
                        };
                        if (set.search && isSearch) {
                            pushSearchItem(set);
                        }
                        setWidth(actual, actual);
                        setWidth(set, set);
                        obj.children = [actual, set];
                        // 只要实际值或设定值有一个显示，父级就显示
                        if (actual.show || set.show) {
                            obj.show = true;
                        }
                    } else {
                        const arr = structuredClone(item.relInfoCodeConfigs);
                        // 非物模型的嵌套，直接展开
                        obj.children = arr.map(config => {
                            setShowStyle(config);
                            setWidth(config, config);
                            return {
                                ...config,
                                dataIndex: groupCode + '&&' + config.infoCode,
                                // 父级code作为前缀，避免infoCode重复
                                parentInfoCode: {
                                    infoCode: obj.infoCode,
                                    infoCodeType: obj.infoCodeType
                                },
                                groupCode,
                                groupOrder,
                                resizable: true,
                                title: config.infoCodeName,
                                searchName: config.infoCodeName,
                                search: config.showStyle.allowSearch && getCustomConfigData(map, config.infoCode, 'search'),
                                show: getCustomConfigData(map, config.infoCode, 'show')
                            };
                        });
                    }
                } else if (item.infoCodeType === IOT_SETTING && item.showStyle?.showType === SHOW_TYPE.SET_VALUE_ACTION_COLUMN) {
                    // 没有嵌套时也补一个设定值子列，保持和“实际值/设定值”嵌套表头一致
                    const set = {
                        ...obj,
                        title: i18n.global.t('meos_control_web.setpoint_value'),
                        searchName: `${obj.infoCodeName}${i18n.global.t('meos_control_web.setpoint_value')}`,
                        children: []
                    };
                    if (set.search && isSearch) {
                        pushSearchItem(set);
                    }
                    setWidth(set, set);
                    obj.children = [set];
                    obj.show = set.show;
                } else {
                    setWidth(obj, item);
                }
                if (obj.search && isSearch) {
                    pushSearchItem(obj);
                }
                return obj;
            })
        };
        // 按order排序
        data.children = sortBy(data.children, ['order']);
        return data;
    };
    const pushSearchItem = item => {
        if (isFirstFilter.value) {
            const val = props.filter?.[item.infoCode];
            if (!isNil(val)) {
                if (item.dataSource?.length) {
                    if (isArray(val)) {
                        item.value = val;
                    } else if (isString(val)) {
                        item.value = [val];
                    }
                } else {
                    item.value = val;
                }
                if (isIotInfoType(item?.infoCodeType)) {
                    dynamicInfoCodeFilters.value.push({
                        infoCode: item.infoCode,
                        dataValue: item.value
                    });
                } else {
                    staticInfoCodeFilters.value.push({
                        infoCode: item.infoCode,
                        dataValue: item.value
                    });
                }
            }
        }

        searchList.value.push(item);
    };
    const getDefaultSearchData = () => {
        return { dynamicInfoCodeFilters: dynamicInfoCodeFilters.value, staticInfoCodeFilters: staticInfoCodeFilters.value };
    };

    /**
     * 获取表头数据
     * 拉取接口数据，处理分组和字段配置，生成columns和searchList
     */
    const getColumnsData = async () => {
        cancelQuestHeader();
        flattenColumns.value = [];
        searchList.value = [];
        const obj = structuredClone(tableQueryParams.value);
        try {
            const res = await getTableHeader(
                {
                    ...params.value,
                    ...obj,
                    configType: CONTROL_TYPE,
                    templateTypeId: curClassCodeObj.value.templateTypeId,
                    templateTypeKey: curClassCodeObj.value.templateTypeKey
                },
                { cancelToken: cancelTokenHeader() }
            );
            // 使用缓存数据
            columnMap.value = {};
            // 生成字段映射
            res.data?.cfgInfoCodeGroupVOList?.forEach(item => {
                const { groupCode } = item;
                if (!columnMap.value[groupCode]) {
                    columnMap.value[groupCode] = {};
                }
                columnMap.value[groupCode][item.infoCode] = item;
            });
            // 处理分组表头
            res.data?.infoCodeGroupVOList?.forEach(item => {
                columns.value.push(handleColumns(item));
            });
            columns.value = orderBy(columns.value, ['order']);
            // 处理扁平化表头
            handleSetColumns(structuredClone(columns.value), obj);
            searchList.value = orderBy(searchList.value, ['groupOrder', 'order']);
        } catch (error) {
            console.error(error);
        }
    };
    const handleSetColumns = async (arr, obj) => {
        // 非楼层和建筑模式下，直接使用传入的列配置
        if (!obj.isFloorOrBuild) {
            setColumns.value = arr;
        }
        // 只有在楼层和建筑模式下且没有自定义列配置时，才拉取默认表头配置
        if (obj.isFloorOrBuild && !setColumns.value.length) {
            const res = await getTableHeader(
                {
                    ...params.value,
                    inSpaceIds: [],
                    serviceSpaceIds: [],
                    configType: CONTROL_TYPE,
                    templateTypeId: curClassCodeObj.value.templateTypeId,
                    templateTypeKey: curClassCodeObj.value.templateTypeKey
                },
                { cancelToken: cancelTokenHeader() }
            );
            // 处理分组表头
            res.data?.infoCodeGroupVOList?.forEach(item => {
                setColumns.value.push(handleColumns(item, false));
            });
            setColumns.value = orderBy(setColumns.value, ['order']);
        }
    };
    /**
     * 获取表格数据
     * 拉取接口数据，处理不可控提示、权限、分页等
     */
    const getTableDataFn = async () => {
        cancelQuest();
        tableData.value = [];
        clearAllDataCheck();
        let obj = {};
        if (isFirstFilter.value) {
            obj = getDefaultSearchData();
        }
        try {
            const res = await loadDynaTableListDataWithIotHandling(
                {
                    ...params.value,
                    ...obj,
                    ...tableQueryParams.value,
                    filterInSystemIds: props.filterInSystemIds,
                    templateTypeId: curClassCodeObj.value.templateTypeId,
                    filterObjectIds: filterObjectIds.value,
                    page: {
                        pageNo: paginationData.value.pageNum,
                        pageSize: paginationData.value.pageSize
                    },
                    orders: [
                        {
                            column: 'building'
                        },
                        {
                            column: 'floor',
                            asc: false
                        },
                        {
                            column: 'localName',
                            chineseOrder: true
                        }
                    ]
                },
                getTableData,
                { cancelToken: cancelToken() }
            );
            // 标记不可控提示和权限
            res.data.forEach(item => {
                if (!isEdge()) {
                    item.checkDisableTip = i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge');
                    item.disable = true;
                } else if (!baseStore().hasAuth(commonProps.permission)) {
                    item.checkDisableTip = i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
                    item.disable = true;
                } else {
                    if (item.parameterSetOperation) {
                        item.checkDisableTip = i18n.global.t('meos_control_web.equipment_offline_local_no_control');
                    } else {
                        item.checkDisableTip = i18n.global.t('meos_control_web.device_uncontrol');
                    }
                }
            });
            paginationData.value.total = res?.total ? res.total * 1 : 0;
            // 处理SSE推送参数
            const { classCodeIds } = iterateObjct4InstanceInfo(res.data);
            const objectIdAndInfoCodes = getInfoCodesObjectId(res.data);
            setEquipmentListSSEClientOption(classCodeIds, objectIdAndInfoCodes);
            // 只保留部分字段
            tableData.value = res.data.map(item => ({
                id: item.id,
                localName: item.localName,
                checkDisableTip: item.checkDisableTip,
                disable: item.disable,
                objType: item.objType,
                classCode: item.classCode
            }));
        } catch (error) {
            console.error(error);
        } finally {
            closeLoading();
        }
    };
    const refreshTableFn = async (resetPageNum = false) => {
        if (resetPageNum) {
            paginationData.value.pageNum = 1;
            paginationData.value.total = 0;
        }
        openLoading();
        try {
            await getTableDataFn();
            refreshTableKey.value = uniqueId('refreshTable_');
        } finally {
            closeLoading();
        }
    };
    /**
     * 页码变化
     * 重新拉取数据
     */
    const pageChange = async () => {
        if (paginationData.value.pageNum < 1) {
            paginationData.value.pageNum = 1;
            return;
        }
        await refreshTableFn();
    };

    /**
     * 每页数量变化
     * @param {number} size 新的页大小
     * 重新拉取数据
     */
    const sizeChange = async size => {
        paginationData.value.pageSize = size;
        paginationData.value.pageNum = 1;
        await refreshTableFn();
    };

    /**
     * 选中项变化
     * @param {Object} param 包含selecteds数组
     */
    const checkedChange = ({ selecteds }) => {
        selectTableList.value = selecteds;
    };

    /**
     * 清除部分选中项
     * @param {Array} ids 要清除的id数组
     */
    const clearDataCheck = ids => {
        selectTableList.value.forEach(item => {
            if (ids.includes(item.id)) {
                item.checked = 'uncheck';
            }
        });
        ids.forEach(id => {
            const index = selectTableList.value.findIndex(item => item.id === id);
            index !== -1 && selectTableList.value.splice(index, 1);
        });
    };

    /**
     * 清除所有选中项
     */
    const clearAllDataCheck = () => {
        selectTableList.value.forEach(item => {
            item.checked = 'uncheck';
        });
        selectTableList.value = [];
    };

    /**
     * 打开恢复时间弹窗
     * @param {Event} e - 触发事件
     * @param {Object} data - 当前行数据
     * @param {Object} disable - 禁用信息
     */
    const openRecoveryDateTime = (e, data, disable) => {
        closeRecoveryDateTime();
        if (disable?.disabled || !data.additionalMapValue?.recoveryDateTime) {
            return;
        }
        recoveryDateTimeDom.value = e;
        recoveryDateTimeInfoCode.value = data;
        nextTick(() => {
            isOpenrecoveryDateTime.value = true;
        });
    };

    /**
     * 关闭恢复时间弹窗
     */
    const closeRecoveryDateTime = () => {
        isOpenrecoveryDateTime.value = false;
        recoveryDateTimeInfoCode.value = {};
        recoveryDateTimeDom.value = null;
    };

    // 组件挂载时拉取数据
    onMounted(() => {
        if (curClassCodeObj.value.id) {
            fetchData();
        }
    });

    // 组件卸载时取消请求
    onBeforeUnmount(() => {
        cancelQuest();
        cancelQuestHeader();
    });

    // 监听分类对象变化，自动刷新数据
    watch(
        () => [curClassCodeObj.value.id, curClassCodeObj.value.treeData],
        () => {
            curClassCodeObj.value.id && fetchData();
        },
        {
            deep: true
        }
    );

    // 提供响应式数据和操作方法给子组件
    provide(searchListKey, searchList);
    provide(paginationDataKey, paginationData);
    provide(pageChangeKey, pageChange);
    provide(sizeChangeKey, sizeChange);
    provide(checkedChangeKey, checkedChange);
    provide(clearDataCheckKey, clearDataCheck);

    provide(clearAllDataCheckKey, clearAllDataCheck);
    provide(isOpenHeaderSetKey, isOpenHeaderSet);
    provide(openRecoveryDateTimeKey, openRecoveryDateTime);
    provide(closeRecoveryDateTimeKey, closeRecoveryDateTime);
    provide(refreshTableFnKey, refreshTableFn);
    provide(tableQueryParamsKey, tableQueryParams);

    // 返回响应式数据
    return {
        searchList,
        tableData,
        columns,
        setColumns,
        paginationData,
        selectTableList,
        isOpenHeaderSet,
        isOpenrecoveryDateTime,
        recoveryDateTimeDom,
        recoveryDateTimeInfoCode,
        refreshTableKey
    };
};
