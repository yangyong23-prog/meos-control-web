<template>
    <div class="legend-wrap">
        <span class="legend-category-name">{{ defaultTitle }}：</span>
        <div v-for="(item, index) in defaultData" :key="index" class="legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
        </div>
        <template v-if="currentFloorObj?.id || currentTab === CONTROL_BAR_TAB_KEYS.ABNORMAL || showModuleInfo">
            <div class="divide"></div>
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.door_status_colon') }}</span>
            <div v-for="(item, index) in doorStatusData" :key="index" class="status legend-item">
                <i class="mark" :style="{ background: item.color, border: item.border }">{{ item.text }}</i
                ><span class="legend-name">{{ item.name }}</span>
            </div>
            <div class="divide"></div>
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.abnormal_status_colon') }}</span>
            <div v-for="(item, index) in abnormalData" :key="index" class="abnormal legend-item">
                <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
            </div>
        </template>
    </div>
</template>
<script setup>
import { CONTROL_BAR_TAB_KEYS } from '../constants/index';
import { showModuleInfoInjectKey } from '../constants/injectKey';
import i18n from '@/localization';

const currentTab = inject('currentTab');
const currentFloorObj = inject('currentFloorObj');
const showModuleInfo = inject(showModuleInfoInjectKey);

// 全楼
const defaultTitle = computed(() => {
    if (currentTab?.value === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
        return i18n.global.t('meos_control_web.space_withdraw_alarm');
    } else if (currentTab?.value === CONTROL_BAR_TAB_KEYS.ACCESSDEMAND) {
        return i18n.global.t('meos_control_web.space_access');
    } else {
        return i18n.global.t('meos_control_web.space_status');
    }
});

const defaultData = computed(() => {
    if (currentTab?.value === CONTROL_BAR_TAB_KEYS.DEPLOYMENTSTATUS) {
        return [
            {
                name: i18n.global.t('common.arm'),
                color: '#F2B4A0'
            },
            {
                name: i18n.global.t('meos_control_web.partial_arm'),
                color: '#F1CD87'
            },
            {
                name: i18n.global.t('meos_control_web.disarm_alt'),
                color: '#B0C1D4'
            },
            {
                name: i18n.global.t('meos_control_web.monitoring_unavailable'),
                color: '#C3C8CE'
            }
        ];
    } else if (currentTab?.value === CONTROL_BAR_TAB_KEYS.ACCESSDEMAND) {
        return [
            {
                name: i18n.global.t('meos_control_web.open_access'),
                color: '#85D1A3'
            },
            {
                name: i18n.global.t('meos_control_web.permission_access'),
                color: '#8CBFE5'
            },
            {
                name: i18n.global.t('meos_control_web.no_access'),
                color: '#F0ABA8'
            },
            {
                name: i18n.global.t('meos_control_web.monitoring_unavailable'),
                color: '#BBC1C8 '
            }
        ];
    } else {
        // 全楼下选中空间异常tab下加正常 不选中只有异常
        if (showModuleInfo?.value) {
            return [
                {
                    name: i18n.global.t('meos_control_web.abnormal'),
                    color: '#F49995'
                },
                {
                    name: i18n.global.t('meos_control_web.normal'),
                    color: '#85CDA1'
                }
            ];
        } else {
            return [
                {
                    name: i18n.global.t('meos_control_web.abnormal'),
                    color: '#F49995'
                }
            ];
        }
    }
});

// 门状态
const doorStatusData = [
    {
        name: i18n.global.t('meos_control_web.normally_open'),
        text: i18n.global.t('meos_control_web.normally_open'),
        color: '#FFA51E',
        border: '0.819px rgba(255, 255, 255, 0.70)'
    },
    {
        name: i18n.global.t('meos_control_web.normally_closed'),
        text: i18n.global.t('meos_control_web.normally_closed'),
        color: '#7188A6',
        border: '1px rgba(255, 255, 255, 0.70)'
    },
    {
        name: i18n.global.t('meos_control_web.permission_access'),
        text: i18n.global.t('meos_control_web.permission'),
        color: '#45AFFE',
        border: '1px rgba(255, 255, 255, 0.70)'
    },
    {
        name: i18n.global.t('common.status_open'),
        text: i18n.global.t('meos_control_web.on'),
        color: '#09B3B5',
        border: '0.833px rgba(255, 255, 255, 0.70)'
    },
    {
        name: i18n.global.t('common.status_close'),
        text: i18n.global.t('meos_control_web.off'),
        color: '#424C59',
        border: '1px rgba(255, 255, 255, 0.70)'
    },
    {
        name: i18n.global.t('meos_control_web.no_data1'),
        text: '--',
        color: '#C4C9CF',
        border: '0.833px rgba(255, 255, 255, 0.70)'
    }
];

// 异常状态
// 楼层视角下选中空间异常tab下加正常 其余的tab添加
const abnormalData = computed(() => {
    if (showModuleInfo?.value && !currentFloorObj?.value && currentTab.value !== CONTROL_BAR_TAB_KEYS.ABNORMAL) {
        return [
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
                color: '#C4C9CF'
            },
            {
                name: i18n.global.t('meos_control_web.normal'),
                color: '#15AE55'
            }
        ];
    } else {
        return [
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
                color: '#C4C9CF'
            }
        ];
    }
});
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
</style>
