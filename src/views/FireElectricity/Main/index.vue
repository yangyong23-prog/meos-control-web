<template>
    <div ref="machineroombuildfloor" class="monitoring-main">
        <FloorMap v-show="currentFloorId"></FloorMap>
        <template v-if="!currentFloorId">
            <div class="monitoring-main-top fcb" :class="{ scrollTop: scrollTop }">
                <div>
                    <span class="fs24 fw700">{{ i18n.global.t('meos_control_web.fire_protection_electric') }}</span>
                    <m-popover :show-arrow="false" theme="darkTransparent" placement="top-start">
                        <template #content>
                            <p>{{ i18n.global.t('meos_control_web.monitorable_device_iot_delivered_count') }}</p>
                            <p>{{ i18n.global.t('meos_control_web.early_warning_alarm_signal_count_of_devices_with_iot_data') }}</p>
                            <p>{{ i18n.global.t('meos_control_web.fault_signal_iot_device_count') }}</p>
                        </template>
                        <FireLinears />
                    </m-popover>
                </div>

                <m-button @click="openEquipmentList">{{ i18n.global.t('meos_control_web.equipment_list') }}</m-button>
            </div>
            <div class="monitoring-main-bottom">
                <m-scrollbar v-if="statisticsData?.length && !isGlobalLoading" class="no-scrollbar-bar" :always="false" @scroll="scroll">
                    <SystemOverview :card-size="cardSize" />
                    <FloorOverview :style="{ marginTop: List?.length > 8 ? '4px' : '16px' }" />
                </m-scrollbar>
                <Empty v-else-if="!isGlobalLoading && statisticsData.length === 0" class="empty" :text="i18n.global.t('meos_control_web.no_content')" width="90px" height="76px" />
            </div>
        </template>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { useResizeObserver } from '@vueuse/core';
import { throttle } from 'lodash';
import { statisticsDataKey, isGlobalLoadingKey } from '../hooks/useCommonConfig';
import FloorMap from '../FloorMap/index.vue';
import FireLinears from '@/assets/svg/fireLinears.svg';
import SystemOverview from './systemOverview/index.vue';
import FloorOverview from './floorOverview/index.vue';
import Empty from '@/components/common/Empty.vue';

defineProps({
    currentFloorId: {
        type: String,
        default: ''
    }
});
const emit = defineEmits(['openEquipmentList']);
const openEquipmentList = () => {
    emit('openEquipmentList');
};
const isGlobalLoading = inject(isGlobalLoadingKey);
const statisticsData = inject(statisticsDataKey);
const scrollTop = ref(0);
const machineroombuildfloor = ref();
const scroll = data => {
    scrollTop.value = data.scrollTop;
};

const spaceItemColumn = ref('');
const systemItemColumn = ref('');
const cardSize = ref(8);
const resize = entries => {
    const entry = entries[0];
    const { width } = entry.contentRect;
    entry.target.classList.remove('columns2');
    entry.target.classList.remove('columns3');
    entry.target.classList.remove('columns4');
    if (width >= 0 && width <= 1026) {
        cardSize.value = 4;
        systemItemColumn.value = '--system-repeat: repeat(2,  minmax(0, 1fr))';
    } else if (width > 1026 && width <= 1306) {
        cardSize.value = 6;
        systemItemColumn.value = '--system-repeat: repeat(3,  minmax(0, 1fr))';
    } else if (width > 1306) {
        cardSize.value = 8;
        systemItemColumn.value = '--system-repeat: repeat(4,  minmax(0, 1fr))';
    }

    if (width >= 0 && width < 1106) {
        spaceItemColumn.value = '--system-repeat: repeat(2,  minmax(0, 1fr))';
    } else if (width >= 1106 && width < 1426) {
        spaceItemColumn.value = '--system-repeat: repeat(3,  minmax(0, 1fr))';
    } else if (width >= 1426) {
        spaceItemColumn.value = '--system-repeat: repeat(4,  minmax(0, 1fr))';
    }
};
provide('systemItemColumn', systemItemColumn);
provide('spaceItemColumn', spaceItemColumn);
onMounted(() => {
    useResizeObserver(machineroombuildfloor.value, throttle(resize, 100));
});
</script>
<style lang="less" scoped>
.monitoring-main {
    width: calc(100% - 2px);
    height: 100%;
    position: relative;
    left: 0;
    &-top {
        display: flex;
        gap: 12px;
        height: 48px;
        padding: 16px 0px 0 16px;

        svg {
            width: 16px;
            height: 16px;
            padding: 2px 4px;
            margin-top: 6px;
            box-sizing: content-box;
            &:hover {
                border-radius: 2px;
                background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
            }
        }
    }
    &-bottom {
        height: calc(100% - 48px);
        margin-left: 16px;
    }
    .empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>
