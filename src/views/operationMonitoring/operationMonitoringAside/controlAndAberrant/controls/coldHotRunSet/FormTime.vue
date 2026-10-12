<template>
    <m-form ref="Mform" label-width="200px" :model="params" label-position="top" require-asterisk-position="right">
        <m-form-item label="" prop="type" :rules="[{ required: true, message: EMPTYTEXT, trigger: 'change' }]">
            <m-radio-group v-model="params.type">
                <m-radio label="0">{{ i18n.global.t('meos_control_web.modify_time') }}</m-radio>
                <m-radio label="1">{{ i18n.global.t('meos_control_web.restore_auto_mode') }}</m-radio>
            </m-radio-group>
        </m-form-item>
        <m-form-item v-if="params.type === '1'">
            <div class="to-auto fcc">{{ i18n.global.t('meos_control_web.end_manual_intervention_now_resume_auto') }}</div>
        </m-form-item>

        <template v-else>
            <m-form-item
                :label="i18n.global.t('meos_control_web.deadline')"
                prop="time"
                :rules="[
          { required: true, message: EMPTYTEXT, trigger: 'change' },
          { validator:
            (value: any, rule: any, callback: any) => validateLessNow(params.time, callback), trigger: 'change' }]"
            >
                <m-date-picker
                    v-model="params.time"
                    type="datetime"
                    placement="bottomRight"
                    :placeholder="i18n.global.t('meos_control_web.please_select')"
                    :scope="scope"
                    :time-picker="{
                        stepM: 5,
                        format: 'hm'
                    }"
                />
            </m-form-item>
        </template>

        <div style="text-align: right; padding-top: 6px">
            <m-button size="small" style="margin-right: 12px" @click="cancel()">{{ i18n.global.t('common.cancel') }}</m-button>
            <m-button type="primary" size="small" @click="sumbit">{{ i18n.global.t('common.confirm') }}</m-button>
        </div>
    </m-form>
</template>

<script lang="ts" setup>
import { EMPTYTEXT, getDayjsTz, SUCCESSCODE } from '@/utils/globalVariables';
import dayjs from 'dayjs';
import { IOTObject, Strategy } from '../../types';
import { Ref } from 'vue';
import { resetTempStrategyPlanEffectEndDateTime } from '@/apis/systemDiagram';
import { setModelType, setScope, useSuccessMessage, validateLessNow } from '@/utils/tools';
import i18n from '@/localization';

const props = defineProps({
    type: {
        type: String,
        default: ''
    }
});
const systemId: Ref<string> = inject('systemId', ref(''));
const strategy: Ref<Strategy> = inject('strategy')!;
const emits = defineEmits(['cancel', 'sumbit']);
const scope = ref(`${setScope(5)}-${getDayjsTz().add(2, 'day').format('YYYY.MM.DD 00:00:00')}`);
const Mform = ref<any>(null);
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const InfoCodeObject: Ref<IOTObject> = inject('InfoCodeObject')!;
const params = ref<{ type: string; time: any }>({
    type: '0',
    time: dayjs(InfoCodeObject.value.dataTime).format('YYYY.MM.DD HH:mm')
});
const sumbit = () => {
    Mform.value.validate((valid: boolean) => {
        if (valid) {
            let data: any = {};
            if (InfoCodeObject.value.isStrategy) {
                data = {
                    systemId: systemId.value,
                    objectId: props.type === 'cool' ? systemId.value : strategy.value.id,
                    effectEndDateTime: params.value.type === '0' ? dayjs(params.value.time).format('YYYY-MM-DD HH:mm:ss') : null,
                    strategyPlanIds: InfoCodeObject.value.planId,
                    businessType: props.type === 'cool' ? 'CHILLER_UNIT' : 'LAST_FREEZE_PUMP_GROUP'
                };
                setModelType(systemId.value);
                resetTempStrategyPlanEffectEndDateTime(data).then(res => {
                    if (res.code === SUCCESSCODE) {
                        useSuccessMessage();
                        cancel(true);
                    }
                });
            }
        }
    });
};

const cancel = (type = false) => {
    emits('cancel', type);
};
</script>
<style lang="less" scoped></style>
<style lang="less">
.control-time-pop {
    height: 184px;
    .to-auto {
        margin-bottom: 19px;
        width: 100%;
        height: 36px;
        border-radius: 4px;
        background: #e8ecf0;
        color: #626c78;
    }
}
</style>
