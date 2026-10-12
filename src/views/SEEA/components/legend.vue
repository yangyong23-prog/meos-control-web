<template>
    <div class="legend-wrap" :class="curContainerClass?.value">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_status_colon') }}</span>
        <div v-for="(item, index) in equipmentList" :key="index" class="equipment legend-item">
            <i class="mark" :style="{ borderColor: item.bgColor, background: item.color }"></i
            ><span class="legend-name"
                >{{ item.name }}
                <template v-if="item.name === i18n.global.t('meos_control_web.power_off')"> (<img src="@/assets/imgs/demand/poverfailure.png" alt="Power Failure" />) </template>
            </span>
        </div>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import switchOpen from '@/assets/images/operateMonitoring/switch-open.png';
import switchClose from '@/assets/images/operateMonitoring/switch-close.png';
import switchNoData from '@/assets/images/operateMonitoring/switch-nodata.png';

const props = defineProps({
    equipmentData: {
        type: Array
    },
    switchData: {
        type: Array
    },
    pipelineData: {
        type: Array
    }
});
const curGraphType = inject('curGraphType');
const perspectiveType = inject('perspectiveType');

const legendObj = {
    equipmentData: [
        {
            id: 'normal',
            name: i18n.global.t('meos_control_web.abnormal'),
            bgColor: '#ffffff',
            color: '#F55047'
        },
        {
            id: 'offline',
            name: i18n.global.t('meos_control_web.offline'),
            bgColor: '#ffffff',
            color: '#C4C9CF'
        }
    ],
    pipelineData: []
};
const equipmentList = computed(() => props?.equipmentData || legendObj.equipmentData);

// 当前容器的css class（背景色）
const curContainerClass = computed(() => {
    return curGraphType;
});
</script>
<style lang="less" scoped>
.legend-wrap {
    max-width: calc(100% - 85px);
    width: max-content;
    display: flex;
    align-items: center;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    background: @legend-system-bg;
    flex-wrap: wrap;
    row-gap: 8px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;
    position: absolute;
    left: 50%;
    bottom: 0px;
    transition: all;
    transform: translateX(-50%);
    &.SYSTEM_GRAPH {
        background: @legend-system-bg;
    }
    &.WHOLO_BUILD_GRAPH,
    &.FLOOR_GRAPH {
        background: @legend-floor-bg;
    }

    &.SPACE_3D_GRAPH {
        background: @legend-space-3d-bg;

        .legend-category-name {
            color: @grey-100;
        }

        .legend-name {
            color: @grey-400;
        }
    }

    .legend-category-name {
        font-weight: 700;
    }

    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }
    }

    .legend-name {
        display: flex;
        align-items: center;
        color: @grey-600;
        img {
            display: inline-block;
            width: 16px;
            height: 16px;
        }
    }

    .divide {
        width: 1px;
        height: 14px;
        background: @grey-400;
        margin: 0 14px 0 2px;
    }

    .equipment .mark {
        display: inline-block;
        margin-right: 4px;
        width: 8px;
        height: 8px;
        border-radius: 10px;
        border: 2px solid #fff;
        box-sizing: content-box;
    }

    .pipeline .mark {
        display: inline-block;
        width: 14px;
        height: 3px;
        margin-right: 4px;
    }

    .switch .mark {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-size: cover;
        background-repeat: no-repeat;
        margin-right: 4px;
    }
}
</style>
