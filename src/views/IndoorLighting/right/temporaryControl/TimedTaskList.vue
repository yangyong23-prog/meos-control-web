<template>
    <div class="task-list">
        <div v-for="item in taskList" :key="item.taskId" class="task-row" :class="{ 'show-pop': activeId === item.taskId, 'active-task': activeTask?.taskId === item.taskId }">
            <div class="fcb">
                <div class="task-name fc">
                    <div class="task-name-title fc">
                        <div v-ellipsis class="m-ellipsis">{{ item.taskName }}&nbsp;</div>
                        <m-tag v-if="item.nowDay" color="var(--blue-700)" bg-color="var(--blue-100)" size="small">
                            {{ i18n.global.t('meos_control_web.today2') }}
                        </m-tag>
                        <m-tag v-if="item.configData.config.settingMode === SettingModeEnum.Open" color="var(--green-700)" bg-color="var(--green-100)" size="small">
                            {{ i18n.global.t('meos_control_web.on') }}
                        </m-tag>
                        <m-tag v-else-if="item.configData.config.settingMode === SettingModeEnum.Close" color="var(--gray-900)" bg-color="var(--gray-200)" size="small">
                            {{ i18n.global.t('meos_control_web.off') }}
                        </m-tag>
                    </div>
                    <template v-if="showControl">
                        <SetDiv class="fcc" :content="i18n.global.t('common.edit')" show-tip>
                            <template #default="{ disabled }">
                                <div class="icon-btn" :style="{ 'pointer-events': disabled ? 'none' : 'auto' }" @click.stop="emit(TaskEmit.EditTask, item)">
                                    <IconMeriActionEditor :size="14" :color="disabled ? 'var(--gray-600)' : 'var(--gray-900)'" />
                                </div>
                            </template>
                        </SetDiv>
                        <SetDiv class="fcc" :content="i18n.global.t('common.delete')" show-tip>
                            <template #default="{ disabled }">
                                <div class="icon-btn" :style="{ 'pointer-events': disabled ? 'none' : 'auto' }">
                                    <m-popconfirm
                                        :content="i18n.global.t('meos_control_web.confirm_delete_message')"
                                        status="primary"
                                        :cancel-button-text="i18n.global.t('common.cancel')"
                                        :confirm-button-text="i18n.global.t('common.confirm')"
                                        @confirm="emit(TaskEmit.DeleteTask, item)"
                                        @show="showTip(item.taskId)"
                                        @hide="hideTip()"
                                    >
                                        <IconMeriActionDelete :size="14" :color="disabled ? 'var(--gray-600)' : 'var(--gray-900)'" />
                                    </m-popconfirm>
                                </div>
                            </template>
                        </SetDiv>
                    </template>
                </div>
                <slot name="status" :item="item">
                    <SetButton v-if="item.isActiveTime && showControl" size="small" type="link" @click="e => handleControl(e, item)">
                        {{ i18n.global.t('meos_control_web.early_termination') }}
                    </SetButton>
                </slot>
            </div>
            <div class="task-time">
                <template v-if="item.configData.type === ExecuteTypeEnum.Multi">
                    <div class="task-time-multi">{{ i18n.global.t('meos_control_web.repeat_for_days', { days: getDays(item) }) }}({{ formatTimeRange(item, '') }})</div>
                    <div class="task-time-text">
                        {{
                            item.configData.config.settingMode === SettingModeEnum.Open
                                ? i18n.global.t('meos_control_web.auto_open_time')
                                : i18n.global.t('meos_control_web.auto_close_time')
                        }}
                        : <span class="fw700 ffCP" style="color: var(--gray-900)">{{ formatDaysTime(item) }}</span>
                    </div>
                </template>
                <template v-else>
                    {{
                        item.configData.config.settingMode === SettingModeEnum.Open
                            ? i18n.global.t('meos_control_web.auto_open_time')
                            : i18n.global.t('meos_control_web.auto_close_time')
                    }}
                    :
                    <span class="fw700 ffCP" style="color: var(--gray-900)">{{ formatTimeRange(item) }}</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import i18n from '@/localization';
import { IconMeriActionEditor, IconMeriActionDelete } from 'meri-icon';
import SetButton from '@/components/common/SetButton.vue';
import SetDiv from '@/components/common/SetDiv.vue';
import { TaskEmit, TimedTaskEmitHandlers, TimedTask, TimedTaskListProps, SettingModeEnum, ExecuteTypeEnum } from './types';
import dayjs from 'dayjs';
import { useWatchWithCleanup } from '@/hooks/useWatchEffectWithCleanup';
import { dayjsIsBetween, dayjsIsSame, dayTz } from '@/utils/dayjsTools';

const props = withDefaults(defineProps<TimedTaskListProps>(), {
    list: () => [],
    showControl: true
});

const emit = defineEmits<TimedTaskEmitHandlers>();

const taskList = ref<TimedTask[]>([]);
const handleControl = (e: HTMLElement, task: TimedTask) => {
    emit(TaskEmit.ControlTask, e, task);
};
const activeId = ref('');
const showTip = (id: string) => {
    activeId.value = id;
};
const hideTip = () => {
    activeId.value = '';
};

const formatTimeRange = (task: TimedTask, format = ' HH:mm') => {
    const start = dayjs(task.beginTime);
    const end = dayjs(task.endTime);
    const isSameDay = start.isSame(end, 'day');
    const isSameYear = start.isSame(end, 'year');
    if (isSameDay) {
        if (task.configData.type === ExecuteTypeEnum.Multi) {
            return `${start.format(`MM.DD${format}`)} ~ ${end.format(`MM.DD${format}`)}`;
        } else {
            return `${start.format(`MM.DD${format}`)} ~ ${end.format(format)}`;
        }
    }
    if (isSameYear) {
        return `${start.format(`MM.DD${format}`)} ~ ${end.format(`MM.DD${format}`)}`;
    }
    return `${start.format(`YYYY.MM.DD${format}`)} ~ ${end.format(`YYYY.MM.DD${format}`)}`;
};
const formatDaysTime = (task: TimedTask) => {
    const start = dayjs(task.beginTime);
    const end = dayjs(task.endTime);
    if (task.configData.acrossDay) {
        return `${start.format('HH:mm')} ~ ${i18n.global.t('meos_control_web.next_day')}${end.format('HH:mm')}`;
    }
    return `${start.format('HH:mm')} ~ ${end.format('HH:mm')}`;
};
const getDays = (task: TimedTask) => {
    const start = dayjs(task.beginTime.split(' ')[0]);
    const end = dayjs(task.endTime.split(' ')[0]);
    const isSameDay = start.isSame(end, 'day');
    if (isSameDay) {
        return 1;
    }
    return end.diff(start, 'day') + 1;
};
useWatchWithCleanup(
    () => props.list,
    list => {
        taskList.value = list;
        // 定时开关任务若是执行中（开始时间≤当前时间＜结束时间）则会是激活状态
        taskList.value = taskList.value.map(it => {
            const now = dayTz();
            const ranges = it.configData?.executeTimeRanges || [];
            it.isActiveTime = ranges.some(rangeStr => {
                const [startStr, endStr] = rangeStr.split(',');
                if (!startStr || !endStr) return false;
                return dayjsIsBetween(now, startStr, endStr, 'ms', '[]');
            });
            it.nowDay = ranges
                .filter(rangeStr => {
                    const [, endStr] = rangeStr.split(',');
                    return endStr && dayTz(endStr).isAfter(now);
                })
                .some(rangeStr => {
                    const [startStr] = rangeStr.split(',');
                    return startStr && dayjsIsSame(now, startStr, 'day');
                });
            return it;
        });

        taskList.value.sort((a, b) => {
            const now = dayTz();
            const getEffectiveStart = (it: TimedTask) => {
                const ranges = it.configData?.executeTimeRanges || [];
                const parsedRanges = ranges
                    .map(r => r.split(','))
                    .filter(p => p.length === 2)
                    .map(p => ({ start: dayTz(p[0]), end: dayTz(p[1]) }))
                    .sort((r1, r2) => (r1.start.isBefore(r2.start) ? -1 : 1));

                // 获取待执行或执行中的最早时段
                const currentOrFuture = parsedRanges.find(r => r.end.isAfter(now));
                // 如果都有没执行完的，取最早那个；如果都执行完了，取第一个作为基准
                return currentOrFuture ? currentOrFuture.start : parsedRanges[0]?.start || dayTz(it.beginTime);
            };

            const startA = getEffectiveStart(a);
            const startB = getEffectiveStart(b);

            if (!startA.isSame(startB)) {
                return startA.isBefore(startB) ? -1 : 1;
            }
            // 时间段相同时，按创建时间升序排列
            return dayTz(a.createTime).isBefore(dayTz(b.createTime)) ? -1 : 1;
        });
    },
    {
        immediate: true
    }
);
</script>

<style scoped lang="less">
.task-list {
    .task-row {
        background-color: var(--gray-50);
        border: 1px solid var(--gray-200);
        border-radius: 4px;
        padding: 10px;
        & + .task-row {
            margin-top: 8px;
        }
        .task-name {
            width: calc(100% - 64px);
            padding-right: 8px;
            min-height: 28px;
            .task-name-title {
                max-width: 100%;
            }
            .icon-btn {
                align-items: center;
                border-radius: 2px;
                cursor: pointer;
                display: none;
                height: 16px;
                margin: 0 4px;
                width: 16px;
            }
            :deep(.set-div) {
                display: inline-flex;
                & + .set-div {
                    margin-left: 0;
                }
            }
        }
        &:hover {
            background-color: var(--blue-50);
            border-color: var(--blue-500);
            .task-name {
                .task-name-title {
                    max-width: calc(100% - 40px);
                }
                .icon-btn {
                    display: flex;
                }
            }
        }
        &.show-pop {
            .task-name {
                .task-name-title {
                    max-width: calc(100% - 40px);
                }
                .icon-btn {
                    display: flex;
                }
            }
        }
        &.active-task {
            background-color: var(--blue-50);
            border-color: var(--blue-500);
        }
    }
    .task-time {
        color: var(--gray-600);
    }
}
</style>
