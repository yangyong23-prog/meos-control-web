import { previewProjectGlobalConfig } from '@/apis/operationCriterion';
import { SUCCESSCODE } from '@/utils/globalVariables';
import UseCancelTokenHooks from '@/hooks/UseCancelTokenHooks';
import { currentSeasonTypeKey, globalConfigKey } from '@/views/operationCriterion/constant';
export const useGlobalConfigHook = () => {
    const loading = ref(true);
    const loaded = ref(false);
    const globalConfig = ref();
    const currentSeasonType = ref();
    const { cancelToken, cancelQuest } = UseCancelTokenHooks();
    const getGlobalConfig = async workDate => {
        loading.value = true;
        try {
            cancelQuest();
            const res = await previewProjectGlobalConfig(
                { workDate },
                {
                    cancelToken: cancelToken()
                }
            );
            if (res.code === SUCCESSCODE) {
                if (res.data && res.data.length) {
                    globalConfig.value = res.data[0];
                    currentSeasonType.value = res.data[0].seasonType;
                } else {
                    globalConfig.value = null;
                }
            }
        } catch (err) {
            globalConfig.value = null;
        }
        loaded.value = true;
        loading.value = false;
    };
    provide(currentSeasonTypeKey, currentSeasonType);
    provide(globalConfigKey, globalConfig);
    return {
        getGlobalConfig,
        loading,
        loaded,
        globalConfig
    };
};
