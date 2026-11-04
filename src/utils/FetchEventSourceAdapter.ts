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

// opt/edge-call F1：重连退避（毫秒），从 1 秒开始翻倍，最多 30 秒
const RETRY_BASE_MS = 1000;
const RETRY_MAX_MS = 30 * 1000;
// opt/edge-call F5：保活 ping 间隔。服务端租约默认 60 秒（opt.sse.lease-seconds），这里取 20 秒
const PING_INTERVAL_MS = 20 * 1000;

/** 服务端返回这些状态码时不重连（请求本身有问题，重连也不会好） */
const isFatalStatus = (status: number) => status >= 400 && status < 500 && status !== 408 && status !== 429;

export class FetchEventSourceAdapter {
    private _options: SSEOptions;
    private _url: string;
    private _listenerMap: Map<string, Function[]>;
    private _abortController?: AbortController;
    private _retryDelay = RETRY_BASE_MS;
    private _eventKeys = new Set<string>();
    private _pingTimer?: ReturnType<typeof setInterval>;
    private _closed = false;
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

    _nextRetryDelay() {
        const delay = this._retryDelay;
        this._retryDelay = Math.min(this._retryDelay * 2, RETRY_MAX_MS);
        return delay;
    }

    _connect() {
        this._abortController = new AbortController();
        fetchEventSource(this._url, {
            ...this._options,
            signal: this._abortController.signal,
            onopen: async response => {
                if (response.ok && response.headers.get('content-type')?.startsWith(EventStreamContentType)) {
                    // 连接成功：复位退避；eventKey 以本次连接的 EVENT_ID 为准
                    this._retryDelay = RETRY_BASE_MS;
                    this._eventKeys.clear();
                    this._triggerEvent('open', response);
                    return;
                }
                // 原逻辑 400~506 一律 Fatal，服务重启期间网关返回 502/503/504 也不再重连，页面永久停更。
                // 现在只有 4xx（408/429 除外）不重连，5xx 和其它情况按退避重连。
                if (isFatalStatus(response.status)) {
                    throw new FatalError(`SSE 连接失败，HTTP ${response.status}`);
                }
                throw new RetriableError(`SSE 连接失败，HTTP ${response.status}`);
            },
            onmessage: msg => {
                const { event } = msg;
                if (event === 'FatalError') {
                    console.error('onmessage FatalError>>>>', msg.data);
                    throw new FatalError(msg.data);
                }
                if (event === 'EVENT_ID' && msg.comment) {
                    this._addEventKeys(msg.comment);
                }

                if (event) {
                    this._triggerEvent(event, msg);
                }
            },
            onclose: () => {
                // 服务端主动结束（如 emitter 超时）：按退避重连
                throw new RetriableError('SSE 连接被服务端关闭');
            },
            onerror: err => {
                this._triggerEvent('error', err);
                if (err instanceof FatalError) {
                    console.error('onerror FatalError>>>>', err);
                    throw err;
                }
                const delay = this._nextRetryDelay();
                console.warn(`SSE 连接中断，${delay / 1000}s 后重连`, err);
                return delay;
            }
        }).catch(err => {
            // 不再重连（Fatal）：通知上层，由 SSEClient 决定是否稍后重建
            this._stopPing();
            if (!this._closed) {
                this._triggerEvent('fatal', err);
            }
        });
    }

    /** F5：记录本连接的 eventKey，并开始定时 ping，让服务端（switch.opt.sseKeepalive 打开时）能回收失联连接 */
    _addEventKeys(comment: string) {
        comment
            .split('\n')
            .map(k => k.trim())
            .filter(Boolean)
            .forEach(k => this._eventKeys.add(k));
        this._startPing();
    }

    _pingUrl() {
        const index = this._url.indexOf('/sse/subscribe');
        return index === -1 ? '' : `${this._url.slice(0, index)}/sse/ping`;
    }

    _startPing() {
        if (this._pingTimer || !this._pingUrl()) return;
        this._pingTimer = setInterval(() => this._ping(), PING_INTERVAL_MS);
        this._ping();
    }

    _stopPing() {
        if (this._pingTimer) {
            clearInterval(this._pingTimer);
            this._pingTimer = undefined;
        }
    }

    _ping() {
        const base = this._pingUrl();
        const headers = { ...(this._options.headers || {}) } as Record<string, string>;
        delete headers['Content-Type'];
        this._eventKeys.forEach(eventKey => {
            // 失败不处理：开关关闭时服务端是空操作；网络断开时 SSE 自己会重连
            fetch(`${base}?eventKey=${encodeURIComponent(eventKey)}`, { method: 'GET', headers }).catch(() => undefined);
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
        this._closed = true;
        this._stopPing();
        this._abortController?.abort();
        this._listenerMap.clear();
    }
}
