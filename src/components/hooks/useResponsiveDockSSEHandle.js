// @ts-ignore

import DockSingleton from '@/hooks/responsiveDock';
import { DANGER_EVENT_MONITORING_SITUATION, INFO_EXTEND, INFO_EXTEND_SET } from '@/utils/SSEEventTypes';
import { isValueIotInfoType } from '@/utils/infoTemplate';
import baseStore from '@/store/baseStore';
import { isNil, isEmpty } from 'lodash';
import { storeIotInfoPointLog } from '@/utils/iotInfoPointLog';

const logRcRunStatus = valObj => {
    if (valObj && !isEmpty(valObj)) {
        storeIotInfoPointLog({
            ...valObj
        });
    }
};
// 使用全局响应性Dock的sse响应处理
export default (sseClient, eventTypes = [], refreshCallback) => {
    const { getIotData, setIotData, setAbnormalEvent, setInfoExtend, setCustomInfo, setObjectDanegerEvent, getInfoExtend } = DockSingleton.getInstance();

    // ========== SSE 批量合并逻辑 ==========
    const IOT_BATCH_INTERVAL = 300; // 300ms 合并窗口
    let iotBatchMap = new Map(), // key: `${objectId}::${infoCode}`, value: data
        iotBatchTimer = null;

    const flushIotBatch = () => {
        if (iotBatchMap.size === 0) return;
        // const { setIotData } = DockSingleton.getInstance();
        iotBatchMap.forEach((data, key) => {
            const [objectId, infoCode] = key.split('::');
            setIotData(objectId, infoCode, data);
            if (refreshCallback) refreshCallback({ objectId, data });
        });
        iotBatchMap.clear();
    };

    const scheduleIotFlush = () => {
        if (iotBatchTimer) return;
        iotBatchTimer = setTimeout(() => {
            flushIotBatch();
            iotBatchTimer = null;
        }, IOT_BATCH_INTERVAL);
    };

    const iotHandle = res => {
        if (!res?.data) return;
        // 合并到 batchMap，相同 key 只保留最新值
        const { objectId, infoCode } = res.data;
        const key = `${objectId}::${infoCode}`;
        iotBatchMap.set(key, res.data);
        scheduleIotFlush();

        if (res.data.infoCode === 'rcRunStatus') {
            logRcRunStatus(res.data);
        }
    };

    const cloudIotHandle = res => {
        if (!res?.data) return;
        res.data.forEach(item => {
            const key = `${item.objectId}::${item.infoCode}`;
            iotBatchMap.set(key, item);
        });
        scheduleIotFlush();
    };

    // 干预时间
    const releaseInterventionEventHandle = res => {
        try {
            const d = res.data;
            const equipId = d?.objectId;
            if (d && equipId) {
                const additionalMapValue = {
                    recoveryDateTime: d.expireTime ? d.expireTime : ''
                };
                const preData = getIotData(res.data.objectId, d.infoCode) || {};
                setIotData(res.data.objectId, d.infoCode, { ...preData, infoCode: d.infoCode, additionalMapValue });
                if (refreshCallback) refreshCallback({ objectId: res.data.objectId, data: { infoCode: d.infoCode, additionalMapValue } });
            }
        } catch (e) {
            console.log('releaseInterventionEventHandle: 推送数据解析失败', e);
        }
    };
    // 异常事件
    const anomalousEventHandle = res => {
        try {
            const d = res?.data;
            if (d && Array.isArray(d)) {
                d.forEach(obj => {
                    setAbnormalEvent(obj);
                    if (refreshCallback) refreshCallback({ objectId: obj.id, data: obj });
                });
            }
        } catch (e) {
            console.log('anomalousEventHandle: 推送数据解析失败', e);
        }
    };
    // 自定义信息点
    const customConfigEventHandle = res => {
        try {
            const d = res?.data;
            if (d && Array.isArray(d)) {
                d.forEach(({ templateType, objectConfigs }) => {
                    Object.keys(objectConfigs).forEach(objectId => {
                        objectConfigs[objectId].forEach(info => {
                            // 判断是否为值为iot数组类型
                            if (isValueIotInfoType(info.infoCodeType)) {
                                console.log('info.dataValue: ', info.dataValue);
                                if (Array.isArray(info.dataValue)) {
                                    info.dataValue.forEach(item => setIotData(objectId, item.infoCode, item));
                                }
                            } else {
                                setCustomInfo(objectId, info, info.infoCodeType, info.infoCode);
                            }
                            if (refreshCallback) refreshCallback({ objectId, data: info });
                        });
                    });
                });
            }
        } catch (e) {
            console.log('customConfigEventHandle: 推送数据解析失败', e);
        }
    };

    //风险事件
    const dangerEventHandle = res => {
        try {
            const d = res?.data;
            if (d && Array.isArray(d)) {
                d.forEach(obj => {
                    setObjectDanegerEvent(obj);
                    if (refreshCallback) refreshCallback({ objectId: obj.objectId, data: obj });
                });
            }
        } catch (e) {
            console.log('dangerEventHandle: 推送数据解析失败', e);
        }
    };

    // 风险事件的风险点监测状态
    const dangerEventMonitoringSituationHandle = res => {
        try {
            const d = res?.data;
            if (d && Array.isArray(d)) {
                d.forEach(info => {
                    const curId = info?.instanceTreeId;
                    if (curId) {
                        setCustomInfo(curId, info, DANGER_EVENT_MONITORING_SITUATION);
                        if (refreshCallback) refreshCallback({ objectId: curId, data: info });
                    }
                });
            }
        } catch (e) {
            console.log('dangerEventMonitoringSituationHandle: 推送数据解析失败', e);
        }
    };

    const infoExtendSetHandle = res => {
        try {
            if (res?.data) {
                const data = res.data.extendSetting;
                data.consoleTypes && setCustomInfo(data.objectId, data, data.consoleTypes, data.infoCode);
                const obj = structuredClone(getIotData(data.objectId, data.infoCode));
                obj.dataValue = data.dataValue ?? data.indoCodeValue;
                if (data.expand) {
                    const expand = { ...data, infoCode: data.expand };
                    setInfoExtend(expand.objectId, expand, expand.infoCode, INFO_EXTEND);
                }
                const aaa = getInfoExtend(data.objectId, data.infoCode, INFO_EXTEND);
                if (aaa.parentClassCode) {
                    setInfoExtend(data.objectId, data, aaa.parentClassCode, INFO_EXTEND);
                }
                if (!isNil(obj.dataValue)) {
                    setIotData(data.objectId, data.infoCode, obj);
                } else {
                    setInfoExtend(data.objectId, data, data.infoCode, INFO_EXTEND);
                }
                if (refreshCallback) refreshCallback({ objectId: res.data.objectId, data: res.data, type: INFO_EXTEND_SET });
            }
        } catch (e) {
            console.log('infoExtendSetHandle: 推送数据解析失败', e);
        }
    };
    const illumInfoHandle = res => {
        try {
            if (res?.data) {
                setIotData(baseStore().projectId, 'outdoorIlluminance', {
                    infoCode: 'outdoorIlluminance',
                    dataValue: res.data?.outdoorIlluminance,
                    id: baseStore().projectId,
                    unit: res.data?.unit
                });
                res?.data?.lightingSidebarSensorInfoVO?.forEach?.(item => {
                    const obj = {
                        ...item,
                        infoCode: item.infoCode || 'illum',
                        dataValue: item.illum,
                        id: item.instanceId,
                        localName: item.instanceName
                    };
                    setIotData(obj.id, obj.infoCode, obj);
                });
            }
        } catch (e) {
            console.log('illumInfoHandle: 推送数据解析失败', e);
        }
    };
    window.infoExtendSetHandle = infoExtendSetHandle;
    window.iotHandle = iotHandle;
    window.getIotData = getIotData;
    window.dangerEventHandle = dangerEventHandle;
    const eventTypeMapHandle = {
        IOT_DATA_CHANGE: iotHandle,
        CLOUD_IOT_DATA_CHANGE: cloudIotHandle,
        ABNORMAL_EVENT: anomalousEventHandle,
        RELEASE_INTERVENTION: releaseInterventionEventHandle,
        INFO_CODE_CONFIG_EVENT: customConfigEventHandle,
        DANGER_EVENT: dangerEventHandle,
        DANGER_EVENT_MONITORING_SITUATION: dangerEventMonitoringSituationHandle,
        ILLUM_INFO: illumInfoHandle,
        INFO_EXTEND_SET: infoExtendSetHandle
    };

    onMounted(() => {
        eventTypes.forEach(type => {
            const _handle = eventTypeMapHandle[type];
            if (_handle) {
                sseClient?.addEventListener(type, _handle);
            }
        });
    });

    onBeforeUnmount(() => {
        // 清理 pending 的 iot 批量定时器，并刷完剩余数据
        if (iotBatchTimer) {
            clearTimeout(iotBatchTimer);
            iotBatchTimer = null;
        }
        flushIotBatch();

        eventTypes.forEach(type => {
            const _handle = eventTypeMapHandle[type];
            if (_handle) {
                sseClient?.removeEventListener(type, _handle);
            }
        });
    });
};
