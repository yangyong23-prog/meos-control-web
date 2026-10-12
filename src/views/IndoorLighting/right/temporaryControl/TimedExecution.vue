<template>
    <div class="timed-execution">
        <TimedTaskList
            v-if="timedTasks.length"
            :list="timedTasks"
            :active-task="activeTask"
            :instance-type="props.instanceType"
            :running-monitor-second-type="props.runningMonitorSecondType"
            :show-control="showControl"
            @edit-task="handleEdit"
            @delete-task="handleDelete"
            @control-task="handleControlTask"
            @time-ranges="handleTimeRanges"
        />
        <div v-else class="empty fcc">
            {{ i18n.global.t('meos_control_web.no_content') }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ExecuteTypeEnum, TimedTask, TaskProps, TimedTaskEmitHandlers, TaskEmit } from './types';
import TimedTaskList from './TimedTaskList.vue';
import i18n from '@/localization';

const props = withDefaults(defineProps<TaskProps>(), {
    taskList: () => [],
    instanceType: '',
    runningMonitorSecondType: '',
    showControl: true
});

const emits = defineEmits<TimedTaskEmitHandlers>();

const timedTasks = computed<TimedTask[]>(() => {
    return props.taskList.filter((t): t is TimedTask => t.configData.type !== ExecuteTypeEnum.Manual && t.runningMonitorSecondType === props.runningMonitorSecondType);
});
const handleEdit = (task: TimedTask) => {
    emits(TaskEmit.EditTask, task);
};

const handleDelete = (task: TimedTask) => {
    emits(TaskEmit.DeleteTask, task);
};
const handleControlTask = (e: HTMLElement, task: TimedTask) => {
    emits(TaskEmit.ControlTask, e, task);
};
const handleTimeRanges = (times: { startTime: string; endTime: string }[]) => {
    emits(TaskEmit.TimeRanges, times);
};
</script>

<style scoped lang="less">
.timed-execution {
    .empty {
        color: var(--gray-600);
        border-radius: 4px;
        background-color: var(--gray-50);
        padding: 12px;
    }
    .task-list {
        .task-row {
            background-color: var(--gray-50);
            border: 1px solid var(--gray-200);
            border-radius: 4px;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            & + .task-row {
                margin-top: 8px;
            }
            .task-name {
                width: calc(100% - 160px);
                display: flex;
                align-items: center;
                .task-name-title {
                    max-width: 100%;
                }
                .icon-btn {
                    display: none;
                    cursor: pointer;
                    margin-left: 8px;
                }
            }
            .task-time {
                width: 140px;
                text-align: right;
                color: var(--gray-500);
                font-size: 12px;
            }
            &:hover {
                .task-name .icon-btn {
                    display: inline-flex;
                }
            }
        }
    }
}
</style>
