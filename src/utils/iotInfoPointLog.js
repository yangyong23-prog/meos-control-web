/**
 * iotInfoPointLog.js
 *
 * iot信息点日志记录工具
 * 用于记录设备iot信息点的变更历史，最多保存最近100条记录
 *
 * 功能特性：
 * - 支持异步批量写入，提高性能
 * - 支持同步立即写入，保证重要数据不丢失
 * - 自动维护数据在localStorage中的存储
 * - 页面卸载时自动保存待处理的日志
 * - 完整的异常处理，不影响业务逻辑
 *
 * @author AI Assistant
 * @date 2024
 */

import useStore from '@/store';
import { getDayjsTz } from './globalVariables';

const STORE_KEY = 'iot_info_point_log_list';
const MAX_LOG_SIZE = 100;
const FLUSH_INTERVAL = 500;

let pendingLogs = [],
    flushTimer = null,
    lastStoreState = null,
    boundBeforeUnload = null;

const flushLogs = () => {
    if (pendingLogs.length === 0) {
        flushTimer = null;
        return;
    }

    try {
        const currentStore = localStorage.getItem(STORE_KEY);
        let logList = [];

        if (currentStore) {
            try {
                logList = JSON.parse(currentStore);
            } catch (e) {
                logList = [];
            }
        }

        const allLogs = [...logList, ...pendingLogs];
        const trimmedLogs = allLogs.slice(-MAX_LOG_SIZE);

        const newStoreState = JSON.stringify(trimmedLogs);

        if (newStoreState !== lastStoreState) {
            localStorage.setItem(STORE_KEY, newStoreState);
            lastStoreState = newStoreState;
        }

        pendingLogs = [];
    } catch (error) {
        console.warn('[IotInfoPointLog] Failed to flush logs:', error);
        pendingLogs = [];
    }

    if (flushTimer !== null) {
        clearTimeout(flushTimer);
        flushTimer = null;
    }
};

const ensureBeforeUnloadHandler = () => {
    if (boundBeforeUnload !== null) {
        return;
    }

    boundBeforeUnload = () => {
        flushLogs();
    };

    window.addEventListener('beforeunload', boundBeforeUnload);
};

const removeBeforeUnloadHandler = () => {
    if (boundBeforeUnload !== null) {
        window.removeEventListener('beforeunload', boundBeforeUnload);
        boundBeforeUnload = null;
    }
};

export const storeIotInfoPointLog = (data, options = {}) => {
    if (options.sync) {
        try {
            const logMessage = {
                ...data,
                routePath: window.location.pathname,
                storeCreateTime: getDayjsTz().format('YYYY-MM-DD HH:mm:ss')
            };

            const currentStore = localStorage.getItem(STORE_KEY);
            let logList = [];

            if (currentStore) {
                try {
                    logList = JSON.parse(currentStore);
                } catch (e) {
                    logList = [];
                }
            }

            logList.push(logMessage);

            if (logList.length > MAX_LOG_SIZE) {
                logList = logList.slice(-MAX_LOG_SIZE);
            }

            localStorage.setItem(STORE_KEY, JSON.stringify(logList));
            return;
        } catch (error) {
            console.warn('[IotInfoPointLog] Failed to store log synchronously:', error);
            return;
        }
    }

    try {
        const logMessage = {
            ...data,
            routePath: window.location.pathname,
            storeCreateTime: getDayjsTz().format('YYYY-MM-DD HH:mm:ss')
        };

        pendingLogs.push(logMessage);

        ensureBeforeUnloadHandler();

        if (pendingLogs.length >= 10) {
            flushLogs();
        } else if (flushTimer === null) {
            flushTimer = setTimeout(() => {
                flushLogs();
            }, FLUSH_INTERVAL);
        }
    } catch (error) {
        console.warn('[IotInfoPointLog] Failed to queue log:', error);
    }
};

export const getIotInfoPointLogs = () => {
    try {
        const storeStr = localStorage.getItem(STORE_KEY);
        if (!storeStr) {
            return [];
        }

        try {
            return JSON.parse(storeStr);
        } catch (e) {
            return [];
        }
    } catch (error) {
        console.warn('[IotInfoPointLog] Failed to get logs:', error);
        return [];
    }
};

export const clearIotInfoPointLogs = () => {
    try {
        flushLogs();
        removeBeforeUnloadHandler();
        localStorage.removeItem(STORE_KEY);
        lastStoreState = null;
        pendingLogs = [];
    } catch (error) {
        console.warn('[IotInfoPointLog] Failed to clear logs:', error);
    }
};

export const flushPendingLogs = () => {
    flushLogs();
};
