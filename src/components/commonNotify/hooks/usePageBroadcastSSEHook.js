// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import { GET_MENU_CONFIG } from '@/utils/globalVariables';
import { PAGE_BROADCAST } from '@/utils/SSEEventTypes';

export const usePageBroadcastSSEHook = (systemId, RUNNING_MONITOR_TYPE) => {
    const { base } = useStore();
    const eventTypes = [PAGE_BROADCAST];
    // 开启每小时主动轮换。
    const { sseClient: pageBroadcastSSEClient, setSSEClientOption } = useSinglePOSTSSEClient(undefined, PAGE_BROADCAST, true);
    const setPageBroadcastSSEClientOption = () => {
        // 单独添加播报推送
        const paramsMap = {};
        paramsMap[PAGE_BROADCAST] = {
            firstLevelCategory: window[GET_MENU_CONFIG]?.()?.PRODUCT_CODE,
            secondLevelCategory: systemId?.value || undefined
        };
        setSSEClientOption({
            subscribeType: RUNNING_MONITOR_TYPE,
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: eventTypes,
            eventParamMap: paramsMap,
            urlQuery: PAGE_BROADCAST
        });
    };
    return {
        pageBroadcastSSEClient,
        setPageBroadcastSSEClientOption
    };
};
