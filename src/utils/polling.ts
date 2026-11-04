/**
 * 计算到下一个时间对齐点的延迟时间
 *
 * @param intervalMs - 时间间隔（毫秒），必须大于0
 * @param nowMs - 当前时间戳（毫秒），默认为当前系统时间
 * @returns 到下一个对齐时间点的延迟时间（毫秒）
 */
export const getDelayToNextAlignedPoint = (intervalMs: number, nowMs: number = Date.now()): number => {
    // 检查时间间隔是否有效
    if (intervalMs <= 0) {
        return 0;
    }

    // 计算当前时间在时间间隔中的余数
    const remainder = nowMs % intervalMs;

    // 如果余数为0，说明当前时间正好在对齐点上，返回一个完整的时间间隔
    // 否则返回剩余时间到达下一个对齐点
    return remainder === 0 ? intervalMs : intervalMs - remainder;
};

/**
 * 启动一个对齐的时间间隔执行器，确保回调在指定时间间隔的整数倍时刻执行
 * 例如，如果间隔为5分钟，则会在每个小时的0分、5分、10分等时刻执行
 *
 * @param callback - 需要定期执行的回调函数
 * @param intervalMs - 执行间隔时间（毫秒），默认为5分钟（5 * 60 * 1000毫秒）
 * @returns 返回一个停止函数，调用该函数可以清除定时器并停止执行
 */
export const startAlignedInterval = (callback: () => void, intervalMs: number = 5 * 60 * 1000): (() => void) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null,
        intervalId: ReturnType<typeof setInterval> | null = null,
        stopped = false;

    const run = () => {
        if (!stopped) {
            callback();
        }
    };

    // 计算到下一个对齐时间点的延迟时间
    const delay = getDelayToNextAlignedPoint(intervalMs);

    timeoutId = setTimeout(() => {
        run();
        intervalId = setInterval(run, intervalMs);
    }, delay);

    return () => {
        stopped = true;
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };
};

export interface VisiblePollerOptions {
    /** 页面从隐藏恢复可见时，如果隐藏期间错过了轮询，立即补一次（默认 true） */
    refreshOnVisible?: boolean;
}

/**
 * opt/edge-call F1：带"页面隐藏暂停"和"在途守卫"的轮询器。
 * - 页面隐藏（切到别的标签页、最小化）时不发请求，恢复可见后补一次；
 * - 上一次回调返回的 Promise 还没结束时，本次跳过，避免下游变慢时请求越堆越多。
 *
 * @returns stop 函数
 */
export const startVisiblePolling = (callback: () => unknown, intervalMs: number, { refreshOnVisible = true }: VisiblePollerOptions = {}): (() => void) => {
    let inFlight = false,
        missed = false,
        stopped = false;

    const run = () => {
        if (stopped || inFlight) return;
        let result: unknown;
        try {
            result = callback();
        } catch (e) {
            console.error('polling callback error', e);
            return;
        }
        if (result && typeof (result as Promise<unknown>).then === 'function') {
            inFlight = true;
            (result as Promise<unknown>)
                .catch(e => console.error('polling callback error', e))
                .finally(() => {
                    inFlight = false;
                });
        }
    };

    const tick = () => {
        if (typeof document !== 'undefined' && document.hidden) {
            missed = true;
            return;
        }
        run();
    };

    const onVisibilityChange = () => {
        if (!document.hidden && missed && refreshOnVisible) {
            missed = false;
            run();
        }
    };

    const timer = setInterval(tick, intervalMs);
    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
        stopped = true;
        clearInterval(timer);
        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', onVisibilityChange);
        }
    };
};

/** 清理 setInterval 返回的 id 或 startVisiblePolling 返回的 stop 函数 */
export const clearPolling = (handle: unknown) => {
    if (typeof handle === 'function') {
        handle();
    } else if (handle) {
        clearInterval(handle as ReturnType<typeof setInterval>);
    }
};
