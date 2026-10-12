<template>
    <div class="monitoring-equipment-control">
        <div v-if="enableCtrl?.length" class="switch-setting">
            <div v-for="(items, indexs) in enableCtrl" :key="indexs" class="fb">
                <div class="fc">
                    <div v-ellipsis class="ft f14 m-ellipsis setting-name">{{ items.name }}：</div>
                    <div class="f14">{{ getValueStr(items).text }}</div>
                </div>
                <div class="f setting-item">
                    <!-- classCode == 'ACGEFP'==补水泵  notAlwaysSet:是否处于本地或离线 -->
                    <template v-if="notAlwaysSet">
                        <template v-if="!manualAutoSet">
                            <SetButton v-for="(val, index) in items?.dataSource" :key="index" size="small" disabled type="link" :content="hoverTipContent()">
                                {{ val.name }}
                            </SetButton>
                        </template>
                    </template>
                    <template v-else>
                        <template v-if="!manualAutoSet">
                            <m-popconfirm
                                v-for="item in items?.dataSource"
                                :key="item.code"
                                status="primary"
                                :before-confirm="done => beforeConfirm(items, item.code, done)"
                                :confirm-button-text="item.name"
                                :content="i18n.global.t('meos_control_web.confirm_to_equip_name', { name: item.name })"
                            >
                                <SetButton v-if="!base.hasAuth(PERMISSION)" size="small" type="link"> {{ item.name }} </SetButton>
                                <m-button v-else size="small" type="link"> {{ item.name }} </m-button>
                            </m-popconfirm>
                        </template>
                    </template>
                </div>
            </div>
        </div>
        <div v-if="noEnumList?.length">
            <div v-for="(item, index) in noEnumList" :key="index" class="semperature-setting mt8">
                <div class="ft f14">{{ item.name }}</div>
                <span v-if="!item.isEdit" class="fc mt8">
                    <div class="f16">
                        {{ getValueStr(item).text }}
                    </div>
                    <template v-if="!manualAutoSet">
                        <m-tips v-if="notAlwaysSet" :content="hoverTipContent()" theme="darkTransparent">
                            <SetButton size="small" type="link" class="ml8" disabled>{{ i18n.global.t('meos_control_web.modify') }}</SetButton>
                        </m-tips>
                        <template v-else>
                            <SetButton size="small" type="link" class="ml8" @click="item.isEdit = true">{{ i18n.global.t('meos_control_web.modify') }}</SetButton>
                        </template>
                    </template>
                </span>
                <template v-if="item.isEdit && !manualAutoSet">
                    <div class="fc mt8">
                        <m-form-item :ref="el => formRef(el, 'form' + index)" label="" :item-model="item.value" :rules="rules(item)" style="--m-form-item-margin: 0" prop="value">
                            <m-input-number
                                v-model="item.value"
                                class="has-btn-input-number"
                                :placeholder="
                                    interval(item) ? `${i18n.global.t('meos_control_web.setpoint_range_colon')}${interval(item)}` : i18n.global.t('common.placeholder_input')
                                "
                                text-align="left"
                                width="150px"
                                controls="rightButton"
                            >
                                <template #suffix> {{ item.unit }} </template>
                            </m-input-number>
                        </m-form-item>
                        <div class="ml28">
                            <m-button size="small" type="link" class="ml8" @click="checkForm(item, index)"> {{ i18n.global.t('common.save') }} </m-button>
                            <m-button size="small" type="text" class="cancleBtn" @click="cancleFun(item)">{{ i18n.global.t('common.cancel') }}</m-button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script setup>
import { getValueStr } from '@/utils/viewUtils';
import { rules, interval, getState } from '../../use-utils';
import emitter from '@/utils/bus';
import { GET_MENU_CONFIG, SUCCESSCODE } from '@/utils/globalVariables';
import { useSuccessMessage } from '@/utils/tools';
import { setOperatingParameters } from '@/apis/systemDiagram';
import baseStore from '@/store/baseStore';
import { EQUIPMENTCONTROL } from '../../../ACoperationMonitoring/coolVariables';
import i18n from '@/localization';
import SetButton from '@/components/common/SetButton.vue';
const PERMISSION = window[GET_MENU_CONFIG]?.()?.PERMISSION;

const base = baseStore();
const equipmentNode = inject('equipmentNode', ref({}));
const systemId = inject('systemId', ref(''));
const iframeRefs = ref({});
const enableCtrl = ref([]);
const isEdit = ref(false);
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
const hoverTipContent = () => {
    // 当冷机处于离线和远程的任意一个状态时，不可执行开启和关闭操作；Hover提示“冷机处于故障、离线和远程的任意一个状态时，不可执行此操作”
    if (props.classCode === 'ACGEFP') {
        return i18n.global.t('meos_control_web.equipment_offline_local_switch_denied');
    }
    return i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding');
};
const states = getState.value(equipmentNode.value, unref(props).classCode);
const notAlwaysSet = computed(() => {
    if (props.classCode === 'ACGEFP') {
        return (
            (equipmentNode.value.stateInfoCode.onlineStatus && equipmentNode.value.stateInfoCode.onlineStatus === '0') ||
            (equipmentNode.value.stateInfoCode.localRemoteStatus && equipmentNode.value.stateInfoCode.localRemoteStatus === '0')
        );
    } else {
        // 其他设备受权限控制
        return !base.hasAuth(PERMISSION);
    }
});
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
    return data;
});

const beforeConfirm = async (data, value, done) => {
    await editValue(data, false, value);
    done();
};
const formRef = (el, key) => {
    if (el) {
        iframeRefs.value[key] = el;
    }
};
const checkForm = (item, i) => {
    iframeRefs.value[`form${i}`].validate('').then(() => {
        editValue(item, true);
    });
};
const editValue = async (data, type = true, value) => {
    console.log(data, type, value, 'data');
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
    const res = await setOperatingParameters(params);
    if (res.code === SUCCESSCODE) {
        data.isEdit = false;
        useSuccessMessage();
    }
};
const cancleFun = data => {
    data.isEdit = false;
    isEdit.value = false;
    data.value = data.dataValue;
};
const setEnableCtrl = () => {
    const data = equipmentNode.value.Iot.runSet.find(item => item.infoCode === EQUIPMENTCONTROL()[props.classCode]);
    const value = structuredClone(data);
    if (value) {
        enableCtrl.value.push(data);
    }
    console.log(equipmentNode.value.Iot.runSet, data, enableCtrl.value, '2222');
};

onMounted(() => {
    emitter.on('refreshEqFun', refreshEqFun);
    setEnableCtrl();
});
onUnmounted(() => {
    emitter.off('refreshEqFun', refreshEqFun);
});

const refreshEqFun = data => {
    if (equipmentNode.value.id === data.objectId) {
        const arr = enableCtrl?.value || [];
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
</script>
<style lang="less" scoped>
.monitoring-equipment-control {
    .switch-setting,
    .semperature-setting {
        border-radius: 4px;
        border: 1px solid var(--gray-200, #e8ecf0);
        background: #f1f4f6;
        padding: 12px 18px;
        .setting-item {
            width: 135px;
            flex-wrap: wrap;
            justify-content: flex-end;
        }
    }
    .cancleBtn {
        margin-left: 6px !important;
    }
}
.auto-set {
    margin-bottom: 12px;
}
.auto-set-radio {
    width: 100%;
    &-item {
        height: 58px;
        padding: 0 20px;
        width: 100%;
        border-radius: 4px;
        border: 1px solid var(--gray-400);
        background: var(--gray-0);
        &.is-active {
            border: 1px solid var(--blue-500);
            background-color: var(--blue-50);
        }
        .m-radio {
            width: 100%;
        }
        p {
            padding-left: 24px;
            margin-top: 8px;
            font-size: 12px;
            color: var(--gray-500);
        }
        & + .auto-set-radio-item {
            margin-left: 16px;
        }
    }
}
.auto-set-time {
    height: 22px;
    .time {
        cursor: pointer;
        color: var(--blue-500);
    }
    .text {
        color: #8b949e;
    }
}
</style>
