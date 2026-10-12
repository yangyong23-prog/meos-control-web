<template>
    <m-scrollbar v-if="hasParkingLoop || hasPublicLoop || loading || loadingMain" class="temporary-control" style="padding-right: 16px">
        <div class="temporary-control-top fcb">
            <m-dropdown v-if="options.length > 1" v-model="data" :options="options" :text="label" style="padding: 0" trigger="click" @change="getTaskList()"> </m-dropdown>
            <div v-else class="fs16 fw700">
                {{ `${i18n.global.t('meos_control_web.temporary_circuit_switch')}-${label}` }}
            </div>
            <SetButton size="small" @click="openNewTemporaryControl()">{{ i18n.global.t('common.new') }}</SetButton>
        </div>
        <template v-if="taskList.length">
            <div class="task-title fs12 fw700 fcc mt16 mb16">
                <span
                    >{{ i18n.global.t('meos_control_web.manual_execution') }}({{
                        instanceType === ObjectTypeEnum.Project ? i18n.global.t('meos_control_web.project') : treeBuildFloorStore().getBuildOrFloor(instanceId).localName
                    }})</span
                >
            </div>
            <ManualOrHumanOperators
                :task-list="taskList"
                :instance-type="instanceType"
                :running-monitor-second-type="data"
                :active-task="activeTask"
                @edit-task="openNewTemporaryControl"
                @delete-task="deleteTask"
                @control-task="handleControlTask"
            ></ManualOrHumanOperators>
            <div class="task-title fs12 fw700 fcc mt16 mb16">
                <span>{{ i18n.global.t('meos_control_web.timed_execution') }}</span>
            </div>
            <TimedExecution
                :task-list="taskList"
                :instance-type="instanceType"
                :running-monitor-second-type="data"
                :active-task="activeTask"
                @edit-task="openNewTemporaryControl"
                @delete-task="deleteTask"
                @control-task="handleControlTask"
            />
        </template>
        <div v-else style="position: absolute" class="wh100">
            <m-illustration :title="i18n.global.t('meos_control_web.no_content')" type="noContent" style="height: calc(100% - 32px)" class="fcc"></m-illustration>
        </div>
        <ControlForm
            v-model="isOpen"
            width="370px"
            :virtual-ref="virtualRef"
            :form-list="formList"
            :relate-form-list="extraFormList"
            @submit="handleSubmit"
            @hide="clostForm"
            @close="clostForm"
        />
    </m-scrollbar>
    <m-illustration v-else :title="i18n.global.t('meos_control_web.no_content')" type="noContent" style="height: calc(100% - 32px)" class="fcc"></m-illustration>
</template>

<script setup lang="ts">
import { CLOSE_CONTROL_FORM, getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import { INFOCODE, PARKING, PUBLIC, RUNNING_MONITOR_TYPE } from '../../variables';
import i18n from '@/localization';
import { openTemporaryControlModalKey } from '../../hooks/useTemporaryControlModal';
import ManualOrHumanOperators from './ManualOrHumanOperators.vue';
import { interventionTaskConfig, manulalControl, removeTaskConfig } from '@/apis/IndoorLighting';
import { OpenScheduledTaskModalParams, TemporaryControlTask, TemporaryControlIndexProps, ExecuteTypeEnum } from './types';
import { BaseResponse, ObjectTypeEnum, RunningMonitorSecondTypeEnum } from '@/types/common';
import useLoading from '@/hooks/useLoading';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import useWatchEffectWithCleanup from '@/hooks/useWatchEffectWithCleanup';
import ControlForm from '@/components/ObjectInfoComponents/ControlForm/index.vue';
import emitter from '@/utils/bus';
import { INFO, INTERVENTION_TIME_V2 } from '@/components/ObjectInfoComponents/ControlForm/config';
import { getNextFiveMinutePoint } from '@/utils/tools';
import dayjs from 'dayjs';
import TimedExecution from './TimedExecution.vue';
import SetButton from '@/components/common/SetButton.vue';
import { dayjsFormat, dayjsIsBefore, dayjsIsSameOrBefore, dayTz } from '@/utils/dayjsTools';
import treeBuildFloorStore from '@/store/treeBuildFloor';
import LocalTip from './LocalTip.vue';
import DockSingleton from '@/hooks/responsiveDock';
import { loopListKey } from '../../hooks/useBaseHook';
const props = withDefaults(defineProps<TemporaryControlIndexProps>(), {
    runningMonitorType: RUNNING_MONITOR_TYPE,
    hasPublicLoop: false,
    hasParkingLoop: false,
    loadingMain: false
});
const { getIotData } = DockSingleton.getInstance();
const loopList = inject(loopListKey, ref(new Map()));
const openTemporaryControlModal = inject<(data: OpenScheduledTaskModalParams) => void>(openTemporaryControlModalKey, () => {});
const isOpen = ref(false);
const virtualRef = ref();
const formList = ref<any[]>([]);
const { openLoading, closeLoading, loading } = useLoading('temporary-control', 'var(--gray-0)', 'ball', { width: '100px', height: '100px' }, 0);
const options = ref<{ key: RunningMonitorSecondTypeEnum; label: string; id: string }[]>([]);
const data = ref<RunningMonitorSecondTypeEnum>(RunningMonitorSecondTypeEnum.PublicAreaLighting);
const taskList = ref<TemporaryControlTask[]>([]);
const label = computed(() => {
    return options.value.find(item => item.key === data.value)?.label;
});
const id = computed(() => {
    return options.value.find(item => item.key === data.value)?.id;
});

const activeTaskCircuitIds = ref<string[]>([]);
const extraFormList = computed(() => {
    const loops: string[] = [];
    activeTaskCircuitIds.value?.forEach(id => {
        const iotData = getIotData(id, 'localRemoteStatus');
        if (iotData?.dataValue === INFOCODE.localRemoteStatus0.dataValue) {
            loops.push(loopList.value.get(id)?.localName || id);
        }
    });
    return loops.length ? [{ component: LocalTip, loops }] : [];
});
const openNewTemporaryControl = (val?: TemporaryControlTask) => {
    const obj: OpenScheduledTaskModalParams = {
        instanceType: props.instanceType,
        instanceId: props.instanceId,
        runningMonitorType: props.runningMonitorType,
        runningMonitorSecondType: data.value,
        runningMonitorSecondTypeId: id.value || '',
        spaceIds: props.spaceIds,
        editData: null
    };
    if (val) {
        obj.editData = val;
    } else {
        obj.editData = null;
    }
    openTemporaryControlModal?.(obj);
};
const activeTask = ref<TemporaryControlTask | null>(null);
const { cancelToken, cancelQuest } = UseCancelTokenHooks();
let pollingTimer = 0;

const getTaskList = async (withLoading = true) => {
    try {
        if (withLoading) {
            stopPolling();
            openLoading();
        }
        cancelQuest();

        const res: BaseResponse<TemporaryControlTask[]> = await interventionTaskConfig(
            {
                runningMonitorType: props.runningMonitorType,
                runningMonitorSecondType: data.value,
                instanceType: props.instanceType,
                instanceIds: props.instanceId ? [props.instanceId, ...(props.spaceIds || [])] : [],
                beginTime: getDayjsTz().format('YYYY-MM-DD HH:mm:ss')
            },
            {
                cancelToken: cancelToken()
            }
        );
        if (res.code === SUCCESSCODE) {
            (res.data || [])?.forEach(item => {
                if (item.configData.type === ExecuteTypeEnum.Manual) {
                    // 过了结束时间后任务会显示对应的开启或关闭按钮
                    const time = item.configData.executeTimeRanges?.[0]?.split(',')?.[1] || '';
                    if (time && dayjsIsSameOrBefore(time, dayTz(), 'minute')) {
                        item.configData.controlEndTime = '';
                    } else if (time) {
                        item.configData.controlEndTime = time;
                    }
                }
            });
            taskList.value = res.data || [];
            !pollingTimer && startPolling();
        }
    } catch (error) {
        console.log(error);
        taskList.value = [];
    } finally {
        if (withLoading) {
            if (props.loadingMain) {
                const unwatch = watch(
                    () => props.loadingMain,
                    val => {
                        if (!val) {
                            closeLoading();
                            unwatch();
                        }
                    }
                );
            } else {
                closeLoading();
            }
        }
    }
};
const stopPolling = () => {
    if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = 0;
    }
};
const startPolling = () => {
    stopPolling();
    pollingTimer = window.setInterval(() => {
        getTaskList(false);
    }, 10000);
};
const handleSubmit = async (params: { expireTime?: string }, done: () => void, doneLoading: () => void) => {
    try {
        const res = await manulalControl({
            taskId: activeTask.value?.taskId || '',
            controlEndTime: dayjsFormat(params.expireTime),
            runningMonitorType: props.runningMonitorType,
            runningMonitorSecondType: data.value
        });
        if (res.code === SUCCESSCODE) {
            done();
            res.data &&
                taskList.value.forEach(task => {
                    if (task.configData.type === ExecuteTypeEnum.Manual && task.taskId === activeTask.value?.taskId) {
                        task.configData.controlEndTime = dayjsFormat(params.expireTime);
                    }
                });
            getTaskList(false);
        } else {
            doneLoading();
        }
    } catch (error) {
        console.log(error);
        doneLoading();
    }
};
const clostForm = () => {
    isOpen.value = false;
    virtualRef.value = undefined;
    formList.value = [];
    activeTaskCircuitIds.value = [];
    activeTask.value = null;
};
const handleControlTask = (e: HTMLElement, task: TemporaryControlTask, needTime = true) => {
    emitter.emit(CLOSE_CONTROL_FORM);
    formList.value = [];
    activeTaskCircuitIds.value = [];
    isOpen.value = false;
    virtualRef.value = undefined;
    virtualRef.value = e;
    if (task.configData.type === ExecuteTypeEnum.Manual && needTime) {
        const spoce = `${getNextFiveMinutePoint()}-${dayjs(getNextFiveMinutePoint()).add(3, 'day').format('YYYY.MM.DD HH:mm:00')}`;
        formList.value.push(
            INTERVENTION_TIME_V2(spoce, undefined, undefined, {
                useLongterm: false
            })
        );
        activeTaskCircuitIds.value = task.configData.config?.circuitIds || [];
    } else {
        formList.value.push(INFO(i18n.global.t('meos_control_web.confirm_to_end_early')));
    }

    nextTick(() => {
        isOpen.value = true;
        activeTask.value = task;
    });
};
const deleteTask = async (task: TemporaryControlTask) => {
    try {
        const res = await removeTaskConfig({
            taskId: task.taskId
        });
        if (res.code === SUCCESSCODE && res.data) {
            taskList.value = taskList.value.filter(item => item.taskId !== task.taskId);
            getTaskList(false);
        }
    } catch (error) {
        console.log(error);
    }
};
useWatchEffectWithCleanup(() => {
    options.value = [];
    // 临时控制场景下拉选项的显示逻辑
    // 楼层下才有sceneData
    if (props.hasPublicLoop && props.sceneData !== PARKING.id) {
        options.value.push({
            label: PUBLIC.aliasName,
            key: PUBLIC.code,
            id: PUBLIC.id
        });
    }
    if (props.hasParkingLoop && props.sceneData !== PUBLIC.id) {
        options.value.push({
            label: PARKING.aliasName,
            key: PARKING.code,
            id: PARKING.id
        });
    }
    if (options.value.length > 0) {
        data.value = options.value[0].key;
    }
});
onMounted(() => {
    getTaskList();
});
onBeforeUnmount(() => {
    stopPolling();
    cancelQuest();
});
defineExpose({
    changeHandleData: getTaskList
});
</script>
<style lang="less" scoped>
.temporary-control {
    height: calc(100% - 40px);
    :deep(.m-dropdown) {
        font-weight: 700;
        font-size: 16px;
        &.dropdown-text.open,
        &.dropdown-text:hover {
            background-color: transparent;
        }
    }
    &-top {
        padding-top: 12px;
    }
    .task-title {
        position: relative;
        span {
            position: relative;
            z-index: 2;
            background-color: #ffffff;
            padding: 0 10px;
        }
        &:before {
            content: '';
            width: 100%;
            height: 1px;
            background: repeating-linear-gradient(90deg, #e6e6e6 0, #e6e6e6 4px, transparent 4px, transparent 8px);
            position: absolute;
            top: 50%;
            left: 0;
            z-index: 1;
        }
    }
}
</style>
