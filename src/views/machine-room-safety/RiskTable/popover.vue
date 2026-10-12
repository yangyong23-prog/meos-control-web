<template>
    <m-popover ref="popoverRef" class="risk-value-popver" trigger="click" @show="shows">
        <template #content>
            <div class="risk-value-popver-content">
                <div v-for="item in data.equipments" :key="item.id" class="risk-value-popver-box">
                    <div class="risk-value-popver-title">{{ item.localName ?? '--' }}</div>
                    <div v-for="(value, valueIndex) in item.danegerEventList" :key="value.id" class="risk-value-popver-item" @click="riskInfo(value, item)">
                        <Interest v-if="value.followMark" class="interest" />
                        <div :style="{ marginLeft: isMargin && !value.followMark ? '14px' : '0', width: '100%' }">
                            <m-tips :content="i18n.global.t('meos_control_web.open_new_tab_risk_event')" theme="darkTransparent">
                                <div class="risk-value-popver-item-title">{{ value.name }}</div>
                            </m-tips>
                            <div class="risk-value-popver-item-time">{{ i18n.global.t('meos_control_web.update_time_colon') }}{{ value.updateTime }}</div>
                            <div v-if="valueIndex !== item.danegerEventList.length - 1" class="line"></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <slot></slot>
    </m-popover>
</template>
<script setup>
import i18n from '@/localization';
import Interest from '@/assets/svg/interest.svg';
import { riskJumpFun } from '@/utils/envUtils';
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
});
const isScroll = inject('isScroll');
const getProblemCount = propsData => {
    const equipments = propsData?.data?.equipments;
    if (!Array.isArray(equipments) || equipments.length === 0) {
        return 0;
    }
    // 计算存在 import 为 true 的问题的数量
    const flagCount = equipments.reduce((count, item) => {
        if (item.danegerEventList && Array.isArray(item.danegerEventList)) {
            const followMark = item.danegerEventList.some(child => child.followMark);
            return count + (followMark ? 1 : 0);
        }
        return count;
    }, 0);
    return flagCount;
};

const isMargin = computed(() => {
    return getProblemCount(props);
});

const riskInfo = (value, item) => {
    console.log(value, item);
    riskJumpFun(Object.assign(value, { localName: (item.localName || item.name) ?? '--' }));
};
const shows = () => {
    if (isScroll?.value) {
        isScroll.value = false;
    }
};
const popoverRef = ref();
watchEffect(() => {
    if (isScroll?.value) {
        popoverRef?.value?.manuallyHide();
    }
});
</script>
<style lang="less" scoped>
.risk-value-popver-content {
    max-height: 462px;
    overflow: auto;
    .risk-value-popver-box {
        margin-bottom: 20px;
        .risk-value-popver-title {
            color: var(--gray-900, #1b2129);
            font-size: 14px;
            font-weight: 700;
            line-height: 24px;
            margin-bottom: 12px;
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            z-index: 2;
            background-color: white;
        }
        .risk-value-popver-item {
            width: 100%;
            font-size: 14px;
            display: flex;
            justify-content: flex-start;
            .interest {
                width: 13px;
                height: 13px;
                margin-right: 2.5px;
                margin-top: 3px;
            }
            &-title {
                color: var(--gray-900, #1b2129);
                margin-bottom: 4px;
                word-break: break-all;
                &:hover {
                    cursor: pointer;
                    color: var(--blue-500, #246fe5);
                }
            }
            &-time {
                color: var(--gray-600, #626c78);
            }
            .line {
                width: 100%;
                height: 1px;
                background: #e1e5eb;
                margin: 12px 0;
            }
        }
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
<style lang="less">
.risk-value-popver {
    padding: 16px 20px !important;
    max-width: 387px;
    max-height: 494px;
}
</style>
