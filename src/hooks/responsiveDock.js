import { toNumber } from 'lodash';
import i18n from '@/localization';
import { DANEGER_STATUS } from '@/utils/globalVariables';
const baseTypeMap = {
    string: '',
    object: {},
    array: []
};
const getType = value => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
const checkOwnProperty = (obj, key) => {
    if (!Object.hasOwn) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    } else {
        return Object.hasOwn(obj, key);
    }
};

const withDefaultEmpty = (preData, newData) => {
    if (!preData && !newData) return {};
    if (!preData) return newData || {};
    if (!newData) return preData;

    try {
        // 核心：原地合并，只遍历 newData 的 key，不遍历 preData
        // 复杂度从 O(N) 降到 O(K)，K = newData 的属性数
        Object.assign(preData, newData);

        // newData 已显式提供 dataValue，以其为准
        if (checkOwnProperty(newData, 'dataValue')) return preData;

        // 处理 dataValue 默认值逻辑
        const { dataValue } = preData;
        if (dataValue != null && dataValue !== '') {
            const dataValueType = getType(dataValue);
            preData.dataValue = baseTypeMap[dataValueType] ?? null;
        }

        return preData;
    } catch (error) {
        console.log('withDefaultEmpty: 推送数据解析失败', error);
        return preData;
    }
};

const responsiveDock = () => {
    // IOT
    const setIotData = (objectId, infoCode, data) => {
        const objectInfo = _getObjectInfo(objectId);
        const infoCodeObj = objectInfo[infoCode] || {};
        const withDefaultEmptyData = withDefaultEmpty(infoCodeObj, data);
        // 兼容 dataSource -> dataSources
        if (withDefaultEmptyData?.dataSource && !withDefaultEmptyData.dataSources) {
            withDefaultEmptyData.dataSources = structuredClone(withDefaultEmptyData.dataSource);
        }

        if (!objectInfo[infoCode]) {
            objectInfo[infoCode] = withDefaultEmptyData;
            return;
        }

        const newDataValue = withDefaultEmptyData.dataValue;
        const oldDataValue = infoCodeObj.dataValue;
        if (oldDataValue === newDataValue) {
            Object.keys(withDefaultEmptyData).forEach(key => {
                if (key === 'dataValue') return;
                const newValue = withDefaultEmptyData[key];
                if (infoCodeObj[key] !== newValue) {
                    infoCodeObj[key] = newValue;
                }
            });
            return;
        }

        objectInfo[infoCode] = withDefaultEmptyData;
    };
    const getIotData = (objectId, infoCode) => {
        if (infoCode) {
            return _getObjectInfo(objectId)[infoCode] || {};
        }
        return _getObjectInfo(objectId) || {};
    };
    const setInfoExtend = (objectId, data, ...keys) => {
        if (!objectId || !data || !keys?.length) {
            return;
        }
        const key = keys.join('_');
        const infoObj = _getObjectInfo(objectId)[key] || {};
        _getObjectInfo(objectId)[key] = { ...infoObj, ...data };
    };
    const getInfoExtend = (objectId, ...keys) => {
        if (!keys?.length) {
            return;
        }
        const key = keys.join('_');
        return _getObjectInfo(objectId)[key] || {};
    };
    // 如自定义信息点使用，setCustomInfo(equipId,info,info.infoCodeType,info.infoCode)
    const setCustomInfo = (objectId, data, ...keys) => {
        if (!objectId || !data || !keys?.length) {
            return;
        }
        const key = keys.join('_');
        const infoObj = _getObjectInfo(objectId)[key] || {};
        const withDefaultEmptyData = withDefaultEmpty(infoObj, data);
        _getObjectInfo(objectId)[key] = withDefaultEmptyData;
    };

    const getCustomInfo = (objectId, ...keys) => {
        if (!keys?.length) {
            return;
        }
        const key = keys.join('_');
        return _getObjectInfo(objectId)[key] || {};
    };

    const getIotShowValue = (objectId, infoCode) => {
        const infoCodeObj = _getObjectInfo(objectId)[infoCode];
        let value = '';
        if (infoCodeObj?.dataSource) {
            infoCodeObj?.dataSource.forEach(item => {
                if (infoCodeObj.dataValue) {
                    // eslint-disable-next-line no-restricted-syntax
                    if (toNumber(item.code) === toNumber(infoCodeObj.dataValue)) {
                        value = item.name;
                    }
                }
            });
        } else {
            value = infoCodeObj?.dataValue;
        }

        return `${value || '--'} ${infoCodeObj?.unit || ''}`;
    };

    // 异常事件

    const AbnormalEventStrategy = {
        Single: 'Single',
        Related: 'Related'
    };

    const setAbnormalEventStrategy = strategy => {
        _abnormalEventStrategy.value = strategy;
    };

    const setAbnormalEvent = abnormalEvent => {
        const objectId = abnormalEvent.id;
        const objectInfo = _getObjectInfo(objectId);
        _setAbnormalEvent(objectInfo.abnormalEventsList, abnormalEvent);
    };

    const getAbnormalEventsList = objectIds => {
        const abnormalEventsMap = {};
        const ids = [];
        if (_abnormalEventStrategy.value === AbnormalEventStrategy.Related) {
            objectIds.forEach(objectId => {
                ids.push(objectId);
                const objectInfo = _getObjectInfo(objectId);
                ids.push(...objectInfo.relatedObjectIds);
            });
        } else if (_abnormalEventStrategy.value === AbnormalEventStrategy.Single) {
            ids.push(...objectIds);
        }
        ids?.forEach(objectId => {
            const objectInfo = _getObjectInfo(objectId);
            objectInfo.abnormalEventsList.forEach(abnormalEvent => {
                abnormalEventsMap[abnormalEvent.exceptionEventId] = abnormalEvent;
            });
        });
        return Object.values(abnormalEventsMap).sort((a, b) => Number(b.exceptionStartTime) - Number(a.exceptionStartTime));
    };

    const getObjectAbnormalStatus = objectId => {
        if (_abnormalEventStrategy.value === AbnormalEventStrategy.Related) {
            const objectInfo = _getObjectInfo(objectId);
            const ids = [objectId, ...objectInfo.relatedObjectIds];
            let result = false;
            for (let i = 0; i < ids.length; i++) {
                const objectInfo = _getObjectInfo(ids[i]);
                if (objectInfo.abnormalEventsList.length > 0) {
                    result = true;
                    break;
                }
            }
            return result;
        } else {
            const objectInfo = _getObjectInfo(objectId);
            return objectInfo.abnormalEventsList.length > 0;
        }
    };

    // 清理
    const clearAbnormalEventsList = objectIds => {
        objectIds.forEach(objectId => {
            const objectInfo = _getObjectInfo(objectId);
            if (!objectInfo.abnormalEventsList) {
                objectInfo.abnormalEventsList = [];
            } else {
                objectInfo.abnormalEventsList.length = 0;
            }
        });
    };

    const clearAllObjectInfo = () => {
        _objectInfoListRef.value = {};
    };
    const clearOneObjectInfo = objectId => {
        if (_objectInfoListRef.value[objectId]) {
            delete _objectInfoListRef.value[objectId];
        }
    };

    // 建立对象关联关系
    const setObject2RelatedObject = (objectId, relatedObjectId) => {
        const objectInfo = _getObjectInfo(objectId);
        // 已存在关联则不处理
        if (Array.isArray(objectInfo.relatedObjectIds) && objectInfo.relatedObjectIds.includes(relatedObjectId)) {
            return;
        }
        objectInfo.relatedObjectIds.push(relatedObjectId);
    };

    const getRelatedObjects = objectId => {
        const objectInfo = _getObjectInfo(objectId);
        return objectInfo.relatedObjectIds;
    };

    const clearAllRelatedObjects = objectIds => {
        objectIds.forEach(objectId => {
            const objectInfo = _getObjectInfo(objectId);
            objectInfo.relatedObjectIds = [];
        });
    };

    /*
    EXCEPTION
    CONJECTURE_EXCEPTION
    UNKNOWN
    POTENTIAL
    NORMAL
    GENERAL_NORMAL
    */
    // 风险事件（默认使用对象关联关系。e.g 机房安全系统空间及空间下设备）
    const setObjectDanegerEvent = dangerEvent => {
        const { objectId } = dangerEvent;
        const objectInfo = _getObjectInfo(objectId);
        _setDangerEvent(objectInfo.dangerEventsList, dangerEvent);
    };

    /**
     * 获取指定对象的风险状态
     * @param {string|number} objectId - 对象ID，用于查询该对象及其关联对象的风险事件
     * @returns {Object} 返回一个包含风险状态码和状态名称的对象，可能的返回值包括：
     *                   - { code: DANEGER_STATUS.EXCEPTION, name: '无风险事件数据' }
     *                   - { code: DANEGER_STATUS.UNKNOWN, name: '状态不明' }
     *                   - { code: DANEGER_STATUS.EXCEPTION, name: '风险发生 / 推测发生' }
     *                   - { code: DANEGER_STATUS.POTENTIAL, name: '潜在风险' }
     *                   - { code: DANEGER_STATUS.NORMAL, name: '正常 / 大体正常' }
     *                   - { code: DANEGER_STATUS.GENERAL_NORMAL, name: '正常 / 大体正常' }
     */
    const getObjectDanegerStatus = objectId => {
        // 获取当前对象的基本信息，包括其关联对象ID列表
        const objectInfo = _getObjectInfo(objectId);

        // 收集当前对象及所有关联对象的风险事件列表
        const dangerEventList = [objectId, ...objectInfo.relatedObjectIds].flatMap(id => DockSingleton.getInstance().getObjectDanegerEventsList(id));

        // 该空间及空间下设备，没有“满足筛选条件”的风险事件实例
        if (dangerEventList.length === 0) {
            return DANEGER_STATUS.NORISKEVENT;
        }

        // 定义状态优先级映射表，用于最终状态判断
        let statusPriority = {
                EXCEPTION: DANEGER_STATUS.EXCEPTION,
                POTENTIAL: DANEGER_STATUS.POTENTIAL,
                UNKNOWN: DANEGER_STATUS.UNKNOWN,
                NORISKEVENT: DANEGER_STATUS.NORISKEVENT,
                NORMAL: DANEGER_STATUS.NORMAL,
                GENERAL_NORMAL: DANEGER_STATUS.GENERAL_NORMAL
            },
            hasStatus = false,
            foundStatus = DANEGER_STATUS.NORMAL.code;

        // 遍历所有风险事件，根据事件状态确定对象的整体风险状态
        for (const event of dangerEventList) {
            const { status } = event;
            // 优先级：推测发生/发生 > 潜在 > 状态不明 > 正常/大体正常
            if (status === DANEGER_STATUS.CONJECTURE_EXCEPTION.code || status === DANEGER_STATUS.EXCEPTION.code) {
                foundStatus = DANEGER_STATUS.EXCEPTION.code;
                hasStatus = true;
                break;
            } else if (status === DANEGER_STATUS.POTENTIAL.code) {
                foundStatus = DANEGER_STATUS.POTENTIAL.code;
                hasStatus = true;
            } else if (status === DANEGER_STATUS.UNKNOWN.code && foundStatus !== DANEGER_STATUS.POTENTIAL.code) {
                foundStatus = DANEGER_STATUS.UNKNOWN.code;
                hasStatus = true;
            }
        }
        // 该空间及空间下设备，对应“管理范围内”的的风险事件实例的状态都取不到。
        // 如果没有找到任何有效状态，并且所有事件都没有状态字段，则标记为“无风险事件数据”
        if (!hasStatus && dangerEventList.every(event => !event.status)) {
            foundStatus = DANEGER_STATUS.NORISKEVENT.code;
        }

        // 根据最终确定的状态返回对应的状态对象
        return statusPriority[foundStatus];
    };

    const getObjectDanegerEventsList = targetId => {
        let objectIds = [];
        // 入参支持ID和id数组
        if (Array.isArray(targetId)) {
            objectIds = targetId;
        } else {
            objectIds = [targetId];
        }
        const record = {};
        const dangerEventsList = [];
        objectIds?.forEach(id => {
            const objectInfo = _getObjectInfo(id);
            objectInfo?.dangerEventsList?.forEach(obj => {
                if (!record[obj.dangerEventId]) {
                    record[obj.dangerEventId] = true;
                    dangerEventsList.push(obj);
                }
            });
        });
        return dangerEventsList.sort((a, b) => {
            const dateA = new Date(a.updateTime);
            const dateB = new Date(b.updateTime);
            return dateB - dateA;
        });
    };

    const getObjectAndRelatedDanegerList = targetIds => {
        const idSet = new Set(targetIds);
        targetIds?.forEach(id => {
            const relIds = getRelatedObjects(id);
            relIds?.forEach(relId => {
                idSet.add(relId);
            });
        });
        return DockSingleton.getInstance().getObjectDanegerEventsList([...idSet]);
    };

    // 内部函数

    // 实例信息容器，包含iot信息点、异常事件、风险事件、关联对象等
    // abnormalEventsList：实例异常事件列表
    // dangerEventsList：实例风险事件列表
    // relatedObjectIds：关联对象实例列表
    // [key：infoCode]：信息点值
    const _objectInfoListRef = ref({});
    const _abnormalEventStrategy = ref(AbnormalEventStrategy.Single);

    const _getObjectInfo = objectId => {
        if (!_objectInfoListRef.value[objectId]) _objectInfoListRef.value[objectId] = {};
        const objectInfo = _objectInfoListRef.value[objectId];
        _initAbnormal(objectInfo);
        _initRelatedObjectIds(objectInfo);
        _initDangerEventsList(objectInfo);
        return objectInfo;
    };

    const _initAbnormal = objectInfo => {
        if (objectInfo && !objectInfo.abnormalEventsList) {
            objectInfo.abnormalEventsList = [];
        }
    };

    const _initRelatedObjectIds = objectInfo => {
        if (objectInfo && !objectInfo.relatedObjectIds) {
            objectInfo.relatedObjectIds = [];
        }
    };

    const _initDangerEventsList = objectInfo => {
        if (objectInfo && !objectInfo.dangerEventsList) {
            objectInfo.dangerEventsList = [];
        }
    };

    const _setAbnormalEvent = (abnormalEventsList, abnormalEvent) => {
        const index = abnormalEventsList.findIndex(a => a.exceptionEventId === abnormalEvent.exceptionEventId && a.id === abnormalEvent.id);
        if (index > -1) {
            if (abnormalEvent.exceptionEventStatus === 'RESOLVED') {
                // 删除
                abnormalEventsList.splice(index, 1);
            } else {
                // 更新
                abnormalEventsList.splice(index, 1, abnormalEvent);
            }
        } else {
            if (abnormalEvent.exceptionEventStatus === 'UNRESOLVED') {
                // 插入
                abnormalEventsList.push(abnormalEvent);
            }
        }
    };

    const _setDangerEvent = (dangerEventsList, dangerEvent) => {
        const index = dangerEventsList.findIndex(d => d.dangerEventId === dangerEvent.dangerEventId);
        if (index > -1) {
            // 更新
            dangerEventsList.splice(index, 1, dangerEvent);
        } else {
            // 插入
            dangerEventsList.push(dangerEvent);
        }
    };
    const getAllObjectInfo = () => {
        return _objectInfoListRef.value;
    };
    return {
        //信息点
        setIotData,
        getIotData,
        setInfoExtend,
        getInfoExtend,
        setCustomInfo,
        getCustomInfo,
        getIotShowValue,
        //异常事件
        AbnormalEventStrategy,
        setAbnormalEventStrategy,
        setAbnormalEvent,
        getAbnormalEventsList,
        getObjectAbnormalStatus,
        clearAbnormalEventsList,
        //关联关系
        setObject2RelatedObject,
        getRelatedObjects,
        clearAllRelatedObjects,
        //风险事件
        setObjectDanegerEvent,
        getObjectDanegerStatus,
        getObjectDanegerEventsList,
        getObjectAndRelatedDanegerList,
        //清理
        clearAllObjectInfo,
        clearOneObjectInfo,
        // 全部数据
        getAllObjectInfo
    };
};

const DockSingleton = (function () {
    let singletonInstance;
    return {
        getInstance: function () {
            if (!singletonInstance) {
                singletonInstance = responsiveDock();
            }
            return singletonInstance;
        }
    };
})();

export default DockSingleton;
