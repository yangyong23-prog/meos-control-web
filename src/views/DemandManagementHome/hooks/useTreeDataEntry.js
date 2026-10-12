import useTreeDataNew from './useTreeDataNew';
import useTreeData from './useTreeData';
import { useRoute } from 'vue-router';
import { routeParamsTypeToDemandTypeMap } from '../constant/config';

export default (activeId, templateType, { clickMapObj, hideLeftBlackList, hideLeftShieldList, pastDateString }) => {
    const route = useRoute();

    const routeParamsType = computed(() => {
        return route.params.type;
    });

    const routeType = routeParamsTypeToDemandTypeMap[routeParamsType.value];
    const acRes = useTreeDataNew(activeId, templateType, { clickMapObj, hideLeftBlackList, hideLeftShieldList, pastDateString });
    const otherRes = useTreeData(activeId, templateType, { clickMapObj, hideLeftBlackList, hideLeftShieldList, routeType, pastDateString });

    if (templateType.value === 'AIRCONDITIONING') {
        return acRes;
    } else {
        return otherRes;
    }
};
