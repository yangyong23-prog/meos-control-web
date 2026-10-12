<script setup>
import i18n from '@/localization';
import MultipleDateRange from './MultipleDateRange.vue';
import HolidaySpecialConfig from './HolidaySpecialConfig.vue';

const props = defineProps({
    commonCode: {
        type: String,
        default: 'holidaysCommon'
    },
    specialCode: {
        type: String,
        default: 'holidaysSpecial'
    },
    isEdit: {
        type: Boolean,
        default: true
    }
});

const commonConfig = defineModel('common', {
    type: Array,
    default: () => []
});
const specialConfig = defineModel('special', {
    type: Array,
    default: () => []
});

const transformRangeToRender = ranges => {
    const finalString = ranges
        ?.map(v => v?.value)
        ?.filter(v => !!v)
        ?.join('、');
    return finalString || i18n.global.t('meos_control_web.none');
};
</script>

<template>
    <div class="holidays-list-container">
        <slot name="title"></slot>
        <div class="common-config">
            <MultipleDateRange
                v-show="props.isEdit"
                v-model:range-list="commonConfig"
                :title="i18n.global.t('meos_control_web.holiday_config_general_tips')"
                :code="props.commonCode"
            />
            <div v-show="!props.isEdit" class="detail">
                <div class="detail-title">{{ i18n.global.t('meos_control_web.holiday_config_general_tips') }}</div>
                <div class="days ffCustom-M">{{ transformRangeToRender(commonConfig) }}</div>
            </div>
        </div>
        <div class="special-config">
            <HolidaySpecialConfig
                v-show="props.isEdit"
                v-model:range-list="specialConfig"
                :title="i18n.global.t('meos_control_web.holiday_config_special_tips')"
                :code="props.specialCode"
                :tips="i18n.global.t('meos_control_web.holiday_config_special_tips_hover')"
            />
            <div v-show="!props.isEdit" class="detail">
                <div class="detail-title">{{ i18n.global.t('meos_control_web.holiday_config_special_tips') }}</div>
                <div class="days ffCustom-M">{{ transformRangeToRender(specialConfig) }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.holidays-list-container {
    display: flex;
    flex-direction: column;
    width: 100%;

    .common-config {
        padding-left: 14px;
    }

    .special-config {
        padding-left: 14px;
        padding-bottom: 4px;
    }
}

.detail-title {
    color: #626c78;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    margin-bottom: 10px;
}

.detail {
    margin-top: 10px;
}

.days {
    display: flex;
    align-items: center;
    color: @grey-600;
    font-size: 16px;
    font-style: normal;
    font-weight: var(--platform-font-weight);
    line-height: 22px;
}
</style>
