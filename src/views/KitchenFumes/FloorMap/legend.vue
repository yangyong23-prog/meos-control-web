<template>
    <div class="legend-wrap">
        <span class="legend-title">{{ i18n.global.t('meos_control_web.space_status_colon') }}</span>
        <div v-for="(item, index) in spaceStatuList" :key="index + 's'" class="switch legend-item">
            <i class="mark" :style="{ background: item.color }"></i><span class="legend-name">{{ item.name }}</span>
        </div>

        <div class="divide"></div>
        <span class="legend-category-name">{{ i18n.global.t('meos_control_web.device_status_colon') }}</span>
        <div v-for="(item, index) in equipStatusData" :key="index" class="equip legend-item">
            <component :is="item.icon" v-if="item.icon" class="mark-icon" aria-hidden="true"></component>
            <i v-else class="mark" :style="{ background: item.color }"></i
            ><span class="legend-name" :style="{ color: index === equipStatusData.length - 1 ? '#8B949E' : '#626C78' }">{{ item.name }}</span>
        </div>

        <!-- <div class="divide" /> -->
    </div>
</template>
<script setup>
import i18n, { SupportLanguage, getLocaleLang, DEFAULT_LANG, isCurrentCn } from '@/localization';
import { defineAsyncComponent } from 'vue';
import NoneIcon from '@/assets/svg/noneIcon.svg';
import NoneOperate from '@/assets/svg/noneoperate.svg';

const OpenIcon = defineAsyncComponent(() =>
    getLocaleLang(DEFAULT_LANG) === SupportLanguage.en ? import('@/assets/locales/en/openIcon.svg') : import('@/assets/locales/zh/openIcon.svg')
);
const CloseIcon = defineAsyncComponent(() =>
    getLocaleLang(DEFAULT_LANG) === SupportLanguage.en ? import('@/assets/locales/en/closeIcon.svg') : import('@/assets/locales/zh/closeIcon.svg')
);
const spaceStatuList = [
    {
        name: i18n.global.t('meos_control_web.space_status_exhausting_oil_smoke'),
        color: '#9BD6DE'
    },
    {
        name: i18n.global.t('meos_control_web.space_status_not_exhausting_oil_smoke'),
        color: '#EDD4A1'
    },
    {
        name: i18n.global.t('meos_control_web.space_status_no_data'),
        color: '#CACFD4'
    }
];
const equipStatusData = [
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

const equipLegendList = computed(() => {
    const arr = equipStatusData;
    // 选中对象详情时显示

    return arr;
});
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
    .legend-title {
        font-weight: 700;
        color: #2e3742;
    }
    .legend-name {
        color: #626c78;
    }
    .legend-value {
        color: var(--gray-600, #626c78);
        font-size: 14px;
        font-weight: var(--platform-font-weight);
        line-height: 18px;
    }
    .legend-item {
        display: flex;
        align-items: center;
        margin-right: 12px;
        &:last-child {
            margin-right: 0;
        }
    }
    .legend-item-camera {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        padding: 0.9px 0.899px 1.8px 1.801px;
    }
}
.divide {
    width: 1px;
    height: 14px;
    background: #b1b9c2;
    margin-right: 12px;
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
.equip .mark {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 90px;
    margin-right: 4px;
    border: 1px solid #fff;
}
.mark-icon {
    display: inline-block;
    // width: 18px;
    // height: 18px;
    margin-right: 4px;
}
</style>
