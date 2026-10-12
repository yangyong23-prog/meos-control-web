<template>
    <div class="legend-wrap">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.abnormal_status_colon') }}</span>
        <div v-for="(item, index) in equipmentList" :key="index" class="equipment legend-item">
            <i class="mark" :style="{ borderColor: item.bgColor, background: item.color }"></i
            ><span class="legend-name"
                >{{ item.name }}
                <template v-if="item.name === i18n.global.t('meos_control_web.power_off')"> (<img src="@/assets/imgs/demand/poverfailure.png" alt="Power Failure" />) </template>
            </span>
        </div>
        <div v-if="pipelineList?.length" class="divide"></div>
        <span v-if="pipelineList?.length" class="legend-category-name">{{ i18n.global.t('meos_control_web.cable_colon') }}</span>
        <div v-for="(item, index) in pipelineList" :key="index" class="pipeline legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
        </div>
    </div>
</template>
<script setup>
import switchOpen from '@/assets/images/operateMonitoring/switch-open.png';
import switchClose from '@/assets/images/operateMonitoring/switch-close.png';
import switchNoData from '@/assets/images/operateMonitoring/switch-nodata.png';
import i18n from '@/localization';

const props = defineProps({
    equipmentData: {
        type: Array,
        default: () => null
    },
    switchData: {
        type: Array,
        default: () => null
    },
    pipelineData: {
        type: Array,
        default: () => null
    }
});
const legendObj = {
    equipmentData: [
        {
            id: 'normal',
            name: i18n.global.t('meos_control_web.normal'),
            bgColor: '#ffffff',
            color: '#0C9B4A'
        },
        {
            id: 'abnormal',
            name: i18n.global.t('meos_control_web.abnormal'),
            bgColor: '#ffffff',
            color: '#F55047'
        }
    ],
    switchData: [
        {
            id: 'statusOpen',
            name: i18n.global.t('meos_control_web.on'),
            imgSrc: switchOpen
        },
        {
            id: 'statusClose',
            name: i18n.global.t('meos_control_web.off'),
            imgSrc: switchClose
        },
        {
            id: 'noData',
            name: i18n.global.t('meos_control_web.no_data1'),
            imgSrc: switchNoData
        }
    ],
    pipelineData: []
};
const equipmentList = computed(() => props?.equipmentData || legendObj.equipmentData);

const switchList = computed(() => props?.switchData || legendObj.switchData);

const pipelineList = computed(() => props?.pipelineData || legendObj.pipelineData);
</script>
<style lang="less" scoped>
.legend-wrap {
    max-width: calc(100% - 85px);
    width: max-content;
    display: flex;
    align-items: center;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    // background: @legend-system-bg;
    background: linear-gradient(180deg, #e9ecef 0%, #d6dde5 100%);
    flex-wrap: wrap;
    row-gap: 8px;
    font-size: 12px;
    white-space: nowrap;
    pointer-events: none;

    &.SYSTEM_GRAPH {
        background: @legend-system-bg;
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
