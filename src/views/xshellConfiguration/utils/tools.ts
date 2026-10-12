// @ts-ignore
import i18n from '@/localization';
import { shellConfigSave } from '@/apis/xshellConfiguration';
import { ref } from 'vue';

import {
    ALG_COOLING_MATHINE_MIN_ENABLED,
    ALG_MODAL_CONFIG,
    ALG_COOL_OPEN_LIMIT,
    ALG_COOL_OPEN_LIMIT_INTERVAL,
    WEATHER_WEATHER_CHANGE,
    DEFAULT_EMPTY,
    ALG_SINGLE_SELECT_CODES,
    IS_SHIELD_OR_NOT_CODES,
    ALG_COLDHOT_ADD_AVERAGE,
    ALG_NO_DEFAULT_VALUE,
    EFFICIENCY_INPUT_RANGE,
    EFFICIENCY_INPUT_RANGE_LAST_DISABLE,
    OUTDOOR_WET_BULB_TEMP_CONFIG,
    ALG_COOL_ADD_WTDI_DURATION,
    GRAPH_ANIMATION_VISIBLE,
    GRAPH_ANIMATION_EFFECT,
    HALF_SECTION_VISIBILITY,
    VAL_SOURCE_JSON_ENUM,
    NO_UNIT_HALF_SECTION_VISIBILITY,
    FLOW_DEMAND_PARAM_FIELDS,
    VENT_JUDGE_MODE_CODES,
    isFlowDemandConfigItem,
    isMultipleCheckboxItem,
    SINGLE_SELECT_WITH_LAST_SAVED_DEFAULT_CODES
} from '../constants/constant';

const WEATHER_SERVICE = i18n.global.t('meos_control_web.weather_service');
const YES = i18n.global.t('meos_control_web.yes');
const NO = i18n.global.t('common.no');

const isJson = (value: string) => {
    try {
        JSON.parse(value);
        return true;
    } catch {
        return false;
    }
};

export const graphAnimationVisibleOptions = ref([
    {
        label: i18n.global.t('meos_control_web.show'),
        value: 'show'
    },
    {
        label: i18n.global.t('meos_control_web.hide'),
        value: 'hide'
    }
]);

export const graphAnimationEffectOptions = ref([
    {
        label: i18n.global.t('meos_control_web.ant_line'),
        value: 'antLine'
    },
    {
        label: i18n.global.t('meos_control_web.arrow'),
        value: 'arrow'
    }
]);

export const halfSectionVisibilityOptions = ref([
    {
        label: i18n.global.t('meos_control_web.show'),
        value: 'show'
    },
    {
        label: i18n.global.t('meos_control_web.hide'),
        value: 'hide'
    }
]);

const handleModalOpen = (item: any) => {
    const mulInstance = item?.mulInstance || [];
    const valArr = isJson(item?.shellConfigValue) ? JSON.parse(item?.shellConfigValue) : [];
    const validValArr = Array.isArray(valArr) ? valArr : [];
    if (!Array.isArray(item.defaultValues)) {
        item.originDefaultValues = structuredClone(item.defaultValues);
    }
    const defaultVal = item.originDefaultValues;

    const getSelectedIds = (instances: any[]) =>
        instances.map((element: any, index: number) => {
            const valItem = validValArr?.find((v: any) => (v?.objectId ?? v?.id) === element?.objectId)?.count;
            const itemKey = element?.objectId ? element?.objectId : new Date().toISOString() + index;
            return { key: itemKey, name: element.objectName, id: element?.objectId, count: valItem ?? defaultVal };
        });

    item.mulInstanceList = mulInstance.map((stance: any) => ({
        id: stance.objectId,
        name: stance.objectName
    }));

    const selectedIds = getSelectedIds(mulInstance);
    item.valueInputLeft = selectedIds;

    // 覆写原来的defaultValues
    item.defaultValues = structuredClone(selectedIds.map(v => ({ ...v, count: defaultVal })));
    item.defaultValueLeft = structuredClone(selectedIds.map(v => ({ ...v, count: defaultVal })));
};

const handleCoolOpenLimit = (item: any) => {
    const mulInstance = item?.mulInstance || [];
    const valArr = isJson(item?.value ?? item?.shellConfigValue) ? JSON.parse(item?.value ?? item?.shellConfigValue) : [];
    const isIntervalRule = ALG_COOL_OPEN_LIMIT_INTERVAL.includes(item.code);

    item.mulInstanceList = mulInstance.map((stance: any) => ({
        id: stance.objectId,
        name: stance.objectName
    }));

    const selectedIds = valArr;
    const curTimeKey = new Date().toISOString();
    // 默认展示一行
    const finalIds = selectedIds?.length
        ? selectedIds?.map((v: any) => {
              const { selected, countLimit, intervalTime, count } = v || {};
              const hasSelected = (selected?.length ?? 0) > 1;
              if (isIntervalRule) {
                  return { ...v, ...(intervalTime?.toString() ? { intervalTime } : {}) };
              }
              const normalizedCountLimit = countLimit ?? count;
              // 历史数据特殊处理：若最大开启数等于选中项，则清空
              return {
                  ...v,
                  countLimit: hasSelected && normalizedCountLimit === selected?.length ? undefined : normalizedCountLimit
              };
          })
        : [{ key: curTimeKey + 0 }];
    item.valueInputLeft = finalIds;

    if (ALG_NO_DEFAULT_VALUE.includes(item.code)) {
        item.defaultValues = [{ key: curTimeKey + 0 }];
        item.defaultValueLeft = [{ key: curTimeKey + 0 }];
    }
};

const handleSingleSelect = (item: any, finalItemValue?: any) => {
    const mulInstance = item?.mulInstance || [];
    // 选对象: objectId, objectName
    // 选信息点: infoCode,name
    // 选类型: code,name
    item.mulInstanceList = mulInstance.map((ins: any) => ({
        id: ins?.infoCode || ins?.code || ins?.objectId || ins?.value,
        name: ins?.name || ins?.objectName
    }));

    // 取值字段与其它 handler 保持一致：优先 shellConfigValue（formatterValue 已归一为 finalItemValue）
    const rawValue = finalItemValue ?? item?.shellConfigValue ?? item?.value;
    const selectedId = rawValue !== null && rawValue !== undefined && rawValue.toString() ? rawValue : undefined;
    // 无历史值时回退到参数默认值，与 handleDefault 对数值参数的处理语义一致
    const rawDefault = item?.defaultValues;
    const defaultValue = rawDefault !== null && rawDefault !== undefined && rawDefault.toString() ? rawDefault : undefined;

    item.valueLeft = selectedId;
    item.valueInputLeft = selectedId ?? defaultValue;

    if (ALG_NO_DEFAULT_VALUE.includes(item.code)) {
        // 无默认值：仅回显历史值，不套用默认值
        item.valueInputLeft = selectedId;
        item.defaultValues = undefined;
        item.defaultValueLeft = undefined;
    } else if (SINGLE_SELECT_WITH_LAST_SAVED_DEFAULT_CODES.includes(item.code)) {
        item.defaultValues = selectedId;
        item.defaultValueLeft = selectedId;
    } else if (defaultValue !== undefined) {
        // 有默认值：参与「恢复默认值」与取消回退
        item.defaultValues = defaultValue;
        item.defaultValueLeft = defaultValue;
    }
};

const SHIELD_OPTIONS = [
    {
        name: '屏蔽',
        id: 'true'
    },
    {
        name: '不屏蔽',
        id: 'false'
    }
];
const handleShieldOrNot = (item: any) => {
    item.mulInstanceList = SHIELD_OPTIONS;

    const selectedId = item?.value?.toString() ? item?.value : 'false';
    item.valueInputLeft = selectedId;

    item.defaultValues = 'false';
    item.defaultValueLeft = 'false';
};

const getStringVal = (val: any) => (isJson(val) && Array.isArray(JSON.parse(val)) ? JSON.parse(val) : val?.split(',')?.length ? val?.split(',') : []);
const safeToFixed = (value: any) => {
    const num = Number(value);
    if (Number.isNaN(num)) return null;
    // 显示格式化（保持一位小数显示）
    // return num.toLocaleString('en-US', {
    //     minimumFractionDigits: 1,
    //     maximumFractionDigits: 1
    // });
    return num;
};
const handleEfficiency = (item: any) => {
    const lastDisabled = EFFICIENCY_INPUT_RANGE_LAST_DISABLE.includes(item.code);
    const valArr = getStringVal(item?.shellConfigValue);

    const getEchoVal = (list: any) =>
        list.map((v: number | string, index: number, arr: any[]) => ({
            key: index,
            count: safeToFixed(v),
            disabledTips:
                index === 0
                    ? i18n.global.t('meos_control_web.lower_limit_not_editable')
                    : index === arr.length - 1 && lastDisabled
                    ? i18n.global.t('meos_control_web.upper_limit_readonly')
                    : '',
            errorTips: ''
        }));
    const echoValArr = getEchoVal(valArr);
    item.valueInputLeft = echoValArr;

    if (typeof item?.defaultValues === 'string') {
        const defaultValArr = getStringVal(item?.defaultValues);
        item.defaultValues = defaultValArr.map((v: any) => safeToFixed(v));
        item.defaultValueLeft = getEchoVal(defaultValArr);
    }
    item.lastDisabled = lastDisabled;
    if (lastDisabled) {
        item.names = [
            i18n.global.t('meos_control_web.needs_improvement'),
            i18n.global.t('meos_control_web.good'),
            i18n.global.t('meos_control_web.excellent'),
            i18n.global.t('meos_control_web.good'),
            i18n.global.t('meos_control_web.needs_improvement')
        ];
        item.colors = ['#f8766f', '#64A6F7', '#69cd90', '#64a6f7', '#f8766f'];
    }
};

const handleGraphData = (item: any) => {
    const finalItemValue = item?.shellConfigValue ?? item?.value;
    item.valueLeft = finalItemValue ?? item.defaultValues;
    item.valueInputLeft = finalItemValue ?? item.defaultValues;
    item.defaultValueLeft = item.defaultValues;
};

const handleHalfSectionVisibility = (item: any) => {
    // 半剖图显隐配置：后端直接下发 shellConfigValue（如 'show' / 'hide'）
    const finalItemValue = item?.shellConfigValue ?? item?.value;
    item.valueLeft = finalItemValue ?? item.defaultValues;
    item.valueInputLeft = finalItemValue ?? item.defaultValues;
    item.defaultValueLeft = item.defaultValues;
};

function convertValue(value: string): string {
    return value === WEATHER_SERVICE ? YES : NO;
}

const handleWeather = (item: any) => {
    const finalItemValue = item?.shellConfigValue ?? item?.value;
    item.valueLeft = finalItemValue ?? item.defaultValues;
    item.valueInputLeft = finalItemValue ?? item.defaultValues;
    item.defaultValueLeft = item.defaultValues;
    item.valueLeft = convertValue(item.valueLeft);
    item.valueInputLeft = convertValue(item.valueInputLeft);
    item.defaultValueLeft = convertValue(item.defaultValueLeft);
};

// 针对valSource的值进行映射
const handleHalfSectionEntry = (item: any, optionsKey: string) => {
    // 半剖图入口配置：后端使用 '1' / '2' 表示两种模式，前端需要映射为语义化值
    const raw = item?.shellConfigValue ?? item?.value ?? item.defaultValues;

    const mappedValue = (val: any) => val ?? '';
    item.valueLeft = mappedValue(raw);
    item.valueInputLeft = mappedValue(raw);
    // 默认值同样做一层映射，避免默认值与实际展示不一致
    item.defaultValueLeft = mappedValue(item.defaultValues);

    // 更新一些通用配置参数
    item.unit = formatUnitWithEmpty(item.unit);
    item.options = formatJsonValueToOptions(item[optionsKey]);
};

const formatJsonValueToOptions = (val: string) => {
    if (!isJson(val)) {
        return [];
    }
    const ops = JSON.parse(val);
    return Object.entries(ops).map(([key, value]) => ({
        label: value,
        value: key
    }));
};

const formatUnitWithEmpty = (unit: string) => {
    const emptyUnit = ['/'];
    if (emptyUnit.includes(unit)) {
        return '';
    }
    return unit;
};

const splitPairValue = (value: any) => {
    if (value == null) {
        return [];
    }
    return String(value).split(',');
};

const normalizePairSegment = (segment: any) => {
    if (segment == null) {
        return null;
    }
    // 兼容历史逻辑：''、'0'、0 等都按 0 处理
    // eslint-disable-next-line eqeqeq
    if (segment == 0) {
        return 0;
    }
    return isNaN(segment) ? segment : segment * 1;
};

const handleDefault = (item: any, finalItemValue: any) => {
    const [valueLeftRaw, valueRightRaw] = splitPairValue(finalItemValue);
    const [defaultLeftRaw, defaultRightRaw] = splitPairValue(item.defaultValues);

    item.valueLeft = normalizePairSegment(valueLeftRaw);
    item.valueRight = normalizePairSegment(valueRightRaw);
    item.defaultValueLeft = normalizePairSegment(defaultLeftRaw);
    item.defaultValueRight = normalizePairSegment(defaultRightRaw);

    item.valueInputLeft = item.valueLeft != null ? item.valueLeft : item.defaultValueLeft;
    item.valueInputRight = item.valueRight != null ? item.valueRight : item.defaultValueRight;
};

const handleCoolingUnableSameTimeCool = (item: any) => {
    const mulInstance = item.mulInstance ?? [];
    const selectedIds = mulInstance.filter((element: any) => element.select).map((element: any) => element.objectId);

    item.mulInstanceList = mulInstance.map((stance: any) => ({
        id: stance.objectId,
        name: stance.objectName
    }));

    item.valueInputLeft = selectedIds;
    item.defaultValues = selectedIds;
    item.defaultValueLeft = selectedIds;
};

const normalizeDefaultEmptyValue = (value: any, defaultValue: any) => {
    const primary = Number(value);
    if (!Number.isNaN(primary)) {
        return primary;
    }
    const fallback = Number(defaultValue);
    return Number.isNaN(fallback) ? null : fallback;
};

const handleDefaultEmptyLike = (item: any, finalItemValue: any) => {
    if (finalItemValue === '' && item.defaultValues === '') {
        item.valueLeft = null;
        item.valueInputLeft = null;
    } else if (DEFAULT_EMPTY.includes(item.code)) {
        const value = normalizeDefaultEmptyValue(finalItemValue, item.defaultValues);
        item.valueLeft = value;
        item.valueInputLeft = value;
    } else {
        const value = finalItemValue ?? item.defaultValues;
        item.valueLeft = value;
        item.valueInputLeft = value;
    }

    item.defaultValueLeft = item.defaultValues === '' ? null : item.defaultValues;
};

const handleOutDoorWetBulbTemp = (item: any) => {
    const valArr = getStringVal(item?.shellConfigValue);

    const getEchoVal = (list: any) =>
        list.map((v: number | string, index: number) => ({
            key: index,
            count: safeToFixed(v),
            disabledTips: '',
            errorTips: ''
        }));
    const echoValArr = getEchoVal(valArr);
    item.valueInputLeft = echoValArr;

    if (typeof item?.defaultValues === 'string') {
        const defaultValArr = getStringVal(item?.defaultValues);
        item.defaultValues = defaultValArr.map((v: any) => safeToFixed(v));
        item.defaultValueLeft = getEchoVal(defaultValArr);
    }
    item.names = [];
    item.colors = ['#64A6F7'];
};

const createEmptyFlowDemandRow = () => ({
    key: new Date().toISOString()
});

const getMulInstanceList = (mulInstance: any[] = []) =>
    mulInstance.map((ins: any) => ({
        // 选对象: objectId, objectName
        // 选信息点: infoCode,name
        // 选类型: code,name
        id: ins?.infoCode || ins?.code || ins?.objectId,
        name: ins?.name || ins?.objectName
    }));

const handleFlowDemandConfig = (item: any) => {
    const rawValue = item?.value ?? item?.shellConfigValue;
    item.mulInstanceList = getMulInstanceList(item?.mulInstance || []);
    const valArr = isJson(rawValue) ? JSON.parse(rawValue) : [];
    const finalRows = Array.isArray(valArr) && valArr.length ? valArr : [createEmptyFlowDemandRow()];
    item.valueInputLeft = finalRows.map((row: any, index: number) => ({
        ...row,
        key: row?.key || `${new Date().toISOString()}-${index}`
    }));
    item.defaultValues = [createEmptyFlowDemandRow()];
    item.defaultValueLeft = structuredClone(item.defaultValues);
};

const handleMultipleCheckboxConfig = (item: any) => {
    const rawValue = item?.value ?? item?.shellConfigValue;
    item.mulInstanceList = getMulInstanceList(item?.mulInstance || []);
    const valArr = isJson(rawValue) ? JSON.parse(rawValue) : typeof rawValue === 'string' ? rawValue?.split(',') : [];
    const finalRows = Array.isArray(valArr) && valArr.length ? valArr : [];
    item.valueInputLeft = finalRows;
    item.defaultValues = isJson(item.defaultValues) ? JSON.parse(item.defaultValues) : typeof item.defaultValues === 'string' ? item.defaultValues?.split(',') : [];
    item.defaultValueLeft = structuredClone(item.defaultValues);
};

type FormatterRuleHandler = (item: any, finalItemValue: any) => void;
type FormatterRule = {
    match: (code: string, item?: any) => boolean;
    handler: FormatterRuleHandler;
};

const GRAPH_ANIMATION_CODE_SET = new Set([...GRAPH_ANIMATION_VISIBLE, ...GRAPH_ANIMATION_EFFECT]);

const FORMATTER_RULES: FormatterRule[] = [
    {
        match: code => VAL_SOURCE_JSON_ENUM.includes(code),
        handler: item => handleHalfSectionEntry(item, 'valSource')
    },
    {
        match: code => EFFICIENCY_INPUT_RANGE.includes(code),
        handler: item => handleEfficiency(item)
    },
    {
        match: code => OUTDOOR_WET_BULB_TEMP_CONFIG.includes(code),
        handler: item => handleOutDoorWetBulbTemp(item)
    },
    {
        match: (_code, item) => isMultipleCheckboxItem(item),
        handler: item => handleMultipleCheckboxConfig(item)
    },
    {
        match: (_code, item) => isFlowDemandConfigItem(item),
        handler: item => handleFlowDemandConfig(item)
    },
    {
        match: code => ALG_MODAL_CONFIG.includes(code),
        handler: item => handleModalOpen(item)
    },
    {
        match: code => ALG_COOL_OPEN_LIMIT.includes(code),
        handler: item => handleCoolOpenLimit(item)
    },
    {
        match: code => ALG_SINGLE_SELECT_CODES.includes(code) || VENT_JUDGE_MODE_CODES.includes(code),
        handler: (item, finalItemValue) => handleSingleSelect(item, finalItemValue)
    },
    {
        match: code => IS_SHIELD_OR_NOT_CODES.includes(code),
        handler: item => handleShieldOrNot(item)
    },
    {
        match: code => GRAPH_ANIMATION_CODE_SET.has(code),
        handler: item => handleGraphData(item)
    },
    {
        match: code => HALF_SECTION_VISIBILITY.includes(code),
        handler: item => handleHalfSectionVisibility(item)
    },
    {
        match: code => code === 'alg_cooling_unable_same_time_cool',
        handler: item => handleCoolingUnableSameTimeCool(item)
    },
    {
        match: code => code === 'alg_cooling_machine_mix_enabled' || DEFAULT_EMPTY.includes(code),
        handler: (item, finalItemValue) => handleDefaultEmptyLike(item, finalItemValue)
    },
    {
        match: code => code === 'weather_weather_change',
        handler: item => handleWeather(item)
    }
];

const findFormatterHandler = (item: any): FormatterRuleHandler | undefined => {
    return FORMATTER_RULES.find(rule => rule.match(item?.code, item))?.handler;
};

const handleByCode = (item: any, finalItemValue: any) => {
    const handler = findFormatterHandler(item);
    if (handler) {
        handler(item, finalItemValue);
        return true;
    }
    return false;
};

export const formatterValue = (arr: any) => {
    if (!arr?.length) {
        return [];
    }

    return arr.map((item: any) => {
        const finalItemValue = item?.shellConfigValue ?? item?.value;
        // 给定一些通用数据的加工方式
        if (!handleByCode(item, finalItemValue)) {
            handleDefault(item, finalItemValue);
        }
        return item;
    });
};

// 更新
export const updateshellConfigSave = (type: string, data: any) => {
    const params = ref([] as any);
    data.map((item: any) => {
        item.paramsItem = [];
        item.items.map((child: any) => {
            // 范围输入组件处理
            if (EFFICIENCY_INPUT_RANGE.includes(child.code) || OUTDOOR_WET_BULB_TEMP_CONFIG.includes(child.code)) {
                child.submitVal = child.valueInputLeft?.map((row: any) => row?.count);
            }

            if (ALG_COOL_OPEN_LIMIT.includes(child.code) && Array.isArray(child.valueInputLeft)) {
                child.valueInputLeft = child.valueInputLeft?.filter((row: any) => row?.selected?.length);
            }
            const flowDemandSubmitVal = isFlowDemandConfigItem(child)
                ? (child.valueInputLeft || [])
                      .filter((row: any) => {
                          const hasSelected = (row?.selected?.length ?? 0) > 0;
                          const hasValue = FLOW_DEMAND_PARAM_FIELDS.some((field: string) => row?.[field] !== '' && row?.[field] !== null && row?.[field] !== undefined);
                          return hasSelected || hasValue;
                      })
                      .map((row: any) => {
                          const nextRow: Record<string, any> = {
                              key: row?.key || new Date().toISOString()
                          };
                          if ((row?.selected?.length ?? 0) > 0) {
                              nextRow.selected = row.selected;
                          }
                          FLOW_DEMAND_PARAM_FIELDS.forEach((field: string) => {
                              if (row?.[field] !== '' && row?.[field] !== null && row?.[field] !== undefined) {
                                  nextRow[field] = row[field];
                              }
                          });
                          return nextRow;
                      })
                : null;
            // eslint-disable-next-line eqeqeq
            if (child.code === 'alg_cooling_machine_mix_enabled') {
                // eslint-disable-next-line no-self-assign
                child.valueInputLeft = child.valueInputLeft;
            }
            if (child.code === 'weather_weather_change') {
                // eslint-disable-next-line no-self-assign
                child.valueInputLeft =
                    child.valueInputLeft === i18n.global.t('meos_control_web.yes')
                        ? i18n.global.t('meos_control_web.weather_service')
                        : i18n.global.t('meos_control_web.weather_station');
            }
            child.parentCode = item.group;
            item.paramsItem.push({
                code: child.code,
                value:
                    EFFICIENCY_INPUT_RANGE.includes(child.code) || OUTDOOR_WET_BULB_TEMP_CONFIG.includes(child.code)
                        ? child.submitVal.join(',')
                        : isFlowDemandConfigItem(child)
                        ? JSON.stringify(flowDemandSubmitVal)
                        : ALG_COOL_OPEN_LIMIT.includes(child.code) || ALG_MODAL_CONFIG.includes(child.code)
                        ? JSON.stringify(child.valueInputLeft)
                        : child.code === 'alg_cooling_unable_same_time_cool' && child.valueInputLeft?.length
                        ? child.valueInputLeft.join(',')
                        : [child.valueInputLeft, child.valueInputRight].filter(it => it !== '' && it !== null && it !== undefined).join(','),
                objectId: child.objectId,
                objectName: child.objectName
            });
        });
        params.value.push({
            group: item.group,
            items: item.paramsItem
        });
    });
    return shellConfigSave({
        scene: type,
        groups: params.value
    });
};

// 单个模块form校验
export const validate = (dom: any) => {
    return dom.value?.Mform.validate((valid: boolean) => {
        return valid;
    });
};

export const checkErrorStatus = (arr: any, valid: boolean, validStr: string) => {
    if (valid === false) {
        arr.map((item: any) => {
            if (item.id === validStr) {
                item.errorStatus = false;
            }
        });
    } else {
        arr.map((item: any) => {
            if (item.id === validStr) {
                item.errorStatus = true;
            }
        });
    }
};

// 恢复默认自Tips展示
export const defaultValueTips = (item: any) => {
    if (NO_UNIT_HALF_SECTION_VISIBILITY.includes(item.code)) {
        const optionsLabel = item.options.find((v: { value: string; label: string }) => v.value === item.defaultValueLeft)?.label;
        return i18n.global.t('meos_control_web.default_value_is', { val: optionsLabel });
    }

    if (VAL_SOURCE_JSON_ENUM.includes(item.code)) {
        const optionsLabel = item.options.find((v: { value: string; label: string }) => v.value === item.defaultValueLeft)?.label;
        return i18n.global.t('meos_control_web.default_value_is', { val: optionsLabel });
    }

    if (IS_SHIELD_OR_NOT_CODES.includes(item.code)) {
        const optionsLabel = Array.isArray(item.mulInstanceList) ? item.mulInstanceList.find((v: { id: string; name: string }) => v.id === item.defaultValueLeft)?.name : '';
        if (optionsLabel) {
            return i18n.global.t('meos_control_web.default_value_is', { val: optionsLabel });
        }
    }

    if (item.valueType === 'MULTIPLE') {
        return '';
    } else if (ALG_COOLING_MATHINE_MIN_ENABLED.includes(item.code) || WEATHER_WEATHER_CHANGE.includes(item.code)) {
        // 是否支持同时开启大小机
        return i18n.global.t('meos_control_web.default_value_is', { val: item.defaultValues });
    }
    if (GRAPH_ANIMATION_VISIBLE.includes(item.code) || GRAPH_ANIMATION_EFFECT.includes(item.code)) {
        // 关系图配置
        let curShowDefaultValue = '';
        if (GRAPH_ANIMATION_VISIBLE.includes(item.code)) {
            curShowDefaultValue = graphAnimationVisibleOptions.value.find(v => v?.value === item.defaultValues)?.label || '';
        } else {
            curShowDefaultValue = graphAnimationEffectOptions.value.find(v => v?.value === item.defaultValues)?.label || '';
        }
        return i18n.global.t('meos_control_web.default_value_is', { val: curShowDefaultValue });
    } else if (ALG_COLDHOT_ADD_AVERAGE.includes(item.code)) {
        return i18n.global.t('meos_control_web.default_value_left_right', {
            left: `${item.defaultValueLeft}${item.unit}`,
            right: `${item.defaultValueRight}${item.unit}`
        });
    } else {
        // eslint-disable-next-line eqeqeq
        if (item.defaultValues.split(',').length == 2) {
            // 两个input值
            //  判断加机的供水温度差值与持续时间字段, 左侧[温度]，右侧[固定0-1440min]
            if (ALG_COOL_ADD_WTDI_DURATION.includes(item.code)) {
                const rightUnit = 'min';
                // 后端返回的unit字段 由于历史原因可能有多个, 取第一个
                const leftUnit = item.unit?.split(',')?.[0] || item.unit;
                return i18n.global.t('meos_control_web.default_value_is', {
                    val: `${item.defaultValueLeft}${leftUnit}；${item.defaultValueRight}${rightUnit}`
                });
            }
            return i18n.global.t('meos_control_web.default_value_is', {
                val: `${item.defaultValueLeft}${item.unit}-${item.defaultValueRight}${item.unit}`
            });
        } else {
            if (item?.mulInstanceList?.length) {
                const curName = item.mulInstanceList.find((v: { id: string; name: string }) => v?.id === item?.defaultValueLeft)?.name || '';
                return i18n.global.t('meos_control_web.default_value_is', {
                    val: `${curName}${item.unit}`
                });
            }
            // 单个值
            return i18n.global.t('meos_control_web.default_value_is', {
                val: `${item.defaultValueLeft}${item.unit}`
            });
        }
    }
};

export const options = ref([
    {
        label: i18n.global.t('meos_control_web.yes'),
        value: i18n.global.t('meos_control_web.yes')
    },
    {
        label: i18n.global.t('common.no'),
        value: i18n.global.t('common.no')
    }
]);

export const weatherOptions = ref([
    {
        label: i18n.global.t('meos_control_web.weather_service'),
        value: i18n.global.t('meos_control_web.yes')
    },
    {
        label: i18n.global.t('meos_control_web.weather_station'),
        value: i18n.global.t('common.no')
    }
]);

export const runTimeOptions = ref([
    {
        label: i18n.global.t('meos_control_web.cumulative_operating_time'),
        value: 'accRunTime'
    },
    {
        label: i18n.global.t('meos_control_web.auto_control_cum_runtime'),
        value: 'autoCtrlAccRunTime'
    }
]);

/**
 * 解析 value 字段（如果是 JSON 字符串则解析）
 */
export const parseValue = (value: string) => {
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

export const formatConfigData = (data: any, callback: (item: any) => void) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return {};
    }
    // 遍历所有 groups
    data.forEach(item => {
        if (item?.groups && Array.isArray(item.groups)) {
            item.groups.forEach((group: any) => {
                if (group?.items && Array.isArray(group.items)) {
                    group.items.forEach((itemObj: any) => {
                        if (itemObj.code) {
                            callback(itemObj);
                        }
                    });
                }
            });
        }
    });
};
