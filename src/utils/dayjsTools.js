import dayjs, { isDayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const dayjsIsAfter = (date1, date2, unit) => {
    const d1 = isDayjs(date1) ? date1.format('YYYY.MM.DD HH:mm:ss') : dayjs(date1).format('YYYY.MM.DD HH:mm:ss');
    const d2 = isDayjs(date2) ? date2.format('YYYY.MM.DD HH:mm:ss') : dayjs(date2).format('YYYY.MM.DD HH:mm:ss');
    if (unit) {
        return dayjs(d1).isAfter(dayjs(d2), unit);
    }
    return dayjs(d1).isAfter(dayjs(d2));
};

export const dayjsIsBefore = (date1, date2, unit) => {
    const d1 = isDayjs(date1) ? date1.format('YYYY.MM.DD HH:mm:ss') : dayjs(date1).format('YYYY.MM.DD HH:mm:ss');
    const d2 = isDayjs(date2) ? date2.format('YYYY.MM.DD HH:mm:ss') : dayjs(date2).format('YYYY.MM.DD HH:mm:ss');
    if (unit) {
        return dayjs(d1).isBefore(dayjs(d2), unit);
    }
    return dayjs(d1).isBefore(dayjs(d2));
};

export const dayjsIsSame = (date1, date2, unit) => {
    const d1 = isDayjs(date1) ? date1.format('YYYY.MM.DD HH:mm:ss') : dayjs(date1).format('YYYY.MM.DD HH:mm:ss');
    const d2 = isDayjs(date2) ? date2.format('YYYY.MM.DD HH:mm:ss') : dayjs(date2).format('YYYY.MM.DD HH:mm:ss');
    if (unit) {
        return dayjs(d1).isSame(dayjs(d2), unit);
    }
    return dayjs(d1).isSame(dayjs(d2));
};

export const dayjsIsSameOrAfter = (date1, date2, unit) => {
    return dayjsIsSame(date1, date2, unit) || dayjsIsAfter(date1, date2, unit);
};

export const dayjsIsSameOrBefore = (date1, date2, unit) => {
    return dayjsIsSame(date1, date2, unit) || dayjsIsBefore(date1, date2, unit);
};

export const dayjsIsBetween = (date1, date2, date3, unit, inclusivity) => {
    const d1 = isDayjs(date1) ? date1.format('YYYY.MM.DD HH:mm:ss') : dayjs(date1).format('YYYY.MM.DD HH:mm:ss');
    const d2 = isDayjs(date2) ? date2.format('YYYY.MM.DD HH:mm:ss') : dayjs(date2).format('YYYY.MM.DD HH:mm:ss');
    const d3 = isDayjs(date3) ? date3.format('YYYY.MM.DD HH:mm:ss') : dayjs(date3).format('YYYY.MM.DD HH:mm:ss');
    if (unit) {
        return dayjs(d1).isBetween(dayjs(d2), dayjs(d3), unit, inclusivity);
    }
    return dayjs(d1).isBetween(dayjs(d2), dayjs(d3));
};

export function dayTz(...args) {
    // Check if first argument is a string that needs format conversion
    if (args.length > 0 && typeof args[0] === 'string') {
        const datePattern = /^\d{4}\.\d{2}\.\d{2}/; // YYYY.MM.DD 或 YYYY.MM.DD HH:mm:ss
        const datePattern3 = /^\d{4}\/\d{2}\/\d{2}/; // YYYY/MM/DD HH:mm:ss

        if (datePattern.test(args[0])) {
            // Convert YYYY.MM.DD or YYYY.MM.DD HH:mm:ss to YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
            args[0] = args[0].replace(/\./g, '-');
        } else if (datePattern3.test(args[0])) {
            // Convert YYYY/MM/DD HH:mm:ss to YYYY-MM-DD HH:mm:ss
            args[0] = args[0].replace(/\//g, '-');
        }
    }

    // Call dayjs.tz with the processed arguments
    return dayjs.tz(...args);
}

export function dayjsFormat(time, format = 'YYYY-MM-DD HH:mm:ss') {
    if (time === undefined || time === null || time === '') return '';

    let source = time;
    if (typeof source === 'string') {
        source = source.trim();
        if (!source) return '';

        const dottedDate = /^\d{4}\.\d{2}\.\d{2}/; // Normalize YYYY.MM.DD*
        const slashedDate = /^\d{4}\/\d{2}\/\d{2}/; // Normalize YYYY/MM/DD*
        if (dottedDate.test(source)) {
            source = source.replace(/\./g, '-');
        } else if (slashedDate.test(source)) {
            source = source.replace(/\//g, '-');
        }
    }

    const instance = isDayjs(source) ? source : dayjs(source);
    if (!instance.isValid()) return '';

    return instance.format(format);
}
