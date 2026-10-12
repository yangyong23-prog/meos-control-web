import { previewProjectBusinessTime } from '@/apis/operationCriterion';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
export const useBaseInfoHook = () => {
    const loading = ref(false);
    const loaded = ref(false);
    const projectBusinessTime = ref();
    const { cancelToken, cancelQuest } = UseCancelTokenHooks();
    const getProjectBusinessTime = async workDate => {
        loading.value = true;
        try {
            cancelQuest();
            const res = await previewProjectBusinessTime(
                { workDate },
                {
                    cancelToken: cancelToken()
                }
            );
            if (res.code === SUCCESSCODE) {
                projectBusinessTime.value = res.data;
            } else {
                projectBusinessTime.value = null;
            }
        } catch (err) {
            console.log(err);
            projectBusinessTime.value = null;
        }
        loaded.value = true;
        loading.value = false;
    };
    return {
        getProjectBusinessTime,
        loading,
        loaded,
        projectBusinessTime
    };
};
