// @ts-ignore
import i18n from '@/localization';
/*
 * @Author: guoxiaohuan
 * @Date: 2024-05-14 18:15:30
 * @LastEditors: guoxiaohuan
 * @LastEditTime: 2024-05-14 18:15:36
 * @Description:
 */
// 恢复默认自Tips展示
export const defaultValueTips = item => {
    // 多选控件
    if (item.controlStyle === 'CHECKBOX') {
        const str = item.items
            .map(code => {
                if (item.defaultValues.split(',').includes(code.key)) {
                    return `${code.value}${item.unit}`;
                }
            })
            .filter(a => a)
            .join(',');
        return i18n.global.t('meos_control_web.default_value_is', { val: str });
    } else if (item.controlStyle === 'LIMIT_INPUT') {
        return i18n.global.t('meos_control_web.default_value_is', { val: `${item.defaultValues.split(',')[0]}${item.unit}-${item.defaultValues.split(',')[1]}${item.unit}` });
    } else {
        return i18n.global.t('meos_control_web.default_value_is', { val: `${item.defaultValues}${item.unit}` });
    }
};

export const formatterValue = (arr: any) => {
    if (arr.length === 0) {
        return [];
    } else {
        return arr.map((item: any) => {
            if (item.controlStyle === 'LIMIT_INPUT') {
                item.valueLeft = isValue(item.value) ? item.value.split(',')[0] * 1 : 0;
                item.valueRight = isValue(item.value) ? item.value.split(',')[1] * 1 : 0;
                item.defaultValueLeft = isValue(item.defaultValues) ? item.defaultValues.split(',')[0] * 1 : 0;
                item.defaultValueRight = isValue(item.defaultValues) ? item.defaultValues.split(',')[1] * 1 : 0;
                item.valueInputLeft = item.valueLeft || item.defaultValueLeft;
                item.valueInputRight = item.valueRight || item.defaultValueRight;
            } else if (item.controlStyle === 'CHECKBOX') {
                item.valueLeft = isValue(item.value) ? item.value.split(',') : 0;
                item.defaultValueLeft = isValue(item.defaultValues) ? item.defaultValues.split(',') : 0;
                item.valueInputLeft = item.valueLeft || item.defaultValueLeft;
            } else {
                item.valueLeft = isValue(item.value) ? (item.controlStyle === 'RADIO_BUTTON' ? item.value : item.value * 1) : 0;
                item.defaultValueLeft = isValue(item.defaultValues) ? (item.controlStyle === 'RADIO_BUTTON' ? item.defaultValues : item.defaultValues * 1) : 0;
                item.valueInputLeft = item.valueLeft || item.defaultValueLeft;
            }
            return item;
        });
    }
};

export const isValue = value => {
    return value !== null && value !== undefined && value !== '' && !Number.isNaN(value) && value !== false;
};
