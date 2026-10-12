import i18n from '@/localization';
// 兼容Safari 浏览器
(function () {
    // 检测浏览器是否支持这种日期格式
    const testDate = new Date('2024.11.11');
    if (!isNaN(testDate.getTime())) {
        // 如果支持，直接退出，不需要 polyfill
        return;
    }

    // 覆盖原生 Date 构造函数
    const OriginalDate = Date;

    function PolyfilledDate(...args) {
        // 如果是没有参数或有效日期，直接调用原生 Date
        if (args.length !== 1 || typeof args[0] !== 'string') {
            return new OriginalDate(...args);
        }

        // 修复 Safari 不支持的日期格式（如 'YYYY.MM.DD'）
        const dateString = args[0].replace(/\./g, '-'); // 替换点号为短横线
        // 否则返回无效日期
        return new OriginalDate(dateString);
    }

    // 保留原型链
    PolyfilledDate.prototype = OriginalDate.prototype;
    PolyfilledDate.__proto__ = Date;
    // 替换全局 Date
    window.Date = PolyfilledDate;
})();
