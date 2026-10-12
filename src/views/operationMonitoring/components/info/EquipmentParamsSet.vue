<template>
    <div class="equipment-params-set">
        <div v-if="enableCtrl" class="enable-command set-box">
            <div v-if="manualAutoSet" class="enable-command-top">
                <div class="top-title fc">
                    <svg class="icon" aria-hidden="true" style="width: 16px; height: 16px; margin-top: 2px">
                        <use xlink:href="#icon-switch" />
                    </svg>
                    <span class="icon-name">{{ enableCtrl.name }}</span>
                    <span>{{ enableCtrlName }}</span>
                </div>
            </div>

            <div v-else class="enable-command-top">
                <div class="top-title fcb">
                    <div class="fcb">
                        <svg class="icon" aria-hidden="true" style="width: 16px; height: 16px; margin-top: 2px">
                            <use xlink:href="#icon-switch" />
                        </svg>
                        <span class="icon-name" style="max-width: 158px">{{ enableCtrl.name }}</span>
                        <span v-if="classCode === 'ACOTU' || classCode === 'ACCCCC' || classCode === 'ACCCSC'" v-ellipsis class="fs12 m-ellipsis info-item" style="color: #8b949e">
                            {{
                                classCode === 'ACOTU'
                                    ? i18n.global.t('meos_control_web.open_inlet_outlet_tower_valves_together')
                                    : i18n.global.t('meos_control_web.enable_interlock_pump_cooling_tower')
                            }}
                        </span>
                    </div>
                    <div v-if="!['ACCCCP', 'ACCCOP', 'ACCHCH', 'ACVVEJ', 'ACVVEO'].includes(classCode)" class="fc" style="width: 110px">
                        <span class="icon-name">{{ i18n.global.t('meos_control_web.forced_control') }}</span>
                        <SetDiv no-height>
                            <el-switch v-model="enableCtrl.forceModel" :disabled="!base.hasAuth(PERMISSION)" active-value="1" inactive-value="0" :before-change="changeForce" />
                        </SetDiv>
                    </div>
                </div>
                <div class="top-btn">
                    <div v-if="notAlwaysSet || (enableCtrl?.forceModel && enableCtrl?.forceModel === '1')" style="position: relative">
                        <SetButton
                            v-for="(item, index) in enableCtrl?.dataSource"
                            :key="item.code"
                            :content="enableCtrlContent()"
                            size="small"
                            disabled
                            type="link"
                            :class="[index == 0 ? 'mr12' : 'ml12']"
                        >
                            {{ item.name }}
                        </SetButton>
                        <div class="get-line ml10 mr10 get-position"></div>
                    </div>
                    <div v-else style="position: relative">
                        <m-popconfirm
                            v-for="(item, index) in enableCtrl?.dataSource"
                            :key="item.code"
                            status="primary"
                            :before-confirm="done => beforeConfirm(enableCtrl, item.code, done)"
                            :confirm-button-text="item.name"
                            :content="i18n.global.t('meos_control_web.confirm_to_equip_name', { name: item.name })"
                        >
                            <SetButton v-if="!base.hasAuth(PERMISSION)" size="small" type="link" :class="[index == 0 ? 'mr12' : 'ml12']">
                                {{ item.name }}
                            </SetButton>
                            <m-button v-else size="small" type="link" :class="[index == 0 ? 'mr12' : 'ml12']"> {{ item.name }}</m-button>
                        </m-popconfirm>
                        <div class="get-line ml10 mr10 get-position"></div>
                    </div>
                </div>
            </div>
            <div v-if="showEnableCtrl(enableCtrl)" class="enable-command-bottom">
                <div v-for="item in enableCtrl?.forceInfo" :key="item.infoCode" class="enum-item fc">
                    <div class="enum-item-name">{{ item.name }}</div>
                    <div class="enum-item-value">
                        <template v-if="notAlwaysSet && item.infoCode === 'equipSwitchSet'">
                            <!-- notAlwaysSet 产品逻辑中特殊信息点（对某种信息点进行有特殊产品逻辑，e.g:equipSwitchSet设备开关设定的特殊处理）的按钮 -->
                            <SetButton
                                v-for="(val, index) in item?.dataSource"
                                :key="val.code"
                                size="small"
                                :content="forceControlButtonHoverTipContent(item.infoCode)"
                                disabled
                                type="link"
                                :class="[index == 0 ? 'mr12' : 'ml12']"
                            >
                                {{ val.name }}
                            </SetButton>
                        </template>
                        <template v-else>
                            <m-popconfirm
                                v-for="(val, index) in item?.dataSource"
                                :key="val.code"
                                status="primary"
                                :before-confirm="done => beforeConfirm(item, val.code, done)"
                                :confirm-button-text="val.name"
                                :content="i18n.global.t('meos_control_web.confirm_to_equip_name', { name: val.name })"
                            >
                                <!-- 产品逻辑中普通的按钮 -->
                                <SetButton v-if="!base.hasAuth(PERMISSION)" size="small" type="link" :class="[index == 0 ? 'mr12' : 'ml12']">
                                    {{ val.name }}
                                </SetButton>
                                <m-button v-else size="small" type="link" :class="[index == 0 ? 'mr12' : 'ml12']"> {{ val.name }}</m-button>
                            </m-popconfirm>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="noEnumList.length" class="params-command set-box">
            <div v-for="(item, i) in noEnumList" :key="item.infoCode" :class="['params-command-item', manualAutoSet ? 'fc' : '']">
                <div class="fc mb12">
                    <svg v-if="item.infoCode === 'maxPLRSet'" class="icon" aria-hidden="true" style="width: 16px; height: 16px">
                        <use :xlink:href="' #icon-loadRate'" />
                    </svg>
                    <svg v-else class="icon" aria-hidden="true" style="width: 16px; height: 16px">
                        <use :xlink:href="classCode.includes('ACCC') ? '#icon-cooltem' : '#icon-pinglv'" />
                    </svg>
                    <span class="icon-name">{{ item.name }}</span>
                </div>
                <div class="item-value fc">
                    <span v-if="!item.isEdit">
                        {{ getValueStr(item).text }}
                        <template v-if="!manualAutoSet && base.hasAuth(PERMISSION)">
                            <template v-if="classCode === 'ACCCCC' || classCode === 'ACCCSC'">
                                <m-tips v-if="notAlwaysSet" :content="forceControlButtonHoverTipContent(item.infoCode)" theme="darkTransparent">
                                    <span class="btn-span" style="margin-left: 12px; color: #8b949e; cursor: not-allowed">{{ i18n.global.t('meos_control_web.modify') }}</span>
                                </m-tips>
                                <span v-else class="btn-span" style="margin-left: 12px" @click="editBtn(item)">{{ i18n.global.t('meos_control_web.modify') }}</span>
                            </template>
                            <template v-else>
                                <span class="btn-span" style="margin-left: 12px" @click="editBtn(item)">{{ i18n.global.t('meos_control_web.modify') }}</span>
                            </template>
                        </template>
                    </span>
                    <template v-if="item.isEdit && !manualAutoSet">
                        <template v-if="item.infoCode === 'maxPLRSet'">
                            <m-form-item :ref="el => formRef(el, 'form' + i)" label="" :item-model="item.value" :rules="rules(item)" style="--m-form-item-margin: 0" prop="value">
                                <m-input-number
                                    v-model="item.value"
                                    class="has-btn-input-number"
                                    :placeholder="
                                        interval(item) ? `${i18n.global.t('meos_control_web.setpoint_range_colon')}${interval(item)}` : i18n.global.t('common.placeholder_input')
                                    "
                                    text-align="left"
                                    width="200px"
                                    controls="rightButton"
                                    :min="0"
                                    :max="100"
                                >
                                    <template #suffix> {{ item.unit }} </template>
                                </m-input-number>
                            </m-form-item>
                        </template>
                        <template v-else>
                            <m-form-item :ref="el => formRef(el, 'form' + i)" label="" :item-model="item.value" :rules="rules(item)" style="--m-form-item-margin: 0" prop="value">
                                <m-input-number
                                    v-model="item.value"
                                    class="has-btn-input-number"
                                    :placeholder="
                                        interval(item) ? `${i18n.global.t('meos_control_web.setpoint_range_colon')}${interval(item)}` : i18n.global.t('common.placeholder_input')
                                    "
                                    text-align="left"
                                    width="200px"
                                    controls="rightButton"
                                >
                                    <template #suffix> {{ item.unit }} </template>
                                </m-input-number>
                            </m-form-item>
                        </template>
                        <span class="btn-span" style="margin-left: 12px" @click="checkForm(item, i)"> {{ i18n.global.t('common.save') }} </span>
                        <span style="margin-left: 12px; cursor: pointer" @click="cancleFun(item)">{{ i18n.global.t('common.cancel') }}</span>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getValueStr } from '@/utils/viewUtils';
import { rules, interval, getState, infoCodeMap } from '../../use-utils';
import { changeLinkForceControlStatus, setOperatingParameters } from '@/apis/systemDiagram';
import { GET_MENU_CONFIG, SUCCESSCODE } from '@/utils/globalVariables';
import { EQUIPMENTCONTROL, HOVEREQUIPMENTTIPS } from '../../../operationMonitoring/coolVariables';
import baseStore from '@/store/baseStore';
const base = baseStore();
import { useSuccessMessage } from '@/utils/tools';
import emitter from '@/utils/bus';
import { orderBy } from 'lodash';
import { useRoute } from 'vue-router';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import i18n from '@/localization';
import SetDiv from '@/components/common/SetDiv.vue';
import SetButton from '@/components/common/SetButton.vue';
const { PERMISSION } = window[GET_MENU_CONFIG]();

const route = useRoute();
const props = defineProps({
    manualAutoSet: {
        type: Boolean,
        default: true
    },
    classCode: {
        type: String,
        default: ''
    }
});
const equipmentNode = inject('equipmentNode', ref({}));
const systemId = inject('systemId', ref(''));
const iframeRefs = ref({});
const temporarilyEditValue = ref('');
const noEnumList = computed(() => {
    const data = equipmentNode.value.Iot.runSet.filter(item => !item.dataSource?.length);
    data.forEach(item => {
        item.value = item.dataValue;
        item.isEdit = false;
    });
    if (props.manualAutoSet) {
        data.forEach(item => {
            item.isEdit = false;
        });
    }
    console.log('equipmentNode.value: ', equipmentNode.value);
    console.log('data', data);
    return data;
});
// watch(
//     equipmentNode,
//     v => {
//         console.log(v, '-------');
//         setNoEnumList();
//     },
//     { deep: true }
// );
// const noEnumList = ref([]);
// const setNoEnumList = () => {
//     const data = equipmentNode.value.Iot.runSet.filter(item => !item.dataSource?.length);
//     data.forEach(item => {
//         item.value = item.dataValue;
//         item.isEdit = false;
//     });
//     noEnumList.value = data;
// };

// watch(
//     () => props.manualAutoSet,
//     v => {
//         setNoEnumList();
//     },
//     { immediate: true }
// );
const states = getState.value(equipmentNode.value, unref(props).classCode);
const notAlwaysSet = computed(() => {
    if (props.classCode !== 'ACOTU') {
        return states.includes('local') || states.includes('fault') || states.includes('offline');
    }
    return false;
});
// const NOENABLECTRL = ['ACCCCP', 'ACCCOP', 'ACGEHE', 'ACCCOF']
const enableCtrlName = ref('');
const enableCtrl = ref({});
const setEnableCtrl = () => {
    const data = equipmentNode.value.Iot.runSet.find(item => item.infoCode === (EQUIPMENTCONTROL()[props.classCode] || 'enableCtrl'));
    let name = '';
    const value = structuredClone(data);
    // 强制控制信息点取forceInfo
    if (value) {
        value.dataSource = value.dataSource?.sort((aa, bb) => bb.code * 1 - aa.code * 1);
        if (value.forceInfo) {
            value.forceInfo = value.forceInfo.map(infoCodeMap);
            value.forceInfo = orderBy(value.forceInfo, ['ordered'], ['asc']);
        }
        name = data?.dataSource?.find(item => item.code === value.dataValue)?.name || '--';
    }
    enableCtrlName.value = name;
    enableCtrl.value = structuredClone(value);
    console.log(enableCtrl.value, '11111');
};
const showEnableCtrl = data => data?.forceModel && data?.forceModel === '1' && data?.forceInfo && data?.forceInfo?.length > 0 && !props.manualAutoSet;
const hoverTipContent = (code = '') => {
    // 当冷机处于故障、离线和远程的任意一个状态时，不可执行开启和关闭操作；Hover提示“冷机处于故障、离线和远程的任意一个状态时，不可执行此操作”
    if (notAlwaysSet.value) {
        // return hoverEquipmentTipsObject()[props.classCode + code] + HOVEREQUIPMENTTIPS;
        return i18n.global.t('meos_control_web.equipment') + HOVEREQUIPMENTTIPS();
    }
    return '';
};
// 此处的代码逻辑需要优化！
const enableCtrlContent = computed(() => (code = '') => {
    // 当打开强制开关后，联动控制的“启用命令”均置灰不可操作，Hover提示“强制控制中，不可执行此操作”
    if (enableCtrl.value?.forceModel && enableCtrl.value?.forceModel === '1') {
        return i18n.global.t('meos_control_web.forced_control_active_action_denied');
    }
    return hoverTipContent(code);
});
// 强制控制时出现的按钮使用的HoverTip内容
const forceControlButtonHoverTipContent = computed(() => (code = '') => {
    return hoverTipContent(code);
});

const formRef = (el, key) => {
    if (el) {
        iframeRefs.value[key] = el;
    }
};
const cancleFun = data => {
    data.isEdit = false;
    data.value = data.dataValue;
};
const checkForm = (item, i) => {
    iframeRefs.value[`form${i}`].validate('').then(() => {
        editValue(item, true);
    });
};
const { controlFn } = useGeneralControl();
const editValue = async (data, type = true, value) => {
    const params = {
        objectId: equipmentNode.value.id,
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
    if (route.fullPath.includes('ACCI')) {
        const obj = {
            // 这里填写需要传递的参数
            objectIds: [equipmentNode.value.id],
            systemId: systemId.value,
            infoCode: data.infoCode,
            infoValue: type ? data.value : value,
            content: i18n.global.t('meos_control_web.parameter_adjust')
        };
        controlFn({
            data: obj,
            callback: res => {
                if (res.code === SUCCESSCODE) {
                    data.isEdit = false;
                    useSuccessMessage();
                }
            }
        });
        return;
    }
    const res = await setOperatingParameters(params);
    if (res.code === SUCCESSCODE) {
        data.isEdit = false;
        useSuccessMessage();
    }
};
const editBtn = item => {
    item.isEdit = true;
    temporarilyEditValue.value = item.value;
};
const refreshEqFun = data => {
    if (equipmentNode.value.id === data.objectId) {
        const arr = enableCtrl.value?.forceInfo || [];
        if (arr?.length === 0) {
            return;
        }
        for (const item of arr) {
            if (item.infoCode === data.infoCode) {
                item.dataValue = data.dataValue;
                return;
            }
        }
    }
};
const beforeConfirm = async (data, value, done) => {
    await editValue(data, false, value);
    done();
};
const changeForce = () => {
    // eslint-disable-next-line no-nested-ternary
    const forceModel = enableCtrl.value?.forceModel ? (enableCtrl.value?.forceModel === '0' ? '1' : '0') : '1';
    changeLinkForceControlStatus({
        model: forceModel,
        systemId: systemId.value,
        objectId: equipmentNode.value.id,
        infoCode: EQUIPMENTCONTROL()[props.classCode] || 'enableCtrl',
        classCode: props.classCode
    }).then(res => {
        if (res.code === SUCCESSCODE && res.data) {
            nextTick(() => {
                if (forceModel === '1') {
                    enableCtrl.value.forceModel = '1';
                } else {
                    const noenablectrl = ['ACGEHE'].includes(props.classCode);
                    const value = res.data.find(val => val.infoCode === (noenablectrl ? 'equipSwitchSet' : 'enableCtrl'))?.forceModel;
                    enableCtrl.value.forceModel = value || '0';
                }
                equipmentNode.value.Iot.runSet.forEach(item => {
                    const noenablectrl = ['ACGEHE'].includes(props.classCode);
                    if (item.infoCode === (noenablectrl ? 'equipSwitchSet' : 'enableCtrl')) {
                        item.forceModel = enableCtrl.value.forceModel;
                    }
                });
                useSuccessMessage();
            });
        }
    });
    return false;
};
watch(
    () => props.manualAutoSet,
    () => {
        if (props.manualAutoSet && enableCtrl.value) {
            enableCtrl.value.forceModel = '0';
        }
    },
    { immediate: true }
);

onMounted(() => {
    emitter.on('refreshEqFun', refreshEqFun);
    setEnableCtrl();
});
onUnmounted(() => {
    emitter.off('refreshEqFun', refreshEqFun);
});
</script>
<style lang="less" scoped>
@media screen and (max-width: 1920px) {
    .info-item {
        width: 180px !important;
    }
}
@media screen and (min-width: 1920px) {
    .info-item {
        width: 180px !important;
    }
}
@media screen and (max-width: 1600px) {
    .info-item {
        width: 100px !important;
    }
}
.btn-span {
    color: #246fe5;
    cursor: pointer;
}
.btn-left:first-child {
    margin-right: 12px;
}
.get-position {
    position: absolute;
    left: 37%;
    top: 7px;
}
.get-line {
    width: 1px;
    height: 15px;
    background: #d9d9d9;
}
.equipment-params-set {
    .set-box {
        padding: 16px;
        background-color: var(--gray-100);
        border: 1px solid var(--gray-200);
        border-radius: var(--big-radius);
        .icon-name {
            margin-left: 4px;
            margin-right: 8px;
            color: #646a73;
        }
    }
    .set-box + .set-box {
        margin-top: 16px;
    }

    .enable-command {
        // margin-left: 8px;
        &-top {
            .top-title {
                height: 24px;
                :deep(.el-switch) {
                    height: 24px;
                    line-height: 24px;
                    .el-switch__core {
                        --el-switch-off-color: var(--gray-400);
                    }
                }
            }
            .top-btn {
                margin-top: 12px;
                margin-left: 20px;
                display: flex;
            }
        }
        &-bottom {
            border-top: 1px solid var(--gray-300);
            margin-top: 16px;
            padding: 16px 20px 0 20px;
            .enum-item {
                & + .enum-item {
                    margin-top: 22px;
                }
                :deep(.m-button) {
                    // border-radius: 14px;
                    // border-color: var(--gray-200);
                }
                &-name {
                    color: var(--gray-600);
                    width: 174px;
                }
            }
        }
    }
    .params-command {
        // margin-left: 8px;
        padding-bottom: 4px;
        &-item {
            &.fc {
                .item-value {
                    margin-top: 0;
                }
            }
            .item-value {
                margin-left: 20px;
                height: 32px;
                margin-top: 8px;
                margin-bottom: 12px;
            }
        }
    }
}
</style>
