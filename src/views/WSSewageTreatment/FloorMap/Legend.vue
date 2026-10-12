<template>
    <div class="legend-wrap">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
        <div v-for="(item, index) in switchList" :key="index + 's'" class="switch legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-name ft">{{ item.name }}</span>
        </div>
        <div class="divide" />
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_liquid_level_status') }}</span>
        <div v-for="(item, index) in switchListEq" :key="index" class="pipeline legend-item">
            <component :is="item.component" v-if="item.component" class="rect-component" />
            <span v-else-if="item.innerText" class="rect-icon">{{ item.innerText }}</span>
            <span class="legend-name" :style="{ color: index === switchListEq.length - 1 ? '#8B949E' : '#626C78' }">{{ item.name }}</span>
        </div>
        <div class="divide" />
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.abnormal_event_colon') }}</span>
        <div v-for="(item, index) in switchAbnormal" :key="index" class="event legend-item">
            <component :is="item.component" v-if="item.component" class="rect-component" />
            <i v-else class="mark" :style="{ background: item.color }"></i>
            <span class="legend-name ft">{{ item.name }}</span>
        </div>
    </div>
</template>
<script setup>
import Normallevel from '@/assets/svg/normallevel.svg';
import Highlevel from '@/assets/svg/highlevel.svg';
import Ultrahighlevel from '@/assets/svg/ultrahighlevel.svg';
import AbnormalPump from '@/assets/svg/ws-related-pump-abnormal.svg';
import i18n from '@/localization';

const switchList = computed(() => legendObj.spaceStatus);
const switchListEq = computed(() => legendObj.switchListEq);
const switchAbnormal = computed(() => legendObj.abnormal);
const legendObj = {
    spaceStatus: [
        {
            name: i18n.global.t('meos_control_web.normal'),
            color: '#A3D4B6'
        },
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F0ABA8'
        }
    ],
    switchListEq: [
        {
            name: i18n.global.t('meos_control_web.normal_level'),
            component: Normallevel
        },
        {
            name: i18n.global.t('meos_control_web.high_very_high_level'),
            component: Highlevel
        },
        // {
        //     name: '超高液位',
        //     component: Ultrahighlevel
        // },
        {
            name: i18n.global.t('meos_control_web.no_data1'),
            innerText: '--'
        }
    ],
    abnormal: [
        {
            name: i18n.global.t('meos_control_web.device_exception'),
            color: '#F55047'
        },
        {
            name: i18n.global.t('meos_control_web.related_sewage_pump_abnormal'),
            component: AbnormalPump
        }
    ]
};
</script>
<style lang="less" scoped>
.legend-wrap {
    max-width: 100%;
    width: max-content;
    padding: 11px 20px;
    display: flex;
    align-items: center;
    border-radius: 4px 4px 0px 0px;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    flex-wrap: wrap;
    row-gap: 8px;
    white-space: nowrap;
    line-height: 20px;
    font-size: 14px;
    .legend-category-name {
        font-weight: 700;
        color: #2e3742;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }

        .rect-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 4px;
            font-size: 10px;
            line-height: 17px;
            color: #fff;
            text-align: center;
            border-radius: 3.333px;
            border: 0.833px solid rgba(255, 255, 255, 0.7);
            background: var(--gray-400, #c4c9cf);
        }
        .rect-component {
            margin-right: 4px;
        }
    }
}
.divide {
    width: 1px;
    height: 14px;
    background: #b1b9c2;
    margin-right: 12px;
}
.pipeline .mark {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 90px;
    margin-right: 4px;
    border: 1px solid #fff;
}

.event .mark {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 90px;
    margin-right: 4px;
    border: 1px solid #fff;
}

.switch .mark {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-right: 4px;
    border-radius: 2px;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
    text-align: center;
    line-height: 14px;
}
</style>
