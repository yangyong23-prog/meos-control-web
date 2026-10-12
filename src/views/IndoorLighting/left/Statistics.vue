<template>
    <div ref="statisticsRef" class="indoor-light-statistics" :class="{ 'is-stacked': (hasPublicAndParking || loading) && statisticsWidth < 1200, 'is-compact': isCompact }">
        <CardContainer v-if="!loading">
            <CardContainerItem v-if="publicLoopList.length" :span="parkingLoopList.length ? 6 : 12">
                <div class="statistics-item wh100">
                    <StatisticsTitle :data="publicLoopList" :running-monitor-second-type="PUBLIC.code" :service-area-type="PUBLIC.id" />
                    <div class="statistics-item-content" style="height: calc(100% - 48px)">
                        <PreTotal :data="publicLoopList" :class="{ 'is-compact': isCompact }" />
                        <div v-if="publicModuleList.length || publicDDCList.length" class="statistics-item-content-line"></div>
                        <div class="statistics-item-content-relate">
                            <Relate
                                v-if="publicModuleList.length"
                                :running-monitor-second-type="PUBLIC.code"
                                :only-module="publicDDCList.length === 0"
                                :data="publicModuleList"
                                :class="{ 'is-compact': isCompact }"
                            />
                            <Relate
                                v-if="publicDDCList.length"
                                :running-monitor-second-type="PUBLIC.code"
                                :data="publicDDCList"
                                :title="i18n.global.t('meos_control_web.associated_control_ddc')"
                                :class="{ 'is-compact': isCompact }"
                            />
                        </div>
                    </div>
                </div>
            </CardContainerItem>
            <CardContainerItem v-if="parkingLoopList.length" :span="publicLoopList.length ? 6 : 12">
                <div class="statistics-item wh100">
                    <StatisticsTitle
                        :data="parkingLoopList"
                        :title="i18n.global.t('meos_control_web.parking_lighting')"
                        :running-monitor-second-type="PARKING.code"
                        :button-text="i18n.global.t('meos_control_web.parking_facility')"
                        :service-area-type="PARKING.id"
                    />
                    <div class="statistics-item-content" style="height: calc(100% - 48px)">
                        <PreTotal :data="parkingLoopList" :class="{ 'is-compact': isCompact }" />
                        <div v-if="parkingModuleList.length || parkingDDCList.length" class="statistics-item-content-line"></div>
                        <div class="statistics-item-content-relate">
                            <Relate
                                v-if="parkingModuleList.length"
                                :running-monitor-second-type="PARKING.code"
                                :only-module="parkingDDCList.length === 0"
                                :data="parkingModuleList"
                                :class="{ 'is-compact': isCompact }"
                            />
                            <Relate
                                v-if="parkingDDCList.length"
                                :running-monitor-second-type="PARKING.code"
                                :data="parkingDDCList"
                                :title="i18n.global.t('meos_control_web.associated_control_ddc')"
                                :class="{ 'is-compact': isCompact }"
                            />
                        </div>
                    </div>
                </div>
            </CardContainerItem>
        </CardContainer>
        <m-list-skeleton v-else :item-num="20" />
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useElementSize } from '@vueuse/core';
import CardContainer from '@/components/cardContainer/index.vue';
import CardContainerItem from '@/components/cardContainer/CardContainerItem.vue';
import PreTotal from './components/PreTotal.vue';
import StatisticsTitle from './components/StatisticsTitleVue.vue';
import Relate from './components/Relate.vue';
import { PUBLIC, PARKING } from '../variables';
import { loopListKey, moduleListKey } from '../hooks/useBaseHook';
defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});
// 按统计区域实际宽度适配，响应 meos-frame 侧栏和面板引起的容器尺寸变化。
const statisticsRef = ref(null);
const { width: statisticsWidth } = useElementSize(statisticsRef);
// 双卡片扣除间距和内边距后，分别需要约 580px / 640px 才能横向展示。
const isCompact = computed(() => hasPublicAndParking.value && statisticsWidth.value >= 1200 && statisticsWidth.value < 1320);
const loopList = inject(loopListKey, ref(new Map()));
const moduleList = inject(moduleListKey, ref(new Map()));
const publicLoopList = computed(() => {
    return Array.from(loopList.value.values()).filter(item => item.serviceAreaType === PUBLIC.id);
});
const parkingLoopList = computed(() => {
    return Array.from(loopList.value.values()).filter(item => item.serviceAreaType === PARKING.id);
});

const publicModuleList = computed(() => {
    return Array.from(moduleList.value.values()).filter(item => item.serviceAreaTypes.has(PUBLIC.id) && item.isDDC !== true);
});
const parkingModuleList = computed(() => {
    return Array.from(moduleList.value.values()).filter(item => item.serviceAreaTypes.has(PARKING.id) && item.isDDC !== true);
});
const publicDDCList = computed(() => {
    return Array.from(moduleList.value.values()).filter(item => item.serviceAreaTypes.has(PUBLIC.id) && item.isDDC);
});
const parkingDDCList = computed(() => {
    return Array.from(moduleList.value.values()).filter(item => item.serviceAreaTypes.has(PARKING.id) && item.isDDC);
});
const hasPublicAndParking = computed(() => {
    return publicLoopList.value.length && parkingLoopList.value.length;
});
</script>
<style lang="less" scoped>
.indoor-light-statistics {
    height: 252px;
    padding: 16px 0;
    overflow: hidden;
    .statistics-item {
        padding: 12px 16px 20px 16px;
        &-content {
            display: flex;
            gap: 20px;
            &-line {
                margin-top: 30px;
                height: calc(100% - 60px);
                flex: 0 0 1px;
                background-color: var(--gray-300);
            }
            &-relate {
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 12px;
            }
        }
    }
}
.indoor-light-statistics {
    &.is-stacked {
        height: 376px;
        .statistics-item-content {
            flex-direction: column;
            overflow: hidden;
            &-relate {
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                flex-wrap: wrap;
                flex: 1;
            }
            &-line {
                margin-top: 0;
            }
        }
    }
    &.is-compact {
        .statistics-item {
            &-content {
                gap: 16px;
            }
        }
    }
}
</style>
