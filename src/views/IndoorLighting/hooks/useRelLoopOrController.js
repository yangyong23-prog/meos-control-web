import DockSingleton from '@/hooks/responsiveDock';
import { MODULE } from '../variables';
import { loopListKey, getModuleListByLoopIdKey, getLoopListBySpaceIdKey, getLoopListByModuleIdKey, getModuleListBySpaceIdKey, loopIdMapInfoConfigsKey } from './useBaseHook';
import { listInfoCodeConfigsByObjectIdCommon } from '@/apis/public';
import dataDockHandling from '@/hooks/dataDockHandling';
import { RUNNING_MONITOR_TYPE, INFOCODE } from '../variables';
import { DETAIL, SUCCESSCODE } from '@/utils/globalVariables';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import { iterateObjct4InstanceInfo } from '@/utils/index';
import { canControl } from '@/utils/tools';
import { isEdge } from '@/utils/envUtils';
import baseStore from '@/store/baseStore';
import { GET_MENU_CONFIG, OBJ_TYPE } from '@/utils/globalVariables';
import i18n from '@/localization';

export default props => {
    const { getIotData } = DockSingleton.getInstance();

    const base = baseStore();
    const { loadDynaDataWithIotHandling, writeDataToResponsiveDock } = dataDockHandling();
    const commonDrawerRoot = inject(commonDrawerRootContextKey);
    const loopList = inject(loopListKey);

    const getModuleListByLoopId = inject(getModuleListByLoopIdKey);
    const getLoopListBySpaceId = inject(getLoopListBySpaceIdKey);
    const getLoopListByModuleId = inject(getLoopListByModuleIdKey);
    const getModuleListBySpaceId = inject(getModuleListBySpaceIdKey);
    const loopIdMapInfoConfigs = inject(loopIdMapInfoConfigsKey);
    const loopCheckedMap = ref({});
    const loopOpenedMap = ref({});
    const moduleStatusMap = ref({});
    const showToolPanel = ref(false);
    const extpandInfoAll = ref(false);

    const loopTypesSel = ref([]);
    const selTypeItem = ref();

    let fetchAbortController = null;

    const targetLoopList = computed(() => {
        if (!props.selectObj?.id) {
            return;
        }
        let loops = null;
        if (props.selectObj.objType === OBJ_TYPE.SPACE && getLoopListBySpaceId) {
            loops = getLoopListBySpaceId(props.selectObj.id);
        } else if (props.selectObj.type === MODULE && getLoopListByModuleId) {
            loops = getLoopListByModuleId(props.selectObj.id);
        }

        if (!loops) {
            return;
        }

        return loops
            .filter(obj => {
                let inSpace = null;
                const relControllers = getModuleListByLoopId(obj.id);
                if (relControllers?.length > 0) {
                    inSpace = relControllers[0].relSpace;
                    // obj.inSpace = inSpace;
                    obj.inSpaceName = toRaw(inSpace)?.localName;
                }
                // selectObj
                return true;
            })
            .sort((a, b) =>
                a.localName?.localeCompare(b.localName, 'zh', {
                    numeric: true,
                    sensitivity: 'base'
                })
            );
    });
    const currentLoopList = computed(() => {
        if (selTypeItem.value) {
            return targetLoopList.value?.filter(loop => {
                if (selTypeItem.value.type === 'lamp') {
                    return loop.lampFuncType === selTypeItem.value.typeCode;
                } else if (selTypeItem.value.type === 'func') {
                    // const funcTypeKey = `func-${loop.funcType}`;
                    return loop.funcType === selTypeItem.value.typeCode;
                }
                return true;
            });
        } else {
            return targetLoopList.value;
        }
    });
    const cascaderOptions = computed(() => {
        const lamps = [];
        const keyMapObj = {};
        const funcTreeList = [];
        targetLoopList.value?.forEach(obj => {
            if (!keyMapObj[obj.lampFuncType]) {
                const lamp = {
                    id: obj.lampFuncType,
                    typeCode: obj.lampFuncType,
                    type: 'lamp',
                    name: obj.lampFuncTypeName ?? '--',
                    children: []
                };
                keyMapObj[obj.lampFuncType] = lamp;
                lamps.push(lamp);

                const funcTypeKey = `func-${obj.funcType}`;
                if (!keyMapObj[funcTypeKey]) {
                    const func = {
                        id: funcTypeKey,
                        typeCode: obj.funcType,
                        type: 'func',
                        name: obj.funcTypeName ?? '--',
                        children: []
                    };
                    keyMapObj[funcTypeKey] = func;
                    funcTreeList.push(func);
                }
                keyMapObj[funcTypeKey].children.push({ ...lamp, id: `${funcTypeKey}-${lamp.id}` });
            }
        });
        return [
            {
                id: 'lamp',
                name: i18n.global.t('meos_control_web.luminaire_type'),
                disabled: true,
                children: lamps
            },
            {
                id: 'func',
                name: i18n.global.t('meos_control_web.function_type'),
                disabled: true,
                children: funcTreeList
            }
        ];
    });
    const statistcalList = computed(() => {
        let localCount = 0,
            openCount = 0,
            closeCount = 0;

        currentLoopList.value?.forEach(loop => {
            const localRemoteStatus = getIotData(loop.id, INFOCODE.localRemoteStatus0.infoCode);
            const runStatusInfo = getIotData(loop.id, INFOCODE.runStatus0.infoCode);
            if (localRemoteStatus) {
                if (localRemoteStatus.dataValue === INFOCODE.localRemoteStatus0.dataValue) {
                    localCount += 1;
                }
            }
            if (runStatusInfo) {
                if (runStatusInfo?.dataValue === '1') {
                    openCount += 1;
                } else if (runStatusInfo?.dataValue === '0') {
                    closeCount += 1;
                }
            }
        });
        return [
            {
                code: 'openCount',
                count: openCount,
                infoCodeName: i18n.global.t('common.status_open')
            },
            {
                code: 'closeCount',
                count: closeCount,
                infoCodeName: i18n.global.t('common.status_close')
            },
            {
                code: 'localCount',
                count: localCount,
                infoCodeName: INFOCODE.localRemoteStatus0.aliasName
            }
        ];
    });

    const reset = () => {
        loopCheckedMap.value = {};
        loopOpenedMap.value = {};
        moduleStatusMap.value = {};
        showToolPanel.value = false;
        extpandInfoAll.value = false;
        extpandInfoAll.value = null;
        loopTypesSel.value = [];
    };

    const hasPermission = () => {
        const permission = window[GET_MENU_CONFIG]().PERMISSION || '';
        // 如果传入了权限，则检查是否有权限
        if (permission && base.hasAuth(permission)) {
            return true;
        }
        return false;
    };
    const objDisabledInfo = computed(() => {
        const objIdMap = {};
        // canControl
        targetLoopList.value?.forEach(loop => {
            if (!hasPermission()) {
                objIdMap[loop.id] = {
                    value: false,
                    text: i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding')
                };
            } else if (!isEdge()) {
                objIdMap[loop.id] = {
                    value: false,
                    text: i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge')
                };
            } else {
                const onlineStatus = getIotData(loop.id, 'onlineStatus');
                const localRemoteStatus = getIotData(loop.id, 'localRemoteStatus');
                objIdMap[loop.id] = canControl([onlineStatus, localRemoteStatus]);
            }
        });
        return objIdMap;
    });

    const allDisabledInfo = computed(() => {
        let enableInfo = {};
        const hasEnabled = targetLoopList.value?.some(loop => objDisabledInfo.value[loop.id]?.value);
        if (hasEnabled) {
            enableInfo = { value: true, text: '' };
        } else {
            const disableLoopId = targetLoopList.value?.find(loop => !objDisabledInfo.value[loop.id]?.value)?.id;
            if (disableLoopId) {
                enableInfo = objDisabledInfo.value[disableLoopId];
            }
        }
        return enableInfo;
    });
    // 按灯具类型分组
    const lampLoopList = computed(() => {
        const lamps = [];
        const keyMapObj = {};
        currentLoopList.value?.forEach(obj => {
            if (!keyMapObj[obj.lampFuncType]) {
                const lamp = {
                    id: obj.lampFuncType,
                    name: obj.lampFuncTypeName,
                    children: []
                };
                keyMapObj[obj.lampFuncType] = lamp;
                lamps.push(lamp);
            }
            keyMapObj[obj.lampFuncType].children.push(obj);
        });
        return lamps;
    });
    // 按控制模块
    const objModuleList = computed(() => {
        if (props.selectObj.type !== MODULE && getModuleListBySpaceId) {
            return getModuleListBySpaceId(props.selectObj.id);
        }
        return null;
    });
    const lampsCheckedMap = computed(() => {
        const codeMapResult = {};
        lampLoopList.value?.forEach(lamp => {
            const loopCount = lamp.children?.length;
            const checkedLoopCount = lamp.children?.filter(obj => loopCheckedMap.value[obj.id])?.length;
            codeMapResult[lamp.id] = checkedLoopCount > 0 && checkedLoopCount !== loopCount ? 'notNull' : checkedLoopCount === loopCount && loopCount > 0 ? 'checked' : 'uncheck';
        });
        return codeMapResult;
    });
    // const allCheckedValue = computed(() => {
    //     const lampIds = Object.keys(lampsCheckedMap.value);
    //     const lampCount = lampIds?.length;
    //     const lampCheckedCount = lampIds?.filter(lampId => lampsCheckedMap.value[lampId] === 'checked')?.length;
    //     return lampCheckedCount > 0 && lampCheckedCount !== lampCount ? 'notNull' : lampCheckedCount === lampCount && lampCount > 0 ? 'checked' : 'uncheck';
    // });
    const allCheckedValue = computed(() => {
        const lampIds = Object.keys(lampsCheckedMap.value);
        const lampCount = lampIds?.length;
        const lampCheckedCount = lampIds?.filter(lampId => lampsCheckedMap.value[lampId] === 'checked')?.length;
        const lampNotNullCount = lampIds?.filter(lampId => lampsCheckedMap.value[lampId] === 'notNull')?.length;
        // 灯具半选，或全选数量不等于全部数量=半选；灯具全选数量等于灯具数量=全选，否则未选
        return lampNotNullCount > 0 || (lampCheckedCount > 0 && lampCheckedCount !== lampCount)
            ? 'notNull'
            : lampCheckedCount === lampCount && lampCount > 0
            ? 'checked'
            : 'uncheck';
    });
    const loopCheckedIds = computed(() => {
        const arr = [];
        currentLoopList.value?.forEach(obj => {
            if (loopCheckedMap.value[obj.id]) {
                arr.push(obj.id);
            }
        });
        return arr;
        // return Object.keys(loopCheckedMap.value)?.filter(id => {
        //     return loopCheckedMap.value[id];
        // });
    });

    const hasIntervention = objId => {
        if (loopIdMapInfoConfigs?.value) {
            const controls = loopIdMapInfoConfigs.value[objId]?.controlledParameterSet;

            return controls.some(info => {
                // 除手自动设定信息点之外的有干预时间的
                if (info.infoCode === 'manualAutoSet') {
                    return false;
                }
                const infoData = getIotData(objId, info.infoCode);

                return !!infoData?.additionalMapValue?.recoveryDateTime;
            });
        }
        return false;
    };

    const checkedInfoList = computed(() => {
        const codeMap = { manualAutoStatus: [], equipSwitchSet: [], intervention: [] };
        loopCheckedIds.value?.forEach(id => {
            const manualInfo = getIotData(id, 'manualAutoStatus');
            const equipSwitchSetInfo = getIotData(id, 'equipSwitchSet');
            if (manualInfo) {
                codeMap.manualAutoStatus.push(id);
            }
            if (equipSwitchSetInfo) {
                codeMap.equipSwitchSet.push(id);
            }
            if (hasIntervention(id)) {
                codeMap.intervention.push(id);
            }
        });
        return codeMap;
    });

    const loadModuleInfoList = async objectIds => {
        // console.log('objectIds: ', objectIds);
        fetchAbortController?.abort();
        if (objectIds?.length > 0) {
            fetchAbortController = new AbortController();
            const params = {
                templateType: DETAIL,
                runningMonitorType: RUNNING_MONITOR_TYPE,
                objectIds,
                filterGroups: [
                    {
                        groupCode: 'equipStatus'
                    }
                ]
            };
            try {
                const { code, data } = await loadDynaDataWithIotHandling(params, listInfoCodeConfigsByObjectIdCommon, fetchAbortController?.signal);
                if (code === SUCCESSCODE && data?.length > 0) {
                    if (commonDrawerRoot?.props.isSubscriptOnDemand) {
                        const { classCodeIds } = iterateObjct4InstanceInfo(data);
                        commonDrawerRoot.setClass2Ids(props.selectObj?.id, classCodeIds);
                        writeDataToResponsiveDock(data);
                    }

                    data.forEach(obj => {
                        let equipStatusCodes = null;
                        obj.relInfoCodeGroupConfigs?.forEach(g => {
                            if (g.groupCode === 'equipStatus') {
                                equipStatusCodes = g.relInfoCodeConfigs?.map(info => info.infoCode);
                            }
                        });
                        moduleStatusMap.value[obj.id] = equipStatusCodes;
                    });
                }
            } catch (e) {
                console.log('e: ', e);
            }
        }
    };
    const clearCheck = () => {
        loopCheckedMap.value = {};
    };

    watch(loopCheckedIds, () => {
        const hasChecked = loopCheckedIds.value?.length > 0;
        showToolPanel.value = hasChecked;
    });
    watch(
        () => objModuleList.value,
        () => {
            loadModuleInfoList(objModuleList.value?.map(obj => obj.id));
        },
        { immediate: true }
    );
    watch(
        () => objDisabledInfo.value,
        () => {
            Object.entries(objDisabledInfo.value).forEach(([loopId, info]) => {
                if (!info.value) {
                    loopCheckedMap.value[loopId] = false;
                }
            });
        }
    );
    watch(
        () => props.selectObj?.id,
        () => {
            reset();
        }
    );

    const onTypeSelect = (ids, item) => {
        selTypeItem.value = item;
    };

    const clickLampCheckBox = lamp => {
        const newCheckVal = lampsCheckedMap.value[lamp.id] === 'uncheck' ? 'checked' : 'uncheck';
        lamp.children?.forEach(obj => {
            // 有权限才勾选
            loopCheckedMap.value[obj.id] = objDisabledInfo.value[obj.id]?.value && newCheckVal === 'checked';
        });
    };
    const clickLoopCheckBox = loop => {
        loopCheckedMap.value[loop.id] = objDisabledInfo.value[loop.id]?.value && loop.checked !== 'checked';
    };
    const checkAll = curChecked => {
        if (curChecked === 'checked' || curChecked === 'notNull') {
            loopCheckedMap.value = {};
        } else {
            const idMap = {};
            currentLoopList.value?.forEach(obj => {
                // console.log('obj: ', obj);
                // 有权限才勾选
                if (objDisabledInfo.value[obj.id]?.value) {
                    idMap[obj.id] = true;
                }
            });
            loopCheckedMap.value = idMap;
        }
    };

    const toggleInfoAll = val => {
        extpandInfoAll.value = val;
        const idMap = {};
        targetLoopList.value?.forEach(obj => {
            idMap[obj.id] = val;
        });
        loopOpenedMap.value = idMap;
    };

    return {
        targetLoopList,
        allCheckedValue,
        lampsCheckedMap,
        lampLoopList,
        objModuleList,
        loopCheckedMap,
        loopOpenedMap,
        showToolPanel,
        loopCheckedIds,
        statistcalList,
        cascaderOptions,
        loopTypesSel,
        selTypeItem,
        checkedInfoList,
        moduleStatusMap,
        extpandInfoAll,
        objDisabledInfo,
        allDisabledInfo,
        clearCheck,
        onTypeSelect,
        clickLampCheckBox,
        clickLoopCheckBox,
        checkAll,
        toggleInfoAll
    };
};
