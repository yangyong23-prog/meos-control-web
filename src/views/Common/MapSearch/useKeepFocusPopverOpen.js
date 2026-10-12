export default doSearch => {
    const isOpen = ref(false);
    const isTriggerFocus = ref(false);
    const isTargetFocus = ref(false);
    const targetRef = ref();

    const triggerFocus = () => {
        isTriggerFocus.value = true;
        isOpen.value = true;

        doSearch?.();
    };

    const triggerBlur = () => {
        isTriggerFocus.value = false;
        setTimeout(() => {
            if (isTargetFocus.value) return;
            isOpen.value = false;
        }, 50);
    };

    const targetMouseEnter = () => {
        targetRef.value.focus();
        isTargetFocus.value = true;
    };

    const targetBlur = () => {
        isTargetFocus.value = false;
        setTimeout(() => {
            if (isTriggerFocus.value) return;
            isOpen.value = false;
        }, 50);
    };

    const resetStatus = () => {
        isOpen.value = false;
        isTargetFocus.value = false;
        isTriggerFocus.value = false;
    };

    return {
        isOpen,
        targetRef,
        triggerBlur,
        triggerFocus,
        targetMouseEnter,
        targetBlur,
        resetStatus
    };
};
