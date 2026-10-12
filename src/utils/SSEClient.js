import useStore from '@/store';
import { FetchEventSourceAdapter } from './FetchEventSourceAdapter';
import { applyPrecisionMarker } from '@/apis/precisionWhitelist';

import qs from 'qs';
import iotExpireManager from '@/utils/iotExpireManager';
import { IOT_DATA_CHANGE } from '@/utils/SSEEventTypes';
import { registerDevRealtimeConnection } from '@/utils/devRealtimeConnectionGuard';
import { sseReConnectMinutes } from '@/config';

const store = useStore();
const SSE_ROTATION_CONNECT_TIMEOUT = 30 * 1000;
const SSE_AUTO_RECONNECT_MINUTES = sseReConnectMinutes || 60;
const SSE_AUTO_RECONNECT_INTERVAL = SSE_AUTO_RECONNECT_MINUTES * 60 * 1000;

const iotDataChangeHandle = res => {
    if (res.data) {
        iotExpireManager?.addIot(res.data, 'SSE');
    }
};

const getURLInstance = url => {
    try {
        return new URL(url);
    } catch (e) {
        return new URL(window.location.origin + url);
    }
};

export default class SSEClient {
    constructor(options, enablePeriodicReconnect = true) {
        this.open = false;
        // 是否被销毁
        this.isDestory = false;
        // 默认开启定时轮换，统一保障 SSE 长连接可持续接收数据。
        this.enablePeriodicReconnect = enablePeriodicReconnect;
        this.autoReconnectTimer = null;
        // 轮换期间保留旧连接，候选连接成功后再切换，尽量减少事件丢失。
        this.pendingEventSource = null;
        this.rotateConnectionTimer = null;
        this.eventsInfoMap = new Map();
        this.removeDevRealtimeConnectionGuard = registerDevRealtimeConnection(() => this.close());
        console.log(`SSE自动重连时长为: ${SSE_AUTO_RECONNECT_MINUTES}分钟`);
        this._initOptions(options);
        // iot过期事件触发执行
        this._handleExpireData = data => {
            if (!this.eventsInfoMap) return console.warn('SSEClient 已被销毁');
            // console.log('data: ', data, this);
            const { callbacks } = this.eventsInfoMap.get(IOT_DATA_CHANGE);
            callbacks.forEach(cb => {
                if (cb !== iotDataChangeHandle) {
                    cb({ eventType: IOT_DATA_CHANGE, data: { ...data, dataValue: '', dataValueName: '' } });
                }
            });
        };
        this._initIotExpire();
    }

    _initOptions(options) {
        if (!options?.url) {
            return;
        }
        const headers = {};
        // 对header需要的参数做统一处理
        if (store.base) {
            const { groupCode, projectId, token } = store.base;
            headers['project-id'] = projectId;
            headers['group-code'] = groupCode;
            headers.groupCode = groupCode;
            options.type && (headers.type = options.type);
            if (token) headers.token = token;
        }
        // 信息点分精度：命中当前模块规则下的 SSE 订阅时打标（见 precisionWhitelist.ts）
        applyPrecisionMarker(options.url || '', store.base?.precisionCurrentRule || null, headers);

        let finallyUrl = '';
        try {
            const urlInstnce = getURLInstance(options.url);
            const paramsOrigin = qs.parse(urlInstnce.search, { ignoreQueryPrefix: true });
            const paramsString = `${qs.stringify({ ...paramsOrigin, ...(options.params || {}) })}`;
            if (paramsString) {
                finallyUrl = `${urlInstnce.origin}${urlInstnce.pathname}?${paramsString}`;
            } else {
                finallyUrl = `${urlInstnce.origin}${urlInstnce.pathname}`;
            }
        } catch (e) {
            console.error(e);
        }

        this.url = finallyUrl;
        if (options.headers) {
            options.headers = {
                ...headers,
                ...this.options.headers,
                withCredentials: true
            };
        } else {
            options.headers = headers;
        }
        this.options = options;
        this.connect();
    }

    _initIotExpire() {
        this.addEventListener(IOT_DATA_CHANGE, iotDataChangeHandle);
        // 监听数据过期  TODO 处理过期数据
        iotExpireManager.addEventListener('expire', this._handleExpireData);
    }

    _releaseIotExpire() {
        this.removeEventListener(IOT_DATA_CHANGE, iotDataChangeHandle);
        iotExpireManager?.removeEventListener('expire', this._handleExpireData);
        iotExpireManager?.clear();
    }

    setOptions(options = {}) {
        if (!this.isDestory) {
            this.close();
            this._initOptions(options);
        }
    }

    _sseHandler(eventName, event) {
        if (!this.eventsInfoMap) {
            return;
        }
        const { callbacks } = this.eventsInfoMap.get(eventName);
        if (typeof event.data === 'string') {
            const data = JSON.parse(event.data);
            callbacks.forEach(cb => {
                cb(data);
            });
        } else {
            callbacks.forEach(cb => {
                cb(event.data);
            });
        }
    }

    addEventListener(eventName, callback) {
        if (!this.eventsInfoMap) return console.warn('SSEClient 已被销毁');
        if (!this.eventsInfoMap.get(eventName)) {
            this.eventsInfoMap.set(eventName, {
                added: false, // 是否监听了eventSource
                listenerHandler: null,
                callbacks: []
            });
        }
        const eventInfo = this.eventsInfoMap.get(eventName);
        const { callbacks } = eventInfo;
        if (!eventInfo.added) {
            const cb = event => {
                // console.log('收到消息 :>> ', event.data);
                this._sseHandler(eventName, event);
            };
            eventInfo.listenerHandler = cb;
            this.eventSource?.addEventListener(eventName, cb);
            eventInfo.added = true;
        }
        if (callbacks.indexOf(callback) === -1) {
            callbacks.push(callback);
        }
    }

    removeEventListener(eventName, callback) {
        if (!this.eventsInfoMap) return console.warn('SSEClient 已被销毁');
        const eventInfo = this.eventsInfoMap.get(eventName) || {};
        const { callbacks } = eventInfo;
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
            if (callbacks.length === 0) {
                const cb = eventInfo.listenerHandler;
                this.eventSource?.removeEventListener(eventName, cb);
                eventInfo.added = false;
            }
        }
    }

    _initAddEvents() {
        if (!this.eventsInfoMap) return console.warn('SSEClient 已被销毁');
        this.eventsInfoMap.forEach((eventInfo, eventName) => {
            eventInfo.added = false;
            const { callbacks } = eventInfo;
            callbacks.forEach(callback => {
                this.addEventListener(eventName, callback);
            });
        });
    }

    _addConnectionErrorListener(eventSource) {
        eventSource?.addEventListener('error', event => {
            // 忽略 AbortError 错误，这是正常的行为
            if (event?.error?.name === 'AbortError') {
                console.debug('SSE connection aborted (usually intentional)');
                return;
            }
            console.warn('Connection error:', event);
        });
    }

    _startAutoReconnectTimer() {
        clearInterval(this.autoReconnectTimer);
        this.autoReconnectTimer = null;
        if (!this.enablePeriodicReconnect || this.isDestory) return;

        this.autoReconnectTimer = setInterval(() => {
            this.rotateConnection();
        }, SSE_AUTO_RECONNECT_INTERVAL);
    }

    connect() {
        if (this.open) return;
        try {
            // eslint-disable-next-line prefer-destructuring
            let url = this.url;
            if (this.options?.data?.[0]?.urlQuery) {
                url = `${this.url}?${this.options.data[0].urlQuery}`;
                delete this.options.data[0].urlQuery; // 删除已使用的urlQuery，避免重复添加
            }
            this.connectionUrl = url;
            this.eventSource = new FetchEventSourceAdapter(url, this.options);
            this.eventSource?.addEventListener('open', () => {
                // console.log('Connection opened!');
                this.open = true;
                this._startAutoReconnectTimer();
            });

            this._addConnectionErrorListener(this.eventSource);

            this._initAddEvents();
        } catch (e) {
            // 忽略 AbortError 错误
            if (e?.name === 'AbortError') {
                console.debug('SSE connection aborted during connect');
                return;
            }
            console.error(`SSEClient connect error: ${e}`);
        }
    }

    rotateConnection() {
        if (!this.enablePeriodicReconnect || !this.open || this.isDestory || !this.options?.url || this.pendingEventSource) return;

        try {
            const previousEventSource = this.eventSource;
            const candidateEventSource = new FetchEventSourceAdapter(this.connectionUrl || this.url, this.options);
            this.pendingEventSource = candidateEventSource;
            this._addConnectionErrorListener(candidateEventSource);

            const handleOpen = () => {
                candidateEventSource.removeEventListener('open', handleOpen);
                if (this.pendingEventSource !== candidateEventSource || this.isDestory) {
                    candidateEventSource.close();
                    return;
                }

                clearTimeout(this.rotateConnectionTimer);
                this.rotateConnectionTimer = null;
                this.pendingEventSource = null;
                this.eventSource = candidateEventSource;
                this._initAddEvents();
                previousEventSource?.close();
                this._startAutoReconnectTimer();
            };
            candidateEventSource.addEventListener('open', handleOpen);

            this.rotateConnectionTimer = setTimeout(() => {
                if (this.pendingEventSource === candidateEventSource) {
                    this.pendingEventSource = null;
                    candidateEventSource.close();
                }
                this.rotateConnectionTimer = null;
            }, SSE_ROTATION_CONNECT_TIMEOUT);
        } catch (e) {
            console.error(`SSEClient rotate connection error: ${e}`);
        }
    }

    close() {
        clearInterval(this.autoReconnectTimer);
        this.autoReconnectTimer = null;
        clearTimeout(this.rotateConnectionTimer);
        this.rotateConnectionTimer = null;
        this.pendingEventSource?.close();
        this.pendingEventSource = null;
        this.eventSource?.close();
        this.open = false;
    }

    destory() {
        this.close();
        this.removeDevRealtimeConnectionGuard?.();
        this._releaseIotExpire();
        this.eventsInfoMap?.clear();

        this.isDestory = true;
        this.eventSource = null;
        this.eventsInfoMap = null;
    }
}
