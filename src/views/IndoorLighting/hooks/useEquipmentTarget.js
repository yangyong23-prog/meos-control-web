import useLoading from '@/hooks/useLoading';
import { ref, computed, onMounted, onUnmounted, provide, watch } from 'vue';
import { getDemandTarget } from '@/apis/IndoorLighting';
import { getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { funcTypeInLoopListKey } from './useBaseHook';

export const equipmentTargetDataInjectKey = Symbol('equipmentTargetData');
export const equipmentTargetSelectedTimeInjectKey = Symbol('selectedTime');
export const equipmentTargetCurrentTimeInjectKey = Symbol('currentTime');
export const equipmentTargetSelectedTimeSwitchCircuitStatisticInjectKey = Symbol('selectedTimeSwitchCircuitStatistic');
export const equipmentTargetTemporarySwitchCircuitInjectKey = Symbol('temporarySwitchCircuit');
export const equipmentTargetRunningMonitorSecondTypeInjectKey = Symbol('runningMonitorSecondType');
export const equipmentTargetTemporarySwitchCircuitTaskTimeInjectKey = Symbol('temporarySwitchCircuitTaskTime');
export const equipmentTargetOperationStandardInjectKey = Symbol('operationStandard');
export const equipmentTargetCurrentOperationStandardInjectKey = Symbol('currentOperationStandard');

export default loadingTarget => {
    const getLocalTime = () => {
        const now = getDayjsTz();
        return now.format('YYYY-MM-DD HH:mm:ss');
    };

    const funcTypeInLoopList = inject(funcTypeInLoopListKey);

    const LOOP_TIME_INTERVAL = 10 * 1000; // 10 seconds

    const runningMonitorSecondType = ref('PUBLIC_AREA_LIGHTING');

    // 需求目标的对象
    // 楼层/项目
    const targetParams = ref({});
    // 需求目标数据
    const equipmentTargetData = ref(null);
    // 当前时间
    const currentTime = ref('');
    // 用户选择时间
    const selectedTime = ref('');

    const { loading, openLoading, closeLoading } = useLoading(loadingTarget, 'var(--gray-0)', 'ball', { width: '100px', height: '100px' }, 0);
    let abortController = null,
        timer = null;

    onMounted(() => {
        currentTime.value = getLocalTime();
        selectedTime.value = getLocalTime();
        loadEquipmentTarget();
    });

    onUnmounted(() => {
        if (loading.value) {
            closeLoading();
        }
        abortController?.abort();
        timer && clearInterval(timer);
        timer = null;
    });

    watch(runningMonitorSecondType, () => {
        currentTime.value = getLocalTime();
        selectedTime.value = getLocalTime();
        loadEquipmentTarget();
    });

    const getEquipmentTarget = async () => {
        abortController?.abort();
        try {
            abortController = new AbortController();
            const params = {
                runningMonitorSecondType: runningMonitorSecondType.value,
                instanceType: targetParams.value.instanceType,
                instanceId: targetParams.value.instanceId
            };
            const { code, data } = await getDemandTarget(params, abortController.signal);
            if (code === SUCCESSCODE) {
                equipmentTargetData.value = data;
            }
        } catch (error) {
            console.log('API 请求错误:', error);
        }
    };

    const loadEquipmentTarget = async () => {
        openLoading();
        timer && clearInterval(timer);
        timer = null;
        try {
            await getEquipmentTarget();
        } finally {
            closeLoading();
            timer = setInterval(() => {
                getEquipmentTarget();
            }, LOOP_TIME_INTERVAL);
        }
    };

    // 今日执行标准 - 使用computed确保响应式更新
    const todayOperationStandard = computed(() => {
        return {
            templateId: equipmentTargetData.value?.templateId,
            templateName: equipmentTargetData.value?.templateName,
            templateType: equipmentTargetData.value?.templateType,
            templateTag: equipmentTargetData.value?.templateTag
        };
    });

    const currentFuncTypeConfig = computed(() => {
        const configs = equipmentTargetData.value?.funcTypeConfigs || [];
        for (let i = 0; i < configs.length; i++) {
            if (configs[i].beginDateTime <= selectedTime.value && configs[i].endDateTime > selectedTime.value) {
                return { ...configs[i] };
            }
        }
        return {};
    });

    // 当前运行标准
    const currentOperationStandard = computed(() => {
        const scenes = equipmentTargetData.value?.scenes || [];
        for (let i = 0; i < scenes.length; i++) {
            if (scenes[i].beginDateTime <= selectedTime.value && scenes[i].endDateTime > selectedTime.value) {
                return { ...scenes[i] };
            }
        }
        return {};
    });

    // 临时开关回路
    // tasks数据结构如下
    /* 
    {
        taskId 任务配置 ID
        taskName 任务名称
        beginTime 开始时间
        endTime 结束时间
        createTime 创建时间
    }
    */
    const temporarySwitchCircuit = computed(() => {
        const tasks = temporarySwitchCircuitTasks.value || [];
        // 对tasks进行排序：先按startTime升序，startTime相同时按createTime升序
        return tasks.sort((a, b) => {
            const startTimeCompare = getDayjsTz(a.startTime).valueOf() - getDayjsTz(b.startTime).valueOf();
            if (startTimeCompare !== 0) {
                return startTimeCompare;
            }
            // startTime相同时，按createTime升序排序
            return getDayjsTz(a.createTime).valueOf() - getDayjsTz(b.createTime).valueOf();
        });
    });

    // 获取当天临时开关任务
    const temporarySwitchCircuitTasks = computed(() => {
        const tasks = equipmentTargetData.value?.tasks || [];
        const today = getDayjsTz().format('YYYY-MM-DD');
        const formattedTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            const {
                taskName,
                taskId,
                createTime,
                configData: { executeTimeRanges = [], config = {} }
            } = tasks[i] || {};
            for (let j = 0; j < executeTimeRanges.length; j++) {
                const range = executeTimeRanges[j];
                const [startTime, endTime] = range.split(',');
                const startTimeDay = getDayjsTz(startTime).format('YYYY-MM-DD');
                const endTimeDay = getDayjsTz(endTime).format('YYYY-MM-DD');
                if (startTimeDay <= today && endTimeDay >= today) {
                    formattedTasks.push({ startTime, endTime, taskId, taskName, settingMode: config.settingMode, createTime });
                }
            }
        }
        return formattedTasks;
    });

    // 获取当天临时开关回路 任务时间段
    const temporarySwitchCircuitTaskTime = computed(() => {
        const tasks = temporarySwitchCircuitTasks.value || [];
        // 过滤出当天的临时开关回路任务
        // 结构 { startTime: '2023-04-01 12:00:00', endTime: '2023-04-01 23:59:59' }
        const range = [];
        const today = getDayjsTz().format('YYYY-MM-DD');
        const todayStart = `${today} 00:00:00`;
        const todayEnd = `${today} 24:00:00`;
        for (let i = 0; i < tasks.length; i++) {
            const { startTime, endTime } = tasks[i];
            range.push({ startTime: todayStart > startTime ? todayStart : startTime, endTime: todayEnd < endTime ? todayEnd : endTime });
        }
        // 合并相邻的时间段
        if (range.length === 0) return range;

        // 按开始时间排序（转换为毫秒进行比较）
        range.sort((a, b) => getDayjsTz(a.startTime).valueOf() - getDayjsTz(b.startTime).valueOf());

        const merged = [range[0]];
        for (let i = 1; i < range.length; i++) {
            const current = range[i];
            const last = merged[merged.length - 1];

            // 如果当前时间段的开始时间 <= 上一个时间段的结束时间（转换为毫秒比较），则合并
            if (getDayjsTz(current.startTime).valueOf() <= getDayjsTz(last.endTime).valueOf()) {
                // 更新结束时间为两者中较晚的一个
                if (getDayjsTz(current.endTime).valueOf() > getDayjsTz(last.endTime).valueOf()) {
                    last.endTime = current.endTime;
                }
            } else {
                merged.push(current);
            }
        }

        return merged;
    });

    // 运行标准
    // scenes数据结构如下
    /*
    {
        id ID
        name 名称
        beginDateTime 开始时间
        endDateTime 结束时间
        current 是否为当前正在应用
        funcTypeConfigs 回路功能类型配置
    }
    */
    const operationStandard = computed(() => {
        return (equipmentTargetData.value?.scenes || []).map(scene => ({ ...scene, startTime: scene.beginDateTime, endTime: scene.endDateTime }));
    });

    const selectedTimeSwitchCircuitStatistic = computed(() => {
        const rest = {};
        function calculateCircuitSettings(configs) {
            configs.forEach(config => {
                const circuitSettings = config.circuitSettings || [];
                if (!rest[config.funcType]) {
                    rest[config.funcType] = {
                        funcTypeName: funcTypeInLoopList.value?.get(config.funcType)?.funcTypeName || '--',
                        total: 0,
                        open: 0,
                        close: 0,
                        // 反馈调节
                        feedback: 0
                    };
                }
                rest[config.funcType].total = rest[config.funcType].total + circuitSettings.length;
                circuitSettings.forEach(circuit => {
                    if (circuit.settingMode === 'OPEN') {
                        rest[config.funcType].open++;
                    } else if (circuit.settingMode === 'CLOSE') {
                        rest[config.funcType].close++;
                    } else if (circuit.settingMode === 'FEEDBACK_ADJUSTMENT') {
                        rest[config.funcType].feedback++;
                    }
                });
            });
        }
        calculateCircuitSettings(currentFuncTypeConfig.value?.funcTypeConfigs || []);
        return Object.values(rest) || [];
    });

    provide(equipmentTargetDataInjectKey, equipmentTargetData);
    provide(equipmentTargetSelectedTimeInjectKey, selectedTime);
    provide(equipmentTargetSelectedTimeSwitchCircuitStatisticInjectKey, selectedTimeSwitchCircuitStatistic);
    provide(equipmentTargetTemporarySwitchCircuitInjectKey, temporarySwitchCircuit);
    provide(equipmentTargetRunningMonitorSecondTypeInjectKey, runningMonitorSecondType);
    provide(equipmentTargetCurrentTimeInjectKey, currentTime);
    provide(equipmentTargetTemporarySwitchCircuitTaskTimeInjectKey, temporarySwitchCircuitTaskTime);
    provide(equipmentTargetOperationStandardInjectKey, operationStandard);
    provide(equipmentTargetCurrentOperationStandardInjectKey, currentOperationStandard);

    return {
        loading,
        openLoading,
        closeLoading,
        todayOperationStandard,
        currentOperationStandard,
        currentTime,
        selectedTime,
        runningMonitorSecondType,
        temporarySwitchCircuit,
        operationStandard,
        targetParams
    };
};
