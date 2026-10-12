<template>
    <div class="floor-info-warp" @click="entryFloor">
        <span class="floor-name">{{ floorData.name }} </span>
        <span class="floor-info">{{ floorInfoStr }} : {{ floorData.avgTdbStr }}</span>
        <span v-if="hoverFloor && !mapStaticDataLoading" class="entry-floor-btn">{{ i18n.global.t('meos_control_web.enter_floor') }}</span>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { dashboardCurrentEnvInjectKey } from '../hooks/useDashboard';
import { mapStaticDataLoadingKey } from '../constant/symbols';
const dashboardCurrentEnv = inject(dashboardCurrentEnvInjectKey);
const mapStaticDataLoading = inject(mapStaticDataLoadingKey);

const floorInfoStr = computed(() => {
    if (dashboardCurrentEnv.value === 'tdb') {
        return `${i18n.global.t('meos_control_web.avg_temperature')}`;
    } else if (dashboardCurrentEnv.value === 'o2') {
        return `${i18n.global.t('meos_control_web.avg_o2')}`;
    } else if (dashboardCurrentEnv.value === 'cO') {
        return `${i18n.global.t('meos_control_web.avg_co')}`;
    } else if (dashboardCurrentEnv.value === 'nH3') {
        return `${i18n.global.t('meos_control_web.avg_nh3')}`;
    } else if (dashboardCurrentEnv.value === 'h2S') {
        return `${i18n.global.t('meos_control_web.avg_h2s')}`;
    } else {
        return ``;
    }
});

// avgCo2Str
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
    if (props?.hoverFloor && !mapStaticDataLoading?.value) {
        emits('entryFloor', props.floorData);
    }
};
</script>
<style lang="less">
.floor-info-warp {
    width: 100%;
    height: 100%;
    display: inline-block;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 4px;
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
        font-size: 14px;
        font-weight: normal;
        color: var(--gray-600);
        line-height: 22px;
    }

    .entry-floor-btn {
        color: var(--blue-500);
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
        padding: 4px;
    }
}
</style>
