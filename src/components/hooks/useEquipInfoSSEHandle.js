//配置模版， 单个对象sse监听处理hook，针对类relInfoCodeGroupConfigs结构数据
// 固定监听IOT_DATA_CHANGE 、EQUIPMENT_BUSINESS两类推送；选择性监听RELEASE_INTERVENTION(解除干预)类型

import { isArray } from 'lodash';
import { IOT_RUNNING, IOT_SETTING } from '@/utils/globalVariables';
import { CLOUD_IOT_DATA_CHANGE, EQUIPMENT_BUSINESS, INFO_CODE_CONFIG_EVENT, IOT_DATA_CHANGE, RELEASE_INTERVENTION } from '@/utils/SSEEventTypes';

/**
 * targetIdRef： 监听的空间/设备ID的引用（一般用ref）
 * targetDataRefMap：目标数据的ref 映射，如：
 * {
        equipStatus: equipStatus, //value 是一个group对象，key随意
        equipParameterSet: equipParameterSet
    }
    或
    {
        relInfoCodeGroupConfigs, // value是group数组，key随意，若group中包含自定义信息点与iot信息点也支持

        RISK_EVENT_DETAIL: exceptionEventInfoList, //value 是一个信息点对象的dataValue，如果针对自定义信息点，key要是infoCodeType
        ROUTING_INSPECTION: taskInfo
    },
    或
 */
export default (targetIdRef, targetDataRefMap, useEeleaseIntervention = false, templateType, sseClient) => {
    const _sseClient = sseClient || inject('sseClient');
    // 自定义信息点
    const CUSTOM_INFO_TYPE = {
        BASIC: true,
        RWD_OBJECT: true,
        RWD_OBJECT_DETAIL: true,
        RISK_EVENT: true,
        RISK_EVENT_DETAIL: true,
        ROUTING_INSPECTION: true,
        DEMAND_TARGET: true,
        DEMAND_TARGET_STATISTIC: true,
        DEMAND_TARGET_RESULT: true,
        DEMAND_TARGET_TYPE: true,
        IOT_STATISTIC: true,
        SPACE_ACCESS_DEMAND_STATUS: true,
        PERSISTENCE_TREND_RUNNING: true,
        PERSISTENCE_RUNNING: true,
        IOT_PERSISTENCE: true,
        IOT_PERSISTENCE_TREND: true
    };

    const IOT_CODE_TYPE = {
        [IOT_SETTING]: true,
        [IOT_RUNNING]: true
    };

    const timerDuration = 1000;
    let iotCache = {},
        _cacheTimer = null,
        lastTime = 0;

    const _handleIotUpdate = () => {
        // console.log('iotCache: ', iotCache);
        Object.keys(iotCache).forEach(equipId => {
            if (targetIdRef.value && equipId === targetIdRef.value) {
                const srcMap = iotCache[equipId];

                if (srcMap) {
                    Object.values(srcMap).forEach(srcData => {
                        Object.values(targetDataRefMap).forEach(r => {
                            if (Array.isArray(r.value)) {
                                // console.log('infoObj: ', r.value, srcData);
                                r.value?.forEach(infoObj => {
                                    findUpdateTreeObj(infoObj, srcData, ['infoCode'], true);
                                });
                            } else {
                                findUpdateTreeObj(r.value, srcData, ['infoCode'], true);
                            }
                        });
                    });
                }
                // });
            }
        });
    };
    const _dealIotUpdate = () => {
        _handleIotUpdate();
        iotCache = {};
    };
    const _addCache = obj => {
        if (!iotCache[obj.objectId]) {
            iotCache[obj.objectId] = {};
        }
        const eqObjMap = iotCache[obj.objectId];

        eqObjMap[obj.infoCode] = obj;
    };

    const _findUpdateTreeObjInnerFunc = (obj, srcObj, cmpFields, isIot) => {
        let isEqual = true;
        // 如果是iot，判断信息点类型不属于自定义信息点
        if (isIot) {
            isEqual = IOT_CODE_TYPE[obj.infoCodeType];
        } else {
            isEqual = CUSTOM_INFO_TYPE[obj.infoCodeType];
        }
        cmpFields.forEach(k => {
            isEqual = isEqual && srcObj[k] === obj[k];
        });
        if (isEqual) {
            obj.dataValue = srcObj.dataValue;
            obj.dataTime = srcObj.dataTime;
        }
    };

    const findUpdateTreeObj = (node, srcObj, cmpFields = ['infoCodeType'], isIot = false) => {
        if (!node) {
            return;
        }
        // const infoCodeType = srcObj[cmpField];
        if (node?.groupChildren?.length > 0) {
            node.groupChildren.forEach(c => {
                findUpdateTreeObj(c, srcObj, cmpFields, isIot);
            });
        }
        node?.relInfoCodeConfigs?.forEach(obj => {
            _findUpdateTreeObjInnerFunc(obj, srcObj, cmpFields, isIot);
            if (obj.relInfoCodeConfig) {
                findUpdateTreeObj(obj, srcObj, cmpFields, isIot);
            }
        });
        const { relInfoCodeConfig } = node;
        if (relInfoCodeConfig) {
            _findUpdateTreeObjInnerFunc(relInfoCodeConfig, srcObj, cmpFields, isIot);
            if (relInfoCodeConfig.relInfoCodeConfig) {
                findUpdateTreeObj(relInfoCodeConfig, srcObj, cmpFields, isIot);
            }
        }
    };

    const dealEquipBusinessEvent = res => {
        if (targetIdRef.value) {
            res.data?.forEach(obj => {
                if (obj.templateType === templateType) {
                    const srcData = obj.objectConfigs[targetIdRef.value];
                    // if (srcData) {
                    //     console.log('srcData: ', srcData);
                    // }
                    srcData?.forEach(cfgItem => {
                        const { infoCodeType, infoCode } = cfgItem;
                        if (CUSTOM_INFO_TYPE[infoCodeType]) {
                            Object.keys(targetDataRefMap).forEach(key => {
                                const targetRef = targetDataRefMap[key];
                                if (targetRef) {
                                    // 一般是指异常事件、巡检信息这类自定义信息点targetRef.value对应的dataValue
                                    if (key === infoCodeType) {
                                        if (targetRef?.filterInfoCode && infoCode) {
                                            if (targetRef?.filterInfoCode(infoCode) && targetRef.dataValue) {
                                                targetRef.dataValue.value = cfgItem.dataValue;
                                            } else {
                                                return;
                                            }
                                        }
                                        targetRef.value = cfgItem.dataValue;
                                    } else if (Array.isArray(targetRef.value)) {
                                        targetRef.value.forEach(item => {
                                            findUpdateTreeObj(item, cfgItem, ['infoCodeType', 'infoCode']);
                                        });
                                    } else {
                                        findUpdateTreeObj(targetRef.value, cfgItem, ['infoCodeType', 'infoCode']);
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    };
    const dealEquipIOTChangeEvent = res => {
        if (isArray(res.data)) {
            res.data.forEach(item => {
                _addCache(item);
            });
        } else {
            _addCache(res.data);
        }
        if (Date.now() - lastTime > timerDuration + 10) {
            clearTimeout(_cacheTimer);
            _cacheTimer = setTimeout(() => {
                _dealIotUpdate();
            }, timerDuration);
            lastTime = Date.now();
        }
    };
    const dealEeleaseIntervention = res => {
        const equipId = res.data?.objectId;
        if (targetIdRef.value && equipId === targetIdRef.value && targetDataRefMap.equipParameterSet) {
            const r = targetDataRefMap.equipParameterSet;
            const srcData = res.data;
            r.value?.relInfoCodeConfigs?.forEach(obj => {
                if (obj.infoCode === srcData.infoCode) {
                    const additionalMapValue = {
                        recoveryDateTime: srcData.expireTime ? srcData.expireTime : ''
                    };
                    obj.additionalMapValue = additionalMapValue;
                }
            });
        }
    };

    onMounted(() => {
        if (useEeleaseIntervention) {
            _sseClient?.addEventListener(RELEASE_INTERVENTION, dealEeleaseIntervention);
        }
        _sseClient?.addEventListener(EQUIPMENT_BUSINESS, dealEquipBusinessEvent);
        _sseClient?.addEventListener(INFO_CODE_CONFIG_EVENT, dealEquipBusinessEvent);
        _sseClient?.addEventListener(IOT_DATA_CHANGE, dealEquipIOTChangeEvent);
        _sseClient?.addEventListener(CLOUD_IOT_DATA_CHANGE, dealEquipIOTChangeEvent);
    });

    onBeforeUnmount(() => {
        if (useEeleaseIntervention) {
            _sseClient?.removeEventListener(RELEASE_INTERVENTION, dealEeleaseIntervention);
        }
        _sseClient?.removeEventListener(EQUIPMENT_BUSINESS, dealEquipBusinessEvent);
        _sseClient?.removeEventListener(IOT_DATA_CHANGE, dealEquipIOTChangeEvent);
        _sseClient?.removeEventListener(INFO_CODE_CONFIG_EVENT, dealEquipBusinessEvent);
        _sseClient?.removeEventListener(CLOUD_IOT_DATA_CHANGE, dealEquipIOTChangeEvent);
    });

    return {};
};
