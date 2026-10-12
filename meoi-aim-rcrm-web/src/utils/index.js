import { $Message } from 'meri-plus';
import { ERRORMESSAGE, SUCCESSMESSAGE } from '@/utils/globalVariables';
/**
 * 判断是否为空值  注意 0 为非空值
 * @param {*} value
 * @returns Boolean
 */
const emptyValue = value => {
    if (value !== 0 && !value) {
        return true;
    }
    return Object.prototype.toString.call(value) === '[object Array]' && !value.length;
};
export const useErrorMessage = (title = ERRORMESSAGE) => {
    $Message.error({ title, duration: 3000 });
};

export const useSuccessMessage = (title = SUCCESSMESSAGE) => {
    $Message.success({ title, duration: 3000 });
};
export { emptyValue };
