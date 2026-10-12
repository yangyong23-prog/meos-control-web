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
