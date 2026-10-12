import i18n from '@/localization';
import { isArray, isEmpty, isNil, toNumber } from 'lodash';
import DOMPurify from 'dompurify';
import { nanoid } from 'nanoid';

/**
 * 匹配文字并高亮
 * @param {String} name 原文本
 * @param {String} key 需要匹配的关键字
 * @param {String} color 高亮颜色 默认#246FE5
 * @returns String （html）返回一段html文本 使用时 v-html绑定
 */
export const nameMatch = (name, key, color = '#246FE5') => {
    if (name && key?.trim()) {
        // 双重防护：XSS净化 + 正则转义
        // 1. 净化输入
        const cleanKey = DOMPurify.sanitize(key.trim(), {
            ALLOWED_TAGS: [], // 禁止所有HTML标签
            ALLOWED_ATTR: [] // 禁止所有属性
        });
        // 2. 正则转义
        const escapedKey = cleanKey.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const reg = new RegExp(escapedKey, 'ig');
        const finalName = name.replace(reg, match => {
            // 额外输出转义（防御深层XSS）
            const safeMatch = match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<span style='color:${color};'>${safeMatch}</span>`;
        });
        return finalName;
    }
    return name;
};

export const nameAllMatch = (name, key, color = '#246FE5') => {
    if (name && key.trim()) {
        let arr = key.trim().split(''),
            html = '';
        arr = [...new Set(arr)].filter(el => el !== ' ');
        // 构建映射关系
        const map = {};
        arr.forEach(el => {
            // 取首字母ascii码可以用string.charCodeAt(0)。A-Z的ascii码：65-90，a-z的ascii码：97-122
            const sASC = el.charCodeAt();
            if ((sASC >= 65 && sASC <= 90) || (sASC >= 97 && sASC <= 122)) {
                map[el.toLowerCase()] = `<span style='color:${color};'>${el.toLowerCase()}</span>`;
                map[el.toUpperCase()] = `<span style='color:${color};'>${el.toUpperCase()}</span>`;
            } else {
                map[el] = `<span style='color:${color};'>${el}</span>`;
            }
        });
        // eslint-disable-next-line one-var
        let i = 0;
        while (i < name.length) {
            const char = name.charAt(i);
            if (map[char]) {
                html += map[char];
            } else {
                html += char;
            }
            i++;
        }
        return html;
    }
    return name;
};

// 将分钟转换为持续时长，小于1小时显示 "<1小时"，大于1小时，显示x天x小时，小时 四舍五入
export const durationTime = minutes => {
    if (minutes < 60) {
        return i18n.global.t('meos_control_web.less_than_one_hour');
    }
    const hours = Math.round(minutes / 60);
    const days = Math.floor(hours / 24);
    const dayStr = days > 0 ? i18n.global.t('meos_control_web.num_day', { num: days }, { plural: days }) : '';
    const hourStr = hours > 0 ? i18n.global.t('meos_control_web.num_hour', { num: hours % 24 }, { plural: hours % 24 }) : '';
    return `${dayStr}${hourStr}`;
};

// 异常事件风险等级
export const importanceDegree = item => {
    switch (item?.importanceDegree) {
        case 'HIGH':
            return { name: i18n.global.t('meos_control_web.high'), bgColor: '#FFE6E5', textColor: '#D72824' };
        case 'MEDIUM':
            return { name: i18n.global.t('common.mid'), bgColor: '#FFF0CC', textColor: '#E68600' };
        case 'LOW':
            return { name: i18n.global.t('meos_control_web.low'), bgColor: '#DAF7E1', textColor: '#0C9B4A' };
        default:
            return { name: i18n.global.t('meos_control_web.unknown'), bgColor: '#E8ECF0', textColor: '#1B2129' };
    }
};

/**
 * 获取值的字符串表示形式，支持数据源映射和数值格式化
 * @param {Object} data - 包含数据信息的对象
 * @param {Array} data.dataSource - 数据源数组，包含code和name属性
 * @param {Array} data.dataSources - 数据源数组的备选属性名
 * @param {string|number|Array} data.dataValue - 数据值
 * @param {number} data.scale - 数值精度，默认为1
 * @param {string} data.unit - 单位
 * @returns {Object} 返回包含html和text属性的对象
 * @returns {string} returns.html - HTML格式的字符串
 * @returns {string} returns.text - 纯文本格式的字符串
 */
export const getValueStr = data => {
    // 处理数据源映射逻辑：当存在数据源时，根据code匹配对应的name
    if (data?.dataSource?.length || data.dataSources?.length) {
        let str = '';
        const dataSource = data.dataSource || data.dataSources;
        dataSource.forEach(item => {
            if (data.dataValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (item.code === data.dataValue || toNumber(item.code) === toNumber(data.dataValue)) {
                    str = item.name;
                }
            }
        });
        return { html: `<span>${str || '--'}</span>`, text: str || '--' };
    }
    // 处理特殊数据格式逻辑：当dataValue为数组且infoCodeType为'RWD_OBJECT_DETAIL'时，拼接localName
    if (isArray(data.dataValue) && data.infoCodeType === 'RWD_OBJECT_DETAIL') {
        return data.dataValue.length ? { text: data.dataValue.map(item => item.localName).join('、') } : { text: '--' };
    }
    // 处理特殊数据格式逻辑：当dataValue为数组且infoCodeType为'RWD_OBJECT'时，拼接
    if (isArray(data.dataValue) && data.infoCodeType === 'RWD_OBJECT') {
        return data.dataValue.length ? { text: data.dataValue.join('、') } : { text: '--' };
    }
    // 处理特殊数据格式逻辑：当infoCodeType为'BASIC'时，返回dataValue
    if (data.infoCodeType === 'BASIC') {
        return { text: `${data.dataValue ?? '--'} ${data.unit || ''}` };
    }
    // 判断值是否为空的辅助函数
    const isEmptyFun = v => {
        return v === null || v === undefined || v === '' || v === '--' || v === false;
    };

    // 处理普通数值格式化逻辑：格式化数值并添加单位
    let value = !isEmptyFun(data.dataValue) ? data.dataValue : '--';
    if (value !== '--') {
        let oldValue = value;
        value = parseFloat(value).toFixed(data.scale || 1);
        value = isNaN(value) ? oldValue : value;
    }
    return {
        html: `<span class="value-text">${value}</span> <span class="value-unit">${data.unit || ''}</span>`,
        text: `${value} ${data.unit || ''}`
    };
};

/**
 * 与getValueStr类似，但值为空则返回--，不带单位
 * @param {*} data
 * @returns
 */
export const getStrNullWithDash = data => {
    // 判断值是否为空的辅助函数
    const isEmptyFun = v => {
        return v === null || v === undefined || v === '' || v === '--' || v === false;
    };
    // 处理数据源映射逻辑：当存在数据源时，根据code匹配对应的name
    if (data?.dataSource?.length || data.dataSources?.length) {
        let str = '';
        const dataSource = data.dataSource || data.dataSources;
        dataSource.forEach(item => {
            if (data.dataValue) {
                // eslint-disable-next-line no-restricted-syntax
                if (item.code === data.dataValue || toNumber(item.code) === toNumber(data.dataValue)) {
                    str = item.name;
                }
            }
        });
        return { html: `<span>${str || '--'}</span>`, text: str || '--' };
    }
    // 处理特殊数据格式逻辑：当dataValue为数组且infoCodeType为'RWD_OBJECT_DETAIL'时，拼接localName
    if (isArray(data.dataValue) && data.infoCodeType === 'RWD_OBJECT_DETAIL') {
        return data.dataValue.length ? { text: data.dataValue.map(item => item.localName).join('、') } : { text: '--' };
    }
    // 处理特殊数据格式逻辑：当dataValue为数组且infoCodeType为'RWD_OBJECT'时，拼接
    if (isArray(data.dataValue) && data.infoCodeType === 'RWD_OBJECT') {
        return data.dataValue.length ? { text: data.dataValue.join('、') } : { text: '--' };
    }
    // 处理特殊数据格式逻辑：当infoCodeType为'BASIC'时，返回dataValue
    if (data.infoCodeType === 'BASIC') {
        return { text: isEmptyFun(data.dataValue) ? '--' : `${data.dataValue ?? '--'} ${data.unit || ''}` };
    }

    // 处理普通数值格式化逻辑：格式化数值并添加单位
    if (isEmptyFun(data.dataValue)) {
        return { html: `<span class="value-text">--</span>  `, text: '--' };
    }
    let value = !isEmptyFun(data.dataValue) ? data.dataValue : '--';
    if (value !== '--') {
        let oldValue = value;
        value = parseFloat(value).toFixed(data.scale || 1);
        value = isNaN(value) ? oldValue : value;
    }
    return {
        html: `<span class="value-text">${value}</span> <span class="value-unit">${data.unit || ''}</span>`,
        text: `${value} ${data.unit || ''}`
    };
};

export const displayValue = count => {
    if (count > 0) {
        return count;
    } else if (count === 0) {
        return 0;
    } else {
        return '--';
    }
};

//  非0空值
export const viodExcludeZero = data => {
    return !data && data !== 0;
};

// 营业时间数组转换
export const formattedWorkTime = item => {
    if (!Array.isArray(item) || item.length === 0) {
        return '';
    }
    const result = item.join('、');
    return result === '00:00-23:59' ? i18n.global.t('meos_control_web.all_day') : result.replace('23:59', '24:00');
};

//递归过滤已存在的tree
export const filterTree = (tree, filterList) => {
    console.log(tree, 'tree');
    if (Array.isArray(tree)) {
        return tree
            .map(item => filterTree(item, filterList))
            .filter(Boolean)
            .filter(node => (node.children && node.children.length > 0) || !node.children);
    }
    if (filterList?.includes(tree.id || tree.funcType)) {
        return null;
    }
    const { localName, funcTypeName, funcType, ...rest } = tree;
    const newNode = { ...rest };
    // if (localName && localName !== undefined) {
    newNode.name = localName || '--';
    // }
    // if (funcTypeName && funcTypeName !== undefined) {
    if (funcType) {
        newNode.name = funcTypeName || '--';
    }
    // }
    if (funcType && funcTypeName !== undefined) {
        newNode.id = funcType;
    }
    if (newNode.children) {
        newNode.children = filterTree(newNode.children, filterList);
        //如果子节点children 只有一个且被过滤掉了  那么父节点也过滤
        if (!newNode?.children?.length) {
            delete newNode.children;
        }
    }
    return newNode || [];
};

//递归tree
export const findMatchingNodes = (tree, targets) => {
    const matches = [];
    tree.forEach(node => {
        if (targets.includes(node.id)) {
            matches.push(node);
        }
        if (node.children && node.children.length > 0) {
            const childMatches = findMatchingNodes(node.children, targets);
            matches.push(...childMatches);
        }
    });
    return matches;
};
//递归tree 过滤选中本身以外的数据
export const filterTreeFuc = (tree, selectedValue, filterArray) => {
    if (Array.isArray(tree)) {
        return tree.map(item => filterTreeFuc(item, selectedValue, filterArray)).filter(Boolean);
    }
    // 如果当前节点的值等于选中的值，不过滤该节点，继续处理其子节点
    if (tree.id === selectedValue) {
        if (tree.children) {
            tree.children = filterTreeFuc(tree.children, selectedValue, filterArray);
        }
        return tree;
    }
    // 如果当前节点的值在过滤数组中，过滤掉该节点
    if (filterArray.includes(tree.id)) {
        return null;
    }
    const { localName, funcTypeName, funcType, ...rest } = tree;
    const newNode = { ...rest };
    // if (localName && localName !== undefined) {
    newNode.name = localName || '--';
    // }
    // if (funcTypeName && funcTypeName !== undefined) {
    if (funcType) {
        newNode.name = funcTypeName || '--';
    }
    // }
    if (funcType && funcTypeName !== undefined) {
        newNode.id = funcType;
    }
    // 处理子节点
    if (newNode.children) {
        newNode.children = filterTreeFuc(newNode.children, selectedValue, filterArray);
        // 如果子节点过滤后为空，也过滤掉当前节点
        if (newNode.children.length === 0) {
            return null;
        }
    }
    return newNode;
};

const colorConfigMap = new Map();
export const setColorConfig = list => {
    colorConfigMap.clear();
    const arr = structuredClone(list);
    arr.forEach(item => {
        item.configValue = item.configValue ? item.configValue?.replace(/\n/g, '') : '{}';
        item.configValue = JSON.parse(item.configValue);
        item.priority = item.priority ? toNumber(item.priority) : 0;
        colorConfigMap.set(item.type + item.infoCode + item.dataValue, item);
    });
};

export const getColorConfig = ({ type = 'SYSTEM_INFO', infoCode, value, config = 'cellBackgroundColor', classCode = 'default' }) => {
    const data = colorConfigMap.get(type + infoCode + value) || {};
    const configValue = data.configValue || {};
    return { [config]: configValue[classCode || 'default'], priority: data.priority };
};

export const getInterveneStatusColorConfig = () => {
    return getColorConfig({ type: 'CUSTOM_INFO', infoCode: 'interveneStatus', value: '1' });
};

/**
 * 解析系统列表数据，将树形结构扁平化为一维数组
 * @param {Array} treeData - 树形结构的系统数据
 * @returns {Array} 扁平化的系统列表
 */
export const parseSystemList = treeData => {
    if (Array.isArray(treeData) && treeData.length > 0 && Array.isArray(treeData?.[0].children)) {
        let result = [];
        (treeData[0].children || []).forEach(outer => {
            const outerData = {
                isGroup: true,
                key: nanoid(),
                ...outer
            };
            result.push(outerData);
            (outer?.children || []).forEach(inner => {
                result.push({
                    isGroup: false,
                    key: nanoid(),
                    parent: outerData,
                    ...inner
                });
            });
        });
        return result;
    }
    return [];
};
