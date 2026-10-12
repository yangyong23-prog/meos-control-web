<template>
    <div :class="['floor-info-warp']" @click="entryFloor">
        <span class="floor-name">{{ floorData.name }} </span>
        <span v-show="floorEnvName" v-ellipsis class="floor-info m-ellipsis">{{ computedAvg }} : {{ averageValue }}</span>

        <span :class="['entry-floor-btn']">{{ enterFloor }}</span>
    </div>
</template>
<script setup>
import i18n, { isCurrentCn } from '@/localization';
import { inject, computed } from 'vue';
import { dashboardCurrentEnvInjectKey, dashboardEnvTabsInjectKey } from '../hooks/useDashboard';
// 进入楼层始终展示，不再置灰，不再等待地图加载完成后才允许进入楼层

const props = defineProps({
    floorData: {
        type: Object,
        default: () => ({})
    },
    averageValue: {
        type: String,
        default: '--'
    }
});
const emits = defineEmits(['entryFloor']);
const { t } = i18n.global;

const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);
const dashboardEnvTabs = inject(dashboardEnvTabsInjectKey);
const floorEnvName = computed(() => {
    return dashboardEnvTabs.value?.find(v => v?.id === dashboardCurrentEnv.value)?.name;
});
const computedAvg = computed(() => {
    return `${t('meos_control_web.average')}${isCurrentCn() ? '' : ' '}${floorEnvName.value || ''}`;
});

const enterFloor = computed(() => {
    return t('meos_control_web.enter_floor');
});

const entryFloor = () => {
    if (props.floorData) {
        emits('entryFloor', props.floorData);
    }
};
</script>
<style lang="less">
.floor-info-warp {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    vertical-align: middle;
    padding: 0 4px;
    border-radius: 4px;
    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }

    .floor-name {
        font-size: 18px;
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
</style>
