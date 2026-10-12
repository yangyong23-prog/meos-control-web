import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { listScheduleInfoCodeDefine } from '@/apis/reportApi';
import { store } from '@/store';
import { SYSTEM_CLASSCODE } from '@/app/variables';

type ScheduleInfoCodeDefineContextValue = {
    infoCodeDefines: any[];
    infoCodeDefineMap: Record<string, any>;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
};

const ScheduleInfoCodeDefineContext = createContext<ScheduleInfoCodeDefineContextValue | undefined>(undefined);

let cachedInfoCodeDefines: any | null = null,
    cachedError: string | null = null,
    cachedRequest: Promise<void> | null = null;

export const useScheduleInfoCodeDefine = () => {
    const context = useContext(ScheduleInfoCodeDefineContext);
    if (!context) {
        throw new Error('useScheduleInfoCodeDefine must be used within ScheduleInfoCodeDefineProvider');
    }
    return context;
};

export const ScheduleInfoCodeDefineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [infoCodeDefines, setInfoCodeDefines] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const refresh = useCallback(async () => {
        if (cachedInfoCodeDefines !== null || cachedError) {
            setInfoCodeDefines(cachedInfoCodeDefines ?? {});
            setError(cachedError);
            return;
        }
        if (cachedRequest) {
            setLoading(true);
            await cachedRequest;
            setInfoCodeDefines(cachedInfoCodeDefines ?? {});
            setError(cachedError);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const params = {
                classCode: SYSTEM_CLASSCODE
            };
            cachedRequest = (async () => {
                const response = await listScheduleInfoCodeDefine(params);
                const responseData = (response as any)?.data;
                if (responseData?.code === '00000' && responseData?.data) {
                    const { data } = responseData;
                    const rec = {};
                    Object.keys(data)?.forEach(k => {
                        rec[k] = {};

                        const fields = data[k];
                        fields.forEach(obj => {
                            rec[k][obj.aliasCode] = obj;
                            rec[k][obj.code] = obj;
                        });
                    });
                    cachedInfoCodeDefines = rec;
                    cachedError = null;
                } else {
                    cachedInfoCodeDefines = {};
                    cachedError = null;
                }
            })();
            await cachedRequest;
        } catch (err: any) {
            cachedError = err?.message || '获取时间表字段字典失败';
            cachedInfoCodeDefines = {};
        } finally {
            cachedRequest = null;
            setLoading(false);
        }
        setInfoCodeDefines(cachedInfoCodeDefines ?? {});
        setError(cachedError);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const infoCodeDefineMap = useMemo(() => {
        const map: Record<string, any> = {};
        (Array.isArray(infoCodeDefines) ? infoCodeDefines : []).forEach((item: any) => {
            if (item?.code) {
                map[item.code] = item;
            }
        });
        return map;
    }, [infoCodeDefines]);

    return React.createElement(ScheduleInfoCodeDefineContext.Provider, { value: { infoCodeDefines, infoCodeDefineMap, loading, error, refresh } }, children);
};
