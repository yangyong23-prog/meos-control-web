<template>
    <div class="equip-analysis wh100">
        <Header :options="options" @back="handleModuleInfoChange" @change="changeEquipType">
            <template #left>
                <div class="ops-wrap">
                    <m-select
                        v-model="curSelectClassCode"
                        :size="200"
                        :options="classCodeOpt"
                        class="test"
                        :prefix="i18n.global.t('meos_control_web.equipment_class_colon')"
                    ></m-select>
                    <m-tree-select
                        ref="equipTreeSelectRef"
                        v-model="curSelectedEquipIds"
                        :data="equipSelOptions"
                        :size="200"
                        :prefix="i18n.global.t('meos_control_web.equipment_colon')"
                        :default-expand-all="false"
                        :selected-expand="false"
                        :popover-attrs="equipPopoverAttrs"
                        multiple
                        last-stage
                        searchable
                        panel-searchable
                        :menu-size="320"
                        @change="equipSelChange"
                    >
                    </m-tree-select>
                    <m-tree-select
                        ref="paramTreeSelectRef"
                        v-model="curSelectedParams"
                        :data="paramsSelOptions"
                        :size="200"
                        :prefix="i18n.global.t('meos_control_web.parameter')"
                        :default-expand-all="false"
                        :selected-expand="false"
                        multiple
                        last-stage
                        searchable
                        panel-searchable
                        @change="paramsSelChange"
                    >
                    </m-tree-select>
                    <m-button type="primary" size="medium" @click="doQueryAnalysisData">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </template>
        </Header>
        <div class="equip-analysis-main fcc">
            <Left :refresh-chart="refreshChart" :data="chartData" />
            <Right
                :cur-selected-time="curSelectedTime"
                :legends="rightLegends"
                :spaces="currentMapData?.spaces"
                :equipments="currentMapData?.equipments"
                :links="currentMapData?.links"
            />
        </div>
    </div>
</template>

<script setup>
import Header from '../components/Header.vue';
import Left from './Left.vue';
import Right from './Right.vue';
import useEquipAnalysis from '../hooks/useEquipAnalysis';
import { handleModuleInfoChangeKey } from '../injectionKey';
import i18n from '@/localization';

const {
    options,
    curSelectedTime,
    curSelectClassCode,
    curSelectedEquipIds,
    curSelectedParams,
    equipSelOptions,
    equipTreeSelectRef,
    refreshChart,
    paramsSelOptions,
    currentMapData,
    classCodeOpt,
    chartData,
    paramTreeSelectRef,
    equipPopoverAttrs,
    equipSelChange,
    doQueryAnalysisData,
    changeEquipType,
    paramsSelChange
} = useEquipAnalysis();

const handleModuleInfoChange = inject(handleModuleInfoChangeKey); // ==> src\views\runAnalysis\hooks\useBaseData.js

const rightLegends = computed(() => {
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
});
const timeDimension = ref(5);
</script>
<style lang="less" scoped>
.equip-analysis {
    &-main {
        height: calc(100% - 48px);
        & > div {
            height: 100%;
        }
    }
    .ops-wrap {
        display: flex;
        gap: 12px;
    }
}
</style>
