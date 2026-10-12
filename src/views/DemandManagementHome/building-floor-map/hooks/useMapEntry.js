import useMapHook from './useMapHook';
import useMapHookNew from './useMapHookNew';

export default ({ templateDemandType }) => {
    if (templateDemandType.value === 'AIRCONDITIONING') {
        const res = useMapHookNew();
        return res;
    } else {
        const res = useMapHook();
        return res;
    }
};
