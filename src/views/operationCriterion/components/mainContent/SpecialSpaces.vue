<template>
    <Panel v-if="!(loaded && !specialDemandConfig?.specialTotal)" class="ocg-main-criterion-spaces" target=".ocg-main-criterion-spaces" :loading="loading">
        <div v-if="loading || specialDemandConfig?.specialTotal" ref="baseCardContainer" class="ocg-main-criterion-spaces-content">
            <HorizontalBar :num="specialDemandConfig?.specialTotal" :info="i18n.global.t('meos_control_web.demand')" />
            <ExpandablePanel class="operation-baseinfo-expandable" :default-height="showExpand ? 252 : 204" :max-height="700" :show-expand="showExpand">
                <div v-if="specialDemandConfig?.buildModule?.length" class="ocg-main-criterion-spaces-floor">
                    {{ i18n.global.t('meos_control_web.building') }}({{ specialDemandConfig?.buildModule?.length }})
                </div>
                <div v-if="specialDemandConfig?.buildModule?.length" class="ocg-main-criterion-spaces-wrap">
                    <SpaceCard v-for="(item, index) in specialDemandConfig?.buildModule" :key="index" :building="true" :item="item"></SpaceCard>
                </div>
                <div v-if="specialDemandConfig?.floorModule?.length" class="ocg-main-criterion-spaces-floor">
                    {{ i18n.global.t('meos_control_web.floor') }}({{ specialDemandConfig?.floorModule?.length }})
                </div>
                <div v-if="specialDemandConfig?.floorModule?.length" class="ocg-main-criterion-spaces-wrap">
                    <SpaceCard v-for="(item, index) in specialDemandConfig?.floorModule" :key="index" :item="item"></SpaceCard>
                </div>
                <div v-if="specialDemandConfig?.functionModule?.length" class="ocg-main-criterion-spaces-floor">
                    {{ i18n.global.t('meos_control_web.space_type') }}({{ specialDemandConfig?.functionModule?.length }})
                </div>
                <div v-if="specialDemandConfig?.functionModule?.length" class="ocg-main-criterion-spaces-wrap">
                    <SpaceCard v-for="(item, index) in specialDemandConfig?.functionModule" :key="index" :item="item"></SpaceCard>
                </div>
                <div v-if="specialDemandConfig?.spaceModule?.length" class="ocg-main-criterion-spaces-floor">
                    {{ i18n.global.t('common.space') }}({{ specialDemandConfig?.spaceModule?.length }})
                </div>
                <div v-if="specialDemandConfig?.spaceModule?.length" class="ocg-main-criterion-spaces-wrap">
                    <SpaceCard v-for="(item, index) in specialDemandConfig?.spaceModule" :key="index" :item="item"></SpaceCard>
                </div>
            </ExpandablePanel>
        </div>
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Panel from '../common/panel.vue';
import HorizontalBar from '../common/horizontalBar.vue';
import ExpandablePanel from '../common/ExpandablePanel.vue';
import SpaceCard from './spaceCard.vue';
import { currentDateKey } from '@/views/operationCriterion/constant';
import { useProjectValueHook } from '@/views/operationCriterion/hooks/usePreviewSpecialDemandConfig';
const baseCardContainer = ref();
const currentDate = inject(currentDateKey);
const screenWidth = ref(window.innerWidth);
const { loading, loaded, getSpecialDemandConfig, specialDemandConfig } = useProjectValueHook();
onMounted(async () => {
    await getSpecialDemandConfig(currentDate.value);
});

const BASE_CARD_WIDTH = 500;
const HUMIDITY_PART_WIDTH = 280;
const PRESSURE_DIFF_PART_WIDTH = 280;
const CARD_GAP = 8;

const MODULE_KEYS = ['floorModule', 'buildModule', 'functionModule', 'spaceModule'];

function calcCardTotalWidth(cfg) {
    const len = cfg?.length;
    if (len === 0) return 0;
    const cardsWidth = cfg.reduce((sum, v) => {
        const { isRhQualityEnabled, isPressureDiffQualityEnabled } = v || {};
        return sum + BASE_CARD_WIDTH + (isRhQualityEnabled ? HUMIDITY_PART_WIDTH : 0) + (isPressureDiffQualityEnabled ? PRESSURE_DIFF_PART_WIDTH : 0);
    }, 0);
    return cardsWidth + CARD_GAP * (len - 1);
}

function isOnlyActiveModule(cfg, activeKey) {
    return MODULE_KEYS.every(k => (k === activeKey ? (cfg?.[k]?.length ?? 0) > 0 : (cfg?.[k]?.length ?? 0) === 0));
}

const showExpand = computed(() => {
    if (!baseCardContainer.value) return true;

    const config = specialDemandConfig.value;
    const curWindowWidth = screenWidth.value || baseCardContainer.value.clientWidth || 0;

    for (const key of MODULE_KEYS) {
        if (isOnlyActiveModule(config, key)) {
            return calcCardTotalWidth(config[key]) > curWindowWidth;
        }
    }

    return true;
});

let resizeHandler;
onMounted(() => {
    resizeHandler = () => {
        screenWidth.value = document.documentElement.clientWidth;
    };
    window.addEventListener('resize', resizeHandler);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
});
watch(
    () => currentDate.value,
    async () => {
        await getSpecialDemandConfig(currentDate.value);
    }
);
</script>
<style lang="less" scoped>
.ocg-main-criterion-spaces {
    --panel-gap-vertical: 12px;
    min-height: 112px;
    .ocg-main-criterion-spaces-content {
        min-height: 112px;
    }
}
.ocg-main-criterion-spaces-floor {
    color: var(--gray-800, #2e3742);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px; /* 137.5% */
    margin-bottom: 8px;
}
.ocg-main-criterion-spaces-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 8px;
    padding-bottom: 28px;
    flex-wrap: wrap;
}
</style>
