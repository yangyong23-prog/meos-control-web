import { loopControlList } from '@/store/loopControlList';
import axios from 'axios';
import { Loading, removeAll, getAutoKey, getOnlineKey } from '../utils';
import { getPageCircuitDetails } from '@/apis/lightingControl';
import { unionBy } from 'lodash';
import i18n from '@/localization';

export const useInputHeader = () => {
    const loopListStore = loopControlList();
    const menuData = inject('menuData');
    const { hlInfo } = loopListStore;
    const treeData = inject('BuildingFloorRoomFuncTypeSpaceTreeData');
    const templateTypeList = ref({
        value: hlInfo.templateType,
        options:
            menuData?.value?.map(item => {
                return {
                    id: item.key,
                    name: item.label
                };
            }) || []
    });
    // *input配置框
    const inputList = ref([
        {
            prefix: i18n.global.t('meos_control_web.online_status'),
            options: [
                {
                    id: 'ALL',
                    name: i18n.global.t('common.all')
                },
                {
                    id: 'ONLINE',
                    name: i18n.global.t('meos_control_web.online')
                },
                {
                    id: 'OFFLINE',
                    name: i18n.global.t('meos_control_web.offline')
                }
            ],
            value: hlInfo?.onlineStatus ?? '',
            id: 'onlineStatus',
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            onlineStatus: v
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            onlineStatus: ''
                        }
                    },
                    false
                );
            }
        },
        {
            prefix: i18n.global.t('meos_control_web.manual_auto_status'),
            options: [
                {
                    id: 'ALL',
                    name: i18n.global.t('common.all')
                },
                {
                    id: 'MANUAL',
                    name: i18n.global.t('meos_control_web.manual')
                },
                {
                    id: 'AUTO',
                    name: i18n.global.t('meos_control_web.auto')
                }
            ],
            value: hlInfo?.handAutomatism ?? '',
            id: 'handAutomatism',
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            handAutomatism: v
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            handAutomatism: ''
                        }
                    },
                    false
                );
            }
        },
        {
            prefix: i18n.global.t('meos_control_web.control_feedback_mismatch'),
            options: [
                {
                    id: 'ALL',
                    name: i18n.global.t('common.all')
                },
                {
                    id: '0',
                    name: i18n.global.t('meos_control_web.normal')
                },
                {
                    id: '1',
                    name: i18n.global.t('meos_control_web.alarm')
                }
            ],
            value: hlInfo?.controlIsInconsistent ?? '',
            id: 'controlIsInconsistent',
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            controlIsInconsistent: v
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            controlIsInconsistent: ''
                        }
                    },
                    false
                );
            }
        },
        {
            prefix: i18n.global.t('meos_control_web.current_running_demand'),
            options: [
                {
                    id: 'ALL',
                    name: i18n.global.t('common.all')
                },
                {
                    id: 'OPEN',
                    name: i18n.global.t('meos_control_web.on')
                },
                {
                    id: 'CLOSE',
                    name: i18n.global.t('meos_control_web.off')
                },
                {
                    id: 'FEEDBACK_ADJUSTMENT',
                    name: i18n.global.t('meos_control_web.feedback_adjustment')
                }
            ],
            value: hlInfo?.operationalRequirement ?? '',
            id: 'operationalRequirement',
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            operationalRequirement: v
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            operationalRequirement: ''
                        }
                    },
                    false
                );
            }
        },
        {
            prefix: i18n.global.t('meos_control_web.operation_status'),
            options: [
                {
                    id: 'ALL',
                    name: i18n.global.t('common.all')
                },
                {
                    id: 'RUN',
                    name: i18n.global.t('common.operation')
                },
                {
                    id: 'STOP',
                    name: i18n.global.t('meos_control_web.stop')
                }
            ],
            value: hlInfo?.runStatus ?? '',
            id: 'runStatus',
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            runStatus: v
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            runStatus: ''
                        }
                    },
                    false
                );
            }
        },
        {
            prefix: i18n.global.t('meos_control_web.operation_deviation'),
            options: [
                {
                    id: 'MORE_OPEN',
                    name: i18n.global.t('common.over_on')
                },
                {
                    id: 'LESS_OPEN',
                    name: i18n.global.t('common.drive_less')
                },
                {
                    id: 'NO_DEVIATION',
                    name: i18n.global.t('meos_control_web.no_deviation')
                }
            ],
            value: hlInfo?.operatingDeviation ?? [],
            id: 'operatingDeviation',
            multiple: true,
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            operatingDeviation: v
                        }
                    },
                    false
                );
            },
            remove(v) {
                let originOperatingDeviation = loopListStore.hlInfo?.operatingDeviation ?? [];
                (v || []).forEach(item => {
                    originOperatingDeviation = originOperatingDeviation.filter(deviation => deviation !== item.id);
                });
                loopListStore.setList(
                    {
                        hlInfo: {
                            operatingDeviation: originOperatingDeviation
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            operatingDeviation: []
                        }
                    },
                    false
                );
            }
        },
        {
            prefix: i18n.global.t('meos_control_web.function_type'),
            options: [],
            value: hlInfo?.funcType,
            id: 'funcType',
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            funcType: v
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            funcType: ''
                        }
                    },
                    false
                );
            }
        },
        {
            prefix: i18n.global.t('meos_control_web.luminaire_type'),
            options: [],
            value: hlInfo?.lampType,
            id: 'lampType',
            change(v) {
                loopListStore.setList(
                    {
                        hlInfo: {
                            lampType: v
                        }
                    },
                    false
                );
            },
            clear() {
                loopListStore.setList(
                    {
                        hlInfo: {
                            lampType: ''
                        }
                    },
                    false
                );
            }
        }
    ]);

    // *服务空间列表
    const space = ref({
        value: '',
        option: treeData?.value?.length ? JSON.parse(JSON.stringify(treeData?.value)) : []
    });
    watch(
        () => loopListStore.hlInfo,
        (v, o) => {
            console.log(v, o, '----');
            if (JSON.stringify(v) === JSON.stringify(o)) return;
            inputList.value[0].value = v?.onlineStatus ?? '';
            inputList.value[1].value = v?.handAutomatism ?? '';
            inputList.value[2].value = v?.controlIsInconsistent ?? '';
            inputList.value[3].value = v?.operationalRequirement ?? '';
            inputList.value[4].value = v?.runStatus ?? '';
            inputList.value[5].value = v?.operatingDeviation ?? '';
            // inputList.value[6].value = v?.anomalousEvent ?? '';
            inputList.value[6].value = v?.funcType;
            inputList.value[7].value = v?.lampType;
            templateTypeList.value.value = v.templateType;
            // space.value.value = [v?.instanceId] ?? [];
        },
        {
            deep: true
        }
    );

    return {
        space,
        inputList,
        templateTypeList
    };
};

export const useTableHeader = (templateTypeList, inputList, space) => {
    const loopListStore = loopControlList();
    const templateType = inject('templateType');
    const dashboardTemplateType = inject('dashboardTemplateType');
    const funTypeInfoValue = inject('funTypeInfoValue');
    const isRefresh = ref(false); // 是否刷新
    // 是否展示表头
    const showHeader = ref(false);
    // 默认状态
    const queryStatus = ref('query');
    const keyword = ref('');
    const search = ref('search');
    // 表格更新的
    const time = ref(new Date().getTime());
    // 表格的加载状态
    const loading = ref(false);
    const runningColumn = ref([]);
    const baseInfoColumn = ref([]);
    // #表格高度变化
    const tableHeightChange = () => {
        setTimeout(() => {
            time.value = new Date().getTime();
        }, 250);
    };
    const getHeaderList = (runningChildren = [], hide = true) => {
        let baseColumn = [
            {
                dataIndex: 'localId',
                title: i18n.global.t('meos_control_web.lighting_circuit_code'),
                resizable: true,
                minWidth: 145
            },
            {
                dataIndex: 'funcType',
                title: i18n.global.t('meos_control_web.function_type'),
                width: 100,
                resizable: true
            },
            {
                dataIndex: 'lampFuncType',
                title: i18n.global.t('meos_control_web.luminaire_type'),
                minWidth: 100,
                resizable: true
            },
            {
                dataIndex: 'relController',
                title: i18n.global.t('meos_control_web.associated_control_module'),
                minWidth: 150,
                resizable: true
            },
            {
                dataIndex: 'relDistributionCabinet',
                title: i18n.global.t('meos_control_web.related_distribution_box'),
                minWidth: 150,
                resizable: true
            },
            {
                dataIndex: 'relSpace',
                title: i18n.global.t('meos_control_web.served_space'),
                minWidth: 270,
                resizable: true,
                hide: !(templateType.value === 'PUBLIC_AREA_LIGHTING' || templateType.value === 'PARKING_LOT_LIGHTING')
            }
        ];
        baseColumn = baseColumn.filter(res => !res.hide);
        baseInfoColumn.value = baseColumn;
        const baseHeaderList = [
            {
                dataIndex: 'localName',
                title: i18n.global.t('meos_control_web.lighting_circuit_name'),
                minWidth: 150,
                hide: false,
                fixed: 'left',
                resizable: true
            },
            {
                dataIndex: 'runningParameters',
                title: i18n.global.t('meos_control_web.operating_parameters'),
                hide: hide,
                resizable: true,
                children: runningChildren
            },
            {
                dataIndex: 'abnormal',
                title: i18n.global.t('meos_control_web.abnormal_event'),
                width: 100,
                resizable: true,
                hide: false
            },
            {
                dataIndex: 'basicInfos',
                title: i18n.global.t('meos_control_web.basic_info'),
                children: baseColumn,
                hide: false,
                resizable: true
            },
            {
                dataIndex: 'option',
                title: i18n.global.t('meos_control_web.operation1'),
                fixed: 'right',
                hide: false,
                children: [
                    {
                        dataIndex: 'manualAutoSet',
                        title: i18n.global.t('meos_control_web.manual_auto_set'),
                        minWidth: 180,
                        maxWidth: 180,
                        width: 180,
                        fixed: 'right'
                    },
                    {
                        dataIndex: 'equipSwitchSet',
                        title: i18n.global.t('meos_control_web.switch_setpoint'),
                        minWidth: 150,
                        maxWidth: 150,
                        width: 150,
                        fixed: 'right'
                    }
                ]
            }
        ];
        return baseHeaderList.filter(res => !res.hide);
    };
    const headerList = ref(getHeaderList());

    const setTableHeader = list => {
        if (!list || list.length === 0) return;
        let runningParamList = [],
            runChildren = [],
            hide;
        list.forEach(tableItem => {
            if (tableItem?.runningParameters && tableItem?.runningParameters?.length > 0) {
                runningParamList = unionBy(tableItem.runningParameters, runningParamList, 'infoCode');
            }
        });
        if (runningParamList.length > 0) {
            runChildren = runningParamList.map((res, index) => {
                const key = `running${index}`;
                res.customKey = key;
                return {
                    dataIndex: key,
                    title: res.infoCodeName,
                    infoCode: res.infoCode,
                    resizable: true,
                    width: index === runningParamList.length - 1 ? 130 : 100
                };
            });
            // runChildren[runChildren.length - 1].minWidth = '120px';
            runningColumn.value = runChildren;
            hide = false;
        } else {
            runningColumn.value = [];
            hide = true;
        }
        headerList.value = getHeaderList(runChildren, hide);
    };

    const getCheckStatus = (value, type) => {
        if (type === 'm') {
            if (String(value) === '0') {
                return 'checked';
            } else if (String(value) === '1') {
                return 'uncheck';
            } else {
                return '';
            }
        } else {
            if (String(value) === '0') {
                return 'uncheck';
            } else if (String(value) === '1') {
                return 'checked';
            } else {
                return '';
            }
        }
    };
    const getTipContent = value => {
        if (String(value) !== '0' && String(value) !== '1') {
            return i18n.global.t('meos_control_web.open_close_not_supported');
        }
        return i18n.global.t('meos_control_web.auto_mode_toggle_not_allowed');
    };

    const tipClick = ref(false);

    const activeKey = ref(-1);

    const openLoading = ref(false);
    const closeLoading = ref(false);
    const loadingType = ref('');
    const loadingIds = ref('');
    const activeBtn = key => {
        activeKey.value = key;
        tipClick.value = false;
        setTimeout(() => {
            tipClick.value = true;
        }, 0);
    };

    const changeLoading = (id, type) => {
        tipClick.value = false;
        loadingType.value = type;
        loadingIds.value = id[0];
        switch (loadingType.value) {
            case 'open':
                openLoading.value = true;
                break;
            case 'close':
                closeLoading.value = true;
                break;
            case 'error':
                openLoading.value = false;
                closeLoading.value = false;
                loadingType.value = '';
                loadingIds.value = '';
                break;
            default:
                break;
        }
    };

    const cancelActive = () => {
        activeKey.value = -1;
        tipClick.value = false;
    };
    const closeModal = event => {
        // 阻止事件冒泡
        event.stopPropagation();
        // 阻止事件的默认行为
        event.preventDefault();
        tipClick.value = false;
    };

    const refreshTable = () => {
        activeKey.value = -1;
        tipClick.value = false;
        console.log('refreshTable', 1);
        queryTableData('set');
    };

    const pageMeta = ref({
        pageNum: 1,
        pageSize: 100,
        total: 0
    });

    const pageFuc = {
        pageChange: v => {
            pageMeta.value.pageNum = v;
            console.log('pageChange', 2);
            queryTableData();
        },
        sizeChange: v => {
            pageMeta.value.pageSize = v;
            pageMeta.value.pageNum = 1;
            console.log('sizeChange', 3);
            queryTableData();
        }
    };

    const dataSource = ref([]);
    const clearSearch = () => {
        keyword.value = '';
        console.log('clearSearch', 3);
        queryTableData();
    };

    const getFunType = value => {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value;
        } else {
            return [value];
        }
    };
    const queryChange = type => {
        const { hlInfo } = loopListStore;
        queryStatus.value = type;
        if (type === 'reset') {
            search.value.clearInp();
            space.value.value = '';
            loopListStore.setList(
                {
                    hlInfo: {
                        instanceType: '',
                        instanceId: '',
                        onlineStatus: '',
                        handAutomatism: '',
                        controlIsInconsistent: '',
                        operationalRequirement: '',
                        runStatus: '',
                        operatingDeviation: [],
                        funcType: '',
                        lampType: '',
                        templateType: hlInfo.templateType
                    }
                },
                false
            );
        }
        console.log('queryChange', 3);
        queryTableData();
    };

    const params = computed(() => {
        const { hlInfo } = loopListStore;
        const obj = {
            serviceRoomFuncTypes: [],
            keyword: keyword.value,
            page: pageMeta.value.pageNum || 1,
            pageSize: pageMeta.value.pageSize,
            templateType: hlInfo.templateType,
            demandTemplateType: hlInfo.templateType,
            onlineStatus: getOnlineKey(hlInfo.onlineStatus),
            // 手自动状态
            manualAutoStatus: getAutoKey(hlInfo.handAutomatism),
            // 运行需求类型
            runningDemandType: removeAll(hlInfo.operationalRequirement),
            // 运行偏差类型
            runningDeviationType: hlInfo.operatingDeviation,
            // 控反不一致
            orderFailAlarm: removeAll(hlInfo.controlIsInconsistent),
            lampFuncType: getFunType(hlInfo.lampType),
            funcType: getFunType(hlInfo.funcType),
            orders: [
                {
                    column: 'localName',
                    chineseOrder: true
                }
            ],
            runStatus: removeAll(hlInfo.runStatus) ? (removeAll(hlInfo.runStatus) === 'RUN' ? 1 : 0) : ''
        };
        if (hlInfo.instanceType && hlInfo.instanceType !== 'PROJECT') {
            obj.instanceType = hlInfo.instanceType;
            obj.instanceId = hlInfo.instanceId;
            obj.serviceRoomFuncTypes = [];
        } else {
            if (hlInfo.instanceId && hlInfo.instanceId.substring(0, 2) !== 'Pj') {
                obj.serviceRoomFuncTypes.push(hlInfo.instanceId);
            }
        }
        return obj;
    });

    const handleChange = (event, type) => {
        queryStatus.value = 'query';
        if (type === 'change') {
            keyword.value = event;
            console.log('handleChange', 3);
            queryTableData();
        } else {
            keyword.value = event?.target?.value;
        }
    };

    const getHeaderData = async () => {
        const loopLoadingInstance = Loading('.loop-list-wrap');
        try {
            if (!templateType.value) {
                loopListStore.setVisible(false);
                loopListStore.setType(null);
            } else {
                let response = funTypeInfoValue.value;
                inputList.value[6].options = response?.funcType?.dataSources.map(res => {
                    return {
                        name: res.name,
                        id: res.code
                    };
                });
                inputList.value[7].options = response?.lampFuncType?.dataSources.map(res => {
                    return {
                        name: res.name,
                        id: res.code
                    };
                });
            }
        } finally {
            const { hlInfo } = loopListStore;
            try {
                if (hlInfo.templateType && templateType?.value === hlInfo.templateType && loopListStore.listVisible) {
                    console.log('getHaderData', 3);
                    await queryTableData();
                }
            } finally {
                showHeader.value = true;
                loopLoadingInstance.destroy();
            }
        }
    };
    let cancelTokenSource = null,
        loadingInstance = null;
    const queryTableData = async (status, type) => {
        console.log(queryStatus.value, '---', status, type);
        if (cancelTokenSource) {
            cancelTokenSource.cancel(i18n.global.t('meos_control_web.cancel_last_request'));
            cancelTokenSource = null;
        }
        cancelTokenSource = axios.CancelToken.source();
        time.value = new Date().getTime();

        if (loading.value) return;
        if (!status) {
            loading.value = true;
            isRefresh.value = true;
        } else {
            loading.value = false;
            isRefresh.value = false;
        }
        if (!status) {
            if (!loadingInstance) {
                loadingInstance = Loading('.loop-table-wrap');
            }
        }
        try {
            console.log('获取', templateTypeList.value.value);
            let responseData = await getPageCircuitDetails(
                queryStatus.value === 'query'
                    ? { ...params.value, demandTemplateType: type || templateTypeList.value.value, templateType: type || templateTypeList.value.value }
                    : {
                          keyword: '',
                          instanceType: '',
                          instanceId: '',
                          page: pageMeta.value.pageNum || 1,
                          pageSize: pageMeta.value.pageSize,
                          demandTemplateType: type || templateTypeList.value.value,
                          templateType: type || templateTypeList.value.value,
                          onlineStatus: '',
                          // 手自动状态
                          manualAutoStatus: '',
                          // 运行需求类型
                          runningDemandType: '',
                          // 运行偏差类型
                          runningDeviationType: [],
                          // 控反不一致
                          orderFailAlarm: '',
                          lampFuncType: [],
                          funcType: [],
                          runStatus: ''
                      }
            );
            if (responseData.code === '00000') {
                const rawData = responseData?.data?.records || [];
                // 设置表头
                setTableHeader(rawData);
                // 设置异常信息
                rawData.forEach(res => {
                    // 回路编码
                    if (res.basicInfos && !res.basicInfos.localId) {
                        res.basicInfos.localId = {
                            localName: res?.localId || '--'
                        };
                    }
                    res.abnormal = {
                        abnormalEventCount: res?.abnormalEventCount,
                        abnormalEvents: res?.abnormalEvents || []
                    };
                    res.manualAutoSet = {
                        id: res.id,
                        ...res.operationColumn?.manualAutoSet
                    };
                    res.equipSwitchSet = {
                        id: res.id,
                        value: res?.operationColumn?.equipSwitchSet
                    };
                    const restrictInfos = res.restrictInfos || {};
                    const disableControl = !(
                        (restrictInfos.localRemoteStatus === undefined && restrictInfos.onlineStatus === '1') ||
                        (restrictInfos.localRemoteStatus === '1' && restrictInfos.onlineStatus === '1')
                    );

                    if (disableControl || JSON.stringify(res?.operationColumn) === '{}') {
                        res.disable = true;
                    } else {
                        res.disable = false;
                    }
                });
                dataSource.value = rawData;
                time.value = new Date().getTime();
                pageMeta.value.total = responseData?.data?.totalCount;
            } else {
                dataSource.value = [];
            }
        } finally {
            isRefresh.value = false;
            loading.value = false;
            loadingInstance?.destroy?.();
            loadingInstance = null;
            openLoading.value = false;
            closeLoading.value = false;
            loadingType.value = '';
            loadingIds.value = '';
        }
    };
    loopListStore.listVisible && getHeaderData();
    watch(
        () => [loopListStore.type, loopListStore.listVisible],
        () => {
            time.value = new Date().getTime();
        }
    );
    watch(
        () => [dashboardTemplateType?.value, templateType?.value],
        v => {
            console.log('数据修改', v);
            loopListStore.setList(
                {
                    hlInfo: {
                        templateType: v[0] || v[1]
                    }
                },
                false
            );
            loopListStore.listVisible && queryTableData('', v[0] || v[1]);
        },
        {
            immediate: true,
            deep: true
        }
    );
    return {
        showHeader,
        time,
        search,
        loading,
        runningColumn,
        baseInfoColumn,
        headerList,
        tipClick,
        openLoading,
        closeLoading,
        loadingType,
        loadingIds,
        pageMeta,
        pageFuc,
        dataSource,
        keyword,
        isRefresh,
        activeBtn,
        closeModal,
        clearSearch,
        queryChange,
        refreshTable,
        cancelActive,
        handleChange,
        getTipContent,
        changeLoading,
        getCheckStatus,
        tableHeightChange
    };
};
