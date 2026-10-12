<template>
    <div :class="{ 'room-card-container': true, isLaptop: isLaptop }">
        <div v-for="item in allRoomData" :key="item.icon" class="room-card-item">
            <div class="room-card-item-img" :style="{ background: item.bgColor }">
                <component :is="item.icon"></component>
            </div>
            <div class="room-card-item-content">
                <span class="count" :style="`color: ${item.color}`">{{
                    item.title === i18n.global.t('meos_control_web.total_machine_rooms')
                        ? isAllSpacesLoaded
                            ? item.count
                            : '--'
                        : !isAllSpacesLoaded || loangerEvents
                        ? '--'
                        : item.count
                }}</span>
                <span v-ellipsis class="title">{{ item.title }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { useBreakpoints } from '@vueuse/core';
import RoomTotal from '@/assets/svg/roomTotal.svg'; // 机房总数
import RoomUnknown from '@/assets/svg/roomUnknown.svg'; // 状态不明
import RoomPotential from '@/assets/svg/roomPotential.svg'; // 潜在风险
import RoomRisk from '@/assets/svg/roomRisk.svg'; // 风险发生
import { loadingDangerEventsKey, isAllSpacesLoadedKey } from '../hooks/useBaseDataHook';
const props = defineProps({
    spacesData: {
        type: Array,
        default: () => []
    }
});

const breakpoints = useBreakpoints({
    laptop: 0,
    desktop: 1440
});
const activeBreakpoint = breakpoints.active();
const isLaptop = computed(() => activeBreakpoint.value === 'laptop');
const totalSpaceLength = computed(() => props.spacesData.length);
const loangerEvents = inject(loadingDangerEventsKey);
const isAllSpacesLoaded = inject(isAllSpacesLoadedKey);

const allRoomData = computed(() => {
    if (!props?.spacesData) {
        return [
            {
                title: i18n.global.t('meos_control_web.total_machine_rooms'),
                color: '#2E3742',
                count: 0,
                icon: RoomTotal,
                bgColor: '#D9EBFF'
            },
            { title: i18n.global.t('meos_control_web.status_unknown_room_count'), color: '#9B6CED', count: 0, icon: RoomUnknown, bgColor: '#DAD6FF' },
            { title: i18n.global.t('meos_control_web.potential_risk_plant_room_count'), color: '#E29606', count: 0, icon: RoomPotential, bgColor: '#FFE0CB' },
            { title: i18n.global.t('meos_control_web.machine_room_risk_count'), color: '#F55047', count: 0, icon: RoomRisk, bgColor: '#FFDBDB' }
        ];
    }

    const statusCounts = props.spacesData.reduce(
        (acc, item) => {
            if (item.spaceStatus === 'UNKNOWN') acc.unknown++;
            else if (item.spaceStatus === 'POTENTIAL') acc.potential++;
            else if (item.spaceStatus === 'EXCEPTION') acc.exception++;
            return acc;
        },
        { unknown: 0, potential: 0, exception: 0 }
    );

    return [
        {
            title: i18n.global.t('meos_control_web.total_machine_rooms'),
            color: '#2E3742',
            count: totalSpaceLength.value,
            icon: RoomTotal,
            bgColor: '#D9EBFF'
        },
        {
            title: i18n.global.t('meos_control_web.status_unknown_room_count'),
            color: '#9B6CED',
            count: statusCounts.unknown,
            icon: RoomUnknown,
            bgColor: '#DAD6FF'
        },
        {
            title: i18n.global.t('meos_control_web.potential_risk_plant_room_count'),
            color: '#E29606',
            count: statusCounts.potential,
            icon: RoomPotential,
            bgColor: '#FFE0CB'
        },
        {
            title: i18n.global.t('meos_control_web.machine_room_risk_count'),
            color: '#F55047',
            count: statusCounts.exception,
            icon: RoomRisk,
            bgColor: '#FFDBDB'
        }
    ];
});
</script>

<style lang="less" scoped>
.room-card-container {
    height: 96px;
    margin-bottom: 16px;
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 1fr);
    .room-card-item {
        padding: 16px;
        border-radius: 8px;
        background: #f9fcff;
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
        &-img {
            min-width: 44px;
            min-height: 44px;
            border-radius: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        &-content {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-width: 0;
            height: 48px;
            margin-left: 18px;
            .count {
                font-family: 'Persagy2.0';
                font-size: 24px;
                font-style: normal;
                font-weight: 700;
                line-height: 24px;
                user-select: none;
            }
            .title {
                color: #626c78;
                font-size: 14px;
                font-weight: var(--platform-font-weight);
                line-height: 24px;
                user-select: none;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
            }
        }
        img {
            display: inline-block;
            width: 44px;
            height: 44px;
        }
    }
}

.isLaptop {
    .room-card-item {
        padding: 12px;
    }

    .room-card-item-content {
        margin-left: 8px;
    }
}
</style>
