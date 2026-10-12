<template>
    <div class="line-infos m-ellipsis">
        <div class="line-info">
            <span class="line-info-label">{{ i18n.global.t('meos_control_web.daily_scheduling_duration_colon') }}</span>
            <span class="line-info-value"> {{ data?.hour1 }} </span>
        </div>
        <div class="line-info">
            <span class="line-info-label">{{ i18n.global.t('meos_control_web.continuous_schedulable_duration_colon') }}</span>
            <span class="line-info-value"> {{ data?.hour2 }} </span>
        </div>
        <div class="line-info line-info-overflow">
            <span class="line-info-label">{{ i18n.global.t('meos_control_web.non_dispatchable_period_colon') }}</span>
            <div v-ellipsis class="line-info-value m-ellipsis" v-html="data?.range"></div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
</script>
<style lang="less" scoped>
.line-infos {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 4px;
    flex-wrap: wrap;
    gap: 8px 16px;
    padding: 7px 16px;
    width: 100%;
    max-width: 100%;
    background: linear-gradient(90deg, rgba(196, 201, 207, 0.2) 0%, rgba(196, 201, 207, 0.04) 100%);
    .line-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        &.line-info-overflow {
            flex-shrink: 1;
            min-width: 0;
            width: 100%;
            .line-info-value {
                display: block;
            }
        }
        .line-info-label {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
        .line-info-value {
            color: #000;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
        }
    }
}
</style>
