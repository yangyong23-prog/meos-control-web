import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import useLoading from '@/hooks/useLoading';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsBefore } from '@/utils/dayjsTools';
import { uuid } from 'yushu-js-utils';
import isToday from 'dayjs/plugin/isToday';
import { SAVE_DATA_TYPE, formatTime, WEEK_OPTIONS, WEEK_TAG_OPTIONS, EFFECT_DATE_TYPES, WORK_TAGS } from './timetableConfig';
import baseStore from '@/store/baseStore';
import { optionsUpdateStrategy, optionsEditStrategy, saveStrategy, listSpaceZoneAndPublicPumpGroup, getStrategyOfDay, getChillerAxios } from '@/apis/timetable';
import { listInstantiationDateTag } from '@/apis/calendar';

dayjs.extend(isToday);

const base = baseStore();

const formatDate = val => {
    return dayjs(val).format('YYYY-MM-DD');
};

export const strategyTimeScopeKey = Symbol('strategyTimeScopeKey');
export const timeAreaDatasKey = Symbol('timeAreaDatasKey');
export const isPastTimeFuncKey = Symbol('isPastTimeFuncKey');
export const pumpGroupChillerNumsKey = Symbol('pumpGroupChillerNumsKey');
export const chillerDataKey = Symbol('chillerDataKey'); // 冷机数据
export const codeDefineKey = Symbol('codeDefineKey'); // 代码定义
export const getFieldDefineKey = Symbol('getFieldDefineKey'); // 获取字段定义函数
export const consoleTypeKey = Symbol('consoleTypeKey'); // 获取控制类型

export const dataToStrategyRule = strategyPlan => {
    let pointRuleInfo = {};
    const objectRuleInfos = [];
    strategyPlan.pointInfos?.forEach(info => {
        pointRuleInfo = { ...pointRuleInfo, ...info };
    });
    pointRuleInfo.chillerRuleInfos = strategyPlan.pointInfos.filter(obj => obj.chillerType);
    strategyPlan.objectInfos?.forEach(info => {
        const newObj = { ...info };
        let enableCtrl = null,
            objPointRule = {};
        const chillerRuleInfos = [];
        info.pointInfos?.forEach(obj => {
            if (obj.enableCtrl) {
                // eslint-disable-next-line prefer-destructuring
                enableCtrl = obj.enableCtrl;
            }
            if (obj.chillerType) {
                chillerRuleInfos.push(obj);
            }
            objPointRule = { ...objPointRule, ...obj };
        });
        if (enableCtrl) {
            newObj.enableCtrl = enableCtrl;
        }
        objPointRule.chillerRuleInfos = chillerRuleInfos;
        newObj.pointRuleInfo = objPointRule;
        objectRuleInfos.push(newObj);
    });

    return { ...pointRuleInfo, pointRuleInfo, objectRuleInfos };
};

export default (props, showModal) => {
    const { projectId } = base;

    const { loading, openLoading, closeLoading } = useLoading(
        'timetable-editor-modal-content .left',
        '#F1F4F6',
        'ball',
        {
            width: '100px',
            height: '100px'
        },
        0
    );

    const validateDateRange = ref('');
    const baseData = ref({ objectId: '', beginDate: '', endDate: '' });
    const timeAreaDatas = ref([{ defaultOpen: true, sign: 0 }]);
    const formRef = ref();
    const strategyRule = ref({});
    const spaceZones = ref([]);
    const currentDayType = ref();
    const isSaving = ref(false);
    const extendInfo = ref({ effectDateType: EFFECT_DATE_TYPES.GENERAL.id, effectDateData: null });
    const weekEffectDateData = ref([]);
    const timeAreaRefs = ref({});
    const normalRefs = ref({});
    const pumpGroupChillerNums = ref({});

    // 复制时间表选择日期
    const dateForCopy = ref('');
    const strategyForCopeDayLoading = ref(false);
    const strategyForCopeDayData = ref(null);

    const dateTypeOptions = ref([
        { label: EFFECT_DATE_TYPES.GENERAL.name, value: EFFECT_DATE_TYPES.GENERAL.id },
        { label: EFFECT_DATE_TYPES.WEEK_TAG.name, value: EFFECT_DATE_TYPES.WEEK_TAG.id },
        { label: EFFECT_DATE_TYPES.WORK_TAG.name, value: EFFECT_DATE_TYPES.WORK_TAG.id }
    ]);

    const initQueryCancelToken = UseCancelTokenHooks();
    const initQueryStrategyOfDayToken = UseCancelTokenHooks();

    const resetData = () => {
        strategyRule.value = {};
        normalRefs.value = {};
        timeAreaRefs.value = {};
        baseData.value = { objectId: '', beginDate: '', endDate: '' };
        timeAreaDatas.value = [{ sign: 0, defaultOpen: true }];
        weekEffectDateData.value = [];
        spaceZones.value = [];
        currentDayType.value = '';
        isSaving.value = false;
        validateDateRange.value = '';
        dateForCopy.value = '';
        strategyForCopeDayLoading.value = false;
        strategyForCopeDayData.value = null;
        extendInfo.value = { effectDateType: EFFECT_DATE_TYPES.GENERAL.id, effectDateData: null };
    };

    const handleValidateDateChange = val => {
        if (val) {
            const arr = val.split('-');
            baseData.value.beginDate = arr[0];
            baseData.value.endDate = arr[1];
        } else {
            baseData.value.beginDate = '';
            baseData.value.endDate = '';
        }
    };

    const validDateContainCurDay = () => {
        if (!baseData.value.beginDate) return false;
        const bDate = dayjs(baseData.value.beginDate);
        if (!bDate) return false;
        if (bDate.isToday()) {
            if (isEdit.value) return true;
            if (extendInfo.value.effectDateType === EFFECT_DATE_TYPES.WEEK_TAG.id) {
                return weekEffectDateData.value?.some(val => val === `${bDate.day()}`);
            } else if (extendInfo.value.effectDateType === EFFECT_DATE_TYPES.WORK_TAG.id) {
                return currentDayType.value === extendInfo.value.effectDateData;
            } else {
                return true;
            }
        }
        return false;
    };

    const consoleType = computed(() => props?.consoleType);
    const isEdit = computed(() => !!props?.currentDate);
    const isAirZone = computed(() => props.consoleType === props.consoleTypes?.AIR_TERMINAL_ZONE?.id);
    const isCoolInput = computed(() => props.consoleType === props.consoleTypes?.COOL_INPUT?.id);

    const title = computed(() => {
        const consoleObj = props.consoleTypes?.[props.consoleType];
        if (isEdit.value) {
            let dayIndex = dayjs(props.currentDate).day();
            dayIndex = dayIndex ? dayIndex - 1 : 6;
            const weekDay = WEEK_OPTIONS[dayIndex]?.label;
            const objName = isAirZone.value ? spaceZones.value?.find(obj => obj.id === props.objectId)?.name : consoleObj?.name;
            return i18n.global.t('meos_control_web.name_timetable', { name: `${props.currentDate}（${weekDay}）${objName ?? ''}` });
        } else {
            return i18n.global.t('meos_control_web.create_name_timetable', { name: consoleObj?.name });
        }
    });

    const scopeTime = computed(() => {
        if (validDateContainCurDay()) {
            const curTime = getDayjsTz();
            return `${curTime.format('HH:mm')}-23:55`;
        }
        return '';
    });

    // "复制并覆盖以下配置"按钮执行
    const applyOverwriteStrategys = () => {
        if (strategyCopeValidData.value?.executeDetail) {
            const cloneCopyData = structuredClone(strategyCopeValidData.value.executeDetail);
            makeDefaultDatas({
                ...props,
                ...cloneCopyData,
                ...baseData.value,
                dataType: SAVE_DATA_TYPE.ADD_OPER
            });
        }
    };
    const strategyCopeValidData = computed(() => {
        const targetStrategy = strategyForCopeDayData.value?.find(obj => obj.objectId === baseData.value?.objectId);
        return targetStrategy;
    });
    const copyOpDesc = computed(() => {
        if (strategyForCopeDayLoading.value) {
            return i18n.global.t('meos_control_web.in_query_please_wait');
        } else if (dateForCopy.value && !strategyCopeValidData.value) {
            return i18n.global.t('meos_control_web.date_has_no_schedule_cfg');
        }
        return '';
    });
    const disableCopyDate = computed(() => {
        return props.consoleType === props.consoleTypes?.AIR_TERMINAL_ZONE?.id && !baseData.value?.objectId;
    });
    const disableCopyDateTips = computed(() => {
        return disableCopyDate.value ? i18n.global.t('meos_control_web.please_sel_timetable_obj_for_copy') : '';
    });
    // 复制并覆盖按钮本身 disabled
    const copyAndOverwriteBtnDisabled = computed(() => {
        return disableCopyDate.value || !dateForCopy.value || strategyForCopeDayLoading.value || !strategyCopeValidData.value;
    });
    // 复制并覆盖按钮，tips disabled
    const copyAndOverwriteTipsDisabled = computed(() => {
        if (disableCopyDate.value) {
            return false;
        }
        if (!dateForCopy.value && !strategyForCopeDayLoading.value) {
            return false;
        }
        return true;
    });
    const copyAndOverwriteTipsContent = computed(() => {
        if (disableCopyDate.value) {
            return i18n.global.t('meos_control_web.please_sel_timetable_obj_for_copy');
        }
        if (!dateForCopy.value && !strategyForCopeDayLoading.value) {
            return i18n.global.t('meos_control_web.please_sel_date_before_copy');
        }
        return '';
    });
    const isPastTime = time => {
        if (validDateContainCurDay()) {
            const curDate = getDayjsTz().format('YYYY-MM-DD');
            const curTime = getDayjsTz();
            const targetTime = dayjs(curDate + ' ' + time);
            return dayjsIsBefore(targetTime, curTime);
        }
        return false;
    };

    const queryWorkDayTypes = async () => {
        const today = getDayjsTz().endOf('day').format('YYYY-MM-DD');
        try {
            const res = await listInstantiationDateTag({ beginDate: today, endDate: today });
            if (res.code === SUCCESSCODE && res.data?.length) {
                let type =
                    res.data[0].calendarTags?.find(tag => {
                        const code = tag.toLocaleLowerCase();
                        return code === WORK_TAGS.WORKDAY || code === WORK_TAGS.DAYOFF;
                    }) || '';
                type = type.toLocaleLowerCase();
                currentDayType.value = type;
            }
        } catch (e) {
            console.error('Failed to fetch calendar tags:', e);
        }
    };

    const queryChillerAxios = async objectIds => {
        const promises = objectIds.map(objectId => getChillerAxios({ objectId }));
        const rsts = await Promise.allSettled(promises);
        const typeMap = {};
        rsts.forEach(rst => {
            if (rst?.status === 'fulfilled') {
                Object.keys(rst.value?.data || {}).forEach(type => {
                    typeMap[type] = rst.value.data[type];
                });
            }
        });
        pumpGroupChillerNums.value = typeMap;
    };

    const makeDefaultDatas = resData => {
        console.log('makeDefaultDatas: ', resData);
        baseData.value.systemId = resData.systemId || props.currentSystem?.systemId;
        baseData.value.dataType = resData.dataType;
        baseData.value.consoleType = resData.consoleType;
        baseData.value.systemType = resData.systemType;
        baseData.value.objectId = resData.objectId;
        baseData.value.beginDate = resData.beginDate;
        baseData.value.endDate = resData.endDate;
        if (resData.strategyPlans?.length > 0) {
            const areas = [];
            const defaultOpenSize = 12;
            resData.strategyPlans.forEach((obj, idx) => {
                let item = {
                    ...obj,
                    defaultOpen: idx < defaultOpenSize,
                    strategyTime: formatTime(obj.strategyTime, false),
                    isOld: true,
                    originStrategyPlan: obj,
                    sign: uuid(5)
                };
                const newval = dataToStrategyRule(item) || {};
                item = { ...item, ...newval };

                // 编辑模式下，且是当天的，把过去时刻的禁用
                if (isEdit.value && isPastTime(item.strategyTime)) {
                    item.isEditDisabled = true;
                }
                areas.push(item);
            });
            timeAreaDatas.value = areas;
        }

        if (resData.extendInfo) {
            extendInfo.value = resData.extendInfo;
            if (resData.extendInfo.effectDateData) {
                weekEffectDateData.value = resData.extendInfo.effectDateData.split(',');
            }
        }
    };

    const loadSpaceZones = async () => {
        const params = { projectId, systemId: props.currentSystem?.systemId };
        try {
            const { code, data } = await listSpaceZoneAndPublicPumpGroup(params);
            if (code === SUCCESSCODE && data) {
                spaceZones.value = data.map(obj => ({ ...obj, name: obj.localName ?? '--' }));
            }
        } catch (e) {
            spaceZones.value = [];
        }
    };

    const loadEditedData = async () => {
        const params = {
            projectId,
            consoleType: props.consoleType,
            systemType: props.systemType,
            systemId: props.currentSystem?.systemId,
            objectId: props.objectId,
            currentDate: props.currentDate
        };
        try {
            const { code, data } = await optionsEditStrategy(params, { cancelToken: initQueryCancelToken.cancelToken() });
            if (code === SUCCESSCODE) {
                strategyRule.value = data.strategyRule || {};
                if (data.executeDetailDTO) {
                    makeDefaultDatas({
                        ...props,
                        ...data.executeDetailDTO,
                        beginDate: props.currentDate,
                        endDate: props.endDate,
                        dataType: SAVE_DATA_TYPE.EDIT_OPER
                    });
                }
            }
        } catch (e) {
            console.error('Failed to load edited data:', e);
        }
    };

    const queryStrategyOfDay = async date => {
        strategyForCopeDayLoading.value = true;
        strategyForCopeDayData.value = null;
        const params = {
            projectId: baseStore().projectId,
            consoleType: props.consoleType,
            systemType: props.systemType,
            systemId: props.currentSystem?.systemId,
            objectId: props.objectId,
            date
        };
        try {
            const { code, data } = await getStrategyOfDay(params, { cancelToken: initQueryStrategyOfDayToken.cancelToken() });
            strategyForCopeDayLoading.value = false;
            // console.log('params: ', data, params);
            if (code === SUCCESSCODE && data?.length > 0) {
                // console.log('data: ', data);
                strategyForCopeDayData.value = data;
            }
        } catch (e) {
            strategyForCopeDayLoading.value = false;
            console.log('e: ', e);
        }
    };
    const initStrategyRule = async objectId => {
        if (!isAirZone.value) openLoading();
        initQueryCancelToken.cancelQuest();
        const params = { projectId, consoleType: props.consoleType, systemType: props.systemType, objectId };
        queryWorkDayTypes();
        try {
            const { code, data } = await optionsUpdateStrategy(params, { cancelToken: initQueryCancelToken.cancelToken() });
            if (code === SUCCESSCODE) {
                strategyRule.value = data || {};
            }
            closeLoading();
        } catch (e) {
            strategyRule.value = {};
            closeLoading();
        }
    };

    const getFieldDefine = (classCode, field) => {
        const classDefine = props.codeDefine?.[classCode];
        if (classDefine) {
            return classDefine[field + (props.consoleType || '')] || classDefine[field] || {};
        }
        return {};
    };

    const addTimeItem = () => {
        timeAreaDatas.value.push({ sign: uuid(5), defaultOpen: true });
    };

    const deleteTimeItem = index => {
        if (index < 0) return;
        timeAreaRefs.value[index] = null;
        timeAreaDatas.value.splice(index, 1);
    };

    const onEffectDateTypeChange = () => {
        weekEffectDateData.value = [];
        if (extendInfo.value.effectDateType === EFFECT_DATE_TYPES.WEEK_TAG.id) {
            extendInfo.value.effectDateData = [];
        } else {
            extendInfo.value.effectDateData = '';
        }
    };

    const getSaveDataBase = () => {
        const _extendInfo = { ...(extendInfo.value || {}) };
        if (extendInfo.value.effectDateType === EFFECT_DATE_TYPES.WEEK_TAG.id) {
            _extendInfo.effectDateData = weekEffectDateData.value?.join(',');
        } else if (extendInfo.value.effectDateType !== EFFECT_DATE_TYPES.WORK_TAG.id) {
            _extendInfo.effectDateData = '';
        }
        const rst = {
            ...baseData.value,
            beginDate: formatDate(baseData.value.beginDate),
            endDate: formatDate(baseData.value.endDate),
            extendInfo: _extendInfo
        };
        if (isEdit.value) {
            rst.beginDate = formatDate(props.currentDate);
            rst.endDate = formatDate(props.currentDate);
        }
        return rst;
    };

    const saveData = async strategyPlans => {
        if (isSaving.value) return true;
        const data = getSaveDataBase();
        data.strategyPlans = strategyPlans;
        isSaving.value = true;
        return await saveStrategy(data)
            .then(() => true)
            .catch(e => {
                console.error('Failed to save data:', e);
                return false;
            })
            .finally(() => {
                isSaving.value = false;
            });
    };

    watch(showModal, () => {
        if (showModal.value) {
            const promises = [];
            if (isAirZone.value) promises.push(loadSpaceZones());
            if (isEdit.value) {
                promises.push(loadEditedData());
            } else if (!isAirZone.value) {
                baseData.value.objectId = props.currentSystem?.systemId;
            }
            openLoading();
            Promise.allSettled(promises).finally(() => closeLoading());
        } else {
            resetData();
        }
    });

    watch([showModal, () => baseData.value?.objectId], () => {
        console.log('showModal.value: ', showModal.value, props.currentDate, baseData.value?.objectId);
        if (showModal.value && !props.currentDate && baseData.value?.objectId) {
            initStrategyRule(baseData.value?.objectId);
            makeDefaultDatas({ ...props, ...baseData.value, dataType: SAVE_DATA_TYPE.ADD_OPER });
        }
    });

    watch(
        () => strategyRule.value?.objectRuleInfos,
        () => {
            if (strategyRule.value?.objectRuleInfos?.length > 0) {
                queryChillerAxios(strategyRule.value.objectRuleInfos.map(obj => obj.objectId));
            }
        }
    );
    watch(dateForCopy, () => {
        initQueryStrategyOfDayToken?.cancelQuest();

        if (dateForCopy.value) {
            queryStrategyOfDay(formatDate(dateForCopy.value));
        }
    });
    const chillerData = computed(() => props.chillerData);
    const codeDefine = computed(() => props.codeDefine);

    provide(strategyTimeScopeKey, scopeTime);
    provide(timeAreaDatasKey, timeAreaDatas);
    provide(isPastTimeFuncKey, isPastTime);
    provide(pumpGroupChillerNumsKey, pumpGroupChillerNums);
    provide(chillerDataKey, chillerData); // 冷机数据
    provide(codeDefineKey, codeDefine); // 代码定义
    provide(getFieldDefineKey, getFieldDefine);
    provide(consoleTypeKey, consoleType);
    return {
        addTimeItem,
        deleteTimeItem,
        handleValidateDateChange,
        saveData,
        validDateContainCurDay,
        isPastTime,
        onEffectDateTypeChange,
        applyOverwriteStrategys,
        isCoolInput,
        timeAreaRefs,
        normalRefs,
        loading,
        baseData,
        spaceZones,
        formRef,
        currentSystem: computed(() => props.currentSystem),
        isSaving,
        isEdit,
        title,
        validateDateRange,
        dateTypeOptions,
        extendInfo,
        weekEffectDateData,
        timeAreaDatas,
        strategyRule,
        isAirZone,
        pumpGroupChillerNums,
        copyOpDesc,
        dateForCopy,
        disableCopyDate,
        disableCopyDateTips,
        copyAndOverwriteBtnDisabled,
        copyAndOverwriteTipsDisabled,
        copyAndOverwriteTipsContent,
        strategyCopeValidData
    };
};
