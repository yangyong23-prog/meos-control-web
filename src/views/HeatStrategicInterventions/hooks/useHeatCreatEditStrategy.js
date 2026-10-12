// @ts-ignore
import i18n from '@/localization';
import { $Message } from 'meri-plus';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import { addFixedTimeStrategy, updateFixedTimeStrategy, checkFixedStrategy, getHotWaterDetaSetType } from '@/apis/HeatStrateg';
import { uniqueId } from 'lodash';
import { getDayjsTz } from '@/utils/globalVariables';
export default (props, emits) => {
    const heatMform = ref(); // 表单
    const rules = ref({});
    const scrollbarRef = ref(); // 添加时间滚动条
    const hotWaterDetaSetType = ref('');
    const strategyModalParams = reactive({
        loading: true,
        isDisabled: false,
        heatShowModal: true, // 弹框
        titleModal: '', // 弹框标题
        date: '', // 生效日
        strategyId: '',
        planList: [
            {
                strategyTime: '',
                runStatus: 'OPEN',
                sustainTime: null,
                hotWaterDetaSet: null,
                hotWaterOutTempSet: null,
                id: uniqueId('plan'),
                hotWaterDetaSetType: hotWaterDetaSetType?.value
            }
        ],
        paramsPlanlist: [], // 传给后端的列表参数
        confirmStrategyState: false, // 覆盖策略弹框状态
        confirmparams: {}, // 覆盖策略参数
        hasChange: false, // 是否修改
        showleave: false // 退出
    });

    // 查看时间是否出现了两次
    const checkDuplicate = (arr, num) => {
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === num) {
                count++;
                if (count === 2) {
                    return true;
                }
            }
        }
        return false;
    };

    // 策略时间
    const validateTimePicker = (item, callback) => {
        let timeArr = ref([]);
        strategyModalParams.planList.length &&
            strategyModalParams.planList.map(p => {
                timeArr.value.push(p.strategyTime);
            });
        if (checkDuplicate(timeArr.value, item.strategyTime)) {
            callback(new Error(i18n.global.t('meos_control_web.time_already_selected_please_check')));
        } else if (
            props.queryParams.name === 'add' &&
            getDayjsTz().format('YYYY-MM-DD') === dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD') &&
            item.strategyTime < getDayjsTz().add(1, 'minute').format('HH:mm')
        ) {
            callback(new Error(i18n.global.t('meos_control_web.date_check_error_1')));
        } else {
            callback();
        }
    };

    // 生效日
    const validateDatePicker = (rule, value, callback) => {
        if (!value) return;
        if (value.split('-')[0] < getDayjsTz().format('YYYY.MM.DD')) {
            callback(new Error(i18n.global.t('meos_control_web.past_time_not_selectable')));
        } else {
            callback();
        }
    };

    const validateInputSet = (item, callback, value) => {
        if (
            (value === 'hotWaterOutTempSet' && item.hotWaterOutTempSet == null) ||
            (value === 'hotWaterDetaSet' && item.hotWaterDetaSet === null) ||
            (value === 'sustainTime' && item.sustainTime === null)
        ) {
            callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_3')));
        } else {
            callback();
        }
    };

    // 设置标题
    const formatterTitle = () => {
        const { name } = props.queryParams;
        name === 'edit'
            ? (strategyModalParams.titleModal = i18n.global.t('meos_control_web.edit_schedule_city_heat_exchange'))
            : (strategyModalParams.titleModal = i18n.global.t('meos_control_web.create_new_schedule_city_heat_exchange'));

        if (name === 'edit') {
            formatterParams();
        } else {
            strategyModalParams.loading = false;
        }
    };

    // 编辑参数转换
    const formatterParams = () => {
        const { data } = props.queryParams;
        strategyModalParams.date = `${dayjs(data.dateTime).format('YYYY.MM.DD')}-${dayjs(data.dateTime).format('YYYY.MM.DD')}`;
        strategyModalParams.planList =
            data?.content?.length &&
            data.content.map(d => {
                strategyModalParams.strategyId = d.strategyId;
                return {
                    isDisabled:
                        getDayjsTz().format('YYYY-MM-DD') === dayjs(data.dateTime).format('YYYY-MM-DD')
                            ? getDayjsTz().add(1, 'minute').format('HH:mm:ss') > d.strategyTime
                                ? true
                                : false
                            : false,
                    strategyId: d.strategyId,
                    id: uniqueId('plan'),
                    strategyTime: d.strategyTime.slice(0, 5),
                    hotWaterDetaSetType: hotWaterDetaSetType?.value,
                    runStatus: d.runStatus,
                    sustainTime: d.runStatus === 'OPEN' ? d.sustainTime : null,
                    hotWaterOutTempSet: d.runStatus === 'OPEN' ? (d.hotWaterOutTempSet ? Math.floor(d.hotWaterOutTempSet * 10) / 10 : d.hotWaterOutTempSet) : null,
                    hotWaterDetaSet: d.runStatus === 'OPEN' ? (d.hotWaterDetaSet ? Math.floor(d.hotWaterDetaSet * 10) / 10 : d.hotWaterDetaSet) : null
                };
            });
        strategyModalParams.loading = false;
    };

    // 确定
    const submit = () => {
        heatMform.value.validate(valid => {
            if (valid) {
                strategyModalParams.isDisabled = true;
                strategyModalParams.paramsPlanlist = [];
                strategyModalParams.paramsPlanlist = strategyModalParams.planList.map(item => {
                    return {
                        hotWaterDetaSetType: hotWaterDetaSetType?.value,
                        strategyTime: item.strategyTime + ':00',
                        runStatus: item.runStatus,
                        sustainTime: item.sustainTime,
                        hotWaterOutTempSet: item.runStatus === 'OPEN' ? item.hotWaterOutTempSet : null,
                        hotWaterDetaSet: item.runStatus === 'OPEN' ? item.hotWaterDetaSet : null
                    };
                });

                let data = {
                    systemType: 'ACCH',
                    systemId: props.queryParams.systemId,
                    objectId: props.queryParams.systemId,
                    strategyId: strategyModalParams.strategyId,
                    strategyPlans: strategyModalParams.paramsPlanlist,
                    beginDate: dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD'),
                    endDate: dayjs(strategyModalParams.date.split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
                };
                if (props.queryParams.name === 'edit') {
                    strategyApi('edit', updateFixedTimeStrategy, data);
                } else {
                    queryCheckFixedStrategy(data);
                }
            } else {
                $Message.error({ title: `${i18n.global.t('meos_control_web.input_validation_error_check')}` });
            }
        });
    };

    // 新建冷机策略 api接口名称 params 参数数组  status add||edit
    const strategyApi = (status, api, params) => {
        api(params).then(res => {
            strategyModalParams.isDisabled = false;
            if (res.result === 'success') {
                // 冷站
                if (status === 'add') {
                    // 新建
                    $Message.success({ title: `${i18n.global.t('common.save_success')}` });
                    close();
                    emitter.emit('refreshMain');
                } else {
                    $Message.success({ title: `${i18n.global.t('common.edit_success')}` });
                    close();
                    emitter.emit('refreshMain');
                }
                emits('getListFixedStrategyDateByMonth');
            }
        });
    };

    // 校验固定时间策略
    const queryCheckFixedStrategy = params => {
        checkFixedStrategy({
            systemType: 'ACCH',
            businessType: 'HOT_STATION',
            isCheckDateRange: true,
            systemId: props.queryParams.systemId,
            objectId: props.queryParams.systemId,
            beginDate: dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD'),
            endDate: dayjs(strategyModalParams.date.split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
        }).then(res => {
            const { data, result } = res;
            if (result === 'success' && data && data.isExistsStrategyInDateRange === true) {
                // 有 弹框确认
                strategyModalParams.confirmStrategyState = true;
                strategyModalParams.confirmparams = params;
            } else {
                strategyApi('add', addFixedTimeStrategy, params);
            }
        });
    };

    // 覆盖策略弹框取消
    const cancelStrategy = () => {
        strategyModalParams.isDisabled = false;
        strategyModalParams.confirmStrategyState = false;
    };

    // 覆盖策略弹框确认
    const confirmStrategy = () => {
        strategyModalParams.confirmStrategyState = false;
        strategyApi('add', addFixedTimeStrategy, strategyModalParams.confirmparams);
    };

    // 点击删除icon
    const deleteFun = index => {
        strategyModalParams.planList.splice(index, 1);
        strategyModalParams.hasChange = true;
    };

    // 添加时间
    const addFun = e => {
        if (!e.pointerType) return;
        strategyModalParams?.planList.push({
            hotWaterDetaSetType: hotWaterDetaSetType?.value,
            strategyTime: '',
            runStatus: 'OPEN',
            id: uniqueId('plan'),
            sustainTime: null,
            hotWaterDetaSet: null,
            hotWaterOutTempSet: null
        });
        strategyModalParams.hasChange = true;
        nextTick(() => {
            scrollbarRef.value?.setScrollTop('end');
        });
    };

    onMounted(() => {
        strategyModalParams.loading = true;
        strategyModalParams.heatShowModal = true;
    });

    // 生效时间change
    const pickerChange = data => {
        strategyModalParams.hasChange = true;
        if (props.queryParams.name === 'edit') {
            if (dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD') === dayjs(unref(data).split('-')[1]).format('YYYY-MM-DD')) {
                if (getDayjsTz().format('YYYY-MM-DD') === dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')) {
                    console.log('shijintian ');
                    strategyModalParams.planList = props?.queryParams?.data?.content?.map(d => {
                        return {
                            isDisabled: getDayjsTz().add(1, 'minute').format('HH:mm:ss') > d.strategyTime ? true : false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            hotWaterDetaSetType: hotWaterDetaSetType?.value,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            hotWaterOutTempSet: d.runStatus === 'OPEN' ? (d.hotWaterOutTempSet ? Math.floor(d.hotWaterOutTempSet * 10) / 10 : d.hotWaterOutTempSet) : null,
                            hotWaterDetaSet: d.runStatus === 'OPEN' ? (d.hotWaterDetaSet ? Math.floor(d.hotWaterDetaSet * 10) / 10 : d.hotWaterDetaSet) : null
                        };
                    });
                } else {
                    console.log('bushi');
                    strategyModalParams.planList = props.queryParams.data.content.map(d => {
                        return {
                            isDisabled: false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            hotWaterDetaSetType: hotWaterDetaSetType?.value,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            hotWaterDetaSet: d.runStatus === 'OPEN' ? (d.hotWaterDetaSet ? Math.floor(d.hotWaterDetaSet * 10) / 10 : d.hotWaterDetaSet) : null,
                            hotWaterOutTempSet: d.runStatus === 'OPEN' ? (d.hotWaterOutTempSet ? Math.floor(d.hotWaterOutTempSet * 10) / 10 : d.hotWaterOutTempSet) : null
                        };
                    });
                }
            } else {
                // 不一样的周期 有可能包含今天
                strategyModalParams.planList =
                    props.queryParams.data.content.length &&
                    props.queryParams.data.content.map(d => {
                        return {
                            isDisabled:
                                getDayjsTz().format('YYYY-MM-DD') === dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')
                                    ? getDayjsTz().add(1, 'minute').format('HH:mm:ss') > d.strategyTime
                                        ? true
                                        : false
                                    : false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            hotWaterDetaSetType: hotWaterDetaSetType?.value,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            hotWaterDetaSet: d.runStatus === 'OPEN' ? (d.hotWaterDetaSet ? Math.floor(d.hotWaterDetaSet * 10) / 10 : d.hotWaterDetaSet) : null,
                            hotWaterOutTempSet: d.runStatus === 'OPEN' ? (d.hotWaterOutTempSet ? Math.floor(d.hotWaterOutTempSet * 10) / 10 : d.hotWaterOutTempSet) : null
                        };
                    });
            }
        }
    };

    // 取消弹框
    const close = () => {
        strategyModalParams.heatShowModal = false;
        nextTick(() => {
            emits('close');
        });
    };

    const hotInputkeyup = (value, item, e) => {
        if (!/^-?\d+(\.\d{1})?$/.test(e.target.value) || !e) {
            if (value === 'hotWaterOutTempSet') {
                item.hotWaterOutTempSet = ('' + item.hotWaterOutTempSet).slice(0, -1);
            } else if (value === 'hotWaterDetaSet') {
                item.hotWaterDetaSet = ('' + item.hotWaterDetaSet).slice(0, -1);
            } else {
                item.sustainTime = ('' + item.sustainTime).slice(0, -1);
            }
        }
    };
    const validateAndSetInput = (item, key, inputValue) => {
        const regex = /^-?\d+(\.\d{1,2})?$/; // 允许最多两位小数
        if (!regex.test(inputValue)) {
            return item[key]; // 返回之前的值
        }
        item[key] = inputValue;
        return inputValue;
    };

    const InputChange = (value, item, event) => {
        let updatedValue;
        if (event) {
            const inputValue = event.target ? event.target.value : event; // 获取输入内容
            switch (value) {
                case 'hotWaterOutTempSet':
                    updatedValue = validateAndSetInput(item, 'hotWaterOutTempSet', inputValue);
                    break;
                case 'hotWaterDetaSet':
                    updatedValue = validateAndSetInput(item, 'hotWaterDetaSet', inputValue);
                    break;
                case 'sustainTime':
                    updatedValue = validateAndSetInput(item, 'sustainTime', inputValue);
                    break;
                default:
                    return;
            }
            if (item[value] !== undefined) {
                item[value] = updatedValue;
            }
        }
        strategyModalParams.hasChange = true;
    };

    // 取消
    const closeModal = () => {
        if (strategyModalParams.hasChange) {
            strategyModalParams.showleave = true;
        } else {
            close();
        }
    };

    // 确认二次弹框
    const submitStrate = () => {
        strategyModalParams.showleave = false;
        close();
    };

    // 取消二次弹框
    const closeStrate = () => {
        strategyModalParams.showleave = false;
    };
    const queryHotWaterDetaSetType = async () => {
        const response = await getHotWaterDetaSetType({ systemId: props.queryParams.systemId });
        hotWaterDetaSetType.value = response.data;
        formatterTitle();
    };
    watchEffect(() => {
        if (strategyModalParams.heatShowModal) {
            queryHotWaterDetaSetType();
        }
    });
    return {
        heatMform,
        strategyModalParams,
        rules,
        closeStrate,
        validateTimePicker,
        validateDatePicker,
        validateInputSet,
        hotWaterDetaSetType,
        submit,
        cancelStrategy,
        confirmStrategy,
        deleteFun,
        addFun,
        pickerChange,
        close,
        hotInputkeyup,
        InputChange,
        closeModal,
        submitStrate
    };
};
