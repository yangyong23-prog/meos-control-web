<template>
    <div class="parking-lot-legend-wrapper">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.parking_zone_colon') }}</span>
        <div v-for="(item, index) in spaceStatuses" :key="index" class="legend-item">
            <i class="mark" :style="{ background: item.color }"></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>
        <div class="divide"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.parking_space_colon') }}</span>
        <div v-for="(item, index) in parkingSpotStatuses" :key="index" class="legend-item">
            <div v-if="item.status" class="icon-item">
                <ParkingSpotIcon :status="item.status" />
            </div>
            <span class="legend-name">{{ item.name }}</span>
        </div>
        <div class="divide"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.camera_barrier') }}：</span>
        <div v-for="(item, index) in equipStatuses" :key="index" class="legend-item">
            <div v-if="item.icon" class="icon-item">
                <SvgIcon :name="item.icon" />
            </div>
            <i v-else class="mark" :style="{ background: item.color }"></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>
        <div class="divide"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_exception_colon') }}</span>
        <div v-for="(item, index) in isEdge() ? abnormalList : abnormalList.slice(0, 1)" :key="index" class="abnormal legend-item">
            <i class="mark" :style="{ background: item.color }"></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import SvgIcon from '@/components/common/SvgIcon.vue';
import ParkingSpotIcon from './ParkingSpotIcon.vue';

const abnormalList = computed(() => legendObj.abnormalData);
const spaceStatuses = computed(() => legendObj.spaceStatuses);
const parkingSpotStatuses = computed(() => legendObj.parkingSpotStatuses);
const equipStatuses = computed(() => legendObj.equipStatuses);

const legendObj = {
    abnormalData: [
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F55047'
        }
    ],
    spaceStatuses: [
        {
            name: i18n.global.t('meos_control_web.in_business'),
            color: '#BCDEB2'
        },
        {
            name: i18n.global.t('meos_control_web.non_business_hours'),
            color: '#C0CFE1'
        },
        // {
        //     name: '未知',
        //     color: '#D0D5DC'
        // },
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#FFA09A'
        }
    ],
    parkingSpotStatuses: [
        {
            name: i18n.global.t('meos_control_web.occupied_parking_space'),
            color: '#CBD9EA',
            status: 'occupied'
        },
        {
            name: i18n.global.t('common.idle_parking_spaces'),
            color: '#85E1A4',
            status: 'free'
        },
        {
            name: i18n.global.t('meos_control_web.unknown'),
            color: '#EBEFF4',
            status: 'unknown'
        },
        {
            name: i18n.global.t('meos_control_web.abnormal_parking_space'),
            color: '#F55047',
            status: 'abnormal'
        }
    ],
    equipStatuses: [
        {
            name: i18n.global.t('meos_control_web.online'),
            icon: 'aim-SP-map'
        },
        {
            name: i18n.global.t('meos_control_web.offline'),
            icon: 'cameraOffline'
        },
        {
            name: i18n.global.t('meos_control_web.no_data1'),
            icon: 'cameraNoData'
        }
    ]
};
</script>

<style lang="less" scoped>
.parking-lot-legend-wrapper {
    width: max-content;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    z-index: 50;
    row-gap: 12px;

    .row-item {
        display: flex;
        align-items: center;
    }

    .legend-category-name {
        color: @grey-800;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        column-gap: 4px;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }
    }
    .mark {
        display: inline-flex;
        width: 14px;
        height: 14px;
        border-radius: 2px;
    }

    .legend-name {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }

    .icon-item {
        display: flex;
        align-items: center;
    }

    .abnormal .mark {
        display: inline-flex;
        box-sizing: border-box;
        width: 10px;
        height: 10px;
        border-radius: 90px;
        margin-right: 4px;
        border: 1px solid #fff;
    }

    .divide {
        width: 1px;
        height: 14px;
        background: #b1b9c2;
        margin-right: 12px;
    }
}
</style>
