import dayjs from 'dayjs';
import { toNumber } from 'lodash';

export const handleDay = (day: string) => {
    const start = day.split(',')[0];
    const end = day.split(',')[1];
    return `${dayjs(start).format('MM.DD')}-${dayjs(end).format('MM.DD')}`;
};

export const handleTime = (time: string) => {
    const start = `2023-2-3 ${time.split(',')[0]}`;
    const end = `2023-2-3 ${time.split(',')[1]}`;
    return `${dayjs(start, 'HH').format('HH:mm')}-${dayjs(end).format('HH:mm')}`;
};

export const handleVlaue = (data: number | null) => {
    if (data) {
        return toNumber(data).toFixed(1);
    }
    return '--';
};

export const handUseData = (data: any, useData: any, key: any, value: any) => {
    if (typeof data[key] !== 'undefined') {
        return data[key] === 0 ? `${data[key]}` : data[key];
    }
    if (typeof useData[key] !== 'undefined') {
        return useData[key] === 0 ? `${useData[key]}` : useData[key];
    }
    return value;
};
