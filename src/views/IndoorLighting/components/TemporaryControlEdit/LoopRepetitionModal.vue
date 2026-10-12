<template>
    <m-modal v-model:visible="repeatErrShow" :append-to="$modalAppendTo" :footer="false" :width="840" :title="i18n.global.t('meos_control_web.loop_repetition')">
        <template #content>
            <div class="repeat-err-container">
                <div class="repeat-err-desc">{{ i18n.global.t('meos_control_web.loop_repetition_error_desc') }}</div>
                <m-table :columns="columnsList" :data-source="tableData" :show-header="false"></m-table>
            </div>
        </template>
    </m-modal>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
const props = defineProps({
    errData: {
        type: Array,
        default: () => []
    }
});
const repeatErrShow = defineModel(false);

const columnsList = ref([
    {
        dataIndex: 'name',
        title: i18n.global.t('meos_control_web.loop_name'),
        ellipsis: true,
        width: 237
    },
    {
        dataIndex: 'loopOnOffReason',
        title: i18n.global.t('meos_control_web.loop_on_off_reason'),
        width: 232
    },
    {
        dataIndex: 'timePeriod',
        title: i18n.global.t('meos_control_web.time_range_period'),
        width: 295
    }
]);

const formatTimeRange = (task, format = ' HH:mm') => {
    const start = dayjs(task.beginTime);
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

const getDays = task => {
    const start = dayjs(task.beginTime);
    const end = dayjs(task.endTime);
    const isSameDay = start.isSame(end, 'day');
    if (isSameDay) {
        return 1;
    }
    return end.diff(start, 'day') + 2;
};
const formatRepeatDays = task => {
    return `${i18n.global.t('meos_control_web.repeat_for_days', { days: getDays(task) })}(${formatTimeRange(task, '')})`;
};
const formatDaysTime = (task, configData) => {
    const start = dayjs(task.beginTime);
    const end = dayjs(task.endTime);
    if (configData.acrossDay) {
        return `${start.format('HH:mm')} ~ ${i18n.global.t('meos_control_web.next_day')}${end.format('HH:mm')}${formatRepeatDays(task)}`;
    }
    return `${start.format('HH:mm')} ~ ${end.format('HH:mm')}${formatRepeatDays(task)}`;
};
const tableData = computed(() => {
    // console.log('props.errList: ', props.errData);
    return props.errData
        ?.map(obj => {
            const { localName, config } = obj;

            const { taskName, timeSlot, configData } = config ?? {};
            // if (!timeSlot || !configData) return;
            const { type } = configData;
            let timeRangeText = '';
            // 人工手动执行的话
            if (type === 'manual') {
                const timeStr = configData?.executeTimeRanges?.find(obj => true);
                if (timeStr) {
                    const timeArr = timeStr.split(',');
                    if (timeArr?.length > 1) {
                        timeRangeText = formatTimeRange({ beginTime: timeArr[0], endTime: timeArr[1] });
                    }
                }
            } else if (timeSlot?.length > 0) {
                if (type === 'multi') {
                    timeRangeText = formatDaysTime(timeSlot[0], configData);
                } else {
                    timeRangeText = formatTimeRange(timeSlot[0]);
                }
            }
            return {
                name: localName ?? '--',
                loopOnOffReason: taskName,
                timePeriod: timeRangeText
            };
        })
        .filter(Boolean);
});
</script>
<style lang="less" scoped>
.repeat-err-container {
    display: flex;
    padding-bottom: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex-shrink: 0;
    .repeat-err-desc {
        color: var(--Grey-Grey-600, #626c78);
        font-size: 14px;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
}
</style>
