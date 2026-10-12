// @ts-ignore
import i18n from '@/localization';
import { EventDispatcher } from '../EventDispatcher';
import { registerDevRealtimeConnection } from '@/utils/devRealtimeConnectionGuard';

export class WebSocketClient extends EventDispatcher {
    // #socket链接
    private url = '';
    // #socket实例
    private socket: WebSocket | null = null;
    // 正在连接中
    private connecting = false;
    // #重连次数
    private reconnectAttempts = 0;
    // #最大重连数
    private maxReconnectAttempts = 5;
    // #重连间隔
    private reconnectInterval = 10000; // 10 seconds
    // #发送心跳数据间隔
    private heartbeatInterval = 1000 * 30;
    // #计时器id
    // eslint-disable-next-line no-undef
    private heartbeatTimer?: NodeJS.Timeout;
    // #彻底终止ws
    private stopWs = false;
    private timer: any = null;
    private removeDevRealtimeConnectionGuard?: () => void;
    // *构造函数
    constructor(url: string) {
        super();
        this.url = url;
        this.removeDevRealtimeConnectionGuard = registerDevRealtimeConnection(() => this.close());
    }
    // >生命周期钩子
    onopen(callBack: Function) {
        this.addEventListener('open', callBack);
    }

    removeOnopen(callBack: Function) {
        this.removeEventListener('open', callBack);
    }

    onmessage(callBack: Function) {
        this.addEventListener('message', callBack);
    }

    removeOnmessage(callBack: Function) {
        this.removeEventListener('message', callBack);
    }

    onclose(callBack: Function) {
        this.addEventListener('close', callBack);
    }

    removeOnclose(callBack: Function) {
        this.removeEventListener('close', callBack);
    }

    onerror(callBack: Function) {
        this.addEventListener('error', callBack);
    }

    removeOnerror(callBack: Function) {
        this.removeEventListener('error', callBack);
    }
    // >消息发送
    public send(message: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.error('[WebSocket] 未连接');
        }
    }

    // !初始化连接
    public connect(): void {
        if ((this.socket && this.socket.readyState === WebSocket.OPEN) || this.connecting) {
            return;
        }

        if (this.reconnectAttempts === 0) {
            this.log('WebSocket', `初始化连接中...          ${this.url}`);
        }

        this.connecting = true;
        this.socket = new WebSocket(this.url);

        // !websocket连接成功
        this.socket.onopen = event => {
            // 重置重连尝试成功连接
            this.reconnectAttempts = 0;
            // 清楚重连定时器
            clearInterval(this.timer);
            this.timer = null;
            // 在连接成功时停止当前的心跳检测并重新启动
            this.startHeartbeat();
            this.log('WebSocket', `连接成功,等待服务端数据推送[onopen]...     ${(event.currentTarget as WebSocket)?.url}`);
            this.dispatchEvent('open', event);
            this.connecting = false;
        };

        this.socket.onmessage = event => {
            this.dispatchEvent('message', event);
            this.startHeartbeat();
        };

        this.socket.onclose = event => {
            if (this.reconnectAttempts === 0) {
                this.log('WebSocket', `连接断开[onclose]...     ${(event.currentTarget as WebSocket)?.url}`);
            }
            this.closeHeartbeat();
            if (!this.stopWs) {
                console.log('重连11');
                this.handleReconnect();
            }
            this.dispatchEvent('close', event);
            this.connecting = false;
        };

        this.socket.onerror = event => {
            if (this.reconnectAttempts === 0) {
                this.log('WebSocket', `连接异常[onerror]...     ${(event.currentTarget as WebSocket)?.url}`);
            }
            this.closeHeartbeat();
            if (!this.stopWs) {
                console.log('重连22');
                this.handleReconnect();
            }
            this.dispatchEvent('error', event);
            this.connecting = false;
        };
    }

    // > 断网重连逻辑
    private handleReconnect(): void {
        if (this.timer) return;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.timer = setInterval(() => {
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    this.log('WebSocket', `尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})       ${this.url}`);
                    this.connect();
                } else {
                    this.closeHeartbeat();
                    this.close();
                    this.log('WebSocket', `最大重连失败，终止重连: ${this.url}`);
                }
            }, this.reconnectInterval);
        } else {
            this.closeHeartbeat();
            this.close();
            this.log('WebSocket', `最大重连失败，终止重连: ${this.url}`);
        }
    }

    // >关闭连接
    public close(): void {
        this.removeDevRealtimeConnectionGuard?.();
        this.removeDevRealtimeConnectionGuard = undefined;
        if (this.socket) {
            this.stopWs = true;
            this.socket.close();
            this.socket = null;
            clearInterval(this.timer);
            this.timer = null;
            this.removeEventListener('open');
            this.removeEventListener('message');
            this.removeEventListener('close');
            this.removeEventListener('error');
        }
        this.closeHeartbeat();
    }

    public relConnent(url: string): void {
        this.url = url;
        if (this.socket) {
            this.stopWs = true;
            this.socket.close();
            clearInterval(this.timer);
            this.timer = null;
        }
        setTimeout(() => {
            this.reconnectAttempts = 0;
            this.connecting = false;
            this.stopWs = false;
            this.connect();
        });
    }

    // >开始心跳检测 -> 定时发送心跳消息
    private startHeartbeat(): void {
        if (this.heartbeatTimer) {
            this.closeHeartbeat();
        }
        this.heartbeatTimer = setInterval(() => {
            if (this.socket) {
                this.socket.send(JSON.stringify({ type: 'heartBeat', data: {} }));
                this.log('WebSocket', i18n.global.t('meos_control_web.sending_heartbeat_data'));
            } else {
                console.error('[WebSocket] 未连接');
            }
        }, this.heartbeatInterval);
    }

    // >关闭心跳
    private closeHeartbeat(): void {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = undefined;
    }
}
