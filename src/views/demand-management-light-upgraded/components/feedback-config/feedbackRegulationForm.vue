<template>
    <div :id="props.formId" class="loop-feedback-regulation">
        <m-form ref="Mform" class="feedback-form-inline" :model="params" :inline="false" require-asterisk-position="right" scroll-to-error>
            <div class="f f14" style="width: 100%; display: flex; align-items: center">
                <span class="title" style="min-width: 130px">{{ i18n.global.t('meos_control_web.illuminance_adjustment_type') }}</span>
                <m-form-item>
                    <m-radio-group v-model="spaceFeedbackAdjustType">
                        <div style="gap: 16px">
                            <m-tips
                                v-if="!spaceWithWorkPlaneLux"
                                :key="SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.value"
                                theme="dark"
                                :content="SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.disableTip"
                            >
                                <m-radio
                                    :key="SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.value"
                                    :label="SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.value"
                                    :disabled="!spaceWithWorkPlaneLux"
                                    >{{ SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.label }}</m-radio
                                >
                            </m-tips>
                            <m-radio
                                v-else
                                :key="SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.infoCode"
                                :label="SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.value"
                                :disabled="!spaceWithWorkPlaneLux"
                                >{{ SPACE_FEEDBACK_ADJUST_TYPE.INDOOR_ILLUMINANCE.label }}</m-radio
                            >

                            <m-tips
                                v-if="!projectWithOutdoorIlluminance"
                                :key="SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.value"
                                theme="dark"
                                :content="SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.disableTip"
                            >
                                <m-radio
                                    :key="SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.value"
                                    :label="SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.value"
                                    :disabled="!projectWithOutdoorIlluminance"
                                    >{{ SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.label }}</m-radio
                                >
                            </m-tips>
                            <m-radio
                                v-else
                                :key="SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.infoCode"
                                :label="SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.value"
                                :disabled="!projectWithOutdoorIlluminance"
                                >{{ SPACE_FEEDBACK_ADJUST_TYPE.OUTDOOR_ILLUMINANCE.label }}</m-radio
                            >
                        </div>
                    </m-radio-group>
                </m-form-item>
            </div>
        </m-form>
    </div>
</template>
<script setup>
import i18n from '@/localization';
import { SPACE_FEEDBACK_ADJUST_TYPE } from '../../constant';

const props = defineProps({
    formId: {
        type: String,
        default: ''
    },
    spaceWithWorkPlaneLux: {
        type: Boolean,
        default: false
    },
    projectWithOutdoorIlluminance: {
        type: Boolean,
        default: false
    }
});
const params = defineModel({ type: Object, default: {} });
const spaceFeedbackAdjustType = defineModel('spaceFeedbackAdjustType', { type: String, default: '' });

const Mform = ref(null);
const validateForm = async () => {
    const spaceFeedbackAdjustTypeOk = spaceFeedbackAdjustType.value?.toString();
    let isValid = false,
        errorTips = '';
    if (!spaceFeedbackAdjustTypeOk) {
        errorTips = i18n.global.t('meos_control_web.please_select_illuminance_adjustment_type');
    } else {
        await Mform.value.validate(async (valid, error) => {
            if (valid) {
                isValid = true;
            }
            if (Object.values(params.value).includes(null)) {
                errorTips = i18n.global.t('meos_control_web.input_required_check_error_4');
            }
        });
    }

    return { isValid, errorTips, formId: props.formId };
};

defineExpose({ validateForm });
</script>
<style lang="less" scoped>
.loop-feedback-regulation {
    width: 100%;
    .title {
        position: relative;
        display: inline-block;
        margin-right: 8px;
    }
    :deep(.feedback-form-inline) {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        column-gap: 48px;
        row-gap: 12px;
        .m-form-item {
            margin-right: 0;
            margin-bottom: 0px;
        }
    }
}
</style>
