<template>
    <m-modal
        v-model:visible="show"
        :append-to="$modalAppendTo"
        modal-class-name="auto-control-modal"
        type="default"
        :title="i18n.global.t('meos_control_web.switch_to_manual_mode_dup')"
        :width="600"
        @close="close"
    >
        <template #content>
            <m-form ref="Mform" label-width="276px" :model="params" label-position="top" require-asterisk-position="right">
                <m-form-item
                    :label="i18n.global.t('meos_control_web.end_time')"
                    prop="expireTime"
                    require-asterisk-position="null"
                    :rules="[
                        { required: true, message: EMPTYTEXT, trigger: 'change' },
                        {
                            validator: (_value, _rule, callback) => validateLessNow(params.expireTime, callback),
                            trigger: 'change'
                        }
                    ]"
                >
                    <template #label>
                        {{ i18n.global.t('meos_control_web.end_time') }}
                        <span style="color: var(--red-500)">&nbsp;*&nbsp;</span>
                        <span class="fs12" style="color: var(--gray-500)">{{ i18n.global.t('meos_control_web.device_returns_auto_after_end_time') }}</span>
                    </template>
                    <m-date-picker
                        v-model="params.expireTime"
                        type="datetime"
                        placement="bottomRight"
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        :popover-attrs="{
                            arrowOverflow: false
                        }"
                        :scope="SCOPE()"
                        :time-picker="{
                            stepM: 1,
                            format: 'hm'
                        }"
                    />
                </m-form-item>
                <m-form-item :label="i18n.global.t('meos_control_web.reason')" prop="operateType" :rules="[{ required: true, message: EMPTYTEXT, trigger: 'change' }]">
                    <m-select
                        v-model="params.operateType"
                        :placeholder="i18n.global.t('meos_control_web.please_select')"
                        controls="operatorIcon"
                        :size="240"
                        :options="operateTypeList"
                    />
                </m-form-item>
                <m-form-item
                    v-if="params.operateType === '05'"
                    label=" "
                    prop="operateReason"
                    require-asterisk-position="null"
                    :rules="[
                        { required: true, message: EMPTYTEXT, trigger: 'blur' },
                        { max: 50, message: i18n.global.t('meos_control_web.max_20_chars'), trigger: ['blur', 'change'] }
                    ]"
                >
                    <m-input v-model="params.operateReason" width="100%" :placeholder="i18n.global.t('meos_control_web.please_input_specific_reason')" />
                </m-form-item>
                <m-form-item
                    :label="i18n.global.t('common.remarks')"
                    prop="contentInfo"
                    class="flex-start"
                    :rules="[{ max: 50, message: i18n.global.t('meos_control_web.max_50_chars'), trigger: ['blur', 'change'] }]"
                >
                    <m-input v-model="params.contentInfo" type="textarea" :placeholder="i18n.global.t('common.placeholder_input')" :width="240" :height="70" />
                </m-form-item>
            </m-form>
        </template>
        <template #footer>
            <m-button type="default" @click.stop="close">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" @click.stop="submit">{{ i18n.global.t('common.confirm') }}</m-button>
        </template>
    </m-modal>
</template>

<script setup>
import { changeManualAutoStatusByObjectId, getManualAutoChangeReason } from '@/apis/systemDiagram';
import { EMPTYTEXT, SCOPE, SUCCESSCODE } from '@/utils/globalVariables';
import { useErrorMessage, useSuccessMessage, validateLessNow } from '@/utils/tools';
import dayjs from 'dayjs';
import emitter from '@/utils/bus';
import i18n from '@/localization';

const emits = defineEmits(['close']);
const systemId = inject('systemId', ref(''));

const show = ref(false);
const Mform = ref(null);
// 0手动，1自动
const params = ref({
    model: '0',
    expireTime: '',
    operateType: '',
    operateReason: '',
    contentInfo: ''
});
// 一键手自动控制：
// 点击“控制台”出此中心弹窗，可设置手自动设置
// 当选择“一键自动”时，原位出现二次确认提示，如右图
// 当选择“一键手动”时，显示更多信息“结束时间、原因、备注”
// 结束时间：必填，选择到分钟的维度，仅可选择未来时间
// 原因：必填，下拉单选，可选择“运行异常手动紧急操作、设备维保或设备调试、设备故障隔离、供冷需求变化，调整设备参数、其他”
// 当切换原因选择“其他”时，显示“原因批注”字段；必填，最多可输入20字，当输入超过20字时，输入框显示“最多可支持20个字符”
// 备注：为非必填字段，备注最多可输入50字，超过50字时输入框即时标红报错提示“最多可支持50个字符”
// 点击保存成功后，页面顶部massage提示“操作成功”
// 若是一键手动保存成功后，所有设备名称前均带上「手动」标签显示
const operateTypeList = ref([]);
const manualAutoChangeReason = () => {
    operateTypeList.value = [];
    getManualAutoChangeReason({ systemId: systemId.value }).then(res => {
        if (res.code === SUCCESSCODE) {
            console.log(res);
            for (const key in res.data) {
                if (Object.prototype.hasOwnProperty.call(res.data, key)) {
                    operateTypeList.value.push({ id: key, name: res.data[key] });
                }
            }
        }
    });
};
onMounted(() => {
    show.value = true;
    manualAutoChangeReason();
});
const close = type => {
    show.value = false;
    nextTick(() => {
        emits('close', type === true);
    });
};
const submit = () => {
    Mform.value.validate(valid => {
        if (valid) {
            const obj = structuredClone(params.value);
            obj.expireTime = dayjs(obj.expireTime).format('YYYYMMDDHHmm59');
            changeManualAutoStatusByObjectId({
                objectId: systemId.value,
                systemId: systemId.value,
                ...obj
            }).then(res => {
                if (res.code === SUCCESSCODE) {
                    emitter.emit('refreshNotify', 'query');
                    close(true);
                    useSuccessMessage();
                }
            });
        } else {
            useErrorMessage();
        }
    });
};
</script>
<style lang="less" scoped>
.radio-box {
    width: 100%;
    &-item {
        padding: 16px 20px;
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
        & + .radio-box-item {
            margin-top: 16px;
        }
    }
}
</style>
<style lang="less">
.auto-control-modal {
    &.m-modal-bg .m-modal-main .m-modal-main-content {
        padding: 24px;
    }
    textarea {
        resize: none;
    }
    .m-form-item.flex-start .m-form-item__label {
        align-items: flex-start;
    }
}
</style>
