<template>
    <div class="container-warp">
        <span class="label" :style="{ width: '100%' }">{{ i18n.global.t('meos_control_web.start_time_colon') }}</span>
        <m-input-number
            v-model="year"
            placeholder=""
            :precision="0"
            :max="date.getFullYear()"
            :min="date.getFullYear() - 1"
            text-align="center"
            controls="rightButton"
            class="input-number"
            :width="isFullScreen ? '60px' : '50px'"
            :style="{ height: '28px' }"
        >
        </m-input-number>
        <span class="label">{{ i18n.global.t('common.unit_year') }}</span>
        <m-input-number
            v-model="month"
            placeholder=""
            type="number"
            :precision="0"
            :max="12"
            :min="1"
            text-align="center"
            controls="rightButton"
            class="input-number"
            :width="isFullScreen ? '60px' : '36px'"
            :style="{ height: '28px' }"
        >
        </m-input-number>
        <span class="label">{{ i18n.global.t('common.monthUnit') }}</span>
        <m-input-number
            v-model="day"
            placeholder=""
            :precision="0"
            :max="31"
            :min="1"
            text-align="center"
            controls="rightButton"
            class="input-number"
            :width="isFullScreen ? '60px' : '36px'"
            :style="{ height: '28px' }"
        >
        </m-input-number>
        <span class="label">{{ i18n.global.t('common.unit_day') }}</span>
        <m-input-number
            v-model="hour"
            :precision="0"
            placeholder=""
            :max="23"
            :min="0"
            text-align="center"
            controls="rightButton"
            class="input-number"
            :width="isFullScreen ? '60px' : '36px'"
            :style="{ height: '28px' }"
        >
        </m-input-number>
        <span class="label">:</span>
        <m-input-number
            v-model="minute"
            :precision="0"
            placeholder=""
            :max="59"
            :min="0"
            text-align="center"
            controls="rightButton"
            class="input-number"
            :width="isFullScreen ? '60px' : '36px'"
            :style="{ height: '28px' }"
        >
        </m-input-number>
        <div class="fc" :style="{ width: '100%', gap: '8px' }">
            <span class="label">{{ i18n.global.t('meos_control_web.playback_duration') }}</span>
            <div class="fc last-time">
                <m-input-number
                    v-model="lastTime"
                    placeholder=""
                    :precision="0"
                    :max="1440"
                    :min="1"
                    text-align="center"
                    controls="rightButton"
                    class="input-number"
                    :width="isFullScreen ? '60px' : '36px'"
                    :style="{ height: '28px', borderRadius: 0, borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px' }"
                >
                </m-input-number>
                <div class="fc fcol last-action">
                    <arrow-up :class="lastTime === 1440 ? 'disable' : 'arrow-up'" @click.stop="increase"></arrow-up>
                    <arrow-down :class="lastTime === 1 ? 'disable' : 'arrow-down'" @click.stop="reduce"></arrow-down>
                </div>
            </div>
            <span class="label">{{ i18n.global.t('meos_control_web.minute') }}</span>
        </div>

        <m-button type="primary" size="small" @click.stop="confirm">{{ i18n.global.t('common.confirm') }}</m-button>
    </div>
</template>

<script setup>
import ArrowUp from '@/assets/images/common/arrow_up.svg';
import ArrowDown from '@/assets/images/common/arrow_down.svg';
import { $Message } from 'meri-plus';
import i18n from '@/localization';
import { calculateExpiryTime, formatDateTime, validateDateNinetyDays } from '../MutiplePlayer/utils';

const emit = defineEmits(['confirm']);

const isFullScreen = inject('isFullScreen');

let date = new Date(Date.now() - 2 * 60 * 60 * 1000);

const year = ref(date.getFullYear());
const month = ref(date.getMonth() + 1);
const day = ref(date.getDate());
const hour = ref(date.getHours());
const minute = ref(date.getMinutes());
const lastTime = ref(120);

const increase = () => {
    lastTime.value = Math.min(lastTime.value + 1, 1440);
};
const reduce = () => {
    lastTime.value = Math.max(lastTime.value - 1, 1);
};

const startTime = computed(() => {
    return `${year.value}-${month.value}-${day.value} ${hour.value}:${minute.value}:00`;
});

const confirm = () => {
    try {
        const st = formatDateTime(startTime.value);
        if (validateDateNinetyDays(st)) {
            $Message.error({
                title: i18n.global.t('meos_control_web.only_last_90_days_allowed')
            });
        } else {
            if (!lastTime.value) {
                $Message.error({
                    title: i18n.global.t('meos_control_web.playback_duration_empty')
                });
            }
            const endTime = calculateExpiryTime(st, lastTime.value);
            emit('confirm', st, endTime);
        }
    } catch (error) {
        if (error) {
            $Message.error({
                title: i18n.global.t('meos_control_web.start_time_input_error')
            });
        }
    }
};

defineExpose({
    confirm
});
</script>

<style lang="scss" scoped>
.container-warp {
    display: flex;
    align-items: center;
    row-gap: 8px;
    column-gap: 4px;
    border-radius: 4px;
    background: #f1f4f6;
    width: 100%;
    flex-wrap: wrap;
    padding: 8px;
    .label {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
    }
    .last-action {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        background: #ffffff;
        border-left: 1px solid #e1e5eb;
        height: 28px;
        width: 16px;
        .arrow-up {
            &:hover {
                cursor: pointer;
                :deep(path) {
                    fill: #246fe5;
                }
            }
        }
        .arrow-down {
            &:hover {
                cursor: pointer;
                :deep(path) {
                    fill: #246fe5;
                }
            }
        }
        .disable {
            :deep(path) {
                fill: #c4c9cf;
            }
            &:hover {
                cursor: not-allowed;
            }
        }
    }
    .dash {
        // flex: 1;
        flex-grow: 1;

        // width: 100px;
        min-width: 0;
    }
    .input-number {
        border-radius: 4px;
        height: 28px;
        overflow: hidden;
        :deep(.m-input-number-rightButton) {
            border: none;
            padding: 0;
        }
        &:focus-within {
            border: 1px solid var(--blue-500, #246fe5);
        }
    }
    .last-time {
        overflow: 'hidden';
        border-radius: '4px';
    }
}
</style>
