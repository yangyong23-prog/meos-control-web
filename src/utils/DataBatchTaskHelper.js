import i18n from '@/localization';
const getBatchList = (targetDatas, batchSize) => {
    const list = targetDatas;
    const len = list.length;
    const size = len > 0 ? (len > batchSize ? batchSize : len) : 0;
    return size > 0 ? targetDatas.splice(0, size) : null;
};

// 数据批处理工具
export default class DataBatchTaskHelper {
    constructor({ batchSize = 10, targetDatas, taskHandler, handerSrcScope, sortFn }) {
        this.frameCallReq = null;
        this.sortFn = sortFn;
        this.batchSize = batchSize;
        this.targetDatas = targetDatas || [];
        this.taskHandler = taskHandler;
        this.handerSrcScope = handerSrcScope;

        this.doBatchTask = () => {
            if (this.sortFn) {
                this.targetDatas.sort((a, b) => sortFn.call(this.handerSrcScope, a, b));
            }
            const list = getBatchList(this.targetDatas, this.batchSize, this.sortFn);
            if (list) {
                this.taskHandler.call(this.handerSrcScope, list);

                this.frameCallReq = requestAnimationFrame(this.doBatchTask);
            } else {
                console.log('结束');
            }
        };
    }

    setTargetDatas(datas) {
        this.targetDatas = datas;
    }

    run() {
        this.doBatchTask();
    }

    pause() {}

    start() {}
    stop() {
        cancelAnimationFrame(this.frameCallReq);
    }

    dispose() {
        this.stop();
        this.targetDatas = null;
    }
}
