import { loopControlList } from '@/store/loopControlList';
import { getPageControllerDetails } from '@/apis/lightingControl';
import { Loading, removeAll, getOnlineKey, getRelSpaceName } from '../utils';
import { unionBy } from 'lodash';
import i18n from '@/localization';

export const useInputHeader = () => {
    const loopListStore = loopControlList();
    const { coInfo } = loopControlList();
    const treeData = inject('BuildingFloorRoomFuncTypeSpaceTreeData');
    const menuData = inject('menuData');
    // 输入框配置
    const space = ref({
        value: '',
        option: treeData?.value?.length ? JSON.parse(JSON.stringify(treeData?.value)) : []
    });

    const templateTypeList = ref({
        value: coInfo.templateType,
        options:
            menuData?.value?.map(item => {
                return {
                    id: item.key,
                    name: item.label
                };
            }) || []
    });

    const onlineStatus = ref({
        value: coInfo.onlineStatus,
        option: [
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
        ]
    });
    const faultConditions = ref({
        value: coInfo.faultConditions,
        option: [
            {
                id: 'ALL',
                name: i18n.global.t('common.all')
            },
            {
                id: 'NORMAL',
                name: i18n.global.t('meos_control_web.normal')
            },
            {
                id: 'ABNORMAL',
                name: i18n.global.t('meos_control_web.fault')
            }
        ]
    });
    watch(
        () => loopListStore.coInfo,
        (v, o) => {
            if (JSON.stringify(v) === JSON.stringify(o)) return;
            onlineStatus.value.value = v.onlineStatus;
            faultConditions.value.value = v.faultConditions;
            templateTypeList.value.value = v.templateType;
        },
        {
            deep: true
        }
    );

    return {
        space,
        templateTypeList,
        onlineStatus,
        faultConditions
    };
};

export const useTableHeader = space => {
    const templateType = inject('templateType');
    const loopListStore = loopControlList();
    // 表格更新的key
    const time = ref(new Date().getTime());
    // 是否展示表头
    const showHeader = ref(false);
    // 默认状态
    const queryStatus = ref('');
    // 表格的加载状态
    const loading = ref(false);
    // 模糊查询
    const keyword = ref('');
    const search = ref('search');
    // 表格数据
    const dataSource = ref([]);
    const pageMeta = ref({
        pageNum: 1,
        pageSize: 100,
        total: 0
    });
    const lightModule = {
        dataIndex: 'localName',
        title: i18n.global.t('meos_control_web.lighting_module_name'),
        width: 260,
        fixed: 'left'
    };
    const abnormal = {
        dataIndex: 'abnormal',
        title: i18n.global.t('meos_control_web.abnormal_event'),
        width: 80
    };
    const baseInfo = {
        dataIndex: 'basicInfos',
        title: i18n.global.t('meos_control_web.basic_info'),
        children: [
            {
                dataIndex: 'localId',
                title: i18n.global.t('meos_control_web.lighting_module_code')
            },
            {
                dataIndex: 'relDistributionCabinet',
                title: i18n.global.t('meos_control_web.related_distribution_box')
            },
            {
                dataIndex: 'relSpace',
                title: i18n.global.t('meos_control_web.located_space')
            }
        ]
    };
    // 运行参数列
    const runningColumn = ref([]);
    const controlHeaderList = ref([lightModule, abnormal, baseInfo]);
    const setTableHeader = list => {
        if (!list || list.length === 0) return;
        let runningParamList = [];
        list.forEach(tableItem => {
            if (tableItem?.runningParameters && tableItem?.runningParameters?.length > 0) {
                runningParamList = unionBy(tableItem.runningParameters, runningParamList, 'infoCode');
            }
        });
        if (runningParamList.length > 0) {
            const yxcs = {
                dataIndex: 'runningParameters',
                title: i18n.global.t('meos_control_web.operating_parameters'),
                children: []
            };
            yxcs.children = runningParamList.map((res, index) => {
                const key = `running${index}`;
                res.customKey = key;
                return {
                    dataIndex: key,
                    infoCode: res.infoCode,
                    title: res.infoCodeName
                };
            });
            runningColumn.value = yxcs.children;
            controlHeaderList.value = [lightModule, yxcs, abnormal, baseInfo];
        } else {
            runningColumn.value = [];
            controlHeaderList.value = [lightModule, abnormal, baseInfo];
        }
    };
    const params = computed(() => {
        const { coInfo } = loopListStore;
        const obj = {
            serviceRoomFuncTypes: [],
            keyword: keyword.value,
            page: pageMeta.value.pageNum || 1,
            pageSize: pageMeta.value.pageSize,
            demandTemplateType: coInfo.templateType,
            templateType: coInfo.templateType,
            orders: [
                {
                    column: 'localName',
                    chineseOrder: true
                }
            ],
            onlineStatus: getOnlineKey(coInfo.onlineStatus),
            abnormalStatus: removeAll(coInfo.faultConditions) ? (removeAll(coInfo.faultConditions) === 'NORMAL' ? 0 : 1) : ''
        };
        if (coInfo.instanceType && coInfo.instanceType !== 'PROJECT') {
            obj.instanceType = coInfo.instanceType;
            obj.instanceId = coInfo.instanceId;
            obj.serviceRoomFuncTypes = [];
        } else {
            obj.serviceRoomFuncTypes.push(coInfo.instanceId);
        }
        return obj;
    });
    const pageFuc = {
        pageChange: v => {
            pageMeta.value.pageNum = v;
            queryTableData();
        },
        sizeChange: v => {
            pageMeta.value.pageSize = v;
            pageMeta.value.pageNum = 1;
            queryTableData();
        }
    };
    // 表格高度变化
    const tableHeightChange = () => {
        setTimeout(() => {
            time.value = new Date().getTime();
        }, 250);
    };

    const clearSearch = () => {
        keyword.value = '';
        queryTableData();
    };
    // 搜索触发
    const handleChange = (event, type) => {
        queryStatus.value = 'query';
        if (type === 'change') {
            keyword.value = event;
            queryTableData();
        } else {
            keyword.value = event?.target?.value;
        }
    };

    const queryChange = type => {
        const { coInfo } = loopListStore;
        queryStatus.value = type;
        if (type === 'reset') {
            search.value[0].clearInp();
            space.value.value = '';
            loopListStore.setList(
                {
                    coInfo: {
                        instanceType: '',
                        instanceId: '',
                        onlineStatus: '',
                        faultConditions: '',
                        templateType: coInfo.templateType
                    }
                },
                false
            );
        }
        queryTableData();
    };
    //  请求表头数据
    const getHeaderData = async () => {
        const loadingInstance = Loading('.loop-list-wrap');
        await queryTableData();
        showHeader.value = true;
        loadingInstance.destroy();
    };
    const queryTableData = async () => {
        const { coInfo } = loopListStore;
        if (loading.value) return;
        loading.value = true;
        const loadingInstance = Loading('.loop-table-wrap');
        try {
            let responseData = await getPageControllerDetails(
                queryStatus.value === 'query'
                    ? params.value
                    : {
                          keyword: '',
                          instanceType: '',
                          instanceId: '',
                          page: pageMeta.value.pageNum || 1,
                          pageSize: pageMeta.value.pageSize,
                          demandTemplateType: coInfo.templateType,
                          templateType: coInfo.templateType,
                          onlineStatus: '',
                          abnormalStatus: '',
                          orders: [
                              {
                                  column: 'localName',
                                  chineseOrder: true
                              }
                          ]
                      }
            );
            if (responseData.code === '00000') {
                const rawData = responseData?.data?.records || [];
                // 设置表头
                setTableHeader(rawData);
                // 设置基本信息
                rawData.forEach(res => {
                    res.relDistributionCabinet = res?.basicInfos?.relDistributionCabinet?.localName || '--';
                    res.relSpace = getRelSpaceName(res?.basicInfos?.relSpace);
                    res.abnormal = {
                        abnormalEventCount: res?.abnormalEventCount,
                        abnormalEvents: res?.abnormalEvents || []
                    };
                });
                dataSource.value = rawData;
                pageMeta.value.total = responseData?.data?.totalCount;
                time.value = new Date().getTime();
            }
        } finally {
            loading.value = false;
            loadingInstance.destroy();
        }
    };
    watch(
        () => templateType?.value,
        v => {
            loopListStore.setList(
                {
                    coInfo: {
                        templateType: v
                    }
                },
                false
            );
            loopListStore.listVisible && queryTableData();
        },
        {
            immediate: true
        }
    );
    loopListStore.listVisible && getHeaderData();
    return {
        params,
        loading,
        search,
        keyword,
        pageFuc,
        pageMeta,
        dataSource,
        showHeader,
        runningColumn,
        controlHeaderList,
        clearSearch,
        handleChange,
        queryChange,
        tableHeightChange
    };
};
