// @ts-ignore
import i18n from '@/localization';
/**
 * 毫秒转成分钟和秒
 * @param milliseconds
 * @returns {{seconds: number, minutes: number}}
 */
export const msToMinutesAndSeconds = milliseconds => {
    // 一分钟有60000ms
    const oneMinMs = 60000;
    // 先算余数多少秒
    const seconds = Math.floor((milliseconds % oneMinMs) / 1000);
    // 再算多少分钟
    const minutes = Math.floor(milliseconds / oneMinMs);

    return {
        minutes,
        seconds
    };
};

/**
 * 判断是否为空值  注意 0 为非空值
 * @param {*} value
 * @returns Boolean
 */
export const emptyValue = value => {
    if (value !== 0 && !value) {
        return true;
    }
    return Object.prototype.toString.call(value) === '[object Array]' && !value.length;
};
