import { $Message } from 'meri-plus';
import Decimal from 'decimal.js';
import { ERRORMESSAGE, getDayjsTz, SUCCESSMESSAGE } from './globalVariables';
import baseStore from '@/store/baseStore';
import dayjs from 'dayjs';
import { IOTObject } from '@/views/operationMonitoring/operationMonitoringAside/controlAndAberrant/controls/types';
import { toNumber } from 'lodash';
import i18n from '@/localization';
import { dayjsIsAfter } from './dayjsTools';

// import userStore from '@/store/userStore';
/**
 * @description: 滚动到指定节点
 * @return {*}
 * @param {string} className
 * @param {ScrollIntoViewOptions} scrollIntoViewOptions
 */
export const scrollToNode = (className: string, scrollIntoViewOptions: ScrollIntoViewOptions): void => {
    const element: HTMLElement | null = document.querySelector(className) || null;
    try {
        element?.scrollIntoView(scrollIntoViewOptions);
    } catch (error) {
        console.error('scrollIntoView error', error);
    }
};
// 定义一个函数来计算两个数字的最大公约数
function greatestCommonDivisor(x: number, y: number) {
    // 使用欧几里得算法来计算最大公约数
    if (y === 0) {
        return x;
    }
    return greatestCommonDivisor(y, x % y);
}

// 定义一个函数来计算数字数组的最小公倍数
export function findLeastCommonMultiple(numbers: number[]) {
    let gcd = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        gcd = greatestCommonDivisor(gcd, numbers[i]);
    }
    return gcd;
}
/**
 * @description 关闭按钮loading
 * @param {string} id 按钮id
 * @return {*}
 */
export const closeLoading = (id: string | undefined) => {
    try {
        const button: HTMLButtonElement | null = document.querySelector(`#${id?.split('/').pop()}`);
        if (button) {
            button.disabled = false;
            button.classList.remove('iconfont');
            button.classList.remove('icon-jiazai');
            button.classList.remove('auto-loading');
        }
    } catch (e) {
        // console.error(e);
    }
};

/**
 * @description: 判断数据是否为空，是返回--，否返回数据本身
 * @param {any} data
 * @return {*}
 */
export const isEmpty = (data: any): any => (data === '' || data === null || typeof data === 'undefined' ? '--' : data);

export const isEmptyNoReturn = (data: any): any => data === '' || data === null || typeof data === 'undefined';

type DecimalValue = Decimal.Value;
type PreciseResult<ShouldToNumber extends boolean> = ShouldToNumber extends true ? number : Decimal;

export const usemessageInfo = (title: any) => {
    $Message.Default({ title });
};

export function getImageUrl(name: string) {
    return new URL(`../assets/imgs/${name}`, import.meta.url).href;
}

export const getAuth: (id: string) => boolean = id => {
    const store = baseStore();
    const auth = store?.userInfo?.authorizations?.find((item: any) => item.authorizationId === id);
    return !!auth;
};

export const getQueryString = (name: string) => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    return url.searchParams.get(name);
};
export const setScope = (step: number) => {
    // 获取当前时间并调整到最近的 step 分钟
    const now = getDayjsTz();
    const nextStep = now
        .add(step - (now.minute() % step), 'minute')
        .second(0)
        .millisecond(0);
    return nextStep.format('YYYY.MM.DD HH:mm:ss');
};
export const useErrorMessage = (title: string = ERRORMESSAGE) => {
    $Message.error({ title });
};

export const useSuccessMessage = (title: string = SUCCESSMESSAGE) => {
    $Message.success({ title });
};
export const validateLessNow = (value: string, callback: any, text = i18n.global.t('meos_control_web.date_check_error_1')) => {
    let data = '';
    if (value.includes('-')) {
        data = dayjs(value.split('-')[0]).format('YYYY.MM.DD HH:mm:59');
    } else {
        data = dayjs(value).format('YYYY.MM.DD HH:mm:59');
    }
    if (dayjsIsAfter(dayjs(data), getDayjsTz())) {
        callback();
    } else {
        callback(new Error(text));
    }
};
// export const hasAuth = (auth: string) => (userStore().getButtonAuth as any[]).includes(auth);
// export const hasAuth = <any>'1';
/**
 * @description: 获取值的类型
 * @param {*} data
 * @return {*}
 */
export const getValueStr = (data: IOTObject | any) => {
    if (data.dataSource?.length) {
        let str = '';
        data.dataSource.forEach((item: { [x: string]: string }) => {
            if (data.dataValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (item.code === data.dataValue || toNumber(item.code) === toNumber(data.dataValue)) {
                    str = item.name;
                }
            }
        });
        return { html: `<span>${str || '--'}</span>`, text: str || '--' };
    }
    // eslint-disable-next-line no-nested-ternary
    const value = isEmpty(data.dataValue);
    return {
        html: `<span>${data.dataValue || ''}</span> <span>${data.unit || ''}</span>`,
        text: `${value} ${data.unit || ''}`
    };
};

/**
 * @description: 获取控制部分的实际值和设定值
 * @param {*} data
 * @return {*}
 */
export const getSetValueAndActualValue = (data: IOTObject | any) => {
    let actualStr = '',
        actualstr = '';
    if (data.dataSource) {
        data.dataSource.forEach((item: { [x: string]: string }) => {
            if (data.dataValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (toNumber(item.code) === toNumber(data.dataValue)) {
                    actualstr = item.name;
                }
            }
            if (data.actualValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (toNumber(item.code) === toNumber(data.actualValue)) {
                    actualStr = item.name;
                }
            }
        });
        return {
            html: `<span>${actualstr || '--'}</span>`,
            text: actualstr || '--',
            actualHtml: `<span>${actualStr || '--'}`,
            actualText: actualStr || '--'
        };
    }
    const settingValue = data.dataValue ? data.dataValue : '--';
    const actualValue = data.actualValue ? data.actualValue : '--';
    return {
        html: `<span>${data.dataValue || ''}</span> <span>${data.unit || ''}</span>`,
        actualHtml: `<span>${data.actualValue || ''}</span> <span>${data.unit || ''}</span>`,
        actualText: `${actualValue} ${data.unit || ''}`,
        text: `${settingValue} ${data.unit || ''}`
    };
};

export const btnText = (item: IOTObject) => {
    if (item.dataSource) {
        if (item.dataValue) {
            return item.dataValue === '1' ? i18n.global.t('common.status_close') : i18n.global.t('common.status_open');
        }
        return i18n.global.t('common.status_open');
    }
    return i18n.global.t('meos_control_web.modify');
};
export const btnText1 = (item: IOTObject) => {
    if (item.dataSource) {
        if (item.dataValue) {
            // console.log(item);
            return item.dataValue === '1' ? i18n.global.t('common.status_close') : i18n.global.t('common.status_open');
        }
        return i18n.global.t('common.status_open');
    }
    return i18n.global.t('meos_control_web.setpoint');
};
/**
 * @description: 判断有几位小小数
 * @param {*} number
 * @return {*}
 */
export const decimalsForJudgment = (number: number): number => {
    // 小数点的位置
    const x = String(number).indexOf('.') + 1;
    // 小数的位数
    const y = String(number).length - x;
    if (x === 0) {
        return x;
    }
    return y;
};

/**
 * @description: 获取两个时间之间的日期
 * @param {string} startDate
 * @param {string} endDate
 * @return {*}
 */
export const enumerateDaysBetweenDates = (startDate: string, endDate: string) => {
    const list = [];
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const day = end.diff(start, 'days');
    let nowDay = start;
    for (let i = 0; i <= day; i++) {
        list.push(nowDay.format('YYYY.MM.DD'));
        nowDay = dayjs(nowDay).add(1, 'days');
    }
    return list;
};

/**
 * 随机生成字符串
 * @param len
 */
export const randomString = (len = 32) => {
    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

export const getTimeStamp = (date: string) => {
    if (!date) {
        return getDayjsTz().valueOf();
    }
    return dayjs(date).valueOf();
};

/**
 * 判断两个区间是否有交集
 * @param arr1 数字数组，两个，开始和结束 ,比如[1,3]
 * @param arr2 [2,4]
 * @param isOpenRange ，是否是开区间，开区间 [1,2]和[2,4]无交集,闭区间有交集
 */
export const rangeIsIntersect = (arr1: number[], arr2: number[], isOpenRange = true) => {
    const start = [Math.min(...arr1), Math.min(...arr2)], //区间的两个最小值
        end = [Math.max(...arr1), Math.max(...arr2)]; //区间的两个最大值
    return isOpenRange ? Math.max(...start) < Math.min(...end) : Math.max(...start) <= Math.min(...end);
};

/**
 * 根据指定的分钟间隔生成一天的时间数组
 * @param minute 分钟间隔，默认为5分钟
 * @returns 返回一天内每5分钟（或指定间隔）的一个时间数组，格式为HH:mm
 */
export function generateTimeArrayByMinutes(minute = 5) {
    // 初始化时间数组
    const timeArray = [];
    // 初始化小时和分钟变量
    let hours = 0,
        minutes = 0;

    // 循环直到小时数达到24
    while (hours < 24) {
        // 将当前的小时和分钟格式化为HH:mm字符串
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        // 将格式化后的时间字符串添加到时间数组中
        timeArray.push(timeStr);

        // 增加分钟，根据传入的分钟间隔
        minutes += minute;

        // 如果分钟数达到或超过60，需要进位到小时
        if (minutes >= 60) {
            minutes -= 60;
            hours++;
        }
    }

    // 返回生成的时间数组
    return timeArray;
}
export function splitArrayIntoChunks<T>(arr: T[], chunkSize = 10): T[][] {
    /**
     * 将给定的数组`arr`按照指定的`chunkSize`进行拆分。
     *
     * @param arr 需要拆分的原始数组。
     * @param chunkSize 每个子数组包含的元素数量，默认为10。
     * @return 拆分后的子数组列表。
     */
    return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize));
}

/**
 * 根据给定的时间字符串和操作类型（加或减），以指定的精度调整时间五分钟.
 *
 * 此函数接受一个时间字符串（例如'12:34'），一个布尔值指示是否添加时间，
 * 和一个精度值（分钟数），然后返回调整后的时间字符串。
 *
 * @param timeStr - 输入的时间字符串，格式为'HH:MM'。
 * @param isAdd - 指示是否添加时间的布尔值，true表示添加，false表示减去。
 * @param precision - 时间调整的精度，表示分钟数。
 * @returns 调整后的时间字符串，格式为'HH:MM'。
 */
export const addOrSubtractFiveMinutes = (timeStr: string, isAdd: boolean, precision: number) => {
    // 将输入的时间字符串分割为小时和分钟，并转换为数字
    const [hours, minutes] = timeStr.split(':').map(Number);
    let newMinutes: number = minutes;

    // 根据isAdd参数决定是添加还是减去精度所指定的分钟数
    if (isAdd) {
        newMinutes += precision;
    } else {
        newMinutes -= precision;
    }

    // 如果新计算的分钟数小于0，需要调整小时数和分钟数
    if (newMinutes < 0) {
        newMinutes += 60; // 分钟数回绕到60
        // 计算新的小时数，确保小时数在0到23之间
        const newHours: number = (hours - 1 + 24) % 24;
        // 返回调整后的时间字符串
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }

    // 如果新计算的分钟数大于等于60，同样需要调整小时数和分钟数
    if (newMinutes >= 60) {
        newMinutes -= 60; // 分钟数回绕到60
        // 计算新的小时数，确保小时数在0到23之间
        const newHours: number = (hours + 1) % 24;
        // 返回调整后的时间字符串
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }

    // 如果分钟数没有超出范围，直接返回调整后的分钟数和原始小时数组成的时间字符串
    return `${hours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

/**
 * 找出数组中距离目标数字最近的数及其索引
 * @param {number[]} arr - 输入数组
 * @param {number} target - 目标数字
 * @returns {{index: number, value: number} | null} - 最接近数字的索引和值，如果数组为空则返回null
 */
export function findClosestNumberWithIndex(arr: number[], target: number) {
    if (arr.length === 0) return null;

    return arr.reduce(
        (closest, current, index) => {
            const currentDiff = Math.abs(current - target);
            const closestDiff = Math.abs(closest.value - target);

            if (currentDiff < closestDiff || (currentDiff === closestDiff && current < closest.value)) {
                return { index, value: current };
            } else {
                return closest;
            }
        },
        { index: 0, value: arr[0] }
    );
}

export function getFiveMinuteData(startTime: string, endTime: string, precision = 5) {
    // 辅助函数：将 HH:mm 格式转换为分钟数
    const toMinutes = (time: any) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // 辅助函数：将分钟数转换为 HH:mm 格式
    const toTimeString = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    const result = [];
    for (let i = startMinutes; i <= endMinutes; i += precision) {
        result.push(toTimeString(i));
    }

    return result;
}

export const getNextFiveMinutePoint = (time = getDayjsTz()) => {
    const nextFiveMinutePoint = time
        .add(5 - (time.minute() % 5), 'minute')
        .second(0)
        .millisecond(0);
    return nextFiveMinutePoint.format('YYYY.MM.DD HH:mm:ss');
};

const disableTipsText = i18n.global.t('meos_control_web.equipment_offline_local_no_control');
/**
 * 检查设备是否可被控制
 *
 * @param infoCodes - 设备信息码数组，包含设备状态信息
 * @param text - 不可控时返回的提示文本，默认为'设备处于离线或本地时不可进行控制'
 * @returns 返回控制状态对象，包含是否可控(value)和提示文本(text)
 */
export const canControl = (infoCodes: any[], text = disableTipsText): { value: boolean; text: string } => {
    // 从infoCodes中获取在线状态和本地/远程状态
    const onlineStatus = infoCodes?.find((item: any) => item?.infoCode === 'onlineStatus');
    const localRemoteStatus = infoCodes?.find((item: any) => item?.infoCode === 'localRemoteStatus');
    // 情况1：设备在线且不存在[IoT规则（本地模式）、配置表未配置本地远程模式]时可控制
    if (onlineStatus?.dataValue === '1' && !localRemoteStatus?.existsIotRule) {
        return {
            value: true,
            text: ''
        };
    }

    // 情况2：设备在线且处于远程模式时可控制
    if (onlineStatus?.dataValue === '1' && localRemoteStatus?.dataValue === '1') {
        return {
            value: true,
            text: ''
        };
    }

    // 其他情况均不可控制
    return {
        value: false,
        text
    };
};

export const modelType = () => {
    return sessionStorage.getItem('modelType');
};
export const setModelType = (value: string) => {
    sessionStorage.setItem('modelType', value);
};

export const clearModelType = () => {
    sessionStorage.removeItem('modelType');
};

/**
 * 递归提取对象中所有的 infoCode 值
 * @param {Object|Array} obj - 要遍历的对象或数组
 * @returns {Array<string>} - 所有的 infoCode 值数组（已去重）
 */
export const extractInfoCodes = (obj: unknown): string[] => {
    const infoCodesSet = new Set<string>();
    const visitedSet = new WeakSet<object>(); // 防止循环引用

    const traverse = (data: unknown): void => {
        // 如果不是对象或数组，直接返回
        if (!data || typeof data !== 'object') {
            return;
        }

        // 检测循环引用
        if (visitedSet.has(data)) {
            return;
        }
        visitedSet.add(data);

        // 如果是数组，递归处理每个元素
        if (Array.isArray(data)) {
            data.forEach((item: unknown) => traverse(item));
            return;
        }

        // 如果当前对象有 infoCode 属性，收集它
        const record = data as Record<string, unknown>;
        if (record.infoCode && typeof record.infoCode === 'string') {
            infoCodesSet.add(record.infoCode);
        }

        // 递归处理对象的所有属性值
        Object.values(record).forEach((value: unknown) => {
            traverse(value);
        });
    };

    traverse(obj);
    return Array.from(infoCodesSet);
};

/**
 * 将 CSS 变量转换为实际的颜色值
 *
 * @param {string} cssVar - CSS 颜色值或 CSS 变量（如 'var(--color-primary)' 或 '#FF0000'）
 * @returns {string} 实际的颜色值（RGB 格式或原始颜色值）
 * @example
 * getActualColor('var(--red-300)') // 返回 'rgb(250, 155, 150)'
 * getActualColor('#FF0000') // 返回 '#FF0000'
 */
export const getActualColor = (cssVar: string): string => {
    if (!cssVar.startsWith('var(')) return cssVar;

    // 创建临时元素，设置为不可见并添加到 DOM
    const tempEl = document.createElement('div');
    tempEl.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
    tempEl.style.color = cssVar;
    document.body.appendChild(tempEl);

    // 获取计算后的颜色值
    const { color } = getComputedStyle(tempEl);

    // 从 DOM 中移除元素，浏览器会自动进行垃圾回收
    document.body.removeChild(tempEl);

    return color;
};

/**
 * 精确加法，避免 JavaScript 浮点数运算误差。
 *
 * @param {DecimalValue} augend - 被加数
 * @param {DecimalValue} addend - 加数
 * @param {ShouldToNumber} shouldToNumber - 是否将结果转换为 number，默认为 true；传 false 时返回 Decimal
 * @returns {PreciseResult<ShouldToNumber>} 精确加法结果
 * @example
 * preciseAdd(0.1, 0.2) // 返回 0.3
 * preciseAdd(0.1, 0.2, false) // 返回 Decimal 实例
 */
export const preciseAdd = <ShouldToNumber extends boolean = true>(
    augend: DecimalValue,
    addend: DecimalValue,
    shouldToNumber: ShouldToNumber = true as ShouldToNumber
): PreciseResult<ShouldToNumber> => {
    const result = new Decimal(augend).plus(addend);
    return (shouldToNumber ? result.toNumber() : result) as PreciseResult<ShouldToNumber>;
};

/**
 * 精确减法，避免 JavaScript 浮点数运算误差。
 *
 * @param {DecimalValue} minuend - 被减数
 * @param {DecimalValue} subtrahend - 减数
 * @param {ShouldToNumber} shouldToNumber - 是否将结果转换为 number，默认为 true；传 false 时返回 Decimal
 * @returns {PreciseResult<ShouldToNumber>} 精确减法结果
 * @example
 * preciseSubtract(0.3, 0.1) // 返回 0.2
 * preciseSubtract(0.3, 0.1, false) // 返回 Decimal 实例
 */
export const preciseSubtract = <ShouldToNumber extends boolean = true>(
    minuend: DecimalValue,
    subtrahend: DecimalValue,
    shouldToNumber: ShouldToNumber = true as ShouldToNumber
): PreciseResult<ShouldToNumber> => {
    const result = new Decimal(minuend).minus(subtrahend);
    return (shouldToNumber ? result.toNumber() : result) as PreciseResult<ShouldToNumber>;
};

/**
 * 精确乘法，避免 JavaScript 浮点数运算误差。
 *
 * @param {DecimalValue} multiplicand - 被乘数
 * @param {DecimalValue} multiplier - 乘数
 * @param {ShouldToNumber} shouldToNumber - 是否将结果转换为 number，默认为 true；传 false 时返回 Decimal
 * @returns {PreciseResult<ShouldToNumber>} 精确乘法结果
 * @example
 * preciseMultiply(0.1, 0.2) // 返回 0.02
 * preciseMultiply(0.1, 0.2, false) // 返回 Decimal 实例
 */
export const preciseMultiply = <ShouldToNumber extends boolean = true>(
    multiplicand: DecimalValue,
    multiplier: DecimalValue,
    shouldToNumber: ShouldToNumber = true as ShouldToNumber
): PreciseResult<ShouldToNumber> => {
    const result = new Decimal(multiplicand).times(multiplier);
    return (shouldToNumber ? result.toNumber() : result) as PreciseResult<ShouldToNumber>;
};

/**
 * 精确除法，除数为 0 时抛出异常。
 *
 * @param {DecimalValue} dividend - 被除数
 * @param {DecimalValue} divisor - 除数，不能为 0
 * @param {ShouldToNumber} shouldToNumber - 是否将结果转换为 number，默认为 true；传 false 时返回 Decimal
 * @returns {PreciseResult<ShouldToNumber>} 精确除法结果
 * @example
 * preciseDivide(0.3, 0.1) // 返回 3
 * preciseDivide(1, 3, false) // 返回 Decimal 实例
 */
export const preciseDivide = <ShouldToNumber extends boolean = true>(
    dividend: DecimalValue,
    divisor: DecimalValue,
    shouldToNumber: ShouldToNumber = true as ShouldToNumber
): PreciseResult<ShouldToNumber> => {
    const decimalDivisor = new Decimal(divisor);
    if (decimalDivisor.isZero()) {
        throw new RangeError('Divisor cannot be zero.');
    }
    const result = new Decimal(dividend).dividedBy(decimalDivisor);
    return (shouldToNumber ? result.toNumber() : result) as PreciseResult<ShouldToNumber>;
};
