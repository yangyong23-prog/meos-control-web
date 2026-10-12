export const getValueTextByInfoObject = infoObject => {
    if (!infoObject?.ipValue && infoObject.ipValue !== 0) {
        return '--';
    }
    const val = infoObject.ipValue;
    if (infoObject.dataSource) {
        // eslint-disable-next-line eqeqeq
        const target = infoObject.dataSource.find(t => t.code == val);
        if (target) {
            return target.name;
        }
    }
    return val + '' || '--';
};
