<!-- eslint-disable vue/valid-v-slot -->
<template>
    <div v-for="(item, index) in list" :key="index" class="loopList">
        <div class="fb">
            <div class="fb cp loopList-hover" style="width: 80%" @click="item.funcTypeOpen = !item.funcTypeOpen">
                <div>
                    <div v-ellipsis class="f14 m-ellipsis loop-title">{{ item.localName ?? '--' }}</div>
                    <div class="f12 ft1 mt4">{{ i18n.global.t('meos_control_web.lighting_code') }}：{{ item.localId }}</div>
                </div>
            </div>
            <div style="cursor: pointer" :class="[item.funcTypeOpen ? 'rotateBottom' : '', 'rotate']" @click="item.funcTypeOpen = !item.funcTypeOpen">
                <SvgIcon name="unpackArrow" />
            </div>
        </div>
        <div v-if="item.abnormalEvents?.length || item.tag?.runningDeviationType == 'MORE_OPEN' || item.tag?.runningDeviationType == 'LESS_OPEN'" class="fc mt12">
            <div v-if="item.abnormalEvents?.length" class="abnormal fc mr4" @click="item.abnormalTypeOpen = !item.abnormalTypeOpen">
                <div class="f12">{{ i18n.global.t('meos_control_web.abnormal_event') }}:{{ item.abnormalEvents.length }}</div>
                <div :class="[item.abnormalTypeOpen ? 'rotateBottom' : '', 'rotate']">
                    <SvgIcon name="redArrow" />
                </div>
            </div>
            <m-tag v-if="item.tag && item.tag.runningDeviationType == 'MORE_OPEN'" class="mr4" color="#FFFFFF" bg-color="#E6B407" size="small">{{
                i18n.global.t('common.over_on')
            }}</m-tag>
            <m-tag v-if="item.tag && item.tag.runningDeviationType == 'LESS_OPEN'" class="mr4" color="#FFFFFF" bg-color="#FF9D2D" size="small">{{
                i18n.global.t('common.drive_less')
            }}</m-tag>
        </div>
        <!-- 异常列表 -->
        <div v-show="item.abnormalTypeOpen">
            <div v-for="(items, indexs) in item.abnormalEvents" :key="indexs" class="abnormal-list mt8" @click="abnormalInfo(items)">
                <div v-ellipsis class="exception-list-title">{{ items.problemsName || '--' }}</div>
                <div class="fcb mt12">
                    <div>
                        <div style="color: #1b2129">{{ dayjs(+items.exceptionStartTime).format('YYYY.MM.DD HH:mm') }}</div>
                        <div class="ft1 mt4">{{ i18n.global.t('meos_control_web.abnormal_time') }}</div>
                    </div>
                    <div>
                        <div style="color: #1b2129">{{ durationTime(items.duration || 0) }}</div>
                        <div class="ft1 mt4">{{ i18n.global.t('meos_control_web.continuous_duration') }}</div>
                    </div>
                    <div>
                        <div style="color: #1b2129">{{ items.resolvedProblemCount || '--' }}/{{ items.allProblemCount || '--' }}</div>
                        <div class="ft1 mt4">{{ i18n.global.t('meos_control_web.resolved_all_issues') }}</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 状态 -->
        <div v-if="item.runningParameters?.length">
            <div class="fb" style="flex-wrap: wrap">
                <div v-for="(items, indexs) in item.runningParameters" :key="indexs" :class="[indexs % 2 ? 'tal' : '', 'row', 'f', 'mt8']">
                    <!-- <div>运行状态：<span style="color: #f55047">停止</span></div> -->
                    <span class="ft status-title">{{ items.infoCodeName }}：</span>
                    <div>
                        <span>{{ getValueStr(items).text }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="item.funcTypeOpen">
            <div class="getline mt8 mb8"></div>
            <div>
                <div class="fc mb8">
                    <div class="ft">{{ i18n.global.t('meos_control_web.related_control_module_colon') }}</div>
                    <div>{{ item.relController?.localName ?? '--' }}</div>
                </div>
                <div class="fc mb8">
                    <div class="ft">{{ i18n.global.t('meos_control_web.related_distribution_box_colon') }}</div>
                    <div>{{ item.relDistributionCabinet?.localName ?? '--' }}</div>
                </div>
                <div class="fc">
                    <div class="ft">{{ i18n.global.t('meos_control_web.related_electrical_shaft_colon') }}</div>
                    <div>{{ item.relSpace?.localName ?? '--' }}</div>
                </div>
            </div>
        </div>
        <div
            v-if="item.settingParameters?.length && item.settingParameters.find((item:any) => item.infoCode == 'manualAutoSet')"
            :class="[state.loopUnpackShow ? '' : 'mt8', 'set-operation']"
        >
            <div v-for="(items, indexs) in item.settingParameters" :key="indexs">
                <div v-if="items.infoCode == 'manualAutoSet'" class="fcb">
                    <div class="ft f14">{{ i18n.global.t('meos_control_web.manual_auto_status_set') }}</div>
                    <div class="fc">
                        <div
                            class="fc"
                            @click="
                                e => {
                                    if (item.disableControl || isDisableOperation()) return;
                                    changeRadio(e, item, items.dataSources[1].code, items);
                                }
                            "
                        >
                            <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent" :disabled="!isDisableOperation()">
                                <m-radio
                                    class="control-model-show"
                                    :model-value="items.infoCodeValue === items.dataSources[1].code ? 'checked' : 'uncheck'"
                                    :size="14"
                                    :disabled="item.disableControl || isDisableOperation()"
                                    @change="changeRadioAuto"
                                    >{{ i18n.global.t('meos_control_web.auto') }}</m-radio
                                >
                            </m-tips>
                        </div>
                        <div
                            class="ml12 fc"
                            @click="
                                e => {
                                    if (item.disableControl || isDisableOperation()) return;
                                    changeRadio(e, item, items.dataSources[0].code, items);
                                }
                            "
                        >
                            <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent" :disabled="!isDisableOperation()">
                                <m-radio
                                    :model-value="items.infoCodeValue === items.dataSources[0].code ? 'checked' : 'uncheck'"
                                    :size="14"
                                    :disabled="item.disableControl || isDisableOperation()"
                                    >{{ i18n.global.t('meos_control_web.manual') }}</m-radio
                                >
                            </m-tips>
                        </div>
                    </div>
                </div>
                <div v-if="items.additionalMapValue?.recoveryDateTime && items.infoCode == 'manualAutoSet' && items.infoCodeValue == '0'" class="auto-set-time fc mt4 f12">
                    <span class="flight cp" @click="e => editTime(items.additionalMapValue.recoveryDateTime, e, item)">{{
                        dayjs(items.additionalMapValue.recoveryDateTime).format('YYYY.MM.DD HH:mm')
                    }}</span>
                    <span class="ft1">&nbsp;&nbsp;{{ i18n.global.t('meos_control_web.restore_to_auto_mode') }}</span>
                </div>
                <div v-if="items.infoCode == 'equipSwitchSet'" class="getline1 mt8 mb6"></div>
                <div v-if="items.infoCode == 'equipSwitchSet'">
                    <!-- v-if="item.setttingParameters[0].infoCode == 'manualAutoSet' && item.setttingParameters[0].infoCodeValue == '0'" -->
                    <div v-if="item.settingParameters.find((dataObj:any) => dataObj.infoCode == 'manualAutoSet'&&dataObj.infoCodeValue=='0')" class="fcb">
                        <div class="ft f14">
                            {{ i18n.global.t('common.meos_home_switch_setting') }}<span class="set-value">{{ getValueStr(items).text }}</span>
                        </div>
                        <m-tips :content="i18n.global.t('meos_control_web.equipment_currently_uncontrollable')" theme="darkTransparent" :disabled="!isDisableOperation()">
                            <div>
                                <m-popconfirm
                                    v-for="(io, iv) in items.dataSources"
                                    :key="iv"
                                    placement="bottom"
                                    :content="i18n.global.t('meos_control_web.confirm_to_name_loop', { name: io.name })"
                                    :before-confirm="(done: () => void) => beforeConfirm('btn',item, io, done)"
                                    status="primary"
                                    :disabled="item.disableControl || isDisableOperation()"
                                >
                                    <m-button size="small" :disabled="item.disableControl || isDisableOperation()" @click="clickBtn">{{ io.name }}</m-button>
                                </m-popconfirm>
                            </div>
                        </m-tips>
                    </div>
                    <div v-else-if="item.settingParameters.find((dataObj:any) => dataObj.infoCode == 'manualAutoSet'&&dataObj.infoCodeValue=='1')" class="fc">
                        <div class="ft f14">
                            {{ i18n.global.t('common.meos_home_switch_setting') }}<span class="set-value">{{ getValueStr(items).text }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <batchPopup ref="batchPopupRef" @submit-btn="submitBtn" @on-off-btn="onOffBtn" />

    <!-- 切换手自动pop -->
    <m-popover
        virtual-triggering
        :virtual-ref="controlModelPopRef"
        class="control-model-pop"
        trigger="manually"
        placement="bottom"
        style="height: auto"
        :is-open="state.showControlModelPop"
    >
        <template #content>
            <div class="f control-model-show">
                <IconMeriComponentNotificationInfo size="24" />
                <div>
                    <div class="popover_cont control-model-show">{{ i18n.global.t('meos_control_web.confirm_switch_to_auto') }}</div>
                    <div class="popover_cont control-model-show">{{ i18n.global.t('meos_control_web.control_by_system') }}</div>
                </div>
            </div>
            <div class="popover_footer fc control-model-show" style="justify-content: flex-end">
                <div>
                    <m-button type="default" size="small" @click="Cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                </div>
                <div class="ml12">
                    <m-button type="primary" size="small" @click="changeModelAxios">{{ i18n.global.t('common.confirm') }}</m-button>
                </div>
            </div>
        </template>
    </m-popover>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon.vue';
import batchPopup from './batchPopup.vue';
import { IconMeriComponentNotificationInfo } from 'meri-icon';
import { PropType } from 'vue';
import dayjs from 'dayjs';
import { durationTime } from '@/utils/viewUtils';
import { toNumber } from 'lodash';
import baseStore from '@/store/baseStore';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { SUCCESSCODE, OBJ_TYPE } from '@/utils/globalVariables';
import { $Message } from 'meri-plus';
import emitter from '@/utils/bus';
import { abnormalJumpFun } from '@/utils/envUtils';
import { isEdge } from '@/utils/envUtils';
import i18n from '@/localization';

const { controlFn, changeInfoCodeExpireTimeFn } = useGeneralControl();
const props = defineProps({
    list: {
        type: Array as PropType<any[]>,
        default: () => []
    },
    clickTop: {
        type: Boolean
    }
});

const isDisableOperation = () => {
    return !isEdge();
};

const emit = defineEmits(['hidenPopupShow']);
const getValueStr = (data: any) => {
    if (data.dataSources?.length) {
        let str = '';
        data.dataSources.forEach((item: any) => {
            if (data.infoCodeValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (toNumber(item.code) === toNumber(data.infoCodeValue)) {
                    str = item.name;
                }
            }
        });
        return { html: `<span>${str || '--'}</span>`, text: str || '--' };
    }
    const value = data.infoCodeValue ? data.infoCodeValue : '--';
    return {
        html: `<span>${data.infoCodeValue || ''}</span> <span>${data.unit || ''}</span>`,
        text: `${value} ${data.unit || ''}`
    };
};
const model = ref();
const state = reactive({
    loopUnpackShow: false,
    abnormalShow: false,
    showControlModelPop: false,
    list: [
        {
            name: i18n.global.t('meos_control_web.on'),
            code: '1'
        },
        {
            name: i18n.global.t('meos_control_web.off'),
            code: '2'
        }
    ],
    dataSource: [
        {
            code: '1',
            name: i18n.global.t('meos_control_web.auto')
        },
        {
            code: '0',
            name: i18n.global.t('meos_control_web.manual')
        }
    ],
    code: '',
    name: '',
    expireTime: '2022-12-12',
    modeType: '',
    radioCode: '',
    radioItem: {}
});
const batchPopupRef = ref();
const controlModelPopRef = ref<any>('');
const initSpace: any = inject('initSpace');
const initModule: any = inject('initModule');
const showHiden: any = inject('showHiden');
const spaceModuleInfo: any = inject('spaceModuleInfo');
const dataValue: any = ref({});
const id: any = ref('');
const beforeConfirm = async (type: string, data: any, value: string, done: () => void) => {
    console.log(type, data, '33333');
    if (type === 'auto') {
        await editValue(data, false, value);
    } else {
        await editSwitchValue(data, false, value);
    }
    done();
};
watch(
    () => props.clickTop,
    v => {
        if (!v) {
            state.showControlModelPop = false;
            batchPopupRef.value.hidenPopup(false);
        }
    }
);

const Cancel = () => {
    state.showControlModelPop = false;
    hidenPopup(false);
};
const clickBtn = () => {
    batchPopupRef.value.showFun();
    emitter.emit('hiddenBatchPopupBus');
    state.showControlModelPop = false;
};
const editValue = (data: any, type = true, value?: any) => {
    model.value = value;
    id.value = data.id;
    getChangeManualAutoStatusByObjectIds();
};
emitter.on('showControlModelPopBus', () => {
    state.showControlModelPop = false;
});
const editSwitchValue = (data: any, type = true, value?: any) => {
    console.log(data, value);
    id.value = data.id;
    state.code = value.code;
    state.name = value.name;
    setsetOperatingParameters();
};
const setsetOperatingParameters = () => {
    const obj = {
        objectIds: [id.value],
        infoCode: 'equipSwitchSet',
        infoValue: state.code
    };
    controlFn({
        data: obj,
        callback: (res: any) => {
            if (res.code === SUCCESSCODE) {
                messageInfo(state.name);
                if (spaceModuleInfo.value.objType === OBJ_TYPE.SPACE) {
                    initSpace(false);
                } else {
                    initModule(false);
                }
            }
        }
    }).then();
};
const editTime = (expireTime: string, e: Event, item: any) => {
    model.value = '3';
    id.value = item.id;
    batchPopupRef.value.showFun(expireTime, e.target);
};
const getChangeManualAutoStatusByObjectIds = () => {
    const obj = {
        projectId: baseStore().projectId,
        objectIds: [id.value],
        infoValue: model.value,
        infoCode: 'manualAutoSet',
        content: dataValue.value.reason,
        expireTime: dataValue.value.expireTime ? dayjs(dataValue.value.expireTime).format('YYYYMMDDHHmmss') : ''
    };
    controlFn({
        data: obj,
        callback: (res: any) => {
            if (res.code === SUCCESSCODE) {
                emitter.emit('refreshNotify', 'query');
                dataValue.value = {};
                messageInfo(i18n.global.t('meos_control_web.modify'));
                state.showControlModelPop = false;
                if (spaceModuleInfo.value.objType === OBJ_TYPE.SPACE) {
                    initSpace(false);
                } else {
                    initModule(false);
                }
            }
        }
    }).then();
};
const messageInfo = (data: any) => {
    $Message.success({
        title: i18n.global.t('meos_control_web.name_success', { name: data }),
        showClose: true,
        duration: 3000,
        className: 'message_custom',
        buttonClick: () => {
            console.log(1111);
        }
    });
};
//修改的回调
const submitBtn = (item: any) => {
    dataValue.value = item;
    hidenPopup(false);
    if (model.value === '3') {
        setchangeManualExpireTimeByObjectId();
    } else {
        getChangeManualAutoStatusByObjectIds();
    }
};
const onOffBtn = () => {
    hidenPopup(false);
};
const setchangeManualExpireTimeByObjectId = () => {
    changeInfoCodeExpireTimeFn(
        {
            objectId: id.value,
            infoCode: 'manualAutoSet',
            expireTime: dataValue.value.expireTime ? dayjs(dataValue.value.expireTime).format('YYYYMMDDHHmmss') : ''
        },
        (res: any) => {
            messageInfo(i18n.global.t('meos_control_web.modify'));
            if (res.code === SUCCESSCODE) {
                if (spaceModuleInfo.value.objType === OBJ_TYPE.SPACE) {
                    initSpace(false);
                } else {
                    initModule(false);
                }
            }
        }
    ).then();
};
const changeRadio = (e: Event, item: any, code: any, items: any) => {
    if (code === items.infoCodeValue) return;
    hidenPopup(true);
    if (code === '1') {
        controlModelPopRef.value = e.target;
        state.showControlModelPop = true;
        state.radioCode = code;
        state.radioItem = item;
        emitter.emit('hiddenBatchPopupBus');
    } else {
        model.value = code;
        id.value = item.id;
        batchPopupRef.value.showFun('', e.target);
        state.showControlModelPop = false;
    }
};
const hidenPopup = (show: any) => {
    emit('hidenPopupShow', show);
};
const changeRadioAuto = () => {
    // batchPopupRef.value.showFun();
    emitter.emit('hiddenBatchPopupBus');
};
const changeModelAxios = () => {
    editValue(state.radioItem, false, state.radioCode);
    hidenPopup(false);
};
// const days = computed(() => (minutes: any) => {
//     const day = Math.floor(minutes / 60 / 24);
//     return day;
// });
// const hours = computed(() => (minutes: any) => {
//     const hour = Math.ceil((minutes % (60 * 24)) / 60);
//     return hour;
// });
const abnormalInfo = (item: any) => {
    abnormalJumpFun(item);
};
onMounted(() => {
    console.log(123);
});
</script>
<style lang="less" scoped>
.loopList {
    border-radius: 4px;
    background: var(--gray-50, #f7f9fa);
    padding: 10px;
    .abnormal {
        color: #d72824;
        background-color: #ffe6e5;
        padding: 0px 4px;
        border-radius: 2px;
        height: 20px;
    }
    .abnormal:hover {
        cursor: pointer;
        background: var(--red-200, #fdc1be);
    }
    .abnormal-list {
        border-radius: 4px;
        background: rgba(255, 230, 229, 0.45);
        padding: 12px 8px;
    }
    .abnormal-list:hover {
        cursor: pointer;
        background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
    }
    .exception-list-title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        color: #424c59;
    }
    .set-operation {
        background: var(--gray-200, #e8ecf0);
        padding: 4px 8px;
        border-radius: 4px;
        .set-value {
            color: #1b2129;

            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 20px;
        }
    }
}

.loopList:not(:last-child) {
    margin-bottom: 12px;
}
.ratate {
    transition: all 0.2s ease-in;
}
.rotate:hover {
    border-radius: 4px;
    background: var(--Grey-Alpha-30, rgba(196, 201, 207, 0.3));
}
.rotate {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.rotateBottom {
    transform: rotate(-180deg);
    cursor: pointer;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.getline {
    width: 100%;
    height: 1px;
    background-color: var(--gray-200, #e8ecf0);
}
.getline1 {
    width: 100%;
    height: 1px;
    background-color: #e1e5eb;
}
.popover_header {
    height: 24px;
    display: flex;
    align-items: center;

    > p {
        font-size: 16px;
        font-style: normal;
        font-weight: 700;
        color: #2e3742;
        margin-left: 12px;
    }
}

.popover_cont {
    margin-left: 12px;
    color: #626c78;
    // width: 270px;
    word-break: break-all;
    // margin-top: 8px;
}

.popover_footer {
    margin: 12px 0 0;
    text-align: right;
}

.m-button + .m-button {
    margin-left: 4px;
}
.row {
    width: 48%;
}
.tal {
    justify-content: end;
}
.cr {
    color: #f55047;
}
@media screen and (max-width: 1600px) {
    .loop-title {
        max-width: 300px;
    }
    .status-title {
        max-width: 120px;
    }
}
@media screen and (min-width: 1600px) {
    .loop-title {
        max-width: 400px;
    }
    .status-title {
        max-width: 164px;
    }
}
</style>
