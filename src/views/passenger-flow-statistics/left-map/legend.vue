<template>
    <div class="passenger-flow-legend-wrap">
        <!-- <template v-if="!floorView">
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
            <div v-for="(item, index) in elevatorShaftList" :key="index" class="switch legend-item">
                <svg v-if="item.icon" class="icon mark-icon mr4" aria-hidden="true">
                    <use :xlink:href="item.icon" />
                </svg>
                <i v-else class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
            </div>
        </template> -->
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.camera_colon') }}</span>
        <div v-for="(item, index) in elevatorOperationList" :key="index" class="switch legend-item fc">
            <!-- <svg v-if="item.icon" class="icon mark-icon mr4">
                <use :xlink:href="item.icon" />
            </svg> -->
            <!-- <SvgIcon :name="item.icon" /> -->
            <div v-if="item.icon" :class="['fc', 'svg-bgi-w', item.icon === 'Webcam-online' ? 'svg-bgi1' : item.icon === 'Camera-offline' ? 'svg-bgi2' : 'svg-bgi3']"></div>
            <i v-else class="mark" :style="{ background: item.color }"></i><span class="legend-name ml4">{{ item.name }}</span>
        </div>

        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_exception_colon') }}</span>
        <div v-for="(item, index) in isEdge() ? abnormalList : abnormalList.slice(0, 1)" :key="index" class="abnormal legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { isEdge } from '@/utils/envUtils';
import SvgIcon from '@/components/common/SvgIcon.vue';
const abnormalList = computed(() => legendObj.abnormalData);
const elevatorShaftList = computed(() => legendObj.elevatorShaft);
const elevatorOperationList = computed(() => legendObj.elevatorOperation);

const legendObj = {
    abnormalData: [
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F55047'
        }
    ],
    elevatorShaft: [
        {
            name: i18n.global.t('meos_control_web.normal'),
            color: '#69CD90'
        },
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F8766F'
        }
    ],
    elevatorOperation: [
        {
            name: i18n.global.t('meos_control_web.online'),
            // color: '#C4C9CF',
            icon: 'Webcam-online'
        },
        {
            name: i18n.global.t('meos_control_web.offline'),
            // color: '#C4C9CF',
            icon: 'Camera-offline'
        },
        {
            name: i18n.global.t('meos_control_web.no_data1'),
            // color: '#C4C9CF',
            icon: 'Camera-no-data'
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
.passenger-flow-legend-wrap {
    max-width: 100%;
    width: max-content;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    row-gap: 8px;
    white-space: nowrap;
    .legend-category-name {
        color: #2e3742;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        height: 18px;
        line-height: 18px;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

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

    .divide {
        width: 1px;
        height: 14px;
        background: #b1b9c2;
        margin-right: 12px;
    }
}
.svg-bgi-w {
    background-repeat: no-repeat;
    width: 16px;
    height: 16px;
}
.svg-bgi1 {
    background-image: url('../../../assets/svg/Webcam-online.svg');
}
.svg-bgi2 {
    background-image: url('../../../assets/svg/Camera-offline.svg');
}
.svg-bgi3 {
    background-image: url('../../../assets/svg/Camera-no-data.svg');
}
</style>
