<template>
    <div :class="['floor-info-warp', curDashboardView === DASHBOARD_VIEW_TYPE.BUILDING_FLOOR ? '' : 'disable-hover']" @click="entryFloor">
        <span class="floor-name">{{ floorData.name }} </span>
        <span v-show="showAvg" v-ellipsis class="floor-info m-ellipsis"
            >{{ `${i18n.global.t('meos_control_web.average')}${isCurrentCn() ? '' : ' '}${curDashBoardEnvName || ''}` }} : {{ floorData.avgTdbStr }}</span
        >

        <m-popover
            style="pointer-events: none"
            :disabled="!(dyncDataLoading || loading)"
            :enterable="false"
            theme="darkTransparent"
            :show-arrow="false"
            :content="i18n.global.t('meos_control_web.loading_please_wait_alt')"
        >
            <span v-if="curDashboardView === DASHBOARD_VIEW_TYPE.BUILDING_FLOOR" :class="['entry-floor-btn', !(dyncDataLoading || loading) ? '' : 'disabled-floor-btns']">{{
                i18n.global.t('meos_control_web.enter_floor')
            }}</span>
        </m-popover>
    </div>
</template>
<script setup>
import i18n, { isCurrentCn } from '@/localization';
import { dyncDataLoadingKey, loadingKey, floorFromKey, curDashBoardEnvNameKey, curDashboardViewKey } from '@/views/VentPerceptionUpgraded/hooks/useBaseHook';
import { RUNNING_MONITOR_TYPE, DASHBOARD_VIEW_TYPE, ABNORMAL_EVENT, ENV_INDEX_STANDARD_FUNC_MAP } from '@/views/VentPerceptionUpgraded/variables';

const dyncDataLoading = inject(dyncDataLoadingKey);
const curDashBoardEnvName = inject(curDashBoardEnvNameKey);
const curDashboardView = inject(curDashboardViewKey);
const floorFrom = inject(floorFromKey);
const loading = inject(loadingKey);

const props = defineProps({
    floorData: {
        type: Object,
        default: () => ({})
    },
    hoverFloor: {
        type: Boolean,
        default: false
    }
});
const emits = defineEmits(['entryFloor']);

const entryFloor = () => {
    if (curDashboardView.value === DASHBOARD_VIEW_TYPE.BUILDING_FLOOR) {
        if (!dyncDataLoading.value) {
            floorFrom.value = 'dashboard';
            emits('entryFloor', props.floorData);
        }
    }
};
const showAvg = computed(() => {
    return curDashboardView.value === DASHBOARD_VIEW_TYPE.BUILDING_FLOOR && curDashBoardEnvName.value;
});
</script>
<style lang="less">
.floor-info-warp {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    height: 32px;
    z-index: 9;
    vertical-align: middle;
    padding: 0 4px;
    border-radius: 2px;
    margin-bottom: 12px;
    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }
    &.disable-hover {
        cursor: default;
        &:hover {
            background: none;
        }
    }
    .floor-name {
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
        color: var(--gray-800);
    }

    .floor-info {
        display: inline-block;
        font-size: 14px;
        font-weight: normal;
        color: var(--gray-600);
        line-height: 22px;
    }

    .entry-floor-btn {
        min-width: fit-content;
        color: var(--blue-500);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        padding: 4px;
    }
}
.disabled-floor {
    cursor: not-allowed;
}
.disabled-floor-btns.entry-floor-btn {
    color: @grey-400;
    cursor: not-allowed;
}
</style>
