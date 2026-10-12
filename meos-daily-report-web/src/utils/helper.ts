/**
 * 乾坤微前端工具函数
 */

// 获取 qiankun window 对象
export const qiankunWindow: any = typeof window !== 'undefined' ? (window as any).proxy || window : {};

// 渲染乾坤生命周期函数
export const renderWithQiankun = (qiankunLifeCycle: any) => {
    console.log('qiankunWindow:', qiankunWindow);
    // eslint-disable-next-line no-underscore-dangle
    if (qiankunWindow?.__POWERED_BY_QIANKUN__) {
        if (!(window as any).moudleQiankunAppLifeCycles) {
            (window as any).moudleQiankunAppLifeCycles = {};
        }
        (window as any).moudleQiankunAppLifeCycles = qiankunLifeCycle;
    }
};
