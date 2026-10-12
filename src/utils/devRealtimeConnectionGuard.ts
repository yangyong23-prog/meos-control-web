// 开发调试开关：首个实时连接登记满一分钟后，localStorage 为 true 时统一关闭 SSE/WSS 连接。
export const DEV_STOP_REALTIME_CONNECTIONS_STORAGE_KEY = 'devStopSseAndWss';

const connectionClosers = new Set<() => void>();
let timer: number | undefined;

export const shouldStopDevRealtimeConnections = () => {
    return import.meta.env.DEV && localStorage.getItem(DEV_STOP_REALTIME_CONNECTIONS_STORAGE_KEY) === 'true';
};

const stopRealtimeConnections = () => {
    timer = undefined;
    if (!shouldStopDevRealtimeConnections()) return;

    [...connectionClosers].forEach(closeConnection => closeConnection());
};

export const registerDevRealtimeConnection = (closeConnection: () => void) => {
    if (!import.meta.env.DEV) return () => {};

    connectionClosers.add(closeConnection);
    if (!timer) {
        timer = window.setTimeout(stopRealtimeConnections, 60 * 1000 * 2);
    }

    return () => {
        connectionClosers.delete(closeConnection);
        if (connectionClosers.size === 0 && timer) {
            window.clearTimeout(timer);
            timer = undefined;
        }
    };
};
