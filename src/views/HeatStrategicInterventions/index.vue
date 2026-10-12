<template>
    <div style="width: 100%">
        <div class="strategic-interventions">
            <m-scrollbar>
                <div style="min-width: 1280px">
                    <HeaderFilter
                        :style="{
                            padding: screenWidth >= 1920 ? '16px 14px 14px' : '8px 12px 5px'
                        }"
                        :list="headerOptions"
                        :month-data="month"
                        @default-params="defineParams"
                        @change-params="changeParams"
                    >
                        <template #append>
                            <div class="fc">
                                <SetButton type="primary" @click="addFixedTimeStrategy">{{ i18n.global.t('meos_control_web.create_new_schedule') }}</SetButton>
                            </div>
                        </template>
                    </HeaderFilter>
                    <div class="calendar" :class="{ 'calendar-1920 ': screenWidth >= 1920, 'calendar-1280 ': screenWidth < 1920 }">
                        <Main ref="strategyMain" :screen-width="screenWidth" @get-list-fixed-strategy-date-by-month="getListFixedStrategyDateByMonth" />
                    </div>
                </div>
            </m-scrollbar>
        </div>
        <CreateEditStrategy
            v-if="heatShowStrategyModal"
            :query-params="addParams"
            @close="heatShowStrategyModal = false"
            @get-list-fixed-strategy-date-by-month="getListFixedStrategyDateByMonth"
        />
    </div>
</template>

<script lang="ts" setup>
// @ts-ignore
import i18n from '@/localization';
import Main from './Main.vue';
import HeaderFilter from './HeaderFilter.vue';
import CreateEditStrategy from './CreateEditStrategy.vue';
import UseHeatGlobalStrategy from './hooks/useHeatGlobalStrategy';
import SetButton from '@/components/common/SetButton.vue';
const { month, addParams, screenWidth, strategyMain, headerOptions, heatShowStrategyModal, defineParams, changeParams, addFixedTimeStrategy, getListFixedStrategyDateByMonth } =
    UseHeatGlobalStrategy();
</script>

<style lang="less" scoped>
.strategic-interventions {
    height: 100%;
    width: 100%;
    background: #f7f9fa;
    .calendar {
        margin: 0 auto;
        border-radius: 8px;
        border: 1px solid #e1e5eb;
        border-right: 0;
        background: #fff;
        overflow: hidden;

        &-scroll {
            /deep/.m-scrollbar__content {
                height: 100%;
            }
        }
    }
    .calendar-1920 {
        height: calc(100% - 76px);
        width: calc(100% - 28px);
    }
    .calendar-1280 {
        height: calc(100% - 50px);
        width: calc(100% - 4px);
    }
}
</style>
