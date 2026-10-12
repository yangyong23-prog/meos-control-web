import { WebSocketClient } from './webSocketClient';
import { DataObserve } from '../EventDispatcher';
import { isEdge } from '../envUtils';
import iotExpireManager from '@/utils/iotExpireManager';
import type { IotRecord } from '@/utils/iotExpireManager';

class DataDispatcher {
    private static instance: DataDispatcher;
    private static closeConsole: boolean;
    isEdge: boolean;

    private constructor() {
        this.isEdge = isEdge();
    }

    public static getInstance(closeConsole: boolean): DataDispatcher {
        DataDispatcher.closeConsole = closeConsole;
        if (!DataDispatcher.instance) {
            DataDispatcher.instance = new DataDispatcher();
        }
        return DataDispatcher.instance;
    }

    // 普通的数据发送
    public sendData(meta: any) {
        const dataObserve = new DataObserve();
        setTimeout(async () => {
            const data = typeof meta === 'function' ? await meta() : meta;
            dataObserve.dispatch(data, this);
        }, 0);
        return dataObserve;
    }
    // 单独的接口轮询
    public pollingHttp(http: Function, httpIntervalTime = 60 * 1000) {
        const dataObserve = new DataObserve();
        let timer: any = null;
        const getData = async () => {
            try {
                const data = await http();
                dataObserve.dispatch(data, this);
            } catch (err) {
                dataObserve.dispatch(err, this);
            }
        };
        const requestHttp = () => {
            if (timer) return;
            timer = setInterval(() => {
                getData();
            }, httpIntervalTime);
        };

        const observe = {
            dispose: () => {
                clearInterval(timer);
                timer = null;
                dataObserve.dispose.call(dataObserve);
            },
            response: (listener: (data: any, instance: DataObserve) => void) => {
                dataObserve.response.call(dataObserve, listener);
                !timer && requestHttp();
            }
        };
        return observe;
    }
    // ws / http 轮询
    public request(iotWebSocket: WebSocketClient | undefined, http: Function, options?: { httpIntervalTime: number; immediate: boolean }) {
        const dataObserve = new DataObserve();
        const { httpIntervalTime = 60 * 1000, immediate = true } = options || {};
        let timer: any = null,
            // 接口轮询时间间隔
            requestTime = httpIntervalTime;

        const socketOnmessageCallback: Function = (event: any) => {
            if (event.data) {
                const data = JSON.parse(event.data);
                iotExpireManager.addIot(data, 'WS');
                dataObserve.dispatch(data, this);
            }
        };

        const getData = (newHttp: Function, time?: number) => {
            clearInterval(timer);
            timer = null;
            if (!time) {
                this.getHttpData(dataObserve, newHttp);
            } else {
                if (immediate) this.getHttpData(dataObserve, newHttp);
                timer = setInterval(() => {
                    this.getHttpData(dataObserve, newHttp);
                }, time);
            }
        };

        const handleIotExpire = (iotRecord: IotRecord) => {
            let iotData;
            if (iotRecord.from === 'API') {
                iotData = iotRecord.data;
                // 过期消息需保持与正常 WSS 数据一致的状态字段，供各消费方复用原有过滤逻辑。
                iotData.webType = 'PARAM_SET';
                iotData.dataStatus = 1;
                iotData.type = 0;
            } else if (iotRecord.from === 'WS') {
                iotData = iotRecord.data;
            } else if (iotRecord.from === 'SSE') {
                iotData = iotRecord.data;
                // 过期消息需保持与正常 WSS 数据一致的状态字段，供各消费方复用原有过滤逻辑。
                iotData.webType = 'PARAM_SET';
                iotData.dataStatus = 1;
                iotData.type = 0;
            }

            if (iotData) {
                iotData.dataValue = undefined;
                iotData.dataValueName = undefined;
                iotData.invalid = 0;
                dataObserve.dispatch(iotData, this);
            }
        };

        const initIotExpire = () => {
            iotExpireManager.addEventListener('expire', handleIotExpire);
        };

        const removeIotExpire = () => {
            iotExpireManager.removeEventListener('expire', handleIotExpire);
        };

        const observe = {
            dispose: () => {
                clearInterval(timer);
                timer = null;
                dataObserve.dispose.call(dataObserve);
                removeIotExpire();
                iotWebSocket?.removeOnmessage(socketOnmessageCallback);
            },
            originHttp: http,
            response: (listener: (data: any, instance: DataObserve) => void) => {
                dataObserve.response.call(dataObserve, listener);
                if (this.isEdge) {
                    initIotExpire();
                    iotWebSocket?.onmessage(socketOnmessageCallback);
                    iotWebSocket?.connect?.();
                } else {
                    getData(http, requestTime);
                }
            },
            rePlayHttp: (timeOrFunc?: any, newHttpTime?: any) => {
                if (this.isEdge) return;
                let newHttp: Function,
                    time: undefined | number = undefined;
                if (typeof timeOrFunc === 'number') {
                    requestTime = timeOrFunc;
                    time = requestTime;
                    newHttp = http;
                } else if (typeof timeOrFunc === 'function') {
                    newHttp = timeOrFunc;
                    time = newHttpTime !== undefined ? newHttpTime : requestTime;
                } else {
                    return console.error('参数错误!数字或者函数!');
                }
                getData(newHttp, time);
            }
        };

        return observe;
    }

    private async getHttpData(dataObserve: DataObserve, http: Function) {
        if (!http || typeof http !== 'function') return;
        try {
            const data = await http();
            dataObserve.dispatch(data, this);
        } catch (err) {
            dataObserve.dispatch(err, this);
        }
    }
}

export default (closeConsole = false) => DataDispatcher.getInstance(closeConsole);
