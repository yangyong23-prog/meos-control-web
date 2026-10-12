<template>
    <div class="left-three-container">
        <div class="three-container-head">
            <div class="container-head-left container-head-common">
                <span>{{ i18n.global.t('meos_control_web.strategy_generation') }}</span>
            </div>
            <div class="container-head-center container-head-common">
                <span>{{ i18n.global.t('meos_control_web.strategy_forecast') }}</span>
            </div>
            <div class="container-head-right container-head-common">
                <span>{{ i18n.global.t('meos_control_web.strategy_evaluation') }}</span>
            </div>
        </div>
        <div :id="scrollId" class="three-container-content">
            <div class="container-content-left container-content-common">
                <LNCard :loading="strategyLoading" :no-data="strategyOverviewNoData"></LNCard>
                <div v-if="!strategyOverviewNoData && !strategyLoading" :style="opacityStrategy ? '' : `opacity: 0`">
                    <PGCard v-for="(item, index) in strategy" :key="index" class="container-content-card" :index="index"> </PGCard>
                </div>
            </div>
            <div class="container-content-center container-content-common">
                <LNCard :loading="strategyLoading" :no-data="strategyOverviewNoData"></LNCard>
                <div v-if="!strategyOverviewNoData && !strategyLoading" :style="opacityStrategy ? '' : `opacity: 0`">
                    <PPCard v-for="(item, index) in strategy" :key="index" class="container-content-card" :index="index" />
                </div>
            </div>
            <div class="container-content-right container-content-common">
                <LNCard :loading="strategyLoading" :no-data="strategyOverviewNoData"></LNCard>
                <div v-if="!strategyOverviewNoData && !strategyLoading" :style="opacityStrategy ? '' : `opacity: 0`">
                    <PECard v-for="(item, index) in strategy" :key="index" class="container-content-card" :index="index"> </PECard>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { ref } from 'vue';
import LNCard from './loading_noData.vue';
import PGCard from './policyGenerationCard.vue';
import PPCard from './policyPrediction.vue';
import PECard from './policyEvaluation.vue';
import emitter from '@/utils/bus';
import { strategyOverviewKey, strategyLoadingKey, strategyOverviewNoDataKey, opacityStrategyKey } from '../../../../../hooks/useStaticData';

const strategyLoading = inject(strategyLoadingKey);
const strategyOverviewNoData = inject(strategyOverviewNoDataKey);
const strategy = inject(strategyOverviewKey);
const opacityStrategy = inject(opacityStrategyKey);
const scrollId = ref('left-three-scroll');

onMounted(() => {
    emitter.emit('scrollId', scrollId.value);
});
</script>

<style lang="less" scoped>
.left-three-container {
    .three-container-head {
        height: 52px;
        box-sizing: border-box;
        .container-head-center {
        }
        .container-head-common {
            height: 100%;
            display: inline-block;
            box-sizing: border-box;
            vertical-align: bottom;
            border-radius: 12px 12px 0px 0px;
            border-top: 1px solid #d5e0ef;
            border-right: 1px solid #d5e0ef;
            border-left: 1px solid #d5e0ef;
            background: #e3ecf7;
            padding: 12px 14px 0px 14px;
            span {
                display: inline-block;
                color: var(--gray-800, #2e3742);
                text-align: center;
                font-size: 20px;
                font-style: normal;
                font-weight: 700;
                line-height: 32px; /* 120% */
                height: 32px;
            }
        }
    }
    .three-container-content {
        height: calc(100% - 52px);
        padding-bottom: 20px;
        overflow: auto;
        box-sizing: border-box;
        /* 隐藏垂直滚动条 */
        &::-webkit-scrollbar {
            width: 0 !important;
        }
        /* 隐藏水平滚动条 */
        &::-webkit-scrollbar {
            height: 0 !important;
        }
        .container-content-center {
        }
        .container-content-common {
            display: inline-block;
            box-sizing: border-box;
            vertical-align: top;
            border-radius: 0px 0px 12px 12px;
            border-bottom: 1px solid #d5e0ef;
            border-right: 1px solid #d5e0ef;
            border-left: 1px solid #d5e0ef;
            background: #e3ecf7;
            padding: 0px 6px 12px 6px;
            min-height: calc(100% + 40px);
            .container-content-card {
                &:not(:last-child) {
                    margin-bottom: 16px;
                }
            }
        }
    }
}
@media screen and(max-width: 1440px) {
    .container-head-left {
        width: 280px;
    }
    .container-content-left {
        width: 280px;
    }
    .container-head-right {
        width: 360px;
    }
    .container-content-right {
        width: 360px;
    }
    .container-head-center {
        margin: 0px 12px;
        width: calc(100% - 664px);
    }
    .container-content-center {
        margin: 0px 12px;
        width: calc(100% - 664px);
    }
}
@media screen and(min-width: 1440px) {
    .container-head-left {
        width: 280px;
    }
    .container-content-left {
        width: 280px;
    }
    .container-head-right {
        width: 360px;
    }
    .container-content-right {
        width: 360px;
    }
    .container-head-center {
        margin: 0px 12px;
        width: calc(100% - 664px);
    }
    .container-content-center {
        margin: 0px 12px;
        width: calc(100% - 664px);
    }
}
@media screen and(min-width: 1600px) {
    .container-head-left {
        width: 22%;
    }
    .container-content-left {
        width: 22%;
    }
    .container-head-right {
        width: 28%;
    }
    .container-content-right {
        width: 28%;
    }
    .container-head-center {
        margin: 0px 16px;
        width: calc(50% - 32px);
    }
    .container-content-center {
        margin: 0px 16px;
        width: calc(50% - 32px);
    }
}
@media screen and(min-width: 1920px) {
}
</style>
