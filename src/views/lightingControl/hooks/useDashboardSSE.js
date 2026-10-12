// @ts-ignore
import i18n from '@/localization';
import useSinglePOSTSSEClient from '@/components/hooks/useSinglePOSTSSEClient';
import useStore from '@/store';

export default () => {
    const { base } = useStore();
    // 空间 & 广播 sse 通道
    const dashboardSSEClientEventTypes = ['LIGHTING_DASHBOARD_EQUIPMENT_STATISTICS', 'LIGHTING_DASHBOARD'];
    const { sseClient: dashboardSSEClient, setSSEClientOption } = useSinglePOSTSSEClient('LIGHT_MONITORING');
    const setDashboardSSEClientOption = (claasCode2objectIds = {}) => {
        setSSEClientOption({
            subscribeType: 'LIGHT_MONITORING',
            instanceId: base.projectId,
            instanceType: 'PROJECT',
            eventType: dashboardSSEClientEventTypes,
            claasCode2objectIds
        });
    };
    return {
        dashboardSSEClient,
        setSSEClientOption,
        setDashboardSSEClientOption,
        dashboardSSEClientEventTypes
    };
};
