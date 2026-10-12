export const sortMapByKey = (obj = []) => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
        throw new Error('Input should be an object');
    }

    return Object.keys(obj)
        .sort()
        .reduce((sortedObj, key) => {
            sortedObj[key] = obj[key];
            return sortedObj;
        }, {});
};

export const getNameWarpRect = (chartWarpDom, idPrefix, id) => {
    const fatherRect = chartWarpDom?.getBoundingClientRect();
    const dom = document.getElementById(`${idPrefix}${id}`);
    if (dom) {
        const rect = dom.getBoundingClientRect();
        let { top, left, width, height } = rect;
        if (fatherRect) {
            top = top - fatherRect.top;
            left = left - fatherRect.left;
        }
        return {
            top,
            left,
            width,
            height
        };
    }
    return null;
};
