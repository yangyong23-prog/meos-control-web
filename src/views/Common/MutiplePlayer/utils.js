import i18n from '@/localization';
/* eslint-disable radix */
export function formatDateTime(input) {
    // 1. 校验输入格式是否合法
    const error = validateDateTimeWithSeconds(input);
    if (error) throw new Error(error); // 或 return error;

    // 2. 解析日期（替换 '-' 为 '/' 确保兼容性）
    const normalizedInput = input.replace(/-/g, '/');
    const date = new Date(normalizedInput);

    // 3. 补零函数
    const padZero = num => num.toString().padStart(2, '0');

    // 4. 提取并格式化各部分
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());

    // 5. 组合为标准格式
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 支持校验秒的日期合法性函数
function validateDateTimeWithSeconds(input) {
    // 格式校验（含秒）
    const regex = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    const match = input.match(regex);
    if (!match) return i18n.global.t('meos_control_web.error_time_format_yyyy_mm_dd_hh_mm_ss');

    // 提取年月日时分秒
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const hours = parseInt(match[4], 10);
    const minutes = parseInt(match[5], 10);
    const seconds = parseInt(match[6], 10);

    // 基本范围校验
    if (month < 1 || month > 12) return i18n.global.t('meos_control_web.error_month_must_be_1_to_12');
    if (day < 1 || day > 31) return i18n.global.t('meos_control_web.error_day_must_be_1_to_31');
    if (hours < 0 || hours > 23) return i18n.global.t('meos_control_web.error_hour_must_be_00_to_23');
    if (minutes < 0 || minutes > 59) return i18n.global.t('meos_control_web.error_minutes_must_be_00_to_59');
    if (seconds < 0 || seconds > 59) return i18n.global.t('meos_control_web.error_seconds_must_be_00_to_59');

    // 精确校验月份天数（含闰年）
    const maxDay = getMaxDay(year, month);
    if (day > maxDay)
        return i18n.global.t('meos_control_web.date_wrong', {
            year: year,
            month: month,
            day: day
        });

    // 创建 Date 对象并校验一致性
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    if (
        date.getFullYear() !== year ||
        date.getMonth() + 1 !== month ||
        date.getDate() !== day ||
        date.getHours() !== hours ||
        date.getMinutes() !== minutes ||
        date.getSeconds() !== seconds
    ) {
        return i18n.global.t('meos_control_web.error_illegal_datetime');
    }

    return null; // 校验通过
}

// 辅助函数：获取某年某月的最大天数
function getMaxDay(year, month) {
    if (month === 2) {
        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        return isLeapYear ? 29 : 28;
    }
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1];
}

export function validateDateNinetyDays(input) {
    // 1. 格式校验（正则表达式匹配）
    const regex = /^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    const match = input.match(regex);
    if (!match) return i18n.global.t('meos_control_web.error_time_format_yyyymmddhhmmss');

    // 提取年月日时分并转为整数
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);
    const hours = parseInt(match[4], 10);
    const minutes = parseInt(match[5], 10);

    // 3. 创建 Date 对象并检查有效性
    const date = new Date(year, month - 1, day, hours, minutes);

    // 5. 校验是否在过去 90 天内
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    if (date <= ninetyDaysAgo || date >= now) {
        return i18n.global.t('meos_control_web.error_start_time_within_90_days');
    }

    // 所有校验通过
    return null;
}

export function calculateExpiryTime(startTimeStr, durationMinutes) {
    // 1. 解析输入时间（兼容浏览器，替换 '-' 为 '/'）
    const startDate = new Date(startTimeStr.replace(/-/g, '/'));

    // 2. 计算到期时间戳（分钟转毫秒：1分钟 = 60,000毫秒）
    const expiryTimestamp = startDate.getTime() + durationMinutes * 60 * 1000;
    const expiryDate = new Date(expiryTimestamp);

    // 3. 补零函数：确保两位数格式
    const padZero = num => num.toString().padStart(2, '0');

    // 4. 提取日期时间各部分
    const year = expiryDate.getFullYear();
    const month = padZero(expiryDate.getMonth() + 1); // 月份从0开始，需+1
    const day = padZero(expiryDate.getDate());
    const hours = padZero(expiryDate.getHours());
    const minutes = padZero(expiryDate.getMinutes());
    const seconds = padZero(expiryDate.getSeconds());

    // 5. 格式化为 yyyy-MM-dd HH:mm:ss
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
