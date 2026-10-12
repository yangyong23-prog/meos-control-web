<template>
    <div class="abnormal-item" @click="abnormalJump(item)">
        <div class="fc">
            <p v-ellipsis class="abnormal-info">
                {{ i18n.global.t('meos_control_web.inistance_find', { name: item.instancesName })
                }}<span class="num">{{ i18n.global.t('meos_control_web.certain_number', { count: item.problemsNumber }) }}</span
                >{{ i18n.global.t('meos_control_web.abnormal_issue_colon') }}{{ isEmpty(item.problemsName) }}
            </p>
            <span class="tag" :style="{ color: importanceDegree(item).textColor, backgroundColor: importanceDegree(item).bgColor }">{{ importanceDegree(item).name }}</span>
        </div>
        <p class="abnormal-time">
            {{ i18n.global.t('meos_control_web.departure_time_colon') }}
            <span class="time-num">{{ dayjs.tz(+item.exceptionStartTime).format('YYYY-MM-DD HH:mm') }}</span>
        </p>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
import dayjs from 'dayjs';
import { isEmpty } from '@/utils/tools';
import { durationTime, importanceDegree } from '@/utils/viewUtils';
import { abnormalJumpFun } from '@/utils/envUtils';

const props = defineProps(['item']);

const item = computed(() => props?.item);

const abnormalJump = (val: any) => {
    abnormalJumpFun(val);
};
</script>
<style lang="less" scoped>
.abnormal-item {
    position: relative;
    padding: 12px;
    border-radius: 4px;
    background: var(--red-50, #fff5f5);
    font-size: 14px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
    margin-right: 16px;

    &:hover {
        background: @grey-alpha-30;
        border-radius: 4px;
        cursor: pointer;
    }

    & + .abnormal-item {
        margin-top: 8px;
    }

    .abnormal-info {
        color: @grey-700;
        max-height: 44px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;

        .num {
            color: var(--red-500);
        }
    }
    .tag {
        align-self: flex-start;
        margin-left: 4px;
        border-radius: 2px;
        padding: 0 4px;
        font-size: 12px;
        line-height: 20px;
        white-space: nowrap;
    }

    .abnormal-time {
        color: @grey-500;
        margin-top: 8px;
    }
}
</style>
