<template>
    <div :class="['unknown-risk-list-container', props.showType === 'tab' ? 'tab-wrap' : '']">
        <div v-show="props.showHeader && !isLoadingEmptyHideHeader" ref="titleRowRef" class="title-row">
            <span>{{ i18n.global.t('meos_control_web.status_unknown_risk') }}</span>
            <span>{{ `(${riskCount})` }}</span>
            <m-tips :width="'420px'" theme="darkTransparent" placement="top" trigger="hover">
                <div class="header-tips">
                    <TipsIcon />
                </div>

                <template #content>
                    <div>{{ i18n.global.t('meos_control_web.risk_event_unknown_tips_1') }}</div>
                    <br />
                    <div>{{ i18n.global.t('meos_control_web.risk_event_unknown_tips_2') }}</div>
                    <br />
                    <div>{{ i18n.global.t('meos_control_web.risk_event_unknown_tips_3') }}</div>
                </template>
            </m-tips>
        </div>

        <template v-if="props.isLoading || props.loadingDangerEvents">
            <m-list-skeleton class="custom-skeleton" />
        </template>
        <template v-else>
            <RiskListViewByObject v-if="riskCount" :risk-list="props.riskList" :show-type="showType" :top-gap="topGap" :risk-card-show-type="props.riskCardShowType" />
            <div
                v-else
                class="empty-custom-wrap"
                :style="{ paddingTop: showType === 'tab' ? '0px' : '11px', paddingBottom: showType === 'tab' ? '0px' : '8px', paddingRight: showType === 'tab' ? '0px' : '16px' }"
            >
                <m-illustration :title="props.emptyText" type="noContent">
                    <template #img>
                        <EmptyImg />
                    </template>
                </m-illustration>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TipsIcon from '@/assets/svg/machine-room/tips.svg';
import RiskListViewByObject from './RiskListViewByObject.vue';
import EmptyImg from '@/assets/images/common/empty-risk-event.svg';
import { useElementSize } from '@vueuse/core';

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    },
    loadingDangerEvents: {
        type: Boolean,
        default: false
    },
    riskList: {
        type: Array,
        default: () => []
    },
    showType: {
        type: String,
        // panel、tab
        default: 'panel'
    },
    riskCardShowType: {
        type: String,
        // unknown、riskManagement(状态不明、风险管控)
        default: 'unknown'
    },
    showHeader: {
        type: Boolean,
        default: true
    },
    emptyText: {
        type: String,
        default: i18n.global.t('meos_control_web.no_unknown_risk')
    }
});

const titleRowRef = ref();
const { height } = useElementSize(titleRowRef);
const topGap = computed(() => (props.showHeader ? (height.value ?? 0) + 16 : 0));

const riskCount = computed(() => {
    if (!props.riskList || !Array.isArray(props.riskList)) {
        return 0;
    }
    return props.riskList.reduce((acc, item) => {
        if (item.danegerEventListLength != null && typeof item.danegerEventListLength === 'number') {
            return acc + item.danegerEventListLength;
        }
        return acc;
    }, 0);
});

const isLoadingEmptyHideHeader = computed(() => {
    const isWaiting = props.isLoading || props.loadingDangerEvents;
    const isLoadingOrEmpty = isWaiting || (!isWaiting && riskCount.value === 0);
    return isLoadingOrEmpty;
});
</script>

<style lang="less" scoped>
.unknown-risk-list-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.title-row {
    display: flex;
    align-items: center;
    padding-top: 16px;

    color: var(--Grey-Grey-800, #2e3742);
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
}
.header-tips {
    margin-left: 4px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    flex-shrink: 0;
}

.custom-skeleton {
    padding-right: 16px;
    margin-top: 12px;
}

.empty-custom-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.tab-wrap {
    padding-left: 24px;

    .empty-custom-wrap {
        margin-right: 24px;
    }
}
</style>
