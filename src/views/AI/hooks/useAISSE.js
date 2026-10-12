import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';
import { AI_NOTIFY_CALC_STATUS } from '@/utils/SSEEventTypes';

export const useAISSE = () => {
    const { base } = useStore();
    const { sseClient: AISSEClient, setSSEClientOption } = useSinglePOSTSSEClient('AI');
    const setAISSEClientOption = systemId => {
        setSSEClientOption({
            subscribeType: 'AI',
            instanceId: systemId,
            instanceType: 'SYSTEM',
            eventType: [AI_NOTIFY_CALC_STATUS]
        });
    };
    const addAICalcListener = handle => {
        AISSEClient?.addEventListener(AI_NOTIFY_CALC_STATUS, ({ data }) => {
            if (handle) handle(data);
        });
    };
    return {
        AISSEClient,
        setAISSEClientOption,
        addAICalcListener
    };
};
