<template>
    <m-modal
        v-model:visible="showModal"
        :append-to="$modalAppendTo"
        :need-scrollbar="false"
        :width="840"
        :height="536"
        type="default"
        :title="i18n.global.t('meos_control_web.edit_config')"
        modal-class-name="edit-disposition-modal"
        @close="close"
    >
        <template #content>
            <div class="f edit-modal-item">
                <div class="left-modal-item">
                    <m-form
                        ref="Form"
                        label-width="108px"
                        :model="params"
                        :rules="rules"
                        label-position="top"
                        :scroll-to-error="false"
                        require-asterisk-position="right"
                        :class="{ 'config-edit-box': true }"
                    >
                        <m-scrollbar box-class="scrollbar-container" class="left-scrollbar">
                            <div class="form-item">
                                <div :id="'calendar_label_configuration'" class="title-item f16 fb7 mb8">
                                    {{ i18n.global.t('meos_control_web.calendar_label_configuration') }}
                                </div>
                                <m-checkbox-group v-model="calendarTag">
                                    <div class="list padding-left-gap">
                                        <m-checkbox v-for="(item, index) in calendarTagList" :key="index" :label="item.value" :size="14">
                                            <span>{{ item.label }}</span>
                                        </m-checkbox>
                                    </div>
                                </m-checkbox-group>
                            </div>
                            <div v-if="calendarTag.includes(calendarTagIdsMap.WORKDAY_DAY_OFF_CONFIG)" class="working-day-item form-item mb20">
                                <div :id="'work_rest_day_config'" class="title-item mb8">
                                    <span class="f16 fb7">{{ i18n.global.t('meos_control_web.work_rest_day_config') }}</span>
                                    <span class="ft ml4">{{ i18n.global.t('meos_control_web.checked_marked_as_weekday') }}</span>
                                </div>
                                <m-form-item label="" prop="weekdays" label-width="124px" class="padding-left-gap">
                                    <m-checkbox-group v-model="params.weekdays">
                                        <div v-for="(value, key) in WEEKDAYS" :key="key" style="margin-right: 4px">
                                            <!-- pop提示 -->
                                            <m-tips
                                                v-if="params.weekdays.length == 1 && params.weekdays[0] == key"
                                                :content="i18n.global.t('meos_control_web.select_at_least_one_weekday')"
                                                theme="darkTransparent"
                                            >
                                                <m-checkbox :key="key" :label="key" :disabled="params.weekdays.length == 1 && params.weekdays[0] == key">
                                                    {{ value }}
                                                </m-checkbox>
                                            </m-tips>
                                            <m-checkbox v-else :key="key" :label="key" :disabled="params.weekdays.length == 1 && params.weekdays[0] == key">
                                                {{ value }}
                                            </m-checkbox>
                                        </div>
                                    </m-checkbox-group>
                                </m-form-item>
                            </div>
                            <div v-if="calendarTag.includes(calendarTagIdsMap.AC_SEASON_CONFIG)" class="form-item">
                                <div :id="'hvac_season_config'" class="title-item f16 fb7 mb8">
                                    {{ i18n.global.t('meos_control_web.hvac_season_config') }}
                                </div>
                                <div class="air-conditioning-season">
                                    <div class="f14 ft mb12">{{ i18n.global.t('meos_control_web.please_select_ac_season_to_display') }} :</div>
                                    <m-checkbox-group v-model="params.value" @change="changeCheckbox">
                                        <div class="list">
                                            <m-popover
                                                v-for="(item, index) in optionsFuc"
                                                :key="index"
                                                :content="i18n.global.t('meos_control_web.i_am_hint_text')"
                                                placement="top"
                                                theme="darkTransparent"
                                                :show-arrow="false"
                                                :disabled="!item.disabled"
                                            >
                                                <template #content>{{ i18n.global.t('meos_control_web.summer_must_be_checked_before_peak') }}</template>
                                                <m-checkbox :disabled="item.disabled" :label="item.name">{{ item.label }}</m-checkbox>
                                            </m-popover>
                                        </div>
                                    </m-checkbox-group>
                                    <template v-if="airConditioningSeason.length">
                                        <div class="get-line mb12"></div>
                                        <div class="give-example">
                                            <div class="f14 fb7">{{ i18n.global.t('meos_control_web.group_defined_ac_season') }}</div>
                                            <div class="ft mt4">{{ airConditioningSeason }}</div>
                                        </div>
                                    </template>
                                </div>
                                <div v-if="params.value.length" class="padding-left-gap all-with-action-items">
                                    <div v-if="params.value.includes('airSeasonSpringRangeList')" class="class-box">
                                        <DateList
                                            :list="params.obj.airSeasonSpringRangeList"
                                            :other-list="allList('airSeasonSpringRangeList')"
                                            :title="i18n.global.t('meos_control_web.transition_spring')"
                                            code="airSeasonSpringRangeList"
                                        />
                                    </div>
                                    <div v-if="params.value.includes('airSummerRangeList')" class="class-box">
                                        <DateList
                                            :list="params.obj.airSummerRangeList"
                                            :other-list="allList('airSummerRangeList')"
                                            code="airSummerRangeList"
                                            :title="i18n.global.t('meos_control_web.summer')"
                                            @item-selected="handleItemSelected"
                                        />
                                    </div>
                                    <!-- <div v-if="params.value.includes('airSummerPeakRangeList')" class="class-box">
                                        <summerDateList :list="params.airSummerPeakRangeList" :other-list="[]" :title="i18n.global.t('meos_control_web.summer_peak')" code="airSummerPeakRangeList"></summerDateList>
                                    </div> -->
                                    <div v-if="params.value.includes('airSeasonAutumnRangeList')" class="class-box">
                                        <DateList
                                            :list="params.obj.airSeasonAutumnRangeList"
                                            :other-list="allList('airSeasonAutumnRangeList')"
                                            :title="i18n.global.t('meos_control_web.transition_season_autumn')"
                                            code="airSeasonAutumnRangeList"
                                        />
                                    </div>
                                    <div v-if="params.value.includes('airWinterRangeList')" class="class-box">
                                        <DateList
                                            :list="params.obj.airWinterRangeList"
                                            :other-list="allList('airWinterRangeList')"
                                            :title="i18n.global.t('meos_control_web.winter')"
                                            code="airWinterRangeList"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div v-if="calendarTag.includes(calendarTagIdsMap.AC_OPERATING_MODE_CONFIG)" :class="[params.value.length ? '' : 'mt20', 'form-item']">
                                <div :id="'hvac_operating_mode_config'" class="title-item f16 fb7">
                                    {{ i18n.global.t('meos_control_web.hvac_operating_mode_config') }}
                                </div>
                                <DateList
                                    class="padding-left-gap all-with-action-items"
                                    :list="params.coldList"
                                    :other-list="params.warmList"
                                    code="coldList"
                                    :title="i18n.global.t('meos_control_web.cooling_period')"
                                />
                                <div class="get-line transform-left-gap mt8 mb8"></div>
                                <DateList
                                    class="padding-left-gap all-with-action-items"
                                    :list="params.warmList"
                                    :other-list="params.coldList"
                                    code="warmList"
                                    :title="i18n.global.t('meos_control_web.heating_period')"
                                />
                            </div>
                            <div v-if="calendarTag.includes(calendarTagIdsMap.STORE_ANNIVERSARY_CONFIG)" class="form-item">
                                <div :id="'store_anniversary_config'" class="title-item f16 fb7">
                                    {{ i18n.global.t('meos_control_web.store_anniversary_config') }}
                                </div>
                                <DateList
                                    class="padding-left-gap all-with-action-items"
                                    :list="params.anniversaries"
                                    :other-list="[]"
                                    code="anniversaries"
                                    :title="i18n.global.t('meos_control_web.store_anniversary_day')"
                                />
                            </div>
                            <HolidaysList
                                v-if="calendarTag.includes(calendarTagIdsMap.STORE_HOLIDAYS_CONFIG)"
                                v-model:common="params.holidaysCommon"
                                v-model:special="params.holidaysSpecial"
                            >
                                <template #title>
                                    <div :id="'store_holidays_config'" class="title-item f16 fb7">
                                        <span>{{ i18n.global.t('meos_control_web.holiday_config') }}</span>
                                        <m-popover
                                            :show-arrow="false"
                                            theme="darkTransparent"
                                            placement="right-start"
                                            :content="i18n.global.t('meos_control_web.holiday_config_title_hover')"
                                        >
                                            <IconMeriComponentDialogLinear class="title-hover-icon" :size="16" color="var(--gray-600)" />
                                        </m-popover>
                                    </div>
                                </template>
                            </HolidaysList>
                            <div class="form-item">
                                <div class="fcb">
                                    <div :id="'business_hours_configuration'" class="title-item f16 fb7">
                                        {{ i18n.global.t('meos_control_web.business_hours_configuration') }}
                                    </div>
                                    <m-button v-if="!isConfiguredLoading" type="link" size="small" @click="configuration">{{
                                        i18n.global.t('meos_control_web.special_object_config')
                                    }}</m-button>
                                    <template v-else>
                                        <m-tips :content="i18n.global.t('meos_control_web.loading_please_wait_alt2')" theme="darkTransparent">
                                            <m-button type="link" size="small" disabled>{{ i18n.global.t('meos_control_web.special_object_config') }}</m-button>
                                        </m-tips>
                                    </template>
                                </div>
                                <div class="fcb look-item mt8">
                                    <I18nSlot html-tag="div" class="f14" name-key="meos_control_web.current_num_to_settle">
                                        <template #count>
                                            <span class="fb7">{{ configuredArr?.length?.toString() || '--' }}</span>
                                        </template>
                                    </I18nSlot>
                                    <m-button v-if="!isConfiguredLoading" type="link" size="small" @click="configuration">{{ i18n.global.t('meos_control_web.view') }}</m-button>
                                    <template v-else>
                                        <m-tips :content="i18n.global.t('meos_control_web.loading_please_wait_alt2')" theme="darkTransparent">
                                            <m-button type="link" size="small" disabled>{{ i18n.global.t('meos_control_web.view') }}</m-button>
                                        </m-tips>
                                    </template>
                                </div>
                                <div class="mt12 padding-left-gap all-with-action-items">
                                    <BusinessHours
                                        v-model:radio="params.radioValue"
                                        v-model:all="businessTimeList"
                                        v-model:all-switch="businessTimeRangeSwitch"
                                        v-model:work-day="workDayBusinessTimeList"
                                        v-model:work-day-switch="workDayBusinessTimeRangeSwitch"
                                        v-model:day-off="dayOffBusinessTimeList"
                                        v-model:day-off-switch="dayOffBusinessTimeRangeSwitch"
                                        v-model:week-number-groups-list="weekNumberGroupsBusinessTimeList"
                                        :week-number-single-width="207"
                                        :title="i18n.global.t('meos_control_web.project_business_mode')"
                                    />
                                </div>
                            </div>
                        </m-scrollbar>
                    </m-form>
                </div>
                <div class="right">
                    <m-anchor :key="sectionsFun?.map(v => v?.id)?.join('|')" :sections="sectionsFun" width="252px" target=".scrollbar-container"> </m-anchor>
                </div>
            </div>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" :loading="butLoading" @click.stop="sumbit">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
    <specialConfiguration
        v-model:show="specialCalendarShow"
        v-model="currentTreeNodes"
        :type="'add'"
        :data="specialConfigTreeData"
        :configured-arr="configuredArr"
        @custom-fuc="customFuc"
    />
</template>
<script lang="ts" setup>
import I18nSlot from '@/components/I18nSlot.vue';
import { EMPTYTEXT, SUCCESSCODE, WEEKDAYS } from '@/utils/globalVariables';
import DateList from './DateList.vue';
import summerDateList from './summerDateList .vue';
import BusinessHours from './BusinessHours.vue';
import specialConfiguration from './specialConfiguration.vue';
import dayjs from 'dayjs';
import { editGlobalRule, getGlobalRule, treeBuildingFloorSpace, getProjectByIdService, listClimateZoneService, querySeason, queryCalendarByInstanceId } from '@/apis/calendar';
import { onMounted } from 'vue';
import { $Message, MLoading } from 'meri-plus';
import { uniqueId } from 'lodash';
import _ from 'lodash';
import baseStore from '@/store/baseStore';
import useStore from '@/store';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import { globalConfiguredArrKey } from '../injectKeys';
import i18n from '@/localization';
import HolidaysList from './HolidaysList.vue';
import { IconMeriComponentDialogLinear } from 'meri-icon';
import { nanoid } from 'nanoid';
import { BUSINESS_CONFIG_TYPE, BUSINESS_CONFIG_DOM_CONTAINER } from '../constants';
import { initWeekNumberRange, getAfterTodayRange, transformDayToRange, convertWeekNumberRange, convertBusinessHours } from '../utils';

dayjs.extend(isLeapYear);

const businessTimeList = ref([{ rowTimeRange: { startTime: '', endTime: '' }, key: `full-year-${nanoid()}` }]);
const workDayBusinessTimeList = ref([{ rowTimeRange: { startTime: '', endTime: '' }, key: `work-day-${nanoid()}` }]);
const dayOffBusinessTimeList = ref([{ rowTimeRange: { startTime: '', endTime: '' }, key: `day-off-${nanoid()}` }]);
const businessTimeRangeSwitch = ref('checked');
const workDayBusinessTimeRangeSwitch = ref('checked');
const dayOffBusinessTimeRangeSwitch = ref('checked');
// 星期号配置
const weekNumberGroupsBusinessTimeList = ref([
    { groupId: `group-${nanoid()}`, weekNumbers: [], rangeSwitch: 'checked', rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }] }
]);

const { base } = useStore();
const Form: any = ref('Form');
const rules = {
    weekdays: { type: 'array', required: true, message: EMPTYTEXT, trigger: 'change' }
};
const currentTreeNodes: any = ref([]);
const configuredArr: any = inject(globalConfiguredArrKey);
const isConfiguredLoading = ref(false);

const InitialSelection: any = ref([]);
const calendarTag: any = ref([]);
const params = ref<any>({
    coldList: [],
    warmList: [],
    anniversaries: [],
    weekdays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    value: [],
    radioValue: 'Default',
    // airSummerPeakRangeList: [],
    obj: {
        airSummerRangeList: [],
        airWinterRangeList: [],
        airSeasonSpringRangeList: [],
        airSeasonAutumnRangeList: []
    },
    businessTimeRangeList: [],
    workdayBusinessTimeRangeList: [],
    dayOffBusinessTimeRangeList: [],
    conditioningSeason: [],
    holidaysCommon: [],
    holidaysSpecial: []
});
const sections = ref([
    {
        label: i18n.global.t('meos_control_web.calendar_label_configuration'),
        id: 'calendar_label_configuration'
    },
    { label: i18n.global.t('meos_control_web.business_hours_configuration'), id: 'business_hours_configuration' }
]);

const calendarTagIdsMap = {
    WORKDAY_DAY_OFF_CONFIG: 'work_rest_day_config',
    AC_SEASON_CONFIG: 'hvac_season_config',
    AC_OPERATING_MODE_CONFIG: 'hvac_operating_mode_config',
    STORE_ANNIVERSARY_CONFIG: 'store_anniversary_config',
    STORE_HOLIDAYS_CONFIG: 'store_holidays_config'
};
const calendarTagsOptions = [
    {
        id: calendarTagIdsMap.WORKDAY_DAY_OFF_CONFIG,
        label: i18n.global.t('meos_control_web.work_rest_day_config')
    },
    {
        id: calendarTagIdsMap.AC_SEASON_CONFIG,
        label: i18n.global.t('meos_control_web.hvac_season_config')
    },
    {
        id: calendarTagIdsMap.AC_OPERATING_MODE_CONFIG,
        label: i18n.global.t('meos_control_web.hvac_operating_mode_config')
    },
    {
        id: calendarTagIdsMap.STORE_ANNIVERSARY_CONFIG,
        label: i18n.global.t('meos_control_web.store_anniversary_config')
    },
    {
        id: calendarTagIdsMap.STORE_HOLIDAYS_CONFIG,
        label: i18n.global.t('meos_control_web.holiday_config')
    }
];
const sectionsFun = computed(() => {
    const first = sections.value[0];
    const last = sections.value[sections.value.length - 1];
    const middle: any = [];
    calendarTagsOptions.forEach(item => {
        if (calendarTag.value.includes(item.id)) {
            middle.push({
                label: item.label,
                id: item.id
            });
        }
    });
    return [first, ...middle, last];
});

const options: any = ref([
    {
        label: i18n.global.t('meos_control_web.transition_spring'),
        value: 'overspring',
        name: 'airSeasonSpringRangeList'
    },
    {
        label: i18n.global.t('meos_control_web.summer'),
        value: 'summertime',
        name: 'airSummerRangeList'
    },
    // {
    //     label: '夏季高峰',
    //     value: 'SummerPeak',
    //     name: 'airSummerPeakRangeList',
    //     disabled: true
    // },

    {
        label: i18n.global.t('meos_control_web.transition_season_autumn'),
        value: 'overseason',
        name: 'airSeasonAutumnRangeList'
    },
    {
        label: i18n.global.t('meos_control_web.winter'),
        value: 'wintertime',
        name: 'airWinterRangeList'
    }
]);
const optionsFuc = computed(() => {
    let arr = options.value;
    arr.forEach((item: any) => {
        if (item?.name === 'airSummerPeakRangeList') {
            if (params.value.value.includes('airSummerRangeList')) {
                item.disabled = false;
            } else {
                item.disabled = true;
                _.remove(params.value.value, (item: any) => item === 'airSummerPeakRangeList');
                console.log(params.value.value);
            }
        } else {
            item.disabled = false;
        }
    });
    return arr;
});

const changeCheckbox = (val: any) => {
    if (!val.includes('airSummerRangeList')) {
        params.value.obj.airSummerRangeList = [{ value: '', id: uniqueId('item') }];
    }
    if (!val.includes('airWinterRangeList')) {
        params.value.obj.airWinterRangeList = [{ value: '', id: uniqueId('item') }];
    }
    if (!val.includes('airSeasonSpringRangeList')) {
        params.value.obj.airSeasonSpringRangeList = [{ value: '', id: uniqueId('item') }];
    }
    if (!val.includes('airSeasonAutumnRangeList')) {
        params.value.obj.airSeasonAutumnRangeList = [{ value: '', id: uniqueId('item') }];
    }
};
const calendarTagList = ref([
    {
        label: i18n.global.t('meos_control_web.work_rest_day'),
        value: calendarTagIdsMap.WORKDAY_DAY_OFF_CONFIG
    },
    {
        label: i18n.global.t('meos_control_web.hvac_season_config'),
        value: calendarTagIdsMap.AC_SEASON_CONFIG
    },
    {
        label: i18n.global.t('meos_control_web.hvac_operating_mode_config'),
        value: calendarTagIdsMap.AC_OPERATING_MODE_CONFIG
    },
    {
        label: i18n.global.t('meos_control_web.store_anniversary_day'),
        value: calendarTagIdsMap.STORE_ANNIVERSARY_CONFIG
    },
    {
        label: i18n.global.t('meos_control_web.holiday'),
        value: calendarTagIdsMap.STORE_HOLIDAYS_CONFIG
    }
]);
const firstZoneCode: any = ref();
const secondZoneCode: any = ref();
const airConditioningSeason: any = ref('');
let butLoading = ref(false),
    flag = ref(false);

const isLoading = ref(false);
const isLoading1 = ref(false);
const isLoading2 = ref(false);
const isLoading3 = ref(false);
const specialCalendarShow = ref(false);
const paramsCopy = ref({});
const specialConfigTreeData = ref<any[]>([]);
const allTreeNodeIds = ref<any[]>([]);
const temporaryRestriction = ref([]);
const showModal = defineModel({ type: Boolean, default: false });

const emits = defineEmits(['close', 'afterSubmit']);
const close = () => {
    nextTick(() => {
        showModal.value = false;
    });
};
const loadingInstance: any = ref(null);
const isSomeLoading = computed(() => {
    return isLoading.value || isLoading1.value || isLoading2.value || isLoading3.value;
});
//处理接口返回慢  loading加载问题
watch(
    () => isSomeLoading.value,
    () => {
        if (isSomeLoading.value) {
            nextTick(() => {
                loadingInstance.value = MLoading.service({
                    target: '.edit-modal-item',
                    fullscreen: false,
                    duration: 30000,
                    lottieName: 'ball',
                    loadIconStyle: {
                        width: '100px',
                        height: '100px'
                    }
                });
            });
        } else {
            loadingInstance.value?.destroy();
        }
    },
    {
        immediate: true
    }
);
const handleDay = (item: any) => {
    // const year = '2024';
    const start = item.split(',')[0].replace(/-/g, '.');
    const end = item.split(',')[1].replace(/-/g, '.');
    const obj = {
        value: `${start}-${end}`,
        id: uniqueId('item')
    };
    return obj;
};

const handleTimeRange = (arr: any) => {
    if (Array.isArray(arr)) {
        const list = arr.map((item: string) => {
            const startTime = item.split(',')[0].slice(0, -3);
            const endTime = item.split(',')[1].slice(0, -3);
            const finalEndTime = endTime === '23:59' ? '24:00' : endTime;
            const uniqueKey = uniqueId('item');
            return {
                rowTimeRange: { startTime: startTime || '', endTime: finalEndTime || '' },
                key: uniqueKey
            };
        });
        if (list.length === 0) {
            return [{ rowTimeRange: { startTime: '', endTime: '' }, key: uniqueId('item') }];
        }
        return list;
    } else {
        return [{ rowTimeRange: { startTime: '', endTime: '' }, key: uniqueId('item') }];
    }
};

const customFuc = () => {
    getQueryCalendarByInstanceIdFun(allTreeNodeIds.value);
    // specialCalendarShow.value = true;
};
//打开查看特殊对象配置
const configuration = () => {
    nextTick(() => {
        specialCalendarShow.value = true;
    });
};
onMounted(() => {
    getGlobalRuleFun();
    getProjectByIdServiceFun();
    getTreeBuildingFloorSpaceFun();
});

watch(
    () => showModal.value,
    cur => {
        if (cur) {
            getGlobalRuleFun();
        }
    }
);
const allList = (dateKey: any) => {
    let arr: any = [];
    console.log(dateKey, params.value.obj);
    Object.keys(params.value.obj).forEach(key => {
        arr = arr.concat(key !== dateKey ? params.value.obj[key] : []);
    });
    return arr;
};
//查询建筑楼层空间
const getTreeBuildingFloorSpaceFun = () => {
    isLoading3.value = true;
    treeBuildingFloorSpace({ projectId: baseStore().projectId, systemId: baseStore().projectId })
        .then((res: any) => {
            const resData = res?.data || [];
            const cloneData = structuredClone(resData);
            handleTreeData(cloneData);
            const rootId = cloneData?.[0]?.id;
            if (rootId) {
                currentTreeNodes.value = [rootId];
                InitialSelection.value = [rootId];
            }
        })
        .finally(() => {
            isLoading3.value = false;
        });
};
//把建筑数据组装成tree
const handleTreeData = (tree: any[]) => {
    allTreeNodeIds.value = [];
    specialConfigTreeData.value = [];
    const handleLevelOne = (element: any) => {
        const newElement: { id: any; name: string; children: any[] } = {
            id: element.id,
            name: element.localName ?? '--',
            children: []
        };
        if (element.floors) {
            element.floors.forEach((subElement: any) => {
                newElement.children.push(handleLevelTwo(subElement));
                allTreeNodeIds.value.push(subElement.id);
            });
        }

        return newElement;
    };
    const handleLevelTwo = (subElement: any) => {
        const newSubElement: { id: any; name: string; children: any[] } = {
            id: subElement.id,
            name: subElement.localName ?? '--',
            children: []
        };
        if (subElement.spaces) {
            subElement.spaces.forEach((subSubElement: any) => {
                newSubElement.children.push(handleLevelThree(subSubElement));
                allTreeNodeIds.value.push(subSubElement.id);
            });
        }
        return newSubElement;
    };
    const handleLevelThree = (subSubElement: any) => {
        const newSubSubElement: { id: any; name: string } = {
            id: subSubElement.id,
            name: subSubElement.localName ?? '--'
        };
        return newSubSubElement;
    };
    tree.forEach((item: any) => {
        specialConfigTreeData.value.push(handleLevelOne(item));
        allTreeNodeIds.value.push(item.id);
    });
    getQueryCalendarByInstanceIdFun(allTreeNodeIds.value);
    return specialConfigTreeData.value;
};
//查询已配置项
const getQueryCalendarByInstanceIdFun = (item: any) => {
    isConfiguredLoading.value = true;
    queryCalendarByInstanceId(item)
        .then(res => {
            configuredArr.value = res.data || [];
        })
        .finally(() => {
            isConfiguredLoading.value = false;
        });
};
//左侧模板初始化查询
const getGlobalRuleFun = () => {
    params.value.conditioningSeason = [];
    params.value.value = [];
    params.value.holidaysCommon = [];
    params.value.holidaysSpecial = [];
    params.value.businessTimeRangeList = [];
    params.value.workdayBusinessTimeRangeList = [];
    params.value.dayOffBusinessTimeRangeList = [];
    weekNumberGroupsBusinessTimeList.value = [
        { groupId: `group-${nanoid()}`, weekNumbers: [], rangeSwitch: 'checked', rangeList: [{ rowTimeRange: { startTime: '', endTime: '' }, key: `week-number-${nanoid()}` }] }
    ];
    isLoading.value = true;
    getGlobalRule({ instanceId: baseStore().projectId })
        .then((res: any) => {
            if (res.code === SUCCESSCODE) {
                params.value.coldList = res.data?.coolingSeasonDateRangeList ? res.data.coolingSeasonDateRangeList.map(handleDay) : [{ value: '', id: uniqueId('item') }]; //供冷季节
                params.value.warmList = res.data?.heatingSeasonDateRangeList ? res.data.heatingSeasonDateRangeList?.map(handleDay) : [{ value: '', id: uniqueId('item') }]; // 采暖季开日期
                params.value.anniversaries = res.data?.anniversary ? res.data.anniversary?.map(handleDay) : [{ value: '', id: uniqueId('item') }];

                // 根据响应数据动态更新日历标签
                const calendarTagConfig = [
                    {
                        condition: res.data?.anniversary?.length,
                        key: calendarTagIdsMap.STORE_ANNIVERSARY_CONFIG
                    },
                    {
                        condition: Object.keys(res.data?.seasonRangeParam || {}).length !== 0,
                        key: calendarTagIdsMap.AC_SEASON_CONFIG
                    },
                    {
                        condition: res.data?.coolingSeasonDateRangeList?.length || res.data?.heatingSeasonDateRangeList?.length,
                        key: calendarTagIdsMap.AC_OPERATING_MODE_CONFIG
                    },
                    {
                        condition: res.data?.weekdays?.length,
                        key: calendarTagIdsMap.WORKDAY_DAY_OFF_CONFIG
                    },
                    {
                        condition: res?.data?.holidayGeneralConfiguration?.length || res?.data?.holidaySpecialConfiguration?.length,
                        key: calendarTagIdsMap.STORE_HOLIDAYS_CONFIG
                    }
                ];

                calendarTagConfig.forEach(config => {
                    const configKey = config.key;
                    if (config.condition) {
                        // 如果条件满足且标签不存在，则添加
                        if (!calendarTag.value.includes(configKey)) {
                            calendarTag.value.push(configKey);
                        }
                    } else {
                        // 如果条件不满足，则从数组中移除
                        calendarTag.value = calendarTag.value.filter((item: any) => item !== configKey);
                    }
                });

                params.value.weekdays = res.data?.weekdays || []; // 店庆日

                params.value.obj.airSummerRangeList = res.data?.seasonRangeParam?.airSummerRangeList
                    ? res.data.seasonRangeParam.airSummerRangeList.map(handleDay)
                    : [{ value: '', id: uniqueId('item') }];
                // params.value.airSummerPeakRangeList = res.data?.seasonRangeParam?.airSummerPeakRangeList
                //     ? res.data.seasonRangeParam.airSummerPeakRangeList.map(handleDay)
                //     : [{ value: '', id: uniqueId('item') }];
                params.value.obj.airWinterRangeList = res.data?.seasonRangeParam?.airWinterRangeList
                    ? res.data.seasonRangeParam.airWinterRangeList.map(handleDay)
                    : [{ value: '', id: uniqueId('item') }];
                params.value.obj.airSeasonSpringRangeList = res.data?.seasonRangeParam?.airSeasonSpringRangeList
                    ? res.data.seasonRangeParam.airSeasonSpringRangeList.map(handleDay)
                    : [{ value: '', id: uniqueId('item') }];
                params.value.obj.airSeasonAutumnRangeList = res.data?.seasonRangeParam?.airSeasonAutumnRangeList
                    ? res.data.seasonRangeParam.airSeasonAutumnRangeList.map(handleDay)
                    : [{ value: '', id: uniqueId('item') }];
                Object.keys(res.data?.seasonRangeParam).forEach(k => {
                    options?.value.forEach((v: any) => {
                        if (k === v.name) {
                            params.value.value.push(v.name);
                        }
                    });
                    params.value.conditioningSeason.push({
                        name: k
                    });
                });

                const businessRadio = res.data?.businessTimeRange?.dateTagType || BUSINESS_CONFIG_TYPE.Default;
                params.value.radioValue = businessRadio;

                if (businessRadio === BUSINESS_CONFIG_TYPE.Default) {
                    businessTimeList.value = handleTimeRange(res.data?.businessTimeRange?.businessTimeRangeList || []);
                    if (!res.data?.businessTimeRange?.businessTimeRangeList?.length) {
                        businessTimeRangeSwitch.value = 'uncheck';
                    } else {
                        businessTimeRangeSwitch.value = 'checked';
                    }
                }

                if (businessRadio === BUSINESS_CONFIG_TYPE.Workday) {
                    workDayBusinessTimeList.value = handleTimeRange(res.data?.businessTimeRange?.workdayBusinessTimeRangeList || []);
                    if (!res.data?.businessTimeRange?.workdayBusinessTimeRangeList?.length) {
                        workDayBusinessTimeRangeSwitch.value = 'uncheck';
                    } else {
                        workDayBusinessTimeRangeSwitch.value = 'checked';
                    }
                }

                if (businessRadio === BUSINESS_CONFIG_TYPE.Workday) {
                    dayOffBusinessTimeList.value = handleTimeRange(res.data?.businessTimeRange?.dayOffBusinessTimeRangeList || []);
                    if (!res.data?.businessTimeRange?.dayOffBusinessTimeRangeList?.length) {
                        dayOffBusinessTimeRangeSwitch.value = 'uncheck';
                    } else {
                        dayOffBusinessTimeRangeSwitch.value = 'checked';
                    }
                }

                if (businessRadio === BUSINESS_CONFIG_TYPE.Week) {
                    weekNumberGroupsBusinessTimeList.value = initWeekNumberRange(res.data?.businessTimeRange?.weekNumberParamList, true);
                }

                if (Array.isArray(res?.data?.holidayGeneralConfiguration)) {
                    if (res?.data?.holidayGeneralConfiguration?.length) {
                        params.value.holidaysCommon = res?.data?.holidayGeneralConfiguration.map((v: any) => {
                            const final = handleDay(v);
                            return final;
                        });
                    }
                }
                if (Array.isArray(res?.data?.holidaySpecialConfiguration)) {
                    if (res?.data?.holidaySpecialConfiguration?.length) {
                        const filterRes = getAfterTodayRange(res?.data?.holidaySpecialConfiguration);
                        const finalRes = transformDayToRange(filterRes);
                        params.value.holidaysSpecial = finalRes.map((v: any) => {
                            return { id: nanoid(), value: `${v[0]}-${v[1]}` };
                        });
                    }
                }

                temporaryRestriction.value = params.value.obj.airSummerRangeList;
                paramsCopy.value = structuredClone(params.value);
            }
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const handleItemSelected = (code: any) => {
    console.log(`选中了 ${code} 数组中的数据：`, params.value.obj);
    Object.keys(params.value.obj).forEach(key => {
        if (key === code) {
            // console.log(temporaryRestriction.value);
            temporaryRestriction.value = params.value.obj[key];
        }
    });
};
//查询空调季model 季节
const getProjectByIdServiceFun = () => {
    getProjectByIdService({}).then((response: any) => {
        firstZoneCode.value = response.content?.[0]?.climateZone;
        isLoading1.value = true;
        isLoading2.value = true;
        listClimateZoneService({})
            .then((result: any) => {
                result.contents?.forEach((item: any) => {
                    item.contents?.forEach((io: any) => {
                        if (io.code === firstZoneCode.value) {
                            firstZoneCode.value = item.code;
                            secondZoneCode.value = io.code;
                        }
                    });
                });
                querySeason({ groupCode: base.groupCode, firstZoneCode: firstZoneCode.value, secondZoneCode: secondZoneCode.value })
                    .then((res: any) => {
                        airConditioningSeason.value = '';
                        res.data?.seasonInfo.forEach((item: any, index: any) => {
                            item?.calendars?.forEach((io: any) => {
                                if (index < res.data?.seasonInfo.length - 1) {
                                    airConditioningSeason.value += `${item.name} (${io.from}-${io.to})，`;
                                } else {
                                    airConditioningSeason.value += `${item.name} (${io.from}-${io.to})`;
                                }
                            });
                        });
                    })
                    .finally(() => {
                        isLoading2.value = false;
                    });
            })
            .finally(() => {
                isLoading1.value = false;
            });
    });
};
const clearAwayFuc = (item: any) => {
    if (!item.includes(calendarTagIdsMap.WORKDAY_DAY_OFF_CONFIG)) {
        params.value.weekdays = [];
    }
    if (!item.includes(calendarTagIdsMap.AC_SEASON_CONFIG)) {
        params.value.obj.airSummerRangeList = [];
        // params.value.airSummerPeakRangeList = [];
        params.value.obj.airWinterRangeList = [];
        params.value.obj.airSeasonSpringRangeList = [];
        params.value.obj.airSeasonAutumnRangeList = [];
    }
    if (!item.includes(calendarTagIdsMap.AC_OPERATING_MODE_CONFIG)) {
        params.value.coldList = [];
        params.value.warmList = [];
    }
    if (!item.includes(calendarTagIdsMap.STORE_ANNIVERSARY_CONFIG)) {
        params.value.anniversaries = [];
    }
    if (!item.includes(calendarTagIdsMap.STORE_HOLIDAYS_CONFIG)) {
        params.value.holidaysCommon = [];
        params.value.holidaysSpecial = [];
    }
};

const scrollToErrorScope = (scope: string) => {
    if (scope) {
        const ele = document.getElementById(`${scope}`);
        if (ele) {
            ele?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
};

//保存提交
const sumbit = () => {
    butLoading.value = true;
    clearAwayFuc(calendarTag.value);
    for (const key in params.value.obj) {
        if (!params.value.value.includes(key)) {
            params.value.obj[key] = [{ value: '', id: uniqueId('item') }];
        }
    }
    // if (!params.value.value.includes('airSummerPeakRangeList')) {
    //     params.value.airSummerPeakRangeList = [{ value: '', id: uniqueId('item') }];
    // }
    Form.value.validate((valid: boolean, fields: any) => {
        if (valid) {
            // 如果工作日、休息日的营业时段均选择不营业，那么确定时提示用户“当前配置无效，工作日、休息日的营业时段不可同时为不营业
            if (params.value.radioValue === BUSINESS_CONFIG_TYPE.Workday) {
                if (workDayBusinessTimeRangeSwitch.value === 'uncheck' && dayOffBusinessTimeRangeSwitch.value === 'uncheck') {
                    $Message.error({ title: i18n.global.t('meos_control_web.workday_restday_both_closed_invalid') });
                    butLoading.value = false;
                    scrollToErrorScope(BUSINESS_CONFIG_DOM_CONTAINER);
                    return;
                }
            }
            // 若每组星期号中的营业时间段都选择为不营业，点击弹窗【确定】时，会自动定位至营业时间配置处，且页面顶部massage报错提示“当前营业时间配置无效，所有分组的营业时段不可同时为不营业”
            if (params.value.radioValue === BUSINESS_CONFIG_TYPE.Week) {
                if (weekNumberGroupsBusinessTimeList.value.length) {
                    const isAllNotOpen = weekNumberGroupsBusinessTimeList.value.every((item: any) => item.rangeSwitch === 'uncheck');
                    if (isAllNotOpen) {
                        $Message.error({ title: i18n.global.t('meos_control_web.business_hours_config_invalid_all_closed') });
                        butLoading.value = false;
                        scrollToErrorScope(BUSINESS_CONFIG_DOM_CONTAINER);
                        return;
                    }
                }
            }
            const year = '2024.'; //闰年非闰年问题 所以加上年份
            const coolingSeasonDateRangeList: any = [];
            const heatingSeasonDateRangeList: any = [];
            const anniversaries: any = [];
            const airSummerRangeList: any = [];
            const airWinterRangeList: any = [];
            const airSeasonSpringRangeList: any = [];
            const airSeasonAutumnRangeList: any = [];

            params.value.coldList.forEach((item: any) => {
                if (item.value) {
                    const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
                    const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
                    coolingSeasonDateRangeList.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
                }
            });
            params.value.warmList.forEach((item: any) => {
                if (item.value) {
                    const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
                    const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
                    heatingSeasonDateRangeList.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
                }
            });
            params.value.anniversaries.forEach((item: any) => {
                if (item.value) {
                    const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
                    const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
                    anniversaries.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
                }
            });
            params.value.obj.airSummerRangeList.forEach((item: any) => {
                if (item.value) {
                    const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
                    const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
                    airSummerRangeList.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
                }
            });
            // params.value.airSummerPeakRangeList.forEach((item: any) => {
            //     if (item.value) {
            //         const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
            //         const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
            //         airSummerPeakRangeList.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
            //     }
            // });
            params.value.obj.airWinterRangeList.forEach((item: any) => {
                if (item.value) {
                    const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
                    const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
                    airWinterRangeList.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
                }
            });
            params.value.obj.airSeasonSpringRangeList.forEach((item: any) => {
                if (item.value) {
                    const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
                    const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
                    airSeasonSpringRangeList.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
                }
            });
            params.value.obj.airSeasonAutumnRangeList.forEach((item: any) => {
                if (item.value) {
                    const start = item.value.split('-')[0].includes('2024') ? item.value.split('-')[0] : year + item.value.split('-')[0];
                    const end = item.value.split('-')[1].includes('2024') ? item.value.split('-')[1] : year + item.value.split('-')[1];
                    airSeasonAutumnRangeList.push(`${dayjs(start).format('MM-DD')},${dayjs(end).format('MM-DD')}`);
                }
            });

            const isSelectedDefault = params.value.radioValue === BUSINESS_CONFIG_TYPE.Default;
            const isSelectedWeekDay = params.value.radioValue === BUSINESS_CONFIG_TYPE.Workday;
            const isSelectedWeek = params.value.radioValue === BUSINESS_CONFIG_TYPE.Week;
            const isUncheckBusinessTime = businessTimeRangeSwitch.value === 'uncheck';
            const isUncheckWorkday = workDayBusinessTimeRangeSwitch.value === 'uncheck';
            const isUncheckDayOff = dayOffBusinessTimeRangeSwitch.value === 'uncheck';

            const businessTimeRangeList = isSelectedDefault ? (isUncheckBusinessTime ? [] : convertBusinessHours(businessTimeList.value)) : [];
            const workdayBusinessTimeRangeList = isSelectedWeekDay ? (isUncheckWorkday ? [] : convertBusinessHours(workDayBusinessTimeList.value)) : [];
            const dayOffBusinessTimeRangeList = isSelectedWeekDay ? (isUncheckDayOff ? [] : convertBusinessHours(dayOffBusinessTimeList.value)) : [];
            const weekNumberParamList = isSelectedWeek ? convertWeekNumberRange(weekNumberGroupsBusinessTimeList.value, true) : [];

            const validHolidayCommon = params.value.holidaysCommon?.map((h: any) => h?.value?.replace('-', ',').replaceAll('.', '-')).filter((v: any) => !!v);
            const validHolidaySpecial = params.value.holidaysSpecial?.map((h: any) => h?.value?.replace('-', ',').replaceAll('.', '-')).filter((v: any) => !!v);
            const hasHoliday = validHolidayCommon?.length || validHolidaySpecial?.length;
            const holidayParams = { holidayGeneralConfiguration: validHolidayCommon, holidaySpecialConfiguration: validHolidaySpecial };

            editGlobalRule({
                coolingSeasonDateRangeList: coolingSeasonDateRangeList,
                heatingSeasonDateRangeList: heatingSeasonDateRangeList,
                anniversaries: anniversaries,
                weekdays: params.value.weekdays,
                seasonRangeParam: {
                    airSummerRangeList: airSummerRangeList,
                    // airSummerPeakRangeList: airSummerPeakRangeList,
                    airWinterRangeList: airWinterRangeList,
                    airSeasonSpringRangeList: airSeasonSpringRangeList,
                    airSeasonAutumnRangeList: airSeasonAutumnRangeList
                },
                businessTimeRange: {
                    instanceId: baseStore().projectId,
                    dateTagType: params.value.radioValue,
                    businessTimeRangeList: businessTimeRangeList,
                    workdayBusinessTimeRangeList,
                    dayOffBusinessTimeRangeList,
                    weekNumberParamList
                },
                ...(hasHoliday ? holidayParams : {})
            }).then((res: any) => {
                if (res.code === SUCCESSCODE) {
                    $Message.success({ title: i18n.global.t('common.save_success') });
                    close();
                    nextTick(() => {
                        emits('afterSubmit');
                    });

                    flag.value = false;
                }
                butLoading.value = false;
            });
        } else {
            $Message.error({ title: i18n.global.t('meos_control_web.error_items_exist_please_check') });
            butLoading.value = false;
        }
    });
};

provide('params', params);
provide('Form', Form);
provide('temporaryRestriction', temporaryRestriction);
</script>
<style lang="less">
.edit-disposition-modal {
    .m-modal-main-content {
        padding: 20px 24px !important;
        .left {
            padding: 12px 0 !important;
        }
        .right {
            padding: 12px 0 12px 0px !important;
        }
    }
}
</style>
<style lang="less" scoped>
.edit-modal-item {
    height: 100%;
    .left-modal-item {
        flex: 1;
        .left-scrollbar {
            :deep(.m-scrollbar__content) {
                // height: 100%;
                padding-right: 24px;
            }
        }
        height: 100%;
        .config-edit-box {
            height: 100%;
            // overflow: auto;
        }
        .form-item {
            min-width: 500px;
        }
        .working-day-item {
            :deep(.m-form-item) {
                .m-checkbox + .m-checkbox {
                    margin-left: 2px;
                }
                &.is-error {
                    .m-checkbox-label {
                        border: 1px solid var(--red-500);
                    }
                }
                .checkbox {
                    display: none;
                }
                .m-checkbox-label {
                    display: flex;
                    width: 32px;
                    height: 32px;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    &:hover {
                        background-color: var(--gray-200);
                    }
                }
                .bg-blue + .m-checkbox-label {
                    color: var(--blue-500);
                    background-color: var(--blue-100);
                }
            }
        }

        .class-box + .class-box {
            padding-top: 8px;
            border-top: 1px dashed #c4c9cf;
        }
        .get-line {
            height: 1px;
            width: 100%;
            border-top: 1px dashed #c4c9cf;
        }
    }
    .title-item {
        padding-left: 12px;
        position: relative;
        color: var(--gray-800, #2e3742);
        height: 22px;
        line-height: 22px;
        display: flex;
        align-items: center;
        gap: 8px;

        &::after {
            position: absolute;
            top: 4px;
            left: 0;
            width: 3px;
            height: 14px;
            background: var(--blue-500);
            content: '';
        }
    }
    .list {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        .m-checkbox {
            margin-right: 16px;
            margin-bottom: 4px;
        }
    }

    .air-conditioning-season {
        width: 500px;
        padding: 8px 12px;
        background: var(--gray-50, #f7f9fa);
        .give-example {
            background: var(--gray-50, #f7f9fa);
        }
        .m-checkbox {
            margin-right: 16px;
            margin-bottom: 4px;
        }
    }
    .look-item {
        border-radius: 4px;
        background: var(--gray-200, #e8ecf0);
        padding: 4px 8px;
    }
}
.all-with-action-items {
    min-width: 514px;
}
.padding-left-gap {
    padding-left: 14px;
    padding-bottom: 8px;
}
.transform-left-gap {
    transform: translateX(14px);
}

.title-hover-icon {
    background-color: transparent;
    border-radius: 2px;
    &:hover {
        background: rgba(196, 201, 207, 0.3);
    }
}
</style>
