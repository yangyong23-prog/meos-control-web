<template>
    <div class="space-analysis wh100">
        <Header :options="options" @back="handleModuleInfoChange" @change="changeSpaceType">
            <template #left>
                {{ i18n.global.t('meos_control_web.project_overall_compliance_rate') }} <span style="font-weight: 600">&nbsp;{{ complianceRate }}%</span>
            </template>
        </Header>
        <div class="space-analysis-main fcc">
            <div>
                <Left :flat-building-floor-spaces="flatBuildingFloorSpaces" :loading="loading" :current-map-spaces="currentMapSpaces" />
            </div>
            <Right :only-iot-monitor-space="onlyIotMonitorSpace" :cur-selected-time="curSelectedTime" :legends="rightLegends" :spaces="currentMapSpaces" />
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import Header from '../components/Header.vue';
import Left from './Left.vue';
import Right from './Right.vue';
import useSpaceAnalysis from '../hooks/useSpaceAnalysis';
import { handleModuleInfoChangeKey } from '../injectionKey';
import { CO2, TEMPERATURE } from '../variable';
const { options, onlyIotMonitorSpace, curSelectedTime, complianceRate, flatBuildingFloorSpaces, spaceType, currentMapSpaces, loading, changeSpaceType } = useSpaceAnalysis();

const handleModuleInfoChange = inject(handleModuleInfoChangeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js
const rightLegends = computed(() => {
    if (spaceType.value === TEMPERATURE) {
        return [
            {
                name: i18n.global.t('meos_control_web.over_cooled'),
                color: 'rgba(36, 111, 229, 0.80)'
            },
            {
                name: i18n.global.t('meos_control_web.too_cool'),
                color: '#16C9E1'
            },
            {
                name: i18n.global.t('meos_control_web.comfortable'),
                color: 'rgba(63, 190, 114, 0.60)'
            },
            {
                name: i18n.global.t('meos_control_web.too_warm'),
                color: '#F90'
            },
            {
                name: i18n.global.t('meos_control_web.over_heated'),
                color: 'rgba(245, 80, 71, 0.80)'
            }
        ];
    } else if (spaceType.value === CO2) {
        return [
            {
                name: i18n.global.t('meos_control_web.compliant'),
                color: 'rgba(63, 190, 114, 0.60)'
            },
            {
                name: i18n.global.t('meos_control_web.slightly_high'),
                color: '#FFAD33'
            },
            {
                name: i18n.global.t('meos_control_web.too_high'),
                color: 'rgba(245, 80, 71, 0.80)'
            }
        ];
    }
    return [];
});
</script>
<style lang="less" scoped>
.space-analysis {
    &-main {
        height: calc(100% - 48px);
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
        & > div {
            height: 100%;
        }
    }
}
</style>
