import qs from 'qs';
import { isString } from 'lodash';
import dayjs from 'dayjs';
import { getDayjsTz } from '@/utils/globalVariables';
import { dayjsIsSame } from '@/utils/dayjsTools';
import { cryptoInstance } from './persagyTools';

/**
 * 获取project id
 * @returns string
 */
export const getProjectIdByUrl = () => {
    const search = location.search.slice(1);
    const searchObj = qs.parse(search);
    if (isString(searchObj.pj)) {
        return cryptoInstance.Decrypt(searchObj.pj);
    }
    if (isString(searchObj.projectId)) {
        return searchObj.projectId;
    }
    return '';
};

/**
 * 现代浏览器下载
 * @param blob {blob} 文件流
 * @param fileName {string} 文件名
 */
const downloadByATag = function downloadByATag(blob: Blob, fileName: string) {
    // 支持a标签download的浏览器/rules/strict-boolean-expressions
    const link = document.createElement('a'); // 创建a标签
    link.download = fileName; // A标签添加属性
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click(); // 执行下载
    URL.revokeObjectURL(link.href); // 释放url
    document.body.removeChild(link); // 释放标签
};
/**
 * IE浏览器下载
 * @param blob {blob} 文件流
 * @param fileName {string} 文件名
 */
const downloadByIE = function downloadByIE(blob: Blob, fileName: string) {
    (navigator as any).msSaveBlob(blob, fileName);
};
/**
 * 下载文件
 * @param blob {blob} 文件流
 * @param fileName {string} 文件名
 */
export const downloadFileByBlob = function downloadFileByBlob(blob: Blob, fileName: string) {
    if ('download' in document.createElement('a')) {
        downloadByATag(blob, fileName);
    } else {
        downloadByIE(blob, fileName);
    }
};

/**
 * 异步函数sleep，用于模拟延迟操作。 *
 * @param delay 延迟的时间，以毫秒为单位。
 * @param params 解决Promise时传递的参数，可以是任何类型T。
 * @returns 返回一个Promise，该Promise在延迟后解决，并传递给resolve的参数。
 */
export const sleep = <T>(params: T, delay?: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay ?? 1000, params);
    }) as Promise<T>;
};

/**
 * 创建一个范围生成器，用于生成从start到end的范围内的数值序列
 * @param end 结束值，不包含在生成的序列中
 * @param start 开始值，默认为0，包含在生成的序列中
 * @param step 步长，默认为1，生成的数值序列会以这个间隔递增
 * @returns 返回一个迭代器对象，该对象可以用于遍历从start到end的范围内的数值序列
 */
export const rangeGenerator = (end: number, start = 0, step = 1) => {
    function* generateRange() {
        let x = start - step;
        while (x < end - step) yield (x += step);
    }
    return {
        [Symbol.iterator]: generateRange
    };
};

export const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * 生成一个日期范围内的日期序列。
 * 该函数是一个生成器函数，每次调用 `next()` 方法时，会返回当前日期，并将日期增加指定的步长。
 *
 * @param {Date} start - 日期范围的起始日期。
 * @param {Date} end - 日期范围的结束日期。
 * @param {number} [step=1] - 日期增加的步长（以天为单位）。默认为1。
 * @yields {Date} 返回当前日期。
 */
export const dateRangeGenerator = function* (start: Date, end: Date, step = 1) {
    const d = new Date(start);
    while (d <= end) {
        yield new Date(d);
        d.setDate(d.getDate() + step);
    }
};

// 格式化数字，转为千分位数字
export const formatNumber = (num: number) => new Intl.NumberFormat().format(num);
export const extractAndFormatNumber = (str: string | number) => {
    const numberStr = str?.toString()?.replace?.(/[^0-9.-]+/g, '');
    if (!numberStr) {
        return '0';
    }
    const number = parseInt(numberStr);
    const formattedNumber = formatNumber(number);
    return formattedNumber;
};

/**
 * 生成一天内每15分钟的间隔时间数组
 * 这个函数主要用于构建一个包含从午夜开始到当天结束，每个15分钟间隔的时间点的数组
 *
 * @returns {string[]} 包含一天内每15分钟间隔时间的字符串数组，格式为HH:mm
 */
export function get15MinuteIntervals() {
    const intervals = [];

    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            intervals.push(`${formattedHour}:${formattedMinute}`);
        }
    }

    return intervals;
}

/**
 * 过滤树形结构数据，根据叶子节点ID保留或排除特定节点
 *
 * @template T - 树节点类型，必须包含children字段表示子节点
 * @param {T[]} tree - 原始树形结构数据
 * @param {Object} config - 配置对象
 * @param {string[]} config.leafIds - 目标叶子节点ID集合
 * @param {boolean} [config.isExclude=true] - 过滤模式：true=排除模式，false=包含模式
 * @param {string[][]} [config.matchMap] - 属性映射规则数组，格式为[[原属性, 目标属性]]
 * @param {string} [config.idKey='id'] - 节点ID的属性名，默认'id'
 * @param {string} [config.leafKey] - 标识节点是否为叶子的属性名
 * @returns {T[]} 过滤后的新树结构（深拷贝不影响原数据）
 */
export const filterTreeByLeafIds = <T extends Record<string, any> & { children?: T[] }>(
    tree: T[],
    config: {
        leafIds: string[];
        isExclude: boolean;
        matchMap?: string[][];
        idKey?: string;
        leafKey?: string;
    }
) => {
    const { leafIds, isExclude = true, matchMap, idKey = 'id', leafKey } = config || {};
    // 核心过滤逻辑：处理属性映射并递归过滤子节点
    const filterNode = (node: T) => {
        // 执行属性映射：将origin属性值复制到target属性
        if (Array.isArray(matchMap) && matchMap?.length) {
            matchMap.forEach(([origin, target]) => {
                if (Object.keys(node).includes(origin)) {
                    (node as any)[target] = node[origin];
                }
            });
        }

        // 处理叶子节点逻辑分支：
        // 1. 当存在leafKey定义且当前节点是叶子节点时，根据模式判断是否保留
        // 2. 当没有子节点时（隐式叶子节点），同样根据模式判断是否保留
        if (leafKey && node[leafKey]) {
            return isExclude ? !leafIds.includes(node[idKey]) : leafIds.includes(node[idKey]);
        } else if (!node?.children?.length) {
            return isExclude ? !leafIds.includes(node[idKey]) : leafIds.includes(node[idKey]);
        }

        // 处理父节点：递归过滤子节点后判断是否保留
        const filteredChildren = node.children
            .map((child: T) => ({ ...child })) // 子节点深拷贝
            .filter((child: T) => filterNode(child)); // 递归过滤子节点

        // 保留有有效子节点的父节点
        if (filteredChildren.length) {
            node.children = filteredChildren;
            return true;
        }

        return false;
    };

    // 创建树结构副本并进行过滤
    return tree
        .map(node => ({ ...node })) // 根节点深拷贝
        .filter(node => filterNode(node)); // 执行过滤逻辑
};

/**
 * 处理树节点展开逻辑
 * @param node - 当前需要处理的树节点对象，需要包含children、parent等树形结构属性
 * @param config - 可选配置项
 * @param config.lv - 指定要展开的节点层级（优先级高于checkNode）
 * @param config.checkNode - 自定义节点检查函数，返回boolean决定是否展开
 * @param config.found - 用于标记是否已找到目标节点的响应式对象（通常来自Vue ref）
 * @returns void
 */
export const handleTreeNodeOpen = (
    node: any,
    config?: {
        lv?: number;
        checkNode?: (node: any) => boolean;
        found?: any;
    }
) => {
    const { found, checkNode, lv } = config || {};
    if (found && found.value) return; // 发现目标节点后终止后续遍历

    const isFlagOpen = lv?.toString() ? node?.lv === lv : checkNode?.(node);
    if (isFlagOpen) {
        // 展开当前节点
        node.open = true;

        // 回溯展开所有父节点
        let { parent } = node;
        while (parent) {
            parent.open = true;
            ({ parent } = parent);
        }

        if (found) {
            found.value = true; // 标记已找到目标
            return; // 终止后续子节点遍历
        }
    }

    // 未找到时继续递归子节点
    if (!found?.value && node?.children?.length) {
        node.children.forEach((child: any) => {
            handleTreeNodeOpen(child, { found, checkNode, lv });
        });
    }
};

// 判断时间段中是否有一个时间段在当日
export const checkRangesToday = (timeRange: unknown) => {
    if (!Array.isArray(timeRange) || timeRange.length !== 2) {
        return false;
    }

    const [start, end] = timeRange;
    if (!start || !end) {
        return false;
    }

    const startTime = dayjs(start);
    const endTime = dayjs(end);
    const today = getDayjsTz();

    const isStartMidnight = startTime.hour() === 0 && startTime.minute() === 0 && startTime.second() === 0;
    const isEndMidnight = endTime.hour() === 0 && endTime.minute() === 0 && endTime.second() === 0;

    const isStartSameDay = dayjsIsSame(today, start, 'day') && !isStartMidnight;
    const isEndSameDay = dayjsIsSame(today, end, 'day') && !isEndMidnight;
    const isEndNextDay = dayjsIsSame(today.add(1, 'day'), end, 'day') && isEndMidnight;

    return isStartSameDay || isEndSameDay || isEndNextDay;
};

// 转换时间段为当日的时间段
export const convertRangesToToday = (timeRange: unknown) => {
    if (!Array.isArray(timeRange) || timeRange.length !== 2) {
        return [];
    }
    const [start, end] = timeRange;
    if (!start || !end) {
        return [];
    }

    const startTime = dayjs(start);
    const endTime = dayjs(end);
    const today = getDayjsTz();

    const isStartSameDay = dayjsIsSame(today, startTime, 'day');
    const isEndSameDay = dayjsIsSame(today, endTime, 'day');

    if (isStartSameDay && !isEndSameDay) {
        return [startTime.format('HH:mm'), `24:00`];
    }

    if (isEndSameDay && !isStartSameDay) {
        return [`00:00`, endTime.format('HH:mm')];
    }
    if (!isStartSameDay && !isEndSameDay) {
        return ['00:00', '00:00'];
    }
    return [startTime.format('HH:mm'), endTime.format('HH:mm')];
};

export const numberFormatPercent = (num: number, digits?: number) => {
    try {
        const formatVal = new Intl.NumberFormat('zh-CN', {
            style: 'percent',
            maximumFractionDigits: digits ?? 2
        }).format(num);
        return formatVal;
    } catch (err) {
        return '--';
    }
};

export const urlContain = (str: string) => {
    return location.href?.includes(str);
};

interface ClassCodeIds {
    [key: string]: string[];
}

interface InstanceInfo {
    classCodeIds: ClassCodeIds;
    instanceIds: string[];
}

export const iterateObjct4InstanceInfo = (obj: any, filter: (key: string, value: any) => boolean): InstanceInfo => {
    const stack = [obj];
    const classCodeIds: ClassCodeIds = {};
    const instanceIds: string[] = [];
    while (stack?.length > 0) {
        const currentObj = stack.pop();
        Object.keys(currentObj).forEach(key => {
            const currentValue = currentObj[key];
            const currentValueClassCode = currentValue?.classCode;
            const currentValueId = currentValue?.id || currentValue?.objectId;
            if (currentValueClassCode && currentValueId) {
                if (filter) {
                    if (filter(key, currentValue)) {
                        instanceIds.push(currentValueId);
                        classCodeIds[currentValueClassCode] ? classCodeIds[currentValueClassCode].push(currentValueId) : (classCodeIds[currentValueClassCode] = [currentValueId]);
                    }
                } else {
                    instanceIds.push(currentValueId);
                    classCodeIds[currentValueClassCode] ? classCodeIds[currentValueClassCode].push(currentValueId) : (classCodeIds[currentValueClassCode] = [currentValueId]);
                }
            }
            if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                stack.push(currentObj[key]);
            }
        });
    }
    return { classCodeIds, instanceIds };
};

interface RelInfoCodeConfig {
    infoCode: string;
}

interface RelInfoCodeGroupConfig {
    relInfoCodeConfigs?: RelInfoCodeConfig[];
    groupChildren?: RelInfoCodeGroupConfig[];
}

interface Item {
    id: string;
    relInfoCodeGroupConfigs?: RelInfoCodeGroupConfig[];
}

export const getInfoCodesObjectId = (arr: Item[]) => {
    const objectIdInfoCode: Record<string, string[]> = {};
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const setObj = new Set<string>();
        if (item.relInfoCodeGroupConfigs) {
            const stack = [...item.relInfoCodeGroupConfigs];
            while (stack.length) {
                const config = stack.pop()!;
                if (config.relInfoCodeConfigs) {
                    for (let j = 0; j < config.relInfoCodeConfigs.length; j++) {
                        setObj.add(config.relInfoCodeConfigs[j].infoCode);
                    }
                }
                if (config.groupChildren) {
                    stack.push(...config.groupChildren);
                }
            }
        }
        objectIdInfoCode[item.id] = Array.from(setObj);
    }
    return objectIdInfoCode;
};
