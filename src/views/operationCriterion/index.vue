<template>
    <div class="operation-criterion-page operation-criterion-page-var">
        <div class="operation-criterion-page-content">
            <Header :date="currentDate" @date-change="changeDate" />
            <div class="operation-criterion-page-content-body">
                <BaseInfo />
                <div class="ocp-content-body-title">
                    <TYMeetingWE />
                    {{ i18n.global.t('meos_control_web.hvac_operating_standard') }}
                </div>
                <MainContent :loading="!loaded" />
                <SpecialPartial v-if="globalConfig?.seasonCondition === 'ACSeason-1' || globalConfig?.seasonCondition === 'ACSeason-2'" :loading="loading" />
            </div>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import dayjs from 'dayjs';
import TYMeetingWE from '@/assets/images/operationCriterion/TYMeetingWE.svg';
import UseLoading from './hooks/useLoading';
import Header from './components/header/index.vue';
import BaseInfo from './components/baseInfo/index.vue';
import MainContent from './components/mainContent/index.vue';
import SpecialPartial from './components/specialPartial/index.vue';
import { currentDateKey, globalConfigKey } from './constant';
import { useGlobalConfigHook } from './hooks/useGlobalConfigHook';
import { useProjectValueHook } from '@/views/operationCriterion/hooks/useProjectValueHook';
import { useRoute } from 'vue-router';
import { getDayjsTz } from '@/utils/globalVariables';
const { getProjectValueSelect, projectValueSelect } = useProjectValueHook();
const { startLoading, closeLoading } = UseLoading({
    target: '.operation-criterion-page',
    background: 'transparent'
});
const route = useRoute();
const currentDate = ref((route.query.date ? dayjs(route.query.date) : getDayjsTz()).format('YYYY-MM-DD'));

const changeDate = async val => {
    currentDate.value = val;
    await Promise.allSettled([getGlobalConfig(currentDate.value), getProjectValueSelect(currentDate.value)]);
};

const { loading, loaded, globalConfig, getGlobalConfig } = useGlobalConfigHook();

onMounted(async () => {
    await Promise.allSettled([getGlobalConfig(currentDate.value), getProjectValueSelect(currentDate.value)]);
});
provide(currentDateKey, currentDate);
// 全屏loading效果.
onMounted(() => {
    startLoading();
    setTimeout(() => {
        closeLoading();
    }, 200);
});
</script>
<style lang="less" scoped>
.operation-criterion-page {
    width: 100%;
    min-height: 100%;
    display: flex;
    padding-bottom: 81px;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background-image: url('../../assets/images/operationCriterion/page_bg.png');
    background-size: 100% auto;
    background-position: top center;
    background-repeat: no-repeat;
    background-color: var(--blue-50, #ebf6ff);
    .operation-criterion-page-content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 0 var(--maincontent-padding);
    }
    .operation-criterion-page-content-body {
        width: 100%;
        max-width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        gap: var(--maincontent-gap);
        .ocp-content-body-title {
            display: flex;
            gap: 8px;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            color: var(--gray-800, #2e3742);
            font-size: 20px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px; /* 120% */
        }
    }
}
.operation-criterion-page-var {
    --font-size-0a: 12px;
    --font-size-1a: 14px;
    --font-size-2a: 16px;
    --font-size-3a: 18px;
    --font-size-4a: 20px;
    --font-size-5a: 22px;
    --font-size-6a: 24px;
    --header-height: 80px;
    --maincontent-padding: 24px;
    --maincontent-gap: 20px;
    --panel-padding-horizonal: 28px;
}
</style>
