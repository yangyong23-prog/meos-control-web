<template>
    <Panel class="ocg-special-partial" target=".ocg-special-partial" :loading="loading">
        <div class="ocg-special-partial-container">
            <Title :title="i18n.global.t('meos_control_web.hvac_operating_mode_standard')" />
            <Panel
                v-if="globalConfig?.seasonCondition === 'ACSeason-1'"
                :label="i18n.global.t('meos_control_web.cooling_mode_standard')"
                class="ocg-special-partial-container-panel"
            >
                <div v-if="hasSomeCold" class="ocg-spc-p-wrap">
                    <div class="ocg-spc-p-contain">
                        <PartialCard v-for="(item, index) in coolingSeasons" :key="index" :item="item.systemConfig"></PartialCard>
                    </div>
                    <template v-for="(item, index) in globalConfig?.workCondition.coolingSeason" :key="index">
                        <div v-if="item.pumpConfig?.length" class="dashed-divider"></div>
                        <CardTree v-if="item.pumpConfig?.length" :system="item.systemConfig" :items="item.pumpConfig" />
                    </template>
                </div>
                <div v-else class="ocg-scp-empty">
                    <p>{{ i18n.global.t('meos_control_web.no_content') }}</p>
                </div>
            </Panel>
            <Panel
                v-if="globalConfig?.seasonCondition === 'ACSeason-2'"
                :label="i18n.global.t('meos_control_web.heating_mode_standard')"
                label-class="label-og"
                class="ocg-special-partial-container-panel"
            >
                <div v-if="hasSomeHeat" class="ocg-spc-p-wrap">
                    <div class="ocg-spc-p-contain">
                        <PartialCard v-for="(item, index) in heatingSeasons" :key="index" :item="item.systemConfig"></PartialCard>
                    </div>
                    <template v-for="(item, index) in globalConfig?.workCondition.heatingSeason" :key="index">
                        <div v-if="item.pumpConfig?.length" class="dashed-divider"></div>
                        <CardTree v-if="item.pumpConfig?.length" :system="item.systemConfig" :items="item.pumpConfig" />
                    </template>
                </div>
                <div v-else class="ocg-scp-empty">
                    <p>{{ i18n.global.t('meos_control_web.no_content') }}</p>
                </div>
            </Panel>
        </div>
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Panel from '../common/panel.vue';
import Title from '../common/title.vue';
import PartialCard from './partialCard.vue';
import CardTree from './cardTree.vue';
import Empty from '@/components/common/Empty.vue';
import { currentDateKey, globalConfigKey } from '@/views/operationCriterion/constant';
defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    isHeatingSeason: {
        type: Boolean,
        default: false
    },
    isCoolingSeason: {
        type: Boolean,
        default: false
    }
});

const currentDate = inject(currentDateKey);
const globalConfig = inject(globalConfigKey);
const heatingSeasons = computed(() => {
    if (globalConfig.value?.workCondition?.heatingSeason && globalConfig.value?.workCondition.heatingSeason?.length) {
        return globalConfig.value?.workCondition.heatingSeason.filter(h => {
            if (h?.pumpConfig?.length) {
                // 仅展示一次泵, 提前退出
                return false;
            }
            if (h.systemConfig?.supplyTempName || h.systemConfig?.chillWaterDetaSetName || h?.systemConfig?.tempAndPressureSetList?.length) {
                return true;
            } else {
                return false;
            }
        });
    }
    return [];
});
const coolingSeasons = computed(() => {
    if (globalConfig.value?.workCondition?.coolingSeason && globalConfig.value?.workCondition.coolingSeason?.length) {
        return globalConfig.value?.workCondition.coolingSeason.filter(h => {
            if (h?.pumpConfig?.length) {
                // 仅展示一次泵, 提前退出
                return false;
            }
            if (h.systemConfig?.supplyTempName || h.systemConfig?.chillWaterDetaSetName || h?.systemConfig?.tempAndPressureSetList?.length) {
                return true;
            } else {
                return false;
            }
        });
    }
    return [];
});
const hasSomeHeat = computed(() => {
    const hasFirstLevel = heatingSeasons?.value?.length;
    const hasSecondLevel = globalConfig.value?.workCondition?.heatingSeason?.some(v => v?.pumpConfig?.length);
    return hasFirstLevel || hasSecondLevel;
});
const hasSomeCold = computed(() => {
    const hasFirstLevel = coolingSeasons?.value?.length;
    const hasSecondLevel = globalConfig.value?.workCondition?.coolingSeason?.some(v => v?.pumpConfig?.length);
    return hasFirstLevel || hasSecondLevel;
});
</script>
<style lang="less" scoped>
.ocg-special-partial {
    padding: 24px 0px;
    gap: 0px;
    width: 100%;
    min-height: 108px;
    display: flex;
    flex-direction: column;
    .ocg-special-partial-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        .ocg-special-partial-container-panel {
            padding: 64px 48px 48px 32px;
            border-radius: 8px;
            gap: 48px;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--gray-300, #e1e5eb);
            background: var(--gray-50, #f7f9fa);
            --panel-padding-horizonal: 0;
            .ocg-spc-p-wrap {
                gap: 48px;
                display: flex;
                flex-direction: column;
            }
            .ocg-scp-empty {
                text-align: center;
            }
            .ocg-spc-p-contain {
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                flex-direction: row;
                flex-wrap: wrap;
                gap: 12px;
                width: 100%;
                justify-content: space-between;
            }
            .dashed-divider {
                width: 100%;
                border-bottom: 1px dashed rgba(196, 201, 207, 1);
            }
        }
    }
}
</style>
