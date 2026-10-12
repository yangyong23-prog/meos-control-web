<!-- -->
<template>
    <m-modal
        v-model:visible="strategyModalParams.showModal"
        :append-to="$modalAppendTo"
        type="default"
        modal-class-name="cool-create-strategy"
        :width="840"
        :top-y="105"
        :content-class-name="'CoolStrategyModal'"
        :auto-close="false"
        :title="props.queryParams.name == 'edit' ? i18n.global.t('meos_control_web.edit_schedule') : i18n.global.t('meos_control_web.create_new_schedule')"
        @close="closeModal"
    >
        <template #content>
            <div v-loading="strategyModalParams.loading" class="content-left" element-loading-lottiename="circle">
                <div v-if="strategyModalParams.prompts" class="page-prompts fcb">
                    <div class="fc">
                        <IconMeriComponentDialogWarning style="margin-right: 8px" />
                        {{ i18n.global.t('meos_control_web.system_cooling_heating_mode_match_calendar') }}
                    </div>
                    <span class="prompts" @click="strategyModalParams.prompts = false">{{ i18n.global.t('meos_control_web.got_it') }}</span>
                </div>
                <m-form ref="Mform" style="height: 100%" label-width label-position="left" :rules="rules" :model="strategyModalParams">
                    <m-form-item :label="i18n.global.t('meos_control_web.object')">
                        <span class="left-text">{{ props.queryParams.systemName || '--' }}</span>
                    </m-form-item>
                    <m-form-item
                        :label="i18n.global.t('meos_control_web.effective_date')"
                        prop="date"
                        class="picker"
                        require-asterisk-position="right"
                        :rules="[
                            { required: true, message: EMPTYTEXT, trigger: 'blur' },
                            {
                                validator: validateDatePicker,
                                trigger: ['change']
                            }
                        ]"
                    >
                        <m-date-picker
                            v-model="strategyModalParams.date"
                            :scope="`${new Date()} - ${new Date(new Date().setFullYear(new Date().getFullYear() + 1))}`"
                            :width="256"
                            type="daterange"
                            :placeholder="i18n.global.t('meos_control_web.start_time_to_end_time')"
                            :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                            @change="pickerChange"
                        />
                        <span class="date-text">{{ strategyModalParams.dateSeasonText }}</span>
                    </m-form-item>
                    <div class="m-form-item" :style="{ height: strategyModalParams.prompts ? 'calc(100% - 158px)' : 'calc(100% - 110px)' }">
                        <label class="m-form-item__label" :style="{ 'align-items': 'flex-start' }">
                            {{ i18n.global.t('meos_control_web.operation_schedule') }}
                            <span class="m-form-item__label-required m-form-item__label-required-left">*</span>
                        </label>
                        <div class="m-form-item__content" style="height: 100%">
                            <m-scrollbar ref="scrollbarRef" class="plan-box">
                                <div v-for="(item, index) in strategyModalParams.planList" :key="index + item.id" class="plan-box-row">
                                    <div class="plan-box-item" style="width: 100%">
                                        <div class="m-row" style="width: 100%; display: flex">
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.time_colon') }}</div>
                                                <m-form-item
                                                    style="margin-right: 40px"
                                                    :prop="`item.${index}.strategyTime`"
                                                    :item-model="item.strategyTime"
                                                    require-asterisk-position="''"
                                                    :rules="[
																												{ required: true, message: EMPTYTEXT, trigger: 'change' },
																											{
																												validator: (value:any, rule:any, callback:any) => validateTimePicker(item, callback, index),
																												trigger: 'change'
																											}
																										]"
                                                >
                                                    <m-time-picker
                                                        :key="index + 't'"
                                                        v-model="item.strategyTime"
                                                        :style="{ width: '180px' }"
                                                        :scope-time="
                                                            strategyModalParams.date &&
                                                            getDayjsTz().format('YYYY-MM-DD') === dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD')
                                                                ? `${getDayjsTz().add(1, 'minute').format('HH:mm')}-23:59`
                                                                : `00:00-23:59`
                                                        "
                                                        :step-m="5"
                                                        :disabled="item.isDisabled"
                                                        :scope-disabled-tips-text="i18n.global.t('meos_control_web.selected_date_out_of_range')"
                                                        format="hm"
                                                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                                                        @change="InputChange"
                                                    />
                                                </m-form-item>
                                            </div>
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.operation_status_colon') }}</div>
                                                <m-form-item
                                                    :prop="`item.${index}.runStatus`"
                                                    :item-model="item.runStatus"
                                                    require-asterisk-position="''"
                                                    :rules="[{ required: true, message: EMPTYTEXT, trigger: 'change' }]"
                                                >
                                                    <div class="fc fc-radio" style="">
                                                        <m-radio-group v-model="item.runStatus" @change="InputChange">
                                                            <m-radio label="OPEN" :disabled="item.isDisabled" style="--margin: 20px"
                                                                >{{ i18n.global.t('common.operation') }}
                                                            </m-radio>
                                                            <m-radio label="CLOSE" :disabled="item.isDisabled" style="--margin: 20px">{{
                                                                i18n.global.t('common.status_close')
                                                            }}</m-radio>
                                                        </m-radio-group>
                                                    </div>
                                                </m-form-item>
                                            </div>
                                        </div>
                                        <div v-if="item.runStatus === 'OPEN' && props.queryParams.type == '0'" class="m-row" style="display: flex">
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.chiller_groups_colon') }}</div>
                                                <m-form-item style="margin-right: 32px">
                                                    <div class="cooler">
                                                        <m-form-item
                                                            :prop="`item.${index}.chillerLNum`"
                                                            :item-model="item.chillerLNum"
                                                            label-width="0px"
                                                            :rules="[
																															{ required: true, message: EMPTYTEXT, trigger: 'change' },
																															{ validator: (value:any,rule:any,callback:any) => validatechillerLNum(item,callback,index), trigger: ['change'] }
																														]"
                                                        >
                                                            <m-select
                                                                v-model="item.chillerLNum"
                                                                :size="180"
                                                                :placeholder="i18n.global.t('meos_control_web.please_select')"
                                                                controls="operatorIcon"
                                                                :disabled="item.isDisabled"
                                                                :options="strategyModalParams.acahcObjList"
                                                                :is-show-empty="strategyModalParams.acahcObjList.length ? false : true"
                                                                @change="InputChange"
                                                            >
                                                                <template #empty>
                                                                    <div class="m-select-menu-empty">{{ i18n.global.t('meos_control_web.no_host') }}</div>
                                                                </template>
                                                            </m-select>
                                                        </m-form-item>
                                                    </div>
                                                </m-form-item>
                                            </div>
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.chiller_outlet_temp_setpoint_colon') }}</div>
                                                <m-form-item
                                                    style="margin-right: 32px"
                                                    :prop="`item.${index}.chillWaterOutTempSet`"
                                                    :item-model="item.chillWaterOutTempSet ? item.chillWaterOutTempSet + '' : item.chillWaterOutTempSet"
                                                    require-asterisk-position="''"
                                                    :rules="[{ required: true,
																											validator: (value:any, rule:any, callback:any) => validateTempSet(item, callback, index),
																											trigger: ['blur','change']
																										}]"
                                                >
                                                    <m-popover trigger="manually" :content="temperatureRangeText" :is-open="item.temperatureRangeTextShow">
                                                        <m-input-number
                                                            v-model="item.chillWaterOutTempSet"
                                                            :disabled="item.isDisabled"
                                                            text-align="left"
                                                            width="160"
                                                            step="0"
                                                            precision="1"
                                                            :placeholder="i18n.global.t('common.placeholder_input')"
                                                            controls="rightButton"
                                                            @input="InputChange('tem', item, $event.target.value)"
                                                            @keyup="temkeyup('tem', item, $event)"
                                                            @focus="item.temperatureRangeTextShow = true"
                                                            @blur="item.temperatureRangeTextShow = false"
                                                        >
                                                            <template #suffix>°C</template>
                                                        </m-input-number>
                                                    </m-popover>
                                                </m-form-item>
                                            </div>
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.continuous_duration_colon') }}</div>
                                                <m-form-item
                                                    :prop="`item.${index}.sustainTime`"
                                                    :item-model="item.sustainTime ? item.sustainTime + '' : item.sustainTime"
                                                    require-asterisk-position="''"
                                                    :rules="[{ required: true,
																											validator: (value:any, rule:any, callback:any) => validateSustainTime(item, callback, index),
																											trigger: ['blur','change']
																										}]"
                                                >
                                                    <m-input-number
                                                        v-model="item.sustainTime"
                                                        :disabled="item.isDisabled"
                                                        text-align="left"
                                                        width="160"
                                                        :min="0"
                                                        :max="1440"
                                                        :step="0"
                                                        precision="1"
                                                        :placeholder="i18n.global.t('common.placeholder_input')"
                                                        controls="rightButton"
                                                        @input="InputChange('suTime', item, $event.target.value)"
                                                        @keyup="temkeyup('suTime', item, $event)"
                                                    >
                                                        <template #suffix>min</template>
                                                    </m-input-number>
                                                </m-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <span v-if="strategyModalParams.planList.length > 1" class="left-delete" :class="{ 'left-delete-disabled': item.isDisabled }">
                                        <IconMeriActionDelete v-if="item.isDisabled" style="cursor: not-allowed" color="#8B949E" hover-color="#8B949E" />
                                        <m-tips v-else :content="i18n.global.t('common.delete')" theme="darkTransparent" placement="bottom-start">
                                            <IconMeriActionDelete @click="deleteFun(index)" />
                                        </m-tips>
                                    </span>
                                </div>
                                <m-button type="text" class="fc plan-box-add" @click.stop="addFun($event)">
                                    <template #icon>
                                        <IconMeriComponentButtonAdd :size="16" :color="'#246FE5'" style="margin-right: 4px"></IconMeriComponentButtonAdd>
                                    </template>
                                    {{ i18n.global.t('meos_control_web.add_time') }}
                                </m-button>
                            </m-scrollbar>
                        </div>
                    </div>
                </m-form>
            </div>
            <!-- 覆盖策略弹框 -->
            <m-modal
                v-model:visible="strategyModalParams.confirmStrategyState"
                :append-to="$modalAppendTo"
                type="info"
                :title="''"
                :content="i18n.global.t('meos_control_web.confirm_new_policy_future_override')"
                @close="close"
            >
                <template #footer>
                    <m-button type="default" size="medium" @click="cancelStrategy">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button id="addFixedTimeStrategy" class="confirmBtn" type="primary" size="medium" @click="confirmStrategy">{{ i18n.global.t('common.confirm') }}</m-button>
                </template>
            </m-modal>
            <!-- 二次确认 -->
            <m-modal
                v-model:visible="strategyModalParams.showleave"
                :append-to="$modalAppendTo"
                type="info"
                :title="i18n.global.t('meos_control_web.confirm_exit')"
                :content="i18n.global.t('meos_control_web.filled_content_will_not_save')"
                @close="closeStrate"
                @submit="submitStrate"
            />
        </template>
        <template #footer>
            <m-button type="default" @click.stop="closeModal">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" :loading="strategyModalParams.isDisabled" @click.stop="submit">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>
<script lang="ts" setup>
/*eslint-disable eqeqeq  */
import { IconMeriActionDelete, IconMeriComponentButtonAdd, IconMeriComponentDialogWarning } from 'meri-icon';
import { EMPTYTEXT, getDayjsTz } from '@/utils/globalVariables';
import { $Message } from 'meri-plus';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import {
    chillerStrategyAddFixedTimeStrategy,
    getAcahcObj,
    updateFixedTimeStrategy,
    queryShellConfigByInfoCode,
    querySeasonByTime
} from '@/apis/hotColdStationStrategyIntervention';
import { uniqueId } from 'lodash';
import { unref } from 'vue';
import { setModelType } from '@/utils/tools';
import i18n from '@/localization';

const props = defineProps(['queryParams']);

const emits = defineEmits(['close', 'getListFixedStrategyDateByMonth']);

const scrollbarRef = ref(); // 添加时间滚动条
const strategyModalParams = reactive({
    loading: true,
    isDisabled: false,
    showModal: true, // 弹框
    titleModal: '', // 弹框标题
    acahcObjList: [] as any, // 组机数量
    date: '', // 生效日
    dateSeasonText: '', // 生效日所在的季节提示信息：选择的时间段包含供冷季、供暖季和过渡季
    planList: [
        {
            strategyTime: '',
            runStatus: 'OPEN',
            chillerLNum: '',
            chillWaterOutTempSet: null,
            id: uniqueId('plan')
        }
    ] as any,
    paramsPlanlist: [] as any, // 传给后端的列表参数
    confirmStrategyState: false, // 覆盖策略弹框状态
    confirmparams: {}, // 覆盖策略参数
    hasChange: false, // 是否修改
    prompts: true, // 用户提示
    showleave: false // 退出
});

const Mform = ref(); // 表单

// 冷机台数
const validatechillerLNum = (item: any, callback: (avg?: any) => void, index: any) => {
    if (parseInt(item.chillerLNum) > parseInt(shellConfig.value.chillerLNum)) {
        callback(
            new Error(
                i18n.global.t('meos_control_web.xshell_most_choose', {
                    num: shellConfig.value.chillerLNum
                })
            )
        );
    } else {
        Mform.value.clearValidate([`item.${index}.chillerLNum`]);
        callback();
    }
};

// 查看时间是否出现了两次
const checkDuplicate = (arr: Array<string>, num: string) => {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === num) {
            count++;
            if (count === 2) {
                return true;
            }
        }
    }
    return false;
};

// 策略时间
const validateTimePicker = (item: any, callback: (avg?: any) => void, index: any) => {
    console.log(item.strategyTime);
    console.log('props.queryParams.name;;', props.queryParams.name);
    console.log('props.queryParams.name;;', getDayjsTz().format('YYYY-MM-DD'));
    console.log('props.queryParams.name;;', dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD'));
    console.log('props.queryParams.name;;', getDayjsTz().add(61, 'minute').format('HH:mm'));
    console.log('props.queryParams.name;;', item.strategyTime);

    let timeArr = ref([] as any);
    strategyModalParams.planList.length &&
        strategyModalParams.planList.map((p: any) => {
            timeArr.value.push(p.strategyTime);
        });
    console.log(timeArr.value, 'ppppppppp');
    if (checkDuplicate(timeArr.value, item.strategyTime)) {
        callback(new Error(i18n.global.t('meos_control_web.time_already_selected_please_check')));
    } else if (
        props.queryParams.name === 'add' &&
        getDayjsTz().format('YYYY-MM-DD') === dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD') &&
        item.strategyTime <= getDayjsTz().format('HH:mm')
    ) {
        callback(new Error(i18n.global.t('meos_control_web.date_check_error_1')));
    } else {
        // Mform.value.clearValidate([`item.${index}.strategyTime`])
        callback();
    }
};

// 生效日
const validateDatePicker = (rule: any, value: any, callback: any) => {
    if (!value) return;
    if (value.split('-')[0] < getDayjsTz().format('YYYY.MM.DD')) {
        callback(new Error(i18n.global.t('meos_control_web.past_time_not_selectable')));
    } else {
        callback();
    }
};

//
const validateTempSet = (item: any, callback: (avg?: any) => void, index: any) => {
    if (item.chillWaterOutTempSet == null) {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_3')));
    } else {
        callback();
    }
};

const validateSustainTime = (item: any, callback: (avg?: any) => void, index: any) => {
    if (item.sustainTime == null) {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_3')));
    } else {
        callback();
    }
};

const rules = ref({});

// 设置标题
const formatterTitle = () => {
    const { name, type } = props.queryParams;
    queryCooler(name, type);
};

// 编辑参数转换
const formatterParams = () => {
    const { name, type, systemName, systemId, data } = props.queryParams;
    console.log('name;;;;', name);
    console.log('type;;;;', type);
    console.log('systemName;;;;', systemName);
    console.log('systemId;;;;', systemId);
    console.log('data;;;;', data);
    strategyModalParams.date = `${dayjs(data.dateTime).format('YYYY.MM.DD')}-${dayjs(data.dateTime).format('YYYY.MM.DD')}`;
    emitter.emit('changeDaterange', strategyModalParams.date);
    strategyModalParams.planList =
        data.content.length &&
        data.content.map((d: any) => {
            return {
                isDisabled:
                    getDayjsTz().format('YYYY-MM-DD') == dayjs(data.dateTime).format('YYYY-MM-DD') ? (getDayjsTz().format('HH:mm:ss') > d.strategyTime ? true : false) : false,
                strategyId: d.strategyId,
                id: uniqueId('plan'),
                strategyTime: d.strategyTime.slice(0, 5),
                chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                runStatus: d.runStatus,
                chillWaterOutTempSet:
                    d.runStatus == 'OPEN'
                        ? d.chillWaterOutTempSet
                            ? d.chillWaterOutTempSet.substring(0, d.chillWaterOutTempSet.lastIndexOf('.') + 2)
                            : d.chillWaterOutTempSet
                        : null,
                sustainTime: d.runStatus == 'OPEN' ? d.sustainTime : null,
                temperatureRangeTextShow: false
            };
        });
    strategyModalParams.loading = false;
};

// 壳配置信息
const shellConfig = ref();
// 壳配置温度提示文案是否显示
// const temperatureRangeTextShow = ref(false)

// 壳配置温度范围文案
const temperatureRangeText = computed(() => {
    const { chillWaterOutTempSet, heatWaterSupplyTempSet } = shellConfig.value || {};
    const chillWaterOutTempSetList = chillWaterOutTempSet?.split(',') || [];
    const heatWaterSupplyTempSetList = heatWaterSupplyTempSet?.split(',') || [];
    return `${i18n.global.t('meos_control_web.cooling_season_temp_range')}
  ${chillWaterOutTempSetList.length ? chillWaterOutTempSetList[0] : '--'}℃~${chillWaterOutTempSetList.length > 1 ? chillWaterOutTempSetList[1] : '--'}℃，
    ${i18n.global.t('meos_control_web.heating_season_temp_range')}
  ${heatWaterSupplyTempSetList.length ? heatWaterSupplyTempSetList[0] : '--'}℃~${heatWaterSupplyTempSetList.length > 1 ? heatWaterSupplyTempSetList[1] : '--'}℃
  `;
});

// 查询冷机数量
const queryCooler = (name: string, type: string) => {
    strategyModalParams.acahcObjList = [];
    getAcahcObj({
        systemId: props.queryParams.systemId
    }).then((res: any) => {
        const { code, data, result } = res;
        if (result !== 'success') return;
        if (Array.isArray(data)) {
            for (let i = 0; i <= data.length; i++) {
                strategyModalParams.acahcObjList.push({
                    id: i + '',
                    name: i + ''
                });
            }
        }
        if (name == 'edit') {
            formatterParams();
        } else {
            strategyModalParams.loading = false;
        }
    });
};

// 查询壳配置信息
const helpQueryShellConfigByInfoCode = (infoCode: string) => {
    return queryShellConfigByInfoCode({
        objectId: props.queryParams.systemId,
        infoCode
    }).then(({ code, data }: { code: string; data: any }) => {
        if (code === '00000' && data) {
            shellConfig.value[infoCode] = data?.value;
        }
        console.log('壳配置信息：', data);
    });
};

// 确定
const submit = () => {
    Mform.value.validate((valid: boolean, error: any) => {
        if (valid) {
            strategyModalParams.isDisabled = true;
            strategyModalParams.paramsPlanlist = [];
            strategyModalParams.paramsPlanlist = strategyModalParams.planList.map((item: any) => {
                return {
                    sustainTime: item.sustainTime,
                    strategyTime: item.strategyTime + ':00',
                    runStatus: item.runStatus,
                    chillerLNum: item.runStatus == 'OPEN' ? (item.chillerLNum ? parseInt(item.chillerLNum) : 0) : null,
                    chillWaterOutTempSet: item.runStatus == 'OPEN' ? item.chillWaterOutTempSet : null
                };
            });

            let data = {
                systemType: 'ACCI',
                systemId: props.queryParams.systemId,
                objectId: props.queryParams.systemId,
                strategyId: strategyModalParams.planList[0].strategyId,
                strategyPlans: strategyModalParams.paramsPlanlist,
                beginDate: dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD'),
                endDate: dayjs(strategyModalParams.date.split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
            };
            if (props.queryParams.name == 'edit') {
                setModelType(data.systemId);
                strategyApi('edit', updateFixedTimeStrategy, data);
            } else {
                queryCheckFixedStrategy(data);
            }
        } else {
            $Message.error({ title: `${i18n.global.t('meos_control_web.input_validation_error_check')}` });
        }
    });
};

// 新建冷机策略 api接口名称 params 参数数组  status add||edit
const strategyApi = (status: string, api: any, params: any) => {
    api(params).then((res: any) => {
        strategyModalParams.isDisabled = false;
        if (res.result == 'success') {
            if (props.queryParams.type == '1') {
                // 冷冻泵组
                if (status == 'add') {
                    // 新建
                    $Message.success({ title: `${i18n.global.t('common.save_success')}` });
                    close();
                    emitter.emit('refresh');
                } else {
                    $Message.success({ title: `${i18n.global.t('common.edit_success')}` });
                    close();
                    emitter.emit('refresh');
                }
            } else {
                // 冷站
                if (status == 'add') {
                    // 新建
                    $Message.success({ title: `${i18n.global.t('common.save_success')}` });
                    close();
                    emitter.emit('refreshMain');
                } else {
                    $Message.success({ title: `${i18n.global.t('common.edit_success')}` });
                    close();
                    emitter.emit('refreshMain');
                }
            }
            emits('getListFixedStrategyDateByMonth');
        }
    });
};

// 选中的日期范围包含当天时，需要用户二次确认。
const queryCheckFixedStrategy = (params: any) => {
    const [startDate, endDate] = strategyModalParams.date.split('-');
    const today = getDayjsTz().startOf('day');
    const containsToday = today.valueOf() >= dayjs(startDate).startOf('day').valueOf() && today.valueOf() <= dayjs(endDate).endOf('day').valueOf();

    if (containsToday) {
        strategyModalParams.confirmStrategyState = true;
        strategyModalParams.confirmparams = params;
        return;
    }

    setModelType((params as any).systemId);
    strategyApi('add', chillerStrategyAddFixedTimeStrategy, params);
};

// 覆盖策略弹框取消
const cancelStrategy = () => {
    strategyModalParams.isDisabled = false;
    strategyModalParams.confirmStrategyState = false;
};

// 覆盖策略弹框确认
const confirmStrategy = () => {
    strategyModalParams.confirmStrategyState = false;
    strategyModalParams.isDisabled = false;
    nextTick(() => {
        Mform.value.validate((valid: boolean, error: any) => {
            console.log(error);
            if (valid) {
                console.log(strategyModalParams.confirmparams);
                setModelType((strategyModalParams.confirmparams as any).systemId);
                strategyApi('add', chillerStrategyAddFixedTimeStrategy, strategyModalParams.confirmparams);
            }
        });
    });
};

// 点击删除icon
const deleteFun = (index: any) => {
    strategyModalParams.planList.splice(index, 1);
    strategyModalParams.hasChange = true;
};

// 添加时间
const addFun = (e: any) => {
    if (!e.pointerType) return;
    strategyModalParams.planList.push({
        strategyTime: '',
        runStatus: 'OPEN',
        chillerLNum: '',
        id: uniqueId('plan'),
        // number: { min: 0, max: 0 },
        chillWaterOutTempSet: null
    });
    strategyModalParams.hasChange = true;
    nextTick(() => {
        scrollbarRef.value?.setScrollTop('end');
    });
};

onMounted(() => {
    strategyModalParams.loading = true;
    strategyModalParams.showModal = true;
    formatterTitle();
    // 循环查询壳配置信息
    const infoCodeList = ['chillerLNum', 'chillWaterOutTempSet', 'heatWaterSupplyTempSet'];
    shellConfig.value = {};
    infoCodeList.forEach(async o => {
        helpQueryShellConfigByInfoCode(o);
    });
});

// 生效时间change
const pickerChange = async (data: any) => {
    if (data) {
        const seasonData: any = await querySeasonByTime({
            beginDateTime: dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD'),
            endDateTime: dayjs(unref(data).split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
        });

        if (seasonData?.code === '00000') {
            console.log([...new Set(Object.values(seasonData?.data))]);
            const seasonTimeData = ([...new Set(Object.values(seasonData?.data))] as string[]).map(item =>
                item === 'ACSeason-1' ? i18n.global.t('meos_control_web.cooling_season') : item === 'ACSeason-2' ? i18n.global.t('meos_control_web.heat_season') : item
            );
            // eslint-disable-next-line default-case
            switch (seasonTimeData.length) {
                case 0:
                    strategyModalParams.dateSeasonText = '';
                    break;
                case 1:
                    strategyModalParams.dateSeasonText = `${i18n.global.t('meos_control_web.selected_time_period_is')}${seasonTimeData[0]}`;
                    break;
                case 2:
                    strategyModalParams.dateSeasonText = i18n.global.t('meos_control_web.choose_should_has', {
                        a: seasonTimeData[0],
                        b: seasonTimeData[1]
                    });
                    break;
                case 3:
                    strategyModalParams.dateSeasonText = i18n.global.t('meos_control_web.choose_should_has', {
                        a: `${seasonTimeData[0]}、${seasonTimeData[1]}`,
                        b: seasonTimeData[2]
                    });
                    break;
            }
        }
    } else {
        strategyModalParams.dateSeasonText = '';
    }

    strategyModalParams.hasChange = true;
    emitter.emit('changeDaterange', strategyModalParams.date);
    if (props.queryParams.name == 'edit') {
        if (props.queryParams.type == '1') {
            if (dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD') == dayjs(unref(data).split('-')[1]).format('YYYY-MM-DD')) {
                if (getDayjsTz().format('YYYY-MM-DD') == dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')) {
                    console.log('shijintian ');
                    strategyModalParams.planList = props.queryParams.data.strategy.map((d: any) => {
                        return {
                            isDisabled: getDayjsTz().format('HH:mm:ss') > dayjs(d.strategyTime).format('HH:mm:ss') ? true : false,
                            branchDateDataUnit: d.branchDateDataUnit,
                            branchDateType: d.branchDateType,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(11, 16),
                            runStatus: d.runStatus,
                            chillWaterOutTempSet:
                                d.runStatus == 'OPEN' ? (d.branchDateData ? d.branchDateData.substring(0, d.branchDateData.lastIndexOf('.') + 2) : d.branchDateData) : null,
                            temperatureRangeTextShow: false
                        };
                    });
                } else {
                    console.log('bushi');
                    strategyModalParams.planList = props.queryParams.data.strategy.map((d: any) => {
                        return {
                            isDisabled: false,
                            branchDateDataUnit: d.branchDateDataUnit,
                            branchDateType: d.branchDateType,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(11, 16),
                            runStatus: d.runStatus,
                            chillWaterOutTempSet:
                                d.runStatus == 'OPEN' ? (d.branchDateData ? d.branchDateData.substring(0, d.branchDateData.lastIndexOf('.') + 2) : d.branchDateData) : null,
                            temperatureRangeTextShow: false
                        };
                    });
                }
            } else {
                // 不一样的周期 有可能包含今天
                strategyModalParams.planList =
                    props.queryParams.data.strategy.length &&
                    props.queryParams.data.strategy.map((d: any) => {
                        return {
                            isDisabled:
                                getDayjsTz().format('YYYY-MM-DD') == dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')
                                    ? getDayjsTz().format('HH:mm:ss') > dayjs(d.strategyTime).format('HH:mm:ss')
                                        ? true
                                        : false
                                    : false,
                            branchDateDataUnit: d.branchDateDataUnit,
                            branchDateType: d.branchDateType,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(11, 16),
                            runStatus: d.runStatus,
                            chillWaterOutTempSet:
                                d.runStatus == 'OPEN' ? (d.branchDateData ? d.branchDateData.substring(0, d.branchDateData.lastIndexOf('.') + 2) : d.branchDateData) : null,
                            temperatureRangeTextShow: false
                        };
                    });
            }
        } else {
            if (dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD') == dayjs(unref(data).split('-')[1]).format('YYYY-MM-DD')) {
                if (getDayjsTz().format('YYYY-MM-DD') == dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')) {
                    console.log('shijintian ');
                    strategyModalParams.planList = props.queryParams.data.content.map((d: any) => {
                        return {
                            isDisabled: getDayjsTz().format('HH:mm:ss') > d.strategyTime ? true : false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            chillWaterOutTempSet:
                                d.runStatus == 'OPEN'
                                    ? d.chillWaterOutTempSet
                                        ? d.chillWaterOutTempSet.substring(0, d.chillWaterOutTempSet.lastIndexOf('.') + 2)
                                        : d.chillWaterOutTempSet
                                    : null,
                            temperatureRangeTextShow: false
                        };
                    });
                } else {
                    console.log('bushi');
                    strategyModalParams.planList = props.queryParams.data.content.map((d: any) => {
                        return {
                            isDisabled: false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            chillWaterOutTempSet:
                                d.runStatus == 'OPEN'
                                    ? d.chillWaterOutTempSet
                                        ? d.chillWaterOutTempSet.substring(0, d.chillWaterOutTempSet.lastIndexOf('.') + 2)
                                        : d.chillWaterOutTempSet
                                    : null
                        };
                    });
                }
            } else {
                // 不一样的周期 有可能包含今天
                strategyModalParams.planList =
                    props.queryParams.data.content.length &&
                    props.queryParams.data.content.map((d: any) => {
                        return {
                            isDisabled:
                                getDayjsTz().format('YYYY-MM-DD') == dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')
                                    ? getDayjsTz().format('HH:mm:ss') > d.strategyTime
                                        ? true
                                        : false
                                    : false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            chillWaterOutTempSet:
                                d.runStatus == 'OPEN'
                                    ? d.chillWaterOutTempSet
                                        ? d.chillWaterOutTempSet.substring(0, d.chillWaterOutTempSet.lastIndexOf('.') + 2)
                                        : d.chillWaterOutTempSet
                                    : null
                        };
                    });
            }
        }
    }
};

// 取消弹框
const close = () => {
    strategyModalParams.showModal = false;
    nextTick(() => {
        emits('close');
    });
};

const temkeyup = (type: string, item: any, e: any) => {
    if (!/^-?\d+(\.\d{1})?$/.test(e.target.value) || !e) {
        if (type == 'tem') {
            item.chillWaterOutTempSet !== null && (item.chillWaterOutTempSet = ('' + item.chillWaterOutTempSet).slice(0, -1));
        } else {
            item.sustainTime !== null && (item.sustainTime = ('' + item.sustainTime).slice(0, -1));
        }
    }
};

const handleKeyDown = (item: any, event: any) => {};

const InputChange = (type: string, item: any, event: any) => {
    if (type == 'tem') {
        if (event) {
            const inputValue = event; // 获取输入内容
            const regex = /^-?\d+(\.\d{1})?$/; // 正则表达式规则

            if (!regex.test(inputValue)) {
                // eslint-disable-next-line no-param-reassign
                event = item.chillWaterOutTempSet; // 将输入内容恢复到之前的有效值
            } else {
                item.chillWaterOutTempSet = inputValue; // 更新输入框的值
            }
        }
    } else if (type == 'suTime') {
        if (event) {
            const inputValue = event; // 获取输入内容
            const regex = /^-?\d+(\.\d{1})?$/; // 正则表达式规则
            if (!regex.test(inputValue)) {
                // eslint-disable-next-line no-param-reassign
                event = item.sustainTime; // 将输入内容恢复到之前的有效值
            } else {
                item.sustainTime = inputValue; // 更新输入框的值
            }
        }
    }
    strategyModalParams.hasChange = true;
};

watch(
    strategyModalParams.planList,
    (newValue, oldValue) => {
        console.log('Array changed:', newValue);
    },
    { deep: true }
);

// 取消
const closeModal = () => {
    if (strategyModalParams.hasChange) {
        strategyModalParams.showleave = true;
    } else {
        close();
    }
};

// 确认二次弹框
const submitStrate = () => {
    strategyModalParams.showleave = false;
    close();
};

// 取消二次弹框
const closeStrate = () => {
    strategyModalParams.showleave = false;
};
</script>
<style lang="less">
.cool-create-strategy {
    font-family: Microsoft YaHei UI;

    [class*='m-col-'] {
        padding: 0 10px;
    }

    .m-modal-main-content {
        display: flex;
        padding: 20px 24px 0 24px !important;

        .content-left {
            flex: 1;

            .page-prompts {
                margin-bottom: 8px;
                padding: 10px 16px;
                border-radius: 4px;
                background: var(--palette-blue-100, #d9ebff);
                color: var(--grey-grey-900, #1b2129);
                text-align: center;
                font-family: Microsoft YaHei UI;
                font-size: 14px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
                line-height: normal;

                .prompts {
                    cursor: pointer;
                    color: #246fe5;
                }
            }

            .left-text {
                color: #1b2129;
                font-size: 14px;
                line-height: 22px;
                font-family: Microsoft YaHei UI;
            }

            .left-delete {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 4px;
                cursor: pointer;
                position: absolute;
                top: 16px;
                right: 16px;

                &:hover {
                    background: rgba(196, 201, 207, 0.3);
                }
            }

            .left-delete-disabled {
                cursor: not-allowed;

                &:hover {
                    background: none;
                }
            }

            .date-text {
                margin-left: 8px;
                color: var(--grey-grey-600, #626c78);
                font-feature-settings: 'clig' off, 'liga' off;
                font-family: Microsoft YaHei UI;
                font-size: 12px;
                font-style: normal;
                font-weight: var(--platform-font-weight);
            }
        }

        .plan-box-row {
            position: relative;
        }
    }

    .plan-box {
        width: 100%;
        height: 100%;
        font-family: Microsoft YaHei UI;

        &-row {
            background: #f1f4f6;
            border-radius: 4px;
            padding: 16px 16px 0;
        }

        &-add {
            // width: 92px;
            height: 32px;
            color: var(--blue-500);
            margin-top: 16px;
            cursor: pointer;
            user-select: none;

            i {
                margin-right: 8px;
            }
        }

        .plan-box-row + .plan-box-row {
            margin-top: 12px;
        }

        .plan-box-item {
            position: relative;

            .cooler {
                display: flex;

                .m-form-item {
                    margin-bottom: 0;

                    .m-select-inner {
                        min-width: 83px;
                    }
                }
            }

            .m-row {
                .m-form-item__label {
                    padding-right: 0;
                    color: var(--gray-900);
                }
            }

            .m-time-picker,
            .m-time-picker-trigger {
                width: 100%;
            }

            .m-radio {
                font-size: 14px;
            }

            .fc-radio {
                width: 100%;
                height: 30px;
            }

            .select-span {
                display: inline-block;
                width: 30px;
                font-family: Microsoft YaHei UI;
                font-size: 14px;
                text-align: center;
            }
        }

        .plan-box-delete {
            cursor: pointer;
        }

        .item-label {
            color: var(--gray-600, #626c78);
            font-size: 14px;
            margin-bottom: 4px;
        }
    }
}

.confirmBtn {
    padding: 0 !important;
}

.m-modal-bg .m-modal-main .CoolStrategyModal {
    max-height: calc(100vh - 255px);
    height: calc(100vh - 250px);
    overflow: hidden;

    .m-date-picker__result_text {
        font-family: Microsoft YaHei UI;
    }

    .m-form-item__label {
        font-family: Microsoft YaHei UI;
        width: 103px;
    }

    .picker .m-form-item__error {
        margin-left: 14px;
    }

    .m-time-picker-trigger-center {
        font-family: Microsoft YaHei UI;
    }

    .m-select-inner-value {
        font-family: Microsoft YaHei UI;
    }

    .inputInner {
        font-family: Microsoft YaHei UI;
    }

    .m-row {
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>
