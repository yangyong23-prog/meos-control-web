import { listStrategy } from '@/apis/reportApi';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { store } from '../../store';

export default () => {
    const [strategyList, setStrategyList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const state = store.getState();
    const { projectId } = state.base;

    const fetchStrategyList = useCallback(
        async params => {
            setLoading(true);
            setError(null);
            const date = params?.reportDate;
            const params1 = {
                projectId: projectId,
                consoleTypes: params?.consoleTypes,
                systemType: params?.systemType ?? 'ACAC',
                objectId: params?.objectId ?? '',
                beginDate: dayjs(date).format('YYYY-MM-DD'),
                endDate: dayjs(date).format('YYYY-MM-DD')
            };
            try {
                const response = await listStrategy(params1, undefined);
                const responseData = (response as any)?.data;
                if (responseData?.code === '00000') {
                    setStrategyList(responseData?.data || []);
                }
            } catch (error: any) {
                setError(error?.message || '获取时间表失败');
            } finally {
                setLoading(false);
            }
        },
        [projectId]
    );

    // fetchStrategyList();

    return { strategyList, loading, error, fetchStrategyList };
};
