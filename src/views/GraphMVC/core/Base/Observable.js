export default class Observable {
    constructor() {
        this.observers = new Map();

        this.jobLabelArgMap = new Map();
        // this.jobLabelPending = new Map();
        this.rejectFnMap = new Map();
    }

    addObserver(EventName, callback) {
        if (this.observers.has(EventName) === false) {
            this.observers.set(EventName, []);
            // this.jobLabelArgMap.set(EventName, {});
            // this.jobLabelPending.set(EventName, false);
        }
        this.observers.get(EventName).push(callback);
    }

    emit(EventName, ...e) {
        this._excute(EventName, ...e);
    }

    // 清除事件(主要是异步的)
    clearEvents() {
        this.rejectFnMap.forEach(v => {
            v();
        });
        this.jobLabelArgMap.clear();
        this.rejectFnMap.clear();
    }

    // 清除事件监听
    clearListeners() {
        this.observers.clear();
    }

    asyncEmit(EventName, data) {
        // data 只能传对象
        const lastData = this.jobLabelArgMap.get(EventName) || {};
        this.jobLabelArgMap.set(EventName, { ...lastData, ...data });
        // reject掉之前的任务
        const lastRejectFn = this.rejectFnMap.get(EventName);
        if (lastRejectFn) {
            lastRejectFn();
        }

        new Promise((resolve, reject) => {
            this.rejectFnMap.set(EventName, reject);
            Promise.resolve().then(() => {
                resolve();
            });
        })
            .then(() => {
                const v = this.jobLabelArgMap.get(EventName);
                this._excute(EventName, v);
                this.jobLabelArgMap.clear();
                this.rejectFnMap.clear();
            })
            .catch(e => {
                if (e) {
                    console.warn('e: ', e);
                }
            });
    }

    _excute(EventName, ...e) {
        const observers = this.observers.get(EventName);
        if (observers && observers.length) {
            observers.forEach(callback => {
                callback(...e);
            });
        }
    }
}
