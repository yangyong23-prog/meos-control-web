const EMPTY_VALUE = '--';
/**
 * 方法1：转换为number类型，四舍五入保留1位小数
 * @param val 待处理值（支持任意类型：数字/数字字符串/空值/非数字字符串等）
 * @returns 处理后的数字（固定保留1位小数，异常值返回--）
 */
export function formatTo1Decimal(val: unknown): number | string {
    // 步骤1：空值直接返回--（null/undefined/'' 统一处理）
    if (val === null || val === undefined || val === '') return EMPTY_VALUE;
    // 步骤2：转换为数字，非数字会转为NaN
    const num = Number(val);
    // 步骤3：校验是否为有效数字（排除NaN/Infinity/-Infinity）
    if (!isFinite(num)) return EMPTY_VALUE;
    // 步骤4：四舍五入保留1位小数（精准无浮点数精度坑）
    return Math.round(num * 10) / 10;
}

/**
 * 方法2：转换为number类型→乘以100→四舍五入保留1位小数
 * @param val 待处理值（支持任意类型：数字/数字字符串/空值/非数字字符串等）
 * @returns 处理后的数字（固定保留1位小数，异常值返回--）
 */
export function formatMul100To1Decimal(val: unknown): number | string {
    if (val === null || val === undefined || val === '') return EMPTY_VALUE;
    const num = Number(val);
    if (!isFinite(num)) return EMPTY_VALUE;
    // 先乘100，再按1位小数四舍五入
    return Math.round(num * 100 * 10) / 10;
}
