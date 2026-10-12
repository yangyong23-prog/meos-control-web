import { queryListInfoCodeConfigsByTemplateType, listInfoCodeConfigsByTemplateId, queryListInfoCodes } from '@/apis/ACOperationControl';
import useLoading from './useLoading';
import { getBtnList, isEmpty } from '../utils';
import _, { head } from 'lodash';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { onMounted } from 'vue';
import i18n from '@/localization';
import { AIR_TERMINAL, IOT_RUNNING } from '@/utils/globalVariables';

const { isLoading: isTableLoading, openLoading, closeLoading } = useLoading('list-content-wrap');

export default (setFoldBtnStatus, open, changeOpen, props) => {
    const base = baseStore();
    const LIGHTCLASSCODES = {
        LOOP: 'LTLTCC', // 照明回路
        CONTROL: 'LTLTCU' // 照明控制模块
    };
    const runningMonitorType = inject('runningMonitorType');
    const currentItem = inject('currentItem');
    const tableList = inject('tableList');
    const placeholder = ref(i18n.global.t('meos_control_web.search_device_name'));
    const buildingSpaceTree = inject('buildingSpaceTree');
    const inSpaceTree = inject('inSpaceTree');
    const serveSpaceTree = inject('serveSpaceTree');
    const currentFloorObj = inject('currentFloorObj');
    const templateType = inject('templateType');
    const filterStatus = ref('reset');
    const isCurrentItem = ref(false); // 解决下拉框传参问题
    const isDynamicInfoCodeFilters = ref(false); // 下拉框查询
    const timeKey = ref(new Date().getTime());
    const btnList = ref([]); // 枚举值列表
    const tableData = ref([]); // 表格数据
    const tableHead = ref([]); // 表头数据
    const headInfoCode = ref([]); // 动态插槽使用
    const selectList = ref([]); // 筛选栏
    const funcTypeOptions = {};
    const lampFuncTypeOptions = {};
    if (runningMonitorType === 'LIGHTING' && props.allLoops) {
        props.allLoops.forEach(loop => {
            //
            if (
                (templateType?.value === 'PUBLIC_AREA_LIGHTING' && loop?.serviceAreaType === '1') ||
                (templateType?.value === 'PARKING_LOT_LIGHTING' && loop?.serviceAreaType === '2')
            ) {
                if (loop.funcTypeName && loop.funcType) {
                    funcTypeOptions[loop.funcType] = {
                        id: loop.funcType,
                        name: loop.funcTypeName
                    };
                }
                if (loop.lampFuncTypeName && loop.lampFuncType) {
                    lampFuncTypeOptions[loop.lampFuncType] = {
                        id: loop.lampFuncType,
                        name: loop.lampFuncTypeName
                    };
                }
            }
        });
    }
    const staticInputList = ref([]);

    const selectedList = ref([]); // 多选
    const keywordValue = ref('');
    const InfoCodes = ref([]);
    const spaceMeta = ref({
        titleValue: runningMonitorType === 'SEWAGE' ? '1' : '0',
        titleOption: [
            {
                id: '0',
                name: i18n.global.t('meos_control_web.served_space')
            },
            {
                id: '1',
                name: i18n.global.t('meos_control_web.located_space')
            }
        ],
        value: '',
        option: []
    });
    const inSpaceOptions = ref([]);
    const serveSpaceOptions = ref([]);
    const inSpaces = ref({
        value: '',
        name: i18n.global.t('meos_control_web.located_space')
    });
    const serviceSpaces = ref({
        value: '',
        name: i18n.global.t('meos_control_web.served_space')
    });
    const pageMeta = reactive({
        pageNum: 1,
        pageSize: props.pageSize,
        total: 0
    });
    // 当用户快速切换设备列表选项时，重复请求可能导致右侧表格中显示的内容和左侧设备列表选中的设备不一致
    // requestTimeStamp 记录 init函数执行时的时间戳，用于判断多次请求时 接口返回的数据是否需求丢弃
    let requestTimeStamp = 0;
    const parseSpaceIds = (queryId, spaces) => {
        const ret = [];
        if (queryId.startsWith('F')) {
            spaces.forEach(res => {
                if (res.type === 'BUILDING') {
                    res.children.forEach(floor => {
                        if (floor.id === queryId) {
                            floor?.children?.map(item => {
                                item?.children?.forEach(space => {
                                    ret.push(space.id);
                                });
                            }) || [];
                        }
                    });
                } else if (res.type === 'FLOOR') {
                    if (res.id === queryId) {
                        res?.children?.map(item => {
                            item?.children?.forEach(space => {
                                ret.push(space.id);
                            });
                        }) || [];
                    }
                }
            });
        } else {
            if (queryId.startsWith('SFT')) {
                spaces.forEach(res => {
                    res.children.forEach(floor => {
                        floor?.children.forEach(item => {
                            if (item.id === queryId) {
                                item?.children?.forEach(space => {
                                    ret.push(space.id);
                                });
                            }
                        });
                    });
                });
            } else if (queryId.startsWith('S')) {
                ret.push(queryId);
            } else {
                spaces.forEach(res => {
                    if (res.id === queryId) {
                        res.children.forEach(floor => {
                            floor?.children.forEach(item => {
                                item?.children?.forEach(space => {
                                    ret.push(space.id);
                                });
                            });
                        });
                    }
                });
            }
        }
        return ret;
    };
    const bodyParams = computed(() => {
        // isCurrentItem.value
        const obj = {};
        obj.serviceSpaceIds = [];
        // 照明

        if (runningMonitorType === 'LIGHTING') {
            // 服务空间
            if (!isEmpty(serviceSpaces.value.value)) {
                obj.serviceSpaceIds = parseSpaceIds(serviceSpaces.value.value, serveSpaceOptions.value);
            }
            // 所在空间
            if (!isEmpty(inSpaces.value.value)) {
                obj.inSpaceIds = parseSpaceIds(inSpaces.value.value, inSpaceOptions.value);
            }
            // 其他服务空间
        } else if (spaceMeta.value.titleValue === '0' && !isEmpty(spaceMeta.value.value)) {
            if (spaceMeta.value.value.startsWith('F')) {
                spaceMeta.value.option.forEach(res => {
                    if (res.type === 'BUILDING') {
                        res.children.forEach(floor => {
                            if (floor.id === spaceMeta.value.value) {
                                obj.serviceSpaceIds = floor?.children?.map(item => item.id) || [];
                            }
                        });
                    } else if (res.type === 'FLOOR') {
                        if (res.id === spaceMeta.value.value) {
                            obj.serviceSpaceIds = res?.children?.map(item => item.id) || [];
                        }
                    }
                });
            } else {
                if (spaceMeta.value.value.startsWith('S')) {
                    obj.serviceSpaceIds = [spaceMeta.value.value];
                } else {
                    spaceMeta.value.option.forEach(res => {
                        if (res.id === spaceMeta.value.value) {
                            res.children.forEach(floor => {
                                floor?.children.forEach(item => {
                                    obj.serviceSpaceIds.push(item.id);
                                });
                            });
                        }
                    });
                }
            }
            // 其他所在空间
        } else if (spaceMeta.value.titleValue === '1' && !isEmpty(spaceMeta.value.value)) {
            if (spaceMeta.value.value.startsWith('F')) {
                spaceMeta.value.option.forEach(res => {
                    if (res.type === 'BUILDING') {
                        res.children.forEach(floor => {
                            if (floor.id === spaceMeta.value.value) {
                                obj.inSpaceIds = floor?.children?.map(item => item.id) || [];
                            }
                        });
                    } else if (res.type === 'FLOOR') {
                        if (res.id === spaceMeta.value.value) {
                            obj.inSpaceIds = res?.children?.map(item => item.id) || [];
                        }
                    }
                });
            } else {
                if (spaceMeta.value.value.startsWith('S')) {
                    obj.inSpaceIds = [spaceMeta.value.value];
                } else {
                    spaceMeta.value.option.forEach(res => {
                        if (res.id === spaceMeta.value.value) {
                            res.children.forEach(floor => {
                                floor?.children.forEach(item => {
                                    obj.inSpaceIds.push(item.id);
                                });
                            });
                        }
                    });
                }
            }
        }
        obj.staticInfoCodeFilters = [];
        if (filterStatus.value === 'query') {
            obj.dynamicInfoCodeFilters = selectList.value
                .map(code => {
                    return {
                        infoCode: code.infoCode,
                        infoCodeType: code.infoCodeType,
                        // 当多选选项包含无偏差3的时候,需要把获取不到数据（null)的设备也加上
                        dataValue: code.infoCode === 'controlDeviationStatus' ? (code.value.indexOf('3') >= 0 ? [...code.value, null] : code.value) : code.value
                    };
                })
                .filter(code => code.dataValue && code.dataValue.length);
            staticInputList.value.forEach(code => {
                if (code.value) {
                    obj.staticInfoCodeFilters.push({
                        infoCode: code.infoCode,
                        infoCodeType: code.infoCodeType,
                        dataValue: code.value
                    });
                }
            });
        } else {
            spaceMeta.value.titleValue = runningMonitorType === 'SEWAGE' ? '1' : '0';
            obj.dynamicInfoCodeFilters = [];
            obj.staticInfoCodeFilters = [];
            if (currentFloorObj?.value?.id && isCurrentItem.value) {
                spaceMeta.value.value = currentFloorObj.value.id;
            } else {
                spaceMeta.value.value = '';
                obj.serviceSpaceIds = [];
            }
        }
        return filterEmptyArray(obj);
    });

    function filterEmptyArray(obj) {
        for (let key in obj) {
            if (Array.isArray(obj[key]) && obj[key].length === 0) {
                delete obj[key];
            }
        }
        return obj;
    }

    const init = _.debounce(async params => {
        tableData.value = [];
        tableHead.value = [];
        headInfoCode.value = [];
        InfoCodes.value = [];
        requestTimeStamp = Date.now();
        try {
            openLoading();
            let response1Data = [],
                currentParams = {
                    ...bodyParams.value,
                    runningMonitorSecondType: templateType?.value,
                    // 模版类型ID
                    templateTypeId: params?.value?.templateTypeId || currentItem?.value.templateTypeId,
                    // 分页查询参数
                    page: {
                        pageNo: pageMeta.pageNum,
                        pageSize: pageMeta.pageSize
                    },
                    filterBothNotExistIotInfoCodeRule: true
                };
            if (runningMonitorType === 'LIGHTING') {
                currentParams.queryIotInfoCodeRule = false;
            }
            if (runningMonitorType === 'LIGHTING' && keywordValue.value) {
                currentParams.signAndStaticInfoCodeFilters = {
                    $andOr: [
                        {
                            infoCode: 'localName',
                            sign: '$like',
                            dataValue: keywordValue.value
                        },
                        {
                            infoCode: 'localId',
                            sign: '$like',
                            dataValue: keywordValue.value
                        }
                    ]
                };
            } else {
                currentParams.localName = keywordValue.value;
            }
            if (![AIR_TERMINAL, 'SECURITY', 'SEWAGE', 'LIGHTING', 'VENTILATION'].includes(runningMonitorType)) {
                currentParams.filterControlObject = true;
            }
            const queryTemplateType = currentParams => {
                if ([AIR_TERMINAL, 'LIGHTING', 'SEWAGE', 'LIGHTING'].includes(runningMonitorType)) {
                    // 排序
                    currentParams.orders = [
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
                    ];
                    return listInfoCodeConfigsByTemplateId(currentParams);
                } else {
                    return queryListInfoCodeConfigsByTemplateType(currentParams);
                }
            };

            const requestTimeStampPromise = () => {
                return Promise.resolve(requestTimeStamp);
            };

            const [response1, response2, response3] = await Promise.all([
                queryTemplateType(currentParams),
                queryListInfoCodes({
                    classCode: params?.value.classCode || currentItem?.value.classCode,
                    isThrows: true,
                    queryCache: false
                }),
                requestTimeStampPromise()
            ]);
            if (requestTimeStamp !== response3) {
                // 已经有新的请求发出，本次请求的数据直接丢弃
                return;
            }
            if (response1.result === 'success') {
                response1Data = response1?.data || [];
                pageMeta.total = response1?.total;
                tableList.value = response1Data;
            } else {
                tableList.value = [];
            }
            if (response2.result === 'success') {
                InfoCodes.value = response2?.data || [];
            } else {
                InfoCodes.value = [];
            }
            const airZoneInfos = [];
            tableData.value = transformTableData(response1Data, InfoCodes?.value, airZoneInfos);
            const headInfo = transformTableHead(response1Data[0], airZoneInfos);
            tableHead.value = response1Data?.length ? headInfo?.tableHead : [];
            headInfoCode.value = response1Data?.length ? headInfo?.headInfoCode : [];
            if (selectList?.value?.length) {
                // 筛选栏下拉项查询,枚举值查询
                await setSelectListAndEnum([response1Data, InfoCodes?.value]);
            }
            closeLoading();
            isTableLoading.value = false;
        } catch (e) {
            closeLoading();
            isTableLoading.value = false;
        }
    }, 500);

    // 表格数据转换
    const transformTableData = (responses, infoList, airZoneInfoCodes) => {
        responses?.length &&
            responses.forEach(item => {
                item.RWD_OBJECT_DETAIL = null; // 初始化要重置RWD_OBJECT_DETAIL;
                if (!item.objectId) item.objectId = item.id;
                selectedList?.value?.length &&
                    selectedList.value.forEach(check => {
                        if (check.objectId === item.objectId) {
                            item.checked = 'checked';
                        }
                    });
                if (item.relInfoCodeGroupConfigs?.length) {
                    item.relInfoCodeGroupConfigs.forEach(second => {
                        if (second.relInfoCodeConfigs) {
                            second.relInfoCodeConfigs.forEach(third => {
                                third.groupCode = second.groupCode;
                                item[`${third?.infoCode}-obj`] = third;
                                if (!third?.relInfoCodeConfig) {
                                    third.relInfoCodeConfig = third?.relInfoCodeConfigs?.length ? third?.relInfoCodeConfigs[0] : null;
                                    // 单设定列特殊处理;
                                    if (third?.showStyle === 'SET_VALUE_SINGLE_COLUMN') {
                                        item[`${third?.infoCode}-config-obj`] = structuredClone(third);
                                    }
                                }
                                if (third.relInfoCodeConfig) {
                                    item[`${third?.relInfoCodeConfig?.infoCode}-config-obj`] = third;
                                    if (item[`${third?.relInfoCodeConfig?.infoCode}-config-obj`]?.dataSource?.length) {
                                        item[third?.infoCode] =
                                            item[`${third?.infoCode}-obj`]?.dataSource.find(source => source.code === third?.dataValue)?.name || '--' + `${third?.unit || ''}`;
                                        item[`${third?.relInfoCodeConfig?.infoCode}-config`] =
                                            item[`${third?.relInfoCodeConfig?.infoCode}-config-obj`]?.relInfoCodeConfig?.dataSource.find(
                                                source => source.code === third?.relInfoCodeConfig?.dataValue
                                            )?.name || '--' + `${third?.relInfoCodeConfig?.unit || ''}`;
                                    } else {
                                        item[third?.infoCode] = `${third?.dataValue || '--'}${third?.unit || ''}`;
                                        item[`${third?.relInfoCodeConfig?.infoCode}-config`] = `${third?.relInfoCodeConfig?.dataValue || '--'}${
                                            third?.relInfoCodeConfig?.unit || ''
                                        }`;
                                    }
                                } else {
                                    // 判断有dataSource的去遍历dataSource取name，没有默认展示dataValue
                                    if (item[`${third?.infoCode}-obj`]?.dataSource?.length) {
                                        item[third?.infoCode] =
                                            item[`${third?.infoCode}-obj`]?.dataSource.find(source => source.code === third?.dataValue)?.name || '--' + `${third?.unit || ''}`;
                                    } else {
                                        if (['MechForArch/Eq2Sp', 'MechInArch/Eq2Sp'].includes(third?.infoCode) && item[`${third?.infoCode}-obj`]?.infoCodeType === 'RWD_OBJECT') {
                                            // 设备服务空间 设备所在空间
                                            item[third?.infoCode] = `${third?.dataValue?.join('、') || '--'}`;
                                        } else if (third?.infoCode === 'alarmeventdetail') {
                                            third.infoCodeName = i18n.global.t('meos_control_web.abnormal_status');
                                        } else {
                                            if (third?.infoCodeType === 'RWD_OBJECT_DETAIL') {
                                                if (runningMonitorType === 'LIGHTING') {
                                                    item[third?.infoCode] = `${third?.dataValue?.map(r => r.localName).join('、') || '--'}`;
                                                } else {
                                                    item[third?.infoCodeType] = _.compact([item[third?.infoCodeType], `${third?.dataValue.map(r => r.localName).join('、')}`]).join(
                                                        '、'
                                                    );
                                                }

                                                // 如果有关联设备，还要添加关联设备的信息点
                                                if (third?.infoCode === 'serviceACZone' && third.dataValue?.length > 0) {
                                                    const relInfoCodeConfigs = third.dataValue[0].relInfoCodeGroupConfigs?.find(() => true)?.relInfoCodeConfigs;
                                                    relInfoCodeConfigs?.forEach(acZoneInfo => {
                                                        const existsIotRule = airZoneInfoCodes?.some(_info => _info.infoCode === acZoneInfo?.infoCode);
                                                        if (airZoneInfoCodes && !existsIotRule) {
                                                            airZoneInfoCodes.push(acZoneInfo);
                                                        }
                                                        item[`${acZoneInfo?.infoCode}-obj`] = acZoneInfo;
                                                        if (item[`${acZoneInfo?.infoCode}-obj`]?.dataSource?.length) {
                                                            item[acZoneInfo?.infoCode] =
                                                                item[`${acZoneInfo?.infoCode}-obj`]?.dataSource.find(source => source.code === third?.dataValue)?.name ||
                                                                '--' + `${third?.unit || ''}`;
                                                        } else {
                                                            item[acZoneInfo?.infoCode] = `${acZoneInfo?.dataValue || '--'}${acZoneInfo?.unit || ''}`;
                                                        }
                                                    });
                                                }
                                            } else {
                                                item[third?.infoCode] = `${third?.dataValue || '--'}${third?.unit || ''}`;
                                            }
                                        }
                                    }
                                }

                                //showStyle === SET_VALUE_ACTION_COLUMN 加操作列
                                if (third?.relInfoCodeConfig && third?.relInfoCodeConfig?.showStyle === 'SET_VALUE_ACTION_COLUMN') {
                                    item[`${third.infoCode}-operate`] = i18n.global.t('meos_control_web.operation1');
                                    item[`${third?.infoCode}-operate-obj`] = third;
                                }
                                // listInfoCodes接口查信息点类型
                                infoList?.length &&
                                    infoList.forEach(info => {
                                        if (info.code === third.infoCode) {
                                            third.dataType = info.dataType;
                                            if (third?.relInfoCodeConfig) {
                                                third.relInfoCodeConfig.dataType = info.dataType;
                                            }
                                        }
                                    });
                            });
                        }
                    });
                }

                const parameterSetOperation = item.relInfoCodeGroupConfigs?.find(o => o.groupCode === 'parameterSetOperation');
                if (parameterSetOperation?.groupChildren) {
                    const condition = parameterSetOperation.groupChildren.find(o => o.groupCode === 'parameterSetOperationCondition')?.relInfoCodeConfigs;
                    const localRemoteStatus = condition?.find(o => o.infoCode === 'localRemoteStatus');
                    const onlineStatus = condition?.find(o => o.infoCode === 'onlineStatus');
                    // https://shimo.im/docs/Wr3DpYy68KI2D53J/ 《设备状态对设备控制操作的限制》，可复制链接后用石墨文档 App 打开
                    if (
                        (runningMonitorType === 'LIGHTING' && onlineStatus?.dataValue === '1') ||
                        (localRemoteStatus?.existsIotRule === false && onlineStatus?.dataValue === '1') ||
                        (localRemoteStatus?.dataValue === '1' && onlineStatus?.dataValue === '1')
                    ) {
                        item.disable = false;
                    } else {
                        item.disable = true;
                    }
                } else {
                    item.disable = true;
                }
                if (!item.projectId) {
                    item.projectId = base.projectId;
                }
                !isEdge() && (item.disable = true);
            });
        return responses;
    };
    const highlightKeyword = name => {
        const regex = new RegExp(keywordValue.value, 'gi');
        return name ? name.replace(regex, '<span style="color:#246FE5">$&</span>') : '--';
    };

    onMounted(() => {
        openLoading();
    });

    // 表头转换
    const transformTableHead = (item, airZoneInfoCodes) => {
        let headInfoCode = [],
            tableHead = [
                {
                    title: i18n.global.t('meos_control_web.equipment_name'),
                    minWidth: 180,
                    resizable: true,
                    dataIndex: 'objectName',
                    fixed: 'left'
                }
            ];
        item.relInfoCodeGroupConfigs?.length &&
            item.relInfoCodeGroupConfigs.forEach(second => {
                tableHead.push({
                    title: second.groupName,
                    dataIndex: second.groupCode,
                    resizable: true,
                    children: []
                });
                second.relInfoCodeConfigs?.length &&
                    second.relInfoCodeConfigs.forEach(third => {
                        third.groupCode = second.groupCode;
                        if (runningMonitorType !== 'LIGHTING' && (third?.infoCodeType === 'RWD_OBJECT_DETAIL' || !headInfoCode.includes('RWD_OBJECT_DETAIL'))) {
                            headInfoCode.push('RWD_OBJECT_DETAIL');
                        } else {
                            headInfoCode.push(third?.infoCode);
                        }
                        tableHead.forEach(head => {
                            if (head.dataIndex === third.groupCode) {
                                if (!third?.relInfoCodeConfig) {
                                    third.relInfoCodeConfig = third?.relInfoCodeConfigs?.length ? third?.relInfoCodeConfigs[0] : null;
                                }
                                if (third?.relInfoCodeConfig && third?.relInfoCodeConfig.showStyle === 'SET_VALUE_RADIO') {
                                    head.children.push({
                                        dataIndex: `${third?.relInfoCodeConfig?.infoCode}-config`,
                                        title: third?.relInfoCodeConfig?.aliasName || third?.relInfoCodeConfig.infoCodeName,
                                        minWidth: 140,
                                        resizable: true,
                                        children: []
                                    });
                                    headInfoCode.push(`${third?.relInfoCodeConfig?.infoCode}-config`);
                                } else if (third?.relInfoCodeConfig && third?.relInfoCodeConfig?.showStyle === 'SET_VALUE_ACTION_COLUMN') {
                                    head.children.push({
                                        dataIndex: third.infoCode,
                                        title: third?.aliasName || third.infoCodeName,
                                        children: [
                                            {
                                                title: i18n.global.t('meos_control_web.actual_value'),
                                                minWidth: 90,
                                                resizable: true,
                                                dataIndex: third.infoCode
                                            },
                                            {
                                                title: i18n.global.t('meos_control_web.setpoint_value'),
                                                minWidth: 90,
                                                resizable: true,
                                                dataIndex: `${third.relInfoCodeConfig?.infoCode}-config`
                                            },
                                            {
                                                title: i18n.global.t('meos_control_web.operation1'),
                                                dataIndex: `${third.infoCode}-operate`,
                                                minWidth: 120,
                                                resizable: true
                                            }
                                        ]
                                    });
                                    headInfoCode.push(`${third?.relInfoCodeConfig?.infoCode}-config`);
                                    headInfoCode.push(`${third?.infoCode}-operate`);
                                } else {
                                    // 可编辑列
                                    if (third?.showStyle === 'SET_VALUE_SINGLE_COLUMN') {
                                        const setColumn = {
                                            title: i18n.global.t('meos_control_web.setpoint_value'),
                                            minWidth: 90,
                                            resizable: true,
                                            dataIndex: `${third?.infoCode}-config`
                                        };
                                        head.children.push({
                                            title: third?.aliasName || third?.infoCodeName,
                                            children: [setColumn]
                                        });
                                        headInfoCode.push(`${third?.infoCode}-config`);
                                    } else if (third.relInfoCodeConfig) {
                                        const actualColumn = {
                                            title: i18n.global.t('meos_control_web.actual_value'),
                                            minWidth: 90,
                                            resizable: true,
                                            dataIndex: third.infoCode
                                        };
                                        const setColumn = {
                                            title: i18n.global.t('meos_control_web.setpoint_value'),
                                            minWidth: 90,
                                            resizable: true,
                                            dataIndex: `${third.relInfoCodeConfig?.infoCode}-config`
                                        };
                                        head.children.push({
                                            // dataIndex: third.relInfoCodeConfig.infoCode,
                                            title: third?.relInfoCodeConfig?.aliasName || third.relInfoCodeConfig.infoCodeName,
                                            children: [actualColumn, setColumn]
                                        });
                                        headInfoCode.push(`${third?.relInfoCodeConfig?.infoCode}-config`);
                                    } else {
                                        if (['localId', 'MechForArch/Eq2Sp', 'MechInArch/Eq2Sp'].includes(third?.infoCode)) {
                                            head.children.push({
                                                dataIndex: third.infoCode,
                                                title: third?.aliasName || third.infoCodeName,
                                                minWidth: 150,
                                                resizable: true,
                                                children: []
                                            });
                                        } else if (third?.infoCodeType === 'RWD_OBJECT_DETAIL') {
                                            const infoCodeExist = head.children.find(child => child.dataIndex === 'RWD_OBJECT_DETAIL');
                                            if (runningMonitorType === 'LIGHTING') {
                                                head.children.push({
                                                    dataIndex: third?.infoCode,
                                                    title: third?.aliasName || third.infoCodeName,
                                                    minWidth: 150,
                                                    resizable: true,
                                                    children: []
                                                });
                                            } else if (!infoCodeExist) {
                                                head.children.push({
                                                    dataIndex: 'RWD_OBJECT_DETAIL',
                                                    title:
                                                        third?.infoCode === 'serviceACZone'
                                                            ? third?.aliasName || third.infoCodeName
                                                            : i18n.global.t('meos_control_web.related_equipment'),
                                                    minWidth: 150,
                                                    resizable: true,
                                                    children: []
                                                });
                                            }
                                            if (third?.infoCode === 'serviceACZone') {
                                                airZoneInfoCodes?.forEach(acZoneInfo => {
                                                    const subInfoCodeExist = head.children.find(child => child.dataIndex === acZoneInfo.infoCode);
                                                    if (!subInfoCodeExist) {
                                                        head.children.push({
                                                            dataIndex: acZoneInfo.infoCode,
                                                            title: acZoneInfo?.aliasName || acZoneInfo.infoCodeName,
                                                            minWidth: 150,
                                                            resizable: true,
                                                            children: []
                                                        });
                                                        headInfoCode.push(acZoneInfo.infoCode);
                                                    }
                                                });
                                            }
                                        } else {
                                            head.children.push({
                                                dataIndex: third.infoCode,
                                                title: third?.aliasName || third.infoCodeName,
                                                minWidth: 90,
                                                resizable: true,
                                                children: []
                                            });
                                        }
                                    }
                                }
                            }
                        });
                    });
            });
        return {
            tableHead,
            headInfoCode
        };
    };

    const setSelectListAndEnum = responses => {
        // 筛选栏下拉项查询,枚举值查询
        const enumList = responses[1]?.length && responses[1].filter(res => String(res?.dataType).toUpperCase() === 'ENUM');
        btnList.value = getBtnList(responses[0], enumList);
    };

    // 分页change
    const pageFuc = {
        pageChange: v => {
            pageMeta.pageNum = v || 1;
            filterStatus.value = 'query';
            clearChecked();
            isCurrentItem.value = true;
            init();
        },
        sizeChange: v => {
            pageMeta.pageSize = v;
            pageMeta.pageNum = 1;
            filterStatus.value = 'query';
            clearChecked();
            isCurrentItem.value = true;
            init();
        }
    };

    // 清空选择
    const clearChecked = () => {
        selectedList.value = [];
        tableData?.value.forEach(row => {
            row.checked = 'uncheck';
        });
        timeKey.value = Math.random();
    };

    const checkedChange = ({ selecteds }) => {
        selectedList.value = selecteds;
        // 解决之前因解sse刷新导致状态丢失问题后续问题
        if (tableData?.value && selectedList?.value) {
            tableData.value.forEach(row => {
                try {
                    if (selecteds?.length) {
                        const isChecked = selecteds.some(item => item.id === row.id);
                        row.checked = isChecked ? 'checked' : 'uncheck';
                    } else {
                        row.checked = 'uncheck';
                    }
                } catch (error) {
                    console.error('Error in checkedChange:', error);
                }
            });
        }
        // 多选操作顶部收起
        if (selectedList.value.length) {
            if (open.value) {
                changeOpen();
            }
        }
    };

    const filterTable = status => {
        filterStatus.value = status;
        if (status === 'reset') {
            keywordValue.value = '';
            selectList.value?.length &&
                selectList.value.forEach(item => {
                    item.value = '';
                });
            staticInputList.value?.length &&
                staticInputList.value.forEach(item => {
                    item.value = '';
                });
            if (currentFloorObj?.value?.id && isCurrentItem.value) {
                spaceMeta.value.value = currentFloorObj.value.id;
            } else {
                spaceMeta.value.value = '';
            }
            if (currentFloorObj?.value?.id) {
                if (runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.LOOP) {
                    serviceSpaces.value.value = currentFloorObj?.value?.id;
                    inSpaces.value.value = '';
                } else if (runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.CONTROL) {
                    inSpaces.value.value = currentFloorObj?.value?.id;
                    serviceSpaces.value.value = '';
                }
            } else {
                serviceSpaces.value.value = '';
                inSpaces.value.value = '';
            }
        } else {
            pageMeta.pageNum = 1;
        }
        init();
    };

    // 参数重置
    const resetParams = () => {
        selectedList.value = [];
        pageMeta.pageNum = 1;
        pageMeta.pageSize = props.pageSize;
        timeKey.value = Math.random();
    };

    // 左侧列表选中的对象
    watch(
        () => currentItem?.value,
        async () => {
            if (currentItem?.value?.templateTypeId) {
                isCurrentItem.value = true;
                resetParams();
                openLoading();
                filterTable('reset');
                if (runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.LOOP) {
                    placeholder.value = i18n.global.t('meos_control_web.search_lighting_loop_name_code');
                } else if (runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.CONTROL) {
                    placeholder.value = i18n.global.t('meos_control_web.press_enter_search_control_module_name_code');
                }

                selectList.value = [
                    {
                        dataSources: [
                            {
                                id: '0',
                                name: i18n.global.t('meos_control_web.offline')
                            },
                            {
                                id: '1',
                                name: i18n.global.t('meos_control_web.online')
                            }
                        ],
                        value: '',
                        name: i18n.global.t('meos_control_web.online_status'),
                        infoCode: 'onlineStatus',
                        options: [
                            {
                                id: '0',
                                name: i18n.global.t('meos_control_web.offline')
                            },
                            {
                                id: '1',
                                name: i18n.global.t('meos_control_web.online')
                            }
                        ],
                        infoCodeType: IOT_RUNNING
                    },
                    ...(currentItem?.value?.classCode === LIGHTCLASSCODES.CONTROL
                        ? [
                              {
                                  dataSources: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.normal')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.fault')
                                      }
                                  ],
                                  value: '',
                                  name: i18n.global.t('meos_control_web.fault_status'),
                                  infoCode: 'faultStatus',
                                  options: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.normal')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.fault')
                                      }
                                  ],
                                  infoCodeType: IOT_RUNNING
                              }
                          ]
                        : [
                              {
                                  dataSources: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.stop')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('common.operation')
                                      }
                                  ],
                                  value: '',
                                  name: i18n.global.t('meos_control_web.operation_status'),
                                  infoCode: 'runStatus',
                                  options: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.stop')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('common.operation')
                                      }
                                  ],
                                  infoCodeType: IOT_RUNNING
                              }
                          ]),
                    ...(runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.LOOP
                        ? [
                              {
                                  dataSources: [
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.on')
                                      },
                                      {
                                          id: '2',
                                          name: i18n.global.t('meos_control_web.off')
                                      }
                                  ],
                                  value: '',
                                  name: i18n.global.t('meos_control_web.operation_demand'),
                                  infoCode: 'computeDemand',
                                  options: [
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.on')
                                      },
                                      {
                                          id: '2',
                                          name: i18n.global.t('meos_control_web.off')
                                      }
                                  ],
                                  infoCodeType: IOT_RUNNING
                              }
                          ]
                        : []),
                    ...(runningMonitorType !== 'SEWAGE' && currentItem?.value?.classCode !== LIGHTCLASSCODES.CONTROL
                        ? [
                              {
                                  dataSources: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.alarm')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.normal')
                                      }
                                  ],
                                  value: '',
                                  name:
                                      runningMonitorType === 'LIGHTING'
                                          ? i18n.global.t('meos_control_web.control_feedback_mismatch')
                                          : i18n.global.t('meos_control_web.status_feedback_mismatch_alarm'),
                                  infoCode: 'orderFailAlarm',
                                  options: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.normal')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.alarm')
                                      }
                                  ],
                                  infoCodeType: IOT_RUNNING
                              }
                          ]
                        : []),
                    ...(runningMonitorType === AIR_TERMINAL || (runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.LOOP)
                        ? [
                              {
                                  dataSources: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.manual')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.auto')
                                      }
                                  ],
                                  value: '',
                                  name: i18n.global.t('meos_control_web.manual_auto_status'),
                                  infoCode: 'manualAutoStatus',
                                  options: [
                                      {
                                          id: '0',
                                          name: i18n.global.t('meos_control_web.manual')
                                      },
                                      {
                                          id: '1',
                                          name: i18n.global.t('meos_control_web.auto')
                                      }
                                  ],
                                  infoCodeType: IOT_RUNNING
                              }
                          ]
                        : []),
                    ...(runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.LOOP
                        ? [
                              {
                                  dataSources: [
                                      {
                                          id: '1',
                                          name: i18n.global.t('common.over_on')
                                      },
                                      {
                                          id: '2',
                                          name: i18n.global.t('common.drive_less')
                                      },
                                      {
                                          id: '3',
                                          name: i18n.global.t('meos_control_web.no_deviation')
                                      }
                                  ],
                                  value: [],
                                  name: i18n.global.t('meos_control_web.operation_deviation'),
                                  multiple: true,
                                  infoCode: 'controlDeviationStatus',
                                  options: [
                                      {
                                          id: '1',
                                          name: i18n.global.t('common.over_on')
                                      },
                                      {
                                          id: '2',
                                          name: i18n.global.t('common.drive_less')
                                      },
                                      {
                                          id: '3',
                                          name: i18n.global.t('meos_control_web.no_deviation')
                                      }
                                  ],
                                  infoCodeType: IOT_RUNNING
                              }
                          ]
                        : [])
                ]; // 筛选栏
                staticInputList.value = [
                    ...(runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.LOOP
                        ? [
                              {
                                  dataSources: Object.values(funcTypeOptions),
                                  value: '',
                                  name: i18n.global.t('meos_control_web.function_type'),
                                  infoCode: 'funcType',
                                  options: Object.values(funcTypeOptions),
                                  infoCodeType: 'BASIC'
                              },
                              {
                                  dataSources: Object.values(lampFuncTypeOptions),
                                  value: '',
                                  name: i18n.global.t('meos_control_web.luminaire_type'),
                                  infoCode: 'lampFuncType',
                                  options: Object.values(lampFuncTypeOptions),
                                  infoCodeType: 'BASIC'
                              }
                          ]
                        : [])
                ];
                init(currentItem);
            } else {
                isTableLoading.value = false;
            }
        },
        {
            deep: true
        }
    );

    watch(
        currentFloorObj,
        v => {
            if (runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.LOOP) {
                serviceSpaces.value.value = currentFloorObj?.value?.id;
                inSpaces.value.value = '';
            } else if (runningMonitorType === 'LIGHTING' && currentItem?.value?.classCode === LIGHTCLASSCODES.CONTROL) {
                inSpaces.value.value = currentFloorObj?.value?.id;
                serviceSpaces.value.value = '';
            }
            spaceMeta.value.value = v?.id;
        },
        {
            immediate: true
        }
    );

    watch(
        buildingSpaceTree,
        (v, old) => {
            spaceMeta.value.option = v;
            //为了解决级联组件 clear事件触发两次的问题
            if (v?.length > 0 && !old?.length) {
                nextTick(() => setFoldBtnStatus());
            }
        },
        {
            immediate: true
        }
    );

    watch(
        inSpaceTree,
        (v, old) => {
            inSpaceOptions.value = v;
            //为了解决级联组件 clear事件触发两次的问题
            if (v?.length > 0 && !old?.length) {
                nextTick(() => setFoldBtnStatus());
            }
        },
        {
            immediate: true
        }
    );
    watch(
        serveSpaceTree,
        (v, old) => {
            serveSpaceOptions.value = v;
            //为了解决级联组件 clear事件触发两次的问题
            if (v?.length > 0 && !old?.length) {
                nextTick(() => setFoldBtnStatus());
            }
        },
        {
            immediate: true
        }
    );

    watchEffect(() => {
        tableData.value = transformTableData(tableList?.value, InfoCodes?.value);
    });
    provide('init', init);
    provide('clearChecked', clearChecked);

    return {
        init,
        timeKey,
        inSpaces,
        serviceSpaces,
        keywordValue,
        btnList,
        pageFuc,
        pageMeta,
        serveSpaceOptions,
        inSpaceOptions,
        spaceMeta,
        tableData,
        tableHead,
        staticInputList,
        selectList,
        selectedList,
        headInfoCode,
        isCurrentItem,
        isTableLoading,
        placeholder,
        currentItem,
        isDynamicInfoCodeFilters,
        filterTable,
        checkedChange,
        LIGHTCLASSCODES,
        highlightKeyword
    };
};
