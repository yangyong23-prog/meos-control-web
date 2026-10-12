<template>
    <div class="env-container">
        <m-scrollbar box-class="control-console-scrollbar">
            <div class="title" style="margin-top: -4px">{{ i18n.global.t('meos_control_web.abnormal_event') }}</div>
            <div class="exception-list">
                <div v-if="abnormalEventList.length">
                    <div v-for="(item, index) in abnormalEventList" :key="index" class="exception-list-item mb12" @click="abnormalInfo(item)">
                        <div v-ellipsis class="exception-list-title">
                            <span style="color: #424c59">{{ i18n.global.t('meos_control_web.inistance_find', { name: item.instancesName }) }}</span>
                            <span style="color: #f55047">{{ i18n.global.t('meos_control_web.certain_number', { count: item.problemsNumber }) }}</span>
                            <span>{{ i18n.global.t('meos_control_web.abnormal_issue_colon') }}</span>
                            <span style="color: #1b2129">{{ item.problemsName }}</span>
                        </div>
                        <div class="fcb mt12 ft" style="padding-left: 24px">
                            <div>
                                <div class="ft">{{ dayjs(+item.exceptionStartTime).format('YYYY-MM-DD HH:mm') || '- -' }}</div>
                                <div class="mt4">{{ i18n.global.t('meos_control_web.time') }}</div>
                            </div>
                            <div>
                                <div class="ft">{{ durationTime(item.duration || 0) }}</div>
                                <div class="mt4">{{ i18n.global.t('meos_control_web.continuous_duration') }}</div>
                            </div>
                            <div>
                                <div class="ft">{{ item.resolvedProblemCount || '--' }}/{{ item.allProblemCount || '--' }}</div>
                                <div class="mt4">{{ i18n.global.t('meos_control_web.resolved_all_issues') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="equipment-good fcc">
                    <SvgIcon name="good" />
                    <span class="ml8">{{ i18n.global.t('meos_control_web.current') }}</span>
                    <span style="font-weight: 700; color: #2bb462; margin-left: 5px">{{ i18n.global.t('meos_control_web.operation_status_good') }}</span>
                </div>
            </div>
            <div class="title">{{ i18n.global.t('meos_control_web.realtime_data_display') }}</div>
            <TempChart />
            <Co2Chart />
            <Information />
            <div class="title">{{ i18n.global.t('meos_control_web.related_sensor') }}</div>
            <AssociatedSensors />
        </m-scrollbar>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { durationTime } from '@/utils/viewUtils';
import { UNUSUAL_EVENTS } from '@/config';
import { isEdge, getAuthParamsString, abnormalJumpFun } from '@/utils/envUtils';
import TempChart from './tempChart.vue';
import Co2Chart from './co2Chart.vue';
import Information from './information.vue';
import AssociatedSensors from './associatedSensors.vue';

const abnormalInfo = item => {
    abnormalJumpFun(item);
};
const abnormalEventList = inject('abnormalEventList');
</script>

<style lang="less" scoped>
:deep(.control-console-scrollbar) {
    padding-right: 10px;
}
.env-container {
    height: 100%;
    margin-right: -14px;
    .title {
        padding-left: 12px;
        position: relative;
        color: var(--gray-800, #2e3742);
        font-size: 14px;
        font-weight: 700;
        height: 22px;
        line-height: 22px;
        margin: 16px 0;
        &::after {
            position: absolute;
            top: 4px;
            left: 0;
            width: 3px;
            height: 14px;
            background: var(--blue-500, #246fe5);
            content: '';
        }
    }
    .exception-list {
        padding-right: 10px;
        &-item {
            position: relative;
            padding: 12px 8px;
            border-radius: 4px;
            background: linear-gradient(90deg, #fffbfb 0.85%, rgba(255, 255, 255, 0) 96.02%);
            &:last-of-type {
                margin-bottom: 0;
            }
        }
        &-title {
            padding-left: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
        &-title:before {
            position: absolute;
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #f55047;
            border: 1px solid #fff;
            left: 10px;
            top: 18px;
        }
    }
    .exception-list-item:hover {
        cursor: pointer;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
}
</style>
