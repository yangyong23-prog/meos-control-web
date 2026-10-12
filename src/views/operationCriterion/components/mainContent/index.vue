<template>
    <Panel
        class="ocg-main-content"
        target=".ocg-main-content"
        :loading="loading"
    >
        <div class="ocg-main-content-container">
            <Indicators :config="globalConfig" />
            <Panel class="ocg-main-criterion">
                <Title :title="i18n.global.t('meos_control_web.operation_standard')" />
                <EnvironmentalQuality :config="globalConfig" />
            </Panel>
            <EnvironAdjust />
            <SpecialSpaces />
        </div>
    </Panel>
</template>
<script setup>
import i18n from '@/localization';
import EnvironAdjust from './EnvironAdjust.vue';
import SpecialSpaces from './SpecialSpaces.vue';
import EnvironmentalQuality from './EnvironmentDetail.vue';
import Panel from '../common/panel.vue';
import Title from '../common/title.vue';
import Indicators from './indicators.vue';
import { globalConfigKey, hasChartDataKey } from '@/views/operationCriterion/constant';
const globalConfig = inject(globalConfigKey);
const hasChartData = ref(false);
provide(hasChartDataKey, hasChartData);
defineProps({
    loading: {
        type: Boolean,
        default: true
    },
    rules: {
        type: Array,
        default: () => []
    }
});
</script>
<style lang="less" scoped>
.ocg-main-content {
    padding: 24px 0px 0px 0px;
    gap: 0px;
    display: flex;
    flex-direction: column;
    min-height: 340px;
    .ocg-main-content-container {
        --panel-padding-horizonal: 0;
        --panel-boder-radius: 0;
        display: flex;
        width: 100%;
        height: 100%;
        gap: 32px;
        flex-direction: column;
    }
}
</style>
