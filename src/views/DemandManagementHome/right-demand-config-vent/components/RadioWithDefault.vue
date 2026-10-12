<template>
    <m-form-item :prop="feedbackRowInfo.code">
        <template #label>
            <div class="feedback-row">
                <div>{{ feedbackRowInfo.label }}</div>
                <m-popover v-if="feedbackRowInfo?.tips" :show-arrow="false" theme="darkTransparent" placement="top">
                    <template #content>
                        <div>{{ feedbackRowInfo?.tips || '--' }}</div>
                    </template>
                    <div class="row-tips-icon">
                        <svg aria-hidden="true" style="height: 16px; width: 16px">
                            <use :xlink:href="'#icon-info-small'" />
                        </svg>
                    </div>
                </m-popover>
            </div>
        </template>
        <m-radio-group v-if="radioModelVal" v-model="radioModelVal">
            <div class="fc">
                <m-radio :label="'yes'" :size="14">{{ i18n.global.t('meos_control_web.yes') }}</m-radio>
                <m-radio :label="'no'" :size="14">{{ i18n.global.t('common.no') }}</m-radio>
                <m-radio v-if="feedbackRowInfo?.showExtraRadio" :label="feedbackRowInfo?.extraRadio" :size="14">{{
                    `${i18n.global.t('meos_control_web.reference_value')}（${
                        feedbackRowInfo?.extraRadio === 'yesFromParent' ? i18n.global.t('meos_control_web.yes') : i18n.global.t('common.no')
                    }）`
                }}</m-radio>
            </div>
        </m-radio-group>
    </m-form-item>
</template>

<script setup lang="ts">
// @ts-ignore
import i18n from '@/localization';
interface RadioWithDefaultProps {
    feedbackRowInfo: {
        label: string;
        code: string;
        tips: string;
        extraRadio: string;
        showExtraRadio: boolean;
    };
    editVal: string;
}
const props = defineProps<RadioWithDefaultProps>();

const radioModelVal = defineModel<string | undefined>();

watchEffect(() => {
    const isEmpty = radioModelVal.value === '' || radioModelVal.value === null || radioModelVal.value === undefined;
    // 无论是默认值还是引用值，都设置为默认值
    if (isEmpty) {
        radioModelVal.value = props.editVal;
    }
});
</script>

<style lang="less" scoped>
.feedback-row {
    display: flex;
    align-items: center;
    column-gap: 4px;
}
.row-tips-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: @grey-500;
}
</style>
