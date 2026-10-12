/* eslint-disable camelcase */
import { formatterValue } from '../../utils/tools';

interface SectionBinding {
    tabDataKey?: string;
    tabsListKey?: string;
    tabOnKey?: string;
    dataKey: string;
    errorKey: string;
    hasTabs: boolean;
}

export const snakeToPascal = (value: string) =>
    value
        .split('_')
        .map(v => v.charAt(0).toUpperCase() + v.slice(1))
        .join('');

// 二级 tab 数据列表格式化，兼容实例维度与五级分类维度。
export const objectTabs = (data: any[] = [], index?: number): any => {
    const params = {
        arr: [] as any[],
        tabData: [] as any[],
        tabOn: '',
        tabList: [] as any[],
        errorData: [] as any[]
    };

    data.forEach((code: any) => {
        if (code.tabObjectName) {
            params.arr.push({
                id: code.tabObjectName,
                name: code.tabObjectName
            });
        } else if (code.objectId) {
            params.arr.push({
                id: code.objectId,
                name: code.objectName
            });
        }
    });

    if (params.arr.length) {
        params.tabList = [...new Set(params.arr.map((obj: any) => JSON.stringify(obj)))].map((str: any) => JSON.parse(str));
        params.tabOn = params.tabList[0].id;
        const initTabData = formatterValue(data).filter((item: any) => {
            if (item.tabObjectName) {
                return item.tabObjectName === params.tabOn;
            }
            // eslint-disable-next-line eqeqeq
            return item.objectId == params.tabOn;
        });
        const groupByObjectId = Object.groupBy(initTabData, (res: any) => res?.objectId);
        Object.entries(groupByObjectId).forEach(([, value]) => {
            const firstValueItem = value?.[0];
            if (firstValueItem?.tabObjectName && firstValueItem?.objectName) {
                firstValueItem.tabInstanceTitle = firstValueItem?.objectName;
            }
        });

        params.tabData = Object.values(groupByObjectId).flat();
        params.errorData = params.tabList.map((item: any) => ({
            id: `${index}-${item.id}`,
            errorStatus: true
        }));
    }

    return params;
};

// tab6 (ACAC: 空调冷热源自动需求计算条件输入) 动态分发配置。
export const ACAC_SETCTION_CONFIG = [
    { groupKey: 'group_alg_cooling_condition', stateKey: 'supply_cool' },
    { groupKey: 'group_alg_cool_store_condition', stateKey: 'storage_cool' },
    { groupKey: 'group_alg_cool_release_condition', stateKey: 'release_cool' },
    { groupKey: 'group_alg_cool_free_condition', stateKey: 'cool_free' },
    { groupKey: 'group_alg_common_condition', stateKey: 'common_condition' },
    { groupKey: 'group_alg_acac_cold_out_temp', stateKey: 'cold_out' },
    { groupKey: 'group_alg_acac_temp_press_diff', stateKey: 'temp_press' },
    { groupKey: 'group_alg_acac_diff', stateKey: 'pump_temp_press' },
    { groupKey: 'group_alg_acac_freq', stateKey: 'control_group_freq' },
    { groupKey: 'group_alg_out_wet_ball_temp', stateKey: 'out_wet_ball_temp' }
];

export const ACAC_SECTION_STATE_BINDING: Record<string, SectionBinding> = {
    supply_cool: {
        tabDataKey: 'second_tab_alg_supply_cool_tab_Data',
        tabsListKey: 'second_tab_alg_supply_cool_tabs_list',
        tabOnKey: 'second_tab_alg_supply_cool_tab_on',
        dataKey: 'supplyCoolData',
        errorKey: 'supplyCoolErrorData',
        hasTabs: true
    },
    storage_cool: {
        tabDataKey: 'second_tab_alg_storage_cool_tab_Data',
        tabsListKey: 'second_tab_alg_storage_cool_tabs_list',
        tabOnKey: 'second_tab_alg_storage_cool_tab_on',
        dataKey: 'storageCoolData',
        errorKey: 'storageCoolErrorData',
        hasTabs: true
    },
    release_cool: {
        tabDataKey: 'second_tab_alg_release_cool_tab_Data',
        tabsListKey: 'second_tab_alg_release_cool_tabs_list',
        tabOnKey: 'second_tab_alg_release_cool_tab_on',
        dataKey: 'releaseCoolData',
        errorKey: 'releaseCoolErrorData',
        hasTabs: true
    },
    cool_free: {
        tabDataKey: 'second_tab_alg_cool_free_tab_Data',
        tabsListKey: 'second_tab_alg_cool_free_tabs_list',
        tabOnKey: 'second_tab_alg_cool_free_tab_on',
        dataKey: 'freeCoolData',
        errorKey: 'freeCoolErrorData',
        hasTabs: true
    },
    common_condition: {
        tabDataKey: 'second_tab_alg_common_condition_tab_Data',
        tabsListKey: 'second_tab_alg_common_condition_tabs_list',
        tabOnKey: 'second_tab_alg_common_condition_tab_on',
        dataKey: 'commonConditionData',
        errorKey: 'commonConditionErrorData',
        hasTabs: true
    },
    cold_out: {
        tabDataKey: 'second_tab_alg_cold_out_tab_Data',
        tabsListKey: 'second_tab_alg_cold_out_tabs_list',
        tabOnKey: 'second_tab_alg_cold_out_tab_on',
        dataKey: 'coldOutData',
        errorKey: 'coldOutErrorData',
        hasTabs: true
    },
    temp_press: {
        tabDataKey: 'second_tab_alg_temp_press_tab_Data',
        tabsListKey: 'second_tab_alg_temp_press_tabs_list',
        tabOnKey: 'second_tab_alg_temp_press_tab_on',
        dataKey: 'tempPressData',
        errorKey: 'tempPressErrorData',
        hasTabs: true
    },
    pump_temp_press: {
        tabDataKey: 'second_tab_alg_pump_temp_press_tab_Data',
        tabsListKey: 'second_tab_alg_pump_temp_press_tabs_list',
        tabOnKey: 'second_tab_alg_pump_temp_press_tab_on',
        dataKey: 'pumpTempPressData',
        errorKey: 'pumpTempPressErrorData',
        hasTabs: true
    },
    control_group_freq: {
        tabDataKey: 'second_tab_alg_control_group_freq_tab_Data',
        tabsListKey: 'second_tab_alg_control_group_freq_tabs_list',
        tabOnKey: 'second_tab_alg_control_group_freq_tab_on',
        dataKey: 'controlGroupFreqData',
        errorKey: 'controlGroupFreqErrorData',
        hasTabs: true
    },
    out_wet_ball_temp: {
        dataKey: 'outWetBallTempData',
        errorKey: 'outWetBallTempErrorData',
        hasTabs: false
    }
};

const ACAC_GROUP_MAP = Object.fromEntries(ACAC_SETCTION_CONFIG.map(item => [item.groupKey, item]));

// tab8 (ACAI) 动态分发配置：groupKey 临时使用二级分类英文翻译占位值。
export const ACAI_SECTION_CONFIG = [
    { groupKey: 'group_alg_cooling_unit_num', stateKey: 'cooling_unit_count' },
    { groupKey: 'group_alg_cooling_supply_temp', stateKey: 'cooling_supply_temp' },
    { groupKey: 'group_alg_cooling_safe_run', stateKey: 'cooling_safe' },
    { groupKey: 'group_alg_cooling_temp_press_diff', stateKey: 'cooling_temp_press_diff' },
    { groupKey: 'group_alg_cooling_pump_diff', stateKey: 'cooling_pump_diff' },
    { groupKey: 'group_alg_cooling_switch_set', stateKey: 'heating_switch' },
    { groupKey: 'group_alg_cooling_unit_num_hot', stateKey: 'heating_unit_count' },
    { groupKey: 'group_alg_cooling_safe_run_hot', stateKey: 'heating_safe' },
    { groupKey: 'group_alg_cooling_supply_temp_hot', stateKey: 'heating_supply_temp' },
    { groupKey: 'group_alg_cooling_temp_press_diff_hot', stateKey: 'heating_temp_press_diff' },
    { groupKey: 'group_alg_cooling_pump_diff_hot', stateKey: 'heating_pump_diff' },
    { groupKey: 'group_alg_cooling_common_condition', stateKey: 'common_condition' }
];

const ACAI_GROUP_MAP = Object.fromEntries(ACAI_SECTION_CONFIG.map(item => [item.groupKey, item]));

// 通用模块需要对象实例的分组：冷站/控制组频率约束
export const COMMON_NEED_OBJECT_ID_GROUPS = ['group_alg_accc_freq'];
// 空调冷源需要对象实例的分组：控制组频率约束
const ACAC_NEED_OBJECT_ID_GROUPS = ['group_alg_acac_freq'];

// 空调冷热源需要对象实例的分组：供冷台数计算-供冷模式 、台式计算-供热模式 、通用工况
const ACAI_NEED_OBJECT_ID_GROUPS = ['group_alg_cooling_unit_num', 'group_alg_cooling_unit_num_hot', 'group_alg_cooling_common_condition'];

export const fillAcacSectionData = (item: any, algParamsAny: any) => {
    const acacGroup = ACAC_GROUP_MAP[item.group];
    if (!acacGroup) {
        return false;
    }
    const { stateKey } = acacGroup;
    const binding = ACAC_SECTION_STATE_BINDING[stateKey];
    if (!binding) {
        return false;
    }

    const tabItems = ACAC_NEED_OBJECT_ID_GROUPS.includes(item.group) ? item.items?.filter((v: any) => !!v?.objectId) : item.items;
    const formattedItems = formatterValue(item.items);

    if (binding.hasTabs && binding.tabDataKey) {
        const tabs = objectTabs(tabItems, 6);
        algParamsAny[binding.tabDataKey] = formattedItems;
        algParamsAny[binding.tabsListKey!] = tabs.tabList;
        algParamsAny[binding.tabOnKey!] = tabs.tabOn;
        algParamsAny[binding.dataKey] = tabs.tabData;
        algParamsAny[binding.errorKey] = tabs.errorData;
        return true;
    }

    algParamsAny[binding.dataKey] = formattedItems;

    return true;
};

export const fillAcaiSectionData = (item: any, algParamsAny: any) => {
    const acaiGroup = ACAI_GROUP_MAP[item.group];
    if (!acaiGroup) {
        return false;
    }
    const { stateKey } = acaiGroup;
    const pascal = snakeToPascal(stateKey);
    const tabItems = ACAI_NEED_OBJECT_ID_GROUPS.includes(item.group) ? item.items?.filter((v: any) => !!v?.objectId) : item.items;
    const tabs = objectTabs(tabItems, 8);
    algParamsAny[`acai_${stateKey}_tab_Data`] = formatterValue(item.items);
    algParamsAny[`acai_${stateKey}_tabs_list`] = tabs.tabList;
    algParamsAny[`acai_${stateKey}_tab_on`] = tabs.tabOn;
    algParamsAny[`acai${pascal}Data`] = tabs.tabData;
    algParamsAny[`acai${pascal}ErrorData`] = tabs.errorData;
    return true;
};

export const resetDynamicSectionData = (algParamsAny: any) => {
    ACAC_SETCTION_CONFIG.forEach(section => {
        const binding = ACAC_SECTION_STATE_BINDING[section.stateKey];
        if (!binding) {
            return;
        }

        if (binding.tabDataKey) {
            algParamsAny[binding.tabDataKey] = [];
        }
        if (binding.tabsListKey && binding.tabOnKey) {
            algParamsAny[binding.tabsListKey] = [];
            algParamsAny[binding.tabOnKey] = '';
        }
        algParamsAny[binding.dataKey] = [];
        algParamsAny[binding.errorKey] = [];
    });

    ACAI_SECTION_CONFIG.forEach(section => {
        const { stateKey } = section;
        const pascal = snakeToPascal(stateKey);
        algParamsAny[`acai_${stateKey}_tab_Data`] = [];
        algParamsAny[`acai_${stateKey}_tabs_list`] = [];
        algParamsAny[`acai_${stateKey}_tab_on`] = '';
        algParamsAny[`acai${pascal}Data`] = [];
        algParamsAny[`acai${pascal}ErrorData`] = [];
    });
};

export const formatSecondTabData = (allData: any[] = [], params: any): any => {
    const curTabList = allData?.filter((v: any) => v?.tabObjectName === params?.id) || [];
    const groupByObjectId = Object.groupBy(curTabList, (res: any) => res?.objectId);

    Object.entries(groupByObjectId).forEach(([, value]) => {
        const firstValueItem = value?.[0];
        if (firstValueItem?.tabObjectName && firstValueItem?.objectName) {
            firstValueItem.tabInstanceTitle = firstValueItem?.objectName;
        }
    });

    if (curTabList?.length) {
        return Object.values(groupByObjectId).flat();
    }

    return allData?.filter((item: any) => item.objectId === params.id);
};
