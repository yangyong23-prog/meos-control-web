// @ts-ignore
import i18n from '@/localization';
// import userStore from '@/store/userStore';
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
// 定义一个函数来计算两个数字的最大公约数
function greatestCommonDivisor(x: number, y: number) {
    // 使用欧几里得算法来计算最大公约数
    if (y === 0) {
        return x;
    }
    return greatestCommonDivisor(y, x % y);
}

// 定义一个函数来计算数字数组的最小公倍数
export function findLeastCommonMultiple(numbers: number[]) {
    let gcd = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        gcd = greatestCommonDivisor(gcd, numbers[i]);
    }
    return gcd;
}
/**
 * @description 关闭按钮loading
 * @param {string} id 按钮id
 * @return {*}
 */
export const closeLoading = (id: string | undefined) => {
    try {
        const button: HTMLButtonElement | null = document.querySelector(`#${id?.split('/').pop()}`);
        if (button) {
            button.disabled = false;
            button.classList.remove('iconfont');
            button.classList.remove('icon-jiazai');
            button.classList.remove('auto-loading');
        }
    } catch (e) {
        console.error(e);
    }
};

/**
 * @description: 判断数据是否为空，是返回--，否返回数据本身
 * @param {any} data
 * @return {*}
 */
export const isEmpty = (data: any): any => (data === '' || data === null || typeof data === 'undefined' ? '--' : data);

export function getImageUrl(name: string) {
    return new URL(`../assets/imgs/${name}`, import.meta.url).href;
}

export const getQueryString = (name: string) => {
    const urlString = window.location.href;
    const url = new URL(urlString);
    return url.searchParams.get(name);
};

// export const hasAuth = (auth: string) => (userStore().getButtonAuth as any[]).includes(auth);
export const hasAuth = <any>'1';

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
 * 随机生成字符串
 * @param len
 */
export const randomString = (len = 32) => {
    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

/**
 * 判断两个区间是否有交集
 * @param arr1 数字数组，两个，开始和结束 ,比如[1,3]
 * @param arr2 [2,4]
 * @param isOpenRange ，是否是开区间，开区间 [1,2]和[2,4]无交集,闭区间有交集
 */
export const rangeIsIntersect = (arr1: number[], arr2: number[], isOpenRange = true) => {
    const start = [Math.min(...arr1), Math.min(...arr2)], //区间的两个最小值
        end = [Math.max(...arr1), Math.max(...arr2)]; //区间的两个最大值
    return isOpenRange ? Math.max(...start) < Math.min(...end) : Math.max(...start) <= Math.min(...end);
};

/**
 * 判断当前环境是否为 Edge 边缘端 浏览器。
 * @param WebEnv - 浏览器环境信息对象。
 * @returns 如果当前环境是 Edge 浏览器，则返回 true，否则返回 false。
 */
export const isEdge = () => {
    return (window as any).WebEnv?.Edge;
};
/**
 * 获取基础URL
 * 此函数用于根据当前环境动态获取API的基础URL
 * 当然是基于一个假设：存在一个`isEdge`函数来判断当前环境，以及一个在窗口对象上的`WebEnv`属性，其中可能包含服务器URL
 *
 * @returns {string} 基础URL字符串如果当前环境是Edge浏览器或者`WebEnv.SERVER_URL`未定义，则返回空字符串
 */
export const getBaseUrl = () => {
    // 如果当前环境是Edge浏览器，则返回空字符串
    // 否则，尝试从窗口对象的`WebEnv`属性中获取`SERVER_URL`的值，如果未定义，则默认返回空字符串
    return isEdge() ? '' : (window as any).WebEnv?.SERVER_URL || '';
};
/**
 * 获取MEOI服务器的URL
 *
 * 本函数旨在根据当前环境是否为Edge，来决定返回的MEOI服务器URL末尾是否加上'-edge'
 * 这样做是为了确保客户端能够根据不同的网络环境，连接到最合适的服务器
 *
 * @returns {string} MEOI服务器的URL
 */
export const getMeoiServerUrl = () => {
    // 根据是否是Edge环境，构造并返回相应的MEOI服务器URL
    return isEdge() ? `${getBaseUrl()}/meos-control-server-edge` : `${getBaseUrl()}/meos-control-server`;
};

export const getDtpServerUrl = () => {
    return isEdge() ? `${getBaseUrl()}/dtp-meos-server-edge` : `${getBaseUrl()}/dtp-meos-server`;
};

/** 将数字按千分位分节
 * @param {number} num - 要格式化的数字
 */
export const formatNumber = (num: number) => {
    if (!num && num !== 0) return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 电梯运行状态
export const ELEVATOR_STATUS_NAME = {
    onlineStatus: i18n.global.t('operation_duty_homepage.meos_home_online'),
    lockStatus: i18n.global.t('common.meos_home_the_ladder_is_unlocked'),
    runStatus: i18n.global.t('common.operation')
};
