import i18n from '@/localization';
import { $Message } from 'meri-plus';
import { ERROR, SUBMIT_ERROR } from '../utils/validate';

export const useFeedbackValidation = ({
    feedbackCollapsedIds,
    spaceFuncTypeCollapsedIds,
    confirmModal,
    loadingRef,
    failFeedbackModalConfig,
    timeoutKey,
    collapseDelayTimeoutKey
}) => {
    const scrollToErrorScope = scope => {
        if (scope) {
            const ele = document.getElementById(`${scope}`);
            if (ele) {
                ele?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    };

    const handleValidationErrors = errorTextMap => {
        let firstErrorItem,
            levelOneCollapsedIds = new Set(),
            levelTwoCollapsedIds = {},
            errMsg = '';

        errorTextMap.values().forEach((obj, index) => {
            if (index === 0) {
                firstErrorItem = obj;
            }
            if (obj.spaceId) {
                levelOneCollapsedIds.add(obj.spaceId);
                if (obj.funcType) {
                    levelTwoCollapsedIds[obj.spaceId] ??= new Set();
                    levelTwoCollapsedIds[obj.spaceId].add(`${obj.spaceId}-${obj.funcType}`);
                }
            }
        });

        // 取错误map中第一个空间的第一个回路的错误
        const { spaceId, funcType, errors, errSettingMode } = firstErrorItem || {};
        const hasAllRequiredError = Object.values(errors).every(v => v === ERROR.REQUIRED);
        const hasCompareError = Object.values(errors).some(v => v === ERROR.MUST_BE_GREATER || v === ERROR.MUST_BE_LESS);
        if (errSettingMode) {
            errMsg = SUBMIT_ERROR.SETTING_MODE;
        } else {
            errMsg = hasAllRequiredError ? SUBMIT_ERROR.REQUIRED : hasCompareError ? SUBMIT_ERROR.COMPARE : '';
        }

        // 取错误map中所有空间的所有回路对应的折叠ids，打开折叠面板
        // 1、一级二级折叠定位展开
        feedbackCollapsedIds.value = [...new Set([...feedbackCollapsedIds.value, ...levelOneCollapsedIds])];
        collapseDelayTimeoutKey.value = setTimeout(() => {
            [...levelOneCollapsedIds].forEach(id => {
                const preIds = spaceFuncTypeCollapsedIds.value[id] || [];
                const uniqueIds = [...new Set([...levelTwoCollapsedIds[id], ...preIds])];
                spaceFuncTypeCollapsedIds.value[id] = uniqueIds;
            });
        }, 100);

        // 2、滚动加载，弹窗提示
        const collapsedTableId = `${spaceId}-${funcType}-table`;
        timeoutKey.value = setTimeout(() => {
            scrollToErrorScope(collapsedTableId);
        }, 400);

        confirmModal.value = false;
        $Message.error({ title: errMsg || i18n.global.t('meos_control_web.error_items_exist_please_check') });
        loadingRef.value = false;

        return true; // hasError
    };

    const handleDuplicateLoops = repeatLoopConfigsMap => {
        confirmModal.value = false;
        loadingRef.value = false;
        const errText = i18n.global.t('meos_control_web.lighting_circuit_feedback_condition_inconsistent_save_failed', { count: repeatLoopConfigsMap.size });
        const viewDetail = i18n.global.t('meos_control_web.view_detail');
        $Message.error({
            title: errText,
            duration: 4000,
            showClose: true,
            button: viewDetail,
            buttonClick: () => {
                failFeedbackModalConfig.value.data = [...repeatLoopConfigsMap.values()];
                failFeedbackModalConfig.value.show = true;
            }
        });

        return true; // hasError
    };

    return {
        scrollToErrorScope,
        handleValidationErrors,
        handleDuplicateLoops
    };
};
