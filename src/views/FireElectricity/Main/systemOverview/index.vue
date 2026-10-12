<template>
    <FoldWrap
        v-model="proxyList"
        :data="statisticsData"
        :btn-enable-num="cardSize"
        :expand-text="i18n.global.t('meos_control_web.expand_all')"
        :btn-distance-y="4"
        :type="'dashboard'"
    >
        <div class="system-overview" :style="systemItemColumn">
            <div v-for="item in proxyList" :key="item.name" class="system-overview-item">
                <div class="system-overview-item-top">
                    <span v-ellipsis class="title">{{ item.dynamicName || '--' }}</span>
                    <span v-if="itemHasAbnormalEvents(item)" class="abnormal-events"
                        >{{ i18n.global.t('meos_control_web.abnormal_event_colon')
                        }}<span class="fw700">{{ i18n.global.t('meos_control_web.certain_number', { count: item.abnormalCounts }) }}</span></span
                    >
                </div>
                <div class="system-overview-item-bottom">
                    <div class="system-overview-item-bottom-item no-click">
                        <div class="count">{{ formatNumber(item?.equipCounts) }}</div>
                        <div class="name">{{ i18n.global.t('meos_control_web.monitorable_devices') }}</div>
                    </div>
                    <div
                        v-if="itemHasAlarm(item)"
                        class="system-overview-item-bottom-item"
                        @click.stop="openSidebar(item, i18n.global.t('meos_control_web.alarm_signal_device'), 'alarm', 'system')"
                    >
                        <span class="count alarm" :class="{ isActive: isItemSelected(item, 'alarm', 'system') }">{{ item.alarmCounts }}</span>
                        <span class="name" :class="{ isActive: isItemSelected(item, 'alarm', 'system') }">{{ i18n.global.t('meos_control_web.alarm_signal') }}</span>
                    </div>
                    <div
                        v-if="itemHasFault(item)"
                        class="system-overview-item-bottom-item"
                        @click.stop="openSidebar(item, i18n.global.t('meos_control_web.fault_signal_device'), 'fault', 'system')"
                    >
                        <span class="count breakdown" :class="{ isActive: isItemSelected(item, 'fault', 'system') }">{{ item.faultCounts }}</span>
                        <span class="name" :class="{ isActive: isItemSelected(item, 'fault', 'system') }">{{ i18n.global.t('meos_control_web.fault_signal') }}</span>
                    </div>
                    <div v-if="!itemHasAlarm(item) && !itemHasFault(item)" class="no-count">{{ i18n.global.t('meos_control_web.no_anomaly_signal') }}</div>
                </div>
            </div>
        </div>
    </FoldWrap>
</template>

<script setup>
import i18n from '@/localization';
import FoldWrap from '@/components/common/FoldWrap.vue';
import useSystemOverview from '../../hooks/useSystemOverview';

defineProps({
    cardSize: {
        type: Number,
        default: 8
    }
});
const { proxyList, statisticsData, systemItemColumn, itemHasAbnormalEvents, itemHasAlarm, itemHasFault, isItemSelected, openSidebar, formatNumber } = useSystemOverview();
</script>

<style lang="less" scoped>
.system-overview {
    user-select: none;
    padding: 16px 0 0 0;
    grid-template-columns: var(--system-repeat);
    display: grid;
    gap: 12px;
    &-item {
        padding: 12px 16px;
        border-radius: 8px;
        background: #f9fcff;
        display: flex;
        flex-direction: column;
        gap: 12px;
        &-top {
            display: flex;
            align-items: center;
            gap: 8px;
            .title {
                color: var(--gray-800, #2e3742);
                font-size: 16px;
                font-weight: 700;
                line-height: 26px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-break: break-all;
            }
            .abnormal-events {
                padding: 3px 8px;
                border-radius: 2px;
                background: linear-gradient(270deg, rgba(245, 80, 71, 0.05) 0%, rgba(245, 80, 71, 0.2) 100%);
                color: var(--red-500, #f55047);
                font-size: 14px;
                font-weight: var(--platform-font-weight);
                line-height: 20px;
                white-space: nowrap;
            }
        }
        &-bottom {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            &-item {
                display: grid;
                flex-direction: column;
                gap: 8px;
                span {
                    display: block;
                }
                .count {
                    color: var(--gray-800, #2e3742);
                    font-family: 'Persagy2.0';
                    font-size: 24px;
                    font-weight: 600;
                    line-height: 24px;
                }
                .name {
                    color: var(--gray-600, #626c78);
                    font-size: 14px;
                    line-height: 14px;
                }
                .alarm {
                    color: #f18b3e;
                }
                .breakdown {
                    color: #d2ac00;
                }
                &:hover span {
                    cursor: pointer;
                    color: var(--blue-500, #246fe5);
                }
            }
            .no-count {
                color: var(--gray-600, #626c78);
                font-size: 14px;
                line-height: 54px;
            }
            .no-click {
                &:hover {
                    cursor: default;
                }
                &:hover span {
                    color: var(--gray-800, #2e3742);
                }
                &:hover .name {
                    color: var(--gray-600, #626c78);
                }
            }
        }
        &:hover .alarm,
        &:hover .breakdown {
            color: var(--blue-500, #246fe5);
        }
    }
}
.isActive {
    color: var(--blue-500, #246fe5) !important;
}
</style>
