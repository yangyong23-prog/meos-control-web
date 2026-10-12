<template>
    <template v-if="durationString === ''"> -- </template>
    <template v-else>
        <span>{{ durationString }}</span>
        <span class="time-tips">
            <template v-if="isLapTop">
                <m-tips theme="darkTransparent" placement="bottom" :popover-class="'custom-widget-duration-popover'">
                    <template #content>
                        <span>{{ `(${i18n.global.t('meos_control_web.departure_time_colon')}${cardStartTime})` }}</span>
                    </template>
                    <span> {{ `(${cardStartTime})` }}</span>
                </m-tips>
            </template>
            <span v-else>{{ `(${i18n.global.t('meos_control_web.departure_time_colon')}${cardStartTime})` }}</span>
        </span>
    </template>
</template>

<script setup>
import i18n, { isCurrentCn } from '@/localization';
import dayjs from 'dayjs';
import { useBreakpoints } from '@vueuse/core';
import { currentTimeKey } from '../useAbnormalGroup';
const props = defineProps({
    card: {
        type: Object,
        default: () => {}
    }
});

const cardStartTime = computed(() => {
    if (!props.card?.exceptionStartTime) {
        return '--';
    }

    const final = dayjs.tz(+props.card?.exceptionStartTime).format('YYYY-MM-DD HH:mm');
    return final;
});

const breakpoints = useBreakpoints({
    laptop: 0,
    desktop: 1600
});
const activeBreakpoint = breakpoints.active();
const isLapTop = computed(() => activeBreakpoint.value === 'laptop');
const currentTime = inject(currentTimeKey);
const durationString = ref('');

const formatDuration = minutes => {
    if (minutes === undefined || minutes === null) return '';

    const mins = Number(minutes);
    if (mins < 60) {
        return i18n.global.t('meos_control_web.less_than_one_hour');
    }

    const hours = Math.round(mins / 60);
    const days = Math.floor(hours / 24);
    const dayStr = days > 0 ? i18n.global.t('meos_control_web.num_day', { num: days }, { plural: days }) : '';
    const hourStr = hours > 0 ? i18n.global.t('meos_control_web.num_hour', { num: hours % 24 }, { plural: hours % 24 }) : '';

    return `${dayStr}${isCurrentCn() ? '' : ' '}${hourStr}`;
};

watch(
    [() => props?.card?.duration, () => props?.card?.exceptionStartTime, () => currentTime?.value],
    ([curDuration, curStartTime, curTime]) => {
        if (curTime && curStartTime) {
            const startTime = dayjs(+curStartTime);
            const endTime = dayjs(curTime);
            const duration = endTime.diff(startTime, 'minutes', true);
            const showString = formatDuration(duration);
            durationString.value = showString;
        } else if (curDuration?.toString()) {
            durationString.value = formatDuration(curDuration);
        }
    },
    {
        immediate: true
    }
);
</script>

<style lang="less" scoped>
.time-tips {
    color: var(--gray-500, #8b949e);
    margin-left: 4px;
}
</style>
<style lang="less">
.custom-widget-duration-popover {
    pointer-events: none;
}
</style>
