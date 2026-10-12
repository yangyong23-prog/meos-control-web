import { previewParticipateInScheduling } from '@/apis/operationCriterion';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { participateInSchedulingKey } from '@/views/operationCriterion/constant';
export const useParticipateInSchedulingHook = () => {
    const loading = ref(false);
    const loaded = ref(false);
    const participateInScheduling = ref();
    const { cancelToken, cancelQuest } = UseCancelTokenHooks();
    const getParticipateInScheduling = async workDate => {
        loading.value = true;
        try {
            cancelQuest();
            const res = await previewParticipateInScheduling(
                { workDate },
                {
                    cancelToken: cancelToken()
                }
            );
            if (res.code === SUCCESSCODE) {
                console.log(res);
                if (res.data) {
                    participateInScheduling.value = res.data;
                } else {
                    participateInScheduling.value = null;
                }
            }
        } catch (err) {
            console.log(err);
            participateInScheduling.value = null;
        }
        loaded.value = true;
        loading.value = false;
    };
    provide(participateInSchedulingKey, participateInScheduling);
    return {
        getParticipateInScheduling,
        loading,
        loaded,
        participateInScheduling
    };
};
