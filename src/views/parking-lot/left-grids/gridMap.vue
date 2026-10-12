<template>
    <div v-for="(items, indexs) in gridList" :key="indexs" class="mt12">
        <div v-if="gridList.length > 1 && items.floorParkingSpaceStatistics.find(io => io.parkIngSpaceCount > 0)" class="f18">{{ items.buildingName }}</div>
        <div v-for="(item, index) in items.floorParkingSpaceStatistics" :key="index" style="margin-right: 16px">
            <div v-if="item.parkIngSpaceCount > 0" class="grids-item mt12" :class="{ cp: mapLoaded }" @click.stop="gridsItemfuc(item, items)">
                <div class="fcb">
                    <div class="grids-item-num fc" @click.stop="spanFuc()">
                        <div class="title f20 mr25">{{ item.floorName }}</div>
                        <div class="fc">
                            <!-- <div ref="pieChart" class="chart mr24"></div> -->
                            <pirChart :type="'noCharging'" :count="item.vacantParkIngSpaceCount" :total="item.parkIngSpaceCount" />
                            <div>
                                <div>
                                    <span
                                        class="f20 fb6 fmp"
                                        :style="{
                                            color: item.vacantParkIngSpaceCount !== 0 ? '#5ebc3b' : item.vacantParkIngSpaceCount == 0 ? '#000' : '#8B949E'
                                        }"
                                        >{{ displayValue(item.vacantParkIngSpaceCount) }}</span
                                    >
                                    <span class="f20 ft1">/</span>
                                    <span class="f20 ft1 fmp">{{ displayValue(item.parkIngSpaceCount) }}</span>
                                </div>
                                <div class="ft f14">{{ i18n.global.t('common.idle_parking_spaces') }}</div>
                            </div>
                        </div>
                        <div class="get-line"></div>
                        <div class="fc">
                            <pirChart :type="'charging'" :count="item.vacantChargingParkingSpace" :total="item.chargingParkingSpaceCount" />
                            <!-- <div ref="pieChart1" class="chart mr24" ></div> -->
                            <div>
                                <div>
                                    <span
                                        class="f20 fb6 fmp"
                                        :style="{ color: item.vacantChargingParkingSpace !== 0 ? '#5ebc3b' : item.vacantChargingParkingSpace == 0 ? '#000' : '#8B949E' }"
                                        >{{ displayValue(item.vacantChargingParkingSpace) }}</span
                                    >
                                    <span class="f20 ft1">/</span>
                                    <span class="f20 ft1 fmp">{{ displayValue(item.chargingParkingSpaceCount) }}</span>
                                </div>
                                <div class="ft f14">{{ i18n.global.t('meos_control_web.idle_charging_spaces') }}</div>
                            </div>
                        </div>
                        <div class="get-line"></div>
                        <div>
                            <div
                                class="fmp f20 fb7"
                                :style="{
                                    color: getColor(item.exceptionCount)
                                }"
                            >
                                {{ displayValue(item.exceptionCount) }}
                            </div>
                            <div class="ft f14">{{ i18n.global.t('meos_control_web.abnormal_event') }}</div>
                        </div>
                    </div>
                    <div class="ft1 f14 fc show-btn">
                        <div class="default-btn enter-btn mr16" :class="{ 'default-btn-active': mapLoaded, cp: mapLoaded }" @click.stop="gridsItemfuc(item, items)">
                            <m-tips theme="darkTransparent" :disabled="mapLoaded" :content="i18n.global.t('meos_control_web.loading_please_wait')" placement="top">{{
                                i18n.global.t('meos_control_web.enter_floor')
                            }}</m-tips>
                        </div>

                        <div class="default-btn color-btn cp" @click.stop="unpackFuc(item)">
                            {{ item.unpackName }}<IconMeriComponentChevronUp v-if="item.unpackShow" class="ml4" /> <IconMeriComponentChevronDown v-else class="ml4" />
                        </div>
                    </div>
                </div>
                <div v-show="item.unpackShow" v-if="item.spaceParkIngSpaceStatistics" class="fc card mt16">
                    <cardList :card-item="item.spaceParkIngSpaceStatistics" />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import pirChart from './pirChart.vue';
import cardList from './cardList.vue';
import { displayValue } from '@/utils/viewUtils';
import i18n from '@/localization';
import { IconMeriComponentChevronUp, IconMeriComponentChevronDown } from 'meri-icon';
import { mapLoadedKey } from '../constant/injectKey';
const emits = defineEmits(['openFloor']);

const getColor = item => {
    if (item === 0) {
        return '#000';
    }
    if (item > 0) {
        return '#e63c35';
    } else {
        return '#8B949E';
    }
};
const props = defineProps({
    gridList: {
        type: Array,
        default: () => []
    }
});
const mapLoaded = inject(mapLoadedKey);
watch(
    () => props.gridList,
    () => {
        if (props.gridList.length) {
            props.gridList.forEach(items => {
                items.floorParkingSpaceStatistics.forEach(item => {
                    item.unpackShow = true;
                    item.unpackName = i18n.global.t('meos_control_web.collapse');
                });
            });
        }
    },
    {
        immediate: true
    }
);
const unpackFuc = item => {
    item.unpackShow = !item.unpackShow;
    item.unpackName = item.unpackShow ? i18n.global.t('meos_control_web.collapse') : i18n.global.t('meos_control_web.expand');
};
const gridsItemfuc = (item, items) => {
    if (!mapLoaded?.value) {
        return;
    }

    const obj = {
        ...item,
        buildingId: items.buildingId,
        buildingLocalName: items?.buildingName ?? '--'
    };
    emits('openFloor', obj);
};
</script>
<style lang="less" scoped>
.grids-item {
    width: 100%;
    padding: 20px 16px 20px 0px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: rgba(255, 255, 255, 0.8);
    &-num {
        cursor: default;
        .title {
            padding-left: 12px;
            position: relative;
            color: var(--gray-800, #2e3742);
            height: 22px;
            line-height: 22px;

            &::after {
                position: absolute;
                top: 4px;
                left: 0;
                width: 3px;
                height: 14px;
                background: var(--blue-500);
                content: '';
            }
        }
        .get-line {
            width: 1px;
            height: 50px;
            background: #c4c9cf;
            margin: 0px 40px;
        }
        .chart {
            height: 50px;
            width: 50px;
        }
    }
    .card {
        flex-wrap: wrap;
        gap: 12px;
        margin-left: 56px;
        &-item {
            width: 210px;
            border-radius: 4px;
            background: rgba(0, 186, 78, 0.12);
            padding: 8px 12px 12px 12px;
        }
    }
    &:hover {
        border: 1px solid #246fe5;
        background: #fff;
    }
    &:hover .show-btn .enter-btn {
        display: block;
    }
}
.show-btn {
    .default-btn {
        display: flex;
        align-items: center;
        padding: 2px;
        border-radius: 4px;
        color: var(--gray-400, #c4c9cf);
        &:hover {
            background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
        }
    }
    .color-btn {
        color: var(--gray-500, #8b949e);
    }
    .default-btn-active {
        color: #246fe5;
    }
    .enter-btn {
        display: block;
    }
}
</style>
