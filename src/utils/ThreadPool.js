export class ThreadPool {
    // const curThreadCount = 0;

    constructor(option = {}) {
        const { inspectIntervalTime = 10 * 1000, maximumWorkTime = 30 * 1000, WorkerConstructor } = option;
        if (!WorkerConstructor) {
            return;
        }
        this.maximumThreadsNumber = Math.floor((window.navigator.hardwareConcurrency - 1) / 2);
        if (this.maximumThreadsNumber < 1) {
            this.maximumThreadsNumber = 2;
        }
        // console.log('new ThreadPool maximumThreadsNumber: ', this.maximumThreadsNumber);
        this.threads = [];
        this.flushing = false;
        this.removing = false;
        this.waittingTasks = [];
        this.taskMap = new Map();
        this.WorkerConstructor = WorkerConstructor;
        this.inspectIntervalTime = inspectIntervalTime;
        this.maximumWorkTime = maximumWorkTime;
        this.init();
    }

    //   初始化
    init() {
        //   根据最大线程数创建线程
        for (let i = 0; i < this.maximumThreadsNumber; i++) {
            this.createThread(i);
        }
        // 检测定时器
        this.inspectInterval = setInterval(() => this.inspectThreads(), this.inspectIntervalTime);
    }

    //   创建子线程
    createThread(i) {
        // 创建子线程
        const thread = new this.WorkerConstructor();
        // 绑定对子线程消息监听
        thread.addEventListener('message', event => {
            this.messageHandler(event, thread);
        });
        // 对子线程对象附加一些属性
        thread.id = i;
        // 记录线程是否繁忙
        thread.busy = false;
        // 记录
        // thread.taskMap = {};
        // 记录子线程
        this.threads[i] = thread;
    }

    messageHandler(event, thread) {
        if (!event.data) {
            return;
        }
        const { threadCode, channel, threadData, threadMsg, taskId } = event.data;
        // console.log('messageHandler  threadPool: ', threadCode, channel, threadData, taskId);
        if (threadCode === 0) {
            switch (channel) {
                case 'task':
                    const { code, data, msg } = threadData;
                    // eslint-disable-next-line no-case-declarations
                    const reqPromise = this.taskMap.get(taskId);
                    //   console.log("reqPromise: ", reqPromise);
                    if (reqPromise) {
                        // 执行任务
                        reqPromise.resolve(data);
                        // Remove
                        this.taskMap.delete(taskId);
                        // thread.taskMap[taskId] = null;
                    }
                    // Set the thread status to idle.
                    thread.busy = false;
                    // this.nextTaskSchedule();
                    break;
                case 'inspection':
                    // console.info(`Inspection info from thread, details: ${JSON.stringify(threadData)}`);
                    // eslint-disable-next-line no-case-declarations
                    const { isWorking, workTimeElapse } = threadData;
                    // console.log('inspection threadData: ', threadData);
                    if (isWorking && workTimeElapse > this.maximumWorkTime) {
                        console.warn(`Fetch worker thread ID: ${thread.id} is hanging up, details: ${JSON.stringify(threadData)}, it will be terminated.`);
                        this.terminateZombieThread(thread);
                    }
                    break;

                default:
                    break;
            }
        } else {
            // Thread message come with error.
            // if (threadData) {
            //     // const { taskId } = threadData;
            //     // Set the thread status to idle.
            //   }
            thread.busy = false;
            const reqPromise = this.taskMap.get(taskId);
            if (reqPromise) {
                reqPromise.reject({ code: threadCode, msg: threadMsg });
            }
        }
        this.nextTaskSchedule();
    }

    removeTask(taskId) {
        this.removing = true;
        const reqPromise = this.taskMap.get(taskId);
        if (reqPromise) {
            reqPromise.reject({ code: '' });
            this.taskMap.delete(taskId);
        }
        this.removing = false;
        this.waittingTasks = this.waittingTasks.filter(item => item.data?.taskId !== taskId);
        this.nextTaskSchedule();
    }

    removeTaskBy(filter) {
        if (!filter) {
            return;
        }
        this.taskMap.forEach((v, taskId) => {
            const { resolve, reject, userData } = v;
            if (filter(userData, taskId)) {
                reject({ code: '' });
                this.taskMap.delete(taskId);
                this.waittingTasks = this.waittingTasks.filter(item => item.data?.taskId !== taskId);
            }
        });
        this.nextTaskSchedule();
    }

    removeAllTask() {
        this.removing = true;
        const reqPromises = [...this.taskMap.values()];
        this.taskMap.clear();
        reqPromises.forEach(p => {
            const reqPromise = p;
            if (reqPromise) {
                reqPromise.reject({ code: '' });
            }
        });
        this.waittingTasks = [];

        this.removing = false;
    }

    // 下一任务调度
    nextTaskSchedule() {
        const thread = this.threads.filter(t => !t.busy)[0];
        if (thread && this.waittingTasks.length > 0) {
            const taskData = this.waittingTasks.shift();
            // console.log('nextTaskSchedulethread: ', thread, taskData);
            // console.log('...taskData: ', taskData);
            if (taskData) {
                thread.postMessage(...taskData);
                thread.busy = true;
            }
        }
    }

    // 检测线程状态
    inspectThreads() {
        if (this.threads.length > 0) {
            this.threads.forEach(thread => {
                thread.postMessage({
                    channel: 'inspection',
                    data: { id: thread.id }
                });
            });
        }
    }

    // 终止僵尸线程并重建
    terminateZombieThread(thread) {
        const { id } = thread;
        this.threads.splice(id, 1, null);
        thread.terminate();
        // eslint-disable-next-line no-param-reassign
        thread = null;
        this.createThread(id);
    }

    //   派发线程任务
    dispatchThread(option = {}) {
        const { userData, taskIdKey, workerTransfer } = option;
        if (!userData) {
            return;
        }
        return new Promise((resolve, reject) => {
            // 任务ID：唯一标识每个任务，可外部指定userData中的值；否则内部生成
            const taskId = userData[taskIdKey] || `${Date.now()}-${Math.random()}`;
            //   console.log('taskId: ', taskId,userData[taskIdKey],taskIdKey);
            //   记录下任务的resolve, reject
            this.taskMap.set(taskId, { resolve, reject, userData });
            const postParams = [
                {
                    channel: 'task',
                    data: userData,
                    taskId
                }
            ];
            if (workerTransfer) {
                postParams.push(workerTransfer);
            }
            //   放入等待队列
            this.waittingTasks.push(postParams);

            //   console.log('this.waittingTasks: ', this.waittingTasks,[...this.taskMap.keys()]);
            //   刷队列调度任务给子线程
            this.nextTaskSchedule();
        });
    }

    destroy() {
        clearInterval(this.inspectInterval);

        this.threads.forEach(t => {
            t.terminate();
        });
        // this.threads = null;
        this.taskMap.clear();
    }
}
