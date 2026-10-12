// @ts-ignore
import i18n from '@/localization';
export const isEnableFeedbackKey = Symbol('isEnableFeedbackKey'); //是否启用反馈调节
export const enableFeedbackSpacesKey = Symbol('enableFeedbackSpacesKey'); // 全部可参与反馈调节的空间列表
export const spacesToFeedbackKey = Symbol('spacesToFeedbackKey'); // 参与反馈调节的空间列表

import { SPACE_ENABLE_FEEDBACK_ENUM } from '../constant/index';

export const useFeedbackConfigHook = () => {
    const isEnableFeedback = ref(SPACE_ENABLE_FEEDBACK_ENUM.DISABLE);
    const enableFeedbackSpaces = ref([]);
    const spacesToFeedback = ref([]);

    watch(
        () => isEnableFeedback.value,
        cur => {
            if (cur === SPACE_ENABLE_FEEDBACK_ENUM.ENABLE && !spacesToFeedback.value?.length) {
                spacesToFeedback.value = enableFeedbackSpaces.value.map(v => v.id);
            } else {
                nextTick(() => {
                    spacesToFeedback.value = [];
                });
            }
        }
    );

    provide(isEnableFeedbackKey, isEnableFeedback);
    provide(enableFeedbackSpacesKey, enableFeedbackSpaces);
    provide(spacesToFeedbackKey, spacesToFeedback);
    return {
        spacesToFeedback
    };
};
