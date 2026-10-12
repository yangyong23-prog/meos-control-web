// @ts-ignore
import i18n from '@/localization';
//  邮箱验证
export function validateEmail(value: string, callback: (error?: string) => void) {
    // const phoneReg = /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!reg.test(value) && value) {
        callback(i18n.global.t('operation_duty_homepage.meos_home_the_format_of_the_mailbox_is_wrong.'));
    } else {
        callback();
    }
}

//  邮箱验证
export function validatePhone(value: string, callback: (error?: string) => void) {
    const phoneReg = /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!phoneReg.test(value) && value) {
        callback(i18n.global.t('operation_duty_homepage.meos_home_the_format_of_the_mobile_phone_number_is_wrong'));
    } else {
        callback();
    }
}
