export default ({ treeShieldedSpaceCount }) => {
    const showShieldModal = ref(false);
    const showBlackListModal = ref(false);

    const openShieldedModal = () => {
        if (treeShieldedSpaceCount.value === 0) return;
        showShieldModal.value = true;
    };

    const openBlackListModal = () => {
        // if (treeBlackListSpaceCount.value === 0) return;
        showBlackListModal.value = true;
    };

    return {
        openShieldedModal,
        openBlackListModal,
        showShieldModal,
        showBlackListModal
    };
};
