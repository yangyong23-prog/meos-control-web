<template>
    <div
        v-if="
            (currentTabVal === CONTROL_BAR_TAB_KEYS.QUALITY && qualityLegendList?.length) ||
            (spaceLegendList && spaceLegendList.length) ||
            ((showModuleInfo || curViewAbnormal || floorView) && equipLegendList?.length)
        "
        class="legend-wrap"
    >
        <template v-if="currentTabVal === CONTROL_BAR_TAB_KEYS.QUALITY">
            <span class="legend-category-name">{{ spaceLegendTitle }}</span>
            <div v-for="(item, index) in qualityLegendList" :key="index + 's'" class="legend-item-level">
                <div v-ellipsis class="legend-item-text m-ellipsis">
                    {{ item.value }}
                </div>
                <div
                    class="legend-item-bar"
                    :class="{
                        'legend-item-bar-first': index === 0,
                        'legend-item-bar-last': index === qualityLegendList.length - 1
                    }"
                    :style="{ backgroundColor: item.color }"
                ></div>
            </div>
        </template>
        <template v-else>
            <span v-if="spaceLegendList && spaceLegendList.length" class="legend-category-name">{{ spaceLegendTitle }}</span>
            <div v-for="(item, index) in spaceLegendList" :key="index + 's'" class="switch legend-item">
                <i class="mark" :style="{ background: item.color }"></i>
                <span class="legend-name">{{ item.name }}</span>
            </div>
        </template>
        <template v-if="(showModuleInfo || curViewAbnormal || floorView) && equipLegendList?.length">
            <div class="get-line ml12 mr12"></div>
            <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_status_colon') }}</span>
            <div v-for="(item, index) in equipLegendList" :key="index" class="pipeline legend-item">
                <component :is="item.icon" v-if="item.icon" class="mark-icon" aria-hidden="true"></component>
                <i v-else class="mark" :style="{ background: item.color }"></i
                ><span class="legend-name" :style="{ color: index === switchListEq.length - 1 ? '#8B949E' : '#626C78' }">{{ item.name }}</span>
            </div>
        </template>
    </div>
</template>
<script setup>
import { ENV_ATTR_KEYS, CONTROL_BAR_TAB_KEYS } from '../constants/constant';
import { currentFloorObjKey } from '../injectKeys';
import { equipLoadedEmptyKey } from '../hooks/useACGlobalData';
import NoneIcon from '@/assets/svg/noneIcon.svg';
import NoneOperate from '@/assets/svg/noneoperate.svg';
import i18n, { SupportLanguage, getLocaleLang, DEFAULT_LANG, isCurrentCn } from '@/localization';
import { defineAsyncComponent } from 'vue';

const currentTab = inject('currentTab');
const currentTabFloor = inject('currentTabFloor');
const currentFloorObj = inject(currentFloorObjKey);
const qualityLegendList = inject('qualityLegendList');
const schedulingLengendList = inject('schedulingLengendList');
const currentEnvAttr = inject('currentEnvAttr');
const currentEnvAttrFloor = inject('currentEnvAttrFloor');
const showModuleInfo = inject('showModuleInfo');
const equipLoadedEmpty = inject(equipLoadedEmptyKey);
const OpenIcon = defineAsyncComponent(() =>
    getLocaleLang(DEFAULT_LANG) === SupportLanguage.en ? import('@/assets/locales/en/openIcon.svg') : import('@/assets/locales/zh/openIcon.svg')
);
const CloseIcon = defineAsyncComponent(() =>
    getLocaleLang(DEFAULT_LANG) === SupportLanguage.en ? import('@/assets/locales/en/closeIcon.svg') : import('@/assets/locales/zh/closeIcon.svg')
);
const legendObj = {
    switchListEq: [
        {
            name: i18n.global.t('meos_control_web.on'),
            color: '#C4C9CF',
            icon: OpenIcon
        },
        {
            name: i18n.global.t('meos_control_web.off'),
            color: '#C4C9CF',
            icon: CloseIcon
        },
        {
            name: i18n.global.t('meos_control_web.no_data1'),
            color: '#C4C9CF',
            icon: NoneIcon
        },
        {
            name: i18n.global.t('meos_control_web.non_running_equipment'),
            color: '#64A6F7',
            icon: NoneOperate
        },
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
    ]
};
const eqUnAbnormalLegendItem = {
    name: i18n.global.t('meos_control_web.normal'),
    color: '#15AE55'
};

const currentTabVal = computed(() => {
    return floorView.value ? currentTabFloor.value : currentTab.value;
});
const currentEnvVal = computed(() => {
    return floorView.value ? currentEnvAttrFloor.value : currentEnvAttr.value;
});
const curViewAbnormal = computed(() => {
    return currentTabVal.value === CONTROL_BAR_TAB_KEYS.ABNORMAL;
});
const switchListEq = computed(() => legendObj.switchListEq);

const unAbnormalLegendItem = {
    name: i18n.global.t('meos_control_web.normal'),
    color: '#85CDA1'
};
const abnormalLegends = [
    {
        name: i18n.global.t('meos_control_web.abnormal'),
        color: '#F49995'
    },
    {
        name: i18n.global.t('meos_control_web.monitoring_unavailable'),
        color: '#BBC1C8'
    }
];
// 空间图例列表
const spaceLegendList = computed(() => {
    if (currentTabVal.value === CONTROL_BAR_TAB_KEYS.QUALITY) {
        return qualityLegendList.value;
    } else if (currentTabVal.value === CONTROL_BAR_TAB_KEYS.SCHEDUING) {
        return schedulingLengendList.value;
    } else if (currentTabVal.value === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
        const arr = [...abnormalLegends];
        if (showModuleInfo.value) {
            arr.splice(1, 0, unAbnormalLegendItem);
        }
        return arr;
    }
    return [];
});
const equipLegendList = computed(() => {
    if (equipLoadedEmpty.value) {
        return [];
    }

    const arr = floorView.value ? legendObj.switchListEq : legendObj.switchListEq.slice(4, 7);
    // 选中对象详情时显示
    if (showModuleInfo.value) {
        return [...arr, eqUnAbnormalLegendItem];
    } else if (currentTabVal.value === CONTROL_BAR_TAB_KEYS.ABNORMAL || floorView.value) {
        // 在异常tab 或楼层视角时显示
        return arr;
    }

    return [];
});
const ENV_SPACE_NAME = {
    [ENV_ATTR_KEYS.TEMPERATURE]: i18n.global.t('meos_control_web.space_temperature'),
    [ENV_ATTR_KEYS.CO2]: i18n.global.t('meos_control_web.zone_co2_concentration')
};
// 空间图例标题
const spaceLegendTitle = computed(() => {
    if (currentTabVal.value === CONTROL_BAR_TAB_KEYS.ABNORMAL) {
        return i18n.global.t('meos_control_web.space_status_colon');
    } else {
        const text = `${ENV_SPACE_NAME[currentEnvVal.value] || i18n.global.t('meos_control_web.zone_data')}${isCurrentCn() ? '' : ' '}${
            currentTabVal.value === CONTROL_BAR_TAB_KEYS.SCHEDUING ? i18n.global.t('meos_control_web.demand') : ''
        }：`;
        return text;
    }
});

const floorView = computed(() => {
    return !!currentFloorObj.value?.id;
});

watch(
    () => currentTab?.value,
    val => {
        currentTab.value = val;
    },
    {
        deep: true
    }
);
</script>
<style lang="less" scoped>
.legend-wrap {
    max-width: 100%;
    width: max-content;
    display: flex;
    align-items: center;
    background: linear-gradient(180deg, #e1e7ee 0%, #d6dde5 100%);
    border-radius: 4px 4px 0px 0px;
    flex-wrap: wrap;
    row-gap: 8px;
    font-size: 12px;
    white-space: nowrap;
    padding: 11px 20px;
    .legend-category-name {
        font-weight: 700;
        color: #2e3742;
        font-size: 14px;
        margin-right: 4px;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;

        &:last-child {
            margin-right: 0;
        }
    }

    .legend-item-level {
        .legend-item-text {
            width: 52px;
            color: var(--gray-900, #1b2129);
            font-size: 12px;
            line-height: 18px;
            text-align: center;
            margin-bottom: 0px;
            .grey {
                color: #626c78;
            }
        }
        .legend-item-bar {
            height: 6px;
            width: 52px;
        }
        // .legend-item-bar-tem {
        //     width: 52px;
        // }
        // .legend-item-bar-CO2 {
        //     width: 52px;
        // }
        .legend-item-bar-first {
            border-radius: 2px 0 0 2px;
        }
        .legend-item-bar-last {
            border-radius: 0 2px 2px 0;
        }
    }

    .legend-name {
        color: @grey-600;
    }

    .divide {
        width: 1px;
        height: 14px;
        background: @grey-400;
        margin: 0 14px 0 2px;
    }
    .get-line {
        width: 1px;
        height: 14px;
        background: @grey-400;
    }
    .pipeline .mark {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 90px;
        margin-right: 4px;
        border: 1px solid #fff;
    }

    .switch .mark {
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
    .mark-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 4px;
    }
}
</style>
