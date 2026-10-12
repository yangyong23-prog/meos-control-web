import { BooleanEnum } from '@/types/common';
import i18n from '@/localization';

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

/**
 * @description 关闭按钮loading
 * @param {string} id 按钮id
 * @return {*}
 */
export const closeLoading = (id: string | undefined) => {
    const button: HTMLButtonElement | null = document.querySelector(`#${id?.split('/').pop()}`);
    if (button) {
        button.disabled = false;
        button.classList.remove('iconfont');
        button.classList.remove('icon-jiazai');
        button.classList.remove('auto-loading');
        button.id = '';
    }
};

/**
 * @description: 判断数据是否为空，是返回--，否返回数据本身
 * @param {any} data
 * @return {*}
 */
export const isEmpty = (data: any): any => (data === '' || data === null || typeof data === 'undefined' ? '--' : data);

/**
 * @description: 表单的必填项对象
 * @return {*}
 */
export const formItemRuleRequired = (type = 'string') => ({
    type,
    required: true,
    message: i18n.global.t('meos_control_web.input_required_check_error_2'),
    trigger: ['blur', 'change']
});
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
 * @description: 获取枚举类型
 * @param {number} number - key
 * @return {*} 'True' | 'False'
 */
export function TrueOrFalse(key: number): 'True' | 'False' {
    switch (key) {
        case BooleanEnum.True:
            return 'True';
        case BooleanEnum.False:
            return 'False';
        default:
            return 'True';
    }
}
