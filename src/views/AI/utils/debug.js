const AI_DEBUG_FLAG = '__MEOS_AI_DEBUG__';

const getGlobalObject = () => {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    return {};
};

export const isAIDebugEnabled = () => {
    try {
        if (import.meta.env?.DEV) {
            return true;
        }
    } catch (error) {
        // ignore env access failures
    }

    return Boolean(getGlobalObject()[AI_DEBUG_FLAG]);
};

export const formatAIDebugTime = value => {
    if (!value) {
        return null;
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value.format === 'function') {
        return value.format('YYYY-MM-DD HH:mm:ss');
    }
    return value;
};

export const getTimeSeriesSummary = arr => {
    const list = Array.isArray(arr) ? arr : [];
    return {
        count: list.length,
        firstTime: formatAIDebugTime(list[0]?.time),
        lastTime: formatAIDebugTime(list[list.length - 1]?.time)
    };
};

export const getJobResultSnapshot = data => {
    if (!data) {
        return null;
    }
    const stgyCodeList = Array.isArray(data.stgyCodeList) ? data.stgyCodeList : [];
    return {
        startTime: formatAIDebugTime(data.startTime),
        endTime: formatAIDebugTime(data.endTime),
        valueSelectType: data.valueSelectType ?? null,
        firstCode: stgyCodeList[0]?.code ?? null,
        codeList: stgyCodeList.map(item => item?.code ?? null).filter(Boolean),
        bestCodeList: stgyCodeList
            .filter(item => item?.idBest || item?.isBest)
            .map(item => item?.code ?? null)
            .filter(Boolean)
    };
};

export const getStrategyOverviewSnapshot = list => {
    const strategyList = Array.isArray(list) ? list : [];
    return strategyList.map((item, index) => ({
        index,
        ...getJobResultSnapshot(item)
    }));
};

export const logAIDebug = (scope, message, payload) => {
    if (!isAIDebugEnabled()) {
        return;
    }

    const prefix = `[AI DEBUG][${scope}] ${message}`;
    if (payload === undefined) {
        console.log(prefix);
        return;
    }
    console.log(prefix, payload);
};

export { AI_DEBUG_FLAG };
