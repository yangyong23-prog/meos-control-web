<template>
    <div v-show="hasFeedBack" ref="feedbackDomRef" class="feedback-config-wrap" :style="{ marginTop: `${props.marginTop}px` }">
        <TitlePrefix class="mb12">
            <template #title>
                <div class="row-wrap">
                    <div class="left-title">{{ i18n.global.t('meos_control_web.lighting_feedback_adjust_config') }}</div>
                    <div v-if="!isPreview" class="right-statistics">
                        <span>{{ i18n.global.t('meos_control_web.current_has') }}</span>
                        <span class="count">{{ enableFeedbackSpaces.length || props?.feedbackSpaceIds?.length || 0 }}</span>
                        <span>{{ i18n.global.t('meos_control_web.space_to_feedback') }}</span>
                    </div>
                </div>
            </template>
        </TitlePrefix>
        <div v-if="!isPreview">
            <div class="row-flex-wrap">
                <div class="f14 fc" style="height: 22px; min-width: 130px; margin-left: 14px; margin-right: 24px">
                    {{ i18n.global.t('meos_control_web.enable_feedback_control') }}
                </div>
                <m-radio-group v-model="enableFeedbackConfig">
                    <div class="radio-list">
                        <m-radio v-for="(item, index) in SPACE_ENABLE_FEEDBACK_OPTIONS" :key="index" :label="item.value" :size="14" :disabled="item.disabled">
                            <span>{{ item.label }}</span>
                        </m-radio>
                    </div>
                </m-radio-group>
                <div
                    v-show="enableFeedbackConfig === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE"
                    class="f14 fc"
                    :style="{
                        marginLeft: '40px',
                        height: '22px',
                        marginRight: '24px',
                        minWidth: 'fit-content'
                    }"
                >
                    {{ i18n.global.t('meos_control_web.space_in_feedback_adjust') }}
                </div>
                <div v-show="enableFeedbackConfig === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE">
                    <m-select
                        ref="spaceSelectRef"
                        v-model="spacesToFeedback"
                        :size="330"
                        mode="tags"
                        has-check-all
                        :options="enableFeedbackSpaces"
                        multiple
                        has-confirm
                        panel-searchable
                        @confirm="beforeConfirm"
                    ></m-select>
                </div>
            </div>
        </div>
        <FeedbackConfigList
            v-show="props.isPreview || enableFeedbackConfig === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE"
            :ref="ins => (feedbackFormInstance = ins)"
            v-model="collapseDataList"
            v-model:collapsed-ids="collapsedIds"
            :is-preview="props.isPreview"
        ></FeedbackConfigList>
    </div>
</template>
<script setup>
import i18n from '@/localization';
// import { useElementSize } from '@vueuse/core';
import TitlePrefix from '@/components/title-prefix/index.vue';
import { spacesToFeedbackKey, enableFeedbackSpacesKey, isEnableFeedbackKey } from '../../hooks/useFeedbackConfigHook';
import { usemessageInfo } from '@/utils/tools';
import FeedbackConfigList from './feedbackConfigList.vue';
import { SPACE_ENABLE_FEEDBACK_OPTIONS, SPACE_ENABLE_FEEDBACK_ENUM } from '../../constant/index';
const feedbackDomRef = ref();
const spaceSelectRef = ref();
const props = defineProps({
    marginTop: {
        type: Number,
        default: 0
    },
    feedbackSpaceIds: {
        type: Array,
        default: () => []
    },
    isPreview: {
        type: Boolean,
        default: false
    }
});

const enableFeedbackConfig = inject(isEnableFeedbackKey);
const enableFeedbackSpaces = inject(enableFeedbackSpacesKey);
const spacesToFeedback = inject(spacesToFeedbackKey);
const collapseDataList = defineModel({ type: Array, default: [] });
const collapsedIds = defineModel('collapsed-ids', { type: Array, default: [] });
const feedbackFormInstance = ref();
const hasFeedBack = computed(() => {
    const res = enableFeedbackSpaces.value.length || props?.feedbackSpaceIds?.length;
    return props.isPreview ? true : res;
});
const validateForm = async () => {
    return await feedbackFormInstance?.value?.validateForm?.();
};
defineExpose({ validateForm });

const beforeConfirm = (ids, done) => {
    if (ids.length <= 0) {
        usemessageInfo(i18n.global.t('meos_control_web.please_select_at_least_one_zone'));
        spacesToFeedback.value = enableFeedbackSpaces.value.map(v => v?.id);
        spaceSelectRef.value?.focus();
    } else {
        spacesToFeedback.value = ids;
    }
};
</script>
<style lang="less" scoped>
.feedback-config-wrap {
    display: flex;
    flex-direction: column;
}

.row-wrap {
    display: flex;
    align-items: center;
}

.left-title {
    color: var(--gray-800, #2e3742);

    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    margin-right: 12px;
}
.right-statistics {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--gray-600, #626c78);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    .count {
        font-weight: 700;
    }
}
.row-flex-wrap {
    display: flex;
    align-items: center;
    height: 32px;
}
.radio-list {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: fit-content;

    :deep(.m-radio) {
        margin-right: 0px;
    }
}
</style>
