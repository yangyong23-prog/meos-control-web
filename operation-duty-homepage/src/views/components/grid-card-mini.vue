<template>
    <div class="running-monitor-minicard-layout">
        <span class="running-monitor-minicard-label"> {{ title + i18n.global.t('operation_duty_homepage.meos_home_dot') }} </span>
        <span class="running-monitor-minicard-value ffw"> {{ dataValue }} </span>
    </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    unit: {
        type: String,
        default: ''
    },
    infoCode: {
        type: String,
        default: ''
    },
    infoCodeValue: {
        type: String,
        default: ''
    }
});
const dataValue = computed(() => {
    if (props.infoCodeValue) {
        return props.infoCodeValue;
    }
    return '--';
});
console.log(props.infoCodeValue);
</script>
<style lang="less" scoped>
.running-monitor-minicard-layout {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
    align-items: center;
    .running-monitor-minicard-label {
        color: var(--gray-800, #2e3742);

        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
    }
    .running-monitor-minicard-value {
        color: var(--gray-800, #2e3742);
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
    }
}
</style>
