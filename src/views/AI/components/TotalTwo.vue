<template>
    <div class="space-total">
        <div class="iot-and-legend fcb">
            <slot name="left"></slot>
            <div class="legend fcc">
                <div v-for="item in legendList" :key="item.name" class="legend-item fcc">
                    <div class="legend-item-color" :style="{ background: item.color }"></div>
                    <div>{{ item.name }}</div>
                </div>
            </div>
        </div>
        <div v-if="spaceType === DEMAND" class="total-box" style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 28px">
            <div v-ellipsis class="total-box-left m-ellipsis">
                <span class="total-box-title">{{ i18n.global.t('meos_control_web.earliest_hvac_demand_time_colon') }}</span>
                <span>
                    {{ earliestSpace.min?.hasTime?.startStr ?? '--' }}
                    <m-tips
                        v-if="earliestSpace.mins.length > 1"
                        theme="darkTransparent"
                        :content="earliestSpace.mins.map(item => item.spaceName).join('、')"
                        width="420px"
                        placement="bottom"
                    >
                        <I18nSlot html-tag="span" name-key="meos_control_web.spaces" :plural="earliestSpace.mins.length">
                            <template #num>
                                <span style="color: var(--blue-500)">{{ earliestSpace.mins.length }}</span>
                            </template>
                        </I18nSlot>
                    </m-tips>
                    <template v-else>{{ earliestSpace.min?.spaceName }}</template>
                </span>
            </div>
            <div v-ellipsis class="total-box-right m-ellipsis">
                <span class="total-box-title">{{ i18n.global.t('meos_control_web.latest_hvac_demand_time_colon') }}</span>
                <span>
                    {{
                        earliestSpace.max?.noTime?.startStr === '23:45'
                            ? '24:00'
                            : earliestSpace.max?.noTime?.startStr
                            ? dayjs(`2020.02.02 ${earliestSpace.max?.noTime?.startStr}`).add(15, 'minute').format('HH:mm')
                            : '--'
                    }}
                    <m-tips
                        v-if="earliestSpace.maxs.length > 1"
                        theme="darkTransparent"
                        :content="earliestSpace.maxs.map(item => item.spaceName).join('、')"
                        width="420px"
                        placement="bottom"
                    >
                        <I18nSlot html-tag="span" name-key="meos_control_web.spaces" :plural="earliestSpace.maxs.length">
                            <template #num>
                                <span style="color: var(--blue-500)">{{ earliestSpace.maxs.length }}</span>
                            </template>
                        </I18nSlot>
                    </m-tips>
                    <template v-else>{{ earliestSpace.max?.spaceName }}</template>
                </span>
            </div>
        </div>
        <div v-else-if="spaceType === DISPATCH" class="total-box fc" style="background-color: var(--gray-50)">
            <div class="label-left">{{ i18n.global.t('meos_control_web.space_temperature') }}(℃)</div>
            <div class="total-box-tdbs" :style="`grid-template-columns: repeat(${tdbColors.length}, 1fr)`">
                <div v-for="(item, i) in tdbColors" :key="item.code" class="tdb-item">
                    <div class="tdb-item-text fcb">
                        <template v-if="isArray(item.text)">
                            <span class="text-box">{{ item.text[0] }}</span>
                            <span>{{ item.text[1] }}</span>
                        </template>
                        <template v-else>
                            <span class="text-box">{{ item.text }}</span>
                            <span v-if="i === tdbColors.length - 1">{{ item.end }}</span>
                        </template>
                    </div>
                    <div :style="`background-color: ${item.color};height: 10px`"></div>
                </div>
            </div>
        </div>
        <div v-else-if="spaceType === HUMIDITY" class="total-box fc" style="background-color: var(--gray-50)">
            <div class="label-left">{{ i18n.global.t('meos_control_web.space_humidity') }}(%RH)</div>
            <div class="total-box-tdbs" :style="`grid-template-columns: repeat(${tdbColors.length}, 1fr)`">
                <div v-for="(item, i) in tdbColors" :key="item.code" class="tdb-item">
                    <div class="tdb-item-text fcb">
                        <template v-if="isArray(item.text)">
                            <span class="text-box">{{ item.text[0] }}</span>
                            <span>{{ item.text[1] }}</span>
                        </template>
                        <template v-else>
                            <span class="text-box">{{ item.text }}</span>
                            <span v-if="i === tdbColors.length - 1">{{ item.end }}</span>
                        </template>
                    </div>
                    <div :style="`background-color: ${item.color};height: 10px`"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import I18nSlot from '@/components/I18nSlot.vue';
import { isArray, maxBy, minBy, orderBy } from 'lodash';
import { DEMAND_TAGS, DEMAND, DISPATCH, HUMIDITY, DEMAND_STATUS } from '../variable';
import dayjs from 'dayjs';
const props = defineProps({
    spaceType: {
        type: String,
        default: DEMAND
    },
    spaceList: {
        type: Array,
        default: () => []
    },
    tdbColors: {
        type: Array,
        default: () => []
    }
});

const legendList = computed(() => {
    return props.spaceType === DEMAND ? [DEMAND_TAGS[DEMAND_STATUS.BUSINESS], DEMAND_TAGS[DEMAND_STATUS.AIR]] : [];
});
const earliestSpace = computed(() => {
    const list = props.spaceList.filter(item => item.type === 'space');
    list.forEach(item => {
        const timeRanges = orderBy(item.timeRanges, ['startStr']);
        item.hasTimeIndex = timeRanges.findIndex(time => time.status === DEMAND_STATUS.AIR);
        item.hasTime = timeRanges[item.hasTimeIndex];
        item.noTimeIndex = timeRanges.findLastIndex(time => time.status === DEMAND_STATUS.AIR);
        item.noTime = timeRanges[item.noTimeIndex];
    });
    const hasTimeList = list.filter(v => {
        return (v?.hasTimeIndex ?? 0) >= 0;
    });
    const hasNoTimeList = list.filter(v => {
        return (v?.noTimeIndex ?? 0) >= 0;
    });
    const min = minBy(hasTimeList, 'hasTimeIndex');
    const max = maxBy(hasNoTimeList, 'noTimeIndex');
    const mins = list.filter(item => item?.hasTimeIndex === min?.hasTimeIndex);
    const maxs = list.filter(item => item?.noTimeIndex === max?.noTimeIndex);
    return {
        min,
        max,
        mins,
        maxs
    };
});
</script>
<style lang="less" scoped>
.space-total {
    margin-bottom: 28px;
    padding: 0 20px;
    .iot-and-legend {
        padding: 8px 0;
        padding-top: 16px;
        .legend {
            gap: 16px;
            &-item-color {
                width: 12px;
                height: 12px;
                border-radius: 2px;
                margin-right: 5px;
            }
        }
    }
    .total-box {
        padding: 8px 12px;
        min-height: 38px;
        border-radius: 4px;
        background-color: var(--blue-50);
        gap: 16px;
        line-height: 22px;
        .total-box-tdbs {
            display: grid;
            width: calc(100% - 85px);
            .tdb-item {
                .text-box {
                    transform: translateX(-50%);
                }
                &:first-child {
                    .text-box {
                        transform: translateX(0);
                    }
                }
                &:last-child {
                    .tdb-item-text {
                        text-align: right;
                    }
                }
            }
        }
        .total-box-left {
            text-align: left;
        }
        .total-box-right {
            text-align: right;
        }
    }
    .total-box-title {
        color: var(--gray-600);
    }
}

.label-left {
    min-width: fit-content;
    align-self: start;
}
</style>
