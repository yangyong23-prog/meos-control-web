// @ts-ignore
import i18n from '@/localization';
export default () => {
    const headerRef = ref(null);
    const rowNum = ref(1);
    const open = ref(false);
    const setFoldBtnStatus = () => {
        try {
            let headerHeight = headerRef.value?.offsetHeight;
            if (headerHeight) {
                if (headerHeight > 76) {
                    rowNum.value = 3;
                } else if (headerHeight > 44) {
                    rowNum.value = 2;
                } else {
                    rowNum.value = 1;
                }
            }
        } catch (err) {
            console.log('计算错误');
        }
    };

    const changeOpen = () => {
        open.value = !open.value;
        setFoldBtnStatus();
    };
    onMounted(() => {
        window.addEventListener('resize', setFoldBtnStatus);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', setFoldBtnStatus);
    });

    return {
        changeOpen,
        headerRef,
        rowNum,
        open,
        setFoldBtnStatus
    };
};
