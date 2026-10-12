<!-- eslint-disable vue/no-template-shadow -->
<!-- eslint-disable vue/v-on-event-hyphenation -->
<!--  -->
<template>
    <div class="demand-calendar-right">
        <div v-if="monthlist.length" :class="[state.checkboxValue?.length ? 'mb30' : 'mb10', 'demand-calendar-right-header', 'fcb']">
            <div class="f">
                <div class="fcb">
                    <div class="time fb7 mr12" style="min-width: 50px">{{ i18n.global.t('common.year_format', { year: state.date }) }}</div>
                    <div class="cp fc">
                        <m-popover
                            :disabled="!state.leftDisabled"
                            :content="i18n.global.t('meos_control_web.only_last_this_next_year')"
                            theme="darkTransparent"
                            :show-arrow="false"
                        >
                            <m-button type="icon" icon="IconMeriComponentChevronLeft" :disabled="state.leftDisabled" size="medium" @click="prevYear"></m-button>
                        </m-popover>
                    </div>
                    <div class="cp fc">
                        <m-popover
                            :disabled="!state.rightDisabled"
                            :content="i18n.global.t('meos_control_web.only_last_this_next_year')"
                            theme="darkTransparent"
                            :show-arrow="false"
                        >
                            <m-button type="icon" icon="IconMeriComponentChevronRight" size="medium" :disabled="state.rightDisabled" @click="nextYear"></m-button>
                        </m-popover>
                    </div>
                </div>
            </div>
            <div class="fc legend-container">
                <div class="fc legend-container">
                    <div v-show="state.legendList[4] == 'is-AirSummer'" class="fc fit-ml legend-item">
                        <div class="color-item" style="background: #fff0cc"></div>
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.summer') }}</div>
                    </div>
                    <div v-show="state.legendList[5] == 'is-AirWinter'" class="fc fit-ml legend-item">
                        <div class="color-item" style="background: #d3eafd"></div>
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.winter') }}</div>
                    </div>
                    <div v-show="state.legendList[6] == 'is-AirSummerPeak'" class="fc fit-ml legend-item">
                        <div class="color-item" style="background: #fddfdd"></div>
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.summer_peak') }}</div>
                    </div>
                    <div v-show="state.legendList[7] == 'is-AirSeasonSpring'" class="fc fit-ml legend-item">
                        <div class="color-item" style="background: #d0ebd7"></div>
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.transition_spring') }}</div>
                    </div>
                    <div v-show="state.legendList[8] == 'is-AirSeasonAutumn'" class="fc fit-ml legend-item">
                        <div class="color-item" style="background: #ebdff1"></div>
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.transition_season_autumn') }}</div>
                    </div>
                    <div v-show="state.legendList[3] == 'is-shop'" class="fc fit-ml legend-item">
                        <div class="triangle"></div>
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.holiday') }}</div>
                    </div>
                    <div v-show="state.legendList[2] == 'is-holiday'" class="fc fit-ml legend-item">
                        <SvgIcon name="shop" width="12px" height="12px" />
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.store_anniversary_day') }}</div>
                    </div>
                    <div v-show="state.legendList[1] == 'is-hot'" class="fc fit-ml legend-item">
                        <SvgIcon name="heating" width="12px" height="12px" />
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.heat_season') }}</div>
                    </div>
                    <div v-show="state.legendList[0] == 'is-cool'" class="fc fit-ml legend-item">
                        <SvgIcon name="cooling" width="12px" height="12px" />
                        <div v-ellipsis class="ml8 ft f12 legend-text">{{ i18n.global.t('meos_control_web.cooling_season') }}</div>
                    </div>
                </div>
                <!-- <div class="getLine mr8"></div> -->
                <template v-if="state.date >= getDayjsTz().year()">
                    <m-button type="default" size="small" class="mr8" @click="defaultBtn">{{ i18n.global.t('meos_control_web.restore_default') }}</m-button>
                    <m-dropdown
                        v-model="state.selectType"
                        :options="state.list"
                        :text="i18n.global.t('meos_control_web.select_all_workdays')"
                        type="button"
                        trigger="click"
                        placement="bottom-end"
                        @optionClick="optionClick"
                        @btnClick="btnClick"
                    >
                    </m-dropdown>
                </template>
            </div>
        </div>
        <div v-if="state.checkboxValue?.length" class="checkeds fcb">
            <div class="fc">
                <div>
                    {{ i18n.global.t('meos_control_web.already_selected') }} <span class="fb7">{{ state.checkboxValue.length }}</span>
                    {{ i18n.global.t('meos_control_web.project') }}
                </div>
                <div class="ml16 mr12">
                    <m-select
                        v-model="state.selectType"
                        :options="state.templateList"
                        size="small"
                        :placeholder="i18n.global.t('meos_control_web.batch_apply_template')"
                        placeholder-color="#000"
                        popover-class="selectPopover"
                        @change="selectChangeTop"
                    >
                        <m-option v-for="(item, index) in state.templateList" :key="item.id" :value="item.id" :label="item.name">
                            <div v-if="item.isEnabled" class="fcb" @mouseover="showSelect(index)" @mouseout="hideSelect()">
                                <m-popover theme="darkTransparent" :show-arrow="false" :content="item.name">
                                    <span class="left-name">{{ item.name }}</span>
                                </m-popover>
                                <m-popover theme="darkTransparent" :show-arrow="false" :content="i18n.global.t('meos_control_web.view_current_template_detail_in_new_tab')">
                                    <div v-show="state.selectShow == index" class="share fcc" @click="(e: any) => openDetails(e, item)">
                                        <SvgIcon name="noActiveShare" :size="30" />
                                    </div>
                                </m-popover>
                            </div>
                        </m-option>
                        <template #empty>
                            <div class="m-select-menu-empty">{{ i18n.global.t('meos_control_web.no_template_enabled_alt') }}</div>
                        </template>
                    </m-select>
                </div>
                <m-button type="default" size="small" :disabled="state.disabled" @click="clearTemplate">{{ i18n.global.t('meos_control_web.clear_template') }}</m-button>
            </div>
            <div class="cp" @click="ClickReset">{{ i18n.global.t('meos_control_web.deselect') }}</div>
        </div>
        <div class="calendar">
            <div
                v-for="(month, index) in monthlist"
                :key="index"
                class="calendar-month"
                @mouseover="(e: any) => monthMouseover(e, month)"
                @mouseleave="(e: any) => monthMouseleaver(e, month)"
            >
                <div class="text-14 fcb">
                    <div class="fb7 mouth-class">{{ state.mouth[index] }}</div>
                    <!-- <div>123</div> -->
                    <m-checkbox v-if="month.checkboxShow" v-model="month.checkboxMonth" @click="checkboxChangeMonth(month)"></m-checkbox>
                </div>
                <div class="f dayWeek">
                    <div :class="[month.monday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day1') }}</div>
                    <div :class="[month.tuesday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day2') }}</div>
                    <div :class="[month.wednesday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day3') }}</div>
                    <div :class="[month.thursday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day4') }}</div>
                    <div :class="[month.friday ? 'is-weekend' : 'text-tip']">{{ i18n.global.t('common.weekday.short_day5') }}</div>
                    <div :class="[month.workday ? 'text-tip' : 'is-weekend']">{{ i18n.global.t('common.weekday.short_day6') }}</div>
                    <div :class="[month.dayoff ? 'text-tip' : 'is-weekend']">{{ i18n.global.t('common.weekday.short_day7') }}</div>
                </div>
                <ul class="flex-wrap text-sub" style="margin: 0">
                    <li
                        v-for="(item, indexs) in month.days"
                        :key="indexs"
                        :class="[dayClasses(item, month), 'oneDay', item.className]"
                        :data-id="item.date"
                        @click="(e: any) => ClickItem(e, item, month)"
                        @mousedown="(e: any) => Mousedown(e, item)"
                        @mouseover="(e: any) => Mouseover(e, item, month)"
                        @mouseup="(e: any) => Mouseup(e, month)"
                    >
                        <m-popover
                            id="popoverItem"
                            :width="state.popoverWidth"
                            :arrow-overflow="true"
                            :enterable="true"
                            popover-class="popoverItem"
                            :mouse-enter-delay="500"
                            :mouse-leave-delay="100"
                            :offset="0"
                            :disabled="state.tipsDisabled"
                            @mouseEnter="mouseShow(item, true)"
                            @mouseLeave="mouseShow(item, false)"
                        >
                            <template #content>
                                <div v-show="!item.showDialog">
                                    <div class="fb7 f16 topBorder">{{ dayjs(item.date).format(i18n.global.t('meos_control_web.date_format2')) }}</div>
                                    <div style="padding: 16px 12px">
                                        <div class="mb8 ft">{{ i18n.global.t('meos_control_web.date_property_colon') }}</div>
                                        <div class="fc">
                                            <div v-if="item.className.includes('is-workday') || item.className.includes('is-dayoff')" class="fc mr8 ft f12">
                                                {{
                                                    item.className.includes('is-workday')
                                                        ? i18n.global.t('meos_control_web.weekday')
                                                        : item.className.includes('is-dayoff')
                                                        ? i18n.global.t('meos_control_web.rest_day')
                                                        : ''
                                                }}
                                            </div>
                                            <div v-if="item.className.includes('is-cool')" class="fc mr8">
                                                <SvgIcon name="cooling" width="12px" height="12px" />
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.cooling_supply1') }}</div>
                                            </div>
                                            <div v-if="item.className.includes('is-hot')" class="fc mr8">
                                                <SvgIcon name="heating" width="12px" height="12px" />
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.heating_supply') }}</div>
                                            </div>
                                            <div v-if="item.className.includes('is-holiday') && isTemplateListShow('HOLIDAY')" class="fc mr8">
                                                <div class="triangle"></div>
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.holiday') }}</div>
                                            </div>
                                            <div v-if="item.className.includes('is-shop') && isTemplateListShow('HOLIDAY')" class="fc mr8">
                                                <SvgIcon name="shop" width="12px" height="12px" />
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.store_anniversary_day') }}</div>
                                            </div>
                                            <div v-if="item.className.includes('is-AirSummer')" class="fc mr8">
                                                <div class="color-item" style="background: #fff0cc"></div>
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.summer') }}</div>
                                            </div>
                                            <div v-if="item.className.includes('is-AirWinter')" class="fc mr8">
                                                <div class="color-item" style="background: #d3eafd"></div>
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.winter') }}</div>
                                            </div>
                                            <!-- <div v-if="item.className.includes('is-AirSummerPeak')" class="fc mr8">
                                                <div class="color-item" style="background: #fddfdd"></div>
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.summer_peak') }}</div>
                                            </div> -->
                                            <div v-if="item.className.includes('is-AirSeasonSpring')" class="fc mr8">
                                                <div class="color-item" style="background: #d0ebd7"></div>
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.transition_spring') }}</div>
                                            </div>
                                            <div v-if="item.className.includes('is-AirSeasonAutumn')" class="fc mr8">
                                                <div class="color-item" style="background: #ebdff1"></div>
                                                <div class="ml8 ft f12">{{ i18n.global.t('meos_control_web.transition_season_autumn') }}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div :style="{ padding: item.date >= state.today && item.type == 'current' ? '0px 12px 0px' : '0px 12px 12px' }">
                                        <div class="ft">{{ i18n.global.t('meos_control_web.current_template_colon') }}</div>
                                        <div v-if="item.boderColor && state.templateIndex" class="fc mt8">
                                            <div class="fc">
                                                <div class="bgcolor mr8" :style="{ backgroundColor: `${item.boderColor}` }"></div>
                                                <div class="ft f14">
                                                    {{
                                                        item.boderColor
                                                            ? state.templateIndex
                                                                ? `${state.templateIndex}${i18n.global.t('meos_control_web.template')}`
                                                                : i18n.global.t('meos_control_web.un_selected')
                                                            : i18n.global.t('meos_control_web.un_selected')
                                                    }}
                                                </div>
                                            </div>
                                            <!--   v-if="
                                                    item.relTemplate.demandType == 'AIRCONDITIONING' ||
                                                    (item.relTemplate.demandType != 'AIRCONDITIONING' && item.date > state.today)
                                                " -->
                                            <m-popover theme="darkTransparent" :show-arrow="false" :content="i18n.global.t('meos_control_web.view_template_detail_in_new_tab')">
                                                <div class="fc popover-details ml5" @click="detailsBtn(item)">
                                                    <span class="mr5">{{ i18n.global.t('meos_control_web.details') }}</span>
                                                    <div class="mt5">
                                                        <SvgIcon name="Share" />
                                                    </div>
                                                </div>
                                            </m-popover>
                                        </div>
                                        <div v-else class="ft f14 mt8 fc" style="height: 35px">{{ i18n.global.t('meos_control_web.un_selected') }}</div>
                                    </div>
                                    <div v-if="item.date >= state.today && item.type == 'current'" class="fend mt15" style="padding: 0 12px 12px">
                                        <m-button v-if="item.boderColor" type="default" size="medium" class="mr12" @click="singleClear(item)">{{
                                            i18n.global.t('meos_control_web.clear_template')
                                        }}</m-button>
                                        <m-button type="primary" size="medium" @click="selectOther(item)">{{ i18n.global.t('meos_control_web.select_other_template') }}</m-button>
                                    </div>
                                </div>
                                <div v-show="item.showDialog">
                                    <div class="fc topBorder">
                                        <m-button type="text" size="small" @click="item.showDialog = false">
                                            {{ i18n.global.t('meos_control_web.back') }}
                                            <template #icon>
                                                <IconMeriComponentChevronLeft :size="16" :color="'#1B2129'" :hover-color="'#1B2129'"></IconMeriComponentChevronLeft>
                                            </template>
                                        </m-button>
                                        <div class="getLine1 mr8 ml8"></div>
                                        <div class="fb7">{{ i18n.global.t('meos_control_web.select_apply_template') }}</div>
                                    </div>
                                    <div class="selectItem">
                                        <div v-if="state.templateList?.length">
                                            <div v-for="(io, iv) in state.templateList" :key="iv">
                                                <div
                                                    v-if="io.isEnabled"
                                                    class="content template-item fcb"
                                                    @click="selectChange(io, iv, item)"
                                                    @mouseover="show(iv)"
                                                    @mouseout="hide()"
                                                >
                                                    <div class="fc">
                                                        <div class="bgcolor" :style="{ backgroundColor: io.color }"></div>
                                                        <div class="ml8 f14 mr8">{{ io.name }}</div>
                                                    </div>
                                                    <m-popover
                                                        theme="darkTransparent"
                                                        :show-arrow="false"
                                                        :content="i18n.global.t('meos_control_web.view_template_detail_in_new_tab')"
                                                    >
                                                        <div :style="{ display: state.showIndex == iv ? 'block' : 'none' }" class="mt5" @click="(e: any) => openDetails(e, io)">
                                                            <SvgIcon name="noActiveShare" />
                                                        </div>
                                                    </m-popover>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else style="color: #626c78; width: 100%; height: 100%" class="fcc">{{ i18n.global.t('meos_control_web.no_template_enabled') }}</div>
                                    </div>
                                </div>
                            </template>
                            <div style="width: 100%; height: 100%; position: relative">
                                <div class="wd fcc" :class="[item.selected ? 'Selectbgc' : '', item.mouseoverBgc ? 'mouseoverBgc' : '']">
                                    <div :class="[dayClasses(item, month).includes('is-day') && item.type == 'current' ? 'day' : '']">
                                        <div v-if="item.className.includes('is-shop') && item.type == 'current' && isTemplateListShow('ANNIVERSARY')" class="day-icon">
                                            <SvgIcon name="Cake" width="21px" height="21px" />
                                        </div>
                                        <div v-if="item.className.includes('is-hot') && item.type == 'current'" class="day-icon1">
                                            <SvgIcon name="heating" width="8px" height="8px" />
                                        </div>
                                        <div v-if="item.className.includes('is-cool') && item.type == 'current'" class="day-icon1">
                                            <SvgIcon name="cooling" width="8px" height="8px" />
                                        </div>
                                        <div
                                            v-if="
                                                (item.selected || state.day == item) &&
                                                item.type == 'current' &&
                                                !dayClasses(item, month).includes('is-formerlyWeekd') &&
                                                !dayClasses(item, month).includes('is-formerly')
                                            "
                                            :class="['tick-icon']"
                                        >
                                            <!-- <SvgIcon name="tick" width="10px" height="10px" /> -->
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                                <g>
                                                    <path
                                                        id="Rectangle 26"
                                                        d="M4.25902 5.62281L6.06737 7.43116L10.4646 3.03394L10.8182 2.68038L11.1717 3.03394L12.2324 4.0946L12.5859 4.44815L12.2324 4.8017L6.42093 10.6131L6.06737 10.9667L5.71382 10.6131L2.49126 7.39058L2.1377 7.03703L2.49126 6.68347L3.55192 5.62281L3.90547 5.26926L4.25902 5.62281Z"
                                                        :fill="item.selected ? '#036FEB' : '#64A6F7'"
                                                        stroke="white"
                                                    />
                                                </g>
                                            </svg>
                                        </div>
                                        <div v-if="item.className.includes('is-holiday') && item.type == 'current' && isTemplateListShow('HOLIDAY')" class="triangle por"></div>
                                        <p class="day-class">{{ item.day }}</p>
                                    </div>
                                </div>
                                <div
                                    class="borderClass"
                                    :style="{
                                        width: '100%',
                                        height: '2px',
                                        'border-bottom': item.boderColor != '' && item.type == 'current' ? `2px solid ${item.boderColor}` : ''
                                    }"
                                ></div>
                            </div>
                        </m-popover>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 恢复默认 -->
        <m-modal
            v-model:visible="state.showdialog"
            :append-to="$modalAppendTo"
            type="info"
            :title="i18n.global.t('meos_control_web.confirm_restore_default')"
            :content="i18n.global.t('meos_control_web.future_dates_will_revert_to_default_template')"
        >
            <template #footer>
                <m-button type="default" @click.stop="state.showdialog = false">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" :loading="clearLoading" @click.stop="sureBtn">{{ i18n.global.t('common.confirm') }}</m-button>
            </template>
        </m-modal>

        <!-- 自定义 -->
        <m-modal
            v-model:visible="state.showCustom"
            :append-to="$modalAppendTo"
            type="default"
            :title="i18n.global.t('meos_control_web.select_all')"
            :width="600"
            :height="125"
            @close="Cancel"
        >
            <template #content>
                <m-checkbox-group v-model="state.value" @change="checkboxChange">
                    <div class="list">
                        <m-checkbox v-for="(item, index) in state.options" :key="index" :label="item.value">
                            <div>{{ item.label }}</div>
                        </m-checkbox>
                    </div>
                </m-checkbox-group>
            </template>
            <template #footer>
                <m-button type="default" @click.stop="Cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" :disabled="state.value.length <= 0" @click="checkFormbtn">{{ i18n.global.t('meos_control_web.apply') }}</m-button>
            </template>
        </m-modal>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable eqeqeq */
import { onMounted } from 'vue';
import dayjs from 'dayjs';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { IconMeriComponentChevronLeft, IconMeriComponentDialogLinear } from 'meri-icon';
import { MMessageBox, MLoading, $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import { useRouter } from 'vue-router';
import { listDateSetting, applyTemplateByDate, clearCalendar, listInstantiationDateTag } from '@/apis/calendar';
import i18n from '@/localization';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { getDayjsTz } from '@/utils/globalVariables';

const router = useRouter();
const { cancelQuest, cancelToken } = UseCancelTokenHooks();
interface Month {
    date: string;
    checkboxShow: boolean;
    days: Day[];
    week: number;
    checkboxMonth: string;
    workday: boolean;
    dayoff: boolean;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
}
interface Day {
    date: string;
    day: any;
    type: string;
    hover: boolean;
    selected: boolean;
    mouseoverBgc: boolean;
    boderColor: any;
    relTemplate: any;
    className: string[];
    showDialog: false;
}
const state = reactive<any>({
    templateType: '',
    date: '',
    twoYearsAgo: '',
    months: null,
    color: '#9FC9FB',
    today: getDayjsTz().format('YYYY-MM-DD'),
    todays: getDayjsTz(),
    type: '',
    selectType: '',
    templateIndex: '',
    showdialog: false,
    hoverClick: true,
    showCustom: false,
    disabled: false,
    leftDisabled: false,
    rightDisabled: false,
    popoverShow: false,
    value: [],
    modelValue: 'uncheck',
    checkboxValue: [],
    flag: false,
    firstTime: 0,
    hideShow: -1,
    showIndex: -1,
    selectShow: -1,
    checkboxIndex: -1,
    day: {},
    lastTime: 0,
    popoverWidth: '370px',
    orderTime: false,
    saturday: false,
    sunday: false,
    tipsDisabled: false,
    colorList: ['#9FC9FB', '#FFB800', '#E63C35', '#33D4D2', '#B286F5', '#FFD873', '#7188A6', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FA9B96', '#F8766F'],
    color1: ['#B286F5', '#FFD873', '#7188A6', '#E9A8E6', '#E6D1FF', '#D3B2FF', '#FCEF7E', '#FA9B96', '#F8766F'],
    mouth: [
        i18n.global.t('common.month.month1'),
        i18n.global.t('common.month.month2'),
        i18n.global.t('common.month.month3'),
        i18n.global.t('common.month.month4'),
        i18n.global.t('common.month.month5'),
        i18n.global.t('common.month.month6'),
        i18n.global.t('common.month.month7'),
        i18n.global.t('common.month.month8'),
        i18n.global.t('common.month.month9'),
        i18n.global.t('common.month.month10'),
        i18n.global.t('common.month.month11'),
        i18n.global.t('common.month.month12')
    ],
    list: [
        {
            key: '0',
            label: i18n.global.t('meos_control_web.select_all_rest_days')
        },
        {
            key: '1',
            label: i18n.global.t('meos_control_web.custom_batch_select')
        }
    ],
    options: [
        {
            label: i18n.global.t('common.weekday.day1'),
            value: 1
        },
        {
            label: i18n.global.t('common.weekday.day2'),
            value: 2
        },
        {
            label: i18n.global.t('common.weekday.day3'),
            value: 3
        },
        {
            label: i18n.global.t('common.weekday.day4'),
            value: 4
        },
        {
            label: i18n.global.t('common.weekday.day5'),
            value: 5
        },
        {
            label: i18n.global.t('common.weekday.day6'),
            value: 6
        },
        {
            label: i18n.global.t('common.weekday.day7'),
            value: 7
        }
    ],
    templateList: [],
    dateList: [],
    legendList: [],
    dateTagList: []
});
const timer = ref<any>(null);
const monthlist = ref<Month[]>([]);
const clearLoading = ref(false);
const Mloading = ref();
const initLoading = ref(true);
const dayClasses = (data: any, month: any) => {
    const classes: string[] = [];
    if (state.today == data.date) {
        classes.push('is-day'); //今日class
    }
    if (!isweekd(data.date)) {
        // classes.push('is-weekend') //周末class
    }
    if (isweekd(data.date)) {
        // classes.push('is-workingDay') //工作日
    }
    if ((data.date < state.today && isweekd(data.date)) || data.type == 'pre' || data.type == 'next') {
        classes.push('is-formerly'); //小于今天的工作日class
    }
    if (isweekd(data.date) == false && data.date < state.today && !month.workday && !month.dayoff) {
        classes.push('is-formerlyWeekd'); //小于今天的周末class
    }
    if (data.date < state.today && data.className.includes('is-workday')) {
        classes.push('is-formerly');
    }
    if (data.date < state.today && !data.className.includes('is-workday') && isweekd(data.date) == false) {
        classes.push('is-formerlyWeekd');
    }
    return classes;
};
//判断是否是周末
const isweekd = (day: any) => {
    // 获取今天的星期几（0-6，其中0表示星期天）
    let dayOfWeek = dayjs(day).day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return false; //周末
    } else {
        return true; //工作日
    }
};
//接收左侧菜单参数
emitter.on('sendData', (data: any) => {
    console.log(data, 'data');
});
emitter.on('getTemplateList', (data: any) => {
    state.checkboxValue = [];
    state.templateList = [];
    let obj = {},
        a = 0;
    state.templateType = data.templateType;
    const result = data.arr.filter((item: any) => item.isEnabled === true);
    result.map((item: any) => {
        obj = {
            templateId: item.templateId,
            templateType: item.templateType,
            templateTag: item.templateTag,
            demandType: item.demandType,
            name: item.templateName,
            color: item.color,
            isEnabled: item.isEnabled,
            id: `${a++}`
        };
        state.templateList.push(obj);
    });
    getListInstantiationDateTag(data.templateType);
});
const isTemplateListShow = (type: String) => {
    let result = state.templateList.find((item: any) => item.isEnabled === true && item.templateTag === type);
    if (result) {
        return true;
    } else {
        return false;
    }
};
onUnmounted(() => {
    emitter.off('getTemplateList');
});
onMounted(() => {
    let date = new Date().getFullYear();
    state.date = date;
    state.twoYearsAgo = state.date - 1;
});

watch(
    () => initLoading.value,
    () => {
        if (initLoading.value) {
            Mloading.value = MLoading.service({
                target: '.demand-calendar-right',
                fullscreen: false,
                duration: 30000,
                lottieName: 'ball',
                loadIconStyle: {
                    width: '100px',
                    height: '100px'
                }
            });
        } else {
            console.log(123);
            Mloading.value?.destroy?.();
        }
    },
    { immediate: true }
);
//顶部批量选择详情
const openDetails = (e: Event, item: any) => {
    e.stopPropagation();
    let name = '',
        typeParams = '';
    // eslint-disable-next-line default-case
    switch (item.demandType || item.relTemplate.demandType) {
        case 'AIRCONDITIONING':
            // name = 'requirementConfigurationManagement';
            (name = 'demandManagementHome'), (typeParams = 'ac');
            break;
        case 'LIGHTING':
            name = 'lightingDemandManagement';
            break;
        case 'VENTILATION':
            // name = 'ventilationDemand';
            name = 'demandManagementHome';
            typeParams = 'vent';
            break;
        case 'SECURITY':
            name = 'demandManagementHome';
            typeParams = 'sec';
            break;
    }
    const to: any = router.resolve({
        name: name,
        params: {
            type: typeParams
        },
        query: {
            templateId: item.templateId || item.relTemplate.templateId,
            templateTag: item.templateTag || item.relTemplate.templateTag,
            templateType: item.templateType || item.relTemplate.templateType,
            islandPage: true as any,
            title: i18n.global.t('meos_control_web.demand_management')
        }
    });
    window.open(to.href, '_blank');
};

const showSelect = (index: number) => {
    state.selectShow = index;
};
const hideSelect = () => {
    state.selectShow = -1;
};
const monthMouseover = (e: Event, month: any) => {
    const result = month.days.every((item: any) => item.date <= state.today);
    if (!result) {
        month.checkboxShow = true;
    }
};
const monthMouseleaver = (e: Event, month: any) => {
    if (month.checkboxMonth == 'checked' || month.checkboxMonth == 'notNull') {
        month.checkboxShow = true;
    } else {
        month.checkboxShow = false;
    }
};
//日期配置
const getlistDateSetting = (type: any) => {
    cancelQuest();
    listDateSetting(
        {
            beginDate: `${state.date}-01-01`,
            endDate: `${state.date + 1}-01-01`,
            templateType: type
        },
        { cancelToken: cancelToken() }
    )
        .then((res: any) => {
            state.dateList = res.data || [];
            getYears(state.date);
        })
        .finally(() => {
            initLoading.value = false;
        });
};
//获取日历信息
const getListInstantiationDateTag = (type: string) => {
    initLoading.value = true;
    cancelQuest();
    listInstantiationDateTag(
        {
            beginDate: `${state.date}-01-01`,
            endDate: `${state.date}-12-31`,
            // filterByDemandTemplate: state.templateType === 'AIRCONDITIONING' ? true : false,
            templateType: state.templateType === 'AIRCONDITIONING' ? state.templateType : ''
        },
        { cancelToken: cancelToken() }
    )
        .then((res: any) => {
            state.dateTagList = res.data || [];
            state.legendList = [];
            state.dateTagList?.forEach((item: any) => {
                if (item.calendarTags) {
                    item.calendarTags.map((io: any) => {
                        if (io == 'ACSeason-1') {
                            state.legendList[0] = 'is-cool';
                        }
                        if (io == 'ACSeason-2') {
                            state.legendList[1] = 'is-hot';
                        }
                        if (isTemplateListShow('ANNIVERSARY') && io == 'anniversary') {
                            state.legendList[2] = 'is-holiday';
                        }
                        if (isTemplateListShow('HOLIDAY') && (io == 'minorVacation' || io == 'nationalDay' || io == 'newYear')) {
                            state.legendList[3] = 'is-shop';
                        }
                        if (io == 'AirSummer') {
                            state.legendList[4] = 'is-AirSummer';
                        }
                        if (io == 'AirWinter') {
                            state.legendList[5] = 'is-AirWinter';
                        }
                        if (io == 'AirSummerPeak') {
                            state.legendList[6] = 'is-AirSummerPeak';
                        }
                        if (io == 'AirSeasonSpring') {
                            state.legendList[7] = 'is-AirSeasonSpring';
                        }
                        if (io == 'AirSeasonAutumn') {
                            state.legendList[8] = 'is-AirSeasonAutumn';
                        }
                    });
                }
            });
            getlistDateSetting(type);
        })
        .finally(() => {
            // Mloading?.destroy();
        });
};

//应用模板
const updateApplyTemplateByDate = (id: any, date: any) => {
    applyTemplateByDate({
        templateId: id,
        dates: date
    })
        .then(() => {
            $Message.success({ title: i18n.global.t('common.operation_success') });
            // getlistDateSetting(state.templateType)
            getListInstantiationDateTag(state.templateType);
        })
        .finally(() => {
            initLoading.value = true;
        });
};
//清除模板
const clearCalendarFun = (data: any) => {
    clearLoading.value = true;
    clearCalendar(data)
        .then(res => {
            if (res.code === '00000') {
                state.showdialog = false;
                state.value = [];
                state.selectType = '';
                $Message.success({ title: i18n.global.t('common.operation_success') });
                clearLoading.value = false;
                // getlistDateSetting(state.templateType)
                getListInstantiationDateTag(state.templateType);
            }
        })
        .finally(() => {
            state.showdialog = false;
            clearLoading.value = false;
            initLoading.value = true;
        });
};
const show = (index: number) => {
    state.showIndex = index;
};
const hide = () => {
    state.showIndex = -1;
};
//恢复默认
const defaultBtn = () => {
    state.showdialog = true;
};
//选择其他模板
const selectOther = (item: any) => {
    item.showDialog = true;
};
const mouseShow = (data: any, status: boolean) => {
    timer.value = setTimeout(() => {
        state.templateIndex = data.relTemplate.templateName;
        // if (data.date <= state.today || data.type != 'current') {
        //     state.orderTime = false;
        // } else {
        //     state.orderTime = true;
        // }
        state.day = data;
        if (!status) {
            state.day = '';
            // state.tipsDisabled=true
        }
        const tipsDialog = document.getElementById('popoverItem');
        tipsDialog?.addEventListener('mouseleave', () => {
            data.showDialog = false;
        });
    }, 300);
};
//popup详情
const detailsBtn = (item: any) => {
    let obj: any = {
            date: item.date
        },
        name = '',
        typeParams = '';
    // eslint-disable-next-line default-case
    switch (item.relTemplate.demandType) {
        case 'AIRCONDITIONING':
            (name = 'demandManagementHome'), (typeParams = 'ac');
            break;
        case 'LIGHTING':
            name = 'lightingDemandManagement';
            break;
        case 'VENTILATION':
            name = 'demandManagementHome';
            typeParams = 'vent';
            break;
        case 'SECURITY':
            name = 'demandManagementHome';
            typeParams = 'sec';
            break;
    }

    const to: any = router.resolve({
        name: name,
        params: {
            type: typeParams
        },
        query: {
            ...obj,
            templateId: item.relTemplate.templateId,
            templateType: item.relTemplate.templateType,
            templateTag: item.relTemplate.templateTag,
            islandPage: true as any,
            title: i18n.global.t('meos_control_web.demand_management')
        }
    });
    window.open(to.href, '_blank');
};
const optionClick = (data: any) => {
    if (data == 1) {
        state.showCustom = true;
    } else {
        monthlist.value.map(item => {
            item.days.map(io => {
                if ((io.className.includes('is-dayoff') || io.className.includes('is-dayOffForbidden')) && io.type == 'current' && io.date >= state.today) {
                    io.selected = true;
                    item.checkboxShow = true;
                    item.checkboxMonth = 'notNull';
                    state.checkboxValue.push(io);
                }
            });
        });
    }
    disabledClearBtn();
};
const btnClick = () => {
    monthlist.value.map(item => {
        let maxDay = item.days.filter(items => items.date >= state.today && items.type === 'current');
        item.days.map(io => {
            if ((io.className.includes('is-workday') || io.className.includes('is-workDayForbidden')) && io.type == 'current' && io.date >= state.today) {
                io.selected = true;
                item.checkboxShow = true;
                state.checkboxValue.push(io);
                let selectedT = maxDay.every(ite => ite.selected === true);
                item.checkboxMonth = selectedT ? 'checked' : 'notNull';
            }
        });
    });
    disabledClearBtn();
};
//popup单个选择模板
const selectChange = (data: any, val: any, item: any) => {
    if (item.type == 'current') {
        // state.templateIndex = val
        item.boderColor = val >= 13 ? state.colorList[val % 9] : state.colorList[val % 13];
        item.selected = false;
        item.hover = false;
        item.mouseoverBgc = false;
        state.selectType = '';
        state.checkboxValue = [];
        updateApplyTemplateByDate(data.templateId, [item.date]);
    }
};
//popup单个清除模板
const singleClear = (item: any) => {
    let data = {
        templateType: state.templateType,
        isReset: false,
        dates: [item.date]
    };
    state.checkboxValue = [];
    clearCalendarFun(data);
};
const disabledClearBtn = () => {
    let bcTrue = state.checkboxValue.every((item: any) => Object.keys(item.relTemplate).length == 0);
    if (bcTrue) {
        state.disabled = true;
    } else {
        state.disabled = false;
    }
};
//顶部的清除模板
const clearTemplate = () => {
    MMessageBox({
        title: i18n.global.t('meos_control_web.confirm_clear_template'),
        confirmButtonText: i18n.global.t('meos_control_web.clear_now'),
        hasLoading: true,
        closeOnClickModal: false,
        message: i18n.global.t('meos_control_web.clear_irreversible')
    })
        .then(() => {
            // valueList(val)
            let arr: any = [];
            state.checkboxValue.map((item: any) => {
                item.selected = false;
                item.hover = false;
                item.mouseoverBgc = false;
                state.checkboxValue = [];
                arr.push(item.date);
            });
            for (let i = 0; i < monthlist.value.length; i++) {
                monthlist.value[i].checkboxMonth = 'uncheck';
                monthlist.value[i].checkboxShow = false;
            }
            // eslint-disable-next-line one-var
            let data = {
                templateType: state.templateType,
                isReset: false,
                dates: arr
            };
            clearCalendarFun(data);
        })
        .catch(() => {});
};
//顶部的选择模板
const selectChangeTop = (val: any) => {
    let bcTrue = state.checkboxValue.every((item: any) => item.boderColor === '');
    if (!bcTrue) {
        MMessageBox({
            title: i18n.global.t('meos_control_web.confirm_overwrite_template'),
            hasLoading: true,
            closeOnClickModal: false,
            message: i18n.global.t('meos_control_web.other_template_applied_on_selected_dates_continue_to_overwrite_irreversible')
        })
            .then(() => {
                valueList(val);
            })
            .catch(() => {});
    } else {
        valueList(val);
    }
};
const valueList = (val: any) => {
    let arr: any = [];
    state.checkboxValue.map((item: any) => {
        item.boderColor = val >= 13 ? state.colorList[val % 9] : state.colorList[val % 13];
        item.selected = false;
        item.hover = false;
        item.mouseoverBgc = false;
        state.selectType = '';
        state.value = [];
        state.checkboxValue = [];
        arr.push(item.date);
    });
    updateApplyTemplateByDate(state.templateList[val].templateId, arr);
};
//每个月的全选
const checkboxChangeMonth = (month: Month) => {
    // let maxDay = month.days.filter(item => item.date > state.today)
    month.days.forEach((item: any) => {
        if (item.date >= state.today && item.type == 'current') {
            if (month.checkboxMonth == 'notNull') {
                if (!item.selected) {
                    state.checkboxValue.push(item);
                    item.selected = true;
                    month.checkboxShow = true;
                }
            } else if (month.checkboxMonth == 'checked') {
                item.selected = false;
                month.checkboxShow = false;
                let index = state.checkboxValue.indexOf(item);
                state.checkboxValue.splice(index, 1);
                state.selectType = '';
                state.value = [];
            } else {
                item.selected = true;
                month.checkboxShow = true;
                state.checkboxValue.push(item);
            }
        }
    });
    disabledClearBtn();
};
//右上角自定义选择应用提交
const checkFormbtn = () => {
    for (let i = 0; i < monthlist.value.length; i++) {
        for (let j = 0; j < monthlist.value[i].days.length; j++) {
            let day1 = monthlist.value[i].days[j],
                dayOfWeek = dayjs(day1.date).toDate().getDay();
            if (day1.date >= state.today && day1.type == 'current') {
                state.value.map((item: any) => {
                    if (item == dayOfWeek) {
                        day1.selected = true;
                        monthlist.value[i].checkboxShow = true;
                        state.showCustom = false;
                        state.checkboxValue.push(day1);
                        monthlist.value[i].checkboxMonth = 'notNull';
                    }
                    if (item == 7 && dayOfWeek == 0) {
                        day1.selected = true;
                        monthlist.value[i].checkboxShow = true;
                        state.showCustom = false;
                        state.checkboxValue.push(day1);
                        monthlist.value[i].checkboxMonth = 'notNull';
                    }
                    if (state.value.length >= 6) {
                        monthlist.value[i].checkboxMonth = 'checked';
                    }
                });
            }
        }
    }
    disabledClearBtn();
};
const Cancel = () => {
    state.showCustom = false;
    state.value = [];
    state.type = '';
    state.selectType = '';
};
//恢复默认
const sureBtn = () => {
    let data = {
        templateType: state.templateType,
        isReset: true,
        year: state.date
    };
    clearCalendarFun(data);
};
const checkboxChange = (selected: any) => {
    state.value = selected;
};
//获取年日历
const getYears = (year: number) => {
    monthlist.value = [];
    for (let i = 0; i < 12; i++) {
        let firstdate = dayjs(String(year)).add(i, 'month').startOf('month'),
            enddate = dayjs(String(year)).add(i, 'month').endOf('month'),
            date = firstdate.toDate(), //每个月的开始日期
            enddates = enddate.toDate(), //每个月的结束日期
            firstWeek: any = firstdate.day(),
            lastWeek = enddate.day(),
            days: Day[] = [];
        if (firstWeek == 0) {
            firstWeek = 7;
        }
        if (firstWeek >= 1) {
            for (let j = 1; j < firstWeek; j++) {
                days.push({
                    date: dayjs(date).subtract(j, 'day').format('YYYY-MM-DD'),
                    type: 'pre',
                    day: dayjs(date).subtract(j, 'day').date() + '', //每个月具体的day
                    hover: false,
                    selected: false,
                    mouseoverBgc: false,
                    boderColor: '',
                    relTemplate: {},
                    className: [],
                    showDialog: false
                });
            }
            days.sort(function (a, b) {
                return a.day - b.day;
            });
        }
        //获取每个月的天数
        for (let j = 0; j < enddate.diff(date, 'days') + 1; j++) {
            let date1 = dayjs(date).add(j, 'day').toDate();
            days.push({
                date: dayjs(date1).format('YYYY-MM-DD'),
                type: 'current',
                day: dayjs(date1).date() + '', //每个月具体的day
                hover: false,
                selected: false,
                mouseoverBgc: false,
                boderColor: '',
                relTemplate: {},
                className: [],
                showDialog: false
            });
        }
        if (lastWeek >= 1) {
            for (let j = 1; j <= 7 - lastWeek; j++) {
                days.push({
                    date: dayjs(enddates).add(j, 'day').format('YYYY-MM-DD'),
                    type: 'next',
                    day: dayjs(enddates).add(j, 'day').date() + '', //每个月具体的day
                    hover: false,
                    selected: false,
                    mouseoverBgc: false,
                    boderColor: '',
                    relTemplate: {},
                    className: [],
                    showDialog: false
                });
            }
        }
        days.forEach((items: any) => {
            if (state.dateList?.length) {
                state.dateList.forEach((item: any) => {
                    if (items.date == item.date) {
                        items.relTemplate = item.relTemplate;
                        items.boderColor = colorFun(item.relTemplate);
                    }
                });
            }
            state.dateTagList.forEach((io: any) => {
                if (items.date == io.date && io.calendarTags) {
                    io.calendarTags.forEach((iv: any) => {
                        if (iv == 'ACSeason-1' && items.type == 'current') {
                            //供冷
                            items.className.push('is-cool');
                        }
                        if (iv == 'ACSeason-2' && items.type == 'current') {
                            //供暖
                            items.className.push('is-hot');
                        }
                        if (iv == 'AirSummer' && items.type == 'current') {
                            //夏
                            items.className.push('is-AirSummer');
                        }
                        if (iv == 'AirSummerPeak' && items.type == 'current') {
                            //夏高峰
                            items.className.push('is-AirSummerPeak');
                        }
                        if (iv == 'AirWinter' && items.type == 'current') {
                            //冬
                            items.className.push('is-AirWinter');
                        }
                        if (iv == 'AirSeasonSpring' && items.type == 'current') {
                            //过度春
                            items.className.push('is-AirSeasonSpring');
                        }
                        if (iv == 'AirSeasonAutumn' && items.type == 'current') {
                            //过度秋
                            items.className.push('is-AirSeasonAutumn');
                        }
                        if (iv == 'anniversary') {
                            //店庆
                            items.className.push('is-shop');
                        }
                        if (iv == 'workday') {
                            //工作日
                            if (isTemplateListShow('WORKDAY')) {
                                items.className.push('is-workday');
                            } else {
                                items.className.push('is-workDayForbidden');
                            }
                        }
                        if (iv == 'dayoff') {
                            //休息日
                            if (isTemplateListShow('DAYOFF')) {
                                items.className.push('is-dayoff');
                            } else {
                                items.className.push('is-dayOffForbidden');
                            }
                        }
                        if (iv == 'minorVacation' || iv == 'nationalDay' || iv == 'newYear') {
                            //节假日
                            items.className.push('is-holiday');
                        }
                    });
                }
            });
        });
        monthlist.value.push({
            date: dayjs(firstdate).format('M'),
            days: days,
            checkboxShow: false, //判断复选框
            week: firstdate.day(), //空几格
            checkboxMonth: 'uncheck',
            workday: !isTemplateListShow('DAYOFF'),
            dayoff: !isTemplateListShow('DAYOFF'),
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false
        });
    }
    monthlist.value.map(item => {
        item.days.map(io => {
            if (io.className.includes('is-workday') && io.date >= state.today) {
                if (dayjs(io.date).day() === 6) {
                    item.workday = true;
                }
                if (dayjs(io.date).day() === 0) {
                    item.dayoff = true;
                }
            }
            if (io.className.includes('is-dayoff') && io.date >= state.today) {
                if (dayjs(io.date).day() === 1) {
                    item.monday = true;
                }
                if (dayjs(io.date).day() === 2) {
                    item.tuesday = true;
                }
                if (dayjs(io.date).day() === 3) {
                    item.wednesday = true;
                }
                if (dayjs(io.date).day() === 4) {
                    item.thursday = true;
                }
                if (dayjs(io.date).day() === 5) {
                    item.friday = true;
                }
            }
        });
    });
    initLoading.value = false;
};

const colorFun = (type: any) => {
    let color = '';
    state.templateList.map((item: any) => {
        if (item.templateId == type.templateId) {
            // eslint-disable-next-line prefer-destructuring
            color = item.color;
        }
    });
    return color;
};
// 上一年
const prevYear = () => {
    state.date--;
    state.rightDisabled = false;
    initLoading.value = true;
    if (state.date == state.twoYearsAgo) {
        state.leftDisabled = true;
    }
    getListInstantiationDateTag(state.templateType);
};
// 下一年
const nextYear = () => {
    const year = state.todays.year();
    state.date++;
    initLoading.value = true;
    getListInstantiationDateTag(state.templateType);
    if (state.date > year) {
        state.rightDisabled = true;
        state.leftDisabled = false;
    } else if (state.date < year) {
        state.rightDisabled = false;
        state.leftDisabled = true;
    } else {
        state.leftDisabled = false;
    }
};

//每个月的day Click
const ClickItem = (e: Event, day: Day, month: Month) => {
    if (state.flag && day.type == 'current') {
        state.flag = false;
        let maxDay = month.days.filter(item => item.date >= state.today && item.type === 'current');
        if (day.date < state.today) {
            return;
        } else {
            day.selected = !day.selected;
            if (day.selected) {
                state.checkboxValue.push(day);
                let selectedT = maxDay.every(item => item.selected === true);
                month.checkboxMonth = selectedT ? 'checked' : 'notNull';
            } else {
                let index = state.checkboxValue.indexOf(day);
                state.checkboxValue.splice(index, 1);
                // eslint-disable-next-line one-var
                let selectedT = maxDay.every(item => item.selected === false);
                month.checkboxMonth = selectedT ? 'uncheck' : 'notNull';
                state.selectType = '';
                state.value = [];
            }
            disabledClearBtn();
        }
    }
};

// eslint-disable-next-line camelcase
let date_begin = '';
const Mousedown = (e: Event, day: Day) => {
    if (day.type != 'current') return;
    state.firstTime = new Date().getTime();
    state.tipsDisabled = true;
    if (day.date <= state.today) {
        return;
    } else {
        // eslint-disable-next-line camelcase
        date_begin = day.date;
    }
};

const Mouseover = (e: Event, day: Day, month: Month) => {
    if (day.type != 'current') {
        state.tipsDisabled = true;
        return;
    } else {
        state.tipsDisabled = false;
    }
    e.stopPropagation();
    // eslint-disable-next-line camelcase
    if (date_begin != '') {
        month.days.map((item: any) => {
            let day1 = item;
            // eslint-disable-next-line camelcase
            if ((day1.date >= day.date && day1.date <= date_begin) || (day1.date <= day.date && day1.date >= date_begin)) {
                if (day1.date <= state.today) {
                    day1.hover = false;
                } else {
                    day1.hover = true;
                    day1.mouseoverBgc = true;
                }
            } else {
                day1.hover = false;
                day1.mouseoverBgc = false;
            }
        });
    }
};
const Mouseup = (e: Event, month: Month) => {
    state.lastTime = new Date().getTime();
    state.tipsDisabled = false;
    if (state.lastTime - state.firstTime < 300) {
        state.flag = true;
    }
    let maxDay = month.days.filter(item => item.date >= state.today && item.type === 'current');
    // eslint-disable-next-line camelcase
    date_begin = '';
    for (let i = 0; i < monthlist.value.length; i++) {
        for (let j = 0; j < monthlist.value[i].days.length; j++) {
            let day1 = monthlist.value[i].days[j];
            if (day1.selected && day1.hover) {
                day1.selected = false;
                day1.hover = false;
                day1.mouseoverBgc = false;
                let index = state.checkboxValue.indexOf(day1);
                state.checkboxValue.splice(index, 1);
                // eslint-disable-next-line one-var
                let selectedT = maxDay.every(item => item.selected === false);
                month.checkboxMonth = selectedT ? 'uncheck' : 'notNull';
            } else if (!day1.selected && day1.hover) {
                day1.selected = true;
                day1.hover = false;
                state.checkboxValue.push(day1);
                day1.mouseoverBgc = false;
                let selectedT = maxDay.every(item => item.selected === true);
                month.checkboxMonth = selectedT ? 'checked' : 'notNull';
            }
        }
    }
    disabledClearBtn();
};

// const ClickWeek = (month: Month, week: number) => {
//   for (let j = 0; j < month.days.length; j++) {
//     if (month.days[j].week === week) {
//       month.days[j].selected = !month.days[j].selected
//     }
//   }
// }

const ClickReset = () => {
    for (let i = 0; i < monthlist.value.length; i++) {
        for (let j = 0; j < monthlist.value[i].days.length; j++) {
            let day1 = monthlist.value[i].days[j];
            day1.selected = false;
            day1.hover = false;
            state.checkboxValue = [];
            monthlist.value[i].checkboxMonth = 'uncheck';
            monthlist.value[i].checkboxShow = false;
            state.value = [];
            state.type = '';
            state.selectType = '';
        }
    }
};
</script>
<style lang="less">
.popoverItem.m-popover.m-flexible-overlay {
    // max-width: 420px;
    padding: 0px;
    border-radius: 8px;
    /* .m-scrollbar {
    height: calc(100% + 2px);
  } */
}
.m-select,
.m-select-inner {
    height: 28px;
}
.m-select-inner {
    min-height: 0;
    .m-select-placeholder {
        line-height: 0;
    }
    .m-select-inner-value {
        line-height: 28px;
        height: 28px;
    }
}
</style>
<style scoped lang="less">
@media screen and (min-width: 1681px) {
    .mouth-class {
        font-size: 16px;
    }
    .day-class {
        font-size: 16px;
    }
}
@media screen and (max-width: 1680px) {
    .mouth-class {
        font-size: 16px;
    }
    .day-class {
        font-size: 14px;
    }
}
@media screen and (max-width: 1440px) {
    .mouth-class {
        font-size: 14px;
    }
    .day-class {
        font-size: 12px;
    }
}
@media screen and (max-height: 700px) {
    .mouth-class {
        font-size: 14px;
    }
    .day-class {
        font-size: 12px;
    }
    .calendar-month li {
        height: 20px !important;
    }
    .day {
        height: 20px !important;
    }
}
@media screen and (max-width: 1366px) {
    .fit-ml {
        margin-right: 4px;
    }
}
@media screen and (min-width: 1366px) {
    .fit-ml {
        margin-right: 12px;
    }
}

.left-name {
    display: inline-block;
    width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.calendar {
    display: grid;
    height: calc(100% - 48px);
    gap: 16px 24px;
    grid-template-columns: repeat(4, 1fr);
}
.dayWeek {
    width: 100%;
    div {
        width: 14%;
        height: 36px;
        line-height: 36px;
        text-align: center;
    }
}
.share {
    width: 28px;
    height: 28px;
}
.share:hover {
    padding: 6px;
    background: rgba(196, 201, 207, 0.5);
    border-radius: 4px;
}
.triangle {
    width: 0;
    height: 0;
    border-top: 8px solid #f8766f;
    border-right: 8px solid transparent;
}
.por {
    position: absolute;
    left: 0;
    top: 0;
}
.list {
    flex-wrap: wrap;
    align-items: flex-start;
    display: grid;
    gap: 12px 0px;
    grid-template-columns: repeat(5, 1fr);
}
.selectItem {
    width: 100%;
    height: 190px;
    overflow-y: auto;
    padding: 8px;
}
.topBorder {
    border-bottom: 1px solid #e1e5eb;
    padding: 8px 12px;
}
.content {
    padding: 10px 8px;
}
.template-item:hover {
    background-color: #d9ebff;
    height: 39px;
    cursor: pointer;
    border-radius: 4px;
}
.popover-details {
    padding: 5px 8px;
    border-radius: 4px;
    cursor: pointer;
    color: #246fe5;
    // border: 1px solid #c4c9cf;
}
.bgcolor {
    width: 15px;
    height: 3px;
}
.popover-details:hover {
    background: #e1e5eb;
}
.get-line {
    width: 1px;
    height: 8px;
    background-color: #c4c9cf;
}
.get-line1 {
    width: 1px;
    height: 16px;
    background-color: #c4c9cf;
}
.demand-calendar-right {
    padding: 0 16px 16px;
    margin-top: 16px;
    position: relative;
    overflow-y: auto;
    &-header {
        width: 100%;
        height: 30px;
        overflow: hidden;
        // background-color: bisque
        .legend-container {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            max-width: 100%;
        }
        .legend-item {
            // flex: 0 0 auto;
            display: flex;
            align-items: center;
            min-width: 0;
        }

        .legend-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .legend-container::-webkit-scrollbar {
            display: none;
        }
        .legend-container {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    }
    .checkeds {
        width: 98%;
        height: 48px;
        padding: 10px 24px;
        border: 1px solid #64a6f7;
        border-radius: 4px;
        background-color: #d9ebff;
        position: absolute;
        top: 0px;
    }
    .is-hot {
        // background-color: var(--orange-100);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    // .is-hot:hover {
    //     background: rgba(242, 159, 0, 0.35);
    // }
    .is-cool {
        // background-color: var(--blue-50);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    // .is-cool:hover {
    //     background: rgba(159, 201, 251, 0.5);
    // }

    .is-workday,
    .is-workingDay {
        color: #000;
    }
    .is-weekend,
    .is-dayoff {
        color: #e68600;
    }
    .is-formerly {
        color: rgba(128, 128, 128, 0.5);
        cursor: default;
    }
    .is-formerlyWeekd {
        color: rgba(255, 165, 0, 0.5);
        cursor: default;
    }
    .is-AirSummer {
        background-color: rgba(255, 240, 204, 0.8);
    }
    .is-AirWinter {
        background-color: #ebf6ff;
    }
    .is-AirSummerPeak {
        background-color: rgba(255, 230, 229, 0.8);
    }
    .is-AirSeasonSpring {
        background-color: rgba(218, 247, 225, 0.8);
    }
    .is-AirSeasonAutumn {
        background-color: rgba(241, 227, 247, 0.8);
    }
    .day {
        background-color: #246fe5;
        color: white;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;
    }
    .Selectbgc {
        background-color: #d9ebff;
        border: 1px solid #246fe5 !important;
    }
    .mouseoverBgc {
        background-color: #d9ebff;
    }
    .everyDay {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .everyDay:hover {
        // border: 1px solid #429fff;
    }
}
.wd {
    width: 100%;
    height: 100%;
    border: 1px solid transparent;
}
.wd:hover {
    border: 1px solid #429fff;
}

@media screen and (max-width: 1280px) {
    .demand-calendar-right {
        width: 992px;
    }
}
.color-item {
    min-width: 12px;
    min-height: 12px;
    border-radius: 2px;
    // background-color: #000;
}
ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
}

li {
    display: list-item;
    text-align: -webkit-match-parent;
}

ol,
ul {
    list-style: none;
}

.flex-wrap {
    flex-wrap: wrap;
    display: flex;
}
.mt-24 {
    margin-bottom: 10px;
}

.ml-16 {
    margin-left: 16px;
}

.text-primary {
    color: #333;
}

.text-sub,
.text-tip {
    line-height: 1.5;
}

.text-center {
    text-align: center;
}

.text-14 {
    font-size: 14px;
    // line-height: 1.5;
}

.pb-8 {
    padding-bottom: 8px;
}

.text-sub {
    color: #666;
}

.text-tip {
    // background-color: #f5f7fa;
    color: #999;
}

.color-red {
    color: #f5222d;
}
.oneDay:hover {
    // border: 1px solid #429fff;
}
.oneDay {
    position: relative;
    cursor: pointer;
    width: 100%;
    // border: 1px solid transparent;
    // height: 100%;
    z-index: 1;
    .day-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
    }
    .day-icon1 {
        position: absolute;
        top: -6px;
        right: 0px;
        // width: 10px;
        // height: 10px;
    }
    .tick-icon {
        position: absolute;
        top: -1px;
        left: 0;
        width: 10px;
        height: 10px;
    }
}

.relative {
    position: relative;
}
.absolute {
    position: absolute;
}

.calendar-month ul {
    // width: 380px;
    height: calc(100% - 55px);
    padding: 1px;
}

.calendar-month li {
    text-align: center;
    width: 14%;
    min-height: 0;
    // height: 28px;
    //   line-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    //   font-size: 14px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    //border: 1px dashed #8c939d;
}
.calendar-month li span {
    font-size: 8px;
    bottom: -12px;
    left: -2px;
    text-align: center;
    transform: scale(0.6);
}
.calendar-month .isSelected {
    // background: #b3c8ff;
    color: #162d53;
}
.calendar-month {
    // padding: 2px;
}
.calendar-month .isOver {
    background-color: #f0f0f0;
    color: #999;
}
.borderClass {
    position: absolute;
    bottom: 0;
    z-index: -1;
}
//.calendar-month li:nth-of-type(7n), .calendar-month li:nth-of-type(7n - 1) {
//  background: #f5f7fa;
//}
//.calendar-month li:hover{
//  background-color: #f0f0f0;
//  color: #999;
//}
</style>
