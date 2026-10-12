<!--  -->
<template>
    <m-modal
        v-model:visible="strategyModalParams.showModal"
        :append-to="$modalAppendTo"
        :content-class-name="'strategyModal'"
        type="default"
        :width="1260"
        :auto-close="false"
        modal-class-name="create-strategy"
        :title="strategyModalParams.titleModal"
        @close="closeModal"
    >
        <template #content>
            <div v-loading="strategyModalParams.loading" class="content-left" element-loading-lottiename="circle">
                <m-form ref="Mform" :key="new Date()" style="height: 100%" :rules="rules" label-width :model="strategyModalParams" label-position="right">
                    <m-form-item v-if="props.queryParams.type == '0'" :label="i18n.global.t('meos_control_web.schedule_object')">
                        <span class="left-text">{{ props.queryParams.systemName || '--' }}</span>
                    </m-form-item>
                    <m-form-item v-else :label="i18n.global.t('meos_control_web.schedule_object')" require-asterisk-position="right" prop="policy">
                        <m-select
                            v-model="strategyModalParams.policy"
                            :options="strategyModalParams.policyList"
                            :size="320"
                            :placeholder="i18n.global.t('meos_control_web.please_select_chilled_water_pump_group')"
                            @change="InputChange"
                        />
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
                            class="strategy-picker"
                            :scope="`${getDayjsTz().format('YYYY.MM.DD')} - ${getDayjsTz().add(1, 'year').format('YYYY.MM.DD')}`"
                            :width="256"
                            style="margin-left: 14px"
                            type="daterange"
                            :placeholder="i18n.global.t('meos_control_web.start_time_to_end_time')"
                            @change="pickerChange"
                        />
                    </m-form-item>
                    <div class="m-form-item" style="height: calc(100% - 110px)">
                        <label class="m-form-item__label" :style="{ 'align-items': 'flex-start' }" style="padding-right: 8px">
                            {{ i18n.global.t('meos_control_web.operation_schedule') }}
                            <span class="m-form-item__label-required m-form-item__label-required-left" style="margin-left: 4px">*</span>
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
                                                        :style="{ width: '218px' }"
                                                        :scope-time="
                                                            strategyModalParams.date &&
                                                            getDayjsTz().format('YYYY-MM-DD') == dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD')
                                                                ? `${getDayjsTz().add(1, 'minute').format('HH:mm')}-23:59`
                                                                : `00:00-23:59`
                                                        "
                                                        :step-m="5"
                                                        :disabled="item.isDisabled"
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
                                                            <m-radio label="OPEN" :disabled="item.isDisabled" style="--margin: 20px">{{
                                                                i18n.global.t('common.operation')
                                                            }}</m-radio>
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
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.chiller_unit_count_colon') }}</div>
                                                <template v-if="strategyModalParams.minChillersNumber === 0">
                                                    <m-form-item
                                                        style="margin-right: 32px"
                                                        prop="`item.${index}.chillerLNum`"
                                                        :item-model="item.chillerLNum ? item.chillerLNum + '' : item.chillerLNum"
                                                        require-asterisk-position="''"
                                                        :rules="[{ required: true,
                                                        validator: (value:any, rule:any, callback:any) => validateChillersNumber(item, callback, index),
                                                        trigger: ['blur','change']
                                                    }]"
                                                    >
                                                        <m-input-number
                                                            v-model="item.chillerLNum"
                                                            :disabled="item.isDisabled"
                                                            text-align="left"
                                                            width="160"
                                                            :min="0"
                                                            :max="Number(strategyModalParams.chillersNumber)"
                                                            :step="0"
                                                            precision="0"
                                                            :placeholder="i18n.global.t('common.placeholder_input')"
                                                            controls="rightButton"
                                                        >
                                                            <template #suffix>{{ i18n.global.t('common.tai') }}</template>
                                                        </m-input-number>
                                                    </m-form-item>
                                                </template>
                                                <template v-else>
                                                    <m-form-item style="margin-right: 32px">
                                                        <div class="cooler">
                                                            <m-form-item
                                                                :prop="`item.${index}.chillerLNum`"
                                                                :item-model="item.chillerLNum"
                                                                label-width="0px"
                                                                :rules="[
                                                                { required: true, message: EMPTYTEXT, trigger: 'change' },
                                                                { validator: (value:any,rule:any,callback:any) => validateChillerNum(item,callback,index), trigger: ['change'] }
                                                            ]"
                                                            >
                                                                <m-select
                                                                    v-model="item.chillerLNum"
                                                                    :size="70"
                                                                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                                                                    controls="operatorIcon"
                                                                    :disabled="item.isDisabled"
                                                                    :options="strategyModalParams.largeCoolerList"
                                                                    :is-show-empty="strategyModalParams.largeCoolerList.length ? false : true"
                                                                    @change="InputChange"
                                                                >
                                                                    <template #empty>
                                                                        <div class="m-select-menu-empty">{{ i18n.global.t('meos_control_web.no_chiller') }}</div>
                                                                    </template>
                                                                </m-select>
                                                                <span class="select-span">{{ i18n.global.t('common.large') }}</span>
                                                            </m-form-item>
                                                            <m-form-item
                                                                :prop="`item.${index}.chillerSNum`"
                                                                :item-model="item.chillerSNum"
                                                                label-width="0px"
                                                                :rules="[
                                                                { required: true, message: EMPTYTEXT, trigger: 'change' },
                                                                {
                                                                validator: (value:any, rule:any, callback:any) => validateChillerNum(item, callback, index),
                                                                trigger: ['change']
                                                                }
                                                            ]"
                                                            >
                                                                <m-select
                                                                    v-model="item.chillerSNum"
                                                                    :disabled="item.isDisabled"
                                                                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                                                                    controls="operatorIcon"
                                                                    :size="70"
                                                                    :options="strategyModalParams.smallCoolerList"
                                                                    :is-show-empty="strategyModalParams.smallCoolerList.length ? false : true"
                                                                    @change="InputChange"
                                                                >
                                                                    <template #empty>
                                                                        <div class="m-select-menu-empty">{{ i18n.global.t('meos_control_web.no_chiller') }}</div>
                                                                    </template></m-select
                                                                >
                                                                <span class="select-span">{{ i18n.global.t('common.small') }}</span>
                                                            </m-form-item>
                                                        </div>
                                                    </m-form-item>
                                                </template>
                                            </div>
                                            <div>
                                                <div class="item-label">{{ i18n.global.t('meos_control_web.chilled_water_outlet_temp_setpoint_colon') }}</div>
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
                                                    >
                                                        <template #suffix>°C</template>
                                                    </m-input-number>
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
            <ContentRight :query-params="queryParams" :min-chillers-number="strategyModalParams.minChillersNumber" />
            <!-- 覆盖策略弹框 -->
            <m-modal
                v-model:visible="strategyModalParams.confirmStrategyState"
                :append-to="$modalAppendTo"
                type="info"
                :title="i18n.global.t('meos_control_web.submit_will_override_policy')"
                :content="i18n.global.t('meos_control_web.fixed_time_strategy_exists_confirm_override')"
                @close="close"
            >
                <template #footer>
                    <m-button type="default" size="medium" @click="cancelStrategy">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button id="addFixedTimeStrategy" class="confirmBtn" type="primary" size="medium" @click="confirmStrategy">{{
                        i18n.global.t('meos_control_web.confirm_submit')
                    }}</m-button>
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
/*eslint-disable eqeqeq*/
import { IconMeriActionDelete, IconMeriComponentButtonAdd } from 'meri-icon';
import { EMPTYTEXT, getDayjsTz } from '@/utils/globalVariables';
import ContentRight from './ContentRight.vue';
import { $Message } from 'meri-plus';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import {
    listStrategyObject,
    addFixedTimeStrategy,
    chillerStrategyAddFixedTimeStrategy,
    getCooler,
    updateFixedTimeStrategy,
    editFixedTimeStrategy,
    listBranchDateType,
    checkFixedStrategy
} from '@/apis/strategic';
import { uniqueId } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import { CLASSCODE } from '../operationMonitoring/coolVariables';
import i18n from '@/localization';

const props = defineProps(['queryParams']);
const emits = defineEmits(['close', 'getListFixedStrategyDateByMonth']);
const scrollbarRef = ref(); // 添加时间滚动条
const strategyModalParams = reactive({
    loading: true,
    isDisabled: false,
    showModal: true, // 弹框
    titleModal: '', // 弹框标题
    smallCoolerList: [] as any, // 弹框冷机台数下拉框 小
    largeCoolerList: [] as any, // 弹框冷机台数下拉框 大
    policyList: [] as any, // 泵组策略对象列表
    policy: '', // 策略对象
    date: '', // 生效日
    chillersNumber: null,
    minChillersNumber: null,
    strategyId: '',
    planList: [
        {
            strategyTime: '',
            runStatus: 'OPEN',
            chillerLNum: '',
            chillerSNum: '',
            sustainTime: null,
            chillWaterOutTempSet: null,
            id: uniqueId('plan')
        }
    ] as any,
    paramsPlanlist: [] as any, // 传给后端的列表参数
    confirmStrategyState: false, // 覆盖策略弹框状态
    confirmparams: {}, // 覆盖策略参数
    hasChange: false, // 是否修改
    showleave: false // 退出
});

const Mform = ref(); // 表单

// 冷机台数
const validateChillerNum = (item: any, callback: (avg?: any) => void, index: number) => {
    //   if (item.chillerLNum === '0' && item.chillerSNum === '0') {
    //     callback(new Error('冷机台数不可全为0'))
    //   } else {
    Mform.value.clearValidate([`item.${index}.chillerLNum`, `item.${index}.chillerSNum`]);
    callback();
    //   }
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
const validateTimePicker = (item: any, callback: (avg?: any) => void, index: number) => {
    let timeArr = ref([] as any);
    strategyModalParams.planList.length &&
        strategyModalParams.planList.map((p: any) => {
            timeArr.value.push(p.strategyTime);
        });
    if (checkDuplicate(timeArr.value, item.strategyTime)) {
        callback(new Error(i18n.global.t('meos_control_web.time_already_selected_please_check')));
    } else if (
        props.queryParams.name === 'add' &&
        getDayjsTz().format('YYYY-MM-DD') == dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD') &&
        item.strategyTime < getDayjsTz().add(1, 'minute').format('HH:mm')
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
const validateChillersNumber = (item: any, callback: (avg?: any) => void, index: number) => {
    if (item.chillerLNum == null) {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_3')));
    } else {
        callback();
    }
};
//
const validateTempSet = (item: any, callback: (avg?: any) => void, index: number) => {
    if (item.chillWaterOutTempSet == null) {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_3')));
    } else {
        callback();
    }
};

const validateSustainTime = (item: any, callback: (avg?: any) => void, index: number) => {
    if (item.sustainTime == null) {
        callback(new Error(i18n.global.t('meos_control_web.input_required_check_error_3')));
    } else {
        callback();
    }
};

const rules = ref({
    policy: [{ required: true, message: EMPTYTEXT, trigger: 'change' }]
});
const height = ref('100%');

// 查询策略对象下拉列表
const getListStrategyObject = () => {
    strategyModalParams.policyList = [];
    strategyModalParams.policy = '';
    listStrategyObject({
        systemId: props.queryParams.systemId,
        systemType: CLASSCODE()
    }).then((res: any) => {
        strategyModalParams.loading = false;
        const { code, data, result } = res;
        if (result !== 'success') return;
        data &&
            data.length &&
            data.map((item: any) => {
                strategyModalParams.policyList.push({
                    id: `${item.id}/${item.expandField ? item.expandField.infoCodeSetType : ''}/${item.expandField ? item.expandField.infoCodeUnit : ''}`,
                    name: item.localName ?? '--',
                    dynamicName: item.dynamicName
                });
            });
        strategyModalParams.policy = strategyModalParams.policyList.length ? strategyModalParams.policyList[0].id : '';
        if (props.queryParams.name == 'edit') {
            formatterParams('1');
        }
    });
};

// 设置标题
const formatterTitle = () => {
    const { name, type } = props.queryParams;
    queryCooler(name, type);
    if (type == '1') {
        getListStrategyObject();
        // getListBranchDateType()
        name == 'edit'
            ? (strategyModalParams.titleModal = i18n.global.t('meos_control_web.edit_terminal_pump_schedule'))
            : (strategyModalParams.titleModal = i18n.global.t('meos_control_web.create_new_end_pump_group_schedule'));
    } else {
        name == 'edit'
            ? (strategyModalParams.titleModal = i18n.global.t('meos_control_web.edit_chiller_plant_schedule'))
            : (strategyModalParams.titleModal = i18n.global.t('meos_control_web.create_new_chiller_plant_schedule'));
    }
};

// 编辑参数转换
const formatterParams = (status: string) => {
    const { name, type, systemName, systemId, data } = props.queryParams;
    console.log(data.objectLocalName, strategyModalParams, 'item.name');
    strategyModalParams.policyList.length &&
        strategyModalParams.policyList.map((item: any) => {
            if (data.objectLocalName == item.dynamicName) {
                strategyModalParams.policy = item.id;
            }
        });
    if (status === '1') {
        strategyModalParams.date = `${dayjs(data.strategy[0].strategyTime).format('YYYY.MM.DD')}-${dayjs(data.strategy[0].strategyTime).format('YYYY.MM.DD')}`;
        emitter.emit('changeDaterange', strategyModalParams.date);
        strategyModalParams.planList =
            data.strategy.length &&
            data.strategy.map((d: any) => {
                strategyModalParams.strategyId = d.strategyId;
                if (d.branchDateType && d.branchDateType == strategyModalParams.policy.split('/')[1]) {
                    console.log('不等于');
                    return {
                        isDisabled:
                            getDayjsTz().format('YYYY-MM-DD') == dayjs(d.strategyTime).format('YYYY-MM-DD')
                                ? getDayjsTz().add(1, 'minute').format('HH:mm:ss') > dayjs(d.strategyTime).format('HH:mm:ss')
                                    ? true
                                    : false
                                : false,
                        branchDateDataUnit: d.branchDateDataUnit,
                        branchDateType: d.branchDateType,
                        strategyId: d.strategyId,
                        id: uniqueId('plan'),
                        strategyTime: d.strategyTime.slice(11, 16),
                        runStatus: d.runStatus,
                        chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.branchDateData ? Math.floor(d.branchDateData * 10) / 10 : d.branchDateData) : null
                    };
                } else {
                    console.log('不等于');
                    return {
                        isDisabled:
                            getDayjsTz().format('YYYY-MM-DD') == dayjs(d.strategyTime).format('YYYY-MM-DD')
                                ? getDayjsTz().add(1, 'minute').format('HH:mm:ss') > dayjs(d.strategyTime).format('HH:mm:ss')
                                    ? true
                                    : false
                                : false,
                        branchDateDataUnit: d.branchDateDataUnit,
                        branchDateType: d.branchDateType,
                        strategyId: d.strategyId,
                        id: uniqueId('plan'),
                        strategyTime: d.strategyTime.slice(11, 16),
                        runStatus: d.runStatus,
                        sustainTime: d.sustainTime,
                        chillWaterOutTempSet: null
                    };
                }
            });
    } else {
        strategyModalParams.date = `${dayjs(data.dateTime).format('YYYY.MM.DD')}-${dayjs(data.dateTime).format('YYYY.MM.DD')}`;
        emitter.emit('changeDaterange', strategyModalParams.date);
        strategyModalParams.planList =
            data.content.length &&
            data.content.map((d: any) => {
                strategyModalParams.strategyId = d.strategyId;
                return {
                    isDisabled:
                        getDayjsTz().format('YYYY-MM-DD') == dayjs(data.dateTime).format('YYYY-MM-DD')
                            ? getDayjsTz().add(1, 'minute').format('HH:mm:ss') > d.strategyTime
                                ? true
                                : false
                            : false,
                    strategyId: d.strategyId,
                    id: uniqueId('plan'),
                    strategyTime: d.strategyTime.slice(0, 5),
                    chillerSNum: d.runStatus == 'OPEN' ? (d.chillerSNum ? d.chillerSNum + '' : '0') : null,
                    chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                    runStatus: d.runStatus,
                    sustainTime: d.runStatus == 'OPEN' ? d.sustainTime : null,
                    chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.chillWaterOutTempSet ? Math.floor(d.chillWaterOutTempSet * 10) / 10 : d.chillWaterOutTempSet) : null
                };
            });
        strategyModalParams.loading = false;
    }
};

// 查询冷机数量
const queryCooler = (name: string, type: string) => {
    strategyModalParams.largeCoolerList = [];
    strategyModalParams.smallCoolerList = [];
    strategyModalParams.chillersNumber = null;
    strategyModalParams.minChillersNumber = null;
    getCooler({
        systemId: props.queryParams.systemId
    }).then((res: any) => {
        const { code, data, result } = res;
        if (result !== 'success') return;
        if (data && data.large_cooler) {
            strategyModalParams.chillersNumber = data.large_cooler;
            strategyModalParams.minChillersNumber = data.small_cooler;
            for (let i = 0; i <= data.large_cooler; i++) {
                strategyModalParams.largeCoolerList.push({
                    id: i + '',
                    name: i + ''
                });
            }
        } else {
            strategyModalParams.largeCoolerList.push({
                id: '0',
                name: '0'
            });
        }
        if (data && data.small_cooler) {
            for (let i = 0; i <= data.small_cooler; i++) {
                strategyModalParams.smallCoolerList.push({
                    id: i + '',
                    name: i + ''
                });
            }
        } else {
            strategyModalParams.smallCoolerList.push({
                id: '0',
                name: '0'
            });
        }
        if (name == 'edit') {
            formatterParams(type);
        } else {
            strategyModalParams.loading = false;
        }
    });
};

// 确定
const submit = () => {
    Mform.value.validate((valid: boolean, error: any) => {
        console.log(valid);
        console.log(error);
        if (valid) {
            strategyModalParams.isDisabled = true;
            strategyModalParams.paramsPlanlist = [];
            if (props.queryParams.type == '1') {
                strategyModalParams.paramsPlanlist = strategyModalParams.planList.map((item: any) => {
                    return {
                        strategyTime: item.strategyTime + ':00',
                        runStatus: item.runStatus,
                        branchDateType: strategyModalParams.policy.split('/')[1],
                        sustainTime: item.sustainTime,
                        branchDateData: item.runStatus == 'OPEN' ? item.chillWaterOutTempSet : null
                    };
                });
                let data = {
                    strategyId: strategyModalParams.strategyId,
                    systemId: props.queryParams.systemId,
                    objectId: strategyModalParams.policy.split('/')[0],
                    strategyPlans: strategyModalParams.paramsPlanlist,
                    beginDate: dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD'),
                    endDate: dayjs(strategyModalParams.date.split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
                };
                if (props.queryParams.name == 'edit') {
                    strategyApi('edit', editFixedTimeStrategy, data);
                } else {
                    queryCheckFixedStrategy(data);
                }
            } else {
                strategyModalParams.paramsPlanlist = strategyModalParams.planList.map((item: any) => {
                    return {
                        strategyTime: item.strategyTime + ':00',
                        runStatus: item.runStatus,
                        sustainTime: item.sustainTime,
                        chillerSNum: item.runStatus == 'OPEN' ? (item.chillerSNum ? item.chillerSNum + '' : '0') : null,
                        chillerLNum: item.runStatus == 'OPEN' ? (item.chillerLNum ? item.chillerLNum + '' : '0') : null,
                        chillWaterOutTempSet: item.runStatus == 'OPEN' ? item.chillWaterOutTempSet : null
                    };
                });

                let data = {
                    systemId: props.queryParams.systemId,
                    objectId: props.queryParams.systemId,
                    strategyId: strategyModalParams.strategyId,
                    strategyPlans: strategyModalParams.paramsPlanlist,
                    beginDate: dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD'),
                    endDate: dayjs(strategyModalParams.date.split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
                };
                if (props.queryParams.name == 'edit') {
                    strategyApi('edit', updateFixedTimeStrategy, data);
                } else {
                    queryCheckFixedStrategy(data);
                }
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
                    console.log(api, params, 'props.queryParams.type');
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

// 校验固定时间策略
const queryCheckFixedStrategy = (params: any) => {
    checkFixedStrategy({
        businessType: props.queryParams.type == '1' ? 'LAST_FREEZE_PUMP_GROUP' : 'CHILLER_UNIT',
        isCheckDateRange: true,
        systemId: props.queryParams.systemId,
        objectId: props.queryParams.type == '1' ? strategyModalParams.policy.split('/')[0] : props.queryParams.systemId,
        beginDate: dayjs(strategyModalParams.date.split('-')[0]).format('YYYY-MM-DD'),
        endDate: dayjs(strategyModalParams.date.split('-')[1]).add(1, 'day').format('YYYY-MM-DD')
    }).then(res => {
        const { code, data, result } = res;
        if (result == 'success' && data && (data as any).isExistsStrategyInDateRange == true) {
            // 有 弹框确认
            strategyModalParams.confirmStrategyState = true;
            strategyModalParams.confirmparams = params;
        } else {
            if (props.queryParams.type == '1') {
                strategyApi('add', addFixedTimeStrategy, params);
            } else {
                strategyApi('add', chillerStrategyAddFixedTimeStrategy, params);
            }
        }
    });
};

// 覆盖策略弹框取消
const cancelStrategy = () => {
    strategyModalParams.isDisabled = false;
    strategyModalParams.confirmStrategyState = false;
};

// 覆盖策略弹框确认
const confirmStrategy = () => {
    strategyModalParams.confirmStrategyState = false;
    if (props.queryParams.type == '1') {
        strategyApi('add', addFixedTimeStrategy, strategyModalParams.confirmparams);
    } else {
        strategyApi('add', chillerStrategyAddFixedTimeStrategy, strategyModalParams.confirmparams);
    }
};

// 点击删除icon
const deleteFun = (index: number) => {
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
        chillerSNum: '',
        sustainTime: null,
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
    nextTick(() => {
        // const dom: Element | null = document.querySelector('.create-strategy .m-modal-main-content')
        // if (dom) {
        //     height.value = `${dom?.clientHeight - (props.tabModel === '2' ? 130 : 117)}px`
        // }
    });
});

// 生效时间change
const pickerChange = (data: any) => {
    strategyModalParams.hasChange = true;
    emitter.emit('changeDaterange', strategyModalParams.date);
    if (props.queryParams.name == 'edit') {
        if (props.queryParams.type == '1') {
            if (dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD') == dayjs(unref(data).split('-')[1]).format('YYYY-MM-DD')) {
                if (getDayjsTz().format('YYYY-MM-DD') == dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')) {
                    console.log('shijintian ');
                    strategyModalParams.planList = props.queryParams.data.strategy.map((d: any) => {
                        return {
                            isDisabled: getDayjsTz().add(1, 'minute').format('HH:mm:ss') > dayjs(d.strategyTime).format('HH:mm:ss') ? true : false,
                            branchDateDataUnit: d.branchDateDataUnit,
                            branchDateType: d.branchDateType,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(11, 16),
                            runStatus: d.runStatus,
                            chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.branchDateData ? Math.floor(d.branchDateData * 10) / 10 : d.branchDateData) : null
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
                            chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.branchDateData ? Math.floor(d.branchDateData * 10) / 10 : d.branchDateData) : null
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
                                    ? getDayjsTz().add(1, 'minute').format('HH:mm:ss') > dayjs(d.strategyTime).format('HH:mm:ss')
                                        ? true
                                        : false
                                    : false,
                            branchDateDataUnit: d.branchDateDataUnit,
                            branchDateType: d.branchDateType,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(11, 16),
                            runStatus: d.runStatus,
                            chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.branchDateData ? Math.floor(d.branchDateData * 10) / 10 : d.branchDateData) : null
                        };
                    });
            }
        } else {
            if (dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD') == dayjs(unref(data).split('-')[1]).format('YYYY-MM-DD')) {
                if (getDayjsTz().format('YYYY-MM-DD') == dayjs(unref(data).split('-')[0]).format('YYYY-MM-DD')) {
                    console.log('shijintian ');
                    strategyModalParams.planList = props.queryParams.data.content.map((d: any) => {
                        return {
                            isDisabled: getDayjsTz().add(1, 'minute').format('HH:mm:ss') > d.strategyTime ? true : false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            chillerSNum: d.runStatus == 'OPEN' ? (d.chillerSNum ? d.chillerSNum + '' : '0') : null,
                            chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.chillWaterOutTempSet ? Math.floor(d.chillWaterOutTempSet * 10) / 10 : d.chillWaterOutTempSet) : null
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
                            chillerSNum: d.runStatus == 'OPEN' ? (d.chillerSNum ? d.chillerSNum + '' : '0') : null,
                            chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.chillWaterOutTempSet ? Math.floor(d.chillWaterOutTempSet * 10) / 10 : d.chillWaterOutTempSet) : null
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
                                    ? getDayjsTz().add(1, 'minute').format('HH:mm:ss') > d.strategyTime
                                        ? true
                                        : false
                                    : false,
                            strategyId: d.strategyId,
                            id: uniqueId('plan'),
                            strategyTime: d.strategyTime.slice(0, 5),
                            chillerSNum: d.runStatus == 'OPEN' ? (d.chillerSNum ? d.chillerSNum + '' : '0') : null,
                            chillerLNum: d.runStatus == 'OPEN' ? (d.chillerLNum ? d.chillerLNum + '' : '0') : null,
                            runStatus: d.runStatus,
                            sustainTime: d.sustainTime,
                            chillWaterOutTempSet: d.runStatus == 'OPEN' ? (d.chillWaterOutTempSet ? Math.floor(d.chillWaterOutTempSet * 10) / 10 : d.chillWaterOutTempSet) : null
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
            item.chillWaterOutTempSet = ('' + item.chillWaterOutTempSet).slice(0, -1);
        } else {
            item.sustainTime = ('' + item.sustainTime).slice(0, -1);
        }
    }
};

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
.create-strategy {
    font-family: Microsoft YaHei UI;
    [class*='m-col-'] {
        padding: 0 10px;
    }
    .m-modal-main-content {
        display: flex;
        padding: 20px 24px 0 24px !important;

        .content-left {
            flex: 1;
            padding-right: 16px;
            border-right: 1px solid var(--gray-300, #e1e5eb);
            .left-text {
                color: #1b2129;
                font-size: 14px;
                line-height: 22px;
                margin-left: 18px;
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
.m-modal-bg .m-modal-main .strategyModal {
    max-height: calc(100vh - 350px);
    height: calc(100vh - 350px);
    overflow: hidden;
    .m-date-picker__result_text {
        font-family: Microsoft YaHei UI;
    }
    .m-form-item__label {
        font-family: Microsoft YaHei UI;
    }
    .content-left {
        .m-date-picker {
            margin-left: 34px !important;
        }
        .picker .m-form-item__error {
            margin-left: 34px;
        }
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
