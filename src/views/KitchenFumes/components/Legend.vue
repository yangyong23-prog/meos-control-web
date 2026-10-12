<template>
    <div class="kitchen-fumes-legend-wrapper">
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_running_colon') }}</span>
        <div
            v-for="(item, index) in legendObj.equipRunStatuses"
            :key="index"
            class="legend-item"
        >
            <i
                class="mark"
                :style="{ background: item.color }"
            ></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>

        <div class="divide"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_exception_colon') }}</span>
        <div
            v-for="(item, index) in legendObj.abnormalData"
            :key="index"
            class="abnormal legend-item"
        >
            <i
                class="mark"
                :style="{ background: item.color }"
            ></i>
            <span class="legend-name">{{ item.name }}</span>
        </div>

        <div class="divide"></div>
        <m-tips
            trigger="hover"
            theme="darkTransparent"
        >
            <template #content>
                <div
                    class="tips-content"
                    style="overflow: auto"
                >
                    <div
                        v-for="(item, idx) in cardLegendObj"
                        :key="idx"
                        class="item"
                    >
                        <div
                            class="legend-color-block"
                            :style="{ borderColor: item.borderColor, backgroundColor: item.bgColor }"
                        ></div>
                        <span>
                            <template
                                v-for="(text, i) in item.textArr"
                                :key="i"
                            >
                                <template v-if="text.startsWith('「')">
                                    <span
                                        class="label"
                                        :style="{ color: item.labelColor }"
                                        >{{ text }}</span
                                    >
                                </template>
                                <template v-else>{{ text }}</template>
                            </template>
                        </span>
                    </div>
                </div>
            </template>
            <div
                class="legend-card-color-desc"
                @mouseenter="hoverCardDesc = true"
                @mouseleave="hoverCardDesc = false"
            >
                {{ i18n.global.t('meos_control_web.card_color_legend') }}<IconMeriComponentDialogLinear :color="hoverCardDesc ? '#1B4ACC' : '#246fe5'" />
            </div>
        </m-tips>
    </div>
</template>

<script setup>
import { isEdge } from '@/utils/envUtils';

import { IconMeriComponentDialogLinear } from 'meri-icon';
import i18n from '@/localization';

const hoverCardDesc = ref(false);
const legendObj = {
    abnormalData: [
        {
            name: i18n.global.t('meos_control_web.abnormal'),
            color: '#F55047'
        },
        {
            name: i18n.global.t('meos_control_web.control_feedback_mismatch'),
            color: '#FFB800'
        },
        {
            name: i18n.global.t('meos_control_web.offline'),
            color: '#8B949E'
        }
    ],

    equipRunStatuses: [
        {
            name: i18n.global.t('meos_control_web.on'),
            color: '#09B3B5'
        },
        {
            name: i18n.global.t('meos_control_web.off'),
            color: '#626C78'
        },
        {
            name: i18n.global.t('meos_control_web.no_data1'),
            color: '#C4C9CF'
        }
    ]
};
const cardLegendObj = [
    {
        borderColor: '#F8766F',
        bgColor: 'rgba(255, 136, 136, 0.80)',
        labelColor: '#FFFFFF',
        textArr: [i18n.global.t('meos_control_web.indicate_exhaust_fan_or_device_event'), `「${i18n.global.t('meos_control_web.abnormal')}」`]
    },
    {
        borderColor: '#00A2A7',
        bgColor: 'rgba(150, 254, 251, 0.80)',
        labelColor: '#FFFFFF',
        textArr: [i18n.global.t('meos_control_web.indicate_exhaust_fan_status'), `「${i18n.global.t('common.status_open')}」`, i18n.global.t('meos_control_web.status')]
    },
    {
        borderColor: '#626C78',
        bgColor: 'rgba(165, 174, 184, 0.80)',
        labelColor: '#FFFFFF',
        textArr: [i18n.global.t('meos_control_web.indicate_exhaust_fan_status'), `「${i18n.global.t('common.status_close')}」`, i18n.global.t('meos_control_web.status')]
    },
    {
        borderColor: '#8B949E',
        bgColor: 'rgba(245, 250, 255, 0.80)',
        labelColor: '#FFFFFF',
        textArr: [i18n.global.t('meos_control_web.indicate_exhaust_fan_status'), `「${i18n.global.t('meos_control_web.no_data1')}」`, i18n.global.t('meos_control_web.status')]
    }
];
</script>

<style lang="less" scoped>
.kitchen-fumes-legend-wrapper {
    display: flex;
    flex-wrap: wrap;
    padding: 11px 20px;
    border-radius: 4px 4px 0px 0px;
    row-gap: 12px;
    z-index: 50;
    align-items: center;

    background: var(--Grey-50, #f7f9fa);

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
        margin-right: 16px;
        margin-left: 4px;
    }
    .legend-card-color-desc {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: default;

        color: var(--blue-500, #246fe5);
        font-size: 14px;
        font-style: default;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
        &:hover {
            color: #1b4acc;
        }
    }
}
.tips-content {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    .item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        .legend-color-block {
            width: 24px;
            height: 14px;
            min-width: 24px;
            min-height: 14px;
            border-radius: 2px;
            border: 1px solid var(--red-400, #f8766f);
            background: rgba(255, 201, 201, 0.8);
        }
        .label {
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
        }
    }
}
</style>
