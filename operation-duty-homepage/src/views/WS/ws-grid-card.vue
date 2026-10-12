<template>
    <div ref="contentElementRef" :class="['ws-grid-card-layout', width < 200 - 24 ? 'small' : 'large']">
        <div class="ws-grid-card-header">
            <div class="ws-grid-card-title">
                <Title class="ws-grid-title" :path="getPath(item.classCode)">{{ item.name }}</Title>
            </div>
        </div>
        <div class="ws-grid-card-content">
            <div v-if="item.levelAlarm != undefined" class="ws-grid-card-item">
                <div class="ws-grid-card-item-warn ffb">
                    {{ getLevelAlarm(item.levelAlarm) }}
                </div>
                <div v-ellipsis class="ws-grid-card-item-label">{{ i18n.global.t('operation_duty_homepage.meos_home_level_alarm_signal') }}</div>
            </div>
            <div v-if="item.equipmentTotal" class="ws-grid-card-item">
                <RunNumber :show-label="false" :value="item.runningTotal" :total="item.equipmentTotal" />
                <div v-ellipsis class="ws-grid-card-item-label">
                    {{ item.classCode === 'WSDWPP' ? i18n.global.t('operation_duty_homepage.meos_home_feed_pump') : i18n.global.t('common.submersible_sewage_pump')
                    }}{{ i18n.global.t('common.operation') }}
                </div>
            </div>
            <div v-if="showPie" class="ws-grid-card-item ws-grid-card-pie-wrap">
                <div class="ws-grid-card-pie">
                    <Pie
                        :data="{
                            value: item.runningTotal,
                            total: item.equipmentTotal
                        }"
                        :color="pieColor"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
import { useElementSize } from '@vueuse/core';
import Title from '@/components/Title.vue';
import RunNumber from '@/components/RunNumber.vue';
import Pie from '@/components/echarts/Pie.vue';
import { isNumber } from 'lodash';
const contentElementRef = ref();
const { width } = useElementSize(contentElementRef);
const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    showPie: {
        type: Boolean,
        default: false
    },
    pieColor: {
        type: String,
        default: '#14C4C4'
    }
});
const getLevelAlarm = level => {
    if (isNumber(level)) {
        return level;
    }
    return '--';
};
const getPath = classCode => {
    if (classCode === 'WSDWPP') {
        return '/WS';
    } else {
        return '/ws-sewage-treatment';
    }
};
</script>
<style lang="less" scoped>
.ws-grid-card-layout {
    width: 100%;
    display: flex;
    flex-grow: 1;
    gap: 8px;
    flex-direction: column;
    &.small {
        .ws-grid-card-content {
            .ws-grid-card-item {
                &:first-of-type {
                    width: 84px;
                    flex-grow: 1;
                }
                flex-shrink: 1;
                flex-basis: auto;
                flex-grow: 1;
                min-width: 0;
                width: auto;
            }
        }
    }
    .ws-grid-title {
        padding: 0;
    }
    .ws-grid-card-content {
        display: flex;
        flex-direction: row;
        .ws-grid-card-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 50%;
            box-sizing: border-box;
            min-width: 50%;
            align-items: flex-start;
            justify-content: flex-start;
            &.ws-grid-card-pie-wrap {
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
            }
            &:first-of-type {
                flex-basis: 84px;
                padding-right: 4px;
            }
            .ws-grid-card-item-warn {
                font-size: 24px;
                font-weight: 700;
                line-height: 30px;
                color: var(--red-500, #f55047);
            }
            .ws-grid-card-item-label {
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                color: var(--gray-600, #626c78);
                line-height: 22px;
                width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
        .ws-grid-card-pie {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: flex-end;
        }
        .ws-grid-card-item + .ws-grid-card-item {
            padding-left: 4px;
        }
    }
}
</style>
