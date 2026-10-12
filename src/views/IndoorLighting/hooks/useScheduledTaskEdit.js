import { treeBuildingFloorDashboardSpaces } from '@/apis/public';
import { getSpaceFuncTypeCircuitController, saveOrUpdateTaskConfig } from '@/apis/IndoorLighting';
import { RUNNING_MONITOR_TYPE, SETTING_MODE, INSTANCE_TYPE } from '../variables';
import { getDayjsTz, SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { rangeIsIntersect } from '@/utils/tools';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import useMessage from '@/components/hooks/useMessage';
import { $Message } from 'meri-plus';
import i18n from '@/localization';
import { dayjsIsAfter, dayjsIsBefore } from '@/utils/dayjsTools';
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
export const currentBuildingTreeKey = Symbol('currentBuildingTreeKey');
export const queryLoopsBySpacesKey = Symbol('queryLoopsBySpacesKey');
export const loopConfigDataKey = Symbol('loopConfigDataKey');
export const loopIdMapSettingModeKey = Symbol('loopIdMapSettingModeKey');
export const baseFuncTypeCircuitKey = Symbol('baseFuncTypeCircuitKey');
export const loadingCircuitKey = Symbol('loadingCircuitKey');
export const configLoopDataKey = Symbol('configLoopDataKey');
export const selSpaceIdsKey = Symbol('selSpaceIdsKey');
export const spaceDefaultSelectedDataKey = Symbol('spaceDefaultSelectedDataKey');
export default (props, showModal, emits) => {
    // 空值提示文本
    const EMPTYTEXT = i18n.global.t('meos_control_web.input_required_check_error_4');
    const TIME_MODES = {
        FIXED_TIME_SCOPE: 'fixed_time_scope',
        DAY_LOOP: 'day_loop'
    };

    const { useSuccessMessage } = useMessage();
    const showSpaceLoopConfigModal = ref(false);
    const isSaving = ref(false);
    const loadingCircuit = ref(false);
    const typeMapTree = reactive({});
    const selSpaceIds = ref();
    const loopIdMapSettingMode = ref({});
    const baseFuncTypeCircuit = ref();
    const configLoopData = ref();
    const spaceSelAndConfigModal = ref(null);
    const spaceDefaultSelectedData = ref(null);
    const curSavedRepetitionTimeSlot = ref(null);
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
        return null;
    });
    const formRef = ref(null);
    const formModel = ref({});

    const queryLoopUseCancelToken = UseCancelTokenHooks();

    const genEmptyTimeRange = () => {
        return { key: new Date().toISOString(), beginTime: '', sustainTime: '', endTime: '' };
    };
    const curEditData = ref({ timeSlot: [genEmptyTimeRange()], timeMode: 'fixed_time_scope' });

    //可选择日期
    const scopeTime = computed(() => {
        const dayjsTz = getDayjsTz();
        const bTime = dayjsTz.format('YYYY.MM.DD HH:mm'),
            eTime = dayjsTz.add(100, 'year').format('YYYY.MM.DD HH:mm');
        return `${bTime}-${eTime}`;
    });
    const isEdit = computed(() => {
        return !!props.editData?.taskId;
    });
    const endScopeTime = idx => {
        const beginTime = dayjs(curEditData.value.timeSlot[idx].beginTime);
        const bTime = beginTime.add(5, 'minute').format('YYYY.MM.DD HH:mm'),
            eTime = beginTime.add(3, 'day').format('YYYY.MM.DD HH:mm');

        return `${bTime}-${eTime}`;
    };
    const title = computed(() => {
        return props.editData?.taskId ? i18n.global.t('common.edit') : `${i18n.global.t('meos_control_web.add_new_scheduled_on_off_task')}`;
    });
    const dayLoopResultDesc = computed(() => {
        const { loopEndDate, loopStartTime, loopEndTime, loopTimeRange } = curEditData.value;
        if (!loopStartTime || !loopEndTime || !loopTimeRange) {
            return '';
        }
        const ranges = loopTimeRange.split('-');

        const startDay = dayjs(ranges[0]),
            endDay = dayjs(`${ranges[1]} 23:59:59`);
        const duration = Math.ceil(dayjs.duration(endDay.diff(startDay)).as('day') || 0);

        const dayType = loopEndDate === 'current' ? i18n.global.t('meos_control_web.today1') : i18n.global.t('meos_control_web.next_day');
        return i18n.global.t('meos_control_web.every_day_start_end_duration_days', {
            start: loopStartTime,
            dayType: dayType,
            end: loopEndTime,
            duration: duration,
            range: loopTimeRange
        });
    });

    const initData = () => {
        curEditData.value = {
            taskName: '',
            reason: '',
            loopEndDate: 'current',
            loopStartTime: '',
            loopEndTime: '',
            loopTimeRange: '',
            timeSlot: [genEmptyTimeRange()],
            timeMode: 'fixed_time_scope'
        };
    };
    const reset = () => {
        selSpaceIds.value = null;

        baseFuncTypeCircuit.value = null;
        curSavedRepetitionTimeSlot.value = null;
        showSpaceLoopConfigModal.value = false;
        loopIdMapSettingMode.value = {};
        spaceSelAndConfigModal.value?.reset();
        initData();
    };
    const translateEditDataToForm = () => {
        const { beginTime, endTime, configData, configObject, reason, taskName } = props.editData;
        const bTime = dayjs(beginTime);
        const eTime = dayjs(endTime);
        const sustainTime = eTime.diff(bTime, 'minute');

        curEditData.value = {
            taskName,
            reason,
            timeSlot: [{ beginTime: bTime.format('YYYY.MM.DD HH:mm'), endTime: eTime.format('YYYY.MM.DD HH:mm'), sustainTime }],
            timeMode: 'fixed_time_scope'
        };
        const idMapSettingMode = {};
        configLoopData.value = configData?.map(func => {
            const funcKey = `func-${func.funcType}`;
            func.children = func.lampFuncTypeList?.map(lamp => {
                lamp.children = lamp.circuitList?.map(loop => {
                    idMapSettingMode[loop.id] = loop.settingMode ?? 'CLOSE';
                    return { ...loop, name: loop.localName ?? '--', status: loop.settingMode ?? 'CLOSE' };
                });
                const opentCount = lamp.children?.filter(loop => loop.status === SETTING_MODE.OPEN)?.length;

                const status = opentCount === 0 ? SETTING_MODE.ALL_CLOSE : opentCount === lamp.children.length ? SETTING_MODE.ALL_OPEN : SETTING_MODE.PART_OPEN;
                return { ...lamp, name: lamp.lampFuncTypeName ?? '--', id: `${funcKey}-${lamp.lampFuncType}`, status };
            });
            const allOpenCount = func.children?.filter(lamp => lamp.status === SETTING_MODE.ALL_OPEN)?.length;
            const allCLoseCount = func.children?.filter(lamp => lamp.status === SETTING_MODE.ALL_CLOSE)?.length;

            const status =
                allCLoseCount === func.children?.length ? SETTING_MODE.ALL_CLOSE : allOpenCount === func.children?.length ? SETTING_MODE.ALL_OPEN : SETTING_MODE.PART_OPEN;
            return { ...func, open: true, name: func.funcTypeName ?? '--', id: funcKey, status };
        });
        loopIdMapSettingMode.value = idMapSettingMode;
        selSpaceIds.value = configObject?.instanceIds;
        spaceDefaultSelectedData.value = configObject?.instanceIds;
    };
    const closeModal = () => {
        nextTick(() => {
            showModal.value = false;
        });
    };

    // 把每日循环，拆为区间列表
    const getTimeRangeByDayLoop = () => {
        const arr = [];
        const { loopEndDate, loopStartTime, loopEndTime, loopTimeRange } = curEditData.value;
        if (!loopTimeRange || !loopStartTime || !loopEndTime) {
            return arr;
        }
        const ranges = loopTimeRange.split('-');
        let endDate = dayjs(`${ranges[1]} 23:59:00`),
            curStartTime = dayjs(`${ranges[0]} ${loopStartTime}`),
            curEndTime = dayjs(`${ranges[0]} ${loopEndTime}`);
        // 如果开始时间早于当前时刻，+一天
        if (dayjsIsBefore(curStartTime, getDayjsTz())) {
            curStartTime = curStartTime.add(1, 'day');
            curEndTime = curEndTime.add(1, 'day');
        }
        if (loopEndDate === 'next') {
            curEndTime = curEndTime.add(1, 'day');
            endDate = endDate.add(1, 'day');
        }
        while (dayjsIsBefore(curEndTime, endDate)) {
            arr.push({ beginTime: dayjs(curStartTime).format('YYYY-MM-DD HH:mm:ss'), endTime: dayjs(curEndTime).format('YYYY-MM-DD HH:mm:ss') });
            curStartTime = curStartTime.add(1, 'day');
            curEndTime = curEndTime.add(1, 'day');
        }
        return arr;
    };

    const validateValid = (item, idx, callback, text = i18n.global.t('meos_control_web.past_connot_sel')) => {
        if (!item.beginTime) {
            callback();
            return;
        }
        const curBeginTime = dayjs(item.beginTime);
        // 开始时间早于当前时间
        if (dayjsIsAfter(getDayjsTz(), curBeginTime)) {
            callback(new Error(text));
        } else {
            callback();
        }
    };

    const validateRepeat = (item, idx, callback, text = i18n.global.t('meos_control_web.duplicates_existing_time')) => {
        if (!item.beginTime || !item.endTime) {
            callback();
            return;
        }
        let hasRepeat = curEditData.value?.timeSlot?.some((v, i) => {
            if (i !== idx && v.beginTime && v.endTime) {
                return rangeIsIntersect([dayjs(v.beginTime).valueOf(), dayjs(v.endTime).valueOf()], [dayjs(item.beginTime).valueOf(), dayjs(item.endTime).valueOf()]);
            }
            return false;
        });
        if (!hasRepeat && curSavedRepetitionTimeSlot.value?.length > 0) {
            hasRepeat = curSavedRepetitionTimeSlot.value.some(v => {
                if (v.beginTime && v.endTime) {
                    return rangeIsIntersect([dayjs(v.beginTime).valueOf(), dayjs(v.endTime).valueOf()], [dayjs(item.beginTime).valueOf(), dayjs(item.endTime).valueOf()]);
                }
                return false;
            });
        }
        if (hasRepeat) {
            callback(new Error(text));
        } else {
            callback();
        }
    };
    const validateDayLoopRepeat = (callback, text = i18n.global.t('meos_control_web.duplicates_existing_time')) => {
        try {
            const timeRanges = getTimeRangeByDayLoop();
            if (!timeRanges?.length) {
                callback();
                return;
            }
            let hasRepeat = false;
            if (!hasRepeat && curSavedRepetitionTimeSlot.value?.length > 0) {
                for (let i = 0; i < timeRanges.length; i++) {
                    const item = timeRanges[i];
                    hasRepeat = curSavedRepetitionTimeSlot.value.some(v => {
                        if (v.beginTime && v.endTime) {
                            return rangeIsIntersect([dayjs(v.beginTime).valueOf(), dayjs(v.endTime).valueOf()], [dayjs(item.beginTime).valueOf(), dayjs(item.endTime).valueOf()]);
                        }
                        return false;
                    });
                    if (hasRepeat) {
                        break;
                    }
                }
            }
            if (hasRepeat) {
                callback(new Error(text));
            } else {
                callback();
            }
        } catch (e) {
            console.log('err: ', e);
        }
    };
    const IN_RANGE_ERR_TEXT = i18n.global.t('meos_control_web.past_connot_sel');
    const validateDayLoopInRange = (val, callback, isEnd) => {
        try {
            const { loopEndDate, loopTimeRange } = curEditData.value;
            if (!loopTimeRange || !val) {
                callback();
                return;
            }
            const startDay = loopTimeRange.split('-')[0];
            // 选择的日期区间包含今天
            if (startDay === getDayjsTz().format('YYYY.MM.DD')) {
                // 开始时间早于当前时间
                if (!isEnd && dayjsIsAfter(getDayjsTz(), dayjs(`${startDay} ${val}`))) {
                    callback(new Error(IN_RANGE_ERR_TEXT));
                }
                // 结束时间早于当前时间
                if (isEnd && loopEndDate === 'current') {
                    if (dayjsIsAfter(getDayjsTz(), dayjs(`${startDay} ${val}`))) {
                        callback(new Error(IN_RANGE_ERR_TEXT));
                    }
                }
            }
            callback();
        } catch (e) {
            console.log('e: ', e);
        }
    };
    const validateEndAfterStart = (curTimeType, callback) => {
        // console.log('loopTimeScope: ', curTimeType);
        try {
            const currentDate = getDayjsTz().format('YYYY-MM-DD');
            // 选择了日期范围，且包含今天的

            if (curEditData.value.loopStartTime && curEditData.value.loopEndTime) {
                const startTime = dayjs(currentDate + ' ' + curEditData.value.loopStartTime);
                const endTime = dayjs(currentDate + ' ' + curEditData.value.loopEndTime);
                if (curEditData.value.loopEndDate === 'current') {
                    if (dayjsIsAfter(startTime, endTime)) {
                        callback(new Error(i18n.global.t('meos_control_web.cannot_earlier_than_start')));
                        return;
                    }
                }
            } else {
                callback(new Error(EMPTYTEXT));
                return;
            }
            callback();
            // console.log('curEditData.value.loopStartTime: ', curEditData.value.loopStartTime);
        } catch (e) {
            console.log('e: ', e);
        }
    };
    const validRequired = (val, callback) => {
        if (val === undefined || val === null || val === '') {
            callback(new Error(EMPTYTEXT));
        } else {
            callback();
        }
    };

    const triggerValidTimeRange = index => {
        formRef.value?.validateField(`beginTime-${index}`);
        formRef.value?.validateField(`sustainTime-${index}`);
    };
    const onLoopTimeRangeChange = val => {
        console.log('onLoopTimeRangeChange--val: ', val);
    };
    const handleLoopTimeRangeChange = () => {
        console.log('handleLoopTimeRangeChange: ', curEditData.value.loopTimeRange);
    };
    const loopTimeScope = curTimeType => {
        // console.log('loopTimeScope: ', curTimeType);
        try {
            const currentDate = getDayjsTz().format('YYYY-MM-DD');
            // 选择了日期范围，且包含今天的
            let startHM = '';
            if (curEditData.value.loopTimeRange) {
                const startDay = curEditData.value.loopTimeRange.split('-')[0];
                if (startDay === getDayjsTz().format('YYYY.MM.DD')) {
                    startHM = getDayjsTz().add(5, 'minute').format('HH:mm');
                }
            }
            // console.log('curEditData.value.loopStartTime: ', curEditData.value.loopStartTime);
            if (curTimeType === 'beginTime') {
                if (curEditData.value.loopEndTime) {
                    if (curEditData.value.loopEndDate === 'current') {
                        if (curEditData.value.loopEndTime) {
                            const endTime = dayjs(currentDate + ' ' + curEditData.value.loopEndTime)
                                .subtract(5, 'minute')
                                .format('HH:mm');
                            return `${startHM ? startHM : '00:00'}-${endTime}`;
                        } else {
                            return `${startHM ? startHM : '00:00'}-23:59`;
                        }
                    } else {
                        if (curEditData.value.loopEndTime) {
                            const endTime = dayjs(currentDate + ' ' + curEditData.value.loopEndTime);
                            const endTimeHM = endTime.add(5, 'minute').format('HH:mm');
                            if (startHM && dayjsIsBefore(endTime, getDayjsTz())) {
                                return `${endTimeHM}-23:59`;
                            } else {
                                return `${startHM ? startHM : endTimeHM ?? '00:00'}-23:59`;
                            }
                        } else {
                            return `${startHM ? startHM : '00:00'}-23:59`;
                        }
                    }
                } else {
                    return `${startHM ? startHM : '00:00'}-23:59`;
                }
            } else {
                if (curEditData.value.loopStartTime) {
                    if (curEditData.value.loopEndDate === 'current') {
                        const startTime = dayjs(currentDate + ' ' + curEditData.value.loopStartTime)
                            .add(5, 'minute')
                            .format('HH:mm');

                        return `${startTime}-23:59`;
                    } else {
                        const after24HoursStartTime = dayjs(currentDate + ' ' + curEditData.value.loopStartTime)
                            .add(24, 'hour')
                            .format('HH:mm');
                        return `00:00-${after24HoursStartTime}`;
                    }
                } else {
                    return `${startHM ? startHM : '00:00'}-23:59`;
                }
            }
        } catch (e) {
            console.log('e: ', e);
        }
        // return curTimeScope;
    };
    const loopTimeRangeScope = () => {
        const bTime = getDayjsTz().format('YYYY.MM.DD'),
            eTime = getDayjsTz().add(100, 'year').format('YYYY.MM.DD');
        return `${bTime}-${eTime}`;
    };
    const calcSustainTime = (item, index) => {
        // console.log('calcSustainTime: ', item);
        if (item.beginTime && item.endTime) {
            item.sustainTime = dayjs(item.endTime).diff(dayjs(item.beginTime), 'minute');
            triggerValidTimeRange(index);
        }
    };
    const calcEndTime = (item, index) => {
        // console.log('calcEndTime: ', item);
        if (item) {
            if (item.beginTime && item.sustainTime > 0 && item.sustainTime % 5 === 0) {
                item.endTime = dayjs(item.beginTime).add(item.sustainTime, 'minute')?.format('YYYY.MM.DD HH:mm');
                triggerValidTimeRange(index);
            }
        }
    };
    const queryBuildingFloorSpace = async runningMonitorSecondType => {
        const params = { runningMonitorType: RUNNING_MONITOR_TYPE, runningMonitorSecondType: runningMonitorSecondType };
        const { code, data: buildings } = await treeBuildingFloorDashboardSpaces(params);
        if (code === SUCCESSCODE) {
            const t = translateToTree(buildings);
            if (t) {
                typeMapTree[runningMonitorSecondType] = t;
            }
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
            loadingCircuit.value = false;
        } catch (e) {
            loadingCircuit.value = false;
        }
    };

    const addTimeRange = () => {
        curEditData.value?.timeSlot?.push(genEmptyTimeRange());
    };
    const delTimeRange = idx => {
        curEditData.value?.timeSlot?.splice(idx, 1);
    };
    const openLoopConfig = () => {
        showSpaceLoopConfigModal.value = true;
        if (selSpaceIds.value?.length) {
            spaceDefaultSelectedData.value = selSpaceIds.value;
        }
    };

    const getSaveData = () => {
        const { reason, taskName, timeSlot, timeMode } = curEditData.value;
        const d = {
            reason,
            taskName,
            runningMonitorType: RUNNING_MONITOR_TYPE,
            runningMonitorSecondType: props.runningMonitorSecondType,
            configObject: {
                instanceIds: selSpaceIds.value,
                instanceType: 'SPACE'
            },
            timeSlot: timeSlot?.map(obj => {
                return { beginTime: dayjs(obj.beginTime).format('YYYY-MM-DD HH:mm:ss'), endTime: dayjs(obj.endTime).format('YYYY-MM-DD HH:mm:ss') };
            }),
            configData: Object.keys(loopIdMapSettingMode.value).map(id => ({ circuitId: id, settingMode: loopIdMapSettingMode.value[id] }))
        };
        if (timeMode === TIME_MODES.DAY_LOOP) {
            d.timeSlot = getTimeRangeByDayLoop();
        }
        if (props.editData) {
            d.taskId = props.editData.taskId;
        }
        return d;
    };
    const clickSave = async () => {
        if (isSaving.value) {
            return;
        }
        // formRef.value.clearValidate();
        await nextTick();

        formRef.value.validate((valid, errors) => {
            console.log('errors: ', errors);
            if (valid) {
                isSaving.value = true;
                const dataForSave = getSaveData();
                console.log('dataForSave: ', dataForSave);
                saveOrUpdateTaskConfig(dataForSave)
                    .then(res => {
                        if (res) {
                            const { code, data } = res;
                            if (code === SUCCESSCODE) {
                                if (data?.errorCode) {
                                    if (data.errorCode === 'TIME_REPETITION_ERROR') {
                                        curSavedRepetitionTimeSlot.value = data.repetitionTimeSlot;
                                        formRef.value.validate(() => {
                                            curSavedRepetitionTimeSlot.value = [];
                                        });
                                        $Message.error({
                                            title: i18n.global.t('meos_control_web.time_conflicts_with_existing_schedule')
                                        });
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
        () => showModal.value,
        async () => {
            if (props.editData) {
                if (showModal.value) {
                    translateEditDataToForm();
                    if (selSpaceIds.value?.length > 0) {
                        await queryLoopsBySpaces(selSpaceIds.value);
                    }
                }
            } else {
                reset();
                if (showModal.value) {
                    if (props.instanceType === INSTANCE_TYPE.SPACE) {
                        selSpaceIds.value = [props.instanceId];
                        await queryLoopsBySpaces(selSpaceIds.value);
                    }
                }
            }
        },
        { immediate: true }
    );
    watch(
        () => curEditData.value.loopEndDate,
        () => {
            if (curEditData.value.loopStartTime && curEditData.value.loopEndTime) {
                const currentDate = getDayjsTz().format('YYYY-MM-DD');
                const startTime = dayjs(currentDate + ' ' + curEditData.value.loopStartTime);
                const endTime = dayjs(currentDate + ' ' + curEditData.value.loopEndTime);
                if (curEditData.value.loopEndDate === 'next') {
                    if (dayjsIsBefore(startTime, endTime)) {
                        curEditData.value.loopEndTime = '';
                        return;
                    }
                } else {
                    if (dayjsIsAfter(startTime, endTime)) {
                        curEditData.value.loopEndTime = '';
                        return;
                    }
                }
            }
        }
    );

    provide(currentBuildingTreeKey, currentBuildingTree);
    provide(queryLoopsBySpacesKey, queryLoopsBySpaces);

    provide(loopIdMapSettingModeKey, loopIdMapSettingMode);
    provide(baseFuncTypeCircuitKey, baseFuncTypeCircuit);
    provide(loadingCircuitKey, loadingCircuit);
    provide(configLoopDataKey, configLoopData);
    provide(selSpaceIdsKey, selSpaceIds);
    provide(spaceDefaultSelectedDataKey, spaceDefaultSelectedData);
    return {
        EMPTYTEXT,
        TIME_MODES,
        selSpaceIds,
        currentBuildingTree,
        scopeTime,
        showSpaceLoopConfigModal,
        formRef,
        title,
        formModel,
        curEditData,
        isSaving,
        loopIdMapSettingMode,
        configLoopData,
        isEdit,
        spaceSelAndConfigModal,
        dayLoopResultDesc,
        validateEndAfterStart,
        validateDayLoopInRange,
        validateDayLoopRepeat,
        openLoopConfig,
        endScopeTime,
        closeModal,
        validateValid,
        validateRepeat,
        validRequired,
        calcSustainTime,
        calcEndTime,
        addTimeRange,
        delTimeRange,
        queryLoopsBySpaces,
        clickSave,
        loopTimeScope,
        onLoopTimeRangeChange,
        loopTimeRangeScope,
        handleLoopTimeRangeChange
    };
};
