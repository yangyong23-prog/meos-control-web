/*
 * @Author: guoxiaohuan
 * @Date: 2024-04-17 10:02:20
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-04-22 14:23:41
 * @Description:
 */
import { toNumber } from 'lodash';

export const getValueStr = data => {
    if (data.dataSource?.length) {
        let str = '';
        data.dataSource.forEach(item => {
            if (data.dataValue) {
                if (toNumber(item.code) === toNumber(data.dataValue)) {
                    str = item.name;
                }
            }
        });
        return {
            html: `<span>${str || '--'}</span>`,
            text: str || '--'
        };
    }
    const value = data.dataValue ? data.dataValue : '--';
    return {
        html: `<span>${data.dataValue || ''}</span> <span>${data.unit || ''}</span>`,
        text: `${value || '--'} `
    };
};
