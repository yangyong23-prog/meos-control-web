<template>
    <div class="auto-set">
        <div class="auto-set-radio fcc">
            <m-radio-group v-model="model" @change="change">
                <m-tips
                    v-for="item in list"
                    :key="item.model"
                    theme="darkTransparent"
                    :disabled="base.hasAuth(PERMISSION)"
                    :content="i18n.global.t('meos_control_web.no_operation_permission_contact_admin_for_adding')"
                    placement="top"
                >
                    <div class="auto-set-radio-item fc" :class="{ 'is-active': model === item.model }">
                        <m-radio :label="item.model" :disabled="!base.hasAuth(PERMISSION)" class="f14">{{ item.name }}</m-radio>
                    </div>
                </m-tips>
            </m-radio-group>
        </div>
        <div v-if="oldModel === '0' && expireTimeValue" class="auto-set-time fc">
            <SetDiv class="time" @click="showTime">{{ dayjs(expireTimeValue).format('YYYY.MM.DD HH:mm') }}</SetDiv>
            <span class="text">&nbsp;&nbsp;{{ i18n.global.t('meos_control_web.restore_to_auto_mode') }}</span>
        </div>
        <EquipmentAutoSet v-if="showAutoControl" :id="id" :model="model === '1' ? '0' : '1'" @close="close" />
        <m-popover
            virtual-triggering
            :virtual-ref="controlTimePopRef"
            class="control-time-pop"
            trigger="manually"
            placement="left"
            style="height: auto"
            :is-open="showControlTimePop"
        >
            <template #content>
                <m-form ref="Mform" label-width="200px" :model="params" label-position="top" require-asterisk-position="right">
                    <m-form-item
                        :label="i18n.global.t('meos_control_web.end_time')"
                        prop="time"
                        :rules="[
                            { required: true, message: EMPTYTEXT, trigger: 'change' },
                            { validator: (value, rule, callback) => validateLessNow(params.time, callback), trigger: 'change' }
                        ]"
                    >
                        <m-date-picker
                            v-model="params.time"
                            type="datetime"
                            placement="bottomRight"
                            :popover-attrs="{
                                arrowOverflow: false
                            }"
                            :placeholder="i18n.global.t('meos_control_web.please_select')"
                            :scope="SCOPE()"
                            :time-picker="{
                                stepM: 5,
                                format: 'hm'
                            }"
                        />
                    </m-form-item>

                    <div style="text-align: right; padding-top: 6px">
                        <m-button size="small" style="margin-right: 12px" @click="showControlTimePop = false">{{ i18n.global.t('common.cancel') }}</m-button>
                        <m-button type="primary" size="small" @click="sumbit">{{ i18n.global.t('meos_control_web.submit') }}</m-button>
                    </div>
                </m-form>
            </template>
        </m-popover>
    </div>
</template>

<script setup>
import EquipmentAutoSet from './EquipmentAutoSet.vue';
import { MMessageBox } from 'meri-plus';
import { changeManualAutoStatusByObjectId, changeManualExpireTimeByObjectId } from '@/apis/systemDiagram';
import { EMPTYTEXT, SUCCESSCODE, SCOPE, GET_MENU_CONFIG } from '@/utils/globalVariables';
import { useSuccessMessage, validateLessNow } from '@/utils/tools';
import baseStore from '@/store/baseStore';
import i18n from '@/localization';
const base = baseStore();
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import SetDiv from '@/components/common/SetDiv.vue';

const PERMISSION = window[GET_MENU_CONFIG]?.().PERMISSION;
const props = defineProps({
    manualAutoSet: {
        type: Boolean,
        default: true
    },
    id: {
        type: String,
        default: ''
    },
    expireTime: {
        type: String,
        default: ''
    }
});

const getRunMode = inject('getRunMode');
const expireTimeValue = inject('expireTime', ref(''));
const showAutoControl = ref(false);
const systemId = inject('systemId', ref(''));
const controlTimePopRef = ref();
const showControlTimePop = ref();
const Mform = ref();
const model = ref(unref(props).manualAutoSet ? '1' : '0');
const oldModel = ref(unref(props).manualAutoSet ? '1' : '0');
const list = ref([
    { name: i18n.global.t('meos_control_web.auto_mode'), model: '1' },
    { name: i18n.global.t('meos_control_web.manual_mode'), model: '0' }
]);
const change = () => {
    // 0手动，1自动
    nextTick(() => {
        if (oldModel.value === model.value) {
            return;
        }
        if (oldModel.value === '0' && model.value === '1') {
            model.value = oldModel.value;
            const title = i18n.global.t('meos_control_web.acknowledge_switch_to_auto');
            MMessageBox({
                title,
                customClass: 'customClass',
                hasLoading: true,
                titleHidden: true,
                message: i18n.global.t('meos_control_web.switch_to_auto_control'),
                beforeClose: (action, _data, done) => {
                    if (action === 'confirm') {
                        changeManualAutoStatusByObjectId({
                            systemId: systemId.value,
                            objectId: props.id,
                            model: '1',
                            expireTime: '',
                            operateType: '',
                            operateReason: '',
                            contentInfo: ''
                        }).then(res => {
                            if (res.code === SUCCESSCODE) {
                                emitter.emit('refreshNotify', 'query');
                                useSuccessMessage();
                                done();
                            } else {
                                done();
                            }
                        });
                    } else {
                        close();
                        done();
                    }
                }
            });
            return;
        }
        model.value = oldModel.value;
        showAutoControl.value = true;
    });
};

const params = ref({ time: unref(props).expireTime ? dayjs(unref(props).expireTime).format('YYYY.MM.DD HH:mm') : '' });
const close = () => {
    showAutoControl.value = false;
};
const showTime = e => {
    controlTimePopRef.value = e;
    showControlTimePop.value = true;
    params.value.time = props.expireTime ? dayjs(props.expireTime).format('YYYY.MM.DD HH:mm') : '';
};
const sumbit = () => {
    Mform.value.validate(valid => {
        if (valid) {
            changeManualExpireTimeByObjectId({
                systemId: systemId.value,
                objectId: props.id,
                expireTime: dayjs(params.value.time).format('YYYYMMDDHHmm00')
            }).then(res => {
                if (res.code === SUCCESSCODE) {
                    useSuccessMessage();
                    showControlTimePop.value = false;
                    getRunMode(props.id, systemId.value, (_type, time) => {
                        expireTimeValue.value = time;
                    });
                }
            });
        }
    });
};
watch(
    () => props.manualAutoSet,
    () => {
        model.value = props.manualAutoSet ? '1' : '0';
        oldModel.value = props.manualAutoSet ? '1' : '0';
    }
);
</script>

<style lang="less" scoped>
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
