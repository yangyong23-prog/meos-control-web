<template>
    <Panel v-if="rules.length" class="ocg-main-criterion-adjust" target=".ocg-main-criterion-adjust" :loading="projectValueLoading">
        <Title :title="i18n.global.t('meos_control_web.space_temp_co2_adjustment_rule')" />
        <RadioGroupBtns
            v-if="rules.length"
            :rules="rules"
            :type="projectValueSelect?.valueSelectType"
            :show-title="['value_select_lowest_cast', 'value_select_Lowest_carbon_emissions'].includes(projectValueSelect?.valueSelectType)"
            :v-model="selectRule"
            @change="selectChange"
        />
        <Chart v-if="hasChartData" ref="chartDom" :data="projectValueSelect" :current-range="currentRange" />
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import Chart from '../chart/index.vue';
import RadioGroupBtns from './RadioGroupBtns.vue';
import Panel from '../common/panel.vue';
import Title from '../common/title.vue';
import { currentSelectKey, hasChartDataKey, projectValueSelectKey, projectValueLoadingKey } from '@/views/operationCriterion/constant';
const projectValueSelect = inject(projectValueSelectKey);
const projectValueLoading = inject(projectValueLoadingKey);
const hasChartData = inject(hasChartDataKey);

const currentRange = ref();
const chartDom = ref();
const selectRule = ref(0);
watch(
    projectValueSelect,
    () => {
        selectRule.value = 0;
        hasChartData.value = projectValueSelect?.value?.elecDataList?.length > 0;
    },
    { immediate: true }
);

const selectChange = val => {
    selectRule.value = val;
    chartDom.value?.refreshChart();
};
provide(currentSelectKey, selectRule);
const rules = computed(() => {
    if (projectValueSelect.value && projectValueSelect.value.valueSelectRange && projectValueSelect.value.valueSelectRange.length) {
        return projectValueSelect.value.valueSelectRange;
    } else {
        return [];
    }
});
</script>
<style lang="less" scoped>
.ocg-main-criterion-adjust {
    min-height: 100px;
    --panel-gap-vertical: 20px;
}
</style>
