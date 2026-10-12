import i18n from '@/localization';
/*
此hook用于加载动态数据，并放入响应池子
1.iot数据加载处理
*/
import DockSingleton from '@/hooks/responsiveDock';
import BdtpInfoSingleton from '@/hooks/responsiveBdtpInfo';
import { listInfoCodeConfigsByObjectCommon, listDangerEventsByDangerObject, batchQueryInfoCode } from '@/apis/public';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { isRiskEventInfoType, isIotInfoType, isValueIotInfoType } from '@/utils/infoTemplate';
import { listInfoCodes } from '@/apis/common';
import { DANGER_EVENT_MONITORING_SITUATION } from '@/utils/SSEEventTypes';
import iotExpireManager from '@/utils/iotExpireManager';
// 转换为点语法获取分组
function convertToDotNotation(obj) {
    function process(currentObj) {
        if (currentObj.relInfoCodeGroupConfigs) {
            currentObj.relInfoCodeGroupConfigs?.forEach(group => {
                currentObj[group.groupCode] = group;
                process(group);
            });
        } else if (currentObj.groupChildren) {
            currentObj.groupChildren?.forEach(group => {
                currentObj[group.groupCode] = group;
                process(group);
            });
        }
    }
    process(obj);
}

export default () => {
    const { setIotData, setCustomInfo, setAbnormalEvent, setObjectDanegerEvent, getAllObjectInfo } = DockSingleton.getInstance();
    const { setBdtpInfoData } = BdtpInfoSingleton.getInstance();

    const _deepHandleInfoCodeConfig = (configGroup, obj) => {
        configGroup.relInfoCodeConfigs?.forEach?.(info => {
            if (isIotInfoType(info.infoCodeType)) {
                setIotData(obj.id, info.infoCode, info);
                if (info.relInfoCodeConfig) {
                    //兼容信息点下嵌套单个信息点  单个信息点为relInfoCodeConfig组装成多信息点数组relInfoCodeConfigs
                    _deepHandleInfoCodeConfig({ relInfoCodeConfigs: [info.relInfoCodeConfig] }, obj);
                }
                if (info.relInfoCodeConfigs) {
                    //兼容信息点下嵌套多个信息点
                    _deepHandleInfoCodeConfig(info, obj);
                }
            } else if (isRiskEventInfoType(info?.infoCodeType)) {
                //
                if (info.dataValue) {
                    if (Array.isArray(info.dataValue)) {
                        // 对于异常事件详情的，放入池子
                        info.dataValue.forEach(riskObj => {
                            setAbnormalEvent(riskObj);
                        });
                    }
                }
            } else {
                // 自定义信息点
                setCustomInfo(obj.id, info, info.infoCodeType, info.infoCode);

                // 对于信息点值是对象数组的(如关联设备)，再深度遍历
                if (Array.isArray(info.dataValue) && info.dataValue?.some(it => it.relInfoCodeGroupConfigs?.length > 0)) {
                    info.dataValue.forEach(relObj => {
                        relObj?.relInfoCodeGroupConfigs?.forEach(rCfg => {
                            _deepHandleInfoCodeConfig(rCfg, relObj);
                        });
                    });
                } else if (Array.isArray(info.dataValue)) {
                    if (isValueIotInfoType(info.infoCodeType)) {
                        info.dataValue.forEach(iotObj => {
                            setIotData(obj.id, iotObj.infoCode, iotObj);
                        });
                    }
                }
            }
        });
        configGroup?.groupChildren?.forEach(childrenConfig => {
            _deepHandleInfoCodeConfig(childrenConfig, obj);
        });
    };

    const _makeInfoCodeMapData = originData => {
        originData?.forEach(obj => {
            obj.relInfoCodeGroupConfigs?.forEach(group => {
                _deepHandleInfoCodeConfig(group, obj);
            });
            convertToDotNotation(obj);
            idDynaData.value[obj.id] = obj;
        });
    };

    // 将查询的根据信息点模版配置的数据，写入响应式池子
    const writeDataToResponsiveDock = originData => {
        _makeInfoCodeMapData(originData);
    };

    const idDynaData = ref({});
    const initDangerEventIds = ref([]);

    const loadDynaDataWithIotHandling = async (parames, customRequestFn, signal, config) => {
        if (parames?.objectIds?.length > 0) {
            const res = await (customRequestFn || listInfoCodeConfigsByObjectCommon)(parames, signal, config);

            if (res?.code === SUCCESSCODE) {
                try {
                    _makeInfoCodeMapData(res.data);
                } catch (error) {
                    console.log(error);
                }
                // console.log(getAllObjectInfo());
            }
            return res;
        } else {
            return {
                code: SUCCESSCODE,
                data: []
            };
        }
    };
    const loadDynaTableListDataWithIotHandling = async (parames, customRequestFn, signal, config) => {
        if (parames?.runningMonitorType) {
            const res = await (customRequestFn || listInfoCodeConfigsByObjectCommon)(parames, signal, config);
            if (res?.code === SUCCESSCODE) {
                try {
                    _makeInfoCodeMapData(res.data);
                } catch (error) {
                    console.log(error);
                }
                console.log(getAllObjectInfo());
            }
            return res;
        } else {
            return {
                code: SUCCESSCODE,
                data: []
            };
        }
    };
    const loadBatchQueryInfoCodeIotHandling = async (parames, customRequestFn, signal) => {
        if (parames?.object?.length) {
            // parames.object.forEach(object => {
            //     object.infoCodes.forEach(infoCode => {
            //         setIotData(object.objectId, infoCode, { infoCode, dataValue: undefined, objectId: object.objectId });
            //     });
            // });
            const res = await (customRequestFn || batchQueryInfoCode)(parames, signal);
            console.log(res, 'res');
            if (res?.code === SUCCESSCODE) {
                try {
                    res.data.forEach(object => {
                        setIotData(object.objectId, object.infoCode, object);
                        try {
                            if (object.infoCode === 'rcRunStatus') {
                                iotExpireManager?.addIot(object, 'API');
                            }
                        } catch (error) {
                            console.log('iotExpireManager add:', error);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }
            return res;
        } else {
            return {
                code: SUCCESSCODE,
                data: []
            };
        }
    };
    //风险事件
    const loadDangerEventsListWithHandling = async (parames, customRequestFn, signal) => {
        if (parames?.objectIds?.length > 0) {
            if (import.meta.env.VITE_DEV_MODE && sessionStorage.getItem('isApifoxMock')) {
                parames.objectIds = parames.objectIds.slice(0, sessionStorage.getItem('isApifoxMock') * 1);
            }
            const res = await (customRequestFn || listDangerEventsByDangerObject)(parames, signal);
            if (res?.code === SUCCESSCODE) {
                const allEventIdsSet = new Set();
                res.data?.forEach(dangerEvent => {
                    if (dangerEvent?.dangerEventId) {
                        allEventIdsSet.add(dangerEvent.dangerEventId);
                        const initInfo = {
                            instanceTreeId: dangerEvent.dangerEventId,
                            oldMonitoringSituations: [],
                            newMonitoringSituations: dangerEvent.monitoringSituations
                        };
                        setCustomInfo(dangerEvent.dangerEventId, initInfo, DANGER_EVENT_MONITORING_SITUATION);
                    }
                    setObjectDanegerEvent(dangerEvent);
                });
                initDangerEventIds.value = [...allEventIdsSet];
            }
            return res;
        } else {
            return {
                code: SUCCESSCODE,
                data: []
            };
        }
    };
    const loadBdtpDataHandling = async ({ classCodes = [] }) => {
        if (classCodes.length) {
            const res = await listInfoCodes({ classCodes });
            if (res.code === SUCCESSCODE) {
                res.data?.forEach(bdtp => {
                    setBdtpInfoData(bdtp.classCode, bdtp.code, bdtp);
                });
            }
            return res;
        } else {
            return {
                code: SUCCESSCODE,
                data: []
            };
        }
    };

    return {
        loadDynaDataWithIotHandling,
        idDynaData,
        writeDataToResponsiveDock,
        loadDangerEventsListWithHandling,
        loadBatchQueryInfoCodeIotHandling,
        loadDynaTableListDataWithIotHandling,
        loadBdtpDataHandling,
        initDangerEventIds
    };
};
