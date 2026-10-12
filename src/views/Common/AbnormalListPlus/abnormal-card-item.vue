<template>
    <div
        :class="{ 'card-content-item': true, 'hover-item': parentIsHover }"
        :style="{ '--default-height': `${defaultHeight}px`, '--hover-height': `${hoverHeight}px`, '--hidden-height': `${hiddenHeight}px` }"
    >
        <div ref="baseRows" class="base-default-rows">
            <div v-show="props.showHoverMultiple && instanceName" class="instance-name">{{ instanceName }}</div>
            <div class="row">
                <div class="row-left">
                    <QuestionIcon></QuestionIcon>
                    <span>{{ i18n.global.t('meos_control_web.abnormal_issue_colon') }}</span>
                </div>
                <div v-ellipsis="{ class: ['abnormal-value-name-ellipsis-class'] }" class="row-right">
                    <WidgetWrapContainer :data="problems" :name="i18n.global.t('meos_control_web.abnormal_issue')"></WidgetWrapContainer>
                </div>
            </div>
            <div class="row">
                <div class="row-left">
                    <DurationIcon></DurationIcon>
                    <span>{{ i18n.global.t('meos_control_web.continuous_duration_colon') }}</span>
                </div>
                <div class="row-right">
                    <WidgetDuration :card="props.card"></WidgetDuration>
                </div>
            </div>
        </div>
        <div
            :class="{
                'row-wrap': true,
                'no-height': !parentIsHover,
                'with-height': parentIsHover
            }"
        >
            <div class="row">
                <div class="row-left">
                    <LinkRiskIcon></LinkRiskIcon>
                    <span>{{ i18n.global.t('meos_control_web.related_risk_colon') }}</span>
                </div>
                <div class="row-right">
                    <WidgetWrapContainer :data="risks" :name="i18n.global.t('meos_control_web.related_risk')"></WidgetWrapContainer>
                </div>
            </div>
            <div class="row">
                <div class="row-left">
                    <LocationIcon></LocationIcon>
                    <span>{{ i18n.global.t('meos_control_web.located_position_colon') }}</span>
                </div>
                <div v-ellipsis="{ class: ['abnormal-value-name-ellipsis-class'] }" class="row-right m-ellipsis">
                    {{ location }}
                </div>
            </div>
        </div>
        <div
            ref="hiddenRows"
            :class="{
                'row-wrap': true,
                'hidden-wrap': true
            }"
        >
            <div class="row">
                <div class="row-left">
                    <LinkRiskIcon></LinkRiskIcon>
                    <span>{{ i18n.global.t('meos_control_web.related_risk_colon') }}</span>
                </div>
                <div class="row-right">
                    <WidgetWrapContainer :data="risks" :name="i18n.global.t('meos_control_web.related_risk')"></WidgetWrapContainer>
                </div>
            </div>
            <div class="row">
                <div class="row-left">
                    <LocationIcon></LocationIcon>
                    <span>{{ i18n.global.t('meos_control_web.located_position_colon') }}</span>
                </div>
                <div v-ellipsis="{ class: ['abnormal-value-name-ellipsis-class'] }" class="row-right m-ellipsis">
                    {{ location }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import QuestionIcon from '@/assets/svg/abnormal/question.svg';
import DurationIcon from '@/assets/svg/abnormal/duration.svg';
import LinkRiskIcon from '@/assets/svg/abnormal/link-risk.svg';
import LocationIcon from '@/assets/svg/abnormal/location.svg';

import WidgetWrapContainer from './widget/widget-wrap-container.vue';
import WidgetDuration from './widget/widget-duration.vue';

const props = defineProps({
    card: {
        type: Object,
        default: () => {}
    },
    instanceName: {
        type: String,
        default: ''
    },
    showHoverMultiple: {
        type: Boolean,
        default: false
    }
});

const parentIsHover = defineModel({ type: Boolean });
const baseRows = ref(null);
const hiddenRows = ref(null);
const { height: baseHeight } = useElementSize(baseRows);
const { height: hiddenHeight } = useElementSize(hiddenRows);

const defaultHeight = computed(() => {
    const paddingHeight = 24;
    const finalHeight = (baseHeight.value ?? 0) + paddingHeight;
    return finalHeight;
});

const hoverHeight = computed(() => {
    const paddingHeight = 24;
    const rowGapHeight = 8;
    const finalHeight = (baseHeight.value ?? 0) + rowGapHeight + paddingHeight + (hiddenHeight.value ?? 0);
    return finalHeight;
});

// 之前取值：props?.card?.problemsName
const problems = computed(() => [{ name: props?.card?.originalProblem?.nodeName || props?.card?.problemsName || '--' }]);
const risks = computed(() => {
    const arr = props?.card?.relatedRiskEvents?.length ? props?.card?.relatedRiskEvents : props?.card?.riskEvents;
    return arr?.map(s => ({ ...s, name: s?.riskEventName }));
});
const location = computed(() => {
    const arr = props?.card?.originalProblem?.relatedSpaces || [];
    if (!arr?.length) {
        return '--';
    }
    return arr?.map(s => s?.instanceName)?.join('、');
});
</script>

<style lang="css" scoped>
.card-content-item {
    display: flex;
    padding: 12px;
    flex-direction: column;
    gap: 8px;
    position: relative;
    height: var(--default-height);
    content-visibility: auto;
    contain-intrinsic-size: auto 140px;
    transform-origin: top center;
    transition: height 300ms cubic-bezier(0.25, 0.1, 0.25, 0.1);
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 12px;
        right: 12px;
        height: 1px;
        background: repeating-linear-gradient(to right, #dacdcd 0, #dacdcd 4px, transparent 4px, transparent 8px);
    }
}
.base-default-rows {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.hover-item {
    /* height: calc-size(auto, size * 1 + 4px); */
    height: var(--hover-height);
}
.instance-name {
    color: #2e3742;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
}
.row-wrap {
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 300ms cubic-bezier(0.25, 0.1, 0.25, 0.1);
}
.no-height {
    visibility: hidden;
    opacity: 0;
    height: 0;
}
.with-height {
    visibility: visible;
    opacity: 1;
    height: var(--hidden-height);
}
.hidden-wrap {
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 12px;
    width: calc(100% - 24px);
    z-index: -1;
}
.row {
    display: flex;
    align-items: flex-start;
    flex-wrap: nowrap;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    .row-left {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: fit-content;
        flex-wrap: nowrap;
        color: #626c78;
    }
    .row-right {
        color: #1b2129;
    }
}
</style>
