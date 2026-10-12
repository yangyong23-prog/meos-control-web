// import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source';
import { fetchEventSource, EventStreamContentType } from '@/utils/fetch-event-source';

// let { onLine } = window.navigator;

// // 网络连接时触发
// window.addEventListener('online', function () {
//     onLine = true;
// });

// // 网络连接断开时触发
// window.addEventListener('offline', function () {
//     onLine = false;
// });

// 可重连错误
class RetriableError extends Error {}

// 致命错误 不会重连
class FatalError extends Error {}

export interface SSEOptions extends RequestInit {
    headers?: Record<string, string>;
    data?: Record<string, any>; // post 时的数据
    openWhenHidden?: boolean; // 是否在页面不可见时保持连接
}

export class FetchEventSourceAdapter {
    private _options: SSEOptions;
    private _url: string;
    private _listenerMap: Map<string, Function[]>;
    private _abortController?: AbortController;
    constructor(url: string, options: SSEOptions = {}) {
        this._options = {
            method: 'GET',
            openWhenHidden: true,
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };
        if (options.data) {
            this._options.body = JSON.stringify(options.data);
            delete this._options.data;
        }
        this._url = url;
        this._listenerMap = new Map();
        this._connect();
    }

    _connect() {
        let retryTime = 100;
        //重连间隔时间： {reTryIntervalTime/1000} s 后重试,
        const reTryIntervalTime = 5000;
        this._abortController = new AbortController();
        fetchEventSource(this._url, {
            ...this._options,
            signal: this._abortController.signal,
            onopen: async response => {
                if (response.ok && response.headers.get('content-type')?.startsWith(EventStreamContentType)) {
                    this._triggerEvent('open', response);
                    return;
                } else if (response.status >= 400 && response.status < 507 && response.status !== 429) {
                    throw new FatalError();
                } else {
                    throw new RetriableError();
                }
            },
            onmessage: msg => {
                const { event } = msg;
                if (event === 'FatalError') {
                    console.error('onmessage FatalError>>>>', msg.data);
                    throw new FatalError(msg.data);
                }

                if (event) {
                    this._triggerEvent(event, msg);
                }
            },
            onclose: () => {
                throw new RetriableError();
            },
            onerror: err => {
                this._triggerEvent('error', err);
                if (err instanceof RetriableError) {
                    console.error('RetriableError>>>>', err);

                    return reTryIntervalTime; // 1s 后重试
                } else if (err instanceof FatalError) {
                    console.error('onerror FatalError>>>>', err);
                    throw err;
                } else if (retryTime-- > 0) {
                    console.error('retryTime RetriableError>>>>', err);
                    console.error(`fetchEventSource 重连剩余 ${retryTime} 次`);

                    // 重试5次后 不再重试
                    return reTryIntervalTime; // 1s 后重试
                }
                console.error('other error>>>', err);
                throw err;
            }
        });
    }

    _triggerEvent(eventName: string, data: any) {
        try {
            const listeners = this._listenerMap.get(eventName);
            if (listeners) {
                listeners.forEach(listener => {
                    listener(data);
                });
            }
        } catch (err) {
            console.error('triggerEvent error>>>', err);
        }
    }

    addEventListener(eventName: string, listener: Function) {
        if (!this._listenerMap.has(eventName)) {
            this._listenerMap.set(eventName, []);
        }
        this._listenerMap.get(eventName)?.push(listener);
    }

    removeEventListener(eventName: string, listener: Function) {
        if (this._listenerMap.has(eventName)) {
            const listeners = this._listenerMap.get(eventName);
            const index = listeners?.indexOf(listener);
            if (index !== -1) {
                listeners?.splice(index!, 1);
            }
        }
    }

    close() {
        this._abortController?.abort();
        this._listenerMap.clear();
    }
}
