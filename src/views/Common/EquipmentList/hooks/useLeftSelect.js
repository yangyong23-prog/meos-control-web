// @ts-ignore
import i18n from '@/localization';
import { AIR_TERMINAL, SUCCESSCODE, TABLE_LIST } from '@/utils/globalVariables';
import { listTemplateTypes, queryTemplateTypes } from '@/apis/ACOperationControl';
import { debounce, isEmpty } from 'lodash';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import { isEdge } from '@/utils/envUtils';
import { CLOUD_IOT_DATA_CHANGE, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';
// import useResponsiveDockSSEHandle from '@/components/hooks/useResponsiveDockSSEHandle';

const codeMapClassCodes = {
    DOOR: ['CFCSDR', 'SPEGCR'], // 门禁
    BURGLARALARMDEVICE: ['SPIACU'], // 入侵报警设备
    CAMERA: ['SPVSCM'] // 监控设备
};

export const useLeftSelect = props => {
    const templateList = ref([]);
    const templateListTree = ref([]);
    const templateLoading = ref(false);
    const currentItem = ref({});
    const tableList = ref([]);
    let sseClient = inject('sseClient');
    const templateType = inject('templateType');

    const initTemplate = () => {
        templateLoading.value = true;
        templateList.value = [];
        templateListTree.value = [];
        //左侧模板
        let params = {
            templateCode: TABLE_LIST,
            templateType: TABLE_LIST,
            runningMonitorSecondType: templateType?.value,
            runningMonitorType: props.runningMonitorType
        };
        if (![AIR_TERMINAL, 'SECURITY', 'SEWAGE', 'LIGHTING', 'VENTILATION'].includes(props?.runningMonitorType)) {
            params.filterControlObject = true;
        }
        if (props.objectType) {
            params.objectType = props.objectType;
        }
        const fetchTemplateType = params => {
            if ([AIR_TERMINAL, 'LIGHTING', 'SEWAGE', 'LIGHTING'].includes(props?.runningMonitorType)) {
                return queryTemplateTypes(params);
            } else {
                return listTemplateTypes(params);
            }
        };
        fetchTemplateType(params)
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    templateList.value = (res.data?.length && res.data.filter(item => item.totalObjectCount && item.totalObjectCount > 0)) || [];
                    const classCodes = codeMapClassCodes[props.fromCode];
                    currentItem.value = templateList.value.find(item => classCodes?.includes(item.classCode)) || templateList?.value[0];

                    if (props.runningMonitorType === 'KITCHEN_RANGE_HOOD') {
                        templateListTree.value = formatterTreeData(templateList.value);
                        currentItem.value = templateListTree?.value[0].children[0];
                        console.log(currentItem.value);
                    }
                }
            })
            .finally(() => {
                templateLoading.value = false;
            });
    };

    const formatterTreeData = data => {
        const arr = [
            {
                equimeKey: 0,
                id: i18n.global.t('meos_control_web.kitchen_exhaust_fan'),
                name: i18n.global.t('meos_control_web.kitchen_exhaust_fan'),
                open: true,
                children: []
            },
            {
                equimeKey: 1,
                id: i18n.global.t('meos_control_web.make_up_air_unit'),
                name: i18n.global.t('meos_control_web.make_up_air_unit'),
                open: true,
                children: []
            },
            {
                equimeKey: 2,
                id: i18n.global.t('meos_control_web.oil_fume_purifier'),
                name: i18n.global.t('meos_control_web.oil_fume_purifier'),
                open: true,
                children: []
            }
        ];
        data.forEach(item => {
            item.id = item.templateTypeId;
            // item.name = item.templateTypeName;
            if (item.classCode === 'ACKLSF' && item?.infoCodeFilter?.fanPos === '1') {
                item.name = i18n.global.t('meos_control_web.kitchen_exhaust_fan');
                const target = arr.find(parent => parent.name === i18n.global.t('meos_control_web.kitchen_exhaust_fan'));
                if (target) target.children.push(item);
            } else if (item.classCode === 'ACKLSF' && item?.infoCodeFilter?.fanPos === '2') {
                item.name = i18n.global.t('meos_control_web.hood_exhaust_fan');
                const target = arr.find(parent => parent.name === i18n.global.t('meos_control_web.kitchen_exhaust_fan'));
                if (target) target.children.push(item);
            } else if (item.classCode === 'ACATFU') {
                const target = arr.find(parent => parent.name === i18n.global.t('meos_control_web.make_up_air_unit'));
                item.name = i18n.global.t('meos_control_web.fresh_air_handling_unit');
                if (target) target.children.push(item);
            } else if (item.classCode === 'ACVTSF') {
                const target = arr.find(parent => parent.name === i18n.global.t('meos_control_web.make_up_air_unit'));
                item.name = i18n.global.t('meos_control_web.ventilation_fan');
                if (target) target.children.push(item);
            } else if (item.classCode === 'ACKLAP') {
                const target = arr.find(parent => parent.name === i18n.global.t('meos_control_web.oil_fume_purifier'));
                item.name = i18n.global.t('meos_control_web.oil_fume_purifier');
                if (target) target.children.push(item);
            }
        });
        return arr.filter(parent => parent.children.length > 0);
    };
    const cloudEventChange = res => {
        res.data.forEach(data => {
            equipEvent({
                eventType: res.eventType,
                data: data
            });
        });
    };
    const equipEvent = res => {
        tableList.value.map(items => {
            if ((items.objectId && items.objectId === res.data.objectId) || (items.id && items.id === res.data.objectId)) {
                items?.relInfoCodeGroupConfigs?.map(item => {
                    if (item?.relInfoCodeConfigs) {
                        item?.relInfoCodeConfigs.map(io => {
                            if (res.eventType === IOT_DATA_CHANGE) {
                                if (io.infoCode === res.data.infoCode) {
                                    io.dataTime = res.data.dataTime || ''; //更新时间
                                    io.dataValue = res.data.dataValue;
                                } else if (io?.relInfoCodeConfig?.infoCode === res.data.infoCode) {
                                    io.dataTime = res.data.dataTime || ''; //更新时间
                                    io.relInfoCodeConfig.dataValue = res.data.dataValue;
                                }
                            }
                            if (res.eventType === CLOUD_IOT_DATA_CHANGE) {
                                if (io.infoCode === res.data.infoCode) {
                                    io.dataTime = res.data.dataTime || ''; //更新时间
                                    io.dataValue = res.data.dataValue;
                                } else if (io?.relInfoCodeConfig?.infoCode === res.data.infoCode) {
                                    io.dataTime = res.data.dataTime || ''; //更新时间
                                    io.relInfoCodeConfig.dataValue = res.data.dataValue;
                                }
                            }
                            if (res.eventType === RELEASE_INTERVENTION) {
                                if (io?.relInfoCodeConfig?.infoCode === res.data.infoCode) {
                                    io.relInfoCodeConfig.additionalMapValue = {};
                                    let additionalMapValue = {
                                        recoveryDateTime: res.data?.expireTime ? res.data?.expireTime : ''
                                    };
                                    io.relInfoCodeConfig.additionalMapValue = additionalMapValue;
                                    console.log(res.data, io?.relInfoCodeConfig, '0000');
                                }
                            }
                        });
                    }
                    item?.groupChildren?.map(group => {
                        group?.relInfoCodeConfigs?.map(io => {
                            if (res.eventType === IOT_DATA_CHANGE && io.infoCode === res.data.infoCode) {
                                io.dataTime = res.data.dataTime || ''; //更新时间
                                io.dataValue = res.data.dataValue;
                            }
                        });
                    });
                });
            } else {
                if (res.eventType === IOT_DATA_CHANGE || res.eventType === CLOUD_IOT_DATA_CHANGE) {
                    const basicInfo = items?.relInfoCodeGroupConfigs?.find(g => g.groupCode === 'basicInfo');
                    const serviceACZone = basicInfo?.relInfoCodeConfigs?.find(info => info.infoCode === 'serviceACZone');
                    const airZoneInfoCodes = serviceACZone?.dataValue?.find(obj => obj.id === res.data.objectId)?.relInfoCodeGroupConfigs?.find(() => true)?.relInfoCodeConfigs;
                    airZoneInfoCodes?.forEach(info => {
                        if (info.infoCode === res.data.infoCode) {
                            info.dataTime = res.data.dataTime || ''; //更新时间
                            info.dataValue = res.data.dataValue;
                        } else if (info?.relInfoCodeConfig?.infoCode === res.data.infoCode) {
                            info.dataTime = res.data.dataTime || ''; //更新时间
                            info.relInfoCodeConfig.dataValue = res.data.dataValue;
                        }
                    });
                }
            }
        });
    };
    if (props.isSubscriptOnDemand) {
        const genClassCodeMapIds = () => {
            const pageData = toRaw(tableList.value);
            const r = {};
            pageData?.forEach(obj => {
                const classCode = obj.classCode?.toUpperCase();
                if (classCode) {
                    if (!r[classCode]) {
                        r[classCode] = [];
                    }
                    r[classCode].push(obj.id);
                }
            });
            return r;
        };
        const { sseClient: _sseClient, setSSEClientOption } = useSinglePOSTSSEClient(props.runningMonitorType === 'LIGHTING' ? 'LIGHT_MONITORING' : props.runningMonitorType);
        // 使用按需订阅的sseClient代替注入的
        sseClient = _sseClient;
        const eventType = [isEdge() ? IOT_DATA_CHANGE : CLOUD_IOT_DATA_CHANGE, RELEASE_INTERVENTION];
        // // 使用响应性Dock存储sse推送回来的数据
        // useResponsiveDockSSEHandle(_sseClient, eventTypes);
        const connectSSEDebounce = debounce(() => {
            const classCodeMapIds = genClassCodeMapIds();
            if (classCodeMapIds && !isEmpty(classCodeMapIds)) {
                const data = {
                    claasCode2objectIds: classCodeMapIds,
                    eventType
                };
                if (!isEdge()) {
                    data.eventParamMap = {
                        CLOUD_IOT_DATA_CHANGE: {
                            templateType: TABLE_LIST
                        }
                    };
                }
                setSSEClientOption(data);
            }
        }, 200);
        watch(tableList, () => {
            connectSSEDebounce();
        });
    }

    onMounted(() => {
        initTemplate();
        if (isEdge()) {
            sseClient?.addEventListener(IOT_DATA_CHANGE, equipEvent);
        } else {
            sseClient?.addEventListener(CLOUD_IOT_DATA_CHANGE, cloudEventChange);
        }
        sseClient?.addEventListener(RELEASE_INTERVENTION, equipEvent);
    });
    onBeforeUnmount(() => {
        if (isEdge()) {
            sseClient?.removeEventListener(IOT_DATA_CHANGE, equipEvent);
        } else {
            sseClient?.removeEventListener(CLOUD_IOT_DATA_CHANGE, cloudEventChange);
        }
        sseClient?.removeEventListener(RELEASE_INTERVENTION, equipEvent);
    });
    provide('templateLoading', templateLoading);
    provide('initTemplate', initTemplate);
    provide('templateList', templateList);
    provide('currentItem', currentItem);
    provide('tableList', tableList);
    return {
        templateList,
        templateListTree,
        templateLoading
    };
};
