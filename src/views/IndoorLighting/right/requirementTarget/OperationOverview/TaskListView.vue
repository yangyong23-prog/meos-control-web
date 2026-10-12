<template>
    <div class="task-list">
        <div v-for="item in taskList" :key="item.taskId + item.startTime" class="task-row">
            <div class="fcb">
                <div class="task-name fc">
                    <div class="task-name-title fc">
                        <div v-ellipsis class="m-ellipsis">{{ item.taskName }}&nbsp;</div>
                        <m-tag v-if="item.settingMode === SettingModeEnum.Open" color="var(--green-700)" bg-color="var(--green-100)" size="small">
                            {{ i18n.global.t('meos_control_web.on') }}
                        </m-tag>
                        <m-tag v-else-if="item.settingMode === SettingModeEnum.Close" color="var(--gray-900)" bg-color="var(--gray-200)" size="small">
                            {{ i18n.global.t('meos_control_web.off') }}
                        </m-tag>
                    </div>
                </div>
            </div>
            <div style="color: var(--gray-600)">
                {{ item.settingMode === SettingModeEnum.Open ? i18n.global.t('meos_control_web.open_time') : i18n.global.t('meos_control_web.close_time') }}：
                <span class="fw700 ffCP">{{ formatTimeRange(item) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="js">
import i18n from '@/localization';
import dayjs from 'dayjs';
import { dayjsIsBetween, dayjsIsSame, dayTz } from '@/utils/dayjsTools';

const ExecuteTypeEnum = {
    Immediately: 'immediately',
    Manual: 'manual',
    Multi: 'multi',
    Once: 'once'
};

/**
 * 照明回路配置
 * @property {Close} Close 关闭
 * @property {NotConfigured} NotConfigured 未配置
 * @property {Open} Open 开启
 */
const SettingModeEnum = {
    Close: 'CLOSE',
    NotConfigured: 'NOT_CONFIGURED',
    Open: 'OPEN'
}

const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})

const taskList = ref([]);

const formatTimeRange = (task, format = ' HH:mm') => {
    const start = dayjs(task.startTime);
    const end = dayjs(task.endTime);
    const isSameDay = start.isSame(end, 'day');
    const isSameYear = start.isSame(end, 'year');
    if (isSameDay) {
        return `${start.format(`MM.DD${format}`)} ~ ${end.format(format)}`;
    }
    if (isSameYear) {
        return `${start.format(`MM.DD${format}`)} ~ ${end.format(`MM.DD${format}`)}`;
    }
    return `${start.format(`YYYY.MM.DD${format}`)} ~ ${end.format(`YYYY.MM.DD${format}`)}`;
};

watch(
    () => props.list,
    list => {
        taskList.value = (list || []);
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
            width: 100%;
            padding-right: 8px;
            min-height: 28px;
            .task-name-title {
                width: 100%;
            }
        }
        &:hover {
            background-color: var(--blue-50);
            border-color: var(--blue-500);
        }
    }
    .task-time {
        color: var(--gray-600);
    }
}
</style>
