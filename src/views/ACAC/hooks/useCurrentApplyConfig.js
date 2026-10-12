import { getCurrentApplyConfig } from '@/apis/configUse';
import { getDayjsTz } from '@/utils/globalVariables';
import useStore from '@/store';
import { SUCCESSCODE } from '@/utils/globalVariables';

export const valueSelectionKey = Symbol('runDataTabModelKey');
export const useCurrentApplyConfig = () => {
    const valueSelectType = ref();
    const getApplyConfig = async () => {
        try {
            const { base } = useStore();
            const { projectId } = base || {};
            const { data, code } = await getCurrentApplyConfig({
                projectId: projectId,
                date: getDayjsTz().format('YYYY-MM-DD')
            });
            if (code === SUCCESSCODE) {
                valueSelectType.value = data.type;
            }
        } catch (error) {
            console.error(error);
        }
    };
    provide(valueSelectionKey, valueSelectType);
    return {
        getApplyConfig
    };
};
