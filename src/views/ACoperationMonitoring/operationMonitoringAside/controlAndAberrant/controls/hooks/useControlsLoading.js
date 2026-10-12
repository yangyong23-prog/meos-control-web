// @ts-ignore
import i18n from '@/localization';
import useLoading from '@/hooks/useLoading';
import { isEdge } from '@/utils/envUtils';
export default (isColdHotControl, selectedSystemObj, runSetTab, coldHotListInfoCodes, coolListInfoCodes, hotListInfoCodes) => {
    const { openLoading, closeLoading } = useLoading('run-set-bottom-container', '#fff', 'ball');
    openLoading();
    const isLoading = ref(true);
    const handleLoadingAndIsLoading = () => {
        closeLoading();
        isLoading.value = false;
    };
    watchEffect(() => {
        if (isEdge()) {
            switch (isColdHotControl.value) {
                case 'ColdHotControl':
                    if (coldHotListInfoCodes.value.length) {
                        handleLoadingAndIsLoading();
                    }
                    break;
                case 'ColdSource':
                    if (runSetTab?.value === '0') {
                        if (coolListInfoCodes.value.length) {
                            handleLoadingAndIsLoading();
                        }
                    } else {
                        handleLoadingAndIsLoading();
                    }
                    break;
                case 'HeatSource':
                    if (selectedSystemObj.imageOrProductName !== i18n.global.t('meos_control_web.vacant_hot_pot_system_graph')) {
                        if (hotListInfoCodes.value.length) {
                            handleLoadingAndIsLoading();
                        }
                    }
                    break;
                default:
                    break;
            }
        } else {
            handleLoadingAndIsLoading();
        }
    });
    return { isLoading };
};
