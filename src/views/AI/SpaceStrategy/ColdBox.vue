<template>
    <div class="cold-box wh100">
        <div class="cold-box-title fc">{{ system.localName }}，{{ i18n.global.t('meos_control_web.future_strategy_shows_changes_only') }}</div>
        <div class="cold-box-table">
            <m-table :columns="columns" :data-source="tableData" :column-line="true" style="height: 100%" :cell-class-name-fn="cellClassNameFn" :merge-method="mergeMethod">
                <template v-for="item in slotList" #[item]="data">
                    {{ handleData(data, item) }}
                </template>
            </m-table>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';
import _, { isEmpty, isNil, isObject, orderBy, round } from 'lodash';
import { currentSystemKey, infoCodesAllMapKey, chillerCodeDefineKey } from '../hooks/useStaticData';
import { getInfoCodeUniqueKey } from '../utils';
import i18n from '@/localization';
import { getDayjsTz } from '@/utils/globalVariables';
import { templateConfigsKey } from '../hooks/useTemplateConfig';
import { GET_CHILLER_UNIT } from '../variable';

const system = inject(currentSystemKey);

const props = defineProps({
    selectData: {
        type: Object,
        default: () => ({})
    },
    showMain: {
        type: Boolean,
        default: true
    }
});
const infoCodesAllMap = inject(infoCodesAllMapKey);
const chillerCodeDefine = inject(chillerCodeDefineKey);
const templateConfigs = inject(templateConfigsKey);

const infoCodeMap = new Map();
const fromKeys = new Set();

const stgyCSDetail = computed(() => {
    const arr = structuredClone(props.selectData.stgyCSDetail || []);
    const _fromKeys = Array.from(fromKeys);
    arr.forEach(item => {
        _fromKeys.forEach(key => {
            if (item[key] && isObject(item[key])) {
                const keys = Object.keys(item[key]);
                keys.forEach(k => {
                    item[k] = item[key][k];
                });
            }
            delete item[key];
        });
    });
    return arr;
});
const tableData = ref([]);
const slotList = ref([]);
const columns = ref([]);
/**
 * 深度比较两个对象的值是否相等
 * @param {any} value1 - 第一个值
 * @param {any} value2 - 第二个值
 * @returns {boolean} 是否相等
 */
function deepEqual(value1, value2) {
    // 基本类型比较
    if (value1 === value2) return true;

    // null 或 undefined 比较
    if (value1 == null || value2 == null) return value1 === value2;

    // 类型不同直接返回 false
    if (typeof value1 !== typeof value2) return false;

    // 对象类型比较
    if (typeof value1 === 'object') {
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (!keys2.includes(key) || !deepEqual(value1[key], value2[key])) {
                return false;
            }
        }
        return true;
    }

    return false;
}

/**
 * 比较两个数据对象，找出不同的字段
 * @param {Object} currentData - 当前时刻数据
 * @param {Object} previousData - 前一时刻数据
 * @param {string[]} excludeFields - 需要排除比较的字段（如time）
 * @returns {string[]} 不同字段的数组
 */
function findDifferentFields(currentData, previousData, excludeFields = ['time']) {
    const differentFields = [];

    // 获取所有需要比较的字段
    const allFields = new Set([...Object.keys(currentData), ...Object.keys(previousData)]);

    // 排除不需要比较的字段
    const fieldsToCompare = Array.from(allFields).filter(field => !excludeFields.includes(field));

    fieldsToCompare.forEach(field => {
        const currentValue = currentData[field];
        const previousValue = previousData[field];

        if (!deepEqual(currentValue, previousValue)) {
            differentFields.push(field);
        }
    });

    return differentFields;
}

/**
 * 过滤策略数据，移除与前一时刻完全相同的数据点
 * @param {Array} strategyData - 原始策略数据数组
 * @param {string[]} excludeFields - 比较时需要排除的字段
 * @returns {Array} 处理后的数据数组，包含highlightFields属性
 */
function processStrategyData(strategyData, excludeFields = ['time']) {
    if (!Array.isArray(strategyData) || strategyData.length === 0) {
        return [];
    }

    const processedData = [];

    strategyData.forEach((currentItem, index) => {
        // 第一个数据点始终保留
        if (index === 0) {
            processedData.push({
                ...currentItem,
                highlightFields: [] // 第一个时刻没有高亮字段
            });
            return;
        }

        const previousItem = strategyData[index - 1];
        const differentFields = findDifferentFields(currentItem, previousItem, excludeFields);

        // 如果有字段不同，则保留该数据点并标记高亮字段
        if (differentFields.length > 0) {
            processedData.push({
                ...currentItem,
                highlightFields: differentFields
            });
        }
        // 如果所有字段都相同，则跳过该数据点（不添加到结果数组中）
    });

    return processedData;
}
const setProcessedData = data => {
    data.forEach(item => {
        for (const key in item) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
                if (key !== 'time' && key !== 'highlightFields') {
                    item[key] = {
                        name: getName(key),
                        key: key,
                        value: item[key],
                        unit: getUnit(key),
                        nameMap: getNameMap(key)
                    };
                }
            }
        }
    });
};
const getName = (code, name) => {
    const infoCodeItem = infoCodesAllMap.value.get(getInfoCodeUniqueKey(system.value.classCode, code));
    return infoCodeItem?.name || chillerCodeDefine.value?.[system.value.classCode]?.[code]?.name || infoCodeMap.get(code)?.name || name || code;
};
const getUnit = code => {
    const infoCodeItem = infoCodesAllMap.value.get(getInfoCodeUniqueKey(system.value.classCode, code));
    return infoCodeItem?.unit || infoCodeMap.get(code)?.unit || '';
};
const getOrder = code => {
    const infoCodeItem = infoCodesAllMap.value.get(getInfoCodeUniqueKey(system.value.classCode, code));
    return infoCodeItem?.order ?? chillerCodeDefine.value?.[system.value.classCode]?.[code]?.order ?? 0;
};
const getNameMap = code => {
    const infoCodeItem = infoCodesAllMap.value.get(getInfoCodeUniqueKey(system.value.classCode, code));
    const dataSource = infoCodeItem?.dataSource || chillerCodeDefine.value?.[system.value.classCode]?.[code]?.dataSource || [];
    const dataSources = infoCodeItem?.dataSources || chillerCodeDefine.value?.[system.value.classCode]?.[code]?.dataSources || [];
    const arr = dataSources.length ? dataSources : dataSource;
    let nameMap = null;
    if (arr.length) {
        nameMap = {};
    }
    arr.forEach(item => {
        nameMap[item.code + ''] = item.name;
    });
    return nameMap;
};
const setTableData = list => {
    let values = Array.from(infoCodeMap.values());
    values = orderBy(values, ['parentId', 'order'], ['asc']);
    const data = values.map(item => {
        const obj = {
            name: getName(item.id),
            parentName: infoCodeMap.get(item.id)?.parentName || '',
            key: item.id,
            list
        };
        return obj;
    });
    return data;
};
const handleData = (data, time) => {
    const timeObj = data.list.find(item => dayjs(item.time).format('HH:mm') === time);

    const timeObjValue = timeObj?.[data.key] || {};
    let value = timeObjValue?.value;
    if (isObject(value)) {
        const small = value.small || value.SMALL;
        const large = value.large || value.LARGE;
        const m1 = value.m1 || value.M1;
        const L = large !== undefined && large !== null;
        const M1 = m1 !== undefined && m1 !== null;
        const S = small !== undefined && small !== null;
        if (L && M1 && S) {
            return i18n.global.t('common.large_mid_small', {
                big: large,
                mid: m1,
                sm: small
            });
        }
        if (L && M1 && !S) {
            return i18n.global.t('common.large_mid', {
                big: large,
                mid: m1
            });
        }
        if (L && S) {
            return i18n.global.t('common.large_small', {
                big: large,
                sm: small
            });
        }
        return `${large}${GET_CHILLER_UNIT(data.key)}`;
    }
    if (timeObjValue?.nameMap) {
        return timeObjValue?.nameMap[value];
    }

    value = !isNil(value) ? round(value, 1) : value;

    return (value ?? '--') + (timeObjValue.unit ? ` ${timeObjValue.unit}` : '');
};
const cellClassNameFn = (row, col) => {
    const timeObj = row.list.find(item => dayjs(item.time).format('HH:mm') === col.dataIndex);
    const arr = [];
    if (col.initSort === 0 && col.parent?.initSort === 1) {
        arr.push('text-black');
    }
    if (timeObj?.highlightFields && timeObj?.highlightFields.includes(row.key)) {
        arr.push('highlight-cell');
    }
    return arr;
};
/**
 * 生成表格列配置
 * @param {Array} processedData - 处理后的数据
 * @returns {Array} 表格列配置数组
 */
function generateTableColumns(processedData = []) {
    const times = [dayjs(stgyCSDetail.value[0].time).format('MM.DD'), getDayjsTz().add(1, 'day').format('MM.DD')];
    const columnsData = [];
    times.forEach(item => {
        const column = {
            title: i18n.global.t('meos_control_web.strategy_content', {
                item: item
            }),
            children: []
        };
        const arr = processedData.filter(v => dayjs(v.time).format('MM.DD') === item);
        if (arr.length) {
            // 基础列配置
            const baseColumns = arr.map(item => ({ dataIndex: dayjs(item.time).format('HH:mm'), title: dayjs(item.time).format('HH:mm') }));
            column.children.push(...baseColumns);
            columnsData.push(column);
        }
    });
    return columnsData;
}
const state = {};
const sapn = [{ keys: ['parentName'], index: [0] }];
// 处理数据，判断是否需要合并，处理数据
function getSpanArr(data) {
    sapn.forEach((item, index) => {
        state[`spanArr${index}`] = [];
        for (let i = 0; i < data.length; i++) {
            if (i === 0) {
                state[`spanArr${index}`].push(1);
                state.pos = 0;
            } else {
                // 判断当前元素与上一个元素是否相同
                const strs = item.keys.map(e => `data[i].${e} === data[i - 1].${e}`);
                // eslint-disable-next-line no-eval
                if (eval(strs.join(' && '))) {
                    state[`spanArr${index}`][state.pos] += 1;
                    state[`spanArr${index}`].push(0);
                } else {
                    state[`spanArr${index}`].push(1);
                    state.pos = i; // 上次操作的下标记录
                }
            }
        }
    });
}
function mergeMethod(row, col, rowIndex, colIndex) {
    for (let index = 0; index < sapn.length; index++) {
        const item = sapn[index];
        if (item.index.indexOf(colIndex) !== -1) {
            const rowMergeMethod = state[`spanArr${index}`][rowIndex];
            const colMergeMethod = rowMergeMethod > 0 ? 1 : 0;
            return {
                rowspan: rowMergeMethod,
                colspan: colMergeMethod
            };
        }
    }
    return {
        rowspan: 1,
        colspan: 1
    };
}
const init = () => {
    columns.value = [
        {
            dataIndex: 'parentName',
            title: i18n.global.t('meos_control_web.category'),
            fixed: 'left',
            width: 210
        },
        {
            dataIndex: 'name',
            title: i18n.global.t('meos_control_web.strategy_item'),
            fixed: 'left',
            width: 210
        }
    ];
    slotList.value = [];
    tableData.value = [];
    // 处理数据，移除与前一时刻完全相同的数据点
    const processedData = processStrategyData(stgyCSDetail.value);
    setProcessedData(processedData);
    slotList.value = processedData.map(item => dayjs(item.time).format('HH:mm'));
    tableData.value = setTableData(processedData);
    getSpanArr(tableData.value);

    columns.value.push(...generateTableColumns(processedData));
};
onMounted(() => {
    const stgyCSDetail = props.selectData.stgyCSDetail || [];
    const keySet = new Set();
    stgyCSDetail.forEach(dataPoint => {
        const keys = Object.keys(dataPoint);
        keys.forEach(k => {
            if (isObject(dataPoint[k])) {
                const keys1 = Object.keys(dataPoint[k]);
                keys1.forEach(k1 => {
                    keySet.add(k1);
                });
            } else {
                keySet.add(k);
            }
        });
    });
    templateConfigs.value.mpcFinalStrategySelection?.forEach((category, index) => {
        category.items.forEach(item => {
            item.id = item.field;
            if (item.type) {
                stgyCSDetail.forEach(dataPoint => {
                    if (dataPoint[item.field] && isObject(dataPoint[item.field])) {
                        const keys = Object.keys(dataPoint[item.field]);
                        keys.forEach(k => {
                            keySet.has(k) && infoCodeMap.set(k, { id: k, parentName: getName(category.id, category.name), parentId: index, order: getOrder(k) });
                        });
                    }
                });
                fromKeys.add(item.field);
            } else {
                keySet.has(item.id) && infoCodeMap.set(item.id, { ...item, parentName: getName(category.id, category.name), parentId: index });
            }
        });
    });
    init();
});
</script>
<style lang="less" scoped>
.cold-box {
    padding: 16px 24px;
    &-title {
        height: 22px;
        color: var(--gray-600);
        margin-bottom: 10px;
    }
    &-table {
        height: calc(100% - 32px);
        :deep(.meri-table-element-td) {
            color: var(--gray-400);
            &.text-black {
                color: var(--gray-900);
            }
            &.highlight-cell {
                background-color: var(--gray-200);
                color: var(--gray-900);
            }
        }
    }
}
</style>
