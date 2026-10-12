import { computed, toValue } from 'vue';

const DEFAULT_DYNAMIC_SHOW_CONFIG = Object.freeze({
    show: true,
    emptyMsg: ''
});

export default function useDynamicFieldVisibility({ dataList, dynamicShowHandlerConfig }) {
    const getDataList = () => toValue(dataList) || [];
    const getHandlerConfig = () => toValue(dynamicShowHandlerConfig) || {};

    // 统一按字段编码查找当前表单项，供外部联动规则复用。
    const getFieldByCode = code => {
        return getDataList().find(item => item.code === code);
    };

    // 将外部配置归一化为稳定结构，避免模板层处理多种返回类型。
    const resolveDynamicShowConfig = item => {
        const handler = getHandlerConfig()?.[item.code];
        if (!handler) {
            return DEFAULT_DYNAMIC_SHOW_CONFIG;
        }

        const config = handler({
            item,
            dataList: getDataList(),
            getField: getFieldByCode,
            getValue: code => getFieldByCode(code)?.valueInputLeft
        });

        if (config === false) {
            return {
                ...DEFAULT_DYNAMIC_SHOW_CONFIG,
                show: false
            };
        }

        if (config === true || !config) {
            return DEFAULT_DYNAMIC_SHOW_CONFIG;
        }

        return {
            show: config?.show ?? true,
            emptyMsg: config?.emptyMsg ?? ''
        };
    };

    // 预先计算每个字段的显隐结果，模板层按 code 直接读取即可。
    const dynamicShowConfigMap = computed(() => {
        return Object.fromEntries(getDataList().map(item => [item.code, resolveDynamicShowConfig(item)]));
    });

    const getDynamicShowConfig = item => {
        return dynamicShowConfigMap.value[item.code] || DEFAULT_DYNAMIC_SHOW_CONFIG;
    };

    return {
        DEFAULT_DYNAMIC_SHOW_CONFIG,
        getFieldByCode,
        resolveDynamicShowConfig,
        dynamicShowConfigMap,
        getDynamicShowConfig
    };
}
