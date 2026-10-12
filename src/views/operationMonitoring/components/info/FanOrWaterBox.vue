<template>
    <div :class="[fan.id === otherId ? 'is-active-fan pd16' : '', type == '1' ? 'fan-water-box pd16' : 'fan-water-box pd86 fan-water-box1']">
        <div class="box-top fcb">
            <div class="fcc" :class="states">
                <svg v-if="states.includes('offline')" class="icon" aria-hidden="true" style="width: 16px; height: 16px">
                    <use xlink:href="#icon-lixian" />
                </svg>
                <img v-if="type === '1'" src="../../../../assets/imgs/fan.png" height="20" style="margin-right: 4px" />
                <img v-if="type === '2'" src="../../../../assets/imgs/shuifa.png" height="20" style="margin-right: 4px" />
                <!--  :style="{
                        'max-width': states.includes('fault') && states.includes('alarm') ? '175px' : states.includes('fault') || states.includes('alarm') ? '175px' : '215px'
                    }" -->
                <div v-ellipsis class="m-ellipsis max-name">
                    {{ fan.name }}
                </div>
                &nbsp;
                <!-- 故障 -->
                <m-tips :content="i18n.global.t('meos_control_web.device_exception')" theme="darkTransparent" placement="top">
                    <div v-if="states.includes('fault') || states.includes('alarm')" class="status"></div>
                </m-tips>
            </div>
            <div v-if="base.hasAuth('MEOI_CatalogList')" class="fcc">
                <m-tips :content="i18n.global.t('meos_control_web.open_equipment_detail_in_new_tab')" theme="darkTransparent" placement="left">
                    <div @click="itemInfo(fan)">
                        <m-button v-if="type == '1'" type="link" size="small">{{ i18n.global.t('meos_control_web.device_details') }}</m-button>
                    </div>
                </m-tips>
            </div>
        </div>
        <div class="box-bottom">
            <div class="info-tag">
                <m-tag v-if="states.includes('default')" size="small" color="#1B4ACC" bg-color="#D9EBFF">{{ i18n.global.t('meos_control_web.online') }}</m-tag>
                <m-tag v-if="states.includes('running')" size="small" color="#15ae55" bg-color="#daf7e1">{{ i18n.global.t('meos_control_web.in_progress') }}</m-tag>
                <m-tag v-if="states.includes('opening')" size="small" color="#15ae55" bg-color="#daf7e1">{{ i18n.global.t('meos_control_web.enabling') }}</m-tag>
                <m-tag v-if="states.includes('closing')" size="small" color="#15ae55" bg-color="#daf7e1">{{ i18n.global.t('meos_control_web.closing') }}</m-tag>
                <m-tag v-if="states.includes('offline')" size="small" color="#1B2129" bg-color="#E8ECF0">{{ i18n.global.t('meos_control_web.offline') }}</m-tag>
                <m-tag v-if="states.includes('close')" size="small" color="#1B2129" bg-color="#E8ECF0">{{ i18n.global.t('common.status_close') }}</m-tag>
                <m-tag v-if="states.includes('local')" size="small" color="#A928B7" bg-color="#F7E3F5">{{ i18n.global.t('meos_control_web.local') }}</m-tag>
            </div>
            <div class="feb">
                <template v-if="infoCodes.length">
                    <template v-for="(item, i) in infoCodes" :key="item.infoCode">
                        <!-- 风机信息 -->
                        <div v-if="item.classCode == 'ACCCOF'">
                            <div v-if="item.dataSource?.length" class="info-code">
                                <div class="info-code-value">
                                    <template v-if="!showEnableCtrl">
                                        {{ getValueStr(item).text }}
                                    </template>
                                    <template v-else>
                                        <div v-if="notAlwaysSet" class="fc" style="position: relative">
                                            <SetButton
                                                v-for="val in item?.dataSource"
                                                :key="val.name"
                                                :disabled="true"
                                                size="small"
                                                type="link"
                                                :content="
                                                    type === '1'
                                                        ? i18n.global.t('meos_control_web.cooling_tower_fan_not_operable_when_fault_offline_local')
                                                        : i18n.global.t('meos_control_web.valve_offline_or_local_cannot_op')
                                                "
                                                >{{ val.name }}</SetButton
                                            >
                                            <div class="get-line ml10 get-position"></div>
                                        </div>
                                        <template v-else>
                                            <div class="fc" style="position: relative">
                                                <m-popconfirm
                                                    v-for="val in item?.dataSource"
                                                    :key="val.code"
                                                    status="primary"
                                                    :before-confirm="done => beforeConfirm(item, val.code, done)"
                                                    :confirm-button-text="val.name"
                                                    :content="i18n.global.t('meos_control_web.confirm_to_equip_name', { name: val.name })"
                                                >
                                                    <SetButton v-if="!base.hasAuth(PERMISSION)" type="link" size="small">
                                                        {{ val.name }}
                                                    </SetButton>
                                                    <m-button v-else type="link" size="small">
                                                        {{ val.name }}
                                                    </m-button>
                                                </m-popconfirm>
                                                <div class="get-line ml10 get-position2"></div>
                                            </div>
                                        </template>
                                    </template>
                                </div>
                                <div class="info-code-name">{{ item.name }}</div>
                            </div>
                            <div v-else class="info-code">
                                <div class="info-code-value fc lh">
                                    <span v-if="!item.isEdit" class="fcb">
                                        {{ getValueStr(item).text }}
                                        <div v-if="showEnableCtrl && item.infoCode === 'equipFreqSet'" class="get-line ml10 mr10"></div>
                                        <template v-if="!notAlwaysSet">
                                            <SetDiv no-height>
                                                <span
                                                    v-if="showEnableCtrl && item.infoCode === 'equipFreqSet'"
                                                    class="btn-span"
                                                    style="color: #246fe5; cursor: pointer"
                                                    @click="e => isEditBtn(item, e)"
                                                >
                                                    {{ i18n.global.t('meos_control_web.modify') }}
                                                </span>
                                            </SetDiv>
                                        </template>
                                        <template v-else>
                                            <SetButton
                                                v-if="showEnableCtrl && item.infoCode === 'equipFreqSet'"
                                                disabled
                                                :content="
                                                    type === '1'
                                                        ? i18n.global.t('meos_control_web.cooling_tower_fan_not_operable_when_fault_offline_local')
                                                        : i18n.global.t('meos_control_web.valve_offline_or_local_cannot_op')
                                                "
                                            >
                                                {{ i18n.global.t('meos_control_web.modify') }}
                                            </SetButton>
                                        </template>
                                        <m-popover
                                            v-if="showEnableCtrl && item.infoCode === 'equipFreqSet'"
                                            virtual-triggering
                                            :virtual-ref="isEditRef"
                                            class="control-model-pop"
                                            trigger="manually"
                                            placement="top"
                                            style="height: auto"
                                            :is-open="isEdit"
                                        >
                                            <template #content>
                                                <div class="item-name mb14">
                                                    <span class="mr5">{{ item.name }}</span>
                                                    <span style="color: #f55047">*</span>
                                                </div>

                                                <m-form-item :ref="el => formRef(el, 'form' + i)" label="" :item-model="item.value" :rules="rules(item)" prop="value">
                                                    <m-input-number
                                                        v-model="item.value"
                                                        class="has-btn-input-number"
                                                        :placeholder="
                                                            interval(item)
                                                                ? `${i18n.global.t('meos_control_web.setpoint_range_colon')}${interval(item)}`
                                                                : i18n.global.t('common.placeholder_input')
                                                        "
                                                        text-align="left"
                                                        width="200px"
                                                        controls="rightButton"
                                                    >
                                                        <template #suffix> {{ item.unit }} </template>
                                                    </m-input-number>
                                                </m-form-item>
                                                <div style="text-align: right">
                                                    <m-button size="small" style="margin-right: 12px" @click="cancleFun(item)">{{ i18n.global.t('common.cancel') }}</m-button>
                                                    <m-button type="primary" size="small" @click="checkForm(item, i)">{{ i18n.global.t('common.confirm') }}</m-button>
                                                </div>
                                            </template>
                                        </m-popover>
                                    </span>
                                </div>
                                <div class="info-code-name">
                                    {{ item.name }}
                                </div>
                            </div>
                        </div>
                        <!-- 水阀信息 -->
                        <div v-else style="width: 100%">
                            <div v-if="item.dataSource?.length">
                                <div class="">
                                    <div v-if="!showEnableCtrl">
                                        {{ getValueStr(item).text }}
                                    </div>
                                    <div v-else>
                                        <div v-if="notAlwaysSet" class="fc">
                                            <SetButton
                                                v-for="val in item?.dataSource"
                                                :key="val.name"
                                                :disabled="true"
                                                size="small"
                                                type="link"
                                                :content="
                                                    type === '1'
                                                        ? i18n.global.t('meos_control_web.cooling_tower_fan_not_operable_when_fault_offline_local')
                                                        : i18n.global.t('meos_control_web.valve_offline_or_local_cannot_op')
                                                "
                                                >{{ val.name }}</SetButton
                                            >
                                        </div>
                                        <div v-else>
                                            <div class="fc" style="position: relative">
                                                <m-popconfirm
                                                    v-for="val in item?.dataSource"
                                                    :key="val.code"
                                                    status="primary"
                                                    :before-confirm="done => beforeConfirm(item, val.code, done)"
                                                    :confirm-button-text="val.name"
                                                    :content="i18n.global.t('meos_control_web.confirm_to_equip_name', { name: val.name })"
                                                >
                                                    <SetButton v-if="!base.hasAuth(PERMISSION)" type="link" size="small">
                                                        {{ val.name }}
                                                    </SetButton>
                                                    <m-button v-else type="link" size="small">
                                                        {{ val.name }}
                                                    </m-button>
                                                </m-popconfirm>
                                                <div class="get-line ml10 mr10 get-position1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="info-code-name">{{ item.name }}</div>
                            </div>
                            <div v-else class="info-code fc">
                                <div class="info-code-value fcb">
                                    <div class="info-code-name">
                                        {{ item.name }}
                                    </div>
                                    <span v-if="!item.isEdit">
                                        {{ getValueStr(item).text }}
                                        <template v-if="!notAlwaysSet">
                                            <SetDiv no-height>
                                                <span
                                                    v-if="showEnableCtrl && item.infoCode === 'equipFreqSet'"
                                                    class="btn-span"
                                                    style="color: #246fe5; cursor: pointer"
                                                    @click="e => isEditBtn(item, e)"
                                                >
                                                    {{ i18n.global.t('meos_control_web.modify') }}
                                                </span>
                                            </SetDiv>
                                        </template>
                                        <template v-else>
                                            <SetButton
                                                v-if="showEnableCtrl && item.infoCode === 'equipFreqSet'"
                                                disabled
                                                :content="
                                                    type === '1'
                                                        ? i18n.global.t('meos_control_web.cooling_tower_fan_not_operable_when_fault_offline_local')
                                                        : i18n.global.t('meos_control_web.valve_offline_or_local_cannot_op')
                                                "
                                            >
                                                {{ i18n.global.t('meos_control_web.modify') }}
                                            </SetButton>
                                        </template>
                                    </span>
                                    <m-popover
                                        v-if="showEnableCtrl && item.infoCode === 'equipFreqSet'"
                                        virtual-triggering
                                        :virtual-ref="isEditRef"
                                        class="control-model-pop"
                                        trigger="manually"
                                        placement="top"
                                        style="height: auto"
                                        :is-open="isEdit"
                                    >
                                        <template #content>
                                            <div class="item-name mb14">
                                                <span class="mr5">{{ item.name }}</span>
                                                <span style="color: #f55047">*</span>
                                            </div>
                                            <m-form-item :ref="el => formRef(el, 'form' + i)" label="" :item-model="item.value" :rules="rules(item)" prop="value">
                                                <m-input-number
                                                    v-model="item.value"
                                                    class="has-btn-input-number"
                                                    :placeholder="
                                                        interval(item)
                                                            ? `${i18n.global.t('meos_control_web.setpoint_range_colon')}${interval(item)}`
                                                            : i18n.global.t('common.placeholder_input')
                                                    "
                                                    text-align="left"
                                                    width="200px"
                                                    controls="rightButton"
                                                >
                                                    <template #suffix> {{ item.unit }} </template>
                                                </m-input-number>
                                            </m-form-item>
                                            <div style="text-align: right">
                                                <m-button size="small" style="margin-right: 12px" @click="cancleFun(item)">{{ i18n.global.t('common.cancel') }}</m-button>
                                                <m-button type="primary" size="small" @click="checkForm(item, i)">{{ i18n.global.t('common.confirm') }}</m-button>
                                            </div>
                                        </template>
                                    </m-popover>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
                <div v-else class="fcc" style="height: 28px; color: var(--gray-500); width: 100%">{{ i18n.global.t('meos_control_web.no_data_point') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getValueStr } from '@/utils/viewUtils';
import { rules, interval, infoCodeMap, setStateFun } from '../../use-utils';
import { setOperatingParameters } from '@/apis/systemDiagram';
import { GET_MENU_CONFIG, SUCCESSCODE } from '@/utils/globalVariables';
import { EQUIPMENTCONTROL } from '../../../operationMonitoring/coolVariables';
import { useSuccessMessage } from '@/utils/tools';
import { MEOI_INSTANCE_DETAIL, CLOUD_ORIGIN } from '@/config';
import baseStore from '@/store/baseStore';
import { orderBy } from 'lodash';
import { getAuthParamsString } from '@/utils/envUtils';
import { openWebsite } from '@/utils/websiteNavigation';
import i18n from '@/localization';
import SetButton from '@/components/common/SetButton.vue';
import SetDiv from '@/components/common/SetDiv.vue';
const base = baseStore();
const PERMISSION = window[GET_MENU_CONFIG]?.()?.PERMISSION;

const props = defineProps({
    type: {
        type: String,
        default: ''
    },
    manualAutoSet: {
        type: Boolean,
        default: true
    },
    classCode: {
        type: String,
        default: ''
    },
    otherId: {
        type: String,
        default: ''
    },
    fan: {
        type: Object,
        default: () => ({})
    }
});
const systemId = inject('systemId', ref(''));
const iframeRefs = ref({});
const isEditRef = ref('');
const isEdit = ref(false);
const formRef = (el, key) => {
    if (el) {
        iframeRefs.value[key] = el;
    }
};
const itemInfo = item => {
    openWebsite(MEOI_INSTANCE_DETAIL, {
        params: `objId=${item.id}&${getAuthParamsString()}&f=MEOI_CatalogList&type=all`,
        newPage: true,
        origin: CLOUD_ORIGIN || ''
    });
};
const isEditBtn = (item, e) => {
    isEditRef.value = '';
    setTimeout(() => {
        // state.openOrCloseType = type
        isEditRef.value = e.target;
        isEdit.value = true;
    });
};
const cancleFun = data => {
    data.isEdit = false;
    isEdit.value = false;
    data.value = data.dataValue;
};
const checkForm = (item, i) => {
    console.log(iframeRefs.value);
    iframeRefs.value[`form${i}`].validate('').then(() => {
        editValue(item, true);
        isEdit.value = false;
    });
};
const equipmentNode = inject('equipmentNode', ref({}));
const enableCtrl = computed(() => {
    const data = equipmentNode?.value?.Iot?.runSet?.find(item => item.infoCode === (EQUIPMENTCONTROL()[props.classCode] || 'enableCtrl'));
    let name = '';
    if (!data) {
        return {
            data,
            name
        };
    }
    const value = structuredClone(data);
    if (props.manualAutoSet) {
        data.forceModel = '0';
    }
    if (value) {
        value.dataSource = value.dataSource?.sort((aa, bb) => bb.code * 1 - aa.code * 1);
        value.forceInfo = value.forceInfo.map(infoCodeMap);
        value.forceInfo = orderBy(value.forceInfo, ['ordered'], ['asc']);
        name = data?.dataSource?.find(item => item.code === value.dataValue)?.name || '--';
    }
    return {
        data: value,
        name
    };
});
const beforeConfirm = async (data, value, done) => {
    await editValue(data, false, value);
    done();
};
const showEnableCtrl = computed(() => enableCtrl.value?.data?.forceModel === '1' && !props.manualAutoSet);
const editValue = (data, type = true, value) => {
    const params = {
        objectId: props.fan.id,
        systemId: systemId.value,
        pointInfos: [
            {
                infoCode: data.infoCode,
                value: type ? data.value : value,
                content: i18n.global.t('meos_control_web.parameter_adjust'),
                beforeModify: data.dataValue
            }
        ]
    };
    setOperatingParameters(params).then(res => {
        if (res.code === SUCCESSCODE) {
            data.isEdit = false;
            useSuccessMessage();
        }
    });
};
const INFOCODE = ['equipSwitchSet', 'freq', 'equipFreqSet', 'switchStatusCtrl'];
const states = computed(() => setStateFun(props.fan, props.fan.classCode) || []);
const notAlwaysSet = computed(() => states.value.includes('local') || states.value.includes('fault') || states.value.includes('offline'));
const infoCodes = computed(() => {
    const arr = props.fan.infoCodes.filter(item => INFOCODE.includes(item.infoCode));
    arr.map(item => {
        item.isEdit = false;
        item.value = item.dataValue;
        return item;
    });
    const arr1 = [];
    let arr2 = [];
    arr.forEach(item => {
        if (item.dataSource) {
            arr1.push(item);
        }
    });
    arr.forEach(item => {
        if (!item.dataSource) {
            arr2.push(item);
        }
    });
    arr2 = orderBy(arr2, ['ordered'], ['asc']);
    return [...arr1, ...arr2];
});
watch(
    () => props.manualAutoSet,
    () => {
        if (props.manualAutoSet) {
            // forceModel.value = '0';
            console.log(equipmentNode.value.Iot.runSet);
        }
    }
);
</script>
<style lang="less" scoped>
.pd16 {
    padding: 16px;
}
.pd86 {
    padding: 8px 16px;
}

.btn-left:first-child {
    margin-right: 12px;
}
// .btn-left {
//     height: 19px;
// }
.get-position {
    position: absolute;
    left: 28%;
    top: 8px;
}
.get-position1 {
    position: absolute;
    left: 23%;
    top: 8px;
}
.get-position2 {
    position: absolute;
    left: 30%;
    top: 8px;
}
.status {
    width: 6px;
    height: 6px;
    background-color: #f55047;
    border-radius: 50%;
}
.get-line {
    width: 1px;
    height: 13px;
    background: #d9d9d9;
}
.lh {
    height: 28px;
}
.fan-water-box {
    background-color: #fff;
    // border-radius: 8px;
    margin-bottom: 12px;
    border-radius: 4px;
    border: 1px solid var(--gray-300, #e1e5eb);
    // &:hover {
    //     box-shadow: 0px 0.5px 3px 0px rgba(27, 33, 41, 0.08), 0px 3px 12px 0px rgba(27, 33, 41, 0.12);
    // }
    &.is-active-fan {
        border: 2px solid var(--blue-500);
        &:hover {
            box-shadow: none;
        }
    }
    .box-top {
        font-weight: 600;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--gray-300);
        height: 40px;
        :deep(.m-tag__content) {
            font-weight: 500;
            display: flex;
            align-items: center;
        }
        .close {
            filter: grayscale(1) brightness(1.3);
        }
        .offline {
            position: relative;
            & > img {
                filter: hue-rotate(3deg) grayscale(0.7) brightness(1.1) opacity(80%);
            }
            & > svg {
                position: absolute;
                left: 15px;
                transform: translateX(-50%);
            }
        }
    }
    .box-bottom {
        margin-top: 8px;
        .info-tag {
            margin-bottom: 8px;
        }
        .info-code {
            // height: 28px;
            & + .info-code {
                // margin-top: 16px;
            }
            &-name {
                // width: 84px;
                margin-right: 20px;
                color: #646a73;
            }
            &-value {
                // flex: 1;
                :deep(.m-button) {
                    // border-radius: 14px;
                    border-color: var(--gray-200);
                }
            }
        }
    }
}
.fan-water-box1 {
    margin-bottom: 8px;
}
.feb {
    display: flex;
    align-items: end;
    justify-content: space-between;
}

@media screen and (max-width: 1920px) {
    .fan-water-box1 {
        width: 210px;
    }
    .max-name {
        max-width: 140px;
    }
    .get-position1 {
        position: absolute;
        left: 18%;
        top: 8px;
    }
}
@media screen and (max-width: 1600px) {
    .fan-water-box1 {
        width: 170px;
    }
    .max-name {
        max-width: 105px;
    }
    .get-position1 {
        position: absolute;
        left: 23%;
        top: 8px;
    }
}
</style>
