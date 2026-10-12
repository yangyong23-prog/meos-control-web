<template>
    <div v-if="energyStatisticsList?.length" class="energy-left-energy-statistics">
        <Title>{{ i18n.global.t('meos_control_web.energy_statistics_kwh') }}</Title>
        <div class="energy-statistics-content">
            <div
                v-for="item in energyStatisticsList"
                :key="item.name"
                :class="{ canClick: item.energyModelId }"
                class="energy-statistics-content-box bg-box"
                @click="itemInfo(item)"
            >
                <NameValue :data="item.value" :name="item.name" />
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Title from '@/components/Title.vue';
import NameValue from '../../components/NameValue.vue';
import { openWebsite } from '@/utils/websiteNavigation';
import { getAuthParamsString } from '@/utils/envUtils';
import { globalTimeKey } from '../../injectionKey';
import { CLOUD_ORIGIN, ENERGY_ENERGY_SINGLE_PROJECT } from '@/config';

defineProps({
    energyStatisticsList: {
        type: Array,
        default: () => []
    }
});
const globalTime = inject(globalTimeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const itemInfo = item => {
    const { energyModelId, itemId } = item;
    if (energyModelId) {
        openWebsite(ENERGY_ENERGY_SINGLE_PROJECT, {
            params: `energyModelId=${energyModelId}&itemId=${itemId}&time=${globalTime.value}&${getAuthParamsString()}`,
            newPage: true,
            origin: CLOUD_ORIGIN || ''
        });
    }
};
</script>
<style lang="less" scoped>
.energy-left-energy-statistics {
    margin-bottom: 28px;
}
.energy-statistics-content {
    display: grid;
    grid-template-columns: 50% 50%;
    gap: 8px;
    margin-top: 12px;
    &-box {
        padding: 12px;
        &.canClick {
            cursor: pointer;
            &:hover {
                background: var(--blue-50);
            }
        }
    }
}
</style>
