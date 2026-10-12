import i18n from '@/localization';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { EFFECT_DATE_TYPES, WORK_TAGS, CONSOLE_TYPES } from '../constant/variable';
import useLoading from '@/hooks/useLoading';
import { listInstantiationDateTag } from '@/apis/calendar';
import baseStore from '@/store/baseStore';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import dayjs from 'dayjs';
import { uuid } from 'yushu-js-utils';
import { optionsUpdateStrategy, optionsEditStrategy, listSpaceZoneAndPublicPumpGroup, saveStrategy, getStrategyOfDay, getChillerAxios } from '@/apis/ACAC';
import { currentSystemKey, codeDefineKey } from '@/views/System-Heat-Source/hooks/useBaseHook';
import isToday from 'dayjs/plugin/isToday';
import { SAVE_DATA_TYPE, WEEK_OPTIONS, WEEK_TAG_OPTIONS, formatTime } from './timetableConfig';
import { dayjsIsBefore, dayTz } from '@/utils/dayjsTools';
dayjs.extend(isToday);

export const baseDataKey = Symbol('baseDataKey'); //
export const strategyTimeKey = Symbol('strategyTimeKey'); //策略时间
export const strategyTimeScopeKey = Symbol('strategyTimeScopeKey'); //策略时间有效区间
export const strategyRuleKey = Symbol('strategyRuleKey'); //策略规则
export const timeAreaDatasKey = Symbol('timeAreaDatasKey'); // 按时间输入块数据
export const formRefKey = Symbol('formRefKey'); // form
export const isPastTimeFuncKey = Symbol('isPastTimeFuncKey'); //
export const getFieldDefineKey = Symbol('getFieldDefineKey'); //
export const pumpGroupChillerNumsKey = Symbol('pumpGroupChillerNumsKey'); //

export const isAirZoneKey = Symbol('isAirZoneKey'); //
export const isEditKey = Symbol('isEditKey'); //

const formatDate = val => {
    return dayjs(val).format('YYYY-MM-DD');
};
export const dataToStrategyRule = strategyPlan => {
    let pointRuleInfo = {};
    const objectRuleInfos = [];
    strategyPlan.pointInfos?.forEach(info => {
        pointRuleInfo = { ...pointRuleInfo, ...info };
    });
    pointRuleInfo.chillerRuleInfos = strategyPlan.pointInfos.filter(obj => obj.chillerType);
    strategyPlan.objectInfos?.forEach(info => {
        const newObj = {
            ...info
        };
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

    return {
        ...pointRuleInfo,
        pointRuleInfo,
        objectRuleInfos
    };
};
export default (props, showModal) => {
    const validateDateRange = ref('');
    // 已编辑保存的数据（编辑模式下的）
    const baseData = ref({ objectId: '', beginDate: '', endDate: '' });
    const timeAreaDatas = ref([{ defaultOpen: true, sign: 0 }]);
    const formRef = ref();
    const strategyRule = ref({});
    // 空调分区列表
    const spaceZones = ref([]);
    // 当天公休日类型
    const currentDayType = ref();
    // 保存中
    const isSaving = ref(false);
    const extendInfo = ref({ effectDateType: EFFECT_DATE_TYPES.GENERAL.id, effectDateData: null });
    const weekEffectDateData = ref([]);
    const timeAreaRefs = ref({});
    const normalRefs = ref({});
    // 复制时间表选择日期
    const dateForCopy = ref('');
    const strategyForCopeDayLoading = ref(false);
    const strategyForCopeDayData = ref(null);
    // 泵组冷寂台数，数量定义
    const pumpGroupChillerNums = ref({});
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
    const currentSystem = inject(currentSystemKey);

    const codeDefine = inject(codeDefineKey);
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
    // 有效日期区间包含当天
    const validDateContainCurDay = () => {
        if (!baseData.value.beginDate) {
            return false;
        }
        const bDate = dayjs(baseData.value.beginDate);
        if (!bDate) {
            return false;
        }
        if (bDate.isToday()) {
            if (isEdit.value) {
                return true;
            }
            if (extendInfo.value.effectDateType === EFFECT_DATE_TYPES.WEEK_TAG.id) {
                return weekEffectDateData.value?.some(val => {
                    // console.log(' bDate.day(): ', val, bDate.day());
                    return val === `${bDate.day()}`;
                });
            } else if (extendInfo.value.effectDateType === EFFECT_DATE_TYPES.WORK_TAG.id) {
                // console.log('currentDayType', currentDayType);
                if (currentDayType.value === extendInfo.value.effectDateData) {
                    return true;
                }
            } else {
                return true;
            }
        }
        return false;
    };
    const isEdit = computed(() => {
        return !!props?.currentDate;
    });
    // 当前是空调分区
    const isAirZone = computed(() => {
        return props.consoleType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id;
    });

    const title = computed(() => {
        const consoleObj = CONSOLE_TYPES[props.consoleType];
        if (isEdit.value) {
            let dayIndex = dayjs(props.currentDate).day();
            dayIndex = dayIndex ? dayIndex - 1 : 6;
            const weekDay = WEEK_OPTIONS[dayIndex]?.label;
            const objName = isAirZone.value ? spaceZones.value?.find(obj => obj.id === props.objectId)?.name : consoleObj.name;
            // console.log('weekDay: ', objName, weekDay, dayjs(props.currentDate).day());
            return i18n.global.t('meos_control_web.name_timetable', { name: `${props.currentDate}（${weekDay}）${objName ?? ''}` });
        } else {
            return i18n.global.t('meos_control_web.create_name_timetable', { name: consoleObj?.name });
        }
    });

    const strategyCopeValidData = computed(() => {
        const targetStrategy = strategyForCopeDayData.value?.find(obj => obj.objectId === baseData.value?.objectId);
        return targetStrategy;
    });
    //
    const scopeTime = computed(() => {
        if (validDateContainCurDay()) {
            const curTime = dayTz();
            return `${curTime.format('HH:mm')}-23:55`;
        }
        return '';
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
        return props.consoleType === CONSOLE_TYPES.AIR_TERMINAL_ZONE.id && !baseData.value?.objectId;
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

    // 是过去时间
    const isPastTime = time => {
        // const currentDate = props?.currentDate;
        // if (currentDate) {
        //     return dayjs().isAfter(dayjs(currentDate));
        // }
        if (validDateContainCurDay()) {
            const curDate = dayTz().format('YYYY-MM-DD');
            const curTime = dayTz();
            const targetTime = dayjs(curDate + ' ' + time);
            return dayjsIsBefore(targetTime, curTime);
        }
        return false;
    };
    // 查询公休日数据
    const queryWorkDayTypes = () => {
        const today = dayTz().endOf('day').format('YYYY-MM-DD');
        listInstantiationDateTag({
            beginDate: today,
            endDate: today
        }).then(res => {
            if (res.code === SUCCESSCODE && res.data?.length) {
                let type =
                    res.data[0].calendarTags?.find(tag => {
                        const code = tag.toLocaleLowerCase();
                        return code === WORK_TAGS.WORKDAY || code === WORK_TAGS.DAYOFF;
                    }) || '';
                type = type.toLocaleLowerCase();
                currentDayType.value = type;
            }
        });
    };

    const queryChillerAxios = async objectIds => {
        const promises = [];
        objectIds.forEach(objectId => {
            const p = getChillerAxios({
                objectId
            });
            promises.push(p);
        });
        const rsts = await Promise.allSettled(promises);
        const typeMap = {};
        rsts.forEach(rst => {
            if (rst?.status === 'fulfilled') {
                Object.keys(rst.value?.data)?.forEach(type => {
                    typeMap[type] = rst.value?.data[type];
                });
            }
        });
        console.log('typeMap: ', typeMap);
        pumpGroupChillerNums.value = typeMap;
    };

    const makeDefaultDatas = resData => {
        // console.log('resData: ', resData);
        baseData.value.systemId = resData.systemId || currentSystem?.value?.systemId;
        baseData.value.dataType = resData.dataType;
        baseData.value.consoleType = resData.consoleType;
        baseData.value.systemType = resData.systemType;

        baseData.value.objectId = resData.objectId;
        baseData.value.beginDate = resData.beginDate;
        baseData.value.endDate = resData.endDate;
        if (resData.strategyPlans?.length > 0) {
            const areas = [];
            // const bbb = makeTimeAreaDataByData(resData.strategyPlans, infoPointDefine.value);
            // console.log('bbb: ', bbb);
            // 默认展开数量（因渲染性能前xx个默认展开其余收起）
            const defaultOpenSize = 12;
            resData.strategyPlans?.forEach((obj, idx) => {
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

    // 加载空调分区
    const loadSpaceZones = async () => {
        const params = { projectId: baseStore().projectId, systemId: currentSystem?.value?.systemId };
        try {
            const { code, data } = await listSpaceZoneAndPublicPumpGroup(params);
            if (code === SUCCESSCODE && data) {
                spaceZones.value = data.map(obj => {
                    return {
                        ...obj,
                        name: obj.localName ?? '--'
                    };
                });
            }
        } catch (e) {
            spaceZones.value = [];
        }
    };
    // 加载编辑数据（点位+已保存数据）
    const loadEditedData = async () => {
        const params = {
            projectId: baseStore().projectId,
            consoleType: props.consoleType,
            systemType: props.systemType,
            systemId: currentSystem?.value?.systemId,
            objectId: props.objectId,
            currentDate: props.currentDate
        };
        try {
            const { code, data } = await optionsEditStrategy(params, { cancelToken: initQueryCancelToken.cancelToken() });
            // console.log('params: ', data, params);
            if (code === SUCCESSCODE) {
                // console.log('data: ', data);
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
            console.log('e: ', e);
        }
    };
    const queryStrategyOfDay = async date => {
        strategyForCopeDayLoading.value = true;
        strategyForCopeDayData.value = null;
        const params = {
            projectId: baseStore().projectId,
            consoleType: props.consoleType,
            systemType: props.systemType,
            systemId: currentSystem?.value?.systemId,
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
    // 初始化加载点位数据
    const initStrategyRule = async objectId => {
        if (!isAirZone.value) {
            openLoading();
        }
        initQueryCancelToken.cancelQuest();
        // console.log('props: ', props);
        const params = {
            projectId: baseStore().projectId,
            consoleType: props.consoleType,
            systemType: props.systemType,
            objectId
        };

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

    // const getFieldDefine = field => {
    //     return infoPointDefine.value[field] ?? {};
    // };
    const getFieldDefine = (classCode, field) => {
        const classDefine = codeDefine.value[classCode];
        if (classDefine) {
            return classDefine[field] ?? {};
        }
    };

    const addTimeItem = () => {
        // const newObj = makeTimeAreaDataByRule(strategyRule.value, infoPointDefine.value);
        timeAreaDatas.value.push({ sign: uuid(5), defaultOpen: true });
    };
    const deleteTimeItem = index => {
        if (index < 0) {
            return;
        }
        timeAreaRefs.value[index] = null;
        timeAreaDatas.value.splice(index, 1);
    };

    // "配置方式"切换，生效日期数据的处理
    const onEffectDateTypeChange = selected => {
        weekEffectDateData.value = [];
        // console.log('selected: ', selected);
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
        if (isSaving.value) {
            return true;
        }
        const data = getSaveDataBase();
        data.strategyPlans = strategyPlans;
        // console.log('data: ', data);
        isSaving.value = true;
        return await saveStrategy(data)
            .then(() => true)
            .catch(e => {
                console.log('e: ', e);
                return false;
            })
            .finally(() => {
                isSaving.value = false;
            });
    };

    watch(showModal, () => {
        // console.log('showModal: ', showModal);
        if (showModal.value) {
            const promises = [];
            if (isAirZone.value) {
                promises.push(loadSpaceZones());
            }
            if (isEdit.value) {
                promises.push(loadEditedData());
            } else {
                if (!isAirZone.value) {
                    baseData.value.objectId = currentSystem?.value?.systemId;
                }
            }
            openLoading();
            Promise.allSettled(promises).finally(() => {
                closeLoading();
            });
        } else {
            resetData();
        }
    });
    watch([showModal, () => baseData.value?.objectId], () => {
        if (showModal.value && !props.currentDate && baseData.value?.objectId) {
            initStrategyRule(baseData.value?.objectId);
            makeDefaultDatas({
                ...props,
                ...baseData.value,
                dataType: SAVE_DATA_TYPE.ADD_OPER
            });
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

    provide(baseDataKey, baseData);
    provide(strategyRuleKey, strategyRule);
    provide(timeAreaDatasKey, timeAreaDatas);
    provide(strategyTimeScopeKey, scopeTime);
    provide(formRefKey, formRef);
    provide(isPastTimeFuncKey, isPastTime);
    provide(getFieldDefineKey, getFieldDefine);
    provide(pumpGroupChillerNumsKey, pumpGroupChillerNums);

    provide(isAirZoneKey, isAirZone);
    provide(isEditKey, isEdit);
    return {
        addTimeItem,
        deleteTimeItem,
        handleValidateDateChange,
        saveData,
        validDateContainCurDay,
        isPastTime,
        onEffectDateTypeChange,
        applyOverwriteStrategys,
        timeAreaRefs,
        normalRefs,
        loading,
        baseData,
        spaceZones,
        formRef,
        currentSystem,
        isSaving,
        isEdit,
        title,
        validateDateRange,
        dateTypeOptions,
        weekOptions: WEEK_OPTIONS,
        extendInfo,
        weekEffectDateData,
        weekTagOptions: WEEK_TAG_OPTIONS,
        timeAreaDatas,
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
