//  邮箱验证
export function validateEmail(value: string, callback: (error?: string) => void) {
    // const phoneReg = /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/
    const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!reg.test(value) && value) {
        callback('邮箱的格式有误');
    } else {
        callback();
    }
}

//  邮箱验证
export function validatePhone(value: string, callback: (error?: string) => void) {
    const phoneReg = /^(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!phoneReg.test(value) && value) {
        callback('手机号的格式有误');
    } else {
        callback();
    }
}
