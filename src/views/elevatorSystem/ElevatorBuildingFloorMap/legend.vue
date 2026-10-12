<template>
    <div class="legend-wrap">
        <template v-if="!floorView">
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.elevator_shaft_colon') }}</span>
            <div v-for="(item, index) in elevatorShaftList" :key="index" class="switch legend-item">
                <svg v-if="item.icon" class="icon mark-icon bigger-icon mr4" aria-hidden="true">
                    <use :xlink:href="item.icon" />
                </svg>
                <i v-else class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
            </div>
        </template>
        <div class="divider"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.elevator_operation_colon') }}</span>
        <template v-if="isEdge()">
            <div v-for="(item, index) in elevatorOperationList" :key="index" class="switch legend-item">
                <svg v-if="item.icon" class="icon mark-icon mr4" aria-hidden="true">
                    <use :xlink:href="item.icon" />
                </svg>
                <i v-else class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
            </div>
        </template>
        <template v-else>
            <div v-for="(item, index) in elevatorOperationCloudList" :key="index" class="switch legend-item">
                <svg v-if="item.icon" class="icon mark-icon mr4" aria-hidden="true">
                    <use :xlink:href="item.icon" />
                </svg>
                <i v-else class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
            </div>
        </template>
        <div class="divider"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.abnormal_status_colon') }}</span>
        <div v-for="(item, index) in isEdge() ? abnormalList : abnormalList.slice(0, 1)" :key="index" class="abnormal legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
const currentFloorObj = inject('currentFloorObj');
const abnormalList = computed(() => legendObj.abnormalData);
const elevatorShaftList = computed(() => legendObj.elevatorShaft);
const elevatorOperationList = computed(() => legendObj.elevatorOperation);
const elevatorOperationCloudList = computed(() => legendObj.elevatorOperationCloud);
// const floorView = computed(() => {
//     return !!currentFloorObj.value?.id;
// });
const legendObj = {
    abnormalData: [
        {
            name: i18n.global.t('meos_control_web.device_exception'),
            color: '#F55047'
        },
        {
            name: i18n.global.t('meos_control_web.elevator_overload'),
            color: '#FFB800'
        }
    ],
    elevatorShaft: [
        {
            name: i18n.global.t('meos_control_web.parkable_floors'),
            color: '#69CD90',
            icon: '#icon-Frame'
        }
    ],
    elevatorOperation: [
        {
            name: i18n.global.t('meos_control_web.upstream'),
            color: '#C4C9CF',
            icon: '#icon-upElevator'
        },
        {
            name: i18n.global.t('meos_control_web.downstream'),
            color: '#C4C9CF',
            icon: '#icon-downElevator'
        },
        {
            name: i18n.global.t('meos_control_web.static'),
            color: '#C4C9CF',
            icon: '#icon-static'
        },
        {
            name: i18n.global.t('meos_control_web.elevator_lock'),
            color: '#F55047',
            icon: '#icon-Ladderlock'
        },
        {
            name: i18n.global.t('meos_control_web.unknown'),
            color: '#FFB800',
            icon: '#icon-unknown'
        }
    ],
    elevatorOperationCloud: [
        {
            name: i18n.global.t('meos_control_web.elevator_lock'),
            color: '#F55047',
            icon: '#icon-Ladderlock'
        },
        {
            name: i18n.global.t('common.meos_home_the_ladder_is_unlocked'),
            color: '#F55047',
            icon: '#icon-unknown'
        }
    ]
};
</script>
<style lang="less" scoped>
.legend-wrap {
    max-width: 100%;
    width: max-content;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #fff 0%, #f1f4f6 100%);
    row-gap: 8px;
    white-space: nowrap;
    .legend-category-name {
        font-weight: 700;
        color: #2e3742;
        font-size: 14px;
        font-style: normal;
        height: 18px;
        line-height: 18px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 16px;

        .legend-name {
            color: #626c78;
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 18px;
        }

        &:last-child {
            margin-right: 0;
        }
    }
    .mark {
        display: inline-block;
        width: 14px;
        height: 14px;
        border-radius: 2px;
        margin-right: 4px;
    }
    .status .mark {
        display: inline-block;
        box-sizing: border-box;
        width: auto;
        border-radius: 4px;
        color: #fff;
        font-size: 10px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        padding: 0 5px;
        height: 20px;
        line-height: 20px;
        margin-right: 4px;
    }
    .abnormal .mark {
        display: inline-block;
        box-sizing: border-box;
        width: 10px;
        height: 10px;
        border-radius: 90px;
        margin-right: 4px;
        border: 1px solid #fff;
    }

    .divider {
        width: 1px;
        height: 14px;
        background: #b1b9c2;
        margin-right: 16px;
    }
    .mark-icon {
        width: 16px;
        height: 16px;
    }

    .bigger-icon {
        width: 19px;
        height: 18px;
    }
}
</style>
