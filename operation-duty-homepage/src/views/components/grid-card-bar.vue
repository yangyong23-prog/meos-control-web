<template>
    <div class="running-monitor-barcard">
        <div class="running-monitor-barcard-header">{{ title }}</div>
        <div class="running-monitor-barcard-body">
            <div v-ellipsis class="running-monitor-barcard-data m-ellipsis">
                <span v-for="(bar, index) in bars.filter(b => b.status === 'OPEN')" :key="index"> {{ bar.duration }}&nbsp; </span>
            </div>
            <div class="running-monitor-barcard-bar">
                <m-tips v-for="(bar, index) in bars" :key="index" :disabled="!bar.text" content="" theme="darkTransparent">
                    <template #content>
                        <div class="tip-pop">
                            <div class="popover-title">{{ bar.text }}</div>
                            <div class="popover-main">
                                {{ bar.duration }}
                            </div>
                        </div>
                    </template>
                    <div class="run-monitorbar" :class="bar.bg" :style="`width: ${bar.width};`"></div>
                </m-tips>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
// @ts-ignore
import { dayTz } from '@/utils/dayjsTools';
import { sortBy } from 'lodash';
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    data: {
        type: Object,
        default: () => ({})
    }
});

const getNum = (dateTime: string) => {
    return +dayTz(dateTime).format('H') * 60 + +dayTz(dateTime).format('m');
};
const bars = computed(() => {
    const result: any[] = [];
    const arr: any[] = [];
    if (props.data && props.data.openCloseTimes && props.data.openCloseTimes.length) {
        const periods = sortBy(props.data.openCloseTimes, ['dateTime']);
        let indicator = 0;
        periods.forEach((p, index) => {
            if (index === 0) {
                arr[indicator] = [p];
            } else if (index > 0) {
                if (p.runStatus !== periods[index - 1].runStatus) {
                    arr[indicator].push(p);
                    indicator += 1;
                    arr[indicator] = [p];
                } else {
                    arr[indicator].push(p);
                }
            }
            if (index === periods.length - 1) {
                if (p.runStatus === 'CLOSE') {
                    indicator += 1;
                    arr[indicator] = [p];
                }
            }
        });
        arr.forEach((a, index) => {
            if (index === 0) {
                const radio = getNum(a[0].dateTime) / 1440;
                if (radio > 0) {
                    result.push({
                        status: a[0].runStatus === 'CLOSE' ? 'OPEN' : 'CLOSE',
                        text:
                            a[0].runStatus === 'CLOSE'
                                ? i18n.global.t('operation_duty_homepage.meos_home_power-on_period')
                                : i18n.global.t('operation_duty_homepage.meos_home_shutdown_period'),
                        duration: `00:00-${dayTz(a[0].dateTime).format('HH:mm')}`,
                        width: `${radio * 100}%`,
                        bg: a[0].runStatus === 'CLOSE' ? 'blue-bg' : 'grey-bg'
                    });
                }
            }
            if (index <= arr.length - 1 && a.length > 1) {
                const radio = (getNum(a[a.length - 1].dateTime) - getNum(a[0].dateTime)) / 1440;
                if (radio > 0) {
                    result.push({
                        status: a[0].runStatus,
                        text:
                            a[0].runStatus === 'CLOSE'
                                ? i18n.global.t('operation_duty_homepage.meos_home_shutdown_period')
                                : i18n.global.t('operation_duty_homepage.meos_home_power-on_period'),
                        duration: `${dayTz(a[0].dateTime).format('HH:mm')}-${dayTz(a[a.length - 1].dateTime).format('HH:mm')}`,
                        width: `${radio * 100}%`,
                        bg: a[0].runStatus === 'CLOSE' ? 'grey-bg' : 'blue-bg'
                    });
                }
            }
            if (index === arr.length - 1) {
                const radio = (1440 - getNum(a[0].dateTime)) / 1440;
                if (radio > 0) {
                    result.push({
                        status: a[0].runStatus,
                        text:
                            a[0].runStatus === 'CLOSE'
                                ? i18n.global.t('operation_duty_homepage.meos_home_shutdown_period')
                                : i18n.global.t('operation_duty_homepage.meos_home_power-on_period'),
                        duration: `${dayTz(a[0].dateTime).format('HH:mm')}-24:00`,
                        width: `${radio * 100}%`,
                        bg: a[0].runStatus === 'CLOSE' ? 'grey-bg' : 'blue-bg'
                    });
                }
            }
        });
    } else {
        result.push({
            status: 'OPEN',
            text: '',
            duration: `--`,
            width: `100%`,
            bg: 'grey-bg'
        });
    }

    return result;
});
</script>
<style lang="less" scoped>
.running-monitor-barcard {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    .running-monitor-barcard-header {
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        padding: 0;
    }
    .running-monitor-barcard-body {
        padding: 16px 0;
        display: flex;
        width: 100%;
        flex-grow: 1;
        flex-shrink: 0;
        flex-direction: column;
        justify-content: center;
        .running-monitor-barcard-data {
            display: block;
            flex-direction: row;
            align-items: center;
            width: 100%;
            white-space: nowrap;
            span {
                color: var(--gray-800, #2e3742);
                font-size: 16px;
                font-style: normal;
                margin-right: 12px;
                font-weight: 700;
                white-space: nowrap;
                line-height: 19px;
                &:last-of-type {
                    margin-right: 0;
                }
            }
        }
        .running-monitor-barcard-bar {
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 2px;
            margin-top: 8px;
            background-color: var(--gray-400);
            .run-monitorbar {
                display: flex;
                height: 8px;
                flex-grow: 0;
                flex-shrink: 1;
                &:last-child {
                    flex-grow: 0;
                }
            }
            .gray-bg {
                background-color: var(--gray-400);
            }
            .blue-bg {
                background-color: var(--blue-300);
            }
        }
    }
}
</style>
