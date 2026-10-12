import { useCallback, useEffect, useMemo, useState } from 'react';
import { queryReportRemarkList, saveReportRemarkList } from '@/apis/reportApi';

type RemarkItem = {
    reportId: string;
    remark: string;
    objectId?: string;
    [key: string]: any;
};

type UseRemarkReturn = {
    remark: RemarkItem[];
    remarkMap: Record<string, RemarkItem>;
    loading: boolean;
    error: string | null;
    loadRemark: (ids?: string[]) => Promise<RemarkItem[]>;
    saveRemark: (items?: RemarkItem[]) => Promise<boolean>;
};

export default (reportIds: string[] = []): UseRemarkReturn => {
    const [remark, setRemark] = useState<RemarkItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const remarkMap = useMemo(() => {
        return remark.reduce<Record<string, RemarkItem>>((acc, item) => {
            const key = `${item.reportId}__${item.objectId || ''}`;
            acc[key] = item;
            return acc;
        }, {});
    }, [remark]);

    const loadRemark = useCallback(
        async (ids?: string[]) => {
            const targetIds = Array.isArray(ids) && ids.length > 0 ? ids : reportIds;
            if (!Array.isArray(targetIds) || targetIds.length === 0) {
                setRemark([]);
                return [];
            }
            setLoading(true);
            setError(null);
            try {
                const response = await queryReportRemarkList(targetIds);
                const responseData = (response as any)?.data;
                if (responseData?.code === '00000') {
                    const list = Array.isArray(responseData?.data) ? responseData.data : [];
                    setRemark(list);
                    return list;
                }
                throw new Error(responseData?.message || '查询备注失败');
            } catch (err: any) {
                setError(err?.message || '查询备注失败');
                setRemark([]);
                return [];
            } finally {
                setLoading(false);
            }
        },
        [reportIds]
    );

    const saveRemark = useCallback(
        async (items?: RemarkItem[]) => {
            const payload = Array.isArray(items) ? items : remark;
            setLoading(true);
            setError(null);
            try {
                const response = await saveReportRemarkList(payload);
                const responseData = (response as any)?.data;
                if (responseData?.code === '00000') {
                    const list = Array.isArray(responseData?.data) ? responseData.data : payload;
                    setRemark(list);
                    return true;
                }
                throw new Error(responseData?.message || '保存备注失败');
            } catch (err: any) {
                setError(err?.message || '保存备注失败');
                return false;
            } finally {
                setLoading(false);
            }
        },
        [remark]
    );

    useEffect(() => {
        if (reportIds.length) {
            loadRemark(reportIds);
        } else {
            setRemark([]);
        }
    }, [reportIds, loadRemark]);

    return { remark, remarkMap, loading, error, loadRemark, saveRemark };
};
