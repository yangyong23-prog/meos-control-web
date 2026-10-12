<template>
    <m-tips v-if="number !== 0" :content="content" theme="darkTransparent">
        <div class="state-tag fcc" :class="[state]" @click="jump">
            <VueSvg :width="20" :height="20" :path="svgPath" />
            <div class="fcc" :style="{ height: '20px' }">{{ number }}</div>
            <VueSvg v-if="state === 'error'" :path="right" />
        </div>
    </m-tips>
</template>

<script setup>
import i18n from '@/localization';
import warnSvg from '@/assets/svg/warn.svg';
import errorSvg from '@/assets/svg/error.svg';
import offlineSvg from '@/assets/svg/offline.svg';
import right from '@/assets/svg/right.svg';
import VueSvg from './VueSvg.vue';
import { JumpAlarmFun } from '@/utils/envUtils';

const props = defineProps({
    state: {
        type: String,
        default: ''
    },
    number: {
        type: Number,
        default: 0
    }
});

const svgPaths = {
    warn: warnSvg,
    error: errorSvg,
    offline: offlineSvg
};
const tipTexts = {
    warn: i18n.global.t('operation_duty_homepage.meos_home_anti-control_inconsistent_equipment'),
    error: i18n.global.t('operation_duty_homepage.meos_home_abnormal_event_with_high_severity'),
    offline: i18n.global.t('operation_duty_homepage.meos_home_offline_device')
};

const svgPath = computed(() => svgPaths[props.state] || offlineSvg);

const tipText = computed(() => tipTexts[props.state] || i18n.global.t('operation_duty_homepage.meos_home_offline_device'));
const content = computed(() => {
    return i18n.global.t('operation_duty_homepage.meos_home_num', [tipText.value, props.number]);
});
const jump = () => {
    if (props.state === 'error') {
        JumpAlarmFun('/anomalous-event');
    }
};
</script>

<style lang="less" scoped>
.state-tag {
    padding: 0 4px;
    color: var(--gray-0);
    border-radius: var(--big-radius);
    gap: 2px;
    cursor: default;
    & + .state-tag {
        margin-left: 4px;
    }
    &.warn {
        background: var(--orange-600);
    }
    &.error {
        background: var(--red-500);
        cursor: pointer;
    }
    &.offline {
        background: var(--gray-500);
    }
}
</style>
