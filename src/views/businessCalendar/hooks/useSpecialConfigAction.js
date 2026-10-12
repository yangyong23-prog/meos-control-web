import { $Message } from 'meri-plus';
import i18n from '@/localization';
import { BUSINESS_CONFIG_TYPE } from '../constants';
import { editBusinessTime, clearAllSpecialObjectConfig } from '@/apis/calendar';
import { SUCCESSCODE } from '@/utils/globalVariables';
import { convertWeekNumberRange } from '../utils';

export const useSpecialConfigAction = ({
    formInstance,
    modelParams,
    currentModel,
    businessTimeRangeSwitch,
    workDayBusinessTimeRangeSwitch,
    dayOffBusinessTimeRangeSwitch,
    updateCallback
}) => {
    const isClearing = ref(false);
    const isSelectedClearConfig = ref(false);

    const isClearingAll = ref(false);

    const loadingBtn = ref(false);

    const handleLoading = (type, loading) => {
        if (type === 'clear') {
            isClearing.value = loading;
        } else if (type === 'sure') {
            loadingBtn.value = loading;
        } else {
            isClearingAll.value = loading;
        }
    };

    const transformRange = list => {
        const res = list.map(item => {
            if (item?.rowTimeRange?.startTime && item?.rowTimeRange?.endTime) {
                const { startTime, endTime } = item.rowTimeRange;
                const finalEndTime = endTime === '24:00' ? '23:59:00' : `${endTime}:00`;
                return `${startTime}:00,${finalEndTime}`;
            } else {
                return '';
            }
        });
        return res.filter(v => !!v);
    };

    const getSpecialContent = list => {
        // 特殊配置内容提交
        const res = list.map(item => {
            const { dateRange, rangeSwitch, rangeList } = item || {};
            if (dateRange) {
                const filterRangeList = transformRange(rangeList);
                const timePeriod = (dateRange?.split('-') || [])?.map(d => d?.replaceAll('.', '-'))?.join(',');
                const newItem = { timePeriod, specialConfigurationContentBusinessTimeRangeList: rangeSwitch === 'uncheck' ? [] : filterRangeList };
                return newItem;
            } else {
                return null;
            }
        });
        return res.filter(v => !!v);
    };

    const getValidFormData = async type => {
        handleLoading(type, true);
        const res = await formInstance.value.validate(valid => {
            if (valid) {
                // 如果工作日、休息日的营业时段均选择不营业，那么确定时提示用户“当前配置无效，工作日、休息日的营业时段不可同时为不营业
                if (type === 'sure' && modelParams.value.radioValue === BUSINESS_CONFIG_TYPE.Workday) {
                    if (workDayBusinessTimeRangeSwitch.value === 'uncheck' && dayOffBusinessTimeRangeSwitch.value === 'uncheck') {
                        $Message.error({ title: i18n.global.t('meos_control_web.workday_restday_both_closed_invalid') });
                        handleLoading(type, false);
                        return;
                    }
                }
                // 若每组星期号中的营业时间段都选择为不营业，点击弹窗【确定】时，会自动定位至营业时间配置处，且页面顶部massage报错提示“当前营业时间配置无效，所有分组的营业时段不可同时为不营业”
                if (type === 'sure' && modelParams.value.radioValue === BUSINESS_CONFIG_TYPE.Week) {
                    if (modelParams.value.weekNumberParamList?.length) {
                        const isAllNotOpen = modelParams.value.weekNumberParamList.every(item => item?.rangeSwitch === 'uncheck');
                        if (isAllNotOpen) {
                            $Message.error({ title: i18n.global.t('meos_control_web.business_hours_config_invalid_all_closed') });
                            handleLoading(type, false);
                            return;
                        }
                    }
                }
                const isSelectedDefault = modelParams.value.radioValue === BUSINESS_CONFIG_TYPE.Default;
                const isSelectedWeekDay = modelParams.value.radioValue === BUSINESS_CONFIG_TYPE.Workday;
                const isSelectedWeek = modelParams.value.radioValue === BUSINESS_CONFIG_TYPE.Week;
                const isUncheckBusinessTime = businessTimeRangeSwitch.value === 'uncheck';
                const isUncheckWorkday = workDayBusinessTimeRangeSwitch.value === 'uncheck';
                const isUncheckDayOff = dayOffBusinessTimeRangeSwitch.value === 'uncheck';

                const businessTimeRangeList = isSelectedDefault ? (isUncheckBusinessTime ? [] : transformRange(modelParams.value.businessTimeRangeList)) : [];
                const workdayBusinessTimeRangeList = isSelectedWeekDay ? (isUncheckWorkday ? [] : transformRange(modelParams.value.workdayBusinessTimeRangeList)) : [];
                const dayOffBusinessTimeRangeList = isSelectedWeekDay ? (isUncheckDayOff ? [] : transformRange(modelParams.value.dayOffBusinessTimeRangeList)) : [];
                const weekNumberParamList = isSelectedWeek ? convertWeekNumberRange(modelParams.value.weekNumberParamList, true) : [];

                const specialConfigurationContentParamList = getSpecialContent(modelParams.value.specialConfigurationContentParamList);

                return {
                    instanceId: currentModel.value[0],
                    dateTagType: modelParams.value.radioValue,
                    businessTimeRangeList: businessTimeRangeList,
                    workdayBusinessTimeRangeList: workdayBusinessTimeRangeList,
                    dayOffBusinessTimeRangeList: dayOffBusinessTimeRangeList,
                    weekNumberParamList,
                    specialConfigurationContentParamList,
                    isDelete: isSelectedClearConfig.value
                };
            } else {
                $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
                handleLoading(type, false);
                return;
            }
        });
        return res;
    };

    const invokeSubmit = async (params, type, config) => {
        const { successCallback, failCallback, finallyCallback } = config || {};
        if (!params) {
            return;
        }
        const fetchApi = type === 'clearAll' ? clearAllSpecialObjectConfig : editBusinessTime;
        fetchApi(params)
            .then(res => {
                if (res.code === SUCCESSCODE) {
                    if (type === 'sure') {
                        $Message.success({ title: i18n.global.t('common.save_success') });
                    } else {
                        $Message.success({ title: i18n.global.t('common.operation_success') });
                    }

                    if (successCallback) {
                        successCallback?.();
                    } else {
                        updateCallback?.();
                        isSelectedClearConfig.value = false;
                    }
                } else {
                    failCallback?.();
                }
            })
            .finally(() => {
                handleLoading(type, false);
                finallyCallback?.();
            });
    };

    return { getValidFormData, invokeSubmit, isClearing, isSelectedClearConfig, isClearingAll, loadingBtn };
};
