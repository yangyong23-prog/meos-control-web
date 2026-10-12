export const useSystemSetHook = () => {
    const showSystemSet = ref(false);
    const openSystemSet = () => {
        showSystemSet.value = true;
    };
    const closeSystemSet = () => {
        showSystemSet.value = false;
    };
    return {
        showSystemSet,
        openSystemSet,
        closeSystemSet
    };
};
