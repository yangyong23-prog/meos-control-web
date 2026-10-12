// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';

export default () => {
    const { base } = useStore();
    // 空间 & 广播 sse 通道
    const dashboardSSEClientEventTypes = ['ABNORMAL_STATE', 'SECURITY_DASH_BOARD'];
    const { sseClient: dashboardSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('SECURITY');
    const setDashboardSSEClientOption = (claasCode2objectIds = {}) => {
        setSSEClientOption({
            subscribeType: 'SECURITY',
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: dashboardSSEClientEventTypes,
            claasCode2objectIds
        });
    };
    return {
        dashboardSSEClient,
        setDashboardSSEClientOption,
        dashboardSSEClientEventTypes
    };
};
