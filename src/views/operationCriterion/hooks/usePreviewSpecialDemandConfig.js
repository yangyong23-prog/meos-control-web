import { previewSpecialDemandConfig } from '@/apis/operationCriterion';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
export const useProjectValueHook = () => {
    const loading = ref(false);
    const loaded = ref(false);
    const specialDemandConfig = ref();
    const { cancelToken, cancelQuest } = UseCancelTokenHooks();
    const getSpecialDemandConfig = async workDate => {
        loaded.value = false;
        loading.value = true;
        try {
            cancelQuest();
            const res = await previewSpecialDemandConfig(
                { workDate },
                {
                    cancelToken: cancelToken()
                }
            );
            if (res.code === SUCCESSCODE) {
                console.log(res);
                specialDemandConfig.value = res.data;
            } else {
                specialDemandConfig.value = null;
            }
        } catch (err) {
            console.log(err);
            specialDemandConfig.value = null;
        }
        loaded.value = true;
        loading.value = false;
    };
    return {
        getSpecialDemandConfig,
        loading,
        loaded,
        specialDemandConfig
    };
};
