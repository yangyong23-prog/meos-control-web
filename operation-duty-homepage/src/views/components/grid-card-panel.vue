<template>
    <div class="running-monitor-panel">
        <div class="running-monitor-panel-header">{{ i18n.global.t('common.meos_home_switch_setting') }}{{ runStatus }}</div>
        <div class="running-monitor-panel-body">
            <div class="running-monitor-panel-data fcc">
                <span class="running-monitor-panel-value">
                    {{ openTime }}
                </span>
                <span class="running-monitor-panel-label"> {{ i18n.global.t('common.status_open') }} </span>
            </div>
            <div class="running-monitor-panel-data fcc">
                <span class="running-monitor-panel-value">
                    {{ closeTime }}
                </span>
                <span class="running-monitor-panel-label"> {{ i18n.global.t('common.status_close') }} </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
// @ts-ignore
import { dayTz } from '@/utils/dayjsTools';
const props = defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
});
const runStatus = computed(() => {
    if (props.data && props.data.runStatus) {
        return props.data.runStatus === 'CLOSE' ? i18n.global.t('common.status_close') : i18n.global.t('common.operation');
    }
    return '--';
});
const openTime = computed(() => {
    if (props.data && props.data.openDateTime) {
        return dayTz(props.data.openDateTime).format('HH:mm');
    } else {
        return '--';
    }
});
const closeTime = computed(() => {
    if (props.data && props.data.closeDateTime) {
        return dayTz(props.data.closeDateTime).format('HH:mm');
    } else {
        return '--';
    }
});
</script>
<style lang="less" scoped>
.running-monitor-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    .running-monitor-panel-header {
        display: flex;
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px; /* 157.143% */
    }
    .running-monitor-panel-body {
        display: flex;
        width: 100%;
        flex-grow: 1;
        flex-shrink: 0;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .running-monitor-panel-data {
            display: flex;
            gap: 4px;
            flex-grow: 1;
            align-items: center;
            justify-content: flex-start;
        }
        .running-monitor-panel-value {
            color: var(--gray-800, #2e3742);
            font-size: 24px;
            font-weight: 700;
        }
        .running-monitor-panel-label {
            color: var(--gray-900, #1b2129);
            font-size: 16px;
        }
    }
}
</style>
