<template>
    <div class="parameterSetting">
        <template v-for="(item, index) in list.relInfoCodeConfigs" :key="index">
            <div class="setting-item">
                <div class="pd pd-class">
                    <div class="fb">
                        <div style="flex: 1; padding-top: 3px">
                            <div v-if="item.relInfoCodeConfig" class="f14 single-row" style="margin-right: 8px">
                                <div class="mr10 ft2 text-name" style="max-width: 70%">
                                    {{ item.relInfoCodeConfig.infoCodeName + ':' }}
                                </div>
                                <div
                                    style="cursor: default; max-width: 30%"
                                    class="text-name-item"
                                    @mousemove="e => openTimeFun(e, item.relInfoCodeConfig)"
                                    @mouseleave="closeTimeFun"
                                >
                                    {{ getValueStr(item.relInfoCodeConfig).text }}
                                </div>
                            </div>
                            <div v-else class="f14 single-row" style="margin-right: 8px">
                                <div class="mr10 ft2 text-name" style="max-width: 70%">
                                    {{ item.infoCodeName + ':' }}
                                </div>
                                <div style="cursor: default; max-width: 30%" class="text-name-item" @mousemove="e => openTimeFun(e, item)" @mouseleave="closeTimeFun">
                                    {{ getValueStr(item).text }}
                                </div>
                            </div>
                            <div v-if="item.infoCode != 'manualAutoSet' && getInfoItem(item)?.additionalMapValue?.recoveryDateTime && isEdge()" class="f12">
                                <SetDiv style="color: #246fe5" class="cp" @click="(el, e) => showTime(item, e, '4')">
                                    {{ dayjs(getInfoItem(item)?.additionalMapValue?.recoveryDateTime).format('YYYY.MM.DD HH:mm') }}
                                </SetDiv>

                                <span class="ml5">{{ i18n.global.t('meos_control_web.as_of') }}</span>
                                <span class="flight cp ml8" @click="e => disintervention(item, e)">{{ i18n.global.t('meos_control_web.release_intervention') }}</span>
                            </div>
                            <!-- 强制控制，开关 -->
                            <div v-if="isEdge() && forceControlList(item)?.length > 0" class="f12 fc">
                                <span class="text-name ft2">{{ i18n.global.t('meos_control_web.forced_control') }}</span>
                                <SetDiv no-height>
                                    <m-switch v-model="forceCtlRecord[item.infoCode]" :disabled="!base.hasAuth(PERMISSION)" size="small"></m-switch>
                                </SetDiv>
                            </div>
                        </div>
                        <div>
                            <!-- 自动 手动 -->
                            <div v-if="item.dataSource?.length && item.infoCode == 'manualAutoSet'" class="fc right-status">
                                <div v-for="ite in item.dataSource" :key="ite.code" class="radio-box-item ml16" @click="e => change(e, ite, item)">
                                    <m-tips :content="getDisabledTips(item)" :disabled="!getDisabledTips(item)" theme="darkTransparent" placement="right-start" trigger="hover">
                                        <m-radio
                                            :disabled="disableControls || isForceCtlOpened(item)"
                                            :label="ite.code"
                                            :size="14"
                                            :model-value="ite.code === getInfoItem(item)?.dataValue ? 'checked' : 'uncheck'"
                                            >{{ ite.name }}</m-radio
                                        >
                                        <!-- :model-value="ite.code === getInfoItem(item).dataValue ? 'checked' : 'uncheck'" -->
                                    </m-tips>
                                </div>
                            </div>
                            <!-- 按钮 -->
                            <div v-if="item.dataSource?.length && item.infoCode !== 'manualAutoSet'" class="action-content f right-status">
                                <!-- :disabled="!base.hasAuth('xprunairterminaleqcontrol') || disableControls" -->
                                <m-tips
                                    v-for="(io, iv) in item.dataSource"
                                    :key="iv"
                                    :content="getDisabledTips(item)"
                                    :disabled="!getDisabledTips(item)"
                                    theme="darkTransparent"
                                    placement="right-start"
                                    trigger="hover"
                                >
                                    <m-button
                                        :class="[item.dataSource?.length >= 4 ? 'mb4' : '', 'btn', 'ml4', 'cp', 'fc', 'f14']"
                                        size="small"
                                        class="add-btn"
                                        :disabled="disableControls || isForceCtlOpened(item) || isAutoDisabled"
                                        @click="e => handle(item, io, e)"
                                    >
                                        {{ io.name }}
                                    </m-button>
                                </m-tips>
                            </div>
                            <!-- 文字按钮 -->
                            <div v-if="!item.dataSource?.length" class="f right-status">
                                <m-tips :content="getDisabledTips(item)" :disabled="!getDisabledTips(item)" theme="darkTransparent" placement="right-start" trigger="hover">
                                    <m-button
                                        v-ellipsis="{ title: item.infoCodeName, disabled: !disableControls && !isForceCtlOpened(item) }"
                                        :disabled="disableControls || isForceCtlOpened(item) || isAutoDisabled"
                                        type="link"
                                        size="small"
                                        @click="e => openSettingPop(item, e)"
                                    >
                                        {{ i18n.global.t('meos_control_web.setpoint') }}
                                    </m-button>
                                </m-tips>
                            </div>
                        </div>
                    </div>
                    <div v-if="getInfoItem(item)?.additionalMapValue?.recoveryDateTime && item.infoCode == 'manualAutoSet' && isEdge()" class="mt4 f12">
                        <SetDiv class="flight cp" @click="(el, e) => showTime(item, e, '3')">{{
                            dayjs(getInfoItem(item)?.additionalMapValue?.recoveryDateTime).format('YYYY.MM.DD HH:mm')
                        }}</SetDiv>
                        <span class="ft1">&nbsp;&nbsp;{{ i18n.global.t('meos_control_web.restore_to_auto_mode') }}</span>
                    </div>
                </div>
            </div>
            <!-- 强制控制项列表， -->
            <template v-if="isForceCtlOpened(item) && isEdge() && forceControlList(item)?.length > 0">
                <SubSettingItem v-for="(sub, idx) in forceControlList(item)" :key="idx" :item="sub"> </SubSettingItem>
            </template>
        </template>
    </div>

    <!-- 设定pop -->
    <m-popover
        ref="settingRef"
        virtual-triggering
        :virtual-ref="settingPopRef"
        class="control-model-pop"
        trigger="manually"
        placement="bottom"
        style="height: auto"
        :is-open="state.showSettingPop"
        @click-event="clickEvent"
    >
        <template #content>
            <div id="qiantao"></div>
            <m-form ref="settingForm" label-width="200px" :model="state.settingObj" label-position="top" :rules="rule.settingRule" require-asterisk-position="right">
                <m-form-item :label="i18n.global.t('meos_control_web.parameter_value')" prop="num">
                    <m-input-number
                        v-model="state.settingObj.num"
                        text-align="left"
                        :placeholder="i18n.global.t('common.placeholder_input')"
                        controls="rightButton"
                        class="has-btn-input-number"
                        width="220px"
                        :precision="state.settingObj?.scale || 1"
                        :step="6"
                    >
                        <template #suffix>
                            {{ state.settingObj.unit }}
                        </template>
                    </m-input-number>
                </m-form-item>
                <m-form-item
                    v-if="model == '1'"
                    :label="i18n.global.t('meos_control_web.end_time')"
                    prop="expireTime"
                    require-asterisk-position="null"
                    :rules="[
                        { required: true, message: EMPTYTEXT, trigger: 'change' },
                        {
                            validator: (_value, _rule, callback) => validateLessNow(state.settingObj.expireTime, callback),
                            trigger: 'change'
                        }
                    ]"
                >
                    <template #label>
                        {{ i18n.global.t('meos_control_web.deadline') }}
                        <span style="color: #f55047">*</span>
                    </template>
                    <m-date-picker
                        v-model="state.settingObj.expireTime"
                        type="datetime"
                        placement="bottomRight"
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :width="220"
                        :popover-attrs="{ arrowOverflow: false, appendTo: '#qiantao' }"
                        :scope="SCOPE5Min()"
                        :time-picker="{ stepM: 5, format: 'hm' }"
                    />
                </m-form-item>
                <m-form-item :label="i18n.global.t('meos_control_web.reason')" prop="reason">
                    <m-input
                        v-model="state.settingObj.reason"
                        type="textarea"
                        :placeholder="i18n.global.t('meos_control_web.please_input_reason')"
                        :maxlength="{ length: 100, errorText: '' }"
                        show-word-limit
                        :width="220"
                        :height="150"
                    />
                </m-form-item>
                <div style="text-align: right; padding-top: 6px">
                    <m-button size="small" @click="editSetting">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" @click="submitSetting">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </m-form>
        </template>
    </m-popover>

    <!-- 开启关闭Pop -->
    <m-popover
        ref="openOrCloseRef"
        virtual-triggering
        :virtual-ref="openOrClosePopRef"
        class="control-model-pop"
        trigger="manually"
        placement="bottom"
        style="height: auto"
        :is-open="state.showOpenOrClosePop"
        @click-event="clickEvent"
    >
        <template #content>
            <m-form ref="openOrCloseForm" label-width="200px" :model="state.isOpenStatus" label-position="top" require-asterisk-position="right">
                <m-form-item
                    v-if="model == '1'"
                    :label="i18n.global.t('meos_control_web.end_time')"
                    prop="expireTime"
                    require-asterisk-position="null"
                    :rules="[
                        { required: true, message: EMPTYTEXT, trigger: 'change' },
                        {
                            validator: (_value, _rule, callback) => validateLessNow(state.isOpenStatus.expireTime, callback),
                            trigger: 'change'
                        }
                    ]"
                >
                    <template #label>
                        {{ i18n.global.t('meos_control_web.end_time') }}
                        <span style="color: #f55047">*</span>
                    </template>
                    <m-date-picker
                        v-model="state.isOpenStatus.expireTime"
                        type="datetime"
                        placement="bottomRight"
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :width="220"
                        :popover-attrs="{ arrowOverflow: false }"
                        :scope="SCOPE5Min()"
                        :time-picker="{ stepM: 5, format: 'hm' }"
                    />
                </m-form-item>
                <m-form-item
                    :label="i18n.global.t('meos_control_web.reason')"
                    prop="reason"
                    require-asterisk-position="null"
                    :rules="[
                        { required: true, message: EMPTYTEXT, trigger: 'blur' },
                        { max: 100, message: i18n.global.t('meos_control_web.max_100_chars'), trigger: ['blur', 'change'] }
                    ]"
                >
                    <template #label>
                        {{ i18n.global.t('meos_control_web.reason') }}
                        <span style="color: #f55047">*</span>
                    </template>
                    <m-input
                        v-model="state.isOpenStatus.reason"
                        :width="220"
                        :type="'textarea'"
                        :maxlength="100"
                        :height="150"
                        :placeholder="i18n.global.t('meos_control_web.please_input_reason')"
                        show-word-limit
                    />
                </m-form-item>
                <div style="text-align: right; padding-top: 6px">
                    <m-button size="small" @click="onOffBtn">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" @click="submitOpenChange">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </m-form>
        </template>
    </m-popover>

    <!-- 切换手自动pop -->
    <m-popover
        ref="controlModelRef"
        virtual-triggering
        :virtual-ref="controlModelPopRef"
        class="control-model-pop1"
        trigger="manually"
        placement="bottom"
        style="height: auto; width: 320px"
        :is-open="state.showControlModelPop"
        @click-event="clickEvent"
    >
        <template #content>
            <template v-if="state.modeType === '1'">
                <div class="popover_header">
                    <IconMeriComponentNotificationInfo size="24" />
                    <div class="popover_cont">
                        {{ i18n.global.t('meos_control_web.confirm_switch_to_auto_mode_after_switch_device_by') }}
                        <div>{{ i18n.global.t('meos_control_web.system_auto_control') }}</div>
                    </div>
                </div>
                <div class="popover_footer">
                    <m-button type="default" size="small" @click="automaticHandCancellation(state.modeType)">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" @click="changeModelAxios">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </template>
            <template v-if="state.modeType === '0' || state.modeType == '3' || state.modeType == '4'">
                <m-form ref="MFormRef" :model="state.modelHand" label-position="top" require-asterisk-position="right">
                    <m-form-item
                        :label="i18n.global.t('meos_control_web.deadline')"
                        prop="expireTime"
                        require-asterisk-position="null"
                        :rules="[
                            { required: true, message: EMPTYTEXT, trigger: 'change' },
                            { validator: (_value, _rule, callback) => validateLessNow(state.modelHand.expireTime, callback), trigger: 'change' }
                        ]"
                    >
                        <template #label>
                            {{ i18n.global.t('meos_control_web.deadline') }}
                            <span style="color: #f55047">*</span>
                        </template>
                        <m-date-picker
                            v-model="state.modelHand.expireTime"
                            :width="220"
                            type="datetime"
                            placement="bottomRight"
                            :placeholder="i18n.global.t('meos_control_web.please_select')"
                            :popover-attrs="{ arrowOverflow: false }"
                            :scope="SCOPE5Min()"
                            :time-picker="{ stepM: 5, format: 'hm' }"
                        />
                    </m-form-item>
                    <m-form-item
                        :label="i18n.global.t('meos_control_web.reason')"
                        prop="operateReason"
                        require-asterisk-position="null"
                        :rules="[
                            { required: true, message: EMPTYTEXT, trigger: 'blur' },
                            { max: 100, message: i18n.global.t('meos_control_web.max_100_chars'), trigger: ['blur', 'change'] }
                        ]"
                    >
                        <template #label>
                            {{ i18n.global.t('meos_control_web.reason') }}
                            <span style="color: #f55047">*</span>
                        </template>
                        <m-input
                            v-model="state.modelHand.operateReason"
                            :width="220"
                            :type="'textarea'"
                            :maxlength="100"
                            :height="150"
                            :placeholder="i18n.global.t('meos_control_web.please_input_reason')"
                            show-word-limit
                        />
                    </m-form-item>
                    <div style="text-align: right; padding-top: 6px">
                        <m-button size="small" @click="automaticHandCancellation(state.modeType)">{{ i18n.global.t('common.cancel') }}</m-button>
                        <m-button type="primary" size="small" @click="changeModelAxios">{{ i18n.global.t('common.confirm') }}</m-button>
                    </div>
                </m-form>
            </template>
        </template>
    </m-popover>

    <!-- 解除干预 -->
    <m-popover
        ref="disinterventionRef"
        virtual-triggering
        :virtual-ref="disinterventionPopRef"
        class="control-model-pop"
        trigger="manually"
        placement="bottom"
        style="height: auto"
        :is-open="state.disinterventionPop"
        @click-event="clickEvent"
    >
        <template #content>
            <div>
                <div class="popover_header">
                    <IconMeriComponentNotificationInfo size="24" />
                    <div class="ft f14 ml12 mt5">
                        <div>{{ i18n.global.t('meos_control_web.confirm_to_del_interupt') }}</div>
                        <div>{{ i18n.global.t('meos_control_web.auto_control_by_space_requirment') }}</div>
                    </div>
                </div>
            </div>
            <div class="popover_footer">
                <m-button type="default" size="small" @click="state.disinterventionPop = false">{{ i18n.global.t('common.cancel') }}</m-button>
                <m-button type="primary" size="small" @click="disinterventionDetermination">{{ i18n.global.t('common.confirm') }}</m-button>
            </div>
        </template>
    </m-popover>
    <m-popover virtual-triggering :virtual-ref="timePopRef" trigger="manually" theme="darkTransparent" :is-open="state.showTimePop" :show-arrow="false">
        <template #content>{{ i18n.global.t('meos_control_web.data_update_time_colon') }}{{ state.time }}</template>
    </m-popover>
</template>
<script setup>
import { reactive } from 'vue';
import { useSuccessMessage, validateLessNow } from '@/utils/tools';
import { CONTROL_API_TYPE, EMPTYTEXT, GET_MENU_CONFIG, SCOPE5Min, SUCCESSCODE } from '@/utils/globalVariables';
import { getValueStr as _getValueStr } from '@/utils/viewUtils';
import { IconMeriComponentNotificationInfo } from 'meri-icon';
import { releaseIntervention, batchSetOperatingParameters, changeManualAutoStatusByObjectId, changeManualExpireTimeByObjectId } from '@/apis/airterminalxplantrunmonitor';
import dayjs from 'dayjs';
import { isEdge } from '@/utils/envUtils';
import emitter from '@/utils/bus';
import SubSettingItem from './SubSettingItem.vue';

import {
    openTimeFunKey,
    closeTimeFunKey,
    showTimeKey,
    disinterventionKey,
    openSettingPopKey,
    handleKey,
    disableControlsKey,
    isAutoDisabledKey,
    getDisabledTipsKey
} from './constant/injectKey';

import { isEmpty } from 'lodash';
import { commonDrawerRootContextKey } from '@/components/common/CommonDrawer/constant';
import DockSingleton from '@/hooks/responsiveDock';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import i18n from '@/localization';
import SetDiv from '../common/SetDiv.vue';
import baseStore from '@/store/baseStore';
const { PERMISSION } = window[GET_MENU_CONFIG]();
const base = baseStore();
const { getIotData } = DockSingleton.getInstance();
const { controlFn, changeInfoCodeExpireTimeFn, releaseIntervention: releaseInterventionApi } = useGeneralControl();
const props = defineProps({
    list: {
        type: Object,
        default: () => {}
    },
    expireTime: {
        type: String,
        default: () => ''
    },
    refresh: {
        type: Function,
        default: () => {}
    },
    selectObj: {
        type: Object,
        default: () => {}
    },
    // 系统ID，需要记录日志的(如热源)用
    systemId: {
        type: String,
        default: ''
    },
    // 是否启用手自动状态为自动时，禁用其它操作
    useAutoDisabled: {
        type: Boolean,
        default: false
    }
});
const settingPopRef = ref({});
const openOrClosePopRef = ref({});
const controlModelPopRef = ref({});
const disinterventionPopRef = ref({});
const openOrCloseForm = ref({});
const settingForm = ref({});
const MFormRef = ref({});
const timePopRef = ref('');
const settingRef = inject('settingRef');
const openOrCloseRef = inject('openOrCloseRef');
const controlModelRef = inject('controlModelRef');
const disinterventionRef = inject('disinterventionRef');
const rule = reactive({
    settingRule: {
        num: { type: 'number', required: true, message: EMPTYTEXT, trigger: 'blur' },
        reason: [
            { required: true, message: EMPTYTEXT, trigger: 'blur' },
            { max: 100, message: i18n.global.t('meos_control_web.max_100_chars'), trigger: ['blur', 'change'] }
        ]
    }
});

const commonDrawerRoot = inject(commonDrawerRootContextKey);

const getInfoItem = infoItem => {
    const infoInDock = commonDrawerRoot?.props?.isSubscriptOnDemand && getIotData ? getIotData(props.selectObj?.id, infoItem.infoCode) : null;

    const refInfo = isEmpty(infoInDock) ? infoItem : infoInDock;

    return refInfo;
};
// const getInfoItem
const getValueStr = infoItem => {
    const infoInDock = commonDrawerRoot?.props?.isSubscriptOnDemand && getIotData ? getIotData(props.selectObj?.id, infoItem.infoCode) : null;

    const refInfo = isEmpty(infoInDock) ? infoItem : infoInDock;

    // if (infoItem.infoCode === 'manualAutoStatus') {
    //     console.log('infoInDock', infoInDock, infoItem);
    // }
    return _getValueStr(refInfo);
};

// 强制控制开关打开记录
const forceCtlRecord = reactive({});

// eslint-disable-next-line vue/no-setup-props-destructure
const state = reactive({
    expireTime: '',
    showSettingPop: false,
    showOpenOrClosePop: false,
    showControlModelPop: false,
    disinterventionPop: false,
    showTimePop: false,
    time: '',
    modeType: '3', //3 结束时间Pop
    settingObj: {
        name: '',
        unit: '',
        num: '',
        reason: '',
        expireTime: '',
        infoCode: '',
        classCode: ''
    },
    isOpenStatus: {
        name: '',
        reason: '',
        expireTime: '',
        infoCode: '',
        value: '',
        classCode: '',
        objId: ''
    },
    modelHand: {
        expireTime: '',
        operateReason: '',
        infoCode: ''
    },
    obj: {},
    objId: props.list.id ? props.list.id : props.selectObj.id,
    equipmentItem: null
});

const objId = computed(() => (props.list.id ? props.list.id : props.selectObj.id));

const model = computed(() => {
    let model = '',
        manualAutoSetItem = props.list.relInfoCodeConfigs?.find(res => res.infoCode === 'manualAutoSet');
    if (manualAutoSetItem) {
        model = manualAutoSetItem?.dataValue;
    }
    return model;
});

const getInfoDataInDock = infoItem => {
    if (!infoItem) {
        return;
    }
    const infoInDock = commonDrawerRoot?.props?.isSubscriptOnDemand && getIotData ? getIotData(props.selectObj?.id, infoItem.infoCode) : null;

    const refInfo = isEmpty(infoInDock) ? infoItem : infoInDock;
    return refInfo;
};

const disableControls = computed(() => {
    // return false;
    if (isEdge()) {
        const hasPERMISSION = base.hasAuth(PERMISSION);
        if (!hasPERMISSION) {
            return true;
        }
        const condition = props.list.groupChildren?.find(o => o.groupCode === 'equipParameterSetCondition')?.relInfoCodeConfigs;
        let localRemoteStatus = condition?.find(o => o.infoCode === 'localRemoteStatus'),
            onlineStatus = condition?.find(o => o.infoCode === 'onlineStatus');
        localRemoteStatus = getInfoDataInDock(localRemoteStatus);
        // console.log('localRemoteStatus: ', localRemoteStatus);
        onlineStatus = getInfoDataInDock(onlineStatus);
        // https://shimo.im/docs/Wr3DpYy68KI2D53J/ 《设备状态对设备控制操作的限制》，可复制链接后用石墨文档 App 打开
        if ((!localRemoteStatus?.existsIotRule && onlineStatus?.dataValue === '1') || (localRemoteStatus?.dataValue === '1' && onlineStatus?.dataValue === '1')) {
            return false;
        } else {
            return true;
        }
    }
    return true;
});

// 是否手自动-自动时禁用
const isAutoDisabled = computed(() => {
    if (!props.useAutoDisabled) {
        return false;
    }
    const manualAutoStatus = props.list?.relInfoCodeConfigs?.find(info => info?.infoCode === 'manualAutoSet');
    return manualAutoStatus?.dataValue === '1';
});

const getDisabledTips = item => {
    const isCloud = !isEdge();
    const hasPERMISSION = base.hasAuth(PERMISSION);
    const hasForceCtl = forceControlList(item)?.length > 0;
    const isForceCtlDisabled = hasForceCtl && isForceCtlOpened(item);
    // const currentIsAuto = false;
    const _isAutoDisabled = props.useAutoDisabled && isAutoDisabled.value && item.infoCode !== 'manualAutoSet';
    let title = '';
    const isDisabled = isCloud || disableControls.value || _isAutoDisabled || isForceCtlDisabled || !hasPERMISSION;
    if (isCloud) {
        title = i18n.global.t('meos_control_web.cloud_platform_operation_not_supported_please_use_edge');
    } else if (!hasPERMISSION) {
        title = i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
    } else if (disableControls.value) {
        title = i18n.global.t('meos_control_web.equipment_offline_local_no_control');
    } else if (_isAutoDisabled) {
        title = i18n.global.t('meos_control_web.manual_only_controllable');
    } else if (isForceCtlDisabled) {
        title = i18n.global.t('meos_control_web.forced_control_no_manual');
    }
    const _obj = { title };
    if (!isDisabled) {
        _obj.y = 1000;
    }
    return title;
};

const forceControlList = item => {
    if (isEdge()) {
        const forcedControlList = props.list.groupChildren
            ?.find(o => o.groupCode === 'forcedControl')
            ?.relInfoCodeConfigs?.find(obj => obj.infoCode === item.infoCode)?.relInfoCodeConfigs;
        return forcedControlList;
    }

    return null;
};
// 信息点打开了强制控制
const isForceCtlOpened = item => {
    return forceCtlRecord[item.infoCode] === 'checked';
};

const clickEvent = (e, type) => {
    const dom = document.querySelector('.m-popover.m-popover-light.m-select-window');
    const isContains = dom?.contains(e.target);
    if (!type && !isContains) {
        closePop();
    }
};

//手自动
const getChangeManualAutoStatusByObjectId = (obj, modelHand) => {
    if (props.systemId) {
        obj.systemId = props.systemId;
    }
    if (window[GET_MENU_CONFIG]?.()?.CONTROL_API_TYPE === CONTROL_API_TYPE.new) {
        controlFn({
            data: {
                objectIds: obj.objectIds,
                expireTime: obj.expireTime,
                infoValue: obj.model,
                content: obj.operateReason,
                infoCode: obj.infoCode,
                oneClick: false
            },
            callback: res => {
                if (res.code === SUCCESSCODE) {
                    useSuccessMessage(i18n.global.t('common.operation_success'));
                    closePop();
                    objClear(modelHand);
                }
            }
        });
        return;
    }
    changeManualAutoStatusByObjectId(obj).then(res => {
        if (res.code === SUCCESSCODE) {
            emitter.emit('refreshNotify', 'query');
            useSuccessMessage(i18n.global.t('common.operation_success'));
            closePop();
            objClear(modelHand);
        }
    });
};
// 手自动pop确定事件
const changeModelAxios = () => {
    switch (state.modeType) {
        case '0': //手动
            MFormRef.value.validate(valid => {
                if (valid) {
                    const obj = {
                        objectIds: [objId.value],
                        expireTime: dayjs(state.modelHand.expireTime).format('YYYYMMDDHHmmss'),
                        model: '0',
                        operateReason: state.modelHand.operateReason,
                        infoCode: state.modelHand.infoCode
                    };
                    getChangeManualAutoStatusByObjectId(obj, state.modelHand);
                }
            });
            break;
        case '1': //自动
            getChangeManualAutoStatusByObjectId({ objectIds: [objId.value], model: '1', infoCode: state.modelHand.infoCode }, state.modelHand);
            break;
        case '3': //时间
            MFormRef.value.validate(valid => {
                if (valid) {
                    const data = {
                        objectId: objId.value,
                        expireTime: dayjs(state.modelHand.expireTime).format('YYYYMMDDHHmmss'),
                        operateReason: state.modelHand.operateReason
                    };
                    if (window[GET_MENU_CONFIG]?.()?.CONTROL_API_TYPE === CONTROL_API_TYPE.new) {
                        changeInfoCodeExpireTimeFn(
                            {
                                objectId: data.objectId,
                                expireTime: data.expireTime,
                                content: data.operateReason,
                                infoCode: state.modelHand.infoCode
                            },
                            res => {
                                if (res.code === SUCCESSCODE) {
                                    useSuccessMessage(i18n.global.t('common.operation_success'));
                                    closePop();
                                    objClear(state.modelHand);
                                }
                            }
                        );
                        return;
                    }
                    changeManualExpireTimeByObjectId(data).then(res => {
                        if (res.code === SUCCESSCODE) {
                            useSuccessMessage(i18n.global.t('common.operation_success'));
                            closePop();
                            objClear(state.modelHand);
                        }
                    });
                } else {
                    // useErrorMessage()
                }
            });
            break;
        case '4': //干预时间
            MFormRef.value.validate(valid => {
                if (valid) {
                    const data = {
                        objectIds: [objId.value],
                        infoCode: state.modelHand.infoCode,
                        expireTime: dayjs(state.modelHand.expireTime).format('YYYYMMDDHHmmss'),
                        content: state.modelHand.operateReason
                    };
                    console.log(state);

                    if (window[GET_MENU_CONFIG]?.()?.CONTROL_API_TYPE === CONTROL_API_TYPE.new) {
                        changeInfoCodeExpireTimeFn(
                            {
                                objectId: objId.value,
                                infoCode: data.infoCode,
                                expireTime: data.expireTime,
                                content: data.content
                            },
                            res => {
                                if (res.code === SUCCESSCODE) {
                                    useSuccessMessage(i18n.global.t('common.operation_success'));
                                    closePop();
                                    objClear(state.modelHand);
                                }
                            }
                        );
                        return;
                    }
                    batchSetOperatingParameters(data).then(res => {
                        if (res.code === SUCCESSCODE) {
                            useSuccessMessage(i18n.global.t('common.operation_success'));
                            closePop();
                            objClear(state.modelHand);
                        }
                    });
                } else {
                    // useErrorMessage()
                }
            });
            break;
        default:
            break;
    }
};
// 提交开启关闭按钮事件
const submitOpenChange = () => {
    openOrCloseForm.value.validate(valid => {
        if (valid) {
            const data = {
                objectIds: [objId.value],
                infoValue: state.isOpenStatus.value,
                content: state.isOpenStatus.reason,
                infoCode: state.isOpenStatus.infoCode,
                expireTime: state.isOpenStatus.expireTime ? dayjs(state.isOpenStatus.expireTime).format('YYYYMMDDHHmmss') : ''
            };
            setFun(data, state.settingObj);
        }
    });
};
//提交
const setFun = (data, obj) => {
    console.log(data, obj, 'data-obj');

    // 参数有系统ID的，控制接口调用也加上
    if (props.systemId) {
        data.systemId = props.systemId;
    }
    if (window[GET_MENU_CONFIG]?.()?.CONTROL_API_TYPE === CONTROL_API_TYPE.new) {
        controlFn({
            data,
            callback: res => {
                if (res.code === SUCCESSCODE) {
                    useSuccessMessage(i18n.global.t('common.operation_success'));
                    closePop();
                    objClear(obj);
                }
            }
        });
        return;
    }
    batchSetOperatingParameters(data).then(res => {
        if (res.code === SUCCESSCODE) {
            useSuccessMessage(i18n.global.t('common.operation_success'));
            closePop();
            objClear(obj);
        }
    });
};
//解除干预按钮
const disintervention = (item, e) => {
    disinterventionPopRef.value = '';
    closePop();
    setTimeout(() => {
        // state.openOrCloseType = type
        disinterventionPopRef.value = e.target;
        state.disinterventionPop = true;
    });
    state.equipmentItem = item;
};

const disinterventionDetermination = () => {
    if (window[GET_MENU_CONFIG]?.()?.CONTROL_API_TYPE === CONTROL_API_TYPE.new) {
        releaseInterventionApi({ objectIds: [objId.value], infoCode: state.equipmentItem.infoCode }, () => {
            useSuccessMessage(i18n.global.t('common.operation_success'));
        });
        state.disinterventionPop = false;
        return;
    }
    releaseIntervention({
        objectIds: [objId.value],
        infoCode: state.equipmentItem.infoCode
    }).then(res => {
        useSuccessMessage(i18n.global.t('common.operation_success'));
    });
    state.disinterventionPop = false;
};
//手自动
const change = (e, data, itemP) => {
    const item = getInfoItem(itemP);
    if (disableControls.value) return;
    if (isForceCtlOpened(item)) return;
    if (data.code === item.dataValue) return;
    state.modelHand.expireTime = '';
    state.modelHand.infoCode = item.infoCode;
    closePop();
    setTimeout(() => {
        // model = s
        state.modeType = data.code;
        controlModelPopRef.value = e.target;
        state.showControlModelPop = true;
    });
};
//手自动切换取消按钮
const automaticHandCancellation = () => {
    state.modelHand.expireTime = '';
    state.modelHand.operateReason = '';
    state.showControlModelPop = false;
};
// 打开设定pop
const openSettingPop = (itemP, e) => {
    const item = getInfoItem(itemP);
    if (disableControls.value) return;
    if (isForceCtlOpened(item)) return;
    settingPopRef.value = '';
    closePop();
    setTimeout(() => {
        settingPopRef.value = e.target;
        state.showSettingPop = true;
        state.settingObj.num = item.dataValue;
        state.settingObj.infoCode = item.infoCode; //信息点编码
        state.settingObj.classCode = item.classCode;
        state.settingObj.unit = item.unit;
        state.settingObj.scale = item.scale;
        state.title = item.name;
        console.log(settingPopRef.value, '222');
    });
};
//打开修改时间pop
const showTime = (itemP, e, type) => {
    const item = getInfoItem(itemP);
    console.log(item, type);
    controlModelPopRef.value = null;
    closePop();
    setTimeout(() => {
        controlModelPopRef.value = e.target;
        state.showControlModelPop = true;
        state.modelHand.infoCode = item.infoCode;
        state.modelHand.expireTime =
            type === '3' || type === '4'
                ? item.additionalMapValue?.recoveryDateTime
                    ? dayjs(item.additionalMapValue.recoveryDateTime).format('YYYY.MM.DD HH:mm')
                    : ''
                : item.dataTime
                ? dayjs(item.dataTime).format('YYYY.MM.DD HH:mm')
                : '';
        state.modeType = type;
    }, 300);
};
//设定取消按钮
const editSetting = () => {
    state.showSettingPop = false;
    objClear(state.settingObj);
};
//取消开启关闭按钮
const onOffBtn = () => {
    state.showOpenOrClosePop = false;
    objClear(state.isOpenStatus);
};
//设定提交按钮
const submitSetting = () => {
    settingForm.value.validate(valid => {
        if (valid) {
            const data = {
                objectIds: [objId.value],
                infoValue: state.settingObj.num,
                content: state.settingObj.reason,
                infoCode: state.settingObj.infoCode,
                expireTime: state.settingObj.expireTime ? dayjs(state.settingObj.expireTime).format('YYYYMMDDHHmmss') : ''
            };
            setFun(data, state.settingObj);
        }
    });
};
//开启关闭设备按钮
const handle = (item, io, e) => {
    if (disableControls.value) return;
    if (isForceCtlOpened(item)) return;
    openOrClosePopRef.value = '';
    objClear(state.isOpenStatus);
    closePop();
    setTimeout(() => {
        // state.openOrCloseType = type
        openOrClosePopRef.value = e.target;
        state.showOpenOrClosePop = true;
    });
    state.isOpenStatus.name = io.name;
    state.isOpenStatus.value = io.code;
    state.isOpenStatus.infoCode = item.infoCode;
    state.isOpenStatus.classCode = item.classCode;
    state.isOpenStatus.objId = item.id;
};
const closePop = () => {
    state.showControlModelPop = false;
    state.showOpenOrClosePop = false;
    state.showSettingPop = false;
    state.disinterventionPop = false;
};
const openTimeFun = (e, item) => {
    // eslint-disable-next-line eqeqeq
    if (item.dataTime && model.value == '1') {
        timePopRef.value = e.target;
        state.showTimePop = true;
        state.time = dayjs(item.dataTime).format('YYYY.MM.DD HH:mm:ss');
    }
};
const closeTimeFun = () => {
    state.showTimePop = false;
    timePopRef.value = null;
    state.time = '';
};
//清空对象key值
const objClear = obj => {
    Object.keys(obj).forEach(key => {
        // eslint-disable-next-line no-return-assign
        return (obj[key] = '');
    });
};

provide(openTimeFunKey, openTimeFun);
provide(closeTimeFunKey, closeTimeFun);
provide(showTimeKey, showTime);
provide(disinterventionKey, disintervention);
provide(handleKey, handle);
provide(openSettingPopKey, openSettingPop);
provide(disableControlsKey, disableControls);
provide(isAutoDisabledKey, isAutoDisabled);
provide(getDisabledTipsKey, getDisabledTips);
</script>
<style lang="less">
@media screen and (min-width: 1600px) {
    .pd {
        .action-content {
            width: 200px;
            .m-button {
                max-width: 200px;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
}
@media screen and (max-width: 1600px) {
    .pd {
        .action-content {
            width: fit-content;

            .m-button {
                max-width: 132px;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
    .parameterSetting {
        .setting-item {
            .right-status {
                max-width: 136px;
            }
        }
    }
}
</style>

<style lang="less" scoped>
.text-name {
    // overflow: hidden;
    display: inline-block;
    // text-overflow: ellipsis;
    white-space: wrap;
    // max-width: 100px;
}
.text-name-item {
    // overflow: hidden;
    display: inline-block;
    // text-overflow: ellipsis;
    white-space: wrap;
}

.single-row {
    display: flex;
    align-items: flex-start;
    text-align: left;
}

.pd {
    padding: 8px 12px;
}
.setting-item:not(:last-child) {
    border-bottom: 1px solid var(--gray-200, #e8ecf0);
}
.min-w {
    width: 180px;
}
.btn {
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid #e8ecf0;
    background: #fff;
    font-size: 14px;
    height: 25px;
}
.btn:hover {
    border-color: #246fe5;
    color: #246fe5;
}
.right-status {
    max-width: 200px;
    flex-wrap: wrap;
    justify-content: end;
}
.openPopover_header {
    width: 290px;
    // height: 40px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    background-color: #d9ebff;
    margin-bottom: 16px;
    padding: 10px 16px;

    > span {
        margin-left: 8px;
    }
}
.popover_header {
    display: flex;
    align-items: flex-start;
    /deep/ svg {
        min-width: 24px;
        min-height: 24px;
        margin-top: 12px;
    }
}

.popover_cont {
    margin-left: 12px;
    color: #626c78;
    // width: 344px;
    word-break: break-all;
    margin-top: 8px;
}

.popover_footer {
    margin: 12px 0 0;
    text-align: right;
}
.m-button + .m-button {
    margin-left: 12px;
}
.add-btn {
    margin-left: 4px !important;
}
.inline {
    display: inline-block;
}
</style>
