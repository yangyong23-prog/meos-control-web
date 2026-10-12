import { previewProjectValueSelect } from '@/apis/operationCriterion';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { projectValueSelectKey, projectValueLoadingKey } from '@/views/operationCriterion/constant';
export const useProjectValueHook = () => {
    const loading = ref(false);
    const loaded = ref(false);
    const projectValueSelect = ref();
    const { cancelToken, cancelQuest } = UseCancelTokenHooks();
    const getProjectValueSelect = async workDate => {
        loading.value = true;
        try {
            cancelQuest();
            const res = await previewProjectValueSelect(
                { workDate },
                {
                    cancelToken: cancelToken()
                }
            );
            if (res.code === SUCCESSCODE) {
                projectValueSelect.value = res.data;
            } else {
                projectValueSelect.value = null;
            }
        } catch (err) {
            console.log(err);
            projectValueSelect.value = null;
        }
        loaded.value = true;
        loading.value = false;
    };
    provide(projectValueSelectKey, projectValueSelect);
    provide(projectValueLoadingKey, loading);
    return {
        getProjectValueSelect,
        loading,
        loaded,
        projectValueSelect
    };
};
