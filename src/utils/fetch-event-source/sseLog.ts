import useStore from '@/store';
import { getDayjsTz } from '../globalVariables';
import { getJSON, setJSON } from '../storageUtils';
const STORE_KEY = 'sse_discard_log_list';
const MAX_LOG_SIZE = 99;

export const storeLog = (data: any) => {
    const { base } = useStore();
    const { projectId, groupCode } = base;
    const logMessage = {
        ...data,
        routePath: window.location.pathname,
        projectId,
        groupCode,
        createTime: getDayjsTz().format('YYYY-MM-DD HH:mm:ss')
    };
    const logList = getJSON(STORE_KEY) || [];
    while (logList.length >= MAX_LOG_SIZE) {
        logList.shift();
    }
    logList.push(logMessage);
    setJSON(STORE_KEY, logList);
};
