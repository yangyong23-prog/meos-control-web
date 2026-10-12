// @ts-ignore
import i18n from '@/localization';
import { IOT_RUNNING, IOT_SETTING, MODEL_VIEW } from '@/utils/globalVariables';
import { EQUIPMENT_BUSINESS, IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
//针对地图模版(MODEL_VIEW)sse更新处理配置模版，类似listInfoCodeConfigsByObjectFilters接口返回的数据，对象数组
// 固定监听IOT_DATA_CHANGE 、EQUIPMENT_BUSINESS两类推送；
/**
  sseClient sse客户端对象 - 必传
  targetRef：接口返回的对象数组的ref - 必传
  refreshFn：推送有针对  targetRef更新的时候，触发执行的回调函数，针对地图上无响应性情况，在回调里执行地图图元更新逻辑
 */
export default (sseClient, targetRef, refreshFn) => {
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
        let hasChanged = false;
        Object.keys(iotCache).forEach(equipId => {
            targetRef.value?.forEach(obj => {
                if (obj.id && obj.id === equipId) {
                    const srcMap = iotCache[equipId];

                    if (srcMap) {
                        Object.values(srcMap).forEach(srcData => {
                            // 针对equipStatus更新
                            obj.relInfoCodeGroupConfigs.forEach(dest => {
                                findUpdateTreeObj(dest, srcData, ['infoCode'], true);
                                hasChanged = true;
                            });
                        });
                    }
                }
            });
        });
        if (hasChanged && refreshFn) {
            refreshFn();
        }
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

    const findUpdateTreeObj = (node, srcObj, cmpFields = ['infoCodeType'], isIot = false) => {
        // const infoCodeType = srcObj[cmpField];
        if (node?.groupChildren?.length > 0) {
            node.groupChildren.forEach(c => {
                findUpdateTreeObj(c, srcObj, cmpFields, isIot);
            });
        } else {
            node?.relInfoCodeConfigs?.forEach(obj => {
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
            });
            // console.log(node, srcObj, 'node');
        }
    };

    const dealEquipBusinessEvent = res => {
        res.data.forEach(da => {
            if (da.templateType === MODEL_VIEW) {
                let hasChanged = false;
                targetRef.value?.forEach(obj => {
                    const sourceArr = da.objectConfigs[obj.id];
                    sourceArr?.forEach(sourceObj => {
                        if (sourceObj) {
                            obj.relInfoCodeGroupConfigs.forEach(it => {
                                findUpdateTreeObj(it, sourceObj, ['infoCodeType', 'infoCode']);
                            });

                            hasChanged = true;
                        }
                    });
                });
                if (hasChanged && refreshFn) {
                    refreshFn();
                }
            }
        });
    };

    const dealEquipIOTChangeEvent = res => {
        _addCache(res.data);
        if (Date.now() - lastTime > timerDuration + 10) {
            clearTimeout(_cacheTimer);
            _cacheTimer = setTimeout(() => {
                _dealIotUpdate();
            }, timerDuration);
            lastTime = Date.now();
        }
    };

    onMounted(() => {
        sseClient?.addEventListener(EQUIPMENT_BUSINESS, dealEquipBusinessEvent);
        sseClient?.addEventListener(IOT_DATA_CHANGE, dealEquipIOTChangeEvent);
    });

    onBeforeUnmount(() => {
        sseClient?.removeEventListener(EQUIPMENT_BUSINESS, dealEquipBusinessEvent);
        sseClient?.removeEventListener(IOT_DATA_CHANGE, dealEquipIOTChangeEvent);
    });

    return {};
};
