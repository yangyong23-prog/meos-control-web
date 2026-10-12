<template>
    <m-popover ref="popoverRef" class="popover-manual-modal" :trigger="trigger" :placement="placement" :offset="offset" :is-open="true" @click-event="clickEvent">
        <template #content>
            <div v-if="manualAutoSetAll?.includes('1')" class="manual-custom-wrap">
                <div class="confirm-message">
                    {{
                        i18n.global.t('meos_control_web.confirm_to_open_loop', {
                            set: equipSwitchSet === '1' ? i18n.global.t('common.status_open') : i18n.global.t('common.status_close'),
                            num: objectIds?.length
                        })
                    }}
                </div>
                <div class="confirm-box">
                    <div class="top">{{ i18n.global.t('meos_control_web.contains_auto_lighting_loop') }}{{ autoSet.length }}</div>
                    <div class="bottom">{{ i18n.global.t('meos_control_web.manual_mode_required_confirm') }}</div>
                </div>
                <div class="text-wrap">
                    <span>{{ i18n.global.t('meos_control_web.manual_deadline') }}</span>
                    <span class="icon"> *</span>
                </div>
                <m-date-picker
                    v-model="time"
                    width="290"
                    :scope="scopeTime"
                    :error-info="showError && !time ? i18n.global.t('meos_control_web.please_input_required') : ''"
                    type="datetime"
                    :time-picker="{
                        stepM: 5,
                        format: 'hm'
                    }"
                    @change="timeChange"
                ></m-date-picker>
                <p class="text-wrap">{{ i18n.global.t('meos_control_web.reason') }}</p>
                <m-input
                    v-model="inputValue"
                    :type="'textarea'"
                    :placeholder="i18n.global.t('common.placeholder_input')"
                    :maxlength="{ length: 200, errorText: i18n.global.t('meos_control_web.max_200_chars') }"
                    :width="100"
                    :height="140"
                    show-word-limit
                    style="resize: none"
                >
                </m-input>
                <section class="btn-wrap">
                    <m-button type="default" size="small" style="margin-right: 12px" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" :loading="loading" @click="save">{{ i18n.global.t('common.confirm') }}</m-button>
                </section>
            </div>
            <div v-else class="popover-custom-wrap">
                <section class="header-wrap">
                    <div class="left">
                        <IconMeriComponentDialogWarning :size="24" color="#246FE5"></IconMeriComponentDialogWarning>
                    </div>
                    <div class="right">
                        {{
                            i18n.global.t('meos_control_web.confirm_to_open_loop', {
                                set: equipSwitchSet === '1' ? i18n.global.t('common.status_open') : i18n.global.t('common.status_close'),
                                num: objectIds?.length
                            })
                        }}
                    </div>
                </section>
                <section class="btn-wrap">
                    <m-button type="default" size="small" style="margin-right: 12px" @click="cancel">{{ i18n.global.t('common.cancel') }}</m-button>
                    <m-button type="primary" size="small" :loading="loading" @click="save">{{ i18n.global.t('common.confirm') }}</m-button>
                </section>
            </div>
        </template>
        <slot></slot>
    </m-popover>
</template>
<script setup>
import { $Message } from 'meri-plus';
import { useGeneralControl } from '@/hooks/useGeneralControl';
import { IconMeriComponentDialogWarning } from 'meri-icon';
import i18n from '@/localization';
import { OBJ_TYPE } from '@/utils/globalVariables';

const { controlFn } = useGeneralControl();
const emit = defineEmits(['cancel', 'save', 'showMessageBox']);
const props = defineProps({
    trigger: {
        type: String,
        default: 'click'
    },
    placement: {
        type: String,
        default: 'bottom-start'
    },
    type: {
        type: String,
        default: ''
    },
    offset: {
        type: Number,
        default: 8
    },
    tipClick: {
        type: Boolean
    },
    objectIds: {
        type: Array,
        default: () => []
    },
    equipSwitchSet: {
        type: String
    }
});
const manualAutoSetAll = inject('manualAutoSetAll');
const autoSet = inject('autoSet'); // 自动照明回路数量
const templateType = inject('templateType');
const scopeTime = inject('scopeTime');
watch(
    () => props.tipClick,
    v => {
        if (!v) {
            popoverRef.value.manuallyHide();
            // 打开弹框默认showError为false
            showError.value = false;
            inputValue.value = '';
            time.value = '';
        }
    }
);

const loading = ref(false);

const popoverRef = ref();

const showError = ref(false);

const time = ref('');

const inputValue = ref('');

const timeChange = value => {
    if (!value) {
        showError.value = true;
    }
};

const save = async () => {
    loading.value = true;
    if (manualAutoSetAll?.value?.includes('1')) {
        showError.value = true;
        if (!time.value) {
            loading.value = false;
            return $Message.error({ title: i18n.global.t('meos_control_web.please_input_required') });
        }
    }
    popoverRef.value.manuallyHide();
    let params = {
        infoValue: '0',
        objectIds: props.objectIds,
        objectType: OBJ_TYPE.EQUIPMENT,
        infoCode: 'manualAutoSet',
        content: inputValue.value
    };
    if (manualAutoSetAll?.value?.includes('1')) {
        params.expireTime = time.value.replaceAll('.', '').replaceAll(':', '').replaceAll(' ', '') + '00';
    }
    try {
        await controlFn({
            data: params,
            callback: () => {}
        });
        await controlFn({
            data: {
                objectIds: params.objectIds,
                infoValue: props.equipSwitchSet,
                infoCode: 'equipSwitchSet'
            },
            callback: responseData => {
                if (responseData.code === '00000') {
                    emit('showMessageBox', responseData, props.equipSwitchSet);
                    emit('save');
                }
            }
        });
    } catch (err) {
        $Message.error({ title: i18n.global.t('meos_control_web.failed_please_retry') });
    } finally {
        loading.value = false;
    }
};

const cancel = () => {
    popoverRef.value.manuallyHide();
    // 打开弹框默认showError为false
    showError.value = false;
    inputValue.value = '';
    time.value = '';
    emit('cancel');
};

const clickEvent = e => {
    popoverRef.value.manuallyOpen();
};

defineExpose({ popoverRef });
</script>
<style lang="less" scoped>
.manual-custom-wrap {
    padding: 4px 8px;
    .confirm-message {
        color: #2e3742;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        height: 22px;
        line-height: 22px;
    }
    .confirm-box {
        width: 290px;
        height: 76px;
        border-radius: 4px;
        border: 1px solid #ffe399;
        background: #fffbe6;
        padding: 4px 10px 6px 10px;
        margin: 16px 0;
        .top {
            color: #2e3742;
            font-family: 'Microsoft YaHei';
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            height: 22px;
            line-height: 22px;
            margin-bottom: 4px;
        }
        .bottom {
            color: #626c78;
            font-family: 'Microsoft YaHei';
            font-size: 12px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 20px;
        }
    }
    .text-wrap {
        height: 22px;
        color: #646a73;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        font-style: normal;
        line-height: 22px;
        margin-bottom: 8px;
        .icon {
            color: @red-500;
        }
    }
    > p {
        margin: 16px 0 8px 0;
    }
    .btn-wrap {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
}
.popover-custom-wrap {
    padding: 12px 8px 4px 8px;
    width: 274px;
    .btn-wrap {
        margin-top: 16px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .header-wrap {
        height: 48px;
        display: flex;
        .left {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .right {
            flex: 1;
            color: @grey-600;
            font-family: 'PingFang SC';
            font-size: 14px;
            font-style: normal;
            font-weight: var(--platform-font-weight);
            line-height: 22px; /* 157.143% */
            white-space: normal;
            text-wrap: wrap;
            min-width: 0;
        }
    }
}
</style>
<style>
.popover-manual-modal {
    border-radius: 8px !important;
}
</style>
