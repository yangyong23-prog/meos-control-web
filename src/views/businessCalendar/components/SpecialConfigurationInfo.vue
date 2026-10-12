<template>
    <div class="special-config-container">
        <TitlePrefix
            class="config-content-container"
            :title="i18n.global.t('meos_control_web.configuration_content')"
            :font-size="14"
            :line-height="22"
        />

        <div class="config-way padding-left">
            <span class="label mr4">{{ i18n.global.t('meos_control_web.business_mode') }} ：</span>
            <span class="render-value">{{ businessTimeConfigWay }}</span>
        </div>
        <div
            v-if="props.modelParams?.radioValue === BUSINESS_CONFIG_TYPE.Default"
            class="row padding-left"
        >
            <div class="label">{{ i18n.global.t('meos_control_web.business_time_slot') }} ：</div>
            <div class="render-value">
                {{ transformRangeToInfoRender(props.modelParams?.businessTimeRangeList, true) }}
            </div>
        </div>
        <div
            v-if="props.modelParams?.radioValue === BUSINESS_CONFIG_TYPE.Workday"
            class="padding-left"
        >
            <div class="row">
                <div class="label mr12">{{ i18n.global.t('meos_control_web.weekday_business_hours') }} ：</div>
                <div class="render-value">
                    {{ transformRangeToInfoRender(props.modelParams?.workdayBusinessTimeRangeList, true) }}
                </div>
            </div>
            <div class="row">
                <div class="label mr12">{{ i18n.global.t('meos_control_web.rest_day_business_hours_colon') }}</div>
                <div class="render-value">
                    {{ transformRangeToInfoRender(props.modelParams?.dayOffBusinessTimeRangeList, true) }}
                </div>
            </div>
        </div>
        <div v-if="props.modelParams?.radioValue === BUSINESS_CONFIG_TYPE.Week">
            <div
                v-for="(group, index) in props.modelParams?.weekNumberParamList"
                :key="`${group.groupId}-${index}`"
                class="group-card"
            >
                <div class="card-row">
                    <div class="label mr4">{{ i18n.global.t('meos_control_web.week_number') }}：</div>
                    <div class="render-value">
                        {{ transformWeekToLocal(group?.weekNumbers, true)?.join('、') }}
                    </div>
                </div>
                <div class="card-row">
                    <div class="label mr12">{{ i18n.global.t('meos_control_web.business_time_slot') }}：</div>
                    <div class="render-value">
                        {{ transformRangeToInfoRender(group?.rangeList, true) }}
                    </div>
                </div>
            </div>
        </div>
        <template v-if="validSpecialConfig.length">
            <TitlePrefix
                class="special-content-container"
                :title="i18n.global.t('meos_control_web.special_config_content')"
                :font-size="14"
                :line-height="22"
            />
            <div
                v-for="(group, index) in validSpecialConfig"
                :key="`${group.groupId}-${index}`"
                class="group-card"
            >
                <div class="card-row">
                    <div class="label mr4">{{ i18n.global.t('meos_control_web.date_range') }}：</div>
                    <div class="render-value">
                        {{ group?.dateRange || '--' }}
                    </div>
                </div>
                <div class="card-row">
                    <div class="label mr12">{{ i18n.global.t('meos_control_web.business_time_slot') }}：</div>
                    <div class="render-value">
                        {{ transformRangeToInfoRender(group?.rangeList, true) }}
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import i18n from '@/localization';
import TitlePrefix from '@/components/title-prefix/index.vue';
import { BUSINESS_CONFIG_RADIO_OPTIONS, BUSINESS_CONFIG_TYPE } from '../constants';
import { transformWeekToLocal } from '../utils';

const props = defineProps({
    modelParams: {
        type: Object,
        default: () => ({})
    }
});

const businessTimeConfigWay = computed(() => {
    const findObj = BUSINESS_CONFIG_RADIO_OPTIONS.find(v => v?.value === props.modelParams?.radioValue);
    return findObj?.label || '--';
});

const validSpecialConfig = computed(() => {
    const curData = props.modelParams?.specialConfigurationContentParamList || [];
    return curData?.filter(v => v?.dateRange);
});

const transformRangeToInfoRender = (ranges, showAllDay = false) => {
    const finalString = ranges
        ?.map(v => {
            const { startTime = '', endTime = '' } = v?.rowTimeRange || {};
            const timeStr = v?.value ? v?.value : `${startTime}-${endTime.replace('23:59', '24:00')}`;
            if (showAllDay && (timeStr === '00:00-23:59' || timeStr === '00:00-24:00')) {
                return i18n.global.t('meos_control_web.all_day');
            }
            if (!v?.value && !(startTime && endTime)) {
                return '';
            }
            return timeStr;
        })
        ?.join('、');
    if (showAllDay) {
        return finalString || i18n.global.t('meos_control_web.closed');
    }
    return finalString;
};
</script>

<style lang="less" scoped>
.special-config-container {
    display: flex;
    flex-direction: column;
}
.config-content-container {
    margin-bottom: 16px;
}
.special-content-container {
    margin-bottom: 16px;
    margin-top: 12px;
}
.padding-left {
    padding-left: 12px;
}
.config-way {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}
.card-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;

    & + .row {
        margin-top: 12px;
    }
}
.label {
    width: fit-content;
    color: #626c78;

    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
}
.render-value {
    color: #1b2129;
}
.group-card {
    display: flex;
    padding: 12px;
    flex-direction: column;
    gap: 10px;
    border-radius: 8px;
    background: #f7f9fa;

    & + .group-card {
        margin-top: 8px;
    }
}
</style>
