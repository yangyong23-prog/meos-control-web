const responsiveBdtpInfo = () => {
    const bdtpInfoMap = ref({});
    const getKey = (classCode, code) => {
        return classCode + '&&' + code;
    };
    const setBdtpInfoData = (classCode, code, data) => {
        if (classCode && code) {
            bdtpInfoMap.value[getKey(classCode, code)] = data;
        }
    };
    const getBdtpInfoData = (classCode, code) => {
        if (classCode && code) {
            return _getBdtpInfoData(classCode, code);
        }
        return {};
    };
    const _getBdtpInfoData = (classCode, code) => {
        if (!bdtpInfoMap.value[getKey(classCode, code)]) bdtpInfoMap.value[getKey(classCode, code)] = {};
        const bdtpInfo = bdtpInfoMap.value[getKey(classCode, code)];
        return bdtpInfo;
    };
    const clearAllBdtpInfoMap = () => {
        bdtpInfoMap.value = {};
    };
    const clearOneBdtpInfoMap = (classCode, code) => {
        if (bdtpInfoMap.value[getKey(classCode, code)]) {
            delete bdtpInfoMap.value[getKey(classCode, code)];
        }
    };
    return { setBdtpInfoData, getBdtpInfoData, clearAllBdtpInfoMap, clearOneBdtpInfoMap };
};

const BdtpInfoSingleton = (function () {
    let singletonInstance;
    return {
        getInstance: function () {
            if (!singletonInstance) {
                singletonInstance = responsiveBdtpInfo();
            }
            return singletonInstance;
        }
    };
})();

export default BdtpInfoSingleton;
