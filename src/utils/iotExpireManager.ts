import { EventDispatcher } from './EventDispatcher';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';

export interface RecordData {
    objectId: string; // 对象id
    infoCode: string; // iot 信息编码
    dataIndate?: number; // 数据过期时间  单位min
    [key: string]: any;
}

export interface IotRecord {
    objectId: string; // 对象id
    infoCode: string; // iot 信息编码
    dataTime: number; // 更新时间
    expireTime: string; // 过期时间 YYYY-MM-DD HH:mm:ss格式
    dataIndate: number; // 数据过期时间  单位min
    from: 'WS' | 'SSE' | 'API'; // 数据来源
    data: RecordData; // 数据
}

export interface IotExpireManagerOptions {
    intervalTime?: number; // 检查间隔时间 5s
}

const defaultDataIndate = 5; // 默认数据过期时间  5min
const defaultIntervalTime = 15000; // 检查间隔时间 15s

class IotExpireManager extends EventDispatcher {
    static iotExpireManager: IotExpireManager;
    private _iotList: Array<IotRecord>;
    private _timer?: number;
    private _options: IotExpireManagerOptions;
    constructor(options: IotExpireManagerOptions = { intervalTime: defaultIntervalTime }) {
        super();
        // Set容器
        this._iotList = [];
        this._options = options;
        (window as any).getIotExpireList = () => this._iotList;
    }

    queryIotIndex(iotData: RecordData) {
        return this._iotList.findIndex(item => {
            return item.objectId === iotData.objectId && item.infoCode === iotData.infoCode;
        });
    }

    queryIot(iotData: RecordData) {
        const index = this.queryIotIndex(iotData);
        return index > -1 ? this._iotList[index] : null;
    }

    addIot(iotData: RecordData, from: 'WS' | 'SSE' | 'API') {
        if (!iotData.dataIndate || Number(iotData.dataIndate) <= 0 || !iotData.dataTime) {
            // 时间常量，小于等于0代表永久有效 不做管理
            // console.log(`没有有效期的数据：${iotData.objectId}-${iotData.infoCode} dataIndeate；${iotData.dataIndeate}; dataTime:${iotData.dataTime}`);
            return;
        }

        // 处理时间
        const expireTime = dayjs(iotData.dataTime).add(iotData.dataIndate, 'minute').format('YYYY-MM-DD HH:mm:ss');

        const index = this.queryIotIndex(iotData);
        if (index > -1) {
            // console.log('更新数据...');
            this._iotList.splice(index, 1);
        }
        const iotRecord: IotRecord = {
            objectId: iotData.objectId,
            infoCode: iotData.infoCode,
            dataTime: Date.now(),
            expireTime,
            dataIndate: iotData.dataIndate,
            from,
            data: iotData
        };
        this._iotList.push(iotRecord);
    }

    expireCheck() {
        // 检查是否过期
        const currentProjectTime = getDayjsTz().format('YYYY-MM-DD HH:mm:ss');
        for (let index = 0; index < this._iotList.length; index++) {
            const iotRecord = this._iotList[index];
            if (iotRecord.expireTime <= currentProjectTime) {
                // 触发事件
                iotRecord.data.__expireSend__ = true;
                this.dispatchEvent('expire', iotRecord);
                this._iotList.splice(index, 1);
                index--;
            }
        }
    }

    clear() {
        this._iotList.length = 0;
    }

    startExpireCheck() {
        window.clearInterval(this._timer);
        this._timer = window.setInterval(() => {
            this.expireCheck();
        }, this._options.intervalTime);
    }

    stopExpireCheck() {
        window.clearInterval(this._timer);
    }

    static getInstance() {
        if (!IotExpireManager.iotExpireManager) {
            IotExpireManager.iotExpireManager = new IotExpireManager();
            IotExpireManager.iotExpireManager.startExpireCheck();
        }
        return IotExpireManager.iotExpireManager;
    }
}

export default IotExpireManager.getInstance();
