// @ts-ignore
import i18n from '@/localization';
import { ref, provide, inject, toRaw } from 'vue';

import { SMD_ALL_OPEN, SMD_ALL_CLOSE, SMD_PARTIAL_OPEN, NOT_CONFIGURED, SMD_OPEN, SMD_CLOSE } from '../constants';
import baseStore from '@/store/baseStore';
import { saveSceneObjectSettings, querySceneFuncTypeList, querySceneFuncTypeListNew } from '@/apis/lightingRequirements';

import { $Message } from 'meri-plus';

export const allStatisticsInjectKey = Symbol('allStatisticsInjectKey');
export const hasGroupSettingsChangeInjectKey = Symbol('hasGroupSettingsChangeInjectKey');

/**
 * 需求配置-公区
 */
export default () => {
    const curControlledObjType = inject('curControlledObjType', ref('PROJECT'));
    const curControlledObjId = inject('curControlledObjId', ref(baseStore().projectId));
    const curSelectedPeriodId = inject('curSelectedPeriodId', ref(''));
    const demandTemplateType = inject('demandTemplateType');

    const globalSettingBase = ref([]);
    const showChangeModeConfirm = ref(false);
    const showCircuitModal = ref(false);
    const unionSetting = ref([]);
    const showCloseCircuitConfirm = ref(false);
    const isSaveLoading = ref(false);
    // 保存不合法记录（功能类型部分开启下有未配置的）
    const unlawfulRecord = ref({});
    const allStatistics = ref({
        total: 0,
        openCount: 0,
        noCount: 0
    });

    // 当前打开回路弹框对应的灯具类型数据
    // const curLampObj = ref(null);
    // 当前打开回路弹框对应的功能类型数据
    const curFuncTypeObj = ref(null);
    let unionSettingMap = {},
        curEditRow = null,
        curEditToMode = null,
        abortController = null;

    const genQueryParams = () => {
        const params = {
            templateId: baseStore().templateId,
            projectId: baseStore().projectId
        };

        params.sceneId = curSelectedPeriodId?.value;
        if (curControlledObjId?.value?.length > 0) {
            params.instanceId = curControlledObjId.value[0];
        }
        params.instanceType = curControlledObjType?.value;
        return params;
    };
    const genQueryParamsNew = () => {
        const params = {
            projectId: baseStore().projectId
        };

        if (curControlledObjId?.value?.length > 0) {
            params.instanceId = curControlledObjId.value[0];
        }
        params.instanceType = curControlledObjType?.value;
        params.demandTemplateType = demandTemplateType?.value || baseStore().templateType;
        return params;
    };

    const querySettingBase = async () => {
        // 请求基准setting数据
        /* // 用下面的接口替代这个，后面这个会删？
        const params = genQueryParams();
        return await querySceneFuncTypeList(params);*/
        // 新接口
        abortController?.abort();
        abortController = new AbortController();
        const params = genQueryParamsNew();
        unionSetting.value = [];
        return await querySceneFuncTypeListNew(params, abortController.signal);
    };

    const resetAll = () => {
        globalSettingBase.value = [];
        unionSetting.value = [];
        unionSettingMap = {};
        if (allStatistics.value) {
            allStatistics.value = {
                total: 0,
                openCount: 0,
                noCount: 0
            };
        }
        unlawfulRecord.value = {};
    };

    const makeCircuitObj = (newObj, objId, defaultStrefCount = 1) => {
        // console.log('makeCircuitObj: ');
        newObj.strefCount = defaultStrefCount;
        newObj.id = objId;

        newObj.name = newObj.circuitLocalName;
        newObj.originSettingMode = newObj.settingMode || NOT_CONFIGURED;
        newObj.settingMode = newObj.settingMode || NOT_CONFIGURED;
        newObj.lastSavedMode = newObj.settingMode;
        if (!unionSettingMap[objId]) {
            unionSettingMap[objId] = newObj;
        }
    };

    // defaultStrefCount 默认的引用计数值，对于再次编辑的空间类型配置，初始化时默认引用为0 add时自增
    const makeFuncTypeObj = (newObj, objId, defaultStrefCount = 1) => {
        delete newObj.children;
        // strefCount 引用计数，为了空间类的添加删除辅助用
        newObj.strefCount = defaultStrefCount;
        newObj.id = objId;
        newObj.name = newObj.funcTypeName;
        newObj.originSettingMode = newObj.settingMode || NOT_CONFIGURED;
        newObj.settingMode = newObj.settingMode || NOT_CONFIGURED;
        newObj.total = 0;
        newObj.openCount = 0;
        newObj.noCount = 0;
        // 记录原始编组配置
        newObj.originGroupSettings = newObj.circuitGroupSettings;

        // TODO 编组配置数据统计
        const hasConfiguredGroup = newObj?.circuitGroupSettings?.length;
        if (hasConfiguredGroup) {
            newObj.openCount = newObj?.summary?.openCount ?? 0;
            newObj.noCount = newObj?.summary?.unConfigCount ?? 0;
        }
        (newObj?.circuitSettings || [])?.forEach(circuit => {
            const circuitId = `${objId}-${circuit.circuitId}`;
            unionSettingMap[circuitId] = circuit;
            makeCircuitObj(circuit, circuitId, defaultStrefCount);
            if (!hasConfiguredGroup) {
                if (circuit.settingMode === SMD_OPEN) {
                    newObj.openCount += 1;
                } else if (circuit.settingMode === NOT_CONFIGURED) {
                    newObj.noCount += 1;
                }
            }
        });

        const totalCount = newObj?.circuitSettings?.length || newObj?.circuitIds?.length || newObj?.summary?.total || 0;
        newObj.total = totalCount;
        if (newObj.settingMode === SMD_PARTIAL_OPEN && totalCount > 0) {
            newObj.open = true;
        }
    };
    const _pushNewObj = (originObj, objId, belongArr, makeFunc, defaultStrefCount = 1) => {
        const newObj = JSON.parse(JSON.stringify(originObj));
        makeFunc(newObj, objId, defaultStrefCount);
        belongArr.push(newObj);
        if (!unionSettingMap[objId]) {
            unionSettingMap[objId] = newObj;
        }
    };
    // 根据基准setting 生成合并setting
    const makeUnionByBase = baseSettings => {
        unionSetting.value = [];
        baseSettings?.forEach(funcTypeObj => {
            const funcTypeId = funcTypeObj.funcType;
            _pushNewObj(funcTypeObj, funcTypeId, unionSetting.value, makeFuncTypeObj);
        });
        updateAllStatistics();
    };
    const makeUnionByInit = (initSettings, defaultStrefCount = 1) => {
        unionSetting.value = [];
        initSettings?.forEach(funcTypeObj => {
            const funcTypeId = funcTypeObj.funcType;
            _pushNewObj(funcTypeObj, funcTypeId, unionSetting.value, makeFuncTypeObj, defaultStrefCount);
        });
        updateAllStatistics();
    };

    const addSpaceType = spaceType => {
        // console.log('spaceType: ', spaceType);
        toRaw(spaceType).circuitFuncTypes.forEach(funcTypeObj => {
            const circuitFuncTypeId = funcTypeObj.funcType;
            const funcTypeSetting = unionSettingMap[circuitFuncTypeId];
            if (funcTypeSetting) {
                funcTypeSetting.strefCount += 1;
                // funcTypeObj.lampFuncTypeSettings?.forEach(lampObj => {
                funcTypeObj.circuitSettings?.forEach(circuit => {
                    const circuitId = `${circuitFuncTypeId}-${circuit.circuitId}`;
                    const circuitSetting = unionSettingMap[circuitId];
                    if (circuitSetting) {
                        circuitSetting.strefCount += 1;
                    } else {
                        const circuitObj = {
                            ...circuit,
                            settingMode: funcTypeSetting.settingMode === SMD_ALL_OPEN ? SMD_OPEN : funcTypeSetting.settingMode === SMD_ALL_CLOSE ? SMD_CLOSE : ''
                        };
                        _pushNewObj(circuitObj, circuitId, funcTypeSetting.circuitSettings, makeCircuitObj);
                    }
                });
            } else {
                _pushNewObj(funcTypeObj, circuitFuncTypeId, unionSetting.value, makeFuncTypeObj);
            }
        });
        updateTreeCount();
        updateAllStatistics();
        console.log('unionSetting.value: ', unionSetting.value);
    };
    const hasRemovedForSpaceTypeDel = spaceType => {
        let isSure = false;
        spaceType.circuitFuncTypes.forEach(funcTypeObj => {
            const circuitFuncTypeId = funcTypeObj.funcType;
            const funcTypeSetting = unionSettingMap[circuitFuncTypeId];
            if (funcTypeSetting) {
                if (funcTypeSetting.strefCount <= 1) {
                    isSure = true;
                    return;
                }

                funcTypeObj.circuitSettings?.forEach(circuit => {
                    const circuitId = `${circuitFuncTypeId}-${circuit.circuitId}`;
                    const circuitSetting = unionSettingMap[circuitId];
                    if (circuitSetting) {
                        if (circuitSetting.strefCount <= 1) {
                            isSure = true;
                            return;
                        }
                    }
                });
            }
        });
        return isSure;
    };
    const deleteSpaceType = spaceType => {
        spaceType.circuitFuncTypes.forEach(funcTypeObj => {
            const circuitFuncTypeId = funcTypeObj.funcType;
            const funcTypeSetting = unionSettingMap[circuitFuncTypeId];
            if (funcTypeSetting) {
                funcTypeSetting.strefCount -= 1;
                const funcIdx = unionSetting.value.findIndex(obj => {
                    return obj.id === circuitFuncTypeId;
                });
                if (funcTypeSetting.strefCount <= 0) {
                    if (funcIdx > -1) {
                        unionSetting.value.splice(funcIdx, 1);
                        delete unionSettingMap[circuitFuncTypeId];
                    }
                }

                funcTypeObj.circuitSettings?.forEach(circuit => {
                    const circuitId = `${circuitFuncTypeId}-${circuit.circuitId}`;
                    const circuitSetting = unionSettingMap[circuitId];
                    if (circuitSetting) {
                        circuitSetting.strefCount -= 1;
                        if (circuitSetting.strefCount <= 0) {
                            delete unionSettingMap[circuitId];
                        }
                    }
                });
            }
        });
        updateUnionSetting(true);
        updateTreeCount();
        updateAllStatistics();
    };

    const updateUnionSetting = (isDeleteSpaceType = false) => {
        unionSetting.value = unionSetting.value.filter(funcType => {
            let allCloseLoops = [],
                allOpenLoops = [];
            const needFromGroupToLoop = funcType?.radioConfig !== 'loop' && isDeleteSpaceType && funcType?.savedGroupSettings?.length;
            // 当前配置不为回路配置时，需将编组配置的全开全关注入回路配置，以便重新计算回路统计
            if (needFromGroupToLoop) {
                allCloseLoops = funcType?.savedGroupSettings?.filter(s => s?.settingMode === SMD_ALL_CLOSE)?.flatMap(s => s?.matchRelIds || []);
                allOpenLoops = funcType?.savedGroupSettings?.filter(s => s?.settingMode === SMD_ALL_OPEN)?.flatMap(s => s?.matchRelIds || []);
            }
            if (funcType.strefCount > 0) {
                funcType.circuitSettings = funcType.circuitSettings.filter(cir => {
                    if (allCloseLoops.includes(cir?.circuitId)) {
                        cir.settingMode = SMD_CLOSE;
                        cir.lastSavedMode = SMD_CLOSE;
                    } else if (allOpenLoops.includes(cir?.circuitId)) {
                        cir.settingMode = SMD_OPEN;
                        cir.lastSavedMode = SMD_OPEN;
                    }

                    return cir.strefCount > 0;
                });
                if (needFromGroupToLoop) {
                    funcType?.savedGroupSettings.forEach(obj => {
                        // 重新记录编组匹配的回路ids
                        const relIds = obj?.relObjects?.map(s => s.id) || [];
                        const matchRelIds = funcType.circuitSettings.filter(s => relIds.includes(s.circuitId)).map(s => s.circuitId);
                        obj.matchRelIds = matchRelIds;
                    });
                }

                // if (funcType.settingMode === SMD_PARTIAL_OPEN && funcType.circuitSettings?.length > 0) {
                //     funcType.children = funcType.circuitSettings;
                // }
            }
            return funcType.strefCount > 0;
        });
    };
    // 初始化空间类型配置数据(再次编辑保存过的空间类型配置，初始化)
    const initSapceTypeSetting = (scopeSpaceTypes, initSpaceTypes) => {
        // console.log('initSapceTypeSetting: ', scopeSpaceTypes);
        // 空间类型映射对应的功能类型树信息
        const spaceTypeMapFuncTypes = {};
        scopeSpaceTypes.forEach(obj => {
            spaceTypeMapFuncTypes[obj.spaceFuncType] = obj;
        });
        initSpaceTypes?.forEach(sapceTypeObj => {
            const funcTypeObj = spaceTypeMapFuncTypes[sapceTypeObj.key];
            if (funcTypeObj) {
                // console.log('funcTypeObj: ', funcTypeObj);
                addSpaceType(funcTypeObj);
            }
        });
    };

    const hasGroupSettingsChange = (groupSettings = [], lastGroupSettings = []) => {
        if (groupSettings.length !== lastGroupSettings.length) {
            return true;
        }
        const someItemModeChange = groupSettings.some(item => {
            const lastItem = lastGroupSettings?.find(l => l.groupId === item.groupId);
            const curItemMode = item?.settingMode ?? NOT_CONFIGURED;
            const lastItemMode = lastItem?.settingMode ?? NOT_CONFIGURED;
            if (lastItem) {
                return curItemMode !== lastItemMode;
            }
            return false;
        });
        return someItemModeChange;
    };

    const hasCircuitSettingsChange = (circuitSettings, compOrigin = false) => {
        if (!circuitSettings) {
            return false;
        }
        for (let k = 0; k < circuitSettings.length; k++) {
            const circuit = circuitSettings[k];
            if (compOrigin) {
                // 和原始开启状态比较
                if (circuit.settingMode !== circuit.originSettingMode) {
                    return true;
                }
            } else if (circuit.settingMode !== circuit.lastSavedMode) {
                // 和上次保存比较
                return true;
            }
        }
    };

    const hasEditChanged = () => {
        const lenFuncTypes = unionSetting.value?.length;
        let rst = false;
        for (let i = 0; !rst && i < lenFuncTypes; i++) {
            const funcType = unionSetting.value[i];
            if (funcType.settingMode !== funcType.originSettingMode) {
                rst = true;
                break;
            }
            const groupChange = hasGroupSettingsChange(funcType?.circuitGroupSettings || [], funcType?.originGroupSettings || []);
            const loopChange = hasCircuitSettingsChange(funcType.circuitSettings, true);

            rst = groupChange || loopChange;
        }
        return rst;
    };

    const updateChildrenMode = (target, toMode) => {
        if (target) {
            const updateCircuitMode = circuitSettings => {
                circuitSettings?.forEach(obj => {
                    let circuitMode = toMode;
                    if (toMode === SMD_ALL_OPEN) {
                        circuitMode = SMD_OPEN;
                    } else if (toMode === SMD_ALL_CLOSE) {
                        circuitMode = SMD_CLOSE;
                    }
                    obj.lastSavedMode = circuitMode;
                    obj.settingMode = circuitMode;
                });
            };

            if (target.funcType) {
                updateCircuitMode(target.circuitSettings);
                updateFuncTypeCount(target);
            }
        }
    };

    const updateGroupConfig = (target, toMode) => {
        if (target?.funcType) {
            (target?.circuitGroupSettings || []).forEach(obj => {
                obj.settingMode = toMode;
            });
            (target?.savedGroupSettings || []).forEach(obj => {
                obj.settingMode = toMode;
                obj.lastSavedMode = toMode;
            });
        }
    };

    const getUnionData = row => {
        if (row.parent) {
            const p = unionSetting.value[row.parent.index];
            if (p.children) {
                return p.children[row.index];
            }
        } else {
            return unionSetting.value[row.index];
        }
    };

    // 关闭/取消二次确认弹框
    const closeModeChangeConfirm = () => {
        curEditRow = null;
        curEditToMode = null;
    };

    //从部分开启点击其它 二次确认成功后
    const confirmModeChange = () => {
        // console.log('confirmModeChange: ');
        if (curEditRow) {
            const rawData = getUnionData(curEditRow);
            if (rawData) {
                rawData.settingMode = curEditToMode;
                // 若是点击功能类型的部分开启的反选，删除children
                if (rawData?.funcType) {
                    delete rawData.children;
                }
                updateChildrenMode(rawData, curEditToMode);
                // 部分开启点击部分开启、全开、全关，确认后都清空编组配置，点击部分开启则默认选中编组，点击全开全关则默认选中回路
                updateGroupConfig(rawData, NOT_CONFIGURED);

                // 若确定清除下面的回路
                // clearCircuit
            }
        }
        return curEditToMode;
    };
    const openOrCloseAll = (row, toMode) => {
        if (row.settingMode === SMD_PARTIAL_OPEN) {
            curEditRow = row;
            curEditToMode = toMode;
            showChangeModeConfirm.value = true;
        } else {
            // console.log('row: ', row);
            const rawData = getUnionData(row);
            if (rawData) {
                if (row.settingMode === toMode) {
                    // 反选改为未配置
                    updateChildrenMode(rawData, NOT_CONFIGURED);
                    rawData.settingMode = NOT_CONFIGURED;
                } else {
                    updateChildrenMode(rawData, toMode);
                    rawData.settingMode = toMode;
                }
                row.open = true;
            }
        }
    };

    // 打开回路弹框
    const clickEditCircuit = row => {
        const rawData = getUnionData(row);

        // curLampObj.value = rawData;
        nextTick(() => {
            curFuncTypeObj.value = rawData;
            showCircuitModal.value = true;
        });
    };
    // 点击部分开启
    const partOpen = row => {
        // console.log('id, index: ', row);
        if (row.settingMode === SMD_PARTIAL_OPEN) {
            curEditRow = row;
            curEditToMode = NOT_CONFIGURED;
            showChangeModeConfirm.value = true;
            // clearCircuit
        } else {
            // 编辑保存后
            const rawData = getUnionData(row);

            // console.log('rawData: ', rawData);
            nextTick(() => {
                curFuncTypeObj.value = rawData;
                showCircuitModal.value = true;
            });
        }
    };

    // 当前回路全部未配置
    const isCircuitAllNone = () => {
        // const s = curLampObj.value?.circuitSettings;
        const s = curFuncTypeObj.value?.circuitSettings;
        const l = s?.length;
        for (let i = 0; i < l; i++) {
            if (s[i].settingMode !== NOT_CONFIGURED) {
                return false;
            }
        }

        return true;
    };

    // 临时保存回路信息
    const saveCircuitTemp = () => {
        let openCount = 0,
            noCount = 0;
        // curLampObj.value?.circuitSettings?.forEach(obj => {
        curFuncTypeObj.value?.circuitSettings?.forEach(obj => {
            obj.lastSavedMode = obj.settingMode;
            console.log('obj.settingMode: ', obj.settingMode);
            if (obj.settingMode === SMD_OPEN) {
                openCount += 1;
            } else if (obj.settingMode === NOT_CONFIGURED) {
                noCount += 1;
            }
        });
        // curLampObj.value.openCount = openCount;
        // curLampObj.value.noCount = noCount;
        curFuncTypeObj.value.openCount = openCount;
        curFuncTypeObj.value.noCount = noCount;
    };
    const sumCircuitSettings = (circuitSettings, mode) => {
        let v = 0;
        circuitSettings.forEach(obj => {
            if (obj.settingMode === mode) {
                v += 1;
            }
        });
        console.log('sumCircuitSettings--v: ', v);
        return v;
    };
    const updateTreeCount = () => {
        unionSetting.value?.forEach(funcTypeObj => {
            funcTypeObj.openCount = sumCircuitSettings(funcTypeObj.circuitSettings, SMD_OPEN);
            funcTypeObj.noCount = sumCircuitSettings(funcTypeObj.circuitSettings, NOT_CONFIGURED);
            funcTypeObj.total = funcTypeObj.circuitSettings?.length || 0;
        });
    };
    const updateFuncTypeCount = funcTypeObj => {
        if (funcTypeObj) {
            funcTypeObj.openCount = sumCircuitSettings(funcTypeObj.circuitSettings, SMD_OPEN);
            funcTypeObj.noCount = sumCircuitSettings(funcTypeObj.circuitSettings, NOT_CONFIGURED);
            funcTypeObj.total = funcTypeObj.circuitSettings?.length || 0;
            updateAllStatistics();
        }
    };
    const updateAllStatistics = () => {
        if (allStatistics.value) {
            let t = 0,
                openCount = 0,
                noCount = 0;
            unionSetting.value?.forEach(funcType => {
                t += funcType.total;
                openCount += funcType.openCount;
                noCount += funcType.noCount;
            });
            allStatistics.value.total = t;
            allStatistics.value.openCount = openCount;
            allStatistics.value.noCount = noCount;
        }
    };

    // 重置回上次保存的回路信息
    const resetLastSavedCircuit = () => {
        // curLampObj.value?.circuitSettings?.forEach(obj => {
        //     obj.settingMode = obj.lastSavedMode;
        // });
        curFuncTypeObj.value?.circuitSettings?.forEach(obj => {
            obj.settingMode = obj.lastSavedMode;
        });
    };

    const genDataForSave = () => {
        return unionSetting.value.map(funcType => {
            const newObj = {
                funcType: funcType.funcType,
                settingMode: funcType.settingMode
            };

            const isGroupConfig = funcType.radioConfig === 'group';
            if (isGroupConfig) {
                // 如果是编组配置，需要从当前对象回路列表里取当前编组关联回路的开关状态，当前编组关联回路外的回路开关状态默认为未配置，组成回路配置circuitSettings
                newObj.circuitGroupSettings = funcType?.circuitGroupSettings;
                const allCircuitIdWithMode =
                    funcType?.savedGroupSettings?.flatMap(s => {
                        const relObjectMode = s?.relObjects?.map(v => {
                            const curRelObjectMode = s?.settingMode === SMD_ALL_OPEN ? SMD_OPEN : s?.settingMode === SMD_ALL_CLOSE ? SMD_CLOSE : NOT_CONFIGURED;
                            return { id: v?.id, settingMode: curRelObjectMode };
                        });
                        return relObjectMode;
                    }) || [];
                const circuitSettings = [];
                funcType.circuitSettings.forEach(c => {
                    const curRelObject = allCircuitIdWithMode.find(r => r.id === c.circuitId);
                    const curItem = {
                        circuitId: c.circuitId,
                        lampFuncType: c.lampFuncType || '',
                        settingMode: curRelObject ? curRelObject?.settingMode : NOT_CONFIGURED
                    };
                    circuitSettings.push(curItem);
                });
                newObj.circuitSettings = circuitSettings;
            } else {
                newObj.circuitSettings = funcType.circuitSettings.map(c => {
                    return {
                        circuitId: c.circuitId,
                        lampFuncType: c.lampFuncType || '',
                        settingMode: c.settingMode
                    };
                });
            }

            console.log('newObj: ', newObj);
            return newObj;
        });
    };

    const genShowResultData = () => {
        // 需要名称
        return unionSetting.value;
    };

    const verificSaveData = () => {
        let isPartModeOk = true;
        unionSetting.value.forEach(funcType => {
            if (funcType.settingMode === SMD_PARTIAL_OPEN) {
                // 有配置过的
                const settedModeObj = funcType.lampFuncTypeSettings.find(obj => obj.settingMode !== NOT_CONFIGURED);
                if (!settedModeObj) {
                    // 若全部未配置
                    isPartModeOk = false;
                    unlawfulRecord.value[funcType.funcType] = true;
                }
            }
        });
        if (!isPartModeOk) {
            $Message.error({
                title: i18n.global.t('meos_control_web.partially_open_node_no_child_configured')
            });
        }
        return isPartModeOk;
    };
    const saveGlobalEdit = async spaceFuncTypes => {
        // if (verificSaveData()) {
        const postData = genDataForSave();
        const params = genQueryParams();
        params.globalSettings = postData;
        if (spaceFuncTypes) {
            params.spaceSettings = spaceFuncTypes;
        }

        isSaveLoading.value = true;
        try {
            await saveSceneObjectSettings(params);
            isSaveLoading.value = false;
            $Message.success({ title: i18n.global.t('common.save_success') });
        } catch (e) {
            isSaveLoading.value = false;
        } finally {
            isSaveLoading.value = false;
        }
        // }
    };
    const saveFeedbackRegulationFun = async data => {
        console.log(data, 'data');
        const params = genQueryParams();
        console.log('params: ', params);

        params.spaceFeedbackAdjustSettings = data || [];

        await saveSceneObjectSettings(params);
        $Message.success({ title: i18n.global.t('common.save_success') });
    };
    const saveSpaceEdit = async (spaceFuncTypes, spaceTypes, globalSettings) => {
        console.log('saveSpaceEdit: ');
        // if (verificSaveData()) {
        // }
        // const postData = genDataForSave();
        const params = genQueryParams();
        console.log('params: ', params);

        if (globalSettings) {
            params.globalSettings = globalSettings;
        }

        params.spaceSettings = spaceTypes || [];

        isSaveLoading.value = true;
        console.log('isSaveLoading.value : ', isSaveLoading.value);
        try {
            await saveSceneObjectSettings(params);
            isSaveLoading.value = false;
            $Message.success({ title: i18n.global.t('common.save_success') });
        } catch (e) {
            isSaveLoading.value = false;
        } finally {
            isSaveLoading.value = false;
        }
    };

    provide('querySettingBase', querySettingBase);
    provide('initSapceTypeSetting', initSapceTypeSetting);
    provide('addSpaceType', addSpaceType);
    provide('resetAll', resetAll);
    provide('makeUnionByBase', makeUnionByBase);
    provide('makeUnionByInit', makeUnionByInit);
    provide('closeModeChangeConfirm', closeModeChangeConfirm);
    provide('confirmModeChange', confirmModeChange);
    provide('openOrCloseAll', openOrCloseAll);
    provide('partOpen', partOpen);
    provide('hasEditChanged', hasEditChanged);
    provide('saveCircuitTemp', saveCircuitTemp);
    provide('hasCircuitSettingsChange', hasCircuitSettingsChange);
    provide('resetLastSavedCircuit', resetLastSavedCircuit);
    provide('updateFuncTypeCount', updateFuncTypeCount);
    provide('isCircuitAllNone', isCircuitAllNone);
    provide('clickEditCircuit', clickEditCircuit);
    provide('unionSetting', unionSetting);
    provide('showChangeModeConfirm', showChangeModeConfirm);
    provide('showCircuitModal', showCircuitModal);
    // provide('curLampObj', curLampObj);
    provide('curFuncTypeObj', curFuncTypeObj);
    provide('showCloseCircuitConfirm', showCloseCircuitConfirm);
    provide('unlawfulRecord', unlawfulRecord);
    provide(allStatisticsInjectKey, allStatistics);
    provide(hasGroupSettingsChangeInjectKey, hasGroupSettingsChange);

    return {
        isSaveLoading,
        allStatistics,
        verificSaveData,
        saveGlobalEdit,
        genDataForSave,
        genShowResultData,
        saveSpaceEdit,
        addSpaceType,
        hasRemovedForSpaceTypeDel,
        deleteSpaceType,
        saveFeedbackRegulationFun
    };
};
