import { TEMP_CTL_EDIT_SELECT_TYPE, INSTANCE_TYPE, RUNNING_MONITOR_TYPE, SETTING_MODE } from '@/views/IndoorLighting/variables';
import { getSpaceFuncTypeCircuitController, saveOrUpdateTaskConfig } from '@/apis/IndoorLighting';

import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import useMessage from '@/components/hooks/useMessage';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { treeBuildingFloorDashboardSpaces } from '@/apis/public';
import { $Message } from 'meri-plus';
import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';

export const loopIdMapSettingModeKey = Symbol('loopIdMapSettingModeKey');
export const baseFuncTypeCircuitKey = Symbol('baseFuncTypeCircuitKey');
export const loadingCircuitKey = Symbol('loadingCircuitKey');
export const configLoopDataKey = Symbol('configLoopDataKey');
export const curEditDataKey = Symbol('curEditDataDataKey');
export const formRefKey = Symbol('formRefKey');
export const onlySelForSpaceKey = Symbol('onlySelForSpaceKey');
export const onlySelForGroupKey = Symbol('onlySelForGroupKey');
export const circuitGroupLoadingKey = Symbol('circuitGroupLoadingKey');
export const isEditTypeKey = Symbol('isEditTypeKey');

const translateToTree = buildings => {
    return buildings
        .map(building => {
            const newBuilding = { id: building.id, name: building.localName, objType: OBJ_TYPE.BUILDING };
            newBuilding.children = building.floors
                ?.map(floor => {
                    const newFloor = { id: floor.id, name: floor.localName, objType: OBJ_TYPE.FLOOR, floorSequenceId: floor.floorSequenceId, buildingId: floor.buildingId };
                    newFloor.children = floor.spaces?.map(space => {
                        return { ...space, name: space.localName, objType: OBJ_TYPE.SPACE };
                    });
                    return newFloor;
                })
                .filter(floor => floor.children?.length > 0)
                .sort((a, b) => b.floorSequenceId - a.floorSequenceId);
            return newBuilding;
        })
        .filter(building => building.children?.length > 0);
};

export default (props, showModal, emits) => {
    const baseEditRef = ref(null);
    const loopConfigTableRef = ref(null);
    const circuitGroupingSelRef = ref(null);
    const formRef = ref(null);

    const onlySelForSpace = ref('uncheck'),
        onlySelForGroup = ref('uncheck');
    const curStepIndex = ref(1);
    const settingMode = ref(SETTING_MODE.OPEN);
    const loopIdMapSettingMode = ref({});
    const curSelSpaceIds = ref([]);
    const curSelType = ref(TEMP_CTL_EDIT_SELECT_TYPE.SPACE);
    const loadingCircuit = ref(false);
    const isSaving = ref(false);
    const baseFuncTypeCircuit = ref();
    const spaceDefaultSelectedData = ref([]);
    const configLoopData = ref();
    const curEditData = ref({});
    const repeatErrShow = ref(false);
    const repeatErrData = ref([]);

    const typeMapTree = reactive({});
    const queryLoopUseCancelToken = UseCancelTokenHooks();
    const saveCancelToken = UseCancelTokenHooks();
    const { useSuccessMessage } = useMessage();

    // 空间加载
    const spacesLoading = ref(false);
    const circuitGroupLoading = ref(false);

    // 加载动画相关
    const {
        loading: step1Loading,
        openLoading: step1OpenLoading,
        closeLoading: step1CloseLoading
    } = useLoading(
        'indoor-temp-ctl-edit-content',
        '#FFFFFF',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );

    const initData = () => {
        curEditData.value = {
            taskName: '',

            configObject: {},
            configData: {}
            // timeSlot: [genEmptyTimeRange()],
        };
    };
    const reset = () => {
        curSelSpaceIds.value = [];
        repeatErrData.value = [];
        curSelType.value = TEMP_CTL_EDIT_SELECT_TYPE.SPACE;
        settingMode.value = SETTING_MODE.OPEN;
        curStepIndex.value = 1;
        onlySelForSpace.value = 'uncheck';
        onlySelForGroup.value = 'uncheck';
        baseFuncTypeCircuit.value = null;
        isSaving.value = false;
        loadingCircuit.value = false;
        spacesLoading.value = false;
        circuitGroupLoading.value = false;
        repeatErrShow.value = false;
        spaceDefaultSelectedData.value = [];
        configLoopData.value = null;
        // curSavedRepetitionTimeSlot.value = null;
        // showSpaceLoopConfigModal.value = false;
        loopIdMapSettingMode.value = {};
        nextTick(() => {
            loopConfigTableRef.value?.reset();
            circuitGroupingSelRef.value?.reset();
            baseEditRef.value?.reset();
        });

        initData();
    };

    const queryBuildingFloorSpace = async runningMonitorSecondType => {
        await nextTick();
        spacesLoading.value = true;

        try {
            const params = { runningMonitorType: RUNNING_MONITOR_TYPE, runningMonitorSecondType: runningMonitorSecondType };
            const { code, data: buildings } = await treeBuildingFloorDashboardSpaces(params);
            if (code === SUCCESSCODE) {
                const t = translateToTree(buildings);
                if (t) {
                    typeMapTree[runningMonitorSecondType] = t;
                }
            }
        } catch (e) {
            console.log(e);
        } finally {
            spacesLoading.value = false;
        }
    };
    const queryLoopsBySpaces = async spaceIds => {
        if (!spaceIds?.length || !props.runningMonitorSecondType) {
            return;
        }
        loadingCircuit.value = true;
        queryLoopUseCancelToken.cancelQuest();
        try {
            const params = { spaceIds, runningMonitorSecondType: props.runningMonitorSecondType };
            const { code, data } = await getSpaceFuncTypeCircuitController(params, { cancelToken: queryLoopUseCancelToken.cancelToken() });
            if (code === SUCCESSCODE) {
                baseFuncTypeCircuit.value = data;
            }
        } catch (e) {
            console.log('e: ', e);
        } finally {
            loadingCircuit.value = false;
        }
    };

    const currentBuildingTree = computed(() => {
        // console.log('props.runningMonitorSecondType: ', props.runningMonitorSecondType);
        if (props.runningMonitorSecondType) {
            const buildings = typeMapTree[props.runningMonitorSecondType];
            if (props.instanceType === INSTANCE_TYPE.FLOOR) {
                return buildings
                    ?.map(b => {
                        const newBuilding = { ...b };
                        newBuilding.children = b.children?.filter(f => f.id === props.instanceId);
                        return newBuilding.children?.length > 0 ? newBuilding : null;
                    })
                    .filter(Boolean);
            }
            return buildings;
        }
        return [];
    });

    const isSpaceSel = computed(() => curSelType.value === TEMP_CTL_EDIT_SELECT_TYPE.SPACE);
    const isEditType = computed(() => !!props.editData);

    const closeModal = () => {
        nextTick(() => {
            showModal.value = false;
        });
    };
    const getSaveData = () => {
        const configObject = {
            instanceType: isSpaceSel.value ? INSTANCE_TYPE.SPACE : 'CIRCUIT_GROUP'
        };

        if (isSpaceSel.value) {
            configObject.instanceIds = curSelSpaceIds.value;
        } else {
            // 选择的回路编组ID
            configObject.instanceIds = circuitGroupingSelRef.value.selGroupInfo?.selectedCircuitGroupIds ?? [];
            if (!configObject.instanceIds?.length && isEditType.value) {
                configObject.instanceIds = props.editData?.configObject?.instanceIds ?? [];
            }
            if (!configObject.instanceIds?.length) {
                return;
            }
        }
        const { configData, timeSlot } = baseEditRef.value?.collectEditData() ?? {};
        if (isEditType.value) {
            configData.belong = props.editData?.configData?.belong;
        } else {
            configData.belong = {
                instanceType: props.instanceType,
                instanceId: props.instanceId
            };
        }
        configData.config = { settingMode: settingMode.value };
        if (isEditType.value) {
            if (curEditData.value.configData?.executeTimeRanges) {
                configData.executeTimeRanges = curEditData.value.configData?.executeTimeRanges;
            }
        }

        if (isSpaceSel.value) {
            let circuitIds = loopConfigTableRef.value?.selectedCircuitsInfo?.circuitIds ?? [];

            if (!circuitIds?.length && isEditType.value) {
                circuitIds = props.editData?.configData?.config?.circuitIds ?? [];
            }
            configData.config.circuitIds = circuitIds;
        }
        const d = {
            taskName: curEditData.value.taskName,
            runningMonitorType: RUNNING_MONITOR_TYPE,
            runningMonitorSecondType: props.runningMonitorSecondType,
            configObject,
            timeSlot,
            configData
        };
        if (curEditData.value.taskId) {
            d.taskId = curEditData.value.taskId;
        }
        return d;
    };

    const clickSave = async () => {
        if (isSaving.value) {
            return;
        }
        repeatErrShow.value = false;
        // formRef.value.clearValidate();
        await nextTick();

        formRef.value.validate((valid, errors) => {
            console.log('errors: ', errors);
            if (valid) {
                isSaving.value = true;
                const dataForSave = getSaveData();
                console.log('dataForSave: ', dataForSave);
                // return;
                saveOrUpdateTaskConfig(dataForSave, { cancelToken: saveCancelToken.cancelToken() })
                    .then(res => {
                        if (res) {
                            const { code, data } = res;
                            if (code === SUCCESSCODE) {
                                if (data?.errorCode) {
                                    if (data.errorCode === 'TIME_REPETITION_ERROR') {
                                        repeatErrShow.value = true;
                                        repeatErrData.value = data.lightingRepetitions;
                                    }
                                } else {
                                    useSuccessMessage(i18n.global.t('common.save_success'));
                                    closeModal();
                                    emits('saveSuccess');
                                }
                            } else {
                                $Message.error({
                                    title: i18n.global.t('common.save_fail')
                                });
                            }
                        }
                    })
                    .finally(() => {
                        isSaving.value = false;
                    });
            } else if (errors) {
                // 取校验报错的第一个，弹message

                let firstErr = [errors.name];
                Object.keys(errors)?.forEach(k => {
                    if (k !== 'name' && k !== 'switchSet') {
                        firstErr.push(errors[k]);
                    }
                });
                firstErr.push(errors.switchSet);
                firstErr = firstErr.filter(Boolean);
                if (firstErr?.length > 0) {
                    const errItem = firstErr[0];
                    if (errItem?.length > 0 && errItem[0].message) {
                        $Message.error({
                            title: errItem[0].message
                        });
                    }
                }
            }
        });
    };
    // 应用编辑数据到视图
    const applyEditDataToView = editData => {
        if (editData) {
            const { taskName, configObject, taskId, configData } = editData;
            initData();
            curEditData.value.taskName = taskName;
            curEditData.value.taskId = taskId;
            curEditData.value.configData = configData;
            settingMode.value = configData.config.settingMode;
            if (configObject.instanceType === INSTANCE_TYPE.SPACE) {
                curSelType.value = TEMP_CTL_EDIT_SELECT_TYPE.SPACE;
                curSelSpaceIds.value = configObject.instanceIds;
                spaceDefaultSelectedData.value = configObject.instanceIds;
                queryLoopsBySpaces(curSelSpaceIds.value);
                loopConfigTableRef.value?.setSelects(configData.config.circuitIds);
                curStepIndex.value = 3;
            } else {
                curSelType.value = TEMP_CTL_EDIT_SELECT_TYPE.CIRCUIT_GROUPING;
                circuitGroupingSelRef.value?.setSelects(configObject.instanceIds);
                curStepIndex.value = 2;
            }
            baseEditRef.value?.setEditData(editData);
        }
    };

    watch(
        () => showModal.value,
        () => {
            // console.log('props.editData: ', props.editData);
            if (props.editData) {
                if (showModal.value) {
                    nextTick(() => {
                        applyEditDataToView(props.editData);
                    });
                }
            }
            if (!showModal.value) {
                saveCancelToken.cancelQuest();
                reset();
            }
        },
        { immediate: true }
    );
    watch(
        () => props.runningMonitorSecondType,
        () => {
            // console.log('props.runningMonitorSecondType: ', props.runningMonitorSecondType);
            if (props.runningMonitorSecondType) {
                if (!typeMapTree[props.runningMonitorSecondType]) {
                    queryBuildingFloorSpace(props.runningMonitorSecondType);
                }
            }
        },
        { immediate: true }
    );

    watch(
        [spacesLoading, circuitGroupLoading, isSpaceSel, curStepIndex],
        () => {
            const isLoading = isSpaceSel.value ? spacesLoading.value : circuitGroupLoading.value;

            if (isLoading && curStepIndex.value === 1) {
                step1OpenLoading();
            } else {
                step1CloseLoading();
            }
        },
        {
            flush: 'sync'
        }
    );

    provide(loadingCircuitKey, loadingCircuit);

    provide(loopIdMapSettingModeKey, loopIdMapSettingMode);
    provide(baseFuncTypeCircuitKey, baseFuncTypeCircuit);
    provide(configLoopDataKey, configLoopData);
    provide(curEditDataKey, curEditData);
    provide(formRefKey, formRef);
    provide(onlySelForSpaceKey, onlySelForSpace);
    provide(onlySelForGroupKey, onlySelForGroup);
    provide(circuitGroupLoadingKey, circuitGroupLoading);
    provide(isEditTypeKey, isEditType);

    return {
        curSelSpaceIds,
        curSelType,
        circuitGroupingSelRef,
        spaceDefaultSelectedData,
        currentBuildingTree,
        baseEditRef,
        loopConfigTableRef,
        curStepIndex,
        isSpaceSel,
        formRef,
        isSaving,
        step1Loading,
        settingMode,
        onlySelForSpace,
        onlySelForGroup,
        repeatErrShow,
        repeatErrData,
        queryLoopsBySpaces,
        clickSave,
        closeModal
    };
};
