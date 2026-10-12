<template>
    <template v-if="finalLoading"> <m-list-skeleton /> </template>
    <template v-else>
        <GroupCardsWithTitle
            v-if="runParams?.length"
            :title="i18n.global.t('meos_control_web.system_operation_parameter')"
            :select-obj-id="currentSystem?.systemId"
            :cards="runParams"
        ></GroupCardsWithTitle>
        <!-- <GroupCardsWithTitle title="系统参数" :select-obj-id="currentSystem?.systemId" :cards="[]"></GroupCardsWithTitle> -->
        <GroupCardsWithTitle :title="i18n.global.t('meos_control_web.outdoor_weather')" :cards="finalWeatherList" :without-info-code="true"></GroupCardsWithTitle>
    </template>
</template>
<script setup>
import i18n from '@/localization';
import GroupCardsWithTitle from '../../widget/group-cards-with-title/index.vue';
import { weatherListKey, systemParamsKey, isSystemLoadingKey } from '../../hooks/useRightHook';
import { currentSystemKey } from '../../hooks/useStateHook';

// 系统数据
const currentSystem = inject(currentSystemKey);
const systemParams = inject(systemParamsKey);
const weatherList = inject(weatherListKey);
const isSystemLoading = inject(isSystemLoadingKey);

const runParams = computed(() => {
    return systemParams.value?.sysRunParameter?.groupChildren || [];
});
const finalWeatherList = computed(() => {
    return [
        {
            relInfoCodeConfigs: weatherList?.value || []
        }
    ];
});
const finalLoading = computed(() => {
    return isSystemLoading?.value;
});
</script>
<style lang="less" scoped></style>
