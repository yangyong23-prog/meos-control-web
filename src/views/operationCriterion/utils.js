export const transformTimesToView = (list = []) => {
    const result = list?.map(v => {
        const startTime = v?.beginTime?.absoluteTime;
        const endTime = v?.endTime?.absoluteTime;
        const newValue = startTime?.slice(0, 5) + '-' + endTime?.slice(0, 5);
        return newValue;
    });
    return result;
};
