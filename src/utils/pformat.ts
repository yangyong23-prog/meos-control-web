const toFixed = (value: any, le = 2) => {
    if (value === null || value === undefined) return '--';
    // eslint-disable-next-line radix
    if (parseInt(value, 10) === value) return value; //位数太长会有bug 1000000000000000000000
    return Number((Math.round(value * Math.pow(10, le)) / Math.pow(10, le)).toFixed(le));
};
export const mathFormat = { toFixed };
