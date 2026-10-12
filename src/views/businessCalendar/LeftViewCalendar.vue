<template>
    <div class="left-view-calendar" :style="{ width: !isDesktop ? '320px' : '388px' }">
        <div class="header">
            <div v-ellipsis class="header-title">
                {{ i18n.global.t('meos_control_web.business_calendar_configuration') }}
            </div>
            <m-button type="link" size="medium" @click="editCalendarConfig">{{ i18n.global.t('meos_control_web.edit_config') }}</m-button>
        </div>
        <template v-if="isLeftAndRightLoading">
            <div class="loading-container">
                <m-list-skeleton />
            </div>
        </template>
        <template v-else-if="isEmpty">
            <Empty class="empty-container" :text="i18n.global.t('meos_control_web.nothing_configured_yet')" />
        </template>
        <m-scrollbar v-else>
            <div v-if="workRestDays?.length" class="row-item">
                <TitlePrefix :title="i18n.global.t('meos_control_web.work_rest_day_config')" :font-size="14" :line-height="22" />
                <div class="work-rest-content">
                    <template v-for="(dayItem, index) in workRestDays" :key="index">
                        <div class="work-rest-content-item">
                            <div class="content-item-title">{{ dayItem?.title || '--' }}</div>
                            <div class="days">
                                {{ dayItem?.data?.join('、') || i18n.global.t('meos_control_web.none') }}
                            </div>
                        </div>
                        <div v-if="index < workRestDays.length - 1" class="divider"></div>
                    </template>
                </div>
            </div>
            <div v-if="airDays?.length" class="row-item">
                <TitlePrefix :title="i18n.global.t('meos_control_web.hvac_season_config')" :font-size="14" :line-height="22" />
                <div class="air-content">
                    <template v-for="(airItem, index) in airDays" :key="index">
                        <div class="air-content-item" @mouseenter="handleHover(airItem?.ranges)" @mouseleave="handleUnhover">
                            <div class="content-item-title">{{ airItem?.title }}</div>
                            <div class="days ffCustom-M">{{ transformRangeToRender(airItem?.ranges) }}</div>
                        </div>
                        <div v-if="index < airDays.length - 1" class="divider"></div>
                    </template>
                </div>
            </div>
            <div v-if="airConditions?.length" class="row-item">
                <TitlePrefix :title="i18n.global.t('meos_control_web.hvac_operating_mode_config')" :font-size="14" :line-height="22" />
                <div class="air-content">
                    <template v-for="(airItem, index) in airConditions" :key="index">
                        <div class="air-content-item" @mouseenter="handleHover(airItem?.ranges)" @mouseleave="handleUnhover">
                            <div class="content-item-title">{{ airItem?.title }}</div>
                            <div class="days ffCustom-M">{{ transformRangeToRender(airItem?.ranges) }}</div>
                        </div>
                        <div v-if="index < airConditions.length - 1" class="divider"></div>
                    </template>
                </div>
            </div>
            <div v-if="anniversaryDays?.title" class="row-item">
                <TitlePrefix :title="i18n.global.t('meos_control_web.store_anniversary_config')" :font-size="14" :line-height="22" />
                <div class="anniversary-content-item" @mouseenter="handleHover(anniversaryDays?.ranges)" @mouseleave="handleUnhover">
                    <div class="content-item-title">{{ anniversaryDays?.title || '--' }}</div>
                    <div class="days ffCustom-M">
                        {{ transformRangeToRender(anniversaryDays?.ranges) }}
                    </div>
                </div>
            </div>
            <div v-if="holidayGeneralConfig?.length || holidaySpecialConfig?.length" class="row-item">
                <TitlePrefix :title="i18n.global.t('meos_control_web.holiday_config')" :font-size="14" :line-height="22" />
                <div class="holiday-content">
                    <div class="holiday-content-item" @mouseenter="handleHover(holidayGeneralConfig)" @mouseleave="handleUnhover">
                        <div class="content-item-title">{{ i18n.global.t('meos_control_web.general_config') }}</div>
                        <div class="days ffCustom-M">{{ transformDateToRender(holidayGeneralConfig) }}</div>
                    </div>
                    <div class="divider"></div>
                    <div class="holiday-content-item" @mouseenter="handleHover(holidaySpecialConfig, HOVER_DATA_TYPE.WITH_YEAR)" @mouseleave="handleUnhover">
                        <div class="content-item-title">{{ i18n.global.t('meos_control_web.special_config') }}</div>
                        <div class="days ffCustom-M">
                            {{ transformDateToRender(holidaySpecialConfig) }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row-item">
                <TitlePrefix :title="i18n.global.t('meos_control_web.business_hours_configuration')" :font-size="14" :line-height="22" />
                <div class="business-time-content">
                    <div class="business-time-content-item">
                        <div class="content-item-title">{{ i18n.global.t('meos_control_web.configuration_method') }}</div>
                        <div class="config-way">
                            {{ businessTimeConfigWay }}
                        </div>
                    </div>
                    <div class="divider"></div>
                    <template v-if="businessTimeObject?.dateTagType === BUSINESS_CONFIG_TYPE.Default">
                        <div class="business-time-content-item">
                            <div class="content-item-title">{{ i18n.global.t('meos_control_web.business_time_slot') }}</div>
                            <div :class="['time-ranges', checkShowText(businessTimeObject?.businessTimeRangeList) ? 'font-windows' : 'ffCustom-M']">
                                {{ transformRangeToRender(businessTimeObject?.businessTimeRangeList, true) }}
                            </div>
                        </div>
                    </template>
                    <template v-else-if="businessTimeObject?.dateTagType === BUSINESS_CONFIG_TYPE.Workday">
                        <div class="business-time-content-item">
                            <div class="content-item-title">{{ i18n.global.t('meos_control_web.weekday_business_hours') }}</div>
                            <div :class="['time-ranges', checkShowText(businessTimeObject?.workdayBusinessTimeRangeList) ? 'font-windows' : 'ffCustom-M']">
                                {{ transformRangeToRender(businessTimeObject?.workdayBusinessTimeRangeList, true) }}
                            </div>
                        </div>
                        <div class="divider"></div>
                        <div class="business-time-content-item">
                            <div class="content-item-title">{{ i18n.global.t('meos_control_web.rest_day_business_hours') }}</div>
                            <div :class="['time-ranges', checkShowText(businessTimeObject?.dayOffBusinessTimeRangeList) ? 'font-windows' : 'ffCustom-M']">
                                {{ transformRangeToRender(businessTimeObject?.dayOffBusinessTimeRangeList, true) }}
                            </div>
                        </div>
                    </template>
                    <template v-else-if="businessTimeObject?.dateTagType === BUSINESS_CONFIG_TYPE.Week">
                        <template v-for="(groupItem, index) in businessTimeObject.weekNumberParamList" :key="index">
                            <div class="business-time-content-item">
                                <div class="content-item-title">{{ transformWeekToLocal(groupItem?.weekNumberDays, true).join('、') }}</div>
                                <div :class="['time-ranges', checkShowText(groupItem?.ranges) ? 'font-windows' : 'ffCustom-M']">
                                    {{ transformRangeToRender(groupItem?.ranges, true) }}
                                </div>
                            </div>
                            <div v-if="index < businessTimeObject.weekNumberParamList.length - 1" class="divider"></div>
                        </template>
                    </template>
                    <I18nSlot v-if="configuredArr?.length" html-tag="div" class="count" name-key="meos_control_web.num_spaces_has_special_times">
                        <template #num>
                            <span class="highLight cp" @click="openSpecialConfiguration">{{ configuredArr?.length ?? 0 }}</span>
                        </template>
                    </I18nSlot>
                </div>
            </div>
        </m-scrollbar>
        <specialConfiguration v-model:show="specialCalendarShow" v-model="currentModel" :type="'details'" :data="data" :configured-arr="configuredArr" />
        <editModal v-model="editModalShow" @after-submit="afterSubmit" />
    </div>
</template>

<script setup>
import I18nSlot from '@/components/I18nSlot.vue';
import i18n from '@/localization';
import Empty from '@/components/common/Empty.vue';
import emitter from '@/utils/bus';
import TitlePrefix from '@/components/title-prefix/index.vue';
import editModal from './components/editModal.vue';
import specialConfiguration from './components/specialConfiguration.vue';
import useLeftDisposition from './hooks/useLeftDisposition';
import { isLeftAndRightLoadingKey } from './injectKeys';
import { useBreakpoints } from '@vueuse/core';
import { getAfterTodayRange, transformWeekToLocal, transformDayToRange, transformTimeToRange, transformRangeToRender, transformDateToRender } from './utils';
import { BUSINESS_CONFIG_TYPE, BUSINESS_CONFIG_RADIO_OPTIONS, HOVER_DATA_TYPE, WEEK_DAYS_MATCH_MAP, SEASON_MATCH_MAP } from './constants';

const { data, currentModel, configuredArr, getGlobalRuleFun } = useLeftDisposition();
const editModalShow = ref(false);
const specialCalendarShow = ref(false);
const isLeftAndRightLoading = inject(isLeftAndRightLoadingKey);

const breakpoints = useBreakpoints({
    laptop: 0,
    desktop: 1366
});
const activeBreakpoint = breakpoints.active();
const isDesktop = computed(() => activeBreakpoint.value === 'desktop');

const editCalendarConfig = () => {
    nextTick(() => {
        editModalShow.value = true;
    });
};
const openSpecialConfiguration = () => {
    specialCalendarShow.value = true;
};

const workRestDays = ref([]);
const airDays = ref([]);
const anniversaryDays = ref({});
const airConditions = ref([]);

const holidayGeneralConfig = ref([]);
const holidaySpecialConfig = ref([]);
const businessTimeObject = ref({ dateTagType: '', businessTimeRangeList: [], workdayBusinessTimeRangeList: [], dayOffBusinessTimeRangeList: [], weekNumberParamList: [] });
const isEmpty = ref(false);

const businessTimeConfigWay = computed(() => {
    const findObj = BUSINESS_CONFIG_RADIO_OPTIONS.find(v => v?.value === businessTimeObject?.value?.dateTagType);
    return findObj?.label || '--';
});

const checkShowText = ranges => {
    const hasAllDay = ranges?.some(v => v?.join('-') === '00:00-23:59');
    const isEmptyRange = !ranges?.length;
    return hasAllDay || isEmptyRange;
};

const handlePreviewData = res => {
    const {
        businessTimeRange,
        coolingSeasonDateRangeList = [],
        heatingSeasonDateRangeList = [],
        seasonRangeParam = {},
        weekdays = [],
        anniversary = [],
        holidayGeneralConfiguration = [],
        holidaySpecialConfiguration = []
    } = res || {};
    const needCheckKeys = ['coolingSeasonDateRangeList', 'heatingSeasonDateRangeList', 'anniversary', 'weekdays', 'holidayGeneralConfiguration', 'holidaySpecialConfiguration'];
    const needCheckEmpty = needCheckKeys.every(key => {
        return !res[key]?.length;
    });
    const isEmptyBusinessTime = !businessTimeRange?.dateTagType;
    const isEmptySeason = !Object.keys(seasonRangeParam || {})?.length;

    isEmpty.value = false;
    if (needCheckEmpty && isEmptyBusinessTime && isEmptySeason) {
        isEmpty.value = true;
    }
    const restDays = Object.keys(WEEK_DAYS_MATCH_MAP).filter(key => !weekdays?.includes(key));

    // 至少有一个工作日
    if (weekdays?.length) {
        workRestDays.value = [
            { title: i18n.global.t('meos_control_web.weekday'), data: transformWeekToLocal(weekdays) },
            {
                title: i18n.global.t('meos_control_web.rest_day'),
                data: transformWeekToLocal(restDays)
            }
        ];
    }

    if (Object.keys(seasonRangeParam).length) {
        airDays.value = Object.entries(seasonRangeParam)
            ?.map(([key, value], index) => {
                return {
                    type: key,
                    ...(SEASON_MATCH_MAP[key] || { title: key, order: index + 1 }),
                    ranges: transformDayToRange(value)
                };
            })
            ?.filter(v => v?.type !== 'airSummerPeakRangeList')
            ?.toSorted((a, b) => a?.order - b?.order);
    }

    if (Array.isArray(anniversary) && anniversary?.length) {
        anniversaryDays.value = { title: i18n.global.t('meos_control_web.store_anniversary_day'), ranges: transformDayToRange(anniversary) };
    }
    if (Array.isArray(holidayGeneralConfiguration) && holidayGeneralConfiguration?.length) {
        holidayGeneralConfig.value = transformDayToRange(holidayGeneralConfiguration);
    }
    if (Array.isArray(holidaySpecialConfiguration) && holidaySpecialConfiguration?.length) {
        // 时间选择框仅回显包含未来日的选择框，过去时间直接过滤显示
        const filterRes = getAfterTodayRange(holidaySpecialConfiguration);
        holidaySpecialConfig.value = transformDayToRange(filterRes);
    }
    if (coolingSeasonDateRangeList?.length || heatingSeasonDateRangeList?.length) {
        let cacheArr = [];
        if (coolingSeasonDateRangeList?.length) {
            cacheArr.push({ title: i18n.global.t('meos_control_web.cooling_period'), ranges: transformDayToRange(coolingSeasonDateRangeList) });
        }
        if (heatingSeasonDateRangeList?.length) {
            cacheArr.push({ title: i18n.global.t('meos_control_web.heating_period'), ranges: transformDayToRange(heatingSeasonDateRangeList) });
        }
        airConditions.value = cacheArr;
    }
    if (businessTimeRange?.dateTagType) {
        const { dateTagType, workdayBusinessTimeRangeList, dayOffBusinessTimeRangeList, businessTimeRangeList, weekNumberParamList = [] } = businessTimeRange || {};
        businessTimeObject.value = {
            dateTagType,
            workdayBusinessTimeRangeList: transformTimeToRange(workdayBusinessTimeRangeList),
            dayOffBusinessTimeRangeList: transformTimeToRange(dayOffBusinessTimeRangeList),
            businessTimeRangeList: transformTimeToRange(businessTimeRangeList),
            weekNumberParamList:
                weekNumberParamList?.map(v => {
                    const { weekdays: weekNumberDays, weekNumberBusinessTimeRangeList } = v;
                    return { weekNumberDays, ranges: transformTimeToRange(weekNumberBusinessTimeRangeList) };
                }) || []
        };
    }
};

const resetData = () => {
    workRestDays.value = [];
    airDays.value = [];
    anniversaryDays.value = {};
    airConditions.value = [];
    holidayGeneralConfig.value = [];
    holidaySpecialConfig.value = [];
    businessTimeObject.value = {
        dateTagType: '',
        businessTimeRangeList: [],
        workdayBusinessTimeRangeList: [],
        weekNumberParamList: []
    };
};

const updatePreviewData = async (isRefreshRight = false) => {
    const res = await getGlobalRuleFun();
    resetData();
    handlePreviewData(res);

    if (isRefreshRight) {
        // 更新右侧日历数据
        emitter.emit('updateList');
    }
};

onMounted(async () => {
    await updatePreviewData();
});

const afterSubmit = async () => {
    await updatePreviewData(true);
};

const handleHover = (ranges, type) => {
    emitter.emit('hoverCalendarDates', { ranges, type });
};
const handleUnhover = () => {
    emitter.emit('unhoverCalendarDates');
};
</script>

<style lang="less" scoped>
.left-view-calendar {
    display: flex;
    width: 388px;
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    padding: 16px;
    padding-bottom: 0px;
    padding-right: 0px;
    flex-direction: column;
    row-gap: 16px;
    background: rgba(255, 255, 255, 0.6);
}

.empty-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading-container {
    width: 100%;
    height: 100%;
    padding-right: 16px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
}
.header-title {
    color: @grey-900;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.row-item {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    padding-right: 16px;

    + .row-item {
        margin-top: 16px;
    }
}

.content-item-title {
    color: @grey-600;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: 22px;
}

.divider {
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed #e1e5eb;
}

.work-rest-content {
    display: flex;
    padding: 12px;
    flex-direction: column;
    justify-content: center;
    row-gap: 12px;
    background: #fff;

    .work-rest-content-item {
        display: flex;
        row-gap: 10px;
        flex-direction: column;
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
}

.air-content {
    background: #fff;

    .air-content-item {
        display: flex;
        flex-direction: column;
        padding: 12px;
        row-gap: 10px;

        &:hover {
            background: linear-gradient(90deg, rgba(213, 213, 213, 0.3) 0%, rgba(196, 201, 207, 0) 100%);
        }
    }

    .days {
        color: @grey-600;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
    }
}

.anniversary-content-item {
    display: flex;
    padding: 12px;
    flex-direction: column;
    row-gap: 10px;
    background: #fff;
    &:hover {
        background: linear-gradient(90deg, rgba(213, 213, 213, 0.3) 0%, rgba(196, 201, 207, 0) 100%);
    }

    .days {
        color: @grey-600;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
    }
}

.holiday-content {
    display: flex;
    padding: 0px;
    margin-bottom: 16px;
    flex-direction: column;
    background: #fff;
}
.holiday-content-item {
    display: flex;
    padding: 12px;
    flex-direction: column;
    row-gap: 10px;
    background: #fff;
    &:hover {
        background: linear-gradient(90deg, rgba(213, 213, 213, 0.3) 0%, rgba(196, 201, 207, 0) 100%);
    }

    .days {
        color: @grey-600;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
    }
}

.business-time-content {
    display: flex;
    padding: 12px;
    margin-bottom: 16px;
    flex-direction: column;
    row-gap: 12px;
    background: #fff;

    .business-time-content-item {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .config-way {
        color: @grey-600;
        font-size: 16px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;
    }
    .time-ranges {
        color: @grey-600;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22px;
    }
    .font-windows {
        font-weight: var(--platform-font-weight);
    }
    .count {
        color: @grey-600;
        font-size: 14px;
        font-style: normal;
        font-weight: var(--platform-font-weight);
        line-height: 22px;

        .highLight {
            color: @blue-500;
            font-weight: 700;
        }
    }
}
</style>
