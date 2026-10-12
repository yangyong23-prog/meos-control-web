import { getDynamicIotRulesList } from '@/apis/xshellConfiguration';
import { AIR_TERMINAL, GeneralZone, GRID, IOT_RUNNING, SUCCESSCODE } from '@/utils/globalVariables';

const isJson = value => {
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
};

const parseValue = value => {
    if (!value) return value;
    if (isJson(value)) {
        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn('Failed to parse value:', error);
            return value;
        }
    }
    return value;
};

const getIotConditionOptions = arr => {
    return arr
        .map(v => {
            const configs = v?.groupChildren?.[0]?.relInfoCodeConfigs || [];
            const finalOptions =
                configs
                    ?.filter(config => {
                        const hasLabel = config?.infoCode && (config?.aliasName || config?.infoCodeName);
                        const showStyle = parseValue(config?.showStyle);
                        const canShellConfigured = showStyle?.canShellConfigured;
                        return hasLabel && canShellConfigured;
                    })
                    ?.map(config => ({
                        id: config.infoCode,
                        name: config.aliasName ?? config?.infoCodeName
                    })) || [];
            return {
                code: v?.groupCode,
                name: configs?.[0]?.aliasName ?? configs?.[0]?.infoCodeName,
                options: finalOptions
            };
        })
        .filter(v => !!v?.code && !!v?.name && Array.isArray(v?.options) && v.options.length);
};

export default () => {
    const iotConditionOptions = ref([]);
    const iotTemplateConfigList = ref([]);

    const getIOTRuleOptions = () => {
        // 环境参数动态规则,配置表的配置
        getDynamicIotRulesList({
            runningMonitorType: AIR_TERMINAL,
            templateTypes: [GRID],
            classCodes: [GeneralZone],
            infoCodeTypes: [IOT_RUNNING, 'DEMAND_TARGET_TYPE']
        }).then(res => {
            if (res?.code === SUCCESSCODE) {
                const arr = res?.data?.[0]?.relInfoCodeGroupConfigs || [];
                const options = getIotConditionOptions(arr);
                iotConditionOptions.value = Array.isArray(options) ? options : [];
                iotTemplateConfigList.value = Array.isArray(arr) ? arr : [];
            }
        });
    };

    // 环境参数壳配置历史值只接受数组结构，异常数据统一回退为空数组。
    const getParsedEnvironmentConfig = value => {
        const parsedValue = parseValue(value);
        return Array.isArray(parsedValue) ? parsedValue : [];
    };

    // 只保留当前动态规则中仍存在的信息点；
    // 没有该环境项时默认全选；只要存在该环境项，就尊重已保存结果，包括空数组
    const getEnvironmentSelectedIds = (savedItem, optionIds) => {
        if (!savedItem) {
            return optionIds;
        }

        const savedIds = getParsedEnvironmentConfig(savedItem.value).filter(id => optionIds.includes(id));
        return savedIds;
    };
    return {
        iotConditionOptions,
        iotTemplateConfigList,
        getIOTRuleOptions,
        getEnvironmentSelectedIds
    };
};
