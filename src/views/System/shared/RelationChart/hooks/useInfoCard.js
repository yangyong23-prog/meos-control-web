// @ts-ignore
import i18n from '@/localization';
import { InfoPointDataType } from '../InfoCardGraphDom/constant';
import { getSystemGraphDetailById } from '@/apis/relationChart';
import { sortMapByKey } from '../utils/relaitonChartUtils';
import DockSingleton from '@/hooks/responsiveDock';
import useEffectWarp from '@/hooks/useEffectWarp';
import { watchEffect } from 'vue';
import _ from 'lodash';
import { INFO_CODE_VAL_DEFINE } from '../constants/common';

const getCloseValue = closeOrOpenKey => {
    return closeOrOpenKey === 'switchStatus' ? '2' : '0';
};

const isOpenValue = (infoCode, value) => {
    if (infoCode === 'groupEquipRuningNum') {
        try {
            return parseInt(value) > 0;
        } catch (e) {
            // console.log('e: ', e);
            return false;
        }
    }
    return value === '1';
};

export default (chart, classCodeEquipIdsMap, idMapInfoCodes, chartOriginData) => {
    const { setIotData: _setIotData, getIotData } = DockSingleton.getInstance();
    const { createEffect, destoryEffect } = useEffectWarp();
    const infoDetails = ref([]);

    const setIotData = (id, infoCode, obj) => {
        if (id && idMapInfoCodes?.value) {
            if (!idMapInfoCodes.value[id]) {
                idMapInfoCodes.value[id] = {};
            }
            idMapInfoCodes.value[id][infoCode] = true;
        }
        _setIotData(id, infoCode, obj);
    };
    const formatValText = (infoValObj, infoDef, useUnit = true) => {
        let val = infoValObj?.dataValue;
        if (infoValObj?.dataSources?.length > 0) {
            const dsItem = infoValObj.dataSources.find(obj => obj.code === val);
            if (dsItem) {
                val = dsItem.name;
            }
        }
        return `${val || '--'}${useUnit && infoDef?.unit ? infoDef.unit : ''}`;
    };

    // 是否显示iot状态
    const hasIotRule = ref(true);
    // 是否显示开关状态
    const hasSwitchRule = ref(true);
    // 获取设备是否有开关状态
    const getEquipOpenCloseStatus = ({ equipId, filterStatus, parentId, parentFilterStatus, classCode }) => {
        const runStatusInfoCodeObj = getIotData(equipId, filterStatus);
        let runStatusDataValue = runStatusInfoCodeObj?.dataValue ?? '';
        if (classCode === 'ACCCAH' && parentId && parentFilterStatus && !runStatusDataValue) {
            const parentRunStatusInfoCodeObj = getIotData(parentId, parentFilterStatus);
            runStatusDataValue = parentRunStatusInfoCodeObj?.dataValue ?? '';
        }

        // 无数据
        if (filterStatus && !runStatusDataValue) {
            return 'noData';
        }

        // 关闭
        if (['0', '2'].includes(runStatusDataValue)) {
            return 'close';
        } else if (runStatusDataValue === '1') {
            // 开启
            return 'open';
        }
    };

    // 根据系统图上全部设备有没有iot状态与滤镜计算是否展示开关与iot
    const computeIotRule = () => {
        const openCloseStatusSet = new Set();
        const allEquipIds = Object.values(classCodeEquipIdsMap.value)?.flat() || [];
        const allEquipNodes =
            chartOriginData.value?.equipmentNodeVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
            }) || [];
        const allGroupNodes =
            chartOriginData.value?.groupVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
            }) || [];
        const allPassByNodes =
            chartOriginData.value?.passByVos?.map(v => {
                return { dataObjectId: v?.dataObjectId, filterStatusVO: v?.filterStatusVO, filterStatus: v?.filterStatus };
            }) || [];
        const allNodesMap = [...allEquipNodes, ...allGroupNodes, ...allPassByNodes];
        try {
            allEquipIds?.forEach(eqId => {
                const { dataObject, filterStatus, filterStatusVO } = allNodesMap.find(v => v?.dataObjectId === eqId) || {};
                const { relObjIds, classCode } = dataObject || {};
                const parentId = relObjIds ? relObjIds[0] : '';
                const { filterStatus: parentFilterStatus, filterStatusVO: parentFilterStatusVO } = parentId ? allNodesMap?.find(v => v?.dataObjectId === parentId) || {} : {};
                const status = getEquipOpenCloseStatus({
                    equipId: eqId,
                    filterStatus: filterStatus || filterStatusVO?.infoCode,
                    parentId,
                    parentFilterStatus: parentFilterStatus || parentFilterStatusVO?.infoCode,
                    classCode
                });
                // 无孪生数据-IOT状态
                if (typeof filterStatusVO === 'object' && filterStatusVO?.existsIotRule === false) {
                    openCloseStatusSet.add('noIot');
                } else if (typeof filterStatusVO === 'object' && Object.keys(filterStatusVO).length === 0) {
                    // 无滤镜
                    openCloseStatusSet.add('noFilter');
                } else if (status) {
                    openCloseStatusSet.add(status);
                }
            });
        } catch (error) {
            console.log('afterLoadChart-getEquipOpenCloseStatus 出错', error);
        }

        // 判断有iot规则逻辑问题修复； UYAI-1171
        if (openCloseStatusSet.has('noIot') && [...openCloseStatusSet].some(v => v !== 'noIot' && v !== 'noFilter')) {
            hasSwitchRule.value = true;
            hasIotRule.value = true;
        } else if (openCloseStatusSet.size && [...openCloseStatusSet].some(v => v !== 'noIot' && v !== 'noFilter')) {
            hasSwitchRule.value = true;
            hasIotRule.value = true;
        } else {
            hasIotRule.value = false;
            hasSwitchRule.value = false;
        }

        // if (openCloseStatusSet.size && [...openCloseStatusSet].every(v => v !== 'noIot' && v !== 'noFilter')) {
        //     hasIotRule.value = false;
        // } else if (openCloseStatusSet.size && [...openCloseStatusSet].every(v => v === 'noIot' || v === 'noFilter')) {
        //     hasIotRule.value = false;
        //     hasSwitchRule.value = false;
        // } else {
        //     hasIotRule.value = true;
        //     hasSwitchRule.value = true;
        // }
    };

    // TODO  按需订阅

    const getItemValText = (data, item) => {
        const curType = data.type;
        if (curType === InfoPointDataType.SINGLE_INFO_CODE || curType === InfoPointDataType.EQUIP_TO_INFO_CODES) {
            const equipId = data.key;
            const { infoCode } = item;
            const iotval = getIotData(equipId, infoCode);
            return formatValText(iotval, item);
        } else if (curType === InfoPointDataType.INFO_CODE_TO_EQUIPS) {
            const equipId = item.id;
            const infoCode = data.key;
            const iotval = getIotData(equipId, infoCode);
            return formatValText(iotval, item);
        } else if (curType === InfoPointDataType.TAB || curType === InfoPointDataType.TAB_GROUP) {
            const equipId = data.key;
            const { infoCode } = item;
            if (infoCode === 'localAndManualStatus') {
                const localRemoteStatusValObj = getIotData(equipId, 'localRemoteStatus');
                const manualAutoStatusValObj = getIotData(equipId, 'manualAutoStatus');
                if (localRemoteStatusValObj?.dataValue === '0') return i18n.global.t('meos_control_web.local');
                if (manualAutoStatusValObj?.dataValue === '0') return i18n.global.t('meos_control_web.manual');
                return '';
            } else if (infoCode === 'passByName') {
                return item.aliasName;
            } else {
                const iotval = getIotData(equipId, infoCode);
                const codeDefine = INFO_CODE_VAL_DEFINE[infoCode];
                if (!iotval?.dataValue || !codeDefine) {
                    return;
                }
                return codeDefine[iotval.dataValue]?.name ?? '';
            }
        }
        return '';
    };

    const makeEquipInfoMap = () => {
        infoDetails.value.forEach(d => {
            d.data?.equipmentIotInfoCodes?.forEach(eqIot => {
                const { classCode, equipmentId, infoCodes } = eqIot;
                if (!classCodeEquipIdsMap.value[classCode]) {
                    classCodeEquipIdsMap.value[classCode] = [];
                }
                const ids = classCodeEquipIdsMap.value[classCode];
                if (ids.indexOf(equipmentId) === -1) {
                    ids.push(equipmentId);
                }

                infoCodes?.forEach(obj => {
                    //NOTE：后端无法添加【dataValueName】为key的值，前端在此处统一做处理，统一为【dataValueName】。
                    obj.dataValueName = obj.infoCodeValue;
                    delete obj.infoCodeValue;
                    setIotData(equipmentId, obj.infoCode, obj);
                });
            });
        });
    };

    const getReplaceStatusInfoCodes = modelData => {
        return modelData?.legendNode?.legendIcon?.infoCodes || [];
    };

    const bindChartEffect = () => {
        destoryEffect();
        setTimeout(() => {
            // 计算是否有iot与开关状态
            computeIotRule();
            createEffect(() => {
                Object.values(classCodeEquipIdsMap.value).forEach(ids => {
                    ids.forEach(equipId => {
                        const chartModel = chart.value.findOneModel(model => model.getModelData()?.dataObject?.id === equipId);
                        const modelData = chartModel?.getModelData();
                        if (!modelData) return;

                        // chart 渲染
                        let { filterStatus: closeOrOpenKey, dataObject = {} } = modelData;
                        const { relObjIds, classCode } = dataObject;
                        const parentId = relObjIds ? relObjIds[0] : '';
                        const parentModel = chart.value.findOneModel(model => model.getModelData()?.dataObject?.id === parentId);
                        const parentModelData = parentModel?.getModelData();
                        const parentFilterStatus = parentModelData?.filterStatus || parentModelData?.filterStatusVO?.infoCode;
                        const closeValue = getCloseValue(closeOrOpenKey || modelData?.filterStatusVO?.infoCode);

                        // 处理 开启关闭
                        watchEffect(() => {
                            let curFilterStatus = modelData?.filterStatus || modelData?.filterStatusVO?.infoCode,
                                { filterStatusVO } = modelData;
                            const runStatusInfoCodeObj = getIotData(equipId, curFilterStatus);
                            if (classCode === 'ACCCAH') {
                                console.log('filterStatusVO: ', filterStatusVO);
                            }
                            // eslint-disable-next-line one-var
                            let runStatusDataValue = runStatusInfoCodeObj?.dataValue;
                            if (classCode === 'ACCCAH' && parentFilterStatus && (runStatusDataValue === undefined || runStatusDataValue === null || runStatusDataValue === '')) {
                                const parentRunStatusInfoCodeObj = getIotData(parentId, parentFilterStatus);
                                runStatusDataValue = parentRunStatusInfoCodeObj?.dataValue;
                                filterStatusVO = parentModelData?.filterStatusVO;
                                curFilterStatus = parentFilterStatus;
                            }

                            // 无数据
                            if (hasSwitchRule.value && curFilterStatus && (runStatusDataValue === undefined || runStatusDataValue === null || runStatusDataValue === '')) {
                                chartModel.setState('noData', true);
                            } else {
                                chartModel.setState('noData', false);
                            }
                            if (hasSwitchRule.value) {
                                if (runStatusDataValue === closeValue) {
                                    // 关闭
                                    // 电动通断水阀 的 关闭状态 颜色值和其他不一样，单独处理
                                    chartModel.setState(classCode === 'ACVVEO' ? 'valveClose' : 'close', true);
                                    chartModel.setState('noData', false);
                                } else if (isOpenValue(curFilterStatus, runStatusDataValue)) {
                                    // 开启
                                    // 电动通断水阀 的 关闭状态 颜色值和其他不一样，单独处理
                                    chartModel.setState(classCode === 'ACVVEO' ? 'valveClose' : 'close', false);
                                    chartModel.setState('noData', false);
                                }
                            } else {
                                chartModel.setState('valveClose', false);
                                chartModel.setState('close', false);
                                chartModel.setState('noData', false);
                            }
                            if (hasIotRule.value) {
                                // 无孪生数据-IOT状态
                                if (typeof filterStatusVO === 'object' && filterStatusVO?.existsIotRule === false) {
                                    chartModel.setState('valveClose', false);
                                    chartModel.setState('close', false);
                                    chartModel.setState('noIotRule', true);
                                } else {
                                    chartModel.setState('noIotRule', false);
                                }
                            } else {
                                chartModel.setState('valveClose', false);
                                chartModel.setState('close', false);
                                chartModel.setState('noIotRule', false);
                            }
                        });

                        // 处理rcRunStatus
                        watchEffect(() => {
                            const rcRunStatusInfoCodeObj = getIotData(equipId, 'rcRunStatus');
                            if (!_.isEmpty(rcRunStatusInfoCodeObj) && rcRunStatusInfoCodeObj?.dataValue !== '-1') {
                                const rcRunStatusDataValue = rcRunStatusInfoCodeObj?.dataValue;
                                if (rcRunStatusDataValue === '2' || rcRunStatusDataValue === '3') {
                                    chartModel.setState('loading', true);
                                } else if (rcRunStatusDataValue !== '-1') {
                                    chartModel.setState('loading', false);
                                }
                            }
                        });

                        // 处理 superHighLevelAlarm
                        watchEffect(() => {
                            const superHighLevelAlarmInfoCodeObj = getIotData(equipId, 'superHighLevelAlarm');
                            if (!_.isEmpty(superHighLevelAlarmInfoCodeObj) && superHighLevelAlarmInfoCodeObj?.dataValue !== '-1') {
                                const superHighLevelAlarmDataValue = superHighLevelAlarmInfoCodeObj?.dataValue;
                                if (superHighLevelAlarmDataValue === '1') {
                                    chartModel.setState('superHightLiquid', true);
                                } else {
                                    chartModel.setState('superHightLiquid', false);
                                }
                            }
                        });

                        // 处理highLevelAlarm
                        watchEffect(() => {
                            const highLevelAlarmlInfoCodeObj = getIotData(equipId, 'highLevelAlarm');
                            if (!_.isEmpty(highLevelAlarmlInfoCodeObj) && highLevelAlarmlInfoCodeObj?.dataValue !== '-1') {
                                const highLevelAlarmlInfoCodeObjDataValue = highLevelAlarmlInfoCodeObj?.dataValue;
                                if (highLevelAlarmlInfoCodeObjDataValue === '1') {
                                    chartModel.setState('hightLiquid', true);
                                } else {
                                    chartModel.setState('hightLiquid', false);
                                }
                            }
                        });

                        // 处理图标替换
                        const replaceStatusInfoCodes = getReplaceStatusInfoCodes(modelData);
                        if (replaceStatusInfoCodes.length) {
                            watchEffect(() => {
                                const stateValues = [];
                                replaceStatusInfoCodes.forEach(infoCode => {
                                    const findIot = getIotData(equipId, infoCode);
                                    if (findIot?.dataValue || findIot?.dataValue === 0) {
                                        stateValues.push(findIot.dataValue);
                                    } else {
                                        stateValues.push('unknown');
                                    }
                                });
                                const stateName = stateValues.join('-');
                                chartModel.replaceState(stateName);
                            });
                        }
                    });
                });
            });
        }, 0);
    };

    let abortController = null;

    const abortLoadInfoDetails = () => {
        abortController?.abort();
    };

    const writeIotDatas = arr => {
        const writeIot = (equipId, info) => {
            if (equipId && info.infoCode && info) {
                if (!info.dataSources && info.dataSource) {
                    info.dataSources = info.dataSource;
                }
                info.dataValueName = info.infoCodeValue;
                delete info.infoCodeValue;
                setIotData(equipId, info.infoCode, info);
            }
        };
        arr?.forEach(d => {
            // d.data
            const data = d?.data;
            if (!data) {
                return;
            }

            const curType = data.type;
            if (curType === InfoPointDataType.SINGLE_INFO_CODE || curType === InfoPointDataType.EQUIP_TO_INFO_CODES) {
                const equipId = d.data.key;

                if (curType === InfoPointDataType.SINGLE_INFO_CODE && data.infoObject) {
                    writeIot(equipId, data.infoObject);
                    data.infoObject.linkCodes?.forEach(info => {
                        writeIot(equipId, info);
                    });
                } else if (curType === InfoPointDataType.EQUIP_TO_INFO_CODES) {
                    data.groups?.forEach(info => {
                        if (info) {
                            writeIot(equipId, info);
                        }
                    });
                    data.linkCodes?.forEach(info => {
                        writeIot(equipId, info);
                    });
                }
            } else if (curType === InfoPointDataType.INFO_CODE_TO_EQUIPS) {
                // console.log('d.data: INFO_CODE_TO_EQUIPS ', d.data);
                data.groups?.forEach(info => {
                    if (info) {
                        writeIot(info.id, info);
                    }
                });
            } else if (curType === InfoPointDataType.TAB || curType === InfoPointDataType.TAB_GROUP) {
                // console.log('curType: ', d);
                const equipId = data.key;
                if (curType === InfoPointDataType.TAB && data.infoObject) {
                    writeIot(equipId, data.infoObject);
                    data.infoObject.linkCodes?.forEach(info => {
                        writeIot(equipId, info);
                    });
                } else if (curType === InfoPointDataType.TAB_GROUP) {
                    data.groups?.forEach(info => {
                        if (info) {
                            writeIot(equipId, info);
                        }
                    });
                    data.linkCodes?.forEach(info => {
                        writeIot(equipId, info);
                    });
                }
            }
        });
    };
    const loadInfoDetails = async (systemGraphDuplicateId, loadGraphPromise) => {
        abortLoadInfoDetails();
        abortController = new AbortController();
        const res = await getSystemGraphDetailById({ systemGraphDuplicateId }, abortController.signal);

        await loadGraphPromise;
        if (res.code === '00000' && res.data) {
            infoDetails.value = res.data;
            try {
                writeIotDatas(res.data);
                makeEquipInfoMap();
            } catch (e) {
                console.log('e: ', e);
            }
        }
    };

    onBeforeUnmount(() => {
        destoryEffect();
    });

    provide('getItemValText', getItemValText);

    return {
        getItemValText,
        classCodeEquipIdsMap,
        infoDetails,
        loadInfoDetails,
        abortLoadInfoDetails,
        bindChartEffect
    };
};
